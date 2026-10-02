import { Navigate, useParams } from 'react-router-dom';
import { AlertCircle, BadgeCheck, Check, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCarousel from '../components/ProductCarousel';
import SectionHeading from '../components/SectionHeading';
import FAQ from '../components/FAQ';
import { useCart } from '../context/CartContext';
import {
  formatPrice,
  getProductBySlug,
  getSimilarProducts,
  productAssurance,
  productBenefits,
  slotsNotice,
  taxNotice,
} from '../data/products';

/*
 * Single product template, covering both tests and packages.
 *
 * Tests show Overview / Included Parameters / Preparation / Process.
 * Packages show Parameters Covered / Pre-test Instructions and the
 * NABL + "50k+ Trusted Patients" assurance strip.
 *
 * Note: on the reference site the Book Now / Add to Cart buttons on most
 * products post the wrong product ID (always 924 or 1676). They are wired to
 * the correct product here — see AUDIT.md §3.
 */
export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addItem } = useCart();

  if (!product) return <Navigate to="/404" replace />;

  const isPackage = product.type === 'package';

  return (
    <>
      <div className="shell">
        <Breadcrumbs trail={product.breadcrumb} current={product.title} />
      </div>

      <div className="shell grid gap-8 pb-10 lg:grid-cols-[1fr_380px]">
        {/* ------------------------------------------------ left: details */}
        <div>
          {product.badges.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand"
                >
                  <BadgeCheck size={13} />
                  {badge}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{product.title}</h1>

          <p className="mt-3 text-sm leading-relaxed text-body">{product.excerpt}</p>
          {product.excerptSecondary && (
            <p className="mt-2 text-sm leading-relaxed text-body">{product.excerptSecondary}</p>
          )}

          {/* Packages: Parameters Covered */}
          {isPackage && product.parameterGroups && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-ink">Parameters Covered</h2>
              <ul className="mt-3 space-y-3">
                {product.parameterGroups.map((group) => (
                  <li key={group.name} className="card p-4">
                    <h3 className="text-sm font-bold text-ink">{group.name}</h3>
                    <p className="mt-1 text-xs text-body">{group.items}</p>
                  </li>
                ))}
              </ul>

              {product.showAllParametersButton && (
                <button type="button" className="btn-outline mt-4">
                  View All Parameters
                </button>
              )}
            </section>
          )}

          {/* Packages: Pre-test Instructions */}
          {isPackage && product.preTest && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-ink">Pre-test Instructions</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {product.preTest.map((item, i) => (
                  <li key={`${item.title}-${i}`} className="card flex gap-3 p-4">
                    {item.icon ? (
                      <img src={item.icon} alt="" className="size-7 shrink-0" />
                    ) : (
                      <Check size={18} className="mt-0.5 shrink-0 text-brand" />
                    )}
                    <span>
                      <span className="block text-sm font-semibold text-ink">{item.title}</span>
                      <span className="mt-0.5 block text-xs text-body">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tests: Overview */}
          {!isPackage && product.overview && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-ink">Overview</h2>
              <p className="mt-2 text-sm leading-relaxed text-body">{product.overview}</p>
            </section>
          )}

          {/* Tests: Included Parameters */}
          {!isPackage && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-ink">Included Parameters</h2>
              {product.parameters.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.parameters.map((param) => (
                    <li
                      key={param}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-ink"
                    >
                      <Check size={13} className="text-brand" />
                      {param}
                    </li>
                  ))}
                </ul>
              ) : (
                /* The reference site renders a PHP warning here. See AUDIT.md §3. */
                <p className="mt-2 text-sm text-body">
                  Parameter list unavailable for this test.
                </p>
              )}
            </section>
          )}

          {/* Tests: Preparation + Process */}
          {!isPackage && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {product.preparation && (
                <section className="card p-5">
                  <h2 className="text-sm font-bold text-ink">Preparation</h2>
                  <ul className="mt-2.5 space-y-2">
                    {product.preparation.map((item, i) => (
                      <li key={`${item}-${i}`} className="flex items-start gap-2 text-xs text-body">
                        <Check size={13} className="mt-0.5 shrink-0 text-brand" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {product.process && (
                <section className="card p-5">
                  <h2 className="text-sm font-bold text-ink">Process</h2>
                  <ul className="mt-2.5 space-y-2.5">
                    {product.process.map((item, i) => (
                      <li key={`${item.text}-${i}`} className="flex items-start gap-2">
                        <img src={item.icon} alt="icon" className="size-4 shrink-0" />
                        <span className="text-xs text-body">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* Who should take this test? — heading renders even when empty on the reference. */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-ink">Who should take this test?</h2>
            {product.audience.length > 0 && (
              <ul className="mt-3 space-y-2.5">
                {product.audience.map((item, i) => (
                  <li key={`${item}-${i}`} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-light text-accent">
                      <AlertCircle size={13} />
                    </span>
                    <span className="text-sm text-body">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {product.detailImage && (
            <img
              src={product.detailImage}
              alt=""
              loading="lazy"
              className="mt-8 w-full rounded-xl object-cover"
            />
          )}
        </div>

        {/* ----------------------------------------- right: booking panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {isPackage && (
            <div className="card mb-4 divide-y divide-slate-100">
              {productAssurance.map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" />
                  <span>
                    <span className="block text-sm font-bold text-ink">{item.title}</span>
                    <span className="block text-xs text-body">{item.text}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="card p-5">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
              {product.discount}
            </span>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ink">{formatPrice(product.salePrice)}</span>
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            </div>

            <p className="mt-1 text-xs text-body">{taxNotice}</p>

            <p className="mt-4 rounded-lg bg-accent-light px-3 py-2 text-sm font-semibold text-accent-dark">
              {slotsNotice}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => addItem(product.id)}
                className="btn-brand w-full"
              >
                Book Now
              </button>
              <button
                type="button"
                onClick={() => addItem(product.id)}
                className="btn-outline w-full"
              >
                Add to Cart
              </button>
            </div>

            <ul className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              {productBenefits.map((benefit) => (
                <li key={benefit.title} className="flex items-start gap-2.5">
                  <Check size={15} className="mt-0.5 shrink-0 text-brand" />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{benefit.title}</span>
                    <span className="block text-xs text-body">{benefit.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <FAQ items={product.faqs} heading="FAQ" className="bg-slate-50" />

      <section className="section">
        <div className="shell">
          <SectionHeading heading="Similar Tests You Might Need" />
          <div className="mt-8">
            <ProductCarousel
              products={getSimilarProducts(product)}
              variant={isPackage ? 'package' : 'test'}
            />
          </div>
        </div>
      </section>
    </>
  );
}
