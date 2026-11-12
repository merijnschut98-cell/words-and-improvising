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
  assert.deepEqual(s.settings, { lang: 'nl', mode: 'speak', apiKey: '', model: 'claude-opus-5-5', record: false, remind: false, theme: 'auto', voiceStats: false, context: '', guide: true, cheer: false });
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

test('programme defaults to null and a malformed value is dropped', () => {
  assert.equal(load(fakeBackend()).programme, null);
  const bad = load(fakeBackend({ [KEY]: JSON.stringify({ ...defaultState(), programme: 'x' }) }));
  assert.equal(bad.programme, null);
  const half = load(fakeBackend({ [KEY]: JSON.stringify({ ...defaultState(), programme: { start: '2026-10-29' } }) }));
  assert.equal(half.programme, null);
  const ok = { start: '2026-10-29', baseline: { drill: 'minute', promptId: 'topic:t01', lang: 'nl' } };
  assert.deepEqual(load(fakeBackend({ [KEY]: JSON.stringify({ ...defaultState(), programme: ok }) })).programme, ok);
});

test('importBackup reports a failed save instead of success', () => {
  const b = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
  const next = { ...defaultState(), xp: 5 };
  const res = importBackup(b, JSON.stringify(next));
  assert.deepEqual({ ok: res.ok, error: res.error }, { ok: false, error: 'save' });
});

test('finishing the welcome clears the pending flag', async () => {
  const { finishWelcome, needsWelcome } = await import('../src/core/storage.js');
  const s = finishWelcome({ ...defaultState(), ui: { pendingWelcome: true, theme: 'x' } });
  assert.equal(s.onboarded, true);
  assert.equal('pendingWelcome' in s.ui, false);
  assert.equal(s.ui.theme, 'x');
  assert.equal(needsWelcome(s), false);
});

test('courses and courseReviews default and coerce', () => {
  const d = load(fakeBackend());
  assert.deepEqual(d.courses, { eng: { lessons: {}, sessions: [], plans: [], prepped: [], medals: {}, checks: {} }, pm: { lessons: {}, sessions: [], plans: [], prepped: [], medals: {}, checks: {} } });
  assert.deepEqual(d.courseReviews, {});
  const bad = load(fakeBackend({ [KEY]: JSON.stringify({ ...defaultState(), courses: { eng: { lessons: 'x', sessions: {} } }, courseReviews: [], ui: { subject: 'cooking' } }) }));
  assert.deepEqual(bad.courses, { eng: { lessons: {}, sessions: [], plans: [], prepped: [], medals: {}, checks: {} }, pm: { lessons: {}, sessions: [], plans: [], prepped: [], medals: {}, checks: {} } });
  assert.deepEqual(bad.courseReviews, {});
  assert.equal('subject' in bad.ui, false);
  const good = { eng: { lessons: { 'eng.flow.takt': { read: 1, passed: 2 } }, sessions: [{ day: '2026-11-02', kind: 'lesson', correct: 3, total: 3, ts: 2 }], plans: [], prepped: [] }, pm: { lessons: {}, sessions: [], plans: [], prepped: [] } };
  const ok = load(fakeBackend({ [KEY]: JSON.stringify({ ...defaultState(), courses: good, courseReviews: { 'nl|eng.flow.takt#r0': { box: 2, due: '2026-11-05', lesson: 'eng.flow.takt', subject: 'eng' } }, ui: { subject: 'eng' } }) }));
  assert.deepEqual(ok.courses, { eng: { ...good.eng, medals: {}, checks: {} }, pm: { ...good.pm, medals: {}, checks: {} } });
  assert.equal(ok.courseReviews['nl|eng.flow.takt#r0'].box, 2);
  assert.equal(ok.ui.subject, 'eng');
});

test('theme is auto, light or dark; retired themes and junk load as auto', () => {
  const withTheme = (theme) => load(fakeBackend({ [KEY]: JSON.stringify({ ...defaultState(), settings: { theme } }) }));
  for (const old of ['default', 'ocean', 'forest', 'night', 'purple', 3, null]) assert.equal(withTheme(old).settings.theme, 'auto', String(old));
  for (const ok of ['auto', 'light', 'dark']) assert.equal(withTheme(ok).settings.theme, ok);
  assert.equal(load(fakeBackend({ [KEY]: JSON.stringify({ settings: { lang: 'en' } }) })).settings.theme, 'auto');
});

test('v9: event topics and prepped are coerced', () => {
  const ev = { id: 'e1', type: 'client', date: '2026-11-04', text: 'x', reflection: null };
  const s = load(fakeBackend({ [KEY]: JSON.stringify({ events: [{ ...ev, topics: 'eng.flow' }, { ...ev, id: 'e2', topics: ['eng.flow', 3] }, { ...ev, id: 'e3' }], courses: { eng: { prepped: 'x' }, pm: { prepped: ['ev9', 4] } } }) }));
  assert.deepEqual(s.events[0].topics, []);
  assert.deepEqual(s.events[1].topics, ['eng.flow']);
  assert.equal('topics' in s.events[2], false, 'an old event stays as it was');
  assert.deepEqual(s.courses.eng.prepped, []);
  assert.deepEqual(s.courses.pm.prepped, ['ev9']);
});

test('v9: course review boxes load as an integer 1–6; a v8 queue (boxes 1–4) loads unchanged', () => {
  const v8 = { 'nl|eng.flow.takt#r0': { box: 1, due: '2026-11-03', lesson: 'eng.flow.takt', subject: 'eng' }, 'nl|eng.flow.takt#r1': { box: 4, due: '2026-12-03', lesson: 'eng.flow.takt', subject: 'eng' } };
  const ok = load(fakeBackend({ [KEY]: JSON.stringify({ ...defaultState(), courseReviews: v8 }) }));
  assert.deepEqual(ok.courseReviews, v8);
  const bad = load(fakeBackend({ [KEY]: JSON.stringify({ courseReviews: { a: { box: 9, due: 'd' }, b: { box: 0, due: 'd' }, c: { box: 2.6, due: 'd' }, d: { box: 'x', due: 'd' } } }) }));
  assert.deepEqual(Object.fromEntries(Object.entries(bad.courseReviews).map(([k, v]) => [k, v.box])), { a: 6, b: 1, c: 3, d: 1 });
});

test('settings.context defaults to empty, is a string and is cut at 400 characters', () => {
  assert.equal(defaultState().settings.context, '');
  const at = (context) => load(fakeBackend({ [KEY]: JSON.stringify({ settings: { context } }) })).settings.context;
  for (const bad of [undefined, 42, null, ['x']]) assert.equal(at(bad), '', String(bad));
  assert.equal(at('I plan MV work at a grid operator'), 'I plan MV work at a grid operator');
  assert.equal(at('x'.repeat(900)).length, 400);
  assert.equal(load(fakeBackend({ [KEY]: JSON.stringify({ xp: 3 }) })).settings.context, '', 'an older blob gets the default');
});

// v16 flair fields.
test('defaultState has xpDays, dailyGoal 30, titles, and per-subject medals and checks', () => {
  const d = defaultState();
  assert.deepEqual(d.xpDays, {});
  assert.deepEqual(d.dailyGoal, { xp: 30, ts: 0 });
  assert.deepEqual(d.titles, {});
  assert.deepEqual(d.speakMedals, {});
  for (const k of ['eng', 'pm']) {
    assert.deepEqual(d.courses[k].medals, {});
    assert.deepEqual(d.courses[k].checks, {});
  }
});

test('load drops non-number xpDays, a goal outside 20/30/50, unknown medal tiers and ranks outside 1–4', () => {
  const raw = {
    xp: 10,
    xpDays: { '2026-11-01': 20, '2026-11-02': 'x', bad: 5, '2026-11-03': NaN },
    dailyGoal: { xp: 40, ts: 5 },
    titles: { eng: { rank: 2, ts: 1 }, pm: { rank: 7, ts: 1 }, speak: { rank: 'x' }, cooking: { rank: 1, ts: 1 } },
    speakMedals: { basics: { tier: 'silver', ts: 1 }, pressure: { tier: 'platinum', ts: 1 }, nope: { tier: 'gold', ts: 1 } },
    courses: { eng: { lessons: {}, sessions: [], medals: { 'eng.flow': { tier: 'gold', ts: 3 }, 'eng.x': { tier: 'tin', ts: 1 }, 'eng.y': 'gold' }, checks: { 'eng.flow': { last: '2026-11-01', best: 9, total: 10, perfect: null }, 'eng.z': 'x', 'eng.q': { last: 'nope', best: 1, total: 1, perfect: null } } } },
  };
  const s = load(fakeBackend({ [KEY]: JSON.stringify(raw) }));
  assert.deepEqual(s.xpDays, { '2026-11-01': 20 });
  assert.deepEqual(s.dailyGoal, { xp: 30, ts: 0 });
  assert.deepEqual(s.titles, { eng: { rank: 2, ts: 1 } });
  assert.deepEqual(s.speakMedals, { basics: { tier: 'silver', ts: 1 } });
  assert.deepEqual(s.courses.eng.medals, { 'eng.flow': { tier: 'gold', ts: 3 } });
  assert.deepEqual(s.courses.eng.checks, { 'eng.flow': { last: '2026-11-01', best: 9, total: 10, perfect: null } });
  const goal = load(fakeBackend({ [KEY]: JSON.stringify({ dailyGoal: { xp: 50, ts: 9 } }) }));
  assert.deepEqual(goal.dailyGoal, { xp: 50, ts: 9 });
});

test('a v15 state loads with empty flair fields and keeps every lesson', () => {
  const v15 = { ...defaultState(), xp: 300, courses: { eng: { lessons: { 'eng.flow.takt': { read: 1, passed: 2, opened: 3 } }, sessions: [], plans: [], prepped: [] }, pm: { lessons: {}, sessions: [], plans: [], prepped: [] } } };
  for (const k of ['xpDays', 'dailyGoal', 'titles', 'speakMedals']) delete v15[k];
  const s = load(fakeBackend({ [KEY]: JSON.stringify(v15) }));
  assert.deepEqual(s.courses.eng.lessons, v15.courses.eng.lessons);
  assert.deepEqual(s.xpDays, {});
  assert.deepEqual(s.dailyGoal, { xp: 30, ts: 0 });
  assert.deepEqual(s.titles, {});
  assert.equal(s.xp, 300);
});

test('settings.guide defaults to true and stays a boolean; celebration sound defaults to off', () => {
  assert.equal(defaultState().settings.guide, true);
  assert.equal(defaultState().settings.cheer, false);
  const at = (settings) => load(fakeBackend({ [KEY]: JSON.stringify({ settings }) })).settings;
  assert.equal(at({ guide: false }).guide, false);
  assert.equal(at({ guide: 'no' }).guide, true);
  assert.equal(at({}).guide, true);
  assert.equal(at({ cheer: true }).cheer, true);
  assert.equal(at({ cheer: 1 }).cheer, false);
});
