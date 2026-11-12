'use client';

import { RefObject, useEffect, useState, useSyncExternalStore } from 'react';
import { Place, cityOf, placeOf, visitorTimeZone } from '@/lib/place';
import { useLang } from '@/lib/i18n';

const noop = () => () => {};

/** False during SSR and the hydration pass, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** "THU 03:56" ("JUE 03:56" in Spanish) in the given time zone, refreshed on the minute. */
export function useClock(timeZone: string) {
  const lang = useLang();
  const fmt = () => {
    const d = new Date();
    const day = d
      .toLocaleDateString(lang === 'es' ? 'es' : 'en-US', { weekday: 'short', timeZone })
      .replace('.', '')
      .toUpperCase();
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone });
    return `${day} ${time}`;
  };
  const [now, setNow] = useState('');
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    // Re-arm for just after each minute boundary so it never lags a seconds clock.
    const tick = () => {
      setNow(fmt());
      id = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 30);
    };
    id = setTimeout(tick, 0);
    const onVisible = () => !document.hidden && setNow(fmt());
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone, lang]);
  return now;
}

/**
 * Where the visitor is, read from their system time zone. The city is known at
 * once; the country (and the modern spelling of legacy zone names) arrives a
 * moment later, when the zone table has loaded. Client-only.
 */
export function usePlace(fallbackZone: string): Place {
  const [place, setPlace] = useState<Place>(() => {
    const timeZone = visitorTimeZone(fallbackZone);
    return { timeZone, city: cityOf(timeZone), country: null };
  });
  useEffect(() => {
    let live = true;
    placeOf(place.timeZone).then((p) => live && setPlace(p));
    return () => {
      live = false;
    };
  }, [place.timeZone]);
  return place;
}

/**
 * While `active`, remember what had focus; when it ends, hand focus back if
 * nothing else has claimed it. Used by every layer that opens over the page.
 */
export function useReturnFocus(active: boolean) {
  // Read the opener while rendering: by the first effect, autoFocus or `inert` has already moved focus.
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const [wasActive, setWasActive] = useState(false);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setOpener(document.activeElement as HTMLElement | null);
  }
  useEffect(() => {
    if (!active) return;
    return () => {
      setTimeout(() => {
        const now = document.activeElement;
        // The closing layer lingers for its exit animation; focus still inside it counts as lost.
        const lost = !now || now === document.body || !!now.closest('[aria-modal="true"]');
        if (opener?.isConnected && lost) opener.focus({ preventScroll: true });
      }, 0);
    };
  }, [active, opener]);
}

/** Close a popover on outside press or Escape. Escape stops there so it does not also close a window. */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      close();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}

// ─── Theme ───────────────────────────────────────────────────────────────────

// Names are interface strings: t(`theme.${id}`).
export const THEMES = [
  { id: 'teal98', swatch: ['#008080', '#FFD60A'] },
  { id: 'paper', swatch: ['#EFEDE8', '#FF2E4D'] },
  { id: 'ink', swatch: ['#0E0E10', '#C9F27B'] },
] as const;
export type ThemeId = (typeof THEMES)[number]['id'];

export const DEFAULT_THEME: ThemeId = 'teal98';

const THEME_KEY = 'nos-theme';
const themeListeners = new Set<() => void>();

function readTheme(): ThemeId {
  const t = document.documentElement.dataset.theme;
  return THEMES.some((x) => x.id === t) ? (t as ThemeId) : DEFAULT_THEME;
}

export function setTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch {
    /* storage unavailable */
  }
  themeListeners.forEach((l) => l());
}

export function useTheme(): ThemeId {
  return useSyncExternalStore(
    (cb) => {
      themeListeners.add(cb);
      return () => themeListeners.delete(cb);
    },
    readTheme,
    () => DEFAULT_THEME,
  );
}

/** Restore the saved theme once on the client. */
export function useRestoreTheme() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved && THEMES.some((x) => x.id === saved)) setTheme(saved as ThemeId);
    } catch {
      /* storage unavailable */
    }
  }, []);
}
