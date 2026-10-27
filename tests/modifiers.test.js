import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODIFIERS, pickModifier, applyModifierTiming, modifierCheck } from '../src/core/modifiers.js';
import { seededRng } from '../src/core/lesson.js';
import { xpForRound } from '../src/core/progress.js';

test('never a modifier at level 1 unless forced', () => {
  const rng = seededRng(1);
  for (let i = 0; i < 200; i++) assert.equal(pickModifier(rng, 1), null);
  assert.ok(MODIFIERS.includes(pickModifier(rng, 1, true)));
});

test('about 25% of rounds at level 2+', () => {
  const rng = seededRng(42);
  let n = 0;
  for (let i = 0; i < 1000; i++) if (pickModifier(rng, 3)) n++;
  assert.ok(n >= 200 && n <= 300, String(n));
});

test('forced pick is never null', () => {
  const rng = seededRng(7);
  for (let i = 0; i < 100; i++) assert.ok(MODIFIERS.includes(pickModifier(rng, 4, true)));
});

test('cold start removes prep time', () => {
  assert.deepEqual(applyModifierTiming({ prepS: 10, answerS: 45, questions: 1 }, 'cold'), { prepS: 0, answerS: 45, questions: 1 });
  assert.deepEqual(applyModifierTiming({ prepS: 10, answerS: 45, questions: 1 }, 'whisper'), { prepS: 10, answerS: 45, questions: 1 });
});

test('checkable modifiers report whether they were met', () => {
  assert.deepEqual(modifierCheck('slow', { wpm: 100 }, '', 'en'), { checked: true, ok: true });
  assert.deepEqual(modifierCheck('slow', { wpm: 140 }, '', 'en'), { checked: true, ok: false });
  assert.deepEqual(modifierCheck('noI', {}, 'We think the team should go', 'en'), { checked: true, ok: true });
  assert.deepEqual(modifierCheck('noI', {}, 'I think we should go', 'en'), { checked: true, ok: false });
  assert.deepEqual(modifierCheck('noI', {}, 'Ik denk dat het kan', 'nl'), { checked: true, ok: false });
  assert.deepEqual(modifierCheck('whisper', {}, 'x', 'en'), { checked: false, ok: true });
});

test('a modifier adds 5 XP', () => {
  const base = { metrics: { words: 100, fillerRate: 4 }, durationS: 60, targetS: 60, rating: 3 };
  assert.equal(xpForRound({ ...base, modifier: 'whisper' }) - xpForRound(base), 5);
});

test('word budget: 60 / 45 / 30 words by drill level', async () => {
  const { wordBudget } = await import('../src/core/modifiers.js');
  assert.equal(wordBudget(1), 60);
  assert.equal(wordBudget(2), 60);
  assert.equal(wordBudget(3), 45);
  assert.equal(wordBudget(4), 45);
  assert.equal(wordBudget(5), 30);
});

test('word budget is met within the cap and at least 60 % of it', async () => {
  const { modifierCheck, MODIFIERS } = await import('../src/core/modifiers.js');
  assert.ok(MODIFIERS.includes('budget'));
  const words = (n) => Array.from({ length: n }, (_, i) => `woord${i}`).join(' ');
  assert.deepEqual(modifierCheck('budget', { words: 40 }, words(40), 'nl', 3), { checked: true, ok: true });
  assert.deepEqual(modifierCheck('budget', { words: 50 }, words(50), 'nl', 3), { checked: true, ok: false });
  assert.deepEqual(modifierCheck('budget', { words: 20 }, words(20), 'nl', 3), { checked: true, ok: false });
  // Counts with tokenize, like the metrics: fillers and punctuation behave the same.
  assert.equal(modifierCheck('budget', { words: 0 }, words(27), 'nl', 3).ok, true);
});

test('the word budget is never handed to multi-part or spoken-cue drills', async () => {
  const { pickModifier: pick, MODIFIERS: M } = await import('../src/core/modifiers.js');
  const budgetRng = () => () => (M.indexOf('budget') + 0.5) / M.length;
  for (const d of ['rapid', 'yesAnd', 'expert', 'listen', 'followUp', 'pressure']) assert.notEqual(pick(budgetRng(), 5, true, d), 'budget', d);
  assert.equal(pick(budgetRng(), 5, true, 'minute'), 'budget');
});
