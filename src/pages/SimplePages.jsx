import { Link, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { site } from '../data/site';
import {
  samplePage,
  stubPages,
  welcomePage,
} from '../data/pages';
import { legalPages } from '../data/legal';

// --------------------------------------------------------- /welcome-page/
export function WelcomePage() {
  return (
    <section className="section">
      <div className="shell-narrow max-w-3xl text-center">
        <img src={site.logo} alt={site.title} className="mx-auto h-12 w-auto" />
        <h1 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">{welcomePage.heading}</h1>
        <p className="mt-2 text-sm text-body">{welcomePage.sub}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {welcomePage.options.map((opt) => (
            <article
              key={opt.title}
              className="card flex flex-col items-center p-6 text-center transition-colors hover:border-brand"
            >
              <img src={opt.icon} alt="" className="size-14" />
              <h2 className="mt-4 text-lg font-bold text-ink">{opt.title}</h2>
              <p className="mt-1.5 flex-1 text-sm text-body">{opt.text}</p>
              <a href={opt.to} className="btn-brand mt-5 w-full">
                {opt.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/*
 * The /booking-confirmation/ placeholder used to live here. It is now a real
 * page (pages/BookingConfirmation.jsx) that loads the order it is confirming,
 * so the static version has been removed rather than left to rot beside it.
 */
// -------------------------------- /privacy-policy/ and /terms-of-service/
export function LegalPage({ slug }) {
  const page = legalPages[slug];

  return (
    <section className="section">
      <div className="shell-narrow">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{page.title}</h1>

        <div className="mt-8 space-y-7">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-bold text-ink">{section.heading}</h2>
              {section.paras.map((para, i) => (
                <p key={i} className="mt-2.5 text-sm leading-relaxed text-body">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------- /sample-page/
export function SamplePage() {
  return (
    <section className="section">
      <div className="shell-narrow">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{samplePage.title}</h1>

        <div className="mt-6 space-y-4">
          {samplePage.paragraphs.map((para, i) => (
            <p
              key={i}
              className={`text-sm leading-relaxed text-body ${i === 1 || i === 3 ? 'border-l-4 border-slate-200 pl-4' : ''}`}
            >
              {para}
            </p>
          ))}

          <p className="text-sm leading-relaxed text-body">
            {samplePage.closing.before}
            <a
              href="https://arovalabs.com/wp-admin/"
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:underline"
            >
              {samplePage.closing.linkLabel}
            </a>
            {samplePage.closing.after}
          </p>
        </div>
      </div>
    </section>
  );
}

/*
 * /patient-login/ and /doctor-login/ — these render only an <h1> on the
 * reference site; no form has been built there yet (AUDIT.md §4).
 */
export function StubPage({ slug }) {
  return (
    <section className="section">
      <div className="shell-narrow">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{stubPages[slug]}</h1>
        <p className="mt-4 text-sm text-body">
          This page exists on the reference site but contains only its title — no login form has
          been published there yet.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- 404
export function NotFound() {
  const { pathname } = useParams();

  return (
    <section className="section">
      <div className="shell-narrow max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Page not found</h1>
        <p className="mt-3 text-sm text-body">
          The page you’re looking for doesn’t exist{pathname ? ` (${pathname})` : ''}.
        </p>
        <Link to="/" className="btn-brand mt-6">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
