// Course engine: quiz flow, judging answers, lesson progress, and how course
// work feeds the shared XP, days and streak. Pure.
import { updateStreak, reconcileStreak } from './progress.js';
import { isoWeekKey } from './boss.js';
import { scheduleCourseReview } from './coursereview.js';
import { lessonOf } from '../content/courses/index.js';

const LESSON_XP = 20;
const SITUATION_XP = 10;
const DUE_XP = 10;
const DUE_XP_MAX = 20;
const SESSIONS_CAP = 200;

// Numeric answers accept a Dutch decimal comma and always use the tolerance.
export function judge(question, answer) {
  if (!question) return false;
  if ('number' in question) {
    const s = String(answer ?? '').trim().replace(',', '.');
    if (!s) return false;
    const n = Number(s);
    return Number.isFinite(n) && Math.abs(n - question.number) <= question.tolerance + 1e-9;
  }
  return answer === question.answer;
}

// One pass asks every question; review shows them all; the next pass asks only
// the misses, until every question has been right once.
export function startQuiz(questions) {
  return { order: questions.map((_, i) => i), i: 0, pass: 1, answers: {}, firstTry: {}, misses: [], phase: 'ask' };
}

export function answerQuiz(state, questions, value) {
  if (state.phase !== 'ask') return state;
  const idx = state.order[state.i];
  const q = questions[idx];
  const ok = judge(q, value);
  const next = {
    ...state,
    answers: { ...state.answers, [q.id]: value },
    firstTry: state.pass === 1 ? { ...state.firstTry, [q.id]: ok } : state.firstTry,
    misses: ok ? state.misses : [...state.misses, idx],
    i: state.i + 1,
    last: { ...(state.last || {}), [q.id]: ok },
  };
  return next.i >= state.order.length ? { ...next, phase: 'review' } : next;
}

export function continueQuiz(state) {
  if (state.phase !== 'review') return state;
  if (!state.misses.length) return { ...state, phase: 'done' };
  return { ...state, order: state.misses, misses: [], i: 0, pass: state.pass + 1, last: {}, phase: 'ask' };
}

// The questions answered in the pass that just ended (for the review screen).
export const passQuestions = (state, questions) => Object.keys(state.last || {}).map((id) => questions.find((q) => q.id === id)).filter(Boolean);

function withSubject(state, subject, fn) {
  const courses = state.courses || {};
  const c = courses[subject] || { lessons: {}, sessions: [] };
  return { ...state, courses: { ...courses, [subject]: fn(c) } };
}

const logSession = (c, entry) => ({ ...c, sessions: [entry, ...(c.sessions || [])].slice(0, SESSIONS_CAP) });

// A lesson or a due session counts as a round for the day: days and streak.
function countRound(state, today, xp) {
  const s = reconcileStreak(state, today).state;
  return { ...s, xp: s.xp + xp, streak: updateStreak(s.streak, today), days: { ...s.days, [today]: (s.days[today] || 0) + 1 } };
}

export function applyLesson(state, { subject, lessonId, firstTry, lang }, today, now) {
  const before = ((state.courses || {})[subject] || { lessons: {} }).lessons[lessonId] || {};
  const xp = before.passed ? 0 : LESSON_XP;
  let next = countRound(state, today, xp);
  let reviews = next.courseReviews || {};
  for (const [questionId, ok] of Object.entries(firstTry || {})) {
    reviews = scheduleCourseReview(reviews, { questionId, lessonId, subject, lang }, today, ok);
  }
  next = { ...next, courseReviews: reviews };
  const results = Object.values(firstTry || {});
  next = withSubject(next, subject, (c) => logSession({
    ...c,
    lessons: { ...c.lessons, [lessonId]: { ...before, read: before.read || now, passed: before.passed || now } },
  }, { day: today, kind: 'lesson', lessonId, correct: results.filter(Boolean).length, total: results.length, ts: now }));
  return { state: next, xp };
}

export function applyDue(state, { subject, results, lang, maintenance = false }, today, now) {
  const entries = Object.entries(results || {});
  const correct = entries.filter(([, ok]) => ok).length;
  const xp = Math.min(DUE_XP_MAX, DUE_XP + correct);
  let next = countRound(state, today, xp);
  let reviews = next.courseReviews || {};
  for (const [questionId, ok] of entries) {
    reviews = scheduleCourseReview(reviews, { questionId, lessonId: lessonOf(questionId), subject, lang }, today, ok);
  }
  next = { ...next, courseReviews: reviews };
  const [y, m, d] = today.split('-').map(Number);
  next = withSubject(next, subject, (c) => logSession(
    maintenance ? { ...c, lastMaintenance: isoWeekKey(new Date(y, m - 1, d)) } : c,
    { day: today, kind: 'due', correct, total: entries.length, ts: now },
  ));
  return { state: next, xp };
}

// A situation is practice on top of a lesson: XP the first time, no round.
export function applySituation(state, { subject, lessonId, pts }, today, now) {
  const before = ((state.courses || {})[subject] || { lessons: {} }).lessons[lessonId] || {};
  const xp = before.situation ? 0 : SITUATION_XP;
  let next = { ...state, xp: state.xp + xp };
  next = withSubject(next, subject, (c) => logSession({
    ...c,
    lessons: { ...c.lessons, [lessonId]: { ...before, situation: { pts, ts: now } } },
  }, { day: today, kind: 'situation', lessonId, correct: pts, total: 3, ts: now }));
  return { state: next, xp };
}

export function markSayIt(state, subject, lessonId, now) {
  return withSubject(state, subject, (c) => {
    const before = c.lessons[lessonId] || {};
    return { ...c, lessons: { ...c.lessons, [lessonId]: { ...before, sayIt: now } } };
  });
}
