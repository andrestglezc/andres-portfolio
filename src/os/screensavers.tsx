'use client';

/* Screensaver gallery: three canvas animations plus static picker thumbnails.
   Every frame-by-frame value lives in the effect's closure, never in React state. */

import { useEffect, useRef } from 'react';

export type SaverId = 'keycaps' | 'starfield' | 'pipes';

// Picker names are interface strings: t(`saver.${id}`) in src/lib/strings.ts.

// ─── Palette ──────────────────────────────────────────────────────────────

const PALETTE = ['#ffd60a', '#ff4b2b', '#5b7cff', '#c9f27b', '#ffb3f0', '#2ec4b6', '#fbfaf7'];
const INK = '#0b0b0c';
const PAPER = '#fbfaf7';
const TAU = Math.PI * 2;

function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(hex: string, toward: string, t: number) {
  const a = rgb(hex);
  const b = rgb(toward);
  const m = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${m(0)}, ${m(1)}, ${m(2)})`;
}

type Shade = { base: string; top: string; side: string; dark: string; hi: string };

const SHADES: Shade[] = PALETTE.map((c) => ({
  base: c,
  top: mix(c, '#ffffff', 0.12),
  side: mix(c, '#000000', 0.34),
  dark: mix(c, '#000000', 0.52),
  hi: mix(c, '#ffffff', 0.62),
}));

const LEGENDS = [
  'A', 'S', 'D', 'F', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Y', 'Z', 'X', 'C', 'G', 'M', 'N', 'P',
  '1', '2', '7', '9', '?', '!', '&', '@', '#', '%', '*', '+', '~', '⌘', '⌥', '⇧', '↵', '←', '→', '↑', '↓', '★',
];

// Only ever called from effects and animation frames, never during render.
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (n: number) => Math.floor(Math.random() * n);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// ─── Scene contract ───────────────────────────────────────────────────────

interface Scene {
  /** New size in CSS pixels. The context is already scaled for devicePixelRatio. */
  resize(w: number, h: number): void;
  /** Advance by dt seconds. */
  step(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  /** Bring the scene to a representative still frame (reduced motion, paused). */
  settle(): void;
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ─── Flying keycaps ───────────────────────────────────────────────────────

type Cap = { x: number; y: number; z: number; rot: number; spin: number; shade: number; ch: string };

function keycaps(family: string): Scene {
  const FAR = 5.2;
  const NEAR = 0.16;
  const SIZE = 0.15;
  const SPEED = 0.6;
  let w = 0;
  let h = 0;
  let f = 1;
  const caps: Cap[] = [];

  const place = (cap: Cap, z: number) => {
    const m = Math.min(w, h) || 1;
    const a = rand(0, TAU);
    const d = rand(0.28, 1.5);
    cap.x = Math.cos(a) * d * (w / m);
    cap.y = Math.sin(a) * d * (h / m);
    cap.z = z;
    cap.rot = rand(0, TAU);
    cap.spin = rand(0.12, 0.5) * (Math.random() < 0.5 ? -1 : 1);
    cap.shade = randInt(SHADES.length);
    cap.ch = LEGENDS[randInt(LEGENDS.length)];
  };

  return {
    resize(nw, nh) {
      w = nw;
      h = nh;
      f = Math.min(w, h) / 2;
      const count = clamp(Math.round((w * h) / 15000), 18, 72);
      caps.length = Math.min(caps.length, count);
      while (caps.length < count) {
        const cap: Cap = { x: 0, y: 0, z: 1, rot: 0, spin: 0, shade: 0, ch: 'A' };
        // Uniform depth matches the steady state, so the first frame looks like any other.
        place(cap, rand(NEAR + 0.25, FAR));
        caps.push(cap);
      }
    },
    step(dt) {
      for (const cap of caps) {
        cap.z -= SPEED * dt;
        cap.rot += cap.spin * dt;
        const s = (SIZE / cap.z) * f;
        const px = (cap.x / cap.z) * f;
        const py = (cap.y / cap.z) * f;
        if (cap.z < NEAR || Math.abs(px) - s > w / 2 || Math.abs(py) - s > h / 2) place(cap, FAR - rand(0, 0.4));
      }
    },
    draw(ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const half = Math.hypot(cx, cy) || 1;
      caps.sort((a, b) => b.z - a.z);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = INK;
      for (const cap of caps) {
        const s = (SIZE / cap.z) * f;
        if (s < 2) continue;
        const px = cx + (cap.x / cap.z) * f;
        const py = cy + (cap.y / cap.z) * f;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.hypot(dx, dy) || 1;
        // The top face sits closer to the viewer, so it projects further from the
        // vanishing point and the walls facing the centre show.
        const ts = Math.min(80, 66 * (1 + 0.05 / cap.z));
        const lean = Math.min(1, dist / half) * Math.min(15, (100 - ts) / 2 - 2);
        const cos = Math.cos(cap.rot);
        const sin = Math.sin(cap.rot);
        const ux = dx / dist;
        const uy = dy / dist;
        const tx = (ux * cos + uy * sin) * lean;
        const ty = (-ux * sin + uy * cos) * lean;
        const k = s / 100;
        const sh = SHADES[cap.shade];

        ctx.save();
        ctx.globalAlpha = clamp((FAR - cap.z) / 0.9, 0, 1);
        ctx.translate(px, py);
        ctx.rotate(cap.rot);
        ctx.scale(k, k);
        rrect(ctx, -50, -50, 100, 100, 18);
        ctx.fillStyle = sh.side;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.stroke();
        rrect(ctx, tx - ts / 2, ty - ts / 2, ts, ts, 13);
        ctx.fillStyle = sh.top;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();
        if (s > 12) {
          ctx.fillStyle = INK;
          ctx.font = `700 ${Math.round(ts * 0.56)}px ${family}`;
          ctx.fillText(cap.ch, tx, ty + ts * 0.04);
        }
        ctx.restore();
      }
    },
    settle() {},
  };
}

// ─── Starfield ────────────────────────────────────────────────────────────

type Star = { x: number; y: number; z: number; tint: string };

function starfield(): Scene {
  const BASE = 0.3;
  const SPREAD = 0.45;
  let w = 0;
  let h = 0;
  let t = 0;
  const stars: Star[] = [];

  const seed = (st: Star, z: number) => {
    st.x = rand(-1, 1);
    st.y = rand(-1, 1);
    st.z = z;
    st.tint = Math.random() < 0.82 ? PAPER : PALETTE[randInt(6)];
  };
  // A slow surge in and out of warp.
  const speed = () => BASE * (1 + 0.45 * Math.sin(t * 0.21));

  return {
    resize(nw, nh) {
      w = nw;
      h = nh;
      const count = clamp(Math.round((w * h) / 2000), 160, 900);
      stars.length = Math.min(stars.length, count);
      while (stars.length < count) {
        const st: Star = { x: 0, y: 0, z: 1, tint: PAPER };
        seed(st, rand(0.04, 1));
        stars.push(st);
      }
    },
    step(dt) {
      t += dt;
      const v = speed();
      for (const st of stars) {
        st.z -= v * dt;
        const px = (st.x * SPREAD) / st.z;
        const py = (st.y * SPREAD) / st.z;
        if (st.z <= 0.02 || Math.abs(px) > 1.02 || Math.abs(py) > 1.02) seed(st, 1 - rand(0, 0.06));
      }
    },
    draw(ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const tail = speed() * 0.1;
      ctx.lineCap = 'round';
      for (const st of stars) {
        const z = st.z;
        const zt = Math.min(1.05, z + tail);
        ctx.globalAlpha = clamp(1.1 - z, 0.12, 1);
        ctx.strokeStyle = st.tint;
        ctx.lineWidth = 0.6 + (1 - z) * 2.4;
        ctx.beginPath();
        ctx.moveTo(cx + (st.x * cx * SPREAD) / zt, cy + (st.y * cy * SPREAD) / zt);
        ctx.lineTo(cx + (st.x * cx * SPREAD) / z, cy + (st.y * cy * SPREAD) / z);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
    settle() {},
  };
}

// ─── Pipes ────────────────────────────────────────────────────────────────

// Unit steps on an isometric grid. Opposites are paired, so the reverse of d is d ^ 1.
const DIRS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
] as const;
const LAYERS = 6;
const PIPE_SPEED = 8.5; // segments per second, per pipe
const LIVE_PIPES = 2;
const FADE_S = 1.6;
const FILL = 0.3; // share of on-screen cells to fill before the fade
// Light from the upper left: tubes shade toward it, joints catch it there.
const LX = -0.55;
const LY = -0.835;

type Pipe = {
  i: number; j: number; k: number;
  ni: number; nj: number; nk: number;
  d: number; shade: number; len: number; max: number; prog: number; dead: boolean;
};
type PipeItem = { ball: boolean; ax: number; ay: number; bx: number; by: number; depth: number; shade: number };

function stroke(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, width: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function disc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = color;
  ctx.fill();
}

function paintPipe(ctx: CanvasRenderingContext2D, it: PipeItem, r: number) {
  const sh = SHADES[it.shade];
  if (it.ball) {
    const rb = r * 1.08;
    disc(ctx, it.ax, it.ay, rb, sh.dark);
    disc(ctx, it.ax + LX * rb * 0.16, it.ay + LY * rb * 0.16, rb * 0.74, sh.base);
    disc(ctx, it.ax + LX * rb * 0.42, it.ay + LY * rb * 0.42, rb * 0.2, sh.hi);
    return;
  }
  const dx = it.bx - it.ax;
  const dy = it.by - it.ay;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (nx * LX + ny * LY < 0) {
    nx = -nx;
    ny = -ny;
  }
  stroke(ctx, it.ax, it.ay, it.bx, it.by, r * 2, sh.dark);
  const o1 = r * 0.16;
  stroke(ctx, it.ax + nx * o1, it.ay + ny * o1, it.bx + nx * o1, it.by + ny * o1, r * 1.36, sh.base);
  const o2 = r * 0.46;
  stroke(ctx, it.ax + nx * o2, it.ay + ny * o2, it.bx + nx * o2, it.by + ny * o2, r * 0.36, sh.hi);
}

function pipes(): Scene {
  let w = 0;
  let h = 0;
  let s = 0; // screen length of one grid step
  let c = 0;
  let r = 0;
  let n = 0;
  let ox = 0;
  let oy = 0;
  let target = 0;
  let committed = 0;
  let fade = -1;
  let valid = new Uint8Array(0);
  let occ = new Uint8Array(0);
  let cells: number[] = [];
  let items: PipeItem[] = []; // finished segments and joints, sorted back to front
  let live: Pipe[] = [];

  const at = (i: number, j: number, k: number) => (k * n + j) * n + i;
  const open = (i: number, j: number, k: number) =>
    i >= 0 && j >= 0 && k >= 0 && i < n && j < n && k < LAYERS && valid[at(i, j, k)] === 1 && occ[at(i, j, k)] === 0;
  const X = (i: number, j: number) => ox + (i - j) * c;
  const Y = (i: number, j: number, k: number) => oy + ((i + j) * s) / 2 - k * s;
  const openDir = (p: { i: number; j: number; k: number }, d: number) =>
    open(p.i + DIRS[d][0], p.j + DIRS[d][1], p.k + DIRS[d][2]);

  // The view looks down (1, 1, 1), so a larger i + j + k is nearer the viewer.
  const insert = (it: PipeItem) => {
    let lo = 0;
    let hi = items.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (items[mid].depth <= it.depth) lo = mid + 1;
      else hi = mid;
    }
    items.splice(lo, 0, it);
  };

  // Drawn just after the segments that meet it, so it hides their square ends.
  const ballAt = (i: number, j: number, k: number, shade: number): PipeItem => ({
    ball: true, ax: X(i, j), ay: Y(i, j, k), bx: 0, by: 0, depth: i + j + k + 0.6, shade,
  });

  const reserve = (p: Pipe, d: number) => {
    p.d = d;
    p.ni = p.i + DIRS[d][0];
    p.nj = p.j + DIRS[d][1];
    p.nk = p.k + DIRS[d][2];
    occ[at(p.ni, p.nj, p.nk)] = 1;
  };

  const pickShade = () => {
    const used = new Set(live.map((p) => p.shade));
    let x = randInt(SHADES.length);
    for (let g = 0; g < 12 && used.has(x); g++) x = randInt(SHADES.length);
    return x;
  };

  const spawn = () => {
    if (!cells.length) return false;
    for (let tries = 0; tries < 80; tries++) {
      const id = cells[randInt(cells.length)];
      if (occ[id]) continue;
      const i = id % n;
      const j = Math.floor(id / n) % n;
      const k = Math.floor(id / (n * n));
      const p: Pipe = { i, j, k, ni: i, nj: j, nk: k, d: 0, shade: pickShade(), len: 0, max: Math.round(rand(18, 64)), prog: 0, dead: false };
      const dirs = [0, 1, 2, 3, 4, 5].filter((d) => openDir(p, d));
      if (!dirs.length) continue;
      occ[id] = 1;
      reserve(p, dirs[randInt(dirs.length)]);
      live.push(p);
      insert(ballAt(p.i, p.j, p.k, p.shade));
      return true;
    }
    return false;
  };

  const choose = (p: Pipe) => {
    const straight = openDir(p, p.d);
    const turns = [0, 1, 2, 3, 4, 5].filter((d) => d !== p.d && d !== (p.d ^ 1) && openDir(p, d));
    if (straight && (!turns.length || Math.random() < 0.7)) return p.d;
    if (turns.length) return turns[randInt(turns.length)];
    return -1;
  };

  const advance = (p: Pipe) => {
    const from = p.i + p.j + p.k;
    const to = p.ni + p.nj + p.nk;
    insert({ ball: false, ax: X(p.i, p.j), ay: Y(p.i, p.j, p.k), bx: X(p.ni, p.nj), by: Y(p.ni, p.nj, p.nk), depth: (from + to) / 2, shade: p.shade });
    committed++;
    p.i = p.ni;
    p.j = p.nj;
    p.k = p.nk;
    p.len++;
    const d = p.len >= p.max ? -1 : choose(p);
    if (d < 0 || d !== p.d) insert(ballAt(p.i, p.j, p.k, p.shade));
    if (d < 0) {
      p.dead = true;
      return;
    }
    reserve(p, d);
  };

  const reset = () => {
    occ = new Uint8Array(n * n * LAYERS);
    items = [];
    live = [];
    committed = 0;
    fade = -1;
    for (let q = 0; q < LIVE_PIPES; q++) if (!spawn()) break;
  };

  const step = (dt: number) => {
    if (!n) return;
    if (fade >= 0) {
      fade += dt / FADE_S;
      if (fade >= 1) reset();
      return;
    }
    for (const p of live) {
      p.prog += dt * PIPE_SPEED;
      while (p.prog >= 1 && !p.dead) {
        p.prog -= 1;
        advance(p);
      }
    }
    live = live.filter((p) => !p.dead);
    if (committed >= target) {
      fade = 0;
      return;
    }
    for (let q = live.length; q < LIVE_PIPES; q++) if (!spawn()) break;
    if (!live.length) fade = 0;
  };

  return {
    resize(nw, nh) {
      w = nw;
      h = nh;
      s = clamp(Math.round(Math.min(w, h) / 11), 24, 96);
      c = (s * Math.sqrt(3)) / 2;
      r = s * 0.17;
      // Big enough that every layer of the grid covers the whole screen.
      n = Math.ceil(w / (2 * c) + h / s + LAYERS) + 3;
      const mid = (n - 1) / 2;
      ox = w / 2;
      oy = h / 2 - mid * s + ((LAYERS - 1) / 2) * s;
      valid = new Uint8Array(n * n * LAYERS);
      cells = [];
      const m = s * 0.55;
      for (let k = 0; k < LAYERS; k++) {
        for (let j = 0; j < n; j++) {
          for (let i = 0; i < n; i++) {
            const x = X(i, j);
            const y = Y(i, j, k);
            if (x >= m && x <= w - m && y >= m && y <= h - m) {
              valid[at(i, j, k)] = 1;
              cells.push(at(i, j, k));
            }
          }
        }
      }
      target = Math.max(10, Math.floor(cells.length * FILL));
      reset();
    },
    step,
    draw(ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      if (!n) return;
      ctx.lineCap = 'butt';
      const tips: PipeItem[] = [];
      for (const p of live) {
        if (p.dead || p.prog <= 0) continue;
        const ax = X(p.i, p.j);
        const ay = Y(p.i, p.j, p.k);
        const t = Math.min(p.prog, 1);
        const bx = ax + (X(p.ni, p.nj) - ax) * t;
        const by = ay + (Y(p.ni, p.nj, p.nk) - ay) * t;
        const depth = (p.i + p.j + p.k + p.ni + p.nj + p.nk) / 2;
        tips.push({ ball: false, ax, ay, bx, by, depth, shade: p.shade });
        // A rounded head on the growing end.
        tips.push({ ball: true, ax: bx, ay: by, bx: 0, by: 0, depth: depth + 0.05, shade: p.shade });
      }
      tips.sort((a, b) => a.depth - b.depth);
      let q = 0;
      for (const it of items) {
        while (q < tips.length && tips[q].depth <= it.depth) paintPipe(ctx, tips[q++], r);
        paintPipe(ctx, it, r);
      }
      while (q < tips.length) paintPipe(ctx, tips[q++], r);
      if (fade > 0) {
        const e = Math.min(1, fade);
        ctx.globalAlpha = e * e * (3 - 2 * e);
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }
    },
    settle() {
      if (!n) return;
      reset();
      for (let g = 0; g < 20000 && fade < 0 && committed < target * 0.8; g++) step(0.5 / PIPE_SPEED);
      fade = -1;
    },
  };
}

const SCENES: Record<SaverId, (family: string) => Scene> = {
  keycaps,
  starfield,
  pipes,
};

// ─── Component ────────────────────────────────────────────────────────────

/**
 * Fills its positioned parent with a decorative canvas animation.
 * `paused` (or prefers-reduced-motion) shows one still frame instead.
 */
export default function Saver({ id, paused = false }: { id: SaverId; paused?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = rootRef.current;
    const el = canvasRef.current;
    if (!box || !el) return;
    const ctx = el.getContext('2d', { alpha: false });
    if (!ctx) return;

    const family = getComputedStyle(el).fontFamily || 'ui-monospace, monospace';
    const scene = SCENES[id](family);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const still = () => paused || motion.matches;
    let w = 0;
    let h = 0;
    let dpr = 0;
    let raf = 0;
    let last = 0;

    const paintStill = () => {
      scene.settle();
      scene.draw(ctx);
    };

    const fit = () => {
      const nw = box.clientWidth;
      const nh = box.clientHeight;
      const nd = Math.min(window.devicePixelRatio || 1, 2);
      if (!nw || !nh || (nw === w && nh === h && nd === dpr)) return;
      w = nw;
      h = nh;
      dpr = nd;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.resize(w, h);
      if (still()) paintStill();
      else scene.draw(ctx);
    };

    const tick = (now: number) => {
      // Cap the step so a background tab does not jump the scene forward.
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (w && h) {
        scene.step(dt);
        scene.draw(ctx);
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      if (!still()) raf = requestAnimationFrame(tick);
      else if (w && h) paintStill();
    };

    fit();
    if (!still()) raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(fit);
    ro.observe(box);
    // Catches devicePixelRatio changes (zoom, moving between screens).
    window.addEventListener('resize', fit);
    motion.addEventListener('change', start);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', fit);
      motion.removeEventListener('change', start);
    };
  }, [id, paused]);

  return (
    <div ref={rootRef} className={`saver2 saver2--${id}`} aria-hidden="true">
      <canvas ref={canvasRef} className="saver2-canvas" />
    </div>
  );
}

// ─── Static thumbnails ────────────────────────────────────────────────────

const round1 = (v: number) => Math.round(v * 10) / 10;

// Deterministic, so the thumbnails are identical on every render.
function lcg(seed: number) {
  let x = seed;
  return () => {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

const THUMB_CAPS = [
  { x: 48, y: 30, s: 6, a: -8, c: 5, ch: '' },
  { x: 55, y: 22, s: 7, a: 10, c: 3, ch: '' },
  { x: 39, y: 24, s: 9, a: 14, c: 0, ch: 'A' },
  { x: 60, y: 37, s: 11, a: -16, c: 2, ch: 'K' },
  { x: 71, y: 15, s: 14, a: 18, c: 4, ch: '?' },
  { x: 26, y: 41, s: 16, a: -12, c: 1, ch: 'G' },
  { x: 14, y: 13, s: 18, a: 9, c: 3, ch: '#' },
  { x: 82, y: 46, s: 21, a: -20, c: 6, ch: '★' },
].map((cap) => {
  const dx = cap.x - 48;
  const dy = cap.y - 30;
  const dist = Math.hypot(dx, dy) || 1;
  const lean = (cap.s * 0.13 * Math.min(1, dist / 56));
  const rad = (-cap.a * Math.PI) / 180;
  const ux = dx / dist;
  const uy = dy / dist;
  return {
    ...cap,
    tx: round1((ux * Math.cos(rad) - uy * Math.sin(rad)) * lean),
    ty: round1((ux * Math.sin(rad) + uy * Math.cos(rad)) * lean),
  };
});

const THUMB_STARS = (() => {
  const r = lcg(11);
  return Array.from({ length: 38 }, () => {
    const a = r() * TAU;
    const d = 0.1 + r() * 0.95;
    const len = 0.05 + d * 0.3;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    return {
      x1: round1(48 + ux * d * 46),
      y1: round1(30 + uy * d * 29),
      x2: round1(48 + ux * (d + len) * 46),
      y2: round1(30 + uy * (d + len) * 29),
      w: round1(0.5 + d * 1.3),
      o: round1(0.3 + Math.min(d, 1) * 0.7),
      c: r() < 0.8 ? PAPER : PALETTE[Math.floor(r() * 6)],
    };
  });
})();

// Isometric runs: vertical steps of 12, diagonal steps of (±10.4, ±6).
const THUMB_PIPES = [
  { c: 0, pts: [[52, -6], [52, 6], [62.4, 12], [62.4, 24], [52, 30], [41.6, 36], [41.6, 48], [52, 54], [52, 66]] },
  { c: 1, pts: [[12, 66], [12, 54], [12, 42], [22.4, 36], [32.8, 30], [32.8, 18], [22.4, 12], [12, 6], [12, -6]] },
  { c: 2, pts: [[104, 10], [93.6, 16], [83.2, 22], [83.2, 34], [83.2, 46], [72.8, 52], [72.8, 64]] },
].map(({ c, pts }) => ({
  sh: SHADES[c],
  points: pts.map((p) => p.join(',')).join(' '),
  // Joints wherever the run changes direction.
  elbows: pts.slice(1, -1).filter((p, i) => {
    const a = pts[i];
    const b = pts[i + 2];
    return Math.abs((p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])) > 0.01;
  }),
}));

/** A small static preview for a picker button. Decorative: label the button instead. */
export function SaverThumb({ id }: { id: SaverId }) {
  return (
    <svg className={`saver2-thumb saver2-thumb--${id}`} viewBox="0 0 96 60" aria-hidden="true" focusable="false">
      {id === 'keycaps' &&
        THUMB_CAPS.map((cap, i) => (
          <g key={i} transform={`translate(${cap.x} ${cap.y}) rotate(${cap.a})`}>
            <rect x={-cap.s / 2} y={-cap.s / 2} width={cap.s} height={cap.s} rx={cap.s * 0.18} fill={SHADES[cap.c].side} stroke={INK} strokeWidth={0.8} />
            <rect
              x={cap.tx - cap.s * 0.36}
              y={cap.ty - cap.s * 0.36}
              width={cap.s * 0.72}
              height={cap.s * 0.72}
              rx={cap.s * 0.13}
              fill={SHADES[cap.c].top}
              stroke={INK}
              strokeWidth={0.6}
            />
            {cap.ch && (
              <text
                x={cap.tx}
                y={cap.ty}
                fontSize={round1(cap.s * 0.4)}
                fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="central"
                fill={INK}
              >
                {cap.ch}
              </text>
            )}
          </g>
        ))}
      {id === 'starfield' && (
        <g strokeLinecap="round">
          {THUMB_STARS.map((st, i) => (
            <line key={i} x1={st.x1} y1={st.y1} x2={st.x2} y2={st.y2} stroke={st.c} strokeWidth={st.w} strokeOpacity={st.o} />
          ))}
        </g>
      )}
      {id === 'pipes' && (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {THUMB_PIPES.map((p, i) => (
            <g key={i}>
              <polyline points={p.points} stroke={p.sh.dark} strokeWidth={6.4} />
              <polyline points={p.points} stroke={p.sh.base} strokeWidth={4.2} transform="translate(-0.4 -0.55)" />
              <polyline points={p.points} stroke={p.sh.hi} strokeWidth={1.3} transform="translate(-1.1 -1.5)" />
              {p.elbows.map(([x, y]) => (
                <g key={`${x},${y}`}>
                  <circle cx={x} cy={y} r={3.5} fill={p.sh.dark} />
                  <circle cx={x - 0.45} cy={y - 0.65} r={2.6} fill={p.sh.base} />
                  <circle cx={x - 1.2} cy={y - 1.7} r={0.8} fill={p.sh.hi} />
                </g>
              ))}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
