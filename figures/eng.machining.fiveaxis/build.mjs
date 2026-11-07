// Dev tool, not shipped. Builds the standalone figure for the topic Frezen
// (module Verspanen), level 4: the lesson eng.machining.fiveaxis. Levels 1–3
// of the topic use eng.machining.mill; opened at those levels this page shows
// its level-4 state.
//
//   node figures/eng.machining.fiveaxis/build.mjs            build the page
//   node figures/eng.machining.fiveaxis/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.machining.fiveaxis.html: one offline
// page with the anatomy kit, the kit's lathe module and the live script
// inlined. The page reads ?theme=light|dark, ?lang=nl|en and ?level=1..4 from
// its URL (defaults: prefers-color-scheme, Dutch, level 2).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
const OUT = join(ROOT, "src/content/courses/figures/eng.machining.fiveaxis.html");

// ---------------------------------------------------------------- the model
// The lesson "fiveaxis" (Vijfassig frezen: 3+2 of simultaan):
//   the worked example: a housing with features on five sides takes 4 setups
//   on a three-axis machine and 1 on a five-axis machine with a trunnion
//   table (draai-kanteltafel). The figure's block follows it exactly: a
//   pocket on top and a slot open to the top on the front side are milled
//   from above in the first setup; the three other sides each need a
//   re-clamp (3 re-clamps, 4 setups). On the five-axis machine all five come
//   in one setup; only the bottom, where the block is held, is left.
//   Cost of an extra setup (the lesson's worked example): 30 min changeover
//   and measuring per batch, plus 3 min per part to re-clamp; batches of 50,
//   40 batches a year.
//     extra time per batch = (s3 − s5) · 30 + (s3 − s5) · 3 · 50   [min]
//     example and figure: 4 → 1 setups: 90 + 450 = 540 min = 9 h; × 40 = 360 h
//     per part: 3 re-clamps × 3 min = 9 min
//     recall:  4 → 1 setups at 25 min, 60 batches: 75 h a year
//   Position error between sides (lesson: "every re-clamp adds a small
//   position error; in one setup all features share one zero point"). The
//   lesson gives no size; assumed ±0.02 mm per re-clamp (a good vice or
//   zero-point re-clamp), worst case adding up: side 1 ↔ 5 after 3 re-clamps
//   ±0.06 mm. In one setup: no re-clamp error.
//   The drawing shows each re-clamp shift 100× enlarged (0.02 mm → 2 mm).
// 3+2: tilt to a fixed angle, lock the rotary axes, mill with X, Y, Z.
// Simultaneous: all five axes move at once (free forms); for a block overkill.
const SETUP_MIN = 30;
const RECLAMP_MIN = 3;
const BATCH = 50;
const BATCHES = 40;
const ERR = 0.02; // mm per re-clamp (assumed)
const extraMin = (s3, s5, change = SETUP_MIN, per = RECLAMP_MIN, batch = BATCH) => (s3 - s5) * change + (s3 - s5) * per * batch;
const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
near(extraMin(4, 1), 540, 1e-9, "lesson minutes per batch");
near((3 * SETUP_MIN), 90, 1e-9, "lesson changeover");
near(3 * RECLAMP_MIN * BATCH, 450, 1e-9, "lesson re-clamping");
near((extraMin(4, 1) / 60) * BATCHES, 360, 1e-9, "lesson hours a year");
near(((4 - 1) * 25 * 60) / 60, 75, 1e-9, "recall hours");
const FACES = 5; // sides with features (example: "five sides")
const SETUPS3 = 4; // setups on three axes (example: "4 setups")
const MIN3 = extraMin(SETUPS3, 1);
near(MIN3, 540, 1e-9, "figure minutes per batch");
near((MIN3 / 60) * BATCHES, 360, 1e-9, "figure hours a year");
near((SETUPS3 - 1) * RECLAMP_MIN, 9, 1e-9, "figure minutes per part");
near((SETUPS3 - 1) * ERR, 0.06, 1e-12, "figure position error");

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, +y toward the viewer's left front, +x to
// the right front. The trunnion (A axis) runs along x at height ZA; the rotary
// table (C axis) sits in the cradle; the block of 60 mm has its centre on both
// axes, so the side that faces up is always at ZA + 30 under the spindle.
const WIDTH = 600;
const FLOOR = -10;
const BASE = { x: -120, y: -165, w: 240, d: 262, r: 4 };
const BASE_TOP = 24;
const ZA = 78;
const H = 22; // half the block (drawn 44 mm: the figure's scale, not the part's)
const HOLE_R = 5.5;
const CHEEK = { x0: 50, x1: 60, y: 32, z0: -50, z1: 6 };
const PLATE = { x: 50, y: 40, z0: -50, z1: -40 };
const TABLE_R = 37;
const TABLE_Z = [-40, -32];
const RISER = { r: 12, z: [-32, -22] };
const TRUN = { r: 18, x0: 60, x1: 66 };
const SUP = { x0: 66, x1: 90, y: 36, z1: 88 };
const CAP = { x1: 96, r: 23 };
const MOTOR = { x1: 118, r: 17, cap: 122 };
const COL = { x: -50, y: -165, w: 100, d: 45, r: 3 };
const ZWAY = { y0: -120, y1: -115 };
const HEAD = { x: -34, y: -115, w: 68, d: 141, r: 4 };
const TOOL_S = 30; // tool top below the head
const TOOL_L = 22;
const TOOL_R = 4.5;
const TIP_REST = 138;
const HB = TIP_REST + TOOL_S + TOOL_L; // 190
const HT = HB + 32;
const COL_TOP = HT + 24;
const CUT_DEPTH = 3;
const DZ_CUT = ZA + H - CUT_DEPTH - TIP_REST; // head travel to cut
const MAG = { x0: 50, x1: 59, y: -142, z: 196, r: 26 };
const LIFT = 18; // the block lifts this far to be re-clamped
const SHIFT = 2; // drawn shift per re-clamp: 0.02 mm × 100
const SHIFT_DIR = [0.86, 0.51, 0];

const FIT = [
  ...k.boxCorners(BASE, FLOOR, BASE_TOP),
  ...k.boxCorners(COL, BASE_TOP, COL_TOP + 22),
  ...k.boxCorners(HEAD, HB, HT + 20),
  ...k.boxCorners({ x: -MOTOR.cap, y: -MOTOR.r, w: 2 * MOTOR.cap, d: 2 * MOTOR.r }, ZA - MOTOR.r, ZA + MOTOR.r),
  ...k.boxCorners({ x: 50, y: MAG.y - MAG.r, w: 16, d: 2 * MAG.r }, MAG.z - MAG.r, MAG.z + MAG.r),
];
const PAD = 6;
const MACHINE_W = 372; // the machine fills the left of the card, the gauge the right
const AZIMUTH = Number(process.env.AZ ?? 60);
const ELEVATION = Number(process.env.EL ?? 26);
const P0 = k.fitProjection(FIT, MACHINE_W, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0] + 4, P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameNX = (o) => G.frameOf(o, [-1, 0, 0], Y, Zv);
const frameDown = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);

// ---------------------------------------------------------------- shared live geometry
// The cradle, rotary table, riser and block, for any pose. The build draws the
// rest pose with it; the page redraws it every frame with the same code.
//   pose S = { A, C, ca, cc, lift, shift: [x, y, z], feats: [{ f, p, o: [du, dv], a }] }
//   A: cradle tilt about x; C: table turn about the cradle normal;
//   ca, cc: the block turned on its own (re-clamped on a three-axis machine);
//   lift, shift: the block lifted and set down again (world).
function rotX([x, y, z], a) { const c = Math.cos(a), s = Math.sin(a); return [x, y * c - z * s, y * s + z * c]; }
function rotZ([x, y, z], a) { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c, z]; }
// the five sides of the block, in its own frame: normal, u, v. Sides 1 and 2
// (the top and the front, +y) are milled from above in the same setup: the
// front gets a slot that is open to the top.
const SIDES = [
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0], kind: "pocket" },
  { n: [0, 1, 0], u: [-1, 0, 0], v: [0, 0, 1], kind: "slot" },
  { n: [-1, 0, 0], u: [0, -1, 0], v: [0, 0, 1], kind: "hole" },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1], kind: "hole" },
  { n: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1], kind: "hole" },
];
const SETUP_OF = [0, 0, 1, 2, 3]; // which setup on three axes (0 = the first)
function liveSvg(K, G, P, S) {
  const V = G.viewOf(P);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const O = [0, 0, ZA];
  const cr = (v) => rotX(v, S.A);
  const tb = (v) => cr(rotZ(v, S.C));
  const pt = (v) => tb(rotX(rotZ(v, S.cc), S.ca));
  const XA = [1, 0, 0], YA = [0, 1, 0], ZA3 = [0, 0, 1];
  const pc = add(add(O, S.shift), [0, 0, S.lift]);
  const fc = (u, v, a, o) => ({ o, a, u, v });
  const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const solid = (paths, style) => K.solidSvg(paths, { tone: "mid", ...style });
  const f2 = (v) => v.toFixed(2);
  const poly = (pts) => "M" + pts.map((p) => { const [x, y] = K.iso(p, P); return f2(x) + " " + f2(y); }).join("L") + "Z";
  // cheeks: extruded along x, profile in (y', z')
  const cheekF = fc(cr(YA), cr(ZA3), XA, O);
  const cheek = (s0, s1) => solid(G.prismOf(cheekF, rect(-CHEEK.y, CHEEK.z0, CHEEK.y, CHEEK.z1), s0, s1, P), { tone: "mid" });
  const trunF = fc(cr(YA), cr(ZA3), XA, O);
  const trun = (s0, s1) => {
    const out = solid(G.disc(s0, s1, TRUN.r, trunF, P), { tone: "mid", crease: "lo" });
    return out;
  };
  const far = trun(-TRUN.x1, -TRUN.x0) + cheek(-CHEEK.x1, -CHEEK.x0);
  const nearSide = cheek(CHEEK.x0, CHEEK.x1) + trun(TRUN.x0, TRUN.x1);
  // the stack in the cradle: plate, table, riser, block
  const plateF = fc(cr(XA), cr(YA), cr(ZA3), O);
  const plate = solid(G.prismOf(plateF, rect(-PLATE.x, -PLATE.y, PLATE.x, PLATE.y), PLATE.z0, PLATE.z1, P), { tone: "mid" });
  const tableF = fc(tb(XA), tb(YA), cr(ZA3), O);
  const up = dot(cr(ZA3), V) > 0;
  let slots = "";
  if (up) {
    const s = TABLE_Z[1] + 0.05;
    const list = [0, 1, 2, 3].map((i) => {
      const a = (i * Math.PI) / 2;
      const r0 = 15, r1 = 33, w = 1.3;
      const c = [Math.cos(a), Math.sin(a)], n = [-Math.sin(a), Math.cos(a)];
      const q = (r, side) => add(O, tb([c[0] * r + n[0] * w * side, c[1] * r + n[1] * w * side, s]));
      return poly([q(r0, -1), q(r1, -1), q(r1, 1), q(r0, 1)]);
    });
    slots = '<path class="iso-line" data-tone="lo" d="' + list.join("") + '"/>';
  }
  const table = solid(G.disc(TABLE_Z[0], TABLE_Z[1], TABLE_R, tableF, P), { tone: "mid" }) + slots;
  const riser = solid(G.disc(RISER.z[0], RISER.z[1], RISER.r, tableF, P), { tone: "mid", crease: "lo" });
  const cubeF = fc(pt(XA), pt(YA), pt(ZA3), pc);
  let block = solid(G.prismOf(cubeF, rect(-H, -H, H, H), -H, H, P), { tone: "hi", lit: true });
  // machined features on the sides that face the viewer
  const quad = (F, u0, v0, u1, v1) => {
    const n = pt(F.n), u = pt(F.u), v = pt(F.v);
    if (dot(n, V) < 0.03) return "";
    const c0 = add(pc, mul(n, H + 0.05));
    const on = (du, dv) => add(add(c0, mul(u, du)), mul(v, dv));
    return '<path class="fa-pocket" d="' + poly([on(u0, v0), on(u1, v0), on(u1, v1), on(u0, v1)]) + '"/>';
  };
  for (const ft of S.feats) {
    if (ft.p <= 0.001 || ft.a <= 0.01) continue;
    const sd = SIDES[ft.f];
    if (sd.kind === "slot") {
      // a slot through the top edge: seen on the front and on the top
      const w = 6, d = 12 * ft.p;
      const out = quad(sd, -w, H - d, w, H) + quad(SIDES[0], -w, H - 8 * ft.p, w, H);
      block += ft.a < 0.99 ? '<g opacity="' + ft.a.toFixed(2) + '">' + out + "</g>" : out;
      continue;
    }
    const n = pt(sd.n), u = pt(sd.u), v = pt(sd.v);
    if (dot(n, V) < 0.03) continue;
    const c0 = add(pc, mul(n, H + 0.05));
    const on = (du, dv) => add(add(c0, mul(u, du)), mul(v, dv));
    const ring = (cu, cv, r, m = 28) => Array.from({ length: m }, (_, i) => on(cu + r * Math.cos((i / m) * 6.2832), cv + r * Math.sin((i / m) * 6.2832)));
    let out = "";
    if (sd.kind === "pocket") {
      const hu = 12 * ft.p, hv = 7 * ft.p, rr = Math.min(3, hu, hv);
      const pts = [];
      for (const [cx, cy, a0] of [[hu - rr, hv - rr, 0], [-hu + rr, hv - rr, 1], [-hu + rr, -hv + rr, 2], [hu - rr, -hv + rr, 3]])
        for (let i = 0; i <= 4; i++) { const a = ((a0 + i / 4) * Math.PI) / 2; pts.push(on(ft.o[0] + cx + rr * Math.cos(a), ft.o[1] + cy + rr * Math.sin(a))); }
      out += '<path class="fa-pocket" d="' + poly(pts) + '"/>';
    } else {
      out += '<path class="fa-pocket" d="' + poly(ring(ft.o[0], ft.o[1], HOLE_R * ft.p)) + '"/>';
      if (ft.p > 0.5) out += '<path class="fa-floor" d="' + poly(ring(ft.o[0], ft.o[1], HOLE_R * ft.p - 2)) + '"/>';
      if (Math.hypot(ft.o[0], ft.o[1]) > 0.6) {
        const [gx, gy] = K.iso(on(0, 0), P);
        out += '<path class="fa-ghost" d="' + poly(ring(0, 0, HOLE_R)) + '"/><circle class="fa-ghost-dot" cx="' + f2(gx) + '" cy="' + f2(gy) + '" r="0.9"/>';
      }
    }
    block += ft.a < 0.99 ? '<g opacity="' + ft.a.toFixed(2) + '">' + out + "</g>" : out;
  }
  const stack = [plate, table, riser, block];
  if (!up) stack.reverse();
  return far + stack.join("") + nearSide;
}


// The position gauge: where each side's feature sits relative to the zero
// point of the first setup, seen face-on and enlarged. Rings every 0.02 mm out
// to 0.10 mm at the rim (radius 46 in gauge units). One dot per side done.
function gaugeSvg(feats, offsets) {
  const RR = 46, per = RR / 0.1; // gauge units per mm
  const f2 = (v) => v.toFixed(2);
  const out = [];
  out.push('<path class="iso-line" data-tone="faint" d="' + [1, 2, 3, 4].map((i) => { const r = (i * RR) / 5; return "M" + f2(-r) + " 0A" + f2(r) + " " + f2(r) + " 0 1 0 " + f2(r) + " 0A" + f2(r) + " " + f2(r) + " 0 1 0 " + f2(-r) + " 0Z"; }).join("") + '"/>');
  out.push('<path class="iso-line" data-tone="lo" d="M' + -RR + ' 0H' + RR + "M0 " + -RR + "V" + RR + '"/>');
  const done = feats.filter((f) => f.p > 0.5 && f.a > 0.01);
  const pts = done.map((f) => { const o = offsets[f.f]; return [o.mm * Math.cos(o.ang) * per, -o.mm * Math.sin(o.ang) * per, f]; });
  const lastPt = pts[pts.length - 1];
  if (lastPt && Math.hypot(lastPt[0], lastPt[1]) > 1) out.push('<path class="fa-stack" d="M0 0L' + f2(lastPt[0]) + " " + f2(lastPt[1]) + '"/>');
  pts.forEach(([x, y, f], i) => {
    const latest = i === pts.length - 1;
    out.push('<circle class="' + (latest ? "fa-dot-now" : "fa-dot") + '" cx="' + f2(x) + '" cy="' + f2(y) + '" r="' + (latest ? 3 : 2.2) + '" opacity="' + f.a.toFixed(2) + '"/>');
  });
  out.push('<circle class="fa-zero" r="1.4"/>');
  return out.join("");
}

// ---------------------------------------------------------------- recorder
// The head is recorded at rest and, as the piece "z", moved down until the
// end mill touches the block's top: settle orders it for both, and the audit
// proves the two poses clear.
const DOWN = [0, 0, ZA + H - TIP_REST];
const R = A.recorder(P, { order: [], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "" } = {}) {
  const z = attrs.includes('data-g="z"');
  return R.put({ name, at: ref, bias, svg, shapes, attrs, piece: z ? "z" : "", move: z ? DOWN : [0, 0, 0] });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const zAttr = (g) => (g === "z" ? ' data-g="z"' : "");
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", g = "s", ...opts } = {}) {
  const ground = name.startsWith("stand.");
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, ...(ground ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], { attrs: zAttr(g), ...opts });
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", g = "s", ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], { attrs: zAttr(g), ...opts });
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", g = "s", ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], { attrs: zAttr(g), ...opts });
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", g = "s", steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], { attrs: zAttr(g), ...opts });
}

// ---------------------------------------------------------------- floor and base
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -4), FLOOR, 2, P)}"/>`];
for (const [x, y] of k.corners(BASE, 16)) post("stand.foot", x, y, 9, FLOOR, 0, { tone: "lo" }, { steps: 6 });
{
  const bolts = k.corners(BASE, 8);
  const tray = { x: -96, y: -62, w: 192, d: 146, r: 6 };
  const extra =
    L(k.planOutline(k.insetPlan(BASE, 4), BASE_TOP, P, 3), { tone: "faint" }) +
    L(k.planOutline(tray, BASE_TOP, P, 4), { tone: "lo" }) +
    L(k.planOutline(k.insetPlan(tray, 6), BASE_TOP, P, 4), { tone: "faint" }) +
    L(bolts.map(([x, y]) => k.ring(x, y, 2.4, BASE_TOP, P, 14)).join(""), { tone: "lo" }) +
    Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.5 });
  // a nameplate on the front of the casting, rule lines for its print
  const fy = BASE.y + BASE.d;
  const plate = [
    `<g transform="${planeOf(fy)}"><path class="fa-card" d="${flatRect(-102, 7, -58, 19, 1.2, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-97 -15.8H-66M-97 -13H-76M-97 -10.2H-70"/></g>`,
    Dt([[-100, fy, 17.6], [-60, fy, 17.6], [-100, fy, 8.4], [-60, fy, 8.4]].map(at), { size: 0.42 }),
  ].join("");
  box("stand.base", BASE, 0, BASE_TOP, { tone: "lo" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(BASE, 6, P, 3), { tone: "faint" }), extra: extra + plate });
}

// ---------------------------------------------------------------- trunnion supports, bearing caps, A-axis motor
for (const side of [-1, 1]) {
  const plan = side > 0 ? { x: SUP.x0, y: -SUP.y, w: SUP.x1 - SUP.x0, d: 2 * SUP.y, r: 2 } : { x: -SUP.x1, y: -SUP.y, w: SUP.x1 - SUP.x0, d: 2 * SUP.y, r: 2 };
  const fy = SUP.y;
  const cx = side * (SUP.x0 + SUP.x1) / 2;
  const bolts = [[cx - 8, fy, BASE_TOP + 12], [cx + 8, fy, BASE_TOP + 12]];
  const foot = { x: plan.x - 4, y: plan.y - 4, w: plan.w + 8, d: plan.d + 8, r: 2 };
  box(`sup.foot${side}`, foot, BASE_TOP, BASE_TOP + 6, { tone: "mid", crease: "lo" }, { bevel: 0.4, extra: Dt(k.corners(foot, 3.5).map(([x, y]) => at([x, y, BASE_TOP + 6])), { size: 0.42 }) });
  box(`sup.body${side}`, plan, BASE_TOP + 6, SUP.z1, { tone: "mid" }, { bevel: 0.6, inner: L(k.sideSeam(plan, SUP.z1 - 8, P, 2), { tone: "faint" }), extra: Dt(bolts.map(at), { size: 0.42 }) });
  // the bearing cap on the outside face, a bolt circle round it
  const F = side > 0 ? frameX([SUP.x1, 0, ZA]) : frameNX([-SUP.x1, 0, ZA]);
  discAt(`sup.cap${side}`, F, 0, CAP.x1 - SUP.x1, CAP.r, { tone: "mid", crease: "lo" }, { extra: Dt(G.dotsOf(F, CAP.x1 - SUP.x1, CAP.r - 4, 8, P, { phase: 0.2, fade: [0.04, 0.4] }), { size: 0.42 }) + L(G.circleOf(F, CAP.x1 - SUP.x1, CAP.r - 8, P, 48), { tone: "faint" }) });
  if (side > 0) {
    const Fm = frameX([CAP.x1, 0, ZA]);
    const fins = G.ribsOf(Fm, 2.5, MOTOR.x1 - CAP.x1 - 2.5, MOTOR.r, 20, P, { fade: [0.04, 0.42], seams: true });
    turned("sup.motor", Fm, [[0, MOTOR.r], [MOTOR.x1 - CAP.x1, MOTOR.r]], { tone: "mid", crease: "lo" }, { inner: k.fadedSvg(fins, { tone: "lo" }) });
    discAt("sup.motor-cap", Fm, MOTOR.x1 - CAP.x1, MOTOR.cap - CAP.x1, 12, { tone: "mid" }, { extra: Dt([at([MOTOR.cap, 0, ZA])], { size: 0.5, tone: "hi" }) });
    box("sup.tbox", { x: CAP.x1 + 5, y: -5, w: 12, d: 10, r: 1 }, ZA + MOTOR.r, ZA + MOTOR.r + 7, { tone: "mid" }, { bevel: 0.3 });
  }
}

// ---------------------------------------------------------------- the cradle, table and block (live)
const REST = { A: 0, C: 0, ca: 0, cc: 0, lift: 0, shift: [0, 0, 0], feats: [] };
let liveItem;
{
  const O = [0, 0, ZA];
  const cheekF = G.frameOf(O, X, Y, Zv);
  const plateF = G.frameOf(O, Zv, X, Y);
  const shapes = [
    R.solid(A.disc(cheekF, -TRUN.x1, -TRUN.x0, TRUN.r, { name: "live.trunnion" })),
    R.solid(A.prism(cheekF, [[-CHEEK.y, CHEEK.z0], [CHEEK.y, CHEEK.z0], [CHEEK.y, CHEEK.z1], [-CHEEK.y, CHEEK.z1]], -CHEEK.x1, -CHEEK.x0, { name: "live.cheek" })),
    R.solid(A.prism(cheekF, [[-CHEEK.y, CHEEK.z0], [CHEEK.y, CHEEK.z0], [CHEEK.y, CHEEK.z1], [-CHEEK.y, CHEEK.z1]], CHEEK.x0, CHEEK.x1, { name: "live.cheek" })),
    R.solid(A.disc(cheekF, TRUN.x0, TRUN.x1, TRUN.r, { name: "live.trunnion" })),
    R.solid(A.prism(plateF, [[-PLATE.x, -PLATE.y], [PLATE.x, -PLATE.y], [PLATE.x, PLATE.y], [-PLATE.x, PLATE.y]], PLATE.z0, PLATE.z1, { name: "live.plate" })),
    R.solid(A.disc(plateF, TABLE_Z[0], TABLE_Z[1], TABLE_R, { name: "live.table" })),
    R.solid(A.disc(plateF, RISER.z[0], RISER.z[1], RISER.r, { name: "live.riser" })),
    R.solid(A.box([-H, -H, ZA - H], [H, H, ZA + H], { name: "live.block" })),
  ];
  solids += 8;
  liveItem = put("live.cradle", O, liveSvg(k, G, P, REST), shapes, { attrs: ' data-live=""' });
}

// ---------------------------------------------------------------- column, Z ways, tool magazine, signal lamp
{
  const inner = L(k.sideSeam(COL, BASE_TOP + 16, P, 2) + k.sideSeam(COL, COL_TOP - 12, P, 2), { tone: "faint" });
  box("col", COL, BASE_TOP, COL_TOP, { tone: "mid" }, { bevel: 0.8, inner });
  const cap = k.insetPlan(COL, 3);
  box("col.cap", cap, COL_TOP, COL_TOP + 4, { tone: "mid", crease: "lo" }, { bevel: 0.4, extra: Dt(k.corners(cap, 5).map(([x, y]) => at([x, y, COL_TOP + 4])), { size: 0.42 }) });
  for (const x of [-40, 28]) {
    const way = { x, y: ZWAY.y0, w: 12, d: ZWAY.y1 - ZWAY.y0, r: 0.5 };
    box("col.zway", way, 110, COL_TOP - 4, { tone: "mid", crease: "lo" }, { extra: Dt([120, 150, 180, 210, 240].map((z) => at([x + 6, ZWAY.y1, z])), { size: 0.4, tone: "lo" }) });
  }
  // the magazine: a carousel on the column side, tool pockets round its face
  const F = frameX([MAG.x0, MAG.y, MAG.z]);
  const pockets = Array.from({ length: 12 }, (_, i) => G.frameOf(G.pointOf(F, MAG.x1 - MAG.x0, MAG.r - 6, (i / 12) * Math.PI * 2 + 0.1), X, Y, Zv));
  const face = [
    L(pockets.map((Fp) => G.circleOf(Fp, 0, 3, P, 16)).join(""), { tone: "lo" }),
    Dt(pockets.map((Fp) => at(Fp.o)), { size: 0.5, tone: "mid" }),
    L(G.circleOf(F, MAG.x1 - MAG.x0, MAG.r - 12, P, 64), { tone: "faint" }),
  ].join("");
  discAt("mag.disc", F, 0, MAG.x1 - MAG.x0, MAG.r, { tone: "mid" }, { extra: face });
  discAt("mag.hub", F, MAG.x1 - MAG.x0, MAG.x1 - MAG.x0 + 5, 8, { tone: "mid" }, { extra: Dt([at([MAG.x1 + 5, MAG.y, MAG.z])], { size: 0.55, tone: "hi" }) });
  // a signal lamp on the column cap: lit while the spindle cuts
  post("col.lamp-foot", 30, -150, 5, COL_TOP + 4, COL_TOP + 7, { tone: "mid" }, { steps: 20 });
  post("col.lamp-post", 30, -150, 2, COL_TOP + 7, COL_TOP + 16, { tone: "mid" }, { steps: 16 });
  post("col.lamp", 30, -150, 4.2, COL_TOP + 16, COL_TOP + 24, { tone: "hi", crease: "lo" }, { steps: 24, attrs: ' data-lamp=""' });
}

// ---------------------------------------------------------------- spindle head (Z)
let toolItem;
{
  const ZG = { g: "z" };
  const inner = L(k.sideSeam(HEAD, HT - 8, P, 2), { tone: "faint" });
  const fy = HEAD.y + HEAD.d;
  const slots = [0, 1, 2].map((i) => flatRect(-24, HB + 10 + i * 5, 8, HB + 12.2 + i * 5, 1.1, 3)).join("");
  const extra = `<g transform="${planeOf(fy)}">${L(slots, { tone: "lo" })}</g>` + Dt([[-29, fy, HB + 5], [29, fy, HB + 5], [-29, fy, HT - 5], [29, fy, HT - 5]].map(at), { size: 0.42 });
  box("z.head", HEAD, HB, HT, { tone: "mid" }, { ...ZG, bevel: 0.8, inner, extra });
  // spindle motor on top: fins between two seams, a terminal box beside it
  const Fm = G.frameOf([0, -14, HT], Zv, X, Y);
  const fins = G.ribsOf(Fm, 2, 14, 17, 22, P, { fade: [0.04, 0.42], seams: true });
  turned("z.motor", Fm, [[0, 17], [16, 17]], { tone: "mid", crease: "lo" }, { ...ZG, inner: k.fadedSvg(fins, { tone: "lo" }) });
  discAt("z.motor-cap", Fm, 16, 19, 12, { tone: "mid" }, { ...ZG, extra: Dt([at([0, -14, HT + 19])], { size: 0.5, tone: "hi" }) });
  box("z.tbox", { x: 18, y: -22, w: 8, d: 16, r: 1 }, HT, HT + 9, { tone: "mid" }, { ...ZG, bevel: 0.3 });
  // nose, tool holder (V-flange, collet, nut) and the end mill
  const Fz = frameDown([0, 0, HB]);
  discAt("z.nose", Fz, 0, 9, 20, { tone: "mid" }, { ...ZG, extra: Dt(G.dotsOf(Fz, 9, 17, 8, P, { fade: [0.04, 0.4] }), { size: 0.4 }) });
  discAt("z.flange", Fz, 9, 13, 16, { tone: "mid", crease: "lo" }, ZG);
  discAt("z.groove", Fz, 13, 15, 13, { tone: "lo", crease: "none" }, ZG);
  discAt("z.flange2", Fz, 15, 18, 16, { tone: "mid", crease: "lo" }, ZG);
  turned("z.collet", Fz, [[18, 11.5], [24, 9.5], [25, 9.5]], { tone: "mid", crease: "lo" }, ZG);
  discAt("z.nut", Fz, 25, TOOL_S, 10, { tone: "hi", crease: "lo" }, { ...ZG, steps: 8 });
  const flutes = G.ribsOf(Fz, TOOL_S, TOOL_S + TOOL_L, TOOL_R, 4, P, { twist: 1.4, least: 0.15 });
  solids++;
  toolItem = put("z.tool", [0, 0, HB - TOOL_S - TOOL_L / 2], k.solidSvg(G.disc(TOOL_S, TOOL_S + TOOL_L, TOOL_R, Fz, P), { tone: "hi", crease: "lo" }) + `<g data-flutes="">${L(flutes, { tone: "mid" })}</g>`, [R.solid(A.disc(Fz, TOOL_S, TOOL_S + TOOL_L, TOOL_R, { name: "z.tool" }))], { attrs: ' data-g="z"' });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: [0, 0.5, 1] });
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const LOUPE = (() => {
  const r = Math.min(100, HEIGHT / 2 - 14);
  return { cx: WIDTH - r - 14, cy: HEIGHT / 2 + 6, r };
})();
const loupe = [
  `<g class="fa-loupe" transform="translate(${LOUPE.cx.toFixed(1)} ${LOUPE.cy.toFixed(1)})">`,
  `<circle class="fa-lens" r="${LOUPE.r}"/>`,
  `<g data-gauge="" transform="scale(${(LOUPE.r / 46).toFixed(3)})">${gaugeSvg([], [])}</g>`,
  `<circle class="fa-rim" r="${LOUPE.r}"/>`,
  `</g>`,
].join("");
const body = [...halo, ...groups, loupe];

const LABEL_NL =
  "Een vijfassig bewerkingscentrum met een draai-kanteltafel: een gegoten bed op stelvoeten, twee lagerbokken met daartussen een wieg die om de A-as kantelt, met een motor op de rechter lagerbok. In de wieg zit een ronde tafel die om de C-as draait, met een kort opspanblok en daarop een blok van 60 mm. Achter staat een kolom met een gereedschapsmagazijn en een spilkop die in Z op en neer beweegt, met een vingerfrees. Het blok krijgt op vijf kanten een kamer of een gat: drieassig met omspannen, met 3+2 of simultaan.";
const LABEL_EN =
  "A five-axis machining centre with a trunnion table: a cast base on levelling feet, two trunnion supports holding a cradle that tilts about the A axis, with a motor on the right support. In the cradle sits a round table turning about the C axis, with a short clamping riser and a 60 mm block on it. Behind stands a column with a tool magazine and a spindle head moving up and down in Z, holding an end mill. The block gets a pocket or a hole on five sides: three-axis with re-clamping, 3+2, or simultaneous.";

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
  --fa-hair:rgba(240,233,218,.12);--fa-accent:#5C9FAE;--fa-hole:#071719;--fa-floor:#0C2228;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --fa-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --fa-hair:rgba(11,41,27,.14);--fa-accent:#276F81;--fa-hole:#9FAFA8;--fa-floor:#C3CEC9;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--fa-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:146px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:300px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--fa-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--fa-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:62px!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap}
.iso-plate-corner[data-corner="readout"]{bottom:82px!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.fa-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fa-acc{color:var(--fa-accent);font-weight:600}
.fa-mute{color:var(--anatomy-muted)}
.fa-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:8px}
.fa-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.fa-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.fa-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.fa-row{display:flex;gap:4px;height:44px}
.fa-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--fa-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--fa-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.fa-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.fa-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--fa-accent);color:var(--fa-accent);font-weight:600}
.fa-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.fa-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.fa-pocket{fill:var(--fa-hole);stroke:var(--anatomy-hi);stroke-width:.5px;stroke-linejoin:round}
.fa-floor{fill:var(--fa-floor);stroke:var(--anatomy-lo);stroke-width:.35px}
.fa-ghost{fill:none;stroke:var(--fa-accent);stroke-width:1px}
.fa-lens{fill:var(--anatomy-face);stroke:none}
.fa-rim{fill:none;stroke:var(--anatomy-mid);stroke-width:1px}
.fa-stack{stroke:var(--fa-accent);stroke-width:1.2px;fill:none;stroke-linecap:round}
.fa-dot{fill:var(--anatomy-hi);stroke:none}
.fa-dot-now{fill:var(--fa-accent);stroke:var(--anatomy-card);stroke-width:.8px}
.fa-zero{fill:var(--anatomy-hi);stroke:none}
.fa-ghost-dot{fill:var(--fa-accent);stroke:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .4s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--fa-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const latheSource = readFileSync(join(SKILL, "kit/lathe.mjs"), "utf8").replace(/^import .*$/m, "").replace(/^export /gm, "");
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, disc, prismOf, ribsOf, dot3, add3, mul3 };})();\n`;

const live = `
const P = ${JSON.stringify(P)};
const ZA = ${ZA}, H = ${H}, HB = ${HB}, TOOL_S = ${TOOL_S}, TOOL_L = ${TOOL_L}, TOOL_R = ${TOOL_R}, DZ_CUT = ${DZ_CUT};
const CHEEK = ${JSON.stringify(CHEEK)}, PLATE = ${JSON.stringify(PLATE)}, TABLE_R = ${TABLE_R}, TABLE_Z = ${JSON.stringify(TABLE_Z)};
const RISER = ${JSON.stringify(RISER)}, TRUN = ${JSON.stringify(TRUN)};
const HOLE_R = ${HOLE_R}, LIFT = ${LIFT}, SHIFT = ${SHIFT}, SHIFT_DIR = ${JSON.stringify(SHIFT_DIR)};
const SETUP_MIN = ${SETUP_MIN}, RECLAMP_MIN = ${RECLAMP_MIN}, BATCH = ${BATCH}, BATCHES = ${BATCHES}, ERR = ${ERR}, FACES = ${FACES}, SETUPS3 = ${SETUPS3};
const SIDES = ${JSON.stringify(SIDES)}, SETUP_OF = ${JSON.stringify(SETUP_OF)};
${rotX.toString()}
${rotZ.toString()}
${liveSvg.toString()}
${gaugeSvg.toString()}
const extraMin = ${extraMin.toString()};
const K = { solidSvg, iso };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", setups: "Setups", reclamps: "re-clamps", side: "side", of: "of", err: "Side 1 ↔ 5", assumed: "assumed", none: "no re-clamp error, one zero point", perPart: "Per part", perBatch: "per batch", reclamp0: "Re-clamping", sides: "sides in", setupsIn: "setups", minPart: "min per part", batch: "Batch (50)", year: "h/year", saves: "Saves", vs3: "h/year on 3-axis", tilt: "tilt and lock, then X Y Z", all: "all five axes at once", same: "as 3+2", cost: "Costlier: CAM + simulation; overkill for a block", modes: { three: "3-axis", plus: "3+2", sim: "simultaneous" } }
  : { dec: ",", setups: "Opspanningen", reclamps: "omspannen", side: "kant", of: "van", err: "Kant 1 ↔ 5", assumed: "aanname", none: "geen omspanfout, één nulpunt", perPart: "Per stuk", perBatch: "per serie", reclamp0: "Omspannen", sides: "kanten in", setupsIn: "opspanningen", minPart: "min per stuk", batch: "Serie (50)", year: "u/jaar", saves: "Scheelt", vs3: "u/jaar op 3-assig", tilt: "kantelen, vastzetten, dan X Y Z", all: "alle vijf assen tegelijk", same: "als 3+2", cost: "Duurder: CAM + simulatie; voor een blok overkill", modes: { three: "drieassig", plus: "3+2", sim: "simultaan" } };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);

const stage = document.querySelector(".fa-stage");
const svg = stage.querySelector("svg");
const el = {
  live: svg.querySelector("[data-live]"), gauge: svg.querySelector("[data-gauge]"), lamp: svg.querySelector("[data-lamp]"), flutes: svg.querySelector("[data-flutes]"),
  gz: [...svg.querySelectorAll('[data-g="z"]')],
};
const lines = [...document.querySelectorAll("[data-readout] .fa-line")];
const announcer = document.querySelector(".fa-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

// ------------------------------------------------ the cycle
// Five sides, one after another. Before sides 2–5: three-axis lifts the block,
// turns it and sets it down again (a re-clamp, with its shift); 3+2 and
// simultaneous tilt the cradle and turn the table. Then the head comes down,
// the cutter makes the pocket or the hole, and goes up again.
// sides 1 and 2 face up and front at rest; sides 3–5 come up with the cradle
// tilted (or the block turned) a quarter turn and the table at +90°, 0°, −90°
const ANG_A = (i) => (i < 2 ? 0 : -Math.PI / 2);
const ANG_C = (i) => (i < 2 ? 0 : (3 - i) * Math.PI / 2);
const DUR = { reclamp: 2.6, index: 1.2, down: 0.4, cut: 1.4, up: 0.4, hold: 1.2, reset: 1.4 };
function plan(mode) {
  const segs = [];
  for (let i = 0; i < FACES; i++) {
    if (SETUP_OF[i] > 0 && SETUP_OF[i] !== SETUP_OF[i - 1]) segs.push({ k: mode === "three" ? "reclamp" : "index", i, d: mode === "three" ? DUR.reclamp : DUR.index });
    segs.push({ k: "down", i, d: DUR.down }, { k: "cut", i, d: DUR.cut }, { k: "up", i, d: DUR.up });
  }
  segs.push({ k: "hold", i: FACES - 1, d: DUR.hold }, { k: "reset", i: FACES - 1, d: DUR.reset });
  let t = 0;
  for (const s of segs) { s.t0 = t; t += s.d; }
  return { segs, total: t };
}
const PLANS = { three: plan("three"), plus: plan("plus"), sim: plan("sim") };
// where each side's feature lands, in the block's own frame: the tool cuts at
// the same spot in the machine, so a block shifted by a re-clamp gets its
// feature off the nominal place by that shift
function offsetsFor(mode) {
  return SIDES.map((sd, i) => {
    if (mode !== "three" || i === 0) return [0, 0];
    const n = SETUP_OF[i];
    if (!n) return [0, 0];
    const s = [-SHIFT_DIR[0] * SHIFT * n, -SHIFT_DIR[1] * SHIFT * n, 0];
    const b = rotZ(rotX(s, -ANG_A(i)), -ANG_C(i)); // world → block frame
    const dot = (a, c) => a[0] * c[0] + a[1] * c[1] + a[2] * c[2];
    return [dot(b, sd.u), dot(b, sd.v)];
  });
}
const OFFSETS = { three: offsetsFor("three"), plus: offsetsFor("plus"), sim: offsetsFor("sim") };
// the same shifts in true millimetres, for the gauge: i re-clamps × ERR
const ANG = Math.atan2(SHIFT_DIR[1], SHIFT_DIR[0]);
const GAUGE = { three: SIDES.map((_, i) => ({ mm: SETUP_OF[i] * ERR, ang: ANG })), plus: SIDES.map(() => ({ mm: 0, ang: 0 })) };
GAUGE.sim = GAUGE.plus;

function poseAt(mode, t) {
  const pl = PLANS[mode];
  t = ((t % pl.total) + pl.total) % pl.total;
  const seg = pl.segs.find((s) => t < s.t0 + s.d) || pl.segs[pl.segs.length - 1];
  const u = clamp((t - seg.t0) / seg.d, 0, 1);
  const i = seg.i;
  let a = ANG_A(i), c = ANG_C(i), lift = 0, shiftN = mode === "three" ? SETUP_OF[i] : 0, dz = 0, cutting = false, fade = 1;
  if (seg.k === "reclamp" || seg.k === "index") {
    const r = seg.k === "reclamp" ? smooth(0.25, 0.75, u) : smooth(0, 1, u);
    a = lerp(ANG_A(i - 1), ANG_A(i), r);
    c = lerp(ANG_C(i - 1), ANG_C(i), r);
    if (seg.k === "reclamp") { lift = smooth(0, 0.22, u) * (1 - smooth(0.78, 1, u)); shiftN = SETUP_OF[i] - 1 + smooth(0.78, 1, u); }
  } else if (seg.k === "down") dz = smooth(0, 1, u);
  else if (seg.k === "cut") { dz = 1; cutting = true; }
  else if (seg.k === "up") dz = 1 - smooth(0, 1, u);
  else if (seg.k === "reset") {
    const r = smooth(0, 1, u);
    a = lerp(ANG_A(FACES - 1), 0, r);
    c = lerp(ANG_C(FACES - 1), 0, r);
    if (mode === "three") { lift = Math.sin(Math.PI * r) * 1; shiftN = SETUP_OF[FACES - 1] * (1 - r); }
    fade = 1 - smooth(0, 0.6, u);
  }
  // simultaneous: the rotary axes keep moving while the cutter is in
  if (mode === "sim" && seg.k === "cut") {
    const w = Math.sin(Math.PI * u);
    a += 0.2 * w * Math.sin(2 * Math.PI * u);
    c += 0.3 * w * Math.sin(2 * Math.PI * u + 1);
  }
  const feats = SIDES.map((sd, j) => {
    let p = 0;
    if (j < i || (j === i && (seg.k === "up" || seg.k === "hold" || seg.k === "reset"))) p = 1;
    else if (j === i && seg.k === "cut") p = smooth(0, 1, u);
    if (seg.k === "reclamp" || seg.k === "index") p = j < i ? 1 : 0;
    return { f: j, p, o: OFFSETS[mode][j], a: fade };
  });
  const three = mode === "three";
  const sh = SHIFT * shiftN;
  return {
    A: three ? 0 : a, C: three ? 0 : c, ca: three ? a : 0, cc: three ? c : 0,
    lift: lift * LIFT, shift: [SHIFT_DIR[0] * sh, SHIFT_DIR[1] * sh, 0], feats,
    dz: dz * DZ_CUT, cutting, side: Math.min(FACES, i + 1), seg: seg.k,
  };
}

// ------------------------------------------------ drawing
const st = { mode: "plus" };
let clock = 0, spin = 0, lastLive = "", lastDz = NaN;
function draw() {
  const pose = poseAt(st.mode, clock);
  const key = [pose.A, pose.C, pose.ca, pose.cc, pose.lift, pose.shift[0]].map((v) => v.toFixed(4)).join("|") + "|" + pose.feats.map((f) => f.p.toFixed(3) + f.a.toFixed(2)).join("");
  if (key !== lastLive) { lastLive = key; el.live.innerHTML = liveSvg(K, G, P, pose); el.gauge.innerHTML = gaugeSvg(pose.feats, GAUGE[st.mode]); }
  if (pose.dz !== lastDz) {
    lastDz = pose.dz;
    const tr = translateAlong(P, [0, 0, pose.dz]);
    el.gz.forEach((n) => n.setAttribute("transform", tr));
  }
  const Fz = G.frameOf([0, 0, HB], [0, 0, -1], [1, 0, 0], [0, 1, 0]);
  const fl = G.ribsOf(Fz, TOOL_S, TOOL_S + TOOL_L, TOOL_R, 4, P, { twist: 1.4, least: 0.15, phase: spin });
  el.flutes.innerHTML = fl ? '<path class="iso-line" data-tone="mid" d="' + fl + '"/>' : "";
  if (pose.cutting) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  readout(pose);
}
function readout(pose) {
  const out = [];
  const reclamps = SETUPS3 - 1;
  const acc = (s) => '<span class="fa-acc">' + s + "</span>";
  const where = T.side + " " + pose.side + "/" + FACES;
  const min3 = extraMin(SETUPS3, 1);
  const hours = Math.round((min3 / 60) * BATCHES);
  if (st.mode === "three") {
    out.push(FACES + " " + T.sides + " " + acc(SETUPS3) + " " + T.setupsIn + " · " + where);
    out.push(T.err + ": " + reclamps + " × ±" + fmt(ERR, 2) + " (" + T.assumed + ") = " + acc("±" + fmt(reclamps * ERR, 2)) + " mm");
    out.push(T.perPart + " " + reclamps + " × " + RECLAMP_MIN + " = " + acc(reclamps * RECLAMP_MIN) + " min · " + T.perBatch + " " + reclamps + " × " + SETUP_MIN + " = " + reclamps * SETUP_MIN + " min");
    out.push(T.batch + ": " + reclamps * SETUP_MIN + " + " + reclamps * RECLAMP_MIN * BATCH + " = " + min3 + " min · ×" + BATCHES + " = " + acc(hours) + " " + T.year);
  } else {
    out.push(T.setups + " " + acc(1) + " · " + (st.mode === "plus" ? T.tilt : T.all) + " · " + where);
    out.push(T.err + ": " + acc(T.none));
    out.push(T.reclamp0 + ": " + acc(0) + " " + T.minPart + (st.mode === "sim" ? " · " + T.same : ""));
    out.push(st.mode === "plus" ? T.saves + " " + acc(hours) + " " + T.vs3 + " (" + min3 + " min × " + BATCHES + ")" : T.cost);
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
}

// ------------------------------------------------ the idle tour and the loop
const ORDER = ["three", "plus", "sim"];
let touring = !still.matches, idleTimer = 0;
function stillPose() {
  // the state after side 3: three sides done, the fourth about to come round
  const pl = PLANS[st.mode];
  const seg = pl.segs.find((s) => s.k === "up" && s.i === 2);
  clock = seg.t0 + seg.d - 0.001;
}
let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (calm) stillPose();
  else {
    const total = PLANS[st.mode].total;
    clock += dt;
    if (clock >= total) {
      clock -= total;
      if (touring) { st.mode = ORDER[(ORDER.indexOf(st.mode) + 1) % ORDER.length]; sync(); }
    }
    const pose = poseAt(st.mode, clock);
    spin = (spin + dt * (pose.dz > 0 || pose.cutting ? 9 : 1.5)) % (2 * Math.PI);
  }
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
const modeBtns = [...document.querySelectorAll("[data-mode]")];
function sync() {
  modeBtns.forEach((b) => { const on = b.dataset.mode === st.mode; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  describe();
}
function describe() {
  const hours = Math.round((extraMin(SETUPS3, 1) / 60) * BATCHES);
  const text = st.mode === "three"
    ? T.modes.three + ": " + SETUPS3 + " " + T.setups.toLowerCase() + ", ±" + fmt((SETUPS3 - 1) * ERR, 2) + " mm, " + hours + " " + T.year
    : T.modes[st.mode] + ": 1 " + T.setups.toLowerCase().replace(/en$|s$/, "") + ", " + T.none;
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function setMode(m) {
  if (m === st.mode) return;
  st.mode = m;
  clock = 0;
  lastLive = "";
  if (still.matches) stillPose();
  steer(); sync(); announce(); kick();
}
modeBtns.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
const group = document.querySelector('[data-row="mode"]');
group.addEventListener("keydown", (event) => {
  const i = ORDER.indexOf(st.mode);
  let next = -1;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % ORDER.length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + ORDER.length - 1) % ORDER.length;
  if (next < 0) return;
  event.preventDefault();
  setMode(ORDER[next]);
  modeBtns[next].focus();
});
stage.addEventListener("keydown", (event) => {
  if (["1", "2", "3"].includes(event.key)) { event.preventDefault(); setMode(ORDER[Number(event.key) - 1]); }
});
stage.addEventListener("click", () => { if (!still.matches) { touring ? steer() : (touring = true); kick(); } });
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { clock = 0; run(); } });
if (still.matches) stillPose();
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Vijfassig frezen: 3+2 of simultaan",
    hint: "Kies een werkwijze · ring 0,02 mm · fout 100× vergroot",
    three: "Drieassig",
    plus: "3+2",
    sim: "Simultaan",
    modes: "Werkwijze",
    label: LABEL_NL,
    aria: "Vijfassig bewerkingscentrum met draai-kanteltafel. Toetsen 1 tot 3 of de pijltjes kiezen drieassig met omspannen, 3+2 of simultaan.",
  },
  en: {
    title: "Five-axis milling: 3+2 or simultaneous",
    hint: "Pick a method · ring 0.02 mm · error 100× enlarged",
    three: "3-axis",
    plus: "3+2",
    sim: "Simultaneous",
    modes: "Method",
    label: LABEL_EN,
    aria: "Five-axis machining centre with a trunnion table. Keys 1 to 3 or the arrows pick three-axis with re-clamping, 3+2 or simultaneous.",
  },
};

const sN = STRINGS.nl;
const modeBtn = (key, on) => `<button type="button" class="fa-btn" role="radio" data-mode="${key}" aria-checked="${on}" tabindex="${on ? 0 : -1}">${sN[key]}</button>`;
const controls = `<div class="fa-controls"><div class="fa-row" data-row="mode" role="radiogroup" aria-label="${sN.modes}">${modeBtn("three", false)}${modeBtn("plus", true)}${modeBtn("sim", false)}</div></div>`;

const plate = k.plateHtml({
  fig: "Fig 2",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="fa-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="fa-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="fa-line"></span>'.repeat(4)}</span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";if(!en)return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
document.querySelector("[data-hint]").textContent=s.hint;
["three","plus","sim"].forEach(function(m){document.querySelector('[data-mode="'+m+'"]').textContent=s[m];});
document.querySelector('[data-row="mode"]').setAttribute("aria-label",s.modes);
var st=document.querySelector(".fa-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + latheScript + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: ${FACES} sides in ${SETUPS3} setups → 1: ${MIN3} min/batch, ${(MIN3 / 60) * BATCHES} h/year, ${(SETUPS3 - 1) * RECLAMP_MIN} min/part · error ±${((SETUPS3 - 1) * ERR).toFixed(2)} mm`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)} · head travel ${DZ_CUT}`);

A.auditOrExit(R, P, { frames: [0.25, 0.5, 0.75, 1], apart: true });
