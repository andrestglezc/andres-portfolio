# Nostalgia OS 2 🖥️

> A custom desktop OS in the browser, used as a portfolio. The wallpaper is the landing page and every case study is a window.

**Live:** [atgc.design](https://www.atgc.design)

---

## What is this?

Version 1 was a faithful Windows 98 clone. Version 2 keeps the idea (a computer you explore) and gives it its own identity: bold editorial type, a fanned hand of case-study cards, hard-shadow windows, a dock, and a command palette.

## Features

- **Desktop as landing page**: headline, live Santiago clock and all 8 case studies visible before any click
- **Window manager**: drag, resize from edges, maximize, minimize to the dock, mouse and touch
- **Dock** with running indicators, plus tiles for open case studies
- **Command palette** (`⌘K` / `Ctrl K`) to search apps, case studies and actions
- **Apps**: About, Work, case-study reader, Resume (PDF), Contact, Music, Arcade, O'Malley, README, System
- **Three themes**: Teal '98 (default), Paper, and Ink (saved per visitor)
- **Boot, sleep, restart, shut down**: the boot plays once per session and is skippable
- **Phones** get the same content and look as one scrolling page
- Respects `prefers-reduced-motion`; everything is keyboard reachable

## Tech stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 16 (App Router)                      |
| Language   | TypeScript                                   |
| Styling    | One CSS file of design tokens (`globals.css`) |
| Animation  | Framer Motion                                |
| State      | Zustand                                      |
| Fonts      | Bricolage Grotesque, EB Garamond, Geist, Geist Mono (self-hosted by `next/font`) |
| Hosting    | Vercel                                       |

## Where things live

```
src/lib/content.ts   every word on the site (profile, case studies, skills, experience)
src/os/              the OS: store, app registry, windows, dock, top bar, boot, palette
src/apps/            one file per app
src/mobile/          the phone layout
src/app/globals.css  tokens, themes and all component styles
```

To add a case study: add an entry to `caseStudies` and its key to `caseStudyOrder` in `content.ts`. The desktop fan, Work app, palette and phone layout pick it up.

## Run locally

```bash
npm install
npm run dev
```

---

## Built With AI

This project was designed and built using an AI-augmented workflow:

- **Claude (Anthropic)** — planning, architecture, content strategy
- **Claude Code** — primary development tool, built the entire OS from the ground up
- **Google Gemini** — supplementary research and ideation

The entire portfolio — from concept to deployed site — was completed in a single session using Claude Code. As a UX designer who doesn't code for a living, this represents exactly the kind of AI-augmented workflow I advocate for professionally.

---

## About

**Andrés T. González C.**  
Product UX/AI Designer  
Senior UX Technical Consultant @ Perficient · Founder @ TheMiraiLab

- 🌐 [atgc.design](https://atgc.design)
- 💼 [linkedin.com/in/andres-gonzalez-ux](https://linkedin.com/in/andres-gonzalez-ux)
- ✉️ andres.t.glez.c@gmail.com
- 📍 Santiago, Chile · Open to remote

---

_"There is something about this world, this time in tech and the internet, that I am pretty sure you miss too."_
