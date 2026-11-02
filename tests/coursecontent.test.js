import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SUBJECTS, TRACKS, MODULES, loadModule, moduleOf, trackOf, subjectOf } from '../src/content/courses/index.js';
import { validateModule } from '../src/content/courses/validate.js';

const q = (n) => ({ q: `Question ${n}?`, options: ['a', 'b', 'c', 'd'], answer: 'b', why: 'Because b.' });
const lesson = (id, extra = {}) => ({
  id,
  title: 'A title',
  pre: [q(0)],
  teach: ['Block one.', 'Block two.', 'Block three.'],
  example: { kind: 'worked', text: 'A worked example.' },
  said: 'What engineers say: “it is the bottleneck”.',
  recall: [q(1), q(2), { q: 'How much?', number: 0.85, tolerance: 0.02, unit: '', why: 'Because.' }],
  situation: { scene: 'A scene.', ask: 'What do you ask?', model: 'A model answer.', rubric: ['one', 'two', 'three'] },
  sayIt: 'Explain it in 60 seconds.',
  terms: [{ term: 'Takt', def: 'The pace of demand.' }, { term: 'WIP', def: 'Work in progress.' }],
  ...extra,
});
const fxMeta = { id: 'eng.fx', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.fx.a', 'eng.fx.b'], questions: { 'eng.fx.a': 3, 'eng.fx.b': 3 } };
const fxEn = { lessons: [lesson('eng.fx.a'), lesson('eng.fx.b')] };
const fxNl = { lessons: [lesson('eng.fx.a'), lesson('eng.fx.b')] };

test('index: every module has a known subject and track, ≥ 3 lessons, level 1–4, titles in both languages', () => {
  assert.deepEqual(SUBJECTS, ['eng', 'pm']);
  for (const m of MODULES) {
    assert.ok(SUBJECTS.includes(m.subject), m.id);
    assert.ok(TRACKS[m.subject].includes(m.track), m.id);
    assert.ok(m.id.startsWith(`${m.subject}.`), m.id);
    assert.ok(m.lessons.length >= 3, m.id);
    assert.ok([1, 2, 3, 4].includes(m.level), m.id);
    for (const l of ['en', 'nl']) assert.ok(m.title[l] && m.blurb[l], `${m.id} ${l}`);
    for (const id of m.lessons) assert.ok(id.startsWith(`${m.id}.`), id);
  }
  assert.equal(new Set(MODULES.map((m) => m.id)).size, MODULES.length);
});

test('id helpers', () => {
  assert.equal(moduleOf('eng.flow.takt'), 'eng.flow');
  assert.equal(moduleOf('eng.flow.takt#r2'), 'eng.flow');
  assert.equal(subjectOf('pm.intake.scope'), 'pm');
});

test('validateModule: a valid fixture passes', () => {
  assert.deepEqual(validateModule(fxEn, fxNl, fxMeta), []);
});

test('validateModule: flags missing lessons, bad answers, numeric without tolerance, faded at level 1, and markup', () => {
  const bad = { lessons: [lesson('eng.fx.a', {
    recall: [{ ...q(1), answer: 'z' }, q(2), { q: 'How much?', number: 3, unit: 'm', why: 'x' }],
    example: { kind: 'faded', text: 'x', ask: 'next?', reveal: 'y' },
    said: 'Use <b>bold</b>',
  })] };
  const errs = validateModule(bad, fxNl, fxMeta).join('\n');
  assert.match(errs, /eng\.fx\.b/);
  assert.match(errs, /answer/);
  assert.match(errs, /tolerance/);
  assert.match(errs, /faded/);
  assert.match(errs, /[<>]/);
});

test('validateModule: question counts must match the index', () => {
  const meta = { ...fxMeta, questions: { 'eng.fx.a': 4, 'eng.fx.b': 3 } };
  assert.match(validateModule(fxEn, fxNl, meta).join('\n'), /eng\.fx\.a.*count/);
});

test('every shipped module validates and its files are in the service worker shell', async () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  for (const m of MODULES) {
    const en = await loadModule(m.subject, m.id, 'en');
    const nl = await loadModule(m.subject, m.id, 'nl');
    assert.deepEqual(validateModule(en, nl, m), [], m.id);
    const slug = m.id.split('.')[1];
    for (const l of ['en', 'nl']) assert.ok(sw.includes(`'src/content/courses/${m.subject}/${slug}.${l}.js'`), `${m.id} ${l} missing from sw.js`);
  }
});

test('validateModule: a figure id must be a plain id; every shipped figure file exists and is in the shell', async () => {
  const bad = { lessons: [lesson('eng.fx.a', { figure: '../evil' }), lesson('eng.fx.b')] };
  assert.match(validateModule(bad, fxNl, fxMeta).join('\n'), /figure/);
  const ok = { lessons: [lesson('eng.fx.a', { figure: 'eng.fx.line' }), lesson('eng.fx.b')] };
  assert.deepEqual(validateModule(ok, fxNl, fxMeta), []);
  const sw = fs.readFileSync('sw.js', 'utf8');
  for (const m of MODULES) {
    for (const lang of ['en', 'nl']) {
      const mod = await loadModule(m.subject, m.id, lang);
      for (const l of mod.lessons.filter((x) => x.figure)) {
        const file = `src/content/courses/figures/${l.figure}.html`;
        assert.ok(fs.existsSync(file), `${l.id}: ${file} missing`);
        assert.ok(sw.includes(`'${file}'`), `${file} missing from sw.js`);
      }
    }
  }
});

test('every module file on disk is in the index (none silently dropped)', () => {
  for (const subject of SUBJECTS) {
    for (const f of fs.readdirSync(`src/content/courses/${subject}`).filter((x) => x.endsWith('.en.js'))) {
      const id = `${subject}.${f.replace('.en.js', '')}`;
      assert.ok(MODULES.some((m) => m.id === id), `${id} has files but no index entry`);
    }
  }
});
