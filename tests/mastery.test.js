import { test } from 'node:test';
import assert from 'node:assert/strict';
import { masteryOf, ownedDrills } from '../src/core/mastery.js';
import { buildLesson, seededRng } from '../src/core/lesson.js';
import en from '../src/content/prompts.en.js';

const DAY = 86400000;
const NOW = new Date(2026, 9, 27, 12).getTime();
const r = (drill, daysAgo, rating, coach = null) => ({ ts: NOW - daysAgo * DAY, drill, rating, coach, metrics: { words: 50, fillerRate: 2 } });

test('learn → practise → own', () => {
  assert.equal(masteryOf([r('prep', 1, 2), r('prep', 2, 2)], 'prep', NOW), 'learn');
  assert.equal(masteryOf([r('prep', 1, 2), r('prep', 2, 2), r('prep', 3, 2)], 'prep', NOW), 'practise');
  assert.equal(masteryOf([r('prep', 1, 4), r('prep', 2, 5), r('prep', 3, 4)], 'prep', NOW), 'own');
});

test('own needs three different days within 14 days; the coach score counts when he did not rate', () => {
  assert.equal(masteryOf([r('prep', 1, 4), r('prep', 1, 5), r('prep', 1, 4)], 'prep', NOW), 'practise');
  assert.equal(masteryOf([r('prep', 1, 4), r('prep', 5, 4), r('prep', 20, 4)], 'prep', NOW), 'practise');
  assert.equal(masteryOf([r('prep', 1, null, { overall: 4 }), r('prep', 3, null, { overall: 5 }), r('prep', 6, 4)], 'prep', NOW), 'own');
});

test('the adaptive lesson does not pick an owned drill as the weakest', () => {
  // prep is lowest-rated overall but owned lately; debate is weak and not owned.
  const history = [r('prep', 1, 4), r('prep', 2, 4), r('prep', 3, 4), r('prep', 30, 1), r('prep', 31, 1), r('prep', 32, 1),
    r('debate', 1, 2), r('debate', 2, 3)];
  assert.deepEqual(ownedDrills(history, NOW), ['prep']);
  const ls = buildLesson(en, seededRng(5), {}, { history, due: [], owned: ownedDrills(history, NOW) });
  assert.equal(ls[0].drill, 'debate');
  assert.equal(ls[0].reason, 'weak');
});
