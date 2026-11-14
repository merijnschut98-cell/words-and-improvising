// v17: the subject map. A pure data model (maps/pm.js), a validator (checkMap)
// and a pure string drawer (mapSvg) that the film kit can call too.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, FIELDS } from '../src/content/courses/index.js';
import { checkMap } from '../src/content/courses/validate.js';
import pmMap from '../src/content/courses/maps/pm.js';
import { mapSvg } from '../src/ui/subjectmap.js';

const place = (module, x, y, w = 100, h = 100) => ({ module, x, y, w, h, draw: 'desk' });
const zone = (field, x, y, w, h) => ({ field, label: { en: field, nl: field }, path: `M${x} ${y} H${x + w} V${y + h} H${x} Z` });
const mods = [{ id: 'pm.plan', subject: 'pm' }, { id: 'pm.run', subject: 'pm' }];
const fields = [
  { id: 'pm.field.a', subject: 'pm', modules: ['pm.plan'] },
  { id: 'pm.field.b', subject: 'pm', modules: ['pm.run'] },
];
const good = () => ({
  subject: 'pm', view: { w: 640, h: 520 },
  zones: [zone('pm.field.a', 0, 0, 300, 200), zone('pm.field.b', 320, 0, 300, 200)],
  places: [place('pm.plan', 10, 10), place('pm.run', 330, 10)],
  routes: [],
});

test('checkMap: every pm module is one place inside its field zone, and nothing else', () => {
  assert.deepEqual(checkMap(pmMap, MODULES, FIELDS), []);
  assert.deepEqual(checkMap(good(), mods, fields), []);
});

test('checkMap rejects a missing module', () => {
  const m = good(); m.places.pop();
  assert.equal(checkMap(m, mods, fields).length, 1);
});
test('checkMap rejects an unknown module', () => {
  const m = good(); m.places.push(place('pm.nope', 200, 300));
  assert.equal(checkMap(m, mods, fields).length >= 1, true);
});
test('checkMap rejects a place under 44 px at 390 wide', () => {
  const m = good(); m.places[0] = place('pm.plan', 10, 10, 70, 100); // 70 * 390 / 640 = 42.7
  assert.equal(checkMap(m, mods, fields).length, 1);
  const n = good(); n.places[0] = place('pm.plan', 10, 10, 100, 70);
  assert.equal(checkMap(n, mods, fields).length, 1);
});
test('checkMap rejects overlapping places', () => {
  const m = good(); m.zones = [zone('pm.field.a', 0, 0, 640, 200), zone('pm.field.b', 0, 0, 640, 200)];
  m.places[1] = place('pm.run', 60, 10);
  assert.equal(checkMap(m, mods, fields).length, 1);
});
test('checkMap rejects a place outside the zone of its field', () => {
  const m = good(); m.places[0] = place('pm.plan', 330, 10); // in zone b, belongs to a
  m.places[1] = place('pm.run', 10, 10);
  assert.equal(checkMap(m, mods, fields).length, 2);
});

test('mapSvg: one map-place per pm module, titles in the asked language', () => {
  const nl = mapSvg(pmMap, { lang: 'nl' });
  const en = mapSvg(pmMap, { lang: 'en' });
  assert.equal((nl.match(/class="map-place/g) || []).length, 16);
  for (const m of MODULES.filter((x) => x.subject === 'pm')) {
    assert.match(nl, new RegExp(`data-module="${m.id.replace('.', '\\.')}"`));
  }
  assert.match(nl, /Plannen/);
  assert.match(en, /Plan/);
  assert.doesNotMatch(en, /Plannen/);
  assert.match(nl, /Een project van begin tot eind/);
  assert.match(en, /A project from start to finish/);
});
test('mapSvg: next marks exactly one place', () => {
  const svg = mapSvg(pmMap, { lang: 'nl', next: 'pm.plan' });
  assert.equal((svg.match(/is-next/g) || []).length, 1);
  assert.match(svg, /class="map-place is-next" data-module="pm\.plan"/);
  assert.equal((mapSvg(pmMap, { lang: 'nl' }).match(/is-next/g) || []).length, 0);
});
test('mapSvg: no inline colours, deterministic, and no progress or Andon', () => {
  const svg = mapSvg(pmMap, { lang: 'en' });
  assert.doesNotMatch(svg, /fill="#|stroke="#|style="/);
  assert.equal(svg, mapSvg(pmMap, { lang: 'en' }));
  assert.doesNotMatch(svg, /andon|progress/i);
});
test('mapSvg: every title fits its label without an ellipsis, in both languages', () => {
  for (const lang of ['nl', 'en']) assert.doesNotMatch(mapSvg(pmMap, { lang }), /…/);
});
test('mapSvg: interactive adds button semantics, static does not', () => {
  assert.doesNotMatch(mapSvg(pmMap, { lang: 'en' }), /role="button"|tabindex/);
  const svg = mapSvg(pmMap, { lang: 'en', interactive: true });
  assert.equal((svg.match(/role="button" tabindex="0"/g) || []).length, 16);
  assert.match(svg, /aria-label="Plan"/);
});
