import type { CaseStudy } from '@/lib/content';

/** Generated two-colour artwork for a case study (pure CSS, no image requests). */
export default function CardArt({ art }: { art: CaseStudy['art'] }) {
  return <span className={`art art--${art.pattern}`} style={{ '--a': art.a, '--b': art.b } as React.CSSProperties} aria-hidden="true" />;
}
