'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useOS, selectActiveId } from './store';
import { useHydrated, useMediaQuery, useRestoreTheme } from './hooks';
import { useLang, useRestoreLang } from '@/lib/i18n';
import { useContent } from '@/lib/useContent';
import Boot from './Boot';
import TopBar from './TopBar';
import Desktop from './Desktop';
import Dock from './Dock';
import WindowLayer from './WindowLayer';
import CommandPalette from './CommandPalette';
import PowerOverlay from './PowerOverlay';
import MiniPlayer from './MiniPlayer';
import Note from './Note';
import Mascot from './Mascot';
import MobileSite from '@/mobile/MobileSite';
import { visitCount } from './SiteBadges';
import dynamic from 'next/dynamic';

// Recruiter mode is a separate plain page; most visitors never load it.
const RecruiterView = dynamic(() => import('./RecruiterView'), { ssr: false });

/** The page's own tab title from layout.tsx, read once on the client. */
let pageTitle: string | null = null;

/**
 * The tab title follows the language: English keeps the page's own title, Spanish says the
 * same in Spanish. Recruiter mode names the tab itself, so this waits while it is open.
 */
function useDocTitle(paused: boolean) {
  const lang = useLang();
  const { profile } = useContent();
  useEffect(() => {
    if (paused) return;
    pageTitle ??= document.title;
    if (lang === 'en') {
      document.title = pageTitle;
      return;
    }
    const title = `${profile.shortName} — ${profile.tagline}`;
    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();
    // Next.js settles the page's own <title> while the page hydrates, which can land after
    // this has run on a Spanish first load. Put the Spanish title back if it does.
    const watch = new MutationObserver(apply);
    watch.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => watch.disconnect();
  }, [paused, lang, profile]);
}

function DesktopOS() {
  // The boot plays on every load and reload, and again on Restart. It is short and skippable.
  const [booted, setBooted] = useState(false);
  const paletteOpen = useOS((s) => s.paletteOpen);
  // Anything that covers the whole screen takes the rest of the OS out of the tab order.
  const covered = useOS((s) => s.noteOpen || s.paletteOpen || s.power !== 'on');
  const maximized = useOS((s) => s.windows.some((w) => w.maximized && !w.minimized));

  const onBootDone = useCallback((byGesture: boolean) => {
    setBooted(true);
    // Browsers only allow sound after a user gesture.
    if (byGesture) import('@/lib/audio').then((m) => m.playStartupChime());
  }, []);

  const restart = useCallback(() => {
    const os = useOS.getState();
    os.closeAll();
    os.setPalette(false);
    os.setPower('on');
    setBooted(false);
  }, []);

  // Every visit lands on the About window, centred, with the README note on top.
  useEffect(() => {
    if (!booted) return;
    const os = useOS.getState();
    os.open('about');
    os.setNote(true);
  }, [booted]);

  // Soft click for every control. Tecla has her own key sound, so she is skipped.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('button, a, summary, [role="tab"]');
      if (!el || el.closest('.mascot-btn') || (el as HTMLButtonElement).disabled) return;
      import('@/lib/audio').then((m) => m.playUiClick());
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const os = useOS.getState();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        os.setPalette(!os.paletteOpen);
        return;
      }
      if (e.key === 'Escape' && !os.paletteOpen && os.power === 'on') {
        if (os.noteOpen) {
          os.setNote(false);
          return;
        }
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
        const id = selectActiveId(os);
        if (id) os.close(id);
      }
    };
    const onResize = () => useOS.getState().fitToViewport();
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  if (!booted) return <Boot onDone={onBootDone} />;

  return (
    <div className="os">
      <div className="os-layers" inert={covered || undefined}>
        <TopBar onRestart={restart} />
        <Desktop />
        <WindowLayer />
        <MiniPlayer />
        {/* A maximized window hides the desktop, so its pet steps out of the tab order too. */}
        <div className="os-layers" inert={maximized || undefined}>
          <Mascot onAction={(cta) => useOS.getState().open(cta.app ?? 'case', { study: cta.study })} />
        </div>
        <Dock />
      </div>
      <Note />
      <AnimatePresence>{paletteOpen && <CommandPalette onRestart={restart} />}</AnimatePresence>
      <PowerOverlay onRestart={restart} />
    </div>
  );
}

export default function Shell() {
  const hydrated = useHydrated();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const recruiter = useOS((s) => s.recruiter);
  // Count the visit on arrival, not only when the badge happens to be on screen.
  useEffect(() => {
    void visitCount();
  }, []);
  useRestoreTheme();
  useRestoreLang();
  useDocTitle(recruiter);

  if (!hydrated) return <div className="preboot" />;
  // reducedMotion="user": every framer-motion animation drops its movement for people who ask for less.
  return (
    <MotionConfig reducedMotion="user">
      {isMobile ? <MobileSite /> : <DesktopOS />}
      {recruiter && <RecruiterView onExit={() => useOS.getState().setRecruiter(false)} />}
    </MotionConfig>
  );
}
