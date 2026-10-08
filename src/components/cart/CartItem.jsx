import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { formatPrice } from '../../lib/money';

/*
 * One selected test or package.
 *
 * Not an e-commerce row. The line that matters in a diagnostics cart is what
 * the test *is* — so the name leads, and under it sits the thing that
 * distinguishes one selection from another: a package's profile count, or a
 * test's own diagnostic category, both taken from the product's existing data.
 *
 * Pricing is split by role rather than crammed onto one line. The unit price
 * and its saving sit with the item; the line total sits in its own column on
 * the right, so a column of totals reads straight down the list and the
 * arithmetic of the summary below is visible without adding anything up.
 */
export default function CartItem({ item, onQuantity, onRemove }) {
  const { id, quantity, product } = item;
  const href = `/product/${product.slug}/`;

  // Packages publish a profile count; tests carry their category in the
  // breadcrumb the product page already uses.
  const meta =
    product.profiles ?? product.breadcrumb?.[product.breadcrumb.length - 1]?.label ?? null;

  const lineTotal = product.salePrice * quantity;
  const atMinimum = quantity <= 1;

  return (
    <article className="group relative flex gap-4 py-6 sm:gap-6">
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block size-20 shrink-0 overflow-hidden rounded-xl bg-brand-light/50 sm:size-24"
      >
        {product.archiveImage ? (
          <img
            src={product.archiveImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <span className="grid size-full place-items-center text-[10px] text-ink/30">
            No image
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-ink sm:text-base">
              <Link to={href} className="transition-colors hover:text-brand">
                {product.title}
              </Link>
            </h3>

            {meta && (
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand">{meta}</p>
            )}

            <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-sm font-semibold text-ink">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-[13px] text-ink/35 line-through">
                {formatPrice(product.regularPrice)}
              </span>
              {product.discount && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                  {product.discount}
                </span>
              )}
            </p>
          </div>

          {/* The line total, in its own column so totals align down the list. */}
          <p className="stat-figure shrink-0 text-lg text-ink sm:text-xl">
            {formatPrice(lineTotal)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <div
            className="flex items-center rounded-full ring-1 ring-inset ring-ink/15"
            role="group"
            aria-label={`Quantity for ${product.title}`}
          >
            <button
              type="button"
              onClick={() => onQuantity(id, quantity - 1)}
              disabled={atMinimum}
              aria-label={`Decrease quantity of ${product.title}`}
              className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:text-brand disabled:cursor-not-allowed disabled:text-ink/20"
            >
              <Minus size={14} />
            </button>

            {/*
              Announced politely so a screen reader hears the new quantity
              without the whole row being re-read.
            */}
            <span
              aria-live="polite"
              className="min-w-8 text-center text-sm font-semibold tabular-nums text-ink"
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => onQuantity(id, quantity + 1)}
              aria-label={`Increase quantity of ${product.title}`}
              className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:text-brand"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Labelled, not an icon alone — a bare bin icon is a guess. */}
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-body transition-colors hover:text-accent-dark"
          >
            <X size={14} aria-hidden="true" />
            Remove
            <span className="sr-only"> {product.title} from cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
