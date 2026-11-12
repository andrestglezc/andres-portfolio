'use client';

import { useEffect, useState } from 'react';
import { useOS, selectActiveId } from './store';
import { APPS, DOCK_APPS, AppId, appTitle } from './apps';
import Icon from './Icon';
import { useWinTitle } from './titles';
import CardArt from '@/apps/CardArt';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

const centerOf = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export default function Dock() {
  const windows = useOS((s) => s.windows);
  const activeId = useOS(selectActiveId);
  const toggleApp = useOS((s) => s.toggleApp);
  const focus = useOS((s) => s.focus);
  const minimize = useOS((s) => s.minimize);
  const t = useT();
  const winTitle = useWinTitle();
  const { caseStudies } = useContent();
  // Escape hides the hover labels until the pointer or focus leaves the dock.
  const [labelsOff, setLabelsOff] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLabelsOff(true);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Windows that do not belong to a pinned tile get their own tile while open.
  const extras = windows.filter((w) => !APPS[w.app].dock);

  const tile = (app: AppId) => {
    const def = APPS[app];
    const title = appTitle(app, t);
    const mine = windows.filter((w) => w.app === app);
    const running = mine.length > 0;
    const isActive = mine.some((w) => w.id === activeId);
    return (
      <button
        key={app}
        type="button"
        className={`dock-tile${isActive ? ' is-active' : ''}`}
        aria-label={title}
        data-dock-app={app}
        onClick={(e) => toggleApp(app, centerOf(e.currentTarget))}
      >
        <span className="dock-face" style={{ background: def.tint }}>
          <Icon name={def.icon} size={24} />
        </span>
        <span className="dock-label">{title}</span>
        <span className={`dock-dot${running ? ' is-on' : ''}`} />
      </button>
    );
  };

  return (
    <nav
      className={`dock${labelsOff ? ' labels-off' : ''}`}
      aria-label={t('dock.label')}
      onPointerLeave={() => setLabelsOff(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setLabelsOff(false)}
    >
      {DOCK_APPS.map(tile)}
      {extras.length > 0 && <span className="dock-sep" />}
      {extras.map((w) => {
        const def = APPS[w.app];
        const title = winTitle(w);
        const isActive = w.id === activeId;
        return (
          <button
            key={w.id}
            type="button"
            className={`dock-tile${isActive ? ' is-active' : ''}`}
            aria-label={title}
            data-dock-win={w.id}
            onClick={() => (isActive ? minimize(w.id) : focus(w.id))}
          >
            {w.app === 'case' && w.study ? (
              <span className="dock-face dock-face--art">
                <CardArt art={caseStudies[w.study].art} />
              </span>
            ) : (
              <span className="dock-face" style={{ background: def.tint }}>
                <Icon name={def.icon} size={24} />
              </span>
            )}
            <span className="dock-label">{title}</span>
            <span className="dock-dot is-on" />
          </button>
        );
      })}
    </nav>
  );
}
