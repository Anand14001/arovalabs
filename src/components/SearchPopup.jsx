import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchPlaceholder, site } from '../data/site';
import { formatPrice, products } from '../data/products';

// Recreates Elementor popup 881 (the header's search overlay).
export default function SearchPopup({ open, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q) ||
          (p.parameters || []).some((x) => x.toLowerCase().includes(q)),
      )
      .slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative mt-10 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <img src={site.logo} alt={site.title} className="h-9 w-auto" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="popup-search" className="sr-only">
            Search
          </label>
          <div className="flex items-center rounded-lg border border-slate-300 focus-within:border-brand">
            <input
              id="popup-search"
              type="search"
              name="s"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-l-lg px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="px-4 py-3 text-brand hover:text-brand-dark"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {query.trim() && (
          <div className="mt-4 max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <p className="py-6 text-center text-sm text-body">
                No tests or packages matched “{query}”.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/product/${p.slug}/`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-1 py-3 hover:bg-slate-50"
                    >
                      <img
                        src={p.archiveImage}
                        alt=""
                        className="size-11 shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {p.title}
                        </span>
                        <span className="block truncate text-xs text-body">{p.excerpt}</span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-brand">
                        {formatPrice(p.salePrice)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
