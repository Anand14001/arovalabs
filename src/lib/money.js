/*
 * Price formatting.
 *
 * Takes rupees, because that is what the view model hands components. The API
 * is the only place paise appear, and `lib/catalog.js` converts at that
 * boundary — so nothing in the component tree has to remember which unit it
 * holds.
 *
 * Replaces the old formatPrice in data/products.js, which this matches
 * character for character so no price on the site changes appearance.
 */

export const formatPrice = (rupees) =>
  `₹${Number(rupees ?? 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
