import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { contactPage } from '../../data/pages';
import { quickActions } from '../../data/homepage';
import { contact } from '../../data/site';
import Reveal, { RevealGroup, RevealItem } from '../motion/Reveal';

/*
 * The direct routes — phone, WhatsApp, email, the main laboratory.
 *
 * Laid out on a descending stagger rather than as a flat row of four equal
 * boxes. Each channel steps down from the one before it, so the eye travels
 * diagonally across the section instead of scanning a straight line and
 * stopping. It costs nothing structurally — the grid is still four columns —
 * and it is the difference between a row of cards and a composition.
 *
 * The stagger collapses below `lg`, where offsetting items vertically only
 * wastes screen height.
 *
 * Every title, qualifier and value here is published by the site: its three
 * contact cards, plus WhatsApp, which the footer lists as a contact route.
 */

const telHref = (value) => `tel:${value.split('-')[0].replace(/[^\d+]/g, '')}`;

// Each channel sits a step lower than the last, drawing a diagonal.
const OFFSETS = ['lg:mt-0', 'lg:mt-10', 'lg:mt-20', 'lg:mt-30'];

export default function ContactChannels() {
  const [whatsapp] = quickActions;
  const [phoneCard, emailCard, visitCard] = contactPage.cards;

  // The standfirst is one question followed by its answer; the question works
  // as the section's headline and the rest as its supporting line.
  const [question, ...rest] = contactPage.sub.split('?');

  const channels = [
    {
      key: 'phone',
      icon: Phone,
      title: phoneCard.title,
      meta: phoneCard.meta,
      value: phoneCard.value,
      href: telHref(phoneCard.value),
    },
    {
      key: 'whatsapp',
      icon: WhatsAppGlyph,
      title: whatsapp.title,
      meta: whatsapp.text,
      value: contact.footerWhatsapp.label,
      href: contact.footerWhatsapp.href,
      external: true,
    },
    {
      key: 'email',
      icon: Mail,
      title: emailCard.title,
      meta: emailCard.meta,
      value: emailCard.value,
      href: `mailto:${emailCard.value}`,
    },
    {
      key: 'visit',
      icon: MapPin,
      title: visitCard.title,
      meta: visitCard.meta,
      value: visitCard.value,
      href: '#locations',
    },
  ];

  return (
    <section className="section-lg rule-top">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="label mb-6 text-ink/35">Reach out</p>
          <h2 className="display-lg">{question}?</h2>
          <p className="section-sub max-w-lg">{rest.join('?').trim()}</p>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.09}
          className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {channels.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <RevealItem as="li" key={channel.key} y={18} className={OFFSETS[i]}>
                <a
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noreferrer' : undefined}
                  className="group block"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-brand-light text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white">
                    <Icon size={19} strokeWidth={1.9} />
                  </span>

                  <span className="mt-6 flex items-center gap-2">
                    <span className="text-base font-semibold text-ink transition-colors duration-300 group-hover:text-brand">
                      {channel.title}
                    </span>
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 text-ink/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                    />
                  </span>

                  <span className="mt-2 block text-[13px] leading-relaxed text-body">
                    {channel.meta}
                  </span>

                  <span className="mt-4 block border-t border-ink/10 pt-4 text-[15px] font-semibold leading-snug text-brand">
                    {channel.value}
                  </span>
                </a>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

function WhatsAppGlyph({ size = 19 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.966 1.164-.199.198-.397.223-.694.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.146-.147.52-.608.68-.806.162-.198.216-.33.324-.552.108-.223.054-.412-.027-.561-.08-.15-.676-1.63-.926-2.223-.242-.579-.487-.5-.676-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
