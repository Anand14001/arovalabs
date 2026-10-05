import { Link } from 'react-router-dom';
import { ArrowRight, FileUp, Phone } from 'lucide-react';
import { quickActions } from '../data/homepage';
import { RevealGroup, RevealItem } from './motion/Reveal';
import './QuickActions.css';

const steps = [
  {
    icon: WhatsAppIcon,
    description: 'Instant test confirmation directly on WhatsApp',
    cta: 'Start on WhatsApp',
    tone: 'whatsapp',
  },
  {
    icon: Phone,
    description: 'Talk to our health experts for personalized guidance',
    cta: 'Call now',
    tone: 'call',
  },
  {
    icon: FileUp,
    description: "We'll help identify the tests you need",
    cta: 'Upload now',
    tone: 'upload',
  },
];

function WhatsAppIcon({ size = 29, strokeWidth: _strokeWidth, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.966 1.164-.199.198-.397.223-.694.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.146-.147.52-.608.68-.806.162-.198.216-.33.324-.552.108-.223.054-.412-.027-.561-.08-.15-.676-1.63-.926-2.223-.242-.579-.487-.5-.676-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function QuickActions() {
  return (
    <section className="booking-steps" aria-labelledby="booking-steps-title">
      <div className="shell">
        <header className="booking-steps__header">
          <h2 id="booking-steps-title">Choose the way that works for you</h2>
          <p>Our team is here to make your next step simple.</p>
        </header>

        <div className="booking-steps__track">
          <svg className="booking-steps__connector" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true">
            <path d="M10 46 C110 46 110 12 210 12 S310 80 410 80 S510 12 610 12 S710 80 810 80 S910 46 990 46" />
          </svg>
          <RevealGroup as="ol" stagger={0.1} className="booking-steps__list">
            {quickActions.map((action, index) => {
              const step = steps[index];
              const Icon = step.icon;
              const content = (
                <>
                  <span className="booking-steps__number">{String(index + 1).padStart(2, '0')}</span>
                  <span className={`booking-steps__icon booking-steps__icon--${step.tone}`}>
                    <Icon size={29} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="booking-steps__title">{action.title}</span>
                  <span className="booking-steps__description">{step.description}</span>
                  <span className="booking-steps__cta">
                    {step.cta}<ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </>
              );

              return (
                <RevealItem as="li" key={action.key} y={16} className={`booking-steps__item booking-steps__item--${step.tone}`}>
                  {action.external ? (
                    <a href={action.href} target={action.href.startsWith('http') ? '_blank' : undefined} rel={action.href.startsWith('http') ? 'noreferrer' : undefined} className="booking-steps__link">
                      {content}
                    </a>
                  ) : (
                    <Link to={action.href} className="booking-steps__link">{content}</Link>
                  )}
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
