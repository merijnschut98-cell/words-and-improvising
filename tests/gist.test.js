// The kernzin (17 Nov, Merijn chose it): every lesson opens with one bold line
// that says the lesson in short, so someone who knows it can move on and someone
// who doesn't knows what the reading is for. Rollout ratchet: modules listed in
// tests/fixtures/gist-pending.json may still lack it; the list only shrinks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pending = JSON.parse(fs.readFileSync('tests/fixtures/gist-pending.json', 'utf8'));
const load = async (mod, lang) => (await import(`../src/content/courses/${mod.replace('.', '/')}.${lang}.js`)).default;
const all = ['eng', 'pm'].flatMap((s) => fs.readdirSync(`src/content/courses/${s}`).filter((f) => f.endsWith('.nl.js')).map((f) => `${s}.${f.slice(0, -6)}`));

test('every module outside the pending list has a kernzin on every lesson, nl and en', async () => {
  for (const mod of all) {
    if (pending.includes(mod)) continue;
    for (const lang of ['nl', 'en']) {
      for (const l of (await load(mod, lang)).lessons) assert.ok(typeof l.gist === 'string' && l.gist.trim(), `${mod} ${lang} ${l.id}: kernzin (gist) missing`);
    }
  }
});

test('a pending module that is complete leaves the list', async () => {
  for (const mod of pending) {
    assert.ok(all.includes(mod), `${mod}: no such module`);
    const done = (await Promise.all(['nl', 'en'].map((lang) => load(mod, lang)))).every((m) => m.lessons.every((l) => typeof l.gist === 'string' && l.gist.trim()));
    assert.ok(!done, `${mod}: every lesson has its kernzin; remove it from tests/fixtures/gist-pending.json`);
  }
});

test('the kernzin shows on the first reading block and above the film', () => {
  const src = fs.readFileSync('src/ui/lesson.js', 'utf8');
  assert.equal((src.match(/class: 'gist'/g) || []).length, 2);
});
