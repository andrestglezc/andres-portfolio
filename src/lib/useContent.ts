'use client';

import { ContentBundle, contentEn } from './content';
import { contentEs } from './content.es';
import { Lang, useLang } from './i18n';

const BUNDLES: Record<Lang, ContentBundle> = { en: contentEn, es: contentEs };

/** The page copy for a given language. */
export const contentFor = (lang: Lang): ContentBundle => BUNDLES[lang];

/** The page copy (profile, case studies, Tecla's facts…) in the current language. */
export function useContent(): ContentBundle {
  return BUNDLES[useLang()];
}
