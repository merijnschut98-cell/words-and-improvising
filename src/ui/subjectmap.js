// v17: the subject map. One drawn picture of a whole field of study, each
// module a tappable place. `mapSvg` is a pure string (no DOM), so the film kit
// can end a field film on the very same picture; `subjectMap` wraps it for the
// app. Drawn isometric like the guide (azimuth 45°, elevation 30°, three face
// tones, painter's order). Every fill comes from a CSS class, so both themes
// come for free. The map shows no progress.
import { MODULES } from '../content/courses/index.js';
import { pathBox } from '../content/courses/validate.js';

const C = Math.cos(Math.PI / 6);
const S = 0.5;
const f = (n) => Math.round(n * 100) / 100;
const pt = (x, y, z) => `${f((x - y) * C)},${f((x + y) * S - z)}`;

// Where things sit inside a place (view units, from the place's top edge).
const SCALE = 1.2; // objects are drawn small and scaled up
const FLOOR = 44; // the centre of the plinth
const LABEL = 74; // first baseline of the title
const LINE = 17; // line height of the title
const LABEL_FONT_W = 8; // average glyph width at the label size, for wrapping
const MAX_LINES = 4;

// A box w × d from z0 to z1, its centre at (ox, oy). Tone set k: t (plain),
// p (plinth) or m (a mark in the accent colour). Top, left (y+), right (x+).
function box(w, d, z0, z1, ox = 0, oy = 0, k = 't') {
  const a = w / 2;
  const b = d / 2;
  const P = (x, y, z) => pt(x + ox, y + oy, z);
  return [
    `<path class="${k}-left" d="M${P(-a, b, z0)} L${P(a, b, z0)} L${P(a, b, z1)} L${P(-a, b, z1)} Z"/>`,
    `<path class="${k}-right" d="M${P(a, b, z0)} L${P(a, -b, z0)} L${P(a, -b, z1)} L${P(a, b, z1)} Z"/>`,
    `<path class="${k}-top" d="M${P(-a, -b, z1)} L${P(a, -b, z1)} L${P(a, b, z1)} L${P(-a, b, z1)} Z"/>`,
  ].join('');
}

// The small fixed set of objects, each standing on a plinth (z 0..3), drawn
// back to front. Reused across the map.
const OBJECTS = {
  desk: () => [
    box(3, 3, 3, 13, -12, -7), box(3, 3, 3, 13, 12, -7), box(3, 3, 3, 13, -12, 7), box(3, 3, 3, 13, 12, 7),
    box(32, 20, 13, 16), box(9, 7, 16, 19, -7, -1, 'm'), box(7, 5, 16, 17, 8, 3),
  ],
  board: () => [
    box(4, 4, 3, 9), box(32, 3, 9, 28),
    box(7, 1.4, 21, 26, -10, 2.2, 'm'), box(7, 1.4, 21, 26, 0, 2.2, 'm'), box(7, 1.4, 21, 26, 10, 2.2, 'm'),
    box(7, 1.4, 14, 19, -10, 2.2, 'm'), box(7, 1.4, 14, 19, 0, 2.2, 'm'),
  ],
  whiteboard: () => [
    box(2.5, 2.5, 3, 10, -13, 0), box(2.5, 2.5, 3, 10, 13, 0), box(30, 2.5, 10, 27),
    box(20, 1, 22, 23.6, -2, 1.8, 'm'), box(14, 1, 18, 19.6, -5, 1.8, 'm'), box(9, 1, 14, 15.6, -7, 1.8, 'm'),
  ],
  gate: () => [
    box(5, 5, 3, 25, -15, 0), box(30, 2.6, 18, 22.5, 0, 0, 'm'), box(5, 5, 3, 25, 15, 0),
  ],
  server: () => [
    box(24, 20, 3, 11), box(24, 20, 11, 19), box(24, 20, 19, 27),
    box(3, 1.2, 5.5, 7.5, -8, 10.6, 'm'), box(3, 1.2, 13.5, 15.5, -8, 10.6, 'm'), box(3, 1.2, 21.5, 23.5, -8, 10.6, 'm'),
  ],
  'road-stop': () => [
    box(3, 3, 3, 27), box(20, 2, 16, 28, 0, 0, 'm'),
  ],
  contract: () => [
    box(28, 34, 3, 5), box(26, 32, 5, 7, 1, -1), box(24, 30, 7, 9, 2, -2),
    box(14, 1.6, 9, 9.6, 1, -8, 'm'), box(14, 1.6, 9, 9.6, 1, -3, 'm'), box(9, 9, 9, 14, 7, 8, 'm'),
  ],
  dashboard: () => [
    box(8, 8, 3, 11), box(32, 4, 11, 28),
    box(5, 1.5, 14, 18, -10, 3.2, 'm'), box(5, 1.5, 14, 21, -3.5, 3.2, 'm'), box(5, 1.5, 14, 25, 3.5, 3.2, 'm'), box(5, 1.5, 14, 20, 10, 3.2, 'm'),
  ],
  handshake: () => [
    box(13, 13, 3, 18, -11, 0), box(10, 7, 12, 17, 0, 0, 'm'), box(13, 13, 3, 18, 11, 0),
  ],
};

export const MAP_OBJECTS = Object.keys(OBJECTS);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = (id) => String(id).split('.').pop().replace(/[^a-z0-9]/g, '');

// Greedy word wrap to about `max` characters, at most MAX_LINES lines; a title
// that still doesn't fit ends in an ellipsis (the full title stays in aria-label).
function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    if (line && (line + ' ' + word).length > max) { lines.push(line); line = word; } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  if (lines.length > MAX_LINES) {
    const keep = lines.slice(0, MAX_LINES);
    keep[MAX_LINES - 1] = `${keep[MAX_LINES - 1].replace(/[\s,;:.]+$/, '')}…`;
    return keep;
  }
  return lines;
}

const titleOf = (id, lang) => {
  const m = MODULES.find((x) => x.id === id);
  return m ? (m.title[lang] || m.title.en) : id;
};

// The whole map as one SVG string. `next` lights one place; `interactive` adds
// button semantics for the app (the film kit leaves it off). Pure.
export function mapSvg(map, { lang = 'en', next = null, theme = null, interactive = false } = {}) {
  const { w, h } = map.view;
  const byId = new Map(map.places.map((p) => [p.module, p]));
  const out = [`<svg class="subject-map" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" focusable="false"${theme ? ` data-theme="${esc(theme)}"` : ''}>`];

  for (const z of map.zones) {
    const box0 = pathBox(z.path) || [0, 0, 0, 0];
    out.push(`<g class="map-zone z-${slug(z.field)}"><path class="map-zone-area" d="${z.path}"/>`
      + `<text class="map-zone-label" x="${box0[0] + 16}" y="${box0[1] + 18}">${esc(z.label[lang] || z.label.en)}</text></g>`);
  }

  for (const [a, b] of map.routes || []) {
    const p = byId.get(a);
    const q = byId.get(b);
    if (!p || !q) continue;
    const d = `M${f(p.x + p.w / 2)} ${p.y + FLOOR} L${f(q.x + q.w / 2)} ${q.y + FLOOR}`;
    out.push(`<path class="map-road" d="${d}"/><path class="map-road-line" d="${d}"/>`);
    if (!map.routes.some(([from]) => from === b)) { // the end of the road: an arrow
      const ex = f(q.x + q.w / 2 + 40);
      const ey = q.y + FLOOR;
      out.push(`<path class="map-road-arrow" d="M${ex} ${ey - 10} L${f(ex + 16)} ${ey} L${ex} ${ey + 10} Z"/>`);
    }
  }

  // Far places first (painter's order): top to bottom, then left to right.
  const order = [...map.places].sort((p, q) => (p.y - q.y) || (p.x - q.x));
  for (const p of order) {
    const title = titleOf(p.module, lang);
    const field = (map.zones.find((z) => {
      const bx = pathBox(z.path);
      return bx && p.x >= bx[0] && p.y >= bx[1] && p.x + p.w <= bx[2] && p.y + p.h <= bx[3];
    }) || {}).field;
    const cx = f(p.x + p.w / 2);
    const lines = wrap(title, Math.floor((p.w + 4) / LABEL_FONT_W));
    const a11y = interactive ? ` role="button" tabindex="0" aria-label="${esc(title)}"` : '';
    out.push(`<g class="map-place${p.module === next ? ' is-next' : ''}" data-module="${esc(p.module)}"${a11y}>`
      + `<rect class="map-hit" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="10"/>`
      + `<g class="map-obj${field ? ` z-${slug(field)}` : ''}" transform="translate(${cx} ${p.y + FLOOR}) scale(${SCALE})">`
      + `<g class="map-plinth">${box(34, 26, 0, 3, 0, 0, 'p')}</g>${(OBJECTS[p.draw] || OBJECTS.desk)().join('')}</g>`
      + `<text class="map-label" text-anchor="middle">${lines.map((l, i) => `<tspan x="${cx}" y="${p.y + LABEL + i * LINE}">${esc(l)}</tspan>`).join('')}</text>`
      + '</g>');
  }
  out.push('</svg>');
  return out.join('');
}

// The map for the app: the SVG in a wrapper, each place a button. `onPlace`
// gets the module id on click, Enter and Space.
export function subjectMap(app, map, { onPlace, lang, next = null } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'subject-map-wrap';
  const language = lang || (app && app.lang) || (app && app.settings && app.settings.lang) || 'en';
  wrap.innerHTML = mapSvg(map, { lang: language, next, interactive: true });
  const fire = (g) => { if (onPlace) onPlace(g.getAttribute('data-module')); };
  wrap.addEventListener('click', (e) => {
    const g = e.target && e.target.closest && e.target.closest('.map-place');
    if (g) fire(g);
  });
  wrap.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    const g = e.target && e.target.closest && e.target.closest('.map-place');
    if (!g) return;
    e.preventDefault();
    fire(g);
  });
  return wrap;
}
