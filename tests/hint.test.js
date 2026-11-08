import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionHint, containsAnswer } from '../src/core/hint.js';
import { MODULES, loadModule } from '../src/content/courses/index.js';
import { recallQuestions } from '../src/core/course.js';

const terms = [{ term: 'Takt', def: 'The pace a line must keep: available time divided by the number needed.' }, { term: 'WIP', def: 'Work in progress.' }];
const choice = { id: 'eng.flow.takt#r0', q: 'The takt of a line is set by what?', options: ['Customer demand', 'The fastest machine', 'Shift length only', 'Customer demand per week'], answer: 'Customer demand', why: 'w' };
const num = { id: 'eng.cost.costprice#r0', q: 'A setup takes 3 hours at €70 per hour. The batch is 150. Setup cost per piece?', number: 1.4, tolerance: 0.01, unit: '€', why: '3 × €70 = €210; €210 / 150 = €1.40 per piece.' };

test('hint, choice: strikes one wrong option and gives the definition of a term in the question', () => {
  const h = questionHint(choice, terms);
  assert.equal(h.kind, 'choice');
  assert.ok(choice.options.includes(h.strike));
  assert.notEqual(h.strike, choice.answer);
  assert.deepEqual(h.term, { term: 'Takt', def: terms[0].def });
});

test('hint, choice: the struck option is the one least like the answer, and the same every time', () => {
  // "Customer demand per week" shares words with the answer: it is not the clearly wrong one.
  const h = questionHint(choice, terms);
  assert.notEqual(h.strike, 'Customer demand per week');
  assert.deepEqual(questionHint(choice, terms), h);
  assert.deepEqual(questionHint({ ...choice }, terms.slice()), h, 'pure: same input, same hint');
});

test('hint, choice: never strikes the answer, whatever its position', () => {
  for (let i = 0; i < 4; i++) {
    for (const id of ['a#r0', 'b#r1', 'c#r2', 'd#r3', 'e#r4']) {
      const q = { ...choice, id, answer: choice.options[i] };
      assert.notEqual(questionHint(q, terms).strike, q.answer);
    }
  }
});

test('hint, choice: no term in the question gives no definition; a definition that names the answer is left out', () => {
  assert.equal(questionHint({ ...choice, q: 'Which one?' }, terms).term, null);
  assert.equal(questionHint(choice, []).term, null);
  const leaky = [{ term: 'Takt', def: 'Set by customer demand.' }];
  assert.equal(questionHint(choice, leaky).term, null);
});

test('hint, number: the first step and the unit, never the answer', () => {
  const h = questionHint(num, terms);
  assert.equal(h.kind, 'number');
  assert.equal(h.step, '3 × €70 = €210');
  assert.equal(h.unit, '€');
  assert.equal(containsAnswer(num, h.step), false);
});

test('hint, number: a first step that already gives the answer keeps only the sum', () => {
  const q = { ...num, number: 60, tolerance: 0.5, unit: 's', why: 'Takt = 27000 / 450 = 60 s. So the line must make one every minute.' };
  const h = questionHint(q, terms);
  assert.equal(h.step, 'Takt = 27000 / 450 = ?');
  assert.equal(containsAnswer(q, h.step), false);
  const bare = { ...num, number: 3, tolerance: 0.1, why: '3 is the answer.' };
  assert.equal(questionHint(bare, terms).step, null, 'nothing left to show but the unit');
  assert.equal(questionHint({ ...num, unit: '' }, terms).unit, null);
});

test('hint, number: a chain of sums is cut back to its formula', () => {
  const chain = { ...num, number: 36.6, tolerance: 0.5, unit: 'min', why: '15 × (200 / 160)⁴ = 15 × 1,25⁴ = 15 × 2,44 = 36,6 minutes.' };
  assert.equal(questionHint(chain, terms).step, '15 × (200 / 160)⁴ = ?');
  const named = { ...num, number: 7, tolerance: 0.1, unit: 'bar', why: 'Absolute = gauge + atmospheric = 6 + 1 = 7 bar.' };
  assert.equal(questionHint(named, terms).step, 'Absolute = gauge + atmospheric = ?');
});

test('hint, number: with no step to show, the term in the question stands in', () => {
  const q = { ...num, q: 'What is the takt in seconds?', why: 'Because it is.', unit: 's' };
  const h = questionHint(q, terms);
  assert.equal(h.step, null);
  assert.equal(h.term.term, 'Takt');
  assert.equal(questionHint(num, terms).term, null, 'a step is enough');
});

test('hint: the question’s own hint wins', () => {
  assert.deepEqual(questionHint({ ...choice, hint: 'Think of the customer.' }, terms), { kind: 'own', text: 'Think of the customer.' });
  assert.deepEqual(questionHint({ ...num, hint: 'Cost per setup first.' }, terms), { kind: 'own', text: 'Cost per setup first.' });
});

test('containsAnswer: choice by text, number by value in either decimal style', () => {
  assert.equal(containsAnswer(choice, 'Think of customer demand.'), true);
  assert.equal(containsAnswer(choice, 'Think of the customer.'), false);
  assert.equal(containsAnswer(num, 'about 1,40'), true);
  assert.equal(containsAnswer(num, 'about 1.4 euro'), true);
  assert.equal(containsAnswer(num, '3 × 70'), false);
  assert.equal(containsAnswer({ ...num, number: 8264, tolerance: 1 }, 'about 8.264'), true, 'Dutch thousands');
});

test('content: every recall question gets a hint, and no hint contains its answer', async () => {
  for (const m of MODULES) {
    for (const lang of ['en', 'nl']) {
      const mod = await loadModule(m.subject, m.id, lang);
      for (const l of mod.lessons) {
        for (const q of recallQuestions(l)) {
          const h = questionHint(q, l.terms || []);
          assert.ok(h, `${q.id} ${lang}: no hint`);
          if (h.kind === 'choice') assert.notEqual(h.strike, q.answer, `${q.id} ${lang}`);
          if (h.kind === 'number' && h.step) assert.equal(containsAnswer(q, h.step), false, `${q.id} ${lang}: ${h.step}`);
          if (h.kind === 'number') assert.ok(h.step || h.unit || h.term, `${q.id} ${lang}: empty number hint`);
          if (h.term) assert.equal(containsAnswer(q, h.term.def), false, `${q.id} ${lang}`);
          if (h.kind === 'own') assert.equal(containsAnswer(q, h.text), false, `${q.id} ${lang}`);
        }
      }
    }
  }
});
