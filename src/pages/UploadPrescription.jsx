import { useState } from 'react';
import { Check } from 'lucide-react';
import { uploadPrescriptionPage as page } from '../data/pages';

/*
 * /upload-prescription/ — the Elementor upload form. There is no backend here,
 * so the file is validated client-side and nothing is transmitted (AUDIT.md §5).
 */
export default function UploadPrescription() {
  const [fileName, setFileName] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <section className="section">
      <div className="shell-narrow grid gap-6 lg:grid-cols-2">
        {/* Guidance */}
        <div className="card p-5 sm:p-6">
          <h1 className="text-lg font-bold text-ink">{page.heading}</h1>
          <ul className="mt-4 space-y-3">
            {page.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm text-body">
                <Check size={15} className="mt-0.5 shrink-0 text-brand" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-ink">{page.formHeading}</h2>

          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {page.fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={`up-${field.name}`}
                  className="mb-1.5 block text-sm font-semibold text-ink"
                >
                  {field.label}
                  {field.required && <span className="text-accent"> *</span>}
                </label>

                {field.type === 'file' ? (
                  <>
                    <input
                      id={`up-${field.name}`}
                      type="file"
                      accept="image/*,.pdf"
                      required={field.required}
                      onChange={(e) => {
                        setFileName(e.target.files?.[0]?.name || '');
                        setSent(false);
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm file:mr-3 file:rounded file:border-0 file:bg-brand-light file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand outline-none focus:border-brand"
                    />
                    {fileName && (
                      <p className="mt-1.5 text-xs text-body">Selected: {fileName}</p>
                    )}
                  </>
                ) : (
                  <input
                    id={`up-${field.name}`}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    onChange={() => setSent(false)}
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                  />
                )}
              </div>
            ))}

            <button type="submit" className="btn-brand w-full">
              {page.button}
            </button>

            {sent && (
              <p className="rounded-lg bg-brand-light px-3 py-2 text-sm text-brand" role="status">
                Prescription recorded. (Demo only — no file was uploaded, as no backend is
                connected.)
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
