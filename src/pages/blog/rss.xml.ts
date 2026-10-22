/**
 * RSS feed of every blog post, newest first. Replaces Squarespace's
 * /blog?format=rss, which netlify.toml (Netlify) and worker/index.ts (Cloudflare) redirect here.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../../data/site';

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
  const blogUrl = new URL('/blog', site.url).href;

  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.id}`, site.url).href;
      return `    <item>
      <title>${xml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xml(post.data.description)}</description>
      <dc:creator>${xml(post.data.author)}</dc:creator>
      <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog | ${xml(site.name)}</title>
    <link>${blogUrl}</link>
    <atom:link href="${blogUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Insights on branding, design, and creativity to help your business stand out online.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date(Math.max(...posts.map((p) => p.data.updatedDate.valueOf()))).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
