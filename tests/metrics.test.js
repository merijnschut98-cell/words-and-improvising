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
