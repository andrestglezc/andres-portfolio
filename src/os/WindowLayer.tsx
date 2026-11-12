'use client';

import { AnimatePresence } from 'framer-motion';
import { useOS } from './store';
import Window from './Window';

export default function WindowLayer() {
  const windows = useOS((s) => s.windows);
  return (
    <AnimatePresence>
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}
    </AnimatePresence>
  );
}
