import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { emptyCart } from '../data/pages';

/*
 * /checkout/ — observed empty on the reference site; the populated view follows
 * the WooCommerce default (AUDIT.md §4).
 *
 * No order is ever placed and no payment is ever taken: the reference site's
 * payment backend is not reachable, and the notice below says so plainly rather
 * than implying a booking succeeded.
 */
export default function Checkout() {
  const { items, total } = useCart();

  return (
    <section className="section">
      <div className="shell">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Checkout</h1>

        {items.length === 0 ? (
          <div className="mt-6 card p-6 text-center sm:p-10">
            <p className="text-sm text-body">{emptyCart.message}</p>
            <Link to={emptyCart.returnTo} className="btn-brand mt-5">
              {emptyCart.returnLabel}
            </Link>
          </div>
        ) : (
          <>
            <div
              role="note"
              className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
            >
              <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-900">
                <strong className="font-semibold">Phase 1 recreation.</strong> The reference site’s
                WooCommerce order and payment backend is not available here, so this form cannot
                place a real booking or take a payment. The fields and layout are reproduced for
                review only.
              </p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
              <form className="card space-y-4 p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
                <h2 className="text-base font-bold text-ink">Billing details</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { name: 'first_name', label: 'First name', type: 'text', required: true },
                    { name: 'last_name', label: 'Last name', type: 'text', required: true },
                  ].map((f) => (
                    <div key={f.name}>
                      <label
                        htmlFor={`co-${f.name}`}
                        className="mb-1.5 block text-sm font-semibold text-ink"
                      >
                        {f.label} <span className="text-accent">*</span>
                      </label>
                      <input
                        id={`co-${f.name}`}
                        name={f.name}
                        type={f.type}
                        required={f.required}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                      />
                    </div>
                  ))}
                </div>

                {[
                  { name: 'phone', label: 'Phone', type: 'tel', required: true },
                  { name: 'email', label: 'Email address', type: 'email', required: true },
                  { name: 'address', label: 'Street address', type: 'text', required: true },
                  { name: 'city', label: 'Town / City', type: 'text', required: true },
                  { name: 'postcode', label: 'PIN code', type: 'text', required: true },
                ].map((f) => (
                  <div key={f.name}>
                    <label
                      htmlFor={`co-${f.name}`}
                      className="mb-1.5 block text-sm font-semibold text-ink"
                    >
                      {f.label} <span className="text-accent">*</span>
                    </label>
                    <input
                      id={`co-${f.name}`}
                      name={f.name}
                      type={f.type}
                      required={f.required}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="co-notes"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Order notes (optional)
                  </label>
                  <textarea
                    id="co-notes"
                    name="notes"
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
              </form>

              <aside className="card h-fit p-5 lg:sticky lg:top-24">
                <h2 className="text-base font-bold text-ink">Your order</h2>

                <ul className="mt-4 space-y-3 border-b border-slate-100 pb-4">
                  {items.map(({ id, quantity, product }) => (
                    <li key={id} className="flex justify-between gap-3 text-sm">
                      <span className="text-body">
                        {product.title} <span className="text-slate-400">× {quantity}</span>
                      </span>
                      <span className="shrink-0 font-semibold text-ink">
                        {formatPrice(product.salePrice * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-between text-base font-bold text-ink">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <button type="button" disabled className="btn mt-5 w-full cursor-not-allowed bg-slate-200 text-slate-500">
                  Place order (unavailable)
                </button>

                <p className="mt-2 text-center text-xs text-body">
                  Payment integration is out of scope for Phase 1.
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
