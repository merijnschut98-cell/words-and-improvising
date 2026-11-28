// Dev tool, not shipped. Builds the explainer film "Een lijn lezen / Reading a
// line" for the topic Lijnontwerp of Lijnen en automatisering (linebasics L1,
// layout L2, buffers L3, simulation L4).
//
//   node films/eng.lines.design/build.mjs            build the page
//   node films/eng.lines.design/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.lines.design.html: one offline page with
// the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.4.
//
// The drawing is the world of the figure eng.lines.buffer (same parts, same
// camera): four portal stations over one belt conveyor, each with a pneumatic
// cylinder and a stack light, a supply pallet behind station 1 and a tote at
// the end. The film adds operators behind the manual stations, a light curtain
// in front of the automatic test, footprints on the floor and belt zones that
// light up. The products on the belt are moved by the same discrete line
// simulation as the figure (lineSim below, also run here to assert each
// scene's story), so blocked and starved happen because the model says so.
// Cards in stage space carry the cycle-time chart, the cell, the buffer level,
// the simulation screen and Little's law.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const A = await import(pathToFileURL(join(SKILL, 'kit/audit.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The captions' and the narration's {n:...} numbers are then
// checked against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// linebasics: 7 h = 25.200 s for 420 pumps → takt 60 s; stations 50/55/65/45 s,
// the cover station (65 s) is the bottleneck: 25.200 / 65 = 387 a shift, 33 short
const SHIFT = 7 * 3600;
const DEMAND = 420;
const TAKT = SHIFT / DEMAND;
const CYC1 = [50, 55, 65, 45];
const BN1 = Math.max(...CYC1);
const OUT1 = Math.floor(SHIFT / BN1);
assert(SHIFT === 25200 && TAKT === 60, 'takt 25.200 / 420 = 60 s');
assert(BN1 === 65 && CYC1.indexOf(BN1) === 2 && OUT1 === 387 && DEMAND - OUT1 === 33, 'bottleneck 65 s, 387 a shift, 33 short');
// layout: four stations of about 40 s, the press-fit unit jams 4 min, 1 place between;
// 240 / 40 = 6 places before and after; 8 hard-linked stations of 95 % ≈ 66 %
const CYC2 = [40, 40, 40, 40];
const JAM = 240;
const PLACES2 = JAM / CYC2[2];
assert(PLACES2 === 6, '240 / 40 = 6');
assert(Math.round(100 * 0.95 ** 8) === 66, '0,95^8 ≈ 66 %');
// buffers: press B 30 s with stops under 3 min every 20 min, leak tester C 36 s
// (bottleneck): 180 / 36 = 5 places; 120 − 100 = 20 an hour refills 5 in 15 min;
// 20 − 3 = 17 min running between stops
const CYC3 = [28, 30, 36, 32];
const STOP3 = 180;
const PLACES3 = STOP3 / CYC3[2];
const PER_B = 3600 / CYC3[1];
const PER_C = 3600 / CYC3[2];
const REFILL = PER_B - PER_C;
const FILL_MIN = (PLACES3 / REFILL) * 60;
assert(PLACES3 === 5 && PER_B === 120 && PER_C === 100 && REFILL === 20, '5 places, 120 and 100 an hour');
assert(FILL_MIN === 15 && 5 / 20 === 0.25 && 20 - STOP3 / 60 === 17, '15 min refill, 17 min running');
// simulation: 112 an hour against 105, about 40 products in the line → 0,36 h ≈ 21 min
const SIM = { out: 112, target: 105, wip: 40, fixed: [3, 2] };
const LEAD_H = SIM.wip / SIM.out;
assert(near(LEAD_H, 0.36, 0.005) && Math.round(LEAD_H * 60) === 21, 'Little: 40 / 112 = 0,36 h ≈ 21 min');

// The line model, the same as the figure's: a station takes a product from the
// buffer before it, works its cycle, and puts it in the buffer after it if a
// place is free (else it is blocked); with nothing to take it is starved.
// stops: per station a sorted list of [start, end] in s. Injected into the page.
function lineSim(cyc, cap, stops) {
  const n = cyc.length;
  const L = {
    t: 0, out: 0, next: 1, cyc, cap, stops, ptr: cyc.map(() => 0), outs: [],
    st: cyc.map(() => ({ part: 0, left: 0, done: false, state: 'starved', phase: 0, blocked: 0, starved: 0 })),
    buf: cap.map(() => []),
  };
  L.isDown = (i) => {
    const s = L.stops[i];
    if (!s) return false;
    while (L.ptr[i] < s.length && s[L.ptr[i]][1] <= L.t) L.ptr[i]++;
    const q = s[L.ptr[i]];
    return !!q && q[0] <= L.t;
  };
  // a running start: buf[j] products in buffer j, a product half done in every station
  L.fill = (buf) => {
    buf.forEach((m, j) => { for (let q = 0; q < m; q++) L.buf[j].push(L.next++); });
    L.st.forEach((st, i) => { st.part = L.next++; st.left = L.cyc[i] * (0.35 + 0.17 * i); st.done = false; st.state = 'run'; });
  };
  L.step = (dt) => {
    for (let i = n - 1; i >= 0; i--) {
      const st = L.st[i];
      if (L.isDown(i)) { st.state = 'fault'; continue; }
      if (st.part && st.done) {
        if (i === n - 1) { L.out++; L.outs.push([st.part, L.t]); st.part = 0; }
        else if (L.buf[i].length < L.cap[i]) { L.buf[i].push(st.part); st.part = 0; }
      }
      if (!st.part) {
        let id = 0;
        if (i === 0) id = L.next++;
        else if (L.buf[i - 1].length) id = L.buf[i - 1].shift();
        if (id) { st.part = id; st.left = L.cyc[i]; st.done = false; }
      }
      if (st.part && !st.done) { st.state = 'run'; st.left -= dt; if (st.left <= 1e-9) st.done = true; st.phase = 1 - Math.max(0, st.left) / L.cyc[i]; }
      else if (st.part) { st.state = 'blocked'; st.blocked += dt; }
      else { st.state = 'starved'; st.starved += dt; }
    }
    L.t += dt;
  };
  return L;
}
const DT = 0.25;

// The scenario of each scene: segments over its beats. A segment runs the line
// model from a running start; T[k] is the model time (s) at the start of beat
// b0 + k and the last entry the time at the end of its last beat. paced: a
// paced line that indexes every `period` s instead of the model.
const SC = [
  [{ b0: 0, b1: 3, cyc: CYC1, cap: [3, 3, 3], init: [1, 2, 2], stops: [], T: [0, 60, 130, 200, 280] }],
  [{ b0: 0, b1: 3, cyc: CYC1, cap: [3, 3, 3], init: [1, 2, 3], stops: [[], [], [], [[225, 400]]], T: [0, 60, 130, 200, 290] }],
  [{ b0: 0, b1: 3, cyc: CYC1, cap: [3, 3, 3], init: [2, 3, 3], stops: [], T: [0, 70, 140, 210, 280] }],
  [
    { b0: 0, b1: 0, paced: true, period: 40, T: [0, 200] },
    { b0: 1, b1: 2, cyc: [40, 38, 42, 36], cap: [2, 2, 2], init: [1, 1, 0], stops: [], T: [0, 90, 200] },
  ],
  [
    { b0: 0, b1: 2, cyc: CYC2, cap: [1, 1, 1], init: [1, 1, 1], stops: [[], [], [[40, 40 + JAM]], []], T: [0, 60, 190, 280] },
    { b0: 3, b1: 3, cyc: CYC2, cap: [1, PLACES2, PLACES2], init: [1, 0, PLACES2], stops: [[], [], [[20, 20 + JAM]], []], T: [0, 290] },
  ],
  [{ b0: 0, b1: 2, cyc: CYC3, cap: [2, PLACES3, 2], init: [1, PLACES3, 0], stops: [[], [[12, 230]], [], []], T: [0, 70, 150, 250] }],
  [{ b0: 0, b1: 3, cyc: CYC3, cap: [2, PLACES3, 2], init: [2, 0, 0], stops: [], T: [0, 220, 520, 640, 760] }],
  [{ b0: 0, b1: 4, cyc: [30, 32, 30, 31], cap: [4, 4, 4], init: [2, 2, 2], stops: [[], [[150, 230]], [], [[380, 410]]], T: [0, 100, 200, 300, 400, 500] }],
  [{ b0: 0, b1: 2, cyc: [30, 32, 30, 31], cap: [4, 4, 4], init: [3, 4, 3], stops: [], T: [0, 100, 200, 300] }],
];
// The story each scene tells, checked on the model.
{
  const run = (seg, until, probe) => {
    const L = lineSim(seg.cyc, seg.cap, seg.stops);
    L.fill(seg.init);
    while (L.t < until - 1e-9) { L.step(DT); if (probe) probe(L); }
    return L;
  };
  // s3: products pile up before the cover station, which runs all the time
  { let idle = 0; run(SC[2][0], 280, (L) => { if (L.st[2].state !== 'run') idle += DT; }); assert(idle < 1, 's3: the bottleneck never waits'); }
  // s5: hard-linked, the jam stops stations 1, 2 and 4 within a cycle or two
  { const L = run(SC[4][0], 190); assert(L.st[0].state === 'blocked' && L.st[1].state === 'blocked' && L.st[3].state === 'starved', 's5: one stop stops all'); }
  // s5: with 6 places before and after, the others keep working through the jam
  { let lost = 0; run(SC[4][1], 20 + JAM, (L) => { if (L.t > 20) lost += [0, 1, 3].filter((i) => L.st[i].state !== 'run').length * DT; }); assert(lost < 25, `s5: 6 places bridge the jam (${lost} s lost)`); }
  // s6: B down 218 s: C works on from 5 places for about 3 min, then is starved; A is blocked
  {
    let starvedAt = null;
    let blockedA = false;
    run(SC[5][0], 250, (L) => { if (L.st[2].state === 'starved' && starvedAt === null) starvedAt = L.t; if (L.st[0].state === 'blocked') blockedA = true; });
    assert(blockedA && starvedAt !== null && starvedAt > 12 + STOP3 - 10 && starvedAt < 230, `s6: C starved after about 3 min (${starvedAt})`);
  }
  // s7: B refills the buffer by about one place every 3 minutes
  { const L = run(SC[6][0], 760); assert(L.buf[1].length >= 3 && L.buf[1].length <= 5, `s7: refill (${L.buf[1].length})`); }
}

// ---------------------------------------------------------------- the world
// The world of the figure eng.lines.buffer: units of about 2.5 cm, z up, x
// along the line (flow to +x), +y toward the viewer. The floor is z = 0.
const W = 640;
const H = 400;
const ST = [-108, -36, 36, 108];
const SLOT0 = 14.5;
const PITCH = 7.5;
const MAXCAP = 6;
const slotX = (j, q) => ST[j + 1] - SLOT0 - PITCH * q;
const BT = 24; // belt top
const PART = 7;
const PART_H = 7;
const PLATE = { x: -146, y: -42, w: 298, d: 70, r: 4 };
const BED = { x: -130, y: -9, w: 260, d: 18, r: 1.2 };
const BELT = { x: -128, y: -7.4, w: 256, d: 14.8, r: 1 };
const RAIL_Z = 18;
const COL = 13;
const BEAM_Z = [46, 51];
const RAM = { half: 4, z0: 38, z1: 42, rod: 1.2, rodLen: 14 };
const STROKE = RAM.z0 - (BT + PART_H + 1.6);
const TOTE = { x: 137, y: -8, w: 12, d: 16, r: 1.5 };
const TOTE_H = 13;
const OP_Y = -25;
const OP_DX = -18; // beside the portal, upstream, so the portal does not hide the person
const OPS = [0, 1, 2]; // operators behind the manual and the semi-automatic stations
const CURT = { x0: ST[3] - 11, x1: ST[3] + 11, y: 19, z1: 40 };

const FIT = [...k.boxCorners(PLATE, -5, 0), [ST[0], -11, 64], [ST[3], -11, 64]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 62, elevation: 32 });
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });
const quad = (pts) => k.pathOf(pts.map(at), true);

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, {});
function put(name, ref, svg, shapes, { bias = 0, attrs = '', layer = 'back' } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, attrs, layer });
}
const S = (paths, style) => k.solidSvg(paths, style);
// Page weight: small structural parts go without crease lines.
const plain = (name) => (/^(op|curt|pallet|conv\.leg)|\.(col|rail)$/.test(name) ? { crease: 'none' } : {});
function box(name, p, z0, z1, style = {}, { steps = 2, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(p, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(p, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...plain(name), ...style, inner }) + extra;
  return put(name, [p.x + p.w / 2, p.y + p.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner, ground }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...plain(name), ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = '', inner = '', owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
const cueA = (cue) => ` data-cue="${cue}"`;

// ---------------------------------------------------------------- floor plate
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLATE, -2), -5, 2, P)}"/>`;
{
  const anchors = k.corners(PLATE, 6);
  const walk = k.lineOnTop([PLATE.x + 3.5, 21], [PLATE.x + PLATE.w - 3.5, 21], 0, P);
  const lp = { x: -140, y: 13, w: 18, d: 6, r: 0.6 };
  const rules = [14.6, 16, 17.4].map((y) => k.lineOnTop([lp.x + 2, y], [lp.x + (y > 17 ? 10 : 15), y], 0, P)).join('');
  // a walkway line behind the line too, where the operators stand
  const walk2 = k.lineOnTop([PLATE.x + 3.5, -22], [PLATE.x + PLATE.w - 3.5, -22], 0, P);
  const extra =
    L(k.planOutline(k.insetPlan(PLATE, 3.5), 0, P, 3), { tone: 'faint' }) +
    L(walk + walk2, { tone: 'faint' }) +
    `<path class="fp-plate" d="${k.planOutline(lp, 0, P, 2)}"/>` +
    L(rules, { tone: 'lo', free: true }) +
    L(anchors.map(([x, y]) => k.ring(x, y, 1.8, 0, P, 14)).join(''), { tone: 'lo' }) +
    Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box('stand.floor', PLATE, -5, 0, { tone: 'lo' }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLATE, -2.2, P, 3), { tone: 'faint' }), extra });
}

// ---------------------------------------------------------------- conveyor
for (const x of [-122, 0, 122]) {
  for (const y of [-6, 6]) {
    post('conv.leg', x, y, 1.3, 0, RAIL_Z, { tone: 'mid', crease: 'none' }, { steps: 10, layer: y > 0 ? 'front' : 'back', extra: L(k.ring(x, y, 2.2, 0, P, 10), { tone: 'lo' }) });
  }
}
box('conv.bed', BED, RAIL_Z, BT - 2, { tone: 'mid' }, { steps: 3, bevel: 0.3, inner: L(k.sideSeam(BED, RAIL_Z + 1.5, P, 3), { tone: 'faint' }) });
{
  const slats = [];
  for (let x = BELT.x + 3; x <= BELT.x + BELT.w - 2; x += 6.5) slats.push(k.lineOnTop([x, BELT.y], [x, BELT.y + BELT.d], BT, P));
  box('conv.belt', BELT, BT - 2, BT, { tone: 'lo', crease: 'none' }, { steps: 3, inner: L(slats.join(''), { tone: 'faint' }), attrs: cueA('belt') });
}
// side guides: the front one carries a pad for every buffer place; the stage
// fills the pads a buffer has
for (const [y0, layer] of [[-9, 'back'], [7.6, 'front']]) {
  const rail = { x: BED.x + 2, y: y0, w: BED.w - 4, d: 1.4, r: 0.4 };
  let extra = '';
  if (layer === 'front') {
    const pads = [];
    for (let j = 0; j < 3; j++) for (let q = 0; q < MAXCAP; q++) {
      const x = slotX(j, q);
      pads.push(`<path class="fp-pad" data-pad="${j}-${q}" d="${k.planOutline({ x: x - 2.4, y: y0 + 0.3, w: 4.8, d: 0.8, r: 0.3 }, BT + 3, P, 2)}"/>`);
    }
    extra = pads.join('');
  }
  box('conv.guide', rail, BT - 2, BT + 3, { tone: 'mid' }, { steps: 2, layer, extra });
}
for (const x of [BED.x - 3.2, BED.x + BED.w + 3.2]) discAt('conv.drum', frameY([x, -8, BT - 3.2]), 0, 16, 3.2, { tone: 'mid' }, { owner: 'conv', steps: 14 });
{
  const gx = BED.x + BED.w - 3;
  box('conv.gearbox', { x: gx - 4, y: 9, w: 8, d: 5, r: 0.6 }, BT - 9, BT - 1, { tone: 'mid' }, { steps: 2, bevel: 0.3, layer: 'front', extra: Dt([[gx - 2.6, 14, BT - 2.2], [gx + 2.6, 14, BT - 2.2]].map(at), { size: 0.4 }) });
  const FM = frameX([gx + 4, 12.6, BT - 5]);
  const fins = G.ribsOf(FM, 0.6, 13.4, 3.4, 14, P, { fade: [0.05, 0.45], seams: true });
  discAt('conv.motor', FM, 0, 14, 3.4, { tone: 'hi', crease: 'lo' }, { owner: 'conv', layer: 'front', steps: 14, inner: k.fadedSvg(fins, { tone: 'lo' }) });
}

// ---------------------------------------------------------------- out tote
{
  const mouth = k.insetPlan(TOTE, 1.2);
  const extra = `<path class="iso-shade fp-void" data-shade="0" d="${k.planOutline(mouth, TOTE_H, P, 3)}"/>` + L(k.planOutline(mouth, TOTE_H, P, 3), { tone: 'lo' });
  box('tote', TOTE, 0, TOTE_H, { tone: 'mid' }, { steps: 3, bevel: 0.4, layer: 'front', inner: L(k.sideSeam(TOTE, TOTE_H - 2.4, P, 3), { tone: 'faint' }), extra });
}

// ---------------------------------------------------------------- supply pallet behind station 1
{
  const pal = { x: ST[0] - 30, y: -40, w: 20, d: 13, r: 0.5 };
  for (const dx of [0.5, 16.5]) box('pallet.runner', { x: pal.x + dx, y: pal.y, w: 3, d: pal.d, r: 0.2 }, 0, 2.4, { tone: 'lo' }, { steps: 1 });
  const deck = [];
  for (let u = pal.x + 2.5; u < pal.x + pal.w - 1; u += 4) deck.push(k.lineOnTop([u, pal.y + 0.3], [u, pal.y + pal.d - 0.3], 3.6, P));
  box('pallet.deck', pal, 2.4, 3.6, { tone: 'mid' }, { steps: 1, extra: L(deck.join(''), { tone: 'lo' }) });
  for (const [dx, dy, lv] of [[-3.6, -3, 0], [3.4, -3, 0], [-3.6, 3.4, 0], [3.4, 3.4, 0], [-3.6, -3, 1]]) {
    const blk = plan(pal.x + pal.w / 2 + dx, pal.y + pal.d / 2 + dy, PART, PART, 0.5);
    box('pallet.block', blk, 3.6 + lv * PART_H, 3.6 + (lv + 1) * PART_H, { tone: 'hi', crease: 'lo' }, { steps: 1 });
  }
}

// ---------------------------------------------------------------- stations
// Each station is a portal over the belt: two foot rails, four columns, a beam
// with a pneumatic cylinder whose ram works the part below, and a stack light
// (bottom run, middle waiting, top fault) on the beam.
function station(i, sx) {
  const cue = cueA('station');
  for (const dx of [-7, 7]) {
    const rail = { x: sx + dx - 1.8, y: -17, w: 3.6, d: 34, r: 0 };
    box(`st${i}.rail`, rail, 0, 1.4, { tone: 'lo' }, { steps: 1, attrs: cue });
  }
  for (const dx of [-7, 7]) for (const y of [-COL, COL]) {
    box(`st${i}.col`, plan(sx + dx, y, 2.4, 2.4, 0), 1.4, BEAM_Z[0], { tone: 'mid' }, { steps: 1, layer: y > 0 ? 'front' : 'back', attrs: cue });
  }
  const beam = { x: sx - 9.5, y: -15, w: 19, d: 30, r: 0.8 };
  const fy = beam.y + beam.d;
  const label = quad([[sx - 6, fy, 47.2], [sx + 2, fy, 47.2], [sx + 2, fy, 49.8], [sx - 6, fy, 49.8]]);
  const rules = [48.1, 48.9].map((z) => k.segment([sx - 5, fy, z], [sx + (z > 48.5 ? -1 : 1), fy, z], P)).join('');
  const screws = k.corners(beam, 1.6).map(([x, y]) => at([x, y, BEAM_Z[1]]));
  box(`st${i}.beam`, beam, BEAM_Z[0], BEAM_Z[1], { tone: 'mid' }, {
    steps: 2, bevel: 0.4, layer: 'front', attrs: cue,
    inner: `<path class="fp-plate" d="${label}"/>` + L(rules, { tone: 'lo', free: true }),
    extra: Dt(screws, { size: 0.4 }),
  });
  const cz = [BEAM_Z[1], BEAM_Z[1] + 9];
  post(`st${i}.cyl`, sx, 0, 3.6, cz[0], cz[1], { tone: 'hi', crease: 'lo' }, {
    steps: 14, layer: 'front', attrs: cue,
    inner: L(k.sideArc(sx, 0, 3.6, cz[0] + 1.6, P, 24) + k.sideArc(sx, 0, 3.6, cz[1] - 1.6, P, 24), { tone: 'lo' }),
    extra: Dt(Array.from({ length: 4 }, (_, q) => at([sx + 2.6 * Math.cos(q * Math.PI / 2 + 0.6), 2.6 * Math.sin(q * Math.PI / 2 + 0.6), cz[1]])), { size: 0.35 }),
  });
  const lx = sx + 6;
  const ly = -11;
  post(`st${i}.stack-base`, lx, ly, 1.9, BEAM_Z[1], BEAM_Z[1] + 1.6, { tone: 'mid' }, { steps: 10, layer: 'front' });
  ['run', 'wait', 'fault'].forEach((name, q) => {
    const z0 = BEAM_Z[1] + 1.6 + q * 2.8;
    post(`st${i}.stack-${name}`, lx, ly, 1.6, z0, z0 + 2.8, { tone: 'mid', crease: 'lo' }, {
      steps: 10, layer: 'front', attrs: ` data-cue="stack" data-lamp="${i}-${name}"`,
      extra: q === 2 ? Dt([at([lx, ly, z0 + 2.8])], { size: 0.4, tone: 'hi' }) : '',
    });
  });
}
ST.forEach((sx, i) => station(i, sx));

// ---------------------------------------------------------------- operators
// A person behind each manual or semi-automatic station: shoes, legs, a torso
// with a collar seam, arms reaching to the belt and a head with a cap.
function operator(i) {
  const x = ST[i] + OP_DX;
  const y = OP_Y;
  const cue = cueA(i === 1 ? 'op1' : 'op');
  for (const dx of [-1.9, 1.9]) {
    post(`op${i}.leg`, x + dx, y, 1.4, 0, 30, { tone: 'lo', crease: 'none' }, { steps: 10, attrs: cue });
  }
  const torso = { x: x - 5, y: y - 2.8, w: 10, d: 5.6, r: 2 };
  box(`op${i}.torso`, torso, 30, 52, { tone: 'mid' }, { steps: 4, bevel: 0.8, attrs: cue, inner: L(k.sideSeam(torso, 49.4, P, 4) + k.sideSeam(torso, 33.6, P, 4), { tone: 'lo' }) });
  // forearms reaching forward to the belt
  for (const dx of [-5.9, 5.9]) {
    box(`op${i}.fore`, { x: x + dx - 1, y: y + 2, w: 2, d: 10, r: 0 }, 38.4, 41, { tone: 'mid' }, { steps: 1, attrs: cue });
  }
  post(`op${i}.neck`, x, y, 1.5, 52, 54, { tone: 'lo' }, { steps: 8, attrs: cue });
  {
    const c = [x, y, 57.8];
    const shape = R.solid(A.ball(c, 3.8, { name: `op${i}.head` }));
    put(`op${i}.head`, c, S(G.sphereOf(c, 3.8, P, { steps: 22 }), { tone: 'hi', crease: 'none' }), [shape], { attrs: cue });
  }
}
OPS.forEach(operator);

// ---------------------------------------------------------------- light curtain at the automatic test
{
  const cue = cueA('guard');
  for (const x of [CURT.x0, CURT.x1]) {
    box('curt.foot', plan(x, CURT.y, 4, 4, 0.4), 0, 1.2, { tone: 'lo' }, { steps: 2, bevel: 0.3, layer: 'front', attrs: cue });
    const p = plan(x, CURT.y, 1.8, 1.8, 0.3);
    const lenses = [];
    for (let z = 5; z < CURT.z1 - 2; z += 3) lenses.push(at([x + (x < ST[3] ? 0.9 : -0.9), CURT.y, z]));
    box('curt.post', p, 1.2, CURT.z1, { tone: 'mid' }, { steps: 1, layer: 'front', attrs: cue, extra: Dt(lenses, { size: 0.32, tone: 'lo' }) });
  }
}

// ---------------------------------------------------------------- live parts
// Rams are built at rest (up) and moved down along z; products are built per
// kind at the origin and placed by the stage. Kinds: 0 the pump housing,
// 1 with the impeller, 2 with the cover and its 6 screws, 3 tested (a label).
function ramSvg(i) {
  const sx = ST[i];
  const head = plan(sx, 0, RAM.half * 2, RAM.half * 2, 0.6);
  const rod = S(k.cylinder(sx, 0, RAM.rod, RAM.z1, RAM.rodLen, P, 14), { tone: 'hi', crease: 'none' });
  const block = S(k.slabOf(head, RAM.z0, RAM.z1 - RAM.z0, P, 2, 0.3), { tone: 'mid', crease: 'lo', inner: L(k.sideSeam(head, RAM.z0 + 1.3, P, 2), { tone: 'faint' }) });
  const tool = S(k.cylinder(sx, 0, 1.6, RAM.z0 - 1.2, 1.2, P, 16), { tone: 'lo', crease: 'none' });
  return `<g data-ram="${i}"${cueA(`ram${i}`)}>${rod}${block}${tool}</g>`;
}
const PRODUCT_TOP = BT + PART_H;
// the housing with its inlet spigot, shared by every kind
function housingSvg() {
  const p = plan(0, 0, PART, PART, 0.8);
  return S(k.slabOf(p, BT, PART_H, P, 2, 0.4), { tone: 'hi', crease: 'lo', inner: L(k.sideSeam(p, BT + 1.6, P, 2), { tone: 'faint' }) })
    + S(G.solidOf([[0, 1.3], [1.8, 1.3], [1.8, 1.6], [2.3, 1.6]], G.frameOf([PART / 2, 0, BT + 3], X, Y, Zv), P), { tone: 'mid', crease: 'lo' });
}
function productSvg(kind) {
  const top = PRODUCT_TOP;
  const base = '<use href="#fp-house"/>';
  if (kind === 0) return base + L(k.ring(0, 0, 2.2, top, P, 12), { tone: 'lo' });
  if (kind === 1) return base + S(k.cylinder(0, 0, 2.3, top, 1.1, P, 12, 0.2), { tone: 'mid', crease: 'lo' }) + Dt([at([0, 0, top + 1.1])], { size: 0.45 });
  if (kind === 2) {
    const lid = plan(0, 0, PART + 0.4, PART + 0.4, 1);
    const screws = Array.from({ length: 6 }, (_, q) => [2.5 * Math.cos((q / 6) * Math.PI * 2), 2.5 * Math.sin((q / 6) * Math.PI * 2)]);
    return base + S(k.slabOf(lid, top, 1.1, P, 2, 0.3), { tone: 'mid', crease: 'lo' }) + Dt(screws.map(([x, y]) => at([x, y, top + 1.1])), { size: 0.36 });
  }
  return `<use href="#fp-prod2"/><path class="fp-tag" d="${quad([[-2, PART / 2, BT + 2], [2, PART / 2, BT + 2], [2, PART / 2, BT + 4.4], [-2, PART / 2, BT + 4.4]])}"/>`;
}
const PRODUCTS = [0, 1, 2, 3].map(productSvg);

// ---------------------------------------------------------------- floor marks and belt zones (cues)
// A footprint around a station on the floor, and a zone on the belt between
// stations: invisible until their cue lights them.
const foot = (i, cue) => `<g${cueA(cue)}><path class="fp-foot" d="${k.planOutline({ x: ST[i] - 12, y: -20, w: 24, d: 40, r: 2 }, 0.05, P, 3)}"/></g>`;
const gap = (j) => `<path class="fp-zone" d="${k.planOutline({ x: ST[j] + 10, y: BELT.y + 0.6, w: ST[j + 1] - ST[j] - 20, d: BELT.d - 1.2, r: 0.6 }, BT + 0.05, P, 2)}"/>`;
const zone = (j, cue, q = MAXCAP) => `<path class="fp-zone" d="${k.planOutline({ x: ST[j + 1] - SLOT0 - PITCH * (q - 0.5), y: BELT.y + 0.6, w: PITCH * q, d: BELT.d - 1.2, r: 0.6 }, BT + 0.05, P, 2)}"/>`;
const marks = [
  foot(2, 'bn'), foot(0, 'fA'), foot(2, 'fC'),
  `<g${cueA('linked')}>${[0, 1, 2].map(gap).join('')}</g>`,
  `<g${cueA('buffer')}>${zone(1, 'buffer')}${zone(2, 'buffer')}</g>`,
  `<g${cueA('bufC')}>${zone(1, 'bufC', PLACES3)}</g>`,
].join('');

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
const layerOf = (name, f = () => true) => R.items.filter((item) => item.layer === name && f(item)).sort((a, b) => a.key - b.key).map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`).join('');
const isFloor = (item) => item.name === 'stand.floor';
const world = [
  halo,
  layerOf('back', isFloor),
  `<g data-k="marksFloor">${marks.split('<g data-cue="linked">')[0]}</g>`,
  layerOf('back', (it) => !isFloor(it)),
  `<g data-k="marksBelt">${'<g data-cue="linked">' + marks.split('<g data-cue="linked">')[1]}</g>`,
  `<g data-k="parts"></g><g data-cue="bufC"><g data-k="partsQ"></g></g><g data-cue="wip"><g data-k="partsW"></g></g>`,
  `<g data-k="rams">${ST.map((_, i) => ramSvg(i)).join('')}</g>`,
  layerOf('front'),
  `<g data-k="curtain"${cueA('guard')}>${L([6, 12, 18, 24, 30, 36].map((z) => k.segment([CURT.x0 + 0.9, CURT.y, z], [CURT.x1 - 0.9, CURT.y, z], P)).join(''), { tone: 'faint' })}</g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, not under the camera)
const slot = (cue, key) => `<g data-cue="${cue}">${`<g data-k="${key}"></g>`}</g>`;
const g = (key, body) => `<g data-k="${key}">${body}</g>`;
const hud = [
  g('tags', ''),
  g('cycC', [g('cycBase', ''), slot('cyc', 'cycBars'), slot('bn', 'cycBn'), slot('takt', 'cycTakt')].join('')),
  g('cellC', slot('cell', 'cellBody')),
  g('levelC', [g('levelBase', ''), slot('spare', 'levelUp'), g('levelRest', '')].join('')),
  g('wipC', slot('wip', 'wipBody')),
  g('simC', [g('simBase', ''), slot('sim', 'simRows'), slot('mtbf', 'simMtbf'), slot('mttr', 'simMttr')].join('')),
  g('littleC', [slot('little', 'littleBody'), g('littleCurve', '')].join('')),
].join('');
// Page weight: drop a line point within 0.45 units of the last one kept (plain M/L/Z paths only).
const slim = (s) => s.replace(/ d="([^"]*)"/g, (m, d) => {
  if (!/^[MLZ0-9 .-]+$/.test(d)) return m;
  const out = [];
  let last = null;
  for (const tok of d.match(/[MLZ][^MLZ]*/g) ?? []) {
    if (tok[0] === 'Z') { out.push('Z'); last = null; continue; }
    const xy = tok.slice(1).trim();
    const [x, y] = xy.split(/\s+/).map(Number);
    if (tok[0] === 'L' && last && Math.hypot(x - last[0], y - last[1]) < 0.45) continue;
    out.push(tok[0] + xy);
    last = [x, y];
  }
  return ` d="${out.join('')}"`;
});
const defs = `<defs><g id="fp-house">${housingSvg()}</g>${PRODUCTS.map((p, i) => `<g id="fp-prod${i}">${p}</g>`).join('')}</defs>`;
const svg = slim(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${defs}<g data-k="world">${world}</g><g data-k="hud">${hud}</g></svg>`);

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat
// cam(p, w, s): world point p at stage point s, w wide
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WHOLE = cam([0, -6, 26], 600, [320, 210]);
const START = cam([ST[0] - 6, -10, 28], 400);
const MID = cam([ST[1] + 20, -8, 28], 420);
const END = cam([ST[3] + 6, 0, 26], 400);
const OPV = cam([ST[0] + 14, -16, 32], 380);
const PRESS = cam([ST[1], -6, 34], 300);
const TEST = cam([ST[3] - 4, 4, 28], 320);
const STACK = cam([ST[2] + 10, -6, 44], 420);
const LEFT = cam([0, -6, 26], 800, [244, 266]); // the whole line bottom left, a card top right
const LEFT_N = cam([10, -6, 26], 760, [250, 236]);
const FIRST = cam([ST[0] + 30, -8, 28], 460);
const BC = cam([ST[2] - 26, -6, 28], 400);
const LINK = cam([ST[2] - 10, -6, 30], 470);
const KEYS = [
  [WHOLE, WHOLE, MID, START], // s1 along the line
  [OPV, PRESS, TEST, STACK], // s2 person or machine
  [LEFT, LEFT, LEFT, LEFT], // s3 time every station
  [WHOLE, WHOLE, LEFT], // s4 paced, unpaced or cell
  [MID, LINK, WHOLE, BC], // s5 hard-linked
  [BC, FIRST, BC], // s6 blocked and starved
  [LEFT, LEFT, LEFT_N, BC], // s7 refilling
  [LEFT, LEFT, LEFT, LEFT, LEFT], // s8 simulating
  [LEFT, LEFT, LEFT], // s9 Little's law
];

// ---------------------------------------------------------------- the film
const LB = 'eng.lines.linebasics';
const LA = 'eng.lines.layout';
const BU = 'eng.lines.buffers';
const SI = 'eng.lines.simulation';
const spec = {
  id: 'eng.lines.design',
  title: { nl: 'Een lijn lezen', en: 'Reading a line' },
  lessons: [LB, LA, BU, SI],
  scenes: [
    {
      // v14b: the Basis "how it works": a walk along the line
      id: 's1', lesson: LB, level: 1, still: 0.5, title: { nl: 'Langs de lijn', en: 'Along the line' },
      beats: [
        { nl: 'Een assemblagelijn: een rij {t:Station|stations}, elk met één vast deel van het werk.', en: 'An assembly line: a row of {t:Station|stations}, each doing one fixed part of the work.', cue: { Station: 'station' } },
        { nl: 'Een {t:Transportband|transportband} brengt het product van station naar station.', en: 'A {t:Conveyor|conveyor} carries the product from station to station.', cue: { Transportband: 'belt' } },
        { nl: 'Bij elk station komt er iets bij: huis, waaier, deksel, test. Aan het eind is de pomp af.', en: 'Each station adds something: housing, impeller, cover, test. At the end the pump is done.' },
        { nl: 'Volg één product en vraag bij elk station: wat komt erbij, en doet een mens of een machine dat?', en: 'Follow one product and ask at each station: what is added, and does a person or a machine do it?' },
      ],
    },
    {
      id: 's2', lesson: LB, level: 1, still: 0.5, title: { nl: 'Mens of machine', en: 'Person or machine' },
      beats: [
        { nl: 'Handmatig: een mens met handgereedschap, zoals hier bij het huis en het deksel.', en: 'Manual: a person with hand tools, like here at the housing and the cover.', cues: ['op'] },
        { nl: 'Halfautomatisch: de mens legt in, een pers doet het werk.', en: 'Semi-automatic: the person loads, a press does the work.', cues: ['ram1', 'op1'] },
        { nl: 'Volautomatisch: de machine doet alles, achter een lichtscherm dat stopt als iemand erdoor reikt.', en: 'Fully automatic: the machine does it all, behind a light curtain that stops if someone reaches in.', cues: ['guard'] },
        { nl: 'De {t:Signaalzuil|signaalzuil}: meestal groen draait, geel wacht, rood storing.', en: 'The {t:Stack light|stack light}: usually green running, yellow waiting, red fault.', cue: { Signaalzuil: 'stack' } },
      ],
    },
    {
      id: 's3', lesson: LB, level: 1, still: 0.5, title: { nl: 'Klok elk station', en: 'Time every station' },
      beats: [
        { nl: 'Klok de {t:Cyclustijd|cyclustijd} van elk station: {n:50}, {n:55}, {n:65} en {n:45} seconden.', en: 'Time the {t:Cycle time|cycle time} of each station: {n:50}, {n:55}, {n:65} and {n:45} seconds.', cue: { Cyclustijd: 'cyc' } },
        { nl: 'Het traagste station is de {t:Bottleneck|bottleneck}: de lijn gaat niet sneller dan {n:65} seconden.', en: 'The slowest station is the {t:Bottleneck|bottleneck}: the line cannot beat {n:65} seconds.', cue: { Bottleneck: 'bn' } },
        { nl: 'De {t:Takt|takt} is de tijd per product voor de klant: {n:25200} / {n:420} = {n:60} seconden.', en: '{t:Takt|Takt} is the time per product for the customer: {n:25200} / {n:420} = {n:60} seconds.', cue: { Takt: 'takt' }, read: { nl: '{n:7} uur = {n:25200} s', en: '{n:7} hours = {n:25200} s' } },
        { nl: '{n:65} is boven de takt: {n:387} pompen per dienst, {n:33} te weinig. Daar kijk je eerst.', en: '{n:65} is above takt: {n:387} pumps per shift, {n:33} short. That is where you look first.', cues: ['bn'], read: { nl: '{n:25200} / {n:65} = {n:387} per dienst', en: '{n:25200} / {n:65} = {n:387} per shift' } },
      ],
    },
    {
      id: 's4', lesson: LA, level: 2, still: 0.5, title: { nl: 'Getakt, vrij of cel', en: 'Paced, unpaced or cell' },
      beats: [
        { nl: 'Een {t:Getakte lijn|getakte lijn} schuift alles tegelijk door, op de takt. Elk station moet op tijd klaar zijn.', en: 'A {t:Paced line|paced line} moves everything on together, on the takt. Every station must finish in time.', cue: { 'Getakte lijn': 'belt' } },
        { nl: 'In een vrije lijn geeft elk station door als het klaar is, met kleine wachtrijen ertussen.', en: 'In an unpaced line each station passes on when it is done, with small queues in between.' },
        { nl: 'Een {t:Cel|cel}: machines in een U, met een paar operators die met het werk meelopen.', en: 'A {t:Cell|cell}: machines in a U, with a few operators who walk with the work.', cue: { Cel: 'cell' } },
      ],
    },
    {
      id: 's5', lesson: LA, level: 2, still: 0.5, title: { nl: 'Star gekoppeld', en: 'Hard-linked' },
      beats: [
        { nl: 'Vier stations van {n:40} seconden, ertussen plek voor {n:1}. De pers in station 3 loopt {n:4} minuten vast.', en: 'Four stations of {n:40} seconds, room for {n:1} between them. The press in station 3 jams for {n:4} minutes.', cues: ['ram2'] },
        { nl: '{t:Star gekoppeld|Star gekoppeld}: één stop legt alles stil. Station 1, 2 en 4 wachten.', en: '{t:Hard-linked|Hard-linked}: one stop stops everything. Stations 1, 2 and 4 wait.', cue: { 'Star gekoppeld': 'linked' }, cues: ['stack'] },
        { nl: 'Zonder buffers vermenigvuldigen de beschikbaarheden: acht stations van {n:95}% geven zo’n {n:66}%.', en: 'Without buffers, availabilities multiply: eight stations at {n:95}% give about {n:66}%.', read: { nl: '{n:95}% × … × {n:95}% (acht keer) ≈ {n:66}%', en: '{n:95}% × … × {n:95}% (eight times) ≈ {n:66}%' } },
        { nl: 'Een {t:Buffer|buffer} vangt de stop op: {n:240} / {n:40} = {n:6} plekken ervoor en erna.', en: 'A {t:Buffer|buffer} absorbs the stop: {n:240} / {n:40} = {n:6} places before and after.', cue: { Buffer: 'buffer' } },
      ],
    },
    {
      id: 's6', lesson: BU, level: 3, still: 0.5, title: { nl: 'Blocked en starved', en: 'Blocked and starved' },
      beats: [
        { nl: 'Pers B ({n:30} s) valt stil. Bottleneck C ({n:36} s) werkt door uit de buffer van {n:5} plekken.', en: 'Press B ({n:30} s) stops. Bottleneck C ({n:36} s) works on from the buffer of {n:5} places.', cues: ['bufC'], read: { nl: '{n:180} / {n:36} = {n:5} plekken', en: '{n:180} / {n:36} = {n:5} places' } },
        { nl: 'Station A raakt {t:Blocked|blocked}: het heeft een product af, maar de plek erna is vol.', en: 'Station A gets {t:Blocked|blocked}: it has a product done, but the place after it is full.', cue: { Blocked: 'fA' } },
        { nl: 'Duurt de stop langer dan {n:3} minuten, dan is de buffer leeg en staat C {t:Starved|starved}.', en: 'If the stop lasts longer than {n:3} minutes, the buffer is empty and C is {t:Starved|starved}.', cue: { Starved: 'fC' } },
      ],
    },
    {
      id: 's7', lesson: BU, level: 3, still: 0.5, title: { nl: 'Weer vol lopen', en: 'Filling up again' },
      beats: [
        { nl: 'B maakt {n:120} per uur, C {n:100}: die {t:Overcapaciteit|overcapaciteit} vult de buffer weer.', en: 'B makes {n:120} an hour, C {n:100}: that {t:Spare capacity|spare capacity} refills the buffer.', cue: { Overcapaciteit: 'spare' } },
        { nl: '{n:20} per uur: {n:5} plekken in {n:15} minuten. Met een stop elke {n:20} minuten net op tijd.', en: '{n:20} an hour: {n:5} places in {n:15} minutes. With a stop every {n:20} minutes, just in time.', cues: ['spare'], read: { nl: '{n:5} / {n:20} = {n:0.25} uur = {n:15} min', en: '{n:5} / {n:20} = {n:0.25} hour = {n:15} min' } },
        { nl: 'Alle producten in stations en buffers samen: het {t:Onderhanden werk|onderhanden werk}.', en: 'All products in stations and buffers together: the {t:WIP|WIP}.', cue: { 'Onderhanden werk': 'wip' } },
        { nl: 'Bescherm de bottleneck: de buffer ervoor vol, de buffer erna bijna leeg.', en: 'Protect the bottleneck: the buffer before it full, the buffer after it nearly empty.', cues: ['fC'] },
      ],
    },
    {
      id: 's8', lesson: SI, level: 4, still: 0.5, title: { nl: 'Simuleren', en: 'Simulating' },
      beats: [
        { nl: 'Een {t:Discrete-eventsimulatie|discrete-eventsimulatie} speelt elk product en elke stop af in de tijd.', en: 'A {t:Discrete-event simulation|discrete-event simulation} plays every product and every stop in time.', cue: { 'Discrete-eventsimulatie': 'sim' } },
        { nl: '{t:MTBF|MTBF}: de gemiddelde draaitijd tussen twee stops.', en: '{t:MTBF|MTBF}: the average running time between two stops.', cue: { MTBF: 'mtbf' } },
        { nl: '{t:MTTR|MTTR}: hoe lang een stop gemiddeld duurt. Het model is zo goed als die stopdata.', en: '{t:MTTR|MTTR}: how long a stop lasts on average. The model is as good as that stop data.', cue: { MTTR: 'mttr' } },
        { nl: 'Het model belooft {n:112} per uur tegen {n:105}, met stops van precies {n:3} minuten per {n:2} uur.', en: 'The model promises {n:112} an hour against {n:105}, with stops of exactly {n:3} minutes every {n:2} hours.', cues: ['sim'] },
        { nl: 'Echte stops duren {n:30} seconden tot {n:20} minuten. Vraag om echte stopdata en een validatie.', en: 'Real stops last {n:30} seconds to {n:20} minutes. Ask for real stop data and a validation.', cues: ['sim'] },
      ],
    },
    {
      id: 's9', lesson: SI, level: 4, still: 0.5, title: { nl: 'De wet van Little', en: 'Little’s law' },
      beats: [
        { nl: '{t:Wet van Little|Wet van Little}: onderhanden werk = output × doorlooptijd.', en: '{t:Little’s law|Little’s law}: WIP = throughput × lead time.', cue: { 'Wet van Little': 'little' } },
        { nl: '{n:40} producten in de lijn bij {n:112} per uur: {n:0.36} uur, zo’n {n:21} minuten in de lijn.', en: '{n:40} products in the line at {n:112} an hour: {n:0.36} hour, about {n:21} minutes in the line.', cues: ['little', 'wip'], read: { nl: '{n:40} / {n:112} = {n:0.36} uur ≈ {n:21} min', en: '{n:40} / {n:112} = {n:0.36} hour ≈ {n:21} min' } },
        { nl: 'Na de eerste plekken geven grotere buffers vaak weinig output erbij, maar veel meer doorlooptijd.', en: 'After the first few places, bigger buffers often add little output but much more lead time.' },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Units are written as said
// (seconden, minuten, procent); a number the voice would read badly (25.200)
// is written as words. A term is named while its cue is lit.
const SAY = [
  [ // s1 along the line
    { nl: 'Dit is een assemblagelijn voor waterpompen: een rij {t:Station|stations}, werkplekken waar telkens één vast deel van het werk gebeurt.',
      en: 'This is an assembly line for water pumps: a row of {t:Station|stations}, workplaces where one fixed part of the work is done.' },
    { nl: 'Een {t:Transportband|transportband}, een bewegende band of ketting, brengt het product van station naar station.',
      en: 'A {t:Conveyor|conveyor}, a moving belt or chain, carries the product from station to station.' },
    { nl: 'Bij elk station komt er iets bij: het pomphuis, de waaier, het deksel met zes schroeven, en tot slot de test: dan is de pomp af.',
      en: 'Each station adds something: the pump housing, the impeller, the cover with six screws, and finally the test: then the pump is done.' },
    { nl: 'Volg één product en tel de stations. Vraag bij elk: wat komt hier bij, en doet een mens dat of een machine?',
      en: 'Follow one product and count the stations. Ask at each one: what is added here, and does a person or a machine do it?' },
  ],
  [ // s2 person or machine
    { nl: 'Een handmatig station is een mens met handgereedschap, zoals hier bij het huis en het deksel.',
      en: 'A manual station is a person with hand tools, like here at the housing and the cover.' },
    { nl: 'Halfautomatisch: de mens legt in en start, en een machine doet het werk. Deze pers drukt de waaier op zijn plek.',
      en: 'Semi-automatic: the person loads and starts, and a machine does the work. This press pushes the impeller into place.' },
    { nl: 'Volautomatisch doet de machine alles, zoals deze test, achter afscherming: een lichtscherm stopt de machine als iemand erdoor reikt.',
      en: 'Fully automatic, the machine does it all, like this test, behind guarding: a light curtain stops the machine when someone reaches through.' },
    { nl: 'En aan de {t:Signaalzuil|signaalzuil}, de lampenpaal op de machine: meestal groen draait, geel wacht, rood storing. Dat verschilt soms per fabriek.',
      en: 'And by the {t:Stack light|stack light}, the lamp column on the machine: usually green running, yellow waiting, red a fault. That can differ per plant.' },
  ],
  [ // s3 time every station
    { nl: 'De {t:Cyclustijd|cyclustijd} is hoe lang een station over één product doet. Met de stopwatch: {n:50}, {n:55}, {n:65} en {n:45} seconden.',
      en: 'The {t:Cycle time|cycle time} is how long a station takes for one product. With a stopwatch: {n:50}, {n:55}, {n:65} and {n:45} seconds.' },
    { nl: 'Het langzaamste station is de {t:Bottleneck|bottleneck}: de hele lijn kan niet sneller. Ervoor hopen de producten zich op.',
      en: 'The slowest station is the {t:Bottleneck|bottleneck}: the whole line cannot go faster. Products pile up in front of it.' },
    { nl: 'De {t:Takt|takt} is de tijd per product voor de klantvraag. Zeven uur is vijfentwintigduizend tweehonderd seconden, gedeeld door {n:420} pompen: {n:60} seconden.',
      en: '{t:Takt|Takt} is the time per product to meet demand. Seven hours is twenty-five thousand two hundred seconds, divided by {n:420} pumps: {n:60} seconds.' },
    { nl: 'Het dekselstation zit met {n:65} seconden boven de takt: {n:387} pompen per dienst, {n:33} te weinig. Daar kijk je eerst.',
      en: 'The cover station, at {n:65} seconds, is above takt: {n:387} pumps per shift, {n:33} short. That is where you look first.' },
  ],
  [ // s4 paced, unpaced or cell
    { nl: 'In een {t:Getakte lijn|getakte lijn} schuift de band alles tegelijk door, op de takt: elk station moet op tijd klaar zijn.',
      en: 'In a {t:Paced line|paced line} the belt moves everything on together, on the takt: every station must finish in time.' },
    { nl: 'In een vrije lijn geeft elk station door als het klaar is, meestal op pallets over een doorlopende band, met kleine wachtrijen ertussen.',
      en: 'In an unpaced line each station passes on when it is done, usually on pallets over a belt that keeps running, with small queues in between.' },
    { nl: 'Een {t:Cel|cel} is een compacte groep machines, vaak in een U, met een paar operators die met het werk meelopen. Cellen passen bij veel varianten, getakte lijnen bij grote, stabiele aantallen.',
      en: 'A {t:Cell|cell} is a compact group of machines, often in a U, with a few operators who walk with the work. Cells suit many variants, paced lines high, stable volumes.' },
  ],
  [ // s5 hard-linked
    { nl: 'Vier stations van zo’n {n:40} seconden, met plek voor {n:1} product ertussen. Station 3, een inperspers, loopt soms {n:4} minuten vast.',
      en: 'Four stations of about {n:40} seconds, with room for {n:1} product between them. Station 3, a press-fit unit, sometimes jams for {n:4} minutes.' },
    { nl: 'Zonder buffers is de lijn {t:Star gekoppeld|star gekoppeld}: station 1 en 2 raken hun product niet kwijt, station 4 krijgt niks. Station 1 en 2 sneller maken helpt dus niet.',
      en: 'Without buffers the line is {t:Hard-linked|hard-linked}: stations 1 and 2 cannot pass their product on, station 4 gets nothing. So faster stations 1 and 2 do not help.' },
    { nl: 'Dan vermenigvuldigen de beschikbaarheden zich: acht stations die elk {n:95} procent van de tijd kunnen draaien, geven samen zo’n {n:66} procent.',
      en: 'Then the availabilities multiply: eight stations that can each run {n:95} percent of the time give about {n:66} percent together.' },
    { nl: 'Een {t:Buffer|buffer} is een kleine wachtrij tussen twee stations. Reken hem op de stop: {n:240} seconden gedeeld door {n:40} is {n:6} plekken. Buffers vangen stops op, ze halen ze niet weg.',
      en: 'A {t:Buffer|buffer} is a small queue between two stations. Size it on the stop: {n:240} seconds divided by {n:40} is {n:6} places. Buffers absorb stops, they do not remove them.' },
  ],
  [ // s6 blocked and starved
    { nl: 'Nu stations A tot D. Pers B doet {n:30} seconden, lektester C {n:36}: C is de bottleneck, met een buffer van {n:5} plekken ervoor. B valt stil, en C werkt door uit de buffer.',
      en: 'Now stations A to D. Press B takes {n:30} seconds, leak tester C {n:36}: C is the bottleneck, with a buffer of {n:5} places in front. B stops, and C works on from the buffer.' },
    { nl: 'Station A heeft een product af, maar de plek erna is vol: A is {t:Blocked|blocked}.',
      en: 'Station A has finished a product, but the place after it is full: A is {t:Blocked|blocked}.' },
    { nl: 'Duurt de stop langer dan {n:3} minuten, dan is de buffer leeg. C kan werken, maar er komt niks aan: C is {t:Starved|starved}.',
      en: 'If the stop lasts longer than {n:3} minutes, the buffer is empty. C could work, but nothing arrives: C is {t:Starved|starved}.' },
  ],
  [ // s7 filling up again
    { nl: 'Een buffer werkt alleen als hij weer vol kan lopen. B maakt {n:120} per uur, C {n:100}: dat verschil is de {t:Overcapaciteit|overcapaciteit}.',
      en: 'A buffer only works if it can fill up again. B makes {n:120} an hour, C {n:100}: that difference is the {t:Spare capacity|spare capacity}.' },
    { nl: 'De buffer loopt vol met {n:20} per uur: {n:5} plekken kosten {n:15} minuten. Met een stop elke {n:20} minuten draait B zo’n {n:17} minuten ertussen, net genoeg. Stops elke tien minuten? Pak dan de stops aan.',
      en: 'The buffer refills at {n:20} an hour: {n:5} places take {n:15} minutes. With a stop every {n:20} minutes, B runs about {n:17} minutes in between, just enough. Stops every ten minutes? Then attack the stops.' },
    { nl: 'Alle producten in de stations en buffers samen zijn het {t:Onderhanden werk|onderhanden werk}.',
      en: 'All products in the stations and buffers together are the {t:WIP|WIP}, the work in progress.' },
    { nl: 'Bescherm dus eerst de bottleneck: de buffer ervoor vol, tegen starved, de buffer erna bijna leeg, tegen blocked.',
      en: 'So protect the bottleneck first: the buffer before it full, against starved, the buffer after it nearly empty, against blocked.' },
  ],
  [ // s8 simulating
    { nl: 'Een {t:Discrete-eventsimulatie|discrete-eventsimulatie} speelt elk product, elke stop en elke reparatie af in de tijd, met de echte spreiding.',
      en: 'A {t:Discrete-event simulation|discrete-event simulation} plays every product, stop and repair in time, with the real spread.' },
    { nl: '{t:MTBF|MTBF} is de gemiddelde draaitijd tussen twee stops.',
      en: '{t:MTBF|MTBF} is the average running time between two stops.' },
    { nl: '{t:MTTR|MTTR} is de gemiddelde duur van een stop. Komen die stopdata uit machinedata, of zijn ze een gok van de leverancier?',
      en: '{t:MTTR|MTTR} is the average length of a stop. Does that stop data come from machine data, or is it a guess by the supplier?' },
    { nl: 'Een integrator belooft {n:112} per uur tegen een doel van {n:105}. Maar in zijn model stopt elk station precies {n:3} minuten per {n:2} uur.',
      en: 'An integrator promises {n:112} an hour against a target of {n:105}. But in his model every station stops for exactly {n:3} minutes every {n:2} hours.' },
    { nl: 'Echte stops duren {n:30} seconden tot {n:20} minuten, en vaste stops laten buffers mooier lijken. Vraag om echte stopdata, en toets het model aan een bestaande lijn.',
      en: 'Real stops last {n:30} seconds to {n:20} minutes, and fixed stops flatter the buffers. Ask for real stop data, and validate the model on an existing line.' },
  ],
  [ // s9 Little's law
    { nl: 'De snelle check is de {t:Wet van Little|wet van Little}: onderhanden werk is output maal doorlooptijd.',
      en: 'The quick check is {t:Little’s law|Little’s law}: WIP equals throughput times lead time.' },
    { nl: 'In het model zitten zo’n {n:40} producten, bij {n:112} per uur: {n:0.36} uur, zo’n {n:21} minuten in de lijn. Dicht bij de geplande {n:20}.',
      en: 'The model holds about {n:40} products, at {n:112} an hour: {n:0.36} hour, about {n:21} minutes in the line. Close to the planned {n:20}.' },
    { nl: 'Na de eerste plekken geven grotere buffers vaak iets meer output, maar veel meer doorlooptijd. Vraag dus: waar vlakt de output af?',
      en: 'After the first few places, bigger buffers often give a little more output but much more lead time. So ask: where does the output level off?' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
  const segs = SC[si];
  if (segs[0].b0 !== 0 || segs[segs.length - 1].b1 !== s.beats.length - 1) throw new Error(`scenario: scene ${si + 1} does not cover its beats`);
  segs.forEach((seg) => { if (seg.T.length !== seg.b1 - seg.b0 + 2) throw new Error(`scenario: scene ${si + 1} T length`); });
  if (KEYS[si].length !== s.beats.length) throw new Error(`camera: scene ${si + 1} needs ${s.beats.length} keys`);
});

// Scene lengths from the captions (reading pace with some air), then reduced
// motion: each beat's still sits late in that beat.
const C = {
  W, H, ST, SLOT0, PITCH, MAXCAP, BT, PART_H, STROKE, TOTE_X: TOTE.x + TOTE.w / 2, TOTE_H, BELT_END: BED.x + BED.w, OP_Y, CURT, KEYS, SC, DT,
  CYC1, TAKT, BN1, OUT1, CYC3, PLACES3, PER_B, PER_C, FILL_MIN, SIM, LEAD_H,
};
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 1.6 * s.beats.length);
  });
  C.dur = spec.scenes.map((s) => s.dur);
  const again = resolveFilm(spec, await allLessons());
  again.scenes.forEach((s, si) => {
    const st = beatStarts(s, 'nl').map((t) => t / s.dur);
    spec.scenes[si].beats.forEach((b, bi) => {
      const a = st[bi];
      const e = bi + 1 < st.length ? st[bi + 1] : 1;
      b.still = Math.round((a + 0.8 * (e - a)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst W = ${W}, H = ${H};\n${lineSim.toString()}\n`;
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, '../_kit/audio-warp.js'), 'utf8') + '\n' + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.iso{--fp-run:#7FB08C;--fp-wait:#D2B064;--fp-fault:#D9776A}
.iso[data-theme="light"]{--fp-run:#3E7F52;--fp-wait:#A87A12;--fp-fault:#B04A3A}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-svg .fp-tx{fill:var(--anatomy-text)}
.fp-svg .fp-mute{fill:var(--anatomy-muted)}
.fp-svg .fp-inbar,.fp-svg [data-cue][data-on] .fp-inbar{fill:var(--anatomy-card)}
.fp-dot2{fill:var(--anatomy-lo)}
.fp-svg .fp-tagtx{paint-order:stroke;stroke:var(--anatomy-card);stroke-width:5px;stroke-linejoin:round}
[data-cue="wip"][data-on],[data-cue="bufC"][data-on]{--anatomy-top:var(--anatomy-lit-top);--anatomy-shade-0:var(--anatomy-lit-shade);--anatomy-shade-1:var(--anatomy-lit-shade);--anatomy-shade-2:var(--anatomy-lit-shade);--anatomy-shade-3:var(--anatomy-lit-shade);--anatomy-hi:var(--fp-accent);--anatomy-mid:var(--fp-accent)}
.fp-plate{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-void{fill:var(--anatomy-shade-0)}
.fp-pad{fill:var(--anatomy-faint);stroke:var(--anatomy-lo);stroke-width:.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-pad[data-cap]{fill:var(--anatomy-mid);stroke:var(--anatomy-mid)}
.fp-tag{fill:var(--anatomy-mid);stroke:none}
.fp-foot{fill:none;stroke:none}
.fp-zone{fill:none;stroke:none}
.fp-lamp-line{fill:none;stroke:var(--fp-fault);stroke-width:.8;vector-effect:non-scaling-stroke}
[data-lamp$="-run"][data-lit] .iso-top,[data-lamp$="-run"][data-lit] .iso-shade,[data-lamp$="-run"][data-lit] .iso-fill{fill:var(--fp-run)!important}
[data-lamp$="-wait"][data-lit] .iso-top,[data-lamp$="-wait"][data-lit] .iso-shade,[data-lamp$="-wait"][data-lit] .iso-fill{fill:var(--fp-wait)!important}
[data-lamp$="-fault"][data-lit] .iso-top,[data-lamp$="-fault"][data-lit] .iso-shade,[data-lamp$="-fault"][data-lit] .iso-fill{fill:var(--fp-fault)!important}
.fp-beam{fill:none;stroke:var(--fp-fault);stroke-width:.7;opacity:.55;vector-effect:non-scaling-stroke}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter2{fill:var(--anatomy-lo)}
.fp-meter3{fill:var(--fp-fault);opacity:.85}
.fp-shape{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-dot{fill:var(--anatomy-hi)}
.fp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4;vector-effect:non-scaling-stroke}
.fp-curve{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-curve2{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-foot{stroke:var(--fp-accent);stroke-width:2;fill:var(--fp-accent);fill-opacity:.14;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-zone{fill:var(--fp-accent);fill-opacity:.32;stroke:var(--fp-accent);stroke-width:1.2;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-pad[data-cap]{fill:var(--fp-accent);stroke:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .fp-shape{stroke:var(--fp-accent);fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-frame{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-dash,[data-cue][data-on] .fp-curve,[data-cue][data-on] .fp-arrow{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-dot{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een assemblagelijn met vier stations boven één transportband. Elk station is een portaal met een pneumatische cilinder en een signaalzuil. Achter de handmatige stations staan operators, voor de automatische test staat een lichtscherm. Pompen gaan van station naar station en krijgen er telkens iets bij: huis, waaier, deksel, testlabel. Kaarten tonen de cyclustijden naast de takt, een cel in U-vorm, het vullen van een buffer, een simulatiescherm met stops en de wet van Little.',
  en: 'An assembly line with four stations over one belt conveyor. Each station is a portal with a pneumatic cylinder and a stack light. Operators stand behind the manual stations, and a light curtain guards the automatic test. Pumps travel from station to station and gain a part at each: housing, impeller, cover, test label. Cards show the cycle times next to the takt, a U-shaped cell, a buffer filling up, a simulation screen with stops, and Little’s law.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
