import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { blogSection } from '../data/homepage';
import { usePosts } from '../lib/blog';
import SectionHeading from './SectionHeading';
import { decodeEntities } from '../lib/text';

/*
 * "Latest Health Blogs" — all three posts, in the reference site's order.
 *
 * Set as an index rather than as cards. Each post is a full-width row: number,
 * title, category and excerpt in a side column, and a thumbnail that appears on
 * hover. Three cards in a grid treat the newest post and the oldest as equals
 * and ask the reader to compare thumbnails; an index asks them to read titles,
 * which is what actually decides whether an article gets opened.
 *
 * The motion here is scroll-linked rather than triggered. Every other entrance
 * on the page fires once when an element crosses a threshold; these rows are
 * *scrubbed* — their position and opacity are a direct function of where the
 * row sits in the viewport, so they track the scroll exactly. Because Lenis
 * drives the scroll position, the rows inherit its easing: they arrive with the
 * same weight as the page itself rather than running their own timeline on top
 * of it, which is the difference between an animation that feels attached to
 * the scroll and one that feels played at you.
 *
 * A rule down the left of the list fills as you move through it, which makes
 * that link between scroll and motion explicit.
 *
 * All of it is skipped under `prefers-reduced-motion`.
 */
export default function BlogSection() {
  // The three most recent articles, straight from the API.
  const { posts: blogs } = usePosts({ limit: 3 });
  const listRef = useRef(null);
  const reduced = useReducedMotion();

  // Progress through the list itself, for the rail: 0 as the first row reaches
  // the middle of the viewport, 1 as the last one leaves it.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 75%', 'end 60%'],
  });
  const railScale = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.4,
  });

  return (
    <section className="section-lg rule-top">
      <div className="shell">
        <SectionHeading
          heading={blogSection.heading}
          sub={blogSection.sub}
          viewMore={`/category/${blogs[0]?.categorySlug ?? 'nutrition'}/`}
          viewMoreLabel="All articles"
        />

        <div ref={listRef} className="relative mt-14">
          {/*
            The scroll rail. Sits in the gutter beside the numbers, so it reads
            as the index's own spine rather than as a decoration bolted to the
            section edge. Hidden where there is no gutter to put it in.
          */}
          {!reduced && (
            <div
              aria-hidden="true"
              className="absolute -left-6 bottom-0 top-0 hidden w-px bg-ink/10 lg:block"
            >
              <motion.span
                style={{ scaleY: railScale }}
                className="absolute inset-0 block origin-top bg-accent"
              />
            </div>
          )}

          <ol className="border-t border-ink/12">
            {blogs.map((post, i) => (
              <BlogRow key={post.id} post={post} index={i} reduced={reduced} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/*
 * One row. Owns its own scroll progress — hooks can't live in a map callback,
 * and giving each row its own `useScroll` is also what lets the rows scrub
 * independently instead of sharing one timeline.
 */
function BlogRow({ post, index, reduced }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // From the row entering at the bottom of the viewport to it sitting
    // comfortably inside it — the row is fully resolved well before centre, so
    // nothing is still animating by the time it is being read.
    offset: ['start end', 'start 65%'],
  });

  /*
   * A spring on top of the scrubbed value. Scrubbing raw scroll is exact but
   * reads as mechanical; the spring adds just enough lag for the row to feel
   * like it has mass, without ever decoupling from the scroll position.
   */
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.5,
  });

  const opacity = useTransform(progress, [0, 1], [0, 1]);
  const y = useTransform(progress, [0, 1], [34, 0]);

  const content = (
    <article className="group relative border-b border-ink/12">
      <Link to={`/${post.slug}/`} className="block py-8 sm:py-10">
        <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:items-start lg:gap-10">
          <span className="label text-ink/25">{String(index + 1).padStart(2, '0')}</span>

          <h3 className="display-md text-ink transition-colors duration-300 group-hover:text-brand">
            {post.title}
          </h3>

          <div>
            {post.category && <span className="label mb-3 text-accent">{post.category}</span>}
            <p className="line-clamp-3-fixed text-sm leading-relaxed text-body">
              {decodeEntities(post.excerpt)}
            </p>
          </div>

          <span className="grid size-12 shrink-0 place-items-center rounded-full text-ink/35 ring-1 ring-inset ring-ink/12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-brand group-hover:text-white group-hover:ring-brand">
            <ArrowUpRight size={19} strokeWidth={1.75} />
          </span>
        </div>
      </Link>

      {/*
        The thumbnail is a hover affordance, not content: it fades in over the
        row's right-hand side on pointer devices and is never shown where there
        is no pointer to reveal it with.
      */}
      {post.thumb && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-24 top-1/2 hidden h-28 w-44 -translate-y-1/2 scale-95 overflow-hidden rounded-xl opacity-0 shadow-[var(--shadow-raise)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100 xl:block"
        >
          <img
            src={post.thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </span>
      )}
    </article>
  );

  if (reduced) return <li ref={ref}>{content}</li>;

  return (
    <motion.li ref={ref} style={{ opacity, y }} className="will-change-transform">
      {content}
    </motion.li>
  );
}
