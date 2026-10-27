import { test } from 'node:test';
import assert from 'node:assert/strict';
import { todayPick } from '../src/core/today.js';
import { defaultState } from '../src/core/storage.js';
import { makePrompt, seededRng } from '../src/core/lesson.js';
import nl from '../src/content/prompts.nl.js';
import { isoWeekKey } from '../src/core/boss.js';

const TODAY = '2026-10-28';
const NOW = new Date(2026, 9, 28, 9).getTime();
const r = (drill, daysAgo, rating) => ({ ts: NOW - daysAgo * 86400000, drill, rating, lang: 'nl', promptId: 'x:y', metrics: { words: 50, fillerRate: 2 } });

test('a brand-new player gets a sensible first round, the same all day', () => {
  const a = todayPick(defaultState(), TODAY, nl, 'nl', NOW);
  const b = todayPick(defaultState(), TODAY, nl, 'nl', NOW + 3600000);
  assert.equal(a.reason, 'fresh');
  assert.equal(a.prompt.id, b.prompt.id);
});

test('priority: an event within 2 days beats a due review, which beats the weekly focus, which beats the weakest drill', () => {
  const due = makePrompt('prep', nl, seededRng(3));
  const base = { ...defaultState(), history: [r('debate', 1, 1), r('debate', 2, 1)] };
  assert.equal(todayPick(base, TODAY, nl, 'nl', NOW).reason, 'weak');
  const focus = { ...base, weekly: { week: isoWeekKey(new Date(NOW)), focus: 'followUp' } };
  const f = todayPick(focus, TODAY, nl, 'nl', NOW);
  assert.deepEqual([f.reason, f.prompt.drill], ['focus', 'followUp']);
  const review = { ...focus, reviews: { [`nl|${due.id}`]: { box: 1, due: TODAY, drill: 'prep', lang: 'nl' } } };
  const rv = todayPick(review, TODAY, nl, 'nl', NOW);
  assert.deepEqual([rv.reason, rv.prompt.id], ['review', due.id]);
  const event = { ...review, events: [{ id: 'e1', type: 'client', date: '2026-10-30', text: 'Kick-off', reflection: null }] };
  const ev = todayPick(event, TODAY, nl, 'nl', NOW);
  assert.equal(ev.reason, 'event');
  assert.equal(ev.event.id, 'e1');
  const far = { ...review, events: [{ id: 'e2', type: 'client', date: '2026-11-05', text: 'Later', reflection: null }] };
  assert.equal(todayPick(far, TODAY, nl, 'nl', NOW).reason, 'review');
});

test('without a weak drill it picks the drill played least recently', () => {
  const s = { ...defaultState(), history: [r('minute', 1, 4)] };
  const p = todayPick(s, TODAY, nl, 'nl', NOW);
  assert.equal(p.reason, 'fresh');
  assert.notEqual(p.prompt.drill, 'minute');
});
