import { Star } from 'lucide-react';
import { testimonials, testimonialsHeading } from '../data/testimonials';
import { googleReviews, googleReviewsVerifiedLabel } from '../data/googleReviews';
import SectionHeading from './SectionHeading';

/*
 * "What Our Patients Say" — on the reference site this section stacks the
 * Trustindex Google-reviews widget above a carousel of four testimonial cards.
 * Both are reproduced in that order.
 */
export default function Testimonials({ showGoogleReviews = true }) {
  return (
    <section className="section bg-slate-50">
      <div className="shell">
        <SectionHeading heading={testimonialsHeading} align="center" />

        {showGoogleReviews && (
          <>
            <div className="mt-8 rail" role="list">
              {googleReviews.map((review, i) => (
                <article
                  key={`${review.name}-${i}`}
                  role="listitem"
                  className="card flex w-[clamp(16rem,18vw,20rem)] flex-col p-4"
                >
                  <div className="flex items-center gap-1 text-[#fbbc04]">
                    {Array.from({ length: review.stars }).map((_, s) => (
                      <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>

                  <p className="mt-3 flex-1 text-xs leading-relaxed text-body">{review.text}</p>

                  <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-light text-xs font-bold text-brand">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold text-ink">
                        {review.name}
                      </span>
                      <span className="block text-[10px] text-slate-400">Google</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-2 text-[11px] text-slate-400">{googleReviewsVerifiedLabel}</p>
          </>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <article key={`${t.name}-${i}`} className="card flex flex-col p-5">
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt="" className="size-11 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-ink">{t.name}</h3>
                  <p className="text-xs text-body">{t.location}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-body">{t.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
