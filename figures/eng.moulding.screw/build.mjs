// Dev tool, not shipped. Builds the standalone figure for the topic "De machine"
// (module Spuitgieten): the lessons eng.moulding.machine (level 1), screw
// (level 2), clamp (level 3) and electric (level 4).
//
//   node figures/eng.moulding.screw/build.mjs            build the page
//   node figures/eng.moulding.screw/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.moulding.screw.html: one offline page
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
const OUT = join(ROOT, "src/content/courses/figures/eng.moulding.screw.html");

// ---------------------------------------------------------------- the model
// Straight from the four lessons of the topic "De machine".
//   Clamp force needed  F = A · p          A projected area (cm²), p average
//                                          cavity pressure in t/cm² (1 bar ≈ 1 kg/cm²,
//                                          so 450 bar ≈ 0.45 t/cm²)
//   with a margin       F · (1 + 15 %)     (lesson clamp: 10 to 20 %, worked with 15 %)
//   Barrel utilisation  U = V / Vmax       aim 20 to 80 %, ideally 40 to 60 %
//   Dosing stroke       s = V / (π/4 · D²) D the screw diameter
//   Residence time      ≈ Vmax / V shots × cycle time (lesson screw: shots that fit
//                                          in the barrel × cycle time)
//   Energy (level 4)    kWh/kg × kg/year × €/kWh; payback = extra price / saving
// Presses: A 200 t with a Ø40 screw and Vmax 120 cm³, B 250 t with a Ø50 screw
// and Vmax 250 cm³ (the clamp lesson's two presses). Level 1 keeps the machine
// lesson's example: 300 cm² per cavity at 0.4 t/cm² on a 200-tonner.
const PRESSES = {
  A: { t: 200, vmax: 120, d: 40 },
  B: { t: 250, vmax: 250, d: 50 },
};
const MARGIN = 0.15;
const CYCLE = 30; // s, the screw lesson's cycle
const ENERGY = { kgh: 30, hours: 6000, hyd: 0.6, ele: 0.3, price: 0.2, extra: 40000 };
const forceOf = (area, p) => area * p;
const utilOf = (v, vmax) => v / vmax;
const strokeOf = (v, d) => (v / ((Math.PI / 4) * (d / 10) ** 2)) * 10; // mm
const residenceOf = (v, vmax, cycle) => (vmax / v) * cycle;
const costOf = (kwhPerKg) => kwhPerKg * ENERGY.kgh * ENERGY.hours * ENERGY.price;
const paybackOf = () => ENERGY.extra / (costOf(ENERGY.hyd) - costOf(ENERGY.ele));
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(forceOf(300, 0.4), 120, 1e-9, "machine example 1 cavity");
  near(forceOf(600, 0.4), 240, 1e-9, "machine example 2 cavities");
  near(forceOf(250, 0.4), 100, 1e-9, "machine recall");
  near(forceOf(380, 0.45), 171, 1e-9, "clamp example");
  near(Math.round(forceOf(380, 0.45) * (1 + MARGIN)), 197, 0, "clamp example with 15 %");
  near(Math.round(100 * utilOf(100, 120)), 83, 0, "press A utilisation");
  near(Math.round(100 * utilOf(100, 250)), 40, 0, "press B utilisation");
  near(forceOf(600, 0.35), 210, 1e-9, "clamp recall force");
  near(100 * utilOf(90, 300), 30, 1e-9, "clamp recall utilisation");
  near(residenceOf(150, 600, 30), 120, 1e-9, "screw example residence");
  near(residenceOf(60, 600, 30), 300, 1e-9, "screw example small part");
  near(residenceOf(90, 450, 24), 120, 1e-9, "screw recall residence");
  near(costOf(ENERGY.hyd) - costOf(ENERGY.ele), 10800, 1e-6, "electric saving");
  near(Math.round(paybackOf() * 10) / 10, 3.7, 0, "electric payback");
  near(0.25 * 100000, 25000, 0, "electric recall");
}
const V_LIST = Array.from({ length: 24 }, (_, i) => 10 * (i + 1)); // 10..240 cm³
const A_LIST = Array.from({ length: 26 }, (_, i) => 100 + 20 * i); // 100..600 cm²
const P_LIST = [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65]; // t/cm²
const LEVELS = {
  1: { press: "A", v: 100, area: 300, p: 0.4, cav: 1 },
  2: { press: "B", v: 100, area: 380, p: 0.45, cav: 2 },
  3: { press: "A", v: 100, area: 380, p: 0.45, cav: 2 },
  4: { press: "B", v: 100, area: 380, p: 0.45, cav: 2 },
};

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x along the machine (clamp at −x,
// injection unit at +x), +y toward the operator. The machine axis is z = 57.
// The barrel is drawn cut open along its axis plane from the barrel head to the
// feed throat; the screw inside is drawn whole. Drawn screw Ø11 stands for the
// press's real screw, so one drawn unit is D/11 mm along the stroke.
const WIDTH = 600;
const FLOOR = -5;
const BED = { x: -128, y: -28, w: 276, d: 56, r: 1.4 };
const BED_TOP = 34;
const ZC = 57;
const RAIL_TOP = 35.6;
const PL_Y = 26;
const PL_TOP = 84;
const BAR_R = 2.8;
const BARS = [[-21, 38], [21, 38], [-21, 76], [21, 76]];
const REAR = [-110, -98];
const MOVING = [-60, -48];
const MOULD_M = [-48, -36];
const MOULD_F = [-36, -24];
const FIXED_PL = [-24, -12];
const MOULD = { y: 17, z0: 43, z1: 71 };
const OPEN = 22;
const S0 = 8; // barrel head face, start of the cut
const S1 = 96; // feed throat, end of the cut
const RO = 8.5;
const RI = 5.8;
const RB = 9.6;
const BANDS = [[14, 24], [36, 46], [58, 68], [80, 90]];
const SCREW = { rc: 5.5, pitch: 11, land: 1.1, f0: 9.4, f1: 120, front: 4.4 };
const STROKE_W = 28; // drawn stroke at Vmax (both presses: 26–28)
const CUSHION_MM = 5;
const UNIT = (press) => PRESSES[press].d / 11; // mm per drawn unit along the screw
const INJ_BASE = { x: -2, y: -14, w: 150, d: 28, r: 0.8 };
const BASE_TOP = 42;
const THROAT = { x: 96, y: -11, w: 10, d: 22, r: 0.6 };
const HOUSING = { x: 106, y: -13, w: 36, d: 26, r: 0.8 };
const HOUSING_TOP = 72;
const RULER = { x: 110, y: 13, w: 30, d: 0.6, r: 0.1 };
const RULER_Z = [52, 56];
const POINTER_X = 112;

const FIT = [
  ...k.boxCorners(BED, FLOOR, BED_TOP),
  ...k.boxCorners({ x: REAR[0] - 24, y: -PL_Y, w: 160, d: 2 * PL_Y }, BED_TOP, PL_TOP),
  ...k.boxCorners({ x: 90, y: -12, w: 50, d: 24 }, BED_TOP, 98),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 56);
const ELEVATION = Number(process.env.EL ?? 27);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const NX = [-1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameNX = (o) => G.frameOf(o, NX, Y, Zv);
const frameZ = (o) => G.frameOf(o, Zv, X, Y);
const poly = (points) => k.pathOf(points.map(at), true);
const hull = (points) => {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
  const upper = [];
  for (const q of p.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};

// ---------------------------------------------------------------- recorder
// Two things move: the moving platen with its mould half ("platen", opening
// along −x) and the screw's position pointer ("screw", dosing back along +x).
const MOVES = { platen: [-OPEN, 0, 0], screw: [STROKE_W, 0, 0] };
const R = A.recorder(P, { order: ["platen", "screw"], spring: {} });
const STATES = [];
for (const a of [0, 0.25, 0.5, 0.75, 1]) for (const b of [0, 0.5, 1]) STATES.push({ label: `platen ${a} screw ${b}`, shares: [a, b] });
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
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
let clips = 0;
function rod(name, F, from, to, r, stroke, style = {}, opts = {}) {
  const id = `sw-clip-${clips++}`;
  const R0 = G.rodOut(F, from, to, r, P, { stroke });
  const svg = `<clipPath id="${id}"><path data-hold="" d="${R0.clip}"/></clipPath><g clip-path="url(#${id})">${S(R0.paths, { tone: "mid", ...style })}</g>`;
  const shape = R.solid(A.slide(F, from, to, r, { name }));
  return put(name, G.add3(F.o, G.mul3(F.a, (from + to) / 2)), svg, [shape], opts);
}

// ---------------------------------------------------------------- floor and bed
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BED, -2), FLOOR, 2, P)}"/>`];
for (const x of [-124, -50, 30, 144]) for (const y of [-22, 22]) {
  post("stand.foot", x, y, 3.2, FLOOR, FLOOR + 1.2, { tone: "lo" }, { steps: 6 });
  post("stand.jack", x, y, 1.4, FLOOR + 1.2, 0, { tone: "mid", crease: "none" }, { steps: 16 });
}
{
  const fy = BED.y + BED.d;
  const seams = [-56, 26].map((x) => k.segment([x, fy, 0], [x, fy, BED_TOP], P)).join("");
  const slots = [];
  for (const [x0, x1] of [[-118, -66], [-44, 14], [36, 140]]) for (const z of [8, 11, 14]) slots.push(k.pathOf(k.roundedPlan({ x: x0, y: z, w: x1 - x0 - 30, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u + 15, fy, w])), true));
  const screws = [-126, -62, -50, 20, 32, 146].flatMap((x) => [[x, fy, 3], [x, fy, BED_TOP - 3]]);
  const label = [[-30, fy, 27], [-8, fy, 27], [-8, fy, 20], [-30, fy, 20]];
  const extra =
    `<path class="sw-card" d="${k.pathOf(label.map(at), true)}"/>` +
    L([25.4, 23.6, 21.8].map((z, i) => k.segment([-28.4, fy, z], [-28.4 + [17, 11, 14][i], fy, z], P)).join(""), { tone: "lo", free: true }) +
    Dt(screws.map(at), { size: 0.42 });
  box("bed.frame", BED, 0, BED_TOP, { tone: "mid" }, {
    steps: 3,
    bevel: 0.7,
    inner: L(seams + slots.join("") + k.sideSeam(BED, 4.5, P, 3), { tone: "lo" }),
    extra,
  });
}

// ---------------------------------------------------------------- clamp unit
for (const y0 of [-15.5, 12.5]) box("clamp.rail", { x: REAR[1], y: y0, w: FIXED_PL[0] - REAR[1], d: 3, r: 0.3 }, BED_TOP, RAIL_TOP, { tone: "mid", crease: "lo" }, { steps: 2 });
{
  const plan = { x: REAR[0], y: -PL_Y, w: REAR[1] - REAR[0], d: 2 * PL_Y, r: 0.8 };
  box("clamp.rear", plan, BED_TOP, PL_TOP, { tone: "mid" }, { steps: 2, bevel: 0.6, extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }) });
  const FCyl = frameNX([REAR[0], 0, ZC]);
  turned("clamp.cylinder", FCyl, [[0, 14], [9, 14], [9, 14.6], [11, 14.6], [11, 14], [18, 14], [18, 15], [22, 15], [23, 13.4]], { tone: "mid" }, { attrs: ' data-hyd=""' });
}
{
  const plan = { x: FIXED_PL[0], y: -PL_Y, w: FIXED_PL[1] - FIXED_PL[0], d: 2 * PL_Y, r: 0.8 };
  box("clamp.fixed", plan, BED_TOP, PL_TOP, { tone: "mid" }, { steps: 2, bevel: 0.6, extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }) });
  for (const [y, z] of BARS) discAt("clamp.nut", frameX([FIXED_PL[1], y, z]), 0, 3, 4.4, { tone: "mid" }, { steps: 6, extra: Dt([at([FIXED_PL[1] + 3, y, z])], { size: 0.45, tone: "hi" }) });
  discAt("clamp.ring", frameX([FIXED_PL[1], 0, ZC]), 0, 1, 7, { tone: "mid" }, { inner: L(G.circleOf(frameX([FIXED_PL[1], 0, ZC]), 1, 3.2, P, 36), { tone: "lo" }) });
}
{
  const plan = { x: MOVING[0], y: -PL_Y, w: MOVING[1] - MOVING[0], d: 2 * PL_Y, r: 0.8 };
  box("platen.moving", plan, RAIL_TOP, PL_TOP, { tone: "mid" }, {
    piece: "platen",
    steps: 2,
    bevel: 0.6,
    inner: L(k.sideSeam(plan, RAIL_TOP + 4, P, 2), { tone: "faint" }),
    extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }),
  });
  // the moving mould half; its parting face holds the cavities (drawn live)
  const mplan = { x: MOULD_M[0], y: -MOULD.y, w: MOULD_M[1] - MOULD_M[0], d: 2 * MOULD.y, r: 0.5 };
  const xf = MOULD_M[1];
  const pins = [[xf, -14.6, 45.6], [xf, 14.6, 45.6], [xf, -14.6, 68.4], [xf, 14.6, 68.4]];
  box("platen.mould", mplan, MOULD.z0, MOULD.z1, { tone: "mid" }, {
    piece: "platen",
    steps: 2,
    bevel: 0.4,
    inner: L(k.sideSeam(mplan, 52, P, 2), { tone: "faint" }),
    extra: `<g data-cav=""></g>` + Dt(pins.map(at), { size: 0.5, tone: "hi" }),
  });
  for (const y of [-8, 8]) post("platen.coupling", -42, y, 1.3, MOULD.z1, MOULD.z1 + 2.6, { tone: "mid" }, { piece: "platen", steps: 6, extra: Dt([at([-42, y, MOULD.z1 + 2.6])], { size: 0.4, tone: "hi" }) });
}
{
  // the fixed mould half; the flash fin at the parting line is drawn with it
  const plan = { x: MOULD_F[0], y: -MOULD.y, w: MOULD_F[1] - MOULD_F[0], d: 2 * MOULD.y, r: 0.5 };
  const xf = MOULD_F[0];
  const o = 1.8;
  const outer = [[xf, -MOULD.y - o, MOULD.z0 - o], [xf, MOULD.y + o, MOULD.z0 - o], [xf, MOULD.y + o, MOULD.z1 + o], [xf, -MOULD.y - o, MOULD.z1 + o]];
  const inner = [[xf, -MOULD.y, MOULD.z0], [xf, -MOULD.y, MOULD.z1], [xf, MOULD.y, MOULD.z1], [xf, MOULD.y, MOULD.z0]];
  const flash = `<g class="sw-flash" data-flash="" style="opacity:0"><path fill-rule="evenodd" d="${poly(outer)}${poly(inner)}"/></g>`;
  box("mould.fixed", plan, MOULD.z0, MOULD.z1, { tone: "mid" }, {
    steps: 2,
    bevel: 0.4,
    inner: L(k.sideSeam(plan, 62, P, 2), { tone: "faint" }),
    extra: flash + Dt([[-32, MOULD.y, 68], [-28, MOULD.y, 68], [-32, MOULD.y, 46], [-28, MOULD.y, 46]].map(at), { size: 0.42 }),
  });
  for (const y of [-8, 8]) post("mould.coupling", -30, y, 1.3, MOULD.z1, MOULD.z1 + 2.6, { tone: "mid" }, { steps: 6, extra: Dt([at([-30, y, MOULD.z1 + 2.6])], { size: 0.4, tone: "hi" }) });
}
for (const [y, z] of BARS) {
  rod("clamp.bar-rear", frameX([REAR[1], y, z]), 0, MOVING[0] - REAR[1], BAR_R, OPEN, { tone: "mid" }, { piece: "platen" });
  rod(y > 0 ? "clamp.bar-near" : "clamp.bar-far", frameNX([FIXED_PL[0], y, z]), 0, FIXED_PL[0] - MOVING[1], BAR_R, OPEN, { tone: "mid" }, { piece: "platen" });
}
rod("clamp.ram", frameX([REAR[1], 0, ZC]), 1.6, MOVING[0] - REAR[1], 6, OPEN, { tone: "hi", crease: "lo" }, { piece: "platen" });
discAt("clamp.gland", frameX([REAR[1], 0, ZC]), 0, 1.6, 8.2, { tone: "mid" }, {});

// ---------------------------------------------------------------- injection unit
box("inj.base", INJ_BASE, BED_TOP, BASE_TOP, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(INJ_BASE, 38, P, 2), { tone: "faint" }) });
turned("inj.nozzle", frameX([FIXED_PL[1] + 1, 0, ZC]), [[0, 1.4], [2.5, 2.6], [7, 3.6], [9, 4.8], [-FIXED_PL[1] - 1, 4.8]], { tone: "mid" });
{
  // barrel head: the bore in its face is full of melt; bolts round the bore
  const FH = frameX([0, 0, ZC]);
  const face = frameX([S0, 0, ZC]);
  const bolts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    if (Math.sin(a) > 0.05) bolts.push(at(G.pointOf(face, 0, 7.4, a)));
  }
  turned("inj.head", FH, [[0, 6.4], [1.2, 9.2], [S0, 9.2]], { tone: "mid" }, {
    extra: `<path class="sw-melt" d="${G.circleOf(face, 0, RI, P, 48)}"/>` + L(G.circleOf(face, 0, RI, P, 48), { tone: "lo" }) + Dt(bolts, { size: 0.45 }),
  });
}
// The cut barrel with its heater bands, and the screw inside: one item. Its
// recorded shape is the barrel as a tube (bore RI); what is drawn of it is the
// lower half below the cut plane z = ZC, the two cut faces with section
// hatching, the bore, the melt and the screw.
const outerAt = (x) => (BANDS.some(([b0, b1]) => x >= b0 && x <= b1) ? RB : RO);
const PROFILE = (() => {
  const out = [[S0, RO]];
  for (const [b0, b1] of BANDS) out.push([b0, RO], [b0, RB], [b1, RB], [b1, RO]);
  out.push([S1, RO]);
  return out;
})();
const CUT = (() => {
  const F = frameX([0, 0, ZC]);
  const low = [];
  for (const [s, r] of PROFILE) for (let i = 0; i <= 12; i++) { const a = Math.PI + (i / 12) * Math.PI; low.push(at(G.pointOf(F, s, r, a))); }
  const lowClip = k.pathOf(hull(low), true);
  // the outer edge of a cut face, following the bands, as [x, r] steps
  const edge = PROFILE.slice();
  const strip = (sign) => poly([[S0, sign * RI, ZC], [S1, sign * RI, ZC], ...edge.slice().reverse().map(([x, r]) => [x, sign * r, ZC])]);
  // 45° hatching from the bore edge out to the outer edge
  const hatch = (sign) => {
    const out = [];
    for (let t = S0 - (RB - RI) + 0.6; t < S1; t += 2.4) {
      let u = 0;
      let end = null;
      for (let step = 0; step < 400; step++) {
        u += 0.02;
        const x = t + u;
        const y = RI + u;
        if (x > S1) { end = null; break; }
        if (y >= outerAt(x) - 1e-9) { end = [x, y]; break; }
      }
      const x0 = t;
      if (!end || x0 < S0) continue;
      out.push(k.segment([x0, sign * RI, ZC], [end[0], sign * Math.min(end[1], outerAt(end[0])), ZC], P));
    }
    return out.join("");
  };
  const bore = poly([[S0, -RI, ZC], [S1, -RI, ZC], [S1, RI, ZC], [S0, RI, ZC]]);
  // where the screw may show: above the bore's near edge (and the front part,
  // which sits in the melt, above its own near section line)
  const clipAbove = (y) => k.pathOf([at([S0, y, ZC]), at([S1, y, ZC]), at([S1, -RI - 1, ZC]), at([S1, -RI - 1, ZC + 40]), at([S0, y, ZC + 40])], true);
  return { F, lowClip, near: strip(1), far: strip(-1), hatchNear: hatch(1), hatchFar: hatch(-1), bore, rearClip: clipAbove(RI), frontClip: clipAbove(SCREW.front) };
})();
// the screw at rest: tip forward, cushion in front of it (press B), check ring closed
const TIP0 = S0 + CUSHION_MM / UNIT("B");
const SCR = (() => {
  const F = frameX([TIP0, 0, ZC]);
  const front = S(G.solidOf([[0, 0.5], [3.6, 4.3], [4.0, 2.8], [7.5, 2.8]], F, P), { tone: "hi", crease: "lo" });
  const ring = S(G.ringBand(5.1, 7.5, 2.9, 5.5, F, P), { tone: "mid", crease: "lo" });
  const rear = S(G.solidOf([[7.5, 4.8], [9, 4.8], [9, 4.4], [34, 4.4], [60, 3.0], [SCREW.f1 + 4, 3.0]], F, P), { tone: "hi", crease: "lo" });
  return { front, ring, rear };
})();
{
  const shape = R.solid(A.body(CUT.F, [[S0, RI], ...PROFILE, [S1, RI]], { name: "barrel.cut" }));
  const svg = [
    `<clipPath id="sw-low"><path d="${CUT.lowClip}"/></clipPath>`,
    `<clipPath id="sw-rear"><path d="${CUT.rearClip}"/></clipPath>`,
    `<clipPath id="sw-front"><path d="${CUT.frontClip}"/></clipPath>`,
    `<g clip-path="url(#sw-low)">${S(G.solidOf(PROFILE, CUT.F, P), { tone: "mid" })}</g>`,
    `<path class="sw-bore" d="${CUT.bore}"/>`,
    `<path class="sw-cut" d="${CUT.far}"/>`,
    L(CUT.hatchFar, { tone: "lo" }),
    L(CUT.far, { tone: "mid" }),
    `<path class="sw-cut" d="${CUT.near}"/>`,
    L(CUT.hatchNear, { tone: "lo" }),
    L(CUT.near, { tone: "mid" }),
    L(CUT.bore, { tone: "lo" }),
    `<path class="sw-melt" data-melt="" d=""/>`,
    `<path class="iso-line" data-tone="lo" data-melt-line="" d=""/>`,
    `<g clip-path="url(#sw-front)"><g data-scr="front">${SCR.front}</g><g data-scr="ring">${SCR.ring}</g></g>`,
    `<g clip-path="url(#sw-rear)"><g data-scr="rear">${SCR.rear}</g><path class="sw-flank" data-flank="" d=""/><path class="sw-land" data-land="" d=""/></g>`,
  ].join("");
  put("barrel.cut", [(S0 + S1) / 2, 0, ZC], svg, [shape]);
}
for (const x of [30, 52]) box("inj.saddle", { x: x - 1.6, y: -1.2, w: 3.2, d: 2.4, r: 0.3 }, BASE_TOP, ZC - RO, { tone: "mid" }, { steps: 2 });
{
  box("inj.throat", THROAT, BASE_TOP, 70, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(THROAT, 66, P, 2), { tone: "faint" }), extra: Dt(k.corners(THROAT, 1.6).map(([x, y]) => at([x, y, 70])), { size: 0.42 }) });
  post("inj.hopper-neck", 101, 0, 3.4, 70, 74, { tone: "mid" }, { steps: 24 });
  const FH = frameZ([101, 0, 74]);
  turned("inj.hopper", FH, [[0, 3.4], [9, 11.2], [22, 11.2]], { tone: "mid" }, { inner: k.fadedSvg(G.ribsOf(FH, 9.6, 21.4, 11.2, 18, P, { fade: [0.04, 0.4], seams: true }), { tone: "faint" }) });
  discAt("inj.hopper-lid", FH, 22, 23.6, 11.8, { tone: "mid" }, { extra: Dt([at([101, 0, 74 + 23.6])], { size: 0.5, tone: "hi" }) });
}
{
  const ticks = [];
  for (let i = 0; i <= 28; i++) {
    const x = POINTER_X + i;
    const long = i % 5 === 0;
    ticks.push(k.segment([x, RULER.y + RULER.d, RULER_Z[1]], [x, RULER.y + RULER.d, RULER_Z[1] - (long ? 2.2 : 1.2)], P));
  }
  box("inj.housing", HOUSING, BASE_TOP, HOUSING_TOP, { tone: "mid" }, {
    steps: 2,
    bevel: 0.6,
    inner: L(k.sideSeam(HOUSING, 46, P, 2), { tone: "faint" }),
    extra: Dt(k.corners(HOUSING, 1.8).map(([x, y]) => at([x, y, HOUSING_TOP])), { size: 0.42 }),
  });
  box("inj.ruler", RULER, RULER_Z[0], RULER_Z[1], { tone: "mid" }, { steps: 1, inner: L(ticks.join(""), { tone: "lo" }) });
  const FM = frameZ([132, 0, HOUSING_TOP]);
  turned("inj.motor", FM, [[0, 6.6], [15, 6.6]], { tone: "mid" }, { attrs: ' data-ele=""', inner: k.fadedSvg(G.ribsOf(FM, 0.6, 14.4, 6.6, 20, P, { fade: [0.04, 0.42], seams: true }), { tone: "lo" }) });
  discAt("inj.motor-cap", FM, 15, 17, 5.2, { tone: "mid" }, { attrs: ' data-ele=""', extra: Dt([at([132, 0, HOUSING_TOP + 17])], { size: 0.45, tone: "hi" }) });
  // the screw-position pointer riding on the ruler
  box("screw.pointer", { x: POINTER_X - 0.8, y: RULER.y, w: 1.6, d: 1.4, r: 0.2 }, RULER_Z[1], RULER_Z[1] + 4, { tone: "hi", crease: "lo" }, { piece: "screw", steps: 1 });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: STATES });
R.items.sort((a, b) => a.key - b.key);
if (process.env.ORDER) console.log(R.items.map((i, n) => n + " " + i.name).join("\n"));
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups, `<g data-mark=""></g>`];

const LABEL_NL =
  "Een spuitgietmachine op een stalen bed, met de cilinder opengesneden. Links de sluitunit: de achterplaat met de sluitcilinder, vier geleidekolommen, de bewegende plaat met de bewegende matrijshelft, waarop de holtes te zien zijn als de matrijs open is, en de vaste plaat met de vaste matrijshelft. Rechts de spuitunit: de spuitmond tegen de vaste plaat, de cilinderkop, de cilinder met vier verwarmingsbanden, in de lengte doorgesneden zodat de schroef te zien is met doseerzone, compressiezone en intrekzone, en voorop de terugslagring. Voor de schroef staat de smelt. Achteraan de trechter met korrels en de aandrijving met servomotor en een liniaal die de stand van de schroef aanwijst.";
const LABEL_EN =
  "An injection moulding machine on a steel bed, with its barrel cut open. On the left the clamp unit: the rear platen with the clamp cylinder, four tie bars, the moving platen with the moving mould half, whose cavities show when the mould is open, and the fixed platen with the fixed mould half. On the right the injection unit: the nozzle against the fixed platen, the barrel head, and the barrel with four heater bands, cut lengthwise to show the screw with its metering, compression and feed zones and the check ring at the front. The melt sits in front of the screw. At the back the hopper with granules and the drive with a servo motor and a ruler that shows the screw position.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
// g: "s" static, "p" rides the platen, "w" rides the screw (x is relative to the tip)
const PARTS = [
  { key: "hopper", g: "s", at: [101, 0, 92] },
  { key: "band", g: "s", at: [63, RB * 0.7, ZC - RB * 0.7] },
  { key: "barrel", g: "s", at: [74, (RI + RO) / 2, ZC] },
  { key: "melt", g: "m", at: [S0 + 2, 0, ZC] },
  { key: "ring", g: "w", at: [6.3, 0, ZC + 5.5] },
  { key: "metering", g: "w", at: [22, 0, ZC + 5.5] },
  { key: "compression", g: "w", at: [47, 0, ZC + 5.5] },
  { key: "feed", g: "w", at: [75, 0, ZC + 5.5] },
  { key: "nozzle", g: "s", at: [-5, 0, ZC + 4.8] },
  { key: "fixed", g: "s", at: [-18, PL_Y, 72] },
  { key: "mould", g: "s", at: [-30, MOULD.y, 58] },
  { key: "moving", g: "p", at: [-54, PL_Y, 72] },
  { key: "bars", g: "s", at: [-70, 21, 76] },
  { key: "cylinder", g: "s", at: [-120, 0, ZC + 14] },
  { key: "drive", g: "s", at: [132, 0, HOUSING_TOP + 9] },
  { key: "ruler", g: "s", at: [124, RULER.y, RULER_Z[0]] },
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
  --sw-hair:rgba(240,233,218,.12);--sw-accent:#5C9FAE;--sw-melt:#3F8797;--sw-bore:#06161A;--sw-cut:#1A3A42;--sw-seg:#2A4A4A;
  --sw-land:#2A4C55;--sw-flank:#173740;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --sw-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --sw-hair:rgba(11,41,27,.14);--sw-accent:#276F81;--sw-melt:#8DB6BE;--sw-bore:#CFC6B0;--sw-cut:#E4DCC9;--sw-seg:#C2C3B2;
  --sw-land:#FBF8F1;--sw-flank:#E4DCC9;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--sw-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:1;--lines:3;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--sw-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="2"] .iso-plate{--rows:2;--lines:4}
html[data-level="3"] .iso-plate{--rows:2;--lines:3}
html[data-level="4"] .iso-plate{--rows:3;--lines:5}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--sw-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.sw-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sw-acc{color:var(--sw-accent);font-weight:600}
.sw-strong{color:var(--anatomy-strong);font-weight:600}
.sw-mute{color:var(--anatomy-muted)}
.sw-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.sw-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.sw-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.sw-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.sw-row{display:flex;gap:4px;height:44px;align-items:center}
.sw-row[hidden]{display:none}
.sw-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--sw-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--sw-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.sw-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.sw-btn:disabled{opacity:.4;cursor:default}
.sw-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--sw-accent);color:var(--sw-accent);font-weight:600}
.sw-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.sw-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.sw-btn sub{font-size:9px}
.sw-group{display:flex;gap:4px;flex:1 1 auto;height:44px}
.sw-range{flex:1 1 auto;min-width:0;height:44px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer;touch-action:none}
.sw-range:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px;border-radius:8px}
.sw-range::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:var(--sw-seg)}
.sw-range::-moz-range-track{height:4px;border-radius:2px;background:var(--sw-seg)}
.sw-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;margin-top:-9px;border-radius:50%;background:var(--anatomy-card);box-shadow:inset 0 0 0 2px var(--sw-accent)}
.sw-range::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:50%;background:var(--anatomy-card);box-shadow:inset 0 0 0 2px var(--sw-accent)}
.sw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sw-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.sw-bore{fill:var(--sw-bore);stroke:none}
.sw-cut{fill:var(--sw-cut);stroke:none}
.sw-melt{fill:var(--sw-melt);stroke:none}
.sw-land{fill:var(--sw-land);stroke:var(--anatomy-hi);stroke-width:.4px;stroke-linejoin:round}
.sw-flank{fill:var(--sw-flank);stroke:var(--anatomy-lo);stroke-width:.35px;stroke-linejoin:round}
.sw-cavity{fill:var(--sw-bore);stroke:var(--anatomy-lo);stroke-width:.4px;stroke-linejoin:round}
.sw-runner{fill:none;stroke:var(--anatomy-lo);stroke-width:.6px;stroke-linecap:round}
.sw-flash path{fill:var(--sw-accent);stroke:var(--sw-accent);stroke-width:.3px;stroke-linejoin:round}
.sw-flash{transition:opacity .25s}
.sw-mark{fill:none;stroke:var(--sw-accent);stroke-width:1.4px}
.sw-mark-dot{fill:var(--sw-accent);stroke:none}
[data-scr="ring"][data-worn] .iso-top,[data-scr="ring"][data-worn] .iso-shade,[data-scr="ring"][data-worn] .iso-fill{fill:var(--sw-melt)}
html[data-drive="hyd"] [data-hyd] .iso-top,html[data-drive="hyd"] [data-hyd] .iso-shade,html[data-drive="hyd"] [data-hyd] .iso-fill,
html[data-drive="ele"] [data-ele] .iso-top,html[data-drive="ele"] [data-ele] .iso-shade,html[data-drive="ele"] [data-ele] .iso-fill{fill:var(--anatomy-lit-shade)}
@media (prefers-reduced-motion:reduce){.sw-flash{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const PRESSES = ${JSON.stringify(PRESSES)}, MARGIN = ${MARGIN}, CYCLE = ${CYCLE}, ENERGY = ${JSON.stringify(ENERGY)};
const V_LIST = ${JSON.stringify(V_LIST)}, A_LIST = ${JSON.stringify(A_LIST)}, P_LIST = ${JSON.stringify(P_LIST)};
const LEVELS = ${JSON.stringify(LEVELS)};
const PARTS = ${JSON.stringify(PARTS)};
const ZC = ${ZC}, S0 = ${S0}, S1 = ${S1}, RI = ${RI}, TIP0 = ${TIP0}, OPEN = ${OPEN}, STROKE_W = ${STROKE_W}, CUSHION_MM = ${CUSHION_MM};
const SCREW = ${JSON.stringify(SCREW)};
const MF = ${MOULD_M[1]}, MOULD = ${JSON.stringify(MOULD)};
const forceOf = ${forceOf.toString()};
const utilOf = ${utilOf.toString()};
const strokeOf = ${strokeOf.toString()};
const residenceOf = ${residenceOf.toString()};
const costOf = ${costOf.toString()};
const paybackOf = ${paybackOf.toString()};
const MMU = (press) => PRESSES[press].d / 11;

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",", cav1: "cavity", cavN: "cavities", press: "press", fits: "holds it shut", tight: "tight: under 15 % margin", flash: "too little: flash", util: "utilisation", low: "too low: residence", high: "too high", ok: "within 20–80 %", ideal: "ideal 40–60 %", stroke: "stroke", resid: "residence", shots: "shots", cushion: "cushion", ringOk: "check ring good", ringWorn: "check ring worn", hyd: "hydraulic", ele: "electric", year: "/year", saving: "saving", payback: "payback", yr: "years", tapPart: "tap a part to name it", dose: "dosing", inject: "injecting", hold: "holding", cool: "cooling", open: "open", close: "closing", eject: "ejecting",
      parts: { hopper: ["Hopper", "granules drop into the barrel"], band: ["Heater band", "keeps the barrel at temperature"], barrel: ["Barrel", "steel tube, here cut open"], melt: ["Melt", "the next shot, in front of the screw"], ring: ["Check ring", "open while dosing, shut while injecting"], metering: ["Metering zone", "evens out temperature and mix"], compression: ["Compression zone", "channel gets shallower: melts"], feed: ["Feed zone", "deep flights pull granules in"], nozzle: ["Nozzle", "presses on the mould's sprue"], fixed: ["Fixed platen", "carries the fixed mould half"], mould: ["Mould", "two halves; the cavities inside"], moving: ["Moving platen", "slides along the tie bars"], bars: ["Tie bars", "the mould must fit between them"], cylinder: ["Clamp cylinder", "pushes the mould shut: clamp force"], drive: ["Servo motor", "turns the screw while dosing"], ruler: ["Stroke ruler", "shows where the screw is"] } }
  : { dec: ",", grp: ".", cav1: "holte", cavN: "holtes", press: "pers", fits: "houdt hem dicht", tight: "krap: minder dan 15 % marge", flash: "te weinig: braam", util: "benutting", low: "te laag: verblijftijd", high: "te hoog", ok: "binnen 20–80 %", ideal: "ideaal 40–60 %", stroke: "slag", resid: "verblijftijd", shots: "shots", cushion: "kussen", ringOk: "terugslagring goed", ringWorn: "terugslagring versleten", hyd: "hydraulisch", ele: "elektrisch", year: "/jaar", saving: "besparing", payback: "terugverdiend in", yr: "jaar", tapPart: "tik een onderdeel voor de naam", dose: "doseren", inject: "inspuiten", hold: "nadruk", cool: "koelen", open: "open", close: "sluiten", eject: "uitwerpen",
      parts: { hopper: ["Trechter", "korrels vallen in de cilinder"], band: ["Verwarmingsband", "houdt de cilinder op temperatuur"], barrel: ["Cilinder", "stalen buis, hier opengesneden"], melt: ["Smelt", "het volgende shot, vóór de schroef"], ring: ["Terugslagring", "open bij doseren, dicht bij inspuiten"], metering: ["Doseerzone", "maakt de smelt gelijkmatig"], compression: ["Compressiezone", "kanaal wordt ondieper: smelten"], feed: ["Intrekzone", "diepe gangen trekken korrels in"], nozzle: ["Spuitmond", "drukt op de matrijs"], fixed: ["Vaste plaat", "draagt de vaste matrijshelft"], mould: ["Matrijs", "twee helften, de holtes erin"], moving: ["Bewegende plaat", "schuift over de kolommen"], bars: ["Geleidekolommen", "de matrijs moet ertussen passen"], cylinder: ["Sluitcilinder", "drukt de matrijs dicht: sluitkracht"], drive: ["Servomotor", "draait de schroef bij doseren"], ruler: ["Slagliniaal", "toont waar de schroef staat"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const grouped = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);
const pText = (v) => fmt(v, 2);

const stage = document.querySelector(".sw-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  platen: [...svg.querySelectorAll("[data-platen]")], screw: [...svg.querySelectorAll("[data-screw]")],
  front: q('[data-scr="front"]'), ring: q('[data-scr="ring"]'), rear: q('[data-scr="rear"]'),
  flank: q("[data-flank]"), land: q("[data-land]"), melt: q("[data-melt]"), meltLine: q("[data-melt-line]"),
  cav: q("[data-cav]"), flash: q("[data-flash]"), mark: q("[data-mark]"),
};
const lines = [...document.querySelectorAll("[data-readout] .sw-line")];
const announcer = document.querySelector(".sw-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
const AX = axisVector(P, [1, 0, 0]);

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { press: L0.press, v: L0.v, area: L0.area, p: L0.p, cav: L0.cav, worn: false, drive: "hyd", sel: "v" };
document.documentElement.setAttribute("data-drive", LVL === 4 ? st.drive : "");
const press = () => PRESSES[st.press];
const totalArea = () => (LVL === 1 ? 300 * st.cav : st.area);
const pNow = () => (LVL === 1 ? 0.4 : st.p);
const need = () => forceOf(totalArea(), pNow());
const strokeW = () => (strokeOf(st.v, press().d) / MMU(st.press));
let cushion = CUSHION_MM; // mm, this shot

// one cycle, in machine seconds: close, inject, hold, cool (dosing inside it), open, eject
const PH = [["close", 1.5], ["inject", 1.0], ["hold", 2.5], ["cool", 9], ["open", 1.5], ["eject", 1.5]];
const PLAN = (() => { let t = 0; return PH.map(([name, dur]) => { const p = { name, t0: t, dur }; t += dur; return p; }); })();
const TOTAL = PLAN.reduce((s, p) => s + p.dur, 0);
const doseTime = () => 1.2 + 6.5 * utilOf(st.v, press().vmax);
function pose(t) {
  const [close, inject, hold, cool, open] = PLAN;
  let gap = 0, d = 0, ring = 0, turning = false, pressed = false, phase = "close";
  for (const p of PLAN) if (t >= p.t0) phase = p.name;
  if (t < close.t0 + close.dur) gap = 1 - ease((t - close.t0) / close.dur);
  else if (t < open.t0) gap = 0;
  else if (t < open.t0 + open.dur) gap = ease((t - open.t0) / open.dur);
  else gap = 1;
  const full = strokeW();
  if (t < inject.t0) d = full;
  else if (t < inject.t0 + inject.dur) d = full * (1 - 0.96 * ease((t - inject.t0) / inject.dur));
  else if (t < hold.t0 + hold.dur) d = full * 0.04 * (1 - ease((t - hold.t0) / hold.dur));
  else if (t < cool.t0 + doseTime()) { d = full * ease((t - cool.t0) / doseTime()); turning = true; phase = "dose"; }
  else d = full;
  // the check ring: shut (back on its seat) from injection to the end of hold, open while dosing
  ring = t >= inject.t0 && t < hold.t0 + hold.dur ? 0 : 1;
  pressed = t >= inject.t0 && t < open.t0;
  return { gap, d, ring, turning, pressed, phase };
}

// ------------------------------------------------ the screw, drawn live
const A0 = Math.atan2(${G.viewOf(P)[2]}, ${G.viewOf(P)[1]});
const rootAt = (s) => (s < 9 ? 4.8 : s < 34 ? 4.4 : s < 60 ? 4.4 - (1.4 * (s - 34)) / 26 : 3.0);
const pathOfPts = (pts) => "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L");
function flights(tipX, phi) {
  const { rc, pitch, land, f0, f1 } = SCREW;
  const N = 22;
  let flanks = "", lands = "";
  const kMin = Math.floor((f0 - pitch) / pitch) - 1, kMax = Math.ceil(f1 / pitch) + 1;
  for (let k = kMin; k <= kMax; k++) {
    const c0 = [], c1 = [], r1 = [];
    for (let i = 0; i <= N; i++) {
      const a = A0 - Math.PI / 2 + (Math.PI * i) / N;
      let s = (pitch * (a - phi)) / (2 * Math.PI) + k * pitch;
      if (s < f0 || s + land > f1) { if (c0.length) break; continue; }
      const ca = Math.cos(a), sa = Math.sin(a);
      c0.push(iso([tipX + s, rc * ca, ZC + rc * sa], P));
      c1.push(iso([tipX + s + land, rc * ca, ZC + rc * sa], P));
      const rr = rootAt(s + land);
      r1.push(iso([tipX + s + land, rr * ca, ZC + rr * sa], P));
    }
    if (c0.length < 2) continue;
    flanks += pathOfPts([...c1, ...r1.slice().reverse()]) + "Z";
    lands += pathOfPts([...c0, ...c1.slice().reverse()]) + "Z";
  }
  return { flanks, lands };
}
function shift(node, dxWorld) {
  const dx = AX[0] * dxWorld, dy = AX[1] * dxWorld;
  if (dxWorld) node.setAttribute("transform", "translate(" + dx.toFixed(2) + " " + dy.toFixed(2) + ")"); else node.removeAttribute("transform");
  holdStill(node, [dx, dy]);
}
function cavities() {
  const n = LVL === 1 ? st.cav : 2;
  const a = LVL === 1 ? 300 : st.area / 2;
  const w = Math.sqrt((a * 3) / 4), h = Math.sqrt((a * 4) / 3);
  const ys = n === 1 ? [0] : [-(w / 2 + 1), w / 2 + 1];
  let out = "";
  const zc = (MOULD.z0 + MOULD.z1) / 2;
  ys.forEach((y) => {
    const pts = [[MF, y - w / 2, zc - h / 2], [MF, y + w / 2, zc - h / 2], [MF, y + w / 2, zc + h / 2], [MF, y - w / 2, zc + h / 2]].map((p) => iso(p, P));
    out += '<path class="sw-cavity" d="' + pathOfPts(pts) + 'Z"/>';
  });
  // sprue in the middle, a short runner to each cavity
  const sp = iso([MF, 0, zc], P);
  if (n === 2) out += '<path class="sw-runner" d="' + pathOfPts([iso([MF, ys[0] + w / 2, zc], P), iso([MF, ys[1] - w / 2, zc], P)]) + '"/>';
  out += '<circle class="sw-mark-dot" cx="' + sp[0].toFixed(2) + '" cy="' + sp[1].toFixed(2) + '" r="0.9"/>';
  el.cav.innerHTML = out;
}

// ------------------------------------------------ readout
let marked = -1;
const verdictU = (u) => (u < 0.2 ? '<span class="sw-acc">' + T.low + "</span>" : u > 0.8 ? '<span class="sw-acc">' + T.high + "</span>" : u >= 0.4 && u <= 0.6 ? T.ideal : T.ok);
function verdictF() {
  const f = need(), t = press().t;
  if (f > t) return '<span class="sw-acc">' + T.flash + "</span>";
  if (LVL > 2 && f * (1 + MARGIN) > t) return '<span class="sw-acc">' + T.tight + "</span>";
  return T.fits;
}
function readout() {
  const out = [];
  const pr = press();
  if (LVL === 1) {
    out.push(st.cav + " " + (st.cav === 1 ? T.cav1 : T.cavN) + " · " + grouped(totalArea()) + " cm² × 0" + T.dec + "4 t/cm² = " + '<span class="sw-strong">' + grouped(need()) + " t</span>");
    out.push(T.press + " " + pr.t + " t · " + verdictF());
  } else if (LVL === 2) {
    const u = utilOf(st.v, pr.vmax);
    out.push("V " + st.v + " cm³ · Ø" + pr.d + " · " + T.stroke + " " + grouped(strokeOf(st.v, pr.d)) + " mm");
    out.push(T.util + " " + st.v + " / " + pr.vmax + " = " + '<span class="sw-strong">' + Math.round(100 * u) + " %</span> · " + verdictU(u));
    const r = residenceOf(st.v, pr.vmax, CYCLE);
    out.push(T.resid + " ≈ " + fmt(pr.vmax / st.v, 1) + " " + T.shots + " × " + CYCLE + " s = " + grouped(r) + " s" + (r >= 120 ? " (" + fmt(r / 60, 1) + " min)" : ""));
    out.push(T.cushion + " " + fmt(cushion, 1) + " mm · " + (st.worn ? '<span class="sw-acc">' + T.ringWorn + "</span>" : T.ringOk));
  } else {
    const f = need(), u = utilOf(st.v, pr.vmax);
    out.push(grouped(st.area) + " × " + pText(st.p) + " × 1" + T.dec + "15 = " + '<span class="sw-strong">' + grouped(f * (1 + MARGIN)) + " t</span> / " + pr.t + " t · " + verdictF());
    out.push(T.util + " " + st.v + " / " + pr.vmax + " cm³ = " + '<span class="sw-strong">' + Math.round(100 * u) + " %</span> · " + verdictU(u));
    if (LVL === 4) {
      const kwh = st.drive === "hyd" ? ENERGY.hyd : ENERGY.ele;
      out.push((st.drive === "hyd" ? T.hyd : T.ele) + " " + fmt(kwh, 1) + " kWh/kg × " + grouped(ENERGY.kgh * ENERGY.hours) + " kg × € 0" + T.dec + "20 = " + '<span class="sw-strong">€ ' + grouped(costOf(kwh)) + T.year + "</span>");
      out.push(st.drive === "ele" ? T.saving + " € " + grouped(costOf(ENERGY.hyd) - costOf(ENERGY.ele)) + T.year + " · € " + grouped(ENERGY.extra) + " → " + T.payback + " " + fmt(paybackOf(), 1) + " " + T.yr : '<span class="sw-mute">' + T.ele + " 0" + T.dec + "3 kWh/kg, € " + grouped(ENERGY.extra) + " extra</span>");
    }
  }
  if (LVL <= 2) out.push(marked >= 0 ? '<span class="sw-acc">' + T.parts[PARTS[marked].key][0] + "</span> · " + T.parts[PARTS[marked].key][1] : '<span class="sw-mute">' + T.tapPart + "</span>");
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

// ------------------------------------------------ draw
const clock = { t: PLAN[3].t0 + 7, phi: 0, playing: !still.matches };
let last = { d: -1, ring: -1, gap: -1, phi: -1 };
function anchorOf(p, ps) {
  const tipX = TIP0 + ps.dExtra + ps.d;
  if (p.g === "w") return [tipX + p.at[0], p.at[1], p.at[2]];
  if (p.g === "p") return [p.at[0] - OPEN * ps.gap, p.at[1], p.at[2]];
  return p.at;
}
let ps = { gap: 0, d: 0, dExtra: 0 };
function draw() {
  const p = pose(clock.t);
  const extra = (cushion / MMU(st.press)) - (CUSHION_MM / MMU("B"));
  ps = { gap: p.gap, d: p.d, dExtra: extra };
  const tipX = TIP0 + extra + p.d;
  el.platen.forEach((n) => shift(n, -OPEN * p.gap));
  el.screw.forEach((n) => shift(n, p.d * (STROKE_W / STROKE_W) + extra));
  shift(el.front, tipX - TIP0);
  shift(el.rear, tipX - TIP0);
  shift(el.ring, tipX - TIP0 - 1.1 * p.ring);
  if (st.worn) el.ring.setAttribute("data-worn", ""); else el.ring.removeAttribute("data-worn");
  const f = flights(tipX, clock.phi);
  el.flank.setAttribute("d", f.flanks);
  el.land.setAttribute("d", f.lands);
  const melt = pathOfPts([[S0, -RI, ZC], [tipX + 7.5, -RI, ZC], [tipX + 7.5, RI, ZC], [S0, RI, ZC]].map((q) => iso(q, P))) + "Z";
  el.melt.setAttribute("d", melt);
  el.meltLine.setAttribute("d", melt);
  const showFlash = p.pressed && p.gap === 0 && need() > press().t;
  el.flash.style.opacity = showFlash ? "1" : "0";
  if (marked >= 0) {
    const [x, y] = iso(anchorOf(PARTS[marked], ps), P);
    el.mark.innerHTML = '<circle class="sw-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="sw-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
  readout();
}

// ------------------------------------------------ loop
const SPEED = 2.4; // machine seconds per real second
let frame = 0, lastT = 0, visible = false;
function newShot() {
  cushion = st.worn ? 0.6 + Math.random() * 8.4 : CUSHION_MM + (Math.random() - 0.5) * 0.2;
}
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 30) : 1 / 60;
  lastT = now;
  if (still.matches) {
    clock.t = PLAN[3].t0 + doseTime() + 0.5; // dosed, mould shut
  } else if (clock.playing) {
    const before = clock.t;
    clock.t += dt * SPEED;
    const p = pose(clock.t);
    if (p.turning) clock.phi += dt * SPEED * 2.6;
    if (before < PLAN[2].t0 + PLAN[2].dur && clock.t >= PLAN[2].t0 + PLAN[2].dur) newShot();
    if (clock.t >= TOTAL) clock.t -= TOTAL;
  }
  draw();
  frame = visible && !still.matches && clock.playing ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { lastT = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches || !clock.playing) draw(); else run(); };

// ------------------------------------------------ controls
const $ = (sel) => document.querySelector(sel);
const rows = [...document.querySelectorAll(".sw-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const pickBtns = [...document.querySelectorAll("[data-pick]")];
const stepBtns = [...document.querySelectorAll("[data-row='vals'] [data-step]")];
const range = $(".sw-range");
const rMinus = $("[data-row='shot'] [data-step='-']");
const rPlus = $("[data-row='shot'] [data-step='+']");
const LISTS = { v: V_LIST, area: A_LIST, p: P_LIST };
function valueText(key) { return key === "v" ? st.v + " cm³" : key === "area" ? grouped(st.area) + " cm²" : grouped(st.p * 1000) + " bar"; }
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  pickBtns.forEach((b) => { const on = b.dataset.pick === st.sel; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; b.querySelector("b").textContent = valueText(b.dataset.pick); });
  const list = LISTS[st.sel];
  const i = list.findIndex((v) => Math.abs(v - st[st.sel]) < 1e-9);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1));
  range.value = String(st.v);
  range.setAttribute("aria-valuetext", st.v + " cm³");
  rMinus.disabled = st.v <= 10;
  rPlus.disabled = st.v >= 240;
  document.documentElement.setAttribute("data-drive", LVL === 4 ? st.drive : "");
  cavities();
}
function announce() {
  const text = lines.map((l) => l.textContent).filter(Boolean).join(". ");
  announcer.textContent = text;
}
let idle = 0;
function steer() { clearTimeout(idle); }
function changed() { if (!st.worn) cushion = CUSHION_MM; sync(); draw(); announce(); kick(); }
function setValue(key, value) {
  if (key === "cav" || key === "v") st[key] = Number(value);
  else if (key === "worn") st.worn = value === "true";
  else st[key] = value;
  changed();
}
radios.forEach((b) => b.addEventListener("click", () => { const [key, val] = b.dataset.set.split(":"); setValue(key, val); }));
document.querySelectorAll("[role='radiogroup']").forEach((group) => {
  group.addEventListener("keydown", (event) => {
    const items = [...group.querySelectorAll('[role="radio"]')];
    const i = items.findIndex((b) => b.getAttribute("aria-checked") === "true");
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % items.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + items.length - 1) % items.length;
    if (next < 0) return;
    event.preventDefault();
    items[next].click();
    items[next].focus();
  });
});
pickBtns.forEach((b) => b.addEventListener("click", () => { st.sel = b.dataset.pick; changed(); }));
function stepValue(dir) {
  const list = LISTS[st.sel];
  let i = list.findIndex((v) => Math.abs(v - st[st.sel]) < 1e-9);
  if (i < 0) i = 0;
  st[st.sel] = list[clamp(i + dir, 0, list.length - 1)];
  changed();
}
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
range.addEventListener("input", () => { st.v = Number(range.value); changed(); });
rMinus.addEventListener("click", () => { st.v = Math.max(10, st.v - 5); changed(); });
rPlus.addEventListener("click", () => { st.v = Math.min(240, st.v + 5); changed(); });

// tap the drawing: at levels 1 and 2 name the nearest part, at 3 and 4 pause
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => {
    const [px, py] = iso(anchorOf(p, ps), P);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
function togglePlay() {
  if (still.matches) return;
  clock.playing = !clock.playing;
  if (clock.playing) run(); else draw();
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) { togglePlay(); return; }
  marked = nearestPart(toView(event));
  draw(); announce(); kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL <= 2 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; draw(); announce(); kick(); }
  else if (LVL <= 2 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; draw(); announce(); kick(); }
  else if (LVL > 2 && event.key === "ArrowUp") stepValue(1);
  else if (LVL > 2 && event.key === "ArrowDown") stepValue(-1);
  else if (LVL > 2 && ["1", "2", "3"].includes(event.key)) { st.sel = ["v", "area", "p"][Number(event.key) - 1]; changed(); }
  else if (event.key === " " || event.key === "Enter") togglePlay();
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) tick(performance.now()); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { clock.playing = true; run(); } });
if (still.matches) clock.t = PLAN[3].t0 + doseTime() + 0.5;
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Schroef, cilinder en sluitkracht",
    hint1: "Tik een onderdeel · kies 1 of 2 holtes",
    hint2: "Tik een onderdeel · kies het shotvolume",
    hint3: "Kies V, A of p, dan − of + · tik: pauze",
    hint4: "Kies pers, waarde en aandrijving · tik: pauze",
    cav1: "1 holte",
    cav2: "2 holtes",
    cavs: "Aantal holtes",
    ringOk: "Ring goed",
    ringWorn: "Ring versleten",
    ring: "Terugslagring",
    shot: "Shotvolume in cm³, 10 tot 240",
    pressA: "Pers A · 200 t · 120 cm³",
    pressB: "Pers B · 250 t · 250 cm³",
    presses: "Pers",
    vals: "Waarde",
    hyd: "Hydraulisch",
    ele: "Elektrisch",
    drives: "Aandrijving",
    minus: "Lager",
    plus: "Hoger",
    label: LABEL_NL,
    aria: "Spuitgietmachine met opengesneden cilinder. Niveau 1 en 2: pijltjes kiezen een onderdeel. Niveau 3 en 4: toetsen 1 tot 3 kiezen V, A of p, pijl omhoog en omlaag veranderen de waarde. Spatie pauzeert.",
  },
  en: {
    title: "Screw, barrel and clamp force",
    hint1: "Tap a part · pick 1 or 2 cavities",
    hint2: "Tap a part · set the shot volume",
    hint3: "Pick V, A or p, then − or + · tap: pause",
    hint4: "Pick press, value and drive · tap: pause",
    cav1: "1 cavity",
    cav2: "2 cavities",
    cavs: "Number of cavities",
    ringOk: "Ring good",
    ringWorn: "Ring worn",
    ring: "Check ring",
    shot: "Shot volume in cm³, 10 to 240",
    pressA: "Press A · 200 t · 120 cm³",
    pressB: "Press B · 250 t · 250 cm³",
    presses: "Press",
    vals: "Value",
    hyd: "Hydraulic",
    ele: "Electric",
    drives: "Drive",
    minus: "Lower",
    plus: "Higher",
    label: LABEL_EN,
    aria: "Injection moulding machine with the barrel cut open. Levels 1 and 2: arrows pick a part. Levels 3 and 4: keys 1 to 3 pick V, A or p, up and down change the value. Space pauses.",
  },
};

const sN = STRINGS.nl;
const radio = (set, text, attr) => `<button type="button" class="sw-btn" role="radio" data-set="${set}" data-t="${attr}" aria-checked="false" tabindex="-1">${text}</button>`;
const valBtn = (key, labelHtml) => `<button type="button" class="sw-btn" role="radio" data-pick="${key}" aria-checked="${key === "v"}" tabindex="${key === "v" ? 0 : -1}">${labelHtml}&nbsp;<b></b></button>`;
const controls = [
  `<div class="sw-controls">`,
  `<div class="sw-row" data-row="cav" data-levels="1" role="radiogroup" aria-label="${sN.cavs}" data-t-label="cavs">${radio("cav:1", sN.cav1, "cav1")}${radio("cav:2", sN.cav2, "cav2")}</div>`,
  `<div class="sw-row" data-row="press" data-levels="3,4" role="radiogroup" aria-label="${sN.presses}" data-t-label="presses">${radio("press:A", sN.pressA, "pressA")}${radio("press:B", sN.pressB, "pressB")}</div>`,
  `<div class="sw-row" data-row="shot" data-levels="2"><button type="button" class="sw-btn" data-step="-" aria-label="${sN.minus}" data-t-label="minus">−</button><input class="sw-range" type="range" min="10" max="240" step="5" value="100" aria-label="${sN.shot}" data-t-label="shot"><button type="button" class="sw-btn" data-step="+" aria-label="${sN.plus}" data-t-label="plus">+</button></div>`,
  `<div class="sw-row" data-row="ring" data-levels="2" role="radiogroup" aria-label="${sN.ring}" data-t-label="ring">${radio("worn:false", sN.ringOk, "ringOk")}${radio("worn:true", sN.ringWorn, "ringWorn")}</div>`,
  `<div class="sw-row" data-row="vals" data-levels="3,4"><div class="sw-group" role="radiogroup" aria-label="${sN.vals}" data-t-label="vals">${valBtn("v", "<i>V</i>")}${valBtn("area", "<i>A</i>")}${valBtn("p", "<i>p</i>")}</div><button type="button" class="sw-btn" data-step="-" aria-label="${sN.minus}" data-t-label="minus">−</button><button type="button" class="sw-btn" data-step="+" aria-label="${sN.plus}" data-t-label="plus">+</button></div>`,
  `<div class="sw-row" data-row="drive" data-levels="4" role="radiogroup" aria-label="${sN.drives}" data-t-label="drives">${radio("drive:hyd", sN.hyd, "hyd")}${radio("drive:ele", sN.ele, "ele")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="sw-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="sw-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="sw-line"></span>'.repeat(5)}</span>`)
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
var st=document.querySelector(".sw-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: L1 2 cav ${forceOf(600, 0.4)} t · L3 ${forceOf(380, 0.45)} t → ${(forceOf(380, 0.45) * 1.15).toFixed(1)} t · U A ${(100 * utilOf(100, 120)).toFixed(1)} % B ${(100 * utilOf(100, 250)).toFixed(1)} % · stroke B 100 cm³ ${strokeOf(100, 50).toFixed(1)} mm · max B ${strokeOf(250, 50).toFixed(1)} mm (${(strokeOf(250, 50) / UNIT("B")).toFixed(1)} u) · max A ${strokeOf(120, 40).toFixed(1)} mm (${(strokeOf(120, 40) / UNIT("A")).toFixed(1)} u) · payback ${paybackOf().toFixed(2)} y`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { frames: STATES, apart: true });
