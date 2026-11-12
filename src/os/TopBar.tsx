'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOS, selectActiveId } from './store';
import { OS_NAME, appTitle } from './apps';
import { useClock, useDismiss, usePlace } from './hooks';
import { useWinTitle } from './titles';
import ClockPanel, { cityLabel } from './ClockPanel';
import Icon, { IconName } from './Icon';
import LangToggle from './LangToggle';
import { useContent } from '@/lib/useContent';
import { useLang } from '@/lib/i18n';
import { useT } from '@/lib/strings';

export function Logo({ size = 22 }: { size?: number }) {
  // Four tiles: a nod to the old flag, redrawn as the OS mark.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="logo">
      <rect x="2" y="2" width="9" height="9" rx="2.5" fill="var(--c-tomato)" />
      <rect x="13" y="2" width="9" height="9" rx="4.5" fill="var(--c-lime)" />
      <rect x="2" y="13" width="9" height="9" rx="4.5" fill="var(--c-cobalt)" />
      <rect x="13" y="13" width="9" height="9" rx="2.5" fill="var(--c-sun)" />
    </svg>
  );
}

export default function TopBar({ onRestart }: { onRestart: () => void }) {
  const t = useT();
  const lang = useLang();
  const { mascot, profile } = useContent();
  const winTitle = useWinTitle();
  const open = useOS((s) => s.open);
  const setPalette = useOS((s) => s.setPalette);
  const setPower = useOS((s) => s.setPower);
  const setRecruiter = useOS((s) => s.setRecruiter);
  const muted = useOS((s) => s.muted);
  const setMuted = useOS((s) => s.setMuted);
  const mascotOn = useOS((s) => s.mascotOn);
  const setMascot = useOS((s) => s.setMascot);
  // Primitives only, so dragging a window does not re-render the bar.
  const activeApp = useOS((s) => {
    const id = selectActiveId(s);
    return id ? s.windows.find((w) => w.id === id)?.app ?? null : null;
  });
  const activeStudy = useOS((s) => {
    const id = selectActiveId(s);
    return id ? s.windows.find((w) => w.id === id)?.study : undefined;
  });
  const activeTitle = activeApp ? winTitle({ app: activeApp, study: activeStudy }) : null;
  // The clock follows the visitor: their zone, named after its city.
  const place = usePlace(profile.timeZone);
  const clock = useClock(place.timeZone);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [cal, setCal] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  useDismiss(menuRef, menu, () => {
    if (menuRef.current?.contains(document.activeElement)) menuBtnRef.current?.focus();
    setMenu(false);
  });
  const calBtnRef = useRef<HTMLButtonElement>(null);
  useDismiss(calRef, cal, () => {
    if (calRef.current?.contains(document.activeElement)) calBtnRef.current?.focus();
    setCal(false);
  });
  // Anything that covers the bar (search, sleep, shut down) closes its popovers.
  useEffect(
    () =>
      useOS.subscribe((s) => {
        if (s.paletteOpen || s.power !== 'on') {
          setMenu(false);
          setCal(false);
        }
      }),
    [],
  );

  const chime = (name: 'playSleepChime' | 'playShutdownChime') => import('@/lib/audio').then((m) => m[name]());

  const items: { id: string; label: string; icon: IconName; run: () => void; sep?: boolean }[] = [
    { id: 'about', label: t('topbar.aboutOs', { os: OS_NAME }), icon: 'info', run: () => open('system') },
    { id: 'readme', label: appTitle('readme', t), icon: 'note', run: () => open('readme') },
    { id: 'search', label: t('topbar.search'), icon: 'search', run: () => setPalette(true) },
    { id: 'mascot', label: t(mascotOn ? 'topbar.hideMascot' : 'topbar.showMascot', { name: mascot.name }), icon: 'sparkle', run: () => setMascot(!mascotOn) },
    { id: 'sleep', label: t('power.sleep'), icon: 'moon', sep: true, run: () => { chime('playSleepChime'); setPower('sleep'); } },
    { id: 'restart', label: t('power.restart'), icon: 'refresh', run: onRestart },
    { id: 'off', label: t('power.shutDown'), icon: 'power', run: () => { chime('playShutdownChime'); setPower('off'); } },
  ];

  return (
    <header className="topbar">
      <div className="topbar-left" ref={menuRef}>
        <button
          ref={menuBtnRef}
          type="button"
          className={`topbar-os${menu ? ' is-open' : ''}`}
          aria-controls="os-menu"
          aria-expanded={menu}
          onClick={() => setMenu((m) => !m)}
        >
          <Logo />
          <span>{OS_NAME}</span>
        </button>
        <span className="topbar-app" aria-live="polite">{activeTitle ?? t('topbar.desktop')}</span>

        <AnimatePresence>
          {menu && (
            <motion.div
              className="menu"
              id="os-menu"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
            >
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  className={`menu-item${it.sep ? ' has-sep' : ''}`}
                  onClick={() => {
                    menuBtnRef.current?.focus();
                    setMenu(false);
                    it.run();
                  }}
                >
                  <Icon name={it.icon} size={16} />
                  {it.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="topbar-center" ref={calRef}>
        <button
          ref={calBtnRef}
          type="button"
          className={`pill pill--clock${cal ? ' is-open' : ''}`}
          aria-haspopup="dialog"
          aria-expanded={cal}
          title={t('topbar.clockTitle')}
          onClick={() => setCal((c) => !c)}
        >
          <span className="dot" />
          {cityLabel(place, t, lang).toUpperCase()} {clock}
        </button>
        <AnimatePresence>
          {cal && (
            <motion.div
              className="clockpanel-wrap"
              style={{ x: '-50%' }}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
            >
              <ClockPanel place={place} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="topbar-right">
        <button type="button" className="topbar-icon topbar-search" onClick={() => setPalette(true)} aria-label={t('topbar.searchLabel')}>
          <Icon name="search" size={16} />
          <kbd>⌘K</kbd>
        </button>
        <button type="button" className="topbar-icon topbar-recruiter" onClick={() => setRecruiter(true)} title={t('topbar.recruiterTitle')}>
          <Icon name="print" size={16} />
          <span>{t('common.recruiterMode')}</span>
        </button>
        <button
          type="button"
          className="topbar-icon"
          aria-pressed={muted}
          aria-label={t(muted ? 'topbar.soundsOffLabel' : 'topbar.soundsOnLabel')}
          title={t(muted ? 'topbar.soundsOff' : 'topbar.soundsOn')}
          onClick={() => setMuted(!muted)}
        >
          <Icon name={muted ? 'mute' : 'volume'} size={16} />
        </button>
        <LangToggle className="topbar-icon topbar-lang" />
        <a className="topbar-icon" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <Icon name="linkedin" size={16} />
        </a>
        <button type="button" className="btn btn--ink btn--sm" onClick={() => open('contact')}>
          {t('common.contactMe')}
        </button>
      </div>
    </header>
  );
}
