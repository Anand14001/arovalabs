import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { formatPrice } from '../lib/money';
import { useCart } from '../context/CartContext';

/*
 * Package card, in two orientations.
 *
 * A package is bought on what is inside it, so the included-profiles list is
 * always given room and nothing is ever truncated away. The profile count sits
 * directly under the title, since it is the single figure that tells one
 * package from another at a glance.
 *
 *   portrait (default) — image above content. Used by the /packages/ grid and
 *     the mobile rail, where cards sit in columns.
 *
 *   landscape — image beside content. Used by the scroll-pinned run on the
 *     homepage. A pinned section can only be as tall as the viewport, and a
 *     portrait card carrying an image, five profiles, a price and two actions
 *     runs past the bottom of a laptop screen — which clipped the "Book Now"
 *     buttons out of reach. Turning the card on its side moves the image out of
 *     the vertical budget entirely: same content, roughly two-thirds the height.
 */
export default function PackageCard({ product, layout = 'portrait' }) {
  const { addItem } = useCart();
  const href = `/product/${product.slug}/`;
  const wide = layout === 'landscape';

  const image = (
    <Link
      to={href}
      tabIndex={-1}
      aria-hidden="true"
      className={`relative block shrink-0 overflow-hidden bg-brand-light/50 ${
        wide ? 'w-[38%] self-stretch' : 'aspect-[16/9]'
      }`}
    >
      {product.cardImage ? (
        <img
          src={product.cardImage}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
      ) : (
        <span className="grid size-full place-items-center text-xs text-ink/30">No image</span>
      )}

      {product.ribbon && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          {product.ribbon}
        </span>
      )}
    </Link>
  );

  return (
    <article
      className={`card card-interactive group relative w-full overflow-hidden ${
        wide ? 'flex' : 'flex h-full flex-col'
      }`}
    >
      {image}

      <div className={`flex flex-1 flex-col ${wide ? 'p-5' : 'p-5'}`}>
        <h3 className="text-base font-semibold leading-snug tracking-tight text-ink">
          <Link to={href} className="transition-colors hover:text-brand">
            {product.title}
          </Link>
        </h3>

        {product.profiles && (
          <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            {product.profiles}
          </p>
        )}

        <ul className={`flex-1 ${wide ? "mt-3 space-y-1.5" : "mt-4 space-y-2"}`}>
          {(product.highlights || []).map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-start gap-2 text-[13px] text-body">
              <Check size={13} strokeWidth={3} className="mt-1 shrink-0 text-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className={`flex items-baseline gap-2 border-t border-ink/10 ${wide ? "mt-4 pt-3" : "mt-5 pt-4"}`}>
          <span className="stat-figure text-xl text-ink">{formatPrice(product.salePrice)}</span>
          <span className="text-[13px] text-ink/35 line-through">
            {formatPrice(product.regularPrice)}
          </span>
        </p>

        {/*
          Side by side in landscape — there is width to spare there, and it
          keeps both actions on one line instead of adding another 50px to a
          card whose height is the constrained dimension.
        */}
        <div className={`mt-4 flex gap-2 ${wide ? "flex-row" : "flex-col"}`}>
          <button
            type="button"
            onClick={() => addItem(product.id)}
            className="btn-brand w-full"
          >
            Book Now
          </button>
          <button
            type="button"
            onClick={() => addItem(product.id)}
            className="btn-outline w-full"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </article>
  );
}
