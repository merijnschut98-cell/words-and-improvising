// The module check (Modulecheck, v16 flair): ten recall questions from the
// whole module, one pass, no hints. Opens with bronze, once a day per module.
// Done without a mistake (with silver) it gives the gold medal. Pure.
import { countRound, recallQuestions } from './course.js';
import { scheduleCourseReview } from './coursereview.js';
import { seededRng } from './lesson.js';
import { medalFor, storedMedal, awardFlair, goalJustReached } from './flair.js';
import { lessonOf } from '../content/courses/index.js';

export const CHECK_SIZE = 10;
const CHECK_XP = 20;
const CHECK_PERFECT_XP = 10;
const SESSIONS_CAP = 200;

const courseOf = (state, subject) => ((state && state.courses) || {})[subject] || {};
export const checkOf = (state, subject, moduleId) => (courseOf(state, subject).checks || {})[moduleId] || null;

// Open once the module has bronze (stored or by the rules), not twice a day.
export function checkOpen(state, meta, today) {
  if (!storedMedal(state, meta.subject, meta.id) && !medalFor(state, meta)) return false;
  const c = checkOf(state, meta.subject, meta.id);
  return !(c && c.last === today);
}

function seedOf(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}
function shuffled(list, rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Seeded by day and module (a reopen the same day asks the same set); one
// question per level before any level gets a second.
export function checkQuestions(mod, meta, day, n = CHECK_SIZE) {
  const rng = seededRng(seedOf(`${day}|${meta.id}`));
  const byId = new Map(((mod && mod.lessons) || []).map((l) => [l.id, l]));
  const pools = shuffled(meta.lessons, rng).map((id) => (byId.has(id) ? shuffled(recallQuestions(byId.get(id)), rng) : [])).filter((p) => p.length);
  const out = [];
  for (let round = 0; out.length < n && pools.some((p) => p.length > round); round++) {
    for (const p of pools) if (out.length < n && p[round]) out.push(p[round]);
  }
  return out;
}

// A finished check: a round for the day (days, streak); 20 XP the first time,
// +10 the first time it is perfect; answers scheduled like a due session.
export function applyCheck(state, { subject, moduleId, results, lang }, today, now) {
  const entries = Object.entries(results || {});
  const correct = entries.filter(([, ok]) => ok).length;
  const perfect = entries.length > 0 && correct === entries.length;
  const prev = checkOf(state, subject, moduleId);
  const xp = (prev ? 0 : CHECK_XP) + (perfect && !(prev && prev.perfect) ? CHECK_PERFECT_XP : 0);
  let next = countRound(state, today, xp);
  let reviews = next.courseReviews || {};
  for (const [questionId, ok] of entries) {
    // Spacing: a right answer before the question is due never climbs a box.
    const cur = reviews[`${lang}|${questionId}`];
    if (ok && cur && cur.due > today) continue;
    reviews = scheduleCourseReview(reviews, { questionId, lessonId: lessonOf(questionId), subject, lang }, today, ok, true);
  }
  next = { ...next, courseReviews: reviews };
  const better = !prev || correct >= (prev.best || 0);
  const record = {
    last: today,
    best: better ? correct : prev.best,
    total: better ? entries.length : prev.total,
    perfect: (prev && prev.perfect) || (perfect ? now : null),
  };
  const courses = next.courses || {};
  const c = courses[subject] || { lessons: {}, sessions: [] };
  next = { ...next, courses: { ...courses, [subject]: {
    ...c,
    checks: { ...(c.checks || {}), [moduleId]: record },
    sessions: [{ day: today, kind: 'check', moduleId, correct, total: entries.length, ts: now }, ...(c.sessions || [])].slice(0, SESSIONS_CAP),
  } } };
  const won = awardFlair(next, now);
  return { state: won.state, xp, correct, total: entries.length, perfect, medals: won.medals, speakMedals: won.speakMedals, titles: won.titles, goalReached: goalJustReached(state, won.state, today) };
}
