import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weeklyReview } from '../src/core/review.js';

const DAY = 86400000;
const now = Date.UTC(2026, 9, 24, 12);
const entry = (daysAgo, o = {}) => ({
  ts: now - daysAgo * DAY,
  drill: o.drill || 'minute',
  durationS: o.durationS ?? 60,
  rating: o.rating ?? null,
  coach: o.coach ?? null,
  metrics: { wpm: o.wpm ?? 120, fillerRate: o.fillerRate ?? 2, fillers: o.fillers || {} },
});

test('empty history', () => {
  const r = weeklyReview([], now);
  assert.deepEqual(r.thisWeek, { rounds: 0, minutes: 0, fillerRate: null, wpm: null });
  assert.equal(r.topFiller, null);
  assert.deepEqual(r.focus, { kind: 'rounds', value: 5 });
});

test('splits this week and last week and averages', () => {
  const h = [
    entry(1, { fillerRate: 2, wpm: 100, durationS: 90 }),
    entry(3, { fillerRate: 4, wpm: 140, durationS: 30 }),
    entry(8, { fillerRate: 6, wpm: 110 }),
    entry(20, { fillerRate: 9 }), // older than two weeks: ignored
  ];
  const r = weeklyReview(h, now);
  assert.deepEqual(r.thisWeek, { rounds: 2, minutes: 2, fillerRate: 3, wpm: 120 });
  assert.deepEqual(r.lastWeek, { rounds: 1, minutes: 1, fillerRate: 6, wpm: 110 });
});

test('top filler sums counts this week only', () => {
  const h = [
    entry(1, { fillers: { eh: 3, dus: 1 } }),
    entry(2, { fillers: { dus: 4 } }),
    entry(9, { fillers: { eh: 50 } }),
  ];
  assert.deepEqual(weeklyReview(h, now).topFiller, { word: 'dus', count: 5 });
});

test('best and worst drill need 2 rounds and use coach overall as fallback', () => {
  const h = [
    entry(1, { drill: 'prep', rating: 5 }),
    entry(1, { drill: 'prep', coach: { overall: 4 } }),
    entry(2, { drill: 'rapid', rating: 2 }),
    entry(2, { drill: 'rapid', rating: 1 }),
    entry(2, { drill: 'bridge', rating: 1 }), // only one round: excluded
  ];
  const r = weeklyReview(h, now);
  assert.deepEqual(r.best, { drill: 'prep', avg: 4.5 });
  assert.deepEqual(r.worst, { drill: 'rapid', avg: 1.5 });
});

test('focus: high filler rate names the top filler', () => {
  const h = Array.from({ length: 6 }, (_, i) => entry(i % 6, { fillerRate: 5, fillers: { eh: 2 } }));
  assert.deepEqual(weeklyReview(h, now).focus, { kind: 'filler', value: 'eh' });
});

test('focus: weakest drill when fillers are fine', () => {
  const h = [
    entry(1, { drill: 'rapid', rating: 2 }), entry(1, { drill: 'rapid', rating: 2 }),
    entry(2, { drill: 'prep', rating: 4 }), entry(2, { drill: 'prep', rating: 5 }),
    entry(3), entry(3),
  ];
  assert.deepEqual(weeklyReview(h, now).focus, { kind: 'drill', value: 'rapid' });
});

test('focus: stretch when everything is fine', () => {
  const h = Array.from({ length: 6 }, (_, i) => entry(i, { rating: 4 }));
  assert.deepEqual(weeklyReview(h, now).focus, { kind: 'stretch', value: null });
});
