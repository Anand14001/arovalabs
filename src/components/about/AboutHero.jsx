import { ArrowDown, ArrowRight } from 'lucide-react';
import { aboutHero } from '../../data/about';
import Reveal from '../motion/Reveal';

/*
 * The About opening.
 *
 * A centred statement of intent, and nothing else. The Arova Advantage figures
 * were banded here at first; they now sit with the Advantage heading they
 * belong to, further down the page, so the opening carries one idea rather than
 * a headline and a specification sheet at the same time.
 *
 * On the two call-to-action buttons: the reference site points both of them at
 * "#", so neither does anything. Rather than render two dead buttons or delete
 * content, they are wired to the sections of this page that answer them — the
 * founder's story and the laboratories. Same labels, now functional, and Lenis
 * carries the jump with the page's own easing.
 */

// The reference's own labels, matched to the sections that answer them.
const CTA_TARGETS = ['#story', '#locations'];

export default function AboutHero() {
  return (
    <section className="border-b border-ink/10">
      <div className="shell pb-14 pt-16 sm:pb-16 sm:pt-24">
        {/*
          Centred on one axis. Each block keeps its own measure — the headline
          runs wider than the standfirst beneath it — so the centring is on the
          column rather than forced through a single shared width, which would
          stretch the paragraph past a comfortable line length.
        */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="label-section mb-7 justify-center text-ink/35">About Us</p>
          <h1 className="display-lg">{aboutHero.heading}</h1>
          <p className="section-sub mx-auto max-w-2xl text-base">{aboutHero.text}</p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {aboutHero.ctas.map((cta, i) => (
            <a
              key={cta.label}
              href={CTA_TARGETS[i] ?? cta.to}
              className={i === 0 ? 'btn-brand group' : 'btn-outline group'}
            >
              {cta.label}
              {i === 0 ? (
                <ArrowDown
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              ) : (
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </a>
          ))}
        </Reveal>
      </div>

    </section>
  );
}
