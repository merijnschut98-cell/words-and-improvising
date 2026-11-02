import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGradeRequest, parseGrade, buildExplainRequest, parseExplain } from '../src/core/coursecoach.js';

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
