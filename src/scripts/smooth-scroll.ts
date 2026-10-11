/**
 * Smooth wheel scrolling via Lenis, matching the live site's configuration
 * (lerp 0.13). Touch scrolling stays native. Skipped entirely for visitors who
 * prefer reduced motion.
 */
import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis;

  lenis = new Lenis({ autoRaf: true, lerp: 0.13 });
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}
