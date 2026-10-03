import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { quickActions } from '../data/homepage';
import { RevealGroup, RevealItem } from './motion/Reveal';

/*
 * The three ways to book.
 *
 * Not three cards. Three full-width rows, each one a target the width of the
 * page, set in display type and separated by hairlines — the same pattern a
 * menu or an index uses, which is exactly what this is. It gives the booking
 * actions more presence than a card grid ever would while taking less visual
 * machinery to do it, and it lets the booking actions sit directly on the page
 * rather than inside yet another boxed panel.
 *
 * The hover state moves the whole row rather than tinting it: rows this large
 * don't need a background change to feel live.
 */
export default function QuickActions() {
  return (
    <section className="section">
      <div className="shell">
        <RevealGroup as="ul" stagger={0.08} className="border-b border-ink/10">
          {quickActions.map((action, i) => {
            const body = (
              <>
                <span className="label w-10 shrink-0 text-ink/30">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:flex sm:items-baseline sm:gap-8">
                  <span className="display-md block text-ink sm:w-[clamp(14rem,24vw,24rem)] sm:shrink-0">
                    {action.title}
                  </span>
                  <span className="mt-1.5 block text-[15px] text-body sm:mt-0">
                    {action.text}
                  </span>
                </span>

                <span className="grid size-11 shrink-0 place-items-center rounded-full text-ink/40 ring-1 ring-inset ring-ink/12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-accent group-hover:text-white group-hover:ring-accent sm:size-14">
                  <ArrowUpRight size={20} strokeWidth={1.75} />
                </span>
              </>
            );

            const classes =
              'group flex items-center gap-5 border-t border-ink/10 py-7 sm:gap-8 sm:py-9';

            return (
              <RevealItem as="li" key={action.key} y={14}>
                {action.external ? (
                  <a
                    href={action.href}
                    target={action.href.startsWith('http') ? '_blank' : undefined}
                    rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
                    className={classes}
                  >
                    {body}
                  </a>
                ) : (
                  <Link to={action.href} className={classes}>
                    {body}
                  </Link>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
