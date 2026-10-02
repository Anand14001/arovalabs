import { Link } from 'react-router-dom';
import { organSection } from '../data/homepage';
import { productTags } from '../data/taxonomies';
import SectionHeading from './SectionHeading';

// "Choose Test by Organ" — tiles link to the product_tag archives.
export default function OrganCategories() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          heading={organSection.heading}
          sub={organSection.sub}
          viewMore={organSection.viewMore}
        />

        <ul className="cards-grid-tight mt-8">
          {productTags.map((tag) => (
            <li key={tag.slug}>
              <Link
                to={`/product-tag/${tag.slug}/`}
                className="card flex flex-col items-center gap-3 p-4 transition-colors hover:border-brand hover:bg-brand-light/40"
              >
                <img src={tag.icon} alt={tag.name} loading="lazy" className="size-10 object-contain sm:size-12" />
                <span className="text-center text-xs font-semibold text-ink sm:text-sm">
                  {tag.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
