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
  assert.deepEqual(again.state.courses.eng.sessions[1], { day: TODAY, kind: 'lesson', lessonId: 'eng.flow.takt', correct: 1, total: 2, cal: { sr: 1, st: 2, gr: 0, gt: 0 }, ts: NOW });
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

import { calibrationLine } from '../src/core/course.js';

// Sure or guessing.
test('quiz: sure is recorded on the first pass only, defaults to sure, and back drops it', () => {
  const qs = [choice('l#r0'), choice('l#r1')];
  let s = startQuiz(qs);
  s = answerQuiz(s, qs, 'b', false);
  assert.deepEqual(s.sure, { 'l#r0': false });
  s = backQuiz(s, qs);
  assert.deepEqual(s.sure, {}, 'taking an answer back drops its guess flag');
  s = answerQuiz(s, qs, 'b');
  s = answerQuiz(s, qs, 'a', false);
  assert.deepEqual(s.sure, { 'l#r0': true, 'l#r1': false });
  s = continueQuiz(s);
  s = answerQuiz(s, qs, 'b', true);
  assert.deepEqual(s.sure, { 'l#r0': true, 'l#r1': false }, 'later passes do not change it');
  assert.deepEqual(s.firstTry, { 'l#r0': true, 'l#r1': false });
});

test('applyLesson: a correct guess does not create box 2; a sure correct answer does', () => {
  const firstTry = { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': true };
  const s = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', firstTry, sure: { 'eng.flow.takt#r0': false }, lang: 'nl' }, TODAY, NOW).state;
  assert.equal(s.courseReviews['nl|eng.flow.takt#r0'].box, 1);
  assert.equal(s.courseReviews['nl|eng.flow.takt#r1'].box, 2);
  const d = applyDue(s, { subject: 'eng', results: { 'eng.flow.takt#r1': true }, sure: { 'eng.flow.takt#r1': false }, lang: 'nl' }, '2026-11-05', NOW).state;
  assert.equal(d.courseReviews['nl|eng.flow.takt#r1'].box, 2, 'a due guess keeps its box');
});

test('course today: lapsed questions count at most three toward "due"', () => {
  const day = '2026-11-02';
  const lapsed = Object.fromEntries([0, 1, 2, 3, 4, 5].map((i) => [`nl|eng.flow.a#r${i}`, { box: 2, due: '2026-08-01', lesson: 'eng.flow.a', subject: 'eng' }]));
  const s = { ...defaultState(), courseReviews: lapsed };
  assert.equal(courseTodayPick(s, 'eng', 'nl', day, MODS).reason, 'lesson', 'six lapsed count as three');
  const plus2 = { ...s, courseReviews: { ...lapsed, 'nl|eng.flow.b#r0': { box: 2, due: day, lesson: 'eng.flow.b', subject: 'eng' }, 'nl|eng.flow.b#r1': { box: 2, due: day, lesson: 'eng.flow.b', subject: 'eng' } } };
  assert.deepEqual(courseTodayPick(plus2, 'eng', 'nl', day, MODS), { reason: 'due', count: 5 });
});

test('calibration: sure and guessing answers, right and total, over the last 30 days', () => {
  let s = applyLesson(defaultState(), { subject: 'eng', lessonId: 'eng.flow.takt', lang: 'nl',
    firstTry: { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': false, 'eng.flow.takt#r2': true, 'eng.flow.takt#r3': false },
    sure: { 'eng.flow.takt#r0': true, 'eng.flow.takt#r1': true, 'eng.flow.takt#r2': false, 'eng.flow.takt#r3': false } }, TODAY, NOW).state;
  s = applyDue(s, { subject: 'eng', results: { 'eng.flow.takt#r1': true }, lang: 'nl' }, TODAY, NOW + 1).state;
  assert.deepEqual(calibrationLine(s.courses.eng.sessions, TODAY), { sureRight: 2, sureTotal: 3, guessRight: 1, guessTotal: 2 });
  assert.deepEqual(calibrationLine(s.courses.eng.sessions, '2026-12-20'), { sureRight: 0, sureTotal: 0, guessRight: 0, guessTotal: 0 });
  assert.deepEqual(calibrationLine([{ day: TODAY, kind: 'lesson' }], TODAY), { sureRight: 0, sureTotal: 0, guessRight: 0, guessTotal: 0 }, 'v8 sessions count nothing');
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
