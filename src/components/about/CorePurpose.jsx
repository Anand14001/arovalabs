import { arovaAdvantage, corePurpose } from '../../data/about';
import Reveal, { RevealGroup, RevealItem } from '../motion/Reveal';

/*
 * Purpose, then advantage — in that order, because one earns the other.
 *
 * The vision and mission come first as two statements set at the size
 * statements of intent deserve, divided by a single hairline. A vision boxed in
 * a card reads as a feature bullet, and these are the only two sentences where
 * the company says what it is for.
 *
 * The Arova Advantage follows underneath with its own heading and the three
 * figures that back it. Keeping the heading with its numbers is the point: the
 * figures were originally banded under the page's opening headline, two screens
 * away from the words they are evidence for, which left the hero carrying a
 * statement and a specification sheet at once and the Advantage heading
 * introducing nothing.
 */
export default function CorePurpose() {
  return (
    <section className="section-lg">
      <div className="shell">
        {/* ------------------------------------------------- the purpose */}
        <Reveal>
          <p className="label-section text-ink/35">
            <span className="label-num">01</span>
            {corePurpose.heading}
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.12}
          className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-0"
        >
          {corePurpose.items.map((item, i) => (
            <RevealItem
              as="li"
              key={item.title}
              y={18}
              className={i === 0 ? 'lg:border-r lg:border-ink/12 lg:pr-16' : 'lg:pl-16'}
            >
              <div className="flex items-start gap-5">
                <img
                  src={item.icon}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-12 shrink-0"
                />
                <span className="label pt-1 text-ink/25">{String(i + 1).padStart(2, '0')}</span>
              </div>

              <h2 className="display-md mt-7 text-ink">{item.title}</h2>
              <p className="mt-4 max-w-md text-[15px] leading-[1.8] text-body">{item.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ----------------------------------------------- the advantage */}
        <Reveal className="mt-24 max-w-2xl">
          <h2 className="display-lg">{arovaAdvantage.heading}</h2>
          <p className="section-sub max-w-xl">{arovaAdvantage.sub}</p>
        </Reveal>

        {/*
          A plain list, not a definition list. The earlier markup put the title
          in a visually hidden <dt> and again in the visible body, so assistive
          tech read every heading twice.
        */}
        <RevealGroup
          as="ul"
          stagger={0.09}
          className="mt-12 grid border-t border-ink/12 sm:grid-cols-3"
        >
          {arovaAdvantage.items.map((item, i) => (
            <RevealItem
              as="li"
              key={item.title}
              y={16}
              className={`border-b border-ink/12 py-9 sm:px-8 sm:py-10 lg:border-b-0 ${
                i < arovaAdvantage.items.length - 1 ? 'sm:border-r' : ''
              } ${i === 0 ? 'sm:pl-0' : ''} ${
                i === arovaAdvantage.items.length - 1 ? 'sm:pr-0' : ''
              }`}
            >
              <p className="stat-figure text-[clamp(2.25rem,3.6vw,3.5rem)] text-ink">
                {item.stat}
              </p>
              <h3 className="mt-5 text-[15px] font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-body">{item.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
