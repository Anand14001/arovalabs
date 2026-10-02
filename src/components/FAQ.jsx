import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

/*
 * FAQ accordion (".faq-item / .faq-question / .faq-answer-content" on the
 * reference site). Questions are numbered "1." onwards and only one panel is
 * open at a time.
 */
export default function FAQ({ items, heading = 'FAQ', className = '' }) {
  const [open, setOpen] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <section className={`section ${className}`}>
      <div className="shell">
        {heading && <h2 className="section-title mb-6">{heading}</h2>}

        <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={`${item.q}-${i}`}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:px-5"
                  >
                    <span className="flex items-start gap-2.5">
                      <span className="text-sm font-bold text-brand">{i + 1}.</span>
                      <span className="text-sm font-semibold text-ink">{item.q}</span>
                    </span>
                    <span className="mt-0.5 shrink-0 text-brand">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={`faq-panel-${i}`}
                    className="px-4 pb-4 pl-11 text-sm leading-relaxed text-body sm:px-5 sm:pl-12"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
