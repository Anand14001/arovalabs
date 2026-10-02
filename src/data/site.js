// Global site content: branding, contact details, navigation and footer.
// Every string here is taken verbatim from the reference site's header/footer.

export const site = {
  title: 'Arova Labs',
  // Rendered next to the logo in the top bar on the reference site.
  formerly: '(Formerly Healthcare Diagnostic Services)',
  tagline:
    'Precision diagnostics for a healthier community. Leading the way in pathological excellence since 2008.',
  copyright: '© 2026 Arova Labs. All rights reserved.',
  logo: '/assets/logo.svg',
  logoWhite: '/assets/AROVA-LOGO-WHITE-COLOR.jpg-1.svg',
};

export const contact = {
  // Top-bar "Home Collection" number.
  homeCollection: { label: '+91 94422 18998', tel: '9442218998' },
  // Header call icon.
  headerTel: '9445518822',
  whatsapp: 'http://wa.me/919445518822',
  footerPhones: [
    { label: '04342-269994', tel: '04342-269994 ' },
    { label: '9442218998', tel: '9442218998' },
  ],
  footerWhatsapp: { label: '04342-269994 - 9442218998', href: 'http://wa.me/919445518822' },
  email: 'support@arovalabs.com',
  address:
    '133/1/26 A, Nethaji Bypass Road, Opp Ganesha Theatre, Dharmapuri-1, TamilNadu, India.',
};

export const mainNav = [
  { label: 'Home', to: '/' },
  { label: 'Tests', to: '/tests/' },
  { label: 'Packages', to: '/packages/' },
  { label: 'About Us', to: '/about-us/' },
  { label: 'Contact Us', to: '/contact-us/' },
];

export const footerQuickLinks = mainNav;

export const footerLegalLinks = [
  { label: 'Privacy Policy', to: '/privacy-policy/' },
  { label: 'Terms of Service', to: '/terms-of-service/' },
  { label: 'Contact Us', to: '/contact-us/' },
];

export const newsletter = {
  heading: 'Join Newsletter',
  sub: 'Get weekly health tips and lab updates.',
  placeholder: 'Email',
  button: 'Submit',
};

// Elementor popup 631 on the reference site.
export const loginPopup = {
  heading: 'Welcome to Arova Labs',
  sub: 'Please select your account type to continue',
  options: [
    {
      icon: '/assets/div.size-20.svg',
      title: 'Patient',
      text: 'Access your lab results and manage your medical records securely.',
      cta: 'Login as Patient',
      to: '/patient-login/',
    },
    {
      icon: '/assets/div.size-20-1.svg',
      title: 'Doctor / Lab',
      text: 'Review patient diagnostic reports and clinical data efficiently.',
      cta: 'Login as Doctor, Lab',
      to: '/doctor-login/',
    },
  ],
};

export const searchPlaceholder = 'Search tests, packages...';
