'use client';

import Icon from './Icon';
import { otherLang, setLang, useLang } from '@/lib/i18n';
import { translate } from '@/lib/strings';

/**
 * Switches the whole site to the other language: a globe and that language's code
 * ("ES" while in English, "EN" while in Spanish). The name is said in the language it
 * offers, so the button carries that `lang` for screen readers.
 */
export default function LangToggle({ className, iconSize = 16 }: { className: string; iconSize?: number }) {
  const next = otherLang(useLang());
  const label = translate(next, 'lang.switchTo');
  return (
    <button type="button" className={className} lang={next} aria-label={label} title={label} onClick={() => setLang(next)}>
      <Icon name="globe" size={iconSize} />
      <span>{next.toUpperCase()}</span>
    </button>
  );
}
