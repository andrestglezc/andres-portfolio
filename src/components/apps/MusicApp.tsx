'use client';

import { useMusicStore, TRACKS } from '@/lib/musicStore';

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

export default function MusicApp() {
  const { trackIndex, playing, progress, togglePlay, switchTrack, prev, next, seek } = useMusicStore();
  const track = TRACKS[trackIndex];

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * 100);
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#C0C0C0', display: 'flex', flexDirection: 'column', fontFamily: 'MS Sans Serif, Arial, sans-serif', fontSize: 12, overflow: 'hidden' }}>

      {/* Album art — rotating cover */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
        <div style={{
          width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...bevelDown,
          animationName: 'vinylSpin',
          animationDuration: '4s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: playing ? 'running' : 'paused',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={track.cover} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFFFFF', position: 'absolute', boxShadow: '0 0 0 2px #999' }} />
        </div>
      </div>

      {/* Track info */}
      <div style={{ textAlign: 'center', padding: '0 12px 8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: 13, color: '#000000', marginBottom: 2 }}>{track.title}</div>
        <div style={{ color: '#444', fontSize: 11 }}>{track.artist}</div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 12px 8px' }}>
        <div
          onClick={handleProgressClick}
          style={{ ...bevelDown, height: 14, background: '#C0C0C0', cursor: 'pointer', position: 'relative' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress}%`, background: '#000080' }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 12px 10px' }}>
        {([
          { label: '⏮', action: prev },
          { label: playing ? '⏸' : '▶', action: togglePlay },
          { label: '⏭', action: next },
        ] as { label: string; action: () => void }[]).map(btn => (
          <button
            key={btn.label}
            onClick={btn.action}
            style={{ ...bevelUp, background: '#C0C0C0', padding: '3px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', minWidth: 40 }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Personal note */}
      <div style={{ padding: '0 12px 8px', flex: '0 0 auto' }}>
        <div style={{ fontSize: 10, color: '#666', fontVariant: 'small-caps', marginBottom: 4 }}>Why I love this:</div>
        <div style={{ ...bevelDown, background: '#C0C0C0', padding: 8, maxHeight: 72, overflowY: 'auto' }}>
          <span style={{ fontStyle: 'italic', color: '#222', fontSize: 11 }}>{track.note}</span>
        </div>
      </div>

      {/* Track list */}
      <div style={{ padding: '0 12px 8px', flex: '1 1 0', minHeight: 0 }}>
        <div style={{ ...bevelDown, background: '#FFFFFF', overflow: 'hidden' }}>
          {TRACKS.map((t, i) => (
            <div
              key={t.id}
              onClick={() => switchTrack(i)}
              style={{
                padding: '4px 8px',
                cursor: 'default',
                background: i === trackIndex ? '#000080' : 'transparent',
                color: i === trackIndex ? '#FFFFFF' : '#000000',
                fontSize: 11,
                userSelect: 'none',
              }}
            >
              {i + 1}. {t.title} — {t.artist}
            </div>
          ))}
        </div>
      </div>

      {/* Copyright footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#808080', padding: '0 8px 6px', flexShrink: 0 }}>
        All songs belong to their respective owners and copyright holders.
      </div>

      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
