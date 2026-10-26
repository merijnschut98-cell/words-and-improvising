import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dayKey, updateStreak, xpForRound, levelFromXp, adjustDrillLevel, drillTiming,
} from '../src/core/progress.js';

test('dayKey uses local date', () => {
  assert.equal(dayKey(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
});

test('streak: first ever round', () => {
  assert.deepEqual(updateStreak({ count: 0, lastDay: null }, '2026-10-23'), { count: 1, lastDay: '2026-10-23' });
});

test('streak: same day is idempotent', () => {
  const s = { count: 4, lastDay: '2026-10-23' };
  assert.deepEqual(updateStreak(s, '2026-10-23'), s);
});

test('streak: next day increments, across month boundary', () => {
  assert.deepEqual(updateStreak({ count: 4, lastDay: '2026-10-31' }, '2026-11-01'), { count: 5, lastDay: '2026-11-01' });
});

test('streak: gap resets', () => {
  assert.deepEqual(updateStreak({ count: 9, lastDay: '2026-10-20' }, '2026-10-22'), { count: 1, lastDay: '2026-10-22' });
});

test('xp: too few words earns nothing', () => {
  assert.equal(xpForRound({ metrics: { words: 3, fillerRate: 0 }, durationS: 60, targetS: 60, rating: 5 }), 0);
});

test('xp: full marks is 30', () => {
  assert.equal(xpForRound({ metrics: { words: 100, fillerRate: 1 }, durationS: 60, targetS: 60, rating: 5 }), 30);
});

test('xp: half time, many fillers, low rating', () => {
  assert.equal(xpForRound({ metrics: { words: 50, fillerRate: 8 }, durationS: 30, targetS: 60, rating: 2 }), 15);
});

test('levelFromXp', () => {
  assert.deepEqual(levelFromXp(0), { level: 1, into: 0, needed: 100 });
  assert.deepEqual(levelFromXp(250), { level: 2, into: 150, needed: 200 });
  assert.deepEqual(levelFromXp(300), { level: 3, into: 0, needed: 300 });
});

test('adjustDrillLevel clamps', () => {
  assert.equal(adjustDrillLevel(5, 5), 5);
  assert.equal(adjustDrillLevel(1, 1), 1);
  assert.equal(adjustDrillLevel(3, 4), 4);
  assert.equal(adjustDrillLevel(3, 3), 3);
  assert.equal(adjustDrillLevel(3, 2), 2);
});

test('drillTiming', () => {
  assert.deepEqual(drillTiming('minute', 1), { prepS: 15, answerS: 30, questions: 1 });
  assert.deepEqual(drillTiming('explain', 5), { prepS: 0, answerS: 90, questions: 1 });
  assert.deepEqual(drillTiming('rapid', 3), { prepS: 0, answerS: 10, questions: 5 });
  assert.deepEqual(drillTiming('minute', 99), { prepS: 0, answerS: 90, questions: 1 });
});

import { twistEvery } from '../src/core/progress.js';

test('twistEvery shrinks with level and clamps', () => {
  assert.equal(twistEvery(1), 20);
  assert.equal(twistEvery(5), 9);
  assert.equal(twistEvery(9), 9);
  assert.equal(twistEvery(0), 20);
});

test('pause drill bonus: 3+ pauses and almost no fillers', () => {
  const base = { metrics: { words: 100, fillerRate: 0.5, pauses: 3 }, durationS: 60, targetS: 60, rating: 5 };
  assert.equal(xpForRound({ ...base, drill: 'pause' }), 35);
  assert.equal(xpForRound({ ...base, drill: 'minute' }), 30);
  assert.equal(xpForRound({ ...base, drill: 'pause', metrics: { words: 100, fillerRate: 2, pauses: 5 } }), 30);
});

test('pause bonus also needs a normal speaking pace (swallowed "ehh" gaps are not pauses)', () => {
  const base = { durationS: 60, targetS: 60, rating: 5, drill: 'pause' };
  assert.equal(xpForRound({ ...base, metrics: { words: 100, fillerRate: 0, pauses: 4, wpm: 60 } }), 30);
  assert.equal(xpForRound({ ...base, metrics: { words: 100, fillerRate: 0, pauses: 4, wpm: 110 } }), 35);
});

import { debateSide } from '../src/core/progress.js';

test('debateSide flips at half time', () => {
  assert.equal(debateSide(0, 60), 'for');
  assert.equal(debateSide(29.9, 60), 'for');
  assert.equal(debateSide(30, 60), 'against');
  assert.equal(debateSide(59, 60), 'against');
});
