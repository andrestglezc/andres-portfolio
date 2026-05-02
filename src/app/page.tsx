'use client';

import { useState, useEffect } from 'react';
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

export default function Home() {
  const { openWindow, closeWindow, setWindowZIndex, windows } = useWindowStore();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [booted, setBooted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [readmeEverOpened, setReadmeEverOpened] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    setMounted(true);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
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

  // Track once readme has been seen
  useEffect(() => {
    if (readmeOpen) setReadmeEverOpened(true);
  }, [readmeOpen]);

  // Dismiss overlay when readme is closed via X button
  useEffect(() => {
    if (readmeEverOpened && !readmeOpen) setShowOverlay(false);
  }, [readmeOpen, readmeEverOpened]);

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
