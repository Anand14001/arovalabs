import { useRef, useState } from 'react';
import { AlertCircle, Check, FileUp, Loader2 } from 'lucide-react';
import { uploadPrescriptionPage as page } from '../data/pages';
import { BASE_URL } from '../lib/api';

/*
 * /upload-prescription/
 *
 * The reference site's version validated a file client-side and then threw it
 * away. This one actually uploads: the prescription lands in private storage
 * and appears in the lab's inbox as a lead they can quote against.
 *
 * The file is checked here for size and obvious type before the request, purely
 * so someone attaching a 40MB video gets told immediately rather than after a
 * long upload. The server checks the bytes regardless — the client's opinion
 * about a file is not trusted.
 */

const MAX_MB = 10;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

export default function UploadPrescription() {
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ patientName: '', phone: '', email: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const pickFile = (chosen) => {
    setError(null);
    setErrors((e) => ({ ...e, file: undefined }));

    if (!chosen) {
      setFile(null);
      return;
    }
    if (chosen.size > MAX_MB * 1024 * 1024) {
      setErrors((e) => ({ ...e, file: `That file is over ${MAX_MB}MB. Try a photo instead.` }));
      setFile(null);
      return;
    }
    // A loose check — some phones report an empty type for HEIC, so an unknown
    // type is allowed through and the server decides on the bytes.
    if (chosen.type && !ACCEPTED.includes(chosen.type)) {
      setErrors((e) => ({ ...e, file: 'Upload a photo (JPG, PNG) or a PDF.' }));
      setFile(null);
      return;
    }
    setFile(chosen);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    if (!file) {
      setErrors({ file: 'Attach a photo or PDF of the prescription.' });
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('patientName', form.patientName);
      body.append('phone', form.phone);
      if (form.email) body.append('email', form.email);
      if (form.notes) body.append('notes', form.notes);

      // No Content-Type header: the browser must set it, because only it knows
      // the multipart boundary.
      const res = await fetch(`${BASE_URL}/api/v1/prescriptions`, { method: 'POST', body });
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        setErrors(payload?.error?.fields ?? {});
        setError(payload?.error?.message ?? 'That did not go through. Please try again.');
        return;
      }

      setDone(payload);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <section className="section">
        <div className="shell-narrow max-w-xl text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-light">
            <Check size={30} className="text-brand" aria-hidden="true" />
          </span>
          <h1 className="display-md mt-5 text-ink">Prescription received</h1>
          <p className="section-sub mx-auto mt-2 max-w-md">{done.message}</p>
          <p className="mt-5 inline-block rounded-full bg-brand-light px-5 py-2 text-sm font-bold tracking-wide text-brand">
            {done.reference}
          </p>
          <p className="mt-6 text-sm text-body">
            Quote this reference if you call us on{' '}
            <a href="tel:9442218998" className="font-semibold text-brand underline">
              9442218998
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="shell-narrow grid gap-6 lg:grid-cols-2">
        {/* Guidance */}
        <div className="card h-fit p-5 sm:p-6">
          <h1 className="text-lg font-bold text-ink">{page.heading}</h1>
          <ul className="mt-4 space-y-3">
            {page.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm text-body">
                <Check size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-ink/10 pt-4 text-xs text-body/70">
            Your prescription is stored privately and seen only by our lab team.
          </p>
        </div>

        {/* Form */}
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-ink">{page.formHeading}</h2>
          <p className="mt-1 text-sm text-body">
            We&rsquo;ll read it and call you with a quote for the tests.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-4 space-y-4" onSubmit={submit} noValidate>
            <div>
              <label htmlFor="rx-file" className="mb-1.5 block text-sm font-semibold text-ink">
                Prescription photo or PDF<span className="text-accent"> *</span>
              </label>
              <input
                id="rx-file"
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                aria-invalid={errors.file ? 'true' : undefined}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition file:mr-3 file:rounded file:border-0 file:bg-brand-light file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand ${
                  errors.file ? 'border-red-400' : 'border-slate-300 focus:border-brand'
                }`}
              />
              {file && !errors.file && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-body">
                  <FileUp size={12} aria-hidden="true" />
                  {file.name} · {(file.size / 1024 / 1024).toFixed(1)}MB
                </p>
              )}
              {errors.file && <p className="mt-1.5 text-xs text-red-600">{errors.file}</p>}
            </div>

            <div>
              <label htmlFor="rx-name" className="mb-1.5 block text-sm font-semibold text-ink">
                Full name<span className="text-accent"> *</span>
              </label>
              <input
                id="rx-name"
                value={form.patientName}
                onChange={(e) => set({ patientName: e.target.value })}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                aria-invalid={errors.patientName ? 'true' : undefined}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none ${
                  errors.patientName ? 'border-red-400' : 'border-slate-300 focus:border-brand'
                }`}
              />
              {errors.patientName && (
                <p className="mt-1.5 text-xs text-red-600">{errors.patientName}</p>
              )}
            </div>

            <div>
              <label htmlFor="rx-phone" className="mb-1.5 block text-sm font-semibold text-ink">
                Phone number<span className="text-accent"> *</span>
              </label>
              <input
                id="rx-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="Enter your phone number"
                autoComplete="tel"
                required
                aria-invalid={errors.phone ? 'true' : undefined}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none ${
                  errors.phone ? 'border-red-400' : 'border-slate-300 focus:border-brand'
                }`}
              />
              {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="rx-email" className="mb-1.5 block text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="rx-email"
                type="email"
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="So we can send the quote in writing"
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="rx-notes" className="mb-1.5 block text-sm font-semibold text-ink">
                Anything we should know?
              </label>
              <textarea
                id="rx-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => set({ notes: e.target.value })}
                className="w-full resize-y rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-brand w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  Uploading…
                </>
              ) : (
                page.button
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
