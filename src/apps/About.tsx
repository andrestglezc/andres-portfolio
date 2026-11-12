'use client';

import Icon from '@/os/Icon';
import { useOS } from '@/os/store';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

export function AboutSections() {
  const t = useT();
  const { profile, skills, experience, services, certifications, education, faqs } = useContent();
  return (
    <>
      <section className="block">
        <h3 className="eyebrow">{t('about.specialize')}</h3>
        <ul className="chips chips--lg">
          {profile.specialties.map((s) => (
            <li key={s} className="chip">{s}</li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h3 className="eyebrow">{t('about.services')}</h3>
        <ul className="tiles">
          {services.map((s) => (
            <li key={s.title} className="tile">
              <strong>{s.title}</strong>
              <span>{s.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h3 className="eyebrow">{t('section.experience')}</h3>
        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.company}>
              <div className="timeline-head">
                <strong>{e.company}</strong>
                <span>{e.period}</span>
              </div>
              {e.roles.map((r) => (
                <p key={r}>{r}</p>
              ))}
              {e.note && <p className="muted">{e.note}</p>}
            </li>
          ))}
        </ol>
      </section>

      <section className="block">
        <h3 className="eyebrow">{t('section.skills')}</h3>
        <dl className="skills">
          {skills.map((g) => (
            <div key={g.label}>
              <dt>{g.label}</dt>
              <dd>
                <ul className="chips">
                  {g.items.map((i) => (
                    <li key={i} className="chip">{i}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="block">
        <h3 className="eyebrow">{t('about.education')}</h3>
        <ol className="timeline">
          {education.map((e, i) => (
            <li key={i}>
              <div className="timeline-head">
                <strong>{e.title}</strong>
                <span>{e.period}</span>
              </div>
              <p>{e.school}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="block">
        <h3 className="eyebrow">{t('about.certified')}</h3>
        <ul className="plain-list">
          {certifications.map((c) => (
            <li key={c}>
              <Icon name="check" size={16} /> {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h3 className="eyebrow">{t('about.faq')}</h3>
        <div className="faq">
          {/* Keyed by position, so an open answer stays open when the language changes. */}
          {faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export default function About() {
  const open = useOS((s) => s.open);
  const t = useT();
  const { profile } = useContent();
  return (
    <div className="about">
      <aside className="about-side">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="about-photo" src={profile.photo} alt={profile.name} width={360} height={360} />
        <p className="status">
          <span className="dot" /> {profile.availability}
        </p>
        <dl className="facts">
          <div><dt>{t('about.now')}</dt><dd>{profile.currentRole}</dd></div>
          <div><dt>{t('about.also')}</dt><dd>{profile.alsoRole}</dd></div>
          <div><dt>{t('about.route')}</dt><dd>{profile.origin}</dd></div>
          <div><dt>{t('about.industries')}</dt><dd>{profile.industries.join(' · ')}</dd></div>
          <div><dt>{t('about.offScreen')}</dt><dd>{profile.personal}</dd></div>
        </dl>
        <div className="about-actions">
          <button type="button" className="btn btn--ink" onClick={() => open('contact')}>
            <Icon name="mail" size={16} /> {t('common.contactMe')}
          </button>
          <button type="button" className="btn" onClick={() => open('resume')}>
            <Icon name="doc" size={16} /> {t('common.resume')}
          </button>
        </div>
      </aside>
      <div className="about-main app-scroll">
        <p className="eyebrow">{t('about.years', { title: profile.title, years: profile.years })}</p>
        <h2 className="display">{profile.name}</h2>
        <p className="serif-lead">{profile.intro}</p>
        <AboutSections />
        <section className="cta">
          <h3 className="display display--sm">{t('about.together')}</h3>
          <p>{profile.seeking}</p>
          <button type="button" className="btn btn--accent" onClick={() => open('contact')}>
            {t('about.getInTouch')} <Icon name="arrowRight" size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}
