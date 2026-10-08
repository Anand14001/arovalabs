import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Listing from './pages/Listing';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import ArchiveRedirect from './pages/ArchiveRedirect';
import BlogPost from './pages/BlogPost';
import BlogCategory from './pages/BlogCategory';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyAccount from './pages/MyAccount';
import UploadPrescription from './pages/UploadPrescription';
import BookingConfirmation from './pages/BookingConfirmation';
import ReportDownload from './pages/ReportDownload';
import {
  LegalPage,
  NotFound,
  SamplePage,
  StubPage,
  WelcomePage,
} from './pages/SimplePages';

/*
 * Routes mirror the reference site's URLs exactly, trailing slash included, so
 * every original link and direct URL still resolves. See AUDIT.md §1.
 *
 * The blog-post route (/:slug/) is last among the top-level matches because the
 * reference site serves posts off the site root.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* Listing pages */}
        <Route path="/tests/" element={<Listing which="tests" />} />
        <Route path="/packages/" element={<Listing which="packages" />} />

        {/* Static pages */}
        <Route path="/about-us/" element={<About />} />
        <Route path="/contact-us/" element={<Contact />} />
        <Route path="/upload-prescription/" element={<UploadPrescription />} />
        <Route path="/welcome-page/" element={<WelcomePage />} />
        <Route path="/booking-confirmation/" element={<BookingConfirmation />} />
        {/* Where an emailed or WhatsApped report link lands. */}
        <Route path="/report/" element={<ReportDownload />} />
        <Route path="/patient-login/" element={<StubPage slug="patient-login" />} />
        <Route path="/doctor-login/" element={<StubPage slug="doctor-login" />} />
        <Route path="/privacy-policy/" element={<LegalPage slug="privacy-policy" />} />
        <Route path="/terms-of-service/" element={<LegalPage slug="terms-of-service" />} />
        <Route path="/sample-page/" element={<SamplePage />} />

        {/* WooCommerce. The archive paths now redirect into the listings. */}
        <Route path="/shop/" element={<ArchiveRedirect mode="shop" />} />
        <Route path="/cart/" element={<Cart />} />
        <Route path="/checkout/" element={<Checkout />} />
        <Route path="/my-account/" element={<MyAccount />} />
        <Route path="/product/:slug/" element={<ProductDetail />} />
        <Route
          path="/product-category/:parent/"
          element={<ArchiveRedirect mode="category" />}
        />
        <Route
          path="/product-category/:parent/:child/"
          element={<ArchiveRedirect mode="category" />}
        />
        <Route path="/product-tag/:slug/" element={<ArchiveRedirect mode="tag" />} />

        {/* Blog */}
        <Route path="/category/:slug/" element={<BlogCategory />} />

        {/* Posts live at the site root on the reference site — keep this last. */}
        <Route path="/:slug/" element={<BlogPost />} />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
