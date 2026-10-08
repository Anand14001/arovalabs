import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ArticleIndex from '../components/blog/ArticleIndex';
import Reveal from '../components/motion/Reveal';
import { usePosts, useBlogCategories } from '../lib/blog';
import { blogSection } from '../data/homepage';

/*
 * A category archive — /category/:slug/
 *
 * The reference page was "Category: Nutrition" over a grid of cards, which is
 * the WordPress default and reads like a database view.
 *
 * It now opens like a section of a publication: the category name as the
 * headline with the post count beside it, a row of the other categories that
 * actually hold posts, and the articles as a numbered index. Choosing what to
 * read is done by reading titles, and a grid of thumbnails asks the eye to
 * compare pictures instead.
 *
 * Categories with nothing in them are left out of the switcher — the taxonomy
 * keeps them because their URLs still resolve, but a filter that leads nowhere
 * is a dead end. The empty state below still handles those URLs directly.
 */
export default function BlogCategory() {
  const { slug } = useParams();
  const { categories } = useBlogCategories();
  const { posts, isLoading } = usePosts({ category: slug });

  const category = categories.find((c) => c.slug === slug);
  const name = category ? category.name : slug;
  // Only categories that actually hold something: a filter leading to an empty
  // page is a dead end, and the API already counts them.
  const blogCategories = categories.filter((c) => c.postCount > 0);
  const totalElsewhere = categories
    .filter((c) => c.slug !== slug)
    .reduce((sum, c) => sum + c.postCount, 0);

  const populated = blogCategories.map((c) => ({ ...c, count: c.postCount }));

  return (
    <>
      <section className="border-b border-ink/10">
        <div className="shell py-12 sm:py-16">
          <Reveal className="max-w-3xl">
            <p className="label-section mb-6 text-ink/35">{blogSection.heading}</p>

            <h1 className="display-lg">
              {name}
              <span className="ml-4 align-middle text-[0.4em] font-semibold tabular-nums text-ink/30">
                {posts.length}
              </span>
            </h1>
          </Reveal>

          {/* The other categories worth switching to. */}
          {populated.length > 1 && (
            <Reveal delay={0.08} className="mt-9 flex flex-wrap items-center gap-2">
              {populated.map((c) => {
                const active = c.slug === slug;
                return (
                  <Link
                    key={c.slug}
                    to={`/category/${c.slug}/`}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-brand text-white'
                        : 'text-body ring-1 ring-inset ring-ink/12 hover:text-ink hover:ring-ink/30'
                    }`}
                  >
                    {c.name}
                    <span
                      className={`text-[11px] tabular-nums ${
                        active ? 'text-white/70' : 'text-ink/30'
                      }`}
                    >
                      {c.count}
                    </span>
                  </Link>
                );
              })}
            </Reveal>
          )}
        </div>
      </section>

      <section className="section-lg">
        <div className="shell">
          {posts.length === 0 ? (
            <Reveal className="py-16 text-center">
              <p className="display-md text-ink">No posts found in this category.</p>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-body">
                {totalElsewhere} {totalElsewhere === 1 ? 'article is' : 'articles are'}{' '}
                published across the other categories.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {populated.map((c) => (
                  <Link key={c.slug} to={`/category/${c.slug}/`} className="btn-outline group">
                    {c.name}
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                ))}
              </div>
            </Reveal>
          ) : (
            <ArticleIndex posts={posts} />
          )}
        </div>
      </section>
    </>
  );
}
