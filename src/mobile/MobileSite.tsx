'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/os/Icon';
import { useOS } from '@/os/store';
import { Logo } from '@/os/TopBar';
import { useClock, useDismiss, usePlace, useReturnFocus } from '@/os/hooks';
import ClockPanel, { cityLabel } from '@/os/ClockPanel';
import HeroTitle from '@/os/HeroTitle';
import LangToggle from '@/os/LangToggle';
import Mascot from '@/os/Mascot';
import SiteBadges from '@/os/SiteBadges';
import { appTitle } from '@/os/apps';
import { NowSections } from '@/apps/Now';
import { ProjectCard } from '@/apps/Work';
import CaseStudyView from '@/apps/CaseStudy';
import { AboutSections } from '@/apps/About';
import type { CaseStudyKey } from '@/lib/content';
import { useContent } from '@/lib/useContent';
import { useLang } from '@/lib/i18n';
import { useT } from '@/lib/strings';

/** Phones get the same content and visual language as a single scrolling page. */
export default function MobileSite() {
  const t = useT();
  const lang = useLang();
  const { caseStudyOrder, caseStudies, profile, contactNote, now } = useContent();
  const place = usePlace(profile.timeZone);
  const clock = useClock(place.timeZone);
  const [cal, setCal] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);
  useDismiss(calRef, cal, () => setCal(false));
  const [study, setStudy] = useState<CaseStudyKey | null>(null);
  // The sheet covers the page: hand focus back to the card that opened it.
  useReturnFocus(!!study);

  // Lock the page behind the case-study sheet and let Escape / Back close it.
  useEffect(() => {
    if (!study) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setStudy(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [study]);

  return (
    <div className="m">
      {/* Everything under the case-study sheet leaves the tab order while it is open. */}
      <div inert={study ? true : undefined}>
        <header className="m-bar">
          <a href="#top" className="m-brand" aria-label={t('mobile.backToTop', { name: profile.shortName })}>
            <Logo size={22} />
            <span>{profile.shortName}</span>
          </a>
          <div className="m-clock" ref={calRef}>
            <button
              type="button"
              className={`pill pill--clock${cal ? ' is-open' : ''}`}
              aria-haspopup="dialog"
              aria-expanded={cal}
              onClick={() => setCal((c) => !c)}
            >
              <span className="dot" />
              <span className="pill-city">{cityLabel(place, t, lang).toUpperCase()}</span>
              <span>{clock}</span>
            </button>
            {cal && (
              <div className="m-clockpanel">
                <ClockPanel place={place} />
              </div>
            )}
          </div>
          <a href="#contact" className="btn btn--ink btn--sm">{appTitle('contact', t)}</a>
        </header>

        <section className="m-hero" id="top">
          <p className="hero-eyebrow">{profile.title}</p>
          <HeroTitle />
          <p className="hero-serif">
            {t('hero.serif1', { years: profile.years })} {t('hero.serif2')}
          </p>
          <div className="m-actions">
            <a href="#work" className="btn btn--ink">{t('mobile.seeWork')}</a>
            <a href={profile.resumeUrl} download={profile.resumeFilename} className="btn">
              <Icon name="download" size={16} /> CV
            </a>
          </div>
          <nav className="m-jump" aria-label={t('mobile.sections')}>
            <a href="#about">{appTitle('about', t)}</a>
            <a href="#work">{appTitle('work', t)}</a>
            <a href="#contact">{appTitle('contact', t)}</a>
            <LangToggle className="m-jump-lang" iconSize={14} />
          </nav>
          <button type="button" className="m-recruiter" onClick={() => useOS.getState().setRecruiter(true)}>
            <Icon name="print" size={14} /> {t('mobile.recruiter')}
          </button>
        </section>

        <section className="m-section" id="about">
          <h2 className="display">{appTitle('about', t)}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="about-photo" src={profile.photo} alt={profile.name} width={360} height={360} />
          <p className="status">
            <span className="dot" /> {profile.availability}
          </p>
          <p className="serif-lead">{profile.intro}</p>
          <dl className="facts">
            <div><dt>{t('about.now')}</dt><dd>{profile.currentRole}</dd></div>
            <div><dt>{t('about.also')}</dt><dd>{profile.alsoRole}</dd></div>
            <div><dt>{t('about.route')}</dt><dd>{profile.origin}</dd></div>
            <div><dt>{t('about.offScreen')}</dt><dd>{profile.personal}</dd></div>
          </dl>
        </section>


        <section className="m-section" id="work">
          <h2 className="display">{appTitle('work', t)}</h2>
          <div className="project-grid">
            {caseStudyOrder.map((key) => (
              <ProjectCard key={key} studyKey={key} onOpen={(k) => setStudy(k)} />
            ))}
          </div>
        </section>

        <section className="m-section" id="more">
          <h2 className="display">{t('mobile.more')}</h2>
          <AboutSections />
        </section>

        <section className="m-section" id="now">
          <h2 className="display">{appTitle('now', t)}</h2>
          <p className="serif-lead">{now.lead}</p>
          <NowSections />
          <p className="fineprint">{t('common.updated', { date: now.updated })}</p>
        </section>

        <section className="m-section m-contact" id="contact">
          <h2 className="display">{t('common.sayHi')}</h2>
          {contactNote.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <a className="btn btn--accent" href={`mailto:${profile.email}`}>
            <Icon name="mail" size={16} /> {profile.email}
          </a>
          <a className="btn btn--paper" href={profile.linkedin} target="_blank" rel="noreferrer">
            <Icon name="linkedin" size={16} /> LinkedIn
          </a>
          <a className="btn btn--paper" href={profile.resumeUrl} download={profile.resumeFilename}>
            <Icon name="download" size={16} /> {t('common.downloadCv')}
          </a>
          <p className="fineprint">
            © {new Date().getFullYear()} {profile.name} · {profile.location}
            <br />
            {t('mobile.desktopNote')}
          </p>
          <SiteBadges />
        </section>
      </div>

      {!study && (
        <Mascot
          mobile
          supports={(cta) => !!cta.study || cta.app === 'contact' || cta.app === 'about'}
          onAction={(cta) => {
            if (cta.study) setStudy(cta.study);
            else if (cta.app) {
              const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              document.getElementById(cta.app)?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
            }
          }}
        />
      )}

      <AnimatePresence>
        {study && (
          <motion.div
            className="m-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={caseStudies[study].name}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="m-sheet-bar">
              <strong>{caseStudies[study].name}</strong>
              <button type="button" className="icon-btn" onClick={() => setStudy(null)} aria-label={t('mobile.closeCase')} autoFocus>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="m-sheet-body">
              <CaseStudyView studyKey={study} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
