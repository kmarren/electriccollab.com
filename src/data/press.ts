/**
 * "As seen in" press logos for the homepage marquee, in display order.
 * Alt text is carried over from the live site, condensed to the publication name.
 * `file` resolves against src/assets/images/press/.
 */

export interface PressLogo {
  name: string;
  file: string;
}

export const pressLogos: PressLogo[] = [
  { name: 'Better Homes & Gardens', file: 'better-homes-gardens.png' },
  { name: 'Brides', file: 'brides.png' },
  { name: 'Today', file: 'today.png' },
  { name: 'InStyle', file: 'instyle.png' },
  { name: 'Forbes', file: 'forbes.png' },
  { name: 'Parade', file: 'parade.png' },
  { name: 'The Wall Street Journal', file: 'wsj.png' },
  { name: 'Good Morning America', file: 'good-morning-america.png' },
  { name: 'TEDx', file: 'tedx.png' },
  { name: 'Well+Good', file: 'well-good.png' },
];
