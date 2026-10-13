# electriccollab.com

Astro rebuild of [electriccollab.com](https://www.electriccollab.com), migrated from Squarespace.
This is a faithful migration, not a redesign. See [AGENTS.md](AGENTS.md) for project goals and rules.

**Status:** homepage, "our services" (`/electric-brand-experience`), "our work" (`/portfolio`), "the studio" (`/about`), contact (`/contact` + `/thank-you`) and all 21 case studies (`/portfolio/*`) and the blog (`/blog`, 17 posts, RSS at `/blog/rss.xml`) migrated; every other route exists as a `noindex` placeholder.

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
    global/                    Header, Footer, SEO, JsonLd, CookieConsent, FlodeskPopup, ItemPagination
    home/                      homepage sections (Hero, PressMarquee, ServicesIntro, …)
    services/                  services page sections (Phase, HowItWorks, Faq, …)
    portfolio/                 portfolio index tile
    case-study/                case-study template (CaseStudy)
    blog/                      blog index card (BlogCard)
    ui/                        Button, Accordion, Marquee, DrawUnderline, AutoplayVideo, SocialLinks
  content/portfolio/           one Markdown entry per project: homepage card, /portfolio tile,
                               and `caseStudy` page data (sections → text/image/video blocks
                               with their live grid placement; schema in src/content.config.ts)
  content/blog/                one Markdown file per post (frontmatter: title, dates, author,
                               card image); images in src/assets/images/blog/<slug>/
  data/                        site constants, nav, press logos, testimonials, services copy
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

## Integrations

- **Google Analytics 4** (`G-7GPYYQKSN6`): loaded only after the visitor accepts
  "Performance and Analytics" in the cookie banner.
- **Flodesk popup** ("The Briefing"): same embed as before; display rules live in Flodesk.
- **Smooth scrolling**: Lenis, same settings as the old site; disabled for reduced motion.

## Contact form (Netlify Forms)

The application form on `/contact` is a Netlify Form (`src/components/contact/ContactForm.astro`,
fields in `src/data/contactForm.ts`). Submissions appear in Netlify → **Forms → application**.

One-time setup in Netlify:

1. **Forms → Enable form detection** (then redeploy so Netlify registers the form).
2. **Forms → Form notifications → Add notification → Email** for the address that should
   receive applications.

Spam is filtered by Netlify plus a hidden honeypot field. Successful submissions redirect to
`/thank-you`. Submitting only works on Netlify (deploy previews included), not `astro dev`.

## Deploying (Netlify)

`netlify.toml` holds the build settings, legacy redirects (`/home` → `/`) and cache headers.

Search indexing is **off by default** (`robots.txt` disallows all and every page
is `noindex`), so preview deploys never compete with the live Squarespace site.
At launch, set `PUBLIC_ALLOW_INDEXING=true` in Netlify's environment variables.

### Launch checklist

- [ ] All placeholder pages migrated (remove their `noindex` prop)
- [ ] Client approval of the full site
- [ ] `PUBLIC_ALLOW_INDEXING=true` set in Netlify
- [ ] Netlify form detection enabled + notification email set; test submission received
- [ ] Custom domain pointed at Netlify; Squarespace subscription kept until verified
