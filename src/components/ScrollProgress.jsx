import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/*
 * Hairline read-progress bar pinned to the very top of the viewport.
 *
 * On a page as long as the homepage this is the cheapest orientation cue there
 * is, and it also makes the smooth scrolling legible — you can see the inertia
 * settle. Driven by transform only, so it never triggers layout.
 */
export default function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 320, damping: 44, mass: 0.3 });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent"
    />
  );
}
