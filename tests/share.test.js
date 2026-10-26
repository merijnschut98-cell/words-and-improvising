import { test } from 'node:test';
import assert from 'node:assert/strict';
import { challengeLink, parseChallenge, challengePrompt } from '../src/core/share.js';
import { makePrompt, seededRng } from '../src/core/lesson.js';
import en from '../src/content/prompts.en.js';
import nl from '../src/content/prompts.nl.js';

const BASE = 'https://example.org/app/';

test('link round-trips drill, prompt id and language', () => {
  const url = challengeLink({ drill: 'prep', id: 'opinion:o07' }, 'nl', BASE);
  assert.ok(url.startsWith(BASE));
  const parsed = parseChallenge(new URL(url).search);
  assert.deepEqual(parsed, { drill: 'prep', promptId: 'opinion:o07', lang: 'nl' });
});

test('malformed or unknown links are rejected', () => {
  for (const q of ['', '?x=1', '?c=', '?c=prep.opinion:o07', '?c=nope.opinion:o07.nl', '?c=prep.opinion:o07.fr',
    '?c=prep.<script>.nl', '?c=prep.opinion:o07.nl.extra']) {
    assert.equal(parseChallenge(q), null, q);
  }
});

test('challengePrompt rebuilds the same main item, deterministically', () => {
  for (const drill of ['minute', 'explain', 'prep', 'bridge', 'smalltalk', 'rapid', 'story', 'pause', 'debate', 'yesAnd', 'listen', 'expert', 'boss', 'frame']) {
    const original = makePrompt(drill, en, seededRng(11));
    const a = challengePrompt({ drill, promptId: original.id }, en);
    const b = challengePrompt({ drill, promptId: original.id }, en);
    assert.equal(a.id, original.id, drill);
    assert.equal(a.body, original.body, drill);
    assert.deepEqual(a, b, drill);
  }
});

test('challengePrompt rejects unknown ids and drill/pool mismatches', () => {
  assert.equal(challengePrompt({ drill: 'prep', promptId: 'opinion:zz99' }, nl), null);
  assert.equal(challengePrompt({ drill: 'minute', promptId: 'opinion:o01' }, nl), null);
});
