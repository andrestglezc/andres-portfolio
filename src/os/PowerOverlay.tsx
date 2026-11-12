'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useOS } from './store';
import { OS_NAME } from './apps';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

// The canvas screensavers are only needed once the visitor chooses Sleep.
const Saver = dynamic(() => import('./screensavers'), { ssr: false });

const COLORS = ['var(--c-tomato)', 'var(--c-lime)', 'var(--c-sun)', 'var(--c-pink)', 'var(--c-cobalt)'];

function Screensaver({ onWake }: { onWake: () => void }) {
  const saver = useOS((st) => st.saver);
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ignore the pointer movement that follows the click on "Sleep".
    const armed = { at: performance.now() + 600 };
    const wake = () => performance.now() > armed.at && onWake();
    const events = ['keydown', 'pointerdown', 'pointermove', 'wheel'] as const;
    events.forEach((ev) => window.addEventListener(ev, wake));
    return () => events.forEach((ev) => window.removeEventListener(ev, wake));
  }, [onWake]);

  useEffect(() => {
    // Direct DOM writes keep this at 60fps without re-rendering React.
    let x = 80, y = 80, vx = 1.7, vy = 1.3, c = 0, raf = 0;
    const tick = () => {
      const el = box.current;
      if (el) {
        const maxX = window.innerWidth - el.offsetWidth;
        const maxY = window.innerHeight - el.offsetHeight;
        x += vx;
        y += vy;
        let hit = false;
        if (x <= 0 || x >= maxX) { vx = -vx; x = Math.min(Math.max(x, 0), maxX); hit = true; }
        if (y <= 0 || y >= maxY) { vy = -vy; y = Math.min(Math.max(y, 0), maxY); hit = true; }
        if (hit) el.style.color = COLORS[(c = (c + 1) % COLORS.length)];
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const fmt = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const paint = () => { if (clock.current) clock.current.textContent = fmt(); };
    paint();
    const id = setInterval(paint, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return (
    <div className="power power--sleep" role="dialog" aria-label={t('power.saverLabel')}>
      {saver === 'logo' ? (
        <div className="saver" ref={box} style={{ color: COLORS[0] }}>
          <div className="saver-name">{OS_NAME}</div>
          <div className="saver-clock" ref={clock} />
        </div>
      ) : (
        <Saver id={saver} />
      )}
    </div>
  );
}

export default function PowerOverlay({ onRestart }: { onRestart: () => void }) {
  const power = useOS((s) => s.power);
  const setPower = useOS((s) => s.setPower);
  const t = useT();
  const { profile } = useContent();
  if (power === 'on') return null;
  if (power === 'sleep') return <Screensaver onWake={() => setPower('on')} />;
  return (
    <div className="power power--off" role="dialog" aria-label={t('power.shutDown')}>
      <p className="power-title">{t('power.safe')}</p>
      <p className="power-sub">
        {t('power.thanks')}{' '}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <button type="button" className="btn btn--paper" autoFocus onClick={onRestart}>
        {t('power.on')}
      </button>
    </div>
  );
}
