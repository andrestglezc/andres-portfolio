@AGENTS.md

# NostalgiaOS — Portfolio Site

Personal portfolio for **Andres T. Gonzalez C.**, Senior UX Product Designer (10+ years). The site simulates a Windows 98 desktop OS called "Nostalgia OS" — complete with boot screen, draggable windows, taskbar, Start menu, and app ecosystem.

## Tech stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js | 16.2.5 |
| UI | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Animation | Framer Motion | ^12 |
| State | Zustand | ^5 |
| Gestures | @use-gesture/react | ^10 |

## Key files

```
src/
  app/
    page.tsx          # Root: boot sequence, mobile detection, overlay logic
    layout.tsx        # HTML shell, CSP headers
    globals.css       # Win98 font, scrollbar, typewriter animation
  components/
    Desktop.tsx       # Desktop icons (left/right columns), icon→window routing
    Menubar.tsx       # Win98 taskbar: Start button, nav buttons, clock, LinkedIn/mail
    Dock.tsx          # Stub (null) — taskbar replaced by Menubar.tsx
    Window.tsx        # Window shell + ALL app content components inline
    WindowManager.tsx # AnimatePresence wrapper over open windows
    MiniPlayer.tsx    # Floating mini music player
    apps/
      DoomApp.tsx     # DOOM easter egg
      AoeApp.tsx      # Age of Empires easter egg
      SimsApp.tsx     # The Sims easter egg
      MusicApp.tsx    # Music player (fly-me-to-the-moon, hey-joe)
      ShrineApp.tsx   # O'malley cat memorial shrine
    mobile/
      MobileSite.tsx  # Mobile fallback (shown on screens < 768px)
    os/
      BootScreen.tsx  # 3-stage boot: BIOS text → loading bar → welcome screen
      StartMenu.tsx   # Win98 Start menu with submenus and hover delay
  lib/
    windows.ts        # Zustand window manager store (open/close/focus/move/resize/maximize)
    content.ts        # All portfolio copy: bio, skills, case studies, contact, readme
    filesystem.ts     # Virtual FS tree: Desktop → Work/, About_Me/, files
    musicStore.ts     # Music player state (track, play/pause/stop)
    audio.ts          # Startup/shutdown/sleep chime audio
```

## Architecture overview

### Window system (`src/lib/windows.ts`)
Zustand store. `zCounter` (module-level int) provides z-index ordering. Each window is a `WindowConfig` with `id`, `app` (typed `AppType`), `x/y/width/height`, `zIndex`, `isMinimized`, `isMaximized`. `openWindow` deduplicates by `id` — calling it twice with the same id just focuses.

### App routing
`Window.tsx` renders the content area as a big switch over `win.app`. All app sub-components live in the same file (`HomeApp`, `FinderApp`, `CaseStudyApp`, `TextApp`, `AboutApp`, `ContactApp`, `ResumeApp`, `DoomApp`, `SysInfoApp`, `FindApp`, `RunApp`, `HelpApp`, `ShutdownApp`, `ShrineApp`).

### Virtual filesystem (`src/lib/filesystem.ts`)
`FSNode = FileNode | FolderNode`. Desktop root has two folders (`Work/`, `About_Me/`) and several top-level files. `Desktop.tsx` uses this to render icons; `FinderApp` browses it.

### Content (`src/lib/content.ts`)
Single source of truth for all visible text. Edit here to change anything on the site. Case studies: `perficient`, `sky`, `entel`, `gasco`, `nsity`, `xpo`.

### Boot flow (`src/app/page.tsx`)
1. `mounted` guard (SSR safety) → black screen
2. `isMobile` (useSyncExternalStore) → `<MobileSite />` on < 768px
3. `booted` → `<BootScreen>` until complete, then startup chime plays
4. Desktop renders: `<Menubar>`, `<Desktop>`, `<WindowManager>`, overlay, `<MiniPlayer>`
5. On boot, `home` window + `textfile-readme` window open automatically; overlay dims until README is closed

### README overlay
`showOverlay` + `readmeEverOpened` state machine (render-phase derived state, no setState-in-effect). README is kept above the overlay by pinning its zIndex to `README_Z = 100000`. Clicking the overlay backdrop closes the README.

## App types (window registry)

| AppType | Window content | Default size |
|---|---|---|
| `home` | Portfolio landing (bio, work cards, services, FAQ) | 1188×670 |
| `finder` | Virtual filesystem browser | 520×380 |
| `textfile` | Typewriter text viewer | 480×360 |
| `jsonfile` | JSON viewer (skills) | 480×400 |
| `casestudy` | Two-column: metadata + image carousel | 780×540 |
| `resume` | PDF iframe + download/email buttons | 780×680 |
| `about` | Bio + skills grid | 480×400 |
| `contact` | Contact info with mailto/LinkedIn links | 420×340 |
| `doom` | DOOM easter egg | 640×680 |
| `aoe` | Age of Empires easter egg | 640×480 |
| `sims` | The Sims easter egg | 640×480 |
| `music` | Music player | 459×560 |
| `shrine` | O'malley cat memorial | 360×620 |
| `sysinfo` | System Properties dialog | 420×380 |
| `find` | Find Files dialog | 380×320 |
| `run` | Run command (text shortcuts) | 340×320 |
| `help` | Help text | 480×400 |
| `shutdown` | Shutdown/restart/sleep options | 420×320 |

## Styling conventions
- No Tailwind in window content — all inline `React.CSSProperties` with Win98 palette (#C0C0C0, #000080, #808080, #FFFFFF, etc.)
- Win98 bevel: `bevelUp = { borderTop/Left: #FFF, borderRight/Bottom: #808080 }`, `bevelDown` inverted
- Typewriter effect: `useTypewriter` hook at top of `Window.tsx`; click anywhere to skip
- Framer Motion window animation: squish in from bottom-left corner on open/close

## Case studies
Perficient · SKY Airline · Entel · GASCO · Nsity · XPO. Each has `images[]`, `title`, `period`, `role`, `tags`, `clients`, `color`, `sections[]`. Images live in `/public/`.

## Public assets
Profile photo: `/profile.png`. Wallpaper: `/wallpaper.png`. Case study images: `perficient.jpg`, `sky.jpg`, `entel-{1,2,3}.{gif,jpg}`, `gasco.jpg`, `xpo.jpg`, `1-nsity.jpg`. Desktop icons: `/icons/icon-*.png`. Music: `/fly-me-to-the-moon.mp3`, `/hey-joe.mp3`.

## Run locally
```bash
npm run dev    # http://localhost:3000
npm run build
npm run lint
```
