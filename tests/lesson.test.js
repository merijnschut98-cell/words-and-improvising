import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makePrompt, buildLesson, seededRng } from '../src/core/lesson.js';
import { DRILLS } from '../src/core/progress.js';
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
