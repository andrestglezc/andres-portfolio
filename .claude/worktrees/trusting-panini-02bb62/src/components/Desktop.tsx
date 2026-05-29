'use client';

import { useState } from 'react';
import { useWindowStore, defaultWindowProps } from '@/lib/windows';
import { filesystem, FSNode, FileNode, FolderNode } from '@/lib/filesystem';
import type { AppType, WindowId } from '@/lib/windows';

// ─── Desktop icon image mapping ───────────────────────────────────────────────

function getIconSrc(node: FSNode): string {
  if (node.type === 'folder') {
    return node.name === 'Work' ? '/icons/icon-work.png' : '/icons/icon-about-me.png?v=2';
  }
  const file = node as FileNode;
  if (file.contentKey === 'doom')    return '/icons/icon-doom.png';
  if (file.contentKey === 'aoe')     return '/icons/icon-aoe.png';
  if (file.contentKey === 'sims')    return '/icons/icon-sims.png';
  if (file.fileType === 'pdf')       return '/icons/icon-resume.png';
  if (file.contentKey === 'contact') return '/icons/icon-contact.png';
  if (file.contentKey === 'bio')     return '/icons/icon-about-me.png?v=2';
  if (file.contentKey === 'music')   return '/icons/icon-music.png';
  if (file.contentKey === 'readme')  return '/icons/icon-readme.png';
  return '/icons/icon-readme.png';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Module-level helper so Math.random() is outside React's render scope and
// doesn't trigger the react-hooks/purity "impure function during render" rule.
function randPos(baseX: number, rangeX: number, baseY: number, rangeY: number) {
  return { x: baseX + Math.random() * rangeX, y: baseY + Math.random() * rangeY };
}

function resolveFileOpen(node: FileNode): { app: AppType; id: WindowId; width: number; height: number } {
  if (node.fileType === 'json')      return { app: 'jsonfile',  id: `jsonfile-${node.contentKey}`,  width: 480, height: 400 };
  if (node.fileType === 'app' && node.contentKey === 'doom')
                                     return { app: 'doom',      id: 'doom',                          width: 640, height: 680 };
  if (node.fileType === 'app' && node.contentKey === 'aoe')
                                     return { app: 'aoe',       id: 'aoe',                           width: 640, height: 480 };
  if (node.fileType === 'app' && node.contentKey === 'sims')
                                     return { app: 'sims',      id: 'sims',                          width: 640, height: 480 };
  if (node.fileType === 'app' && node.contentKey === 'music')
                                     return { app: 'music',     id: 'music',                         width: 459, height: 560 };
  if (node.fileType === 'app')       return { app: 'casestudy', id: `casestudy-${node.contentKey}`, width: 780, height: 540 };
  if (node.fileType === 'pdf')       return { app: 'resume',    id: `resume-${node.contentKey}`,    width: 780, height: 680 };
  if (node.contentKey === 'contact') return { app: 'contact',   id: 'contact',                      width: 420, height: 340 };
  if (node.contentKey === 'bio')     return { app: 'about',     id: 'about',                        width: 480, height: 440 };
  return { app: 'textfile', id: `textfile-${node.contentKey}`, width: 480, height: 360 };
}

// ─── DesktopIcon ──────────────────────────────────────────────────────────────

function DesktopIcon({
  node,
  selected,
  onSelect,
  onOpen,
}: {
  node: FSNode;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        cursor: 'default',
      }}
      onClick={e => { e.stopPropagation(); onSelect(); }}
      onDoubleClick={e => { e.stopPropagation(); onOpen(); }}
    >
      <div
        style={{
          padding: 2,
          background: selected ? 'rgba(0,0,128,0.35)' : 'transparent',
          display: 'inline-flex',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getIconSrc(node)}
          alt={node.name}
          style={{ width: node.name === 'About_Me' ? 87 : node.name === 'Music.exe' ? 62 : 48, height: node.name === 'About_Me' ? 87 : node.name === 'Music.exe' ? 62 : 48, objectFit: 'contain', display: 'block' }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          fontFamily: 'inherit',
          color: '#FFFFFF',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          lineHeight: 1.3,
          textShadow: '1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)',
          background: selected ? '#000080' : 'transparent',
          padding: '1px 3px',
        }}
      >
        {node.name}
      </span>
    </div>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

export default function Desktop() {
  const { openWindow, maximizeWindow, windows } = useWindowStore();
  const [selected, setSelected] = useState<string | null>(null);

  const rightNames = ['AgeOfEmpires.exe', 'TheSims.exe'];
  const leftItems = filesystem.children.filter(n => !rightNames.includes(n.name));
  const rightItems = filesystem.children.filter(n => rightNames.includes(n.name));

  const handleOpen = (node: FSNode) => {
    if (node.type === 'folder') {
      openWindow({
        id: `finder-${node.name}`,
        app: 'finder',
        title: node.name,
        props: { folder: node as FolderNode },
        ...randPos(100, 80, 50, 40),
        width: 520,
        height: 380,
      });
    } else {
      const { app, id, width, height } = resolveFileOpen(node);
      const isNew = !windows.find(w => w.id === id);
      openWindow({
        id,
        app,
        title: node.name,
        props: { contentKey: node.contentKey },
        ...randPos(120, 80, 60, 40),
        width,
        height,
      });
      if (app === 'casestudy' && isNew) maximizeWindow(id);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        paddingBottom: 42,
        backgroundImage: "url('/wallpaper.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={() => setSelected(null)}
    >

      {/* Desktop icons — left column */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {leftItems.map(node => (
          <DesktopIcon
            key={node.name}
            node={node}
            selected={selected === node.name}
            onSelect={() => setSelected(node.name)}
            onOpen={() => handleOpen(node)}
          />
        ))}
      </div>

      {/* Desktop icons — right column */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {rightItems.map(node => (
          <DesktopIcon
            key={node.name}
            node={node}
            selected={selected === node.name}
            onSelect={() => setSelected(node.name)}
            onOpen={() => handleOpen(node)}
          />
        ))}

        {/* O'malley shrine icon */}
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'default' }}
          onClick={e => { e.stopPropagation(); setSelected('omalley-shrine'); }}
          onDoubleClick={e => {
            e.stopPropagation();
            const id = 'shrine';
            openWindow({ ...defaultWindowProps('shrine'), id });
          }}
        >
          <div style={{ padding: 2, background: selected === 'omalley-shrine' ? 'rgba(0,0,128,0.35)' : 'transparent', display: 'inline-flex' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-omalley.png" alt="O'malley" style={{ width: 48, height: 48, objectFit: 'contain', display: 'block' }} />
          </div>
          <span style={{
            fontSize: 11, fontFamily: 'inherit', color: '#FFFFFF', textAlign: 'center',
            whiteSpace: 'nowrap', lineHeight: 1.3,
            textShadow: '1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)',
            background: selected === 'omalley-shrine' ? '#000080' : 'transparent',
            padding: '1px 3px',
          }}>
            O&apos;malley.exe
          </span>
        </div>
      </div>
    </div>
  );
}
