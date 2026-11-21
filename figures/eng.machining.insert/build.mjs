// Dev tool, not shipped. Builds the standalone figure for the topic Gereedschap
// (module Verspanen): the lessons eng.machining.toolbasics (level 1), tools
// (level 2), toollife (level 3) and toolcost (level 4).
//
//   node figures/eng.machining.insert/build.mjs            build the page
//   node figures/eng.machining.insert/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.machining.insert.html: one offline page
// with the anatomy kit, the kit's lathe module and the live script inlined. The
// page reads ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL
// (defaults: prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { finishFigure } from "../_kit/phone.mjs";

const SKILL =
  process.env.ANATOMY_SKILL ??
  "/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy";
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")).href);
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.machining.insert.html");

// ---------------------------------------------------------------- the model
// A CNMG 120408 insert (ISO 1832: 80° rhombus, 0° clearance, 12.7 mm inscribed
// circle, 4.76 mm thick, corner radius 0.8 mm) in a 95° holder, turning a bar.
//
// Taylor (lesson "toollife"):  V · Tⁿ = C, so T = T1 · (V1 / V)^(1/n).
//   T1 = 15 min at V1 = 200 m/min, n = 0.25 (carbide; textbooks 0.2–0.5).
// Cutting time per part scales with 1/V: tc = tc1 · V1 / V.
// End of tool life: flank wear VB = 0.3 mm average (ISO 3685).
// The flank wear land grows fast at first, then steadily, then fast again:
//   VB(t) = 0.3 · f(t / T),  f(u) = 0.25·(1 − e^(−u/0.05)) + 0.55·u + 0.2·u⁶,
//   f(1) = 1 (a shape for the drawing; only VB(T) = 0.3 mm is a standard value).
// Economics (lesson "toolcost"), per part:
//   cost = M·tc + (tch·M + Ce) · tc / T,   M = €1.50/min, Ce = €4 per edge,
//   economic tool life Te = (1/n − 1) · (tch + Ce / M), Ve = C / Te^n.
// Level 1 (lesson "toolbasics"): €14 per insert, 4 edges, 70 parts per edge.
// Level 2 (lesson "tools"): €12 per insert, 4 edges, counter limit 80 parts;
//   assumed here: the edge reaches VB 0.3 mm at about 90 parts at 200 m/min (the
//   limit is set below that, with a safety margin, as the toollife lesson says).
const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
const N_T = 0.25;
const V1 = 200;
const T1 = 15;
const lifeOf = (v, n = N_T) => T1 * (V1 / v) ** (1 / n);
const tcOf = (v, tc1) => (tc1 * V1) / v;
const wearOf = (u) => 0.3 * (0.25 * (1 - Math.exp(-u / 0.05)) + 0.55 * u + 0.2 * u ** 6);
const M = 1.5;
const CE = 4;
const costOf = (v, tch, tc1 = 0.5) => {
  const tc = tcOf(v, tc1), T = lifeOf(v);
  return { tc, T, machine: M * tc, change: (tch * M * tc) / T, tool: (CE * tc) / T, total: M * tc + ((tch * M + CE) * tc) / T };
};
const econOf = (tch) => {
  const Te = (1 / N_T - 1) * (tch + CE / M);
  const C = Math.round(V1 * T1 ** N_T); // 394, rounded as in the lesson
  return { Te, Ve: C / Te ** N_T, C };
};
// lesson numbers
near(14 / 4 / 70, 0.05, 1e-9, "L1 €/part");
near(18 / 6 / 50, 0.06, 1e-9, "L1 recall");
near(12 / 4 / 80, 0.0375, 1e-9, "L2 €/part");
near(12 / 4 / 80 - 12 / 4 / 100, 0.0075, 1e-9, "L2 stretch");
near(16 / 4 / 50, 0.08, 1e-9, "L2 recall");
near(lifeOf(250) / lifeOf(200), 0.41, 0.005, "L3 pre 0.8^4");
near(lifeOf(220), 10.2, 0.05, "L3 T at 220");
near(tcOf(220, 0.5), 0.45, 0.005, "L3 tc at 220");
near(lifeOf(220) / tcOf(220, 0.5), 22.5, 0.05, "L3 parts at 220");
near(lifeOf(160), 36.6, 0.05, "L3 recall 160");
near(wearOf(1), 0.3, 1e-3, "VB criterion at T");
near(econOf(2).C, 394, 0.5, "L4 C");
near(econOf(2).Te, 14, 1e-9, "L4 Te");
near(econOf(2).Ve, 204, 0.5, "L4 Ve");
near(econOf(0.3).Te, 8.9, 0.02, "L4 Te sister");
near(econOf(0.3).Ve, 228, 0.5, "L4 Ve sister");
near((1 / N_T - 1) * (0.5 + 3 / 1.5), 7.5, 1e-9, "L4 recall");
// the cost minimum of the curve sits at Ve
{
  let best = 0, at = 0;
  for (let v = 150; v <= 280; v += 0.5) { const c = costOf(v, 2).total; if (!best || c < best) { best = c; at = v; } }
  near(at, econOf(2).Ve, 1, "L4 curve minimum");
}
const N0 = 90; // parts per edge to VB 0.3 at 200 m/min, level 2 (assumed)
const TS = 1.5; // cutting minutes per real second

const LEVELS = {
  1: { v: 200, tc1: T1 / N0, limit: 70, price: 14 },
  2: { v: 200, tc1: T1 / N0, limit: 80, price: 12 },
  3: { v: 220, tc1: 0.5, n: 0.25 },
  4: { v: 200, tc1: 0.5, tch: 2 },
};
const V_LIST = { 2: [160, 180, 200, 220, 250], 3: [140, 160, 180, 200, 220, 250, 280], 4: [140, 160, 180, 200, 204, 220, 228, 250, 280] };
const N_LIST = [0.2, 0.25, 0.5];

// ---------------------------------------------------------------- the world
// World units are quarter millimetres (4 per mm), z up. The bar turns about the
// x axis; the tool sits in front of it (+y, toward the operator) at centre
// height and feeds toward +x. The insert's rake face is the plane z = 0.
const WIDTH = 600;
const U = 4; // units per mm
const R0 = 10 * U; // bar Ø20
const AP = 1.5 * U; // depth of cut 1.5 mm
const RM = R0 - AP; // machined radius
const BAR = { x0: -76, x1: 100, fade: [22, 100] };
const IN_T = 4.76 * U; // insert thickness
const SHIM_T = 3 * U;
const Z_SHIM = -IN_T - SHIM_T;
const SHANK_W = 64;
const SHANK_Z = [Z_SHIM - 64, Z_SHIM];
const Y_END = 236; // the gang plate and shanks run on toward the turret, fading out
const FADE_Y = [128, 222];
const SIS = [-84, 10]; // the sister tool: one station over, pulled back 2.5 mm
const GANG = { x: -84 - 72, y: 96, w: 72 + 84 + 16, d: Y_END - 96, r: 3 };
const GANG_Z = [SHANK_Z[0] - 14, SHANK_Z[0]];

// the insert outline: an 80° rhombus with 0.8 mm corners, nose at the bar
const D2R = Math.PI / 180;
const SIDE = (12.7 / Math.sin(80 * D2R)) * U;
const RE = 0.8 * U;
const e1 = [-Math.sin(5 * D2R), Math.cos(5 * D2R)]; // major edge, from the nose (κr 95°)
const e2 = [Math.cos(175 * D2R), Math.sin(175 * D2R)]; // minor edge
function roundPoly(verts, r, steps = 6) {
  const out = [];
  const n = verts.length;
  for (let i = 0; i < n; i++) {
    const V = verts[i], Pp = verts[(i + n - 1) % n], Nn = verts[(i + 1) % n];
    const d1 = norm2([Pp[0] - V[0], Pp[1] - V[1]]), d2 = norm2([Nn[0] - V[0], Nn[1] - V[1]]);
    const half = Math.acos(d1[0] * d2[0] + d1[1] * d2[1]) / 2;
    const b = norm2([d1[0] + d2[0], d1[1] + d2[1]]);
    const C = [V[0] + (b[0] * r) / Math.sin(half), V[1] + (b[1] * r) / Math.sin(half)];
    const t1 = [V[0] + (d1[0] * r) / Math.tan(half), V[1] + (d1[1] * r) / Math.tan(half)];
    const t2 = [V[0] + (d2[0] * r) / Math.tan(half), V[1] + (d2[1] * r) / Math.tan(half)];
    let a1 = Math.atan2(t1[1] - C[1], t1[0] - C[0]), a2 = Math.atan2(t2[1] - C[1], t2[0] - C[0]);
    let da = a2 - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    for (let j = 0; j <= steps; j++) out.push([C[0] + r * Math.cos(a1 + (da * j) / steps), C[1] + r * Math.sin(a1 + (da * j) / steps)]);
  }
  return out;
}
function norm2([x, y]) { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; }
function offsetRing(ring, d) { // d > 0 outward (convex ring)
  const n = ring.length;
  const cx = ring.reduce((s, p) => s + p[0], 0) / n, cy = ring.reduce((s, p) => s + p[1], 0) / n;
  return ring.map((p, i) => {
    const a = ring[(i + n - 1) % n], b = ring[(i + 1) % n];
    let t = norm2([b[0] - a[0], b[1] - a[1]]);
    let nrm = [t[1], -t[0]];
    if (nrm[0] * (p[0] - cx) + nrm[1] * (p[1] - cy) < 0) nrm = [-nrm[0], -nrm[1]];
    return [p[0] + nrm[0] * d, p[1] + nrm[1] * d];
  });
}
function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
function holderGeom(dx, dy) {
  const sharp = [[0, 0], [SIDE * e1[0], SIDE * e1[1]], [SIDE * (e1[0] + e2[0]), SIDE * (e1[1] + e2[1])], [SIDE * e2[0], SIDE * e2[1]]];
  let ring = roundPoly(sharp, RE, 8);
  const ox = dx - 0.3 - Math.max(...ring.map((p) => p[0]));
  const oy = dy + RM + 0.3 - Math.min(...ring.map((p) => p[1]));
  ring = ring.map(([x, y]) => [x + ox, y + oy]);
  for (const v of sharp) { v[0] += ox; v[1] += oy; }
  const [nose, v1, v2, v3] = sharp;
  const cen = [(nose[0] + v2[0]) / 2, (nose[1] + v2[1]) / 2];
  const u2 = norm2([v2[0] - cen[0], v2[1] - cen[1]]);
  const diag = Math.hypot(v2[0] - cen[0], v2[1] - cen[1]);
  const postAt = [cen[0] + u2[0] * (diag + 12), cen[1] + u2[1] * (diag + 12)];
  const headPts = [
    ...offsetRing(ring, -3).filter(([x, y]) => Math.hypot(x - nose[0], y - nose[1]) < 30),
    ...offsetRing(ring, 8).filter(([x, y]) => Math.hypot(x - nose[0], y - nose[1]) >= 30),
    [postAt[0] - 11, postAt[1]], [postAt[0] + 11, postAt[1]], [postAt[0], postAt[1] + 11],
  ];
  const sy = Math.ceil(Math.max(...headPts.map((p) => p[1])));
  const shank = { x: dx - 60, y: sy, w: SHANK_W, d: Y_END - sy, r: 2 };
  return { ring, nose, v1, v2, v3, cen, u2, post: postAt, headPts, shank };
}
const H = holderGeom(0, 0);
const HS = holderGeom(SIS[0], SIS[1]);
const INSERT = H.ring;
const NOSE = H.nose, CEN = H.cen, U2 = H.u2, POST = H.post, V3P = H.v3;
const SHANK = H.shank;
const HOLE_R = 2.58 * U;

// the wear strip on the major flank: ring points from the middle of the nose arc
// along the major edge to just past the depth of cut (the bar's old radius)
const FLANK = (() => {
  const nose = INSERT.slice(0, 9); // the nose arc (vertex 0), from minor to major edge
  const pts = nose.slice(4);
  const start = INSERT[8];
  const len = (R0 + 2 - start[1]) / e1[1];
  pts.push([start[0] + e1[0] * len, start[1] + e1[1] * len]);
  return pts;
})();

const FIT = [
  ...k.boxCorners({ ...GANG, d: 84 }, GANG_Z[0], GANG_Z[1] + 30), ...HS.headPts.map(([x, y]) => [x, y, 12]), ...H.headPts.map(([x, y]) => [x, y, 12]),
  [BAR.x0, 0, R0], [BAR.x0, 0, -R0], [BAR.x0, -R0, 0], [BAR.x0, R0, 0],
  [BAR.x1 - 50, R0, 0], [BAR.x1 - 50, -R0, R0 * 0.7], [BAR.x1 - 50, 0, -R0],
];
const PAD = 14;
const MACHINE_W = 376;
const AZIMUTH = Number(process.env.AZ ?? 30);
const ELEVATION = Number(process.env.EL ?? 44);
const P0 = k.fitProjection(FIT, MACHINE_W, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.max(330, Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4));
const P = { ...P0, origin: [P0.origin[0] + 2, P0.origin[1] - Math.min(...FIT_Y) + PAD + (HEIGHT - (Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4)) / 2] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameUp = (o) => G.frameOf(o, Zv, X, Y);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, { order: [], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { attrs = "", bias = 0 } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece: "", move: [0, 0, 0], attrs });
}
const S = (paths, style) => { solids++; return k.solidSvg(paths, style); };
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function prism(name, ring, z0, z1, style = {}, { bevel = 0, extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.extruded(ring, z0, z1 - z0, { name }));
  const svg = S(k.extrude(ring, z0, z1 - z0, P, { convex: true, bevel }), { tone: "mid", ...style, inner }) + extra;
  const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length, cy = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
const hexHead = (cx, cy, z) => L(k.ring(cx, cy, 2.2, z, P, 6), { tone: "lo" }) + Dt([at([cx, cy, z])], { size: 0.4, tone: "hi" });

// ---------------------------------------------------------------- live geometry (shared with the page)
// The flank wear land on the major flank: a band below the cutting edge, drawn
// three times its true height so it reads in the drawing (the loupe is to scale).
function wearSvg(K, P, flank, vb, notch) {
  if (vb <= 0.002) return "";
  const h = vb * 4 * 3;
  const top = flank.map(([x, y]) => K.iso([x, y, 0], P));
  const n = flank.length;
  const bottom = flank.map(([x, y], i) => {
    const t = i / (n - 1);
    const extra = t > 0.82 ? notch * h * Math.sin(((t - 0.82) / 0.18) * Math.PI) : 0;
    return K.iso([x, y, -(h * (0.7 + 0.3 * Math.min(1, t * 3)) + extra)], P);
  });
  return '<path class="ti-wear" d="' + K.pathOf(top.concat(bottom.reverse()), true) + '"/>';
}

// The loupe: the major flank seen face on, magnified 60 units per mm in a lens
// frame of radius 50: the cutting edge across the top, the wear land VB below
// it, a ruler at 0.1 mm per tick and the criterion VB 0.3 mm.
function loupeSvg(vb, labels, broken) {
  const f = (v) => v.toFixed(2);
  const S = 60;
  const edge = -20;
  const nose = -28;
  const out = [];
  // the flank (insert side face) from the nose corner to the right, with the nose rounding off
  out.push('<path class="ti-flank" d="M' + f(nose) + " " + edge + "H60V60H" + f(nose) + 'Z"/>');
  for (let i = 0; i < 4; i++) out.push('<path class="ti-flank-turn" data-band="' + i + '" d="M' + f(nose - (i + 1) * 3.4) + " " + edge + "H" + f(nose - i * 3.4) + "V60H" + f(nose - (i + 1) * 3.4) + 'Z"/>');
  const left = nose - 13.6;
  const rimV = (u) => Math.sqrt(2500 - u * u);
  out.push('<path class="iso-line" data-tone="mid" d="M' + f(left) + " " + f(rimV(left)) + "V" + edge + "H38M" + f(nose) + " " + edge + "V" + f(rimV(nose)) + '"/>');
  // the wear land: a band of height VB, scratched in the cutting direction, with
  // a deeper notch where the old surface of the bar crosses the edge (u ≈ 34)
  if (vb > 0.002) {
    const h = vb * S;
    const top = [], bottom = [];
    for (let i = 0; i <= 40; i++) {
      const u = left + ((60 - left) * i) / 40;
      const nose01 = u < nose ? 0.75 : 1;
      const notch = Math.exp(-(((u - 34) / 5) ** 2)) * 0.35;
      const wob = 0.06 * Math.sin(u * 1.7) + 0.04 * Math.sin(u * 3.1 + 1);
      top.push([u, edge]);
      bottom.push([u, edge + h * nose01 * (1 + notch + wob)]);
    }
    out.push('<path class="ti-land" d="M' + top.concat(bottom.reverse()).map(([u, v]) => f(u) + " " + f(v)).join("L") + 'Z"/>');
    const scratches = [];
    for (let u = left + 2; u < 60; u += 3.2) {
      const nose01 = u < nose ? 0.75 : 1;
      const notch = Math.exp(-(((u - 34) / 5) ** 2)) * 0.35;
      const len = h * nose01 * (1 + notch) * (0.55 + 0.35 * Math.abs(Math.sin(u * 2.3)));
      if (len > 1.2) scratches.push("M" + f(u) + " " + f(edge + 0.6) + "v" + f(len - 0.6));
    }
    if (scratches.length) out.push('<path class="ti-scratch" data-free="" d="' + scratches.join("") + '"/>');
  }
  if (broken > 0.01) out.push('<path class="ti-chipout" style="opacity:' + broken.toFixed(2) + '" d="M' + f(left + 2) + " " + edge + "L" + f(nose + 4) + " " + edge + "L" + f(nose - 2) + " " + (edge + 14) + "L" + f(left + 4) + " " + (edge + 10) + 'Z"/>');
  // the ruler: a strip on the right, ticks hanging from its left edge
  const rx = 38;
  out.push('<path class="ti-ruler" d="M' + rx + " " + (edge - 4) + "H47V" + (edge + 0.66 * S) + "H" + rx + 'Z"/>');
  const ticks = [];
  for (let i = 0; i <= 6; i++) ticks.push("M" + rx + " " + f(edge + i * 0.1 * S) + "h" + (i % 3 === 0 ? 5 : 2.6));
  out.push('<path class="iso-line" data-tone="hi" d="' + ticks.join("") + '"/>');
  // the criterion: VB 0.3 mm, from the flank's left edge to the ruler
  out.push('<path class="ti-crit" d="M' + f(left) + " " + f(edge + 0.3 * S) + "H" + rx + '"/>');
  if (labels) {
    out.push('<text class="ti-tl" x="36" text-anchor="end" y="' + f(edge + 6) + '">0</text>');
    out.push('<text class="ti-tl" x="36" text-anchor="end" y="' + f(edge + 0.3 * S - 1.6) + '">' + labels[0] + "</text>");
    out.push('<text class="ti-tl" x="36" text-anchor="end" y="' + f(edge + 0.6 * S + 1.8) + '">' + labels[1] + "</text>");
    out.push('<text class="ti-tl ti-tl-b" x="' + f(left + 2) + '" y="' + (edge - 4) + '">' + labels[2] + "</text>");
  }
  return out.join("");
}

// ---------------------------------------------------------------- the gang plate
// The holders sit on a gang-tool plate that runs on toward the turret (it fades
// out); wedges between the shanks clamp them.
const FADE = ' data-fade=""';
{
  const slots = [-112, -28].map((x) => k.planOutline({ x: x - 5, y: GANG.y, w: 10, d: GANG.d, r: 0 }, GANG_Z[1], P, 1)).join("");
  box("stand.gang", GANG, GANG_Z[0], GANG_Z[1], { tone: "lo" }, { bevel: 0.8, inner: L(k.sideSeam(GANG, GANG_Z[0] + 5, P, 2), { tone: "faint" }), extra: L(slots, { tone: "faint" }), attrs: FADE });
  for (const x of [-70, 9.2]) post("gang.dowel", x, 126, 3.2, GANG_Z[1], GANG_Z[1] + 3, { tone: "mid" }, { steps: 20, extra: Dt([at([x, 126, GANG_Z[1] + 3])], { size: 0.45, tone: "hi" }) });
  const wedges = [[GANG.x + 2, HS.shank.x - 0.4], [HS.shank.x + SHANK_W + 0.4, SHANK.x - 0.4], [SHANK.x + SHANK_W + 0.4, GANG.x + GANG.w - 2]];
  for (const [x0, x1] of wedges) {
    box("gang.wedge", { x: x0, y: 136, w: x1 - x0, d: 64, r: 1 }, GANG_Z[1], SHANK_Z[1] - 6, { tone: "mid", crease: "lo" }, { bevel: 0.4, attrs: FADE });
    for (const y of [148, 186]) post("gang.screw", (x0 + x1) / 2, y, Math.min(5, (x1 - x0) / 2 - 1.5), SHANK_Z[1] - 6, SHANK_Z[1] - 2, { tone: "hi", crease: "lo" }, { steps: 20, extra: hexHead((x0 + x1) / 2, y, SHANK_Z[1] - 2), attrs: FADE });
  }
}

// ---------------------------------------------------------------- the holders
function holderParts(h, tag) {
  const fy = h.shank.y;
  box("holder.shank" + tag, h.shank, SHANK_Z[0], SHANK_Z[1], { tone: "mid" }, { bevel: 0.6, inner: L(k.sideSeam(h.shank, SHANK_Z[0] + 6, P, 2), { tone: "faint" }), attrs: FADE });
  // the head: under the insert, with room for the clamp post behind it
  const head = hull([...h.headPts, [h.shank.x, fy], [h.shank.x + SHANK_W, fy]]);
  prism("holder.head" + tag, head, SHANK_Z[0], SHANK_Z[1], { tone: "mid" }, { bevel: 0.6, inner: L(k.ringSeam(head, SHANK_Z[0] + 6, P), { tone: "faint" }) });
  // pocket walls along the two back edges of the insert, a relief at the back corner
  const wall = (a, b) => {
    const t = norm2([b[0] - a[0], b[1] - a[1]]);
    let nrm = [t[1], -t[0]];
    if (nrm[0] * (a[0] - h.cen[0]) + nrm[1] * (a[1] - h.cen[1]) < 0) nrm = [-nrm[0], -nrm[1]];
    const p0 = [a[0] + t[0] * 12, a[1] + t[1] * 12], p1 = [b[0] - t[0] * 9, b[1] - t[1] * 9];
    const ring = [[p0[0] + nrm[0] * 0.4, p0[1] + nrm[1] * 0.4], [p1[0] + nrm[0] * 0.4, p1[1] + nrm[1] * 0.4], [p1[0] + nrm[0] * 6.4, p1[1] + nrm[1] * 6.4], [p0[0] + nrm[0] * 6.4, p0[1] + nrm[1] * 6.4]];
    prism("holder.wall" + tag, ring, SHANK_Z[1], -6, { tone: "mid", crease: "lo" }, { bevel: 0.3 });
  };
  wall(h.v1, h.v2);
  wall(h.v3, h.v2);
  prism("holder.shim" + tag, offsetRing(h.ring, -1.2), Z_SHIM, -IN_T, { tone: "lo" }, {});
  post("holder.post" + tag, h.post[0], h.post[1], 7, SHANK_Z[1], 0, { tone: "mid" }, { steps: 24 });
  // a coolant nozzle on the shank, pointing at the cutting zone
  const nx = h.shank.x + SHANK_W - 12, ny = h.shank.y + 22;
  box("nozzle.block" + tag, { x: nx - 8, y: ny - 8, w: 16, d: 16, r: 1.5 }, SHANK_Z[1], SHANK_Z[1] + 10, { tone: "mid" }, { bevel: 0.3 });
  const F = G.frameOf([nx, ny - 8, SHANK_Z[1] + 5], [0, -1, 0], X, Zv);
  discAt("nozzle.tip" + tag, F, 0, 9, 3.2, { tone: "hi", crease: "lo" }, {});
  discAt("nozzle.end" + tag, F, 9, 11, 2.2, { tone: "mid" }, {});
}
function insertParts(h, tag, lit, attrs) {
  const top = [
    L(k.onTop(offsetRing(h.ring, -4.5), 0, P, true), { tone: "lo" }),
    `<path class="ti-hole" d="${k.ring(h.cen[0], h.cen[1], HOLE_R, 0, P, 32)}"/>`,
    L(k.ring(h.cen[0], h.cen[1], HOLE_R, 0, P, 32) + k.ring(h.cen[0], h.cen[1], HOLE_R - 2.2, -2.2, P, 28), { tone: "mid" }),
  ].join("");
  const item = prism("insert" + tag, h.ring, -IN_T, 0, { tone: "hi", crease: "lo", lit }, { extra: top + (lit ? `<g data-wear=""></g>` : ""), attrs });
  const tip = [h.cen[0] + h.u2[0] * 6, h.cen[1] + h.u2[1] * 6];
  const tail = [h.post[0] + h.u2[0] * 2, h.post[1] + h.u2[1] * 2];
  const circ = (c, r) => Array.from({ length: 20 }, (_, i) => [c[0] + r * Math.cos((i / 20) * 2 * Math.PI), c[1] + r * Math.sin((i / 20) * 2 * Math.PI)]);
  const clamp = hull([...circ(tip, 7.5), ...circ(tail, 9)]);
  const mid = [(tip[0] + tail[0]) / 2, (tip[1] + tail[1]) / 2];
  prism("clamp" + tag, clamp, 0, 7, { tone: "mid", crease: "lo" }, { bevel: 0.4, attrs });
  post("clamp.screw" + tag, mid[0], mid[1], 5.6, 7, 12, { tone: "hi", crease: "lo" }, { steps: 24, extra: hexHead(mid[0], mid[1], 12), attrs });
  return item;
}
holderParts(H, "");
holderParts(HS, ".sister");
insertParts(HS, ".sister", false, ' data-sister=""');
// the insert: the lit subject, with its hole, chip-breaker groove and the wear land (live)
insertParts(H, "", true, ' data-ins=""');

// ---------------------------------------------------------------- the bar
const FB = G.frameOf([0, 0, 0], X, Y, Zv);
// in three pieces: the turned part, the ring being cut now (it hides the insert's
// nose from this side) and the stock toward the chuck, which fades out
const BAR_CUT = 8;
{
  const profile = [[BAR.x0, R0 - 4 - AP], [BAR.x0 + 4, RM], [0.3, RM]];
  const shape = R.solid(A.solid(FB, profile, { name: "stand.bar" }));
  const feed = [-62, -48, -34, -20].map((s) => G.arcOf(FB, s, RM, P)).join("");
  put("stand.bar", [-75, 0, 0], S(G.solidOf(profile, FB, P, { steps: 96 }), { tone: "mid", crease: "lo", inner: L(feed, { tone: "faint" }) }), [shape], {});
  put("bar.ring", [4, 0, 0], S(G.solidOf([[0.3, R0], [BAR_CUT, R0]], FB, P, { steps: 96 }), { tone: "mid", crease: "lo" }), [R.solid(A.solid(FB, [[0.3, R0], [BAR_CUT, R0]], { name: "bar.ring" }))], {});
}
const barItem = (() => {
  const profile = [[BAR_CUT, R0], [BAR.x1, R0]];
  const shape = R.solid(A.solid(FB, profile, { name: "bar.stock" }));
  const svg = S(G.solidOf(profile, FB, P, { steps: 96 }), { tone: "mid", crease: "lo" }) + `<g data-ribs=""></g>`;
  return put("bar.stock", [90, 0, 0], svg, [shape], { attrs: ' data-bar=""' });
})();

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: [0] });
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);

// the bar fades out toward the chuck (off the card, to the right)
const [fx0, fy0] = at([BAR.fade[0], 0, 0]);
const [fx1, fy1] = at([BAR.fade[1], 0, 0]);
const defs = `<defs><linearGradient id="ti-fade" gradientUnits="userSpaceOnUse" x1="${fx0.toFixed(1)}" y1="${fy0.toFixed(1)}" x2="${fx1.toFixed(1)}" y2="${fy1.toFixed(1)}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="ti-bar-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${WIDTH}" height="${HEIGHT}"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#ti-fade)"/></mask></defs>`;
const [gx0, gy0] = at([0, FADE_Y[0], GANG_Z[1]]);
const [gx1, gy1] = at([0, FADE_Y[1], GANG_Z[1]]);
const defsY = `<defs><linearGradient id="ti-fade-y" gradientUnits="userSpaceOnUse" x1="${gx0.toFixed(1)}" y1="${gy0.toFixed(1)}" x2="${gx1.toFixed(1)}" y2="${gy1.toFixed(1)}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="ti-y-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${WIDTH}" height="${HEIGHT}"><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#ti-fade-y)"/></mask></defs>`;
groups.forEach((g, i) => { if (g.includes(' data-fade=""')) groups[i] = g.replace(' data-fade="">', ' data-fade="" mask="url(#ti-y-mask)">'); });
const barSlot = R.items.indexOf(barItem);
groups[barSlot] = groups[barSlot].replace('<g class="it" data-name="bar.stock" data-bar="">', '<g class="it" data-name="bar.stock" data-bar="" mask="url(#ti-bar-mask)">');

// the right column: a loupe on the flank, and (levels 3–4) a chart
const COL = { x: MACHINE_W + 6, w: WIDTH - MACHINE_W - 12 };
const loupe = [
  `<g class="ti-loupe" data-loupe="">`,
  `<circle class="ti-lens" r="50"/>`,
  `<clipPath id="ti-lens-clip"><circle r="49"/></clipPath>`,
  `<g clip-path="url(#ti-lens-clip)"><g data-view=""></g></g>`,
  `<circle class="ti-rim" r="50"/>`,
  `</g>`,
].join("");
const chart = `<g class="ti-chart" data-chart=""></g>`;
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan({ ...GANG, d: 90 }, -4), GANG_Z[0], 2, P)}"/>`];
const body = [defs, defsY, ...halo, ...groups, `<g data-chips=""></g>`, `<g data-mark=""></g>`, loupe, chart];

const LABEL_NL =
  "Een wisselplaat CNMG 120408 in een gereedschapshouder, van dichtbij, terwijl hij een draaiende stalen as voordraait. De houder zit met wiggen op een gereedschapsplaat, naast een zustergereedschap; een spanklauw drukt de plaat op een onderlegplaat in de pocket, en een koelmondstuk spuit op de snede. Langs de snijkant groeit de vrijloopslijtage. Een vergrootglas toont de vrijloopkant met de slijtagestrook VB en een liniaal tot 0,6 mm, met het criterium 0,3 mm. Op niveau 3 en 4 staat ernaast een grafiek: standtijd tegen snijsnelheid, en kosten per stuk tegen snijsnelheid.";
const LABEL_EN =
  "A CNMG 120408 insert in a tool holder, close up, turning a spinning steel bar. The holder is wedged on a gang plate, next to a sister tool; a top clamp holds the insert on a shim in its pocket, and a coolant nozzle sprays the cut. Along the cutting edge the flank wear grows. A loupe shows the flank with the wear land VB and a ruler to 0.6 mm, with the 0.3 mm criterion. At levels 3 and 4 a chart sits beside it: tool life against cutting speed, and cost per part against cutting speed.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "insert", at: [CEN[0] + 8, CEN[1] - 10, 0] },
  { key: "edge", at: [NOSE[0] - 1, NOSE[1] + 14, 0] },
  { key: "radius", at: [NOSE[0] - 1.5, NOSE[1] + 1.5, 0] },
  { key: "breaker", at: [CEN[0] - 14, CEN[1] - 4, 0] },
  { key: "clamp", at: [POST[0], POST[1], 7] },
  { key: "shim", at: [V3P[0] + 6, V3P[1] - 2, -IN_T - 4] },
  { key: "holder", at: [SHANK.x + SHANK_W, SHANK.y + 30, SHANK_Z[1] - 20] },
  { key: "sister", at: [HS.cen[0] - 6, HS.cen[1] - 8, 0] },
  { key: "gang", at: [HS.shank.x + SHANK_W + 10, 150, SHANK_Z[1] - 2] },
  { key: "bar", at: [-60, RM * 0.6, RM * 0.75] },
  { key: "chip", at: [-12, RM + 10, 16] },
  { key: "nozzle", at: [SHANK.x + SHANK_W - 12, SHANK.y + 10, SHANK_Z[1] + 6] },
];
const RIB_COUNT = 22;

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --ti-hair:rgba(240,233,218,.12);--ti-accent:#5C9FAE;--ti-glass:#0A1E23;--ti-flank:#1D4A55;--ti-land:#9FC9D2;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --ti-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --ti-hair:rgba(11,41,27,.14);--ti-accent:#276F81;--ti-glass:#E2ECEA;--ti-flank:#CCDCDB;--ti-land:#276F81;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--ti-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:126px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--ti-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="3"] .iso-plate,html[data-level="4"] .iso-plate{--bottom:188px}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--ti-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 14px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 32px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.iso-plate-corners{--rows:1}
html[data-level="3"] .iso-plate-corners,html[data-level="4"] .iso-plate-corners{--rows:2}
.ti-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ti-acc{color:var(--ti-accent);font-weight:600}
.ti-mute{color:var(--anatomy-muted)}
.ti-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.ti-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.ti-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.ti-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.ti-row{display:flex;gap:4px;height:44px}
.ti-row[hidden],.ti-btn[hidden]{display:none}
.ti-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--ti-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--ti-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.ti-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.ti-btn[aria-checked="true"],.ti-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--ti-accent);color:var(--ti-accent);font-weight:600}
.ti-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.ti-btn:disabled{opacity:.4;cursor:default}
.ti-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.ti-btn sub{font-size:9px}
.ti-val{flex:1.4 1 0;cursor:default}
.ti-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ti-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.ti-hole{fill:var(--anatomy-shade-0);stroke:none}
.ti-wear{fill:var(--ti-land);stroke:var(--anatomy-hi);stroke-width:.3px;stroke-linejoin:round}
.ti-engrave{font-family:var(--anatomy-mono);font-weight:600;letter-spacing:.02em}
.ti-chip-fly{fill:var(--ti-accent);fill-opacity:.55;stroke:var(--anatomy-hi);stroke-width:.45px;stroke-linejoin:round}
.ti-lens{fill:var(--anatomy-card);stroke:none}
.ti-rim{fill:none;stroke:var(--anatomy-mid);stroke-width:.9px}
.ti-flank{fill:var(--ti-flank);stroke:none}
.ti-flank-turn{fill:var(--ti-flank);stroke:none}
.ti-flank-turn[data-band="0"]{opacity:.8}.ti-flank-turn[data-band="1"]{opacity:.6}.ti-flank-turn[data-band="2"]{opacity:.42}.ti-flank-turn[data-band="3"]{opacity:.26}
.ti-land{fill:var(--ti-land);fill-opacity:.85;stroke:var(--anatomy-hi);stroke-width:.35px;stroke-linejoin:round}
.ti-scratch{fill:none;stroke:var(--anatomy-card);stroke-width:.35px;opacity:.55}
.ti-chipout{fill:var(--anatomy-card);stroke:var(--anatomy-hi);stroke-width:.4px}
.ti-ruler{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.4px}
.ti-crit{fill:none;stroke:var(--anatomy-hi);stroke-width:.5px}
.ti-tl{font:600 6.4px var(--anatomy-mono);fill:var(--anatomy-hi)}
.ti-tl-b{fill:var(--anatomy-muted);font-weight:500}
.ti-panel{fill:var(--ti-glass);stroke:var(--anatomy-lo);stroke-width:.6px}
.ti-grid{fill:none;stroke:var(--anatomy-faint);stroke-width:.5px}
.ti-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:.7px}
.ti-curve{fill:none;stroke:var(--ti-accent);stroke-width:1.8px;stroke-linejoin:round;stroke-linecap:round}
.ti-curve2{fill:none;stroke:var(--anatomy-mid);stroke-width:1px;stroke-linejoin:round;stroke-linecap:round}
.ti-curve3{fill:none;stroke:var(--anatomy-lo);stroke-width:1px;stroke-linejoin:round;stroke-linecap:round}
.ti-guide{fill:none;stroke:var(--anatomy-mid);stroke-width:.6px}
.ti-dot{fill:var(--ti-accent);stroke:var(--anatomy-card);stroke-width:1px}
.ti-opt{fill:var(--anatomy-card);stroke:var(--anatomy-hi);stroke-width:1.1px}
.ti-ax{font:500 11px var(--ti-sans);fill:var(--anatomy-muted)}
.ti-ax-b{font-weight:600;fill:var(--anatomy-text)}
.ti-mark{fill:none;stroke:var(--ti-accent);stroke-width:1.4px}
.ti-mark-dot{fill:var(--ti-accent);stroke:none}
html:not([data-level="1"]) [data-mark]{display:none}
`;

// ---------------------------------------------------------------- live script
const latheSource = readFileSync(join(SKILL, "kit/lathe.mjs"), "utf8").replace(/^import .*$/m, "").replace(/^export /gm, "");
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, ribsOf, dot3, add3, mul3 };})();\n`;

const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const WIDTH = ${WIDTH}, HEIGHT = ${HEIGHT}, COL = ${JSON.stringify(COL)};
const R0 = ${R0}, RM = ${RM}, BAR_CUT = ${BAR_CUT}, BAR = ${JSON.stringify(BAR)}, RIB_COUNT = ${RIB_COUNT};
const FLANK = ${JSON.stringify(FLANK.map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)]))};
const NOSE = ${JSON.stringify(NOSE.map((v) => +v.toFixed(2)))};
const N_T = ${N_T}, V1 = ${V1}, T1 = ${T1}, M = ${M}, CE = ${CE}, N0 = ${N0}, TS = ${TS};
const LEVELS = ${JSON.stringify(LEVELS)};
const V_LIST = ${JSON.stringify(V_LIST)}, N_LIST = ${JSON.stringify(N_LIST)};
const PARTS = ${JSON.stringify(PARTS)};
const lifeOf = ${lifeOf.toString()};
const tcOf = ${tcOf.toString()};
const wearOf = ${wearOf.toString()};
const costOf = ${costOf.toString()};
const econOf = ${econOf.toString()};
${wearSvg.toString()}
${loupeSvg.toString()}
const K = { iso, pathOf };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", edge: "edge", of: "of", parts: "parts", perEdge: "per edge", perPart: "per part", limit: "limit", late: "VB over 0.3 mm before the limit: risk of scrap", early: "edge changed with life left", ok: "edge changed at the limit", broke: "edge broke: scrap and a stop", life: "tool life", now: "now", crit: "criterion", tc: "min per part", sister: "sister tool", change: "change", machine: "machine", tool: "insert", total: "total", econ: "economic", tapPart: "tap a part to name it", mm: "mm",
      names: { insert: ["Insert", "carbide with a coating; CNMG 120408, grade P (steel)"], edge: ["Cutting edge", "the major edge; the flank below it wears"], radius: ["Corner radius", "0.8 mm: the 08 in the code"], breaker: ["Chip breaker", "a groove that curls and breaks the chip"], clamp: ["Top clamp", "presses the insert into its pocket"], shim: ["Shim", "a carbide plate under the insert"], holder: ["Tool holder", "the steel body that holds the insert"], sister: ["Sister tool", "an identical spare; takes over when the counter runs out"], gang: ["Gang plate", "wedges clamp the holders; it runs on to the turret"], bar: ["Workpiece", "a steel bar, Ø20, turning"], chip: ["Chip", "peeled off the bar, flows over the rake face"], nozzle: ["Coolant nozzle", "emulsion on the cut: cools, lubricates, flushes"]} }
  : { dec: ",", edge: "snijkant", of: "van", parts: "stuks", perEdge: "per snijkant", perPart: "per stuk", limit: "grens", late: "VB boven 0,3 mm vóór de grens: kans op afkeur", early: "snijkant gewisseld met standtijd over", ok: "snijkant gewisseld op de grens", broke: "snijkant gebroken: afkeur en stilstand", life: "standtijd", now: "nu", crit: "criterium", tc: "min per stuk", sister: "zustergereedschap", change: "wissel", machine: "machine", tool: "plaat", total: "totaal", econ: "economisch", tapPart: "tik een onderdeel voor de naam", mm: "mm",
      names: { insert: ["Wisselplaat", "hardmetaal met coating; CNMG 120408, soort P (staal)"], edge: ["Snijkant", "de hoofdsnijkant; de vrijloopkant eronder slijt"], radius: ["Hoekradius", "0,8 mm: de 08 in de code"], breaker: ["Spaanbreker", "een groef die de spaan krult en breekt"], clamp: ["Spanklauw", "drukt de plaat in de pocket"], shim: ["Onderlegplaat", "hardmetalen plaatje onder de wisselplaat"], holder: ["Gereedschapshouder", "het stalen lichaam dat de plaat klemt"], sister: ["Zustergereedschap", "identieke reserve; neemt het over als de teller op is"], gang: ["Gereedschapsplaat", "wiggen klemmen de houders; loopt door naar de revolver"], bar: ["Werkstuk", "een stalen as, Ø20, draaiend"], chip: ["Spaan", "van de as geschild, loopt over het spaanvlak"], nozzle: ["Koelmondstuk", "emulsie op de snede: koelt, smeert, spoelt"]} };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);
const eur = (value, digits = 2) => "€" + fmt(value, digits);

const stage = document.querySelector(".ti-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { wear: q("[data-wear]"), ribs: q("[data-ribs]"), chips: q("[data-chips]"), mark: q("[data-mark]"), view: q("[data-view]"), loupe: q("[data-loupe]"), chart: q("[data-chart]"), ins: [...svg.querySelectorAll("[data-ins]")] };
const lines = [...document.querySelectorAll("[data-readout] .ti-line")];
const announcer = document.querySelector(".ti-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ layout of the right column
const big = LVL <= 2;
const LR = big ? Math.min(COL.w / 2 - 4, HEIGHT / 2 - 14) : 48;
const LC = big ? [COL.x + COL.w / 2, HEIGHT / 2] : [COL.x + COL.w / 2 + 34, 14 + LR];
el.loupe.setAttribute("transform", "translate(" + LC[0].toFixed(1) + " " + LC[1].toFixed(1) + ") scale(" + (LR / 50).toFixed(3) + ")");
const CH = { x: COL.x + 4, y: 2 * LR + 28, w: COL.w - 8, h: HEIGHT - (2 * LR + 28) - 10 };

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { v: L0.v, n: L0.n || N_T, tch: L0.tch || 2, limit: L0.limit || 0, t: 0, edge: 1, msg: "", msgT: 0, broken: 0 };
const lifeNow = () => lifeOf(st.v, st.n);
const tcNow = () => tcOf(st.v, L0.tc1);
const vbNow = () => wearOf(st.t / lifeNow());
const partsNow = () => Math.floor(st.t / tcNow());
let idx = { on: false, t: 0, swapped: false };
let spin = 0, chipClock = 0;
const chips = [];

// ------------------------------------------------ drawing
function drawRibs() {
  const F = G.frameOf([0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const ribs = G.ribsOf(F, BAR_CUT, BAR.x1, R0, RIB_COUNT, P, { phase: spin, fade: [0.06, 0.4] });
  el.ribs.innerHTML = fadedSvg(ribs, { tone: "lo" });
}
function drawWear() {
  el.wear.innerHTML = wearSvg(K, P, FLANK, Math.min(0.6, vbNow()), 1);
}
function chipPath(cx, cy, size, turn) {
  const out = [], inner = [], n = 12;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = turn + t * Math.PI * 2 * 1.15, r = size * (0.35 + 0.65 * t), w = size * (0.16 + 0.18 * t);
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.7]);
    inner.push([cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.7]);
  }
  return "M" + out.concat(inner.reverse()).map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + "Z";
}
function drawChips() {
  let html = "";
  for (const c of chips) {
    const [sx, sy] = iso(c.p, P);
    html += '<path class="ti-chip-fly" style="opacity:' + c.a.toFixed(2) + '" d="' + chipPath(sx, sy, c.size * KS, c.turn) + '"/>';
  }
  el.chips.innerHTML = html;
}
function drawLoupe() {
  const labels = big ? [fmt(0.3, 1), fmt(0.6, 1), "VB " + fmt(Math.min(0.6, vbNow()), 2) + " mm"] : null;
  el.view.innerHTML = loupeSvg(Math.min(0.6, vbNow()), labels, st.broken);
}
let marked = -1;
function drawMark() {
  if (LVL !== 1 || marked < 0) { el.mark.innerHTML = ""; return; }
  const [x, y] = iso(PARTS[marked].at, P);
  el.mark.innerHTML = '<circle class="ti-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="ti-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
}
function insertLift() {
  const lift = idx.on ? Math.sin(Math.PI * clamp(idx.t / 0.7, 0, 1)) * 16 : 0;
  const tr = lift > 0.01 ? translateAlong(P, [0, 0, lift]) : "";
  el.ins.forEach((n) => (tr ? n.setAttribute("transform", tr) : n.removeAttribute("transform")));
}

// the chart (levels 3 and 4), in the right column under the loupe
const f1 = (v) => v.toFixed(1);
function chartSvg() {
  if (LVL < 3) return "";
  const pad = { l: 30, r: 8, t: 20, b: 26 };
  const x0 = CH.x + pad.l, x1 = CH.x + CH.w - pad.r, y0 = CH.y + CH.h - pad.b, y1 = CH.y + pad.t;
  const vMin = 140, vMax = 280;
  const X = (v) => x0 + ((v - vMin) / (vMax - vMin)) * (x1 - x0);
  const out = ['<rect class="ti-panel" x="' + CH.x + '" y="' + CH.y + '" width="' + CH.w + '" height="' + CH.h + '" rx="6"/>'];
  let Yf, yMax, yTicks, title, curves = [], dot, opt = null, yLab;
  if (LVL === 3) {
    yMax = 60; yTicks = [0, 30, 60]; title = (EN ? "tool life T, min" : "standtijd T, min");
    Yf = (t) => y0 - (Math.min(t, yMax) / yMax) * (y0 - y1);
    const pts = [];
    for (let v = vMin; v <= vMax; v += 2) { const t = lifeOf(v, st.n); if (t <= yMax * 1.02) pts.push([X(v), Yf(t)]); }
    curves.push(["ti-curve", pts]);
    dot = [X(st.v), Yf(lifeNow())];
    yLab = (t) => String(t);
  } else {
    yMax = 1.2; yTicks = [0, 0.4, 0.8, 1.2]; title = (EN ? "cost per part, €" : "kosten per stuk, €");
    Yf = (c) => y0 - (Math.min(c, yMax) / yMax) * (y0 - y1);
    const tot = [], mach = [], tool = [];
    for (let v = vMin; v <= vMax; v += 2) { const c = costOf(v, st.tch); tot.push([X(v), Yf(c.total)]); mach.push([X(v), Yf(c.machine)]); tool.push([X(v), Yf(c.change + c.tool)]); }
    curves.push(["ti-curve2", mach], ["ti-curve3", tool], ["ti-curve", tot]);
    dot = [X(st.v), Yf(costOf(st.v, st.tch).total)];
    const e = econOf(st.tch);
    opt = [X(e.Ve), Yf(costOf(e.Ve, st.tch).total)];
    yLab = (c) => fmt(c, 1);
  }
  const grid = yTicks.map((t) => "M" + f1(x0) + " " + f1(Yf(t)) + "H" + f1(x1)).join("") + [150, 200, 250].map((v) => "M" + f1(X(v)) + " " + f1(y0) + "V" + f1(y1)).join("");
  out.push('<path class="ti-grid" d="' + grid + '"/>');
  out.push('<path class="ti-axis" d="M' + f1(x0) + " " + f1(y1) + "V" + f1(y0) + "H" + f1(x1) + '"/>');
  yTicks.forEach((t) => out.push('<text class="ti-ax" x="' + f1(x0 - 3) + '" y="' + f1(Yf(t) + 3) + '" text-anchor="end">' + yLab(t) + "</text>"));
  [150, 200, 250].forEach((v) => out.push('<text class="ti-ax" x="' + f1(X(v)) + '" y="' + f1(y0 + 13) + '" text-anchor="middle">' + v + "</text>"));
  out.push('<text class="ti-ax" x="' + f1(x1) + '" y="' + f1(y0 + 24) + '" text-anchor="end">Vc, m/min</text>');
  out.push('<text class="ti-ax ti-ax-b" x="' + f1(CH.x + 6) + '" y="' + f1(CH.y + 14) + '">' + title + "</text>");
  for (const [cls, pts] of curves) out.push('<path class="' + cls + '" d="M' + pts.map(([x, y]) => f1(x) + " " + f1(y)).join("L") + '"/>');
  out.push('<path class="ti-guide" d="M' + f1(dot[0]) + " " + f1(y0) + "V" + f1(dot[1]) + "H" + f1(x0) + '"/>');
  if (opt) out.push('<circle class="ti-opt" cx="' + f1(opt[0]) + '" cy="' + f1(opt[1]) + '" r="3.2"/>');
  out.push('<circle class="ti-dot" cx="' + f1(dot[0]) + '" cy="' + f1(dot[1]) + '" r="3.4"/>');
  return out.join("");
}
let lastChart = "";
function drawChart() {
  const key = st.v + "|" + st.n + "|" + st.tch;
  if (key === lastChart) return;
  lastChart = key;
  el.chart.innerHTML = chartSvg();
}

function readout() {
  const out = [];
  const vb = Math.min(0.6, vbNow());
  const msg = st.msgT > 0 ? '<span class="ti-acc">' + st.msg + "</span>" : "";
  if (LVL === 1) {
    out.push("CNMG 120408 · P · 4 " + T.edge + (EN ? "s" : "en") + " · " + T.edge + " " + st.edge + " " + T.of + " 4 · " + partsNow() + " " + T.parts);
    out.push(eur(14) + " / 4 = " + eur(3.5) + " " + T.perEdge + " / 70 = " + '<span class="ti-acc">' + eur(0.05) + "</span> " + T.perPart);
    if (marked >= 0) { const [name, what] = T.names[PARTS[marked].key]; out.push('<span class="ti-acc">' + name + "</span> · " + what); }
    else out.push(msg || '<span class="ti-mute">' + T.tapPart + "</span>");
  } else if (LVL === 2) {
    const limit = st.limit;
    out.push("Vc " + st.v + " m/min · VB " + fmt(vb, 2) + " mm (" + T.crit + " " + fmt(0.3, 1) + ")");
    out.push(T.edge + " " + st.edge + " · " + partsNow() + " / " + limit + " " + T.parts + " · " + T.life + " ≈ " + Math.round(N0 * (V1 / st.v) ** 3) + " " + T.parts);
    out.push(eur(12) + " / 4 = " + eur(3) + " / " + limit + " = " + '<span class="ti-acc">' + eur(12 / 4 / limit, limit === 80 ? 4 : 3) + "</span> " + T.perPart);
    if (msg) out.push(msg);
  } else if (LVL === 3) {
    const life = lifeNow(), tc = tcNow(), ex = Math.round(1 / st.n);
    const sup = { 2: "²", 4: "⁴", 5: "⁵" }[ex] || "^" + ex;
    out.push("Vc " + st.v + " m/min · n " + fmt(st.n, st.n === 0.25 ? 2 : 1) + " · VB " + T.now + " " + fmt(vb, 2) + " mm");
    out.push("T = 15 × (200 / " + st.v + ")" + sup + " = " + '<span class="ti-acc">' + fmt(life, 1) + "</span> min");
    out.push("tc = 0" + T.dec + "5 × 200 / " + st.v + " = " + fmt(tc, 2) + " " + T.tc);
    out.push(fmt(life, 1) + " / " + fmt(tc, 2) + " = " + '<span class="ti-acc">' + Math.floor(life / tc + 1e-9) + "</span> " + T.parts + " " + T.perEdge);
  } else {
    const c = costOf(st.v, st.tch), e = econOf(st.tch);
    out.push("Vc " + st.v + " → T " + fmt(c.T, 1) + " min · tc " + fmt(c.tc, 2) + " min");
    out.push(T.machine + " " + fmt(c.machine, 2) + " + " + T.change + " " + fmt(c.change, 2) + " + " + T.tool + " " + fmt(c.tool, 2) + " = " + '<span class="ti-acc">' + eur(c.total) + "</span>");
    out.push("Te = 3 × (" + fmt(st.tch, st.tch < 1 ? 1 : 0) + " + 4 / 1" + T.dec + "5) = " + fmt(e.Te, 1) + " min");
    out.push(T.econ + ": Vc " + Math.round(e.Ve) + " m/min · " + eur(costOf(e.Ve, st.tch).total) + " " + T.perPart);
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function draw() {
  drawRibs();
  drawWear();
  drawChips();
  drawLoupe();
  drawChart();
  drawMark();
  insertLift();
  readout();
}

// ------------------------------------------------ cutting, wear and indexing
function say(text) { st.msg = text; st.msgT = 4; }
function startIndex(reason) {
  if (idx.on) return;
  idx = { on: true, t: 0, swapped: false };
  if (reason) say(reason);
}
function stepCut(dt) {
  if (st.msgT > 0) st.msgT -= dt;
  st.broken = Math.max(0, st.broken - dt * 0.8);
  if (idx.on) {
    idx.t += dt;
    if (!idx.swapped && idx.t >= 0.35) { idx.swapped = true; st.t = 0; st.edge = (st.edge % 4) + 1; }
    if (idx.t >= 0.7) idx.on = false;
    return;
  }
  st.t += dt * TS;
  const vb = vbNow();
  if (vb >= 0.6) { st.broken = 1; startIndex(T.broke); return; }
  if (LVL === 1 && partsNow() >= 70) startIndex(T.ok);
  else if (LVL === 2 && partsNow() >= st.limit) startIndex(vb > 0.3 ? T.late : vb < 0.24 ? T.early : T.ok);
  else if (LVL >= 3 && st.t >= lifeNow()) startIndex("");
  chipClock += dt;
  if (chipClock > 0.22) { chipClock = 0; spawnChip(); }
}
function spawnChip() {
  if (chips.length > 4) return;
  chips.push({ p0: [NOSE[0] - 6, NOSE[1] + 6, 1], p: [NOSE[0] - 6, NOSE[1] + 6, 1], age: 0, a: 0, size: 6 + Math.random() * 2.5, turn0: Math.random() * 6.28, turn: 0, vx: -(14 + Math.random() * 10), vy: 10 + Math.random() * 10, vz: 34 + Math.random() * 12 });
}
function stepChips(dt) {
  for (const c of chips) {
    c.age += dt;
    const t = c.age;
    c.p = [c.p0[0] + c.vx * t, c.p0[1] + c.vy * t, c.p0[2] + c.vz * t - 70 * t * t];
    c.turn = c.turn0 + 6 * t;
    c.a = smooth(0, 0.08, t) * (1 - smooth(0.5, 0.9, t));
  }
  for (let i = chips.length - 1; i >= 0; i--) if (chips[i].age > 0.9) chips.splice(i, 1);
}
function stillPose() {
  chips.length = 0;
  idx.on = false;
  st.t = 0.62 * lifeNow();
  if (LVL === 1) st.t = Math.min(st.t, 40 * tcNow());
  if (LVL === 2) st.t = Math.min(0.97 * lifeNow(), (st.limit - 6) * tcNow());
}

// ------------------------------------------------ the idle tour
// Level 2: Vc 200 at limit 80, then limit 100 (the edge passes VB 0.3), then
// Vc 220. Level 3: 200, 220 (the lesson), 250, 160 (the recall). Level 4: 200,
// then the economic speed 204, then the sister tool and its 228.
const TOURS = {
  1: [{}],
  2: [{ v: 200, limit: 80 }, { v: 200, limit: 100 }, { v: 220, limit: 80 }, { v: 180, limit: 80 }],
  3: [{ v: 200 }, { v: 220 }, { v: 250 }, { v: 160 }],
  4: [{ v: 200, tch: 2 }, { v: 204, tch: 2 }, { v: 228, tch: 0.3 }, { v: 250, tch: 0.3 }],
};
let touring = !still.matches, tourStep = 0, tourClock = 0, idleTimer = 0;
function stepTour(dt) {
  if (!touring || LVL === 1) return;
  tourClock += dt;
  if (tourClock < 9) return;
  tourClock = 0;
  tourStep = (tourStep + 1) % TOURS[LVL].length;
  Object.assign(st, TOURS[LVL][tourStep]);
  sync();
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (calm) stillPose();
  else {
    stepCut(dt);
    stepChips(dt);
    stepTour(dt);
    spin = (spin - dt * 2.2) % (2 * Math.PI);
  }
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; run(); } }, 40000);
}

// ------------------------------------------------ controls
const stepBtns = [...document.querySelectorAll("[data-step]")];
const vBox = document.querySelector("[data-vval]");
const nBtns = [...document.querySelectorAll("[data-n]")];
const tchBtns = [...document.querySelectorAll("[data-tch]")];
const limBtns = [...document.querySelectorAll("[data-lim]")];
const idxBtn = document.querySelector("[data-index]");
document.querySelector('[data-row="v"]').hidden = LVL === 1;
document.querySelector('[data-row="index"]').hidden = LVL !== 1;
document.querySelector('[data-row="n"]').hidden = LVL !== 3;
document.querySelector('[data-row="tch"]').hidden = LVL !== 4;
document.querySelectorAll("[data-lim]").forEach((b) => (b.hidden = LVL !== 2));
function sync() {
  const list = V_LIST[LVL] || [];
  const i = list.indexOf(st.v);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1));
  vBox.innerHTML = "<i>V</i><sub>c</sub>&nbsp;<b>" + st.v + "</b>";
  nBtns.forEach((b) => { const on = Number(b.dataset.n) === st.n; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  tchBtns.forEach((b) => { const on = Number(b.dataset.tch) === st.tch; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  limBtns.forEach((b) => b.setAttribute("aria-pressed", String(st.limit === 100)));
  describe();
}
function describe() {
  let text;
  const vb = fmt(Math.min(0.6, vbNow()), 2);
  if (LVL === 1) text = "CNMG 120408, " + T.edge + " " + st.edge + " " + T.of + " 4" + (marked >= 0 ? ", " + T.names[PARTS[marked].key].join(": ") : "");
  else if (LVL === 2) text = "Vc " + st.v + ", VB " + vb + " mm, " + partsNow() + " / " + st.limit + " " + T.parts;
  else if (LVL === 3) text = "Vc " + st.v + ", n " + fmt(st.n, 2) + ": T " + fmt(lifeNow(), 1) + " min, " + Math.floor(lifeNow() / tcNow() + 1e-9) + " " + T.parts + " " + T.perEdge;
  else { const c = costOf(st.v, st.tch), e = econOf(st.tch); text = "Vc " + st.v + ": " + eur(c.total) + " " + T.perPart + "; " + T.econ + " Vc " + Math.round(e.Ve); }
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function changed() { steer(); sync(); announce(); kick(); }
function stepValue(dir) {
  const list = V_LIST[LVL];
  if (!list) return;
  let i = list.indexOf(st.v);
  if (i < 0) i = 0;
  i = clamp(i + dir, 0, list.length - 1);
  // keep the worn fraction of the edge when the speed changes
  const u = st.t / lifeNow();
  st.v = list[i];
  st.t = u * lifeNow();
  changed();
}
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
nBtns.forEach((b) => b.addEventListener("click", () => { const u = st.t / lifeNow(); st.n = Number(b.dataset.n); st.t = u * lifeNow(); changed(); }));
tchBtns.forEach((b) => b.addEventListener("click", () => { st.tch = Number(b.dataset.tch); changed(); }));
limBtns.forEach((b) => b.addEventListener("click", () => { st.limit = st.limit === 100 ? 80 : 100; changed(); }));
idxBtn.addEventListener("click", () => { startIndex(""); steer(); kick(); });
function radioKeys(group, keys, current, set) {
  group.addEventListener("keydown", (event) => {
    const i = keys.indexOf(current());
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % keys.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + keys.length - 1) % keys.length;
    if (next < 0) return;
    event.preventDefault();
    set(keys[next]);
    group.querySelectorAll('[role="radio"]')[next].focus();
  });
}
radioKeys(document.querySelector('[data-row="n"]'), N_LIST, () => st.n, (v) => { const u = st.t / lifeNow(); st.n = v; st.t = u * lifeNow(); changed(); });
radioKeys(document.querySelector('[data-row="tch"]'), [2, 0.3], () => st.tch, (v) => { st.tch = v; changed(); });

function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => {
    const [px, py] = iso(p.at, P);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL !== 1) return;
  marked = nearestPart(toView(event));
  steer();
  sync();
  announce();
  kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL === 1 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL === 1 && (event.key === "i" || event.key === "I")) { startIndex(""); steer(); kick(); }
  else if (LVL > 1 && (event.key === "ArrowUp" || event.key === "ArrowRight")) stepValue(1);
  else if (LVL > 1 && (event.key === "ArrowDown" || event.key === "ArrowLeft")) stepValue(-1);
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else run(); });
if (still.matches) stillPose(); else st.t = 0.3 * lifeNow();
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Wisselplaat en slijtage",
    hint1: "Tik een onderdeel · draai de plaat · 1 s = 1,5 min",
    hint2: "Vc − of + · grens 80 of 100 · 1 s = 1,5 min",
    hint3: "Vc − of +, kies n · 1 s = 1,5 min",
    hint4: "Vc − of +, kies de wisseltijd · 1 s = 1,5 min",
    index: "Draai de plaat naar de volgende snijkant",
    lim: "Grens 100",
    lower: "Lager",
    higher: "Hoger",
    nGroup: "Taylor-exponent n",
    tchGroup: "Wisseltijd",
    tch2: "Wissel 2 min",
    tch03: "Zuster 0,3 min",
    label: LABEL_NL,
    aria: "Wisselplaat in een houder. Niveau 1: pijltjes kiezen een onderdeel, I draait de plaat. Niveau 2 tot 4: pijl omhoog en omlaag veranderen de snijsnelheid.",
  },
  en: {
    title: "Insert and tool wear",
    hint1: "Tap a part · index the insert · 1 s = 1.5 min",
    hint2: "Vc − or + · limit 80 or 100 · 1 s = 1.5 min",
    hint3: "Vc − or +, pick n · 1 s = 1.5 min",
    hint4: "Vc − or +, pick the change time · 1 s = 1.5 min",
    index: "Index the insert to the next edge",
    lim: "Limit 100",
    lower: "Lower",
    higher: "Higher",
    nGroup: "Taylor exponent n",
    tchGroup: "Change time",
    tch2: "Change 2 min",
    tch03: "Sister 0.3 min",
    label: LABEL_EN,
    aria: "Insert in a holder. Level 1: arrows pick a part, I indexes the insert. Levels 2 to 4: up and down change the cutting speed.",
  },
};

const sN = STRINGS.nl;
const controls = [
  `<div class="ti-controls">`,
  `<div class="ti-row" data-row="index"><button type="button" class="ti-btn" data-index="">${sN.index}</button></div>`,
  `<div class="ti-row" data-row="v"><button type="button" class="ti-btn" data-step="-" aria-label="${sN.lower}">−</button><span class="ti-btn ti-val" data-vval="" aria-hidden="true"></span><button type="button" class="ti-btn" data-step="+" aria-label="${sN.higher}">+</button><button type="button" class="ti-btn" data-lim="" aria-pressed="false">${sN.lim}</button></div>`,
  `<div class="ti-row" data-row="n" role="radiogroup" aria-label="${sN.nGroup}">${N_LIST.map((n) => `<button type="button" class="ti-btn" role="radio" data-n="${n}" aria-checked="${n === N_T}" tabindex="${n === N_T ? 0 : -1}"><i>n</i>&nbsp;${String(n).replace(".", ",")}</button>`).join("")}</div>`,
  `<div class="ti-row" data-row="tch" role="radiogroup" aria-label="${sN.tchGroup}"><button type="button" class="ti-btn" role="radio" data-tch="2" aria-checked="true">${sN.tch2}</button><button type="button" class="ti-btn" role="radio" data-tch="0.3" aria-checked="false" tabindex="-1">${sN.tch03}</button></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="ti-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="ti-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="ti-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=s["hint"+lv]||s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
var set=function(sel,txt){var n=document.querySelector(sel);if(n)n.textContent=txt;};
set("[data-index]",s.index);set("[data-lim]",s.lim);set('[data-tch="2"]',s.tch2);set('[data-tch="0.3"]',s.tch03);
document.querySelectorAll("[data-n] ").forEach(function(b){b.lastChild.textContent="\\u00a0"+b.getAttribute("data-n");});
document.querySelector('[data-row="n"]').setAttribute("aria-label",s.nGroup);document.querySelector('[data-row="tch"]').setAttribute("aria-label",s.tchGroup);
document.querySelector('[data-step="-"]').setAttribute("aria-label",s.lower);document.querySelector('[data-step="+"]').setAttribute("aria-label",s.higher);
var st=document.querySelector(".ti-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + latheScript + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: T(220) ${lifeOf(220).toFixed(2)} · parts ${(lifeOf(220) / tcOf(220, 0.5)).toFixed(1)} · T(160) ${lifeOf(160).toFixed(1)} · C ${econOf(2).C.toFixed(1)} · Te ${econOf(2).Te} → Ve ${econOf(2).Ve.toFixed(1)} · sister Te ${econOf(0.3).Te.toFixed(2)} → ${econOf(0.3).Ve.toFixed(1)}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, {});
