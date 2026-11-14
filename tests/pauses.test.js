import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countPauses, pauseRatio } from '../src/core/pauses.js';

test('no events, one event', () => {
  assert.equal(countPauses([]), 0);
  assert.equal(countPauses([1000]), 0);
});

test('counts gaps of at least 1.5s between growth events', () => {
  assert.equal(countPauses([0, 400, 900, 2600, 3000, 4400, 6000]), 2);
});

test('custom threshold', () => {
  assert.equal(countPauses([0, 1000, 2000], 900), 2);
});

test('ratio', () => {
  assert.equal(pauseRatio(3, 1), 0.75);
  assert.equal(pauseRatio(0, 0), null);
});
