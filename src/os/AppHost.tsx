'use client';

import dynamic from 'next/dynamic';
import type { Win } from './store';
import About from '@/apps/About';
import Work from '@/apps/Work';
import CaseStudyView from '@/apps/CaseStudy';
import Contact from '@/apps/Contact';
import Music from '@/apps/Music';
import Arcade from '@/apps/Arcade';
import Shrine from '@/apps/Shrine';
import System from '@/apps/System';
import Now from '@/apps/Now';
import { useT } from '@/lib/strings';

function ResumeLoading() {
  const t = useT();
  return <div className="app-empty">{t('resume.loading')}</div>;
}

// react-pdf needs browser-only APIs (DOMMatrix), so it must never be evaluated during prerender.
const Resume = dynamic(() => import('@/apps/Resume'), {
  ssr: false,
  loading: () => <ResumeLoading />,
});

export default function AppHost({ win }: { win: Win }) {
  switch (win.app) {
    case 'about':
      return <About />;
    case 'work':
      return <Work />;
    case 'case':
      return win.study ? <CaseStudyView studyKey={win.study} /> : null;
    case 'resume':
      return <Resume />;
    case 'contact':
      return <Contact />;
    case 'music':
      return <Music />;
    case 'arcade':
      return <Arcade />;
    case 'shrine':
      return <Shrine />;
    case 'readme':
      return null; // shown by <Note />, never as a window
    case 'now':
      return <Now />;
    case 'system':
      return <System />;
  }
}
