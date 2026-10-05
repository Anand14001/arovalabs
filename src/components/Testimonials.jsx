import { Star } from 'lucide-react';
import { testimonialsHeading } from '../data/testimonials';
import { googleReviews, googleReviewsVerifiedLabel } from '../data/googleReviews';
import Reveal from './motion/Reveal';

/*
 * "What Our Patients Say" — the verified Google reviews, and nothing else.
 *
 * The reference site stacks this widget above a second carousel of four
 * hand-written testimonial cards. Those cards are the weaker of the two by
 * every measure that matters here: the reviews are attributable and verifiable,
 * and two of the four testimonials repeat the same quote under different names.
 * Running both asks a visitor to read the same claim twice, with the unverified
 * version given the louder treatment. So this section carries the real reviews
 * only.
 *
 * They are volume evidence — what matters is that there are many and that
 * they're verified, not what any single one says. Two rows scrolling in
 * opposite directions say "more than fit here" in a way a carousel the visitor
 * has to drag never does, and both pause on hover so anything that catches the
 * eye can be read.
 *
 * Each row renders its items twice because the keyframe translates -50%; the
 * second copy is aria-hidden so each review is announced once.
 */
export default function Testimonials({ index, eyebrow }) {
  return (
    <section className="section-lg rule-top">
      <div className="shell">
        <Reveal className="max-w-xl">
          {/* The running index belongs to the homepage's spine, so it's opt-in. */}
          {(index || eyebrow) && (
            <p className="label-section mb-6 text-ink/35">
              {index && <span className="label-num">{index}</span>}
              {eyebrow}
            </p>
          )}
          <h2 className="display-lg">{testimonialsHeading}</h2>
          <p className="section-sub max-w-xl">Read what patients share about their experience with Arova Labs.</p>
        </Reveal>
      </div>

      {/*
        Full-bleed, outside the shell: a marquee that stops at the content
        gutter reads as clipped rather than as continuous.
      */}
      <Reveal className="mt-14">
        <div
          className="marquee-mask space-y-4 overflow-hidden"
          role="region"
          aria-label="Google reviews"
        >
          <ReviewRow reviews={googleReviews} duration="78s" />
          {/* Counter-scrolling second row, reversed so the two never line up. */}
          <ReviewRow
            reviews={[...googleReviews].reverse()}
            duration="92s"
            reverse
            hideFromScreenReaders
          />
        </div>

        <div className="shell">
          <p className="mt-6 text-[11px] text-ink/40">{googleReviewsVerifiedLabel}</p>
        </div>
      </Reveal>
    </section>
  );
}

function ReviewRow({ reviews, duration, reverse = false, hideFromScreenReaders = false }) {
  return (
    <div
      className="marquee gap-4"
      style={{
        '--marquee-duration': duration,
        '--marquee-direction': reverse ? 'reverse' : 'normal',
      }}
      aria-hidden={hideFromScreenReaders || undefined}
    >
      {[0, 1].map((copy) => (
        <div className="flex shrink-0 gap-4" key={copy} aria-hidden={copy === 1}>
          {reviews.map((review, i) => (
            /*
             * Fixed width AND fixed height. These reviews run from four words
             * to four lines, so sizing to content produced a ragged row of
             * mismatched boxes. A fixed card with the quote clamped to four
             * lines and the attribution pinned to the bottom edge means every
             * card in both rows is identical, and the only thing that varies
             * is the text — which is the point of the row.
             */
            <article
              key={`${review.name}-${i}`}
              className="flex h-[13.5rem] w-[20rem] shrink-0 flex-col rounded-2xl bg-white p-5 ring-1 ring-inset ring-ink/10"
            >
              <div className="flex items-center gap-0.5 text-accent">
                {Array.from({ length: review.stars }).map((_, s) => (
                  <Star key={s} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              <p className="mt-3.5 line-clamp-4-fixed flex-1 text-[13px] leading-relaxed text-body">
                {review.text}
              </p>

              <div className="mt-4 flex shrink-0 items-center gap-3 border-t border-ink/10 pt-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-light text-xs font-bold text-brand">
                  {review.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-ink">
                    {review.name}
                  </span>
                  <span className="block text-[11px] text-ink/40">Google</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
