// Where the visitor is, as far as the browser will say without asking for
// permission or calling a location service: their system time zone. A zone is
// named after its reference city, so "America/Santiago" reads as Santiago, Chile.

import type { Lang } from './i18n';

export interface Place {
  timeZone: string;
  city: string;
  /** English country name, or null for zones without one (UTC, Etc/…). */
  country: string | null;
  /** ISO country code behind `country`, so the name can be shown in another language. */
  code?: string | null;
}

/** What `cityOf` returns for zones that have no city. Shown translated. */
export const LOCAL_TIME = 'Local time';

/**
 * Spanish names for zone cities that are spelled differently in Spanish: accents the
 * zone database leaves out (Bogota) and the usual Spanish names of big cities (London).
 * Any city not listed reads the same in both languages.
 */
const CITY_ES: Record<string, string> = {
  'Mexico City': 'Ciudad de México',
  Cancun: 'Cancún',
  Merida: 'Mérida',
  Mazatlan: 'Mazatlán',
  'Bahia Banderas': 'Bahía de Banderas',
  'Ciudad Juarez': 'Ciudad Juárez',
  Havana: 'La Habana',
  Panama: 'Panamá',
  Bogota: 'Bogotá',
  Asuncion: 'Asunción',
  Cordoba: 'Córdoba',
  Tucuman: 'Tucumán',
  'Rio Gallegos': 'Río Gallegos',
  Easter: 'Isla de Pascua',
  Galapagos: 'Galápagos',
  Canary: 'Canarias',
  'Sao Paulo': 'São Paulo',
  Belem: 'Belém',
  Cuiaba: 'Cuiabá',
  'Los Angeles': 'Los Ángeles',
  'New York': 'Nueva York',
  London: 'Londres',
  Dublin: 'Dublín',
  Lisbon: 'Lisboa',
  Paris: 'París',
  Brussels: 'Bruselas',
  Berlin: 'Berlín',
  Rome: 'Roma',
  Zurich: 'Zúrich',
  Vienna: 'Viena',
  Prague: 'Praga',
  Warsaw: 'Varsovia',
  Stockholm: 'Estocolmo',
  Copenhagen: 'Copenhague',
  Athens: 'Atenas',
  Istanbul: 'Estambul',
  Moscow: 'Moscú',
  Cairo: 'El Cairo',
  Johannesburg: 'Johannesburgo',
  Dubai: 'Dubái',
  Kolkata: 'Calcuta',
  Calcutta: 'Calcuta',
  Singapore: 'Singapur',
  Jakarta: 'Yakarta',
  Shanghai: 'Shanghái',
  Seoul: 'Seúl',
  Tokyo: 'Tokio',
  Sydney: 'Sídney',
};

/** A zone's city in the given language. */
export const cityIn = (city: string, lang: Lang) => (lang === 'es' ? CITY_ES[city] ?? city : city);

const isValidZone = (tz: string) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

/** The visitor's IANA zone, falling back to `fallback` when the browser hides it. */
export function visitorTimeZone(fallback: string): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && isValidZone(tz)) return tz;
  } catch {
    /* Intl unavailable */
  }
  return fallback;
}

/** "America/Argentina/Buenos_Aires" → "Buenos Aires". */
export function cityOf(timeZone: string): string {
  if (timeZone === 'UTC' || timeZone === 'Etc/UTC' || timeZone === 'GMT') return 'UTC';
  // Fixed-offset zones (Etc/GMT+3) and bare legacy names have no city.
  if (!timeZone.includes('/') || timeZone.startsWith('Etc/')) return LOCAL_TIME;
  return timeZone.slice(timeZone.lastIndexOf('/') + 1).replace(/_/g, ' ');
}

let tables: Promise<{ country: Map<string, string>; alias: Map<string, string> }> | null = null;

const loadTables = () =>
  (tables ??= import('./tzCountry').then(({ ZONES_BY_COUNTRY, ZONE_ALIASES }) => {
    const country = new Map<string, string>();
    for (const group of ZONES_BY_COUNTRY.split('|')) {
      const [code, zones] = group.split(':');
      for (const z of zones.split(',')) country.set(z, code);
    }
    const alias = new Map<string, string>();
    for (const pair of ZONE_ALIASES.split('|')) {
      const [from, to] = pair.split('=');
      alias.set(from, to);
    }
    return { country, alias };
  }));

/** City and country for a zone. Browsers may report legacy names (Asia/Calcutta); those are modernised. */
export async function placeOf(timeZone: string): Promise<Place> {
  try {
    const { country, alias } = await loadTables();
    const zone = country.has(timeZone) ? timeZone : alias.get(timeZone) ?? timeZone;
    const code = country.get(zone);
    let name: string | null = null;
    if (code) {
      try {
        name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? null;
      } catch {
        name = null;
      }
    }
    return { timeZone, city: cityOf(zone), country: name, code: code ?? null };
  } catch {
    return { timeZone, city: cityOf(timeZone), country: null };
  }
}

/** Minutes east of UTC for a zone at a given instant. */
export function offsetMinutes(timeZone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(at);
  const n = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute'), n('second'));
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
}

/** "GMT-3", "GMT+5:30". */
export function offsetLabel(minutes: number): string {
  if (minutes === 0) return 'GMT';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `GMT${minutes < 0 ? '-' : '+'}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}
