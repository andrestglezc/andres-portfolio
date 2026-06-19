// src/lib/content.ts
// All portfolio content for Andres T. Gonzalez C.
// Edit this file to update any text on the site

export const content = {

  readme: `Hey! 👋

Thank you for visiting my site.

I made this because I always loved the look
and feel of using a computer in the 90s when
I was a kid. That feeling has slowly died as
computing evolved — but there is something
about this world, this time in tech and the
internet, that I am pretty sure you miss too.

I hope you enjoy your stay here, and I will
have accomplished my task if I made you
remember how it felt back then.

I hope you have a great day, and remember
that life is beautiful!

— Andrés

════════════════════════════════════════

Quick start:
  1. Open /Work       → Case studies
  2. Open /About_Me   → Bio & skills
  3. Resume.pdf       → Download CV
  4. Contact.txt      → Get in touch

Trusted by: Perficient · Entel · SKY Airline
            GASCO · Toyota · HAP Henry Ford`,

  bio: `Andres T. Gonzalez C.
UX Product Designer · Design Lead · UX Consultant
=================================================

10+ years shipping end-to-end product across
Fortune 500 enterprise, aviation, energy, and civic tech.

I specialize in:
  — Design systems at scale
  — Complex information architecture
  — AI-augmented design workflows
  — 0→1 product design

Currently: Senior UX Technical Consultant @ Perficient
Also:      Founder @ TheMiraiLab

Certified:
  Google Certified Generative AI Leader (Dec 2025)
  Prompt Engineering for UX · Udemy (May 2025)
  Figma 2025 UI Design · Udemy (Jan 2025)

Open to senior IC or design lead roles
in product-first teams.`,

  skills: {
    ai_tools: [
      'Claude (Anthropic)',
      'Claude Code',
      'Claude Cowork',
      'Claude Design',
      'Google Gemini',
      'Prompt Engineering for UX',
      'Gen AI for UX',
    ],
    design: [
      'Figma',
      'FigJam',
      'Framer',
      'Prototyping',
      'Wireframing',
      'Interaction Design',
      'Visual Design',
    ],
    systems: [
      'Design Systems',
      'Component Libraries',
      'Design Tokens',
      'Accessibility (WCAG AA)',
      'Responsive Design',
    ],
    research: [
      'User Interviews',
      'Usability Testing',
      'Journey Mapping',
      'Heuristic Evaluation',
    ],
    productivity: [
      'Jira',
      'Confluence',
      'Miro',
      'Zeplin',
      'HTML/CSS basics',
    ],
    languages: {
      Spanish: 'native',
      English: 'native',
    },
  },

  experience: `Experience
==========

Perficient (Sep 2022 – Present)
  Senior UX Technical Consultant (May 2025 – Present)
  UX Technical Consultant (Sep 2022 – May 2025)
  ↳ Clients: XPO Logistics, 3M, Mohawk Flooring,
             Toyota, HAP Henry Ford

TheMiraiLab (Jan 2025 – Present)
  Founder · Independent UX Product Design Studio

GASCO (Oct 2021 – Sep 2022)
  User Experience Design Lead
  ↳ Chile's national gas utility

SKY Airline (May 2019 – Oct 2021)
  UX Product Designer
  ↳ Boarding pass redesign · Web & booking app

Entel (Nov 2017 – May 2019)
  UX/UI Designer · Design System Lead
  ↳ Chile's largest telecommunications company

Nsity App (Jun 2019 – Jan 2020)
  UX Product Designer · London, UK

Wavetec (Jun 2017 – Nov 2017)
  UI Designer · Dubai, UAE

10Ben (2015 – Nov 2017)
  Senior UX/UI Designer · Greater Houston, TX
  ↳ Microsoft, FSP Performance, K9s4Cops`,

  contact: `Got something on your mind? I'd love to hear it!

Whether it's a project, an idea, or just wanting
to say hi — don't be shy.

Real conversations are rare on the internet,
and I genuinely enjoy them.

Email:    andres.t.glez.c@gmail.com
LinkedIn: linkedin.com/in/andres-gonzalez-ux
Location: Santiago, Chile · Open to remote

————————————————————————————————

Close this file and click the envelope icon
in the dock to send me a message directly.

I usually write back within 24 hours.
Sometimes faster — depends on the coffee. ☕

— Andrés`,

  // ─── CASE STUDIES ───────────────────────────────────────

  perficient: {
    images: ['/perficient.jpg'],
    title: 'Perficient — Fortune 500 UX',
    period: '2022 – Present',
    role: 'Senior UX Technical Consultant',
    tags: ['Enterprise', 'UX Strategy', 'Design Systems'],
    clients: ['XPO Logistics', '3M', 'Mohawk Flooring', 'Toyota', 'HAP Henry Ford'],
    color: '#0A3D62',
    sections: [
      {
        heading: 'Context',
        body: 'Perficient is a global digital consultancy. As embedded design lead, I own UX strategy and delivery for Fortune 500 enterprise clients across the US — from logistics and manufacturing to automotive and healthcare.',
      },
      {
        heading: 'Role',
        body: 'End-to-end design ownership from discovery to handoff. I define component libraries, interaction standards, and UX documentation, and align design decisions with engineering constraints and business outcomes.',
      },
      {
        heading: 'Clients',
        body: 'XPO Logistics (internal platform redesign), 3M (enterprise tooling), Mohawk Flooring (dealer portal), Toyota (internal UX), HAP Henry Ford (healthcare UX).',
      },
      {
        heading: 'Outcome',
        body: 'UX standards and design systems adopted across internal teams nationwide. Promoted to Senior UX Technical Consultant in May 2025.',
      },
    ],
  },

  sky: {
    images: ['/sky.jpg'],
    title: 'SKY Airline — Boarding Pass Redesign',
    period: '2019 – 2021',
    role: 'UX Product Designer',
    tags: ['Aviation', 'Product Design', '0→1'],
    clients: ['SKY Airline'],
    color: '#0D3349',
    sections: [
      {
        heading: 'Problem',
        body: "SKY Airline relied on a rigid third-party boarding pass solution that was off-brand, inflexible, and created friction across the passenger journey.",
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

  entel: {
    title: 'Entel — Unified Design System',
    period: '2017 – 2019',
    role: 'UX/UI Designer · Design System Lead',
    tags: ['Design Systems', 'Telco', 'Scale'],
    clients: ["Entel — Chile's largest telco"],
    color: '#1A0A3D',
    images: ['/entel-1.gif', '/entel-2.gif', '/entel-3.jpg'],
    sections: [
      {
        heading: 'Context',
        body: "Entel is Chile's largest telecommunications company with millions of active customers. Product, CX, and brand teams operated without a unified design language, creating inconsistency at scale.",
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
        body: "Entel's first unified design system launched and adopted across product, CX, and brand teams — covering millions of active customers and multiple digital surfaces.",
      },
    ],
  },

  gasco: {
    images: ['/gasco.jpg'],
    title: 'GASCO — Product Design Lead',
    period: '2021 – 2022',
    role: 'User Experience Design Lead',
    tags: ['Energy', 'Design Leadership', 'Team Lead'],
    clients: ["GASCO — Chile's national gas utility"],
    color: '#0A2A1A',
    sections: [
      {
        heading: 'Context',
        body: "Chile's national gas utility scaling its digital product team and launching new customer-facing and internal operations tools.",
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

  nsity: {
    images: ['/1-nsity.jpg'],
    title: 'Nsity — Civic Tech for the Planet',
    period: '2019 – 2020',
    role: 'UX Product Designer',
    tags: ['Civic Tech', 'Mobile', 'London'],
    clients: ['Nsity App — London, UK'],
    color: '#0A2A0A',
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
  timpayne: {
    images: ['/timpayne.jpg'],
    title: 'No Payne No Gain',
    period: '2026',
    role: 'Solo Designer & Developer',
    tags: ['Fan App', 'iOS', 'Solo Build'],
    clients: [],
    color: '#000000',
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

  doom: {
    title: 'DOOM',
    period: '',
    role: '',
    tags: [],
    clients: [],
    color: '#8B0000',
    sections: [],
  },

  xpo: {
    title: 'XPO Design System',
    period: '2022 – Present',
    role: 'Senior UX Technical Consultant · Perficient',
    tags: ['Design Systems', 'Enterprise', 'Fortune 500'],
    clients: ['XPO Logistics'],
    color: '#1a2a4a',
    images: ['/xpo.jpg'],
    sections: [
      {
        heading: 'Context',
        body: 'XPO Logistics is one of the largest freight and logistics companies in the world. As embedded design lead at Perficient, I led the design system effort for internal enterprise platforms used nationwide.',
      },
      {
        heading: 'Role',
        body: 'End-to-end design system ownership — component library, tokens, documentation, and adoption across engineering and product teams.',
      },
      {
        heading: 'Outcome',
        body: 'Unified design system shipped and adopted across internal teams, reducing design inconsistency and accelerating development velocity.',
      },
    ],
  },
};

export type CaseStudyKey = 'perficient' | 'sky' | 'entel' | 'gasco' | 'nsity' | 'xpo' | 'timpayne';
