import { Link, Navigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import BlogCard from '../components/BlogCard';
import { blogs, getBlogBySlug } from '../data/blogs';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// Single post — /:slug/. Body HTML is the reference site's block markup, verbatim.
export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);

  if (!post) return <Navigate to="/404" replace />;

  const related = blogs.filter((b) => b.slug !== post.slug);

  return (
    <>
      <div className="shell">
        <Breadcrumbs
          trail={[{ label: post.category, to: `/category/${post.categorySlug}/` }]}
          current={post.title}
        />
      </div>

      <article className="shell-narrow pb-10">
        <Link
          to={`/category/${post.categorySlug}/`}
          className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-dark"
        >
          {post.category}
        </Link>

        <h1 className="mt-2 text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
          {post.title}
        </h1>

        <p className="mt-2 text-sm text-body">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>

        {post.large && (
          <img
            src={post.large}
            alt=""
            className="mt-6 w-full rounded-xl object-cover"
          />
        )}

        {/*
          Rendering the reference site's own block HTML keeps the article body
          byte-identical. The content is static, authored data — not user input.
        */}
        <div
          className="prose-arova mt-7"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {related.length > 0 && (
        <section className="section bg-slate-50">
          <div className="shell">
            <h2 className="section-title">More Health Blogs</h2>
            <div className="cards-grid-wide mt-8">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
