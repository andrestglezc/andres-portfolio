import { create } from 'zustand';
import type { StringKey } from './strings';

/** `noteKey` is the "Why I love this" note, an interface string (src/lib/strings.ts). */
export const TRACKS: { id: number; title: string; artist: string; src: string; cover: string; noteKey: StringKey }[] = [
  {
    id: 1,
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    src: '/fly-me-to-the-moon.mp3',
    cover: '/cover-flymetothemoon.jpg',
    noteKey: 'music.note.fly',
  },
  {
    id: 2,
    title: 'Hey Joe',
    artist: 'Jimi Hendrix',
    src: '/hey-joe.mp3',
    cover: '/cover-heyjoe.jpg',
    noteKey: 'music.note.joe',
  },
];

interface MusicState {
  trackIndex: number;
  playing: boolean;
  progress: number;
  togglePlay: () => void;
  stop: () => void;
  switchTrack: (idx: number, autoplay?: boolean) => void;
  next: () => void;
  prev: () => void;
  seek: (pct: number) => void;
}

// Audio element is created lazily on first use, so no MP3 is fetched
// until the visitor actually presses play.
let audio: HTMLAudioElement | null = null;
// A seek asked for before the track's length is known (preload is 'none'); applied once metadata loads.
let pendingSeek: number | null = null;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!audio) {
    audio = new Audio();
    audio.preload = 'none';
    audio.src = TRACKS[useMusicStore.getState().trackIndex].src;
    audio.addEventListener('timeupdate', () => {
      if (audio && audio.duration) {
        useMusicStore.setState({ progress: (audio.currentTime / audio.duration) * 100 });
      }
    });
    audio.addEventListener('loadedmetadata', () => {
      if (audio && pendingSeek !== null && audio.duration) audio.currentTime = (pendingSeek / 100) * audio.duration;
      pendingSeek = null;
    });
    // Auto-advance through the playlist.
    audio.addEventListener('ended', () => useMusicStore.getState().next());
  }
  return audio;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  trackIndex: 0,
  playing: false,
  progress: 0,

  stop: () => {
    audio?.pause();
    set({ playing: false });
  },

  togglePlay: () => {
    const a = getAudio();
    if (!a) return;
    if (get().playing) {
      a.pause();
      set({ playing: false });
    } else {
      a.play().catch(() => set({ playing: false }));
      set({ playing: true });
    }
  },

  switchTrack: (idx, autoplay = false) => {
    const a = getAudio();
    if (a) {
      a.pause();
      pendingSeek = null;
      a.src = TRACKS[idx].src;
      if (autoplay) a.play().catch(() => set({ playing: false }));
    }
    set({ trackIndex: idx, progress: 0, playing: autoplay });
  },

  next: () => get().switchTrack((get().trackIndex + 1) % TRACKS.length, true),
  prev: () => get().switchTrack((get().trackIndex - 1 + TRACKS.length) % TRACKS.length, true),

  seek: (pct) => {
    const a = getAudio();
    if (!a) return;
    if (a.duration) {
      a.currentTime = (pct / 100) * a.duration;
    } else {
      // Nothing has loaded yet: remember the position and fetch just the metadata.
      pendingSeek = pct;
      a.preload = 'metadata';
      a.load();
    }
    set({ progress: pct });
  },
}));
