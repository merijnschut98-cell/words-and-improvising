// Dev tool, not shipped. Builds the standalone figure for the lesson
// "A control loop" (module Drawings and control, level 2).
//
//   node figures/eng.drawings.loop/build.mjs            build the page
//   node figures/eng.drawings.loop/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.drawings.loop.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark and ?lang=nl|en from its URL (defaults:
// prefers-color-scheme, Dutch).
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
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { tubePieces, tubeSvg } = await import(pathToFileURL(join(SKILL, "kit/tube.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.drawings.loop.html");

// ---------------------------------------------------------------- the model
// A level loop LT-101 → LIC-101 → LV-101 on a small buffer tank, in % of the
// transmitter span (0–100 %).
//   tank      dh/dt = QMAX · v − KOUT · o · h          a true first-order tank:
//             the outflow through the hand valve grows with the level, so
//             τ = 1 / (KOUT · o) and the steady level is h = QMAX · v / (KOUT · o).
//             Hand valve partly open o = 0.5: τ 40 s, h = 100 · v.
//             Hand valve wide open  o = 0.7: τ 29 s, h = 71 · v (the disturbance).
//   valve     the positioner and actuator follow the controller output with a
//             3 s lag: dv/dt = (u − v) / 3.
//   measure   the transmitter has 4 s damping, and the signal 3 s dead time.
//   Hand      u = SP / 100: the valve sits where it gave the setpoint with the
//             hand valve partly open. Nothing corrects a disturbance.
//   P         u = 50 % + Kc · e. It needs an error to move the valve away from
//             50 %, so it settles with a lasting offset e = (SP − K·50) / (1 + K·Kc).
//   PI        u = Kc · (e + ∫e dt / Ti), Ti 25 s, anti-windup: the integral keeps
//             moving the valve until e = 0.
//   supply    the inflow ripples by a few percent (slow sines), as real supplies do.
//   gain Kc   low 1.5, normal 3, high 18. The loop's ultimate gain with these
//             lags is about 9 (P) and 7 (PI), so high makes the level swing; the
//             valve then hits its stops and the swing stays (a limit cycle).
const QMAX = 2.5; // % of span per second at a fully open valve
const KOUT = 0.05;
const OPEN = { part: 0.5, wide: 0.7 };
const TAU_V = 3;
const TAU_M = 4;
const DEAD = 3;
const BIAS = 0.5;
const TI = 25;
const GAINS = { low: 1.5, normal: 3, high: 18 };
const SP_RANGE = [20, 80];
const START = { sp: 60, mode: "PI", gain: "normal", wide: false };
const TIME_SCALE = 12; // simulated seconds per real second

// ---------------------------------------------------------------- the world
// World units are centimetres, z up; the skid deck top is z = 0.
const WIDTH = 600;
const DECK = { x: -54, y: -61, w: 96, d: 103, r: 3 };
const DECK_Z = -4;
const TC = [-26, 22]; // tank centre
const TR = 20; // shell radius
const SHELL = [20, 88];
const FLANGE_R = 22.4;
const COVER_TOP = 92;
const LEG_R = 14;
const OUT_Z = 28; // outlet nozzle
const IN_Z = 64; // inlet nozzle
const PIPE_IN = 2.6;
const PIPE_OUT = 2.1;
const IN_X = TC[0];
const IN_RISER_Y = -48;
const OUT_DROP_X = 18;
// sight window on the shell, turned to face the viewer
const AZIMUTH = Number(process.env.AZ ?? 40);
const ELEVATION = Number(process.env.EL ?? 30);
const WIN_ANGLE = (AZIMUTH * Math.PI) / 180;
const WIN = { half: 4.6, glass: 1.9, z0: 23, z1: 85, g0: 26, g1: 82, front: TR + 1.6, deep: 0.9 };
// level transmitter on the cover
const LT = [TC[0] + 12 * Math.cos(0.35), TC[1] + 12 * Math.sin(0.35)];
// controller LIC-101 on its stand, face toward +x
const BOX = { x: 30, y: -78, w: 10, d: 70, r: 1.4 };
const BOX_Z = [24, 86];
const FACE_X = BOX.x + BOX.w;
const POST = [35, -43];
// controls on the face, in (u = −y, z)
const CTL = {
  sp: { u: 25, z: 42, r: 6.4, plate: 9.4, from: -135, span: 270 },
  mode: { u: 64, z: 59, r: 4.2, plate: 6.6, from: -45, span: 90 },
  gain: { u: 66, z: 33, r: 4.2, plate: 6.6, from: -45, span: 90 },
};
const KNOB_H = 3.4;
const DISPLAY = { u0: 15, u1: 47, z0: 69, z1: 80 };

const FIT = [
  ...k.boxCorners(DECK, DECK_Z - 6, 0),
  [IN_X, -27, IN_Z + 32],
  [LT[0], LT[1], COVER_TOP + 17],
  ...k.boxCorners(BOX, BOX_Z[0], BOX_Z[1] + 4),
];
const PAD = 10;
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);
const V = G.viewOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const pathOf3 = (points, closed = true) => k.pathOf(points.map(at), closed);
// A transform that maps flat (x right, y down) onto a vertical plane through o,
// with x along the world direction u: for text engraved on a face.
function planeMatrix(o, u) {
  const [ox, oy] = at(o);
  const [ux, uy] = at(G.add3(o, u));
  const [dx, dy] = at(G.add3(o, [0, 0, -1]));
  return `matrix(${(ux - ox).toFixed(4)} ${(uy - oy).toFixed(4)} ${(dx - ox).toFixed(4)} ${(dy - oy).toFixed(4)} ${ox.toFixed(2)} ${oy.toFixed(2)})`;
}

// ---------------------------------------------------------------- recorder
const STEM_TRAVEL = 5;
const R = A.recorder(P, { order: ["stem"], spring: {} });
let solids = 0;
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "", route, chunk } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece === "stem" ? [0, 0, STEM_TRAVEL] : [0, 0, 0], attrs, route, chunk });
}
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ...(ground ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, bias = 0, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], { bias, ...opts });
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", owner, bias = 0, ...opts } = {}) {
  const smooth = profile.some((point) => point[2]);
  const shape = R.solid(A.solid(F, profile, { name, owner, curve: smooth ? profile : undefined }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P, smooth ? { smooth: { rows: 3 } } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], { bias, ...opts });
}
function prismAt(name, F, poly, s0, s1, style = {}, { extra = "", inner = "", owner, bias = 0, ...opts } = {}) {
  const shape = R.solid(A.prism(F, poly, s0, s1, { name, owner }));
  const cu = poly.reduce((sum, p) => sum + p[0], 0) / poly.length;
  const cv = poly.reduce((sum, p) => sum + p[1], 0) / poly.length;
  const centre = G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  const svg = S(G.prismOf(F, poly, s0, s1, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, centre, svg, [shape], { bias, ...opts });
}
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];


// ---------------------------------------------------------------- pipes and cables (after the Raptor's helpers)
function tubeItems(route, r, { name, tone = "hi", bias = 0, maxLength = 16, spacing, owner, touch, limp = false, gaps = [], caps = true, rims, free } = {}) {
  const id = R.nameFor(name);
  R.route(id, route, r, { owner: owner ?? id, touch, limp, gaps, rims, free });
  tubePieces(route, r, P, { maxLength, spacing, gaps, caps }).forEach((part, index) =>
    put(`${id}:${index}`, part.mid, tubeSvg(part, { tone }), [A.tube(part.points, part.radii)], { bias, route: id, chunk: index }),
  );
  return id;
}
function flangeAt(name, centre, axis, r, thick, { bolts = 0, tone = "mid", owner } = {}) {
  const F = G.frameAlong(centre, axis);
  const towards = G.dot3(F.a, V) > 0 ? thick / 2 : -thick / 2;
  const extra = bolts && Math.abs(G.dot3(F.a, V)) > 0.12 ? Dt(G.dotsOf(F, towards, r * 0.74, bolts, P, { all: true }), { size: 0.36, tone: "mid" }) : "";
  return discAt(name, F, -thick / 2, thick / 2, r, { tone }, { extra, owner });
}
const routeOf = (control, r, bend = 2.8) => G.fillet(control, Math.max(r * bend, 3), 12, { P, tube: r });
// A flanged pipe along a filleted route; `fittings` are [at, half] spans covered by a valve body.
function pipe(name, line, r, { flangeR = 1.6, fittings = [], tone = "mid" } = {}) {
  const total = G.pathLength(line);
  const thick = Math.max(1, r * 0.5);
  const collars = [
    { centre: G.add3(line[0], G.mul3(G.tangentAlong(line, 0), thick / 2)), tangent: G.tangentAlong(line, 0), gap: [0, thick] },
    { centre: G.add3(line[line.length - 1], G.mul3(G.tangentAlong(line, total), -thick / 2)), tangent: G.tangentAlong(line, total), gap: [total - thick, total] },
  ];
  const gaps = [...collars.map((c) => c.gap), ...fittings.map(([a, half]) => [a - half, a + half])];
  const id = tubeItems(line, r, { name, tone, gaps, spacing: 1.2, rims: [r * flangeR, r * flangeR] });
  collars.forEach((c, index) => flangeAt(`${id}.flange${index}`, c.centre, c.tangent, r * flangeR, thick, { bolts: 6, owner: id }));
  return id;
}
const CABLE_R = 0.62;
function cable(name, points, { bend = 5 } = {}) {
  const route = G.fillet(points, bend, 12, { P, tube: CABLE_R });
  const id = tubeItems(route, CABLE_R, { name, tone: "mid", maxLength: 12, spacing: 1, limp: true, touch: ["stand.deck"] }); // it lies on the deck
  [route[0], route[route.length - 1]].forEach((end, index) => put(`${id}.end${index}`, end, Dt([at(end)], { size: 0.5, tone: "hi" }), [A.ball(end, 0.5 / KS)], { bias: 0.15 }));
  return route;
}
// A valve body on a straight leg: a bulged turned body with bolt rings on its end faces.
function valveBody(name, centre, axis, r, owner) {
  const F = G.frameAlong(centre, axis);
  const half = r * 2.4;
  const crown = r * 2.0;
  const neckR = r * 1.45;
  const bulge = (x) => neckR + (crown - neckR) * Math.sqrt(Math.max(0, 1 - (x / (r * 1.6)) ** 2));
  const bulgeSlope = (x) => {
    if (Math.abs(x) >= r * 1.6 - 1e-9) return 0;
    const t = Math.max(-0.995, Math.min(0.995, x / (r * 1.6)));
    return (-(crown - neckR) * t) / (r * 1.6 * Math.sqrt(1 - t * t));
  };
  const meridian = [
    [-half, 0],
    [-half, neckR],
    ...Array.from({ length: 17 }, (_, index) => {
      const x = r * 1.6 * Math.sin(((index - 8) / 8) * (Math.PI / 2));
      return [x, bulge(x), index && index < 16 ? 1 : 0];
    }),
    [half, neckR],
    [half, 0],
  ];
  const dots = [...G.dotsOf(F, -half, r * 1.18, 6, P, { all: true }), ...G.dotsOf(F, half, r * 1.18, 6, P, { all: true })];
  const shape = R.solid(A.body(F, meridian, { name, owner }));
  solids++;
  put(name, centre, k.solidSvg(G.lathe(meridian, F, P, { steps: 36, smooth: { slope: bulgeSlope, rows: 3 } }), { tone: "mid", crease: "lo" }) + Dt(dots, { size: 0.36, tone: "mid" }), [shape]);
  return { half, crown };
}

// ---------------------------------------------------------------- skid
const back = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(DECK, -3), DECK_Z - 8, 8, P)}"/>`];
for (const y of [DECK.y + 6, DECK.y + DECK.d - 14]) {
  const ch = { x: DECK.x + 4, y, w: DECK.w - 8, d: 8, r: 0.6 };
  box("stand.channel", ch, DECK_Z - 6, DECK_Z, { tone: "lo" }, { ground: true, inner: L(k.sideSeam(ch, DECK_Z - 1.5, P, 2), { tone: "faint" }) });
}
{
  const anchors = k.corners(DECK, 6);
  const extra =
    L(k.planOutline(k.insetPlan(DECK, 3.5), 0, P, 3), { tone: "faint" }) +
    L(anchors.map(([x, y]) => k.ring(x, y, 1.6, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.deck", DECK, DECK_Z, 0, { tone: "lo" }, { ground: true, steps: 3, bevel: 0.8, extra });
}

// skid nameplate near the front corner: rule lines stand for the print
{
  const np = { x: 22, y: 34.5, w: 15, d: 5.4, r: 0.6 };
  const top = 0.7;
  const rules = [[35.9, 9.6], [37.3, 6.4], [38.6, 8]].map(([y, len]) => k.lineOnTop([np.x + 2.2, y], [np.x + 2.2 + len, y], top, P)).join("");
  box("deck.plate", np, 0, top, { tone: "lo", crease: "none" }, {
    extra: L(k.planOutline(k.insetPlan(np, 1), top, P, 2), { tone: "faint" }) + L(rules, { tone: "lo", free: true }) + Dt([at([np.x + np.w - 1.9, np.y + 1.6, top]), at([np.x + np.w - 1.9, np.y + np.d - 1.6, top])], { size: 0.36 }),
  });
}

// ---------------------------------------------------------------- tank
for (let i = 0; i < 4; i++) {
  const a = Math.PI / 4 + (i * Math.PI) / 2;
  const [x, y] = [TC[0] + LEG_R * Math.cos(a), TC[1] + LEG_R * Math.sin(a)];
  box("tank.pad", { x: x - 3.4, y: y - 3.4, w: 6.8, d: 6.8, r: 0.8 }, 0, 1.2, { tone: "lo" }, { extra: Dt([at([x - 2.2, y - 2.2, 1.2]), at([x + 2.2, y + 2.2, 1.2])], { size: 0.38 }) });
  post("tank.leg", x, y, 2, 1.2, SHELL[0], { tone: "mid" }, { steps: 16, inner: L(k.sideArc(x, y, 2, 4, P, 10), { tone: "faint" }) });
}
{
  const seams = k.sideArc(TC[0], TC[1], TR, 43, P, 64) + k.sideArc(TC[0], TC[1], TR, 66, P, 64);
  post("tank.shell", TC[0], TC[1], TR, SHELL[0], SHELL[1], { tone: "hi", crease: "lo" }, { steps: 72, inner: L(seams, { tone: "faint" }), owner: "tank" });
  post("tank.flange", TC[0], TC[1], FLANGE_R, SHELL[1], SHELL[1] + 2.4, { tone: "mid" }, { steps: 72 });
  const bolts = Array.from({ length: 24 }, (_, i) => (i * Math.PI * 2) / 24).map((a) => at([TC[0] + 21 * Math.cos(a), TC[1] + 21 * Math.sin(a), COVER_TOP]));
  post("tank.cover", TC[0], TC[1], FLANGE_R, SHELL[1] + 2.4, COVER_TOP, { tone: "mid", crease: "lo" }, { steps: 72, bevel: 0.5, extra: L(k.ring(TC[0], TC[1], 19.4, COVER_TOP, P, 72), { tone: "faint" }) + Dt(bolts, { size: 0.36, tone: "mid" }) });
  const vent = [TC[0] - 9, TC[1] + 9];
  post("tank.vent", vent[0], vent[1], 1.8, COVER_TOP, COVER_TOP + 6, { tone: "mid" }, { steps: 16 });
  post("tank.ventcap", vent[0], vent[1], 3, COVER_TOP + 6, COVER_TOP + 7.4, { tone: "mid", crease: "lo" }, { steps: 20, bevel: 0.3 });
}

// sight window: a plate welded on the shell, a glass strip, the water behind it
const FW = G.frameOf([TC[0], TC[1], 0], [Math.cos(WIN_ANGLE), Math.sin(WIN_ANGLE), 0], [Math.sin(WIN_ANGLE), -Math.cos(WIN_ANGLE), 0], Z);
const wpt = (s, u, z) => G.add3(G.add3(G.add3(FW.o, G.mul3(FW.a, s)), G.mul3(FW.u, u)), [0, 0, z]);
const zOfLevel = (h) => WIN.g0 + ((WIN.g1 - WIN.g0) * Math.max(0, Math.min(100, h))) / 100;
const WATER = {
  bl: at(wpt(WIN.front - WIN.deep, -WIN.glass, WIN.g0)),
  br: at(wpt(WIN.front - WIN.deep, WIN.glass, WIN.g0)),
  up: [at([0, 0, 1])[0] - at([0, 0, 0])[0], at([0, 0, 1])[1] - at([0, 0, 0])[1]],
  span: WIN.g1 - WIN.g0,
};
function waterPath(W, h) {
  const dz = (W.span * Math.max(0, Math.min(100, h))) / 100;
  const [ux, uy] = W.up;
  const p = [W.bl, W.br, [W.br[0] + ux * dz, W.br[1] + uy * dz], [W.bl[0] + ux * dz, W.bl[1] + uy * dz]];
  return "M" + p.map(([x, y]) => x.toFixed(2) + " " + y.toFixed(2)).join("L") + "Z";
}
function meniscusPath(W, h) {
  const dz = (W.span * Math.max(0, Math.min(100, h))) / 100;
  const [ux, uy] = W.up;
  return "M" + (W.bl[0] + ux * dz).toFixed(2) + " " + (W.bl[1] + uy * dz).toFixed(2) + "L" + (W.br[0] + ux * dz).toFixed(2) + " " + (W.br[1] + uy * dz).toFixed(2);
}
{
  const f = WIN.front;
  const b = WIN.front - WIN.deep;
  const g = WIN.glass;
  const front = (u, z) => wpt(f, u, z);
  const backp = (u, z) => wpt(b, u, z);
  const glass = [backp(-g, WIN.g0), backp(g, WIN.g0), backp(g, WIN.g1), backp(-g, WIN.g1)];
  const walls =
    `<path class="iso-top" d="${pathOf3([front(-g, WIN.g1), front(g, WIN.g1), backp(g, WIN.g1), backp(-g, WIN.g1)])}"/>` +
    `<path class="iso-shade" data-shade="0" d="${pathOf3([front(-g, WIN.g0), front(-g, WIN.g1), backp(-g, WIN.g1), backp(-g, WIN.g0)])}"/>`;
  const ticks = { minor: [], major: [] };
  for (let i = 0; i <= 10; i++) {
    const z = zOfLevel(i * 10);
    (i % 5 === 0 ? ticks.major : ticks.minor).push(k.segment(front(g, z), front(g + (i % 5 === 0 ? 1.7 : 1.1), z), P));
  }
  const bolts = [];
  for (let z = WIN.z0 + 2.4; z <= WIN.z1 - 2; z += 9) bolts.push(at(front(-WIN.half + 1.1, z)), at(front(WIN.half - 1.1, z)));
  const extra =
    `<path class="lp-glass" d="${pathOf3(glass)}"/>` +
    `<path class="lp-water" data-water="" d="${waterPath(WATER, START.sp)}"/>` +
    `<path class="lp-meniscus" data-meniscus="" d="${meniscusPath(WATER, START.sp)}"/>` +
    walls +
    L(pathOf3([front(-g, WIN.g0), front(g, WIN.g0), front(g, WIN.g1), front(-g, WIN.g1)]), { tone: "lo" }) +
    L(ticks.minor.join(""), { tone: "lo" }) +
    L(ticks.major.join(""), { tone: "mid" }) +
    Dt(bolts, { size: 0.34, tone: "mid" });
  // plan outline: straight front, back on the shell's own circle, so the plate sits on the shell
  const alpha = Math.asin(WIN.half / TR);
  const ring = [wpt(f, WIN.half, 0), wpt(f, -WIN.half, 0)];
  for (let i = 0; i <= 8; i++) {
    const t = -alpha + (2 * alpha * i) / 8;
    ring.push(wpt(TR * Math.cos(t), -TR * Math.sin(t), 0));
  }
  const plan = ring.map(([x, y]) => [x, y]);
  const shape = R.solid(A.extruded(plan, WIN.z0, WIN.z1 - WIN.z0, { name: "tank.window", owner: "tank" }));
  solids++;
  put("tank.window", wpt((f + TR) / 2, 0, (WIN.z0 + WIN.z1) / 2), k.solidSvg(k.extrude(plan, WIN.z0, WIN.z1 - WIN.z0, P), { tone: "mid" }) + extra, [shape], { bias: 0.4 });
}

// nozzles on the shell: a short boss whose rim sits on the shell
function nozzle(name, z, dir, a, length) {
  const F = G.frameAlong([TC[0], TC[1], z], dir);
  discAt(name, F, Math.sqrt(TR * TR - a * a), TR + length, a, { tone: "mid" }, { owner: "tank" });
  return G.add3([TC[0], TC[1], z], G.mul3(dir, TR + length));
}
const IN_PORT = nozzle("tank.inlet", IN_Z, [0, -1, 0], PIPE_IN * 1.7, 3.4);
const OUT_PORT = nozzle("tank.outlet", OUT_Z, [1, 0, 0], PIPE_OUT * 1.7, 3.4);

// ---------------------------------------------------------------- inlet with the control valve LV-101
const VALVE = [IN_X, -27, IN_Z];
const inLine = routeOf([[IN_X, IN_RISER_Y, 0], [IN_X, IN_RISER_Y, IN_Z], IN_PORT], PIPE_IN);
const inValveAt = G.pathLength(inLine) - (IN_PORT[1] - VALVE[1]);
const LV = valveBody("lv.body", VALVE, Y, PIPE_IN, "inlet");
pipe("inlet", inLine, PIPE_IN, { fittings: [[inValveAt, LV.half]] });
// bonnet, yoke, stem and diaphragm actuator, standing up from the body
const VZ = VALVE[2];
const BON = VZ + 9;
const YOKE_TOP = BON + 12;
const PERP = [-Math.sin(WIN_ANGLE), Math.cos(WIN_ANGLE), 0];
const VIEW_H = [Math.cos(WIN_ANGLE), Math.sin(WIN_ANGLE), 0];
const LEG_A = G.add3(VALVE, G.mul3(PERP, 3.4));
const LEG_B = G.add3(VALVE, G.mul3(PERP, -3.4));
{
  const FV = G.frameOf(VALVE, Z, X, Y);
  discAt("lv.neck", FV, LV.crown - 0.3, BON - VZ - 2.2, 1.5, { tone: "mid" }, { owner: "lv" });
  discAt("lv.bonnet", FV, BON - VZ - 2.2, BON - VZ, 3.4, { tone: "mid", crease: "lo" }, { owner: "lv", extra: Dt(G.dotsOf(FV, BON - VZ, 2.6, 4, P, { all: true, phase: Math.PI / 4 }), { size: 0.34 }) });
  post("lv.yokeA", LEG_A[0], LEG_A[1], 0.8, BON, YOKE_TOP, { tone: "mid" }, { steps: 12, owner: "lv" });
  post("lv.yokeB", LEG_B[0], LEG_B[1], 0.8, BON, YOKE_TOP, { tone: "mid" }, { steps: 12, owner: "lv" });
  post("lv.stem", VALVE[0], VALVE[1], 0.5, BON, YOKE_TOP, { tone: "hi", crease: "none" }, { steps: 12, owner: "lv" });
  post("lv.yokeplate", VALVE[0], VALVE[1], 4.8, YOKE_TOP, YOKE_TOP + 1.4, { tone: "mid" }, { steps: 32, owner: "lv" });
  const FA = G.frameOf([VALVE[0], VALVE[1], YOKE_TOP + 1.4], Z, X, Y);
  const drum = [[0, 4.8], [2, 9.4], [2.6, 9.8], [3.6, 9.8], [4.2, 9.4], [6.4, 5.4], [6.4, 2.2], [7.6, 2.2], [7.6, 0]];
  const rimBolts = Dt(G.dotsOf(FA, 3.6, 9.2, 16, P, { all: true }), { size: 0.34, tone: "mid" });
  turned("lv.actuator", FA, drum, { tone: "mid", crease: "lo" }, { owner: "lv", extra: rimBolts, inner: L(G.arcOf(FA, 3.1, 9.8, P), { tone: "faint" }) });
  // travel scale on the front of yoke leg A, read by the tab on the stem connector
  const FS = G.frameOf([LEG_A[0], LEG_A[1], 0], VIEW_H, PERP, Z);
  const scaleZ = [BON + 1.2, BON + 1.2 + STEM_TRAVEL + 2.2];
  const ticks = [];
  for (let i = 0; i <= 4; i++) {
    const z = BON + 2.2 + (i * STEM_TRAVEL) / 4 + 0.4;
    ticks.push(k.segment(G.add3(G.add3(FS.o, G.mul3(FS.a, 1.2)), [PERP[0] * 2.2, PERP[1] * 2.2, z]), G.add3(G.add3(FS.o, G.mul3(FS.a, 1.2)), [PERP[0] * (i % 2 ? 1.4 : 1.0), PERP[1] * (i % 2 ? 1.4 : 1.0), z]), P));
  }
  prismAt("lv.scale", FS, rect(-0.4, 2.2, scaleZ[0], scaleZ[1]), 0.8, 1.2, { tone: "lo", crease: "none" }, { owner: "lv", extra: L(ticks.join(""), { tone: "mid" }) });
}
// the stem connector and its tab ride the stem (built closed, moved up by the valve position)
const CONN_Z = BON + 2.2;
{
  const FC = G.frameOf([VALVE[0], VALVE[1], 0], VIEW_H, PERP, Z);
  prismAt("lv.connector", FC, rect(-1.5, 1.5, CONN_Z - 0.2, CONN_Z + 1.4), 0.5, 1.9, { tone: "hi", crease: "lo" }, { piece: "stem", owner: "lv.stem", attrs: ' data-stem=""', extra: Dt([at(G.add3([VALVE[0], VALVE[1], CONN_Z + 0.6], G.mul3(VIEW_H, 1.9)))], { size: 0.34 }) });
  prismAt("lv.tab", FC, rect(1.5, 3.9, CONN_Z + 0.2, CONN_Z + 0.8), 1.4, 1.8, { tone: "hi", crease: "none" }, { piece: "stem", owner: "lv.stem", attrs: ' data-stem=""' });
}
// positioner on yoke leg B with its gauge, cable gland and tag plate
const POS = { x: LEG_B[0] + 0.8, y: LEG_B[1] - 3.7, w: 5.6, d: 7.4, r: 0.6 };
const POS_Z = [BON + 0.6, BON + 8.6];
const POS_GLAND = [POS.x + POS.w / 2 + 0.6, POS.y + POS.d / 2, POS_Z[0]]; // on the underside
{
  const Xf = POS.x + POS.w;
  box("lv.positioner", POS, POS_Z[0], POS_Z[1], { tone: "mid" }, { owner: "lv", bevel: 0.3, inner: L(k.sideSeam(POS, POS_Z[1] - 1.6, P, 2), { tone: "faint" }) });
  const Fg = G.frameOf([Xf, POS.y + 2, POS_Z[0] + 5.2], X, [0, -1, 0], Z);
  discAt("lv.gauge", Fg, 0, 0.8, 1.35, { tone: "hi", crease: "lo" }, { owner: "lv", extra: L(G.circleOf(Fg, 0.8, 0.9, P, 16), { tone: "faint" }) + Dt([at(G.pointOf(Fg, 0.8, 0, 0))], { size: 0.32, tone: "hi" }) });
  post("lv.gland", POS_GLAND[0], POS_GLAND[1], 1.0, POS_GLAND[2] - 2, POS_GLAND[2], { tone: "mid" }, { steps: 14, owner: "lv" });
  const tag = { x: Xf, y: POS.y + 0.5, w: 0.35, d: POS.d - 1.0, r: 0.15 };
  const tz = [POS_Z[0] + 0.7, POS_Z[0] + 2.9];
  box("lv.tag", tag, tz[0], tz[1], { tone: "lo", crease: "none" }, { owner: "lv", extra: k.faceTextSvg(planeMatrix([Xf + 0.35, tag.y + tag.d - 0.3, tz[0] + 0.55], [0, -1, 0]), "LV-101", { size: 1.3, tone: "hi" }) });
}

// ---------------------------------------------------------------- outlet with the hand valve
const HV = [OUT_PORT[0] + 7.6, TC[1], OUT_Z];
const outLine = routeOf([OUT_PORT, [OUT_DROP_X, TC[1], OUT_Z], [OUT_DROP_X, TC[1], 0]], PIPE_OUT);
const HVB = valveBody("hv.body", HV, X, PIPE_OUT, "outlet");
pipe("outlet", outLine, PIPE_OUT, { fittings: [[HV[0] - OUT_PORT[0], HVB.half]] });
const HV_NECK = HV[2] + HVB.crown + 2.6;
const LEVER = { z: HV_NECK + 0.6, h: 0.9, len: 12.5, w: 1.7 };
const LEVER_ANGLE = { part: 138, wide: 90 }; // degrees from +y toward +x; 90 lies along the pipe (open)
function leverRing(deg) {
  const a = (deg * Math.PI) / 180;
  const d = [Math.sin(a), Math.cos(a)];
  const n = [d[1], -d[0]];
  const w = LEVER.w / 2;
  const ring = [];
  for (let i = 0; i <= 8; i++) {
    const t = Math.PI / 2 + (i / 8) * Math.PI;
    ring.push([HV[0] + Math.cos(t) * d[0] * 1.9 - Math.sin(t) * n[0] * 1.9 * -1, HV[1] + Math.cos(t) * d[1] * 1.9 - Math.sin(t) * n[1] * 1.9 * -1]);
  }
  ring.push([HV[0] + d[0] * LEVER.len + n[0] * w, HV[1] + d[1] * LEVER.len + n[1] * w]);
  ring.push([HV[0] + d[0] * LEVER.len - n[0] * w, HV[1] + d[1] * LEVER.len - n[1] * w]);
  return ring;
}
{
  const FH = G.frameOf(HV, Z, X, Y);
  discAt("hv.neck", FH, HVB.crown - 0.3, HV_NECK - HV[2], 1.2, { tone: "mid" }, { owner: "hv" });
  discAt("hv.nut", FH, HV_NECK - HV[2], LEVER.z - HV[2], 1.6, { tone: "mid", crease: "lo" }, { owner: "hv" });
  const ring = leverRing(LEVER_ANGLE[START.wide ? "wide" : "part"]);
  const shape = R.solid(A.extruded(ring, LEVER.z, LEVER.h, { name: "hv.lever", owner: "hv" }));
  solids++;
  put("hv.lever", [HV[0], HV[1], LEVER.z], `<g data-lever="">${k.solidSvg(k.extrude(ring, LEVER.z, LEVER.h, P), { tone: "hi", crease: "lo" })}</g>` + Dt([at([HV[0], HV[1], LEVER.z + LEVER.h])], { size: 0.45, tone: "mid" }), [shape], { bias: 0.3 });
}

// ---------------------------------------------------------------- level transmitter LT-101 (radar) on the cover
const LT_GLAND_Z = COVER_TOP + 12;
const LT_DIR = [Math.cos(0.35), Math.sin(0.35), 0];
const LT_GLAND = G.add3([LT[0], LT[1], LT_GLAND_Z], G.mul3(LT_DIR, 6.6));
{
  const F = G.frameOf([LT[0], LT[1], COVER_TOP], Z, X, Y);
  discAt("lt.flange", F, 0, 1.8, 4.6, { tone: "mid" }, { extra: Dt(G.dotsOf(F, 1.8, 3.6, 6, P, { all: true }), { size: 0.34 }) });
  discAt("lt.neck", F, 1.8, 7, 2.2, { tone: "mid" });
  const head = [[7, 4.6], [14.2, 4.6], [14.2, 4.0], [15.6, 3.6], [16.4, 2.6], [16.8, 0]];
  turned("lt.housing", F, head, { tone: "hi", crease: "lo" }, { inner: L(k.sideArc(LT[0], LT[1], 4.6, COVER_TOP + 12.6, P, 24), { tone: "faint" }) });
  const Fg = G.frameAlong([LT[0], LT[1], LT_GLAND_Z], LT_DIR);
  discAt("lt.gland", Fg, Math.sqrt(4.6 * 4.6 - 1.1 * 1.1), 6.6, 1.1, { tone: "mid" });
  // tag plate wired round the neck, facing the viewer
  const FT2 = G.frameOf([LT[0], LT[1], 0], VIEW_H, PERP, Z);
  const tz = [COVER_TOP + 2.4, COVER_TOP + 5.6];
  prismAt("lt.tag", FT2, rect(-3.6, 3.6, tz[0], tz[1]), 2.2, 2.55, { tone: "lo", crease: "none" }, {
    extra: k.faceTextSvg(planeMatrix(G.add3(G.add3([LT[0], LT[1], tz[0] + 0.75], G.mul3(VIEW_H, 2.55)), G.mul3(PERP, 3.0)), G.mul3(PERP, -1)), "LT-101", { size: 1.55, tone: "hi" }),
  });
}

// ---------------------------------------------------------------- controller LIC-101 on its stand
const FF = G.frameOf([FACE_X, 0, 0], X, [0, -1, 0], Z); // face frame: u = −y (screen right), v = z
const facePt = (s, u, z) => [FACE_X + s, -u, z];
const BOX_GLANDS = [[33.5, POS_GLAND[1]], [36.5, BOX.y + BOX.d - 6]]; // on the underside: LV-101, LT-101
const HOOD_TOP = BOX_Z[1] + 2.2;
{
  post("lic.base", POST[0], POST[1], 5.4, 0, 1.2, { tone: "lo" }, { steps: 28, extra: Dt([0, 1, 2, 3].map((i) => at([POST[0] + 4 * Math.cos(Math.PI / 4 + (i * Math.PI) / 2), POST[1] + 4 * Math.sin(Math.PI / 4 + (i * Math.PI) / 2), 1.2])), { size: 0.36 }) });
  post("lic.post", POST[0], POST[1], 2.2, 1.2, BOX_Z[0] - 3, { tone: "mid" }, { steps: 20 });
  box("lic.bracket", { x: POST[0] - 4, y: POST[1] - 4, w: 8, d: 8, r: 0.8 }, BOX_Z[0] - 3, BOX_Z[0], { tone: "mid", crease: "lo" }, { bevel: 0.3 });
  const du = [-(BOX.y + BOX.d) + 2.2, -BOX.y - 2.2];
  const door = [facePt(0, du[0], BOX_Z[0] + 2.2), facePt(0, du[1], BOX_Z[0] + 2.2), facePt(0, du[1], BOX_Z[1] - 2.2), facePt(0, du[0], BOX_Z[1] - 2.2)];
  box("lic.box", BOX, BOX_Z[0], BOX_Z[1], { tone: "mid" }, { bevel: 0.5, inner: L(k.sideSeam(BOX, BOX_Z[1] - 1.2, P, 2), { tone: "faint" }) + L(pathOf3(door), { tone: "faint" }) });
  box("lic.hood", k.insetPlan(BOX, -1.4), BOX_Z[1], HOOD_TOP, { tone: "mid", crease: "lo" }, { bevel: 0.4 });
  BOX_GLANDS.forEach(([x, y], index) => post(`lic.gland${index}`, x, y, 1.1, BOX_Z[0] - 2.4, BOX_Z[0], { tone: "mid" }, { steps: 14 }));
  // door lock
  discAt("lic.lock", G.frameOf(facePt(0, 75, 60), X, [0, -1, 0], Z), 0, 0.9, 1.1, { tone: "mid" }, { extra: Dt([at(facePt(0.9, 75, 60))], { size: 0.32, tone: "hi" }) });
  // display: a bezel with an LCD showing SP and PV
  const { u0, u1, z0, z1 } = DISPLAY;
  const lcd = [facePt(0.7, u0 + 1.3, z0 + 1.2), facePt(0.7, u1 - 1.3, z0 + 1.2), facePt(0.7, u1 - 1.3, z1 - 1.2), facePt(0.7, u0 + 1.3, z1 - 1.2)];
  const text = (line, z) => `<text class="lp-lcd" data-disp="${line}" transform="${planeMatrix(facePt(0.7, u0 + 2.6, z), [0, -1, 0])}" font-size="3.4">${line === "sp" ? "SP" : "PV"}</text>`;
  const extra = `<path class="lp-lcdbg" d="${pathOf3(lcd)}"/>` + L(pathOf3(lcd), { tone: "lo" }) + text("sp", z1 - 5.2) + text("pv", z0 + 1.9) + Dt([at(facePt(0.7, u1 - 0.7, z0 + 0.7)), at(facePt(0.7, u0 + 0.7, z1 - 0.7))], { size: 0.3 });
  prismAt("lic.display", FF, rect(u0, u1, z0, z1), 0, 0.7, { tone: "mid", crease: "lo" }, { extra });
  // tag plate LIC-101
  prismAt("lic.tag", FF, rect(60, 70, 73, 76.4), 0, 0.4, { tone: "lo", crease: "none" }, { extra: k.faceTextSvg(planeMatrix(facePt(0.4, 60.7, 73.8), [0, -1, 0]), "LIC-101", { size: 1.6, tone: "hi" }) });
}
// knobs: a dial plate with position ticks, a knurled knob and its pointer
const KNOB_F = {};
function knobPointer(name, deg) {
  const c = CTL[name];
  const t = (deg * Math.PI) / 180;
  const front = 0.6 + KNOB_H;
  const tip = facePt(front, c.u + Math.sin(t) * (c.r - 0.5), c.z + Math.cos(t) * (c.r - 0.5));
  const tail = facePt(front, c.u, c.z);
  return k.pathOf([at(tail), at(tip)], false);
}
for (const [name, c] of Object.entries(CTL)) {
  const F = G.frameOf(facePt(0, c.u, c.z), X, [0, Math.cos(0), 0], Z);
  KNOB_F[name] = F;
  const marks = name === "sp" ? Array.from({ length: 13 }, (_, i) => i) : [0, 1, 2];
  const n = marks.length - 1;
  const ticks = { minor: [], major: [] };
  for (const i of marks) {
    const deg = c.from + (c.span * i) / n;
    const t = (deg * Math.PI) / 180;
    const major = name !== "sp" || i % 6 === 0;
    const r0 = major ? c.r - 0.3 : c.plate - 1.2; // a major tick runs in under the knob
    (major ? ticks.major : ticks.minor).push(k.pathOf([at(facePt(0.6, c.u + Math.sin(t) * r0, c.z + Math.cos(t) * r0)), at(facePt(0.6, c.u + Math.sin(t) * c.plate, c.z + Math.cos(t) * c.plate))], false));
  }
  const Fk = G.frameOf(facePt(0, c.u, c.z), X, [0, -1, 0], Z);
  discAt(`lic.${name}.plate`, Fk, 0, 0.6, c.plate, { tone: "lo" }, { extra: L(ticks.minor.join(""), { tone: "lo" }) + L(ticks.major.join(""), { tone: "mid" }) });
  const ribs = G.ribsOf(Fk, 0.6, 0.6 + KNOB_H, c.r, name === "sp" ? 28 : 20, P, { fade: [0.1, 0.55], seams: false });
  const pointer = `<path class="iso-line" data-tone="hi" data-knob="${name}" data-free="end" style="stroke-width:1.1" d="${knobPointer(name, angleOf(name, START))}"/>`;
  discAt(`lic.${name}.knob`, Fk, 0.6, 0.6 + KNOB_H, c.r, { tone: "mid", crease: "lo" }, { extra: k.fadedSvg(ribs, { tone: "lo" }) + pointer + Dt([at(facePt(0.6 + KNOB_H, c.u, c.z))], { size: 0.5, tone: "hi" }) });
}
function angleOf(name, state) {
  const c = CTL[name];
  if (name === "sp") return c.from + (c.span * (state.sp - SP_RANGE[0])) / (SP_RANGE[1] - SP_RANGE[0]);
  if (name === "mode") return c.from + (c.span * ["H", "P", "PI"].indexOf(state.mode)) / 2;
  return c.from + (c.span * ["low", "normal", "high"].indexOf(state.gain)) / 2;
}

// ---------------------------------------------------------------- signal cables
const LT_DROP = G.add3([TC[0], TC[1], LT_GLAND_Z], G.mul3(LT_DIR, FLANGE_R + 3.2));
const LT_RUN_Y = LT_DROP[1];
const ON_DECK = CABLE_R; // cables lie on the deck
const LT_ROUTE = cable("cable.lt", [LT_GLAND, LT_DROP, [LT_DROP[0], LT_RUN_Y, ON_DECK], [BOX_GLANDS[1][0], LT_RUN_Y, ON_DECK], [BOX_GLANDS[1][0], BOX_GLANDS[1][1], ON_DECK], [BOX_GLANDS[1][0], BOX_GLANDS[1][1], BOX_Z[0] - 2.4]], { bend: 6 });
const LV_START = G.add3(POS_GLAND, [0, 0, -2]);
const LV_ROUTE = cable("cable.lv", [LV_START, [LV_START[0], LV_START[1], ON_DECK], [BOX_GLANDS[0][0], LV_START[1], ON_DECK], [BOX_GLANDS[0][0], BOX_GLANDS[0][1], BOX_Z[0] - 2.4]], { bend: 6 });

// ---------------------------------------------------------------- the model as code (shared by the page and the build check)
const MODEL = { QMAX, KOUT, OPEN, TAU_V, TAU_M, DEAD, BIAS, TI, GAINS, SUB: 0.05 };
function makeState(M, cfg, h) {
  const v = Math.min(1, Math.max(0, (M.KOUT * cfg.open * h) / M.QMAX));
  const s = { h, pvm: h, v, u: v, I: v, t: 0, buf: new Array(Math.round(M.DEAD / M.SUB)).fill(h), bi: 0 };
  s.I = v - M.GAINS[cfg.gain] * ((cfg.sp - h) / 100);
  return s;
}
function stepModel(M, s, cfg, dt) {
  const old = s.buf[s.bi];
  s.buf[s.bi] = s.h;
  s.bi = (s.bi + 1) % s.buf.length;
  s.pvm += (old - s.pvm) * (1 - Math.exp(-dt / M.TAU_M));
  const e = (cfg.sp - s.pvm) / 100;
  const kc = M.GAINS[cfg.gain];
  let u;
  if (cfg.mode === "H") u = cfg.sp / 100;
  else if (cfg.mode === "P") u = M.BIAS + kc * e;
  else {
    u = s.I + kc * e;
    const lim = Math.min(1, Math.max(0, u));
    if (lim === u || (u > 1 && e < 0) || (u < 0 && e > 0)) s.I += (kc * e * dt) / M.TI;
    u = lim;
  }
  s.u = Math.min(1, Math.max(0, u));
  s.v += (s.u - s.v) * (1 - Math.exp(-dt / M.TAU_V));
  // the supply is never perfectly steady: a slow ripple of a few percent in the inflow
  s.t += dt;
  const ripple = 1 + 0.03 * Math.sin(0.3 * s.t) + 0.02 * Math.sin(1.1 * s.t + 1);
  s.h = Math.min(100, Math.max(0, s.h + (M.QMAX * s.v * ripple - M.KOUT * cfg.open * s.h) * dt));
}
// Where a setting leads: run the loop 700 s from a level 8 % under the setpoint
// and read the last 200 s.
function forecast(M, cfg) {
  const s = makeState(M, cfg, Math.max(0, cfg.sp - 8));
  let lo = Infinity, hi = -Infinity, sum = 0, n = 0;
  for (let t = 0; t < 700; t += M.SUB) {
    stepModel(M, s, cfg, M.SUB);
    if (t > 500) { lo = Math.min(lo, s.pvm); hi = Math.max(hi, s.pvm); sum += s.pvm; n++; }
  }
  const mean = sum / n;
  const verdict = hi - lo > 1.5 ? "swing" : Math.abs(cfg.sp - mean) > 0.6 ? "offset" : "stable";
  return { verdict, mean, p2p: hi - lo, state: s };
}
// build check: the lesson's three claims hold in this model
{
  const c = (mode, gain, wide, sp = 60) => forecast(MODEL, { mode, gain, sp, open: wide ? OPEN.wide : OPEN.part }).verdict;
  const want = [
    [c("H", "normal", false), "stable"], [c("H", "normal", true), "offset"],
    [c("P", "normal", false), "offset"], [c("P", "normal", true), "offset"],
    [c("PI", "normal", false), "stable"], [c("PI", "normal", true), "stable"], [c("PI", "low", true), "stable"],
    [c("PI", "high", false), "swing"], [c("P", "high", false), "swing"],
  ];
  want.forEach(([got, expect], i) => { if (got !== expect) throw new Error(`model check ${i}: ${got} ≠ ${expect}`); });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: A.uniformStates(6) });
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...back, ...groups];

const HIT_POINTS = {
  sp: facePt(0.6 + KNOB_H, CTL.sp.u, CTL.sp.z),
  mode: facePt(0.6 + KNOB_H, CTL.mode.u, CTL.mode.z),
  gain: facePt(0.6 + KNOB_H, CTL.gain.u, CTL.gain.z),
};
const leverMid = (deg) => {
  const a = (deg * Math.PI) / 180;
  return [HV[0] + Math.sin(a) * 7, HV[1] + Math.cos(a) * 7, LEVER.z + LEVER.h];
};

const LABEL_NL =
  "Een kleine procesopstelling op een skid: een staande buffertank op vier poten met een kijkglas waarin het water staat, een radar-niveaumeter LT-101 op het deksel, een toevoerleiding met regelklep LV-101 (membraanaandrijving, klepsteel met slagschaal en een positioner), een afvoer met een handkraan, en een regelaar LIC-101 op een paal met een display voor setpoint en procesWaarde, een setpointknop, een standenschakelaar Hand, P of PI en een versterkingsschakelaar. Kabels lopen van de meter naar de regelaar en van de regelaar naar de klep.";
const LABEL_EN =
  "A small process skid: an upright buffer tank on four legs with a sight glass showing the water, a radar level transmitter LT-101 on the cover, an inlet line with control valve LV-101 (diaphragm actuator, stem with travel scale and a positioner), an outlet with a hand valve, and a controller LIC-101 on a post with a display for setpoint and process value, a setpoint knob, a mode switch Hand, P or PI and a gain switch. Cables run from the transmitter to the controller and from the controller to the valve.";

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
  --lp-hair:rgba(240,233,218,.12);--lp-accent:#5C9FAE;--lp-water:rgba(92,159,174,.55);--lp-glass:#081A1E;--lp-lcd:#081A1E;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --lp-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --lp-hair:rgba(11,41,27,.14);--lp-accent:#276F81;--lp-water:rgba(39,111,129,.42);--lp-glass:#E4DCC9;--lp-lcd:#DDD4BF;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--lp-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 112px);min-height:200px;padding:26px 4px 86px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--lp-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 12px 14px}
.iso-plate-corner{font-family:var(--lp-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:0!important;color:var(--anatomy-muted);letter-spacing:0!important;max-width:42%}
.iso-plate-corner[data-corner="readout"]{bottom:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.4;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.lp-line{display:block;white-space:nowrap}
.lp-acc{color:var(--lp-accent);font-weight:600}
.lp-mute{color:var(--anatomy-muted)}
.lp-stage{position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.lp-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.lp-hit{position:absolute;width:48px;height:48px;margin:-24px 0 0 -24px;left:0;top:0;border-radius:50%;outline:none;pointer-events:none}
.lp-hit:focus-visible{box-shadow:0 0 0 1px var(--anatomy-muted)}
.lp-glass{fill:var(--lp-glass);stroke:none}
.lp-water{fill:var(--lp-water);stroke:none}
.lp-meniscus{fill:none;stroke:var(--anatomy-lit);stroke-width:1.1;stroke-linecap:butt}
.lp-lcdbg{fill:var(--lp-lcd);stroke:none}
.lp-lcd{font-family:var(--anatomy-mono);fill:var(--anatomy-hi);font-weight:600}
.lp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const M = ${JSON.stringify(MODEL)};
const OPEN = ${JSON.stringify(OPEN)}, SP_RANGE = ${JSON.stringify(SP_RANGE)}, START = ${JSON.stringify(START)}, TS = ${TIME_SCALE};
const WATER = ${JSON.stringify(WATER)};
const CTL = ${JSON.stringify(CTL)}, KNOB_H = ${KNOB_H}, FACE_X = ${FACE_X};
const HV = ${JSON.stringify(HV)}, LEVER = ${JSON.stringify(LEVER)}, LEVER_ANGLE = ${JSON.stringify(LEVER_ANGLE)};
const STEM_TRAVEL = ${STEM_TRAVEL};
const HIT_POINTS = ${JSON.stringify(HIT_POINTS)};
const at = (point) => iso(point, P);
const facePt = (s, u, z) => [FACE_X + s, -u, z];
${waterPath.toString()}
${meniscusPath.toString()}
${angleOf.toString()}
${knobPointer.toString().replace(/k\.pathOf/g, "pathOf")}
${leverRing.toString()}
const leverMid = ${leverMid.toString()};
${makeState.toString()}
${stepModel.toString()}
${forecast.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { valve: "valve", drain: "outlet", part: "partly open", wide: "wide open", modes: { H: "Hand", P: "P", PI: "PI" }, gains: { low: "low", normal: "normal", high: "high" }, verdict: { stable: "stable", offset: "lasting offset", swing: "oscillates" }, dec: ".", gain: "gain", mode: "mode", now: "Now", sp: "Setpoint", lever: "Hand valve" }
  : { valve: "klep", drain: "afvoer", part: "half open", wide: "ver open", modes: { H: "Hand", P: "P", PI: "PI" }, gains: { low: "laag", normal: "normaal", high: "hoog" }, verdict: { stable: "stabiel", offset: "blijvende afwijking", swing: "slingert" }, dec: ",", gain: "versterking", mode: "stand", now: "Nu", sp: "Setpoint", lever: "Handkraan" };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);

const stage = document.querySelector(".lp-stage");
const svg = stage.querySelector("svg");
const waterEl = svg.querySelector("[data-water]");
const menEl = svg.querySelector("[data-meniscus]");
const stems = [...svg.querySelectorAll("[data-stem]")];
const leverEl = svg.querySelector("[data-lever]");
const knobEls = { sp: svg.querySelector('[data-knob="sp"]'), mode: svg.querySelector('[data-knob="mode"]'), gain: svg.querySelector('[data-knob="gain"]') };
const disp = { sp: svg.querySelector('[data-disp="sp"]'), pv: svg.querySelector('[data-disp="pv"]') };
const lines = [...document.querySelectorAll("[data-readout] .lp-line")];
const hits = Object.fromEntries([...document.querySelectorAll(".lp-hit")].map((el) => [el.dataset.hit, el]));
const announcer = document.querySelector(".lp-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const MODES = ["H", "P", "PI"], GAINS = ["low", "normal", "high"];

// ------------------------------------------------ state
const set = { sp: START.sp, mode: START.mode, gain: START.gain, wide: START.wide };
const ease = { sp: START.sp, mode: angleOf("mode", START), gain: angleOf("gain", START), lever: LEVER_ANGLE[START.wide ? "wide" : "part"], open: START.wide ? OPEN.wide : OPEN.part };
const cfgNow = () => ({ sp: set.sp, mode: set.mode, gain: set.gain, open: ease.open });
const cfgTarget = () => ({ sp: set.sp, mode: set.mode, gain: set.gain, open: set.wide ? OPEN.wide : OPEN.part });
let sim = forecast(M, cfgTarget()).state;
let verdict = forecast(M, cfgTarget()).verdict;
function refresh() { verdict = forecast(M, cfgTarget()).verdict; if (still.matches) { ease.open = cfgTarget().open; sim = forecast(M, cfgTarget()).state; } }

// ------------------------------------------------ drawing
let lastLever = null;
function draw() {
  waterEl.setAttribute("d", waterPath(WATER, sim.h));
  menEl.setAttribute("d", meniscusPath(WATER, sim.h));
  const lift = translateAlong(P, [0, 0, STEM_TRAVEL * sim.v]);
  stems.forEach((el) => el.setAttribute("transform", lift));
  knobEls.sp.setAttribute("d", knobPointer("sp", angleOf("sp", { sp: ease.sp })));
  knobEls.mode.setAttribute("d", knobPointer("mode", ease.mode));
  knobEls.gain.setAttribute("d", knobPointer("gain", ease.gain));
  const lk = ease.lever.toFixed(2);
  if (lk !== lastLever) { lastLever = lk; leverEl.innerHTML = solidSvg(extrude(leverRing(ease.lever), LEVER.z, LEVER.h, P), { tone: "hi", crease: "lo" }); }
  const spT = "SP " + fmt(set.sp, 1), pvT = "PV " + fmt(sim.pvm, 1);
  if (disp.sp.textContent !== spT) disp.sp.textContent = spT;
  if (disp.pv.textContent !== pvT) disp.pv.textContent = pvT;
  const l1 = "SP " + fmt(set.sp, 1) + " % · PV " + fmt(sim.pvm, 1) + " %";
  const l2 = T.valve + " " + Math.round(sim.v * 100) + " % · " + T.modes[set.mode] + " · " + T.gains[set.gain];
  const l3 = T.drain + " " + (set.wide ? T.wide : T.part);
  const l4 = '→ <span class="lp-acc">' + T.verdict[verdict] + "</span>";
  [l1, l2, l3, l4].forEach((html, i) => { if (lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  placeHits();
}
function screenOf(name) {
  if (name === "lever") return at(leverMid(ease.lever));
  return at(HIT_POINTS[name]);
}
function placeHits() {
  const m = svg.getScreenCTM();
  if (!m) return;
  const box = stage.getBoundingClientRect();
  for (const name of Object.keys(hits)) {
    const [x, y] = screenOf(name);
    const pt = new DOMPoint(x, y).matrixTransform(m);
    hits[name].style.transform = "translate(" + (pt.x - box.left).toFixed(1) + "px," + (pt.y - box.top).toFixed(1) + "px)";
  }
}
function summary() {
  return T.sp + " " + fmt(set.sp, 0) + " %, " + T.mode + " " + T.modes[set.mode] + ", " + T.gain + " " + T.gains[set.gain] + ", " + T.drain + " " + (set.wide ? T.wide : T.part) + ": " + T.verdict[verdict];
}
function describe() {
  const tail = " · " + summary();
  hits.sp.setAttribute("aria-valuenow", String(set.sp));
  hits.sp.setAttribute("aria-valuetext", fmt(set.sp, 0) + " %" + tail);
  hits.mode.setAttribute("aria-valuenow", String(MODES.indexOf(set.mode)));
  hits.mode.setAttribute("aria-valuetext", T.modes[set.mode] + tail);
  hits.gain.setAttribute("aria-valuenow", String(GAINS.indexOf(set.gain)));
  hits.gain.setAttribute("aria-valuetext", T.gains[set.gain] + tail);
  hits.lever.setAttribute("aria-checked", set.wide ? "true" : "false");
}
let quietTimer = 0;
function announce() {
  clearTimeout(quietTimer);
  quietTimer = setTimeout(() => { announcer.textContent = T.now + ": " + summary() + "."; }, 700);
}

// ------------------------------------------------ changing the setting (user or tour)
function apply(next) {
  const kcOld = M.GAINS[set.gain];
  const e = (set.sp - sim.pvm) / 100;
  if (next.mode && next.mode !== set.mode && next.mode === "PI") sim.I = sim.u - M.GAINS[next.gain ?? set.gain] * e; // bumpless into PI
  if (next.gain && next.gain !== set.gain && set.mode === "PI" && !next.mode) sim.I += (kcOld - M.GAINS[next.gain]) * e;
  Object.assign(set, next);
  refresh();
  describe();
}

// ------------------------------------------------ idle tour
// PI at normal gain tracks a setpoint step and then corrects the opened outlet.
// P alone leaves an offset, Hand (open loop) a bigger one; closing the outlet
// again puts Hand back on the setpoint. PI with high gain swings after a setpoint
// step, and normal gain calms it.
const TOUR = [
  [0, { sp: 60, mode: "PI", gain: "normal", wide: false }],
  [5, { sp: 45 }],
  [14, { wide: true }],
  [24, { mode: "P" }],
  [34, { mode: "H" }],
  [42, { wide: false }],
  [48, { mode: "PI", gain: "high", sp: 60 }],
  [60, { gain: "normal" }],
];
const TOUR_LEN = 68;
function tourAt(clock) {
  const t = clock % TOUR_LEN;
  const out = {};
  for (const [when, step] of TOUR) { if (t < when) break; Object.assign(out, step); }
  return out;
}

let frame = 0, last = 0, visible = false, touring = !still.matches, tourClock = 0, idleTimer = 0;
function follow(x, target, dt, tau) { const y = x + (target - x) * (1 - Math.exp(-dt / tau)); return Math.abs(target - y) < 1e-3 ? target : y; }
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) {
    tourClock += dt;
    const want = tourAt(tourClock);
    const diff = Object.keys(want).filter((key) => want[key] !== set[key]);
    if (diff.length) apply(Object.fromEntries(diff.map((key) => [key, want[key]])));
  }
  const tgt = { sp: set.sp, mode: angleOf("mode", set), gain: angleOf("gain", set), lever: LEVER_ANGLE[set.wide ? "wide" : "part"], open: set.wide ? OPEN.wide : OPEN.part };
  if (calm) Object.assign(ease, tgt);
  else {
    ease.sp = follow(ease.sp, tgt.sp, dt, 0.14);
    ease.mode = follow(ease.mode, tgt.mode, dt, 0.12);
    ease.gain = follow(ease.gain, tgt.gain, dt, 0.12);
    ease.lever = follow(ease.lever, tgt.lever, dt, 0.18);
    ease.open = follow(ease.open, tgt.open, dt, 0.18);
    let simDt = dt * TS;
    const cfg = cfgNow();
    while (simDt > 1e-6) { const h = Math.min(M.SUB, simDt); stepModel(M, sim, cfg, h); simDt -= h; }
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
function change(next) { steer(); apply(next); announce(); kick(); }
const cycle = (list, value, by) => list[(list.indexOf(value) + by + list.length) % list.length];
const setSp = (value) => change({ sp: clamp(Math.round(value), SP_RANGE[0], SP_RANGE[1]) });

// ------------------------------------------------ pointer: tap a control, drag the setpoint knob
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearest(p) {
  const m = svg.getScreenCTM();
  const px = m ? Math.hypot(m.a, m.b) : 1;
  let best = null, bestD = Infinity;
  for (const name of ["sp", "mode", "gain", "lever"]) {
    const [x, y] = screenOf(name);
    const d = Math.hypot(p[0] - x, p[1] - y) * px;
    if (d < bestD) { bestD = d; best = name; }
  }
  return bestD <= 44 ? best : null;
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const p = toView(event);
  const name = nearest(p);
  if (!name) return;
  press = { name, p0: p, start: set.sp, dragging: false, id: event.pointerId };
  steer();
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id || press.name !== "sp") return;
  const p = toView(event);
  const d = (p[0] - press.p0[0]) - (p[1] - press.p0[1]);
  if (!press.dragging && Math.abs(d) > 6) { press.dragging = true; try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setSp(press.start + d / 2.2);
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (!press.dragging && event.type === "pointerup") {
    if (press.name === "sp") setSp(press.start + 5 > SP_RANGE[1] ? SP_RANGE[0] : press.start + 5);
    else if (press.name === "mode") change({ mode: cycle(MODES, set.mode, 1) });
    else if (press.name === "gain") change({ gain: cycle(GAINS, set.gain, 1) });
    else change({ wide: !set.wide });
  }
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);

// ------------------------------------------------ keyboard: one focus stop per control
hits.sp.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 5 : 1;
  let handled = true;
  if (event.key === "ArrowUp" || event.key === "ArrowRight") setSp(set.sp + step);
  else if (event.key === "ArrowDown" || event.key === "ArrowLeft") setSp(set.sp - step);
  else if (event.key === "PageUp") setSp(set.sp + 10);
  else if (event.key === "PageDown") setSp(set.sp - 10);
  else if (event.key === "Home") setSp(SP_RANGE[0]);
  else if (event.key === "End") setSp(SP_RANGE[1]);
  else handled = false;
  if (handled) event.preventDefault();
});
for (const [name, list] of [["mode", MODES], ["gain", GAINS]]) {
  hits[name].addEventListener("keydown", (event) => {
    const now = set[name];
    let next = null;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") next = list[Math.min(list.length - 1, list.indexOf(now) + 1)];
    else if (event.key === "ArrowDown" || event.key === "ArrowLeft") next = list[Math.max(0, list.indexOf(now) - 1)];
    else if (event.key === "Home") next = list[0];
    else if (event.key === "End") next = list[list.length - 1];
    else if (event.key === " " || event.key === "Enter") next = cycle(list, now, 1);
    if (next === null) return;
    event.preventDefault();
    if (next !== now) change({ [name]: next });
  });
}
hits.lever.addEventListener("keydown", (event) => {
  if (event.key !== " " && event.key !== "Enter") return;
  event.preventDefault();
  change({ wide: !set.wide });
});
for (const el of Object.values(hits)) el.addEventListener("focus", () => { describe(); announcer.textContent = ""; kick(); });
addEventListener("resize", () => placeHits());

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  touring = !still.matches;
  if (still.matches) { cancelAnimationFrame(frame); frame = 0; refresh(); tick(performance.now()); } else run();
});
refresh();
describe();
draw();
requestAnimationFrame(placeHits);
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Een regelkring",
    hint: "Draai SP, stand, versterking",
    hint2: "Tik de handkraan: storing",
    time: "1 s = 12 s",
    label: LABEL_NL,
    group: "Regelkring met vier bedieningen. Tab gaat langs de setpointknop, de standenschakelaar, de versterkingsschakelaar en de handkraan.",
    sp: "Setpointknop, 20 tot 80 procent. Pijltoetsen: 1 procent, Shift 5.",
    mode: "Standenschakelaar: Hand, P of PI. Pijltoetsen of spatie.",
    gain: "Versterkingsschakelaar: laag, normaal of hoog. Pijltoetsen of spatie.",
    lever: "Handkraan in de afvoer: half open of ver open. Spatie wisselt.",
  },
  en: {
    title: "A control loop",
    hint: "Turn SP, mode, gain",
    hint2: "Tap the hand valve: disturb",
    time: "1 s = 12 s",
    label: LABEL_EN,
    group: "Control loop with four controls. Tab moves through the setpoint knob, the mode switch, the gain switch and the hand valve.",
    sp: "Setpoint knob, 20 to 80 percent. Arrow keys: 1 percent, Shift 5.",
    mode: "Mode switch: Hand, P or PI. Arrow keys or space.",
    gain: "Gain switch: low, normal or high. Arrow keys or space.",
    lever: "Hand valve in the outlet: partly open or wide open. Space toggles.",
  },
};
const hitHtml = (name, role, extra) => `<div class="lp-hit" data-hit="${name}" tabindex="0" role="${role}" aria-label="${STRINGS.nl[name]}"${extra}></div>`;
const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="lp-stage" role="group" aria-label="${STRINGS.nl.group}">${svg}${hitHtml("sp", "slider", ` aria-valuemin="${SP_RANGE[0]}" aria-valuemax="${SP_RANGE[1]}"`)}${hitHtml("mode", "slider", ' aria-valuemin="0" aria-valuemax="2"')}${hitHtml("gain", "slider", ' aria-valuemin="0" aria-valuemax="2"')}${hitHtml("lever", "switch", ' aria-checked="false"')}</div><div class="lp-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="lp-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-hint2>${STRINGS.nl.hint2}</span><br><span data-time>${STRINGS.nl.time}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-hint2]").textContent=s.hint2;h.querySelector("[data-time]").textContent=s.time;
var st=document.querySelector(".lp-stage");st.setAttribute("aria-label",s.group);st.querySelector("svg").setAttribute("aria-label",s.label);
["sp","mode","gain","lever"].forEach(function(n){st.querySelector('[data-hit="'+n+'"]').setAttribute("aria-label",s[n]);});})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
// tap targets: centre-to-centre distance in css px with the card 352 px wide (a 360 px iframe)
{
  const css = 352 / WIDTH;
  const pts = { ...Object.fromEntries(Object.entries(HIT_POINTS).map(([n, p]) => [n, at(p)])), lever: at(leverMid(LEVER_ANGLE.part)) };
  const names = Object.keys(pts);
  const pairs = [];
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) pairs.push(`${names[i]}–${names[j]} ${(Math.hypot(pts[names[i]][0] - pts[names[j]][0], pts[names[i]][1] - pts[names[j]][1]) * css).toFixed(0)}`);
  console.log(`targets at 360 px (css px apart): ${pairs.join(" · ")}`);
}
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { frames: A.uniformStates(10), apart: true });
