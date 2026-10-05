import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { decodeEntities } from '../lib/text';

/*
 * Post card, in three shapes:
 *
 *   default — the stacked card used by the /category/:slug/ archives.
 *   feature — the homepage lead post: larger crop, display-size title.
 *   row     — a compact horizontal entry, thumbnail left, for secondary posts.
 *
 * All three are the same component because the content and the link targets are
 * identical; only the crop and the type scale change. Keeping them in one place
 * is what stops the three from drifting apart.
 */
export default function BlogCard({ post, variant = 'default' }) {
  if (!post) return null;

  const href = `/${post.slug}/`;
  const row = variant === 'row';
  const feature = variant === 'feature';

  const meta = post.category && (
    <Link
      to={`/category/${post.categorySlug}/`}
      className="label text-accent transition-colors hover:text-accent-dark"
    >
      {post.category}
    </Link>
  );

  return (
    <article
      className={`card card-interactive group overflow-hidden ${
        row ? 'flex h-full flex-row' : 'flex h-full flex-col'
      }`}
    >
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`block shrink-0 overflow-hidden bg-brand-light/50 ${
          row ? 'w-[7.5rem] sm:w-[11rem]' : feature ? 'aspect-[16/10]' : 'aspect-[3/2]'
        }`}
      >
        {post.thumb && (
          <img
            src={post.thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${row ? 'p-5' : feature ? 'p-7' : 'p-6'}`}>
        {meta}

        <h3
          className={`font-bold leading-snug tracking-tight text-ink ${
            meta ? 'mt-3' : ''
          } ${feature ? 'text-[clamp(1.25rem,1.6vw,1.625rem)]' : 'text-base'}`}
        >
          <Link to={href} className="transition-colors hover:text-brand">
            {post.title}
          </Link>
        </h3>

        <p
          className={`mt-3 flex-1 leading-relaxed text-body ${
            row ? 'line-clamp-2-fixed text-[13px]' : 'text-sm'
          }`}
        >
          {decodeEntities(post.excerpt)}
        </p>

        <Link to={href} className="link-arrow mt-5">
          Read More
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
