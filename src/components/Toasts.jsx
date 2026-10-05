import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

/*
 * Toasts for cart additions.
 *
 * Fed from the cart context, so anything that calls `addItem` raises one — the
 * product cards, the product page, the catalogue rows, the cart's own
 * suggestions — without a single call site having to remember to.
 *
 * It confirms what was added and carries the one action that follows from it.
 * A bare "Added to cart" tells someone nothing they didn't already know by
 * clicking; the item's name tells them they got the right one, and the link
 * saves a trip to the header.
 *
 * Bottom-right on desktop, top on mobile — a bottom toast on a phone lands on
 * the thumb and covers the button that raised it. The region is polite, so it
 * is announced after whatever the reader is on rather than interrupting.
 */
export default function Toasts() {
  const { toasts, dismissToast } = useCart();
  const reduced = useReducedMotion();

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:items-end sm:px-0"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout={!reduced}
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-full max-w-sm rounded-2xl bg-white p-4 shadow-[var(--shadow-float)] ring-1 ring-inset ring-ink/10"
          >
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-brand text-white">
                <Check size={15} strokeWidth={3} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">Added to cart</p>
                <p className="mt-0.5 truncate text-[13px] text-body">{toast.title}</p>

                <div className="mt-3 flex items-center gap-4">
                  <Link
                    to="/cart/"
                    onClick={() => dismissToast(toast.id)}
                    className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    View cart
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </Link>

                  {toast.price != null && (
                    <span className="text-[13px] tabular-nums text-ink/45">
                      {formatPrice(toast.price)}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label={`Dismiss, ${toast.title} added to cart`}
                className="grid size-7 shrink-0 place-items-center rounded-full text-ink/30 transition-colors hover:bg-brand-light hover:text-brand"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
