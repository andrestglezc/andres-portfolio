'use client';

export default function DoomApp() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src="/doom.gif" alt="DOOM" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ fontSize: 11, color: '#666', textAlign: 'center', padding: '4px', background: '#1a1a1a', fontFamily: 'MS Sans Serif, Arial, sans-serif' }}>
        DOOM (1993) · id Software · Shareware · rip and tear
      </div>
    </div>
  );
}
