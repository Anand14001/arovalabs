import { ArrowUpRight, Phone } from 'lucide-react';
import { homeCollection, quickActions } from '../../data/homepage';
import { contact } from '../../data/site';
import Reveal, { RevealGroup, RevealItem } from '../motion/Reveal';

/*
 * Home sample collection.
 *
 * The page's one full-colour field, and placed deliberately: a visitor who has
 * just read six addresses and found none of them convenient is exactly who this
 * service is for. Answering that objection at the moment it occurs is what
 * keeps the section part of the contact journey instead of an advertisement
 * dropped into the page.
 *
 * It is also the only inverted surface here, which is what gives the page its
 * midpoint rest between the map band above and the form below.
 *
 * Heading, standfirst, the four steps and the number are all the site's own.
 */
export default function HomeCollectionCTA() {
  const [whatsapp, call] = quickActions;

  return (
    <section className="band-brand">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="label mb-6 text-white/45">{homeCollection.heading}</p>
            <h2 className="display-lg max-w-xl text-white">{homeCollection.sub}</h2>
          </Reveal>

          {/* The number is the headline action: on a contact page the fastest
              conversion is someone reading it and dialling. */}
          <Reveal delay={0.08} className="lg:col-span-5 lg:justify-self-end">
            <a href={`tel:${contact.homeCollection.tel}`} className="group flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:scale-105">
                <Phone size={19} strokeWidth={1.9} />
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-[0.16em] text-white/50">
                  {homeCollection.heading}
                </span>
                <span className="stat-figure mt-1 block text-[clamp(1.5rem,2.4vw,2.25rem)] text-white">
                  {contact.homeCollection.label}
                </span>
              </span>
            </a>
          </Reveal>
        </div>

        {/* The four steps, as one divided row rather than four floating cards. */}
        <RevealGroup
          as="ol"
          stagger={0.08}
          className="mt-14 grid border-t border-white/20 sm:grid-cols-2 lg:grid-cols-4"
        >
          {homeCollection.steps.map((step, i) => (
            <RevealItem
              as="li"
              key={step.title}
              y={14}
              className="border-b border-white/20 px-0 py-7 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:last:pr-0"
            >
              <span className="stat-figure block text-[1.5rem] text-white/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 max-w-[15rem] text-[15px] font-semibold leading-snug text-white">
                {step.title}
              </h3>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href={call.href}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors duration-300 hover:bg-accent hover:text-white"
          >
            {call.title}
          </a>
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-brand"
          >
            {whatsapp.title}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
