/**
 * Form submissions: POST /api/forms/<name>, sent by src/components/forms/SiteForm.astro.
 *
 * 1. Drops honeypot hits and checks the Cloudflare Turnstile token.
 * 2. Validates every answer against the form's definition in src/data/ (the
 *    same field list the page renders from), so the browser can't be trusted
 *    to have done it.
 * 3. Emails the answers (and any files, as attachments) via Resend, with
 *    Reply-To set to the person who submitted.
 * 4. Optionally forwards the answers to FORM_WEBHOOK_URL (e.g. a Zapier hook).
 *
 * The browser asks for JSON; a plain no-JavaScript post (which can't pass
 * Turnstile) gets a short HTML page pointing to email instead.
 */
import { FILE_LIMITS, type Field, type SiteForm } from '../src/data/forms';
import { siteForms } from '../src/data/siteForms';
import { site } from '../src/data/site';

export interface FormEnv {
  /** Secret: Resend API key. */
  RESEND_API_KEY?: string;
  /** Secret: Turnstile secret key. */
  TURNSTILE_SECRET_KEY?: string;
  /** Secret (optional): forwards submissions of forms with `webhook: true`. */
  FORM_WEBHOOK_URL?: string;
  /** Sender, e.g. "Electric Collab Website <forms@electriccollab.com>". */
  FORM_FROM?: string;
  /** "true" logs the email instead of sending it (local testing). */
  FORM_EMAIL_DRY_RUN?: string;
}

interface Context {
  waitUntil(promise: Promise<unknown>): void;
}

type Answer = { label: string; value: string };

const MAX_TEXT = 10_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class FormError extends Error {}

export async function handleForm(request: Request, env: FormEnv, ctx: Context, name: string): Promise<Response> {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const form = siteForms[name];
  if (!form) return reply(wantsJson, 404, 'Form not found.');
  if (request.method !== 'POST') return reply(wantsJson, 405, 'Method not allowed.');

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return reply(wantsJson, 400, 'Could not read the form.');
  }

  // Bots that fill the hidden field get a normal-looking success.
  if (String(data.get('bot-field') ?? '')) return reply(wantsJson, 200, 'ok');

  if (!(await verifyTurnstile(env, String(data.get('cf-turnstile-response') ?? ''), request.headers.get('CF-Connecting-IP')))) {
    return reply(wantsJson, 403, 'Spam check failed.');
  }

  let answers: Answer[];
  let files: File[];
  try {
    ({ answers, files } = readAnswers(form, data));
  } catch (error) {
    if (error instanceof FormError) return reply(wantsJson, 422, error.message);
    throw error;
  }

  const email = String(data.get('Email') ?? '').trim();
  const sender = answers.find((a) => a.label === 'Name')?.value || email;

  try {
    await sendEmail(env, form, answers, files, sender, email);
  } catch (error) {
    console.error(`[forms] ${form.name}: email failed`, error);
    return reply(wantsJson, 502, 'Could not send the form.');
  }

  if (form.webhook && env.FORM_WEBHOOK_URL) {
    ctx.waitUntil(forward(env.FORM_WEBHOOK_URL, form, answers, data, files));
  }

  return reply(wantsJson, 200, 'ok');
}

async function verifyTurnstile(env: FormEnv, token: string, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('[forms] TURNSTILE_SECRET_KEY is not set');
    return false;
  }
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const outcome = (await result.json()) as { success: boolean; 'error-codes'?: string[] };
  if (!outcome.success) console.warn('[forms] Turnstile rejected a submission', outcome['error-codes']);
  return outcome.success;
}

/** Checks each field against its definition and returns the answers in form order. */
function readAnswers(form: SiteForm, data: FormData): { answers: Answer[]; files: File[] } {
  const answers: Answer[] = [];
  const files: File[] = [];
  const text = (key: string) => {
    const value = String(data.get(key) ?? '').trim();
    if (value.length > MAX_TEXT) throw new FormError(`${key} is too long.`);
    return value;
  };
  const need = (field: Field, ok: boolean) => {
    if (field.required && !ok) throw new FormError(`${field.label} is required.`);
  };

  for (const field of form.fields) {
    switch (field.type) {
      case 'name': {
        const value = [text('First name'), text('Last name')].filter(Boolean).join(' ');
        need(field, Boolean(text('First name') && text('Last name')));
        answers.push({ label: field.label, value });
        break;
      }
      case 'checkbox':
      case 'radio':
      case 'select': {
        const chosen = data.getAll(field.name).map(String).filter(Boolean);
        if (chosen.some((c) => !field.options.includes(c))) throw new FormError(`${field.label} has an unknown option.`);
        if (field.type !== 'checkbox' && chosen.length > 1) throw new FormError(`${field.label} takes one answer.`);
        need(field, chosen.length > 0);
        answers.push({ label: field.label, value: chosen.join(', ') });
        break;
      }
      case 'file': {
        const chosen = data.getAll(field.name).filter((f): f is File => f instanceof File && f.size > 0);
        if (chosen.length > (field.maxFiles ?? 1)) throw new FormError(`${field.label}: too many files.`);
        if (chosen.some((f) => f.size > FILE_LIMITS.perFile)) throw new FormError(`${field.label}: a file is too large.`);
        need(field, chosen.length > 0);
        files.push(...chosen);
        answers.push({ label: field.label, value: chosen.map((f) => f.name).join(', ') || '' });
        break;
      }
      default: {
        const value = text(field.name);
        need(field, Boolean(value));
        if (field.type === 'email' && value && !EMAIL_RE.test(value)) throw new FormError(`${field.label} is not valid.`);
        answers.push({ label: field.label, value });
      }
    }
  }
  if (files.reduce((sum, f) => sum + f.size, 0) > FILE_LIMITS.total) throw new FormError('Attachments are too large.');
  return { answers, files };
}

async function sendEmail(env: FormEnv, form: SiteForm, answers: Answer[], files: File[], sender: string, replyTo: string) {
  const message = {
    from: env.FORM_FROM || `${site.name} Website <onboarding@resend.dev>`,
    to: form.notify.to,
    reply_to: EMAIL_RE.test(replyTo) ? replyTo : undefined,
    subject: `${form.notify.subject}: ${sender}`.slice(0, 200),
    text: answers.map((a) => `${a.label}\n${a.value || '—'}`).join('\n\n'),
    html: emailHtml(form, answers),
    attachments: await Promise.all(files.map(async (f) => ({ filename: f.name, content: toBase64(await f.arrayBuffer()) }))),
  };

  if (env.FORM_EMAIL_DRY_RUN === 'true') {
    console.log('[forms] dry run, not sending:', JSON.stringify({ ...message, attachments: files.map((f) => `${f.name} (${f.size} bytes)`) }, null, 2));
    return;
  }
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

function emailHtml(form: SiteForm, answers: Answer[]): string {
  const rows = answers
    .map(
      (a) =>
        `<p style="margin:0 0 4px;font-weight:bold">${escapeHtml(a.label)}</p>` +
        `<p style="margin:0 0 20px;white-space:pre-wrap">${a.value ? escapeHtml(a.value) : '—'}</p>`,
    )
    .join('');
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#40080d">${rows}<p style="margin:24px 0 0;font-size:12px;color:#777">Sent from a form on ${escapeHtml(site.url.replace('https://', ''))}. Reply to this email to respond to them.</p></div>`;
}

/** Sends the answers (not the files) as labeled JSON; failures are logged, not surfaced. */
async function forward(url: string, form: SiteForm, answers: Answer[], data: FormData, files: File[]) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form: form.name,
        submittedAt: new Date().toISOString(),
        firstName: String(data.get('First name') ?? '').trim(),
        lastName: String(data.get('Last name') ?? '').trim(),
        email: String(data.get('Email') ?? '').trim(),
        answers: Object.fromEntries(answers.map((a) => [a.label, a.value])),
        attachments: files.map((f) => f.name),
      }),
    });
    if (!response.ok) console.error(`[forms] webhook returned ${response.status}`);
  } catch (error) {
    console.error('[forms] webhook failed', error);
  }
}

function reply(wantsJson: boolean, status: number, message: string): Response {
  if (wantsJson) return Response.json(status === 200 ? { ok: true } : { ok: false, error: message }, { status });
  const ok = status === 200;
  const body = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${ok ? 'Thank you' : 'Form not sent'} | ${site.name}</title><body style="font-family:Arial,Helvetica,sans-serif;max-width:36rem;margin:4rem auto;padding:0 16px;color:#40080d;line-height:1.5"><main><h1>${ok ? 'Thank you!' : 'Your form wasn’t sent'}</h1><p>${ok ? 'We’ll be in touch soon.' : `This form needs JavaScript to protect against spam. Please enable JavaScript and try again, or email <a href="mailto:${site.founder.email}">${site.founder.email}</a>.`}</p><p><a href="/">Back to ${site.name}</a></p></main></body></html>`;
  return new Response(body, { status: ok ? 200 : status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
