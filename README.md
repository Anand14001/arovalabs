# Arova Labs — Phase 1 recreation

A functional recreation of <https://arovalabs.com/> in React + Vite + Tailwind, preserving the
original content, routes and behaviour ahead of the Phase 2 redesign.

See [AUDIT.md](AUDIT.md) for the reference-site audit, full sitemap, the list of reference defects
preserved vs. corrected, and the verification results.

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Verification

The three Playwright suites below need the dev server running in another terminal.

```bash
node scripts/verify.mjs              # 54 routes × 4 viewports
node scripts/verify-interactions.mjs # 40 interaction checks
node scripts/verify-widths.mjs       # 19 routes × 10 widths
```

## Structure

```
public/assets/          148 original assets downloaded from the reference site
src/
  components/           Header, Footer, Hero, cards, carousels, FAQ, popups, widgets
  pages/                One component per route group
  layouts/MainLayout    Header + Footer + floating cart, scroll restoration
  context/CartContext   Client-side cart (localStorage), no backend
  data/                 All site content, separated from presentation
    site.js             Branding, contact details, navigation, footer
    homepage.js         Homepage sections in render order
    products.js         All 10 products with full detail-page content
    taxonomies.js       Product categories, tags, blog categories
    blogs.js            Posts (generated from the reference WP REST API)
    about.js            About page content and lab locations
    pages.js            Contact, upload, welcome, confirmation, account, listings
    legal.js            Privacy policy / terms (generated from the reference)
    testimonials.js     Patient testimonials
    googleReviews.js    Trustindex review snapshot
  index.css             Theme tokens, container system, shared component classes
```

### Phase 2 notes

- **Content lives in `src/data/`.** No copy is hard-coded in components, so the UI can be
  rebuilt without touching content.
- **Theme tokens are in one place.** `@theme` at the top of `src/index.css` holds every colour
  and font; `.shell`, `.section`, `.btn-*` and `.card` build on them.
- **Framer Motion is installed but currently unused** — the reference's animations (carousel
  slide, counters, marquee) are all CSS/JS-driven. It is kept for Phase 2.
- Two reference containers are intentionally not rendered (an invisible hero text carousel and an
  invisible "Health Checkups" section). Their content is preserved in `data/homepage.js` as
  `hiddenHeroSlides` and `hiddenHealthCheckups` — see AUDIT.md §2.

### Not connected

WooCommerce orders and payment, Elementor form submissions, account authentication, and the live
Trustindex feed all run server-side on the reference site. The front-end interactions are
implemented; the integrations are stubbed and labelled in the UI. Nothing claims a booking or
payment succeeded. See AUDIT.md §5.
