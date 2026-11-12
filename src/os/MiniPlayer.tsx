'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useOS } from './store';
import { useMusicStore, TRACKS } from '@/lib/musicStore';
import Icon from './Icon';
import { useT } from '@/lib/strings';

/** Floating controls shown while the Music window is minimized. */
export default function MiniPlayer() {
  const minimized = useOS((s) => s.windows.some((w) => w.id === 'music' && w.minimized));
  const focus = useOS((s) => s.focus);
  const { trackIndex, playing, togglePlay, next } = useMusicStore();
  const track = TRACKS[trackIndex];
  const t = useT();

  return (
    <AnimatePresence>
      {minimized && (
        <motion.div
          className="mini"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`mini-cover${playing ? ' is-spinning' : ''}`} src={track.cover} alt="" />
          <button type="button" className="mini-info" onClick={() => focus('music')} aria-label={t('mini.open', { title: track.title, artist: track.artist })}>
            <strong>{track.title}</strong>
            <span>{track.artist}</span>
          </button>
          <button type="button" className="icon-btn" onClick={togglePlay} aria-label={t(playing ? 'common.pause' : 'common.play')}>
            <Icon name={playing ? 'pause' : 'play'} size={16} />
          </button>
          <button type="button" className="icon-btn" onClick={next} aria-label={t('common.nextTrack')}>
            <Icon name="next" size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
