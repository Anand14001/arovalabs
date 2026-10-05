import { ArrowDown, Mail } from 'lucide-react';
import { contactPage } from '../../data/pages';
import { locationsSection } from '../../data/about';
import { contact } from '../../data/site';
import Reveal from '../motion/Reveal';
import Parallax from '../motion/Parallax';
import ContactForm from './ContactForm';

/*
 * The contact opening: photograph on one side, the form on the other.
 *
 * Putting the form in the hero is the whole argument of the page. A contact
 * page that opens with a banner and buries its form two screens down asks a
 * visitor to scroll before they can do the one thing they came for. Here the
 * first screen is the thing itself, with the headline and the direct email
 * above it for anyone who would rather not fill anything in.
 *
 * The photograph runs full-bleed to the left edge rather than sitting inside
 * the page gutter — it reads as a window rather than as an image placed in a
 * column, and it gives the form a quiet field to sit against. It drifts on
 * scroll through the shared Parallax primitive, which reads the Lenis-smoothed
 * scroll position, so the movement carries the same easing as the page.
 */
export default function ContactHero() {
  return (
    <section className="lg:grid lg:min-h-[46rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* ---------------------------------------------- the photograph */}
      <div className="relative h-64 overflow-hidden bg-brand-light sm:h-80 lg:h-auto">
        <Parallax distance={70} className="absolute inset-0">
          {/*
            Scaled past the frame so the parallax travel never drags a bare
            edge into view at either end of its range.
          */}
          <img
            src={contactPage.formImage}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="size-full scale-110 object-cover"
          />
        </Parallax>
      </div>

      {/* ---------------------------------------------------- the form */}
      <div className="px-[clamp(1rem,4vw,5rem)] py-14 sm:py-20 lg:py-24 lg:pl-[clamp(2.5rem,5vw,6rem)]">
        <div className="mx-auto max-w-xl lg:mx-0">
          <Reveal>
            <p className="label mb-6 text-ink/35">Contact Us</p>
            <h1 className="display-lg">{contactPage.heading}</h1>

            {/* The manual route, for anyone who would rather not use a form. */}
            <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-body">
              Or reach us directly at
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex items-center gap-2 font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                <Mail size={15} aria-hidden="true" />
                {contact.email}
              </a>
            </p>
          </Reveal>

          <Reveal y={20} delay={0.08} className="mt-9">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.14} className="mt-10">
            <a
              href="#locations"
              className="group inline-flex items-center gap-3 text-[13px] font-semibold text-body transition-colors hover:text-brand"
            >
              <span className="grid size-9 place-items-center rounded-full ring-1 ring-inset ring-ink/15 transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:ring-brand">
                <ArrowDown size={15} />
              </span>
              {locationsSection.heading}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
