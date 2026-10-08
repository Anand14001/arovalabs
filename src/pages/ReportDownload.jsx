import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Download, FileText, Loader2, Lock } from 'lucide-react';
import { BASE_URL } from '../lib/api';

/*
 * /report/?token=…
 *
 * Where an emailed or WhatsApped report link lands. The token is the credential
 * — there are no accounts — so this page is careful about three things:
 *
 *   1. It shows what the report is before downloading it, so someone on a phone
 *      knows the link is theirs and worth the data.
 *   2. It never renders the file. The download goes straight to the API, which
 *      serves it as an attachment under a CSP that allows nothing.
 *   3. It says when the link expires, because a link that silently stops
 *      working months later reads as the lab losing someone's results.
 */

const formatSize = (bytes) =>
  !bytes ? null : bytes > 1_000_000
    ? `${(bytes / 1_048_576).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;

export default function ReportDownload() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['report', token],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/v1/reports/${encodeURIComponent(token)}/meta`);
      if (!res.ok) throw new Error('invalid');
      return res.json();
    },
    enabled: Boolean(token),
    retry: false,
  });

  const download = () => {
    setDownloading(true);
    // A plain navigation: the API responds with Content-Disposition:
    // attachment, so the browser saves it rather than rendering it.
    window.location.href = `${BASE_URL}/api/v1/reports/${encodeURIComponent(token)}`;
    setTimeout(() => setDownloading(false), 3000);
  };

  if (!token || isError) {
    return (
      <section className="section">
        <div className="shell-narrow max-w-lg text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-50">
            <AlertCircle size={30} className="text-amber-500" aria-hidden="true" />
          </span>
          <h1 className="display-md mt-5 text-ink">This link isn&rsquo;t valid</h1>
          <p className="section-sub mx-auto mt-2 max-w-md">
            Report links expire for your privacy, and are replaced if a report is
            corrected. Call us and we&rsquo;ll send you a fresh one.
          </p>
          <a href="tel:9442218998" className="btn-brand mt-7 inline-flex">
            Call 9442218998
          </a>
          <Link to="/" className="btn-outline ml-2 mt-7 inline-flex">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="shell py-24 text-center">
        <Loader2 className="mx-auto size-6 animate-spin text-ink/30" aria-label="Loading" />
      </div>
    );
  }

  const report = data.report;
  const expires = new Date(report.expiresAt);
  const daysLeft = Math.max(0, Math.round((expires - Date.now()) / 86_400_000));

  return (
    <section className="section">
      <div className="shell-narrow max-w-lg">
        <div className="card p-6 text-center sm:p-8">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-light">
            <FileText size={30} className="text-brand" aria-hidden="true" />
          </span>

          <h1 className="display-md mt-5 text-ink">Your report is ready</h1>

          <dl className="mt-6 space-y-2 text-left">
            <div className="flex justify-between gap-4 border-b border-ink/10 pb-2">
              <dt className="text-sm text-body">Report</dt>
              <dd className="text-sm font-semibold text-ink">{report.title}</dd>
            </div>
            {report.patientName && (
              <div className="flex justify-between gap-4 border-b border-ink/10 pb-2">
                <dt className="text-sm text-body">Patient</dt>
                <dd className="text-sm font-semibold text-ink">{report.patientName}</dd>
              </div>
            )}
            {report.orderNumber && (
              <div className="flex justify-between gap-4 border-b border-ink/10 pb-2">
                <dt className="text-sm text-body">Booking</dt>
                <dd className="stat-figure text-sm text-ink">{report.orderNumber}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-sm text-body">Size</dt>
              <dd className="text-sm text-ink">{formatSize(report.sizeBytes) ?? '—'}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={download}
            disabled={downloading}
            className="btn-brand mt-7 w-full justify-center disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                Starting download…
              </>
            ) : (
              <>
                <Download size={16} aria-hidden="true" />
                Download report
              </>
            )}
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-body/70">
            <Lock size={12} className="text-brand" aria-hidden="true" />
            This link is personal to you — please don&rsquo;t forward it.
          </p>
          <p className="mt-1 text-xs text-body/70">
            {daysLeft > 0
              ? `It works for another ${daysLeft} day${daysLeft === 1 ? '' : 's'}.`
              : 'It expires today.'}
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-body">
          Questions about your results? Call{' '}
          <a href="tel:9442218998" className="font-semibold text-brand underline">
            9442218998
          </a>{' '}
          — we offer a free consultation on every report.
        </p>
      </div>
    </section>
  );
}
