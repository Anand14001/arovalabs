import { accreditations, whyChooseAbout } from "../../data/about";
import Reveal, { RevealGroup, RevealItem } from "../motion/Reveal";

/*
 * Accreditations, then the reasons.
 *
 * The four accreditation marks are image-led tiles — they are external bodies
 * with their own marks, and the picture is the point. The four "why choose"
 * items follow as a plain divided row: supporting claims, not credentials, and
 * they should not look like credentials.
 *
 * The NABL certificate itself lives with the founder's story, where it reads as
 * the document behind the history rather than a fifth tile in a row of logos.
 */
export default function Accreditations() {
  return (
    <section className="section-lg">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="label-section mb-6 text-ink/35">
            <span className="label-num">03</span>
            Accreditation
          </p>
          <h2 className="display-lg">{accreditations.heading}</h2>
        </Reveal>

        {/* ------------------------------------------ the issuing bodies */}
        <RevealGroup
          as="ul"
          stagger={0.08}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {accreditations.items.map((item) => (
            <RevealItem as="li" key={item.title} y={18} className="flex">
              <article className="card card-interactive group flex w-full flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-light/50">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[15px] font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand">
                    {item.subtitle}
                  </p>
                  <p className="mt-3 flex-1 text-[13px] leading-relaxed text-body">
                    {item.text}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* ------------------------------------------------ the reasons */}
        <Reveal className="mt-20 flex items-center gap-5">
          <h3 className="label-section shrink-0 text-ink/35">
            {whyChooseAbout.heading}
          </h3>
          <span className="h-px flex-1 bg-ink/12" aria-hidden="true" />
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.07}
          className="mt-8 grid border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {whyChooseAbout.items.map((item, i) => (
            <RevealItem
              as="li"
              key={item.title}
              y={14}
              className={`border-b border-ink/12 py-7 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:last:pr-0 ${
                i === 0 ? "sm:pl-0" : ""
              }`}
            >
              <img
                src={item.icon}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-10"
              />
              <h4 className="mt-5 text-[15px] font-semibold text-ink">
                {item.title}
              </h4>
              <p className="mt-2 max-w-[15rem] text-[13px] leading-relaxed text-body">
                {item.text}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
