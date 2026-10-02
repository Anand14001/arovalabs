import { useState } from 'react';
import { newsletter } from '../data/site';

/*
 * Sits in the teal footer, so the field is white and the submit button uses the
 * reference footer's own orange (#F48D06 in Elementor's post-339.css — note this
 * is a shade apart from the global accent #EF8A06).
 *
 * The reference site posts this to Elementor Pro's form handler. There is no
 * backend here, so the field validates and the form reports success locally
 * without sending anything. See AUDIT.md §5.
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div>
      <h2 className="text-base font-bold text-white">{newsletter.heading}</h2>
      <p className="mt-4 text-sm text-white/80">{newsletter.sub}</p>

      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          setEmail('');
        }}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          {newsletter.placeholder}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="newsletter-email"
            type="email"
            name="form_fields[email]"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSent(false);
            }}
            placeholder={newsletter.placeholder}
            className="w-full min-w-0 rounded-lg border border-white/30 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#F48D06] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d87e05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {newsletter.button}
          </button>
        </div>

        {sent && (
          <p className="mt-2 text-xs text-white" role="status">
            Thanks for subscribing. (Demo only — no backend is connected.)
          </p>
        )}
      </form>
    </div>
  );
}
