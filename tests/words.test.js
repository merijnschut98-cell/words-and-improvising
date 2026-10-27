import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vagueWords, repeatedWords, fillerTrend } from '../src/core/words.js';

const DAY = 86400000;
const NOW = new Date(2026, 9, 27, 12).getTime();
const e = (daysAgo, transcript, lang = 'nl', fillers = {}) => ({ ts: NOW - daysAgo * DAY, lang, transcript, metrics: { words: transcript.split(' ').length, fillers } });

test('vague words are counted per language only', () => {
  assert.deepEqual(vagueWords('dat ding is eigenlijk gewoon best wel goed', 'nl'), { ding: 1, eigenlijk: 1, gewoon: 1, 'best wel': 1 });
  assert.deepEqual(vagueWords('the thing is basically kind of good', 'en'), { thing: 1, basically: 1, 'kind of': 1 });
  assert.deepEqual(vagueWords('the thing is basically good', 'nl'), {});
});

test('repeated words: top 3 content words used 3+ times, stop words ignored', () => {
  const r = repeatedWords('het proces is het proces en het proces moet sneller want sneller is beter dan sneller', 'nl');
  assert.deepEqual(r, [['proces', 3], ['sneller', 3]]);
  assert.deepEqual(repeatedWords('', 'en'), []);
});

test('fillerTrend: per-filler rate per 100 words, last 14 days vs the 14 before', () => {
  const hist = [
    e(1, Array(100).fill('w').join(' '), 'nl', { eh: 4, dus: 2 }),
    e(20, Array(100).fill('w').join(' '), 'nl', { eh: 8, dus: 1 }),
    e(2, Array(50).fill('w').join(' '), 'en', { um: 5 }), // other language: ignored for nl
  ];
  const t = fillerTrend(hist, NOW, 'nl');
  assert.deepEqual(t.find((x) => x.word === 'eh'), { word: 'eh', now: 4, before: 8, change: -4 });
  assert.deepEqual(t.find((x) => x.word === 'dus'), { word: 'dus', now: 2, before: 1, change: 1 });
  assert.equal(t.some((x) => x.word === 'um'), false);
  // Biggest movers first.
  assert.equal(t[0].word, 'eh');
});
