// v18 T3: AI-generated extra tests (design 3.3). Every API call is a fake SDK; no network, no key.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MODULES, loadModule, loadBank, loadBlueprint, hasBank } from '../src/content/courses/index.js';
import { checkBankItem } from '../src/content/courses/validatebank.js';
import { lintQuestion } from '../src/core/questionlint.js';
import * as scriptLint from '../scripts/lintquestions.js';
import * as coreLint from '../src/core/questionlint.js';
import { grade } from '../src/core/questionkinds.js';
import {
  EXTRA_SIZE, MIN_SURVIVORS, CACHE_SETS, extraAvailable, topicLessons, buildGenRequest, parseGenerated, normalizeItem, stemOf, nearDuplicate,
  checkLocal, localFilter, buildVerifyRequest, parseVerdicts, mergeVerdicts, assembleSet, generateExtra, setKey, readSets, saveSet,
  readFlags, addFlag, removeFlag, clearFlags, flagKey, flagText, applyExtra, extraScore, CACHE_CHARS, MAX_GENERATED, MAX_TEXT,
} from '../src/core/testgen.js';

const META = MODULES.find((m) => m.id === 'pm.plan');
let en; let nl; let bankEn; let bankNl; let bp;
before(async () => {
  en = (await loadModule('pm', 'pm.plan', 'en')).lessons;
  nl = (await loadModule('pm', 'pm.plan', 'nl')).lessons;
  bankEn = await loadBank('pm.plan', 'en');
  bankNl = await loadBank('pm.plan', 'nl');
  bp = await loadBlueprint('pm.plan');
});

const ctxOf = (lang = 'en') => ({ meta: META, topicId: 'breakdown', lessons: lang === 'en' ? en : nl, blueprint: bp, bank: lang === 'en' ? bankEn : bankNl, lang, model: 'claude-opus-5-5' });

// ---- fixtures: items in the bank's shape (topic, level, source { lesson, quote }), written against the real wbs lesson ----
const QUOTE_80 = 'bigger than about 80 hours hides surprises and can’t be tracked';
const QUOTE_TEAM = 'People commit to what they helped break down';
const QUOTE_100 = 'Together, the branches must cover all the work, and nothing outside the project';
const mcItem = (over = {}) => ({
  kind: 'mc', topic: 'breakdown', level: 1, source: { lesson: 'pm.plan.wbs', quote: QUOTE_80 },
  q: 'You plan a work package of 150 hours for one analyst. What is the problem with it?',
  options: ['It is too big to follow and hides surprises', 'It is too small to be worth managing', 'It has no verb in its name', 'It needs a second analyst to start'],
  answer: 'It is too big to follow and hides surprises', why: 'A package bigger than about 80 hours hides surprises and can’t be tracked.', ...over,
});
const allItem = (over = {}) => ({
  kind: 'all', topic: 'breakdown', level: 1, source: { lesson: 'pm.plan.wbs', quote: 'Each package gets a verb, an owner and a definition of done' },
  q: 'Which things does every work package get? Tick all that apply.',
  options: ['A verb in its name', 'An owner', 'A definition of done', 'A separate deliverable of its own', 'A second package as backup'],
  answers: ['A verb in its name', 'An owner', 'A definition of done'], why: 'Each package gets a verb, an owner and a definition of done.', ...over,
});
const gapItem = (over = {}) => ({
  kind: 'gap', topic: 'breakdown', level: 1, source: { lesson: 'pm.plan.wbs', quote: QUOTE_TEAM },
  q: 'Fill in the missing word.', text: 'People ___ to what they helped break down.', accept: ['commit'], choices: ['commit', 'object', 'refer', 'delegate'],
  why: 'People commit to what they helped break down.', ...over,
});
const numItem = (over = {}) => ({
  kind: 'num', topic: 'breakdown', level: 1, source: { lesson: 'pm.plan.wbs', quote: QUOTE_80 },
  q: 'A team lead splits a 240-hour package into equal packages of 60 hours each. How many packages does he get?', number: 4, tolerance: 0.1, unit: 'packages',
  why: '240 divided by 60 is 4.', ...over,
});
const orderItem = (over = {}) => ({
  kind: 'order', topic: 'breakdown', level: 1, source: { lesson: 'pm.plan.wbs', quote: 'Activities come later, under each one' },
  q: 'Put the steps of building a breakdown in the right order.',
  items: ['Ask what exists when the project is done', 'Write four to seven deliverables', 'Break each deliverable into work packages', 'Give each package an owner'],
  why: 'Deliverables first, activities later, under each one.', ...over,
});
const matchItem = (over = {}) => ({
  kind: 'match', topic: 'breakdown', level: 1, source: { lesson: 'pm.plan.wbs', quote: QUOTE_100 },
  q: 'Match each situation to what it says about the breakdown.',
  pairs: [['Nobody does the data access work', 'Work is missing from the tree'], ['A package of 500 hours', 'Too big to track'], ['A package of 2 hours', 'Micromanagement']],
  why: 'The branches must cover all the work; the size rule limits packages from both sides.', ...over,
});
const FIVE = () => [mcItem(), allItem(), gapItem(), numItem(), orderItem(), matchItem()];

const msg = (data, extra = {}) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data) }], ...extra });

// A fake SDK: the constructor options and every call are recorded; responders answer in turn.
function fakeSdk(responders, seen = []) {
  return async () => ({
    default: class {
      constructor(opts) { seen.push({ ctor: opts }); this.beta = { messages: { create: async (params) => { seen.push({ call: params }); return responders.shift()(params); } } }; }
    },
  });
}
const fakeStorage = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); }, _m: m }; };

// ---- the pure lint moved into the app ----
test('the question lint lives in src/core/questionlint.js and the script re-exports it', () => {
  for (const name of ['RULES', 'lintQuestion', 'lintModule', 'lintBank', 'lintAll', 'countsOf', 'hasAbsolute']) assert.equal(scriptLint[name], coreLint[name], name);
  assert.ok(!/node:|process\./.test(readFileSync(new URL('../src/core/questionlint.js', import.meta.url), 'utf8').replace(/\/\/.*$/gm, '')), 'the browser can load it');
});

// ---- availability ----
test('the extra-test button needs a key and a bank', () => {
  assert.equal(extraAvailable({ apiKey: 'sk-test' }, 'pm.plan', hasBank), true);
  assert.equal(extraAvailable({ apiKey: '' }, 'pm.plan', hasBank), false, 'no key');
  assert.equal(extraAvailable({}, 'pm.plan', hasBank), false);
  assert.equal(extraAvailable({ apiKey: '   ' }, 'pm.plan', hasBank), false, 'blank key');
  assert.equal(extraAvailable({ apiKey: 'sk-test' }, 'eng.maintenance', hasBank), false, 'no bank');
});

// ---- request building ----
test('the request carries lesson text, blueprint, three exemplars and the level mix, and nothing personal', () => {
  const req = buildGenRequest({ ...ctxOf('en'), context: 'I work at Acme Foods in Zwolle', apiKey: 'sk-ant-SECRET', name: 'Merijn', state: { courseReviews: {} } });
  const raw = JSON.stringify(req);
  for (const bad of ['Acme', 'Zwolle', 'SECRET', 'sk-ant', 'Merijn', 'courseReviews']) assert.ok(!raw.includes(bad), `not sent: ${bad}`);
  assert.equal(req.model, 'claude-opus-5-5');
  assert.deepEqual(req.betas, ['server-side-fallback-2026-07-01'], 'fallbacks like the other coach calls');
  assert.equal(buildGenRequest({ ...ctxOf('en'), model: 'claude-haiku-5-5' }).betas, undefined, 'none for haiku');
  assert.equal(req.output_config.effort, 'low');
  assert.equal(req.output_config.format.type, 'json_schema');
  const body = JSON.parse(req.messages[0].content);
  assert.equal(body.count, EXTRA_SIZE);
  assert.deepEqual(body.levelMix, { 1: 1, 2: 2, 3: 3, 4: 4 });
  assert.deepEqual(body.lessons.map((l) => l.id), META.topics[0].levels);
  assert.deepEqual(body.lessons.map((l) => l.level), [1, 2, 3, 4]);
  const wbs = en.find((l) => l.id === 'pm.plan.wbs');
  const sent = body.lessons[0];
  assert.equal(sent.title, wbs.title);
  assert.equal(sent.gist, wbs.gist);
  assert.deepEqual(sent.teach, wbs.teach);
  assert.deepEqual(sent.terms, wbs.terms);
  assert.deepEqual(body.blueprint['1'].aims, bp.topics.breakdown[1].aims.en);
  assert.deepEqual(body.blueprint['4'].traps, bp.topics.breakdown[4].traps.en);
  assert.equal(body.exemplars.length, 3);
  for (const ex of body.exemplars) {
    assert.equal(ex.topic, 'breakdown');
    assert.ok(!('id' in ex), 'the bank id is not sent');
    assert.ok(bankEn.items.some((b) => b.q === ex.q), 'a real bank item');
  }
  assert.ok(new Set(body.exemplars.map((e) => e.kind || 'x')).size >= 2, 'exemplars differ in kind');
  assert.match(req.system, /English/);
  assert.match(buildGenRequest(ctxOf('nl')).system, /Dutch/);
  const bodyNl = JSON.parse(buildGenRequest(ctxOf('nl')).messages[0].content);
  assert.deepEqual(bodyNl.blueprint['2'].aims, bp.topics.breakdown[2].aims.nl);
  assert.equal(bodyNl.lessons[0].title, nl.find((l) => l.id === 'pm.plan.wbs').title);
  assert.ok(req.max_tokens >= 3000);
});

test('the item schema has the source and the kinds, and does not take a lintOk field', () => {
  const schema = buildGenRequest(ctxOf('en')).output_config.format.schema;
  const item = schema.properties.items.items;
  for (const k of ['kind', 'level', 'q', 'why', 'source']) assert.ok(item.required.includes(k), k);
  assert.deepEqual(item.properties.source.required, ['lesson', 'quote']);
  assert.ok(!('lintOk' in item.properties));
  assert.deepEqual(item.properties.kind.enum.slice().sort(), ['all', 'best', 'gap', 'match', 'mc', 'num', 'order']);
});

test('topicLessons pairs the level with the lesson, in order', () => {
  const rows = topicLessons(META, 'breakdown', en);
  assert.deepEqual(rows.map((r) => [r.level, r.lesson.id]), META.topics[0].levels.map((id, i) => [i + 1, id]));
  assert.deepEqual(topicLessons(META, 'nope', en), []);
});

// ---- parsing ----
test('parsing: clean JSON, a fenced block and prose around the JSON all work', () => {
  const data = { items: [mcItem()] };
  for (const text of [JSON.stringify(data), `\`\`\`json\n${JSON.stringify(data)}\n\`\`\``, `Here are the items:\n${JSON.stringify(data)}\nHope that helps.`]) {
    const r = parseGenerated(msg(text), 'breakdown');
    assert.equal(r.ok, true, text.slice(0, 20));
    assert.equal(r.items.length, 1);
    assert.equal(r.items[0].topic, 'breakdown');
  }
  assert.equal(parseGenerated(msg(JSON.stringify([mcItem()])), 'breakdown').items.length, 1, 'a bare array');
});

test('parsing: malformed output is a parse error, never a throw', () => {
  const full = JSON.stringify({ items: [mcItem(), allItem()] });
  for (const bad of ['', 'not json at all', full.slice(0, full.length - 40), '{"items": "none"}', '{"items": []}', '{"nothing": 1}', '[1, 2, 3]']) {
    const r = parseGenerated(msg(bad), 'breakdown');
    assert.equal(r.ok, false, bad.slice(0, 30));
    assert.equal(r.error, 'parse');
  }
  assert.equal(parseGenerated({ stop_reason: 'refusal', content: [] }, 'breakdown').error, 'refusal');
  assert.equal(parseGenerated({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{"items":[' }] }, 'breakdown').error, 'parse');
  assert.equal(parseGenerated(null, 'breakdown').ok, false);
  assert.equal(parseGenerated({ content: [{ type: 'thinking', thinking: 'x' }] }, 'breakdown').error, 'parse');
});

test('parsing: entries that are not objects are dropped, and only known fields stay', () => {
  const r = parseGenerated(msg({ items: [mcItem({ lintOk: 'trust me', id: 'b99', topic: 'schedule', extra: 1, hint: 'h' }), 'junk', null, 7, [1]] }), 'breakdown');
  assert.equal(r.items.length, 1);
  const it = r.items[0];
  assert.ok(!('lintOk' in it) && !('id' in it) && !('extra' in it) && !('hint' in it));
  assert.equal(it.topic, 'breakdown', 'the topic is the requested one, whatever the model wrote');
  assert.deepEqual(normalizeItem({ kind: 'mc', level: '2', q: ' x ', why: 'y', source: { lesson: 'l', quote: 'q' }, options: null, answer: null }, 'breakdown').level, 2);
  assert.ok(!('options' in normalizeItem({ kind: 'mc', options: null }, 'breakdown')), 'nulls from a structured output are dropped');
});

// ---- local checks ----
const lctx = (lang = 'en') => ({ meta: META, lessons: lang === 'en' ? en : nl, bank: lang === 'en' ? bankEn : bankNl, lang });
test('a good item passes every local check', () => {
  for (const it of FIVE()) assert.deepEqual(checkLocal(it, lctx()), [], it.kind);
});

test('local check 1, schema: the validator rules reject a bad item', () => {
  const bad = (it) => checkLocal(it, lctx()).join(' | ');
  assert.match(bad(mcItem({ options: ['a', 'b', 'c'] })), /needs 4 options/);
  assert.match(bad(mcItem({ answer: 'something else' })), /answer not in options/);
  assert.match(bad(mcItem({ kind: 'weird' })), /unknown kind/);
  assert.match(bad(mcItem({ why: '' })), /why missing/);
  assert.match(bad(mcItem({ topic: 'schedule' })), /schedule/);
  assert.match(bad(mcItem({ level: 5 })), /level/);
  assert.match(bad(gapItem({ text: 'No gap here.' })), /exactly one/);
  assert.match(bad(mcItem({ source: { lesson: 'pm.plan.scope', quote: QUOTE_80 } })), /level 1 lesson/);
  assert.match(bad(mcItem({ q: 'A <b>bold</b> stem' })), /< or >/);
  assert.match(bad(mcItem({ source: undefined })), /source/);
});

test('local check 2a, lint: zero findings; a lint finding rejects, and lintOk cannot skip it', () => {
  const absolute = mcItem({ options: ['It is too big to follow and hides surprises', 'It never needs an owner', 'It has no verb in its name', 'It needs a second analyst to start'] });
  assert.ok(lintQuestion(absolute, { lang: 'en', tier: 1, kind: 'recall' }).length > 0, 'precondition: the lint sees it');
  assert.match(checkLocal(absolute, lctx()).join(' | '), /lint absolute|lint/);
  // the model tries to switch the lint off; normalizeItem strips it, and checkLocal ignores it as well
  const sneaky = mcItem({ options: absolute.options, lintOk: 'fine' });
  const kept = localFilter([sneaky], lctx());
  assert.equal(kept.kept.length, 0);
  assert.ok(checkLocal(sneaky, lctx()).some((r) => /lint/.test(r)), 'checkLocal ignores lintOk');
  const nobody = mcItem({ options: ['It is too big to follow and hides surprises', 'Ignore it, nobody tracks packages', 'It has no verb in its name', 'It needs a second analyst to start'] });
  assert.ok(checkLocal(nobody, lctx()).some((r) => /lint nobody/.test(r)));
});

test('local check 2b, the source must occur verbatim after normalising (quotes, dashes, spaces, case)', () => {
  assert.deepEqual(checkLocal(mcItem({ source: { lesson: 'pm.plan.wbs', quote: 'BIGGER than about 80 hours  hides surprises and can\'t be tracked' } }), lctx()), []);
  assert.match(checkLocal(mcItem({ source: { lesson: 'pm.plan.wbs', quote: 'bigger than roughly 100 hours hides surprises and cannot be tracked' } }), lctx()).join(), /does not occur/);
  assert.match(checkLocal(mcItem({ source: { lesson: 'pm.plan.wbs', quote: 'too short quote' } }), lctx()).join(), /under 6 words/);
  assert.match(checkLocal(mcItem({ source: { lesson: 'pm.plan.nope', quote: QUOTE_80 } }), lctx()).join(), /not in the module/);
  // a sentence from the lesson `said` (the misconception) is not a source
  const said = en.find((l) => l.id === 'pm.plan.wbs').said;
  assert.match(checkLocal(mcItem({ source: { lesson: 'pm.plan.wbs', quote: said } }), lctx()).join(), /does not occur/);
});

test('local check 2c, near-duplicate stems: against the bank, the lesson questions and the set itself', () => {
  const bankItem = bankEn.items.find((b) => b.topic === 'breakdown' && b.options);
  const dup = mcItem({ q: bankItem.q.replace(/\.$/, '') + ' ?' });
  assert.ok(checkLocal(dup, lctx()).some((r) => /duplicate/.test(r) && /bank/.test(r)), 'bank');
  const recall = en.find((l) => l.id === 'pm.plan.wbs').recall[1];
  assert.ok(checkLocal(mcItem({ q: recall.q }), lctx()).some((r) => /duplicate/.test(r) && /lesson/.test(r)), 'lesson question');
  assert.ok(checkLocal(mcItem({ q: recall.q.toUpperCase() }), lctx()).some((r) => /duplicate/.test(r)), 'case does not matter');
  const out = localFilter([mcItem(), mcItem({ q: 'You plan a work package of 150 hours for one analyst. What is the problem with that?' })], lctx());
  assert.equal(out.kept.length, 1, 'the second is a near-duplicate of the first');
  assert.ok(out.rejected[0].reasons.some((r) => /duplicate/.test(r) && /set/.test(r)));
  // different stems are fine, and gap items with the same generic q are told apart by their text
  assert.equal(nearDuplicate(stemOf(gapItem()), stemOf(gapItem({ text: 'A work package smaller than about ___ hours is micromanagement.', accept: ['8'], choices: ['8', '20', '40', '80'] }))), false);
  assert.equal(nearDuplicate(stemOf(mcItem()), stemOf(allItem())), false);
});

test('localFilter keeps the good ones and says why it dropped the rest', () => {
  const r = localFilter([...FIVE(), mcItem({ options: ['a', 'b'] }), 'junk'], lctx());
  assert.equal(r.kept.length, 6);
  assert.equal(r.rejected.length, 1);
  assert.match(r.rejected[0].reasons.join(), /needs 4 options/);
});

test('the local checks work in Dutch: the Dutch lesson text, the Dutch bank and the Dutch best-answer stem', () => {
  const nlBank = bankNl.items.find((b) => b.topic === 'breakdown' && b.options);
  const { id, ...copy } = nlBank;
  assert.ok(checkLocal(copy, lctx('nl')).some((r) => /duplicate of bank item/.test(r)), 'the Dutch bank is the one compared with');
  assert.match(checkLocal(mcItem(), lctx('nl')).join(), /does not occur/, 'an English quote is not in the Dutch lesson');
  const best = (q) => mcItem({ kind: 'best', q, close: 'It is too small to be worth managing', source: { lesson: 'pm.plan.wbs', quote: nl.find((l) => l.id === 'pm.plan.wbs').teach[2].split('. ')[0] } });
  assert.match(checkLocal(best('What is the best approach to a package of 150 hours?'), lctx('nl')).join(), /beste/, 'a best stem must say beste in nl');
  assert.ok(!/beste/.test(checkLocal(best('Wat is de beste aanpak voor een pakket van 150 uur?'), lctx('nl')).join()));
});

// ---- the independent check ----
test('the verifier request has the items without keys, plus the lesson text', () => {
  const items = FIVE().map((it, n) => ({ ...it, id: `pm.plan.wbs#g${n + 1}` }));
  const req = buildVerifyRequest({ items, ...ctxOf('en') });
  const body = JSON.parse(req.messages[0].content);
  assert.equal(body.items.length, items.length);
  const raw = JSON.stringify(body.items);
  for (const key of ['"answer"', '"answers"', '"accept"', '"close"', '"why"', '"source"', '"number"', '"pairs"', '"tolerance"']) assert.ok(!raw.includes(key), `no ${key} in the items sent`);
  assert.ok(!raw.includes('"quote"'));
  const byKind = Object.fromEntries(body.items.map((x) => [x.kind, x]));
  assert.equal(byKind.mc.options.length, 4);
  assert.deepEqual([...byKind.order.items].sort(), [...orderItem().items].sort());
  assert.notDeepEqual(byKind.order.items, orderItem().items, 'an order is sent shuffled, never solved');
  assert.deepEqual(byKind.match.left, matchItem().pairs.map((p) => p[0]));
  assert.deepEqual([...byKind.match.right].sort(), matchItem().pairs.map((p) => p[1]).sort());
  assert.ok(!('accept' in byKind.gap) && byKind.gap.text.includes('___'));
  assert.equal(byKind.num.unit, 'packages');
  assert.ok(body.lessons.length >= 1 && body.lessons[0].teach.length >= 3, 'the lesson text is there');
  assert.equal(req.output_config.effort, 'low');
  assert.match(req.system, /without|independent|blind/i);
  assert.ok(!JSON.stringify(req).includes('sk-'), 'no key');
});

const verdictFor = (it, n, over = {}) => {
  const base = { n, unambiguous: true, nonsenseOption: false };
  switch (it.kind) {
    case 'all': return { ...base, picks: it.answers };
    case 'gap': return { ...base, text: it.accept[0] };
    case 'num': return { ...base, number: it.number };
    case 'order': return { ...base, order: it.items };
    case 'match': return { ...base, pairs: it.pairs };
    default: return { ...base, pick: it.answer };
  }
};
test('verifier merge: kept only if the answer equals the key, it is unambiguous and no option is nonsense', () => {
  const items = FIVE();
  const all = items.map((it, n) => verdictFor(it, n));
  assert.equal(mergeVerdicts(items, all).kept.length, 6, 'every kind can be right');
  // a wrong answer, per kind
  const wrong = [
    { ...all[0], pick: 'It is too small to be worth managing' }, { ...all[1], picks: ['An owner'] }, { ...all[2], text: 'object' },
    { ...all[3], number: 5 }, { ...all[4], order: [...orderItem().items].reverse() }, { ...all[5], pairs: [['Nobody does the data access work', 'Too big to track'], ['A package of 500 hours', 'Work is missing from the tree'], ['A package of 2 hours', 'Micromanagement']] },
  ];
  for (let i = 0; i < 6; i++) {
    const r = mergeVerdicts(items, all.map((v, j) => (j === i ? wrong[i] : v)));
    assert.equal(r.kept.length, 5, `wrong ${items[i].kind}`);
    assert.ok(!r.kept.includes(items[i]));
    assert.match(r.rejected[0].reasons[0], /answer/);
  }
  const amb = mergeVerdicts(items, all.map((v, j) => (j === 0 ? { ...v, unambiguous: false } : v)));
  assert.equal(amb.kept.length, 5);
  assert.match(amb.rejected[0].reasons[0], /ambiguous/);
  const non = mergeVerdicts(items, all.map((v, j) => (j === 1 ? { ...v, nonsenseOption: true } : v)));
  assert.equal(non.kept.length, 5);
  assert.match(non.rejected[0].reasons[0], /nonsense/);
  // a missing verdict, a verdict for a missing item, a non-boolean flag: all dropped
  assert.equal(mergeVerdicts(items, all.slice(1)).kept.length, 5);
  assert.equal(mergeVerdicts(items, all.map((v, j) => (j === 2 ? { ...v, unambiguous: 'yes' } : v))).kept.length, 5, 'only true counts');
  assert.equal(mergeVerdicts(items, [...all, { n: 99, pick: 'x' }]).kept.length, 6);
  assert.equal(mergeVerdicts(items, []).kept.length, 0);
  assert.equal(mergeVerdicts(items, null).kept.length, 0);
});

test('verifier parsing: malformed is a parse error', () => {
  assert.equal(parseVerdicts(msg({ verdicts: [{ n: 0, pick: 'a', unambiguous: true, nonsenseOption: false }] })).verdicts.length, 1);
  assert.equal(parseVerdicts(msg('```json\n{"verdicts":[]}\n```')).ok, false, 'empty is a failure');
  assert.equal(parseVerdicts(msg('{"verdicts": 3}')).error, 'parse');
  assert.equal(parseVerdicts(msg('nope')).error, 'parse');
  assert.equal(parseVerdicts({ stop_reason: 'refusal', content: [] }).error, 'refusal');
});

// ---- the top-up ----
test('fewer than six survivors: the set is topped up from the bank and says so', () => {
  const four = FIVE().slice(0, 4);
  const set = assembleSet({ kept: four, ...ctxOf('en') });
  assert.equal(set.items.length, EXTRA_SIZE);
  assert.equal(set.toppedUp, EXTRA_SIZE - 4);
  assert.equal(set.items.filter((q) => q.src === 'ai').length, 4);
  const fromBank = set.items.filter((q) => q.src === 'bank');
  assert.equal(fromBank.length, 6);
  assert.ok(fromBank.every((q) => q.topic === 'breakdown' && /#b\d+$/.test(q.id)));
  assert.equal(new Set(set.items.map((q) => q.id)).size, set.items.length, 'ids are unique');
  assert.ok(set.items.filter((q) => q.src === 'ai').every((q) => /^pm\.plan\.\w+#g\d+$/.test(q.id) && !/#b\d+$/.test(q.id) && !/#r\d+$/.test(q.id)), 'generated ids are neither bank nor recall ids');
  assert.equal(assembleSet({ kept: [], ...ctxOf('en') }).toppedUp, EXTRA_SIZE);
});

test('six or more survivors: no top-up, at most ten items', () => {
  assert.equal(MIN_SURVIVORS, 6);
  const six = assembleSet({ kept: FIVE(), ...ctxOf('en') });
  assert.equal(six.toppedUp, 0);
  assert.equal(six.items.length, 6);
  const many = Array.from({ length: 12 }, (_, i) => mcItem({ q: `Question ${i} about package number ${i * 7}?` }));
  assert.equal(assembleSet({ kept: many, ...ctxOf('en') }).items.length, EXTRA_SIZE);
});

test('the top-up never repeats a bank item the generated items already resemble', () => {
  const bankItem = bankEn.items.find((b) => b.topic === 'breakdown' && b.options);
  const near = mcItem({ q: bankItem.q });
  const set = assembleSet({ kept: [near], ...ctxOf('en') });
  assert.ok(!set.items.some((q) => q.src === 'bank' && q.id === `${bankItem.source.lesson}#${bankItem.id}`));
});

// ---- the whole call ----
const genMsg = (items) => msg({ items });
const goodVerdicts = (p) => {
  const body = JSON.parse(p.messages[0].content);
  // answer like an honest checker, from the order of the items sent
  return msg({ verdicts: body.items.map((it, n) => ({ n, unambiguous: true, nonsenseOption: false, ...(it.kind === 'num' ? { number: 4 } : {}) })) });
};

test('generateExtra: one call to generate, one blind call to verify, both with the key and the settings model; the key stays out of the requests', async () => {
  const seen = [];
  const items = FIVE();
  const sdk = fakeSdk([
    () => genMsg(items),
    (p) => {
      const body = JSON.parse(p.messages[0].content);
      return msg({ verdicts: body.items.map((sent, n) => {
        const it = items[n];
        return { n, unambiguous: true, nonsenseOption: false, ...verdictFor(it, n) };
      }) });
    },
  ], seen);
  const res = await generateExtra({ apiKey: 'sk-ant-TESTKEY', ...ctxOf('en') }, sdk);
  assert.equal(res.ok, true);
  assert.equal(res.items.length, 6);
  assert.equal(res.toppedUp, 0);
  assert.deepEqual(res.stats, { generated: 6, local: 6, verified: 6 });
  const calls = seen.filter((s) => s.call);
  assert.equal(calls.length, 2);
  assert.equal(seen.find((s) => s.ctor).ctor.apiKey, 'sk-ant-TESTKEY');
  for (const c of calls) {
    assert.equal(c.call.model, 'claude-opus-5-5');
    assert.ok(!JSON.stringify(c.call).includes('TESTKEY'), 'the key is not in a request body');
  }
  assert.ok(!JSON.stringify(res).includes('TESTKEY'), 'nor in the result');
  // the verifier request is blind: no keys
  assert.ok(!JSON.stringify(calls[1].call).includes('"answers"'));
});

test('generateExtra: the verifier drops what the checker answers differently, and the set is topped up', async () => {
  const items = FIVE();
  const sdk = fakeSdk([
    () => genMsg(items),
    () => msg({ verdicts: items.map((it, n) => verdictFor(it, n)).map((v, n) => (n < 3 ? { ...v, unambiguous: false } : v)) }),
  ]);
  const res = await generateExtra({ apiKey: 'sk-test', ...ctxOf('en') }, sdk);
  assert.equal(res.ok, true);
  assert.deepEqual(res.stats, { generated: 6, local: 6, verified: 3 });
  assert.equal(res.items.filter((q) => q.src === 'ai').length, 3);
  assert.equal(res.toppedUp, EXTRA_SIZE - 3);
});

test('generateExtra: items rejected locally never reach the verifier', async () => {
  const seen = [];
  const items = [...FIVE(), mcItem({ options: ['x', 'y'] })];
  const sdk = fakeSdk([() => genMsg(items), (p) => { const b = JSON.parse(p.messages[0].content); return msg({ verdicts: b.items.map((_, n) => verdictFor(items[n], n)) }); }], seen);
  const res = await generateExtra({ apiKey: 'sk-test', ...ctxOf('en') }, sdk);
  assert.equal(JSON.parse(seen.filter((s) => s.call)[1].call.messages[0].content).items.length, 6);
  assert.equal(res.stats.generated, 7);
  assert.equal(res.stats.local, 6);
});

test('generateExtra: nothing survives locally, so no verifier call and the set is the bank', async () => {
  const seen = [];
  const res = await generateExtra({ apiKey: 'sk-test', ...ctxOf('en') }, fakeSdk([() => genMsg([mcItem({ options: [] })])], seen));
  assert.equal(seen.filter((s) => s.call).length, 1);
  assert.equal(res.ok, true);
  assert.equal(res.toppedUp, EXTRA_SIZE);
  assert.ok(res.items.every((q) => q.src === 'bank'));
});

test('generateExtra: a failed verifier call tops up from the bank rather than showing unchecked items', async () => {
  const res = await generateExtra({ apiKey: 'sk-test', ...ctxOf('en') }, fakeSdk([() => genMsg(FIVE()), () => msg('garbage')]));
  assert.equal(res.ok, true);
  assert.equal(res.items.filter((q) => q.src === 'ai').length, 0);
  assert.equal(res.toppedUp, EXTRA_SIZE);
});

test('generateExtra: no key, a bad key, offline, a rate limit and malformed output', async () => {
  assert.deepEqual(await generateExtra({ apiKey: '', ...ctxOf('en') }, fakeSdk([])), { ok: false, error: 'nokey' });
  assert.equal((await generateExtra({ apiKey: 'sk-test', ...ctxOf('en') }, async () => { throw new Error('network'); })).error, 'offline');
  const throwing = (err) => fakeSdk([() => { throw err; }]);
  const unk = await generateExtra({ apiKey: 'sk-test', ...ctxOf('en') }, throwing(new Error('boom')));
  assert.equal(unk.ok, false);
  assert.equal(unk.error, 'unknown');
  assert.equal((await generateExtra({ apiKey: 'sk-test', ...ctxOf('en') }, fakeSdk([() => msg('not json')]))).error, 'parse');
});

// ---- offline cache ----
// A cached set as generateExtra makes it: items in the bank shape, at least one generated.
const aiQ = (n, over = {}) => ({ ...mcItem(over), id: `pm.plan.wbs#g${n}`, src: 'ai' });
const cachedSet = (id, ts, items = [aiQ(1)]) => ({ id, ts, items, toppedUp: 0 });

test('offline cache: the last five generated sets per topic, per language, in localStorage', () => {
  const st = fakeStorage();
  const key = setKey('en', 'pm.plan', 'breakdown');
  assert.notEqual(key, setKey('nl', 'pm.plan', 'breakdown'));
  assert.notEqual(key, setKey('en', 'pm.plan', 'schedule'));
  assert.deepEqual(readSets(st, key), []);
  for (let i = 1; i <= 7; i++) saveSet(st, key, cachedSet(`s${i}`, i));
  const sets = readSets(st, key);
  assert.equal(CACHE_SETS, 5);
  assert.deepEqual(sets.map((s) => s.id), ['s7', 's6', 's5', 's4', 's3'], 'newest first, five kept');
  saveSet(st, setKey('en', 'pm.plan', 'schedule'), cachedSet('other', 1));
  assert.equal(readSets(st, key).length, 5, 'another topic does not push these out');
  assert.equal(readSets(st, setKey('en', 'pm.plan', 'schedule')).length, 1);
  assert.ok([...st._m.keys()].every((k) => !/sk-|apiKey/.test(k) && !/sk-ant/.test(st._m.get(k))), 'no key stored');
  saveSet(st, key, cachedSet('s7', 99));
  assert.equal(readSets(st, key).filter((s) => s.id === 's7').length, 1, 'the same set twice is one set');
});

test('offline cache: a set without a generated item is not cached (the bank test already offers it)', () => {
  const st = fakeStorage();
  const key = setKey('en', 'pm.plan', 'breakdown');
  saveSet(st, key, cachedSet('bankonly', 1, [{ ...mcItem(), id: 'pm.plan.wbs#b1', src: 'bank' }]));
  assert.deepEqual(readSets(st, key), []);
});

test('offline cache: a cached item that no longer passes the question rules drops its set, so a retake never breaks the quiz', () => {
  const st = fakeStorage();
  const key = setKey('en', 'pm.plan', 'breakdown');
  st.setItem('vp:testgen:v1', JSON.stringify({ [key]: [cachedSet('good', 2), cachedSet('bad', 1, [{ ...aiQ(1), options: ['a', 'b'] }]), cachedSet('noid', 0, [{ ...aiQ(1), id: 5 }])] }));
  assert.deepEqual(readSets(st, key).map((s) => s.id), ['good']);
});

test('offline cache: a total budget across all topics keeps localStorage free for the app state; the oldest sets go first', () => {
  const st = fakeStorage();
  const why = (n) => `${'A package bigger than about 80 hours hides surprises. '.repeat(8)}${n}`;
  const big = (n) => [aiQ(1, { why: why(n) }), aiQ(2, { why: why(n + 1) })];
  for (let i = 0; i < 400; i++) saveSet(st, setKey('en', 'pm.plan', `t${i % 80}`), cachedSet(`s${i}`, 1000 + i, big(i)));
  const raw = st.getItem('vp:testgen:v1');
  assert.ok(raw.length <= CACHE_CHARS, `cache is ${raw.length} chars`);
  assert.equal(readSets(st, setKey('en', 'pm.plan', 't79'))[0].id, 's399', 'the newest set is kept');
  const left = Object.values(JSON.parse(raw)).flat().map((s) => s.ts);
  assert.ok(left.length > 20 && left.length < 400);
  assert.equal(Math.min(...left), 1400 - left.length, 'exactly the oldest sets went');
});

test('offline cache: broken storage never throws', () => {
  const key = setKey('en', 'pm.plan', 'breakdown');
  const boom = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('quota'); } };
  assert.deepEqual(readSets(boom, key), []);
  assert.doesNotThrow(() => saveSet(boom, key, cachedSet('a', 1)));
  assert.deepEqual(readSets(null, key), []);
  const junk = fakeStorage();
  junk.setItem('vp:testgen:v1', '{{{');
  assert.deepEqual(readSets(junk, key), []);
  junk.setItem('vp:testgen:v1', JSON.stringify({ [key]: 'nope' }));
  assert.deepEqual(readSets(junk, key), []);
  junk.setItem('vp:testgen:v1', JSON.stringify({ [key]: [cachedSet('ok', 1), { nope: 1 }, null] }));
  assert.deepEqual(readSets(junk, key).map((s) => s.id), ['ok'], 'bad entries are skipped');
});

test('oversized output: at most twenty generated items are read, and the verifier gets at most the set size', async () => {
  const many = Array.from({ length: 30 }, () => mcItem());
  assert.equal(MAX_GENERATED, 20);
  assert.equal(parseGenerated(genMsg(many), 'breakdown').items.length, MAX_GENERATED);
  assert.equal(localFilter(FIVE(), { ...ctxOf('en') }, 3).kept.length, 3, 'localFilter stops at max kept');
  const seen = [];
  await generateExtra({ apiKey: 'sk-test', ...ctxOf('en'), size: 4 }, fakeSdk([() => genMsg(FIVE()), () => msg('x')], seen));
  assert.equal(JSON.parse(seen.filter((s) => s.call)[1].call.messages[0].content).items.length, 4);
});

test('oversized output: an over-long question, option or why is rejected locally', () => {
  const long = 'The team discusses the work package for a long time and then '.repeat(12);
  assert.ok(long.length > MAX_TEXT);
  assert.ok(checkLocal(mcItem({ q: long }), ctxOf('en')).some((r) => /too long/.test(r)));
  assert.ok(checkLocal(mcItem({ why: long }), ctxOf('en')).some((r) => /too long/.test(r)));
  const opts = mcItem().options.map((o, i) => (i === 3 ? long : o));
  assert.ok(checkLocal(mcItem({ options: opts }), ctxOf('en')).some((r) => /too long/.test(r)));
  assert.deepEqual(checkLocal(mcItem(), ctxOf('en')), []);
});

test('a cached set can be retaken: the items come back as they were', async () => {
  const st = fakeStorage();
  const res = await generateExtra({ apiKey: 'sk-test', ...ctxOf('en') }, fakeSdk([() => genMsg(FIVE()), (p) => { const b = JSON.parse(p.messages[0].content); return msg({ verdicts: b.items.map((_, n) => verdictFor(FIVE()[n], n)) }); }]));
  saveSet(st, setKey('en', 'pm.plan', 'breakdown'), { id: 'a', ts: 5, items: res.items, toppedUp: res.toppedUp });
  const back = readSets(st, setKey('en', 'pm.plan', 'breakdown'))[0];
  assert.deepEqual(back.items, JSON.parse(JSON.stringify(res.items)));
  for (const it of back.items) assert.equal(grade(it, it.kind === 'all' ? it.answers : it.kind === 'num' ? it.number : it.kind === 'gap' ? it.accept[0] : it.kind === 'order' ? it.items : it.kind === 'match' ? it.pairs : it.answer).ok, true, it.kind);
});

// ---- the flag list ----
test('flagged questions: kept locally with their text, newest first, and removable', () => {
  const st = fakeStorage();
  assert.deepEqual(readFlags(st), []);
  const it = { ...mcItem(), id: 'pm.plan.wbs#g1', src: 'ai' };
  addFlag(st, { item: it, moduleId: 'pm.plan', topicId: 'breakdown', lang: 'en', ts: 10 });
  addFlag(st, { item: { ...allItem(), id: 'pm.plan.wbs#g2', src: 'ai' }, moduleId: 'pm.plan', topicId: 'breakdown', lang: 'en', ts: 20 });
  const list = readFlags(st);
  assert.equal(list.length, 2);
  assert.equal(list[0].item.id, 'pm.plan.wbs#g2');
  assert.equal(list[1].item.q, it.q, 'the text is kept');
  assert.deepEqual(list[1].item.options, it.options);
  assert.equal(list[1].moduleId, 'pm.plan');
  assert.equal(list[1].topicId, 'breakdown');
  assert.equal(list[1].lang, 'en');
  assert.equal(list[1].ts, 10);
  assert.equal(flagKey(list[1]), flagKey({ moduleId: 'pm.plan', lang: 'en', item: it }));
  // flagging the same item again is one entry
  addFlag(st, { item: it, moduleId: 'pm.plan', topicId: 'breakdown', lang: 'en', ts: 30 });
  assert.equal(readFlags(st).length, 2);
  removeFlag(st, flagKey(list[1]));
  assert.deepEqual(readFlags(st).map((f) => f.item.id), ['pm.plan.wbs#g2']);
  clearFlags(st);
  assert.deepEqual(readFlags(st), []);
});

test('a flagged question reads as plain text with its key and source', () => {
  const st = fakeStorage();
  addFlag(st, { item: { ...mcItem(), id: 'pm.plan.wbs#g1', src: 'ai' }, moduleId: 'pm.plan', topicId: 'breakdown', lang: 'en', ts: 1 });
  addFlag(st, { item: { ...numItem(), id: 'pm.plan.wbs#g2', src: 'ai' }, moduleId: 'pm.plan', topicId: 'breakdown', lang: 'en', ts: 2 });
  const [num, mc] = readFlags(st).map(flagText);
  assert.match(mc, /^pm\.plan · breakdown · en · level 1\n/);
  assert.ok(mc.includes(mcItem().q) && mc.includes('* It is too big to follow and hides surprises') && mc.includes('- It is too small'));
  assert.ok(mc.includes(`source (pm.plan.wbs): ${QUOTE_80}`));
  assert.ok(num.includes('answer: 4 packages'));
});

test('flagged questions: a cap, broken storage and no key in the list', () => {
  const st = fakeStorage();
  for (let i = 0; i < 130; i++) addFlag(st, { item: mcItem({ q: `q${i}` , id: `x#g${i}` }), moduleId: 'pm.plan', topicId: 'breakdown', lang: 'en', ts: i });
  const list = readFlags(st);
  assert.equal(list.length, 100);
  assert.equal(list[0].item.q, 'q129', 'the newest stay');
  assert.ok(![...st._m.values()].some((v) => /sk-/.test(v)));
  const boom = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
  assert.deepEqual(readFlags(boom), []);
  assert.doesNotThrow(() => addFlag(boom, { item: mcItem({ id: 'a#g1' }), moduleId: 'pm.plan', topicId: 'breakdown', lang: 'en', ts: 1 }));
  assert.doesNotThrow(() => clearFlags(boom));
  const junk = fakeStorage(); junk.setItem('vp:testgen:flags:v1', '[1,{"x":1},null]');
  assert.deepEqual(readFlags(junk), []);
});

// ---- scoring and the effect of a finished extra test ----
const reviewState = (lang = 'en') => ({
  courseReviews: Object.fromEntries(en.find((l) => l.id === 'pm.plan.wbs').recall.map((_, i) => [`${lang}|pm.plan.wbs#r${i}`, { box: 3, due: '2026-12-30', lesson: 'pm.plan.wbs', subject: 'pm', lastSure: true }])),
  days: {}, streak: { current: 0, best: 0, lastDay: null }, xp: 0, courses: { pm: { lessons: {}, sessions: [] } },
});
const aiQs = () => FIVE().slice(0, 4).map((it, i) => ({ ...it, id: `pm.plan.wbs#g${i + 1}`, src: 'ai', topic: 'breakdown' }));

test('the score leaves flagged questions out, and an unanswered one counts as wrong', () => {
  const qs = aiQs();
  const s = extraScore(qs, { [qs[0].id]: true, [qs[1].id]: false, [qs[2].id]: false }, new Set([qs[2].id]));
  assert.deepEqual([s.correct, s.total, s.pct], [1, 3, 33]);
  assert.deepEqual(s.missed, [qs[1].id, qs[3].id]);
  assert.equal(s.flagged, 1);
  assert.deepEqual(extraScore([], {}, new Set()), { correct: 0, total: 0, pct: 0, missed: [], flagged: 0 });
  assert.equal(extraScore(qs, { [qs[0].id]: true }, new Set(qs.map((q) => q.id))).total, 0, 'all flagged: nothing to score');
});

test('Q7: a miss on a generated question makes the lesson recall questions due today; generated items never join the reviews', () => {
  const qs = aiQs();
  const before = reviewState();
  const res = applyExtra(before, { subject: 'pm', questions: qs, results: { [qs[0].id]: true, [qs[1].id]: false, [qs[2].id]: true, [qs[3].id]: true }, flagged: [], lang: 'en', lessons: en }, '2026-12-01', 1000);
  const reviews = res.state.courseReviews;
  for (const k of Object.keys(before.courseReviews)) assert.equal(reviews[k].due, '2026-12-01', k);
  assert.equal(reviews['en|pm.plan.wbs#r0'].box, 3, 'the box is not changed, only the due date');
  assert.ok(!Object.keys(reviews).some((k) => /#g\d+$/.test(k)), 'no generated item in the reviews');
  assert.equal(Object.keys(reviews).length, Object.keys(before.courseReviews).length, 'nothing else was added');
  assert.deepEqual([res.correct, res.total], [3, 4]);
});

test('Q7: a right answer, a flagged miss and a miss on a bank top-up item change no due date', () => {
  const qs = aiQs();
  const before = reviewState();
  const allRight = applyExtra(before, { subject: 'pm', questions: qs, results: Object.fromEntries(qs.map((q) => [q.id, true])), flagged: [], lang: 'en', lessons: en }, '2026-12-01', 1);
  assert.deepEqual(allRight.state.courseReviews, before.courseReviews);
  const flaggedMiss = applyExtra(before, { subject: 'pm', questions: qs, results: { [qs[0].id]: true, [qs[1].id]: false, [qs[2].id]: true, [qs[3].id]: true }, flagged: [qs[1].id], lang: 'en', lessons: en }, '2026-12-01', 1);
  assert.deepEqual(flaggedMiss.state.courseReviews, before.courseReviews, 'a flagged question is dropped, so it is not a miss');
  assert.equal(flaggedMiss.total, 3);
  const bank = { ...bankEn.items[0], id: 'pm.plan.wbs#b1', src: 'bank', topic: 'breakdown' };
  const bankMiss = applyExtra(before, { subject: 'pm', questions: [bank], results: { [bank.id]: false }, flagged: [], lang: 'en', lessons: en }, '2026-12-01', 1);
  assert.deepEqual(bankMiss.state.courseReviews, before.courseReviews, 'a bank miss is not a review event either (tests, Q5)');
});

test('Q7: a lesson without reviews yet gets its recall questions in box 1, due today; later due dates never move back', () => {
  const qs = aiQs();
  const state = { ...reviewState(), courseReviews: { 'en|pm.plan.wbs#r1': { box: 2, due: '2026-11-30', lesson: 'pm.plan.wbs', subject: 'pm', lastSure: true } } };
  const res = applyExtra(state, { subject: 'pm', questions: qs, results: { [qs[0].id]: false }, flagged: [], lang: 'en', lessons: en }, '2026-12-01', 1);
  const r = res.state.courseReviews;
  assert.equal(r['en|pm.plan.wbs#r1'].due, '2026-11-30', 'already overdue stays as it was');
  assert.deepEqual([r['en|pm.plan.wbs#r0'].box, r['en|pm.plan.wbs#r0'].due], [1, '2026-12-01']);
  assert.equal(Object.keys(r).length, en.find((l) => l.id === 'pm.plan.wbs').recall.length);
  // another language's reviews are not touched
  const nlRes = applyExtra({ ...state, courseReviews: { ...state.courseReviews, 'nl|pm.plan.wbs#r1': { box: 3, due: '2027-01-01', lesson: 'pm.plan.wbs', subject: 'pm' } } }, { subject: 'pm', questions: qs, results: { [qs[0].id]: false }, flagged: [], lang: 'en', lessons: en }, '2026-12-01', 1);
  assert.equal(nlRes.state.courseReviews['nl|pm.plan.wbs#r1'].due, '2027-01-01');
});

test('an extra test counts as a practised day, writes no test record and logs a session', () => {
  const qs = aiQs();
  const res = applyExtra(reviewState(), { subject: 'pm', questions: qs, results: Object.fromEntries(qs.map((q) => [q.id, true])), flagged: [], lang: 'en', lessons: en }, '2026-12-01', 1234);
  assert.equal(res.state.days['2026-12-01'], 1);
  assert.equal(res.state.courses.pm.tests, undefined, 'no test record: the extra test does not pass or fail a test');
  assert.equal(res.state.courses.pm.sessions[0].kind, 'extratest');
  assert.equal(res.state.courses.pm.sessions[0].total, 4);
});

// ---- the topic-level wiring ----
test('the real bank has enough in every topic to top up a set', () => {
  for (const t of META.topics) assert.ok(bankEn.items.filter((b) => b.topic === t.id).length >= EXTRA_SIZE - 0, t.id);
});
