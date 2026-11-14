// Mastery per drill: learn → practise → own. Owning a drill takes nothing
// away; the adaptive picker just spends effort elsewhere. Pure.
import { DRILLS, dayKey } from './progress.js';
import { isoWeekKey } from './boss.js';

const DAY = 86400000;
const WINDOW_DAYS = 14;
const score = (e) => e.rating ?? (e.coach && e.coach.overall) ?? null;

export function masteryOf(history, drill, now = Date.now()) {
  const rounds = (history || []).filter((e) => e && e.drill === drill && e.metrics);
  const goodDays = new Set(rounds
    .filter((e) => now - e.ts < WINDOW_DAYS * DAY && (score(e) ?? 0) >= 4)
    .map((e) => dayKey(new Date(e.ts))));
  if (goodDays.size >= 3) return 'own';
  return rounds.length >= 3 ? 'practise' : 'learn';
}

export const ownedDrills = (history, now = Date.now()) => DRILLS.filter((d) => masteryOf(history, d, now) === 'own');

// Owned drills come back once a week to stay sharp: the one unplayed longest,
// and none at all if he already played an owned drill this ISO week.
export function maintenanceDrill(history, now = Date.now()) {
  const owned = ownedDrills(history, now);
  if (!owned.length) return null;
  const week = isoWeekKey(new Date(now));
  const last = (d) => Math.max(...(history || []).filter((e) => e && e.drill === d).map((e) => e.ts));
  if (owned.some((d) => isoWeekKey(new Date(last(d))) === week)) return null;
  return owned.slice().sort((a, b) => last(a) - last(b))[0];
}
