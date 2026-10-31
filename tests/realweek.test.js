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

test('hard-question request includes the event line only when he shared it', async () => {
  const { buildHardQuestionRequest } = await import('../src/core/realweek.js');
  const e = { id: 'e1', type: 'client', date: '2026-10-29', text: 'Kick-off with SECRET-CLIENT', reflection: null };
  const off = JSON.stringify(buildHardQuestionRequest({ event: e, lang: 'nl', model: 'claude-haiku-5-5' }));
  assert.ok(!off.includes('SECRET-CLIENT'));
  assert.match(off, /client meeting/);
  const on = JSON.stringify(buildHardQuestionRequest({ event: { ...e, shareWithCoach: true }, lang: 'nl', model: 'claude-haiku-5-5' }));
  assert.ok(on.includes('SECRET-CLIENT'));
  assert.match(on, /Dutch/);
});

test('parseHardQuestion accepts one question and rejects junk', async () => {
  const { parseHardQuestion } = await import('../src/core/realweek.js');
  const msg = (obj) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(obj) }] });
  assert.deepEqual(parseHardQuestion(msg({ question: '  Waarom nu?  ' })), { ok: true, question: 'Waarom nu?' });
  assert.equal(parseHardQuestion(msg({ question: '' })).ok, false);
  assert.equal(parseHardQuestion({ stop_reason: 'refusal', content: [] }).ok, false);
  assert.ok(parseHardQuestion(msg({ question: 'x'.repeat(500) })).question.length <= 240);
});

test('setShare toggles one event only', async () => {
  const { setShare } = await import('../src/core/realweek.js');
  const es = setShare([{ id: 'a' }, { id: 'b' }], 'b', true);
  assert.deepEqual(es.map((e) => !!e.shareWithCoach), [false, true]);
});

test('reflect stores only known skills, deduped; none gives an empty list', async () => {
  const { SKILLS } = await import('../src/core/realweek.js');
  assert.deepEqual(SKILLS, ['frame', 'followUp', 'pressure', 'pause', 'other']);
  const base = [{ ...ev(), id: 'a', reflection: null }];
  const es = reflect(base, 'a', { rating: 4, next: '', skills: ['pause', 'frame', 'pause', 'juggling', 42, null] });
  assert.deepEqual(es[0].reflection.skills, ['pause', 'frame']);
  assert.deepEqual(reflect(base, 'a', { rating: 4, next: '' })[0].reflection.skills, []);
  assert.deepEqual(reflect(base, 'a', { rating: 4, next: '', skills: 'frame' })[0].reflection.skills, []);
});

test('skillUse: rounds of the matching drill vs reflections that used it, last 7 days', async () => {
  const { skillUse } = await import('../src/core/realweek.js');
  const DAY = 86400000;
  const now = new Date(2026, 9, 27, 12).getTime();
  const r = (daysAgo, drill) => ({ ts: now - daysAgo * DAY, drill });
  const history = [r(1, 'frame'), r(2, 'frame'), r(6, 'frame'), r(8, 'frame'), r(1, 'pause'), r(3, 'minute'), r(-1, 'frame')];
  const refl = (id, date, skills) => ({ ...ev(), id, date, reflection: { rating: 4, next: '', skills } });
  const events = [
    refl('a', '2026-10-26', ['frame', 'followUp']),
    refl('b', '2026-10-23', ['frame']),
    refl('c', '2026-10-15', ['frame', 'pressure']), // too long ago
    refl('d', '2026-10-29', ['pause']), // in the future
    { ...ev(), id: 'e', date: '2026-10-25', reflection: { rating: 3, next: '' } }, // older reflection without skills
    { ...ev(), id: 'f', date: '2026-10-25', reflection: null },
  ];
  assert.deepEqual(skillUse(events, history, now), [
    { skill: 'frame', practised: 3, used: 2 },
    { skill: 'followUp', practised: 0, used: 1 },
    { skill: 'pause', practised: 1, used: 0 },
  ]);
  assert.deepEqual(skillUse([], [], now), []);
  assert.deepEqual(skillUse(undefined, undefined, now), []);
});
