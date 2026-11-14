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

import { markVague, wordsSummary, SWAPS, VAGUE } from '../src/core/words.js';
import { highlightFillers } from '../src/core/metrics.js';

test('markVague splits plain segments into vague words, fillers untouched, text preserved', () => {
  const text = 'Eh, dat Ding is best  wel goed, eigenlijk. Dingetje.';
  const segs = markVague(highlightFillers(text, 'nl'), 'nl');
  assert.equal(segs.map((s) => s.text).join(''), text);
  assert.deepEqual(segs.filter((s) => s.filler).map((s) => s.text), ['Eh', 'eigenlijk']); // eigenlijk stays a filler
  assert.deepEqual(segs.filter((s) => s.vague).map((s) => s.text), ['Ding', 'best  wel']);
  assert.ok(segs.every((s) => !(s.filler && s.vague)));
});

test('markVague only marks words of the current language', () => {
  const segs = markVague(highlightFillers('the thing is ding', 'en'), 'en');
  assert.deepEqual(segs.filter((s) => s.vague).map((s) => s.text), ['thing']);
  assert.deepEqual(markVague(highlightFillers('the thing is stuff', 'nl'), 'nl').filter((s) => s.vague), []);
  assert.deepEqual(markVague([], 'nl'), []);
});

test('every vague word has a swap suggestion in its language', () => {
  for (const lang of ['en', 'nl']) for (const w of VAGUE[lang]) assert.ok(SWAPS[lang][w], `${lang} ${w}`);
});

test('wordsSummary: top 3 movers, most-used vague word in 14 days, this language only', () => {
  const hist = [
    e(1, `${Array(96).fill('w').join(' ')} ding ding gewoon heel`, 'nl', { eh: 2, dus: 3, nou: 1, toch: 1 }),
    e(3, 'het ding was echt goed', 'nl'),
    e(20, Array(100).fill('w').join(' '), 'nl', { eh: 4, dus: 3, nou: 5, toch: 3 }),
    e(2, 'the thing thing thing stuff', 'en', { um: 9 }),
  ];
  const s = wordsSummary(hist, NOW, 'nl');
  assert.equal(s.hasBefore, true);
  assert.deepEqual(s.movers.map((m) => m.word), ['nou', 'eh', 'toch']);
  assert.ok(s.movers.every((m) => m.change !== 0));
  assert.deepEqual(s.vague, { word: 'ding', count: 3 });
  assert.equal(wordsSummary(hist, NOW, 'en').vague.word, 'thing');
});

test('wordsSummary: no earlier period shows current rates; no data gives null', () => {
  const s = wordsSummary([e(1, Array(100).fill('w').join(' '), 'nl', { eh: 3, dus: 1 })], NOW, 'nl');
  assert.equal(s.hasBefore, false);
  assert.deepEqual(s.movers.map((m) => [m.word, m.now]), [['eh', 3], ['dus', 1]]);
  assert.equal(s.vague, null);
  assert.equal(wordsSummary([], NOW, 'nl'), null);
  assert.equal(wordsSummary([e(1, 'goed gedaan vandaag', 'nl')], NOW, 'nl'), null);
  assert.equal(wordsSummary([e(40, 'het ding', 'nl', { eh: 1 })], NOW, 'nl'), null);
});

test('wordsSummary: a word that is also a filler is not reported again as vague', () => {
  const s = wordsSummary([e(1, 'gewoon gewoon gewoon eigenlijk ding', 'nl', { gewoon: 3 })], NOW, 'nl');
  assert.deepEqual(s.vague, { word: 'ding', count: 1 });
});
