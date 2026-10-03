import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import useRail from '../hooks/useRail';
import useMediaQuery from '../hooks/useMediaQuery';
import RailArrows from './RailArrows';
import TestCard from './TestCard';
import PackageCard from './PackageCard';
import Reveal, { RevealGroup, RevealItem } from './motion/Reveal';

/*
 * A titled product set. The layout follows the content rather than the other
 * way round, which is why there are three of them:
 *
 *   grid    — a set that fits on screen (the four-item test sets). Showing all
 *             of it at once beats hiding three quarters behind a drag.
 *   run     — a set that doesn't fit (the six-item package set), on a wide
 *             screen: the section pins and the cards travel sideways as the
 *             page scrolls. This is where the smooth scrolling earns its keep —
 *             Lenis drives the scroll position, so the sideways motion inherits
 *             the same easing and glides instead of stepping.
 *   rail    — the same overflowing set on a narrow screen, or for anyone who
 *             asked for reduced motion: an ordinary snap rail with arrows. No
 *             pinning, no hijacked scroll, nothing to fight on a phone.
 *
 * Pinning a set that already fits would produce a full-viewport section in
 * which nothing moves, so the choice is made from the item count, not from
 * taste.
 */
export default function ProductShowcase({
  index,
  eyebrow,
  heading,
  sub,
  viewMore,
  viewMoreLabel = 'View all',
  products,
  variant = 'test',
}) {
  const reduced = useReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');

  const Card = variant === 'package' ? PackageCard : TestCard;
  const overflows = products.length > 4;

  const headingProps = { index, eyebrow, heading, sub, viewMore, viewMoreLabel };

  if (!overflows) {
    return <Grid {...headingProps} products={products} Card={Card} />;
  }

  return wide && !reduced ? (
    <PinnedRun {...headingProps} products={products} Card={Card} variant={variant} />
  ) : (
    <ScrollRail {...headingProps} products={products} Card={Card} variant={variant} />
  );
}

/* -------------------------------------------------------------------- grid */

function Grid({ products, Card, ...headingProps }) {
  return (
    <section className="section-lg rule-top">
      <div className="shell">
        <ShowcaseHeading {...headingProps} />

        <RevealGroup
          as="ul"
          stagger={0.07}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((product, i) => (
            <RevealItem as="li" key={`${product.id}-${i}`} y={18} className="flex">
              <Card product={product} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ pinned */

/*
 * Vertical chrome around the cards while pinned: the top clearance for the
 * sticky site header, the heading row, the padding around the track and the
 * progress rule beneath it. One number, because it is the budget the cards get
 * to spend.
 */
const PIN_CHROME = 232;

/*
 * How far the cards may be scaled down to fit a short window. Below this the
 * type stops being comfortable to read, so the card keeps its size and the
 * section simply shows a little less of it.
 */
const MIN_SCALE = 0.72;

function PinnedRun({ products, Card, variant, ...headingProps }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [travel, setTravel] = useState(0);

  /*
   * A pinned section can only ever be as tall as the viewport and it clips
   * whatever overflows, which is how the "Book Now" buttons ended up cut off
   * the bottom of the screen. Two things keep that from happening:
   *
   *   1. Packages run as landscape cards here, which moves the image out of the
   *      vertical budget and brings a card to roughly two-thirds the height.
   *   2. Whatever is still over budget is taken out by scaling the track. The
   *      card's natural height is measured and compared against the space
   *      actually available, and the shortfall becomes a scale factor.
   *
   * Scaling rather than falling back to an arrow rail is the deliberate call:
   * the sideways-on-scroll motion is the point of this section, and dropping it
   * on a short laptop screen — where most people will see the page — would mean
   * the effect only ever shows up for some visitors. A card at 0.85 is still
   * perfectly legible; a section that silently becomes something else is not
   * the same section.
   */
  const [scale, setScale] = useState(1);
  const cardHeight = useRef(0);

  const wide = variant === 'package';
  const cardWidth = wide ? 'w-[min(90vw,34rem)]' : 'w-[20rem]';

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    // The card itself, not the track — the track carries its own padding, and
    // counting that here would charge it to the budget twice.
    const card = track.firstElementChild;
    cardHeight.current = card?.offsetHeight || cardHeight.current;

    const available = window.innerHeight - PIN_CHROME;
    const next =
      cardHeight.current > 0
        ? Math.min(1, Math.max(MIN_SCALE, available / cardHeight.current))
        : 1;
    setScale(next);

    /*
     * Travel is measured in the parent's pixels, so the track's width has to be
     * taken after scaling — `transform: translateX() scale()` applies the
     * translation in the parent's space, not the scaled child's.
     */
    const gutter = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    setTravel(Math.max(track.scrollWidth * next - window.innerWidth + gutter, 0));
  }, []);

  useLayoutEffect(measure, [measure, products]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    // Card widths are fixed, but webfont swap and image loads still shift them.
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, [measure]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const progress = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

  return (
    <section
      ref={sectionRef}
      className="rule-top"
      /* One viewport to hold the pin, plus exactly the distance to travel. */
      style={{ height: `calc(100svh + ${travel}px)` }}
    >
      {/*
        `justify-between` rather than `justify-center`: the heading sits against
        the top of the viewport and the progress rule against the bottom, so the
        cards get every pixel left over instead of competing with centred
        whitespace.
      */}
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden pb-8 pt-20">
        <div className="shell">
          <ShowcaseHeading {...headingProps} compact />
        </div>

        <motion.div
          ref={trackRef}
          /*
           * Origin at the left edge so the scale shrinks the track towards the
           * gutter it starts from, keeping the first card's left edge aligned
           * with the heading above it at any scale.
           */
          style={{ x, scale, transformOrigin: '0% 50%' }}
          className="flex w-max gap-5 py-4 pl-[clamp(1rem,4vw,5rem)] will-change-transform"
        >
          {products.map((product, i) => (
            <div key={`${product.id}-${i}`} className={`flex ${cardWidth}`}>
              <Card product={product} layout={wide ? 'landscape' : 'portrait'} />
            </div>
          ))}
        </motion.div>

        <div className="shell">
          <div className="rail-progress">
            <motion.span style={{ scaleX: progress }} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- rail */

function ScrollRail({ products, Card, variant, ...headingProps }) {
  const rail = useRail();

  return (
    <section className="section-lg rule-top">
      <div className="shell">
        <ShowcaseHeading {...headingProps} />
      </div>

      {/*
        RevealGroup is the rail element itself rather than a wrapper, so the
        rail's scroll container and the stagger live on one node.
      */}
      <RevealGroup
        ref={rail.ref}
        stagger={0.06}
        role="list"
        aria-label={headingProps.heading}
        className="rail mt-12 gap-4 px-[clamp(1rem,4vw,5rem)]"
      >
        {products.map((product, i) => (
          <RevealItem
            key={`${product.id}-${i}`}
            role="listitem"
            className={`flex ${variant === 'package' ? 'w-[82vw] max-w-sm' : 'w-[74vw] max-w-xs'}`}
          >
            <Card product={product} />
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="shell mt-8 flex items-center gap-6">
        <div className="rail-progress max-w-xs flex-1">
          <span
            style={{ transform: `scaleX(${Math.max(rail.progress, 0.08)})` }}
            aria-hidden="true"
          />
        </div>

        <RailArrows
          onPrev={() => rail.step(-1)}
          onNext={() => rail.step(1)}
          atStart={rail.atStart}
          atEnd={rail.atEnd}
        />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- heading */

/*
 * `compact` is the pinned variant: every pixel the heading takes is a pixel the
 * cards lose, so the standfirst moves out of the heading's column and sits
 * beside the link instead of stacking under the title. Same content, roughly
 * half the height.
 */
function ShowcaseHeading({ index, eyebrow, heading, sub, viewMore, viewMoreLabel, compact }) {
  if (compact) {
    return (
      <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div>
          <p className="label mb-3 text-ink/35">
            <span className="label-num">{index}</span>
            {eyebrow}
          </p>
          <h2 className="display-lg">{heading}</h2>
        </div>

        <div className="flex shrink-0 items-end gap-8">
          {sub && <p className="hidden max-w-xs text-sm leading-relaxed text-body xl:block">{sub}</p>}
          {viewMore && (
            <Link to={viewMore} className="link-arrow shrink-0">
              {viewMoreLabel}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
      <div className="max-w-xl">
        <p className="label mb-6 text-ink/35">
          <span className="label-num">{index}</span>
          {eyebrow}
        </p>
        <h2 className="display-lg">{heading}</h2>
        {sub && <p className="section-sub max-w-md">{sub}</p>}
      </div>

      {viewMore && (
        <Link to={viewMore} className="link-arrow shrink-0">
          {viewMoreLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </Reveal>
  );
}
