// Task 13 step 1: the Engineering map, the same way Projects has one. Four zones
// (fields) group the 26 modules; the map has a wide and a phone layout, no road
// (Engineering has no natural order), and adds nothing to what Projects draws.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { MODULES, FIELDS, fieldOf } from '../src/content/courses/index.js';
import { checkFields, checkMap, pathBox } from '../src/content/courses/validate.js';
import { mapFor } from '../src/content/courses/maps/index.js';
import engMap from '../src/content/courses/maps/eng.js';
import pmMap from '../src/content/courses/maps/pm.js';
import { mapSvg, wrapLabel, MAP_OBJECTS } from '../src/ui/subjectmap.js';
import { homeOrder } from '../src/ui/coursehome.js';
import { mapStyles } from '../films/_kit/mapscene.mjs';

const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const CSS = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const SW = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const eng = MODULES.filter((m) => m.subject === 'eng');
const efields = FIELDS.filter((f) => f.subject === 'eng');
const phone = engMap.phone;
const CARD = { 390: 324, 360: 294, 320: 254, 430: 364 };
const inside = (p, b) => p.x >= b[0] && p.y >= b[1] && p.x + p.w <= b[2] && p.y + p.h <= b[3];
const placesOf = (m, field) => {
  const b = pathBox(m.zones.find((z) => z.field === field).path);
  return m.places.filter((p) => inside(p, b)).sort((p, q) => (p.y - q.y) || (p.x - q.x)).map((p) => p.module);
};

test('Projects is untouched: its map data and its default drawing are pinned', () => {
  assert.equal(sha(JSON.stringify(pmMap)), '66ea68dfdaec591d');
  assert.equal(sha(mapSvg(pmMap, { lang: 'nl' })), '98a1fd0cda491cec');
  assert.equal(sha(mapSvg(pmMap, { lang: 'en', theme: 'dark' })), 'c814b7a705b695c0');
});

test('four Engineering fields cover all 26 modules, each in exactly one, and the validator is happy', () => {
  assert.equal(eng.length, 26);
  assert.deepEqual(efields.map((f) => f.id), ['eng.field.plant', 'eng.field.making', 'eng.field.energy', 'eng.field.digital']);
  assert.deepEqual(checkFields(FIELDS, MODULES), []);
  assert.deepEqual(efields.flatMap((f) => f.modules).sort(), eng.map((m) => m.id).sort());
  for (const m of eng) assert.ok(fieldOf(m.id), m.id);
  for (const f of efields) assert.ok(!('film' in f), 'no field film yet: the films come next');
});

test('the zones group what the modules teach, and each zone lists its modules by level', () => {
  const by = Object.fromEntries(efields.map((f) => [f.id, f.modules]));
  assert.deepEqual(by['eng.field.plant'], ['eng.flow', 'eng.quality', 'eng.maintenance', 'eng.safety', 'eng.spc', 'eng.cost', 'eng.improve', 'eng.reliability']);
  assert.deepEqual(by['eng.field.making'], ['eng.mechanics', 'eng.machining', 'eng.process', 'eng.drawings', 'eng.joining', 'eng.moulding']);
  assert.deepEqual(by['eng.field.energy'], ['eng.gridbasics', 'eng.fluids', 'eng.power', 'eng.transformers', 'eng.switchgear', 'eng.gridops', 'eng.gridplanning']);
  assert.deepEqual(by['eng.field.digital'], ['eng.itbasics', 'eng.ot', 'eng.cyber', 'eng.lines', 'eng.industry40']);
  for (const f of efields) {
    const levels = f.modules.map((id) => MODULES.find((m) => m.id === id).level);
    assert.deepEqual(levels, [...levels].sort((a, b) => a - b), `${f.id} is in level order`);
    assert.ok(f.title.nl && f.title.en && f.blurb.nl && f.blurb.en);
  }
});

test('mapFor: Engineering has its map now, with a phone layout, and no road', () => {
  assert.equal(mapFor('eng'), engMap);
  assert.equal(mapFor('pm'), pmMap);
  assert.ok(phone);
  assert.equal(engMap.subject, 'eng');
  assert.deepEqual(engMap.routes || [], []);
  assert.deepEqual(phone.routes || [], []);
  assert.deepEqual(homeOrder('eng', true), ['map', 'next', 'quick', 'due', 'fields', 'tracks']);
});

test('both layouts pass checkMap: 26 places, every module once, inside its zone, no overlaps', () => {
  assert.deepEqual(checkMap(engMap, MODULES, FIELDS), []);
  assert.deepEqual(checkMap({ subject: 'eng', ...phone }, MODULES, FIELDS), []);
  assert.equal(engMap.places.length, 26);
  assert.equal(phone.places.length, 26);
});

test('every place draws an object the map knows, and the new objects are plain data in the same style', () => {
  for (const m of [engMap, phone]) for (const p of m.places) assert.ok(MAP_OBJECTS.includes(p.draw), `${p.module}: ${p.draw}`);
  for (const old of ['desk', 'board', 'whiteboard', 'gate', 'server', 'road-stop', 'contract', 'dashboard', 'handshake']) assert.ok(MAP_OBJECTS.includes(old));
});

test('the phone layout keeps the order of the wide one: zones top to bottom, places by level inside a zone', () => {
  assert.deepEqual(phone.zones.map((z) => z.field), engMap.zones.map((z) => z.field));
  for (const f of efields) {
    assert.deepEqual(placesOf(phone, f.id), f.modules, `${f.id} phone`);
    assert.deepEqual(placesOf(engMap, f.id), f.modules, `${f.id} wide`);
  }
});

test('labels are big: 11 px or more at 390, 9 px at 320; rows of three at most', () => {
  const px = (w) => phone.font * w / phone.view.w;
  assert.ok(px(CARD[390]) >= 11 && px(CARD[360]) >= 10 && px(CARD[320]) >= 8.95);
  const rows = new Map();
  for (const p of phone.places) rows.set(p.y, (rows.get(p.y) || 0) + 1);
  assert.ok(Math.max(...rows.values()) <= 3);
});

test('every place is a tap target of 45 px or more at the real card widths', () => {
  for (const p of phone.places) for (const w of Object.values(CARD)) {
    assert.ok(p.w * w / phone.view.w >= 45 && p.h * w / phone.view.w >= 45, `${p.module} at ${w}`);
  }
});

test('every title wraps to three lines or fewer, uncut, fits its place and sits inside it, in both languages', () => {
  const glyph = phone.font * 0.56;
  for (const lang of ['nl', 'en']) for (const p of phone.places) {
    const lines = wrapLabel(MODULES.find((m) => m.id === p.module).title[lang], p.w, phone);
    assert.ok(lines.length <= 3 && !lines.some((l) => l.includes('…')), `${lang} ${p.module}: ${lines.join(' / ')}`);
    for (const l of lines) assert.ok(l.length * glyph <= p.w, `${lang} ${p.module}: "${l}"`);
    assert.ok(p.h >= phone.labelTop + (lines.length - 1) * phone.lineHeight + 5, `${lang} ${p.module} height`);
  }
});

test('the phone map is long but bounded: 26 places in at most 860 px at 390 and 680 px at 320', () => {
  const high = (w) => phone.view.h * w / phone.view.w;
  assert.ok(high(CARD[390]) <= 860, `${high(CARD[390])}`);
  assert.ok(high(CARD[320]) <= 680, `${high(CARD[320])}`);
});

test('mapSvg draws Engineering: wide and phone, 26 buttons, one next mark, zone labels in both languages', () => {
  const wide = mapSvg(engMap, { lang: 'nl', next: 'eng.flow', interactive: true });
  const ph = mapSvg(engMap, { lang: 'nl', next: 'eng.flow', interactive: true, layout: 'phone' });
  for (const svg of [wide, ph]) {
    assert.equal((svg.match(/role="button" tabindex="0"/g) || []).length, 26);
    assert.equal((svg.match(/is-next/g) || []).length, 1);
    assert.doesNotMatch(svg, /map-road/);
  }
  assert.match(ph, /^<svg class="subject-map subject-map-phone"/);
  for (const lang of ['nl', 'en']) for (const z of engMap.zones) assert.match(mapSvg(engMap, { lang }), new RegExp(z.label[lang].replace(/[()]/g, '.')));
});

test('the four zones have colours in the app styles, in rules the film kit does not carry', () => {
  for (const z of ['plant', 'making', 'energy', 'digital']) assert.match(CSS, new RegExp(`\\.subject-map-wrap \\.z-${z} \\{ --zone:`));
  assert.doesNotMatch(mapStyles(), /z-(plant|making|energy|digital)/);
});

test('the new files are in the service worker shell', () => {
  assert.match(SW, /'src\/content\/courses\/maps\/eng\.js'/);
  assert.match(SW, /'src\/content\/courses\/maps\/layout\.js'/);
});
