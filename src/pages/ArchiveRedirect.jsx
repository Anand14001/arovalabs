import { Navigate, useParams } from 'react-router-dom';
import { useProducts } from '../lib/catalog';
import { listingFor, organHref, pathHref } from '../lib/listingRoutes';

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
 *
 * Unknown terms are not looked up any more. Resolving a category needs nothing
 * but its path, and an unknown one lands on the listing its URL names — the
 * same place a validated miss used to go. That keeps the redirect instant
 * instead of holding a visitor on a blank page while the taxonomy loads.
 */
export default function ArchiveRedirect({ mode }) {
  const { parent, child, slug } = useParams();

  /*
   * Tags are the exception: which listing an organ opens depends on what
   * carries it. The catalogue is cached, so this is usually already resolved;
   * if it is not, organHref falls back to the test listing rather than waiting.
   */
  const { products } = useProducts();

  if (mode === 'tag') {
    return <Navigate to={organHref(slug, products)} replace />;
  }

  if (mode === 'category') {
    const path = child ? `${parent}/${child}` : parent;
    return <Navigate to={path ? pathHref(path) : listingFor(parent)} replace />;
  }

  // /shop/ listed everything; tests is the larger half and the site's default
  // entry point for browsing.
  return <Navigate to="/tests/" replace />;
}
