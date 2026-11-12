'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useOS } from './store';
import { APPS, AppId, appHint, appTitle } from './apps';
import { THEMES, setTheme, useReturnFocus } from './hooks';
import Icon, { IconName } from './Icon';
import { useContent } from '@/lib/useContent';
import { Lang, otherLang, setLang, useLang } from '@/lib/i18n';
import { translate, useT } from '@/lib/strings';

/** Lower case without accents, so "musica" finds "Música". */
const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

interface Item {
  id: string;
  label: string;
  hint: string;
  group: 'apps' | 'cases' | 'actions';
  icon: IconName;
  run: () => void;
  /** Set when the label is in another language than the page (the language switch). */
  lang?: Lang;
}

export default function CommandPalette({ onRestart }: { onRestart: () => void }) {
  const open = useOS((s) => s.open);
  const setPalette = useOS((s) => s.setPalette);
  const setPower = useOS((s) => s.setPower);
  const setRecruiter = useOS((s) => s.setRecruiter);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  useReturnFocus(true);
  const t = useT();
  const lang = useLang();
  const { caseStudies, caseStudyOrder, profile } = useContent();

  const items = useMemo<Item[]>(() => {
    const apps: Item[] = (Object.keys(APPS) as AppId[])
      .filter((id) => id !== 'case')
      .map((id) => ({ id, label: appTitle(id, t), hint: appHint(id, t), group: 'apps', icon: APPS[id].icon, run: () => open(id) }));
    const studies: Item[] = caseStudyOrder.map((key) => ({
      id: `case-${key}`,
      label: caseStudies[key].name,
      hint: `${caseStudies[key].kicker} · ${caseStudies[key].tags.join(', ')}`,
      group: 'cases',
      icon: 'file',
      run: () => open('case', { study: key }),
    }));
    const next = otherLang(lang);
    const actions: Item[] = [
      { id: 'lang', label: translate(next, 'lang.switchTo'), hint: t('lang.hint'), group: 'actions', icon: 'globe', lang: next, run: () => setLang(next) },
      { id: 'recruiter', label: t('common.recruiterMode'), hint: t('palette.recruiterHint'), group: 'actions', icon: 'print', run: () => setRecruiter(true) },
      { id: 'cv', label: t('common.downloadCv'), hint: 'PDF', group: 'actions', icon: 'download', run: () => {
        const a = document.createElement('a');
        a.href = profile.resumeUrl;
        a.download = profile.resumeFilename;
        a.click();
      } },
      { id: 'email', label: t('palette.email'), hint: profile.email, group: 'actions', icon: 'mail', run: () => { window.location.href = `mailto:${profile.email}`; } },
      { id: 'li', label: t('palette.linkedin'), hint: profile.linkedinLabel, group: 'actions', icon: 'linkedin', run: () => { window.open(profile.linkedin, '_blank', 'noopener,noreferrer'); } },
      ...THEMES.map((th): Item => ({ id: `theme-${th.id}`, label: t('palette.theme', { name: t(`theme.${th.id}`) }), hint: t('palette.themeHint'), group: 'actions', icon: 'palette', run: () => setTheme(th.id) })),
      { id: 'sleep', label: t('power.sleep'), hint: t('palette.sleepHint'), group: 'actions', icon: 'moon', run: () => setPower('sleep') },
      { id: 'restart', label: t('power.restart'), hint: t('palette.restartHint'), group: 'actions', icon: 'refresh', run: onRestart },
      { id: 'off', label: t('power.shutDown'), hint: t('palette.offHint'), group: 'actions', icon: 'power', run: () => setPower('off') },
    ];
    return [...apps, ...studies, ...actions];
  }, [open, setPower, setRecruiter, onRestart, t, lang, caseStudies, caseStudyOrder, profile]);

  const groupLabel = (g: Item['group']) => t(`palette.group.${g}`);
  const q = fold(query.trim());
  const results = q ? items.filter((it) => fold(`${it.label} ${it.hint} ${groupLabel(it.group)}`).includes(q)) : items;
  const current = Math.min(index, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [current]);

  const run = (it: Item | undefined) => {
    if (!it) return;
    setPalette(false);
    it.run();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex(Math.min(current + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex(Math.max(current - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[current]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setPalette(false);
    } else if (e.key === 'Tab') {
      // One tab stop: focus stays in the search field while the palette is open.
      e.preventDefault();
    }
  };

  return (
    <motion.div
      className="palette-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      onPointerDown={(e) => e.target === e.currentTarget && setPalette(false)}
    >
      <motion.div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label={t('palette.label')}
        initial={{ opacity: 0, y: -14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 520, damping: 36 }}
      >
        <div className="palette-input">
          <Icon name="search" size={18} />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKey}
            placeholder={t('palette.placeholder')}
            aria-label={t('palette.inputLabel')}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={results[current] ? `palette-opt-${results[current].id}` : undefined}
          />
          <kbd>esc</kbd>
        </div>
        <p className="sr-only" role="status">
          {q
            ? results.length === 0
              ? t('palette.noResults', { query })
              : t(results.length === 1 ? 'palette.results.one' : 'palette.results.other', { n: results.length })
            : ''}
        </p>
        <ul className="palette-list" id="palette-list" role="listbox" ref={listRef}>
          {results.length === 0 && <li className="palette-empty" role="presentation">{t('palette.empty', { query })}</li>}
          {results.map((it, i) => (
            <li key={it.id} id={`palette-opt-${it.id}`} role="option" aria-selected={i === current} aria-label={`${it.label}, ${it.hint}`} lang={it.lang}>
              {(i === 0 || results[i - 1].group !== it.group) && <div className="palette-group" aria-hidden="true" lang={it.lang && lang}>{groupLabel(it.group)}</div>}
              <button
                type="button"
                tabIndex={-1}
                className={`palette-item${i === current ? ' is-current' : ''}`}
                onPointerMove={() => setIndex(i)}
                onClick={() => run(it)}
              >
                <Icon name={it.icon} size={17} />
                <span className="palette-label">{it.label}</span>
                <span className="palette-hint">{it.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
