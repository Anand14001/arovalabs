import { Navigate, useParams } from 'react-router-dom';
import { productCategories, productTags } from '../data/taxonomies';
import { categoryHref, listingFor, organHref } from '../lib/listingRoutes';

/*
 * The reference site's WooCommerce archives, folded into the listing pages.
 *
 * /shop/, /product-category/<path>/ and /product-tag/<slug>/ used to render a
 * second listing screen that did the same job as /tests/ and /packages/ — two
 * designs to maintain, and product breadcrumbs pointing at the wrong one.
 *
 * They are redirects rather than deletions: these are the reference site's real
 * URLs, and anything already pointing at one should keep working. `replace`
 * keeps the dead path out of history, so Back from the listing returns to
 * wherever the visitor actually came from rather than bouncing through here.
 */
export default function ArchiveRedirect({ mode }) {
  const { parent, child, slug } = useParams();

  if (mode === 'tag') {
    const tag = productTags.find((t) => t.slug === slug);
    return <Navigate to={tag ? organHref(tag.slug) : '/tests/'} replace />;
  }

  if (mode === 'category') {
    const path = child ? `${parent}/${child}` : parent;
    const category = productCategories.find((c) => c.path === path);

    // An unknown term still lands somewhere sensible: the listing for whichever
    // parent the URL names, falling back to tests.
    return <Navigate to={category ? categoryHref(category) : listingFor(parent)} replace />;
  }

  // /shop/ listed everything; tests is the larger half and the site's default
  // entry point for browsing.
  return <Navigate to="/tests/" replace />;
}
