import { whyChoose } from '../data/homepage';
import Counter from './Counter';
import Reveal, { RevealGroup, RevealItem } from './motion/Reveal';

/*
 * "Why Choose Arova labs?" — the page's credibility anchor.
 *
 * Nine numbers previously sat in nine identical boxes, which turned the
 * strongest content on the page into a spec sheet. Here they are typeset: the
 * figures are the display face at poster size, the labels are small caps
 * underneath, and the only structure is a hairline grid. Nothing is boxed,
 * because a number that large does not need a container to be noticed.
 *
 * The awards figures follow at half the scale on the same grid — subordinate by
 * size rather than by being parked in a separate panel.
 *
 * ("labs" lowercase in the heading is the reference site's own wording.)
 */
export default function Statistics() {
  return (
    <section className="section-lg rule-top">
      <div className="shell">
        <Reveal className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h2 className="display-lg">{whyChoose.heading}</h2>
          <p className="label text-ink/35 lg:justify-self-end">
            <span className="label-num">01</span>
            By the numbers
          </p>
        </Reveal>

        {/* ------------------------------------------- headline figures */}
        <RevealGroup
          as="dl"
          stagger={0.08}
          className="mt-14 grid grid-cols-2 border-t border-ink/12 sm:grid-cols-3 lg:grid-cols-5"
        >
          {whyChoose.counters.map((c) => (
            <RevealItem
              key={c.label}
              y={16}
              className="border-b border-r border-ink/12 px-5 py-9 first:pl-0 lg:border-b-0 lg:last:border-r-0"
            >
              <dd className="stat-figure text-[clamp(2rem,3.2vw,3.25rem)] text-ink">
                <Counter value={c.value} suffix={c.suffix} />
              </dd>
              <dt className="mt-4 max-w-[14rem] text-[13px] leading-snug text-body">
                {c.label}
              </dt>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ------------------------------------------------ awards figures */}
        <Reveal className="mt-14 flex items-baseline gap-4">
          <h3 className="label text-accent">{whyChoose.awardsLabel.join(' ')}</h3>
          <span className="h-px flex-1 bg-ink/12" aria-hidden="true" />
        </Reveal>

        <RevealGroup as="dl" stagger={0.07} className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {whyChoose.awardCounters.map((c) => (
            <RevealItem key={c.label} y={14}>
              <dd className="stat-figure text-[clamp(1.5rem,2.1vw,2.125rem)] text-brand">
                <Counter value={c.value} suffix={c.suffix} />
              </dd>
              <dt className="mt-3 text-[13px] leading-snug text-body">{c.label}</dt>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
