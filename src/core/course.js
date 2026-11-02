// Course engine: quiz flow, judging answers, lesson progress, and how course
// work feeds the shared XP, days and streak. Pure.
import { updateStreak, reconcileStreak, dayKey } from './progress.js';
import { isoWeekKey } from './boss.js';
import { scheduleCourseReview, dueCourseQuestions, maintenanceQuestion } from './coursereview.js';
import { lessonOf, MODULES, TRACKS } from '../content/courses/index.js';

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

// Mastery per module: learn → practise (every lesson passed) → own (every
// recall question owned in this language).
export function moduleMastery(state, meta, lang) {
  const lessons = (((state.courses || {})[meta.subject]) || { lessons: {} }).lessons;
  if (!meta.lessons.every((id) => lessons[id] && lessons[id].passed)) return 'learn';
  const reviews = state.courseReviews || {};
  const owned = meta.lessons.every((id) => Array.from({ length: (meta.questions || {})[id] || 0 },
    (_, i) => ((reviews[`${lang}|${id}#r${i}`] || {}).box || 0) >= 4).every(Boolean));
  return owned ? 'own' : 'practise';
}

const passedIn = (state, subject) => (((state.courses || {})[subject]) || { lessons: {} }).lessons;

export function nextLesson(state, meta) {
  const lessons = passedIn(state, meta.subject);
  return meta.lessons.find((id) => !(lessons[id] && lessons[id].passed)) || null;
}

// A module he started first; otherwise the lowest level across tracks, in
// index order. Null when every lesson of the subject is passed.
export function recommendedModule(state, subject, modules = MODULES) {
  const open = modules.filter((m) => m.subject === subject && nextLesson(state, m));
  const lessons = passedIn(state, subject);
  const started = open.find((m) => m.lessons.some((id) => lessons[id] && lessons[id].passed));
  if (started) return started.id;
  const first = [...open].sort((a, b) => a.level - b.level || modules.indexOf(a) - modules.indexOf(b))[0];
  return first ? first.id : null;
}

// One next thing per course, deterministic for a state and day.
export function courseTodayPick(state, subject, lang, today, modules = MODULES) {
  const reviews = state.courseReviews || {};
  const due = dueCourseQuestions(reviews, today, subject, lang).length;
  if (due >= 5) return { reason: 'due', count: due };
  const rec = recommendedModule(state, subject, modules);
  if (rec) return { reason: 'lesson', moduleId: rec, lessonId: nextLesson(state, modules.find((m) => m.id === rec)) };
  const lessons = passedIn(state, subject);
  const all = modules.filter((m) => m.subject === subject).flatMap((m) => m.lessons.map((lessonId) => ({ moduleId: m.id, lessonId })));
  const done = all.filter((x) => lessons[x.lessonId] && lessons[x.lessonId].passed);
  const sit = done.find((x) => !lessons[x.lessonId].situation);
  if (sit) return { reason: 'situation', ...sit };
  const say = done.find((x) => !lessons[x.lessonId].sayIt);
  if (say) return { reason: 'sayIt', ...say };
  if (due) return { reason: 'due', count: due };
  const last = (((state.courses || {})[subject]) || {}).lastMaintenance || null;
  const keep = maintenanceQuestion(reviews, today, subject, lang, last);
  if (keep) return { reason: 'maintain', questionId: keep };
  return { reason: 'done' };
}

// Every term of the loaded modules, with where it came from, A–Z.
export function glossary(modules) {
  return (modules || []).flatMap((m) => (m.lessons || []).flatMap((l) => (l.terms || []).map((x) => ({ term: x.term, def: x.def, lessonId: l.id, moduleId: m.id }))))
    .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }));
}

// The steps of a lesson; a lesson without prequestions starts reading.
export const lessonPhases = (lesson) => [...((lesson.pre || []).length ? ['pre'] : []), 'teach', 'example', 'quiz'];

// Recall questions with their stable ids: '<lessonId>#r<n>'.
export const recallQuestions = (lesson) => (lesson.recall || []).map((q, i) => ({ ...q, id: `${lesson.id}#r${i}` }));

export function questionById(modules, questionId) {
  const [lessonId, tag] = String(questionId).split('#');
  const n = Number((tag || '').slice(1));
  for (const m of modules || []) {
    const l = (m.lessons || []).find((x) => x.id === lessonId);
    if (l && tag && tag[0] === 'r' && Number.isInteger(n) && l.recall && l.recall[n]) return { ...l.recall[n], id: questionId };
  }
  return null;
}

// Progress per course: owned modules per track, due now, sessions per day for
// the last 14 days (today last), and the latest situations.
export function courseSummary(state, subject, lang, today, modules = MODULES) {
  const mods = modules.filter((m) => m.subject === subject);
  const tracks = (TRACKS[subject] || []).map((track) => {
    const inTrack = mods.filter((m) => m.track === track);
    return { track, owned: inTrack.filter((m) => moduleMastery(state, m, lang) === 'own').length, total: inTrack.length };
  });
  const sessions = (((state.courses || {})[subject]) || {}).sessions || [];
  const [y, m, d] = today.split('-').map(Number);
  const strip = Array.from({ length: 14 }, (_, i) => {
    const key = dayKey(new Date(y, m - 1, d - 13 + i));
    return sessions.filter((x) => x.day === key).length;
  });
  const situations = sessions.filter((x) => x.kind === 'situation').slice(0, 5).map((x) => ({ lessonId: x.lessonId, pts: x.correct, ts: x.ts }));
  return { tracks, due: dueCourseQuestions(state.courseReviews || {}, today, subject, lang).length, strip, situations };
}
