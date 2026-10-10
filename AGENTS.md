## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project Overview and Goals

Electric Collab is a psychology-based brand studio based in Chicago. This project involves migrating their existing website, currently hosted on Squarespace, to Astro. The goal is to faithfully recreate the existing website while improving its underlying technical foundation.

Success means delivering a visually and functionally accurate recreation of the current website, with clean, maintainable, well-documented code, reduced page weight, improved loading performance, and strong technical SEO and AEO foundations. Particular emphasis should be placed on making the website's existing content accessible, semantically structured, and understandable to both traditional search engines and AI-powered search systems.

This project is strictly a migration, not a redesign. The scope does not include changing existing copy, branding, website structure, layout, visual design, or functionality. Behind-the-scenes technical improvements are encouraged as long as they preserve the existing user experience.

When technical improvements conflict with visual or functional fidelity, flag the tradeoff and request approval rather than independently changing the website.

The final deliverable should be production-ready and available for client review, but must not replace the live Squarespace website until the client explicitly approves the transition.

## Responsive Design and Cross-Device Fidelity

The migrated website must faithfully reproduce the existing Squarespace site's appearance and functionality across all screen sizes, including desktop, tablet, and mobile. Responsive behavior should match the original website, including layouts, typography, spacing, navigation, images, and interactive elements. Do not optimize solely for desktop or assume that mobile layouts should simply scale down from desktop. Reference the existing site's behavior at multiple viewport sizes and test the Astro implementation across common screen widths to ensure visual consistency, usability, and functional accuracy. Any responsive design changes that deviate from the original site should be flagged for approval.