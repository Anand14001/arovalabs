import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import ProductRow from '../components/ProductRow';
import TestCard from '../components/TestCard';
import PackageCard from '../components/PackageCard';
import Reveal, { RevealGroup, RevealItem } from '../components/motion/Reveal';
import { listingPages } from '../data/pages';
import { orderByOptions } from '../data/taxonomies';
import { useCategories, useProducts, useTags } from '../lib/catalog';

/*
 * /tests/ and /packages/ — the product catalogue.
 *
 * The reference site rendered a centred gradient hero, two filter chips and a
 * grid of cards. Three things were wrong with that:
 *
 *   1. The chips were decoration. `filter` was stored in state and never read,
 *      and the labels were "Tests" and "All", which don't describe two
 *      different sets anyway.
 *   2. There was no sort, no result count and no way to narrow by category,
 *      even though every product carries `cats` and the taxonomy already
 *      defines the sub-categories under each parent.
 *   3. There was one view, and it was the wrong one for half the work done
 *      here. Browsing wants cards — imagery, room to breathe. Comparing wants
 *      rows, because a grid puts every price at a different x-position and
 *      comparing two means hunting for them.
 *
 * So the catalogue offers both, and remembers nothing it shouldn't: cards by
 * default for arriving and browsing, rows one click away for comparing. The
 * header stacks title, standfirst and search in reading order, with the page's
 * own noun picked out of the headline in brand colour.
 *
 * Every label comes from content that already existed — the taxonomy's category
 * names, the reference site's own "All", and WooCommerce's sort options.
 */
export default function Listing({ which }) {
  const config = listingPages[which];
  const isPackage = config.type === 'package';
  const Card = isPackage ? PackageCard : TestCard;

  /*
   * The whole published catalogue is fetched once and narrowed here. See
   * lib/catalog.js for why filtering stays in the browser at this size — in
   * short, typing in the search box should not cost a network round trip.
   */
  const { products, isLoading, isError, refetch } = useProducts();
  const { categories: allCategories } = useCategories();
  const { tags: organTags } = useTags();

  const source = useMemo(
    () => products.filter((p) => (isPackage ? p.type === 'package' : p.type === 'test')),
    [products, isPackage],
  );

  // "All" is the reference site's own label for the unfiltered set, and
  // filters[0] is its noun for the type — "Tests" or "Packages".
  const ALL = config.filters.find((f) => f === 'All') ?? 'All';
  const noun = config.filters[0] ?? '';
  const parentSlug = isPackage ? 'packages' : 'tests';

  /*
   * Only categories that actually hold something. The taxonomy keeps empty
   * terms because their archive URLs still resolve, but a filter that leads to
   * an empty list is a dead end — the strip should only offer paths that go
   * somewhere.
   */
  const categories = useMemo(
    () =>
      allCategories
        .filter((c) => c.parent === parentSlug)
        .map((c) => ({ ...c, count: source.filter((p) => p.cats.includes(c.slug)).length }))
        .filter((c) => c.count > 0),
    [allCategories, parentSlug, source],
  );

  /*
   * Category and organ live in the query string, not in component state.
   *
   * A product breadcrumb, an organ tile and a search result all need to open
   * this page already narrowed, and a filter held only in state cannot be
   * linked to. Keeping it in the URL also makes a filtered view shareable and
   * survivable across a reload, and lets the browser back button undo a filter
   * the way people expect — chip clicks push a history entry rather than
   * replacing one, so Back steps back through the filters applied.
   */
  const [params, setParams] = useSearchParams();

  const categoryParam = params.get('category');
  const organParam = params.get('organ');

  /*
   * A filter from the URL is trusted until the taxonomy arrives, then checked.
   * Validating against an empty list during loading would silently drop the
   * filter a visitor arrived with and show them the unfiltered catalogue.
   */
  const category =
    categoryParam && (!allCategories.length || allCategories.some((c) => c.slug === categoryParam))
      ? categoryParam
      : ALL;

  const organ =
    organParam && (!organTags.length || organTags.some((t) => t.slug === organParam))
      ? organParam
      : null;

  const setCategory = (slug) => {
    const next = new URLSearchParams(params);
    // Category and organ are two ways of narrowing the same list, so picking
    // one clears the other rather than silently intersecting them.
    next.delete('organ');
    if (slug === ALL) next.delete('category');
    else next.set('category', slug);
    setParams(next);
  };

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('menu_order');
  const [view, setView] = useState('grid');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = source;

    if (category !== ALL) list = list.filter((p) => p.cats.includes(category));
    if (organ) list = list.filter((p) => (p.tags ?? []).includes(organ));

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q) ||
          (p.highlights || []).some((h) => h.toLowerCase().includes(q)) ||
          (p.parameters || []).some((x) => x.toLowerCase().includes(q)),
      );
    }

    // `menu_order` is the source order, so only the price sorts reorder.
    if (sort === 'price') list = [...list].sort((a, b) => a.salePrice - b.salePrice);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.salePrice - a.salePrice);

    return list;
  }, [query, category, organ, sort, source, ALL]);

  const filtered = category !== ALL || Boolean(organ) || query.trim().length > 0;

  const clearAll = () => {
    setQuery('');
    const next = new URLSearchParams(params);
    next.delete('category');
    next.delete('organ');
    setParams(next);
  };

  // An organ arrives from the homepage tiles and the search overlay; it has no
  // chip of its own, so it is surfaced as an active filter in the count row.
  const activeOrgan = organ ? organTags.find((t) => t.slug === organ) : null;

  const chips = [{ slug: ALL, name: ALL, count: source.length }, ...categories];
  const isGrid = view === 'grid';

  return (
    <>
      {/* ------------------------------------------------------- header */}
      <section className="border-b border-ink/10">
        <div className="shell py-12 sm:py-16">
          {/*
            Label, title, standfirst and search are centred on one axis and
            stacked in the order they are read. Each block keeps its own measure
            — the headline may run wider than the standfirst beneath it — so the
            centring is on the column, not on a single shared width.
          */}
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="label-section mb-5 text-ink/35">{noun}</p>

            {/*
              The page's own noun is picked out of the headline in brand colour.
              It is the one word that distinguishes /tests/ from /packages/, and
              both headings happen to contain it verbatim.
            */}
            <h1 className="display-lg">
              <Highlighted text={config.heading} word={noun} />
            </h1>

            <p className="section-sub mx-auto max-w-xl">{config.sub}</p>
          </Reveal>

          <Reveal delay={0.08} className="mx-auto mt-8 max-w-2xl">
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 ring-1 ring-inset ring-ink/15 transition-shadow focus-within:ring-2 focus-within:ring-brand"
            >
              <Search size={18} className="shrink-0 text-ink/35" aria-hidden="true" />
              <label htmlFor="listing-search" className="sr-only">
                {config.searchButton}
              </label>
              <input
                id="listing-search"
                type="search"
                name="s"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={config.searchPlaceholder}
                className="w-full min-w-0 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-ink/35"
              />
              <button type="submit" className="btn-brand shrink-0 !px-6 !py-2.5 text-[13px]">
                {config.searchButton}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------- filter strip */}
      <div className="border-b border-ink/10">
        <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/*
            One horizontal row that scrolls sideways on narrow screens rather
            than wrapping into a block that pushes the results below the fold.
            The negative margin lets it run to the screen edge, so a cut-off
            chip reads as "more this way".
          */}
          <div className="-mx-[clamp(1rem,4vw,5rem)] overflow-x-auto px-[clamp(1rem,4vw,5rem)] [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max items-center gap-2">
              {chips.map((c) => {
                const active = category === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCategory(c.slug)}
                    aria-pressed={active}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
                      active
                        ? 'bg-brand text-white'
                        : 'text-body ring-1 ring-inset ring-ink/12 hover:text-ink hover:ring-ink/30'
                    }`}
                  >
                    {c.name}
                    <span
                      className={`text-[11px] tabular-nums ${
                        active ? 'text-white/70' : 'text-ink/30'
                      }`}
                    >
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/*
            No shrink-0 here: the count, the sort and the view toggle together
            are wider than a 360px viewport, and a non-shrinking flex child
            pushes the whole page wider rather than wrapping. It wraps instead.
          */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 lg:flex-nowrap lg:justify-end">
            <p className="text-[13px] text-body">
              <span className="stat-figure text-base text-ink">{results.length}</span>{' '}
              {noun.toLowerCase()}
              {/*
                An organ narrowing arrives by link — from the homepage tiles or
                the search overlay — and has no chip in the strip, so it is named
                here. Otherwise the count would drop with nothing on screen
                explaining why.
              */}
              {activeOrgan && (
                <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 align-middle text-[12px] font-semibold text-brand">
                  {activeOrgan.name}
                </span>
              )}
              {filtered && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-3 inline-flex items-center gap-1.5 align-middle text-[13px] font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  <X size={13} />
                  {ALL}
                </button>
              )}
            </p>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-3 lg:flex-none">
              <label htmlFor="listing-sort" className="sr-only">
                {orderByOptions[0].label}
              </label>
              <select
                id="listing-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="min-w-0 cursor-pointer truncate rounded-full bg-white py-2 pl-4 pr-8 text-[13px] font-semibold text-ink outline-none ring-1 ring-inset ring-ink/12 transition-shadow focus:ring-2 focus:ring-brand"
              >
                {/*
                  Only the options the data can honour. Popularity, rating and
                  date have no values behind them here, and a sort that silently
                  does nothing is worse than one that isn't offered.
                */}
                {orderByOptions
                  .filter((o) => ['menu_order', 'price', 'price-desc'].includes(o.value))
                  .map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
              </select>

              {/* One segmented control, so the two views read as a pair rather
                  than as two unrelated buttons. */}
              <div className="flex shrink-0 items-center gap-1 rounded-full p-1 ring-1 ring-inset ring-ink/12">
                <ViewButton
                  active={isGrid}
                  onClick={() => setView('grid')}
                  label="Grid view"
                >
                  <LayoutGrid size={16} />
                </ViewButton>
                <ViewButton
                  active={!isGrid}
                  onClick={() => setView('list')}
                  label="List view"
                >
                  <List size={16} />
                </ViewButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------- results */}
      <section className="shell pb-16 pt-2 sm:pb-20">
        {isLoading ? (
          /*
           * Skeleton cards rather than a spinner: the grid keeps its shape, so
           * the page does not jump when the real cards land.
           */
          <ul
            className={
              isGrid ? 'mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'mt-8 space-y-3'
            }
            aria-busy="true"
            aria-label="Loading products"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className={`animate-pulse rounded-2xl bg-ink/[0.04] ${isGrid ? 'h-80' : 'h-28'}`}
              />
            ))}
          </ul>
        ) : isError ? (
          <Reveal className="py-24 text-center">
            <p className="display-md text-ink">We couldn’t load the catalogue.</p>
            <p className="section-sub mx-auto mt-2 max-w-md">
              This is usually temporary. Try again, or call us on{' '}
              <a href="tel:9442218998" className="text-brand underline">
                9442218998
              </a>{' '}
              to book over the phone.
            </p>
            <button type="button" onClick={() => refetch()} className="btn-brand mt-7">
              Try again
            </button>
          </Reveal>
        ) : results.length === 0 ? (
          <Reveal className="py-24 text-center">
            <p className="display-md text-ink">No results matched “{query}”.</p>
            <button type="button" onClick={clearAll} className="btn-outline mt-7">
              {ALL}
            </button>
          </Reveal>
        ) : (
          <RevealGroup
            as="ul"
            stagger={0.04}
            /*
             * Played on mount, not on scroll: the list is re-keyed whenever the
             * filters or the view change, and a scroll-triggered stagger would
             * leave the new results invisible when the list is already on
             * screen.
             */
            onMount
            key={`${view}-${category}-${organ}-${sort}-${query}`}
            className={
              isGrid
                ? 'mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
                : 'border-t border-ink/10'
            }
          >
            {results.map((product, i) => (
              <RevealItem
                as="li"
                key={product.id}
                y={12}
                className={isGrid ? 'flex' : ''}
              >
                {isGrid ? (
                  <Card product={product} />
                ) : (
                  <ProductRow product={product} index={i} variant={config.type} />
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </section>
    </>
  );
}

/*
 * Picks `word` out of `text` and colours it. Falls back to the plain string if
 * the word isn't in the heading, so a copy change can never break the title.
 */
function Highlighted({ text, word }) {
  if (!word) return text;

  const at = text.toLowerCase().indexOf(word.toLowerCase());
  if (at === -1) return text;

  return (
    <>
      {text.slice(0, at)}
      <span className="text-brand">{text.slice(at, at + word.length)}</span>
      {text.slice(at + word.length)}
    </>
  );
}

function ViewButton({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`grid size-8 place-items-center rounded-full transition-colors duration-300 ${
        active ? 'bg-brand text-white' : 'text-ink/40 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
