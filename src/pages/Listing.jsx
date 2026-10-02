import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import TestCard from '../components/TestCard';
import PackageCard from '../components/PackageCard';
import { listingPages } from '../data/pages';
import { packages, tests } from '../data/products';

/*
 * /tests/ and /packages/ — a search hero, two filter chips and a product grid.
 * Both routes share one Elementor template on the reference site, differing only
 * in heading, filter labels and the product type they list.
 */
export default function Listing({ which }) {
  const config = listingPages[which];
  const source = config.type === 'package' ? packages : tests;

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(config.filters[0]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.highlights || []).some((h) => h.toLowerCase().includes(q)) ||
        (p.parameters || []).some((x) => x.toLowerCase().includes(q)),
    );
  }, [query, source]);

  const Card = config.type === 'package' ? PackageCard : TestCard;

  return (
    <>
      {/* Search hero */}
      <section className="bg-gradient-to-br from-brand-light via-white to-accent-light">
        <div className="shell py-12 text-center sm:py-16">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">
            {config.heading}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-body sm:text-base">{config.sub}</p>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-6 flex max-w-xl flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="listing-search" className="sr-only">
              Search
            </label>
            <div className="flex w-full min-w-0 items-center rounded-lg border border-slate-300 bg-white focus-within:border-brand">
              <span className="pl-3 text-slate-400">
                <Search size={17} />
              </span>
              <input
                id="listing-search"
                type="search"
                name="s"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={config.searchPlaceholder}
                className="w-full rounded-lg px-3 py-3 text-sm outline-none"
              />
            </div>
            <button type="submit" className="btn-brand shrink-0">
              {config.searchButton}
            </button>
          </form>
        </div>
      </section>

      {/* Filter chips */}
      <section className="section">
        <div className="shell">
          <div className="flex flex-wrap gap-2">
            {config.filters.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setFilter(label)}
                aria-pressed={filter === label}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === label
                    ? 'bg-brand text-white'
                    : 'border border-slate-300 bg-white text-ink hover:border-brand hover:text-brand'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <p className="py-16 text-center text-sm text-body">
              No results matched “{query}”.
            </p>
          ) : (
            <div className="cards-grid mt-6">
              {results.map((product) => (
                <Card key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
