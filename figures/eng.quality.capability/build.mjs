// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Capability: Cp and Cpk" (eng.quality.capability, module Quality basics, level 1).
//
//   node figures/eng.quality.capability/build.mjs
//
// Writes src/content/courses/figures/eng.quality.capability.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark and ?lang=nl|en from its URL (defaults: prefers-color-scheme,
// Dutch).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL =
  process.env.ANATOMY_SKILL ??
  "/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy";
const k = await import(pathToFileURL(join(SKILL, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.quality.capability.html");

// ---------------------------------------------------------------- the model
// A bean machine (Galton board) that "turns" a diameter of nominal 10.000 mm.
// Every active pin row knocks a ball sideways by a normal step with standard
// deviation SIGMA_ROW, so with n active rows the landing point is normal with
// σ = SIGMA_ROW · √n around μ, the hopper outlet's position. Four rows give the
// lesson's σ = 0.0125 mm, so with spec 9.95–10.05 (0.10 wide) Cp = 0.10 / 0.075 = 1.33.
//   Cp  = (USL − LSL) / 6σ
//   Cpk = min(USL − μ, μ − LSL) / 3σ
//   outside spec = Φ((LSL − μ)/σ) + 1 − Φ((USL − μ)/σ)
// Cp, Cpk and the share outside spec come from the set μ and σ, never from the
// balls. The balls are a live sample of the same distribution: they land in
// bins 0.01 mm wide, and the bins leak (time constant TAU) so the histogram
// shows the last few seconds. A bin outside the gates has an open floor, and
// its balls drop into the reject tray.
const NOMINAL = 10;
const SIGMA_ROW = 0.00625; // mm per active pin row
const ROWS = 9;
const BIN_MM = 0.01;
const BINS = 20; // 9.90 … 10.10
const MU_RANGE = [9.96, 10.04];
const LSL_RANGE = [9.91, 9.99];
const USL_RANGE = [10.01, 10.09];
const START = { mu: 10, rows: 4, lsl: 9.95, usl: 10.05 };
const TARGET = 1.33;
const RATE = 14; // balls per second
const TAU = 4; // s, bin leak
const REJECT_LIFE = 40; // s a reject stays visible in the tray

// ---------------------------------------------------------------- the world
// World units: 900 per mm across the board, so one bin is 9 units wide.
const UNIT = 900;
const BIN_W = BIN_MM * UNIT; // 9
const HALF = (BINS / 2) * BIN_W; // 90
const WIDTH = 600;
const HEIGHT = 500;

const BASE = { x: -118, y: -16, w: 244, d: 50, r: 6 };
const BASE_H = 8;
const FOOT_H = 4;
const POST_W = 10;
const POST_Y = [-8, 18];
const POST_TOP = 196;
const POSTS = [-96 - POST_W, 96];
const BOARD = { x: -96, y: -4, w: 192, d: 4, r: 0.4 };
const BOARD_Z = [18, POST_TOP];
const BEAM = { x: -108, y: -10, w: 216, d: 30, r: 1.2 };
const BEAM_Z = [POST_TOP, POST_TOP + 6];
const RULER = { x: -96, y: 0, w: 192, d: 14, r: 0.4 };
const RULER_Z = [18, 24];
const BIN_FLOOR = RULER_Z[1];
const BIN_TOP = 80;
const BALL_H = 1.4; // column height per ball
const BIN_D = 12;
const DIV_T = 1.2;
const PIN_Y = 8;
const PIN_R = 1.25;
const ROW_Z = Array.from({ length: ROWS }, (_, j) => 146 - 7 * j);
const BALL_R = 1.8;
const BALL_Y = 4.5;
const TRAY = { x: -94, y: -6, w: 188, d: 24, r: 1 };
const TRAY_WALL = 1.6;
const TRAY_H = 7;
const TRAY_FLOOR = 1.6;
const ROD_Y = 12;
const ROD_Z = 182;
const ROD_R = 1.5;
const CAR = { w: 18, y: 4, d: 15, z: [176, 188] };
const HOPPER_Y = [1, 10];
const HOPPER_Z = [160, 176];
const OUTLET_Z = 154;
const KNOB_X = [108.5, 117];
const KNOB_R = 7;
const LEAD = 6; // world units of carriage travel per knob turn
const KNURL = 28;
const KNURL_FRAMES = 12;
const LEVER_X = POSTS[0] + POST_W / 2; // -101
const LEVER_Y = POST_Y[1];
const GATE_Y = RULER.y + RULER.d;
const GATE_Z = [15, 26.5];

const mmToX = (mm) => (mm - NOMINAL) * UNIT;
const binLeft = (i) => -HALF + i * BIN_W;
const sigmaOf = (rows) => SIGMA_ROW * Math.sqrt(rows);

const FIT = [
  ...k.boxCorners(BASE, -BASE_H - FOOT_H, 0),
  ...k.boxCorners(BEAM, BEAM_Z[0], BEAM_Z[1]),
  [KNOB_X[1], ROD_Y + KNOB_R, ROD_Z + KNOB_R],
  [KNOB_X[1], ROD_Y - KNOB_R, ROD_Z - KNOB_R],
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 72);
const ELEVATION = Number(process.env.EL ?? 20);
const P = k.fitProjection(FIT, WIDTH, HEIGHT, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });

const at = (point) => k.iso(point, P);
let solids = 0;
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const face = (points) => k.pathOf(points.map(at), true);
const SCALE = k.cameraOf(P).k; // screen px per world unit
const BALL_PX = +(BALL_R * SCALE).toFixed(2);

// ---------------------------------------------------------------- base
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(BASE, 12))) out.push(S(k.cylinder(x, y, 5, -BASE_H - FOOT_H, FOOT_H, P, 24), { tone: "lo" }));
  out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 6, 1.2), { tone: "mid", inner: L(k.sideSeam(BASE, -BASE_H + 3, P, 6), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 4), 0, P, 6), { tone: "faint" }));
  const screws = k.corners(BASE, 8);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 1.9, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // label plate, front left
  const label = { x: -76, y: 22, w: 30, d: 8, r: 0.8 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.2), 0.8, P, 3), { tone: "faint" }));
  out.push(L(k.lineOnTop([-73, 24.4], [-55, 24.4], 0.8, P) + k.lineOnTop([-73, 26.2], [-60, 26.2], 0.8, P) + k.lineOnTop([-73, 28], [-64, 28], 0.8, P), { tone: "lo", free: true }));
  out.push(D([at([-48.6, 23.8, 0.8]), at([-48.6, 28.2, 0.8])], { size: 0.4 }));
  return out.join("");
}

// ---------------------------------------------------------------- reject tray
// Floor, back and left wall first, then the rejects, then the right and front walls.
const TRAY_INNER = k.insetPlan(TRAY, TRAY_WALL);
function trayBack() {
  const out = [];
  out.push(S(k.slabOf(TRAY, 0, TRAY_FLOOR, P, 2, 0.3), { tone: "lo" }));
  out.push(S(k.slabOf({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: TRAY_WALL, r: 0.3 }, TRAY_FLOOR, TRAY_H - TRAY_FLOOR, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: TRAY.x, y: TRAY.y, w: TRAY_WALL, d: TRAY.d, r: 0.3 }, TRAY_FLOOR, TRAY_H - TRAY_FLOOR, P, 2), { tone: "mid" }));
  return out.join("");
}
function trayFront() {
  const out = [];
  out.push(S(k.slabOf({ x: TRAY.x + TRAY.w - TRAY_WALL, y: TRAY.y, w: TRAY_WALL, d: TRAY.d, r: 0.3 }, TRAY_FLOOR, TRAY_H - TRAY_FLOOR, P, 2), { tone: "mid" }));
  const front = { x: TRAY.x, y: TRAY.y + TRAY.d - TRAY_WALL, w: TRAY.w, d: TRAY_WALL, r: 0.3 };
  out.push(S(k.slabOf(front, TRAY_FLOOR, TRAY_H - TRAY_FLOOR, P, 2, 0.3), { tone: "mid", inner: L(k.sideSeam(front, 3.4, P, 2), { tone: "faint" }) }));
  return out.join("");
}

// ---------------------------------------------------------------- posts, board, pins
function post(x0) {
  const p = { x: x0, y: POST_Y[0], w: POST_W, d: POST_Y[1] - POST_Y[0], r: 0.8 };
  return S(k.slabOf(p, 0, POST_TOP, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(p, 10, P, 3), { tone: "faint" }) });
}

function board() {
  const out = [];
  out.push(S(k.slabOf(BOARD, BOARD_Z[0], BOARD_Z[1] - BOARD_Z[0], P, 2), { tone: "lo", crease: "none" }));
  // pin rows: a hole at the board face (retracted) and a pin with its head at PIN_Y (active)
  ROW_Z.forEach((z, j) => {
    const xs = [];
    for (let x = -HALF + BIN_W / 2 + (j % 2 ? BIN_W / 2 : 0) - BIN_W; x <= HALF - 2; x += BIN_W) if (x >= -HALF + 2) xs.push(x);
    const holes = xs.map((x) => k.sideRing([x, 0, z], PIN_R * 0.9, "y", P, 14)).join("");
    const shanks = xs.map((x) => k.segment([x + PIN_R * 0.7, 0, z], [x + PIN_R * 0.7, PIN_Y, z], P)).join("");
    const heads = xs.map((x) => k.sideRing([x, PIN_Y, z], PIN_R, "y", P, 16)).join("");
    out.push(`<g class="cc-row" data-row="${j}"><path class="cc-hole" d="${holes}"/><path class="iso-line cc-shank" data-tone="lo" d="${shanks}"/><path class="cc-head" d="${heads}"/></g>`);
  });
  return out.join("");
}

// ---------------------------------------------------------------- ruler, bins and gates
function ruler() {
  const out = [];
  out.push(S(k.slabOf(RULER, RULER_Z[0], RULER_Z[1] - RULER_Z[0], P, 2, 0.3), { tone: "mid" }));
  // floor slots: an open floor reads as a dark slot under the bin
  for (let i = 0; i < BINS; i++) {
    const slot = { x: binLeft(i) + DIV_T / 2 + 1, y: 2, w: BIN_W - DIV_T - 2, d: BIN_D - 4, r: 0.6 };
    out.push(`<path class="cc-slot" data-slot="${i}" d="${k.planOutline(slot, BIN_FLOOR, P, 2)}"/>`);
  }
  // scale: a tick at every bin edge (0.01 mm), long ticks every 0.05 mm, the nominal hi
  const ticks = k.sideTicks(-HALF, HALF, BIN_W, 5, GATE_Y, RULER_Z[1], [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major.split("M").filter(Boolean).map((s) => "M" + s).filter((d) => !d.startsWith(`M${tenth(at([0, GATE_Y, RULER_Z[1]])[0])} `)).join(""), { tone: "mid" }));
  out.push(L(k.segment([0, GATE_Y, RULER_Z[1]], [0, GATE_Y, RULER_Z[1] - 3.4], P), { tone: "hi" }));
  out.push(D([-HALF + 3, HALF - 3].map((x) => at([x, GATE_Y, RULER_Z[0] + 2])), { size: 0.45 }));
  return out.join("");
}
function tenth(v) {
  const text = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return text === "-0" ? "0" : text;
}

const divider = (i) => {
  const x = binLeft(i);
  return S(k.slabOf({ x: x - DIV_T / 2, y: 0, w: DIV_T, d: BIN_D, r: 0.2 }, BIN_FLOOR, BIN_TOP - BIN_FLOOR, P, 2), { tone: "mid", crease: "faint" });
};
// The ball column in a bin: a solid whose paths the live script rebuilds.
const columnPlan = (i) => ({ x: binLeft(i) + DIV_T / 2, y: 0, w: BIN_W - DIV_T, d: BIN_D, r: 0.2 });
function column(i) {
  const shades = [0, 1, 2, 3].map((s) => `<path class="iso-shade" data-shade="${s}" d=""/>`).join("");
  return `<g class="iso-solid cc-col" data-col="${i}" data-lit="" style="display:none"><path class="iso-fill" d=""/>${shades}<path class="iso-top" d=""/><path class="iso-line iso-crease" data-tone="lo" d=""/><path class="iso-line iso-edge" data-tone="hi" d=""/></g>`;
}
function bins() {
  const out = [];
  for (let i = 0; i < BINS; i++) {
    out.push(divider(i), column(i), `<g data-in="${i}"><path class="iso-line cc-mark" data-mark="${i}" data-tone="mid" d=""/></g>`);
  }
  out.push(divider(BINS));
  return out.join("");
}
// A gate: a block riding the ruler's front face, a knurled thumb screw, and a
// flag rising up the bin wall at the spec limit. Built at x = 0 and moved.
function gate(name) {
  const out = [];
  const block = { x: -4.5, y: GATE_Y, w: 9, d: 4.4, r: 0.6 };
  out.push(S(k.slabOf(block, GATE_Z[0], GATE_Z[1] - GATE_Z[0], P, 2, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(block, RULER_Z[1], P, 2), { tone: "lo" }) }));
  const flag = { x: -0.7, y: BIN_D, w: 1.4, d: GATE_Y + 1.2 - BIN_D, r: 0.2 };
  out.push(S(k.slabOf(flag, GATE_Z[1], BIN_TOP + 2 - GATE_Z[1], P, 2), { tone: "hi", crease: "lo" }));
  const F = G.frameAlong([0, GATE_Y + block.d, (GATE_Z[0] + GATE_Z[1]) / 2], [0, 1, 0]);
  out.push(S(G.disc(0, 1.2, 1.6, F, P), { tone: "hi", crease: "lo" }));
  out.push(S(G.disc(1.2, 4.4, 2.6, F, P), { tone: "hi", crease: "lo", inner: k.fadedSvg(G.ribsOf(F, 1.2, 4.4, 2.6, 18, P, { fade: [0.1, 0.55] }), { tone: "lo" }) }));
  out.push(D([at([0, GATE_Y + block.d + 4.4, (GATE_Z[0] + GATE_Z[1]) / 2])], { size: 0.5, tone: "hi" }));
  return `<g data-gate="${name}">${out.join("")}</g>`;
}

// ---------------------------------------------------------------- top: beam, lead screw, carriage, hopper, knob
function beam() {
  const out = [];
  out.push(S(k.slabOf(BEAM, BEAM_Z[0], BEAM_Z[1] - BEAM_Z[0], P, 3, 0.5), { tone: "mid" }));
  const fy = BEAM.y + BEAM.d;
  // μ scale on the beam's front face: 0.005 mm minor, 0.01 mm major, nominal hi
  const lo = mmToX(MU_RANGE[0]) - 4.5;
  const hi = mmToX(MU_RANGE[1]) + 4.5;
  const t = k.sideTicks(lo, hi, BIN_W / 2, 2, fy, BEAM_Z[1], [1.4, 2.6], P);
  const zero = `M${tenth(at([0, fy, BEAM_Z[1]])[0])} `;
  out.push(L(t.minor, { tone: "lo" }), L(t.major.split("M").filter(Boolean).map((s) => "M" + s).filter((d) => !d.startsWith(zero)).join(""), { tone: "mid" }));
  out.push(L(k.segment([0, fy, BEAM_Z[1]], [0, fy, BEAM_Z[1] - 3.4], P), { tone: "hi" }));
  out.push(D([-100, 100].map((x) => at([x, fy - 13, BEAM_Z[1]])), { size: 0.45 }));
  return out.join("");
}

function rod() {
  const F = G.frameAlong([POSTS[0] + POST_W, ROD_Y, ROD_Z], [1, 0, 0]);
  const len = POSTS[1] - (POSTS[0] + POST_W);
  // a lead screw: faint thread rings along it
  const threads = [];
  for (let s = 3; s < len - 1; s += 3) threads.push(G.arcOf(F, s, ROD_R, P));
  return S(G.disc(0, len, ROD_R, F, P), { tone: "mid", crease: "none", inner: L(threads.join(""), { tone: "faint" }) });
}

const HOPPER_POLY = [
  [-20, HOPPER_Z[1]],
  [20, HOPPER_Z[1]],
  [4.5, HOPPER_Z[0]],
  [-4.5, HOPPER_Z[0]],
];
function carriage() {
  const out = [];
  // hopper: a glass funnel of balls, hanging under the carriage
  const F = G.frameOf([0, HOPPER_Y[0], 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const hop = G.prismOf(F, HOPPER_POLY, 0, HOPPER_Y[1] - HOPPER_Y[0], P);
  solids++;
  out.push(k.solidSvg(hop, { tone: "hi", crease: "lo" }));
  // the balls inside, seen through the front glass, packed toward the outlet
  const fy = HOPPER_Y[1];
  const heap = [];
  const rows = [[-1.8, 1.8], [-3.6, 0, 3.6], [-7.2, -3.6, 0, 3.6, 7.2], [-10.8, -7.2, -3.6, 0, 3.6, 7.2, 10.8]];
  rows.forEach((xs, r) => xs.forEach((x) => heap.push([x + (r % 2 ? 1.8 : 0) * 0, fy, HOPPER_Z[0] + 2.2 + r * 3.2])));
  out.push(`<g class="cc-heap">${heap.map((p) => { const [sx, sy] = at(p); return `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${BALL_PX}"/>`; }).join("")}</g>`);
  const hw = 4.5 + (20 - 4.5) * ((HOPPER_Z[1] - 1.2 - HOPPER_Z[0]) / (HOPPER_Z[1] - HOPPER_Z[0]));
  out.push(L(k.segment([-hw, fy, HOPPER_Z[1] - 1.2], [hw, fy, HOPPER_Z[1] - 1.2], P), { tone: "faint" }));
  // outlet nozzle
  const noz = { x: -3, y: HOPPER_Y[0] + 1.8, w: 6, d: HOPPER_Y[1] - HOPPER_Y[0] - 3.6, r: 0.6 };
  out.push(S(k.slabOf(noz, OUTLET_Z, HOPPER_Z[0] - OUTLET_Z, P, 2, 0.3), { tone: "hi", crease: "lo" }));
  // carriage block round the lead screw, with two cap screws and a pointer blade to the μ scale
  const car = { x: -CAR.w / 2, y: CAR.y, w: CAR.w, d: CAR.d, r: 1 };
  out.push(S(k.slabOf(car, CAR.z[0], CAR.z[1] - CAR.z[0], P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(car, ROD_Z - 0.5, P, 3), { tone: "faint" }) }));
  out.push(D([[-5.5, CAR.y + CAR.d - 3], [5.5, CAR.y + CAR.d - 3]].map(([x, y]) => at([x, y, CAR.z[1]])), { size: 0.45 }));
  const blade = { x: -0.5, y: CAR.y + CAR.d, w: 1, d: BEAM.y + BEAM.d - CAR.y - CAR.d + 0.9, r: 0.1 };
  out.push(S(k.slabOf(blade, CAR.z[1] - 3, BEAM_Z[1] - 2.6 - (CAR.z[1] - 3), P, 2), { tone: "hi", crease: "lo" }));
  return `<g data-car="">${out.join("")}</g>`;
}

const KNOB_F = G.frameAlong([POSTS[1] + POST_W, ROD_Y, ROD_Z], [1, 0, 0]);
function knobRibs(frame) {
  const phase = (frame / KNURL_FRAMES) * ((2 * Math.PI) / KNURL);
  const s0 = KNOB_X[0] - (POSTS[1] + POST_W);
  const s1 = KNOB_X[1] - (POSTS[1] + POST_W);
  return k.fadedSvg(G.ribsOf(KNOB_F, s0 + 0.8, s1 - 0.8, KNOB_R, KNURL, P, { phase, fade: [0.08, 0.5] }), { tone: "lo" });
}
function knob() {
  const out = [];
  const s0 = KNOB_X[0] - (POSTS[1] + POST_W);
  const s1 = KNOB_X[1] - (POSTS[1] + POST_W);
  out.push(S(G.disc(0, 1.2, 4, KNOB_F, P), { tone: "mid" }));
  out.push(S(G.disc(1.2, s0, 2, KNOB_F, P), { tone: "mid", crease: "none" }));
  const seams = G.arcOf(KNOB_F, s0 + 0.8, KNOB_R, P) + G.arcOf(KNOB_F, s1 - 0.8, KNOB_R, P);
  out.push(S(G.disc(s0, s1, KNOB_R, KNOB_F, P), { tone: "mid", inner: L(seams, { tone: "faint" }) + `<g data-knurl="">${knobRibs(0)}</g>` }));
  out.push(L(G.circleOf(KNOB_F, s1, 2.4, P, 32), { tone: "lo" }));
  out.push(D([at([KNOB_X[1], ROD_Y, ROD_Z])], { size: 0.55, tone: "hi" }));
  return out.join("");
}

// ---------------------------------------------------------------- spread lever on the left post
function leverSlot() {
  const out = [];
  const fy = LEVER_Y;
  const x0 = LEVER_X;
  // slot down the post face, row detents beside it from the slot to the post's right edge
  const top = ROW_Z[0] + 3;
  const bottom = ROW_Z[ROWS - 1] - 3;
  out.push(`<path class="cc-void" d="${face([[x0 - 1, fy, top], [x0 + 1, fy, top], [x0 + 1, fy, bottom], [x0 - 1, fy, bottom]])}"/>`);
  out.push(L(face([[x0 - 1, fy, top], [x0 + 1, fy, top], [x0 + 1, fy, bottom], [x0 - 1, fy, bottom]]), { tone: "lo" }));
  const ticks = ROW_Z.map((z) => k.segment([x0 + 1, fy, z], [x0 + 3.4, fy, z], P)).join("");
  out.push(L(ticks, { tone: "lo" }));
  out.push(D([at([x0, fy, POST_TOP - 4]), at([x0, fy, 40])], { size: 0.45 }));
  return out.join("");
}
// built at row 0 and moved down along z
function lever() {
  const out = [];
  const z = ROW_Z[0];
  const slider = { x: LEVER_X - 4, y: LEVER_Y, w: 8, d: 3, r: 0.6 };
  out.push(S(k.slabOf(slider, z - 3, 6, P, 2, 0.3), { tone: "hi", crease: "lo" }));
  const F = G.frameAlong([LEVER_X, LEVER_Y + 3, z], [0, 1, 0]);
  out.push(S(G.disc(0, 5, 1.2, F, P), { tone: "hi", crease: "none" }));
  out.push(S(G.solidOf([[5, 2.6, 1], [6.2, 3.2, 1], [7.6, 3, 1], [8.6, 2.2, 1], [9.2, 0.8, 1]], F, P), { tone: "hi", crease: "lo" }));
  // index finger to the post edge, level with the last active row
  const finger = { x: LEVER_X + 4, y: LEVER_Y, w: POSTS[0] + POST_W - LEVER_X - 4, d: 1.2, r: 0.1 };
  out.push(S(k.slabOf(finger, z - 0.5, 1, P, 2), { tone: "hi", crease: "none" }));
  return `<g data-lever="">${out.join("")}</g>`;
}

// ---------------------------------------------------------------- assemble
const body = [
  base(),
  trayBack(),
  `<g data-layer="tray"></g>`,
  trayFront(),
  post(POSTS[0]),
  board(),
  rod(),
  ruler(),
  bins(),
  post(POSTS[1]),
  gate("lsl"),
  gate("usl"),
  beam(),
  knob(),
  carriage(),
  `<g data-layer="air"></g>`,
  leverSlot(),
  lever(),
];
const STATIC_SOLIDS = solids;
const PARTS = STATIC_SOLIDS + BINS; // + one ball column per bin

const LABEL_NL =
  "Een bonenmachine (Galtonbord) op een grondplaat: bovenin een glazen trechter met kogeltjes op een slede met een centreerknop, daaronder negen rijen pennen, een hendel die bepaalt hoeveel rijen meedoen, twintig bakjes van 0,01 mm op een liniaal met twee schuivende grenzen voor LSL en USL, en onderin een afkeurbak. De bakjes tussen de grenzen vullen zich tot een histogram; kogels buiten de grenzen vallen in de afkeurbak.";
const LABEL_EN =
  "A bean machine (Galton board) on a base plate: at the top a glass hopper of balls on a carriage with a centring knob, below it nine rows of pins, a lever that sets how many rows take part, twenty bins of 0.01 mm on a ruler with two sliding gates for LSL and USL, and a reject tray at the bottom. The bins between the gates fill into a histogram; balls outside the gates drop into the reject tray.";

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
  --cc-hair:rgba(240,233,218,.12);--cc-accent:#5C9FAE;--cc-void:#081A1E;--cc-col-face:#1F4E5A;--cc-col-top:#3A7A88;--cc-col-side:#28606D;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --cc-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --cc-hair:rgba(11,41,27,.14);--cc-accent:#276F81;--cc-void:#C9C0AA;--cc-col-face:#BCD6DA;--cc-col-top:#A6C9CF;--cc-col-side:#8DB8C0;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--cc-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 100px);min-height:200px;padding:26px 4px 72px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--cc-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 12px 14px}
.iso-plate-corner{font-family:var(--cc-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:0!important;color:var(--anatomy-muted);letter-spacing:0!important;max-width:44%}
.iso-plate-corner[data-corner="readout"]{font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.4;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.cc-line{display:block}
.cc-acc{color:var(--cc-accent);font-weight:600}
.cc-mute{color:var(--anatomy-muted)}
.cc-stage{position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:grab;border-radius:8px}
.cc-stage[data-drag]{cursor:grabbing}
.cc-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.cc-hit{position:absolute;width:48px;height:48px;margin:-24px 0 0 -24px;left:0;top:0;border-radius:50%;outline:none;pointer-events:none}
.cc-hit:focus-visible{box-shadow:0 0 0 1px var(--anatomy-muted)}
.cc-hole{fill:var(--cc-void);stroke:var(--anatomy-faint);stroke-width:var(--anatomy-weight)}
.cc-head{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);opacity:0;transition:opacity .25s}
.cc-shank{opacity:0;transition:opacity .25s}
.cc-row[data-on] .cc-head,.cc-row[data-on] .cc-shank{opacity:1}
.cc-slot{fill:var(--anatomy-top);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.cc-slot[data-open]{fill:var(--cc-void)}
.cc-void{fill:var(--cc-void);stroke:none}
.cc-heap circle,.cc-ball{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.cc-reject{fill:var(--anatomy-top);stroke:var(--anatomy-mid);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.cc-col[data-lit]>.iso-fill{fill:var(--cc-col-face)}
.cc-col[data-lit]>.iso-top{fill:var(--cc-col-top)}
.cc-col[data-lit]>.iso-shade{fill:var(--cc-col-side)}
.cc-col:not([data-lit])>.iso-edge{stroke:var(--anatomy-mid)}
.cc-mark[data-out]{stroke:var(--anatomy-lo)}
.cc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion: reduce){.cc-head,.cc-shank{transition:none}}
`;

// ---------------------------------------------------------------- live script
const KNURL_PATHS = Array.from({ length: KNURL_FRAMES }, (_, f) => knobRibs(f));
const COL_PLANS = Array.from({ length: BINS }, (_, i) => columnPlan(i));
const live = `
const P = ${JSON.stringify(P)};
const NOMINAL = ${NOMINAL}, SIGMA_ROW = ${SIGMA_ROW}, ROWS = ${ROWS}, BIN_MM = ${BIN_MM}, BINS = ${BINS};
const MU_RANGE = ${JSON.stringify(MU_RANGE)}, LSL_RANGE = ${JSON.stringify(LSL_RANGE)}, USL_RANGE = ${JSON.stringify(USL_RANGE)};
const START = ${JSON.stringify(START)}, TARGET = ${TARGET}, RATE = ${RATE}, TAU = ${TAU}, REJECT_LIFE = ${REJECT_LIFE};
const PER_MM = ${UNIT}, BIN_W = ${BIN_W}, HALF = ${HALF}, BIN_FLOOR = ${BIN_FLOOR}, BIN_TOP = ${BIN_TOP}, BIN_D = ${BIN_D}, DIV_T = ${DIV_T};
const ROW_Z = ${JSON.stringify(ROW_Z)}, BALL_H = ${BALL_H}, OUTLET_Z = ${OUTLET_Z}, BALL_R = ${BALL_R}, BALL_Y = ${BALL_Y}, BALL_PX = ${BALL_PX};
const TRAY_IN = ${JSON.stringify(TRAY_INNER)}, TRAY_FLOOR = ${TRAY_FLOOR};
const COL_PLANS = ${JSON.stringify(COL_PLANS)};
const KNURL_PATHS = ${JSON.stringify(KNURL_PATHS)};
const KNURL = ${KNURL}, KNURL_FRAMES = ${KNURL_FRAMES}, LEAD = ${LEAD};
const HIT = {
  knob: [${(KNOB_X[0] + KNOB_X[1]) / 2}, ${ROD_Y}, ${ROD_Z}],
  hopper: [0, ${BALL_Y}, ${(HOPPER_Z[0] + HOPPER_Z[1]) / 2}],
  lever: [${LEVER_X}, ${LEVER_Y + 6}, ${ROW_Z[0]}],
  gate: [0, ${GATE_Y + 6}, ${(GATE_Z[0] + GATE_Z[1]) / 2}],
};
const mmToX = (mm) => (mm - NOMINAL) * PER_MM;
const binLeft = (i) => -HALF + i * BIN_W;
const sigmaOf = (rows) => SIGMA_ROW * Math.sqrt(rows);
const rowZ = (r) => ROW_Z[0] + (ROW_Z[ROWS - 1] - ROW_Z[0]) * (r - 1) / (ROWS - 1);

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { out: "outside spec", meets: "meets (≥1.33)", fails: "does not meet", dec: ".", grp: ",", rows: "rows", row: "row", lsl: "Lower spec limit", usl: "Upper spec limit", knob: "Centring knob, process mean", lever: "Spread lever, active pin rows", now: "Now", lt: "< " }
  : { out: "buiten spec", meets: "voldoet (≥1,33)", fails: "voldoet niet", dec: ",", grp: ".", rows: "rijen", row: "rij", lsl: "Ondergrens", usl: "Bovengrens", knob: "Centreerknop, procesgemiddelde", lever: "Spreidingshendel, actieve penrijen", now: "Nu", lt: "< " };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);

const stage = document.querySelector(".cc-stage");
const svg = stage.querySelector("svg");
const air = svg.querySelector('[data-layer="air"]');
const tray = svg.querySelector('[data-layer="tray"]');
const slots = [...svg.querySelectorAll("[data-in]")];
const cols = [...svg.querySelectorAll(".cc-col")].map((g) => ({ g, fill: g.querySelector(".iso-fill"), shades: [...g.querySelectorAll(".iso-shade")], top: g.querySelector(".iso-top"), crease: g.querySelector(".iso-crease"), edge: g.querySelector(".iso-edge"), h: -1, lit: true }));
const markEls = [...svg.querySelectorAll(".cc-mark")];
const floorEls = [...svg.querySelectorAll(".cc-slot")];
const rowEls = [...svg.querySelectorAll(".cc-row")];
const car = svg.querySelector("[data-car]");
const leverEl = svg.querySelector("[data-lever]");
const knurlEl = svg.querySelector("[data-knurl]");
const gateEls = { lsl: svg.querySelector('[data-gate="lsl"]'), usl: svg.querySelector('[data-gate="usl"]') };
const lines = [...document.querySelectorAll("[data-readout] .cc-line")];
const announcer = document.querySelector(".cc-sr");
const hits = Object.fromEntries([...document.querySelectorAll(".cc-hit")].map((el) => [el.dataset.hit, el]));
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const NS = "http://www.w3.org/2000/svg";

// ------------------------------------------------ the normal model
function erfc(x) {
  const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}
const cdf = (z) => 0.5 * erfc(-z / Math.SQRT2);
const tail = (z) => 0.5 * erfc(z / Math.SQRT2); // P(Z > z)
function stats(s) {
  const sigma = sigmaOf(s.rows);
  const cp = (s.usl - s.lsl) / (6 * sigma);
  const cpk = Math.min(s.usl - s.mu, s.mu - s.lsl) / (3 * sigma);
  const out = tail((s.mu - s.lsl) / sigma) + tail((s.usl - s.mu) / sigma);
  return { sigma, cp, cpk, out, ok: cpk >= TARGET - 1e-9 };
}
let gauss2 = null;
function gauss() {
  if (gauss2 !== null) { const g = gauss2; gauss2 = null; return g; }
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  v = Math.random();
  const r = Math.sqrt(-2 * Math.log(u));
  gauss2 = r * Math.sin(2 * Math.PI * v);
  return r * Math.cos(2 * Math.PI * v);
}

// ------------------------------------------------ the controls: target and shown value
const ctl = {
  mu: { x: START.mu, target: START.mu, range: MU_RANGE, step: 0.001, big: 0.005, snap: 0.001 },
  rows: { x: START.rows, target: START.rows, range: [1, ROWS], step: 1, big: 3, snap: 1 },
  lsl: { x: START.lsl, target: START.lsl, range: LSL_RANGE, step: BIN_MM, big: 0.03, snap: BIN_MM },
  usl: { x: START.usl, target: START.usl, range: USL_RANGE, step: BIN_MM, big: 0.03, snap: BIN_MM },
};
const snapTo = (v, q) => Math.round(v / q) * q;
// what the machine is set to right now: read from where its parts are
const setting = () => ({
  mu: +snapTo(ctl.mu.x, 0.001).toFixed(3),
  rows: Math.round(ctl.rows.x),
  lsl: +snapTo(ctl.lsl.x, BIN_MM).toFixed(2),
  usl: +snapTo(ctl.usl.x, BIN_MM).toFixed(2),
});
const inSpec = (i, s) => {
  const lo = NOMINAL + (i - BINS / 2) * BIN_MM, hi = lo + BIN_MM;
  return lo >= s.lsl - 1e-9 && hi <= s.usl + 1e-9;
};
function binProb(i, s) {
  const sigma = sigmaOf(s.rows);
  const lo = NOMINAL + (i - BINS / 2) * BIN_MM, hi = lo + BIN_MM;
  const a = i === 0 ? 0 : cdf((lo - s.mu) / sigma);
  const b = i === BINS - 1 ? 1 : cdf((hi - s.mu) / sigma);
  return b - a;
}
const binOf = (x) => clamp(Math.floor((x + HALF) / BIN_W), 0, BINS - 1);

// ------------------------------------------------ balls
const level = new Array(BINS).fill(0);
const flying = [];
const resting = [];
let spawnClock = 0, simClock = 0;
function ballEl(cls) { const c = document.createElementNS(NS, "circle"); c.setAttribute("class", cls); c.setAttribute("r", BALL_PX); return c; }
// A ball's path: from the outlet through the active rows, each row a normal kick,
// then straight down into its bin (or through the open floor into the tray).
function launch(s) {
  const mu = mmToX(s.mu);
  const kick = SIGMA_ROW * PER_MM;
  const pts = [[mu, OUTLET_Z]];
  let x = mu;
  for (let r = 0; r < s.rows; r++) { x += kick * gauss(); pts.push([clamp(x, -HALF + 2.2, HALF - 2.2), ROW_Z[r]]); }
  const bin = binOf(x);
  const xl = clamp(x, binLeft(bin) + DIV_T / 2 + BALL_R, binLeft(bin + 1) - DIV_T / 2 - BALL_R);
  pts.push([xl, ROW_Z[s.rows - 1] - 6]);
  return { pts, bin, x: xl, z: OUTLET_Z, y: BALL_Y, el: ballEl("cc-ball"), where: "", spot: null, seg: 0 };
}
function place(el, p) { const [sx, sy] = iso(p, P); el.setAttribute("cx", sx.toFixed(1)); el.setAttribute("cy", sy.toFixed(1)); }
function move(b, where) {
  if (b.where === where) return;
  b.where = where;
  (where === "air" ? air : where === "tray" ? tray : slots[b.bin]).appendChild(b.el);
}
const SPEED = 105; // world units per second, falling
function fly(b, dt, s) {
  b.z -= SPEED * dt;
  const pts = b.pts;
  while (b.seg < pts.length - 1 && b.z <= pts[b.seg + 1][1]) b.seg++;
  if (b.seg < pts.length - 1) {
    const [x0, z0] = pts[b.seg], [x1, z1] = pts[b.seg + 1];
    b.x = x0 + (x1 - x0) * smooth(0, 1, (z0 - b.z) / (z0 - z1));
  } else b.x = pts[pts.length - 1][0];
  const open = !inSpec(b.bin, s);
  if (b.z > BIN_TOP + BALL_R) move(b, "air");
  else if (b.z > BIN_FLOOR - 1) {
    move(b, "bin");
    const lid = BIN_FLOOR + level[b.bin] * BALL_H + BALL_R;
    if (!open && b.z <= lid) { level[b.bin] += 1; b.el.remove(); return false; }
  } else move(b, "tray");
  if (b.z < BIN_FLOOR) {
    if (!b.spot) b.spot = heapSpot(b.bin, b.x);
    b.y += (b.spot[1] - b.y) * (1 - Math.exp(-dt / 0.08));
    b.x += (b.spot[0] - b.x) * (1 - Math.exp(-dt / 0.08));
    if (b.z <= b.spot[2]) { b.x = b.spot[0]; b.y = b.spot[1]; b.z = b.spot[2]; rest_(b); return false; }
  }
  place(b.el, [b.x, b.y, b.z]);
  return true;
}
function rest_(b) {
  b.el.setAttribute("class", "cc-reject");
  place(b.el, [b.x, b.y, b.z]);
  resting.push({ el: b.el, age: 0 });
  while (resting.length > 60) resting.shift().el.remove();
}
// Rejects pile up under the bin they fell from: three across, up to four layers.
const heap = new Array(BINS).fill(0);
function heapSpot(bin, x) {
  const n = heap[bin]++ % 12;
  const col = n % 3, layer = Math.floor(n / 3);
  const cx = (binLeft(bin) + binLeft(bin + 1)) / 2;
  const sx = clamp(cx + (layer % 2 ? 1.6 : -1.2) + (col - 1) * 0.6, TRAY_IN.x + BALL_R, TRAY_IN.x + TRAY_IN.w - BALL_R);
  return [sx, TRAY_IN.y + 3 + col * 3.5 + (layer % 2) * 1.6, TRAY_FLOOR + BALL_R + layer * 3];
}
function addReject(x, age) {
  const el = ballEl("cc-reject");
  tray.appendChild(el);
  place(el, heapSpot(binOf(x), x));
  resting.push({ el, age });
}
// The history a running machine would have: TAU × 4 seconds of balls.
function prefill(s) {
  level.fill(0);
  resting.forEach((r) => r.el.remove());
  resting.length = 0;
  heap.fill(0);
  const kick = SIGMA_ROW * PER_MM * Math.sqrt(s.rows);
  const n = Math.round(RATE * TAU * 4);
  for (let j = 0; j < n; j++) {
    const age = (n - j) / RATE;
    const x = mmToX(s.mu) + kick * gauss();
    const bin = binOf(x);
    if (inSpec(bin, s)) level[bin] += Math.exp(-age / TAU);
    else if (age < REJECT_LIFE) addReject(x, age);
  }
}
// reduced motion: the bins show the model, the tray a fixed share of rejects
function still_(s) {
  flying.forEach((b) => b.el.remove());
  flying.length = 0;
  resting.forEach((r) => r.el.remove());
  resting.length = 0;
  heap.fill(0);
  for (let i = 0; i < BINS; i++) level[i] = inSpec(i, s) ? RATE * TAU * binProb(i, s) : 0;
  const st = stats(s);
  const count = Math.min(40, Math.round(RATE * REJECT_LIFE * st.out));
  const sigma = sigmaOf(s.rows);
  const lowShare = st.out > 0 ? tail((s.mu - s.lsl) / sigma) / st.out : 0.5;
  for (let j = 0; j < count; j++) {
    const low = j < Math.round(count * lowShare);
    const x = low ? mmToX(s.lsl) - BIN_W * (0.3 + (j % 4) * 0.5) : mmToX(s.usl) + BIN_W * (0.3 + (j % 4) * 0.5);
    addReject(x, REJECT_LIFE * 0.4);
  }
}

// ------------------------------------------------ drawing
let lastKey = "";
function drawColumns(s) {
  for (let i = 0; i < BINS; i++) {
    const c = cols[i];
    const lit = inSpec(i, s);
    const h = Math.min(BIN_TOP - BIN_FLOOR - 1, level[i] * BALL_H);
    const hq = Math.round(h * 10) / 10;
    if (lit !== c.lit) { c.lit = lit; c.g.toggleAttribute("data-lit", lit); }
    if (hq === c.h) continue;
    c.h = hq;
    if (hq < 0.15) { c.g.style.display = "none"; continue; }
    c.g.style.display = "";
    const p = slabOf(COL_PLANS[i], BIN_FLOOR, hq, P, 2);
    c.fill.setAttribute("d", p.fill);
    p.shades.forEach((d, n) => c.shades[n].setAttribute("d", d || ""));
    c.top.setAttribute("d", p.top);
    c.crease.setAttribute("d", p.crease || "");
    c.edge.setAttribute("d", p.outline);
  }
}
function drawSetting(s) {
  const key = s.mu + "|" + s.rows + "|" + s.lsl + "|" + s.usl;
  if (key === lastKey) return false;
  lastKey = key;
  for (let i = 0; i < BINS; i++) {
    const open = !inSpec(i, s);
    floorEls[i].toggleAttribute("data-open", open);
    const e = RATE * TAU * binProb(i, s) * BALL_H;
    const el = markEls[i];
    el.toggleAttribute("data-out", open);
    if (e < 0.4 || e > BIN_TOP - BIN_FLOOR - 1) { el.setAttribute("d", ""); continue; }
    const z = BIN_FLOOR + e, y = BIN_D;
    el.setAttribute("d", segment([binLeft(i) - DIV_T / 2, y, z], [binLeft(i + 1) - DIV_T / 2, y, z], P));
  }
  rowEls.forEach((el, j) => el.toggleAttribute("data-on", j < s.rows));
  return true;
}
function drawParts() {
  const mx = mmToX(ctl.mu.x);
  car.setAttribute("transform", translateAlong(P, [mx, 0, 0]));
  const turns = mx / LEAD;
  const frac = ((turns * KNURL) % 1 + 1) % 1;
  const f = Math.floor(frac * KNURL_FRAMES) % KNURL_FRAMES;
  if (knurlEl.dataset.f !== String(f)) { knurlEl.dataset.f = String(f); knurlEl.innerHTML = KNURL_PATHS[f]; }
  leverEl.setAttribute("transform", translateAlong(P, [0, 0, rowZ(ctl.rows.x) - ROW_Z[0]]));
  gateEls.lsl.setAttribute("transform", translateAlong(P, [mmToX(ctl.lsl.x), 0, 0]));
  gateEls.usl.setAttribute("transform", translateAlong(P, [mmToX(ctl.usl.x), 0, 0]));
}
function hitPoint(name) {
  if (name === "knob") return HIT.knob;
  if (name === "rows") return [HIT.lever[0], HIT.lever[1], rowZ(ctl.rows.x)];
  return [mmToX(ctl[name].x), HIT.gate[1], HIT.gate[2]];
}
function placeHits() {
  const m = svg.getScreenCTM();
  if (!m) return;
  const box = stage.getBoundingClientRect();
  for (const name of ["knob", "rows", "lsl", "usl"]) {
    const [x, y] = iso(hitPoint(name), P);
    const pt = new DOMPoint(x, y).matrixTransform(m);
    hits[name].style.transform = "translate(" + (pt.x - box.left).toFixed(1) + "px," + (pt.y - box.top).toFixed(1) + "px)";
  }
}
function pctText(p) {
  const v = p * 100;
  if (v < 0.0001) return T.lt + fmt(0.0001, 4) + " %";
  if (v >= 10) return fmt(v, 1) + " %";
  const digits = Math.min(4, Math.max(1, 1 - Math.floor(Math.log10(v))));
  return fmt(v, digits) + " %";
}
function readout(s) {
  const st = stats(s);
  const l1 = "μ " + fmt(s.mu, 3) + " · σ " + fmt(st.sigma, 4) + " mm";
  const l2 = "Cp " + fmt(st.cp, 2) + " · Cpk " + fmt(st.cpk, 2);
  const l3 = T.out + " " + pctText(st.out);
  const l4 = st.ok ? '<span class="cc-acc">' + T.meets + "</span>" : '<span class="cc-mute">' + T.fails + "</span>";
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
}
function summary(s) {
  const st = stats(s);
  return "Cp " + fmt(st.cp, 2) + ", Cpk " + fmt(st.cpk, 2) + ", " + T.out + " " + pctText(st.out) + ", " + (st.ok ? T.meets : T.fails);
}
function describe() {
  const s = { mu: ctl.mu.target, rows: ctl.rows.target, lsl: ctl.lsl.target, usl: ctl.usl.target };
  const tailText = " · " + summary(s);
  const set = (name, now, text) => { const el = hits[name]; el.setAttribute("aria-valuenow", String(now)); el.setAttribute("aria-valuetext", text + tailText); };
  set("knob", s.mu.toFixed(3), "μ " + fmt(s.mu, 3) + " mm");
  set("rows", s.rows, s.rows + " " + (s.rows === 1 ? T.row : T.rows) + ", σ " + fmt(sigmaOf(s.rows), 4) + " mm");
  set("lsl", s.lsl.toFixed(2), "LSL " + fmt(s.lsl, 2) + " mm");
  set("usl", s.usl.toFixed(2), "USL " + fmt(s.usl, 2) + " mm");
}
let quietTimer = 0;
function announce() {
  clearTimeout(quietTimer);
  quietTimer = setTimeout(() => { announcer.textContent = T.now + ": " + summary({ mu: ctl.mu.target, rows: ctl.rows.target, lsl: ctl.lsl.target, usl: ctl.usl.target }) + "."; }, 700);
}

// ------------------------------------------------ idle tour
// Centred at Cp = Cpk = 1.33. Then the knob pushes μ 0.025 mm toward USL: Cp
// stays 1.33, Cpk falls to 0.67 and the right tail drops into the tray. Back to
// the centre, then eight pin rows (Cp 0.94, scrap on both sides), then three
// rows (Cp 1.54), then back to the start.
const TOUR = [
  [0, { mu: 10, rows: 4 }],
  [7, { mu: 10.025 }],
  [16, { mu: 10 }],
  [21, { rows: 8 }],
  [30, { rows: 3 }],
  [38, { rows: 4 }],
];
const TOUR_LEN = 44;
function tourAt(clock) {
  const t = clock % TOUR_LEN;
  const set = { mu: START.mu, rows: START.rows };
  for (const [when, step] of TOUR) { if (t < when) break; Object.assign(set, step); }
  return set;
}

let frame = 0, last = 0, visible = false, touring = !still.matches, tourClock = 0, idleTimer = 0;
function ease(c, dt, calm, tau) {
  if (calm) { c.x = c.target; return; }
  c.x += (c.target - c.x) * (1 - Math.exp(-dt / tau));
  if (Math.abs(c.target - c.x) < c.snap * 0.02) c.x = c.target;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) {
    tourClock += dt;
    const t = tourAt(tourClock);
    if (t.mu !== ctl.mu.target || t.rows !== ctl.rows.target) { ctl.mu.target = t.mu; ctl.rows.target = t.rows; describe(); }
  }
  ease(ctl.mu, dt, calm, 0.35);
  ease(ctl.rows, dt, calm, 0.25);
  ease(ctl.lsl, dt, calm, 0.18);
  ease(ctl.usl, dt, calm, 0.18);
  const s = setting();
  const changed = drawSetting(s);
  if (calm) { if (changed) still_(s); }
  else {
    simClock += dt;
    spawnClock += dt;
    while (spawnClock >= 1 / RATE) { spawnClock -= 1 / RATE; const b = launch(s); flying.push(b); move(b, "air"); place(b.el, [b.x, b.y, b.z]); }
    for (let i = flying.length - 1; i >= 0; i--) if (!fly(flying[i], dt, s)) flying.splice(i, 1);
    const keep = Math.exp(-dt / TAU), drain = Math.exp(-dt / 0.35);
    for (let i = 0; i < BINS; i++) level[i] *= inSpec(i, s) ? keep : drain;
    for (let i = resting.length - 1; i >= 0; i--) {
      const r = resting[i];
      r.age += dt;
      const a = 1 - smooth(REJECT_LIFE - 2, REJECT_LIFE, r.age);
      if (a <= 0) { r.el.remove(); resting.splice(i, 1); continue; }
      r.el.style.opacity = a < 1 ? a.toFixed(2) : "";
    }
  }
  drawColumns(s);
  drawParts();
  placeHits();
  readout(s);
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; run(); } }, 40000);
}
function setCtl(name, value) {
  steer();
  const c = ctl[name];
  let v = clamp(snapTo(value, c.snap), c.range[0], c.range[1]);
  if (name === "lsl") v = Math.min(v, ctl.usl.target - 2 * BIN_MM);
  if (name === "usl") v = Math.max(v, ctl.lsl.target + 2 * BIN_MM);
  v = +v.toFixed(name === "rows" ? 0 : 3);
  if (v === c.target) return;
  c.target = v;
  describe();
  announce();
  kick();
}
// a key pressed during the tour steps from the value the reader sees
const base = (name) => (touring ? +snapTo(ctl[name].x, ctl[name].snap).toFixed(3) : ctl[name].target);

// ------------------------------------------------ pointer: grab the nearest control and drag it
const AX = axisVector(P, [1, 0, 0]);
const AZ = axisVector(P, [0, 0, 1]);
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearest(p) {
  const m = svg.getScreenCTM();
  const px = m ? Math.hypot(m.a, m.b) : 1; // css px per view unit
  const cands = [["knob", HIT.knob], ["knob", [mmToX(ctl.mu.x), HIT.hopper[1], HIT.hopper[2]]], ["rows", hitPoint("rows")], ["lsl", hitPoint("lsl")], ["usl", hitPoint("usl")]];
  let best = null, bestD = Infinity;
  for (const [name, w] of cands) {
    const [x, y] = iso(w, P);
    const d = Math.hypot(p[0] - x, p[1] - y) * px;
    if (d < bestD) { bestD = d; best = name; }
  }
  return bestD <= 40 ? best : null;
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const p = toView(event);
  const name = nearest(p);
  if (!name) return;
  press = { name, p0: p, start: base(name === "knob" ? "mu" : name), dragging: false, id: event.pointerId };
  steer();
  kick();
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const p = toView(event);
  const d = [p[0] - press.p0[0], p[1] - press.p0[1]];
  if (!press.dragging && Math.hypot(d[0], d[1]) > 4) { press.dragging = true; stage.setAttribute("data-drag", ""); try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (!press.dragging) return;
  if (press.name === "rows") {
    const dz = (d[0] * AZ[0] + d[1] * AZ[1]) / (AZ[0] * AZ[0] + AZ[1] * AZ[1]);
    const r0 = press.start;
    setCtl("rows", r0 + (-dz) / ((ROW_Z[0] - ROW_Z[ROWS - 1]) / (ROWS - 1)));
  } else {
    const dx = (d[0] * AX[0] + d[1] * AX[1]) / (AX[0] * AX[0] + AX[1] * AX[1]);
    const name = press.name === "knob" ? "mu" : press.name;
    setCtl(name, press.start + dx / PER_MM);
  }
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (!press.dragging && event.type === "pointerup" && press.name === "rows") setCtl("rows", press.start >= ROWS ? 1 : press.start + 1);
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  stage.removeAttribute("data-drag");
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);

// ------------------------------------------------ keyboard: each control is a slider
for (const name of ["knob", "rows", "lsl", "usl"]) {
  const key = name === "knob" ? "mu" : name;
  const el = hits[name];
  el.addEventListener("keydown", (event) => {
    const c = ctl[key];
    const value = base(key);
    let handled = true;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") setCtl(key, value + (event.shiftKey ? c.big : c.step));
    else if (event.key === "ArrowDown" || event.key === "ArrowLeft") setCtl(key, value - (event.shiftKey ? c.big : c.step));
    else if (event.key === "PageUp") setCtl(key, value + c.big);
    else if (event.key === "PageDown") setCtl(key, value - c.big);
    else if (event.key === "Home") setCtl(key, c.range[0]);
    else if (event.key === "End") setCtl(key, c.range[1]);
    else handled = false;
    if (handled) event.preventDefault();
  });
  el.addEventListener("focus", () => { describe(); announcer.textContent = ""; kick(); });
}
addEventListener("resize", () => { placeHits(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  touring = !still.matches;
  if (still.matches) { cancelAnimationFrame(frame); frame = 0; for (const c of Object.values(ctl)) c.x = c.target; lastKey = ""; tick(performance.now()); }
  else { flying.length = 0; prefill(setting()); run(); }
});
{
  const s = setting();
  drawSetting(s);
  if (still.matches) still_(s); else prefill(s);
  drawColumns(s);
  drawParts();
  readout(s);
  describe();
  requestAnimationFrame(placeHits);
}
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Procesgeschiktheid: Cp en Cpk",
    hint: "Sleep de knop, de hendel of een grens",
    label: LABEL_NL,
    group: "Bonenmachine met vier regelaars. Tab gaat langs de centreerknop, de spreidingshendel, de ondergrens en de bovengrens; pijltoetsen verschuiven de gekozen regelaar (Shift: grotere stap).",
    knob: "Centreerknop: procesgemiddelde μ",
    rows: "Spreidingshendel: aantal actieve penrijen",
    lsl: "Ondergrens LSL",
    usl: "Bovengrens USL",
  },
  en: {
    title: "Capability: Cp and Cpk",
    hint: "Drag the knob, the lever or a gate",
    label: LABEL_EN,
    group: "Bean machine with four controls. Tab moves through the centring knob, the spread lever, the lower and the upper spec gate; arrow keys move the chosen control (Shift: bigger step).",
    knob: "Centring knob: process mean μ",
    rows: "Spread lever: active pin rows",
    lsl: "Lower spec limit LSL",
    usl: "Upper spec limit USL",
  },
};

const hitHtml = (name, min, max) => `<div class="cc-hit" data-hit="${name}" tabindex="0" role="slider" aria-label="${STRINGS.nl[name]}" aria-valuemin="${min}" aria-valuemax="${max}"></div>`;
const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: STRINGS.nl.hint,
  readout: "",
  body: `<div class="cc-stage" role="group" aria-label="${STRINGS.nl.group}">${svg}${hitHtml("knob", MU_RANGE[0], MU_RANGE[1])}${hitHtml("rows", 1, ROWS)}${hitHtml("lsl", LSL_RANGE[0], LSL_RANGE[1])}${hitHtml("usl", USL_RANGE[0], USL_RANGE[1])}</div><div class="cc-sr" aria-live="polite"></div>`,
}).replace("data-readout></span>", 'data-readout><span class="cc-line"></span><span class="cc-line"></span><span class="cc-line"></span><span class="cc-line"></span></span>');

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;c("hint").textContent=s.hint;
var st=document.querySelector(".cc-stage");st.setAttribute("aria-label",s.group);st.querySelector("svg").setAttribute("aria-label",s.label);
["knob","rows","lsl","usl"].forEach(function(n){st.querySelector('[data-hit="'+n+'"]').setAttribute("aria-label",s[n]);});})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${PARTS} parts (${STATIC_SOLIDS} static solids + ${BINS} ball columns) · viewBox ${WIDTH}×${HEIGHT}`);
