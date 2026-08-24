import type { NextConfig } from "next";

// CSP allows same-origin resources only.
// 'unsafe-inline' for style-src is required because React uses inline styles throughout.
// blob: in connect-src covers audio/Blob URLs used by the music player.
// frame-src 'none': nothing on the site embeds an iframe (the resume renders via react-pdf canvas).
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' is required: Next.js injects inline bootstrap scripts for hydration
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  "frame-src 'none'",
  "frame-ancestors 'self'",
  "connect-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Disable legacy XSS auditor — it can introduce vulnerabilities in modern browsers
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
      {
        source: '/resume.pdf',
        headers: [
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Content-Disposition', value: 'inline; filename="Andres_T_Gonzalez_CV_2026.pdf"' },
        ],
      },
    ];
  },
};

export default nextConfig;
