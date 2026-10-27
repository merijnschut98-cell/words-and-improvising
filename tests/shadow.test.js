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
