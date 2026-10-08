import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { emptyCart } from '../../data/pages';
import { useProducts, useTags } from '../../lib/catalog';
import { carouselSections } from '../../data/homepage';
import Reveal, { RevealGroup, RevealItem } from '../motion/Reveal';
import { organHref } from '../../lib/listingRoutes';

/*
 * The empty cart.
 *
 * An empty cart is a dead end, and the only useful thing a dead end can do is
 * point somewhere. So this keeps the reference site's own message and return
 * link, then adds the one thing it was missing: somewhere to go. The organ
 * categories underneath are the site's existing product tags, which is the
 * shortest route from "nothing selected" to a page with tests on it.
 *
 * It is also deliberately not a full-page illustration. A cart that empties
 * mid-session should not feel like an error screen.
 */
export default function EmptyCart() {
  const { tags } = useTags();
  const { products } = useProducts();
  return (
    <div className="shell section-lg">
      <Reveal className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-light text-brand">
          <ShoppingBag size={26} strokeWidth={1.7} />
        </span>

        <h1 className="display-lg mt-8">{emptyCart.message}</h1>

        <p className="section-sub mx-auto max-w-md">
          {carouselSections.frequentTests.sub}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link to={emptyCart.returnTo} className="btn-brand group">
            {emptyCart.returnLabel}
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link to="/packages/" className="btn-outline">
            {carouselSections.frequentPackages.heading}
          </Link>
        </div>
      </Reveal>

      {/* ------------------------------------------- discovery shortcuts */}
      <Reveal delay={0.1} className="mt-16 flex items-center gap-4">
        <span className="label-section shrink-0 text-ink/35">Browse by organ</span>
        <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
      </Reveal>

      <RevealGroup
        as="ul"
        stagger={0.05}
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {tags.map((tag) => (
          <RevealItem as="li" key={tag.slug} y={14} className="flex">
            <Link
              to={organHref(tag.slug, products)}
              className="card card-interactive group flex w-full items-center gap-3 p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-light transition-colors duration-300 group-hover:bg-brand">
                <img
                  src={tag.icon}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-6 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                />
              </span>

              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink transition-colors group-hover:text-brand">
                {tag.name}
              </span>

              <ArrowUpRight
                size={14}
                aria-hidden="true"
                className="shrink-0 text-ink/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
