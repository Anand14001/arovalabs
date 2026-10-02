import { homeCollection } from '../data/homepage';
import SectionHeading from './SectionHeading';

// Four-step "Home Collection" explainer.
export default function HomeCollection() {
  return (
    <section className="section bg-slate-50">
      <div className="shell">
        <SectionHeading
          heading={homeCollection.heading}
          sub={homeCollection.sub}
          align="center"
        />

        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {homeCollection.steps.map((step, i) => (
            <li key={step.title} className="card relative flex flex-col items-center p-5 text-center">
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-200">
                0{i + 1}
              </span>
              <img src={step.icon} alt="" className="size-14" loading="lazy" />
              <h3 className="mt-4 text-sm font-semibold leading-snug text-ink">{step.title}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
