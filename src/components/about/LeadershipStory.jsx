import { accreditations, leadership } from "../../data/about";
import Reveal from "../motion/Reveal";
import Parallax from "../motion/Parallax";

/*
 * The founder's story — the heart of an About page.
 *
 * This is the only passage on the site that says where Arova came from: founded
 * in 1995, run now by the second generation, more than 25 years of clinical
 * laboratory service in Dharmapuri. So it gets the page's most deliberate
 * composition rather than a portrait in a card beside two grey paragraphs.
 *
 * The portrait column is sticky on wide screens, so the face stays with the
 * reader while the history scrolls past it, and the first paragraph takes a
 * lead-in treatment so the passage has an obvious entry point.
 *
 * The NABL certificate closes the passage at document scale. It is the only
 * primary source on the site — every other credential is the logo of the body
 * that issued it — and a document too small to read is the same as no document.
 */
export default function LeadershipStory() {
  const [lead, ...rest] = leadership.paragraphs;
  const nabl =
    accreditations.items.find((a) => a.title.includes("NABL")) ??
    accreditations.items[1];

  return (
    <section id="story" className="section-lg scroll-mt-24 band-wash">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="label-section mb-6 text-ink/35">{leadership.heading}</p>
          <h2 className="display-lg">{leadership.name}</h2>
          <p className="mt-3 text-[15px] font-semibold text-brand">
            {leadership.role}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------- portrait column */}
          <Reveal
            y={24}
            className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
          >
            <figure className="overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-ink/10">
              <Parallax distance={40} className="aspect-[4/5] w-full">
                <img
                  src={leadership.image}
                  alt={leadership.name}
                  loading="lazy"
                  decoding="async"
                  className="size-full scale-110 object-cover"
                />
              </Parallax>
            </figure>
          </Reveal>

          {/* ---------------------------------------------- the history */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal
              as="p"
              className="measure text-[17px] leading-[1.75] text-ink"
            >
              {lead}
            </Reveal>

            {rest.map((paragraph, i) => (
              <Reveal
                as="p"
                key={i}
                delay={0.06 * (i + 1)}
                className="measure mt-6 text-[15px] leading-[1.85] text-body"
              >
                {paragraph}
              </Reveal>
            ))}

            {/*
              The accreditation certificate, closing the story it belongs to.
              A document is only evidence if it can be read, so it is reproduced
              at its own 724×1024 ratio in a plain white mount with a generous
              border — the way a certificate is actually framed — rather than
              shrunk to a thumbnail. It is not a link: there is nowhere more
              useful for it to go than the page it is already on.
            */}
            <Reveal y={22} delay={0.1} className="mt-12">
              <figure className="max-w-md">
                <div className="rounded-2xl bg-white p-4 shadow-[var(--shadow-raise)] ring-1 ring-inset ring-ink/10 sm:p-6">
                  <img
                    src={leadership.certificate}
                    alt={`${nabl.title} certificate — ${nabl.subtitle}`}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[724/1024] w-full rounded-lg object-contain ring-1 ring-inset ring-ink/8"
                  />
                </div>

                <figcaption className="mt-5 border-t border-ink/12 pt-4">
                  <span className="block text-[15px] font-semibold text-ink">
                    {nabl.title}
                  </span>
                  <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-brand">
                    {nabl.subtitle}
                  </span>
                  <span className="mt-2 block text-[13px] leading-relaxed text-body">
                    {nabl.text}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
