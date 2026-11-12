'use client';

import { create } from 'zustand';
import { APPS, AppId, TOPBAR_H, DOCK_SPACE, EDGE } from './apps';
import type { CaseStudyKey } from '@/lib/content';
import { GenieFrames, measureGenie } from './genie';
import { playWhoosh, restoreMuted, setMuted as persistMuted } from '@/lib/audio';
import { useMusicStore } from '@/lib/musicStore';

export interface Win {
  id: string;
  app: AppId;
  /** Case-study key for the `case` app. Titles are resolved at render time (see useWinTitle). */
  study?: CaseStudyKey;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Screen point the window grew from (dock tile / card), for the open animation. */
  origin?: { x: number; y: number };
  /** Path of the last minimize, replayed backwards when the window is restored. */
  genie?: GenieFrames | null;
}

interface OpenOptions {
  study?: CaseStudyKey;
  origin?: { x: number; y: number };
  /** Preferred placement inside the work area. */
  place?: 'center' | 'right' | 'left';
  /** Exact left edge, clamped to the work area. Wins over `place`. */
  x?: number;
}

interface OSState {
  windows: Win[];
  zTop: number;
  paletteOpen: boolean;
  power: 'on' | 'sleep' | 'off';
  /** The README is a sticky note that enlarges over a dimmed desktop, not a window. */
  noteOpen: boolean;
  /** Whether Tecla, the mascot, is on screen. */
  mascotOn: boolean;
  /** Interface sounds off. Saved between visits. */
  muted: boolean;
  /** Which screensaver Sleep shows. Saved between visits. */
  saver: SaverChoice;
  /** Recruiter mode: the plain one-page summary is covering the OS. */
  recruiter: boolean;

  open: (app: AppId, opts?: OpenOptions) => void;
  close: (id: string) => void;
  closeAll: () => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setBounds: (id: string, b: Partial<Pick<Win, 'x' | 'y' | 'w' | 'h'>>) => void;
  /** Dock behaviour: open, restore, focus, or minimize if already frontmost. */
  toggleApp: (app: AppId, origin?: { x: number; y: number }) => void;
  setPalette: (open: boolean) => void;
  setPower: (p: OSState['power']) => void;
  setNote: (open: boolean) => void;
  setMascot: (on: boolean) => void;
  setMuted: (muted: boolean) => void;
  setSaver: (saver: SaverChoice) => void;
  setRecruiter: (on: boolean) => void;
  /** Keep every window reachable after the browser is resized. */
  fitToViewport: () => void;
}

const workArea = () => ({
  x: EDGE,
  y: TOPBAR_H + EDGE,
  w: Math.max(320, window.innerWidth - EDGE * 2),
  h: Math.max(240, window.innerHeight - TOPBAR_H - DOCK_SPACE - EDGE),
});

export const windowId = (app: AppId, study?: CaseStudyKey) => (app === 'case' && study ? `case-${study}` : app);

/** The frontmost visible window, or null. */
export const selectActiveId = (s: OSState): string | null => {
  let top: Win | null = null;
  for (const w of s.windows) if (!w.minimized && (!top || w.z > top.z)) top = w;
  return top ? top.id : null;
};

export const SAVER_CHOICES = ['logo', 'keycaps', 'starfield', 'pipes'] as const;
export type SaverChoice = (typeof SAVER_CHOICES)[number];
const SAVER_KEY = 'nos-saver';

function readSaver(): SaverChoice {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(SAVER_KEY) : null;
    if (saved && (SAVER_CHOICES as readonly string[]).includes(saved)) return saved as SaverChoice;
  } catch {
    /* storage unavailable */
  }
  return 'keycaps';
}

/** After a window goes away, put keyboard focus somewhere sensible instead of dropping it. */
const refocusAfter = (id: string, app: AppId) => {
  if (typeof document === 'undefined') return;
  setTimeout(() => {
    const now = document.activeElement;
    // The closing window lingers for its exit animation; focus still inside it counts as lost.
    const leaving = document.querySelector(`[data-win="${CSS.escape(id)}"]`);
    if (now && now !== document.body && !leaving?.contains(now)) return;
    const target =
      document.querySelector<HTMLElement>(`[data-dock-win="${CSS.escape(id)}"]`) ??
      document.querySelector<HTMLElement>(`[data-dock-app="${app}"]`) ??
      document.querySelector<HTMLElement>('.dock-tile');
    target?.focus({ preventScroll: true });
  }, 0);
};

export const useOS = create<OSState>((set, get) => ({
  windows: [],
  zTop: 10,
  paletteOpen: false,
  power: 'on',
  noteOpen: false,
  mascotOn: true,
  muted: typeof window !== 'undefined' ? restoreMuted() : false,
  saver: readSaver(),
  recruiter: false,

  open: (app, opts = {}) => {
    if (app === 'readme') {
      set({ noteOpen: true });
      return;
    }
    const id = windowId(app, opts.study);
    const existing = get().windows.find((w) => w.id === id);
    if (existing) {
      get().focus(id);
      return;
    }
    const def = APPS[app];
    const area = workArea();
    const w = Math.min(def.w, area.w);
    const h = Math.min(def.h, area.h);
    // Cascade so stacked windows never hide each other's title bars.
    const step = (get().windows.filter((x) => !x.minimized).length % 6) * 28;
    let x = area.x + (area.w - w) / 2 + step;
    if (opts.place === 'right') x = area.x + area.w - w - 24;
    if (opts.place === 'left') x = area.x + 24;
    if (opts.x !== undefined) x = opts.x;
    let y = area.y + (area.h - h) / 2 + step;
    x = Math.round(Math.min(Math.max(area.x, x), area.x + area.w - w));
    y = Math.round(Math.min(Math.max(area.y, y), area.y + area.h - h));
    playWhoosh('in');
    const z = get().zTop + 1;
    set((s) => ({
      zTop: z,
      windows: [
        ...s.windows,
        { id, app, study: opts.study, x, y, w, h, z, minimized: false, maximized: false, origin: opts.origin },
      ],
    }));
  },

  close: (id) => {
    const win = get().windows.find((w) => w.id === id);
    // However the Music window goes away (X, Escape, palette), the music goes with it.
    if (win?.app === 'music') useMusicStore.getState().stop();
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) }));
    if (win) {
      playWhoosh('out');
      refocusAfter(id, win.app);
    }
  },
  closeAll: () => {
    useMusicStore.getState().stop();
    set({ windows: [], noteOpen: false });
  },

  focus: (id) =>
    set((s) => {
      const win = s.windows.find((w) => w.id === id);
      if (!win) return s;
      if (!win.minimized && win.z === s.zTop) return s;
      if (win.minimized) playWhoosh('in');
      const z = s.zTop + 1;
      return { zTop: z, windows: s.windows.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)) };
    }),

  minimize: (id) => {
    // Measured here, in the click handler, so the animation knows where the dock tile is.
    const win = get().windows.find((w) => w.id === id);
    if (!win || win.minimized) return;
    const genie = measureGenie(id, win.app);
    playWhoosh('out');
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true, genie } : w)) }));
    refocusAfter(id, win.app);
  },

  toggleMaximize: (id) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) })),

  setBounds: (id, b) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, ...b } : w)) })),

  toggleApp: (app, origin) => {
    const s = get();
    // Case studies live under the Work tile: prefer the frontmost window of this app.
    const mine = s.windows.filter((w) => w.app === app).sort((a, b) => b.z - a.z)[0];
    if (!mine) {
      s.open(app, { origin });
      return;
    }
    if (!mine.minimized && selectActiveId(s) === mine.id) s.minimize(mine.id);
    else s.focus(mine.id);
  },

  setPalette: (open) => set({ paletteOpen: open }),
  setPower: (power) => {
    if (power === 'off') useMusicStore.getState().stop();
    set({ power });
  },
  setNote: (noteOpen) => set({ noteOpen }),
  setMascot: (mascotOn) => set({ mascotOn }),
  setSaver: (saver) => {
    try {
      localStorage.setItem(SAVER_KEY, saver);
    } catch {
      /* storage unavailable */
    }
    set({ saver });
  },
  setRecruiter: (recruiter) => set({ recruiter }),
  setMuted: (muted) => {
    persistMuted(muted);
    set({ muted });
  },

  fitToViewport: () =>
    set((s) => {
      const area = workArea();
      let changed = false;
      const windows = s.windows.map((w) => {
        const nw = Math.min(w.w, area.w);
        const nh = Math.min(w.h, area.h);
        const nx = Math.min(Math.max(area.x - nw + 120, w.x), area.x + area.w - 120);
        const ny = Math.min(Math.max(area.y, w.y), area.y + area.h - 48);
        if (nw === w.w && nh === w.h && nx === w.x && ny === w.y) return w;
        changed = true;
        return { ...w, w: nw, h: nh, x: nx, y: ny };
      });
      return changed ? { windows } : s;
    }),
}));

export { workArea };
