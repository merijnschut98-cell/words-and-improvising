import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modelOverlap } from '../src/core/shadow.js';
import { applyRound } from '../src/core/round.js';
import { defaultState } from '../src/core/storage.js';

test('modelOverlap: share of the model content words he said', () => {
  const model = 'My point is clear: the bridge connects both teams.';
  assert.equal(modelOverlap(model, 'my point is clear the bridge connects both teams', 'en'), 1);
  const half = modelOverlap(model, 'the bridge connects', 'en');
  assert.ok(half > 0.2 && half < 0.8, String(half));
  assert.equal(modelOverlap(model, '', 'en'), 0);
  assert.equal(modelOverlap('', 'anything', 'en'), 0);
});

test('modelOverlap ignores fillers and tiny words', () => {
  assert.equal(modelOverlap('um the plan works', 'plan works', 'en'), 1);
});

test('a shadow round earns XP but leaves spaced reviews and personal bests alone', () => {
  const prompt = { id: 'opinion:o01', drill: 'prep', body: 'X', extra: { shadow: true, model: 'Y' }, seenIds: [] };
  const round = { prompt, transcript: 'a b c d e f', durationS: 30, targetS: 30, lang: 'nl', mode: 'speak', coach: null, rating: 4,
    metrics: { words: 80, fillerRate: 0.5, wpm: 130, fillerCount: 1, fillers: {} } };
  const r = applyRound(defaultState(), round, '2026-10-27', 1000);
  assert.ok(r.xp > 0);
  assert.deepEqual(r.state.reviews, {});
  assert.deepEqual(r.state.bests, {});
  assert.equal(r.state.history[0].shadow, true);
});

test('a shadow round never becomes his baseline for that prompt', () => {
  const prompt = { id: 'opinion:o01', drill: 'prep', body: 'X', extra: {}, seenIds: [] };
  const s0 = { ...defaultState(), reviews: { 'nl|opinion:o01': { box: 1, due: '2026-10-27', drill: 'prep', lang: 'nl' } },
    history: [
      { ts: 3, drill: 'prep', lang: 'nl', promptId: 'opinion:o01', shadow: true, metrics: { words: 50, fillerRate: 9 }, rating: 1 },
      { ts: 2, drill: 'prep', lang: 'nl', promptId: 'opinion:o01', metrics: { words: 50, fillerRate: 1 }, rating: 5 },
    ] };
  const r = applyRound(s0, { prompt, transcript: 'a b c d e f', durationS: 30, targetS: 30, lang: 'nl', mode: 'speak', coach: null, rating: 3,
    metrics: { words: 60, fillerRate: 5, wpm: 120, fillerCount: 5, fillers: {} } }, '2026-10-27', 1000);
  // Compared with his own earlier attempt (1/min, rated 5) this is not better: back to box 1.
  assert.equal(r.state.reviews['nl|opinion:o01'].box, 1);
});

test('a shadow round does not move the drill level', () => {
  const prompt = { id: 'opinion:o01', drill: 'prep', body: 'X', extra: { shadow: true, model: 'Y' }, seenIds: [] };
  const r = applyRound(defaultState(), { prompt, transcript: 'a b c d e f', durationS: 30, targetS: 30, lang: 'nl', mode: 'speak', coach: null, rating: 5,
    metrics: { words: 80, fillerRate: 0.5, wpm: 130, fillerCount: 1, fillers: {} } }, '2026-10-27', 1000);
  assert.equal(r.state.drillLevels.prep, defaultState().drillLevels.prep);
});
