// Dev tool, not shipped. Builds the standalone figure for the topic "Boren"
// (module Machining): the lessons eng.machining.drill, holes, deephole and
// holequality.
//
//   node figures/eng.machining.drill/build.mjs            build the page
//   node figures/eng.machining.drill/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.machining.drill.html: one offline page
// with the anatomy kit, the kit's lathe module and the live script inlined. The
// page reads ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL
// (defaults: prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL =
  process.env.ANATOMY_SKILL ??
  "/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy";
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")).href);
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.machining.drill.html");

// ---------------------------------------------------------------- the model
// A horizontal drilling unit drills one hole into a steel block held in a vice.
// The block is drawn cut open along the hole's axis, so the hole and the tool
// inside it can be seen. Formulas as in the lessons (Sandvik Coromant,
// "Machining formulas and definitions"):
//   spindle speed   n  = Vc · 1000 / (π · D)                         [rpm]
//   feed rate       vf = f · n                                       [mm/min]
//   time per hole   t  = L / vf (+ pecks)                            [min]
//   pecking         needed above L/D ≈ 3 with a plain drill; step 1 × D,
//                   2 s per retract-and-return (lesson "Diep boren")
//   through-spindle coolant: carbide drill, Vc 100, no pecking up to ~30 × D
//   holes to size   H7 band from ISO 286; reaming leaves 0.2 mm on diameter;
//                   tap drill = nominal − pitch (ISO metric coarse)
//   position        2 · √(dx² + dy²) against a tolerance of Ø0.1 (ISO 1101);
//                   stated model of a machine warming up: every hole shifts the
//                   same way (dx : dy = 3 : 4), s(t) = 0.065 · (1 − e^(−t/τ)) mm
//                   with τ ≈ 4.19 h, so s = 0.014 mm after 1 h (position 0.03),
//                   0.040 mm after 4 h (position 0.08) and 0.055 after 8 h (0.11).
const DS = [2, 3, 4, 5, 6, 8, 10, 12, 16, 20];
const TAPS = { 3: [0.5, 2.5], 4: [0.7, 3.3], 5: [0.8, 4.2], 6: [1, 5], 8: [1.25, 6.8], 10: [1.5, 8.5], 12: [1.75, 10.2], 16: [2, 14], 20: [2.5, 17.5] };
const H7 = [[3, 10], [6, 12], [10, 15], [18, 18], [30, 21], [50, 25]]; // up to D: µm (ISO 286)
const REAM = 0.2;
const PECK_S = 2;
const PECK_LD = 3;
const DEEP_LD = 30;
const HSS_VC = 25;
const HM_VC = 100;
const DRIFT = 0.065;
const TAU_H = 4 / Math.log(DRIFT / (DRIFT - 0.04)); // s(4 h) = 0.040 mm
const TOL = 0.1;
const VC = [10, 150];
const FEED = [0.05, 0.3];
const DEPTH = [5, 100];
const HOURS = [0, 8];
const TIME_SCALE = 5; // simulated seconds per real second

const rpmOf = (D, vc) => (1000 * vc) / (Math.PI * D);
const vfOf = (D, vc, f) => f * rpmOf(D, vc);
const pecksOf = (L, D) => Math.ceil(L / D - 1e-9);
const h7Of = (D) => H7.find(([upTo]) => D <= upTo)[1] / 1000;
const driftOf = (hours) => DRIFT * (1 - Math.exp(-hours / TAU_H));
const positionOf = (dx, dy) => 2 * Math.hypot(dx, dy);

// The lessons' worked numbers, asserted so the figure and the text agree.
{
  const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} is not ${b}`); };
  near(rpmOf(8, 25), 995, 0.5, "Ø8 HSS rpm");
  near(vfOf(8, 25, 0.15), 149, 0.5, "Ø8 HSS feed rate");
  near((20 / vfOf(8, 25, 0.15)) * 60, 8, 0.1, "Ø8 seconds per hole");
  near(rpmOf(8, 100), 3980, 2, "Ø8 carbide rpm");
  near(vfOf(8, 100, 0.15), 597, 0.5, "Ø8 carbide feed rate");
  near((20 / vfOf(8, 100, 0.15)) * 60, 2, 0.05, "Ø8 carbide seconds per hole");
  near(rpmOf(10, 25), 796, 0.5, "Ø10 recall rpm");
  near(TAPS[8][1], 8 - 1.25, 0.05, "M8 tap drill");
  near(TAPS[10][1], 10 - 1.5, 1e-9, "M10 tap drill");
  near(10 - REAM, 9.8, 1e-9, "Ø10 H7 pre-drill");
  near(10 + h7Of(10), 10.015, 1e-9, "Ø10 H7 upper limit");
  near(h7Of(40), 0.025, 1e-9, "Ø40 H7 band");
  const cut = (90 / vfOf(6, HSS_VC, 0.075)) * 60;
  near(vfOf(6, HSS_VC, 0.075), 100, 0.6, "Ø6 HSS feed rate");
  near(cut, 54, 0.5, "Ø6 × 90 cutting time");
  near(pecksOf(90, 6) * PECK_S, 30, 1e-9, "Ø6 × 90 pecking time");
  near(cut + pecksOf(90, 6) * PECK_S, 84, 0.5, "Ø6 × 90 pecking total");
  near((90 / vfOf(6, HM_VC, 0.075)) * 60, 13.5, 0.2, "Ø6 × 90 through-spindle coolant");
  near(pecksOf(80, 5) * 1.5, 24, 1e-9, "recall: 80 deep in 5 mm pecks");
  near(positionOf(0.03, 0.04), 0.1, 1e-12, "recall: position 0.03 / 0.04");
  near(driftOf(4) * 0.6, 0.024, 1e-9, "dx after 4 h");
  near(driftOf(4) * 0.8, 0.032, 1e-9, "dy after 4 h");
  near(positionOf(0.024, 0.032), 0.08, 1e-12, "position of hole 3");
  if (positionOf(0.6 * driftOf(1), 0.8 * driftOf(1)) > 0.03) throw new Error("the morning holes must lie within a position of 0.03");
  if (positionOf(0.6 * driftOf(8), 0.8 * driftOf(8)) <= TOL) throw new Error("a full day warm must run out of the Ø0.1 tolerance");
  if (positionOf(0, 0.06) !== 0.12) throw new Error("recall: a distance of 0.06 is a position of 0.12");
}

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the spindle (the unit at -x drills
// toward +x), +y toward the operator. The bench top is at z = 0.
const WIDTH = 600;
const ZC = 100; // spindle axis height = the cut face of the block
const BLOCK = { x: 40, y: -25, w: 110, d: 50, r: 0.6 };
const BLOCK_Z = 60;
const BX0 = BLOCK.x, BX1 = BLOCK.x + BLOCK.w, BY0 = BLOCK.y, BY1 = BLOCK.y + BLOCK.d;
const BENCH = { x: -206, y: -72, w: 398, d: 180, r: 5 };
const BENCH_Z = -12;
const BED = { x: -196, y: -56, w: 378, d: 94, r: 2 };
const BED_Z = [6, 40];
const WAYS = [
  { x: -192, y: -46, w: 198, d: 10, r: 0.6 },
  { x: -192, y: 26, w: 198, d: 10, r: 0.6 },
];
const WAY_TOP = 46;
const SADDLE = { x: -186, y: -50, w: 78, d: 90, r: 1.5 };
const SADDLE_TOP = 60;
const HOUSING = { x: -184, y: -36, w: 68, d: 72, r: 3 };
const HOUSING_TOP = 136;
const X_SPINDLE = HOUSING.x + HOUSING.w; // -116
const X_NUT = X_SPINDLE + 6 + 30; // collet-nut nose: -80
const TIP_REST = BX0 - 6; // 34: the drill tip at rest
const STICK = TIP_REST - X_NUT; // 114 mm of tool out of the chuck
const PLATE = { x: 13, y: -52, w: 167, d: 92, r: 1.5 };
const PLATE_TOP = 50;
const VICE = { x: 30, y: -46, w: 132, d: 84, r: 1 };
const VICE_TOP = 60;
const JAW_BACK = { x: 30, y: -46, w: 132, d: 20, r: 0.8 };
const JAW_FRONT = { x: 30, y: 26, w: 132, d: 12, r: 0.8 };
const JAW_TOP = 96;
const CONSOLE = { x: -190, y: 56, w: 372, d: 42, r: 2 };
const CONSOLE_TOP = 24;
const PANEL_TOP = CONSOLE_TOP + 0.8;
const KNOB_KEYS = ["d", "vc", "f", "l", "s"];
const KNOBS = KNOB_KEYS.map((key, index) => ({ key, at: [-160 + index * 56, 78] }));
const DIAL_R = 12;
const KNOB_R = 7;
const KNOB_TOP = PANEL_TOP + 0.8 + 6;
const SPAN = (270 * Math.PI) / 180;
const FROM = -SPAN / 2;
const SEL = { 1: 2, 2: 3, 3: 2, 4: 0 }; // selector positions per level (0: continuous hours)
const SEL_SPAN = (120 * Math.PI) / 180;
const SCREEN = { x: 108, y: 61, w: 68, d: 33, r: 1.2 };
const MAN = { x: 14, y: -50, w: 14, d: 14, r: 1 };
const MAN_TOP = 64;
const AIM = [BX0, 0, ZC];

const FIT = [
  ...k.boxCorners(BENCH, BENCH_Z, 0),
  ...k.boxCorners(HOUSING, SADDLE_TOP, HOUSING_TOP + 62),
  [BX1, BY0, ZC + 8],
];
const PAD = 6;
const AZIMUTH = Number(process.env.AZ ?? 64);
const ELEVATION = Number(process.env.EL ?? 38);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const face = (points) => k.pathOf(points.map(at), true);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);

const knobAngle = (value, range) => FROM + ((Math.min(range[1], Math.max(range[0], value)) - range[0]) / (range[1] - range[0])) * SPAN;
const selAngle = (index, count) => (count < 2 ? 0 : -SEL_SPAN / 2 + (index / (count - 1)) * SEL_SPAN);

// ---------------------------------------------------------------- recorder
const TRAVEL = DEPTH[1] + 0.6 * 10 + (BX0 - TIP_REST); // the longest stroke, for depth order
const MOVE = [TRAVEL, 0, 0];
const R = A.recorder(P, { order: [], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVE : [0, 0, 0], attrs });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, ...(owner ? { owner } : {}) }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name }));
  const svg = S(G.disc(s0, s1, r, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}

// ---------------------------------------------------------------- shared live geometry
// These draw the parts that change every frame. They take the kit and the lathe
// module as arguments, so the build and the page run the very same code.

// The tool in the spindle: a twist drill (118° point, two helical flutes), a
// reamer (six straight flutes, 45° chamfer) or a tap (thread, three flutes).
function toolSvg(K, GG, P, t) {
  const TAU = Math.PI * 2;
  const F = GG.frameOf([t.xNose, 0, t.zc], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const V = GG.viewOf(P);
  const fv = GG.angleToward(F, V);
  const r = t.r, len = t.len;
  const wrap = (a) => { let x = (a + Math.PI) % TAU; if (x < 0) x += TAU; return x - Math.PI; };
  const pt = (s, rr, rho) => K.iso(GG.pointOf(F, s, rr, fv + rho), P);
  const fmt = (pts) => "M" + pts.map(([x, y]) => x.toFixed(2) + " " + y.toFixed(2)).join("L");
  const H = Math.PI / 2;
  // a curve on the surface, kept where it faces the viewer; runs end exactly on the silhouette
  function curve(rhoOf, s0, s1, rr, steps) {
    const runs = [];
    let run = null, prev = null;
    for (let i = 0; i <= steps; i++) {
      const s = s0 + ((s1 - s0) * i) / steps;
      const rho = wrap(rhoOf(s));
      const vis = Math.abs(rho) <= H;
      if (prev) {
        if (vis !== prev.vis && Math.abs(rho - prev.rho) < Math.PI) {
          const edge = (vis ? rho : prev.rho) > 0 ? H : -H;
          const u = (edge - prev.rho) / (rho - prev.rho);
          const se = prev.s + (s - prev.s) * u;
          if (vis) { run = [pt(se, rr, edge)]; runs.push(run); }
          else if (run) { run.push(pt(se, rr, edge)); run = null; }
        } else if (vis && !prev.vis) { run = []; runs.push(run); }
      } else if (vis) { run = []; runs.push(run); }
      if (vis) { if (!run) { run = []; runs.push(run); } run.push(pt(s, rr, rho)); }
      else run = null;
      prev = { s, rho, vis };
    }
    return runs.filter((x) => x.length > 1).map(fmt).join("");
  }
  let profile, lines = "", fills = "";
  if (t.kind === "drill") {
    const tl = r * 0.6009; // 118° point
    const s1 = len - tl;
    profile = [[0, r], [s1, r], [len, 0]];
    const lead = 6 * 2 * r;
    for (let f = 0; f < 2; f++) {
      const a0 = (s) => t.theta + f * Math.PI + (TAU * s) / lead;
      // the flute: a band between two helices, clipped to the visible half
      const steps = Math.max(24, Math.round(s1 / 1.6));
      let lo = [], hi = [];
      const flush = () => { if (lo.length > 1) fills += '<path class="dr-flute" d="' + fmt(lo.concat(hi.reverse())) + 'Z"/>'; lo = []; hi = []; };
      for (let i = 0; i <= steps; i++) {
        const s = (s1 * i) / steps;
        const a = wrap(a0(s) - fv);
        let b0 = a, b1 = a + 0.42 * Math.PI;
        const x0 = Math.max(b0, -H), x1 = Math.min(b1, H);
        if (x1 > x0) { lo.push(pt(s, r, x0)); hi.push(pt(s, r, x1)); } else flush();
      }
      flush();
      lines += curve((s) => a0(s) - fv, 0, s1, r, steps);
      lines += curve((s) => a0(s) + 0.42 * Math.PI - fv, 0, s1, r, steps);
      // the cutting lip on the point
      const lip = wrap(a0(s1) + 0.42 * Math.PI - fv);
      if (Math.abs(lip) < H - 0.05) lines += fmt([pt(s1, r, lip), pt(len, 0, 0)]);
    }
  } else if (t.kind === "reamer") {
    const ch = 0.35 * r;
    profile = [[0, r], [len - ch, r], [len, r - ch], [len, 0]];
    for (let f = 0; f < 6; f++) {
      const rho = wrap(t.theta + (f * TAU) / 6 - fv);
      if (Math.abs(rho) < H - 0.08) lines += fmt([pt(0, r, rho), pt(len - ch, r, rho)]);
    }
  } else {
    const p = t.pitch, thr = Math.min(len - 4, 22), sA = len - thr, sB = len - 2.5 * p;
    profile = [[0, r * 0.8], [sA - 1, r * 0.8], [sA, r], [sB, r], [len, r - 0.6 * p], [len, 0]];
    const shift = (p * (((t.theta % TAU) + TAU) % TAU)) / TAU;
    for (let s = sA - p + shift; s < sB; s += p) {
      const pts = [];
      for (let i = 0; i <= 16; i++) {
        const rho = -H + (Math.PI * i) / 16;
        const ss = s + (p * (rho + H)) / TAU;
        if (ss < sA || ss > sB) continue;
        pts.push(pt(ss, r, rho));
      }
      if (pts.length > 1) lines += fmt(pts);
    }
    for (let f = 0; f < 3; f++) {
      const rho = wrap(t.theta + (f * TAU) / 3 - fv);
      if (Math.abs(rho) < H - 0.12) fills += '<path class="dr-flute" d="' + fmt([pt(sA, r, rho - 0.1), pt(sB, r, rho - 0.1), pt(sB, r, rho + 0.1), pt(sA, r, rho + 0.1)]) + 'Z"/>';
    }
  }
  const body = GG.solidOf(profile, F, P);
  const inner = fills + (lines ? '<path class="iso-line" data-tone="lo" d="' + lines + '"/>' : "");
  const svg = K.solidSvg(body, { tone: "hi", crease: "lo", inner });
  return t.alpha < 0.999 ? '<g style="opacity:' + t.alpha.toFixed(3) + '">' + svg + "</g>" : svg;
}

// The block's cut face with the hole in it. back: what the tool covers (the
// bore and the face behind the hole); front: the face in front of the hole,
// which covers the part of the tool that is below the cut.
function sectionSvg(K, P, h) {
  const { x0, x1, y0, y1, zc } = h.block;
  const r = h.r, tl = r * 0.6009;
  const xc = Math.min(h.tip, x1 - 2);
  const has = xc > x0 + 0.05;
  const xb = Math.max(x0, xc - tl);
  const hw = (x) => (x <= xc - tl ? r : Math.max(0, (r * (xc - x)) / tl));
  const h0 = has ? hw(x0) : 0;
  const top = (pts) => K.onTop(pts, zc, P, true);
  const fmt = (pts) => "M" + pts.map(([x, y]) => x.toFixed(2) + " " + y.toFixed(2)).join("L");
  // 45° hatch, clipped to a polygon in the cut plane
  function hatch(poly) {
    const out = [];
    const lo = x0 - y1, hi = x1 - y0;
    for (let c = Math.ceil(lo / 6) * 6 + 2; c < hi; c += 6) {
      const ys = [];
      for (let i = 0; i < poly.length; i++) {
        const p = poly[i], q = poly[(i + 1) % poly.length];
        const dp = p[0] - p[1], dq = q[0] - q[1];
        if (dp === dq) continue;
        const u = (c - dp) / (dq - dp);
        if (u >= 0 && u < 1) ys.push(p[1] + u * (q[1] - p[1]));
      }
      ys.sort((a, b) => a - b);
      for (let i = 0; i + 1 < ys.length; i += 2) if (ys[i + 1] - ys[i] > 0.3) out.push(fmt([K.iso([c + ys[i], ys[i], zc], P), K.iso([c + ys[i + 1], ys[i + 1], zc], P)]));
    }
    return out.join("");
  }
  const backPoly = [[x0, y0], [x1, y0], [x1, -r], [x0, -r]];
  const frontPoly = has
    ? [[x0, -r], [x1, -r], [x1, y1], [x0, y1], [x0, h0], [xb, hw(xb)], [xc, 0], [xb, -hw(xb)], [x0, -h0]]
    : [[x0, -r], [x1, -r], [x1, y1], [x0, y1]];
  let back = '<path class="iso-line" data-tone="faint" d="' + hatch(backPoly) + '"/>';
  if (has) {
    const P3 = (x, y, z) => K.iso([x, y, z], P);
    const bore = [P3(x0, -h0, zc), P3(xb, -hw(xb), zc), P3(xc, 0, zc), P3(xb, 0, zc - hw(xb)), P3(x0, 0, zc - h0)];
    back += '<path class="dr-bore" d="' + fmt(bore) + 'Z"/>';
    if (xb > x0 + 0.5) {
      const wall = [P3(x0, -h0, zc), P3(xb, -r, zc), P3(xb, -0.72 * r, zc - 0.69 * r), P3(x0, -0.72 * h0, zc - 0.69 * h0)];
      back += '<path class="dr-wall" d="' + fmt(wall) + 'Z"/>';
    }
    if (h.thread > x0 + 1 && h.pitch) {
      let arcs = "";
      for (let x = x0 + 0.6; x < Math.min(h.thread, xb - h.pitch); x += h.pitch) {
        const pts = [];
        for (let i = 0; i <= 14; i++) {
          const psi = (Math.PI * i) / 14;
          pts.push(P3(x + (h.pitch * psi) / (2 * Math.PI), -r * Math.cos(psi), zc - r * Math.sin(psi)));
        }
        arcs += fmt(pts);
      }
      back += '<path class="iso-line" data-tone="lo" d="' + arcs + '"/>';
    }
  }
  const inset = 0.5;
  const fillPoly = frontPoly.map(([x, y]) => [Math.min(x1 - inset, Math.max(x0 + inset, x)), Math.min(y1 - inset, y)]);
  let front = '<path class="iso-top" d="' + top(fillPoly) + '"/>' + '<path class="iso-line" data-tone="faint" d="' + hatch(frontPoly) + '"/>';
  if (has) front += '<path class="iso-line dr-rim" data-tone="mid" d="' + K.onTop([[x0, h0], [xb, hw(xb)], [xc, 0], [xb, -hw(xb)], [x0, -h0]], zc, P) + '"/>';
  return { back, front };
}

// A chip curl: a closed spiral ribbon, so it has no loose line ends.
function chipPath(cx, cy, size, turn) {
  const out = [];
  const inner = [];
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = turn + t * Math.PI * 2 * 1.25;
    const r = size * (0.42 + 0.58 * t);
    const w = size * (0.12 + 0.18 * t);
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.62]);
    inner.push([cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.62]);
  }
  const pts = out.concat(inner.reverse());
  return "M" + pts.map(([x, y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + "Z";
}

const BLOCKSPEC = { x0: BX0, x1: BX1, y0: BY0, y1: BY1, zc: ZC };

// ---------------------------------------------------------------- bench and bed
const halo = [`<path class="iso-halo" d="${k.haloOf(BENCH, BENCH_Z, -BENCH_Z, P)}"/>`];
{
  const inner = L(k.sideSeam(BENCH, -4, P, 5), { tone: "faint" });
  const screws = k.corners(BENCH, 7);
  const extra = L(k.planOutline(k.insetPlan(BENCH, 4), 0, P, 4), { tone: "faint" }) + L(screws.map(([x, y]) => k.ring(x, y, 1.6, 0, P, 14)).join(""), { tone: "lo" }) + Dt(screws.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.bench", BENCH, BENCH_Z, 0, { tone: "lo" }, { steps: 5, bevel: 1, inner, extra, attrs: ' data-part="bench"' });
}
for (const [x, y] of k.corners(BED, 12)) post("bed.foot", x, y, 6, 0, BED_Z[0], { tone: "lo" }, { steps: 22 });
{
  const front = BED.y + BED.d;
  const inner = L(k.sideSeam(BED, BED_Z[0] + 5, P, 2), { tone: "faint" });
  box("bed", BED, BED_Z[0], BED_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.6, inner, attrs: ' data-part="bed"' });
  const strip = { x: -186, y: front, w: 188, d: 0.8, r: 0.2 };
  const ticks = k.sideTicks(-184, 0, 4, 5, front + 0.8, BED_Z[1] - 3, [1.8, 3.4], P);
  box("bed.scale", strip, BED_Z[1] - 11, BED_Z[1] - 3, { tone: "lo", crease: "none" }, { extra: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }), attrs: ' data-part="bed"' });
  WAYS.forEach((way, index) => {
    box(index ? "way.front" : "way.back", way, BED_Z[1], WAY_TOP, { tone: "mid", crease: "lo" }, { bevel: 0.4, attrs: ' data-part="ways"' });
    box("way.stop", { x: way.x + way.w, y: way.y - 1, w: 6, d: way.d + 2, r: 0.5 }, BED_Z[1], WAY_TOP + 6, { tone: "mid" }, { bevel: 0.4, extra: Dt([at([way.x + way.w + 3, way.y + way.d / 2, WAY_TOP + 6])], { size: 0.45 }), attrs: ' data-part="ways"' });
  });
}

// ---------------------------------------------------------------- the drilling unit (moves along x)
const unit = (part) => ({ piece: "unit", attrs: ` data-unit="" data-part="${part}"` });
{
  const sy = SADDLE.y + SADDLE.d;
  box("unit.saddle", SADDLE, WAY_TOP, SADDLE_TOP, { tone: "mid" }, { bevel: 0.5, inner: L(k.sideSeam(SADDLE, SADDLE_TOP - 4, P, 2), { tone: "faint" }), extra: Dt([[SADDLE.x + 8, sy, 53], [SADDLE.x + SADDLE.w - 8, sy, 53]].map(at), { size: 0.5 }), ...unit("saddle") });
  // gib screws on the front of the saddle
  for (const gx of [SADDLE.x + 22, SADDLE.x + 56]) {
    const Fg = frameY([gx, sy, 53]);
    discAt("unit.gib", Fg, 0, 2.4, 2.6, { tone: "mid" }, { extra: Dt([at(G.pointOf(Fg, 2.4, 0, 0))], { size: 0.45, tone: "hi" }), ...unit("saddle") });
  }
  const Yf = HOUSING.y + HOUSING.d;
  const inner = [];
  inner.push(L(k.sideSeam(HOUSING, HOUSING_TOP - 8, P, 3), { tone: "faint" }));
  const slots = [];
  for (const z of [112, 117, 122]) slots.push(face([[HOUSING.x + 8, Yf, z], [HOUSING.x + 30, Yf, z], [HOUSING.x + 30, Yf, z + 2], [HOUSING.x + 8, Yf, z + 2]]));
  inner.push(L(slots.join(""), { tone: "lo" }));
  box("unit.housing", HOUSING, SADDLE_TOP, HOUSING_TOP, { tone: "mid" }, { steps: 3, bevel: 0.8, inner: inner.join(""), ...unit("housing") });
  // nameplate with rules standing for print
  const np = { x: HOUSING.x + 36, y: Yf, w: 24, d: 0.8, r: 0.2 };
  const fy = Yf + 0.8;
  const rules = [[100, 16], [96.4, 12], [92.8, 14]].map(([z, len]) => k.segment([np.x + 3, fy, z], [np.x + 3 + len, fy, z], P)).join("");
  box("unit.plate", np, 88, 106, { tone: "lo", crease: "none" }, {
    extra: L(face([[np.x + 1.4, fy, 89.4], [np.x + np.w - 1.4, fy, 89.4], [np.x + np.w - 1.4, fy, 104.6], [np.x + 1.4, fy, 104.6]]), { tone: "faint" }) + L(rules, { tone: "lo", free: true }) + Dt([[np.x + 1.4, fy, 89.4], [np.x + np.w - 1.4, fy, 89.4], [np.x + 1.4, fy, 104.6], [np.x + np.w - 1.4, fy, 104.6]].map(at), { size: 0.4 }),
    ...unit("housing"),
  });
  // oil sight glass
  const Fo = frameY([HOUSING.x + 18, Yf, 82]);
  discAt("unit.glass", Fo, 0, 1.4, 4.4, { tone: "mid" }, { extra: L(G.circleOf(Fo, 1.4, 2.8, P), { tone: "lo" }) + Dt([at(G.pointOf(Fo, 1.4, 0, 0))], { size: 0.5, tone: "hi" }), ...unit("housing") });
  // motor on a plate on top, axis along x, with cooling ribs and a terminal box
  const mp = { x: -178, y: -24, w: 54, d: 48, r: 1 };
  box("unit.motorplate", mp, HOUSING_TOP, HOUSING_TOP + 4, { tone: "mid", crease: "lo" }, { bevel: 0.4, extra: Dt(k.corners(mp, 4).map(([x, y]) => at([x, y, HOUSING_TOP + 4])), { size: 0.42 }), ...unit("motor") });
  const MR = 22;
  const MZ = HOUSING_TOP + 4 + MR;
  const Fm = frameX([-182, 0, MZ]);
  turned("unit.motor", Fm, [[0, MR - 3], [3, MR], [52, MR], [55, MR - 3]], { tone: "mid", crease: "lo" }, {
    inner: L(G.ribsOf(Fm, 5, 50, MR, 14, P, { fade: [0.06, 0.5], seams: true }), { tone: "lo" }),
    ...unit("motor"),
  });
  const Ff = frameX([-192, 0, MZ]);
  turned("unit.fan", Ff, [[0, MR - 4], [10, MR - 2]], { tone: "lo", crease: "lo" }, unit("motor"));
  const tb = { x: -160, y: -9, w: 18, d: 18, r: 1 };
  box("unit.terminal", tb, MZ + MR - 0.3, MZ + MR + 10, { tone: "mid" }, { bevel: 0.5, extra: Dt(k.corners(tb, 2.6).map(([x, y]) => at([x, y, MZ + MR + 10])), { size: 0.4 }), ...unit("motor") });
  // spindle nose, collet chuck and nut
  const Fn = frameX([X_SPINDLE, 0, ZC]);
  discAt("unit.nose", Fn, 0, 6, 24, { tone: "mid" }, { extra: Dt(G.dotsOf(Fn, 6, 20, 6, P, { fade: [0.04, 0.42] }), { size: 0.4 }), ...unit("spindle") });
  const Fc = frameX([X_SPINDLE + 6, 0, ZC]);
  turned("unit.chuck", Fc, [[0, 20], [9, 20], [20, 15]], { tone: "mid", crease: "lo" }, { inner: L(G.arcOf(Fc, 4.5, 20, P), { tone: "faint" }), ...unit("chuck") });
  turned("unit.nut", Fc, [[20, 16.5], [29, 16.5], [30, 15]], { tone: "mid", crease: "lo" }, {
    inner: L(G.ribsOf(Fc, 20.6, 28.4, 16.5, 8, P, { fade: [0.05, 0.45], seams: true }), { tone: "lo" }),
    extra: L(G.circleOf(Fc, 30, 9, P), { tone: "lo" }),
    ...unit("chuck"),
  });
}

// ---------------------------------------------------------------- fixture plate, vice, block
{
  const slots = [-30, -6, 18].map((y) => k.planOutline({ x: PLATE.x + 6, y, w: PLATE.w - 12, d: 6, r: 2.8 }, PLATE_TOP, P, 4)).join("");
  box("plate", PLATE, BED_Z[1], PLATE_TOP, { tone: "mid" }, { bevel: 0.5, inner: L(k.sideSeam(PLATE, PLATE_TOP - 3, P, 2), { tone: "faint" }), extra: L(slots, { tone: "faint" }), attrs: ' data-part="plate"' });
  box("vice.base", VICE, PLATE_TOP, VICE_TOP, { tone: "mid" }, { bevel: 0.5, inner: L(k.sideSeam(VICE, VICE_TOP - 3, P, 2), { tone: "faint" }), attrs: ' data-part="vice"' });
  // tee bolts holding the vice down
  for (const [x, y] of [[23, -22], [23, 28], [171, -40], [171, 28]]) post("vice.bolt", x, y, 3.4, PLATE_TOP, PLATE_TOP + 4, { tone: "mid", crease: "lo" }, { steps: 6, extra: Dt([at([x, y, PLATE_TOP + 4])], { size: 0.45, tone: "hi" }), attrs: ' data-part="vice"' });
  box("vice.jawback", JAW_BACK, VICE_TOP, JAW_TOP, { tone: "mid" }, { bevel: 0.6, inner: L(k.sideSeam(JAW_BACK, JAW_TOP - 6, P, 2), { tone: "faint" }), attrs: ' data-part="vice"' });
  const jf = JAW_FRONT.y + JAW_FRONT.d;
  box("vice.jawfront", JAW_FRONT, VICE_TOP, JAW_TOP, { tone: "mid" }, {
    bevel: 0.6,
    inner: L(k.sideSeam(JAW_FRONT, JAW_TOP - 6, P, 2), { tone: "faint" }),
    extra: Dt([[JAW_FRONT.x + 10, jf, 84], [JAW_FRONT.x + JAW_FRONT.w - 10, jf, 84]].map(at), { size: 0.55 }),
    attrs: ' data-part="vice"',
  });
  // the block, cut open along the hole's axis; its cut face is rebuilt live
  box("block", BLOCK, BLOCK_Z, ZC, { tone: "mid" }, { steps: 2, bevel: 0, attrs: ' data-part="block"' });
  // vice screw and crank
  const Fs = frameY([96, jf, 74]);
  discAt("vice.screw", Fs, 0, 18, 5, { tone: "mid", crease: "lo" }, { inner: L(G.ribsOf(Fs, 1, 17, 5, 10, P, { twist: 2.4, fade: [0.08, 0.5], seams: true }), { tone: "lo" }), attrs: ' data-part="vice"' });
  discAt("vice.hub", Fs, 18, 26, 9, { tone: "mid" }, { extra: Dt([at(G.pointOf(Fs, 26, 0, 0))], { size: 0.55, tone: "hi" }), attrs: ' data-part="vice"' });
  box("vice.crank", { x: 96, y: jf + 26, w: 34, d: 4, r: 1.4 }, 71, 77, { tone: "mid", crease: "lo" }, { bevel: 0.3, attrs: ' data-part="vice"' });
  post("vice.grip", 126, jf + 28, 3.4, 77, 93, { tone: "hi", crease: "lo" }, { steps: 20, attrs: ' data-part="vice"' });
}

// ---------------------------------------------------------------- coolant: manifold, segmented hose, nozzle
const NOZZLE = {};
{
  box("coolant.manifold", MAN, PLATE_TOP, MAN_TOP, { tone: "mid" }, { bevel: 0.5, extra: Dt([at([MAN.x + 3, MAN.y + MAN.d, 57])], { size: 0.45 }), attrs: ' data-part="hose"' });
  const P0 = [MAN.x + MAN.w / 2, MAN.y + MAN.d / 2, MAN_TOP + 1.2];
  const P3 = [33, -30, 122];
  const aim = G.unit3(G.sub3(AIM, P3));
  const C1 = [P0[0], P0[1], 104];
  const C2 = G.sub3(P3, G.mul3(aim, 16));
  const bez = (t) => [0, 1, 2].map((i) => (1 - t) ** 3 * P0[i] + 3 * (1 - t) ** 2 * t * C1[i] + 3 * (1 - t) * t * t * C2[i] + t ** 3 * P3[i]);
  const dense = Array.from({ length: 401 }, (_, i) => bez(i / 400));
  const lens = [0];
  for (let i = 1; i < dense.length; i++) lens.push(lens[i - 1] + G.len3(G.sub3(dense[i], dense[i - 1])));
  const total = lens[lens.length - 1];
  const N = Math.round(total / 7.4);
  const stations = Array.from({ length: N + 1 }, (_, j) => {
    const target = (total * j) / N;
    let i = lens.findIndex((v) => v >= target);
    if (i < 1) i = Math.max(1, i);
    const u = (target - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
    return G.add3(dense[i - 1], G.mul3(G.sub3(dense[i], dense[i - 1]), u));
  });
  // a socket collar on the manifold, then the ball-and-socket segments
  const Fb = G.frameAlong([P0[0], P0[1], MAN_TOP], Zv);
  turned("coolant.socket", Fb, [[0, 4.6], [1.2, 4.6]], { tone: "mid", crease: "lo" }, { owner: "coolant.hose", attrs: ' data-part="hose"' });
  for (let j = 0; j < N; j++) {
    const a = stations[j], b = stations[j + 1];
    const seg = G.sub3(b, a);
    const ln = G.len3(seg);
    const F = G.frameAlong(a, G.unit3(seg));
    turned("coolant.hose", F, [[0, 2.8], [1.4, 3.9, 1], [ln * 0.5, 4.3, 1], [ln - 1.2, 3.8, 1], [ln, 2.8]], { tone: "mid", crease: "lo" }, { owner: "coolant.hose", attrs: ' data-part="hose"' });
  }
  const Fz = G.frameAlong(P3, aim);
  turned("coolant.nozzle", Fz, [[0, 2.8], [2, 3.6], [6, 3.4], [13, 1.6], [13, 1.1]], { tone: "hi", crease: "lo" }, { owner: "coolant.hose", attrs: ' data-part="nozzle"' });
  NOZZLE.tip = G.add3(P3, G.mul3(aim, 13));
  NOZZLE.aim = aim;
}

// ---------------------------------------------------------------- control console
const knobScreen = [];
{
  const extra = Dt(k.corners(CONSOLE, 3.4).map(([x, y]) => at([x, y, CONSOLE_TOP])), { size: 0.42 });
  box("panel.console", CONSOLE, 0, CONSOLE_TOP, { tone: "mid" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(CONSOLE, 4, P, 3) + k.sideSeam(CONSOLE, CONSOLE_TOP - 4, P, 3), { tone: "faint" }), extra, attrs: ' data-part="console"' });
  box("panel.face", k.insetPlan(CONSOLE, 2.6), CONSOLE_TOP, PANEL_TOP, { tone: "lo", crease: "none" }, { steps: 3, attrs: ' data-part="console"' });
  // the screen: bezel and glass; its trace is drawn live
  box("panel.bezel", SCREEN, PANEL_TOP, PANEL_TOP + 1.2, { tone: "mid", crease: "lo" }, { bevel: 0.3, attrs: ' data-part="screen"' });
  const glass = k.insetPlan(SCREEN, 2.4);
  box("panel.glass", glass, PANEL_TOP + 1.2, PANEL_TOP + 1.5, { tone: "lo", crease: "none" }, {
    extra: `<path class="dr-glass" d="${k.planOutline(glass, PANEL_TOP + 1.5, P, 2)}"/><g data-screen=""></g>`,
    attrs: ' data-part="screen"',
  });
  KNOBS.forEach((knob, index) => {
    const [x, y] = knob.at;
    const zp = PANEL_TOP;
    let plate = "";
    if (knob.key === "s") {
      // one dial plate per level; the page shows the one for its level
      for (const lv of [1, 2, 3, 4]) {
        let d = "";
        if (SEL[lv]) {
          for (let i = 0; i < SEL[lv]; i++) {
            const a = selAngle(i, SEL[lv]);
            d += k.lineOnTop([x + Math.sin(a) * (DIAL_R - 3.4), y - Math.cos(a) * (DIAL_R - 3.4)], [x + Math.sin(a) * (DIAL_R - 0.4), y - Math.cos(a) * (DIAL_R - 0.4)], zp + 0.8, P);
          }
          plate += `<g data-lv="${lv}">${L(d, { tone: "mid" })}</g>`;
        } else {
          const ticks = k.radialTicks(x, y, DIAL_R - 0.4, 16, 4, zp + 0.8, [1.4, 2.8], P, FROM, SPAN);
          plate += `<g data-lv="${lv}">${L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" })}</g>`;
        }
      }
    } else {
      const ticks = k.radialTicks(x, y, DIAL_R - 0.4, 25, 5, zp + 0.8, [1.4, 2.8], P, FROM, SPAN);
      plate = L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" });
    }
    plate += `<path class="iso-line" data-tone="faint" data-sel="${index}" d="${k.ring(x, y, DIAL_R - 0.4, zp + 0.8, P, 48)}"/>`;
    post("panel.dial", x, y, DIAL_R, zp, zp + 0.8, { tone: "lo", crease: "none" }, { steps: 48, extra: plate, attrs: ' data-part="console"' });
    const pointer = `<path class="iso-line" data-tone="hi" data-knob="${index}" data-free="end" style="stroke-width:1.1" d=""/>`;
    if (knob.key === "s") {
      // a wing knob for the selector
      post("panel.selector", x, y, KNOB_R - 1.2, zp + 0.8, KNOB_TOP - 2, { tone: "mid" }, { steps: 32, extra: "", attrs: ' data-part="console"' });
      post("panel.wing", x, y, 2.2, KNOB_TOP - 2, KNOB_TOP, { tone: "hi", crease: "lo" }, { steps: 18, extra: pointer + Dt([at([x, y, KNOB_TOP])], { size: 0.55, tone: "hi" }), attrs: ' data-part="console"' });
    } else {
      post("panel.knob", x, y, KNOB_R, zp + 0.8, KNOB_TOP, { tone: "mid" }, { steps: 32, extra: L(k.knurl(x, y, KNOB_R, zp + 0.8, KNOB_TOP, 30, P), { tone: "lo" }) + pointer + Dt([at([x, y, KNOB_TOP])], { size: 0.55, tone: "hi" }), attrs: ' data-part="console"' });
    }
    knobScreen.push(at([x, y, KNOB_TOP]));
  });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: A.uniformStates(10) });
R.items.sort((a, b) => a.key - b.key);
const blockAt = R.items.findIndex((item) => item.name === "block");
// The tool is drawn after the block and after everything it passes in front
// of (chuck, hose, nozzle); the face in front of the hole comes right after it.
const behindTool = (item) => item.name === "block" || item.name.startsWith("unit.nut") || item.name.startsWith("unit.chuck") || item.name.startsWith("coolant.");
const toolAt = Math.max(...R.items.map((item, index) => (behindTool(item) ? index : -1)));
const between = R.items.slice(blockAt + 1, toolAt + 1).map((item) => item.name).filter((name) => !name.startsWith("coolant."));
if (between.some((name) => !/^(vice\.|plate|unit\.)/.test(name))) throw new Error(`drawn between the block and the tool: ${between.join(", ")}`);
const REST = { r: 5, tip: TIP_REST };
const sec0 = sectionSvg(k, P, { block: BLOCKSPEC, r: REST.r, tip: BX0, thread: 0, pitch: 0 });
const tool0 = toolSvg(k, G, P, { kind: "drill", r: 4, len: STICK, xNose: X_NUT, zc: ZC, theta: 0.4, alpha: 1, pitch: 0 });
solids += 1;
const groups = R.items.map((item, index) => {
  const g = `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`;
  let out = g;
  if (index === blockAt) out += `<g data-sec="back" data-part="block">${sec0.back}</g>`;
  if (index === toolAt) out += `<g data-tool="" data-part="tool">${tool0}</g><g data-sec="front" data-part="block">${sec0.front}</g>`;
  return out;
  return g;
});

const HIT_R = 34; // viewBox units around each knob
const body = [...halo, ...groups, `<g data-fx=""></g>`];

const LABEL_NL =
  "Een horizontale booreenheid op een machinebed: een slede op geleidebanen met het spilhuis, de spilmotor en een spantang met moer waarin het gereedschap zit. Tegenover de spil zit een stalen blok in een machineklem; het blok is doorgesneden langs de as van het gat, zodat het gat en het gereedschap erin te zien zijn. Een gelede koelvloeistofslang spuit op de ingang van het gat. Op het bedieningspaneel staan knoppen voor diameter D, snijsnelheid Vc, voeding f, diepte L en een keuzeknop, en een klein scherm.";
const LABEL_EN =
  "A horizontal drilling unit on a machine bed: a slide on the ways carrying the spindle housing, the spindle motor and a collet chuck that holds the tool. Facing the spindle, a steel block sits in a machine vice; the block is cut open along the axis of the hole, so the hole and the tool inside it can be seen. A segmented coolant hose sprays onto the mouth of the hole. The control panel has knobs for diameter D, cutting speed Vc, feed f, depth L and a selector, and a small screen.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --lc-hair:rgba(240,233,218,.12);--lc-accent:#5C9FAE;--dr-bore:#081A1E;--dr-wall:#0E262C;--dr-glass:#081A1E;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --lc-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --lc-hair:rgba(11,41,27,.14);--lc-accent:#276F81;--dr-bore:#B8AD94;--dr-wall:#D3C9B2;--dr-glass:#E6EEEC;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--lc-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 132px);min-height:200px;padding:26px 4px 104px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--lc-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--lc-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:26px!important;max-width:42%;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:26px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.4;text-align:right;color:var(--anatomy-text);letter-spacing:0}
[data-part-name]{color:var(--anatomy-strong);font-weight:600}
.lc-model{position:absolute;left:0;right:0;bottom:0;font-family:var(--lc-sans);font-size:9.5px;line-height:1.3;color:var(--anatomy-muted);white-space:normal}
.lc-line{display:block}
.lc-acc{color:var(--lc-accent);font-weight:600}
.lc-mute{color:var(--anatomy-muted)}
.lc-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.lc-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.lc-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.iso-line.dr-rim{stroke:var(--lc-accent);stroke-width:1}
.dr-flute{fill:var(--anatomy-shade-1);stroke:none}
.dr-bore{fill:var(--dr-bore);stroke:none}
.dr-wall{fill:var(--dr-wall);stroke:none}
.dr-glass{fill:var(--dr-glass);stroke:none}
.dr-trace{fill:none;stroke:var(--lc-accent);stroke-width:1;stroke-linejoin:round;stroke-linecap:round}
.dr-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:.5}
.dr-zone{fill:none;stroke:var(--anatomy-mid);stroke-width:.7}
.dr-hit{fill:var(--lc-accent);stroke:none}
.dr-old{fill:var(--anatomy-mid);stroke:none}
.dr-drop{fill:var(--lc-accent);stroke:none}
.lc-chip{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.55;stroke-linejoin:round}
[data-lv]{display:none}
html[data-level="1"] [data-lv="1"],html[data-level="2"] [data-lv="2"],html[data-level="3"] [data-lv="3"],html[data-level="4"] [data-lv="4"]{display:inline}
[data-sel][data-on]{stroke:var(--anatomy-hi)!important}
.lc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

// ---------------------------------------------------------------- live script
const latheSource = readFileSync(join(SKILL, "kit/lathe.mjs"), "utf8").replace(/^import .*$/m, "").replace(/^export /gm, "");
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, solidOf, angleToward, dot3, add3, mul3 };})();\n`;

const live = readFileSync(join(HERE, "live.js"), "utf8");
const constants = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const DS = ${JSON.stringify(DS)}, TAPS = ${JSON.stringify(TAPS)}, H7 = ${JSON.stringify(H7)};
const REAM = ${REAM}, PECK_S = ${PECK_S}, PECK_LD = ${PECK_LD}, DEEP_LD = ${DEEP_LD}, HSS_VC = ${HSS_VC}, HM_VC = ${HM_VC};
const TAU_H = ${TAU_H}, DRIFT = ${DRIFT}, TOL = ${TOL}, TS = ${TIME_SCALE};
const VC = ${JSON.stringify(VC)}, FEED = ${JSON.stringify(FEED)}, DEPTH = ${JSON.stringify(DEPTH)}, HOURS = ${JSON.stringify(HOURS)};
const ZC = ${ZC}, BX0 = ${BX0}, X_NUT = ${X_NUT}, TIP_REST = ${TIP_REST}, STICK = ${STICK};
const BLOCKSPEC = ${JSON.stringify(BLOCKSPEC)};
const KNOBS = ${JSON.stringify(KNOBS)}, KNOB_R = ${KNOB_R}, KNOB_TOP = ${KNOB_TOP}, DIAL_R = ${DIAL_R};
const SPAN = ${SPAN}, FROM = ${FROM}, SEL = ${JSON.stringify(SEL)}, SEL_SPAN = ${SEL_SPAN};
const SCREEN = ${JSON.stringify(k.insetPlan(SCREEN, 2.4))}, SCREEN_Z = ${PANEL_TOP + 1.5};
const NOZZLE = ${JSON.stringify(NOZZLE)}, PLATE_TOP = ${PLATE_TOP};
const HIT_R = ${HIT_R};
const knobAngle = ${knobAngle.toString()};
const selAngle = ${selAngle.toString()};
const rpmOf = ${rpmOf.toString()};
const vfOf = ${vfOf.toString()};
const pecksOf = ${pecksOf.toString()};
const h7Of = ${h7Of.toString()};
const driftOf = ${driftOf.toString()};
const positionOf = ${positionOf.toString()};
${toolSvg.toString()}
${sectionSvg.toString()}
${chipPath.toString()}
const K = { solidSvg, lineSvg, dotsSvg, iso, pathOf, onTop };
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = JSON.parse(readFileSync(join(HERE, "strings.json"), "utf8"));
STRINGS.nl.label = LABEL_NL;
STRINGS.en.label = LABEL_EN;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="lc-stage" tabindex="0" role="slider" aria-label="${STRINGS.nl.aria}" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0">${svg}</div><div class="lc-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="lc-line"></span>'.repeat(5)}</span><span class="lc-model" data-model></span>`)
  .replace(">HINT<", `><span data-hint></span><br><span data-knobs></span><br><span data-time>1 s = ${TIME_SCALE} s</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement,l=Number(q.get("level"));
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
d.setAttribute("data-level",l>=1&&l<=4&&l===Math.floor(l)?String(l):"2");
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark" data-level="2"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script type="module">${(kitScript() + latheScript + constants + `const STRINGS = ${JSON.stringify(STRINGS)};\n` + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
const gaps = knobScreen.slice(1).map((p, i) => Math.hypot(p[0] - knobScreen[i][0], p[1] - knobScreen[i][1]).toFixed(1));
console.log(`knobs ${gaps.join(", ")} vb apart`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { frames: A.uniformStates(20), apart: false });
