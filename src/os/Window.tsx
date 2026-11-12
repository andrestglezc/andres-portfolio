'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useOS, selectActiveId, workArea, Win } from './store';
import { APPS, TOPBAR_H, DOCK_SPACE } from './apps';
import Icon from './Icon';
import AppHost from './AppHost';
import { reverseGenie } from './genie';
import { useWinTitle } from './titles';
import { useMusicStore } from '@/lib/musicStore';
import { useT } from '@/lib/strings';

type ResizeDir = 'e' | 's' | 'se' | 'w' | 'sw';

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.9 };

export default function Window({ win }: { win: Win }) {
  const focus = useOS((s) => s.focus);
  const close = useOS((s) => s.close);
  const minimize = useOS((s) => s.minimize);
  const toggleMaximize = useOS((s) => s.toggleMaximize);
  const setBounds = useOS((s) => s.setBounds);
  const active = useOS((s) => selectActiveId(s) === win.id);
  const reduce = useReducedMotion();
  const def = APPS[win.app];
  const t = useT();
  const winTitle = useWinTitle();
  const title = winTitle(win);

  // `smooth` turns on CSS transitions for bounds only while (un)maximizing,
  // so dragging and resizing stay 1:1 with the pointer.
  const [smooth, setSmooth] = useState(false);
  const smoothTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragging, setDragging] = useState(false);

  const onMaximize = () => {
    setSmooth(true);
    if (smoothTimer.current) clearTimeout(smoothTimer.current);
    smoothTimer.current = setTimeout(() => setSmooth(false), 380);
    toggleMaximize(win.id);
  };

  // Keyboard focus follows the active window, so opening or switching never strands it.
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!active || win.minimized) return;
    const el = ref.current;
    if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
  }, [active, win.minimized]);

  const glide = () => {
    setSmooth(true);
    if (smoothTimer.current) clearTimeout(smoothTimer.current);
    smoothTimer.current = setTimeout(() => setSmooth(false), 380);
  };

  // Arrange: a one-click alternative to dragging. Cycles left half, right half, centred.
  const arrangeStep = useRef(0);
  const onArrange = () => {
    const a = workArea();
    const half = Math.max(def.minW, Math.floor(a.w / 2) - 4);
    const w = Math.min(def.w, a.w);
    const h = Math.min(def.h, a.h);
    const spots = [
      { x: a.x, y: a.y, w: half, h: a.h },
      { x: a.x + a.w - half, y: a.y, w: half, h: a.h },
      { x: Math.round(a.x + (a.w - w) / 2), y: Math.round(a.y + (a.h - h) / 2), w, h },
    ];
    glide();
    if (win.maximized) toggleMaximize(win.id);
    setBounds(win.id, spots[arrangeStep.current++ % spots.length]);
  };

  // Alt + arrows move the window, Alt + Shift + arrows resize it.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!e.altKey || win.maximized || !e.key.startsWith('Arrow')) return;
    e.preventDefault();
    const dx = e.key === 'ArrowLeft' ? -24 : e.key === 'ArrowRight' ? 24 : 0;
    const dy = e.key === 'ArrowUp' ? -24 : e.key === 'ArrowDown' ? 24 : 0;
    if (e.shiftKey) {
      setBounds(win.id, {
        w: Math.max(def.minW, win.w + dx),
        h: Math.max(def.minH, Math.min(win.h + dy, window.innerHeight - win.y - 8)),
      });
    } else {
      setBounds(win.id, {
        x: Math.min(Math.max(win.x + dx, 120 - win.w), window.innerWidth - 120),
        y: Math.min(Math.max(win.y + dy, TOPBAR_H + 4), window.innerHeight - DOCK_SPACE - 36),
      });
    }
  };

  const onClose = () => {
    if (win.app === 'music') useMusicStore.getState().stop();
    close(win.id);
  };

  // ── Drag (pointer events: mouse, pen and touch) ──
  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.button !== 0) return;
    focus(win.id);
    if (win.maximized) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const dx = e.clientX - win.x;
    const dy = e.clientY - win.y;
    setDragging(true);
    const move = (ev: PointerEvent) => {
      const x = Math.min(Math.max(ev.clientX - dx, 120 - win.w), window.innerWidth - 120);
      const y = Math.min(Math.max(ev.clientY - dy, TOPBAR_H + 4), window.innerHeight - DOCK_SPACE - 36);
      setBounds(win.id, { x, y });
    };
    const up = () => {
      setDragging(false);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  // ── Resize ──
  const startResize = (dir: ResizeDir) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (win.maximized || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    focus(win.id);
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const start = { px: e.clientX, py: e.clientY, x: win.x, w: win.w, h: win.h };
    setDragging(true);
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.px;
      const dy = ev.clientY - start.py;
      const next: Partial<Pick<Win, 'x' | 'w' | 'h'>> = {};
      if (dir.includes('e')) next.w = Math.max(def.minW, start.w + dx);
      if (dir.includes('w')) {
        const w = Math.max(def.minW, start.w - dx);
        next.w = w;
        next.x = start.x + (start.w - w);
      }
      if (dir.includes('s')) next.h = Math.max(def.minH, Math.min(start.h + dy, window.innerHeight - win.y - 8));
      setBounds(win.id, next);
    };
    const up = () => {
      setDragging(false);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  // Grow from where the visitor clicked (dock tile, card, icon).
  const from = win.origin
    ? { x: win.origin.x - (win.x + win.w / 2), y: win.origin.y - (win.y + win.h / 2), scale: 0.18 }
    : { x: 0, y: 28, scale: 0.94 };

  // Minimize pours the window into its dock tile; restore plays the same path backwards.
  const genie = win.genie;
  const variants = useMemo(() => {
    if (reduce) {
      return {
        initial: { opacity: 0 },
        open: { opacity: 1, display: 'flex' },
        min: { opacity: 0, transitionEnd: { display: 'none' } },
        exit: { opacity: 0 },
      };
    }
    const exit = { opacity: 0, scale: 0.94, y: 12, transition: { duration: 0.16, ease: 'easeIn' as const } };
    if (!genie) {
      return {
        initial: { opacity: 0, ...from },
        open: { opacity: 1, x: 0, y: 0, scale: 1, scaleY: 1, display: 'flex' },
        min: { opacity: 0, scale: 0.2, y: '55vh', transitionEnd: { display: 'none' } },
        exit,
      };
    }
    return {
      initial: { opacity: 0, ...from },
      open: {
        ...reverseGenie(genie),
        scale: 1,
        display: 'flex',
        transition: { duration: 0.42, ease: 'linear' as const },
        transitionEnd: { clipPath: 'none' },
      },
      min: {
        ...genie,
        scale: 1,
        transition: { duration: 0.52, ease: 'linear' as const },
        transitionEnd: { display: 'none' },
      },
      exit,
    };
    // `from` only matters for the first open, which happens before any genie exists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, genie]);

  const cls = ['win', active && 'is-active', win.maximized && 'is-max', smooth && 'is-smooth', dragging && 'is-dragging']
    .filter(Boolean)
    .join(' ');

  return (
    <motion.section
      ref={ref}
      tabIndex={-1}
      className={cls}
      role="dialog"
      aria-label={title}
      aria-hidden={win.minimized}
      data-win={win.id}
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        // A window on its way to the dock must not catch a click and pop back.
        pointerEvents: win.minimized ? 'none' : undefined,
      }}
      variants={variants}
      initial="initial"
      animate={win.minimized ? 'min' : 'open'}
      exit="exit"
      transition={reduce ? { duration: 0.15 } : SPRING}
      onPointerDownCapture={() => focus(win.id)}
      // Tabbing into a window behind another brings it forward, so focus is never hidden.
      onFocusCapture={() => !win.minimized && focus(win.id)}
      onKeyDown={onKeyDown}
    >
      <header className="win-bar" onPointerDown={startDrag} onDoubleClick={onMaximize}>
        <button
          type="button"
          className="win-chip"
          style={{ background: def.tint }}
          aria-label={t('win.arrange', { title })}
          title={t('win.arrangeTip')}
          onClick={onArrange}
        >
          <Icon name={def.icon} size={14} strokeWidth={2} />
        </button>
        <span className="win-title">{title}</span>
        <span className="win-controls">
          <button type="button" className="win-btn" aria-label={t('win.minimize', { title })} onClick={() => minimize(win.id)}>
            <Icon name="minus" size={14} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className="win-btn"
            aria-label={t(win.maximized ? 'win.restore' : 'win.maximize', { title })}
            onClick={onMaximize}
          >
            <Icon name={win.maximized ? 'shrink' : 'expand'} size={13} strokeWidth={2.25} />
          </button>
          <button type="button" className="win-btn win-btn--close" aria-label={t('win.close', { title })} onClick={onClose}>
            <Icon name="close" size={14} strokeWidth={2.25} />
          </button>
        </span>
      </header>

      <div className="win-body">
        <AppHost win={win} />
      </div>

      {!win.maximized && (
        <>
          <div className="win-rs win-rs--e" onPointerDown={startResize('e')} />
          <div className="win-rs win-rs--w" onPointerDown={startResize('w')} />
          <div className="win-rs win-rs--s" onPointerDown={startResize('s')} />
          <div className="win-rs win-rs--sw" onPointerDown={startResize('sw')} />
          <div className="win-rs win-rs--se" onPointerDown={startResize('se')} />
        </>
      )}
    </motion.section>
  );
}
