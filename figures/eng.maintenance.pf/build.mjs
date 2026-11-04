// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Condition monitoring" (module Maintenance, level 2).
//
//   node figures/eng.maintenance.pf/build.mjs            build the page
//   node figures/eng.maintenance.pf/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.maintenance.pf.html: one offline page
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
const A = await import(pathToFileURL(join(SKILL, "kit/audit.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.maintenance.pf.html");

// ---------------------------------------------------------------- the model
// One drive-end bearing of a pump motor, followed from its last overhaul
// (week 0). The defect starts at week T0 and grows; the overall vibration
// velocity on the bearing housing follows
//   v(t) = 1.2 + 0.01·t + A·(exp((t − T0)/τ) − 1)      [mm/s RMS], t > T0
// with A and τ solved so that v crosses the alarm level 4.5 mm/s (the ISO
// 10816-3 / 20816-3 zone C/D boundary for a group 2 machine, 15–300 kW, on a
// rigid base; zone B/C there is 2.8 mm/s) at P and reaches 11 mm/s at
// functional failure F.
// P is defined for vibration, the technique this figure inspects with, so the
// vibration P-F interval is F − P = 10 weeks. The other techniques see the same
// defect at their own time before F (typical textbook order):
//   ultrasound 12 wk · vibration 10 · oil analysis 6 · thermography 4 ·
//   noise and heat by hand 1.
// Inspections fall every I weeks from week 0. The defect is found at the first
// inspection in [P, F). A planned repair follows one week later and takes half
// a week; a bearing that reaches F first is a breakdown.
// With a random start, the chance that an inspection falls inside the window is
// min(1, PF / I): 83 % at I = 12. The bearing shown is the unlucky one.
const WEEKS = 40;
const F_WK = 35;
const PF = 10;
const P_WK = F_WK - PF;
const T0 = 15;
const V0 = 1.2;
const DRIFT = 0.01;
const ALARM = 4.5;
const V_F = 11;
const TECH = [["us", 12], ["vib", 10], ["oil", 6], ["ir", 4], ["hand", 1]];
const INTERVALS = [2, 4, 8, 12];
const LEAD = 1; // weeks from finding to the planned stop
const REPAIR = 0.5; // weeks the pump is stopped for the bearing change
const base = (t) => V0 + DRIFT * t;
const ratio = (V_F - base(F_WK)) / (ALARM - base(P_WK)); // e^a + 1, a = PF / τ
const TAU = PF / Math.log(ratio - 1);
const AMP = (ALARM - base(P_WK)) / (Math.exp((P_WK - T0) / TAU) - 1);
const level = (t) => base(t) + (t > T0 ? AMP * (Math.exp((t - T0) / TAU) - 1) : 0);
if (Math.abs(level(P_WK) - ALARM) > 1e-9 || Math.abs(level(F_WK) - V_F) > 1e-9) throw new Error("curve does not meet P and F");

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x along the shaft (pump at −x, motor at
// +x), +y toward the viewer. The top of the concrete plinth is z = 0.
const WIDTH = 600;
const ZC = 23; // shaft centre height
const FLOOR = -7;
const PLINTH = { x: -78, y: -26, w: 148, d: 52, r: 1.5 };
const BASE = { x: -72, y: -20, w: 136, d: 40, r: 1.2 };
const BASE_TOP = 5;
const POST = [0, -42];
const BOX = { x: -26, y: -46, w: 52, d: 8, r: 0.8 };
const BOX_Z = [32, 63];
const FACE_Y = BOX.y + BOX.d; // -37, the screen face
const WIN = { x0: -22, x1: 22, z0: 38.4, z1: 59.4, r: 1.4, depth: 0.8 };
const PLOT = { x0: WIN.x0, x1: WIN.x1, z0: WIN.z0 + 0.6, z1: WIN.z1 - 0.6, vmax: 12.5 };
const COWL_X = 58; // the fan cowl's end face
const STUD = [4, 0, ZC + 12];

const FIT = [
  ...k.boxCorners(PLINTH, FLOOR, 0),
  ...k.boxCorners({ x: -28, y: -47, w: 56, d: 10 }, FLOOR, BOX_Z[1] + 2),
  [-48, 0, 49],
];
const PAD = 10;
const AZIMUTH = Number(process.env.AZ ?? 74);
const ELEVATION = Number(process.env.EL ?? 26);
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
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
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

// A recess in the face y = const, after the desk computer's screen: inner walls
// shaded by facing, a back plane holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "cp-glass") {
  const id = `cp-clip-${clips++}`;
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

// ---------------------------------------------------------------- floor, plinth and baseplate
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -2), FLOOR, 2, P)}"/>`,
  `<path class="iso-halo" d="${k.haloOf({ x: -10, y: -51, w: 20, d: 18, r: 3 }, FLOOR, 1, P)}" style="opacity:.6"/>`,
];

{
  const anchors = k.corners(PLINTH, 6);
  const extra =
    L(k.planOutline(k.insetPlan(PLINTH, 3), 0, P, 3), { tone: "faint" }) +
    L(anchors.map(([x, y]) => k.ring(x, y, 1.6, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.plinth", PLINTH, FLOOR, 0, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLINTH, -2, P, 3), { tone: "faint" }), extra });
}
{
  // the fabricated baseplate: a drip rim inset from the edge, eight anchor bolts
  const bolts = [-64, -36, 22, 56].flatMap((x) => [[x, BASE.y + 3.4], [x, BASE.y + BASE.d - 3.4]]);
  const extra =
    L(k.planOutline(k.insetPlan(BASE, 1.8), BASE_TOP, P, 3), { tone: "faint" }) +
    L(bolts.map(([x, y]) => k.ring(x, y, 1.4, BASE_TOP, P, 14)).join(""), { tone: "lo" }) +
    Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.5 });
  box("base.plate", BASE, 0, BASE_TOP, { tone: "mid" }, { steps: 3, bevel: 0.7, inner: L(k.sideSeam(BASE, 1.4, P, 3), { tone: "faint" }), extra });
  // drain boss on the near long side
  discAt("base.drain", frameY([-14, BASE.y + BASE.d, 2.6]), 0, 1.6, 1.4, { tone: "mid" }, { extra: Dt([at([-14, BASE.y + BASE.d + 1.6, 2.6])], { size: 0.45, tone: "hi" }) });
}

// ---------------------------------------------------------------- the motor (+x)
const FM = frameX([6, 0, ZC]); // body from s = 0 (x = 6) to s = 36 (x = 42)
let bodyItem = null;
for (const x0 of [8, 30]) {
  const pad = { x: x0, y: -16, w: 10, d: 32, r: 0.6 };
  box("base.pad", pad, BASE_TOP, BASE_TOP + 2, { tone: "lo" }, { steps: 2, bevel: 0.3 });
  const foot = { x: x0 + 1, y: -15, w: 8, d: 30, r: 0.6 };
  const holes = [[x0 + 5, -12.4], [x0 + 5, 12.4]];
  box("motor.foot", foot, BASE_TOP + 2, BASE_TOP + 6.4, { tone: "mid" }, {
    owner: "motor",
    steps: 2,
    bevel: 0.3,
    extra: L(holes.map(([x, y]) => k.ring(x, y, 1.2, BASE_TOP + 6.4, P, 12)).join(""), { tone: "lo" }) + Dt(holes.map(([x, y]) => at([x, y, BASE_TOP + 6.4])), { size: 0.5, tone: "hi" }),
  });
}
// alignment jacking blocks welded to the baseplate, one at each end of each
// motor foot, their bolts bearing on the foot's end face
for (const [xb, dir] of [[6, 1], [42, -1]]) {
  for (const yc of [-12, 12]) {
    const blk = { x: xb - 1.2, y: yc - 2, w: 2.4, d: 4, r: 0.4 };
    box("base.jack", blk, BASE_TOP, BASE_TOP + 5.6, { tone: "mid" }, { steps: 2, bevel: 0.2 });
    const FJ = frameX([xb, yc, BASE_TOP + 3.8]);
    const s0 = dir > 0 ? 1.2 : -3;
    discAt("base.jack-bolt", FJ, s0, s0 + 1.8, 0.75, { tone: "mid", crease: "none" }, {});
    const h0 = dir > 0 ? -2.6 : 1.2;
    discAt("base.jack-head", FJ, h0, h0 + 1.4, 1.35, { tone: "mid" }, { steps: 6 });
  }
}
// earth stud on the baseplate's near corner
post("base.earth", 52, 15.6, 1.4, BASE_TOP, BASE_TOP + 1, { tone: "mid" }, { steps: 6 });
post("base.earth-stud", 52, 15.6, 0.7, BASE_TOP + 1, BASE_TOP + 3, { tone: "hi", crease: "none" }, { steps: 14, extra: Dt([at([52, 15.6, BASE_TOP + 3])], { size: 0.4, tone: "hi" }) });
{
  // cast fins along the frame, ending on the two body seams
  const fins = G.ribsOf(FM, 0.6, 35.4, 13, 30, P, { fade: [0.02, 0.4], seams: true });
  bodyItem = turned("motor.body", FM, [[0, 13], [36, 13]], { tone: "hi", crease: "lo" }, { owner: "motor", inner: k.fadedSvg(fins, { tone: "lo" }) });
}
discAt("motor.de", FM, -4, 0, 12, { tone: "mid" }, { owner: "motor", inner: L(G.arcOf(FM, -2, 12, P), { tone: "faint" }) });
discAt("motor.boss", FM, -7, -4, 6, { tone: "mid" }, { owner: "motor" });
discAt("motor.shaft", FM, -9, -7, 2.4, { tone: "hi", crease: "none" }, { owner: "motor" });
discAt("motor.nde", FM, 36, 39, 12, { tone: "mid" }, { owner: "motor", inner: L(G.arcOf(FM, 37.5, 12, P), { tone: "faint" }) });
{
  // fan cowl: a sheet-metal can, its grille end facing +x with the fan behind
  const FC = frameX([45, 0, ZC]);
  const cowl = [[0, 13.4], [11.6, 13.4], [13, 12.4]];
  const face = [
    `<path class="cp-well" d="${G.circleOf(FC, 13, 11, P, 72)}"/>`,
    `<path class="iso-line" data-tone="mid" data-fan="" d="${fanPath(0)}"/>`,
    L(G.circleOf(FC, 13, 2.6, P, 28), { tone: "lo" }),
    L(G.circleOf(FC, 13, 6.2, P, 48) + G.circleOf(FC, 13, 8.8, P, 56), { tone: "faint" }),
    L(G.circleOf(FC, 13, 11, P, 72), { tone: "lo" }),
    Dt([at([COWL_X, 0, ZC])], { size: 0.6, tone: "hi" }),
  ].join("");
  const ribs = G.ribsOf(FC, 1.2, 11.6, 13.4, 24, P, { fade: [0.04, 0.42], seams: true });
  turned("motor.cowl", FC, cowl, { tone: "mid" }, { owner: "motor", inner: k.fadedSvg(ribs, { tone: "faint" }), extra: face });
}
function fanPath(phase) {
  const points = [];
  for (let index = 0; index < 7; index++) {
    const t = phase + (index / 7) * Math.PI * 2;
    points.push(k.pathOf([at([COWL_X, 2.6 * Math.cos(t), ZC + 2.6 * Math.sin(t)]), at([COWL_X, 11 * Math.cos(t + 0.35), ZC + 11 * Math.sin(t + 0.35)])]));
  }
  return points.join("");
}
{
  // terminal box with a lid and a blanking plug on the near side
  // a round cast neck saddled on the frame carries the box
  const FN = G.frameOf([24, 0, ZC], Zv, Y, X);
  const low = G.saddleStart(13, 4, 0);
  put("motor.neck", [24, 0, ZC + 13.2], S(G.saddleOf(FN, 4, 13, 13.8, P), { tone: "mid" }), [R.solid(A.disc(FN, low - 0.05, 13.8, 4, { name: "motor.neck", owner: "motor", seated: true, cut: bodyItem.shapes }))]);
  const tb = { x: 18, y: -4.5, w: 12, d: 9, r: 0.8 };
  box("motor.tbox", tb, ZC + 13.8, 43, { tone: "mid" }, { owner: "motor", steps: 2, bevel: 0.3 });
  const lid = k.insetPlan(tb, -0.6);
  const screws = k.corners(lid, 1.4);
  box("motor.lid", lid, 43, 44.4, { tone: "mid" }, { owner: "motor", steps: 2, bevel: 0.3, extra: Dt(screws.map(([x, y]) => at([x, y, 44.4])), { size: 0.42 }) });
  const FG = frameY([24, 4.5, 39.6]);
  discAt("motor.gland", FG, 0, 2.2, 1.7, { tone: "mid" }, { owner: "motor", steps: 6 });
  discAt("motor.plug", FG, 2.2, 3.2, 1.15, { tone: "mid" }, { owner: "motor", extra: Dt([at([24, 7.7, 39.6])], { size: 0.45, tone: "hi" }) });
}
{
  // the measuring stud on top of the drive-end bearing: hex base, stud, cap
  const [x, y, z] = STUD;
  post("motor.stud-hex", x, y, 1.8, z - 0.2, z + 1.2, { tone: "hi", crease: "lo" }, { owner: "motor", steps: 6 });
  post("motor.stud", x, y, 1.15, z + 1.2, z + 3.6, { tone: "hi" }, {
    owner: "motor",
    steps: 20,
    extra: `<path class="tl-ping" data-ping="" d="${k.ring(x, y, 3.4, z + 3.6, P, 32)}"/>` + Dt([at([x, y, z + 3.6])], { size: 0.5, tone: "hi" }),
  });
}

// ---------------------------------------------------------------- coupling guard
{
  const guard = { x: -24, y: -8, w: 21, d: 16, r: 2.4 };
  const fy = guard.y + guard.d;
  const slots = [];
  for (const z of [15, 19, 23, 27]) slots.push(k.pathOf(k.roundedPlan({ x: -20, y: z, w: 13, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u, fy, w])), true));
  // the work-order tag: hung on a screw when the defect is found
  const tag = [[-19.4, fy, 24.6], [-13.6, fy, 24.6], [-13.6, fy, 13.4], [-19.4, fy, 13.4]];
  const tagSvg = [
    `<g class="tl-tag" data-tag="" style="opacity:0">`,
    `<path class="tl-card" d="${k.pathOf(tag.map(at), true)}"/>`,
    L(k.sideRing([-16.5, fy, 22.8], 0.7, "y", P, 14), { tone: "lo" }),
    L([21, 19.6, 18.2, 16.8].map((z, i) => k.segment([-18.4, fy, z], [-18.4 + [4.6, 3.6, 4.2, 2.8][i], fy, z], P)).join(""), { tone: "lo", free: true }),
    `</g>`,
  ].join("");
  box("guard.cover", guard, 10, 32, { tone: "mid" }, {
    owner: "guard",
    steps: 3,
    bevel: 0.6,
    inner: L(slots.join(""), { tone: "lo" }),
    extra: Dt([[-16.5, fy, 22.8], [-22, fy, 30], [-5, fy, 30]].map(at), { size: 0.42, tone: "mid" }) + tagSvg,
  });
  for (const x0 of [-22, -9]) box("guard.foot", { x: x0, y: -10.5, w: 4, d: 21, r: 0.5 }, BASE_TOP, 10, { tone: "lo" }, { owner: "guard", steps: 2, extra: Dt([at([x0 + 2, 9.4, BASE_TOP + 0.01])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- the pump (−x)
const FB = frameX([-38, 0, ZC]); // bearing frame x −38 … −24
discAt("pump.frame", FB, 0, 14, 7, { tone: "mid" }, { owner: "pump", inner: L(G.arcOf(FB, 4, 7, P) + G.arcOf(FB, 10, 7, P), { tone: "faint" }) });
box("pump.frame-foot", { x: -34, y: -8, w: 6, d: 16, r: 0.6 }, BASE_TOP, 16.4, { tone: "mid" }, { owner: "pump", steps: 2, bevel: 0.3 });
{
  // oil sight glass on the bearing frame (the oil-analysis sample point)
  const FS = frameY([-31, 6.85, ZC]);
  discAt("pump.sight", FS, 0, 1.8, 1.9, { tone: "mid" }, { owner: "pump", extra: `<path class="tl-oil" d="${G.circleOf(FS, 1.8, 1.25, P, 24)}"/>` + L(G.circleOf(FS, 1.8, 1.25, P, 24), { tone: "lo" }) });
}
discAt("pump.cover", frameX([-42, 0, ZC]), 0, 4, 11, { tone: "mid" }, { owner: "pump" });
{
  const FV = frameX([-54, 0, ZC]);
  const volute = [[0, 12], [1.2, 15.8, 1], [6, 16.4, 1], [10.8, 15.8, 1], [12, 12]];
  const bolts = G.dotsOf(FV, 12, 13.6, 12, P, { fade: [0.0, 0.3], all: true });
  turned("pump.casing", FV, volute, { tone: "hi", crease: "lo" }, { owner: "pump", extra: Dt(bolts, { size: 0.5, tone: "mid" }) });
  box("pump.foot", { x: -52, y: -8, w: 8, d: 16, r: 0.6 }, BASE_TOP, 7.4, { tone: "mid" }, { owner: "pump", steps: 2 });
  const FN = frameX([-64, 0, ZC]);
  discAt("pump.suction", FN, 0, 10, 6, { tone: "mid" }, { owner: "pump" });
  discAt("pump.suction-flange", FN, -3, 0, 9.5, { tone: "mid" }, { owner: "pump", extra: Dt(G.dotsOf(FN, -1.5, 9.5, 8, P, { fade: [0.05, 0.35] }), { size: 0.45 }) });
  // discharge nozzle straight up, with its flange and bolt circle
  post("pump.discharge", -48, 0, 4.4, ZC + 16.1, 46, { tone: "mid" }, { owner: "pump", steps: 32 });
  const flangeTop = 48.4;
  const holes = Array.from({ length: 8 }, (_, i) => [-48 + 6.1 * Math.cos((i + 0.5) * Math.PI / 4), 6.1 * Math.sin((i + 0.5) * Math.PI / 4)]);
  post("pump.flange", -48, 0, 7.6, 46, flangeTop, { tone: "mid" }, {
    owner: "pump",
    steps: 40,
    bevel: 0.3,
    extra: `<path class="cp-well" d="${k.ring(-48, 0, 4, flangeTop, P, 36)}"/>` + L(k.ring(-48, 0, 4, flangeTop, P, 36), { tone: "lo" }) + Dt(holes.map(([x, y]) => at([x, y, flangeTop])), { size: 0.5, tone: "mid" }),
  });
}

// ---------------------------------------------------------------- the condition panel on its pedestal
{
  const foot = { x: -8, y: -49, w: 16, d: 14, r: 1 };
  const bolts = k.corners(foot, 2.2);
  box("stand.foot", foot, FLOOR, FLOOR + 1.4, { tone: "lo" }, { steps: 2, bevel: 0.3, extra: Dt(bolts.map(([x, y]) => at([x, y, FLOOR + 1.4])), { size: 0.45 }) });
  post("panel.post", POST[0], POST[1], 2.2, FLOOR + 1.4, BOX_Z[0] - 5, { tone: "mid" }, { steps: 24, inner: L(k.sideArc(POST[0], POST[1], 2.2, 8, P, 16), { tone: "faint" }) });
  post("panel.collar", POST[0], POST[1], 3.4, BOX_Z[0] - 5, BOX_Z[0], { tone: "mid" }, { steps: 28, bevel: 0.3 });
  const fy = FACE_Y;
  // the screen, a running lamp and a label plate below it
  const screen = [
    `<path class="iso-line" data-tone="lo" data-alarm="" d="M${WIN.x0} ${-plotZ(ALARM)}H${WIN.x1}"/>`,
    `<path class="iso-line" data-tone="mid" data-ticks="" d=""/>`,
    `<path class="iso-line" data-tone="faint" data-cursor="" d=""/>`,
    `<path class="tl-curve" data-curve="" d=""/>`,
    `<g class="tl-marks" data-marks=""></g>`,
    `<path class="tl-trend" data-trend="" d=""/>`,
    `<g class="tl-pts" data-pts=""></g>`,
    `<circle class="tl-now" data-now="" cx="${WIN.x0}" cy="${-plotZ(level(0))}" r="0.55"/>`,
  ].join("");
  const label = { x0: -15, x1: 3, z0: 33.8, z1: 37 };
  const faceBits = [
    recess(WIN, fy, screen),
    `<g transform="${planeOf(fy)}">`,
    `<path class="tl-card" d="${flatRect(label.x0, label.z0, label.x1, label.z1, 0.4, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-13.4 ${-35.9}H0.6M-13.4 ${-34.9}H-3.4"/>`,
    `</g>`,
    Dt([[BOX.x + 1.4, fy, BOX_Z[0] + 1.4], [BOX.x + BOX.w - 1.4, fy, BOX_Z[0] + 1.4], [BOX.x + 1.4, fy, BOX_Z[1] - 1.4], [BOX.x + BOX.w - 1.4, fy, BOX_Z[1] - 1.4]].map(at), { size: 0.42 }),
  ].join("");
  box("panel.box", BOX, BOX_Z[0], BOX_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.6, extra: faceBits });
  const FL = frameY([-19.5, fy, 35.4]);
  discAt("panel.lamp-ring", FL, 0, 0.6, 1.7, { tone: "mid" }, {});
  discAt("panel.lamp", FL, 0.6, 1.3, 1.15, { tone: "hi", crease: "none" }, { attrs: ' data-lamp=""' });
  discAt("panel.key", frameY([21, fy, 35.4]), 0, 1.4, 1.6, { tone: "mid" }, { extra: L(k.segment([21, fy + 1.4, 34.4], [21, fy + 1.4, 36.4], P), { tone: "lo" }) });
  const hood = { x: BOX.x - 1, y: BOX.y - 0.6, w: BOX.w + 2, d: BOX.d + 2.2, r: 0.8 };
  box("panel.hood", hood, BOX_Z[1], BOX_Z[1] + 1.4, { tone: "mid" }, { steps: 2, bevel: 0.3 });
}
function plotX(week) {
  return PLOT.x0 + ((PLOT.x1 - PLOT.x0) * week) / WEEKS;
}
function plotZ(v) {
  return PLOT.z0 + ((PLOT.z1 - PLOT.z0) * Math.min(v, PLOT.vmax)) / PLOT.vmax;
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);

const STUD_TOP = at([STUD[0], STUD[1], STUD[2] + 3.6]);
const body = [...halo, ...groups, `<g class="tl-wisps" data-wisps="">${[0, 1, 2, 3].map(() => `<circle class="tl-wisp" cx="${STUD_TOP[0].toFixed(1)}" cy="${STUD_TOP[1].toFixed(1)}" r="0" opacity="0"/>`).join("")}</g>`];

const LABEL_NL =
  "Een pompset op een gegoten fundatie: een centrifugaalpomp met slakkenhuis, persflens en lagerbok met oliepeilglas, een koppelingskap en een elektromotor met koelribben, klemmenkast en ventilatorkap. Op het lager aan de aandrijfzijde van de motor zit een meetnippel voor trillingsmeting. Achter de set staat een conditiepaneel op een voet; het scherm toont de trillingstrend van het lager over veertig weken, de alarmgrens en de inspectiemomenten. Een lagerdefect is meetbaar vanaf punt P en leidt tien weken later tot uitval bij F. Valt een inspectie tussen P en F, dan volgt een gepland herstel; anders valt de pomp uit.";
const LABEL_EN =
  "A pump set on a grouted plinth: a centrifugal pump with its volute, discharge flange and bearing frame with an oil sight glass, a coupling guard, and an electric motor with cooling fins, terminal box and fan cowl. A measuring stud for vibration sits on the motor's drive-end bearing. Behind the set stands a condition panel on a pedestal; its screen shows the bearing's vibration trend over forty weeks, the alarm level and the inspection moments. A bearing defect becomes measurable at point P and leads to functional failure at F ten weeks later. If an inspection falls between P and F a planned repair follows; otherwise the pump breaks down.";

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
  --mp-hair:rgba(240,233,218,.12);--mp-accent:#5C9FAE;--mp-glass:#0A1E23;--mp-well:#0A1E23;--mp-oil:#45615D;--mp-smoke:#9FB3A6;
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
  --mp-hair:rgba(11,41,27,.14);--mp-accent:#276F81;--mp-glass:#E2ECEA;--mp-well:#DDD4BF;--mp-oil:#A9AE9E;--mp-smoke:#7D877A;
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
.iso-plate-corner[data-corner="hint"]{bottom:73px!important;max-width:42%;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:73px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.mp-line{display:block;white-space:nowrap}
.mp-acc{color:var(--mp-accent);font-weight:600}
.mp-strong{color:var(--anatomy-strong);font-weight:600}
.mp-mute{color:var(--anatomy-muted)}
.mp-model{position:absolute;left:0;right:0;bottom:0;font-family:var(--mp-sans);font-size:9.5px;line-height:1.3;color:var(--anatomy-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:ew-resize;border-radius:8px}
.mp-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.mp-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.mp-controls{position:absolute;left:10px;right:10px;bottom:22px;height:44px;display:flex;align-items:center;gap:6px}
.mp-btn{min-width:44px;min-height:44px;height:44px;padding:0 8px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--mp-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--mp-hair);display:inline-flex;align-items:center;justify-content:center;gap:2px;white-space:nowrap}
.mp-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.mp-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--mp-accent);color:var(--mp-accent);font-weight:600}
.mp-btn small{font-size:10px;color:var(--anatomy-muted);font-weight:400}
.mp-btn[aria-checked="true"] small{color:var(--mp-accent)}
.mp-seg{display:flex;gap:4px;flex:1 1 auto;justify-content:flex-end}
.mp-seg .mp-btn{flex:1 1 0;max-width:64px}
.mp-play svg{width:14px;height:14px;fill:currentColor}
.mp-play [data-icon="pause"]{display:none}
.mp-play[data-on] [data-icon="pause"]{display:block}
.mp-play[data-on] [data-icon="play"]{display:none}
.mp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.cp-glass{fill:var(--mp-glass);stroke:none}
.cp-well{fill:var(--mp-well);stroke:none}
.tl-oil{fill:var(--mp-oil);stroke:none}
.tl-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.tl-tag .tl-card{stroke:var(--anatomy-hi)}
.tl-curve{fill:none;stroke:var(--anatomy-mid);stroke-width:.7px;stroke-linejoin:round;stroke-linecap:round}
.tl-trend{fill:none;stroke:var(--mp-accent);stroke-width:1.5px;stroke-linejoin:round;stroke-linecap:round}
.tl-pts circle{fill:var(--mp-accent);stroke:none}
.tl-marks circle{fill:var(--mp-glass);stroke:var(--anatomy-mid);stroke-width:.6px}
.tl-now{fill:var(--anatomy-hi);stroke:none}
.tl-ping{fill:none;stroke:var(--mp-accent);stroke-width:1.2px;opacity:0}
.tl-wisp{fill:var(--mp-smoke);filter:blur(2.2px)}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .4s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--mp-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const WEEKS = ${WEEKS}, F_WK = ${F_WK}, P_WK = ${P_WK}, PF = ${PF}, T0 = ${T0}, V0 = ${V0}, DRIFT = ${DRIFT}, ALARM = ${ALARM};
const TAU = ${TAU}, AMP = ${AMP};
const TECH = ${JSON.stringify(TECH)};
const INTERVALS = ${JSON.stringify(INTERVALS)};
const LEAD = ${LEAD}, REPAIR = ${REPAIR};
const PLOT = ${JSON.stringify(PLOT)};
const ZC = ${ZC}, COWL_X = ${COWL_X};
const STUD_TOP = ${JSON.stringify(STUD_TOP)};
const KS = ${KS};
const WK_PER_S = 6.25; // one week every 0.16 s
const base = ${base.toString()};
const level = ${level.toString()};
${plotX.toString()}
${plotZ.toString()}
${fanPath.toString().replace(/\bk\./g, "")}
function at(point) { return iso(point, P); }

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { week: "week", before: "before P", since: "since P", fresh: "new bearing", pf: "P–F vibration", every: "inspection", wk: "wk", chance: "chance", running: "running", found: "found in time", repair: "planned repair", fail: "breakdown", stopped: "stopped", dec: "." }
  : { week: "week", before: "vóór P", since: "sinds P", fresh: "nieuw lager", pf: "P–F trilling", every: "inspectie", wk: "wk", chance: "kans", running: "loopt", found: "op tijd gevonden", repair: "gepland herstel", fail: "storing", stopped: "stil", dec: "," };

const stage = document.querySelector(".mp-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { fan: q("[data-fan]"), ticks: q("[data-ticks]"), cursor: q("[data-cursor]"), curve: q("[data-curve]"), marks: q("[data-marks]"), trend: q("[data-trend]"), pts: q("[data-pts]"), now: q("[data-now]"), ping: q("[data-ping]"), tag: q("[data-tag]"), lamp: q("[data-lamp]"), wisps: [...svg.querySelectorAll(".tl-wisp")] };
const lines = [...document.querySelectorAll("[data-readout] .mp-line")];
const radios = [...document.querySelectorAll(".mp-seg .mp-btn")];
const playBtn = document.querySelector(".mp-play");
const announcer = document.querySelector(".mp-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const f1 = (v) => v.toFixed(1).replace(".", T.dec);

// ------------------------------------------------ the bearing and the inspection plan
function plan(I) {
  const times = [];
  for (let w = I; w <= WEEKS + 1e-9; w += I) times.push(w);
  const tc = times.find((w) => w >= P_WK && w < F_WK);
  const caught = tc !== undefined;
  return { I, times, caught, tc, tr: caught ? tc + LEAD : Infinity, chance: Math.min(1, PF / I) };
}
function levelAt(pl, t) {
  if (t >= pl.tr) return base(t - pl.tr);
  return level(t);
}
function running(pl, t) {
  if (pl.caught) return !(t >= pl.tr && t < pl.tr + REPAIR);
  return t < F_WK;
}
const failed = (pl, t) => !pl.caught && t >= F_WK;

// ------------------------------------------------ state
const state = { I: 8, pl: plan(8), t: WEEKS, playing: false, hold: 0, fan: 1, phase: 0, ping: -9, clock: 0, failAt: -9, tagged: 0 };
let shownI = -1;

function screen() {
  const pl = state.pl, t = state.t;
  // inspection ticks: rooted on the bottom edge of the window
  if (shownI !== pl.I) {
    shownI = pl.I;
    el.ticks.setAttribute("d", pl.times.filter((w) => w < WEEKS).map((w) => "M" + plotX(w).toFixed(2) + " " + (-PLOT.z0 + 0.6).toFixed(2) + "v-1.5").join(""));
  }
  // the true condition: from week 0 to now, a drop at the repair, a spike at F
  const pts = [];
  const end = failed(pl, t) ? F_WK : t;
  for (let w = 0; w <= end + 1e-9; w += 0.25) {
    const ww = Math.min(w, end);
    if (pl.caught && ww >= pl.tr && (pts.length && pts[pts.length - 1][0] < pl.tr)) pts.push([pl.tr, level(pl.tr)], [pl.tr, base(0)]);
    pts.push([ww, levelAt(pl, ww)]);
  }
  if (pts[pts.length - 1][0] < end) pts.push([end, levelAt(pl, end)]);
  if (failed(pl, t)) pts.push([F_WK, PLOT.vmax]);
  el.curve.setAttribute("d", "M" + pts.map(([w, v]) => plotX(w).toFixed(2) + " " + (-plotZ(v)).toFixed(2)).join("L"));
  const last = pts[pts.length - 1];
  const showNow = !failed(pl, t);
  el.now.setAttribute("cx", plotX(last[0]).toFixed(2));
  el.now.setAttribute("cy", (-plotZ(last[1])).toFixed(2));
  el.now.style.display = showNow ? "" : "none";
  // where each technique could have seen this defect (only while the old bearing runs)
  const marks = TECH.map(([, pf]) => F_WK - pf).filter((w) => w <= t && w < pl.tr && w < F_WK + 1e-9);
  const mk = marks.map((w) => '<circle cx="' + plotX(w).toFixed(2) + '" cy="' + (-plotZ(level(w))).toFixed(2) + '" r="0.5"/>').join("");
  if (el.marks.innerHTML !== mk) el.marks.innerHTML = mk;
  // measured points: every inspection the pump was running for
  const meas = pl.times.filter((w) => w <= t + 1e-9 && running(pl, w) && !(failed(pl, w))).map((w) => [w, levelAt(pl, w)]);
  el.trend.setAttribute("d", meas.length > 1 ? "M" + meas.map(([w, v]) => plotX(w).toFixed(2) + " " + (-plotZ(v)).toFixed(2)).join("L") : "");
  const pd = meas.map(([w, v]) => '<circle cx="' + plotX(w).toFixed(2) + '" cy="' + (-plotZ(v)).toFixed(2) + '" r="0.62"/>').join("");
  if (el.pts.innerHTML !== pd) el.pts.innerHTML = pd;
  el.cursor.setAttribute("d", t > 0.05 && t < WEEKS - 0.05 ? "M" + plotX(t).toFixed(2) + " " + (-PLOT.z1 - 0.6).toFixed(2) + "V" + (-PLOT.z0 + 0.6).toFixed(2) : "");
}

function result(pl, t) {
  if (pl.caught && t >= pl.tc) return { kind: "found", at: pl.tc };
  if (failed(pl, t)) return { kind: "fail", at: F_WK };
  return { kind: "run" };
}
let lastResult = "";
function readout() {
  const pl = state.pl, t = state.t, w = Math.floor(t + 1e-6);
  let l1;
  if (pl.caught && t >= pl.tr + REPAIR) l1 = T.week + " " + w + " · " + T.fresh;
  else if (t < P_WK) l1 = T.week + " " + w + " · " + T.before;
  else l1 = T.week + " " + w + " · " + T.since + " " + Math.floor(Math.min(t, failed(pl, t) ? F_WK : t) - P_WK + 1e-6) + " " + T.wk;
  const l2 = T.pf + " " + PF + " " + T.wk;
  const l3 = T.every + " " + pl.I + " " + T.wk + " · " + T.chance + " " + Math.round(pl.chance * 100) + " %";
  const r = result(pl, t);
  let l4;
  if (r.kind === "found") l4 = '<span class="mp-acc">' + T.found + "</span> · " + T.week + " " + r.at;
  else if (r.kind === "fail") l4 = '<span class="mp-strong">' + T.fail + "</span> · " + T.week + " " + r.at;
  else l4 = '<span class="mp-mute">' + T.running + "</span>";
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].textContent !== l3) lines[2].textContent = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
  const key = r.kind + pl.I;
  if (key !== lastResult) {
    lastResult = key;
    if (r.kind !== "run") announcer.textContent = (r.kind === "found" ? T.found + ", " + T.week + " " + r.at + ", " + T.repair + " " + T.week + " " + (r.at + LEAD) : T.fail + ", " + T.week + " " + r.at) + ".";
  }
}
function describe() {
  const pl = state.pl, t = state.t;
  const r = result(pl, t);
  stage.setAttribute("aria-valuenow", String(Math.round(t)));
  stage.setAttribute("aria-valuetext", T.week + " " + Math.round(t) + ", " + T.every + " " + pl.I + " " + T.wk + ", " + (r.kind === "found" ? T.found + " (" + T.week + " " + r.at + ")" : r.kind === "fail" ? T.fail + " (" + T.week + " " + r.at + ")" : T.running));
  radios.forEach((b) => b.setAttribute("aria-checked", String(Number(b.dataset.i) === pl.I)));
  if (state.playing) playBtn.setAttribute("data-on", ""); else playBtn.removeAttribute("data-on");
  playBtn.setAttribute("aria-label", state.playing ? playBtn.dataset.pause : playBtn.dataset.play);
}

function draw(calm) {
  const pl = state.pl, t = state.t;
  screen();
  readout();
  // the fan behind the cowl grille
  el.fan.setAttribute("d", fanPath(state.phase));
  if (running(pl, t)) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  // the work-order tag, from the find until the new bearing runs
  const tagOn = pl.caught && t >= pl.tc && t < pl.tr + REPAIR + 1.5;
  state.tagged += ((tagOn ? 1 : 0) - state.tagged) * (calm ? 1 : 0.12);
  el.tag.style.opacity = state.tagged.toFixed(3);
  // the measuring ping at an inspection
  const age = state.clock - state.ping;
  el.ping.style.opacity = calm ? "0" : (smooth(0, 0.08, age) * Math.exp(-Math.max(0, age - 0.08) / 0.32)).toFixed(3);
  // smoke from the seized drive-end bearing
  const smoke = failed(pl, t) ? (calm ? 0.7 : smooth(0, 1.2, state.clock - state.failAt)) : 0;
  el.wisps.forEach((c, i) => {
    if (smoke <= 0.002) { c.setAttribute("opacity", "0"); return; }
    const cyc = calm ? (i + 0.5) / el.wisps.length : ((state.clock * 0.28 + i / el.wisps.length) % 1);
    const rise = cyc * 46;
    const x = STUD_TOP[0] + Math.sin(cyc * 5 + i * 1.7) * 3.2 + cyc * 7;
    const y = STUD_TOP[1] - 3 - rise;
    const r = 2.6 + cyc * 8;
    const a = smoke * smooth(0, 0.18, cyc) * (1 - smooth(0.5, 1, cyc)) * 0.8;
    c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("r", r.toFixed(2)); c.setAttribute("opacity", a.toFixed(3));
  });
}

// ------------------------------------------------ time
// Events the clock pauses on so the reader can see them.
function eventsOf(pl) {
  const out = [];
  if (pl.caught) out.push([pl.tc, 0.9], [pl.tr + 0.1, 1.6]);
  else out.push([F_WK, 1.2]);
  return out;
}
function advance(dt) {
  if (state.hold > 0) { state.hold -= dt; return; }
  const from = state.t;
  let to = Math.min(WEEKS, from + dt * WK_PER_S);
  for (const [w, hold] of eventsOf(state.pl)) if (from < w && to >= w) { to = w; state.hold = hold; break; }
  for (const w of state.pl.times) if (from < w && to >= w && running(state.pl, w) && !failed(state.pl, w)) state.ping = state.clock;
  if (!failed(state.pl, from) && failed(state.pl, to)) state.failAt = state.clock;
  state.t = to;
  if (to >= WEEKS) { state.hold = 2.6; onEnd(); }
}

// ------------------------------------------------ idle tour: 12 weeks (missed), 8 (found), 4 (found early)
const TOUR = [12, 8, 4];
let tourStep = 0, touring = !still.matches, idleTimer = 0;
function startRun(I, from) {
  state.I = I; state.pl = plan(I); state.t = from; state.hold = 0.35; state.playing = true;
  state.failAt = failed(state.pl, from) ? -9 : state.failAt; lastResult = ""; shownI = -1;
  if (failed(state.pl, from)) state.failAt = state.clock - 2;
  describe();
}
function onEnd() {
  if (touring) { tourStep = (tourStep + 1) % TOUR.length; pendingTour = true; }
  else { state.playing = false; describe(); }
}
let pendingTour = false;

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  state.clock += dt;
  if (calm) {
    state.fan = running(state.pl, state.t) ? 1 : 0;
  } else {
    if (state.playing) {
      if (pendingTour && state.hold <= 0) { pendingTour = false; startRun(TOUR[tourStep], 14); }
      else advance(dt);
    }
    const target = running(state.pl, state.t) ? 1 : 0;
    state.fan += (target - state.fan) * (1 - Math.exp(-dt / (target ? 0.35 : 0.55)));
    if (Math.abs(target - state.fan) < 0.002) state.fan = target;
    state.phase = (state.phase + dt * state.fan * 2.6) % (Math.PI * 2);
  }
  draw(calm);
  const moving = state.fan > 0 || state.playing || failed(state.pl, state.t) || state.clock - state.ping < 1.5 || Math.abs(state.tagged - Math.round(state.tagged)) > 0.002;
  frame = visible && !calm && moving ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function steer() {
  touring = false; pendingTour = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourStep = 0; startRun(TOUR[0], 14); run(); } }, 40000);
}
function setInterval_(I) {
  steer();
  if (still.matches) { state.I = I; state.pl = plan(I); state.t = WEEKS; state.playing = false; lastResult = ""; shownI = -1; describe(); kick(); return; }
  startRun(I, 23);
  kick();
}
function setWeek(w) {
  steer();
  state.playing = false; state.hold = 0;
  const before = state.t;
  state.t = clamp(w, 0, WEEKS);
  if (!failed(state.pl, before) && failed(state.pl, state.t)) state.failAt = state.clock;
  describe();
  kick();
}
function togglePlay() {
  steer();
  if (state.playing) { state.playing = false; }
  else if (still.matches) { state.t = WEEKS; }
  else { if (state.t >= WEEKS - 1e-6) { state.t = 0; lastResult = ""; } state.hold = 0; state.playing = true; if (failed(state.pl, state.t)) state.failAt = state.clock - 2; }
  describe();
  kick();
}

// ------------------------------------------------ controls
radios.forEach((b) => b.addEventListener("click", () => setInterval_(Number(b.dataset.i))));
document.querySelector(".mp-seg").addEventListener("keydown", (event) => {
  const index = INTERVALS.indexOf(state.pl.I);
  let next = -1;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % INTERVALS.length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + INTERVALS.length - 1) % INTERVALS.length;
  if (next < 0) return;
  event.preventDefault();
  setInterval_(INTERVALS[next]);
  radios[next].focus();
});
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
  if (press.dragging) setWeek(press.start + dx / 9);
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
  const step = event.shiftKey ? 4 : 1;
  let handled = true;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") setWeek(Math.floor(state.t + 1e-6) + step);
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") setWeek(Math.ceil(state.t - 1e-6) - step);
  else if (event.key === "Home") setWeek(0);
  else if (event.key === "End") setWeek(WEEKS);
  else if (event.key === " " || event.key === "Enter") togglePlay();
  else if (["1", "2", "3", "4"].includes(event.key)) setInterval_(INTERVALS[Number(event.key) - 1]);
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
if (!still.matches) { tourStep = 0; startRun(TOUR[0], 14); }
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  if (still.matches) { touring = false; state.playing = false; state.t = WEEKS; cancelAnimationFrame(frame); frame = 0; describe(); tick(performance.now()); }
  else { touring = true; tourStep = 0; startRun(TOUR[0], 14); run(); }
});
describe();
draw(still.matches);
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "P-F-interval en inspectie",
    hint: "Kies het interval",
    drag: "sleep: tijd · tik: pauze",
    model: "P–F: ultrasoon 12 · trilling 10 · olie 6 · IR 4 · hand 1 wk",
    play: "Afspelen",
    pause: "Pauze",
    group: "Inspectie-interval",
    label: LABEL_NL,
    aria: "Tijdlijn van week 0 tot 40. Pijl links en rechts verschuift een week (Shift: vier), Home en End gaan naar begin en eind, spatie speelt af of pauzeert, de toetsen 1 tot 4 kiezen een inspectie-interval van 2, 4, 8 of 12 weken.",
  },
  en: {
    title: "P-F interval and inspection",
    hint: "Pick the interval",
    drag: "drag: time · tap: pause",
    model: "P–F: ultrasound 12 · vibration 10 · oil 6 · IR 4 · hand 1 wk",
    play: "Play",
    pause: "Pause",
    group: "Inspection interval",
    label: LABEL_EN,
    aria: "Timeline from week 0 to 40. Left and right arrows move one week (Shift: four), Home and End go to the start and end, Space plays or pauses, keys 1 to 4 choose an inspection interval of 2, 4, 8 or 12 weeks.",
  },
};

const ICONS = `<svg viewBox="0 0 14 14" aria-hidden="true" data-icon="play"><path d="M3.5 2.2v9.6l8-4.8z"/></svg><svg viewBox="0 0 14 14" aria-hidden="true" data-icon="pause"><path d="M3.2 2.4h2.6v9.2H3.2zM8.2 2.4h2.6v9.2H8.2z"/></svg>`;
const controls = `<div class="mp-controls"><button type="button" class="mp-btn mp-play" data-play="${STRINGS.nl.play}" data-pause="${STRINGS.nl.pause}" aria-label="${STRINGS.nl.play}">${ICONS}</button><div class="mp-seg" role="radiogroup" aria-label="${STRINGS.nl.group}">${INTERVALS.map((I, index) => `<button type="button" class="mp-btn" role="radio" data-i="${I}" aria-checked="${I === 8}" tabindex="${I === 8 ? 0 : -1}">${I}<small>&#8202;wk</small></button>`).join("")}</div></div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="mp-stage" tabindex="0" role="slider" aria-label="${STRINGS.nl.aria}" aria-valuemin="0" aria-valuemax="${WEEKS}" aria-valuenow="${WEEKS}">${svg}</div>${controls}<div class="mp-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="mp-line"></span>'.repeat(4)}</span><span class="mp-model" data-model>${STRINGS.nl.model}</span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-drag>${STRINGS.nl.drag}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-drag]").textContent=s.drag;
document.querySelector("[data-model]").textContent=s.model;
var p=document.querySelector(".mp-play");p.dataset.play=s.play;p.dataset.pause=s.pause;p.setAttribute("aria-label",s.play);
document.querySelector(".mp-seg").setAttribute("aria-label",s.group);
var st=document.querySelector(".mp-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: τ ${TAU.toFixed(2)} wk, A ${AMP.toFixed(3)} mm/s, v(P) ${level(P_WK).toFixed(2)}, v(F) ${level(F_WK).toFixed(2)}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

// the stud item also draws the measuring ping, a ring wider than the stud by design
A.auditOrExit(R, P, { cover: ["motor.stud"] });
