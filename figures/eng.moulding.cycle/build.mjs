// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Cycle time and output" (module Injection moulding, level 2).
//
//   node figures/eng.moulding.cycle/build.mjs            build the page
//   node figures/eng.moulding.cycle/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.moulding.cycle.html: one offline page
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
const OUT = join(ROOT, "src/content/courses/figures/eng.moulding.cycle.html");

// ---------------------------------------------------------------- the model
// The lesson's worked example: a 2-cavity mould for a cap. At a 3 mm wall the
// cycle is 20 s, of which cooling is 12 s. Cooling grows with the square of the
// wall thickness, so
//   cooling(s) = 12 s · (s / 3 mm)²
// and everything else (close, inject, hold, open, eject) stays 8 s:
//   cycle(s) = 8 + cooling(s),  parts per hour = 3,600 / cycle × cavities.
// Checks against the lesson: 3 mm → 20 s → 360 per hour; 2.4 mm → cooling
// 7.68 s → cycle 15.68 s → 459 per hour (+27 %).
// Dosing (the screw turning back for the next shot) runs during cooling and
// takes 1.2 s, shorter than cooling at the thinnest wall (1.33 s at 1 mm), so
// it never adds to the cycle.
const CAVITIES = 2;
const REF_WALL = 3;
const REF_COOL = 12;
const PHASES = [["close", 1.5], ["inject", 1.0], ["hold", 2.5], ["cool", 0], ["open", 1.5], ["eject", 1.5]];
const FIXED = PHASES.reduce((sum, [, d]) => sum + d, 0);
const WALL = [1, 4];
const DOSE = 1.2;
const coolOf = (s) => REF_COOL * (s / REF_WALL) ** 2;
const cycleOf = (s) => FIXED + coolOf(s);
const perHour = (s) => (3600 / cycleOf(s)) * CAVITIES;
{
  const near = (a, b, e) => Math.abs(a - b) < e;
  if (FIXED !== 8) throw new Error("fixed phases must add up to 8 s");
  if (!near(cycleOf(3), 20, 1e-9) || !near(perHour(3), 360, 1e-9)) throw new Error("3 mm must give 20 s and 360 per hour");
  if (!near(coolOf(2.4), 7.68, 1e-9) || Math.round(perHour(2.4)) !== 459) throw new Error("2.4 mm must give 7.7 s cooling and 459 per hour");
  if (coolOf(WALL[0]) <= DOSE) throw new Error("dosing must fit inside cooling");
}

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x along the machine (clamp at −x,
// injection unit at +x), +y toward the operator. The top of the bed is z = 34.
const WIDTH = 600;
const FLOOR = -5;
const BED = { x: -146, y: -22, w: 260, d: 44, r: 1.4 };
const BED_TOP = 34;
const ZC = 57; // machine axis height
const RAIL_TOP = 35.6;
const PL_Y = 21; // platen half width
const PL_TOP = 80;
const BAR_R = 2.6;
const BARS = [[-16, 40], [16, 40], [-16, 74], [16, 74]]; // [y, z]
const REAR = [-118, -106];
const MOVING = [-52, -42]; // closed
const MOULD_M = [-42, -30];
const MOULD_F = [-30, -18];
const FIXED_PL = [-18, -6];
const MOULD = { y: 12, z0: 44, z1: 70 };
const OPEN = 26; // stroke of the moving platen
const STROKE = 8; // stroke of the screw
const CAPS = [-6, 6]; // y of the two cavities
const CAP_R = 4;
const CAP_H = 3;
const WELL = { x: -58, y: -11.5, w: 26, d: 23, r: 1 };
const PANEL = { x: -6, y: -50, w: 66, d: 8, r: 0.8 };
const PANEL_Z = [83, 122];
const FACE_Y = PANEL.y + PANEL.d;
const WIN = { x0: PANEL.x + 3.2, x1: PANEL.x + PANEL.w - 3.2, z0: 89.5, z1: 119, r: 1.2, depth: 0.8 };
const PANEL_POST = [27, -46];

const FIT = [
  ...k.boxCorners(BED, FLOOR, BED_TOP),
  ...k.boxCorners({ x: -140, y: -21, w: 250, d: 42 }, BED_TOP, PL_TOP),
  ...k.boxCorners({ x: PANEL.x - 1, y: PANEL.y - 1, w: PANEL.w + 2, d: PANEL.d + 3 }, PANEL_Z[0], PANEL_Z[1] + 1.4),
  [68, 0, 98],
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
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameZ = (o) => G.frameOf(o, Zv, X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

// ---------------------------------------------------------------- recorder
// Two things move: the moving platen with its mould half ("platen", opening
// along −x) and the screw with the injection drive ("screw", forward along −x).
const MOVES = { platen: [-OPEN, 0, 0], screw: [-STROKE, 0, 0] };
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
// A rod sliding through a gland: drawn long, clipped from the gland face on,
// the clip held still while the item moves.
let clips = 0;
function rod(name, F, from, to, r, stroke, style = {}, opts = {}) {
  const id = `mc-clip-${clips++}`;
  const R0 = G.rodOut(F, from, to, r, P, { stroke });
  const svg = `<clipPath id="${id}"><path data-hold="" d="${R0.clip}"/></clipPath><g clip-path="url(#${id})">${S(R0.paths, { tone: "mid", ...style })}</g>`;
  const shape = R.solid(A.slide(F, from, to, r, { name }));
  return put(name, G.add3(F.o, G.mul3(F.a, (from + to) / 2)), svg, [shape], opts);
}

// A recess in the face y = const, after the desk computer's screen: inner walls
// shaded by facing, a back plane holding `back`, clipped to the opening.
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "mc-glass") {
  const id = `mc-clip-${clips++}`;
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

// ---------------------------------------------------------------- floor and bed
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BED, -2), FLOOR, 2, P)}"/>`, `<path class="iso-halo" d="${k.haloOf({ x: 16, y: -54, w: 22, d: 16, r: 3 }, FLOOR, 1, P)}" style="opacity:.6"/>`];
for (const x of [-138, -66, 14, 104]) for (const y of [-16, 16]) {
  post("stand.foot", x, y, 3.2, FLOOR, FLOOR + 1.2, { tone: "lo" }, { steps: 6 });
  post("stand.jack", x, y, 1.4, FLOOR + 1.2, 0, { tone: "mid", crease: "none" }, { steps: 16 });
}
{
  const fy = BED.y + BED.d;
  // panels on the operator side: three doors with closed vent slots, a label plate
  const seams = [-62, 18].map((x) => k.segment([x, fy, 0], [x, fy, BED_TOP], P)).join("");
  const slots = [];
  for (const [x0, x1] of [[-130, -78], [-50, 6], [30, 98]]) for (const z of [8, 11, 14]) slots.push(k.pathOf(k.roundedPlan({ x: x0, y: z, w: x1 - x0 - 30, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u + 15, fy, w])), true));
  const screws = [-140, -68, -56, 12, 24, 108].flatMap((x) => [[x, fy, 3], [x, fy, BED_TOP - 3]]);
  const label = [[-36, fy, 27], [-14, fy, 27], [-14, fy, 20], [-36, fy, 20]];
  const extra =
    `<path class="mc-card" d="${k.pathOf(label.map(at), true)}"/>` +
    L([25.4, 23.6, 21.8].map((z, i) => k.segment([-34.4, fy, z], [-34.4 + [17, 11, 14][i], fy, z], P)).join(""), { tone: "lo", free: true }) +
    Dt(screws.map(at), { size: 0.42 });
  box("bed.frame", BED, 0, BED_TOP, { tone: "mid" }, {
    steps: 3,
    bevel: 0.7,
    inner: L(seams + slots.join("") + k.sideSeam(BED, 4.5, P, 3), { tone: "lo" }),
    extra:
      extra +
      `<path class="mc-well" d="${k.planOutline(WELL, BED_TOP, P, 3)}"/>` +
      L(k.planOutline(WELL, BED_TOP, P, 3), { tone: "lo" }) +
      L(k.planOutline({ x: 4, y: -18, w: 106, d: 36, r: 1 }, BED_TOP, P, 3), { tone: "faint" }),
  });
}

// ---------------------------------------------------------------- clamp unit
// rails for the moving platen, from the rear platen to the fixed platen
for (const y0 of [-15.5, 12.5]) box("clamp.rail", { x: REAR[1], y: y0, w: FIXED_PL[0] - REAR[1], d: 3, r: 0.3 }, BED_TOP, RAIL_TOP, { tone: "mid", crease: "lo" }, { steps: 2 });
{
  const plan = { x: REAR[0], y: -PL_Y, w: REAR[1] - REAR[0], d: 2 * PL_Y, r: 0.8 };
  box("clamp.rear", plan, BED_TOP, PL_TOP, { tone: "mid" }, { steps: 2, bevel: 0.6, extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }) });
  // the clamp cylinder behind it, with its end cap and four tie rods' nuts
  const FCyl = frameNX([REAR[0], 0, ZC]);
  turned("clamp.cylinder", FCyl, [[0, 14], [9, 14], [9, 14.6], [11, 14.6], [11, 14], [18, 14], [18, 15], [22, 15], [23, 13.4]], { tone: "mid" });
}
{
  const plan = { x: FIXED_PL[0], y: -PL_Y, w: FIXED_PL[1] - FIXED_PL[0], d: 2 * PL_Y, r: 0.8 };
  box("clamp.fixed", plan, BED_TOP, PL_TOP, { tone: "mid" }, { steps: 2, bevel: 0.6, extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }) });
  // tie-bar nuts on the injection side
  for (const [y, z] of BARS) discAt("clamp.nut", frameX([FIXED_PL[1], y, z]), 0, 3, 4.2, { tone: "mid" }, { steps: 6, extra: Dt([at([FIXED_PL[1] + 3, y, z])], { size: 0.45, tone: "hi" }) });
  // locating ring round the sprue bushing
  discAt("clamp.ring", frameX([FIXED_PL[1], 0, ZC]), 0, 1, 7, { tone: "mid" }, { inner: L(G.circleOf(frameX([FIXED_PL[1], 0, ZC]), 1, 3.2, P, 36), { tone: "lo" }) });
}
{
  // the moving platen, built closed
  const plan = { x: MOVING[0], y: -PL_Y, w: MOVING[1] - MOVING[0], d: 2 * PL_Y, r: 0.8 };
  box("platen.moving", plan, RAIL_TOP, PL_TOP, { tone: "mid" }, {
    piece: "platen",
    steps: 2,
    bevel: 0.6,
    inner: L(k.sideSeam(plan, RAIL_TOP + 4, P, 2), { tone: "faint" }),
    extra: Dt(k.corners(plan, 2).map(([x, y]) => at([x, y, PL_TOP])), { size: 0.45 }),
  });
  // the moving mould half, with the two cores on its parting face
  const mplan = { x: MOULD_M[0], y: -MOULD.y, w: MOULD_M[1] - MOULD_M[0], d: 2 * MOULD.y, r: 0.5 };
  const FF = (y) => frameX([MOULD_M[1], y, ZC]);
  const cores =
    CAPS.map((y) => `<path class="mc-well" d="${G.circleOf(FF(y), 0, CAP_R, P, 40)}"/>`).join("") +
    L(CAPS.map((y) => G.circleOf(FF(y), 0, CAP_R, P, 40) + G.circleOf(FF(y), 0, CAP_R - 1.6, P, 32)).join(""), { tone: "lo" }) +
    L(k.segment([MOULD_M[1], CAPS[0] + CAP_R, ZC], [MOULD_M[1], CAPS[1] - CAP_R, ZC], P), { tone: "lo" }) +
    Dt([[MOULD_M[1], -9.5, 47], [MOULD_M[1], 9.5, 47], [MOULD_M[1], -9.5, 67], [MOULD_M[1], 9.5, 67]].map(at), { size: 0.5, tone: "hi" });
  box("platen.mould", mplan, MOULD.z0, MOULD.z1, { tone: "mid" }, {
    piece: "platen",
    steps: 2,
    bevel: 0.4,
    inner: L(k.sideSeam(mplan, 52, P, 2), { tone: "faint" }),
    extra: cores,
  });
  // cooling-water couplings on top of the moving half
  for (const y of [-6, 6]) post("platen.coupling", -36, y, 1.3, MOULD.z1, MOULD.z1 + 2.6, { tone: "mid" }, { piece: "platen", steps: 6, extra: Dt([at([-36, y, MOULD.z1 + 2.6])], { size: 0.4, tone: "hi" }) });
}
{
  // the fixed mould half on the fixed platen
  const plan = { x: MOULD_F[0], y: -MOULD.y, w: MOULD_F[1] - MOULD_F[0], d: 2 * MOULD.y, r: 0.5 };
  box("mould.fixed", plan, MOULD.z0, MOULD.z1, { tone: "mid" }, {
    steps: 2,
    bevel: 0.4,
    inner: L(k.sideSeam(plan, 62, P, 2), { tone: "faint" }),
    extra: Dt([[-26, MOULD.y, 66], [-22, MOULD.y, 66], [-26, MOULD.y, 48], [-22, MOULD.y, 48]].map(at), { size: 0.42 }),
  });
  for (const y of [-6, 6]) post("mould.coupling", -24, y, 1.3, MOULD.z1, MOULD.z1 + 2.6, { tone: "mid" }, { steps: 6, extra: Dt([at([-24, y, MOULD.z1 + 2.6])], { size: 0.4, tone: "hi" }) });
}
// tie bars: each is two rods, one through the rear platen and one into the
// fixed platen, both ending on the moving platen, and the clamp ram
for (const [y, z] of BARS) {
  rod("clamp.bar-rear", frameX([REAR[1], y, z]), 0, MOVING[0] - REAR[1], BAR_R, OPEN, { tone: "mid" }, { piece: "platen" });
  rod(y > 0 ? "clamp.bar-near" : "clamp.bar-far", frameNX([FIXED_PL[0], y, z]), 0, FIXED_PL[0] - MOVING[1], BAR_R, OPEN, { tone: "mid" }, { piece: "platen" });
}
rod("clamp.ram", frameX([REAR[1], 0, ZC]), 1.6, MOVING[0] - REAR[1], 6, OPEN, { tone: "hi", crease: "lo" }, { piece: "platen" });
discAt("clamp.gland", frameX([REAR[1], 0, ZC]), 0, 1.6, 8.2, { tone: "mid" }, {});

// ---------------------------------------------------------------- injection unit
const BASE = { x: 2, y: -14, w: 110, d: 28, r: 0.8 };
const BASE_TOP = 42;
box("inj.base", BASE, BED_TOP, BASE_TOP, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(BASE, 38, P, 2), { tone: "faint" }) });
{
  // nozzle, barrel with four heater bands, barrel saddle
  const FB = frameX([FIXED_PL[1] + 1, 0, ZC]);
  turned("inj.nozzle", FB, [[0, 1.6], [2.5, 2.6], [7, 3.6], [8.6, 4.6], [10, 4.6]], { tone: "mid" });
  const prof = [[10, 6.2]];
  let s = 10;
  for (let band = 0; band < 4; band++) {
    prof.push([s + 4, 6.2], [s + 4, 7.6], [s + 11, 7.6], [s + 11, 6.2]);
    s += 13;
  }
  prof.push([62 - FB.o[0], 6.2]);
  turned("inj.barrel", FB, prof, { tone: "hi", crease: "lo" }, {});
  // terminal blocks on the heater bands
  for (let band = 0; band < 4; band++) {
    const x = FB.o[0] + 10 + 13 * band + 7.5;
    box("inj.heater-box", { x: x - 1.6, y: -1.4, w: 3.2, d: 2.8, r: 0.3 }, ZC + 7.4, ZC + 9.6, { tone: "mid" }, { steps: 2, extra: Dt([at([x, 0, ZC + 9.6])], { size: 0.4, tone: "hi" }) });
  }
  box("inj.saddle", { x: 43, y: -1.2, w: 4.4, d: 2.4, r: 0.3 }, BASE_TOP, ZC - 6.2, { tone: "mid" }, { steps: 2 });
}
{
  // feed throat block and hopper
  const throat = { x: 62, y: -9, w: 12, d: 18, r: 0.6 };
  box("inj.throat", throat, BASE_TOP, 68, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(throat, 64, P, 2), { tone: "faint" }), extra: Dt(k.corners(throat, 1.6).map(([x, y]) => at([x, y, 68])), { size: 0.42 }) });
  post("inj.hopper-neck", 68, 0, 3.4, 68, 72, { tone: "mid" }, { steps: 24 });
  const FH = frameZ([68, 0, 72]);
  turned("inj.hopper", FH, [[0, 3.4], [9, 11.2], [22, 11.2]], { tone: "mid" }, { inner: k.fadedSvg(G.ribsOf(FH, 9.6, 21.4, 11.2, 18, P, { fade: [0.04, 0.4], seams: true }), { tone: "faint" }) });
  discAt("inj.hopper-lid", FH, 22, 23.6, 11.8, { tone: "mid" }, { extra: Dt([at([68, 0, 72 + 23.6])], { size: 0.5, tone: "hi" }) });
}
// linear rails and the injection drive on them, built dosed back (screw retracted)
for (const y0 of [-10.5, 7.5]) box("inj.rail", { x: 76, y: y0, w: 34, d: 3, r: 0.3 }, BASE_TOP, BASE_TOP + 1.6, { tone: "mid", crease: "lo" }, { steps: 2 });
const DRIVE = { x: 83, y: -12, w: 20, d: 24, r: 0.8 };
rod("screw.shank", frameX([74, 0, ZC]), 0.8, DRIVE.x - 74, 2.6, STROKE, { tone: "hi", crease: "lo" }, { piece: "screw" });
discAt("inj.seal", frameX([74, 0, ZC]), 0, 0.8, 4, { tone: "mid" }, {});
{
  box("screw.drive", DRIVE, BASE_TOP + 1.6, 70, { tone: "mid" }, {
    piece: "screw",
    steps: 2,
    bevel: 0.6,
    inner: L(k.sideSeam(DRIVE, 50, P, 2), { tone: "faint" }),
    extra: Dt(k.corners(DRIVE, 1.8).map(([x, y]) => at([x, y, 70])), { size: 0.42 }),
  });
  // servo motor standing on the drive, with fins and a cap
  const FM = frameZ([96, 0, 70]);
  turned("screw.motor", FM, [[0, 6.6], [15, 6.6]], { tone: "mid" }, { piece: "screw", inner: k.fadedSvg(G.ribsOf(FM, 0.6, 14.4, 6.6, 20, P, { fade: [0.04, 0.42], seams: true }), { tone: "lo" }) });
  discAt("screw.motor-cap", FM, 15, 17, 5.2, { tone: "mid" }, { piece: "screw", extra: Dt([at([96, 0, 87])], { size: 0.45, tone: "hi" }) });
  // pointer on the drive reading the screw position off the ruler
  box("screw.pointer-arm", { x: 83.6, y: 12, w: 1.6, d: 3.6, r: 0.2 }, BASE_TOP + 0.3, BASE_TOP + 1.6, { tone: "mid", crease: "lo" }, { piece: "screw", steps: 1 });
  box("screw.pointer", { x: 83.6, y: 14.8, w: 1.6, d: 0.8, r: 0.1 }, 40.4, BASE_TOP + 0.3, { tone: "hi", crease: "lo" }, { piece: "screw", steps: 1 });
}
{
  // the stroke ruler on the base's operator side; ticks hang from its top edge
  const ruler = { x: 72, y: 14, w: 22, d: 0.6, r: 0.1 };
  const ticks = [];
  for (let i = 0; i <= 20; i++) {
    const x = 73 + i;
    const long = i % 5 === 0;
    ticks.push(k.segment([x, 14.6, 40], [x, 14.6, 40 - (long ? 2.2 : 1.2)], P));
  }
  box("inj.ruler", ruler, 36, 40, { tone: "mid" }, { steps: 1, inner: L(ticks.join(""), { tone: "lo" }) });
}

// ---------------------------------------------------------------- the controller on its pedestal, behind the machine
const SCR = screenLayout();
{
  const foot = { x: 19, y: -53, w: 16, d: 14, r: 1 };
  box("stand.panel-foot", foot, FLOOR, FLOOR + 1.4, { tone: "lo" }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(foot, 2.2).map(([x, y]) => at([x, y, FLOOR + 1.4])), { size: 0.45 }) });
  post("panel.post", PANEL_POST[0], PANEL_POST[1], 2.4, FLOOR + 1.4, PANEL_Z[0] - 5, { tone: "mid" }, { steps: 24 });
  post("panel.collar", PANEL_POST[0], PANEL_POST[1], 3.6, PANEL_Z[0] - 5, PANEL_Z[0], { tone: "mid" }, { steps: 28, bevel: 0.3 });
  const fy = FACE_Y;
  const screen = [
    `<g data-section=""></g>`,
    `<path class="iso-line" data-tone="lo" d="${SCR.axis}"/>`,
    `<path class="iso-line" data-tone="lo" d="${SCR.ticks}"/>`,
    `<g data-bar=""></g>`,
    `<path class="mc-trace" data-trace-platen="" d=""/>`,
    `<path class="mc-trace mc-trace-b" data-trace-screw="" d=""/>`,
    `<path class="iso-line" data-tone="hi" data-cursor="" d=""/>`,
  ].join("");
  const faceBits = [
    recess(WIN, fy, screen),
    Dt([[PANEL.x + 1.4, fy, PANEL_Z[0] + 1.4], [PANEL.x + PANEL.w - 1.4, fy, PANEL_Z[0] + 1.4], [PANEL.x + 1.4, fy, PANEL_Z[1] - 1.4], [PANEL.x + PANEL.w - 1.4, fy, PANEL_Z[1] - 1.4]].map(at), { size: 0.42 }),
  ].join("");
  box("panel.box", PANEL, PANEL_Z[0], PANEL_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.6, extra: faceBits });
  // buttons under the screen: cycle start, stop, and a running lamp
  const FL = (x) => frameY([x, fy, 86.2]);
  discAt("panel.lamp-ring", FL(PANEL.x + 5), 0, 0.6, 1.8, { tone: "mid" }, {});
  discAt("panel.lamp", FL(PANEL.x + 5), 0.6, 1.3, 1.2, { tone: "hi", crease: "none" }, { attrs: ' data-lamp=""' });
  for (const x of [PANEL.x + 11, PANEL.x + 16, PANEL.x + 21]) box("panel.key", { x: x - 1.6, y: fy, w: 3.2, d: 1, r: 0.3 }, 84.8, 87.6, { tone: "mid" }, { steps: 1 });
  const hood = { x: PANEL.x - 1, y: PANEL.y - 0.6, w: PANEL.w + 2, d: PANEL.d + 2.2, r: 0.8 };
  box("panel.hood", hood, PANEL_Z[1], PANEL_Z[1] + 1.4, { tone: "mid" }, { steps: 2, bevel: 0.3 });
}

// The screen's coordinate system: (u, v) = (x, −z) on the plane y = FACE_Y − depth.
// Left: a section through the cap wall. Right: one cycle on a 0–30 s axis,
// a phase bar, the platen trace and the screw trace.
function screenLayout() {
  const T0 = 15.5;
  const T1 = WIN.x1 - 2.2;
  const AX = WIN.z0 + 3.2;
  const tx = (t) => T0 + ((T1 - T0) * t) / 30;
  const ticks = [];
  for (let t = 0; t <= 30; t += 5) ticks.push(`M${tx(t).toFixed(2)} ${(-AX).toFixed(2)}v1.1`);
  return {
    T0, T1, AX, SPAN: 30,
    BAR: [AX + 1.6, AX + 4.0], // z band of the phase bar
    TRACE: [AX + 5.4, WIN.z1 - 1.6], // z band of the traces
    SEC: { x0: WIN.x0 + 1.6, x1: T0 - 2.4, z0: WIN.z0 + 2.2, z1: WIN.z1 - 2.2 },
    axis: `M${T0} ${-AX}H${T1}`,
    ticks: ticks.join(""),
  };
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: STATES });
R.items.sort((a, b) => a.key - b.key);

// The shot (two caps on a runner) is live and not recorded: it sits on the
// moving half's parting face, then the ejectors push it off and it drops into
// the well in the bed. Every recorded part nearer than it in every pose (all
// at larger x or larger y) is drawn after it; everything else before.
const FRONT = /^(mould\.|clamp\.fixed|clamp\.nut|clamp\.ring|clamp\.bar-near|inj\.|screw\.)/;
const BACK = /^(platen\.|clamp\.bar-rear|clamp\.bar-far|clamp\.rear|clamp\.cylinder|clamp\.ram|clamp\.gland|clamp\.rail|bed\.|stand\.(foot|jack))/;
// The near tie bars are nearer than the shot everywhere; any the solver put
// early (they overlap nothing in between) move to just after the last back item.
let lastBack = -1;
R.items.forEach((item, index) => { if (BACK.test(item.name)) lastBack = index; });
{
  const top = R.items[lastBack].key;
  let bump = 0;
  R.items.slice(0, lastBack).forEach((item) => { if (item.name.startsWith("clamp.bar-near")) item.key = top + 0.001 * ++bump; });
  R.items.sort((a, b) => a.key - b.key);
  lastBack = -1;
  R.items.forEach((item, index) => { if (BACK.test(item.name)) lastBack = index; });
}
const cut = lastBack + 1;
{
  const early = R.items.slice(0, cut).filter((item) => FRONT.test(item.name)).map((i) => i.name);
  if (process.env.ORDER) console.log(R.items.map((i, n) => n + " " + i.name).join("\n"));
  console.log(`shot layer at ${cut}; front items drawn before it (must be clear of the shot): ${early.join(", ") || "none"}`);
}
const capSvg = (y) => {
  const F = frameX([MOULD_M[1], y, ZC]);
  return S(G.disc(0, CAP_H, CAP_R, F, P), { tone: "hi", crease: "lo", lit: true }) + L(G.circleOf(F, CAP_H, CAP_R - 1.2, P, 36), { tone: "lo" });
};
const SHOT = (() => {
  const Fs = frameX([MOULD_M[1], 0, ZC]);
  const Fr = G.frameOf([MOULD_M[1] + 1.2, CAPS[0] + CAP_R - 0.2, ZC], Y, X, Zv);
  return [
    S(G.disc(0, CAPS[1] - CAPS[0] - 2 * CAP_R + 0.4, 0.9, Fr, P), { tone: "hi", crease: "lo", lit: true }),
    S(G.disc(1.2, CAP_H + 1.6, 1.2, Fs, P), { tone: "hi", crease: "lo", lit: true }),
    capSvg(CAPS[0]),
    capSvg(CAPS[1]),
  ].join("");
})();
const wellClip = (() => {
  const pts = [];
  for (const [x, y] of k.corners(WELL, 0)) pts.push(at([x, y, BED_TOP]), at([x, y, 140]));
  // convex hull of the well opening and the air column above it
  const hull = (points) => {
    const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
    const upper = [];
    for (const q of p.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
  };
  return k.pathOf(hull(pts), true);
})();
const shotLayer = `<clipPath id="mc-well-clip"><path d="${wellClip}"/></clipPath><g clip-path="url(#mc-well-clip)"><g class="mc-shot" data-shot="" style="opacity:0">${SHOT}</g></g>`;
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
groups.splice(cut, 0, shotLayer);
const body = [...halo, ...groups];

const LABEL_NL =
  "Een spuitgietmachine op een stalen bed. Links de sluiteenheid: een achterplaat met de sluitcilinder, vier trekstangen, de beweegbare plaat met de bewegende matrijshelft en de vaste plaat met de vaste matrijshelft. De matrijs heeft twee holtes voor een dop. Rechts de spuiteenheid: de spuitmond tegen de vaste plaat, de cilinder met vier verwarmingsbanden, de trechter met korrels, en de aandrijving met servomotor die de schroef naar voren duwt en terugdraait, met een slagliniaal. Achter de machine staat de besturing; het scherm toont een doorsnede van de productwand en één cyclus: sluiten, inspuiten, nadruk, koelen, openen en uitwerpen. Na elke cyclus vallen twee doppen met hun aanspuiting in de opening van het bed.";
const LABEL_EN =
  "An injection moulding machine on a steel bed. On the left the clamp unit: a rear platen with the clamp cylinder, four tie bars, the moving platen with the moving mould half and the fixed platen with the fixed mould half. The mould has two cavities for a cap. On the right the injection unit: the nozzle against the fixed platen, the barrel with four heater bands, the hopper with granules, and the drive with a servo motor that pushes the screw forward and turns it back, with a stroke ruler. Behind the machine stands the controller; its screen shows a section through the part wall and one cycle: close, inject, hold, cool, open and eject. After each cycle two caps with their runner drop into the opening in the bed.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#2C6774;--anatomy-lit-shade:#205560;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --mc-hair:rgba(240,233,218,.12);--mc-accent:#5C9FAE;--mc-glass:#081A1E;--mc-well:#06161A;--mc-seg:#2A4A4A;--mc-wall:#7C9289;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --mc-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --mc-hair:rgba(11,41,27,.14);--mc-accent:#276F81;--mc-glass:#E4DCC9;--mc-well:#C9C0AA;--mc-seg:#C2C3B2;--mc-wall:#7D877A;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--mc-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 173px);min-height:240px;padding:26px 4px 143px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--mc-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--mc-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:73px!important;max-width:42%;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:73px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.mc-line{display:block;white-space:nowrap}
.mc-acc{color:var(--mc-accent);font-weight:600}
.mc-strong{color:var(--anatomy-strong);font-weight:600}
.mc-mute{color:var(--anatomy-muted)}
.mc-model{position:absolute;left:0;right:0;bottom:0;font-family:var(--mc-sans);font-size:9.5px;line-height:1.3;color:var(--anatomy-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mc-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:ew-resize;border-radius:8px}
.mc-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.mc-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.mc-controls{position:absolute;left:10px;right:10px;bottom:22px;height:44px;display:flex;align-items:center;gap:6px}
.mc-btn{min-width:44px;min-height:44px;height:44px;padding:0 8px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 16px/1 var(--mc-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--mc-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;flex:0 0 auto}
.mc-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.mc-btn:disabled{opacity:.4;cursor:default}
.mc-play svg{width:14px;height:14px;fill:currentColor}
.mc-play [data-icon="pause"]{display:none}
.mc-play[data-on] [data-icon="pause"]{display:block}
.mc-play[data-on] [data-icon="play"]{display:none}
.mc-range{flex:1 1 auto;min-width:0;height:44px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer;touch-action:none}
.mc-range:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px;border-radius:8px}
.mc-range::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:var(--mc-seg)}
.mc-range::-moz-range-track{height:4px;border-radius:2px;background:var(--mc-seg)}
.mc-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;margin-top:-9px;border-radius:50%;background:var(--anatomy-card);box-shadow:inset 0 0 0 2px var(--mc-accent)}
.mc-range::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:50%;background:var(--anatomy-card);box-shadow:inset 0 0 0 2px var(--mc-accent)}
.mc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mc-glass{fill:var(--mc-glass);stroke:none}
.mc-well{fill:var(--mc-well);stroke:none}
.mc-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mc-seg{fill:var(--mc-seg);stroke:none}
.mc-seg[data-cool]{fill:var(--mc-accent)}
.mc-sep{fill:none;stroke:var(--mc-glass);stroke-width:.35px}
.mc-wall{fill:var(--mc-wall);stroke:none}
.mc-wall[data-hot]{fill:var(--mc-accent)}
.mc-trace{fill:none;stroke:var(--anatomy-mid);stroke-width:.55px;stroke-linejoin:round;stroke-linecap:round}
.mc-trace-b{stroke:var(--anatomy-hi);stroke-dasharray:1.2 .8}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .4s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--mc-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const PHASES = ${JSON.stringify(PHASES)};
const FIXED = ${FIXED}, REF_WALL = ${REF_WALL}, REF_COOL = ${REF_COOL}, CAVITIES = ${CAVITIES}, DOSE = ${DOSE};
const WALL = ${JSON.stringify(WALL)};
const OPEN = ${OPEN}, STROKE = ${STROKE}, CAP_H = ${CAP_H};
const SCR = ${JSON.stringify(SCR)};
const WIN = ${JSON.stringify(WIN)};
const SPEED = 2; // one second on screen is two seconds of the machine
const coolOf = ${coolOf.toString()};
const cycleOf = ${cycleOf.toString()};
const perHour = ${perHour.toString()};

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { wall: "wall", cool: "cooling", cycle: "cycle", share: "cooling", cav: "cavities", ph: "/h", dec: ".", names: { close: "close", inject: "inject", hold: "hold", cool: "cool", open: "open", eject: "eject" } }
  : { wall: "wand", cool: "koelen", cycle: "cyclus", share: "koelen", cav: "holtes", ph: "st/u", dec: ",", names: { close: "sluiten", inject: "inspuiten", hold: "nadruk", cool: "koelen", open: "openen", eject: "uitwerpen" } };

const stage = document.querySelector(".mc-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  platen: [...svg.querySelectorAll("[data-platen]")],
  screw: [...svg.querySelectorAll("[data-screw]")],
  shot: q("[data-shot]"), bar: q("[data-bar]"), section: q("[data-section]"), cursor: q("[data-cursor]"),
  tp: q("[data-trace-platen]"), ts: q("[data-trace-screw]"), lamp: q("[data-lamp]"),
};
const lines = [...document.querySelectorAll("[data-readout] .mc-line")];
const range = document.querySelector(".mc-range");
const minus = document.querySelector("[data-step='-1']");
const plus = document.querySelector("[data-step='1']");
const playBtn = document.querySelector(".mc-play");
const announcer = document.querySelector(".mc-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
const f1 = (v) => v.toFixed(1).replace(".", T.dec);
const fmtInt = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, EN ? "," : ".");

// ------------------------------------------------ one cycle as a function of time
function plan(s) {
  let t = 0;
  return PHASES.map(([name, d]) => { const dur = name === "cool" ? coolOf(s) : d; const p = { name, t0: t, dur }; t += dur; return p; });
}
// machine pose at cycle time t: platen opening 0..1, screw forward 0..1, shot
function pose(s, t) {
  const ph = plan(s);
  const [close, inject, hold, cool, open, eject] = ph;
  let gap = 0, fwd = 0, shot = 0, push = 0, fall = 0;
  if (t < close.t0 + close.dur) gap = 1 - ease((t - close.t0) / close.dur);
  else if (t < open.t0) gap = 0;
  else if (t < open.t0 + open.dur) gap = ease((t - open.t0) / open.dur);
  else gap = 1;
  if (t < inject.t0) fwd = 0;
  else if (t < inject.t0 + inject.dur) fwd = ease((t - inject.t0) / inject.dur) * 0.95;
  else if (t < hold.t0 + hold.dur) fwd = 0.95 + 0.05 * ease((t - hold.t0) / hold.dur);
  else if (t < cool.t0 + DOSE) fwd = 1 - ease((t - cool.t0) / DOSE);
  else fwd = 0;
  if (t >= inject.t0) shot = 1;
  if (t >= eject.t0) {
    const u = t - eject.t0;
    push = ease(u / 0.35);
    const tau = Math.max(0, u - 0.35);
    fall = 46 * tau * tau;
    if (fall > 40) shot = 0;
  }
  return { gap, fwd, shot, push, fall, ph };
}

// ------------------------------------------------ the screen
// screen units: u = x in world, v = −z; the time axis maps 0..30 s
const tx = (t) => SCR.T0 + ((SCR.T1 - SCR.T0) * Math.min(t, SCR.SPAN)) / SCR.SPAN;
let shownWall = -1;
function screenStatic(s) {
  const ph = plan(s);
  const [b0, b1] = SCR.BAR;
  let bars = "";
  let seps = "";
  ph.forEach((p) => {
    const x0 = tx(p.t0), x1 = tx(p.t0 + p.dur);
    bars += '<path class="mc-seg"' + (p.name === "cool" ? ' data-cool=""' : "") + ' d="M' + x0.toFixed(2) + " " + (-b1).toFixed(2) + "H" + x1.toFixed(2) + "V" + (-b0).toFixed(2) + "H" + x0.toFixed(2) + 'Z"/>';
    if (p.t0 > 0) seps += "M" + x0.toFixed(2) + " " + (-b1).toFixed(2) + "V" + (-b0).toFixed(2);
  });
  bars += '<path class="mc-sep" d="' + seps + '"/>';
  el.bar.innerHTML = bars;
  // the traces over one whole cycle
  const total = cycleOf(s);
  const [z0, z1] = SCR.TRACE;
  const ptsP = [], ptsS = [];
  for (let i = 0; i <= 240; i++) {
    const t = (total * i) / 240;
    const p = pose(s, t);
    const x = tx(t).toFixed(2);
    ptsP.push(x + " " + (-(z0 + (z1 - z0) * (0.5 + 0.5 * p.gap))).toFixed(2));
    ptsS.push(x + " " + (-(z0 + (z1 - z0) * 0.42 * p.fwd)).toFixed(2));
  }
  el.tp.setAttribute("d", "M" + ptsP.join("L"));
  el.ts.setAttribute("d", "M" + ptsS.join("L"));
  // the section through the wall: a U of plastic, as thick as the wall
  const S = SCR.SEC;
  const w = 1.0 + (s - WALL[0]) * 1.0; // screen units
  const xm = (S.x0 + S.x1) / 2, half = (S.x1 - S.x0) / 2;
  const top = S.z1, bot = S.z0;
  const outer = "M" + (xm - half) + " " + (-top) + "V" + (-bot) + "H" + (xm + half) + "V" + (-top);
  const inner = "H" + (xm + half - w) + "V" + (-(bot + w)) + "H" + (xm - half + w) + "V" + (-top) + "Z";
  el.section.innerHTML = '<path class="mc-wall" data-wall="" d="' + outer + inner + '"/>' +
    '<path class="iso-line" data-tone="lo" d="' + outer + inner + '"/>';
}

// ------------------------------------------------ state
const state = { s: 3, t: 0, playing: !still.matches, clock: 0 };
const AX = axisVector(P, [1, 0, 0]);
function shift(list, dxWorld) {
  const dx = AX[0] * dxWorld, dy = AX[1] * dxWorld;
  const text = dxWorld ? "translate(" + dx.toFixed(2) + " " + dy.toFixed(2) + ")" : "";
  list.forEach((node) => { if (text) node.setAttribute("transform", text); else node.removeAttribute("transform"); holdStill(node, [dx, dy]); });
}
function phaseAt(ph, t) { for (let i = ph.length - 1; i >= 0; i--) if (t >= ph[i].t0) return ph[i]; return ph[0]; }

function readout() {
  const s = state.s, c = coolOf(s), cy = cycleOf(s);
  const ph = plan(s);
  const p = phaseAt(ph, state.t);
  const l1 = T.wall + " " + f1(s) + " mm · " + T.cool + " " + f1(c) + " s";
  const l2 = T.cycle + " " + f1(cy) + " s · " + T.share + " " + Math.round((100 * c) / cy) + " %";
  const l3 = CAVITIES + " " + T.cav + ' · <span class="mc-strong">' + fmtInt(perHour(s)) + " " + T.ph + "</span>";
  const name = T.names[p.name];
  const l4 = (p.name === "cool" ? '<span class="mc-acc">' + name + "</span>" : '<span class="mc-mute">' + name + "</span>") + " " + f1(Math.min(p.dur, state.t - p.t0)) + " / " + f1(p.dur) + " s";
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].innerHTML !== l3) lines[2].innerHTML = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
}
function describe() {
  const s = state.s;
  range.value = s.toFixed(1);
  range.setAttribute("aria-valuetext", f1(s) + " mm, " + T.cool + " " + f1(coolOf(s)) + " s, " + T.cycle + " " + f1(cycleOf(s)) + " s, " + fmtInt(perHour(s)) + " " + T.ph);
  minus.disabled = s <= WALL[0] + 1e-9;
  plus.disabled = s >= WALL[1] - 1e-9;
  if (state.playing) playBtn.setAttribute("data-on", ""); else playBtn.removeAttribute("data-on");
  playBtn.setAttribute("aria-label", state.playing ? playBtn.dataset.pause : playBtn.dataset.play);
}

function draw() {
  const s = state.s;
  if (shownWall !== s) { shownWall = s; screenStatic(s); }
  const p = pose(s, state.t);
  shift(el.platen, -OPEN * p.gap);
  shift(el.screw, -STROKE * p.fwd);
  // the shot rides the platen, is pushed off the face, then drops
  const dx = AX[0] * (-OPEN * p.gap + CAP_H * 0.9 * p.push), dy = AX[1] * (-OPEN * p.gap + CAP_H * 0.9 * p.push);
  const down = axisVector(P, [0, 0, -p.fall]);
  el.shot.setAttribute("transform", "translate(" + (dx + down[0]).toFixed(2) + " " + (dy + down[1]).toFixed(2) + ")");
  el.shot.style.opacity = p.shot ? "1" : "0";
  const c = tx(state.t).toFixed(2);
  el.cursor.setAttribute("d", "M" + c + " " + (-(WIN.z1)).toFixed(2) + "V" + (-SCR.AX).toFixed(2));
  const wall = el.section.querySelector("[data-wall]");
  const ph = phaseAt(p.ph, state.t).name;
  if (wall) { if (ph === "inject" || ph === "hold" || ph === "cool") wall.setAttribute("data-hot", ""); else wall.removeAttribute("data-hot"); }
  if (state.playing || state.t > 0) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  readout();
}

// ------------------------------------------------ idle tour: 3.0 mm, then 2.4, 4.0, 1.5
const TOUR = [3, 2.4, 4, 1.5];
let tourStep = 0, touring = !still.matches, idleTimer = 0;
function setWall(v, { tour = false } = {}) {
  const s = Math.round(clamp(v, WALL[0], WALL[1]) * 10) / 10;
  if (s === state.s) { describe(); return; }
  state.s = s;
  const total = cycleOf(s);
  if (state.t > total) state.t = total;
  describe();
  if (!tour) announcer.textContent = range.getAttribute("aria-valuetext") + ".";
  kick();
}
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; state.playing = true; describe(); run(); } }, 40000);
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (calm) {
    // one still frame: the mould open, the shot still on the cores
    state.t = plan(state.s)[4].t0 + plan(state.s)[4].dur;
  } else if (state.playing) {
    state.t += dt * SPEED;
    const total = cycleOf(state.s);
    if (state.t >= total) {
      state.t -= total;
      if (touring) { tourStep = (tourStep + 1) % TOUR.length; setWall(TOUR[tourStep], { tour: true }); }
    }
  }
  state.clock += dt;
  draw();
  frame = visible && !calm && state.playing ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches || !state.playing) { draw(); } else run(); };

function togglePlay() {
  steer();
  if (still.matches) { state.playing = false; describe(); draw(); return; }
  state.playing = !state.playing;
  describe();
  if (state.playing) run(); else draw();
}

// ------------------------------------------------ controls
range.addEventListener("input", () => { steer(); setWall(Number(range.value)); });
minus.addEventListener("click", () => { steer(); setWall(state.s - 0.1); });
plus.addEventListener("click", () => { steer(); setWall(state.s + 0.1); });
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
  press = { x0: toView(event)[0], start: state.s, dragging: false, id: event.pointerId };
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const dx = toView(event)[0] - press.x0;
  if (!press.dragging && Math.abs(dx) > 6) { press.dragging = true; steer(); try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setWall(press.start + dx / 60);
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
  const step = event.shiftKey ? 0.5 : 0.1;
  let handled = true;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") { steer(); setWall(state.s + step); }
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") { steer(); setWall(state.s - step); }
  else if (event.key === "Home") { steer(); setWall(WALL[0]); }
  else if (event.key === "End") { steer(); setWall(WALL[1]); }
  else if (event.key === " " || event.key === "Enter") togglePlay();
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) tick(performance.now()); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  if (still.matches) { touring = false; state.playing = false; cancelAnimationFrame(frame); frame = 0; describe(); tick(performance.now()); }
  else { touring = true; state.playing = true; describe(); run(); }
});
if (still.matches) state.t = plan(state.s)[4].t0 + plan(state.s)[4].dur;
describe();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Wanddikte en cyclustijd",
    hint: "Kies de wanddikte",
    drag: "tik: pauze · 1 s = 2 s",
    model: "koelen = 12 s × (wand / 3 mm)² · overig 8 s · 2-voudige matrijs",
    play: "Afspelen",
    pause: "Pauze",
    less: "Dunnere wand",
    more: "Dikkere wand",
    range: "Wanddikte in millimeter, 1 tot 4",
    label: LABEL_NL,
    aria: "Spuitgietmachine. Pijl links en rechts maakt de wand 0,1 mm dunner of dikker (Shift: 0,5 mm), Home en End gaan naar 1 en 4 mm, spatie speelt af of pauzeert.",
  },
  en: {
    title: "Wall thickness and cycle time",
    hint: "Set the wall thickness",
    drag: "tap: pause · 1 s = 2 s",
    model: "cooling = 12 s × (wall / 3 mm)² · rest 8 s · 2-cavity mould",
    play: "Play",
    pause: "Pause",
    less: "Thinner wall",
    more: "Thicker wall",
    range: "Wall thickness in millimetres, 1 to 4",
    label: LABEL_EN,
    aria: "Injection moulding machine. Left and right arrows make the wall 0.1 mm thinner or thicker (Shift: 0.5 mm), Home and End go to 1 and 4 mm, Space plays or pauses.",
  },
};

const ICONS = `<svg viewBox="0 0 14 14" aria-hidden="true" data-icon="play"><path d="M3.5 2.2v9.6l8-4.8z"/></svg><svg viewBox="0 0 14 14" aria-hidden="true" data-icon="pause"><path d="M3.2 2.4h2.6v9.2H3.2zM8.2 2.4h2.6v9.2H8.2z"/></svg>`;
const controls = `<div class="mc-controls"><button type="button" class="mc-btn mc-play" data-on="" data-play="${STRINGS.nl.play}" data-pause="${STRINGS.nl.pause}" aria-label="${STRINGS.nl.pause}">${ICONS}</button><button type="button" class="mc-btn" data-step="-1" aria-label="${STRINGS.nl.less}">&minus;</button><input class="mc-range" type="range" min="${WALL[0]}" max="${WALL[1]}" step="0.1" value="3" aria-label="${STRINGS.nl.range}"><button type="button" class="mc-btn" data-step="1" aria-label="${STRINGS.nl.more}">+</button></div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="mc-stage" tabindex="0" role="group" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="mc-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="mc-line"></span>'.repeat(4)}</span><span class="mc-model" data-model>${STRINGS.nl.model}</span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-drag>${STRINGS.nl.drag}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-drag]").textContent=s.drag;
document.querySelector("[data-model]").textContent=s.model;
var p=document.querySelector(".mc-play");p.dataset.play=s.play;p.dataset.pause=s.pause;p.setAttribute("aria-label",s.pause);
document.querySelector("[data-step='-1']").setAttribute("aria-label",s.less);document.querySelector("[data-step='1']").setAttribute("aria-label",s.more);
document.querySelector(".mc-range").setAttribute("aria-label",s.range);
var st=document.querySelector(".mc-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: 3 mm → cycle ${cycleOf(3).toFixed(2)} s, ${perHour(3).toFixed(0)}/h · 2.4 mm → cooling ${coolOf(2.4).toFixed(2)} s, cycle ${cycleOf(2.4).toFixed(2)} s, ${perHour(2.4).toFixed(0)}/h · 1 mm ${cycleOf(1).toFixed(2)} s · 4 mm ${cycleOf(4).toFixed(2)} s`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { frames: STATES, apart: true });
