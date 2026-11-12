'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useOS } from './store';
import { APPS, AppId, appTitle } from './apps';
import Icon from './Icon';
import HeroTitle from './HeroTitle';
import CardArt from '@/apps/CardArt';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

const centerOf = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

// Labelled with the app's title (README.txt, Resume.pdf, System…).
const SHORTCUTS: { app: AppId; side: 'left' | 'right' }[] = [
  { app: 'readme', side: 'left' },
  { app: 'resume', side: 'left' },
  { app: 'system', side: 'left' },
  { app: 'now', side: 'left' },
  { app: 'arcade', side: 'right' },
  { app: 'shrine', side: 'right' },
];

export default function Desktop() {
  const open = useOS((s) => s.open);
  const noteOpen = useOS((s) => s.noteOpen);
  // Fully hidden behind a maximized window: nothing here should take keyboard focus.
  const hidden = useOS((s) => s.windows.some((w) => w.maximized && !w.minimized));
  const reduce = useReducedMotion();
  const t = useT();
  const { caseStudies, featuredOrder, profile, readme } = useContent();
  const n = featuredOrder.length;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <main className="desktop" inert={hidden || undefined}>
      {/* The wallpaper is the landing page: headline first, work one click away. */}
      <div className="hero">
        <motion.p className="hero-eyebrow" {...rise(0.05)}>
          {profile.name} · {profile.title}
        </motion.p>
        <motion.div {...rise(0.12)}>
          <HeroTitle />
        </motion.div>
        <motion.p className="hero-serif" {...rise(0.2)}>
          {t('hero.serif1', { years: profile.years })}
          <br />
          {t('hero.serif2')}
        </motion.p>
      </div>

      {(['left', 'right'] as const).map((side) => (
        <ul key={side} className={`shortcuts shortcuts--${side}`}>
          {SHORTCUTS.filter((s) => s.side === side).map((s, i) => (
            <motion.li key={s.app} {...rise(0.3 + i * 0.06)}>
              <button type="button" className="shortcut" onClick={(e) => open(s.app, { origin: centerOf(e.currentTarget) })}>
                <span className="shortcut-face" style={{ background: APPS[s.app].tint }}>
                  <Icon name={APPS[s.app].icon} size={26} />
                </span>
                <span className="shortcut-label">{appTitle(s.app, t)}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      ))}

      {/* The small note is a preview: clicking it enlarges the same note (see Note.tsx). */}
      <motion.button
        type="button"
        className="sticky"
        onClick={() => open('readme')}
        aria-haspopup="dialog"
        initial={reduce ? false : { opacity: 0, y: -30, rotate: 10 }}
        animate={{ opacity: noteOpen ? 0 : 1, y: 0, rotate: 3 }}
        whileHover={reduce ? undefined : { rotate: 0, scale: 1.04 }}
        transition={{ delay: reduce ? 0 : 0.7, type: 'spring', stiffness: 200, damping: 14 }}
      >
        <strong>{readme.greeting}</strong>
        <span>{t('sticky.body')}</span>
        <em>{t('sticky.more')}</em>
      </motion.button>

      {/* Case studies fanned like a hand of cards. */}
      <ul className="fan" aria-label={t('common.caseStudies')}>
        {featuredOrder.map((key, i) => {
          const cs = caseStudies[key];
          const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1; // -1 … 1 across the fan
          return (
            <motion.li
              key={key}
              className="fan-slot"
              style={{ '--t': t, '--i': i } as React.CSSProperties}
              initial={reduce ? false : { opacity: 0, y: 220 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05, type: 'spring', stiffness: 170, damping: 20 }}
            >
              <button
                type="button"
                className="fan-card"
                onClick={(e) => open('case', { study: key, origin: centerOf(e.currentTarget) })}
              >
                <CardArt art={cs.art} />
                <span className="fan-meta">
                  <span className="fan-name">{cs.name}</span>
                  <span className="fan-kicker">{cs.kicker}</span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </main>
  );
}
