import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsWeeklyReset, weekSuggestions, chooseFocus, weekFocus } from '../src/core/weekly.js';
import { buildLesson, seededRng } from '../src/core/lesson.js';
import { defaultState } from '../src/core/storage.js';
import en from '../src/content/prompts.en.js';

const MON = new Date(2026, 10, 2, 9); // Mon 2 Nov 2026
const SUN = new Date(2026, 10, 1, 20); // Sun 1 Nov 2026 (previous ISO week)
const h = (drill, rating, when = SUN) => ({ ts: when.getTime(), drill, rating, coach: null, metrics: { words: 50, fillerRate: 2 } });

test('a brand-new player never gets the weekly reset', () => {
  assert.equal(needsWeeklyReset(defaultState(), MON), false);
});

test('first open in a new ISO week asks once; after choosing it does not ask again that week', () => {
  const s = { ...defaultState(), history: [h('debate', 2)] };
  assert.equal(needsWeeklyReset(s, MON), true);
  const chosen = chooseFocus(s, MON, 'debate');
  assert.equal(needsWeeklyReset(chosen, MON), false);
  assert.equal(needsWeeklyReset(chosen, new Date(2026, 10, 9, 9)), true);
});

test('keeping it adaptive also counts as answered', () => {
  const s = chooseFocus({ ...defaultState(), history: [h('prep', 3)] }, MON, null);
  assert.equal(needsWeeklyReset(s, MON), false);
  assert.equal(weekFocus(s, MON), null);
});

test('suggestions: weakest drill, frames, real life; always 3 distinct', () => {
  const s = { ...defaultState(), history: [h('debate', 1), h('debate', 2), h('minute', 5), h('minute', 5)] };
  const sug = weekSuggestions(s);
  assert.deepEqual(sug, ['debate', 'frame', 'real']);
  const s2 = { ...defaultState(), history: [h('frame', 1), h('frame', 1)] };
  const sug2 = weekSuggestions(s2);
  assert.equal(new Set(sug2).size, 3);
  assert.equal(sug2[0], 'frame');
  assert.equal(weekSuggestions(defaultState()).length, 3);
});

test('the chosen focus leads the lesson for that week only', () => {
  const history = [h('debate', 1), h('debate', 1), h('minute', 5), h('minute', 5)];
  const s = chooseFocus({ ...defaultState(), history }, MON, 'followUp');
  const focus = weekFocus(s, MON);
  assert.equal(focus, 'followUp');
  const ls = buildLesson(en, seededRng(3), {}, { history, due: [], focus });
  assert.equal(ls[0].drill, 'followUp');
  assert.equal(ls[0].reason, 'focus');
  assert.equal(new Set(ls.map((p) => p.drill)).size, 3);
  assert.equal(weekFocus(s, new Date(2026, 10, 9, 9)), null);
});
