import { Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowUp, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { contact, footerLegalLinks, footerQuickLinks, site } from '../data/site';
import Newsletter from './Newsletter';

/*
 * Site footer.
 *
 * The teal is the reference footer's own (#2B7E83, confirmed in Elementor's
 * post-339.css) and stays. What changes is that it is no longer four equal
 * columns of small text, which gave the brand statement, a list of five links,
 * a block of contact details and a signup form exactly the same weight.
 *
 * It now closes the page in three movements:
 *
 *   1. Sign-off — the logo and the positioning line set large, with the signup
 *      opposite it. This is the last thing a visitor reads, so it gets to be a
 *      statement rather than the first of four columns.
 *   2. Directory — links and contact routes below a hairline, at the size
 *      reference material should be.
 *   3. Legal strip — copyright, policies and a return to the top.
 *
 * Every string, link and phone number the old footer carried is still here.
 */
export default function Footer() {
  const lenis = useLenis();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="band-brand">
      <div className="shell pb-10 pt-16 sm:pt-20">
        {/* ------------------------------------------------- 1. sign-off */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            {/*
              The white logo SVG paints from a rect that overflows its own
              viewBox, so the wordmark fills barely a third of the box. It needs
              a taller box than the header logo to read at the same size.
            */}
            <img src={site.logoWhite} alt={site.title} className="-ml-2 h-20 w-auto" />
            <p className="display-md mt-8 max-w-lg text-white">{site.tagline}</p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Newsletter />
          </div>
        </div>

        {/* ------------------------------------------------ 2. directory */}
        <div className="mt-16 grid gap-10 border-t border-white/15 pt-12 lg:grid-cols-12 lg:gap-16">
          <nav aria-label="Footer" className="lg:col-span-4">
            <h2 className="label-section text-white/45">Quick Links</h2>
            <ul className="mt-6 space-y-1">
              {footerQuickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group relative inline-flex items-center py-1.5 text-[15px] text-white/75 transition-colors hover:text-white"
                  >
                    {/* A rule that grows on hover — the same affordance the
                        nav's active marker uses, so the two feel related. */}
                    <span
                      aria-hidden="true"
                      className="absolute right-full top-1/2 h-px w-0 bg-accent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-4 group-hover:-translate-x-2"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-8">
            <h2 className="label-section text-white/45">Get in Touch</h2>

            <ul className="mt-6 grid gap-x-10 gap-y-1 sm:grid-cols-2">
              {contact.footerPhones.map((p) => (
                <ContactRow key={p.label} href={`tel:${p.tel}`} icon={Phone}>
                  {p.label}
                </ContactRow>
              ))}

              <ContactRow
                href={contact.footerWhatsapp.href}
                icon={MessageCircle}
                external
              >
                {contact.footerWhatsapp.label}
              </ContactRow>

              <ContactRow href={`mailto:${contact.email}`} icon={Mail}>
                {contact.email}
              </ContactRow>

              <ContactRow icon={MapPin} className="sm:col-span-2">
                {contact.address}
              </ContactRow>
            </ul>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- 3. legal */}
      <div className="border-t border-white/15">
        <div className="shell flex flex-col items-center justify-between gap-5 py-6 sm:flex-row">
          <p className="text-xs text-white/55">{site.copyright}</p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLegalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-xs text-white/55 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/*
              Returns to the top through Lenis rather than `window.scrollTo`, so
              the journey back up is the same smoothed motion as the way down.
            */}
            <button
              type="button"
              onClick={toTop}
              aria-label="Back to top"
              className="group grid size-9 place-items-center rounded-full text-white/70 ring-1 ring-inset ring-white/25 transition-all duration-300 hover:bg-white hover:text-brand hover:ring-white"
            >
              <ArrowUp
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
 * One contact route. Renders as a link when there is somewhere to go and as
 * plain text otherwise — the address has no target, and a link that does
 * nothing is worse than no link.
 */
function ContactRow({ href, icon: Icon, children, external, className = '' }) {
  const body = (
    <>
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-brand">
        <Icon size={13} />
      </span>
      <span className="text-[15px] leading-relaxed">{children}</span>
    </>
  );

  return (
    <li className={className}>
      {href ? (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="group flex items-start gap-3 py-2 text-white/75 transition-colors hover:text-white"
        >
          {body}
        </a>
      ) : (
        <span className="group flex items-start gap-3 py-2 text-white/75">{body}</span>
      )}
    </li>
  );
}
