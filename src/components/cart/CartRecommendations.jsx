import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { carouselSections } from '../../data/homepage';
import { formatPrice } from '../../lib/money';
import { useCuratedProducts } from '../../lib/catalog';
import { useCart } from '../../context/CartContext';
import Reveal, { RevealGroup, RevealItem } from '../motion/Reveal';

/*
 * Frequently booked tests, as a quiet footnote to the cart.
 *
 * Deliberately understated: compact rows with a single add control, not a grid
 * of product cards. The job of this page is to finish the booking that is
 * already half done, and a second storefront underneath the summary competes
 * with it. Anything already in the cart is filtered out, and the block
 * disappears entirely once there is nothing left to suggest.
 *
 * The heading and standfirst are the homepage's own for this set.
 */
export default function CartRecommendations() {
  const { items, addItem } = useCart();
  const { items: booked } = useCuratedProducts('frequentlyBookedTests');

  const inCart = new Set(items.map((i) => i.id));
  const suggestions = booked.filter((p) => p && !inCart.has(p.id)).slice(0, 3);

  if (suggestions.length === 0) return null;

  return (
    <section className="section rule-top">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="max-w-lg">
            <p className="label-section mb-4 text-ink/35">Add to your booking</p>
            <h2 className="display-md">{carouselSections.frequentTests.heading}</h2>
          </div>

          <Link to={carouselSections.frequentTests.viewMore} className="link-arrow shrink-0">
            View all
          </Link>
        </Reveal>

        <RevealGroup as="ul" stagger={0.06} className="mt-8 border-t border-ink/10">
          {suggestions.map((product) => (
            <RevealItem
              as="li"
              key={product.id}
              y={12}
              className="flex items-center gap-4 border-b border-ink/10 py-4 sm:gap-6"
            >
              <Link
                to={`/product/${product.slug}/`}
                tabIndex={-1}
                aria-hidden="true"
                className="block size-14 shrink-0 overflow-hidden rounded-xl bg-brand-light/50"
              >
                {product.cardImage && (
                  <img
                    src={product.cardImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-ink">
                  <Link
                    to={`/product/${product.slug}/`}
                    className="transition-colors hover:text-brand"
                  >
                    {product.title}
                  </Link>
                </h3>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-[12px] text-ink/35 line-through">
                    {formatPrice(product.regularPrice)}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => addItem(product.id)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-brand ring-1 ring-inset ring-brand/30 transition-all duration-300 hover:bg-brand hover:text-white hover:ring-brand"
              >
                <Plus size={14} aria-hidden="true" />
                Add
                <span className="sr-only"> {product.title} to cart</span>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
