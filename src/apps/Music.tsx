'use client';

import Icon from '@/os/Icon';
import { useMusicStore, TRACKS } from '@/lib/musicStore';
import { useT } from '@/lib/strings';

export default function Music() {
  const { trackIndex, playing, progress, togglePlay, switchTrack, prev, next, seek } = useMusicStore();
  const track = TRACKS[trackIndex];
  const t = useT();

  return (
    <div className="music app-scroll">
      <div className={`vinyl${playing ? ' is-spinning' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={track.cover} alt={t('music.cover', { title: track.title })} width={480} height={480} />
      </div>
      <div className="music-info">
        <strong>{track.title}</strong>
        <span>{track.artist}</span>
      </div>

      <input
        className="scrub"
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label={t('music.seek')}
        style={{ '--p': `${progress}%` } as React.CSSProperties}
      />

      <div className="music-controls">
        <button type="button" className="icon-btn" onClick={prev} aria-label={t('common.prevTrack')}>
          <Icon name="prev" size={18} />
        </button>
        <button type="button" className="icon-btn icon-btn--lg" onClick={togglePlay} aria-label={t(playing ? 'common.pause' : 'common.play')}>
          <Icon name={playing ? 'pause' : 'play'} size={22} />
        </button>
        <button type="button" className="icon-btn" onClick={next} aria-label={t('common.nextTrack')}>
          <Icon name="next" size={18} />
        </button>
      </div>

      <blockquote className="music-note">
        <span className="eyebrow">{t('music.why')}</span>
        {t(track.noteKey)}
      </blockquote>

      <ol className="tracks">
        {TRACKS.map((tr, i) => (
          <li key={tr.id}>
            <button type="button" className={i === trackIndex ? 'is-current' : ''} aria-current={i === trackIndex} onClick={() => switchTrack(i, true)}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {tr.title}
              <em>{tr.artist}</em>
            </button>
          </li>
        ))}
      </ol>
      <p className="fineprint">{t('music.fineprint')}</p>
    </div>
  );
}
