/**
 * Cloudflare Worker in front of the static site. It only runs for /blog
 * (see `run_worker_first` in wrangler.jsonc); every other request is served
 * straight from the static assets.
 *
 * Squarespace served the blog feed at /blog?format=rss. Cloudflare's
 * _redirects file can't match query strings, so that redirect lives here to
 * keep existing subscribers (Netlify does the same via netlify.toml).
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/blog' && url.searchParams.get('format') === 'rss') {
      return Response.redirect(`${url.origin}/blog/rss.xml`, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
