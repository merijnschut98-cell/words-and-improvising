// An optional 4-week programme: one theme per week, a baseline round at the
// start and a re-take in week 4 to see the difference. Pure.
import { makePrompt } from './lesson.js';
import { dayKey } from './progress.js';

export const PROGRAMME = [
  { id: 'clarity', drills: ['frame', 'explain', 'prep'] },
  { id: 'rapport', drills: ['followUp', 'smalltalk', 'yesAnd'] },
  { id: 'captain', drills: ['real', 'debate', 'pause'] },
  { id: 'pressure', drills: ['pressure', 'rapid', 'listen'] },
];
const WEEKS = PROGRAMME.length;

const toUTC = (day) => { const [y, m, d] = day.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const daysSince = (from, to) => Math.round((toUTC(to) - toUTC(from)) / 86400000);

export function startProgramme(state, today, content, lang, rng) {
  const p = makePrompt('minute', content, rng, state.seen || {});
  return { ...state, programme: { start: today, baseline: { drill: p.drill, promptId: p.id, lang } } };
}

export const stopProgramme = (state) => ({ ...state, programme: null });

// 1..4 while it runs; null when not started or finished.
export function programmeWeek(state, today) {
  const p = state.programme;
  if (!p || !p.start) return null;
  const n = daysSince(p.start, today);
  if (n < 0 || n >= WEEKS * 7) return null;
  return Math.floor(n / 7) + 1;
}

export function programmeFocus(state, today) {
  const w = programmeWeek(state, today);
  return w ? PROGRAMME[w - 1].drills[0] : null;
}

// Week 4: re-take the baseline round, once.
// His first attempt at the baseline since the start: the "before" for the week-4 re-take.
export function baselineEntry(state) {
  const p = state.programme;
  if (!p || !p.baseline) return null;
  const from = toUTC(p.start);
  const hits = (state.history || []).filter((e) => !e.shadow && e.promptId === p.baseline.promptId
    && e.lang === p.baseline.lang && toUTC(dayKey(new Date(e.ts))) >= from);
  return hits.length ? hits[hits.length - 1] : null;
}

export function baselineDue(state, today) {
  if (programmeWeek(state, today) !== WEEKS) return false;
  const p = state.programme;
  const week4 = toUTC(p.start) + (WEEKS - 1) * 7 * 86400000;
  return !(state.history || []).some((e) => !e.shadow && e.promptId === p.baseline.promptId && e.lang === p.baseline.lang
    && toUTC(dayKey(new Date(e.ts))) >= week4);
}
