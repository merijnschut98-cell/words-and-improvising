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

// v189: the recogniser can listen to a MediaStreamTrack the page already holds.
function fakeRecognition({ track = true } = {}) {
  const made = [];
  class Rec {
    constructor() { made.push(this); this.starts = []; }
    start(t) {
      if (track && t !== undefined && t.readyState !== 'live') { const e = new Error('ended'); e.name = 'InvalidStateError'; throw e; }
      this.starts.push(t);
    }
    stop() { setTimeout(() => this.onend && this.onend(), 0); }
    abort() { this.aborted = true; }
  }
  return { Rec, made };
}
const liveTrack = () => ({ kind: 'audio', readyState: 'live', clone() { return { kind: 'audio', readyState: 'live', stop() { this.readyState = 'ended'; } }; } });

test('createRecognizer feeds the same track to every restart', async () => {
  const { Rec, made } = fakeRecognition();
  globalThis.window = { SpeechRecognition: Rec };
  const { createRecognizer } = await import(`../src/core/speech.js?track=${Math.random()}`);
  const track = liveTrack();
  const rec = createRecognizer({ lang: 'nl', onText() {}, track });
  assert.equal(rec.start(), true);
  made[0].onend(); // Android ends the session on silence
  assert.equal(made.length, 2);
  assert.equal(made[0].starts[0], track);
  assert.equal(made[1].starts[0], track);
  assert.equal(rec.trackInUse(), true);
  delete globalThis.window;
});

test('createRecognizer falls back to the plain mic when start(track) throws', async () => {
  const plain = [];
  class Old { start(t) { if (t) throw new TypeError('no overload'); plain.push(this); } stop() {} }
  globalThis.window = { SpeechRecognition: Old };
  const { createRecognizer } = await import(`../src/core/speech.js?old=${Math.random()}`);
  const rec = createRecognizer({ lang: 'nl', onText() {}, track: liveTrack() });
  assert.equal(rec.start(), true);
  assert.equal(plain.length, 1);
  assert.equal(rec.trackInUse(), false);
  delete globalThis.window;
});

test('probeTrackInput: an ended clone throws InvalidStateError where track input works', async () => {
  const { Rec, made } = fakeRecognition();
  globalThis.window = { SpeechRecognition: Rec };
  const { probeTrackInput } = await import(`../src/core/speech.js?probe=${Math.random()}`);
  assert.equal(probeTrackInput(liveTrack()), true);
  assert.equal(made[0].starts.length, 0); // nothing started
  delete globalThis.window;
});

test('probeTrackInput: an engine that ignores the argument starts on the mic, so it is aborted and the answer is no', async () => {
  const { Rec, made } = fakeRecognition({ track: false });
  globalThis.window = { SpeechRecognition: Rec };
  const { probeTrackInput } = await import(`../src/core/speech.js?ignore=${Math.random()}`);
  assert.equal(probeTrackInput(liveTrack()), false);
  assert.equal(made[0].aborted, true);
  assert.equal(probeTrackInput(null), false);
  assert.equal(probeTrackInput({ kind: 'audio' }), false); // no clone(): cannot test
  delete globalThis.window;
});
