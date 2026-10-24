import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reminderFor } from '../src/core/reminder.js';

test('no reminder when practised today', () => {
  assert.equal(reminderFor({ lastDay: '2026-10-24', streak: 3 }, '2026-10-24', 'en'), null);
});

test('streak at risk mentions the streak', () => {
  const r = reminderFor({ lastDay: '2026-10-23', streak: 3 }, '2026-10-24', 'en');
  assert.match(r.title, /3-day streak/);
});

test('no streak: generic nudge, in Dutch', () => {
  const r = reminderFor({ lastDay: '2026-10-01', streak: 4 }, '2026-10-24', 'nl');
  assert.ok(r.title.length > 0);
  assert.doesNotMatch(r.title, /4/);
  assert.match(r.body, /minuten/);
});

test('never practised: generic nudge', () => {
  assert.ok(reminderFor({ lastDay: null, streak: 0 }, '2026-10-24', 'en'));
});

import { reminderMeta } from '../src/core/reminder.js';

test('reminderMeta precomputes both messages for the service worker', () => {
  const m = reminderMeta({ settings: { lang: 'en', remind: true }, streak: { count: 5, lastDay: '2026-10-24' } });
  assert.equal(m.remind, true);
  assert.equal(m.lastDay, '2026-10-24');
  assert.match(m.atRisk.title, /5-day streak/);
  assert.equal(m.nudge.title, 'Time to talk 💬');
});
