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
