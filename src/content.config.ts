import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Portfolio case studies. One Markdown file per project in src/content/portfolio/;
 * the filename is the URL slug (/portfolio/<slug>), matching the live site.
 *
 * Each entry carries the homepage card, the /portfolio tile and (once
 * migrated) the case-study page content in `caseStudy`. Case studies share a
 * loose template (video hero, sticky intro beside images, screen recordings,
 * closing images) but vary per project, so each page is stored as its list of
 * sections and blocks, placed with Squarespace grid areas ("row/col/row/col").
 */

const align = z.enum(['start', 'center', 'end']);
const rows = z.object({ mobile: z.number().int(), desktop: z.number().int() });

/**
 * Grid placement shared by every case-study block: CSS grid areas
 * ("row/col/row/col") per breakpoint, stacking order and vertical alignment,
 * exactly as on the live Squarespace layout. Same shape as <FluidItem> props.
 */
const placement = {
  desktop: z.string(),
  mobile: z.string(),
  z: z.union([z.number(), z.object({ desktop: z.number(), mobile: z.number() })]).default(1),
  align: z.union([align, z.object({ desktop: align, mobile: align })]).default('center'),
  /** Desktop only: the block sticks this many px below the top while its section scrolls. */
  sticky: z.number().optional(),
};

/** Looping silent video: path under /public without extension, plus its encoded size. */
const video = { src: z.string(), size: z.tuple([z.number(), z.number()]) };

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
      /**
       * Case-study page content, as the live page's sections in order.
       * Absent = page not migrated yet (placeholder).
       */
      caseStudy: z
        .object({
          seoDescription: z.string().optional(),
          sections: z.array(
            z.object({
              rows,
              rowGap: z.number().default(11),
              columnGap: z.number().default(11),
              /** Inset sections sit on a colored panel 4vw in from the page edges. */
              inset: z.boolean().default(false),
              /** Panel color for inset sections (others are always light). */
              theme: z.enum(['light', 'dark']).default('light'),
              /** Squarespace "medium" section height: ≥ 66vh with 6.6vmax padding. */
              height: z.enum(['custom', 'medium']).default('custom'),
              /** Background video filling the section (or its inset panel). */
              video: z
                .object({
                  ...video,
                  /** Opacity over the panel color (Squarespace video filter strength). */
                  opacity: z.number().default(1),
                  playbackRate: z.number().default(1),
                })
                .optional(),
              blocks: z
                .array(
                  z.discriminatedUnion('type', [
                    /** Rich text, already converted to site markup (see CaseStudy.astro for classes). */
                    z.object({ type: z.literal('text'), html: z.string(), ...placement }),
                    z.object({
                      type: z.literal('image'),
                      src: image(),
                      alt: z.string(),
                      fit: z.enum(['cover', 'contain']).default('cover'),
                      /** CSS object-position (focal point). */
                      position: z.string().optional(),
                      href: z.string().optional(),
                      ...placement,
                    }),
                    z.object({
                      type: z.literal('video'),
                      ...video,
                      /**
                       * Block has no aspect ratio set, so Squarespace shows the video
                       * letterboxed in its default 7:11 player frame.
                       */
                      defaultFrame: z.boolean().default(false),
                      ...placement,
                    }),
                  ]),
                )
                .default([]),
            }),
          ),
        })
        .optional(),
    }),
});

export const collections = { portfolio };
