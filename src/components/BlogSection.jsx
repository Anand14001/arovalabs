import { blogSection } from '../data/homepage';
import { blogs } from '../data/blogs';
import BlogCard from './BlogCard';
import SectionHeading from './SectionHeading';

// "Latest Health Blogs" — all three posts, in the reference site's order.
export default function BlogSection() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading heading={blogSection.heading} />

        <div className="cards-grid-wide mt-8">
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
