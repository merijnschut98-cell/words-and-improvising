import { test } from 'node:test';
import assert from 'node:assert/strict';
import { drillTiming } from '../src/core/progress.js';

// "Eén minuut" means one minute of talking at every level; the level only shortens thinking time.
test('the one-minute drill always gives 60 s to speak', () => {
  for (let level = 1; level <= 5; level++) assert.equal(drillTiming('minute', level).answerS, 60);
});

test('the one-minute drill still shortens prep time as the level rises', () => {
  assert.equal(drillTiming('minute', 1).prepS, 15);
  assert.equal(drillTiming('minute', 5).prepS, 0);
});
