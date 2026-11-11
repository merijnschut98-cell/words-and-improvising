import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creditXp, XP_DAYS_KEEP } from '../src/core/flair.js';
import { defaultState } from '../src/core/storage.js';

const TODAY = '2026-11-02';

test('creditXp adds to the total and to today\'s xpDays', () => {
  const s = creditXp({ ...defaultState(), xp: 40, xpDays: { [TODAY]: 5 } }, 20, TODAY);
  assert.equal(s.xp, 60);
  assert.equal(s.xpDays[TODAY], 25);
  const fresh = creditXp({ xp: 0 }, 10, TODAY);
  assert.deepEqual(fresh.xpDays, { [TODAY]: 10 });
});

test('creditXp with 0 XP changes nothing', () => {
  const before = { ...defaultState(), xp: 7 };
  assert.equal(creditXp(before, 0, TODAY), before);
});

test('creditXp keeps only the last 60 days', () => {
  assert.equal(XP_DAYS_KEEP, 60);
  const xpDays = { '2026-09-03': 5, '2026-09-04': 6, '2026-11-01': 3 };
  const s = creditXp({ xp: 0, xpDays }, 10, TODAY);
  assert.deepEqual(Object.keys(s.xpDays).sort(), ['2026-09-04', '2026-11-01', TODAY]);
});
