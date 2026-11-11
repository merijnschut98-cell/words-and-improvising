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
