// Homepage section content, in the reference site's rendered order.
// Section 1-2 (header) and 19-20 (footer) live in site.js.

/*
 * NOT RENDERED — kept for reference only.
 *
 * The reference page contains a text + CTA carousel above the hero images, but
 * its container (Elementor id ab3e523) carries elementor-hidden-desktop,
 * -tablet AND -mobile, so it is display:none at every width and never reaches a
 * visitor. Recreating it would put a second carousel on the page that the real
 * site does not show, so Hero.jsx renders only the image carousel below.
 */
export const hiddenHeroSlides = [1, 2, 3].map((n) => ({
  eyebrow: 'Patient-Centric Care',
  headingLine1: 'Expert Care,',
  headingLine2: `Right at Your Door ${n}`,
  text: 'Accurate, certified diagnostics you don’t need to doubt. Book your tests in minutes without any friction. Get clear updates at every stage of the process.',
  cta: 'Book Now',
  to: '#',
}));

/*
 * 1. The hero: a full-width image carousel — the first thing a visitor sees.
 *
 * The reference site renders two separate Elementor image carousels here and
 * swaps them by breakpoint: the wide pair carries `elementor-hidden-mobile`,
 * the tall pair `elementor-hidden-desktop elementor-hidden-tablet`.
 * Both are 1-slide-at-a-time, arrows, autoplay every 5000ms, infinite.
 */
export const hero = {
  autoplayMs: 5000,
  // 1975×700 — shown from the tablet breakpoint up.
  desktop: [
    { src: '/assets/001.webp', alt: '001' },
    { src: '/assets/002.webp', alt: '002' },
  ],
  // 1080×1350 — shown on mobile only.
  mobile: [
    { src: '/assets/001-1.webp', alt: '001 (1)' },
    { src: '/assets/002-1.webp', alt: '002 (1)' },
  ],
};

/*
 * 2. Sticky scrolling trust bar (the reference's `.custom-trust-marquee` HTML
 * widget). Teal #2B7E83, 40px tall, items separated by #EF8A06 stars, track
 * scrolls -50% over 35s linear infinite and pauses on hover.
 */
export const trustMarquee = {
  items: [
    '15,000+ patients served',
    'NABL Certified',
    "25 year's of excellence",
    'Reports in 24 hrs',
  ],
};

// 3. Three quick actions under the trust bar.
export const quickActions = [
  {
    key: 'whatsapp',
    title: 'Book on WhatsApp',
    text: 'Instant test confirmation',
    href: 'http://wa.me/919445518822',
    external: true,
  },
  {
    key: 'call',
    title: 'Book via Call',
    text: 'Talk to our health experts',
    href: 'tel:9445518822',
    external: true,
  },
  {
    key: 'prescription',
    title: 'Upload Prescription',
    text: 'Quick test selection',
    href: '/upload-prescription/',
    external: false,
  },
];

// 6. Home Collection — four steps.
export const homeCollection = {
  heading: 'Home Collection',
  sub: 'Delivering utmost value in the most cost-effective way',
  steps: [
    { icon: '/assets/image-27.svg', title: 'Select the test available for home collection' },
    { icon: '/assets/image-28.svg', title: 'Select your preferred date and time slot' },
    { icon: '/assets/image-29.svg', title: 'Our trained Phlebotomist will collect the sample' },
    // "WhastApp" misspelling preserved from the reference site.
    { icon: '/assets/image-30.svg', title: 'Receive your test reports by WhastApp' },
  ],
};

// 7 / 11 / 9. Carousel section headers.
export const carouselSections = {
  frequentTests: {
    heading: 'Frequently Booked Tests',
    sub: 'Most booked tests by our regular patients',
    viewMore: '/tests/',
  },
  frequentPackages: {
    heading: 'Frequently Booked Packages',
    sub: 'Most booked packages by our regular patients',
    viewMore: '#',
  },
  prescribedTests: {
    heading: 'Most Prescribed Tests',
    // "docters" misspelling preserved from the reference site.
    sub: 'Most prescribed tests by docters',
    viewMore: '/tests/',
  },
};

// 8. Choose Test by Organ.
export const organSection = {
  heading: 'Choose Test by Organ',
  sub: 'Find tests related to specific organs',
  viewMore: '/tests/',
};

// 10. Certified Quality Assurance.
export const certification = {
  heading: 'Certified Quality Assurance',
  sub: 'Quality standards and trusted diagnostic expertise support every result.',
  badges: [
    {
      icon: '/assets/nab-m.svg',
      // Stray apostrophe preserved from the reference site.
      title: "NABL Accredited, Nationally certified for diagnostic accuracy'",
    },
    {
      icon: '/assets/iso.svg',
      title: 'ISO 9001:2008, International quality management standard.',
    },
  ],
  image:
    '/assets/healthcare-professionals-stand-together-showcasing-teamwork-and-dedication-in-clinical-setting-their-diverse-backgrounds-and-attire-reflect-commitment-to-patient-care-and-collaboration-free-photo.webp',
  imageHeading: '⚕️ Trusted by 200+ doctors in Dharmapuri & Krishnagiri districts.',
  body: 'We believe that a laboratory report is more than just numbers on a page—it is the roadmap to your recovery and long-term wellness. By combining state-of-the-art technology with a deep understanding of local health needs, we have earned the professional confidence of the medical fraternity in our region. Our partnership with over 200 local doctors ensures that your testing process is seamless, your results are medically sound, and your path to better health is guided by data you can trust.',
};

/*
 * NOT RENDERED — kept for reference only.
 *
 * Like the text hero, the "Recommended / Health Checkups" container (Elementor
 * id 45c6045) carries elementor-hidden-desktop, -tablet AND -mobile, so it is
 * display:none at every width on the reference site. See AUDIT.md.
 */
export const hiddenHealthCheckups = {
  eyebrow: 'Recommended',
  heading: 'Health Checkups',
  sub: 'Personalized wellness plans tailored to your age and life stage. Start your journey to better health today.',
  banners: [
    { image: '/assets/section.group_.webp', to: '/packages/' },
    { image: '/assets/section.group-1.webp', to: '/packages/' },
  ],
  cta: { label: 'View All Packages', to: '/packages/' },
};

// 13. WhatsApp Reports.
export const whatsappReports = {
  heading: 'Get Your Reports Instantly on WhatsApp',
  text: 'No more waiting! Receive your digital, NABL-certified diagnostic reports directly in your WhatsApp chat within minutes of generation. Secure, fast, and accessible anywhere.',
  cta: 'Share Reports on WhatsApp',
  image: '/assets/Arova-Whatsap-report-image.svg',
  counters: [
    { value: 1800, suffix: '+', label: 'Reports Delivered' },
    { value: 30, suffix: '+', label: 'Years of Diagnostic Excellence' },
    { value: 10, suffix: '+', label: 'Labs across Tamil Nadu' },
  ],
};

// 14. Why Choose Arova labs? — lowercase "labs" preserved from the reference site.
export const whyChoose = {
  heading: 'Why Choose Arova labs?',
  sub: 'Reliable diagnostics, experienced teams and convenient collection, centered on your care.',
  counters: [
    { value: 25000, suffix: 'Mn', label: 'High-quality diagnostic tests every year' },
    { value: 1000, suffix: '+', label: 'Technicians' },
    { value: 99, suffix: '%', label: 'Patient Satisfaction' },
    { value: 10, suffix: '+', label: 'Total No. of Labs' },
    { value: 15, suffix: '+', label: 'Pickup Points' },
  ],
  awardCounters: [
    { value: 30, suffix: '+', label: 'Years of excellence' },
    { value: 100, suffix: '+', label: 'Tests available' },
    { value: 50, suffix: '+', label: 'Packages available' },
    { value: 1000, suffix: '+', label: 'Technicians working' },
  ],
  awardsLabel: ['Awards', 'Won'],
};

// 15. See Arova in Action — all five cards share one image, duration and description
// on the reference site, and "Expert Consultations" repeats three times.
export const videoSection = {
  heading: 'See Arova in Action',
  sub: 'A closer look at our people, diagnostic technology and laboratory processes.',
  cta: { label: 'Explore more content', to: '#' },
  videos: [
    'Advanced Diagnostic Systems',
    'Clinical Lab Protocols',
    'Expert Consultations',
    'Expert Consultations',
    'Expert Consultations',
  ].map((title) => ({
    title,
    duration: '12:45',
    text: 'Learn about our latest technology in molecular diagnostics and automated lab workflows.',
    image: '/assets/div-2.webp',
    cta: 'Watch Video',
    to: '#',
  })),
};

// 18. FAQ — on the reference site all six questions share one placeholder answer.
const placeholderAnswer =
  '“The home collection service was incredibly professional and punctual. The results were delivered to my email faster than expected!”';

export const homeFaqs = [
  'What are the lab timings and center addresses?',
  'Do you offer test packages?',
  'Is the lab NABL accredited?',
  "Is a Doctor's prescription compulsory for a blood test?",
  'What are the various payment options?',
  'Do you conduct Histopathology tests?',
].map((q) => ({ q, a: placeholderAnswer }));

export const blogSection = {
  heading: 'Latest Health Blogs',
  sub: 'Practical health insights and updates from the Arova Labs journal.',
};
