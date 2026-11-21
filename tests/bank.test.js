import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { KINDS, kindOf } from '../src/core/questionkinds.js';
import { meta, lessons, bankEn, bankNl, blueprint } from './fixtures/bank/tiny.js';
import {
  checkBank, checkBankItem, checkBlueprint, checkModuleBank, normText, quoteOccurs, MIN_PER_TOPIC, MIN_PER_TOPIC_LEVEL,
} from '../src/content/courses/validatebank.js';
import { lintBank } from '../scripts/lintquestions.js';
import { loadBank, loadBlueprint, BANKS, hasBank, bankQuestionId, isBankQuestion, lessonOf, moduleOf } from '../src/content/courses/index.js';
import { questionById } from '../src/core/course.js';

const clone = (x) => structuredClone(x);
const run = (en = bankEn, nl = bankNl, bp = blueprint, ls = lessons) => checkBank(en, nl, bp, meta, ls);
const item = (b, id) => b.items.find((x) => x.id === id);
const has = (errors, re) => assert.ok(errors.some((e) => re.test(e)), `expected an error matching ${re}, got:\n${errors.join('\n')}`);

test('the fixture bank is valid and holds every kind', () => {
  const r = run();
  assert.deepEqual(r.errors, []);
  const kinds = new Set(bankEn.items.map(kindOf));
  assert.deepEqual([...kinds].sort(), [...KINDS].sort());
  assert.equal(r.warnings.some((w) => /^no \w+ item/.test(w)), false);
});

test('the kinds in the fixture: mc, num, best, all, gap, order, match', () => {
  const ids = Object.fromEntries(bankEn.items.map((x) => [x.id, x]));
  assert.ok(ids.b1.options && !ids.b1.kind);
  assert.ok('number' in ids.b2);
  assert.ok(ids.b3.close);
  assert.ok(ids.b4.answers);
  assert.ok(ids.b5.accept);
  assert.ok(ids.b6.items);
  assert.ok(ids.b7.pairs);
});

test('shortfalls are warnings, not errors', () => {
  const r = run();
  assert.equal(r.errors.length, 0);
  assert.ok(r.warnings.some((w) => /topic alpha: 4 items, the topic test needs /.test(w)), r.warnings.join('\n'));
  assert.ok(r.warnings.some((w) => /level test 1/.test(w)));
  assert.ok(r.warnings.some((w) => /topic beta level 1: 1 items, needs /.test(w)));
  assert.ok(MIN_PER_TOPIC >= 8 && MIN_PER_TOPIC_LEVEL >= 2);
});

test('a missing kind is a warning', () => {
  const en = clone(bankEn); const nl = clone(bankNl);
  en.items = en.items.filter((x) => x.id !== 'b7'); nl.items = nl.items.filter((x) => x.id !== 'b7');
  en.retired = ['b7']; nl.retired = ['b7'];
  const r = run(en, nl);
  assert.deepEqual(r.errors, []);
  assert.ok(r.warnings.includes('no match item in the bank'));
});

// ---- the shared question rules ----
test('items go through checkQuestion (a bad mc is rejected)', () => {
  const en = clone(bankEn); item(en, 'b1').options = ['a', 'b', 'c'];
  has(run(en).errors, /en bank b1: needs 4 options/);
});

test('the new kinds are checked too (gap without a gap, best without close)', () => {
  const en = clone(bankEn); item(en, 'b5').text = 'No gap here.'; delete item(en, 'b3').close;
  const { errors } = run(en);
  has(errors, /en bank b5: gap text needs exactly one/);
  has(errors, /en bank b3: best answer needs close/);
});

test('every item needs an id of the form b<n>, unique and not retired', () => {
  let en = clone(bankEn); item(en, 'b2').id = 'q2';
  has(run(en).errors, /id must look like b1/);
  en = clone(bankEn); item(en, 'b2').id = 'b1';
  has(run(en).errors, /duplicate id/);
  en = clone(bankEn); en.retired = ['b8'];
  has(run(en).errors, /en bank b8: id was retired/);
});

test('retired ids: no holes in the numbering, the same list in nl and en', () => {
  // b8 removed without retiring it, then b9 added: b8 is a hole
  let en = clone(bankEn); let nl = clone(bankNl);
  for (const b of [en, nl]) { const x = item(b, 'b8'); x.id = 'b9'; }
  has(run(en, nl).errors, /en: b8 neither an item nor retired/);
  // retired in both: fine
  en.retired = ['b8']; nl.retired = ['b8'];
  assert.deepEqual(run(en, nl).errors, []);
  // retired in one language only
  nl = clone(nl); nl.retired = [];
  has(run(en, nl).errors, /retired differs between en \(b8\) and nl \(none\)/);
  // retired must hold ids
  en = clone(bankEn); en.retired = ['eight'];
  has(run(en).errors, /en: retired must be a list of ids/);
  en = clone(bankEn); en.retired = ['b9', 'b9']; const nl2 = clone(bankNl); nl2.retired = ['b9'];
  has(run(en, nl2).errors, /en: retired has a duplicate/);
});

test('not every select-all item may have the same number of keys', () => {
  const en = clone(bankEn); const nl = clone(bankNl);
  for (const b of [en, nl]) b.items.push({ ...clone(item(b, 'b4')), id: 'b9', topic: 'alpha', level: 4 });
  has(run(en, nl).errors, /every select-all question has 3 correct answers/);
});

// ---- topic, level, source ----
test('topic and level must exist in the module', () => {
  let en = clone(bankEn); item(en, 'b1').topic = 'gamma';
  has(run(en).errors, /topic "gamma" is not a topic/);
  en = clone(bankEn); item(en, 'b1').level = 5;
  has(run(en).errors, /level must be 1, 2, 3 or 4/);
});

test('the source lesson is the lesson of that topic at that level', () => {
  const en = clone(bankEn); item(en, 'b1').source = { lesson: 'tiny.mod.a2', quote: lessons.en[1].teach[0] };
  has(run(en).errors, /source lesson tiny.mod.a2 is not the level 1 lesson of topic alpha/);
  const en2 = clone(bankEn); item(en2, 'b1').source = { lesson: 'tiny.mod.zzz', quote: 'whatever the text says here' };
  has(run(en2).errors, /source lesson tiny.mod.zzz is not in the module/);
  const en3 = clone(bankEn); delete item(en3, 'b1').source;
  has(run(en3).errors, /source needs \{ lesson, quote \}/);
});

test('the source quote must occur in the lesson text', () => {
  const en = clone(bankEn); item(en, 'b1').source.quote = 'This sentence is nowhere in the lesson at all.';
  has(run(en).errors, /en bank b1: source quote does not occur in the text of tiny.mod.a1/);
});

test('a source is found in teach, the example and the terms; whitespace and quotes do not matter', () => {
  const l = lessons.en[0];
  assert.ok(quoteOccurs(l, l.teach[1]));
  assert.ok(quoteOccurs(l, l.example.text));
  assert.ok(quoteOccurs(l, l.terms[0].def));
  assert.ok(quoteOccurs({ teach: ['He said “it’s  fine” – really.'] }, "He said \"it's fine\" - really."));
  assert.ok(quoteOccurs({ teach: ["He said \"it's fine\" - really."] }, 'He said  “it’s fine”\n— really.'));
  assert.equal(normText('a  b\n c'), 'a b c');
  // a quote may not straddle two blocks
  assert.ok(!quoteOccurs(l, `${l.teach[0]} ${l.teach[1]}`));
  const en = clone(bankEn); item(en, 'b1').source.quote = `  ${l.teach[0].replace(' ', '   ')} `;
  assert.deepEqual(run(en).errors.filter((e) => /b1/.test(e)), []);
});

test('the quote must be in the language of the bank, and be a real sentence', () => {
  const en = clone(bankEn); item(en, 'b1').source.quote = lessons.nl[0].teach[0];
  has(run(en).errors, /en bank b1: source quote does not occur/);
  const nl = clone(bankNl); item(nl, 'b1').source.quote = 'De wachtrij van tiny.mod.a1 groeit';
  has(run(bankEn, nl).errors, /nl bank b1: source quote is under 6 words/);
});

test('a source may quote the gist, not said (the misconception); case, soft hyphens and non-breaking spaces do not matter', () => {
  const l = { title: 'T', gist: 'Een basislijn is de goedgekeurde versie van de scope.', said: 'Je hoort vaak dat plannen tot op de week moet.', teach: ['De sponsor tekent\u00a0de basis\u00adlijn met een datum erbij.'] };
  assert.ok(quoteOccurs(l, l.gist));
  assert.ok(!quoteOccurs(l, l.said));
  assert.ok(quoteOccurs(l, 'de goedgekeurde versie van de scope'));
  assert.ok(quoteOccurs(l, 'Goedgekeurde versie van de scope.'));
  assert.ok(quoteOccurs(l, 'De sponsor tekent de basislijn met een datum erbij.'));
});

test('checkBankItem checks one item without the id rules (for generated items)', () => {
  const it = { ...clone(item(bankEn, 'b1')), id: 'g1' };
  assert.deepEqual(checkBankItem(it, meta, lessons.en, 'en'), []);
  has(checkBankItem({ ...it, level: 2 }, meta, lessons.en, 'en'), /not the level 2 lesson of topic alpha/);
  has(checkBankItem({ ...it, source: { lesson: 'tiny.mod.a1', quote: 'A sentence that the lesson never says at all.' } }, meta, lessons.en, 'en'), /does not occur/);
  has(checkBankItem(it, meta, lessons.nl, 'nl'), /does not occur in the text of tiny.mod.a1 \(nl\)/);
});

test('bank question ids: <lessonId>#b<n>, never found as a review question', () => {
  const it = item(bankEn, 'b3');
  const id = bankQuestionId(it);
  assert.equal(id, 'tiny.mod.a3#b3');
  assert.equal(lessonOf(id), 'tiny.mod.a3');
  assert.equal(moduleOf(id), 'tiny.mod');
  assert.ok(isBankQuestion(id));
  assert.ok(!isBankQuestion('tiny.mod.a3#r3'));
  assert.ok(!isBankQuestion('tiny.mod.a3#p0'));
  const modules = [{ lessons: lessons.en.map((l) => ({ ...l, recall: [item(bankEn, 'b1')] })) }];
  assert.equal(questionById(modules, id), null);
  assert.ok(questionById(modules, 'tiny.mod.a3#r0'));
});

// ---- parity ----
test('nl and en carry the same ids', () => {
  const nl = clone(bankNl); nl.items = nl.items.filter((x) => x.id !== 'b8');
  has(run(bankEn, nl).errors, /bank b8: missing in nl/);
  const en = clone(bankEn); en.items = en.items.filter((x) => x.id !== 'b2');
  has(run(en).errors, /bank b2: missing in en/);
});

test('parity: kind, topic, level, key positions, counts', () => {
  let nl = clone(bankNl); item(nl, 'b2').options = ['a', 'b', 'c', 'd']; item(nl, 'b2').answer = 'a'; delete item(nl, 'b2').number; delete item(nl, 'b2').tolerance; delete item(nl, 'b2').unit;
  has(run(bankEn, nl).errors, /bank b2: kind differs between en and nl/);
  nl = clone(bankNl); item(nl, 'b1').options = ['Hij blijft gelijk', 'Hij groeit snel', 'Hij krimpt', 'Hij verdwijnt'];
  has(run(bankEn, nl).errors, /bank b1: answer position differs/);
  nl = clone(bankNl); item(nl, 'b3').close = item(nl, 'b3').options[3];
  has(run(bankEn, nl).errors, /bank b3: runner-up position differs/);
  nl = clone(bankNl); item(nl, 'b4').answers = ['Een buffer', 'Reserveonderdelen'];
  has(run(bankEn, nl).errors, /bank b4: answer positions differ/);
  nl = clone(bankNl); item(nl, 'b6').items.push('Borgen');
  has(run(bankEn, nl).errors, /bank b6: item counts differ/);
  nl = clone(bankNl); item(nl, 'b7').pairs.push(['Extra', 'Extra rechts']);
  has(run(bankEn, nl).errors, /bank b7: pair counts differ/);
  nl = clone(bankNl); item(nl, 'b2').number = 11;
  has(run(bankEn, nl).errors, /bank b2: numbers differ/);
  nl = clone(bankNl); item(nl, 'b2').tolerance = 1;
  has(run(bankEn, nl).errors, /bank b2: tolerances differ/);
  let en = clone(bankEn); nl = clone(bankNl);
  item(en, 'b5').choices = ['buffer', 'queue', 'line', 'stock']; item(nl, 'b5').choices = ['buffer', 'wachtrij', 'lijn', 'voorraad', 'machine'];
  has(run(en, nl).errors, /bank b5: word bank sizes differ/);
  en = clone(bankEn); item(en, 'b5').choices = ['buffer', 'queue', 'line', 'stock'];
  has(run(en, bankNl).errors, /bank b5: word bank in one language only/);
  // the checks run both ways: a change on the en side is caught as well
  en = clone(bankEn); item(en, 'b6').items.push('Sustain');
  has(run(en).errors, /bank b6: item counts differ/);
  en = clone(bankEn); item(en, 'b3').close = item(en, 'b3').options[2];
  has(run(en).errors, /bank b3: runner-up position differs/);
  nl = clone(bankNl); item(nl, 'b8').level = 3;
  has(run(bankEn, nl).errors, /bank b8: level differs/);
  nl = clone(bankNl); item(nl, 'b5').accept = ['buffervoorraad']; // wording of a gap is free
  assert.deepEqual(run(bankEn, nl).errors, []);
});

// ---- blueprint ----
test('the fixture blueprint is complete', () => assert.deepEqual(checkBlueprint(blueprint, meta), []));

test('blueprint completeness', () => {
  let bp = clone(blueprint); delete bp.topics.beta;
  has(checkBlueprint(bp, meta), /topic beta missing/);
  bp = clone(blueprint); delete bp.topics.alpha[3];
  has(checkBlueprint(bp, meta), /alpha level 3: missing/);
  bp = clone(blueprint); bp.topics.alpha[2].traps.en = ['one', 'two'];
  has(checkBlueprint(bp, meta), /alpha level 2: traps en needs 3–6 texts/);
  bp = clone(blueprint); bp.topics.alpha[2].aims.nl = [];
  has(checkBlueprint(bp, meta), /aims nl needs 1–2 texts/);
  bp = clone(blueprint); bp.topics.alpha[1].traps.nl.push('Misvatting 4');
  has(checkBlueprint(bp, meta), /traps count differs between nl and en/);
  bp = clone(blueprint); bp.topics.gamma = bp.topics.alpha;
  has(checkBlueprint(bp, meta), /unknown topic gamma/);
  bp = clone(blueprint); bp.module = 'other.mod';
  has(checkBlueprint(bp, meta), /module must be 'tiny.mod'/);
  assert.deepEqual(checkBlueprint(null, meta), ['blueprint tiny.mod: missing']);
  assert.ok(run(bankEn, bankNl, null).errors.length > 0);
});

// ---- a module without a bank passes ----
test('a module without a bank passes; a half bank does not', async () => {
  const none = await checkModuleBank(meta, async () => null, async () => []);
  assert.deepEqual(none, { errors: [], warnings: [], present: false });
  const half = await checkModuleBank(meta, async (w) => (w === 'en' ? bankEn : null), async () => []);
  has(half.errors, /bank file for nl missing/);
  has(half.errors, /blueprint file missing/);
  const all = await checkModuleBank(meta, async (w) => ({ en: bankEn, nl: bankNl, blueprint }[w]), async (lang) => lessons[lang]);
  assert.deepEqual(all.errors, []);
  assert.equal(all.present, true);
});

test('loadBank and loadBlueprint resolve null for a module without a bank', async () => {
  assert.equal(hasBank('pm.nonexistent'), false);
  assert.equal(await loadBank('pm.nonexistent', 'nl'), null);
  assert.equal(await loadBlueprint('pm.nonexistent'), null);
});

test('for a module listed in BANKS a failed load throws, so it is not mistaken for "no bank"', async () => {
  BANKS.push('pm.nonexistent');
  try {
    await assert.rejects(loadBank('pm.nonexistent', 'nl'));
    await assert.rejects(loadBlueprint('pm.nonexistent'));
  } finally { BANKS.pop(); }
});

test('the real banks, when there are any, come as nl, en and blueprint together and are valid', async () => {
  const dir = new URL('../src/content/courses/banks/', import.meta.url);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.js')) : [];
  const ids = new Set(files.map((f) => f.split('.').slice(0, 2).join('.')));
  assert.deepEqual([...ids].sort(), [...BANKS].sort(), 'banklist.js lists exactly the modules with bank files');
  const { MODULES, loadModule } = await import('../src/content/courses/index.js');
  for (const id of ids) {
    const m = MODULES.find((x) => x.id === id);
    assert.ok(m, `${id}: bank for an unknown module`);
    const r = await checkModuleBank(m, async (w) => (w === 'blueprint' ? loadBlueprint(id) : loadBank(id, w)), async (lang) => (await loadModule(m.subject, id, lang)).lessons);
    assert.deepEqual(r.errors, [], `${id}: ${r.errors.join('\n')}`);
  }
});

// ---- the lint can read a bank ----
test('lintBank lints bank items like recall questions (absolute word only in a distractor)', () => {
  const en = clone(bankEn);
  item(en, 'b1').options = ['It grows fast', 'It always stays equal', 'It never shrinks', 'It disappears'];
  const f = lintBank(en, meta, 'en', lessons.en);
  assert.ok(f.some((x) => x.id === 'tiny.mod.a1#b1' && x.rule === 'absolute'), JSON.stringify(f));
  assert.deepEqual(lintBank(bankEn, meta, 'en', lessons.en).filter((x) => x.rule === 'absolute'), []);
});

// ---- service worker shell ----
test('every bank file under src is in the service worker shell', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.ok(sw.includes("'src/content/courses/validatebank.js'"), 'validatebank.js missing from sw.js');
  assert.ok(sw.includes("'src/content/courses/banklist.js'"), 'banklist.js missing from sw.js');
  const dir = 'src/content/courses/banks';
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  for (const f of files) assert.ok(sw.includes(`'${dir}/${f}'`), `${dir}/${f} missing from the SHELL in sw.js`);
});
