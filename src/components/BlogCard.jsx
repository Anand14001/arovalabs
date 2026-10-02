import { Link } from 'react-router-dom';

// Post card used by "Latest Health Blogs" and the /category/:slug/ archives.
export default function BlogCard({ post }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <Link to={`/${post.slug}/`} className="block aspect-[3/2] overflow-hidden bg-slate-100">
        {post.thumb && (
          <img
            src={post.thumb}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <Link
            to={`/category/${post.categorySlug}/`}
            className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-dark"
          >
            {post.category}
          </Link>
        )}

        <h3 className="mt-2 text-base font-bold leading-snug text-ink">
          <Link to={`/${post.slug}/`} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{post.excerpt}</p>

        <Link
          to={`/${post.slug}/`}
          className="mt-4 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Read More ➝
        </Link>
      </div>
    </article>
  );
}
