// "One next thing": the single round the home screen recommends now, with
// the reason. Stable for the whole day. Pure.
import { DRILLS } from './progress.js';
import { makePrompt, seededRng, weakestDrill } from './lesson.js';
import { dueReviews } from './spaced.js';
import { weekFocus } from './weekly.js';
import { ownedDrills, maintenanceDrill } from './mastery.js';
import { upcoming, rehearsalPrompts } from './realweek.js';
import { baselineDue } from './programme.js';
import { challengePrompt } from './share.js';
import { dayKey } from './progress.js';
import { courseTodayPick } from './course.js';

function seedOf(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

const daysUntil = (from, to) => {
  const [a, b] = [from, to].map((d) => { const [y, m, dd] = d.split('-').map(Number); return Date.UTC(y, m - 1, dd); });
  return Math.round((b - a) / 86400000);
};

export function todayPick(state, today, content, lang, now = Date.now()) {
  const rng = seededRng(seedOf(`${today}|${lang}`));
  const seen = state.seen || {};
  // 1. A real moment within two days: rehearse it.
  const ev = upcoming(state.events || [], today).find((e) => daysUntil(today, e.date) <= 2);
  if (ev) return { reason: 'event', event: ev, prompt: rehearsalPrompts(ev, lang)[0] };
  // 1b. Programme week 4: re-take the baseline round.
  if (baselineDue(state, today) && state.programme.baseline.lang === lang) {
    const b = state.programme.baseline;
    const p = challengePrompt({ drill: b.drill, promptId: b.promptId }, content);
    if (p) return { reason: 'baseline', prompt: p };
  }
  // 2. A spaced re-attempt that is due.
  const due = dueReviews(state.reviews, today, content, lang)[0];
  if (due) return { reason: 'review', prompt: due };
  // 3. His focus for the week.
  const focus = weekFocus(state, new Date(now));
  if (focus) return { reason: 'focus', prompt: makePrompt(focus, content, rng, seen) };
  // 3b. Once a week, an owned drill to keep it sharp.
  const keep = maintenanceDrill(state.history || [], now);
  if (keep) return { reason: 'maintain', prompt: makePrompt(keep, content, rng, seen) };
  // 4. The weakest drill lately (not one he already owns).
  const weak = weakestDrill(state.history || [], ownedDrills(state.history || [], now));
  if (weak) return { reason: 'weak', prompt: makePrompt(weak, content, rng, seen) };
  // 5. The drill he played least recently (never played first, in a daily order).
  const order = DRILLS.map((d) => [d, rng()]).sort((a, b) => a[1] - b[1]).map(([d]) => d);
  const last = (d) => { const i = (state.history || []).findIndex((e) => e.drill === d); return i === -1 ? Infinity : i; };
  const fresh = order.sort((a, b) => last(b) - last(a))[0];
  return { reason: 'fresh', prompt: makePrompt(fresh, content, rng, seen) };
}

// The start screen: ui.subject absent or 'start' means the overview.
export const SUBJECTS = ['speak', 'eng', 'pm'];
export const homeSubject = (ui) => (ui && SUBJECTS.includes(ui.subject) ? ui.subject : 'start');

// The speaking home, top to bottom: the Today card, one secondary card (the
// daily lesson), then a single "More practice" disclosure with these groups.
export const HOME_SECTIONS = ['today', 'secondary', 'more'];
export const MORE_GROUPS = [
  { id: 'drills', items: ['quick', 'drills'] },
  { id: 'again', items: ['reviews', 'boss', 'targeted'] },
  { id: 'real', items: ['realweek', 'conversation', 'finder'] },
  { id: 'plan', items: ['quests', 'programme'] },
];

const practisedToday = (state, subject, today) => (subject === 'speak'
  ? (state.history || []).some((e) => dayKey(new Date(e.ts)) === today)
  : ((((state.courses || {})[subject]) || {}).sessions || []).some((x) => x.day === today));

// One compact card per subject: its next step, the reason, whether it was
// practised today, and one suggestion (the first subject not done today).
export function startCards(state, today, content, lang, now = Date.now()) {
  const cards = SUBJECTS.map((subject) => {
    const done = practisedToday(state, subject, today);
    if (subject === 'speak') {
      const p = todayPick(state, today, content, lang, now);
      return { subject, reason: p.reason, drill: p.prompt.drill, eventText: p.event ? p.event.text : '', done };
    }
    return { subject, ...courseTodayPick(state, subject, lang, today), done };
  });
  const pick = Math.max(0, cards.findIndex((c) => !c.done));
  return cards.map((c, i) => ({ ...c, suggested: i === pick }));
}
