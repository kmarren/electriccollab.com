/**
 * Copy for the "our services" page (/electric-brand-experience), reproduced
 * verbatim from the live site. HTML strings are trusted, authored content.
 */

export interface Phase {
  label: string;
  title: string;
  body: string;
  receive: string;
}

export const phases: Phase[] = [
  {
    label: '1 | STRATEGY',
    title: 'Premium Positioning',
    body: 'Effective branding is\u00a0not\u00a0about boxing you into how you “should” show up in the world. It’s about clarifying the value you deliver, amplifying the purpose that drives you, and packaging your company’s\u00a0individuality\u00a0into concise messaging premium clients understand, connect with, and are genuinely excited to invest in.',
    receive:
      '<p>A bespoke Brand Book that outlines your strategic positioning, customer-facing messaging, brand story, unique value pillars, audience emotional profile, voice and more: all rooted in consumer psychology and SEO research.</p>',
  },
  {
    label: '2 | DESIGN',
    title: 'Elevated Visual Identity',
    body: 'Polished design captures attention and builds credibility in milliseconds. (Really.) We evaluate what’s already working well and elevate your brand aesthetic to reflect the sophistication of your work now. When you’re ready to attract next-level clients and higher caliber opportunities, a strategic visual identity is a one-time investment that pays you back for years.',
    receive:
      '<p>An original logo suite, ownable brand emblem, psychology-based color palette, typography system, launch graphics, and a comprehensive style guide to ensure your brand feels cohesive everywhere you show up.</p>',
  },
  {
    label: '3 | DIGITAL PRESENCE',
    title: 'Custom, AI-Optimized Website that Pre-sells your Premium Value',
    body: 'A beautifully designed, strategically built website is one of the most powerful assets in your business. We write every word, craft every page with a focus on UX Design, and build an intentional digital experience that guides visitors from curiosity to conversion. Expect a custom website that wins aligned clients right away with room for your business to grow.',
    receive:
      '<p>Full design and development, conversion copy, sourced photography and video, tech integrations and a seamless site launch including SEO, AEO, accessibility, and analytics. As full-service as it gets.</p>',
  },
];

export interface Step {
  /** HTML (the live third title italicizes its period). */
  title: string;
  /** HTML (may contain <strong>). */
  body: string;
}

export const steps: Step[] = [
  {
    title: '01. We begin with a private, strategic deep dive into your business.',
    body: 'My chance to listen, learn, and develop a bespoke brand plan to achieve your specific business goals. No cold questionnaires included.',
  },
  {
    title: '02. We become your personal brand department.',
    body: 'Our process is intimate and immersive. We share video presentations of the work as it develops from week-to week. You share your feedback in whatever format feels easiest, we adjust without any revision limits, and we can jump on a call for deeper discussion anytime. Expect a clear, collaborative rhythm until every element is exactly right.',
  },
  {
    title: '03<em>.</em> We finalize every detail &amp; launch your new brand &amp; website!',
    body: 'We test tech, complete SEO setup, and perfect your launch materials. Your website goes live, and you walk away with everything you need to own, promote, and love your brand for years to come. Electric brand and website projects typically take <strong>10-14 weeks</strong> from start to finish.',
  },
];

export interface FaqItem {
  question: string;
  /** HTML answer. */
  answer: string;
}

/** FAQs in their two live columns. */
export const faqColumns: FaqItem[][] = [
  [
    {
      question: 'HOW EARLY SHOULD I BOOK A PROJECT?',
      // Live link pointed to a truncated URL ("https://conta"); fixed to /contact.
      answer:
        '<p>Due to the custom and in-depth nature of Electric Branding, we work with a select number of clients at any one time. <br><br>Openings fill quickly, and I encourage you to <a href="/contact">reach out now</a> if you have a project in mind!</p>',
    },
    {
      question: 'DO YOU LIMIT THE NUMBER OF REVISIONS?',
      answer:
        '<p>Nope! It does us no good to deliver a final product you don’t love. <br><br>We work <em>with you</em> to set expectations before we begin to ensure you get exactly what you want.</p>',
    },
    {
      question: 'WHAT IF I NEED ADDITIONAL COLLATERAL?',
      answer:
        '<p>Your brand should be cohesive everywhere, and custom elements can absolutely be added to our project:<br><br>Business cards, a new email signature, case studies, podcast cover art, investor decks, program materials, etc.<br><br>Whatever you need, we can create it.</p>',
    },
  ],
  [
    {
      question: 'DO YOU OFFER PAYMENT PLANS?',
      answer:
        '<p>Yes! Your total investment is billed in 4 equal payments throughout our project timeline. If you prefer to pay in full, a discount is included.</p>',
    },
    {
      question: 'CAN I HIRE YOU FOR 1 OF THE 3 PHASES?',
      answer:
        '<p>Maybe! Your brand should evolve with your business. If you already have components that are working really well, we may be able to work with those vs. unnecessarily reinventing the wheel.</p><p>That said, our psychology-based approach is critical to develop a brand we KNOW will deliver the results you want. We’ll be honest about what we feel your brand needs.</p>',
    },
    {
      question: 'CAN I KEEP MY EXISTING LOGO AND COLORS?',
      answer:
        '<p>Maybe! If you love it and it’s working, there’s no reason to scrap it. We can complement the brand elements you already love with the important pieces you may be missing. <br><br>I’ll create a custom proposal for your custom project.</p>',
    },
    {
      question: 'HOW MUCH TIME WILL YOU NEED FROM ME?',
      answer:
        '<p>Plan to spend 1-3 hours a week focused on this project. My team and I handle <strong>all </strong>the heavy lifting, but that’s about the time it takes to review the work we share, gather your feedback, and share your input with us.</p>',
    },
  ],
];

/** Work samples in the auto-scrolling carousel, with the live alt text. */
export const carousel: { file: string; alt: string }[] = [
  { file: '01-field-bicycles.jpg', alt: 'A grassy field with a dirt path and two people, a man and a woman, standing with bicycles' },
  { file: '02-pearlvest-lake.jpg', alt: 'View of a lake with sailboats, lush green hills, and residential buildings in the background, with a stone terrace and tall trees in the foreground.' },
  { file: '03-jewelry-app.jpg', alt: 'A smartphone displaying an online jewelry store app with a gold ring named Walton Ring in size 6, priced at $92' },
  { file: '04-sovera-box.jpg', alt: 'Close-up of a maroon-colored box with the word ‘SOVERA’ embossed and a small decorative emblem above the text.' },
  { file: '05-haus-of-worthship.jpg', alt: 'Close-up of a woman’s face with sunlight casting a rainbow reflection across her face and eye, with the text ‘Haus of Worthship’ overlayed' },
  { file: '06-desk-brochures.png', alt: 'Top-down view of a white desk with a laptop and several brochures about business problems and human solutions, featuring a keyboard and partially visible images of people in professional settings.' },
  { file: '07-everlight-emblem.jpg', alt: 'A cloudy sky with a logo in the center that features a lamp and the words ‘Everlight Leadership’ around it.' },
  { file: '08-daymade.png', alt: 'A cutout of a hand holding a red pen, writing on a striped towel that is seen through a maple leaf-shaped opening in a rust-colored background' },
  { file: '09-wedding-tablet.jpg', alt: 'Digital tablet displaying a wedding-related website with images of a bride and groom holding hands, a bouquet, and wedding venue inside a white room with natural light' },
  { file: '10-omnigrove.jpg', alt: 'OmniGrove logo' },
];
