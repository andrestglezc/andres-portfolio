'use client';

// Every interface string that lives in components, in English and Spanish.
// Page copy (bio, case studies, Tecla's facts…) lives in content.ts / content.es.ts instead.
// Keys are grouped by area with dotted names. A key missing from `es` is a compile error.
// Values may hold {name} placeholders, filled by t(key, { name: 'value' }).

import { useCallback } from 'react';
import { Lang, useLang } from './i18n';

const en = {
  // ─── Shared ──────────────────────────────────────────────────────────────
  'common.play': 'Play',
  'common.pause': 'Pause',
  'common.nextTrack': 'Next track',
  'common.prevTrack': 'Previous track',
  'common.downloadCv': 'Download CV',
  'common.contactMe': 'Contact me',
  'common.recruiterMode': 'Recruiter mode',
  'common.caseStudies': 'Case studies',
  'common.resume': 'Resume',
  'common.sayHi': 'Say hi',
  'common.updated': 'Updated {date}',
  'common.newTab': ' (opens in a new tab)',
  'section.experience': 'Experience',
  'section.skills': 'Skills',

  // ─── Language switch ─────────────────────────────────────────────────────
  // Each value is written in its own language: the switch offers the other one by name.
  'lang.switchTo': 'Switch to English',
  'lang.hint': 'Language · Idioma',

  // ─── Apps (window titles, dock, palette) ─────────────────────────────────
  'app.about.title': 'About',
  'app.about.hint': 'Bio, skills, experience',
  'app.work.title': 'Work',
  'app.work.hint': 'All case studies',
  'app.case.title': 'Case study',
  'app.case.hint': 'Case study',
  'app.resume.title': 'Resume.pdf',
  'app.resume.hint': 'View or download the CV',
  'app.contact.title': 'Contact',
  'app.contact.hint': 'Email and LinkedIn',
  'app.music.title': 'Music',
  'app.music.hint': 'Sinatra and Hendrix',
  'app.arcade.title': 'Arcade',
  'app.arcade.hint': 'Play Minesweeper. DOOM, Age of Empires, The Sims',
  'app.shrine.title': 'O’Malley',
  'app.shrine.hint': 'A tribute to my cat',
  'app.readme.title': 'README.txt',
  'app.readme.hint': 'Why this site exists',
  'app.now.title': 'Now',
  'app.now.hint': 'What I am building, learning, listening to',
  'app.system.title': 'System',
  'app.system.hint': 'About Nostalgia OS, themes',

  // ─── Top bar ─────────────────────────────────────────────────────────────
  'topbar.aboutOs': 'About {os}',
  'topbar.search': 'Search…',
  'topbar.showMascot': 'Show {name}',
  'topbar.hideMascot': 'Hide {name}',
  'topbar.desktop': 'Desktop',
  'topbar.clockTitle': 'Your local date and time',
  'topbar.searchLabel': 'Search (Command K)',
  'topbar.recruiterTitle': 'A plain, printable one-page summary',
  'topbar.soundsOffLabel': 'Sounds are off. Turn sounds on',
  'topbar.soundsOnLabel': 'Sounds are on. Mute sounds',
  'topbar.soundsOff': 'Sounds off',
  'topbar.soundsOn': 'Sounds on',

  // ─── Power ───────────────────────────────────────────────────────────────
  'power.sleep': 'Sleep',
  'power.restart': 'Restart',
  'power.shutDown': 'Shut down',
  'power.saverLabel': 'Screensaver. Move the mouse or press a key to wake.',
  'power.safe': 'It is now safe to close this tab.',
  'power.thanks': 'Thanks for visiting. Feedback, or just want to say hi?',
  'power.on': 'Power on',

  // ─── Boot ────────────────────────────────────────────────────────────────
  'boot.starting': '{os} is starting',
  'boot.line.memory': 'memory: unlimited ideas',
  'boot.line.type': 'loading typefaces',
  'boot.line.work': 'mounting /work ({n} case studies)',
  'boot.line.cats': 'waking the cats',
  'boot.skip': 'press any key to skip',

  // ─── Windows and dock ────────────────────────────────────────────────────
  'win.arrange': 'Arrange {title}: snap left, right, then centre',
  'win.arrangeTip': 'Arrange: left, right, centre',
  'win.minimize': 'Minimize {title}',
  'win.maximize': 'Maximize {title}',
  'win.restore': 'Restore {title}',
  'win.close': 'Close {title}',
  'dock.label': 'Dock',

  // ─── Command palette ─────────────────────────────────────────────────────
  'palette.label': 'Search',
  'palette.placeholder': 'Search apps, case studies, actions…',
  'palette.inputLabel': 'Search apps, case studies and actions',
  'palette.group.apps': 'Apps',
  'palette.group.cases': 'Case studies',
  'palette.group.actions': 'Actions',
  'palette.recruiterHint': 'Plain one-page summary, printable',
  'palette.email': 'Send an email',
  'palette.linkedin': 'Open LinkedIn',
  'palette.theme': 'Theme: {name}',
  'palette.themeHint': 'Change the look',
  'palette.sleepHint': 'Screensaver',
  'palette.restartHint': 'Replay the boot',
  'palette.offHint': 'Goodbye',
  'palette.noResults': 'No results for {query}',
  'palette.results.one': '{n} result',
  'palette.results.other': '{n} results',
  'palette.empty': 'Nothing found for “{query}”.',

  // ─── Desktop ─────────────────────────────────────────────────────────────
  'hero.serif1': '{years} years designing for Fortune 500s,',
  'hero.serif2': 'airlines, utilities & civic tech',
  'hero.next': 'Next headline',
  'hero.nextTip': 'Click for the next one',
  'hero.play': 'Play rotating headlines',
  'hero.pause': 'Pause rotating headlines',
  'sticky.body': 'I built this because I miss how computers felt in the 90s. I hope it makes you remember too.',
  'sticky.more': 'Read me →',
  'note.close': 'Close note',

  // ─── Clock ───────────────────────────────────────────────────────────────
  'clock.dialog': 'Date and time',
  'clock.today': 'Today',
  'clock.prevMonth': 'Previous month',
  'clock.nextMonth': 'Next month',
  'clock.date': '{weekday}, {day} {month} {year}',
  'clock.monthYear': '{month} {year}',
  'clock.localTime': 'Local time',
  'clock.same': 'Same time as {name} in {place}.',
  'clock.ahead': '{name} is in {place}: {time}, {diff} ahead of you.',
  'clock.behind': '{name} is in {place}: {time}, {diff} behind you.',

  // ─── Footer badges ───────────────────────────────────────────────────────
  'badges.visitor': 'You are visitor',
  'badges.number': 'number {n}',
  'badges.updated': 'Last updated',

  // ─── Tecla ───────────────────────────────────────────────────────────────
  'mascot.ask': '{name}: tell me a fun fact about Andrés',
  'mascot.close': 'Close {name}’s note',
  'mascot.funFact': '{name} · fun fact',
  'mascot.another': 'Another one',
  'mascot.tellMe': 'Tell me one',

  // ─── Mini player and Music ───────────────────────────────────────────────
  'mini.open': '{title}, {artist}. Open Music',
  'music.cover': '{title} cover',
  'music.seek': 'Seek',
  'music.why': 'Why I love this',
  'music.fineprint': 'All songs belong to their respective owners and copyright holders.',
  'music.note.fly':
    'I love this song — it brings so much nostalgia. And for an awesome anime ending song... if you know, you know. 🌙',
  'music.note.joe':
    'Hey Joe was the song that inspired me to learn and play guitar. So iconic, so classic — and somehow still feels completely modern.',

  // ─── Recruiter mode ──────────────────────────────────────────────────────
  'rec.toGoBack': 'to go back',
  'rec.back': 'Back to {os}',
  'rec.print': 'Print / Save as PDF',
  'rec.selectedWork': 'Selected work',
  'rec.certifications': 'Certifications',
  'about.education': 'Education',

  // ─── About ───────────────────────────────────────────────────────────────
  'mobile.more': 'Experience & skills',
  'about.specialize': 'I specialize in',
  'about.services': 'Services',
  'about.certified': 'Certified',
  'about.faq': 'FAQ',
  'about.now': 'Now',
  'about.also': 'Also',
  'about.route': 'Route',
  'about.industries': 'Industries',
  'about.offScreen': 'Off-screen',
  'about.years': '{title} · {years} years',
  'about.together': 'Let’s work together',
  'about.getInTouch': 'Get in touch',

  // ─── Work and case studies ───────────────────────────────────────────────
  'work.lead': '{n} case studies, 2017 to now',
  'case.preview': '{title}: design preview',
  'case.previewN': '{title}: design preview {i} of {n}',
  'case.client': 'Client',
  'case.clients': 'Clients',
  'case.collapse': 'Collapse',
  'case.full': 'Full length',

  // ─── Contact ─────────────────────────────────────────────────────────────
  'contact.copied': 'Copied',
  'contact.copy': 'Copy',
  'contact.write': 'Write an email',
  'contact.basedIn': 'Based in',
  'contact.working': 'Working',
  'contact.remote': 'Remote, worldwide',

  // ─── Resume ──────────────────────────────────────────────────────────────
  'resume.loading': 'Loading resume…',
  'resume.loadingShort': 'Loading…',
  'resume.emailMe': 'Email me',
  'resume.subject': 'Hi Andres — I reviewed your CV',
  'resume.pages.one': '{n} page',
  'resume.pages.other': '{n} pages',
  'resume.preview': 'Resume preview. Use Download CV for the readable PDF.',
  'resume.previewN': 'Resume preview, {n} pages. Use Download CV for the readable PDF.',
  'resume.error': 'Couldn’t render the PDF.',
  'resume.openDirect': 'Open it directly',

  // ─── Arcade and Minesweeper ──────────────────────────────────────────────
  'arcade.games': 'Games',
  'arcade.gameplay': '{game} gameplay',
  'mines.title': 'Minesweeper',
  'mines.level': 'Level',
  'mines.level.beginner': 'Beginner',
  'mines.level.wide': 'Wide',
  'mines.level.intermediate': 'Intermediate',
  'mines.flagMode': 'Flag mode',
  'mines.newGame': 'New game',
  'mines.minesLeft': 'Mines left: {n}',
  'mines.time.one': 'Time: {n} second',
  'mines.time.other': 'Time: {n} seconds',
  'mines.board': 'Minefield, {level}, {rows} rows by {cols} columns',
  'mines.cell': 'Row {row}, column {col}, {state}',
  'mines.cell.exploded': 'exploded mine',
  'mines.cell.near.one': '{n} mine nearby',
  'mines.cell.near.other': '{n} mines nearby',
  'mines.cell.empty': 'empty',
  'mines.cell.mine': 'mine',
  'mines.cell.wrongFlag': 'wrong flag, no mine',
  'mines.cell.flagged': 'flagged',
  'mines.cell.hidden': 'hidden',
  'mines.secs.one': '{n} second',
  'mines.secs.other': '{n} seconds',
  'mines.won': 'Cleared {level} in {time}.{best} Press the face for a new game.',
  'mines.newBest': ' New best time.',
  'mines.lost': 'Boom. You hit a mine. Press the face to play again.',
  'mines.left.one': '{n} mine left.',
  'mines.left.other': '{n} mines left.',
  'mines.note.won': 'Cleared in {n}s',
  'mines.note.newBest': ' · new best!',
  'mines.note.lost': 'Boom! Press the face to try again.',
  'mines.note.ready': 'First click is always safe.',
  'mines.note.flagMode': 'Flag mode: taps plant flags.',
  'mines.note.play': 'Right-click or long-press to flag.',
  'mines.best': 'Best',
  'mines.noneYet': 'none yet',
  'mines.help':
    'Arrow keys move. Enter or Space reveals a cell, or opens the cells around a number whose flags are all placed. F plants or removes a flag. Right-click or long-press also flags.',

  // ─── O’Malley ────────────────────────────────────────────────────────────
  'shrine.alt': 'O’Malley the cat',
  'shrine.p1':
    'This is O’Malley my cat, and he was more than a pet. He was an awesome companion, a presence, a tiny soul that made every room feel more like home.',
  'shrine.p2': 'Thank you for 16 years of love, purring, and being exactly who you were.',
  'shrine.p3': 'Rest easy, little man. 🐾',

  // ─── System ──────────────────────────────────────────────────────────────
  'system.version': 'Version {v}',
  'system.registered': 'Registered to',
  'system.org': 'Organization',
  'system.cpu': 'Processor',
  'system.memory': 'Memory',
  'system.memoryValue': 'Unlimited ideas',
  'system.status': 'Status',
  'system.statusValue': 'Open to work',
  'system.theme': 'Theme',
  'system.saver': 'Screensaver',
  'system.preview': 'Preview screensaver',
  'system.shortcuts': 'Shortcuts',
  'system.credit': 'Designed and built by Andrés with Claude Code. Next.js, React, Framer Motion, Zustand.',
  'keys.search': 'Search everything',
  'keys.esc': 'Close the front window',
  'keys.dblclick': 'Double-click title',
  'keys.maximize': 'Maximize / restore',
  'keys.altArrows': 'Alt + arrows',
  'keys.move': 'Move the front window',
  'keys.altShiftArrows': 'Alt + Shift + arrows',
  'keys.resize': 'Resize the front window',
  'keys.iconClick': 'Click the title icon',
  'keys.snap': 'Snap left, right, centre',
  'theme.teal98': 'Teal ’98',
  'theme.paper': 'Paper',
  'theme.ink': 'Ink',
  'saver.logo': 'Bouncing logo',
  'saver.keycaps': 'Flying keycaps',
  'saver.starfield': 'Starfield',
  'saver.pipes': 'Pipes',

  // ─── Phone layout ────────────────────────────────────────────────────────
  'mobile.backToTop': '{name}, back to top',
  'mobile.seeWork': 'See the work',
  'mobile.sections': 'Sections',
  'mobile.recruiter': 'Recruiter mode: one-page summary',
  'mobile.desktopNote': 'Open this on a computer for the full Nostalgia OS desktop.',
  'mobile.closeCase': 'Close case study',
} as const;

export type StringKey = keyof typeof en;

const es: Record<StringKey, string> = {
  // ─── Compartido ──────────────────────────────────────────────────────────
  'common.play': 'Reproducir',
  'common.pause': 'Pausar',
  'common.nextTrack': 'Siguiente canción',
  'common.prevTrack': 'Canción anterior',
  'common.downloadCv': 'Descargar CV',
  'common.contactMe': 'Contáctame',
  'common.recruiterMode': 'Modo reclutador',
  'common.caseStudies': 'Casos de estudio',
  'common.resume': 'CV',
  'common.sayHi': '¿Hablamos?',
  'common.updated': 'Actualizado: {date}',
  'common.newTab': ' (se abre en una pestaña nueva)',
  'section.experience': 'Experiencia',
  'section.skills': 'Habilidades',

  // ─── Idioma ──────────────────────────────────────────────────────────────
  'lang.switchTo': 'Cambiar a español',
  'lang.hint': 'Idioma · Language',

  // ─── Apps ────────────────────────────────────────────────────────────────
  'app.about.title': 'Sobre mí',
  'app.about.hint': 'Biografía, habilidades, experiencia',
  'app.work.title': 'Trabajo',
  'app.work.hint': 'Todos los casos de estudio',
  'app.case.title': 'Caso de estudio',
  'app.case.hint': 'Caso de estudio',
  'app.resume.title': 'CV.pdf',
  'app.resume.hint': 'Ver o descargar el CV',
  'app.contact.title': 'Contacto',
  'app.contact.hint': 'Correo y LinkedIn',
  'app.music.title': 'Música',
  'app.music.hint': 'Sinatra y Hendrix',
  'app.arcade.title': 'Arcade',
  'app.arcade.hint': 'Juega Buscaminas. DOOM, Age of Empires, The Sims',
  'app.shrine.title': 'O’Malley',
  'app.shrine.hint': 'Un homenaje a mi gato',
  'app.readme.title': 'README.txt',
  'app.readme.hint': 'Por qué existe este sitio',
  'app.now.title': 'Ahora',
  'app.now.hint': 'Lo que estoy construyendo, aprendiendo y escuchando',
  'app.system.title': 'Sistema',
  'app.system.hint': 'Acerca de Nostalgia OS, temas',

  // ─── Barra superior ──────────────────────────────────────────────────────
  'topbar.aboutOs': 'Acerca de {os}',
  'topbar.search': 'Buscar…',
  'topbar.showMascot': 'Mostrar a {name}',
  'topbar.hideMascot': 'Ocultar a {name}',
  'topbar.desktop': 'Escritorio',
  'topbar.clockTitle': 'Tu fecha y hora local',
  'topbar.searchLabel': 'Buscar (Comando K)',
  'topbar.recruiterTitle': 'Un resumen simple de una página, listo para imprimir',
  'topbar.soundsOffLabel': 'Los sonidos están desactivados. Activar sonidos',
  'topbar.soundsOnLabel': 'Los sonidos están activados. Silenciar sonidos',
  'topbar.soundsOff': 'Sonidos desactivados',
  'topbar.soundsOn': 'Sonidos activados',

  // ─── Energía ─────────────────────────────────────────────────────────────
  'power.sleep': 'Suspender',
  'power.restart': 'Reiniciar',
  'power.shutDown': 'Apagar',
  'power.saverLabel': 'Protector de pantalla. Mueve el mouse o presiona una tecla para volver.',
  'power.safe': 'Ahora puedes cerrar esta pestaña de forma segura.',
  'power.thanks': 'Gracias por tu visita. ¿Tienes comentarios o solo quieres saludar?',
  'power.on': 'Encender',

  // ─── Arranque ────────────────────────────────────────────────────────────
  'boot.starting': 'Iniciando {os}',
  'boot.line.memory': 'memoria: ideas ilimitadas',
  'boot.line.type': 'cargando tipografías',
  'boot.line.work': 'montando /work ({n} casos de estudio)',
  'boot.line.cats': 'despertando a los gatos',
  'boot.skip': 'presiona cualquier tecla para saltar',

  // ─── Ventanas y dock ─────────────────────────────────────────────────────
  'win.arrange': 'Organizar {title}: ajustar a la izquierda, a la derecha y luego al centro',
  'win.arrangeTip': 'Organizar: izquierda, derecha, centro',
  'win.minimize': 'Minimizar {title}',
  'win.maximize': 'Maximizar {title}',
  'win.restore': 'Restaurar {title}',
  'win.close': 'Cerrar {title}',
  'dock.label': 'Dock',

  // ─── Paleta de comandos ──────────────────────────────────────────────────
  'palette.label': 'Buscar',
  'palette.placeholder': 'Busca apps, casos de estudio, acciones…',
  'palette.inputLabel': 'Buscar apps, casos de estudio y acciones',
  'palette.group.apps': 'Apps',
  'palette.group.cases': 'Casos de estudio',
  'palette.group.actions': 'Acciones',
  'palette.recruiterHint': 'Resumen simple de una página, para imprimir',
  'palette.email': 'Enviar un correo',
  'palette.linkedin': 'Abrir LinkedIn',
  'palette.theme': 'Tema: {name}',
  'palette.themeHint': 'Cambiar el aspecto',
  'palette.sleepHint': 'Protector de pantalla',
  'palette.restartHint': 'Repetir el arranque',
  'palette.offHint': 'Adiós',
  'palette.noResults': 'No hay resultados para {query}',
  'palette.results.one': '{n} resultado',
  'palette.results.other': '{n} resultados',
  'palette.empty': 'No encontré nada para “{query}”.',

  // ─── Escritorio ──────────────────────────────────────────────────────────
  'hero.serif1': '{years} años diseñando para Fortune 500,',
  'hero.serif2': 'aerolíneas, energía y civic tech',
  'hero.next': 'Siguiente titular',
  'hero.nextTip': 'Haz clic para ver el siguiente',
  'hero.play': 'Reanudar los titulares rotativos',
  'hero.pause': 'Pausar los titulares rotativos',
  'sticky.body': 'Hice esto porque extraño cómo se sentían las computadoras en los 90. Ojalá a ti también te haga recordar.',
  'sticky.more': 'Léeme →',
  'note.close': 'Cerrar nota',

  // ─── Reloj ───────────────────────────────────────────────────────────────
  'clock.dialog': 'Fecha y hora',
  'clock.today': 'Hoy',
  'clock.prevMonth': 'Mes anterior',
  'clock.nextMonth': 'Mes siguiente',
  'clock.date': '{weekday}, {day} de {month} de {year}',
  'clock.monthYear': '{month} de {year}',
  'clock.localTime': 'Hora local',
  'clock.same': 'Tienes la misma hora que {name} en {place}.',
  'clock.ahead': '{name} está en {place}: {time}, {diff} más que tu hora.',
  'clock.behind': '{name} está en {place}: {time}, {diff} menos que tu hora.',

  // ─── Insignias del pie ───────────────────────────────────────────────────
  'badges.visitor': 'Eres la visita',
  'badges.number': 'número {n}',
  'badges.updated': 'Última actualización',

  // ─── Tecla ───────────────────────────────────────────────────────────────
  'mascot.ask': '{name}: cuéntame un dato curioso sobre Andrés',
  'mascot.close': 'Cerrar la nota de {name}',
  'mascot.funFact': '{name} · dato curioso',
  'mascot.another': 'Otro más',
  'mascot.tellMe': 'Cuéntame uno',

  // ─── Minirreproductor y Música ───────────────────────────────────────────
  'mini.open': '{title}, {artist}. Abrir Música',
  'music.cover': 'Portada de {title}',
  'music.seek': 'Posición de la canción',
  'music.why': 'Por qué me encanta',
  'music.fineprint': 'Todas las canciones pertenecen a sus respectivos dueños y titulares de derechos.',
  'music.note.fly':
    'Me encanta esta canción, me trae muchísima nostalgia. Y como ending de anime es increíble... el que sabe, sabe. 🌙',
  'music.note.joe':
    'Hey Joe fue la canción que me inspiró a aprender a tocar la guitarra. Tan icónica, tan clásica, y de alguna forma todavía suena completamente moderna.',

  // ─── Modo reclutador ─────────────────────────────────────────────────────
  'rec.toGoBack': 'para volver',
  'rec.back': 'Volver a {os}',
  'rec.print': 'Imprimir / Guardar como PDF',
  'rec.selectedWork': 'Proyectos destacados',
  'rec.certifications': 'Certificaciones',
  'about.education': 'Formación',

  // ─── Sobre mí ────────────────────────────────────────────────────────────
  'mobile.more': 'Experiencia y habilidades',
  'about.specialize': 'Me especializo en',
  'about.services': 'Servicios',
  'about.certified': 'Certificaciones',
  'about.faq': 'Preguntas frecuentes',
  'about.now': 'Actualmente',
  'about.also': 'También',
  'about.route': 'Ruta',
  'about.industries': 'Industrias',
  'about.offScreen': 'Lejos de la pantalla',
  'about.years': '{title} · {years} años',
  'about.together': 'Trabajemos juntos',
  'about.getInTouch': 'Escríbeme',

  // ─── Trabajo y casos de estudio ──────────────────────────────────────────
  'work.lead': '{n} casos de estudio, de 2017 a hoy',
  'case.preview': '{title}: vista previa del diseño',
  'case.previewN': '{title}: vista previa del diseño {i} de {n}',
  'case.client': 'Cliente',
  'case.clients': 'Clientes',
  'case.collapse': 'Contraer',
  'case.full': 'Ver completo',

  // ─── Contacto ────────────────────────────────────────────────────────────
  'contact.copied': 'Copiado',
  'contact.copy': 'Copiar',
  'contact.write': 'Escribir un correo',
  'contact.basedIn': 'Vivo en',
  'contact.working': 'Modalidad',
  'contact.remote': 'Remoto, para todo el mundo',

  // ─── CV ──────────────────────────────────────────────────────────────────
  'resume.loading': 'Cargando CV…',
  'resume.loadingShort': 'Cargando…',
  'resume.emailMe': 'Escríbeme',
  'resume.subject': 'Hola, Andrés: revisé tu CV',
  'resume.pages.one': '{n} página',
  'resume.pages.other': '{n} páginas',
  'resume.preview': 'Vista previa del CV. Usa Descargar CV para obtener el PDF legible.',
  'resume.previewN': 'Vista previa del CV, {n} páginas. Usa Descargar CV para obtener el PDF legible.',
  'resume.error': 'No se pudo mostrar el PDF.',
  'resume.openDirect': 'Ábrelo directamente',

  // ─── Arcade y Buscaminas ─────────────────────────────────────────────────
  'arcade.games': 'Juegos',
  'arcade.gameplay': 'Gameplay de {game}',
  'mines.title': 'Buscaminas',
  'mines.level': 'Nivel',
  'mines.level.beginner': 'Principiante',
  'mines.level.wide': 'Amplio',
  'mines.level.intermediate': 'Intermedio',
  'mines.flagMode': 'Modo bandera',
  'mines.newGame': 'Nueva partida',
  'mines.minesLeft': 'Minas restantes: {n}',
  'mines.time.one': 'Tiempo: {n} segundo',
  'mines.time.other': 'Tiempo: {n} segundos',
  'mines.board': 'Campo minado, nivel {level}, {rows} filas por {cols} columnas',
  'mines.cell': 'Fila {row}, columna {col}, {state}',
  'mines.cell.exploded': 'mina explotada',
  'mines.cell.near.one': '{n} mina cerca',
  'mines.cell.near.other': '{n} minas cerca',
  'mines.cell.empty': 'vacía',
  'mines.cell.mine': 'mina',
  'mines.cell.wrongFlag': 'bandera incorrecta, no había mina',
  'mines.cell.flagged': 'con bandera',
  'mines.cell.hidden': 'oculta',
  'mines.secs.one': '{n} segundo',
  'mines.secs.other': '{n} segundos',
  'mines.won': '¡Completaste el nivel {level} en {time}!{best} Presiona la carita para una nueva partida.',
  'mines.newBest': ' Nuevo mejor tiempo.',
  'mines.lost': '¡Bum! Pisaste una mina. Presiona la carita para jugar otra vez.',
  'mines.left.one': 'Queda {n} mina.',
  'mines.left.other': 'Quedan {n} minas.',
  'mines.note.won': 'Completado en {n}s',
  'mines.note.newBest': ' · ¡nuevo récord!',
  'mines.note.lost': '¡Bum! Presiona la carita para intentarlo de nuevo.',
  'mines.note.ready': 'El primer clic siempre es seguro.',
  'mines.note.flagMode': 'Modo bandera: cada toque pone una bandera.',
  'mines.note.play': 'Clic derecho o mantén presionado para poner una bandera.',
  'mines.best': 'Récord',
  'mines.noneYet': 'ninguno todavía',
  'mines.help':
    'Las flechas mueven la selección. Enter o Espacio revela una casilla, o abre las casillas alrededor de un número cuando ya tiene todas sus banderas. F pone o quita una bandera. El clic derecho o mantener presionado también ponen una bandera.',

  // ─── O’Malley ────────────────────────────────────────────────────────────
  'shrine.alt': 'O’Malley, el gato',
  'shrine.p1':
    'Este es O’Malley, mi gato, y fue mucho más que una mascota. Fue un compañero increíble, una presencia, una pequeña alma que hacía que cualquier lugar se sintiera más como un hogar.',
  'shrine.p2': 'Gracias por 16 años de amor, ronroneos y por ser exactamente quien eras.',
  'shrine.p3': 'Descansa en paz, pequeñito. 🐾',

  // ─── Sistema ─────────────────────────────────────────────────────────────
  'system.version': 'Versión {v}',
  'system.registered': 'Registrado a nombre de',
  'system.org': 'Organización',
  'system.cpu': 'Procesador',
  'system.memory': 'Memoria',
  'system.memoryValue': 'Ideas ilimitadas',
  'system.status': 'Estado',
  'system.statusValue': 'Disponible para trabajar',
  'system.theme': 'Tema',
  'system.saver': 'Protector de pantalla',
  'system.preview': 'Probar el protector de pantalla',
  'system.shortcuts': 'Atajos',
  'system.credit': 'Diseñado y construido por Andrés con Claude Code. Next.js, React, Framer Motion, Zustand.',
  'keys.search': 'Buscar en todo',
  'keys.esc': 'Cerrar la ventana activa',
  'keys.dblclick': 'Doble clic en el título',
  'keys.maximize': 'Maximizar / restaurar',
  'keys.altArrows': 'Alt + flechas',
  'keys.move': 'Mover la ventana activa',
  'keys.altShiftArrows': 'Alt + Shift + flechas',
  'keys.resize': 'Cambiar el tamaño de la ventana activa',
  'keys.iconClick': 'Clic en el ícono del título',
  'keys.snap': 'Ajustar a la izquierda, a la derecha o al centro',
  'theme.teal98': 'Turquesa ’98',
  'theme.paper': 'Papel',
  'theme.ink': 'Tinta',
  'saver.logo': 'Logo rebotando',
  'saver.keycaps': 'Teclas voladoras',
  'saver.starfield': 'Campo de estrellas',
  'saver.pipes': 'Tuberías',

  // ─── Versión para teléfonos ──────────────────────────────────────────────
  'mobile.backToTop': '{name}, volver arriba',
  'mobile.seeWork': 'Ver mi trabajo',
  'mobile.sections': 'Secciones',
  'mobile.recruiter': 'Modo reclutador: resumen de una página',
  'mobile.desktopNote': 'Ábrelo en una computadora para ver el escritorio completo de Nostalgia OS.',
  'mobile.closeCase': 'Cerrar caso de estudio',
};

const DICTS: Record<Lang, Record<StringKey, string>> = { en, es };

export type Vars = Record<string, string | number>;
export type T = (key: StringKey, vars?: Vars) => string;

/** A string in a given language, with {name} placeholders filled in. */
export function translate(lang: Lang, key: StringKey, vars?: Vars): string {
  const s = DICTS[lang][key];
  return vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;
}

/** t(key, vars?) for the current language. Stable until the language changes. */
export function useT(): T {
  const lang = useLang();
  return useCallback((key: StringKey, vars?: Vars) => translate(lang, key, vars), [lang]);
}
