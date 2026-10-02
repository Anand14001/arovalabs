import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const browser = await chromium.launch();

for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  console.log(`\n===== ${vp.name} (${vp.width}px) =====`);

  // 1. Hero banner carousel
  const banner = await page.evaluate(() => {
    const section = document.querySelector('section[aria-label="Promotional banners"]');
    if (!section) return null;
    const visibleImgs = [...section.querySelectorAll('img')].filter((i) => {
      const r = i.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    return visibleImgs.map((i) => ({
      src: i.getAttribute('src'),
      w: Math.round(i.getBoundingClientRect().width),
      h: Math.round(i.getBoundingClientRect().height),
      loaded: i.naturalWidth > 0,
    }));
  });
  console.log('banner slides rendered:', JSON.stringify(banner));

  // Advance the banner
  await page.locator('button[aria-label="Next banner"]:visible').first().click();
  await page.waitForTimeout(800);
  const shifted = await page.evaluate(() => {
    const tracks=[...document.querySelectorAll('section[aria-label="Promotional banners"] .flex')];const track=tracks.find(t=>t.getBoundingClientRect().width>0);
    return track ? track.style.transform : 'none';
  });
  console.log('banner advances ->', shifted);

  // 2. Card heights in each rail
  const rails = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.rail').forEach((rail, i) => {
      const cards = [...rail.querySelectorAll('article')];
      if (!cards.length) return;
      const heights = cards.map((c) => Math.round(c.getBoundingClientRect().height));
      // Where does each card's primary button sit vertically?
      const btnTops = cards
        .map((c) => {
          const b = c.querySelector('button, a.btn-brand');
          return b ? Math.round(b.getBoundingClientRect().top - c.getBoundingClientRect().top) : null;
        })
        .filter((v) => v !== null);
      out.push({
        rail: i,
        cards: cards.length,
        heights: [...new Set(heights)],
        uniformHeight: new Set(heights).size === 1,
        buttonOffsets: [...new Set(btnTops)],
      });
    });
    return out;
  });
  rails.forEach((r) =>
    console.log(
      `rail#${r.rail}: ${r.cards} cards | uniform height: ${r.uniformHeight} | heights ${JSON.stringify(r.heights)}`,
    ),
  );

  // Grid cards on /tests/ and /packages/
  for (const route of ['/tests/', '/packages/']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const grid = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('article')];
      const byRow = {};
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        const key = Math.round(r.top / 5) * 5;
        (byRow[key] ||= []).push(Math.round(r.height));
      });
      return Object.entries(byRow).map(([top, hs]) => ({
        top: +top,
        heights: [...new Set(hs)],
        uniform: new Set(hs).size === 1,
      }));
    });
    const allUniform = grid.every((g) => g.uniform);
    console.log(`${route} rows uniform: ${allUniform}`, JSON.stringify(grid));
  }

  // 3. Footer background
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const footer = await page.evaluate(() => {
    const f = document.querySelector('footer');
    const btn = f.querySelector('form button[type="submit"]');
    return {
      bg: getComputedStyle(f).backgroundColor,
      heading: getComputedStyle(f.querySelector('h2')).color,
      submitBg: btn ? getComputedStyle(btn).backgroundColor : null,
    };
  });
  console.log('footer:', JSON.stringify(footer));

  await page.close();
}

await browser.close();
