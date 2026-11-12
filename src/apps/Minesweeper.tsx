'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type SyntheticEvent,
} from 'react';
import { StringKey, T, useT } from '@/lib/strings';

/* ─── Levels ─────────────────────────────────────────────────────────────── */

type LevelId = 'beginner' | 'wide' | 'intermediate';
type Level = { id: LevelId; rows: number; cols: number; mines: number; maxCell: number };

const LEVELS: readonly Level[] = [
  { id: 'beginner', rows: 9, cols: 9, mines: 10, maxCell: 28 },
  { id: 'wide', rows: 9, cols: 16, mines: 20, maxCell: 28 },
  { id: 'intermediate', rows: 16, cols: 16, mines: 40, maxCell: 26 },
];
const levelName = (l: Level, t: T) => t(`mines.level.${l.id}`);
const levelOf = (id: LevelId) => LEVELS.find((l) => l.id === id) ?? LEVELS[0];

/** Smallest comfortable cell (WCAG 2.5.8 target size). */
const MIN_CELL = 24;
/** Horizontal room the panel and board frame take, in px. Keep in sync with --mine-chrome. */
const CHROME = 32;
const LONG_PRESS_MS = 450;
const BEST_KEY = 'nos-mines-best';

/* ─── Pure game logic ────────────────────────────────────────────────────── */

type Status = 'ready' | 'playing' | 'won' | 'lost';

type Game = {
  level: LevelId;
  rows: number;
  cols: number;
  mines: number;
  mine: boolean[];
  adj: number[];
  open: boolean[];
  flag: boolean[];
  status: Status;
  flags: number;
  opened: number;
  startedAt: number;
  endedAt: number;
};

function newGame(level: Level): Game {
  const n = level.rows * level.cols;
  return {
    level: level.id,
    rows: level.rows,
    cols: level.cols,
    mines: level.mines,
    mine: new Array<boolean>(n).fill(false),
    adj: new Array<number>(n).fill(0),
    open: new Array<boolean>(n).fill(false),
    flag: new Array<boolean>(n).fill(false),
    status: 'ready',
    flags: 0,
    opened: 0,
    startedAt: 0,
    endedAt: 0,
  };
}

function neighbours(rows: number, cols: number, i: number): number[] {
  const r = Math.floor(i / cols);
  const c = i % cols;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push(rr * cols + cc);
    }
  }
  return out;
}

/** Small seeded PRNG so mine placement stays a pure function of its inputs. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Lay mines anywhere except the first cell revealed and, when there is room, its neighbours. */
function layMines(g: Game, safe: number, seed: number): Game {
  const n = g.rows * g.cols;
  const keepOut = new Set([safe, ...neighbours(g.rows, g.cols, safe)]);
  let pool: number[] = [];
  for (let i = 0; i < n; i++) if (!keepOut.has(i)) pool.push(i);
  if (pool.length < g.mines) {
    pool = [];
    for (let i = 0; i < n; i++) if (i !== safe) pool.push(i);
  }
  const rand = mulberry32(seed);
  const mine = new Array<boolean>(n).fill(false);
  const count = Math.min(g.mines, pool.length);
  for (let k = 0; k < count; k++) {
    const j = k + Math.floor(rand() * (pool.length - k));
    [pool[k], pool[j]] = [pool[j], pool[k]];
    mine[pool[k]] = true;
  }
  const adj = mine.map((_, i) => neighbours(g.rows, g.cols, i).filter((m) => mine[m]).length);
  return { ...g, mine, adj, mines: count };
}

/** Open cells, flood-filling outward from zeros. Ends the game on a mine or a full clear. */
function openCells(g: Game, starts: number[], now: number): Game {
  const open = g.open.slice();
  let opened = g.opened;
  let hit = false;
  const stack = starts.slice();
  while (stack.length) {
    const i = stack.pop() as number;
    if (open[i] || g.flag[i]) continue;
    open[i] = true;
    if (g.mine[i]) {
      hit = true;
      continue;
    }
    opened++;
    if (g.adj[i] === 0) {
      for (const m of neighbours(g.rows, g.cols, i)) if (!open[m] && !g.flag[m]) stack.push(m);
    }
  }
  if (hit) return { ...g, open, opened, status: 'lost', endedAt: now };
  if (opened === g.rows * g.cols - g.mines) {
    // Win: every mine gets its flag, like the original.
    return { ...g, open, opened, status: 'won', endedAt: now, flag: g.mine.slice(), flags: g.mines };
  }
  return { ...g, open, opened };
}

/** Left click / Enter / Space on a cell. Reveals a hidden cell or chords a satisfied number. */
function reveal(g: Game, i: number, seed: number, now: number): Game {
  if (g.status === 'won' || g.status === 'lost' || g.flag[i]) return g;
  if (g.open[i]) {
    if (g.adj[i] === 0) return g;
    const around = neighbours(g.rows, g.cols, i);
    const flagged = around.filter((m) => g.flag[m]).length;
    if (flagged !== g.adj[i]) return g;
    const hidden = around.filter((m) => !g.open[m] && !g.flag[m]);
    return hidden.length ? openCells(g, hidden, now) : g;
  }
  const armed = g.status === 'ready' ? { ...layMines(g, i, seed), status: 'playing' as const, startedAt: now } : g;
  return openCells(armed, [i], now);
}

function toggleFlag(g: Game, i: number): Game {
  if (g.status === 'won' || g.status === 'lost' || g.open[i]) return g;
  const flag = g.flag.slice();
  flag[i] = !flag[i];
  return { ...g, flag, flags: g.flags + (flag[i] ? 1 : -1) };
}

/** Seconds as the LCD shows them: 1 on the first click, capped at 999. */
function seconds(startedAt: number, until: number) {
  return Math.min(999, Math.max(0, Math.floor((until - startedAt) / 1000)) + 1);
}

/* ─── Best times ─────────────────────────────────────────────────────────── */

type Best = Partial<Record<LevelId, number>>;

function readBest(): Best {
  try {
    if (typeof window === 'undefined') return {};
    const raw = JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}') as unknown;
    if (!raw || typeof raw !== 'object') return {};
    const out: Best = {};
    for (const l of LEVELS) {
      const v = (raw as Record<string, unknown>)[l.id];
      if (typeof v === 'number' && Number.isFinite(v) && v > 0) out[l.id] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function writeBest(best: Best) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    /* storage unavailable */
  }
}

/* ─── Drawings ───────────────────────────────────────────────────────────── */

type Face = 'smile' | 'oh' | 'cool' | 'dead';

function FaceIcon({ face }: { face: Face }) {
  const ink = 'var(--c-ink)';
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" fill="var(--c-sun)" stroke={ink} strokeWidth="1.5" />
      {face === 'dead' ? (
        <path d="M7.2 8.4l2.6 2.6M9.8 8.4l-2.6 2.6M14.2 8.4l2.6 2.6M16.8 8.4l-2.6 2.6" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
      ) : face === 'cool' ? (
        <g fill={ink}>
          <path d="M4.6 9.2h14.8" stroke={ink} strokeWidth="1.2" />
          <rect x="5.6" y="8.4" width="5.4" height="3.6" rx="1.4" />
          <rect x="13" y="8.4" width="5.4" height="3.6" rx="1.4" />
        </g>
      ) : (
        <g fill={ink}>
          <circle cx="8.6" cy="9.8" r="1.35" />
          <circle cx="15.4" cy="9.8" r="1.35" />
        </g>
      )}
      {face === 'oh' ? (
        <circle cx="12" cy="15.6" r="2.1" fill="none" stroke={ink} strokeWidth="1.5" />
      ) : face === 'dead' ? (
        <path d="M8.3 17c2.3-2.4 5.1-2.4 7.4 0" fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M7.8 14.2c2.4 3 6 3 8.4 0" fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

function MineIcon({ crossed = false }: { crossed?: boolean }) {
  return (
    <svg className="mine-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.2v17.6M3.2 12h17.6M5.8 5.8l12.4 12.4M18.2 5.8 5.8 18.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="5.6" fill="currentColor" />
      <circle className="mine-shine" cx="10.1" cy="10.1" r="1.5" />
      {crossed && <path className="mine-cross" d="M4 4l16 16M20 4 4 20" strokeWidth="2.4" strokeLinecap="round" />}
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg className="mine-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path className="mine-flag-cloth" d="M9 3.6 18 7.8 9 12z" />
      <path d="M9 3.4v15M5.5 19.6h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── LCD and timer ──────────────────────────────────────────────────────── */

function lcdText(n: number) {
  const v = Math.max(-99, Math.min(999, Math.trunc(n)));
  return v < 0 ? `-${String(-v).padStart(2, '0')}` : String(v).padStart(3, '0');
}

function Lcd({ value, label }: { value: number; label: string }) {
  return (
    <div className="mine-lcd">
      <span className="mine-lcd-ghost" aria-hidden="true">888</span>
      <span className="mine-lcd-value" aria-hidden="true">{lcdText(value)}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Its own component so the ticking clock re-renders only itself, never the board. */
function Timer({ status, startedAt, endedAt }: { status: Status; startedAt: number; endedAt: number }) {
  const t = useT();
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [status]);
  const secs = status === 'ready' ? 0 : seconds(startedAt, status === 'playing' ? now : endedAt);
  return <Lcd value={secs} label={t(secs === 1 ? 'mines.time.one' : 'mines.time.other', { n: secs })} />;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

type Press = { timer: number; x: number; y: number; fired: boolean; touchAt: number };

/** `one` or `other` by count, with {n} filled in. */
const plural = (t: T, n: number, one: StringKey, other: StringKey) => t(Math.abs(n) === 1 ? one : other, { n });
const cellIndex = (e: SyntheticEvent) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
  return el ? Number(el.dataset.i) : -1;
};
const centre = (l: Level) => Math.floor(l.rows / 2) * l.cols + Math.floor(l.cols / 2);

export default function Minesweeper() {
  const t = useT();
  const [game, setGame] = useState<Game>(() => newGame(LEVELS[0]));
  const [focus, setFocus] = useState(() => centre(LEVELS[0]));
  const [flagMode, setFlagMode] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [best, setBest] = useState<Best>(readBest);
  const [newBest, setNewBest] = useState(false);
  // How many columns fit at MIN_CELL. Infinity until measured.
  const [fitCols, setFitCols] = useState(Infinity);

  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const levelsRef = useRef<HTMLDivElement>(null);
  const press = useRef<Press>({ timer: 0, x: 0, y: 0, fired: false, touchAt: 0 });
  const helpId = useId();

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      setFitCols(Math.floor((entry.contentRect.width - CHROME) / MIN_CELL));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const p = press.current;
    return () => clearTimeout(p.timer);
  }, []);

  const level = levelOf(game.level);
  const over = game.status === 'won' || game.status === 'lost';
  const fits = (n: number) => n <= fitCols;
  // A wide board that is too wide for a phone turns on its side instead of shrinking.
  const tall = game.cols > game.rows && !fits(game.cols) && fits(game.rows);
  const vRows = tall ? game.cols : game.rows;
  const vCols = tall ? game.rows : game.cols;
  const toState = (vr: number, vc: number) => (tall ? vc * game.cols + vr : vr * game.cols + vc);
  const toView = (i: number): [number, number] => {
    const r = Math.floor(i / game.cols);
    const c = i % game.cols;
    return tall ? [c, r] : [r, c];
  };
  const levels = LEVELS.filter((l) => l.id === game.level || fits(Math.min(l.rows, l.cols)));
  const active = focus < game.mine.length ? focus : 0;
  const minesLeft = game.mines - game.flags;
  const secs = over ? seconds(game.startedAt, game.endedAt) : 0;
  const face: Face = game.status === 'lost' ? 'dead' : game.status === 'won' ? 'cool' : pressing ? 'oh' : 'smile';

  function commit(next: Game) {
    if (next === game) return;
    setGame(next);
    if (next.status === 'won') {
      const time = seconds(next.startedAt, next.endedAt);
      const prev = best[next.level];
      if (prev === undefined || time < prev) {
        const nb = { ...best, [next.level]: time };
        setBest(nb);
        writeBest(nb);
        setNewBest(true);
      }
    }
  }

  function start(l: Level) {
    clearTimeout(press.current.timer);
    press.current.fired = false;
    setPressing(false);
    setNewBest(false);
    setGame(newGame(l));
    setFocus(centre(l));
  }

  function flagAt(i: number) {
    commit(toggleFlag(game, i));
  }

  function moveTo(i: number) {
    setFocus(i);
    gridRef.current?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.focus();
  }

  /* Grid events, delegated from the board. */

  function onClick(e: MouseEvent) {
    const i = cellIndex(e);
    if (i < 0) return;
    if (press.current.fired) {
      // The click that ends a long-press has already flagged.
      press.current.fired = false;
      return;
    }
    if (over) return;
    if (flagMode && !game.open[i]) flagAt(i);
    else commit(reveal(game, i, (Math.random() * 2 ** 32) >>> 0, Date.now()));
  }

  function onContextMenu(e: MouseEvent) {
    e.preventDefault();
    const i = cellIndex(e);
    if (i < 0 || over) return;
    // Touch long-press is handled by the timer; some phones also fire contextmenu for it.
    if (press.current.fired || Date.now() - press.current.touchAt < 1000) return;
    flagAt(i);
  }

  function onPointerDown(e: PointerEvent) {
    const i = cellIndex(e);
    const p = press.current;
    clearTimeout(p.timer);
    p.fired = false;
    if (i < 0 || over || game.open[i]) return;
    if (e.pointerType === 'mouse') {
      if (e.button === 0 && !game.flag[i] && !flagMode) setPressing(true);
      return;
    }
    p.touchAt = Date.now();
    p.x = e.clientX;
    p.y = e.clientY;
    p.timer = window.setTimeout(() => {
      p.timer = 0;
      p.fired = true;
      setPressing(false);
      setGame((g) => toggleFlag(g, i));
      navigator.vibrate?.(12);
    }, LONG_PRESS_MS);
    if (!game.flag[i] && !flagMode) setPressing(true);
  }

  function onPointerMove(e: PointerEvent) {
    const p = press.current;
    if (p.timer && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) {
      clearTimeout(p.timer);
      p.timer = 0;
      setPressing(false);
    }
  }

  function endPress() {
    clearTimeout(press.current.timer);
    press.current.timer = 0;
    setPressing(false);
  }

  function onKeyDown(e: KeyboardEvent) {
    const i = cellIndex(e);
    if (i < 0 || e.altKey || e.metaKey) return;
    press.current.fired = false;
    const [vr, vc] = toView(i);
    let to: [number, number] | null = null;
    switch (e.key) {
      case 'ArrowUp': to = [Math.max(0, vr - 1), vc]; break;
      case 'ArrowDown': to = [Math.min(vRows - 1, vr + 1), vc]; break;
      case 'ArrowLeft': to = [vr, Math.max(0, vc - 1)]; break;
      case 'ArrowRight': to = [vr, Math.min(vCols - 1, vc + 1)]; break;
      case 'Home': to = e.ctrlKey ? [0, 0] : [vr, 0]; break;
      case 'End': to = e.ctrlKey ? [vRows - 1, vCols - 1] : [vr, vCols - 1]; break;
      case 'PageUp': to = [0, vc]; break;
      case 'PageDown': to = [vRows - 1, vc]; break;
      case 'f':
      case 'F':
        if (e.ctrlKey) return;
        e.preventDefault();
        if (!over) flagAt(i);
        return;
      default:
        return;
    }
    e.preventDefault();
    moveTo(toState(to[0], to[1]));
  }

  function onFocus(e: SyntheticEvent) {
    const i = cellIndex(e);
    if (i >= 0 && i !== active) setFocus(i);
  }

  /* Level picker: a radio group, arrow keys move and select. */
  function onLevelKey(e: KeyboardEvent) {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const at = levels.findIndex((l) => l.id === game.level);
    const next = levels[(at + step + levels.length) % levels.length];
    if (next.id === game.level) return;
    start(next);
    levelsRef.current?.querySelector<HTMLElement>(`[data-level="${next.id}"]`)?.focus();
  }

  function cellLabel(i: number): string {
    if (game.open[i]) {
      if (game.mine[i]) return t('mines.cell.exploded');
      return game.adj[i] ? plural(t, game.adj[i], 'mines.cell.near.one', 'mines.cell.near.other') : t('mines.cell.empty');
    }
    if (game.status === 'lost') {
      if (game.mine[i] && !game.flag[i]) return t('mines.cell.mine');
      if (game.flag[i] && !game.mine[i]) return t('mines.cell.wrongFlag');
    }
    return t(game.flag[i] ? 'mines.cell.flagged' : 'mines.cell.hidden');
  }

  function cellClass(i: number): string {
    const k = ['mine-cell'];
    if (game.open[i]) {
      k.push('is-open');
      if (game.mine[i]) k.push('is-boom');
      else if (game.adj[i]) k.push(`mine-n${game.adj[i]}`);
    } else if (game.status === 'lost' && game.mine[i] !== game.flag[i]) {
      // After a loss: unflagged mines are shown, and flags on safe cells are crossed out.
      k.push('is-open', game.mine[i] ? 'is-shown' : 'is-wrong');
    } else {
      k.push('is-hidden');
      if (game.flag[i]) k.push('is-flag');
    }
    return k.join(' ');
  }

  function cellContent(i: number) {
    if (game.open[i]) return game.mine[i] ? <MineIcon /> : game.adj[i] || null;
    if (game.status === 'lost' && game.mine[i] && !game.flag[i]) return <MineIcon />;
    if (game.status === 'lost' && game.flag[i] && !game.mine[i]) return <MineIcon crossed />;
    return game.flag[i] ? <FlagIcon /> : null;
  }

  const announce =
    game.status === 'won'
      ? t('mines.won', {
          level: levelName(level, t),
          time: plural(t, secs, 'mines.secs.one', 'mines.secs.other'),
          best: newBest ? t('mines.newBest') : '',
        })
      : game.status === 'lost'
        ? t('mines.lost')
        : plural(t, minesLeft, 'mines.left.one', 'mines.left.other');

  const note =
    game.status === 'won'
      ? t('mines.note.won', { n: secs }) + (newBest ? t('mines.note.newBest') : '')
      : game.status === 'lost'
        ? t('mines.note.lost')
        : game.status === 'ready'
          ? t('mines.note.ready')
          : flagMode
            ? t('mines.note.flagMode')
            : t('mines.note.play');

  const boardStyle = {
    '--mine-cols': vCols,
    '--mine-max': `${level.maxCell}px`,
  } as CSSProperties;

  const bestTime = best[game.level];

  return (
    <div className="mine-app" ref={rootRef}>
      <div className="mine-panel">
        <div className="mine-bar">
          <div className="mine-levels" role="radiogroup" aria-label={t('mines.level')} ref={levelsRef} onKeyDown={onLevelKey}>
            {levels.map((l) => {
              const on = l.id === game.level;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  data-level={l.id}
                  className={on ? 'is-current' : ''}
                  onClick={() => !on && start(l)}
                >
                  {levelName(l, t)}
                </button>
              );
            })}
          </div>
          <button type="button" className="mine-flagmode" aria-pressed={flagMode} onClick={() => setFlagMode((v) => !v)}>
            <FlagIcon />
            {t('mines.flagMode')}
          </button>
        </div>

        <div className="mine-head">
          <Lcd value={minesLeft} label={t('mines.minesLeft', { n: minesLeft })} />
          <button type="button" className="mine-face" aria-label={t('mines.newGame')} title={t('mines.newGame')} onClick={() => start(level)}>
            <FaceIcon face={face} />
          </button>
          <Timer status={game.status} startedAt={game.startedAt} endedAt={game.endedAt} />
        </div>

        <div
          ref={gridRef}
          role="grid"
          aria-label={t('mines.board', { level: levelName(level, t), rows: vRows, cols: vCols })}
          aria-describedby={helpId}
          className={`mine-board${over ? ' is-over' : ''}${flagMode ? ' is-flagging' : ''}`}
          style={boardStyle}
          onClick={onClick}
          onContextMenu={onContextMenu}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPress}
          onPointerCancel={endPress}
          onPointerLeave={endPress}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        >
          {Array.from({ length: vRows }, (_, vr) => (
            <div role="row" className="mine-row" key={vr}>
              {Array.from({ length: vCols }, (_, vc) => {
                const i = toState(vr, vc);
                return (
                  <button
                    key={i}
                    type="button"
                    role="gridcell"
                    data-i={i}
                    tabIndex={i === active ? 0 : -1}
                    className={cellClass(i)}
                    aria-label={t('mines.cell', { row: vr + 1, col: vc + 1, state: cellLabel(i) })}
                  >
                    {cellContent(i)}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mine-foot">
          <p className="mine-note">{note}</p>
          <p className="mine-best">
            {t('mines.best')}{' '}
            {bestTime ? (
              <span className="mine-best-value">{bestTime}s</span>
            ) : (
              <>
                <span aria-hidden="true">—</span>
                <span className="sr-only">{t('mines.noneYet')}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <p className="sr-only" role="status">
        {announce}
      </p>
      <p className="sr-only" id={helpId}>
        {t('mines.help')}
      </p>
    </div>
  );
}
