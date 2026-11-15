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
import { mapScene, mapStyles, mapCue, levelWords, lightPlaces } from '../films/_kit/mapscene.mjs';

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

// review of the pilot (14 Nov): styles.css is the app's file, edited for the app.
// A .subject-map rule the films cannot carry fails the build; it is never dropped.
const fixture = (extra = '') => `${Array.from({ length: 16 }, (_, i) => `.subject-map .r${i} { fill: red; }`).join('\n')}\n${extra}`;
test('mapStyles: a rule written over several lines is carried, not dropped', () => {
  const css = mapStyles(fixture('.subject-map .multi,\n.subject-map .other {\n  fill: blue;\n  stroke: none;\n}\n'));
  assert.match(css, /\.subject-map \.multi,\n\.subject-map \.other \{\n {2}fill: blue;\n {2}stroke: none;\n\}/);
  assert.equal(count(css, /fill: red/g), 16);
});
test('mapStyles: a .subject-map rule it cannot carry is an error, not a silent gap', () => {
  assert.throws(() => mapStyles(fixture('@media (max-width: 480px) { .subject-map .map-label { font-size: 18px; } }')), /inside @media/);
  assert.throws(() => mapStyles(fixture('[data-theme="dark"] .subject-map .t-top { fill: black; }')), /does not start with \.subject-map/);
  assert.throws(() => mapStyles(fixture('.subject-map .a, .other { fill: black; }')), /does not start with \.subject-map/);
  assert.throws(() => mapStyles('.card { color: red; }'), /the \.subject-map rules are gone from styles\.css/);
  // comments, the wrapper and the app's other rules are no business of the film
  assert.doesNotThrow(() => mapStyles(fixture('/* .subject-map notes */\n.subject-map-wrap { width: 100%; }\n.card .subject-map-wrap { margin: 0; }\n@media (max-width: 480px) { .card { padding: 0; } }')));
});

test('mapScene: a highlighted place the drawing does not mark as expected is an error, not an unlit map', () => {
  const svg = '<svg class="subject-map"><g class="map-place is-next" data-module="pm.plan" role="button"><rect class="map-hit" x="1"/></g><g class="map-place" data-module="pm.run"><rect class="map-hit" x="2"/></g></svg>';
  const lit = lightPlaces(svg, ['pm.plan']);
  assert.match(lit, /<g class="map-place is-next is-lit" data-module="pm\.plan" data-cue="map-plan" role="button"><rect class="map-hit" x="1"\/>/);
  assert.match(lit, /<g class="map-place" data-module="pm\.run"><\/g>/);
  assert.throws(() => lightPlaces('<svg><g data-module="pm.plan" class="map-place"></g></svg>', ['pm.plan']), /could not light pm\.plan/);
});

test('levelWords: the words the app uses for the four levels, per language', () => {
  assert.deepEqual(levelWords('nl'), ['Basis', 'Werkkennis', 'Gevorderd', 'Expert']);
  assert.deepEqual(levelWords('en'), ['Basics', 'Working knowledge', 'Advanced', 'Expert']);
  for (const lang of ['nl', 'en']) assert.deepEqual(levelWords(lang), [1, 2, 3, 4].map((n) => STRINGS[lang][`level_${n}`]));
});

// Task 13, first Engineering film (15 Nov): the Engineering zones are `.subject-map-wrap .z-*` rules in styles.css
// (the app wraps the map), which the kit does not carry. A film of a subject with zones asks for them with
// mapStyles(css, subject): the rules for that subject's zones only, rewritten to start with .subject-map. Without a
// subject the output is byte for byte what it was, so no Projects film page changes.
const zoneFixture = (extra = '') => `${fixture('')}\n.subject-map-wrap .z-plant { --zone: var(--accent); }\n.subject-map-wrap .z-making { --zone: var(--primary); }\n.subject-map-wrap .z-energy { --zone: var(--ok); }\n.subject-map-wrap .z-digital { --zone: var(--secondary-fill); }\n.subject-map-wrap .subject-map-phone { max-width: 400px; }\n${extra}`;
test('mapStyles(css, subject): the zone colours of that subject, scoped to .subject-map', () => {
  const plain = mapStyles(zoneFixture());
  assert.doesNotMatch(plain, /z-(plant|making|energy|digital)/, 'no subject, no zone rules: Projects pages stay as they are');
  assert.equal(mapStyles(zoneFixture(), 'pm'), plain, 'a subject without zone colours adds nothing');
  const eng = mapStyles(zoneFixture(), 'eng');
  for (const [z, v] of [['plant', 'accent'], ['making', 'primary'], ['energy', 'ok'], ['digital', 'secondary-fill']]) assert.match(eng, new RegExp(`\\.subject-map \\.z-${z} \\{ --zone: var\\(--${v}\\); \\}`));
  assert.doesNotMatch(eng, /subject-map-wrap/);
  assert.doesNotMatch(eng, /subject-map-phone/, 'only the zone rules, not the phone layout');
  assert.ok(eng.startsWith(plain.trimEnd()), 'the plain rules come first, unchanged');
  assert.throws(() => mapStyles(zoneFixture().replace(/\.subject-map-wrap \.z-making[^\n]*\n/, ''), 'eng'), /no colour for the zone making/);  // review of the first Engineering film: a misspelt subject must not quietly drop the zone colours
  assert.throws(() => mapStyles(zoneFixture(), 'Eng'), /no subject Eng/);
  assert.throws(() => mapStyles(zoneFixture(), 'eng.making'), /no subject eng\.making/);
});
test('the real styles.css gives every zone of the Engineering map its colour in a film', async () => {
  const eng = mapStyles(undefined, 'eng');
  const map = (await import('../src/content/courses/maps/eng.js')).default;
  for (const z of map.zones) assert.match(eng, new RegExp(`\\.subject-map \\.z-${z.field.split('.').pop()} \\{ --zone:`));  // and no more than the map's zones: the kit's list is the map's, in the map's order
  const rules = [...eng.slice(mapStyles().length).matchAll(/\.subject-map \.z-([a-z]+) \{/g)].map((m) => m[1]);
  assert.deepEqual(rules, map.zones.map((z) => z.field.split('.').pop()));
});
