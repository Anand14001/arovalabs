import { Trophy } from 'lucide-react';
import { whyChoose } from '../data/homepage';
import Counter from './Counter';

/*
 * "Why Choose Arova labs?" — five headline counters, then a second band of four
 * counters sitting beside the "Awards Won" icon box.
 * The lowercase "labs" in the heading is the reference site's own wording.
 */
export default function Statistics() {
  return (
    <section className="section">
      <div className="shell">
        <h2 className="section-title text-center">{whyChoose.heading}</h2>

        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {whyChoose.counters.map((c) => (
            <div key={c.label} className="card p-5 text-center">
              <dd className="text-2xl font-bold text-brand">
                <Counter value={c.value} suffix={c.suffix} />
              </dd>
              <dt className="mt-1.5 text-xs leading-snug text-body">{c.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid items-center gap-6 rounded-xl bg-slate-50 p-6 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-[#fef9e7] text-[#CA8A04]">
              <Trophy size={26} />
            </span>
            <h3 className="text-sm font-bold leading-tight text-ink">
              {whyChoose.awardsLabel.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
          </div>

          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {whyChoose.awardCounters.map((c) => (
              <div key={c.label} className="text-center">
                <dd className="text-xl font-bold text-brand sm:text-2xl">
                  <Counter value={c.value} suffix={c.suffix} />
                </dd>
                <dt className="mt-1 text-xs leading-snug text-body">{c.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
