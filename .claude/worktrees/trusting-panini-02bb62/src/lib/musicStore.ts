import { create } from 'zustand';

export const TRACKS = [
  {
    id: 1,
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    src: '/fly-me-to-the-moon.mp3',
    cover: '/cover-flymetothemoon.jpg',
    note: "I love this song — it brings so much nostalgia. And for an awesome anime ending song... if you know, you know. 🌙",
  },
  {
    id: 2,
    title: 'Hey Joe',
    artist: 'Jimi Hendrix',
    src: '/hey-joe.mp3',
    cover: '/cover-heyjoe.jpg',
    note: "Hey Joe was the song that inspired me to learn and play guitar. So iconic, so classic — and somehow still feels completely modern.",
  },
];

// Module-level audio singleton — survives React unmounts
let _audio: HTMLAudioElement | null = null;

export function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!_audio) {
    _audio = new Audio(TRACKS[0].src);
  }
  return _audio;
}

interface MusicState {
  trackIndex: number;
  playing: boolean;
  progress: number;
}

interface MusicActions {
  togglePlay: () => void;
  stop: () => void;
  switchTrack: (idx: number) => void;
  next: () => void;
  prev: () => void;
  seek: (pct: number) => void;
}

export const useMusicStore = create<MusicState & MusicActions>((set, get) => ({
  trackIndex: 0,
  playing: false,
  progress: 0,

  stop: () => {
    const audio = getAudio();
    if (audio) audio.pause();
    set({ playing: false });
  },

  togglePlay: () => {
    const audio = getAudio();
    if (!audio) return;
    if (get().playing) {
      audio.pause();
      set({ playing: false });
    } else {
      audio.play().catch(() => {});
      set({ playing: true });
    }
  },

  switchTrack: (idx) => {
    const audio = getAudio();
    if (audio) {
      audio.pause();
      audio.src = TRACKS[idx].src;
      audio.currentTime = 0;
    }
    set({ trackIndex: idx, progress: 0, playing: false });
  },

  next: () => {
    const { trackIndex } = get();
    const nextIdx = (trackIndex + 1) % TRACKS.length;
    const audio = getAudio();
    if (audio) {
      audio.pause();
      audio.src = TRACKS[nextIdx].src;
      audio.load();
      audio.play().catch(() => {});
    }
    set({ trackIndex: nextIdx, progress: 0, playing: true });
  },

  prev: () => {
    const { trackIndex } = get();
    const prevIdx = (trackIndex - 1 + TRACKS.length) % TRACKS.length;
    const audio = getAudio();
    if (audio) {
      audio.pause();
      audio.src = TRACKS[prevIdx].src;
      audio.load();
      audio.play().catch(() => {});
    }
    set({ trackIndex: prevIdx, progress: 0, playing: true });
  },

  seek: (pct) => {
    const audio = getAudio();
    if (audio && audio.duration) {
      audio.currentTime = (pct / 100) * audio.duration;
      set({ progress: pct });
    }
  },
}));

// Wire up audio event listeners once at module load (client-side only)
if (typeof window !== 'undefined') {
  const audio = getAudio()!;
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      useMusicStore.setState({ progress: (audio.currentTime / audio.duration) * 100 });
    }
  });
  audio.addEventListener('ended', () => {
    useMusicStore.setState({ playing: false });
  });
}
