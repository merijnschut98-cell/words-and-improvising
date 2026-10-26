import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, load, save, addHistory, KEY } from '../src/core/storage.js';

function fakeBackend(init = {}) {
  const data = { ...init };
  return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); } };
}

test('missing data gives defaults', () => {
  const s = load(fakeBackend());
  assert.deepEqual(s, defaultState());
  assert.deepEqual(s.settings, { lang: 'nl', mode: 'speak', apiKey: '', model: 'claude-opus-5-5', record: false, remind: false });
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
