import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkOpen, checkQuestions, applyCheck, CHECK_SIZE } from '../src/core/modulecheck.js';
import { defaultState } from '../src/core/storage.js';

const TODAY = '2026-11-02';
const NOW = new Date(2026, 10, 2, 9).getTime();
const META = { id: 'eng.fx', subject: 'eng', lessons: ['eng.fx.a', 'eng.fx.b', 'eng.fx.c', 'eng.fx.d'], questions: { 'eng.fx.a': 4, 'eng.fx.b': 4, 'eng.fx.c': 4, 'eng.fx.d': 4 } };
const q = (i) => ({ q: `q${i}`, options: ['a', 'b', 'c', 'd'], answer: 'a', why: 'w' });
const MOD = { id: 'eng.fx', lessons: META.lessons.map((id) => ({ id, title: id, recall: [q(0), q(1), q(2), q(3)] })) };
const passedAll = (extra = {}) => ({ ...defaultState(), courses: { eng: { lessons: Object.fromEntries(META.lessons.map((id) => [id, { passed: 1 }])), sessions: [], ...extra }, pm: { lessons: {}, sessions: [] } } });

test('checkOpen: closed without bronze, open with bronze, closed again after an attempt today', () => {
  assert.equal(checkOpen(defaultState(), META, TODAY), false);
  assert.equal(checkOpen(passedAll(), META, TODAY), true);
  assert.equal(checkOpen(passedAll({ checks: { 'eng.fx': { last: TODAY, best: 5, total: 10, perfect: null } } }), META, TODAY), false);
  assert.equal(checkOpen(passedAll({ checks: { 'eng.fx': { last: '2026-11-01', best: 5, total: 10, perfect: null } } }), META, TODAY), true);
});

test('checkQuestions: 10 questions, one per level before any level repeats, same set for the same day and module', () => {
  assert.equal(CHECK_SIZE, 10);
  const a = checkQuestions(MOD, META, TODAY);
  assert.equal(a.length, 10);
  assert.equal(new Set(a.map((x) => x.id)).size, 10);
  const lessonOf = (id) => id.split('#')[0];
  assert.equal(new Set(a.slice(0, 4).map((x) => lessonOf(x.id))).size, 4, 'the first four cover every level');
  const counts = META.lessons.map((id) => a.filter((x) => lessonOf(x.id) === id).length);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, 'spread over the levels');
  assert.deepEqual(checkQuestions(MOD, META, TODAY).map((x) => x.id), a.map((x) => x.id));
  assert.ok(a.every((x) => /#r\d$/.test(x.id)));
});

test('checkQuestions: a module with fewer than 10 questions asks all of them', () => {
  const small = { id: 'eng.fx', lessons: META.lessons.map((id) => ({ id, recall: [q(0), q(1)] })) };
  assert.equal(checkQuestions(small, META, TODAY).length, 8);
});

test('applyCheck: counts a round, 20 XP the first finish, +10 the first perfect, 0 after', () => {
  const miss = { 'eng.fx.a#r0': true, 'eng.fx.b#r0': false };
  const all = { 'eng.fx.a#r0': true, 'eng.fx.b#r0': true };
  const a = applyCheck(passedAll(), { subject: 'eng', moduleId: 'eng.fx', results: miss, lang: 'nl' }, TODAY, NOW);
  assert.equal(a.xp, 20);
  assert.equal(a.state.days[TODAY], 1);
  assert.equal(a.state.xpDays[TODAY], 20);
  const b = applyCheck(a.state, { subject: 'eng', moduleId: 'eng.fx', results: all, lang: 'nl' }, '2026-11-03', NOW + 86400000);
  assert.equal(b.xp, 10);
  assert.equal(b.perfect, true);
  const c = applyCheck(b.state, { subject: 'eng', moduleId: 'eng.fx', results: all, lang: 'nl' }, '2026-11-04', NOW + 2 * 86400000);
  assert.equal(c.xp, 0);
  assert.equal(c.state.days['2026-11-04'], 1, 'still a round');
  const first = applyCheck(passedAll(), { subject: 'eng', moduleId: 'eng.fx', results: all, lang: 'nl' }, TODAY, NOW);
  assert.equal(first.xp, 30, 'first finish and first perfect at once');
});

test('applyCheck: schedules reviews like a due session; a right answer before due does not climb', () => {
  const s = { ...passedAll(), courseReviews: { 'nl|eng.fx.a#r0': { box: 2, due: '2026-11-09', lesson: 'eng.fx.a', subject: 'eng' } } };
  const r = applyCheck(s, { subject: 'eng', moduleId: 'eng.fx', results: { 'eng.fx.a#r0': true, 'eng.fx.b#r1': false }, lang: 'nl' }, TODAY, NOW);
  assert.equal(r.state.courseReviews['nl|eng.fx.a#r0'].box, 2);
  assert.equal(r.state.courseReviews['nl|eng.fx.b#r1'].box, 1);
});

test('applyCheck: stores best, total, last and the first perfect ts', () => {
  const r1 = applyCheck(passedAll(), { subject: 'eng', moduleId: 'eng.fx', results: { a: true, b: false, c: true }, lang: 'nl' }, TODAY, NOW);
  assert.deepEqual(r1.state.courses.eng.checks['eng.fx'], { last: TODAY, best: 2, total: 3, perfect: null });
  const r2 = applyCheck(r1.state, { subject: 'eng', moduleId: 'eng.fx', results: { a: true, b: true, c: true }, lang: 'nl' }, '2026-11-03', NOW + 5);
  assert.deepEqual(r2.state.courses.eng.checks['eng.fx'], { last: '2026-11-03', best: 3, total: 3, perfect: NOW + 5 });
  const r3 = applyCheck(r2.state, { subject: 'eng', moduleId: 'eng.fx', results: { a: false, b: true, c: true }, lang: 'nl' }, '2026-11-04', NOW + 9);
  assert.deepEqual(r3.state.courses.eng.checks['eng.fx'], { last: '2026-11-04', best: 3, total: 3, perfect: NOW + 5 });
  assert.equal(r3.state.courses.eng.sessions[0].kind, 'check');
});
