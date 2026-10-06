import { ArrowDown, ArrowRight, BadgeCheck, CalendarDays, Microscope, Timer } from 'lucide-react';
import { aboutHero, arovaAdvantage } from '../../data/about';
import Reveal, { RevealGroup, RevealItem } from '../motion/Reveal';
import './AboutHero.css';

const CTA_TARGETS = ['#story', '#locations'];
const stats = [
  { value: '25+', label: 'Years of laboratory experience', Icon: CalendarDays },
  { value: arovaAdvantage.items[0].stat, label: arovaAdvantage.items[0].title, Icon: BadgeCheck },
  { value: arovaAdvantage.items[1].stat, label: arovaAdvantage.items[1].title, Icon: Timer },
  { value: arovaAdvantage.items[2].stat, label: arovaAdvantage.items[2].title, Icon: Microscope },
];

export default function AboutHero() {
  const words = aboutHero.heading.split(' ');
  const lead = words.slice(0, 2).join(' ');
  const highlight = words.slice(2).join(' ');

  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero__orb about-hero__orb--left" aria-hidden="true" />
      <div className="about-hero__orb about-hero__orb--image" aria-hidden="true" />
      <div className="shell about-hero__shell">
        <div className="about-hero__layout">
          <Reveal className="about-hero__content">
            <h1 id="about-hero-title" className="about-hero__title">
              <span>{lead}</span>
              <span className="about-hero__highlight">{highlight}</span>
            </h1>
            <p className="about-hero__description">{aboutHero.text}</p>
            <div className="about-hero__actions">
              {aboutHero.ctas.map((cta, index) => (
                <a
                  key={cta.label}
                  href={CTA_TARGETS[index] ?? cta.to}
                  className={`about-hero__button ${index === 0 ? 'about-hero__button--primary' : 'about-hero__button--secondary'}`}
                >
                  {cta.label}
                  {index === 0 ? <ArrowDown size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal className="about-hero__visual" delay={0.12} y={24}>
            <div className="about-hero__visual-backdrop" aria-hidden="true" />
            <img
              className="about-hero__image"
              src="/assets/aboutus-banner.webp"
              alt="Arova Labs technician examining a sample through a microscope"
              fetchPriority="high"
            />
            <div className="about-hero__badge">
              <span className="about-hero__badge-icon"><BadgeCheck size={25} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className="about-hero__badge-copy">
                <strong>{arovaAdvantage.items[0].stat} {arovaAdvantage.items[0].title}</strong>
                <small>Double-verified diagnostic results</small>
              </span>
              <ArrowRight className="about-hero__badge-arrow" size={17} aria-hidden="true" />
            </div>
          </Reveal>
        </div>

        <RevealGroup as="ul" className="about-hero__stats" stagger={0.07}>
          {stats.map(({ value, label, Icon }) => (
            <RevealItem as="li" key={label} className="about-hero__stat">
              <span className="about-hero__stat-icon"><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className="about-hero__stat-copy">
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
