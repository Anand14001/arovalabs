import { certification } from '../data/homepage';
import Reveal, { RevealGroup, RevealItem } from './motion/Reveal';

/*
 * "Certified Quality Assurance".
 *
 * Three beats, in order of what carries the argument:
 *
 *   1. The heading.
 *   2. The evidence statement — the team photograph at a supporting size on the
 *      left, with the "trusted by 200+ doctors" line as the lead above the body
 *      copy on the right. The photo illustrates that specific, checkable claim
 *      and sits right next to it, which is the only arrangement where a stock
 *      clinical photo does any work at all.
 *   3. The accreditation marks, reproduced large enough that the issuing body
 *      is legible. A certification mark nobody can read certifies nothing.
 *
 * The photo deliberately takes a fixed, narrow column rather than half the
 * section: it is supporting material, and at hero scale it was reading as
 * decoration while the actual credentials were the smallest things on screen.
 */
export default function CertificationSection() {
  return (
    <section className="section-lg rule-top">
      <div className="shell">
        {/* ------------------------------------------------- the heading */}
        <Reveal>
          <p className="label-section mb-6 text-ink/35">
            <span className="label-num">07</span>
            Accreditation
          </p>
          <h2 className="display-lg max-w-lg">{certification.heading}</h2>
        </Reveal>

        {/* --------------------------------------- the evidence statement */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
          <Reveal y={20}>
            <img
              src={certification.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full rounded-2xl object-cover ring-1 ring-inset ring-ink/10"
            />
          </Reveal>

          <Reveal y={20} delay={0.08}>
            {/*
              The caption is set as the lead line, not as a label under the
              image: it is the claim the paragraph then goes on to support.
            */}
            <p className="display-md text-ink">{certification.imageHeading}</p>

            <p className="measure mt-5 text-base leading-[1.85] text-body">
              {certification.body}
            </p>
          </Reveal>
        </div>

        {/* --------------------------------------------------- the seals */}
        <RevealGroup as="ul" stagger={0.1} className="mt-12 grid gap-5 sm:grid-cols-2">
          {certification.badges.map((badge) => (
            <RevealItem as="li" key={badge.title} y={16} className="flex">
              <div className="card flex w-full items-center gap-5 p-5 sm:gap-6 sm:p-6">
                {/* The mark on its own plate, so it reads as a seal rather than
                    as an illustration floating in the card. */}
                <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-brand-light/60">
                  <img
                    src={badge.icon}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-16 object-contain"
                  />
                </span>

                <h3 className="text-[15px] font-semibold leading-snug text-ink">
                  {badge.title}
                </h3>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
