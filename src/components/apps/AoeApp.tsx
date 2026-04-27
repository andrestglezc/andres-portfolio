'use client';

export default function AoeApp() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/aoe.gif"
          alt="Age of Empires gameplay"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{ fontSize: 11, color: '#666', textAlign: 'center', padding: '4px', background: '#1a1a1a' }}>
        Age of Empires (1997) · Ensemble Studios · wololo
      </div>
    </div>
  );
}
