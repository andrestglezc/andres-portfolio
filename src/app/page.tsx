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

export default function Home() {
  const { openWindow } = useWindowStore();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [booted, setBooted] = useState(false);

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
        x: window.innerWidth - 520,
        y: 100,
        width: 480,
        height: 360,
      });
    }, 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  if (!mounted) return <div style={{ background: '#000', width: '100vw', height: '100vh' }} />;

  if (isMobile) return <MobileSite />;

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  return (
    <>
      <Menubar />
      <Desktop />
      <WindowManager />
      <Dock />
      <MiniPlayer />
    </>
  );
}
