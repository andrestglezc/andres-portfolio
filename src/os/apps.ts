// App registry: one entry per app. Sizes, dock placement and icon all live here
// so every launcher (dock, desktop, palette, menus) agrees. Titles and hints are
// interface strings (src/lib/strings.ts), resolved at render time with appTitle / appHint.
import type { IconName } from './Icon';
import type { T } from '@/lib/strings';

export type AppId =
  | 'about'
  | 'work'
  | 'case'
  | 'resume'
  | 'contact'
  | 'music'
  | 'arcade'
  | 'shrine'
  | 'readme'
  | 'now'
  | 'system';

export interface AppDef {
  icon: IconName;
  /** Tile colour token (see globals.css). */
  tint: string;
  w: number;
  h: number;
  minW: number;
  minH: number;
  dock: boolean;
}

export const APPS: Record<AppId, AppDef> = {
  about:   { icon: 'user',    tint: 'var(--c-sun)',    w: 860,  h: 620, minW: 360, minH: 320, dock: true },
  work:    { icon: 'grid',    tint: 'var(--c-cobalt)', w: 980,  h: 660, minW: 360, minH: 320, dock: true },
  case:    { icon: 'file',    tint: 'var(--c-cobalt)', w: 1040, h: 680, minW: 360, minH: 320, dock: false },
  resume:  { icon: 'doc',     tint: 'var(--c-paper)',  w: 780,  h: 700, minW: 360, minH: 320, dock: true },
  contact: { icon: 'mail',    tint: 'var(--c-lime)',   w: 520,  h: 520, minW: 320, minH: 320, dock: true },
  music:   { icon: 'music',   tint: 'var(--c-pink)',   w: 380,  h: 600, minW: 320, minH: 420, dock: true },
  arcade:  { icon: 'gamepad', tint: 'var(--c-tomato)', w: 680,  h: 540, minW: 360, minH: 320, dock: true },
  shrine:  { icon: 'paw',     tint: 'var(--c-sand)',   w: 380,  h: 640, minW: 320, minH: 400, dock: false },
  readme:  { icon: 'note',    tint: 'var(--c-paper)',  w: 440,  h: 500, minW: 320, minH: 300, dock: false },
  now:     { icon: 'sparkle', tint: 'var(--c-lime)',   w: 620,  h: 600, minW: 320, minH: 320, dock: false },
  system:  { icon: 'chip',    tint: 'var(--c-teal)',   w: 480,  h: 520, minW: 340, minH: 380, dock: false },
};

/** The app's name in the current language ("About", "Sobre mí"). */
export const appTitle = (app: AppId, t: T) => t(`app.${app}.title`);

/** One-line description for the command palette. */
export const appHint = (app: AppId, t: T) => t(`app.${app}.hint`);

export const DOCK_APPS = (Object.keys(APPS) as AppId[]).filter((id) => APPS[id].dock);

export const OS_NAME = 'Nostalgia OS';
export const OS_VERSION = '2.0';

// Layout constants shared by the store (maximize bounds) and CSS (via inline vars).
export const TOPBAR_H = 44;
export const DOCK_SPACE = 92;
export const EDGE = 8;
