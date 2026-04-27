import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Andres Glez — AI × UX',
  description:
    'Portfolio of Andres T. Gonzalez C. — Senior UX Technical Consultant with 10+ years shipping end-to-end product across Fortune 500 enterprise, aviation, energy, and civic tech.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body>{children}</body>
    </html>
  );
}
