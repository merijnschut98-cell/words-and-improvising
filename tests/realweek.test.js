import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EVENT_TYPES, addEvent, upcoming, needsReflection, reflect, rehearsalPrompts, HARD_QUESTIONS } from '../src/core/realweek.js';

const ev = (over = {}) => ({ type: 'client', date: '2026-10-29', text: 'Kick-off meeting with Philips', ...over });

test('addEvent validates type, date and text, trims and caps text, sorts by date', () => {
  let es = addEvent([], ev(), 'e1');
  assert.equal(es.length, 1);
  assert.deepEqual(addEvent(es, ev({ type: 'party' }), 'e2'), es);
  assert.deepEqual(addEvent(es, ev({ text: '   ' }), 'e2'), es);
  assert.deepEqual(addEvent(es, ev({ date: '29-10-2026' }), 'e2'), es);
  es = addEvent(es, ev({ date: '2026-10-28', text: `  ${'x'.repeat(200)}  ` }), 'e2');
  assert.equal(es[0].id, 'e2');
  assert.equal(es[0].text.length, 120);
  assert.equal(es[0].reflection, null);
});

test('upcoming and needsReflection split on today', () => {
  const es = [{ ...ev(), id: 'a', date: '2026-10-26', reflection: null }, { ...ev(), id: 'b', date: '2026-10-27', reflection: null },
    { ...ev(), id: 'c', date: '2026-10-25', reflection: { rating: 4, next: 'x' } }];
  assert.deepEqual(upcoming(es, '2026-10-27').map((e) => e.id), ['b']);
  assert.deepEqual(needsReflection(es, '2026-10-27').map((e) => e.id), ['a']);
});

test('reflect stores rating 1–5 and a capped note', () => {
  const es = reflect([{ ...ev(), id: 'a', reflection: null }], 'a', { rating: 9, next: `  ${'y'.repeat(300)}` });
  assert.equal(es[0].reflection.rating, 5);
  assert.equal(es[0].reflection.next.length, 160);
});

test('every type has hard questions in both languages', () => {
  for (const lang of ['en', 'nl']) for (const type of EVENT_TYPES) assert.ok(HARD_QUESTIONS[lang][type].length >= 2, `${lang} ${type}`);
});

test('rehearsal: 60 s version, hard question, 15 s opening line', () => {
  const ps = rehearsalPrompts({ ...ev(), id: 'e1' }, 'nl');
  assert.deepEqual(ps.map((p) => p.drill), ['minute', 'prep', 'minute']);
  assert.deepEqual(ps.map((p) => p.timing.answerS), [60, 45, 15]);
  assert.equal(new Set(ps.map((p) => p.id)).size, 3);
  assert.ok(ps[0].body.includes('Kick-off meeting with Philips'));
  assert.ok(HARD_QUESTIONS.nl.client.includes(ps[1].body));
  for (const p of ps) assert.ok(p.focus && p.seenIds.length === 0);
});
