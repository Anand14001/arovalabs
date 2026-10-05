import { homeCollection } from '../data/homepage';
import Reveal, { RevealGroup, RevealItem } from './motion/Reveal';

/*
 * "Home Collection" — a four-step process.
 *
 * Four cards in a grid say "four things". This says "four things in this
 * order", which is the only reason the section exists: the heading holds its
 * own sticky column while the steps run down the page as a numbered index,
 * each on a hairline, with the step's icon closing the row.
 *
 * It is deliberately the same index pattern as the journal and the FAQ. A page
 * that varies its layout as much as this one does needs a few recurring forms
 * or it stops reading as one page, and an ordered list of short statements is
 * the form all three of those sections actually have in common.
 *
 * (A sticky card stack was the obvious alternative and was built first. Four
 * steps need roughly two and a half viewports of scroll before the cards arrive
 * one at a time instead of overlapping — a lot of a visitor's scroll to spend
 * on the least contested claim on the page.)
 */
export default function HomeCollection() {
  return (
    <section className="section-lg band-wash">
      <div className="shell">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          {/* ------------------------------------------------- the heading */}
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="label-section mb-6 text-ink/35">
              <span className="label-num">05</span>
              How it works
            </p>
            <h2 className="display-lg">{homeCollection.heading}</h2>
            <p className="section-sub max-w-sm">{homeCollection.sub}</p>

            <p className="mt-10 hidden items-center gap-4 lg:flex">
              <span className="h-px w-16 bg-ink/15" aria-hidden="true" />
              <span className="label text-ink/30">
                {String(homeCollection.steps.length).padStart(2, '0')} steps
              </span>
            </p>
          </Reveal>

          {/* --------------------------------------------------- the steps */}
          <RevealGroup as="ol" stagger={0.1} className="mt-12 border-t border-ink/15 lg:mt-0">
            {homeCollection.steps.map((step, i) => (
              <RevealItem
                as="li"
                key={step.title}
                y={16}
                className="flex items-center gap-6 border-b border-ink/15 py-7 sm:gap-10 sm:py-9"
              >
                <span className="stat-figure shrink-0 text-[1.5rem] text-accent sm:text-[1.875rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="display-md flex-1 text-ink">{step.title}</h3>

                <img
                  src={step.icon}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-11 shrink-0 sm:size-14"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
