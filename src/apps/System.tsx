'use client';

import { Logo } from '@/os/TopBar';
import { OS_NAME, OS_VERSION } from '@/os/apps';
import { THEMES, setTheme, useTheme } from '@/os/hooks';
import { useContent } from '@/lib/useContent';
import { StringKey, useT } from '@/lib/strings';
import SiteBadges from '@/os/SiteBadges';
import { useOS, SAVER_CHOICES } from '@/os/store';
import { SaverThumb } from '@/os/screensavers';

/** [shortcut, what it does]. A shortcut is either literal keys or a string key. */
const KEYS: [keys: string | StringKey, does: StringKey][] = [
  ['⌘K / Ctrl K', 'keys.search'],
  ['Esc', 'keys.esc'],
  ['keys.dblclick', 'keys.maximize'],
  ['keys.altArrows', 'keys.move'],
  ['keys.altShiftArrows', 'keys.resize'],
  ['keys.iconClick', 'keys.snap'],
];
const isKey = (k: string): k is StringKey => k.startsWith('keys.');

export default function System() {
  const t = useT();
  const { profile } = useContent();
  const specs: [StringKey, string][] = [
    ['system.registered', profile.name],
    ['system.org', 'atgc.design'],
    ['system.cpu', 'Nost1 Max'],
    ['system.memory', t('system.memoryValue')],
    ['system.status', t('system.statusValue')],
  ];
  const theme = useTheme();
  const saver = useOS((s) => s.saver);
  const setSaver = useOS((s) => s.setSaver);
  const setPower = useOS((s) => s.setPower);
  return (
    <div className="app-scroll system">
      <div className="system-head">
        <Logo size={52} />
        <div>
          <h2 className="display display--sm">{OS_NAME}</h2>
          <p className="muted">{t('system.version', { v: OS_VERSION })}</p>
        </div>
      </div>

      <dl className="facts">
        {specs.map(([k, v]) => (
          <div key={k}><dt>{t(k)}</dt><dd>{v}</dd></div>
        ))}
      </dl>

      <h3 className="eyebrow">{t('system.theme')}</h3>
      <div className="themes" role="radiogroup" aria-label={t('system.theme')}>
        {THEMES.map((th) => (
          <button key={th.id} type="button" role="radio" aria-checked={theme === th.id} className={theme === th.id ? 'is-current' : ''} onClick={() => setTheme(th.id)}>
            <span className="swatch" style={{ background: th.swatch[0] }}>
              <i style={{ background: th.swatch[1] }} />
            </span>
            {t(`theme.${th.id}`)}
          </button>
        ))}
      </div>

      <h3 className="eyebrow">{t('system.saver')}</h3>
      <div className="savers" role="radiogroup" aria-label={t('system.saver')}>
        {SAVER_CHOICES.map((id) => (
          <button key={id} type="button" role="radio" aria-checked={saver === id} className={saver === id ? 'is-current' : ''} onClick={() => setSaver(id)}>
            {id === 'logo' ? <span className="saver2-thumb savers-logo" aria-hidden="true"><Logo size={22} /></span> : <SaverThumb id={id} />}
            {t(`saver.${id}`)}
          </button>
        ))}
      </div>
      <button type="button" className="btn btn--sm" onClick={() => setPower('sleep')}>
        {t('system.preview')}
      </button>

      <h3 className="eyebrow">{t('system.shortcuts')}</h3>
      <dl className="facts facts--keys">
        {KEYS.map(([k, v]) => (
          <div key={k}><dt><kbd>{isKey(k) ? t(k) : k}</kbd></dt><dd>{t(v)}</dd></div>
        ))}
      </dl>
      <SiteBadges />
      <p className="fineprint">{t('system.credit')}</p>
    </div>
  );
}
