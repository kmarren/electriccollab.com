// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical production origin (matches the live Squarespace site).
  site: 'https://www.electriccollab.com',

  // Squarespace serves every page without a trailing slash (e.g. /about).
  // Emitting `about.html` instead of `about/index.html` lets Netlify's Pretty
  // URLs serve identical paths, preserving existing links and search rankings.
  // Legacy-URL redirects (e.g. /home → /) live in netlify.toml as true 301s.
  trailingSlash: 'never',
  build: {
    format: 'file',
  },

  markdown: {
    // Blog posts are migrated verbatim; Squarespace kept straight quotes and
    // apostrophes as typed, so don't convert them to curly ones.
    smartypants: false,
  },

  devToolbar: {
    enabled: false,
  },

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  integrations: [
    sitemap({
      // Utility pages that should never be indexed.
      filter: (page) => !page.endsWith('/thank-you'),
    }),
  ],
});
