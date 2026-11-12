'use client';

import { useState } from 'react';
import Icon from '@/os/Icon';
import { useClock } from '@/os/hooks';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

export default function Contact() {
  const t = useT();
  const { profile, contactNote } = useContent();
  const clock = useClock(profile.timeZone);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto button still works */
    }
  };

  return (
    <div className="app-scroll contact">
      <h2 className="display display--sm">{t('common.sayHi')}</h2>
      {contactNote.map((p) => (
        <p key={p} className="contact-note">{p}</p>
      ))}

      <div className="contact-email">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <button type="button" className="btn btn--sm" onClick={copy} aria-live="polite">
          <Icon name={copied ? 'check' : 'note'} size={14} /> {t(copied ? 'contact.copied' : 'contact.copy')}
        </button>
      </div>

      <div className="contact-actions">
        <a className="btn btn--accent" href={`mailto:${profile.email}`}>
          <Icon name="mail" size={16} /> {t('contact.write')}
        </a>
        <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
          <Icon name="linkedin" size={16} /> LinkedIn
        </a>
      </div>

      <dl className="facts facts--row">
        <div><dt>{t('contact.basedIn')}</dt><dd>{profile.location}</dd></div>
        <div><dt>{t('clock.localTime')}</dt><dd>{clock || '—'}</dd></div>
        <div><dt>{t('contact.working')}</dt><dd>{t('contact.remote')}</dd></div>
      </dl>
      <p className="signature">— Andrés</p>
    </div>
  );
}
