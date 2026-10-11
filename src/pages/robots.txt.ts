/**
 * robots.txt — crawling is blocked unless PUBLIC_ALLOW_INDEXING=true.
 *
 * The Astro site is reviewed on a Netlify preview domain while the Squarespace
 * site stays live; letting search engines index that copy would create
 * duplicate content. Set PUBLIC_ALLOW_INDEXING=true in Netlify only when the
 * custom domain is switched over.
 */
import type { APIRoute } from 'astro';
import { allowIndexing } from '../lib/indexing';

export const GET: APIRoute = ({ site }) => {
  const body = allowIndexing
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
