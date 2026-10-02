import { Link } from 'react-router-dom';
import { FileUp, MessageCircle, PhoneCall } from 'lucide-react';
import { quickActions } from '../data/homepage';

const icons = {
  whatsapp: MessageCircle,
  call: PhoneCall,
  prescription: FileUp,
};

// Three action tiles sitting directly under the hero on the reference site.
export default function QuickActions() {
  return (
    <section className="section">
      <div className="shell grid gap-4 sm:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = icons[action.key];

          const body = (
            <>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
                <Icon size={20} />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{action.title}</span>
                <span className="block text-xs text-body">{action.text}</span>
              </span>
            </>
          );

          const classes =
            'card flex items-center gap-4 p-5 transition-colors hover:border-brand hover:bg-brand-light/40';

          return action.external ? (
            <a
              key={action.key}
              href={action.href}
              target={action.href.startsWith('http') ? '_blank' : undefined}
              rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
              className={classes}
            >
              {body}
            </a>
          ) : (
            <Link key={action.key} to={action.href} className={classes}>
              {body}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
