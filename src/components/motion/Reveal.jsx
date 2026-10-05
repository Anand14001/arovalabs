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
  /*
   * `onMount` plays the stagger as soon as the group mounts instead of waiting
   * for it to scroll into view.
   *
   * Use it for any set whose contents can change in place — a filtered results
   * grid, say. Two reasons: a tall grid can fail the in-view threshold on first
   * paint and sit at opacity 0 until the visitor happens to scroll, and if the
   * group is re-keyed to replay the stagger while it is already on screen,
   * `whileInView` may never re-fire and the new results never appear at all.
   * Content that is merely decorative keeps the scroll trigger.
   */
  onMount = false,
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

  const trigger = onMount
    ? { animate: 'shown' }
    : { whileInView: 'shown', viewport: VIEWPORT };

  return (
    <Tag
      className={className}
      initial="hidden"
      {...trigger}
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
