// v17: the closing scene of a field or module film is the shared subject map.
// films/_kit/mapscene.mjs draws the very map the app shows (mapSvg from
// src/ui/subjectmap.js), in both languages at once, with the asked places lit
// as data-cue groups; mapStyles() carries the .subject-map rules into the film
// page, which does not load styles.css.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULES } from '../src/content/courses/index.js';
import { STRINGS } from '../src/i18n.js';
import pmMap from '../src/content/courses/maps/pm.js';
import { mapSvg } from '../src/ui/subjectmap.js';
import { mapScene, mapStyles, mapCue, levelWords } from '../films/_kit/mapscene.mjs';

const count = (s, re) => (s.match(re) || []).length;

test('mapScene: the shared map, one place per module, both languages in the same drawing', async () => {
  const svg = await mapScene({ subject: 'pm', highlight: ['pm.plan'] });
  assert.match(svg, /^<svg class="subject-map"/);
  assert.equal(count(svg, /class="map-place/g), 16);
  for (const m of MODULES.filter((x) => x.subject === 'pm')) assert.match(svg, new RegExp(`data-module="${m.id.replace('.', '\\.')}"`));
  // each label exists in both languages, hidden by the page language
  assert.match(svg, /class="l-nl"[^]*Plannen/);
  assert.match(svg, /class="l-en"[^]*>Plan</);
  assert.match(svg, /Een project van begin tot eind/);
  assert.match(svg, /A project from start to finish/);
  // one drawing: the shapes are those of the app's mapSvg
  const app = mapSvg(pmMap, { lang: 'nl' });
  for (const piece of app.match(/<path class="map-zone-area"[^>]*>/g)) assert.ok(svg.includes(piece), piece.slice(0, 40));
  assert.doesNotMatch(svg, /role="button"|tabindex/, 'no interaction in a film');
});

test('mapScene: one lit place per highlighted module, each a cue group', async () => {
  const one = await mapScene({ subject: 'pm', highlight: ['pm.plan'] });
  assert.equal(count(one, /is-lit/g), 1);
  assert.match(one, /class="map-place is-lit" data-module="pm\.plan" data-cue="map-plan"/);
  const two = await mapScene({ subject: 'pm', highlight: ['pm.plan', 'pm.run'] });
  assert.equal(count(two, /is-lit/g), 2);
  assert.match(two, /data-cue="map-run"/);
  assert.equal(count(await mapScene({ subject: 'pm', highlight: [] }), /is-lit/g), 0);
  assert.equal(mapCue('pm.plan'), 'map-plan');
});

test('mapScene: an unknown subject or module is an error, not a silent blank', async () => {
  await assert.rejects(() => mapScene({ subject: 'nope', highlight: [] }), /no map for subject nope/);
  await assert.rejects(() => mapScene({ subject: 'pm', highlight: ['pm.nope'] }), /pm\.nope is no place of the pm map/);
});

test('mapStyles: every .subject-map rule of the app, mapped to the film palette in both themes', () => {
  const css = mapStyles();
  const app = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const rules = app.match(/^\.subject-map(?!-wrap)[^{]*\{[^}]*\}$/gm);
  assert.ok(rules.length > 15);
  for (const r of rules) assert.ok(css.includes(r), r.slice(0, 50));
  assert.doesNotMatch(css, /subject-map-wrap/);
  for (const v of ['--card', '--line', '--heading', '--accent', '--ok', '--primary', '--secondary-fill']) assert.match(css, new RegExp(`${v}:`), v);
  assert.match(css, /\[data-theme="light"\]/);
  assert.match(css, /is-lit/);
  assert.match(css, /\.l-en/);
});

test('levelWords: the words the app uses for the four levels, per language', () => {
  assert.deepEqual(levelWords('nl'), ['Basis', 'Werkkennis', 'Gevorderd', 'Expert']);
  assert.deepEqual(levelWords('en'), ['Basics', 'Working knowledge', 'Advanced', 'Expert']);
  for (const lang of ['nl', 'en']) assert.deepEqual(levelWords(lang), [1, 2, 3, 4].map((n) => STRINGS[lang][`level_${n}`]));
});
