import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { formatPrice } from '../../lib/money';
// Still static: these blocks are site settings and move to the API with the
// content step, not the catalogue one.
import { productBenefits, taxNotice } from '../../data/products';

/*
 * The booking summary.
 *
 * Three figures, in the order someone checks them: what the tests list at, what
 * they are saving, what they will pay. The total is the largest type on the
 * page after the heading — a cart's whole job is to answer "how much" in about
 * a second, and every other number here exists to explain that one.
 *
 * The saving is derived, not invented: every product carries a `regularPrice`
 * and a `salePrice`, so the item total is the sum of the former and the
 * discount is the difference. The payable total still comes from the cart
 * context untouched, so nothing about the pricing logic moves.
 *
 * The trust lines under the button are the three the site already publishes on
 * every product page. No security or accreditation claim is invented here.
 */
export default function OrderSummary({ itemsTotal, savings, total, count }) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="card p-6 sm:p-7">
        <h2 className="text-base font-semibold tracking-tight text-ink">Booking summary</h2>
        <p className="mt-1 text-[13px] text-body">
          {count} {count === 1 ? 'item' : 'items'}
        </p>

        <dl className="mt-6 space-y-3 border-t border-ink/10 pt-6 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-body">Item total</dt>
            <dd className="font-semibold tabular-nums text-ink">{formatPrice(itemsTotal)}</dd>
          </div>

          {savings > 0 && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-body">Discount</dt>
              <dd className="font-semibold tabular-nums text-accent">
                −{formatPrice(savings)}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 border-t border-ink/10 pt-6">
          <div className="flex items-end justify-between gap-4">
            <span className="text-sm font-semibold text-ink">Total</span>
            {/*
              Re-keyed on the value so the figure cross-fades when a quantity
              changes — the number updating is the feedback that the change
              landed.
            */}
            <motion.span
              key={total}
              initial={{ opacity: 0.35, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="stat-figure text-[clamp(1.5rem,2vw,1.875rem)] text-ink"
            >
              {formatPrice(total)}
            </motion.span>
          </div>

          <p className="mt-2 text-right text-[12px] text-ink/45">{taxNotice}</p>

          {savings > 0 && (
            <p className="mt-4 rounded-full bg-accent-light px-4 py-2 text-center text-[13px] font-semibold text-accent-dark">
              You save {formatPrice(savings)}
            </p>
          )}
        </div>

        <Link to="/checkout/" className="btn-brand group mt-6 w-full">
          Proceed to checkout
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        {/*
          Reassurance, kept to three quiet lines rather than a wall of badges.
          These are the benefits the site prints on every product page.
        */}
        <ul className="mt-6 space-y-2.5 border-t border-ink/10 pt-6">
          {productBenefits.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-2.5">
              <Check size={13} strokeWidth={3} className="mt-1 shrink-0 text-brand" />
              <span className="text-[13px] leading-snug text-body">{benefit.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
