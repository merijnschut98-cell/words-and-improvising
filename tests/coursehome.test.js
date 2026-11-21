// v17 Task 7: the map on the subject home. Pure parts only: the order of the
// blocks, the map registry and the fields that have a film.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { homeOrder, fieldFilms, zoneGroups } from '../src/ui/coursehome.js';
import { mapFor } from '../src/content/courses/maps/index.js';
import engMap from '../src/content/courses/maps/eng.js';
import pmMap from '../src/content/courses/maps/pm.js';
import { FIELDS, MODULES } from '../src/content/courses/index.js';
import { STRINGS } from '../src/i18n.js';

test('homeOrder: a subject with a map shows it first, then the next step', () => {
  assert.deepEqual(homeOrder('pm', true), ['map', 'next', 'quick', 'due', 'fields', 'tracks']);
});
test('homeOrder: a subject without a map keeps today\'s order', () => {
  assert.deepEqual(homeOrder('eng', false), ['next', 'quick', 'due', 'tracks']);
});

test('mapFor: Projects and Engineering have their maps', () => {
  assert.equal(mapFor('pm'), pmMap);
  assert.equal(mapFor('eng'), engMap);
  assert.equal(mapFor('nope'), null);
});

test('fieldFilms: only fields with a film, in the order of FIELDS', () => {
  // Every pm field with a film, in FIELDS order (field films land one by one).
  assert.deepEqual(fieldFilms('pm').map((f) => f.film), FIELDS.filter((f) => f.subject === 'pm' && f.film).map((f) => f.film));
  assert.ok(fieldFilms('pm').some((f) => f.film === 'pm.field.lifecycle'));
  assert.ok(fieldFilms('pm', [{ id: 'pm.field.x', subject: 'pm', modules: [] }]).length === 0, 'a field without a film is left out');
  // Engineering: the same, one field at a time (the zone Making things has its film since 15 Nov)
  assert.deepEqual(fieldFilms('eng').map((f) => f.film), FIELDS.filter((f) => f.subject === 'eng' && f.film).map((f) => f.film));
  assert.ok(fieldFilms('eng').some((f) => f.film === 'eng.field.making'));
  assert.equal(fieldFilms('pm').length, FIELDS.filter((f) => f.subject === 'pm' && f.film).length);
});

test('the map heading exists in both languages', () => {
  for (const lang of ['nl', 'en']) assert.ok(STRINGS[lang].mapHeading, lang);
});

// Review (14 Nov): the marked next place kept its accent ring when focused, so a
// keyboard user could not see focus land on it. Both rules have the same
// specificity, so the focus rule has to come after the next-place rule.
test('a focused place shows the focus ring, the marked next place too', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const focus = css.indexOf('.subject-map .map-place:focus-visible .map-hit');
  const next = css.indexOf('.subject-map .map-place.is-next .map-hit');
  assert.ok(focus > 0 && next > 0, 'both rules exist');
  assert.ok(focus > next, 'the focus rule comes after the next-place rule');
});

// 15 Nov (Merijn): under a map the list shows the map's zones, not the old track groups.
test('zoneGroups: the zones of the map, same names and order, with their modules', () => {
  for (const [subject, map] of [['eng', engMap], ['pm', pmMap]]) {
    const groups = zoneGroups(subject, map);
    assert.deepEqual(groups.map((g) => g.field.id), map.zones.map((z) => z.field), `${subject} order`);
    assert.deepEqual(groups.map((g) => g.label), map.zones.map((z) => z.label), `${subject} names`);
    for (const g of groups) assert.deepEqual(g.modules.map((m) => m.id), FIELDS.find((f) => f.id === g.field.id).modules);
    assert.deepEqual(groups.flatMap((g) => g.modules.map((m) => m.id)).sort(), MODULES.filter((m) => m.subject === subject).map((m) => m.id).sort());
  }
  assert.equal(zoneGroups('eng', engMap).find((g) => g.field.id === 'eng.field.run').modules.length, 4);
  assert.deepEqual(zoneGroups('eng', null), null, 'no map, no zones: the tracks stay');
});
