'use client';

import { useEffect, useState } from 'react';
import { useWindowStore } from '@/lib/windows';
import { filesystem } from '@/lib/filesystem';
import type { FolderNode } from '@/lib/filesystem';
import StartMenu from '@/components/os/StartMenu';

// ─── Shared bevel styles ─────────────────────────────────────────────────────

const bevelUp: React.CSSProperties = {
  borderTop: '2px solid #FFFFFF',
  borderLeft: '2px solid #FFFFFF',
  borderRight: '2px solid #808080',
  borderBottom: '2px solid #808080',
};

const bevelDown: React.CSSProperties = {
  borderTop: '2px solid #808080',
  borderLeft: '2px solid #808080',
  borderRight: '2px solid #FFFFFF',
  borderBottom: '2px solid #FFFFFF',
};

// ─── Windows flag icon ────────────────────────────────────────────────────────

function WindowsFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 14 14" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="0" y="0" width="6" height="6" fill="#FF0000" />
      <rect x="8" y="0" width="6" height="6" fill="#00CC00" />
      <rect x="0" y="8" width="6" height="6" fill="#0000CC" />
      <rect x="8" y="8" width="6" height="6" fill="#FFCC00" />
    </svg>
  );
}

// ─── LinkedIn icon button ─────────────────────────────────────────────────────

function LinkedInBtn() {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      title="LinkedIn"
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={() => window.open('https://www.linkedin.com/in/andres-gonzalez-ux/', '_blank')}
      style={{
        ...(pressed ? bevelDown : bevelUp),
        background: '#C0C0C0',
        width: 32,
        height: 32,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 14 14" style={{ display: 'block' }}>
        <rect width="14" height="14" rx="2" fill="#0077B5" />
        <text
          x="2.5"
          y="11"
          fill="#FFFFFF"
          fontSize="9"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          in
        </text>
      </svg>
    </button>
  );
}

// ─── Mail icon button ─────────────────────────────────────────────────────────

function MailBtn() {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      title="Email"
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={() => { window.location.href = 'mailto:andres.t.glez.c@gmail.com'; }}
      style={{
        ...(pressed ? bevelDown : bevelUp),
        background: '#C0C0C0',
        width: 32,
        height: 32,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <svg width="20" height="14" viewBox="0 0 14 10" style={{ display: 'block' }}>
        <rect x="0.5" y="0.5" width="13" height="9" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
        <polyline points="0.5,0.5 7,6 13.5,0.5" fill="none" stroke="#000000" strokeWidth="1" />
      </svg>
    </button>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────

function Sep() {
  return (
    <div
      style={{
        width: 2,
        height: 30,
        borderLeft: '1px solid #808080',
        borderRight: '1px solid #FFFFFF',
        margin: '0 2px',
        flexShrink: 0,
      }}
    />
  );
}

// ─── Taskbar ──────────────────────────────────────────────────────────────────

export default function Taskbar() {
  const [time, setTime] = useState('');
  const [startPressed, setStartPressed] = useState(false);
  const [startOpen, setStartOpen] = useState(false);

  const { windows, activeWindowId, openWindow, focusWindow, restoreWindow, minimizeWindow } = useWindowStore();

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 10_000);
    return () => clearInterval(id);
  }, []);

  const workFolder = filesystem.children.find(
    n => n.type === 'folder' && n.name === 'Work',
  ) as FolderNode | undefined;

  const FIXED_IDS = ['home', 'finder-Work', 'contact'];

  // OS-like toggle for fixed buttons: open if absent, restore if minimized, minimize if active, focus otherwise
  const handleFixed = (id: string, open: () => void) => {
    const win = windows.find(w => w.id === id);
    if (!win) { open(); return; }
    if (win.isMinimized) { restoreWindow(id); return; }
    if (activeWindowId === id) { minimizeWindow(id); return; }
    focusWindow(id);
  };

  // OS-like toggle for dynamic taskbar buttons
  const handleDynamic = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;
    if (win.isMinimized) { restoreWindow(id); return; }
    if (activeWindowId === id) { minimizeWindow(id); return; }
    focusWindow(id);
  };

  const fixedBevel = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (win && activeWindowId === id) return bevelDown;
    if (win && !win.isMinimized) return { ...bevelDown, background: '#D0D0D0' };
    if (win && win.isMinimized) return bevelDown;
    return bevelUp;
  };

  // ─── Center button definitions ──────────────────────────────────────────────

  const centerButtons = [
    {
      label: '🌍 Hello World!',
      id: 'home',
      action: () =>
        handleFixed('home', () =>
          openWindow({
            id: 'home',
            app: 'home',
            title: 'Hello World!',
            props: {},
            x: Math.round((window.innerWidth - 1188) / 2),
            y: Math.round((window.innerHeight - 670) / 2),
            width: 1188,
            height: 670,
          }),
        ),
    },
    {
      label: '💼 Portfolio',
      id: 'finder-Work',
      action: () =>
        handleFixed('finder-Work', () =>
          workFolder &&
          openWindow({
            id: 'finder-Work',
            app: 'finder',
            title: 'Work',
            props: { folder: workFolder },
            x: Math.round((window.innerWidth - 520) / 2),
            y: Math.round((window.innerHeight - 380) / 2),
            width: 520,
            height: 380,
          }),
        ),
    },
    {
      label: '✉️ Contact Me',
      id: 'contact',
      action: () =>
        handleFixed('contact', () =>
          openWindow({
            id: 'contact',
            app: 'contact',
            title: 'Contact.txt',
            props: {},
            x: Math.round((window.innerWidth - 420) / 2),
            y: Math.round((window.innerHeight - 340) / 2),
            width: 420,
            height: 340,
          }),
        ),
    },
  ];

  return (
    <>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 42,
        background: '#C0C0C0',
        borderTop: '2px solid #FFFFFF',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        paddingInline: 4,
        gap: 3,
      }}
    >
      {/* Start button */}
      <button
        onMouseDown={() => setStartPressed(true)}
        onMouseUp={() => setStartPressed(false)}
        onMouseLeave={() => setStartPressed(false)}
        onClick={() => setStartOpen(o => !o)}
        style={{
          ...(startOpen ? bevelDown : startPressed ? bevelDown : bevelUp),
          background: '#C0C0C0',
          height: 34,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontFamily: 'inherit',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000000',
          cursor: 'pointer',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        <WindowsFlag />
        Start
      </button>

      <Sep />

      {/* Fixed center app buttons */}
      {centerButtons.map(btn => (
        <button
          key={btn.id}
          onClick={btn.action}
          style={{
            ...fixedBevel(btn.id),
            background: '#C0C0C0',
            height: 34,
            padding: '0 14px',
            fontFamily: 'inherit',
            fontSize: 16,
            color: '#000000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {btn.label}
        </button>
      ))}

      {/* Dynamic buttons for non-fixed open windows */}
      {windows.filter(w => !FIXED_IDS.includes(w.id)).length > 0 && <Sep />}
      {windows.filter(w => !FIXED_IDS.includes(w.id)).map(w => (
        <button
          key={w.id}
          onClick={() => handleDynamic(w.id)}
          title={w.title}
          style={{
            ...(activeWindowId === w.id ? bevelDown : w.isMinimized ? bevelDown : bevelUp),
            background: '#C0C0C0',
            height: 34,
            padding: '0 10px',
            fontFamily: 'inherit',
            fontSize: 13,
            color: '#000000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
            flexShrink: 0,
            maxWidth: 160,
            overflow: 'hidden',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {w.title}
          </span>
        </button>
      ))}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      <Sep />

      {/* LinkedIn */}
      <LinkedInBtn />

      {/* Mail */}
      <MailBtn />

      <Sep />

      {/* Clock */}
      <div
        style={{
          ...bevelDown,
          height: 34,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'inherit',
          fontSize: 15,
          color: '#000000',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          minWidth: 72,
          justifyContent: 'center',
        }}
      >
        {time}
      </div>
    </div>
    </>
  );
}
