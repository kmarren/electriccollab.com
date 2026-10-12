# electriccollab.com

Astro rebuild of [electriccollab.com](https://www.electriccollab.com), migrated from Squarespace.
This is a faithful migration, not a redesign. See [AGENTS.md](AGENTS.md) for project goals and rules.

**Status:** homepage, "our services" (`/electric-brand-experience`) and "our work" (`/portfolio`) migrated; every other route exists as a `noindex` placeholder.

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
    global/                    Header, Footer, SEO, JsonLd, CookieConsent, FlodeskPopup
    home/                      homepage sections (Hero, PressMarquee, ServicesIntro, …)
    services/                  services page sections (Phase, HowItWorks, Faq, …)
    portfolio/                 portfolio index tile
    ui/                        Button, Accordion, Marquee, DrawUnderline, AutoplayVideo, SocialLinks
  content/portfolio/           one Markdown entry per case study: homepage card + /portfolio
                               tile data now, full case studies later
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

## Deploying (Netlify)

`netlify.toml` holds the build settings, legacy redirects (`/home` → `/`) and cache headers.

Search indexing is **off by default** (`robots.txt` disallows all and every page
is `noindex`), so preview deploys never compete with the live Squarespace site.
At launch, set `PUBLIC_ALLOW_INDEXING=true` in Netlify's environment variables.

### Launch checklist

- [ ] All placeholder pages migrated (remove their `noindex` prop)
- [ ] Client approval of the full site
- [ ] `PUBLIC_ALLOW_INDEXING=true` set in Netlify
- [ ] Custom domain pointed at Netlify; Squarespace subscription kept until verified
