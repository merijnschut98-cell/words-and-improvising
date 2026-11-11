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

// The daily goal in XP: one of three choices, Steady by default. Missing it
// costs nothing; XP above it still counts in the total.
export const GOALS = [20, 30, 50];
export const DEFAULT_GOAL = 30;

export const goalOf = (state) => {
  const g = state && state.dailyGoal;
  return g && GOALS.includes(g.xp) ? g.xp : DEFAULT_GOAL;
};

// Today's XP against the goal; the shown value stops at the goal.
export function goalProgress(state, today) {
  const goal = goalOf(state);
  const xp = ((state && state.xpDays) || {})[today] || 0;
  return { xp: Math.min(xp, goal), goal, done: xp >= goal };
}

// True only on the apply that takes today's XP over the goal.
export const goalJustReached = (before, after, today) => !goalProgress(before, today).done && goalProgress(after, today).done;

// He picks a goal in Settings; synced, the later choice wins.
export function setGoal(state, xp, now) {
  if (!GOALS.includes(xp)) return state;
  return { ...state, dailyGoal: { xp, ts: now } };
}
