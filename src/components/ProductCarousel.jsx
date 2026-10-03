import useRail from '../hooks/useRail';
import RailArrows from './RailArrows';
import TestCard from './TestCard';
import PackageCard from './PackageCard';

/*
 * Bare product rail, for places that supply their own heading (the related
 * products block on a product page). The homepage uses `ProductRail`, which
 * wires the same rail to a `SectionHeading` so the arrows can sit in the
 * heading row.
 *
 * Scrolling stays native scroll-snap; `useRail` only drives the arrows and the
 * position indicator.
 */
export default function ProductCarousel({ products, variant = 'test', label }) {
  const rail = useRail();
  const Card = variant === 'package' ? PackageCard : TestCard;

  return (
    <div>
      <div ref={rail.ref} className="rail" role="list" aria-label={label}>
        {products.map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            role="listitem"
            className={`flex ${
              variant === 'package' ? 'w-[min(85vw,22rem)]' : 'w-[min(78vw,19rem)]'
            }`}
          >
            <Card product={product} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6">
        <div className="rail-progress max-w-xs flex-1">
          <span
            style={{ transform: `scaleX(${Math.max(rail.progress, 0.08)})` }}
            aria-hidden="true"
          />
        </div>

        <RailArrows
          onPrev={() => rail.step(-1)}
          onNext={() => rail.step(1)}
          atStart={rail.atStart}
          atEnd={rail.atEnd}
        />
      </div>
    </div>
  );
}
