'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Icon from '@/os/Icon';
import { useContent } from '@/lib/useContent';
import { useT } from '@/lib/strings';

// Same-origin worker (CSP-safe).
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export default function Resume() {
  const t = useT();
  const { profile } = useContent();
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  // Render pages at the window's width so resizing the window re-fits the PDF.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(([entry]) => {
      clearTimeout(t);
      t = setTimeout(() => setWidth(Math.round(Math.min(entry.contentRect.width - 32, 980))), 120);
    });
    ro.observe(el);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(t('resume.subject'))}`;

  return (
    <div className="resume">
      <div className="toolbar">
        <a className="btn btn--ink btn--sm" href={profile.resumeUrl} download={profile.resumeFilename}>
          <Icon name="download" size={15} /> {t('common.downloadCv')}
        </a>
        <a className="btn btn--sm" href={mailto}>
          <Icon name="mail" size={15} /> {t('resume.emailMe')}
        </a>
        <span className="toolbar-note">
          {numPages > 0 ? t(numPages === 1 ? 'resume.pages.one' : 'resume.pages.other', { n: numPages }) : ''}
        </span>
      </div>
      <div
        className="resume-pages"
        ref={scroller}
        role="img"
        aria-label={numPages ? t('resume.previewN', { n: numPages }) : t('resume.preview')}
      >
        {width > 0 && (
          <Document
            file={profile.resumeUrl}
            onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
            loading={<p className="app-empty">{t('resume.loadingShort')}</p>}
            error={
              <p className="app-empty">
                {t('resume.error')} <a href={profile.resumeUrl}>{t('resume.openDirect')}</a>.
              </p>
            }
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page key={i} pageNumber={i + 1} width={width} renderAnnotationLayer={false} renderTextLayer={false} />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
