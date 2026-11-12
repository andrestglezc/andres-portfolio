'use client';

// The interface language: a tiny external store, like the theme store in src/os/hooks.ts.
// English and Spanish. A choice is saved between visits; a first visit follows the browser.

import { useEffect, useSyncExternalStore } from 'react';

export type Lang = 'en' | 'es';

export const LANGS: readonly Lang[] = ['en', 'es'];

const LANG_KEY = 'nos-lang';
const listeners = new Set<() => void>();
let current: Lang | null = null;

const isLang = (v: unknown): v is Lang => v === 'en' || v === 'es';

/** Saved choice first, then the browser language: Spanish for any `es-*`, English otherwise. */
function detect(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  try {
    return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

/** The current language. English on the server. */
export function getLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  return (current ??= detect());
}

/** The language that is not `lang`: what the switch offers. */
export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'es' : 'en');

export function setLang(lang: Lang) {
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getLang,
    () => 'en',
  );
}

/** Apply the starting language to the document once on the client. */
export function useRestoreLang() {
  useEffect(() => {
    document.documentElement.lang = getLang();
  }, []);
}

/** Locale for dates and numbers: Spanish, or the English variant a caller already used. */
export const dateLocale = (lang: Lang, en = 'en-GB') => (lang === 'es' ? 'es' : en);
