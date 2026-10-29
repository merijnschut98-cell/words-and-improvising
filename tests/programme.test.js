import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROGRAMME, startProgramme, programmeWeek, programmeFocus, baselineDue } from '../src/core/programme.js';
import { todayPick } from '../src/core/today.js';
import { weekFocus } from '../src/core/weekly.js';
import { defaultState } from '../src/core/storage.js';
import { seededRng } from '../src/core/lesson.js';
import { DRILLS } from '../src/core/progress.js';
import nl from '../src/content/prompts.nl.js';

const START = '2026-10-29';
const dayAt = (n) => { const d = new Date(2026, 9, 29 + n, 9); return [d.toISOString().slice(0, 10), d.getTime()]; };
const started = () => startProgramme(defaultState(), START, nl, 'nl', seededRng(1));

test('four themes, each with three existing drills', () => {
  assert.equal(PROGRAMME.length, 4);
  for (const w of PROGRAMME) {
    assert.equal(w.drills.length, 3);
    for (const d of w.drills) assert.ok(DRILLS.includes(d), d);
  }
});

test('starting stores the start day and a baseline prompt', () => {
  const s = started();
  assert.equal(s.programme.start, START);
  assert.ok(s.programme.baseline.promptId && s.programme.baseline.drill && s.programme.baseline.lang === 'nl');
});

test('week index from the start date; done after four weeks', () => {
  const s = started();
  assert.equal(programmeWeek(s, START), 1);
  assert.equal(programmeWeek(s, '2026-11-05'), 2);
  assert.equal(programmeWeek(s, '2026-11-25'), 4);
  assert.equal(programmeWeek(s, '2026-11-26'), null);
  assert.equal(programmeWeek(defaultState(), START), null);
});

test('the programme sets the week focus unless he chose one himself', () => {
  const s = started();
  assert.equal(programmeFocus(s, '2026-11-05'), PROGRAMME[1].drills[0]);
  const [, ts] = dayAt(7);
  assert.equal(weekFocus(s, new Date(ts)), PROGRAMME[1].drills[0]);
});

test('in week 4 the baseline re-take is offered until he has done it', () => {
  const s = started();
  assert.equal(baselineDue(s, '2026-11-10'), false); // week 2
  assert.equal(baselineDue(s, '2026-11-20'), true); // week 4
  const pick = todayPick(s, '2026-11-20', nl, 'nl', new Date(2026, 10, 20, 9).getTime());
  assert.equal(pick.reason, 'baseline');
  assert.equal(pick.prompt.id, s.programme.baseline.promptId);
  const done = { ...s, history: [{ ts: new Date(2026, 10, 19, 9).getTime(), drill: s.programme.baseline.drill, promptId: s.programme.baseline.promptId, lang: 'nl', metrics: { words: 50 } }] };
  assert.equal(baselineDue(done, '2026-11-20'), false);
});
