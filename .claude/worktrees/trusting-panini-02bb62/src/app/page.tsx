'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import MobileSite from '@/components/mobile/MobileSite';
import BootScreen from '@/components/os/BootScreen';
import Desktop from '@/components/Desktop';
import Menubar from '@/components/Menubar';
import Dock from '@/components/Dock';
import WindowManager from '@/components/WindowManager';
import MiniPlayer from '@/components/MiniPlayer';
import { useWindowStore } from '@/lib/windows';

const README_Z = 100000;
const OVERLAY_Z = 99999;

// useSyncExternalStore helpers — module-level for stable identity across renders.
const mqSubscribe = (cb: () => void) => {
  const mq = window.matchMedia('(max-width: 767px)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getMqSnapshot = () => window.matchMedia('(max-width: 767px)').matches;
const getMqServerSnapshot = () => false;

export default function Home() {
  const { openWindow, closeWindow, setWindowZIndex, windows } = useWindowStore();
  const [mounted, setMounted] = useState(false);
  const [booted, setBooted] = useState(false);

  // isMobile via useSyncExternalStore — no setState call in an effect body.
  const isMobile = useSyncExternalStore(mqSubscribe, getMqSnapshot, getMqServerSnapshot);

  // mounted: setTimeout so setMounted runs inside a callback, not directly in the
  // effect body — satisfies react-hooks/set-state-in-effect.
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (booted) import('@/lib/audio').then(m => m.playStartupChime());
  }, [booted]);

  useEffect(() => {
    if (!booted || isMobile) return;
    const w = 1188, h = 670;
    openWindow({
      id: 'home',
      app: 'home',
      title: 'Hello World!',
      props: {},
      x: Math.round((window.innerWidth - w) / 2),
      y: Math.round((window.innerHeight - h) / 2),
      width: w,
      height: h,
    });
    const t = setTimeout(() => {
      openWindow({
        id: 'textfile-readme',
        app: 'textfile',
        title: 'README.txt',
        props: { contentKey: 'readme' },
        x: Math.round((window.innerWidth - 480) / 2),
        y: Math.round((window.innerHeight - 360) / 2),
        width: 480,
        height: 360,
        zIndex: README_Z,
      });
    }, 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  const readmeOpen = !!windows.find(w => w.id === 'textfile-readme');

  // Render-phase derived state (React's "storing information from previous renders"
  // pattern — react.dev/reference/react/useState#storing-information-from-previous-renders).
  // Avoids calling setState inside effect bodies for these transitions.
  const [prevReadmeOpen, setPrevReadmeOpen] = useState(false);
  const [readmeEverOpened, setReadmeEverOpened] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  if (readmeOpen !== prevReadmeOpen) {
    setPrevReadmeOpen(readmeOpen);
    if (readmeOpen && !readmeEverOpened) {
      setReadmeEverOpened(true);
    }
    if (!readmeOpen && readmeEverOpened) {
      setShowOverlay(false);
    }
  }

  // While overlay is active, keep README zIndex pinned above the overlay.
  // focusWindow resets zIndex to ++zCounter (~10s), which would drop it below the overlay.
  useEffect(() => {
    if (!showOverlay) return;
    const readme = windows.find(w => w.id === 'textfile-readme');
    if (readme && readme.zIndex < README_Z) {
      setWindowZIndex('textfile-readme', README_Z);
    }
  }, [windows, showOverlay, setWindowZIndex]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeWindow('textfile-readme');
      setShowOverlay(false);
    }
  };

  if (!mounted) return <div style={{ background: '#000', width: '100vw', height: '100vh' }} />;
  if (isMobile) return <MobileSite />;
  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  return (
    <>
      <Menubar />
      <Desktop />
      <WindowManager />
      {showOverlay && readmeOpen && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: OVERLAY_Z,
            transition: 'opacity 0.4s',
          }}
        />
      )}
      <Dock />
      <MiniPlayer />
    </>
  );
}
