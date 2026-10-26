// Journey milestones: named points on one path, based on totals. Some
// unlock a colour theme. Nothing is ever gated behind them. Pure.
import { daysPractised, DRILLS } from './progress.js';

export const THEMES = ['default', 'ocean', 'forest', 'night'];

const rounds = (s) => s.history.length;
const drillsAt3 = (s) => DRILLS.filter((d) => (s.drillLevels[d] || 1) >= 3).length;

export const MILESTONES = [
  { id: 'firstWords', test: (s) => rounds(s) >= 1 },
  { id: 'threeDays', test: (s) => daysPractised(s) >= 3 },
  { id: 'cleanRun30', test: (s) => s.history.some((e) => (e.cleanRun || 0) >= 30) },
  { id: 'weekOne', test: (s) => daysPractised(s) >= 7, unlocks: 'ocean' },
  { id: 'explorer', test: (s) => DRILLS.every((d) => s.history.some((e) => e.drill === d)) },
  { id: 'cleanMinute', test: (s) => s.history.some((e) => e.durationS >= 55 && e.metrics.words >= 60 && e.metrics.fillerCount === 0) },
  { id: 'bossBeaten', test: (s) => s.history.some((e) => e.drill === 'boss') },
  { id: 'rounds25', test: (s) => rounds(s) >= 25 },
  { id: 'twoWeeks', test: (s) => daysPractised(s) >= 14 },
  { id: 'captainsVoice', test: (s) => s.history.filter((e) => e.drill === 'debate' || e.drill === 'boss').length >= 5, unlocks: 'forest' },
  { id: 'monthOfWords', test: (s) => daysPractised(s) >= 30 },
  { id: 'tableTopics', test: (s) => rounds(s) >= 50 && drillsAt3(s) >= 3, unlocks: 'night' },
];

// Milestones reached now but not yet recorded, in journey order.
export function newMilestones(state) {
  const have = new Set(state.milestones || []);
  return MILESTONES.filter((m) => !have.has(m.id) && m.test(state)).map((m) => m.id);
}

export function unlockedThemes(reached) {
  const have = new Set(reached || []);
  return ['default', ...MILESTONES.filter((m) => m.unlocks && have.has(m.id)).map((m) => m.unlocks)];
}
