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
