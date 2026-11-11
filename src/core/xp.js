// XP per day and the daily goal (v16 flair). Pure, and imports nothing from
// the course or speaking engines, so every place that earns XP can use it
// without an import cycle. flair.js re-exports all of it.
import { dayKey } from './progress.js';

export const XP_DAYS_KEEP = 60;

const shift = (day, n) => {
  const [y, m, d] = day.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
};

// Adds XP to the total and to today's count; keeps the last 60 days.
export function creditXp(state, xp, today) {
  if (!xp) return state;
  const oldest = shift(today, -(XP_DAYS_KEEP - 1));
  const days = Object.fromEntries(Object.entries(state.xpDays || {}).filter(([d]) => d >= oldest));
  return { ...state, xp: (state.xp || 0) + xp, xpDays: { ...days, [today]: (days[today] || 0) + xp } };
}
