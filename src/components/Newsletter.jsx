import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { newsletter } from '../data/site';

/*
 * The footer signup.
 *
 * A pill with the submit folded inside it, rather than a boxed field with a
 * block button beside it. One shape instead of two, and the submit sits where
 * the cursor already is when it finishes typing. The button keeps the reference
 * footer's own orange (#F48D06 in Elementor's post-339.css — a shade apart from
 * the global accent #EF8A06) so the footer stays faithful to the original.
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
      <h2 className="label text-white/45">{newsletter.heading}</h2>
      <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/75">{newsletter.sub}</p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          setEmail('');
        }}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          {newsletter.placeholder}
        </label>

        <div className="flex max-w-sm items-center gap-2 rounded-full bg-white p-1.5 pl-5 focus-within:ring-2 focus-within:ring-white/60">
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
            className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
          />

          <button
            type="submit"
            aria-label={newsletter.button}
            className="group grid size-10 shrink-0 place-items-center rounded-full bg-[#F48D06] text-white transition-colors duration-300 hover:bg-[#d87e05]"
          >
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
        </div>

        {sent && (
          <p className="mt-3 text-xs text-white" role="status">
            Thanks for subscribing. (Demo only — no backend is connected.)
          </p>
        )}
      </form>
    </div>
  );
}
