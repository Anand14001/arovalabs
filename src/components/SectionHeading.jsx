import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './motion/Reveal';

/*
 * Shared section header.
 *
 * One structure for the whole site: a small tracked label (optionally carrying
 * the homepage's running section number), the title in the display serif, an
 * optional standfirst held to a short measure, and whatever the section can be
 * acted on pinned to the opposite edge.
 *
 * The asymmetry is deliberate. On a long page of otherwise similar sections the
 * eye learns one place to find the title and one place to find the control,
 * which is what lets the sections below vary as much as they do without the
 * page feeling disorganised.
 */
export default function SectionHeading({
  index,
  eyebrow,
  heading,
  sub,
  viewMore,
  viewMoreLabel = 'View More',
  align = 'left',
  actions,
  className = '',
}) {
  const centered = align === 'center';

  return (
    <Reveal
      className={`flex flex-col gap-6 ${
        centered
          ? 'items-center text-center'
          : 'sm:flex-row sm:items-end sm:justify-between sm:gap-12'
      } ${className}`}
    >
      <div className="max-w-xl">
        {(eyebrow || index) && (
          <p className={`label mb-6 text-ink/35 ${centered ? 'justify-center' : ''}`}>
            {index && <span className="label-num">{index}</span>}
            {eyebrow}
          </p>
        )}

        <h2 className="section-title">{heading}</h2>
        {sub && <p className="section-sub max-w-md">{sub}</p>}
      </div>

      {(actions || viewMore) && (
        <div className="flex shrink-0 items-center gap-5">
          {viewMore && (
            <Link to={viewMore} className="link-arrow">
              {viewMoreLabel}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
          {actions}
        </div>
      )}
    </Reveal>
  );
}
