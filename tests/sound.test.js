import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CUES, soundOn, play } from '../src/core/sound.js';

test('four short cues, each a list of [frequency, seconds] notes under a second', () => {
  assert.deepEqual(Object.keys(CUES).sort(), ['best', 'quest', 'switch', 'twist']);
  for (const notes of Object.values(CUES)) {
    assert.ok(notes.length >= 1);
    assert.ok(notes.reduce((s, [, d]) => s + d, 0) < 1);
    for (const [f] of notes) assert.ok(f > 100 && f < 2000);
  }
});

test('sound is on by default and off only when explicitly disabled', () => {
  assert.equal(soundOn({}), true);
  assert.equal(soundOn({ sound: true }), true);
  assert.equal(soundOn({ sound: false }), false);
});

test('play is a silent no-op without WebAudio or when muted', () => {
  assert.doesNotThrow(() => play('twist', {}));
  assert.doesNotThrow(() => play('twist', { sound: false }));
  assert.doesNotThrow(() => play('unknown', {}));
});

test('a rejected AudioContext.resume() never becomes an unhandled rejection', async () => {
  const seen = [];
  const onRej = (e) => seen.push(e);
  process.on('unhandledRejection', onRej);
  const node = () => ({ connect: () => node(), start() {}, stop() {}, frequency: {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } });
  globalThis.window = { AudioContext: class { constructor() { this.state = 'suspended'; this.currentTime = 0; this.destination = {}; }
    resume() { return Promise.reject(new Error('blocked')); } createOscillator() { return node(); } createGain() { return node(); } } };
  const { play: playFresh } = await import(`../src/core/sound.js?fresh=${Date.now()}`);
  playFresh('quest', {});
  await new Promise((r) => setTimeout(r, 20));
  process.off('unhandledRejection', onRej);
  delete globalThis.window;
  assert.equal(seen.length, 0);
});
