'use client';

import { useState, useEffect } from 'react';
import { content } from '@/lib/content';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CASE_STUDIES = [
  content.nsity,
  content.xpo,
  content.sky,
  content.gasco,
  content.entel,
] as const;

const SKILL_LABELS: Record<string, string> = {
  ai_tools: 'AI Tools',
  design: 'Design',
  systems: 'Systems',
  research: 'Research',
  productivity: 'Productivity',
};

const _bioLines = content.bio.split('\n');
const _certIdx = _bioLines.findIndex(l => l.trim().startsWith('Certified:'));
const CERTS = _certIdx >= 0
  ? _bioLines.slice(_certIdx + 1).map(l => l.trim()).filter(l => l && !l.startsWith('Open'))
  : [];

const _bioPara = content.bio.split('\n\n').find(p => p.includes('years shipping')) ?? '';

// ─── Styles ───────────────────────────────────────────────────────────────────

const TEAL = '#00807F';
const MS = 'MS Sans Serif, Arial, sans-serif';

const pill: React.CSSProperties = {
  display: 'inline-block',
  background: '#f0f0f0',
  color: '#444',
  borderRadius: 99,
  padding: '3px 10px',
  fontSize: 12,
  fontFamily: MS,
};

const win98Btn: React.CSSProperties = {
  display: 'inline-block',
  padding: '6px 16px',
  background: '#C0C0C0',
  border: '2px solid',
  borderColor: '#ffffff #808080 #808080 #ffffff',
  fontFamily: MS,
  fontSize: 13,
  color: '#000000',
  cursor: 'pointer',
  textDecoration: 'none',
  borderRadius: 0,
};

const win98BtnSmall: React.CSSProperties = {
  ...win98Btn,
  padding: '4px 10px',
};

const titleBar: React.CSSProperties = {
  background: 'linear-gradient(to right, #000080, #1084D0)',
  color: '#ffffff',
  padding: '4px 10px',
  fontSize: 13,
  fontWeight: 'bold',
  fontFamily: MS,
  marginBottom: 16,
};

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  images, index, onClose, onNext, onPrev,
}: {
  images: readonly string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 16 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[index]} alt={`Image ${index + 1}`} onClick={e => e.stopPropagation()} style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }} />
      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {images.length > 1 && <button onClick={onPrev} style={{ ...win98Btn, fontSize: 18, padding: '4px 14px' }}>‹</button>}
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: MS }}>
          {index + 1} / {images.length} · tap outside to close
        </span>
        {images.length > 1 && <button onClick={onNext} style={{ ...win98Btn, fontSize: 18, padding: '4px 14px' }}>›</button>}
      </div>
    </div>
  );
}

// ─── MobileSite ───────────────────────────────────────────────────────────────

export default function MobileSite() {
  const [lightbox, setLightbox] = useState<{ images: readonly string[]; index: number } | null>(null);

  useEffect(() => { document.title = 'Andres Glez — AI × UX'; }, []);

  const openLightbox = (images: readonly string[]) => setLightbox({ images, index: 0 });
  const closeLightbox = () => setLightbox(null);
  const nextImage = () => setLightbox(l => l ? { ...l, index: (l.index + 1) % l.images.length } : null);
  const prevImage = () => setLightbox(l => l ? { ...l, index: (l.index - 1 + l.images.length) % l.images.length } : null);

  const skills = content.skills as Record<string, string[] | Record<string, string>>;

  return (
    <div style={{ fontFamily: MS, cursor: 'default', background: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, height: 48, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#ffffff', fontFamily: MS }}>atgc.design</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Work', 'About', 'Contact'].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} style={win98BtnSmall}>{label}</a>
          ))}
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ background: TEAL, padding: '48px 24px 52px', textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon.png" alt="Andres T. Gonzalez C." style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 20, border: '3px solid rgba(255,255,255,0.4)', imageRendering: 'pixelated' }} />
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8, fontFamily: MS, lineHeight: 1.2 }}>
          Andres T. Gonzalez C.
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 6, fontFamily: MS }}>
          UX Product Designer · AI × UX
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 16, fontFamily: MS }}>
          Senior UX Technical Consultant @ Perficient
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: MS }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
          Open to remote · Santiago, Chile
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#work" style={win98Btn}>View Work ↓</a>
          <a href="/resume.pdf" download style={win98Btn}>💾 Download CV</a>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────── */}
      <section id="about" style={{ background: '#fff', padding: '32px 24px' }}>
        <div style={titleBar}>About</div>
        <p style={{ fontSize: 14, color: '#333', lineHeight: 1.65, marginBottom: 20, fontFamily: MS }}>
          {_bioPara.trim()}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Enterprise', 'Aviation', 'Energy', 'Telecom', 'Automotive', 'Oil & Gas', 'Healthcare'].map(tag => (
            <span key={tag} style={pill}>{tag}</span>
          ))}
        </div>
      </section>

      {/* ── Work ────────────────────────────────────────────────────────── */}
      <section id="work" style={{ background: '#f5f5f5', padding: '32px 24px' }}>
        <div style={titleBar}>Work</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CASE_STUDIES.map((study) => (
            <div key={study.title} style={{ background: '#fff', padding: '16px 16px 16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderLeft: `4px solid ${study.color}` }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#000', marginBottom: 4, fontFamily: MS }}>{study.title}</div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 12, fontFamily: MS }}>{study.role}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {study.tags.map(tag => (
                  <span key={tag} style={{ ...pill, fontSize: 11 }}>{tag}</span>
                ))}
              </div>
              {study.images && study.images.length > 0 && (
                <button onClick={() => openLightbox(study.images!)} style={win98Btn}>
                  View Project →
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '32px 24px' }}>
        <div style={titleBar}>Skills</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(SKILL_LABELS).map(([key, label]) => {
            const items = skills[key];
            if (!items || !Array.isArray(items)) return null;
            return (
              <div key={key}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#808080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontFamily: MS }}>{label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(items as string[]).map(item => <span key={item} style={pill}>{item}</span>)}
                </div>
              </div>
            );
          })}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#808080', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontFamily: MS }}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(content.skills.languages).map(([lang, level]) => (
                <span key={lang} style={pill}>{lang} ({level})</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Certifications ──────────────────────────────────────────────── */}
      <section style={{ background: '#f5f5f5', padding: '32px 24px' }}>
        <div style={titleBar}>Certifications</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CERTS.map(cert => (
            <div key={cert} style={{ fontSize: 13, color: '#333', lineHeight: 1.5, fontFamily: MS }}>{cert}</div>
          ))}
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────── */}
      <section id="contact" style={{ background: TEAL, padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ ...titleBar, marginBottom: 12, display: 'inline-block', padding: '4px 20px' }}>Let&apos;s talk</div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 28, fontFamily: MS }}>Open to remote opportunities from Santiago, Chile</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 40 }}>
          <a href="mailto:andres.t.glez.c@gmail.com" style={{ ...win98Btn, width: 220, textAlign: 'center', display: 'block' }}>Email Me ✉</a>
          <a href="https://linkedin.com/in/andres-gonzalez-ux" target="_blank" rel="noreferrer" style={{ ...win98Btn, width: 220, textAlign: 'center', display: 'block' }}>LinkedIn →</a>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontFamily: MS }}>© 2026 Andres T. Gonzalez C.</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontFamily: MS }}>For the full experience, visit on desktop 🖥️</p>
      </section>

      {lightbox && (
        <Lightbox images={lightbox.images} index={lightbox.index} onClose={closeLightbox} onNext={nextImage} onPrev={prevImage} />
      )}
    </div>
  );
}
