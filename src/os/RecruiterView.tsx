'use client';

import { useEffect, useId, useRef } from 'react';
import Icon from './Icon';
import LangToggle from './LangToggle';
import { OS_NAME } from './apps';
import { caseStudies as caseStudiesEn, skills as skillsEn } from '@/lib/content';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

/** "mailto:a@b.c" → "a@b.c", "https://www.site.com/path/" → "site.com/path" */
function bareUrl(href: string) {
  return href
    .replace(/^mailto:/i, '')
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '');
}

/** The address to print after a link, or undefined when its text already shows it. */
function printUrl(text: string, href: string) {
  const url = bareUrl(href);
  return bareUrl(text).toLowerCase().includes(url.toLowerCase()) ? undefined : url;
}

/** Elements that are not page content, so they never need to leave the tab order. */
const NOT_CONTENT = new Set(['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT']);

function NewTab() {
  const t = useT();
  return (
    <>
      <span className="rec-ext">
        <Icon name="arrowUpRight" size={13} strokeWidth={2} />
      </span>
      <span className="sr-only">{t('common.newTab')}</span>
    </>
  );
}

// Sections are found by their English names, so the lookup works in every language.
const LANGUAGES_GROUP = skillsEn.findIndex((g) => /^languages?$/i.test(g.label));
const outcomeIndex = (key: keyof typeof caseStudiesEn) =>
  caseStudiesEn[key].sections.findIndex((s) => s.heading.toLowerCase() === 'outcome');

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" data-print-url={printUrl(children, href)}>
      {children}
      <NewTab />
    </a>
  );
}

/**
 * Recruiter mode: the whole portfolio as one plain, printable page.
 * Render it as a sibling after the `.os` (or phone `.m`) wrapper; it covers the viewport,
 * takes its siblings out of the tab order while open, and prints on its own.
 */
export default function RecruiterView({ onExit }: { onExit: () => void }) {
  const ids = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const t = useT();
  const { caseStudies, caseStudyOrder, certifications, education, experience, profile, skills } = useContent();

  const languages = skills[LANGUAGES_GROUP] as (typeof skills)[number] | undefined;
  const skillGroups = skills.filter((g) => g !== languages);
  const work = caseStudyOrder.map((key) => {
    const study = caseStudies[key];
    const section = study.sections[outcomeIndex(key)] ?? study.sections[0];
    return { key, study, section, link: section?.link ?? study.sections.find((s) => s.link)?.link };
  });
  const docTitle = `${profile.name} · ${profile.title}`;
  // Printed pages show where "Download CV" points, so it needs the full address.
  const resumeAbsolute = typeof window === 'undefined' ? profile.resumeUrl : new URL(profile.resumeUrl, window.location.href).href;

  // While open: everything behind leaves the tab order and the accessibility tree, and focus starts on
  // the name. On close all of it is put back, and focus returns to whatever opened this view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const hidden: HTMLElement[] = [];
    const hide = (nodes: Iterable<Node>) => {
      for (const el of nodes) {
        if (el === root || !(el instanceof HTMLElement) || el.inert || NOT_CONTENT.has(el.tagName)) continue;
        el.inert = true;
        hidden.push(el);
      }
    };
    const parent = root.parentElement;
    if (parent) hide(parent.children);
    // A sibling that mounts later (say the phone layout swapping in on resize) is covered too.
    const watcher = new MutationObserver((records) => records.forEach((r) => hide(r.addedNodes)));
    if (parent) watcher.observe(parent, { childList: true });
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      watcher.disconnect();
      hidden.forEach((el) => {
        el.inert = false;
      });
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  // The tab title names the document (it becomes the default "Save as PDF" file name),
  // follows the language, and goes back to the page's own title on close.
  useEffect(() => {
    const title = document.title;
    document.title = docTitle;
    return () => {
      document.title = title;
    };
  }, [docTitle]);

  // Escape goes back. Capture phase, so the OS behind never also sees it (it would close a window),
  // and Cmd/Ctrl+K cannot open the command palette out of sight.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.isComposing) {
        e.stopPropagation();
        onExit();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onExit]);

  const id = (name: string) => `${ids}-${name}`;

  return (
    <div className="rec" ref={rootRef}>
      <header className="rec-bar">
        <p className="rec-bar-label">
          {t('common.recruiterMode')} <span aria-hidden="true">·</span> <kbd>Esc</kbd> {t('rec.toGoBack')}
        </p>
        <div className="rec-bar-actions">
          <button type="button" className="rec-btn" onClick={onExit} aria-keyshortcuts="Escape">
            <Icon name="arrowLeft" size={16} />
            {t('rec.back', { os: OS_NAME })}
          </button>
          <LangToggle className="rec-btn" />
          <button type="button" className="rec-btn rec-btn--primary" onClick={() => window.print()}>
            <Icon name="print" size={16} />
            {t('rec.print')}
          </button>
        </div>
      </header>

      <main className="rec-doc" aria-labelledby={id('name')}>
        <header className="rec-head">
          <h1 id={id('name')} className="rec-name" ref={headingRef} tabIndex={-1}>
            {profile.name}
          </h1>
          <p className="rec-title">{profile.title}</p>
          <p className="rec-summary">
            {profile.summary} {profile.seeking}
          </p>
          <ul className="rec-contact" role="list" aria-label={t('app.contact.title')}>
            <li>
              <a href={`mailto:${profile.email}`} data-print-url={printUrl(profile.email, `mailto:${profile.email}`)}>
                {profile.email}
              </a>
            </li>
            <li>
              <ExternalLink href={profile.linkedin}>{profile.linkedinLabel}</ExternalLink>
            </li>
            <li>{profile.location}</li>
            <li>{profile.availability}</li>
            <li>
              <a className="rec-cv" href={profile.resumeUrl} download={profile.resumeFilename} data-print-url={bareUrl(resumeAbsolute)}>
                <span className="rec-ext">
                  <Icon name="download" size={15} />
                </span>
                {t('common.downloadCv')}
              </a>
            </li>
          </ul>
        </header>

        <section className="rec-section" aria-labelledby={id('exp')}>
          <h2 id={id('exp')} className="rec-h2">
            {t('section.experience')}
          </h2>
          <ol className="rec-list rec-list--exp" role="list">
            {experience.map((job) => (
              <li key={`${job.company}-${job.period}`} className="rec-item">
                <div className="rec-item-head">
                  <h3 className="rec-h3">{job.company}</h3>
                  <p className="rec-meta">{job.period}</p>
                </div>
                <ul className="rec-roles" role="list">
                  {job.roles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
                {job.note && <p className="rec-note">{job.note}</p>}
              </li>
            ))}
          </ol>
        </section>

        <section className="rec-section" aria-labelledby={id('work')}>
          <h2 id={id('work')} className="rec-h2">
            {t('rec.selectedWork')}
          </h2>
          <ul className="rec-list rec-list--work" role="list">
            {work.map(({ key, study, section, link }) => (
              <li key={key} className="rec-item">
                <div className="rec-item-head">
                  <h3 className="rec-h3">{study.name}</h3>
                  <p className="rec-meta">{study.period}</p>
                </div>
                <p className="rec-role">{study.role}</p>
                {(section || link) && (
                  <p className="rec-body">
                    {section?.body}
                    {link && (
                      <>
                        {section ? ' ' : null}
                        <ExternalLink href={link.href}>{link.text}</ExternalLink>
                      </>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="rec-cols">
          <section className="rec-section" aria-labelledby={id('skills')}>
            <h2 id={id('skills')} className="rec-h2">
              {t('section.skills')}
            </h2>
            <dl className="rec-skills">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <dt>{group.label}</dt>
                  <dd>{group.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div>
            {education.length > 0 && (
              <section className="rec-section" aria-labelledby={id('edu')}>
                <h2 id={id('edu')} className="rec-h2">
                  {t('about.education')}
                </h2>
                <ul className="rec-bullets" role="list">
                  {education.map((e, i) => (
                    <li key={i}>
                      {e.title} · {e.school} · {e.period}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {certifications.length > 0 && (
              <section className="rec-section" aria-labelledby={id('certs')}>
                <h2 id={id('certs')} className="rec-h2">
                  {t('rec.certifications')}
                </h2>
                <ul className="rec-bullets" role="list">
                  {certifications.map((cert) => (
                    <li key={cert}>{cert}</li>
                  ))}
                </ul>
              </section>
            )}
            {languages && languages.items.length > 0 && (
              <section className="rec-section" aria-labelledby={id('langs')}>
                <h2 id={id('langs')} className="rec-h2">
                  {languages.label}
                </h2>
                <p className="rec-plain">{languages.items.join(', ')}</p>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
