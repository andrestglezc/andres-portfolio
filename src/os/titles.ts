'use client';

import { useCallback } from 'react';
import type { CaseStudyKey } from '@/lib/content';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';
import { appTitle, AppId } from './apps';

/**
 * Names a window in the current language: the app's title, or the case study's
 * name for a case-study window. Used by the window bar, dock, top bar and palette.
 */
export function useWinTitle() {
  const t = useT();
  const { caseStudies } = useContent();
  return useCallback(
    (win: { app: AppId; study?: CaseStudyKey }) => (win.app === 'case' && win.study ? caseStudies[win.study].name : appTitle(win.app, t)),
    [t, caseStudies],
  );
}
