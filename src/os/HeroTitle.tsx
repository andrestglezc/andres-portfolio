'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Icon from './Icon';
import { useContent } from '@/lib/useContent';
import { useLang } from '@/lib/i18n';
import { useT } from '@/lib/strings';

/** How long a headline stays before the next one arrives. */
const DWELL_MS = 7000;
const TYPE_MS = 42;

type Mode = 'classic' | 'terminal';

/** Scale a phrase down so its longest line fits where the first headline fits. */
const fitOf = (lines: readonly string[], mode: Mode) => {
  const longest = Math.max(...lines.map((l) => l.length));
  return mode === 'classic' ? Math.min(1, 20 / longest) : Math.min(1, 23 / (longest + 2));
};

/** Garamond lettering: every letter pops in, then joins a wave that rolls through now and then. */
function Classic({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line, li) => {
        const words = line.split(' ');
        // Running letter index across the whole phrase, used to stagger the animation.
        const lineStart = lines.slice(0, li).join('').replace(/ /g, '').length;
        return (
          <span key={li} className={`hero-line hero-line--${li + 1}`}>
            {words.map((word, wi) => {
              const wordStart = lineStart + words.slice(0, wi).join('').length;
              return (
                <span key={wi} className="hero-word">
                  {[...word].map((ch, ci) => (
                    <span key={ci} className="hl" style={{ '--n': wordStart + ci } as React.CSSProperties}>
                      {ch}
                    </span>
                  ))}
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

/** Terminal lettering: the phrase is typed out behind a blinking caret. */
function Terminal({ lines, instant }: { lines: readonly string[]; instant: boolean }) {
  const total = lines.reduce((sum, l) => sum + l.length, 0);
  const [typed, setTyped] = useState(instant ? total : 0);

  useEffect(() => {
    if (instant) return;
    const id = setInterval(() => {
      setTyped((t) => {
        if (t + 1 >= total) clearInterval(id);
        return Math.min(total, t + 1);
      });
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [instant, total]);

  return (
    <>
      {lines.map((line, li) => {
        const start = lines.slice(0, li).reduce((sum, l) => sum + l.length, 0);
        const shown = Math.max(0, Math.min(line.length, typed - start));
        // The caret sits on the line being typed, and rests at the very end once done.
        const hasCaret = typed >= start && (typed < start + line.length || li === lines.length - 1);
        return (
          <span key={li} className={`hero-line hero-line--${li + 1}`}>
            {line.slice(0, shown)}
            {hasCaret && <span className="hero-caret" />}
            {/* The untyped rest holds its space so nothing shifts while typing. */}
            <span className="hero-untyped">{line.slice(shown)}</span>
          </span>
        );
      })}
    </>
  );
}

/**
 * The headline rotates through a set of phrases, alternating between the
 * Garamond pop-in and a typed terminal line. Click it to skip ahead. It pauses
 * while hovered or focused, and has its own pause button.
 */
export default function HeroTitle() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const lang = useLang();
  const { headlines } = useContent();

  const lines = headlines[step % headlines.length];
  const mode: Mode = step % 2 === 0 ? 'classic' : 'terminal';
  const chars = lines.reduce((sum, l) => sum + l.length, 0);

  // People who ask for less motion get a still headline they can advance by hand.
  const rotating = !reduce && !paused && !held;
  useEffect(() => {
    if (!rotating) return;
    const wait = DWELL_MS + (mode === 'terminal' ? chars * TYPE_MS : 0);
    const id = setTimeout(() => setStep((s) => s + 1), wait);
    return () => clearTimeout(id);
  }, [rotating, step, mode, chars]);

  return (
    <div
      className="hero-title-wrap"
      ref={wrapRef}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => !wrapRef.current?.contains(e.relatedTarget as Node) && setHeld(false)}
    >
      <h1 className={`hero-title hero-title--${mode}`} style={{ '--fit': fitOf(lines, mode) } as React.CSSProperties}>
        {/* Screen readers get one stable heading; the rotating lettering is decorative. */}
        <span className="sr-only">{headlines[0].join(' ')}</span>
        <button
          type="button"
          className="hero-btn"
          aria-label={t('hero.next')}
          title={t('hero.nextTip')}
          onClick={() => setStep((s) => s + 1)}
        >
          {/* Remounting on each step (and on a language switch) replays the entrance. */}
          <span key={`${lang}-${step}`} className="hero-lines" aria-hidden="true">
            {mode === 'classic' ? <Classic lines={lines} /> : <Terminal lines={lines} instant={!!reduce} />}
          </span>
        </button>
      </h1>
      {!reduce && (
        <button
          type="button"
          className="hero-pause"
          aria-pressed={paused}
          aria-label={t(paused ? 'hero.play' : 'hero.pause')}
          title={t(paused ? 'common.play' : 'common.pause')}
          onClick={() => setPaused((p) => !p)}
        >
          <Icon name={paused ? 'play' : 'pause'} size={14} />
        </button>
      )}
    </div>
  );
}
