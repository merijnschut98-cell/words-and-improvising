// v18 F3: review load. Three controls, none of which touches a box or a streak:
// "Vandaag overslaan" (dueSkip), the daily limit (settings.reviewCap), and
// "Overslaan" on one question inside a session (skipQuiz).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  courseTodayPick, applyDue, skipDueToday, dueSkipped, dueNow, dueWaiting, reviewsToday, reviewsLeftToday, startQuiz, answerQuiz, skipQuiz, courseSummary,
} from '../src/core/course.js';
import { dueCount, dueSession, reviewCapOf, reviewsLeft, REVIEW_CAPS } from '../src/core/coursereview.js';
import { defaultState, load, save } from '../src/core/storage.js';
import { mergeStates, syncable } from '../src/core/sync.js';
import { seededRng } from '../src/core/lesson.js';

const DAY = '2026-11-02';
const NOW = new Date(2026, 10, 2, 9).getTime();
const MODS = [{ id: 'eng.flow', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.flow.a', 'eng.flow.b'], questions: { 'eng.flow.a': 40, 'eng.flow.b': 1 } }];
const queue = (n, due = DAY) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`nl|eng.flow.a#r${i}`, { box: 2, due, lesson: 'eng.flow.a', subject: 'eng', lastSure: true }]));
const withDue = (n, extra = {}) => ({ ...defaultState(), courseReviews: queue(n), ...extra });
const choice = (id) => ({ id, q: 'q?', options: ['a', 'b'], answer: 'b', why: 'w' });
const ids = (n) => Array.from({ length: n }, (_, i) => `eng.flow.a#r${i}`);

test('skip today: the pick goes to the lesson, boxes and due dates stay exactly as they were', () => {
  const s = withDue(8);
  assert.equal(courseTodayPick(s, 'eng', 'nl', DAY, MODS).reason, 'due');
  const k = skipDueToday(s, 'eng', DAY);
  assert.equal(dueSkipped(k, 'eng', DAY), true);
  assert.equal(courseTodayPick(k, 'eng', 'nl', DAY, MODS).reason, 'lesson');
  assert.deepEqual(k.courseReviews, s.courseReviews, 'no box or due date changed');
  assert.equal(k.xp, s.xp);
  assert.deepEqual(k.streak, s.streak, 'skipping does not touch the streak');
  assert.deepEqual(k.days, s.days);
  assert.equal(dueWaiting(k, 'eng', 'nl', DAY), 8, 'still all due');
});

test('skip lasts one day: tomorrow the reviews are the next step again', () => {
  const k = skipDueToday(withDue(8), 'eng', DAY);
  assert.equal(dueSkipped(k, 'eng', '2026-11-03'), false);
  assert.equal(courseTodayPick(k, 'eng', 'nl', '2026-11-03', MODS).reason, 'due');
});

test('skip is per course', () => {
  const k = skipDueToday(withDue(8), 'eng', DAY);
  assert.equal(dueSkipped(k, 'pm', DAY), false);
});

test('skipped with a few due and everything else done: no due pick at all today', () => {
  let s = skipDueToday(withDue(2), 'eng', DAY);
  s = { ...s, courses: { ...s.courses, eng: { ...s.courses.eng, lessons: { 'eng.flow.a': { read: 1, passed: 1, situation: { pts: 3, ts: 1 }, sayIt: { ts: 1 } }, 'eng.flow.b': { read: 1, passed: 1, situation: { pts: 3, ts: 1 }, sayIt: { ts: 1 } } } } } };
  assert.notEqual(courseTodayPick(s, 'eng', 'nl', DAY, MODS).reason, 'due');
});

test('daily limit: default 20, only 10 / 20 / 40 / no limit are accepted', () => {
  assert.equal(defaultState().settings.reviewCap, 20);
  assert.deepEqual(REVIEW_CAPS, [10, 20, 40, 0]);
  assert.equal(reviewCapOf({}), 20);
  assert.equal(reviewCapOf({ reviewCap: 40 }), 40);
  assert.equal(reviewCapOf({ reviewCap: 0 }), 0);
  assert.equal(reviewCapOf({ reviewCap: 7 }), 20);
  assert.equal(reviewsLeft(0, 999), Infinity);
  assert.equal(reviewsLeft(20, 25), 0);
});

test('daily limit caps the count and the session; the rest waits, nothing is rescheduled', () => {
  const s = withDue(35, { settings: { ...defaultState().settings, reviewCap: 10 } });
  assert.equal(dueWaiting(s, 'eng', 'nl', DAY), 35);
  assert.equal(dueNow(s, 'eng', 'nl', DAY), 10);
  const left = reviewsLeftToday(s, 'eng', DAY);
  assert.equal(dueSession(s.courseReviews, DAY, 'eng', 'nl', seededRng(1), { left }).length, 10);
  assert.equal(dueSession(s.courseReviews, DAY, 'eng', 'nl', seededRng(1), { max: 10, left: 4 }).length, 4);
  assert.deepEqual(dueSession(s.courseReviews, DAY, 'eng', 'nl', seededRng(1), { left: 0 }), []);
  assert.equal(dueCount(s.courseReviews, DAY, 'eng', 'nl'), 35, 'plain dueCount has no limit');
});

test('daily limit counts today\'s answered due questions; the limit is spent after 20, the pile waits for tomorrow', () => {
  let s = withDue(35, { settings: { ...defaultState().settings, reviewCap: 20 } });
  const res = (n) => Object.fromEntries(ids(n).map((q) => [q, true]));
  s = applyDue(s, { subject: 'eng', results: res(10), lang: 'nl' }, DAY, NOW).state;
  assert.equal(reviewsToday(s, 'eng', DAY), 10);
  assert.equal(dueNow(s, 'eng', 'nl', DAY), 10, 'the 10 answered moved on; 25 remain; 10 more allowed');
  s = applyDue(s, { subject: 'eng', results: Object.fromEntries(ids(20).slice(10).map((q) => [q, true])), lang: 'nl' }, DAY, NOW).state;
  assert.equal(reviewsToday(s, 'eng', DAY), 20);
  assert.equal(dueNow(s, 'eng', 'nl', DAY), 0);
  assert.notEqual(courseTodayPick(s, 'eng', 'nl', DAY, MODS).reason, 'due', 'limit reached: the lesson is next');
  assert.equal(reviewsToday(s, 'eng', '2026-11-03'), 0, 'a new day starts fresh');
  assert.equal(dueNow(s, 'eng', 'nl', '2026-11-03') > 0, true);
});

test('no limit (0) shows everything; a refresh before an event or a keep-sharp question does not use the limit', () => {
  let s = withDue(30, { settings: { ...defaultState().settings, reviewCap: 0 } });
  assert.equal(dueNow(s, 'eng', 'nl', DAY), 30);
  s = { ...s, settings: { ...s.settings, reviewCap: 10 } };
  s = applyDue(s, { subject: 'eng', results: { 'eng.flow.a#r0': true }, lang: 'nl', maintenance: true }, DAY, NOW).state;
  s = applyDue(s, { subject: 'eng', results: { 'eng.flow.a#r1': true }, lang: 'nl', prep: 'ev1' }, DAY, NOW).state;
  assert.equal(reviewsToday(s, 'eng', DAY), 0);
});

test('quiz skip: to the end once, left out the second time, never an answer', () => {
  const qs = [choice('a#r0'), choice('a#r1'), choice('a#r2')];
  let s = startQuiz(qs);
  s = skipQuiz(s, qs);
  assert.deepEqual(s.order, [1, 2, 0]);
  assert.equal(s.i, 0);
  assert.deepEqual(s.firstTry, {});
  s = answerQuiz(s, qs, 'b'); // a#r1
  s = answerQuiz(s, qs, 'b'); // a#r2
  assert.equal(s.order[s.i], 0, 'the skipped one is asked at the end');
  s = skipQuiz(s, qs);
  assert.equal(s.phase, 'review');
  assert.deepEqual(Object.keys(s.firstTry).sort(), ['a#r1', 'a#r2']);
  assert.deepEqual(s.misses, [], 'not a miss');
  assert.deepEqual(s.left, ['a#r0']);
});

test('quiz skip: skipping the last remaining question leaves it out; skipping everything ends with nothing answered', () => {
  const qs = [choice('a#r0'), choice('a#r1')];
  let s = startQuiz(qs);
  s = answerQuiz(s, qs, 'b');
  s = skipQuiz(s, qs);
  assert.equal(s.phase, 'review');
  s = startQuiz(qs);
  s = skipQuiz(s, qs);
  s = skipQuiz(s, qs); // a#r1 goes to the end
  s = skipQuiz(s, qs); // a#r0 again: left out
  s = skipQuiz(s, qs); // a#r1 is the last one left: left out
  assert.equal(s.phase, 'done');
  assert.deepEqual(s.firstTry, {});
  assert.deepEqual(s.left.sort(), ['a#r0', 'a#r1']);
});

test('quiz skip works only in the first pass', () => {
  const qs = [choice('a#r0'), choice('a#r1')];
  let s = startQuiz(qs);
  s = answerQuiz(s, qs, 'a');
  s = answerQuiz(s, qs, 'b');
  s = { ...s, phase: 'ask', pass: 2, order: [0], i: 0 };
  assert.equal(skipQuiz(s, qs), s);
});

test('a skipped question stays due and keeps its box when the rest of the session is applied', () => {
  const s = withDue(3);
  const done = applyDue(s, { subject: 'eng', results: { 'eng.flow.a#r1': true, 'eng.flow.a#r2': false }, lang: 'nl' }, DAY, NOW).state;
  assert.deepEqual(done.courseReviews['nl|eng.flow.a#r0'], s.courseReviews['nl|eng.flow.a#r0']);
  assert.equal(dueSession(done.courseReviews, DAY, 'eng', 'nl', seededRng(2)).includes('eng.flow.a#r0'), true);
});

test('storage: a missing or odd reviewCap loads as 20; a good one and dueSkip survive a round trip; a bad dueSkip is dropped', () => {
  const mem = () => { let v = null; return { getItem: () => v, setItem: (_k, x) => { v = x; } }; };
  const old = { ...defaultState() };
  delete old.settings.reviewCap;
  let b = mem();
  save(b, old);
  assert.equal(load(b).settings.reviewCap, 20);
  b = mem();
  save(b, { ...defaultState(), settings: { ...defaultState().settings, reviewCap: 13 } });
  assert.equal(load(b).settings.reviewCap, 20);
  b = mem();
  const st = skipDueToday({ ...defaultState(), settings: { ...defaultState().settings, reviewCap: 40 } }, 'eng', DAY);
  save(b, st);
  const back = load(b);
  assert.equal(back.settings.reviewCap, 40);
  assert.equal(back.courses.eng.dueSkip, DAY);
  b = mem();
  save(b, { ...defaultState(), courses: { eng: { dueSkip: 'tomorrow' } } });
  assert.equal('dueSkip' in load(b).courses.eng, false);
  assert.equal('dueSkip' in load(mem()).courses.eng, false, 'absent by default');
});

test('sync: dueSkip merges as the later day; the daily limit stays on the device', () => {
  const a = skipDueToday(defaultState(), 'eng', '2026-11-02');
  const b = skipDueToday(defaultState(), 'eng', '2026-11-03');
  assert.equal(mergeStates(a, syncable(b)).courses.eng.dueSkip, '2026-11-03');
  assert.equal(mergeStates(b, syncable(a)).courses.eng.dueSkip, '2026-11-03');
  assert.equal(mergeStates(defaultState(), syncable(a)).courses.eng.dueSkip, '2026-11-02');
  assert.equal('dueSkip' in mergeStates(defaultState(), syncable(defaultState())).courses.eng, false);
  assert.equal('dueSkip' in mergeStates(defaultState(), { ...syncable(defaultState()), courses: { eng: { dueSkip: 5 } } }).courses.eng, false);
  const local = { ...defaultState(), settings: { ...defaultState().settings, reviewCap: 40 } };
  assert.equal(mergeStates(local, syncable({ ...defaultState() })).settings.reviewCap, 40);
  assert.equal('reviewCap' in (syncable(local).settings || {}), false);
});

test('home summary: its due count honours the limit', () => {
  const s = withDue(30, { settings: { ...defaultState().settings, reviewCap: 10 } });
  assert.equal(courseSummary(s, 'eng', 'nl', DAY).due, 10);
});
