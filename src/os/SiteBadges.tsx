'use client';

import { useEffect, useState } from 'react';
import { dateLocale, useLang } from '@/lib/i18n';
import { useT } from '@/lib/strings';

const COUNTED_KEY = 'nos-counted';
const LAST_UPDATED = process.env.NEXT_PUBLIC_LAST_UPDATED;

let visit: Promise<number | null> | null = null;

/** Counts this visit once per browser session and resolves to the total. Safe to call from several places. */
export function visitCount(): Promise<number | null> {
  return (visit ??= (() => {
    let counted = false;
    try {
      counted = sessionStorage.getItem(COUNTED_KEY) === '1';
      sessionStorage.setItem(COUNTED_KEY, '1');
    } catch {
      /* storage unavailable: read only, so a reload loop cannot inflate the number */
      counted = true;
    }
    return fetch('/api/visits', { method: counted ? 'GET' : 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { count?: number | null } | null) => (typeof d?.count === 'number' ? d.count : null))
      .catch(() => null);
  })());
}

/** The two classic footer details of a 90s home page: a hit counter and a "last updated" line. */
export default function SiteBadges() {
  const [count, setCount] = useState<number | null>(null);
  const t = useT();
  const lang = useLang();

  useEffect(() => {
    let live = true;
    visitCount().then((n) => live && n !== null && setCount(n));
    return () => {
      live = false;
    };
  }, []);

  const updated = LAST_UPDATED
    ? new Date(LAST_UPDATED).toLocaleDateString(dateLocale(lang), { day: 'numeric', month: 'short', year: 'numeric' })
    : null;
  if (count === null && !updated) return null;

  return (
    <div className="badges">
      {count !== null && (
        <p className="badge">
          <span className="badge-label">{t('badges.visitor')}</span>
          <span className="odometer" role="img" aria-label={t('badges.number', { n: count })}>
            {String(count).padStart(6, '0').split('').map((d, i) => (
              <span key={i} aria-hidden="true">{d}</span>
            ))}
          </span>
        </p>
      )}
      {updated && (
        <p className="badge">
          <span className="badge-label">{t('badges.updated')}</span>
          <time dateTime={LAST_UPDATED}>{updated}</time>
        </p>
      )}
    </div>
  );
}
