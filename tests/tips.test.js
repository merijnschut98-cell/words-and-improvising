import { test } from 'node:test';
import assert from 'node:assert/strict';
import tips from '../src/content/tips.js';
import { DRILLS } from '../src/core/progress.js';

test('every drill (and the boss round) has a tip with before/after in both languages', () => {
  for (const d of [...DRILLS, 'boss']) {
    for (const L of ['en', 'nl']) {
      const x = tips.tips[d] && tips.tips[d][L];
      assert.ok(x && x.tip && x.before && x.after, `${d} ${L}`);
    }
  }
});

test('situations map to existing drills, with labels in both languages', () => {
  assert.ok(tips.situations.length >= 8);
  for (const s of tips.situations) {
    assert.ok(s.en && s.nl, s.id);
    assert.ok(s.drills.length >= 2 && s.drills.length <= 3, s.id);
    for (const d of s.drills) assert.ok(DRILLS.includes(d), `${s.id}: ${d}`);
  }
});
