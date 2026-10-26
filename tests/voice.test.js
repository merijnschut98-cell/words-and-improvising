import { test } from 'node:test';
import assert from 'node:assert/strict';

// A fake speechSynthesis whose behaviour each test sets.
let behaviour = 'end';
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
globalThis.window = {
  speechSynthesis: {
    getVoices: () => [],
    cancel() {},
    speak(u) {
      if (behaviour === 'error') setTimeout(() => u.onerror(), 0);
      else if (behaviour === 'instant') setTimeout(() => u.onend(), 10);
      else setTimeout(() => u.onend(), 500);
    },
  },
};
const { say, speakCapMs } = await import('../src/core/voice.js');

test('speak cap grows with the text so long cues are not cut off', () => {
  assert.equal(speakCapMs('Short line.'), 6000);
  const listenCue = 'Our project got delayed because the supplier sent the wrong parts. We are now two weeks behind. Why was the project delayed?';
  assert.ok(speakCapMs(listenCue) > 12000);
});

test('say() reports spoken when the engine really speaks', async () => {
  behaviour = 'end';
  assert.equal(await say('Hello there', 'en'), 'spoken');
});

test('say() reports failed on an error or an instant end (no voice)', async () => {
  behaviour = 'error';
  assert.equal(await say('Hallo daar', 'nl'), 'failed');
  behaviour = 'instant';
  assert.equal(await say('Hallo daar', 'nl'), 'failed');
});
