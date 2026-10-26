import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questsForDay, applyQuests, currentQuests, QUEST_POOL } from '../src/core/quests.js';
import { defaultState } from '../src/core/storage.js';

const TODAY = '2026-10-27';
const ts = (day, h = 12) => new Date(`${day}T${String(h).padStart(2, '0')}:00:00`).getTime();

function stateWith(ids, extra = {}) {
  return { ...defaultState(), quests: { day: TODAY, items: ids.map((id) => ({ id, done: false })) }, ...extra };
}
const round = (o = {}) => ({
  prompt: { drill: 'minute', extra: {}, ...(o.prompt || {}) },
  metrics: { words: 60, fillerRate: 2, fillerCount: 2, ...(o.metrics || {}) },
  durationS: 60, targetS: 60, rating: 3, mode: 'speak', lang: 'nl', prepS: 10, retry: false, transcript: 'x',
  ...o,
});

test('questsForDay: 3 distinct, deterministic per day, varies across days', () => {
  const a = questsForDay(TODAY, true);
  assert.equal(a.length, 3);
  assert.equal(new Set(a.map((q) => q.id)).size, 3);
  assert.deepEqual(questsForDay(TODAY, true), a);
  const sets = new Set(['2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24']
    .map((d) => questsForDay(d, true).map((q) => q.id).join()));
  assert.ok(sets.size > 1);
  assert.ok(a.every((q) => q.done === false));
});

test('questsForDay never offers liveConvo without a key', () => {
  for (let d = 1; d <= 28; d++) {
    const day = `2026-11-${String(d).padStart(2, '0')}`;
    assert.ok(!questsForDay(day, false).some((q) => q.id === 'liveConvo'), day);
  }
  assert.ok(QUEST_POOL.find((q) => q.id === 'liveConvo').needsKey);
});

test('applyQuests rolls over to today', () => {
  const s = { ...defaultState(), quests: { day: '2026-10-20', items: [{ id: 'sayAgain', done: true }] } };
  const r = applyQuests(s, round(), TODAY);
  assert.equal(r.state.quests.day, TODAY);
  assert.equal(r.state.quests.items.length, 3);
});

test('awards 15 XP once per quest, never twice', () => {
  const s = stateWith(['coldStart', 'sayAgain', 'otherLang']);
  const r1 = applyQuests(s, round({ prepS: 0 }), TODAY);
  assert.deepEqual(r1.completed, ['coldStart']);
  assert.equal(r1.state.xp, 15);
  const r2 = applyQuests(r1.state, round({ prepS: 0 }), TODAY);
  assert.deepEqual(r2.completed, []);
  assert.equal(r2.state.xp, 15);
});

test('two quests in one round both count, third completion grants a freeze, capped at 2', () => {
  const s = stateWith(['coldStart', 'sayAgain', 'pauseClean'], { freezes: 1 });
  const r = applyQuests(s, round({ prepS: 0, retry: true, prompt: { drill: 'pause', extra: {} }, metrics: { words: 40, fillerRate: 0, fillerCount: 0 } }), TODAY);
  assert.deepEqual(r.completed.sort(), ['coldStart', 'pauseClean', 'sayAgain']);
  assert.equal(r.state.xp, 45);
  assert.equal(r.state.freezes, 2);
  const capped = applyQuests({ ...s, freezes: 2 }, round({ prepS: 0, retry: true, prompt: { drill: 'pause', extra: {} }, metrics: { words: 40, fillerRate: 0, fillerCount: 0 } }), TODAY);
  assert.equal(capped.state.freezes, 2);
});

test('beatYesterday compares against yesterday’s best fillerRate', () => {
  const history = [
    { ts: ts('2026-10-26'), metrics: { words: 50, fillerRate: 3 } },
    { ts: ts('2026-10-26', 18), metrics: { words: 50, fillerRate: 2.5 } },
    { ts: ts('2026-10-25'), metrics: { words: 50, fillerRate: 0.5 } },
  ];
  const s = stateWith(['beatYesterday', 'sayAgain', 'coldStart'], { history });
  assert.deepEqual(applyQuests(s, round({ metrics: { words: 50, fillerRate: 2.6 } }), TODAY).completed, []);
  assert.deepEqual(applyQuests(s, round({ metrics: { words: 50, fillerRate: 2.4 } }), TODAY).completed, ['beatYesterday']);
  const noYesterday = stateWith(['beatYesterday', 'sayAgain', 'coldStart']);
  assert.deepEqual(applyQuests(noYesterday, round({ metrics: { words: 50, fillerRate: 0 } }), TODAY).completed, []);
});

test('lesson quest completes when 3 rounds are done today', () => {
  const s = stateWith(['lesson', 'sayAgain', 'coldStart'], { days: { [TODAY]: 2 } });
  assert.deepEqual(applyQuests(s, round(), TODAY).completed, []);
  const s3 = { ...s, days: { [TODAY]: 3 } };
  assert.deepEqual(applyQuests(s3, round(), TODAY).completed, ['lesson']);
});

test('bridgeAll needs all three words, otherLang needs the less-used language', () => {
  const s = stateWith(['bridgeAll', 'otherLang', 'coldStart'], { history: Array.from({ length: 5 }, (_, i) => ({ ts: i, lang: 'nl', metrics: { words: 9 } })) });
  const bridge = round({ prompt: { drill: 'bridge', extra: { words: ['anker', 'fiets', 'storm'] } }, transcript: 'een anker en een fiets in de storm' });
  assert.deepEqual(applyQuests(s, bridge, TODAY).completed, ['bridgeAll']);
  assert.deepEqual(applyQuests(s, { ...bridge, transcript: 'een anker en een fiets' }, TODAY).completed, []);
  assert.deepEqual(applyQuests(s, round({ lang: 'en' }), TODAY).completed, ['otherLang']);
});

test('rounds under 5 words never complete quests', () => {
  const s = stateWith(['coldStart', 'sayAgain', 'otherLang']);
  assert.deepEqual(applyQuests(s, round({ prepS: 0, metrics: { words: 3 } }), TODAY).completed, []);
});

test('currentQuests shows today’s set without writing state', () => {
  const s = { ...defaultState(), quests: { day: '2026-10-01', items: [] } };
  assert.equal(currentQuests(s, TODAY).length, 3);
  assert.equal(s.quests.day, '2026-10-01');
});

test('prep time under one second counts as a cold start (0 s)', async () => {
  const { prepSecondsUsed } = await import('../src/core/quests.js');
  assert.equal(prepSecondsUsed(0.7), 0);
  assert.equal(prepSecondsUsed(0.99), 0);
  assert.equal(prepSecondsUsed(1.4), 1);
  assert.equal(prepSecondsUsed(undefined), 0);
});
