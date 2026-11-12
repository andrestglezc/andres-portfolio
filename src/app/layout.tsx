import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, EB_Garamond, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './styles/screensavers.css';
import './styles/minesweeper.css';
import './styles/recruiter.css';

// Self-hosted at build time by next/font: no runtime requests to Google, CSP stays 'self'.
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const serif = EB_Garamond({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.atgc.design'),
  title: 'Andres Glez — AI × UX',
  description:
    'Portfolio of Andrés T. González C. — Product UX/AI Designer with 10+ years designing enterprise-grade digital products across healthcare, automotive, logistics, telecom, aviation and energy.',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.png' },
  openGraph: {
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'atgc.design — portfolio of Andrés T. González C., Product UX/AI Designer',
      },
    ],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#008080',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="teal98" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
