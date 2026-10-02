import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { emptyCart } from '../data/pages';

/*
 * /cart/ — the reference site could only be observed in its empty state, so the
 * empty view is exact and the populated view follows the WooCommerce default
 * layout (AUDIT.md §4).
 */
export default function Cart() {
  const { items, total, setQuantity, removeItem } = useCart();

  return (
    <section className="section">
      <div className="shell">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Cart</h1>

        {items.length === 0 ? (
          <div className="mt-6 card p-6 text-center sm:p-10">
            <p className="text-sm text-body">{emptyCart.message}</p>
            <Link to={emptyCart.returnTo} className="btn-brand mt-5">
              {emptyCart.returnLabel}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-4">
              {items.map(({ id, quantity, product }) => (
                <li key={id} className="card flex gap-4 p-4">
                  <Link to={`/product/${product.slug}/`} className="shrink-0">
                    <img
                      src={product.archiveImage}
                      alt=""
                      className="size-20 rounded-lg object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-ink">
                      <Link to={`/product/${product.slug}/`} className="hover:text-brand">
                        {product.title}
                      </Link>
                    </h2>

                    <p className="mt-1 text-sm text-body">
                      {formatPrice(product.salePrice)}{' '}
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(product.regularPrice)}
                      </span>
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-slate-300">
                        <button
                          type="button"
                          onClick={() => setQuantity(id, quantity - 1)}
                          aria-label={`Decrease quantity of ${product.title}`}
                          className="px-2.5 py-1.5 text-ink hover:text-brand"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(id, quantity + 1)}
                          aria-label={`Increase quantity of ${product.title}`}
                          className="px-2.5 py-1.5 text-ink hover:text-brand"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-ink">
                    {formatPrice(product.salePrice * quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <aside className="card h-fit p-5 lg:sticky lg:top-24">
              <h2 className="text-base font-bold text-ink">Cart totals</h2>

              <dl className="mt-4 space-y-2 border-b border-slate-100 pb-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-body">Subtotal</dt>
                  <dd className="font-semibold text-ink">{formatPrice(total)}</dd>
                </div>
              </dl>

              <div className="mt-4 flex justify-between text-base font-bold text-ink">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Link to="/checkout/" className="btn-brand mt-5 w-full">
                Proceed to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
