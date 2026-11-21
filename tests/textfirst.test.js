// Merijn, 17 Nov: a Projects lesson whose film shows little that the text does not
// becomes text-first: Lezen · Voorbeeld is the main path and the film stays as an
// optional "Bekijk de film" in the reading. Films where the picture does the work
// (and every Engineering film) stay the main step.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { lessonPhases, filmIsMain } from '../src/core/course.js';
import { TEXT_FIRST_FILMS } from '../src/content/courses/films/textfirst.js';

test('a text-first film keeps the reading as the main path', () => {
  const id = [...TEXT_FIRST_FILMS][0];
  assert.ok(id, 'the list has at least one film');
  const lesson = { pre: [{}], teach: ['a'], film: id, example: { kind: 'worked', text: 'x' } };
  assert.equal(filmIsMain(lesson), false);
  assert.deepEqual(lessonPhases(lesson), ['pre', 'teach', 'example', 'quiz']);
  assert.deepEqual(lessonPhases({ ...lesson, film: `${id}#2` }), ['pre', 'teach', 'example', 'quiz']);
});

test('any other film stays the main step', () => {
  const lesson = { teach: ['a'], film: 'eng.machining.turning' };
  assert.equal(filmIsMain(lesson), true);
  assert.deepEqual(lessonPhases(lesson), ['film', 'quiz']);
  assert.equal(filmIsMain({ teach: ['a'] }), false);
});

test('the text-first list names only Projects lesson films that exist and lessons that use them', () => {
  const dir = 'src/content/courses/pm';
  const used = new Set();
  for (const f of fs.readdirSync(dir)) for (const m of fs.readFileSync(`${dir}/${f}`, 'utf8').matchAll(/film: '([a-z0-9.]+)/g)) used.add(m[1]);
  for (const id of TEXT_FIRST_FILMS) {
    assert.match(id, /^pm\./, `${id}: only Projects films are text-first`);
    assert.doesNotMatch(id, /\.intro$|^pm\.field\./, `${id}: intro and field films are not lesson films`);
    assert.ok(fs.existsSync(`src/content/courses/films/${id}.html`), `${id}: film page exists`);
    assert.ok(used.has(id), `${id}: a lesson uses it`);
  }
});

test('a text-first lesson offers its film inside the reading', () => {
  const src = fs.readFileSync('src/ui/lesson.js', 'utf8');
  assert.match(src, /filmButton\(app, lesson\.film/);
});
