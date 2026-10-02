import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { formatPrice, getProductsByCategory, getProductsByTag, products } from '../data/products';
import { getCategoryByPath, getTagBySlug, orderByOptions, productCategories } from '../data/taxonomies';

/*
 * The default WooCommerce archive template, which the reference site uses for
 * /shop/, /product-category/:path/ and /product-tag/:slug/ alike: a results
 * count, an "orderby" select and a grid of cards with a "Sale!" flash.
 */
export default function ProductArchive({ mode = 'shop' }) {
  const params = useParams();
  const [orderBy, setOrderBy] = useState('menu_order');
  const { addItem } = useCart();

  const { title, trail, list } = useMemo(() => {
    if (mode === 'tag') {
      const tag = getTagBySlug(params.slug);
      return {
        title: tag ? tag.name : params.slug,
        trail: [],
        list: getProductsByTag(params.slug),
      };
    }

    if (mode === 'category') {
      // Route is /product-category/:parent/:child? — rebuild the term path.
      const path = [params.parent, params.child].filter(Boolean).join('/');
      const term = getCategoryByPath(path);
      const parentTerm = params.child
        ? productCategories.find((c) => c.slug === params.parent)
        : null;

      return {
        title: term ? term.name : params.parent,
        trail: parentTerm
          ? [{ label: parentTerm.name, to: `/product-category/${parentTerm.path}/` }]
          : [],
        list: term ? getProductsByCategory(term.slug) : [],
      };
    }

    return { title: 'Shop', trail: [], list: products };
  }, [mode, params.slug, params.parent, params.child]);

  const sorted = useMemo(() => {
    const copy = [...list];
    switch (orderBy) {
      case 'price':
        return copy.sort((a, b) => a.salePrice - b.salePrice);
      case 'price-desc':
        return copy.sort((a, b) => b.salePrice - a.salePrice);
      case 'date':
        return copy.sort((a, b) => b.id - a.id);
      default:
        /*
         * WooCommerce's "Default sorting" is menu_order, then title. Every
         * product on the reference site has menu_order 0, so its archives come
         * out alphabetical — Fasting Blood Glucose, LFT, Nalam-A, Nalam-B,
         * Postprandial, Urea, then the Women Wellness variants.
         */
        return copy.sort((a, b) => a.title.localeCompare(b.title, 'en'));
    }
  }, [list, orderBy]);

  return (
    <>
      <div className="shell">
        <Breadcrumbs trail={trail} current={title} />
      </div>

      <section className="section pt-0">
        <div className="shell">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>

          <div className="mt-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-body">
              {sorted.length === 0
                ? 'No products were found matching your selection.'
                : `Showing all ${sorted.length} result${sorted.length === 1 ? '' : 's'}`}
            </p>

            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">Sort products</span>
              <select
                name="orderby"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              >
                {orderByOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {sorted.length > 0 && (
            <ul className="cards-grid mt-6">
              {sorted.map((product) => (
                <li key={product.id} className="card relative flex flex-col overflow-hidden">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Sale!
                  </span>

                  <Link
                    to={`/product/${product.slug}/`}
                    className="block aspect-square overflow-hidden bg-slate-100"
                  >
                    <img
                      src={product.archiveImage}
                      alt={product.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="text-sm font-bold leading-snug text-ink">
                      <Link to={`/product/${product.slug}/`} className="hover:text-brand">
                        {product.title}
                      </Link>
                    </h2>

                    <div className="mt-2 flex flex-1 items-baseline gap-2">
                      <span className="text-base font-bold text-ink">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(product.regularPrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addItem(product.id)}
                      className="btn-brand mt-3 w-full"
                    >
                      Book Now
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
