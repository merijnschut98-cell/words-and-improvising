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
  assert.deepEqual(sum.tracks, [{ track: 'basics', owned: 1, total: 2 }, { track: 'discrete', owned: 0, total: 1 }, { track: 'grid', owned: 0, total: 0 }, { track: 'it', owned: 0, total: 0 }]);
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

// Polish: going back shows what he picked the first time.
test('quiz: back keeps the taken-back answer and its guess flag as prev, for that question only', () => {
  const qs = [choice('l#r0'), choice('l#r1'), { id: 'l#r2', q: 'n?', number: 50, tolerance: 0, unit: 's', why: 'w' }];
  let s = startQuiz(qs);
  assert.equal(s.prev, null, 'nothing picked before the first answer');
  s = answerQuiz(s, qs, 'a', false);
  s = backQuiz(s, qs);
  assert.deepEqual(s.prev, { id: 'l#r0', value: 'a', sure: false });
  s = answerQuiz(s, qs, 'b');
  assert.equal(s.prev, null, 'answering again clears it');
  s = answerQuiz(s, qs, 'c');
  s = answerQuiz(s, qs, '49,5');
  assert.equal(s.phase, 'review');
  s = continueQuiz(s);
  s = answerQuiz(s, qs, 'b', true);
  s = backQuiz(s, qs);
  assert.deepEqual(s.prev, { id: 'l#r1', value: 'b', sure: true }, 'a later pass keeps the value too');
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

import { prepQuestions } from '../src/core/course.js';

// Before the meeting: refresh what he learned for a real event.
const PMODS = [
  { id: 'eng.flow', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.flow.a', 'eng.flow.b'], questions: { 'eng.flow.a': 3, 'eng.flow.b': 2 } },
  { id: 'eng.quality', subject: 'eng', track: 'basics', level: 2, lessons: ['eng.quality.a'], questions: { 'eng.quality.a': 4 } },
];
const PDAY = '2026-11-02';
const rv = (box, due, lesson = 'eng.flow.a') => ({ box, due, lesson, subject: 'eng' });
const prepState = () => {
  let s = passed(defaultState(), 'eng.flow.a');
  s = { ...s, courseReviews: {
    'nl|eng.flow.a#r0': rv(4, '2026-11-20'),
    'nl|eng.flow.a#r1': rv(2, '2026-11-09'),
    'nl|eng.flow.a#r2': rv(2, '2026-11-05'),
    'nl|eng.flow.b#r0': rv(1, '2026-11-03', 'eng.flow.b'),
  } };
  return { ...s, events: [{ id: 'ev1', type: 'client', date: '2026-11-04', text: 'Line review at the plant', reflection: null, topics: ['eng.flow'] }] };
};

test('prepQuestions: passed lessons only, lowest box then soonest due, owned last; none below three', () => {
  const s = prepState();
  assert.deepEqual(prepQuestions(s, s.events[0], 'nl', PDAY, 5, PMODS), ['eng.flow.a#r2', 'eng.flow.a#r1', 'eng.flow.a#r0']);
  assert.deepEqual(prepQuestions(s, s.events[0], 'nl', PDAY, 2, PMODS), ['eng.flow.a#r2', 'eng.flow.a#r1']);
  const unscheduled = { ...s, courseReviews: { 'nl|eng.flow.a#r0': rv(2, '2026-11-09') } };
  assert.deepEqual(prepQuestions(unscheduled, s.events[0], 'nl', PDAY, 5, PMODS), ['eng.flow.a#r1', 'eng.flow.a#r2', 'eng.flow.a#r0'], 'a question never scheduled in this language comes first');
  const tiny = [{ ...PMODS[0], questions: { 'eng.flow.a': 2, 'eng.flow.b': 2 } }];
  assert.deepEqual(prepQuestions(s, s.events[0], 'nl', PDAY, 5, tiny), []);
});

test('course today: prep two days before an event with a topic, not three; once only; apply beats prep beats due', () => {
  const s = prepState();
  const pick = courseTodayPick(s, 'eng', 'nl', PDAY, PMODS);
  assert.deepEqual(pick, { reason: 'prep', eventId: 'ev1', moduleId: 'eng.flow', questionIds: ['eng.flow.a#r2', 'eng.flow.a#r1', 'eng.flow.a#r0'], eventText: 'Line review at the plant' });
  assert.notEqual(courseTodayPick(s, 'eng', 'nl', '2026-11-01', PMODS).reason, 'prep', 'three days before');
  assert.notEqual(courseTodayPick(s, 'pm', 'nl', PDAY, PMODS).reason, 'prep', 'another subject');
  const done = applyDue(s, { subject: 'eng', results: { 'eng.flow.a#r2': true }, lang: 'nl', prep: 'ev1' }, PDAY, NOW);
  assert.deepEqual(done.state.courses.eng.prepped, ['ev1']);
  assert.notEqual(courseTodayPick(done.state, 'eng', 'nl', PDAY, PMODS).reason, 'prep');
  // Five due questions: prep still first.
  const due5 = { ...s, courseReviews: { ...s.courseReviews, ...Object.fromEntries([0, 1, 2, 3].map((i) => [`nl|eng.quality.a#r${i}`, rv(1, PDAY, 'eng.quality.a')])), 'nl|eng.flow.b#r0': rv(1, PDAY, 'eng.flow.b') } };
  assert.equal(courseTodayPick(due5, 'eng', 'nl', PDAY, PMODS).reason, 'prep');
  // A plan follow-up beats it.
  const plan = { id: 'p1', lessonId: 'eng.flow.a', text: 't', day: '2026-10-28', due: '2026-11-02', asked: 0, outcome: null };
  const withPlan = { ...s, courses: { ...s.courses, eng: { ...s.courses.eng, plans: [plan] } } };
  assert.equal(courseTodayPick(withPlan, 'eng', 'nl', PDAY, PMODS).reason, 'apply');
});

test('course today: an event topic with no passed lesson suggests that module’s lesson, with its own reason', () => {
  const s = { ...defaultState(), events: [{ id: 'ev2', type: 'client', date: '2026-11-03', text: 'Quality review', reflection: null, topics: ['eng.quality'] }] };
  assert.deepEqual(courseTodayPick(s, 'eng', 'nl', PDAY, PMODS), { reason: 'lesson', moduleId: 'eng.quality', lessonId: 'eng.quality.a', why: 'prepLesson', eventId: 'ev2' });
});

test('a prep session counts once, like a due session', () => {
  const s = prepState();
  const r = applyDue(s, { subject: 'eng', results: { 'eng.flow.a#r2': true, 'eng.flow.a#r1': true, 'eng.flow.a#r0': false }, lang: 'nl', prep: 'ev1' }, PDAY, NOW);
  assert.equal(r.xp, 12);
  assert.equal(r.state.days[PDAY], 1);
  assert.equal(r.state.courses.eng.sessions.length, 1);
  const again = applyDue(r.state, { subject: 'eng', results: {}, lang: 'nl', prep: 'ev1' }, PDAY, NOW + 1);
  assert.deepEqual(again.state.courses.eng.prepped, ['ev1']);
});

import { hintQuiz } from '../src/core/course.js';

// A hint instead of "I know it / I'm guessing": sure is !hinted.
test('quiz: a hint is taken once per question; on the first pass the answer then counts as not sure', () => {
  const qs = [choice('l#r0'), choice('l#r1')];
  let s = startQuiz(qs);
  assert.deepEqual(s.hints, {});
  s = hintQuiz(s, qs);
  assert.deepEqual(s.hints, { 'l#r0': true });
  assert.equal(hintQuiz(s, qs), s, 'a second tap changes nothing');
  s = answerQuiz(s, qs, 'b');
  s = answerQuiz(s, qs, 'a');
  assert.deepEqual(s.sure, { 'l#r0': false, 'l#r1': true }, 'hinted → not sure; no hint → sure');
  assert.deepEqual(s.firstTry, { 'l#r0': true, 'l#r1': false });
  assert.equal(hintQuiz(s, qs), s, 'no hint once the answers are shown');
  s = continueQuiz(s);
  assert.deepEqual(s.hints, {}, 'a new pass starts without hints');
  s = hintQuiz(s, qs);
  assert.deepEqual(s.hints, { 'l#r1': true }, 'a hint on a retry is allowed');
  s = answerQuiz(s, qs, 'b');
  assert.deepEqual(s.sure, { 'l#r0': false, 'l#r1': true }, 'later passes do not change it');
});

test('quiz: back remembers the hint per question, and answering again keeps it', () => {
  const qs = [choice('l#r0'), choice('l#r1'), choice('l#r2')];
  let s = startQuiz(qs);
  s = hintQuiz(s, qs);
  s = answerQuiz(s, qs, 'a');
  s = answerQuiz(s, qs, 'b');
  s = backQuiz(s, qs);
  assert.deepEqual(s.hints, { 'l#r0': true }, 'no hint on r1, the hint on r0 stays');
  s = backQuiz(s, qs);
  assert.equal(s.i, 0);
  assert.equal(s.hints['l#r0'], true, 'back on the hinted question: the hint is still shown');
  assert.deepEqual(s.prev, { id: 'l#r0', value: 'a', sure: false });
  s = answerQuiz(s, qs, 'b');
  assert.deepEqual(s.sure, { 'l#r0': false }, 'a hint can’t be taken back');
  s = answerQuiz(s, qs, 'b');
  assert.deepEqual(s.sure, { 'l#r0': false, 'l#r1': true });
});

test('applyLesson / applyDue: correct after a hint keeps the box (a new one starts at 1); without a hint it climbs', () => {
  const firstTry = { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': true, 'eng.flow.takt#r2': false };
  const sure = { 'eng.flow.takt#r0': false, 'eng.flow.takt#r1': true, 'eng.flow.takt#r2': false };
  const s = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, sure, lang: 'nl' }, TODAY, NOW).state;
  assert.equal(s.courseReviews['nl|eng.flow.takt#r0'].box, 1);
  assert.equal(s.courseReviews['nl|eng.flow.takt#r1'].box, 2);
  assert.equal(s.courseReviews['nl|eng.flow.takt#r2'].box, 1);
  const d = applyDue(s, { subject: 'eng', results: { 'eng.flow.takt#r1': true }, sure: { 'eng.flow.takt#r1': false }, lang: 'nl' }, '2026-11-05', NOW).state;
  assert.equal(d.courseReviews['nl|eng.flow.takt#r1'].box, 2, 'a hinted due answer keeps its box');
  const d2 = applyDue(s, { subject: 'eng', results: { 'eng.flow.takt#r1': true }, lang: 'nl' }, '2026-11-05', NOW).state;
  assert.equal(d2.courseReviews['nl|eng.flow.takt#r1'].box, 3, 'without a hint it climbs');
});

test('old sessions with the calibration counts (cal) stay readable', () => {
  const old = { day: TODAY, kind: 'lesson', lessonId: 'eng.flow.takt', correct: 1, total: 2, cal: { sr: 1, st: 2, gr: 0, gt: 0 }, ts: NOW };
  const s = { ...defaultState(), courses: { eng: { lessons: {}, sessions: [old] } } };
  const next = applyDue(s, { subject: 'eng', results: { 'eng.flow.takt#r0': true }, lang: 'nl' }, TODAY, NOW + 1).state;
  assert.deepEqual(next.courses.eng.sessions[1], old, 'kept as it was');
  assert.equal('cal' in next.courses.eng.sessions[0], false, 'new sessions no longer write it');
  assert.ok(courseSummary(next, 'eng', 'nl', TODAY));
});

test('course today: lapsed questions count at most three toward "due"', () => {
  const day = '2026-11-02';
  const lapsed = Object.fromEntries([0, 1, 2, 3, 4, 5].map((i) => [`nl|eng.flow.a#r${i}`, { box: 2, due: '2026-08-01', lesson: 'eng.flow.a', subject: 'eng' }]));
  const s = { ...defaultState(), courseReviews: lapsed };
  assert.equal(courseTodayPick(s, 'eng', 'nl', day, MODS).reason, 'lesson', 'six lapsed count as three');
  const plus2 = { ...s, courseReviews: { ...lapsed, 'nl|eng.flow.b#r0': { box: 2, due: day, lesson: 'eng.flow.b', subject: 'eng' }, 'nl|eng.flow.b#r1': { box: 2, due: day, lesson: 'eng.flow.b', subject: 'eng' } } };
  assert.deepEqual(courseTodayPick(plus2, 'eng', 'nl', day, MODS), { reason: 'due', count: 5 });
});

test('applyDue: a correct answer on a question not yet due keeps its box (no same-day climb); a miss still resets', () => {
  const k = (n) => `nl|eng.flow.takt#r${n}`;
  const later = '2099-01-01';
  const s = { ...defaultState(), courseReviews: { [k(0)]: { box: 2, due: later, lesson: 'eng.flow.takt', subject: 'eng' }, [k(1)]: { box: 2, due: later, lesson: 'eng.flow.takt', subject: 'eng' } } };
  const { state } = applyDue(s, { subject: 'eng', results: { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': false }, lang: 'nl', prep: 'ev1' }, TODAY, NOW);
  assert.equal(state.courseReviews[k(0)].box, 2);
  assert.equal(state.courseReviews[k(0)].due, later);
  assert.equal(state.courseReviews[k(1)].box, 1);
});

test('applyDue: a second refresh for the same event gives no XP and is not another round', () => {
  const first = applyDue(defaultState(), { subject: 'eng', results: { 'eng.flow.takt#r0': true }, lang: 'nl', prep: 'ev1' }, TODAY, NOW);
  const again = applyDue(first.state, { subject: 'eng', results: { 'eng.flow.takt#r0': true }, lang: 'nl', prep: 'ev1' }, TODAY, NOW + 1);
  assert.equal(again.xp, 0);
  assert.equal(again.state.xp, first.state.xp);
  assert.equal(again.state.days[TODAY], first.state.days[TODAY]);
});

import { paragraphs } from '../src/core/course.js';

test('paragraphs: a blank line splits learning text into paragraphs; single text stays one', () => {
  assert.deepEqual(paragraphs('Een. Twee.'), ['Een. Twee.']);
  assert.deepEqual(paragraphs('Een.\n\nTwee.\n\n\nDrie.'), ['Een.', 'Twee.', 'Drie.']);
  assert.deepEqual(paragraphs('  Een. \n\n  '), ['Een.']);
  assert.deepEqual(paragraphs(''), []);
  assert.deepEqual(paragraphs(undefined), []);
});

import { linkTerms } from '../src/core/course.js';

test('linkTerms: marks the first whole-word use of each term in a paragraph; longest term wins; case-insensitive', () => {
  const terms = [{ term: 'Spiebaan', def: 'Sleuf in de as.' }, { term: 'Spie', def: 'Blokje.' }, { term: 'CNC', def: 'Computergestuurd.' }];
  const segs = linkTerms('Frees de spiebaan, dan de spie erin. De spiebaan is klaar. Geen spiegel.', terms);
  const marked = segs.filter((s) => s.term);
  assert.deepEqual(marked.map((s) => [s.text, s.term]), [['spiebaan', 'Spiebaan'], ['spie', 'Spie']]);
  assert.equal(segs.map((s) => s.text).join(''), 'Frees de spiebaan, dan de spie erin. De spiebaan is klaar. Geen spiegel.');
  assert.equal(marked[0].def, 'Sleuf in de as.');
  assert.deepEqual(linkTerms('Een CNC-draaibank.', terms).filter((s) => s.term).map((s) => s.text), ['CNC']);
  assert.deepEqual(linkTerms('Niets hier.', terms), [{ text: 'Niets hier.' }]);
  assert.deepEqual(linkTerms('', terms), []);
  assert.deepEqual(linkTerms('Tekst (met haakjes).', [{ term: 'a+b (x)', def: 'd' }]).filter((s) => s.term), []);
});

import { withEnglish } from '../src/core/course.js';

test('withEnglish: each Dutch term gets the English term from the same lesson and position; same words are skipped', () => {
  const nl = { lessons: [{ id: 'm.a', terms: [{ term: 'Spiebaan', def: 'Sleuf.' }, { term: 'CNC', def: 'Computer.' }] }, { id: 'm.b', terms: [{ term: 'Takt', def: 'x' }] }] };
  const en = { lessons: [{ id: 'm.a', terms: [{ term: 'Keyway', def: 'Slot.' }, { term: 'CNC', def: 'Computer.' }] }] };
  const out = withEnglish(nl, en);
  assert.equal(out.lessons[0].terms[0].en, 'Keyway');
  assert.equal('en' in out.lessons[0].terms[1], false, 'same word in both languages: nothing to add');
  assert.equal('en' in out.lessons[1].terms[0], false, 'lesson missing in English: unchanged');
  assert.equal(nl.lessons[0].terms[0].en, undefined, 'input not mutated');
  assert.deepEqual(withEnglish(nl, null), nl);
});

test('linkTerms: carries the English word, and does not repeat it when the text already gives it', () => {
  const terms = [{ term: 'Spiebaan', def: 'Sleuf.', en: 'Keyway' }];
  const a = linkTerms('Frees de spiebaan.', terms).find((s) => s.term);
  assert.equal(a.en, 'Keyway');
  const b = linkTerms('Frees de spiebaan (keyway) erin.', terms).find((s) => s.term);
  assert.equal(b.en, 'Keyway', 'the definition still names the English word');
  assert.equal(b.enInline, false, 'but the text does not repeat it');
  assert.equal(a.enInline, true);
});

test('linkTerms: a plural or simple inflection of a term also links (micro-stops, laserscanners, gekoppelde)', () => {
  const terms = [{ term: 'Micro-stop', def: 'a' }, { term: 'Laserscanner', def: 'b' }, { term: 'Star gekoppeld', def: 'c' }, { term: 'Escape', def: 'd' }];
  const hit = (txt) => linkTerms(txt, terms).filter((s) => s.term).map((s) => s.text);
  assert.deepEqual(hit('Count the micro-stops.'), ['micro-stops']);
  assert.deepEqual(hit('Twee laserscanners bewaken de cel.'), ['laserscanners']);
  assert.deepEqual(hit('Een star gekoppelde lijn.'), ['star gekoppelde']);
  assert.deepEqual(hit('Escapes cost money.'), ['Escapes']);
  assert.deepEqual(hit('Escaped is not a term.'), [], 'only plural/inflection endings, not any suffix');
});

// ---- v16: the top card resumes where he left off ----
import { markOpened, resumeLesson } from '../src/core/course.js';

const RMODS = [
  { id: 'eng.flow', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.flow.a', 'eng.flow.b', 'eng.flow.c'], questions: { 'eng.flow.a': 1, 'eng.flow.b': 1, 'eng.flow.c': 1 } },
  { id: 'eng.machining', subject: 'eng', track: 'discrete', level: 1, lessons: ['eng.machining.a', 'eng.machining.b'], questions: { 'eng.machining.a': 1, 'eng.machining.b': 1 } },
  { id: 'pm.intake', subject: 'pm', track: 'project', level: 1, lessons: ['pm.intake.ask'], questions: { 'pm.intake.ask': 1 } },
];
const lessonAt = (st, id, p) => {
  const sub = id.split('.')[0];
  const c = st.courses[sub] || { lessons: {}, sessions: [] };
  return { ...st, courses: { ...st.courses, [sub]: { ...c, lessons: { ...c.lessons, [id]: { ...(c.lessons[id] || {}), ...p } } } } };
};
const passAt = (st, id, ts) => lessonAt(st, id, { read: ts, passed: ts });

test('markOpened: remembers when a lesson was opened; never touches passed', () => {
  const s = markOpened(passAt(defaultState(), 'eng.flow.a', 5), 'eng', 'eng.flow.a', 50);
  assert.deepEqual(s.courses.eng.lessons['eng.flow.a'], { read: 5, passed: 5, opened: 50 });
  assert.equal(markOpened(defaultState(), 'eng', 'eng.flow.b', 60).courses.eng.lessons['eng.flow.b'].opened, 60);
});

test('resumeLesson: the lesson he opened last and did not finish; none once it is passed or something later was done', () => {
  const s = markOpened(passAt(defaultState(), 'eng.flow.a', 10), 'eng', 'eng.machining.b', 20);
  assert.deepEqual(resumeLesson(s, 'eng', RMODS), { moduleId: 'eng.machining', lessonId: 'eng.machining.b' });
  assert.equal(resumeLesson(s, 'pm', RMODS), null, 'per subject');
  assert.equal(resumeLesson(passAt(s, 'eng.machining.b', 30), 'eng', RMODS), null, 'finished');
  // He opened b, left it, then finished another lesson: that is the later activity.
  assert.equal(resumeLesson(passAt(s, 'eng.flow.b', 40), 'eng', RMODS), null);
  assert.equal(resumeLesson(defaultState(), 'eng', RMODS), null);
});

test('course today: an unfinished lesson comes back on top, before a plan, an event and due questions', () => {
  const day = '2026-11-02';
  let s = markOpened(passAt(defaultState(), 'eng.flow.a', 10), 'eng', 'eng.machining.b', 20);
  s = { ...s, courseReviews: Object.fromEntries([0, 1, 2, 3, 4].map((i) => [`nl|eng.flow.a#r${i}`, { box: 1, due: day, lesson: 'eng.flow.a', subject: 'eng' }])) };
  s.courses.eng.plans = [{ id: 'p1', lessonId: 'eng.flow.a', text: 'x', day: '2026-10-30', due: day, asked: 0, outcome: null }];
  assert.deepEqual(courseTodayPick(s, 'eng', 'nl', day, RMODS), { reason: 'lesson', why: 'resume', moduleId: 'eng.machining', lessonId: 'eng.machining.b' });
});

test('course today: after a lesson or practice, the next lesson is in the module he worked in last', () => {
  const day = '2026-11-02';
  let s = passAt(passAt(defaultState(), 'eng.flow.a', 10), 'eng.machining.a', 20);
  assert.equal(recommendedModule(s, 'eng', RMODS), 'eng.machining', 'the module he worked in last, not the first one started');
  assert.deepEqual(courseTodayPick(s, 'eng', 'nl', day, RMODS), { reason: 'lesson', moduleId: 'eng.machining', lessonId: 'eng.machining.b' });
  // Practising a passed lesson (a situation) in flow brings flow back.
  s = lessonAt(s, 'eng.flow.a', { situation: { pts: 2, ts: 30 } });
  assert.equal(recommendedModule(s, 'eng', RMODS), 'eng.flow');
  // So does the say-it round.
  s = lessonAt(s, 'eng.machining.a', { sayIt: 40 });
  assert.equal(recommendedModule(s, 'eng', RMODS), 'eng.machining');
});

test('nextLesson resumes an opened, unfinished lesson in the module; otherwise the first not passed', () => {
  let s = passAt(defaultState(), 'eng.flow.a', 10);
  assert.equal(nextLesson(s, RMODS[0]), 'eng.flow.b');
  s = markOpened(s, 'eng', 'eng.flow.c', 20);
  assert.equal(nextLesson(s, RMODS[0]), 'eng.flow.c');
  s = passAt(s, 'eng.flow.c', 30);
  assert.equal(nextLesson(s, RMODS[0]), 'eng.flow.b');
});

// ---- v16: a longer lesson quiz (5–8 by level) and the guess back as the last question ----
import { lessonQuiz, quizSize, guessCompare } from '../src/core/course.js';

const term = (t, d) => ({ term: t, def: d });
const qLesson = (id, nTerms = 6, extra = {}) => ({
  id,
  recall: [choice('a'), choice('b'), choice('c'), { q: 'n?', number: 4, tolerance: 0.1, unit: 's', why: 'w' }],
  pre: [{ q: 'guess?', options: ['10', '20', '30'], answer: '20', why: 'because' }],
  terms: Array.from({ length: nTerms }, (_, i) => term(`T${i}`, `meaning number ${i}`)),
  ...extra,
});
const ask = (d) => `Which term? ${d}`;

test('quizSize: 5 to 8 questions by level (Basis 5 … Expert 8); 5 outside a topic', () => {
  assert.deepEqual([1, 2, 3, 4].map(quizSize), [5, 6, 7, 8]);
  assert.equal(quizSize(null), 5);
  assert.equal(quizSize(undefined), 5);
});

test('lessonQuiz: the lesson recall first, then term questions up to the size, then the guess as one extra last question', () => {
  const l = qLesson('eng.x.a');
  for (const level of [1, 2, 3, 4]) {
    const qs = lessonQuiz(l, { level, ask, guesses: ['10'] });
    assert.equal(qs.length, quizSize(level) + 1, `level ${level}`);
    assert.deepEqual(qs.slice(0, 4).map((q) => q.id), ['eng.x.a#r0', 'eng.x.a#r1', 'eng.x.a#r2', 'eng.x.a#r3']);
    assert.equal(qs.at(-1).id, 'eng.x.a#p0');
    assert.equal(qs.at(-1).guess, '10');
    assert.equal(qs.at(-1).answer, '20');
  }
  const qs = lessonQuiz(l, { level: 4, ask, guesses: ['10'] });
  const t = qs.filter((q) => q.id.includes('#t'));
  assert.equal(t.length, 4);
  for (const q of t) {
    const n = Number(q.id.split('#t')[1]);
    assert.equal(q.answer, `T${n}`);
    assert.equal(q.q, `Which term? meaning number ${n}`);
    assert.equal(q.options.length, 4);
    assert.ok(q.options.includes(q.answer));
    assert.equal(new Set(q.options).size, 4);
    assert.equal(q.why, `T${n}: meaning number ${n}`);
  }
  assert.deepEqual(lessonQuiz(l, { level: 4, ask, guesses: ['10'] }), qs, 'deterministic');
  // No guess made (no prequestions): no extra question.
  assert.equal(lessonQuiz({ ...l, pre: [] }, { level: 2, ask }).length, 6);
});

test('lessonQuiz: a term whose definition names it is never asked; distractors come from the module when the lesson has too few', () => {
  const l = qLesson('eng.x.a', 2, { terms: [term('OEE', 'OEE is availability × performance × quality'), term('Takt', 'the pace the customer sets'), term('Cycle', 'time per piece')] });
  let qs = lessonQuiz(l, { level: 4, ask, pool: [] });
  assert.ok(!qs.some((q) => q.answer === 'OEE'), 'the definition gives the answer away');
  assert.ok(!qs.some((q) => q.id.includes('#t')), 'fewer than three distractors: no term question');
  const pool = [term('WIP', 'work in progress'), term('Kanban', 'a pull signal'), term('Takt', 'the pace the customer sets')];
  qs = lessonQuiz(l, { level: 4, ask, pool });
  const tq = qs.filter((q) => q.id.includes('#t'));
  assert.deepEqual(tq.map((q) => q.answer).sort(), ['Cycle', 'Takt']);
  for (const q of tq) assert.equal(new Set(q.options).size, 4);
});

test('lessonQuiz: short of the size, recall from the earlier levels of the topic fills it, nearest level first; never invented', () => {
  const l = qLesson('eng.x.c', 0);
  const b = { id: 'eng.x.b', recall: [choice('p'), choice('q')] };
  const a = { id: 'eng.x.a', recall: [choice('r')] };
  const qs = lessonQuiz(l, { level: 4, ask, earlier: [a, b], guesses: [] });
  assert.deepEqual(qs.map((q) => q.id), ['eng.x.c#r0', 'eng.x.c#r1', 'eng.x.c#r2', 'eng.x.c#r3', 'eng.x.b#r0', 'eng.x.b#r1', 'eng.x.a#r0', 'eng.x.c#p0']);
  // Not enough anywhere: fewer questions, nothing made up.
  assert.equal(lessonQuiz(l, { level: 4, ask }).length, 5);
});

test('lessonQuiz: with several prequestions one comes back: the first he guessed wrong, else the first', () => {
  const l = qLesson('eng.x.a', 6, { pre: [{ q: 'g1', options: ['1', '2'], answer: '1', why: 'w' }, { q: 'g2', number: 5, tolerance: 0, why: 'w' }] });
  assert.equal(lessonQuiz(l, { level: 1, ask, guesses: ['1', '7'] }).at(-1).id, 'eng.x.a#p1');
  assert.equal(lessonQuiz(l, { level: 1, ask, guesses: ['2', '7'] }).at(-1).id, 'eng.x.a#p0');
  assert.equal(lessonQuiz(l, { level: 1, ask, guesses: ['1', '5'] }).at(-1).id, 'eng.x.a#p0');
  assert.equal(lessonQuiz(l, { level: 1, ask, guesses: ['1', '5'] }).filter((q) => q.id.includes('#p')).length, 1);
});

test('guessCompare: guess at the start, answer now, the right answer, each judged', () => {
  const q = { q: 'n?', number: 4, tolerance: 0.1, unit: 's', why: 'w', guess: '9' };
  assert.deepEqual(guessCompare(q, '4'), { guess: '9 s', now: '4 s', answer: '4 s', guessOk: false, nowOk: true });
  const c = { q: 'c?', options: ['a', 'b'], answer: 'b', why: 'w', guess: 'b' };
  assert.deepEqual(guessCompare(c, 'a'), { guess: 'b', now: 'a', answer: 'b', guessOk: true, nowOk: false });
});

test('applyLesson: only the lesson\'s own recall questions enter the review queue', () => {
  const firstTry = { 'eng.flow.takt#r0': true, 'eng.flow.takt#t2': true, 'eng.flow.takt#p0': false, 'eng.flow.other#r1': true };
  const { state } = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW);
  assert.deepEqual(Object.keys(state.courseReviews), ['nl|eng.flow.takt#r0']);
  assert.equal(state.courses.eng.sessions[0].total, 4, 'the session still counts every question asked');
});

// v16 flair: XP is also counted per day.
test('applyLesson credits 20 XP to today\'s xpDays; a retake credits nothing', () => {
  const firstTry = { 'eng.flow.takt#r0': true };
  const a = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW);
  assert.equal(a.state.xpDays[TODAY], 20);
  const b = applyLesson(a.state, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW + 1);
  assert.equal(b.state.xpDays[TODAY], 20);
  assert.equal(b.state.xp, 20);
});

test('applyDue and applySituation credit their XP to xpDays', () => {
  const d = applyDue(defaultState(), { subject: 'eng', results: { 'eng.flow.takt#r0': true }, lang: 'nl' }, TODAY, NOW);
  assert.equal(d.state.xpDays[TODAY], d.xp);
  const s = applySituation(d.state, { subject: 'pm', lessonId: 'pm.intake.ask', pts: 2 }, TODAY, NOW);
  assert.equal(s.state.xpDays[TODAY], d.xp + 10);
});

test('applyLesson stores perfect once (the first ts) and keeps it on a later imperfect retake', () => {
  const all = { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': true };
  const miss = { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': false };
  let s = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry: miss, lang: 'nl' }, TODAY, NOW).state;
  assert.equal(s.courses.eng.lessons['eng.flow.takt'].perfect, undefined);
  s = applyLesson(s, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry: all, lang: 'nl' }, TODAY, NOW + 5).state;
  assert.equal(s.courses.eng.lessons['eng.flow.takt'].perfect, NOW + 5);
  s = applyLesson(s, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry: all, lang: 'nl' }, TODAY, NOW + 9).state;
  assert.equal(s.courses.eng.lessons['eng.flow.takt'].perfect, NOW + 5, 'the first ts stays');
  s = applyLesson(s, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry: miss, lang: 'nl' }, TODAY, NOW + 20).state;
  assert.equal(s.courses.eng.lessons['eng.flow.takt'].perfect, NOW + 5);
  const hinted = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry: all, sure: { 'eng.flow.takt#r1': false }, lang: 'nl' }, TODAY, NOW).state;
  assert.equal(hinted.courses.eng.lessons['eng.flow.takt'].perfect, undefined, 'a hint is not perfect');
});

test('applyLesson returns medals, titles and goalReached alongside xp', () => {
  const firstTry = { 'eng.flow.takt#r0': true };
  const a = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, lang: 'nl' }, TODAY, NOW);
  assert.deepEqual(a.titles, [{ subject: 'eng', rank: 1 }]);
  assert.deepEqual(a.medals, []);
  assert.equal(a.goalReached, false, '20 of 30');
  assert.equal(a.state.titles.eng.rank, 1);
  const b = applyLesson(a.state, { subject: 'eng', lessonId: 'eng.flow.balance', firstTry: { 'eng.flow.balance#r0': true }, lang: 'nl' }, TODAY, NOW + 1);
  assert.equal(b.goalReached, true, '40 crosses 30');
  assert.deepEqual(b.titles, []);
});

test('a perfect retake of a passed lesson sets perfect but gives no XP', () => {
  const all = { 'eng.flow.takt#r0': true };
  const a = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry: { 'eng.flow.takt#r0': false }, lang: 'nl' }, TODAY, NOW);
  const b = applyLesson(a.state, { subject: 'eng', lessonId: 'eng.flow.takt', firstTry: all, lang: 'nl' }, TODAY, NOW + 1);
  assert.equal(b.xp, 0);
  assert.equal(b.state.courses.eng.lessons['eng.flow.takt'].perfect, NOW + 1);
});
