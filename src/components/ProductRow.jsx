import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

/*
 * A catalogue row.
 *
 * The listing pages used to be a grid of cards, which is the wrong shape for
 * what people actually do here: scan a list of named tests and compare prices.
 * A card grid forces the eye to zig-zag and puts every price at a different
 * x-position, so comparing two of them means hunting. A row puts the name, the
 * detail and the price on one line, with prices stacked in a single column — it
 * reads top-to-bottom like the price list it is.
 *
 * It is also the pattern the rest of the site already uses for sets of things:
 * the booking actions, the collection steps, the journal and the FAQ are all
 * numbered, hairline-separated rows.
 *
 * Both product types share the row. A package carries its profile count and its
 * included-profile chips where a test carries its excerpt — same skeleton,
 * different middle.
 */
export default function ProductRow({ product, index, variant = 'test' }) {
  const { addItem } = useCart();
  const href = `/product/${product.slug}/`;
  const isPackage = variant === 'package';

  const price = (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 lg:flex-col lg:flex-nowrap lg:items-end">
      <span className="stat-figure text-xl text-ink">{formatPrice(product.salePrice)}</span>
      <span className="text-[13px] text-ink/35 line-through">
        {formatPrice(product.regularPrice)}
      </span>
      {product.discount && (
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          {product.discount}
        </span>
      )}
    </p>
  );

  return (
    <article className="group border-b border-ink/10 transition-colors duration-300 hover:bg-brand-light/25">
      <div className="flex gap-4 px-2 py-5 sm:gap-5 lg:items-center lg:gap-7 lg:py-6">
        {/* The running number is the index's spine — desktop only, where there
            is room for it without crowding the thumbnail. */}
        <span className="label hidden w-8 shrink-0 text-ink/25 lg:block">
          {String(index + 1).padStart(2, '0')}
        </span>

        <Link
          to={href}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block size-20 shrink-0 overflow-hidden rounded-xl bg-brand-light/50 sm:size-24"
        >
          {product.cardImage ? (
            <img
              src={product.cardImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
            />
          ) : (
            <span className="grid size-full place-items-center text-[10px] text-ink/30">
              No image
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          {product.ribbon && (
            <span className="mb-1.5 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {product.ribbon}
            </span>
          )}

          <h3 className="text-base font-semibold leading-snug tracking-tight text-ink">
            <Link to={href} className="transition-colors group-hover:text-brand">
              {product.title}
            </Link>
          </h3>

          {isPackage ? (
            <>
              {product.profiles && (
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand">
                  {product.profiles}
                </p>
              )}

              {/* Included profiles as chips rather than a bullet list: on one
                  line they stay scannable, and they wrap instead of making the
                  row tall. */}
              <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                {(product.highlights || []).map((item, i) => (
                  <li
                    key={`${item}-${i}`}
                    className="flex items-center gap-1.5 text-[12.5px] text-body"
                  >
                    <Check size={12} strokeWidth={3} className="shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-body">
              {product.cardExcerpt}
            </p>
          )}

          {/* Below lg the price and the action ride under the content rather
              than forcing a third column into a phone's width. */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 lg:hidden">
            {price}
            <button
              type="button"
              onClick={() => addItem(product.id)}
              className="btn-brand shrink-0 !px-5 !py-2.5 text-[13px]"
            >
              Book Now
            </button>
          </div>
        </div>

        <div className="hidden shrink-0 lg:block">{price}</div>

        <div className="hidden w-36 shrink-0 flex-col gap-2 lg:flex">
          <button
            type="button"
            onClick={() => addItem(product.id)}
            className="btn-brand w-full !px-4 !py-2.5 text-[13px]"
          >
            Book Now
          </button>
          {isPackage && (
            <button
              type="button"
              onClick={() => addItem(product.id)}
              className="btn-outline w-full !px-4 !py-2.5 text-[13px]"
            >
              Add to Bag
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
