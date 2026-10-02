import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { hero } from '../data/homepage';

/*
 * The homepage hero — a single full-width image carousel.
 *
 * The reference site renders two Elementor image carousels here and swaps them
 * by breakpoint: a wide 1975×700 pair carrying `elementor-hidden-mobile`, and a
 * tall 1080×1350 pair carrying `elementor-hidden-desktop elementor-hidden-tablet`.
 * Rendering both and toggling with `hidden`/`block` mirrors that exactly.
 *
 * Both run one slide at a time, arrows, autoplay every 5000ms, infinite.
 *
 * Note: the reference page also contains a text + CTA carousel ("Expert Care,
 * Right at Your Door") immediately above this one, but its container carries
 * elementor-hidden-desktop AND -tablet AND -mobile, so it is display:none at
 * every width and never reaches a visitor. It is kept in data/homepage.js as
 * `hiddenHeroSlides` for reference but deliberately not rendered — see AUDIT.md.
 */
function HeroTrack({ slides, aspect, className }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setInterval(() => go(1), hero.autoplayMs);
    return () => clearInterval(id);
  }, [paused, go, slides.length]);

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden">
        {/* Reserve the slide's aspect ratio so nothing shifts while images load. */}
        <div
          className={`flex transition-transform duration-500 ease-out ${aspect}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fetchPriority={i === 0 ? 'high' : undefined}
              className="h-full w-full shrink-0 object-cover"
            />
          ))}
        </div>

        {slides.length > 1 && (
          <>
            {/* Arrow colour is the reference's secondary (#EF8A06). */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-accent shadow transition-colors hover:bg-white sm:left-5 sm:size-10"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-accent shadow transition-colors hover:bg-white sm:right-5 sm:size-10"
            >
              <ChevronRight size={19} />
            </button>

            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-6 bg-white' : 'w-2 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section aria-label="Highlights">
      {/* Wide pair — tablet and up (1975×700) */}
      <HeroTrack slides={hero.desktop} aspect="aspect-[1975/700]" className="hidden sm:block" />

      {/* Tall pair — mobile only (1080×1350) */}
      <HeroTrack slides={hero.mobile} aspect="aspect-[1080/1350]" className="block sm:hidden" />
    </section>
  );
}
