// 17 Nov (Merijn chose it): a speed button under every film video, 1× · 1,25× · 1,5×,
// remembered on this device.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { speedPref, nextSpeed, speedLabel, SPEEDS } from '../src/ui/film.js';

const store = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) }; };

test('the speed cycles 1 → 1.25 → 1.5 → 1', () => {
  assert.deepEqual(SPEEDS, [1, 1.25, 1.5]);
  assert.equal(nextSpeed(1), 1.25);
  assert.equal(nextSpeed(1.25), 1.5);
  assert.equal(nextSpeed(1.5), 1);
  assert.equal(nextSpeed(3), 1);
});

test('the label follows the language', () => {
  assert.equal(speedLabel(1.25, 'nl'), '1,25×');
  assert.equal(speedLabel(1.25, 'en'), '1.25×');
  assert.equal(speedLabel(1, 'nl'), '1×');
});

test('the choice is remembered, and a bad or blocked store reads as 1', () => {
  const ls = store();
  assert.equal(speedPref.read(ls), 1);
  speedPref.write(1.5, ls);
  assert.equal(speedPref.read(ls), 1.5);
  ls.setItem('vp:filmSpeed', '7');
  assert.equal(speedPref.read(ls), 1);
  assert.equal(speedPref.read({ getItem() { throw new Error('blocked'); } }), 1);
});

test('the video step shows the speed button and applies the rate', () => {
  const src = fs.readFileSync('src/ui/film.js', 'utf8');
  assert.match(src, /class: 'btn btn-ghost small film-speed'/);
  assert.match(src, /playbackRate = /);
});
