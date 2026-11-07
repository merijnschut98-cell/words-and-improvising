// Dev tool, not shipped. Builds the standalone figure for the topic
// "Foutvrij maken" (module Lijnen en automatisering): the lessons
// eng.lines.errors (level 1), pokayoke (level 2), sensors (level 3) and
// detection (level 4).
//
//   node figures/eng.lines.pokayoke/build.mjs            build the page
//   node figures/eng.lines.pokayoke/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.lines.pokayoke.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL (defaults:
// prefers-color-scheme, Dutch, level 2).
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
const OUT = join(ROOT, "src/content/courses/figures/eng.lines.pokayoke.html");

// ---------------------------------------------------------------- the model
// An assembly station: an operator lays a steel bracket with a plastic clip in
// a fixture (mal). A press then rivets it. Two mistakes are possible:
//   the bracket laid the wrong way round (omgekeerd), 1 in 5,000 = 200 ppm, and
//   the clip forgotten (zonder clip),                  1 in 5,000 = 200 ppm,
// so the process makes 400 ppm defects (the pokayoke lesson's 400 ppm).
// Prevention: an orientation pin in the fixture fits the bracket's hole only one
// way round, so "omgekeerd" cannot happen: 200 ppm made.
// Detection: a presence sensor looks down at the clip. Both mistakes leave no
// clip under it. What the check catches:
//   no sensor: final inspection by eye, 85 % (the pokayoke lesson)
//   sensor with a warning (lamp and buzzer), the operator must react: 90 %
//     (an assumption for the figure: a warning is missed now and then)
//   sensor with a stop (interlock: no OK, the press does not close): 99.9 %
//     (the detection lesson's automatic check)
//   an inductive sensor sees only metal: it sees the steel bracket behind the
//     clip and always reports "present", so it catches 0 % (the sensors lesson)
// Escapes = defects made × share missed (the detection lesson):
//   400 × 0.15 = 60 ppm (pokayoke recall), 1,000 × 0.001 = 1 ppm,
//   2,000 × 0.005 = 10 ppm (detection pre and recall).
// Level 4: a red rabbit (a known bad part, here without a clip) runs through the
// check at the start of every interval. If the check accepts it, everything made
// since the last good check is suspect: interval × 60 parts per hour, 8 h → 480.
const MADE = { flip: 200, clip: 200 }; // ppm per mistake
const CATCH = { eye: 0.85, warn: 0.9, stop: 0.999, blind: 0 };
const RATE = 60; // parts per hour (the detection lesson's example)
const INTERVALS = [8, 4, 2]; // hours between red-rabbit checks
const IND = { steel: 8, brass: 0.4 }; // inductive range on steel, mm, and the brass factor
function madeOf(pin) { return (pin ? 0 : MADE.flip) + MADE.clip; }
function catchOf(s) {
  if (!s.sensor) return CATCH.eye;
  if (s.type === "ind" || s.broken) return CATCH.blind;
  return s.mode === "warn" ? CATCH.warn : CATCH.stop;
}
function escapesOf(s) { return madeOf(s.pin) * (1 - catchOf(s)); }
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(1e6 / 5000, 200, 1e-9, "errors example: 1 in 5,000 = 200 ppm");
  near(1e6 / 2500, 400, 1e-9, "errors recall: 1 in 2,500 = 400 ppm");
  near(madeOf(false), 400, 1e-9, "pokayoke: the process makes 400 ppm");
  near(escapesOf({ pin: false, sensor: false }), 60, 1e-9, "pokayoke recall: 400 × 15 % = 60 ppm");
  near(IND.steel * IND.brass, 3.2, 1e-9, "sensors recall: 8 mm × 0.4 = 3.2 mm");
  near(1000 * (1 - CATCH.stop), 1, 1e-9, "detection pre: 1,000 ppm × 0.1 % = 1 ppm");
  near(2000 * (1 - 0.995), 10, 1e-9, "detection recall: 2,000 × 0.5 % = 10 ppm");
  near(1000 * (1 - CATCH.eye), 150, 1e-9, "detection: 85 % by eye → 150 ppm");
  near(8 * RATE, 480, 1e-9, "detection example: 8 h × 60 = 480 parts");
  near(8 * 45, 360, 1e-9, "detection recall: 8 h × 45 = 360 parts");
  near(escapesOf({ pin: true, sensor: true, type: "ind", mode: "stop" }), 200, 1e-9, "sensors: a blind inductive sensor lets every missing clip through");
}

// ---------------------------------------------------------------- the world
// World units are 2 mm, z up, +y toward the operator (front), +x to the right.
// The top of the tooling plate is z = 0.
const WIDTH = 600;
const PLATE = { x: -66, y: -34, w: 132, d: 66, r: 2 };
const NEST = { x: -20, y: -11, w: 40, d: 22, r: 1 };
const NEST_Z = 8; // the fixture face the bracket lies on
const PART = { w: 30, d: 14, h: 5 }; // the bracket
const HOLE = { x: -10, r: 1.9 }; // the bracket's hole, local x
const CLIP = { x: 8, w: 7, d: 10, h: 3 }; // the plastic clip, local x
const PIN = { x: -10, y: 0, r: 1.5, top: NEST_Z + PART.h + 2.5 };
const RAM = { x: -1.5, y: 0, r: 4, z0: 34, z1: 49 }; // press cylinder
const FOOT = { r: 2.5, rest: 24, h: 2 }; // press foot: bottom at rest
const STROKE = FOOT.rest - (NEST_Z + PART.h); // 8: the foot lands on the bracket
const OPT = { x: 5, y: -0.5, w: 5, d: 5, z0: 28 }; // optical sensor body below the plate
const INDS = { x: 9, y: -3.5, r: 2, z0: 26 }; // inductive barrel
const SPLATE = { x: 4, y: -7, w: 16, d: 11, r: 0.6 }; // sensor mounting plate
const SP_Z = [37, 40];
const SPOST = [18, -22];
const PCOL = [RAM.x, -22];
const PLC = { x: 38, y: -31, w: 22, d: 12, r: 0.8 };
const PLC_H = 30;
const TRAY = { x: 24, y: -9, w: 38, d: 18, r: 0.8 };
const TRAY_Z = 2;
const BIN = { x: -58, y: 6, w: 24, d: 20 };
const BIN_H = 12;
const DROP = { ok: [43, 0, TRAY_Z], bin: [BIN.x + BIN.w / 2, BIN.y + BIN.d / 2, 1] };
const FEED = { x: -62, y: -31, w: 34, d: 18, r: 1 };

const FIT = [
  ...k.boxCorners(PLATE, -8, 0),
  [PCOL[0], -25, 54], [RAM.x, 4, 54], [PLC.x + PLC.w, PLC.y, PLC_H + 9], [BIN.x, BIN.y + BIN.d, BIN_H],
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 62);
const ELEVATION = Number(process.env.EL ?? 32);
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
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const plan = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, { order: [], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "", layer = "back" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece: "", move: [0, 0, 0], attrs, layer });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
function box(name, p, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(p, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(p, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [p.x + p.w / 2, p.y + p.d / 2, (z0 + z1) / 2], svg, [shape], opts);
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
const card = (pts, cls = "py-card") => `<path class="${cls}" d="${k.pathOf(pts.map(at), true)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(""), { tone: "lo", free: true });

// ---------------------------------------------------------------- tooling plate and feet
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLATE, -2), -8, 2, P)}"/>`;
for (const [x, y] of k.corners(PLATE, 7)) post("stand.foot", x, y, 3.6, -8, -5, { tone: "lo" }, { steps: 24, layer: "floor", ground: true });
{
  const screws = k.corners(PLATE, 3.6);
  const grid = [];
  for (let x = PLATE.x + 12; x < PLATE.x + PLATE.w - 6; x += 12) for (let y = PLATE.y + 12; y < PLATE.y + PLATE.d - 6; y += 12) grid.push([x, y]);
  // a tooling plate: a grid of tapped holes, most hidden under the fixtures
  const extra =
    L(k.planOutline(k.insetPlan(PLATE, 2.4), 0, P, 3), { tone: "faint" }) +
    L(screws.map(([x, y]) => k.ring(x, y, 1.3, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(screws.map(([x, y]) => at([x, y, 0])), { size: 0.45 }) +
    L(grid.map(([x, y]) => k.ring(x, y, 0.7, 0, P, 10)).join(""), { tone: "faint" });
  box("stand.plate", PLATE, -5, 0, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLATE, -2.5, P, 3), { tone: "faint" }), extra, layer: "floor", ground: true });
}
// the label plate at the front right, three engraved rule lines
{
  const lp = { x: 40, y: 21, w: 20, d: 8, r: 0.5 };
  box("stand.label", lp, 0, 0.4, { tone: "lo", crease: "none" }, {
    steps: 2,
    layer: "floor",
    extra: L([0, 1, 2].map((i) => k.lineOnTop([lp.x + 2.4, lp.y + 2 + i * 2], [lp.x + 2.4 + [13, 9, 11][i], lp.y + 2 + i * 2], 0.4, P)).join(""), { tone: "lo", free: true }) + Dt(k.corners(lp, 1).map(([x, y]) => at([x, y, 0.4])), { size: 0.3 }),
  });
}
// a ruler strip along the front edge, ticks every 5 units, major every 25
{
  const rs = { x: -26, y: 27.5, w: 62, d: 3.4, r: 0.3 };
  const ticks = [];
  for (let i = 0; i <= 12; i++) {
    const x = rs.x + 1 + i * 5;
    ticks.push(k.lineOnTop([x, rs.y], [x, rs.y + (i % 5 === 0 ? 2.6 : 1.4)], 0.4, P));
  }
  box("stand.ruler", rs, 0, 0.4, { tone: "lo", crease: "none" }, { steps: 2, layer: "floor", extra: L(ticks.join(""), { tone: "mid" }) });
}

// ---------------------------------------------------------------- the fixture (mal)
{
  const bolts = k.corners(NEST, 2);
  box("jig.nest", NEST, 0, NEST_Z, { tone: "mid" }, {
    steps: 2,
    bevel: 0.5,
    inner: L(k.sideSeam(NEST, 2, P, 2), { tone: "faint" }),
    extra:
      L(bolts.map(([x, y]) => k.ring(x, y, 1.1, NEST_Z, P, 12)).join(""), { tone: "lo" }) +
      Dt(bolts.map(([x, y]) => at([x, y, NEST_Z])), { size: 0.4 }) +
      L(k.ring(PIN.x, PIN.y, PIN.r + 0.8, NEST_Z, P, 16), { tone: "lo" }) +
      // the bracket's outline engraved on the nest
      L(k.planOutline(plan(0, 0, PART.w + 1, PART.d + 1, 0.6), NEST_Z, P, 2), { tone: "faint" }),
  });
}
// the back rail and the left end stop the bracket is pushed against
box("jig.rail", { x: -16, y: -11, w: 32, d: 2.4, r: 0.3 }, NEST_Z, NEST_Z + 3, { tone: "hi", crease: "lo" }, { steps: 1, extra: Dt([at([-12, -9.8, NEST_Z + 3]), at([12, -9.8, NEST_Z + 3])], { size: 0.35 }) });
box("jig.stop", { x: -20, y: -6, w: 2.4, d: 12, r: 0.3 }, NEST_Z, NEST_Z + 3, { tone: "hi", crease: "lo" }, { steps: 1, extra: Dt([at([-18.8, -3, NEST_Z + 3]), at([-18.8, 3, NEST_Z + 3])], { size: 0.35 }) });
// the orientation pin (shown or hidden live: data-pin)
const pinSvg = S(k.cylinder(PIN.x, PIN.y, PIN.r, NEST_Z, PIN.top - NEST_Z, P, 16), { tone: "hi", crease: "none" });
const pinTipSvg = S(k.cylinder(PIN.x, PIN.y, PIN.r, NEST_Z + PART.h, PIN.top - NEST_Z - PART.h, P, 16), { tone: "hi", crease: "none" }) + Dt([at([PIN.x, PIN.y, PIN.top])], { size: 0.4, tone: "hi" });
R.solid(A.cylinder(PIN.x, PIN.y, PIN.r, NEST_Z, PIN.top - NEST_Z, { name: "jig.pin", owner: "jig.nest" }));

// ---------------------------------------------------------------- the press
{
  const [cx, cy] = PCOL;
  const bolts = Array.from({ length: 4 }, (_, q) => [cx + 3.9 * Math.cos((q / 4) * Math.PI * 2 + 0.6), cy + 3.9 * Math.sin((q / 4) * Math.PI * 2 + 0.6)]);
  post("press.base", cx, cy, 5, 0, 1.6, { tone: "lo" }, { steps: 32, bevel: 0.3, extra: Dt(bolts.map(([x, y]) => at([x, y, 1.6])), { size: 0.4 }) });
  post("press.column", cx, cy, 2.6, 1.6, 49, { tone: "mid", crease: "none" }, { steps: 24, inner: L(k.sideArc(cx, cy, 2.6, 30, P, 20), { tone: "faint" }) });
  const arm = { x: cx - 3, y: cy - 3, w: 6, d: 25, r: 0.6 };
  box("press.arm", arm, 49, 54, { tone: "mid" }, { layer: "front", steps: 2, bevel: 0.4, extra: Dt([at([cx, cy, 54]), at([cx, 0, 54])], { size: 0.45 }) });
  post("press.cylinder", RAM.x, RAM.y, RAM.r, RAM.z0, RAM.z1, { tone: "hi", crease: "lo" }, { layer: "front", steps: 32, inner: L(k.sideArc(RAM.x, RAM.y, RAM.r, RAM.z1 - 2, P, 24) + k.sideArc(RAM.x, RAM.y, RAM.r, RAM.z0 + 2, P, 24), { tone: "faint" }) });
  post("press.gland", RAM.x, RAM.y, 2.4, RAM.z0 - 1.4, RAM.z0, { tone: "mid" }, { layer: "front", steps: 6 });
  // two air fittings on the cylinder's front, with their hoses to the valve
  const fy = RAM.y + RAM.r;
  for (const z of [RAM.z0 + 3, RAM.z1 - 3]) discAt("press.fitting", frameY([RAM.x, fy - 0.4, z]), 0, 1.6, 0.9, { tone: "mid" }, { layer: "front", steps: 6, extra: Dt([at([RAM.x, fy + 1.2, z])], { size: 0.35, tone: "hi" }) });
}
// the moving rod and foot: drawn live in their slot (translate along z)
const rodSvg =
  S(k.cylinder(RAM.x, RAM.y, 1.1, FOOT.rest + FOOT.h, 46 - FOOT.rest - FOOT.h, P, 16), { tone: "hi", crease: "none" }) +
  S(k.cylinder(RAM.x, RAM.y, FOOT.r, FOOT.rest, FOOT.h, P, 20), { tone: "mid" });

// ---------------------------------------------------------------- the sensor stand
{
  const [sx, sy] = SPOST;
  post("sensor.base", sx, sy, 4, 0, 1.4, { tone: "lo" }, { steps: 28, bevel: 0.3, extra: Dt([at([sx - 3, sy, 1.4]), at([sx + 3, sy, 1.4])], { size: 0.4 }) });
  post("sensor.post", sx, sy, 1.8, 1.4, SP_Z[1] - 4, { tone: "mid", crease: "none" }, { steps: 20 });
  const clamp = plan(sx, sy, 6, 6, 0.6);
  box("sensor.clamp", clamp, SP_Z[1] - 4, SP_Z[1], { tone: "hi", crease: "lo" }, { layer: "front", steps: 2, extra: Dt([at([sx, sy + 3, SP_Z[1] - 2])], { size: 0.4, tone: "hi" }) });
  box("sensor.arm", { x: sx - 1.6, y: sy - 1, w: 3.2, d: -sy + 1 + SPLATE.y + SPLATE.d, r: 0.3 }, SP_Z[1], SP_Z[1] + 3, { tone: "mid" }, { layer: "front", steps: 1 });
  box("sensor.plate", SPLATE, SP_Z[0], SP_Z[1], { tone: "mid" }, { layer: "front", steps: 2, bevel: 0.3, extra: Dt([[SPLATE.x + 1.4, SPLATE.y + 1.4], [SPLATE.x + 1.4, SPLATE.y + SPLATE.d - 1.4]].map(([x, y]) => at([x, y, SP_Z[1]])), { size: 0.35 }) });
}
// the optical (diffuse) sensor: body with LED and lens on the underside
{
  const ob = { x: OPT.x, y: OPT.y, w: OPT.w, d: OPT.d, r: 0.5 };
  const fy = ob.y + ob.d;
  box("sensor.optical", ob, OPT.z0, SP_Z[0], { tone: "hi", crease: "lo" }, {
    steps: 2,
    bevel: 0.2,
    layer: "front",
    attrs: ' data-opt=""',
    extra: card([[ob.x + 1, fy, SP_Z[0] - 1.6], [ob.x + ob.w - 1, fy, SP_Z[0] - 1.6], [ob.x + ob.w - 1, fy, SP_Z[0] - 4.4], [ob.x + 1, fy, SP_Z[0] - 4.4]]) +
      `<circle class="py-led" data-led="opt" cx="${at([ob.x + ob.w - 1.2, fy, OPT.z0 + 1.6])[0].toFixed(2)}" cy="${at([ob.x + ob.w - 1.2, fy, OPT.z0 + 1.6])[1].toFixed(2)}" r="${(0.7 * KS).toFixed(2)}"/>`,
  });
}
// the inductive sensor (levels 3 and 4): an M12 barrel with two lock nuts
{
  const { x, y, r, z0 } = INDS;
  post("sensor.inductive", x, y, r, z0, SP_Z[0] - 1.4, { tone: "mid", crease: "none" }, { layer: "front", steps: 20, attrs: ' data-l34=""', inner: L(k.knurl(x, y, r, z0 + 2, SP_Z[0] - 2.4, 9, P), { tone: "faint" }) });
  post("sensor.ind-plug", x, y, 1.6, SP_Z[1] + 1.4, SP_Z[1] + 3.4, { tone: "mid" }, { layer: "front", steps: 16, attrs: ' data-l34=""', extra: Dt([at([x, y, SP_Z[1] + 3.4])], { size: 0.4, tone: "hi" }) });
  post("sensor.nut", x, y, 2.7, SP_Z[0] - 1.4, SP_Z[0], { tone: "hi", crease: "lo" }, { layer: "front", steps: 6, attrs: ' data-l34=""' });
  post("sensor.nut-top", x, y, 2.7, SP_Z[1], SP_Z[1] + 1.4, { tone: "hi", crease: "lo" }, { layer: "front", steps: 6, attrs: ' data-l34=""' });
  post("sensor.ind-face", x, y, r - 0.2, z0 - 0.8, z0, { tone: "lo", crease: "none" }, { layer: "front", steps: 20, attrs: ' data-l34=""' });
}

// ---------------------------------------------------------------- PLC cabinet, signal lamp and buzzer
{
  const fy = PLC.y + PLC.d;
  const door = k.pathOf([[PLC.x + 1.4, fy, 2], [PLC.x + PLC.w - 1.4, fy, 2], [PLC.x + PLC.w - 1.4, fy, PLC_H - 2], [PLC.x + 1.4, fy, PLC_H - 2]].map(at), true);
  const vents = [];
  for (const z of [5, 7.4, 9.8]) vents.push(k.pathOf([[PLC.x + 4, fy, z], [PLC.x + 12, fy, z], [PLC.x + 12, fy, z + 1], [PLC.x + 4, fy, z + 1]].map(at), true));
  const screen = [[PLC.x + 4, fy, 26], [PLC.x + 14, fy, 26], [PLC.x + 14, fy, 19], [PLC.x + 4, fy, 19]];
  box("plc.body", PLC, 0, PLC_H, { tone: "mid" }, {
    steps: 2,
    bevel: 0.5,
    inner: L(door, { tone: "lo" }) + L(k.sideSeam(PLC, PLC_H - 5, P, 2), { tone: "faint" }),
    extra: `<path class="py-slot" d="${vents.join("")}"/>` + card(screen, "py-screen") + rules(PLC.x + 5, fy, 24.6, [7, 5, 6]) +
      Dt([[PLC.x + 5, fy, 16], [PLC.x + 7, fy, 16], [PLC.x + 9, fy, 16]].map(at), { size: 0.45 }) +
      Dt([[PLC.x + 3, fy, 4], [PLC.x + 3, fy, PLC_H - 4]].map(at), { size: 0.4 }),
  });
  // the bypass key switch: a round bezel with a key slot
  const FK = frameY([PLC.x + 18, fy, 15]);
  discAt("plc.key", FK, 0, 1.2, 2, { tone: "lo" }, { steps: 24, extra: L(k.segment([PLC.x + 18, fy + 1.2, 14], [PLC.x + 18, fy + 1.2, 16], P), { tone: "hi", free: true }) });
  discAt("plc.knob", frameY([PLC.x + 18, fy, 22.5]), 0, 1.6, 1.8, { tone: "hi", crease: "none" }, { steps: 20 });
  // the signal lamp on the cabinet top
  const lx = PLC.x + PLC.w - 5, ly = PLC.y + 6;
  post("plc.lamp-base", lx, ly, 2.8, PLC_H, PLC_H + 1.6, { tone: "mid" }, { steps: 20 });
  post("plc.lamp", lx, ly, 2.3, PLC_H + 1.6, PLC_H + 7, { tone: "mid", crease: "lo" }, { steps: 20, attrs: ' data-lamp=""' });
  post("plc.lamp-cap", lx, ly, 2.5, PLC_H + 7, PLC_H + 8, { tone: "mid" }, { steps: 20, extra: Dt([at([lx, ly, PLC_H + 8])], { size: 0.4, tone: "hi" }) });
  // the buzzer
  const bx = PLC.x + 6, by = PLC.y + 6;
  post("plc.buzzer", bx, by, 2.6, PLC_H, PLC_H + 2.4, { tone: "mid" }, {
    steps: 24,
    extra: `<path class="py-ping" data-ping="" d="${k.ring(bx, by, 4.2, PLC_H + 2.4, P, 28)}"/>` + Dt([[bx, by], [bx - 1, by], [bx + 1, by], [bx, by - 1], [bx, by + 1]].map(([x, y]) => at([x, y, PLC_H + 2.4])), { size: 0.3, tone: "lo" }),
  });
}
// the signal cable from the sensor stand to the cabinet, along the plate
const cable = k.wireSvg(at([SPOST[0] + 1.8, SPOST[1], 8]), at([PLC.x, PLC.y + 6, 8]), { via: [at([SPOST[0] + 6, SPOST[1], 8])], tone: "lo", size: 0.9 });

// ---------------------------------------------------------------- the operator's start buttons
{
  const cb = { x: -16, y: 17, w: 28, d: 8, r: 1 };
  box("ctl.box", cb, 0, 5, { tone: "mid" }, { steps: 2, bevel: 0.4, layer: "front", extra: Dt(k.corners(cb, 1.2).map(([x, y]) => at([x, y, 5])), { size: 0.35 }) });
  for (const x of [cb.x + 5, cb.x + cb.w - 5]) {
    post("ctl.collar", x, cb.y + 4, 2.6, 5, 5.8, { tone: "lo" }, { steps: 24, layer: "front" });
    post("ctl.button", x, cb.y + 4, 2, 5.8, 7.2, { tone: "hi", crease: "lo" }, { steps: 24, layer: "front" });
  }
  post("ctl.estop-collar", cb.x + cb.w / 2, cb.y + 4, 2.4, 5, 5.8, { tone: "lo" }, { steps: 6, layer: "front" });
  post("ctl.estop", cb.x + cb.w / 2, cb.y + 4, 1.8, 5.8, 8, { tone: "mid", crease: "lo" }, { steps: 20, layer: "front", extra: Dt([at([cb.x + cb.w / 2, cb.y + 4, 8])], { size: 0.4, tone: "hi" }) });
}

// ---------------------------------------------------------------- the OK outfeed tray (right)
{
  box("tray.floor", TRAY, 0, TRAY_Z, { tone: "lo" }, { steps: 2, bevel: 0.3, inner: L(k.sideSeam(TRAY, 1, P, 2), { tone: "faint" }), extra: L([0, 1, 2, 3, 4].map((i) => k.lineOnTop([TRAY.x + 4 + i * 7.4, TRAY.y + 1.2], [TRAY.x + 4 + i * 7.4, TRAY.y + TRAY.d - 1.2], TRAY_Z, P)).join(""), { tone: "faint" }) });
  box("tray.lip-back", { x: TRAY.x, y: TRAY.y, w: TRAY.w, d: 1.2, r: 0.2 }, TRAY_Z, TRAY_Z + 3, { tone: "mid" }, { steps: 1 });
  box("tray.lip-front", { x: TRAY.x, y: TRAY.y + TRAY.d - 1.2, w: TRAY.w, d: 1.2, r: 0.2 }, TRAY_Z, TRAY_Z + 3, { tone: "mid" }, { steps: 1, layer: "front" });
  box("tray.end", { x: TRAY.x + TRAY.w - 1.2, y: TRAY.y + 1.2, w: 1.2, d: TRAY.d - 2.4, r: 0.2 }, TRAY_Z, TRAY_Z + 4, { tone: "mid" }, { steps: 1, layer: "front" });
}

// ---------------------------------------------------------------- the reject bin (front left)
{
  const t = 1.2;
  box("bin.floor", { x: BIN.x + t, y: BIN.y + t, w: BIN.w - 2 * t, d: BIN.d - 2 * t, r: 0.2 }, 0, 1, { tone: "lo" }, { steps: 1 });
  box("bin.wall-left", { x: BIN.x, y: BIN.y, w: t, d: BIN.d, r: 0.2 }, 0, BIN_H, { tone: "mid" }, { steps: 1 });
  box("bin.wall-back", { x: BIN.x + t, y: BIN.y, w: BIN.w - 2 * t, d: t, r: 0.2 }, 0, BIN_H, { tone: "mid" }, { steps: 1 });
  box("bin.wall-right", { x: BIN.x + BIN.w - t, y: BIN.y, w: t, d: BIN.d, r: 0.2 }, 0, BIN_H, { tone: "mid" }, { steps: 1, layer: "front" });
  const fw = { x: BIN.x + t, y: BIN.y + BIN.d - t, w: BIN.w - 2 * t, d: t, r: 0.2 };
  const fy = fw.y + t;
  box("bin.wall-front", fw, 0, BIN_H, { tone: "mid" }, {
    steps: 1,
    layer: "front",
    // a tag on the front: three rule lines (the reject label)
    extra: card([[BIN.x + 6, fy, 9], [BIN.x + 18, fy, 9], [BIN.x + 18, fy, 3.6], [BIN.x + 6, fy, 3.6]]) + rules(BIN.x + 7.2, fy, 7.6, [8, 6, 7]),
  });
}

// ---------------------------------------------------------------- the infeed tray with the next bracket (back left)
{
  box("feed.tray", FEED, 0, 2, { tone: "lo" }, { steps: 2, bevel: 0.3, inner: L(k.sideSeam(FEED, 1, P, 2), { tone: "faint" }) });
  const pb = plan(FEED.x + FEED.w / 2, FEED.y + FEED.d / 2, PART.w, PART.d, 0.6);
  box("feed.bracket", pb, 2, 2 + PART.h, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: `<path class="py-hole" d="${k.ring(pb.x + PART.w / 2 + HOLE.x, pb.y + PART.d / 2, HOLE.r, 2 + PART.h, P, 18)}"/>` });
  const cp = plan(pb.x + PART.w / 2 + CLIP.x, pb.y + PART.d / 2, CLIP.w, CLIP.d, 0.6);
  box("feed.clip", cp, 2 + PART.h, 2 + PART.h + CLIP.h, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.2 });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
if (process.env.ORDER) console.log(R.items.slice().sort((a, b) => a.key - b.key).map((i, n) => n + " " + i.layer + " " + i.name).join("\n"));
const body = [
  halo,
  ...layerOf("floor"),
  cable,
  ...layerOf("back"),
  `<g data-pin="" data-name="jig.pin">${pinSvg}</g>`,
  `<g data-part=""></g>`,
  `<g data-pin="" data-tip="" data-name="jig.pin-tip">${pinTipSvg}</g>`,
  `<g data-beam=""></g>`,
  `<g data-rod="">${rodSvg}</g>`,
  ...layerOf("front"),
  `<g data-mark=""></g>`,
];
// the front layer holds the press cylinder and the sensors (they hang above the bracket)

const LABEL_NL =
  "Een montageplek op een opspanplaat. In het midden ligt een mal met een aanslag en een oriëntatiepin; de operator legt er een stalen beugel met een kunststof clip in. De pin past alleen in het gat van de beugel als die goed om ligt. Boven de beugel hangen een pers en, aan een statief, een aanwezigheidssensor die naar de clip kijkt. De sensor is verbonden met een PLC-kast met een signaallamp, een zoemer en een bypass-sleutel. Rechts ligt de afvoer voor goede beugels, links voor een afkeurbak, achter een aanvoerbak met de volgende beugel en vooraan de tweehandenstart.";
const LABEL_EN =
  "An assembly station on a tooling plate. In the middle is a fixture with a stop and an orientation pin; the operator lays a steel bracket with a plastic clip in it. The pin fits the bracket's hole only when the bracket lies the right way round. Above the bracket hang a press and, on a stand, a presence sensor that looks at the clip. The sensor is wired to a PLC cabinet with a signal lamp, a buzzer and a bypass key. On the right is the outfeed for good brackets, on the left a reject bin, at the back an infeed tray with the next bracket and at the front the two-hand start.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "pin", at: [PIN.x, PIN.y, PIN.top] },
  { key: "nest", at: [NEST.x + NEST.w - 3, NEST.y + NEST.d, 4] },
  { key: "bracket", live: "bracket" },
  { key: "clip", live: "clip" },
  { key: "sensor", at: [OPT.x + OPT.w / 2, OPT.y + OPT.d, 28.5] },
  { key: "press", at: [RAM.x, RAM.y + RAM.r, 43] },
  { key: "plc", at: [PLC.x + 9, PLC.y + PLC.d, 9] },
  { key: "key", at: [PLC.x + 18, PLC.y + PLC.d, 15] },
  { key: "lamp", at: [PLC.x + PLC.w - 5, PLC.y + 6, PLC_H + 4] },
  { key: "buzzer", at: [PLC.x + 6, PLC.y + 6, PLC_H + 1.5] },
  { key: "bin", at: [BIN.x + 12, BIN.y + BIN.d, 7] },
  { key: "tray", at: [TRAY.x + TRAY.w - 6, TRAY.y + TRAY.d, 3] },
  { key: "start", at: [-2, 21, 7] },
  { key: "feed", at: [FEED.x + 8, FEED.y + FEED.d / 2, 6] },
];

// ---------------------------------------------------------------- page CSS (Vantage palette)
const VANTAGE_CSS = `
.iso{
  --anatomy-page:#0B291B;--anatomy-card:#0D252B;--anatomy-text:#DCD8CB;--anatomy-strong:#F0E9DA;--anatomy-muted:#9FB3A6;
  --anatomy-paper:#0D252B;--anatomy-face:#123039;--anatomy-top:#16353D;
  --anatomy-shade-0:#0A1E23;--anatomy-shade-1:#0C2228;--anatomy-shade-2:#0F272D;--anatomy-shade-3:#122C33;
  --anatomy-lit-top:#2C6774;--anatomy-lit-shade:#205560;
  --anatomy-hi:#E4DDCC;--anatomy-mid:#7C9289;--anatomy-lo:#45615D;--anatomy-faint:#26433F;--anatomy-lit:#5C9FAE;
  --anatomy-halo:#03100F;--anatomy-halo-opacity:.85;--anatomy-dot:#F0E9DA;
  --py-hair:rgba(240,233,218,.12);--py-accent:#5C9FAE;--py-hole:#071A1E;--py-glass:#0A2228;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --py-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --py-hair:rgba(11,41,27,.14);--py-accent:#276F81;--py-hole:#D5CCB6;--py-glass:#DCE7E4;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--py-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:2;--lines:4;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--py-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="1"] .iso-plate{--rows:1}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--py-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.py-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.py-acc{color:var(--py-accent);font-weight:600}
.py-strong{color:var(--anatomy-strong);font-weight:600}
.py-mute{color:var(--anatomy-muted)}
.py-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.py-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.py-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.py-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.py-row{display:flex;gap:4px;height:44px;align-items:center}
.py-row[hidden]{display:none}
.py-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--py-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--py-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.py-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.py-btn:disabled{opacity:.4;cursor:default}
.py-btn[aria-checked="true"],.py-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--py-accent);color:var(--py-accent);font-weight:600}
.py-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.py-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.py-screen{fill:var(--py-glass);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.py-slot,.py-hole{fill:var(--py-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.py-led{fill:var(--anatomy-lo);stroke:none}
.py-led[data-on]{fill:var(--py-accent)}
.py-beam{fill:none;stroke:var(--py-accent);stroke-width:1.1px;stroke-linecap:round;stroke-dasharray:2 2.2}
.py-beam-dot{fill:var(--py-accent);stroke:none}
.py-field{fill:none;stroke:var(--py-accent);stroke-width:.8px;opacity:.7}
.py-ping{fill:none;stroke:var(--py-accent);stroke-width:1.2px;opacity:0}
.py-mark{fill:none;stroke:var(--py-accent);stroke-width:1.4px}
.py-mark-dot{fill:var(--py-accent);stroke:none}
[data-l34]{display:none}
html[data-level="3"] [data-l34],html[data-level="4"] [data-l34]{display:inline}
[data-pin][data-off]{display:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .15s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--py-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const MADE = ${JSON.stringify(MADE)}, CATCH = ${JSON.stringify(CATCH)}, RATE = ${RATE}, INTERVALS = ${JSON.stringify(INTERVALS)}, IND = ${JSON.stringify(IND)};
const PART = ${JSON.stringify(PART)}, HOLE = ${JSON.stringify(HOLE)}, CLIP = ${JSON.stringify(CLIP)}, PIN = ${JSON.stringify(PIN)};
const NEST_Z = ${NEST_Z}, STROKE = ${STROKE}, TRAY_Z = ${TRAY_Z};
const OPT = ${JSON.stringify(OPT)}, INDS = ${JSON.stringify(INDS)}, DROP = ${JSON.stringify(DROP)};
const PARTS = ${JSON.stringify(PARTS)};
${madeOf.toString()}
${catchOf.toString()}
${escapesOf.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",",
      stopL: "Stop", stopT: "interlock: the press does not close, the bracket goes out", warnL: "Warning", warnT: "lamp and buzzer: the operator must react",
      evOk: "good: the press closes", evStop: "mistake stopped: bracket to the reject bin", evWarnC: "warning seen: the operator takes the bracket out", evWarnM: "warning missed: the defect goes on", evEsc: "mistake not seen: the defect goes on", evPrev: "prevented: the pin holds the reversed bracket off",
      real: "really 1 in 5,000 = 200 ppm per mistake · shown more often here",
      made: "made", flip: "reversed", noPin: "(pin)", noclip: "no clip", caught: "caught", eye: "inspection by eye 85 %", warnC: "sensor + warning 90 % (assumed)", stopC: "sensor + stop 99.9 %", blindC: "sensor sees no clip: 0 %", escaped: "escapes",
      ind: "Inductive", indT: "sees metal only: the steel bracket, not the clip", indR: "range 8 mm on steel · brass × 0.4 = 3.2 mm", opt: "Optical, diffuse", optT: "sees the clip itself (window at clip height)", optR: "background suppression: the bracket behind does not count",
      refIdle: "test: 5 good, 5 without clip, 5 clip half in", ref: "reference", good: "good", through: "pass", out: "out", half: "half", valid: "validated", fails: "check fails",
      broken: "sensor knocked: always sees ‘OK’ →", later: "you only find out with the red rabbit", rabIdle: "red rabbit: a known bad part, start of every", rabOut: "red rabbit rejected: the check works", rabIn: "red rabbit passed: the check failed!", interval: "interval", per: "/h", suspect: "suspect if it fails", plan: "stop · repair · verify again · quarantine", planIdle: "reaction plan: stop, repair, contain", partsW: "parts",
      tapPart: "tap a part to name it",
      parts: { pin: ["Orientation pin", "fits the hole only the right way round: prevention"], nest: ["Fixture", "positions the bracket against stop and rail"], bracket: ["Bracket (steel)", "the product, laid in by the operator"], clip: ["Clip (plastic)", "the part that can be forgotten"], sensor: ["Presence sensor", "looks down at the clip: there or not"], press: ["Press", "the next step: only closes on OK (interlock)"], plc: ["PLC", "interlock: no OK, no press"], key: ["Bypass key", "turns the check off: control who uses it"], lamp: ["Signal lamp", "lights on a mistake"], buzzer: ["Buzzer", "a warning you can miss in a noisy hall"], bin: ["Reject bin", "stopped brackets go here"], tray: ["Outfeed", "good brackets, and every escape"], start: ["Two-hand start", "both hands on the buttons, then the press"], feed: ["Infeed", "the next bracket and clip"] } }
  : { dec: ",", grp: ".",
      stopL: "Stoppen", stopT: "interlock: de pers sluit niet, de beugel gaat eruit", warnL: "Waarschuwen", warnT: "lamp en zoemer: de operator moet reageren",
      evOk: "goed: de pers sluit", evStop: "fout gestopt: beugel naar de afkeurbak", evWarnC: "waarschuwing gezien: de operator haalt de beugel eruit", evWarnM: "waarschuwing gemist: het defect gaat door", evEsc: "fout niet gezien: het defect gaat door", evPrev: "voorkomen: de pin houdt de omgekeerde beugel tegen",
      real: "echt 1 op 5.000 = 200 ppm per fout · hier vaker getoond",
      made: "gemaakt", flip: "omgekeerd", noPin: "(pin)", noclip: "zonder clip", caught: "gevangen", eye: "keuring met het oog 85 %", warnC: "sensor + waarschuwing 90 % (aanname)", stopC: "sensor + stop 99,9 %", blindC: "sensor ziet geen clip: 0 %", escaped: "ontsnapt",
      ind: "Inductief", indT: "ziet alleen metaal: de stalen beugel, niet de clip", indR: "bereik 8 mm op staal · messing × 0,4 = 3,2 mm", opt: "Optisch, diffuus", optT: "ziet de clip zelf (venster op cliphoogte)", optR: "achtergrondonderdrukking: de beugel erachter telt niet",
      refIdle: "test: 5 goed, 5 zonder clip, 5 clip half erin", ref: "referentie", good: "goed", through: "door", out: "eruit", half: "half", valid: "gevalideerd", fails: "check faalt",
      broken: "sensor verschoven: ziet altijd ‘OK’ →", later: "dat merk je pas met de red rabbit", rabIdle: "red rabbit: bekend slecht deel, begin van elke", rabOut: "red rabbit eruit: de check werkt", rabIn: "red rabbit door: de check faalt!", interval: "interval", per: "/u", suspect: "verdacht bij falen", plan: "stop · herstel · opnieuw verifiëren · quarantaine", planIdle: "reactieplan: stop, herstel, quarantaine", partsW: "delen",
      tapPart: "tik een onderdeel voor de naam",
      parts: { pin: ["Oriëntatiepin", "past alleen goed om in het gat: voorkomen"], nest: ["Mal (fixture)", "legt de beugel tegen aanslag en rail"], bracket: ["Beugel (staal)", "het product, ingelegd door de operator"], clip: ["Clip (kunststof)", "het onderdeel dat vergeten kan worden"], sensor: ["Aanwezigheidssensor", "kijkt naar de clip: wel of niet"], press: ["Pers", "de volgende stap: sluit alleen bij OK (interlock)"], plc: ["PLC", "interlock: geen OK, geen pers"], key: ["Bypass-sleutel", "zet de check uit: regel wie hem gebruikt"], lamp: ["Signaallamp", "licht op bij een fout"], buzzer: ["Zoemer", "een waarschuwing die je mist in een lawaaiige hal"], bin: ["Afkeurbak", "gestopte beugels gaan hierin"], tray: ["Afvoer", "goede beugels, en elke ontsnapping"], start: ["Tweehandenstart", "beide handen op de knoppen, dan pas de pers"], feed: ["Aanvoer", "de volgende beugel en clip"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const num = (v) => (v >= 10 || Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : fmt(v, v < 1 ? 2 : 1).replace(/0$/, ""));
const pct = (v) => { const p = v * 100; return (Math.abs(p - Math.round(p)) < 1e-9 ? String(Math.round(p)) : fmt(p, 1)) + " %"; };

const stage = document.querySelector(".py-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { part: q("[data-part]"), beam: q("[data-beam]"), rod: q("[data-rod]"), mark: q("[data-mark]"), lamp: q("[data-lamp]"), ping: q("[data-ping]"), led: q('[data-led="opt"]'), pins: [...svg.querySelectorAll("[data-pin]")], tip: q("[data-tip]") };
const lines = [...document.querySelectorAll("[data-readout] .py-line")];
const announcer = document.querySelector(".py-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => t * t * (3 - 2 * t);
const at = (p) => iso(p, P);
const f2 = (v) => v.toFixed(2);

// ------------------------------------------------ state
const st = { mode: "stop", pin: true, sensor: true, type: "opt", broken: false, interval: 8 };
if (LVL === 2) { st.pin = false; st.sensor = false; }
if (LVL === 3) st.type = "ind";
const KINDS = LVL === 4 ? ["ok", "ok", "clip", "ok", "ok", "ok"] : ["ok", "clip", "ok", "flip", "ok", "clip"];
const REF = [];
for (let i = 0; i < 5; i++) REF.push("ok", "clip", "half");
let seqIndex = 0, queue = [], warned = 0;
let ref = null; // { tally: { ok: [pass, out], clip: [...], half: [...] }, left }
let rabbit = "idle"; // idle | running | out | in
let lastEvent = "", marked = -1;

// ------------------------------------------------ what the sensor reports
function defectOf(kind) { return kind === "clip" || kind === "half" || kind === "rabbit" || (kind === "flip" && !st.pin); }
function seesNok(kind) {
  if (!st.sensor) return false;
  if (st.type === "ind" || st.broken) return false;
  return defectOf(kind);
}

// ------------------------------------------------ one bracket as timed segments
// a pose: { x, y, z, th, op }; a segment: [seconds, from, to, { press, beam, lamp, event }]
function planOf(kind) {
  const segs = [];
  const flip = kind === "flip";
  const blocked = flip && st.pin;
  const th0 = flip ? Math.PI : 0;
  const pose = (x, y, z, th, op = 1) => ({ x, y, z, th, op });
  let cur = pose(0, 24, 18, th0, 0);
  const go = (d, to, extra = {}) => { segs.push([d, cur, to, extra]); cur = to; };
  const wait = (d, extra = {}) => go(d, cur, extra);
  go(0.6, pose(0, 0, 18, th0, 1));
  if (blocked) {
    go(0.45, pose(0, 0, PIN.top, th0));
    wait(0.7, { event: "prev" });
    go(0.75, pose(0, 0, 17, 0));
    go(0.4, pose(0, 0, NEST_Z, 0));
  } else go(0.5, pose(0, 0, NEST_Z, th0));
  const th = blocked ? 0 : th0;
  wait(0.7, { beam: true });
  const nok = seesNok(kind);
  const defect = defectOf(kind);
  const toTray = (event) => {
    go(0.25, pose(0, 0, 16, th));
    go(0.8, pose(DROP.ok[0], DROP.ok[1], 16, th));
    go(0.3, pose(DROP.ok[0], DROP.ok[1], DROP.ok[2], th), { event });
  };
  const toBin = (event, lamp) => {
    go(0.3, pose(0, 0, 17, th), { lamp });
    go(0.9, pose(DROP.bin[0], DROP.bin[1], 17, th), { lamp });
    go(0.45, pose(DROP.bin[0], DROP.bin[1], DROP.bin[2], th), { lamp, event });
  };
  const press = () => { wait(0.35, { press: "down" }); wait(0.2, { press: "hold" }); wait(0.35, { press: "up" }); };
  let result;
  if (nok && st.mode === "stop") {
    wait(0.5, { lamp: "on", beam: true });
    toBin("stop", "on");
    result = "stop";
  } else if (nok) {
    warned++;
    const seen = warned % 2 === 1;
    wait(0.35, { press: "down", lamp: "flash", ping: true });
    wait(0.2, { press: "hold", lamp: "flash" });
    wait(0.35, { press: "up", lamp: "flash" });
    if (seen) toBin("warnC", "flash"); else toTray("warnM");
    result = seen ? "warnC" : "warnM";
  } else {
    press();
    toTray(defect ? "esc" : "ok");
    result = defect ? "esc" : "ok";
  }
  wait(0.5);
  go(0.4, { ...cur, op: 0 });
  return { kind, segs, result, total: segs.reduce((s, g) => s + g[0], 0) };
}
let job = null, clock = 0;
function nextKind() {
  if (queue.length) return queue.shift();
  const kd = KINDS[seqIndex % KINDS.length];
  seqIndex++;
  return kd;
}
function startJob() { job = planOf(nextKind()); clock = 0; firedUpTo = -1; }
let firedUpTo = -1;
function sample(t) {
  let tt = t, i = 0;
  while (i < job.segs.length - 1 && tt > job.segs[i][0]) { tt -= job.segs[i][0]; i++; }
  const [d, a, b, x] = job.segs[i];
  const f = d > 0 ? clamp(tt / d, 0, 1) : 1;
  const e = ease(f);
  const lerp = (u, v) => u + (v - u) * e;
  const pose = { x: lerp(a.x, b.x), y: lerp(a.y, b.y), z: lerp(a.z, b.z), th: lerp(a.th, b.th), op: a.op + (b.op - a.op) * f };
  let press = 0;
  if (x.press === "down") press = ease(f); else if (x.press === "hold") press = 1; else if (x.press === "up") press = 1 - ease(f);
  return { pose, press, beam: !!x.beam, lamp: x.lamp || "", ping: x.ping ? f : -1, seg: i, f };
}
function fireEvents(t) {
  // events fire when their segment ends
  let acc = 0;
  job.segs.forEach((g, i) => {
    acc += g[0];
    if (i > firedUpTo && t >= acc) { firedUpTo = i; if (g[3].event) onEvent(g[3].event); }
  });
}
function onEvent(ev) {
  lastEvent = ev;
  if (ref && ref.left > 0) {
    const kind = job.kind, out = ev === "stop" || ev === "warnC";
    ref.tally[kind][out ? 1 : 0]++;
    ref.left--;
  }
  if (job.kind === "rabbit") rabbit = ev === "stop" || ev === "warnC" ? "out" : "in";
  readout(); announce();
}

// ------------------------------------------------ drawing
function rotRect(cx, cy, w, d, th) {
  const c = Math.cos(th), s = Math.sin(th);
  return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c]);
}
function local(pose, u, v) { const c = Math.cos(pose.th), s = Math.sin(pose.th); return [pose.x + u * c - v * s, pose.y + u * s + v * c]; }
function partSvg(pose, kind) {
  const z = pose.z;
  let out = solidSvg(extrude(rotRect(pose.x, pose.y, PART.w, PART.d, pose.th), z, PART.h, P), { tone: "hi", crease: "lo", lit: kind === "rabbit" });
  const [hx, hy] = local(pose, HOLE.x, 0);
  out += '<path class="py-hole" d="' + ring(hx, hy, HOLE.r, z + PART.h, P, 18) + '"/>';
  if (kind !== "clip" && kind !== "rabbit") {
    const [cx, cy] = local(pose, CLIP.x, 0);
    const z0 = z + PART.h + (kind === "half" ? 1.4 : 0);
    out += solidSvg(extrude(rotRect(cx, cy, CLIP.w, CLIP.d, pose.th), z0, CLIP.h, P), { tone: "hi", crease: "lo", lit: true });
  }
  return '<g opacity="' + pose.op.toFixed(3) + '">' + out + "</g>";
}
let sNow = null;
function clipTop(pose, kind) {
  // what the sensor's spot (under the optical lens) sees: clip top, or the bracket, or the nest
  const spot = [OPT.x + OPT.w / 2, OPT.y + OPT.d / 2];
  const c = Math.cos(-pose.th), s = Math.sin(-pose.th);
  const du = (spot[0] - pose.x) * c - (spot[1] - pose.y) * s, dv = (spot[0] - pose.x) * s + (spot[1] - pose.y) * c;
  const onPart = Math.abs(du) <= PART.w / 2 && Math.abs(dv) <= PART.d / 2;
  const onClip = kind !== "clip" && kind !== "rabbit" && Math.abs(du - CLIP.x) <= CLIP.w / 2 && Math.abs(dv) <= CLIP.d / 2;
  if (onClip) return { z: pose.z + PART.h + CLIP.h + (kind === "half" ? 1.4 : 0), clip: true };
  if (onPart) return { z: pose.z + PART.h, clip: false };
  return { z: NEST_Z, clip: false };
}
function drawBeam(s) {
  let out = "";
  let present = false;
  if (s && s.beam && st.sensor && s.pose.op > 0.5) {
    const lx = OPT.x + OPT.w / 2, ly = OPT.y + OPT.d / 2;
    if (st.type === "ind") {
      // an inductive field: three short arcs under the face, on the steel bracket
      const zf = INDS.z0 - 0.8;
      for (let r = 0; r < 3; r++) {
        const zz = zf - 1.2 - r * 1.4, rr = 1.2 + r * 0.6;
        const pts = [];
        for (let i = 0; i <= 12; i++) { const a = Math.PI * (i / 12); pts.push(at([INDS.x + rr * Math.cos(a + Math.PI / 2 + 0.6), INDS.y + rr * Math.sin(a + Math.PI / 2 + 0.6), zz])); }
        out += '<path class="py-field" d="M' + pts.map((p) => f2(p[0]) + " " + f2(p[1])).join("L") + '"/>';
      }
      present = true;
    } else if (st.broken) {
      const a = at([lx, ly, OPT.z0]), b = at([lx, -9.8, NEST_Z + 3]);
      out += '<path class="py-beam" d="M' + f2(a[0]) + " " + f2(a[1]) + "L" + f2(b[0]) + " " + f2(b[1]) + '"/><circle class="py-beam-dot" cx="' + f2(b[0]) + '" cy="' + f2(b[1]) + '" r="1.3"/>';
      present = true;
    } else {
      const hit = clipTop(s.pose, job.kind);
      const a = at([lx, ly, OPT.z0]), b = at([lx, ly, hit.z]);
      out += '<path class="py-beam" d="M' + f2(a[0]) + " " + f2(a[1]) + "L" + f2(b[0]) + " " + f2(b[1]) + '"/><circle class="py-beam-dot" cx="' + f2(b[0]) + '" cy="' + f2(b[1]) + '" r="1.3"/>';
      present = hit.clip && job.kind !== "half";
    }
  }
  if (el.beam.innerHTML !== out) el.beam.innerHTML = out;
  if (present) el.led.setAttribute("data-on", ""); else el.led.removeAttribute("data-on");
}
function draw() {
  const s = sNow;
  el.part.innerHTML = s ? partSvg(s.pose, job.kind) : "";
  drawBeam(s);
  el.rod.setAttribute("transform", translateAlong(P, [0, 0, -STROKE * (s ? s.press : 0)]));
  el.pins.forEach((g) => { if (st.pin) g.removeAttribute("data-off"); else g.setAttribute("data-off", ""); });
  let tip = true;
  if (s && s.pose.op > 0.02) {
    const near = Math.hypot(s.pose.x, s.pose.y) < 24;
    const seated = s.pose.z < NEST_Z + 0.5 && Math.cos(s.pose.th) > 0.999;
    if (near && !seated) tip = false;
  }
  el.tip.style.display = tip ? "" : "none";
  const lamp = s ? s.lamp : "";
  const on = lamp === "on" || (lamp === "flash" && Math.sin(clock * 18) > 0);
  if (on) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  el.ping.style.opacity = s && s.ping >= 0 ? (Math.sin(s.ping * Math.PI) * 0.9).toFixed(3) : "0";
  if (marked >= 0) {
    const pt = livePoint(PARTS[marked]);
    const [x, y] = at(pt);
    el.mark.innerHTML = '<circle class="py-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="py-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
}
function livePoint(p) {
  if (!p.live) return p.at;
  const pose = sNow && sNow.pose.op > 0.3 ? sNow.pose : { x: 0, y: 0, z: NEST_Z, th: 0 };
  if (p.live === "bracket") { const [x, y] = local(pose, -4, PART.d / 2); return [x, y, pose.z + PART.h / 2]; }
  const [x, y] = local(pose, CLIP.x, 0);
  return [x, y, pose.z + PART.h + CLIP.h];
}

// ------------------------------------------------ readout
const acc = (s) => '<span class="py-acc">' + s + "</span>";
const strong = (s) => '<span class="py-strong">' + s + "</span>";
const mute = (s) => '<span class="py-mute">' + s + "</span>";
const EV = { ok: "evOk", stop: "evStop", warnC: "evWarnC", warnM: "evWarnM", esc: "evEsc", prev: "evPrev" };
function eventLine() {
  if (!lastEvent) return mute(T.evOk);
  const txt = T[EV[lastEvent]];
  return lastEvent === "warnM" || lastEvent === "esc" ? strong(txt) : lastEvent === "ok" ? txt : acc(txt);
}
function readout() {
  const out = [];
  const made = madeOf(st.pin), c = catchOf(st), esc = escapesOf(st);
  if (LVL === 1) {
    out.push(st.mode === "stop" ? strong(T.stopL) + " · " + T.stopT : strong(T.warnL) + " · " + T.warnT);
    out.push(eventLine());
    out.push(mute(T.real));
  } else if (LVL === 2) {
    out.push(T.made + ": " + T.flip + " " + (st.pin ? "0 " + T.noPin : MADE.flip) + " + " + T.noclip + " " + MADE.clip + " = " + strong(made + " ppm"));
    out.push(T.caught + ": " + (!st.sensor ? T.eye : st.mode === "warn" ? T.warnC : T.stopC));
    out.push(T.escaped + ": " + made + " × " + pct(1 - c) + " = " + acc(num(esc) + " ppm") + " · " + eventLine());
  } else if (LVL === 3) {
    out.push(st.type === "ind" ? strong(T.ind) + " · " + T.indT : strong(T.opt) + " · " + T.optT);
    if (ref) {
      const t = ref.tally, done = ref.left === 0;
      const ok = t.ok[1] === 0 && t.clip[0] === 0 && t.half[0] === 0;
      out.push(T.ref + ": " + T.good + " " + t.ok[0] + "/5 " + T.through + " · " + T.noclip + " " + t.clip[1] + "/5 " + T.out);
      out.push(T.half + " " + t.half[1] + "/5 " + T.out + (done ? " → " + (ok ? acc(T.valid) : strong(T.fails)) : ""));
    } else {
      out.push(mute(st.type === "ind" ? T.indR : T.optR));
      out.push(mute(T.refIdle));
    }
    out.push(T.escaped + ": " + made + " ppm × " + pct(1 - c) + " = " + acc(num(esc) + " ppm"));
  } else {
    out.push(st.broken ? T.broken + " " + strong(num(esc) + " ppm") + " " + mute("· " + T.later) : T.escaped + ": " + made + " ppm × " + pct(1 - c) + " = " + acc(num(esc) + " ppm"));
    out.push(rabbit === "out" ? acc(T.rabOut) : rabbit === "in" ? strong(T.rabIn) : mute(T.rabIdle + " " + st.interval + " h"));
    out.push(T.interval + " " + st.interval + " h × " + RATE + T.per + " = " + strong(st.interval * RATE + " " + T.partsW) + " " + T.suspect);
    out.push(rabbit === "in" ? acc(T.plan + " " + st.interval * RATE + " " + T.partsW) : mute(T.planIdle));
  }
  if (LVL <= 2) out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : mute(T.tapPart));
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }

// ------------------------------------------------ loop
let frame = 0, lastT = 0, visible = false;
function speed() { return ref && ref.left > 0 ? 2.2 : 1; }
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  clock += dt * speed();
  if (clock >= job.total) { fireEvents(job.total); startJob(); }
  fireEvents(clock);
  sNow = sample(clock);
  draw();
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { lastT = 0; frame = requestAnimationFrame(tick); } };
function restill() {
  // reduced motion: one telling still: a bracket without a clip, seated, under the sensor beam
  queue = [];
  job = planOf(LVL === 4 ? "rabbit" : "clip");
  let t = 0, i = 0;
  while (i < job.segs.length && !job.segs[i][3].beam) { t += job.segs[i][0]; i++; }
  clock = t + (job.segs[i] ? job.segs[i][0] * 0.6 : 0);
  sNow = sample(clock);
  draw();
}

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll(".py-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const toggles = [...document.querySelectorAll("[data-toggle]")];
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  toggles.forEach((b) => b.setAttribute("aria-pressed", String(!!st[b.dataset.toggle])));
}
function changed(restart) {
  sync(); readout(); announce();
  if (restart) { warned = 0; if (!still.matches) { startJob(); } }
  if (still.matches) restill(); else { sNow = sample(clock); draw(); run(); }
}
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  st[key] = key === "interval" ? Number(val) : val;
  if (key === "type") ref = null;
  if (key === "interval") rabbit = "idle";
  lastEvent = "";
  changed(key !== "interval");
}));
toggles.forEach((b) => b.addEventListener("click", () => {
  const key = b.dataset.toggle;
  st[key] = !st[key];
  if (key === "broken") rabbit = "idle";
  lastEvent = "";
  changed(true);
}));
document.querySelectorAll("[role='radiogroup']").forEach((group) => {
  group.addEventListener("keydown", (event) => {
    const items = [...group.querySelectorAll('[role="radio"]')];
    const i = items.findIndex((b) => b.getAttribute("aria-checked") === "true");
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % items.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + items.length - 1) % items.length;
    if (next < 0) return;
    event.preventDefault(); event.stopPropagation();
    items[next].click(); items[next].focus();
  });
});
const refBtn = document.querySelector("[data-act='ref']");
refBtn.addEventListener("click", () => {
  ref = { tally: { ok: [0, 0], clip: [0, 0], half: [0, 0] }, left: REF.length };
  queue = REF.slice();
  if (still.matches) {
    // no motion: run the whole test at once
    REF.forEach((kind) => { const out = seesNok(kind); ref.tally[kind][out ? 1 : 0]++; });
    ref.left = 0; queue = [];
    changed(false);
    return;
  }
  startJob(); changed(false);
});
const rabBtn = document.querySelector("[data-act='rabbit']");
rabBtn.addEventListener("click", () => {
  rabbit = "running";
  if (still.matches) { rabbit = seesNok("rabbit") ? "out" : "in"; changed(false); return; }
  queue = ["rabbit"]; startJob(); changed(false);
});

// tap the drawing: at levels 1 and 2 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 60;
  PARTS.forEach((p, i) => { const [px, py] = at(livePoint(p)); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) return;
  marked = nearestPart(toView(event));
  draw(); readout(); announce();
});
stage.addEventListener("keydown", (event) => {
  if (LVL > 2) return;
  let handled = true;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") marked = (marked + 1) % PARTS.length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") marked = (marked + PARTS.length - 1) % PARTS.length;
  else handled = false;
  if (handled) { event.preventDefault(); draw(); readout(); announce(); }
});

// ------------------------------------------------ start
startJob();
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) restill(); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { cancelAnimationFrame(frame); frame = 0; restill(); } else { startJob(); run(); } });
sync();
readout();
if (still.matches) restill(); else { sNow = sample(clock); draw(); }
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Foutvrij maken",
    hint1: "Tik een onderdeel · kies waarschuwen of stoppen",
    hint2: "Tik een onderdeel · zet pin en sensor aan of uit",
    hint3: "Kies de sensor · test met referentiedelen",
    hint4: "Kies het interval · laat de red rabbit lopen",
    mode: "Reactie", warn: "Waarschuwen", stop: "Stoppen",
    pin: "Pin", sensor: "Sensor",
    type: "Sensortype", ind: "Inductief", opt: "Optisch",
    ref: "Test referentiedelen",
    every: "Interval red rabbit",
    broken: "Sensor verschoven", rabbit: "Red rabbit",
    label: LABEL_NL,
    aria: "Montageplek met een mal, een oriëntatiepin, een pers en een aanwezigheidssensor. Niveau 1 en 2: pijltjes kiezen een onderdeel.",
  },
  en: {
    title: "Error-proofing",
    hint1: "Tap a part · pick warning or stop",
    hint2: "Tap a part · turn pin and sensor on or off",
    hint3: "Pick the sensor · test with reference parts",
    hint4: "Pick the interval · run the red rabbit",
    mode: "Reaction", warn: "Warning", stop: "Stop",
    pin: "Pin", sensor: "Sensor",
    type: "Sensor type", ind: "Inductive", opt: "Optical",
    ref: "Test reference parts",
    every: "Red rabbit interval",
    broken: "Sensor knocked", rabbit: "Red rabbit",
    label: LABEL_EN,
    aria: "Assembly station with a fixture, an orientation pin, a press and a presence sensor. Levels 1 and 2: arrows pick a part.",
  },
};

const sN = STRINGS.nl;
const radio = (set, key) => `<button type="button" class="py-btn" role="radio" data-set="${set}" data-t="${key}" aria-checked="false" tabindex="-1">${sN[key] ?? key}</button>`;
const radioRaw = (set, text) => `<button type="button" class="py-btn" role="radio" data-set="${set}" aria-checked="false" tabindex="-1">${text}</button>`;
const toggle = (key) => `<button type="button" class="py-btn" data-toggle="${key}" data-t="${key}" aria-pressed="false">${sN[key]}</button>`;
const action = (act, key) => `<button type="button" class="py-btn" data-act="${act}" data-t="${key}">${sN[key]}</button>`;
const controls = [
  `<div class="py-controls">`,
  `<div class="py-row" data-levels="2">${toggle("pin")}${toggle("sensor")}</div>`,
  `<div class="py-row" data-levels="1,2" role="radiogroup" aria-label="${sN.mode}" data-t-label="mode">${radio("mode:warn", "warn")}${radio("mode:stop", "stop")}</div>`,
  `<div class="py-row" data-levels="3" role="radiogroup" aria-label="${sN.type}" data-t-label="type">${radio("type:ind", "ind")}${radio("type:opt", "opt")}</div>`,
  `<div class="py-row" data-levels="3">${action("ref", "ref")}</div>`,
  `<div class="py-row" data-levels="4" role="radiogroup" aria-label="${sN.every}" data-t-label="every">${INTERVALS.map((h) => radioRaw(`interval:${h}`, `${h} h`)).join("")}</div>`,
  `<div class="py-row" data-levels="4">${toggle("broken")}${action("rabbit", "rabbit")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="py-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="py-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="py-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=s["hint"+lv]||s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
document.querySelectorAll("[data-t]").forEach(function(n){n.textContent=s[n.getAttribute("data-t")];});
document.querySelectorAll("[data-t-label]").forEach(function(n){n.setAttribute("aria-label",s[n.getAttribute("data-t-label")]);});
var st=document.querySelector(".py-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, finishFigure(page));
console.log(`model: made ${madeOf(false)} / ${madeOf(true)} ppm · escapes eye ${escapesOf({ pin: false, sensor: false })} · warn ${escapesOf({ pin: false, sensor: true, type: "opt", mode: "warn" }).toFixed(1)} · stop ${escapesOf({ pin: true, sensor: true, type: "opt", mode: "stop" }).toFixed(2)} ppm`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { apart: false, cover: ["plc.buzzer"] });
