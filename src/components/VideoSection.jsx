import { Play } from 'lucide-react';
import { videoSection } from '../data/homepage';
import SectionHeading from './SectionHeading';

/*
 * "See Arova in Action". On the reference site all five cards share one image,
 * one duration and one description, and no real video source exists — the
 * "Watch Video" buttons point at "#". Preserved as-is.
 */
export default function VideoSection() {
  return (
    <section className="section bg-slate-50">
      <div className="shell">
        <SectionHeading heading={videoSection.heading} sub={videoSection.sub} align="center" />

        <div className="mt-8 rail" role="list">
          {videoSection.videos.map((video, i) => (
            <article key={i} role="listitem" className="card flex w-[clamp(16rem,20vw,22rem)] flex-col overflow-hidden">
              <div className="relative aspect-video bg-slate-200">
                <img src={video.image} alt="" loading="lazy" className="size-full object-cover" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-12 place-items-center rounded-full bg-white/90 text-brand">
                    <Play size={20} fill="currentColor" />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {video.duration}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-ink">{video.title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-body">{video.text}</p>
                <a href={video.to} className="mt-3 inline-block text-sm font-semibold text-brand">
                  {video.cta}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a href={videoSection.cta.to} className="btn-outline">
            {videoSection.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
