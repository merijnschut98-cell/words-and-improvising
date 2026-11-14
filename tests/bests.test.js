import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateBests } from '../src/core/bests.js';

const entry = (o = {}) => ({
  ts: 1, drill: 'minute', durationS: 60, cleanRun: 20,
  metrics: { words: 100, fillerRate: 3, pauses: 2, ...(o.metrics || {}) }, ...o,
});
const keys = (r) => r.newBests.map((b) => (b.drill ? `${b.key}:${b.drill}` : b.key)).sort();

test('first qualifying round sets all bests', () => {
  const r = updateBests({}, entry());
  assert.deepEqual(keys(r), ['cleanRun', 'fillerRate', 'fillerRate:minute', 'pauses', 'words']);
  assert.equal(r.bests.fillerRate.value, 3);
  assert.equal(r.bests.byDrill.minute.fillerRate.value, 3);
});

test('a worse round changes nothing', () => {
  const first = updateBests({}, entry()).bests;
  const r = updateBests(first, entry({ cleanRun: 5, metrics: { words: 50, fillerRate: 6, pauses: 1 } }));
  assert.deepEqual(r.newBests, []);
  assert.deepEqual(r.bests, first);
});

test('a better round updates only what improved', () => {
  const first = updateBests({}, entry()).bests;
  const r = updateBests(first, entry({ ts: 2, metrics: { words: 120, fillerRate: 3, pauses: 2 } }));
  assert.deepEqual(keys(r), ['words']);
  assert.equal(r.bests.words.value, 120);
  assert.equal(r.bests.words.ts, 2);
});

test('tiny rounds are ignored, fillerRate needs 30+ words', () => {
  assert.deepEqual(updateBests({}, entry({ durationS: 1 })).newBests, []);
  assert.deepEqual(updateBests({}, entry({ metrics: { words: 4 } })).newBests, []);
  const short = updateBests({}, entry({ metrics: { words: 20, fillerRate: 0, pauses: 0 } }));
  assert.ok(!keys(short).includes('fillerRate'));
});

test('per-drill best is independent of the global best', () => {
  const first = updateBests({}, entry({ metrics: { words: 100, fillerRate: 1, pauses: 0 } })).bests;
  const r = updateBests(first, entry({ drill: 'prep', cleanRun: 1, metrics: { words: 40, fillerRate: 4, pauses: 0 } }));
  assert.deepEqual(keys(r), ['fillerRate:prep']);
  assert.equal(r.bests.fillerRate.value, 1);
});

test('missing cleanRun or pauses are skipped', () => {
  const r = updateBests({}, entry({ cleanRun: undefined, metrics: { words: 50, fillerRate: 2, pauses: undefined } }));
  assert.deepEqual(keys(r), ['fillerRate', 'fillerRate:minute', 'words']);
});
