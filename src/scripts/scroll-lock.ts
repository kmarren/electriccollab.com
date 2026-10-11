/** Prevent the page behind a modal/menu from scrolling (native + Lenis). */
import { getLenis } from './smooth-scroll';

export function lockScroll(): void {
  document.documentElement.style.overflow = 'hidden';
  getLenis()?.stop();
}

export function unlockScroll(): void {
  document.documentElement.style.overflow = '';
  getLenis()?.start();
}
