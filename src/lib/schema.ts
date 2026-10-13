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

/** CollectionPage + ItemList for an index page, using exactly the listed items. */
export function portfolioCollection({ name, path, items }: { name: string; path: string; items: { name: string; path: string }[] }) {
  const url = new URL(path, site.url).href;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: new URL(item.path, site.url).href,
      })),
    },
  };
}

/** Case study: the project as a CreativeWork by the studio, plus breadcrumbs. */
export function caseStudyGraph({ name, path, headline, image }: { name: string; path: string; headline: string; image?: string }) {
  const url = new URL(path, site.url).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        name: `${name} brand and website`,
        headline,
        url,
        creator: { '@id': ORG_ID },
        ...(image ? { image: new URL(image, site.url).href } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Our Work', item: new URL('/portfolio', site.url).href },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
    ],
  };
}

/** The blog index: a Blog listing exactly the posts shown, newest first. */
export function blogCollection(items: { name: string; path: string }[]) {
  const url = new URL('/blog', site.url).href;
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${url}#blog`,
    name: `${site.name} Blog`,
    url,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    blogPost: items.map((item) => ({ '@type': 'BlogPosting', headline: item.name, url: new URL(item.path, site.url).href })),
  };
}

/** A blog post (author and dates come from Squarespace; they aren't shown on the page). */
export function blogPostingGraph(post: {
  title: string;
  description: string;
  path: string;
  image?: string;
  author: string;
  publishDate: Date;
  updatedDate: Date;
}) {
  const url = new URL(post.path, site.url).href;
  const author = post.author === site.founder.name ? { '@id': FOUNDER_ID } : { '@type': 'Person', name: post.author };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#post`,
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        ...(post.image ? { image: new URL(post.image, site.url).href } : {}),
        author,
        publisher: { '@id': ORG_ID },
        datePublished: post.publishDate.toISOString(),
        dateModified: post.updatedDate.toISOString(),
        isPartOf: { '@id': `${new URL('/blog', site.url).href}#blog` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: new URL('/blog', site.url).href },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
