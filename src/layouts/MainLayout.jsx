import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingCart from '../components/FloatingCart';
import { useCart } from '../context/CartContext';

// Shared chrome for every page: header, footer and the floating cart widget.
export default function MainLayout() {
  const { pathname } = useLocation();
  const { count } = useCart();

  // The reference site is multi-page, so each navigation starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
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
