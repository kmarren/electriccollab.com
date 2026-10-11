/**
 * Homepage testimonials, in display order. Quotes are reproduced verbatim
 * (including typographic quotation marks) from the live site.
 *
 * `photo` resolves against src/assets/images/testimonials/; `photoPosition` is
 * the crop focal point carried over from Squarespace.
 */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  companyUrl: string;
  photo: string;
  photoAlt: string;
  photoPosition?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      '“I had no idea how deeply you’d capture our vision or our offerings. This brand project exceeded every single expectation, and our new website made a measurable impact on the business within 24 hours post launch. This is the best money I have spent on this business.”',
    name: 'Carrie Kerpen',
    role: 'Founder of',
    company: 'The Whisper Group',
    companyUrl: 'https://www.wearethewhispergroup.com/',
    photo: 'carrie-kerpen.jpg',
    photoAlt: 'Portrait of Carrie Kerpen',
  },
  {
    quote:
      '“My sales tripled within the first month of my new brand and website being live. Years later, it continues to scale my business and is the best investment I’ve made!”',
    name: 'Lauren Bercuson',
    role: 'Founder of',
    company: 'Storylock Legal',
    companyUrl: 'https://www.storylocklegal.com/',
    photo: 'lauren-bercuson.jpg',
    photoAlt: 'Portrait of Lauren Bercuson',
    photoPosition: '34.06% 40%',
  },
  {
    quote:
      '“We feel so seen. You captured not only what we do, but what we are trying to become. I am so impressed with how elevated this looks. You are certainly worth all the hype!”',
    name: 'Kelly Edmondson',
    role: 'Founder of',
    company: 'Timely Presence',
    companyUrl: 'https://thetimelypresence.com/',
    photo: 'kelly-edmondson.jpg',
    photoAlt: 'Portrait of Kelly Edmondson',
  },
  {
    quote:
      '“We doubled our client base in the time between kickoff with Electric Collab and the new website going live because of our new positioning.”',
    name: 'Lindsay Mahoney',
    role: 'Founder of',
    company: 'EVGN Scaling & Growth Agency',
    companyUrl: 'https://www.evgnagency.com/',
    photo: 'lindsay-mahoney.png',
    photoAlt: 'Portrait of Lindsay Mahoney',
    photoPosition: '100% 8.8%',
  },
];
