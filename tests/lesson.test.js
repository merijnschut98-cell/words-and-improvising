import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makePrompt, buildLesson, seededRng } from '../src/core/lesson.js';
import { DRILLS, drillTiming } from '../src/core/progress.js';
import en from '../src/content/prompts.en.js';
import nl from '../src/content/prompts.nl.js';


test('lesson has 3 distinct drills', () => {
  for (let s = 1; s < 20; s++) {
    const lesson = buildLesson(en, seededRng(s), {});
    assert.equal(lesson.length, 3);
    assert.equal(new Set(lesson.map((p) => p.drill)).size, 3);
  }
});

test('every drill produces a prompt with body and seenIds', () => {
  for (const d of DRILLS) {
    const p = makePrompt(d, nl, seededRng(3), {});
    assert.equal(p.drill, d);
    assert.ok(p.body.length > 0, d);
    assert.ok(p.seenIds.length > 0, d);
  }
});

test('bridge has 3 distinct words', () => {
  const p = makePrompt('bridge', en, seededRng(7), {});
  assert.equal(new Set(p.extra.words).size, 3);
});

test('rapid has 5 distinct questions', () => {
  const p = makePrompt('rapid', en, seededRng(7), {});
  assert.equal(p.extra.questions.length, 5);
  assert.equal(new Set(p.extra.questions).size, 5);
});

test('prefers unseen prompts', () => {
  const seen = Object.fromEntries(en.opinions.map((o, i) => [`opinion:${o.id}`, 1000 + i]));
  delete seen['opinion:o17'];
  for (let s = 1; s < 10; s++) {
    assert.equal(makePrompt('prep', en, seededRng(s), seen).body, en.opinions.find((o) => o.id === 'o17').text);
  }
});

test('when all seen, picks the oldest', () => {
  const seen = Object.fromEntries(en.opinions.map((o, i) => [`opinion:${o.id}`, 1000 + i]));
  seen['opinion:o09'] = 1;
  assert.equal(makePrompt('prep', en, seededRng(2), seen).body, en.opinions.find((o) => o.id === 'o09').text);
});

test('language files are parallel and large enough', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(nl).sort());
  for (const key of ['topics', 'concepts', 'opinions', 'scenarios', 'rapid']) {
    assert.ok(en[key].length >= 40, `en.${key}`);
    assert.deepEqual(en[key].map((x) => x.id), nl[key].map((x) => x.id), key);
  }
  assert.ok(en.audiences.length >= 10 && nl.audiences.length === en.audiences.length);
  assert.ok(en.words.length >= 80 && nl.words.length >= 80);
});

test('story prompt has an opening and 8 distinct twists', () => {
  const p = makePrompt('story', nl, seededRng(5), {});
  assert.ok(p.body.length > 10);
  assert.equal(p.extra.twists.length, 8);
  assert.equal(new Set(p.extra.twists).size, 8);
  assert.ok(nl.storyStarts.length >= 25 && en.storyStarts.length >= 25);
  assert.ok(nl.twists.length >= 30 && en.twists.length >= 30);
  assert.deepEqual(en.storyStarts.map((x) => x.id), nl.storyStarts.map((x) => x.id));
});

test('debate prompt comes from the opinions pool', () => {
  const p = makePrompt('debate', en, seededRng(4), {});
  assert.ok(en.opinions.some((o) => o.text === p.body));
  assert.match(p.seenIds[0], /^opinion:/);
});

test('TTS drill pools are parallel and large enough', () => {
  const sizes = { yesAnd: 30, listen: 30, experts: 30, expertQuestions: 20 };
  for (const [pool, min] of Object.entries(sizes)) {
    for (const c of [en, nl]) assert.ok(c[pool] && c[pool].length >= min, `${pool} >= ${min}`);
    assert.deepEqual(en[pool].map((x) => x.id), nl[pool].map((x) => x.id), `${pool} ids parallel`);
  }
  for (const c of [en, nl]) for (const l of c.listen) assert.ok(l.statement && l.question, l.id);
});

test('yesAnd prompt carries 3 distinct lines to speak', () => {
  const p = makePrompt('yesAnd', en, seededRng(4));
  assert.equal(p.extra.cues.length, 3);
  assert.equal(new Set(p.extra.cues).size, 3);
  assert.equal(p.seenIds.length, 3);
});

test('listen prompt speaks the statement then the question', () => {
  const p = makePrompt('listen', nl, seededRng(5));
  const item = nl.listen.find((l) => `listen:${l.id}` === p.id);
  assert.equal(p.extra.statement, item.statement);
  assert.equal(p.extra.question, item.question);
  assert.deepEqual(p.extra.cues, [`${item.statement} ${item.question}`]);
});

test('expert prompt has a topic and 5 distinct questions', () => {
  const p = makePrompt('expert', en, seededRng(6));
  assert.ok(p.body.length > 0);
  assert.equal(p.extra.cues.length, 5);
  assert.equal(new Set(p.extra.cues).size, 5);
});

test('TTS drill timing table', () => {
  assert.deepEqual(drillTiming('yesAnd', 4), { prepS: 0, answerS: 15, questions: 3 });
  assert.deepEqual(drillTiming('listen', 1), { prepS: 0, answerS: 45, questions: 1 });
  assert.deepEqual(drillTiming('expert', 2), { prepS: 0, answerS: 12, questions: 5 });
  for (const d of ['yesAnd', 'listen', 'expert']) assert.ok(DRILLS.includes(d));
});
