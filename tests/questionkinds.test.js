// v18 F1: the question kinds engine. Validation, en/nl parity, judging per
// kind, the review texts, the stable shuffle, and the quiz flow with the new kinds.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { checkQuestion, checkKindParity, checkSelectAllSpread, validateModule } from '../src/content/courses/validate.js';
import { MODULES, loadModule } from '../src/content/courses/index.js';
import {
  kindOf, judge, grade, normalizeWord, editDistance, shuffled, answerText, valueText, SELECT_ALL_PROGRESS,
} from '../src/core/questionkinds.js';
import { judge as courseJudge, startQuiz, answerQuiz, guessCompare } from '../src/core/course.js';

const mc = { q: 'Wat?', options: ['a', 'b', 'c', 'd'], answer: 'b', why: 'w' };
const best = { kind: 'best', q: 'Wat is de beste eerste stap?', options: ['a', 'b', 'c', 'd'], answer: 'b', close: 'c', why: 'b, omdat; c ook verdedigbaar' };
const all = { kind: 'all', q: 'Vink alle juiste aan.', options: ['a', 'b', 'c', 'd', 'e'], answers: ['a', 'c', 'd'], why: 'w' };
const gap = { kind: 'gap', q: 'Vul het woord in.', text: 'De langste keten heet het ___ pad.', accept: ['kritieke', 'kritiek'], why: 'w' };
const order = { kind: 'order', q: 'Zet in volgorde.', items: ['d', 'm', 'a', 'i', 'c'], why: 'w' };
const match = { kind: 'match', q: 'Koppel.', pairs: [['l1', 'r1'], ['l2', 'r2'], ['l3', 'r3']], why: 'w' };

const errsOf = (q, lang = null) => { const e = []; checkQuestion(q, 'q', e, lang); return e; };

test('validator: today’s questions stay valid and a missing kind is mc', () => {
  assert.deepEqual(errsOf(mc), []);
  assert.deepEqual(errsOf({ q: 'n', number: 3, tolerance: 0.1, unit: '', why: 'w' }), []);
  assert.equal(kindOf(mc), 'mc');
  assert.equal(kindOf({ number: 1 }), 'num');
  assert.equal(errsOf({ ...mc, kind: 'wat' }).length, 1);
});

test('validator: each kind accepts a good question', () => {
  for (const q of [best, all, gap, order, match]) assert.deepEqual(errsOf(q), [], q.kind);
  assert.deepEqual(errsOf({ ...gap, choices: ['kritieke', 'korte', 'lange', 'vrije'] }), []);
  assert.deepEqual(errsOf({ ...gap, choices: null }), []);
});

test('validator: best needs close among the options, not the key, and "beste"/"best" in the stem', () => {
  assert.ok(errsOf({ ...best, close: undefined }).some((e) => /close/.test(e)));
  assert.ok(errsOf({ ...best, close: 'zz' }).some((e) => /close/.test(e)));
  assert.ok(errsOf({ ...best, close: 'b' }).some((e) => /differ/.test(e)));
  assert.ok(errsOf({ ...best, q: 'Wat is de eerste stap?' }).some((e) => /beste/.test(e)));
  assert.deepEqual(errsOf({ ...best, q: 'What is the best first step?' }, 'en'), []);
  assert.ok(errsOf({ ...best, q: 'What is the best first step?' }, 'nl').length, 'a Dutch stem must say beste');
  assert.ok(errsOf({ ...best, options: ['a', 'b', 'c'] }).length);
});

test('validator: all needs 4–6 distinct options and 1 to n−1 keys from them', () => {
  assert.ok(errsOf({ ...all, options: ['a', 'b', 'c'] }).length);
  assert.ok(errsOf({ ...all, options: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] }).length);
  assert.ok(errsOf({ ...all, options: ['a', 'b', 'c', 'd', 'a'] }).length);
  assert.ok(errsOf({ ...all, answers: [] }).length);
  assert.ok(errsOf({ ...all, answers: ['a', 'b', 'c', 'd', 'e'] }).length, 'all of them is not a proper subset');
  assert.ok(errsOf({ ...all, answers: ['a', 'z'] }).length);
  assert.ok(errsOf({ ...all, answers: ['a', 'a'] }).length);
  assert.deepEqual(errsOf({ ...all, answers: ['a'] }), []);
  assert.deepEqual(errsOf({ ...all, options: ['a', 'b', 'c', 'd'], answers: ['a', 'b', 'c'] }), []);
});

test('validator: gap needs exactly one ___, 1–4 accepted words, and a word bank that holds the first one', () => {
  assert.ok(errsOf({ ...gap, text: 'Geen gat.' }).length);
  assert.ok(errsOf({ ...gap, text: 'Twee ___ gaten ___.' }).length);
  assert.ok(errsOf({ ...gap, accept: [] }).length);
  assert.ok(errsOf({ ...gap, accept: ['a', 'b', 'c', 'd', 'e'] }).length);
  assert.ok(errsOf({ ...gap, choices: ['x', 'y', 'z'] }).length, 'bank of 3');
  assert.ok(errsOf({ ...gap, choices: ['x', 'y', 'z', 'w'] }).length, 'bank without the word');
  assert.ok(errsOf({ ...gap, choices: ['kritieke', 'kritieke', 'z', 'w'] }).length, 'bank not distinct');
});

test('validator: gap hint may not contain an accepted word', () => {
  assert.ok(errsOf({ ...gap, hint: 'Het kritieke pad dus.' }).some((e) => /hint gives/.test(e)));
  assert.deepEqual(errsOf({ ...gap, hint: 'Denk aan de planning.' }), []);
});

test('validator: order needs 3–6 distinct items, match 3–5 pairs with distinct sides', () => {
  assert.ok(errsOf({ ...order, items: ['a', 'b'] }).length);
  assert.ok(errsOf({ ...order, items: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] }).length);
  assert.ok(errsOf({ ...order, items: ['a', 'b', 'a'] }).length);
  assert.ok(errsOf({ ...match, pairs: [['a', 'b'], ['c', 'd']] }).length);
  assert.ok(errsOf({ ...match, pairs: [['a', 'b'], ['a', 'd'], ['e', 'f']] }).length, 'left twice');
  assert.ok(errsOf({ ...match, pairs: [['a', 'b'], ['c', 'b'], ['e', 'f']] }).length, 'right twice');
  assert.ok(errsOf({ ...match, pairs: [['a', 'b'], ['c'], ['e', 'f']] }).length);
  assert.deepEqual(errsOf({ ...match, pairs: [...match.pairs, ['l4', 'r4'], ['l5', 'r5']] }), []);
});

test('parity: the same kind per slot, and the key shape per kind', () => {
  const e = (a, b) => { const o = []; checkKindParity(a, b, 'x', o); return o; };
  assert.deepEqual(e(best, { ...best }), []);
  assert.ok(e(mc, best).some((x) => /kind differs/.test(x)));
  assert.ok(e(best, { ...best, close: 'd' }).some((x) => /runner-up/.test(x)));
  assert.deepEqual(e(all, { ...all, answers: ['d', 'a', 'c'] }), [], 'order of keys is free');
  assert.ok(e(all, { ...all, answers: ['a', 'b', 'c'] }).some((x) => /positions/.test(x)));
  assert.ok(e(order, { ...order, items: ['a', 'b', 'c'] }).some((x) => /item counts/.test(x)));
  assert.ok(e(match, { ...match, pairs: match.pairs.slice(0, 2) }).some((x) => /pair counts/.test(x)));
  assert.deepEqual(e(gap, { ...gap, accept: ['critical'] }), [], 'gap accept lists are free per language');
  assert.ok(e(gap, { ...gap, choices: ['kritieke', 'a', 'b', 'c'] }).some((x) => /word bank/.test(x)));
});

test('parity: validateModule reports a kind that differs between en and nl', async () => {
  const meta = MODULES.find((m) => m.id === 'eng.flow');
  const en = JSON.parse(JSON.stringify(await loadModule(meta.subject, meta.id, 'en')));
  const nl = JSON.parse(JSON.stringify(await loadModule(meta.subject, meta.id, 'nl')));
  assert.deepEqual(validateModule(en, nl, meta), []);
  const at = nl.lessons[0].recall.findIndex((x) => !('number' in x));
  const q = nl.lessons[0].recall[at];
  nl.lessons[0].recall[at] = { ...q, kind: 'best', close: q.options.find((o) => o !== q.answer), q: `${q.q} (de beste)` };
  const errs = validateModule(en, nl, meta);
  assert.ok(errs.some((x) => new RegExp(`recall ${at}: kind differs`).test(x)), errs.join('\n'));
});

test('select-all keys: not every item in a module may have the same number of keys', () => {
  const run = (qs) => { const o = []; checkSelectAllSpread([{ recall: qs }], 'nl', o); return o; };
  assert.equal(run([all, { ...all, answers: ['b', 'c', 'e'] }]).length, 1);
  assert.equal(run([all, { ...all, answers: ['b', 'c'] }]).length, 0);
  assert.equal(run([all]).length, 0);
});

test('judge: mc, best and num are unchanged', () => {
  assert.equal(judge(mc, 'b'), true);
  assert.equal(judge(mc, 'a'), false);
  assert.equal(judge(best, 'b'), true);
  assert.equal(judge(best, 'c'), false, 'the runner-up is not the answer');
  const n = { q: 'n', number: 1.4, tolerance: 0.01, unit: '€', why: 'w' };
  assert.equal(judge(n, '1,4'), true);
  assert.equal(judge(n, '1.45'), false);
  assert.equal(judge(n, ''), false);
  assert.equal(courseJudge(n, '1,4'), true, 'course.js delegates');
  assert.equal(courseJudge(null, 'x'), false);
});

test('judge, all: set equality, in any order; the grade says how many were right', () => {
  assert.equal(SELECT_ALL_PROGRESS, 'full', 'Q10 recommended option A');
  assert.equal(judge(all, ['d', 'a', 'c']), true);
  assert.equal(judge(all, ['a', 'c']), false);
  assert.equal(judge(all, ['a', 'c', 'd', 'e']), false);
  assert.equal(judge(all, []), false);
  assert.equal(judge(all, null), false);
  assert.deepEqual(grade(all, ['a', 'c', 'e']), { kind: 'all', ok: false, exact: false, right: 2, wrong: 1, missed: 1, total: 3 });
  assert.equal(grade(all, ['a', 'c', 'd']).exact, true);
});

test('normalizeWord and editDistance', () => {
  assert.equal(normalizeWord('  Kritieké!  '), 'kritieke');
  assert.equal(normalizeWord('Over-all,  pad.'), 'over all pad');
  assert.equal(editDistance('kritieke', 'kritiek'), 1);
  assert.equal(editDistance('abc', 'abc'), 0);
  assert.equal(editDistance('abc', 'xyz'), 3);
});

test('judge, gap: normalised equality, any accepted word, one typo from six letters up', () => {
  assert.equal(judge(gap, 'kritieke'), true);
  assert.equal(judge(gap, '  Kritieke. '), true);
  assert.equal(judge(gap, 'kritiek'), true, 'second accepted word');
  assert.equal(judge(gap, 'kritieké'), true, 'diacritics folded');
  assert.deepEqual(grade(gap, 'kritieke'), { kind: 'gap', ok: true, typo: false, spelled: 'kritieke' });
  // one typo: accepted and flagged, with the accepted spelling
  assert.deepEqual(grade(gap, 'kraiteke'), { kind: 'gap', ok: false, typo: false, spelled: null }, 'two letters off');
  assert.deepEqual(grade(gap, 'kritiekee'), { kind: 'gap', ok: true, typo: true, spelled: 'kritieke' });
  assert.deepEqual(grade(gap, 'kritieka'), { kind: 'gap', ok: true, typo: true, spelled: 'kritieke' });
  assert.equal(judge(gap, 'pad'), false);
  assert.equal(judge(gap, ''), false);
  assert.equal(judge(gap, null), false);
});

test('judge, gap: no typo allowance for words under six letters', () => {
  const short = { kind: 'gap', q: 'q', text: 'Het ___ is gezond.', accept: ['takt'], why: 'w' };
  assert.equal(judge(short, 'takt'), true);
  assert.equal(judge(short, 'tact'), false);
  const five = { ...short, accept: ['pareto'] };
  assert.equal(judge(five, 'pareta'), true, 'six letters: one typo is fine');
  assert.equal(judge({ ...short, accept: ['kanban'] }, 'kanbaan'), true);
  assert.equal(judge({ ...short, accept: ['waste'] }, 'wasta'), false, 'five letters');
});

test('judge, order: only the exact order is right; the grade marks the places that are wrong', () => {
  assert.equal(judge(order, ['d', 'm', 'a', 'i', 'c']), true);
  assert.equal(judge(order, ['m', 'd', 'a', 'i', 'c']), false);
  assert.deepEqual(grade(order, ['m', 'd', 'a', 'i', 'c']).wrongAt, [0, 1]);
  assert.deepEqual(grade(order, ['d', 'm']).wrongAt, [2, 3, 4], 'unplaced counts as wrong');
  assert.equal(judge(order, ['d', 'm']), false);
  assert.equal(judge(order, null), false);
});

test('judge, match: every pair right; the grade lists the left items paired wrongly', () => {
  assert.equal(judge(match, [['l1', 'r1'], ['l2', 'r2'], ['l3', 'r3']]), true);
  assert.equal(judge(match, [['l3', 'r3'], ['l1', 'r1'], ['l2', 'r2']]), true, 'any order');
  assert.equal(judge(match, { l1: 'r1', l2: 'r2', l3: 'r3' }), true, 'a map works too');
  const g = grade(match, [['l1', 'r2'], ['l2', 'r1'], ['l3', 'r3']]);
  assert.equal(g.ok, false);
  assert.deepEqual(g.wrongLeft, ['l1', 'l2']);
  assert.deepEqual(grade(match, [['l1', 'r1']]).wrongLeft, ['l2', 'l3']);
  assert.equal(judge(match, null), false);
});

test('shuffled: stable per seed, same items, never the solved order', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];
  assert.deepEqual(shuffled(items, 's'), shuffled(items, 's'));
  assert.deepEqual([...shuffled(items, 's')].sort(), items);
  assert.notDeepEqual(shuffled(items, 's'), items);
  for (let i = 0; i < 200; i++) assert.notDeepEqual(shuffled(['x', 'y', 'z'], `seed${i}`), ['x', 'y', 'z']);
  assert.deepEqual(shuffled(['only'], 's'), ['only']);
});

test('review texts: the right answer and his answer, per kind', () => {
  assert.equal(answerText(mc), 'b');
  assert.equal(answerText(best), 'b');
  assert.equal(answerText({ q: 'n', number: 1.4, tolerance: 0.1, unit: '€', why: 'w' }), '1.4 €');
  assert.equal(answerText(all), 'a · c · d');
  assert.equal(answerText(gap), 'De langste keten heet het kritieke pad.');
  assert.equal(answerText(order), '1. d 2. m 3. a 4. i 5. c');
  assert.equal(answerText(match), 'l1 → r1 · l2 → r2 · l3 → r3');
  assert.equal(valueText(all, ['a', 'e']), 'a · e');
  assert.equal(valueText(all, []), '—');
  assert.equal(valueText(gap, 'kritiek'), 'kritiek');
  assert.equal(valueText(order, ['m', 'd']), '1. m 2. d');
  assert.equal(valueText(match, [['l1', 'r2']]), 'l1 → r2');
  assert.equal(valueText(mc, null), null);
});

test('course: the guess comparison works for the old and the new kinds', () => {
  const g = guessCompare({ ...mc, guess: 'a' }, 'b');
  assert.deepEqual(g, { guess: 'a', now: 'b', answer: 'b', guessOk: false, nowOk: true });
  const n = guessCompare({ q: 'n', number: 2, tolerance: 0.1, unit: 'm', why: 'w', guess: '3' }, '2');
  assert.deepEqual(n, { guess: '3 m', now: '2 m', answer: '2 m', guessOk: false, nowOk: true });
  assert.equal(guessCompare({ ...all, guess: ['a'] }, ['a', 'c', 'd']).nowOk, true);
});

test('quiz flow: the new kinds go through answerQuiz and the retry pass', () => {
  const qs = [{ ...all, id: 'x#r0' }, { ...gap, id: 'x#r1' }, { ...order, id: 'x#r2' }, { ...match, id: 'x#r3' }, { ...best, id: 'x#r4' }];
  let st = startQuiz(qs);
  st = answerQuiz(st, qs, ['a', 'c']); // wrong
  st = answerQuiz(st, qs, 'kritieke');
  st = answerQuiz(st, qs, ['d', 'm', 'a', 'i', 'c']);
  st = answerQuiz(st, qs, [['l1', 'r1'], ['l2', 'r2'], ['l3', 'r3']]);
  st = answerQuiz(st, qs, 'c'); // the runner-up: wrong
  assert.equal(st.phase, 'review');
  assert.deepEqual(st.firstTry, { 'x#r0': false, 'x#r1': true, 'x#r2': true, 'x#r3': true, 'x#r4': false });
  assert.deepEqual(st.misses, [0, 4]);
});

test('existing content has no kind and judges as before', async () => {
  const meta = MODULES.find((m) => m.id === 'eng.flow');
  const mod = await loadModule(meta.subject, meta.id, 'en');
  for (const l of mod.lessons) for (const q of l.recall) {
    assert.ok(!('kind' in q));
    if (!('number' in q)) { assert.equal(judge(q, q.answer), true); assert.equal(judge(q, 'zzz'), false); }
  }
});

test('the SHELL lists the new source file', () => {
  const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  assert.ok(sw.includes("'src/core/questionkinds.js'"));
});

test('renderer parts: select-all toggles in option order', async () => {
  const { toggleOption } = await import('../src/core/questionkinds.js');
  const o = ['a', 'b', 'c', 'd'];
  assert.deepEqual(toggleOption(o, [], 'c'), ['c']);
  assert.deepEqual(toggleOption(o, ['c'], 'a'), ['a', 'c']);
  assert.deepEqual(toggleOption(o, ['a', 'c'], 'c'), ['a']);
});

test('renderer parts: order places in turn, takes one back, keeps the hint’s item', async () => {
  const { orderPlace, orderTake, orderLockFirst } = await import('../src/core/questionkinds.js');
  let p = [];
  p = orderPlace(p, 'x', 3);
  p = orderPlace(p, 'y', 3);
  p = orderPlace(p, 'y', 3);
  assert.deepEqual(p, ['x', 'y'], 'an item is placed once');
  p = orderPlace(p, 'z', 3);
  assert.deepEqual(orderPlace(p, 'w', 3), p, 'no more slots than items');
  assert.deepEqual(orderTake(p, 1), ['x', 'z'], 'later items move up');
  assert.deepEqual(orderTake(p, 0, 1), p, 'a locked slot stays');
  assert.deepEqual(orderTake(p, 9), p);
  assert.deepEqual(orderLockFirst(['y', 'x', 'z'], 'x'), ['x', 'y', 'z']);
  assert.deepEqual(orderLockFirst([], 'x'), ['x']);
  assert.equal(judge({ kind: 'order', items: ['x', 'y', 'z'] }, orderLockFirst(['y', 'z'], 'x')), true);
});

test('renderer parts: match pairs by tapping left then right, undo by tapping a pair, the hint’s pair stays', async () => {
  const { matchStart, matchTap, matchLockPair } = await import('../src/core/questionkinds.js');
  let s = matchStart();
  s = matchTap(s, 'right', 'r1');
  assert.deepEqual(s.pairs, [], 'a right item alone does nothing');
  s = matchTap(s, 'left', 'l1');
  assert.equal(s.left, 'l1');
  s = matchTap(s, 'left', 'l1');
  assert.equal(s.left, null, 'tapping the selected one again deselects');
  s = matchTap(matchTap(s, 'left', 'l1'), 'right', 'r2');
  assert.deepEqual(s.pairs, [['l1', 'r2']]);
  assert.equal(s.left, null);
  s = matchTap(s, 'right', 'r2');
  assert.deepEqual(s.pairs, [], 'tap a paired item to undo');
  s = matchLockPair(matchTap(matchTap(s, 'left', 'l2'), 'right', 'r1'), 'l1', 'r1');
  assert.deepEqual(s.pairs, [['l1', 'r1']], 'the hint replaces a pair that used its right side');
  assert.equal(s.locked, 1);
  assert.deepEqual(matchTap(s, 'left', 'l1').pairs, s.pairs, 'a locked pair cannot be undone');
  assert.deepEqual(matchTap(s, 'right', 'r1'), s);
});
