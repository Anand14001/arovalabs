import { whatsappReports } from '../data/homepage';
import { contact } from '../data/site';
import Counter from './Counter';

// "Get Your Reports Instantly on WhatsApp" — copy, CTA and three counters.
export default function WhatsAppReports() {
  return (
    <section className="section bg-brand-light/50">
      <div className="shell grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 className="section-title">{whatsappReports.heading}</h2>
          <p className="section-sub max-w-xl">{whatsappReports.text}</p>

          <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="btn-brand mt-6">
            {whatsappReports.cta}
          </a>

          <dl className="mt-8 grid grid-cols-3 gap-4">
            {whatsappReports.counters.map((c) => (
              <div key={c.label}>
                <dd className="text-xl font-bold text-brand sm:text-2xl">
                  <Counter value={c.value} suffix={c.suffix} />
                </dd>
                <dt className="mt-1 text-xs leading-snug text-body">{c.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <img
          src={whatsappReports.image}
          alt=""
          loading="lazy"
          className="mx-auto w-full max-w-md"
        />
      </div>
    </section>
  );
}
