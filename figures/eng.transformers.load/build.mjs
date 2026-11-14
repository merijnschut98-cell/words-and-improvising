// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Transformer principle" (module Transformers and cables, grid track, level 2).
//
//   node figures/eng.transformers.load/build.mjs
//
// Writes src/content/courses/figures/eng.transformers.load.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark and ?lang=nl|en from its URL (defaults: prefers-color-scheme,
// Dutch).
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
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.transformers.load.html");

// ---------------------------------------------------------------- the model
// A 400 kVA, 10 kV / 400 V ONAN distribution transformer (hermetically sealed,
// corrugated tank). Rated LV current I = S / (sqrt(3) * U) = 577 A.
// No-load (iron) loss 0.6 kW, constant; load (copper) loss 4.6 kW at rated
// current, scaling with load squared.
// Thermal model after IEC 60076-7 (exponential method, ONAN): ambient 20 °C,
// rated top-oil rise 55 K, rated hot-spot gradient 23 K, so the hot spot is
// 98 °C at rated load. Top-oil rise follows ((1 + R K²) / (1 + R))^0.8 with
// R = Pcu / Pfe; the gradient follows K^1.6. Oil time constant 180 min,
// winding 7 min. Relative ageing V = 2^((θh − 98) / 6): the 6-degree rule of
// thumb (Montsinger), ×1 at the rated hot spot.
const S_KVA = 400;
const U_LV = 400;
const I_RATED = (S_KVA * 1000) / (Math.sqrt(3) * U_LV); // 577.4 A
const P_FE = 0.6;
const P_CU = 4.6;
const AMBIENT = 20;
const OIL_RISE = 55;
const GRADIENT = 23;
const HOT_RATED = AMBIENT + OIL_RISE + GRADIENT; // 98 °C
const OIL_X = 0.8;
const WDG_Y = 1.6;
const TAU_OIL = 180 * 60; // s
const TAU_WDG = 7 * 60; // s
const TIME_SCALE = 2400; // simulated seconds per real second: 1 s is 40 min
const RANGE = [0, 150];
const START = 60;

// ---------------------------------------------------------------- the world
// World units are centimetres, z up. The ground is at z = GROUND.
const WIDTH = 600;
const GROUND = -12;
const PLINTH = { x: -74, y: -50, w: 148, d: 100, r: 2 };
const SKID_Y = [-20, 20];
const TANK = { x: -56, y: -26, w: 112, d: 52, r: 3 };
const TANK_Z = 8;
const TANK_TOP = 96;
const COVER = k.insetPlan(TANK, -2.5);
const COVER_TOP = TANK_TOP + 3.5;
const FIN_X = [-45, -35, -25, -15, -5, 5, 15, 25, 35, 45];
const FIN_D = 15;
const FIN_Z = [14, 90];
const HV_X = [-32, 0, 32];
const HV_Y = -13;
const LV_X = [-42, -26, -10, 6];
const LV_Y = 13;
const THERMO = [38, 12];
const THERMO_R = 10.5;
const THERMO_Z = COVER_TOP + 2 + 8;
const THERMO_TOP = THERMO_Z + 5;
const THERMO_RANGE = [0, 140];
const CAB = { x: 96, y: -64, w: 22, d: 46, r: 1 };
const CAB_Z = GROUND + 4;
const CAB_TOP = 62;
const ROOF = { x: 94.6, y: -65.4, w: 24.8, d: 48.8, r: 1.2 };
const ROOF_TOP = CAB_TOP + 2.6;
const KNOB = [107, -41];
const DIAL_R = 11.5;
const KNOB_R = 6.4;
const KNOB_Z = ROOF_TOP + 0.8;
const KNOB_TOP = KNOB_Z + 5;
const SPAN = (270 * Math.PI) / 180;
const FROM = -SPAN / 2;

const knobAngle = (pct) => FROM + ((Math.min(RANGE[1], Math.max(RANGE[0], pct)) - RANGE[0]) / (RANGE[1] - RANGE[0])) * SPAN;
const thermoAngle = (deg) => FROM + ((Math.min(THERMO_RANGE[1], Math.max(THERMO_RANGE[0], deg)) - THERMO_RANGE[0]) / (THERMO_RANGE[1] - THERMO_RANGE[0])) * SPAN;

const FIT = [
  ...k.boxCorners(PLINTH, GROUND, 0),
  ...k.boxCorners({ x: -56, y: -26 - FIN_D, w: 112, d: 52 + 2 * FIN_D }, FIN_Z[0], FIN_Z[1]),
  ...HV_X.map((x) => [x, HV_Y, COVER_TOP + 30]),
  ...k.boxCorners(ROOF, GROUND, KNOB_TOP),
];
const PAD = 14;
const AZIMUTH = Number(process.env.AZ ?? 38);
const ELEVATION = Number(process.env.EL ?? 30);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 6);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };

const at = (point) => k.iso(point, P);
let solids = 0;
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const depth = ([x, y, z = 0]) => k.depthOf([x, y, z], P);
const byDepth = (points) => [...points].sort((a, b) => depth(a) - depth(b));
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });
const face = (points) => k.pathOf(points.map(at), true); // a closed outline on any face

// ---------------------------------------------------------------- plinth and skids
function plinth() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLINTH, GROUND, -GROUND, P)}"/>`];
  out.push(S(k.slabOf(PLINTH, GROUND, -GROUND, P, 3, 1.2), { tone: "lo", inner: L(k.sideSeam(PLINTH, -5, P, 3), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLINTH, 4), 0, P, 3), { tone: "faint" }));
  const anchors = k.corners(PLINTH, 9);
  out.push(L(anchors.map(([x, y]) => k.ring(x, y, 1.8, 0, P, 14)).join(""), { tone: "lo" }));
  out.push(D(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

// A concrete trench cover carrying the LV cables to the feeder cabinet.
function trench() {
  const cover = { x: PLINTH.x + PLINTH.w, y: -42, w: 22, d: 16, r: 0.4 };
  const out = [S(k.slabOf(cover, GROUND, 1.6, P, 2, 0.4), { tone: "lo" })];
  out.push(L(k.lineOnTop([cover.x + 11, cover.y], [cover.x + 11, cover.y + cover.d], GROUND + 1.6, P), { tone: "faint" }));
  out.push(D([at([cover.x + 5.5, cover.y + 8, GROUND + 1.6]), at([cover.x + 16.5, cover.y + 8, GROUND + 1.6])], { size: 0.45, tone: "lo" }));
  return out.join("");
}

function skid(y) {
  const out = [];
  const p = { x: -64, y: y - 4, w: 128, d: 8, r: 0.6 };
  out.push(S(k.slabOf(p, 0, TANK_Z, P, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(p, TANK_Z - 1.4, P, 2), { tone: "faint" }) }));
  out.push(D([at([-60.5, y, TANK_Z]), at([60.5, y, TANK_Z])], { size: 0.45 }));
  return out.join("");
}

// ---------------------------------------------------------------- tank
function fin(x, side) {
  const p = side > 0 ? { x: x - 0.7, y: TANK.y + TANK.d - 0.5, w: 1.4, d: FIN_D + 0.5, r: 0.5 } : { x: x - 0.7, y: TANK.y - FIN_D, w: 1.4, d: FIN_D + 0.5, r: 0.5 };
  return S(k.slabOf(p, FIN_Z[0], FIN_Z[1] - FIN_Z[0], P, 2), { tone: "hi", crease: "lo" });
}
function fins(side) {
  return byDepth(FIN_X.map((x) => [x, side * 30, 50])).map(([x]) => fin(x, side)).join("");
}

function tank() {
  const out = [];
  const seams = k.sideSeam(TANK, FIN_Z[0] - 2, P, 3) + k.sideSeam(TANK, FIN_Z[1] + 2, P, 3);
  out.push(S(k.slabOf(TANK, TANK_Z, TANK_TOP - TANK_Z, P, 3, 0.6), { tone: "hi", crease: "lo", inner: L(seams, { tone: "faint" }) }));
  return out.join("");
}

// The end face (+x): nameplate, drain valve, earth stud.
function endFace() {
  const out = [];
  const X = TANK.x + TANK.w;
  const np = { x: X, y: -11, w: 0.8, d: 22, r: 0.2 };
  const npZ = [50, 66];
  out.push(S(k.slabOf(np, npZ[0], npZ[1] - npZ[0], P, 2), { tone: "mid", crease: "none" }));
  const fx = X + 0.8;
  out.push(L(face([[fx, -9.6, npZ[0] + 1.4], [fx, 9.6, npZ[0] + 1.4], [fx, 9.6, npZ[1] - 1.4], [fx, -9.6, npZ[1] - 1.4]]), { tone: "faint" }));
  out.push(k.faceTextSvg(k.sideMatrix([fx, 7.6], npZ[1] - 4.6, P, "right"), "400 kVA", { size: 2.7, tone: "mid" }));
  const rules = [[60.4, 15], [57.4, 11], [54.4, 13]].map(([z, len]) => k.segment([fx, 7.6, z], [fx, 7.6 - len, z], P)).join("");
  out.push(L(rules, { tone: "lo", free: true }));
  out.push(D([[fx, -9.6 + 0.9, npZ[0] + 0.8], [fx, 9.6 - 0.9, npZ[0] + 0.8], [fx, -9.6 + 0.9, npZ[1] - 0.8], [fx, 9.6 - 0.9, npZ[1] - 0.8]].map(at), { size: 0.4 }));
  // drain and sampling valve near the bottom
  const valve = { x: X, y: -19, w: 4.2, d: 6, r: 0.8 };
  out.push(S(k.slabOf(valve, 14, 6, P, 2, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: X + 4.2, y: -18, w: 2.4, d: 4, r: 0.6 }, 15, 4, P, 2), { tone: "mid" }));
  out.push(D([at([X + 2.1, -16, 20])], { size: 0.45 }));
  // earth stud
  out.push(S(k.slabOf({ x: X, y: 13, w: 2.6, d: 5, r: 0.5 }, 13, 4, P, 2), { tone: "mid" }));
  out.push(D([at([X + 1.3, 15.5, 17])], { size: 0.5, tone: "hi" }));
  return out.join("");
}

function cover() {
  const out = [];
  out.push(S(k.slabOf(COVER, TANK_TOP, COVER_TOP - TANK_TOP, P, 5, 0.6), { tone: "hi", lit: true }));
  // the hot top oil just under the cover: a petrol tint that grows with temperature
  out.push(`<path class="tl-heat" data-heat="" d="${k.planOutline(k.insetPlan(COVER, 0.2), COVER_TOP, P, 5)}"/>`);
  out.push(L(k.planOutline(k.insetPlan(COVER, 3.4), COVER_TOP, P, 4), { tone: "faint" }));
  const bolts = [];
  for (let x = COVER.x + 6; x <= COVER.x + COVER.w - 5; x += 9.5) bolts.push([x, COVER.y + 1.7], [x, COVER.y + COVER.d - 1.7]);
  for (let y = COVER.y + 9.5; y <= COVER.y + COVER.d - 9; y += 9.5) bolts.push([COVER.x + 1.7, y], [COVER.x + COVER.w - 1.7, y]);
  out.push(D(bolts.map(([x, y]) => at([x, y, COVER_TOP])), { size: 0.42, tone: "mid" }));
  return out.join("");
}

// ---------------------------------------------------------------- on the cover
// Each item is [depth, svg], sorted far to near before drawing.
function hvBushing(x) {
  const y = HV_Y;
  const out = [];
  let z = COVER_TOP;
  const step = (r, h, style, bevel = 0, steps = 28) => {
    out.push(S(k.cylinder(x, y, r, z, h, P, steps, bevel), style));
    z += h;
  };
  step(6.2, 2, { tone: "mid" }, 0.3);
  out.push(D([0, 1, 2, 3].map((q) => at([x + 5 * Math.cos(q * Math.PI / 2 + Math.PI / 4), y + 5 * Math.sin(q * Math.PI / 2 + Math.PI / 4), z])), { size: 0.4 }));
  step(3.3, 5, { tone: "hi", crease: "none" });
  step(6.4, 1.6, { tone: "hi", crease: "lo" }, 0.3, 32);
  step(3.1, 6, { tone: "hi", crease: "none" });
  step(5.6, 1.5, { tone: "hi", crease: "lo" }, 0.3, 32);
  step(2.9, 5, { tone: "hi", crease: "none" });
  step(2.7, 3.6, { tone: "mid" }, 0.3, 20);
  out.push(S(k.cylinder(x, y, 1.1, z, 4.4, P, 14), { tone: "mid", crease: "none" }));
  out.push(D([at([x, y, z + 4.4])], { size: 0.5, tone: "hi" }));
  return [depth([x, y, COVER_TOP]), out.join("")];
}

function lvBushing(x) {
  const y = LV_Y;
  const out = [];
  out.push(S(k.cylinder(x, y, 4.4, COVER_TOP, 1.6, P, 24, 0.3), { tone: "mid" }));
  const z1 = COVER_TOP + 1.6;
  out.push(S(k.cylinder(x, y, 2.9, z1, 8, P, 24), { tone: "hi", crease: "none", inner: L(k.sideArc(x, y, 2.9, z1 + 3, P, 14) + k.sideArc(x, y, 2.9, z1 + 5.4, P, 14), { tone: "faint" }) }));
  const z2 = z1 + 8;
  // cable lug: a flat palm on the stem, its bolt hole facing the viewer
  const palm = { x: x - 2.2, y: y - 0.7, w: 4.4, d: 1.4, r: 0.5 };
  out.push(S(k.slabOf(palm, z2, 8, P, 2, 0.3), { tone: "mid" }));
  out.push(L(k.sideRing([x, y + 0.7, z2 + 4.6], 1.1, "y", P, 14), { tone: "lo" }));
  out.push(D([at([x, y + 0.7, z2 + 4.6])], { size: 0.45, tone: "hi" }));
  return [depth([x, y, COVER_TOP]), out.join("")];
}

function liftLug(x, y) {
  const p = { x: x - 3, y: y - 0.8, w: 6, d: 1.6, r: 0.6 };
  const out = [S(k.slabOf(p, COVER_TOP, 6, P, 2, 0.3), { tone: "mid" })];
  if (y > 0) out.push(L(k.sideRing([x, y + 0.8, COVER_TOP + 3.4], 1.2, "y", P, 14), { tone: "lo" }));
  return [depth([x, y, COVER_TOP]), out.join("")];
}

function reliefValve() {
  const [x, y] = [-46, 0];
  const out = [];
  out.push(S(k.cylinder(x, y, 2.6, COVER_TOP, 3.2, P, 20, 0.3), { tone: "mid" }));
  out.push(L(k.ring(x, y, 1.2, COVER_TOP + 3.2, P, 12), { tone: "lo" }));
  out.push(D([at([x, y, COVER_TOP + 3.2])], { size: 0.45 }));
  return [depth([x, y, COVER_TOP]), out.join("")];
}

function thermometer() {
  const [x, y] = THERMO;
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(plan(x, y, 16, 16, 8), COVER_TOP, 0.5, P)}" style="opacity:.35"/>`);
  out.push(S(k.cylinder(x, y, 3.2, COVER_TOP, 2, P, 20, 0.3), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 1.6, COVER_TOP + 2, THERMO_Z - COVER_TOP - 2, P, 16), { tone: "mid", crease: "none", inner: L(k.sideArc(x, y, 1.6, COVER_TOP + 5, P, 10), { tone: "faint" }) }));
  out.push(S(k.cylinder(x, y, THERMO_R, THERMO_Z, THERMO_TOP - THERMO_Z, P, 56, 0.6), { tone: "hi", crease: "lo", inner: L(k.sideArc(x, y, THERMO_R, THERMO_TOP - 2.2, P, 36), { tone: "faint" }) }));
  out.push(L(k.ring(x, y, THERMO_R - 1.6, THERMO_TOP, P, 56), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, THERMO_R - 1.6, 28, 4, THERMO_TOP, [1, 2], P, FROM, SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // rated top oil (75 °C): a long tick and a pin on the bezel
  const ra = thermoAngle(AMBIENT + OIL_RISE);
  const [ux, uy] = [Math.sin(ra), -Math.cos(ra)];
  out.push(L(k.lineOnTop([x + ux * (THERMO_R - 4.2), y + uy * (THERMO_R - 4.2)], [x + ux * (THERMO_R - 1.6), y + uy * (THERMO_R - 1.6)], THERMO_TOP, P), { tone: "hi" }));
  out.push(S(k.cylinder(x + ux * (THERMO_R - 0.8), y + uy * (THERMO_R - 0.8), 0.7, THERMO_TOP, 1.2, P, 10), { tone: "hi", crease: "none" }));
  out.push(`<path class="iso-line" data-tone="lit" data-free="" data-needle="" style="stroke-width:1.15" d="${needleAt(48)}"/>`);
  out.push(L(k.ring(x, y, 1.3, THERMO_TOP, P, 14), { tone: "mid" }));
  out.push(D([at([x, y, THERMO_TOP])], { size: 0.6, tone: "hi" }));
  return [depth([x, y, COVER_TOP]), out.join("")];
}
function needleAt(deg) {
  const a = thermoAngle(deg);
  const [x, y] = THERMO;
  return k.lineOnTop([x - Math.sin(a) * 2.6, y + Math.cos(a) * 2.6], [x + Math.sin(a) * (THERMO_R - 2.6), y - Math.cos(a) * (THERMO_R - 2.6)], THERMO_TOP + 0.2, P);
}

function onCover() {
  const items = [
    ...HV_X.map(hvBushing),
    ...LV_X.map(lvBushing),
    liftLug(-50, COVER.y + 1.2), liftLug(50, COVER.y + 1.2), liftLug(-50, COVER.y + COVER.d - 1.2), liftLug(50, COVER.y + COVER.d - 1.2),
    reliefValve(),
    thermometer(),
  ];
  return items.sort((a, b) => a[0] - b[0]).map(([, svg]) => svg).join("");
}

// ---------------------------------------------------------------- feeder cabinet with the load knob
function cabinet() {
  const out = [];
  const foot = k.insetPlan(CAB, -2.4);
  out.push(`<path class="iso-halo" d="${k.haloOf(foot, GROUND, 4, P)}" style="opacity:.6"/>`);
  out.push(S(k.slabOf(foot, GROUND, CAB_Z - GROUND, P, 2, 0.4), { tone: "lo" }));
  const X = CAB.x + CAB.w;
  const Y = CAB.y + CAB.d;
  const body = [];
  // door on the +x face, its hinge side and handle
  body.push(L(face([[X, CAB.y + 3, CAB_Z + 4], [X, Y - 3, CAB_Z + 4], [X, Y - 3, CAB_TOP - 4], [X, CAB.y + 3, CAB_TOP - 4]]), { tone: "lo" }));
  body.push(L(face([[X, CAB.y + 6, CAB_TOP - 13], [X, CAB.y + 20, CAB_TOP - 13], [X, CAB.y + 20, CAB_TOP - 8], [X, CAB.y + 6, CAB_TOP - 8]]), { tone: "faint" }));
  // vent slots on the +y side
  const slots = [];
  for (const z of [CAB_Z + 6, CAB_Z + 9, CAB_TOP - 12, CAB_TOP - 9]) slots.push(face([[CAB.x + 4, Y, z], [X - 4, Y, z], [X - 4, Y, z + 1.2], [CAB.x + 4, Y, z + 1.2]]));
  body.push(L(slots.join(""), { tone: "lo" }));
  out.push(S(k.slabOf(CAB, CAB_Z, CAB_TOP - CAB_Z, P, 2, 0.5), { tone: "mid", inner: body.join("") }));
  out.push(D([[X, CAB.y + 9, CAB_TOP - 10.5], [X, CAB.y + 17, CAB_TOP - 10.5]].map(at), { size: 0.4 }));
  // handle with a lock barrel
  out.push(S(k.slabOf({ x: X, y: Y - 9, w: 1.4, d: 2.4, r: 0.5 }, 24, 12, P, 2, 0.3), { tone: "mid" }));
  out.push(D([at([X + 1.4, Y - 7.8, 38.4])], { size: 0.5, tone: "hi" }));
  out.push(S(k.slabOf(ROOF, CAB_TOP, ROOF_TOP - CAB_TOP, P, 2, 0.5), { tone: "mid" }));
  // the load knob: a dial plate 0–150 %, rated 100 % marked
  const [x, y] = KNOB;
  out.push(S(k.cylinder(x, y, DIAL_R, ROOF_TOP, 0.8, P, 48), { tone: "lo", crease: "none" }));
  const ticks = k.radialTicks(x, y, DIAL_R - 0.4, 30, 5, ROOF_TOP + 0.8, [1.4, 2.8], P, FROM, SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const ra = knobAngle(100);
  out.push(L(k.lineOnTop([x + Math.sin(ra) * (DIAL_R - 4.4), y - Math.cos(ra) * (DIAL_R - 4.4)], [x + Math.sin(ra) * (DIAL_R - 0.4), y - Math.cos(ra) * (DIAL_R - 0.4)], ROOF_TOP + 0.8, P), { tone: "hi" }));
  out.push(L(k.ring(x, y, DIAL_R - 0.4, ROOF_TOP + 0.8, P, 48), { tone: "faint" }));
  out.push(S(k.cylinder(x, y, KNOB_R, KNOB_Z, KNOB_TOP - KNOB_Z, P, 32), { tone: "mid" }));
  out.push(L(k.knurl(x, y, KNOB_R, KNOB_Z, KNOB_TOP, 32, P), { tone: "lo" }));
  out.push(`<path class="iso-line" data-tone="hi" data-knob="" data-free="end" style="stroke-width:1.1" d="${knobPointer(START)}"/>`);
  out.push(D([at([x, y, KNOB_TOP])], { size: 0.55, tone: "hi" }));
  return out.join("");
}
function knobPointer(pct) {
  const a = knobAngle(pct);
  const [x, y] = KNOB;
  return k.lineOnTop([x, y], [x + Math.sin(a) * (KNOB_R - 0.1), y - Math.cos(a) * (KNOB_R - 0.1)], KNOB_TOP, P);
}

// ---------------------------------------------------------------- assemble
const KNOB_SCREEN = at([KNOB[0], KNOB[1], KNOB_TOP]);
const HIT_R = 40; // viewBox units: well over 44 css px across at 360 px wide
const body = [
  plinth(),
  trench(),
  fins(-1),
  skid(SKID_Y[0]),
  skid(SKID_Y[1]),
  tank(),
  endFace(),
  fins(1),
  cover(),
  onCover(),
  cabinet(),
  `<circle class="tl-hit" data-hit="" cx="${KNOB_SCREEN[0].toFixed(1)}" cy="${KNOB_SCREEN[1].toFixed(1)}" r="${HIT_R}"/>`,
];

const LABEL_NL =
  "Een distributietransformator van 400 kVA, 10 kV naar 400 V, op een betonnen sokkel: een hermetisch gesloten ketel met koelribben, drie hoogspanningsdoorvoeringen en vier laagspanningsdoorvoeringen met kabelschoenen op het deksel, een typeplaatje, en een wijzerthermometer voor de topolie. Ernaast een kabelverdeelkast met een belastingsknop van 0 tot 150 procent. Meer belasting geeft meer stroom en kwadratisch meer koperverlies; de olie wordt warmer en de isolatie veroudert sneller.";
const LABEL_EN =
  "A 400 kVA distribution transformer, 10 kV to 400 V, on a concrete plinth: a hermetically sealed tank with cooling fins, three HV bushings and four LV bushings with cable lugs on the cover, a nameplate, and a dial thermometer for the top oil. Beside it a feeder cabinet with a load knob from 0 to 150 percent. More load means more current and, with its square, more copper loss; the oil runs hotter and the insulation ages faster.";

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
  --tl-hair:rgba(240,233,218,.12);--tl-accent:#5C9FAE;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --tl-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --tl-hair:rgba(11,41,27,.14);--tl-accent:#276F81;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--tl-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 100px);min-height:200px;padding:26px 4px 72px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--tl-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 12px 14px}
.iso-plate-corner{font-family:var(--tl-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:0!important;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.4;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.tl-line{display:block}
.tl-acc{color:var(--tl-accent);font-weight:600}
.tl-mute{color:var(--anatomy-muted)}
.tl-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:ew-resize;border-radius:8px}
.tl-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.tl-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.tl-heat{fill:var(--tl-accent);stroke:none;opacity:0}
.tl-hit{fill:transparent;stroke:none;cursor:pointer}
.tl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const RANGE = ${JSON.stringify(RANGE)}, START = ${START};
const I_RATED = ${I_RATED}, P_FE = ${P_FE}, P_CU = ${P_CU};
const AMBIENT = ${AMBIENT}, OIL_RISE = ${OIL_RISE}, GRADIENT = ${GRADIENT}, HOT_RATED = ${HOT_RATED}, OIL_X = ${OIL_X}, WDG_Y = ${WDG_Y};
const TAU_OIL = ${TAU_OIL}, TAU_WDG = ${TAU_WDG}, TS = ${TIME_SCALE};
const THERMO = ${JSON.stringify(THERMO)}, THERMO_R = ${THERMO_R}, THERMO_TOP = ${THERMO_TOP}, THERMO_RANGE = ${JSON.stringify(THERMO_RANGE)};
const KNOB = ${JSON.stringify(KNOB)}, KNOB_R = ${KNOB_R}, KNOB_TOP = ${KNOB_TOP};
const SPAN = ${SPAN}, FROM = ${FROM};
const knobAngle = ${knobAngle.toString()};
const thermoAngle = ${thermoAngle.toString()};
function knobPointer(pct) { const a = knobAngle(pct); const [x, y] = KNOB; return lineOnTop([x, y], [x + Math.sin(a) * (KNOB_R - 0.1), y - Math.cos(a) * (KNOB_R - 0.1)], KNOB_TOP, P); }
function needleAt(deg) { const a = thermoAngle(deg); const [x, y] = THERMO; return lineOnTop([x - Math.sin(a) * 2.6, y + Math.cos(a) * 2.6], [x + Math.sin(a) * (THERMO_R - 2.6), y - Math.cos(a) * (THERMO_R - 2.6)], THERMO_TOP + 0.2, P); }

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { load: "load", loss: "losses", oil: "top oil", hot: "hot spot", age: "ageing", rule: "rule of thumb", dec: ".", grp: ",", lt: "<", ruleLong: "ageing doubles for every 6 °C above 98 °C (rule of thumb)", later: "Settles at", at: "At" }
  : { load: "belasting", loss: "verlies", oil: "olie", hot: "hotspot", age: "veroudering", rule: "vuistregel", dec: ",", grp: ".", lt: "<", ruleLong: "veroudering verdubbelt per 6 °C boven 98 °C (vuistregel)", later: "Stabiliseert op", at: "Bij" };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);
const grouped = (value) => String(Math.round(value)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);
function ageText(v) {
  if (v < 0.01) return T.lt + fmt(0.01, 2);
  if (v < 1) return fmt(v, 2);
  if (v < 10) return fmt(v, 1);
  return grouped(v);
}

const stage = document.querySelector(".tl-stage");
const svg = stage.querySelector("svg");
const knobEl = svg.querySelector("[data-knob]");
const needle = svg.querySelector("[data-needle]");
const heat = svg.querySelector("[data-heat]");
const lines = [...document.querySelectorAll("[data-readout] .tl-line")];
const announcer = document.querySelector(".tl-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ the transformer model
const R = P_CU / P_FE;
const current = (pct) => I_RATED * pct / 100;
const copper = (pct) => P_CU * (pct / 100) ** 2;
const oilRiseUlt = (pct) => OIL_RISE * ((1 + R * (pct / 100) ** 2) / (1 + R)) ** OIL_X;
const gradUlt = (pct) => GRADIENT * (pct / 100) ** WDG_Y;
const ageing = (hot) => 2 ** ((hot - HOT_RATED) / 6);
const knob = { x: START, target: START };
const heatState = { oil: oilRiseUlt(START), grad: gradUlt(START) };

// ------------------------------------------------ drawing
let shownLoad = -1;
function draw() {
  const pct = knob.x;
  knobEl.setAttribute("d", knobPointer(pct));
  const oil = AMBIENT + heatState.oil;
  const hot = oil + heatState.grad;
  needle.setAttribute("d", needleAt(oil));
  heat.style.opacity = (0.62 * smooth(32, 112, oil)).toFixed(3);
  const p = Math.round(pct);
  const l1 = T.load + " " + p + " % · " + grouped(current(p)) + " A";
  const l2 = T.loss + " " + fmt(P_FE, 1) + " + " + fmt(copper(p), 1) + " = " + fmt(P_FE + copper(p), 1) + " kW";
  const l3 = T.oil + " " + Math.round(oil) + " °C · " + T.hot + " " + Math.round(hot) + " °C";
  const l4 = T.age + ' <span class="tl-acc">×' + ageText(ageing(hot)) + '</span> <span class="tl-mute">(' + T.rule + ")</span>";
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
  if (p !== shownLoad) { shownLoad = p; describe(); }
}
function describe() {
  const p = Math.round(knob.target);
  const oil = AMBIENT + oilRiseUlt(p);
  const hot = oil + gradUlt(p);
  stage.setAttribute("aria-valuenow", String(p));
  stage.setAttribute("aria-valuetext", T.load + " " + p + " %, " + grouped(current(p)) + " A, " + T.loss + " " + fmt(P_FE + copper(p), 1) + " kW; " + T.later.toLowerCase() + " " + T.oil + " " + Math.round(oil) + " °C, " + T.age + " ×" + ageText(ageing(hot)) + " (" + T.ruleLong + ")");
}
let quietTimer = 0;
function announce() {
  clearTimeout(quietTimer);
  quietTimer = setTimeout(() => {
    const p = Math.round(knob.target);
    const oil = AMBIENT + oilRiseUlt(p), hot = oil + gradUlt(p);
    announcer.textContent = T.at + " " + p + " %: " + T.oil + " " + Math.round(oil) + " °C, " + T.age + " ×" + ageText(ageing(hot)) + ".";
  }, 700);
}

// ------------------------------------------------ idle tour
// Rated load first (oil 75 °C, ageing ×1), then an overload to 130 % (ageing
// climbs past ×10 as the oil catches up), then a light evening load.
const TOUR = [[0, START], [3, 100], [13, 130], [25, 40]];
const TOUR_LEN = 36;
function tourAt(clock) {
  const t = clock % TOUR_LEN;
  let value = START;
  for (const [at, v] of TOUR) { if (t < at) break; value = v; }
  return value;
}

let frame = 0, last = 0, visible = false, touring = !still.matches, tourClock = 0, idleTimer = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) { tourClock += dt; const v = tourAt(tourClock); if (v !== knob.target) { knob.target = v; describe(); } }
  if (calm) knob.x = knob.target;
  else {
    knob.x += (knob.target - knob.x) * (1 - Math.exp(-dt / 0.16));
    if (Math.abs(knob.target - knob.x) < 0.05) knob.x = knob.target;
  }
  const uOil = oilRiseUlt(knob.x), uGrad = gradUlt(knob.x);
  if (calm) { heatState.oil = uOil; heatState.grad = uGrad; }
  else {
    const sim = dt * TS;
    heatState.oil += (uOil - heatState.oil) * (1 - Math.exp(-sim / TAU_OIL));
    heatState.grad += (uGrad - heatState.grad) * (1 - Math.exp(-sim / TAU_WDG));
    if (Math.abs(uOil - heatState.oil) < 0.01) heatState.oil = uOil;
    if (Math.abs(uGrad - heatState.grad) < 0.01) heatState.grad = uGrad;
  }
  draw();
  const settled = !touring && knob.x === knob.target && heatState.oil === uOil && heatState.grad === uGrad;
  frame = visible && !settled && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; run(); } }, 40000);
}
function setLoad(value) {
  steer();
  knob.target = clamp(Math.round(value), RANGE[0], RANGE[1]);
  describe();
  announce();
  kick();
}
// a key pressed during the tour steps from the value the reader sees
const base = () => (touring ? Math.round(knob.x) : knob.target);

// ------------------------------------------------ pointer: tap to step +25 %, drag sideways to set
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const p = toView(event);
  press = { x0: p[0], start: base(), dragging: false, id: event.pointerId };
  steer();
  kick();
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const dx = toView(event)[0] - press.x0;
  if (!press.dragging && Math.abs(dx) > 6) { press.dragging = true; try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setLoad(press.start + dx / 2.4);
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (!press.dragging && event.type === "pointerup") {
    const next = Math.floor(press.start / 25) * 25 + 25;
    setLoad(next > RANGE[1] ? RANGE[0] : next);
  }
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);

// ------------------------------------------------ keyboard
stage.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 25 : 5;
  const value = base();
  let handled = true;
  if (event.key === "ArrowUp" || event.key === "ArrowRight") setLoad(value + step);
  else if (event.key === "ArrowDown" || event.key === "ArrowLeft") setLoad(value - step);
  else if (event.key === "PageUp") setLoad(value + 25);
  else if (event.key === "PageDown") setLoad(value - 25);
  else if (event.key === "Home") setLoad(RANGE[0]);
  else if (event.key === "End") setLoad(RANGE[1]);
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
describe();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: { title: "Belasting, warmte en veroudering", hint: "Draai of tik de knop", time: "1 s = 40 min", label: LABEL_NL, aria: "Belastingsknop van 0 tot 150 procent. Pijl omhoog en omlaag verandert de belasting met 5 procent (Shift: 25), Home en End gaan naar 0 en 150 procent." },
  en: { title: "Load, heat and ageing", hint: "Turn or tap the knob", time: "1 s = 40 min", label: LABEL_EN, aria: "Load knob from 0 to 150 percent. Up and down arrows change the load by 5 percent (Shift: 25), Home and End go to 0 and 150 percent." },
};

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="tl-stage" tabindex="0" role="slider" aria-label="${STRINGS.nl.aria}" aria-valuemin="${RANGE[0]}" aria-valuemax="${RANGE[1]}" aria-valuenow="${START}">${svg}</div><div class="tl-sr" aria-live="polite"></div>`,
})
  .replace('data-readout></span>', 'data-readout><span class="tl-line"></span><span class="tl-line"></span><span class="tl-line"></span><span class="tl-line"></span></span>')
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-time>${STRINGS.nl.time}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;c("hint").querySelector("[data-hint]").textContent=s.hint;c("hint").querySelector("[data-time]").textContent=s.time;
var st=document.querySelector(".tl-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · viewBox ${WIDTH}×${HEIGHT}`);
