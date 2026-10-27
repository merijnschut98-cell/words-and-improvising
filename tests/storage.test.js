import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, load, save, addHistory, KEY, parseBackup, importBackup } from '../src/core/storage.js';

function fakeBackend(init = {}) {
  const data = { ...init };
  return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } };
}

test('missing data gives defaults', () => {
  const s = load(fakeBackend());
  assert.deepEqual(s, defaultState());
  assert.deepEqual(s.settings, { lang: 'nl', mode: 'speak', apiKey: '', model: 'claude-opus-5-5', record: false, remind: false, theme: 'default', voiceStats: false });
});

test('corrupt data gives defaults and is backed up', () => {
  const b = fakeBackend({ [KEY]: '{not json' });
  const s = load(b);
  assert.deepEqual(s, defaultState());
  const backup = Object.keys(b.data).find((k) => k.startsWith('spraakwater:corrupt:'));
  assert.ok(backup);
  assert.equal(b.data[backup], '{not json');
});

test('non-object JSON is treated as corrupt', () => {
  assert.deepEqual(load(fakeBackend({ [KEY]: '42' })), defaultState());
});

test('partial state is merged with defaults', () => {
  const b = fakeBackend({ [KEY]: JSON.stringify({ xp: 120, settings: { lang: 'en' } }) });
  const s = load(b);
  assert.equal(s.xp, 120);
  assert.equal(s.settings.lang, 'en');
  assert.equal(s.settings.mode, 'speak');
  assert.deepEqual(s.history, []);
  assert.equal(s.drillLevels.rapid, 1);
});

test('save then load round-trips', () => {
  const b = fakeBackend();
  const s = { ...defaultState(), xp: 55 };
  save(b, s);
  assert.equal(load(b).xp, 55);
});

test('history is capped at 200, newest first', () => {
  let s = defaultState();
  for (let i = 0; i < 205; i++) s = addHistory(s, { ts: i });
  assert.equal(s.history.length, 200);
  assert.equal(s.history[0].ts, 204);
});

test('save survives a throwing backend', () => {
  const b = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
  assert.doesNotThrow(() => save(b, defaultState()));
});

import { needsWelcome } from '../src/core/storage.js';

test('welcome only on a truly fresh start', () => {
  assert.equal(needsWelcome(defaultState()), true);
  assert.equal(needsWelcome({ ...defaultState(), onboarded: true }), false);
  assert.equal(needsWelcome({ ...defaultState(), history: [{ ts: 1 }] }), false);
});

test('v2 keys default for existing users', () => {
  const b = { getItem: () => JSON.stringify({ xp: 10 }), setItem() {} };
  const s = load(b);
  assert.deepEqual(s.quests, { day: null, items: [] });
  assert.equal(s.freezes, 0);
});

test('plan defaults for existing users', () => {
  const s = load({ getItem: () => JSON.stringify({ xp: 1, plan: { cue: 'coffee' } }), setItem() {} });
  assert.deepEqual(s.plan, { cue: 'coffee', hour: null });
  assert.deepEqual(defaultState().plan, { cue: '', hour: null });
});

test('v3 keys default for existing users and bad values are coerced', () => {
  const s = load({ getItem: () => JSON.stringify({ xp: 1 }), setItem() {} });
  assert.deepEqual(s.reviews, {});
  assert.deepEqual(s.events, []);
  const bad = load({ getItem: () => JSON.stringify({ xp: 1, events: 'oops', reviews: [1, 2] }), setItem() {} });
  assert.deepEqual(bad.events, []);
  assert.deepEqual(bad.reviews, {});
});

test('friend keys default for existing users and bad values are coerced', () => {
  assert.deepEqual(defaultState().friendAsks, {});
  assert.deepEqual(defaultState().friendRatings, {});
  const s = load({ getItem: () => JSON.stringify({ xp: 1 }), setItem() {} });
  assert.deepEqual(s.friendAsks, {});
  assert.deepEqual(s.friendRatings, {});
  const bad = load({ getItem: () => JSON.stringify({ xp: 1, friendAsks: 'x', friendRatings: [1] }), setItem() {} });
  assert.deepEqual(bad.friendAsks, {});
  assert.deepEqual(bad.friendRatings, {});
  const kept = load({ getItem: () => JSON.stringify({ xp: 1, friendAsks: { abc123: { promptId: 'topic:t01', drill: 'minute', ts: 1 } } }), setItem() {} });
  assert.equal(kept.friendAsks.abc123.drill, 'minute');
});

test('a fresh install opened from a challenge link still gets the welcome afterwards', () => {
  const s = { ...defaultState(), history: [{ ts: 1 }], ui: { pendingWelcome: true } };
  assert.equal(needsWelcome(s), true);
  assert.equal(needsWelcome({ ...s, onboarded: true }), false);
  assert.equal(needsWelcome({ ...s, ui: {} }), false);
});

test('parseBackup rejects non-JSON', () => {
  assert.deepEqual(parseBackup('{not json'), { ok: false, error: 'json' });
  assert.deepEqual(parseBackup(''), { ok: false, error: 'json' });
});

test('parseBackup rejects the wrong shape', () => {
  assert.deepEqual(parseBackup('42'), { ok: false, error: 'shape' });
  assert.deepEqual(parseBackup('[1,2]'), { ok: false, error: 'shape' });
  assert.deepEqual(parseBackup('null'), { ok: false, error: 'shape' });
  assert.deepEqual(parseBackup(JSON.stringify({ xp: 10 })), { ok: false, error: 'shape' });
  assert.deepEqual(parseBackup(JSON.stringify({ history: [] })), { ok: false, error: 'shape' });
  assert.deepEqual(parseBackup(JSON.stringify({ history: {}, xp: 1 })), { ok: false, error: 'shape' });
  assert.deepEqual(parseBackup(JSON.stringify({ history: [], xp: '5' })), { ok: false, error: 'shape' });
});

test('parseBackup accepts an exported state and summarises it', () => {
  const st = { ...defaultState(), xp: 340, days: { '2026-01-01': 2, '2026-01-02': 0, '2026-01-03': 1 } };
  st.history = ['rapid', 'bridge', 'minute'].map((drill, i) => ({ ts: 1000 + i, drill, metrics: { words: 40, fillerRate: 2 } }));
  const res = parseBackup(JSON.stringify(st));
  assert.equal(res.ok, true);
  assert.deepEqual(res.summary, { rounds: 3, days: 2, xp: 340 });
  assert.deepEqual(res.state, st);
});

test('parseBackup merges an older export with defaults', () => {
  const res = parseBackup(JSON.stringify({ history: [], xp: 5 }));
  assert.equal(res.ok, true);
  assert.equal(res.state.settings.lang, 'nl');
  assert.deepEqual(res.state.events, []);
});

test('importBackup keeps the previous value and writes the new one', () => {
  const old = JSON.stringify({ ...defaultState(), xp: 1 });
  const b = fakeBackend({ [KEY]: old });
  const next = { ...defaultState(), xp: 999, history: [{ ts: 1, drill: 'rapid', metrics: { words: 30, fillerRate: 1 } }] };
  const res = importBackup(b, JSON.stringify(next));
  assert.equal(res.ok, true);
  assert.equal(b.data[`${KEY}:backup`], old);
  assert.equal(load(b).xp, 999);
  assert.equal(load(b).history.length, 1);
});

test('importBackup without previous data writes no backup', () => {
  const b = fakeBackend();
  const res = importBackup(b, JSON.stringify({ history: [], xp: 3 }));
  assert.equal(res.ok, true);
  assert.equal(`${KEY}:backup` in b.data, false);
  assert.equal(load(b).xp, 3);
});

test('importBackup with a bad file writes nothing', () => {
  const old = JSON.stringify({ ...defaultState(), xp: 1 });
  const b = fakeBackend({ [KEY]: old });
  assert.deepEqual(importBackup(b, '{oops'), { ok: false, error: 'json' });
  assert.deepEqual(importBackup(b, JSON.stringify({ hello: 1 })), { ok: false, error: 'shape' });
  assert.deepEqual(Object.keys(b.data), [KEY]);
  assert.equal(b.data[KEY], old);
});

test('import drops history entries without a timestamp or metrics', async () => {
  const { parseBackup } = await import('../src/core/storage.js');
  const good = { ts: 1, drill: 'minute', metrics: { words: 50, fillerRate: 2 } };
  const r = parseBackup(JSON.stringify({ xp: 5, history: [good, { ts: 2 }, { metrics: {} }, null, 'x'] }));
  assert.equal(r.ok, true);
  assert.equal(r.state.history.length, 1);
  assert.equal(r.summary.rounds, 1);
});
