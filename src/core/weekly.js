// Weekly reset: once per ISO week he chooses what the lesson leads with
// (autonomy), or keeps it adaptive. Pure.
import { isoWeekKey } from './boss.js';
import { weakestDrill } from './lesson.js';
import { programmeFocus } from './programme.js';
import { dayKey } from './progress.js';

// Only players with history from an earlier week get asked.
export function needsWeeklyReset(state, now = new Date()) {
  const week = isoWeekKey(now);
  if (state.weekly && state.weekly.week === week) return false;
  return (state.history || []).some((e) => e.ts && isoWeekKey(new Date(e.ts)) !== week);
}

// Three distinct options: his weakest drill lately, then frames and real life.
export function weekSuggestions(state) {
  const out = [];
  for (const d of [weakestDrill(state.history || []), 'frame', 'real', 'followUp', 'debate']) {
    if (d && !out.includes(d)) out.push(d);
    if (out.length === 3) break;
  }
  return out;
}

export const chooseFocus = (state, now, drill) => ({ ...state, weekly: { week: isoWeekKey(now), focus: drill || null } });

// His own choice for the week wins; otherwise the programme's theme, if running.
export function weekFocus(state, now = new Date()) {
  const w = state.weekly;
  if (w && w.week === isoWeekKey(now) && w.focus) return w.focus;
  return programmeFocus(state, dayKey(now));
}
