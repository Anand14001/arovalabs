import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';

/*
 * Site-wide smooth scrolling.
 *
 * Lenis runs in root mode, which means it drives the real window scroll
 * position rather than transforming a wrapper element. That matters: every
 * `position: sticky` element on the site (the header, the trust marquee) and
 * every scroll-linked measurement (`useScroll`, IntersectionObserver, the
 * counter widget) keeps working untouched.
 *
 * Tuning notes:
 *   lerp 0.085   — enough inertia to feel deliberate, short of feeling laggy.
 *   wheelMultiplier 0.9 — trims the overshoot that inertia otherwise adds to
 *                  a single wheel notch.
 *   syncTouch off — native momentum is better than anything we'd simulate, and
 *                  smoothing touch is the main cause of "scroll feels broken"
 *                  reports on mobile.
 */
const OPTIONS = {
  lerp: 0.085,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.6,
  syncTouch: false,
  autoRaf: true,
  anchors: true,
};

export default function SmoothScroll({ children }) {
  // Anyone who asked the OS for less motion gets plain native scrolling.
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  if (reduced) return children;

  return (
    <ReactLenis root options={OPTIONS}>
      {children}
    </ReactLenis>
  );
}
