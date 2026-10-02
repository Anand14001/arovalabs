/*
 * Responsive width audit.
 *
 * For every route at every breakpoint in the brief, reports:
 *   - the side gap left by the main container (viewport width vs content width),
 *   - whether a horizontal scrollbar appeared,
 *   - how many columns each card grid resolved to,
 *   - the rendered card width.
 *
 * Run with the dev server up:  node scripts/verify-widths.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

const WIDTHS = [375, 390, 430, 768, 1024, 1280, 1440, 1600, 1920, 2560];

const ROUTES = [
  '/',
  '/tests/',
  '/packages/',
  '/about-us/',
  '/contact-us/',
  '/shop/',
  '/product/nalam-a-2/',
  '/product/complete-blood-count-cbc-test/',
  '/product-category/packages/',
  '/product-tag/bone/',
  '/category/nutrition/',
  '/why-waiting-for-symptoms-is-a-risky-strategy-the-power-of-preventive-health-checkups/',
  '/my-account/',
  '/upload-prescription/',
  '/cart/',
  '/checkout/',
  '/booking-confirmation/',
  '/welcome-page/',
  '/privacy-policy/',
];

const browser = await chromium.launch();
const overflow = [];
const gapReport = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  let maxGap = 0;
  let worstRoute = '';
  let sampleGrid = null;

  for (const route of ROUTES) {
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);

    const r = await page.evaluate(() => {
      // The header's top bar is display:none below lg but still in the DOM, so
      // measure the first container that is actually laid out.
      const shell = [...document.querySelectorAll('.shell, .shell-narrow')].find(
        (el) => el.getBoundingClientRect().width > 0,
      );
      const shellBox = shell ? shell.getBoundingClientRect() : null;
      const inner = shell ? getComputedStyle(shell) : null;

      // Usable content width = container width minus its own horizontal padding.
      const contentWidth = shellBox
        ? shellBox.width -
          parseFloat(inner.paddingLeft || 0) -
          parseFloat(inner.paddingRight || 0)
        : null;

      const grid = document.querySelector('.cards-grid, .cards-grid-wide, .cards-grid-tight');
      let gridInfo = null;
      if (grid) {
        const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean);
        const first = grid.firstElementChild;
        gridInfo = {
          cols: cols.length,
          cardW: first ? Math.round(first.getBoundingClientRect().width) : null,
        };
      }

      return {
        contentWidth: contentWidth ? Math.round(contentWidth) : null,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        gridInfo,
      };
    });

    if (r.scrollWidth > r.innerWidth + 1) {
      overflow.push(`${width}px ${route} — ${r.scrollWidth} > ${r.innerWidth}`);
    }

    if (r.contentWidth !== null) {
      const gap = width - r.contentWidth;
      if (gap > maxGap) {
        maxGap = gap;
        worstRoute = route;
      }
    }
    if (r.gridInfo && !sampleGrid) sampleGrid = r.gridInfo;

    await page.close();
  }

  gapReport.push({ width, maxGap, worstRoute, sampleGrid });
  await context.close();
}

await browser.close();

console.log('viewport |  gap  | content | grid cols | card w | worst route');
console.log('---------+-------+---------+-----------+--------+------------');
for (const g of gapReport) {
  const content = g.width - g.maxGap;
  const pct = ((content / g.width) * 100).toFixed(0);
  console.log(
    `${String(g.width).padStart(7)}px | ${String(g.maxGap).padStart(4)}px | ` +
      `${String(content).padStart(5)}px (${pct}%) | ` +
      `${String(g.sampleGrid ? g.sampleGrid.cols : '-').padStart(9)} | ` +
      `${String(g.sampleGrid ? g.sampleGrid.cardW : '-').padStart(6)} | ${g.worstRoute}`,
  );
}

console.log(`\nroutes: ${ROUTES.length} × widths: ${WIDTHS.length}`);
if (overflow.length) {
  console.log(`\nHORIZONTAL OVERFLOW (${overflow.length}):`);
  overflow.slice(0, 20).forEach((o) => console.log('  ' + o));
  process.exitCode = 1;
} else {
  console.log('No horizontal overflow at any width.');
}
