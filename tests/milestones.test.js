import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MILESTONES, THEMES, newMilestones, unlockedThemes } from '../src/core/milestones.js';
import { defaultState } from '../src/core/storage.js';

const entry = (drill = 'minute', extra = {}) => ({ ts: 1, drill, durationS: 60, cleanRun: 10, metrics: { words: 80, fillerCount: 2, fillerRate: 2 }, ...extra });
const withRounds = (n, extra = {}) => ({ ...defaultState(), history: [...Array(n)].map(() => entry()), ...extra });

test('at least 10 milestones, from First words to Table-topics ready', () => {
  assert.ok(MILESTONES.length >= 10);
  assert.equal(MILESTONES[0].id, 'firstWords');
  assert.equal(MILESTONES.at(-1).id, 'tableTopics');
  assert.equal(new Set(MILESTONES.map((m) => m.id)).size, MILESTONES.length);
});

test('a fresh state has reached nothing', () => {
  assert.deepEqual(newMilestones(defaultState()), []);
});

test('one round reaches First words', () => {
  assert.deepEqual(newMilestones(withRounds(1)), ['firstWords']);
});

test('new milestones come back in journey order', () => {
  const days = Object.fromEntries([...Array(7)].map((_, i) => [`2026-10-0${i + 1}`, 1]));
  const ids = newMilestones(withRounds(3, { days }));
  const order = MILESTONES.map((m) => m.id);
  assert.deepEqual(ids, [...ids].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
  assert.ok(ids.includes('firstWords') && ids.includes('weekOne'));
});

test('idempotent: already reached milestones are not returned again', () => {
  const s = withRounds(1);
  assert.deepEqual(newMilestones({ ...s, milestones: newMilestones(s) }), []);
});

test('Table-topics ready needs 50 rounds and 3 drills at level 3', () => {
  const s = withRounds(50);
  assert.ok(!newMilestones(s).includes('tableTopics'));
  const lv = { ...s.drillLevels, minute: 3, explain: 3, prep: 3 };
  assert.ok(newMilestones({ ...s, drillLevels: lv }).includes('tableTopics'));
});

test('a clean minute: 55+ s, 60+ words, zero fillers', () => {
  const s = { ...defaultState(), history: [entry('minute', { durationS: 58, metrics: { words: 70, fillerCount: 0, fillerRate: 0 } })] };
  assert.ok(newMilestones(s).includes('cleanMinute'));
});

test('unlocks map to known themes; unlockedThemes follows reached milestones', () => {
  const unlocking = MILESTONES.filter((m) => m.unlocks);
  assert.ok(unlocking.length >= 3);
  for (const m of unlocking) assert.ok(THEMES.includes(m.unlocks));
  assert.deepEqual(unlockedThemes([]), ['default']);
  assert.deepEqual(unlockedThemes(unlocking.map((m) => m.id)), ['default', ...unlocking.map((m) => m.unlocks)]);
});
