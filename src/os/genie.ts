// The minimize effect: the window pours into its dock tile like liquid through a
// funnel. The bottom edge pinches towards the tile first, the rest of the window
// follows down the neck, and the whole thing squashes as it lands.
//
// It is done with a clip-path polygon whose sides are sampled along a smooth
// curve, plus a translate and vertical squash. Every keyframe has the same
// number of points so the browser can interpolate between them.

export interface GenieFrames {
  clipPath: string[];
  x: number[];
  y: number[];
  scaleY: number[];
  opacity: number[];
}

const FRAMES = 18;
const ROWS = 12;

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
const pct = (v: number) => `${Math.round(v * 10000) / 100}%`;

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Keyframes that pour `box` into the screen point (tx, ty). */
export function genieFrames(box: Box, tx: number, ty: number): GenieFrames {
  // Where the neck of the funnel sits along the window's bottom edge.
  const neck = clamp((tx - box.left) / box.width, 0.06, 0.94);
  const neckWidth = clamp(46 / box.width, 0.02, 0.2);
  const dx = tx - (box.left + neck * box.width);
  const dy = ty - (box.top + box.height);
  const out: GenieFrames = { clipPath: [], x: [], y: [], scaleY: [], opacity: [] };

  for (let f = 0; f < FRAMES; f++) {
    const p = f / (FRAMES - 1);
    const left: string[] = [];
    const right: string[] = [];
    for (let r = 0; r < ROWS; r++) {
      const t = r / (ROWS - 1); // 0 = top edge, 1 = bottom edge
      // The pinch starts at the bottom and travels up the window.
      const k = smooth(p * 2.1 - (1 - t) * 1.1);
      const w = 1 - (1 - neckWidth) * k;
      left.push(`${pct(neck * (1 - w))} ${pct(t)}`);
      right.push(`${pct(neck + (1 - neck) * w)} ${pct(t)}`);
    }
    out.clipPath.push(`polygon(${[...left, ...right.reverse()].join(', ')})`);

    // The slide starts once the bottom has begun to pinch, and accelerates.
    const q = clamp((p - 0.2) / 0.8);
    const m = q * q * (3 - 2 * q) * (0.35 + 0.65 * q);
    const s = 1 - 0.9 * m;
    out.scaleY.push(s);
    out.x.push(dx * m);
    // Scaling is about the centre, so add back half the lost height to keep the bottom edge on course.
    out.y.push(dy * m + ((1 - s) * box.height) / 2);
    out.opacity.push(p < 0.82 ? 1 : clamp(1 - (p - 0.82) / 0.18));
  }
  return out;
}

/** Measure a window and its dock tile. Null when either is missing or motion is reduced. */
export function measureGenie(id: string, app: string): GenieFrames | null {
  if (typeof document === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const el = document.querySelector<HTMLElement>(`[data-win="${CSS.escape(id)}"]`);
  if (!el) return null;
  // Layout box, not the client rect: the window may still be mid-animation and transformed.
  const parent = el.offsetParent?.getBoundingClientRect();
  const r = {
    left: (parent?.left ?? 0) + el.offsetLeft,
    top: (parent?.top ?? 0) + el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
  if (r.width < 1 || r.height < 1) return null;
  const tile =
    document.querySelector<HTMLElement>(`[data-dock-win="${CSS.escape(id)}"]`) ??
    document.querySelector<HTMLElement>(`[data-dock-app="${CSS.escape(app)}"]`);
  const t = tile?.getBoundingClientRect();
  const tx = t ? t.left + t.width / 2 : window.innerWidth / 2;
  const ty = t ? t.top + t.height / 2 : window.innerHeight - 40;
  return genieFrames(r, tx, ty);
}

export function reverseGenie(g: GenieFrames): GenieFrames {
  return {
    clipPath: [...g.clipPath].reverse(),
    x: [...g.x].reverse(),
    y: [...g.y].reverse(),
    scaleY: [...g.scaleY].reverse(),
    opacity: [...g.opacity].reverse(),
  };
}
