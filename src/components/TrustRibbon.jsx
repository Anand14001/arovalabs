import { trustMarquee } from '../data/homepage';

/*
 * The trust claims, as a teal ribbon across the very top of every page —
 * above the navigation, where an announcement bar normally sits.
 *
 * On the reference site this bar is `position: sticky; top: 0`, which is the
 * same edge the sticky site header already owns. The header is opaque and
 * painted above it, so the ribbon disappears underneath it the instant it pins:
 * sticky in name only. Put at the top of the document instead, it is the first
 * thing read and it scrolls away cleanly when the header takes over the edge.
 *
 * The track is rendered twice because the keyframe translates -50%; the second
 * copy is what lands on a seam-free frame at the loop point, and it is
 * aria-hidden so each claim is announced once.
 */
export default function TrustRibbon() {
  const items = [...trustMarquee.items, ...trustMarquee.items];

  return (
    <div
      className="band-brand overflow-hidden py-2.5"
      aria-label="Why patients choose us"
    >
      <div className="marquee" style={{ '--marquee-duration': '55s' }}>
        {[0, 1].map((copy) => (
          <div className="flex shrink-0" key={copy} aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <span className="trust-item text-white" key={`${item}-${i}`}>
                {item}
                <svg className="trust-star" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
