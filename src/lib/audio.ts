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

function makeCtx() {
  return new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)();
}

// Rising arpeggio → sustained chord — Win98-inspired
export function playStartupChime() {
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
  try {
    const ctx = makeCtx();
    const t = ctx.currentTime;
    playNote(ctx, 880.00, t + 0.00, 0.65, 0.12); // A5
    playNote(ctx, 659.25, t + 0.30, 0.90, 0.10); // E5
    setTimeout(() => ctx.close(), 1500);
  } catch { /* audio blocked */ }
}
