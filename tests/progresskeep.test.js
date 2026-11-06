// Progress hangs on lesson ids and on recall question n of each lesson
// ('<lang>|<lessonId>#r<n>'). The 24 lessons of machining, joining, moulding
// and lines that existed before v10 keep their ids, recall counts, and per
// question its kind, answer position and number. Wording may change.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULES, loadModule, moduleOf } from '../src/content/courses/index.js';

const pinned = JSON.parse(fs.readFileSync(new URL('./fixtures/v9-recall-keys.json', import.meta.url), 'utf8'));

test('existing lessons keep their recall keys', async () => {
  const ids = Object.keys(pinned);
  assert.equal(ids.length, 24);
  const cache = {};
  for (const id of ids) {
    const meta = MODULES.find((m) => m.id === moduleOf(id));
    assert.ok(meta && meta.lessons.includes(id), `${id} is no longer in the index`);
    assert.equal(meta.questions[id], pinned[id].questions, `${id}: index question count changed`);
    for (const lang of ['en', 'nl']) {
      const k = `${meta.id}|${lang}`;
      cache[k] = cache[k] || await loadModule(meta.subject, meta.id, lang);
      const lesson = cache[k].lessons.find((l) => l.id === id);
      assert.ok(lesson, `${lang} ${id} missing from its module file`);
      const want = pinned[id][lang].recall;
      assert.equal(lesson.recall.length, want.length, `${lang} ${id}: recall count changed`);
      want.forEach((w, n) => {
        const q = lesson.recall[n];
        const at = `${lang} ${id}#r${n}`;
        if (w.kind === 'num') {
          assert.ok('number' in q, `${at}: was numeric`);
          assert.equal(q.number, w.number, `${at}: number changed`);
        } else {
          assert.ok(!('number' in q), `${at}: was multiple choice`);
          assert.equal(q.options.indexOf(q.answer), w.answerIndex, `${at}: answer position changed`);
        }
      });
    }
  }
});
