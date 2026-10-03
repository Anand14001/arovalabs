import { ArrowLeft, ArrowRight } from 'lucide-react';

/*
 * Prev/next pair for a rail. Disabled — not hidden — at either end: a control
 * that vanishes costs the user the mental model of where they are in the set.
 */
export default function RailArrows({ onPrev, onNext, atStart, atEnd, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Arrow label="Previous" onClick={onPrev} disabled={atStart}>
        <ArrowLeft size={17} />
      </Arrow>
      <Arrow label="Next" onClick={onNext} disabled={atEnd}>
        <ArrowRight size={17} />
      </Arrow>
    </div>
  );
}

function Arrow({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full text-ink ring-1 ring-inset ring-ink/12 transition-all duration-300 hover:bg-brand hover:text-white hover:ring-brand disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
