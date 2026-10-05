import { productCategories } from '../data/taxonomies';
import { products } from '../data/products';

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
 */

const LISTING = { tests: '/tests/', packages: '/packages/' };

/** The listing for a parent taxonomy — `tests` or `packages`. */
export const listingFor = (parent) => LISTING[parent] ?? LISTING.tests;

/**
 * A category's URL. Parents open the listing unfiltered; children open it with
 * their own filter applied.
 */
export function categoryHref(category) {
  if (!category) return LISTING.tests;
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
 */
export function organHref(slug) {
  const tagged = products.filter((p) => (p.tags ?? []).includes(slug));

  if (tagged.some((p) => p.type === 'test')) return `${LISTING.tests}?organ=${slug}`;
  if (tagged.some((p) => p.type === 'package')) return `${LISTING.packages}?organ=${slug}`;

  // Nothing carries this tag; the test listing's empty state has the ways out.
  return `${LISTING.tests}?organ=${slug}`;
}

/**
 * Rewrites a stored `/product-category/...` href to its listing equivalent.
 *
 * Product breadcrumbs are captured verbatim from the reference site and still
 * hold the WooCommerce paths. Translating here keeps data/products.js untouched
 * — it is a record of what the reference site serves, not a routing table.
 */
export function archiveHref(href) {
  if (typeof href !== 'string') return LISTING.tests;

  const path = href.replace(/^\/product-category\//, '').replace(/\/$/, '');
  if (!path || path === href) return href;

  const category = productCategories.find((c) => c.path === path);
  return category ? categoryHref(category) : LISTING.tests;
}

/** Maps a captured breadcrumb trail onto the consolidated listing. */
export const resolveTrail = (trail = []) =>
  trail.map((item) => ({ ...item, to: archiveHref(item.to) }));
