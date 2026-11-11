// Course engine: quiz flow, judging answers, lesson progress, and how course
// work feeds the shared XP, days and streak. Pure.
import { updateStreak, reconcileStreak, dayKey } from './progress.js';
import { isoWeekKey } from './boss.js';
import { scheduleCourseReview, dueCount, maintenanceQuestion, OWNED_BOX } from './coursereview.js';
import { lessonOf, moduleOf, MODULES, TRACKS, topicsOf, placeOf } from '../content/courses/index.js';
import { upcoming } from './realweek.js';

const LESSON_XP = 20;
const SITUATION_XP = 10;
const DUE_XP = 10;
const DUE_XP_MAX = 20;
const SESSIONS_CAP = 200;
const PREPPED_CAP = 50;
const PREP_DAYS = 2;
const PREP_MIN = 3;

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
// the misses, until every question has been right once. hints holds the
// questions he asked a hint for in this pass. sure records, on the first pass,
// whether he answered without a hint (true) or with one (false); it feeds the
// box scheduling the way "I'm guessing" used to.
export function startQuiz(questions) {
  return { order: questions.map((_, i) => i), i: 0, pass: 1, answers: {}, firstTry: {}, sure: {}, hints: {}, misses: [], phase: 'ask', prev: null };
}

// One hint for the question on screen; once only, and it can't be taken back.
export function hintQuiz(state, questions) {
  if (state.phase !== 'ask') return state;
  const id = questions[state.order[state.i]].id;
  if ((state.hints || {})[id]) return state;
  return { ...state, hints: { ...(state.hints || {}), [id]: true } };
}

export function answerQuiz(state, questions, value, sure = true) {
  if (state.phase !== 'ask') return state;
  const idx = state.order[state.i];
  const q = questions[idx];
  const ok = judge(q, value);
  const next = {
    ...state,
    answers: { ...state.answers, [q.id]: value },
    firstTry: state.pass === 1 ? { ...state.firstTry, [q.id]: ok } : state.firstTry,
    sure: state.pass === 1 ? { ...(state.sure || {}), [q.id]: sure !== false && !(state.hints || {})[q.id] } : (state.sure || {}),
    misses: ok ? state.misses : [...state.misses, idx],
    i: state.i + 1,
    last: { ...(state.last || {}), [q.id]: ok },
    prev: null,
  };
  return next.i >= state.order.length ? { ...next, phase: 'review' } : next;
}

// Take back the last answer in this pass (an accidental tap), so the
// question is asked again. Not once the review with the answers is shown.
// prev keeps what he picked (and whether it was hinted), so the screen can
// show it; the hint itself stays in hints, so it is shown again.
export function backQuiz(state, questions) {
  if (state.phase !== 'ask' || state.i === 0) return state;
  const i = state.i - 1;
  const idx = state.order[i];
  const id = questions[idx].id;
  const drop = (o) => { const c = { ...(o || {}) }; delete c[id]; return c; };
  const at = state.misses.lastIndexOf(idx);
  return {
    ...state,
    i,
    answers: drop(state.answers),
    last: drop(state.last),
    firstTry: state.pass === 1 ? drop(state.firstTry) : state.firstTry,
    sure: state.pass === 1 ? drop(state.sure) : (state.sure || {}),
    misses: at < 0 ? state.misses : state.misses.filter((_, k) => k !== at),
    prev: { id, value: (state.answers || {})[id], sure: state.pass === 1 ? (state.sure || {})[id] !== false : true },
  };
}

export function continueQuiz(state) {
  if (state.phase !== 'review') return state;
  if (!state.misses.length) return { ...state, phase: 'done' };
  return { ...state, order: state.misses, misses: [], i: 0, pass: state.pass + 1, last: {}, hints: {}, phase: 'ask' };
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

export function applyLesson(state, { subject, lessonId, firstTry, sure = {}, lang }, today, now) {
  const before = ((state.courses || {})[subject] || { lessons: {} }).lessons[lessonId] || {};
  const xp = before.passed ? 0 : LESSON_XP;
  let next = countRound(state, today, xp);
  let reviews = next.courseReviews || {};
  for (const [questionId, ok] of Object.entries(firstTry || {})) {
    // A retake before the question is due can't count as a spaced recall:
    // a miss still resets it, a hit leaves it where it is.
    const cur = reviews[`${lang}|${questionId}`];
    if (ok && cur && cur.due > today) continue;
    reviews = scheduleCourseReview(reviews, { questionId, lessonId, subject, lang }, today, ok, (sure || {})[questionId] !== false);
  }
  next = { ...next, courseReviews: reviews };
  const results = Object.values(firstTry || {});
  next = withSubject(next, subject, (c) => logSession({
    ...c,
    lessons: { ...c.lessons, [lessonId]: { ...before, read: before.read || now, passed: before.passed || now } },
  }, { day: today, kind: 'lesson', lessonId, correct: results.filter(Boolean).length, total: results.length, ts: now }));
  return { state: next, xp };
}

export function applyDue(state, { subject, results, sure = {}, lang, maintenance = false, prep = null }, today, now) {
  const entries = Object.entries(results || {});
  const correct = entries.filter(([, ok]) => ok).length;
  // A repeat refresh for the same event is practice only: no XP, no round.
  const repeat = !!prep && ((((state.courses || {})[subject] || {}).prepped) || []).includes(prep);
  const xp = repeat ? 0 : Math.min(DUE_XP_MAX, DUE_XP + correct);
  let next = repeat ? state : countRound(state, today, xp);
  let reviews = next.courseReviews || {};
  for (const [questionId, ok] of entries) {
    // Spacing: a right answer before the question is due never climbs a box.
    const cur = reviews[`${lang}|${questionId}`];
    if (ok && cur && cur.due > today) continue;
    reviews = scheduleCourseReview(reviews, { questionId, lessonId: lessonOf(questionId), subject, lang }, today, ok, (sure || {})[questionId] !== false);
  }
  next = { ...next, courseReviews: reviews };
  const [y, m, d] = today.split('-').map(Number);
  // A refresh before a real event: remembered, so it is offered once.
  const marked = (c) => (prep ? { ...c, prepped: [prep, ...(c.prepped || []).filter((x) => x !== prep)].slice(0, PREPPED_CAP) } : c);
  next = withSubject(next, subject, (c) => logSession(
    marked(maintenance ? { ...c, lastMaintenance: isoWeekKey(new Date(y, m - 1, d)) } : c),
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

// When he opens a lesson: remembered, so the course home can bring him back
// to a lesson he left before finishing (v16). Synced, latest wins.
export function markOpened(state, subject, lessonId, now) {
  return withSubject(state, subject, (c) => {
    const before = c.lessons[lessonId] || {};
    return { ...c, lessons: { ...c.lessons, [lessonId]: { ...before, opened: now } } };
  });
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

// When he last did anything with a lesson: opened, read, passed, or
// practised it (a situation or the say-it round).
const lastTouched = (p) => Math.max((p && p.opened) || 0, (p && p.read) || 0, (p && p.passed) || 0,
  (p && p.situation && p.situation.ts) || 0, (p && p.sayIt) || 0);

// The lesson touched last among ids (first in order on ties), or null.
function mostRecent(lessons, ids) {
  let recent = null;
  let at = 0;
  for (const id of ids) { const ts = lastTouched(lessons[id]); if (ts > at) { recent = id; at = ts; } }
  return recent;
}

// A lesson he opened and left before passing it, when that is the last thing
// he did in this subject: the course home brings him straight back (v16).
export function resumeLesson(state, subject, modules = MODULES) {
  const lessons = passedIn(state, subject);
  const ids = modules.filter((m) => m.subject === subject).flatMap((m) => m.lessons);
  const id = mostRecent(lessons, ids);
  if (!id || lessons[id].passed || !lessons[id].opened) return null;
  return { moduleId: moduleOf(id), lessonId: id };
}

// A lesson he opened and did not finish, when it is the last one he touched
// in the module, comes first. Then, topic modules (free access): the topic he
// touched last while it has an open level, else the first open topic in index
// order; within it, the lowest level not passed. Depth-first: one topic from
// Basis to Expert. Other modules: the first lesson not passed, in index order.
export function nextLesson(state, meta) {
  const lessons = passedIn(state, meta.subject);
  const done = (id) => !!(lessons[id] && lessons[id].passed);
  const recent = mostRecent(lessons, meta.lessons);
  if (recent && !done(recent) && lessons[recent].opened) return recent;
  const metaTopics = topicsOf(meta);
  if (metaTopics) {
    const open = (t) => t.levels.some((id) => !done(id));
    const current = recent && metaTopics.find((t) => t.levels.includes(recent));
    const topic = current && open(current) ? current : metaTopics.find(open);
    return topic ? topic.levels.find((id) => !done(id)) : null;
  }
  return meta.lessons.find((id) => !done(id)) || null;
}

// One level of a topic: todo (not passed), passed, or owned (passed and every
// recall question at the owned box in this language).
export function levelState(state, subject, lessonId, count, lang) {
  const p = passedIn(state, subject)[lessonId];
  if (!(p && p.passed)) return 'todo';
  const reviews = state.courseReviews || {};
  const owned = count > 0 && Array.from({ length: count }, (_, i) => ((reviews[`${lang}|${lessonId}#r${i}`] || {}).box || 0) >= OWNED_BOX).every(Boolean);
  return owned ? 'owned' : 'passed';
}

// A level shows once the level before it is finished (v16: a minimal app);
// the first level always, and a level he already passed stays.
export function levelVisible(levels, i, passed) {
  return i === 0 || passed(levels[i]) || passed(levels[i - 1]);
}

// The rows of a topic module for the course home: the visible levels only;
// null for other modules.
export function topicRows(state, meta, lang) {
  const metaTopics = topicsOf(meta);
  if (!metaTopics) return null;
  const lessons = passedIn(state, meta.subject);
  const passed = (id) => !!(lessons[id] && lessons[id].passed);
  return metaTopics.map((t) => {
    const levels = t.levels.map((lessonId, i) => ({ lessonId, level: i + 1, state: levelState(state, meta.subject, lessonId, (meta.questions || {})[lessonId] || 0, lang) }));
    return { id: t.id, title: t.title, passed: levels.filter((l) => l.state !== 'todo').length, levels: levels.filter((_, i) => levelVisible(t.levels, i, passed)) };
  });
}

// Lessons passed in a module, for "5/24 levels".
export function levelsDone(state, meta) {
  const lessons = passedIn(state, meta.subject);
  return { done: meta.lessons.filter((id) => lessons[id] && lessons[id].passed).length, total: meta.lessons.length };
}

// A lesson pick in a topic module says where it sits, for labels.
function placed(pick, modules) {
  const p = placeOf(pick.lessonId, modules);
  return p ? { ...pick, topicId: p.topicId, level: p.level } : pick;
}

// The started module he worked in last (a lesson opened, passed or
// practised: where he left off, v16); otherwise the lowest level across
// tracks, in index order. Null when every lesson of the subject is passed.
export function recommendedModule(state, subject, modules = MODULES) {
  const open = modules.filter((m) => m.subject === subject && nextLesson(state, m));
  const lessons = passedIn(state, subject);
  let started = null;
  let at = 0;
  for (const m of open) {
    const ts = Math.max(0, ...m.lessons.map((id) => lastTouched(lessons[id])));
    if (ts > at) { started = m; at = ts; }
  }
  if (started) return started.id;
  const first = [...open].sort((a, b) => a.level - b.level || modules.indexOf(a) - modules.indexOf(b))[0];
  return first ? first.id : null;
}

// One next thing per course, deterministic for a state and day.
export function courseTodayPick(state, subject, lang, today, modules = MODULES) {
  const reviews = state.courseReviews || {};
  // Where he left off: a lesson he opened and did not finish comes back first (v16).
  const back = resumeLesson(state, subject, modules);
  if (back) return placed({ reason: 'lesson', why: 'resume', ...back }, modules);
  // A plan follow-up is quick and time-sensitive: first.
  const plan = openPlans(state, subject, today)[0];
  if (plan) return { reason: 'apply', planId: plan.id, lessonId: plan.lessonId, moduleId: moduleOf(plan.lessonId) };
  // A real event within two days with a topic in this course: refresh it.
  const prep = prepPick(state, subject, lang, today, modules);
  if (prep) return prep;
  const due = dueCount(reviews, today, subject, lang);
  if (due >= 5) return { reason: 'due', count: due };
  const rec = recommendedModule(state, subject, modules);
  if (rec) return placed({ reason: 'lesson', moduleId: rec, lessonId: nextLesson(state, modules.find((m) => m.id === rec)) }, modules);
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

// Recall questions from passed lessons of the event's modules: lowest box
// first (owned last), then soonest due, then id. None when fewer than three.
export function prepQuestions(state, event, lang, today, max = 5, modules = MODULES) {
  const reviews = state.courseReviews || {};
  const ids = ((event && event.topics) || []).flatMap((mid) => {
    const meta = modules.find((m) => m.id === mid);
    if (!meta) return [];
    const lessons = passedIn(state, meta.subject);
    return meta.lessons.filter((id) => lessons[id] && lessons[id].passed)
      .flatMap((id) => Array.from({ length: (meta.questions || {})[id] || 0 }, (_, i) => `${id}#r${i}`));
  });
  if (ids.length < PREP_MIN) return [];
  const at = (id) => reviews[`${lang}|${id}`] || {};
  return ids.map((id) => ({ id, box: at(id).box || 0, due: at(id).due || '' }))
    .sort((a, b) => a.box - b.box || (a.due < b.due ? -1 : a.due > b.due ? 1 : a.id < b.id ? -1 : 1))
    .slice(0, max).map((x) => x.id);
}

function prepPick(state, subject, lang, today, modules) {
  const prepped = (((state.courses || {})[subject]) || {}).prepped || [];
  for (const ev of upcoming(state.events || [], today)) {
    if (shiftDay(today, PREP_DAYS) < ev.date) break;
    const topics = (ev.topics || []).filter((id) => modules.some((m) => m.id === id && m.subject === subject));
    if (!topics.length || prepped.includes(ev.id)) continue;
    const questionIds = prepQuestions(state, { ...ev, topics }, lang, today, 5, modules);
    if (questionIds.length) return { reason: 'prep', eventId: ev.id, moduleId: topics[0], questionIds, eventText: ev.text };
    // Nothing learned yet for this topic: its first lesson, for this event.
    const lessons = passedIn(state, subject);
    const fresh = topics.map((id) => modules.find((m) => m.id === id)).find((m) => !m.lessons.some((id) => lessons[id] && lessons[id].passed));
    if (fresh) return placed({ reason: 'lesson', moduleId: fresh.id, lessonId: nextLesson(state, fresh), why: 'prepLesson', eventId: ev.id }, modules);
  }
  return null;
}

// Every term of the loaded modules, with where it came from, A–Z.
export function glossary(modules) {
  return (modules || []).flatMap((m) => (m.lessons || []).flatMap((l) => (l.terms || []).map((x) => ({ term: x.term, def: x.def, ...(x.en ? { en: x.en } : {}), lessonId: l.id, moduleId: m.id }))))
    .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }));
}

// The steps of a lesson; a lesson without prequestions starts reading.
// A lesson with a film (v14b): the film replaces the reading. The films show
// the worked example too, so a film lesson skips Voorbeeld (v16): Raden · Film
// · Check. Without a film: Raden · Lezen · Voorbeeld · Check.
export const lessonPhases = (lesson) => [...((lesson.pre || []).length ? ['pre'] : []), ...(lesson.film ? ['film'] : ['teach', 'example']), 'quiz'];

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
  return { tracks, due: dueCount(state.courseReviews || {}, today, subject, lang), strip, situations };
}

// The step indicator at the top of a lesson: Guess · Read · Example · Check.
const STEP_OF = { pre: 'guess', teach: 'read', film: 'film', example: 'example', quiz: 'check' };
export function lessonSteps(phases, current) {
  const at = current === 'done' ? phases.length : phases.indexOf(current);
  return phases.map((p, i) => ({ id: STEP_OF[p], state: i < at ? 'done' : i === at ? 'current' : 'todo' }));
}

const withUnit = (q, v) => (q.unit ? `${v} ${q.unit}` : String(v));

// The guesses from the start of a lesson, each next to the right answer and
// why: the gap between guess and answer is what makes the lesson stick.
export function guessFeedback(lesson, guesses) {
  return (lesson.pre || []).flatMap((q, i) => {
    const g = guesses[i];
    if (g == null) return [];
    const num = 'number' in q;
    return [{ q: q.q, guess: num ? withUnit(q, g) : g, answer: num ? withUnit(q, q.number) : q.answer, ok: judge(q, g), why: q.why }];
  });
}

// One step back in a lesson: previous guess, read block, example or check.
// Null when there is nothing before.
export function lessonBack({ p, block, pre }, phases, lesson) {
  const here = phases[p];
  if (here === 'pre' && pre > 0) return { p, block: 0, pre: pre - 1 };
  if (here === 'teach' && block > 0) return { p, block: block - 1, pre };
  if (p === 0) return null;
  const prev = phases[p - 1];
  if (prev === 'teach') return { p: p - 1, block: lesson.teach.length - 1, pre };
  if (prev === 'pre') return { p: p - 1, block: 0, pre: Math.max(0, (lesson.pre || []).length - 1) };
  return { p: p - 1, block: 0, pre };
}

// "Use it this week": an if-then plan at the end of a lesson, and one
// check-back on a working day at least two days later. No XP, no round.
const PLAN_MAX = 160;
const PLANS_CAP = 50;
const PLAN_STALE_DAYS = 14;
export const PLAN_USED = ['yes', 'partly', 'no'];
const collapse = (s, max) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, max);

function shiftDay(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}
const weekday = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d).getDay(); };
const dayStart = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };

// The next working day (Mon–Fri) at least two days after today.
export function planDue(today) {
  let d = shiftDay(today, 2);
  while (weekday(d) === 0 || weekday(d) === 6) d = shiftDay(d, 1);
  return d;
}

const plansOf = (state, subject) => ((((state.courses || {})[subject]) || {}).plans || []);
const withPlans = (state, subject, fn) => withSubject(state, subject, (c) => ({ ...c, plans: fn(c.plans || []) }));

export function addPlan(state, { subject, lessonId, text }, today, id) {
  const clean = collapse(text, PLAN_MAX);
  if (!clean || !lessonId || !id) return state;
  const plan = { id, lessonId, text: clean, day: today, due: planDue(today), asked: 0, outcome: null };
  return withPlans(state, subject, (list) => [plan, ...list.filter((p) => p.outcome || p.lessonId !== lessonId)].slice(0, PLANS_CAP));
}

// While he types on the lesson-done card: a draft on this device (ui, never
// synced). It becomes one plan when he leaves, or on the next start.
export function savePlanDraft(state, { subject, lessonId, text }) {
  const { planDraft, ...ui } = state.ui || {};
  const clean = collapse(text, PLAN_MAX);
  if (!clean || !lessonId || !subject) return { ...state, ui };
  return { ...state, ui: { ...ui, planDraft: { subject, lessonId, text: clean } } };
}

export const newPlanId = (now = Date.now(), r = Math.random()) => `p${now.toString(36)}${Math.floor(r * 1296).toString(36)}`;

export function commitPlanDraft(state, today, id) {
  const d = (state.ui || {}).planDraft;
  if (!d) return state;
  const { planDraft, ...ui } = state.ui;
  return addPlan({ ...state, ui }, d, today, id);
}

export function answerPlan(state, { subject, id, used, note }, now) {
  if (!PLAN_USED.includes(used) || !plansOf(state, subject).some((p) => p.id === id)) return state;
  return withPlans(state, subject, (list) => list.map((p) => (p.id === id ? { ...p, outcome: { used, note: collapse(note, PLAN_MAX), ts: now } } : p)));
}

// "Ask me later": two days on; the second time it expires, so it never nags a third time.
export function skipPlan(state, { subject, id }, today, now = dayStart(today)) {
  if (!plansOf(state, subject).some((p) => p.id === id && !p.outcome)) return state;
  return withPlans(state, subject, (list) => list.map((p) => {
    if (p.id !== id) return p;
    const asked = (p.asked || 0) + 1;
    return asked >= 2 ? { ...p, asked: 2, outcome: { used: 'no', note: '', ts: now, expired: true } } : { ...p, asked, due: shiftDay(today, 2) };
  }));
}

// Due, unanswered, and not left for more than two weeks; oldest due first.
export function openPlans(state, subject, today) {
  const oldest = shiftDay(today, -PLAN_STALE_DAYS);
  return plansOf(state, subject).filter((p) => !p.outcome && p.due <= today && p.due >= oldest)
    .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.id < b.id ? -1 : 1));
}

// Plans made since a day and how many were used (yes or partly). Information only.
export function planStats(state, subject, since) {
  const made = plansOf(state, subject).filter((p) => p.day >= since);
  return { made: made.length, used: made.filter((p) => p.outcome && p.outcome.used !== 'no').length };
}

// The recall question asked after a plan: the lowest box of the lesson, first on ties.
export function applyQuestionId(reviews, lang, lessonId, count) {
  let best = null;
  for (let i = 0; i < (count || 0); i++) {
    const box = ((reviews || {})[`${lang}|${lessonId}#r${i}`] || {}).box || 0;
    if (!best || box < best.box) best = { id: `${lessonId}#r${i}`, box };
  }
  return best ? best.id : null;
}

// Recall right after the real experience: scheduled like a due question, but
// no XP, no round and no session. A hit before it is due does not climb.
export function applyRecall(state, { subject, results, sure = {}, lang }, today) {
  let reviews = state.courseReviews || {};
  for (const [questionId, ok] of Object.entries(results || {})) {
    const cur = reviews[`${lang}|${questionId}`];
    if (ok && cur && cur.due > today) continue;
    reviews = scheduleCourseReview(reviews, { questionId, lessonId: lessonOf(questionId), subject, lang }, today, ok, (sure || {})[questionId] !== false);
  }
  return { state: { ...state, courseReviews: reviews }, xp: 0 };
}

// Learning text in paragraphs: a blank line in the content starts a new one.
export function paragraphs(text) {
  return String(text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

// Terms in a paragraph of learning text, so a tap can show what they mean:
// segments [{ text } | { text, term, def }]. First whole-word use of each term
// only, longest term first, ignoring case. Joining the texts gives the input.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function linkTerms(text, terms) {
  const src = String(text ?? '');
  if (!src) return [];
  const list = (terms || []).filter((x) => x && x.term && x.term.trim()).sort((a, b) => b.term.length - a.term.length);
  if (!list.length) return [{ text: src }];
  // A plural or simple inflection also counts: micro-stops, laserscanners, gekoppelde.
  const re = new RegExp(`(?<![\\p{L}\\p{N}])((?:${list.map((x) => escapeRe(x.term.trim())).join('|')})(?:s|es|en|e|n|’s)?)(?![\\p{L}\\p{N}])`, 'giu');
  const byKey = new Map(list.map((x) => [x.term.trim().toLowerCase(), x]));
  const used = new Set();
  const out = [];
  let at = 0;
  for (const m of src.matchAll(re)) {
    const word = m[1].toLowerCase();
    const hit = byKey.get(word) || [...byKey.keys()].filter((k) => word.startsWith(k)).sort((a, b) => b.length - a.length).map((k) => byKey.get(k))[0];
    if (!hit || used.has(hit.term)) continue;
    used.add(hit.term);
    if (m.index > at) out.push({ text: src.slice(at, m.index) });
    const end = m.index + m[1].length;
    // The English word, unless the text already gives it right after the term.
    const enInline = !!hit.en && !src.slice(end, end + hit.en.length + 6).toLowerCase().includes(hit.en.toLowerCase());
    out.push(hit.en ? { text: m[1], term: hit.term, def: hit.def, en: hit.en, enInline } : { text: m[1], term: hit.term, def: hit.def });
    at = end;
  }
  if (at < src.length) out.push({ text: src.slice(at) });
  return out;
}

// The Dutch course with the English word next to each term (same lesson, same
// position in its terms list): he needs both words at work. Pure.
export function withEnglish(nlMod, enMod) {
  if (!nlMod || !enMod) return nlMod;
  const enLessons = new Map((enMod.lessons || []).map((l) => [l.id, l]));
  return {
    ...nlMod,
    lessons: (nlMod.lessons || []).map((l) => {
      const other = enLessons.get(l.id);
      if (!other || !(l.terms || []).length || (other.terms || []).length !== l.terms.length) return l;
      return {
        ...l,
        terms: l.terms.map((x, i) => {
          const en = other.terms[i] && other.terms[i].term;
          return en && en.trim().toLowerCase() !== x.term.trim().toLowerCase() ? { ...x, en } : x;
        }),
      };
    }),
  };
}
