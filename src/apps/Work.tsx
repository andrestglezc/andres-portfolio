'use client';

import CardArt from './CardArt';
import Icon from '@/os/Icon';
import { useOS } from '@/os/store';
import { appTitle } from '@/os/apps';
import type { CaseStudyKey } from '@/lib/content';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

export function ProjectCard({ studyKey, onOpen }: { studyKey: CaseStudyKey; onOpen: (key: CaseStudyKey, el: HTMLElement) => void }) {
  const cs = useContent().caseStudies[studyKey];
  return (
    <button type="button" className="project" onClick={(e) => onOpen(studyKey, e.currentTarget)}>
      <span className="project-art">
        <CardArt art={cs.art} />
        <span className="project-open">
          <Icon name="arrowUpRight" size={18} />
        </span>
      </span>
      <span className="project-name">{cs.name}</span>
      <span className="project-kicker">{cs.kicker}</span>
      <span className="project-meta">
        {cs.role} · {cs.period}
      </span>
    </button>
  );
}

export default function Work() {
  const open = useOS((s) => s.open);
  const t = useT();
  const { caseStudyOrder } = useContent();
  const onOpen = (key: CaseStudyKey, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    open('case', { study: key, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
  };
  return (
    <div className="app-scroll work">
      <header className="app-head">
        <h2 className="display">{appTitle('work', t)}</h2>
        <p className="serif-lead">{t('work.lead', { n: caseStudyOrder.length })}</p>
      </header>
      <div className="project-grid">
        {caseStudyOrder.map((key) => (
          <ProjectCard key={key} studyKey={key} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
