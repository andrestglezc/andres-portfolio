'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';
import { useOS } from './store';
import { useReturnFocus } from './hooks';
import type { AppId } from './apps';
import { useContent } from '@/lib/useContent';
import { StringKey, useT } from '@/lib/strings';

const START: { app: AppId; label: StringKey }[] = [
  { app: 'work', label: 'common.caseStudies' },
  { app: 'about', label: 'app.about.title' },
  { app: 'resume', label: 'common.resume' },
  { app: 'contact', label: 'app.contact.title' },
];

/** The README: the desktop's sticky note, enlarged in the centre over a dimmed page. */
export default function Note() {
  const isOpen = useOS((s) => s.noteOpen);
  const setNote = useOS((s) => s.setNote);
  const open = useOS((s) => s.open);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = useT();
  const { readme } = useContent();
  useReturnFocus(isOpen);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  const go = (app: AppId) => {
    setNote(false);
    open(app);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="note-scrim"
          onClick={() => setNote(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="note"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-title"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, rotate: 8, y: -40 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -1.5, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: 6 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <button ref={closeRef} type="button" className="note-close" aria-label={t('note.close')} onClick={() => setNote(false)}>
              <Icon name="close" size={16} />
            </button>
            <h2 id="note-title">{readme.greeting}</h2>
            {readme.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="signature">{readme.signature}</p>
            <div className="note-links">
              {START.map((s) => (
                <button key={s.app} type="button" onClick={() => go(s.app)}>
                  {t(s.label)} <Icon name="arrowRight" size={13} />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
