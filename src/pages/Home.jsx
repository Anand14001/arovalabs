import Hero from '../components/Hero';
import QuickActions from '../components/QuickActions';
import Statistics from '../components/Statistics';
import ProductShowcase from '../components/ProductShowcase';
import OrganCategories from '../components/OrganCategories';
import HomeCollection from '../components/HomeCollection';
import WhatsAppReports from '../components/WhatsAppReports';
import CertificationSection from '../components/CertificationSection';
import VideoSection from '../components/VideoSection';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import FAQ from '../components/FAQ';
import { carouselSections, homeFaqs } from '../data/homepage';
import { useCuratedProducts } from '../lib/catalog';

/*
 * Homepage.
 *
 * Every string, image and colour here is the reference site's. What changed is
 * the architecture, because the reference page is fifteen sections of one
 * shape — centred heading, grid of white cards, repeat — and a visitor stops
 * reading a page that never changes its mind.
 *
 * Three things carry the redesign:
 *
 *   Typography. Headlines are a display serif against Inter for everything
 *   functional, and the big numbers are typeset rather than boxed. That pairing
 *   does most of the work of making the page feel considered instead of
 *   assembled.
 *
 *   Varied structure. Every section now has a shape its content argues for: the
 *   booking actions are an index of rows, the process is a sticky stack, the
 *   accreditation is an editorial spread, the videos are a bento grid, the
 *   journal is a list. No two consecutive sections share a layout.
 *
 *   Scroll. Lenis drives the whole page, and two sections use it for real
 *   rather than decoratively — the product runs pin and travel sideways, and
 *   the collection steps stack as you pass them. Both fall back to ordinary
 *   layouts on narrow screens and under `prefers-reduced-motion`.
 *
 * The sequence is four movements:
 *
 *   1. Act now   hero, the booking index, the trust ribbon, the numbers.
 *   2. Shop      tests → by organ → packages, with the organ navigator between
 *                the two runs so the page is never two carousels in a row.
 *   3. Reassure  collection, reports, accreditation — the objections, in the
 *                order they occur to someone who has just seen a price.
 *   4. Prove     prescriptions, the lab, patients, the journal, what's left.
 *
 * Section labels carry a running index (01…12): it costs no copy and gives a
 * page this long a visible spine.
 *
 * Two of the reference page's containers carry elementor-hidden-desktop,
 * -tablet AND -mobile, so they are display:none at every breakpoint and never
 * reach a visitor. They stay unrendered, with their content kept in
 * data/homepage.js as `hiddenHeroSlides` and `hiddenHealthCheckups`.
 * See AUDIT.md §2 and §3.
 */
export default function Home() {
  /*
   * The three curated product rails. All three read the same cached catalogue
   * query, so the homepage makes one request for products, not three.
   */
  const { items: frequentlyBookedTests } = useCuratedProducts('frequentlyBookedTests');
  const { items: frequentlyBookedPackages } = useCuratedProducts('frequentlyBookedPackages');
  const { items: mostPrescribedTests } = useCuratedProducts('mostPrescribedTests');
  return (
    <>
      {/* ---------------------------------------------- 1. act now --------- */}

      <Hero />
      <QuickActions />

      {/* ------------------------------------------------- 2. shop --------- */}

      <ProductShowcase
        heading={carouselSections.frequentTests.heading}
        sub={carouselSections.frequentTests.sub}
        viewMore={carouselSections.frequentTests.viewMore}
        products={frequentlyBookedTests}
        variant="test"
      />

      <OrganCategories />

      <ProductShowcase
        heading={carouselSections.frequentPackages.heading}
        sub={carouselSections.frequentPackages.sub}
        viewMore={carouselSections.frequentPackages.viewMore}
        products={frequentlyBookedPackages}
        variant="package"
      />

      {/* --------------------------------------------- 3. reassure --------- */}

      <HomeCollection />
      <WhatsAppReports />
      <CertificationSection />

      {/* ------------------------------------------------ 4. prove --------- */}

      <ProductShowcase
        heading={carouselSections.prescribedTests.heading}
        sub={carouselSections.prescribedTests.sub}
        viewMore={carouselSections.prescribedTests.viewMore}
        products={mostPrescribedTests}
        variant="test"
      />

      <VideoSection />
      <Statistics />
      <Testimonials />
      <BlogSection />

      <FAQ
        items={homeFaqs}
        heading="FAQ"
        sub="Find answers to common questions about our tests and services."
      />
    </>
  );
}
