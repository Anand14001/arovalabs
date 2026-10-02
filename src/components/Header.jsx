import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Phone, Search, ShoppingBag, User, X } from 'lucide-react';
import { contact, mainNav, searchPlaceholder, site } from '../data/site';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import LoginPopup from './LoginPopup';
import SearchPopup from './SearchPopup';

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.966 1.164-.199.198-.397.223-.694.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.146-.147.52-.608.68-.806.162-.198.216-.33.324-.552.108-.223.054-.412-.027-.561-.08-.15-.676-1.63-.926-2.223-.242-.579-.487-.5-.676-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { count, total } = useCart();
  const { pathname } = useLocation();

  // Close the off-canvas nav whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Lock body scroll behind the off-canvas nav.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }) =>
    [
      'relative py-2 text-sm font-semibold transition-colors',
      isActive ? 'text-brand' : 'text-ink hover:text-brand',
    ].join(' ');

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* ---------- Top bar (desktop only on the reference site) ---------- */}
      <div className="hidden border-b border-slate-200 bg-white lg:block">
        <div className="shell flex items-center justify-between gap-6 py-3">
          <Link to="/" className="shrink-0">
            <img src={site.logo} alt={site.title} className="h-11 w-auto" />
          </Link>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="flex max-w-md flex-1 items-center"
          >
            <label htmlFor="topbar-search" className="sr-only">
              Search
            </label>
            <div className="flex w-full items-center rounded-lg border border-slate-300 bg-white focus-within:border-brand">
              <input
                id="topbar-search"
                type="search"
                name="s"
                placeholder={searchPlaceholder}
                className="w-full rounded-l-lg px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="rounded-r-lg px-3 py-2 text-brand hover:text-brand-dark"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${contact.headerTel}`}
              aria-label="Call Arova Labs"
              className="grid size-9 place-items-center rounded-full bg-brand-light text-brand transition-colors hover:bg-brand hover:text-white"
            >
              <Phone size={17} />
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              className="grid size-9 place-items-center rounded-full bg-[#e8f7ee] text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
            >
              <WhatsAppIcon className="size-[18px]" />
            </a>

            <a href={`tel:${contact.homeCollection.tel}`} className="flex items-center gap-2">
              <img
                src="/assets/ChatGPT_Image_Mar_24__2026__07_20_19_AM-removebg-preview.webp"
                alt=""
                className="h-10 w-auto"
              />
              <span className="leading-tight">
                <span className="block text-xs font-semibold text-ink">Home Collection</span>
                <span className="block text-sm font-bold text-brand">
                  {contact.homeCollection.label}
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ---------- Main header ---------- */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="shell flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="grid size-10 place-items-center rounded-lg text-ink hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="shrink-0 lg:hidden">
              <img src={site.logo} alt={site.title} className="h-9 w-auto" />
            </Link>
          </div>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {mainNav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="grid size-10 place-items-center rounded-lg text-ink hover:bg-slate-100"
            >
              <Search size={20} />
            </button>

            <Link
              to="/my-account/"
              aria-label="My account"
              className="grid size-10 place-items-center rounded-lg text-ink hover:bg-slate-100"
            >
              <User size={20} />
            </Link>

            <Link
              to="/cart/"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-ink hover:bg-slate-100"
            >
              <span className="relative">
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </span>
              <span className="hidden text-xs font-semibold sm:inline">
                {formatPrice(total)} {count} Cart
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="btn-brand hidden lg:inline-flex"
            >
              Login &amp; Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Mobile off-canvas nav ---------- */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          id="mobile-nav"
          className={`absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-white shadow-xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              <img src={site.logo} alt={site.title} className="h-9 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-3">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 text-sm font-semibold ${
                    isActive ? 'bg-brand-light text-brand' : 'text-ink hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3 border-t border-slate-200 p-4">
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
            <a
              href={`tel:${contact.homeCollection.tel}`}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-brand"
            >
              <Phone size={15} /> {contact.homeCollection.label}
            </a>
          </div>
        </aside>
      </div>

      <SearchPopup open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginPopup open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
