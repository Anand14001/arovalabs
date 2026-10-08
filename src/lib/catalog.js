/*
 * Catalogue data for the website.
 *
 * Two jobs:
 *
 * 1. Fetching. The whole published catalogue is loaded once and filtered in the
 *    browser. That is a deliberate choice for a catalogue of this size — ten
 *    products today, a few dozen plausibly — because it keeps the listing page
 *    instant while typing, where a server round trip per keystroke against a
 *    remote database would not be. Past roughly a hundred products this should
 *    move to the API's own filtering, which already supports every filter used
 *    here; `PAGE_LIMIT` is where that shows up as a truncated list.
 *
 * 2. Shaping. The API speaks in paise and objects; these components were built
 *    against rupees and slug arrays. Rather than rewrite nineteen components,
 *    the translation happens once here. This is a view model, not a shim: the
 *    components want what a page needs, the API returns what a database holds,
 *    and the two are allowed to differ.
 */

import { useQuery } from '@tanstack/react-query';
import { api } from './api';

const PAGE_LIMIT = 100;

/** API product → the shape the cards, rows and detail template expect. */
export const toProduct = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    // Components branch on lowercase 'test' / 'package'.
    type: p.type === 'PACKAGE' ? 'package' : 'test',

    regularPrice: p.price.regularRupees,
    salePrice: p.price.saleRupees,
    discount: p.price.discountLabel,

    cardExcerpt: p.excerpt ?? p.cardExcerpt ?? '',
    excerpt: p.excerpt ?? '',
    excerptSecondary: p.excerptSecondary ?? null,
    overview: p.overview ?? '',

    badges: p.badges ?? [],
    ribbon: p.ribbon ?? null,
    profiles: p.profiles ?? null,
    highlights: p.highlights ?? [],

    // Images are URLs now, not paths into /assets.
    cardImage: p.image?.url ?? p.cardImage?.url ?? null,
    detailImage: p.detailImage?.url ?? p.image?.url ?? null,
    archiveImage: p.archiveImage?.url ?? p.image?.url ?? null,
    imageAlt: p.image?.alt ?? '',

    cats: (p.categories ?? []).map((c) => c.slug),
    tags: (p.tags ?? []).map((t) => t.slug),

    parameters: p.parameters ?? [],
    parametersUnavailable: p.parametersUnavailable ?? false,
    parameterGroups: (p.parameterGroups ?? []).map((g) => ({
      name: g.name,
      // The old data joined these into one string; the components still read it
      // that way, and the database now keeps them as rows.
      items: (g.items ?? []).join(', '),
    })),
    showAllParametersButton: p.showAllParametersCta ?? false,

    /*
     * Preparation steps are one table in the database but two shapes on the
     * page, because the reference site stored them differently per type: a test
     * lists plain strings under "Preparation", a package lists titled cards
     * under "Pre-test Instructions". Both templates are kept as they were, so
     * the view model hands each the shape it already renders.
     */
    preparation: (p.preparation ?? []).map((s) => s.text),
    preTest: p.preparation ?? [],
    process: p.process ?? [],
    audience: p.audience ?? [],
    faqs: p.faqs ?? [],

    breadcrumb: p.breadcrumb ?? [],
    seo: p.seo,
  };
};

export const toCategory = (c) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  path: c.path,
  // The old taxonomy stored the parent's *slug*; the API returns a parent id
  // and nests children, so the parent slug is reattached while flattening.
  parent: c.parentSlug ?? null,
  count: c.productCount ?? 0,
});

/** Nested category tree → the flat list with parent slugs the site uses. */
export const flattenCategories = (nodes, parentSlug = null) =>
  (nodes ?? []).flatMap((n) => [
    toCategory({ ...n, parentSlug }),
    ...flattenCategories(n.children, n.slug),
  ]);

// ---------------------------------------------------------------- hooks

const CATALOG_KEY = ['catalog', 'products'];

export function useProducts() {
  const query = useQuery({
    queryKey: CATALOG_KEY,
    queryFn: () => api.products({ limit: PAGE_LIMIT }),
    // The catalogue changes when an admin edits it, not minute to minute.
    staleTime: 5 * 60_000,
  });

  return {
    ...query,
    products: (query.data?.items ?? []).map(toProduct),
    truncated: (query.data?.pagination?.total ?? 0) > PAGE_LIMIT,
  };
}

export function useProduct(slug) {
  const query = useQuery({
    queryKey: ['catalog', 'product', slug],
    queryFn: () => api.product(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
    // A missing product is an answer, not a failure worth retrying.
    retry: (count, error) => error?.status !== 404 && count < 2,
  });

  return { ...query, product: toProduct(query.data?.product) };
}

export function useRelated(slug) {
  const query = useQuery({
    queryKey: ['catalog', 'related', slug],
    queryFn: () => api.related(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  });
  return { ...query, items: (query.data?.items ?? []).map(toProduct) };
}

export function useCategories() {
  const query = useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: api.categories,
    staleTime: 10 * 60_000,
  });
  return {
    ...query,
    tree: query.data?.items ?? [],
    categories: flattenCategories(query.data?.items),
  };
}

export function useTags() {
  const query = useQuery({
    queryKey: ['catalog', 'tags'],
    queryFn: api.tags,
    staleTime: 10 * 60_000,
  });
  return { ...query, tags: query.data?.items ?? [] };
}

/*
 * The homepage's curated rails.
 *
 * Keyed by slug, not id. The old data file curated these by WordPress post id,
 * and those ids did not survive the import — the database assigns its own. Slugs
 * are stable, meaningful, and visible in the admin.
 *
 * These belong in the admin eventually (the `isFeatured` flag and menu order
 * already exist for it), at which point this constant goes away. Until then it
 * reproduces the reference site's ordering exactly.
 */
const CURATED = {
  frequentlyBookedTests: [
    'postprandial-blood-glucose',
    'complete-blood-count-cbc-copy-copy',
    'fasting-blood-glucose',
    'complete-blood-count-cbc-test',
  ],
  mostPrescribedTests: [
    'postprandial-blood-glucose',
    'complete-blood-count-cbc-copy-copy',
    'fasting-blood-glucose',
    'complete-blood-count-cbc-test',
  ],
  frequentlyBookedPackages: [
    'nalam-b',
    'women-wellness-essential-copy',
    'nalam-a-2',
    'women-wellness-essential-copy-copy',
    'women-wellness-essential-copy-copy-2',
    'women-wellness-essential',
  ],
};

/**
 * A curated rail, in its curated order.
 *
 * Anything missing is skipped rather than rendering a hole — a product that has
 * been unpublished or deleted in the admin should simply drop out of the rail.
 */
export function useCuratedProducts(name) {
  const { products, isLoading, isError } = useProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return {
    isLoading,
    isError,
    items: (CURATED[name] ?? []).map((slug) => bySlug.get(slug)).filter(Boolean),
  };
}

/**
 * Products by id, for the cart.
 *
 * The cart stores ids in localStorage and needs titles and prices to render.
 * It reads from the one catalogue query rather than fetching per line, so a
 * five-item cart costs no extra requests.
 */
export function useProductsByIds(ids) {
  const { products, isLoading, isError } = useProducts();
  const byId = new Map(products.map((p) => [p.id, p]));
  return {
    isLoading,
    isError,
    items: ids.map((id) => byId.get(id)).filter(Boolean),
    byId,
  };
}
