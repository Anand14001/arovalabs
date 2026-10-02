import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

/*
 * The reference site's floating cart bar (".fc-*" classes), with its Proceed
 * button linking to /cart/.
 *
 * It only appears once something is in the cart — an empty bar reading
 * "0 items selected" just covers page content for no benefit.
 */
export default function FloatingCart() {
  const { count, total } = useCart();

  if (count === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex w-full max-w-3xl items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-light text-brand">
          <ShoppingBag size={19} />
        </span>

        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-ink">
            {count} {count === 1 ? 'item' : 'items'} selected
          </p>
          <p className="text-sm font-bold text-brand">{formatPrice(total)}</p>
        </div>

        <Link to="/cart/" className="btn-accent shrink-0">
          Proceed
        </Link>
      </div>
    </div>
  );
}
