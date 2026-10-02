import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import BlogCard from '../components/BlogCard';
import { getBlogsByCategory } from '../data/blogs';
import { getBlogCategoryBySlug } from '../data/taxonomies';

// /category/:slug/ — the reference site titles these "Category: <Name>".
export default function BlogCategory() {
  const { slug } = useParams();
  const category = getBlogCategoryBySlug(slug);
  const posts = getBlogsByCategory(slug);
  const name = category ? category.name : slug;

  return (
    <>
      <div className="shell">
        <Breadcrumbs current={`Category: ${name}`} />
      </div>

      <section className="section pt-0">
        <div className="shell">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Category: {name}</h1>

          {posts.length === 0 ? (
            <p className="py-16 text-sm text-body">No posts found in this category.</p>
          ) : (
            <div className="cards-grid-wide mt-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
