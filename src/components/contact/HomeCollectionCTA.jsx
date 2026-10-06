import { ArrowRight, ArrowUpRight, Check, ClipboardList, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { homeCollection } from '../../data/homepage';
import { contact } from '../../data/site';
import Reveal, { RevealGroup, RevealItem } from '../motion/Reveal';

export default function HomeCollectionCTA() {
  return (
    <section className="home-collection" aria-labelledby="home-collection-title">
      <div className="home-collection__glow" aria-hidden="true" />
      <div className="home-collection__hero">
        <div className="home-collection__copy">
          <Reveal>
            <h2 id="home-collection-title" className="home-collection__title">
              Your tests.<br />Our care. <span>At your home.</span>
            </h2>
            <p className="home-collection__intro">{homeCollection.sub}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <a className="home-collection__phone" href={`tel:${contact.homeCollection.tel}`}>
              <span className="home-collection__phone-icon"><Phone size={23} /></span>
              <span><strong>{contact.homeCollection.label}</strong><small>Call for home collection</small></span>
            </a>
            <div className="home-collection__actions">
              <a className="home-collection__button home-collection__button--primary" href={`tel:${contact.homeCollection.tel}`}>
                <Phone size={17} /> Book via Call
              </a>
              <a className="home-collection__button home-collection__button--outline" href={contact.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Book on WhatsApp <ArrowUpRight size={17} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="home-collection__benefits" aria-label="Home collection details">
              <span><ShieldCheck /><span>Trained<br />phlebotomists</span></span>
              <span><Check /><span>Safe &amp; hygienic<br />sample collection</span></span>
              <span><ClipboardList /><span>Reports on<br />WhatsApp</span></span>
            </div>
          </Reveal>
        </div>

        <Reveal className="home-collection__visual" delay={0.12} y={24}>
          <div className="home-collection__halo" aria-hidden="true" />
          <div className="home-collection__frame">
            <img className="home-collection__photo" src="/assets/homecollectionbanner.webp" alt="A phlebotomist collecting a patient's sample at home" />
          </div>
          <div className="home-collection__frame-accent" aria-hidden="true" />
        </Reveal>
      </div>

      <Reveal className="home-collection__steps-wrap" delay={0.12} y={20}>
        <RevealGroup as="ol" stagger={0.07} className="home-collection__steps">
          {homeCollection.steps.map((step, index) => {
            const titles = ['Choose your test', 'Pick a date & time', 'We collect at your home', 'Get your reports'];
            const descriptions = [
              'Select a test available for home collection.',
              'Choose your preferred date and time slot.',
              'Our trained phlebotomist visits at the scheduled time.',
              'Receive your test reports on WhatsApp.',
            ];
            return (
              <RevealItem as="li" key={step.title} className="home-collection__step">
                <span className="home-collection__step-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="home-collection__step-copy">
                  <strong>{titles[index]}</strong>
                  <small>{descriptions[index]}</small>
                </span>
                {index < homeCollection.steps.length - 1 && <ArrowRight className="home-collection__connector" size={19} aria-hidden="true" />}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Reveal>
    </section>
  );
}
