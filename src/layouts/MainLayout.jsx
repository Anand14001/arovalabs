import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import Header from '../components/Header';
import TrustRibbon from '../components/TrustRibbon';
import Footer from '../components/Footer';
import FloatingCart from '../components/FloatingCart';
import ScrollProgress from '../components/ScrollProgress';
import { useCart } from '../context/CartContext';

// Shared chrome for every page: header, footer and the floating cart widget.
export default function MainLayout() {
  const { pathname } = useLocation();
  const { count } = useCart();
  // Undefined when smooth scrolling is off (reduced-motion), so guard the call.
  const lenis = useLenis();

  /*
   * The reference site is multi-page, so each navigation starts at the top.
   * This has to go through Lenis rather than `window.scrollTo`: Lenis keeps its
   * own target position, and writing scrollTop behind its back makes it
   * immediately animate back to where it thought it was.
   */
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, lenis]);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      {/* Announcement-bar slot: the trust claims sit above the navigation. */}
      <TrustRibbon />
      <Header />

      {/* Bottom padding only when the fixed cart bar is actually on screen. */}
      <main id="content" className={`flex-1 ${count > 0 ? 'pb-24' : ''}`}>
        <Outlet />
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
}
