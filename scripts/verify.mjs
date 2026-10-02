/*
 * Phase 1 quality check (AUDIT.md §"QUALITY CHECK").
 *
 * For every recreated route, at the four breakpoints named in the brief, this:
 *   - collects console errors and failed network requests,
 *   - asserts there is no horizontal page overflow,
 *   - reports any <img> that failed to load,
 *   - checks an expected string actually rendered.
 *
 * Run with the dev server up:  node scripts/verify.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

// [route, a string that must appear once the route has rendered]
const ROUTES = [
  ['/', 'Frequently Booked Tests'],
  ['/tests/', 'Find Your Lab Tests Instantly'],
  ['/packages/', 'Find Your Health Packages Instantly'],
  ['/about-us/', 'Pioneering the Future of Diagnostics'],
  ['/contact-us/', 'Get in Touch'],
  ['/shop/', 'Showing all 10 results'],
  ['/cart/', 'Your cart is currently empty.'],
  ['/checkout/', 'Your cart is currently empty.'],
  ['/my-account/', 'My account'],
  ['/upload-prescription/', 'How to authenticate your prescription'],
  ['/booking-confirmation/', 'Booking Successful!'],
  ['/welcome-page/', 'Welcome to Arova Labs'],
  ['/patient-login/', 'Patient Login'],
  ['/doctor-login/', 'Doctor Login'],
  ['/privacy-policy/', 'Privacy Policy'],
  ['/terms-of-service/', 'Terms of Service'],
  ['/sample-page/', 'Sample Page'],

  // Products
  ['/product/postprandial-blood-glucose/', 'Postprandial Blood Glucose'],
  ['/product/fasting-blood-glucose/', 'Fasting Blood Glucose'],
  ['/product/complete-blood-count-cbc-copy-copy/', 'Urea'],
  ['/product/complete-blood-count-cbc-test/', 'LFT (Liver Function Test)'],
  ['/product/nalam-b/', 'Nalam-B'],
  ['/product/nalam-a-2/', 'Nalam-A'],
  ['/product/women-wellness-essential/', 'Women Wellness Essential'],
  ['/product/women-wellness-essential-copy/', 'Women Wellness Essential (Copy)'],
  ['/product/women-wellness-essential-copy-copy/', 'Women Wellness Essential (Copy) (Copy)'],
  ['/product/women-wellness-essential-copy-copy-2/', 'Women Wellness Essential (Copy) (Copy)'],

  // Product categories
  ['/product-category/tests/', 'Tests'],
  ['/product-category/packages/', 'Packages'],
  ['/product-category/tests/diabetes-tests/', 'Diabetes'],
  ['/product-category/tests/liver-profile/', 'Liver Profile'],
  ['/product-category/packages/fitness/', 'Fitness'],
  ['/product-category/packages/heart-health/', 'Heart Health'],
  ['/product-category/packages/kids-health/', 'Kids Health'],
  ['/product-category/tests/thyroid/', 'Thyroid'],
  ['/product-category/tests/vitamins/', 'Vitamins'],
  ['/product-category/tests/yy-gland/', 'YY Gland'],
  ['/product-category/tests/heart-health-tests/', 'Heart Health'],
  ['/product-category/packages/women-health/', 'Women Health'],
  ['/product-category/packages/senior-citizen/', 'Senior Citizen'],
  ['/product-category/packages/diabetes/', 'Diabetes'],

  // Product tags (organ tiles)
  ['/product-tag/bone/', 'Bone'],
  ['/product-tag/gall-bladder/', 'Gall Bladder'],
  ['/product-tag/heart/', 'Heart'],
  ['/product-tag/kidney/', 'Kidney'],
  ['/product-tag/lungs/', 'Lungs'],
  ['/product-tag/thyroid/', 'Thyroid'],

  // Blog
  ['/category/nutrition/', 'Category: Nutrition'],
  ['/category/health-tips/', 'Category: Health Tips'],
  ['/category/cardiology/', 'Category: Cardiology'],
  ['/category/wellness/', 'Category: Wellness'],
  [
    '/why-waiting-for-symptoms-is-a-risky-strategy-the-power-of-preventive-health-checkups/',
    'Why Waiting for Symptoms Is a Risky Strategy',
  ],
  [
    '/understanding-your-blood-test-results-why-accuracy-and-quality-matter/',
    'Understanding Your Blood Test Results',
  ],
  [
    '/beyond-basic-blood-work-the-critical-role-of-histopathology-and-specialized-diagnostics/',
    'Beyond Basic Blood Work',
  ],
];

const problems = [];
const brokenImages = new Set();

const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });

  for (const [route, expected] of ROUTES) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
    page.on('requestfailed', (req) => failedRequests.push(req.url()));
    page.on('response', (res) => {
      if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
    });

    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });

      // Scroll the full page so lazy images and IntersectionObserver counters fire.
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(250);

      const result = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        text: document.body.innerText,
        badImages: [...document.images]
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.getAttribute('src')),
      }));

      if (result.scrollWidth > result.innerWidth + 1) {
        problems.push(
          `[overflow] ${viewport.name} ${route} — scrollWidth ${result.scrollWidth} > ${result.innerWidth}`,
        );
      }

      if (!result.text.includes(expected)) {
        problems.push(`[content] ${viewport.name} ${route} — missing “${expected}”`);
      }

      result.badImages.forEach((src) => brokenImages.add(`${route} -> ${src}`));

      consoleErrors.forEach((e) =>
        problems.push(`[console] ${viewport.name} ${route} — ${e.slice(0, 160)}`),
      );
      failedRequests.forEach((u) =>
        problems.push(`[request] ${viewport.name} ${route} — ${u.slice(0, 160)}`),
      );
    } catch (err) {
      problems.push(`[load] ${viewport.name} ${route} — ${err.message.split('\n')[0]}`);
    }

    await page.close();
  }

  await context.close();
  console.log(`checked ${ROUTES.length} routes @ ${viewport.name} (${viewport.width}px)`);
}

await browser.close();

console.log('\n===== RESULTS =====');
console.log(`routes: ${ROUTES.length} × viewports: ${VIEWPORTS.length}`);

if (brokenImages.size) {
  console.log(`\nBROKEN IMAGES (${brokenImages.size}):`);
  [...brokenImages].forEach((b) => console.log('  ' + b));
}

if (problems.length === 0) {
  console.log('\nNo problems found.');
} else {
  // Collapse identical problems seen at several viewports.
  const unique = [...new Set(problems.map((p) => p.replace(/^\[(\w+)\] \w+ /, '[$1] ')))];
  console.log(`\nPROBLEMS (${problems.length} total, ${unique.length} unique):`);
  unique.slice(0, 60).forEach((p) => console.log('  ' + p));
  process.exitCode = 1;
}
