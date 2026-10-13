/**
 * Shapes for the site's Netlify Forms (see src/components/forms/NetlifyForm.astro).
 *
 * A field's `name` is the key submissions are stored under in Netlify (and
 * shown in notification emails), so names are written to be readable there.
 * `description` is the smaller help text Squarespace shows under a label.
 */
type Base = { label: string; required: boolean; description?: string };

export type Field =
  | ({ type: 'name' } & Base)
  | ({ type: 'email' | 'text' | 'website'; name: string; placeholder?: string } & Base)
  | ({ type: 'textarea'; name: string } & Base)
  /** `spacing: 'radio'` keeps radio-button row spacing on a checkbox list. */
  | ({ type: 'checkbox' | 'radio'; name: string; options: string[]; spacing?: 'radio' } & Base)
  | ({ type: 'select'; name: string; placeholder: string; options: string[] } & Base)
  /** One file per field, 8 MB max (Netlify Forms' limit per submission). */
  | ({ type: 'file'; name: string } & Base);

export interface SiteForm {
  /** Netlify form name (shown in the Netlify dashboard). */
  name: string;
  submitLabel: string;
  /** Submit button color: red (contact) or burgundy (Electric Evolution). */
  submitColor?: 'red' | 'burgundy';
  /** After a successful send: go to a page, or replace the form with a message. */
  success: { path: string } | { message: string };
  /** Shown above the form if sending fails. */
  failureMessage: string;
  fields: Field[];
}
