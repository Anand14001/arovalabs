import { trustMarquee } from '../data/homepage';

function Star() {
  return (
    <svg className="custom-trust-star" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

/*
 * Sticky scrolling trust bar directly under the hero.
 *
 * Reproduces the reference site's `.custom-trust-marquee` HTML widget: a 40px
 * sticky teal (#2B7E83) bar whose track scrolls -50% over 35s on a linear
 * infinite loop and pauses on hover, with #EF8A06 stars between items. The item
 * list is duplicated so the loop is seamless.
 */
export default function TrustMarquee() {
  const loop = [...trustMarquee.items, ...trustMarquee.items];

  return (
    <div className="custom-trust-marquee">
      <div className="custom-trust-track">
        {/* Two identical blocks so translateX(-50%) lands on a seam-free frame. */}
        {[0, 1].map((block) => (
          <div className="custom-trust-content" key={block} aria-hidden={block === 1}>
            {loop.map((item, i) => (
              <span className="trust-item" key={`${item}-${i}`}>
                {item}
                <Star />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
