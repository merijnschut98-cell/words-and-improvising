import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loudnessStats } from '../src/core/loudness.js';

const flat = (n, v = 0.2) => Array.from({ length: n }, () => v);
// Alternating loud/soft: coefficient of variation well above 0.45.
const lively = (n) => Array.from({ length: n }, (_, i) => (i % 2 ? 0.08 + (i % 7) * 0.01 : 0.35 + (i % 5) * 0.03));

test('too short or empty returns null', () => {
  assert.equal(loudnessStats([]), null);
  assert.equal(loudnessStats(null), null);
  assert.equal(loudnessStats(flat(49)), null);
});

test('flat signal is flat and not trailing off', () => {
  assert.deepEqual(loudnessStats(flat(80)), { variety: 'flat', trailingOff: false });
});

test('lively signal is lively', () => {
  assert.equal(loudnessStats(lively(90)).variety, 'lively');
});

test('moderate variation is ok', () => {
  const s = Array.from({ length: 90 }, (_, i) => 0.2 + ((i % 3) - 1) * 0.06); // cv about 0.24
  assert.equal(loudnessStats(s).variety, 'ok');
});

test('trailing off: last third clearly quieter than the first', () => {
  const s = [...flat(30, 0.3), ...flat(30, 0.25), ...flat(30, 0.12)];
  assert.equal(loudnessStats(s).trailingOff, true);
  const steady = [...flat(30, 0.3), ...flat(30, 0.25), ...flat(30, 0.25)];
  assert.equal(loudnessStats(steady).trailingOff, false);
});

test('silence is ignored for variety and length', () => {
  const s = [];
  for (let i = 0; i < 60; i += 1) s.push(0.2, 0.005, 0);
  assert.deepEqual(loudnessStats(s), { variety: 'flat', trailingOff: false });
  // 40 voiced samples padded with lots of silence is still too short.
  assert.equal(loudnessStats([...flat(40), ...flat(200, 0.01)]), null);
});

test('non-numbers are ignored', () => {
  assert.equal(loudnessStats([...flat(49), NaN, undefined]), null);
});
