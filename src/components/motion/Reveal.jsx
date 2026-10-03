import { motion, useReducedMotion } from 'framer-motion';

/*
 * The page's single scroll-entrance primitive.
 *
 * Everything that animates in on the homepage goes through `Reveal` (or
 * `RevealGroup` + `RevealItem` for staggered sets) so the whole page shares one
 * distance, one duration and one easing curve. The curve is the same
 * ease-out-expo the CSS layer uses, which is what makes the entrances feel
 * related to the Lenis scroll rather than bolted on top of it.
 *
 * `once: true` matters — re-animating on every pass makes a long page feel
 * twitchy, and re-entering elements are no longer "new" information.
 */
const EASE = [0.16, 1, 0.3, 1];
const VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -8% 0px' };

export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 18,
  duration = 0.75,
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/*
 * Staggered container. Children must be `RevealItem`s; the parent owns the
 * timing so a row of cards cascades instead of all arriving at once.
 */
export function RevealGroup({
  children,
  as = 'div',
  stagger = 0.07,
  delay = 0,
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ children, as = 'div', y = 18, className = '', ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
