import {
  ArrowUpRight,
  Award,
  Building2,
  FlaskConical,
  Heart,
  Package,
  TestTubeDiagonal,
  UsersRound,
  CarFront,
} from 'lucide-react';
import { whyChoose } from '../data/homepage';
import Counter from './Counter';
import Reveal, { RevealGroup, RevealItem } from './motion/Reveal';
import './Statistics.css';

const featureIcons = [FlaskConical, UsersRound, Heart];
const featureTones = ['accent', 'brand', 'soft'];
const metricIcons = [Award, TestTubeDiagonal, Package, Building2, CarFront];
const reachMetrics = [
  whyChoose.awardCounters[0],
  whyChoose.awardCounters[1],
  whyChoose.awardCounters[2],
  whyChoose.counters[3],
  whyChoose.counters[4],
];

export default function Statistics() {
  return (
    <section className="why-choose section-lg" aria-labelledby="why-choose-title">
      <div className="shell">
        <div className="why-choose__hero">
          <Reveal className="why-choose__intro">
            <h2 id="why-choose-title" className="why-choose__title">
              Why Choose <span>Arova labs?</span>
            </h2>
            <p className="why-choose__sub">{whyChoose.sub}</p>
          </Reveal>

          <Reveal className="why-choose__visual" y={28}>
            <div className="why-choose__dots" aria-hidden="true" />
            <img
              src="/assets/919397855f803d31f1d4.webp"
              alt="A laboratory technician working with diagnostic equipment"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>

        <RevealGroup as="ul" stagger={0.09} className="why-choose__features">
          {whyChoose.counters.slice(0, 3).map((metric, index) => {
            const Icon = featureIcons[index];
            return (
              <RevealItem
                as="li"
                key={metric.label}
                y={18}
                className={`why-choose__feature why-choose__feature--${featureTones[index]}`}
              >
                <span className="why-choose__feature-icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                <ArrowUpRight className="why-choose__feature-arrow" size={19} strokeWidth={1.7} aria-hidden="true" />
                <dl className="why-choose__feature-copy">
                  <dd className="why-choose__feature-value"><Counter value={metric.value} suffix={metric.suffix} /></dd>
                  <dt className="why-choose__feature-label">{metric.label}</dt>
                </dl>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <div className="why-choose__reach">
          <div className="why-choose__reach-heading">
            <span />
            <h3>Our reach &amp; expertise</h3>
            <span />
          </div>
          <RevealGroup as="ul" stagger={0.06} className="why-choose__metrics">
            {reachMetrics.map((metric, index) => {
              const Icon = metricIcons[index];
              return (
                <RevealItem as="li" key={metric.label} y={14} className="why-choose__metric">
                  <span className="why-choose__metric-icon"><Icon size={23} strokeWidth={1.75} aria-hidden="true" /></span>
                  <dl className="why-choose__metric-copy">
                    <dd><Counter value={metric.value} suffix={metric.suffix} /></dd>
                    <dt>{metric.label}</dt>
                  </dl>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
