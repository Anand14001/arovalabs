/*
 * Phase 1 interaction check (AUDIT.md §"QUALITY CHECK" step 5).
 * Exercises every interactive element the reference site has.
 *
 * Run with the dev server up:  node scripts/verify-interactions.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const results = [];

const check = (name, pass, detail = '') =>
  results.push({ name, pass, detail });

const browser = await chromium.launch();

// ---------------------------------------------------------------- desktop
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  // Start from an empty cart so the assertions below are deterministic.
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // --- Hero image carousel (one visible track per breakpoint)
  const heroTracks = await page.evaluate(
    () =>
      [...document.querySelectorAll('section[aria-label="Highlights"] > div')].filter((el) => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && b.height > 0;
      }).length,
  );
  check('Exactly one hero carousel is visible', heroTracks === 1, `visible tracks: ${heroTracks}`);

  check(
    'Hidden reference sections are not rendered',
    !(await page.locator('main').innerText()).includes('Right at Your Door'),
  );

  const heroOffset = () =>
    page.evaluate(() => {
      const t = [...document.querySelectorAll('section[aria-label="Highlights"] .flex')].find(
        (el) => el.getBoundingClientRect().width > 0,
      );
      return t ? t.style.transform : 'none';
    });

  const beforeSlide = await heroOffset();
  await page.locator('button[aria-label="Next slide"]:visible').first().click();
  await page.waitForTimeout(700);
  const afterSlide = await heroOffset();
  check('Hero carousel advances', beforeSlide !== afterSlide, `${beforeSlide} -> ${afterSlide}`);

  await page.locator('button[aria-label="Go to slide 1"]:visible').first().click();
  await page.waitForTimeout(700);
  // The browser normalises translateX(-0%) to translateX(0%).
  const backToFirst = await heroOffset();
  check('Hero dot navigation', /translateX\(-?0%\)/.test(backToFirst), backToFirst);

  const heroImgs = await page.evaluate(() =>
    [...document.querySelectorAll('section[aria-label="Highlights"] img')]
      .filter((i) => i.getBoundingClientRect().width > 0)
      .map((i) => `${i.getAttribute('src')}:${i.naturalWidth > 0}`),
  );
  check(
    'Hero images load',
    heroImgs.length > 0 && heroImgs.every((s) => s.endsWith(':true')),
    heroImgs.join(' '),
  );

  // --- Sticky trust marquee
  const marquee = await page.evaluate(() => {
    const m = document.querySelector('.custom-trust-marquee');
    if (!m) return null;
    const cs = getComputedStyle(m);
    return { bg: cs.backgroundColor, position: cs.position, h: Math.round(m.getBoundingClientRect().height) };
  });
  check(
    'Trust marquee renders sticky and teal',
    marquee && marquee.bg === 'rgb(43, 126, 131)' && marquee.position === 'sticky' && marquee.h === 40,
    JSON.stringify(marquee),
  );

  // --- Floating cart is hidden while the cart is empty
  check(
    'Floating cart hidden when cart is empty',
    (await page.locator('a:has-text("Proceed")').count()) === 0,
  );

  // --- Counters animate to their target values
  await page.getByRole('heading', { name: /Why Choose Arova labs\?/ }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  const counterText = await page.locator('dl').filter({ hasText: 'Patient Satisfaction' }).first().innerText();
  // The number and its suffix are separate spans, so compare whitespace-stripped.
  const flatCounters = counterText.replace(/\s+/g, '');
  check(
    'Counters reach target values',
    flatCounters.includes('99%') &&
      flatCounters.includes('25,000Mn') &&
      flatCounters.includes('1,000+'),
    counterText.replace(/\n/g, ' ').slice(0, 80),
  );

  // --- Add to cart from a homepage card
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Book Now' }).first().click();
  await page.waitForTimeout(300);
  const floatingText = await page.locator('a:has-text("Proceed")').locator('..').innerText();
  check('Add to cart updates floating widget', /1 item selected/.test(floatingText), floatingText.replace(/\n/g, ' | '));

  const headerCart = await page.locator('header a[href="/cart/"]').innerText();
  check('Header cart total updates', /₹/.test(headerCart) && !/₹0\.00/.test(headerCart), headerCart.replace(/\n/g, ' '));

  // --- Cart survives a full page load (WooCommerce keeps it in the server session)
  await page.goto(BASE + '/cart/', { waitUntil: 'networkidle' });
  check(
    'Cart persists across page load',
    (await page.locator('button[aria-label^="Increase quantity"]').count()) === 1,
  );

  // --- Cart quantity controls
  const plus = page.locator('button[aria-label^="Increase quantity"]').first();
  const minus = page.locator('button[aria-label^="Decrease quantity"]').first();
  const qty = () => plus.locator('..').locator('span').first().innerText();

  check('Cart starts at quantity 1', (await qty()) === '1');
  await plus.click();
  await page.waitForTimeout(250);
  check('Cart quantity increase works', (await qty()) === '2', `qty=${await qty()}`);
  await minus.click();
  await page.waitForTimeout(250);
  check('Cart quantity decrease works', (await qty()) === '1', `qty=${await qty()}`);

  // --- Checkout reaches the order form and never claims a booking succeeded
  await page.goto(BASE + '/checkout/', { waitUntil: 'networkidle' });
  const checkoutText = await page.locator('main').innerText();
  check(
    'Checkout separates UI from unavailable backend',
    checkoutText.includes('cannot') && checkoutText.includes('Place order (unavailable)'),
  );
  check(
    'Checkout place-order button is disabled',
    await page.getByRole('button', { name: /Place order/ }).isDisabled(),
  );

  // --- Remove from cart
  await page.goto(BASE + '/cart/', { waitUntil: 'networkidle' });
  await page.locator('button:has-text("Remove")').first().click();
  await page.waitForTimeout(250);
  const emptied = await page.locator('main').innerText();
  check('Cart remove works', emptied.includes('Your cart is currently empty.'));

  // --- FAQ accordion
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const faqBtn = page.getByRole('button', { name: /What are the lab timings/ });
  await faqBtn.scrollIntoViewIfNeeded();
  check('FAQ starts collapsed', (await faqBtn.getAttribute('aria-expanded')) === 'false');
  await faqBtn.click();
  await page.waitForTimeout(250);
  check('FAQ expands on click', (await faqBtn.getAttribute('aria-expanded')) === 'true');
  await faqBtn.click();
  await page.waitForTimeout(250);
  check('FAQ collapses again', (await faqBtn.getAttribute('aria-expanded')) === 'false');

  // --- Search popup
  await page.getByLabel('Open search').click();
  await page.waitForTimeout(300);
  await page.locator('#popup-search').fill('liver');
  await page.waitForTimeout(400);
  const searchResults = await page.locator('#popup-search').locator('../../..').innerText();
  check('Search popup returns matches', /LFT/.test(searchResults), searchResults.split('\n').slice(0, 3).join(' | '));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  check('Search popup closes on Escape', (await page.locator('#popup-search').count()) === 0);

  // --- Login popup
  await page.getByRole('button', { name: 'Login & Sign Up' }).click();
  await page.waitForTimeout(300);
  check(
    'Login popup shows Patient/Doctor chooser',
    (await page.getByRole('heading', { name: 'Welcome to Arova Labs' }).count()) > 0 &&
      (await page.getByText('Login as Doctor, Lab').count()) > 0,
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);

  // --- Listing search + filter
  await page.goto(BASE + '/tests/', { waitUntil: 'networkidle' });
  const beforeCount = await page.locator('article').count();
  await page.locator('#listing-search').fill('glucose');
  await page.waitForTimeout(400);
  const afterCount = await page.locator('article').count();
  check('Tests page search filters results', afterCount > 0 && afterCount < beforeCount, `${beforeCount} -> ${afterCount}`);

  await page.locator('#listing-search').fill('zzzznothing');
  await page.waitForTimeout(400);
  check('Tests page shows empty state', (await page.getByText(/No results matched/).count()) > 0);

  // --- Archive sort
  await page.goto(BASE + '/shop/', { waitUntil: 'networkidle' });
  const titles = () => page.locator('ul.cards-grid > li h2').allInnerTexts();

  const defaultOrder = await titles();
  check(
    'Shop default sorting matches reference (alphabetical)',
    defaultOrder[0] === 'Fasting Blood Glucose' &&
      defaultOrder[1] === 'LFT (Liver Function Test)' &&
      defaultOrder[2] === 'Nalam-A' &&
      defaultOrder[3] === 'Nalam-B',
    defaultOrder.slice(0, 4).join(' | '),
  );

  await page.locator('select[name="orderby"]').selectOption('price-desc');
  await page.waitForTimeout(400);
  const descOrder = await titles();
  check(
    'Shop sort by price reorders grid',
    descOrder.join('|') !== defaultOrder.join('|'),
    descOrder.slice(0, 2).join(' | '),
  );

  // --- Contact form
  await page.goto(BASE + '/contact-us/', { waitUntil: 'networkidle' });
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-message').fill('Hello');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await page.waitForTimeout(300);
  check('Contact form reports success locally', (await page.getByText(/your message has been recorded/).count()) > 0);

  // --- Call / WhatsApp links
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  check('tel: links present', (await page.locator('a[href^="tel:"]').count()) > 0);
  check('WhatsApp links present', (await page.locator('a[href*="wa.me"]').count()) > 0);

  // --- Internal navigation
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Packages' }).click();
  await page.waitForURL('**/packages/');
  check('Nav link routes to /packages/', page.url().endsWith('/packages/'), page.url());

  // --- Organ tile -> product tag archive
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Bone' }).click();
  await page.waitForURL('**/product-tag/bone/');
  check('Organ tile routes to tag archive', page.url().includes('/product-tag/bone/'), page.url());

  check('No console/page errors during desktop run', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.close();
}

// ----------------------------------------------------------------- mobile
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // Off-canvas nav starts hidden
  const drawer = page.locator('#mobile-nav');
  check('Mobile drawer hidden initially', (await drawer.evaluate((el) => el.className)).includes('-translate-x-full'));

  await page.getByLabel('Open menu').click();
  await page.waitForTimeout(400);
  check('Mobile drawer opens', (await drawer.evaluate((el) => el.className)).includes('translate-x-0'));

  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  check('Body scroll locked while drawer open', bodyOverflow === 'hidden', bodyOverflow);

  await drawer.getByRole('link', { name: 'About Us' }).click();
  await page.waitForURL('**/about-us/');
  await page.waitForTimeout(500);
  check('Mobile nav navigates and closes', page.url().includes('/about-us/') && (await page.evaluate(() => document.body.style.overflow)) !== 'hidden');

  await page.getByLabel('Open menu').click();
  await page.waitForTimeout(300);
  await page.getByLabel('Close menu').click();
  await page.waitForTimeout(400);
  check('Mobile drawer closes via X', (await drawer.evaluate((el) => el.className)).includes('-translate-x-full'));

  check('No console/page errors during mobile run', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.close();
}

await browser.close();

// ----------------------------------------------------------------- report
const failed = results.filter((r) => !r.pass);
console.log('===== INTERACTION RESULTS =====\n');
for (const r of results) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  —  ${r.detail}` : ''}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exitCode = 1;
