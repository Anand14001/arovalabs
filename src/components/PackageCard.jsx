import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

/*
 * Package card as used by "Frequently Booked Packages" and the /packages/ grid.
 * Unlike the test card it shows a profile/test count, a bullet list of included
 * profiles, and both a "Book Now" and an "Add to Bag" action.
 */
export default function PackageCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="card relative flex h-full w-full flex-col overflow-hidden">
      {product.ribbon && (
        <span className="absolute left-0 top-3 z-10 rounded-r-full bg-accent px-3 py-1 text-[11px] font-bold text-white">
          {product.ribbon}
        </span>
      )}

      <Link
        to={`/product/${product.slug}/`}
        className="block aspect-[3/2] overflow-hidden bg-slate-100"
      >
        {product.cardImage ? (
          <img
            src={product.cardImage}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
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

        {product.profiles && (
          <p className="mt-1 text-xs font-semibold text-brand">{product.profiles}</p>
        )}

        <ul className="mt-2.5 flex-1 space-y-1.5">
          {(product.highlights || []).map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-start gap-1.5 text-xs text-body">
              <Check size={13} className="mt-0.5 shrink-0 text-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-ink">{formatPrice(product.salePrice)}</span>
          <span className="text-xs text-slate-400 line-through">
            {formatPrice(product.regularPrice)}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <button type="button" onClick={() => addItem(product.id)} className="btn-brand w-full">
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
