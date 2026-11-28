import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bossAvailable, isoWeekKey } from '../src/core/boss.js';
import { makePrompt, seededRng } from '../src/core/lesson.js';
import { drillTiming, xpForRound } from '../src/core/progress.js';
import { defaultState } from '../src/core/storage.js';
import en from '../src/content/prompts.en.js';

const at = (y, m, d, h = 12) => new Date(y, m - 1, d, h);

test('boss is available Friday to Sunday only', () => {
  const s = defaultState();
  assert.equal(bossAvailable(s, at(2026, 10, 29)), false); // Thursday
  assert.equal(bossAvailable(s, at(2026, 10, 30)), true); // Friday
  assert.equal(bossAvailable(s, at(2026, 10, 31)), true); // Saturday
  assert.equal(bossAvailable(s, at(2026, 11, 1)), true); // Sunday
  assert.equal(bossAvailable(s, at(2026, 11, 2)), false); // Monday
});

test('boss disappears once done this ISO week, returns next week', () => {
  const s = { ...defaultState(), history: [{ ts: at(2026, 10, 30, 9).getTime(), drill: 'boss' }] };
  assert.equal(bossAvailable(s, at(2026, 10, 31)), false);
  assert.equal(bossAvailable(s, at(2026, 11, 6)), true);
  assert.equal(isoWeekKey(at(2026, 11, 1)), isoWeekKey(at(2026, 10, 26)));
  assert.notEqual(isoWeekKey(at(2026, 11, 2)), isoWeekKey(at(2026, 11, 1)));
});

test('boss prompt: statement, one twist, three words', () => {
  const p = makePrompt('boss', en, seededRng(3), {});
  assert.equal(p.drill, 'boss');
  assert.ok(en.opinions.some((o) => o.text === p.body));
  assert.equal(p.extra.twists.length, 1);
  assert.equal(p.extra.words.length, 3);
  assert.equal(new Set(p.extra.words).size, 3);
});

test('boss timing and double XP', () => {
  assert.deepEqual(drillTiming('boss', 1), { prepS: 15, answerS: 120, questions: 1 });
  const base = { metrics: { words: 200, fillerRate: 4 }, durationS: 120, targetS: 120, rating: 3 };
  assert.equal(xpForRound({ ...base, drill: 'boss' }), 2 * xpForRound(base));
});
