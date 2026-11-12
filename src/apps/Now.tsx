'use client';

import { appTitle } from '@/os/apps';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

// One colour per section, by position, so it holds in every language.
const TINTS = ['var(--c-cobalt)', 'var(--c-lime)', 'var(--c-pink)', 'var(--c-sun)'];

/** A /now page: what Andrés is building, learning and listening to this month, as cards. */
export function NowSections() {
  const { now } = useContent();
  return (
    <>
      {now.sections.map((s, si) => (
        <section key={si} className="block">
          <h3 className="eyebrow">{s.title}</h3>
          <ul className="now-cards">
            {s.items.map((it, i) => (
              <li key={i} className="now-card">
                <span className="now-card-band" style={{ background: TINTS[si % TINTS.length] }}>
                  <span className="now-card-tag">{s.title}</span>
                  <span className="now-card-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <strong>{it.name}</strong>
                <span className="now-card-note">{it.note}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export default function Now() {
  const t = useT();
  const { now } = useContent();
  return (
    <div className="app-scroll now">
      <header className="app-head">
        <h2 className="display">{appTitle('now', t)}</h2>
        <p className="serif-lead">{now.lead}</p>
        <p className="fineprint">{t('common.updated', { date: now.updated })}</p>
      </header>
      <NowSections />
    </div>
  );
}
