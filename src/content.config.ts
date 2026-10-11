import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Portfolio case studies. One Markdown file per project in src/content/portfolio/;
 * the filename is the URL slug (/portfolio/<slug>), matching the live site.
 *
 * Case-study body content is migrated in a later phase. For now each entry
 * carries the data the homepage work grid needs.
 */
const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: ({ image }) =>
    z.object({
      /** Project name as used on the case-study page. */
      title: z.string(),
      /** Optional subtitle shown after the name on the live portfolio index. */
      subtitle: z.string().optional(),
      /**
       * Present only for projects featured in the homepage work grid.
       * Card copy differs slightly from `title` on the live site, so it is kept separately.
       */
      homepage: z
        .object({
          order: z.number().int().positive(),
          title: z.string(),
          category: z.string(),
          cover: image(),
          /** CSS object-position (focal point) for the cropped cover. */
          coverPosition: z.string().default('50% 50%'),
          coverAlt: z.string().default(''),
        })
        .optional(),
    }),
});

export const collections = { portfolio };
