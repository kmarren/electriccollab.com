/**
 * The Electric Evolution portal request form, from the live Squarespace form
 * ("Electric Evolution Request"). Labels, options and the thank-you message
 * are verbatim. One deliberate difference, approved during the migration:
 * "What Type of Support" takes several answers (live said "Check all that
 * apply" but only allowed one). Attachments: up to five files, as on live.
 */
import type { SiteForm } from './forms';

export const evolutionForm: SiteForm = {
  name: 'electric-evolution-request',
  submitLabel: 'Submit',
  submitColor: 'burgundy',
  success: {
    message:
      'Thank you for reaching out! A member of the Electric Collab team will be in touch within 24 business hours with next steps. We can’t wait to work together again!',
  },
  failureMessage: 'Sorry, something went wrong sending your request. Please try again, or email emily@electriccollab.com.',
  notify: { to: ['emily@electriccollab.com'], subject: 'New Electric Evolution request' },
  fields: [
    { type: 'name', label: 'Name', required: true },
    { type: 'email', name: 'Email', label: 'Email', required: true },
    {
      type: 'checkbox',
      name: 'Support type',
      label: 'What Type of Support Are You Looking For?',
      description: 'Check all that apply:',
      required: true,
      spacing: 'radio', // laid out like the live (single-choice) list
      options: ['Messaging or Copy', 'Visual Design', 'New Brand Collateral', 'Website Updates or Additions', "I'd like to book a call with emily", 'Other'],
    },
    { type: 'website', name: 'Link', label: 'Link a Webpage or Loom', required: false, placeholder: 'http://' },
    { type: 'textarea', name: 'Request', label: 'Tell Us What You Need!', required: true },
    {
      type: 'file',
      name: 'Attachment',
      label: 'Include Screenshots or Files That May Help Us Understand Your Request',
      required: false,
      maxFiles: 5,
    },
  ],
};
