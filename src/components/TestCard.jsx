import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

/*
 * Test card as used by "Frequently Booked Tests" / "Most Prescribed Tests" and
 * the /tests/ grid. The reference site truncates the description with ".."
 * (p.cardExcerpt) and shows a ribbon on some cards.
 */
export default function TestCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="card relative flex h-full w-full flex-col overflow-hidden">
      {product.ribbon && (
        <span className="absolute left-0 top-3 z-10 rounded-r-full bg-accent px-3 py-1 text-[11px] font-bold text-white">
          {product.ribbon}
        </span>
      )}

      <Link to={`/product/${product.slug}/`} className="block aspect-[3/2] overflow-hidden bg-slate-100">
        {product.cardImage ? (
          <img
            src={product.cardImage}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          // Matches the reference site, where this product has no featured image.
          <span className="grid size-full place-items-center text-xs text-slate-400">
            No image
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold leading-snug text-ink">
          <Link to={`/product/${product.slug}/`} className="hover:text-brand">
            {product.title}
          </Link>
        </h3>

        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-body">{product.cardExcerpt}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-ink">{formatPrice(product.salePrice)}</span>
          <span className="text-xs text-slate-400 line-through">
            {formatPrice(product.regularPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => addItem(product.id)}
          className="btn-brand mt-3 w-full"
        >
          Book Now
        </button>
      </div>
    </article>
  );
}
