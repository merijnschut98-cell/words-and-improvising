// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Cutting speed, feed and depth" (module Machining, level 1).
//
//   node figures/eng.machining.lathe/build.mjs            build the page
//   node figures/eng.machining.lathe/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.machining.lathe.html: one offline page
// with the anatomy kit, the kit's lathe module and the live script inlined. The
// page reads ?theme=light|dark and ?lang=nl|en from its URL (defaults:
// prefers-color-scheme, Dutch).
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
const OUT = join(ROOT, "src/content/courses/figures/eng.machining.lathe.html");

// ---------------------------------------------------------------- the model
// Longitudinal turning of a 40 mm steel shaft between chuck and centre, one
// pass of 150 mm at a 2 mm depth of cut (the step you see on the shaft).
//   spindle speed  n = 1000 · Vc / (π · D)                [rpm]
//   time per pass  t = L / (f · n)                        [min]
//   tool life      Taylor: Vc · T^n = C, n = 0.25 (typical for carbide on
//                  steel), C = 492 m/min, so T = 15 min at Vc = 250 m/min.
//   parts per edge N = T / t (one pass per part)
//   cost per part  = rate · (t + load) + (rate · change + edge) / N
//                  with a stated model: machine €60/h, load and unload 0.5 min,
//                  edge change 1 min, one insert edge €4.
// Simple Taylor ignores the feed's effect on tool life, as the lesson does.
const D_MM = 40;
const L_MM = 150;
const AP_MM = 2;
const TAYLOR_N = 0.25;
const TAYLOR_C = 492;
const RATE = 60; // € per hour
const LOAD = 0.5; // min
const CHANGE = 1; // min
const EDGE = 4; // €
const VC = [150, 400];
const FEED = [0.1, 0.4];
const START = { vc: 250, f: 0.25 };
const TIME_SCALE = 10; // simulated seconds per real second

// ---------------------------------------------------------------- the world
// World units are 2 mm, z up, x along the spindle (headstock at -x), +y toward
// the operator. The bench top is at z = 0.
const WIDTH = 600;
const UNIT_MM = 2;
const Z_C = 84; // centre height
const R0 = D_MM / 2 / UNIT_MM; // 10: the blank
const R1 = (D_MM / 2 - AP_MM) / UNIT_MM; // 9: after the pass
const X_CF = -62; // chuck face
const X_END = 40; // shaft end at the tailstock centre; the pass starts here
const TRAVEL = L_MM / UNIT_MM; // 75
const X_STOP = X_END - TRAVEL; // -35
const BENCH = { x: -146, y: -44, w: 252, d: 130, r: 5 };
const BENCH_Z = -12;
const BASE = { x: -140, y: -38, w: 240, d: 86, r: 3 };
const BASE_Z = [4, 16];
const BED = { x: -132, y: -28, w: 230, d: 50, r: 2 };
const BED_TOP = 44;
const WAY_TOP = 48;
const WAYS = [
  { x: -82, y: -26, w: 178, d: 8, r: 0.6 },
  { x: -82, y: 12, w: 178, d: 8, r: 0.6 },
];
const HEAD = { x: -132, y: -30, w: 50, d: 54, r: 2 };
const HEAD_TOP = 116;
const TRAY = { x: -74, y: 30, w: 104, d: 15, r: 1.5 };
const TRAY_Z = [16, 21];
const CONSOLE = { x: 40, y: 54, w: 62, d: 28, r: 2 };
const CONSOLE_TOP = 30;
const PANEL_TOP = CONSOLE_TOP + 0.8;
const KNOBS = [
  { key: "vc", at: [52, 68], range: VC },
  { key: "f", at: [90, 68], range: FEED },
];
const DIAL_R = 9.6;
const KNOB_R = 5.6;
const KNOB_TOP = PANEL_TOP + 0.8 + 5;
const SPAN = (270 * Math.PI) / 180;
const FROM = -SPAN / 2;
const INSERT = [[0, 0], [6.4, 1.0], [7.4, 6.6], [1.0, 5.6]]; // plan, relative to the tip
const TIP = [X_END, R1]; // tip x, y at rest
const RETRACT = 3;

const knobAngle = (value, range) => FROM + ((Math.min(range[1], Math.max(range[0], value)) - range[0]) / (range[1] - range[0])) * SPAN;

const FIT = [
  ...k.boxCorners(BENCH, BENCH_Z, 0),
  ...k.boxCorners(HEAD, BED_TOP, HEAD_TOP + 3),
  [-70, 0, Z_C + 30],
  [96, 0, Z_C + 14],
  ...k.boxCorners(CONSOLE, 0, KNOB_TOP),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 58);
const ELEVATION = Number(process.env.EL ?? 32);
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

// ---------------------------------------------------------------- recorder
const MOVE = [-TRAVEL, 0, 0];
const R = A.recorder(P, { order: ["carriage"], spring: {} });
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
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name }));
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
function shaftSvg(K, GG, P, xt) {
  const F = GG.frameOf([X_CF, 0, Z_C], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const cut = Math.max(X_STOP, Math.min(X_END, xt));
  let out = K.solidSvg(GG.solidOf([[0, R0], [cut - X_CF, R0]], F, P), { tone: "mid", crease: "lo" });
  if (cut < X_END - 0.05) out += K.solidSvg(GG.solidOf([[cut - X_CF, R1], [X_END - X_CF, R1]], F, P), { tone: "hi", crease: "lo" });
  return out;
}
function blankSvg(K, GG, P) {
  const F = GG.frameOf([X_CF, 0, Z_C], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  return K.solidSvg(GG.solidOf([[0, R0], [X_END - X_CF, R0]], F, P), { tone: "mid", crease: "lo" });
}
// Three jaws on the chuck face, turned by theta; split into those behind the
// shaft (drawn before it) and those in front (after it).
const JAW = [
  { poly: [[R0, -3.5], [17, -3.5], [17, 3.5], [R0, 3.5]], s1: 4.5 },
  { poly: [[17, -3.6], [24, -3.6], [24, 3.6], [17, 3.6]], s1: 7.5 },
];
function jawFrame(GG, theta) {
  const u = [0, Math.cos(theta), Math.sin(theta)];
  const v = [0, -Math.sin(theta), Math.cos(theta)];
  return GG.frameOf([X_CF, 0, Z_C], [1, 0, 0], u, v);
}
function jawsSvg(K, GG, P, theta) {
  const V = GG.viewOf(P);
  const list = [0, 1, 2].map((index) => {
    const F = jawFrame(GG, theta + (index * 2 * Math.PI) / 3);
    const facing = GG.dot3(F.u, V);
    const steps = JAW.map((step) => ({ step, d: GG.dot3(GG.pointOf(F, step.s1 / 2, (step.poly[0][0] + step.poly[1][0]) / 2, 0), V) })).sort((a, b) => a.d - b.d);
    const svg =
      steps.map(({ step }) => K.solidSvg(GG.prismOf(F, step.poly, 0, step.s1, P), { tone: "mid", crease: "lo" })).join("") +
      K.dotsSvg([K.iso(GG.pointOf(F, 7.5, 20.5, 0), P)], { size: 0.45, tone: "hi" });
    return { facing, svg };
  });
  list.sort((a, b) => a.facing - b.facing);
  // slots and key sockets on the chuck face turn with the jaws
  const Fc = GG.frameOf([X_CF, 0, Z_C], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const sockets = [0, 1, 2].map((index) => K.iso(GG.pointOf(Fc, 0, 21, theta + Math.PI / 3 + (index * 2 * Math.PI) / 3), P));
  const slots = [0, 1, 2]
    .map((index) => {
      const F = jawFrame(GG, theta + (index * 2 * Math.PI) / 3);
      return K.pathOf([[R0 + 0.5, -4.6], [26.4, -4.6], [26.4, 4.6], [R0 + 0.5, 4.6]].map(([a, b]) => K.iso(GG.add3(GG.add3(F.o, GG.mul3(F.u, a)), GG.mul3(F.v, b)), P)), true);
    })
    .join("");
  const under = K.lineSvg(slots, { tone: "faint" }) + sockets.map(([x, y]) => `<circle class="lc-socket" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.1"/>`).join("");
  return {
    back: under + list.filter((j) => j.facing <= 0).map((j) => j.svg).join(""),
    front: list.filter((j) => j.facing > 0).map((j) => j.svg).join(""),
  };
}
// The flank-wear land on the rake face, along the leading edge from the tip.
function wearPath(K, P, wear) {
  if (wear <= 0.004) return "";
  const [tx, ty] = TIP;
  const c = INSERT[3];
  const len = Math.hypot(c[0], c[1]);
  const ux = c[0] / len, uy = c[1] / len;
  const nx = uy, ny = -ux; // inward, toward the insert's body
  const l = 1.2 + 3.8 * Math.min(1, wear);
  const w = 0.7 + 1.1 * Math.min(1, wear);
  const pts = [[tx, ty], [tx + ux * l, ty + uy * l], [tx + ux * l + nx * w * 0.4, ty + uy * l + ny * w * 0.4], [tx + nx * w + 0.3, ty + ny * w + 0.15]];
  return K.onTop(pts, Z_C + 0.02, P, true);
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

// ---------------------------------------------------------------- bench and machine base
const halo = [
  `<path class="iso-halo" d="${k.haloOf(BENCH, BENCH_Z, -BENCH_Z, P)}"/>`,
];
{
  const inner = L(k.sideSeam(BENCH, -4, P, 5), { tone: "faint" });
  const screws = k.corners(BENCH, 7);
  const extra = L(k.planOutline(k.insetPlan(BENCH, 4), 0, P, 4), { tone: "faint" }) + L(screws.map(([x, y]) => k.ring(x, y, 1.6, 0, P, 14)).join(""), { tone: "lo" }) + Dt(screws.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.bench", BENCH, BENCH_Z, 0, { tone: "lo" }, { steps: 5, bevel: 1, inner, extra });
}
for (const [x, y] of k.corners(BASE, 10)) post("base.foot", x, y, 5, 0, BASE_Z[0], { tone: "lo" }, { steps: 22 });
box("base.plinth", BASE, BASE_Z[0], BASE_Z[1], { tone: "mid" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(BASE, BASE_Z[0] + 3, P, 3), { tone: "faint" }) });

// chip tray in front of the bed, with a few chips resting in it
{
  const mouth = k.insetPlan(TRAY, 1.4);
  let chips = "";
  const rest = [[-62, 37.5, 0.4], [-48, 40, 2.1], [-35, 35.5, 4.4], [-20, 39, 1.2], [-6, 36.5, 3.3], [10, 39.5, 5.4], [20, 36, 0.9]];
  for (const [x, y, turn] of rest) {
    const [sx, sy] = at([x, y, TRAY_Z[1] - 1.2]);
    chips += `<path class="lc-chip" d="${chipPath(sx, sy, 2.6 * KS, turn)}"/>`;
  }
  const extra = `<path class="iso-shade" data-shade="0" d="${k.planOutline(mouth, TRAY_Z[1], P, 3)}"/>` + chips + L(k.planOutline(mouth, TRAY_Z[1], P, 3), { tone: "lo" });
  box("tray", TRAY, TRAY_Z[0], TRAY_Z[1], { tone: "mid" }, { steps: 3, bevel: 0.4, extra });
}

// ---------------------------------------------------------------- bed and ways
{
  const front = BED.y + BED.d;
  const strip = { x: -76, y: front, w: 172, d: 0.8, r: 0.2 };
  const ticks = k.sideTicks(-74, 94, 5, 5, front + 0.8, BED_TOP - 2, [1.6, 3], P);
  box("bed", BED, BASE_Z[1], BED_TOP, { tone: "mid" }, { steps: 2, bevel: 0.6, inner: L(k.sideSeam(BED, BASE_Z[1] + 4, P, 2), { tone: "faint" }) });
  box("bed.scale", strip, BED_TOP - 9, BED_TOP - 2, { tone: "lo", crease: "none" }, { extra: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) });
  WAYS.forEach((way, index) => box(index ? "way.front" : "way.back", way, BED_TOP, WAY_TOP, { tone: "mid", crease: "lo" }, { bevel: 0.4 }));
}

// ---------------------------------------------------------------- headstock, spindle nose, chuck
{
  const Yf = HEAD.y + HEAD.d;
  const inner = [];
  inner.push(L(k.sideSeam(HEAD, HEAD_TOP - 7, P, 2), { tone: "faint" }));
  // vent slots on the operator face
  const slots = [];
  for (const z of [96, 100, 104]) slots.push(face([[HEAD.x + 6, Yf, z], [HEAD.x + 22, Yf, z], [HEAD.x + 22, Yf, z + 1.6], [HEAD.x + 6, Yf, z + 1.6]]));
  inner.push(L(slots.join(""), { tone: "lo" }));
  box("head", HEAD, BED_TOP, HEAD_TOP, { tone: "mid" }, { bevel: 0.8, inner: inner.join("") });
  const lid = k.insetPlan(HEAD, 2);
  const bolts = k.corners(lid, 3);
  box("head.lid", lid, HEAD_TOP, HEAD_TOP + 2.4, { tone: "mid", crease: "lo" }, { bevel: 0.5, extra: Dt(bolts.map(([x, y]) => at([x, y, HEAD_TOP + 2.4])), { size: 0.42 }) });
  // nameplate with rule lines standing for print
  const npY = Yf;
  const np = { x: HEAD.x + 6, y: npY, w: 22, d: 0.8, r: 0.2 };
  const fy = npY + 0.8;
  const rules = [[64, 16], [60.6, 12], [57.2, 14]].map(([z, len]) => k.segment([np.x + 3, fy, z], [np.x + 3 + len, fy, z], P)).join("");
  box("head.plate", np, 52, 70, { tone: "lo", crease: "none" }, {
    extra: L(face([[np.x + 1.4, fy, 53.4], [np.x + np.w - 1.4, fy, 53.4], [np.x + np.w - 1.4, fy, 68.6], [np.x + 1.4, fy, 68.6]]), { tone: "faint" }) + L(rules, { tone: "lo", free: true }) + Dt([[np.x + 1.4, fy, 53.4], [np.x + np.w - 1.4, fy, 53.4], [np.x + 1.4, fy, 68.6], [np.x + np.w - 1.4, fy, 68.6]].map(at), { size: 0.4 }),
  });
  // oil sight glass
  const Fg = G.frameOf([HEAD.x + 40, Yf, 62], Y, X, Zv);
  discAt("head.glass", Fg, 0, 1.4, 4.2, { tone: "mid" }, { extra: L(G.circleOf(Fg, 1.4, 2.6, P), { tone: "lo" }) + Dt([at(G.pointOf(Fg, 1.4, 0, 0))], { size: 0.5, tone: "hi" }) });
  // spindle nose and chuck
  const Fn = frameX([HEAD.x + HEAD.w, 0, Z_C]);
  discAt("spindle.nose", Fn, 0, 4, 18, { tone: "mid" }, { extra: Dt(G.dotsOf(Fn, 4, 15.5, 6, P, { fade: [0.04, 0.42] }), { size: 0.4 }) });
  const Fch = frameX([HEAD.x + HEAD.w + 4, 0, Z_C]);
  const chFace = X_CF - Fch.o[0];
  turned("chuck", Fch, [[0, 30], [chFace - 2.5, 30], [chFace, 27.5]], { tone: "mid", crease: "lo" }, {
    inner: L(G.arcOf(Fch, 5, 30, P), { tone: "faint" }),
    extra: L(G.circleOf(Fch, chFace, 26, P), { tone: "faint" }) + L(G.circleOf(Fch, chFace, R0 + 1.2, P), { tone: "lo" }),
  });
}

// ---------------------------------------------------------------- the shaft (rebuilt live)
const JAW_REST = 0.35;
for (let index = 0; index < 3; index++) for (const step of JAW) R.solid(A.prism(jawFrame(G, JAW_REST + (index * 2 * Math.PI) / 3), step.poly, 0, step.s1, { name: "chuck.jaw" }));
{
  const F = frameX([X_CF, 0, Z_C]);
  // recorded as the finished part; the uncut collar ahead of the insert is what it is cutting
  const shape = R.solid(A.solid(F, [[0, R0], [X_STOP - X_CF, R0], [X_STOP - X_CF, R1], [X_END - X_CF, R1]], { name: "shaft" }));
  solids += 2;
  put("shaft", [(X_CF + X_END) / 2, 0, Z_C], shaftSvg(k, G, P, X_END), [shape], { attrs: ' data-shaft=""' });
}

// ---------------------------------------------------------------- tailstock
{
  const base = { x: 60, y: -30, w: 36, d: 54, r: 1.2 };
  box("tail.base", base, WAY_TOP, 56, { tone: "mid" }, { bevel: 0.5, inner: L(k.sideSeam(base, 53, P, 2), { tone: "faint" }) });
  const body = { x: 64, y: -14, w: 28, d: 28, r: 3 };
  box("tail.body", body, 56, 98, { tone: "mid" }, { steps: 4, bevel: 0.7, inner: L(k.sideSeam(body, 92, P, 4), { tone: "faint" }) });
  post("tail.lock", 90, 18, 2, 56, 60, { tone: "mid" }, { steps: 16, extra: Dt([at([90, 18, 60])], { size: 0.45, tone: "hi" }) });
  post("tail.quillclamp", 70, 0, 2.4, 98, 101, { tone: "mid" }, { steps: 18 });
  box("tail.lever", { x: 75, y: -1.1, w: 12, d: 2.2, r: 0.8 }, 98, 100, { tone: "hi", crease: "lo" });
  const Fq = G.frameOf([64, 0, Z_C], [-1, 0, 0], Y, Zv);
  discAt("tail.quill", Fq, 0, 64 - 46, 6.5, { tone: "hi", crease: "lo" }, { inner: L(G.arcOf(Fq, 6, 6.5, P) + G.arcOf(Fq, 12, 6.5, P), { tone: "faint" }) });
  const Fc = G.frameOf([46, 0, Z_C], [-1, 0, 0], Y, Zv);
  turned("tail.centre", Fc, [[0, 4.5], [2.5, 4.5], [2.5, 3.2], [6, 1.2]], { tone: "mid", crease: "lo" });
  const Fw = frameX([92, 0, Z_C]);
  discAt("tail.hub", Fw, 0, 4, 4, { tone: "mid" });
  discAt("tail.wheel", Fw, 4, 7, 13, { tone: "mid", crease: "lo" }, { extra: L(G.circleOf(Fw, 7, 9.5, P), { tone: "faint" }) + Dt([at(G.pointOf(Fw, 7, 0, 0))], { size: 0.55, tone: "hi" }) });
  const Fh = frameX([99, 0, Z_C + 9]);
  discAt("tail.handle", Fh, 0, 6, 1.5, { tone: "hi", crease: "lo" });
}

// ---------------------------------------------------------------- carriage (moves along x; the slide also retracts in y)
const car = { piece: "carriage", attrs: ' data-car=""' };
const slide = { piece: "carriage", attrs: ' data-slide=""' };
{
  const xt = X_END;
  const saddle = { x: xt - 15, y: -30, w: 30, d: 54, r: 1 };
  box("car.saddle", saddle, WAY_TOP, 56, { tone: "mid" }, { bevel: 0.5, inner: L(k.sideSeam(saddle, 52, P, 2), { tone: "faint" }), ...car });
  const apron = { x: xt - 18, y: 23, w: 36, d: 7, r: 1 };
  const ay = apron.y + apron.d;
  box("car.apron", apron, 24, 48, { tone: "mid" }, {
    bevel: 0.5,
    inner: L(k.sideSeam(apron, 44, P, 2), { tone: "faint" }),
    extra: Dt([[xt + 8, ay, 42], [xt + 12, ay, 42]].map(at), { size: 0.6, tone: "hi" }),
    ...car,
  });
  box("car.halfnut", { x: xt + 9, y: ay, w: 3, d: 1.4, r: 0.4 }, 28, 37, { tone: "hi", crease: "lo" }, car);
  const Fa = G.frameOf([xt - 8, ay, 36], Y, X, Zv);
  discAt("car.hub", Fa, 0, 2, 3, { tone: "mid" }, car);
  discAt("car.wheel", Fa, 2, 4.5, 8, { tone: "mid", crease: "lo" }, { extra: L(G.circleOf(Fa, 4.5, 5.6, P), { tone: "faint" }) + Dt([at(G.pointOf(Fa, 4.5, 0, 0))], { size: 0.55, tone: "hi" }), ...car });
  const Fah = G.frameOf(G.pointOf(Fa, 4.5, 6, Math.PI / 2), Y, X, Zv);
  discAt("car.handle", Fah, 0, 5, 1.3, { tone: "hi", crease: "lo" }, car);
  // cross slide, tool post, shank, insert
  const cross = { x: xt - 12, y: -12, w: 24, d: 42, r: 0.8 };
  box("slide.cross", cross, 56, 62, { tone: "mid", crease: "lo" }, { bevel: 0.4, ...slide });
  const Fx = G.frameOf([xt + 8, 30, 59], Y, X, Zv);
  discAt("slide.hub", Fx, 0, 2, 2.4, { tone: "mid" }, slide);
  discAt("slide.wheel", Fx, 2, 4, 5.6, { tone: "mid", crease: "lo" }, { extra: Dt([at(G.pointOf(Fx, 4, 0, 0))], { size: 0.5, tone: "hi" }), ...slide });
  const postPlan = { x: xt - 4, y: 16, w: 15, d: 14, r: 0.8 };
  box("slide.post", postPlan, 62, 76, { tone: "mid" }, { bevel: 0.6, inner: L(k.sideSeam(postPlan, 72, P, 2), { tone: "faint" }), ...slide });
  box("slide.shank", { x: xt + 0.6, y: 10, w: 7.6, d: 20, r: 0.3 }, 76, Z_C - 1.6, { tone: "mid", crease: "lo" }, slide);
  const clampPlan = { x: xt - 2, y: 20, w: 12, d: 8, r: 0.6 };
  box("slide.clamp", clampPlan, Z_C - 1.6, Z_C + 1.4, { tone: "mid", crease: "lo" }, { bevel: 0.3, ...slide });
  for (const bx of [xt + 1, xt + 7]) post("slide.bolt", bx, 24, 1.7, Z_C + 1.4, Z_C + 3.6, { tone: "hi", crease: "lo" }, { steps: 16, extra: L(k.lineOnTop([bx - 1.68, 24], [bx + 1.68, 24], Z_C + 3.6, P), { tone: "lo" }), ...slide });
  const ring = INSERT.map(([dx, dy]) => [TIP[0] + dx, TIP[1] + dy]);
  const ishape = R.solid(A.extruded(ring, Z_C - 1.6, 1.6, { name: "slide.insert" }));
  solids++;
  const [cx, cy] = [TIP[0] + 3.7, TIP[1] + 3.3];
  const tipAt = at([TIP[0], TIP[1], Z_C]);
  const insertSvg =
    `<circle class="lc-glow" data-glow="" cx="${tipAt[0].toFixed(1)}" cy="${tipAt[1].toFixed(1)}" r="${(6 * KS).toFixed(1)}" style="opacity:0"/>` +
    k.solidSvg(k.extrude(ring, Z_C - 1.6, 1.6, P), { tone: "hi", crease: "lo" }) +
    `<path class="lc-wear" data-wear="" d=""/>` +
    L(k.ring(cx, cy, 1.1, Z_C, P, 14), { tone: "mid" }) +
    Dt([at([cx, cy, Z_C])], { size: 0.5, tone: "hi" });
  put("slide.insert", [TIP[0] + 3.5, TIP[1] + 3, Z_C - 0.8], insertSvg, [ishape], slide);
}

// ---------------------------------------------------------------- control panel
const knobScreen = [];
{
  const extra = Dt(k.corners(CONSOLE, 3.4).map(([x, y]) => at([x, y, CONSOLE_TOP])), { size: 0.42 });
  box("panel.console", CONSOLE, 0, CONSOLE_TOP, { tone: "mid" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(CONSOLE, 4, P, 3) + k.sideSeam(CONSOLE, CONSOLE_TOP - 4, P, 3), { tone: "faint" }), extra });
  const top = k.insetPlan(CONSOLE, 2.6);
  box("panel.face", top, CONSOLE_TOP, PANEL_TOP, { tone: "lo", crease: "none" }, { steps: 3 });
  // label plate with print rules
  const lp = { x: 63, y: 58, w: 14, d: 10, r: 1 };
  box("panel.label", lp, PANEL_TOP, PANEL_TOP + 0.6, { tone: "mid", crease: "none" }, {
    extra: L(k.planOutline(k.insetPlan(lp, 1.4), PANEL_TOP + 0.6, P, 2), { tone: "faint" }) + L(k.lineOnTop([65.6, 60.8], [74.4, 60.8], PANEL_TOP + 0.6, P) + k.lineOnTop([65.6, 63], [71.6, 63], PANEL_TOP + 0.6, P) + k.lineOnTop([65.6, 65.2], [73, 65.2], PANEL_TOP + 0.6, P), { tone: "lo", free: true }),
  });
  // emergency stop and cycle start
  post("panel.estop", 71, 74.5, 4.6, PANEL_TOP, PANEL_TOP + 3, { tone: "mid" }, { steps: 28 });
  post("panel.mushroom", 71, 74.5, 3.7, PANEL_TOP + 3, PANEL_TOP + 6.5, { tone: "hi", crease: "lo" }, { steps: 28, bevel: 0.4, extra: L(k.ring(71, 74.5, 1.9, PANEL_TOP + 6.5, P, 20), { tone: "faint" }) });
  post("panel.start", 80.5, 58.5, 2.6, PANEL_TOP, PANEL_TOP + 1.6, { tone: "mid" }, { steps: 22 });
  post("panel.button", 80.5, 58.5, 1.8, PANEL_TOP + 1.6, PANEL_TOP + 3, { tone: "hi", crease: "lo" }, { steps: 20 });
  KNOBS.forEach((knob, index) => {
    const [x, y] = knob.at;
    const zp = PANEL_TOP;
    const ticks = k.radialTicks(x, y, DIAL_R - 0.4, 25, 5, zp + 0.8, [1.3, 2.6], P, FROM, SPAN);
    const plate =
      L(ticks.minor, { tone: "lo" }) +
      L(ticks.major, { tone: "mid" }) +
      `<path class="iso-line" data-tone="faint" data-sel="${index}" d="${k.ring(x, y, DIAL_R - 0.4, zp + 0.8, P, 48)}"/>`;
    post("panel.dial", x, y, DIAL_R, zp, zp + 0.8, { tone: "lo", crease: "none" }, { steps: 48, extra: plate });
    const value = START[knob.key];
    const pointer = `<path class="iso-line" data-tone="hi" data-knob="${index}" data-free="end" style="stroke-width:1.1" d="${knobPointer(index, value)}"/>`;
    post("panel.knob", x, y, KNOB_R, zp + 0.8, KNOB_TOP, { tone: "mid" }, { steps: 32, extra: L(k.knurl(x, y, KNOB_R, zp + 0.8, KNOB_TOP, 30, P), { tone: "lo" }) + pointer + Dt([at([x, y, KNOB_TOP])], { size: 0.55, tone: "hi" }) });
    knobScreen.push(at([x, y, KNOB_TOP]));
  });
}
function knobPointer(index, value) {
  const knob = KNOBS[index];
  const a = knobAngle(value, knob.range);
  const [x, y] = knob.at;
  return k.lineOnTop([x, y], [x + Math.sin(a) * (KNOB_R - 0.1), y - Math.cos(a) * (KNOB_R - 0.1)], KNOB_TOP, P);
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: A.uniformStates(10) });
R.items.sort((a, b) => a.key - b.key);
const shaftAt = R.items.findIndex((item) => item.name === "shaft");
const chuckAt = R.items.findIndex((item) => item.name === "chuck");
if (chuckAt > shaftAt) throw new Error("chuck must be drawn before the shaft");
const jaws0 = jawsSvg(k, G, P, JAW_REST);
solids += 6;
const groups = R.items.map((item, index) => {
  const g = `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`;
  if (index === shaftAt) return `<g data-jaws="back">${jaws0.back}</g>${g}<g data-jaws="front">${jaws0.front}</g>`;
  return g;
});

const HIT_R = 40; // viewBox units: over 44 css px across at 360 px wide
const body = [
  ...halo,
  ...groups,
  `<g data-chips=""></g>`,
  ...knobScreen.map(([x, y], index) => `<circle class="lc-hit" data-hit="${index}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${HIT_R}"/>`),
];

const LABEL_NL =
  "Een kleine CNC-draaibank op een werkbank: een spilkast met een klauwplaat en drie klauwen, een stalen as tussen klauwplaat en losse kop, een slede op geleidebanen met een beitelhouder en een wisselplaat, een spanenbak en een bedieningspaneel met twee knoppen, voor de snijsnelheid Vc en de voeding f. Hogere Vc laat de spil sneller draaien en verkort de snede, maar de wisselplaat slijt veel sneller (Taylor), zodat er vaker gewisseld moet worden.";
const LABEL_EN =
  "A small CNC turning lathe on a bench: a headstock with a three-jaw chuck, a steel shaft held between chuck and tailstock centre, a carriage on the ways with a tool post and a carbide insert, a chip tray, and a control panel with two knobs for cutting speed Vc and feed f. A higher Vc spins the spindle faster and shortens the pass, but the insert wears much faster (Taylor), so edges have to be changed more often.";

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
  --lc-hair:rgba(240,233,218,.12);--lc-accent:#5C9FAE;--lc-glow:#5C9FAE;
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
  --lc-hair:rgba(11,41,27,.14);--lc-accent:#276F81;--lc-glow:#3E8C9E;
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
.iso-plate-corner[data-corner="hint"]{bottom:26px!important;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:26px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.4;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.lc-model{position:absolute;left:0;right:0;bottom:0;font-family:var(--lc-sans);font-size:9.5px;line-height:1.3;color:var(--anatomy-muted);white-space:normal}
.lc-line{display:block}
.lc-acc{color:var(--lc-accent);font-weight:600}
.lc-mute{color:var(--anatomy-muted)}
.lc-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.lc-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.lc-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.lc-hit{fill:transparent;stroke:none}
.lc-wear{fill:var(--lc-accent);stroke:var(--lc-accent);stroke-width:.4;stroke-linejoin:round}
.lc-glow{fill:var(--lc-glow);filter:blur(3px)}
.lc-chip{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.55;stroke-linejoin:round}
.lc-chip[data-fly]{stroke:var(--anatomy-hi)}
.lc-socket{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.5}
[data-sel][data-on]{stroke:var(--anatomy-hi)!important}
.lc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

// ---------------------------------------------------------------- live script
const latheSource = readFileSync(join(SKILL, "kit/lathe.mjs"), "utf8").replace(/^import .*$/m, "").replace(/^export /gm, "");
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, solidOf, prismOf, dot3, add3, mul3 };})();\n`;

const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const D_MM = ${D_MM}, L_MM = ${L_MM}, AP_MM = ${AP_MM}, TAYLOR_N = ${TAYLOR_N}, TAYLOR_C = ${TAYLOR_C};
const RATE = ${RATE}, LOAD = ${LOAD}, CHANGE = ${CHANGE}, EDGE = ${EDGE}, TS = ${TIME_SCALE};
const VC = ${JSON.stringify(VC)}, FEED = ${JSON.stringify(FEED)}, START = ${JSON.stringify(START)};
const Z_C = ${Z_C}, R0 = ${R0}, R1 = ${R1}, X_CF = ${X_CF}, X_END = ${X_END}, X_STOP = ${X_STOP}, TRAVEL = ${TRAVEL}, RETRACT = ${RETRACT};
const TIP = ${JSON.stringify(TIP)}, INSERT = ${JSON.stringify(INSERT)}, JAW = ${JSON.stringify(JAW)}, JAW_REST = ${JAW_REST};
const TRAY_TOP = ${TRAY_Z[1]};
const KNOBS = ${JSON.stringify(KNOBS)}, KNOB_R = ${KNOB_R}, KNOB_TOP = ${KNOB_TOP};
const SPAN = ${SPAN}, FROM = ${FROM};
const knobAngle = ${knobAngle.toString()};
${shaftSvg.toString()}
${blankSvg.toString()}
${jawFrame.toString()}
${jawsSvg.toString()}
${wearPath.toString()}
${chipPath.toString()}
function knobPointer(index, value) { const knob = KNOBS[index]; const a = knobAngle(value, knob.range); const [x, y] = knob.at; return lineOnTop([x, y], [x + Math.sin(a) * (KNOB_R - 0.1), y - Math.cos(a) * (KNOB_R - 0.1)], KNOB_TOP, P); }
const K = { solidSvg, lineSvg, dotsSvg, iso, pathOf, onTop };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { rpm: "rpm", pass: "pass", life: "tool life", typ: "Taylor, typical", per: "parts per edge", cost: "per part", model: "model", dec: ".", grp: ",", vc: "Cutting speed", f: "Feed", changed: "Insert edge changed", edges: "edges used", at: "At" }
  : { rpm: "omw/min", pass: "snede", life: "standtijd", typ: "Taylor, typisch", per: "stuks per snijkant", cost: "per stuk", model: "model", dec: ",", grp: ".", vc: "Snijsnelheid", f: "Voeding", changed: "Snijkant gewisseld", edges: "snijkanten gebruikt", at: "Bij" };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);
const grouped = (value) => String(Math.round(value)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);
const euro = (value) => "€" + (EN ? "" : "\\u00a0") + fmt(value, 2);

const stage = document.querySelector(".lc-stage");
const svg = stage.querySelector("svg");
const shaftEl = svg.querySelector("[data-shaft]");
const jawsBack = svg.querySelector('[data-jaws="back"]');
const jawsFront = svg.querySelector('[data-jaws="front"]');
const cars = [...svg.querySelectorAll("[data-car]")];
const slides = [...svg.querySelectorAll("[data-slide]")];
const wearEl = svg.querySelector("[data-wear]");
const glowEl = svg.querySelector("[data-glow]");
const chipLayer = svg.querySelector("[data-chips]");
const knobEls = KNOBS.map((_, i) => svg.querySelector('[data-knob="' + i + '"]'));
const sels = KNOBS.map((_, i) => svg.querySelector('[data-sel="' + i + '"]'));
const lines = [...document.querySelectorAll("[data-readout] .lc-line")];
const announcer = document.querySelector(".lc-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ the cutting model
const rpmOf = (vc) => (1000 * vc) / (Math.PI * D_MM);
const passMin = (vc, f) => L_MM / (f * rpmOf(vc));
const lifeMin = (vc) => (TAYLOR_C / vc) ** (1 / TAYLOR_N);
const partsPerEdge = (vc, f) => lifeMin(vc) / passMin(vc, f);
const costOf = (vc, f) => (RATE / 60) * (passMin(vc, f) + LOAD) + ((RATE / 60) * CHANGE + EDGE) / partsPerEdge(vc, f);
const snapVc = (v) => clamp(Math.round(v / 10) * 10, VC[0], VC[1]);
const snapF = (v) => clamp(Math.round(v * 100) / 100, FEED[0], FEED[1]);

// ------------------------------------------------ state
const knob = [{ x: START.vc, target: START.vc }, { x: START.f, target: START.f }];
const ranges = [VC, FEED];
let selected = 0;
const cyc = { phase: "approach", t: 0, prog: 0, xt: X_END, ret: 1, wear: 0.3, shownWear: 0.3, blank: 0, edges: 1 };
let theta = JAW_REST, spin = rpmOf(START.vc) / 3600, chipClock = 0;
const chips = [];

function vcNow() { return snapVc(knob[0].x); }
function fNow() { return snapF(knob[1].x); }

// ------------------------------------------------ drawing
let lastShaft = null, lastBlank = -1;
function drawShaft() {
  const key = cyc.cutTo.toFixed(2) + "|" + cyc.blank.toFixed(3);
  if (key === lastShaft) return;
  lastShaft = key;
  let out = shaftSvg(K, G, P, cyc.cutTo);
  if (cyc.blank > 0.001) out += '<g style="opacity:' + cyc.blank.toFixed(3) + '">' + blankSvg(K, G, P) + "</g>";
  shaftEl.innerHTML = out;
}
function place() {
  const car = translateAlong(P, [cyc.xt - X_END, 0, 0]);
  const sl = translateAlong(P, [cyc.xt - X_END, RETRACT * cyc.ret, 0]);
  cars.forEach((el) => el.setAttribute("transform", car));
  slides.forEach((el) => el.setAttribute("transform", sl));
}
function drawJaws() {
  const j = jawsSvg(K, G, P, theta);
  jawsBack.innerHTML = j.back;
  jawsFront.innerHTML = j.front;
}
function drawWear() {
  wearEl.setAttribute("d", wearPath(K, P, cyc.shownWear));
  glowEl.style.opacity = (0.15 + 0.6 * smooth(0, 1, cyc.shownWear)).toFixed(3);
}
function drawChips() {
  let html = "";
  for (const c of chips) {
    const [sx, sy] = iso(c.p, P);
    html += '<path class="lc-chip" data-fly="" style="opacity:' + c.a.toFixed(2) + '" d="' + chipPath(sx, sy, c.size * KS, c.turn) + '"/>';
  }
  chipLayer.innerHTML = html;
}
function readout() {
  const vc = vcNow(), f = fNow();
  const n = rpmOf(vc), t = passMin(vc, f), life = lifeMin(vc), N = partsPerEdge(vc, f), cost = costOf(vc, f);
  const l1 = "Vc " + vc + " · f " + fmt(f, 2) + " → n " + grouped(n) + " " + T.rpm;
  const l2 = T.pass + " " + L_MM + " ÷ (" + fmt(f, 2) + " × " + grouped(n) + ") = " + fmt(t * 60, 1) + " s";
  const l3 = T.life + ' <span class="lc-acc">' + fmt(life, 1) + " min</span> " + '<span class="lc-mute">(' + T.typ + ")</span>";
  const l4 = Math.floor(N) + " " + T.per;
  const l5 = euro(cost) + " " + T.cost + ' <span class="lc-mute">(' + T.model + ")</span>";
  [l1, l2, l3, l4, l5].forEach((html, i) => { if (lines[i].innerHTML !== html) lines[i].innerHTML = html; });
}
function draw() {
  KNOBS.forEach((_, i) => { knobEls[i].setAttribute("d", knobPointer(i, knob[i].x)); sels[i].toggleAttribute("data-on", i === selected); });
  place();
  drawShaft();
  drawJaws();
  drawWear();
  drawChips();
  readout();
}
function describe() {
  const vc = snapVc(knob[0].target), f = snapF(knob[1].target);
  const which = selected === 0 ? T.vc + " " + vc + " m/min" : T.f + " " + fmt(f, 2) + " mm";
  stage.setAttribute("aria-valuenow", String(selected === 0 ? vc : f));
  stage.setAttribute("aria-valuemin", String(ranges[selected][0]));
  stage.setAttribute("aria-valuemax", String(ranges[selected][1]));
  stage.setAttribute("aria-valuetext", which + "; " + grouped(rpmOf(vc)) + " " + T.rpm + ", " + T.pass + " " + fmt(passMin(vc, f) * 60, 1) + " s, " + T.life + " " + fmt(lifeMin(vc), 1) + " min, " + Math.floor(partsPerEdge(vc, f)) + " " + T.per + ", " + euro(costOf(vc, f)) + " " + T.cost);
}
let quietTimer = 0;
function announce(text) {
  clearTimeout(quietTimer);
  quietTimer = setTimeout(() => {
    if (text) { announcer.textContent = text; return; }
    const vc = snapVc(knob[0].target), f = snapF(knob[1].target);
    announcer.textContent = T.at + " Vc " + vc + ", f " + fmt(f, 2) + ": " + T.life + " " + fmt(lifeMin(vc), 1) + " min, " + Math.floor(partsPerEdge(vc, f)) + " " + T.per + ", " + euro(costOf(vc, f)) + " " + T.cost + ".";
  }, text ? 0 : 700);
}

// ------------------------------------------------ the machining cycle
// approach → cut → retract → return → (edge change) → load a new blank → approach
const DUR = { approach: 0.35, retract: 0.25, return: 0.8, change: 1.4, load: 0.6 };
cyc.cutTo = X_END;
function stepCycle(dt) {
  const vc = vcNow(), f = fNow();
  cyc.t += dt;
  if (cyc.phase === "approach") {
    cyc.ret = 1 - smooth(0, DUR.approach, cyc.t);
    if (cyc.t >= DUR.approach) { cyc.phase = "cut"; cyc.t = 0; cyc.ret = 0; }
  } else if (cyc.phase === "cut") {
    const secs = passMin(vc, f) * 60;
    cyc.prog = Math.min(1, cyc.prog + (dt * TS) / secs);
    cyc.wear += (dt * TS) / (lifeMin(vc) * 60);
    cyc.xt = X_END - TRAVEL * cyc.prog;
    cyc.cutTo = cyc.xt;
    chipClock += dt;
    if (chipClock > 0.5) { chipClock = 0; spawnChip(); }
    if (cyc.prog >= 1) { cyc.phase = "retract"; cyc.t = 0; }
  } else if (cyc.phase === "retract") {
    cyc.ret = smooth(0, DUR.retract, cyc.t);
    if (cyc.t >= DUR.retract) { cyc.phase = "return"; cyc.t = 0; }
  } else if (cyc.phase === "return") {
    cyc.xt = X_STOP + TRAVEL * smooth(0, DUR.return, cyc.t);
    if (cyc.t >= DUR.return) { cyc.xt = X_END; cyc.t = 0; cyc.phase = cyc.wear >= 1 ? "change" : "load"; if (cyc.phase === "change") announce(T.changed + " · " + (cyc.edges + 1) + " " + T.edges); }
  } else if (cyc.phase === "change") {
    if (cyc.t >= DUR.change) { cyc.wear = 0; cyc.edges++; cyc.phase = "load"; cyc.t = 0; }
  } else if (cyc.phase === "load") {
    cyc.blank = smooth(0, DUR.load, cyc.t);
    if (cyc.t >= DUR.load) { cyc.blank = 0; cyc.prog = 0; cyc.cutTo = X_END; cyc.phase = "approach"; cyc.t = 0; }
  }
  // the wear land follows the model; it fades away when the edge is changed
  const goal = cyc.phase === "change" ? 0 : Math.min(1, cyc.wear);
  cyc.shownWear += (goal - cyc.shownWear) * (1 - Math.exp(-dt / (cyc.phase === "change" ? 0.35 : 0.12)));
}
function spawnChip() {
  if (chips.length > 7) return;
  chips.push({ p0: [cyc.xt, TIP[1] + 0.6, Z_C + 0.6], p: [cyc.xt, TIP[1] + 0.6, Z_C + 0.6], age: 0, a: 0, size: 2.8 + Math.random() * 0.8, turn0: Math.random() * 6.28, turn: 0, spinRate: 2.2 + Math.random() * 1.6 });
}
function stepChips(dt) {
  for (const c of chips) {
    c.age += dt;
    const t = c.age;
    c.p = [c.p0[0] - 16 * t, c.p0[1] + 12 * t, c.p0[2] + 14 * t - 20 * t * t];
    c.turn = c.turn0 + c.spinRate * t;
    c.a = smooth(0, 0.12, t) * (1 - smooth(TRAY_TOP + 8, TRAY_TOP, c.p[2]) * (c.p[2] < Z_C ? 1 : 0));
  }
  for (let i = chips.length - 1; i >= 0; i--) if (chips[i].p[2] <= TRAY_TOP + 0.2) chips.splice(i, 1);
}

// The still pose: halfway through a pass, wear as it would be after ten parts.
function stillPose() {
  const vc = snapVc(knob[0].target), f = snapF(knob[1].target);
  chips.length = 0;
  cyc.phase = "cut"; cyc.t = 0; cyc.prog = 0.5; cyc.xt = X_END - TRAVEL * 0.5; cyc.cutTo = cyc.xt; cyc.ret = 0; cyc.blank = 0;
  cyc.wear = Math.min(1, (10 * passMin(vc, f)) / lifeMin(vc)); cyc.shownWear = cyc.wear;
}

// ------------------------------------------------ idle tour
// Start at the economic speed (Vc 250: T = 15 min). Then run fast at 400: the
// pass is quicker but the edge wears out in about 15 parts and is changed. Then
// slow at 150: the edge hardly wears but every pass is long. Then back to 250
// with a heavier feed.
const TOUR = [[0, 250, 0.25], [5, 400, 0.25], [40, 150, 0.25], [52, 250, 0.25], [56, 250, 0.35], [66, 250, 0.25]];
const TOUR_LEN = 72;
function tourAt(clock) {
  const t = clock % TOUR_LEN;
  let value = TOUR[0];
  for (const step of TOUR) { if (t < step[0]) break; value = step; }
  return value;
}

let frame = 0, last = 0, visible = false, touring = !still.matches, tourClock = 0, idleTimer = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) {
    tourClock += dt;
    const [, vc, f] = tourAt(tourClock);
    if (vc !== knob[0].target || f !== knob[1].target) { selected = vc !== knob[0].target ? 0 : f !== knob[1].target ? 1 : selected; knob[0].target = vc; knob[1].target = f; describe(); }
  }
  knob.forEach((kn) => {
    if (calm) kn.x = kn.target;
    else { kn.x += (kn.target - kn.x) * (1 - Math.exp(-dt / 0.16)); if (Math.abs(kn.target - kn.x) < 1e-3) kn.x = kn.target; }
  });
  if (calm) { stillPose(); }
  else {
    stepCycle(dt);
    stepChips(dt);
    const goal = rpmOf(vcNow()) / 3600; // shown slowed: revolutions per second
    spin += (goal - spin) * (1 - Math.exp(-dt / 0.45));
    theta = (theta + dt * spin * 2 * Math.PI) % (2 * Math.PI);
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
function setKnob(i, value) {
  steer();
  selected = i;
  knob[i].target = i === 0 ? snapVc(value) : snapF(value);
  if (still.matches) knob[i].x = knob[i].target;
  describe();
  announce();
  kick();
}
const base = (i) => (touring ? (i === 0 ? snapVc(knob[0].x) : snapF(knob[1].x)) : knob[i].target);
const STEP = [10, 0.01], BIG = [50, 0.05];

// ------------------------------------------------ pointer: tap a knob to step, drag sideways to set
const knobScreen = KNOBS.map((kn) => iso([kn.at[0], kn.at[1], KNOB_TOP], P));
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearest([x, y]) {
  let best = 0, bestD = Infinity;
  knobScreen.forEach(([kx, ky], i) => { const d = Math.hypot(x - kx, y - ky); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const p = toView(event);
  const i = nearest(p);
  press = { i, x0: p[0], start: base(i), dragging: false, id: event.pointerId };
  selected = i;
  steer();
  describe();
  kick();
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const dx = toView(event)[0] - press.x0;
  if (!press.dragging && Math.abs(dx) > 6) { press.dragging = true; try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setKnob(press.i, press.start + dx * (press.i === 0 ? 1.6 : 0.002));
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (!press.dragging && event.type === "pointerup") {
    const r = ranges[press.i];
    const next = press.start + BIG[press.i];
    setKnob(press.i, next > r[1] + 1e-9 ? r[0] : next);
  }
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);

// ------------------------------------------------ keyboard
stage.addEventListener("keydown", (event) => {
  const i = selected;
  const step = event.shiftKey ? BIG[i] : STEP[i];
  let handled = true;
  if (event.key === "ArrowUp") setKnob(i, base(i) + step);
  else if (event.key === "ArrowDown") setKnob(i, base(i) - step);
  else if (event.key === "PageUp") setKnob(i, base(i) + BIG[i]);
  else if (event.key === "PageDown") setKnob(i, base(i) - BIG[i]);
  else if (event.key === "Home") setKnob(i, ranges[i][0]);
  else if (event.key === "End") setKnob(i, ranges[i][1]);
  else if (event.key === "ArrowLeft" || event.key === "1") { steer(); selected = 0; describe(); kick(); }
  else if (event.key === "ArrowRight" || event.key === "2") { steer(); selected = 1; describe(); kick(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); announce(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { cyc.phase = "approach"; cyc.t = 0; cyc.prog = 0; cyc.xt = X_END; cyc.cutTo = X_END; cyc.ret = 1; run(); } });
if (still.matches) stillPose();
describe();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Snijsnelheid, voeding en standtijd",
    hint: "Tik of sleep een knop",
    knobs: "links Vc · rechts f",
    time: "1 s = 10 s",
    model: "Kostenmodel: machine €60/u, laden 0,5 min, snijkant wisselen 1 min + €4. Taylor-exponent 0,25 is een typische waarde.",
    label: LABEL_NL,
    aria: "Twee knoppen: snijsnelheid Vc van 150 tot 400 m/min en voeding f van 0,10 tot 0,40 mm per omwenteling. Pijl links en rechts kiest de knop, pijl omhoog en omlaag verandert de waarde (Shift: grotere stap), Home en End gaan naar het minimum en maximum.",
  },
  en: {
    title: "Cutting speed, feed and tool life",
    hint: "Tap or drag a knob",
    knobs: "left Vc · right f",
    time: "1 s = 10 s",
    model: "Cost model: machine €60/h, load 0.5 min, edge change 1 min + €4. The Taylor exponent 0.25 is a typical value.",
    label: LABEL_EN,
    aria: "Two knobs: cutting speed Vc from 150 to 400 m/min and feed f from 0.10 to 0.40 mm per revolution. Left and right arrows pick a knob, up and down change its value (Shift: bigger step), Home and End go to the minimum and maximum.",
  },
};

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="lc-stage" tabindex="0" role="slider" aria-label="${STRINGS.nl.aria}" aria-valuemin="${VC[0]}" aria-valuemax="${VC[1]}" aria-valuenow="${START.vc}">${svg}</div><div class="lc-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="lc-line"></span>'.repeat(5)}</span><span class="lc-model" data-model>${STRINGS.nl.model}</span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-knobs>${STRINGS.nl.knobs}</span><br><span data-time>${STRINGS.nl.time}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-knobs]").textContent=s.knobs;h.querySelector("[data-time]").textContent=s.time;
document.querySelector("[data-model]").textContent=s.model;
var st=document.querySelector(".lc-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + latheScript + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`knobs ${Math.hypot(knobScreen[0][0] - knobScreen[1][0], knobScreen[0][1] - knobScreen[1][1]).toFixed(1)} vb apart`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

// the insert item also carries the soft wear glow, which reaches past its body by design
A.auditOrExit(R, P, { frames: A.uniformStates(20), apart: true, cover: ["slide.insert"] });
