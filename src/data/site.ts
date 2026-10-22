/**
 * Site-wide constants: identity, navigation, contact, and social links.
 * Copy and URLs are reproduced exactly from the live Squarespace site.
 */

export const site = {
  name: 'Electric Collab',
  legalName: 'Electric Collab, LLC',
  url: 'https://www.electriccollab.com',
  tagline: 'Psychology-based, Amplified by AI™',
  description:
    'Electric Collab is a Chicago-based branding and web design studio building bold, strategic brands for founders ready to stand out and convert.',
  defaultTitle: 'Branding and Web Design Studio | Chicago, IL | Electric Collab',
  locale: 'en_US',
  /** Default social share image (1188×1188), downloaded from Squarespace into public/. */
  ogImage: { src: '/images/og-default.jpg', width: 1188, height: 1188 },
  location: {
    city: 'Chicago',
    region: 'IL',
    country: 'US',
    blurb: 'Based in Chicago, IL, Serving Clients Worldwide.',
  },
  founder: {
    name: 'Emily Paulsen',
    email: 'emily@electriccollab.com',
  },
} as const;

/** Third-party integrations carried over from the Squarespace site. */
export const integrations = {
  /** Google Analytics 4 — loaded only after cookie consent. */
  gaMeasurementId: 'G-7GPYYQKSN6',
  /** Flodesk popup ("The Briefing" audio series signup). */
  flodeskFormId: '67b42b370ff512f5a08e488e',
  /**
   * Cloudflare Turnstile (spam check on the forms; Managed mode). The site key is
   * public; PUBLIC_TURNSTILE_SITE_KEY overrides it at build time (see README → Forms).
   * TODO: this is Cloudflare's always-pass test key; replace with the real site key before launch.
   */
  turnstileSiteKey: '1x00000000000000000000BB',
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** Primary header navigation. Labels are lowercase on the live site by design. */
export const primaryNav: NavLink[] = [
  { label: 'our services', href: '/electric-brand-experience' },
  { label: 'our work', href: '/portfolio' },
  { label: 'the studio', href: '/about' },
];

/** Header call-to-action button. */
export const headerCta: NavLink = { label: 'GET STARTED', href: '/contact' };

/** Footer link columns. */
export const footerNav = {
  primary: primaryNav,
  secondary: [
    { label: 'electric evolution portal', href: '/electric-evolution-members' },
    { label: 'blog', href: '/blog' },
  ] satisfies NavLink[],
  cta: { label: "let's work together", href: '/contact' } satisfies NavLink,
  legal: [
    { label: 'privacy policy', href: '/privacy-policy' },
    { label: 'terms & conditions', href: '/terms-conditions' },
  ] satisfies NavLink[],
};

export interface SocialLink {
  label: string;
  href: string;
  icon: 'instagram' | 'linkedin' | 'email';
}

export const socialLinks: SocialLink[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/heyemilypaulsen/', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hey-emily-paulsen/', icon: 'linkedin' },
  { label: 'Email', href: `mailto:${site.founder.email}`, icon: 'email' },
];
