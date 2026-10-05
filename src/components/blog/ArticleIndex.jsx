import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { RevealGroup, RevealItem } from '../motion/Reveal';
import { decodeEntities } from '../../lib/text';

/*
 * A list of articles, as an index.
 *
 * Shared by the category archives and the "more articles" block at the foot of
 * a post, so the two can never drift apart. Rows rather than cards: on an
 * archive the decision is made by reading titles, and a grid of thumbnails asks
 * the eye to compare pictures instead. The thumbnail is still there — it
 * appears beside the row on hover, where there is room for it.
 */
export default function ArticleIndex({ posts, startIndex = 0, playOnMount = true }) {
  if (posts.length === 0) return null;

  return (
    /*
     * `playOnMount` defaults on, and that default is load-bearing.
     *
     * A scroll-triggered stagger needs a quarter of the list inside the
     * viewport before it fires. On a category holding a single article, the row
     * lands just below that threshold on a short window — measured invisible at
     * 1440×620 and 1280×560 — and the entire contents of the page sat at
     * opacity 0 until the visitor happened to scroll. An archive's list is the
     * page; it cannot be contingent on scroll position.
     *
     * The "read next" block at the foot of an article passes false: it is far
     * below the fold by construction, so it is always scrolled to and keeps the
     * entrance.
     */
    <RevealGroup
      as="ol"
      stagger={0.07}
      onMount={playOnMount}
      className="border-t border-ink/12"
    >
      {posts.map((post, i) => (
        <RevealItem as="li" key={post.id} y={14}>
          <article className="group relative border-b border-ink/12">
            <Link to={`/${post.slug}/`} className="block py-7 sm:py-9">
              <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1.15fr)_minmax(0,1fr)_auto] lg:items-start lg:gap-10">
                <span className="label text-ink/25">
                  {String(startIndex + i + 1).padStart(2, '0')}
                </span>

                <h3 className="display-md text-ink transition-colors duration-300 group-hover:text-brand">
                  {post.title}
                </h3>

                <div>
                  {post.category && (
                    <span className="label mb-3 text-accent">{post.category}</span>
                  )}
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
              A hover affordance, not content: it only appears where there is a
              pointer to reveal it with and room to show it.
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
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
