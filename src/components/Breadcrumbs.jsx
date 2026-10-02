import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// WooCommerce-style breadcrumb trail: Home / Category / Subcategory / Current.
export default function Breadcrumbs({ trail = [], current }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-body">
        <li>
          <Link to="/" className="hover:text-brand">
            Home
          </Link>
        </li>

        {trail.map((item) => (
          <li key={item.to} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-slate-400" />
            <Link to={item.to} className="hover:text-brand">
              {item.label}
            </Link>
          </li>
        ))}

        {current && (
          <li className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-slate-400" />
            <span aria-current="page" className="font-semibold text-ink">
              {current}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
