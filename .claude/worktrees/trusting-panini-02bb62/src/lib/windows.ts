// src/lib/windows.ts
// Zustand store for the window manager

import { create } from 'zustand';

export type WindowId = string;

export type AppType =
  | 'home'
  | 'finder'
  | 'textfile'
  | 'jsonfile'
  | 'casestudy'
  | 'contact'
  | 'resume'
  | 'about'
  | 'doom'
  | 'aoe'
  | 'sims'
  | 'sysinfo'
  | 'find'
  | 'run'
  | 'help'
  | 'shutdown'
  | 'music'
  | 'shrine';

export interface WindowConfig {
  id: WindowId;
  title: string;
  app: AppType;
  props?: Record<string, unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  previousBounds?: { x: number; y: number; width: number; height: number };
}

export interface WindowStore {
  windows: WindowConfig[];
  activeWindowId: WindowId | null;

  openWindow: (config: Omit<WindowConfig, 'zIndex' | 'isMinimized' | 'isMaximized'> & { zIndex?: number }) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, x: number, y: number) => void;
  resizeWindow: (id: WindowId, width: number, height: number) => void;
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  closeAll: () => void;
  setWindowZIndex: (id: WindowId, zIndex: number) => void;
}

let zCounter = 10;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,

  openWindow: (config) => {
    const { windows } = get();
    // If window with same id already open, just focus it
    if (windows.find(w => w.id === config.id)) {
      get().focusWindow(config.id);
      return;
    }
    set(state => ({
      windows: [
        ...state.windows,
        {
          ...config,
          zIndex: config.zIndex ?? ++zCounter,
          isMinimized: false,
          isMaximized: false,
        },
      ],
      activeWindowId: config.id,
    }));
  },

  closeWindow: (id) =>
    set(state => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindowId:
        state.activeWindowId === id
          ? state.windows[state.windows.length - 2]?.id ?? null
          : state.activeWindowId,
    })),

  focusWindow: (id) =>
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, zIndex: ++zCounter, isMinimized: false } : w
      ),
      activeWindowId: id,
    })),

  moveWindow: (id, x, y) =>
    set(state => ({
      windows: state.windows.map(w => (w.id === id ? { ...w, x, y } : w)),
    })),

  resizeWindow: (id, width, height) =>
    set(state => ({
      windows: state.windows.map(w => (w.id === id ? { ...w, width, height } : w)),
    })),

  minimizeWindow: (id) =>
    set(state => ({
      windows: state.windows.map(w => (w.id === id ? { ...w, isMinimized: true } : w)),
      activeWindowId:
        state.activeWindowId === id ? null : state.activeWindowId,
    })),

  restoreWindow: (id) =>
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMinimized: false, zIndex: ++zCounter } : w
      ),
      activeWindowId: id,
    })),

  maximizeWindow: (id) =>
    set(state => ({
      windows: state.windows.map(w => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            ...(w.previousBounds ?? {}),
            previousBounds: undefined,
          };
        }
        // Maximize (taskbar is 42px at bottom)
        return {
          ...w,
          isMaximized: true,
          previousBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 42,
        };
      }),
    })),

  closeAll: () => set({ windows: [], activeWindowId: null }),

  setWindowZIndex: (id, zIndex) =>
    set(state => ({
      windows: state.windows.map(w => w.id === id ? { ...w, zIndex } : w),
    })),
}));

// Helpers for opening specific windows with sane defaults
export function defaultWindowProps(
  app: AppType,
  props?: Record<string, unknown>
): Omit<WindowConfig, 'zIndex' | 'isMinimized' | 'isMaximized'> {
  const base = {
    id: `${app}-${Date.now()}`,
    app,
    props,
    x: 80 + Math.random() * 60,
    y: 60 + Math.random() * 40,
  };

  const sizes: Record<AppType, { width: number; height: number; title: string }> = {
    home:      { width: 1188, height: 670, title: 'Hello World!' },
    finder:    { width: 520, height: 380, title: 'Finder' },
    textfile:  { width: 480, height: 360, title: 'TextEdit' },
    jsonfile:  { width: 480, height: 400, title: 'skills.json' },
    casestudy: { width: 780, height: 540, title: 'Case Study' },
    contact:   { width: 420, height: 340, title: 'Contact' },
    resume:    { width: 780, height: 680, title: 'Resume.pdf' },
    about:     { width: 480, height: 400, title: 'About Me' },
    doom:      { width: 640, height: 480, title: 'DOOM.exe' },
    aoe:       { width: 640, height: 480, title: 'Age of Empires.exe' },
    sims:      { width: 640, height: 480, title: 'The Sims.exe' },
    sysinfo:   { width: 420, height: 380, title: 'System Properties' },
    find:      { width: 380, height: 320, title: 'Find: All Files' },
    run:       { width: 340, height: 320, title: 'Run' },
    help:      { width: 480, height: 400, title: 'Windows Help' },
    shutdown:  { width: 420, height: 320, title: 'Shut Down Nostalgia OS' },
    music:     { width: 459, height: 560, title: 'Music Player' },
    shrine:    { width: 360, height: 620, title: "O'malley 🕯️" },
  };

  return { ...base, ...sizes[app] };
}
