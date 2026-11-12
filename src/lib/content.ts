// src/lib/content.ts
// Single source of truth for every piece of copy on the site.
// Edit here; the desktop OS, the command palette and the mobile site all read from it.

export const profile = {
  name: 'Andrés T. González C.',
  shortName: 'Andres Glez',
  title: 'Product UX/AI Designer',
  tagline: 'AI × UX',
  currentRole: 'Senior UX Technical Consultant @ Perficient',
  alsoRole: 'Founder @ TheMiraiLab',
  years: '10+',
  email: 'andres.t.glez.c@gmail.com',
  linkedin: 'https://www.linkedin.com/in/andres-gonzalez-ux/',
  linkedinLabel: 'linkedin.com/in/andres-gonzalez-ux',
  location: 'Santiago, Chile',
  timeZone: 'America/Santiago',
  city: 'Santiago',
  origin: 'Maracaibo, Venezuela → Santiago, Chile',
  availability: 'Available for hire · open to remote',
  seeking: 'Open to senior IC or design lead roles in product-first teams.',
  /** Month and day as 'MM-DD'. Tecla wears a party hat on this date. Empty turns it off. */
  birthday: '08-09',
  resumeUrl: '/resume.pdf',
  resumeFilename: 'Andres_T_Gonzalez_CV_2026.pdf',
  photo: '/profile.jpg',
  intro:
    'Crafting intelligent digital experiences at the intersection of AI and human interaction. I turn complex internal systems and legacy tools into products people understand — and now I build them smarter, using AI to accelerate research, ideation, and delivery. Trusted by Fortune 500 companies and major health systems across the US, Chile’s largest telco, national utilities, and civic tech startups.',
  summary:
    '10+ years designing enterprise-grade digital products across healthcare, automotive, logistics, telecom, aviation and energy.',
  personal: 'I love tech, cars, sports, guitars and watches. Also have 2 cats that run my life.',
  industries: ['Healthcare', 'Automotive', 'Freight & Logistics', 'Telecom', 'Consumer Goods', 'Aviation', 'Oil & Gas', 'Civic Tech'],
  specialties: [
    'Design systems at scale',
    'Complex information architecture',
    'AI-augmented design workflows',
    'Real-time data visualization',
    '0→1 product design',
  ],
  trustedBy: ['Perficient', 'Entel', 'SKY Airline', 'GASCO', 'Toyota', 'HAP Henry Ford'],
};

export const readme = {
  greeting: 'Hey! 👋',
  paragraphs: [
    'Thank you for visiting my site.',
    'I made this because I always loved the look and feel of using a computer in the 90s when I was a kid. That feeling has slowly died as computing evolved — but there is something about this world, this time in tech and the internet, that I am pretty sure you miss too.',
    'I hope you enjoy your stay here, and I will have accomplished my task if I made you remember how it felt back then.',
    'I hope you have a great day, and remember that life is beautiful!',
  ],
  signature: '— Andrés',
};

// ─── Now ─────────────────────────────────────────────────────────────────────
// What I am up to this month. Edit freely; bump `updated` when you do.

export const now = {
  updated: 'November 2026',
  lead: 'What I am building, learning and listening to this month.',
  sections: [
    {
      title: 'Building',
      items: [
        { name: 'Guides for a new platform', note: 'Role-based user guides for a new internal health platform, at Perficient.' },
        { name: 'Nostalgia OS 2', note: 'This site: a new desktop, a mascot and a few toys.' },
        { name: 'Tab Hero', note: 'Polishing the play-along for guitar tabs.' },
      ],
    },
    {
      title: 'Learning',
      items: [
        { name: 'Bass and electric guitar', note: 'One song at a time.' },
        { name: 'Building with AI', note: 'Shipping real products with Claude Code, end to end.' },
        { name: 'Mechanical keyboards', note: 'Switches, keycaps and the next build.' },
      ],
    },
    {
      title: 'Listening to',
      items: [
        { name: 'Frank Sinatra', note: 'Fly Me to the Moon' },
        { name: 'Jimi Hendrix', note: 'Hey Joe' },
      ],
    },
  ],
};

// ─── Headlines ───────────────────────────────────────────────────────────────
// The big desktop/phone headline rotates through these. Two lines each; keep a
// line to about 22 characters so it fits. The first one is the page's real <h1>.

export const headlines: readonly (readonly [string, string])[] = [
  ['I build the system,', 'then I ship.'],
  ['I untangle complexity,', 'then make it simple.'],
  ['I design with AI,', 'and build it myself.'],
  ['I turn messy problems', 'into clear products.'],
  ['I scale design systems', 'teams actually use.'],
  ['Fortune 500 scale,', 'startup speed.'],
  ['I solve hard design', 'problems, end to end.'],
  ['Ten years in design,', 'still learning daily.'],
];

// ─── Mascot ──────────────────────────────────────────────────────────────────
// Tecla ("key" in Spanish) is a keycap who pops up with facts about Andrés.
// `cta` optionally links a fact to a case study or an app.

export interface MascotFact {
  text: string;
  cta?: { label: string; study?: CaseStudyKey; app?: 'contact' | 'about' | 'shrine' | 'arcade' | 'music' };
}

export const mascot: { name: string; intro: string; birthdayIntro: string; facts: MascotFact[] } = {
  name: 'Tecla',
  birthdayIntro: 'It is Andrés’s birthday today! Hence the hat. Say happy birthday, then click me for a fun fact.',
  intro: 'Hi! I’m Tecla, a keycap. Andrés builds mechanical keyboards, so here I am. Click me for fun facts about him.',
  facts: [
    { text: 'Andrés builds his own mechanical keyboards. I am living proof.' },
    {
      text: 'He plays bass guitar, and he is learning songs on electric guitar too. That is why he built Tab Hero.',
      cta: { label: 'Open Tab Hero', study: 'tabhero' },
    },
    { text: 'He is a watch person and a car person. Small machines or big ones, he likes knowing how things tick.' },
    { text: 'He loves learning new things. Latest badge: Google Certified Generative AI Leader, December 2025.' },
    {
      text: 'Two cats run his life. There is also a tribute to O’Malley on this site.',
      cta: { label: 'Visit O’Malley', app: 'shrine' },
    },
    { text: 'He is from Maracaibo, Venezuela and lives in Santiago, Chile. His roles have also been based in Houston, Dubai and London.' },
    {
      text: 'He has been designing products for 10+ years: airlines, telecom, energy, logistics, healthcare and civic tech.',
      cta: { label: 'About Andrés', app: 'about' },
    },
    {
      text: 'He redesigned SKY Airline’s boarding pass. It launched across all routes.',
      cta: { label: 'See the boarding pass', study: 'sky' },
    },
    {
      text: 'He co-led Entel’s first unified design system. Entel is Chile’s largest telecom company.',
      cta: { label: 'See Entel', study: 'entel' },
    },
    {
      text: 'Design systems are his thing: components, tokens, documentation, and getting teams to actually use them.',
      cta: { label: 'See XPO', study: 'xpo' },
    },
    {
      text: 'At GASCO he led the design team across five areas: UX, UI, research, CX and marketing.',
      cta: { label: 'See GASCO', study: 'gasco' },
    },
    {
      text: 'His client work at Perficient includes XPO Logistics, 3M, Mohawk Flooring, Toyota and HAP Henry Ford.',
      cta: { label: 'See Perficient', study: 'perficient' },
    },
    {
      text: 'When a footballer became a meme overnight, Andrés designed and shipped a fan site and an iOS app in 5 days.',
      cta: { label: 'See No Payne No Gain', study: 'timpayne' },
    },
    {
      text: 'For Nsity, a London civic tech startup, he designed an app where voting in polls helps plant native forests.',
      cta: { label: 'See Nsity', study: 'nsity' },
    },
    { text: 'He designs with AI as a teammate. Tab Hero was a solo build with Claude Code, computer-vision engine included.' },
    { text: 'He runs his own independent design studio, TheMiraiLab, alongside his consulting work.' },
    { text: 'He speaks Spanish and English natively. Write to him in either.', cta: { label: 'Say hi', app: 'contact' } },
    {
      text: 'He usually replies within 24 hours. Sometimes faster. It depends on the coffee.',
      cta: { label: 'Say hi', app: 'contact' },
    },
    {
      text: 'This site exists because he misses how computers felt in the 90s. The Arcade has DOOM, Age of Empires and The Sims.',
      cta: { label: 'Open the Arcade', app: 'arcade' },
    },
    { text: 'The Music app plays Sinatra and Hendrix. That is quite a range.', cta: { label: 'Open Music', app: 'music' } },
    { text: 'Tip: click the big headline to skip to the next one. There are eight.' },
    {
      text: 'For a global automaker he designed real-time dashboards that replaced outdated internal tools. Less digging for data, faster decisions.',
      cta: { label: 'See the dashboards', study: 'dashboards' },
    },
    {
      text: 'Right now he is writing the guides for a brand-new health platform, so it is usable on day one.',
      cta: { label: 'See the guides', study: 'healthGuides' },
    },
  ],
};

export const contactNote = [
  'Got something on your mind? I’d love to hear it!',
  'Whether it’s a project, an idea, or just wanting to say hi — don’t be shy. Real conversations are rare on the internet, and I genuinely enjoy them.',
  'I usually write back within 24 hours. Sometimes faster — depends on the coffee. ☕',
];

export const certifications = [
  'Google Certified Generative AI Leader · Google (Dec 2025)',
  'Prompt Engineering for UX Design · Udemy (May 2025)',
  'Gen AI for UX · Udemy (Feb 2025)',
  'Figma 2025 – User Interface Design · Udemy (Jan 2025)',
  'Figma 2024 + Responsive Design · Udemy (Dec 2024)',
  'Gamification – How to Create Engaging User Experiences · IxDF (Aug 2021)',
  'Human-Computer Interaction (HCI) · IxDF (Oct 2020)',
  'Emotional Product Design · IxDF (Oct 2020)',
  'Member · The Interaction Design Foundation (IxDF), since 2020',
];

export const education: { title: string; school: string; period: string }[] = [
  { title: 'Diploma in Information Architecture and User Experience', school: 'Pontificia Universidad Católica de Valparaíso', period: '2019 – 2020' },
  { title: 'Diploma in Architecture, Testing and Experience Design (UX/UI)', school: 'Universidad de Chile', period: '2018 – 2019' },
  { title: 'Degree in Design and Visual Communications', school: 'Universidad del Zulia, Venezuela', period: '2010 – 2015' },
];

export const skills: { label: string; items: string[] }[] = [
  {
    label: 'AI Tools',
    items: ['Claude (Anthropic)', 'Claude Code', 'Claude Cowork', 'Claude Design', 'ChatGPT', 'Google Gemini', 'Figma AI / Figma Make', 'Prompt Engineering for UX', 'Gen AI for UX', 'AI-Driven Prototyping', 'AI-Assisted User Research', 'Conversational UX'],
  },
  {
    label: 'Design',
    items: ['Figma', 'FigJam', 'Framer', 'Sketch', 'Prototyping', 'Wireframing', 'Interaction Design', 'Visual Design', 'Data Visualization'],
  },
  {
    label: 'Systems',
    items: ['Design Systems', 'Component Libraries', 'Design Tokens', 'Accessibility (WCAG AA)', 'Responsive Design', 'Mobile-First Design', 'Information Architecture'],
  },
  {
    label: 'Research',
    items: ['User Interviews', 'Usability Testing', 'Journey Mapping', 'Heuristic Evaluation', 'Design Thinking', 'UserTesting', 'Optimal Workshop', 'Hotjar'],
  },
  {
    label: 'Productivity',
    items: ['Jira', 'Confluence', 'Miro', 'Mural', 'Zeplin', 'Marvel', 'HTML/CSS basics'],
  },
  {
    label: 'Languages',
    items: ['Spanish (native)', 'English (native)'],
  },
];

export const experience: { company: string; period: string; roles: string[]; note?: string }[] = [
  {
    company: 'Perficient',
    period: 'Sep 2022 – Present',
    roles: ['Senior UX Technical Consultant (May 2025 – Present)', 'UX Technical Consultant (Sep 2022 – May 2025)'],
    note: 'Clients: XPO Logistics, 3M, Mohawk Flooring, Toyota, HAP Henry Ford',
  },
  { company: 'TheMiraiLab', period: 'Jan 2025 – Present', roles: ['Founder · Independent UX Product Design Studio'] },
  { company: 'GASCO', period: 'Oct 2021 – Sep 2022', roles: ['User Experience Design Lead'], note: 'Chile’s national gas utility' },
  { company: 'SKY Airline', period: 'May 2019 – Oct 2021', roles: ['UX Product Designer'], note: 'Boarding pass redesign · Web & booking app' },
  { company: 'Nsity App', period: 'Jun 2019 – Jan 2020', roles: ['UX Product Designer · London, UK'] },
  { company: 'Entel', period: 'Nov 2017 – May 2019', roles: ['UX/UI Designer · Design System Lead'], note: 'Chile’s largest telecommunications company' },
  { company: 'Wavetec', period: 'Jun 2017 – Nov 2017', roles: ['UI Designer · Dubai, UAE'] },
  { company: '10Ben', period: '2015 – Nov 2017', roles: ['Senior UX/UI Designer · Greater Houston, TX'], note: 'Microsoft, FSP Performance, K9s4Cops' },
];

export const services = [
  { title: 'UX Product Design', desc: 'End-to-end product design from research to handoff' },
  { title: 'Design Systems', desc: 'Scalable component libraries and design tokens for product teams' },
  { title: 'UX Consulting', desc: 'Strategy, audits, and design leadership for your team' },
  { title: 'AI-Augmented Design', desc: 'Modern workflows using Claude, Gemini and prompt engineering for UX' },
];

export const faqs = [
  { q: 'What industries have you worked in?', a: 'Healthcare, automotive, freight and logistics, telecom, consumer goods, aviation, oil and gas, civic tech' },
  { q: 'Are you open to remote work?', a: 'Yes, based in Santiago Chile and open to remote roles globally' },
  { q: 'What are you looking for?', a: 'Senior IC or design lead roles in product-first teams' },
];

// ─── Case studies ────────────────────────────────────────────────────────────

export type Pattern = 'checker' | 'stripes' | 'waves' | 'dots' | 'grid' | 'zigzag' | 'rings' | 'bars';

export interface CaseStudy {
  /** Short name used on cards, the dock and the command palette. */
  name: string;
  /** One-line description shown under the name on cards. */
  kicker: string;
  title: string;
  period: string;
  role: string;
  tags: string[];
  clients: string[];
  images: string[];
  /** Card artwork: two colours and a generated pattern. */
  art: { a: string; b: string; pattern: Pattern };
  sections: { heading: string; body: string; link?: { text: string; href: string } }[];
}

export type CaseStudyKey =
  | 'tabhero'
  | 'timpayne'
  | 'healthGuides'
  | 'dashboards'
  | 'planDs'
  | 'healthDs'
  | 'healthSearch'
  | 'enterpriseDs'
  | 'slabViewer'
  | 'xpo'
  | 'sky'
  | 'gasco'
  | 'entel'
  | 'nsity'
  | 'perficient';

/** Display order everywhere (Work app, palette, mobile, recruiter page). Newest first. */
export const caseStudyOrder: CaseStudyKey[] = [
  'tabhero',
  'timpayne',
  'healthGuides',
  'planDs',
  'dashboards',
  'healthDs',
  'healthSearch',
  'enterpriseDs',
  'slabViewer',
  'xpo',
  'gasco',
  'sky',
  'entel',
  'nsity',
  'perficient',
];

/** The hand of cards fanned on the desktop. Eight fit; the rest live in the Work app. */
export const featuredOrder: CaseStudyKey[] = ['tabhero', 'timpayne', 'healthGuides', 'dashboards', 'sky', 'xpo', 'gasco', 'entel'];

export const caseStudies: Record<CaseStudyKey, CaseStudy> = {
  tabhero: {
    name: 'Tab Hero',
    kicker: 'Snap any tab. Play it now.',
    title: 'Tab Hero — Snap any tab. Play it now.',
    period: '2026',
    role: 'Solo Designer & Developer',
    tags: ['Music', 'Web App', 'Computer Vision', 'Solo Build'],
    clients: [],
    images: ['/tabhero-1.jpg', '/tabhero-2.jpg'],
    art: { a: '#5B2BE0', b: '#FFB3F0', pattern: 'checker' },
    sections: [
      {
        heading: 'Context',
        body: "I'm learning songs on electric guitar, and a tab is a static page: it says where to put your fingers, not when, how fast, or whether you got it right. I wanted the Guitar Hero loop — see it coming, play it, get scored — for any tab. So I built it.",
      },
      {
        heading: 'Role',
        body: 'End-to-end, solo: product, UX, UI, front-end, the computer-vision engine and deployment. Built with Claude Code.',
      },
      {
        heading: 'What it does',
        body: 'Snap a photo of a printed or handwritten tab, paste a screenshot, or drop in ASCII text. Tab Hero reads it and plays it back across four views on one clock: a 3D fretboard, a Guitar-Hero-style highway, a synced reference video or webcam, and a chord map with roman numerals. Play along on the keyboard or with a real guitar through the mic.',
      },
      {
        heading: 'Under the hood',
        body: 'React 19, TypeScript, React Three Fiber, PixiJS and Web Audio. A FastAPI engine with OpenCV and a small numpy MLP reads the photos and underlines any digit it is unsure of for a one-click fix. Count-in, 25–150% speed at the same pitch, A/B looping, 15 tunings, a Karplus–Strong synth, scoring. 70+ test files.',
      },
      {
        heading: 'Outcome',
        body: 'Live, free, no sign-up, runs in the browser.',
        link: { text: 'tab-hero.vercel.app', href: 'https://tab-hero.vercel.app' },
      },
    ],
  },

  timpayne: {
    name: 'No Payne No Gain',
    kicker: 'Fan site & iOS app, shipped in 5 days',
    title: 'No Payne No Gain',
    period: '2026',
    role: 'Solo Designer & Developer',
    tags: ['Fan App', 'iOS', 'Solo Build'],
    clients: [],
    images: ['/timpayne.jpg'],
    art: { a: '#0B0B0C', b: '#F4F1EA', pattern: 'stripes' },
    sections: [
      {
        heading: 'Context',
        body: 'Tim Payne was the least-known player at the 2026 World Cup. A video from Argentine influencer El Scarso made him a meme overnight — 4,715 followers to 2.5M in 48 hours. His fan army ("el ejército") needed a home. I built the fan site and iOS app solo in a week.',
      },
      {
        heading: 'Role',
        body: 'End-to-end. Product, UX, UI, and front-end — design to ship, all solo.',
      },
      {
        heading: 'Features',
        body: 'Personalized holographic Panini-style figurine, a 70+ question quiz across 7 categories, match predictions with Payne Points and a leaderboard, and a viral chant generator.',
      },
      {
        heading: 'Outcome',
        body: 'Shipped in 5 days. Live fan site and a free iOS app on the App Store — no ads, no signup. Unofficial, made by a fan.',
        link: { text: 'timpaynefans.com', href: 'https://www.timpaynefans.com' },
      },
    ],
  },

  healthGuides: {
    name: 'Health platform guides',
    kicker: 'Day-one guides for a new health platform',
    title: 'Role-based guides for a new health platform',
    period: '2026 – Present',
    role: 'Product UX Designer · Perficient',
    tags: ['Healthcare', 'Information Architecture', 'AI-Assisted Workflows'],
    clients: ['Fortune 500 healthcare company'],
    images: [],
    art: { a: '#0B7A75', b: '#C9F27B', pattern: 'dots' },
    sections: [
      {
        heading: 'Context',
        body: 'A Fortune 500 healthcare company is launching a new internal platform for one of its business units, covering logistics, client configuration, program management and service center workflows.',
      },
      {
        heading: 'Role',
        body: 'Embedded with the team to design and author the role-based user documentation for the platform’s admin sites. I own the full lifecycle: capturing functionality from weekly technical demos, structuring it as job aids in the client’s knowledge platform, and running the expert review and approval cycle.',
      },
      {
        heading: 'Process',
        body: 'Designed the information architecture and content model for a multi-guide suite covering dozens of modules, and wrote the first guide as the pattern for the rest. I use AI-assisted workflows to turn demo sessions into structured first drafts, process maps and FAQ candidates, then check every draft against the demos and expert feedback before it is published. Every week I present structure and drafts to the project manager, IT leads and subject matter experts.',
      },
      {
        heading: 'Outcome',
        body: 'The documentation is being built alongside the platform, so the client gets a day-one enablement package instead of a post-launch catch-up. The AI-assisted workflow shortens the gap between a feature being demoed and a usable guide existing for it, and because the guides live in the client’s own knowledge platform, their team can maintain them after handoff.',
      },
    ],
  },

  planDs: {
    name: 'Health plan design system',
    kicker: 'Design system governance, health insurance',
    title: 'Design system audit and governance for a health plan',
    period: '2026',
    role: 'Product UX Designer · Perficient',
    tags: ['Design Systems', 'Design Tokens', 'Healthcare'],
    clients: ['US health insurance company'],
    images: [],
    art: { a: '#5B7CFF', b: '#FBFAF7', pattern: 'grid' },
    sections: [
      {
        heading: 'Context',
        body: 'A full-service US health insurance company with a large member base and many digital products that all depend on one enterprise design system.',
      },
      {
        heading: 'Role',
        body: 'Embedded in the client’s internal design team as a dedicated design system specialist, working 100% inside their enterprise design system: maintaining components, auditing design tokens and validating system-wide changes.',
      },
      {
        heading: 'Process',
        body: 'Audited token structures across web and mobile breakpoints and resolved inconsistencies with the design team. Used AI-assisted workflows to audit tokens at scale and to draft component documentation and change summaries, reviewing every output before sharing it. Presented findings and governance recommendations to the design leads and product owners, and acted as the quality checkpoint before changes went to engineering.',
      },
      {
        heading: 'Outcome',
        body: 'Systematic token audits and component governance reduced design debt and let the team roll out updates at scale, keeping a consistent experience across member- and patient-facing products.',
      },
    ],
  },

  dashboards: {
    name: 'Real-time dashboards',
    kicker: 'Replacing legacy tools, automotive',
    title: 'Real-time dashboards for a global automaker',
    period: '2025',
    role: 'Senior Product Designer · Perficient',
    tags: ['Automotive', 'Data Visualization', 'Dashboards'],
    clients: ['Global automotive company'],
    images: [],
    art: { a: '#0B0B0C', b: '#FF4B2B', pattern: 'waves' },
    sections: [
      {
        heading: 'Context',
        body: 'An internal team at a global automaker needed modern dashboards and real-time reporting to replace its legacy tools.',
      },
      {
        heading: 'Role',
        body: 'Senior Product Designer. I led the end-to-end design process in Figma, from the audit of the legacy tools to validated designs, working directly with client stakeholders and engineering leads.',
      },
      {
        heading: 'Process',
        body: 'Researched and audited the legacy tools to find the friction points, then restructured the architecture to reduce cognitive load. Designed real-time data visualizations and interactive dashboards, and built a scalable design system for clean handoffs. I used AI to synthesize interviews, Figma AI and Figma Make to iterate dashboard layouts quickly, and generated realistic sample data so the prototypes reflected real work. Presented in weekly client reviews and iterated through usability testing.',
      },
      {
        heading: 'Outcome',
        body: 'The new dashboards and reporting tools replaced the legacy ones. They improved operational visibility and decision speed, cut manual data lookup time and errors, and gave the team a foundation for future internal tools.',
      },
    ],
  },

  healthDs: {
    name: 'Health system design system',
    kicker: 'One design system for web and iOS',
    title: 'One design system for web and iOS at a US health system',
    period: '2025',
    role: 'User Experience Engineer · Perficient',
    tags: ['Healthcare', 'Design Systems', 'iOS'],
    clients: ['US health system'],
    images: [],
    art: { a: '#2EC4B6', b: '#0B0B0C', pattern: 'stripes' },
    sections: [
      {
        heading: 'Context',
        body: 'A large US health system was building new web and iOS app experiences and needed design and development to move as one.',
      },
      {
        heading: 'Role',
        body: 'Led the creation of scalable, reusable UI components, patterns and style guides in the enterprise design system, translating complex healthcare workflows into accessible interfaces for patients and staff.',
      },
      {
        heading: 'Process',
        body: 'Improved the search experience for physicians, locations and clinical services. Used AI to synthesize usability sessions, explore search and navigation patterns, and draft component documentation, then validated the best options through usability testing. Presented components, prototypes and findings in client reviews and design critiques.',
      },
      {
        heading: 'Outcome',
        body: 'A centralized design system that streamlined UI development and sped up feature rollout. Clear documentation reduced friction between design and development, and with it the rework.',
      },
    ],
  },

  healthSearch: {
    name: 'Healthcare search',
    kicker: 'Search experience and design system',
    title: 'Finding physicians, locations and diagnoses',
    period: '2024 – 2025',
    role: 'User Experience Engineer · Perficient',
    tags: ['Healthcare', 'Search', 'Design Systems'],
    clients: ['US academic health system'],
    images: [],
    art: { a: '#1F3A93', b: '#FFD60A', pattern: 'rings' },
    sections: [
      {
        heading: 'Context',
        body: 'A US academic health system wanted a better search experience for physicians, locations and diagnoses across its digital platforms.',
      },
      {
        heading: 'Role',
        body: 'Part of the design system team, bridging design and development: creating reusable UI components and evolving the system behind the search experience.',
      },
      {
        heading: 'Process',
        body: 'Used AI-assisted research to find patterns in usability tests and search behavior, and generative AI to explore result layouts, filters and content variations before refining the strongest ones in Figma. Ran user research and usability testing, and presented concepts and findings to stakeholders and product owners.',
      },
      {
        heading: 'Outcome',
        body: 'A reliable design system that let design and development scale, with a uniform experience across search platforms and less rework thanks to clear guidelines.',
      },
    ],
  },

  enterpriseDs: {
    name: 'Enterprise design system',
    kicker: 'Evolving a design system, manufacturing',
    title: 'Evolving an enterprise design system',
    period: '2023 – 2024',
    role: 'User Experience Engineer · Perficient',
    tags: ['Design Systems', 'Enterprise', 'Documentation'],
    clients: ['Fortune 500 manufacturer'],
    images: [],
    art: { a: '#FF4B2B', b: '#FBFAF7', pattern: 'checker' },
    sections: [
      {
        heading: 'Context',
        body: 'A Fortune 500 manufacturer needed its design system maintained and evolved to keep the internal user experience consistent across new systems.',
      },
      {
        heading: 'Role',
        body: 'Part of the client’s design system team, bridging design and development: building reusable UI components, patterns and style guides.',
      },
      {
        heading: 'Process',
        body: 'Worked with developers to turn design concepts into functional interfaces. Used generative AI to synthesize research, explore UI directions early, and draft documentation and usage guidelines, reviewing all of it for accuracy. Presented updates to client stakeholders in regular reviews.',
      },
      {
        heading: 'Outcome',
        body: 'A design system that cut the time and effort needed to create new features and kept a uniform experience across products.',
      },
    ],
  },

  slabViewer: {
    name: 'Quartz slab viewer',
    kicker: 'iPad app for previewing quartz slabs',
    title: 'An iPad app for exploring quartz slabs',
    period: '2023 – 2024',
    role: 'User Experience Engineer · Perficient',
    tags: ['iPad App', 'Product Design', 'Consumer Goods'],
    clients: ['Flooring and surfaces manufacturer'],
    images: [],
    art: { a: '#E8D5A8', b: '#6B4F3A', pattern: 'zigzag' },
    sections: [
      {
        heading: 'Context',
        body: 'A flooring and surfaces manufacturer needed an iPad app that shows high-resolution images of quartz slabs for live preview, so people can explore and visualize different materials.',
      },
      {
        heading: 'Role',
        body: 'Designed the full experience: research, personas, user flows, wireframes, interactive prototypes and usability testing, working with developers on the implementation.',
      },
      {
        heading: 'Process',
        body: 'Worked out how to display high-resolution slab images while keeping loading fast and quality intact. Used AI to synthesize interviews and explore layouts for browsing and previewing slabs, then refined the best ones in Figma. Presented flows and prototypes to stakeholders and iterated on their feedback and the test results.',
      },
      {
        heading: 'Outcome',
        body: 'A visual, interactive app that lets customers explore products and judge quality and fit before they decide.',
      },
    ],
  },

  nsity: {
    name: 'Nsity',
    kicker: 'Civic tech for the planet',
    title: 'Nsity — Civic Tech for the Planet',
    period: '2019 – 2020',
    role: 'UX Product Designer',
    tags: ['Civic Tech', 'Mobile', 'London'],
    clients: ['Nsity App — London, UK'],
    images: ['/1-nsity.jpg'],
    art: { a: '#00A876', b: '#C9F27B', pattern: 'waves' },
    sections: [
      {
        heading: 'Context',
        body: 'Nsity is a London-based civic tech startup at the intersection of environmental action and community engagement. The app lets users plant native forests and support nonprofits by voting in in-app polls.',
      },
      {
        heading: 'Role',
        body: 'UX design lead for the core product. Owned research, information architecture, wireframes, interaction design, high-fidelity prototypes, and developer handoff.',
      },
      {
        heading: 'Process',
        body: 'Conducted user research to understand motivations around civic participation, designed the polling flow and impact-tracking experience, and iterated through usability testing.',
      },
      {
        heading: 'Outcome',
        body: 'Core polling and environmental impact-tracking experience shipped and localized for the UK market.',
      },
    ],
  },

  sky: {
    name: 'SKY Airline',
    kicker: 'Boarding pass redesign',
    title: 'SKY Airline — Boarding Pass Redesign',
    period: '2019 – 2021',
    role: 'UX Product Designer',
    tags: ['Aviation', 'Product Design', '0→1'],
    clients: ['SKY Airline'],
    images: ['/sky.jpg'],
    art: { a: '#8A1F8F', b: '#FF8AD8', pattern: 'zigzag' },
    sections: [
      {
        heading: 'Problem',
        body: 'SKY Airline relied on a rigid third-party boarding pass solution that was off-brand, inflexible, and created friction across the passenger journey.',
      },
      {
        heading: 'Role',
        body: 'Primary UX lead for the web team and booking app. Owned the full boarding pass experience end-to-end — from research and wireframes through high-fidelity design and developer handoff.',
      },
      {
        heading: 'Process',
        body: 'Mapped the complete passenger journey, identified friction points, and designed an in-house solution that integrated with existing booking infrastructure while improving visual consistency.',
      },
      {
        heading: 'Outcome',
        body: 'In-house boarding pass launched across all routes, improving brand consistency and reducing dependency on the third-party vendor across all passenger touchpoints.',
      },
    ],
  },

  xpo: {
    name: 'XPO Design System',
    kicker: 'Enterprise logistics, Fortune 500',
    title: 'XPO Logistics — Design system and shipment visibility',
    period: 'Sep 2022 – Dec 2023',
    role: 'User Experience Engineer · Perficient',
    tags: ['Design Systems', 'Logistics', 'Fortune 500'],
    clients: ['XPO Logistics'],
    images: ['/xpo.jpg'],
    art: { a: '#E5241B', b: '#FFD60A', pattern: 'bars' },
    sections: [
      {
        heading: 'Context',
        body: 'XPO Logistics is one of the largest freight and logistics companies in the world. At Perficient I worked on its web and app products for freight, improving digital interfaces and user workflows for logistics and supply chain management systems.',
      },
      {
        heading: 'Role',
        body: 'Design system work — component library, tokens, documentation and adoption — alongside research, wireframes and interactive prototypes, in close collaboration with engineering and product teams.',
      },
      {
        heading: 'Process',
        body: 'Researched user behavior and preferences, then explored dashboard and workflow concepts for shipment visibility. Introduced generative AI into research synthesis and early ideation, and presented research and designs to XPO stakeholders and product owners in regular reviews.',
      },
      {
        heading: 'Outcome',
        body: 'Dashboards that gave logistics teams real-time shipment visibility, so they could monitor freight and decide faster. A unified design system adopted across internal teams.',
      },
    ],
  },

  gasco: {
    name: 'GASCO',
    kicker: 'Product design lead, energy',
    title: 'GASCO — Product Design Lead',
    period: '2021 – 2022',
    role: 'User Experience Design Lead',
    tags: ['Energy', 'Design Leadership', 'Team Lead'],
    clients: ['GASCO — Chile’s national gas utility'],
    images: ['/gasco.jpg'],
    art: { a: '#0A8FE0', b: '#B8ECFF', pattern: 'dots' },
    sections: [
      {
        heading: 'Context',
        body: 'Chile’s national gas utility scaling its digital product team and launching new customer-facing and internal operations tools.',
      },
      {
        heading: 'Role',
        body: 'Led the UX design team across five verticals: UX, UI, UXR, CX, and marketing. Defined priorities, onboarded new designers, managed the design budget, and championed design thinking practices company-wide.',
      },
      {
        heading: 'Process',
        body: 'Established a design review cadence, intake process for cross-functional projects, and a growth framework for the design team. Promoted design thinking at the executive level.',
      },
      {
        heading: 'Outcome',
        body: 'New digital products shipped across customer-facing and internal operations. A repeatable cross-functional design process established across the organization.',
      },
    ],
  },

  entel: {
    name: 'Entel',
    kicker: 'Unified design system for a telco',
    title: 'Entel — Unified Design System',
    period: '2017 – 2019',
    role: 'UX/UI Designer · Design System Lead',
    tags: ['Design Systems', 'Telco', 'Scale'],
    clients: ['Entel — Chile’s largest telco'],
    images: ['/entel-1.mp4', '/entel-2.mp4', '/entel-3.jpg'],
    art: { a: '#1B1464', b: '#FF6A1F', pattern: 'rings' },
    sections: [
      {
        heading: 'Context',
        body: 'Entel is Chile’s largest telecommunications company with millions of active customers. Product, CX, and brand teams operated without a unified design language, creating inconsistency at scale.',
      },
      {
        heading: 'Role',
        body: 'Co-led the design system initiative from foundations — component standards, token architecture, documentation, and an adoption playbook for multiple teams.',
      },
      {
        heading: 'Process',
        body: 'Audited existing UI patterns across products, established a core component library in Figma, defined naming conventions and spacing tokens, and ran workshops to drive team adoption.',
      },
      {
        heading: 'Outcome',
        body: 'Entel’s first unified design system launched and adopted across product, CX, and brand teams — covering millions of active customers and multiple digital surfaces.',
      },
    ],
  },

  perficient: {
    name: 'Perficient',
    kicker: 'Fortune 500 UX consulting',
    title: 'Perficient — Fortune 500 UX',
    period: '2022 – Present',
    role: 'Senior UX Technical Consultant',
    tags: ['Enterprise', 'UX Strategy', 'Design Systems'],
    clients: ['XPO Logistics', '3M', 'Mohawk Flooring', 'Toyota', 'HAP Henry Ford'],
    images: ['/perficient.jpg'],
    art: { a: '#0E5A3A', b: '#F2E8C9', pattern: 'grid' },
    sections: [
      {
        heading: 'Context',
        body: 'Perficient is a global digital consultancy. I work embedded in client teams for US enterprises, from Fortune 500 companies to large health systems and health plans, turning complex internal systems and legacy tools into products people can use.',
      },
      {
        heading: 'Role',
        body: 'It depends on the engagement: end-to-end product design, design system components and governance, or user documentation, always aligned with engineering constraints and business outcomes.',
      },
      {
        heading: 'Clients',
        body: 'Healthcare (a diagnostics company, a health plan and two health systems), automotive, manufacturing, flooring and surfaces, and freight and logistics. The engagements have their own cards in Work, described without client detail.',
      },
      {
        heading: 'Outcome',
        body: 'Design systems that cut rework and sped up delivery, real-time dashboards that replaced legacy tools, and day-one documentation for a new platform. Promoted to Senior UX Technical Consultant in May 2025.',
      },
    ],
  },
};

// ─── Bundle ──────────────────────────────────────────────────────────────────
// Everything above that a visitor reads, as one object. content.es.ts mirrors it
// in Spanish, and useContent() hands components the one for the current language.

export const contentEn = {
  profile,
  readme,
  contactNote,
  certifications,
  education,
  skills,
  experience,
  services,
  faqs,
  caseStudies,
  caseStudyOrder,
  featuredOrder,
  headlines,
  mascot,
  now,
};

export type ContentBundle = typeof contentEn;
