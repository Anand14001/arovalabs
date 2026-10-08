/*
 * One listing per product type.
 *
 * The reference site is WooCommerce, so it ships three archive shapes —
 * /shop/, /product-category/<path>/ and /product-tag/<slug>/ — and this project
 * reproduced them as a second listing page alongside /tests/ and /packages/.
 * That left two different screens doing the same job, and the breadcrumbs on a
 * product page pointed at the wrong one.
 *
 * Everything now resolves to the single listing, with the narrowing carried in
 * the query string so a deep link arrives already filtered. The old paths are
 * kept as redirects rather than deleted, because they are the reference site's
 * real URLs and anything already pointing at them should keep working.
 *
 * Every function here is pure. They used to read the taxonomy and the product
 * list at module scope, which stopped working once both came from the API —
 * a module cannot await. It turns out they never needed the data: a category
 * path ("tests/diabetes-tests") already names its own parent and slug, and the
 * one function that genuinely needs the catalogue takes it as an argument.
 */

const LISTING = { tests: '/tests/', packages: '/packages/' };

/** The listing for a parent taxonomy — `tests` or `packages`. */
export const listingFor = (parent) => LISTING[parent] ?? LISTING.tests;

/**
 * A category's URL, from its materialised path.
 *
 * Parents open the listing unfiltered; children open it with their own filter
 * applied. "tests" → /tests/ ; "tests/diabetes-tests" → /tests/?category=…
 */
export function pathHref(path) {
  if (typeof path !== 'string' || !path) return LISTING.tests;
  const parts = path.split('/').filter(Boolean);
  if (parts.length <= 1) return listingFor(parts[0]);
  return `${listingFor(parts[0])}?category=${parts[parts.length - 1]}`;
}

/** A category object's URL. Accepts either `{ path }` or `{ parent, slug }`. */
export function categoryHref(category) {
  if (!category) return LISTING.tests;
  if (category.path) return pathHref(category.path);
  if (!category.parent) return listingFor(category.slug);
  return `${listingFor(category.parent)}?category=${category.slug}`;
}

/**
 * An organ tag's URL.
 *
 * Which listing it opens is decided by what actually carries the tag, not by
 * assumption: in this data `kidney` is on three tests while `bone` is only on
 * packages, so sending every organ to /tests/ landed "Bone" on an empty page.
 * Tests win when a tag spans both, since that is the larger catalogue.
 *
 * `products` is optional. Without it — before the catalogue has loaded — this
 * falls back to the test listing, which is where an unknown tag went anyway.
 */
export function organHref(slug, products = []) {
  const tagged = products.filter((p) => (p.tags ?? []).includes(slug));

  if (tagged.some((p) => p.type === 'test')) return `${LISTING.tests}?organ=${slug}`;
  if (tagged.some((p) => p.type === 'package')) return `${LISTING.packages}?organ=${slug}`;

  // Nothing carries this tag; the test listing's empty state has the ways out.
  return `${LISTING.tests}?organ=${slug}`;
}

/**
 * Rewrites a stored `/product-category/...` href to its listing equivalent.
 *
 * Product breadcrumbs still carry the WooCommerce paths, because that is what
 * the reference site serves and the API reproduces them faithfully. Translating
 * here keeps the routing decision in the routing module.
 */
export function archiveHref(href) {
  if (typeof href !== 'string') return LISTING.tests;

  const path = href.replace(/^\/product-category\//, '').replace(/\/$/, '');
  if (!path || path === href) return href;

  return pathHref(path);
}

/** Maps a captured breadcrumb trail onto the consolidated listing. */
export const resolveTrail = (trail = []) =>
  trail.map((item) => ({
    ...item,
    // The API gives each crumb a `path`; older captured trails only have `to`.
    to: item.path ? pathHref(item.path) : archiveHref(item.to),
  }));
