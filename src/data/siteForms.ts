/**
 * Every form on the site, by name. The Cloudflare Worker (worker/forms.ts)
 * looks submissions up here, so a form must be listed to accept posts.
 */
import type { SiteForm } from './forms';
import { contactForm } from './contactForm';
import { evolutionForm } from './evolutionForm';

export const siteForms: Record<string, SiteForm> = Object.fromEntries([contactForm, evolutionForm].map((form) => [form.name, form]));
