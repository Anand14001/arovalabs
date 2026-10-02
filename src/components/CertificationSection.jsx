import { certification } from '../data/homepage';

// "Certified Quality Assurance" — accreditation badges plus the team photo.
export default function CertificationSection() {
  return (
    <section className="section bg-slate-50">
      <div className="shell">
        <h2 className="section-title text-center">{certification.heading}</h2>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          <ul className="grid gap-4">
            {certification.badges.map((badge) => (
              <li key={badge.title} className="card flex items-start gap-4 p-5">
                <img src={badge.icon} alt="" loading="lazy" className="size-12 shrink-0" />
                <h3 className="text-sm font-semibold leading-snug text-ink">{badge.title}</h3>
              </li>
            ))}
          </ul>

          <figure className="card overflow-hidden">
            <img
              src={certification.image}
              alt=""
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
            <figcaption className="p-5">
              <h3 className="text-sm font-bold text-ink">{certification.imageHeading}</h3>
            </figcaption>
          </figure>
        </div>

        <p className="measure mt-6 text-sm leading-relaxed text-body">{certification.body}</p>
      </div>
    </section>
  );
}
