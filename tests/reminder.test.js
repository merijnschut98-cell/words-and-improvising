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

import { shouldFireReminder } from '../src/core/reminder.js';

test('reminderMeta carries the planned hour and mentions the cue', () => {
  const m = reminderMeta({ settings: { lang: 'en', remind: true }, streak: { count: 2, lastDay: '2026-10-24' }, plan: { cue: 'coffee', hour: 8 } });
  assert.equal(m.hour, 8);
  assert.match(m.nudge.body, /coffee/i);
  const none = reminderMeta({ settings: { lang: 'en', remind: true }, streak: { count: 0, lastDay: null } });
  assert.equal(none.hour, null);
});

test('shouldFireReminder: only within 3 hours of the planned hour, wrapping midnight', () => {
  const at = (h) => new Date(2026, 9, 27, h, 15);
  assert.equal(shouldFireReminder({ hour: null }, at(3)), true);
  assert.equal(shouldFireReminder({ hour: 8 }, at(10)), true);
  assert.equal(shouldFireReminder({ hour: 8 }, at(12)), false);
  assert.equal(shouldFireReminder({ hour: 23 }, at(1)), true);
  assert.equal(shouldFireReminder({ hour: 1 }, at(20)), false);
});
