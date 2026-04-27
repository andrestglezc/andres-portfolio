'use client';

import { useEffect, useRef, useState } from 'react';
import { useWindowStore } from '@/lib/windows';
import type { AppType } from '@/lib/windows';
import { filesystem } from '@/lib/filesystem';
import type { FolderNode } from '@/lib/filesystem';

interface Props {
  onClose: () => void;
}

const MENU_BG = '#C0C0C0';
const HOVER_BG = '#000080';
const HOVER_FG = '#FFFFFF';
const NORMAL_FG = '#000000';
const ITEM_H = 28;
const MENU_W = 200;

// ─── Sub-menu item ────────────────────────────────────────────────────────────

function SubItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  const [over, setOver] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
      style={{
        height: ITEM_H,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 6,
        paddingRight: 16,
        gap: 8,
        background: over ? HOVER_BG : 'transparent',
        color: over ? HOVER_FG : NORMAL_FG,
        cursor: 'default',
        userSelect: 'none',
        fontFamily: 'MS Sans Serif, Arial, sans-serif',
        fontSize: 13,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 20, textAlign: 'center', flexShrink: 0, fontSize: 14 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// ─── Sub-menu popup ───────────────────────────────────────────────────────────

function Submenu({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute',
      left: '100%',
      bottom: 0,
      background: MENU_BG,
      border: '2px solid',
      borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
      boxShadow: '2px 2px 0 #000000',
      zIndex: 100000,
      minWidth: MENU_W,
    }}>
      {children}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ margin: '3px 6px', borderTop: '1px solid #808080', borderBottom: '1px solid #FFFFFF' }} />
  );
}

// ─── Main menu item ───────────────────────────────────────────────────────────

function MenuItem({
  icon, label, hasArrow, isHovered, onEnter, onLeave, onClick, children,
}: {
  icon: string;
  label: string;
  hasArrow?: boolean;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        onClick={onClick}
        style={{
          height: ITEM_H,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 6,
          paddingRight: 8,
          gap: 8,
          background: isHovered ? HOVER_BG : 'transparent',
          color: isHovered ? HOVER_FG : NORMAL_FG,
          cursor: 'default',
          userSelect: 'none',
          fontFamily: 'MS Sans Serif, Arial, sans-serif',
          fontSize: 13,
          whiteSpace: 'nowrap',
          minWidth: MENU_W,
        }}
      >
        <span style={{ width: 20, textAlign: 'center', flexShrink: 0, fontSize: 15 }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {hasArrow && <span style={{ fontSize: 9, marginLeft: 4 }}>▶</span>}
      </div>
      {isHovered && children}
    </div>
  );
}

// ─── Start Menu ───────────────────────────────────────────────────────────────

export default function StartMenu({ onClose }: Props) {
  const { openWindow, windows, focusWindow } = useWindowStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const workFolder = filesystem.children.find(
    n => n.type === 'folder' && n.name === 'Work',
  ) as FolderNode | undefined;

  const activate = (id: string, open: () => void) => {
    const existing = windows.find(w => w.id === id);
    if (existing) focusWindow(id);
    else open();
    onClose();
  };

  const center = (w: number, h: number) => ({
    x: Math.round((window.innerWidth - w) / 2),
    y: Math.round((window.innerHeight - h) / 2),
  });

  const openApp = (id: string, app: AppType, title: string, w: number, h: number, props: Record<string, unknown> = {}) =>
    activate(id, () => openWindow({ id, app, title, props, ...center(w, h), width: w, height: h }));

  // Hover helpers with small delay to allow mouse to reach submenu
  const enter = (key: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHovered(key);
  };
  const leave = () => {
    hideTimer.current = setTimeout(() => setHovered(null), 120);
  };
  const submenuEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const programsSubmenu = (
    <Submenu>
      <div onMouseEnter={submenuEnter} onMouseLeave={leave}>
        <SubItem icon="📁" label="Work / Portfolio" onClick={() => activate('finder-Work', () =>
          workFolder && openWindow({ id: 'finder-Work', app: 'finder', title: 'Work', props: { folder: workFolder }, ...center(520, 380), width: 520, height: 380 })
        )} />
        <SubItem icon="👤" label="About Me"  onClick={() => openApp('about',   'about',   'About Me',    480, 400)} />
        <SubItem icon="📄" label="Resume"    onClick={() => openApp('resume',  'resume',  'Resume.pdf',  780, 680)} />
        <SubItem icon="✉️" label="Contact"   onClick={() => openApp('contact', 'contact', 'Contact.txt', 420, 340)} />
        <SubItem icon="🎮" label="DOOM.exe"  onClick={() => openApp('doom',    'doom',    'DOOM.exe',    680, 680)} />
      </div>
    </Submenu>
  );

  const documentsSubmenu = (
    <Submenu>
      <div onMouseEnter={submenuEnter} onMouseLeave={leave}>
        {[
          { label: 'Nsity Case Study',   key: 'nsity' },
          { label: 'XPO Design System',  key: 'xpo' },
          { label: 'SKY Airline',        key: 'sky' },
          { label: 'GASCO',              key: 'gasco' },
        ].map(cs => (
          <SubItem
            key={cs.key}
            icon="📋"
            label={cs.label}
            onClick={() => activate(`casestudy-${cs.key}`, () =>
              openWindow({
                id: `casestudy-${cs.key}`,
                app: 'casestudy',
                title: cs.label,
                props: { contentKey: cs.key },
                ...center(780, 540),
                width: 780,
                height: 540,
              })
            )}
          />
        ))}
      </div>
    </Submenu>
  );

  const items: Array<{
    key: string;
    icon: string;
    label: string;
    arrow?: boolean;
    action?: () => void;
    submenu?: React.ReactNode;
  }> = [
    { key: 'programs',  icon: '💼', label: 'Programs',    arrow: true,  submenu: programsSubmenu },
    { key: 'documents', icon: '📂', label: 'Documents',   arrow: true,  submenu: documentsSubmenu },
    { key: 'settings',  icon: '⚙️', label: 'Settings',    action: () => openApp('sysinfo',  'sysinfo',  'System Properties',  420, 380) },
    { key: 'find',      icon: '🔍', label: 'Find',        action: () => openApp('find',     'find',     'Find: All Files',    380, 320) },
    { key: 'help',      icon: '❓', label: 'Help',        action: () => openApp('help',     'help',     'Windows Help',       480, 400) },
    { key: 'run',       icon: '🏃', label: 'Run...',      action: () => openApp('run',      'run',      'Run',                340, 170) },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        bottom: 42,
        left: 0,
        display: 'flex',
        zIndex: 99998,
        border: '2px solid',
        borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
        boxShadow: '2px 2px 0 #000000',
      }}
    >
      {/* Win98 sidebar */}
      <div style={{
        width: 24,
        background: 'linear-gradient(to top, #000060, #1a1a8c)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 6,
        flexShrink: 0,
      }}>
        <span style={{
          color: '#FFFFFF',
          fontSize: 11,
          fontFamily: 'MS Sans Serif, Arial, sans-serif',
          fontWeight: 'bold',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          letterSpacing: 2,
          userSelect: 'none',
          opacity: 0.9,
        }}>
          Nostalgia OS
        </span>
      </div>

      {/* Menu column */}
      <div style={{ background: MENU_BG, paddingTop: 2, paddingBottom: 2 }}>
        {items.map(item => (
          <MenuItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            hasArrow={item.arrow}
            isHovered={hovered === item.key}
            onEnter={() => enter(item.key)}
            onLeave={leave}
            onClick={item.action}
          >
            {item.submenu}
          </MenuItem>
        ))}

        <Divider />

        <MenuItem
          icon="🔌"
          label="Shut Down..."
          isHovered={hovered === 'shutdown'}
          onEnter={() => enter('shutdown')}
          onLeave={leave}
          onClick={() => openApp('shutdown', 'shutdown', 'Shut Down Nostalgia OS', 420, 320)}
        />
      </div>
    </div>
  );
}
