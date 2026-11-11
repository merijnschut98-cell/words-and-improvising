import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creditXp, XP_DAYS_KEEP } from '../src/core/flair.js';
import { defaultState } from '../src/core/storage.js';

const TODAY = '2026-11-02';

test('creditXp adds to the total and to today\'s xpDays', () => {
  const s = creditXp({ ...defaultState(), xp: 40, xpDays: { [TODAY]: 5 } }, 20, TODAY);
  assert.equal(s.xp, 60);
  assert.equal(s.xpDays[TODAY], 25);
  const fresh = creditXp({ xp: 0 }, 10, TODAY);
  assert.deepEqual(fresh.xpDays, { [TODAY]: 10 });
});

test('creditXp with 0 XP changes nothing', () => {
  const before = { ...defaultState(), xp: 7 };
  assert.equal(creditXp(before, 0, TODAY), before);
});

test('creditXp keeps only the last 60 days', () => {
  assert.equal(XP_DAYS_KEEP, 60);
  const xpDays = { '2026-09-03': 5, '2026-09-04': 6, '2026-11-01': 3 };
  const s = creditXp({ xp: 0, xpDays }, 10, TODAY);
  assert.deepEqual(Object.keys(s.xpDays).sort(), ['2026-09-04', '2026-11-01', TODAY]);
});

import { GOALS, DEFAULT_GOAL, goalProgress, goalJustReached, setGoal } from '../src/core/flair.js';

test('goalProgress reads xpDays[today] against dailyGoal.xp; missing goal means 30', () => {
  assert.deepEqual(GOALS, [20, 30, 50]);
  assert.equal(DEFAULT_GOAL, 30);
  assert.deepEqual(goalProgress({ xpDays: { [TODAY]: 18 } }, TODAY), { xp: 18, goal: 30, done: false });
  assert.deepEqual(goalProgress({ xpDays: { [TODAY]: 18 }, dailyGoal: { xp: 50, ts: 1 } }, TODAY), { xp: 18, goal: 50, done: false });
  assert.deepEqual(goalProgress({}, TODAY), { xp: 0, goal: 30, done: false });
  assert.equal(goalProgress({ xpDays: { [TODAY]: 5 }, dailyGoal: { xp: 7 } }, TODAY).goal, 30, 'a goal outside the choices reads as the default');
});

test('goalProgress caps the shown value at the goal but done stays true above it', () => {
  assert.deepEqual(goalProgress({ xpDays: { [TODAY]: 45 }, dailyGoal: { xp: 20, ts: 1 } }, TODAY), { xp: 20, goal: 20, done: true });
});

test('goalJustReached is true only on the apply that crosses the goal', () => {
  const at = (n) => ({ xpDays: { [TODAY]: n } });
  assert.equal(goalJustReached(at(20), at(40), TODAY), true);
  assert.equal(goalJustReached(at(30), at(50), TODAY), false, 'already reached');
  assert.equal(goalJustReached(at(0), at(20), TODAY), false, 'not yet');
  assert.equal(goalJustReached(at(10), at(30), TODAY), true, 'exactly the goal');
});

test('setGoal stores a choice with its ts and rejects anything else', () => {
  const s = setGoal(defaultState(), 50, 123);
  assert.deepEqual(s.dailyGoal, { xp: 50, ts: 123 });
  const same = defaultState();
  assert.equal(setGoal(same, 40, 1), same);
});

import { isPerfect } from '../src/core/flair.js';

test('isPerfect: every first try right and no hint', () => {
  assert.equal(isPerfect({ a: true, b: true }, { a: true, b: true }), true);
  assert.equal(isPerfect({ a: true, b: true }, {}), true, 'no sure entry means no hint');
});

test('isPerfect is false with one miss, with one hint, or with no questions', () => {
  assert.equal(isPerfect({ a: true, b: false }, {}), false);
  assert.equal(isPerfect({ a: true, b: true }, { b: false }), false);
  assert.equal(isPerfect({}, {}), false);
  assert.equal(isPerfect(null, null), false);
});

import { medalFor, newMedals, SILVER_SHARE, TIERS, speakMedalFor, newSpeakMedals } from '../src/core/flair.js';

// A small fixture module of 4 levels (not real content).
const MOD = { id: 'eng.fx', subject: 'eng', lessons: ['eng.fx.a', 'eng.fx.b', 'eng.fx.c', 'eng.fx.d'], questions: {} };
const withLessons = (lessons, extra = {}) => ({ ...defaultState(), courses: { eng: { lessons, sessions: [], ...extra }, pm: { lessons: {}, sessions: [] } } });
const passed = (ids, perfect = []) => Object.fromEntries(ids.map((id) => [id, { passed: 1, ...(perfect.includes(id) ? { perfect: 2 } : {}) }]));

test('medalFor: null until every level is passed, then bronze', () => {
  assert.deepEqual(TIERS, ['bronze', 'silver', 'gold']);
  assert.equal(medalFor(withLessons(passed(['eng.fx.a', 'eng.fx.b', 'eng.fx.c'])), MOD), null);
  assert.equal(medalFor(withLessons(passed(MOD.lessons)), MOD), 'bronze');
  assert.equal(medalFor(defaultState(), MOD), null);
});

test('medalFor: silver needs bronze and a perfect quiz on ceil(75%) of levels', () => {
  assert.equal(SILVER_SHARE, 0.75);
  assert.equal(medalFor(withLessons(passed(MOD.lessons, ['eng.fx.a', 'eng.fx.b'])), MOD), 'bronze');
  assert.equal(medalFor(withLessons(passed(MOD.lessons, ['eng.fx.a', 'eng.fx.b', 'eng.fx.c'])), MOD), 'silver');
  const five = { ...MOD, lessons: [...MOD.lessons, 'eng.fx.e'] };
  assert.equal(medalFor(withLessons(passed(five.lessons, ['eng.fx.a', 'eng.fx.b', 'eng.fx.c'])), five), 'bronze', 'ceil(3.75) = 4');
  const notAll = withLessons({ ...passed(['eng.fx.a', 'eng.fx.b', 'eng.fx.c'], ['eng.fx.a', 'eng.fx.b', 'eng.fx.c']) });
  assert.equal(medalFor(notAll, MOD), null, 'perfect quizzes without bronze give nothing');
});

test('medalFor: gold needs silver and a perfect module check; a perfect check before silver gives gold when silver arrives', () => {
  const checks = { 'eng.fx': { last: '2026-11-01', best: 10, total: 10, perfect: 5 } };
  assert.equal(medalFor(withLessons(passed(MOD.lessons), { checks }), MOD), 'bronze', 'a perfect check alone is not gold');
  assert.equal(medalFor(withLessons(passed(MOD.lessons, ['eng.fx.a', 'eng.fx.b', 'eng.fx.c']), { checks }), MOD), 'gold');
  const imperfect = { 'eng.fx': { last: '2026-11-01', best: 9, total: 10, perfect: null } };
  assert.equal(medalFor(withLessons(passed(MOD.lessons, MOD.lessons), { checks: imperfect }), MOD), 'silver');
});

test('newMedals lists only tiers above the stored one, never lower', () => {
  const s = withLessons(passed(MOD.lessons, ['eng.fx.a', 'eng.fx.b', 'eng.fx.c']), { medals: { 'eng.fx': { tier: 'bronze', ts: 1 } } });
  assert.deepEqual(newMedals(s, 'eng', [MOD]), [{ moduleId: 'eng.fx', tier: 'silver' }]);
  const same = withLessons(passed(MOD.lessons), { medals: { 'eng.fx': { tier: 'bronze', ts: 1 } } });
  assert.deepEqual(newMedals(same, 'eng', [MOD]), []);
  const higher = withLessons(passed(MOD.lessons), { medals: { 'eng.fx': { tier: 'gold', ts: 1 } } });
  assert.deepEqual(newMedals(higher, 'eng', [MOD]), []);
});

test('a stored gold stays gold after a new level is added to the module', () => {
  const grown = { ...MOD, lessons: [...MOD.lessons, 'eng.fx.new'] };
  const s = withLessons(passed(MOD.lessons, MOD.lessons), { medals: { 'eng.fx': { tier: 'gold', ts: 1 } } });
  assert.equal(medalFor(s, grown), null, 'the rules now say not every level is passed');
  assert.deepEqual(newMedals(s, 'eng', [grown]), [], 'but nothing is taken away');
  assert.equal(s.courses.eng.medals['eng.fx'].tier, 'gold');
});

// Speaking medals per drill group (Q4): bronze every drill practised, silver
// 3 of 4 owned, gold silver and a boss round scored 4 or higher.
const DAY = 86400000;
const NOW = new Date(2026, 10, 2, 9).getTime();
const rounds = (drill, n, rating = 3, start = NOW - 10 * DAY) => Array.from({ length: n }, (_, i) => ({ ts: start + i * DAY, drill, rating, metrics: { words: 50 } }));
const BASICS = { id: 'basics', drills: ['minute', 'explain', 'story', 'pause'] };

test('speakMedalFor: bronze when every drill of the group is practised, silver at 3 of 4 owned, gold adds a boss round of 4+', () => {
  const practised = BASICS.drills.flatMap((d) => rounds(d, 3));
  assert.equal(speakMedalFor({ history: rounds('minute', 3) }, BASICS, NOW), null);
  assert.equal(speakMedalFor({ history: practised }, BASICS, NOW), 'bronze');
  const owned3 = [...practised, ...['minute', 'explain', 'story'].flatMap((d) => rounds(d, 3, 5))];
  assert.equal(speakMedalFor({ history: owned3 }, BASICS, NOW), 'silver');
  const boss = [{ ts: NOW - DAY, drill: 'boss', rating: 4, metrics: { words: 200 } }];
  assert.equal(speakMedalFor({ history: [...owned3, ...boss] }, BASICS, NOW), 'gold');
  const weakBoss = [{ ts: NOW - DAY, drill: 'boss', rating: 3, metrics: { words: 200 } }];
  assert.equal(speakMedalFor({ history: [...owned3, ...weakBoss] }, BASICS, NOW), 'silver');
});

test('newSpeakMedals never lowers a stored speaking medal (ownership fades)', () => {
  const practised = BASICS.drills.flatMap((d) => rounds(d, 3));
  const s = { history: practised, speakMedals: { basics: { tier: 'silver', ts: 1 } } };
  assert.deepEqual(newSpeakMedals(s, NOW), []);
  assert.deepEqual(newSpeakMedals({ history: practised, speakMedals: {} }, NOW), [{ groupId: 'basics', tier: 'bronze' }]);
});
