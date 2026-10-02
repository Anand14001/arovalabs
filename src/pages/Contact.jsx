import { useState } from 'react';
import { contactPage } from '../data/pages';

/*
 * /contact-us/ — info cards, a message form and a map embed.
 *
 * The form posts to Elementor Pro on the reference site; with no backend here it
 * validates and reports success locally without sending anything (AUDIT.md §5).
 * The map embed points at the London Eye on the reference site — preserved.
 */
export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-br from-brand-light via-white to-accent-light">
        <div className="shell py-12 text-center sm:py-16">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">
            {contactPage.heading}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-body sm:text-base">
            {contactPage.sub}
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className="section">
        <div className="shell grid gap-5 sm:grid-cols-3">
          {contactPage.cards.map((card) => (
            <article key={card.title} className="card p-6 text-center">
              <img src={card.icon} alt="" loading="lazy" className="mx-auto size-12" />
              <h2 className="mt-4 text-base font-bold text-ink">{card.title}</h2>
              <p className="mt-1 text-xs text-body">{card.meta}</p>
              <p className="mt-3 text-sm font-semibold text-brand">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="section pt-0">
        <div className="shell grid items-stretch gap-6 lg:grid-cols-2">
          <img
            src={contactPage.formImage}
            alt=""
            loading="lazy"
            className="h-full w-full rounded-xl object-cover"
          />

          <div className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-ink">{contactPage.form.heading}</h2>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                e.currentTarget.reset();
              }}
            >
              {contactPage.form.fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={`contact-${field.name}`}
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    {field.label}
                    {field.required && <span className="text-accent"> *</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      id={`contact-${field.name}`}
                      name={`form_fields[${field.name}]`}
                      rows={5}
                      required={field.required}
                      placeholder={field.placeholder}
                      onChange={() => setSent(false)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                    />
                  ) : (
                    <input
                      id={`contact-${field.name}`}
                      type={field.type}
                      name={`form_fields[${field.name}]`}
                      required={field.required}
                      placeholder={field.placeholder}
                      onChange={() => setSent(false)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                    />
                  )}
                </div>
              ))}

              <button type="submit" className="btn-brand w-full">
                {contactPage.form.button}
              </button>

              {sent && (
                <p className="rounded-lg bg-brand-light px-3 py-2 text-sm text-brand" role="status">
                  Thanks — your message has been recorded. (Demo only — no backend is connected.)
                </p>
              )}

              <p className="text-xs text-body">{contactPage.form.disclaimer}</p>
            </form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-10">
        <div className="shell overflow-hidden rounded-xl border border-slate-200">
          <iframe
            src={contactPage.mapEmbed}
            title="Arova Labs location map"
            loading="lazy"
            className="h-[320px] w-full border-0 sm:h-[420px]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
