# electriccollab.com

Astro rebuild of [electriccollab.com](https://www.electriccollab.com), migrated from Squarespace.
This is a faithful migration, not a redesign. See [AGENTS.md](AGENTS.md) for project goals and rules.

**Status:** every page on the live site is migrated: homepage, "our services" (`/electric-brand-experience`), "our work" (`/portfolio`) and all 21 case studies, "the studio" (`/about`), contact (`/contact` + `/thank-you`), the blog (`/blog`, 17 posts, RSS at `/blog/rss.xml`), The Briefing (`/the-briefing`), the Electric Evolution portal and terms (both noindex), and the privacy policy and terms & conditions. Pre-launch QA against the live site is done at desktop, tablet and phone widths. Next: the launch checklist below.

## Commands

| Command                | Action                                                        |
| ---------------------- | ------------------------------------------------------------- |
| `npm install`          | Install dependencies (Node ≥ 22.12)                           |
| `astro dev --background` | Dev server at `localhost:4321` (`astro dev stop/status/logs`) |
| `npm run build`        | Production build to `dist/`                                   |
| `npm run preview`      | Serve the production build locally                            |
| `npm run check`        | Type-check `.astro` / `.ts` files                             |
| `npm run fetch-assets` | Re-download Squarespace assets (needs `ffmpeg`)               |

## Project structure

```text
src/
  layouts/BaseLayout.astro     <head>, SEO, fonts, header/footer, consent, global scripts
  pages/                       one file per route; URLs match the Squarespace site exactly
  components/
    layout/                    FluidSection + FluidItem — Squarespace's grid, reproduced
    global/                    Header, Footer, SEO, JsonLd, CookieConsent, FlodeskPopup, FlodeskForm,
                               ItemPagination, Testimonial
    home/                      homepage sections (Hero, PressMarquee, ServicesIntro, …)
    services/                  services page sections (Phase, HowItWorks, Faq, …)
    portfolio/                 portfolio index tile
    forms/                     NetlifyForm (contact application, Electric Evolution requests)
    case-study/                case-study template (CaseStudy)
    blog/                      blog index card (BlogCard)
    ui/                        Button, Accordion, Marquee, DrawUnderline, AutoplayVideo, ParallaxBackground,
                               SocialLinks
  content/portfolio/           one Markdown entry per project: homepage card, /portfolio tile,
                               and `caseStudy` page data (sections → text/image/video blocks
                               with their live grid placement; schema in src/content.config.ts)
  content/legal/               privacy policy, terms & conditions, Electric Evolution terms
                               (Markdown, rendered by src/pages/[legal].astro)
  content/blog/                one Markdown file per post (frontmatter: title, dates, author,
                               card image); images in src/assets/images/blog/<slug>/
  data/                        site constants, nav, press logos, testimonials, services copy, form fields
  lib/                         search-indexing switch, structured data (JSON-LD) builders
  styles/                      tokens.css (colors, type scale, layout), fonts.css, global.css
  scripts/                     smooth scroll (Lenis), scroll lock
  assets/images/               source images (optimized to WebP/AVIF at build time)
public/
  fonts/  videos/  images/     self-hosted fonts, encoded videos + posters, share image
scripts/
  squarespace-assets.json      every migrated asset: Squarespace URL → repo path
  fetch-squarespace-assets.mjs downloads the above; encodes videos at display size
```

### Layout system

Squarespace pages are built on its "Fluid Engine" grid. `FluidSection` recreates that
grid exactly (8 columns on mobile, 24 on desktop, 11px gaps, rows scaled to the page
width) and `FluidItem` places a block using the same `row/col/row/col` coordinates the
live site uses. Copying those coordinates is what keeps every breakpoint pixel-accurate.

```astro
<FluidSection rows={{ mobile: 18, desktop: 10 }} theme="light">
  <FluidItem desktop="4/5/10/9" mobile="3/2/7/10">…</FluidItem>
</FluidSection>
```

Type sizes follow the theme's own fluid formula (see `src/styles/tokens.css`).

## Editing content

| What | Where |
| --- | --- |
| Blog posts | `src/content/blog/` (one Markdown file each; images in `src/assets/images/blog/<slug>/`) |
| Case studies, homepage cards, `/portfolio` tiles | `src/content/portfolio/` |
| Privacy policy, terms | `src/content/legal/` |
| Testimonials, press logos, services copy, nav, form fields | `src/data/` |
| Copy on the main pages (home, services, studio, contact, The Briefing) | the page components in `src/pages/` and `src/components/` |

The collections in `src/content/` have schemas in `src/content.config.ts`, so a headless CMS
can connect to them directly. Main-page copy would have to move into data or content files
first to become editable in a CMS.

## Deliberate differences from the live site

These were reviewed and approved. Don't change them back to match Squarespace:

- **The Briefing header:** "GET STARTED" is readable. On live it's cream on a cream header.
- **Wide column gaps:** these are capped at `100vw / 24` (see `FluidSection`). Live's founder
  section overflows at tablet widths (text cut off, sideways scroll), so it's taller here.
- **Electric Evolution request form:** "support type" allows several answers (live said
  "check all that apply" but allowed one), and it takes one 8 MB attachment instead of five.
- **Laura Czuba case study:** omits four live video blocks that never finished processing.
- **accessiBe:** the live site's accessibility overlay isn't included (client decision pending).
- **Mobile menu on phones:** uses the body sans-serif. Live requests an undefined
  "Essential Sans" font, so browsers show their default sans-serif.

## Integrations

- **Google Analytics 4** (`G-7GPYYQKSN6`): loaded only after the visitor accepts
  "Performance and Analytics" in the cookie banner.
- **Flodesk** ("The Briefing"): the site-wide popup and the inline sign-up form on
  `/the-briefing` use the same embeds as before; display rules live in Flodesk.
- **Smooth scrolling**: Lenis, same settings as the old site; disabled for reduced motion.

## Forms (Netlify Forms)

Both site forms use one component, `src/components/forms/NetlifyForm.astro`, with their
fields in `src/data/`:

| Form | Page | Fields | Netlify form name | After sending |
| --- | --- | --- | --- | --- |
| Application | `/contact` | `contactForm.ts` | `application` | redirects to `/thank-you` |
| Electric Evolution request | `/electric-evolution-members` | `evolutionForm.ts` | `electric-evolution-request` | thank-you message replaces the form |

Submissions appear in Netlify → **Forms → (form name)**. One-time setup in Netlify:

1. **Forms → Enable form detection** (then redeploy so Netlify registers both forms).
2. **Forms → Form notifications → Add notification → Email**, once per form, for the
   address that should receive it.

Spam is filtered by Netlify plus a hidden honeypot field. The request form accepts one
attachment up to 8 MB (Netlify's limit per submission). Submitting only works on Netlify
(deploy previews included), not `astro dev`.

## Deploying (Netlify)

`netlify.toml` holds the build settings, legacy redirects (`/home` → `/`, and the old
`/blog?format=rss` feed → `/blog/rss.xml`) and cache headers. Every page URL matches
Squarespace, so no other redirects are needed. Nothing loads from Squarespace: all images,
videos and fonts are self-hosted.

Search indexing is **off by default** (`robots.txt` disallows all and every page
is `noindex`), so preview deploys never compete with the live Squarespace site.
At launch, set `PUBLIC_ALLOW_INDEXING=true` in Netlify's environment variables.

### Launch checklist

- [x] All pages migrated (the Electric Evolution portal and terms and `/thank-you` stay
      `noindex` on purpose)
- [ ] Client approval of the full site
- [ ] `PUBLIC_ALLOW_INDEXING=true` set in Netlify
- [ ] Netlify form detection enabled + notification email set; test submission received
- [ ] Netlify plan's monthly form-submission limit covers expected volume
- [ ] Decide where contact-form opt-ins go (no mailing-list connection exists yet; submissions
      only land in Netlify)
- [ ] Custom domain pointed at Netlify, **keeping the existing email (MX) records**; HTTPS active
- [ ] Squarespace subscription kept until the new site and email are verified
- [ ] Sitemap (`/sitemap-index.xml`) submitted in Google Search Console
- [ ] accessiBe: keep (add back) or cancel
