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

import { moduleMastery, recommendedModule, nextLesson, courseTodayPick, glossary } from '../src/core/course.js';

const MODS = [
  { id: 'eng.flow', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.flow.a', 'eng.flow.b'], questions: { 'eng.flow.a': 2, 'eng.flow.b': 1 } },
  { id: 'eng.machining', subject: 'eng', track: 'discrete', level: 1, lessons: ['eng.machining.a'], questions: { 'eng.machining.a': 1 } },
  { id: 'eng.quality', subject: 'eng', track: 'basics', level: 2, lessons: ['eng.quality.a'], questions: { 'eng.quality.a': 1 } },
  { id: 'pm.intake', subject: 'pm', track: 'project', level: 1, lessons: ['pm.intake.ask'], questions: { 'pm.intake.ask': 1 } },
];
const passed = (st, ...ids) => ids.reduce((s, id) => ({ ...s, courses: { ...s.courses, [id.split('.')[0]]: { ...s.courses[id.split('.')[0]], lessons: { ...s.courses[id.split('.')[0]].lessons, [id]: { read: 1, passed: 1 } } } } }), st);
const own = (st, lang, ...qids) => ({ ...st, courseReviews: { ...st.courseReviews, ...Object.fromEntries(qids.map((q) => [`${lang}|${q}`, { box: 4, due: '2026-12-30', lesson: q.split('#')[0], subject: q.split('.')[0] }])) } });

test('mastery: learn until all lessons passed, practise until all questions owned, then own', () => {
  const m = MODS[0];
  let s = defaultState();
  assert.equal(moduleMastery(s, m, 'nl'), 'learn');
  s = passed(s, 'eng.flow.a');
  assert.equal(moduleMastery(s, m, 'nl'), 'learn');
  s = passed(s, 'eng.flow.b');
  assert.equal(moduleMastery(s, m, 'nl'), 'practise');
  s = own(s, 'nl', 'eng.flow.a#r0', 'eng.flow.a#r1', 'eng.flow.b#r0');
  assert.equal(moduleMastery(s, m, 'nl'), 'own');
  assert.equal(moduleMastery(s, m, 'en'), 'practise', 'owning is per language');
});

test('recommendation: a module in progress first, then the lowest level across tracks, in index order', () => {
  let s = defaultState();
  assert.equal(recommendedModule(s, 'eng', MODS), 'eng.flow');
  s = passed(s, 'eng.flow.a');
  assert.equal(recommendedModule(s, 'eng', MODS), 'eng.flow');
  assert.equal(nextLesson(s, MODS[0]), 'eng.flow.b');
  s = passed(s, 'eng.flow.b');
  assert.equal(recommendedModule(s, 'eng', MODS), 'eng.machining', 'level 1 in another track before level 2');
  s = passed(s, 'eng.machining.a');
  assert.equal(recommendedModule(s, 'eng', MODS), 'eng.quality');
  s = passed(s, 'eng.quality.a');
  assert.equal(recommendedModule(s, 'eng', MODS), null);
  assert.equal(recommendedModule(s, 'pm', MODS), 'pm.intake');
});

test('course today: due ≥ 5 beats a lesson; then lesson, situation, say-it, any due, maintenance, done', () => {
  const day = '2026-11-02';
  let s = defaultState();
  assert.deepEqual(courseTodayPick(s, 'eng', 'nl', day, MODS), { reason: 'lesson', moduleId: 'eng.flow', lessonId: 'eng.flow.a' });
  const due5 = { ...s, courseReviews: Object.fromEntries([0, 1, 2, 3, 4].map((i) => [`nl|eng.flow.a#r${i}`, { box: 1, due: day, lesson: 'eng.flow.a', subject: 'eng' }])) };
  assert.deepEqual(courseTodayPick(due5, 'eng', 'nl', day, MODS), { reason: 'due', count: 5 });
  s = passed(s, 'eng.flow.a', 'eng.flow.b', 'eng.machining.a', 'eng.quality.a');
  assert.deepEqual(courseTodayPick(s, 'eng', 'nl', day, MODS), { reason: 'situation', moduleId: 'eng.flow', lessonId: 'eng.flow.a' });
  for (const id of ['eng.flow.a', 'eng.flow.b', 'eng.machining.a', 'eng.quality.a']) s.courses.eng.lessons[id].situation = { pts: 2, ts: 1 };
  assert.deepEqual(courseTodayPick(s, 'eng', 'nl', day, MODS), { reason: 'sayIt', moduleId: 'eng.flow', lessonId: 'eng.flow.a' });
  for (const id of ['eng.flow.a', 'eng.flow.b', 'eng.machining.a', 'eng.quality.a']) s.courses.eng.lessons[id].sayIt = 1;
  const due1 = { ...s, courseReviews: { 'nl|eng.flow.a#r0': { box: 2, due: day, lesson: 'eng.flow.a', subject: 'eng' } } };
  assert.deepEqual(courseTodayPick(due1, 'eng', 'nl', day, MODS), { reason: 'due', count: 1 });
  const owned = own(s, 'nl', 'eng.flow.a#r0');
  assert.deepEqual(courseTodayPick(owned, 'eng', 'nl', day, MODS), { reason: 'maintain', questionId: 'eng.flow.a#r0' });
  const doneWeek = { ...owned, courses: { ...owned.courses, eng: { ...owned.courses.eng, lastMaintenance: '2026-W45' } } };
  assert.deepEqual(courseTodayPick(doneWeek, 'eng', 'nl', day, MODS), { reason: 'done' });
});

test('glossary: every term with its lesson, sorted without regard to case', () => {
  const g = glossary([{ id: 'eng.flow', lessons: [
    { id: 'eng.flow.a', terms: [{ term: 'takt', def: 'd1' }, { term: 'WIP', def: 'd2' }] },
    { id: 'eng.flow.b', terms: [{ term: 'Bottleneck', def: 'd3' }] },
  ] }]);
  assert.deepEqual(g.map((x) => x.term), ['Bottleneck', 'takt', 'WIP']);
  assert.equal(g[1].lessonId, 'eng.flow.a');
  assert.equal(g[1].moduleId, 'eng.flow');
});

import { lessonPhases, recallQuestions, questionById } from '../src/core/course.js';
import { isRebuildableId } from '../src/core/share.js';

test('lesson phases: pre only when there are prequestions', () => {
  assert.deepEqual(lessonPhases({ pre: [{}], teach: ['a'] }), ['pre', 'teach', 'example', 'quiz']);
  assert.deepEqual(lessonPhases({ pre: [], teach: ['a'] }), ['teach', 'example', 'quiz']);
});

test('recall questions get stable ids; questionById resolves them', () => {
  const lesson = { id: 'eng.flow.takt', recall: [choice('x'), choice('y'), choice('z', 'c')] };
  const qs = recallQuestions(lesson);
  assert.deepEqual(qs.map((q) => q.id), ['eng.flow.takt#r0', 'eng.flow.takt#r1', 'eng.flow.takt#r2']);
  assert.equal(questionById([{ lessons: [lesson] }], 'eng.flow.takt#r2').answer, 'c');
  assert.equal(questionById([{ lessons: [lesson] }], 'eng.flow.takt#r9'), null);
  assert.equal(questionById([{ lessons: [lesson] }], 'eng.flow.other#r0'), null);
});

test('course say-it prompts never enter the speaking review queue', () => {
  assert.equal(isRebuildableId('course:eng.flow.takt'), false);
});

import { courseSummary } from '../src/core/course.js';

test('courseSummary: owned per track, due count, a 14-day strip ending today, recent situations', () => {
  const day = '2026-11-02';
  let s = passed(defaultState(), 'eng.flow.a', 'eng.flow.b');
  s = own(s, 'nl', 'eng.flow.a#r0', 'eng.flow.a#r1', 'eng.flow.b#r0');
  s.courseReviews['nl|eng.machining.a#r0'] = { box: 1, due: day, lesson: 'eng.machining.a', subject: 'eng' };
  s.courses.eng.sessions = [
    { day, kind: 'lesson', correct: 3, total: 4, ts: 3 },
    { day: '2026-11-01', kind: 'situation', lessonId: 'eng.flow.a', correct: 2, total: 3, ts: 2 },
    { day: '2026-10-01', kind: 'due', correct: 1, total: 1, ts: 1 },
  ];
  const sum = courseSummary(s, 'eng', 'nl', day, MODS);
  assert.deepEqual(sum.tracks, [{ track: 'basics', owned: 1, total: 2 }, { track: 'discrete', owned: 0, total: 1 }, { track: 'grid', owned: 0, total: 0 }]);
  assert.equal(sum.due, 1);
  assert.equal(sum.strip.length, 14);
  assert.equal(sum.strip[13], 1);
  assert.equal(sum.strip[12], 1);
  assert.deepEqual(sum.situations, [{ lessonId: 'eng.flow.a', pts: 2, ts: 2 }]);
});

test('retaking a passed lesson never moves a question up without spacing (only a miss resets it)', () => {
  const firstTry = { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': true };
  let s = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW).state;
  s = applyLesson(s, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW + 1).state;
  s = applyLesson(s, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW + 2).state;
  assert.equal(s.courseReviews['nl|eng.flow.takt#r0'].box, 2, 'still box 2 after same-day retakes');
  s = applyLesson(s, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry: { 'eng.flow.takt#r0': false }, lang: 'nl' }, TODAY, NOW + 3).state;
  assert.equal(s.courseReviews['nl|eng.flow.takt#r0'].box, 1, 'a miss still resets');
});

import { backQuiz } from '../src/core/course.js';

test('quiz: back undoes the previous answer within a pass, so it can be answered again', () => {
  const qs = [choice('l#r0'), choice('l#r1'), choice('l#r2')];
  let s = startQuiz(qs);
  assert.equal(backQuiz(s, qs), s, 'nothing to undo on the first question');
  s = answerQuiz(s, qs, 'a'); // wrong by accident
  s = backQuiz(s, qs);
  assert.equal(s.i, 0);
  assert.equal('l#r0' in s.firstTry, false);
  assert.deepEqual(s.misses, []);
  s = answerQuiz(s, qs, 'b');
  s = answerQuiz(s, qs, 'b');
  s = answerQuiz(s, qs, 'b');
  assert.equal(s.phase, 'review');
  assert.equal(backQuiz(s, qs), s, 'no going back once the answers are shown');
  assert.deepEqual(s.firstTry, { 'l#r0': true, 'l#r1': true, 'l#r2': true });
});

import { guessFeedback, lessonBack } from '../src/core/course.js';

test('guess feedback: each guess next to the right answer and the why; unanswered ones are skipped', () => {
  const lesson = { pre: [{ q: 'A?', options: ['x', 'y'], answer: 'y', why: 'wy' }, { q: 'N?', number: 50, tolerance: 0, unit: 's', why: 'wn' }, { q: 'C?', options: ['p', 'q'], answer: 'p', why: 'wc' }] };
  const fb = guessFeedback(lesson, ['x', '50', undefined]);
  assert.equal(fb.length, 2);
  assert.deepEqual(fb[0], { q: 'A?', guess: 'x', answer: 'y', ok: false, why: 'wy' });
  assert.deepEqual(fb[1], { q: 'N?', guess: '50 s', answer: '50 s', ok: true, why: 'wn' });
});

test('lesson back: one step back at a time, through guesses, read blocks, example and check', () => {
  const lesson = { pre: [{}, {}], teach: ['a', 'b', 'c'], example: {}, recall: [] };
  const phases = ['pre', 'teach', 'example', 'quiz'];
  const b = (p, block = 0, pre = 0) => lessonBack({ p, block, pre }, phases, lesson);
  assert.equal(b(0, 0, 0), null, 'nothing before the first guess');
  assert.deepEqual(b(0, 0, 1), { p: 0, block: 0, pre: 0 });
  assert.deepEqual(b(1, 0, 1), { p: 0, block: 0, pre: 1 }, 'from the first read block to the last guess');
  assert.deepEqual(b(1, 2, 1), { p: 1, block: 1, pre: 1 });
  assert.deepEqual(b(2, 0, 1), { p: 1, block: 2, pre: 1 }, 'from the example to the last read block');
  assert.deepEqual(b(3, 0, 1), { p: 2, block: 0, pre: 1 });
});
