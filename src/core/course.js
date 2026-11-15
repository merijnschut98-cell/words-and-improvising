// Course engine: quiz flow, judging answers, lesson progress, and how course
// work feeds the shared XP, days and streak. Pure.
import { updateStreak, reconcileStreak, dayKey } from './progress.js';
import { isoWeekKey } from './boss.js';
import { scheduleCourseReview, dueCount, maintenanceQuestion, OWNED_BOX } from './coursereview.js';
import { lessonOf, moduleOf, MODULES, TRACKS, topicsOf, placeOf } from '../content/courses/index.js';
import { mapFor } from '../content/courses/maps/index.js';
import { upcoming } from './realweek.js';
import { creditXp, isPerfect, goalJustReached } from './xp.js';
import { awardFlair } from './flair.js';

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
export function countRound(state, today, xp) {
  const s = creditXp(reconcileStreak(state, today).state, xp, today);
  return { ...s, streak: updateStreak(s.streak, today), days: { ...s.days, [today]: (s.days[today] || 0) + 1 } };
}

export function applyLesson(state, { subject, lessonId, firstTry, sure = {}, lang }, today, now) {
  const before = ((state.courses || {})[subject] || { lessons: {} }).lessons[lessonId] || {};
  const xp = before.passed ? 0 : LESSON_XP;
  let next = countRound(state, today, xp);
  let reviews = next.courseReviews || {};
  for (const [questionId, ok] of Object.entries(firstTry || {})) {
    // Only the lesson's own recall questions are spaced; term questions, the
    // guess and earlier-level questions are practice in this quiz (v16).
    if (!questionId.startsWith(`${lessonId}#r`)) continue;
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
    lessons: { ...c.lessons, [lessonId]: { ...before, read: before.read || now, passed: before.passed || now, ...(before.perfect || isPerfect(firstTry, sure) ? { perfect: before.perfect || now } : {}) } },
  }, { day: today, kind: 'lesson', lessonId, correct: results.filter(Boolean).length, total: results.length, ts: now }));
  // v16 flair: medals and titles this lesson earned, and the daily goal.
  const won = awardFlair(next, now);
  return { state: won.state, xp, medals: won.medals, speakMedals: won.speakMedals, titles: won.titles, goalReached: goalJustReached(state, won.state, today) };
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
  return { state: next, xp, goalReached: goalJustReached(state, next, today) };
}

// A situation is practice on top of a lesson: XP the first time, no round.
export function applySituation(state, { subject, lessonId, pts }, today, now) {
  const before = ((state.courses || {})[subject] || { lessons: {} }).lessons[lessonId] || {};
  const xp = before.situation ? 0 : SITUATION_XP;
  let next = creditXp(state, xp, today);
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

// v17: has he watched this module's intro film to the end? Stored per subject
// as a list of module ids (newest last, capped), synced as a union.
const SEEN_INTROS_CAP = 200;
const subjectOfModule = (moduleId) => String(moduleId).split('.')[0];
export const introSeen = (state, moduleId) => ((((state.courses || {})[subjectOfModule(moduleId)]) || {}).seenIntros || []).includes(moduleId);
export function markIntroSeen(state, moduleId) {
  if (introSeen(state, moduleId)) return state;
  return withSubject(state, subjectOfModule(moduleId), (c) => ({ ...c, seenIntros: [...(c.seenIntros || []), moduleId].slice(-SEEN_INTROS_CAP) }));
}

// v17 Task 19: has he seen the level opener of this topic at this level (2 to
// 4)? Stored per subject as strings '<moduleId>/<topicId>#<level>' (newest
// last, capped), synced as a union: an opener seen on one device counts on all.
// The cap must never bite on real ids (the sync union trims in sort order, not
// by age): Engineering has 336 topic levels at 2 to 4, Projects 192, and a test
// keeps the cap at least twice the biggest subject.
export const SEEN_LEVELS_CAP = 1200;
const levelId = (topicKey, level) => `${topicKey}#${level}`;
const openerLevel = (level) => Number.isInteger(level) && level >= 2 && level <= 4;
export const levelSeen = (state, subject, topicKey, level) => ((((state.courses || {})[subject]) || {}).seenLevels || []).includes(levelId(topicKey, level));
export function markLevelSeen(state, subject, topicKey, level) {
  if (!openerLevel(level) || levelSeen(state, subject, topicKey, level)) return state;
  return withSubject(state, subject, (c) => ({ ...c, seenLevels: [...(c.seenLevels || []), levelId(topicKey, level)].slice(-SEEN_LEVELS_CAP) }));
}
// The text of an opener in the app language, or null (also for level 1 or a missing text).
export function openerText(openers, topicKey, level, lang) {
  const o = openerLevel(level) && openers && openers[topicKey] && openers[topicKey][level];
  const text = o && (o[lang === 'en' ? 'en' : 'nl'] || o.en);
  return typeof text === 'string' && text.trim() ? text : null;
}
// Is an opener due before this lesson? Levels 2 to 4, not seen yet, and not a
// level he has been at already: a lesson he passed before the openers existed
// counts as been there. Opening the lesson does not (it is marked opened
// before the card shows, and leaving the card must keep it unseen).
export function openerDue(state, subject, topicKey, level, lessonId = null) {
  if (!openerLevel(level) || levelSeen(state, subject, topicKey, level)) return false;
  const done = lessonId && ((((state.courses || {})[subject]) || {}).lessons || {})[lessonId];
  return !(done && (done.passed || done.read));
}
// The opener to show before a lesson, or null: only when one is due and there
// is a text. Pure.
export function openerToShow(state, subject, topicKey, level, openers, lang, lessonId = null) {
  if (!openerDue(state, subject, topicKey, level, lessonId)) return null;
  return openerText(openers, topicKey, level, lang);
}
// Loads the openers but waits at most `ms`: a slow or failed load gives null,
// so the lesson starts instead. Settles once; a late answer is ignored.
export function openerWithin(loader, ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    const done = (v) => { clearTimeout(timer); resolve(v); };
    try { Promise.resolve(loader()).then(done, () => done(null)); } catch { done(null); }
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

// The subject's modules in the order a learner walks them: on a map, the road
// first (Intake, Plan, Run, Land, Close); then every other module by its
// level (Instap, Verdieping, Specialist), in map order within a level, else
// course order. The map draws Specialist places at the top, so map order
// alone would put Portfolio before Agile; without a map, an Instap module
// late in the course list (another track) still comes before any Specialist.
export function roadOrder(subject, modules = MODULES) {
  const own = modules.filter((m) => m.subject === subject);
  const map = mapFor(subject);
  const road = [...new Set(map ? (map.routes || []).flat() : [])].map((id) => own.find((m) => m.id === id)).filter(Boolean);
  const onMap = (id) => { const i = map ? map.places.findIndex((p) => p.module === id) : -1; return i < 0 ? own.length : i; };
  const rest = own.filter((m) => !road.includes(m))
    .sort((a, b) => (a.level || 1) - (b.level || 1) || onMap(a.id) - onMap(b.id) || own.indexOf(a) - own.indexOf(b));
  return [...road, ...rest];
}

// One module's lessons, breadth-first: level 1 of every topic, then level 2 of
// every topic, and so on. A module without topics keeps its index order.
function moduleBreadth(meta) {
  const metaTopics = topicsOf(meta);
  if (!metaTopics) return [...meta.lessons];
  const depth = Math.max(0, ...metaTopics.map((t) => t.levels.length));
  return Array.from({ length: depth }, (_, L) => metaTopics.map((t) => t.levels[L]).filter(Boolean)).flat();
}

// The subject's lessons breadth-first by level: every Basis lesson (modules in
// road order), then every Werkkennis lesson, then Gevorderd, then Expert. He
// does not have to master one area before taking the next step in another.
export function breadthOrder(subject, modules = MODULES) {
  const metas = roadOrder(subject, modules);
  const per = metas.map(moduleBreadth);
  const rounds = Math.max(0, ...metas.map((m) => (topicsOf(m) ? Math.max(0, ...topicsOf(m).map((t) => t.levels.length)) : 1)));
  const out = [];
  for (let L = 0; L < rounds; L++) {
    metas.forEach((m, i) => {
      const t = topicsOf(m);
      if (t) out.push(...t.map((x) => x.levels[L]).filter(Boolean));
      else if (L === 0) out.push(...per[i]);
    });
  }
  return out;
}

// A lesson he opened and did not finish, when it is the last one he touched
// in the module, comes first. Then the lowest level not passed across the
// module's topics (Basis of every topic before any Werkkennis), topics in
// index order; a module without topics: the first lesson not passed.
export function nextLesson(state, meta) {
  const lessons = passedIn(state, meta.subject);
  const done = (id) => !!(lessons[id] && lessons[id].passed);
  const recent = mostRecent(lessons, meta.lessons);
  if (recent && !done(recent) && lessons[recent].opened) return recent;
  return moduleBreadth(meta).find((id) => !done(id)) || null;
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

// The module of the subject's next lesson, breadth-first by level (see
// breadthOrder): Intake's Basis, then Plan's Basis, and so on, before anyone's
// Werkkennis. Null when every lesson of the subject is passed.
export function recommendedModule(state, subject, modules = MODULES) {
  const lessons = passedIn(state, subject);
  const id = breadthOrder(subject, modules).find((l) => !(lessons[l] && lessons[l].passed));
  return id ? moduleOf(id) : null;
}

// The subject's next lesson, { moduleId, lessonId }, or null when every
// lesson is passed: the recommended module and its next lesson. The start
// card, the course home and the lesson end all use this one answer.
export function nextCourseLesson(state, subject, modules = MODULES) {
  const moduleId = recommendedModule(state, subject, modules);
  const meta = moduleId && modules.find((m) => m.id === moduleId);
  const lessonId = meta ? nextLesson(state, meta) : null;
  return lessonId ? { moduleId, lessonId } : null;
}

// The "next" button at a lesson's end. Opened from the module screen it
// stays in that module (what its continue button says, where the lesson
// returns to); opened from a home it is the subject's next lesson, which can
// be in another module (Intake's last Basis lesson leads to Plan's first).
// Never the lesson itself; null when nothing is left.
export function lessonEndNext(state, meta, lessonId, fromModule, modules = MODULES) {
  const own = fromModule ? nextLesson(state, meta) : null;
  const next = fromModule ? (own ? { moduleId: meta.id, lessonId: own } : null) : nextCourseLesson(state, meta.subject, modules);
  return next && next.lessonId !== lessonId ? next : null;
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
  const rec = nextCourseLesson(state, subject, modules);
  if (rec) return placed({ reason: 'lesson', ...rec }, modules);
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

// The lesson quiz (v16): 5 to 8 questions by level (Basis 5 … Expert 8; 5
// outside a topic), all from the content: the lesson's own recall questions,
// then questions on its terms ("which term fits this description?"), then,
// still short, recall questions from the earlier levels of its topic, nearest
// first. Nothing is made up: with too little material the quiz is shorter.
// The guess from the start of the lesson comes back as one extra, last
// question, with what he guessed (q.guess), so he can compare.
export const quizSize = (level) => (Number.isInteger(level) && level >= 1 && level <= 4 ? 4 + level : 5);

function seedHash(s) {
  let x = 7;
  for (const c of String(s)) x = (x * 31 + c.codePointAt(0)) >>> 0;
  return x;
}
const byHash = (seed) => (a, b) => seedHash(`${seed}|${a}`) - seedHash(`${seed}|${b}`);
const namesTerm = (def, name) => new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(name)}(?![\\p{L}\\p{N}])`, 'iu').test(String(def));

// One term question, or null when the definition gives the term away or there
// are not three other terms to choose from (the lesson's own first, then pool).
function termQuestion(lesson, i, pool, ask) {
  const x = lesson.terms[i];
  const name = String((x && x.term) || '').trim();
  if (!name || !x.def || namesTerm(x.def, name)) return null;
  const id = `${lesson.id}#t${i}`;
  const seen = new Set([name.toLowerCase()]);
  const others = (list) => list.map((y) => String((y && y.term) || '').trim())
    .filter((t) => t && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase()))
    .sort(byHash(id));
  const wrong = [...others(lesson.terms), ...others(pool || [])].slice(0, 3);
  if (wrong.length < 3) return null;
  return { id, q: ask(String(x.def).trim()), options: [name, ...wrong].sort(byHash(id)), answer: name, why: `${name}: ${String(x.def).trim()}` };
}

export function lessonQuiz(lesson, { level = null, ask = (d) => d, pool = [], earlier = [], guesses = [] } = {}) {
  const size = quizSize(level);
  const out = recallQuestions(lesson).slice(0, size);
  (lesson.terms || []).forEach((_, i) => {
    if (out.length >= size) return;
    const q = termQuestion(lesson, i, pool, ask);
    if (q) out.push(q);
  });
  for (const l of [...(earlier || [])].reverse()) {
    for (const q of recallQuestions(l)) if (out.length < size) out.push(q);
  }
  const pre = lesson.pre || [];
  if (pre.length) {
    const g = (i) => (guesses[i] == null ? null : guesses[i]);
    const miss = pre.findIndex((q, i) => g(i) != null && !judge(q, g(i)));
    const i = miss >= 0 ? miss : 0;
    out.push({ ...pre[i], id: `${lesson.id}#p${i}`, guess: g(i) });
  }
  return out;
}

// The guess question in the review: what he guessed, what he says now and the
// right answer, each judged, so the gap is visible.
export function guessCompare(q, now) {
  return {
    guess: q.guess == null ? '?' : 'number' in q ? withUnit(q, q.guess) : q.guess,
    now: 'number' in q ? withUnit(q, now) : now,
    answer: 'number' in q ? withUnit(q, q.number) : q.answer,
    guessOk: q.guess != null && judge(q, q.guess),
    nowOk: judge(q, now),
  };
}

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
