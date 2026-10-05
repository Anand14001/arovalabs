import { ArrowRight } from 'lucide-react';
import { videoSection } from '../data/homepage';
import Reveal, { RevealGroup, RevealItem } from './motion/Reveal';

/*
 * "See Arova in Action".
 *
 * On the reference site all five cards carry the same image, the same duration
 * and the same description, and the "Watch Video" buttons point at "#" — there
 * is no video source. All of that is preserved. What changes is that five
 * identical cards in a row make the repetition the loudest thing on the page.
 *
 * So the layout supplies the hierarchy the content won't: a bento grid where
 * the lead item takes a tall two-row cell and the rest fill around it at two
 * smaller sizes. Identical thumbnails at varied sizes read as a gallery;
 * identical thumbnails at one size read as a bug.
 *
 * No play badge is drawn — the supplied thumbnail already has one baked into
 * the artwork, and a second overlaid button lands straight on top of it.
 */
export default function VideoSection() {
  const [feature, ...rest] = videoSection.videos;

  return (
    <section className="section-lg band-wash">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <div className="max-w-xl">
            <p className="label-section mb-6 text-ink/35">
              <span className="label-num">09</span>
              Inside the lab
            </p>
            <h2 className="display-lg">{videoSection.heading}</h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-body">{videoSection.sub}</p>
        </Reveal>

        {/*
          Bento: the feature spans both rows on the left, two medium tiles take
          the top right, and two compact tiles close the bottom row.
        */}
        <RevealGroup
          stagger={0.08}
          className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-2 lg:gap-5"
        >
          <RevealItem y={22} className="md:row-span-2">
            <VideoTile video={feature} size="feature" />
          </RevealItem>

          {rest.map((video, i) => (
            <RevealItem key={`${video.title}-${i}`} y={16}>
              <VideoTile video={video} size={i < 2 ? 'medium' : 'compact'} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 flex justify-center">
          <a href={videoSection.cta.to} className="btn-outline group">
            {videoSection.cta.label}
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/*
 * One tile at three scales. Only the crop and the type size differ, so the set
 * still reads as one family rather than three unrelated components.
 */
function VideoTile({ video, size = 'medium' }) {
  const feature = size === 'feature';
  const compact = size === 'compact';

  return (
    <a
      href={video.to}
      aria-label={`${video.cta}: ${video.title}`}
      className="card card-interactive group flex h-full flex-col overflow-hidden"
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-brand-light ${
          feature
            ? 'aspect-[4/3] md:aspect-auto md:min-h-0 md:flex-1'
            : compact
              ? 'aspect-[16/10]'
              : 'aspect-[16/9]'
        }`}
      >
        <img
          src={video.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />

        <span
          aria-hidden="true"
          className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15"
        />

        <span className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
          {video.duration}
        </span>
      </div>

      <div className={`flex shrink-0 flex-col ${feature ? 'p-7' : 'p-5'}`}>
        <h3
          className={`leading-snug text-ink transition-colors group-hover:text-brand ${
            feature ? 'display-md' : 'text-[15px] font-semibold'
          }`}
        >
          {video.title}
        </h3>

        {!compact && (
          <p
            className={`mt-2.5 leading-relaxed text-body ${
              feature ? 'max-w-sm text-sm' : 'text-[13px]'
            }`}
          >
            {video.text}
          </p>
        )}

        <span className="link-arrow mt-4">
          {video.cta}
          {/* The whole tile is the link, so the arrow follows the group. */}
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </a>
  );
}
