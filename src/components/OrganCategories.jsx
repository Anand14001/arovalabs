import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { organSection } from '../data/homepage';
import { productTags } from '../data/taxonomies';
import SectionHeading from './SectionHeading';
import { RevealGroup, RevealItem } from './motion/Reveal';

/*
 * "Choose Test by Organ" — six entry points into the product_tag archives.
 *
 * This is a diagnostic directory, so the tiles are built to be read and aimed
 * at, not admired: a plain rounded card, the organ icon on a tinted square, the
 * name in semibold, and a hairline footer carrying the action. Nothing is
 * cropped into a decorative shape — a patient scanning for "kidney" should find
 * it on the first pass, and an unusual silhouette costs recognition speed
 * without buying anything back.
 *
 * On hover the icon plate fills with brand colour and the footer label resolves
 * from grey to teal, so the whole card reads as one target rather than as an
 * image with a link underneath it.
 *
 * Two up on a phone, three on a tablet, six across on a wide screen — a fixed
 * six-column grid would shrink the tap targets below a comfortable size long
 * before it ran out of room.
 */
export default function OrganCategories() {
  return (
    <section className="section-lg rule-top">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Browse by organ"
          heading={organSection.heading}
          sub={organSection.sub}
          viewMore={organSection.viewMore}
        />

        <RevealGroup
          as="ul"
          stagger={0.06}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {productTags.map((tag) => (
            <RevealItem key={tag.slug} as="li" y={16} className="flex">
              <Link
                to={`/product-tag/${tag.slug}/`}
                className="card card-interactive group flex w-full flex-col p-5"
              >
                <span className="grid size-14 place-items-center rounded-xl bg-brand-light transition-colors duration-300 group-hover:bg-brand">
                  <img
                    src={tag.icon}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    /*
                     * The tag icons are a mix of single-colour SVGs and one
                     * raster file, so no single CSS recolour works on all of
                     * them. Knocking them out to white suits either kind.
                     */
                    className="size-8 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                </span>

                {/*
                  Name and affordance share one row on a hairline. No label is
                  invented for the arrow — the reference site gives these tiles
                  no microcopy, and the card is already unambiguously a link.
                */}
                <span className="mt-5 flex flex-1 items-end justify-between gap-3 border-t border-ink/10 pt-4">
                  <span className="text-[15px] font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-brand">
                    {tag.name}
                  </span>
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="mb-0.5 shrink-0 text-ink/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                  />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
