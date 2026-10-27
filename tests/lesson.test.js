import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makePrompt, buildLesson, seededRng, weakestDrill } from '../src/core/lesson.js';
import { DRILLS, drillTiming } from '../src/core/progress.js';
import en from '../src/content/prompts.en.js';
import nl from '../src/content/prompts.nl.js';


test('lesson has 3 distinct drills', () => {
  for (let s = 1; s < 20; s++) {
    const lesson = buildLesson(en, seededRng(s), {});
    assert.equal(lesson.length, 3);
    assert.equal(new Set(lesson.map((p) => p.drill)).size, 3);
  }
});

test('every drill produces a prompt with body and seenIds', () => {
  for (const d of DRILLS) {
    const p = makePrompt(d, nl, seededRng(3), {});
    assert.equal(p.drill, d);
    assert.ok(p.body.length > 0, d);
    assert.ok(p.seenIds.length > 0, d);
  }
});

test('bridge has 3 distinct words', () => {
  const p = makePrompt('bridge', en, seededRng(7), {});
  assert.equal(new Set(p.extra.words).size, 3);
});

test('rapid has 5 distinct questions', () => {
  const p = makePrompt('rapid', en, seededRng(7), {});
  assert.equal(p.extra.questions.length, 5);
  assert.equal(new Set(p.extra.questions).size, 5);
});

test('prefers unseen prompts', () => {
  const seen = Object.fromEntries(en.opinions.map((o, i) => [`opinion:${o.id}`, 1000 + i]));
  delete seen['opinion:o17'];
  for (let s = 1; s < 10; s++) {
    assert.equal(makePrompt('prep', en, seededRng(s), seen).body, en.opinions.find((o) => o.id === 'o17').text);
  }
});

test('when all seen, picks the oldest', () => {
  const seen = Object.fromEntries(en.opinions.map((o, i) => [`opinion:${o.id}`, 1000 + i]));
  seen['opinion:o09'] = 1;
  assert.equal(makePrompt('prep', en, seededRng(2), seen).body, en.opinions.find((o) => o.id === 'o09').text);
});

test('language files are parallel and large enough', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(nl).sort());
  for (const key of ['topics', 'concepts', 'opinions', 'scenarios', 'rapid']) {
    assert.ok(en[key].length >= 40, `en.${key}`);
    assert.deepEqual(en[key].map((x) => x.id), nl[key].map((x) => x.id), key);
  }
  assert.ok(en.audiences.length >= 10 && nl.audiences.length === en.audiences.length);
  assert.ok(en.words.length >= 80 && nl.words.length >= 80);
});

test('story prompt has an opening and 8 distinct twists', () => {
  const p = makePrompt('story', nl, seededRng(5), {});
  assert.ok(p.body.length > 10);
  assert.equal(p.extra.twists.length, 8);
  assert.equal(new Set(p.extra.twists).size, 8);
  assert.ok(nl.storyStarts.length >= 25 && en.storyStarts.length >= 25);
  assert.ok(nl.twists.length >= 30 && en.twists.length >= 30);
  assert.deepEqual(en.storyStarts.map((x) => x.id), nl.storyStarts.map((x) => x.id));
});

test('debate prompt comes from the opinions pool', () => {
  const p = makePrompt('debate', en, seededRng(4), {});
  assert.ok(en.opinions.some((o) => o.text === p.body));
  assert.match(p.seenIds[0], /^opinion:/);
});

test('TTS drill pools are parallel and large enough', () => {
  const sizes = { yesAnd: 30, listen: 30, experts: 30, expertQuestions: 20 };
  for (const [pool, min] of Object.entries(sizes)) {
    for (const c of [en, nl]) assert.ok(c[pool] && c[pool].length >= min, `${pool} >= ${min}`);
    assert.deepEqual(en[pool].map((x) => x.id), nl[pool].map((x) => x.id), `${pool} ids parallel`);
  }
  for (const c of [en, nl]) for (const l of c.listen) assert.ok(l.statement && l.question, l.id);
});

test('yesAnd prompt carries 3 distinct lines to speak', () => {
  const p = makePrompt('yesAnd', en, seededRng(4));
  assert.equal(p.extra.cues.length, 3);
  assert.equal(new Set(p.extra.cues).size, 3);
  assert.equal(p.seenIds.length, 3);
});

test('listen prompt speaks the statement then the question', () => {
  const p = makePrompt('listen', nl, seededRng(5));
  const item = nl.listen.find((l) => `listen:${l.id}` === p.id);
  assert.equal(p.extra.statement, item.statement);
  assert.equal(p.extra.question, item.question);
  assert.deepEqual(p.extra.cues, [`${item.statement} ${item.question}`]);
});

test('expert prompt has a topic and 5 distinct questions', () => {
  const p = makePrompt('expert', en, seededRng(6));
  assert.ok(p.body.length > 0);
  assert.equal(p.extra.cues.length, 5);
  assert.equal(new Set(p.extra.cues).size, 5);
});

test('TTS drill timing table', () => {
  assert.deepEqual(drillTiming('yesAnd', 4), { prepS: 0, answerS: 15, questions: 3 });
  assert.deepEqual(drillTiming('listen', 1), { prepS: 0, answerS: 45, questions: 1 });
  assert.deepEqual(drillTiming('expert', 2), { prepS: 0, answerS: 12, questions: 5 });
  for (const d of ['yesAnd', 'listen', 'expert']) assert.ok(DRILLS.includes(d));
});

const h = (drill, rating, fillerRate = 2) => ({ drill, rating, coach: null, metrics: { words: 50, fillerRate } });

test('adaptive lesson with no history: 3 distinct drills, none marked weak', () => {
  const ls = buildLesson(en, seededRng(1), {}, { history: [], due: [] });
  assert.equal(new Set(ls.map((p) => p.drill)).size, 3);
  assert.ok(!ls.some((p) => p.reason === 'weak'));
});

test('weakestDrill needs 2 rounds and picks the lowest-rated drill', () => {
  assert.equal(weakestDrill([h('debate', 1)]), null);
  assert.equal(weakestDrill([h('debate', 2), h('debate', 1), h('minute', 5), h('minute', 4)]), 'debate');
  // Same rating: more fillers is weaker.
  assert.equal(weakestDrill([h('prep', 3, 1), h('prep', 3, 1), h('story', 3, 6), h('story', 3, 6)]), 'story');
});

test('adaptive lesson includes the weakest drill and a due review', () => {
  const history = [h('debate', 1), h('debate', 2), h('minute', 5), h('minute', 5)];
  const review = makePrompt('prep', en, seededRng(9));
  for (let seed = 1; seed < 20; seed++) {
    const ls = buildLesson(en, seededRng(seed), {}, { history, due: [review] });
    assert.equal(ls.length, 3);
    assert.equal(new Set(ls.map((p) => p.drill)).size, 3);
    assert.equal(ls.find((p) => p.reason === 'weak').drill, 'debate');
    assert.equal(ls.find((p) => p.reason === 'review').id, review.id);
  }
});

test('a due review in the weakest drill is skipped for a stale drill instead', () => {
  const history = [h('prep', 1), h('prep', 1)];
  const review = makePrompt('prep', en, seededRng(9));
  const ls = buildLesson(en, seededRng(2), {}, { history, due: [review] });
  assert.equal(new Set(ls.map((p) => p.drill)).size, 3);
  assert.ok(!ls.some((p) => p.reason === 'review'));
  assert.ok(ls.some((p) => p.reason === 'stale'));
});

const FRAME_IDS = ['prep', 'star', 'wsn', 'psb', 'ppf', 'answer'];

test('frames pool: parallel, sized, every prompt tagged with a known frame', () => {
  for (const c of [en, nl]) {
    assert.ok(c.frames.length >= 30);
    for (const f of c.frames) assert.ok(FRAME_IDS.includes(f.frame), f.id);
  }
  assert.deepEqual(en.frames.map((f) => [f.id, f.frame]), nl.frames.map((f) => [f.id, f.frame]));
});

test('frame prompt carries its frame and 3 distinct options including the right one', () => {
  for (let seed = 1; seed < 15; seed++) {
    const p = makePrompt('frame', nl, seededRng(seed));
    const item = nl.frames.find((f) => `frame:${f.id}` === p.id);
    assert.equal(p.extra.frame, item.frame);
    assert.equal(p.extra.options.length, 3);
    assert.equal(new Set(p.extra.options).size, 3);
    assert.ok(p.extra.options.includes(item.frame));
    assert.ok(DRILLS.includes('frame'));
  }
});

test('captain and work pools: parallel, sized, captain constraints valid', () => {
  for (const c of [en, nl]) {
    assert.ok(c.captain.length >= 20 && c.work.length >= 20);
    for (const it of c.captain) assert.ok(['sbi', 'oneSentence', 'pep'].includes(it.constraint), it.id);
  }
  assert.deepEqual(en.captain.map((x) => [x.id, x.constraint]), nl.captain.map((x) => [x.id, x.constraint]));
  assert.deepEqual(en.work.map((x) => x.id), nl.work.map((x) => x.id));
});

test('real-life prompt comes from captain or work and carries its kind and constraint', () => {
  const kinds = new Set();
  for (let seed = 1; seed < 30; seed++) {
    const p = makePrompt('real', nl, seededRng(seed));
    kinds.add(p.extra.kind);
    if (p.extra.kind === 'captain') {
      const it = nl.captain.find((x) => `captain:${x.id}` === p.id);
      assert.equal(p.extra.constraint, it.constraint);
    } else {
      assert.ok(nl.work.some((x) => `work:${x.id}` === p.id));
    }
  }
  assert.deepEqual([...kinds].sort(), ['captain', 'work']);
  assert.ok(DRILLS.includes('real'));
});

test('content top-up: core pools have at least 60 items, captain and work 36', () => {
  for (const c of [en, nl]) {
    for (const k of ['topics', 'concepts', 'opinions', 'scenarios']) assert.ok(c[k].length >= 60, `${k} ${c[k].length}`);
    for (const k of ['captain', 'work']) assert.ok(c[k].length >= 36, `${k} ${c[k].length}`);
  }
  for (const k of ['topics', 'concepts', 'opinions', 'scenarios', 'captain', 'work']) {
    assert.deepEqual(en[k].map((x) => x.id), nl[k].map((x) => x.id), k);
  }
});

test('no duplicate texts or ids within a pool', () => {
  for (const c of [en, nl]) {
    for (const [k, items] of Object.entries(c)) {
      if (!Array.isArray(items) || typeof items[0] !== 'object') continue;
      const ids = items.map((x) => x.id);
      assert.equal(new Set(ids).size, ids.length, `${k} ids`);
      const texts = items.map((x) => String(x.text || x.opener || x.statement || '').toLowerCase().trim());
      assert.equal(new Set(texts).size, texts.length, `${k} texts`);
    }
  }
});
