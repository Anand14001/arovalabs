import { Clock, MapPin, Phone } from 'lucide-react';
import Testimonials from '../components/Testimonials';
import SectionHeading from '../components/SectionHeading';
import {
  aboutHero,
  accreditations,
  arovaAdvantage,
  corePurpose,
  leadership,
  locations,
  locationsSection,
  whyChooseAbout,
} from '../data/about';

// /about-us/ — sections in the reference site's order.
export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-light via-white to-accent-light">
        <div className="shell py-12 sm:py-16 lg:py-20">
          <h1 className="max-w-3xl text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
            {aboutHero.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-body sm:text-base">
            {aboutHero.text}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {aboutHero.ctas.map((cta, i) => (
              <a key={cta.label} href={cta.to} className={i === 0 ? 'btn-brand' : 'btn-outline'}>
                {cta.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Purpose */}
      <section className="section">
        <div className="shell">
          <h2 className="section-title text-center">{corePurpose.heading}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {corePurpose.items.map((item) => (
              <article key={item.title} className="card p-6">
                <img src={item.icon} alt="" className="size-12" loading="lazy" />
                <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The Arova Advantage */}
      <section className="section bg-slate-50">
        <div className="shell">
          <SectionHeading
            heading={arovaAdvantage.heading}
            sub={arovaAdvantage.sub}
            align="center"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {arovaAdvantage.items.map((item) => (
              <article key={item.title} className="card p-6 text-center">
                <p className="text-3xl font-bold text-brand">{item.stat}</p>
                <h3 className="mt-2 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="section">
        <div className="shell">
          <h2 className="section-title text-center">{accreditations.heading}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {accreditations.items.map((item) => (
              <article key={item.title} className="card overflow-hidden">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-brand">{item.subtitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-body">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Our Leadership */}
      <section className="section bg-slate-50">
        <div className="shell">
          <h2 className="section-title text-center">{leadership.heading}</h2>

          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
            <div>
              <img
                src={leadership.image}
                alt={leadership.name}
                loading="lazy"
                className="w-full rounded-xl object-cover"
              />
              <h3 className="mt-4 text-lg font-bold text-ink">{leadership.name}</h3>
              <p className="text-sm font-semibold text-brand">{leadership.role}</p>
            </div>

            <div className="space-y-4">
              {leadership.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-body">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <img
            src={leadership.certificate}
            alt=""
            loading="lazy"
            className="mx-auto mt-8 w-full max-w-sm rounded-xl"
          />
        </div>
      </section>

      {/* Why Choose Arova Labs? */}
      <section className="section">
        <div className="shell">
          <h2 className="section-title text-center">{whyChooseAbout.heading}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseAbout.items.map((item) => (
              <article key={item.title} className="card p-5 text-center">
                <img src={item.icon} alt="" loading="lazy" className="mx-auto size-11" />
                <h3 className="mt-3 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Patients Say — the verified Google reviews. */}
      <Testimonials />

      {/* Our Locations */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            heading={locationsSection.heading}
            sub={locationsSection.sub}
            align="center"
          />

          <ul className="cards-grid-wide mt-8">
            {locations.map((loc) => (
              <li key={loc.name} className="card flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-ink">{loc.name}</h3>
                  <span className="shrink-0 rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-bold text-brand">
                    {loc.badge}
                  </span>
                </div>

                <p className="mt-3 flex flex-1 items-start gap-2 text-sm text-body">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand" />
                  <span>{loc.address}</span>
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-body">
                  <Phone size={15} className="shrink-0 text-brand" />
                  <span>{loc.phone}</span>
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-body">
                  <Clock size={15} className="shrink-0 text-brand" />
                  <span>{loc.hours}</span>
                </p>

                <a
                  href={loc.directions}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline mt-4 w-full"
                >
                  Get Directions
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
            <iframe
              src={locationsSection.mapEmbed}
              title="Arova Labs locations map"
              loading="lazy"
              className="h-[320px] w-full border-0 sm:h-[420px]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
