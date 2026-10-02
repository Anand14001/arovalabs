import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { loginPopup, site } from '../data/site';

// Recreates Elementor popup 631 (the header's "Login & Sign Up" chooser).
export default function LoginPopup({ open, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <img src={site.logo} alt={site.title} className="mx-auto h-11 w-auto" />
          <h2 className="mt-5 text-xl font-bold text-ink sm:text-2xl">{loginPopup.heading}</h2>
          <p className="mt-1 text-sm text-body">{loginPopup.sub}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {loginPopup.options.map((opt) => (
            <div
              key={opt.title}
              className="flex flex-col items-center rounded-xl border border-slate-200 p-5 text-center transition-colors hover:border-brand"
            >
              <img src={opt.icon} alt="" className="size-12" />
              <h3 className="mt-3 text-base font-bold text-ink">{opt.title}</h3>
              <p className="mt-1 flex-1 text-xs text-body">{opt.text}</p>
              <Link to={opt.to} onClick={onClose} className="btn-brand mt-4 w-full">
                {opt.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
