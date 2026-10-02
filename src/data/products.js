// All 10 WooCommerce products from the reference site, with their detail-page
// content. Titles, prices, copy and unfinished editorial placeholders
// ("new test....", "Abcd test", "scascascas", "A/G Ratiooo") are preserved verbatim
// per the Phase 1 brief. See AUDIT.md for the list of reference-site defects.

// Repeated on every product detail page on the reference site.
export const productBenefits = [
  {
    title: 'Free Home Sample Collection',
    text: 'Professional phlebotomist at your doorstep',
  },
  {
    title: 'E-Reports in 24 Hours',
    text: 'Get detailed reports on your phone & email',
  },
  {
    title: 'Free Physician Consultation',
    text: 'Expert summary of your health reports',
  },
];

export const productAssurance = [
  { title: 'NABL Accredited Laboratory', text: 'ISO 15189:2012 Certified Quality Standards' },
  { title: '50k+', text: 'Trusted Patients' },
];

export const slotsNotice = 'Only 2-3 Slots are remaining';
export const taxNotice = 'Taxes and collection fees included';

// Shown on package detail pages (Nalam-A and all Women Wellness variants).
const fullParameterGroups = [
  { name: 'Lipid Profile (8 tests)', items: 'HDL, LDL, VLDL, Triglycerides, Total Cholesterol, new test....' },
  { name: 'Liver Function Test (LFT) (12 tests)', items: 'Bilirubin, SGOT, SGPT, Alkaline Phosphatase, Albumin...' },
  { name: 'Kidney Function Test (KFT) (6 tests)', items: 'Urea, Creatinine, Uric Acid, BUN, Electrolytes...' },
  { name: 'Thyroid Profile (3 tests)', items: 'T3, T4, TSH Ultra-sensitive...' },
];

const womenWellnessPreTest = [
  {
    title: '10-12 Hours Fasting',
    text: 'Water intake is allowed, but strictly no food or other beverages before the sample collection.',
  },
  {
    icon: '/assets/medication.svg',
    title: 'Medication Usage',
    text: 'Inform the technician about any regular medications. Do not stop prescribed medicines without consulting your doctor.',
  },
  {
    icon: '/assets/water_drop.svg',
    title: 'Hydration',
    text: 'Stay well hydrated before the test to ensure easy blood collection.',
  },
  {
    icon: '/assets/no_drinks-1.svg',
    title: 'Avoid Alcohol',
    text: 'Do not consume alcohol for at least 24 hours prior to the health checkup.',
  },
];

const womenWellnessAudience = [
  'Frequent bone or muscle pain and general weakness.',
  'People with limited exposure to sunlight.',
  'Individuals with gastrointestinal disorders like Crohn’s.',
  'Elderly patients at risk of osteoporosis.',
];

const womenWellnessFaqs = [
  { q: 'What are the lab timings and center addresses?', a: 'answer 1' },
  { q: 'Do you offer test packages?', a: 'answer 2' },
  { q: 'Is the lab NABL accredited?', a: 'answer 3' },
];

const womenWellnessCard = {
  profiles: '9 Profiles, 62 Tests',
  highlights: [
    'Thyroid Profile (Total)',
    'Iron Deficiency Profile',
    'Calcium & Electrolytes',
    'ESR & Glucose Fasting',
    'Vitamin D & B12',
  ],
};

const womenWellnessDetail = {
  excerpt:
    'Our most comprehensive clinical screening covering 90+ parameters including heart, kidney, liver, and metabolic health. Designed for a detailed physiological assessment.',
  parameterGroups: fullParameterGroups,
  showAllParametersButton: true,
  preTest: womenWellnessPreTest,
  audience: womenWellnessAudience,
  faqs: womenWellnessFaqs,
};

export const products = [
  // ----------------------------------------------------------------- tests
  {
    id: 924,
    slug: 'postprandial-blood-glucose',
    title: 'Postprandial Blood Glucose',
    type: 'test',
    cats: ['diabetes-tests', 'tests'],
    tags: ['kidney'],
    breadcrumb: [
      { label: 'Tests', to: '/product-category/tests/' },
      { label: 'Diabetes', to: '/product-category/tests/diabetes-tests/' },
    ],
    badges: ['NABL Accredited'],
    ribbon: null,
    regularPrice: 50,
    salePrice: 40,
    discount: '20% OFF',
    cardImage: '/assets/Complete-Guide-to-Fasting-Glucose-Testing.webp',
    detailImage: '/assets/Complete-Guide-to-Fasting-Glucose-Testing-1024x683.webp',
    archiveImage: '/assets/Complete-Guide-to-Fasting-Glucose-Testing-300x300.webp',
    cardExcerpt: 'This test measures your blood sugar levels after..',
    excerpt:
      'This test measures your blood sugar levels after eating, typically two hours after a meal. It helps evaluate how well your body processes sugar and is especially useful for diagnosing or managing diabetes. Monitoring post-meal sugar levels gives a clear picture of how your body reacts to food, helping to prevent complications like nerve damage or heart problems.',
    overview:
      'A Glucose Post-Prandial (PP) Test measures blood sugar levels about 2 hours after eating a meal. This test evaluates how well your body processes glucose after eating, reflecting the efficiency of insulin in regulating blood sugar. It is primarily used to diagnose and monitor diabetes, prediabetes, and insulin resistance. After you eat, your blood glucose typically rises, then returns to normal within 2 hours as insulin helps cells absorb the sugar. If your blood sugar remains elevated, it may indicate impaired glucose metabolism or diabetes. The test involves taking a blood sample 2 hours after the meal and does not require fasting beforehand. It is beneficial for those who maintain normal fasting glucose but experience postprandial hyperglycemia. Booking this test with Redcliffe Labs ensures convenient sample collection by certified phlebotomists and the timely delivery of accurate reports to help you manage your health effectively.',
    // Reference site leaks a PHP warning here instead of a parameter list. See AUDIT.md.
    parameters: [],
    parametersUnavailable: true,
    preparation: [
      'Give sample 2 hours after meal / 75g glucose (as prescribed).',
      'Time starts from first bite',
      'Finish meal within 15 mins.',
    ],
    process: [
      { icon: '/assets/bloodtype.svg', text: 'If the first bite is taken at 8:00 AM' },
      { icon: '/assets/history.svg', text: 'the sample should be collected at 10:00 AM.' },
    ],
    audience: [
      "Diabetic patients are advised to record their blood sugar levels daily according to the doctor's advice.",
      'Otherwise, every individual with no diabetes history should go for Glucose Fasting Test once every 3 months.',
    ],
    faqs: [{ q: 'FAQ Question here', a: 'Answer here' }],
  },
  {
    id: 925,
    slug: 'fasting-blood-glucose',
    title: 'Fasting Blood Glucose',
    type: 'test',
    cats: ['diabetes-tests', 'tests'],
    tags: [],
    breadcrumb: [
      { label: 'Tests', to: '/product-category/tests/' },
      { label: 'Diabetes', to: '/product-category/tests/diabetes-tests/' },
    ],
    badges: ['NABL Accredited'],
    ribbon: null,
    regularPrice: 60,
    salePrice: 40,
    discount: '33% OFF',
    // No featured image set on the reference site.
    cardImage: null,
    detailImage: null,
    archiveImage: '/assets/woocommerce-placeholder-300x300.webp',
    cardExcerpt: 'Checks overall health and detects a wide range of..',
    excerpt: 'Checks overall health and detects a wide range of disorders including anemia.',
    overview:
      'This test helps evaluate how well your body manages blood sugar and is essential for diagnosing diabetes, prediabetes, and other metabolic conditions. Balanced glucose levels are crucial for providing energy to your body’s cells, while high or low levels may indicate health issues related to insulin function or pancreatic health. To ensure accurate results, avoid eating or drinking anything except water before the test. Inform the phlebotomist about any medications or health conditions you have before sample collection. Book your Glucose Fasting Test from the comfort of your home with Redcliffe Labs. Our certified phlebotomists will collect your sample conveniently, and you’ll receive clear, timely reports to help you manage your health effectively.',
    parameters: ['Glucose Fasting'],
    preparation: [
      'Fasting: 10-12 hours',
      'Avoid alcohol for 24 hrs before sample collection.',
      'Inform sample collector about medicines/supplements',
    ],
    process: [
      {
        icon: '/assets/bloodtype.svg',
        text: 'Inform sample collector about medicines/supplements',
      },
      {
        icon: '/assets/history.svg',
        text: 'Diabetes medicines are usually taken after sample collection (unless advised otherwise).',
      },
    ],
    audience: [
      'Diabetic patients are advised to record their blood sugar levels',
      'Elderly patients at risk of Sugar Level',
    ],
    faqs: [
      {
        q: 'What is Glucose Fasting Test?',
        a: 'A fasting blood sugar test is a test used to measure glucose in your blood when its level is at its lowest, which mostly happens in the morning before eating or drinking anything',
      },
    ],
  },
  {
    id: 928,
    slug: 'complete-blood-count-cbc-copy-copy',
    title: 'Urea',
    type: 'test',
    cats: ['tests'],
    tags: ['kidney'],
    breadcrumb: [{ label: 'Tests', to: '/product-category/tests/' }],
    badges: ['NABL Accredited'],
    ribbon: 'Most Trusted',
    regularPrice: 50,
    salePrice: 45,
    discount: '10% OFF',
    cardImage: '/assets/ChatGPT-Image-Apr-14-2026-10_34_50-PM.webp',
    detailImage: '/assets/ChatGPT-Image-Apr-14-2026-10_34_50-PM-1024x683.webp',
    archiveImage: '/assets/ChatGPT-Image-Apr-14-2026-10_34_50-PM-300x300.webp',
    cardExcerpt: 'A blood urea test is performed to measure..',
    excerpt:
      'A blood urea test is performed to measure the concentration of urea in the blood so that the essential steps can be taken at the right time to restrain major health issues.',
    overview:
      'The Blood Urea Test measures the concentration of urea, a waste product formed during protein metabolism, in the blood. Urea is normally excreted by the kidneys, so elevated blood urea nitrogen (BUN) indicates impaired kidney function, dehydration, or increased protein breakdown. It aids in diagnosing and monitoring kidney diseases, urinary tract obstructions, and assessing overall renal health. Low urea levels may be seen in liver disease or malnutrition. The blood test is often part of routine metabolic panels and is essential for planning treatments or dialysis in chronic kidney disease patients. Monitoring blood urea helps prevent complications associated with kidney dysfunction and guides fluid and dietary management.',
    // Reference site leaks a PHP warning here instead of a parameter list. See AUDIT.md.
    parameters: [],
    parametersUnavailable: true,
    preparation: ['No special preparation'],
    process: [
      { icon: '/assets/bloodtype.svg', text: 'Sample Type:' },
      { icon: '/assets/history.svg', text: 'Report Delivery: Next Day' },
    ],
    // Heading renders on the reference site with no items beneath it.
    audience: [],
    faqs: [
      {
        q: 'What is a blood urea test?',
        a: 'Urea is a nitrogenous waste product of the body’s metabolic process and comes into action when the protein breaks down. The majority of the time, it is used as a screening test to assess kidney function. However, along with serum creatinine, urea levels assist in diagnosing prerenal, renal, and postrenal hyperuricemia.',
      },
    ],
  },
  {
    id: 105,
    slug: 'complete-blood-count-cbc-test',
    title: 'LFT (Liver Function Test)',
    type: 'test',
    cats: ['liver-profile', 'tests'],
    tags: ['kidney'],
    breadcrumb: [
      { label: 'Tests', to: '/product-category/tests/' },
      { label: 'Liver Profile', to: '/product-category/tests/liver-profile/' },
    ],
    badges: ['NABL Accredited'],
    ribbon: 'Most Popular',
    regularPrice: 60,
    salePrice: 50,
    discount: '17% OFF',
    cardImage: '/assets/Anatomical-illustration-of-the-human-liver.webp',
    detailImage: '/assets/Anatomical-illustration-of-the-human-liver-1024x683.webp',
    archiveImage: '/assets/Anatomical-illustration-of-the-human-liver-300x300.webp',
    cardExcerpt: 'Assesses liver health by measuring liver enzymes and..',
    excerpt: 'Assesses liver health by measuring liver enzymes and proteins.',
    overview:
      'Bilirubin Total, Bilirubin Direct, Bilirubin Indirect, SGOT(AST), SGPT(ALT), Alkaline Phosphatase, Total Protein, Albumin, Globulin, A/G Ratiooo',
    parameters: [
      'Bilirubin Total',
      'Bilirubin Direct',
      'Bilirubin Indirect',
      'SGOT(AST)',
      'SGPT(ALT)',
      'Alkaline Phosphatase',
      'Total Protein',
      'Albumin',
      'Globulin',
      'A/G Ratio',
      'ABC Para',
    ],
    preparation: ['No special fasting required', 'No alcohol consumption 24h priorrr'],
    process: [
      { icon: '/assets/bloodtype.svg', text: 'Sample Type: Blood (Serum)' },
      { icon: '/assets/history.svg', text: 'Report Delivery: Next Day' },
    ],
    audience: [
      'People with liver disease symptoms, alcohol use, medication monitoring, routine health screening.',
      'People 2 with liver disease symptoms, alcohol use, medication monitoring, routine health screening.',
      'People 3 with liver disease symptoms, alcohol use, medication monitoring, routine health screening.',
    ],
    faqs: [
      { q: 'Is fasting required?', a: 'Usually not mandatory' },
      { q: 'What symptoms suggest LFT?', a: 'Jaundice, fatigue, abdominal pain.' },
    ],
  },

  // -------------------------------------------------------------- packages
  {
    id: 1676,
    slug: 'nalam-b',
    title: 'Nalam-B',
    type: 'package',
    cats: ['fitness', 'packages'],
    tags: [],
    breadcrumb: [
      { label: 'Packages', to: '/product-category/packages/' },
      { label: 'Fitness', to: '/product-category/packages/fitness/' },
    ],
    badges: ['Most Recommended', 'NABL Accredited'],
    ribbon: null,
    regularPrice: 199,
    salePrice: 99,
    discount: '50% OFF',
    cardImage:
      '/assets/imgi_221_happy-family-mother-father-children-home-couch-198929396.webp',
    detailImage:
      '/assets/imgi_221_happy-family-mother-father-children-home-couch-198929396.webp',
    archiveImage:
      '/assets/imgi_221_happy-family-mother-father-children-home-couch-198929396-300x300.webp',
    profiles: '9 Profiles, 60 Tests',
    highlights: ['Calcium & Electrolytes', 'cholesterol', 'ESR', 'Abcd test'],
    excerpt:
      'A health check that covers 60 essential test parameters, including glucose-fasting, liver, kidney, thyroid, cholesterol, blood health, ESR, and urine tests.',
    excerptSecondary:
      'Ideal for those who want to track lifestyle-linked health risks and detect common issues early.',
    parameterGroups: [fullParameterGroups[0]],
    showAllParametersButton: false,
    // The reference site lists two contradictory fasting rows here.
    preTest: [
      { title: 'Fasting: 10-12 hours', text: 'Water is not allowed while fasting.' },
      { title: 'Fasting: 10-12 hours', text: 'Water is allowed while fasting.' },
    ],
    audience: ['scascascas'],
    faqs: [{ q: 'faq 1', a: 'answer' }],
  },
  {
    id: 922,
    slug: 'nalam-a-2',
    title: 'Nalam-A',
    type: 'package',
    cats: ['heart-health', 'kids-health', 'packages'],
    tags: [],
    breadcrumb: [
      { label: 'Packages', to: '/product-category/packages/' },
      { label: 'Heart Health', to: '/product-category/packages/heart-health/' },
    ],
    badges: ['Most Recommended', 'NABL Accredited'],
    ribbon: null,
    regularPrice: 1599,
    salePrice: 999,
    discount: '38% OFF',
    cardImage: '/assets/mhc-3-image-1024x1024.webp',
    detailImage: '/assets/mhc-3-image-1024x1024.webp',
    archiveImage: '/assets/mhc-3-image-300x300.webp',
    profiles: '9 Profiles, 60 Tests',
    highlights: ['glucose-fasting', 'liver', 'kidney', 'thyroid', 'cholesterol'],
    excerpt:
      'A health check that covers 60 essential test parameters, including glucose-fasting, liver, kidney, thyroid, cholesterol, blood health, ESR, and urine tests.',
    excerptSecondary:
      'Ideal for those who want to track lifestyle-linked health risks and detect common issues early.',
    parameterGroups: fullParameterGroups,
    showAllParametersButton: true,
    preTest: [
      { title: 'Fasting: 10-12 hours', text: 'Water is allowed while fasting.' },
      {
        icon: '/assets/no_drinks-1.svg',
        title: 'Avoid alcohol',
        text: 'Do not consume alcohol for at least 24 hours prior to the health checkup.',
      },
      {
        icon: '/assets/medication.svg',
        title: 'Medication Usage',
        text: 'Inform sample collector about medicines/supplements.',
      },
      {
        icon: '/assets/water_drop.svg',
        title: 'Hydration',
        text: 'Stay well hydrated before the test to ensure easy blood collection.',
      },
    ],
    audience: [
      'It is a preventive health test that examines different organs to diagnose different health conditions and minimize all possible complications in their initial stage possible.',
      'Individuals with ----.',
    ],
    faqs: [
      {
        q: 'What Is A Full Body Checkup?',
        a: 'It is a preventive health test that examines different organs to diagnose different health conditions and minimize all possible complications in their initial stage possible.',
      },
      {
        q: 'Is A Full Body Checkup Necessary These Days?',
        a: 'Yes, it is. Nowadays, our lifestyle is not as healthy as it is supposed to be, which impacts health and calls for periodic health checkups that help track your condition and decline complications.',
      },
    ],
  },
  {
    id: 169,
    slug: 'women-wellness-essential',
    title: 'Women Wellness Essential',
    type: 'package',
    cats: ['fitness', 'packages'],
    tags: ['bone'],
    breadcrumb: [
      { label: 'Packages', to: '/product-category/packages/' },
      { label: 'Fitness', to: '/product-category/packages/fitness/' },
    ],
    badges: ['Most Recommended', 'NABL Accredited'],
    ribbon: 'Highly Recommended',
    regularPrice: 1599,
    salePrice: 999,
    discount: '38% OFF',
    cardImage: '/assets/div.webp',
    detailImage: '/assets/div.webp',
    archiveImage: '/assets/div-300x197.webp',
    ...womenWellnessCard,
    ...womenWellnessDetail,
  },
  {
    id: 923,
    slug: 'women-wellness-essential-copy',
    title: 'Women Wellness Essential (Copy)',
    type: 'package',
    cats: ['fitness', 'packages'],
    tags: ['bone'],
    breadcrumb: [
      { label: 'Packages', to: '/product-category/packages/' },
      { label: 'Fitness', to: '/product-category/packages/fitness/' },
    ],
    badges: ['Most Recommended', 'NABL Accredited'],
    ribbon: null,
    regularPrice: 1599,
    salePrice: 999,
    discount: '38% OFF',
    // No featured image set on the reference site.
    cardImage: null,
    detailImage: null,
    archiveImage: '/assets/woocommerce-placeholder-300x300.webp',
    ...womenWellnessCard,
    ...womenWellnessDetail,
  },
  {
    id: 927,
    slug: 'women-wellness-essential-copy-copy',
    title: 'Women Wellness Essential (Copy) (Copy)',
    type: 'package',
    cats: ['fitness', 'packages'],
    tags: ['bone'],
    breadcrumb: [
      { label: 'Packages', to: '/product-category/packages/' },
      { label: 'Fitness', to: '/product-category/packages/fitness/' },
    ],
    badges: ['Most Recommended', 'NABL Accredited'],
    ribbon: null,
    regularPrice: 1599,
    salePrice: 999,
    discount: '38% OFF',
    cardImage: '/assets/womens-well-ness-image-1024x683.webp',
    detailImage: '/assets/womens-well-ness-image-1024x683.webp',
    archiveImage: '/assets/womens-well-ness-image-300x300.webp',
    ...womenWellnessCard,
    ...womenWellnessDetail,
  },
  {
    id: 926,
    slug: 'women-wellness-essential-copy-copy-2',
    title: 'Women Wellness Essential (Copy) (Copy)',
    type: 'package',
    cats: ['fitness', 'packages'],
    tags: ['bone'],
    breadcrumb: [
      { label: 'Packages', to: '/product-category/packages/' },
      { label: 'Fitness', to: '/product-category/packages/fitness/' },
    ],
    badges: ['Most Recommended', 'NABL Accredited'],
    ribbon: null,
    regularPrice: 1599,
    salePrice: 999,
    discount: '38% OFF',
    cardImage: '/assets/div.webp',
    detailImage: '/assets/div.webp',
    archiveImage: '/assets/div-300x197.webp',
    ...womenWellnessCard,
    ...womenWellnessDetail,
  },
];

export const getProductBySlug = (slug) => products.find((p) => p.slug === slug);
export const getProductById = (id) => products.find((p) => p.id === Number(id));

export const tests = products.filter((p) => p.type === 'test');
export const packages = products.filter((p) => p.type === 'package');

export const getProductsByCategory = (slug) =>
  products.filter((p) => p.cats.includes(slug));

export const getProductsByTag = (slug) => products.filter((p) => p.tags.includes(slug));

// Homepage carousel line-ups, in the reference site's order.
export const frequentlyBookedTests = [924, 928, 925, 105].map(getProductById);
export const mostPrescribedTests = [924, 928, 925, 105].map(getProductById);
export const frequentlyBookedPackages = [1676, 923, 922, 927, 926, 169].map(getProductById);

// "Similar Tests You Might Need" on a detail page.
export const getSimilarProducts = (product) =>
  product.type === 'package' ? frequentlyBookedPackages : frequentlyBookedTests;

export const formatPrice = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
