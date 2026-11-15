// v17 follow-up: a lit place's label must keep clear of its tile in the film's
// map scene, in both languages, at the zoom the films close on. The app's own
// map (mapSvg, pinned in mapphone.test.js) is not touched: the kit's mapScene
// fits the labels of the highlighted places in the film's drawing only.
//
// Every subject map in src/content/courses/maps is checked, not only Projects:
// a new map (Engineering) is covered the day its file lands.
//
// Measured like the kit measures all drawn text: CHAR_W / textUnits
// (films/_kit/assert.mjs, the width table of the stage font, 22 units, a few
// percent over Inter 500), scaled to the label's size. Clearances are in map
// units (a tile is 116 to 220 wide); the zoom enlarges both the label and the
// tile, so the ratio stays, and the stage size of the label is checked on top.
//
// Where the numbers come from (styles.css, the lit place in the film palette):
// a lit label has a halo of 6px stroke, 3 units beyond its ink; the lit outline
// is a 3-unit stroke on the tile border, 1.5 units inside it. So 4.5 units from
// the border is where the halo starts to bite the outline (HALO), and 6 units
// leaves 1.5 units of air (CLEAR). Inter 500 descends 0.22 of its size (g, p, y).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { textUnits } from '../films/_kit/assert.mjs';
import { mapScene, MAP_ZOOM, fitLabels } from '../films/_kit/mapscene.mjs';
import pmMap from '../src/content/courses/maps/pm.js';

const CLEAR = 6; // units between a label's ink and its tile border: each side, and under a block of lines
const HALO = 4.5; // units under a single line's ink: its halo (3) stays off the lit outline (1.5 inside the border)
const BASE = 15; // the size of the app's map labels (styles.css .map-label)
const DESC = 0.22; // descender depth of the label font, as a share of its size
const DESCENDS = /[gjpqy,;]/; // the letters that reach below the baseline
const decode = (s) => s.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// A map file has a default export with places; index.js (the registry) and
// layout.js (the shared layout helpers) are not maps and have none.
const FILES = fs.readdirSync('src/content/courses/maps').filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3));
const LOADED = await Promise.all(FILES.map(async (s) => [s, (await import(`../src/content/courses/maps/${s}.js`)).default]));
const MAPS = Object.fromEntries(LOADED.filter(([, m]) => m && Array.isArray(m.places)));
const SUBJECTS = Object.keys(MAPS);

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

test('mapScene labels: the maps checked include Projects and Engineering, and nothing else is skipped', () => {
  assert.ok(SUBJECTS.includes('pm'), SUBJECTS.join());
  assert.ok(SUBJECTS.includes('eng'), SUBJECTS.join());
  assert.deepEqual(FILES.filter((f) => !SUBJECTS.includes(f)).sort(), ['index', 'layout'], 'only the registry and the layout helpers are not maps');
});

test('mapScene labels: the label size and halo the fit assumes are the app\'s (styles.css)', () => {
  const css = fs.readFileSync('styles.css', 'utf8');
  assert.match(css, /\.subject-map \.map-label \{[^}]*font: 500 15px\/1 /, 'the map label is 15 units, weight 500');
  assert.match(css, /\.subject-map \.map-place\.is-lit \.map-label[^{]*\{[^}]*stroke-width: 6px;/, 'the lit label\'s halo is a 6px stroke');
});

for (const lang of ['nl', 'en']) {
  test(`mapScene labels (${lang}): every place of every map keeps clear of its tile when it is lit`, async () => {
    const bad = [];
    for (const [subject, map] of Object.entries(MAPS)) for (const p of map.places) {
      const svg = await mapScene({ subject, highlight: [p.module] });
      const { size, lines } = labelOf(svg, p.module, lang);
      const say = `${p.module} ${lang} (${lines.map((l) => l.text).join(' / ')} at ${size}px)`;
      const widest = Math.max(...lines.map((l) => (textUnits(l.text) * size) / 22));
      const side = (p.w - widest) / 2;
      if (side < CLEAR - 0.05) bad.push(`${say}: ${side.toFixed(1)} units beside the label`);
      const last = lines[lines.length - 1];
      if (lines.length > 1) {
        const under = p.h - (last.y + DESC * size - p.y);
        if (under < CLEAR - 0.05) bad.push(`${say}: ${under.toFixed(1)} units under the block (last baseline ${last.y - p.y})`);
        for (let i = 1; i < lines.length; i++) if (lines[i].y - lines[i - 1].y < size * 1.04) bad.push(`${say}: line ${i + 1} is ${(lines[i].y - lines[i - 1].y).toFixed(1)} under line ${i}`);
      } else {
        // one line on the app's baseline: its descenders (and their halo) must stay off the lit outline
        const under = p.h - (last.y + (DESCENDS.test(last.text) ? DESC * size : 0) - p.y);
        if (under < HALO - 0.05) bad.push(`${say}: ${under.toFixed(1)} units under the line, its halo bites the lit outline`);
      }
    }
    assert.deepEqual(bad, [], `labels that touch their tile:\n  ${bad.join('\n  ')}`);
  });
}

test('mapScene labels: a fitted label stays readable at the film zoom', async () => {
  const bad = [];
  for (const [subject, map] of Object.entries(MAPS)) for (const p of map.places) {
    const svg = await mapScene({ subject, highlight: [p.module] });
    for (const lang of ['nl', 'en']) {
      const { size, lines } = labelOf(svg, p.module, lang);
      if (size < BASE * 0.85 - 0.01) bad.push(`${p.module} ${lang}: ${size}px is more than 15% under the map's ${BASE}px`);
      if (size > BASE) bad.push(`${p.module} ${lang}: ${size}px is over the map's ${BASE}px`);
      if (size * MAP_ZOOM < 19) bad.push(`${p.module} ${lang}: ${(size * MAP_ZOOM).toFixed(1)} stage units at zoom ${MAP_ZOOM}, under 19`);
      // the label stays under the object: its first baseline moves up 3 units at most
      if (lines[0].y - p.y < 74 - 3 - 0.05) bad.push(`${p.module} ${lang}: first baseline ${lines[0].y - p.y}, more than 3 units over the app's 74`);
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
  // the label of pm.portfolio, not lit here, stays on the app's baseline although it descends
  assert.deepEqual(labelOf(svg, 'pm.portfolio', 'en').lines.map((l) => l.y), [98]);
});

// A made-up place in the app's markup, for the fit's own guards.
const place = { module: 'x.one', x: 0, y: 100, w: 116, h: 130 };
const drawn = (spans) => `<g class="map-place" data-module="x.one"><rect class="map-hit"/><g class="map-obj"></g><text class="map-label" text-anchor="middle">${spans}</text></g>`;

test('fitLabels: label text is copied as text, never read as a replacement pattern', () => {
  const t = 'Pay $&amp; or $1 $`';
  const out = fitLabels(drawn(`<tspan x="58" y="174">${t}</tspan>`), [place]);
  const fit = /style="font-size:([\d.]+)px"><tspan x="58" y="174">([^<]*)<\/tspan><\/text><\/g>$/.exec(out);
  assert.ok(fit, `the long line was fitted: ${out}`);
  assert.equal(fit[2], t);
  assert.equal(out.split('data-module').length, 2, 'the place is drawn once');
});

test('fitLabels: fails loudly when the app draws its label other than the fit assumes', () => {
  // the app's first baseline is 74 under the tile's top, 17 units a line: anything else is a changed mapSvg
  assert.throws(() => fitLabels(drawn('<tspan x="58" y="172">Leading projects outside your field</tspan>'), [place]), /baseline/);
  assert.throws(() => fitLabels(drawn('<tspan x="58" y="174">Leading</tspan><tspan x="58" y="190">projects</tspan>'), [place]), /baseline/);
  assert.throws(() => fitLabels(drawn('<tspan dx="1" y="174">Leading</tspan>'), [place]), /no lines|could not read/);
  assert.throws(() => fitLabels(drawn('').replace('class="map-label" ', 'class="map-label big" '), [place]), /could not find the label/);
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
  assert.ok(pmMap.places.length >= 16);
});
