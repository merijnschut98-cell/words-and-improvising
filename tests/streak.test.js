import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reconcileStreak, daysPractised } from '../src/core/progress.js';
import { defaultState } from '../src/core/storage.js';
import { applyRound } from '../src/core/round.js';

const withStreak = (lastDay, count, freezes, extra = {}) => ({ ...defaultState(), streak: { count, lastDay }, freezes, ...extra });

test('one missed day with a freeze: consume exactly one, keep the streak alive', () => {
  const r = reconcileStreak(withStreak('2026-10-25', 5, 1), '2026-10-27');
  assert.equal(r.usedFreeze, true);
  assert.equal(r.broke, false);
  assert.equal(r.state.freezes, 0);
  assert.deepEqual(r.state.freezeLog, ['2026-10-26']);
  assert.deepEqual(r.state.streak, { count: 5, lastDay: '2026-10-26' });
  const again = reconcileStreak(r.state, '2026-10-27');
  assert.equal(again.usedFreeze, false);
  assert.equal(again.state.freezes, 0);
});

test('no freeze used when practised today or yesterday, or never', () => {
  for (const last of ['2026-10-27', '2026-10-26', null]) {
    const r = reconcileStreak(withStreak(last, last ? 3 : 0, 2), '2026-10-27');
    assert.equal(r.usedFreeze, false, String(last));
    assert.equal(r.state.freezes, 2);
    assert.equal(r.broke, false);
  }
});

test('missed day without freezes: broke, nothing consumed', () => {
  const r = reconcileStreak(withStreak('2026-10-25', 5, 0), '2026-10-27');
  assert.equal(r.broke, true);
  assert.equal(r.usedFreeze, false);
  assert.equal(r.state.freezes, 0);
});

test('two missed days with one freeze: broke, freeze kept', () => {
  const r = reconcileStreak(withStreak('2026-10-24', 5, 1), '2026-10-27');
  assert.equal(r.broke, true);
  assert.equal(r.state.freezes, 1);
});

test('two missed days with two freezes: both used, across a month boundary', () => {
  const r = reconcileStreak(withStreak('2026-10-30', 4, 2), '2026-11-02');
  assert.equal(r.usedFreeze, true);
  assert.equal(r.state.freezes, 0);
  assert.deepEqual(r.state.freezeLog, ['2026-10-31', '2026-11-01']);
  assert.equal(r.state.streak.lastDay, '2026-11-01');
});

test('daysPractised counts each practised day once', () => {
  const s0 = defaultState();
  assert.equal(daysPractised(s0), 0);
  const round = {
    prompt: { id: 'topic:t01', drill: 'minute', body: 'X', extra: {}, seenIds: [] },
    transcript: 'a b c d e f', durationS: 30, targetS: 30, lang: 'nl', mode: 'speak',
    metrics: { words: 50, fillerRate: 1, wpm: 100, fillerCount: 0, fillers: {} }, rating: 3,
  };
  const a = applyRound(s0, round, '2026-10-27', 1).state;
  const b = applyRound(a, round, '2026-10-27', 2).state;
  const c = applyRound(b, round, '2026-10-28', 3).state;
  assert.equal(daysPractised(b), 1);
  assert.equal(daysPractised(c), 2);
});
