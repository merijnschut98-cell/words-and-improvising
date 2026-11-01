import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STRINGS, translator } from '../src/i18n.js';

test('en and nl have the same keys', () => {
  assert.deepEqual(Object.keys(STRINGS.en).sort(), Object.keys(STRINGS.nl).sort());
  assert.deepEqual(Object.keys(STRINGS.en.coachErr).sort(), Object.keys(STRINGS.nl.coachErr).sort());
});

test('translator handles functions and missing keys', () => {
  const t = translator('nl');
  assert.equal(t('roundOf', 1, 3), 'Ronde 1 van 3');
  assert.equal(t('nope'), 'nope');
});

test('weekly summary says plainly when there were no rounds', () => {
  for (const lang of ['en', 'nl']) {
    const s = STRINGS[lang].weekRounds(0, 0);
    assert.ok(!/<1/.test(s), s);
    assert.ok(!/\b0\b/.test(s), s);
  }
  assert.match(STRINGS.en.weekRounds(3, 0), /<1 minute/);
});
