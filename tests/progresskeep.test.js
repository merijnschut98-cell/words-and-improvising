// Progress hangs on lesson ids and on recall question n of each lesson
// ('<lang>|<lessonId>#r<n>'). The 24 lessons of machining, joining, moulding
// and lines that existed before v10 keep their ids, recall counts, and per
// question its kind, answer position and number. Wording may change.
// v13: modules rebuilt as topics × levels pin their old lessons the same way,
// one fixture per module (fixtures/v13-<moduleId>-recall-keys.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULES, loadModule, moduleOf } from '../src/content/courses/index.js';

const fixture = (name) => JSON.parse(fs.readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'));
const pinned = fixture('v9-recall-keys.json');

async function assertKept(pins) {
  const cache = {};
  for (const id of Object.keys(pins)) {
    const meta = MODULES.find((m) => m.id === moduleOf(id));
    assert.ok(meta && meta.lessons.includes(id), `${id} is no longer in the index`);
    assert.equal(meta.questions[id], pins[id].questions, `${id}: index question count changed`);
    for (const lang of ['en', 'nl']) {
      const k = `${meta.id}|${lang}`;
      cache[k] = cache[k] || await loadModule(meta.subject, meta.id, lang);
      const lesson = cache[k].lessons.find((l) => l.id === id);
      assert.ok(lesson, `${lang} ${id} missing from its module file`);
      const want = pins[id][lang].recall;
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
}

test('existing lessons keep their recall keys', async () => {
  assert.equal(Object.keys(pinned).length, 24);
  await assertKept(pinned);
});

test('v13: modules rebuilt as topics × levels keep their old lessons’ recall keys', async () => {
  const files = fs.readdirSync(new URL('./fixtures/', import.meta.url)).filter((f) => /^v13-.+-recall-keys\.json$/.test(f));
  assert.ok(files.includes('v13-pm.intake-recall-keys.json'));
  for (const f of files) {
    const pins = fixture(f);
    const mod = f.replace(/^v13-(.+)-recall-keys\.json$/, '$1');
    assert.ok(Object.keys(pins).length > 0, `${f} is empty`);
    for (const id of Object.keys(pins)) assert.equal(moduleOf(id), mod, `${f}: ${id} is from another module`);
    assert.ok(Array.isArray(MODULES.find((m) => m.id === mod).topics), `${mod} has no topics yet`);
    await assertKept(pins);
  }
});
