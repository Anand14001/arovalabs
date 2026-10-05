import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import Header from '../components/Header';
import TrustRibbon from '../components/TrustRibbon';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import Toasts from '../components/Toasts';

// Shared chrome for every page: trust ribbon, header, footer.
export default function MainLayout() {
  const { pathname } = useLocation();
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

      <main id="content" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <Toasts />
    </div>
  );
}
