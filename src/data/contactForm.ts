/**
 * The contact page application form, reproduced field-for-field from the live
 * Squarespace form ("Contact Form 3"). Labels and options are verbatim,
 * including the live typo "Next Availlable".
 *
 * `name` is the key submissions are stored under in Netlify Forms (and shown
 * in notification emails), so names are written to be readable there.
 */

export type Field =
  | { type: 'name'; label: string; required: true }
  | { type: 'email' | 'text' | 'website'; name: string; label: string; required: boolean; placeholder?: string }
  | { type: 'textarea'; name: string; label: string; required: boolean }
  | { type: 'checkbox' | 'radio'; name: string; label: string; required: boolean; options: string[] }
  | { type: 'select'; name: string; label: string; required: boolean; placeholder: string; options: string[] };

export const contactForm = {
  /** Netlify form name (shown in the Netlify dashboard). */
  name: 'application',
  submitLabel: 'Submit Application',
  successPath: '/thank-you',
  fields: [
    { type: 'name', label: 'Name', required: true },
    { type: 'email', name: 'Email', label: 'Email', required: true },
    { type: 'text', name: 'Business or brand name', label: 'Business or Brand Name', required: true },
    { type: 'website', name: 'Website', label: 'Website', required: true, placeholder: 'http://' },
    { type: 'text', name: 'What they sell and to whom', label: 'What does your business sell, and who do you sell it to?', required: true },
    {
      type: 'checkbox',
      name: 'What feels off about the brand',
      label: 'What feels most "off" about your brand right now? Select all that apply',
      required: true,
      options: [
        'My website feels outdated for my level now',
        "My brand looks fine but doesn't convert",
        "My brand doesn't feel like me anymore",
        'My messaging feels unclear',
        'Premium clients hesitate and take a long time to close',
        "I'm worried my current brand can't hold our future growth",
      ],
    },
    {
      type: 'checkbox',
      name: 'Most important outcome',
      label: 'What outcome matters most right now?',
      required: true,
      options: [
        'Premium positioning + pricing power',
        'Clear messaging that cuts through the noise',
        'A website that converts with less follow up',
        'More premium inquiries',
        'A brand that feels authentic and fully aligned',
      ],
    },
    {
      type: 'radio',
      name: 'Monthly revenue',
      label: "What's your current monthly revenue range?",
      required: true,
      options: ['Under 10k', '10k - 20k', '20k - 50k', '50k - 100k', '100k +'],
    },
    {
      type: 'radio',
      name: 'Ideal start',
      label: "What's your ideal timeline to start?",
      required: true,
      options: ['Next Availlable', '2-3 Months', '4+ Months'],
    },
    { type: 'radio', name: 'Final decision maker', label: 'Are you the final decision maker?', required: true, options: ['Yes', 'No'] },
    {
      type: 'radio',
      name: 'Investment readiness',
      label: 'What is your investment readiness? Choose 1:',
      required: true,
      options: ["I'm ready if this is a fit", 'I need more details to say', "I'm planning for later"],
    },
    {
      type: 'select',
      name: 'How they heard about us',
      label: 'How did you hear about Electric Collab?',
      required: true,
      placeholder: 'Select an option',
      options: ['Google Search', 'ChatGPT / AI Search', 'Instagram', 'LinkedIn', 'Entreprenista', 'Referral', 'Other'],
    },
    {
      type: 'text',
      name: 'Referred by',
      label: 'If this is a referral, please share the name of the person who referred you so I can thank them!',
      required: false,
    },
    { type: 'textarea', name: '90-day win', label: 'What would make this project a clear win 90 days after launch?', required: true },
    { type: 'textarea', name: 'Anything else', label: 'Anything else you think I should know?', required: true },
  ] satisfies Field[],
};
