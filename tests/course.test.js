import { test } from 'node:test';
import assert from 'node:assert/strict';
import { judge, startQuiz, answerQuiz, continueQuiz, applyLesson, applyDue, applySituation, markSayIt } from '../src/core/course.js';
import { defaultState } from '../src/core/storage.js';

const TODAY = '2026-11-02';
const NOW = new Date(2026, 10, 2, 9).getTime();
const choice = (id, answer = 'b') => ({ id, q: 'q?', options: ['a', 'b', 'c', 'd'], answer, why: 'w' });

test('judge: choice by exact option; numeric within tolerance, never exact float compare', () => {
  assert.equal(judge(choice('x'), 'b'), true);
  assert.equal(judge(choice('x'), 'a'), false);
  const n = { id: 'n', q: 'OEE?', number: 0.85, tolerance: 0.02, unit: '', why: 'w' };
  assert.equal(judge(n, 0.86), true);
  assert.equal(judge(n, '0.84'), true);
  assert.equal(judge(n, '0,86'), true, 'Dutch decimal comma');
  assert.equal(judge(n, 0.9), false);
  assert.equal(judge(n, ''), false);
  assert.equal(judge(n, 'abc'), false);
  assert.equal(judge({ ...n, number: 0.3, tolerance: 0.0001 }, 0.1 + 0.2), true);
});

test('quiz: one miss goes ask → review → ask (misses only) → review → done; firstTry keeps the first result', () => {
  const qs = [choice('l#r0'), choice('l#r1'), choice('l#r2')];
  let s = startQuiz(qs);
  assert.equal(s.phase, 'ask');
  s = answerQuiz(s, qs, 'b');
  s = answerQuiz(s, qs, 'a');
  s = answerQuiz(s, qs, 'b');
  assert.equal(s.phase, 'review');
  assert.deepEqual(s.misses, [1]);
  s = continueQuiz(s);
  assert.deepEqual([s.phase, s.order, s.pass], ['ask', [1], 2]);
  s = answerQuiz(s, qs, 'b');
  assert.equal(s.phase, 'review');
  assert.deepEqual(s.misses, []);
  s = continueQuiz(s);
  assert.equal(s.phase, 'done');
  assert.deepEqual(s.firstTry, { 'l#r0': true, 'l#r1': false, 'l#r2': true });
});

test('applyLesson: 20 XP the first time, 0 on a retake; passed stays the first time; days and streak count each session', () => {
  const firstTry = { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': false };
  let { state, xp } = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW);
  assert.equal(xp, 20);
  assert.equal(state.xp, 20);
  assert.equal(state.days[TODAY], 1);
  assert.deepEqual(state.streak, { count: 1, lastDay: TODAY });
  const p = state.courses.eng.lessons['eng.flow.takt'];
  assert.equal(p.passed, NOW);
  assert.equal(state.courseReviews['nl|eng.flow.takt#r0'].box, 2);
  assert.equal(state.courseReviews['nl|eng.flow.takt#r1'].box, 1);
  const again = applyLesson(state, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW + 1000);
  assert.equal(again.xp, 0);
  assert.equal(again.state.xp, 20);
  assert.equal(again.state.days[TODAY], 2);
  assert.equal(again.state.courses.eng.lessons['eng.flow.takt'].passed, NOW);
  assert.equal(again.state.courses.eng.sessions.length, 2);
  assert.deepEqual(again.state.courses.eng.sessions[1], { day: TODAY, kind: 'lesson', lessonId: 'eng.flow.takt', correct: 1, total: 2, ts: NOW });
});

test('applyDue: 10 XP plus 1 per correct, capped at 20; schedules each; logs the session', () => {
  const results = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`eng.flow.takt#r${i}`, true]));
  const { state, xp } = applyDue(defaultState(), { subject: 'eng', results, lang: 'nl' }, TODAY, NOW);
  assert.equal(xp, 20);
  assert.equal(state.courseReviews['nl|eng.flow.takt#r3'].lesson, 'eng.flow.takt');
  assert.equal(state.courses.eng.sessions[0].kind, 'due');
  assert.equal(state.days[TODAY], 1);
  const few = applyDue(defaultState(), { subject: 'eng', results: { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': false }, lang: 'nl' }, TODAY, NOW);
  assert.equal(few.xp, 11);
});

test('applyDue with a maintenance question records the ISO week', () => {
  const { state } = applyDue(defaultState(), { subject: 'eng', results: { 'eng.flow.takt#r0': true }, lang: 'nl', maintenance: true }, TODAY, NOW);
  assert.equal(state.courses.eng.lastMaintenance, '2026-W45');
});

test('applySituation: 10 XP the first time only, no round counted', () => {
  const a = applySituation(defaultState(), { subject: 'pm', lessonId: 'pm.intake.ask', pts: 2 }, TODAY, NOW);
  assert.equal(a.xp, 10);
  assert.equal(a.state.days[TODAY], undefined);
  assert.deepEqual(a.state.courses.pm.lessons['pm.intake.ask'].situation, { pts: 2, ts: NOW });
  const b = applySituation(a.state, { subject: 'pm', lessonId: 'pm.intake.ask', pts: 3 }, TODAY, NOW + 1);
  assert.equal(b.xp, 0);
  assert.equal(b.state.courses.pm.lessons['pm.intake.ask'].situation.pts, 3);
});

test('markSayIt stores the time; sessions are capped at 200', () => {
  const s = markSayIt(defaultState(), 'eng', 'eng.flow.oee', NOW);
  assert.equal(s.courses.eng.lessons['eng.flow.oee'].sayIt, NOW);
  let st = defaultState();
  for (let i = 0; i < 205; i++) st = applyDue(st, { subject: 'eng', results: { 'eng.flow.takt#r0': true }, lang: 'nl' }, TODAY, NOW + i).state;
  assert.equal(st.courses.eng.sessions.length, 200);
  assert.equal(st.courses.eng.sessions[0].ts, NOW + 204);
});
