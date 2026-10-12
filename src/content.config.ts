import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Portfolio case studies. One Markdown file per project in src/content/portfolio/;
 * the filename is the URL slug (/portfolio/<slug>), matching the live site.
 *
 * Each entry carries the homepage card, the /portfolio tile and (once
 * migrated) the case-study page content in `caseStudy`. Every live case study
 * uses the same four-section template; only media, copy and grid placement
 * differ, so placement is stored as Squarespace grid areas ("row/col/row/col").
 */

/** A block's grid placement, desktop and mobile, plus optional stacking. */
const area = z.object({
  desktop: z.string(),
  mobile: z.string(),
  z: z.object({ desktop: z.number(), mobile: z.number() }).optional(),
});
const rows = z.object({ mobile: z.number().int(), desktop: z.number().int() });
const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: ({ image }) =>
    z.object({
      /** Position in the Squarespace collection; drives Previous/Next links. */
      order: z.number().int().positive(),
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
      /** Present for projects shown on the /portfolio index (two tiles per row). */
      index: z
        .object({
          order: z.number().int().positive(),
          /** Caption exactly as on the live page (uppercase, non-breaking spaces kept). */
          caption: z.string(),
          cover: image(),
          coverPosition: z.string().default('50% 50%'),
          /** The live page sets one caption in the body face and one in black; kept as-is. */
          captionStyle: z.enum(['label', 'body']).default('label'),
          captionColor: z.enum(['burgundy', 'black']).default('burgundy'),
        })
        .optional(),
      /** Case-study page content. Absent = page not migrated yet (placeholder). */
      caseStudy: z
        .object({
          seoDescription: z.string().optional(),
          hero: z.object({
            rows,
            /** Looping background video (path under /public, no extension). */
            video: z.string(),
            videoSize: z.tuple([z.number(), z.number()]),
            /** Opacity the video is shown at over burgundy (Squarespace video filter). */
            videoOpacity: z.number(),
            logo: image(),
            logoAlt: z.string(),
            logoArea: area,
          }),
          intro: z.object({
            rows,
            /** Heading lines (rendered with line breaks between them). */
            heading: z.array(z.string()),
            quote: z.string(),
            link: z.object({ label: z.string(), href: z.url() }).optional(),
            textArea: area,
            images: z.array(z.object({ src: image(), alt: z.string(), area, position: z.string().optional() })),
          }),
          videos: z.object({
            rows,
            items: z.array(z.object({ src: z.string(), size: z.tuple([z.number(), z.number()]), area })),
          }),
          closing: z.object({
            rows,
            images: z.array(z.object({ src: image(), alt: z.string(), area, position: z.string().optional() })),
          }),
        })
        .optional(),
    }),
});

export const collections = { portfolio };
