'use client';

import { useState } from 'react';

function Candle() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div
        style={{
          width: 14,
          height: 20,
          background: 'linear-gradient(to top, #ff6b00, #ffcc00)',
          borderRadius: '50% 50% 30% 30%',
          animation: 'omalley-flicker 1.5s ease-in-out infinite',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: -3,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,220,100,0.6)',
            filter: 'blur(3px)',
          }}
        />
      </div>
      <div style={{ width: 2, height: 6, background: '#555' }} />
      <div
        style={{
          width: 18,
          height: 50,
          background: 'linear-gradient(to right, #e8e0d0, #f5f0e8, #d8d0c0)',
          borderRadius: '2px 2px 3px 3px',
        }}
      />
    </div>
  );
}

function OmalleyPhoto() {
  const [failed, setFailed] = useState(false);
  const circleStyle: React.CSSProperties = {
    width: 190,
    height: 190,
    borderRadius: '50%',
    border: '3px solid #C8A96E',
    overflow: 'hidden',
    flexShrink: 0,
  };

  if (failed) {
    return (
      <div
        style={{
          ...circleStyle,
          background: '#2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 56,
        }}
      >
        🐱
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/omalley.jpg"
      alt="O'malley"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={{ ...circleStyle, objectFit: 'cover', display: 'block' }}
    />
  );
}

export default function ShrineApp() {
  return (
    <>
      <style>{`
        @keyframes omalley-flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.9; }
          25%       { transform: scale(1.05) rotate(1deg); opacity: 1; }
          50%       { transform: scale(0.97) rotate(-2deg); opacity: 0.85; }
          75%       { transform: scale(1.03) rotate(1deg); opacity: 0.95; }
        }
      `}</style>

      <div
        className="window-content"
        style={{
          background: '#1a1a1a',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'inherit',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, gap: 10 }}>
          <Candle />
          <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 7 }}>
            O&apos;Malley
          </div>
          <div style={{ color: '#C8A96E', fontSize: 13, textAlign: 'center' }}>
            2010 — 2026
          </div>
        </div>

        {/* Photo */}
        <div style={{ marginTop: 24 }}>
          <OmalleyPhoto />
        </div>

        {/* Message */}
        <div
          style={{
            marginTop: 24,
            padding: '0 24px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 13,
            fontStyle: 'italic',
            lineHeight: 1.8,
          }}
        >
          This is O&apos;Malley my cat, and he was more than a pet.<br />
          He was an awesome companion, a presence,<br />
          a tiny soul that made every room<br />
          feel more like home.<br />
          <br />
          Thank you for 16 years of love,<br />
          purring, and being exactly<br />
          who you were.<br />
          <br />
          Rest easy, little man. 🐾
        </div>

        <div style={{ marginBottom: 24 }} />
      </div>
    </>
  );
}
