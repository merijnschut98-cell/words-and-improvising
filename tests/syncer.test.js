import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSyncer } from '../src/core/syncer.js';
import { defaultState } from '../src/core/storage.js';

function rig({ remote = null, pullOk = true, pushOk = true } = {}) {
  let state = { ...defaultState(), xp: 10, history: [{ ts: 1, drill: 'minute', metrics: { words: 9, fillerRate: 1 } }] };
  const pushed = [];
  const timers = [];
  const cloud = {
    pull: async () => (pullOk ? { ok: true, state: remote } : { ok: false, error: 'network' }),
    push: async (s) => { if (!pushOk) return { ok: false, error: 'network' }; pushed.push(s); return { ok: true }; },
  };
  const syncer = createSyncer({
    cloud,
    getState: () => state,
    setState: (s) => { state = s; },
    now: () => 1000,
    schedule: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
    cancel: (id) => { if (timers[id - 1]) timers[id - 1].fn = null; },
  });
  return { syncer, get state() { return state; }, pushed, timers };
}

test('syncNow pulls, merges into local without losing anything, then pushes the merged state', async () => {
  const remote = { ...defaultState(), xp: 50, history: [{ ts: 2, drill: 'prep', metrics: { words: 9, fillerRate: 1 } }] };
  const r = rig({ remote });
  const res = await r.syncer.syncNow();
  assert.equal(res.ok, true);
  assert.equal(r.state.xp, 50);
  assert.deepEqual(r.state.history.map((e) => e.ts), [2, 1]);
  assert.equal(r.pushed.length, 1);
  assert.deepEqual(r.pushed[0].history.map((e) => e.ts), [2, 1]);
  assert.equal(r.syncer.status().lastSync, 1000);
});

test('first sync with an empty cloud just uploads the local progress', async () => {
  const r = rig({ remote: null });
  await r.syncer.syncNow();
  assert.equal(r.pushed.length, 1);
  assert.equal(r.state.xp, 10);
});

test('a failed pull changes nothing locally and reports the error', async () => {
  const r = rig({ pullOk: false });
  const before = r.state;
  const res = await r.syncer.syncNow();
  assert.equal(res.ok, false);
  assert.equal(r.state, before);
  assert.equal(r.pushed.length, 0);
  assert.equal(r.syncer.status().error, 'network');
});

test('changes are pushed once, 3 s after the last change (debounced)', async () => {
  const r = rig();
  r.syncer.changed();
  r.syncer.changed();
  const live = r.timers.filter((x) => x.fn);
  assert.equal(live.length, 1);
  assert.equal(live[0].ms, 3000);
  await live[0].fn();
  assert.equal(r.pushed.length, 1);
});

test('two syncs at once never run in parallel', async () => {
  const r = rig({ remote: { ...defaultState(), xp: 5 } });
  await Promise.all([r.syncer.syncNow(), r.syncer.syncNow()]);
  assert.equal(r.pushed.length, 1);
});

test('a change pulls and merges before it pushes, so a stale device never rolls the cloud back', async () => {
  const remote = { ...defaultState(), xp: 900, history: [{ ts: 7, drill: 'prep', metrics: { words: 9, fillerRate: 1 } }] };
  const r = rig({ remote });
  r.syncer.changed();
  await r.timers.filter((x) => x.fn)[0].fn();
  assert.equal(r.pushed.length, 1);
  assert.ok(r.pushed[0].history.some((e) => e.ts === 7), 'the other device’s round is kept');
  assert.equal(r.pushed[0].xp, 900);
});

test('a lost session is reported once through onAuthLost', async () => {
  let lost = 0;
  const syncer = createSyncer({ cloud: { pull: async () => ({ ok: false, error: 'auth' }), push: async () => ({ ok: false, error: 'auth' }) }, getState: () => defaultState(), setState: () => {}, onAuthLost: () => { lost += 1; } });
  await syncer.syncNow();
  assert.equal(lost, 1);
});
