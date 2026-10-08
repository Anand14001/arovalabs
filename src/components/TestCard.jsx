import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/money';
import { useCart } from '../context/CartContext';

/*
 * Test card — used by the homepage rails and by the /tests/ grid.
 *
 * Price hierarchy is the one thing worth getting right here: the payable
 * figure is the largest type in the card, the struck-through original sits
 * beside it at label size, and the saving (which the reference site stores as
 * the product's ribbon) is pinned to the image rather than competing with the
 * price row. The card is width-agnostic so its container decides the layout.
 */
export default function TestCard({ product }) {
  const { addItem } = useCart();
  const href = `/product/${product.slug}/`;

  return (
    <article className="card card-interactive group relative flex h-full w-full flex-col overflow-hidden">
      <Link to={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-light/50">
          {product.cardImage ? (
            <img
              src={product.cardImage}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          ) : (
            // Matches the reference site, where this product has no featured image.
            <span className="grid size-full place-items-center text-xs text-ink/30">
              No image
            </span>
          )}

          {product.ribbon && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              {product.ribbon}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-bold leading-snug tracking-tight text-ink">
          <Link to={href} className="transition-colors hover:text-brand">
            {product.title}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-body">
          {product.cardExcerpt}
        </p>

        <p className="mt-5 flex items-baseline gap-2 border-t border-ink/8 pt-4">
          <span className="stat-figure text-xl text-ink">{formatPrice(product.salePrice)}</span>
          <span className="text-[13px] text-ink/35 line-through">
            {formatPrice(product.regularPrice)}
          </span>
        </p>

        <button
          type="button"
          onClick={() => addItem(product.id)}
          className="btn-brand mt-4 w-full"
        >
          Book Now
        </button>
      </div>
    </article>
  );
}
