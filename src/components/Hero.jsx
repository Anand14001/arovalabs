import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { hero } from '../data/homepage';

/*
 * The homepage opening.
 *
 * The reference hero is a full-bleed banner slammed under the header — the same
 * move as every other diagnostics site, and a crop that cuts words off artwork
 * whose headline is baked into it. This one presents the banner instead of
 * pasting the page onto it: a framed plate inside the page margins, sized to
 * the source ratio so nothing is cropped.
 *
 * The carousel runs itself. There is no index, no timer rule and no arrows —
 * with two slides those controls were more interface than the content needed,
 * and they sat above the banner competing with it for the first thing a visitor
 * looks at. What is left is the pair of dots on the image, which is the whole
 * job: say how many there are, say which one this is, and let someone jump.
 *
 * The reference site ships two parallel carousels and swaps them with
 * `elementor-hidden-*` classes (1975×700 wide, 1080×1350 tall). Here that is
 * one carousel of `<picture>` elements: the breakpoint swap becomes art
 * direction the browser handles, and slide state lives in one place.
 *
 * (The page also contains a text + CTA carousel above the images, but its
 * container is display:none at every width and never reaches a visitor. It
 * stays unrendered in data/homepage.js as `hiddenHeroSlides` — see AUDIT.md.)
 */

const slides = hero.desktop.map((wide, i) => ({
  wide: wide.src,
  tall: (hero.mobile[i] ?? wide).src,
  alt: wide.alt,
}));

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [],
  );

  /*
   * Autoplay. `index` is in the dependency list on purpose: picking a dot
   * restarts the timer, so a slide chosen by hand still gets its full turn
   * rather than being swapped a moment later by a timer already half spent.
   */
  useEffect(() => {
    if (paused || reduced || slides.length < 2) return;
    const id = setInterval(() => go(1), hero.autoplayMs);
    return () => clearInterval(id);
  }, [paused, go, reduced, index]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
      /*
       * Pause while a pointer is over the banner or focus is inside it: the
       * slide shouldn't change under someone who is reading it or tabbing
       * through the dots.
       */
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative pt-6 sm:pt-8"
    >
      <div className="shell">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-brand-light/40 ring-1 ring-inset ring-ink/8 sm:rounded-[2rem]">
          <div className="relative aspect-[1080/1350] max-h-[78vh] sm:aspect-[1975/700]">
            {slides.map((slide, i) => (
              <picture key={slide.wide}>
                <source media="(min-width: 640px)" srcSet={slide.wide} />
                <motion.img
                  src={slide.tall}
                  alt={slide.alt}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  /*
                   * Crossfade, not a translating track. Two finished banners
                   * sliding past each other is the loudest possible transition
                   * for the quietest possible content change.
                   */
                  initial={false}
                  animate={{ opacity: i === index ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 size-full object-cover"
                />
              </picture>
            ))}

            {slides.length > 1 && (
              <>
                {/*
                  A shallow scrim under the dots only. These are supplied
                  banners and the bottom edge of one is cream while another is
                  mid-tone, so without it the dots are legible on one slide and
                  invisible on the next. It is confined to the bottom eighth and
                  fades to nothing, so it never touches the artwork proper.
                */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-ink/30 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2.5 sm:bottom-7">
                  {slides.map((slide, i) => {
                    const active = i === index;
                    return (
                      <button
                        key={slide.wide}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={active}
                        /* Padded hit area — the dot itself is below the 44px minimum. */
                        className="group p-2"
                      >
                        <span
                          className={`block h-2 rounded-full shadow-[0_1px_3px_rgb(24_21_17/0.35)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            active
                              ? 'w-7 bg-white'
                              : 'w-2 bg-white/55 group-hover:bg-white/85'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
