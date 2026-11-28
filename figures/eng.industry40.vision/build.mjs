// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Machine vision and AI inspection" (module Industry 4.0).
//
//   node figures/eng.industry40.vision/build.mjs            build the page
//   node figures/eng.industry40.vision/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.industry40.vision.html: one offline
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
const OUT = join(ROOT, "src/content/courses/figures/eng.industry40.vision.html");

// ---------------------------------------------------------------- the model
// The camera gives every part a defect score from 0 to 100. Good parts score
// low, defective parts high, and the two distributions overlap:
//   good    ~ N(μg, σg),  defective ~ N(μd, σd)   (defects vary more)
// A part is rejected when its score is above the threshold T.
//   false rejects per 1,000 = 1000 · (1 − p) · P(good score > T)
//   escapes per 1,000       = 1000 · p · P(defect score ≤ T)
// The lesson's case: p = 0.5 % defects, and at the default threshold the system
// catches 99 % of defects and falsely rejects 1 % of good parts, so about
// two-thirds of everything in the reject bin is good. The means are solved so
// that T = 50 is exactly that point.
const Z99 = 2.326347874; // Φ⁻¹(0.99)
const T_LESSON = 50;
const SG = 8;
const SD = 12;
const MG = T_LESSON - Z99 * SG; // 31.39
const MD = T_LESSON + Z99 * SD; // 77.92
const P_DEF = 0.005;
const PER = 1000;
const RANGE = [25, 90];
const DISPLAY_DEF = 1 / 8; // share of defective parts in the drawn stream (for display only)
function erf(x) {
  // Abramowitz and Stegun 7.1.26, |error| < 1.5e-7
  const s = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}
const cdf = (x, m, s) => 0.5 * (1 + erf((x - m) / (s * Math.SQRT2)));
function rates(T) {
  const good = PER * (1 - P_DEF);
  const bad = PER * P_DEF;
  const fr = good * (1 - cdf(T, MG, SG));
  const esc = bad * cdf(T, MD, SD);
  const caught = bad - esc;
  const rej = fr + caught;
  return { fr, esc, caught, rej, goodShare: rej > 0 ? fr / rej : 0, detect: caught / bad, frRate: fr / good };
}
{
  // the lesson's numbers: 0.5 % defects, 99 % detection, 1 % false rejects,
  // about two-thirds of the rejected parts are good
  const r = rates(T_LESSON);
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  if (!near(r.detect, 0.99, 1e-5)) throw new Error(`detection at T=50 is ${r.detect}`);
  if (!near(r.frRate, 0.01, 1e-5)) throw new Error(`false-reject rate at T=50 is ${r.frRate}`);
  if (!near(r.goodShare, 2 / 3, 0.01)) throw new Error(`share of good parts in the rejects is ${r.goodShare}`);
  if (!near(r.fr, 9.95, 0.01) || !near(r.esc, 0.05, 0.001)) throw new Error(`per 1,000: ${r.fr} false rejects, ${r.esc} escapes`);
  // the recall question: 20,000 parts, 0.5 % defects, 1 % false rejects → 199 good parts rejected
  if (Math.round(20000 * (1 - P_DEF) * 0.01) !== 199) throw new Error("recall arithmetic");
  // the trade-off runs both ways across the range
  if (!(rates(RANGE[0]).fr > 400 && rates(RANGE[1]).esc > 2)) throw new Error("range does not show both errors");
}

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, x along the belt (parts travel to +x),
// +y toward the viewer. The floor is z = 0; the belt's top is z = 30.
const WIDTH = 600;
const BELT_Z = 30;
const BELT = { x: -54, y: -10, w: 108, d: 20, r: 0.4 };
const CAM_X = -24;
const PUSH_X = 18;
const PUCK_R = 2.8;
const PUCK_H = 2.4;
const ROD_Z = 31.9;
const PAD_REST = -11; // pad face y at rest (the pusher stands on the far side)
const STROKE = 21.8;
const TOTE_Z = 7;
const TOTE_Z_TOP = TOTE_Z;
const CHUTE = { x0: 12, x1: 24, top: [12.5, BELT_Z], end: [30.5, TOTE_Z_TOP + 0.9] };
const TOTE = { x: 7, y: 30, w: 22, d: 15.5, r: 1 };

const CX = 38; // the controller's pedestal
const BOX = { x: CX - 14, y: -33, w: 28, d: 7, r: 0.8 };
const BOX_Z = [38, 58];
const FACE_Y = BOX.y + BOX.d; // -26, the screen face
const WIN = { x0: CX - 11.4, x1: CX + 11.4, z0: 43.2, z1: 55.8, r: 1.2, depth: 0.8 };
const PLOT = { x0: WIN.x0 + 1.2, x1: WIN.x1 - 1.2, base: WIN.z0 + 1.9, top: WIN.z1 - 1.3 };

const FIT = [
  ...k.boxCorners({ x: -56, y: -36, w: 112, d: 82 }, 0, 0),
  ...k.boxCorners({ x: -27, y: -23, w: 5, d: 52 }, 67.5, 67.5),
  ...k.boxCorners(BOX, BOX_Z[1] + 1.4, BOX_Z[1] + 1.4),
];
const PAD = 10;
const AZIMUTH = Number(process.env.AZ ?? 60);
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
const NY = [0, -1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameZ = (o) => G.frameOf(o, Zv, X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

// ---------------------------------------------------------------- recorder
// One thing moves as a recorded piece: the pusher's rod with its pad.
const MOVES = { push: [0, STROKE, 0] };
const R = A.recorder(P, { order: ["push"], spring: {} });
const STATES = [0, 0.25, 0.5, 0.75, 1].map((share) => ({ label: `push ${share}`, shares: { push: share } }));
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
function prism(name, F, polygon, s0, s1, style = {}, { extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.prism(F, polygon, s0, s1, { name, owner }));
  const svg = S(G.prismOf(F, polygon, s0, s1, P), { tone: "mid", ...style, inner }) + extra;
  const cu = polygon.reduce((s, p) => s + p[0], 0) / polygon.length;
  const cv = polygon.reduce((s, p) => s + p[1], 0) / polygon.length;
  const c = G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.add3(G.mul3(F.u, cu), G.mul3(F.v, cv)));
  return put(name, c, svg, [shape], opts);
}
// A rod sliding through a gland: drawn long, clipped from the gland face on,
// the clip held still while the item moves.
let clips = 0;
function rod(name, F, from, to, r, stroke, style = {}, opts = {}) {
  const id = `vi-clip-${clips++}`;
  const R0 = G.rodOut(F, from, to, r, P, { stroke });
  const svg = `<clipPath id="${id}"><path data-hold="" d="${R0.clip}"/></clipPath><g clip-path="url(#${id})">${S(R0.paths, { tone: "mid", ...style })}</g>`;
  const shape = R.solid(A.slide(F, from, to, r, { name }));
  return put(name, G.add3(F.o, G.mul3(F.a, (from + to) / 2)), svg, [shape], opts);
}
// A stand-in for a live layer: a recorded item with no solids of its own, so
// the settle places the layer among the parts it overlaps.
function slot(name, shape, corners, centre) {
  const hull = k.pathOf(G.hullOf(corners.map(at)), true);
  return R.put({ name, at: centre, svg: `<path class="vi-slot" d="${hull}"/>`, shapes: [shape] });
}

// A recess in the face y = const: inner walls shaded by facing, a back plane
// holding `back`, clipped to the opening.
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "vi-glass") {
  const id = `vi-clip-${clips++}`;
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

// ---------------------------------------------------------------- floor halo
const halo = [
  `<path class="iso-halo" d="${k.haloOf({ x: -56, y: -14, w: 112, d: 28, r: 3 }, 0, 2, P)}"/>`,
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(TOTE, -1.5), 0, 1, P)}" style="opacity:.7"/>`,
  `<path class="iso-halo" d="${k.haloOf({ x: CX - 8, y: -36, w: 16, d: 12, r: 3 }, 0, 1, P)}" style="opacity:.6"/>`,
];

// ---------------------------------------------------------------- conveyor frame
const LEG_X = [-45, 45];
const LEG_Y = [-11.25, 11.25];
for (const x of LEG_X) {
  for (const y of LEG_Y) {
    post("stand.foot", x, y, 1.9, 0, 0.8, { tone: "lo" }, { steps: 24, bevel: 0.2 });
    post("leg.screw", x, y, 0.55, 0.8, 2.2, { tone: "mid", crease: "none" }, { steps: 14 });
    box("leg.tube", { x: x - 1.2, y: y - 1.2, w: 2.4, d: 2.4, r: 0.3 }, 2.2, 24, { tone: "mid" }, {
      steps: 2,
      extra: Dt([at([x + (y > 0 ? 0 : 0), y + 1.2, 21.6])], { size: 0.4 }),
    });
  }
  // cross brace between the two legs at this end
  box("leg.brace-y", { x: x - 0.8, y: -10.05, w: 1.6, d: 20.1, r: 0.2 }, 8, 10, { tone: "lo" }, { steps: 2 });
}
for (const y of LEG_Y) box("leg.brace-x", { x: -43.8, y: y - 0.8, w: 87.6, d: 1.6, r: 0.2 }, 6, 8, { tone: "lo" }, { steps: 2 });
for (const [y0, near] of [[-12.5, false], [10, true]]) {
  const beam = { x: -54, y: y0, w: 108, d: 2.5, r: 0.3 };
  // a seam along the beam's side, and the bolt heads of the leg joints
  const fy = near ? y0 + 2.5 : y0;
  const bolts = LEG_X.flatMap((x) => [[x - 0.6, fy, 25.4], [x + 0.6, fy, 25.4]]);
  box(near ? "conv.beam-near" : "conv.beam-far", beam, 24, BELT_Z, { tone: "mid" }, {
    steps: 2,
    bevel: 0.2,
    inner: L(k.sideSeam(beam, 28.4, P, 2), { tone: "faint" }),
    extra: near ? Dt(bolts.map(at), { size: 0.42 }) : "",
  });
}
for (const x0 of [-55, 54]) box("conv.end", { x: x0, y: -12.5, w: 1, d: 25, r: 0.2 }, 25.2, BELT_Z, { tone: "lo" }, { steps: 2, extra: Dt([at([x0 + (x0 > 0 ? 1 : 0), 11.25, 27.6])], { size: 0.45, tone: "hi" }) });
{
  // the belt, with cross ribs that travel with it (clipped to its top)
  const top = k.pathOf(k.roundedPlan(BELT, 2).map(([x, y]) => at([x, y, BELT_Z])), true);
  const ribs = [];
  for (let x = BELT.x + 4; x <= BELT.x + BELT.w - 8; x += 8) ribs.push(k.segment([x, -10, BELT_Z], [x, 10, BELT_Z], P));
  const extra = `<clipPath id="vi-belt-clip"><path d="${top}"/></clipPath><g clip-path="url(#vi-belt-clip)"><g data-belt="">${L(ribs.join(""), { tone: "faint" })}</g></g>`;
  box("conv.belt", BELT, 28.6, BELT_Z, { tone: "lo" }, { steps: 2, extra });
}
// side guides on the beams, gapped at the pusher and at the chute
const GUIDES = [
  ["guide.far", -11.2, [[-52, PUSH_X - 5], [PUSH_X + 5, 52]]],
  ["guide.near", 10.4, [[-52, CHUTE.x0], [CHUTE.x1, 52]]],
];
for (const [name, y0, runs] of GUIDES) {
  for (const [x0, x1] of runs) {
    const g = { x: x0, y: y0, w: x1 - x0, d: 0.8, r: 0.3 };
    const screws = [];
    for (let x = x0 + 4; x < x1 - 2; x += 12) screws.push(at([x, y0 + 0.4, 33]));
    box(name, g, BELT_Z, 33, { tone: "hi", crease: "lo" }, { steps: 2, extra: Dt(screws, { size: 0.36, tone: "mid" }) });
  }
}
{
  // gearmotor at the drive end, on the near beam
  const gb = { x: 34, y: 12.5, w: 8, d: 5, r: 0.5 };
  box("drive.gearbox", gb, 22, BELT_Z, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: Dt(k.corners({ x: 34, y: 0, w: 8, d: 8 }, 1).map(([x, z]) => at([x, 17.5, z + 22])), { size: 0.4 }) });
  const FM = frameY([38, 17.5, 26]);
  const fins = G.ribsOf(FM, 0.6, 8.4, 3.2, 18, P, { fade: [0.02, 0.4], seams: true });
  discAt("drive.motor", FM, 0, 9, 3.2, { tone: "hi", crease: "lo" }, { inner: k.fadedSvg(fins, { tone: "lo" }) });
  discAt("drive.fan", FM, 9, 10.6, 2.9, { tone: "mid" }, { extra: L(G.circleOf(FM, 10.6, 1.6, P, 24), { tone: "lo" }) + Dt([at([38, 28.1, 26])], { size: 0.45, tone: "hi" }) });
  box("drive.tbox", { x: 36, y: 19.5, w: 4, d: 4, r: 0.4 }, 29.2, 31.6, { tone: "mid" }, { steps: 2, extra: Dt([at([38, 21.5, 31.6])], { size: 0.4 }) });
}
{
  // photo-eye that triggers the camera, and its reflector across the belt
  box("eye.post", { x: -36.6, y: -12.4, w: 1.2, d: 1.2, r: 0.2 }, BELT_Z, 35, { tone: "mid" }, { steps: 2 });
  box("eye.head", { x: -37.6, y: -13.2, w: 3.2, d: 2.4, r: 0.4 }, 35, 37.6, { tone: "mid" }, { steps: 2, bevel: 0.2 });
  discAt("eye.lens", frameY([-36, -10.8, 36.3]), 0, 0.5, 0.75, { tone: "hi", crease: "none" });
  box("eye.reflector", { x: -37.2, y: 11.2, w: 2.4, d: 0.6, r: 0.1 }, 30.6, 32.8, { tone: "hi", crease: "lo" }, { steps: 2 });
}

// ---------------------------------------------------------------- gantry with the camera
for (const [y0, name] of [[-22, "far"], [25, "near"]]) {
  const foot = { x: -28, y: y0 - 2.5, w: 8, d: 8, r: 0.6 };
  box(`stand.gantry-${name}`, foot, 0, 1.2, { tone: "lo" }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(foot, 1.2).map(([x, y]) => at([x, y, 1.2])), { size: 0.45 }) });
  const col = { x: CAM_X - 1.5, y: y0, w: 3, d: 3, r: 0.3 };
  box(`gantry.post-${name}`, col, 1.2, 64, { tone: "mid" }, { steps: 2, inner: L(k.sideSeam(col, 60.5, P, 2), { tone: "faint" }) });
}
{
  const beam = { x: CAM_X - 2, y: -22, w: 4, d: 50, r: 0.4 };
  box("gantry.beam", beam, 64, 67.5, { tone: "mid" }, {
    steps: 2,
    bevel: 0.3,
    extra: L(k.planOutline(k.insetPlan(beam, 0.8), 67.5, P, 2), { tone: "faint" }) + Dt([-20.5, 26.5].map((y) => at([CAM_X, y, 67.5])), { size: 0.45 }),
  });
  box("cam.mount", { x: CAM_X - 3, y: -3, w: 6, d: 6, r: 0.4 }, 62, 64, { tone: "lo" }, { steps: 2 });
  const body = { x: CAM_X - 3.6, y: -3.6, w: 7.2, d: 7.2, r: 0.7 };
  box("cam.body", body, 52, 62, { tone: "hi", crease: "lo" }, {
    steps: 3,
    bevel: 0.3,
    inner: L(k.sideSeam(body, 54.4, P, 3), { tone: "faint" }),
    extra: Dt([at([CAM_X + 2.2, 3.6, 60.4])], { size: 0.5, tone: "mid" }),
  });
  // the connector on the camera's near face
  discAt("cam.plug", frameY([CAM_X - 1, 3.6, 59]), 0, 1.4, 0.9, { tone: "mid" });
  post("cam.lens", CAM_X, 0, 2.3, 48, 52, { tone: "mid" }, { steps: 32, inner: L(k.sideArc(CAM_X, 0, 2.3, 50.4, P, 20), { tone: "faint" }) });
  // the ring light: a lit annulus; its LEDs are dots on the side band
  const FR = frameZ([CAM_X, 0, 0]);
  post("cam.ring", CAM_X, 0, 5.6, 46, 48, { tone: "mid" }, {
    steps: 48,
    attrs: ' data-ring=""',
    extra: Dt(G.dotsOf(FR, 47, 5.6, 28, P, { fade: [0.05, 0.4] }), { size: 0.36, tone: "hi" }),
  });
}

// ---------------------------------------------------------------- the reject pusher (far side, kicks toward the viewer)
{
  box("push.bracket", { x: PUSH_X - 4, y: -18.5, w: 8, d: 6, r: 0.3 }, 24.6, 29.4, { tone: "lo" }, {
    steps: 2,
    extra: Dt([[PUSH_X + 4, -16.6, 27], [PUSH_X + 4, -14.4, 27]].map(at), { size: 0.42 }),
  });
  const FB = frameY([PUSH_X, 0, ROD_Z]);
  const square = [[-2.5, -2.5], [2.5, -2.5], [2.5, 2.5], [-2.5, 2.5]];
  prism("push.cap-front", FB, square, -17.2, -15.8, { tone: "mid" }, { extra: Dt([[PUSH_X + 2.5, -16.5, ROD_Z + 1.8], [PUSH_X + 2.5, -16.5, ROD_Z - 1.8]].map(at), { size: 0.36 }) });
  discAt("push.barrel", FB, -28.8, -17.2, 2.05, { tone: "hi", crease: "lo" }, { inner: L(G.arcOf(FB, -23, 2.05, P), { tone: "faint" }) });
  prism("push.cap-rear", FB, square, -30.2, -28.8, { tone: "mid" }, { extra: Dt([[PUSH_X + 2.5, -29.5, ROD_Z + 1.8], [PUSH_X + 2.5, -29.5, ROD_Z - 1.8]].map(at), { size: 0.36 }) });
  post("push.port-a", PUSH_X, -16.5, 0.55, ROD_Z + 2.5, ROD_Z + 3.7, { tone: "mid" }, { steps: 12, extra: Dt([at([PUSH_X, -16.5, ROD_Z + 3.7])], { size: 0.4, tone: "hi" }) });
  post("push.port-b", PUSH_X, -29.5, 0.55, ROD_Z + 2.5, ROD_Z + 3.7, { tone: "mid" }, { steps: 12, extra: Dt([at([PUSH_X, -29.5, ROD_Z + 3.7])], { size: 0.4, tone: "hi" }) });
  // the rod and its pad, the one moving piece
  const FR = G.frameOf([PUSH_X, 0, ROD_Z], Y, X, Zv);
  rod("push.rod", FR, -15.8, -11.6, 0.6, STROKE, { tone: "hi", crease: "none" }, { piece: "push" });
  discAt("push.pad", FR, -11.6, -11.0, 1.7, { tone: "mid" }, { piece: "push" });
}

// ---------------------------------------------------------------- reject chute and bin
const SLOPE = (() => {
  const [y0, z0] = CHUTE.top;
  const [y1, z1] = CHUTE.end;
  const len = Math.hypot(y1 - y0, z1 - z0);
  const d = [0, (y1 - y0) / len, (z1 - z0) / len];
  const n = d[1] > 0 ? [0, -d[2], d[1]] : [0, d[2], -d[1]]; // the chute's upward normal
  return { len, d, n };
})();
{
  const FC = frameX([0, 0, 0]);
  const [y0, z0] = CHUTE.top;
  const [y1, z1] = CHUTE.end;
  const plate = [[y0, z0], [y0, z0 - 0.9], [y1, z1 - 0.9], [y1, z1]];
  prism("chute.plate", FC, plate, CHUTE.x0, CHUTE.x1, { tone: "hi", crease: "lo" });
  const lip = [[y0, z0 + 2.2], [y0, z0 - 0.9], [y1, z1 - 0.9], [y1, z1 + 2.2]];
  prism("chute.lip", FC, lip, CHUTE.x0 - 0.8, CHUTE.x0, { tone: "mid" });
  prism("chute.lip", FC, lip, CHUTE.x1, CHUTE.x1 + 0.8, { tone: "mid" });
}
let toteItem = null;
{
  // a stacking tote: walls 1 thick, the opening dark, inner walls by facing
  const inner = k.insetPlan(TOTE, 1);
  const V = G.viewOf(P);
  const walls = [];
  const ring = k.roundedPlan(inner, 3);
  const cx = inner.x + inner.w / 2;
  const cy = inner.y + inner.d / 2;
  const sh = [[], [], [], []];
  ring.forEach(([ax, ay], index) => {
    const [bx, by] = ring[(index + 1) % ring.length];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    let [nx, ny] = [(by - ay) / len, -(bx - ax) / len];
    if (nx * (cx - (ax + bx) / 2) + ny * (cy - (ay + by) / 2) < 0) [nx, ny] = [-nx, -ny];
    if (nx * V[0] + ny * V[1] <= 0) return;
    const tone = G.toneOf([nx, ny, 0], P);
    sh[Math.min(3, tone)].push(k.pathOf([at([ax, ay, TOTE_Z]), at([bx, by, TOTE_Z]), at([bx, by, 1]), at([ax, ay, 1])], true));
  });
  const opening = k.planOutline(inner, TOTE_Z, P, 3);
  walls.push(`<clipPath id="vi-tote-clip"><path d="${opening}"/></clipPath>`);
  walls.push(`<path class="vi-well" d="${opening}"/>`);
  walls.push(`<g clip-path="url(#vi-tote-clip)"><path class="vi-well" d="${k.planOutline(inner, 1, P, 3)}"/>${sh.map((d, s) => (d.length ? `<path class="iso-shade" data-shade="${s}" d="${d.join("")}"/>` : "")).join("")}</g>`);
  walls.push(L(opening, { tone: "lo" }));
  // label card on the near face, and two hand slots
  const fy = TOTE.y + TOTE.d;
  const card = `<g transform="${planeOf(fy)}"><path class="vi-card" d="${flatRect(10, 1.6, 18, 5.4, 0.4, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M11.2 -4.5H16.4M11.2 -3.5H14.6M11.2 -2.5H15.6"/></g>`;
  const slots = [];
  for (const x0 of [21.5]) slots.push(k.pathOf(k.roundedPlan({ x: x0, y: 3, w: 3.6, d: 1.3, r: 0.6 }, 3).map(([u, w]) => at([u, fy, w])), true));
  toteItem = box("stand.tote", TOTE, 0, TOTE_Z, { tone: "mid" }, {
    steps: 3,
    bevel: 0.3,
    inner: L(k.sideSeam(TOTE, 2.2, P, 3), { tone: "faint" }),
    extra: walls.join("") + card + `<path class="vi-well" d="${slots.join("")}"/>` + L(slots.join(""), { tone: "lo" }),
  });
}

// ---------------------------------------------------------------- the camera controller on its pedestal
{
  const foot = { x: CX - 7, y: -35, w: 14, d: 10, r: 1 };
  box("stand.ctrl-foot", foot, 0, 1.2, { tone: "lo" }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(foot, 1.8).map(([x, y]) => at([x, y, 1.2])), { size: 0.45 }) });
  post("ctrl.post", CX, -30, 1.8, 1.2, 36, { tone: "mid" }, { steps: 24, inner: L(k.sideArc(CX, -30, 1.8, 6, P, 16), { tone: "faint" }) });
  post("ctrl.collar", CX, -30, 2.8, 36, BOX_Z[0], { tone: "mid" }, { steps: 28, bevel: 0.3 });
  const fy = FACE_Y;
  const screen = [
    `<g data-plot="">`,
    `<path class="vi-area-fr" data-fr="" d=""/>`,
    `<path class="vi-area-esc" data-esc="" d=""/>`,
    `<path class="vi-good" d="${curvePath(MG, SG)}"/>`,
    `<path class="vi-bad" d="${curvePath(MD, SD)}"/>`,
    `<path class="iso-line" data-tone="lo" d="M${WIN.x0} ${(-PLOT.base).toFixed(2)}H${WIN.x1}"/>`,
    `<path class="iso-line" data-tone="lo" d="${[0, 25, 50, 75, 100].map((s) => `M${plotX(s).toFixed(2)} ${(-PLOT.base).toFixed(2)}v0.9`).join("")}"/>`,
    `<g data-scores=""></g>`,
    `<path class="vi-thresh" data-thresh="" d=""/>`,
    `</g>`,
  ].join("");
  const label = { x0: CX - 11, x1: CX + 1, z0: 39.4, z1: 42 };
  const faceBits = [
    recess(WIN, fy, screen),
    `<g transform="${planeOf(fy)}">`,
    `<path class="vi-card" d="${flatRect(label.x0, label.z0, label.x1, label.z1, 0.4, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M${CX - 9.8} ${-41.1}H${CX - 2}M${CX - 9.8} ${-40.2}H${CX - 4.6}"/>`,
    `</g>`,
    Dt([[BOX.x + 1.2, fy, BOX_Z[0] + 1.2], [BOX.x + BOX.w - 1.2, fy, BOX_Z[0] + 1.2], [BOX.x + 1.2, fy, BOX_Z[1] - 1.2], [BOX.x + BOX.w - 1.2, fy, BOX_Z[1] - 1.2]].map(at), { size: 0.42 }),
  ].join("");
  box("ctrl.box", BOX, BOX_Z[0], BOX_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.6, extra: faceBits });
  discAt("ctrl.lamp-ring", frameY([CX + 6, fy, 40.7]), 0, 0.6, 1.5, { tone: "mid" });
  discAt("ctrl.lamp", frameY([CX + 6, fy, 40.7]), 0.6, 1.2, 1.0, { tone: "hi", crease: "none" }, { attrs: ' data-lamp=""' });
  discAt("ctrl.key", frameY([CX + 10.4, fy, 40.7]), 0, 1.3, 1.4, { tone: "mid" }, { extra: L(k.segment([CX + 10.4, fy + 1.3, 39.8], [CX + 10.4, fy + 1.3, 41.6], P), { tone: "lo" }) });
  const hood = { x: BOX.x - 1, y: BOX.y - 0.6, w: BOX.w + 2, d: BOX.d + 2.2, r: 0.8 };
  box("ctrl.hood", hood, BOX_Z[1], BOX_Z[1] + 1.4, { tone: "mid" }, { steps: 2, bevel: 0.3 });
  // cable gland under the box
  post("ctrl.gland", CX + 8, -29.5, 1, BOX_Z[0] - 1.6, BOX_Z[0], { tone: "mid" }, { steps: 6 });
}
function plotX(score) {
  return PLOT.x0 + ((PLOT.x1 - PLOT.x0) * score) / 100;
}
function curvePath(m, s) {
  const pts = [];
  for (let score = 0; score <= 100; score += 1) {
    const h = Math.exp(-0.5 * ((score - m) / s) ** 2);
    pts.push([plotX(score), -(PLOT.base + (PLOT.top - PLOT.base) * h)]);
  }
  return "M" + pts.map(([u, v]) => u.toFixed(2) + " " + v.toFixed(2)).join("L");
}

// ---------------------------------------------------------------- live layers
// Three places the moving parts are drawn: on the belt, sliding down the chute,
// and lying in the tote. Each is a stand-in recorded item, so the settle puts
// the layer in true depth order among the solids.
const beltSlot = (() => {
  const plan = { x: -54, y: -9.6, w: 108, d: 19.2, r: 0 };
  return slot("live.belt", A.slab(plan, BELT_Z + 0.05, PUCK_H, { name: "live.belt" }, 2), k.boxCorners(plan, BELT_Z + 0.05, BELT_Z + PUCK_H), [0, 0, BELT_Z + 1.2]);
})();
const chuteSlot = (() => {
  const mid = [(CHUTE.x0 + CHUTE.x1) / 2, (CHUTE.top[0] + CHUTE.end[0]) / 2, (CHUTE.top[1] + CHUTE.end[1]) / 2];
  const centre = G.add3(mid, G.mul3(SLOPE.n, 1.4));
  const half = [5.4, SLOPE.len / 2 - 2.6, 1.2];
  const axes = [X, SLOPE.d, SLOPE.n];
  const corners = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) corners.push([0, 1, 2].reduce((p, i) => G.add3(p, G.mul3(axes[i], [a, b, c][i] * half[i])), centre));
  return slot("live.chute", A.orientedBox(centre, axes, half, { name: "live.chute" }), corners, centre);
})();

A.settle(R, P, { states: STATES });
R.items.sort((a, b) => a.key - b.key);
if (process.env.ORDER) console.log(R.items.map((i, n) => n + " " + i.name + " " + i.key.toFixed(2)).join("\n"));

// the drawn puck: a machined bushing with a bore; a defect is a dark nick
function puckSvg(F, bad) {
  const top = S(G.disc(0, PUCK_H, PUCK_R, F, P), { tone: "hi", crease: "lo" });
  const bore = G.circleOf(F, PUCK_H, 1.05, P, 24);
  const chamfer = G.circleOf(F, PUCK_H, 2.2, P, 32);
  const nick = bad
    ? (() => {
        const pts = [[-2.35, 0.2], [-0.5, 2.2], [-0.05, 1.85], [-1.95, -0.2]].map(([u, v]) => k.iso(G.add3(G.add3(F.o, G.mul3(F.a, PUCK_H)), G.add3(G.mul3(F.u, u), G.mul3(F.v, v))), P));
        return `<path class="vi-nick" d="${k.pathOf(pts, true)}"/>`;
      })()
    : "";
  return top + L(chamfer, { tone: "faint" }) + `<path class="vi-well" d="${bore}"/>` + L(bore, { tone: "lo" }) + nick;
}
const ORIGIN = at([0, 0, 0]);
const rel = (svg) => `<g transform="translate(${(-ORIGIN[0]).toFixed(2)} ${(-ORIGIN[1]).toFixed(2)})">${svg}</g>`;
const PUCK = {
  flat: [false, true].map((bad) => rel(puckSvg(frameZ([0, 0, 0]), bad))),
  tilt: [false, true].map((bad) => rel(puckSvg(G.frameOf([0, 0, 0], SLOPE.n, X, G.cross3(SLOPE.n, X)), bad))),
};
solids -= 4; // the templates are not parts of the drawing

// the light cone under the ring light, drawn over the belt parts when it flashes
const cone = (() => {
  const pts = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    pts.push(at([CAM_X + 5.6 * Math.cos(a), 5.6 * Math.sin(a), 46]));
    pts.push(at([CAM_X + 8.5 * Math.cos(a), 8.5 * Math.sin(a), BELT_Z + 0.1]));
  }
  return k.pathOf(G.hullOf(pts), true);
})();
const spot = k.planOutline({ x: CAM_X - 8.5, y: -8.5, w: 17, d: 17, r: 8.5 }, BELT_Z, P, 12);

const toteClip = (() => {
  const inner = k.insetPlan(TOTE, 1);
  const pts = [];
  for (const [x, y] of k.roundedPlan(inner, 3)) pts.push(at([x, y, TOTE_Z]), at([x, y, 40]));
  return k.pathOf(G.hullOf(pts), true);
})();

const LAYERS = {
  "live.belt": `<g data-layer="belt"></g><path class="vi-spot" data-spot="" d="${spot}" style="opacity:0"/><path class="vi-cone" data-cone="" d="${cone}" style="opacity:0"/>`,
  "live.chute": `<g data-layer="chute"></g>`,
};
const BIN_LAYER = `<clipPath id="vi-bin-clip"><path d="${toteClip}"/></clipPath><g clip-path="url(#vi-bin-clip)"><g data-layer="bin"></g></g>`;
const groups = [];
for (const item of R.items) {
  if (LAYERS[item.name] !== undefined) { groups.push(LAYERS[item.name]); continue; }
  groups.push(`<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
  if (item === toteItem) groups.push(BIN_LAYER);
}
const body = [...halo, ...groups];

const LABEL_NL =
  "Een transportband met onderdelen: bussen met een boring. Boven de band staat een portaal met een camera en een ringlicht; een fotocel voor de camera geeft het startsein. Elk onderdeel krijgt een defectscore. Verderop staat aan de voorkant een pneumatische uitstoter; ligt de score boven de drempel, dan duwt hij het onderdeel van de band, via een goot in een afkeurbak. Goede onderdelen rijden door. Op de besturing achter de band toont een scherm de scoreverdeling van goede en defecte onderdelen, die elkaar overlappen, met de drempel als verticale lijn. Defecte onderdelen hebben een kras.";
const LABEL_EN =
  "A conveyor belt carrying parts: bushings with a bore. A gantry over the belt carries a camera with a ring light; a photo-eye in front of the camera triggers it. Each part gets a defect score. Further on, a pneumatic pusher on the near side kicks any part scoring above the threshold off the belt, down a chute into a reject bin. Good parts ride on. On the controller behind the belt a screen shows the score distributions of good and defective parts, which overlap, with the threshold as a vertical line. Defective parts carry a scratch.";

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
  --vi-hair:rgba(240,233,218,.12);--vi-accent:#5C9FAE;--vi-glass:#081A1E;--vi-well:#06161A;--vi-seg:#2A4A4A;--vi-nick:#0A1E23;--vi-beam:rgba(92,159,174,.22);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --vi-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --vi-hair:rgba(11,41,27,.14);--vi-accent:#276F81;--vi-glass:#E4DCC9;--vi-well:#C9C0AA;--vi-seg:#C2C3B2;--vi-nick:#1E3328;--vi-beam:rgba(39,111,129,.16);
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--vi-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 173px);min-height:240px;padding:26px 4px 143px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--vi-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--vi-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:73px!important;max-width:42%;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:73px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.vi-line{display:block;white-space:nowrap}
.vi-acc{color:var(--vi-accent);font-weight:600}
.vi-strong{color:var(--anatomy-strong);font-weight:600}
.vi-mute{color:var(--anatomy-muted)}
.vi-verdict{position:absolute;left:0;right:0;bottom:0;font-family:var(--vi-sans);font-size:10px;line-height:1.3;color:var(--anatomy-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vi-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent;cursor:ew-resize;border-radius:8px}
.vi-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.vi-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.vi-controls{position:absolute;left:10px;right:10px;bottom:22px;height:44px;display:flex;align-items:center;gap:6px}
.vi-btn{min-width:44px;min-height:44px;height:44px;padding:0 8px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 16px/1 var(--vi-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--vi-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;flex:0 0 auto}
.vi-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.vi-btn:disabled{opacity:.4;cursor:default}
.vi-play svg{width:14px;height:14px;fill:currentColor}
.vi-play [data-icon="pause"]{display:none}
.vi-play[data-on] [data-icon="pause"]{display:block}
.vi-play[data-on] [data-icon="play"]{display:none}
.vi-range{flex:1 1 auto;min-width:0;height:44px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer;touch-action:none}
.vi-range:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px;border-radius:8px}
.vi-range::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:var(--vi-seg)}
.vi-range::-moz-range-track{height:4px;border-radius:2px;background:var(--vi-seg)}
.vi-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;margin-top:-9px;border-radius:50%;background:var(--anatomy-card);box-shadow:inset 0 0 0 2px var(--vi-accent)}
.vi-range::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:50%;background:var(--anatomy-card);box-shadow:inset 0 0 0 2px var(--vi-accent)}
.vi-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.vi-glass{fill:var(--vi-glass);stroke:none}
.vi-well{fill:var(--vi-well);stroke:none}
.vi-nick{fill:var(--vi-nick);stroke:none}
.vi-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.vi-good{fill:none;stroke:var(--anatomy-mid);stroke-width:.5px;stroke-linejoin:round}
.vi-bad{fill:none;stroke:var(--anatomy-hi);stroke-width:.5px;stroke-linejoin:round;stroke-dasharray:1 .6}
.vi-area-fr{fill:var(--vi-accent);opacity:.55;stroke:none}
.vi-area-esc{fill:var(--anatomy-hi);opacity:.4;stroke:none}
.vi-thresh{fill:none;stroke:var(--vi-accent);stroke-width:.7px}
.vi-score{stroke:none}
.vi-score[data-rej]{fill:var(--vi-accent)}
.vi-score:not([data-rej]){fill:var(--anatomy-mid)}
.vi-cone{fill:var(--vi-beam);stroke:none;pointer-events:none}
.vi-spot{fill:var(--vi-beam);stroke:none;pointer-events:none}
[data-ring] .iso-top,[data-ring] .iso-shade,[data-ring] .iso-fill{transition:fill .12s}
[data-ring][data-on] .iso-top,[data-ring][data-on] .iso-shade,[data-ring][data-on] .iso-fill{fill:var(--vi-accent)}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .2s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--vi-accent)}
@media (prefers-reduced-motion:reduce){[data-ring] .iso-top,[data-ring] .iso-shade,[data-ring] .iso-fill,[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const MG = ${MG}, SG = ${SG}, MD = ${MD}, SD = ${SD}, P_DEF = ${P_DEF}, PER = ${PER}, T_LESSON = ${T_LESSON};
const RANGE = ${JSON.stringify(RANGE)};
const DISPLAY_DEF = ${DISPLAY_DEF};
const PLOT = ${JSON.stringify(PLOT)};
const WIN = ${JSON.stringify(WIN)};
const CAM_X = ${CAM_X}, PUSH_X = ${PUSH_X}, PUCK_R = ${PUCK_R}, PAD_REST = ${PAD_REST}, STROKE = ${STROKE}, BELT_Z = ${BELT_Z};
const TOTE_Z = 7;
const TOTE_Z_TOP = TOTE_Z;
const CHUTE = ${JSON.stringify(CHUTE)};
const SLOPE = ${JSON.stringify(SLOPE)};
const TOTE = ${JSON.stringify(TOTE)};
const PUCK = ${JSON.stringify(PUCK)};
const SPEED = 11; // belt, cm per second (drawn)
const GAP = 13; // spacing of parts on the belt
const X0 = -52, X_END = 52;
${erf.toString()}
const cdf = ${cdf.toString()};
${rates.toString()}
${plotX.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { th: "threshold", def: "defects", per: "per 1,000", rej: "rejected", fr: "false rejects", esc: "escapes", dec: ".", th1: "," }
  : { th: "drempel", def: "defect", per: "per 1.000", rej: "afgekeurd", fr: "valse afkeur", esc: "ontsnapt", dec: ",", th1: "." };
function verdict(r) {
  const pct = Math.round(r.goodShare * 100);
  if (r.esc < 0.1 && r.fr > 40) return EN ? "Strict: nothing escapes, but the bin fills with good parts." : "Streng: niets ontsnapt, maar de bak vult zich met goede delen.";
  if (r.esc < 0.1) return EN ? "Defects are rare: " + pct + " % of the rejected parts are good." : "Defecten zijn zeldzaam: " + pct + " % van de afkeur is goed.";
  if (r.esc < 1) return EN ? "Looser: fewer false rejects, but defects slip through." : "Losser: minder valse afkeur, maar defecten glippen erdoor.";
  return EN ? "Lax: " + fx(r.esc, 1) + " of the 5 defects per 1,000 reach the customer." : "Laks: " + fx(r.esc, 1) + " van de 5 defecten per 1.000 gaan naar de klant.";
}

const stage = document.querySelector(".vi-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  belt: q('[data-layer="belt"]'), chute: q('[data-layer="chute"]'), bin: q('[data-layer="bin"]'),
  ribs: q("[data-belt]"), push: [...svg.querySelectorAll("[data-push]")], ring: q("[data-ring]"), lamp: q("[data-lamp]"),
  cone: q("[data-cone]"), spot: q("[data-spot]"), fr: q("[data-fr]"), esc: q("[data-esc]"), thresh: q("[data-thresh]"), scores: q("[data-scores]"),
};
const lines = [...document.querySelectorAll("[data-readout] .vi-line")];
const verdictEl = document.querySelector("[data-verdict]");
const range = document.querySelector(".vi-range");
const minus = document.querySelector("[data-step='-1']");
const plus = document.querySelector("[data-step='1']");
const playBtn = document.querySelector(".vi-play");
const announcer = document.querySelector(".vi-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
const fx = (v, d) => v.toFixed(d).replace(".", T.dec);
const ns = "http://www.w3.org/2000/svg";
const O = iso([0, 0, 0], P);
const scr = (p) => { const s = iso(p, P); return [s[0] - O[0], s[1] - O[1]]; };

// ------------------------------------------------ the stream of parts (seeded)
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function partOf(n) {
  const r = rng(9137 + n * 7919);
  r(); r();
  const bad = r() < DISPLAY_DEF;
  const u = Math.max(1e-9, r()), v = r();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  const score = clamp(bad ? MD + SD * z : MG + SG * z, 0, 100);
  return { n, bad, score };
}

// ------------------------------------------------ state
const state = { T: T_LESSON, playing: !still.matches, clock: 0, s: 0, next: 0, parts: [], bin: [], ext: 0, kick: null, flash: -9, scores: [] };

function spawn(n) {
  const p = partOf(n);
  const g = document.createElementNS(ns, "g");
  g.innerHTML = PUCK.flat[p.bad ? 1 : 0];
  Object.assign(p, { x: X0, y: 0, z: BELT_Z, mode: "belt", seen: false, reject: false, g, alpha: 1, tilt: false, t: 0, landing: null });
  el.belt.appendChild(g);
  state.parts.push(p);
}
function setTilt(p, tilt) {
  if (p.tilt === tilt) return;
  p.tilt = tilt;
  p.g.innerHTML = (tilt ? PUCK.tilt : PUCK.flat)[p.bad ? 1 : 0];
}
// a pyramid in the far half of the tote, where the front wall does not hide it
const slots = [[11.2, 33.4, 1], [17, 33.2, 1], [22.8, 33.5, 1], [14.1, 34.3, 3.4], [19.9, 34.2, 3.4], [17, 35.2, 5.8]];
let binCount = 0;

function step(dt) {
  state.clock += dt;
  const ds = SPEED * dt;
  state.s += ds;
  // feed a new part every GAP of belt travel
  while (state.s >= state.next * GAP) { spawn(state.next); state.next++; }
  for (const p of state.parts) {
    if (p.mode === "belt") {
      p.x += ds;
      if (!p.seen && p.x >= CAM_X) {
        p.seen = true;
        p.reject = p.score > state.T;
        state.flash = state.clock;
        state.scores.push({ score: p.score, reject: p.reject, at: state.clock });
        if (state.scores.length > 10) state.scores.shift();
      }
      if (p.reject && p.x >= PUSH_X && !state.kick) { p.x = PUSH_X; p.mode = "kick"; state.kick = { p, t: 0 }; }
      p.alpha = ease((p.x - X0) / 6) * (1 - ease((p.x - (X_END - 8)) / 8));
      if (p.x >= X_END) p.mode = "gone";
    } else if (p.mode === "chute") {
      p.t += dt;
      const u = 1.4 + 6 * p.t + 0.5 * 70 * p.t * p.t;
      if (u >= SLOPE.len) { p.mode = "fall"; p.t = 0; p.from = [p.x, CHUTE.end[0], CHUTE.end[1]]; p.landing = slots[binCount++ % slots.length]; setTilt(p, false); moveTo(p, "bin"); }
      else { p.y = CHUTE.top[0] + SLOPE.d[1] * u; p.z = CHUTE.top[1] + SLOPE.d[2] * u; }
    } else if (p.mode === "fall") {
      p.t += dt;
      const f = clamp(p.t / 0.32, 0, 1);
      p.x = p.from[0] + (p.landing[0] - p.from[0]) * f;
      p.y = p.from[1] + (p.landing[1] - p.from[1]) * f;
      p.z = p.from[2] + (p.landing[2] - p.from[2]) * f * f;
      if (f >= 1) { p.mode = "bin"; state.bin.push(p); if (state.bin.length > slots.length) { const old = state.bin.shift(); old.mode = "fade"; old.t = 0; } }
    } else if (p.mode === "fade") {
      p.t += dt;
      p.alpha = 1 - ease(p.t / 0.5);
      if (p.t >= 0.5) p.mode = "gone";
    }
  }
  // the pusher: out in 0.3 s, hold, back in 0.4 s
  if (state.kick) {
    const kk = state.kick;
    kk.t += dt;
    state.ext = kk.t < 0.3 ? ease(kk.t / 0.3) : kk.t < 0.38 ? 1 : 1 - ease((kk.t - 0.38) / 0.4);
    const p = kk.p;
    if (p.mode === "kick") {
      const face = PAD_REST + STROKE * state.ext;
      p.y = Math.max(p.y, face + PUCK_R);
      if (p.y >= 10 + PUCK_R) { p.mode = "chute"; p.t = 0; setTilt(p, true); moveTo(p, "chute"); }
    }
    if (kk.t >= 0.78) { state.kick = null; state.ext = 0; }
  }
  state.parts = state.parts.filter((p) => { if (p.mode === "gone") { p.g.remove(); return false; } return true; });
}
function moveTo(p, layer) { el[layer].appendChild(p.g); }

// ------------------------------------------------ drawing
const AY = axisVector(P, [0, STROKE, 0]);
const AXB = axisVector(P, [1, 0, 0]);
function draw() {
  // parts, depth-sorted inside each layer
  for (const layer of ["belt", "chute", "bin"]) {
    const list = state.parts.filter((p) => p.g.parentNode === el[layer]);
    list.sort((a, b) => depthOf([a.x, a.y, a.z], P) - depthOf([b.x, b.y, b.z], P));
    list.forEach((p, i) => { if (el[layer].children[i] !== p.g) el[layer].insertBefore(p.g, el[layer].children[i] || null); });
  }
  for (const p of state.parts) {
    const [dx, dy] = iso([p.x, p.y, p.z], P);
    p.g.setAttribute("transform", "translate(" + dx.toFixed(2) + " " + dy.toFixed(2) + ")");
    p.g.setAttribute("opacity", p.alpha.toFixed(3));
  }
  // the belt ribs travel with the belt
  const off = state.s % 8;
  el.ribs.setAttribute("transform", "translate(" + (AXB[0] * off).toFixed(2) + " " + (AXB[1] * off).toFixed(2) + ")");
  // the pusher rod and pad
  const tx = AY[0] * state.ext, ty = AY[1] * state.ext;
  el.push.forEach((node) => { if (state.ext) node.setAttribute("transform", "translate(" + tx.toFixed(2) + " " + ty.toFixed(2) + ")"); else node.removeAttribute("transform"); holdStill(node, [tx, ty]); });
  // the flash
  const age = state.clock - state.flash;
  const f = age < 0 ? 0 : (age < 0.04 ? age / 0.04 : Math.exp(-(age - 0.04) / 0.12));
  if (f > 0.3) el.ring.setAttribute("data-on", ""); else el.ring.removeAttribute("data-on");
  el.cone.style.opacity = (f * 0.9).toFixed(3);
  el.spot.style.opacity = (f * 0.8).toFixed(3);
  if (state.kick) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  scoresDraw();
}
function scoresDraw() {
  let html = "";
  const n = state.scores.length;
  state.scores.forEach((s, i) => {
    const age = n - 1 - i;
    const a = Math.max(0.2, 1 - age * 0.09);
    const r = age === 0 ? 0.62 : 0.42;
    html += '<circle class="vi-score"' + (s.reject ? ' data-rej=""' : "") + ' cx="' + plotX(s.score).toFixed(2) + '" cy="' + (-(PLOT.base + 0.9)).toFixed(2) + '" r="' + r + '" opacity="' + a.toFixed(2) + '"/>';
  });
  if (el.scores.innerHTML !== html) el.scores.innerHTML = html;
}
function areaPath(m, s, from, to) {
  const pts = [];
  const a = Math.max(0, from), b = Math.min(100, to);
  if (b <= a) return "";
  for (let i = 0; i <= 40; i++) {
    const sc = a + ((b - a) * i) / 40;
    const h = Math.exp(-0.5 * ((sc - m) / s) ** 2);
    pts.push([plotX(sc), -(PLOT.base + (PLOT.top - PLOT.base) * h)]);
  }
  return "M" + plotX(a).toFixed(2) + " " + (-PLOT.base).toFixed(2) + "L" + pts.map(([u, v]) => u.toFixed(2) + " " + v.toFixed(2)).join("L") + "L" + plotX(b).toFixed(2) + " " + (-PLOT.base).toFixed(2) + "Z";
}
let shownT = -1;
function threshold() {
  if (shownT === state.T) return;
  shownT = state.T;
  el.fr.setAttribute("d", areaPath(MG, SG, state.T, 100));
  el.esc.setAttribute("d", areaPath(MD, SD, 0, state.T));
  const u = plotX(state.T).toFixed(2);
  el.thresh.setAttribute("d", "M" + u + " " + (-WIN.z1 - 0.4).toFixed(2) + "V" + (-WIN.z0 + 0.4).toFixed(2));
  readout();
}
function readout() {
  const r = rates(state.T);
  const l1 = T.th + " " + state.T + " · " + fx(P_DEF * 100, 1) + " % " + T.def;
  const l2 = T.per + " · " + T.rej + " " + fx(r.rej, 1);
  const l3 = '<span class="vi-acc">' + T.fr + "</span> " + fx(r.fr, r.fr < 10 ? 2 : 1);
  const l4 = '<span class="vi-strong">' + T.esc + "</span> " + fx(r.esc, r.esc < 10 ? 2 : 1);
  if (lines[0].textContent !== l1) lines[0].textContent = l1;
  if (lines[1].textContent !== l2) lines[1].textContent = l2;
  if (lines[2].innerHTML !== l3) lines[2].innerHTML = l3;
  if (lines[3].innerHTML !== l4) lines[3].innerHTML = l4;
  const v = verdict(r);
  if (verdictEl.textContent !== v) verdictEl.textContent = v;
}
function describe() {
  const r = rates(state.T);
  range.value = String(state.T);
  range.setAttribute("aria-valuetext", T.th + " " + state.T + ", " + T.fr + " " + fx(r.fr, 1) + ", " + T.esc + " " + fx(r.esc, 2) + " " + T.per + ". " + verdict(r));
  minus.disabled = state.T <= RANGE[0];
  plus.disabled = state.T >= RANGE[1];
  if (state.playing) playBtn.setAttribute("data-on", ""); else playBtn.removeAttribute("data-on");
  playBtn.setAttribute("aria-label", state.playing ? playBtn.dataset.pause : playBtn.dataset.play);
}

// ------------------------------------------------ idle tour: 50, then strict 40, lax 68, back to 50
const TOUR = [50, 40, 68];
let tourStep = 0, touring = !still.matches, idleTimer = 0, tourClock = 0;
function setT(v, { tour = false } = {}) {
  const t = Math.round(clamp(v, RANGE[0], RANGE[1]));
  if (t === state.T) { describe(); return; }
  state.T = t;
  threshold();
  describe();
  if (!tour) announcer.textContent = range.getAttribute("aria-valuetext");
  kick();
}
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; tourClock = 0; state.playing = true; describe(); run(); } }, 40000);
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (!still.matches && state.playing) {
    step(dt);
    if (touring) {
      tourClock += dt;
      if (tourClock > 9) { tourClock = 0; tourStep = (tourStep + 1) % TOUR.length; setT(TOUR[tourStep], { tour: true }); }
    }
  }
  draw();
  frame = visible && !still.matches && state.playing ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches || !state.playing) draw(); else run(); };

function togglePlay() {
  steer();
  if (still.matches) { state.playing = false; describe(); draw(); return; }
  state.playing = !state.playing;
  describe();
  if (state.playing) run(); else draw();
}

// a still picture: run the line for a while in fixed steps (deterministic)
function warm(seconds, until) {
  const dt = 1 / 60;
  for (let i = 0; i < seconds * 60; i++) { step(dt); if (until && until()) break; }
}

// ------------------------------------------------ controls
range.addEventListener("input", () => { steer(); setT(Number(range.value)); });
minus.addEventListener("click", () => { steer(); setT(state.T - 1); });
plus.addEventListener("click", () => { steer(); setT(state.T + 1); });
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
  press = { x0: toView(event)[0], start: state.T, dragging: false, id: event.pointerId };
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const dx = toView(event)[0] - press.x0;
  if (!press.dragging && Math.abs(dx) > 6) { press.dragging = true; steer(); try { stage.setPointerCapture(event.pointerId); } catch {} }
  if (press.dragging) setT(press.start + dx / 6);
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
  const stepBy = event.shiftKey ? 5 : 1;
  let handled = true;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") { steer(); setT(state.T + stepBy); }
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") { steer(); setT(state.T - stepBy); }
  else if (event.key === "Home") { steer(); setT(RANGE[0]); }
  else if (event.key === "End") { steer(); setT(RANGE[1]); }
  else if (event.key === " " || event.key === "Enter") togglePlay();
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
// The line starts full: run it in fixed steps until parts fill the belt.
warm(12);
if (still.matches) { state.playing = false; }
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) tick(performance.now()); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  if (still.matches) { touring = false; state.playing = false; cancelAnimationFrame(frame); frame = 0; describe(); draw(); }
  else { touring = true; state.playing = true; describe(); run(); }
});
threshold();
describe();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Drempel bij visuele inspectie",
    hint: "Schuif de drempel",
    drag: "band: 1 op 8 defect, ter illustratie",
    play: "Afspelen",
    pause: "Pauze",
    less: "Lagere drempel",
    more: "Hogere drempel",
    range: "Afkeurdrempel voor de defectscore, 25 tot 90",
    label: LABEL_NL,
    aria: "Inspectielijn met camera. Pijl links en rechts verlaagt of verhoogt de drempel met 1 (Shift: 5), Home en End gaan naar 25 en 90, spatie speelt af of pauzeert.",
  },
  en: {
    title: "Threshold in vision inspection",
    hint: "Slide the threshold",
    drag: "belt: 1 in 8 defective, for show",
    play: "Play",
    pause: "Pause",
    less: "Lower threshold",
    more: "Higher threshold",
    range: "Reject threshold for the defect score, 25 to 90",
    label: LABEL_EN,
    aria: "Inspection line with a camera. Left and right arrows lower or raise the threshold by 1 (Shift: 5), Home and End go to 25 and 90, Space plays or pauses.",
  },
};

const ICONS = `<svg viewBox="0 0 14 14" aria-hidden="true" data-icon="play"><path d="M3.5 2.2v9.6l8-4.8z"/></svg><svg viewBox="0 0 14 14" aria-hidden="true" data-icon="pause"><path d="M3.2 2.4h2.6v9.2H3.2zM8.2 2.4h2.6v9.2H8.2z"/></svg>`;
const controls = `<div class="vi-controls"><button type="button" class="vi-btn vi-play" data-on="" data-play="${STRINGS.nl.play}" data-pause="${STRINGS.nl.pause}" aria-label="${STRINGS.nl.pause}">${ICONS}</button><button type="button" class="vi-btn" data-step="-1" aria-label="${STRINGS.nl.less}">&minus;</button><input class="vi-range" type="range" min="${RANGE[0]}" max="${RANGE[1]}" step="1" value="${T_LESSON}" aria-label="${STRINGS.nl.range}"><button type="button" class="vi-btn" data-step="1" aria-label="${STRINGS.nl.more}">+</button></div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="vi-stage" tabindex="0" role="group" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="vi-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="vi-line"></span>'.repeat(4)}</span><span class="vi-verdict" data-verdict></span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-drag>${STRINGS.nl.drag}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-drag]").textContent=s.drag;
var p=document.querySelector(".vi-play");p.dataset.play=s.play;p.dataset.pause=s.pause;p.setAttribute("aria-label",s.pause);
document.querySelector("[data-step='-1']").setAttribute("aria-label",s.less);document.querySelector("[data-step='1']").setAttribute("aria-label",s.more);
document.querySelector(".vi-range").setAttribute("aria-label",s.range);
var st=document.querySelector(".vi-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
const r50 = rates(T_LESSON);
console.log(`model: μg ${MG.toFixed(2)} σg ${SG} · μd ${MD.toFixed(2)} σd ${SD} · T=50 → detect ${(r50.detect * 100).toFixed(2)} %, false rejects ${r50.fr.toFixed(2)}/1000, escapes ${r50.esc.toFixed(3)}/1000, good share of rejects ${(r50.goodShare * 100).toFixed(1)} %`);
for (const t of [30, 40, 45, 56, 62, 68, 75, 85]) { const r = rates(t); console.log(`  T=${t}: FR ${r.fr.toFixed(2)} esc ${r.esc.toFixed(3)} rej ${r.rej.toFixed(2)}`); }
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

// The belt stand-in is one slab over the whole belt, so it interlocks with the
// rod and pad that reach across it. The only part the rod and pad ever meet is
// the one being kicked, which is behind the pad face; the next part upstream is
// a gap (13) away and clear of the rod on screen. So the layer goes before them.
A.auditOrExit(R, P, { frames: STATES, apart: true, allow: [["live.belt", "push.rod"], ["live.belt", "push.pad"]], cover: ["cam.ring"] });
