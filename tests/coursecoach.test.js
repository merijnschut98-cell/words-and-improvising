import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGradeRequest, parseGrade, buildExplainRequest, parseExplain,
  buildSceneRequest, parseScene, runScene, buildExplainBackRequest, parseExplainBack, runExplainBack,
} from '../src/core/coursecoach.js';

const lesson = {
  id: 'eng.flow.oee',
  title: 'OEE',
  teach: ['SECRET TEACH BLOCK ONE', 'SECRET TEACH BLOCK TWO'],
  situation: { scene: 'The OEE of line 3 dropped.', ask: 'What do you ask?', model: 'Model answer.', rubric: ['Splits OEE into three', 'Asks for loss data', 'No vague cause'] },
  terms: [{ term: 'OEE', def: 'd' }, { term: 'Micro-stop', def: 'd' }],
};
const msg = (obj) => ({ content: [{ type: 'text', text: JSON.stringify(obj) }] });

test('grade request carries the scene, the rubric and his answer, never the teach text', () => {
  const r = buildGradeRequest({ lesson, answer: 'Which of the three dropped?', lang: 'nl', model: 'm' });
  const all = JSON.stringify(r);
  for (const s of ['The OEE of line 3 dropped.', 'Splits OEE into three', 'Asks for loss data', 'No vague cause', 'Which of the three dropped?']) assert.ok(all.includes(s), s);
  assert.ok(!all.includes('SECRET TEACH'), 'no teach text');
  assert.match(r.system, /Dutch/);
  assert.equal(r.model, 'm');
});

test('parseGrade clamps points to 0/1, caps the note, rejects junk', () => {
  const ok = parseGrade(msg({ points: [2, -1, 1], missed: 'x'.repeat(400) }));
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.points, [1, 0, 1]);
  assert.equal(ok.missed.length, 240);
  assert.equal(parseGrade({ content: [{ type: 'text', text: 'not json' }] }).ok, false);
  assert.equal(parseGrade(msg({ points: [1, 1], missed: '' })).ok, false, 'needs three points');
});

test('explain request sends title, terms and his context only', () => {
  const r = buildExplainRequest({ lesson, context: 'At Enexis we plan MS work', lang: 'en', model: 'm' });
  const all = JSON.stringify(r);
  assert.ok(all.includes('At Enexis we plan MS work') && all.includes('Micro-stop') && all.includes('OEE'));
  assert.ok(!all.includes('SECRET TEACH'));
  assert.ok(r.max_tokens <= 600);
  const p = parseExplain(msg({ text: 'y'.repeat(900) }));
  assert.equal(p.ok, true);
  assert.equal(p.text.length, 600);
  assert.equal(parseExplain(msg({ text: '' })).ok, false);
});

test('scene request: title, terms, ask and rubric as a template; his context only when he wrote one; never the teach text', () => {
  const r = buildSceneRequest({ lesson, context: 'At Enexis I plan MV station work', lang: 'nl', model: 'm' });
  const all = JSON.stringify(r);
  for (const s of ['OEE', 'Micro-stop', 'What do you ask?', 'Splits OEE into three', 'Asks for loss data', 'No vague cause', 'At Enexis I plan MV station work']) assert.ok(all.includes(s), s);
  assert.ok(!all.includes('SECRET TEACH'), 'no teach text');
  assert.match(r.system, /new/i);
  assert.match(r.system, /Dutch/);
  assert.ok(r.max_tokens <= 700);
  const none = JSON.stringify(buildSceneRequest({ lesson, context: '   ', lang: 'en', model: 'm' }));
  assert.ok(!/context/i.test(none.replace(/"system":"[^"]*"/, '')), 'no context line when empty');
});

test('parseScene needs four filled fields and exactly three rubric lines, and caps every length', () => {
  const good = { scene: 's'.repeat(900), ask: 'a'.repeat(300), model: 'm'.repeat(900), rubric: ['r'.repeat(300), 'two', 'three'] };
  const p = parseScene(msg(good));
  assert.equal(p.ok, true);
  assert.equal(p.situation.scene.length, 600);
  assert.equal(p.situation.ask.length, 200);
  assert.equal(p.situation.model.length, 700);
  assert.equal(p.situation.rubric[0].length, 160);
  assert.equal(p.situation.rubric.length, 3);
  assert.equal(parseScene(msg({ ...good, rubric: ['one', 'two'] })).ok, false, 'two rubric lines');
  assert.equal(parseScene(msg({ ...good, rubric: ['one', 'two', ' '] })).ok, false, 'an empty rubric line');
  assert.equal(parseScene(msg({ ...good, ask: '' })).ok, false, 'an empty field');
  assert.equal(parseScene({ content: [{ type: 'text', text: 'nope' }] }).ok, false);
});

test('explain-back request: terms, the said line and his explanation, never the teach text; the gap comes back as a question', () => {
  const l = { ...lesson, said: 'What engineers say: it is the bottleneck.' };
  const r = buildExplainBackRequest({ lesson: l, text: 'OEE is availability times performance times quality', lang: 'en', model: 'm' });
  const all = JSON.stringify(r);
  for (const s of ['OEE', 'Micro-stop', 'What engineers say: it is the bottleneck.', 'OEE is availability times performance times quality']) assert.ok(all.includes(s), s);
  assert.ok(!all.includes('SECRET TEACH'));
  assert.match(r.system, /question/i);
  const p = parseExplainBack(msg({ points: [1, 5, 0], question: 'q'.repeat(400) }));
  assert.equal(p.ok, true);
  assert.deepEqual(p.points, [1, 1, 0]);
  assert.equal(p.question.length, 200);
  assert.equal(parseExplainBack(msg({ points: [1, 1], question: 'x' })).ok, false);
  assert.equal(parseExplainBack({ content: [{ type: 'text', text: 'nope' }] }).ok, false);
});

test('scene and explain-back calls never throw', async () => {
  const boom = async () => { throw new Error('offline'); };
  assert.equal((await runScene('k', { lesson, context: 'x', lang: 'en', model: 'm' }, boom)).ok, false);
  assert.equal((await runExplainBack('k', { lesson, text: 'x', lang: 'en', model: 'm' }, boom)).ok, false);
  assert.equal((await runScene('k', { lesson: null, context: 'x', lang: 'en', model: 'm' }, boom)).ok, false);
});
