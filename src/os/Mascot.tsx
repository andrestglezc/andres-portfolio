'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';
import { useOS, selectActiveId } from './store';
import { useDismiss } from './hooks';
import { profile, MascotFact } from '@/lib/content';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

type Cta = NonNullable<MascotFact['cta']>;

const GREETED_KEY = 'nos-tecla';
/** How long without any input before she nods off. */
const IDLE_MS = 45_000;

/**
 * Tecla herself: a keycap in pearl-white plastic with soft studio shading. A
 * flared skirt, a raised top face with a shallow dish, and two round
 * eyes. No mouth, no limbs. Her eyes (and, a little, her whole top face) follow
 * the pointer around the screen.
 */
function Tecla({ party }: { party: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const [asleep, setAsleep] = useState(false);
  // While she is looking at a window, the pointer does not steer her eyes.
  const holdUntil = useRef(0);

  // Eyes follow the pointer.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lookAt = (x: number, y: number) => {
      const el = svg.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const dx = x - (box.left + box.width / 2);
      const dy = y - (box.top + box.height / 2);
      // Full deflection is reached quickly, so the gaze is obvious anywhere on screen.
      const reach = Math.min(1, Math.hypot(dx, dy) / 140);
      const angle = Math.atan2(dy, dx);
      el.style.setProperty('--look-x', (Math.cos(angle) * reach).toFixed(3));
      el.style.setProperty('--look-y', (Math.sin(angle) * reach).toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      if (performance.now() >= holdUntil.current) lookAt(e.clientX, e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // A window opening or coming forward catches her eye for a moment.
    let last = selectActiveId(useOS.getState());
    let timer: ReturnType<typeof setTimeout>;
    const unsubscribe = useOS.subscribe((state) => {
      const id = selectActiveId(state);
      if (id === last) return;
      last = id;
      if (!id) return;
      clearTimeout(timer);
      // Wait a beat so a newly opened window has been laid out.
      timer = setTimeout(() => {
        const win = document.querySelector(`[data-win="${CSS.escape(id)}"]`)?.getBoundingClientRect();
        const el = svg.current;
        if (!win || !el) return;
        holdUntil.current = performance.now() + 1500;
        lookAt(win.left + win.width / 2, win.top + win.height / 3);
        el.classList.remove('is-noticing');
        void el.getBoundingClientRect(); // restart the hop
        el.classList.add('is-noticing');
      }, 80);
    });
    return () => {
      window.removeEventListener('pointermove', onMove);
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // She dozes off when nothing has happened for a while, and wakes at the first sign of life.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const stir = () => {
      setAsleep(false);
      clearTimeout(timer);
      timer = setTimeout(() => setAsleep(true), IDLE_MS);
    };
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    events.forEach((ev) => window.addEventListener(ev, stir, { passive: true }));
    timer = setTimeout(() => setAsleep(true), IDLE_MS);
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, stir));
    };
  }, []);

  return (
    <svg ref={svg} className={`tecla${asleep ? ' is-asleep' : ''}`} viewBox="0 0 96 100" width="80" height="83" aria-hidden="true">
      <defs>
        <linearGradient id="tk-skirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9d7d0" />
          <stop offset="0.6" stopColor="#b3b1a9" />
          <stop offset="1" stopColor="#85837c" />
        </linearGradient>
        <radialGradient id="tk-face" cx="0.38" cy="0.26" r="0.95">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f1f0eb" />
          <stop offset="1" stopColor="#cfcdc5" />
        </radialGradient>
        <radialGradient id="tk-dish" cx="0.5" cy="0.62" r="0.6">
          <stop offset="0" stopColor="#000" stopOpacity="0.09" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="tk-soft" x="-50%" y="-150%" width="200%" height="400%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <ellipse className="tecla-shadow" cx="48" cy="94" rx="30" ry="4" filter="url(#tk-soft)" />

      <g className="tecla-top">
        {/* skirt: the flared sides of the keycap */}
        <path
          d="M24 12h48c8 0 13 5 14 13l6 44c1 10-5 17-15 17H19C9 86 3 79 4 69l6-44c1-8 6-13 14-13Z"
          fill="url(#tk-skirt)"
          stroke="#0b0b0c"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* light catching the bottom lip */}
        <path d="M9 72c1 7 5 10 12 10h54c7 0 11-3 12-10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

        {/* top face: the surface your finger lands on, with a shallow dish */}
        <g className="tecla-face">
          <rect x="15" y="6" width="66" height="62" rx="16" fill="url(#tk-face)" stroke="#0b0b0c" strokeWidth="2" />
          <rect x="19" y="10" width="58" height="54" rx="13" fill="url(#tk-dish)" />
          <path d="M22 20q1-8 10-8h22" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.95" />

          <g className="tecla-look">
            <g className="tecla-eyes" fill="#0b0b0c">
              <circle cx="35.5" cy="37" r="7.5" />
              <circle cx="60.5" cy="37" r="7.5" />
            </g>
          </g>
        </g>

        {party && (
          <g className="tecla-hat">
            <path d="M22 9 31-24 52 5Z" fill="#ff4b2b" stroke="#0b0b0c" strokeWidth="2" strokeLinejoin="round" />
            <path d="M26.5 -6 41.5 -8.5M24 2.5 47 -1" fill="none" stroke="#ffd60a" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="31" cy="-25" r="4.6" fill="#fbfaf7" stroke="#0b0b0c" strokeWidth="2" />
          </g>
        )}
      </g>

      {/* Zs drift up while she sleeps */}
      <g className="tecla-zzz" fill="var(--desk-fg)" fontFamily="var(--font-d)" fontWeight="800">
        <text x="74" y="4" fontSize="13">z</text>
        <text x="84" y="-8" fontSize="17">Z</text>
      </g>
    </svg>
  );
}

/** True on Andrés's birthday (in his time zone). `profile.birthday` is 'MM-DD'; empty turns this off. */
function isBirthday() {
  if (!/^\d{2}-\d{2}$/.test(profile.birthday)) return false;
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: profile.timeZone, month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const get = (t: string) => parts.find((p) => p.type === t)?.value;
    return `${get('month')}-${get('day')}` === profile.birthday;
  } catch {
    return false;
  }
}

interface Props {
  /** Open the app or case study a fact points at. */
  onAction: (cta: Cta) => void;
  /** Which links this surface can follow (phones have no Arcade window, for example). */
  supports?: (cta: Cta) => boolean;
  mobile?: boolean;
}

/** The site mascot. Click her for a fact about Andrés; she greets desktop visitors once per session. */
export default function Mascot({ onAction, supports, mobile = false }: Props) {
  const on = useOS((s) => s.mascotOn);
  const setMascot = useOS((s) => s.setMascot);
  const noteOpen = useOS((s) => s.noteOpen);
  const reduce = useReducedMotion();
  const t = useT();
  const { mascot } = useContent();
  const [open, setOpen] = useState(false);
  const [party] = useState(isBirthday);
  // -1 is the introduction; otherwise an index into the facts.
  const [index, setIndex] = useState(-1);
  // Facts already shown this round, so nothing repeats until all have been seen.
  const seen = useRef<number[]>([]);
  // Once the visitor has clicked her, the automatic greeting stays out of the way.
  const touched = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const close = () => {
    if (rootRef.current?.contains(document.activeElement)) btnRef.current?.focus();
    setOpen(false);
  };
  useDismiss(rootRef, open, close);

  // Say hello once per session, after the README note is out of the way.
  useEffect(() => {
    if (mobile || !on || noteOpen) return;
    let greeted = false;
    try {
      greeted = sessionStorage.getItem(GREETED_KEY) === '1';
    } catch {
      /* storage unavailable */
    }
    if (greeted) return;
    const id = setTimeout(() => {
      try {
        sessionStorage.setItem(GREETED_KEY, '1');
      } catch {
        /* storage unavailable */
      }
      if (touched.current) return;
      setIndex(-1);
      setOpen(true);
    }, 2600);
    return () => clearTimeout(id);
  }, [mobile, on, noteOpen]);

  const nextFact = () => {
    touched.current = true;
    const total = mascot.facts.length;
    if (seen.current.length >= total) seen.current = seen.current.slice(-1);
    const fresh = mascot.facts.map((_, i) => i).filter((i) => !seen.current.includes(i));
    const pick = fresh[Math.floor(Math.random() * fresh.length)];
    seen.current.push(pick);
    setIndex(pick);
    setOpen(true);
  };

  if (!on) return null;

  const fact = index >= 0 ? mascot.facts[index] : null;
  const cta = fact?.cta && (!supports || supports(fact.cta)) ? fact.cta : null;

  return (
    <div className={`mascot${mobile ? ' mascot--m' : ''}`} ref={rootRef}>
      {/* The button comes first in the DOM so the bubble follows it in the tab order. */}
      <motion.button
        type="button"
        ref={btnRef}
        className="mascot-btn"
        aria-label={t('mascot.ask', { name: mascot.name })}
        aria-expanded={open}
        onClick={() => {
          // Loaded on first press so the sound code stays out of the first paint.
          import('@/lib/audio').then((m) => m.playKeyClick());
          nextFact();
        }}
        initial={reduce ? false : { opacity: 0, y: 40, scale: 0.6 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: reduce ? 0 : 1.1, type: 'spring', stiffness: 260, damping: 16 }}
      >
        <Tecla party={party} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="bubble"
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.85, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            <button type="button" className="bubble-close" aria-label={t('mascot.close', { name: mascot.name })} onClick={close}>
              <Icon name="close" size={12} strokeWidth={2.25} />
            </button>
            <p className="bubble-eyebrow">{fact ? t('mascot.funFact', { name: mascot.name }) : mascot.name}</p>
            {/* Keyed so each new fact re-enters. */}
            <motion.p
              key={index}
              className="bubble-text"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              {fact ? fact.text : party ? mascot.birthdayIntro : mascot.intro}
            </motion.p>
            <div className="bubble-actions">
              <button type="button" className="bubble-btn bubble-btn--main" onClick={nextFact}>
                <Icon name="sparkle" size={13} /> {t(fact ? 'mascot.another' : 'mascot.tellMe')}
              </button>
              {cta && (
                <button
                  type="button"
                  className="bubble-btn"
                  onClick={() => {
                    setOpen(false);
                    onAction(cta);
                  }}
                >
                  {cta.label} <Icon name="arrowRight" size={13} />
                </button>
              )}
            </div>
            <button
              type="button"
              className="bubble-hide"
              onClick={() => {
                setOpen(false);
                setMascot(false);
              }}
            >
              {t('topbar.hideMascot', { name: mascot.name })}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
