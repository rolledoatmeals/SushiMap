import type { WeeklyHours, DayHours, Restaurant } from '../types';

const DAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

type DayKey = (typeof DAY_KEYS)[number];

export function getDayKey(date = new Date()): DayKey {
  return DAY_KEYS[date.getDay()];
}

export function getTodayHours(hours: WeeklyHours, date = new Date()): DayHours {
  return hours[getDayKey(date)];
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

// Returns an "YYYY-MM-DD" string in LOCAL time, not UTC.
// toISOString() always returns UTC, which can produce the wrong calendar date
// for US users between midnight local and the UTC offset hour (e.g. midnight–5am ET).
function localIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isOpenNow(restaurant: Restaurant, now = new Date()): boolean {
  // Bug fix: use local date for holiday key — toISOString() would return the
  // UTC date which is wrong for US users after local midnight.
  const isoDate = localIsoDate(now);
  const dayHours = restaurant.holidayHours[isoDate] ?? getTodayHours(restaurant.hours, now);

  if (dayHours.closed) return false;
  if (!dayHours.open || !dayHours.close) return false;

  const current = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(dayHours.open);
  const close = toMinutes(dayHours.close);

  // Close of "00:00" means midnight — treat as 24:00
  const closeNorm = close === 0 ? 1440 : close;

  return current >= open && current < closeNorm;
}

export function formatTime(time: string): string {
  if (!time) return '';
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr ?? '00';
  const period = hour >= 12 ? 'PM' : 'AM';
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h}:${minute} ${period}`;
}

export function formatTodayHours(restaurant: Restaurant): string {
  const now = new Date();
  // Bug fix: use local date (same fix as isOpenNow).
  const isoDate = localIsoDate(now);
  const h = restaurant.holidayHours[isoDate] ?? getTodayHours(restaurant.hours);

  if (h.closed) return 'Closed today';
  // Bug fix: guard both open and close before formatting.
  if (!h.open || !h.close) return 'Hours unavailable';
  return `${formatTime(h.open)} – ${formatTime(h.close)}`;
}

export function formatWeeklyHours(hours: WeeklyHours): Record<string, string> {
  const labels: Record<string, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };
  return Object.fromEntries(
    DAY_KEYS.map((key) => {
      const h = hours[key];
      const label = labels[key];
      // Bug fix: guard open/close presence before calling formatTime.
      const value =
        h.closed || !h.open || !h.close
          ? 'Closed'
          : `${formatTime(h.open)} – ${formatTime(h.close)}`;
      return [label, value];
    }),
  );
}
