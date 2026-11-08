import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  KEEP, recordingMeta, retain, groupByDrill, beforeAfter, compareRecordings, listenGap, CHECKS,
  fixOptions, createRecordings, memoryAdapter, markTranscript,
} from '../src/core/recordings.js';
import { listenCalibration } from '../src/core/calibration.js';
import { FIX_MODIFIER, queueModifier, takeQueuedModifier, modifierCheck, MODIFIERS, pickModifier } from '../src/core/modifiers.js';
import { seededRng } from '../src/core/lesson.js';

const rec = (ts, extra = {}) => ({ id: ts, ts, drill: 'minute', promptId: 'p1', body: 'Prompt', lang: 'nl', durationS: 30, score: 3, coachScore: null, transcript: 'eh dit is een test van de brug', ...extra });

test('meta: exercise, prompt, date, duration, score and transcript; never the audio', () => {
  const m = recordingMeta({
    ts: 1000, prompt: { id: 'p1', drill: 'minute', body: 'Je fiets' }, lang: 'nl', durationS: 31.6, rating: 4, coach: { overall: 3 }, transcript: ' eh hallo ', audio: { size: 9 },
  });
  assert.deepEqual(m, { id: 1000, ts: 1000, drill: 'minute', promptId: 'p1', body: 'Je fiets', lang: 'nl', durationS: 32, score: 4, coachScore: 3, transcript: 'eh hallo', listen: null });
  assert.equal(recordingMeta({ ts: 1, prompt: { drill: 'minute', body: 'x' }, lang: 'en', durationS: 5, transcript: '' }).score, null);
  assert.equal(recordingMeta({ ts: 1, prompt: { drill: 'minute', body: 'x' }, lang: 'en', durationS: 5, transcript: '' }).promptId, null);
});

test('retention keeps the newest 20 and names the rest to delete', () => {
  assert.equal(KEEP, 20);
  const list = Array.from({ length: 23 }, (_, i) => rec(i + 1)).reverse().sort(() => 0); // any order
  const shuffled = [...list.slice(5), ...list.slice(0, 5)];
  const { keep, drop } = retain(shuffled);
  assert.equal(keep.length, 20);
  assert.deepEqual(keep.map((r) => r.ts).slice(0, 3), [23, 22, 21]);
  assert.deepEqual(drop.sort((a, b) => a - b), [1, 2, 3]);
  assert.deepEqual(retain([rec(1)]).drop, []);
});

test('grouping by exercise: newest group first, newest item first in a group', () => {
  const g = groupByDrill([rec(1), rec(5, { drill: 'story' }), rec(3), rec(2, { drill: 'story' })]);
  assert.deepEqual(g.map((x) => x.drill), ['story', 'minute']);
  assert.deepEqual(g[0].items.map((r) => r.ts), [5, 2]);
  assert.deepEqual(g[1].items.map((r) => r.ts), [3, 1]);
  assert.deepEqual(groupByDrill([]), []);
});

test('before/after: the same prompt, oldest earlier attempt against this one', () => {
  const list = [rec(1), rec(2, { promptId: 'other' }), rec(3), rec(4, { lang: 'en' }), rec(5)];
  assert.deepEqual(beforeAfter(list, list[4]).map((r) => r.ts), [1, 5]);
  // From the oldest one: against the newest.
  assert.deepEqual(beforeAfter(list, list[0]).map((r) => r.ts), [1, 5]);
  assert.equal(beforeAfter(list, list[1]), null);
  assert.equal(beforeAfter(list, list[3]), null);
  // No prompt id (live or coach-written): never paired.
  const loose = [rec(1, { promptId: null }), rec(2, { promptId: null })];
  assert.equal(beforeAfter(loose, loose[1]), null);
});

test('before/after rows: fillers lower is better, pace neutral', () => {
  const old = rec(1, { transcript: 'eh eh dus eh ik denk dat de brug eh mooi is', durationS: 10 });
  const now = rec(2, { transcript: 'de brug verbindt twee oevers en dat is mooi', durationS: 10 });
  const rows = compareRecordings(old, now);
  const fill = rows.find((r) => r.key === 'fillerRate');
  assert.ok(fill.before > fill.now);
  assert.equal(fill.better, true);
  assert.equal(rows.find((r) => r.key === 'wpm').better, null);
});

test('transcripts mark filler words', () => {
  const segs = markTranscript('eh de brug, um, is mooi', 'nl');
  assert.ok(segs.some((s) => s.filler && /eh/i.test(s.text)));
  assert.ok(segs.some((s) => !s.filler && /brug/.test(s.text)));
});

test('listen gap: rating before minus rating after listening', () => {
  assert.deepEqual(listenGap(4, 3), { before: 4, after: 3, gap: 1, verdict: 'generous' });
  assert.deepEqual(listenGap(2, 4), { before: 2, after: 4, gap: -2, verdict: 'harsh' });
  assert.equal(listenGap(3, 3).verdict, 'fair');
  assert.equal(listenGap(null, 3), null);
  assert.equal(listenGap(3, null), null);
});

test('the gap feeds calibration: mean of before minus after over the last 10', () => {
  const h = (rating, after) => ({ rating, listen: after == null ? undefined : { before: rating, after } });
  assert.equal(listenCalibration([h(3, null)]), null);
  assert.deepEqual(listenCalibration([h(4, 3), h(5, 3), h(3, null)]), { n: 2, meanGap: 1.5, verdict: 'generous' });
  assert.equal(listenCalibration([h(2, 3)]).verdict, 'harsh');
  assert.equal(listenCalibration([h(3, 3)]).verdict, 'fair');
  // The before value stored with the listen wins over a later-edited rating.
  assert.equal(listenCalibration([{ rating: 1, listen: { before: 4, after: 4 } }]).meanGap, 0);
});

test('checklist: five points; the unticked ones are the improvement options', () => {
  assert.deepEqual(CHECKS, ['opening', 'fillers', 'pace', 'ending', 'voice']);
  assert.deepEqual(fixOptions({ opening: true, pace: true }), ['fillers', 'ending', 'voice']);
  assert.deepEqual(fixOptions(Object.fromEntries(CHECKS.map((c) => [c, true]))), []);
});

test('each improvement point maps to a modifier the round already understands', () => {
  for (const c of CHECKS) assert.ok(FIX_MODIFIER[c], c);
  assert.equal(FIX_MODIFIER.pace, 'slow');
  // Listen-back modifiers are never drawn at random.
  const rng = seededRng(3);
  for (let i = 0; i < 300; i++) assert.ok(MODIFIERS.includes(pickModifier(rng, 5, true)));
  assert.deepEqual(modifierCheck('noFillers', { fillerRate: 1 }, '', 'nl'), { checked: true, ok: true });
  assert.deepEqual(modifierCheck('noFillers', { fillerRate: 4 }, '', 'nl'), { checked: true, ok: false });
  assert.deepEqual(modifierCheck('clearEnd', {}, '', 'nl'), { checked: false, ok: true });
});

test('a queued modifier is taken once by the next round', () => {
  const s0 = { ui: { subject: 'speak' } };
  const s1 = queueModifier(s0, 'noFillers');
  assert.deepEqual(s1.ui, { subject: 'speak', nextModifier: { id: 'noFillers', from: 'listen' } });
  const { modifier, from, state } = takeQueuedModifier(s1);
  assert.equal(modifier, 'noFillers');
  assert.equal(from, 'listen');
  assert.equal(state.ui.nextModifier, undefined);
  assert.equal(takeQueuedModifier(state).modifier, null);
  assert.equal(takeQueuedModifier({}).modifier, null);
  // An unknown id is ignored.
  assert.equal(takeQueuedModifier({ ui: { nextModifier: { id: 'zzz' } } }).modifier, null);
});

test('store: save keeps the newest 20, with audio; delete one; delete all', async () => {
  const db = memoryAdapter();
  const store = createRecordings(db);
  for (let i = 1; i <= 22; i++) await store.save(rec(i), { size: i });
  const list = await store.list();
  assert.equal(list.length, 20);
  assert.equal(list[0].ts, 22);
  assert.equal(await store.audio(1), null);
  assert.deepEqual(await store.audio(22), { size: 22 });
  assert.equal(db.audioCount(), 20);
  await store.remove(22);
  assert.equal((await store.list()).length, 19);
  assert.equal(await store.audio(22), null);
  await store.update(21, { listen: { before: 3, after: 2 } });
  assert.deepEqual((await store.get(21)).listen, { before: 3, after: 2 });
  await store.clear();
  assert.deepEqual(await store.list(), []);
  assert.equal(db.audioCount(), 0);
});

test('store: a list right after an unawaited save sees it', async () => {
  const store = createRecordings(memoryAdapter());
  store.save(rec(1), { size: 1 });
  store.save(rec(2), { size: 2 });
  assert.equal((await store.list()).length, 2);
});

test('store: a recording without audio is not saved; a failing adapter never throws', async () => {
  const store = createRecordings(memoryAdapter());
  assert.equal(await store.save(rec(1), null), false);
  assert.deepEqual(await store.list(), []);
  const broken = createRecordings({
    allMeta: () => Promise.reject(new Error('x')), putMeta: () => Promise.reject(new Error('x')), getMeta: () => Promise.reject(new Error('x')),
    putAudio: () => Promise.reject(new Error('x')), getAudio: () => Promise.reject(new Error('x')), del: () => Promise.reject(new Error('x')), clear: () => Promise.reject(new Error('x')),
  });
  assert.equal(await broken.save(rec(1), { size: 1 }), false);
  assert.deepEqual(await broken.list(), []);
  assert.equal(await broken.audio(1), null);
  assert.equal(await broken.remove(1), false);
  assert.equal(await broken.clear(), false);
  // No adapter at all (no IndexedDB): everything is empty.
  const none = createRecordings(null);
  assert.deepEqual(await none.list(), []);
  assert.equal(none.available, false);
});
