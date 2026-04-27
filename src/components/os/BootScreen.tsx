'use client';

import { useEffect, useState } from 'react';

const BIOS_LINES = [
  'Nostalgia OS v1.0 BIOS',
  'Copyright (C) 2026 Andres T. Gonzalez C.',
  '',
  'CPU: Creative Intel UX Designer 10+ Years',
  'Memory Test: 640K OK',
  'Detecting drives... OK',
  'Loading Nostalgia OS...',
  '',
  'Press DEL to enter setup',
];

const LINE_MS = 80;
const BIOS_HOLD_MS = 2000;
const PROGRESS_STEP_MS = 300;
const WELCOME_MS = 1500;
const WELCOME_FADE_AT_MS = 1000;

type Stage = 'bios' | 'loading' | 'welcome' | 'done';

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>('bios');
  const [lines, setLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  // BIOS: reveal lines one by one, then advance after hold
  useEffect(() => {
    if (stage !== 'bios') return;
    if (lines < BIOS_LINES.length) {
      const t = setTimeout(() => setLines(l => l + 1), LINE_MS);
      return () => clearTimeout(t);
    }
    const elapsed = BIOS_LINES.length * LINE_MS;
    const remaining = Math.max(BIOS_HOLD_MS - elapsed, 300);
    const t = setTimeout(() => setStage('loading'), remaining);
    return () => clearTimeout(t);
  }, [stage, lines]);

  // Loading: chunky progress jumps every 300ms
  useEffect(() => {
    if (stage !== 'loading') return;
    if (progress >= 100) {
      const t = setTimeout(() => setStage('welcome'), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProgress(p => Math.min(p + 10, 100)), PROGRESS_STEP_MS);
    return () => clearTimeout(t);
  }, [stage, progress]);

  // Welcome: fade out then call done
  useEffect(() => {
    if (stage !== 'welcome') return;
    const t1 = setTimeout(() => setFading(true), WELCOME_FADE_AT_MS);
    const t2 = setTimeout(() => { setStage('done'); onComplete(); }, WELCOME_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (stage === 'done') return null;

  const skip = () => { setStage('done'); onComplete(); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, fontFamily: 'Courier New, monospace' }}>

      {/* ── Stage 1: BIOS ── */}
      {stage === 'bios' && (
        <div style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          padding: '40px 60px',
          boxSizing: 'border-box',
        }}>
          {BIOS_LINES.slice(0, lines).map((line, i) => (
            <div key={i} style={{
              color: '#FFFFFF',
              fontSize: 14,
              lineHeight: '1.7',
              minHeight: '1.7em',
              whiteSpace: 'pre',
            }}>
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      )}

      {/* ── Stage 2: Loading ── */}
      {stage === 'loading' && (
        <div style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}>
          <div style={{
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 'bold',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
            letterSpacing: 3,
          }}>
            Nostalgia OS
          </div>

          {/* 4-color Win98 logo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <div style={{ width: 20, height: 20, background: '#FF0000' }} />
            <div style={{ width: 20, height: 20, background: '#00CC00' }} />
            <div style={{ width: 20, height: 20, background: '#0000CC' }} />
            <div style={{ width: 20, height: 20, background: '#FFCC00' }} />
          </div>

          {/* Chunky Win98 progress bar */}
          <div style={{
            width: 280,
            height: 20,
            background: '#C0C0C0',
            border: '2px solid',
            borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            padding: 2,
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#000080',
              // no transition — chunky jumps only
            }} />
          </div>

          <div style={{
            color: '#AAAAAA',
            fontSize: 12,
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
          }}>
            Loading your experience...
          </div>
        </div>
      )}

      {/* ── Stage 3: Welcome ── */}
      {stage === 'welcome' && (
        <div style={{
          background: '#000080',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.5s ease' : 'none',
        }}>
          <div style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
            letterSpacing: 2,
          }}>
            Welcome to
          </div>
          <div style={{
            color: '#FFFFFF',
            fontSize: 38,
            fontWeight: 'bold',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
            letterSpacing: 3,
          }}>
            Nostalgia OS
          </div>
        </div>
      )}

      {/* Skip button */}
      <button
        onClick={skip}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          background: 'transparent',
          border: '1px solid #555555',
          color: '#888888',
          fontSize: 12,
          fontFamily: 'MS Sans Serif, Arial, sans-serif',
          padding: '4px 12px',
          cursor: 'pointer',
        }}
      >
        Skip intro →
      </button>
    </div>
  );
}
