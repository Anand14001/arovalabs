// Content for the remaining standalone pages, verbatim from the reference site.

// ------------------------------------------------------------- /contact-us/
export const contactPage = {
  heading: 'Get in Touch',
  sub: 'Have a question about a test or your results? Reach out to our team. We’re here to help you navigate your health journey.',
  cards: [
    {
      icon: '/assets/div-6.svg',
      title: 'Phone Support',
      meta: 'Mon-Fri, 9am – 6pm EST',
      value: '9442218998 - 04342-269994',
    },
    {
      icon: '/assets/div-7.svg',
      title: 'Email Us',
      meta: 'Typical response within 2 hours',
      value: 'support@arovalabs.com',
    },
    {
      icon: '/assets/div-8.svg',
      title: 'Visit Us',
      meta: 'Main Laboratory',
      value: '133/1/26 A, Nethaji Bypass Road, Opp Ganesha Theatre.',
    },
  ],
  formImage: '/assets/div-12.webp',
  form: {
    heading: 'Send a Message',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', required: false },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'jane@example.com',
        required: true,
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        placeholder: 'How can we help you today?',
        required: false,
      },
    ],
    button: 'Send Message',
    disclaimer: 'By clicking send, you agree to our Privacy Policy.',
  },
  // The reference site's embed points at the London Eye, not the Dharmapuri lab.
  mapEmbed:
    'https://maps.google.com/maps?q=London%20Eye%2C%20London%2C%20United%20Kingdom&t=m&z=10&output=embed&iwloc=near',
};

// -------------------------------------------------- /upload-prescription/
export const uploadPrescriptionPage = {
  heading: 'How to authenticate your prescription',
  tips: [
    "Don't crop out any part of the image Avoid blurred image.",
    'Include details of doctor and patient visit date.',
  ],
  formHeading: 'Upload Prescription',
  fields: [
    { name: 'file', label: 'Choose from Gallery', type: 'file', required: true },
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your Full Name',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'number',
      placeholder: 'Enter your Phone Number',
      required: false,
    },
  ],
  button: 'Upload',
};

// ------------------------------------------------------- /welcome-page/
// Same chooser as the header's login popup, but its CTAs link to "#" here.
export const welcomePage = {
  heading: 'Welcome to Arova Labs',
  sub: 'Please select your account type to continue',
  options: [
    {
      icon: '/assets/div.size-20.svg',
      title: 'Patient',
      text: 'Access your lab results and manage your medical records securely.',
      cta: 'Login as Patient',
      to: '#',
    },
    {
      icon: '/assets/div.size-20-1.svg',
      title: 'Doctor',
      text: 'Review patient diagnostic reports and clinical data efficiently.',
      cta: 'Login as Doctor',
      to: '#',
    },
  ],
};

// ------------------------------------------------ /booking-confirmation/
export const bookingConfirmationPage = {
  icon: '/assets/div-9.svg',
  heading: 'Booking Successful!',
  text: 'Thank you, Your appointment request has been received. Please keep your phone nearby.',
  nextHeading: 'What happens next?',
  maskedPhone: '+91 (*****-**88',
  // Rendered literally on the reference site — no real order data exists.
  orderSummaryNote: '[Dynamic Order Summary will render here after a real checkout]',
  cta: { label: 'Back to Home', to: '#' },
  securityNote: 'Your medical data is encrypted and secure.',
};

// --------------------------------------------- /tests/ and /packages/
export const listingPages = {
  tests: {
    heading: 'Find Your Lab Tests Instantly',
    sub: 'Skip the lines. Search for any test, book a slot, and get your sample collected from home. Accurate results delivered fast.',
    searchPlaceholder: "Search for tests like 'Vitamin D', 'HbA1c', 'Full Body'...",
    searchButton: 'Search',
    filters: ['Tests', 'All'],
    type: 'test',
  },
  packages: {
    heading: 'Find Your Health Packages Instantly',
    sub: 'Skip the lines. Search for any test, book a slot, and get your sample collected from home. Accurate results delivered fast.',
    searchPlaceholder: "Search for tests like 'Vitamin D', 'HbA1c', 'Full Body'...",
    searchButton: 'Search',
    filters: ['Packages', 'All'],
    type: 'package',
  },
};

// ------------------------------------------------------- /my-account/
export const myAccountPage = {
  title: 'My account',
  login: {
    heading: 'Login',
    button: 'Log in',
    lostPassword: 'Lost your password?',
    rememberLabel: 'Remember me',
  },
  register: {
    heading: 'Register',
    button: 'Register',
    privacyNotice: {
      before: 'Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our ',
      linkLabel: 'privacy policy',
      after: '.',
    },
  },
};

// ------------------------------------------------- /cart/ and /checkout/
export const emptyCart = {
  message: 'Your cart is currently empty.',
  returnLabel: 'Return to shop',
  returnTo: '/tests/',
};

// ------------------------------------------------------ /sample-page/
export const samplePage = {
  title: 'Sample Page',
  paragraphs: [
    'This is an example page. It’s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:',
    'Hi there! I’m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin’ caught in the rain.)',
    '…or something like this:',
    'The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.',
  ],
  closing: {
    before: 'As a new WordPress user, you should go to ',
    linkLabel: 'your dashboard',
    after: ' to delete this page and create new pages for your content. Have fun!',
  },
};

// Stub pages — these render only a title on the reference site.
export const stubPages = {
  'patient-login': 'Patient Login',
  'doctor-login': 'Doctor Login',
};
