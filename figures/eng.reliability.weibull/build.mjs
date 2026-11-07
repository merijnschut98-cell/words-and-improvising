// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Failure data and Weibull in words" (module Reliability).
//
//   node figures/eng.reliability.weibull/build.mjs            build the page
//   node figures/eng.reliability.weibull/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.reliability.weibull.html: one offline
// page with the anatomy kit and the live script inlined. The page reads
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
const G = await import(pathToFileURL(join(SKILL, "kit/lathe.mjs")).href);
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.reliability.weibull.html");

// ---------------------------------------------------------------- the model
// A skid of N = 20 identical pumps, all new at month 0, followed for H = 48
// months. Each pump's life follows a Weibull with scale eta = 12 months (by
// that age 63.2 % of new pumps have failed, whatever the shape) and shape beta:
//   0.7 infant mortality · 1 random · 3 wear-out (fatigue is often 2 to 4).
// A pump that fails is down for half a month and then runs again as new
// (failures counted; repair does not change the shape). With "fixed
// replacement" every pump gets a new part every X = 6 months, failed or not
// (the 6 months from the lesson's opening question).
// Randomness is a seeded generator, one stream per pump, shared by both
// strategies and every beta (common random numbers), so the screenshots and
// the numbers below are stable. The seed was picked as typical: each of the
// six yearly rates sits within 5 % of the mean over 2,000 simulated skids,
// which the build checks.
const N = 20;
const ETA = 12;
const H = 48;
const X = 6;
const DOWN = 0.5;
const BETAS = [0.7, 1, 3];
const SEED = 297;
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const life = (u, beta) => ETA * Math.pow(-Math.log(1 - u), 1 / beta);
function simulate(seed, beta, fixed) {
  const pumps = [];
  for (let i = 0; i < N; i++) {
    const draw = rng(seed * 1000 + i * 7919 + 1);
    const fails = [];
    let start = 0;
    let next = fixed ? X : Infinity;
    while (start < H) {
      const tf = start + life(draw(), beta);
      if (tf < next && tf < H) {
        fails.push(tf);
        start = tf + DOWN;
        if (start >= next) { start = next; next += X; }
      } else if (next < H && next <= tf) {
        start = next;
        next += X;
      } else break;
    }
    pumps.push(fails);
  }
  return pumps;
}
const countOf = (pumps) => pumps.reduce((sum, fails) => sum + fails.length, 0);
const perYear = (pumps) => countOf(pumps) / (H / 12);

const RUNS = {};
const RATE = {};
for (const beta of BETAS) {
  RUNS[beta] = { off: simulate(SEED, beta, false), on: simulate(SEED, beta, true) };
  RATE[beta] = { off: perYear(RUNS[beta].off), on: perYear(RUNS[beta].on) };
}
// the mean over many skids, for the checks
const MEAN = {};
for (const beta of BETAS) {
  let off = 0;
  let on = 0;
  const M = 2000;
  for (let s = 1; s <= M; s++) { off += perYear(simulate(s, beta, false)); on += perYear(simulate(s, beta, true)); }
  MEAN[beta] = { off: off / M, on: on / M };
}
const verdictOf = (beta) => (beta > 1 ? "helps" : beta < 1 ? "worse" : "none");
{
  const fail = (msg) => { throw new Error("model check: " + msg); };
  if (Math.abs(1 - Math.exp(-1) - 0.632) > 5e-4) fail("63.2 % at eta");
  for (const beta of BETAS) {
    for (const mode of ["off", "on"]) {
      const rel = Math.abs(RATE[beta][mode] - MEAN[beta][mode]) / MEAN[beta][mode];
      if (rel > 0.05) fail(`beta ${beta} ${mode}: seed ${RATE[beta][mode]} vs mean ${MEAN[beta][mode].toFixed(2)}`);
    }
  }
  // beta < 1: fixed replacement makes it worse (lesson: "makes it worse")
  if (!(MEAN[0.7].on > MEAN[0.7].off * 1.3 && RATE[0.7].on > RATE[0.7].off * 1.3)) fail("beta 0.7 should be clearly worse with fixed replacement");
  // beta = 1: buys nothing
  if (Math.abs(MEAN[1].on - MEAN[1].off) / MEAN[1].off > 0.02 || Math.abs(RATE[1].on - RATE[1].off) / RATE[1].off > 0.08) fail("beta 1 should not change");
  // beta > 1: helps
  if (!(MEAN[3].on < MEAN[3].off * 0.4 && RATE[3].on < RATE[3].off * 0.4)) fail("beta 3 should be clearly better with fixed replacement");
  // shown numbers (asserted so a change to the model is noticed)
  const shown = BETAS.map((b) => `${RATE[b].off}/${RATE[b].on}`).join(" ");
  if (shown !== "18/26 20/19.75 20.25/4.75") fail("shown rates changed: " + shown);
}
const MAXCUM = Math.max(...BETAS.flatMap((b) => [countOf(RUNS[b].off), countOf(RUNS[b].on)]));
const YMAX = Math.ceil((MAXCUM * 1.04) / 10) * 10;

// ---------------------------------------------------------------- the world
// World units are centimetres, z up. The skid lies on the floor (z = 0); four
// rails run along x, five vertical inline pumps stand on each, a discharge
// header lies behind every row and the four headers end on a cross manifold at
// −x. The controller stands on a pedestal behind the skid, its screen facing +y.
const WIDTH = 600;
const SKID = { x: -40, y: -34, w: 80, d: 68, r: 1.2 };
const SKID_TOP = 4;
const RAIL_TOP = 6;
const ROWS = [-22.5, -7.5, 7.5, 22.5];
const COLS = [-26, -13, 0, 13, 26];
const RC = 3.4; // casing radius
const RM = 2.5; // motor radius
const RH = 1.6; // header radius
const CASE_TOP = RAIL_TOP + 5;
const MOTOR_TOP = CASE_TOP + 8.5;
const HZ = RAIL_TOP + RH;
const PUMPS = [];
ROWS.forEach((ry, row) => COLS.forEach((px, col) => PUMPS.push({ row, col, x: px, y: ry + 1.6 })));
const POST = [0, -47];
const BOX = { x: -34, y: -51, w: 68, d: 8, r: 0.8 };
const Z0 = 26;
const BOX_Z = [Z0, Z0 + 32];
const FACE_Y = BOX.y + BOX.d;
const WIN = { x0: -30, x1: 30, z0: Z0 + 6.4, z1: Z0 + 30, r: 1.4, depth: 0.8 };
const PLOT = { x0: WIN.x0 + 1.2, x1: WIN.x1 - 1.2, z0: WIN.z0 + 0.6, z1: WIN.z1 - 1.6 };

const FIT = [...k.boxCorners(SKID, 0, MOTOR_TOP), ...k.boxCorners({ x: -36, y: -52, w: 72, d: 10 }, 0, BOX_Z[1] + 2)];
const PAD = 10;
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
const X3 = [1, 0, 0];
const Y3 = [0, 1, 0];
const Z3 = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X3, Y3, Z3);
const frameY = (o) => G.frameOf(o, Y3, X3, Z3);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, {});
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, attrs });
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
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}

// A recess in the face y = const: inner walls shaded by facing, a back plane
// holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "cp-glass") {
  const id = `wb-clip-${clips++}`;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops = [];
  const sides = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length];
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let [nx, nz] = [(bz - az) / length, -(bx - ax) / length];
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))].push(quad);
  });
  const shape = flatRect(x0, z0, x1, z1, r);
  return [
    `<clipPath id="${id}"><path transform="${planeOf(y)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#${id})">`,
    `<path class="iso-top" d="${tops.join("")}"/>`,
    ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join("")}"/>` : "")),
    `<g transform="${planeOf(y - depth)}"><path class="${backClass}" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    `</g>`,
    `<g transform="${planeOf(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

// ---------------------------------------------------------------- floor and skid
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(SKID, -2), 0, 2, P)}"/>`,
  `<path class="iso-halo" d="${k.haloOf({ x: -9, y: -55, w: 18, d: 16, r: 3 }, 0, 1, P)}" style="opacity:.6"/>`,
];
{
  const anchors = k.corners(SKID, 4);
  const extra =
    L(k.planOutline(k.insetPlan(SKID, 1.8), SKID_TOP, P, 3), { tone: "faint" }) +
    L(anchors.map(([x, y]) => k.ring(x, y, 1.4, SKID_TOP, P, 14)).join(""), { tone: "lo" }) +
    Dt(anchors.map(([x, y]) => at([x, y, SKID_TOP])), { size: 0.45 });
  // a nameplate on the skid's near long side
  const fy = SKID.y + SKID.d;
  const plate = [
    `<g transform="${planeOf(fy)}">`,
    `<path class="wb-card" d="${flatRect(18, 0.8, 32, 3.2, 0.3, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M19.6 -2.4H29M19.6 -1.6H25"/>`,
    `</g>`,
    Dt([at([18.8, fy, 2]), at([31.2, fy, 2])], { size: 0.35 }),
  ].join("");
  box("skid.frame", SKID, 0, SKID_TOP, { tone: "lo" }, { ground: true, steps: 3, bevel: 0.6, inner: L(k.sideSeam(SKID, 1.4, P, 3), { tone: "faint" }), extra: extra + plate });
}
// an earth boss at the skid's near corner
post("skid.earth", 34, 30, 1.4, SKID_TOP, SKID_TOP + 1, { tone: "mid" }, { steps: 6 });
post("skid.earth-stud", 34, 30, 0.7, SKID_TOP + 1, SKID_TOP + 2.6, { tone: "hi", crease: "none" }, { steps: 14, extra: Dt([at([34, 30, SKID_TOP + 2.6])], { size: 0.4, tone: "hi" }) });

// ---------------------------------------------------------------- rails and headers
for (const ry of ROWS) {
  const rail = { x: -37, y: ry - 6, w: 73, d: 12, r: 0.5 };
  const bolts = [[-34.6, ry - 3.6], [-34.6, ry + 3.6], [33.6, ry - 3.6], [33.6, ry + 3.6]];
  box("rail", rail, SKID_TOP, RAIL_TOP, { tone: "mid" }, {
    steps: 2,
    bevel: 0.3,
    extra: L(bolts.map(([x, y]) => k.ring(x, y, 0.9, RAIL_TOP, P, 12)).join(""), { tone: "lo" }) + Dt(bolts.map(([x, y]) => at([x, y, RAIL_TOP])), { size: 0.4 }),
  });
  // the row's discharge header, lying on the rail behind the casings
  const hy = ry + 1.6 - RC - RH;
  const FH = frameX([-33.4, hy, HZ]);
  discAt("header", FH, 0, 68, RH, { tone: "mid", crease: "lo" }, { inner: L(G.arcOf(FH, 64, RH, P), { tone: "faint" }) });
  discAt("header.cap", FH, 68, 69.2, RH, { tone: "mid" }, { steps: 6 });
}
// cross manifold at −x: every header's end lands on it; it leaves at the back
{
  const FM = frameY([-35, -30, HZ]);
  discAt("manifold", FM, 0, 54, RH, { tone: "mid", crease: "lo" }, {});
  discAt("manifold.flange", FM, -1.4, 0, RH + 1.1, { tone: "mid" }, { extra: Dt(G.dotsOf(FM, -0.7, RH + 0.75, 6, P, { fade: [0.05, 0.35] }), { size: 0.35 }) });
  discAt("manifold.cap", FM, 54, 55.2, RH, { tone: "mid" }, { steps: 6 });
}

// ---------------------------------------------------------------- the pumps
const LAMP_R = 1.05;
PUMPS.forEach((pump, index) => {
  const { x, y } = pump;
  // the fault tag: hung on the casing's front when the pump fails
  const ty = y + RC;
  const tag = [[x - 2.2, ty, CASE_TOP - 0.5], [x + 2.2, ty, CASE_TOP - 0.5], [x + 2.2, ty, RAIL_TOP + 0.7], [x - 2.2, ty, RAIL_TOP + 0.7]];
  const tagSvg = [
    `<g class="wb-tag" data-tag="${index}" style="opacity:0">`,
    `<path class="wb-card" d="${k.pathOf(tag.map(at), true)}"/>`,
    L(k.sideRing([x, ty, CASE_TOP - 1.5], 0.4, "y", P, 12), { tone: "lo" }),
    L([CASE_TOP - 2.6, CASE_TOP - 3.4].map((z, i) => k.segment([x - 1.2, ty, z], [x - 1.2 + [2.4, 1.6][i], ty, z], P)).join(""), { tone: "lo", free: true }),
    `</g>`,
  ].join("");
  const bolts = Array.from({ length: 6 }, (_, i) => [x + (RC - 0.45) * Math.cos((i + 0.5) * Math.PI / 3), y + (RC - 0.45) * Math.sin((i + 0.5) * Math.PI / 3)]);
  post("pump.casing", x, y, RC, RAIL_TOP, CASE_TOP, { tone: "mid" }, {
    steps: 32,
    bevel: 0.35,
    inner: L(k.sideArc(x, y, RC, RAIL_TOP + 1.2, P, 24), { tone: "faint" }),
    extra: Dt(bolts.map(([bx, by]) => at([bx, by, CASE_TOP])), { size: 0.36, tone: "mid" }) + tagSvg,
  });
  // the motor: two frame seams, a flat cap holding the status lamp
  const lampTop = at([x, y, MOTOR_TOP]);
  post("pump.motor", x, y, RM, CASE_TOP, MOTOR_TOP, { tone: "hi", crease: "lo" }, {
    steps: 28,
    bevel: 0.3,
    inner: L(k.sideArc(x, y, RM, CASE_TOP + 2, P, 20) + k.sideArc(x, y, RM, MOTOR_TOP - 2.2, P, 20), { tone: "faint" }),
    extra: [
      `<path class="wb-pulse" data-pulse="${index}" d="${k.ring(x, y, RM + 1.2, MOTOR_TOP, P, 28)}" style="opacity:0"/>`,
      `<path class="wb-lamp" data-lamp="${index}" data-on="" d="${k.ring(x, y, LAMP_R, MOTOR_TOP, P, 18)}"/>`,
      L(k.ring(x, y, LAMP_R, MOTOR_TOP, P, 18), { tone: "lo" }),
      Dt([[x + 1.75, y]].map(([dx, dy]) => at([dx, dy, MOTOR_TOP])), { size: 0.3, tone: "mid" }),
    ].join(""),
  });
  pump.top = lampTop;
});

// ---------------------------------------------------------------- the controller on its pedestal
{
  const foot = { x: -8, y: -54, w: 16, d: 14, r: 1 };
  const bolts = k.corners(foot, 2.2);
  box("stand.foot", foot, 0, 1.4, { tone: "lo" }, { steps: 2, bevel: 0.3, extra: Dt(bolts.map(([x, y]) => at([x, y, 1.4])), { size: 0.45 }) });
  post("panel.post", POST[0], POST[1], 2.2, 1.4, BOX_Z[0] - 5, { tone: "mid" }, { steps: 24, inner: L(k.sideArc(POST[0], POST[1], 2.2, 8, P, 16), { tone: "faint" }) });
  post("panel.collar", POST[0], POST[1], 3.4, BOX_Z[0] - 5, BOX_Z[0], { tone: "mid" }, { steps: 28, bevel: 0.3 });
  const fy = FACE_Y;
  const screen = [
    `<path class="iso-line" data-tone="faint" d="M${WIN.x0} ${-PLOT.z0}H${WIN.x1}"/>`,
    `<path class="iso-line" data-tone="mid" data-ticks="" d=""/>`,
    `<path class="iso-line" data-tone="faint" data-cursor="" d=""/>`,
    `<path class="wb-other" data-other="" d=""/>`,
    `<path class="wb-trend" data-trend="" d=""/>`,
    `<circle class="wb-now" data-now="" cx="${PLOT.x0}" cy="${-PLOT.z0}" r="0.6"/>`,
  ].join("");
  const label = { x0: -21, x1: -1, z0: Z0 + 1.8, z1: Z0 + 5 };
  const faceBits = [
    recess(WIN, fy, screen),
    `<g transform="${planeOf(fy)}">`,
    `<path class="wb-card" d="${flatRect(label.x0, label.z0, label.x1, label.z1, 0.4, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-19.4 ${-(Z0 + 3.9)}H-3.4M-19.4 ${-(Z0 + 2.9)}H-9.4"/>`,
    `</g>`,
    Dt([[BOX.x + 1.4, fy, BOX_Z[0] + 1.4], [BOX.x + BOX.w - 1.4, fy, BOX_Z[0] + 1.4], [BOX.x + 1.4, fy, BOX_Z[1] - 1.4], [BOX.x + BOX.w - 1.4, fy, BOX_Z[1] - 1.4]].map(at), { size: 0.42 }),
  ].join("");
  box("panel.box", BOX, BOX_Z[0], BOX_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.6, extra: faceBits });
  const FL = frameY([-26, fy, Z0 + 3.4]);
  discAt("panel.lamp-ring", FL, 0, 0.6, 1.7, { tone: "mid" }, {});
  discAt("panel.lamp", FL, 0.6, 1.3, 1.15, { tone: "hi", crease: "none" }, { attrs: ' data-panel-lamp=""' });
  discAt("panel.key", frameY([27, fy, Z0 + 3.4]), 0, 1.4, 1.6, { tone: "mid" }, { extra: L(k.segment([27, fy + 1.4, Z0 + 1.82], [27, fy + 1.4, Z0 + 4.98], P), { tone: "lo" }) });
  const hood = { x: BOX.x - 1, y: BOX.y - 0.6, w: BOX.w + 2, d: BOX.d + 2.2, r: 0.8 };
  box("panel.hood", hood, BOX_Z[1], BOX_Z[1] + 1.4, { tone: "mid" }, { steps: 2, bevel: 0.3 });
}
function plotX(month) {
  return PLOT.x0 + ((PLOT.x1 - PLOT.x0) * month) / H;
}
function plotZ(n) {
  return PLOT.z0 + ((PLOT.z1 - PLOT.z0) * n) / YMAX;
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups];

const LABEL_NL =
  "Een skid met twintig identieke verticale inline-pompen in vier rijen van vijf, elk met een pomphuis, een motor en een statuslampje bovenop. Achter elke rij ligt een persleiding; de vier leidingen komen samen in een verzamelleiding. Achter de skid staat een besturingskast op een voet; het scherm toont het opgetelde aantal storingen over 48 maanden, voor de gekozen aanpak en ter vergelijking voor de andere. Valt een pomp uit, dan gaat het lampje uit en hangt er een storingslabel aan; een halve maand later draait er een nieuwe. Met vaste vervanging krijgen alle pompen elke 6 maanden een nieuw onderdeel.";
const LABEL_EN =
  "A skid of twenty identical vertical inline pumps in four rows of five, each with a pump casing, a motor and a status lamp on top. A discharge header lies behind each row; the four headers join a cross manifold. A controller stands on a pedestal behind the skid; its screen shows cumulative failures over 48 months for the chosen strategy and, for comparison, the other one. When a pump fails its lamp goes out and a fault tag hangs on it; half a month later a new one runs. With fixed replacement every pump gets a new part every 6 months.";

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
  --mp-hair:rgba(240,233,218,.12);--mp-accent:#5C9FAE;--mp-glass:#0A1E23;--mp-well:#0A1E23;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --mp-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --mp-hair:rgba(11,41,27,.14);--mp-accent:#276F81;--mp-glass:#E2ECEA;--mp-well:#DDD4BF;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--mp-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 173px);min-height:240px;padding:26px 4px 143px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--mp-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--mp-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:73px!important;max-width:40%;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:73px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.mp-line{display:block;white-space:pre}
.mp-acc{color:var(--mp-accent);font-weight:600}
.mp-strong{color:var(--anatomy-strong);font-weight:600}
.mp-mute{color:var(--anatomy-muted)}
.mp-model{position:absolute;left:0;right:0;bottom:0;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.3;color:var(--anatomy-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:ew-resize;border-radius:8px}
.mp-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.mp-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.mp-controls{position:absolute;left:10px;right:10px;bottom:22px;height:44px;display:flex;align-items:center;gap:6px}
.mp-btn{min-width:44px;min-height:44px;height:44px;padding:0 8px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--mp-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--mp-hair);display:inline-flex;align-items:center;justify-content:center;gap:2px;white-space:nowrap}
.mp-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.mp-btn[aria-checked="true"],.mp-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--mp-accent);color:var(--mp-accent);font-weight:600}
.mp-btn small{font-size:10px;color:var(--anatomy-muted);font-weight:400}
.mp-btn[aria-checked="true"] small,.mp-btn[aria-pressed="true"] small{color:var(--mp-accent)}
.mp-seg{display:flex;gap:4px;flex:1 1 auto}
.mp-seg .mp-btn{flex:1 1 0;max-width:60px;font-family:var(--anatomy-mono)}
.mp-fixed{flex:0 0 auto;gap:5px!important;padding:0 10px!important}
.mp-fixed i{width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.2px currentColor;display:inline-block}
.mp-fixed[aria-pressed="true"] i{background:currentColor}
.mp-play svg{width:14px;height:14px;fill:currentColor}
.mp-play [data-icon="pause"]{display:none}
.mp-play[data-on] [data-icon="pause"]{display:block}
.mp-play[data-on] [data-icon="play"]{display:none}
.mp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.cp-glass{fill:var(--mp-glass);stroke:none}
.wb-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.wb-tag .wb-card{fill:var(--anatomy-hi);stroke:var(--anatomy-hi)}
.wb-other{fill:none;stroke:var(--anatomy-mid);stroke-width:.7px;stroke-linejoin:round}
.wb-trend{fill:none;stroke:var(--mp-accent);stroke-width:1.4px;stroke-linejoin:round;stroke-linecap:round}
.wb-now{fill:var(--anatomy-hi);stroke:none}
.wb-lamp{fill:var(--mp-well);stroke:none;transition:fill .25s}
.wb-lamp[data-on]{fill:var(--mp-accent)}
.wb-pulse{fill:none;stroke:var(--mp-accent);stroke-width:1px}
[data-panel-lamp] .iso-top,[data-panel-lamp] .iso-shade,[data-panel-lamp] .iso-fill{fill:var(--mp-accent)}
@media (prefers-reduced-motion:reduce){.wb-lamp{transition:none}}
`;

// ---------------------------------------------------------------- live script
const round2 = (v) => Math.round(v * 100) / 100;
const EVENTS = Object.fromEntries(BETAS.map((b) => [b, { off: RUNS[b].off.map((f) => f.map(round2)), on: RUNS[b].on.map((f) => f.map(round2)) }]));
const live = `
const N = ${N}, H = ${H}, X = ${X}, DOWN = ${DOWN}, ETA = ${ETA}, YMAX = ${YMAX};
const BETAS = ${JSON.stringify(BETAS)};
const EVENTS = ${JSON.stringify(EVENTS)};
const RATE = ${JSON.stringify(RATE)};
const PLOT = ${JSON.stringify(PLOT)};
const MO_PER_S = 3;
${plotX.toString()}
${plotZ.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { pattern: { 0.7: "infant mortality", 1: "random", 3: "wear-out" }, off: "run to failure", on: "every " + X + " mo", yr: "/yr", verdict: { helps: "fixed replacement helps", worse: "fixed replacement makes it worse", none: "fixed replacement does not help" }, month: "month", failures: "failures", one: "failure", eta: "eta " + ETA + " mo", dec: "." }
  : { pattern: { 0.7: "kindersterfte", 1: "willekeurig", 3: "slijtage" }, off: "tot storing", on: "elke " + X + " mnd", yr: "/jr", verdict: { helps: "vaste vervanging helpt", worse: "vaste vervanging maakt het erger", none: "vaste vervanging helpt niet" }, month: "maand", failures: "storingen", one: "storing", eta: "èta " + ETA + " mnd", dec: "," };
const fmt = (v) => String(v).replace(".", T.dec);
const f1 = (v) => v.toFixed(1).replace(".", T.dec);
const verdictOf = ${verdictOf.toString()};

const stage = document.querySelector(".mp-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { ticks: q("[data-ticks]"), cursor: q("[data-cursor]"), other: q("[data-other]"), trend: q("[data-trend]"), now: q("[data-now]") };
const lamps = [...svg.querySelectorAll("[data-lamp]")];
const tags = [...svg.querySelectorAll("[data-tag]")];
const pulses = [...svg.querySelectorAll("[data-pulse]")];
const lines = [...document.querySelectorAll("[data-readout] .mp-line")];
const modelLine = document.querySelector("[data-model]");
const radios = [...document.querySelectorAll(".mp-seg .mp-btn")];
const fixedBtn = document.querySelector(".mp-fixed");
const playBtn = document.querySelector(".mp-play");
const announcer = document.querySelector(".mp-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const state = { beta: 0.7, fixed: true, t: H, playing: false, hold: 0 };
const modeOf = (fixed) => (fixed ? "on" : "off");
const runOf = (beta, fixed) => EVENTS[beta][modeOf(fixed)];
const allFails = (run) => run.flat().sort((a, b) => a - b);
const countTo = (run, t) => run.reduce((n, f) => n + f.filter((x) => x <= t).length, 0);

function stepPath(times, t) {
  let d = "M" + plotX(0).toFixed(2) + " " + (-plotZ(0)).toFixed(2);
  let n = 0;
  for (const x of times) {
    if (x > t) break;
    const px = plotX(x).toFixed(2);
    d += "H" + px + "V" + (-plotZ(++n)).toFixed(2);
  }
  return { d: d + "H" + plotX(t).toFixed(2), n };
}
let shownTicks = null;
function screen() {
  const t = state.t;
  const ticksKey = state.fixed ? "on" : "off";
  if (shownTicks !== ticksKey) {
    shownTicks = ticksKey;
    const ticks = [];
    if (state.fixed) for (let m = X; m < H; m += X) ticks.push("M" + plotX(m).toFixed(2) + " " + (-PLOT.z0).toFixed(2) + "v-1.4");
    el.ticks.setAttribute("d", ticks.join(""));
  }
  const mine = stepPath(allFails(runOf(state.beta, state.fixed)), t);
  const other = stepPath(allFails(runOf(state.beta, !state.fixed)), t);
  el.trend.setAttribute("d", mine.d);
  el.other.setAttribute("d", other.d);
  el.now.setAttribute("cx", plotX(t).toFixed(2));
  el.now.setAttribute("cy", (-plotZ(mine.n)).toFixed(2));
  el.cursor.setAttribute("d", t > 0.05 && t < H - 0.05 ? "M" + plotX(t).toFixed(2) + " " + (-WIN_TOP).toFixed(2) + "V" + (-PLOT.z0).toFixed(2) : "");
  return mine.n;
}
const WIN_TOP = ${WIN.z1 - 0.01};

function rack() {
  const t = state.t;
  const run = runOf(state.beta, state.fixed);
  run.forEach((fails, i) => {
    let down = false;
    let since = Infinity;
    for (const f of fails) {
      if (f <= t && t < f + DOWN) down = true;
      if (f + DOWN <= t) since = Math.min(since, t - (f + DOWN));
    }
    if (state.fixed && t >= X) since = Math.min(since, t - Math.floor(t / X) * X);
    if (down) lamps[i].removeAttribute("data-on"); else lamps[i].setAttribute("data-on", "");
    tags[i].style.opacity = down ? "1" : "0";
    const a = still.matches || down ? 0 : Math.exp(-since / 0.35) * (since < 1.6 ? 1 : 0);
    pulses[i].style.opacity = a.toFixed(3);
  });
}

let lastAnnounce = "";
function readout(n) {
  const b = state.beta, r = RATE[b], v = verdictOf(b);
  const l1 = "β " + fmt(b) + " · " + T.pattern[b];
  const mark = (on, text) => (on ? '<span class="mp-acc">' + text + "</span>" : '<span class="mp-mute">' + text + "</span>");
  const l2 = mark(!state.fixed, T.off.padEnd(12) + f1(r.off).padStart(5) + " " + T.yr);
  const l3 = mark(state.fixed, T.on.padEnd(12) + f1(r.on).padStart(5) + " " + T.yr);
  const l4 = v === "helps" ? '<span class="mp-acc">' + T.verdict[v] + "</span>" : v === "worse" ? '<span class="mp-strong">' + T.verdict[v] + "</span>" : '<span class="mp-mute">' + T.verdict[v] + "</span>";
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].innerHTML !== l2) lines[1].innerHTML = l2;
  if (lines[2].innerHTML !== l3) lines[2].innerHTML = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
  const m = T.month + " " + Math.floor(state.t + 1e-6) + " · " + n + " " + (n === 1 ? T.one : T.failures) + " · " + T.eta;
  if (modelLine.textContent !== m) modelLine.textContent = m;
  const key = b + modeOf(state.fixed);
  if (key !== lastAnnounce) { lastAnnounce = key; announcer.textContent = l1 + ". " + T.off + " " + f1(r.off) + " " + T.yr + ", " + T.on + " " + f1(r.on) + " " + T.yr + ". " + T.verdict[v] + "."; }
}
function describe() {
  stage.setAttribute("aria-valuenow", String(Math.round(state.t)));
  stage.setAttribute("aria-valuetext", T.month + " " + Math.round(state.t) + ", β " + fmt(state.beta) + ", " + (state.fixed ? T.on : T.off));
  radios.forEach((btn) => { const on = Number(btn.dataset.b) === state.beta; btn.setAttribute("aria-checked", String(on)); btn.tabIndex = on ? 0 : -1; });
  fixedBtn.setAttribute("aria-pressed", String(state.fixed));
  if (state.playing) playBtn.setAttribute("data-on", ""); else playBtn.removeAttribute("data-on");
  playBtn.setAttribute("aria-label", state.playing ? playBtn.dataset.pause : playBtn.dataset.play);
}
function draw() {
  const n = screen();
  rack();
  readout(n);
}

// ------------------------------------------------ time and the idle tour
const TOUR = [[0.7, true], [3, true], [1, true]];
let tourStep = 0, touring = !still.matches, idleTimer = 0, pendingTour = false;
function startRun(beta, fixed) {
  state.beta = beta; state.fixed = fixed; state.t = 0; state.hold = 0.5; state.playing = true;
  describe();
}
function advance(dt) {
  if (state.hold > 0) { state.hold -= dt; return; }
  state.t = Math.min(H, state.t + dt * MO_PER_S);
  if (state.t >= H) {
    state.hold = 3;
    if (touring) { tourStep = (tourStep + 1) % TOUR.length; pendingTour = true; }
    else { state.playing = false; describe(); }
  }
}
let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (!still.matches && state.playing) {
    if (pendingTour && state.hold <= 0) { pendingTour = false; startRun(...TOUR[tourStep]); }
    else advance(dt);
  }
  draw();
  const moving = state.playing && !still.matches;
  frame = visible && moving ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else { draw(); run(); } };

function steer() {
  touring = false; pendingTour = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourStep = 0; startRun(...TOUR[0]); run(); } }, 40000);
}
function choose(beta, fixed) {
  steer();
  if (still.matches) { state.beta = beta; state.fixed = fixed; state.t = H; state.playing = false; describe(); kick(); return; }
  startRun(beta, fixed);
  kick();
}
function setMonth(m) {
  steer();
  state.playing = false; state.hold = 0;
  state.t = clamp(m, 0, H);
  describe();
  kick();
}
function togglePlay() {
  steer();
  if (state.playing) state.playing = false;
  else if (still.matches) state.t = H;
  else { if (state.t >= H - 1e-6) state.t = 0; state.hold = 0; state.playing = true; }
  describe();
  kick();
}

// ------------------------------------------------ controls
radios.forEach((btn) => btn.addEventListener("click", () => choose(Number(btn.dataset.b), state.fixed)));
document.querySelector(".mp-seg").addEventListener("keydown", (event) => {
  const index = BETAS.indexOf(state.beta);
  let next = -1;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % BETAS.length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + BETAS.length - 1) % BETAS.length;
  if (next < 0) return;
  event.preventDefault();
  choose(BETAS[next], state.fixed);
  radios[next].focus();
});
fixedBtn.addEventListener("click", () => choose(state.beta, !state.fixed));
playBtn.addEventListener("click", togglePlay);

function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  press = { x0: toView(event)[0], start: state.t, dragging: false, id: event.pointerId };
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const dx = toView(event)[0] - press.x0;
  if (!press.dragging && Math.abs(dx) > 6) { press.dragging = true; try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setMonth(press.start + dx / 8);
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (!press.dragging && event.type === "pointerup") togglePlay();
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 6 : 1;
  let handled = true;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") setMonth(Math.floor(state.t + 1e-6) + step);
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") setMonth(Math.ceil(state.t - 1e-6) - step);
  else if (event.key === "Home") setMonth(0);
  else if (event.key === "End") setMonth(H);
  else if (event.key === " " || event.key === "Enter") togglePlay();
  else if (["1", "2", "3"].includes(event.key)) choose(BETAS[Number(event.key) - 1], state.fixed);
  else if (event.key === "v" || event.key === "f") choose(state.beta, !state.fixed);
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
if (!still.matches) { tourStep = 0; startRun(...TOUR[0]); state.hold = 0; state.t = 30; }
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run(); else { cancelAnimationFrame(frame); frame = 0; }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  if (still.matches) { touring = false; state.playing = false; state.t = H; cancelAnimationFrame(frame); frame = 0; describe(); tick(performance.now()); }
  else { touring = true; tourStep = 0; startRun(...TOUR[0]); run(); }
});
describe();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Weibull: storingspatroon",
    hint: "Kies β en vervanging",
    drag: "sleep: tijd · tik: pauze",
    fixed: "elke 6 mnd",
    play: "Afspelen",
    pause: "Pauze",
    group: "Weibull-vorm bèta",
    fixedLabel: "Vaste vervanging elke 6 maanden",
    label: LABEL_NL,
    aria: "Tijdlijn van maand 0 tot 48. Pijl links en rechts verschuift een maand (Shift: zes), Home en End gaan naar begin en eind, spatie speelt af of pauzeert, de toetsen 1 tot 3 kiezen bèta 0,7, 1 of 3, de toets V zet vaste vervanging aan of uit.",
  },
  en: {
    title: "Weibull: failure pattern",
    hint: "Pick β and replacement",
    drag: "drag: time · tap: pause",
    fixed: "every 6 mo",
    play: "Play",
    pause: "Pause",
    group: "Weibull shape beta",
    fixedLabel: "Fixed replacement every 6 months",
    label: LABEL_EN,
    aria: "Timeline from month 0 to 48. Left and right arrows move one month (Shift: six), Home and End go to the start and end, Space plays or pauses, keys 1 to 3 choose beta 0.7, 1 or 3, the V key turns fixed replacement on or off.",
  },
};

const ICONS = `<svg viewBox="0 0 14 14" aria-hidden="true" data-icon="play"><path d="M3.5 2.2v9.6l8-4.8z"/></svg><svg viewBox="0 0 14 14" aria-hidden="true" data-icon="pause"><path d="M3.2 2.4h2.6v9.2H3.2zM8.2 2.4h2.6v9.2H8.2z"/></svg>`;
const controls = `<div class="mp-controls"><button type="button" class="mp-btn mp-play" data-play="${STRINGS.nl.play}" data-pause="${STRINGS.nl.pause}" aria-label="${STRINGS.nl.play}">${ICONS}</button><div class="mp-seg" role="radiogroup" aria-label="${STRINGS.nl.group}">${BETAS.map((b) => `<button type="button" class="mp-btn" role="radio" data-b="${b}" aria-checked="${b === 0.7}" tabindex="${b === 0.7 ? 0 : -1}" data-label="${String(b)}"><small>β&#8202;</small>${String(b).replace(".", ",")}</button>`).join("")}</div><button type="button" class="mp-btn mp-fixed" aria-pressed="true" aria-label="${STRINGS.nl.fixedLabel}"><i aria-hidden="true"></i><span data-fixed>${STRINGS.nl.fixed}</span></button></div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="mp-stage" tabindex="0" role="slider" aria-label="${STRINGS.nl.aria}" aria-valuemin="0" aria-valuemax="${H}" aria-valuenow="${H}">${svg}</div>${controls}<div class="mp-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="mp-line"></span>'.repeat(4)}</span><span class="mp-model" data-model></span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-drag>${STRINGS.nl.drag}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-drag]").textContent=s.drag;
var p=document.querySelector(".mp-play");p.dataset.play=s.play;p.dataset.pause=s.pause;p.setAttribute("aria-label",s.play);
document.querySelector(".mp-seg").setAttribute("aria-label",s.group);
document.querySelectorAll(".mp-seg .mp-btn").forEach(function(b){b.lastChild.textContent=b.dataset.label;});
var f=document.querySelector(".mp-fixed");f.setAttribute("aria-label",s.fixedLabel);f.querySelector("[data-fixed]").textContent=s.fixed;
var st=document.querySelector(".mp-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: per year (seed ${SEED}) ` + BETAS.map((b) => `β${b} ${RATE[b].off} → ${RATE[b].on} (mean ${MEAN[b].off.toFixed(2)} → ${MEAN[b].on.toFixed(2)})`).join(" · ") + ` · y max ${YMAX}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

// pulse rings around the motor caps are wider than the motor by design
A.auditOrExit(R, P, { cover: ["pump.motor", "pump.casing"] });
