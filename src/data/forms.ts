/**
 * Shapes for the site's forms (see src/components/forms/SiteForm.astro, and
 * worker/forms.ts, which receives submissions on Cloudflare).
 *
 * A field's `name` is the key a submission arrives under; the notification
 * email lists each answer under its `label`. `description` is the smaller help
 * text Squarespace shows under a label.
 */
type Base = { label: string; required: boolean; description?: string };

export type Field =
  | ({ type: 'name' } & Base)
  | ({ type: 'email' | 'text' | 'website'; name: string; placeholder?: string } & Base)
  | ({ type: 'textarea'; name: string } & Base)
  /** `spacing: 'radio'` keeps radio-button row spacing on a checkbox list. */
  | ({ type: 'checkbox' | 'radio'; name: string; options: string[]; spacing?: 'radio' } & Base)
  | ({ type: 'select'; name: string; placeholder: string; options: string[] } & Base)
  /** Up to `maxFiles` files (default 1); size limits are in FILE_LIMITS. */
  | ({ type: 'file'; name: string; maxFiles?: number } & Base);

export interface SiteForm {
  /** URL-safe id: submissions post to /api/forms/<name>. */
  name: string;
  submitLabel: string;
  /** Submit button color: red (contact) or burgundy (Electric Evolution). */
  submitColor?: 'red' | 'burgundy';
  /** After a successful send: go to a page, or replace the form with a message. */
  success: { path: string } | { message: string };
  /** Shown above the form if sending fails. */
  failureMessage: string;
  /** Notification email. The sender's name is appended to the subject. */
  notify: { to: string[]; subject: string };
  /** Also send the answers to the FORM_WEBHOOK_URL secret (e.g. a Zapier hook), if set. */
  webhook?: boolean;
  fields: Field[];
}

/**
 * Attachment limits, shared by the browser check and the server. Files are
 * attached to the notification email, so the total stays well under the
 * email service's 40 MB message limit (attachments grow ~33% when encoded).
 */
export const FILE_LIMITS = { perFile: 10 * 1024 * 1024, total: 25 * 1024 * 1024 };
