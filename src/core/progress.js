// XP, levels, streaks and difficulty. Pure functions.

export const DRILLS = ['minute', 'explain', 'prep', 'bridge', 'smalltalk', 'rapid', 'story', 'pause'];
const PREP_S = [15, 10, 6, 3, 0];
const ANSWER_S = [30, 45, 60, 75, 90];
const TWIST_EVERY_S = [20, 16, 13, 11, 9];

const pad = (n) => String(n).padStart(2, '0');

export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function daysBetween(a, b) {
  const [ya, ma, da] = a.split('-').map(Number);
  const [yb, mb, db] = b.split('-').map(Number);
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86400000);
}

export function updateStreak(streak, today) {
  if (!streak.lastDay) return { count: 1, lastDay: today };
  const gap = daysBetween(streak.lastDay, today);
  if (gap <= 0) return streak;
  return { count: gap === 1 ? streak.count + 1 : 1, lastDay: today };
}

export function isStreakAlive(streak, today) {
  return !!streak.lastDay && daysBetween(streak.lastDay, today) <= 1;
}

export function xpForRound({ metrics, durationS, targetS, rating, drill }) {
  if (!metrics || metrics.words < 5) return 0;
  let xp = 10 + Math.min(10, Math.round((10 * durationS) / (targetS || 1)));
  if (metrics.fillerRate < 3) xp += 5;
  if (rating >= 4) xp += 5;
  if (drill === 'pause' && (metrics.pauses || 0) >= 3 && metrics.fillerRate < 1) xp += 5;
  return xp;
}

export function levelFromXp(xp) {
  let level = 1;
  let rest = xp;
  while (rest >= 100 * level) {
    rest -= 100 * level;
    level += 1;
  }
  return { level, into: rest, needed: 100 * level };
}

export function adjustDrillLevel(level, rating) {
  const next = rating >= 4 ? level + 1 : rating <= 2 ? level - 1 : level;
  return Math.max(1, Math.min(5, next));
}

export function drillTiming(drill, level) {
  if (drill === 'rapid') return { prepS: 0, answerS: 10, questions: 5 };
  const i = Math.max(1, Math.min(5, level || 1)) - 1;
  return { prepS: PREP_S[i], answerS: ANSWER_S[i], questions: 1 };
}

// Story Chain: seconds between twists at a drill level.
export function twistEvery(level) {
  return TWIST_EVERY_S[Math.max(1, Math.min(5, level || 1)) - 1];
}
