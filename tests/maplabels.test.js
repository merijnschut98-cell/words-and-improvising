// v17 follow-up: a lit place's label must keep clear of its tile in the film's
// map scene, in both languages, at the zoom the films close on. The app's own
// map (mapSvg, pinned in mapphone.test.js) is not touched: the kit's mapScene
// fits the labels of the highlighted places in the film's drawing only.
//
// Measured like the kit measures all drawn text: CHAR_W / textUnits
// (films/_kit/assert.mjs, the width table of the stage font, 22 units), scaled
// to the label's size. Clearances are in map units (a tile is 116 to 220 wide);
// the zoom enlarges both the label and the tile, so the ratio stays, and the
// stage size of the label is checked on top of it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import pmMap from '../src/content/courses/maps/pm.js';
import { textUnits } from '../films/_kit/assert.mjs';
import { mapScene, MAP_ZOOM } from '../films/_kit/mapscene.mjs';

const CLEAR = 6; // units between a label and its tile border, each side and at the bottom
const BASE = 15; // the size of the app's map labels (styles.css .map-label)
const DESC = 0.22; // descender depth of the label font, as a share of its size
const decode = (s) => s.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// The label of one place in one language, read back from the film's drawing.
function labelOf(svg, id, lang) {
  const at = svg.indexOf(`data-module="${id}"`);
  const rest = svg.slice(at, svg.indexOf('data-module="', at + 10) < 0 ? undefined : svg.indexOf('data-module="', at + 10));
  const g = rest.match(new RegExp(`<g class="l-${lang}">(<text class="map-label"([^>]*)>([\\s\\S]*?)</text>)</g>`));
  assert.ok(g, `${id} ${lang}: no label`);
  const size = (/font-size:([\d.]+)px/.exec(g[2]) || [0, BASE])[1];
  const lines = [...g[3].matchAll(/<tspan x="[\d.]+" y="([\d.]+)">([^<]*)<\/tspan>/g)].map((m) => ({ y: Number(m[1]), text: decode(m[2]) }));
  return { size: Number(size), lines };
}

for (const lang of ['nl', 'en']) {
  test(`mapScene labels (${lang}): every place keeps ${CLEAR} units clear of its tile when it is lit`, async () => {
    const bad = [];
    for (const p of pmMap.places) {
      const svg = await mapScene({ subject: 'pm', highlight: [p.module] });
      const { size, lines } = labelOf(svg, p.module, lang);
      const widest = Math.max(...lines.map((l) => (textUnits(l.text) * size) / 22));
      const side = (p.w - widest) / 2;
      if (side < CLEAR - 0.05) bad.push(`${p.module} ${lang}: ${side.toFixed(1)} units beside the label (${lines.map((l) => l.text).join(' / ')} at ${size}px)`);
      // The single line of a short tile sits on the app's own baseline (74 of 79),
      // which every film has always shown; a label of two or more lines must keep clear.
      if (lines.length > 1) {
        const bottom = lines[lines.length - 1].y + DESC * size - p.y;
        if (p.h - bottom < CLEAR - 0.05) bad.push(`${p.module} ${lang}: ${(p.h - bottom).toFixed(1)} units under the label (${lines.length} lines, last baseline ${lines[lines.length - 1].y - p.y})`);
        for (let i = 1; i < lines.length; i++) if (lines[i].y - lines[i - 1].y < size * 1.04) bad.push(`${p.module} ${lang}: line ${i + 1} is ${(lines[i].y - lines[i - 1].y).toFixed(1)} under line ${i}, tighter than the ${size}px label allows`);
      }
    }
    assert.deepEqual(bad, [], `labels that touch their tile:\n  ${bad.join('\n  ')}`);
  });
}

test('mapScene labels: a fitted label stays readable at the film zoom', async () => {
  const bad = [];
  for (const p of pmMap.places) {
    const svg = await mapScene({ subject: 'pm', highlight: [p.module] });
    for (const lang of ['nl', 'en']) {
      const { size } = labelOf(svg, p.module, lang);
      if (size < BASE * 0.85 - 0.01) bad.push(`${p.module} ${lang}: ${size}px is more than 15% under the map's ${BASE}px`);
      if (size > BASE) bad.push(`${p.module} ${lang}: ${size}px is over the map's ${BASE}px`);
      if (size * MAP_ZOOM < 19) bad.push(`${p.module} ${lang}: ${(size * MAP_ZOOM).toFixed(1)} stage units at zoom ${MAP_ZOOM}, under 19`);
    }
  }
  assert.deepEqual(bad, []);
});

test('mapScene labels: a label that already fits stays the app label, and only lit places are fitted', async () => {
  const svg = await mapScene({ subject: 'pm', highlight: ['pm.plan'] });
  assert.equal(labelOf(svg, 'pm.plan', 'nl').size, BASE, 'Plannen fits and is not restyled');
  assert.ok(!svg.includes('font-size'), 'nothing else in the drawing is restyled');
  // the long English label of pm.outside, not lit here, is the app's own four lines of 17 units
  assert.deepEqual(labelOf(svg, 'pm.outside', 'en').lines.map((l) => l.y), [326, 343, 360, 377]);
});

test('mapScene labels: every film closes its map at the shared zoom, with no label workaround of its own', () => {
  const films = fs.readdirSync('films').filter((d) => fs.existsSync(`films/${d}/stage.js`) && fs.existsSync(`films/${d}/build.mjs`));
  let seen = 0;
  for (const d of films) {
    const build = fs.readFileSync(`films/${d}/build.mjs`, 'utf8');
    if (!/mapScene\(/.test(build)) continue;
    seen++;
    const stage = fs.readFileSync(`films/${d}/stage.js`, 'utf8');
    const zooms = [...stage.matchAll(/(?:MAP1\s*=\s*\{|zoom\s*=\s*\(cx\)\s*=>\s*\(\{)\s*s:\s*([\d.]+)/g)].map((m) => Number(m[1]));
    assert.ok(zooms.length, `${d}: no map zoom found`);
    for (const z of zooms) assert.equal(z, MAP_ZOOM, `${d}: closes the map at ${z}, the kit fits the labels for ${MAP_ZOOM}`);
    assert.doesNotMatch(build, /LABEL_EN|LABEL_STYLE|fitLabel/, `${d}: a label workaround of its own; the kit's mapScene fits the labels`);
  }
  assert.ok(seen >= 19, `${seen} films draw the map`);
});
