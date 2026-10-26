import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INTERVALS, scheduleReview, dueReviews, wasImproved } from '../src/core/spaced.js';
import { makePrompt, seededRng } from '../src/core/lesson.js';
import { applyRound } from '../src/core/round.js';
import { defaultState } from '../src/core/storage.js';
import nl from '../src/content/prompts.nl.js';

const entry = (promptId, drill = 'prep', lang = 'nl') => ({ promptId, drill, lang });

test('boxes are 1, 3, 7 and 21 days', () => {
  assert.deepEqual(INTERVALS, [1, 3, 7, 21]);
});

test('a new prompt goes into box 1, due tomorrow', () => {
  const r = scheduleReview({}, entry('opinion:o01'), '2026-10-27', false);
  assert.deepEqual(r['opinion:o01'], { box: 1, due: '2026-10-28', drill: 'prep', lang: 'nl' });
});

test('improving promotes a box; not improving goes back to box 1', () => {
  let r = scheduleReview({}, entry('opinion:o01'), '2026-10-27', false);
  r = scheduleReview(r, entry('opinion:o01'), '2026-10-28', true);
  assert.deepEqual([r['opinion:o01'].box, r['opinion:o01'].due], [2, '2026-10-31']);
  r = scheduleReview(r, entry('opinion:o01'), '2026-10-31', true);
  assert.deepEqual([r['opinion:o01'].box, r['opinion:o01'].due], [3, '2026-11-07']);
  r = scheduleReview(r, entry('opinion:o01'), '2026-11-07', false);
  assert.deepEqual([r['opinion:o01'].box, r['opinion:o01'].due], [1, '2026-11-08']);
});

test('improving from box 4 retires the prompt', () => {
  const r = scheduleReview({ 'opinion:o01': { box: 4, due: '2026-11-01', drill: 'prep', lang: 'nl' } }, entry('opinion:o01'), '2026-11-01', true);
  assert.equal(r['opinion:o01'], undefined);
});

test('coach-written and live prompts are not scheduled', () => {
  assert.deepEqual(scheduleReview({}, entry('ai:123', 'minute'), '2026-10-27', false), {});
});

test('nothing is due on the first day; due items are rebuilt; unknown ids and other languages dropped', () => {
  const p = makePrompt('prep', nl, seededRng(3));
  const reviews = {
    [p.id]: { box: 1, due: '2026-10-28', drill: 'prep', lang: 'nl' },
    'opinion:zz99': { box: 1, due: '2026-10-28', drill: 'prep', lang: 'nl' },
    'topic:t01': { box: 1, due: '2026-10-28', drill: 'minute', lang: 'en' },
  };
  assert.deepEqual(dueReviews(reviews, '2026-10-27', nl, 'nl'), []);
  const due = dueReviews(reviews, '2026-10-28', nl, 'nl');
  assert.equal(due.length, 1);
  assert.equal(due[0].id, p.id);
  assert.equal(due[0].body, p.body);
});

test('wasImproved: fewer fillers/min or a higher rating than the earlier attempt', () => {
  const prev = { metrics: { fillerRate: 3 }, rating: 3 };
  assert.equal(wasImproved(prev, { metrics: { fillerRate: 2 }, rating: 3 }), true);
  assert.equal(wasImproved(prev, { metrics: { fillerRate: 3 }, rating: 4 }), true);
  assert.equal(wasImproved(prev, { metrics: { fillerRate: 4 }, rating: 3 }), false);
  assert.equal(wasImproved(null, { metrics: { fillerRate: 1 }, rating: 5 }), false);
});

test('applyRound schedules the prompt and promotes it after a better second try', () => {
  const prompt = { id: 'opinion:o01', drill: 'prep', body: 'X', extra: {}, seenIds: ['opinion:o01'] };
  const base = { prompt, transcript: 'a b c d e f', durationS: 30, targetS: 30, lang: 'nl', mode: 'speak', coach: null };
  const one = applyRound(defaultState(), { ...base, metrics: { words: 60, fillerRate: 3, wpm: 120, fillerCount: 3, fillers: {} }, rating: 3 }, '2026-10-27', 1000);
  assert.equal(one.state.reviews['opinion:o01'].box, 1);
  const two = applyRound(one.state, { ...base, metrics: { words: 60, fillerRate: 1, wpm: 120, fillerCount: 1, fillers: {} }, rating: 3 }, '2026-10-28', 2000);
  assert.equal(two.state.reviews['opinion:o01'].box, 2);
});
