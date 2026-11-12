// src/lib/content.es.ts
// Spanish copy for everything a visitor reads in content.ts. Each object spreads the
// English one and overrides only text, so images, art, links, keys, URLs and dates of
// record live in one place. The bundle is typed against the English one.

import {
  CaseStudy,
  CaseStudyKey,
  ContentBundle,
  caseStudies,
  certifications,
  contentEn,
  education,
  experience,
  mascot,
  now,
  profile,
  readme,
  skills,
} from './content';

// ─── Dates ───────────────────────────────────────────────────────────────────

const MONTHS: [full: string, short: string][] = [
  ['enero', 'ene.'],
  ['febrero', 'feb.'],
  ['marzo', 'mar.'],
  ['abril', 'abr.'],
  ['mayo', 'may.'],
  ['junio', 'jun.'],
  ['julio', 'jul.'],
  ['agosto', 'ago.'],
  ['septiembre', 'sept.'],
  ['octubre', 'oct.'],
  ['noviembre', 'nov.'],
  ['diciembre', 'dic.'],
];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** An English month, short or full, followed by a year. */
const MONTH_RE =
  /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sept?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.? (\d{4})\b/g;
const month = (m: string) => MONTHS[EN_MONTHS.indexOf(m.slice(0, 3))];

/** Periods and certificates: 'Sep 2022 – Present' → 'sept. 2022 – actualidad'. */
function esPeriod(s: string): string {
  return s
    .replace(MONTH_RE, (_, m: string, y: string) => `${month(m)[1]} ${y}`)
    .replace(/\bPresent\b/g, 'actualidad');
}

/** A month in prose: 'November 2026' → 'noviembre de 2026'. */
function esMonthYear(s: string): string {
  return s.replace(MONTH_RE, (_, m: string, y: string) => `${month(m)[0]} de ${y}`);
}

// ─── Case studies ────────────────────────────────────────────────────────────

type Rows = readonly (readonly [heading: string, body: string])[];

interface StudyEs {
  name?: string;
  kicker: string;
  title: string;
  role: string;
  tags: string[];
  clients?: string[];
  /** Heading and body for each English section, in the same order. Links are kept. */
  sections: Rows;
}

function study(key: CaseStudyKey, es: StudyEs): CaseStudy {
  const cs = caseStudies[key];
  return {
    ...cs,
    ...es,
    period: esPeriod(cs.period),
    sections: cs.sections.map((s, i) => (es.sections[i] ? { ...s, heading: es.sections[i][0], body: es.sections[i][1] } : s)),
  };
}

const SOLO = 'Diseñador y Desarrollador, en solitario';
// Titles used on client engagements at Perficient.
const PUX = 'Diseñador de Producto UX · Perficient';
const UXE = 'Ingeniero de Experiencia de Usuario · Perficient';

const caseStudiesEs: Record<CaseStudyKey, CaseStudy> = {
  tabhero: study('tabhero', {
    kicker: 'Fotografía cualquier tab. Tócala ya.',
    title: 'Tab Hero — Fotografía cualquier tab. Tócala ya.',
    role: SOLO,
    tags: ['Música', 'Web app', 'Visión por computadora', 'Proyecto en solitario'],
    sections: [
      [
        'Contexto',
        'Estoy aprendiendo canciones en guitarra eléctrica, y una tab es una página estática: te dice dónde poner los dedos, pero no cuándo, a qué velocidad ni si lo hiciste bien. Quería el ciclo de Guitar Hero (ver venir las notas, tocarlas y recibir un puntaje) para cualquier tab. Así que lo construí.',
      ],
      [
        'Rol',
        'De punta a punta y en solitario: producto, UX, UI, front-end, el motor de visión por computadora y el despliegue. Construido con Claude Code.',
      ],
      [
        'Qué hace',
        'Sácale una foto a una tab impresa o escrita a mano, pega una captura de pantalla o carga texto ASCII. Tab Hero la lee y la reproduce en cuatro vistas que siguen un mismo reloj: un diapasón en 3D, una autopista al estilo Guitar Hero, un video de referencia o tu webcam en sincronía, y un mapa de acordes con números romanos. Toca al mismo tiempo con el teclado o con una guitarra de verdad, a través del micrófono.',
      ],
      [
        'Bajo el capó',
        'React 19, TypeScript, React Three Fiber, PixiJS y Web Audio. Un motor en FastAPI con OpenCV y un pequeño MLP en numpy lee las fotos y subraya cualquier dígito del que no esté seguro para que lo corrijas con un clic. Conteo inicial, velocidad del 25 al 150 % sin cambiar el tono, loops A/B, 15 afinaciones, un sintetizador Karplus–Strong y puntaje. Más de 70 archivos de pruebas.',
      ],
      ['Resultado', 'En línea, gratis, sin registro y funciona en el navegador.'],
    ],
  }),

  timpayne: study('timpayne', {
    kicker: 'Sitio de fans y app iOS, lanzados en 5 días',
    title: caseStudies.timpayne.title,
    role: SOLO,
    tags: ['App de fans', 'iOS', 'Proyecto en solitario'],
    sections: [
      [
        'Contexto',
        'Tim Payne era el jugador menos conocido del Mundial 2026. Un video del influencer argentino El Scarso lo volvió meme de la noche a la mañana: pasó de 4.715 a 2,5 millones de seguidores en 48 horas. Su ejército de fans necesitaba un hogar. Construí el sitio de fans y la app para iOS yo solo, en una semana.',
      ],
      ['Rol', 'De punta a punta. Producto, UX, UI y front-end: del diseño al lanzamiento, todo en solitario.'],
      [
        'Funcionalidades',
        'Una lámina holográfica personalizada al estilo Panini, un quiz de más de 70 preguntas en 7 categorías, predicciones de partidos con Payne Points y tabla de posiciones, y un generador de cánticos virales.',
      ],
      [
        'Resultado',
        'Lanzado en 5 días. Sitio de fans en línea y una app gratuita para iOS en la App Store, sin anuncios ni registro. No oficial, hecho por un fan.',
      ],
    ],
  }),

  nsity: study('nsity', {
    kicker: 'Civic tech para el planeta',
    title: 'Nsity — Civic tech para el planeta',
    role: 'Diseñador de Producto UX',
    tags: ['Civic tech', 'Móvil', 'Londres'],
    clients: ['Nsity App — Londres, Reino Unido'],
    sections: [
      [
        'Contexto',
        'Nsity es una startup de civic tech con sede en Londres que une la acción ambiental con la participación comunitaria. La app permite a sus usuarios plantar bosques nativos y apoyar a organizaciones sin fines de lucro votando en encuestas dentro de la app.',
      ],
      [
        'Rol',
        'Líder de diseño UX del producto principal. A cargo de la investigación, la arquitectura de información, los wireframes, el diseño de interacción, los prototipos de alta fidelidad y el handoff a desarrollo.',
      ],
      [
        'Proceso',
        'Investigué con usuarios qué los motiva a participar en iniciativas cívicas, diseñé el flujo de votación y la experiencia de seguimiento del impacto, e iteré con pruebas de usabilidad.',
      ],
      [
        'Resultado',
        'La experiencia principal de votación y seguimiento del impacto ambiental se lanzó y se localizó para el mercado del Reino Unido.',
      ],
    ],
  }),

  sky: study('sky', {
    kicker: 'Rediseño de la tarjeta de embarque',
    title: 'SKY Airline — Rediseño de la tarjeta de embarque',
    role: 'Diseñador de Producto UX',
    tags: ['Aviación', 'Diseño de producto', '0→1'],
    sections: [
      [
        'Problema',
        'SKY Airline dependía de la tarjeta de embarque de un proveedor externo: rígida, desalineada con la marca y difícil de adaptar, generaba fricción a lo largo de todo el viaje del pasajero.',
      ],
      [
        'Rol',
        'Líder principal de UX del equipo web y de la app de reservas. A cargo de toda la experiencia de la tarjeta de embarque, de punta a punta: desde la investigación y los wireframes hasta el diseño de alta fidelidad y el handoff a desarrollo.',
      ],
      [
        'Proceso',
        'Mapeé el viaje completo del pasajero, identifiqué los puntos de fricción y diseñé una solución propia que se integraba con la infraestructura de reservas existente y mejoraba la consistencia visual.',
      ],
      [
        'Resultado',
        'La tarjeta de embarque propia se lanzó en todas las rutas: mejoró la consistencia de marca y redujo la dependencia del proveedor externo en todos los puntos de contacto con el pasajero.',
      ],
    ],
  }),

  healthGuides: study('healthGuides', {
    name: 'Guías para una plataforma de salud',
    kicker: 'Guías listas desde el día uno para una nueva plataforma de salud',
    title: 'Guías por rol para una nueva plataforma de salud',
    clients: ['Empresa de salud Fortune 500'],
    role: PUX,
    tags: ['Salud', 'Arquitectura de información', 'Flujos asistidos por IA'],
    sections: [
      [
        'Contexto',
        'Una empresa de salud Fortune 500 está lanzando una nueva plataforma interna para una de sus unidades de negocio, que cubre logística, configuración de clientes, gestión de programas y flujos de los centros de atención.',
      ],
      [
        'Rol',
        'Trabajo integrado al equipo para diseñar y redactar la documentación de usuario por rol de los sitios de administración de la plataforma. Estoy a cargo del ciclo completo: capturar la funcionalidad a partir de las demos técnicas semanales, estructurarla como guías de apoyo (job aids) en la plataforma de conocimiento del cliente y llevar el ciclo de revisión y aprobación con los expertos.',
      ],
      [
        'Proceso',
        'Diseñé la arquitectura de información y el modelo de contenido de un conjunto de guías que cubre decenas de módulos, y escribí primero una guía como plantilla para las demás. Uso flujos de trabajo asistidos por IA para convertir las sesiones de demo en primeros borradores estructurados, mapas de procesos y posibles preguntas frecuentes, y luego contrasto cada borrador con las demos y los comentarios de los expertos antes de publicarlo. Cada semana presento la estructura y los borradores al project manager, a los líderes de TI y a los expertos en la materia.',
      ],
      [
        'Resultado',
        'La documentación se está construyendo a la par de la plataforma, así que el cliente recibe un paquete de habilitación listo desde el día uno, en lugar de una documentación que llega tarde, después del lanzamiento. El flujo asistido por IA acorta el tiempo entre la demo de una funcionalidad y la existencia de una guía usable para ella, y como las guías viven en la plataforma de conocimiento del propio cliente, su equipo puede mantenerlas después del handoff.',
      ],
    ],
  }),

  planDs: study('planDs', {
    name: 'Sistema de diseño de un plan de salud',
    kicker: 'Gobernanza de un sistema de diseño, seguros de salud',
    title: 'Auditoría y gobernanza del sistema de diseño de un plan de salud',
    clients: ['Aseguradora de salud de Estados Unidos'],
    role: PUX,
    tags: ['Sistemas de diseño', 'Design tokens', 'Salud'],
    sections: [
      [
        'Contexto',
        'Una aseguradora de salud integral de Estados Unidos, con una gran base de afiliados y muchos productos digitales que dependen de un mismo sistema de diseño corporativo.',
      ],
      [
        'Rol',
        'Me integré al equipo interno de diseño del cliente como especialista dedicado en sistemas de diseño, trabajando al 100 % dentro de su sistema de diseño corporativo: mantuve componentes, audité design tokens y validé cambios que afectaban a todo el sistema.',
      ],
      [
        'Proceso',
        'Audité las estructuras de tokens en los breakpoints de web y móvil, y resolví las inconsistencias junto al equipo de diseño. Usé flujos de trabajo asistidos por IA para auditar tokens a escala y para redactar documentación de componentes y resúmenes de cambios, revisando cada resultado antes de compartirlo. Presenté los hallazgos y las recomendaciones de gobernanza a los líderes de diseño y product owners, y fui el punto de control de calidad antes de que los cambios pasaran a ingeniería.',
      ],
      [
        'Resultado',
        'Las auditorías sistemáticas de tokens y la gobernanza de componentes redujeron la deuda de diseño y le permitieron al equipo desplegar actualizaciones a escala, manteniendo una experiencia consistente en los productos para afiliados y pacientes.',
      ],
    ],
  }),

  dashboards: study('dashboards', {
    name: 'Dashboards en tiempo real',
    kicker: 'En lugar de herramientas heredadas, sector automotriz',
    title: 'Dashboards en tiempo real para un fabricante global de automóviles',
    clients: ['Empresa automotriz global'],
    role: 'Diseñador de Producto Senior · Perficient',
    tags: ['Automotriz', 'Visualización de datos', 'Dashboards'],
    sections: [
      [
        'Contexto',
        'Un equipo interno de un fabricante global de automóviles necesitaba dashboards modernos y reportes en tiempo real para reemplazar sus herramientas heredadas.',
      ],
      [
        'Rol',
        'Diseñador de Producto Senior. Lideré el proceso de diseño de punta a punta en Figma, desde la auditoría de las herramientas heredadas hasta los diseños validados, trabajando directamente con los stakeholders y los líderes de ingeniería del cliente.',
      ],
      [
        'Proceso',
        'Investigué y audité las herramientas heredadas para encontrar los puntos de fricción, y luego reestructuré la arquitectura para reducir la carga cognitiva. Diseñé visualizaciones de datos en tiempo real y dashboards interactivos, y armé un sistema de diseño escalable para lograr handoffs limpios. Usé IA para sintetizar entrevistas, Figma AI y Figma Make para iterar rápido los layouts de los dashboards, y generé datos de ejemplo realistas para que los prototipos reflejaran el trabajo real. Presenté en revisiones semanales con el cliente e iteré con pruebas de usabilidad.',
      ],
      [
        'Resultado',
        'Los nuevos dashboards y herramientas de reportes reemplazaron a los antiguos. Mejoraron la visibilidad operativa y la velocidad de decisión, redujeron el tiempo de búsqueda manual de datos y los errores, y le dieron al equipo una base para futuras herramientas internas.',
      ],
    ],
  }),

  healthDs: study('healthDs', {
    name: 'Sistema de diseño de un sistema de salud',
    kicker: 'Un solo sistema de diseño para web e iOS',
    title: 'Un solo sistema de diseño para web e iOS en un sistema de salud de EE. UU.',
    clients: ['Sistema de salud de Estados Unidos'],
    role: UXE,
    tags: ['Salud', 'Sistemas de diseño', 'iOS'],
    sections: [
      [
        'Contexto',
        'Un gran sistema de salud de Estados Unidos estaba construyendo nuevas experiencias para web y para su app de iOS, y necesitaba que diseño y desarrollo avanzaran al unísono.',
      ],
      [
        'Rol',
        'Lideré la creación de componentes de UI escalables y reutilizables, patrones y guías de estilo dentro del sistema de diseño corporativo, y convertí flujos de trabajo de salud complejos en interfaces accesibles para pacientes y personal.',
      ],
      [
        'Proceso',
        'Mejoré la experiencia de búsqueda de médicos, sedes y servicios clínicos. Usé IA para sintetizar las sesiones de usabilidad, explorar patrones de búsqueda y navegación y redactar la documentación de los componentes; luego validé las mejores opciones con pruebas de usabilidad. Presenté componentes, prototipos y hallazgos en revisiones con el cliente y críticas de diseño.',
      ],
      [
        'Resultado',
        'Un sistema de diseño centralizado que agilizó el desarrollo de UI y aceleró el lanzamiento de funcionalidades. Una documentación clara redujo la fricción entre diseño y desarrollo y, con ella, el retrabajo.',
      ],
    ],
  }),

  healthSearch: study('healthSearch', {
    name: 'Búsqueda en salud',
    kicker: 'Experiencia de búsqueda y sistema de diseño',
    title: 'Encontrar médicos, sedes y diagnósticos',
    clients: ['Sistema de salud universitario de Estados Unidos'],
    role: UXE,
    tags: ['Salud', 'Búsqueda', 'Sistemas de diseño'],
    sections: [
      [
        'Contexto',
        'Un sistema de salud universitario de Estados Unidos quería una mejor experiencia de búsqueda de médicos, sedes y diagnósticos en sus plataformas digitales.',
      ],
      [
        'Rol',
        'Formé parte del equipo del sistema de diseño, como puente entre diseño y desarrollo: creé componentes de UI reutilizables e hice evolucionar el sistema que sostiene la experiencia de búsqueda.',
      ],
      [
        'Proceso',
        'Usé investigación asistida por IA para encontrar patrones en las pruebas de usabilidad y en el comportamiento de búsqueda, e IA generativa para explorar layouts de resultados, filtros y variaciones de contenido antes de refinar los mejores en Figma. Hice investigación con usuarios y pruebas de usabilidad, y presenté conceptos y hallazgos a los stakeholders y product owners.',
      ],
      [
        'Resultado',
        'Un sistema de diseño confiable que permitió escalar el diseño y el desarrollo, con una experiencia uniforme en las plataformas de búsqueda y menos retrabajo gracias a lineamientos claros.',
      ],
    ],
  }),

  enterpriseDs: study('enterpriseDs', {
    name: 'Sistema de diseño corporativo',
    kicker: 'La evolución de un sistema de diseño, manufactura',
    title: 'La evolución de un sistema de diseño corporativo',
    clients: ['Fabricante Fortune 500'],
    role: UXE,
    tags: ['Sistemas de diseño', 'Corporativo', 'Documentación'],
    sections: [
      [
        'Contexto',
        'Un fabricante Fortune 500 necesitaba mantener su sistema de diseño y hacerlo evolucionar para que la experiencia de usuario interna siguiera siendo consistente en sus nuevos sistemas.',
      ],
      [
        'Rol',
        'Formé parte del equipo del sistema de diseño del cliente, como puente entre diseño y desarrollo: construí componentes de UI reutilizables, patrones y guías de estilo.',
      ],
      [
        'Proceso',
        'Trabajé con los desarrolladores para convertir los conceptos de diseño en interfaces funcionales. Usé IA generativa para sintetizar la investigación, explorar direcciones de UI en etapas tempranas y redactar la documentación y las guías de uso, revisando todo para asegurar su precisión. Presenté los avances a los stakeholders del cliente en revisiones periódicas.',
      ],
      [
        'Resultado',
        'Un sistema de diseño que redujo el tiempo y el esfuerzo necesarios para crear nuevas funcionalidades y mantuvo una experiencia uniforme entre productos.',
      ],
    ],
  }),

  slabViewer: study('slabViewer', {
    name: 'Visor de planchas de cuarzo',
    kicker: 'App de iPad para previsualizar planchas de cuarzo',
    title: 'Una app de iPad para explorar planchas de cuarzo',
    clients: ['Fabricante de pisos y superficies'],
    role: UXE,
    tags: ['App para iPad', 'Diseño de producto', 'Bienes de consumo'],
    sections: [
      [
        'Contexto',
        'Un fabricante de pisos y superficies necesitaba una app de iPad que mostrara imágenes en alta resolución de planchas de cuarzo para previsualizarlas en vivo, de modo que las personas pudieran explorar y visualizar distintos materiales.',
      ],
      [
        'Rol',
        'Diseñé la experiencia completa: investigación, arquetipos de usuario (personas), flujos de usuario, wireframes, prototipos interactivos y pruebas de usabilidad, trabajando con los desarrolladores en la implementación.',
      ],
      [
        'Proceso',
        'Resolví cómo mostrar imágenes de planchas en alta resolución sin sacrificar la velocidad de carga ni la calidad. Usé IA para sintetizar entrevistas y explorar layouts para recorrer y previsualizar las planchas, y luego refiné los mejores en Figma. Presenté flujos y prototipos a los stakeholders e iteré con sus comentarios y los resultados de las pruebas.',
      ],
      [
        'Resultado',
        'Una app visual e interactiva que les permite a los clientes explorar los productos y evaluar su calidad y si se ajustan a lo que necesitan antes de decidir.',
      ],
    ],
  }),

  xpo: study('xpo', {
    name: 'Sistema de diseño XPO',
    kicker: 'Logística corporativa, Fortune 500',
    title: 'XPO Logistics — Sistema de diseño y visibilidad de envíos',
    role: UXE,
    tags: ['Sistemas de diseño', 'Logística', 'Fortune 500'],
    sections: [
      [
        'Contexto',
        'XPO Logistics es una de las empresas de transporte de carga y logística más grandes del mundo. Desde Perficient trabajé en sus productos web y móviles de transporte de carga, mejorando las interfaces digitales y los flujos de trabajo de sus sistemas de logística y gestión de la cadena de suministro.',
      ],
      [
        'Rol',
        'Trabajé en el sistema de diseño (librería de componentes, tokens, documentación y adopción), además de hacer investigación, wireframes y prototipos interactivos, en estrecha colaboración con los equipos de ingeniería y producto.',
      ],
      [
        'Proceso',
        'Investigué el comportamiento y las preferencias de los usuarios, y luego exploré conceptos de dashboards y flujos para la visibilidad de envíos. Incorporé la IA generativa en la síntesis de investigación y en la ideación temprana, y presenté la investigación y los diseños a los stakeholders y product owners de XPO en revisiones periódicas.',
      ],
      [
        'Resultado',
        'Dashboards que les dieron a los equipos de logística visibilidad de los envíos en tiempo real, para monitorear la carga y decidir más rápido. Un sistema de diseño unificado, adoptado por los equipos internos.',
      ],
    ],
  }),

  gasco: study('gasco', {
    kicker: 'Líder de diseño de producto, energía',
    title: 'GASCO — Líder de diseño de producto',
    role: 'Líder de Diseño de Experiencia de Usuario',
    tags: ['Energía', 'Liderazgo de diseño', 'Líder de equipo'],
    clients: ['GASCO — distribuidora nacional de gas de Chile'],
    sections: [
      [
        'Contexto',
        'La distribuidora nacional de gas de Chile estaba haciendo crecer su equipo de producto digital y lanzando nuevas herramientas, tanto para clientes como para sus operaciones internas.',
      ],
      [
        'Rol',
        'Lideré el equipo de diseño en cinco verticales: UX, UI, UXR, CX y marketing. Definí prioridades, incorporé a nuevos diseñadores, administré el presupuesto de diseño e impulsé el design thinking en toda la empresa.',
      ],
      [
        'Proceso',
        'Establecí una cadencia de revisiones de diseño, un proceso de solicitudes para proyectos transversales y un marco de crecimiento para el equipo de diseño. Promoví el design thinking a nivel ejecutivo.',
      ],
      [
        'Resultado',
        'Se lanzaron nuevos productos digitales para clientes y para operaciones internas, y quedó instalado en toda la organización un proceso de diseño transversal y repetible.',
      ],
    ],
  }),

  entel: study('entel', {
    kicker: 'Sistema de diseño unificado para una telco',
    title: 'Entel — Sistema de diseño unificado',
    role: 'Diseñador UX/UI · Líder del Sistema de Diseño',
    tags: ['Sistemas de diseño', 'Telco', 'Escala'],
    clients: ['Entel — la telco más grande de Chile'],
    sections: [
      [
        'Contexto',
        'Entel es la empresa de telecomunicaciones más grande de Chile, con millones de clientes activos. Los equipos de producto, CX y marca trabajaban sin un lenguaje de diseño unificado, y eso generaba inconsistencias a gran escala.',
      ],
      [
        'Rol',
        'Colideré la iniciativa del sistema de diseño desde sus bases: estándares de componentes, arquitectura de tokens, documentación y una guía de adopción para varios equipos.',
      ],
      [
        'Proceso',
        'Audité los patrones de UI existentes en los productos, armé una librería de componentes base en Figma, definí convenciones de nombres y tokens de espaciado, e hice talleres para impulsar la adopción en los equipos.',
      ],
      [
        'Resultado',
        'El primer sistema de diseño unificado de Entel, lanzado y adoptado por los equipos de producto, CX y marca, para millones de clientes activos y múltiples superficies digitales.',
      ],
    ],
  }),

  perficient: study('perficient', {
    kicker: 'Consultoría UX para Fortune 500',
    title: 'Perficient — UX para Fortune 500',
    role: caseStudies.perficient.role,
    tags: ['Corporativo', 'Estrategia UX', 'Sistemas de diseño'],
    sections: [
      [
        'Contexto',
        'Perficient es una consultora digital global. Trabajo integrado a los equipos de clientes corporativos de Estados Unidos, desde empresas Fortune 500 hasta grandes sistemas y planes de salud, convirtiendo sistemas internos complejos y herramientas heredadas en productos que la gente puede usar.',
      ],
      [
        'Rol',
        'Depende del proyecto: diseño de producto de punta a punta, componentes y gobernanza de sistemas de diseño, o documentación de usuario, siempre alineado con las restricciones de ingeniería y los objetivos del negocio.',
      ],
      [
        'Clientes',
        'Salud (una empresa de diagnóstico, un plan de salud y dos sistemas de salud), automotriz, manufactura, pisos y superficies, y transporte de carga y logística. Los proyectos tienen sus propias tarjetas en Trabajo, descritos sin detalles del cliente.',
      ],
      [
        'Resultado',
        'Sistemas de diseño que redujeron el retrabajo y aceleraron la entrega, dashboards en tiempo real que reemplazaron herramientas heredadas, y documentación lista desde el día uno para una nueva plataforma. Ascendido a Senior UX Technical Consultant en mayo de 2025.',
      ],
    ],
  }),
};

// ─── Experience ──────────────────────────────────────────────────────────────
// Keyed by company. Official titles at Perficient stay as they are on the contract.

const EXPERIENCE: Record<string, { roles?: string[]; note?: string }> = {
  Perficient: { note: 'Clientes: XPO Logistics, 3M, Mohawk Flooring, Toyota, HAP Henry Ford' },
  TheMiraiLab: { roles: ['Fundador · Estudio independiente de diseño de producto UX'] },
  GASCO: { roles: ['Líder de Diseño de Experiencia de Usuario'], note: 'Distribuidora nacional de gas de Chile' },
  'SKY Airline': { roles: ['Diseñador de Producto UX'], note: 'Rediseño de la tarjeta de embarque · Web y app de reservas' },
  'Nsity App': { roles: ['Diseñador de Producto UX · Londres, Reino Unido'] },
  Entel: { roles: ['Diseñador UX/UI · Líder del Sistema de Diseño'], note: 'La empresa de telecomunicaciones más grande de Chile' },
  Wavetec: { roles: ['Diseñador UI · Dubái, EAU'] },
  '10Ben': { roles: ['Diseñador UX/UI Senior · Área de Houston, TX'] },
};

// ─── Skills ──────────────────────────────────────────────────────────────────
// Same groups, same order as the English ones.

const SKILLS: { label: string; items: string[] }[] = [
  {
    label: 'Herramientas de IA',
    items: ['Claude (Anthropic)', 'Claude Code', 'Claude Cowork', 'Claude Design', 'ChatGPT', 'Google Gemini', 'Figma AI / Figma Make', 'Prompt engineering para UX', 'IA generativa para UX', 'Prototipado con IA', 'Investigación de usuarios asistida por IA', 'UX conversacional'],
  },
  {
    label: 'Diseño',
    items: ['Figma', 'FigJam', 'Framer', 'Sketch', 'Prototipado', 'Wireframing', 'Diseño de interacción', 'Diseño visual', 'Visualización de datos'],
  },
  {
    label: 'Sistemas',
    items: ['Sistemas de diseño', 'Librerías de componentes', 'Design tokens', 'Accesibilidad (WCAG AA)', 'Diseño responsive', 'Diseño mobile-first', 'Arquitectura de información'],
  },
  {
    label: 'Investigación',
    items: ['Entrevistas a usuarios', 'Pruebas de usabilidad', 'Journey mapping', 'Evaluación heurística', 'Design thinking', 'UserTesting', 'Optimal Workshop', 'Hotjar'],
  },
  {
    label: 'Productividad',
    items: ['Jira', 'Confluence', 'Miro', 'Mural', 'Zeplin', 'Marvel', 'HTML/CSS básico'],
  },
  {
    label: 'Idiomas',
    items: ['Español (nativo)', 'Inglés (nativo)'],
  },
];

// ─── Tecla's facts ───────────────────────────────────────────────────────────
// Same order as the English facts: [text, link label]. Links point where the English ones do.

const FACTS: readonly (readonly [text: string, cta?: string])[] = [
  ['Andrés arma sus propios teclados mecánicos. Yo soy la prueba viviente.'],
  ['Toca el bajo y también está aprendiendo canciones en guitarra eléctrica. Por eso creó Tab Hero.', 'Abrir Tab Hero'],
  ['Es fan de los relojes y de los autos. Máquinas pequeñas o grandes: le gusta entender cómo gira cada engranaje.'],
  ['Le encanta aprender cosas nuevas. Su última insignia: Google Certified Generative AI Leader, diciembre de 2025.'],
  ['Dos gatos mandan en su vida. En este sitio también hay un homenaje a O’Malley.', 'Visitar a O’Malley'],
  ['Es de Maracaibo, Venezuela, y vive en Santiago de Chile. También ha trabajado para equipos en Houston, Dubái y Londres.'],
  ['Lleva más de 10 años diseñando productos: aerolíneas, telecomunicaciones, energía, logística, salud y civic tech.', 'Sobre Andrés'],
  ['Rediseñó la tarjeta de embarque de SKY Airline. Se lanzó en todas las rutas.', 'Ver la tarjeta de embarque'],
  ['Colideró el primer sistema de diseño unificado de Entel, la empresa de telecomunicaciones más grande de Chile.', 'Ver Entel'],
  ['Los sistemas de diseño son lo suyo: componentes, tokens, documentación y lograr que los equipos de verdad los usen.', 'Ver XPO'],
  ['En GASCO lideró el equipo de diseño en cinco áreas: UX, UI, investigación, CX y marketing.', 'Ver GASCO'],
  ['Su trabajo con clientes en Perficient incluye a XPO Logistics, 3M, Mohawk Flooring, Toyota y HAP Henry Ford.', 'Ver Perficient'],
  ['Cuando un futbolista se volvió meme de la noche a la mañana, Andrés diseñó y lanzó un sitio de fans y una app para iOS en 5 días.', 'Ver No Payne No Gain'],
  ['Para Nsity, una startup de civic tech de Londres, diseñó una app donde votar en encuestas ayuda a plantar bosques nativos.', 'Ver Nsity'],
  ['Diseña con la IA como compañera de equipo. Tab Hero lo construyó él solo, con Claude Code, motor de visión por computadora incluido.'],
  ['Dirige su propio estudio de diseño independiente, TheMiraiLab, en paralelo a su trabajo de consultoría.'],
  ['Habla español e inglés como nativo. Escríbele en el que prefieras.', 'Escríbele'],
  ['Suele responder en menos de 24 horas. A veces antes. Depende del café.', 'Escríbele'],
  ['Este sitio existe porque extraña cómo se sentían las computadoras en los 90. El Arcade tiene DOOM, Age of Empires y The Sims.', 'Abrir el Arcade'],
  ['La app Música va de Sinatra a Hendrix. Bastante ecléctico, ¿no?', 'Abrir Música'],
  ['Truco: haz clic en el titular grande para saltar al siguiente. Son ocho.'],
  ['Para un fabricante global de automóviles diseñó dashboards en tiempo real que reemplazaron herramientas internas desactualizadas. Menos tiempo buscando datos, decisiones más rápidas.', 'Ver los dashboards'],
  ['Ahora mismo está escribiendo las guías de una plataforma de salud completamente nueva, para que se pueda usar desde el día uno.', 'Ver las guías'],
];

// ─── Bundle ──────────────────────────────────────────────────────────────────

export const contentEs: ContentBundle = {
  ...contentEn,

  profile: {
    ...profile,
    title: 'Diseñador de Producto UX/AI',
    tagline: 'IA × UX',
    alsoRole: 'Fundador @ TheMiraiLab',
    availability: 'Disponible para trabajar · abierto a remoto',
    seeking: 'Abierto a roles senior como IC o líder de diseño en equipos con foco en producto.',
    intro:
      'Creo experiencias digitales inteligentes donde se cruzan la IA y la interacción humana. Convierto sistemas internos complejos y herramientas heredadas en productos que la gente entiende, y ahora también los construyo de forma más inteligente, con IA para acelerar la investigación, la ideación y la entrega. Han confiado en mí empresas Fortune 500 y grandes sistemas de salud de Estados Unidos, la telco más grande de Chile, empresas nacionales de servicios básicos y startups de civic tech.',
    summary: 'Más de 10 años diseñando productos digitales de nivel corporativo en salud, automotriz, logística, telecomunicaciones, aviación y energía.',
    personal: 'Me encantan la tecnología, los autos, los deportes, las guitarras y los relojes. Además tengo 2 gatos que mandan en mi vida.',
    industries: ['Salud', 'Automotriz', 'Carga y logística', 'Telecomunicaciones', 'Bienes de consumo', 'Aviación', 'Petróleo y gas', 'Civic tech'],
    specialties: [
      'Sistemas de diseño a escala',
      'Arquitectura de información compleja',
      'Flujos de diseño potenciados con IA',
      'Visualización de datos en tiempo real',
      'Diseño de producto de 0 a 1',
    ],
  },

  readme: {
    ...readme,
    greeting: '¡Hola! 👋',
    paragraphs: [
      'Gracias por visitar mi sitio.',
      'Lo hice porque siempre me encantó cómo se veía y se sentía usar una computadora en los 90, cuando era niño. Esa sensación se fue apagando a medida que la computación evolucionó, pero hay algo de ese mundo, de esa época de la tecnología y del internet, que estoy casi seguro de que tú también extrañas.',
      'Espero que disfrutes tu visita. Habré cumplido mi misión si te hice recordar cómo se sentía todo en ese entonces.',
      'Que tengas un gran día, y recuerda: ¡la vida es bella!',
    ],
  },

  contactNote: [
    '¿Tienes algo en mente? ¡Me encantaría escucharlo!',
    'Ya sea un proyecto, una idea o solo ganas de saludar, escríbeme con confianza. Las conversaciones reales son raras en internet, y de verdad las disfruto.',
    'Suelo responder en menos de 24 horas. A veces antes, depende del café. ☕',
  ],

  certifications: certifications.map((c) => esPeriod(c).replace('Member ·', 'Miembro ·').replace('since 2020', 'desde 2020')),

  education: [
    { ...education[0], title: 'Diplomado en Arquitectura de Información y Experiencia de Usuario' },
    { ...education[1], title: 'Diplomado en Arquitectura, Testeo y Diseño de Experiencia (UX/UI)' },
    { ...education[2], title: 'Licenciatura en Diseño y Comunicación Visual' },
  ],

  skills: skills.map((group, i) => ({ ...group, ...SKILLS[i] })),

  experience: experience.map((job) => {
    const es = EXPERIENCE[job.company] ?? {};
    return { ...job, period: esPeriod(job.period), roles: (es.roles ?? job.roles).map(esPeriod), note: es.note ?? job.note };
  }),

  services: [
    { title: 'Diseño de producto UX', desc: 'Diseño de producto de punta a punta, desde la investigación hasta el handoff' },
    { title: 'Sistemas de diseño', desc: 'Librerías de componentes escalables y design tokens para equipos de producto' },
    { title: 'Consultoría UX', desc: 'Estrategia, auditorías y liderazgo de diseño para tu equipo' },
    { title: 'Diseño potenciado con IA', desc: 'Flujos de trabajo modernos con Claude, Gemini y prompt engineering para UX' },
  ],

  faqs: [
    { q: '¿En qué industrias has trabajado?', a: 'Salud, automotriz, carga y logística, telecomunicaciones, bienes de consumo, aviación, petróleo y gas, y civic tech' },
    { q: '¿Estás abierto a trabajar de forma remota?', a: 'Sí. Vivo en Santiago de Chile y estoy abierto a roles remotos en cualquier parte del mundo' },
    { q: '¿Qué estás buscando?', a: 'Roles senior como IC o líder de diseño en equipos con foco en producto' },
  ],

  caseStudies: caseStudiesEs,

  // Two lines each. The layout scales by the longest line, so long ones simply render smaller.
  headlines: [
    ['Construyo el sistema', 'y luego lo lanzo.'],
    ['Desenredo lo complejo', 'y lo vuelvo simple.'],
    ['Diseño con IA', 'y lo construyo yo.'],
    ['Convierto el caos', 'en productos claros.'],
    ['Sistemas de diseño', 'que de verdad se usan.'],
    ['Clientes Fortune 500 atendidos', 'a la velocidad de una startup.'],
    ['Resuelvo lo difícil', 'de punta a punta.'],
    ['Diez años en diseño,', 'aprendiendo cada día.'],
  ],

  mascot: {
    ...mascot,
    intro: '¡Hola! Soy Tecla, y sí, soy una tecla. Andrés arma teclados mecánicos, así que aquí estoy. Haz clic en mí para conocer datos curiosos sobre él.',
    birthdayIntro: '¡Hoy es el cumpleaños de Andrés! Por eso el gorro. Deséale feliz cumpleaños y luego haz clic en mí para un dato curioso.',
    facts: mascot.facts.map((fact, i) => {
      const es = FACTS[i];
      if (!es) return fact;
      return { ...fact, text: es[0], cta: fact.cta && { ...fact.cta, label: es[1] ?? fact.cta.label } };
    }),
  },

  now: {
    ...now,
    updated: esMonthYear(now.updated),
    lead: 'Lo que estoy construyendo, aprendiendo y escuchando este mes.',
    sections: [
      {
        title: 'Construyendo',
        items: [
          { name: 'Guías para una plataforma nueva', note: 'Guías de usuario por rol para una nueva plataforma interna de salud, en Perficient.' },
          { name: 'Nostalgia OS 2', note: 'Este sitio: un escritorio nuevo, una mascota y algunos juguetes.' },
          { name: 'Tab Hero', note: 'Puliendo el modo para tocar sobre tabs de guitarra.' },
        ],
      },
      {
        title: 'Aprendiendo',
        items: [
          { name: 'Bajo y guitarra eléctrica', note: 'Una canción a la vez.' },
          { name: 'Construir con IA', note: 'Lanzando productos reales con Claude Code, de punta a punta.' },
          { name: 'Teclados mecánicos', note: 'Switches, keycaps y el próximo armado.' },
        ],
      },
      {
        title: 'Escuchando',
        items: now.sections[2].items,
      },
    ],
  },
};
