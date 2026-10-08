import { useMemo } from 'react';
import { useCategories, useProducts, useTags } from '../../lib/catalog';
import { usePosts } from '../../lib/blog';
import { mainNav } from '../../data/site';
import { categoryHref, organHref } from '../../lib/listingRoutes';
import { quickActions } from '../../data/homepage';
import { myAccountPage } from '../../data/pages';

/*
 * The search index.
 *
 * Everything the site can actually navigate to, flattened into one list with a
 * `kind` so the overlay can group it. The catalogue comes from the API now, but
 * it is fetched once and cached, so searching remains a local pass over a few
 * dozen entries — still no debounce and no per-keystroke loading state, because
 * both would be theatre over an operation that completes in under a millisecond.
 *
 * Blog posts and navigation are still local data; they move to the API with the
 * content step. Every `to` is a route App.jsx already serves.
 */

const PAGE_EXTRAS = [
  { label: quickActions[2].title, to: quickActions[2].href },
  { label: myAccountPage.title, to: '/my-account/' },
];

function buildIndex({ products, categories, tags, posts }) {
  const entries = [];

  for (const product of products) {
    const isPackage = product.type === 'package';

    entries.push({
      id: `product-${product.id}`,
      kind: isPackage ? 'package' : 'test',
      title: product.title,
      // Packages lead with their profile count; tests with their category.
      subtitle:
        product.profiles ?? product.breadcrumb?.[product.breadcrumb.length - 1]?.label ?? '',
      to: `/product/${product.slug}/`,
      image: product.archiveImage || product.cardImage,
      salePrice: product.salePrice,
      regularPrice: product.regularPrice,
      discount: product.discount,
      // Everything else worth matching on, never shown.
      keywords: [
        product.slug,
        product.cardExcerpt,
        product.excerpt,
        ...(product.parameters ?? []),
        ...(product.highlights ?? []),
        ...(product.cats ?? []),
        ...(product.tags ?? []),
        ...(product.badges ?? []),
      ],
    });
  }

  // Only child categories: the two parents duplicate the /tests/ and
  // /packages/ listing pages that are already in the index as pages.
  for (const category of categories.filter((c) => c.parent)) {
    entries.push({
      id: `category-${category.id}`,
      kind: 'category',
      title: category.name,
      subtitle: category.parent === 'packages' ? 'Packages' : 'Tests',
      to: categoryHref(category),
      keywords: [category.slug, category.parent],
    });
  }

  for (const tag of tags) {
    entries.push({
      id: `tag-${tag.id}`,
      kind: 'organ',
      title: tag.name,
      subtitle: 'Browse by organ',
      to: organHref(tag.slug, products),
      icon: tag.icon,
      keywords: [tag.slug, 'organ'],
    });
  }

  for (const post of posts) {
    entries.push({
      id: `post-${post.id}`,
      kind: 'article',
      title: post.title,
      subtitle: post.category ?? '',
      to: `/${post.slug}/`,
      image: post.thumb,
      keywords: [post.slug, post.excerpt, post.category],
    });
  }

  for (const item of [...mainNav, ...PAGE_EXTRAS]) {
    entries.push({
      id: `page-${item.to}`,
      kind: 'page',
      title: item.label,
      subtitle: 'Page',
      to: item.to,
      keywords: [item.to],
    });
  }

  // Precompute one lowercase haystack per entry so searching never re-joins.
  return entries.map((entry) => ({
    ...entry,
    haystack: [entry.title, entry.subtitle, ...(entry.keywords ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
    lowerTitle: entry.title.toLowerCase(),
  }));
}

/*
 * Relevance, highest first:
 *   exact title  →  title starts with  →  a title word starts with  →
 *   title contains  →  matched only on hidden keywords.
 *
 * A multi-word query must match every term somewhere, which is what keeps
 * "blood glucose" from returning everything containing "blood".
 */
function scoreEntry(entry, query, terms) {
  if (!terms.every((term) => entry.haystack.includes(term))) return 0;

  const title = entry.lowerTitle;

  if (title === query) return 1000;
  if (title.startsWith(query)) return 800;
  if (title.split(/[\s(),/-]+/).some((word) => word.startsWith(query))) return 600;
  if (title.includes(query)) return 400;

  // Fell through to a keyword-only match: rank by how much of the query the
  // title still accounts for, so a near miss outranks a distant one.
  const inTitle = terms.filter((term) => title.includes(term)).length;
  return 100 + inTitle * 20;
}

// Kinds in the order they are presented. Products first — they are what people
// come to search for — then ways to browse, then everything else.
const GROUPS = [
  { kind: 'test', label: 'Tests' },
  { kind: 'package', label: 'Health Packages' },
  { kind: 'category', label: 'Categories' },
  { kind: 'organ', label: 'Browse by organ' },
  { kind: 'article', label: 'Articles' },
  { kind: 'page', label: 'Pages' },
];

const KIND_RANK = Object.fromEntries(GROUPS.map((g, i) => [g.kind, i]));

export default function useSearchIndex(query) {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { tags } = useTags();
  const { posts } = usePosts({ limit: 50 });

  /*
   * Rebuilt whenever the catalogue arrives. Before it does, the index holds
   * only the static entries — pages, blog posts — so the overlay is useful
   * immediately rather than blank while the catalogue loads.
   */
  const index = useMemo(
    () => buildIndex({ products, categories, tags, posts }),
    [products, categories, tags, posts],
  );

  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { groups: [], flat: [], total: 0 };

    const terms = q.split(/\s+/).filter(Boolean);

    const hits = index
      .map((entry) => ({ entry, score: scoreEntry(entry, q, terms) }))
      .filter((hit) => hit.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          KIND_RANK[a.entry.kind] - KIND_RANK[b.entry.kind] ||
          a.entry.title.localeCompare(b.entry.title),
      );

    /*
     * Groups are ordered by their best hit, not by a fixed kind order.
     *
     * A fixed order looked tidy and ranked badly: searching "thyroid" buried
     * the Thyroid category and the Thyroid organ page — both exact title
     * matches — under six packages that merely mention thyroid in a bullet
     * list. The kind order survives only as the tie-break, so products still
     * lead whenever relevance is equal.
     */
    const groups = GROUPS.map((group) => {
      const groupHits = hits.filter((hit) => hit.entry.kind === group.kind);
      return {
        ...group,
        best: groupHits[0]?.score ?? 0,
        items: groupHits.map((hit) => hit.entry),
      };
    })
      .filter((group) => group.items.length > 0)
      .sort((a, b) => b.best - a.best || KIND_RANK[a.kind] - KIND_RANK[b.kind]);

    // One flat list in render order, so arrow keys walk the groups seamlessly.
    const flat = groups.flatMap((group) => group.items);

    return { groups, flat, total: flat.length };
  }, [index, query]);
}
