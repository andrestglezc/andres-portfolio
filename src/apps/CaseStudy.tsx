'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import CardArt from './CardArt';
import Icon from '@/os/Icon';
import type { CaseStudyKey } from '@/lib/content';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

/** Case study reader. Used inside a desktop window and as the mobile sheet. */
export default function CaseStudyView({ studyKey }: { studyKey: CaseStudyKey }) {
  const t = useT();
  const cs = useContent().caseStudies[studyKey];
  // On narrow layouts the media leads in a scrollable preview that can be opened to full length.
  const [full, setFull] = useState(false);
  const reduce = useReducedMotion();
  const count = cs.images.length;
  const alt = (i: number) =>
    count > 1 ? t('case.previewN', { title: cs.title, i: i + 1, n: count }) : t('case.preview', { title: cs.title });
  return (
    <article className={`case${count === 0 ? ' case--text' : ''}`}>
      <div className="case-text">
        <div className="case-art">
          <CardArt art={cs.art} />
        </div>
        <p className="eyebrow">{cs.period}</p>
        <h2 className="case-title">{cs.title}</h2>
        <p className="case-role">{cs.role}</p>
        <ul className="chips">
          {cs.tags.map((t) => (
            <li key={t} className="chip">{t}</li>
          ))}
        </ul>
        {cs.sections.map((s) => (
          <section key={s.heading} className="case-section">
            <h3 className="eyebrow">{s.heading}</h3>
            <p>{s.body}</p>
            {s.link && (
              <a className="link" href={s.link.href} target="_blank" rel="noreferrer">
                {s.link.text} <Icon name="arrowUpRight" size={15} />
              </a>
            )}
          </section>
        ))}
        {cs.clients.length > 0 && (
          <section className="case-section">
            <h3 className="eyebrow">{t(cs.clients.length > 1 ? 'case.clients' : 'case.client')}</h3>
            <p>{cs.clients.join(' · ')}</p>
          </section>
        )}
      </div>
      {count > 0 && (
        <div className={`case-media${full ? ' is-open' : ''}`}>
          {cs.images.map((src, i) =>
            src.endsWith('.mp4') ? (
              <video key={src} src={src} autoPlay={!reduce} loop muted playsInline controls aria-label={alt(i)} />
            ) : (
              // Tall scroll canvases (up to ~14000px): plain <img>, lazy, no optimizer.
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={alt(i)} loading="lazy" decoding="async" />
            ),
          )}
          <button type="button" className="case-expand" aria-expanded={full} onClick={() => setFull((f) => !f)}>
            <Icon name={full ? 'shrink' : 'expand'} size={13} /> {t(full ? 'case.collapse' : 'case.full')}
          </button>
        </div>
      )}
    </article>
  );
}
