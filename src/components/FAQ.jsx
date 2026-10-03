import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Reveal from './motion/Reveal';

/*
 * FAQ accordion.
 *
 * Three changes over a stacked list of bordered rows:
 *
 *   - The heading gets its own sticky column on wide screens, so the questions
 *     scroll against a held label instead of pushing it away — and a one-word
 *     heading ("FAQ") stops owning a full-width row of its own.
 *
 *   - Questions are set in the display serif at reading size. They are the
 *     content here; the chrome around them can be a hairline and nothing else.
 *
 *   - The marker is a single rule that rotates into a cross, rather than two
 *     icons swapped on state. One element moving is a state change you can
 *     follow; two elements replacing each other is a flicker.
 *
 * Panels animate on height instead of toggling display, which matters more than
 * usual here: with smooth scrolling the viewport is often still settling when a
 * row is clicked, and a snapping panel on a moving page is disorienting.
 */
export default function FAQ({ items, heading = 'FAQ', index, eyebrow, className = '' }) {
  const [open, setOpen] = useState(0);
  const reduced = useReducedMotion();
  const uid = useId();

  if (!items || items.length === 0) return null;

  return (
    <section className={`section-lg rule-top ${className}`}>
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            {(index || eyebrow) && (
              <p className="label mb-6 text-ink/35">
                {index && <span className="label-num">{index}</span>}
                {eyebrow}
              </p>
            )}
            {heading && <h2 className="display-lg">{heading}</h2>}
          </Reveal>

          <Reveal y={22} className="border-t border-ink/12">
            {items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${uid}-panel-${i}`;

              return (
                <div key={`${item.q}-${i}`} className="border-b border-ink/12">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full items-start justify-between gap-8 py-7 text-left"
                    >
                      <span className="flex items-baseline gap-5 sm:gap-8">
                        <span className="label shrink-0 text-ink/25">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`display-md transition-colors duration-300 ${
                            isOpen ? 'text-brand' : 'text-ink group-hover:text-brand'
                          }`}
                        >
                          {item.q}
                        </span>
                      </span>

                      {/* Two rules; the vertical one rotates away when open. */}
                      <span
                        aria-hidden="true"
                        className="relative mt-3 grid size-5 shrink-0 place-items-center"
                      >
                        <span
                          className={`absolute h-px w-5 transition-colors duration-300 ${
                            isOpen ? 'bg-brand' : 'bg-ink/40 group-hover:bg-brand'
                          }`}
                        />
                        <span
                          className={`absolute h-px w-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isOpen ? 'rotate-0 bg-brand opacity-0' : 'rotate-90 bg-ink/40 group-hover:bg-brand'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        key="panel"
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.3 },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="measure pb-8 text-[15px] leading-[1.8] text-body sm:pl-[3.75rem]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
