import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/*
 * Scroll-linked vertical offset for media.
 *
 * Because Lenis drives the real window scroll, `useScroll` reads the same
 * already-smoothed position Lenis writes — so the parallax inherits the scroll
 * easing for free and stays locked to the page instead of drifting behind it.
 * The extra spring only takes the edge off sub-pixel jitter.
 *
 * `distance` is the total travel in pixels across the element's full pass
 * through the viewport. Keep it small: media that outruns its frame reads as a
 * bug, not as depth.
 */
export default function Parallax({ children, distance = 60, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);
  const y = useSpring(raw, { stiffness: 220, damping: 40, mass: 0.4 });

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {/*
        The inner track is oversized by the travel distance so the media never
        exposes a gap at either end of its range.
      */}
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
