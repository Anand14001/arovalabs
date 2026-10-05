import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  CornerDownLeft,
  FileText,
  LayoutGrid,
  Search,
  X,
} from 'lucide-react';
import useSearchIndex from './useSearchIndex';
import useRecentSearches from '../../hooks/useRecentSearches';
import { formatPrice, frequentlyBookedTests } from '../../data/products';
import { productTags } from '../../data/taxonomies';
import { searchPlaceholder } from '../../data/site';
import { carouselSections } from '../../data/homepage';

/*
 * The search overlay.
 *
 * A command-palette rather than a modal with a text field in it: one large
 * input, grouped results underneath, and the whole thing driven from the
 * keyboard. The old popup put the site logo and a close button above a bordered
 * input, then listed up to eight products with no grouping and no way to reach
 * them except the mouse.
 *
 * Three things shape the design:
 *
 *   It never shows an empty panel. With no query it offers the site's actual
 *   frequently booked tests, the organ categories, and whatever the visitor
 *   searched for before — searching should not require already knowing the
 *   name of a test.
 *
 *   It searches everything, not just products: tests, packages, categories,
 *   organ tags, articles and pages, grouped by what they are.
 *
 *   It is keyboard-first. Arrow keys walk the flattened result list across
 *   group boundaries, Enter opens the highlighted row, Escape closes, and focus
 *   returns to the trigger that opened it.
 *
 * All filtering is local — the catalogue is already in the bundle — so there is
 * no request to debounce and no loading state to design.
 */
export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const restoreFocusTo = useRef(null);

  const navigate = useNavigate();
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const uid = useId();

  const { groups, flat, total } = useSearchIndex(query);
  const { recent, remember, forget, clear } = useRecentSearches();

  const hasQuery = query.trim().length > 0;

  /* ------------------------------------------------------ open / close */

  useEffect(() => {
    if (!open) return undefined;

    // Remember what had focus so it can be handed back on close.
    restoreFocusTo.current = document.activeElement;

    setQuery('');
    setActive(0);

    // Lenis listens on the window, so hiding body overflow alone would leave it
    // free to keep scrolling the page behind the overlay.
    lenis?.stop();
    document.body.style.overflow = 'hidden';

    const id = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      cancelAnimationFrame(id);
      lenis?.start();
      document.body.style.overflow = '';
      restoreFocusTo.current?.focus?.();
    };
  }, [open, lenis]);

  // A new query invalidates the highlight.
  useEffect(() => setActive(0), [query]);

  const go = useCallback(
    (entry) => {
      if (!entry) return;
      remember(query);
      onClose();
      navigate(entry.to);
    },
    [navigate, onClose, query, remember],
  );

  /* ------------------------------------------------------- keyboard */

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    // Keep focus inside the panel while it is open.
    if (event.key === 'Tab') {
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }

    if (!flat.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(flat.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(flat[active]);
    }
  };

  // Keep the highlighted row in view when it moves by keyboard.
  useEffect(() => {
    if (!hasQuery) return;
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active, hasQuery]);

  /* -------------------------------------------------- discovery data */

  const popular = useMemo(() => frequentlyBookedTests.filter(Boolean).slice(0, 4), []);

  if (!open) return null;

  const activeId = flat.length ? `${uid}-option-${active}` : undefined;

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search Arova Labs"
        onKeyDown={onKeyDown}
        initial={reduced ? false : { opacity: 0, y: -12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        /*
          Full screen on a phone, a panel pinned near the top on anything
          larger. Capped rather than centred: a palette that floats in the
          middle of a 2560px display reads as a dialogue box, where one anchored
          below the navigation reads as part of the site.
        */
        className="absolute inset-0 flex flex-col bg-white sm:inset-x-0 sm:bottom-auto sm:top-[7vh] sm:mx-auto sm:max-h-[82vh] sm:w-[min(92vw,46rem)] sm:rounded-2xl sm:shadow-[var(--shadow-float)] lg:w-[min(90vw,52rem)]"
      >
        {/* ------------------------------------------------- the input */}
        <div className="flex shrink-0 items-center gap-3 border-b border-ink/10 px-4 sm:px-6">
          <Search size={20} className="shrink-0 text-ink/35" aria-hidden="true" />

          <label htmlFor={`${uid}-input`} className="sr-only">
            Search tests, packages and pages
          </label>
          <input
            id={`${uid}-input`}
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={hasQuery}
            aria-controls={`${uid}-results`}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck="false"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent py-5 text-base text-ink outline-none placeholder:text-ink/30 sm:py-6 sm:text-lg"
          />

          {hasQuery && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="grid size-8 shrink-0 place-items-center rounded-full text-ink/40 transition-colors hover:bg-brand-light hover:text-brand"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink/50 ring-1 ring-inset ring-ink/12 transition-colors hover:bg-ink hover:text-white hover:ring-ink"
          >
            Esc
          </button>
        </div>

        {/* ----------------------------------------------- the results */}
        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {!hasQuery ? (
            <EmptyState
              popular={popular}
              recent={recent}
              onPick={(term) => {
                setQuery(term);
                inputRef.current?.focus();
              }}
              onForget={forget}
              onClear={clear}
              onNavigate={(to) => {
                onClose();
                navigate(to);
              }}
            />
          ) : total === 0 ? (
            <NoResults
              query={query}
              onNavigate={(to) => {
                onClose();
                navigate(to);
              }}
            />
          ) : (
            <ul id={`${uid}-results`} role="listbox" aria-label="Search results" className="py-2">
              {groups.map((group) => (
                <li key={group.kind} role="presentation">
                  <p className="px-4 pb-2 pt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35 sm:px-6">
                    {group.label}
                  </p>

                  <ul role="presentation">
                    {group.items.map((entry) => {
                      const index = flat.indexOf(entry);
                      return (
                        <ResultRow
                          key={entry.id}
                          id={`${uid}-option-${index}`}
                          index={index}
                          entry={entry}
                          active={index === active}
                          onHover={() => setActive(index)}
                          onSelect={() => go(entry)}
                        />
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Keyboard legend — desktop only, where there is a keyboard to use. */}
        <div className="hidden shrink-0 items-center gap-5 border-t border-ink/10 px-6 py-3 text-[11px] text-ink/40 sm:flex">
          <Hint keys="↑ ↓">Navigate</Hint>
          <Hint icon={<CornerDownLeft size={11} />}>Open</Hint>
          <Hint keys="Esc">Close</Hint>
          {hasQuery && (
            <span className="ml-auto tabular-nums" aria-live="polite">
              {total} {total === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------- a result */

const KIND_ICON = { category: LayoutGrid, page: FileText, article: FileText };

function ResultRow({ id, index, entry, active, onHover, onSelect }) {
  const Icon = KIND_ICON[entry.kind];
  const isProduct = entry.kind === 'test' || entry.kind === 'package';

  return (
    <li role="presentation">
      <button
        id={id}
        type="button"
        role="option"
        aria-selected={active}
        data-index={index}
        onMouseMove={onHover}
        onFocus={onHover}
        onClick={onSelect}
        className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors sm:px-6 ${
          active ? 'bg-brand-light/60' : ''
        }`}
      >
        {/* Media: the product or article image where there is one, a glyph
            where there isn't — so every row has the same left edge. */}
        {entry.image ? (
          <img
            src={entry.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-11 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
            {entry.icon ? (
              <img src={entry.icon} alt="" loading="lazy" className="size-5 object-contain" />
            ) : Icon ? (
              <Icon size={17} />
            ) : (
              <Search size={17} />
            )}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-[15px] font-semibold transition-colors ${
              active ? 'text-brand' : 'text-ink'
            }`}
          >
            {entry.title}
          </span>
          {entry.subtitle && (
            <span className="mt-0.5 block truncate text-[12.5px] text-body">
              {entry.subtitle}
            </span>
          )}
        </span>

        {isProduct ? (
          <span className="shrink-0 text-right">
            <span className="block text-[15px] font-semibold tabular-nums text-ink">
              {formatPrice(entry.salePrice)}
            </span>
            {entry.discount && (
              <span className="mt-0.5 block text-[11px] font-bold uppercase tracking-wider text-accent">
                {entry.discount}
              </span>
            )}
          </span>
        ) : (
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className={`shrink-0 transition-colors ${active ? 'text-brand' : 'text-ink/20'}`}
          />
        )}
      </button>
    </li>
  );
}

/* ---------------------------------------------------------- empty state */

function EmptyState({ popular, recent, onPick, onForget, onClear, onNavigate }) {
  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6">
      {recent.length > 0 && (
        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
              Recent
            </h2>
            <button
              type="button"
              onClick={onClear}
              className="text-[12px] font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              Clear
            </button>
          </div>

          <ul className="flex flex-wrap gap-2">
            {recent.map((term) => (
              <li key={term} className="flex items-center rounded-full ring-1 ring-inset ring-ink/12">
                <button
                  type="button"
                  onClick={() => onPick(term)}
                  className="flex items-center gap-2 py-2 pl-3.5 pr-2 text-[13px] text-body transition-colors hover:text-brand"
                >
                  <Clock size={13} className="shrink-0 text-ink/30" aria-hidden="true" />
                  {term}
                </button>
                <button
                  type="button"
                  onClick={() => onForget(term)}
                  aria-label={`Remove ${term} from recent searches`}
                  className="grid size-7 shrink-0 place-items-center rounded-full text-ink/30 transition-colors hover:text-accent-dark"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-7">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
          {carouselSections.frequentTests.heading}
        </h2>

        <ul className="grid gap-1 sm:grid-cols-2">
          {popular.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => onPick(product.title)}
                className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-brand-light/50"
              >
                <Search size={14} className="shrink-0 text-ink/25" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[14px] text-ink transition-colors group-hover:text-brand">
                  {product.title}
                </span>
                <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink/50">
                  {formatPrice(product.salePrice)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
          Browse by organ
        </h2>

        <ul className="flex flex-wrap gap-2">
          {productTags.map((tag) => (
            <li key={tag.slug}>
              <button
                type="button"
                onClick={() => onNavigate(`/product-tag/${tag.slug}/`)}
                className="flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-[13px] font-medium text-body ring-1 ring-inset ring-ink/12 transition-all hover:text-brand hover:ring-brand/40"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-light">
                  <img src={tag.icon} alt="" loading="lazy" className="size-3.5 object-contain" />
                </span>
                {tag.name}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------- no results */

function NoResults({ query, onNavigate }) {
  const destinations = [
    { label: 'Tests', to: '/tests/' },
    { label: 'Packages', to: '/packages/' },
    { label: 'Contact Us', to: '/contact-us/' },
  ];

  return (
    <div className="px-6 py-14 text-center">
      <p className="text-lg font-semibold text-ink">
        No matches for <span className="text-brand">“{query.trim()}”</span>
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-body">
        Try a test name, a category, or an organ — or pick up one of these instead.
      </p>

      <ul className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        {destinations.map((d) => (
          <li key={d.to}>
            <button
              type="button"
              onClick={() => onNavigate(d.to)}
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-ink ring-1 ring-inset ring-ink/15 transition-all hover:bg-brand hover:text-white hover:ring-brand"
            >
              {d.label}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Hint({ keys, icon, children }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="grid min-w-[1.5rem] place-items-center rounded border border-ink/15 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-ink/55">
        {icon ?? keys}
      </kbd>
      {children}
    </span>
  );
}
