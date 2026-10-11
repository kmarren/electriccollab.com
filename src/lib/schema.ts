/**
 * Schema.org structured-data builders. Every fact here is stated on the live
 * site; do not add claims (ratings, prices, addresses) that the site doesn't make.
 */
import { site, socialLinks } from '../data/site';

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;
const FOUNDER_ID = `${site.url}/#founder`;

/** Site-wide graph: the studio, its founder, and the website. */
export function siteGraph() {
  // The live site's Instagram and LinkedIn are the founder's personal profiles.
  const sameAs = socialLinks.filter((s) => s.icon !== 'email').map((s) => s.href);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': ORG_ID,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        description: site.description,
        slogan: site.tagline,
        email: site.founder.email,
        image: new URL(site.ogImage.src, site.url).href,
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.location.city,
          addressRegion: site.location.region,
          addressCountry: site.location.country,
        },
        areaServed: 'Worldwide',
        founder: { '@id': FOUNDER_ID },
      },
      {
        '@type': 'Person',
        '@id': FOUNDER_ID,
        name: site.founder.name,
        worksFor: { '@id': ORG_ID },
        sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: site.name,
        url: site.url,
        publisher: { '@id': ORG_ID },
        inLanguage: 'en-US',
      },
    ],
  };
}

/** Plain text from trusted HTML, for structured data. */
function toPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>\s*<p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** FAQPage structured data, built from exactly the Q&As shown on the page. */
export function faqPage(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      // Questions are uppercase by design on the page; use sentence case for machines.
      name: item.question.charAt(0) + item.question.slice(1).toLowerCase(),
      acceptedAnswer: { '@type': 'Answer', text: toPlainText(item.answer) },
    })),
  };
}
