// Dev tool, not shipped. The room of the four CNC films (Task 17, pilot P1: eng.machining.cnc split into one
// film per lesson, the old film's machine kept): a small vertical machining centre with a vice and a plate, a
// tool setter, a tool magazine and a control pendant, and the HUD pieces of its scenes (the program listing,
// the offset table, the first-off counter, the single-block lamp, the close-up inset, the CAM screen). The
// films eng.machining.cnc, .gcode, .offsets and .cam import it; each composes its own HUD and stage.
//
// The model is asserted against the worked examples of the four lessons (the import fails if a value
// drifts). The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it lives somewhere else.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
export const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
export const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
export const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
export const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The captions' {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;

// gcode: the slot program, read the way the control reads it (modal G codes,
// absolute from G54, F in mm/min).
const PROG = [
  ['N10', 'G90 G54'],
  ['N20', 'T3 M06'],
  ['N30', 'S3200 M03'],
  ['N40', 'G00 G43 H3 Z25 M08'],
  ['N50', 'X0 Y-10'],
  ['N60', 'G01 Z-3 F150'],
  ['N70', 'Y40 F640'],
  ['N80', 'G02 X20 Y60 R20'],
  ['N90', 'G00 Z25 M09'],
  ['N100', 'M30'],
];
const START = [35, -38, 50]; // where the tool stands after the tool change, in G54
const RAPID = 30000; // mm/min, assumed; only used for the (tiny) rapid times
function compile(lines, start) {
  let pos = start.slice();
  let mode = 0;
  let F = 0;
  const out = [];
  for (const [n, w] of lines) {
    const to = pos.slice();
    let moved = false;
    let R = 0;
    for (const word of w.split(' ')) {
      const L = word[0];
      const v = Number(word.slice(1));
      if (L === 'G' && [0, 1, 2, 3].includes(v)) mode = v;
      else if (L === 'X') { to[0] = v; moved = true; } else if (L === 'Y') { to[1] = v; moved = true; } else if (L === 'Z') { to[2] = v; moved = true; } else if (L === 'F') F = v;
      else if (L === 'R') R = v;
    }
    const b = { n, kind: !moved ? 'none' : mode === 0 ? 'rapid' : mode === 1 ? 'feed' : 'arc', from: pos.slice(), to, F, len: 0, time: 0 };
    if (b.kind === 'arc') {
      const dx = to[0] - pos[0];
      const dy = to[1] - pos[1];
      const c = Math.hypot(dx, dy);
      const h = Math.sqrt(Math.max(0, R * R - (c / 2) ** 2));
      const side = mode === 2 ? 1 : -1; // G02: the centre lies right of the chord
      b.c = [(pos[0] + to[0]) / 2 + (side * h * dy) / c, (pos[1] + to[1]) / 2 - (side * h * dx) / c];
      b.a0 = Math.atan2(pos[1] - b.c[1], pos[0] - b.c[0]);
      const a1 = Math.atan2(to[1] - b.c[1], to[0] - b.c[0]);
      let sw = mode === 2 ? b.a0 - a1 : a1 - b.a0;
      while (sw <= 0) sw += 2 * Math.PI;
      b.sw = mode === 2 ? sw : -sw;
      b.r = R;
      b.len = R * sw;
    } else if (moved) b.len = Math.hypot(to[0] - pos[0], to[1] - pos[1], to[2] - pos[2]);
    if (b.kind === 'rapid') b.time = (b.len / RAPID) * 60;
    else if (b.kind !== 'none') b.time = (b.len / F) * 60;
    out.push(b);
    pos = to;
  }
  return out;
}
const BLOCKS = compile(PROG, START);
const blk = (n) => BLOCKS.find((b) => b.n === n);
assert(near(0.05 * 4 * 3200, 640, 1e-9), 'F640 = 0,05 × 4 × 3.200');
assert(near(blk('N60').len, 28, 1e-9), 'N60 feeds 28 mm');
assert(near(blk('N70').len, 50, 1e-9), 'N70 is 50 mm (Y-10 to Y40)');
assert(near(blk('N70').time, 4.7, 0.05), 'N70 takes 4,7 s at F640');
assert(near(blk('N80').c[0], 20, 1e-9) && near(blk('N80').c[1], 40, 1e-9), 'N80 arc centre (20, 40), R20');
assert(near(blk('N80').len, 10 * Math.PI, 1e-9), 'N80 is a quarter circle of R20');
// cnc: tool 5 typed 112,43 instead of 121,43 → 9 mm deeper; first-off saves a run of 200 × €35
assert(near(121.43 - 112.43, 9, 1e-9), '9 mm too deep');
assert(200 * 35 === 7000, '200 × €35 = €7.000');
// offsets: radius from a 9,98 cutter; wear offset half the diameter error; 6 crashes
assert(near(9.98 / 2, 4.99, 1e-9), 'radius 4,99');
assert(near(0.01 / 2, 0.005, 1e-12), 'wear 0,005 on the radius');
assert(3 + 2 + 1 === 6, '6 crashes: 3 length, 2 H number, 1 work offset');
assert(5 * 12000 === 60000, 'the presetter case: 5 × €12.000');
// cam: 150 programs, 4 h CAM, 2,5 h prove-out going to 1 h
assert(near(1.5 * 150 * 110, 24750, 1e-9), 'cam: €24.750 machine time saved');

// ---------------------------------------------------------------- the world (mm)
// x along the table, y toward the operator, z up; the spindle axis stands at
// x = 0, y = 0. The table carries the vice and the plate and moves in x and y;
// the head moves in z. Program (G54) point (px, py, pz) sits at table-local
// world (px - 10, 25 - py, TOP + pz).
const W = 640;
const H = 400;
const TOP = 120; // plate top
const PL = { x: -30, y: -50, w: 60, d: 100, r: 0.6 }; // the plate, table-local
const NOSE_S = 30; // tool face below the nose: holder and collet
const TOOLS = {
  probe: { len: NOSE_S + 48 },
  mill: { len: NOSE_S + 40, r: 5 },
  drill: { len: NOSE_S + 58, r: 4 },
};
const HB0 = TOP + 40 + TOOLS.mill.len + 30; // head bottom at rest (mill tip 40 over the plate)
const SETTER = [110, 20, 95]; // tool setter on the table: centre and pad top
const HOLE = [30, 0]; // the drilled hole, program coordinates
const C = {
  TOP, PL, NOSE_S, TOOLS, HB0, SETTER, HOLE, START, blocks: BLOCKS,
  prog: PROG,
};

const FIT = [
  ...k.boxCorners({ x: -150, y: -185, w: 300, d: 305 }, -8, 30),
  ...k.boxCorners({ x: -70, y: -185, w: 140, d: 60 }, 30, 400),
  [-250, -56, 240], [-250, -56, 0],
];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: 58, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6, steps = 2) => S(k.slabOf({ r: 1, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 20, bevel = 0) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const planeOf = (y) => k.sideMatrix([0, y], 0, P, 'left'); // face y = const: (x, -z)
const planeX = (x) => k.sideMatrix([x, 0], 0, P, 'right'); // face x = const: (-y, -z)
const f1 = (v) => (Math.round(v * 10) / 10).toString();

// ---------------------------------------------------------------- base, ways, column
const BASE = { x: -150, y: -185, w: 300, d: 300, r: 4 };
const base = (() => {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -5), -8, 2, P)}"/>`];
  for (const [x, y] of k.corners(BASE, 18)) out.push(post(x, y, 9, -8, 0, { tone: 'lo' }, 6));
  const bolts = k.corners(BASE, 9);
  const fy = BASE.y + BASE.d;
  out.push(box(BASE, 0, 30, { tone: 'lo', inner: L(k.sideSeam(BASE, 6, P, 2), { tone: 'faint' }) }, 0.8));
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 30, P, 2), { tone: 'faint' }));
  out.push(L(bolts.map(([x, y]) => k.ring(x, y, 2.6, 30, P, 14)).join(''), { tone: 'lo' }) + D(bolts.map(([x, y]) => at([x, y, 30])), { size: 0.5 }));
  // a name plate on the front face, three rule lines for its text
  out.push(`<g transform="${planeOf(fy)}"><path class="iso-fill" d="M-120 -24h56v14h-56z"/><path class="iso-line" data-tone="lo" d="M-120 -24h56v14h-56z"/><path class="iso-line" data-tone="lo" data-free="" d="M-114 -20.5h34M-114 -17h44M-114 -13.5h26"/></g>`);
  out.push(D([[-118, fy, 22], [-66, fy, 22], [-118, fy, 12], [-66, fy, 12]].map(at), { size: 0.4 }));
  // a chip trough along the front, with a drain
  const tr = { x: -130, y: 80, w: 260, d: 26, r: 3 };
  out.push(L(k.planOutline(tr, 30, P, 2) + k.planOutline(k.insetPlan(tr, 3), 30, P, 2), { tone: 'lo' }));
  out.push(L(k.ring(110, 93, 4, 30, P, 16), { tone: 'mid' }));
  return out.join('');
})();
const yways = [-105, 89].map((x) => {
  const way = { x, y: -118, w: 16, d: 196, r: 1 };
  const bolts = [-100, -70, -40, -10, 20, 50].map((y) => at([x + 8, y, 36]));
  return box(way, 30, 36, { crease: 'lo' }, 0) + D(bolts, { size: 0.4, tone: 'lo' }) + box({ x: x + 2, y: 70, w: 12, d: 8, r: 0.6 }, 36, 41, {}, 0);
}).join('');

const COL = { x: -70, y: -185, w: 140, d: 62, r: 3 };
const column = (() => {
  const out = [box(COL, 30, 400, {}, 0.8)];
  const fy = COL.y + COL.d;
  // the +x side: cast ribs (seams) and a cable duct
  out.push(L([120, 220, 320].map((z) => k.sideSeam(COL, z, P, 2)).join(''), { tone: 'faint' }));
  // Z ways on the front face
  for (const x of [-52, 40]) {
    out.push(box({ x, y: fy, w: 12, d: 5, r: 0.5 }, 110, 392, { crease: 'lo' }, 0.3));
    out.push(D([150, 200, 250, 300, 350].map((z) => at([x + 6, fy + 5, z])), { size: 0.4, tone: 'lo' }));
  }
  // a cap on top with the Z motor
  out.push(box(k.insetPlan(COL, 6), 400, 404, { crease: 'lo' }, 0.4));
  out.push(post(0, -150, 18, 404, 440, {}, 22, 0.6));
  out.push(post(0, -150, 13, 440, 446, { tone: 'lo' }, 24));
  return out.join('');
})();

// the tool magazine beside the column: a carousel with hanging holders
const MAGC = [118, -150, 330];
const magazine = (() => {
  const [mx, my, mz] = MAGC;
  const out = [box({ x: 70, y: my - 8, w: 30, d: 16, r: 1 }, mz - 2, mz + 10, {}, 0.4)];
  const hold = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    hold.push({ x: mx + Math.cos(a) * 34, y: my + Math.sin(a) * 34 });
  }
  hold.sort((p, q) => k.depthOf([p.x, p.y, 0], P) - k.depthOf([q.x, q.y, 0], P));
  const back = hold.filter((h) => k.depthOf([h.x - mx, h.y - my, 0], P) < 0);
  const front = hold.filter((h) => k.depthOf([h.x - mx, h.y - my, 0], P) >= 0);
  const holder = (h, i) => post(h.x, h.y, 6, mz - 24, mz - 4, { tone: 'mid' }, 8) + post(h.x, h.y, i % 3 ? 2.5 : 3.5, mz - 44, mz - 24, { tone: 'hi' }, 6);
  out.push(back.map(holder).join(''));
  out.push(post(mx, my, 42, mz - 4, mz + 4, {}, 30, 0.6));
  out.push(post(mx, my, 14, mz + 4, mz + 16, { tone: 'lo' }, 24, 0.4));
  out.push(D(G.dotsOf(G.frameOf([mx, my, mz + 4], Z, X, Y), 0, 36, 8, P, { least: -1 }), { size: 0.45, tone: 'lo' }));
  out.push(front.map(holder).join(''));
  return out.join('');
})();

// ---------------------------------------------------------------- saddle, table, vice, plate
const saddle = [
  box({ x: -115, y: -58, w: 230, d: 116, r: 2 }, 36, 52, { inner: L(k.sideSeam({ x: -115, y: -58, w: 230, d: 116, r: 2 }, 41, P, 2), { tone: 'faint' }) }),
  box({ x: -108, y: -46, w: 216, d: 12, r: 0.8 }, 52, 56, { crease: 'lo' }, 0.3),
  box({ x: -108, y: 34, w: 216, d: 12, r: 0.8 }, 52, 56, { crease: 'lo' }, 0.3),
  // the Y handwheel boss on the front
  S(G.disc(0, 4, 7, G.frameOf([60, 58, 44], Y, X, Z), P), { tone: 'mid' }),
].join('');

const TABLE = { x: -140, y: -48, w: 280, d: 96, r: 2 };
const table = (() => {
  const out = [box(TABLE, 56, 70, { inner: L(k.sideSeam(TABLE, 60, P, 2), { tone: 'faint' }) })];
  out.push(L([-24, 0, 24].map((y) => k.planOutline({ x: TABLE.x, y: y - 4, w: TABLE.w, d: 8, r: 0 }, 70, P, 1)).join(''), { tone: 'faint' }));
  const t = k.sideTicks(TABLE.x + 8, TABLE.x + TABLE.w - 8, 5, 5, TABLE.y + TABLE.d + 0.3, 68, [1.6, 3.4], P);
  out.push(L(t.minor, { tone: 'lo' }) + L(t.major, { tone: 'mid' }));
  // the tool setter on the right of the table
  const [sx, sy] = SETTER;
  out.push(post(sx, sy, 10, 70, 75, { tone: 'lo' }, 24, 0.4));
  out.push(post(sx, sy, 6.5, 75, 91, {}, 24, 0.3));
  out.push(`<g data-cue="setter">${post(sx, sy, 5, 91, SETTER[2], { tone: 'hi' }, 22)}</g>`);
  out.push(D([at([sx + 6.5, sy, 84])], { size: 0.6, tone: 'hi' }));
  return out.join('');
})();

const vice = (() => {
  const out = [];
  out.push(box({ x: -66, y: -56, w: 150, d: 112, r: 2 }, 70, 76, {}, 0.4));
  out.push(D([[-62, -52], [-62, 52], [80, -52], [80, 52]].map(([x, y]) => at([x, y, 76])), { size: 0.45, tone: 'lo' }));
  out.push(box({ x: -58, y: -52, w: 136, d: 104, r: 1.5 }, 76, 96, { inner: L(k.sideSeam({ x: -58, y: -52, w: 136, d: 104, r: 1.5 }, 90, P, 2), { tone: 'faint' }) }, 0.5));
  out.push(L(k.planOutline({ x: -30, y: -46, w: 60, d: 92, r: 0 }, 96, P, 1), { tone: 'faint' }));
  return out.join('');
})();
const jawFixed = [
  box({ x: -44, y: -52, w: 14, d: 104, r: 0.8 }, 96, 128, {}, 0.5),
  L(k.planOutline({ x: -32.5, y: -52, w: 2.5, d: 104, r: 0 }, 128, P, 1), { tone: 'lo' }),
  D([-30, 0, 30].map((y) => at([-30, y, 110])), { size: 0.5, tone: 'mid' }),
].join('');
const plate = (() => {
  const out = [box(PL, 100, TOP, { tone: 'hi' }, 0.3, 2)];
  return out.join('');
})();
const jawMove = (() => {
  const out = [box({ x: 30, y: -52, w: 14, d: 104, r: 0.8 }, 96, 128, {}, 0.5)];
  out.push(L(k.planOutline({ x: 30, y: -52, w: 2.5, d: 104, r: 0 }, 128, P, 1), { tone: 'lo' }));
  out.push(box({ x: 44, y: -40, w: 24, d: 80, r: 1.5 }, 96, 116, {}, 0.5));
  out.push(D([-30, 0, 30].map((y) => at([44, y, 110])), { size: 0.5, tone: 'mid' }));
  // the screw, its boss and the handle
  out.push(box({ x: 78, y: -14, w: 8, d: 28, r: 1 }, 76, 104, {}, 0.4));
  const Fs = G.frameOf([86, 0, 92], X, Y, Z);
  out.push(S(G.disc(0, 10, 6, Fs, P), { tone: 'mid' }));
  out.push(S(G.disc(10, 16, 4, Fs, P), { tone: 'hi' }));
  out.push(S(G.disc(0, 52, 2.6, G.frameOf([96, -26, 92], Y, X, Z), P), { tone: 'hi' }));
  out.push(S(G.disc(0, 9, 4.2, G.frameOf([96, 26, 92], Y, X, Z), P), { tone: 'lo' }));
  return out.join('');
})();

// ---------------------------------------------------------------- head (moves in z)
const HEAD = { x: -42, y: -112, w: 84, d: 128, r: 5 };
const head = (() => {
  const hb = HB0;
  const out = [];
  out.push(box({ x: -58, y: -123, w: 116, d: 12, r: 1 }, hb - 6, hb + 104, {}, 0.5));
  out.push(D([[-52, hb], [52, hb], [-52, hb + 96], [52, hb + 96]].map(([x, z]) => at([x, -111, z])), { size: 0.45, tone: 'lo' }));
  out.push(box(HEAD, hb, hb + 72, { inner: L(k.sideSeam(HEAD, hb + 12, P, 2) + k.sideSeam(HEAD, hb + 62, P, 2), { tone: 'faint' }) }, 0.8));
  // vents on the +x side
  const vx = HEAD.x + HEAD.w;
  out.push(L([0, 1, 2, 3, 4].map((i) => k.segment([vx, -40 - i * 9, hb + 30], [vx, -40 - i * 9, hb + 50], P)).join(''), { tone: 'lo' }));
  // the spindle motor on top, with cooling fins
  out.push(post(0, -48, 26, hb + 72, hb + 76, { tone: 'lo' }, 28, 0.4));
  out.push(post(0, -48, 23, hb + 76, hb + 124, {}, 22, 0.6));
  out.push(L([84, 92, 100, 108, 116].map((z) => k.sideArc(0, -48, 23, hb + z, P)).join(''), { tone: 'faint' }));
  out.push(post(0, -48, 15, hb + 124, hb + 130, { tone: 'lo' }, 24, 0.4));
  out.push(box({ x: 18, y: -60, w: 14, d: 22, r: 1 }, hb + 90, hb + 110, { tone: 'lo' }, 0.3));
  // a little name plate on the front face of the head
  const fy = HEAD.y + HEAD.d;
  out.push(`<g transform="${planeOf(fy)}"><path class="iso-line" data-tone="lo" d="M-30 ${-(hb + 58)}h40v10h-40z"/><path class="iso-line" data-tone="lo" data-free="" d="M-26 ${-(hb + 54.5)}h26M-26 ${-(hb + 51.5)}h32"/></g>`);
  out.push(D([[-30, hb + 58], [10, hb + 58], [-30, hb + 48], [10, hb + 48]].map(([x, z]) => at([x, fy, z])), { size: 0.35 }));
  return out.join('');
})();
// the spindle housing and nose under the head (a cue of its own: the spindle)
const spindle = (() => {
  const hb = HB0;
  const F = G.frameOf([0, 0, hb], [0, 0, -1], X, Y);
  return [
    S(G.solidOf([[0, 24], [16, 24], [18, 21], [24, 21], [26, 17], [30, 17]], F, P), { inner: L(G.arcOf(F, 16, 24, P), { tone: 'faint' }) }),
    D(G.dotsOf(F, 4, 24, 8, P), { size: 0.45, tone: 'lo' }),
  ].join('');
})();
// a loc-line coolant hose from the head down toward the tool
const coolant = (() => {
  const out = [];
  const pts = [[24, 14, HB0 - 2], [26, 16, HB0 - 9], [26, 17, HB0 - 16], [24, 16, HB0 - 23], [21, 14, HB0 - 30], [18, 12, HB0 - 37]];
  out.push(post(24, 14, 4.5, HB0 - 2, HB0, { tone: 'lo' }, 14));
  for (const [x, y, z] of pts.slice(1)) out.push(S(k.cylinder(x, y, 3.2, z, 6.5, P, 14, 0.3), { tone: 'mid', crease: 'lo' }));
  out.push(S(G.solidOf([[0, 2.6], [5, 1.4]], G.frameAlong([16, 11, HB0 - 39], [-6 / 14, -4 / 14, -12 / 14]), P), { tone: 'hi' }));
  return out.join('');
})();

// ---------------------------------------------------------------- the pendant (control)
const PEND = { x: -250, y: -70, w: 82, d: 14, r: 2 };
const pendant = (() => {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: -224, y: -78, w: 30, d: 30, r: 3 }, -8, 1, P)}" style="opacity:.6"/>`);
  out.push(box({ x: -224, y: -78, w: 30, d: 30, r: 3 }, -8, -2, { tone: 'lo' }, 0.4));
  out.push(post(-209, -63, 5, -2, 168, {}, 18));
  out.push(box(PEND, 168, 240, {}, 0.6));
  const fy = PEND.y + PEND.d;
  // screen recess, buttons, a feed-override knob and the emergency stop
  out.push(`<g transform="${planeOf(fy)}"><path class="fp-screen" d="M-244 -234h46v32h-46z"/><path class="iso-line" data-tone="lo" d="M-244 -234h46v32h-46z"/>`
    + `<path class="iso-line" data-tone="faint" data-free="" d="M-240 -229h24M-240 -225h32M-240 -221h20M-240 -217h28M-240 -213h22"/>`
    + [0, 1, 2, 3, 4, 5].map((i) => `<path class="iso-line" data-tone="lo" d="M${-242 + i * 7} -196h5v-5h-5z"/>`).join('')
    + [0, 1, 2, 3, 4, 5].map((i) => `<path class="iso-line" data-tone="lo" d="M${-242 + i * 7} -188h5v-5h-5z"/>`).join('')
    + `</g>`);
  out.push(`<g data-cue="prove">${g('lamp', '')}</g>`);
  out.push(S(G.disc(0, 4, 5.5, G.frameOf([-182, fy, 222], Y, X, Z), P), { tone: 'mid' }));
  out.push(L(G.circleOf(G.frameOf([-182, fy, 222], Y, X, Z), 4, 4, P, 20), { tone: 'faint' }));
  out.push(S(G.disc(0, 3, 6.5, G.frameOf([-182, fy, 186], Y, X, Z), P), { tone: 'lo' }));
  out.push(S(G.disc(3, 7, 5, G.frameOf([-182, fy, 186], Y, X, Z), P), { tone: 'hi' }));
  out.push(D(k.corners(PEND, 3).map(([x, y]) => at([x, y, 240])), { size: 0.4 }));
  return out.join('');
})();

// ---------------------------------------------------------------- HUD (stage space, fixed size)
const mono = (x, y, t, size = 20, anchor = 'start', cls = 'fp-ink fp-code') => `<text class="${cls}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
const panel = (x, y, w, h) => `<path class="fp-panel" d="M${x + 8} ${y}h${w - 16}a8 8 0 0 1 8 8v${h - 16}a8 8 0 0 1 -8 8h${-(w - 16)}a8 8 0 0 1 -8 -8v${-(h - 16)}a8 8 0 0 1 8 -8z"/>`;

// the program listing: one text per word, so words can carry cues
const CW = 12; // char width of the mono font at 20 px (0.6 em)
const LIST = { x: 14, y: 56, w: 312, lh: 27 };
const listing = (() => {
  const out = [panel(LIST.x, LIST.y, LIST.w, 22 + PROG.length * LIST.lh)];
  out.push(`<g data-cue="line">${g('cur', '')}</g>`);
  const cueOf = (w, n) => {
    if (/^M\d+$/.test(w)) return 'mcode';
    if (w === 'G90') return 'abs';
    if (w === 'G01' && n === 'N60') return 'modal';
    return '';
  };
  PROG.forEach(([n, words], i) => {
    const y = LIST.y + 32 + i * LIST.lh;
    let col = 0;
    const x0 = LIST.x + 30;
    out.push(mono(x0, y, n, 20, 'start', 'fp-ink fp-code fp-dim'));
    col = 5;
    for (const w of words.split(' ')) {
      const c = cueOf(w, n);
      const t = mono(x0 + col * CW, y, w);
      out.push(c ? `<g data-cue="${c}">${t}</g>` : t);
      col += w.length + 1;
    }
    if (n === 'N70') out.push(`<g data-cue="modal">${mono(x0 + col * CW, y, '(G01)', 20, 'start', 'fp-ink fp-code fp-ghost')}</g>`);
  });
  // the stamp "proven": a ring with a tick, top right of the listing
  const sx = LIST.x + LIST.w - 34;
  const sy = LIST.y + 34;
  out.push(`<g data-cue="proven">${g('stamp', `<circle class="fp-mark fp-stamp" cx="${sx}" cy="${sy}" r="20"/><path class="fp-mark fp-stamp" d="M${sx - 9} ${sy}l6 7l13 -14"/>`)}</g>`);
  return out.join('');
})();

// the offset table: T3 and T5 with their length and radius
const TAB = { x: 14, y: 300, w: 300, h: 86 };
const offsets = (() => {
  const { x, y, w, h } = TAB;
  const out = [panel(x, y, w, h)];
  out.push(mono(x + 16, y + 30, 'T', 20, 'start', 'fp-ink fp-code fp-dim') + mono(x + 120, y + 30, 'L', 20, 'end', 'fp-ink fp-code fp-dim') + mono(x + 196, y + 30, 'R', 20, 'end', 'fp-ink fp-code fp-dim'));
  out.push(`<path class="fp-mark" d="M${x + 12} ${y + 40}h${w - 24}"/>`);
  out.push(g('rowT3', ''), g('rowT5', ''));
  return out.join('');
})();

// the first-off counter
const counter = g('counter', '', ' data-cue="counter"');

// the inset (top view or section), right-hand side
const INS = { x: 356, y: 82, w: 270, h: 200 };
const inset = g('inset', `${panel(INS.x, INS.y, INS.w, INS.h)}<clipPath id="fp-insclip"><path d="M${INS.x + 4} ${INS.y + 4}h${INS.w - 8}v${INS.h - 8}h${-(INS.w - 8)}z"/></clipPath><g clip-path="url(#fp-insclip)">${g('insBody', '')}<g data-cue="rcomp">${g('insR', '')}</g><g data-cue="wear">${g('insW', '')}</g><g data-cue="section">${g('insS', '')}</g><g data-cue="crash">${g('insC', '')}</g></g>`);

// the CAM screen: a monitor in stage space
const CAMS = { x: 14, y: 56, w: 380, h: 280 };
const camScreen = g('cam', [
  `<g data-cue="cam">${panel(CAMS.x, CAMS.y, CAMS.w, CAMS.h)}<path class="fp-mark" d="M${CAMS.x + 10} ${CAMS.y + 34}h${CAMS.w - 20}"/>${[0, 1, 2].map((i) => `<circle class="fp-mark" cx="${CAMS.x + 22 + i * 16}" cy="${CAMS.y + 18}" r="4.5"/>`).join('')}</g>`,
  g('camBody', ''),
  `<g data-cue="path">${g('camPath', '')}</g>`,
  `<g data-cue="post">${g('camPost', '')}</g>`,
  `<g data-cue="sim">${g('camSim', '')}</g>`,
].join(''));

// ---------------------------------------------------------------- the drawing
export const world = [
  `<g data-cue="pend">${g('pendant', pendant)}</g>`,
  g('base', base + yways),
  g('column', column),
  `<g data-cue="mag">${g('mag', magazine)}</g>`,
  g('saddle', saddle),
  g('table', [
    table, vice, jawFixed, plate,
    g('slot', ''), g('hole', ''),
    `<g data-cue="g54">${g('g54', '')}</g>`,
    `<g data-cue="abs">${g('absDim', '')}</g>`,
    `<g data-cue="inc">${g('incDim', '')}</g>`,
    jawMove,
    `<g data-cue="gauge">${g('gauge', '')}</g>`,
  ].join('')),
  g('head', head + `<g data-cue="spindle">${spindle}</g>` + `<g data-cue="mcode">${coolant}</g>`),
  `<g data-cue="probe">${g('tool', '')}</g>`,
  g('touch', ''),
  `<g data-cue="toolL">${g('lenDim', '')}</g>`,
  `<g data-cue="axes">${g('axes', '')}</g>`,
  `<g data-cue="home">${g('home', '')}</g>`,
].join('');

// ---------------------------------------------------------------- HUD pieces (each film picks its own)
// the single-block lamp (the control's "enkelregel" switch), bottom right
export const sbk = g('sbk', `${panel(W - 168, H - 70, 154, 56)}${mono(W - 154, H - 34, '▸ N70', 20)}<circle class="fp-mark" cx="${W - 44}" cy="${H - 42}" r="16"/><path class="fp-mark" d="M${W - 44} ${H - 42}l-11 8M${W - 58} ${H - 34}l3 -2M${W - 30} ${H - 34}l-3 -2M${W - 44} ${H - 58}v3"/>`, ' data-cue="prove"');
// a card: the stage draws its panel and rows per frame (cardSvg of the stage library)
export const cardGroup = g('card', '', ' data-cue="card"');
export const hudParts = { list: g('list', listing, ' data-cue="prog"'), tab: g('tab', offsets, ' data-cue="table"'), counter, sbk, inset, cam: camScreen, card: cardGroup };

// ---------------------------------------------------------------- cameras
// [screen x, screen y, visible width]; `dx` shifts the machine right of a HUD panel, `dy` up above one.
export const cam = (p, w, dx = 0, dy = 0) => { const [x, y] = at(p); return [Math.round((x + (dx * w) / W) * 10) / 10, Math.round((y + (dy * w) / W) * 10) / 10, w]; };

export { P, W, H, C, at, g, panel, mono, PROG, BLOCKS, LIST, TAB, INS, CAMS, CW, TOP, near, assert };

// ---------------------------------------------------------------- page script and styles (shared by the four films)
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
// A source keeps only the top-level declarations (function, const, let) that the text of the stage names, and what
// those name in turn: a declaration stays when a kept one mentions its name (a superset, never less). The page
// of a film that draws a machine would otherwise carry the whole kit (35 KB) and the whole lathe module (48 KB).
function shake(source, rootText) {
  const starts = [...source.matchAll(/^(?:function|const|let) ([A-Za-z0-9_$]+)/gm)];
  const chunks = starts.map((m, i) => ({ name: m[1], text: source.slice(m.index, i + 1 < starts.length ? starts[i + 1].index : source.length) }));
  const word = (n) => new RegExp(`(?<![\\w$.])${n.replace(/\$/g, '\\$')}(?![\\w$])`);
  const keep = new Set();
  const visit = (c) => {
    if (keep.has(c.name)) return;
    keep.add(c.name);
    for (const o of chunks) if (!keep.has(o.name) && word(o.name).test(c.text)) visit(o);
  };
  for (const c of chunks) if (word(c.name).test(rootText)) visit(c);
  return { prelude: source.slice(0, starts[0].index), body: chunks.filter((c) => keep.has(c.name)).map((c) => c.text).join('') };
}
function latheScriptOf(stageText) {
  const used = [...new Set([...stageText.matchAll(/\bG\.([A-Za-z0-9_$]+)/g)].map((m) => m[1]))];
  const { prelude, body } = shake(latheSource, used.join(' '));
  for (const n of used) if (!new RegExp(`(?:function|const) ${n}\\b`).test(body)) throw new Error(`the stage calls G.${n}, which the lathe module does not have`);
  return `const G = (() => {${prelude}${body}\nreturn { ${used.join(', ')} };})();\n`;
}
const noComments = (s) => s.replace(/^[ \t]*\/\/.*\n/gm, ''); // whole-line comments stay in the source only
// The page script of a film: the kit, the lathe module, the preamble (what the stage reads), the stage library
// of this folder and the film's own stage (its scenes and the closing of the function), then the beat warp.
// scenes: [{ beats: [{ nl }] , dur }]; cams: the camera moves, one per scene; extra: more preamble.
export function stageScriptOf(ownStage, { cams, dur, extra = '' }) {
  const LIB = noComments(readFileSync(join(HERE, 'stage-lib.js'), 'utf8'));
  const OWN = noComments(readFileSync(ownStage, 'utf8'));
  const LATHE = latheScriptOf(LIB + OWN);
  const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(cams)};\nconst W = ${W}, H = ${H};\nconst LIST = ${JSON.stringify(LIST)}, TAB = ${JSON.stringify(TAB)}, INS = ${JSON.stringify(INS)}, CAMS = ${JSON.stringify(CAMS)}, CW = ${CW};\n${extra}`;
  const RUN = ['timeline.mjs', 'player-runtime.js', 'beatwarp.js'].map((f) => readFileSync(join(HERE, '../_kit', f), 'utf8')).join('\n');
  const kit = shake(kitScript(), `${LIB}\n${OWN}\n${LATHE}\n${RUN}`);
  return `${kit.prelude}${kit.body}\n${LATHE}${preamble}${LIB}${OWN}\n;\n${readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8')}`;
}
// the beat starts of every scene (fractions of the scene, by the Dutch words), as the stage times its moves
export function beatTimes(scenes, plainWords, beatStarts) {
  C.B = scenes.map((s) => {
    const fake = { dur: 1, beats: s.beats.map((b) => ({ text: { nl: 'x '.repeat(plainWords(b.nl)).trim() } })) };
    return beatStarts(fake, 'nl').concat(1);
  });
  C.dur = scenes.map((s) => s.dur);
}

export const css = `
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-code{font-family:var(--anatomy-mono);font-weight:500}
.fp-svg .fp-dim{fill:var(--anatomy-muted)}
.fp-svg .fp-ghost{fill:var(--anatomy-muted);font-style:italic}
.fp-panel{fill:var(--anatomy-card);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.fp-screen{fill:var(--anatomy-shade-0)}
.fp-cur{fill:color-mix(in srgb,var(--fp-accent) 16%,transparent);stroke:none}
.fp-stamp{stroke-width:3}
.fp-cut{fill:var(--anatomy-shade-1)}
.fp-solidfill{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linejoin:round}
.fp-hatch{fill:none;stroke:var(--anatomy-lo);stroke-width:.9}
.fp-air{fill:var(--anatomy-shade-0)}
.fp-lamp{fill:var(--fp-accent)}
.fp-touch{fill:none;stroke:var(--fp-accent);stroke-width:1.6;vector-effect:non-scaling-stroke}
.fp-path{fill:none;stroke:var(--anatomy-mid);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
[data-cue][data-on] .fp-path{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-solidfill{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-cur{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent)}
`;
