// The shared closing scene of a field or module film (v17): the subject map the
// app shows, drawn by the same function (mapSvg, src/ui/subjectmap.js), so a
// film and the app show one drawing. Dev tool, not shipped.
//
//   const svg = await mapScene({ subject: 'pm', highlight: ['pm.plan'] });
//   css += mapStyles();           // the film page does not load styles.css
//
// mapScene returns one <svg class="subject-map"> string for the stage:
//  - both languages in the one drawing: every label is a pair of groups,
//    .l-nl and .l-en, and the page's lang attribute hides one (mapStyles);
//  - each highlighted module is a lit place (class is-lit) and a cue group
//    (data-cue="map-<module slug>", see mapCue), so a beat can focus it in the
//    focus colours; every other place keeps only its drawing and label;
//  - the labels of the lit places are fitted to their tiles (fitLabel, "Label fit"
//    below); every other label is the app's;
//  - no buttons, no tab stops: a film is not interactive.
// mapStyles returns the app's own .subject-map rules (read from styles.css, so a
// change to the map reaches the films at their next build) with the app's colour
// variables mapped onto the film palette, plus the lit place and the language switch.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './build-film.mjs';
import { mapCue, textUnits } from './assert.mjs';
import { mapSvg } from '../../src/ui/subjectmap.js';
import { STRINGS } from '../../src/i18n.js';
import { SUBJECTS } from '../../src/content/courses/index.js';

// The words the app uses for the four levels (src/i18n.js level_1 to level_4).
export const levelWords = (lang) => [1, 2, 3, 4].map((n) => STRINGS[lang][`level_${n}`]);

// The cue key of a highlighted place: pm.plan gives "map-plan" (defined in
// assert.mjs, whose field check asks the lit places by it).
export { mapCue };

// The zoom every film closes its map on (1.5). Labels are fitted for it (fitLabels).
export const MAP_ZOOM = 1.5;


// Label fit (the follow-up of v17). The app draws every label at 15 units from
// the first baseline 74, 17 units a line, and wraps by a count of characters, so
// a long title (Leading projects outside your field, four lines in a tile 130
// high; Negotiating and, as wide as its tile) touches its tile, which a film
// shows with the lit outline at the closing zoom. mapSvg is the app's and
// pinned, so the fit is done here, on the film's own drawing, for the lit
// places only: the label is set a little smaller and, when it has two or more
// lines, closer in line spacing (its first baseline stays where the app puts it,
// under the object), until it keeps FIT_CLEAR units from the tile's sides and
// bottom. A single line stays on the app's baseline unless it descends (g, p, y)
// so far into a short tile that its halo would bite the lit outline: then it
// moves up just enough for HALO_CLEAR, by FIT_RAISE at most. A label that
// already fits is left as the app draws it, byte for byte.
const LABEL_SIZE = 15; // styles.css .map-label
const LABEL_TOP = 74; // the app's first baseline in a tile (subjectmap.js LABEL)
const LABEL_LINE = 17; // the app's line height
// A lit label has a halo 3 units beyond its ink (stroke-width 6px) and the lit
// outline is a 3-unit stroke on the tile border, 1.5 units inside it: at 4.5 units
// from the border the halo meets the outline, 6 leaves 1.5 units of air.
const FIT_CLEAR = 6; // units to the tile's sides and, for a block of lines, its bottom
const HALO_CLEAR = 4.5; // units under a single line's ink: its halo stays off the lit outline
const FIT_RAISE = 3; // the first baseline moves up this far only when a short tile cannot hold the lines otherwise
const FIT_MIN = 0.85; // a fitted label is at least this share of the map's label size
const DESC = 0.22; // descender depth of the label font (Inter 500, g p y), as a share of its size
const DESCENDS = /[gjpqy,;]/; // the letters that reach below the baseline
const decode = (t) => t.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// widths: each line's width at LABEL_SIZE units; w, h: the tile; descends: the
// (single) line has letters below its baseline. Returns null when the app's
// drawing fits, else { size, top, step } for the lines; throws when no label size
// within FIT_MIN, or no raise within FIT_RAISE, fits.
export function fitLabel(widths, w, h, descends = true) {
  const n = widths.length;
  let size = Math.min(LABEL_SIZE, (LABEL_SIZE * (w - 2 * FIT_CLEAR)) / Math.max(...widths));
  const room = (sz) => h - FIT_CLEAR - DESC * sz; // the lowest baseline a block of lines may have
  // lines n, first baseline top: the largest size (up to the one asked) whose lines, 1.05 of the size apart at the
  // closest, end within room
  const stack = (top, sz) => {
    const s = n > 1 ? Math.min(sz, (h - FIT_CLEAR - top) / ((n - 1) * 1.05 + DESC)) : sz;
    return { size: s, top, step: n > 1 ? Math.min(LABEL_LINE, Math.max(1.05 * s, (room(s) - top) / (n - 1))) : LABEL_LINE };
  };
  let { top, step } = { top: LABEL_TOP, step: LABEL_LINE };
  if (n > 1 && top + (n - 1) * step > room(size)) {
    ({ size, top, step } = stack(LABEL_TOP, size));
    // a tile too short for two lines at the app's baseline: the first baseline moves up, by 3 units at most
    if (size < LABEL_SIZE * FIT_MIN) ({ size, top, step } = stack(LABEL_TOP - FIT_RAISE, Math.min(LABEL_SIZE, (LABEL_SIZE * (w - 2 * FIT_CLEAR)) / Math.max(...widths))));
  }
  // one line: its descenders and their halo stay off the lit outline (a short tile, 79 high, holds 74 + 3.3 only just)
  if (n === 1 && descends && top + DESC * size > h - HALO_CLEAR) {
    top = Math.floor((h - HALO_CLEAR - DESC * size) * 100) / 100;
    if (top < LABEL_TOP - FIT_RAISE) throw new Error(`mapScene: a descending label does not fit a tile ${h} high within a raise of ${FIT_RAISE} units`);
  }
  if (size < LABEL_SIZE * FIT_MIN - 1e-9) throw new Error(`mapScene: a label of ${n} line(s) does not fit a tile of ${w} by ${h} at ${Math.round(LABEL_SIZE * FIT_MIN * 10) / 10} units or more`);
  if (size >= LABEL_SIZE - 1e-9 && top === LABEL_TOP && step === LABEL_LINE) return null;
  const r = (v) => Math.round(v * 100) / 100;
  return { size: r(Math.floor(size * 100) / 100), top: r(top), step: r(Math.floor(step * 100) / 100) };
}

// svg: the app's map in one language; places: the map's places to fit. The label of
// each is rewritten in place (font-size on its text, new baselines on its tspans).
// It reads the app's markup (mapSvg's place group and label, see subjectmap.js)
// and fails the build on anything it does not expect: a label it cannot find or
// read, or baselines other than LABEL_TOP and LABEL_LINE (tests/maplabels.test.js).
export function fitLabels(svg, places) {
  let out = svg;
  for (const p of places) {
    const re = new RegExp(`(data-module="${p.module.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^]*?)<text class="map-label" text-anchor="middle">([^]*?)</text>`);
    const m = re.exec(out);
    if (!m) throw new Error(`mapScene: could not find the label of ${p.module}`);
    const lines = [...m[2].matchAll(/<tspan x="([\d.]+)" y="([\d.]+)">([^<]*)<\/tspan>/g)];
    if (!lines.length) throw new Error(`mapScene: the label of ${p.module} has no lines`);
    if (lines.length !== m[2].split('<tspan').length - 1) throw new Error(`mapScene: could not read every line of the label of ${p.module}`);
    lines.forEach((l, i) => {
      const want = p.y + LABEL_TOP + i * LABEL_LINE;
      if (Math.abs(Number(l[2]) - want) > 0.01) throw new Error(`mapScene: the app draws line ${i + 1} of ${p.module} on baseline ${l[2]}, the label fit assumes ${want} (LABEL_TOP, LABEL_LINE)`);
    });
    const texts = lines.map((l) => decode(l[3]));
    const fit = fitLabel(texts.map((t) => (textUnits(t) * LABEL_SIZE) / 22), p.w, p.h, texts.some((t) => DESCENDS.test(t)));
    if (!fit) continue;
    const tspans = lines.map((l, i) => `<tspan x="${l[1]}" y="${Math.round((p.y + fit.top + i * fit.step) * 100) / 100}">${l[3]}</tspan>`).join('');
    const style = fit.size < LABEL_SIZE ? ` style="font-size:${fit.size}px"` : '';
    out = out.replace(re, (all, head) => `${head}<text class="map-label" text-anchor="middle"${style}>${tspans}</text>`);
  }
  return out;
}

const LABEL = /<text class="map-(?:zone-)?label"[^>]*>[\s\S]*?<\/text>/g;

// Each highlighted place becomes lit and a cue group; every other place loses its
// hit area. A highlighted place whose markup is not found is an error: the film
// must never end on a map that silently lights nothing.
export function lightPlaces(svg, highlight = []) {
  const lit = new Set(highlight);
  const done = new Set();
  const out = svg.replace(/<g class="map-place([^"]*)" data-module="([^"]+)"([^>]*)>(<rect class="map-hit"[^>]*\/>)?/g, (all, cls, id, rest, hit) => {
    if (!lit.has(id)) return `<g class="map-place${cls}" data-module="${id}"${rest}>`;
    done.add(id);
    return `<g class="map-place${cls} is-lit" data-module="${id}" data-cue="${mapCue(id)}"${rest}>${hit || ''}`;
  });
  for (const id of lit) if (!done.has(id)) throw new Error(`mapScene: could not light ${id}: its place is not drawn as <g class="map-place" data-module="${id}">`);
  return out;
}

export async function mapScene({ subject, highlight = [] }) {
  const file = join(ROOT, `src/content/courses/maps/${subject}.js`);
  if (!existsSync(file)) throw new Error(`mapScene: no map for subject ${subject}`);
  const map = (await import(pathToFileURL(file).href)).default;
  for (const id of highlight) if (!map.places.some((p) => p.module === id)) throw new Error(`mapScene: ${id} is no place of the ${subject} map`);
  const lit = map.places.filter((p) => highlight.includes(p.module));
  const nl = fitLabels(mapSvg(map, { lang: 'nl' }), lit);
  const en = fitLabels(mapSvg(map, { lang: 'en' }), lit);
  const pairs = [nl.match(LABEL) || [], en.match(LABEL) || []];
  if (pairs[0].length !== pairs[1].length || !pairs[0].length) throw new Error('mapScene: the two languages draw different labels');
  let i = 0;
  const svg = nl.replace(LABEL, () => { const k = i++; return `<g class="l-nl">${pairs[0][k]}</g><g class="l-en">${pairs[1][k]}</g>`; });
  // a place: its lit state and cue; the hit area is only drawn where it shows the lit outline
  return lightPlaces(svg, highlight);
}

// The colour variables the app's map rules read, on the film palette. The zone
// colours are the app's: petrol, ochre, the primary and the secondary fill.
const PALETTE = `
.subject-map{--card:var(--anatomy-face);--line:var(--anatomy-faint);--heading:var(--anatomy-strong);--accent:var(--fp-accent);--ok:#A87433;--primary:#276F81;--secondary-fill:#1F3E73;--font-body:var(--fp-sans);--map-halo:var(--anatomy-face)}
.iso[data-theme="light"] .subject-map{--primary:#0B291B;--secondary-fill:#0F2042;--map-halo:none}
.subject-map .map-hit{display:none}
.subject-map .map-place.is-lit .map-hit{display:block;fill:color-mix(in srgb,var(--fp-accent) 16%,transparent);stroke:var(--fp-accent);stroke-width:3}
.iso[lang="en"] .subject-map .l-nl,.iso:not([lang="en"]) .subject-map .l-en{display:none}
`;

// The top-level rules of a stylesheet, as [selector, raw rule text], comments
// blanked. Enough for the app's styles.css (no braces inside strings).
function topRules(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, (c) => ' '.repeat(c.length));
  const out = [];
  let i = 0;
  while (i < src.length) {
    const open = src.indexOf('{', i);
    if (open < 0) break;
    let depth = 1;
    let j = open + 1;
    for (; j < src.length && depth; j++) depth += src[j] === '{' ? 1 : src[j] === '}' ? -1 : 0;
    const sel = src.slice(i, open).trim();
    const start = open - src.slice(i, open).trimStart().length;
    out.push([sel, src.slice(start, j).trim()]);
    i = j;
  }
  return out;
}

// css: the app's stylesheet (styles.css; a test passes its own). Every rule that
// styles the map must be a top-level rule whose selectors all start with
// .subject-map (the wrapper excepted): anything else would be lost in the film,
// so it fails the build instead.
const MAP_SEL = /\.subject-map(?![\w-])/;
// The zone colours of a subject whose map has zones coloured in the app: styles.css keeps them as
// `.subject-map-wrap .z-<zone> { --zone: ... }` (the wrapper is the app's), so the plain rules above never carry
// them, and a film of that subject asks for them: mapStyles(css, 'eng'). Projects has no such rules and keeps
// its page byte for byte. A zone of the map without its rule in styles.css fails the build (tests/mapscene.test.js
// checks this list against the map).
const ZONES = { eng: ['plant', 'making', 'energy', 'digital'] };
function zoneRules(css, subject) {
  if (subject === undefined) return '';
  // a misspelt subject ('Eng', a field id) would quietly drop the zone colours: only a subject of the index counts
  if (!SUBJECTS.includes(subject)) throw new Error(`mapStyles: no subject ${subject} (one of ${SUBJECTS.join(', ')})`);
  if (!ZONES[subject]) return '';
  const found = new Map(topRules(css).filter(([sel]) => /^\.subject-map-wrap \.z-[a-z]+$/.test(sel)).map(([sel, raw]) => [sel.split('.z-')[1], raw]));
  return ZONES[subject].map((z) => {
    if (!found.has(z)) throw new Error(`mapStyles: no colour for the zone ${z} of ${subject} in styles.css (.subject-map-wrap .z-${z})`);
    return found.get(z).replace('.subject-map-wrap ', '.subject-map ');
  }).join('\n');
}
export function mapStyles(css = readFileSync(join(ROOT, 'styles.css'), 'utf8'), subject = undefined) {
  const rules = [];
  for (const [sel, raw] of topRules(css)) {
    if (sel.startsWith('@')) {
      if (MAP_SEL.test(raw.slice(sel.length))) throw new Error(`mapStyles: a .subject-map rule inside ${sel.split(/[\s(]/)[0]} in styles.css; the films cannot carry it, move it out or style the map without it`);
      continue;
    }
    if (!MAP_SEL.test(sel)) continue;
    const parts = sel.split(',').map((s) => s.trim());
    const bad = parts.find((s) => !/^\.subject-map(?![\w-])/.test(s));
    if (bad) throw new Error(`mapStyles: the selector "${bad}" in styles.css does not start with .subject-map; the films cannot carry it`);
    rules.push(raw);
  }
  if (rules.length < 15) throw new Error('mapStyles: the .subject-map rules are gone from styles.css');
  const zones = zoneRules(css, subject);
  return `${PALETTE.trim()}\n${rules.join('\n')}\n${zones ? `${zones}\n` : ''}`;
}
