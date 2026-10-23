import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyRound } from '../src/core/round.js';
import { defaultState } from '../src/core/storage.js';

const prompt = { id: 'topic:t01', drill: 'minute', body: 'X', extra: {}, seenIds: ['topic:t01'] };
const round = (over = {}) => ({
  prompt, transcript: 'a b c d e f g h', durationS: 30, targetS: 30, lang: 'en', mode: 'speak',
  metrics: { words: 80, fillerRate: 1, wpm: 160, fillerCount: 0, fillers: {} }, rating: 5, coach: null, ...over,
});

test('counted round updates xp, streak, day, level, seen, history', () => {
  const { state, xp, levelUp } = applyRound(defaultState(), round(), '2026-10-23', 1000);
  assert.equal(xp, 30);
  assert.equal(state.xp, 30);
  assert.equal(levelUp, false);
  assert.deepEqual(state.streak, { count: 1, lastDay: '2026-10-23' });
  assert.equal(state.days['2026-10-23'], 1);
  assert.equal(state.drillLevels.minute, 2);
  assert.equal(state.seen['topic:t01'], 1000);
  assert.equal(state.history.length, 1);
  assert.equal(state.history[0].drill, 'minute');
  assert.equal(state.history[0].xp, 30);
});

test('near-empty round changes nothing', () => {
  const before = defaultState();
  const { state, xp } = applyRound(before, round({ metrics: { words: 2, fillerRate: 0 } }), '2026-10-23', 1);
  assert.equal(xp, 0);
  assert.deepEqual(state, before);
});

test('level up is reported', () => {
  const s = { ...defaultState(), xp: 90 };
  assert.equal(applyRound(s, round(), '2026-10-23', 1).levelUp, true);
});

test('does not mutate input state', () => {
  const s = defaultState();
  applyRound(s, round(), '2026-10-23', 1);
  assert.deepEqual(s, defaultState());
});

test('coach overall is used when there is no self rating', () => {
  const { state } = applyRound(defaultState(), round({ rating: null, coach: { overall: 1 } }), '2026-10-23', 1);
  assert.equal(state.drillLevels.minute, 1);
  const r2 = applyRound(defaultState(), round({ rating: null, coach: { overall: 4 } }), '2026-10-23', 1);
  assert.equal(r2.state.drillLevels.minute, 2);
});
