// v17 Task 7: the map on the subject home. Pure parts only: the order of the
// blocks, the map registry and the fields that have a film.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homeOrder, fieldFilms } from '../src/ui/coursehome.js';
import { mapFor } from '../src/content/courses/maps/index.js';
import pmMap from '../src/content/courses/maps/pm.js';
import { FIELDS } from '../src/content/courses/index.js';
import { STRINGS } from '../src/i18n.js';

test('homeOrder: a subject with a map shows it first, then the next step', () => {
  assert.deepEqual(homeOrder('pm', true), ['map', 'next', 'goal', 'quick', 'due', 'fields', 'tracks']);
});
test('homeOrder: a subject without a map keeps today\'s order', () => {
  assert.deepEqual(homeOrder('eng', false), ['next', 'goal', 'quick', 'due', 'tracks']);
});

test('mapFor: Projects has its map, Engineering none yet', () => {
  assert.equal(mapFor('pm'), pmMap);
  assert.equal(mapFor('eng'), null);
  assert.equal(mapFor('nope'), null);
});

test('fieldFilms: only fields with a film, in the order of FIELDS', () => {
  assert.deepEqual(fieldFilms('pm').map((f) => f.film), ['pm.field.lifecycle']);
  assert.deepEqual(fieldFilms('eng'), []);
  assert.equal(fieldFilms('pm').length, FIELDS.filter((f) => f.subject === 'pm' && f.film).length);
});

test('the map heading exists in both languages', () => {
  for (const lang of ['nl', 'en']) assert.ok(STRINGS[lang].mapHeading, lang);
});
