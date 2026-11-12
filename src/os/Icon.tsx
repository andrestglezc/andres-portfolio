// One icon family for the whole OS: 24px grid, 1.75 stroke, round joins.
const PATHS = {
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  doc: 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h4',
  note: 'M5 4h14v12l-4 4H5zM15 20v-4h4M8 9h8M8 13h5',
  mail: 'M3 6h18v12H3zM3.5 6.5 12 13l8.5-6.5',
  music: 'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM19 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
  gamepad: 'M7 8h10a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L14 15h-4l-.7.6A3.5 3.5 0 0 1 3 13.5V12a4 4 0 0 1 4-4ZM7.5 11v3M6 12.5h3M15.5 11.5h.01M17.5 13.5h.01',
  paw: 'M12 20c-2.8 0-5-1.4-5-3.5 0-2 2.2-4 5-4s5 2 5 4c0 2.1-2.2 3.5-5 3.5ZM4.0 10.5a1.5 1.9 0 1 0 3 0a1.5 1.9 0 1 0-3 0ZM17.0 10.5a1.5 1.9 0 1 0 3 0a1.5 1.9 0 1 0-3 0ZM8.0 6a1.5 1.9 0 1 0 3 0a1.5 1.9 0 1 0-3 0ZM13.0 6a1.5 1.9 0 1 0 3 0a1.5 1.9 0 1 0-3 0Z',
  chip: 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20 20',
  power: 'M12 3v8M6.3 6.8a8 8 0 1 0 11.4 0',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z',
  refresh: 'M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.7L4 16M4 20v-4h4',
  close: 'M6 6l12 12M18 6 6 18',
  minus: 'M5 12h14',
  expand: 'M5 5h14v14H5z',
  shrink: 'M8 8h11v11H8zM5 16V5h11',
  arrowUpRight: 'M7 17 17 7M9 7h8v8',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
  play: 'M7 5v14l12-7z',
  pause: 'M8 5v14M16 5v14',
  next: 'M6 5v14l10-7zM18 5v14',
  prev: 'M18 5v14L8 12zM6 5v14',
  linkedin: 'M4 9h3.5v11H4zM5.75 4a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM10.5 9H14v1.7c.7-1.2 2-2 3.7-2 2.8 0 3.8 1.9 3.8 4.7V20H18v-5.8c0-1.5-.5-2.5-1.9-2.5-1.5 0-2.1 1.1-2.1 2.6V20h-3.5z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 16l.7 2 .2.8 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',
  check: 'M5 12.5 10 17l9-10',
  palette: 'M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.5-1-1.5-1-3s1-2 2.5-2H18a3 3 0 0 0 3-3c0-4.4-4-8-9-8ZM7.5 12h.01M9 8h.01M13.5 7h.01',
  volume: 'M4 9.5v5h3.5L12 18V6L7.5 9.5zM15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11',
  mute: 'M4 9.5v5h3.5L12 18V6L7.5 9.5zM16 9.5l5 5M21 9.5l-5 5',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.500 5.6 12 3Z',
  print: 'M7 8V3h10v5M7 17H4V9.500h16V17h-3M7 14h10v7H7z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01',
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 20, strokeWidth = 1.75 }: { name: IconName; size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
