import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeStates, syncable } from '../src/core/sync.js';
import { defaultState } from '../src/core/storage.js';

const h = (ts, drill = 'minute') => ({ ts, drill, promptId: `topic:t${ts}`, metrics: { words: 50, fillerRate: 2 } });
const base = () => defaultState();

test('syncable never carries settings (API key) or device ui', () => {
  const s = { ...base(), settings: { ...base().settings, apiKey: 'sk-secret' }, ui: { subject: 'eng' } };
  const out = syncable(s);
  assert.equal('settings' in out, false);
  assert.equal('ui' in out, false);
  assert.ok(!JSON.stringify(out).includes('sk-secret'));
});

test('merge keeps settings and ui from the local device', () => {
  const local = { ...base(), settings: { ...base().settings, apiKey: 'k', lang: 'en' }, ui: { subject: 'pm' } };
  const remote = { ...syncable(base()), xp: 50 };
  const m = mergeStates(local, remote);
  assert.equal(m.settings.apiKey, 'k');
  assert.equal(m.settings.lang, 'en');
  assert.equal(m.ui.subject, 'pm');
});

test('history is a union by timestamp, newest first, without duplicates', () => {
  const local = { ...base(), history: [h(5), h(3), h(1)] };
  const remote = { ...base(), history: [h(4), h(3), h(2)] };
  assert.deepEqual(mergeStates(local, remote).history.map((e) => e.ts), [5, 4, 3, 2, 1]);
});

test('course lessons merge per lesson: earliest passed, latest situation and say-it; sessions union', () => {
  const local = { ...base(), courses: { eng: { lessons: { 'eng.flow.takt': { read: 10, passed: 10, situation: { pts: 1, ts: 11 } } }, sessions: [{ ts: 10, day: 'a', kind: 'lesson' }] }, pm: { lessons: {}, sessions: [] } } };
  const remote = { ...base(), courses: { eng: { lessons: { 'eng.flow.takt': { read: 5, passed: 6, sayIt: 20 }, 'eng.flow.oee': { read: 7, passed: 8 } }, sessions: [{ ts: 6, day: 'b', kind: 'lesson' }] }, pm: { lessons: { 'pm.intake.ask': { read: 1 } }, sessions: [] } } };
  const m = mergeStates(local, remote);
  assert.deepEqual(m.courses.eng.lessons['eng.flow.takt'], { read: 5, passed: 6, situation: { pts: 1, ts: 11 }, sayIt: 20 });
  assert.ok(m.courses.eng.lessons['eng.flow.oee'].passed);
  assert.ok(m.courses.pm.lessons['pm.intake.ask']);
  assert.deepEqual(m.courses.eng.sessions.map((x) => x.ts), [10, 6]);
});

test('reviews keep the entry with the later due date, per key', () => {
  const local = { ...base(), courseReviews: { 'nl|a#r0': { box: 3, due: '2026-11-10' }, 'nl|b#r0': { box: 1, due: '2026-11-03' } }, reviews: { 'nl|topic:t1': { box: 1, due: '2026-11-03' } } };
  const remote = { ...base(), courseReviews: { 'nl|a#r0': { box: 2, due: '2026-11-05' }, 'nl|c#r0': { box: 2, due: '2026-11-06' } }, reviews: { 'nl|topic:t1': { box: 2, due: '2026-11-06' } } };
  const m = mergeStates(local, remote);
  assert.equal(m.courseReviews['nl|a#r0'].box, 3);
  assert.ok(m.courseReviews['nl|b#r0'] && m.courseReviews['nl|c#r0']);
  assert.equal(m.reviews['nl|topic:t1'].box, 2);
});

test('days take the per-day maximum; xp the maximum; streak the longer run with the later day', () => {
  const local = { ...base(), days: { '2026-11-01': 2, '2026-11-02': 1 }, xp: 300, streak: { count: 4, lastDay: '2026-11-02' } };
  const remote = { ...base(), days: { '2026-11-02': 3, '2026-10-30': 1 }, xp: 280, streak: { count: 2, lastDay: '2026-11-01' } };
  const m = mergeStates(local, remote);
  assert.deepEqual(m.days, { '2026-10-30': 1, '2026-11-01': 2, '2026-11-02': 3 });
  assert.equal(m.xp, 300);
  assert.deepEqual(m.streak, { count: 4, lastDay: '2026-11-02' });
});

test('events merge by id and a reflected event wins; bests keep the better value', () => {
  const ev = (id, reflection = null) => ({ id, type: 'client', date: '2026-11-01', text: 'x', reflection });
  const local = { ...base(), events: [ev('a'), ev('b', { rating: 4 })], bests: { words: { value: 120, ts: 1 }, fillerRate: { value: 2.1, ts: 1 }, byDrill: {} } };
  const remote = { ...base(), events: [ev('a', { rating: 3 }), ev('c')], bests: { words: { value: 90, ts: 2 }, fillerRate: { value: 1.4, ts: 2 }, byDrill: {} } };
  const m = mergeStates(local, remote);
  assert.deepEqual(m.events.map((e) => e.id).sort(), ['a', 'b', 'c']);
  assert.equal(m.events.find((e) => e.id === 'a').reflection.rating, 3);
  assert.equal(m.bests.words.value, 120);
  assert.equal(m.bests.fillerRate.value, 1.4, 'fewer fillers is better');
});

test('merge is idempotent and the unions do not depend on order', () => {
  const a = { ...base(), history: [h(3), h(1)], xp: 40, days: { d1: 1 } };
  const b = { ...base(), history: [h(2)], xp: 60, days: { d2: 2 } };
  const ab = mergeStates(a, b);
  assert.deepEqual(mergeStates(ab, syncable(ab)).history, ab.history);
  assert.deepEqual(mergeStates(b, syncable(a)).history.map((e) => e.ts), ab.history.map((e) => e.ts));
  assert.deepEqual(mergeStates(b, syncable(a)).days, ab.days);
});

test('a missing or broken remote changes nothing', () => {
  const local = { ...base(), xp: 10, history: [h(1)] };
  assert.deepEqual(mergeStates(local, null), local);
  assert.deepEqual(mergeStates(local, 'garbage'), local);
});

test('a broken remote never poisons local numbers or history', () => {
  const local = { ...base(), xp: 120, freezes: 1, days: { d1: 2 }, streak: { count: 3, lastDay: '2026-11-02' }, history: [h(5)] };
  const remote = { xp: 'lots', freezes: null, days: { d1: 'x', d2: 3 }, streak: { count: 'NaN', lastDay: '2026-11-03' }, history: [{ drill: 'x' }, { ts: 9 }, h(6)] };
  const m = mergeStates(local, remote);
  assert.equal(m.xp, 120);
  assert.equal(m.freezes, 1);
  assert.deepEqual(m.days, { d1: 2, d2: 3 });
  assert.ok(Number.isFinite(m.streak.count));
  assert.deepEqual(m.history.map((e) => e.ts), [6, 5], 'entries without ts or metrics are dropped');
});

test('a reset device starts with sync off, so a wipe is never pushed to the cloud', () => {
  assert.ok(!base().settings.syncOn);
});

test('the reminder plan (cue and hour) is device-specific: it never leaves the device', () => {
  const s = { ...base(), plan: { cue: 'after coffee', hour: 8 } };
  const out = syncable(s);
  assert.equal('plan' in out, false);
  assert.ok(!JSON.stringify(out).includes('after coffee'));
  const remote = { ...syncable(base()), plan: { cue: 'other phone', hour: 21 } };
  assert.deepEqual(mergeStates(s, remote).plan, { cue: 'after coffee', hour: 8 });
  const bare = { ...base() };
  delete bare.plan;
  assert.equal('plan' in mergeStates(bare, remote), false, 'a remote plan is never adopted');
});

test('prepped events merge as a union, in either order', () => {
  const withPrep = (list) => ({ ...base(), courses: { ...base().courses, eng: { lessons: {}, sessions: [], plans: [], prepped: list } } });
  const m = mergeStates(withPrep(['a', 'b']), withPrep(['b', 'c']));
  assert.deepEqual([...m.courses.eng.prepped].sort(), ['a', 'b', 'c']);
  assert.deepEqual([...mergeStates(withPrep(['b', 'c']), withPrep(['a', 'b'])).courses.eng.prepped].sort(), ['a', 'b', 'c']);
  assert.deepEqual(mergeStates(m, m).courses.eng.prepped, m.courses.eng.prepped);
});

test('a v9 box-6 entry and a v8 box-4 entry: the later due wins, in either order', () => {
  const k = 'nl|eng.flow.takt#r0';
  const v9 = { ...base(), courseReviews: { [k]: { box: 6, due: '2027-06-05', lesson: 'eng.flow.takt', subject: 'eng', lastSure: true } } };
  const v8 = { ...base(), courseReviews: { [k]: { box: 4, due: '2026-12-03', lesson: 'eng.flow.takt', subject: 'eng' } } };
  assert.equal(mergeStates(v9, v8).courseReviews[k].box, 6);
  assert.equal(mergeStates(v8, v9).courseReviews[k].box, 6);
  const lapsedLocal = { ...base(), courseReviews: { [k]: { box: 1, due: '2027-07-01', lesson: 'eng.flow.takt', subject: 'eng' } } };
  assert.equal(mergeStates(v9, lapsedLocal).courseReviews[k].box, 1, 'a later miss on another device still wins');
});

test('his work context stays on this device: syncable strips it, and a merge keeps the local one', () => {
  const local = { ...base(), settings: { ...base().settings, context: 'I plan MV work at Enexis' } };
  const out = syncable(local);
  assert.equal(out.settings, undefined);
  assert.ok(!JSON.stringify(out).includes('Enexis'));
  const remote = { ...syncable(base()), settings: { context: 'remote context' } };
  assert.equal(mergeStates(local, remote).settings.context, 'I plan MV work at Enexis');
});

test('prepped merge: same result in either order, newest 50 kept', () => {
  const ids = (from, n) => Array.from({ length: n }, (_, i) => `e${(from + i).toString(36).padStart(8, '0')}`);
  const withPrep = (list) => ({ ...base(), courses: { ...base().courses, eng: { lessons: {}, sessions: [], plans: [], prepped: list } } });
  const a = withPrep(ids(1000, 40));
  const b = withPrep(ids(1030, 40));
  const ab = mergeStates(a, b).courses.eng.prepped;
  const ba = mergeStates(b, a).courses.eng.prepped;
  assert.deepEqual(ab, ba);
  assert.equal(ab.length, 50);
  assert.ok(ab.includes(ids(1069, 1)[0]), 'the newest is kept');
  assert.ok(!ab.includes(ids(1000, 1)[0]), 'the oldest is dropped');
});

test('a remote review box outside 1–6 is clamped on merge, not only at the next load', () => {
  const k = 'nl|eng.flow.takt#r0';
  const remote = { ...syncable(base()), courseReviews: { [k]: { box: 9, due: '2099-01-01', lesson: 'eng.flow.takt', subject: 'eng' }, 'nl|x#r0': { box: 'x', due: '2099-01-01' } } };
  const m = mergeStates(base(), remote);
  assert.equal(m.courseReviews[k].box, 6);
  assert.equal(m.courseReviews['nl|x#r0'].box, 1);
});
