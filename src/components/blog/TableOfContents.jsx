import { useEffect, useState } from 'react';

/*
 * The contents rail.
 *
 * Built from the article's own headings, with the entry for the section
 * currently on screen marked by an accent rule — the same affordance the navbar
 * and the catalogue filters use, so "you are here" means one thing across the
 * site.
 *
 * Scroll-spy is an IntersectionObserver with a top-heavy root margin rather
 * than a scroll handler: the observer fires only when a heading actually
 * crosses the line, where a handler would run on every frame Lenis produces.
 *
 * Links are plain anchors, so Lenis' anchor handling carries the jump with the
 * page's own easing, and the headings carry `scroll-mt` so they clear the
 * sticky header on arrival.
 */
export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        // Among everything currently intersecting, the highest one wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Watches a band just under the header, so a heading becomes "current"
      // as it reaches reading position rather than as it enters the viewport.
      { rootMargin: '-120px 0px -65% 0px', threshold: 0 },
    );

    const nodes = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean);

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="label mb-5 text-ink/35">On this page</p>

      <ul className="space-y-1">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? 'true' : undefined}
                className={`group flex items-start gap-3 py-1.5 text-[13.5px] leading-snug transition-colors ${
                  active ? 'text-brand' : 'text-body hover:text-ink'
                } ${heading.level === 3 ? 'pl-4' : ''}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-2 h-px shrink-0 bg-accent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active ? 'w-4' : 'w-0 group-hover:w-4'
                  }`}
                />
                <span className={active ? 'font-semibold' : ''}>{heading.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
