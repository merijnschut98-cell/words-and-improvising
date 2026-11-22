// The rules of the practice tests (v18 T2, design 3.2): which tests a module has,
// when each opens, what is stored, and which one "your next step" offers. Pure,
// and with no imports from the course engine, so course.js and flair.js can use it.
//
// Test ids: '<moduleId>/topic/<topicId>' and '<moduleId>/level/<1-4>'. The Expert
// level test (level 4) is the module's final test.
//   Topic test: opens when the topic's flag shows (all four levels passed).
//   Level test N: opens when level N is passed in every topic of the module.
// A record per test, in state.courses[subject].tests[testId]:
//   { best, last, attempts, lastDay, byTopic, items }
//   best, last: percent 0-100 (rounded down), attempts: finished attempts,
//   lastDay: day of the last attempt, byTopic: { topicId: { correct, total } } of
//   the last attempt, items: the question ids of the last attempt (not repeated next time).
import { MODULES, topicsOf, LEVELS, moduleOf } from '../content/courses/index.js';

export const PASS_PCT = 80; // a test is passed at 80 percent
export const GOLD_PCT = 90; // the final test gives gold at 90 percent
export const TOPIC_SIZE = 12;
// 16, 18, 20, 20: the higher levels ask more.
export const levelSize = (level) => Math.min(20, 14 + 2 * level);

export const topicTestId = (moduleId, topicId) => `${moduleId}/topic/${topicId}`;
export const levelTestId = (moduleId, level) => `${moduleId}/level/${level}`;
export const finalTestId = (moduleId) => levelTestId(moduleId, 4);

export function parseTestId(id) {
  const m = /^([^/]+)\/(topic|level)\/([^/]+)$/.exec(String(id));
  if (!m) return null;
  if (m[2] === 'level') {
    const level = Number(m[3]);
    return Number.isInteger(level) && level >= 1 && level <= 4 ? { moduleId: m[1], type: 'level', level } : null;
  }
  return { moduleId: m[1], type: 'topic', topicId: m[3] };
}

const courseOf = (state, subject) => ((state && state.courses) || {})[subject] || {};
export const testRecord = (state, subject, id) => (courseOf(state, subject).tests || {})[id] || null;
const passedLessons = (state, subject) => courseOf(state, subject).lessons || {};
const isPassed = (lessons, id) => !!(lessons[id] && lessons[id].passed);

// One test of a module as a spec, or null when the id names nothing there.
export function specOf(meta, id) {
  const p = parseTestId(id);
  const topics = topicsOf(meta);
  if (!p || !topics || p.moduleId !== meta.id) return null;
  if (p.type === 'level') return { id, type: 'level', moduleId: meta.id, level: p.level, size: levelSize(p.level), final: p.level === 4 };
  const topic = topics.find((t) => t.id === p.topicId);
  return topic ? { id, type: 'topic', moduleId: meta.id, topicId: topic.id, size: TOPIC_SIZE, final: false } : null;
}

// Every test of a topic module: a topic test per topic, then the four level tests.
// A module without topics has none.
export function testSpecs(meta) {
  const topics = topicsOf(meta);
  if (!topics) return [];
  return [
    ...topics.map((t) => specOf(meta, topicTestId(meta.id, t.id))),
    ...LEVELS.map((n) => specOf(meta, levelTestId(meta.id, n))),
  ];
}

// Q3 A: a topic test at the topic's flag; a level test once that level is passed in every topic.
export function testOpen(state, meta, spec) {
  const topics = topicsOf(meta);
  if (!topics || !spec) return false;
  const lessons = passedLessons(state, meta.subject);
  if (spec.type === 'topic') {
    const t = topics.find((x) => x.id === spec.topicId);
    return !!t && t.levels.every((id) => isPassed(lessons, id));
  }
  return topics.every((t) => isPassed(lessons, t.levels[spec.level - 1]));
}

export const testPassed = (record) => !!record && record.best >= PASS_PCT;

// What a screen shows of a test: the spec, whether it is open, its record, passed.
export function testStatus(state, meta, spec) {
  const record = testRecord(state, meta.subject, spec.id);
  return { ...spec, open: testOpen(state, meta, spec), record, passed: testPassed(record) };
}

// The four level tests of a module in order (Basis ... Expert).
export const levelTests = (state, meta) => testSpecs(meta).filter((s) => s.type === 'level').map((s) => testStatus(state, meta, s));
export const topicTests = (state, meta) => testSpecs(meta).filter((s) => s.type === 'topic').map((s) => testStatus(state, meta, s));

// The open tests of a subject.
export function openTests(state, subject, modules = MODULES) {
  return modules.filter((m) => m.subject === subject).flatMap((m) => testSpecs(m).map((s) => testStatus(state, m, s)).filter((s) => s.open));
}

// One test a day per subject: any test of the subject finished today (open or not).
const testedToday = (state, subject, today) => Object.values(courseOf(state, subject).tests || {}).some((r) => r && r.lastDay === today);

// "Your next step" before the lessons are done (integrator ruling 1, from Merijn's
// "Oefentoetsen zijn de basis om te blijven leren"): an open test he never took. The
// caller offers it only between modules: when the next lesson is in another module than
// the lesson he touched last, so a level round in progress is never interrupted; a test
// opens exactly when such a round (or a topic's last level) is finished. The tests of
// the module he worked in last come first (just opened), then level tests before topic
// tests, the higher level first, then the id. At most one test a day, as below.
export function freshTestPick(state, subject, today, modules = MODULES, workedIn = null) {
  const open = openTests(state, subject, modules);
  if (!open.length || testedToday(state, subject, today)) return null;
  const rank = (s) => [s.moduleId === workedIn ? 0 : 1, s.type === 'level' ? 0 : 1, -(s.level || 0), s.id];
  const fresh = open.filter((s) => !s.record).map((s) => [rank(s), s]).sort(([x], [y]) => {
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
    return 0;
  });
  if (!fresh.length) return null;
  const pick = fresh[0][1];
  return { reason: 'test', why: 'testNew', testId: pick.id, moduleId: pick.moduleId, subject };
}

// "Your next step" (after the lesson steps): the open test that was never tried first,
// then the lowest last score, then the oldest attempt, then the id. At most one test a day:
// none once a test of this subject was finished today.
export function testPick(state, subject, today, modules = MODULES) {
  const open = openTests(state, subject, modules);
  if (!open.length) return null;
  if (testedToday(state, subject, today)) return null;
  const key = (s) => (s.record ? [1, s.record.last, s.record.lastDay] : [0, 0, '']);
  const cmp = (a, b) => {
    const x = key(a);
    const y = key(b);
    return x[0] - y[0] || x[1] - y[1] || (x[2] < y[2] ? -1 : x[2] > y[2] ? 1 : 0) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  };
  const [pick] = [...open].sort(cmp);
  return { reason: 'test', testId: pick.id, moduleId: pick.moduleId, subject };
}

// The module of a test id (for stray ids): the module id before the first slash.
export const moduleOfTest = (id) => moduleOf(String(id).split('/')[0]);
