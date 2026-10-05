/*
 * Text helpers for content captured from WordPress.
 *
 * The post excerpts in data/blogs.js are stored exactly as the REST API
 * returned them, which means they carry HTML entities — `&#8220;`, `&#8217;`
 * and the `[&hellip;]` WordPress appends as its read-more marker. WordPress
 * renders those as HTML; React renders a string as text, so they were printing
 * literally as "[&hellip;]" at the end of every excerpt in the index.
 *
 * Decoding at render rather than rewriting the data keeps the captured content
 * byte-identical to the reference site, which is the point of storing it that
 * way.
 */

// One scratch element, reused. Entity decoding via the parser handles the whole
// named-entity table without shipping a lookup map.
let scratch = null;

const CACHE = new Map();

export function decodeEntities(value) {
  if (typeof value !== 'string' || !value.includes('&')) return value ?? '';

  const cached = CACHE.get(value);
  if (cached !== undefined) return cached;

  if (!scratch) scratch = document.createElement('textarea');
  scratch.innerHTML = value;
  const decoded = scratch.value;

  CACHE.set(value, decoded);
  return decoded;
}
