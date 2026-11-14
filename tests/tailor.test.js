import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTailorRequest, parseTailor, fallbackPick, TAILOR_DRILLS } from '../src/core/tailor.js';
import { seededRng } from '../src/core/lesson.js';
import en from '../src/content/prompts.en.js';

const review = {
  thisWeek: { rounds: 6, minutes: 5, fillerRate: 5.2, wpm: 130 },
  topFiller: { word: 'eh', count: 14 },
  worst: { drill: 'prep', avg: 2.5 },
  focus: { kind: 'filler', value: 'eh' },
};
const msg = (obj) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(obj) }] });
const base = { focus: 'Structure first', body: 'Should Fridays be meeting-free?', audience: '', words: [], setting: '' };

test('request carries the weak spots and improvement notes', () => {
  const r = buildTailorRequest({ review, improvements: ['Start with your point.', 'Fewer "eh".'], lang: 'nl', model: 'claude-opus-5-5' });
  const u = r.messages[0].content;
  assert.match(u, /"eh" ×14/);
  assert.match(u, /prep/);
  assert.match(u, /Start with your point\./);
  assert.match(r.system, /Dutch/);
  assert.deepEqual(r.output_config.format.schema.properties.drill.enum, TAILOR_DRILLS);
});

test('parse a valid prep exercise', () => {
  const r = parseTailor(msg({ ...base, drill: 'prep' }), 123);
  assert.equal(r.ok, true);
  assert.deepEqual(r.prompt, { id: 'ai:123', drill: 'prep', body: base.body, extra: {}, seenIds: [], focus: 'Structure first' });
});

test('parse drill-specific fields', () => {
  assert.deepEqual(parseTailor(msg({ ...base, drill: 'explain', audience: 'a CFO' }), 1).prompt.extra, { audience: 'a CFO' });
  assert.deepEqual(parseTailor(msg({ ...base, drill: 'bridge', words: ['a', 'b', 'c'] }), 1).prompt.extra, { words: ['a', 'b', 'c'] });
  assert.deepEqual(parseTailor(msg({ ...base, drill: 'smalltalk', setting: 'Lift' }), 1).prompt.extra, { setting: 'Lift' });
});

test('parse rejects invalid shapes', () => {
  assert.equal(parseTailor(msg({ ...base, drill: 'rapid' }), 1).ok, false);
  assert.equal(parseTailor(msg({ ...base, drill: 'bridge', words: ['a', 'b'] }), 1).ok, false);
  assert.equal(parseTailor(msg({ ...base, drill: 'explain' }), 1).ok, false);
  assert.equal(parseTailor(msg({ ...base, drill: 'prep', body: '' }), 1).ok, false);
});

test('fallback follows the weekly focus', () => {
  assert.equal(fallbackPick(review, en, seededRng(1), {}).drill, 'pause');
  assert.equal(fallbackPick({ ...review, focus: { kind: 'drill', value: 'bridge' } }, en, seededRng(1), {}).drill, 'bridge');
  assert.equal(fallbackPick({ ...review, focus: { kind: 'stretch', value: null } }, en, seededRng(1), {}).drill, 'prep');
  const d = fallbackPick({ ...review, worst: null, focus: { kind: 'rounds', value: 5 } }, en, seededRng(1), {}).drill;
  assert.ok(TAILOR_DRILLS.includes(d));
});
