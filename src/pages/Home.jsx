import Hero from '../components/Hero';
import TrustMarquee from '../components/TrustMarquee';
import QuickActions from '../components/QuickActions';
import HomeCollection from '../components/HomeCollection';
import ProductCarousel from '../components/ProductCarousel';
import SectionHeading from '../components/SectionHeading';
import OrganCategories from '../components/OrganCategories';
import CertificationSection from '../components/CertificationSection';
import WhatsAppReports from '../components/WhatsAppReports';
import Statistics from '../components/Statistics';
import VideoSection from '../components/VideoSection';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import FAQ from '../components/FAQ';
import { carouselSections, homeFaqs } from '../data/homepage';
import {
  frequentlyBookedPackages,
  frequentlyBookedTests,
  mostPrescribedTests,
} from '../data/products';

/*
 * Homepage — sections in exactly the order the reference site renders them.
 *
 * Two of the reference page's containers are display:none at every breakpoint
 * (they carry elementor-hidden-desktop + -tablet + -mobile) and so never reach
 * a visitor. They are deliberately not rendered here, and their content is kept
 * in data/homepage.js as `hiddenHeroSlides` and `hiddenHealthCheckups`:
 *   - the "Expert Care, Right at Your Door" text + CTA carousel (id ab3e523)
 *   - the "Recommended / Health Checkups" banners (id 45c6045)
 * See AUDIT.md §2 and §3.
 */
export default function Home() {
  return (
    <>
      {/* 1. Hero image carousel */}
      <Hero />

      {/* 2. Sticky trust marquee */}
      <TrustMarquee />

      {/* 3. Book on WhatsApp / Book via Call / Upload Prescription */}
      <QuickActions />

      {/* 4. Home Collection */}
      <HomeCollection />

      {/* 5. Frequently Booked Tests */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            heading={carouselSections.frequentTests.heading}
            sub={carouselSections.frequentTests.sub}
            viewMore={carouselSections.frequentTests.viewMore}
          />
          <div className="mt-8">
            <ProductCarousel products={frequentlyBookedTests} variant="test" />
          </div>
        </div>
      </section>

      {/* 6. Choose Test by Organ */}
      <OrganCategories />

      {/* 7. Frequently Booked Packages */}
      <section className="section bg-slate-50">
        <div className="shell">
          <SectionHeading
            heading={carouselSections.frequentPackages.heading}
            sub={carouselSections.frequentPackages.sub}
            viewMore={carouselSections.frequentPackages.viewMore}
          />
          <div className="mt-8">
            <ProductCarousel products={frequentlyBookedPackages} variant="package" />
          </div>
        </div>
      </section>

      {/* 8. Certified Quality Assurance */}
      <CertificationSection />

      {/* 9. Most Prescribed Tests */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            heading={carouselSections.prescribedTests.heading}
            sub={carouselSections.prescribedTests.sub}
            viewMore={carouselSections.prescribedTests.viewMore}
          />
          <div className="mt-8">
            <ProductCarousel products={mostPrescribedTests} variant="test" />
          </div>
        </div>
      </section>

      {/* 10. WhatsApp Reports */}
      <WhatsAppReports />

      {/* 11. Why Choose Arova labs? + Awards Won */}
      <Statistics />

      {/* 12. See Arova in Action */}
      <VideoSection />

      {/* 13. What Our Patients Say */}
      <Testimonials />

      {/* 14. Latest Health Blogs */}
      <BlogSection />

      {/* 15. FAQ */}
      <FAQ items={homeFaqs} heading="FAQ" />
    </>
  );
}
