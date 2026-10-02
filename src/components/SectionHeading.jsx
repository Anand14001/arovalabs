import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/*
 * Shared section header used by the homepage carousels: title + optional
 * subtitle on the left, optional "View More" link on the right.
 */
export default function SectionHeading({
  eyebrow,
  heading,
  sub,
  viewMore,
  viewMoreLabel = 'View More',
  align = 'left',
  className = '',
}) {
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${
        centered ? 'sm:flex-col sm:items-center' : ''
      } ${className}`}
    >
      <div className={centered ? 'text-center' : ''}>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">{eyebrow}</p>
        )}
        <h2 className="section-title">{heading}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>

      {viewMore && (
        <Link
          to={viewMore}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
        >
          {viewMoreLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
