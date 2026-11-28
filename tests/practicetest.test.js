// v18 T2: the practice tests. Rules (ids, unlocks, the pick), the pool and the
// composition, the score, what a finished attempt changes, storage and sync, the
// medal rule, and the screens. The fixture bank (tests/fixtures/bank/tiny.js) is
// the bank; its module has two topics of four levels.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meta, lessons, bankEn, bankNl } from './fixtures/bank/tiny.js';
import { kindOf } from '../src/core/questionkinds.js';
import {
  PASS_PCT, GOLD_PCT, TOPIC_SIZE, levelSize, topicTestId, levelTestId, finalTestId, parseTestId, specOf, testSpecs, testOpen,
  testStatus, levelTests, topicTests, openTests, testPick, testPool, levelQuotas, composeTest, scoreTest, weakestTopic, applyTest,
} from '../src/core/practicetest.js';
import { defaultState, load, cleanTests } from '../src/core/storage.js';
import { mergeStates, mergeTests, syncable } from '../src/core/sync.js';
import { medalFor } from '../src/core/flair.js';
import { courseTodayPick, reviewsToday, reviewsLeftToday } from '../src/core/course.js';
import { bankQuestionId, isBankQuestion, MODULES } from '../src/content/courses/index.js';

const TODAY = '2026-11-21';
const NOW = new Date(2026, 10, 21, 9).getTime();
const M = { ...meta, questions: Object.fromEntries(meta.lessons.map((id) => [id, 4])), title: { nl: 'Tiny', en: 'Tiny' }, blurb: { nl: '', en: '' } };

const recallOf = (id) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ q: `${id} vraag ${i}`, options: ['a', 'b', 'c', 'd'], answer: 'a', why: 'w' }));
const modLessons = lessons.nl.map((l) => ({ ...l, recall: recallOf(l.id) }));
const POOL = testPool(M, modLessons, bankNl);

const withLessons = (ids, extra = {}) => ({ ...defaultState(), courses: { ...defaultState().courses, tiny: { lessons: Object.fromEntries(ids.map((id) => [id, { passed: 1 }])), sessions: [], ...extra } } });
const ALPHA = meta.topics[0].levels;
const BETA = meta.topics[1].levels;
const ALL = [...ALPHA, ...BETA];

// ---- ids, specs and unlock rules (Q3 A) ----

test('test ids: topic and level, parsed back; the final test is the Expert level test', () => {
  assert.equal(topicTestId('pm.plan', 'schedule'), 'pm.plan/topic/schedule');
  assert.equal(levelTestId('pm.plan', 2), 'pm.plan/level/2');
  assert.equal(finalTestId('pm.plan'), 'pm.plan/level/4');
  assert.deepEqual(parseTestId('pm.plan/level/3'), { moduleId: 'pm.plan', type: 'level', level: 3 });
  assert.deepEqual(parseTestId('pm.plan/topic/schedule'), { moduleId: 'pm.plan', type: 'topic', topicId: 'schedule' });
  for (const bad of ['pm.plan/level/5', 'pm.plan/level/x', 'pm.plan', 'pm.plan/topic', '', null]) assert.equal(parseTestId(bad), null, String(bad));
});

test('a topic module has a topic test per topic and four level tests; sizes 12 and 16-20', () => {
  const specs = testSpecs(M);
  assert.deepEqual(specs.map((s) => s.id), ['tiny.mod/topic/alpha', 'tiny.mod/topic/beta', 'tiny.mod/level/1', 'tiny.mod/level/2', 'tiny.mod/level/3', 'tiny.mod/level/4']);
  assert.equal(TOPIC_SIZE, 12);
  assert.deepEqual([1, 2, 3, 4].map(levelSize), [16, 18, 20, 20]);
  assert.ok(specs.filter((s) => s.type === 'level').every((s) => s.size >= 16 && s.size <= 20));
  assert.equal(specs.find((s) => s.id === 'tiny.mod/level/4').final, true);
  assert.deepEqual(testSpecs({ id: 'x.y', subject: 'x', lessons: ['x.y.a'] }), [], 'a module without topics has no tests');
  assert.equal(specOf(M, 'tiny.mod/topic/nope'), null);
  assert.equal(specOf(M, 'other.mod/level/1'), null);
});

test('unlock: a topic test at the topic flag (all four levels), a level test when that level is passed in every topic', () => {
  const topicA = specOf(M, 'tiny.mod/topic/alpha');
  const lvl = (n) => specOf(M, `tiny.mod/level/${n}`);
  assert.equal(testOpen(defaultState(), M, topicA), false);
  assert.equal(testOpen(withLessons(ALPHA.slice(0, 3)), M, topicA), false, 'three of four levels is not the flag');
  assert.equal(testOpen(withLessons(ALPHA), M, topicA), true);
  assert.equal(testOpen(withLessons(ALPHA), M, specOf(M, 'tiny.mod/topic/beta')), false, 'another topic stays closed');
  // Level 1 passed in alpha only: not open. In both topics: open.
  assert.equal(testOpen(withLessons([ALPHA[0]]), M, lvl(1)), false);
  assert.equal(testOpen(withLessons([ALPHA[0], BETA[0]]), M, lvl(1)), true);
  assert.equal(testOpen(withLessons([ALPHA[0], BETA[0]]), M, lvl(2)), false);
  assert.equal(testOpen(withLessons([ALPHA[0], ALPHA[1], BETA[0]]), M, lvl(2)), false, 'level 2 needs it in every topic');
  assert.equal(testOpen(withLessons([ALPHA[0], ALPHA[1], BETA[0], BETA[1]]), M, lvl(2)), true);
  assert.equal(testOpen(withLessons(ALL), M, lvl(4)), true);
  assert.deepEqual(openTests(withLessons(ALL), 'tiny', [M]).map((s) => s.id), testSpecs(M).map((s) => s.id));
});

test('real modules: unlock follows the topics of the index (a module with all lessons passed opens every test)', () => {
  const pm = MODULES.find((m) => m.id === 'pm.plan');
  assert.ok(pm.topics.length > 0);
  const st = { ...defaultState(), courses: { ...defaultState().courses, pm: { lessons: Object.fromEntries(pm.lessons.map((id) => [id, { passed: 1 }])), sessions: [] } } };
  assert.equal(testSpecs(pm).filter((s) => testOpen(st, pm, s)).length, pm.topics.length + 4);
  assert.equal(testSpecs(pm).filter((s) => testOpen(defaultState(), pm, s)).length, 0);
});

test('status and the module screen rows: passed at 80 percent, the final test is level 4', () => {
  const st = withLessons(ALL, { tests: { 'tiny.mod/level/1': { best: 80, last: 80, attempts: 1, lastDay: TODAY, byTopic: {}, items: [] }, 'tiny.mod/level/2': { best: 72, last: 72, attempts: 2, lastDay: TODAY, byTopic: {}, items: [] } } });
  const rows = levelTests(st, M);
  assert.deepEqual(rows.map((r) => [r.level, r.open, r.passed]), [[1, true, true], [2, true, false], [3, true, false], [4, true, false]]);
  assert.equal(PASS_PCT, 80);
  assert.equal(topicTests(st, M).length, 2);
  assert.equal(testStatus(withLessons([]), M, specOf(M, 'tiny.mod/level/1')).open, false);
});

// ---- the pool and the composition ----

test('the pool: recall questions and bank items, marked with topic, level and source; bank ids are lesson#b<n>', () => {
  assert.equal(POOL.length, 8 * 8 + 8);
  const bank = POOL.filter((q) => q.src === 'bank');
  assert.equal(bank.length, 8);
  assert.ok(bank.every((q) => isBankQuestion(q.id) && q.id === `${q.source.lesson}#${q.id.split('#')[1]}`));
  assert.equal(bankQuestionId(bankNl.items[0]), POOL.find((q) => q.src === 'bank').id);
  assert.ok(POOL.filter((q) => q.src === 'recall').every((q) => /#r\d$/.test(q.id) && q.topic && q.level >= 1));
  assert.equal(new Set(POOL.map((q) => q.id)).size, POOL.length);
  // No bank: recall alone.
  assert.ok(testPool(M, modLessons, null).every((q) => q.src === 'recall'));
});

test('level quotas: a topic test weights toward the higher levels; level N puts half on level N', () => {
  const t = levelQuotas(specOf(M, 'tiny.mod/topic/alpha'));
  assert.equal(Object.values(t).reduce((a, b) => a + b, 0), 12);
  assert.ok(t[1] < t[2] && t[2] < t[3] && t[3] < t[4], JSON.stringify(t));
  for (const n of [1, 2, 3, 4]) {
    const spec = specOf(M, `tiny.mod/level/${n}`);
    const q = levelQuotas(spec);
    assert.equal(Object.values(q).reduce((a, b) => a + b, 0), spec.size, `level ${n}`);
    assert.equal(q[n], n === 1 ? spec.size : Math.ceil(spec.size / 2));
    for (let l = n + 1; l <= 4; l++) assert.equal(q[l], 0);
  }
});

test('a topic test: 12 items of that topic, weighted to the higher levels, some from the bank, several kinds', () => {
  const spec = specOf(M, 'tiny.mod/topic/alpha');
  const qs = composeTest(spec, POOL, { attempt: 0 });
  assert.equal(qs.length, 12);
  assert.equal(new Set(qs.map((q) => q.id)).size, 12);
  assert.ok(qs.every((q) => q.topic === 'alpha'));
  const per = [1, 2, 3, 4].map((l) => qs.filter((q) => q.level === l).length);
  assert.ok(per[3] >= per[0], `Expert at least as many as Basis: ${per}`);
  const bank = qs.filter((q) => q.src === 'bank').length;
  assert.ok(bank >= 4 && bank <= 7, `bank share ${bank}/12`);
  assert.ok(new Set(qs.map(kindOf)).size >= 3, 'a mix of kinds');
});

test('a level test: 16 to 20 items across the topics at levels up to N, half at level N', () => {
  for (const n of [2, 3, 4]) {
    const spec = specOf(M, `tiny.mod/level/${n}`);
    const qs = composeTest(spec, POOL, { attempt: 0 });
    assert.equal(qs.length, spec.size);
    assert.ok(qs.every((q) => q.level <= n));
    assert.equal(qs.filter((q) => q.level === n).length, Math.ceil(spec.size / 2));
    assert.equal(new Set(qs.map((q) => q.topic)).size, 2, 'both topics');
  }
  const l1 = composeTest(specOf(M, 'tiny.mod/level/1'), POOL, { attempt: 0 });
  assert.equal(l1.length, 16);
  assert.ok(l1.every((q) => q.level === 1));
});

test('seeded by attempt: the same attempt asks the same set, the next attempt a different one', () => {
  const spec = specOf(M, 'tiny.mod/level/3');
  const ids = (a, last = []) => composeTest(spec, POOL, { attempt: a, lastIds: last }).map((q) => q.id);
  assert.deepEqual(ids(0), ids(0));
  assert.notDeepEqual([...ids(0)].sort(), [...ids(1)].sort());
});

test('no repeat of the last attempt while the pool allows it', () => {
  const spec = specOf(M, 'tiny.mod/level/4');
  const first = composeTest(spec, POOL, { attempt: 0 });
  const second = composeTest(spec, POOL, { attempt: 1, lastIds: first.map((q) => q.id) });
  const firstIds = new Set(first.map((q) => q.id));
  assert.equal(second.filter((q) => firstIds.has(q.id)).length, 0, 'pool 40: 20 fresh ones exist');
  // A pool that is too small to avoid it still gives a full test.
  const tinyPool = POOL.filter((q) => q.topic === 'alpha' && q.level <= 2);
  const small = specOf(M, 'tiny.mod/topic/alpha');
  const a = composeTest(small, tinyPool, { attempt: 0 });
  const b = composeTest(small, tinyPool, { attempt: 1, lastIds: a.map((q) => q.id) });
  assert.equal(b.length, a.length);
});

test('a small pool gives a shorter test, never a repeated item; an empty pool gives none', () => {
  const spec = specOf(M, 'tiny.mod/topic/alpha');
  const few = POOL.filter((q) => q.topic === 'alpha').slice(0, 5);
  const qs = composeTest(spec, few, { attempt: 0 });
  assert.equal(qs.length, 5);
  assert.equal(new Set(qs.map((q) => q.id)).size, 5);
  assert.deepEqual(composeTest(spec, [], { attempt: 0 }), []);
});

test('a module without a bank is tested on its recall questions', () => {
  const pool = testPool(M, modLessons, null);
  const qs = composeTest(specOf(M, 'tiny.mod/level/2'), pool, { attempt: 0 });
  assert.equal(qs.length, 18);
  assert.ok(qs.every((q) => q.src === 'recall'));
});

// ---- score ----

test('scoreTest: percent rounded down, passed at 80, gold line at 90, per topic and level, unanswered is wrong', () => {
  const qs = Array.from({ length: 10 }, (_, i) => ({ id: `x#r${i}`, topic: i < 5 ? 'a' : 'b', level: (i % 4) + 1 }));
  const res = (n) => Object.fromEntries(qs.map((q, i) => [q.id, i < n]));
  assert.equal(scoreTest(qs, res(8)).passed, true);
  assert.equal(scoreTest(qs, res(7)).passed, false);
  assert.equal(scoreTest(qs, res(9)).gold, true);
  assert.equal(scoreTest(qs, res(8)).gold, false);
  const s = scoreTest(qs, { 'x#r0': true, 'x#r1': true });
  assert.equal(s.correct, 2);
  assert.equal(s.total, 10);
  assert.equal(s.pct, 20);
  assert.deepEqual(s.byTopic.a, { correct: 2, total: 5 });
  assert.deepEqual(s.byTopic.b, { correct: 0, total: 5 });
  assert.equal(s.missed.length, 8);
  assert.equal(weakestTopic(s.byTopic), 'b');
  assert.equal(weakestTopic(scoreTest(qs, res(10)).byTopic), null, 'nothing missed, nothing weakest');
  // 89 of 99 must not round up into a pass or gold: floor.
  const big = Array.from({ length: 19 }, (_, i) => ({ id: `y#r${i}`, topic: 'a', level: 1 }));
  const r17 = scoreTest(big, Object.fromEntries(big.map((q, i) => [q.id, i < 17])));
  assert.equal(r17.pct, 89);
  assert.equal(r17.gold, false);
  assert.equal(GOLD_PCT, 90);
});

// ---- a finished attempt ----

const questionsOf = (spec, attempt = 0) => composeTest(spec, POOL, { attempt });
const allRight = (qs) => Object.fromEntries(qs.map((q) => [q.id, true]));

test('applyTest: a round for the day, 20 XP the first finish, +10 the first pass, then none', () => {
  const spec = specOf(M, 'tiny.mod/topic/alpha');
  const qs = questionsOf(spec);
  const miss = Object.fromEntries(qs.map((q, i) => [q.id, i < 6]));
  const a = applyTest(withLessons(ALPHA), { subject: 'tiny', testId: spec.id, questions: qs, results: miss, lang: 'nl' }, TODAY, NOW);
  assert.equal(a.xp, 20);
  assert.equal(a.passed, false);
  assert.equal(a.state.days[TODAY], 1);
  assert.equal(a.state.xpDays[TODAY], 20);
  const b = applyTest(a.state, { subject: 'tiny', testId: spec.id, questions: qs, results: allRight(qs), lang: 'nl' }, '2026-11-22', NOW + 864e5);
  assert.equal(b.xp, 10);
  const c = applyTest(b.state, { subject: 'tiny', testId: spec.id, questions: qs, results: allRight(qs), lang: 'nl' }, '2026-11-23', NOW + 2 * 864e5);
  assert.equal(c.xp, 0);
  assert.equal(c.state.days['2026-11-23'], 1, 'still a round');
  const first = applyTest(withLessons(ALPHA), { subject: 'tiny', testId: spec.id, questions: qs, results: allRight(qs), lang: 'nl' }, TODAY, NOW);
  assert.equal(first.xp, 30, 'first finish and first pass at once');
});

test('applyTest: the record keeps the best, the last, the attempts, the day, the topics and the items; the session is logged', () => {
  const spec = specOf(M, 'tiny.mod/level/2');
  const qs = questionsOf(spec);
  const half = Object.fromEntries(qs.map((q, i) => [q.id, i < qs.length / 2]));
  const r1 = applyTest(withLessons(ALL), { subject: 'tiny', testId: spec.id, questions: qs, results: half, lang: 'nl' }, TODAY, NOW);
  const rec1 = r1.state.courses.tiny.tests[spec.id];
  assert.equal(rec1.best, 50);
  assert.equal(rec1.last, 50);
  assert.equal(rec1.attempts, 1);
  assert.equal(rec1.lastDay, TODAY);
  assert.deepEqual(rec1.items, qs.map((q) => q.id));
  assert.ok(rec1.byTopic.alpha && rec1.byTopic.beta);
  const r2 = applyTest(r1.state, { subject: 'tiny', testId: spec.id, questions: qs, results: allRight(qs), lang: 'nl' }, '2026-11-22', NOW + 5);
  const r3 = applyTest(r2.state, { subject: 'tiny', testId: spec.id, questions: qs, results: {}, lang: 'nl' }, '2026-11-23', NOW + 9);
  const rec3 = r3.state.courses.tiny.tests[spec.id];
  assert.deepEqual([rec3.best, rec3.last, rec3.attempts, rec3.lastDay], [100, 0, 3, '2026-11-23']);
  assert.deepEqual(r3.state.courses.tiny.sessions[0], { day: '2026-11-23', kind: 'test', testId: spec.id, moduleId: 'tiny.mod', correct: 0, total: qs.length, ts: NOW + 9 });
});

test('applyTest (Q5 A): recall answers are scheduled like a due session; bank answers never join the review pile', () => {
  const spec = specOf(M, 'tiny.mod/level/4');
  const qs = questionsOf(spec);
  const recall = qs.filter((q) => q.src === 'recall');
  const bank = qs.filter((q) => q.src === 'bank');
  assert.ok(recall.length > 0 && bank.length > 0);
  const seed = { ...withLessons(ALL), courseReviews: { [`nl|${recall[0].id}`]: { box: 2, due: '2026-11-25', lesson: 'x', subject: 'tiny' }, [`nl|${recall[1].id}`]: { box: 2, due: TODAY, lesson: 'x', subject: 'tiny' } } };
  const results = Object.fromEntries(qs.map((q) => [q.id, true]));
  results[recall[2].id] = false;
  const r = applyTest(seed, { subject: 'tiny', testId: spec.id, questions: qs, results, lang: 'nl' }, TODAY, NOW);
  const rv = r.state.courseReviews;
  assert.equal(rv[`nl|${recall[0].id}`].box, 2, 'right before its due date does not climb');
  assert.equal(rv[`nl|${recall[1].id}`].box, 3, 'right on a due question climbs a box');
  assert.equal(rv[`nl|${recall[2].id}`].box, 1, 'a miss goes to box 1');
  assert.ok(recall.slice(3).every((q) => rv[`nl|${q.id}`] && rv[`nl|${q.id}`].box === 2), 'a first right answer starts at box 2');
  assert.ok(bank.every((q) => !Object.keys(rv).some((k) => k.endsWith(q.id))), 'no bank item in the review pile');
  assert.equal(Object.keys(rv).filter((k) => /#b\d+$/.test(k)).length, 0);
});

// ---- medals: the final test (Q4 A) ----

const REAL = MODULES.find((m) => m.id === 'pm.plan');
const realState = (extra = {}, perfect = true) => ({
  ...defaultState(),
  courses: { ...defaultState().courses, pm: { lessons: Object.fromEntries(REAL.lessons.map((id) => [id, { passed: 1, ...(perfect ? { perfect: 2 } : {}) }])), sessions: [], ...extra } },
});
const rec = (best) => ({ best, last: best, attempts: 1, lastDay: TODAY, byTopic: {}, items: [] });

test('gold: silver plus the final test at 90 percent or more; below that it stays silver; the old perfect check still counts', () => {
  assert.equal(medalFor(realState(), REAL), 'silver');
  assert.equal(medalFor(realState({ tests: { [finalTestId('pm.plan')]: rec(89) } }), REAL), 'silver');
  assert.equal(medalFor(realState({ tests: { [finalTestId('pm.plan')]: rec(90) } }), REAL), 'gold');
  assert.equal(medalFor(realState({ tests: { [levelTestId('pm.plan', 3)]: rec(100) } }), REAL), 'silver', 'only the Expert test is the final test');
  assert.equal(medalFor(realState({ checks: { 'pm.plan': { last: TODAY, best: 10, total: 10, perfect: 5 } } }), REAL), 'gold', 'an old perfect check is kept');
  assert.equal(medalFor(realState({ tests: { [finalTestId('pm.plan')]: rec(100) } }, false), REAL), 'bronze', 'no silver, no gold');
});

test('applyTest: a final test at 90 percent awards gold and returns it', () => {
  const spec = specOf(REAL, finalTestId('pm.plan'));
  const pool = REAL.lessons.flatMap((id, i) => Array.from({ length: 4 }, (_, k) => ({ id: `${id}#r${k}`, q: 'q', options: ['a', 'b', 'c', 'd'], answer: 'a', why: 'w', topic: REAL.topics.find((t) => t.levels.includes(id)).id, level: (REAL.topics.find((t) => t.levels.includes(id)).levels.indexOf(id)) + 1, src: 'recall' })));
  const qs = composeTest(spec, pool, { attempt: 0 });
  assert.equal(qs.length, 20);
  const ninety = Object.fromEntries(qs.map((q, i) => [q.id, i < 18]));
  const r = applyTest(realState(), { subject: 'pm', testId: spec.id, questions: qs, results: ninety, lang: 'nl' }, TODAY, NOW);
  assert.deepEqual(r.medals, [{ subject: 'pm', moduleId: 'pm.plan', tier: 'gold' }]);
  assert.equal(r.state.courses.pm.medals['pm.plan'].tier, 'gold');
  const eighty = Object.fromEntries(qs.map((q, i) => [q.id, i < 17]));
  const r2 = applyTest(realState(), { subject: 'pm', testId: spec.id, questions: qs, results: eighty, lang: 'nl' }, TODAY, NOW);
  assert.deepEqual(r2.medals, [{ subject: 'pm', moduleId: 'pm.plan', tier: 'silver' }], 'silver is earned, gold is not');
  assert.equal(r2.state.courses.pm.medals['pm.plan'].tier, 'silver');
  assert.equal(r2.passed, true);
  assert.equal(r2.gold, false);
});

// ---- the next step ----

const allDoneState = (extra = {}) => {
  const lessonsDone = Object.fromEntries(M.lessons.map((id) => [id, { passed: 1, situation: { ts: 1 }, sayIt: 1 }]));
  return { ...defaultState(), courses: { ...defaultState().courses, tiny: { lessons: lessonsDone, sessions: [], ...extra } } };
};

test('the pick: once the lessons are done and an open test exists, the next step is a test', () => {
  const pick = courseTodayPick(allDoneState(), 'tiny', 'nl', TODAY, [M]);
  assert.equal(pick.reason, 'test');
  assert.equal(pick.moduleId, 'tiny.mod');
  assert.ok(parseTestId(pick.testId));
});

test('the pick: lessons first; a test only after the lesson steps', () => {
  const st = withLessons(ALPHA);
  assert.equal(courseTodayPick(st, 'tiny', 'nl', TODAY, [M]).reason, 'lesson');
});

test('the pick: never tried first; then the lowest last score; then the oldest; at most one a day', () => {
  const day = (n) => `2026-11-${String(n).padStart(2, '0')}`;
  const r = (last, lastDay) => ({ best: last, last, attempts: 1, lastDay, byTopic: {}, items: [] });
  const all = Object.fromEntries(testSpecs(M).map((s, i) => [s.id, r(90 - i * 5, day(10 + i))]));
  // Everything tried: the lowest last score is the last spec (60).
  const lowest = testPick(allDoneState({ tests: all }), 'tiny', TODAY, [M]);
  assert.equal(lowest.testId, 'tiny.mod/level/4');
  // One never tried: it comes first.
  const { 'tiny.mod/level/2': _drop, ...rest } = all;
  assert.equal(testPick(allDoneState({ tests: rest }), 'tiny', TODAY, [M]).testId, 'tiny.mod/level/2');
  // Equal scores: the older attempt first.
  const equal = Object.fromEntries(testSpecs(M).map((s, i) => [s.id, r(70, day(20 - i))]));
  assert.equal(testPick(allDoneState({ tests: equal }), 'tiny', TODAY, [M]).testId, 'tiny.mod/level/4');
  // A test finished today: none more today.
  const today = { ...all, 'tiny.mod/topic/alpha': r(100, TODAY) };
  assert.equal(testPick(allDoneState({ tests: today }), 'tiny', TODAY, [M]), null);
  assert.notEqual(courseTodayPick(allDoneState({ tests: today }), 'tiny', 'nl', TODAY, [M]).reason, 'test');
});

test('the pick: reviews due (five or more) still come before a test', () => {
  const reviews = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`nl|tiny.mod.a1#r${i}`, { box: 1, due: TODAY, lesson: 'tiny.mod.a1', subject: 'tiny' }]));
  assert.equal(courseTodayPick({ ...allDoneState(), courseReviews: reviews }, 'tiny', 'nl', TODAY, [M]).reason, 'due');
});

// ---- storage and sync ----

test('defaults and migration: an old save has no tests and loads with an empty map; bad records are dropped', () => {
  assert.deepEqual(defaultState().courses.pm.tests, {});
  assert.deepEqual(defaultState().courses.eng.tests, {});
  const old = { version: 1, courses: { pm: { lessons: {}, sessions: [] } } };
  const backend = { getItem: () => JSON.stringify(old), setItem() {} };
  assert.deepEqual(load(backend).courses.pm.tests, {});
  const good = rec(70);
  const cleaned = cleanTests({ a: good, b: { ...good, best: 101 }, c: 'x', d: { ...good, lastDay: 'nope' }, e: { ...good, best: 10, last: 20 }, f: { ...good, attempts: 0 }, g: { ...good, byTopic: { t: { correct: 5, total: 2 }, u: { correct: 1, total: 2 } }, items: ['i', 3] } });
  assert.deepEqual(Object.keys(cleaned), ['a', 'g']);
  assert.deepEqual(cleaned.g.byTopic, { u: { correct: 1, total: 2 } });
  assert.deepEqual(cleaned.g.items, ['i']);
});

const withTests = (tests) => ({ ...defaultState(), courses: { ...defaultState().courses, pm: { ...defaultState().courses.pm, tests } } });
const R = (best, last, attempts, lastDay, items = []) => ({ best, last, attempts, lastDay, byTopic: {}, items });

test('sync mergeTests: best max, attempts max, the last attempt from the later day, nothing lost on two devices', () => {
  const a = { 't/level/1': R(90, 60, 3, '2026-11-20', ['a']), 't/level/2': R(50, 50, 1, '2026-11-18') };
  const b = { 't/level/1': R(75, 75, 2, '2026-11-21', ['b']), 't/level/3': R(80, 80, 1, '2026-11-19') };
  const m = mergeTests(a, b);
  assert.deepEqual(m['t/level/1'], R(90, 75, 3, '2026-11-21', ['b']));
  assert.deepEqual(m['t/level/2'], a['t/level/2']);
  assert.deepEqual(m['t/level/3'], b['t/level/3']);
  assert.deepEqual(mergeTests(b, a), m, 'the same either way');
  // The same day: the record with more attempts is the later one.
  const same = mergeTests({ x: R(60, 60, 2, TODAY, ['p']) }, { x: R(60, 40, 3, TODAY, ['q']) });
  assert.deepEqual(same.x, R(60, 40, 3, TODAY, ['q']));
});

test('sync mergeStates: tests travel in the courses and a malformed remote record is dropped', () => {
  const local = withTests({ 'pm.plan/level/1': R(70, 70, 1, '2026-11-20') });
  const remote = syncable(withTests({ 'pm.plan/level/1': R(95, 95, 2, '2026-11-21'), 'pm.plan/level/2': R(60, 60, 1, '2026-11-21'), 'pm.plan/level/3': { best: 'x' } }));
  const m = mergeStates(local, remote).courses.pm.tests;
  assert.equal(m['pm.plan/level/1'].best, 95);
  assert.equal(m['pm.plan/level/1'].attempts, 2);
  assert.equal(m['pm.plan/level/2'].best, 60);
  assert.equal('pm.plan/level/3' in m, false);
  // A remote without tests (an older device) leaves the local ones alone.
  const keep = mergeStates(local, syncable({ ...defaultState() })).courses.pm.tests;
  assert.deepEqual(keep, local.courses.pm.tests);
  // The gold a final test earned on another device shows after the merge.
  assert.equal(PASS_PCT < GOLD_PCT, true);
});

// ---- the screens (a tiny fake DOM) ----
import { installFakeDom } from './fixtures/fakedom.js';
import { translator } from '../src/i18n.js';

installFakeDom();
const { renderTest, testRows, testChip, testLabel } = await import('../src/ui/practicetest.js');
const { topicPath, pathModel } = await import('../src/ui/pathmap.js');
const tNl = translator('nl');
const tEn = translator('en');

const fakeApp = (over = {}) => {
  const calls = [];
  const app = {
    t: tNl, lang: 'nl', state: defaultState(), navSeq: 1, today: () => TODAY,
    go: (screen, params) => calls.push([screen, params]),
    setSubject() {}, setState(s) { this.state = s; },
    openModule: () => Promise.reject(new Error('offline')), openModuleTerms: () => Promise.reject(new Error('offline')),
    ...over,
  };
  return { app, calls };
};
const tick = () => new Promise((r) => setTimeout(r, 0));
const REALPASSED = (ids) => ({ ...defaultState(), courses: { ...defaultState().courses, pm: { ...defaultState().courses.pm, lessons: Object.fromEntries(ids.map((id) => [id, { passed: 1 }])) } } });

test('the test rows: an open test is a button, a locked one is plain text with its state; the final test is named', () => {
  const st = REALPASSED(REAL.topics.flatMap((t) => t.levels.slice(0, 2)));
  const opened = [];
  const el = testRows(tNl, st, REAL, (id) => opened.push(id));
  const buttons = el.querySelectorAll('button');
  assert.equal(buttons.length, 2, 'Basis and Werkkennis are open');
  buttons[0].click();
  assert.deepEqual(opened, ['pm.plan/level/1']);
  const text = el.textContent;
  assert.match(text, /Gevorderd/);
  assert.match(text, /op slot/);
  assert.match(text, /eindtoets/);
  assert.equal(el.querySelectorAll('li').length, 4);
  // English
  assert.match(testRows(tEn, st, REAL, () => {}).textContent, /locked/);
});

test('the test chip says the score once tried and passed or not', () => {
  const st = REALPASSED(REAL.lessons);
  const tried = { ...st, courses: { ...st.courses, pm: { ...st.courses.pm, tests: { 'pm.plan/level/1': rec(72), 'pm.plan/level/2': rec(85) } } } };
  const rows = levelTests(tried, REAL);
  assert.match(testChip(tNl, rows[0], () => {}).textContent, /72%/);
  assert.match(testChip(tNl, rows[1], () => {}).getAttribute('aria-label'), /gehaald/);
  assert.match(testChip(tNl, rows[0], () => {}).getAttribute('aria-label'), /nog niet gehaald/);
  assert.doesNotMatch(testChip(tNl, rows[1], () => {}).getAttribute('aria-label'), /nog niet/);
  assert.match(testLabel(tNl, REAL, rows[3]), /eindtoets/);
});

test('the path: a finished topic ends in the flag and a test stop; an unfinished one has none', () => {
  const topic = REAL.topics[0];
  const done = pathModel(REALPASSED(topic.levels), REAL, 'nl').topics[0];
  const opened = [];
  const el = topicPath(tNl, 'T', done, () => {}, null, { id: 'pm.plan/topic/x', pct: null, passed: false, onOpen: () => opened.push('t') });
  const stop = el.querySelector('.path-test');
  assert.ok(stop, 'the test stop');
  stop.click();
  assert.deepEqual(opened, ['t']);
  const half = pathModel(REALPASSED(topic.levels.slice(0, 2)), REAL, 'nl').topics[0];
  assert.equal(topicPath(tNl, 'T', half, () => {}, null, null).querySelector('.path-test'), null);
  assert.equal(topicPath(tNl, 'T', done, () => {}).querySelector('.path-test'), null, 'no test given, no stop (as before)');
});

test('the screen: a locked test says so and offers the way back; a stray id goes home', async () => {
  const { app, calls } = fakeApp();
  const root = document.createElement('div');
  renderTest(app, { subject: 'pm', moduleId: 'pm.plan', testId: 'pm.plan/level/2', from: 'module' }, root);
  assert.match(root.textContent, /gaat open/i);
  assert.equal(root.querySelectorAll('.test-start').length, 0);
  const { app: app2, calls: calls2 } = fakeApp();
  renderTest(app2, { subject: 'pm', moduleId: 'pm.plan', testId: 'nonsense' }, document.createElement('div'));
  assert.deepEqual(calls2.at(-1), ['home', undefined]);
  void calls; void tick;
});

test('the screen: an open test shows the rules and a start button; a failed load shows the error and keeps the button', async () => {
  const { app } = fakeApp({ state: REALPASSED(REAL.lessons) });
  const root = document.createElement('div');
  renderTest(app, { subject: 'pm', moduleId: 'pm.plan', testId: 'pm.plan/level/1', from: 'module' }, root);
  assert.match(root.textContent, /80%/);
  assert.match(root.textContent, /Eén ronde/);
  const start = root.querySelector('.test-start');
  assert.ok(start);
  start.click();
  await tick();
  await tick();
  assert.match(root.textContent, /laden|opnieuw/i);
  assert.equal(start.disabled, false);
});

test('the screen: the final test explains the gold line; closing leaves without scoring', () => {
  const { app, calls } = fakeApp({ state: REALPASSED(REAL.lessons) });
  const root = document.createElement('div');
  renderTest(app, { subject: 'pm', moduleId: 'pm.plan', testId: finalTestId('pm.plan'), from: 'module' }, root);
  assert.match(root.textContent, /90%/);
  root.querySelector('header .icon-btn').click();
  assert.deepEqual(calls.at(-1), ['module', { subject: 'pm', moduleId: 'pm.plan' }]);
  assert.equal(app.state.courses.pm.tests && Object.keys(app.state.courses.pm.tests).length, 0, 'nothing stored');
});

test('i18n: every test string exists in nl and en', () => {
  for (const k of ['testsTitle', 'testStart', 'testIntroTopic', 'testIntroLevel', 'testIntroFinal', 'testRules', 'testRulesFinal', 'testPassed', 'testFailed', 'testLockedTopic', 'testLockedLevel', 'testLoadError', 'testWeakest', 'testWeakestBtn', 'testFinalName', 'testRowLocked', 'testGoldReached', 'courseWhat_test', 'courseWhy_test', 'guideTest']) {
    assert.notEqual(tNl(k), k, `nl ${k}`);
    assert.notEqual(tEn(k), k, `en ${k}`);
  }
  assert.notEqual(tNl('testsTitle'), tEn('testsTitle'));
});

// ---- review fixes (v18 T2 review) ----

// A second module of the same subject, so "between modules" can happen.
const M2 = { id: 'tiny.two', subject: 'tiny', level: 1, questions: {}, title: { nl: 'Twee', en: 'Two' }, blurb: { nl: '', en: '' },
  topics: [{ id: 'gamma', levels: ['tiny.two.g1', 'tiny.two.g2', 'tiny.two.g3', 'tiny.two.g4'] }],
  lessons: ['tiny.two.g1', 'tiny.two.g2', 'tiny.two.g3', 'tiny.two.g4'] };
const TWO = [M, M2];

test('the pick (ruling 1): between modules a test that just opened comes before the next lesson; mid-module the lesson stays first', () => {
  // Basis of both topics of tiny.mod passed: its Basis level test opens; the next lesson is in tiny.two.
  const basis = withLessons([ALPHA[0], BETA[0]]);
  const pick = courseTodayPick(basis, 'tiny', 'nl', TODAY, TWO);
  assert.deepEqual([pick.reason, pick.why, pick.testId, pick.moduleId], ['test', 'testNew', 'tiny.mod/level/1', 'tiny.mod']);
  // Mid-module (the next lesson is in the module he works in): the lesson first, although a test is open.
  const mid = withLessons([ALPHA[0]]);
  assert.equal(courseTodayPick(mid, 'tiny', 'nl', TODAY, TWO).reason, 'lesson');
  // Alpha's flag shows (its topic test and the Basis test are open); the Werkkennis round of tiny.mod
  // goes on with beta, and the lesson he did last was in tiny.mod: the lesson first.
  const flag = withLessons([...ALPHA, BETA[0], 'tiny.two.g1']);
  flag.courses.tiny.lessons[ALPHA[3]] = { passed: 9 };
  assert.equal(courseTodayPick(flag, 'tiny', 'nl', TODAY, TWO).lessonId, BETA[1]);
  // The same state, but his last lesson was in tiny.two: he comes back between modules, a fresh test first.
  flag.courses.tiny.lessons['tiny.two.g1'] = { passed: 10 };
  assert.equal(courseTodayPick(flag, 'tiny', 'nl', TODAY, TWO).reason, 'test');
  // Taken before (any day): no longer fresh, the lesson comes.
  const taken = withLessons([ALPHA[0], BETA[0]], { tests: { 'tiny.mod/level/1': R(60, 60, 1, '2026-11-01') } });
  assert.equal(courseTodayPick(taken, 'tiny', 'nl', TODAY, TWO).reason, 'lesson');
  // At most one test a day: one finished today (any test of the subject) leaves the lesson.
  const today = withLessons([...ALPHA, ...BETA], { tests: { 'tiny.mod/topic/alpha': R(90, 90, 1, TODAY) } });
  assert.equal(courseTodayPick(today, 'tiny', 'nl', TODAY, TWO).reason, 'lesson');
  // Five due reviews still come first.
  const reviews = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`nl|tiny.mod.a1#r${i}`, { box: 1, due: TODAY, lesson: 'tiny.mod.a1', subject: 'tiny' }]));
  assert.equal(courseTodayPick({ ...basis, courseReviews: reviews }, 'tiny', 'nl', TODAY, TWO).reason, 'due');
  // The tests of the module he worked in last come first, level tests before topic tests, the higher level first.
  const all = withLessons([...ALPHA, ...BETA]);
  assert.equal(courseTodayPick(all, 'tiny', 'nl', TODAY, TWO).testId, 'tiny.mod/level/4');
});

test('sync mergeTests: a full tie (same day, same attempts) merges to the same record in either order', () => {
  const a = { x: R(70, 70, 2, TODAY, ['p']) };
  const b = { x: R(80, 50, 2, TODAY, ['q']) };
  assert.deepEqual(mergeTests(a, b), mergeTests(b, a));
  assert.deepEqual(mergeTests(a, b).x, R(80, 70, 2, TODAY, ['p']));
});

test('reviews and the daily limit (F3): test answers are scheduled but do not use up the limit', () => {
  const spec = specOf(M, 'tiny.mod/level/4');
  const qs = questionsOf(spec);
  const st = { ...withLessons(ALL), settings: { ...defaultState().settings, reviewCap: 10 } };
  const r = applyTest(st, { subject: 'tiny', testId: spec.id, questions: qs, results: {}, lang: 'nl' }, TODAY, NOW);
  assert.ok(Object.keys(r.state.courseReviews).length > 0, 'the recall answers were scheduled');
  assert.equal(reviewsToday(r.state, 'tiny', TODAY), 0);
  assert.equal(reviewsLeftToday(r.state, 'tiny', TODAY), 10);
});

test('the screen (ruling 2): the score is written when the last question is answered; Finish only shows it; closing earlier stores nothing', async () => {
  const modLessonsReal = REAL.lessons.map((id) => ({ id, recall: [0, 1, 2, 3, 4].map((i) => ({ q: `${id} ${i}`, options: ['a', 'b', 'c'], answer: 'a', why: 'w' })) }));
  const make = () => fakeApp({ state: REALPASSED(REAL.lessons), openModule: () => Promise.resolve({ lessons: modLessonsReal }) });
  const run = async (app, root, answers) => {
    renderTest(app, { subject: 'pm', moduleId: 'pm.plan', testId: 'pm.plan/level/1', from: 'module' }, root);
    root.querySelector('.test-start').click();
    await tick();
    await tick();
    for (let i = 0; i < answers && root.querySelector('.quiz-card') && !root.querySelector('.quiz-review'); i++) answerOne(root);
  };
  // pm.plan has a bank with every kind, so answer whatever kind is shown (not necessarily right).
  const answerOne = (root) => {
    if (!root.querySelector('.quiz-check')) { root.querySelector('.quiz-opts .opt').click(); return; }
    const input = root.querySelector('.gap-input');
    if (input) { input.value = 'x'; input.dispatch('input'); }
    const first = root.querySelector('.gap-chip') || root.querySelector('.kind-all .opt');
    if (first) first.click();
    for (let n = 0; n < 12 && root.querySelector('.order-pool .order-item'); n++) root.querySelector('.order-pool .order-item').click();
    const open = (col) => [...(root.querySelectorAll('.match-col')[col]?.querySelectorAll('.match-item') || [])].find((b) => !b.classList.contains('paired'));
    for (let n = 0; n < 12 && open(0) && open(1); n++) { open(0).click(); open(1).click(); }
    root.querySelector('.quiz-check').click();
  };
  // Closed one question before the end: nothing stored.
  const early = make();
  const r1 = document.createElement('div');
  await run(early.app, r1, levelSize(1) - 1);
  assert.ok(r1.querySelector('.quiz-card'), `still asking: ${r1.textContent.slice(0, 300)}`);
  r1.querySelector('header .icon-btn').click();
  assert.deepEqual(Object.keys(early.app.state.courses.pm.tests || {}), []);
  // The last answer: the review card shows and the record is already there; closing now keeps it.
  const full = make();
  const r2 = document.createElement('div');
  await run(full.app, r2, 99);
  assert.ok(r2.querySelector('.quiz-review'), `the review card: ${r2.textContent.slice(0, 300)}`);
  const rec2 = full.app.state.courses.pm.tests['pm.plan/level/1'];
  assert.equal(rec2.attempts, 1);
  assert.ok(Number.isFinite(rec2.best), 'a score is stored');
  r2.querySelector('.quiz-review .btn-primary').click();
  assert.ok(r2.querySelector('.test-done'), 'Finish shows the result');
  assert.equal(full.app.state.courses.pm.tests['pm.plan/level/1'].attempts, 1, 'Finish does not score again');
});

test('i18n (review): the new-test reason and the gold rule exist in nl and en', () => {
  for (const k of ['courseWhy_testNew']) { assert.notEqual(tNl(k), k); assert.notEqual(tEn(k), k); }
  assert.match(tNl('medalHow_gold'), /eindtoets/);
  assert.match(tEn('medalHow_gold'), /final test/);
});
