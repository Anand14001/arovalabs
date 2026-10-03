import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * Controller for the homepage's horizontal rails.
 *
 * The scrolling itself stays native (scroll-snap + overflow-x) — that is what
 * keeps trackpads, touch and keyboard working without a line of JS. This hook
 * only adds the chrome around it: arrow buttons that step by exactly one card,
 * disabled states at either end, and a scroll-position bar.
 *
 * Progress is reported as a 0..1 fraction so the indicator can be driven with
 * a transform (`scaleX`) rather than a width, which keeps it off the layout
 * path during scroll.
 */
export default function useRail() {
  const ref = useRef(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, progress: 0 });

  const measure = useCallback(() => {
    const rail = ref.current;
    if (!rail) return;

    const max = rail.scrollWidth - rail.clientWidth;
    // A rail with nothing to scroll shows a full bar and no live arrows.
    if (max <= 1) {
      setState({ atStart: true, atEnd: true, progress: 1 });
      return;
    }

    const left = rail.scrollLeft;
    setState({
      atStart: left <= 1,
      atEnd: left >= max - 1,
      progress: Math.min(Math.max(left / max, 0), 1),
    });
  }, []);

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;

    measure();
    rail.addEventListener('scroll', measure, { passive: true });

    // Card widths are viewport-relative (clamp + vw), so re-measure on resize.
    const observer = new ResizeObserver(measure);
    observer.observe(rail);

    return () => {
      rail.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [measure]);

  const step = useCallback((direction) => {
    const rail = ref.current;
    if (!rail) return;

    const first = rail.firstElementChild;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 16;
    const card = first ? first.getBoundingClientRect().width + gap : 320;

    rail.scrollBy({ left: card * direction, behavior: 'smooth' });
  }, []);

  return { ref, step, ...state };
}
