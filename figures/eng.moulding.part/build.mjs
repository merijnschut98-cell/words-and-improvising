// Dev tool, not shipped. Builds the standalone figure for the topic "Fouten"
// (module Spuitgieten): the lessons eng.moulding.defects (level 1), diagnose
// (level 2), warpage (level 3) and defectdata (level 4).
//
//   node figures/eng.moulding.part/build.mjs            build the page
//   node figures/eng.moulding.part/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.moulding.part.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL (defaults:
// prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, writeFileSync } from "node:fs";
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
const OUT = join(ROOT, "src/content/courses/figures/eng.moulding.part.html");

// ---------------------------------------------------------------- the model
// A moulded box, 200 × 100 × 50 mm, from a 2-cavity mould, on the take-out
// conveyor under a dial gauge. Four settings decide which defects show on it,
// following the causes the lessons name (eng.moulding.defects, diagnose,
// warpage, defectdata):
//   Short shot   melt too cold: the flow front stops before the end of the
//                flow path. Filled flow length = fill × the longest path
//                (gate in the floor centre to a rim corner, 162 mm);
//                fill = 1 − 0.6 % per °C below 220 °C (illustrative).
//   Flash        needed clamp force = projected area × cavity pressure
//                (lesson defects recall: 400 cm² × 0.5 t/cm² = 200 t on a
//                160 t press → 40 t short). Here 2 × 200 cm² = 400 cm² and the
//                hold pressure in bar / 1000 as t/cm². Hot, runny melt finds
//                the gaps sooner: +10 % force needed at 250 °C, +20 % at 260 °C
//                (illustrative). Flash when needed > clamp force.
//   Sink         depth from the defectdata lesson's 2 × 2 DOE: hold pressure
//                300/600 bar × hold time 3/6 s → 40, 30, 24, 10 µm, bilinear
//                and extended along pressure. Visible above 20 µm (assumed).
//                Levels 1–3 run 6 s hold time.
//   Warp         differential shrinkage: ejecting too hot (cooling below 12 s:
//                +0.1 mm per s) and a core hotter than the cavity (+0.05 mm per
//                °C; lesson warpage: some 10 °C can be enough). Read on the dial
//                gauge after 24 h; at the machine it shows 40 % of that
//                (illustrative). Limit 0.3 mm (assumed). Drawn 10× enlarged.
// Level 3 adds the warpage lesson's shrinkage example (PA6 GF30, 0.3 % along
// the flow, 0.7 % across): steel 200 × 100 at one factor 0.5 % → part 200.4 ×
// 99.8 mm; steel per direction 200.6 × 100.7 → 200 × 100 mm.
// Level 4 adds the DOE main effects and the sensor payback (€ 12,000 / € 3,000
// per month = 4 months).
const AREA = 400; // cm², two cavities of 200 cm²
const SETS = {
  T: [200, 210, 220, 230, 240, 250, 260],
  p: [200, 300, 400, 500, 600, 700],
  F: [140, 160, 180, 200, 220, 240],
  tc: [6, 8, 10, 12, 14, 16, 18, 20],
  dT: [0, 5, 10, 15, 20],
};
const NOMINAL = { T: 230, p: 500, F: 220, tc: 14, dT: 0, th: 6 };
const PATH_MAX = Math.hypot(100, 50) + 50; // mm, gate to rim corner
const DOE = { pLo: 300, pHi: 600, tLo: 3, tHi: 6, runs: [[40, 30], [24, 10]] }; // runs[time][pressure]
const SINK_VISIBLE = 20; // µm
const WARP_LIMIT = 0.3; // mm
const AT_MACHINE = 0.4;
const SHRINK = { along: 0.003, across: 0.007, one: 0.005, L: 200, W: 100 };
const SENSOR = { cost: 12000, perMonth: 3000 };
const fillOf = (T) => (T >= 220 ? 1 : 1 - 0.006 * (220 - T));
const needOf = (p) => (AREA * p) / 1000;
const hotOf = (T) => (T >= 260 ? 0.2 : T >= 250 ? 0.1 : 0);
const flashOf = (p, T, F) => Math.max(0, needOf(p) * (1 + hotOf(T)) - F);
function sinkOf(p, th) {
  const u = (p - DOE.pLo) / (DOE.pHi - DOE.pLo);
  const v = Math.min(1, Math.max(0, (th - DOE.tLo) / (DOE.tHi - DOE.tLo)));
  const at = (row) => row[0] + (row[1] - row[0]) * u;
  return Math.max(0, at(DOE.runs[0]) * (1 - v) + at(DOE.runs[1]) * v);
}
const warpOf = (tc, dT) => 0.1 * Math.max(0, 12 - tc) + 0.05 * dT;
const mainEffects = () => {
  const r = DOE.runs;
  return { p: (r[0][1] + r[1][1]) / 2 - (r[0][0] + r[1][0]) / 2, t: (r[1][0] + r[1][1]) / 2 - (r[0][0] + r[0][1]) / 2, pShort: r[0][1] - r[0][0], pLong: r[1][1] - r[1][0] };
};
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(400 * 0.5, 200, 1e-9, "defects recall needed");
  near(400 * 0.5 - 160, 40, 1e-9, "defects recall shortfall");
  near(needOf(500), 200, 1e-9, "needed at 500 bar");
  near(flashOf(500, 230, 160), 40, 1e-9, "flash at 160 t");
  near(sinkOf(300, 3), 40, 1e-9, "DOE low low");
  near(sinkOf(600, 3), 30, 1e-9, "DOE high short");
  near(sinkOf(300, 6), 24, 1e-9, "DOE low long");
  near(sinkOf(600, 6), 10, 1e-9, "DOE high long");
  const m = mainEffects();
  near(m.p, -12, 1e-9, "main effect pressure");
  near(m.t, -18, 1e-9, "main effect time");
  near(m.pLong, -14, 1e-9, "pressure at long time");
  near(m.pShort, -10, 1e-9, "pressure at short time");
  near(2 ** 3, 8, 0, "3 factors");
  near(2 ** 4, 16, 0, "4 factors");
  near(SENSOR.cost / SENSOR.perMonth, 4, 1e-9, "sensor payback");
  near(SHRINK.L * (1 + SHRINK.one), 201.0, 1e-9, "steel length one factor");
  near(SHRINK.W * (1 + SHRINK.one), 100.5, 1e-9, "steel width one factor");
  near(Math.round(SHRINK.L * (1 + SHRINK.one) * (1 - SHRINK.along) * 10) / 10, 200.4, 1e-9, "part length");
  near(Math.round(SHRINK.W * (1 + SHRINK.one) * (1 - SHRINK.across) * 10) / 10, 99.8, 1e-9, "part width");
  near(SHRINK.L * (1 + SHRINK.along), 200.6, 1e-9, "steel length per direction");
  near(SHRINK.W * (1 + SHRINK.across), 100.7, 1e-9, "steel width per direction");
  near(150 * (0.008 - 0.004), 0.6, 1e-9, "warpage recall");
  near((1 / 20 / 4) * 100, 1.25, 1e-9, "diagnose example");
  near((1 / 10 / 8) * 100, 1.25, 1e-9, "diagnose recall");
}
const PRESETS = {
  good: { ...NOMINAL },
  short: { ...NOMINAL, T: 200 },
  flash: { ...NOMINAL, F: 160 },
  sink: { ...NOMINAL, p: 200 },
  warp: { ...NOMINAL, tc: 6 },
};
const LEVELS = {
  1: { preset: "good" },
  2: { preset: "good" },
  3: { set: { ...NOMINAL, dT: 10 } },
  4: { set: { ...NOMINAL, p: 300, th: 3 } },
};

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the conveyor, +y toward the
// operator. The box sits open side up on the belt; its gate is in the middle
// of the floor; the dial gauge stands on the far frame rail and touches the far
// rim near the right end of the box.
const WIDTH = 600;
const FLOOR = 0;
const RAIL = { x: -150, w: 300, z0: 44, z1: 64 };
const BELT_TOP = 62;
const BOX = { x: -100, y: -50, w: 200, d: 100, r: 2, z0: BELT_TOP, h: 50, wall: 2.5, floor: 2.5 };
const BOX_TOP = BOX.z0 + BOX.h;
const BOX_CX = BOX.x + BOX.w / 2;
const GX = 80; // gauge x
const GY = BOX.y + BOX.wall / 2; // on the far rim
const DIAL = { z: 154, r: 13, y0: GY - 3.25, y1: GY + 3.25 };
const SLEEVE = { z0: BOX_TOP + 10, z1: DIAL.z - DIAL.r };
const STROKE = 16; // drawn plunger travel (1.6 mm at 10×)
const EXAG = 10;
const RIBS = [-60, 0, 60];

const FIT = [
  ...k.boxCorners({ x: -154, y: -80, w: 308, d: 160 }, FLOOR, BOX_TOP),
  ...k.boxCorners({ x: 136, y: 78, w: 40, d: 52 }, 30, 64),
  ...k.boxCorners({ x: GX - 16, y: -80, w: 32, d: 40 }, 64, DIAL.z + DIAL.r + 16),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 52);
const ELEVATION = Number(process.env.EL ?? 36);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameY = (o) => G.frameOf(o, Y, Zv, X);
const frameZ = (o) => G.frameOf(o, Zv, X, Y);
const frameNZ = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const fix = (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(3);

// ---------------------------------------------------------------- recorder
// One thing moves as a solid: the gauge plunger ("gauge"), lifted by the warp.
const MOVES = { gauge: [0, 0, STROKE] };
const R = A.recorder(P, { order: ["gauge"], spring: {} });
const STATES = [0, 0.25, 0.5, 0.75, 1].map((a) => ({ label: `gauge ${a}`, shares: [a] }));
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "" } = {}) {
  const tag = piece ? ` data-${piece}=""` : "";
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVES[piece] : [0, 0, 0], attrs: tag + attrs });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner, ground }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
let clips = 0;
function rod(name, F, from, to, r, stroke, style = {}, opts = {}) {
  const id = `mp-clip-${clips++}`;
  const R0 = G.rodOut(F, from, to, r, P, { stroke });
  const svg = `<clipPath id="${id}"><path data-hold="" d="${R0.clip}"/></clipPath><g clip-path="url(#${id})">${S(R0.paths, { tone: "mid", ...style })}</g>`;
  const shape = R.solid(A.slide(F, from, to, r, { name }));
  return put(name, G.add3(F.o, G.mul3(F.a, (from + to) / 2)), svg, [shape], opts);
}

// ---------------------------------------------------------------- conveyor frame
const halo = [`<path class="iso-halo" d="${k.haloOf({ x: -142, y: -80, w: 284, d: 160, r: 2 }, FLOOR, 2, P)}"/>`];
for (const x of [-132, 132]) for (const y of [-74, 74]) {
  post("leg.foot", x, y, 6, FLOOR, 2.5, { tone: "lo" }, { steps: 6, ground: true });
  post("leg.screw", x, y, 2.2, 2.5, 6, { tone: "mid", crease: "none" }, { steps: 16 });
  box("leg.post", { x: x - 4, y: y - 4, w: 8, d: 8, r: 0.4 }, 6, RAIL.z0, { tone: "mid" }, { steps: 2 });
}
for (const y of [-76, 72]) box("frame.brace", { x: -128, y, w: 256, d: 4, r: 0.3 }, 16, 22, { tone: "mid", crease: "lo" }, { steps: 2 });
{
  const far = { x: RAIL.x, y: -78, w: RAIL.w, d: 8, r: 0.6 };
  box("frame.rail-far", far, RAIL.z0, RAIL.z1, { tone: "mid" }, { steps: 2, bevel: 0.4 });
  const near = { x: RAIL.x, y: 70, w: RAIL.w, d: 8, r: 0.6 };
  const fy = 78;
  const screws = [-145, -80, 80, 145].flatMap((x) => [[x, fy, 48], [x, fy, 60]]);
  const label = [[-52, fy, 59], [-14, fy, 59], [-14, fy, 49], [-52, fy, 49]];
  const extra =
    `<path class="mp-card" d="${k.pathOf(label.map(at), true)}"/>` +
    L([56.6, 54, 51.4].map((z, i) => k.segment([-49.5, fy, z], [-49.5 + [26, 17, 22][i], fy, z], P)).join(""), { tone: "lo", free: true }) +
    Dt(screws.map(at), { size: 0.42 });
  box("frame.rail-near", near, RAIL.z0, RAIL.z1, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(near, 54, P, 2), { tone: "faint" }), extra });
  for (const x of [-140, 140]) discAt("frame.bearing", frameY([x, fy, 54]), 0, 2.4, 5, { tone: "mid" }, { steps: 6, extra: Dt([at([x, fy + 2.4, 54])], { size: 0.45, tone: "hi" }) });
}
{
  // the belt with its cross ribs, edge to edge
  const plan = { x: -146, y: -70, w: 292, d: 140, r: 0.4 };
  const ribs = [];
  for (let x = -138; x <= 138; x += 12) ribs.push(k.segment([x, -70, BELT_TOP], [x, 70, BELT_TOP], P));
  box("belt", plan, BELT_TOP - 4, BELT_TOP, { tone: "lo", crease: "faint" }, { steps: 1, inner: L(ribs.join(""), { tone: "faint" }) });
}
// side guides on brackets
for (const [y0, yb] of [[-67, -77], [64, 64]]) {
  for (const x of [-110, 0, 120]) box("guide.bracket", { x: x - 3, y: yb, w: 6, d: 13, r: 0.3 }, RAIL.z1, RAIL.z1 + 2, { tone: "mid" }, { steps: 1 });
  box("guide.strip", { x: -140, y: y0, w: 280, d: 3, r: 0.3 }, RAIL.z1 + 2, RAIL.z1 + 8, { tone: "mid", crease: "lo" }, { steps: 1, extra: Dt([-110, 0, 120].map((x) => at([x, y0 + 1.5, RAIL.z1 + 8])), { size: 0.4 }) });
}
// drive: gearbox and motor at the right end, turned to the operator
{
  const gb = { x: 146, y: 78, w: 26, d: 16, r: 0.8 };
  box("drive.gearbox", gb, 38, 62, { tone: "mid" }, { steps: 2, bevel: 0.5, inner: L(k.sideSeam(gb, 50, P, 2), { tone: "faint" }), extra: Dt(k.corners(gb, 2).map(([x, y]) => at([x, y, 62])), { size: 0.42 }) });
  const FM = frameY([159, 94, 50]);
  turned("drive.motor", FM, [[0, 9], [24, 9]], { tone: "mid" }, { inner: k.fadedSvg(G.ribsOf(FM, 1, 23, 9, 18, P, { fade: [0.04, 0.42], seams: true }), { tone: "lo" }) });
  discAt("drive.fan", FM, 24, 27, 7.6, { tone: "mid" }, { extra: Dt([at([159, 94 + 27, 50])], { size: 0.5, tone: "hi" }) });
}

// ---------------------------------------------------------------- the part (drawn live)
// Its recorded shape is the box at rest; what is drawn is computed in the page
// from the settings: flow front, flash fin, sink marks and warp.
{
  const shape = R.solid(A.slab(BOX, BOX.z0, BOX.h, { name: "part.box" }, 2));
  const plan = k.insetPlan(BOX, -3);
  const shadow = `<path class="mp-shadow" d="${k.planOutline(plan, BELT_TOP, P, 3)}"/>`;
  put("part.box", [BOX_CX, 0, BOX.z0 + BOX.h / 2], shadow + `<g data-box=""></g>`, [shape]);
}

// ---------------------------------------------------------------- the dial gauge on its stand
const FACE = DIAL.y1;
{
  const base = { x: GX - 14, y: -79, w: 28, d: 10, r: 0.8 };
  box("gauge.base", base, RAIL.z1, RAIL.z1 + 14, { tone: "mid" }, { steps: 2, bevel: 0.5, inner: L(k.sideSeam(base, RAIL.z1 + 5, P, 2), { tone: "faint" }), extra: Dt(k.corners(base, 2).map(([x, y]) => at([x, y, RAIL.z1 + 14])), { size: 0.42 }) });
  post("gauge.post", GX, -74, 3.2, RAIL.z1 + 14, DIAL.z - 6, { tone: "mid" }, {});
  const blk = { x: GX - 5, y: -79, w: 10, d: 10, r: 0.6 };
  box("gauge.clamp", blk, DIAL.z - 6, DIAL.z + 6, { tone: "mid" }, { steps: 2, bevel: 0.4 });
  discAt("gauge.screw", G.frameOf([GX - 5, -74, DIAL.z], [-1, 0, 0], Y, Zv), 0, 4, 2.4, { tone: "mid" }, { steps: 12 });
  discAt("gauge.knob", G.frameOf([GX - 5, -74, DIAL.z], [-1, 0, 0], Y, Zv), 4, 7, 4.2, { tone: "mid" }, {});
  post("gauge.cap", GX, -74, 3.2, DIAL.z + 6, DIAL.z + 8, { tone: "mid" }, { steps: 24 });
  // the arm from the clamp to the back of the gauge
  discAt("gauge.arm", frameY([GX, -69, DIAL.z]), 0, DIAL.y0 - -69, 2.2, { tone: "mid", crease: "none" }, {});
}
// gauge body: case and bezel along +y, face toward the operator
const [VX, VY] = k.towardViewer(P);
let GE1 = [1, 0, 0];
if (at([GX + 1, FACE, DIAL.z])[0] < at([GX, FACE, DIAL.z])[0]) GE1 = [-1, 0, 0];
const C0 = [GX, FACE, DIAL.z];
function dialMatrix() {
  const o = [GX, FACE + 0.05, DIAL.z];
  const p0 = at(o);
  const p1 = at(G.add3(o, GE1));
  const p2 = at(G.add3(o, [0, 0, -1]));
  const m = [p1[0] - p0[0], p1[1] - p0[1], p2[0] - p0[0], p2[1] - p0[1], p0[0], p0[1]];
  return `matrix(${m.map(fix).join(" ")})`;
}
const RT = DIAL.r - 2.6;
const dialPt = (mm, r) => { const a = Math.PI / 2 - mm * 2 * Math.PI; return [r * Math.cos(a), -r * Math.sin(a)]; };
function needlePath(mm) {
  const [tx, ty] = dialPt(mm, RT - 0.6);
  const [bx, by] = dialPt(mm, -2.6);
  return "M" + bx.toFixed(2) + " " + by.toFixed(2) + "L" + tx.toFixed(2) + " " + ty.toFixed(2);
}
{
  const ticks = [];
  const majors = [];
  for (let i = 0; i < 50; i++) {
    const major = i % 5 === 0;
    const [ax, ay] = dialPt(i / 50, RT);
    const [bx, by] = dialPt(i / 50, RT - (major ? 2.2 : 1.2));
    (major ? majors : ticks).push(`M${ax.toFixed(2)} ${ay.toFixed(2)}L${bx.toFixed(2)} ${by.toFixed(2)}`);
  }
  const face = [
    `<g transform="${dialMatrix()}">`,
    `<circle class="mp-dial" cx="0" cy="0" r="${DIAL.r - 1.4}"/>`,
    `<circle class="iso-line" data-tone="mid" cx="0" cy="0" r="${RT}" fill="none"/>`,
    `<path class="iso-line" data-tone="lo" d="${ticks.join("")}"/>`,
    `<path class="iso-line" data-tone="hi" d="${majors.join("")}"/>`,
    `<path class="mp-limit" data-limit="" d=""/>`,
    `<text class="mp-unit" x="0" y="-4.2" text-anchor="middle">0,01</text>`,
    `<path class="mp-needle" data-needle="" d="${needlePath(0)}"/>`,
    `<circle class="mp-pivot" cx="0" cy="0" r="1.1"/>`,
    `<circle class="iso-line" data-tone="mid" cx="0" cy="0" r="${DIAL.r - 1.4}" fill="none"/>`,
    `</g>`,
  ].join("");
  const FD = G.frameOf([GX, DIAL.y0, DIAL.z], Y, Zv, X);
  discAt("gauge.case", FD, 0, DIAL.y1 - DIAL.y0 - 1.2, DIAL.r, { tone: "mid" }, {});
  discAt("gauge.bezel", FD, DIAL.y1 - DIAL.y0 - 1.2, DIAL.y1 - DIAL.y0, DIAL.r, { tone: "hi", crease: "lo" }, { extra: face });
  // the crown on top
  post("gauge.stem-top", GX, GY, 1.6, DIAL.z + DIAL.r, DIAL.z + DIAL.r + 4, { tone: "mid", crease: "none" }, { steps: 16 });
  post("gauge.crown", GX, GY, 3, DIAL.z + DIAL.r + 4, DIAL.z + DIAL.r + 7, { tone: "mid" }, { steps: 18, extra: Dt([at([GX, GY, DIAL.z + DIAL.r + 7])], { size: 0.45, tone: "hi" }) });
  // the sleeve and the plunger that rides on the rim
  post("gauge.sleeve", GX, GY, 2.4, SLEEVE.z0, SLEEVE.z1, { tone: "mid" }, { steps: 20 });
  rod("gauge.plunger", frameNZ([GX, GY, SLEEVE.z0]), 0, SLEEVE.z0 - BOX_TOP, 1.1, STROKE, { tone: "hi", crease: "lo" }, { piece: "gauge" });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: STATES });
R.items.sort((a, b) => a.key - b.key);
if (process.env.ORDER) console.log(R.items.map((i, n) => n + " " + i.name).join("\n"));
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups, `<g data-mark=""></g>`];

const LABEL_NL =
  "Een gespoten bak van 200 bij 100 bij 50 millimeter ligt met de open kant boven op een afvoerband. In de bodem zit het aanspuitpunt met vier uitwerppenafdrukken, tegen de wanden ribben en in de hoeken bussen. Op de achterste rail staat een meetklok op een statief; de taster rust op de rand van de bak en meet hoeveel die omhoog komt. Afhankelijk van de instellingen verschijnen fouten op de bak: een short shot laat de hoeken aan het eind van de vloeiweg leeg, braam steekt als een dun vliesje uit langs de deellijn op de rand, inzakplekken zitten als deukjes op de buitenwand tegenover de ribben, en een kromgetrokken bak komt aan de uiteinden los van de band.";
const LABEL_EN =
  "A moulded box of 200 by 100 by 50 millimetres lies open side up on a take-out conveyor. The gate is in the middle of the floor with four ejector-pin marks; ribs stand against the walls and bosses in the corners. A dial gauge on a stand on the far rail rests its plunger on the rim and measures how far the rim rises. Depending on the settings, defects appear on the box: a short shot leaves the corners at the end of the flow path unfilled, flash sticks out as a thin fin along the parting line at the rim, sink marks show as dents on the outer wall opposite the ribs, and a warped box lifts off the belt at its ends.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "gate", at: [BOX_CX, 0, BOX.z0 + BOX.floor] },
  { key: "ejector", at: [BOX_CX - 50, -25, BOX.z0 + BOX.floor] },
  { key: "flowend", at: [BOX.x + 2, BOX.y + 2, BOX_TOP] },
  { key: "rim", at: [BOX_CX - 40, BOX.y + BOX.d, BOX_TOP] },
  { key: "rib", at: [RIBS[1], BOX.y + BOX.wall + 3, BOX.z0 + 30] },
  { key: "boss", at: [BOX.x + 8, BOX.y + 8, BOX.z0 + 30] },
  { key: "wall", at: [BOX_CX + 50, BOX.y + BOX.d, BOX.z0 + 20] },
  { key: "cavity", at: [BOX.x + BOX.w, 0, BOX.z0 + 26] },
  { key: "belt", at: [-128, 30, BELT_TOP] },
  { key: "gauge", at: [GX, FACE, DIAL.z] },
  { key: "plunger", at: [GX, GY, BOX_TOP + 5] },
  { key: "drive", at: [159, 106, 50] },
];

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#2C6774;--anatomy-lit-shade:#205560;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --mp-hair:rgba(240,233,218,.12);--mp-accent:#5C9FAE;--mp-seg:#2A4A4A;--mp-dial:#0A1E23;
  --mp-p-top:#2A4A50;--mp-p-face:#22414A;--mp-p-end:#1A363E;--mp-p-in:#132E35;--mp-p-in2:#102930;--mp-p-floor:#173740;
  --mp-sink:rgba(3,16,15,.55);--mp-flash:rgba(92,159,174,.85);--mp-shadow:rgba(3,16,15,.6);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --mp-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --mp-hair:rgba(11,41,27,.14);--mp-accent:#276F81;--mp-seg:#C2C3B2;--mp-dial:#FBF8F1;
  --mp-p-top:#FDFBF6;--mp-p-face:#F3EEE2;--mp-p-end:#E6DFCD;--mp-p-in:#DDD5C1;--mp-p-in2:#D5CCB6;--mp-p-floor:#E9E2D1;
  --mp-sink:rgba(30,51,40,.32);--mp-flash:rgba(39,111,129,.8);--mp-shadow:rgba(90,107,96,.28);
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--mp-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:1;--lines:3;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--mp-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="2"] .iso-plate{--rows:1;--lines:5}
html[data-level="3"] .iso-plate{--rows:3;--lines:4}
html[data-level="4"] .iso-plate{--rows:2;--lines:5}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--mp-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.mp-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-acc{color:var(--mp-accent);font-weight:600}
.mp-strong{color:var(--anatomy-strong);font-weight:600}
.mp-mute{color:var(--anatomy-muted)}
.mp-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.mp-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.mp-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.mp-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.mp-row{display:flex;gap:4px;height:44px;align-items:center}
.mp-row[hidden]{display:none}
.mp-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--mp-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--mp-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.mp-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.mp-btn:disabled{opacity:.4;cursor:default}
.mp-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--mp-accent);color:var(--mp-accent);font-weight:600}
.mp-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.mp-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.mp-btn b{font-weight:inherit}
.mp-row[data-row="defect"] .mp-btn{font-size:11px}
.mp-group{display:flex;gap:4px;flex:1 1 auto;height:44px;min-width:0}
.mp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mp-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mp-shadow{fill:var(--mp-shadow);stroke:none}
.mp-dial{fill:var(--mp-dial);stroke:none}
.mp-needle{fill:none;stroke:var(--mp-accent);stroke-width:.9px;stroke-linecap:round}
.mp-pivot{fill:var(--anatomy-hi);stroke:none}
.mp-limit{fill:none;stroke:var(--mp-accent);stroke-width:1.4px;opacity:.55}
.mp-unit{font:600 2.6px var(--anatomy-mono);fill:var(--anatomy-muted)}
.bx{stroke:var(--anatomy-hi);stroke-width:.45px;stroke-linejoin:round}
.bx-top{fill:var(--mp-p-top)}.bx-face{fill:var(--mp-p-face)}.bx-end{fill:var(--mp-p-end)}.bx-in{fill:var(--mp-p-in)}.bx-in2{fill:var(--mp-p-in2)}.bx-floor{fill:var(--mp-p-floor)}
.bx-soft{stroke:var(--anatomy-lo);stroke-width:.4px}
.bx-mark{fill:none;stroke:var(--anatomy-lo);stroke-width:.4px}
.bx-sink{fill:var(--mp-sink);stroke:none}
.bx-arrow{fill:var(--anatomy-lo);stroke:none}
.bx-num{font:600 10px var(--anatomy-mono);fill:var(--anatomy-lo)}
.bx-sinkline{fill:none;stroke:var(--mp-accent);stroke-width:.6px}
.bx-flash{fill:var(--mp-flash);stroke:var(--mp-accent);stroke-width:.35px;stroke-linejoin:round}
.bx-front{fill:none;stroke:var(--mp-accent);stroke-width:1.1px;stroke-linejoin:round;stroke-linecap:round}
.mp-mark{fill:none;stroke:var(--mp-accent);stroke-width:1.4px}
.mp-mark-dot{fill:var(--mp-accent);stroke:none}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const AREA = ${AREA}, SETS = ${JSON.stringify(SETS)}, NOMINAL = ${JSON.stringify(NOMINAL)}, PRESETS = ${JSON.stringify(PRESETS)}, LEVELS = ${JSON.stringify(LEVELS)};
const PATH_MAX = ${PATH_MAX}, DOE = ${JSON.stringify(DOE)}, SINK_VISIBLE = ${SINK_VISIBLE}, WARP_LIMIT = ${WARP_LIMIT}, AT_MACHINE = ${AT_MACHINE};
const SHRINK = ${JSON.stringify(SHRINK)}, SENSOR = ${JSON.stringify(SENSOR)};
const BOX = ${JSON.stringify(BOX)}, BOX_CX = ${BOX_CX}, GX = ${GX}, GY = ${GY}, EXAG = ${EXAG}, STROKE = ${STROKE}, RIBS = ${JSON.stringify(RIBS)};
const PARTS = ${JSON.stringify(PARTS)};
const RT = ${RT};
const fillOf = ${fillOf.toString()};
const needOf = ${needOf.toString()};
const hotOf = ${hotOf.toString()};
const flashOf = ${flashOf.toString()};
${sinkOf.toString()}
const warpOf = ${warpOf.toString()};
const mainEffects = ${mainEffects.toString()};
const dialPt = ${dialPt.toString()};
${needlePath.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",", good: "good part", need: "needed", noFlash: "no flash", flashT: "flash", short: "short shot", sink: "sink", warp: "warp", ok: "good", visible: "visible", gauge: "gauge", atMachine: "at the machine", after: "after 24 h", limit: "limit", hot: "runny melt", one: "1 change: wait", ten: "~10 shots", slow: "20–30 min (steel heats slowly)", many: "changes at once: nobody learns the cause", none: "settings as on the setting sheet", tapPart: "tap a part to name it", core: "core hotter by", cool: "cooling", steelOne: "steel 0.5 %:", steelDir: "steel per direction:", part: "part", along: "along the flow", across: "across", runs: "runs", effP: "main effect pressure", effT: "time", inter: "pressure at short/long time", payback: "sensor € 12,000 / € 3,000 a month =", months: "months", bar: "bar", hold: "hold", fill: "fill",
      defects: { good: ["Good part", "all settings inside the window"], short: ["Short shot", "melt too cold: the corners at the end of the flow path stay empty"], flash: ["Flash", "clamp force too low for the cavity pressure: a fin at the parting line"], sink: ["Sink mark", "too little hold pressure: dents opposite the ribs"], warp: ["Warpage", "ejected too warm: it shrinks unevenly and bends"] },
      parts: { gate: ["Gate", "where the plastic enters, in the floor"], ejector: ["Ejector-pin marks", "the pins push the part out"], flowend: ["End of the flow path", "the last spot to fill: short shots start here"], rim: ["Parting line", "where the mould halves meet; flash grows here"], rib: ["Rib", "a stiffening wall; thick, so it shrinks more"], boss: ["Boss", "a thick tube for a screw: sink risk"], wall: ["Outer wall", "sink marks show here, opposite the ribs"], cavity: ["Cavity number and date stamp", "which cavity, and when: ask before changing settings"], belt: ["Take-out conveyor", "carries the parts away from the press"], gauge: ["Dial gauge", "one turn is 1 mm; reads the warp"], plunger: ["Plunger", "rests on the rim, rises as the box warps"], drive: ["Conveyor drive", "geared motor for the belt"] } }
  : { dec: ",", grp: ".", good: "goed product", need: "nodig", noFlash: "geen braam", flashT: "braam", short: "short shot", sink: "inzak", warp: "krom", ok: "goed", visible: "zichtbaar", gauge: "meetklok", atMachine: "bij de machine", after: "na 24 uur", limit: "grens", hot: "dunne smelt", one: "1 wijziging: wacht", ten: "~10 shots", slow: "20–30 min (staal warmt langzaam op)", many: "wijzigingen tegelijk: niemand leert de oorzaak", none: "instellingen volgens instelblad", tapPart: "tik een onderdeel voor de naam", core: "kern warmer met", cool: "koelen", steelOne: "staal 0,5 %:", steelDir: "staal per richting:", part: "product", along: "in vloeirichting", across: "dwars", runs: "runs", effP: "hoofdeffect druk", effT: "tijd", inter: "druk bij korte/lange tijd", payback: "sensor € 12.000 / € 3.000 per maand =", months: "maanden", bar: "bar", hold: "nadruk", fill: "vulling",
      defects: { good: ["Goed product", "alle instellingen binnen het venster"], short: ["Short shot", "smelt te koud: de hoeken aan het eind van de vloeiweg blijven leeg"], flash: ["Braam", "te weinig sluitkracht voor de holtedruk: een vliesje op de deellijn"], sink: ["Inzakplek", "te weinig nadruk: deukjes tegenover de ribben"], warp: ["Kromtrekken", "te warm uitgeworpen: ongelijke krimp, de bak buigt"] },
      parts: { gate: ["Aanspuitpunt", "hier komt de kunststof binnen, in de bodem"], ejector: ["Uitwerppenafdrukken", "de pennen duwen het product eruit"], flowend: ["Eind van de vloeiweg", "vult als laatste: hier begint een short shot"], rim: ["Deellijn", "waar de matrijshelften sluiten; hier groeit braam"], rib: ["Rib", "verstevigingswandje; dik, dus krimpt meer"], boss: ["Bus", "dik buisje voor een schroef: kans op inzak"], wall: ["Buitenwand", "hier zie je inzakplekken, tegenover de ribben"], cavity: ["Holtenummer en datumstempel", "welke holte en wanneer: vraag dat eerst"], belt: ["Afvoerband", "voert de producten weg van de pers"], gauge: ["Meetklok", "één omwenteling is 1 mm; meet de kromming"], plunger: ["Taster", "rust op de rand, komt omhoog als de bak krom trekt"], drive: ["Bandaandrijving", "motor met tandwielkast voor de band"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const grouped = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);

const stage = document.querySelector(".mp-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { box: q("[data-box]"), needle: q("[data-needle]"), limit: q("[data-limit]"), gauge: [...svg.querySelectorAll("[data-gauge]")], mark: q("[data-mark]") };
const lines = [...document.querySelectorAll("[data-readout] .mp-line")];
const announcer = document.querySelector(".mp-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const AZ = axisVector(P, [0, 0, 1]);
const VIEW = towardViewer(P);

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { ...(L0.set || PRESETS[L0.preset]), defect: "good", sel: LVL === 3 ? "dT" : "T", late: true, perDir: false };
const BASE = { ...st };
let changes = [];
function model() {
  const fill = fillOf(st.T);
  const flash = flashOf(st.p, st.T, st.F);
  const sink = sinkOf(st.p, st.th);
  const warp24 = warpOf(st.tc, LVL >= 3 ? st.dT : 0);
  const warp = LVL === 3 && !st.late ? warp24 * AT_MACHINE : warp24;
  return { fill, flash, sink, warp, warp24 };
}
// what is drawn eases toward the model
const shown = { fill: 1, flash: 0, sink: 0, warp: 0 };
function target() { const m = model(); return { fill: m.fill, flash: m.flash, sink: m.sink, warp: m.warp }; }
Object.assign(shown, target());

// ------------------------------------------------ the box, drawn live
const pt = (p) => iso(p, P);
const pathOfPts = (pts) => "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + "Z";
const x0 = BOX.x, x1 = BOX.x + BOX.w, y0 = BOX.y, y1 = BOX.y + BOX.d, z0 = BOX.z0, H = BOX.h, w = BOX.wall;
const lift = (x) => { const u = (x - BOX_CX) / (GX - BOX_CX); return shown.warp * EXAG * u * u; };
// filled height of the wall at (x, y): the flow front, from the gate in the floor centre
function topAt(x, y) {
  const d = Math.hypot(x - BOX_CX, y);
  const reach = shown.fill * PATH_MAX - d;
  return clamp(reach, 6, H);
}
const W = (x, y, z) => pt([x, y, z0 + z + lift(x)]);
const N = 24;
// a wall seen from one side: bottom edge at zb, top following the flow front
function wallFace(ax, ay, bx, by, zb, inset) {
  const top = [], bot = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
    top.push(W(x, y, topAt(x, y)));
    bot.push(W(x, y, zb));
  }
  return pathOfPts([...bot, ...top.reverse()]);
}
function rimBand(xa, ya, xb, yb, nx, ny) {
  // the rim strip of one wall, between its outer and inner top edges
  const outer = [], inner = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, x = xa + (xb - xa) * t, y = ya + (yb - ya) * t;
    const h = topAt(x, y);
    outer.push(W(x, y, h));
    inner.push(W(x - nx * w, y - ny * w, h));
  }
  return pathOfPts([...outer, ...inner.reverse()]);
}
const faces = (n) => n[0] * VIEW[0] + n[1] * VIEW[1] > 0;
function drawBox() {
  const out = [];
  const zf = BOX.floor;
  // the inside floor
  const fl = [];
  for (let i = 0; i <= N; i++) fl.push(W(x0 + w + ((x1 - x0 - 2 * w) * i) / N, y0 + w, zf));
  for (let i = N; i >= 0; i--) fl.push(W(x0 + w + ((x1 - x0 - 2 * w) * i) / N, y1 - w, zf));
  out.push('<path class="bx bx-floor bx-soft" d="' + pathOfPts(fl) + '"/>');
  // gate and ejector-pin marks on the floor
  const ring = (cx, cy, r) => { const ps = []; for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; ps.push(W(cx + r * Math.cos(a), cy + r * Math.sin(a), zf)); } return pathOfPts(ps); };
  out.push('<path class="bx-mark" d="' + ring(BOX_CX, 0, 4) + ring(BOX_CX, 0, 1.6) + '"/>');
  for (const [dx, dy] of [[-50, -25], [50, -25], [-50, 25], [50, 25]]) out.push('<path class="bx-mark" d="' + ring(BOX_CX + dx, dy, 2.6) + '"/>');
  // inner faces that face the viewer: far long wall (normal +y) and one end wall
  const inner = [];
  inner.push({ n: [0, 1], d: wallFace(x0 + w, y0 + w, x1 - w, y0 + w, zf, 0), c: "bx-in" });
  if (faces([1, 0])) inner.push({ n: [1, 0], d: wallFace(x0 + w, y0 + w, x0 + w, y1 - w, zf, 0), c: "bx-in2" });
  else inner.push({ n: [-1, 0], d: wallFace(x1 - w, y0 + w, x1 - w, y1 - w, zf, 0), c: "bx-in2" });
  for (const f of inner) out.push('<path class="bx ' + f.c + ' bx-soft" d="' + f.d + '"/>');
  // ribs on the far wall and bosses in the far corners
  for (const rx of RIBS) {
    const yA = y0 + w, yB = y0 + w + 5, h = Math.min(topAt(rx, y0) - 3, H - 3);
    if (h <= zf + 1) continue;
    const fr = [W(rx - 1.4, yB, zf), W(rx + 1.4, yB, zf), W(rx + 1.4, yB, h), W(rx - 1.4, yB, h)];
    const tp = [W(rx - 1.4, yA, h), W(rx + 1.4, yA, h), W(rx + 1.4, yB, h), W(rx - 1.4, yB, h)];
    const sx = faces([1, 0]) ? rx + 1.4 : rx - 1.4;
    const sd = [W(sx, yA, zf), W(sx, yB, zf), W(sx, yB, h), W(sx, yA, h)];
    out.push('<path class="bx bx-end" d="' + pathOfPts(sd) + '"/><path class="bx bx-face" d="' + pathOfPts(fr) + '"/><path class="bx bx-top" d="' + pathOfPts(tp) + '"/>');
  }
  for (const bx of [x0 + w + 6, x1 - w - 6]) {
    const by = y0 + w + 6, r = 4.2, h = Math.min(topAt(bx, by) - 4, H - 4);
    if (h <= zf + 1) continue;
    const side = [], topR = [];
    for (let i = 0; i <= 16; i++) {
      const a = Math.atan2(VIEW[1], VIEW[0]) - Math.PI / 2 + (Math.PI * i) / 16;
      side.push(W(bx + r * Math.cos(a), by + r * Math.sin(a), zf));
    }
    for (let i = 16; i >= 0; i--) {
      const a = Math.atan2(VIEW[1], VIEW[0]) - Math.PI / 2 + (Math.PI * i) / 16;
      side.push(W(bx + r * Math.cos(a), by + r * Math.sin(a), h));
    }
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; topR.push(W(bx + r * Math.cos(a), by + r * Math.sin(a), h)); }
    const hole = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; hole.push(W(bx + 1.6 * Math.cos(a), by + 1.6 * Math.sin(a), h)); }
    out.push('<path class="bx bx-face" d="' + pathOfPts(side) + '"/><path class="bx bx-top" d="' + pathOfPts(topR) + '"/><path class="bx-mark" d="' + pathOfPts(hole) + '"/>');
  }
  // the rim: four strips
  out.push('<path class="bx bx-top" d="' + rimBand(x0, y0, x1, y0, 0, -1) + rimBand(x0, y1, x1, y1, 0, 1) + rimBand(x0, y0, x0, y1, -1, 0) + rimBand(x1, y0, x1, y1, 1, 0) + '"/>');
  // the outer faces toward the viewer
  out.push('<path class="bx bx-face" d="' + wallFace(x0, y1, x1, y1, 0, 0) + '"/>');
  if (faces([1, 0])) out.push('<path class="bx bx-end" d="' + wallFace(x1, y0, x1, y1, 0, 0) + '"/>');
  else out.push('<path class="bx bx-end" d="' + wallFace(x0, y0, x0, y1, 0, 0) + '"/>');
  // on the visible end face: the cavity number and the date stamp, moulded in
  {
    const xe = faces([1, 0]) ? x1 : x0, sgn = faces([1, 0]) ? 1 : -1;
    const yc = sgn * 12, zc = 26;
    const p0 = W(xe, yc, zc), pu = W(xe, yc - sgn, zc), pv = W(xe, yc, zc - 1);
    const m = [pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]].map((v) => v.toFixed(3)).join(" ");
    const circ = (r) => { const ps = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; ps.push([r * Math.cos(a), r * Math.sin(a)]); } return pathOfPts(ps); };
    out.push('<g transform="matrix(' + m + ')"><path class="bx-mark" d="' + circ(6.5) + circ(5.2) + '"/><path class="bx-arrow" d="M0 -4.2L1.3 -1.6L0.45 -1.6L0.45 3.6L-0.45 3.6L-0.45 -1.6L-1.3 -1.6Z"/>' +
      '<path class="bx-mark" d="M14 -6.5L26 -6.5Q27.5 -6.5 27.5 -5L27.5 5Q27.5 6.5 26 6.5L14 6.5Q12.5 6.5 12.5 5L12.5 -5Q12.5 -6.5 14 -6.5Z"/><text class="bx-num" x="20" y="3.6" text-anchor="middle">2</text></g>');
  }
  // sink marks on the near outer wall, opposite the ribs
  const sk = shown.sink;
  if (sk > 0.5) {
    const a = clamp(sk / 40, 0, 1);
    for (const rx of RIBS) {
      const rw = 3 + 4 * a, rh = 6 + 12 * a, zc = Math.min(28, topAt(rx, y1) - rh - 2);
      if (zc - rh < 2) continue;
      const ps = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; ps.push(W(rx + rw * Math.cos(t), y1 + 0.01, zc + rh * Math.sin(t))); }
      out.push('<path class="bx-sink" style="opacity:' + clamp((sk - 16) / 20, 0, 1).toFixed(2) + '" d="' + pathOfPts(ps) + '"/>');
      if (sk > SINK_VISIBLE) out.push('<path class="bx-sinkline" d="' + pathOfPts(ps) + '"/>');
    }
  }
  // the flow front where the box is not full
  if (shown.fill < 0.999) {
    const segs = [];
    const edge = (xa, ya, xb, yb) => { let cur = []; for (let i = 0; i <= 48; i++) { const t = i / 48, x = xa + (xb - xa) * t, y = ya + (yb - ya) * t; if (topAt(x, y) < H - 0.05) cur.push(W(x, y, topAt(x, y))); else if (cur.length) { segs.push(cur); cur = []; } } if (cur.length) segs.push(cur); };
    edge(x0, y1, x1, y1); edge(x1, y1, x1, y0); edge(x0, y0, x0, y1);
    const d = segs.filter((s) => s.length > 1).map((s) => "M" + s.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L")).join("");
    out.push('<path class="bx-front" d="' + d + '"/>');
  }
  // flash: a thin fin outward from the rim, along the parting line
  const fw = clamp(shown.flash / 8, 0, 5);
  if (fw > 0.05) {
    const o = [], i2 = [];
    const ring2 = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    for (let s = 0; s < 4; s++) {
      const [ax, ay] = ring2[s], [bx, by] = ring2[(s + 1) % 4];
      for (let i = 0; i < N; i++) {
        const t = i / N, x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
        const dx = Math.sign(x - BOX_CX) * (Math.abs(x - BOX_CX) > BOX.w / 2 - 0.1 ? 1 : 0), dy = Math.sign(y) * (Math.abs(y) > BOX.d / 2 - 0.1 ? 1 : 0);
        const h = topAt(x, y);
        // the fin is wider toward the corners, ragged in steps
        const c = 0.55 + 0.45 * Math.max(Math.abs(x - BOX_CX) / (BOX.w / 2), Math.abs(y) / (BOX.d / 2)) ** 3;
        const f = fw * c * (0.8 + 0.2 * Math.sin(i * 1.7 + s));
        i2.push(W(x, y, h));
        o.push(W(x + dx * f, y + dy * f, h));
      }
    }
    out.push('<path class="bx-flash" fill-rule="evenodd" d="' + pathOfPts(o) + pathOfPts(i2) + '"/>');
  }
  el.box.innerHTML = out.join("");
}

// ------------------------------------------------ gauge
function drawGauge() {
  const r = shown.warp; // mm at the gauge
  el.needle.setAttribute("d", needlePath(r));
  const dz = Math.min(STROKE, r * EXAG);
  const v = [AZ[0] * dz, AZ[1] * dz];
  el.gauge.forEach((n) => { n.setAttribute("transform", dz ? "translate(" + v[0].toFixed(2) + " " + v[1].toFixed(2) + ")" : ""); holdStill(n, v); });
  // the limit mark on the dial
  const [a0, b0] = dialPt(WARP_LIMIT, RT + 0.2), [a1, b1] = dialPt(WARP_LIMIT, RT - 2.6);
  el.limit.setAttribute("d", LVL >= 2 ? "M" + a0.toFixed(2) + " " + b0.toFixed(2) + "L" + a1.toFixed(2) + " " + b1.toFixed(2) : "");
}

// ------------------------------------------------ readout
let marked = -1;
const acc = (s) => '<span class="mp-acc">' + s + "</span>";
const strong = (s) => '<span class="mp-strong">' + s + "</span>";
function defectsLine(m) {
  const out = [];
  if (m.fill < 1) out.push(acc(T.short + " " + T.fill + " " + Math.round(100 * m.fill) + " %"));
  if (m.flash > 0) out.push(acc(T.flashT));
  out.push((m.sink > SINK_VISIBLE ? acc : (s) => s)(T.sink + " " + Math.round(m.sink) + " µm"));
  out.push((m.warp > WARP_LIMIT ? acc : (s) => s)(T.warp + " " + fmt(m.warp, 2) + " mm"));
  return out.join(" · ");
}
function readout() {
  const m = model();
  const out = [];
  if (LVL === 1) {
    const d = T.defects[st.defect];
    out.push(strong(d[0]) + " · " + d[1]);
    out.push(defectsLine(m));
  } else if (LVL === 2) {
    out.push("T " + st.T + " °C · p " + st.p + " " + T.bar + " · F " + st.F + " t · t " + st.tc + " s");
    const need = needOf(st.p) * (1 + hotOf(st.T));
    out.push(T.need + " " + AREA + " cm² × 0" + T.dec + String(st.p / 1000).slice(2).padEnd(2, "0") + " t/cm²" + (hotOf(st.T) ? " × 1" + T.dec + String(Math.round(10 * hotOf(st.T))) : "") + " = " + strong(grouped(need) + " t") + " / " + st.F + " t · " + (m.flash > 0 ? acc(T.flashT + " +" + grouped(m.flash) + " t") : T.noFlash));
    out.push(m.fill === 1 && m.flash === 0 && m.sink <= SINK_VISIBLE && m.warp <= WARP_LIMIT ? strong(T.good) + " · " + defectsLine(m) : defectsLine(m));
    const n = changes.length;
    out.push(n === 0 ? '<span class="mp-mute">' + T.none + "</span>" : n === 1 ? T.one + " " + (changes[0] === "T" ? T.slow : T.ten) : acc(n + " " + T.many));
  } else if (LVL === 3) {
    out.push("ΔT " + st.dT + " °C · " + T.cool + " " + st.tc + " s → " + T.gauge + " " + strong(fmt(m.warp, 2) + " mm"));
    out.push((st.late ? T.after : T.atMachine) + " · " + T.limit + " " + fmt(WARP_LIMIT, 1) + " mm · " + (m.warp > WARP_LIMIT ? acc(T.warp) : T.ok) + (st.late ? "" : " · " + T.after + " " + fmt(m.warp24, 2)));
    const s = SHRINK;
    const steelL = st.perDir ? s.L * (1 + s.along) : s.L * (1 + s.one), steelW = st.perDir ? s.W * (1 + s.across) : s.W * (1 + s.one);
    const partL = steelL * (1 - s.along), partW = steelW * (1 - s.across);
    out.push("PA6 GF30 · " + fmt(100 * s.along, 1) + " % " + T.along + ", " + fmt(100 * s.across, 1) + " % " + T.across);
    out.push((st.perDir ? T.steelDir : T.steelOne) + " " + fmt(steelL, 1) + " × " + fmt(steelW, 1) + " → " + strong(fmt(partL, 1) + " × " + fmt(partW, 1) + " mm"));
  } else {
    const r = DOE.runs, e = mainEffects();
    out.push(T.hold + " " + st.p + " " + T.bar + " · " + st.th + " s → " + T.sink + " " + strong(Math.round(m.sink) + " µm") + " · " + (m.sink > SINK_VISIBLE ? acc(T.visible) : T.ok));
    out.push("2 × 2 = 4 " + T.runs + ": " + r[0][0] + " · " + r[0][1] + " · " + r[1][0] + " · " + r[1][1] + " µm (3 → 8, 4 → 16)");
    const mn = (v) => String(v).replace("-", "−");
    out.push(T.effP + " " + mn(e.p) + " µm · " + T.effT + " " + strong(mn(e.t) + " µm"));
    out.push(T.inter + " " + mn(e.pShort) + " / " + mn(e.pLong) + " µm");
    out.push(T.payback + " " + SENSOR.cost / SENSOR.perMonth + " " + T.months);
  }
  if (LVL <= 2) out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : '<span class="mp-mute">' + T.tapPart + "</span>");
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

function anchorOf(p) {
  const [x, y, z] = p.at;
  if (p.key === "plunger") return [x, y, z + Math.min(STROKE, shown.warp * EXAG)];
  if (["belt", "gauge", "drive"].includes(p.key)) return p.at;
  return [x, y, z + lift(x)];
}
function draw() {
  drawBox();
  drawGauge();
  if (marked >= 0) {
    const [x, y] = iso(anchorOf(PARTS[marked]), P);
    el.mark.innerHTML = '<circle class="mp-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="mp-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
  readout();
}

// ------------------------------------------------ loop: ease the drawing toward the model
let frame = 0, lastT = 0, visible = false;
let tour = LVL === 1 && !still.matches, tourT = 0;
const TOUR = ["good", "short", "flash", "sink", "warp"];
function settled() { const t = target(); return Object.keys(t).every((k) => Math.abs(t[k] - shown[k]) < 1e-3); }
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  const t = target();
  if (still.matches) Object.assign(shown, t);
  else { const a = 1 - Math.exp(-dt / 0.28); for (const key of Object.keys(t)) shown[key] += (t[key] - shown[key]) * a; }
  if (tour && visible) {
    tourT += dt;
    if (tourT > 3.6) { tourT = 0; const i = (TOUR.indexOf(st.defect) + 1) % TOUR.length; pickDefect(TOUR[i], false); }
  }
  draw();
  frame = visible && !still.matches && (tour || !settled()) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { lastT = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) { Object.assign(shown, target()); draw(); } else run(); };

// ------------------------------------------------ controls
const $ = (sel) => document.querySelector(sel);
const rows = [...document.querySelectorAll(".mp-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const pickBtns = [...document.querySelectorAll("[data-pick]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const UNITS = { T: "°", p: "", F: "t", tc: "s", dT: "°" };
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  pickBtns.forEach((b) => { const on = b.dataset.pick === st.sel; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; b.querySelector("b").textContent = st[b.dataset.pick] + UNITS[b.dataset.pick]; });
  stepBtns.forEach((b) => {
    const row = b.closest(".mp-row");
    if (row.hidden) return;
    const list = SETS[st.sel], i = list.indexOf(st[st.sel]);
    b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1;
  });
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }
function changed() { sync(); readout(); announce(); kick(); }
function pickDefect(name, user = true) {
  if (user) tour = false;
  Object.assign(st, PRESETS[name]);
  st.defect = name;
  changed();
}
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  if (key === "defect") { pickDefect(val); return; }
  if (key === "late" || key === "perDir") st[key] = val === "true";
  else st[key] = Number(val);
  changed();
}));
document.querySelectorAll("[role='radiogroup']").forEach((group) => {
  group.addEventListener("keydown", (event) => {
    const items = [...group.querySelectorAll('[role="radio"]')];
    const i = items.findIndex((b) => b.getAttribute("aria-checked") === "true");
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % items.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + items.length - 1) % items.length;
    if (next < 0) return;
    event.preventDefault();
    event.stopPropagation();
    items[next].click();
    items[next].focus();
  });
});
pickBtns.forEach((b) => b.addEventListener("click", () => { st.sel = b.dataset.pick; changed(); }));
function stepValue(dir) {
  const list = SETS[st.sel];
  const i = list.indexOf(st[st.sel]);
  st[st.sel] = list[clamp(i + dir, 0, list.length - 1)];
  changes = Object.keys(SETS).filter((key) => key !== "dT" && st[key] !== BASE[key]);
  if (LVL === 2 && changes.length === 1) changes = [changes[0]];
  changed();
}
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));

// tap the drawing: at levels 1 and 2 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => { const [px, py] = iso(anchorOf(p), P); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) return;
  tour = false;
  marked = nearestPart(toView(event));
  draw(); announce(); kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL <= 2 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { tour = false; marked = (marked + 1) % PARTS.length; draw(); announce(); }
  else if (LVL <= 2 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { tour = false; marked = (marked + PARTS.length - 1) % PARTS.length; draw(); announce(); }
  else if (LVL >= 2 && event.key === "+") stepValue(1);
  else if (LVL >= 2 && event.key === "-") stepValue(-1);
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) tick(performance.now()); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { cancelAnimationFrame(frame); frame = 0; tour = false; tick(performance.now()); } else run(); });
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Fouten op het product",
    hint1: "Tik een onderdeel · kies een fout",
    hint2: "Tik een onderdeel · kies T, p, F of t, dan − of +",
    hint3: "Kies ΔT of koeltijd, dan − of +",
    hint4: "Kies nadruk en nadruktijd: een 2 × 2-DOE",
    defects: "Fout",
    good: "Goed",
    short: "Short shot",
    flash: "Braam",
    sink: "Inzak",
    warp: "Krom",
    vals: "Instelling",
    whens: "Moment van meten",
    atMachine: "Bij de machine",
    after: "Na 24 uur",
    steels: "Staalmaat",
    one: "Eén factor 0,5 %",
    dir: "Per richting",
    holdP: "Nadruk",
    holdT: "Nadruktijd",
    minus: "Lager",
    plus: "Hoger",
    label: LABEL_NL,
    aria: "Gespoten bak op een afvoerband met een meetklok. Niveau 1 en 2: pijltjes kiezen een onderdeel. Plus en min veranderen de gekozen instelling.",
  },
  en: {
    title: "Defects on the part",
    hint1: "Tap a part · pick a defect",
    hint2: "Tap a part · pick T, p, F or t, then − or +",
    hint3: "Pick ΔT or cooling time, then − or +",
    hint4: "Pick hold pressure and hold time: a 2 × 2 DOE",
    defects: "Defect",
    good: "Good",
    short: "Short shot",
    flash: "Flash",
    sink: "Sink",
    warp: "Warp",
    vals: "Setting",
    whens: "When measured",
    atMachine: "At the machine",
    after: "After 24 h",
    steels: "Steel size",
    one: "One factor 0.5 %",
    dir: "Per direction",
    holdP: "Hold pressure",
    holdT: "Hold time",
    minus: "Lower",
    plus: "Higher",
    label: LABEL_EN,
    aria: "Moulded box on a take-out conveyor with a dial gauge. Levels 1 and 2: arrows pick a part. Plus and minus change the chosen setting.",
  },
};

const sN = STRINGS.nl;
const radio = (set, text, attr) => `<button type="button" class="mp-btn" role="radio" data-set="${set}"${attr ? ` data-t="${attr}"` : ""} aria-checked="false" tabindex="-1">${text}</button>`;
const valBtn = (key, labelHtml) => `<button type="button" class="mp-btn" role="radio" data-pick="${key}" aria-checked="false" tabindex="-1">${labelHtml}&nbsp;<b></b></button>`;
const steppers = `<button type="button" class="mp-btn" data-step="-" aria-label="${sN.minus}" data-t-label="minus">−</button><button type="button" class="mp-btn" data-step="+" aria-label="${sN.plus}" data-t-label="plus">+</button>`;
const controls = [
  `<div class="mp-controls">`,
  `<div class="mp-row" data-row="defect" data-levels="1" role="radiogroup" aria-label="${sN.defects}" data-t-label="defects">${["good", "short", "flash", "sink", "warp"].map((d) => radio(`defect:${d}`, sN[d], d)).join("")}</div>`,
  `<div class="mp-row" data-row="vals" data-levels="2"><div class="mp-group" role="radiogroup" aria-label="${sN.vals}" data-t-label="vals">${valBtn("T", "<i>T</i>")}${valBtn("p", "<i>p</i>")}${valBtn("F", "<i>F</i>")}${valBtn("tc", "<i>t</i>")}</div>${steppers}</div>`,
  `<div class="mp-row" data-row="warp" data-levels="3"><div class="mp-group" role="radiogroup" aria-label="${sN.vals}" data-t-label="vals">${valBtn("dT", "Δ<i>T</i>")}${valBtn("tc", "<i>t</i>")}</div>${steppers}</div>`,
  `<div class="mp-row" data-row="when" data-levels="3" role="radiogroup" aria-label="${sN.whens}" data-t-label="whens">${radio("late:false", sN.atMachine, "atMachine")}${radio("late:true", sN.after, "after")}</div>`,
  `<div class="mp-row" data-row="steel" data-levels="3" role="radiogroup" aria-label="${sN.steels}" data-t-label="steels">${radio("perDir:false", sN.one, "one")}${radio("perDir:true", sN.dir, "dir")}</div>`,
  `<div class="mp-row" data-row="doep" data-levels="4" role="radiogroup" aria-label="${sN.holdP}" data-t-label="holdP">${radio("p:300", "<i>p</i>&nbsp;300 bar", "")}${radio("p:600", "<i>p</i>&nbsp;600 bar", "")}</div>`,
  `<div class="mp-row" data-row="doet" data-levels="4" role="radiogroup" aria-label="${sN.holdT}" data-t-label="holdT">${radio("th:3", "<i>t</i>&nbsp;3 s", "")}${radio("th:6", "<i>t</i>&nbsp;6 s", "")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="mp-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="mp-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="mp-line"></span>'.repeat(5)}</span>`)
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
document.querySelectorAll("[data-t]").forEach(function(n){n.textContent=s[n.getAttribute("data-t")];});
document.querySelectorAll("[data-t-label]").forEach(function(n){n.setAttribute("aria-label",s[n.getAttribute("data-t-label")]);});
var st=document.querySelector(".mp-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
const me = mainEffects();
console.log(`model: need 500 bar ${needOf(500)} t · flash at 160 t +${flashOf(500, 230, 160)} t · fill 200 °C ${fillOf(200).toFixed(2)} · sink 500 bar/6 s ${sinkOf(500, 6).toFixed(1)} µm, 200 bar ${sinkOf(200, 6).toFixed(1)} µm · warp 6 s ${warpOf(6, 0).toFixed(2)} mm, ΔT 10 ${warpOf(14, 10).toFixed(2)} mm · effects p ${me.p} t ${me.t}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { frames: STATES, apart: true });
