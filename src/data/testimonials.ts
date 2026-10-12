/**
 * Client testimonials, reproduced verbatim (including typographic quotation
 * marks) from the live site. Pages pick testimonials by key.
 *
 * `attribution` is shown uppercase by CSS. If `link` is set, its `text` must
 * appear in `attribution`; that part becomes the link (a person's site or a
 * company's site, depending on the original).
 *
 * `photo` resolves against src/assets/images/testimonials/; `photoPosition` is
 * the crop focal point carried over from Squarespace.
 */

export interface Testimonial {
  quote: string;
  attribution: string;
  link?: { text: string; href: string };
  photo: string;
  photoAlt: string;
  photoPosition?: string;
}

export const testimonials = {
  'carrie-kerpen': {
    quote:
      '“I had no idea how deeply you’d capture our vision or our offerings. This brand project exceeded every single expectation, and our new website made a measurable impact on the business within 24 hours post launch. This is the best money I have spent on this business.”',
    attribution: 'Carrie Kerpen | Founder of The Whisper Group',
    link: { text: 'The Whisper Group', href: 'https://www.wearethewhispergroup.com/' },
    photo: 'carrie-kerpen.jpg',
    photoAlt: 'Portrait of Carrie Kerpen',
  },
  'lauren-bercuson': {
    quote:
      '“My sales tripled within the first month of my new brand and website being live. Years later, it continues to scale my business and is the best investment I’ve made!”',
    attribution: 'Lauren Bercuson | Founder of Storylock Legal',
    link: { text: 'Storylock Legal', href: 'https://www.storylocklegal.com/' },
    photo: 'lauren-bercuson.jpg',
    photoAlt: 'Portrait of Lauren Bercuson',
    photoPosition: '34.06% 40%',
  },
  'kelly-edmondson': {
    quote:
      '“We feel so seen. You captured not only what we do, but what we are trying to become. I am so impressed with how elevated this looks. You are certainly worth all the hype!”',
    attribution: 'Kelly Edmondson | Founder of Timely Presence',
    link: { text: 'Timely Presence', href: 'https://thetimelypresence.com/' },
    photo: 'kelly-edmondson.jpg',
    photoAlt: 'Portrait of Kelly Edmondson',
  },
  'lindsay-mahoney': {
    quote:
      '“We doubled our client base in the time between kickoff with Electric Collab and the new website going live because of our new positioning.”',
    attribution: 'Lindsay Mahoney | Founder of EVGN Scaling & Growth Agency',
    link: { text: 'EVGN Scaling & Growth Agency', href: 'https://www.evgnagency.com/' },
    photo: 'lindsay-mahoney.png',
    photoAlt: 'Portrait of Lindsay Mahoney',
    photoPosition: '100% 8.8%',
  },
  'devin-lee': {
    quote:
      '“I was immediately booked out for two quarters! Years after launch, this is still the best investment I’ve made in my business.”',
    attribution: 'Devin Lee | Founder & Systems Strategist',
    photo: 'devin-lee.jpg',
    photoAlt: 'Portrait of Devin Lee',
    photoPosition: '61.22% 13.6%',
  },
  'jenica-oliver': {
    quote: '“I leverage the brand book almost daily. What you developed has been invaluable.”',
    attribution: 'Jenica Oliver | Founder & Fractional CMO',
    link: { text: 'Jenica Oliver', href: 'https://www.jenicaoliver.com/' },
    photo: 'jenica-oliver.jpg',
    photoAlt: 'Portrait of Jenica Oliver',
    photoPosition: '51.2% 23.2%',
  },
  'sarah-parisi': {
    quote:
      '“Since the brand launch I’ve been able to pause all Google ads because the leads coming through are aligned and converting organically!”',
    attribution: 'Sarah Parisi | Founder of The Clutter Curator',
    link: { text: 'The Clutter Curator', href: 'https://www.thecluttercurator.com/' },
    photo: 'sarah-parisi.jpg',
    photoAlt: 'Portrait of Sarah Parisi',
  },
  'natalie-rosado': {
    quote:
      '“This is the first time I’ve had something that truly represents me. You didn’t just build my brand and website. You linked arms with me to breathe life into what seemed like a distant possibility.”',
    attribution: 'Natalie Rosado | Founder & Therapist',
    link: { text: 'Natalie Rosado', href: 'https://www.thenatalierosado.com/' },
    photo: 'natalie-rosado.png',
    photoAlt: 'Portrait of Natalie Rosado',
    photoPosition: '69.94% 25.6%',
  },
  'ken-colleen-pelasky': {
    quote:
      '“Every single piece of this project holds value. It’s the single best investment you can make in your business, your clients, and yourself as an entrepreneur.”',
    attribution: 'Ken & Colleen Pelasky | Founders of Enchantée Travel',
    link: { text: 'Enchantée Travel', href: 'https://www.enchanteetravel.com/' },
    photo: 'ken-colleen-pelasky.jpg',
    photoAlt: 'Portrait of Ken and Colleen Pelasky',
    photoPosition: '48.93% 68.8%',
  },
  'marly-graubard': {
    quote:
      '“It was more than building my website. They crafted my narrative. There was no question that this was an excellent decision and pivotal point for my business growth.”',
    attribution: 'Marly Graubard | Founder of MB Graubard Consulting',
    link: { text: 'MB Graubard Consulting', href: 'https://www.mbgraubard.com/' },
    photo: 'marly-graubard.jpg',
    photoAlt: 'Portrait of Marly Graubard',
    photoPosition: '0% 0%',
  },
  'emily-dean': {
    quote:
      '“Working with Electric Collab was the turning point. They were the partner I needed to distill the essence of my brand and translate it into an experience that feels intentional, elevated, and deeply aligned.”',
    attribution: 'Emily Dean | Founder of Bolt & Bloom',
    link: { text: 'Bolt & Bloom', href: 'https://www.boltandbloom.com/' },
    photo: 'emily-dean.jpg',
    photoAlt: 'Portrait of Emily Dean',
  },
  'mary-wiegand': {
    quote:
      '“We had a lead assume we have our own software because our website is so good! We’ve gained so much through this project, and I’m extremely proud to use this brand to propel us in the future.”',
    attribution: 'Mary Wiegand | Founder of Boon Inventory Management',
    link: { text: 'Boon Inventory Management', href: 'https://boon-llc.com/' },
    photo: 'mary-wiegand.png',
    photoAlt: 'Portrait of Mary Wiegand',
  },
} satisfies Record<string, Testimonial>;

export type TestimonialKey = keyof typeof testimonials;
