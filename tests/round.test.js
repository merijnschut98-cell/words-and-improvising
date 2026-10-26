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

test('applyRound evaluates quests and reports them', () => {
  const s = { ...defaultState(), quests: { day: '2026-10-23', items: [{ id: 'coldStart', done: false }, { id: 'sayAgain', done: false }, { id: 'lesson', done: false }] } };
  const r = applyRound(s, round({ prepS: 0 }), '2026-10-23', 1000);
  assert.deepEqual(r.completedQuests, ['coldStart']);
  assert.equal(r.state.xp, 30 + 15);
});

test('applyRound records personal bests and reports new ones', () => {
  const r = applyRound(defaultState(), round({ metrics: { words: 80, fillerRate: 1, wpm: 160, fillerCount: 1, fillers: {} } }), '2026-10-23', 1000);
  assert.equal(r.state.bests.words.value, 80);
  assert.ok(r.newBests.some((b) => b.key === 'words'));
  const again = applyRound(r.state, round({ metrics: { words: 40, fillerRate: 5, wpm: 80, fillerCount: 4, fillers: {} } }), '2026-10-23', 2000);
  assert.deepEqual(again.newBests, []);
});

test('applyRound records and returns newly reached milestones', () => {
  const r = applyRound(defaultState(), round(), '2026-10-26', 1000);
  assert.deepEqual(r.newMilestones, ['firstWords']);
  assert.deepEqual(r.state.milestones, ['firstWords']);
  const again = applyRound(r.state, round(), '2026-10-26', 2000);
  assert.deepEqual(again.newMilestones, []);
});
