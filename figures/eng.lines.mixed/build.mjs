// Dev tool, not shipped. Builds the standalone figure for the topic
// "Varianten en omstellen" (module Lijnen en automatisering): the lessons
// eng.lines.variants (level 1), linechange (level 2), mixed (level 3) and
// sequencing (level 4).
//
//   node figures/eng.lines.mixed/build.mjs            build the page
//   node figures/eng.lines.mixed/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.lines.mixed.html: one offline page
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
const OUT = join(ROOT, "src/content/courses/figures/eng.lines.mixed.html");

// ---------------------------------------------------------------- the model
// A paced assembly line with five stations. Products ride on carriers
// (dragers) in three variants: small, medium and large (S, M, L; A, B, C at
// level 4). Every station has grip fingers, the change parts (formaatdelen),
// that must fit the variant.
//
// Level 1 (variants): a shift of 420 min, one product per minute while the line
//   runs; n changeovers of 20 min each.  output = 420 − n·20.
//   n = 4 → 340 (−19 %), n = 2 → 380 (the lesson's worked example).
//   Series size (seriegrootte) = output / n: bigger series, fewer changeovers,
//   more stock (the lesson, qualitative).
// Level 2 (linechange): one changeover filmed and split (the lesson's example):
//   searching 15 + swapping 6 change parts with bolts 20 + adjusting 15 = 50 min.
//   SMED step 1: searching becomes external work → 35 min.
//   Step 2: locating pins and quick clamps: swapping 20 → 10, adjusting 15 → 5
//   → 15 min.  At 2 changeovers per shift the line gains 2 × 35 = 70 min.
// Level 3 (mixed): takt 120 s; at station 5 S takes 100 s, M 120 s, L 160 s;
//   mix 50 % S, 30 % M, 20 % L → weighted mean 118 s (the lesson).
//   The operator's lag after each product: lag = max(0, lag + work − takt).
//   Released in groups (L L together): +40 +40 = 80 s behind.
//   With the sequence rule "after every L at least two S": at most 40 s.
//   Above CALL = 60 s the operator is in the next station's zone and calls for
//   help (an assumption for the figure).
// Level 4 (sequencing): takt 25,200 s / 360 = 70 s; A 60 s, B 70 s, C 100 s;
//   day demand 180 : 120 : 60 = 3 : 2 : 1 → pattern A B A C A B, 60 rounds.
//   One round = 3·60 + 2·70 + 100 = 420 s = 6 × 70: balanced.
//   A block of 60 C: 60 × 30 s = 1,800 s = 30 min behind.
//   Switches between variants: blocks 2 a day, pattern 359. With change parts
//   (15 min, the level-2 result) the pattern needs 359 × 15 = 5,385 min > 420:
//   it only works when a switch costs no changeover (flexible automation).
const SHIFT = 420; // min
const L1 = { co: 20, counts: [1, 2, 4, 6] };
const SMED = [
  { key: "now", search: 15, swap: 20, adjust: 15 },
  { key: "ext", search: 0, swap: 20, adjust: 15 },
  { key: "pins", search: 0, swap: 10, adjust: 5 },
];
const L2N = 2; // changeovers per shift at level 2
const MIX = { takt: 120, work: { S: 100, M: 120, L: 160 }, share: { S: 0.5, M: 0.3, L: 0.2 } };
const SEQ3 = {
  groups: ["S", "S", "M", "S", "S", "M", "S", "M", "L", "L"],
  rule: ["L", "S", "S", "M", "S", "M", "L", "S", "S", "M"],
};
const CALL = 60; // s: lag at which the operator calls for help (assumption)
const HJ = { shift: 420, demand: { A: 180, B: 120, C: 60 }, work: { A: 60, B: 70, C: 100 }, pattern: ["A", "B", "A", "C", "A", "B"], co: 15 };
function outputL1(n) { return SHIFT - n * L1.co; }
function smedMin(s) { return s.search + s.swap + s.adjust; }
function meanOf(work, share) { return Object.keys(work).reduce((s, v) => s + work[v] * share[v], 0); }
function lagsOf(seq, work, takt, start = 0) { let lag = start; return seq.map((v) => (lag = Math.max(0, lag + work[v] - takt))); }
function daySeq(mode) {
  if (mode === "pattern") return Array.from({ length: 60 }, () => HJ.pattern).flat();
  return ["A", "B", "C"].flatMap((v) => Array(HJ.demand[v]).fill(v));
}
function switchesOf(seq) { let n = 0; for (let i = 1; i < seq.length; i++) if (seq[i] !== seq[i - 1]) n++; return n; }
const TAKT4 = (HJ.shift * 60) / (HJ.demand.A + HJ.demand.B + HJ.demand.C);
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(outputL1(4), 340, 0, "variants: 420 − 4 × 20 = 340");
  near((4 * 20) / 420, 0.19, 0.005, "variants: 80 / 420 = 19 %");
  near(outputL1(2), 380, 0, "variants: 2 changeovers → 380");
  near(480 - 3 * 25, 405, 0, "variants recall: 480 − 3 × 25 = 405");
  near((4 * 15) / 420, 0.143, 0.0005, "variants recall: 60 / 420 = 14.3 %");
  near(smedMin(SMED[0]), 50, 0, "linechange: 15 + 20 + 15 = 50 min");
  near(smedMin(SMED[1]), 35, 0, "linechange: 50 − 15 = 35 min");
  near(smedMin(SMED[2]), 15, 0, "linechange: 10 + 5 = 15 min");
  near(L2N * (smedMin(SMED[0]) - smedMin(SMED[2])), 70, 0, "linechange: 2 × (50 − 15) = 70 min");
  near(40 - 12, 28, 0, "linechange recall: 40 − 12 = 28");
  near(meanOf(MIX.work, MIX.share), 118, 1e-9, "mixed: weighted mean 118 s");
  near(MIX.work.L - MIX.takt, 40, 0, "mixed: L is 40 s over takt");
  near(Math.max(...lagsOf(SEQ3.groups, MIX.work, MIX.takt)), 80, 0, "mixed: two L in a row → 80 s behind");
  near(MIX.takt - MIX.work.S, 20, 0, "mixed: one S gives back 20 s");
  near(Math.max(...lagsOf([...SEQ3.rule, ...SEQ3.rule], MIX.work, MIX.takt)), 40, 0, "mixed: the rule keeps the lag at 40 s");
  near(0.7 * 48 + 0.3 * 75, 56.1, 1e-9, "mixed recall: 56.1 s");
  for (const seq of Object.values(SEQ3)) {
    near(seq.filter((v) => v === "S").length, 5, 0, "mixed: 50 % S"); near(seq.filter((v) => v === "L").length, 2, 0, "mixed: 20 % L");
  }
  near(TAKT4, 70, 1e-9, "sequencing: 25,200 / 360 = 70 s");
  near(meanOf(HJ.work, { A: 0.5, B: 1 / 3, C: 1 / 6 }), 70, 1e-9, "sequencing: weighted mean 70 s");
  near(HJ.pattern.reduce((s, v) => s + HJ.work[v], 0), 420, 0, "sequencing: one round 420 s");
  near(Math.max(...lagsOf(daySeq("blocks"), HJ.work, TAKT4)), 1800, 0, "sequencing: block of 60 C → 1,800 s behind");
  near(Math.max(...lagsOf(daySeq("pattern"), HJ.work, TAKT4)), 30, 0, "sequencing: the pattern stays within one C");
  near(30 / 10, 3, 0, "sequencing recall: 30 / 10 = 3");
  near(switchesOf(daySeq("blocks")), 2, 0, "sequencing: blocks switch twice");
  near(switchesOf(daySeq("pattern")), 359, 0, "sequencing: pattern switches 359 times");
}

// ---------------------------------------------------------------- the world
// World units are 1 cm, z up, +y toward the operator (front), +x downstream.
// The top of the floor plate is z = 0.
const WIDTH = 600;
const BASE = { x: -124, y: -40, w: 248, d: 68, r: 2 };
const BED = { x0: -112, x1: 112, y: 9, z0: 15, z1: 18 }; // conveyor bed, y half-width
const RAIL = { d: 1.6, h: 3 }; // side rails on the bed
const STN = [-72, -36, 0, 36, 72]; // station centres
const POST_Y = -22;
const ARM_Z = [46, 50];
const TOOL = { r: 3.2, z0: 40.5, z1: 46 };
const PALLET = { w: 15, d: 15, h: 2 };
const PROD = { S: { w: 9, h: 7 }, M: { w: 11, h: 11 }, L: { w: 13, h: 16 } };
const FING = { t: 1.2, x: 5, z0: 36.4, z1: 39.4 };
const GRIP = { y: 9.5, z0: 39.4, z1: 40.5 }; // the gripper slide the fingers hang from
const HMI = { x: -116, y: 17, w: 16, d: 3, z0: 20, z1: 32 };
const CART = { far: [-106, -31], near: [-54, -31], w: 22, d: 10, z0: 6, z1: 8 };
const RACK = { x: 56, y: -37, w: 32, d: 8 };
const RULER = { x0: 70, x1: 112, y: 20, d: 5, max: 120 }; // the lag ruler, 0..120 s
const SPAN = (RULER.x1 - RULER.x0) / RULER.max;
const HBOX = { x: 20, y: 17, w: 22, d: 3, z0: 2, z1: 14 }; // heijunka box (level 4)

const FIT = [
  ...k.boxCorners(BASE, -6, 0),
  [STN[0], POST_Y, 58], [STN[4], POST_Y, 58], [STN[4], 4, ARM_Z[1]], [STN[0], 4, ARM_Z[1]],
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 64);
const ELEVATION = Number(process.env.EL ?? 30);
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
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const plan = (cx, cy, w, d, r = 0.4) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, { order: [], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "", layer = "back" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece: "", move: [0, 0, 0], attrs, layer });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, p, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(p, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(p, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [p.x + p.w / 2, p.y + p.d / 2, (z0 + z1) / 2], svg, [shape], opts);
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
const card = (pts, cls = "mx-card") => `<path class="${cls}" d="${k.pathOf(pts.map(at), true)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(""), { tone: "lo", free: true });

// ---------------------------------------------------------------- floor plate and feet
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -2), -6, 2, P)}"/>`;
for (const [x, y] of k.corners(BASE, 8)) post("stand.foot", x, y, 4, -6, -3.5, { tone: "lo" }, { steps: 24, layer: "floor", ground: true });
{
  const screws = k.corners(BASE, 4);
  // a painted walkway line in front of the line, ending on the plate's inset groove
  const extra =
    L(k.planOutline(k.insetPlan(BASE, 2.6), 0, P, 3), { tone: "faint" }) +
    L(screws.map(([x, y]) => k.ring(x, y, 1.4, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(screws.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.plate", BASE, -3.5, 0, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(BASE, -1.8, P, 3), { tone: "faint" }), extra, layer: "floor", ground: true });
}
// the label plate at the front left, three engraved rule lines
{
  const lp = { x: -78, y: 18, w: 22, d: 8, r: 0.5 };
  box("stand.label", lp, 0, 0.4, { tone: "lo", crease: "none" }, {
    steps: 2,
    layer: "floor",
    extra: L([0, 1, 2].map((i) => k.lineOnTop([lp.x + 2.4, lp.y + 2 + i * 2], [lp.x + 2.4 + [14, 10, 12][i], lp.y + 2 + i * 2], 0.4, P)).join(""), { tone: "lo", free: true }) + Dt(k.corners(lp, 1).map(([x, y]) => at([x, y, 0.4])), { size: 0.3 }),
  });
}
// the lag ruler in front of station 5: 0..120 s, a tick every 10 s, major every 30 s,
// and the call-for-help mark at 60 s
{
  const rs = { x: RULER.x0 - 1.5, y: RULER.y, w: RULER.x1 - RULER.x0 + 3, d: RULER.d, r: 0.3 };
  const ticks = [], major = [];
  for (let s = 0; s <= RULER.max; s += 10) {
    const x = RULER.x0 + s * SPAN;
    (s % 30 === 0 ? major : ticks).push(k.lineOnTop([x, rs.y], [x, rs.y + (s % 30 === 0 ? 3.4 : 1.8)], 0.4, P));
  }
  const callX = RULER.x0 + CALL * SPAN;
  box("stand.ruler", rs, 0, 0.4, { tone: "lo", crease: "none" }, {
    steps: 2,
    layer: "floor",
    extra: L(ticks.join(""), { tone: "mid" }) + L(major.join(""), { tone: "hi" }) + Dt([at([RULER.x0, rs.y + 4.2, 0.4])], { size: 0.45, tone: "hi" }) + `<path class="mx-call" d="${k.pathOf([[callX, rs.y, 0.4], [callX, rs.y + rs.d, 0.4]].map(at))}"/>`,
  });
}

// ---------------------------------------------------------------- the conveyor
{
  const legs = [-104, -54, -18, 18, 54, 104];
  for (const x of legs) {
    for (const y of [-6, 6]) post("conv.leg", x, y, 1.4, 0, BED.z0, { tone: "mid", crease: "none" }, { steps: 12, layer: y < 0 ? "back" : "front", ground: true });
  }
  // cross ties under the bed
  for (const x of legs) box("conv.tie", { x: x - 1, y: -4.6, w: 2, d: 9.2, r: 0.2 }, 6, 8, { tone: "lo" }, { steps: 1 });
  const bed = { x: BED.x0, y: -BED.y, w: BED.x1 - BED.x0, d: 2 * BED.y, r: 0.6 };
  const rollers = [];
  for (let x = BED.x0 + 4; x < BED.x1 - 2; x += 4) rollers.push(k.lineOnTop([x, -BED.y + RAIL.d + 0.4], [x, BED.y - RAIL.d - 0.4], BED.z1, P));
  box("conv.bed", bed, BED.z0, BED.z1, { tone: "mid" }, { steps: 2, bevel: 0.3, inner: L(k.sideSeam(bed, BED.z0 + 1.5, P, 2), { tone: "faint" }), extra: L(rollers.join(""), { tone: "faint" }) });
  box("conv.rail-back", { x: BED.x0, y: -BED.y, w: BED.x1 - BED.x0, d: RAIL.d, r: 0.2 }, BED.z1, BED.z1 + RAIL.h, { tone: "hi", crease: "lo" }, { steps: 1 });
  const fr = { x: BED.x0, y: BED.y - RAIL.d, w: BED.x1 - BED.x0, d: RAIL.d, r: 0.2 };
  const bolts = [];
  for (let x = BED.x0 + 6; x < BED.x1; x += 20) bolts.push(at([x, BED.y, BED.z1 + RAIL.h / 2]));
  box("conv.rail-front", fr, BED.z1, BED.z1 + RAIL.h, { tone: "hi", crease: "lo" }, { steps: 1, layer: "front", extra: Dt(bolts, { size: 0.35 }) });
  // end drums and the drive motor at the outfeed end
  discAt("conv.drum-in", frameY([BED.x0 - 2.2, -BED.y + 0.6, BED.z0 + 1.5]), 0, 2 * BED.y - 1.2, 2.2, { tone: "mid", crease: "none" }, { steps: 20, layer: "front" });
  discAt("conv.drum-out", frameY([BED.x1 + 2.2, -BED.y + 0.6, BED.z0 + 1.5]), 0, 2 * BED.y - 1.2, 2.2, { tone: "mid", crease: "none" }, { steps: 20, layer: "front" });
  box("conv.gearbox", { x: BED.x1 - 9, y: BED.y, w: 7, d: 4, r: 0.4 }, BED.z0 - 6, BED.z1, { tone: "mid" }, { layer: "front", bevel: 0.3, extra: Dt([at([BED.x1 - 7.5, BED.y + 4, BED.z1 - 1.5]), at([BED.x1 - 3.5, BED.y + 4, BED.z1 - 1.5])], { size: 0.35 }) });
  discAt("conv.motor", frameY([BED.x1 - 5.5, BED.y + 4, BED.z0 - 2.5]), 0, 8, 2.6, { tone: "hi", crease: "lo" }, { steps: 20, layer: "front", extra: Dt([at([BED.x1 - 5.5, BED.y + 12, BED.z0 - 2.5])], { size: 0.4, tone: "hi" }) });
}

// ---------------------------------------------------------------- the five stations
STN.forEach((sx, i) => {
  const slow = i === 4;
  post("stn.base", sx, POST_Y, 4, 0, 1.4, { tone: "lo" }, { steps: 24, bevel: 0.3, extra: Dt([at([sx - 3, POST_Y, 1.4]), at([sx + 3, POST_Y, 1.4])], { size: 0.4 }) });
  post("stn.post", sx, POST_Y, 2, 1.4, ARM_Z[0], { tone: "mid", crease: "none" }, { steps: 20, inner: L(k.sideArc(sx, POST_Y, 2, 12, P, 16), { tone: "faint" }) });
  const arm = { x: sx - 2.5, y: POST_Y - 2.5, w: 5, d: -POST_Y + 5, r: 0.5 };
  box("stn.arm", arm, ARM_Z[0], ARM_Z[1], { tone: slow ? "hi" : "mid", crease: "lo" }, { layer: "front", bevel: 0.3, extra: Dt([at([sx, POST_Y, ARM_Z[1]]), at([sx, 0, ARM_Z[1]])], { size: 0.4 }) });
  box("stn.gripper", { x: sx - 3.2, y: -GRIP.y, w: 6.4, d: 2 * GRIP.y, r: 0.4 }, GRIP.z0, GRIP.z1, { tone: "mid" }, { layer: "front", steps: 2, inner: L(k.sideSeam({ x: sx - 3.2, y: -GRIP.y, w: 6.4, d: 2 * GRIP.y, r: 0.4 }, GRIP.z0 + 0.5, P, 2), { tone: "faint" }), extra: Dt([at([sx, -GRIP.y + 1.4, GRIP.z1]), at([sx, GRIP.y - 1.4, GRIP.z1])], { size: 0.35 }) });
  post("stn.tool", sx, 0, TOOL.r, TOOL.z0, TOOL.z1, { tone: "hi", crease: "lo" }, { layer: "front", steps: 24, inner: L(k.sideArc(sx, 0, TOOL.r, TOOL.z1 - 1.6, P, 20), { tone: "faint" }) });
  // the station number plate on the post: i + 1 dots
  box("stn.plate", { x: sx - 2.5, y: POST_Y + 2, w: 5, d: 0.6, r: 0.1 }, 26, 32, { tone: "lo" }, { steps: 1, extra: Dt(Array.from({ length: i + 1 }, (_, n) => at([sx - 1.6 + n * 0.8, POST_Y + 2.6, 29])), { size: 0.3, tone: "hi" }) });
});
// station 5: the andon lamp on top of its post
{
  const sx = STN[4];
  post("stn.lamp-base", sx, POST_Y, 2.4, ARM_Z[1], ARM_Z[1] + 1.4, { tone: "mid" }, { layer: "front", steps: 20 });
  post("stn.lamp", sx, POST_Y, 1.9, ARM_Z[1] + 1.4, ARM_Z[1] + 6.4, { tone: "mid", crease: "lo" }, { layer: "front", steps: 20, attrs: ' data-lamp=""' });
  post("stn.lamp-cap", sx, POST_Y, 2.1, ARM_Z[1] + 6.4, ARM_Z[1] + 7.2, { tone: "mid" }, { layer: "front", steps: 20, extra: Dt([at([sx, POST_Y, ARM_Z[1] + 7.2])], { size: 0.4, tone: "hi" }) });
}
// the sequenced-supply rack behind stations 4 and 5: a frame with two shelves of kits
{
  const { x, y, w, d } = RACK;
  for (const px of [x + 1, x + w - 1]) for (const py of [y + 1, y + d - 1]) post("rack.post", px, py, 0.9, 0, 30, { tone: "mid", crease: "none" }, { steps: 10 });
  for (const z of [10, 22]) {
    const shelf = { x: x + 1.9, y, w: w - 3.8, d, r: 0.3 };
    box("rack.shelf", shelf, z, z + 1.2, { tone: "mid" }, { steps: 1 });
    // kit bins on the shelf, in the build order
    for (let n = 0; n < 4; n++) {
      const kb = { x: x + 2.2 + n * 7.2, y: y + 1.2, w: 6, d: d - 2.4, r: 0.3 };
      box("rack.kit", kb, z + 1.2, z + 5, { tone: n === 2 ? "hi" : "lo", crease: "lo" }, { steps: 1, extra: card([[kb.x + 1, kb.y + kb.d, z + 4.2], [kb.x + kb.w - 1, kb.y + kb.d, z + 4.2], [kb.x + kb.w - 1, kb.y + kb.d, z + 2.4], [kb.x + 1, kb.y + kb.d, z + 2.4]]) });
    }
  }
}

// ---------------------------------------------------------------- the operator panel (recipe screen)
{
  const cx = HMI.x + HMI.w / 2;
  post("hmi.base", cx, HMI.y + 1.5, 4, 0, 1.2, { tone: "lo" }, { steps: 24, bevel: 0.3, layer: "front" });
  post("hmi.post", cx, HMI.y + 1.5, 1.4, 1.2, HMI.z0, { tone: "mid", crease: "none" }, { steps: 16, layer: "front" });
  const fy = HMI.y + HMI.d;
  const screen = [[HMI.x + 1.6, fy, HMI.z1 - 1.6], [HMI.x + HMI.w - 1.6, fy, HMI.z1 - 1.6], [HMI.x + HMI.w - 1.6, fy, HMI.z0 + 3], [HMI.x + 1.6, fy, HMI.z0 + 3]];
  box("hmi.body", { x: HMI.x, y: HMI.y, w: HMI.w, d: HMI.d, r: 0.5 }, HMI.z0, HMI.z1, { tone: "mid" }, {
    layer: "front",
    bevel: 0.4,
    extra: card(screen, "mx-screen") + rules(HMI.x + 3, fy, HMI.z1 - 3, [7, 5]) +
      [0, 1, 2].map((n) => `<path class="mx-cell" data-cell="${n}" d="${k.pathOf([[HMI.x + 3 + n * 3.6, fy, HMI.z0 + 7], [HMI.x + 5.8 + n * 3.6, fy, HMI.z0 + 7], [HMI.x + 5.8 + n * 3.6, fy, HMI.z0 + 4.4], [HMI.x + 3 + n * 3.6, fy, HMI.z0 + 4.4]].map(at), true)}"/>`).join("") +
      Dt([[HMI.x + HMI.w - 3, fy, HMI.z0 + 1.5], [HMI.x + HMI.w - 5, fy, HMI.z0 + 1.5]].map(at), { size: 0.4 }),
  });
}

// ---------------------------------------------------------------- the change-part cart (moves live: data-cart)
const cartSvg = (() => {
  const [cx, cy] = CART.far;
  const p = plan(cx, cy, CART.w, CART.d, 0.5);
  let out = "";
  for (const [x, y] of k.corners(p, 2)) out += S(k.cylinder(x, y, 1.6, 0, 1.6, P, 14), { tone: "lo" });
  for (const [x, y] of k.corners(p, 2)) out += S(k.cylinder(x, y, 0.6, 1.6, CART.z0, P, 10), { tone: "mid", crease: "none" });
  out += S(k.slabOf(p, CART.z0, CART.z1 - CART.z0, P, 2, 0.3), { tone: "mid" });
  out += S(k.slabOf({ x: p.x - 1.2, y: cy - 4, w: 1.2, d: 8, r: 0.2 }, CART.z1, 10, P, 1), { tone: "mid" });
  // two spare finger sets (change parts), one per other variant
  for (const [n, w] of [[0, 4], [1, 5]]) {
    const fx = p.x + 6 + n * 9;
    out += S(k.slabOf(plan(fx, cy, 6, w, 0.3), CART.z1, CART.z1 + 2 - CART.z1, P, 1), { tone: "hi", crease: "lo" });
    out += S(k.slabOf(plan(fx, cy, 2, 2, 0.2), CART.z1 + 2, 1.2, P, 1), { tone: "lit", lit: true });
  }
  return out;
})();
R.solid(A.slab(plan(...CART.far, CART.w, CART.d), CART.z0, CART.z1 - CART.z0, { name: "cart.top", ground: true }));

// ---------------------------------------------------------------- the heijunka box (level 4)
{
  const fy = HBOX.y + HBOX.d;
  const slots = [];
  for (let n = 0; n < 6; n++) slots.push(k.pathOf([[HBOX.x + 1.4 + n * 3.4, fy, HBOX.z1 - 2], [HBOX.x + 4.2 + n * 3.4, fy, HBOX.z1 - 2], [HBOX.x + 4.2 + n * 3.4, fy, HBOX.z0 + 2], [HBOX.x + 1.4 + n * 3.4, fy, HBOX.z0 + 2]].map(at), true));
  box("hj.box", { x: HBOX.x, y: HBOX.y, w: HBOX.w, d: HBOX.d, r: 0.3 }, HBOX.z0, HBOX.z1, { tone: "mid" }, { layer: "front", attrs: ' data-l4=""', extra: `<path class="mx-slot" d="${slots.join("")}"/><g data-cards=""></g>` });
  box("hj.foot", { x: HBOX.x + 1, y: HBOX.y - 2, w: HBOX.w - 2, d: HBOX.d + 4, r: 0.3 }, 0, HBOX.z0, { tone: "lo" }, { layer: "front", steps: 1, attrs: ' data-l4=""' });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
if (process.env.ORDER) console.log(R.items.slice().sort((a, b) => a.key - b.key).map((i, n) => n + " " + i.layer + " " + i.name).join("\n"));
const body = [
  halo,
  ...layerOf("floor"),
  `<g data-cart="">${cartSvg}</g>`,
  ...layerOf("back"),
  `<g data-carriers=""></g>`,
  `<g data-fingers=""></g>`,
  ...layerOf("front"),
  `<g data-pointer=""></g>`,
  `<g data-mark=""></g>`,
];

const LABEL_NL =
  "Een getakte montagelijn met vijf stations boven een rollenbaan. Dragers met producten in drie varianten, klein, middel en groot, schuiven per takt een station verder. Elk station heeft grijpvingers die bij de variant moeten passen: de formaatdelen. Links staat het bedieningsscherm met het recept en een kar met formaatdelen, achter station 4 en 5 een rek met kits in bouwvolgorde. Station 5 heeft een andonlamp en vooraan een liniaal die de achterstand van de operator in seconden laat zien.";
const LABEL_EN =
  "A paced assembly line with five stations over a roller conveyor. Carriers with products in three variants, small, medium and large, move one station on every takt. Each station has grip fingers that must fit the variant: the change parts. On the left are the operator panel with the recipe and a cart with change parts, behind stations 4 and 5 a rack of kits in build order. Station 5 has an andon lamp and, at the front, a ruler that shows the operator's lag in seconds.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "carrier", live: "carrier" },
  { key: "fingers", at: [STN[2], 0, FING.z0] },
  { key: "station", at: [STN[1], POST_Y, 30] },
  { key: "conveyor", at: [-30, BED.y, BED.z0 + 1] },
  { key: "hmi", at: [HMI.x + HMI.w / 2, HMI.y + HMI.d, 27] },
  { key: "cart", live: "cart" },
  { key: "rack", at: [RACK.x + 16, RACK.y + RACK.d, 18] },
  { key: "lamp", at: [STN[4], POST_Y, ARM_Z[1] + 4] },
  { key: "ruler", at: [RULER.x0 + 18, RULER.y + 2, 0] },
  { key: "drive", at: [BED.x1 - 5.5, BED.y + 8, BED.z0 - 2.5] },
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
  --mx-hair:rgba(240,233,218,.12);--mx-accent:#5C9FAE;--mx-hole:#071A1E;--mx-glass:#0A2228;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --mx-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --mx-hair:rgba(11,41,27,.14);--mx-accent:#276F81;--mx-hole:#D5CCB6;--mx-glass:#DCE7E4;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--mx-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:1;--lines:4;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--mx-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="4"] .iso-plate{--rows:2}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--mx-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.mx-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mx-acc{color:var(--mx-accent);font-weight:600}
.mx-strong{color:var(--anatomy-strong);font-weight:600}
.mx-mute{color:var(--anatomy-muted)}
.mx-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.mx-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.mx-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.mx-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.mx-row{display:flex;gap:4px;height:44px;align-items:center}
.mx-row[hidden]{display:none}
.mx-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--mx-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--mx-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.mx-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.mx-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--mx-accent);color:var(--mx-accent);font-weight:600}
.mx-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mx-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mx-screen{fill:var(--mx-glass);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mx-slot{fill:var(--mx-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mx-cell{fill:var(--mx-glass);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mx-cell[data-on]{fill:var(--mx-accent);stroke:var(--mx-accent)}
.mx-kcard{stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round;fill:var(--anatomy-face)}
.mx-kcard[data-v="C"]{fill:var(--mx-accent);stroke:var(--mx-accent)}
.mx-kcard[data-v="B"]{fill:var(--anatomy-mid)}
.mx-call{fill:none;stroke:var(--mx-accent);stroke-width:1.2px;stroke-linecap:round}
.mx-ptr{fill:var(--mx-accent);stroke:var(--mx-accent);stroke-width:.8px;stroke-linejoin:round}
.mx-ptr-line{fill:none;stroke:var(--mx-accent);stroke-width:1.4px;stroke-linecap:round}
.mx-mark{fill:none;stroke:var(--mx-accent);stroke-width:1.4px}
.mx-mark-dot{fill:var(--mx-accent);stroke:none}
[data-l4]{display:none}
html[data-level="4"] [data-l4]{display:inline}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .15s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--mx-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const SHIFT = ${SHIFT}, L1 = ${JSON.stringify(L1)}, SMED = ${JSON.stringify(SMED)}, L2N = ${L2N};
const MIX = ${JSON.stringify(MIX)}, SEQ3 = ${JSON.stringify(SEQ3)}, CALL = ${CALL}, HJ = ${JSON.stringify(HJ)}, TAKT4 = ${TAKT4};
const STN = ${JSON.stringify(STN)}, BED = ${JSON.stringify(BED)}, PALLET = ${JSON.stringify(PALLET)}, PROD = ${JSON.stringify(PROD)}, FING = ${JSON.stringify(FING)};
const CART = ${JSON.stringify(CART)}, RULER = ${JSON.stringify(RULER)}, SPAN = ${SPAN}, HBOX = ${JSON.stringify(HBOX)};
const PARTS = ${JSON.stringify(PARTS)};
${outputL1.toString()}
${smedMin.toString()}
${meanOf.toString()}
${lagsOf.toString()}
${daySeq.toString()}
${switchesOf.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",",
      co: "changeover", stop: "standstill", out: "output", mach: "products", loss: "", series: "batch size", seriesT: "bigger: fewer changeovers, more stock",
      changing: "changing over: the line stands still", runs: "running",
      search: "search", swap: "swap", adjust: "adjust", perShift: "per shift", gain: "gain vs now",
      takt: "takt", mean: "average", seq: "sequence", lag: "lag now", max: "max", help: "operator calls for help", ok: "the operator keeps up",
      groupsT: "L L in a row: +40 +40 = 80 s; one S gives back only 20", ruleT: "rule: after every L at least two S (2 × 20 = 40 s back)",
      pattern: "pattern", blocks: "blocks", round: "every round", balanced: "balanced", blockC: "C block", behind: "behind", overtime: "overtime",
      switches: "switches a day", recipe: "recipe: 0 min a switch → possible", cant: "does not fit", fits: "fits",
      tapPart: "tap a part to name it",
      parts: { carrier: ["Carrier (pallet)", "carries one product; three variants S, M, L"], fingers: ["Change part (grip fingers)", "differs per variant: swapped at a changeover"], station: ["Station", "one step of the work, one takt per product"], conveyor: ["Conveyor", "moves every carrier one station on per takt"], hmi: ["Operator panel (recipe)", "loads the settings for the next variant"], cart: ["Change-part cart", "the parts for the next variant, ready beside the line"], rack: ["Sequenced supply", "kits arrive in the same order as the products"], lamp: ["Andon lamp", "the operator calls for help"], ruler: ["Lag ruler", "how far station 5's operator runs behind"], drive: ["Drive", "motor and gearbox: the line's takt"] } }
  : { dec: ",", grp: ".",
      co: "omstellen", stop: "stilstand", out: "output", mach: "producten", loss: "", series: "seriegrootte", seriesT: "groter: minder omstellen, meer voorraad",
      changing: "omstellen: de lijn staat stil", runs: "draait",
      search: "zoeken", swap: "wisselen", adjust: "bijstellen", perShift: "per dienst", gain: "winst t.o.v. nu",
      takt: "takt", mean: "gemiddeld", seq: "volgorde", lag: "achterstand nu", max: "max", help: "operator roept hulp", ok: "de operator houdt het bij",
      groupsT: "L L achter elkaar: +40 +40 = 80 s; één S geeft maar 20 terug", ruleT: "regel: na elke L minstens twee S (2 × 20 = 40 s terug)",
      pattern: "patroon", blocks: "blokken", round: "elke ronde", balanced: "in balans", blockC: "C-blok", behind: "achter", overtime: "overuren",
      switches: "wissels per dag", recipe: "recept: 0 min per wissel → kan", cant: "past niet", fits: "past",
      tapPart: "tik een onderdeel voor de naam",
      parts: { carrier: ["Drager (pallet)", "draagt één product; drie varianten S, M, L"], fingers: ["Formaatdeel (grijpvingers)", "verschilt per variant: wisselen bij omstellen"], station: ["Station", "één stap van het werk, één takt per product"], conveyor: ["Rollenbaan", "schuift elke drager per takt een station verder"], hmi: ["Bedieningsscherm (recept)", "laadt de instellingen voor de volgende variant"], cart: ["Kar met formaatdelen", "de delen voor de volgende variant, klaar naast de lijn"], rack: ["Aanvoer in volgorde", "kits komen in dezelfde volgorde als de producten"], lamp: ["Andonlamp", "de operator roept om hulp"], ruler: ["Achterstandsliniaal", "hoe ver de operator van station 5 achterloopt"], drive: ["Aandrijving", "motor en tandwielkast: de takt van de lijn"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const grp = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);

const stage = document.querySelector(".mx-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { carriers: q("[data-carriers]"), fingers: q("[data-fingers]"), pointer: q("[data-pointer]"), mark: q("[data-mark]"), lamp: q("[data-lamp]"), cart: q("[data-cart]"), cards: q("[data-cards]"), cells: [...svg.querySelectorAll("[data-cell]")] };
const lines = [...document.querySelectorAll("[data-readout] .mx-line")];
const announcer = document.querySelector(".mx-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => t * t * (3 - 2 * t);
const at = (p) => iso(p, P);
const f2 = (v) => v.toFixed(2);

// ------------------------------------------------ state
const st = { n: 4, smed: "now", seq: "groups", hj: "blocks", sw: "recipe" };
const NAMES = LVL === 4 ? { S: "A", M: "B", L: "C" } : { S: "S", M: "M", L: "L" };
const FROM4 = { A: "S", B: "M", C: "L" };
// the order in which carriers enter the line (looping), and changeovers
function feed() {
  if (LVL === 1) { const run = { 1: 12, 2: 8, 4: 5, 6: 3 }[st.n]; return ["S", "M", "L"].flatMap((v) => Array(run).fill(v)); }
  if (LVL === 2) return ["S", "M", "L"].flatMap((v) => Array(6).fill(v));
  if (LVL === 3) return SEQ3[st.seq];
  // level 4: the pattern, or blocks scaled 3 : 2 : 1 (the day has 180 : 120 : 60)
  if (st.hj === "pattern") return HJ.pattern.map((v) => FROM4[v]);
  return ["S", "M", "L"].flatMap((v, i) => Array([9, 6, 3][i]).fill(v));
}
function coMinutes() { return LVL === 1 ? L1.co : LVL === 2 ? smedMin(SMED.find((s) => s.key === st.smed)) : LVL === 4 && st.sw === "parts" ? HJ.co : 0; }
const PITCH = STN[1] - STN[0];
const SLOTS = 8; // slot 0 waits at the infeed, 1..5 are the stations, 6 at the outfeed, 7 has left
let seq = feed(), next = 0, line = [], prevLine = [], clock = 0, phase = "dwell", phaseT = 0, coLeft = 0, grip = "S", gripFrom = "S", gripT = 1;
let lag = 0, lagShown = 0, maxLag = 0, lastV = "";
const MOVE = 0.55, DWELL = 0.6, CO_SCALE = 0.09; // seconds on screen; 1 min of changeover = 0.09 s
function reset() {
  seq = feed(); next = 0; prevLine = []; lag = 0; lagShown = 0; maxLag = 0; phase = "dwell"; phaseT = 0; coLeft = 0;
  // fill the line so it looks running: slot j holds seq[next - 1 - j] (slot 0 entered last)
  const n = seq.length, mod = (i) => ((i % n) + n) % n;
  line = [];
  for (let j = 0; j < SLOTS; j++) line.push(j < SLOTS - 1 ? { v: LVL <= 2 ? seq[0] : seq[mod(-1 - j)] } : null);
  grip = seq[0]; gripFrom = grip; gripT = 1;
  if (LVL >= 3) {
    // the operator's lag in steady state, as the carrier now at station 5 left it
    const work = LVL === 4 ? Object.fromEntries(Object.entries(HJ.work).map(([v, w]) => [FROM4[v], w])) : MIX.work;
    const lags = lagsOf(seq.concat(seq), work, LVL === 4 ? TAKT4 : MIX.takt);
    lag = lags[n + mod(-6)]; lagShown = lag; maxLag = Math.max(...lags);
  }
}
function step(empty) {
  // index: everything moves one slot downstream, a new carrier enters (or a gap)
  prevLine = line.slice();
  line.pop();
  if (empty) line.unshift(null);
  else { line.unshift({ v: seq[next % seq.length] }); next++; }
  // the carrier arriving at station 5 (slot 5) sets the operator's lag
  const at5 = line[5];
  if (at5 && LVL >= 3) {
    const work = LVL === 4 ? HJ.work[NAMES[at5.v]] : MIX.work[at5.v];
    const takt = LVL === 4 ? TAKT4 : MIX.takt;
    lag = Math.max(0, lag + work - takt);
    lastV = at5.v;
    readout(); announce();
  }
}
// levels 1 and 2: before a changeover the old variant runs out of the line, then
// the line stands still while the change parts are swapped
function nextIsOther() { return LVL <= 2 && seq[next % seq.length] !== grip; }
// level 4 with change parts: every switch between variants stops the line
function switchDue() { return LVL === 4 && st.sw === "parts" && line[0] && seq[next % seq.length] !== line[0].v; }
function oldOnLine() { return line.slice(0, 6).some((c) => c && c.v === grip); }
function tickState(dt) {
  phaseT += dt;
  if (phase === "move" && phaseT >= MOVE) { phase = "dwell"; phaseT = 0; }
  else if (phase === "dwell" && phaseT >= DWELL) {
    if (switchDue()) { phase = "co"; phaseT = 0; coLeft = coMinutes() * CO_SCALE; }
    else if (nextIsOther() && !oldOnLine()) { phase = "co"; phaseT = 0; coLeft = coMinutes() * CO_SCALE; gripFrom = grip; grip = seq[next % seq.length]; gripT = 0; readout(); announce(); }
    else { step(nextIsOther()); phase = "move"; phaseT = 0; }
  } else if (phase === "co") {
    gripT = clamp(phaseT / coLeft, 0, 1);
    if (phaseT >= coLeft) { step(false); phase = "move"; phaseT = 0; readout(); announce(); }
  }
  lagShown += (lag - lagShown) * (1 - Math.exp(-dt * 6));
}

// ------------------------------------------------ drawing
function rect(cx, cy, w, d) { return [[cx - w / 2, cy - d / 2], [cx + w / 2, cy - d / 2], [cx + w / 2, cy + d / 2], [cx - w / 2, cy + d / 2]]; }
function carrierSvg(x, v, op) {
  const z = BED.z1;
  let out = solidSvg(extrude(rect(x, 0, PALLET.w, PALLET.d), z, PALLET.h, P), { tone: "mid" });
  const p = PROD[v];
  const tone = v === "S" ? { tone: "mid" } : v === "M" ? { tone: "hi", crease: "lo" } : { tone: "hi", crease: "lo", lit: true };
  out += solidSvg(extrude(rect(x, 0, p.w, p.w), z + PALLET.h, p.h, P), tone);
  // the carrier's two locating holes
  out += '<path class="mx-slot" d="' + ring(x - 5, -5, 0.8, z + PALLET.h, P, 10) + ring(x + 5, 5, 0.8, z + PALLET.h, P, 10) + '"/>';
  return '<g opacity="' + op.toFixed(3) + '">' + out + "</g>";
}
function carrierX(i) {
  // slot i sits at x = -120 + i * 40; during "move" everything slides from slot i-1
  const f = phase === "move" ? ease(clamp(phaseT / MOVE, 0, 1)) : 1;
  return STN[0] + (i - 2 + f) * PITCH;
}
function fingerW(i) {
  if (LVL <= 2) { const a = PROD[gripFrom].w, b = PROD[grip].w; return a + (b - a) * ease(gripT); }
  // mixed line: every station's fingers fit the carrier under them (servo fingers)
  const wOf = (c) => (c ? PROD[c.v].w : PROD.M.w);
  const b = wOf(line[i + 1]);
  if (phase !== "move") return b;
  return wOf(prevLine[i]) + (b - wOf(prevLine[i])) * ease(clamp(phaseT / MOVE, 0, 1));
}
function draw() {
  let out = "";
  const items = [];
  line.forEach((c, i) => { if (!c) return; const x = carrierX(i); const op = clamp(1 - Math.max(0, Math.abs(x) - 110) / 18, 0, 1); if (op > 0.01) items.push([x, carrierSvg(x, c.v, op)]); });
  items.sort((a, b) => a[0] - b[0]);
  out = items.map((t) => t[1]).join("");
  if (el.carriers.innerHTML !== out) el.carriers.innerHTML = out;
  // grip fingers at every station: the gap follows the product width
  let fo = "";
  STN.forEach((sx, i) => {
    const g = fingerW(i) / 2 + 0.3;
    for (const side of [-1, 1]) {
      const y = side * (g + FING.t / 2);
      fo += solidSvg(extrude(rect(sx, y, FING.x, FING.t), FING.z0, FING.z1 - FING.z0, P), { tone: "hi", crease: "lo" });
    }
  });
  el.fingers.innerHTML = fo;
  // the lag pointer on the ruler (levels 3 and 4)
  if (LVL >= 3) {
    const s = clamp(lagShown, 0, RULER.max);
    const x = RULER.x0 + s * SPAN;
    const a = at([x, RULER.y - 0.6, 0.4]), b = at([x, RULER.y + RULER.d + 0.6, 0.4]);
    const t1 = at([x - 2.2, RULER.y + RULER.d + 3.6, 0.4]), t2 = at([x + 2.2, RULER.y + RULER.d + 3.6, 0.4]);
    el.pointer.innerHTML = '<path class="mx-ptr-line" d="M' + f2(a[0]) + " " + f2(a[1]) + "L" + f2(b[0]) + " " + f2(b[1]) + '"/><path class="mx-ptr" d="M' + f2(b[0]) + " " + f2(b[1]) + "L" + f2(t1[0]) + " " + f2(t1[1]) + "L" + f2(t2[0]) + " " + f2(t2[1]) + 'Z"/>';
    if (lagShown > CALL || phase === "co") el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  } else {
    el.pointer.innerHTML = "";
    if (phase === "co") el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  }
  // the recipe screen: one cell per variant, lit for the running one
  const idx = { S: 0, M: 1, L: 2 }[grip];
  el.cells.forEach((c, i) => { if (i === idx) c.setAttribute("data-on", ""); else c.removeAttribute("data-on"); });
  // the change-part cart: far away now, beside the line once its trip is external work
  const near = LVL === 2 && st.smed !== "now";
  const dx = near ? CART.near[0] - CART.far[0] : 0, dy = near ? CART.near[1] - CART.far[1] : 0;
  el.cart.setAttribute("transform", translateAlong(P, [dx, dy, 0]));
  if (marked >= 0) {
    const [x, y] = at(livePoint(PARTS[marked]));
    el.mark.innerHTML = '<circle class="mx-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="mx-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
}
function drawCards() {
  if (!el.cards) return;
  const pat = st.hj === "pattern" ? HJ.pattern : ["A", "A", "A", "B", "B", "C"];
  const fy = HBOX.y + HBOX.d + 0.05;
  el.cards.innerHTML = pat.map((v, n) => {
    const x0 = HBOX.x + 1.8 + n * 3.4, x1 = x0 + 2;
    const z1 = HBOX.z1 - 1.2, z0 = HBOX.z1 - 6;
    const pts = [[x0, fy, z1], [x1, fy, z1], [x1, fy, z0], [x0, fy, z0]].map(at);
    return '<path class="mx-kcard" data-v="' + v + '" d="M' + pts.map((p) => f2(p[0]) + " " + f2(p[1])).join("L") + 'Z"/>';
  }).join("");
}
let marked = -1;
function livePoint(p) {
  if (p.live === "carrier") {
    let best = null;
    line.forEach((c, i) => { if (c) { const x = carrierX(i); if (!best || Math.abs(x - STN[1]) < Math.abs(best - STN[1])) best = x; } });
    return [best ?? STN[1], 7, BED.z1 + 1];
  }
  if (p.live === "cart") {
    const near = LVL === 2 && st.smed !== "now";
    const c = near ? CART.near : CART.far;
    return [c[0], c[1] + CART.d / 2, CART.z1];
  }
  return p.at;
}

// ------------------------------------------------ readout
const acc = (s) => '<span class="mx-acc">' + s + "</span>";
const strong = (s) => '<span class="mx-strong">' + s + "</span>";
const mute = (s) => '<span class="mx-mute">' + s + "</span>";
function seqLine(sq) {
  const cur = (next - 6 + sq.length * 100) % sq.length; // the product now at station 5
  return sq.map((v, i) => (i === cur ? acc(NAMES[v]) : NAMES[v])).join(" ");
}
function readout() {
  const out = [];
  if (LVL === 1) {
    const stop = st.n * L1.co, o = outputL1(st.n);
    out.push(st.n + " × " + T.co + " × " + L1.co + " min = " + strong(stop + " min") + " " + T.stop);
    out.push(T.out + ": " + SHIFT + " − " + stop + " = " + acc(o + " " + T.mach) + " (−" + Math.round((stop / SHIFT) * 100) + " %)");
    out.push(T.series + " " + strong(String(Math.round(o / st.n))) + " · " + mute(T.seriesT));
  } else if (LVL === 2) {
    const s = SMED.find((x) => x.key === st.smed), m = smedMin(s), m0 = smedMin(SMED[0]);
    out.push(T.co + ": " + T.search + " " + s.search + " + " + T.swap + " " + s.swap + " + " + T.adjust + " " + s.adjust + " = " + strong(m + " min"));
    out.push(L2N + " × " + T.perShift + " = " + L2N * m + " min " + T.stop + " · " + T.out + " " + acc(String(SHIFT - L2N * m)));
    out.push(T.gain + ": " + L2N + " × " + (m0 - m) + " = " + acc(L2N * (m0 - m) + " min"));
  } else if (LVL === 3) {
    out.push(T.takt + " " + MIX.takt + " s · S " + MIX.work.S + " · M " + MIX.work.M + " · L " + MIX.work.L + " · " + T.mean + " " + fmt(meanOf(MIX.work, MIX.share), 0) + " s");
    out.push(T.seq + ": " + seqLine(SEQ3[st.seq]));
    const mx = Math.max(...lagsOf([...SEQ3[st.seq], ...SEQ3[st.seq]], MIX.work, MIX.takt));
    out.push(T.lag + " " + strong(Math.round(lag) + " s") + " · " + T.max + " " + mx + " s → " + (mx > CALL ? strong(T.help) : acc(T.ok)));
    out.push(mute(st.seq === "groups" ? T.groupsT : T.ruleT));
  } else {
    const ds = daySeq(st.hj), sw = switchesOf(ds), mx = Math.max(...lagsOf(ds, HJ.work, TAKT4));
    out.push(T.takt + " " + TAKT4 + " s · A " + HJ.work.A + " · B " + HJ.work.B + " · C " + HJ.work.C + " · " + T.pattern + " " + HJ.pattern.join(" "));
    out.push(st.hj === "pattern"
      ? T.round + ": 3×" + HJ.work.A + " + 2×" + HJ.work.B + " + " + HJ.work.C + " = 420 s = 6 × " + TAKT4 + " → " + acc(T.balanced)
      : T.blockC + ": " + HJ.demand.C + " × " + (HJ.work.C - TAKT4) + " s = " + grp(mx) + " s = " + strong(mx / 60 + " min " + T.behind) + " → " + T.overtime);
    out.push(T.switches + ": " + strong(String(sw)) + " · " + T.lag + " " + Math.round(lag) + " s");
    out.push(st.sw === "recipe" ? acc(T.recipe) : sw + " × " + HJ.co + " min = " + grp(sw * HJ.co) + " min " + (sw * HJ.co > HJ.shift ? "> " + HJ.shift + " → " + strong(T.cant) : "≤ " + HJ.shift + " → " + acc(T.fits)));
  }
  if (LVL <= 2) out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : phase === "co" ? acc(T.changing) : mute(T.tapPart));
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }

// ------------------------------------------------ loop
let frame = 0, lastT = 0, visible = false;
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  tickState(dt);
  draw();
  if (LVL >= 3 && Math.floor(now / 250) !== Math.floor((now - dt * 1000) / 250)) readout();
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { lastT = 0; frame = requestAnimationFrame(tick); } };
function restill() {
  // reduced motion: one telling still. Levels 1 and 2: halfway through a changeover,
  // the line empty; levels 3 and 4: the moment of the largest lag
  reset();
  if (LVL <= 2) {
    for (let i = 0; i < 4000 && phase !== "co"; i++) tickState(0.05);
    phaseT = coLeft / 2; gripT = 0.5;
  } else {
    for (let i = 0; i < seq.length * 2; i++) { step(false); if (lag >= maxLag - 1e-9) break; }
    phase = "dwell"; phaseT = 0; lagShown = lag;
  }
  draw(); readout(); announce();
}

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll(".mx-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
}
function changed() {
  sync(); reset(); drawCards(); readout(); announce();
  if (still.matches) restill(); else { draw(); run(); }
}
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  st[key] = key === "n" ? Number(val) : val;
  changed();
}));
document.querySelectorAll("[role='radiogroup']").forEach((group) => {
  group.addEventListener("keydown", (event) => {
    const items = [...group.querySelectorAll('[role="radio"]')];
    const i = items.findIndex((b) => b.getAttribute("aria-checked") === "true");
    let nx = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nx = (i + 1) % items.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nx = (i + items.length - 1) % items.length;
    if (nx < 0) return;
    event.preventDefault(); event.stopPropagation();
    items[nx].click(); items[nx].focus();
  });
});

// tap the drawing: at levels 1 and 2 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 70;
  PARTS.forEach((p, i) => { const [px, py] = at(livePoint(p)); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) return;
  marked = nearestPart(toView(event));
  draw(); readout(); announce();
});
stage.addEventListener("keydown", (event) => {
  if (LVL > 2) return;
  let handled = true;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") marked = (marked + 1) % PARTS.length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") marked = (marked + PARTS.length - 1) % PARTS.length;
  else handled = false;
  if (handled) { event.preventDefault(); draw(); readout(); announce(); }
});

// ------------------------------------------------ start
reset();
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) restill(); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { cancelAnimationFrame(frame); frame = 0; restill(); } else { reset(); run(); } });
sync();
drawCards();
readout();
if (still.matches) restill(); else draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Varianten en omstellen",
    hint1: "Tik een onderdeel · kies hoe vaak de lijn omstelt",
    hint2: "Tik een onderdeel · kies de SMED-stap",
    hint3: "Kies de volgorde · kijk naar station 5",
    hint4: "Kies blokken of patroon · en hoe een wissel gaat",
    per: "Omstellen per dienst",
    smed: "SMED-stap", now: "Nu: 50 min", ext: "Extern", pins: "Paspennen",
    seq: "Volgorde", groups: "Groepjes L", rule: "Volgorderegel",
    hj: "Bouwvolgorde", blocks: "Blokken", pattern: "Patroon",
    sw: "Wissel", recipe: "Recept 0 min", parts: "Formaatdelen 15 min",
    label: LABEL_NL,
    aria: "Montagelijn met vijf stations en dragers in drie varianten. Niveau 1 en 2: pijltjes kiezen een onderdeel.",
  },
  en: {
    title: "Variants and changeover",
    hint1: "Tap a part · pick how often the line changes over",
    hint2: "Tap a part · pick the SMED step",
    hint3: "Pick the sequence · watch station 5",
    hint4: "Pick blocks or pattern · and how a switch works",
    per: "Changeovers per shift",
    smed: "SMED step", now: "Now: 50 min", ext: "External", pins: "Locating pins",
    seq: "Sequence", groups: "L in groups", rule: "Sequencing rule",
    hj: "Build order", blocks: "Blocks", pattern: "Pattern",
    sw: "Switch", recipe: "Recipe 0 min", parts: "Change parts 15 min",
    label: LABEL_EN,
    aria: "Assembly line with five stations and carriers in three variants. Levels 1 and 2: arrows pick a part.",
  },
};

const sN = STRINGS.nl;
const radio = (set, key) => `<button type="button" class="mx-btn" role="radio" data-set="${set}" data-t="${key}" aria-checked="false" tabindex="-1">${sN[key] ?? key}</button>`;
const radioRaw = (set, text) => `<button type="button" class="mx-btn" role="radio" data-set="${set}" aria-checked="false" tabindex="-1">${text}</button>`;
const controls = [
  `<div class="mx-controls">`,
  `<div class="mx-row" data-levels="1" role="radiogroup" aria-label="${sN.per}" data-t-label="per">${L1.counts.map((n) => radioRaw(`n:${n}`, `${n}×`)).join("")}</div>`,
  `<div class="mx-row" data-levels="2" role="radiogroup" aria-label="${sN.smed}" data-t-label="smed">${radio("smed:now", "now")}${radio("smed:ext", "ext")}${radio("smed:pins", "pins")}</div>`,
  `<div class="mx-row" data-levels="3" role="radiogroup" aria-label="${sN.seq}" data-t-label="seq">${radio("seq:groups", "groups")}${radio("seq:rule", "rule")}</div>`,
  `<div class="mx-row" data-levels="4" role="radiogroup" aria-label="${sN.hj}" data-t-label="hj">${radio("hj:blocks", "blocks")}${radio("hj:pattern", "pattern")}</div>`,
  `<div class="mx-row" data-levels="4" role="radiogroup" aria-label="${sN.sw}" data-t-label="sw">${radio("sw:recipe", "recipe")}${radio("sw:parts", "parts")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="mx-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="mx-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="mx-line"></span>'.repeat(4)}</span>`)
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
var st=document.querySelector(".mx-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: L1 output ${L1.counts.map(outputL1).join("/")} · L2 ${SMED.map(smedMin).join("/")} min · L3 mean ${meanOf(MIX.work, MIX.share)} s · L4 takt ${TAKT4} s, switches ${switchesOf(daySeq("blocks"))}/${switchesOf(daySeq("pattern"))}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { apart: false });
