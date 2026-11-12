'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
import { useContent } from '@/lib/useContent';
import { Lang, dateLocale, useLang } from '@/lib/i18n';
import { T, useT } from '@/lib/strings';
import { LOCAL_TIME, Place, cityIn, offsetLabel, offsetMinutes } from '@/lib/place';

/** The place's city in the current language, or "Local time" for zones without one. */
export const cityLabel = (place: Place, t: T, lang: Lang) =>
  place.city === LOCAL_TIME ? t('clock.localTime') : cityIn(place.city, lang);

/** The country in the current language; English comes straight from the place lookup. */
function countryName(place: Place, lang: Lang): string | null {
  if (lang === 'en' || !place.code) return place.country;
  try {
    return new Intl.DisplayNames([lang], { type: 'region' }).of(place.code) ?? place.country;
  } catch {
    return place.country;
  }
}

/** Spanish weekday and month names are lower case; at the start of a line they take a capital. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** First day of the week for the visitor's locale: 0 = Sunday … 6 = Saturday. Monday when unknown. */
function firstWeekday(): number {
  try {
    const loc = new Intl.Locale(navigator.language) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const first = (loc.getWeekInfo?.() ?? loc.weekInfo)?.firstDay;
    if (typeof first === 'number' && first >= 1 && first <= 7) return first % 7;
  } catch {
    /* older browser */
  }
  return 1;
}

function durationLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ');
}

/** The visitor's clock, date, place and a month calendar. Lives under the top-bar clock. */
export default function ClockPanel({ place }: { place: Place }) {
  const t = useT();
  const lang = useLang();
  const { profile } = useContent();
  const locale = dateLocale(lang);
  const { timeZone } = place;
  const [now, setNow] = useState(() => new Date());
  // Month on show as year * 12 + month; null follows the current month.
  const [view, setView] = useState<number | null>(null);
  const [weekStart] = useState(firstWeekday);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    // Land just after each second boundary so the seconds never skip or stall.
    const tick = () => {
      setNow(new Date());
      id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    return () => clearTimeout(id);
  }, []);

  // Every field is read in `timeZone` so the panel agrees with the top bar even
  // if the browser hid the real zone and we fell back to another one.
  const parts = useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, {
      timeZone,
      hourCycle: 'h23',
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(now);
    const get = (t: string) => f.find((p) => p.type === t)?.value ?? '';
    return {
      weekday: get('weekday'),
      year: Number(get('year')),
      month: Number(get('month')) - 1,
      day: Number(get('day')),
      hh: get('hour'),
      mm: get('minute'),
      ss: get('second'),
    };
  }, [now, timeZone, locale]);

  const { year, month, day } = parts;
  // Calendar maths runs on UTC dates so it never depends on the system zone.
  const current = year * 12 + month;
  const index = view ?? current;
  const shown = new Date(Date.UTC(Math.floor(index / 12), index % 12, 1));
  const shownYear = shown.getUTCFullYear();
  const shownMonth = shown.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(shownYear, shownMonth + 1, 0)).getUTCDate();
  const lead = (shown.getUTCDay() - weekStart + 7) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);

  const monthName = (m: number) =>
    new Date(Date.UTC(2024, m, 1)).toLocaleDateString(locale, { month: 'long', timeZone: 'UTC' });
  const monthYear = (m: number, y: number) => cap(t('clock.monthYear', { month: monthName(m), year: y }));
  // 7 Jan 2024 was a Sunday.
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(2024, 0, 7 + ((weekStart + i) % 7)));
    return {
      short: d.toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' }),
      long: d.toLocaleDateString(locale, { weekday: 'long', timeZone: 'UTC' }),
    };
  });

  const here = offsetMinutes(timeZone, now);
  const there = offsetMinutes(profile.timeZone, now);
  const diff = there - here;
  const zoneName = (() => {
    try {
      return (
        new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: 'long' })
          .formatToParts(now)
          .find((p) => p.type === 'timeZoneName')?.value ?? ''
      );
    } catch {
      return '';
    }
  })();
  const myTime = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: profile.timeZone });
  const firstName = profile.shortName.split(' ')[0];
  const country = countryName(place, lang);

  return (
    <div className="clockpanel" role="dialog" aria-label={t('clock.dialog')}>
      <p className="clockpanel-time" aria-live="off">
        {parts.hh}:{parts.mm}
        <span>:{parts.ss}</span>
      </p>
      <p className="clockpanel-date">
        {cap(t('clock.date', { weekday: parts.weekday, day, month: monthName(month), year }))}
      </p>
      <p className="clockpanel-place">
        <span className="dot" />
        {cityLabel(place, t, lang)}
        {country ? `, ${country}` : ''}
      </p>
      <p className="clockpanel-zone">
        {[zoneName, offsetLabel(here), timeZone].filter((v, i, a) => v && a.indexOf(v) === i).join(' · ')}
      </p>

      <div className="cal">
        <div className="cal-head">
          <strong>{monthYear(shownMonth, shownYear)}</strong>
          <button type="button" className="cal-today" onClick={() => setView(null)} disabled={index === current}>
            {t('clock.today')}
          </button>
          <button type="button" className="cal-nav" aria-label={t('clock.prevMonth')} onClick={() => setView(index - 1)}>
            <Icon name="arrowLeft" size={14} />
          </button>
          <button type="button" className="cal-nav" aria-label={t('clock.nextMonth')} onClick={() => setView(index + 1)}>
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
        <div className="cal-grid" role="table" aria-label={monthYear(shownMonth, shownYear)}>
          <div className="cal-row" role="row">
            {weekdays.map((w) => (
              <span key={w.long} className="cal-dow" role="columnheader" aria-label={w.long}>
                {cap(w.short.slice(0, 2))}
              </span>
            ))}
          </div>
          {Array.from({ length: cells.length / 7 }, (_, week) => (
            <div key={week} className="cal-row" role="row">
              {cells.slice(week * 7, week * 7 + 7).map((d, i) => {
                const today = d !== null && index === current && d === day;
                return (
                  <span key={i} role="cell" className={`cal-day${today ? ' is-today' : ''}`} aria-current={today ? 'date' : undefined}>
                    {d}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="clockpanel-me">
        {diff === 0
          ? t('clock.same', { name: firstName, place: profile.location })
          : t(diff > 0 ? 'clock.ahead' : 'clock.behind', {
              name: firstName,
              place: profile.location,
              time: myTime,
              diff: durationLabel(Math.abs(diff)),
            })}
      </p>
    </div>
  );
}
