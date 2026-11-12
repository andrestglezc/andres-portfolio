// Synthesized retro chimes using Web Audio API — no external files needed

function playNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume = 0.18,
  type: OscillatorType = 'sine',
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
  gain.gain.setValueAtTime(volume, startTime + duration - 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

// ─── Mute ────────────────────────────────────────────────────────────────────
// One switch for every sound the OS makes (the Music app has its own controls).

const MUTE_KEY = 'nos-muted';
let muted = false;

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? '1' : '0');
  } catch { /* storage unavailable */ }
}

/** Read the saved choice. Call once on the client. */
export function restoreMuted() {
  try {
    muted = localStorage.getItem(MUTE_KEY) === '1';
  } catch { /* storage unavailable */ }
  return muted;
}

function makeCtx() {
  return new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)();
}

// Rising arpeggio → sustained chord — Win98-inspired
export function playStartupChime() {
  if (muted) return;
  try {
    const ctx = makeCtx();
    const t = ctx.currentTime;
    playNote(ctx, 523.25, t + 0.00, 0.35, 0.14); // C5
    playNote(ctx, 659.25, t + 0.10, 0.35, 0.14); // E5
    playNote(ctx, 783.99, t + 0.20, 0.35, 0.14); // G5
    playNote(ctx, 1046.5, t + 0.35, 1.00, 0.20); // C6
    playNote(ctx, 1174.66,t + 0.50, 0.80, 0.14); // D6
    playNote(ctx, 1318.51,t + 0.65, 0.80, 0.14); // E6
    playNote(ctx, 1046.5, t + 0.80, 1.20, 0.18); // C6 sustain
    setTimeout(() => ctx.close(), 2600);
  } catch { /* audio blocked */ }
}

// Descending notes — shutdown farewell
export function playShutdownChime() {
  if (muted) return;
  try {
    const ctx = makeCtx();
    const t = ctx.currentTime;
    playNote(ctx, 1046.5, t + 0.00, 0.40, 0.18); // C6
    playNote(ctx, 880.00, t + 0.20, 0.40, 0.18); // A5
    playNote(ctx, 783.99, t + 0.40, 0.40, 0.18); // G5
    playNote(ctx, 659.25, t + 0.60, 0.50, 0.15); // E5
    playNote(ctx, 523.25, t + 0.80, 0.90, 0.18); // C5
    setTimeout(() => ctx.close(), 2000);
  } catch { /* audio blocked */ }
}

// Soft two-note descend — going to sleep
export function playSleepChime() {
  if (muted) return;
  try {
    const ctx = makeCtx();
    const t = ctx.currentTime;
    playNote(ctx, 880.00, t + 0.00, 0.65, 0.12); // A5
    playNote(ctx, 659.25, t + 0.30, 0.90, 0.10); // E5
    setTimeout(() => ctx.close(), 1500);
  } catch { /* audio blocked */ }
}

// ─── Key click ───────────────────────────────────────────────────────────────
// A mechanical keyboard press: a bright tick as the switch bottoms out, a low
// "thock" from the case, and a softer tick on the way back up. One shared
// context, because this can fire many times in a row.

let clickCtx: AudioContext | null = null;
let clickNoise: AudioBuffer | null = null;

function tick(ctx: AudioContext, noise: AudioBuffer, at: number, freq: number, volume: number) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = freq;
  band.Q.value = 1.4;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
  src.connect(band).connect(gain).connect(ctx.destination);
  src.start(at);
  src.stop(at + 0.04);
}

export function playKeyClick() {
  if (muted) return;
  try {
    const ctx = (clickCtx ??= makeCtx());
    if (ctx.state === 'suspended') void ctx.resume();
    if (!clickNoise) {
      clickNoise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
      const data = clickNoise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const t = ctx.currentTime + 0.005;
    // A little variation so repeated presses do not sound stamped out.
    const vary = 0.92 + Math.random() * 0.16;

    tick(ctx, clickNoise, t, 2600 * vary, 0.22);

    const thock = ctx.createOscillator();
    const body = ctx.createGain();
    thock.type = 'sine';
    thock.frequency.setValueAtTime(170 * vary, t);
    thock.frequency.exponentialRampToValueAtTime(70, t + 0.06);
    body.gain.setValueAtTime(0.2, t);
    body.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    thock.connect(body).connect(ctx.destination);
    thock.start(t);
    thock.stop(t + 0.09);

    tick(ctx, clickNoise, t + 0.075, 3400 * vary, 0.1);
  } catch { /* audio blocked */ }
}

// ─── Interface sounds ────────────────────────────────────────────────────────

/** Browsers block sound until the visitor has interacted; do not even create a context before that. */
const canPlay = () => typeof navigator === 'undefined' || !navigator.userActivation || navigator.userActivation.hasBeenActive;

function sfx() {
  const ctx = (clickCtx ??= makeCtx());
  if (ctx.state === 'suspended') void ctx.resume();
  if (!clickNoise) {
    clickNoise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
    const data = clickNoise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return { ctx, noise: clickNoise };
}

/** A soft, short tick for buttons and links. Deliberately quiet. */
export function playUiClick() {
  if (muted || !canPlay()) return;
  try {
    const { ctx, noise } = sfx();
    tick(ctx, noise, ctx.currentTime + 0.002, 1900, 0.06);
  } catch { /* audio blocked */ }
}

/** Air moving: a window opening (rising) or leaving (falling). */
export function playWhoosh(direction: 'in' | 'out' = 'in') {
  if (muted || !canPlay()) return;
  try {
    const { ctx } = sfx();
    const t = ctx.currentTime + 0.005;
    const length = 0.26;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = 0.9;
    const [from, to] = direction === 'in' ? [320, 2400] : [2200, 280];
    band.frequency.setValueAtTime(from, t);
    band.frequency.exponentialRampToValueAtTime(to, t + length);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.09, t + length * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    src.connect(band).connect(gain).connect(ctx.destination);
    src.start(t);
    src.stop(t + length + 0.02);
  } catch { /* audio blocked */ }
}
