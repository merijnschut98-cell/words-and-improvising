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

test('applyCheck: a perfect check with silver awards gold and returns it', () => {
  const real = { id: 'eng.flow', subject: 'eng' };
  const ids = ['eng.flow.takt', 'eng.flow.balance', 'eng.flow.precedence', 'eng.flow.staffing', 'eng.flow.bottleneck', 'eng.flow.capacity', 'eng.flow.toc', 'eng.flow.throughput', 'eng.flow.oee', 'eng.flow.downtime', 'eng.flow.teep', 'eng.flow.oeecase', 'eng.flow.changeover', 'eng.flow.smed', 'eng.flow.batch', 'eng.flow.wheel'];
  const lessons = Object.fromEntries(ids.map((id) => [id, { passed: 1, perfect: 2 }]));
  const s = { ...defaultState(), courses: { eng: { lessons, sessions: [], medals: { 'eng.flow': { tier: 'silver', ts: 1 } } }, pm: { lessons: {}, sessions: [] } } };
  const r = applyCheck(s, { subject: real.subject, moduleId: real.id, results: { 'eng.flow.takt#r0': true }, lang: 'nl' }, TODAY, NOW);
  assert.deepEqual(r.medals, [{ subject: 'eng', moduleId: 'eng.flow', tier: 'gold' }]);
  assert.equal(r.state.courses.eng.medals['eng.flow'].tier, 'gold');
  const miss = applyCheck(s, { subject: real.subject, moduleId: real.id, results: { 'eng.flow.takt#r0': false }, lang: 'nl' }, TODAY, NOW);
  assert.deepEqual(miss.medals, []);
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

// ---- The check screen (UI, on a tiny fake DOM) ----
import { installFakeDom } from './fixtures/fakedom.js';
import { translator } from '../src/i18n.js';
import { MODULES } from '../src/content/courses/index.js';

installFakeDom();
const { renderQuiz } = await import('../src/ui/quiz.js');
const { checkEntry } = await import('../src/ui/flairui.js');
const { renderCheck } = await import('../src/ui/modulecheck.js');
const tNl = translator('nl');
const fakeApp = (over = {}) => ({ t: tNl, lang: 'nl', state: defaultState(), navSeq: 1, today: () => TODAY, go() {}, setState(s) { this.state = s; }, ...over });
const flat = (el) => [el, ...el.querySelectorAll('button')];

test('renderQuiz onePass: no hint button, no back button, done after the first review', () => {
  const qs = [{ id: 'eng.fx.a#r0', q: 'q0', options: ['a', 'b', 'c', 'd'], answer: 'a', why: 'w' }, { id: 'eng.fx.b#r0', q: 'q1', options: ['a', 'b', 'c', 'd'], answer: 'a', why: 'w' }];
  const box = document.createElement('div');
  const done = [];
  renderQuiz(fakeApp(), { questions: qs, onePass: true, termsOf: () => [{ term: 'a', def: 'the letter a' }], onDone: (ft, sure) => done.push([ft, sure]) }, box);
  assert.equal(box.querySelector('.quiz-hint-btn'), null);
  assert.equal(box.querySelector('.quiz-back'), null);
  box.querySelectorAll('.opt')[0].click();
  assert.equal(box.querySelector('.quiz-hint-btn'), null);
  assert.equal(box.querySelector('.quiz-back'), null, 'no back on the second question either');
  box.querySelectorAll('.opt')[1].click();
  assert.ok(box.querySelector('.quiz-review'));
  const finish = box.querySelector('.quiz-review .btn-primary');
  assert.equal(finish.textContent, tNl('quizFinish'));
  finish.click();
  assert.equal(done.length, 1);
  assert.deepEqual(done[0][0], { 'eng.fx.a#r0': true, 'eng.fx.b#r0': false });
});

test('the check button is absent without bronze and says checkTomorrow after today\'s attempt', () => {
  assert.equal(checkEntry(tNl, { tier: null, check: null }, () => {}), null);
  let opened = 0;
  const btn = checkEntry(tNl, { tier: 'bronze', check: 'open' }, () => { opened++; });
  assert.equal(btn.tagName, 'BUTTON');
  assert.ok(btn.classList.contains('check-btn'));
  assert.ok(!btn.classList.contains('btn-primary'));
  assert.match(btn.textContent, /Modulecheck/);
  btn.click();
  assert.equal(opened, 1);
  const later = checkEntry(tNl, { tier: 'bronze', check: 'tomorrow' }, () => {});
  assert.notEqual(later.tagName, 'BUTTON');
  assert.equal(later.textContent, tNl('checkTomorrow'));
});

test('a module file that fails to load shows loadError and keeps the button usable', async () => {
  const meta = MODULES.find((m) => m.id === 'eng.flow');
  const lessons = Object.fromEntries(meta.lessons.map((id) => [id, { passed: 1 }]));
  const state = { ...defaultState(), courses: { ...defaultState().courses, eng: { ...defaultState().courses.eng, lessons, medals: { 'eng.flow': { tier: 'bronze', ts: 1 } } } } };
  let tries = 0;
  const app = fakeApp({ state, openModule: () => { tries++; return Promise.reject(new Error('offline')); } });
  const root = document.createElement('div');
  renderCheck(app, { subject: 'eng', moduleId: 'eng.flow' }, root);
  const start = root.querySelector('.check-start');
  assert.ok(start);
  assert.match(root.textContent, /Tien vragen uit de hele module/);
  start.click();
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(root.querySelector('.note').textContent, tNl('loadError'));
  assert.equal(start.disabled, false, 'the button works again');
  start.click();
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(tries, 2);
});
