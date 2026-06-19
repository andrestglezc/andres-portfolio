"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function ResumeApp() {
  const [numPages, setNumPages] = useState<number>(0);
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
            width: 140, height: 28, padding: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#C0C0C0', border: '2px solid', borderColor: '#fff #808080 #808080 #fff',
            fontSize: 13, cursor: 'pointer', textDecoration: 'none', color: '#000',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
          }}
        >
          💾 Download CV
        </a>
        <a
          href="mailto:andres.t.glez.c@gmail.com?subject=Hi Andres — I reviewed your CV&body=Hi Andres,"
          style={{
            width: 140, height: 28, padding: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#C0C0C0', border: '2px solid', borderColor: '#fff #808080 #808080 #fff',
            fontSize: 13, cursor: 'pointer', textDecoration: 'none', color: '#000',
            fontFamily: 'MS Sans Serif, Arial, sans-serif',
          }}
        >
          ✉️ Email Me
        </a>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#444' }}>
          Andres T. Gonzalez C. — CV 2026
        </span>
      </div>
      <div
        className="window-content"
        style={{ flex: 1, overflowY: 'auto', background: '#525659', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '12px 0' }}
      >
        <Document
          file="/resume.pdf"
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<span style={{ color: '#fff', fontSize: 13, padding: 24 }}>Loading…</span>}
          error={<span style={{ color: '#fff', fontSize: 13, padding: 24 }}>Failed to load PDF.</span>}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page key={i + 1} pageNumber={i + 1} width={720} renderAnnotationLayer={false} renderTextLayer={false} />
          ))}
        </Document>
      </div>
    </div>
  );
}
