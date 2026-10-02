# Arova Labs — Phase 1 Reference Audit & Sitemap

Reference: <https://arovalabs.com/> — audited 2026-10-02.

Source stack (reference site): WordPress 7.1.2 + Hello Elementor child theme + Elementor Pro 4.0.4 + WooCommerce 10.7.0.
All content below was extracted from the live rendered HTML of all 39 public URLs, plus the WP REST API
(`/wp-json/wp/v2/{product,posts,product_cat,product_tag,media}`) and `wp-sitemap.xml`.

## 1. Sitemap

### Pages (17, from `wp-sitemap-posts-page-1.xml`)

| Reference URL | Recreated route | Notes |
| --- | --- | --- |
| `/` | `/` | Homepage, 24 sections |
| `/tests/` | `/tests/` | Test listing + search + filter chips |
| `/packages/` | `/packages/` | Package listing + search + filter chips |
| `/about-us/` | `/about-us/` | 9 sections incl. leadership, 6 locations |
| `/contact-us/` | `/contact-us/` | 3 info cards, form, map embed |
| `/shop/` | `/shop/` | Default WooCommerce archive, all 10 products |
| `/cart/` | `/cart/` | Empty-cart state on reference |
| `/checkout/` | `/checkout/` | Empty-cart state on reference |
| `/my-account/` | `/my-account/` | WooCommerce login + register forms |
| `/upload-prescription/` | `/upload-prescription/` | File upload form |
| `/booking-confirmation/` | `/booking-confirmation/` | Success state |
| `/welcome-page/` | `/welcome-page/` | Patient / Doctor account chooser |
| `/patient-login/` | `/patient-login/` | Stub — title only on reference |
| `/doctor-login/` | `/doctor-login/` | Stub — title only on reference |
| `/privacy-policy/` | `/privacy-policy/` | WP default boilerplate |
| `/terms-of-service/` | `/terms-of-service/` | Identical to privacy policy except H2 |
| `/sample-page/` | `/sample-page/` | WP default sample page |

### Products (10, from `wp-sitemap-posts-product-1.xml`)

Route: `/product/:slug/`

| ID | Slug | Title | Regular | Sale | Discount |
| --- | --- | --- | --- | --- | --- |
| 924 | `postprandial-blood-glucose` | Postprandial Blood Glucose | ₹50.00 | ₹40.00 | 20% OFF |
| 925 | `fasting-blood-glucose` | Fasting Blood Glucose | ₹60.00 | ₹40.00 | 33% OFF |
| 928 | `complete-blood-count-cbc-copy-copy` | Urea | ₹50.00 | ₹45.00 | 10% OFF |
| 105 | `complete-blood-count-cbc-test` | LFT (Liver Function Test) | ₹60.00 | ₹50.00 | 17% OFF |
| 1676 | `nalam-b` | Nalam-B | ₹199.00 | ₹99.00 | 50% OFF |
| 922 | `nalam-a-2` | Nalam-A | ₹1,599.00 | ₹999.00 | 38% OFF |
| 169 | `women-wellness-essential` | Women Wellness Essential | ₹1,599.00 | ₹999.00 | 38% OFF |
| 923 | `women-wellness-essential-copy` | Women Wellness Essential (Copy) | ₹1,599.00 | ₹999.00 | 38% OFF |
| 927 | `women-wellness-essential-copy-copy` | Women Wellness Essential (Copy) (Copy) | ₹1,599.00 | ₹999.00 | 38% OFF |
| 926 | `women-wellness-essential-copy-copy-2` | Women Wellness Essential (Copy) (Copy) | ₹1,599.00 | ₹999.00 | 38% OFF |

Note: slugs `complete-blood-count-cbc-*` no longer match their titles on the reference site
(product 105 is titled "LFT (Liver Function Test)", 928 is "Urea"). Slugs preserved verbatim so URLs still resolve.

### Blog posts (3, from `wp-sitemap-posts-post-1.xml`)

Route: `/:slug/`

| ID | Slug | Category | Date |
| --- | --- | --- | --- |
| 1361 | `beyond-basic-blood-work-the-critical-role-of-histopathology-and-specialized-diagnostics` | Nutrition | 2026-03-24 |
| 1360 | `understanding-your-blood-test-results-why-accuracy-and-quality-matter` | Nutrition | 2026-03-24 |
| 658 | `why-waiting-for-symptoms-is-a-risky-strategy-the-power-of-preventive-health-checkups` | Health Tips | 2026-03-01 |

### Product categories (`product_cat`) — route `/product-category/:path/`

Parents: `tests` (16, 4 products), `packages` (19, 6 products).

Children of `tests`: `diabetes-tests` (2), `liver-profile` (1), `heart-health-tests` (0), `thyroid` (0), `vitamins` (0), `yy-gland` (0).
Children of `packages`: `fitness` (5), `heart-health` (1), `kids-health` (1), `women-health` (0), `senior-citizen` (0), `diabetes` (0).

Only the 7 categories with products appear in the reference sitemap, but all 14 term URLs resolve.

### Product tags (`product_tag`) — route `/product-tag/:slug/`

`bone` (4), `kidney` (3), `gall-bladder` (0), `heart` (0), `lungs` (0), `thyroid` (0).
These back the homepage "Choose Test by Organ" tiles. All 6 URLs return 200 on the reference site.

### Blog categories (`category`) — route `/category/:slug/`

`nutrition` (2), `health-tips` (1), `cardiology` (0), `wellness` (0).

## 2. Homepage section order (as rendered)

Container ids are Elementor `data-id` values on `https://arovalabs.com/`.

1. Top bar (`lg` and up) — logo, search, call/WhatsApp icons, Home Collection `+91 94422 18998`
2. Main header — logo, search toggle, account icon, cart (`₹0.00 0 Cart`), nav, "Login & Sign Up"
3. **Hero image carousel** — `d98f8b4` on desktop/tablet (`001.webp`, `002.webp`, 1975×700),
   `a8c9236` on mobile (`001-1.webp`, `002-1.webp`, 1080×1350). One slide at a time, arrows,
   autoplay 5000ms, infinite.
4. Sticky trust marquee (`d37662e`) — teal `#2B7E83`, 40px, items separated by `#EF8A06` stars,
   track scrolls `-50%` over 35s linear infinite, pauses on hover.
5. Three quick actions (`28b7639`) — Book on WhatsApp / Book via Call / Upload Prescription
6. Home Collection (`3cf17ea`) — 4 steps
7. Frequently Booked Tests (`98e9c9f`) — 4 test cards, "View More" → `/tests/`
8. Choose Test by Organ (`5027391`) — 6 organ tiles → `/product-tag/*/`
9. Frequently Booked Packages (`c41ed7f`) — 6 package cards
10. Certified Quality Assurance (`1391fb0` + `0d66c8d`) — NABL + ISO badges, team photo, 200+ doctors copy
11. Most Prescribed Tests (`4551b5a`) — same 4 test cards
12. WhatsApp Reports (`2700ba1`) — 3 counters (1800+, 30+, 10+)
13. Why Choose Arova labs? (`c3b0af5`) — 5 counters
14. Awards band (`ef108e0`) — 4 counters + "Awards Won" icon box
15. See Arova in Action (`1e7173c`) — 5 video cards
16. What Our Patients Say (`e949cbc`) — Trustindex Google reviews block + 4 testimonial cards
17. Latest Health Blogs (`8adc955`) — 3 post cards
18. FAQ (`4515ac5`) — 6 questions
19. Footer — logo, Quick Links, Get in Touch, Join Newsletter. Background is the brand
    teal `#2B7E83` (per `post-339.css`); the newsletter submit button is `#F48D06`.
20. Footer bottom — "© 2026 Arova Labs. All rights reserved." + 3 legal links
21. Floating cart widget — total, "Proceed" → `/cart/`
22. Login popup (Elementor popup 631) — Patient / Doctor chooser
23. Search popup (Elementor popup 881)
24. Mobile off-canvas nav

### Containers hidden at every breakpoint — present in the markup, never rendered

Elementor's `elementor-hidden-desktop` / `-tablet` / `-mobile` resolve to `display:none` at
`≥1025px`, `768–1024px` and `≤767px` respectively (verified in `elementor/assets/css/frontend.min.css`).
Two homepage containers carry **all three**, so no visitor ever sees them at any width:

| Container | Content | Status here |
| --- | --- | --- |
| `ab3e523` | "Patient-Centric Care / Expert Care, Right at Your Door 1\|2\|3" text + CTA carousel | Not rendered. Content kept in `data/homepage.js` as `hiddenHeroSlides`. |
| `45c6045` | "Recommended / Health Checkups" + 2 banner images + "View All Packages" | Not rendered. Content kept in `data/homepage.js` as `hiddenHealthCheckups`. |

Rendering either would put content on the page that the reference site does not show — and in the
hero's case a second, competing carousel. Both are preserved in the data layer so Phase 2 can
restore them if that is the intent.

## 3. Known reference-site defects

Preserved verbatim per Phase 1 instructions (wording, spelling, duplicate content):

- "Why Choose Arova labs?" — lowercase "labs".
- "Most prescribed tests by docters" — misspelling.
- "Receive your test reports by WhastApp" — misspelling.
- "NABL Accredited, Nationally certified for diagnostic accuracy'" — stray apostrophe.
- "A/G Ratiooo", "No alcohol consumption 24h priorrr", "new test....", "Abcd test", "scascascas",
  "Individuals with ----.", "faq 1 / answer" — unfinished editorial placeholders left live on the reference.
- Three products are literally titled "Women Wellness Essential (Copy)" / "(Copy) (Copy)" ×2.
- Homepage FAQ: all 6 questions share one identical placeholder answer.
- Testimonials are generic ("Sarah Jenkins, New York City") and one name repeats; `Image-5.webp` used twice.
- "See Arova in Action": all 5 cards share one image, one duration ("12:45") and one description; title
  "Expert Consultations" repeats 3×.
- `/contact-us/` map embed points at **London Eye, London** rather than the Dharmapuri lab.
- `/terms-of-service/` is a byte-identical copy of `/privacy-policy/` apart from the heading.
- `/privacy-policy/` and `/terms-of-service/` still contain WordPress's "Suggested text:" boilerplate.
- `/sample-page/` is the untouched WordPress sample page.

Corrected in the recreation (reference behaviour was broken, not merely misworded):

- **Add-to-cart targets.** On the reference, "Book Now" / "Add to Cart" on `fasting-blood-glucose`,
  `complete-blood-count-cbc-copy-copy`, `complete-blood-count-cbc-test`, `nalam-a-2`,
  `women-wellness-essential*` all post `add-to-cart=924` or `=1676` — i.e. they add the *wrong*
  product. The recreation wires each button to its own product ID.
- **PHP warning leak.** `postprandial-blood-glucose` and `complete-blood-count-cbc-copy-copy` render a
  raw PHP warning (`/home/arovalab/public_html/wp-includes/functions.php` line 6260) inside their
  "Included Parameters" block. Reproduced as an empty parameter list instead.
- **Raw JSON in "Included Parameters".** The template prints the ACF field verbatim, so
  `complete-blood-count-cbc-test` shows the literal string `["Bilirubin Total","Bilirubin Direct",…]`
  on screen. The same values are rendered as a proper list here.

## 3a. Deliberate departures from the reference

Changes made at the user's request during Phase 1, each a departure from the reference:

- **Hidden containers are not rendered** (see §2) — the reference ships a second, invisible hero
  carousel and an invisible "Health Checkups" section.
- **"(Formerly Healthcare Diagnostic Services)" removed from the header.** Still present in
  `data/site.js` as `site.formerly`.
- **Floating cart hides while empty.** The reference shows a permanent "0 items selected" bar.
- **Fluid container system** (see §7) — the reference caps content at 1200px.

## 4. Requires manual verification

- `/patient-login/` and `/doctor-login/` render only an `<h1>` on the reference site. Recreated as
  matching stubs; the real forms do not exist yet.
- `/cart/` and `/checkout/` could only be observed in their empty state (no server session).
  Populated cart/checkout layouts are reconstructed from WooCommerce defaults.
- The "View All Parameters" button on package detail pages has no expanded content on the reference.
- `/booking-confirmation/` shows a literal note: "[Dynamic Order Summary will render here after a real
  checkout]". Preserved.
- Hidden "What happens next?" steps on `/booking-confirmation/` are collapsed on the reference.
- Video cards link to `#` — no real video sources exist.

## 5. Not reproducible (backend / third party)

Front-end interaction is implemented; the integration is stubbed and clearly separated:

- WooCommerce cart/order persistence and payment — cart is client-side only (`CartContext`).
  Checkout never claims an order was placed.
- Elementor form submissions (newsletter, contact, prescription upload) — validate and show the
  reference's success copy without sending anything.
- Trustindex Google Reviews widget — the 10 reviews it rendered are captured as static data.
- WooCommerce account auth on `/my-account/`.

## 6. Asset inventory

140 original assets (107 `.webp`, 33 `.svg`, 7.0 MB) downloaded from
`https://arovalabs.com/wp-content/uploads/2026/{02,03,04}/` into `public/assets/` with filenames
preserved. No stock substitutes and no missing assets — every referenced image resolved with HTTP 200.

Brand tokens read from Elementor globals (`/wp-content/uploads/elementor/css/post-7.css`):

| Token | Value |
| --- | --- |
| Primary | `#2B7E83` |
| Secondary | `#EF8A06` |
| Accent | `#181511` |
| Text | `#666666` |
| Dark | `#1C130D` |
| Footer background | `#2B7E83` (primary), newsletter button `#F48D06` |
| Fonts | Inter (UI), Open Sans |

## 7. Responsive container system

The first build inherited a fixed `max-width: 1280px` on the page container, which left ~320px of
unused space per side at 1920px and ~640px at 2560px. Root causes and fixes:

| Root cause | Fix |
| --- | --- |
| `.shell` hard-capped at `max-w-[1280px]` | Fluid: `width:100%`, `padding-inline: clamp(1rem, 4vw, 5rem)`, `max-width: 2200px` (engages only on ultrawide) |
| Stepped gutters (`px-4 sm:px-6 lg:px-8`) that stop growing at `lg` | Single `clamp()` gutter that scales continuously |
| Card grids capped at `lg:grid-cols-3` / `xl:grid-cols-4` | `.cards-grid` / `.cards-grid-wide` / `.cards-grid-tight` using `repeat(auto-fit, minmax(min(100%, Nrem), 1fr))` |
| Ad-hoc `max-w-2xl/3xl/4xl` on document pages | `.shell-narrow` (72rem) with the same fluid gutter |
| Fixed-width carousel slides (`w-[270px]`, `w-[280px]`, `w-[290px]`) | `w-[clamp(…)]` so slides grow with the viewport |
| Breakpoint-stepped headings and section padding | `clamp()`-based `.section`, `.section-title`, `.section-sub` |
| Long prose spanning the full fluid width | `.measure` (78ch) where a reading measure matters |

Measured with `scripts/verify-widths.mjs` across 19 routes × 10 widths:

| Viewport | Content width | Utilisation | Grid columns |
| --- | --- | --- | --- |
| 375px | 343px | 91% | 2 |
| 768px | 707px | 92% | 4 |
| 1024px | 942px | 92% | 6 |
| 1280px | 1178px | 92% | 7 |
| 1440px | 1325px | 92% | 8 |
| 1600px | 1472px | 92% | 9 |
| 1920px | 1766px | 92% | 11 |
| 2560px | 2040px | 80% | 13 |

No horizontal overflow at any width. 2560px sits at 80% by design — the 2200px cap keeps sections
from becoming sparse on ultrawide displays.

## 8. Verification

Three Playwright suites, run against `npm run dev`:

| Script | Covers |
| --- | --- |
| `scripts/verify.mjs` | All 54 routes × 4 viewports: console errors, failed requests, horizontal overflow, broken images, expected content |
| `scripts/verify-interactions.mjs` | 40 checks: hero carousel, trust marquee, counters, cart add/persist/quantity/remove, checkout guard, FAQ accordion, search popup, login popup, listing search + filters, archive sorting, newsletter, contact form, tel/WhatsApp links, routing, mobile drawer |
| `scripts/verify-widths.mjs` | 19 routes × 10 widths: container utilisation, grid column counts, card widths, overflow |

Latest run: 54×4 routes clean, 40/40 interactions passing, 0 overflow across 190 width samples.
