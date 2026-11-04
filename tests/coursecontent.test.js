import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SUBJECTS, TRACKS, MODULES, loadModule, moduleOf, trackOf, subjectOf } from '../src/content/courses/index.js';
import { validateModule, checkTopics } from '../src/content/courses/validate.js';

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

test('validateModule: in a topic module the example kind follows the lesson’s level in its topic', () => {
  const faded = { kind: 'faded', text: 'x', ask: 'next?', reveal: 'y' };
  const mk = (b) => ({ lessons: [lesson('eng.fx.a'), lesson('eng.fx.b', b ? { example: faded } : {})] });
  const topical = { ...fxMeta, topics: [{ id: 't', title: { en: 'T', nl: 'T' }, levels: ['eng.fx.x', 'eng.fx.y', 'eng.fx.b'] }] };
  assert.deepEqual(validateModule(mk(true), mk(true), topical), [], 'faded at level 3 of a level-1 module');
  const errs = validateModule(mk(false), mk(false), topical);
  assert.ok(errs.some((e) => e.includes('eng.fx.b') && e.includes('faded')), 'worked at level 3');
  assert.ok(!errs.some((e) => e.includes('eng.fx.a')), 'a lesson in no topic keeps the module level');
});

test('validateModule: pushback is checked when present, and required on project (pm) lessons', () => {
  const pb = { lines: ['That is not how we do it here.', 'We have no budget for this.'], model: 'I hear you. Let us test it on one line for two weeks.', rubric: ['Acknowledges the point', 'Restates the ask', 'Proposes a next step'] };
  const withPb = (p) => ({ lessons: [lesson('eng.fx.a', { situation: { ...lesson('eng.fx.a').situation, pushback: p } }), lesson('eng.fx.b')] });
  assert.deepEqual(validateModule(withPb(pb), fxNl, fxMeta), [], 'a valid pushback passes, and eng does not need one');
  assert.match(validateModule(withPb({ ...pb, lines: [pb.lines[0]] }), fxNl, fxMeta).join('\n'), /pushback/);
  assert.match(validateModule(withPb({ ...pb, model: '' }), fxNl, fxMeta).join('\n'), /pushback/);
  assert.match(validateModule(withPb({ ...pb, rubric: pb.rubric.slice(0, 2) }), fxNl, fxMeta).join('\n'), /pushback/);
  assert.match(validateModule(withPb({ ...pb, lines: [pb.lines[0], 'word '.repeat(41)] }), fxNl, fxMeta).join('\n'), /pushback/);
  assert.match(validateModule(withPb({ ...pb, model: 'word '.repeat(71) }), fxNl, fxMeta).join('\n'), /pushback/);
  const pmMeta = { ...fxMeta, id: 'pm.fx', subject: 'pm', lessons: ['pm.fx.a'], questions: { 'pm.fx.a': 3 } };
  const pmLesson = (extra) => ({ lessons: [lesson('pm.fx.a', extra)] });
  assert.match(validateModule(pmLesson(), pmLesson(), pmMeta).join('\n'), /pm\.fx\.a.*pushback/);
  const ok = pmLesson({ situation: { ...lesson('pm.fx.a').situation, pushback: pb } });
  assert.deepEqual(validateModule(ok, ok, pmMeta), []);
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

test('validator: a lesson may explain up to 6 terms, not 7', () => {
  const terms = (n) => Array.from({ length: n }, (_, i) => ({ term: `T${i}`, def: `Def ${i}.` }));
  const withTerms = (n) => ({ lessons: [lesson('eng.fx.a', { terms: terms(n) }), lesson('eng.fx.b')] });
  assert.deepEqual(validateModule(withTerms(6), withTerms(6), fxMeta).filter((e) => e.includes('terms')), []);
  assert.ok(validateModule(withTerms(7), withTerms(7), fxMeta).some((e) => e.includes('terms')));
});

test('every topic module in the index passes checkTopics', () => {
  for (const m of MODULES.filter((x) => Array.isArray(x.topics))) assert.deepEqual(checkTopics(m), [], m.id);
});
