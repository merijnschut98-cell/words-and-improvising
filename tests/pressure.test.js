import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pressureChecks } from '../src/core/pressure.js';
import { makePrompt, seededRng } from '../src/core/lesson.js';
import { drillTiming, CUED_DRILLS, DRILLS } from '../src/core/progress.js';
import en from '../src/content/prompts.en.js';
import nl from '../src/content/prompts.nl.js';

test('pressure pools: parallel, at least 30, opening and interrupt filled', () => {
  assert.deepEqual(en.pressure.map((x) => x.id), nl.pressure.map((x) => x.id));
  for (const c of [en, nl]) {
    assert.ok(c.pressure.length >= 30);
    for (const p of c.pressure) assert.ok(p.opening && p.interrupt, p.id);
  }
});

test('pressure prompt: speaks the opening, interrupts after 12–18 s, then 20 s to answer', () => {
  for (let seed = 1; seed < 20; seed++) {
    const p = makePrompt('pressure', nl, seededRng(seed));
    const item = nl.pressure.find((x) => `pressure:${x.id}` === p.id);
    assert.deepEqual(p.extra.cues, [item.opening, item.interrupt]);
    assert.ok(p.extra.itemS[0] >= 12 && p.extra.itemS[0] <= 18);
    assert.equal(p.extra.itemS[1], 20);
  }
  assert.deepEqual(drillTiming('pressure', 3), { prepS: 0, answerS: 20, questions: 2 });
  assert.ok(DRILLS.includes('pressure') && CUED_DRILLS.includes('pressure'));
});

test('checklist: acknowledged, kept it short, checked back (English)', () => {
  assert.deepEqual(pressureChecks('fair point the short answer is yes because it saves two hours a week does that help', 'en'),
    { acknowledged: true, short: true, checkedBack: true });
  assert.deepEqual(pressureChecks('well I think that there are many things to consider here', 'en'),
    { acknowledged: false, short: true, checkedBack: false });
  const long = Array.from({ length: 70 }, () => 'word').join(' ');
  assert.equal(pressureChecks(long, 'en').short, false);
});

test('checklist in Dutch, and an empty answer passes nothing', () => {
  assert.deepEqual(pressureChecks('terecht punt het korte antwoord is ja want het scheelt twee uur per week klopt dat voor jou', 'nl'),
    { acknowledged: true, short: true, checkedBack: true });
  assert.deepEqual(pressureChecks('', 'nl'), { acknowledged: false, short: false, checkedBack: false });
});
