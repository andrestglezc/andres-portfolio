"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useWindowStore, WindowConfig, AppType, WindowId } from "@/lib/windows";
import DoomApp from "@/components/apps/DoomApp";
import AoeApp from "@/components/apps/AoeApp";
import SimsApp from "@/components/apps/SimsApp";
import MusicApp from "@/components/apps/MusicApp";
import ShrineApp from "@/components/apps/ShrineApp";
import { useMusicStore } from "@/lib/musicStore";
import { content, CaseStudyKey } from "@/lib/content";
import { filesystem, FolderNode, FSNode, FileNode } from "@/lib/filesystem";

// ─── Win98 beveled styles ─────────────────────────────────────────────────────

const bevelUp: React.CSSProperties = {
  borderTop: "2px solid #FFFFFF",
  borderLeft: "2px solid #FFFFFF",
  borderRight: "2px solid #808080",
  borderBottom: "2px solid #808080",
};

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string) {
  const [count, setCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDone = count >= text.length;

  useEffect(() => {
    if (!text.length) return;
    timerRef.current = setInterval(() => {
      setCount((c) => {
        const next = c + 1;
        if (next >= text.length) clearInterval(timerRef.current!);
        return next;
      });
    }, 18);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    if (!isDone) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCount(text.length);
    }
  };

  return { displayed: text.slice(0, count), skip, isDone };
}

// ─── App sub-components ───────────────────────────────────────────────────────

function TextApp({ text }: { text: string }) {
  const { displayed, skip } = useTypewriter(text);
  return (
    <div
      className="window-content h-full overflow-auto p-3"
      onClick={skip}
      style={{ background: "#FFFFFF", paddingLeft: 20, paddingTop: 20 }}
    >
      <pre className="typewriter">{displayed}</pre>
    </div>
  );
}

function JsonApp({ data }: { data: unknown }) {
  return (
    <div className="window-content h-full overflow-auto p-3" style={{ background: "#FFFFFF", paddingLeft: 20, paddingTop: 20 }}>
      <pre
        className="typewriter"
        style={{ color: "#000080", fontSize: 14, lineHeight: 1.7 }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

function CaseStudyApp({ studyKey }: { studyKey: CaseStudyKey }) {
  const study = content[studyKey] as typeof content[typeof studyKey] & { images?: string[] };
  console.log('[CaseStudyApp]', studyKey, study, study.images);
  const { closeWindow, focusWindow, openWindow, windows } = useWindowStore();
  const [showScrollHint, setShowScrollHint] = useState(true);
  const rightColRef = useRef<HTMLDivElement>(null);

  const goBack = () => {
    closeWindow(`casestudy-${studyKey}`);
    const homeOpen = windows.find(w => w.id === 'home');
    if (homeOpen) {
      focusWindow('home');
    } else {
      openWindow({
        id: 'home',
        app: 'home',
        title: 'Hello World!',
        props: {},
        x: Math.round((window.innerWidth - 1188) / 2),
        y: Math.round((window.innerHeight - 670) / 2),
        width: 1188,
        height: 670,
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        background: '#FFFFFF',
        fontFamily: 'inherit',
      }}
    >
      {/* Left column — metadata + sections */}
      <div
        className="window-content"
        style={{
          width: 320,
          flexShrink: 0,
          overflowY: 'auto',
          borderRight: '1px solid #C0C0C0',
          padding: '20px 18px 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Date */}
        <div style={{ fontSize: 11, color: '#808080', marginBottom: 8, letterSpacing: '0.04em' }}>
          {study.period}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#000000',
            lineHeight: 1.25,
            marginBottom: 6,
          }}
        >
          {study.title}
        </h2>

        {/* Role */}
        <div style={{ fontSize: 13, color: '#444444', marginBottom: 20 }}>
          {study.role}
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {study.sections.map((section) => (
            <div key={section.heading}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: '#808080',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 5,
                }}
              >
                {section.heading}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: '#222222',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Go back button */}
        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <button
            onClick={goBack}
            style={{
              background: '#C0C0C0',
              borderTop: '2px solid #FFFFFF',
              borderLeft: '2px solid #FFFFFF',
              borderRight: '2px solid #808080',
              borderBottom: '2px solid #808080',
              padding: '4px 14px',
              fontSize: 13,
              fontFamily: 'inherit',
              color: '#000000',
              cursor: 'default',
            }}
          >
            ← Go back
          </button>
        </div>
      </div>

      {/* Right column — preview */}
      <div
        ref={rightColRef}
        className="window-content"
        onScroll={(e) => {
          if ((e.currentTarget as HTMLDivElement).scrollTop > 20) setShowScrollHint(false);
        }}
        style={{
          flex: 1,
          position: 'relative',
          background: '#1a1a1a',
          overflowY: study.images && study.images.length > 0 ? 'auto' : 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: study.images && study.images.length > 0 ? 'flex-start' : 'center',
        }}
      >
        {study.images && study.images.length > 0 ? (
          study.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${study.title} preview ${i + 1}`}
              style={{ width: '100%', objectFit: 'contain', display: 'block', background: '#1a1a1a' }}
            />
          ))
        ) : (
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', userSelect: 'none' }}>
            Project preview
          </span>
        )}

        {/* Scroll hint — only shown when there are images and user hasn't scrolled */}
        {study.images && study.images.length > 0 && (
          <div
            style={{
              position: 'sticky',
              bottom: 12,
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: '#C0C0C0',
              borderTop: '2px solid #FFFFFF',
              borderLeft: '2px solid #FFFFFF',
              borderRight: '2px solid #808080',
              borderBottom: '2px solid #808080',
              padding: '5px 10px 4px',
              opacity: showScrollHint ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
              animation: 'bounce 1.5s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: 14, color: '#000000', lineHeight: 1 }}>↓</span>
            <span style={{ fontSize: 11, color: '#444444', whiteSpace: 'nowrap' }}>Scroll to explore</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SmallIcon({ type }: { type: "folder" | "file" | "pdf" | "app" }) {
  const colors: Record<string, string> = {
    folder: "#FFCC00",
    file: "#FFFFFF",
    pdf: "#FFFFFF",
    app: "#C0C0FF",
  };
  const bg = colors[type] ?? "#FFFFFF";
  return (
    <div
      style={{
        width: 16,
        height: 16,
        flexShrink: 0,
        position: "relative",
        display: "inline-flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {type === "folder" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" style={{ display: "block" }}>
          <rect x="0" y="4" width="4" height="2" fill="#FFCC00" />
          <rect x="0" y="5" width="16" height="10" fill="#FFCC00" />
          <rect x="0" y="5" width="1" height="10" fill="#808000" />
          <rect x="0" y="14" width="16" height="1" fill="#808000" />
          <rect x="15" y="5" width="1" height="10" fill="#808000" />
          <rect x="0" y="5" width="16" height="1" fill="#808000" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" style={{ display: "block" }}>
          <rect x="2" y="1" width="10" height="14" fill={bg} />
          <rect x="2" y="1" width="10" height="1" fill="#000000" />
          <rect x="2" y="1" width="1" height="14" fill="#000000" />
          <rect x="11" y="1" width="1" height="14" fill="#000000" />
          <rect x="2" y="14" width="10" height="1" fill="#000000" />
          {type === "pdf" && <rect x="8" y="1" width="4" height="4" fill="#CC0000" />}
          <rect x="4" y="5" width="6" height="1" fill="#808080" />
          <rect x="4" y="7" width="6" height="1" fill="#808080" />
          <rect x="4" y="9" width="5" height="1" fill="#808080" />
        </svg>
      )}
    </div>
  );
}

function FinderApp({
  folder,
  onOpen,
}: {
  folder: FolderNode;
  onOpen: (node: FSNode) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className="window-content h-full overflow-auto"
      style={{ background: "#FFFFFF" }}
    >
      <div>
        {folder.children.map((node, i) => {
          const isSelected = selected === node.name;
          const iconType =
            node.type === "folder"
              ? "folder"
              : (node as FileNode).fileType === "pdf"
              ? "pdf"
              : (node as FileNode).fileType === "app"
              ? "app"
              : "file";
          return (
            <div
              key={node.name}
              className={`finder-row flex items-center gap-2 px-2 py-1${isSelected ? " selected" : ""}`}
              style={{
                background: isSelected
                  ? "#000080"
                  : i % 2 === 0
                  ? "#FFFFFF"
                  : "#F0F0F0",
                color: isSelected ? "#FFFFFF" : "#000000",
                borderBottom: "1px solid #E0E0E0",
              }}
              onClick={() => setSelected(node.name)}
              onDoubleClick={() => onOpen(node)}
            >
              <SmallIcon type={iconType} />
              <span
                style={{
                  fontSize: 14,
                  fontFamily: 'inherit',
                  color: isSelected ? "#FFFFFF" : "#000000",
                }}
              >
                {node.name}
              </span>
              {node.type === "folder" && (
                <span
                  className="ml-auto"
                  style={{
                    fontSize: 16,
                    fontFamily: 'inherit',
                    color: isSelected ? "#CCCCCC" : "#808080",
                  }}
                >
                  {node.children.length} items
                </span>
              )}
              {node.type === "file" && (
                <span
                  className="ml-auto"
                  style={{
                    fontSize: 16,
                    fontFamily: 'inherit',
                    color: isSelected ? "#CCCCCC" : "#808080",
                  }}
                >
                  {(node as FileNode).fileType.toUpperCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: "2px 4px",
          borderTop: "1px solid #808080",
          fontSize: 14,
          fontFamily: 'inherit',
          color: "#000000",
          background: "#C0C0C0",
        }}
      >
        {folder.children.length} object{folder.children.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

function AboutApp() {
  const bio = content.bio;
  const { displayed, skip } = useTypewriter(bio);
  const { ai_tools, design, systems, research, productivity, languages } =
    content.skills;
  return (
    <div
      className="window-content h-full overflow-auto p-3"
      onClick={skip}
      style={{ background: "#FFFFFF", paddingLeft: 20, paddingTop: 20 }}
    >
      <pre className="typewriter" style={{ marginBottom: 12 }}>
        {displayed}
      </pre>
      <div
        style={{
          borderTop: "1px solid #C0C0C0",
          paddingTop: 10,
          fontFamily: 'inherit',
          fontSize: 14,
          color: "#000000",
        }}
      >
        <div
          style={{ color: "#000080", fontWeight: "bold", marginBottom: 6 }}
        >
          SKILLS
        </div>
        {[
          ["AI Tools", ai_tools],
          ["Design", design],
          ["Systems", systems],
          ["Research", research],
          ["Productivity", productivity],
        ].map(([label, items]) => (
          <div key={label as string} style={{ marginBottom: 4 }}>
            <span style={{ color: "#808080" }}>{label as string}: </span>
            <span>{(items as string[]).join(" · ")}</span>
          </div>
        ))}
        <div style={{ marginTop: 4 }}>
          <span style={{ color: "#808080" }}>Languages: </span>
          {Object.entries(languages)
            .map(([lang, level]) => `${lang} (${level})`)
            .join(" · ")}
        </div>
      </div>
    </div>
  );
}

function ContactApp() {
  const { displayed, skip } = useTypewriter(content.contact);

  const links: Record<string, { href: string }> = {
    'andres.t.glez.c@gmail.com':       { href: 'mailto:andres.t.glez.c@gmail.com' },
    'linkedin.com/in/andres-gonzalez-ux': { href: 'https://linkedin.com/in/andres-gonzalez-ux' },
  };

  const renderWithLinks = (text: string) => {
    const pattern = new RegExp(`(${Object.keys(links).map(k => k.replace(/\./g, '\\.')).join('|')})`, 'g');
    const parts = text.split(pattern);
    return parts.map((part, i) =>
      links[part]
        ? <a key={i} href={links[part].href} target="_blank" rel="noreferrer" style={{ color: '#0000EE', textDecoration: 'underline' }} onClick={e => e.stopPropagation()}>{part}</a>
        : part
    );
  };

  return (
    <div
      className="window-content h-full overflow-auto p-3"
      onClick={skip}
      style={{ background: "#FFFFFF", paddingLeft: 20, paddingTop: 20 }}
    >
      <pre className="typewriter">{renderWithLinks(displayed)}</pre>
    </div>
  );
}

function ResumeApp() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{
        padding: '6px 10px',
        background: '#C0C0C0',
        borderBottom: '2px solid #808080',
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }}>
        <a
          href="/resume.pdf"
          download="Andres_T_Gonzalez_CV_2026.pdf"
          style={{
            width: 140,
            height: 28,
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: '#C0C0C0',
            border: '2px solid',
            borderColor: '#fff #808080 #808080 #fff',
            fontSize: 13,
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#000',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
          }}
        >
          💾 Download CV
        </a>
        <a
          href="mailto:andres.t.glez.c@gmail.com?subject=Hi Andres — I reviewed your CV&body=Hi Andres,"
          style={{
            width: 140,
            height: 28,
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: '#C0C0C0',
            border: '2px solid',
            borderColor: '#fff #808080 #808080 #fff',
            fontSize: 13,
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#000',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
          }}
        >
          ✉️ Email Me
        </a>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#444' }}>
          Andres T. Gonzalez C. — CV 2026
        </span>
      </div>
      <iframe
        src="/resume.pdf"
        style={{ flex: 1, width: '100%', border: 'none' }}
        title="Resume PDF"
      />
    </div>
  );
}

// ─── SysInfo app ─────────────────────────────────────────────────────────────

function SysInfoApp() {
  const [activeTab, setActiveTab] = useState('General');
  const tabs = ['General'];
  const btn98: React.CSSProperties = {
    padding: '2px 10px',
    background: '#C0C0C0',
    border: '2px solid',
    borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
    fontSize: 12,
    cursor: 'default',
    fontFamily: 'MS Sans Serif, Arial, sans-serif',
  };
  return (
    <div style={{ background: '#C0C0C0', height: '100%', display: 'flex', flexDirection: 'column', padding: 8, fontFamily: 'MS Sans Serif, Arial, sans-serif', fontSize: 12 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: -2, position: 'relative', zIndex: 1 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...btn98,
              borderBottom: activeTab === tab ? '2px solid #C0C0C0' : '2px solid #808080',
              background: activeTab === tab ? '#C0C0C0' : '#B0B0B0',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              zIndex: activeTab === tab ? 1 : 0,
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab body */}
      <div style={{ flex: 1, border: '2px solid', borderColor: '#808080 #FFFFFF #FFFFFF #808080', background: '#C0C0C0', padding: 12, overflow: 'auto' }}>
        {activeTab === 'General' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ textAlign: 'center', fontSize: 40, margin: '4px 0 8px' }}>🖥️</div>
            <div style={{ borderBottom: '1px solid #808080', paddingBottom: 6, marginBottom: 2 }}>
              <div style={{ color: '#000080', fontWeight: 'bold', marginBottom: 2 }}>Registered User</div>
              <div>Andres T. Gonzalez C.</div>
            </div>
            <div style={{ borderBottom: '1px solid #808080', paddingBottom: 6, marginBottom: 2 }}>
              <div style={{ color: '#000080', fontWeight: 'bold', marginBottom: 2 }}>Organization</div>
              <div>atgc.design</div>
            </div>
            {[
              ['System',    'Nostalgia OS v1.0'],
              ['Processor', 'Nost1 Max'],
              ['Memory',    'Unlimited ideas'],
              ['Status',    'Open to Work ✅'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontWeight: 'bold', minWidth: 80 }}>{k}:</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>This tab is not available.</div>
        )}
      </div>
    </div>
  );
}

// ─── Find app ─────────────────────────────────────────────────────────────────

const FINDABLE = [
  { label: 'Nsity Case Study',  id: 'casestudy-nsity',  app: 'casestudy' as AppType, props: { contentKey: 'nsity' },  title: 'Nsity Case Study',  width: 780, height: 540 },
  { label: 'XPO Design System', id: 'casestudy-xpo',   app: 'casestudy' as AppType, props: { contentKey: 'xpo' },   title: 'XPO Design System', width: 780, height: 540 },
  { label: 'SKY Airline',       id: 'casestudy-sky',   app: 'casestudy' as AppType, props: { contentKey: 'sky' },   title: 'SKY Airline',       width: 780, height: 540 },
  { label: 'GASCO',             id: 'casestudy-gasco', app: 'casestudy' as AppType, props: { contentKey: 'gasco' }, title: 'GASCO',             width: 780, height: 540 },
  { label: 'Resume',            id: 'resume',          app: 'resume'    as AppType, props: {},                       title: 'Resume.pdf',        width: 780, height: 680 },
  { label: 'About Me',          id: 'about',           app: 'about'     as AppType, props: {},                       title: 'About Me',          width: 480, height: 400 },
  { label: 'Contact',           id: 'contact',         app: 'contact'   as AppType, props: {},                       title: 'Contact.txt',       width: 420, height: 340 },
];

function FindApp() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof FINDABLE | null>(null);
  const { openWindow, windows, focusWindow } = useWindowStore();

  const inset: React.CSSProperties = {
    border: '2px solid', borderColor: '#808080 #FFFFFF #FFFFFF #808080',
    background: '#FFFFFF', padding: '0 4px',
    fontSize: 12, fontFamily: 'MS Sans Serif, Arial, sans-serif',
  };
  const btn98: React.CSSProperties = {
    background: '#C0C0C0', border: '2px solid',
    borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
    fontSize: 12, cursor: 'default', fontFamily: 'MS Sans Serif, Arial, sans-serif',
    padding: '2px 10px',
  };

  const doSearch = () => {
    const q = query.trim().toLowerCase();
    setResults(q ? FINDABLE.filter(i => i.label.toLowerCase().includes(q)) : [...FINDABLE]);
  };

  const openResult = (item: typeof FINDABLE[0]) => {
    const win = windows.find(w => w.id === item.id);
    if (win) { focusWindow(item.id); return; }
    openWindow({ id: item.id, app: item.app, title: item.title, props: item.props, x: 120, y: 80, width: item.width, height: item.height });
  };

  return (
    <div style={{ background: '#C0C0C0', height: '100%', display: 'flex', flexDirection: 'column', padding: 10, gap: 8, fontFamily: 'MS Sans Serif, Arial, sans-serif', fontSize: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label>Named:</label>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
          style={{ ...inset, flex: 1, height: 22 }}
          placeholder="Search..."
        />
        <button onClick={doSearch} style={btn98}>Find Now</button>
      </div>

      {results !== null && (
        <>
          <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #FFFFFF' }} />
          <div style={{ fontSize: 11, color: '#555' }}>{results.length} item{results.length !== 1 ? 's' : ''} found. Double-click to open.</div>
          <div style={{ flex: 1, border: '2px solid', borderColor: '#808080 #FFFFFF #FFFFFF #808080', background: '#FFFFFF', overflow: 'auto' }}>
            {results.length === 0 && <div style={{ padding: 8, color: '#666' }}>No items found.</div>}
            {results.map(item => (
              <div
                key={item.id}
                onDoubleClick={() => openResult(item)}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#000080'; (e.currentTarget as HTMLDivElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = ''; (e.currentTarget as HTMLDivElement).style.color = ''; }}
                style={{ padding: '3px 8px', cursor: 'default', borderBottom: '1px solid #E8E8E8', fontSize: 12 }}
              >
                📄 {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Run app ──────────────────────────────────────────────────────────────────

function RunApp() {
  const [cmd, setCmd] = useState('');
  const [error, setError] = useState('');
  const { openWindow, windows, focusWindow } = useWindowStore();

  const workFolder = filesystem.children.find(n => n.type === 'folder' && n.name === 'Work') as FolderNode | undefined;

  const activate = (id: string, open: () => void) => {
    const win = windows.find(w => w.id === id);
    if (win) focusWindow(id); else open();
  };

  const run = () => {
    const c = cmd.trim().toLowerCase();
    const map: Record<string, () => void> = {
      work:      () => activate('finder-Work', () => workFolder && openWindow({ id: 'finder-Work', app: 'finder', title: 'Work', props: { folder: workFolder }, x: 120, y: 80, width: 520, height: 380 })),
      portfolio: () => activate('finder-Work', () => workFolder && openWindow({ id: 'finder-Work', app: 'finder', title: 'Work', props: { folder: workFolder }, x: 120, y: 80, width: 520, height: 380 })),
      resume:    () => activate('resume',  () => openWindow({ id: 'resume',  app: 'resume',  title: 'Resume.pdf',  props: {}, x: 120, y: 80, width: 780, height: 680 })),
      cv:        () => activate('resume',  () => openWindow({ id: 'resume',  app: 'resume',  title: 'Resume.pdf',  props: {}, x: 120, y: 80, width: 780, height: 680 })),
      contact:   () => activate('contact', () => openWindow({ id: 'contact', app: 'contact', title: 'Contact.txt', props: {}, x: 120, y: 80, width: 420, height: 340 })),
      mail:      () => activate('contact', () => openWindow({ id: 'contact', app: 'contact', title: 'Contact.txt', props: {}, x: 120, y: 80, width: 420, height: 340 })),
      about:     () => activate('about',   () => openWindow({ id: 'about',   app: 'about',   title: 'About Me',    props: {}, x: 120, y: 80, width: 480, height: 400 })),
      bio:       () => activate('about',   () => openWindow({ id: 'about',   app: 'about',   title: 'About Me',    props: {}, x: 120, y: 80, width: 480, height: 400 })),
      doom:      () => activate('doom',    () => openWindow({ id: 'doom',    app: 'doom',    title: 'DOOM.exe',    props: {}, x: 120, y: 80, width: 680, height: 680 })),
      help:      () => activate('help',    () => openWindow({ id: 'help',    app: 'help',    title: 'Windows Help', props: {}, x: 120, y: 80, width: 480, height: 400 })),
    };
    if (map[c]) { map[c](); setError(''); }
    else setError('Command not found. Try: work, resume, contact, about, doom');
  };

  const btn98: React.CSSProperties = {
    width: 75, height: 24, background: '#C0C0C0',
    border: '2px solid', borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
    fontSize: 12, cursor: 'default', fontFamily: 'MS Sans Serif, Arial, sans-serif',
  };

  return (
    <div style={{ background: '#C0C0C0', position: 'relative', minHeight: 320, height: '100%', padding: '16px 24px 0 24px', fontFamily: 'MS Sans Serif, Arial, sans-serif', fontSize: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ fontSize: 36, lineHeight: 1 }}>🏃</div>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>Type the name of a program, folder, or document, and Nostalgia OS will open it for you.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ flexShrink: 0 }}>Open:</label>
            <input
              autoFocus
              value={cmd}
              onChange={e => setCmd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              style={{ flex: 1, height: 22, border: '2px solid', borderColor: '#808080 #FFFFFF #FFFFFF #808080', background: '#FFFFFF', padding: '0 4px', fontSize: 12, fontFamily: 'inherit' }}
            />
          </div>
          {error && <div style={{ marginTop: 4, color: '#CC0000', fontSize: 11 }}>{error}</div>}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 16, left: 24, right: 24, display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
        <button onClick={run} style={btn98}>OK</button>
        <button style={btn98}>Cancel</button>
        <button style={btn98}>Browse...</button>
      </div>
    </div>
  );
}

// ─── Help app ─────────────────────────────────────────────────────────────────

const HELP_TEXT = `Nostalgia OS Help
=================
Having trouble finding what you need?

Try double-clicking any desktop icon.
Or use the taskbar buttons below.

Still lost? Just reach out:
andres.t.glez.c@gmail.com
linkedin.com/in/andres-gonzalez-ux

Have you tried turning it off
and on again?

— Andres T. Gonzalez C.`;

function HelpApp() {
  const { displayed, skip } = useTypewriter(HELP_TEXT);
  return (
    <div className="window-content h-full overflow-auto p-3" onClick={skip} style={{ background: '#FFFFFF', paddingLeft: 20, paddingTop: 20 }}>
      <pre className="typewriter" style={{ fontFamily: 'Courier New, monospace', fontSize: 13, lineHeight: 1.6 }}>{displayed}</pre>
    </div>
  );
}

// ─── Shutdown app ─────────────────────────────────────────────────────────────

// ─── Screensaver ──────────────────────────────────────────────────────────────

const SS_COLORS = ['#FFFFFF', '#00FFFF', '#FFFF00', '#FF00FF'];

function Screensaver({ onDismiss }: { onDismiss: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  // Dismiss on any key or click
  useEffect(() => {
    const handler = () => onDismiss();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onDismiss]);

  // Bouncing animation — mutates DOM directly for 60fps without re-renders
  useEffect(() => {
    let x = 80, y = 80;
    let vx = 1.6, vy = 1.3;
    let colorIdx = 0;
    let raf: number;

    const tick = () => {
      const el = containerRef.current;
      if (!el) { raf = requestAnimationFrame(tick); return; }

      const w = el.offsetWidth || 160;
      const h = el.offsetHeight || 70;
      const maxX = window.innerWidth - w;
      const maxY = window.innerHeight - h;

      x += vx;
      y += vy;

      let bounced = false;
      if (x <= 0)    { x = 0;    vx =  Math.abs(vx); bounced = true; }
      if (x >= maxX) { x = maxX; vx = -Math.abs(vx); bounced = true; }
      if (y <= 0)    { y = 0;    vy =  Math.abs(vy); bounced = true; }
      if (y >= maxY) { y = maxY; vy = -Math.abs(vy); bounced = true; }

      if (bounced) {
        colorIdx = (colorIdx + 1) % SS_COLORS.length;
        el.style.color = SS_COLORS[colorIdx];
      }

      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Clock — updates every second via DOM mutation
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    const update = () => { if (clockRef.current) clockRef.current.textContent = fmt(); };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return createPortal(
    <div
      onClick={onDismiss}
      style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 999998, cursor: 'none', overflow: 'hidden' }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          color: '#FFFFFF',
          fontFamily: 'MS Sans Serif, Arial, sans-serif',
          userSelect: 'none',
          willChange: 'transform',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 'bold', whiteSpace: 'nowrap' }}>Nostalgia OS</div>
        <div ref={clockRef} style={{ fontSize: 13, marginTop: 6 }} />
      </div>
    </div>,
    document.body,
  );
}

// ─── Shutdown app ─────────────────────────────────────────────────────────────

function ShutdownApp({ windowId }: { windowId: WindowId }) {
  const [selected, setSelected] = useState<'restart' | 'sleep' | 'shutdown'>('shutdown');
  const [off, setOff] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const { closeWindow } = useWindowStore();

  const btn98: React.CSSProperties = {
    width: 75, height: 24, background: '#C0C0C0',
    border: '2px solid', borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
    fontSize: 12, cursor: 'default', fontFamily: 'MS Sans Serif, Arial, sans-serif',
  };

  const handleOK = async () => {
    const { playShutdownChime, playStartupChime, playSleepChime } = await import('@/lib/audio');
    if (selected === 'shutdown') {
      playShutdownChime();
      setTimeout(() => setOff(true), 600);
    } else if (selected === 'restart') {
      playStartupChime();
      setTimeout(() => window.location.reload(), 1000);
    } else if (selected === 'sleep') {
      playSleepChime();
      setTimeout(() => setSleeping(true), 400);
    }
  };

  return (
    <div style={{ background: '#C0C0C0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 24px 28px 24px', fontFamily: 'MS Sans Serif, Arial, sans-serif', fontSize: 12 }}>

      {/* Shutdown overlay */}
      {off && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 999999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ color: '#FFFFFF', fontSize: 22, fontFamily: 'MS Sans Serif, Arial, sans-serif', textAlign: 'center' }}>
            It is now safe to turn off your computer.
          </div>
          <div style={{ color: '#AAAAAA', fontSize: 13, fontFamily: 'MS Sans Serif, Arial, sans-serif', textAlign: 'center', lineHeight: '1.8' }}>
            Thanks for visiting!<br />
            Have any feedback or want to just say hi?{' '}
            <a
              href="mailto:andres.t.glez.c@gmail.com"
              style={{ color: '#7EB8F7', textDecoration: 'underline', cursor: 'pointer' }}
            >
              andres.t.glez.c@gmail.com
            </a>
          </div>
          <button
            onClick={() => setOff(false)}
            style={{ marginTop: 12, padding: '6px 24px', background: '#C0C0C0', border: '2px solid', borderColor: '#FFFFFF #808080 #808080 #FFFFFF', fontSize: 13, cursor: 'default', fontFamily: 'MS Sans Serif, Arial, sans-serif' }}
          >
            Wake up →
          </button>
        </div>,
        document.body,
      )}

      {/* Sleep screensaver */}
      {sleeping && <Screensaver onDismiss={() => setSleeping(false)} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 36 }}>🪟</div>
        <div style={{ fontSize: 13 }}>What do you want your computer to do?</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8 }}>
        {(['restart', 'sleep', 'shutdown'] as const).map(opt => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
            <input type="radio" name="shutdown-opt" checked={selected === opt} onChange={() => setSelected(opt)} />
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={handleOK} style={btn98}>OK</button>
        <button onClick={() => closeWindow(windowId)} style={btn98}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Home app ─────────────────────────────────────────────────────────────────

const WORK_CARDS = [
  { key: 'nsity'      as CaseStudyKey, company: 'Nsity App',         role: 'UX Product Designer · London',               bg: '#00A876' },
  { key: 'sky'        as CaseStudyKey, company: 'SKY Airline',       role: 'UX Product Designer',                         bg: '#781878' },
  { key: 'xpo'        as CaseStudyKey, company: 'XPO Design System', role: 'Senior UX Technical Consultant · Perficient', bg: '#CC0000' },
  { key: 'gasco'      as CaseStudyKey, company: 'GASCO',             role: 'UX Design Lead',                              bg: '#009EE1' },
  { key: 'entel'      as CaseStudyKey, company: 'Entel',             role: 'UX/UI Designer · Design System Lead',         bg: '#1A0A3D' },
  { key: 'perficient' as CaseStudyKey, company: 'Perficient',        role: 'Senior UX Technical Consultant',              bg: '#1A3D1A' },
];

const SERVICES = [
  { title: 'UX Product Design',   desc: 'End-to-end product design from research to handoff' },
  { title: 'Design Systems',      desc: 'Scalable component libraries and design tokens for product teams' },
  { title: 'UX Consulting',       desc: 'Strategy, audits, and design leadership for your team' },
  { title: 'AI-Augmented Design', desc: 'Modern workflows using Claude, Gemini and prompt engineering for UX' },
];

const TOOLS = [
  { emoji: '🎨', name: 'Figma',             category: 'Design Tool' },
  { emoji: '🗂️', name: 'FigJam',            category: 'Collaboration' },
  { emoji: '🤖', name: 'Claude (Anthropic)', category: 'AI Design' },
  { emoji: '🤖', name: 'Claude Design',      category: 'AI Design Tool' },
];

const FAQS = [
  {
    q: 'What industries have you worked in?',
    a: 'Enterprise logistics, aviation, energy, telco, civic tech, healthcare',
  },
  {
    q: 'Are you open to remote work?',
    a: 'Yes, based in Santiago Chile and open to remote roles globally',
  },
  {
    q: 'What are you looking for?',
    a: 'Senior IC or design lead roles in product-first teams',
  },
];

const statusInset: React.CSSProperties = {
  borderTop: '1px solid #808080',
  borderLeft: '1px solid #808080',
  borderRight: '1px solid #FFFFFF',
  borderBottom: '1px solid #FFFFFF',
  padding: '0 6px',
  height: 20,
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
  fontFamily: 'inherit',
};

function ProfilePhoto() {
  const [failed, setFailed] = useState(false);
  const photoStyle: React.CSSProperties = {
    width: 180,
    height: 180,
    border: '2px solid #808080',
    borderRadius: 4,
    alignSelf: 'flex-start',
    flexShrink: 0,
  };
  if (failed) {
    return (
      <div
        style={{
          ...photoStyle,
          background: '#C0C0C0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#808080',
          fontSize: 14,
        }}
      >
        Photo
      </div>
    );
  }
  return (
    <img
      src="/profile.png"
      alt="Andres T. Gonzalez C."
      onError={() => setFailed(true)}
      style={{ ...photoStyle, objectFit: 'cover', display: 'block' }}
    />
  );
}

function HomeApp() {
  const { openWindow, maximizeWindow, windows } = useWindowStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const mainColRef = useRef<HTMLDivElement>(null);

  const openCaseStudy = (key: CaseStudyKey, idx: number) => {
    const id = `casestudy-${key}`;
    const isNew = !windows.find(w => w.id === id);
    openWindow({
      id,
      app: 'casestudy',
      title: content[key].title,
      props: { contentKey: key },
      x: 180 + idx * 30,
      y: 80 + idx * 30,
      width: 780,
      height: 540,
    });
    if (isNew) maximizeWindow(id);
  };

  return (
    <div
      className="window-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#FFFFFF',
        fontFamily: 'inherit',
        fontSize: 14,
        color: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* Header banner */}
      <div
        style={{
          background: 'linear-gradient(to right, #B8CCDC, #D8E8F0)',
          borderBottom: '1px solid #808080',
          padding: '6px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 'bold', fontSize: 15, color: '#000080' }}>
          UX Product Designer
        </span>
        <span style={{ fontSize: 14, color: '#444444' }}>
          andres.t.glez.c@gmail.com
        </span>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left column */}
        <div
          style={{
            width: 320,
            flexShrink: 0,
            borderRight: '1px solid #C0C0C0',
            padding: 12,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {/* Profile photo */}
          <ProfilePhoto />

          {/* Status */}
          <div style={{ fontWeight: 'bold', color: '#006600', fontSize: 14 }}>
            ● Available for hire
          </div>

          {/* Hometown */}
          <div style={{ fontSize: 13, color: '#444444' }}>
            🏠 Maracaibo, Venezuela → Santiago, Chile
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <a
              href="mailto:andres.t.glez.c@gmail.com"
              style={{ color: '#0000EE', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span>📧</span>andres.t.glez.c@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/andres-gonzalez-ux/"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#0000EE', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span>💼</span>LinkedIn
            </a>
          </div>

          {/* Industries */}
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: 3 }}>🏭 Industries:</div>
            <div style={{ color: '#444444', lineHeight: 1.6, fontSize: 13 }}>
              Enterprise · Aviation · Energy · Telecom · Automotive · Oil &amp; Gas · Healthcare
            </div>
          </div>

          {/* Personal */}
          <div style={{ fontSize: 13, color: '#444444', lineHeight: 1.6 }}>
            ❤️ I love tech, cars, sports, guitars and watches.<br />
            Also have 2 cats that run my life.
          </div>
        </div>

        {/* Main column — scrollable */}
        <div
          ref={mainColRef}
          className="window-content"
          style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}
          onScroll={(e) => {
            if ((e.currentTarget as HTMLDivElement).scrollTop > 20) setShowScrollHint(false);
          }}
        >
          {/* ── Bio ── */}
          <h1
            style={{
              fontSize: 23,
              fontWeight: 'bold',
              color: '#000000',
              fontFamily: 'inherit',
              marginBottom: 4,
            }}
          >
            Andres T. Gonzalez C.
          </h1>
          <p
            style={{
              fontSize: 16,
              color: '#000080',
              fontFamily: 'inherit',
              marginBottom: 10,
            }}
          >
            Senior UX Product Designer · 10+ years
          </p>
          <p
            style={{
              fontSize: 14,
              color: '#222222',
              lineHeight: 1.7,
              fontFamily: 'inherit',
              marginBottom: 16,
              borderBottom: '1px solid #C0C0C0',
              paddingBottom: 12,
            }}
          >
            Crafting intelligent digital experiences at the intersection of AI
            and human interaction. I design products people understand — and now
            I build them smarter, using AI to accelerate research, ideation, and
            delivery. Trusted by Fortune 500 companies across the US,
            Chile&apos;s largest telco, national utilities, and civic tech
            startups.
          </p>

          {/* ── My Work ── */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#000000',
              fontFamily: 'inherit',
              marginBottom: 10,
            }}
          >
            My Work
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 28,
            }}
          >
            {WORK_CARDS.map((card, idx) => (
              <div
                key={card.key}
                style={{
                  background: card.bg,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    fontSize: 20,
                    fontFamily: 'inherit',
                  }}
                >
                  {card.company}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                  }}
                >
                  {card.role}
                </div>
                <button
                  onClick={() => openCaseStudy(card.key, idx)}
                  style={{
                    marginTop: 6,
                    background: '#C0C0C0',
                    borderTop: '2px solid #FFFFFF',
                    borderLeft: '2px solid #FFFFFF',
                    borderRight: '2px solid #808080',
                    borderBottom: '2px solid #808080',
                    padding: '3px 10px',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    color: '#000000',
                    cursor: 'default',
                    alignSelf: 'flex-start',
                  }}
                >
                  See Project
                </button>
              </div>
            ))}
          </div>

          {/* ── Services ── */}
          <div style={{ borderTop: '1px solid #C0C0C0', paddingTop: 16, marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 10 }}>
              Services
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SERVICES.map(s => (
                <div
                  key={s.title}
                  style={{
                    border: '1px solid #C0C0C0',
                    padding: '10px 12px',
                    background: '#F8F8F8',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 3 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#444444', lineHeight: 1.5 }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tools ── */}
          <div style={{ borderTop: '1px solid #C0C0C0', paddingTop: 16, marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 10 }}>
              Tools
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TOOLS.map(t => (
                <div
                  key={t.name}
                  style={{
                    border: '1px solid #C0C0C0',
                    padding: '14px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    background: '#F8F8F8',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{t.emoji}</span>
                  <span style={{ fontWeight: 'bold', fontSize: 14 }}>{t.name}</span>
                  <span style={{ fontSize: 12, color: '#808080' }}>{t.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ borderTop: '1px solid #C0C0C0', paddingTop: 16, marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 10 }}>
              FAQ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ border: '1px solid #C0C0C0' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: openFaq === i ? '#E0E0E0' : '#C0C0C0',
                      borderTop: '1px solid #FFFFFF',
                      borderLeft: '1px solid #FFFFFF',
                      borderRight: '1px solid #808080',
                      borderBottom: openFaq === i ? '1px solid #C0C0C0' : '1px solid #808080',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      cursor: 'default',
                      color: '#000000',
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{faq.q}</span>
                    <span style={{ fontSize: 10, flexShrink: 0, marginLeft: 8 }}>
                      {openFaq === i ? '▲' : '▼'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div
                      style={{
                        padding: '10px 14px',
                        fontSize: 13,
                        color: '#333333',
                        lineHeight: 1.6,
                        background: '#FFFFFF',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Let's work together ── */}
          <div
            style={{
              borderTop: '1px solid #C0C0C0',
              paddingTop: 20,
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#000000' }}>
              Let&apos;s work together
            </div>
            <a
              href="mailto:andres.t.glez.c@gmail.com"
              style={{ fontSize: 16, color: '#0000EE', textDecoration: 'underline', cursor: 'pointer' }}
            >
              andres.t.glez.c@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/andres-gonzalez-ux/"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 14, color: '#0000EE', textDecoration: 'underline', cursor: 'pointer' }}
            >
              linkedin.com/in/andres-gonzalez-ux
            </a>
          </div>

          {/* Scroll hint */}
          <div
            style={{
              position: 'sticky',
              bottom: 12,
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: '#C0C0C0',
              borderTop: '2px solid #FFFFFF',
              borderLeft: '2px solid #FFFFFF',
              borderRight: '2px solid #808080',
              borderBottom: '2px solid #808080',
              padding: '5px 10px 4px',
              opacity: showScrollHint ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
              animation: 'bounce 1.5s ease-in-out infinite',
              width: 'fit-content',
              margin: '0 auto',
            }}
          >
            <span style={{ fontSize: 14, color: '#000000', lineHeight: 1 }}>↓</span>
            <span style={{ fontSize: 11, color: '#444444', whiteSpace: 'nowrap' }}>Scroll to explore</span>
          </div>
        </div>
      </div>

      {/* Win98 status bar */}
      <div
        style={{
          height: 25,
          background: '#C0C0C0',
          borderTop: '1px solid #808080',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px',
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div style={statusInset}>4 case studies</div>
        <div style={{ ...statusInset, marginLeft: 'auto' }}>
          Open to remote · Santiago, Chile
        </div>
      </div>
    </div>
  );
}

// ─── Win98 title-bar button ───────────────────────────────────────────────────

function Win98TitleBtn({
  label,
  symbol,
  onClick,
}: {
  label: string;
  symbol: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      data-traffic
      aria-label={label}
      onMouseDown={(e) => {
        e.stopPropagation();
        setPressed(true);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        setPressed(false);
        onClick(e);
      }}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: 20,
        height: 18,
        background: "#C0C0C0",
        borderTop: pressed ? "2px solid #808080" : "2px solid #FFFFFF",
        borderLeft: pressed ? "2px solid #808080" : "2px solid #FFFFFF",
        borderRight: pressed ? "2px solid #FFFFFF" : "2px solid #808080",
        borderBottom: pressed ? "2px solid #FFFFFF" : "2px solid #808080",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000",
        flexShrink: 0,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {symbol}
    </button>
  );
}

// ─── Window shell ─────────────────────────────────────────────────────────────

function resolveFileApp(node: FileNode): { app: AppType; id: WindowId } {
  if (node.fileType === "json")
    return { app: "jsonfile", id: `jsonfile-${node.contentKey}` };
  if (node.fileType === "app" && node.contentKey === "doom")
    return { app: "doom", id: "doom" };
  if (node.fileType === "app")
    return { app: "casestudy", id: `casestudy-${node.contentKey}` };
  if (node.fileType === "pdf")
    return { app: "resume", id: `resume-${node.contentKey}` };
  if (node.contentKey === "contact") return { app: "contact", id: "contact" };
  if (node.contentKey === "bio") return { app: "about", id: "about" };
  return { app: "textfile", id: `textfile-${node.contentKey}` };
}

export default function Window({ win }: { win: WindowConfig }) {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    openWindow,
    windows,
  } = useWindowStore();
  const isActive = useWindowStore((s) => s.activeWindowId === win.id);

  const handleTitlebarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-traffic]")) return;
    if (win.isMaximized) return;
    e.preventDefault();
    focusWindow(win.id);
    const startX = e.clientX - win.x;
    const startY = e.clientY - win.y;
    const onMove = (me: MouseEvent) =>
      moveWindow(win.id, me.clientX - startX, Math.max(0, me.clientY - startY));
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (win.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.width;
    const startH = win.height;
    const onMove = (me: MouseEvent) =>
      resizeWindow(
        win.id,
        Math.max(320, startW + me.clientX - startX),
        Math.max(200, startH + me.clientY - startY),
      );
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const handleOpen = (node: FSNode) => {
    if (node.type === "folder") {
      openWindow({
        id: `finder-${node.name}`,
        app: "finder",
        title: node.name,
        props: { folder: node },
        x: win.x + 30,
        y: win.y + 30,
        width: 520,
        height: 380,
      });
    } else {
      const { app, id } = resolveFileApp(node);
      const isCase = app === "casestudy";
      const isDoom = app === "doom";
      const isNew = !windows.find(w => w.id === id);
      openWindow({
        id,
        app,
        title: node.name,
        props: { contentKey: node.contentKey },
        x: win.x + 30,
        y: win.y + 30,
        width: isDoom ? 640 : isCase ? 780 : 480,
        height: isDoom ? 680 : isCase ? 540 : 380,
      });
      if (isCase && isNew) maximizeWindow(id);
    }
  };

  const folder = (win.props?.folder as FolderNode | undefined) ?? filesystem;

  const outerStyle: React.CSSProperties = win.isMaximized
    ? {
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "calc(100vh - 42px)",
        zIndex: win.zIndex,
      }
    : {
        position: "fixed",
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  const titlebarGradient = isActive
    ? "linear-gradient(to right, #000080, #1084D0)"
    : "linear-gradient(to right, #808080, #A0A0A0)";

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.05, scaleY: 0.02, x: '-44vw', y: '44vh', skewX: 14, skewY: 6 }}
      animate={{ opacity: 1, scaleX: 1, scaleY: 1, x: 0, y: 0, skewX: 0, skewY: 0 }}
      exit={{ opacity: 0, scaleX: 0.05, scaleY: 0.02, x: '-44vw', y: '44vh', skewX: 14, skewY: 6 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], opacity: { duration: 0.18 } }}
      style={{
        ...outerStyle,
        display: "flex",
        flexDirection: "column",
        /* Win98 beveled outer border */
        borderTop: "2px solid #FFFFFF",
        borderLeft: "2px solid #FFFFFF",
        borderRight: "2px solid #808080",
        borderBottom: "2px solid #808080",
        boxShadow: "0 0 0 1px #000000",
        borderRadius: 0,
        overflow: "hidden",
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className="window-titlebar shrink-0"
        style={{
          height: 23,
          background: titlebarGradient,
          display: "flex",
          alignItems: "center",
          paddingLeft: 3,
          paddingRight: 2,
          gap: 2,
        }}
        onMouseDown={handleTitlebarMouseDown}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        {/* Title */}
        <span
          style={{
            flex: 1,
            fontSize: 14,
            fontFamily: 'inherit',
            fontWeight: "bold",
            color: "#FFFFFF",
            userSelect: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            paddingLeft: 2,
          }}
        >
          {win.title}
        </span>

        {/* Win98 control buttons: _ □ X */}
        <div data-traffic style={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Win98TitleBtn
            label="Minimize"
            symbol="_"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
          />
          <Win98TitleBtn
            label="Maximize"
            symbol="□"
            onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
          />
          <Win98TitleBtn
            label="Close"
            symbol="✕"
            onClick={(e) => { e.stopPropagation(); if (win.app === 'music') useMusicStore.getState().stop(); closeWindow(win.id); }}
          />
        </div>
      </div>

      {/* Menu bar */}
      <div
        style={{
          height: 23,
          background: "#C0C0C0",
          borderBottom: "1px solid #808080",
          borderTop: "1px solid #FFFFFF",
          display: "flex",
          alignItems: "center",
          paddingInline: 2,
          flexShrink: 0,
        }}
      >
        {["File", "Edit", "View", "Help"].map((item) => (
          <span
            key={item}
            style={{
              padding: "0 6px",
              fontSize: 14,
              fontFamily: 'inherit',
              color: "#000000",
              cursor: "default",
              height: "100%",
              display: "flex",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ background: "#FFFFFF" }}>
        {win.app === "home" && <HomeApp />}
        {win.app === "finder" && (
          <FinderApp folder={folder} onOpen={handleOpen} />
        )}
        {win.app === "textfile" && (
          <TextApp
            text={
              (content[win.props?.contentKey as keyof typeof content] as string) ?? ""
            }
          />
        )}
        {win.app === "jsonfile" && (
          <JsonApp
            data={content[win.props?.contentKey as keyof typeof content]}
          />
        )}
        {win.app === "casestudy" && !!win.props?.contentKey && (
          <CaseStudyApp studyKey={win.props.contentKey as CaseStudyKey} />
        )}
        {win.app === "about" && <AboutApp />}
        {win.app === "contact" && <ContactApp />}
        {win.app === "resume" && <ResumeApp />}
        {win.app === "doom" && <DoomApp />}
        {win.app === "aoe" && <AoeApp />}
        {win.app === "sims" && <SimsApp />}
        {win.app === "music" && <MusicApp />}
        {win.app === "sysinfo" && <SysInfoApp />}
        {win.app === "find" && <FindApp />}
        {win.app === "run" && <RunApp />}
        {win.app === "help" && <HelpApp />}
        {win.app === "shutdown" && <ShutdownApp windowId={win.id} />}
        {win.app === "shrine" && <ShrineApp />}
      </div>

      {/* Win98 resize grip */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            cursor: "se-resize",
            background: "linear-gradient(135deg, transparent 30%, #808080 30%, #808080 50%, transparent 50%, transparent 70%, #808080 70%)",
            backgroundSize: "4px 4px",
          }}
        />
      )}
    </motion.div>
  );
}
