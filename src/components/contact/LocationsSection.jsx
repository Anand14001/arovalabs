import { useState } from 'react';
import { ArrowUpRight, Clock, Phone } from 'lucide-react';
import { locations, locationsSection } from '../../data/about';
import Reveal from '../motion/Reveal';

/*
 * Laboratory locations — the page's closing section.
 *
 * Six real collection points, each with an address, a phone number, hours and a
 * verified Google Maps link.
 *
 * The form is tabs, one large map, and a detail card. A list beside a map makes
 * the visitor read six addresses and hold them in their head; a tab bar makes
 * the choice the only decision on screen, and the map then answers it at full
 * width. With six locations whose names are the thing people recognise —
 * DHARMAPURI, SALEM, PENNAGARAM — the names are the right affordance to select
 * by.
 *
 * The detail card sits over the foot of the map on wide screens and above it on
 * narrow ones. That ordering is deliberate: on a phone the address, the phone
 * number and the directions link are what people came for, and a full-width map
 * ahead of them pushes all three off the first screen.
 *
 * On the map source: the reference site's contact embed points at the London
 * Eye (a documented bug — see AUDIT.md). The embed here is built from the
 * selected laboratory's own address using the same URL shape the site's other
 * embed already uses, and "Get directions" still goes to the verified short
 * link in the data, which remains the authoritative route.
 */

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

const mapSrc = (address) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=m&z=15&output=embed&iwloc=near`;

export default function LocationsSection() {
  const [active, setActive] = useState(0);
  const selected = locations[active];

  /*
   * Top padding only. The map is the last thing on the page, so the section's
   * usual bottom padding would leave a band of white between it and the footer.
   */
  return (
    <section
      id="locations"
      className="scroll-mt-20 rule-top pt-[clamp(3.5rem,5.75vw,6rem)]"
    >
      <div className="shell">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <p className="label mb-6 text-ink/35">
              <span className="label-num">{String(locations.length).padStart(2, '0')}</span>
              {locationsSection.sub}
            </p>
            <h2 className="display-lg">{locationsSection.heading}</h2>
          </div>
        </Reveal>

        {/*
          The selector. Scrolls sideways on narrow screens rather than wrapping
          into a block that pushes the map off the fold; the negative margin
          lets a cut-off name run to the screen edge and read as "more here".
        */}
        <Reveal
          delay={0.06}
          className="-mx-[clamp(1rem,4vw,5rem)] mt-10 overflow-x-auto px-[clamp(1rem,4vw,5rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            role="tablist"
            aria-label={locationsSection.heading}
            className="flex w-max items-center gap-2 border-b border-ink/10 pb-px"
          >
            {locations.map((location, i) => {
              const isActive = i === active;
              return (
                <button
                  key={location.name}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 px-4 py-3 text-[13px] font-semibold tracking-tight transition-colors duration-300 ${
                    isActive ? 'text-brand' : 'text-body hover:text-ink'
                  }`}
                >
                  {location.name}
                  {/* The active marker is a rule on the shared baseline — the
                      same affordance the navbar uses. */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-px block h-[2px] rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* ------------------------------------------------ map + detail */}
      <div className="relative mt-8">
        {/*
          Detail first in the document, so narrow screens get the address, the
          number and the directions before the map. On `lg` it lifts onto the
          map's lower edge.
        */}
        <div className="shell lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-8 lg:z-10">
          <Reveal
            key={selected.name}
            y={14}
            className="card pointer-events-auto flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:max-w-3xl"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h3 className="text-base font-semibold tracking-tight text-ink">
                  {selected.name}
                </h3>
                <span className="rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  {selected.badge}
                </span>
              </div>

              <p className="mt-2 text-[13px] leading-relaxed text-body">{selected.address}</p>

              <p className="mt-2 flex items-center gap-1.5 text-[12px] text-ink/45">
                <Clock size={12} />
                {selected.hours}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <a
                href={telHref(selected.phone)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-ink ring-1 ring-inset ring-ink/15 transition-all duration-300 hover:bg-ink hover:text-white hover:ring-ink"
              >
                <Phone size={14} />
                <span className="whitespace-nowrap">{selected.phone}</span>
              </a>

              <a
                href={selected.directions}
                target="_blank"
                rel="noreferrer"
                className="btn-brand group !px-5 !py-2.5 text-[13px]"
              >
                Get directions
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </Reveal>
        </div>

        <iframe
          /* Re-keyed so the embed reloads on the selected laboratory. */
          key={selected.name}
          src={mapSrc(selected.address)}
          title={`Map of Arova Labs ${selected.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="mt-6 h-[20rem] w-full border-0 lg:mt-0 lg:h-[34rem]"
        />
      </div>
    </section>
  );
}
