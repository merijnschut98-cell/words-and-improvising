// v17: a module's intro film, shown at the top of the module before its
// topics (Merijn, 13 Nov: "that high-over picture is the thing I need the
// most"). The index names it with `intro: '<module id>.intro'`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULES } from '../src/content/courses/index.js';
import { checkIntro } from '../src/content/courses/validate.js';
import { introFilm } from '../src/ui/film.js';
import { STRINGS } from '../src/i18n.js';

const meta = (extra = {}) => ({ id: 'pm.fx', subject: 'pm', track: 'basics', level: 1, ...extra });

test('checkIntro: no intro is fine; an intro must be the module id plus .intro', () => {
  assert.deepEqual(checkIntro(meta()), []);
  assert.deepEqual(checkIntro(meta({ intro: 'pm.fx.intro' })), []);
  assert.equal(checkIntro(meta({ intro: 'pm.other.intro' })).length, 1);
  assert.equal(checkIntro(meta({ intro: 'pm.fx.intro#2' })).length, 1, 'an intro starts at the beginning');
  assert.equal(checkIntro(meta({ intro: 42 })).length, 1);
});

test('introFilm: the parsed film of a module, or null', () => {
  assert.equal(introFilm(meta()), null);
  assert.deepEqual(introFilm(meta({ intro: 'pm.fx.intro' })), { id: 'pm.fx.intro', scene: null });
  assert.equal(introFilm(null), null);
});

test('every module intro in the index is valid, built and precached', () => {
  const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  for (const m of MODULES) {
    if (!('intro' in m)) continue;
    assert.deepEqual(checkIntro(m), [], m.id);
    const page = `src/content/courses/films/${m.intro}.html`;
    assert.ok(fs.existsSync(new URL(`../${page}`, import.meta.url)), `${m.id}: ${page} is built`);
    assert.ok(sw.includes(`'${page}'`), `${m.id}: ${page} is in the SHELL`);
  }
});

test('the intro heading has words in both languages', () => {
  for (const lang of ['en', 'nl']) assert.ok(STRINGS[lang].moduleIntro, `${lang}: moduleIntro`);
});
