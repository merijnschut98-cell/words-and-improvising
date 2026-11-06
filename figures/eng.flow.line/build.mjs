// Dev tool, not shipped. Builds the standalone figure for the lesson
// "The bottleneck sets the output" (eng.flow.bottleneck, module Capacity and flow).
//
//   node figures/eng.flow.line/build.mjs
//
// Writes src/content/courses/figures/eng.flow.line.html: one offline page with the
// anatomy kit and the live script inlined. The page reads ?theme=light|dark and
// ?lang=nl|en from its URL (defaults: prefers-color-scheme, Dutch).
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
const OUT = join(ROOT, "src/content/courses/figures/eng.flow.line.html");

// ---------------------------------------------------------------- the model
// A three-station push line fed from a magazine (never starved at the head).
// Each station takes CYCLE[i] seconds per part; a buffer rail of CAP slots
// sits in front of stations 2 and 3. A station whose finished part has no
// room downstream is blocked and holds it. Output settles at 3600 / max(cycle).
const CYCLE = [40, 55, 45];
const TAKT = 50;
const RANGE = [30, 70];
const CAP = 4;
const TIME_SCALE = 40; // simulated seconds per real second

// ---------------------------------------------------------------- the world
const WIDTH = 600;
const PLATE = { x: -124, y: -32, w: 252, d: 84, r: 8 };
const PLATE_H = 9;
const FOOT_H = 4;
const ST = [-62, 0, 62]; // station centres along x
const MAG_X = -94;
const BELT = { x: -106, y: -7, w: 192, d: 14, r: 1.5 }; // belt top plan, z 6..8
const BED = { x: -108, y: -9, w: 196, d: 18, r: 2 };
const BELT_TOP = 8;
const RAIL_TOP = 11;
const BLOCK = 9;
const BLOCK_H = 8;
const COL_Y = 14;
const COL_R = 2.4;
const XHEAD_Z = 40;
const CYL_Z = [46, 60];
const HEAD_UP = 25; // head underside at rest
const HEAD_DOWN = BELT_TOP + BLOCK_H + 0.05;
const ROD_R = 1.3;
const CONSOLE = { x: -114, y: 20, w: 192, d: 26, r: 3 };
const CONSOLE_H = 7;
const KNOB_Y = 33;
const KNOB_R = 6;
const DIAL_PLATE_R = 10.5;
const KNOB_TOP = CONSOLE_H + 0.8 + 5;
const BIN = { x: 89, y: -12, w: 20, d: 24, r: 2.5 };
const BIN_H = 7;
const GAUGE = [106, 26];
const GAUGE_R = 17;
const GAUGE_Z = 13;
const GAUGE_TOP = GAUGE_Z + 6;
const GAUGE_RANGE = [40, 120];
const SPAN = (270 * Math.PI) / 180;
const FROM = -SPAN / 2;
const POOL = 26;

const slotX = (station, index) => ST[station] - 13 - 11 * index;
const knobAngle = (value) => FROM + ((value - RANGE[0]) / (RANGE[1] - RANGE[0])) * SPAN;
const gaugeAngle = (rate) => FROM + ((Math.min(GAUGE_RANGE[1], Math.max(GAUGE_RANGE[0], rate)) - GAUGE_RANGE[0]) / (GAUGE_RANGE[1] - GAUGE_RANGE[0])) * SPAN;

const FIT = [
  ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
  [ST[0], -18, CYL_Z[1] + 3],
  [ST[ST.length - 1], -18, CYL_Z[1] + 3],
  [GAUGE[0] + GAUGE_R, GAUGE[1] + GAUGE_R, GAUGE_Z + 7],
  [MAG_X, -10, 49],
];
const PAD = 5;
const AZIMUTH = Number(process.env.AZ ?? 40);
const ELEVATION = Number(process.env.EL ?? 38);
// Fit to the width, then trim the viewBox height to what the line needs.
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
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

// ---------------------------------------------------------------- base
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 16))) {
    out.push(S(k.cylinder(x, y, 5.6, -PLATE_H - FOOT_H, FOOT_H, P, 24), { tone: "lo" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(PLATE, -PLATE_H + 3, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 4.5), 0, P), { tone: "faint" }));
  const screws = k.corners(PLATE, 9);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

// The drive motor at the tail end, behind the belt, axis along -y.
function motor() {
  const out = [];
  const F = G.frameAlong([78, BED.y, 5], [0, -1, 0]);
  out.push(S(G.solidOf([[0, 4.2], [1.4, 4.2], [1.4, 5], [11, 5], [11, 4.4], [13, 4.4], [13, 2.4], [14.4, 2.4]], F, P), { tone: "mid" }));
  out.push(S(k.slabOf({ x: 74.5, y: -18.5, w: 7, d: 5, r: 0.8 }, 9.5, 2.6, P, 2, 0.3), { tone: "mid" }));
  return out.join("");
}

// ---------------------------------------------------------------- conveyor
function bedBack() {
  const out = [];
  out.push(S(k.slabOf(BED, 0, 6, P, 4, 0.5), { tone: "mid", inner: L(k.sideSeam(BED, 3, P, 4), { tone: "faint" }) }));
  out.push(S(k.slabOf({ x: BED.x, y: -9, w: BED.w, d: 2, r: 0.8 }, 6, RAIL_TOP - 6, P, 3, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf(BELT, 6, BELT_TOP - 6, P, 4), { tone: "lo", crease: "none" }));
  const slats = [];
  for (let x = BELT.x + 4; x <= BELT.x + BELT.w - 3; x += 6) slats.push(k.lineOnTop([x, -7], [x, 7], BELT_TOP, P));
  out.push(L(slats.join(""), { tone: "faint" }));
  out.push(D([-80, -30, 30, 76].map((x) => at([x, -8, RAIL_TOP])), { size: 0.4, tone: "lo" }));
  return out.join("");
}

function railFront() {
  const out = [];
  const rail = { x: BED.x, y: 7, w: BED.w, d: 2, r: 0.8 };
  out.push(S(k.slabOf(rail, 6, RAIL_TOP - 6, P, 3, 0.3), { tone: "mid" }));
  out.push(D([-80, -30, 30, 76].map((x) => at([x, 8, RAIL_TOP])), { size: 0.4, tone: "lo" }));
  return out.join("");
}

// ---------------------------------------------------------------- magazine
const MAG_POSTS = [
  [MAG_X - 6, -8],
  [MAG_X + 6, -8],
  [MAG_X - 6, 8],
  [MAG_X + 6, 8],
];
const MAG_TOP = 46;
function magazineBack() {
  return byDepth(MAG_POSTS.filter(([, y]) => y < 0))
    .map(([x, y]) => S(k.cylinder(x, y, 1, RAIL_TOP, MAG_TOP - RAIL_TOP, P, 14), { tone: "mid", crease: "none" }))
    .join("");
}
function blockSvg(x, z, extra = "") {
  const p = plan(x, 0, BLOCK, BLOCK, 0.8);
  return S(k.slabOf(p, z, BLOCK_H, P, 3, 0.4), { tone: "hi", crease: "lo", inner: extra });
}
function magazineStack() {
  const out = [];
  for (let level = 0; level < 4; level++) out.push(blockSvg(MAG_X, BELT_TOP + level * BLOCK_H));
  const follower = plan(MAG_X, 0, 10, 10, 1);
  out.push(S(k.slabOf(follower, BELT_TOP + 4 * BLOCK_H, 2, P, 3, 0.3), { tone: "mid" }));
  return out.join("");
}
function magazineFront() {
  const out = [];
  for (const [x, y] of byDepth(MAG_POSTS.filter(([, y]) => y > 0))) out.push(S(k.cylinder(x, y, 1, RAIL_TOP, MAG_TOP - RAIL_TOP, P, 14), { tone: "mid", crease: "none" }));
  const cap = plan(MAG_X, 0, 15, 19, 1.5);
  out.push(S(k.slabOf(cap, MAG_TOP, 2.2, P, 3, 0.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(cap, 3.4), MAG_TOP + 2.2, P, 3), { tone: "faint" }));
  out.push(D(MAG_POSTS.map(([x, y]) => at([x, y, MAG_TOP + 2.2])), { size: 0.45 }));
  return out.join("");
}

// ---------------------------------------------------------------- stations
function columns(side) {
  const out = [];
  for (const x of side < 0 ? ST : ST) {
    const y = side * COL_Y;
    out.push(S(k.cylinder(x, y, COL_R, 0, XHEAD_Z, P, 20), { tone: "mid", crease: "none", inner: L(k.sideArc(x, y, COL_R, 3, P, 12), { tone: "faint" }) }));
  }
  return out.join("");
}

// The ram: a rod and a head, built at rest (head underside HEAD_UP) and moved down.
function ram(index) {
  const x = ST[index];
  const out = [];
  out.push(S(k.cylinder(x, 0, ROD_R, HEAD_UP + 5, CYL_Z[1] - HEAD_UP - 5, P, 14), { tone: "hi", crease: "none" }));
  const head = plan(x, 0, 12, 12, 1.4);
  out.push(S(k.slabOf(head, HEAD_UP + 2, 3, P, 3, 0.5), { tone: "mid", crease: "lo" }));
  out.push(D([[-4, -4], [4, -4], [-4, 4], [4, 4]].map(([dx, dy]) => at([x + dx, dy, HEAD_UP + 5])), { size: 0.4 }));
  out.push(S(k.cylinder(x, 0, 2.6, HEAD_UP, 2, P, 18), { tone: "hi", crease: "lo" }));
  return `<g data-ram="${index}" data-press="${index}">${out.join("")}</g>`;
}

function crown(index) {
  const x = ST[index];
  const out = [];
  const xhead = { x: x - 6, y: -18, w: 12, d: 36, r: 1.5 };
  out.push(S(k.slabOf(xhead, XHEAD_Z, CYL_Z[0] - XHEAD_Z, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(xhead, XHEAD_Z + 1.5, P, 3), { tone: "faint" }) }));
  out.push(L([-COL_Y, COL_Y].map((y) => k.ring(x, y, 1.7, CYL_Z[0], P, 12)).join(""), { tone: "lo" }));
  out.push(D([-COL_Y, COL_Y].map((y) => at([x, y, CYL_Z[0]])), { size: 0.45 }));
  const press = [];
  press.push(S(k.cylinder(x, 0, 5, CYL_Z[0], CYL_Z[1] - CYL_Z[0], P, 28), { tone: "hi", crease: "none", inner: L(k.sideArc(x, 0, 5, CYL_Z[0] + 2.5, P, 18) + k.sideArc(x, 0, 5, CYL_Z[1] - 2.5, P, 18), { tone: "faint" }) }));
  press.push(S(k.cylinder(x, 0, 5.8, CYL_Z[1], 2.6, P, 28, 0.4), { tone: "hi", crease: "lo" }));
  press.push(L(k.ring(x, 0, 3.4, CYL_Z[1] + 2.6, P, 24), { tone: "lo" }));
  press.push(D([0, 1, 2, 3].map((q) => at([x + 4.6 * Math.cos(q * Math.PI / 2 + Math.PI / 4), 4.6 * Math.sin(q * Math.PI / 2 + Math.PI / 4), CYL_Z[1] + 2.6])), { size: 0.4 }));
  press.push(D([at([x, 0, CYL_Z[1] + 2.6])], { size: 0.55, tone: "hi" }));
  out.push(`<g data-press="${index}">${press.join("")}</g>`);
  return out.join("");
}

// ---------------------------------------------------------------- console
function consoleSvg() {
  const out = [];
  out.push(S(k.slabOf(CONSOLE, 0, CONSOLE_H, P, 5, 0.8), { tone: "mid", inner: L(k.sideSeam(CONSOLE, 2.4, P, 5), { tone: "faint" }) }));
  out.push(D([[CONSOLE.x + 4, CONSOLE.y + 4], [CONSOLE.x + 4, CONSOLE.y + CONSOLE.d - 4], [CONSOLE.x + CONSOLE.w - 4, CONSOLE.y + 4], [CONSOLE.x + CONSOLE.w - 4, CONSOLE.y + CONSOLE.d - 4]].map(([x, y]) => at([x, y, CONSOLE_H])), { size: 0.45 }));
  // label plate
  const label = { x: -109, y: 26, w: 22, d: 14, r: 1 };
  out.push(S(k.slabOf(label, CONSOLE_H, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), CONSOLE_H + 0.8, P, 3), { tone: "faint" }));
  out.push(L(k.lineOnTop([-105, 29.6], [-91, 29.6], CONSOLE_H + 0.8, P) + k.lineOnTop([-105, 33], [-95, 33], CONSOLE_H + 0.8, P) + k.lineOnTop([-105, 36.4], [-99, 36.4], CONSOLE_H + 0.8, P), { tone: "lo", free: true }));
  // knob dials, knobs, lamps
  ST.forEach((x, index) => {
    const zp = CONSOLE_H;
    out.push(S(k.cylinder(x, KNOB_Y, DIAL_PLATE_R, zp, 0.8, P, 40), { tone: "lo", crease: "none" }));
    const ticks = k.radialTicks(x, KNOB_Y, DIAL_PLATE_R - 0.4, 8, 2, zp + 0.8, [1.4, 2.6], P, FROM, SPAN);
    out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
    const ta = knobAngle(TAKT);
    out.push(L(k.lineOnTop([x + Math.sin(ta) * (DIAL_PLATE_R - 4.4), KNOB_Y - Math.cos(ta) * (DIAL_PLATE_R - 4.4)], [x + Math.sin(ta) * (DIAL_PLATE_R - 0.4), KNOB_Y - Math.cos(ta) * (DIAL_PLATE_R - 0.4)], zp + 0.8, P), { tone: "hi" }));
    out.push(`<path class="iso-line" data-tone="faint" data-sel="${index}" d="${k.ring(x, KNOB_Y, DIAL_PLATE_R - 0.4, zp + 0.8, P, 40)}"/>`);
    out.push(S(k.cylinder(x, KNOB_Y, KNOB_R, zp + 0.8, 4.2, P, 28), { tone: "mid" }));
    out.push(L(k.knurl(x, KNOB_Y, KNOB_R, zp + 0.8, KNOB_TOP, 30, P), { tone: "lo" }));
    out.push(`<path class="iso-line" data-tone="hi" data-knob="${index}" data-free="end" style="stroke-width:1" d="${knobPointer(index, CYCLE[index])}"/>`);
    out.push(D([at([x, KNOB_Y, KNOB_TOP])], { size: 0.55, tone: "hi" }));
    // status lamp: lit while the station is pressing
    const lx = x + 17;
    out.push(S(k.cylinder(lx, KNOB_Y, 1.9, zp, 1.6, P, 18), { tone: "mid" }));
    out.push(`<path class="fl-lamp" data-lamp="${index}" d="${k.ring(lx, KNOB_Y, 1.2, zp + 1.6, P, 16)}"/>`);
  });
  return out.join("");
}
function knobPointer(index, value) {
  const a = knobAngle(value);
  const x = ST[index];
  return k.lineOnTop([x, KNOB_Y], [x + Math.sin(a) * (KNOB_R - 0.1), KNOB_Y - Math.cos(a) * (KNOB_R - 0.1)], KNOB_TOP, P);
}

// ---------------------------------------------------------------- out bin and gauge
function bin() {
  const out = [];
  out.push(S(k.slabOf(BIN, 0, BIN_H, P, 4, 0.5), { tone: "mid", inner: L(k.sideSeam(BIN, 2.4, P, 4), { tone: "faint" }) }));
  const mouth = k.insetPlan(BIN, 1.6);
  out.push(`<path class="iso-shade" data-shade="0" d="${k.planOutline(mouth, BIN_H, P, 4)}"/>`);
  out.push(L(k.planOutline(mouth, BIN_H, P, 4), { tone: "lo" }));
  return out.join("");
}

function gauge() {
  const out = [];
  const [x, y] = GAUGE;
  out.push(`<path class="iso-halo" d="${k.haloOf(plan(x, y, 18, 18, 9), 0, 2, P)}" style="opacity:.5"/>`);
  out.push(S(k.cylinder(x, y, 8, 0, 2, P, 32, 0.4), { tone: "lo" }));
  out.push(D([0, 1, 2].map((q) => at([x + 6 * Math.cos(q * 2.1 + 0.5), y + 6 * Math.sin(q * 2.1 + 0.5), 2])), { size: 0.4 }));
  out.push(S(k.cylinder(x, y, 2.8, 2, GAUGE_Z - 2 - 2, P, 20), { tone: "mid", crease: "none", inner: L(k.sideArc(x, y, 2.8, 8, P, 12), { tone: "faint" }) }));
  out.push(S(k.cylinder(x, y, 4.4, GAUGE_Z - 2, 2, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, GAUGE_R, GAUGE_Z, GAUGE_TOP - GAUGE_Z, P, 64, 0.6), { tone: "hi", crease: "lo", inner: L(k.sideArc(x, y, GAUGE_R, GAUGE_TOP - 3, P, 40), { tone: "faint" }) }));
  out.push(L(k.knurl(x, y, GAUGE_R, GAUGE_TOP - 3, GAUGE_TOP, 80, P, 0.3), { tone: "lo" }));
  out.push(L(k.ring(x, y, GAUGE_R - 2, GAUGE_TOP, P, 64), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, GAUGE_R - 2, 16, 4, GAUGE_TOP, [1.3, 2.5], P, FROM, SPAN);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // takt marker: a long tick and a pin on the bezel at 3600 / 50 = 72 per hour
  const ta = gaugeAngle(3600 / TAKT);
  const ux = Math.sin(ta);
  const uy = -Math.cos(ta);
  out.push(L(k.lineOnTop([x + ux * (GAUGE_R - 6.4), y + uy * (GAUGE_R - 6.4)], [x + ux * (GAUGE_R - 2), y + uy * (GAUGE_R - 2)], GAUGE_TOP, P), { tone: "hi" }));
  out.push(S(k.cylinder(x + ux * (GAUGE_R - 1), y + uy * (GAUGE_R - 1), 0.85, GAUGE_TOP, 1.6, P, 12), { tone: "hi", crease: "none" }));
  out.push(`<path class="iso-line" data-tone="hi" data-free="" data-needle="" style="stroke-width:1.1" d="${needleAt(65)}"/>`);
  out.push(L(k.ring(x, y, 1.5, GAUGE_TOP, P, 16), { tone: "mid" }));
  out.push(D([at([x, y, GAUGE_TOP])], { size: 0.6, tone: "hi" }));
  return out.join("");
}
function needleAt(rate) {
  const a = gaugeAngle(rate);
  const [x, y] = GAUGE;
  return k.lineOnTop([x - Math.sin(a) * 3.2, y + Math.cos(a) * 3.2], [x + Math.sin(a) * (GAUGE_R - 3.4), y - Math.cos(a) * (GAUGE_R - 3.4)], GAUGE_TOP + 0.2, P);
}

// ---------------------------------------------------------------- moving parts
// One pool of parts, each built at x = 0 and moved along x. Four stamp dots on
// top show how many stations a part has been through.
const STAMPS = [[-2.4, -2.4], [0, 0], [2.4, 2.4]];
function partSvg(slot) {
  const p = plan(0, 0, BLOCK, BLOCK, 0.8);
  const block = k.solidSvg(k.slabOf(p, BELT_TOP, BLOCK_H, P, 3, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(p, BELT_TOP + 2, P, 3), { tone: "faint" }) });
  const stamps = STAMPS.map(([x, y], index) => {
    const [cx, cy] = at([x, y, BELT_TOP + BLOCK_H]);
    return `<circle class="fl-stamp" data-op="${index + 1}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="0.85"/>`;
  }).join("");
  return `<g class="fl-part" data-slot="${slot}" data-ops="0" style="display:none">${block}${stamps}</g>`;
}

// ---------------------------------------------------------------- assemble
let partsBuilt = 0;
const body = [
  base(),
  motor(),
  columns(-1),
  bedBack(),
  magazineBack(),
  magazineStack(),
  `<g data-layer="parts">${Array.from({ length: POOL }, (_, slot) => partSvg(slot)).join("")}</g>`,
  ST.map((_, index) => ram(index)).join(""),
  railFront(),
  magazineFront(),
  bin(),
  columns(1),
  ST.map((_, index) => crown(index)).join(""),
  consoleSvg(),
  gauge(),
];
partsBuilt = solids;

const LABEL_NL =
  "Een kleine assemblagelijn op een grondplaat: een magazijn met ruwe blokjes, drie persen boven een transportband met een bufferrail voor elke pers, een bedieningslijst met een cyclustijdknop per station, een opvangbak en een meter die de output per uur toont tegen een taktmarkering. De traagste pers is gemarkeerd; voor die pers stapelen de blokjes zich op.";
const LABEL_EN =
  "A small assembly line on a base plate: a magazine of raw blocks, three presses over a conveyor with a buffer rail in front of each press, a console with one cycle-time knob per station, an out bin, and a gauge reading output per hour against a takt marker. The slowest press is highlighted; blocks pile up in front of it.";

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
  --fl-hair:rgba(240,233,218,.12);--fl-accent:#5C9FAE;--fl-lamp-off:#26433F;--fl-void:#081A1E;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --fl-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --fl-hair:rgba(11,41,27,.14);--fl-accent:#276F81;--fl-lamp-off:#D0CAB8;--fl-void:#C9C0AA;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--fl-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate,.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 72px);min-height:200px;padding:26px 4px 46px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--fl-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 12px 14px}
.iso-plate-corner{font-family:var(--fl-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:0!important;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.4;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.fl-line{display:block}
.fl-acc{color:var(--fl-accent);font-weight:600}
.fl-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.fl-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.fl-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.fl-stamp{fill:var(--anatomy-mid);opacity:0}
${[1, 2, 3].map((n) => [1, 2, 3].filter((m) => m <= n).map((m) => `.fl-part[data-ops="${n}"] .fl-stamp[data-op="${m}"]`).join(",") + "{opacity:1}").join("\n")}
.fl-lamp{fill:var(--fl-lamp-off);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.fl-lamp[data-on]{fill:var(--anatomy-hi)}
.fl-lamp[data-on][data-acc]{fill:var(--fl-accent)}
[data-sel][data-on]{stroke:var(--anatomy-hi)!important}
.iso-shade[data-shade="0"].fl-void{fill:var(--fl-void)}
.fl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const ST = ${JSON.stringify(ST)};
const CYCLE0 = ${JSON.stringify(CYCLE)};
const TAKT = ${TAKT}, CAP = ${CAP}, TS = ${TIME_SCALE}, RANGE = ${JSON.stringify(RANGE)};
const MAG_X = ${MAG_X}, BELT_TOP = ${BELT_TOP}, HEAD_UP = ${HEAD_UP}, HEAD_DOWN = ${HEAD_DOWN};
const KNOB_Y = ${KNOB_Y}, KNOB_R = ${KNOB_R}, KNOB_TOP = ${KNOB_TOP};
const GAUGE = ${JSON.stringify(GAUGE)}, GAUGE_R = ${GAUGE_R}, GAUGE_TOP = ${GAUGE_TOP}, GAUGE_RANGE = ${JSON.stringify(GAUGE_RANGE)};
const SPAN = ${SPAN}, FROM = ${FROM};
const EXIT_X = ${BIN.x + BIN.w / 2 + 2}, BIN_X = ${BIN.x};
const knobAngle = ${knobAngle.toString()};
const gaugeAngle = ${gaugeAngle.toString()};
const slotX = (station, index) => ST[station] - 13 - 11 * index;
function knobPointer(index, value) { const a = knobAngle(value); const x = ST[index]; return lineOnTop([x, KNOB_Y], [x + Math.sin(a) * (KNOB_R - 0.1), KNOB_Y - Math.cos(a) * (KNOB_R - 0.1)], KNOB_TOP, P); }
function needleAt(rate) { const a = gaugeAngle(rate); const [x, y] = GAUGE; return lineOnTop([x - Math.sin(a) * 3.2, y + Math.cos(a) * 3.2], [x + Math.sin(a) * (GAUGE_R - 3.4), y - Math.cos(a) * (GAUGE_R - 3.4)], GAUGE_TOP + 0.2, P); }

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { bn: "bottleneck", out: "output", per: "/h", lead: "lead time", min: "min", st: "Station", s: "s", dec: ".", bnNow: "Bottleneck is now station ", over: "over takt", under: "within takt" }
  : { bn: "knelpunt", out: "output", per: "/u", lead: "doorlooptijd", min: "min", st: "Station", s: "s", dec: ",", bnNow: "Het knelpunt is nu station ", over: "boven takt", under: "binnen takt" };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);

const stage = document.querySelector(".fl-stage");
const svg = stage.querySelector("svg");
const layer = svg.querySelector('[data-layer="parts"]');
const pool = [...layer.querySelectorAll(".fl-part")];
const rams = ST.map((_, i) => svg.querySelector('[data-ram="' + i + '"]'));
const presses = ST.map((_, i) => [...svg.querySelectorAll('[data-press="' + i + '"] .iso-solid')]);
const knobs = ST.map((_, i) => svg.querySelector('[data-knob="' + i + '"]'));
const sels = ST.map((_, i) => svg.querySelector('[data-sel="' + i + '"]'));
const lamps = ST.map((_, i) => svg.querySelector('[data-lamp="' + i + '"]'));
const needle = svg.querySelector("[data-needle]");
const lines = [...document.querySelectorAll("[data-readout] .fl-line")];
const announcer = document.querySelector(".fl-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ discrete-event line model
let sim;
function freshSim() {
  return { t: 0, next: 1, st: ST.map(() => ({ part: null, start: 0, end: 0, done: false })), buf: ST.map(() => []), out: [], lastDep: null, ewma: null, parts: new Map() };
}
const cycle = CYCLE0.slice();
function settleLine(s) {
  for (let changed = true; changed; ) {
    changed = false;
    for (let i = ST.length - 1; i >= 0; i--) {
      const st = s.st[i];
      if (st.part !== null && st.done) {
        if (i === ST.length - 1) {
          s.out.push(st.part);
          const part = s.parts.get(st.part); if (part) { part.where = "out"; }
          if (s.lastDep !== null) { const iv = s.t - s.lastDep; s.ewma = s.ewma === null ? iv : s.ewma + 0.5 * (iv - s.ewma); }
          s.lastDep = s.t;
          st.part = null; st.done = false; changed = true;
        } else if (s.buf[i + 1].length < CAP) {
          s.buf[i + 1].push(st.part);
          const part = s.parts.get(st.part); if (part) part.where = "buf";
          st.part = null; st.done = false; changed = true;
        }
      }
      if (st.part === null) {
        let id = null;
        if (i === 0) { id = s.next++; s.parts.set(id, { id, where: "st" }); }
        else if (s.buf[i].length) id = s.buf[i].shift();
        if (id !== null) {
          st.part = id; st.start = s.t; st.c = cycle[i]; st.end = s.t + cycle[i]; st.done = false; changed = true;
          s.parts.get(id).where = "st";
        }
      }
    }
  }
}
function advance(s, to) {
  settleLine(s);
  for (;;) {
    let next = Infinity, who = -1;
    s.st.forEach((st, i) => { if (st.part !== null && !st.done && st.end < next) { next = st.end; who = i; } });
    if (who < 0 || next > to) { s.t = to; break; }
    s.t = next;
    s.st[who].done = true;
    settleLine(s);
  }
}
const wip = (s) => s.st.reduce((n, st) => n + (st.part !== null ? 1 : 0), 0) + s.buf.reduce((n, b) => n + b.length, 0);
const bottleneck = () => cycle.reduce((best, c, i) => (c > cycle[best] ? i : best), 0);

// ------------------------------------------------ what is drawn where
const views = new Map(); // part id -> { el, x, z, a }
const free = pool.slice();
function targetOf(id) {
  const s = sim;
  for (let i = 0; i < ST.length; i++) {
    if (s.st[i].part === id) return { x: ST[i], ops: i + (s.st[i].done || strokeAge(i) >= STROKE[0] ? 1 : 0) };
    const j = s.buf[i].indexOf(id);
    if (j >= 0) return { x: slotX(i, j), ops: i };
  }
  return { x: EXIT_X, ops: ST.length };
}
function viewOf(id, x0) {
  let v = views.get(id);
  if (!v) {
    const el = free.pop();
    if (!el) return null;
    el.style.display = "";
    v = { el, x: x0, z: 0, a: 1, ops: -1 };
    views.set(id, v);
  }
  return v;
}
function syncParts(dt, calm) {
  const s = sim;
  const live = new Set();
  s.st.forEach((st) => st.part !== null && live.add(st.part));
  s.buf.forEach((b) => b.forEach((id) => live.add(id)));
  while (s.out.length > 6) s.out.shift();
  s.out.forEach((id) => live.add(id));
  const follow = calm ? 1 : 1 - Math.exp(-dt / 0.12);
  for (const id of live) {
    const want = targetOf(id);
    const v = viewOf(id, MAG_X);
    if (!v) continue;
    v.x += (want.x - v.x) * follow;
    if (Math.abs(want.x - v.x) < 0.02) v.x = want.x;
    const drop = smooth(BIN_X - 3, BIN_X + 9, v.x);
    v.z = -7 * drop;
    v.a = 1 - smooth(BIN_X + 1, BIN_X + 10, v.x);
    if (v.ops !== want.ops) { v.ops = want.ops; v.el.dataset.ops = String(want.ops); }
  }
  for (const [id, v] of views) {
    if (!live.has(id) || v.a <= 0.01) {
      v.el.style.display = "none"; v.el.removeAttribute("transform"); free.push(v.el); views.delete(id);
      const at = s.out.indexOf(id); if (at >= 0) s.out.splice(at, 1);
    }
  }
  const order = [...views.values()].sort((a, b) => a.x - b.x);
  order.forEach((v) => {
    v.el.setAttribute("transform", translateAlong(P, [v.x, 0, v.z]));
    v.el.style.opacity = v.a < 1 ? v.a.toFixed(3) : "";
  });
  let same = true;
  const kids = layer.children;
  let n = 0;
  for (const el of kids) { if (el.style.display === "none") continue; if (order[n] && order[n].el !== el) { same = false; break; } n++; }
  if (!same) { const frag = document.createDocumentFragment(); order.forEach((v) => frag.appendChild(v.el)); layer.appendChild(frag); }
}

// ------------------------------------------------ state of the controls
const knob = cycle.map((c) => ({ x: c, target: c }));
const ramAt = ST.map(() => 0);
let rate = null, shownRate = null, selected = 1, lastBn = -1;
let frame = 0, last = 0, visible = false, touring = !still.matches, tourClock = 0, idleTimer = 0, quietTimer = 0;

function reseed() { sim = freshSim(); advance(sim, 1800); sim.out.length = 0; }
function snap() {
  for (const [, v] of views) { v.el.style.display = "none"; free.push(v.el); }
  views.clear();
  reseed();
  sim.out.length = 0;
  syncParts(1, true);
}

// The press stroke starts at 42% of the cycle and lasts half the cycle, at
// most 0.62 s of real time: down over the first 35%, dwell, up from 55%.
const STROKE = [0.35, 0.55, 1];
function strokeAge(i) {
  const st = sim.st[i];
  const span = Math.min(0.62, (0.5 * st.c) / TS);
  return (sim.t - st.start - 0.42 * st.c) / TS / span;
}
function pressDown(i) {
  const st = sim.st[i];
  if (st.part === null || st.done) return 0;
  const u = strokeAge(i);
  return smooth(0, STROKE[0], u) * (1 - smooth(STROKE[1], STROKE[2], u));
}

function draw(dt, calm) {
  const bn = bottleneck();
  ST.forEach((_, i) => {
    const want = calm ? 0 : pressDown(i);
    ramAt[i] = calm ? want : ramAt[i] + (want - ramAt[i]) * (1 - Math.exp(-dt / 0.07));
    if (Math.abs(ramAt[i] - want) < 1e-3) ramAt[i] = want;
    const dz = -(HEAD_UP - HEAD_DOWN) * ramAt[i];
    if (dz) rams[i].setAttribute("transform", translateAlong(P, [0, 0, dz])); else rams[i].removeAttribute("transform");
    knobs[i].setAttribute("d", knobPointer(i, knob[i].x));
    const on = sim.st[i].part !== null && !sim.st[i].done;
    if (on !== lamps[i].hasAttribute("data-on")) lamps[i].toggleAttribute("data-on", on);
    lamps[i].toggleAttribute("data-acc", i === bn);
    sels[i].toggleAttribute("data-on", i === selected);
  });
  if (bn !== lastBn) {
    presses.forEach((list, i) => list.forEach((el) => el.toggleAttribute("data-lit", i === bn)));
    lastBn = bn;
  }
  const measured = sim.ewma ? 3600 / sim.ewma : 3600 / Math.max(...cycle);
  rate = measured;
  shownRate = shownRate === null || calm ? measured : shownRate + (measured - shownRate) * (1 - Math.exp(-dt / 0.6));
  if (Math.abs(shownRate - measured) < 0.005) shownRate = measured;
  needle.setAttribute("d", needleAt(shownRate));
  const w = wip(sim);
  const r = Math.round(shownRate * 10) / 10;
  const lead = (w / r) * 60;
  const cBn = cycle[bn];
  const cmp = cBn > TAKT ? "&gt;" : cBn < TAKT ? "&lt;" : "=";
  const l1 = T.bn + ' <span class="fl-acc">S' + (bn + 1) + "</span> · " + cBn + " s " + cmp + " takt " + TAKT + " s";
  const l2 = T.out + " " + fmt(r, 1) + T.per + " · WIP " + w;
  const l3 = T.lead + " " + w + " ÷ " + fmt(r, 1) + " = " + fmt(lead, 1) + " " + T.min;
  if (lines[0].innerHTML !== l1) lines[0].innerHTML = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
}

function describe() {
  const bn = bottleneck();
  const c = knob[selected].target;
  stage.setAttribute("aria-valuenow", String(c));
  stage.setAttribute("aria-valuetext", T.st + " " + (selected + 1) + ": " + c + " s" + (selected === bn ? " · " + T.bn : "") + " · " + (c > TAKT ? T.over : T.under));
}
function announce() {
  clearTimeout(quietTimer);
  quietTimer = setTimeout(() => { announcer.textContent = T.bnNow + (bottleneck() + 1) + " (" + cycle[bottleneck()] + " s), " + T.out + " " + fmt(3600 / cycle[bottleneck()], 1) + " " + T.per; }, 700);
}

// ------------------------------------------------ idle tour
// Station 2 is sped up and station 3 slowed to 70 s: the bottleneck moves to
// station 3, a pile builds in front of it and the output drops to 51/h. Then
// both return to the start and the pile in front of station 3 drains.
const TOUR = [
  [0, null],
  [4, [1, 40]],
  [6, [2, 70]],
  [24, [2, 45]],
  [27, [1, 55]],
];
const TOUR_LEN = 50;
function tourAt(clock) {
  const t = clock % TOUR_LEN;
  const set = CYCLE0.slice();
  let sel = 1;
  for (const [at, step] of TOUR) {
    if (t < at) break;
    if (step) { set[step[0]] = step[1]; sel = step[0]; }
  }
  return { set, sel };
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) {
    tourClock += dt;
    const { set, sel } = tourAt(tourClock);
    set.forEach((v, i) => (knob[i].target = v));
    if (sel !== selected) { selected = sel; describe(); }
  }
  let changed = false;
  knob.forEach((kn, i) => {
    if (calm) kn.x = kn.target;
    else {
      const step = 14 * dt; // knob turns at most 14 s of setting per second
      const d = kn.target - kn.x;
      kn.x += Math.abs(d) <= step ? d : Math.sign(d) * step * smooth(0, 3, Math.abs(d)) + Math.sign(d) * 0.02;
      if (Math.abs(kn.target - kn.x) < 0.02) kn.x = kn.target;
    }
    const c = Math.round(kn.x);
    if (c !== cycle[i]) { cycle[i] = c; changed = true; }
  });
  if (changed) { describe(); announce(); if (calm) snap(); }
  if (!calm) advance(sim, sim.t + dt * TS);
  syncParts(dt, calm);
  draw(dt, calm);
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) { tick(performance.now()); } else run(); };

function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; run(); } }, 40000);
}
function setKnob(i, value) {
  steer();
  selected = i;
  knob[i].target = clamp(Math.round(value), RANGE[0], RANGE[1]);
  if (still.matches) knob[i].x = knob[i].target;
  describe();
  kick();
}

// ------------------------------------------------ pointer: tap a knob to step +5 s, drag sideways to set
const knobScreen = ST.map((x) => iso([x, KNOB_Y, KNOB_TOP], P));
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearest([x, y]) {
  let best = 0, bestD = Infinity;
  knobScreen.forEach(([kx, ky], i) => { const d = Math.hypot((x - kx) * 1, (y - ky) * 0.35); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const p = toView(event);
  const i = nearest(p);
  press = { i, x0: p[0], start: knob[i].target, dragging: false, id: event.pointerId };
  selected = i;
  steer();
  describe();
  kick();
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const p = toView(event);
  const dx = p[0] - press.x0;
  if (!press.dragging && Math.abs(dx) > 6) { press.dragging = true; try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setKnob(press.i, press.start + dx / 4);
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (!press.dragging && event.type === "pointerup") {
    const next = press.start + 5 > RANGE[1] ? RANGE[0] : press.start + 5;
    setKnob(press.i, next);
  }
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);

// ------------------------------------------------ keyboard
stage.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 5 : 1;
  const value = knob[selected].target;
  let handled = true;
  if (event.key === "ArrowUp") setKnob(selected, value + step);
  else if (event.key === "ArrowDown") setKnob(selected, value - step);
  else if (event.key === "PageUp") setKnob(selected, value + 5);
  else if (event.key === "PageDown") setKnob(selected, value - 5);
  else if (event.key === "Home") setKnob(selected, RANGE[0]);
  else if (event.key === "End") setKnob(selected, RANGE[1]);
  else if (event.key === "ArrowRight") { steer(); selected = Math.min(ST.length - 1, selected + 1); describe(); kick(); }
  else if (event.key === "ArrowLeft") { steer(); selected = Math.max(0, selected - 1); describe(); kick(); }
  else if (/^[1-9]$/.test(event.key) && Number(event.key) <= ST.length) { steer(); selected = Number(event.key) - 1; describe(); kick(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); announcer.textContent = T.bnNow + (bottleneck() + 1); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; knob.forEach((kn) => (kn.x = kn.target)); snap(); tick(performance.now()); } else run(); });
reseed();
syncParts(1, true);
describe();
draw(1 / 60, true);
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: { title: "De bottleneck bepaalt de output", hint: "Tik of sleep een knop", label: LABEL_NL, aria: "Cyclustijdknoppen van drie stations. Pijl links en rechts kiest een station, pijl omhoog en omlaag verandert de cyclustijd met 1 seconde (Shift: 5)." },
  en: { title: "The bottleneck sets the output", hint: "Tap or drag a knob", label: LABEL_EN, aria: "Cycle-time knobs of three stations. Left and right arrows pick a station, up and down change its cycle time by 1 second (Shift: 5)." },
};

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: STRINGS.nl.hint,
  readout: "",
  body: `<div class="fl-stage" tabindex="0" role="slider" aria-label="${STRINGS.nl.aria}" aria-valuemin="${RANGE[0]}" aria-valuemax="${RANGE[1]}" aria-valuenow="${CYCLE[1]}">${svg}</div><div class="fl-sr" aria-live="polite"></div>`,
}).replace('data-readout></span>', 'data-readout><span class="fl-line"></span><span class="fl-line"></span><span class="fl-line"></span></span>');

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;c("hint").textContent=s.hint;
var st=document.querySelector(".fl-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${partsBuilt} static solids · ${POOL} pooled parts`);
