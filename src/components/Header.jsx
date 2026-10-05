import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowUpRight, Menu, Phone, Search, ShoppingBag, User, X } from 'lucide-react';
import { contact, mainNav, site } from '../data/site';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import LoginPopup from './LoginPopup';
import SearchOverlay from './search/SearchOverlay';

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.966 1.164-.199.198-.397.223-.694.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.146-.147.52-.608.68-.806.162-.198.216-.33.324-.552.108-.223.054-.412-.027-.561-.08-.15-.676-1.63-.926-2.223-.242-.579-.487-.5-.676-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/*
 * Site header.
 *
 * The previous version was two separate bars, and only the lower one was
 * sticky — so the moment you scrolled, the logo scrolled away with the top bar
 * and the pinned bar was left with no brand on it at all. It also carried two
 * search affordances (an inline form upstairs, an icon downstairs) and put the
 * nav in a row with nothing on its left, which left it floating.
 *
 * This is one sticky element with two tiers inside it:
 *
 *   Utility tier — the contact routes (home collection number, phone,
 *     WhatsApp). Real content for a diagnostics lab, but not what you need in
 *     hand at all times, so it collapses to nothing on scroll.
 *
 *   Primary tier — logo, navigation, search, account, cart, sign-in. Always
 *     present, always sticky, and it tightens slightly once the page moves.
 *
 * The result keeps every piece of content the old header carried, shows the
 * brand at every scroll position, and gives back roughly 60px of vertical space
 * once you start reading.
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, total } = useCart();
  const { pathname } = useLocation();
  const lenis = useLenis();

  // Close the off-canvas nav whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  /*
   * Lock scrolling behind the off-canvas nav. Lenis has to be stopped
   * explicitly — it listens on the window, so hiding body overflow alone
   * leaves it free to keep driving the scroll position underneath the panel.
   */
  useEffect(() => {
    if (mobileOpen) lenis?.stop();
    else lenis?.start();

    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [mobileOpen, lenis]);

  // Collapse the utility tier once the page has moved off the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-40 bg-white/85 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_0_0_rgb(24_21_17/0.1),0_8px_24px_-18px_rgb(24_21_17/0.3)]' : 'shadow-[0_1px_0_0_rgb(24_21_17/0.08)]'
        }`}
      >
        {/* ------------------------------------------------ utility tier */}
        <div
          className={`hidden overflow-hidden transition-[height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
            scrolled ? 'h-0 opacity-0' : 'h-11 opacity-100'
          }`}
        >
          <div className="shell flex h-11 items-center justify-between gap-6">
            <a
              href={`tel:${contact.homeCollection.tel}`}
              className="group flex items-center gap-2.5 text-[13px]"
            >
              <span className="grid size-6 place-items-center rounded-full bg-accent-light text-accent">
                <Phone size={12} strokeWidth={2.4} />
              </span>
              <span className="text-body">Home Collection</span>
              <span className="font-semibold text-ink transition-colors group-hover:text-brand">
                {contact.homeCollection.label}
              </span>
            </a>

            <div className="flex items-center gap-5">
              <a
                href={`tel:${contact.headerTel}`}
                className="flex items-center gap-2 text-[13px] text-body transition-colors hover:text-brand"
              >
                <Phone size={14} />
                {contact.headerTel}
              </a>
              <span className="h-3.5 w-px bg-ink/15" aria-hidden="true" />
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13px] text-body transition-colors hover:text-[#25D366]"
              >
                <WhatsAppIcon className="size-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ primary tier */}
        <div
          className={`shell flex items-center justify-between gap-4 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? 'py-2.5' : 'py-3.5'
          }`}
        >
          {/* Brand — now inside the sticky tier, so it never scrolls away. */}
          <Link to="/" className="shrink-0" aria-label={site.title}>
            <img
              src={site.logo}
              alt={site.title}
              className={`w-auto transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                scrolled ? 'h-9' : 'h-10 sm:h-11'
              }`}
            />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {mainNav.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <IconButton label="Open search" onClick={() => setSearchOpen(true)}>
              <Search size={19} />
            </IconButton>

            <IconButton as={Link} to="/my-account/" label="My account" className="hidden sm:grid">
              <User size={19} />
            </IconButton>

            {/* Cart carries its value, not just a count — it is the one control
                here whose state the visitor is actively tracking. */}
            <Link
              to="/cart/"
              className="group flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-1.5 transition-colors hover:bg-brand-light/60 sm:pr-3"
            >
              <span className="relative text-ink">
                <ShoppingBag size={19} />
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold tabular-nums text-white">
                    {count}
                  </span>
                )}
              </span>
              <span className="hidden text-[13px] font-semibold tabular-nums text-ink sm:inline">
                {formatPrice(total)}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="btn-brand group ml-1.5 hidden !px-5 !py-2.5 text-[13px] lg:inline-flex"
            >
              Login &amp; Sign Up
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="ml-1 grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-brand-light/60 lg:hidden"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ mobile panel */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-400 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          id="mobile-nav"
          className={`absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <Link to="/" onClick={() => setMobileOpen(false)} aria-label={site.title}>
              <img src={site.logo} alt={site.title} className="h-9 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-brand-light/60"
            >
              <X size={20} />
            </button>
          </div>

          {/*
            Navigation at display size with a number against each item — the
            same index pattern the page uses for its own sections, so the menu
            reads as part of the site rather than as a stock drawer.
          */}
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-2">
            <ul className="border-t border-ink/10">
              {mainNav.map((item, i) => (
                <li key={item.to} className="border-b border-ink/10">
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-4 py-4 transition-colors ${
                        isActive ? 'text-brand' : 'text-ink'
                      }`
                    }
                  >
                    <span className="label text-ink/25">{String(i + 1).padStart(2, '0')}</span>
                    <span className="display-md flex-1">{item.label}</span>
                    <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-ink/25" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4 border-t border-ink/10 p-5">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setLoginOpen(true);
              }}
              className="btn-brand w-full"
            >
              Login &amp; Sign Up
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${contact.headerTel}`}
                className="btn-outline !px-3 !py-2.5 text-[13px]"
              >
                <Phone size={15} />
                Call
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-outline !px-3 !py-2.5 text-[13px]"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            </div>

            <a
              href={`tel:${contact.homeCollection.tel}`}
              className="flex items-center justify-center gap-2 text-[13px] text-body"
            >
              Home Collection
              <span className="font-semibold text-brand">{contact.homeCollection.label}</span>
            </a>
          </div>
        </aside>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginPopup open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

/*
 * A nav item with its own active marker: a 2px accent rule under the label,
 * scaled in from the centre. A background chip would fight the hairline
 * language the rest of the page is built from.
 */
function NavItem({ item }) {
  return (
    <NavLink to={item.to} end={item.to === '/'} className="group relative py-1">
      {({ isActive }) => (
        <>
          <span
            className={`text-[13.5px] font-semibold tracking-tight transition-colors duration-200 ${
              isActive ? 'text-brand' : 'text-ink/70 group-hover:text-ink'
            }`}
          >
            {item.label}
          </span>
          <span
            aria-hidden="true"
            className={`absolute -bottom-1 left-0 block h-[2px] w-full origin-center rounded-full bg-accent transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

/* Circular icon control — one shape for every icon-only action in the bar. */
function IconButton({ as: Tag = 'button', label, children, className = '', ...rest }) {
  return (
    <Tag
      {...(Tag === 'button' ? { type: 'button' } : {})}
      aria-label={label}
      className={`grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-brand-light/60 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
