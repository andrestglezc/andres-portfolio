'use client';

import { useT } from '@/lib/strings';

export default function Shrine() {
  const t = useT();
  return (
    <div className="shrine app-scroll">
      <div className="candle" aria-hidden="true">
        <span className="flame" />
        <span className="wick" />
        <span className="wax" />
      </div>
      <h2>O’Malley</h2>
      <p className="shrine-years">2010 — 2026</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/omalley.jpg" alt={t('shrine.alt')} loading="lazy" decoding="async" width={190} height={190} />
      <p className="shrine-text">{t('shrine.p1')}</p>
      <p className="shrine-text">{t('shrine.p2')}</p>
      <p className="shrine-text">{t('shrine.p3')}</p>
    </div>
  );
}
