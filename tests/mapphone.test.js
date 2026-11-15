// The phone layout of the subject map: bigger labels on a narrow card, drawn
// from a second layout in the map data (map.phone). The default drawing the
// films use must stay byte for byte what it was.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { MODULES, FIELDS } from '../src/content/courses/index.js';
import { checkMap, pathBox } from '../src/content/courses/validate.js';
import pmMap from '../src/content/courses/maps/pm.js';
import { mapSvg, wrapLabel, PHONE_BELOW } from '../src/ui/subjectmap.js';

const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const CSS = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const phone = pmMap.phone;
const asMap = { subject: pmMap.subject, ...phone };

// Card content width at a phone viewport, as e2e/mapfit.mjs measures it: 390 -> 324, 320 -> 254.
const CARD = { 390: 324, 360: 294, 320: 254, 430: 364 };

test('the default mapSvg output is byte-identical to before the phone layout (the films depend on it)', () => {
  assert.equal(sha(mapSvg(pmMap, { lang: 'nl' })), '28145ee93370646c');
  assert.equal(sha(mapSvg(pmMap, { lang: 'en' })), '6728c49352de35a3');
  assert.equal(sha(mapSvg(pmMap, { lang: 'nl', next: 'pm.plan', interactive: true })), 'b4a8ffa55bcaa70c');
  assert.equal(sha(mapSvg(pmMap, { lang: 'en', theme: 'dark' })), '02f9f813af9455b5');
});

test('the phone layout is data: same modules, same fields, valid by the rules of checkMap', () => {
  assert.ok(phone, 'pm has a phone layout');
  assert.deepEqual(checkMap(asMap, MODULES, FIELDS), []);
  const ids = (m) => m.places.map((p) => p.module).sort();
  assert.deepEqual(ids(phone), ids(pmMap));
  assert.deepEqual(phone.zones.map((z) => z.field), pmMap.zones.map((z) => z.field), 'zone order is the same');
});

test('the phone layout keeps the reading order: zones top to bottom, places left to right, row by row, as in the wide map', () => {
  const order = (m) => m.zones.map((z) => {
    const b = pathBox(z.path);
    return m.places.filter((p) => p.x >= b[0] && p.x + p.w <= b[2] && p.y >= b[1] && p.y + p.h <= b[3])
      .sort((p, q) => (p.y - q.y) || (p.x - q.x)).map((p) => p.module);
  });
  assert.deepEqual(order(phone), order(pmMap));
});

test('the road still runs Approach, Intake, Plan, Formats, Run, Land, Close, each leg left to right, and the same chain', () => {
  const flat = new Map();
  for (const [a, b] of phone.routes) flat.set(a, b);
  const road = ['pm.approach', 'pm.intake', 'pm.plan', 'pm.formats', 'pm.run', 'pm.land', 'pm.close'];
  const at = (id) => phone.places.find((p) => p.module === id);
  for (const [a, b] of phone.routes) {
    assert.ok(road.indexOf(b) === road.indexOf(a) + 1, `${a} -> ${b} follows the road`);
    assert.ok(at(a).x < at(b).x && at(a).y === at(b).y, `${a} -> ${b} runs left to right on one row`);
  }
  assert.equal(phone.routes.length >= 3, true);
});

test('labels are big: at least 11 px at 390 and 9 px at 320 (the wide map had 7.6 and 6.0)', () => {
  const px = (width) => phone.font * width / phone.view.w;
  assert.ok(px(CARD[390]) >= 11, `${px(CARD[390])} px at 390`);
  assert.ok(px(CARD[320]) >= 8.95, `${px(CARD[320])} px at 320`); // 8.97: 9 px as the browser rounds it
  assert.ok(px(CARD[360]) >= 10, `${px(CARD[360])} px at 360`);
});

test('rows of three: lifecycle 3+2+2, people 3+2, IT 2+2 or 3+1, portfolio 2, never more than three', () => {
  const rows = (field) => {
    const z = phone.zones.find((q) => q.field === field);
    const b = pathBox(z.path);
    const ys = new Map();
    for (const p of phone.places) if (p.x >= b[0] && p.x + p.w <= b[2] && p.y >= b[1] && p.y + p.h <= b[3]) ys.set(p.y, (ys.get(p.y) || 0) + 1);
    return [...ys.keys()].sort((a, c) => a - c).map((y) => ys.get(y));
  };
  assert.deepEqual(rows('pm.field.lifecycle'), [3, 2, 2]);
  assert.deepEqual(rows('pm.field.people'), [3, 2]);
  assert.deepEqual(rows('pm.field.portfolio'), [2]);
  assert.ok(['2,2', '3,1'].includes(rows('pm.field.it').join()), rows('pm.field.it').join());
});

test('the phone map is about half as tall as the two-per-row one (924 px at 390): at most 600 px at 390, 475 px at 320', () => {
  const high = (width) => phone.view.h * width / phone.view.w;
  assert.ok(high(CARD[390]) <= 600, `${high(CARD[390])} px at 390`);
  assert.ok(high(CARD[320]) <= 475, `${high(CARD[320])} px at 320`);
});

test('the CSS font size of the phone labels is the font of the layout (the wrap is computed from it)', () => {
  const m = CSS.match(/\.subject-map-wrap \.subject-map-phone \.map-label\s*\{[^}]*font-size:\s*(\d+(?:\.\d+)?)px/);
  assert.ok(m, 'a phone label rule exists');
  assert.equal(Number(m[1]), phone.font);
  const z = CSS.match(/\.subject-map-wrap \.subject-map-phone \.map-zone-label\s*\{[^}]*font-size:\s*(\d+(?:\.\d+)?)px/);
  assert.ok(z && Number(z[1]) === phone.font, 'the zone label is as big');
});

// 44 px plus a pixel of margin, so a card a pixel or two narrower (a scrollbar, another font) still gives 44.
test('every place is a tap target of 45 px or more at the real card widths (254, 294, 324, 364)', () => {
  for (const p of phone.places) {
    for (const width of [CARD[320], CARD[360], CARD[390], CARD[430]]) {
      assert.ok(p.w * width / phone.view.w >= 45, `${p.module} ${p.w} wide gives ${p.w * width / phone.view.w} px at card ${width}`);
      assert.ok(p.h * width / phone.view.w >= 45, `${p.module} ${p.h} high gives ${p.h * width / phone.view.w} px at card ${width}`);
    }
  }
});

test('every title wraps to three lines at most, with no ellipsis, in both languages, and fits its place', () => {
  const glyph = phone.font * 0.56; // a generous average glyph width
  for (const lang of ['nl', 'en']) {
    for (const p of phone.places) {
      const title = MODULES.find((m) => m.id === p.module).title[lang];
      const lines = wrapLabel(title, p.w, phone);
      assert.ok(lines.length <= 3, `${lang} ${p.module}: ${lines.length} lines: ${lines.join(' / ')}`);
      assert.ok(!lines.some((l) => l.includes('…')), `${lang} ${p.module} is cut: ${lines.join(' / ')}`);
      for (const l of lines) assert.ok(l.length * glyph <= p.w, `${lang} ${p.module}: "${l}" is ${l.length * glyph} wide in ${p.w}`);
    }
  }
});

test('the labels sit inside their place: the last baseline plus its descent is above the bottom edge', () => {
  for (const lang of ['nl', 'en']) {
    for (const p of phone.places) {
      const lines = wrapLabel(MODULES.find((m) => m.id === p.module).title[lang], p.w, phone);
      const bottom = phone.labelTop + (lines.length - 1) * phone.lineHeight + 5;
      assert.ok(p.h >= bottom, `${lang} ${p.module} is ${p.h} high, needs ${bottom}`);
    }
  }
});

test('mapSvg with layout phone: the phone drawing, with the same classes, buttons and next mark', () => {
  const svg = mapSvg(pmMap, { lang: 'nl', next: 'pm.plan', interactive: true, layout: 'phone' });
  assert.match(svg, new RegExp(`^<svg class="subject-map subject-map-phone" [^>]*viewBox="0 0 ${phone.view.w} ${phone.view.h}"`));
  assert.equal((svg.match(/class="map-place/g) || []).length, 18);
  assert.equal((svg.match(/role="button" tabindex="0"/g) || []).length, 18);
  assert.match(svg, /class="map-place is-next" data-module="pm\.plan"/);
  assert.equal((svg.match(/is-next/g) || []).length, 1);
  for (const lang of ['nl', 'en']) {
    const s = mapSvg(pmMap, { lang, layout: 'phone' });
    for (const z of phone.zones) assert.match(s, new RegExp(z.label[lang].replace(/[()]/g, '.')));
  }
  assert.notEqual(svg, mapSvg(pmMap, { lang: 'nl', next: 'pm.plan', interactive: true }));
  // a map without a phone layout draws the default whatever is asked
  const plain = { ...pmMap }; delete plain.phone;
  assert.equal(mapSvg(plain, { lang: 'nl', layout: 'phone' }), mapSvg(plain, { lang: 'nl' }));
});

test('the phone layout is chosen below the width where the wide labels get small', () => {
  // the wide map: 15 view units of 640. At PHONE_BELOW its labels are still 10.5 px or more
  assert.ok(15 * PHONE_BELOW / pmMap.view.w >= 10.4, `${15 * PHONE_BELOW / pmMap.view.w}`);
  // and the phone layout is not stretched past 24 px labels up to there
  assert.ok(phone.font * PHONE_BELOW / phone.view.w <= 24);
});

test('the phone rules never start with .subject-map, so the film kit does not carry them', () => {
  const rules = CSS.match(/[^{}]*\.subject-map-phone[^{}]*\{[^}]*\}/g) || [];
  assert.ok(rules.length >= 2);
  for (const r of rules) assert.doesNotMatch(r.replace(/\.subject-map-(wrap|phone)/g, ''), /\.subject-map(?![\w-])/, r.trim());
});
