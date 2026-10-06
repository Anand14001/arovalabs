import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Phone } from "lucide-react";
import { locations, locationsSection } from "../../data/about";
import Reveal, { RevealGroup, RevealItem } from "../motion/Reveal";

/*
 * The laboratories, as the page's closing roll-call.
 *
 * Deliberately not the finder that /contact-us/ carries. That page owns the
 * interactive map and the per-laboratory selection because finding one is what
 * someone is there to do; repeating the whole apparatus here would duplicate it
 * and leave two versions to maintain. What belongs on an About page is the fact
 * of the network — six collection points, all open around the clock — so this
 * is a plain numbered index with the details and a direct route to each, and a
 * link through to the full finder.
 */

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export default function AboutLocations() {
  return (
    <section id="locations" className="section-lg scroll-mt-24 rule-top">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <div className="max-w-xl">
            <p className="label-section mb-6 text-ink/35">
              {locationsSection.sub}
            </p>
            <h2 className="display-lg">{locationsSection.heading}</h2>
          </div>

          <Link to="/contact-us/" className="link-arrow shrink-0">
            Contact Us
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>

        <RevealGroup
          as="ol"
          stagger={0.06}
          className="mt-12 grid border-t border-ink/12 md:grid-cols-2 lg:grid-cols-3"
        >
          {locations.map((location, i) => (
            <RevealItem
              as="li"
              key={location.name}
              y={14}
              className="flex flex-col border-b border-ink/12 py-7 md:px-6 md:odd:pl-0 lg:px-6 lg:[&:nth-child(3n+1)]:pl-0"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="label text-ink/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  {location.badge}
                </span>
              </div>

              <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-ink">
                {location.name}
              </h3>

              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-body">
                {location.address}
              </p>

              <p className="mt-3 flex items-center gap-1.5 text-[12px] text-ink/45">
                <Clock size={12} />
                {location.hours}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <a
                  href={telHref(location.phone)}
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-ink ring-1 ring-inset ring-ink/15 transition-all duration-300 hover:bg-brand hover:text-white hover:ring-brand"
                >
                  <Phone size={13} />
                  <span className="whitespace-nowrap">{location.phone}</span>
                </a>

                <a
                  href={location.directions}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Get directions
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
