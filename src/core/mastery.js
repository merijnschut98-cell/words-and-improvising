// Mastery per drill: learn → practise → own. Owning a drill takes nothing
// away; the adaptive picker just spends effort elsewhere. Pure.
import { DRILLS, dayKey } from './progress.js';

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
