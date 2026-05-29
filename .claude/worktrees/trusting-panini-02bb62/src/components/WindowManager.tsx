'use client';

import { AnimatePresence } from 'framer-motion';
import { useWindowStore } from '@/lib/windows';
import Window from './Window';

export default function WindowManager() {
  const windows = useWindowStore(s => s.windows);

  return (
    <AnimatePresence mode="sync">
      {windows
        .filter(w => !w.isMinimized)
        .map(w => (
          <Window key={w.id} win={w} />
        ))}
    </AnimatePresence>
  );
}
