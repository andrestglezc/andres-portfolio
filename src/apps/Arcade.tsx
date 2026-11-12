'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Minesweeper from './Minesweeper';
import { useT } from '@/lib/strings';

// Titles and captions stay as they are in every language: names, studios and each game's own catchphrase.
const GAMES = [
  { id: 'doom', label: 'DOOM', src: '/doom.mp4', caption: 'DOOM (1993) · id Software · rip and tear', pixelated: true },
  { id: 'aoe', label: 'Age of Empires', src: '/aoe.mp4', caption: 'Age of Empires (1997) · Ensemble Studios · wololo', pixelated: false },
  { id: 'sims', label: 'The Sims', src: '/sims.mp4', caption: 'The Sims (2000) · Maxis · sul sul!', pixelated: true },
];

export default function Arcade() {
  // Minesweeper is the one you can actually play; the rest are loops of old favourites.
  const [id, setId] = useState('mines');
  const reduce = useReducedMotion();
  const t = useT();
  const game = GAMES.find((g) => g.id === id) ?? GAMES[0];
  return (
    <div className="arcade">
      <div className="tabs" role="tablist" aria-label={t('arcade.games')}>
        <button type="button" role="tab" aria-selected={id === 'mines'} className={id === 'mines' ? 'is-current' : ''} onClick={() => setId('mines')}>
          {t('mines.title')}
        </button>
        {GAMES.map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={g.id === id} className={g.id === id ? 'is-current' : ''} onClick={() => setId(g.id)}>
            {g.label}
          </button>
        ))}
      </div>
      {id === 'mines' ? (
        <div className="arcade-game">
          <Minesweeper />
        </div>
      ) : (
        <>
          <div className="arcade-screen">
            <video key={game.src} src={game.src} autoPlay={!reduce} loop muted playsInline controls aria-label={t('arcade.gameplay', { game: game.label })} className={game.pixelated ? 'is-pixelated' : ''} />
          </div>
          <p className="arcade-caption">{game.caption}</p>
        </>
      )}
    </div>
  );
}
