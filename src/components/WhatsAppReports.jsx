import { ArrowUpRight } from 'lucide-react';
import { whatsappReports } from '../data/homepage';
import { contact } from '../data/site';
import Counter from './Counter';
import Reveal from './motion/Reveal';
import Parallax from './motion/Parallax';

/*
 * "Get Your Reports Instantly on WhatsApp".
 *
 * The page's one deliberately lopsided section. After a run of full-width
 * sections the eye stops registering boundaries, so this one puts the copy in a
 * narrow left column and lets the device mockup run past the page margin to the
 * screen edge on the right — the asymmetry is what marks the section, rather
 * than a change of background.
 *
 * The counters sit inline beneath the CTA on a hairline grid. They are evidence
 * for the paragraph above them, so they read as part of it instead of being
 * promoted into three separate boxes.
 */
export default function WhatsAppReports() {
  return (
    <section className="section-lg overflow-hidden rule-top">
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          {/* ------------------------------------------------------- copy */}
          <Reveal>
            <h2 className="display-lg">{whatsappReports.heading}</h2>
            <p className="section-sub max-w-md">{whatsappReports.text}</p>

            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-brand group mt-9"
            >
              {whatsappReports.cta}
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <dl className="mt-14 grid grid-cols-3 border-t border-ink/12">
              {whatsappReports.counters.map((c, i) => (
                <div
                  key={c.label}
                  className={`py-7 ${i > 0 ? 'border-l border-ink/12 pl-5' : 'pr-5'}`}
                >
                  <dd className="stat-figure text-[clamp(1.5rem,2.1vw,2.125rem)] text-brand">
                    <Counter value={c.value} suffix={c.suffix} />
                  </dd>
                  <dt className="mt-3 text-[12.5px] leading-snug text-body">{c.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* ------------------------------------------------------ media */}
          <Reveal y={28} delay={0.08} className="relative">
            {/*
              A brand-light field behind the mockup, bleeding off the right edge
              of the page. The illustration is a flat SVG on white and has
              nothing holding it to the layout otherwise.
            */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 -right-[clamp(1rem,4vw,5rem)] left-0 -z-10 rounded-l-[2.5rem] bg-brand-light/60"
            />
            <Parallax distance={48} className="px-6 py-10 sm:px-12 sm:py-14">
              <img
                src={whatsappReports.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="mx-auto w-full max-w-md"
              />
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
