// Weekly reset: once per ISO week he chooses what the lesson leads with
// (autonomy), or keeps it adaptive. Pure.
import { isoWeekKey } from './boss.js';
import { weakestDrill } from './lesson.js';
import { programmeFocus } from './programme.js';
import { ownedDrills } from './mastery.js';
import { dayKey } from './progress.js';

// Only players with history from an earlier week get asked.
export function needsWeeklyReset(state, now = new Date()) {
  const week = isoWeekKey(now);
  if (state.weekly && state.weekly.week === week) return false;
  return (state.history || []).some((e) => e.ts && isoWeekKey(new Date(e.ts)) !== week);
}

// Three distinct options: his weakest drill lately, then frames and real life.
export function weekSuggestions(state, now = new Date()) {
  const out = [];
  for (const d of [weakestDrill(state.history || [], ownedDrills(state.history || [], now.getTime())), 'frame', 'real', 'followUp', 'debate']) {
    if (d && !out.includes(d)) out.push(d);
    if (out.length === 3) break;
  }
  return out;
}

export const chooseFocus = (state, now, drill) => ({ ...state, weekly: { week: isoWeekKey(now), focus: drill || 'adaptive' } });

// His own choice for the week wins; otherwise the programme's theme, if running.
export function weekFocus(state, now = new Date()) {
  const w = state.weekly;
  // 'adaptive' means he chose no focus this week, also over the programme.
  if (w && w.week === isoWeekKey(now) && w.focus) return w.focus === 'adaptive' ? null : w.focus;
  return programmeFocus(state, dayKey(now));
}
