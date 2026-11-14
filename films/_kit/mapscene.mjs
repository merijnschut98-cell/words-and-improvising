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
//  - no buttons, no tab stops: a film is not interactive.
// mapStyles returns the app's own .subject-map rules (read from styles.css, so a
// change to the map reaches the films at their next build) with the app's colour
// variables mapped onto the film palette, plus the lit place and the language switch.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './build-film.mjs';
import { mapCue } from './assert.mjs';
import { mapSvg } from '../../src/ui/subjectmap.js';
import { STRINGS } from '../../src/i18n.js';

// The words the app uses for the four levels (src/i18n.js level_1 to level_4).
export const levelWords = (lang) => [1, 2, 3, 4].map((n) => STRINGS[lang][`level_${n}`]);

// The cue key of a highlighted place: pm.plan gives "map-plan" (defined in
// assert.mjs, whose field check asks the lit places by it).
export { mapCue };

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
  const nl = mapSvg(map, { lang: 'nl' });
  const en = mapSvg(map, { lang: 'en' });
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
.subject-map{--card:var(--anatomy-face);--line:var(--anatomy-faint);--heading:var(--anatomy-strong);--accent:var(--fp-accent);--ok:#A87433;--primary:#276F81;--secondary-fill:#1F3E73;--font-body:var(--fp-sans)}
.iso[data-theme="light"] .subject-map{--primary:#0B291B;--secondary-fill:#0F2042}
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
export function mapStyles(css = readFileSync(join(ROOT, 'styles.css'), 'utf8')) {
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
  return `${PALETTE.trim()}\n${rules.join('\n')}\n`;
}
