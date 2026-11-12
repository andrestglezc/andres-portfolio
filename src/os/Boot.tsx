'use client';

import { useEffect, useRef } from 'react';
import { OS_NAME, OS_VERSION } from './apps';
import { Logo } from './TopBar';
import { useContent } from '@/lib/useContent';
import { StringKey, useT } from '@/lib/strings';

const BOOT_MS = 2100;

const LINES: StringKey[] = ['boot.line.memory', 'boot.line.type', 'boot.line.work', 'boot.line.cats'];

/** Short, skippable boot. `byGesture` tells the shell whether a chime is allowed to play. */
export default function Boot({ onDone }: { onDone: (byGesture: boolean) => void }) {
  const done = useRef(false);
  const t = useT();
  const { caseStudyOrder } = useContent();

  useEffect(() => {
    const finish = (byGesture: boolean) => {
      if (done.current) return;
      done.current = true;
      onDone(byGesture);
    };
    const timer = setTimeout(() => finish(false), BOOT_MS);
    const skip = () => finish(true);
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [onDone]);

  return (
    <div className="boot" role="status" aria-label={t('boot.starting', { os: OS_NAME })}>
      <div className="boot-center">
        <div className="boot-logo">
          <Logo size={56} />
        </div>
        <div className="boot-name">{OS_NAME}</div>
        <div className="boot-bar">
          <span style={{ animationDuration: `${BOOT_MS - 300}ms` }} />
        </div>
        <ul className="boot-lines">
          {LINES.map((key, i) => (
            <li key={key} style={{ animationDelay: `${200 + i * 330}ms` }}>
              <span>ok</span> {t(key, { n: caseStudyOrder.length })}
            </li>
          ))}
        </ul>
      </div>
      <div className="boot-foot">
        v{OS_VERSION} · © {new Date().getFullYear()} Andrés T. González C. · {t('boot.skip')}
      </div>
    </div>
  );
}
