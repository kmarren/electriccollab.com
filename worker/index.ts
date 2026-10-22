/**
 * Cloudflare Worker in front of the static site. It only runs for /blog and
 * /api/* (see `run_worker_first` in wrangler.jsonc); every other request is
 * served straight from the static assets.
 */
import { handleForm, type FormEnv } from './forms';

interface Env extends FormEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
    const url = new URL(request.url);

    // Squarespace served the blog feed at /blog?format=rss. Cloudflare's
    // _redirects file can't match query strings, so that redirect lives here to
    // keep existing subscribers (Netlify does the same via netlify.toml).
    if (url.pathname === '/blog' && url.searchParams.get('format') === 'rss') {
      return Response.redirect(`${url.origin}/blog/rss.xml`, 301);
    }

    const form = url.pathname.match(/^\/api\/forms\/([a-z0-9-]+)$/);
    if (form) return handleForm(request, env, ctx, form[1]);

    return env.ASSETS.fetch(request);
  },
};
