import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { contact, footerLegalLinks, footerQuickLinks, site } from '../data/site';
import Newsletter from './Newsletter';

// Background is the brand teal #2B7E83, matching the reference footer
// (confirmed in Elementor's post-339.css).
export default function Footer() {
  return (
    <footer className="mt-4 bg-brand text-white/85">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
        {/* Brand */}
        <div>
          <img src={site.logoWhite} alt={site.title} className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">{site.tagline}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-base font-bold text-white">Quick Links</h2>
          <ul className="mt-4 space-y-2.5">
            {footerQuickLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h2 className="text-base font-bold text-white">Get in Touch</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {contact.footerPhones.map((p) => (
              <li key={p.label}>
                <a
                  href={`tel:${p.tel}`}
                  className="flex items-start gap-2.5 text-white/80 transition-colors hover:text-white"
                >
                  <Phone size={15} className="mt-0.5 shrink-0 text-white" />
                  <span>{p.label}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={contact.footerWhatsapp.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 text-white/80 transition-colors hover:text-white"
              >
                <MessageCircle size={15} className="mt-0.5 shrink-0 text-white" />
                <span>{contact.footerWhatsapp.label}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-2.5 break-all text-white/80 transition-colors hover:text-white"
              >
                <Mail size={15} className="mt-0.5 shrink-0 text-white" />
                <span>{contact.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-white/80">
              <MapPin size={15} className="mt-0.5 shrink-0 text-white" />
              <span>{contact.address}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <Newsletter />
      </div>

      <div className="border-t border-white/20">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/80">{site.copyright}</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLegalLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-xs text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
