import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkFollowUp } from '../src/core/followup.js';
import { makePrompt, seededRng } from '../src/core/lesson.js';
import { drillTiming, CUED_DRILLS, DRILLS } from '../src/core/progress.js';
import en from '../src/content/prompts.en.js';
import nl from '../src/content/prompts.nl.js';

test('detects a question and the detail in English', () => {
  assert.deepEqual(checkFollowUp('which cave did they like most', ['ardennes', 'caves'], 'en'), { asked: true, usedDetail: true });
  assert.deepEqual(checkFollowUp('did you stay in a cabin', ['ardennes', 'caves'], 'en'), { asked: true, usedDetail: false });
  assert.deepEqual(checkFollowUp('nice I love the ardennes too', ['ardennes', 'caves'], 'en'), { asked: false, usedDetail: true });
});

test('detects a question and the detail in Dutch', () => {
  assert.deepEqual(checkFollowUp('welke grot vonden ze het mooist', ['ardennen', 'grotten'], 'nl'), { asked: true, usedDetail: true });
  assert.deepEqual(checkFollowUp('hebben jullie gekampeerd in de ardennen', ['ardennen', 'grotten'], 'nl'), { asked: true, usedDetail: true });
  assert.deepEqual(checkFollowUp('leuk zeg', ['ardennen', 'grotten'], 'nl'), { asked: false, usedDetail: false });
  // A typed question mark counts too.
  assert.equal(checkFollowUp('en de kinderen?', ['grotten'], 'nl').asked, true);
});

test('follow-up pools are parallel and every detail word is in its line', () => {
  assert.deepEqual(en.followUps.map((x) => x.id), nl.followUps.map((x) => x.id));
  for (const c of [en, nl]) {
    assert.ok(c.followUps.length >= 30);
    for (const it of c.followUps) for (const d of it.detail) assert.ok(it.text.toLowerCase().includes(d), `${it.id} ${d}`);
  }
});

test('follow-up drill: one spoken line, 20 s answer, carries the detail', () => {
  const p = makePrompt('followUp', en, seededRng(4));
  assert.equal(p.extra.cues.length, 1);
  assert.ok(p.extra.detail.length >= 1);
  assert.deepEqual(drillTiming('followUp', 3), { prepS: 0, answerS: 20, questions: 1 });
  assert.ok(CUED_DRILLS.includes('followUp') && DRILLS.includes('followUp'));
});
