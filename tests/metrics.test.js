import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from '../src/core/metrics.js';

test('counts single and multi-word English fillers', () => {
  const m = analyze("Um so I think, you know, it's like fine", 10, 'en');
  assert.deepEqual(m.fillers, { um: 1, so: 1, 'you know': 1, like: 1 });
  assert.equal(m.fillerCount, 4);
  assert.equal(m.words, 9);
});

test('multi-word filler is not double-counted as single words', () => {
  const m = analyze('I mean, you know what I mean', 10, 'en');
  assert.deepEqual(m.fillers, { 'you know': 1, 'i mean': 2 });
});

test('empty transcript gives zeros, no NaN', () => {
  const m = analyze('', 30, 'en');
  assert.equal(m.words, 0);
  assert.equal(m.wpm, 0);
  assert.equal(m.fillerCount, 0);
  assert.equal(m.fillerRate, 0);
  assert.equal(m.uniqueRatio, 0);
});

test('zero duration does not produce Infinity', () => {
  const m = analyze('hello there friend', 0, 'en');
  assert.equal(m.wpm, 0);
  assert.equal(m.fillerRate, 0);
});

test('Dutch fillers including multi-word', () => {
  const m = analyze('Zeg maar, eh, dat is gewoon zo', 10, 'nl');
  assert.deepEqual(m.fillers, { 'zeg maar': 1, eh: 1, gewoon: 1 });
});

test('words per minute and filler rate', () => {
  const text = Array.from({ length: 120 }, (_, i) => (i % 20 === 0 ? 'um' : 'word' + i)).join(' ');
  const m = analyze(text, 60, 'en');
  assert.equal(m.wpm, 120);
  assert.equal(m.fillerRate, 6);
});

test('fillers do not match inside other words', () => {
  const m = analyze('Unlike someone, the eh-team is sorted', 10, 'en');
  assert.deepEqual(m.fillers, {});
});

import { highlightFillers } from '../src/core/metrics.js';

test('highlightFillers splits text into filler and plain segments', () => {
  const segs = highlightFillers('Um, I think you know it is like fine. Unlike that.', 'en');
  assert.deepEqual(segs.filter((s) => s.filler).map((s) => s.text), ['Um', 'you know', 'like']);
  assert.equal(segs.map((s) => s.text).join(''), 'Um, I think you know it is like fine. Unlike that.');
});

test('highlightFillers on empty text', () => {
  assert.deepEqual(highlightFillers('', 'nl'), []);
});

import { cleanRun } from '../src/core/metrics.js';
import { tokenize } from '../src/core/metrics.js';

test('cleanRun: multi-word filler is one break', () => {
  assert.deepEqual(cleanRun(tokenize('a b you know c d e'), 'en'), { max: 3, current: 3 });
});

test('cleanRun: leading filler', () => {
  assert.deepEqual(cleanRun(tokenize('um a b'), 'en'), { max: 2, current: 2 });
});

test('cleanRun: trailing filler resets current', () => {
  assert.deepEqual(cleanRun(tokenize('a b c d eh'), 'nl'), { max: 4, current: 0 });
});

test('cleanRun: empty', () => {
  assert.deepEqual(cleanRun([], 'en'), { max: 0, current: 0 });
});

test('paceSeries: words per minute per 10 s bucket from a word timeline', async () => {
  const { paceSeries } = await import('../src/core/metrics.js');
  // 20 words in the first 10 s, 30 in the next 10 s, then 10 in a 6 s tail.
  const tl = [[1000, 10], [9000, 20], [15000, 35], [19000, 50], [24000, 60]];
  assert.deepEqual(paceSeries(tl, 0, 26), [120, 180, 100]);
});

test('paceSeries guards short rounds and drops tiny tail buckets', async () => {
  const { paceSeries } = await import('../src/core/metrics.js');
  assert.deepEqual(paceSeries([[1000, 5]], 0, 8), []);
  assert.deepEqual(paceSeries([], 0, 0), []);
  assert.deepEqual(paceSeries([[5000, 20], [15000, 40], [20500, 44]], 0, 21), [120, 120]);
});

test('paceTrend detects speeding up and slowing down, needs 3 buckets', async () => {
  const { paceTrend } = await import('../src/core/metrics.js');
  assert.equal(paceTrend([120, 130]), null);
  assert.equal(paceTrend([110, 120, 130, 170, 180, 190]), 'faster');
  assert.equal(paceTrend([180, 170, 150, 110, 100, 100]), 'slower');
  assert.equal(paceTrend([120, 125, 118, 122, 121, 119]), null);
});
