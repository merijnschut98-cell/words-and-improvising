// Dev tool, not shipped. Builds the standalone figure for the topic Lijmen en
// mechanisch verbinden (module Lassen en verbinden): the lessons
// eng.joining.bonding (level 1), eng.joining.adhesives (level 2),
// eng.joining.rivets (level 3) and eng.joining.choosejoint (level 4).
//
//   node figures/eng.joining.rivet/build.mjs            build the page
//   node figures/eng.joining.rivet/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.joining.rivet.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL (defaults:
// prefers-color-scheme, Dutch, level 2).
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
const OUT = join(ROOT, "src/content/courses/figures/eng.joining.rivet.html");

// ---------------------------------------------------------------- the model
// A small bench test rig pulls a lap joint (two aluminium strips, 25 mm wide,
// 2 mm thick) apart. The joint is made with structural adhesive, two
// self-piercing rivets (SPR), two clinch points or (level 4) adhesive plus two
// SPR (a hybrid joint). The rig pulls along the strips (shear: the sheets
// slide past each other) or lifts the strip end (peel: one edge is pulled
// open, like a sticker).
//
// Numbers from the lessons (asserted below):
//   level 1  overlap 25 × 20 mm = 500 mm², adhesive shear strength 20 MPa
//            → 10 kN in shear, load assumed spread evenly (lesson bonding).
//   level 2  ISO 4587 coupon 25 mm wide, 12.5 mm overlap = 312.5 mm²; breaks at
//            6.25 kN → 20 MPa. Glue on both parts = cohesive failure (the bond
//            held); one bare side = adhesive failure (surface preparation or
//            contamination) (lesson adhesives).
//   level 3  SPR end-force window 36–44 kN; the mean is 42.8 kN and climbs
//            0.4 kN per 1,000 rivets; 3,000 rivets per shift → it reaches the
//            upper limit after (44 − 42.8) / 0.4 × 1,000 = 3,000 rivets: within
//            one shift (lesson rivets).
//   level 4  400 joining points per floor, 60,000 floors a year: SPR at € 0.06
//            → € 1.44 M a year; flow-drill screws at € 0.15 → € 3.6 M.
//            Aluminium is less noble than steel: in the wet it corrodes unless
//            an adhesive layer insulates the two (lesson choosejoint).
//
// Relative strength (qualitative, indicative; the dial reads 0–10 with
// adhesive in shear = 10). Only the order and the rough ratios are claimed:
//   adhesive: strong in shear, weak in peel (lesson bonding; Adams, Comyn &
//     Wake, "Structural Adhesive Joints in Engineering", 2nd ed., 1997: peel
//     loads the bond on a line at the edge; toughened epoxies give some
//     5–10 N/mm in peel against 20–30 MPa in lap shear, so a 25 mm coupon
//     peels at a few hundredths of its shear load);
//   SPR: one rivet in 2 + 2 mm aluminium carries roughly 3–5 kN in lap shear
//     and roughly a third to a half of that in peel / cross-tension (He,
//     Pearson & Young, "Self-pierce riveting for sheet materials: state of the
//     art", J. Mater. Process. Technol. 199, 2008);
//   clinch: usually weaker than a spot weld or an SPR (lesson bonding);
//     roughly half an SPR in shear and weaker still in peel (Eshtayeh et al.,
//     "Clinching process for joining dissimilar materials: state of the art",
//     Int. J. Adv. Manuf. Technol. 82, 2016);
//   hybrid: the adhesive carries the shear; the rivets stop the peel at the
//     end of the bead and catch the load after the adhesive gives (lesson
//     bonding, worked example and "said").
// A greasy surface (level 2) makes the adhesive fail at the interface, far
// below its cohesive strength and with a wide scatter: shown as 40 %.
const W = 25; // strip width, mm
const T = 2; // sheet thickness, mm
const TAU = 20; // MPa, adhesive shear strength (lessons)
const OV = { 1: 20, 2: 12.5, 3: 20, 4: 20 }; // overlap per level
const areaOf = (ov) => W * ov;
const shearKN = (ov) => (areaOf(ov) * TAU) / 1000;
const REL = {
  shear: { glue: 10, spr: 8, clinch: 4, hybrid: 10 },
  peel: { glue: 0.4, spr: 4, clinch: 1.5, hybrid: 4.5 },
};
const GREASE = 0.4;
const WIN = [36, 44]; // kN, SPR end-force window
const MEAN0 = 42.8; // kN now
const DRIFT = 0.4; // kN per 1,000 rivets
const PER_SHIFT = 3000;
const toLimit = (mean) => ((WIN[1] - mean) / DRIFT) * 1000;
const POINTS = 400;
const FLOORS = 60000;
const PRICE = { spr: 0.06, screw: 0.15 };
const perYear = (price) => POINTS * price * FLOORS;
const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
near(areaOf(20), 500, 1e-9, "lesson bonding: 25 × 20 mm");
near(shearKN(20), 10, 1e-9, "lesson bonding: 10 kN in shear");
near(areaOf(12.5), 312.5, 1e-9, "ISO 4587 area");
near(6250 / areaOf(12.5), 20, 1e-9, "lesson adhesives: 6.25 kN → 20 MPa");
near(shearKN(12.5), 6.25, 1e-9, "ISO 4587 coupon at 20 MPa");
near(toLimit(MEAN0), 3000, 1e-6, "lesson rivets: 3,000 rivets to the limit");
if (toLimit(MEAN0) > PER_SHIFT + 1e-6) throw new Error("lesson rivets: within one shift");
near(((38 - 35.5) / 0.5) * 1000, 5000, 1e-9, "recall rivets: 5,000");
near(perYear(PRICE.spr), 1440000, 1e-6, "lesson choosejoint: SPR € 1.44 M");
near(perYear(PRICE.screw), 3600000, 1e-6, "lesson choosejoint: screws € 3.6 M");
near(250 * 0.08 * 40000, 800000, 1e-6, "recall choosejoint: € 800,000");
for (const m of ["glue", "spr", "clinch"]) if (!(REL.shear[m] > REL.peel[m])) throw new Error(`${m}: shear above peel`);
if (!(REL.peel.glue < REL.peel.clinch && REL.peel.clinch < REL.peel.spr && REL.shear.clinch < REL.shear.spr)) throw new Error("relative order");

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the coupon (fixed grip at −x,
// pulling grip at +x), +y toward the viewer. The bed top is z = 10.
const WIDTH = 600;
const BED = { x: -96, y: -46, w: 224, d: 92, r: 3 };
const BED_TOP = 10;
const ZB = 42; // bottom strip underside
const ZT = ZB + T; // top strip underside (bond line)
const E = 10; // end of the bottom strip: the overlap runs from E − OV to E
const XL = -60; // bottom strip's gripped end
const XR = 70; // top strip's gripped end
const XG = 46; // where the top strip leaves the pulling grip
const PEDESTAL = { x: -64, y: -18, w: 28, d: 36, r: 1 };
const JAW_L = { x: -62, y: -16, w: 24, d: 32, r: 1 };
const ANVIL = { x: -22, y: -16, w: 26, d: 32, r: 1 };
const RAIL_Y = 28;
const RAIL_Z = 18;
const RAIL_R = 4;
const BLOCK_L = { x: 8, y: -38, w: 10, d: 76, r: 1 };
const BLOCK_R = { x: 110, y: -38, w: 10, d: 76, r: 1 };
const CAR = { x: 38, y: -36, w: 40, d: 74, r: 1.5 };
const BEARING_H = 5; // linear bearing blocks on the rails, under the carriage
const CAR_Z = [RAIL_Z + RAIL_R + BEARING_H, RAIL_Z + RAIL_R + BEARING_H + 8];
const POSTS = [42, 74];
const POST_Y = -28;
const POST_TOP = 82;
const SLIDE = { x: 45, y: -33, w: 26, d: 10, r: 0.8 };
const SLIDE_Z = [CAR_Z[1] + 1, ZT + T + 10];
const JAW_LO = { x: 46, y: -23, w: 24, d: 39, r: 1 };
const JAW_UP = { x: 47, y: -16, w: 22, d: 32, r: 1 };
const DIAL = { x: 62, y: 26, r: 9, z: [CAR_Z[1] + 3, CAR_Z[1] + 8] };
const WHEEL_Z = 31;
const RIVETS = [-6, 6]; // y of the two points, on the overlap's centre line
const SEP = 8; // shear: how far the pulling grip travels after the break
const LIFT_PRE = 9; // peel: grip lift while loading
const LIFT_FAIL = 22; // peel: grip lift after the break

const FIT = [
  ...k.boxCorners(BED, -6, BED_TOP),
  ...k.boxCorners({ x: 38, y: -32, w: 40, d: 8 }, POST_TOP, POST_TOP + 12),
  ...k.boxCorners({ x: 120, y: -14, w: 20, d: 28 }, WHEEL_Z - 14, WHEEL_Z + 14),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 66);
const ELEVATION = Number(process.env.EL ?? 28);
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
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ...(ground ? { ground: true } : {}) }, steps));
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

// ---------------------------------------------------------------- the top strip, drawn from its profile (shared with the page)
// The strip is a 2 mm sheet extruded across y ∈ [−w/2, w/2] along a profile
// of its underside: [x, z] points. The top line is offset along the normal.
// Seen from +x, +y and above: the top surface and the near (+y) edge show.
function stripSvg(K, P, prof, w, t) {
  const { sinA, cosA } = K.cameraOf(P);
  const f1 = (a) => Math.round(a * 10) / 10;
  const path = (pts, close) => pts.map((p, i) => (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1])).join("") + (close ? "Z" : "");
  const top = prof.map((p, i) => {
    const a = prof[Math.max(0, i - 1)], b = prof[Math.min(prof.length - 1, i + 1)];
    const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
    return [p[0] - (dz / l) * t, p[1] + (dx / l) * t];
  });
  const on = (pts, y) => pts.map(([x, z]) => K.iso([x, y, z], P));
  const tb = on(top, -w / 2), tf = on(top, w / 2), bf = on(prof, w / 2);
  const shade = Math.min(3, Math.max(0, Math.floor(((cosA + 1) / 2) * 4)));
  const topD = path(tb.concat(tf.slice().reverse()), true);
  const sideD = path(tf.concat(bf.slice().reverse()), true);
  const n = prof.length - 1;
  const outline = path(tb) + path(bf) + path([tb[0], tf[0], bf[0]]) + path([tb[n], tf[n], bf[n]]);
  return '<g class="iso-solid"><path class="iso-fill" d="' + topD + sideD + '"/><path class="iso-shade" data-shade="' + shade + '" d="' + sideD + '"/><path class="iso-top" d="' + topD + '"/>' +
    '<path class="iso-line iso-crease" data-tone="lo" d="' + path(tf) + '"/><path class="iso-line iso-edge" data-tone="hi" d="' + outline + '"/></g>';
}
const KB = { iso: k.iso, cameraOf: k.cameraOf };
const restProfile = (ov) => [[E - ov, ZT], [XR, ZT]];

// socket-head screws in counterbores on a +y face
const faceScrews = (pts) => L(pts.map(([x, y, z]) => k.sideRing([x, y, z], 2, "y", P, 20)).join(""), { tone: "lo" }) + L(pts.map(([x, y, z]) => k.sideRing([x, y, z], 1.1, "y", P, 14)).join(""), { tone: "mid" }) + Dt(pts.map((p) => at(p)), { size: 0.4 });

// ---------------------------------------------------------------- bed and feet
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BED, -3), -6, 2, P)}"/>`];
for (const [x, y] of k.corners(BED, 10)) post("stand.foot", x, y, 6, -6, 0, { tone: "lo" }, { steps: 24, bevel: 0.4 });
{
  const screws = k.corners(BED, 4);
  const extra =
    L(k.planOutline(k.insetPlan(BED, 2.6), BED_TOP, P, 3), { tone: "faint" }) +
    L(screws.map(([x, y]) => k.ring(x, y, 1.8, BED_TOP, P, 14)).join(""), { tone: "lo" }) +
    Dt(screws.map(([x, y]) => at([x, y, BED_TOP])), { size: 0.45 });
  box("stand.bed", BED, 0, BED_TOP, { tone: "lo" }, { steps: 3, bevel: 0.7, inner: L(k.sideSeam(BED, 3.4, P, 3), { tone: "faint" }), extra });
}
{
  // a ruler strip along the front edge under the coupon, ticks every 5 mm
  const strip = { x: -88, y: 33, w: 94, d: 7, r: 0.6 };
  const ticks = k.topTicks(-86, 4, 5, 5, strip.y, BED_TOP + 0.6, [2, 3.6], P);
  box("bed.ruler", strip, BED_TOP, BED_TOP + 0.6, { tone: "mid", crease: "none" }, { steps: 2, extra: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) + Dt([at([-86 - 0.9, 36.5, BED_TOP + 0.6]), at([4 + 0.9, 36.5, BED_TOP + 0.6])], { size: 0.35 }) });
  // the rig's tag plate: three engraved rules
  const tag = { x: -90, y: -40, w: 26, d: 11, r: 0.8 };
  const rules = [-36.5, -34, -31.5].map((y, i) => k.lineOnTop([tag.x + 4, y], [tag.x + [20, 14, 17][i], y], BED_TOP + 0.6, P)).join("");
  box("bed.tag", tag, BED_TOP, BED_TOP + 0.6, { tone: "lo", crease: "none" }, { steps: 2, extra: L(rules, { tone: "lo", free: true }) + Dt([at([tag.x + 2, tag.y + 5.5, BED_TOP + 0.6]), at([tag.x + tag.w - 2, tag.y + 5.5, BED_TOP + 0.6])], { size: 0.4 }) });
}

// ---------------------------------------------------------------- fixed grip (left) and the anvil under the overlap
{
  const bolts = [[-61.5, -14.5], [-38.5, -14.5], [-61.5, 14.5], [-38.5, 14.5]];
  box("grip.pedestal", PEDESTAL, BED_TOP, ZB, { tone: "mid" }, {
    steps: 2, bevel: 0.4,
    inner: L(k.sideSeam(PEDESTAL, BED_TOP + 4, P, 2), { tone: "faint" }),
    extra: L(bolts.map(([x, y]) => k.ring(x, y, 1.3, ZB, P, 12)).join(""), { tone: "lo" }) + Dt(bolts.map(([x, y]) => at([x, y, ZB])), { size: 0.4 }) + faceScrews([[-57, 18, 18], [-43, 18, 18], [-57, 18, 34], [-43, 18, 34]]),
  });
  box("grip.jaw", JAW_L, ZT, ZT + 7, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(JAW_L, ZT + 2.4, P, 2), { tone: "faint" }) });
  for (const y of [-9, 9]) {
    post("grip.screw", -50, y, 2.4, ZT + 7, ZT + 9, { tone: "mid", crease: "none" }, { steps: 16 });
    post("grip.knob", -50, y, 4.5, ZT + 9, ZT + 15, { tone: "mid" }, { steps: 32, bevel: 0.4, extra: L(k.knurl(-50, y, 4.5, ZT + 9, ZT + 15, 28, P, 0.4), { tone: "lo" }) + Dt([at([-50, y, ZT + 15])], { size: 0.45, tone: "hi" }) });
  }
}
{
  const dots = [[-19.5, -14.2], [1.5, -14.2], [-19.5, 14.2], [1.5, 14.2]];
  box("anvil", ANVIL, BED_TOP, ZB, { tone: "mid" }, {
    steps: 2, bevel: 0.4,
    inner: L(k.sideSeam(ANVIL, BED_TOP + 4, P, 2), { tone: "faint" }),
    extra: Dt(dots.map(([x, y]) => at([x, y, ZB])), { size: 0.4 }) + faceScrews([[-16, 16, 18], [-2, 16, 18], [-16, 16, 34], [-2, 16, 34]]),
  });
}

// ---------------------------------------------------------------- rails, end blocks, handwheel
{
  box("rail.block", BLOCK_L, BED_TOP, 26, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(BLOCK_L, BED_TOP + 3, P, 2), { tone: "faint" }), extra: Dt([at([12, -34, 26]), at([12, 34, 26])], { size: 0.45 }) + faceScrews([[12, 38, 16]]) });
  box("rail.block", BLOCK_R, BED_TOP, 34, { tone: "mid" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(BLOCK_R, BED_TOP + 3, P, 2), { tone: "faint" }), extra: Dt([at([115, -34, 34]), at([115, 34, 34])], { size: 0.45 }) + faceScrews([[115, 38, 17], [115, 38, 27]]) });
  for (const y of [-RAIL_Y, RAIL_Y]) discAt("rail", frameX([0, y, RAIL_Z]), BLOCK_L.x + BLOCK_L.w, BLOCK_R.x, RAIL_R, { tone: "mid", crease: "none" }, { steps: 32 });
  const FW = frameX([0, 0, WHEEL_Z]);
  discAt("wheel.hub", FW, 120, 124, 4.4, { tone: "mid" }, { steps: 24 });
  discAt("wheel.rim", FW, 124, 127.4, 13, { tone: "mid" }, { steps: 56, extra: L(G.circleOf(FW, 127.4, 9.5, P), { tone: "lo" }) + Dt([at([127.4, 0, WHEEL_Z])], { size: 0.5, tone: "hi" }) });
  const FH = frameX([0, 0, WHEEL_Z + 9]);
  discAt("wheel.handle", FH, 127.4, 133, 1.6, { tone: "mid", crease: "none" }, { steps: 14 });
  discAt("wheel.grip", FH, 133, 139, 2.6, { tone: "mid" }, { steps: 20 });
}

// ---------------------------------------------------------------- carriage, mast, slide, pulling grip, dial (they move)
const CARG = ' data-car=""';
const LIFTG = ' data-lift=""';
{
  const bolts = [[41, -33], [75, -33], [41, 35], [75, 35]];
  box("car.plate", CAR, CAR_Z[0], CAR_Z[1], { tone: "mid" }, {
    steps: 3, bevel: 0.5, attrs: CARG,
    inner: L(k.sideSeam(CAR, CAR_Z[0] + 2.4, P, 3), { tone: "faint" }),
    extra: L(bolts.map(([x, y]) => k.ring(x, y, 1.3, CAR_Z[1], P, 12)).join(""), { tone: "lo" }) + Dt(bolts.map(([x, y]) => at([x, y, CAR_Z[1]])), { size: 0.4 }),
  });
  for (const x of [CAR.x + 2, CAR.x + CAR.w - 14]) for (const y of [-RAIL_Y, RAIL_Y]) {
    const bb = { x, y: y - 6, w: 12, d: 12, r: 0.8 };
    box("car.bearing", bb, RAIL_Z + RAIL_R, CAR_Z[0], { tone: "mid" }, { steps: 2, bevel: 0.3, attrs: CARG, inner: L(k.sideSeam(bb, RAIL_Z + RAIL_R + 1.6, P, 2), { tone: "faint" }) });
  }
  discAt("car.rod", frameX([0, 0, WHEEL_Z]), CAR.x + CAR.w, BLOCK_R.x, 2, { tone: "mid", crease: "none" }, { steps: 16, attrs: CARG });
  for (const x of POSTS) post("mast.post", x, POST_Y, 3, CAR_Z[1], POST_TOP, { tone: "mid", crease: "none" }, { steps: 20, attrs: CARG });
  const cap = { x: 38, y: -32, w: 40, d: 8, r: 0.8 };
  box("mast.cap", cap, POST_TOP, POST_TOP + 4, { tone: "mid" }, { steps: 2, bevel: 0.3, attrs: CARG, extra: Dt([at([40.5, -28, POST_TOP + 4]), at([75.5, -28, POST_TOP + 4])], { size: 0.45 }) });
  post("mast.knob", 58, POST_Y, 5, POST_TOP + 4, POST_TOP + 10, { tone: "mid" }, { steps: 32, bevel: 0.4, attrs: CARG, extra: L(k.knurl(58, POST_Y, 5, POST_TOP + 4, POST_TOP + 10, 30, P, 0.4), { tone: "lo" }) + Dt([at([58, POST_Y, POST_TOP + 10])], { size: 0.45, tone: "hi" }) });
  post("mast.screw", 58, POST_Y, 1.6, SLIDE_Z[1], POST_TOP, { tone: "mid", crease: "none" }, { steps: 14, attrs: CARG });
  box("slide", SLIDE, SLIDE_Z[0], SLIDE_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.3, attrs: LIFTG, inner: L(k.sideSeam(SLIDE, SLIDE_Z[1] - 4, P, 2), { tone: "faint" }) });
  box("grip.lower", JAW_LO, SLIDE_Z[0], ZT, { tone: "mid" }, { steps: 2, bevel: 0.4, attrs: LIFTG, inner: L(k.sideSeam(JAW_LO, SLIDE_Z[0] + 3, P, 2), { tone: "faint" }) });
  box("grip.upper", JAW_UP, ZT + T, ZT + T + 7, { tone: "mid" }, { steps: 2, bevel: 0.4, attrs: LIFTG, inner: L(k.sideSeam(JAW_UP, ZT + T + 2.4, P, 2), { tone: "faint" }) });
  for (const y of [-9, 9]) {
    post("grip.screw", 58, y, 2.4, ZT + T + 7, ZT + T + 9, { tone: "mid", crease: "none" }, { steps: 16, attrs: LIFTG });
    post("grip.knob", 58, y, 4.5, ZT + T + 9, ZT + T + 15, { tone: "mid" }, { steps: 32, bevel: 0.4, attrs: LIFTG, extra: L(k.knurl(58, y, 4.5, ZT + T + 9, ZT + T + 15, 28, P, 0.4), { tone: "lo" }) + Dt([at([58, y, ZT + T + 15])], { size: 0.45, tone: "hi" }) });
  }
  // the dial force gauge: 0–10 over 270°, the needle is the lit part
  post("dial.post", DIAL.x, DIAL.y, 2.6, CAR_Z[1], DIAL.z[0], { tone: "mid", crease: "none" }, { steps: 16, attrs: CARG });
  const top = DIAL.z[1];
  const r = DIAL.r;
  const FROM = -0.75 * Math.PI, SPAN = 1.5 * Math.PI;
  const ticks = k.radialTicks(DIAL.x, DIAL.y, r - 1.6, 20, 2, top, [0.9, 1.9], P, FROM, SPAN);
  const face = [
    L(k.ring(DIAL.x, DIAL.y, r - 1.6, top, P, 64), { tone: "lo" }),
    L(ticks.minor, { tone: "faint" }),
    L(ticks.major, { tone: "lo" }),
    L(k.ring(DIAL.x, DIAL.y, 1.2, top, P, 14), { tone: "mid" }),
    `<path class="fx-needle" data-needle="" d=""/>`,
  ].join("");
  post("dial.body", DIAL.x, DIAL.y, r, DIAL.z[0], top, { tone: "hi", crease: "lo" }, { steps: 56, bevel: 0.6, attrs: CARG, extra: face + L(k.knurl(DIAL.x, DIAL.y, r, top - 2.4, top, 56, P, 0.3), { tone: "lo" }) });
}
const DIAL_GEOM = { x: DIAL.x, y: DIAL.y, z: DIAL.z[1] + 0.05, r: DIAL.r - 2.6, from: -0.75 * Math.PI, span: 1.5 * Math.PI };

// ---------------------------------------------------------------- the coupon
// bottom strip: aluminium (levels 1–3) or, at level 4, aluminium or steel;
// the marks a broken joint leaves on it are drawn with it, hidden until then
const marksOf = (ov) => {
  const xc = E - ov / 2;
  const glue = k.pathOf(k.roundedPlan({ x: E - ov + 0.6, y: -W / 2 + 0.6, w: ov - 1.2, d: W - 1.2, r: 0.6 }, 2).map(([x, y]) => at([x, y, ZT])), true);
  const holes = RIVETS.map((y) => k.ring(xc, y, 2.2, ZT, P, 18)).join("");
  const rims = RIVETS.map((y) => k.ring(xc, y, 3.6, ZT, P, 22)).join("");
  return `<g data-ov="${ov}">` +
    `<g data-m="glue" style="opacity:0"><path class="fx-glue" d="${glue}"/></g>` +
    `<g data-m="holes" style="opacity:0"><path class="fx-well" d="${holes}"/>${L(holes, { tone: "hi" })}</g>` +
    `<g data-m="dimples" style="opacity:0">${L(rims, { tone: "lo" })}<path class="fx-well" d="${holes}"/>${L(holes, { tone: "mid" })}</g>` +
    `</g>`;
};
{
  const plan = { x: XL, y: -W / 2, w: E - XL, d: W, r: 0.3 };
  const shape = R.solid(A.slab(plan, ZB, T, { name: "coupon.bottom" }, 2));
  const paths = k.slabOf(plan, ZB, T, P, 2, 0);
  const alu = S(paths, { tone: "hi" });
  const steel = k.solidSvg(paths, { tone: "hi", className: "fx-steel" });
  const marks = [...new Set(Object.values(OV))].map(marksOf).join("");
  put("coupon.bottom", [plan.x + plan.w / 2, 0, ZB + T / 2], `<g data-sheet="alu">${alu}</g><g data-sheet="steel" style="display:none">${steel}</g>${marks}`, [shape]);
}
// glue: a squeeze-out fillet against the bottom strip's end face, under the
// top strip, and the bond line on the near edge of the overlap
{
  const plan = { x: E, y: -W / 2, w: 1.4, d: W, r: 0.2 };
  const shape = R.solid(A.slab(plan, ZB + 0.6, T - 0.6, { name: "coupon.glue" }, 2));
  put("coupon.glue", [E + 0.7, 0, ZB + 1.3], `<g data-glue="">${S(k.slabOf(plan, ZB + 0.6, T - 0.6, P, 2, 0), { tone: "lo", lit: true, crease: "none" })}</g>`, [shape]);
}
// top strip (live), with the clinch dimples riding on it
{
  const shape = R.solid(A.slab({ x: E - 20, y: -W / 2, w: XR - (E - 20), d: W, r: 0 }, ZT, T, { name: "coupon.top" }, 2));
  const xc = E - 10;
  const rims = RIVETS.map((y) => k.ring(xc, y, 4, ZT + T, P, 24)).join("");
  const wells = RIVETS.map((y) => k.ring(xc, y, 2.6, ZT + T, P, 20)).join("");
  const bond = `<g data-bond=""><g data-ov-line="20"><path class="fx-bond" d="${k.pathOf([at([E - 20, W / 2, ZT]), at([E, W / 2, ZT])])}"/></g><g data-ov-line="12.5"><path class="fx-bond" d="${k.pathOf([at([E - 12.5, W / 2, ZT]), at([E, W / 2, ZT])])}"/></g></g>`;
  const clinch = `<g data-ride="" data-clinch="">${L(rims, { tone: "lo" })}<path class="fx-well" d="${wells}"/>${L(wells, { tone: "mid" })}</g>`;
  put("coupon.top", [(E - 20 + XR) / 2, 0, ZT + T / 2], `<g data-strip="">${stripSvg(KB, P, restProfile(20), W, T)}</g>${bond}${clinch}`, [shape]);
}
// SPR heads, flush-ish on the top strip, riding with it
for (const y of RIVETS) {
  const xc = E - 10;
  post("coupon.rivet", xc, y, 3.9, ZT + T, ZT + T + 0.8, { tone: "hi", lit: true }, { steps: 28, bevel: 0.3, attrs: ' data-ride="" data-rivet=""', extra: L(k.ring(xc, y, 1.6, ZT + T + 0.8, P, 14), { tone: "lo" }) });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups, `<g data-mark=""></g>`];

const LABEL_NL =
  "Een kleine trekbank met een overlapverbinding: twee aluminium strips van 25 mm breed en 2 mm dik, over elkaar gelegd. De verbinding is gelijmd, met twee zelfponsende klinknagels gezet of met twee clinchpunten gemaakt. Links houdt een vaste klem de onderste strip vast, een steunblok ligt onder de overlap. Rechts klemt een trekklem de bovenste strip; die zit op een slede op twee geleiders, met een handwiel om langs de strips te trekken (afschuiven) en een lift om de strip op te tillen (afpellen). Een krachtmeter op de slede toont de kracht.";
const LABEL_EN =
  "A small pull-test bench with a lap joint: two aluminium strips 25 mm wide and 2 mm thick, laid over each other. The joint is bonded, set with two self-piercing rivets or made with two clinch points. On the left a fixed grip holds the bottom strip, a support block lies under the overlap. On the right a pulling grip holds the top strip; it sits on a carriage on two rails, with a handwheel to pull along the strips (shear) and a lift to raise the strip (peel). A dial force gauge on the carriage shows the force.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "bottom", at: [-28, W / 2, ZT] },
  { key: "top", at: [28, W / 2, ZT + T] },
  { key: "joint", at: [0, 0, ZT + T] },
  { key: "fixed", at: [-50, 16, ZT + 6] },
  { key: "anvil", at: [-9, 16, 24] },
  { key: "pull", at: [58, 16, ZT + 4] },
  { key: "car", at: [40, 37, 26] },
  { key: "mast", at: [74, -26, 70] },
  { key: "dial", at: [DIAL.x, DIAL.y, DIAL.z[1]] },
  { key: "wheel", at: [127, 0, WHEEL_Z + 10] },
  { key: "rail", at: [25, RAIL_Y, RAIL_Z + 4] },
];

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#1D4A55;--anatomy-lit-shade:#173D47;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --fx-hair:rgba(240,233,218,.12);--fx-accent:#5C9FAE;--fx-well:#0A1E23;--fx-glue:rgba(92,159,174,.42);--fx-steel:#0F2228;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --fx-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --fx-hair:rgba(11,41,27,.14);--fx-accent:#276F81;--fx-well:#DDD4BF;--fx-glue:rgba(39,111,129,.32);--fx-steel:#D3CCBA;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--fx-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:206px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:300px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--fx-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--fx-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:110px!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:128px!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.fx-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:1.45em}
.fx-acc{color:var(--fx-accent);font-weight:600}
.fx-strong{color:var(--anatomy-strong);font-weight:600}
.fx-mute{color:var(--anatomy-muted)}
.fx-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.fx-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.fx-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.fx-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.fx-row{display:flex;gap:4px;height:44px}
.fx-row[hidden],.fx-btn[hidden],.fx-grp[hidden]{display:none}
.fx-grp{display:flex;gap:4px;flex:1 1 auto;min-width:0}
.fx-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--fx-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--fx-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.fx-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.fx-btn[aria-checked="true"],.fx-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--fx-accent);color:var(--fx-accent);font-weight:600}
.fx-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.fx-btn[data-toggle]{flex:0 0 64px}
.fx-btn:disabled{opacity:.4;cursor:default}
.fx-val{flex:0 0 54px;display:inline-flex;align-items:center;justify-content:center;font:600 11px/1 var(--anatomy-mono);color:var(--anatomy-text)}
.fx-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.fx-well{fill:var(--fx-well);stroke:none}
.fx-glue{fill:var(--fx-glue);stroke:none}
.fx-steel .iso-top,.fx-steel .iso-fill{fill:var(--fx-steel)}
.fx-bond{fill:none;stroke:var(--fx-accent);stroke-width:1.2px;stroke-linecap:butt}
.fx-needle{fill:none;stroke:var(--anatomy-lit);stroke-width:1.2px;stroke-linecap:round}
.fx-mark{fill:none;stroke:var(--fx-accent);stroke-width:1.4px}
.fx-mark-dot{fill:var(--fx-accent);stroke:none}
html:not([data-level="1"]) [data-mark]{display:none}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const W = ${W}, T = ${T}, ZT = ${ZT}, E = ${E}, XR = ${XR}, XG = ${XG}, SEP = ${SEP}, LIFT_PRE = ${LIFT_PRE}, LIFT_FAIL = ${LIFT_FAIL};
const OVS = ${JSON.stringify(OV)}, TAU = ${TAU}, REL = ${JSON.stringify(REL)}, GREASE = ${GREASE};
const WIN = ${JSON.stringify(WIN)}, MEAN0 = ${MEAN0}, DRIFT = ${DRIFT}, PER_SHIFT = ${PER_SHIFT};
const POINTS = ${POINTS}, FLOORS = ${FLOORS}, PRICE = ${JSON.stringify(PRICE)};
const DIAL = ${JSON.stringify(DIAL_GEOM)};
const PARTS = ${JSON.stringify(PARTS)};
const areaOf = ${areaOf.toString()};
const toLimit = ${toLimit.toString()};
const perYear = ${perYear.toString()};
${stripSvg.toString()}
const K = { iso, cameraOf };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LV = Number(params.get("level"));
const LVL = [1, 2, 3, 4].includes(LV) ? LV : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const OVL = OVS[LVL];
const T_ = EN
  ? { dec: ".", th: ",", m: { glue: "Adhesive", spr: "SPR", clinch: "Clinch", hybrid: "Adhesive + SPR" }, d: { shear: "shear", peel: "peel" },
      w: ["very low", "low", "medium", "high"], strength: "strength", rel: "relative, indicative · 2 mm aluminium, 2 points", tap: "tap a part to name it",
      area: (ov, a, f) => "overlap 25 × " + ov + " mm = " + a + " mm² · 20 MPa → " + f + " kN",
      peelLine: "all the load on a thin line at the edge",
      sprWhy: "pressed through the top sheet, flares in the bottom one", clinchWhy: "no extra part: the button hooks the sheets together",
      hybWhy: "the adhesive carries shear, the rivets hold the ends",
      mode: { glue: { shear: "cohesive: breaks through the adhesive, whole area carries", peel: "crack runs in from the edge, line by line" },
        spr: { shear: "rivet tilts, its legs pull out of the bottom sheet", peel: "legs pull out of the bottom sheet" },
        clinch: { shear: "the neck of the button shears off", peel: "the button pulls out of its hook" },
        hybrid: { shear: "adhesive carries; after it breaks the rivets catch the load", peel: "the crack stops at the rivets: they stop the peel" } },
      greasy: "greasy face: the bond fails, far below 6.25 kN", adhesive: "adhesive failure: one bare side → surface prep",
      faceC: "fracture: adhesive on both parts = cohesive, bond good", faceA: "one bare side = adhesive: who touched the face?",
      prepNote: "surface preparation counts above all for adhesive",
      plus: "rivets", mean: "end force", win: "window 36–44", left: (n, s) => n + " rivets to the limit" + s, shift: " = within 1 shift", over: "over the limit: cell stops · cross-section, check the die",
      cost: { spr: (a) => "SPR € " + a + " M/yr · screw € 3.6 M (400 × 60,000)", hybrid: (a) => "rivets € " + a + " M/yr + oven and bead check", clinch: "no consumable part: € 0 for rivets per year", glue: "no rivets: oven or waiting time, space, bead check" },
      cor: { steelIso: "steel under aluminium: the adhesive layer insulates", steelBare: "steel–alu in the wet, no layer: alu corrodes", alu: "alu on alu: no galvanic pair · only a screw comes undone" },
      parts: { bottom: ["Bottom strip", "aluminium, 25 mm wide, 2 mm"], top: ["Top strip", "the rig pulls this one"], joint: ["Overlap", "25 × 20 mm: where the joint sits"], fixed: ["Fixed grip", "holds the bottom strip"], anvil: ["Support block", "under the overlap for the peel test"], pull: ["Pulling grip", "clamps the top strip"], car: ["Carriage", "slides along: shear"], mast: ["Lift", "raises the grip: peel"], dial: ["Force gauge", "shows the peak force"], wheel: ["Handwheel", "pulls the carriage"], rail: ["Guide rail", "the carriage rides on two"] } }
  : { dec: ",", th: ".", m: { glue: "Lijm", spr: "SPR", clinch: "Clinch", hybrid: "Lijm + SPR" }, d: { shear: "afschuiven", peel: "afpellen" },
      w: ["zeer laag", "laag", "middel", "hoog"], strength: "sterkte", rel: "relatief, indicatief · 2 mm aluminium, 2 punten", tap: "tik een onderdeel voor de naam",
      area: (ov, a, f) => "overlap 25 × " + ov + " mm = " + a + " mm² · 20 MPa → " + f + " kN",
      peelLine: "alle belasting op een dun lijntje aan de rand",
      sprWhy: "door de bovenplaat geperst, spreidt in de onderste", clinchWhy: "geen extra onderdeel: de knoop haakt in elkaar",
      hybWhy: "lijm draagt de afschuiving, nagels houden de uiteinden",
      mode: { glue: { shear: "cohesief: breuk door de lijm, het hele vlak draagt", peel: "scheur loopt vanaf de rand, lijntje voor lijntje" },
        spr: { shear: "nagel kantelt, poot trekt uit de onderplaat", peel: "poot trekt uit de onderplaat" },
        clinch: { shear: "de nek van de knoop scheurt af", peel: "de knoop trekt los uit zijn haak" },
        hybrid: { shear: "lijm draagt; na de breuk vangen de nagels op", peel: "scheur stopt bij de nagels: die vangen het pellen op" } },
      greasy: "vet vlak: de hechting faalt, ver onder 6,25 kN", adhesive: "adhesieve breuk: één kale kant → voorbehandeling",
      faceC: "breukvlak: lijm op beide delen = cohesief, hechting goed", faceA: "één kale kant = adhesief: wie raakte het vlak aan?",
      prepNote: "voorbehandeling telt vooral voor lijm",
      plus: "nagels", mean: "eindkracht", win: "venster 36–44", left: (n, s) => "nog " + n + " nagels tot de grens" + s, shift: " = binnen 1 ploeg", over: "boven de grens: cel stopt · macroslijp, check de matrijs",
      cost: { spr: (a) => "SPR € " + a + " mln/jaar · schroef € 3,6 mln (400 × 60.000)", hybrid: (a) => "nagels € " + a + " mln/jaar + oven en rupscontrole", clinch: "geen verbruiksdeel: € 0 aan nagels per jaar", glue: "geen nagels: oven of wachttijd, ruimte, rupscontrole" },
      cor: { steelIso: "staal onder aluminium: de lijmlaag isoleert", steelBare: "staal–alu nat, zonder lijmlaag: alu corrodeert", alu: "alu op alu: geen galvanisch paar · alleen een schroef kan los" },
      parts: { bottom: ["Onderplaat", "aluminium, 25 mm breed, 2 mm"], top: ["Bovenplaat", "hier trekt de bank aan"], joint: ["Overlap", "25 × 20 mm: hier zit de verbinding"], fixed: ["Vaste klem", "houdt de onderplaat vast"], anvil: ["Steunblok", "onder de overlap, voor de peltest"], pull: ["Trekklem", "klemt de bovenplaat"], car: ["Slede", "schuift langs: afschuiven"], mast: ["Lift", "tilt de klem op: afpellen"], dial: ["Krachtmeter", "toont de piekkracht"], wheel: ["Handwiel", "trekt de slede"], rail: ["Geleider", "de slede rijdt op twee"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T_.dec);
const thou = (n) => String(Math.round(n)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T_.th);

const stage = document.querySelector(".fx-stage");
const svg = stage.querySelector("svg");
const all = (sel) => [...svg.querySelectorAll(sel)];
const el = {
  strip: svg.querySelector("[data-strip]"), needle: svg.querySelector("[data-needle]"), mark: svg.querySelector("[data-mark]"),
  car: all("[data-car]"), lift: all("[data-lift]"), ride: all("[data-ride]"), rivet: all("[data-rivet]"), clinch: all("[data-clinch]"), glue: all("[data-glue]"), bond: svg.querySelector("[data-bond]"),
  sheet: { alu: all('[data-sheet="alu"]'), steel: all('[data-sheet="steel"]') },
  ov: all("[data-ov]"), ovLine: all("[data-ov-line]"),
  m: { glue: all('[data-ov="' + OVL + '"] [data-m="glue"]'), holes: all('[data-ov="' + OVL + '"] [data-m="holes"]'), dimples: all('[data-ov="' + OVL + '"] [data-m="dimples"]') },
};
el.ov.forEach((n) => (n.style.display = n.getAttribute("data-ov") === String(OVL) ? "" : "none"));
el.ovLine.forEach((n) => (n.style.display = n.getAttribute("data-ov-line") === String(OVL) ? "" : "none"));
const lines = [...document.querySelectorAll("[data-readout] .fx-line")];
const announcer = document.querySelector(".fx-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ------------------------------------------------ state
const METHODS = LVL === 4 ? ["glue", "spr", "clinch", "hybrid"] : ["glue", "spr", "clinch"];
const st = { m: LVL === 3 ? "spr" : LVL === 4 ? "hybrid" : "glue", dir: LVL === 4 ? "peel" : "shear", grease: false, steel: false, n: 0 };
// the load test: t runs through load (0–2.2 s), break (2.2–2.7), hold (–4.3), reset (–5.1)
const CYCLE = [2.2, 0.5, 1.6, 0.8];
const TOTAL = CYCLE.reduce((a, b) => a + b, 0);
let tc = 0, clock = 0, marked = -1;
const ez = { lf: 0, fail: 0, needle: 0 };
const hasGlue = () => st.m === "glue" || st.m === "hybrid";
const hasRivet = () => st.m === "spr" || st.m === "hybrid";
function strength() {
  let v = REL[st.dir][st.m];
  if (LVL === 2 && st.grease && st.m === "glue") v *= GREASE;
  if (LVL === 2 && st.grease && st.m === "hybrid") v = Math.max(REL[st.dir].spr, v * GREASE);
  return v;
}
const word = (v) => T_.w[v >= 8 ? 3 : v >= 3 ? 2 : v >= 1 ? 1 : 0];
function phase(t) {
  const [a, b, c] = CYCLE;
  const ease = (x) => x * x * (3 - 2 * x);
  if (t < a) return { lf: ease(t / a), fail: 0 };
  if (t < a + b) return { lf: 1, fail: ease((t - a) / b) };
  if (t < a + b + c) return { lf: 1, fail: 1 };
  const r = 1 - ease((t - a - b - c) / CYCLE[3]);
  return { lf: r, fail: r };
}

// ------------------------------------------------ drawing
function profile() {
  const x0 = E - OVL;
  const pts = [];
  if (st.dir === "shear") {
    const dx = SEP * ez.fail;
    return { pts: [[x0 + dx, ZT], [XR + dx, ZT]], dx, h: 0 };
  }
  const h = LIFT_PRE * ez.lf + (LIFT_FAIL - LIFT_PRE) * ez.fail;
  const xc = E - OVL / 2;
  // where the strip still lies flat: glue peels in from the edge E, rivets hold at their line
  let xa;
  if (st.m === "glue") xa = E - OVL * 0.85 * ez.lf;
  else if (st.m === "hybrid") xa = E - (E - xc) * ez.lf;
  else xa = xc;
  const xs = xa + (x0 - xa) * ez.fail;
  const zs = ZT + ez.fail * 0.32 * h;
  if (xs > x0 + 0.05) pts.push([x0, zs]);
  const n = 18;
  for (let i = 0; i <= n; i++) { const s = i / n, x = xs + (XG - xs) * s; pts.push([x, zs + (ZT + h - zs) * (3 * s * s - 2 * s * s * s)]); }
  pts.push([XR, ZT + h]);
  return { pts, dx: 0, h };
}
function zAt(pts, x) {
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const a = pts[i - 1], b = pts[i], s = (x - a[0]) / ((b[0] - a[0]) || 1); return a[1] + (b[1] - a[1]) * s; }
  return pts[pts.length - 1][1];
}
let lastStrip = "";
function draw() {
  const pr = profile();
  const key = pr.pts.map((p) => p[0].toFixed(2) + "," + p[1].toFixed(2)).join(" ");
  if (key !== lastStrip) { lastStrip = key; el.strip.innerHTML = stripSvg(K, P, pr.pts, W, T); }
  const car = translateAlong(P, [pr.dx, 0, 0]);
  el.car.forEach((n) => n.setAttribute("transform", car));
  const lift = translateAlong(P, [pr.dx, 0, pr.h]);
  el.lift.forEach((n) => n.setAttribute("transform", lift));
  const x20 = E - 10, xc = E - OVL / 2;
  const ride = translateAlong(P, [xc - x20 + pr.dx, 0, zAt(pr.pts, xc + pr.dx) - ZT]);
  el.ride.forEach((n) => n.setAttribute("transform", ride));
  el.rivet.forEach((n) => (n.style.display = hasRivet() ? "" : "none"));
  el.clinch.forEach((n) => (n.style.display = st.m === "clinch" ? "" : "none"));
  el.glue.forEach((n) => (n.style.display = hasGlue() ? "" : "none"));
  el.bond.style.display = hasGlue() && ez.fail < 0.02 && (st.dir === "shear" || ez.lf < 0.02) ? "" : "none";
  const steel = LVL === 4 && st.steel;
  el.sheet.alu.forEach((n) => (n.style.display = steel ? "none" : ""));
  el.sheet.steel.forEach((n) => (n.style.display = steel ? "" : "none"));
  const f = ez.fail.toFixed(3);
  const cohesive = !(LVL === 2 && st.grease);
  el.m.glue.forEach((n) => (n.style.opacity = hasGlue() && cohesive ? f : "0"));
  el.m.holes.forEach((n) => (n.style.opacity = hasRivet() ? f : "0"));
  el.m.dimples.forEach((n) => (n.style.opacity = st.m === "clinch" ? f : "0"));
  // the dial: 0–10 over 270°, peak held through the break
  const v = clamp(ez.needle, 0, 10.4);
  const ang = DIAL.from + (v / 10) * DIAL.span;
  const p0 = iso([DIAL.x - Math.sin(ang) * 2, DIAL.y + Math.cos(ang) * 2, DIAL.z], P), p1 = iso([DIAL.x + Math.sin(ang) * DIAL.r, DIAL.y - Math.cos(ang) * DIAL.r, DIAL.z], P);
  const nd = ["M", p0[0].toFixed(2), " ", p0[1].toFixed(2), "L", p1[0].toFixed(2), " ", p1[1].toFixed(2)].join("");
  if (el.needle.getAttribute("d") !== nd) el.needle.setAttribute("d", nd);
  drawMark();
  readout();
}
function drawMark() {
  if (LVL !== 1 || marked < 0) { if (el.mark.innerHTML) el.mark.innerHTML = ""; return; }
  const p = PARTS[marked];
  const [x, y] = iso(p.at, P);
  const html = '<circle class="fx-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="fx-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  if (el.mark.innerHTML !== html) el.mark.innerHTML = html;
}
function lineTexts() {
  const v = strength();
  const out = ['<span class="fx-strong">' + T_.m[st.m] + "</span> · " + T_.d[st.dir] + " → " + T_.strength + ' <span class="fx-acc">' + word(v) + "</span>"];
  const why = st.m === "glue" ? (st.dir === "shear" ? T_.area(fmt(OVL, OVL % 1 ? 1 : 0), fmt(areaOf(OVL), areaOf(OVL) % 1 ? 1 : 0), fmt((areaOf(OVL) * TAU) / 1000, OVL % 1 ? 2 : 0)) : T_.peelLine)
    : st.m === "spr" ? T_.sprWhy : st.m === "clinch" ? T_.clinchWhy : T_.hybWhy;
  let mode = T_.mode[st.m][st.dir];
  if (LVL === 2 && st.grease && st.m === "glue") mode = T_.adhesive;
  if (LVL === 1) {
    out.push(why, mode);
    if (marked >= 0) { const [name, what] = T_.parts[PARTS[marked].key]; out.push('<span class="fx-acc">' + name + "</span> · " + what); }
    else out.push('<span class="fx-mute">' + T_.rel + "</span>");
  } else if (LVL === 2) {
    out.push(st.m === "glue" && st.grease ? '<span class="fx-strong">' + T_.greasy + "</span>" : why, mode);
    if (st.m === "spr" || st.m === "clinch") out.push('<span class="fx-mute">' + T_.prepNote + "</span>");
    else out.push(st.grease ? '<span class="fx-strong">' + T_.faceA + "</span>" : '<span class="fx-acc">' + T_.faceC + "</span>");
  } else if (LVL === 3) {
    const mean = MEAN0 + (DRIFT * st.n) / 1000;
    const left = toLimit(mean);
    out.push(mode);
    out.push("+" + thou(st.n) + " " + T_.plus + " → " + T_.mean + ' <span class="fx-acc">' + fmt(mean, 1) + " kN</span> (" + T_.win + ")");
    out.push(left > 1e-6 ? T_.left(thou(left), left <= PER_SHIFT + 1e-6 ? T_.shift : "") : '<span class="fx-strong">' + T_.over + "</span>");
  } else {
    out.push(mode);
    const sp = fmt(perYear(PRICE.spr) / 1e6, 2);
    out.push(st.m === "spr" ? T_.cost.spr(sp) : st.m === "hybrid" ? T_.cost.hybrid(sp) : T_.cost[st.m]);
    out.push(!st.steel ? '<span class="fx-mute">' + T_.cor.alu + "</span>" : hasGlue() ? '<span class="fx-acc">' + T_.cor.steelIso + "</span>" : '<span class="fx-strong">' + T_.cor.steelBare + "</span>");
  }
  return out;
}
function readout() {
  const out = lineTexts();
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function describe() {
  const text = lineTexts().map((h) => h.replace(/<[^>]+>/g, "")).join(". ");
  stage.setAttribute("aria-valuetext", text);
  return text;
}

// ------------------------------------------------ time
function step(dt, calm) {
  if (calm) { ez.lf = 1; ez.fail = 1; ez.needle = strength(); return; }
  tc = (tc + dt) % TOTAL;
  const ph = phase(tc);
  ez.lf = ph.lf; ez.fail = ph.fail;
  const goal = tc < CYCLE[0] + CYCLE[1] + CYCLE[2] ? strength() * ez.lf : strength() * ph.lf;
  ez.needle += (goal - ez.needle) * (1 - Math.exp(-dt / 0.08));
  clock += dt;
}

// ------------------------------------------------ the idle tour: one load test per step
const TOURS = {
  1: [["glue", "shear"], ["glue", "peel"], ["spr", "shear"], ["spr", "peel"], ["clinch", "shear"], ["clinch", "peel"]].map(([m, dir]) => ({ m, dir })),
  2: [{ m: "glue", dir: "shear", grease: false }, { m: "glue", dir: "shear", grease: true }, { m: "glue", dir: "peel", grease: false }, { m: "spr", dir: "shear", grease: false }, { m: "clinch", dir: "peel", grease: false }],
  3: [{ m: "spr", dir: "shear", n: 0 }, { m: "spr", dir: "peel", n: 1000 }, { m: "spr", dir: "shear", n: 2000 }, { m: "spr", dir: "peel", n: 3000 }, { m: "clinch", dir: "shear", n: 0 }],
  4: [{ m: "hybrid", dir: "peel", steel: false }, { m: "glue", dir: "peel", steel: false }, { m: "spr", dir: "shear", steel: true }, { m: "hybrid", dir: "shear", steel: true }, { m: "clinch", dir: "shear", steel: false }],
};
let touring = !still.matches, tourStep = 0, idleTimer = 0, lastTc = 0;
function applyTour() { Object.assign(st, TOURS[LVL][tourStep]); sync(); }
let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  step(dt, calm);
  if (!calm && touring && tc < lastTc) { tourStep = (tourStep + 1) % TOURS[LVL].length; applyTour(); }
  lastTc = tc;
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; run(); } }, 40000);
}

// ------------------------------------------------ controls
const mBtns = [...document.querySelectorAll("[data-m-btn]")];
const dBtns = [...document.querySelectorAll("[data-dir]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const greaseBtn = document.querySelector("[data-toggle=grease]");
const steelBtn = document.querySelector("[data-toggle=steel]");
const val = document.querySelector("[data-val]");
const N_LIST = [0, 1000, 2000, 3000, 4000];
mBtns.forEach((b) => (b.hidden = !METHODS.includes(b.dataset.mBtn)));
greaseBtn.hidden = LVL !== 2;
steelBtn.hidden = LVL !== 4;
document.querySelector("[data-grp=n]").hidden = LVL !== 3;
function sync() {
  mBtns.forEach((b) => { const on = b.dataset.mBtn === st.m; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  dBtns.forEach((b) => { const on = b.dataset.dir === st.dir; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  greaseBtn.setAttribute("aria-pressed", String(st.grease));
  steelBtn.setAttribute("aria-pressed", String(st.steel));
  val.textContent = "+" + thou(st.n);
  const i = N_LIST.indexOf(st.n);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i <= 0 : i >= N_LIST.length - 1));
  describe();
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function restart() { tc = 0; lastTc = 0; ez.needle = 0; }
function changed(again = true) { steer(); if (again) restart(); sync(); announce(); kick(); }
function stepN(dir) { const i = N_LIST.indexOf(st.n); st.n = N_LIST[clamp(i + dir, 0, N_LIST.length - 1)]; changed(false); }
mBtns.forEach((b) => b.addEventListener("click", () => { st.m = b.dataset.mBtn; changed(); }));
dBtns.forEach((b) => b.addEventListener("click", () => { st.dir = b.dataset.dir; changed(); }));
stepBtns.forEach((b) => b.addEventListener("click", () => stepN(b.dataset.step === "+" ? 1 : -1)));
greaseBtn.addEventListener("click", () => { st.grease = !st.grease; changed(); });
steelBtn.addEventListener("click", () => { st.steel = !st.steel; changed(false); });
function radioKeys(group, keys, current, set) {
  group.addEventListener("keydown", (event) => {
    const list = keys();
    const i = list.indexOf(current());
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % list.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + list.length - 1) % list.length;
    if (next < 0) return;
    event.preventDefault();
    event.stopPropagation();
    set(list[next]);
    group.querySelector('[role="radio"][data-' + (group.dataset.grp === "m" ? "m-btn" : "dir") + '="' + list[next] + '"]').focus();
  });
}
radioKeys(document.querySelector("[data-grp=m]"), () => METHODS, () => st.m, (v) => { st.m = v; changed(); });
radioKeys(document.querySelector("[data-grp=dir]"), () => ["shear", "peel"], () => st.dir, (v) => { st.dir = v; changed(); });

function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => { const [px, py] = iso(p.at, P); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL === 1) { marked = nearestPart(toView(event)); changed(false); }
  else changed(true);
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  const mi = METHODS.indexOf(st.m);
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; changed(false); }
  else if (LVL === 1 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; changed(false); }
  else if (["1", "2", "3", "4"].includes(event.key) && Number(event.key) <= METHODS.length) { st.m = METHODS[Number(event.key) - 1]; changed(); }
  else if (event.key === "s" || event.key === "S") { st.dir = "shear"; changed(); }
  else if (event.key === "p" || event.key === "P") { st.dir = "peel"; changed(); }
  else if (event.key === " " || event.key === "Enter") changed(true);
  else if (LVL === 2 && (event.key === "v" || event.key === "V" || event.key === "g" || event.key === "G")) { st.grease = !st.grease; changed(); }
  else if (LVL === 3 && (event.key === "ArrowUp" || event.key === "+" || event.key === "=")) stepN(1);
  else if (LVL === 3 && (event.key === "ArrowDown" || event.key === "-")) stepN(-1);
  else if (LVL === 4 && (event.key === "t" || event.key === "T")) { st.steel = !st.steel; changed(false); }
  else if (LVL !== 1 && LVL !== 3 && (event.key === "ArrowRight")) { st.m = METHODS[(mi + 1) % METHODS.length]; changed(); }
  else if (LVL !== 1 && LVL !== 3 && (event.key === "ArrowLeft")) { st.m = METHODS[(mi + METHODS.length - 1) % METHODS.length]; changed(); }
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
sync();
step(0, still.matches);
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Lijmen, klinken, clinchen",
    hint1: "Tik een onderdeel · kies verbinding en richting",
    hint2: "Kies verbinding en richting · tik: opnieuw trekken",
    glue: "Lijm", spr: "SPR", clinch: "Clinch", hybrid: "Lijm+SPR",
    shear: "Afschuiven", peel: "Afpellen", grease: "Vet", steel: "Staal",
    method: "Verbinding", dir: "Belasting", minus: "Minder nagels", plus: "Meer nagels", n: "Nagels sinds nu",
    label: LABEL_NL,
    aria: "Trekbank met een overlapverbinding. Toetsen 1 tot 4 kiezen de verbinding, S afschuiven, P afpellen, spatie trekt opnieuw. Niveau 1: pijltjes kiezen een onderdeel. Niveau 2: V maakt het lijmvlak vet. Niveau 3: pijl omhoog en omlaag tellen nagels. Niveau 4: T zet een stalen onderplaat.",
  },
  en: {
    title: "Bonding, riveting, clinching",
    hint1: "Tap a part · pick joint and direction",
    hint2: "Pick joint and direction · tap: pull again",
    glue: "Adhesive", spr: "SPR", clinch: "Clinch", hybrid: "Adh.+SPR",
    shear: "Shear", peel: "Peel", grease: "Greasy", steel: "Steel",
    method: "Joint", dir: "Load", minus: "Fewer rivets", plus: "More rivets", n: "Rivets from now",
    label: LABEL_EN,
    aria: "Pull-test bench with a lap joint. Keys 1 to 4 pick the joint, S shear, P peel, Space pulls again. Level 1: arrows pick a part. Level 2: V makes the bonding face greasy. Level 3: up and down count rivets. Level 4: T puts in a steel bottom sheet.",
  },
};

const sN = STRINGS.nl;
const controls = [
  `<div class="fx-controls">`,
  `<div class="fx-row"><div class="fx-grp" role="radiogroup" data-grp="m" aria-label="${sN.method}">${["glue", "spr", "clinch", "hybrid"].map((m, i) => `<button type="button" class="fx-btn" role="radio" data-m-btn="${m}" aria-checked="${i === 0}"${i ? ' tabindex="-1"' : ""}>${sN[m]}</button>`).join("")}</div></div>`,
  `<div class="fx-row"><div class="fx-grp" role="radiogroup" data-grp="dir" aria-label="${sN.dir}"><button type="button" class="fx-btn" role="radio" data-dir="shear" aria-checked="true">${sN.shear}</button><button type="button" class="fx-btn" role="radio" data-dir="peel" aria-checked="false" tabindex="-1">${sN.peel}</button></div>` +
    `<button type="button" class="fx-btn" data-toggle="grease" aria-pressed="false">${sN.grease}</button><button type="button" class="fx-btn" data-toggle="steel" aria-pressed="false">${sN.steel}</button>` +
    `<div class="fx-grp" data-grp="n" role="group" aria-label="${sN.n}" style="flex:0 0 auto"><button type="button" class="fx-btn" data-step="-" aria-label="${sN.minus}">−</button><span class="fx-val" data-val>+0</span><button type="button" class="fx-btn" data-step="+" aria-label="${sN.plus}">+</button></div></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="fx-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="fx-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="fx-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=q.get("level");d.setAttribute("data-level",l==="1"||l==="3"||l==="4"?l:"2");
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=lv==="1"?s.hint1:s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
var set=function(sel,txt){var n=document.querySelector(sel);if(n)n.textContent=txt;};
["glue","spr","clinch","hybrid"].forEach(function(m){set('[data-m-btn="'+m+'"]',s[m]);});
set('[data-dir="shear"]',s.shear);set('[data-dir="peel"]',s.peel);set('[data-toggle="grease"]',s.grease);set('[data-toggle="steel"]',s.steel);
document.querySelector('[data-grp="m"]').setAttribute("aria-label",s.method);document.querySelector('[data-grp="dir"]').setAttribute("aria-label",s.dir);document.querySelector('[data-grp="n"]').setAttribute("aria-label",s.n);
document.querySelector('[data-step="-"]').setAttribute("aria-label",s.minus);document.querySelector('[data-step="+"]').setAttribute("aria-label",s.plus);
var st=document.querySelector(".fx-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: shear 25×20 ${shearKN(20)} kN · ISO 4587 ${shearKN(12.5)} kN · SPR limit in ${toLimit(MEAN0)} rivets · SPR €${perYear(PRICE.spr)}/yr · screws €${perYear(PRICE.screw)}/yr`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids (+1 live) · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P);
