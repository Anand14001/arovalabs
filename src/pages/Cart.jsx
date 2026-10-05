import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Undo2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { emptyCart } from '../data/pages';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import EmptyCart from '../components/cart/EmptyCart';
import CartRecommendations from '../components/cart/CartRecommendations';
import Reveal from '../components/motion/Reveal';

/*
 * /cart/
 *
 * Rebuilt around what a diagnostics cart is actually for. The reference site
 * ships the WooCommerce default — a bordered table of rows and a "Cart totals"
 * box — which answers "what is in here" but not "what am I paying and what do I
 * do next".
 *
 * The page is now a two-column booking review: the selection on the left as
 * hairline-separated entries with their line totals in a single column, and a
 * sticky summary on the right carrying the arithmetic, the payable total and
 * the one action. Below it, a quiet set of frequently booked tests — secondary
 * by construction, because the job here is to finish the booking already
 * started.
 *
 * On state, honestly: the cart is React state mirrored into localStorage and
 * read synchronously, so there is no asynchronous fetch and therefore no
 * loading skeleton to design — inventing one would be theatre. What is real is
 * covered: removal animates out, quantity changes flash the total, a removal
 * can be undone, and an empty cart gets its own composition.
 *
 * Nothing about the cart logic changed. `addItem`, `removeItem`, `setQuantity`,
 * the totals and the localStorage persistence are untouched; this page only
 * presents them.
 */
export default function Cart() {
  const { items, count, total, setQuantity, removeItem, addItem } = useCart();
  const reduced = useReducedMotion();

  // Holds the last removed line so it can be put back. A removal is the one
  // destructive action here, and undo is cheaper than a confirm dialog.
  const [undoable, setUndoable] = useState(null);
  const undoTimer = useRef(null);

  useEffect(() => () => clearTimeout(undoTimer.current), []);

  const handleRemove = useCallback(
    (item) => {
      removeItem(item.id);
      setUndoable({ id: item.id, quantity: item.quantity, title: item.product.title });

      clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => setUndoable(null), 7000);
    },
    [removeItem],
  );

  const undo = useCallback(() => {
    if (!undoable) return;
    addItem(undoable.id, undoable.quantity);
    clearTimeout(undoTimer.current);
    setUndoable(null);
  }, [undoable, addItem]);

  // Both figures are derived from prices the products already carry, so the
  // payable total stays exactly what the cart context computes.
  const itemsTotal = items.reduce((sum, i) => sum + i.product.regularPrice * i.quantity, 0);
  const savings = itemsTotal - total;

  if (items.length === 0) {
    return (
      <>
        <EmptyCart />

        {/* The undo bar outlives the last item, so a cart emptied by accident
            is still recoverable. */}
        <UndoBar undoable={undoable} onUndo={undo} reduced={reduced} className="pb-16" />
      </>
    );
  }

  return (
    <>
      <section className="section">
        <div className="shell">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div>
              <p className="label-section mb-5 text-ink/35">
                <span className="label-num">{String(count).padStart(2, '0')}</span>
                {count === 1 ? 'item selected' : 'items selected'}
              </p>
              <h1 className="display-lg">Your booking</h1>
            </div>

            <Link to={emptyCart.returnTo} className="link-arrow shrink-0">
              <ArrowLeft size={16} aria-hidden="true" />
              {emptyCart.returnLabel}
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
            {/* ------------------------------------------- the selection */}
            <div>
              <ul className="border-t border-ink/10">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout={!reduced}
                      /*
                       * Collapsing height on exit is what stops the rows below
                       * snapping up the instant something is removed.
                       */
                      initial={reduced ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={reduced ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-b border-ink/10"
                    >
                      <CartItem item={item} onQuantity={setQuantity} onRemove={handleRemove} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <UndoBar undoable={undoable} onUndo={undo} reduced={reduced} className="mt-6" />
            </div>

            {/* --------------------------------------------- the summary */}
            <Reveal y={18} delay={0.06}>
              <OrderSummary
                itemsTotal={itemsTotal}
                savings={savings}
                total={total}
                count={count}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <CartRecommendations />
    </>
  );
}

/*
 * Undo affordance for the last removal. A polite live region, so the removal is
 * announced once rather than the whole list being re-read.
 */
function UndoBar({ undoable, onUndo, reduced, className = '' }) {
  return (
    <div aria-live="polite" className={className}>
      <AnimatePresence>
        {undoable && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="shell flex flex-wrap items-center justify-between gap-4 rounded-xl bg-brand-light px-5 py-3.5"
          >
            <p className="text-[13px] text-brand">
              Removed <span className="font-semibold">{undoable.title}</span>
            </p>

            <button
              type="button"
              onClick={onUndo}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand underline underline-offset-2 transition-colors hover:text-brand-dark"
            >
              <Undo2 size={14} aria-hidden="true" />
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
