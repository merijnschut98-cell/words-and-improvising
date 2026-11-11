// The guide (v16 flair): "Andon", a small stack light like on every
// production line. No face; its character is light and one short line.
// Right lights the top segment petrol, a miss lights the middle ochre (never
// red: a miss is not an alarm), a celebration lights all three bottom to top.
// Drawn isometric like the course figures (azimuth 45°, elevation 30°; a lit
// top, a left and a right side tone; painted bottom to top), about a dozen
// solids. Every fill comes from a CSS class, so both themes come for free.
import { h } from './dom.js';

const C = Math.cos(Math.PI / 6);
const S = 0.5;
const K = Math.SQRT2; // a circle of radius r on the floor: rx = r·√2·cos30, ry = r·√2·sin30
const f = (n) => Math.round(n * 100) / 100;
const pt = (x, y, z) => `${f((x - y) * C)},${f((x + y) * S - z)}`;

// A box w × d from z0 to z1 on the axis: top, left (y+) and right (x+) faces.
function box(w, d, z0, z1) {
  const a = w / 2;
  const b = d / 2;
  return [
    `<path class="t-left" d="M${pt(-a, b, z0)} L${pt(a, b, z0)} L${pt(a, b, z1)} L${pt(-a, b, z1)} Z"/>`,
    `<path class="t-right" d="M${pt(a, b, z0)} L${pt(a, -b, z0)} L${pt(a, -b, z1)} L${pt(a, b, z1)} Z"/>`,
    `<path class="t-top" d="M${pt(-a, -b, z1)} L${pt(a, -b, z1)} L${pt(a, b, z1)} L${pt(-a, b, z1)} Z"/>`,
  ].join('');
}

// A cylinder of radius r from z0 to z1: left and right halves of the side, then the top.
function cyl(r, z0, z1) {
  const rx = f(r * K * C);
  const ry = f(r * K * S);
  const y0 = f(-z0);
  const y1 = f(-z1);
  return [
    `<path class="t-left" d="M${-rx},${y0} L${-rx},${y1} A${rx} ${ry} 0 0 0 0,${f(y1 + ry)} L0,${f(y0 + ry)} A${rx} ${ry} 0 0 1 ${-rx},${y0} Z"/>`,
    `<path class="t-right" d="M0,${f(y0 + ry)} L0,${f(y1 + ry)} A${rx} ${ry} 0 0 0 ${rx},${y1} L${rx},${y0} A${rx} ${ry} 0 0 1 0,${f(y0 + ry)} Z"/>`,
    `<ellipse class="t-top" cx="0" cy="${y1}" rx="${rx}" ry="${ry}"/>`,
  ].join('');
}

// Stack, bottom to top (z in world units).
const SEG_R = 6;
const SEG_H = 7;
const LIT = { idle: [], right: ['g-top'], wrong: [], celebrate: ['g-low', 'g-mid', 'g-top'] };

export function guideSvg(mood = 'idle') {
  const lit = LIT[mood] || [];
  const seg = (cls, z0) => `<g class="g-seg ${cls}${lit.includes(cls) ? ' on' : ''}${mood === 'wrong' && cls === 'g-mid' ? ' warn' : ''}">${cyl(SEG_R, z0, z0 + SEG_H)}</g>`;
  const screws = [[-7, -7], [7, -7], [7, 7], [-7, 7]].map(([x, y]) => {
    const [sx, sy] = pt(x, y, 3).split(',');
    return `<circle class="g-screw" cx="${sx}" cy="${sy}" r="0.6"/>`;
  }).join('');
  const parts = [
    `<ellipse class="g-halo" cx="0" cy="${f(10 * K * S * 0.75)}" rx="${f(13 * K * C)}" ry="${f(13 * K * S)}"/>`,
    `<g class="g-housing">${box(20, 20, 0, 3)}</g>`, // base plate
    screws, // corner screws on the plate
    `<g class="g-housing">${box(11, 11, 3, 5)}</g>`, // plinth
    `<g class="g-housing">${cyl(1.6, 5, 10)}</g>`, // pole
    `<g class="g-housing">${cyl(SEG_R + 0.5, 10, 10.8)}</g>`, // mounting flange
    seg('g-low', 10.8),
    `<g class="g-housing">${cyl(SEG_R + 0.4, 17.8, 18.6)}</g>`, // divider ring
    seg('g-mid', 18.6),
    `<g class="g-housing">${cyl(SEG_R + 0.4, 25.6, 26.4)}</g>`, // divider ring
    seg('g-top', 26.4),
    `<g class="g-housing">${cyl(SEG_R + 0.5, 33.4, 34.6)}</g>`, // cap
    `<g class="g-housing">${cyl(2, 34.6, 36)}</g>`, // cap knob
  ];
  return `<svg class="guide-svg s-${mood}" viewBox="-20 -39 40 50" aria-hidden="true" focusable="false">${parts.join('')}</svg>`;
}

// The guide is on unless he turned it off in Settings (device-only).
export const guideOn = (state) => !(state && state.settings && state.settings.guide === false);

// The guide as an element (32 px beside a line, 64 px on a done card), or
// null when it is turned off.
export function guide(state, { mood = 'idle', size = 32 } = {}) {
  if (!guideOn(state)) return null;
  return h('span', { class: `guide guide-${size}`, 'aria-hidden': 'true', html: guideSvg(mood) });
}

function hash(s) {
  let x = 7;
  for (const c of String(s)) x = (x * 31 + c.codePointAt(0)) >>> 0;
  return x;
}

// One line from a pool, seeded by the day; never the line shown last.
export function guideLine(t, key, day, last = null) {
  const pool = [].concat(t(key));
  if (!pool.length) return '';
  let i = hash(`${key}|${day}`) % pool.length;
  if (pool[i] === last && pool.length > 1) i = (i + 1) % pool.length;
  return pool[i];
}
