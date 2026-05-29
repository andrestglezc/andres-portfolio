'use client';

import { useMusicStore, TRACKS } from '@/lib/musicStore';
import { useWindowStore } from '@/lib/windows';

const bevelUp: React.CSSProperties = {
  borderTop: '2px solid #FFFFFF',
  borderLeft: '2px solid #FFFFFF',
  borderRight: '2px solid #808080',
  borderBottom: '2px solid #808080',
};

export default function MiniPlayer() {
  const { trackIndex, playing, togglePlay, next } = useMusicStore();
  const { windows, restoreWindow } = useWindowStore();

  const musicWindow = windows.find(w => w.id === 'music');
  if (!musicWindow?.isMinimized) return null;

  const track = TRACKS[trackIndex];

  return (
    <div style={{
      position: 'fixed',
      bottom: 50,
      right: 16,
      width: 260,
      height: 52,
      background: '#C0C0C0',
      ...bevelUp,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 8px',
      fontFamily: 'MS Sans Serif, Arial, sans-serif',
      zIndex: 99999,
    }}>
      {/* Rotating cover thumbnail */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%', overflow: 'hidden',
        position: 'relative', flexShrink: 0,
        animationName: 'vinylSpin',
        animationDuration: '4s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationPlayState: playing ? 'running' : 'paused',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={track.cover} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 0 0 1px #999' }} />
        </div>
      </div>

      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 11, fontWeight: 'bold', color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
        <div style={{ fontSize: 10, color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.artist}</div>
      </div>

      {/* Controls */}
      {[
        { label: playing ? '⏸' : '▶', action: togglePlay },
        { label: '⏭', action: next },
        { label: '🔼', action: () => restoreWindow('music') },
      ].map(btn => (
        <button
          key={btn.label}
          onClick={btn.action}
          title={btn.label === '🔼' ? 'Restore' : undefined}
          style={{ ...bevelUp, background: '#C0C0C0', width: 24, height: 24, fontSize: 11, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
