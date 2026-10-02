import { useEffect, useRef, useState } from 'react';

/*
 * Reproduces Elementor's counter widget: counts from 0 to `value` once the
 * element scrolls into view. The reference site uses data-from-value="0",
 * data-to-value="<n>" and a thousands delimiter of ",".
 */
export default function Counter({ value, suffix = '', prefix = '', duration = 1600 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion: show the final number immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutQuad, matching Elementor's feel.
          const eased = 1 - (1 - progress) * (1 - progress);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {prefix && <span>{prefix}</span>}
      <span>{display.toLocaleString('en-IN')}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
