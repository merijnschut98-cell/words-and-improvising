import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pushbackTurns, buildPushbackRequest, parsePushback, buildPushbackGrade, parsePushbackGrade,
  runPushback, runPushbackGrade, applyPushback,
} from '../src/core/pushback.js';
import { mergeStates } from '../src/core/sync.js';
import { defaultState } from '../src/core/storage.js';

const lesson = {
  id: 'pm.intake.ask',
  title: 'What they ask vs what they need',
  teach: ['SECRET TEACH BLOCK'],
  situation: {
    scene: 'The plant manager wants 75% OEE.', ask: 'What do you ask first?', model: 'Model.', rubric: ['a', 'b', 'c'],
    pushback: {
      lines: ['We have analysed this already.', 'I do not have time for questions.'],
      model: 'I hear you. Show me the analysis and I will start from it on Monday.',
      rubric: ['Acknowledges the point', 'Restates the ask clearly', 'Proposes a concrete next step'],
    },
  },
};
const turns = [
  { who: 'me', text: 'Where do the 42 points go?' },
  { who: 'them', text: 'We know where they go.' },
  { who: 'me', text: 'Great, then show me and we move fast.' },
];
const msg = (obj) => ({ content: [{ type: 'text', text: JSON.stringify(obj) }] });

test('pushbackTurns returns the two content lines, or nothing without pushback', () => {
  assert.deepEqual(pushbackTurns(lesson.situation), lesson.situation.pushback.lines);
  assert.deepEqual(pushbackTurns({ scene: 'x' }), []);
  assert.deepEqual(pushbackTurns({ pushback: { lines: ['only one'] } }), []);
  assert.deepEqual(pushbackTurns(null), []);
});

test('pushback request carries the scene, the ask and his answers; the other person never writes his reply', () => {
  const r = buildPushbackRequest({ lesson, turns, lang: 'nl', model: 'm', context: '' });
  const all = JSON.stringify(r);
  for (const s of ['The plant manager wants 75% OEE.', 'What do you ask first?', 'Where do the 42 points go?', 'Great, then show me and we move fast.', 'We know where they go.']) assert.ok(all.includes(s), s);
  assert.ok(!all.includes('SECRET TEACH'), 'no teach text');
  assert.ok(!/context/i.test(r.messages[0].content), 'no context line when empty');
  assert.match(r.system, /never write his reply/i);
  assert.match(r.system, /never coach/i);
  assert.match(r.system, /Dutch/);
  assert.equal(r.model, 'm');
  const withCtx = buildPushbackRequest({ lesson, turns, lang: 'en', model: 'm', context: 'I work at a grid operator' });
  assert.ok(JSON.stringify(withCtx).includes('I work at a grid operator'));
  assert.match(withCtx.system, /English/);
});

test('parsePushback rejects non-JSON and empty replies, caps the reply at 240 chars', () => {
  assert.equal(parsePushback({ content: [{ type: 'text', text: 'not json' }] }).ok, false);
  assert.equal(parsePushback(msg({ reply: '  ', end: false })).ok, false);
  const p = parsePushback(msg({ reply: 'x'.repeat(500), end: false }));
  assert.equal(p.ok, true);
  assert.equal(p.reply.length, 240);
  assert.equal(p.end, false);
  assert.equal(parsePushback(msg({ reply: 'Fine.', end: true })).end, true);
});

test('pushback grade uses the pushback rubric and his replies, and returns three points', () => {
  const r = buildPushbackGrade({ lesson, turns, lang: 'en', model: 'm' });
  const all = JSON.stringify(r);
  for (const s of ['Acknowledges the point', 'Restates the ask clearly', 'Proposes a concrete next step', 'Great, then show me and we move fast.']) assert.ok(all.includes(s), s);
  assert.ok(!all.includes('SECRET TEACH'));
  const g = parsePushbackGrade(msg({ points: [1, 0, 3], missed: 'y'.repeat(400) }));
  assert.deepEqual(g.points, [1, 0, 1]);
  assert.equal(g.missed.length, 240);
  assert.equal(parsePushbackGrade(msg({ points: [1], missed: '' })).ok, false);
});

test('runPushback and runPushbackGrade never throw', async () => {
  const boom = async () => { throw new Error('offline'); };
  assert.equal((await runPushback('k', { lesson, turns, lang: 'en', model: 'm' }, boom)).ok, false);
  assert.equal((await runPushbackGrade('k', { lesson, turns, lang: 'en', model: 'm' }, boom)).ok, false);
  assert.equal((await runPushback('', { lesson, turns, lang: 'en', model: 'm' })).ok, false);
  const bad = async () => ({ default: class { constructor() { this.beta = { messages: { create: async () => { throw new TypeError('x'); } } }; } } });
  assert.equal((await runPushback('k', { lesson: null, turns: null, lang: 'en', model: 'm' }, bad)).ok, false);
});

test('applyPushback saves points and time, gives no XP and logs no session', () => {
  const s0 = defaultState();
  const s1 = applyPushback(s0, { subject: 'pm', lessonId: 'pm.intake.ask', pts: 2 }, 1000);
  assert.deepEqual(s1.courses.pm.lessons['pm.intake.ask'].pushback, { pts: 2, ts: 1000 });
  assert.equal(s1.xp, s0.xp);
  assert.equal(s1.courses.pm.sessions.length, 0);
  assert.deepEqual(s1.days, s0.days);
  const s2 = applyPushback(s1, { subject: 'pm', lessonId: 'pm.intake.ask', pts: 3 }, 2000);
  assert.deepEqual(s2.courses.pm.lessons['pm.intake.ask'].pushback, { pts: 3, ts: 2000 });
});

test('sync: pushback merges like a situation, the later ts wins, in either order', () => {
  const at = (pb) => ({ ...defaultState(), courses: { eng: { lessons: {}, sessions: [] }, pm: { lessons: { 'pm.intake.ask': { passed: 5, pushback: pb } }, sessions: [] } } });
  const a = at({ pts: 1, ts: 10 });
  const b = at({ pts: 3, ts: 20 });
  assert.deepEqual(mergeStates(a, b).courses.pm.lessons['pm.intake.ask'].pushback, { pts: 3, ts: 20 });
  assert.deepEqual(mergeStates(b, a).courses.pm.lessons['pm.intake.ask'].pushback, { pts: 3, ts: 20 });
  const none = at(undefined);
  delete none.courses.pm.lessons['pm.intake.ask'].pushback;
  assert.deepEqual(mergeStates(none, a).courses.pm.lessons['pm.intake.ask'].pushback, { pts: 1, ts: 10 });
});
