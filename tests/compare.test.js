import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareAttempts } from '../src/core/compare.js';

test('fewer fillers and more words is better', () => {
  const rows = compareAttempts(
    { metrics: { fillerRate: 6, wpm: 100, words: 50 } },
    { metrics: { fillerRate: 2.5, wpm: 120, words: 70 } },
  );
  assert.deepEqual(rows, [
    { key: 'fillerRate', before: 6, now: 2.5, better: true },
    { key: 'wpm', before: 100, now: 120, better: null },
    { key: 'words', before: 50, now: 70, better: true },
  ]);
});

test('same values are neutral, worse is false', () => {
  const rows = compareAttempts(
    { metrics: { fillerRate: 2, wpm: 120, words: 70, pauses: 3 } },
    { metrics: { fillerRate: 4, wpm: 120, words: 60, pauses: 1 } },
  );
  assert.deepEqual(rows.map((r) => [r.key, r.better]), [
    ['fillerRate', false], ['wpm', null], ['words', false], ['pauses', false],
  ]);
});

test('pauses only when both attempts have them', () => {
  const rows = compareAttempts({ metrics: { fillerRate: 1, wpm: 1, words: 1, pauses: 2 } }, { metrics: { fillerRate: 1, wpm: 1, words: 1 } });
  assert.equal(rows.find((r) => r.key === 'pauses'), undefined);
});

test('no previous gives no rows', () => {
  assert.deepEqual(compareAttempts(null, { metrics: { fillerRate: 1 } }), []);
});

test('changes under 5% are neutral', () => {
  const rows = compareAttempts({ metrics: { fillerRate: 44.3, words: 100 } }, { metrics: { fillerRate: 44.2, words: 103 } });
  assert.deepEqual(rows.map((r) => r.better), [null, null]);
});
