import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { myAccountPage } from '../data/pages';

/*
 * /my-account/ — the WooCommerce login + register forms, reproduced field for
 * field. Authentication is server-side on the reference site and unavailable
 * here (AUDIT.md §5), so neither form submits anywhere.
 */
export default function MyAccount() {
  return (
    <section className="section">
      <div className="shell-narrow">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{myAccountPage.title}</h1>

        <div
          role="note"
          className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-900">
            <strong className="font-semibold">Phase 1 recreation.</strong> WooCommerce account
            authentication runs on the reference site’s server and is not connected here, so these
            forms do not sign anyone in.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Login */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-ink">{myAccountPage.login.heading}</h2>

            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="login-username" className="mb-1.5 block text-sm font-semibold text-ink">
                  Username or email address <span className="text-accent">*</span>
                  <span className="sr-only">Required</span>
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-ink">
                  Password <span className="text-accent">*</span>
                  <span className="sr-only">Required</span>
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-body">
                <input type="checkbox" name="rememberme" className="size-4 accent-[var(--color-brand)]" />
                {myAccountPage.login.rememberLabel}
              </label>

              <button type="submit" className="btn-brand w-full">
                {myAccountPage.login.button}
              </button>

              <p>
                <a href="/my-account/lost-password/" className="text-sm text-brand hover:underline">
                  {myAccountPage.login.lostPassword}
                </a>
              </p>
            </form>
          </div>

          {/* Register */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-ink">{myAccountPage.register.heading}</h2>

            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-sm font-semibold text-ink">
                  Email address <span className="text-accent">*</span>
                  <span className="sr-only">Required</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-sm font-semibold text-ink">
                  Password <span className="text-accent">*</span>
                  <span className="sr-only">Required</span>
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                />
              </div>

              <p className="text-xs leading-relaxed text-body">
                {myAccountPage.register.privacyNotice.before}
                <Link to="/privacy-policy/" className="text-brand hover:underline">
                  {myAccountPage.register.privacyNotice.linkLabel}
                </Link>
                {myAccountPage.register.privacyNotice.after}
              </p>

              <button type="submit" className="btn-brand w-full">
                {myAccountPage.register.button}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
