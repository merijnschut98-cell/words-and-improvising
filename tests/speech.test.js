import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionText, joinText } from '../src/core/speech.js';

const r = (transcript, isFinal) => Object.assign([{ transcript }], { isFinal });

test('finals are joined, interims kept separate', () => {
  const out = sessionText([r('hello there', true), r(' my friend', true), r('how are', false)]);
  assert.equal(out.final, 'hello there my friend');
  assert.equal(out.interim, 'how are');
});

test('android cumulative finals are not duplicated', () => {
  const out = sessionText([r('I think', true), r('I think that lean', true), r('I think that lean is great', true)]);
  assert.equal(out.final, 'I think that lean is great');
});

test('interim only leaves final empty', () => {
  assert.deepEqual(sessionText([r('maybe', false)]), { final: '', interim: 'maybe' });
});

test('joinText trims and single-spaces', () => {
  assert.equal(joinText('  a ', '', ' b  c'), 'a b c');
});

test('short final followed by a word with the same prefix is kept', () => {
  assert.equal(sessionText([r('so', true), r('something else', true)]).final, 'so something else');
  assert.equal(sessionText([r('I', true), r('Indeed it works', true)]).final, 'I Indeed it works');
});

test('cumulative final equal to previous is not duplicated', () => {
  assert.equal(sessionText([r('yes and', true), r('yes and', true)]).final, 'yes and');
});

import { isFatalSpeechError } from '../src/core/speech.js';

test('fatal speech errors stop restarts', () => {
  for (const c of ['not-allowed', 'service-not-allowed', 'network', 'audio-capture', 'language-not-supported']) assert.ok(isFatalSpeechError(c), c);
  for (const c of ['no-speech', 'aborted']) assert.ok(!isFatalSpeechError(c), c);
});
