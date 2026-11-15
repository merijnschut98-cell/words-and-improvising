// v17 Task 19: level openers. A short card per topic and level (Werkkennis,
// Gevorderd, Expert) that bridges to the lesson without teaching it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { MODULES, SUBJECTS, loadModule } from '../src/content/courses/index.js';
import { checkOpeners, openerKey, openerSentences, OPENER_MAX_CHARS, OPENER_LEVEL_WORDS } from '../src/content/courses/validate.js';
import engOpeners from '../src/content/courses/openers.eng.js';
import pmOpeners from '../src/content/courses/openers.pm.js';

const OPENERS = { eng: engOpeners, pm: pmOpeners };
const mods = (subject) => MODULES.filter((m) => m.subject === subject);
const topicsOf = (subject) => mods(subject).flatMap((m) => (m.topics || []).map((t) => ({ m, t, key: openerKey(m.id, t.id) })));

// A minimal valid module and opener set for the unit tests of the checker.
const fakeModule = { id: 'x.mod', topics: [{ id: 'one', levels: ['x.mod.a', 'x.mod.b', 'x.mod.c', 'x.mod.d'] }] };
const good = {
  2: { nl: 'Op Werkkennis doe je het zelf. Daarna kun je het uitleggen.', en: 'At Working knowledge you do it yourself. Afterwards you can explain it.' },
  3: { nl: 'Op Gevorderd kies je. Daarna kun je het verdedigen.', en: 'At Advanced you choose. Afterwards you can defend it.' },
  4: { nl: 'Op Expert weeg je alles. Daarna kun je het beoordelen.', en: 'At Expert you weigh everything. Afterwards you can judge it.' },
};

test('checkOpeners: a complete, well-formed set passes', () => {
  assert.deepEqual(checkOpeners([fakeModule], { 'x.mod/one': good }), []);
});

test('checkOpeners: missing topic, level and language fail', () => {
  assert.equal(checkOpeners([fakeModule], {}).length, 1);
  const { 3: _drop, ...two } = good;
  assert.ok(checkOpeners([fakeModule], { 'x.mod/one': two }).some((e) => /level 3: missing/.test(e)));
  const noEn = { ...good, 2: { nl: good[2].nl } };
  assert.ok(checkOpeners([fakeModule], { 'x.mod/one': noEn }).some((e) => /2 en: text missing/.test(e)));
});

test('checkOpeners: sentence count, colon, length, level name and level 1', () => {
  const bad = (patch) => checkOpeners([fakeModule], { 'x.mod/one': { ...good, 2: { ...good[2], ...patch } } });
  assert.ok(bad({ nl: 'Op Werkkennis een zin.' }).some((e) => /1 sentences/.test(e)));
  assert.ok(bad({ nl: 'Een. Twee. Drie. Vier. Vijf Werkkennis.' }).some((e) => /5 sentences/.test(e)));
  assert.ok(bad({ nl: 'Op Werkkennis ga je: doen. Daarna kun je het.' }).some((e) => /colon/.test(e)));
  assert.ok(bad({ nl: `Op Werkkennis ${'x'.repeat(OPENER_MAX_CHARS)}. Daarna kun je het.` }).some((e) => /characters/.test(e)));
  assert.ok(bad({ nl: 'Op een hoger niveau doe je het. Daarna kun je het.' }).some((e) => /does not name the level/.test(e)));
  assert.ok(bad({ en: 'At Working knowledge you do it.' }).some((e) => /sentences in nl but 1 in en|1 sentences/.test(e)));
  assert.ok(bad({ nl: 'Op Werkkennis in les 2 doe je het. Daarna kun je het.' }).some((e) => /lesson number/.test(e)));
  assert.ok(checkOpeners([fakeModule], { 'x.mod/one': { ...good, 1: good[2] } }).some((e) => /level 1/.test(e)));
  assert.ok(checkOpeners([fakeModule], { 'x.mod/one': good, 'x.mod/ghost': good }).some((e) => /no such topic/.test(e)));
});

test('checkOpeners: a topic without a lesson at a level takes no opener there', () => {
  const thin = { id: 'x.mod', topics: [{ id: 'one', levels: ['x.mod.a', 'x.mod.b', 'x.mod.c', null] }] };
  assert.ok(checkOpeners([thin], { 'x.mod/one': good }).some((e) => /level 4: no lesson/.test(e)));
  const { 4: _drop, ...three } = good;
  assert.deepEqual(checkOpeners([thin], { 'x.mod/one': three }), []);
});

for (const subject of SUBJECTS) {
  test(`${subject}: every topic has an opener for each level 2 to 4 in nl and en, and nothing else`, () => {
    assert.deepEqual(checkOpeners(mods(subject), OPENERS[subject]), []);
    for (const { key, t } of topicsOf(subject)) {
      for (const level of [2, 3, 4]) {
        if (!t.levels[level - 1]) continue;
        for (const lang of ['nl', 'en']) assert.ok(OPENERS[subject][key][level][lang], `${key} level ${level} ${lang}`);
      }
      assert.equal(OPENERS[subject][key][1], undefined, `${key}: no opener for level 1`);
    }
  });

  test(`${subject}: openers stay short, plain and in step between nl and en`, () => {
    for (const [key, levels] of Object.entries(OPENERS[subject])) {
      for (const level of [2, 3, 4]) {
        const { nl, en } = levels[level];
        for (const text of [nl, en]) {
          const n = openerSentences(text).length;
          assert.ok(n >= 2 && n <= 4, `${key} ${level}: ${n} sentences`);
          assert.ok(text.length <= OPENER_MAX_CHARS, `${key} ${level}: ${text.length} characters`);
          assert.ok(!text.includes(':'), `${key} ${level}: colon`);
          assert.ok(!/\b(?:les|lesson|level|niveau)\s+\d/i.test(text), `${key} ${level}: lesson number`);
          assert.ok(!/\b(?:eng|pm)\.[a-z0-9]+\.[a-z0-9]+/.test(text), `${key} ${level}: lesson id`);
        }
        assert.equal(openerSentences(nl).length, openerSentences(en).length, `${key} ${level}: sentence count differs`);
        assert.ok(nl.includes(OPENER_LEVEL_WORDS[level].nl), `${key} ${level}: nl names the level`);
        assert.ok(en.includes(OPENER_LEVEL_WORDS[level].en), `${key} ${level}: en names the level`);
      }
    }
  });

  test(`${subject}: openers do not all sound alike (varied openings and closings, per level and language)`, () => {
    const entries = Object.values(OPENERS[subject]);
    const share = (pick) => {
      const n = {};
      for (const e of entries) { const k = pick(e); n[k] = (n[k] || 0) + 1; }
      return Math.max(...Object.values(n)) / entries.length;
    };
    const first = (t) => t.split(/\s+/).slice(0, 2).join(' ');
    const last = (t) => { const s = openerSentences(t); return s[s.length - 1].split(/\s+/).slice(0, 2).join(' '); };
    for (const level of [2, 3, 4]) {
      for (const lang of ['nl', 'en']) {
        assert.ok(share((e) => first(e[level][lang])) <= 0.4, `${subject} ${level} ${lang}: one opening starts too many openers`);
        assert.ok(share((e) => last(e[level][lang])) <= 0.4, `${subject} ${level} ${lang}: one closing ends too many openers`);
      }
    }
  });

  test(`${subject}: no numbers from the lessons, only names such as N-1, SF6, A3, 8D, 3D, 5 whys or ISA-95`, () => {
    const names = /\b(?:N-1|SF6|A3|8D|3D|ISA-95)\b|5 whys/g;
    for (const [key, levels] of Object.entries(OPENERS[subject])) {
      for (const level of [2, 3, 4]) for (const lang of ['nl', 'en']) {
        assert.ok(!/\d/.test(levels[level][lang].replace(names, '')), `${key} ${level} ${lang}: has a number`);
      }
    }
  });

  test(`${subject}: openers use the lessons’ own words (no coined Dutch for terms the lessons keep)`, () => {
    const coined = /ratelmerken|makelaar|tariefintegriteit|werkbemonstering|oorlogskamer|overstapweekend|trainingenieur|leuningen|warmtekaart|holteverschijnsel|regranulaat|ontformhoek|doelsituatie|stapproef|booguur|waardeprijs|waardegerichte/i;
    for (const [key, levels] of Object.entries(OPENERS[subject])) {
      for (const level of [2, 3, 4]) assert.ok(!coined.test(levels[level].nl), `${key} ${level}: ${levels[level].nl.match(coined)}`);
    }
  });

  test(`${subject}: no opener repeats a sentence of its lesson (it bridges, it does not teach)`, async () => {
    const sentences = (s) => String(s).split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).filter((x) => x.length >= 30);
    for (const m of mods(subject)) {
      const lessons = { nl: (await loadModule(subject, m.id, 'nl')).lessons, en: (await loadModule(subject, m.id, 'en')).lessons };
      for (const t of m.topics) {
        for (const level of [2, 3, 4]) {
          const id = t.levels[level - 1];
          if (!id) continue;
          for (const lang of ['nl', 'en']) {
            const lesson = lessons[lang].find((l) => l.id === id);
            const opener = OPENERS[subject][openerKey(m.id, t.id)][level][lang];
            for (const block of [...(lesson.teach || []), lesson.example && lesson.example.text, lesson.said].filter(Boolean)) {
              for (const s of sentences(block)) assert.ok(!opener.includes(s), `${id} ${lang}: opener repeats "${s.slice(0, 60)}"`);
            }
          }
        }
      }
    }
  });
}

test('the opener files are precached by the service worker', () => {
  const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  for (const subject of SUBJECTS) assert.ok(sw.includes(`'src/content/courses/openers.${subject}.js'`), `${subject} openers in SHELL`);
});

test('node validate.js runs every content check, not only the openers, and exits 0 on the shipped content', () => {
  const r = spawnSync(process.execPath, ['src/content/courses/validate.js'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  for (const label of ['fields:', 'map pm:', 'map pm phone:', 'module eng.flow:', 'module pm.itproject:', 'openers eng', 'openers pm']) assert.ok(r.stdout.includes(label), `output names "${label}"`);
  assert.equal((r.stdout.match(/^module /gm) || []).length, MODULES.length, 'every module is validated in both languages');
});
