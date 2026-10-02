import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TestCard from './TestCard';
import PackageCard from './PackageCard';

/*
 * Stand-in for Elementor's loop carousel. Uses native scroll-snap so the rail
 * never causes page-level horizontal overflow, with arrow buttons on wider
 * screens (the reference carousel has the same prev/next affordance).
 */
export default function ProductCarousel({ products, variant = 'test' }) {
  const railRef = useRef(null);

  const scrollBy = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 16 : 300;
    rail.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  const Card = variant === 'package' ? PackageCard : TestCard;

  return (
    <div className="relative">
      <div ref={railRef} className="rail" role="list">
        {products.map((product, i) => (
          // The rail sets the slide width; the card itself is width-agnostic so the
          // same component also works as a grid item on /tests/ and /packages/.
          <div
            key={`${product.id}-${i}`}
            role="listitem"
            className={`flex ${variant === 'package'
                ? 'w-[clamp(17rem,20vw,22rem)]'
                : 'w-[clamp(16rem,18vw,20rem)]'}`}
          >
            <Card product={product} />
          </div>
        ))}
      </div>

      <div className="mt-3 hidden justify-end gap-2 sm:flex">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous"
          className="grid size-9 place-items-center rounded-full border border-slate-300 text-ink transition-colors hover:border-brand hover:text-brand"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Next"
          className="grid size-9 place-items-center rounded-full border border-slate-300 text-ink transition-colors hover:border-brand hover:text-brand"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
