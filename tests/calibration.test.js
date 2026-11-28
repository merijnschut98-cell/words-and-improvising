import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calibration, localCalibration, skillRadar } from '../src/core/calibration.js';

const coached = (rating, overall, scores = { clarity: 3, structure: 3, fluency: 3, vocabulary: 3 }) =>
  ({ rating, coach: { overall, scores }, metrics: { fillerRate: 2, uniqueRatio: 0.6, words: 50 } });

test('calibration is null under 3 rated+coached pairs', () => {
  assert.equal(calibration([coached(3, 4), coached(2, 4), coached(null, 4)]), null);
});

test('calibration verdicts at the thresholds', () => {
  assert.equal(calibration([coached(3, 4), coached(3, 4), coached(3, 4)]).verdict, 'harsh');
  assert.equal(calibration([coached(4, 4), coached(3, 4), coached(5, 4)]).verdict, 'fair');
  assert.equal(calibration([coached(5, 4), coached(5, 4), coached(5, 4)]).verdict, 'generous');
  const edge = calibration([coached(3.5, 4), coached(3.5, 4), coached(3.5, 4)]);
  assert.equal(edge.meanGap, -0.5);
  assert.equal(edge.verdict, 'fair');
});

test('calibration uses only the last 10 pairs', () => {
  const h = [...Array(10)].map(() => coached(4, 4)).concat([...Array(10)].map(() => coached(1, 5)));
  const c = calibration(h);
  assert.equal(c.n, 10);
  assert.equal(c.verdict, 'fair');
});

const rated = (rating, fillerRate) => ({ rating, coach: null, metrics: { fillerRate, uniqueRatio: 0.6, words: 50 } });

test('localCalibration is null with fewer than 6 rated rounds', () => {
  assert.equal(localCalibration([...Array(5)].map(() => rated(3, 2))), null);
});

test('localCalibration: fillers improved but rating did not → harsh', () => {
  const recent = [...Array(5)].map(() => rated(3, 1));
  const older = [...Array(5)].map(() => rated(3, 3));
  assert.equal(localCalibration([...recent, ...older]).verdict, 'harsh');
});

test('localCalibration: fillers worse but rating up → generous', () => {
  const recent = [...Array(5)].map(() => rated(4, 4));
  const older = [...Array(5)].map(() => rated(3, 2));
  assert.equal(localCalibration([...recent, ...older]).verdict, 'generous');
});

test('skillRadar averages coach scores when available', () => {
  const r = skillRadar([coached(3, 4, { clarity: 4, structure: 2, fluency: 5, vocabulary: 3 }),
    coached(3, 4, { clarity: 2, structure: 2, fluency: 3, vocabulary: 3 }),
    coached(3, 4, { clarity: 3, structure: 2, fluency: 4, vocabulary: 3 })]);
  assert.deepEqual(r, { clarity: 3, structure: 2, fluency: 4, vocabulary: 3, source: 'coach' });
});

test('skillRadar falls back to local proxies without coach data', () => {
  const r = skillRadar([rated(4, 0), rated(4, 0), { rating: null, coach: null, metrics: { fillerRate: 0, uniqueRatio: 0.8, words: 50 } }]);
  assert.equal(r.source, 'local');
  assert.equal(r.fluency, 5);
  assert.ok(r.vocabulary > 3 && r.vocabulary <= 5);
  assert.equal(r.clarity, 4);
  assert.equal(r.structure, 4);
});

test('skillRadar is null with no history', () => {
  assert.equal(skillRadar([]), null);
});
