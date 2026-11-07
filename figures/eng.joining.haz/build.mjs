// Dev tool, not shipped. Builds the standalone figure for the topic Booglassen
// (module Lassen en verbinden), level 4: the lesson eng.joining.metallurgy
// ("Wat warmte met het staal doet: WBZ, voorwarmen en lastige metalen"). It
// opens sensibly at levels 1–3 too (the other arc lessons keep eng.joining.mig).
//
//   node figures/eng.joining.haz/build.mjs            build the page
//   node figures/eng.joining.haz/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.joining.haz.html: one offline page
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
const OUT = join(ROOT, "src/content/courses/figures/eng.joining.haz.html");

// ---------------------------------------------------------------- the model
// A section cut through a double fillet weld (T-joint, a6, legs 9 mm) on an
// S355 flange of thickness d. The steel is the lesson's crane flange:
// C 0.17, Mn 1.50, Cr+Mo+V 0.10, Ni+Cu 0.30 (%).
//   carbon equivalent  CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15     (EN 1011-2, method A) → 0.46
// Cooling time t8/5 (EN 1011-2, Annex D), Q heat input in kJ/mm, T0 preheat °C,
// d in mm; shape factors for a fillet weld on a T-joint (Table D.1): F3 = 0.67,
// F2 = 0.67 (upper end of 0.45–0.67):
//   3D (thick plate)  t3 = (6700 − 5·T0) · Q · (1/(500−T0) − 1/(800−T0)) · F3
//   2D (thin plate)   t2 = (4300 − 4.3·T0) · 10⁵ · Q²/d² · ((1/(500−T0))² − (1/(800−T0))²) · F2
//   t8/5 = the larger of the two: t2 above the transition thickness is below t3.
// The cooling curve on the recorder follows the same heat-flow models:
// 3D T = T0 + a/t, 2D T = T0 + b/√t, with a and b solved for that t8/5.
// Preheat to avoid hydrogen cracking (EN 1011-2, Annex C, method B, CET):
//   Tp = 697·CET + 160·tanh(d/35) + 62·HD^0.35 + (53·CET − 32)·Q − 328   [°C]
//   CET = C + (Mn+Mo)/10 + (Cr+Cu)/20 + Ni/40
// valid for CET 0.2–0.5, d 10–90 mm, HD 1–20 ml/100 g, Q 0.5–4 kJ/mm. The
// certificate only gives sums, so the split is an assumption (Mo 0.03, Cr 0.05,
// V 0.02, Cu 0.15, Ni 0.15, Si 0.30): CET 0.34. Method B is used because it is
// a formula; method A (the lesson's CEV) reads the same trade-offs off charts.
// Maximum HAZ hardness, an estimate (Düren 1986, not in EN 1011-2):
//   HV = 2019·(C·(1 − 0.5·log t8/5) + 0.3·(CEB − C)) + 66·(1 − 0.8·log t8/5),
//   CEB = C + Si/11 + Mn/8 + Cu/9 + Cr/5 + Ni/17 + Mo/6 + V/3,
//   capped at fully martensitic 802·C + 305 and floored at 160.
// Qualitative bands (hedged, shown with ≈): t8/5 under 7 s short (hard HAZ: the
// estimate passes 380 HV there), 7–25 s moderate, over 25 s long (soft, less
// tough HAZ); hardness above 380
// HV10 is over the ISO 15614-1 limit for steel groups 1 and 2. Crack risk:
// low when T0 ≥ Tp, watch within 25 °C below Tp, high further below.
// The drawn HAZ width is schematic: it grows with t8/5 (more heat, slower
// cooling, wider zone).
const COMP = { C: 0.17, Mn: 1.5, CrMoV: 0.1, NiCu: 0.3 };
const SPLIT = { Si: 0.3, Mo: 0.03, Cr: 0.05, V: 0.02, Cu: 0.15, Ni: 0.15 };
const cevOf = (c) => c.C + c.Mn / 6 + c.CrMoV / 5 + c.NiCu / 15;
const CEV = cevOf(COMP);
const CET = COMP.C + (COMP.Mn + SPLIT.Mo) / 10 + (SPLIT.Cr + SPLIT.Cu) / 20 + SPLIT.Ni / 40;
const CEB = COMP.C + SPLIT.Si / 11 + COMP.Mn / 8 + SPLIT.Cu / 9 + SPLIT.Cr / 5 + SPLIT.Ni / 17 + SPLIT.Mo / 6 + SPLIT.V / 3;
const C_PCT = COMP.C;
const F2 = 0.67;
const F3 = 0.67;
const t3Of = (T0, Q) => (6700 - 5 * T0) * Q * (1 / (500 - T0) - 1 / (800 - T0)) * F3;
const t2Of = (T0, Q, d) => (4300 - 4.3 * T0) * 1e5 * (Q * Q) / (d * d) * ((1 / (500 - T0)) ** 2 - (1 / (800 - T0)) ** 2) * F2;
const t85Of = (T0, Q, d) => Math.max(t3Of(T0, Q), t2Of(T0, Q, d));
const flowOf = (T0, Q, d) => (t2Of(T0, Q, d) > t3Of(T0, Q) ? 2 : 3);
const dtOf = (T0, Q) => 10 * Math.sqrt(t2Of(T0, Q, 10) / t3Of(T0, Q)); // t2 ∝ 1/d²: t2(d) = t3 at d = 10·√(t2(10)/t3)
const hvOf = (t) => {
  const lg = Math.log10(t);
  const hv = 2019 * (C_PCT * (1 - 0.5 * lg) + 0.3 * (CEB - C_PCT)) + 66 * (1 - 0.8 * lg);
  return Math.max(160, Math.min(802 * C_PCT + 305, hv));
};
const tpOf = (d, H, Q) => 697 * CET + 160 * Math.tanh(d / 35) + 62 * H ** 0.35 + (53 * CET - 32) * Q - 328;
const hazOf = (t) => 1.3 * t ** 0.4; // schematic HAZ width, mm
const bandOf = (t) => (t < 7 ? 0 : t <= 25 ? 1 : 2);
const riskOf = (T0, tp) => (T0 >= tp ? 0 : T0 >= tp - 25 ? 1 : 2);
const curveOf = (T0, Q, d) => {
  const t = t85Of(T0, Q, d);
  if (flowOf(T0, Q, d) === 3) {
    const a = t / (1 / (500 - T0) - 1 / (800 - T0));
    return (s) => T0 + a / s;
  }
  const b = Math.sqrt(t / ((1 / (500 - T0)) ** 2 - (1 / (800 - T0)) ** 2));
  return (s) => T0 + b / Math.sqrt(s);
};

const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
const must = (ok, what) => { if (!ok) throw new Error(what); };
near(CEV, 0.46, 1e-9, "lesson CEV 0.46 (40 mm S355 crane flange)");
near(cevOf({ C: 0.2, Mn: 1.2, CrMoV: 0.15, NiCu: 0.15 }), 0.44, 1e-9, "recall CEV 0.44");
must(t85Of(20, 1, 30) < t85Of(20, 1, 10), "30 mm cools faster than 10 mm at the same heat input");
must(t85Of(150, 1, 40) > t85Of(20, 1, 40), "preheat lengthens t8/5");
must(t85Of(20, 2, 40) > t85Of(20, 1, 40), "more heat input lengthens t8/5");
must(hvOf(t85Of(20, 1, 40)) > hvOf(t85Of(20, 2.5, 10)), "short t8/5 is harder");
must(tpOf(40, 10, 1) > 100, "40 mm S355 at CEV 0.46 needs preheat (lesson: almost certainly)");
must(tpOf(40, 5, 1) < tpOf(40, 10, 1), "lower-hydrogen wire lowers the preheat");
must(tpOf(40, 10, 1.5) < tpOf(40, 10, 1), "higher heat input lowers the preheat");
must(CET >= 0.2 && CET <= 0.5, "CET inside method B range");
for (const T0 of [20, 200]) for (const Q of [0.5, 2.5]) for (const d of [10, 40]) {
  const f = curveOf(T0, Q, d);
  const t8 = flowOf(T0, Q, d) === 3 ? (f(1) - T0) / (800 - T0) : ((f(1) - T0) / (800 - T0)) ** 2;
  const t5 = flowOf(T0, Q, d) === 3 ? (f(1) - T0) / (500 - T0) : ((f(1) - T0) / (500 - T0)) ** 2;
  near(t5 - t8, t85Of(T0, Q, d), 1e-6, "curve matches t8/5");
}

const Q_LIST = [0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0, 2.5];
const T_LIST = [20, 50, 75, 100, 125, 150, 175, 200];
const D_LIST = [10, 15, 20, 30, 40];
const H_LIST = [3, 5, 10, 15];
const LEVELS = {
  1: { q: 1.0, t: 20, d: 20, h: 10 },
  2: { q: 1.0, t: 20, d: 20, h: 10 },
  3: { q: 1.0, t: 20, d: 30, h: 10 },
  4: { q: 1.0, t: 20, d: 40, h: 10 },
};

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x across the joint, +y toward the viewer.
// The section face is the cut at y = YF; the weld runs along y. The flange top
// stays at z = ZT for every thickness: thinner flanges stand on taller blocks.
const WIDTH = 600;
const FLOOR = -12;
const BENCH = { x: -106, y: -42, w: 152, d: 84, r: 3 };
const BT = 0; // bench top
const ZT = 52; // flange top
const HALF = 34; // flange half-width
const YB = -24;
const YF = 24;
const WEB = 5; // web half-thickness
const WEB_TOP = ZT + 34;
const LEG = 9;
const REC = { x: -98, y: -40, w: 46, d: 10, r: 1.2 };
const REC_Z = [74, 114];
const RF = REC.y + REC.d; // recorder face
const WIN = { x0: -95, x1: -55, z0: 83, z1: 111, r: 1.6, depth: 0.9 };
const PLOT = { x0: WIN.x0 + 3.2, x1: WIN.x1 - 1.4, z0: WIN.z0 + 2.4, z1: WIN.z1 - 1.6, tmin: 0.5, tmax: 100, Tmax: 1500 };
const CAN = { x: -80, y: 16, r: 11 };
const CAN_Z = [BT, 54];
const NOZ_A = [-80 + 5.15, 16, 66]; // burner tube, from the valve
const NOZ_B = [-46, 7, 62]; // nozzle tip
const FLAME_END = [-22, 2, ZT + 0.5];

const FIT = [
  ...k.boxCorners(BENCH, FLOOR - 4, BT),
  ...k.boxCorners({ x: REC.x, y: REC.y, w: REC.w, d: REC.d }, REC_Z[0], REC_Z[1] + 2),
  ...k.boxCorners({ x: -HALF, y: YB, w: 2 * HALF, d: YF - YB }, ZT - 40, WEB_TOP),
  [CAN.x - CAN.r, CAN.y, 78],
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 70);
const ELEVATION = Number(process.env.EL ?? 24);
const MACHINE_W = 392; // the bench fills the left of the card, the loupe the right
const P0 = k.fitProjection(FIT, MACHINE_W, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
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
const frameUp = (o) => G.frameOf(o, Zv, X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const { sinA } = k.cameraOf(P);

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
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", owner, ground, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner, ground }));
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
function prismY(name, poly, y0, y1, style = {}, { extra = "", inner = "", owner, ...opts } = {}) {
  const F = frameY([0, 0, 0]);
  const shape = R.solid(A.prism(F, poly, y0, y1, { name, owner }));
  const svg = S(G.prismOf(F, poly, y0, y1, P), { tone: "mid", ...style, inner }) + extra;
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
  const cz = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  return put(name, [cx, (y0 + y1) / 2, cz], svg, [shape], opts);
}

// A recess in the face y = const: inner walls shaded by facing, a back plane
// holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "hz-glass") {
  const id = `hz-clip-${clips++}`;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
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

// ---------------------------------------------------------------- shared live geometry
// The etched section on the cut face y = YF, in face coordinates (x, −z) mm.
// Both the build and the page call these, so they draw the very same thing.
// Polylines are joined into strings here: never pass arrays or objects as d.
// The boundary of one fillet's fusion zone, offset outward by w: from the toe
// on the flange top, under the leg into the flange, round the root, up inside
// the web to the toe on the web face. u runs away from the web face, v up from
// the flange top; each row is [u, v, nu, nv] with the outward offset direction.
function boundOf(side, p, w) {
  const rows = [
    [LEG + 0.4, 0, 1, 0],
    [LEG * 0.85, -0.7 * p, 0.3, -1],
    [LEG * 0.5, -p, 0, -1],
    [LEG * 0.15, -0.95 * p, 0, -1],
    [-0.6 * p, -0.6 * p, -0.75, -0.75],
    [-0.95 * p, LEG * 0.15, -1, 0],
    [-p, LEG * 0.5, -1, 0],
    [-0.7 * p, LEG * 0.85, -1, 0.3],
    [0, LEG + 0.4, 0, 1],
  ];
  let pts = rows.map(([u, v, nu, nv]) => [side * (WEB + u + w * nu), ZT + v + w * nv]);
  // two rounds of corner cutting for a smooth line; the ends stay on the surfaces
  for (let round = 0; round < 2; round++) {
    const next = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i], [bx, bz] = pts[i + 1];
      if (i > 0) next.push([ax * 0.75 + bx * 0.25, az * 0.75 + bz * 0.25]);
      if (i < pts.length - 2) next.push([ax * 0.25 + bx * 0.75, az * 0.25 + bz * 0.75]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts;
}
function zonesOf(t85) {
  const p = 0.8 + 0.25 * Math.sqrt(t85); // fusion depth into the plates, schematic
  const w = hazOf(t85);
  return [-1, 1].map((s) => {
    const fu = boundOf(s, p, 0);
    const outer = boundOf(s, p, w);
    const inner = boundOf(s, p, w * 0.42);
    const weld = [[s * WEB, ZT + LEG + 0.4], [s * (WEB + LEG * 0.52), ZT + LEG * 0.6], [s * (WEB + LEG + 0.4), ZT]];
    return { s, fu, outer, inner, weld, hazArea: [...outer, ...fu.slice().reverse()], weldArea: [...fu, ...weld] };
  });
}
function insideOf(poly, [x, z]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
function sectionSvg(d, t85, hv, glow, clip) {
  const f = (v) => v.toFixed(2);
  const poly = (pts) => pts.map(([x, z]) => f(x) + " " + f(-z)).join("L");
  const outline = [
    [-HALF, ZT - d], [HALF, ZT - d], [HALF, ZT], [WEB + LEG + 0.4, ZT], [WEB + LEG * 0.52, ZT + LEG * 0.6], [WEB, ZT + LEG + 0.4], [WEB, WEB_TOP],
    [-WEB, WEB_TOP], [-WEB, ZT + LEG + 0.4], [-WEB - LEG * 0.52, ZT + LEG * 0.6], [-WEB - LEG - 0.4, ZT], [-HALF, ZT],
  ];
  const zones = zonesOf(t85);
  const parts = [];
  parts.push('<clipPath id="' + clip + '"><path d="M' + poly(outline) + 'Z"/></clipPath>');
  if (clip !== "hz-cut") parts.push('<path class="hz-steel" d="M' + poly(outline) + 'Z"/>');
  parts.push('<g clip-path="url(#' + clip + ')">');
  // HAZ (fine grain), then the coarse-grain band next to the fusion line, its tone following the hardness
  parts.push('<path class="hz-haz" d="' + zones.map((z) => "M" + poly(z.hazArea) + "Z").join("") + '"/>');
  parts.push('<path class="hz-cg" style="opacity:' + Math.max(0.18, Math.min(1, (hv - 200) / 240)).toFixed(3) + '" d="' + zones.map((z) => "M" + poly([...z.inner, ...z.fu.slice().reverse()]) + "Z").join("") + '"/>');
  // the weld metal: the fillet above the surfaces plus the fusion into the plates
  parts.push('<path class="hz-weld" d="' + zones.map((z) => "M" + poly(z.weldArea) + "Z").join("") + '"/>');
  // columnar grains: short strokes from the fusion line toward the weld's middle
  const grains = [];
  zones.forEach((z) => {
    const cx = z.s * (WEB + LEG * 0.32), cz = ZT + LEG * 0.32;
    for (let i = 3; i < z.fu.length - 3; i += 2) {
      const [x, zz] = z.fu[i];
      grains.push("M" + f(x) + " " + f(-zz) + "L" + f(x + (cx - x) * 0.45) + " " + f(-(zz + (cz - zz) * 0.45)));
    }
  });
  parts.push('<path class="hz-grain" d="' + grains.join("") + '"/>');
  if (glow > 0.003) parts.push('<path class="hz-glow" style="opacity:' + glow.toFixed(3) + '" d="' + zones.map((z) => "M" + poly(z.outer) + "L" + poly(z.weld) + "Z").join("") + '"/>');
  parts.push('<path class="hz-haz-line" d="' + zones.map((z) => "M" + poly(z.outer)).join("") + '"/>');
  parts.push('<path class="hz-fusion" d="' + zones.map((z) => "M" + poly(z.fu)).join("") + '"/>');
  parts.push("</g>");
  if (clip !== "hz-cut") parts.push('<path class="hz-cut-edge" d="M' + poly(outline) + 'Z"/>');
  return parts.join("");
}
// The Vickers traverse 1.5 mm under the flange top, 1 mm apart, through the
// left HAZ; an indent inside the HAZ is drawn in the accent.
function indentsSvg(t85) {
  const zones = zonesOf(t85);
  const z = ZT - 1.5;
  const out = [];
  for (let x = -17; x <= -WEB - 1; x += 1) {
    const inWeld = zones.some((zn) => insideOf(zn.weldArea, [x, z]));
    const inHaz = !inWeld && zones.some((zn) => insideOf(zn.hazArea, [x, z]));
    const s = 0.32;
    out.push('<path class="' + (inHaz ? "hz-ind-on" : inWeld ? "hz-ind-weld" : "hz-ind") + '" d="M' + x.toFixed(2) + " " + (-z - s).toFixed(2) + "L" + (x + s).toFixed(2) + " " + (-z).toFixed(2) + "L" + x.toFixed(2) + " " + (-z + s).toFixed(2) + "L" + (x - s).toFixed(2) + " " + (-z).toFixed(2) + 'Z"/>');
  }
  return out.join("");
}
// The cooling curve on the recorder screen (face coordinates, x and −z).
function plotX(s) { return PLOT.x0 + (PLOT.x1 - PLOT.x0) * (Math.log10(s / PLOT.tmin) / Math.log10(PLOT.tmax / PLOT.tmin)); }
function plotZ(T) { return PLOT.z0 + (PLOT.z1 - PLOT.z0) * Math.min(1, Math.max(0, T / PLOT.Tmax)); }
function curveSvg(fn, t8, t5, upto) {
  const f = (v) => v.toFixed(2);
  const pts = [];
  const n = 60;
  const end = Math.min(upto, PLOT.tmax);
  for (let i = 0; i <= n; i++) {
    const s = PLOT.tmin * (PLOT.tmax / PLOT.tmin) ** (i / n);
    if (s > end) break;
    pts.push([plotX(s), plotZ(Math.min(PLOT.Tmax, fn(s)))]);
  }
  if (end > PLOT.tmin && (pts.length === 0 || pts[pts.length - 1][0] < plotX(end))) pts.push([plotX(end), plotZ(Math.min(PLOT.Tmax, fn(end)))]);
  const band = '<path class="hz-band" d="M' + f(plotX(t8)) + " " + f(-PLOT.z0) + "H" + f(plotX(Math.min(t5, PLOT.tmax))) + "V" + f(-plotZ(800)) + "H" + f(plotX(t8)) + 'Z"/>';
  const line = pts.length > 1 ? '<path class="hz-curve" d="M' + pts.map(([x, z]) => f(x) + " " + f(-z)).join("L") + '"/>' : "";
  const last = pts[pts.length - 1];
  const dot = last ? '<circle class="hz-now" cx="' + f(last[0]) + '" cy="' + f(-last[1]) + '" r="0.9"/>' : "";
  return band + line + dot;
}

// ---------------------------------------------------------------- floor and bench
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(BENCH, -3), FLOOR, 2, P)}"/>`,
];
for (const [x, y] of k.corners(BENCH, 12)) post("stand.foot", x, y, 6, FLOOR - 4, FLOOR, { tone: "lo" }, { steps: 6, ground: true });
{
  const screws = k.corners(BENCH, 5);
  const extra =
    L(k.planOutline(k.insetPlan(BENCH, 4), BT, P, 3), { tone: "faint" }) +
    L(screws.map(([x, y]) => k.ring(x, y, 1.6, BT, P, 14)).join(""), { tone: "lo" }) +
    Dt(screws.map(([x, y]) => at([x, y, BT])), { size: 0.5 });
  box("stand.bench", BENCH, FLOOR, BT, { tone: "lo" }, { steps: 3, bevel: 0.7, inner: L(k.sideSeam(BENCH, FLOOR + 5, P, 3), { tone: "faint" }), extra, ground: true });
  // a ruler strip along the front edge, ticks hanging from its back edge
  const strip = { x: -86, y: BENCH.y + BENCH.d - 7, w: 120, d: 4.4, r: 0.5 };
  const rt = k.topTicks(-85, 33, 2, 5, strip.y, BT + 0.6, [1.4, 2.6], P);
  box("bench.ruler", strip, BT, BT + 0.6, { tone: "mid", crease: "lo" }, { extra: L(rt.minor, { tone: "lo" }) + L(rt.major, { tone: "mid" }) });
  // a label plate with three rule lines, front left
  box("bench.label", { x: -62, y: 21, w: 24, d: 11, r: 0.8 }, BT, BT + 0.6, { tone: "mid", crease: "lo" }, {
    extra: L([0, 1, 2].map((i) => k.lineOnTop([-59, 24 + i * 2.6], [-59 + [17, 13, 9][i], 24 + i * 2.6], BT + 0.6, P)).join(""), { tone: "lo", free: true }) +
      Dt(k.corners({ x: -62, y: 21, w: 24, d: 11 }, 1.4).map(([x, y]) => at([x, y, BT + 0.6])), { size: 0.38 }),
  });
}

// ---------------------------------------------------------------- the test piece: blocks, flange, web, fillets
// Variants for each flange thickness: the recorded one is d = 40; the page
// shows the one that matches d.
const blockPlan = (x0) => ({ x: x0, y: YB + 4, w: 14, d: YF - YB - 8, r: 0.8 });
const BLOCKS = [-28, 14];
function blockSvg(x0, d) {
  const pl = blockPlan(x0);
  const h = ZT - d - BT;
  const screws = [[x0 + 7, pl.y + 3], [x0 + 7, pl.y + pl.d - 3]];
  return k.solidSvg(k.slabOf(pl, BT, h, P, 2, 0.3), { tone: "lo", inner: h > 12 ? L(k.sideSeam(pl, BT + h / 2, P, 2), { tone: "faint" }) : "" }) +
    L(screws.map(([x, y]) => k.ring(x, y, 1, ZT - d, P, 12)).join(""), { tone: "faint" });
}
const FLANGE = { x: -HALF, y: YB, w: 2 * HALF, d: YF - YB, r: 0.4 };
function flangeSvg(d) {
  // a scribed layout line along the weld on each side, edge to edge
  const scribe = [-28, 28].map((x) => k.lineOnTop([x, YB], [x, YF], ZT, P)).join("");
  return k.solidSvg(k.slabOf(FLANGE, ZT - d, d, P, 2, 0.3), { tone: "hi", crease: "lo" }) + L(scribe, { tone: "faint" });
}
// The audit proves the recorded d = 40 arrangement (AUDIT_SVG restores it
// before the audit runs); the page carries all thicknesses.
const AUDIT_SVG = [];
const blockItems = BLOCKS.map((x0, i) => {
  const item = box(`piece.block${i}`, blockPlan(x0), BT, ZT - 40, { tone: "lo" }, { bevel: 0.3 });
  solids--;
  AUDIT_SVG.push([item, item.svg]);
  item.svg = D_LIST.map((d) => `<g data-d="${d}"${d === 40 ? "" : ' style="display:none"'}>${blockSvg(x0, d)}</g>`).join("");
  return item;
});
solids += 2;
// the warm tint on the flange top while it is preheated (opacity set live)
const warmTop = k.pathOf([[-HALF, YB], [HALF, YB], [HALF, YF], [-HALF, YF]].map(([x, y]) => at([x, y, ZT])), true);
{
  const item = box("piece.flange", FLANGE, ZT - 40, ZT, { tone: "hi" }, { bevel: 0.3 });
  AUDIT_SVG.push([item, item.svg]);
  item.svg = D_LIST.map((d) => `<g data-d="${d}"${d === 40 ? "" : ' style="display:none"'}>${flangeSvg(d)}</g>`).join("") + `<path class="hz-warm" data-warm="" style="opacity:0" d="${warmTop}"/>`;
}
box("piece.web", { x: -WEB, y: YB, w: 2 * WEB, d: YF - YB, r: 0.4 }, ZT, WEB_TOP, { tone: "hi", crease: "lo" }, {
  bevel: 0.3,
  extra: Dt([[-WEB + 2.4, YB + 4, WEB_TOP], [WEB - 2.4, YB + 4, WEB_TOP]].map(at), { size: 0.4, tone: "lo" }) + L(k.lineOnTop([0, YB], [0, YF], WEB_TOP, P), { tone: "faint" }),
});
for (const s of [-1, 1]) {
  const poly = [[s * WEB, ZT], [s * (WEB + LEG), ZT], [s * (WEB + LEG * 0.52), ZT + LEG * 0.6], [s * WEB, ZT + LEG]];
  // weld ripples across the bead face, ending on its two edges
  const ripples = [];
  for (let y = YB + 3; y < YF - 1; y += 3.2) ripples.push(k.pathOf([[s * (WEB + LEG), y, ZT], [s * (WEB + LEG * 0.52), y + 0.8, ZT + LEG * 0.6], [s * WEB, y, ZT + LEG]].map(at)));
  prismY(`piece.fillet${s > 0 ? "R" : "L"}`, poly, YB, YF, { tone: "hi", crease: "lo" }, { owner: "weld", inner: L(ripples.join(""), { tone: "faint" }) });
}
// a magnetic contact thermometer on the flange top, right of the web
const PROBE = [-24, -14];
discAt("probe.magnet", frameUp([PROBE[0], PROBE[1], ZT]), 0, 3, 4.4, { tone: "mid" }, {});
discAt("probe.cap", frameUp([PROBE[0], PROBE[1], ZT + 3]), 0, 3.4, 2.6, { tone: "hi", crease: "lo" }, {});
discAt("probe.boot", frameUp([PROBE[0], PROBE[1], ZT + 6.4]), 0, 2.6, 1.2, { tone: "mid" }, { extra: Dt([at([PROBE[0], PROBE[1], ZT + 9])], { size: 0.45, tone: "hi" }) });
// a temperature-indicating crayon lying on the bench: it melts at its rated temperature
{
  const Fx = frameX([4, 30, BT + 2.2]);
  discAt("bench.crayon", Fx, 0, 15, 2.2, { tone: "hi", crease: "lo" }, { steps: 6 });
  discAt("bench.crayon-cap", Fx, 15, 20, 2.5, { tone: "mid" }, { inner: L(G.arcOf(Fx, 18.4, 2.5, P), { tone: "faint" }) });
}
// the drying oven for low-hydrogen filler, back right: body, lid, handle, thermostat and lamp
{
  const OV = [33, -33];
  discAt("oven.foot", frameUp([OV[0], OV[1], BT]), 0, 1.6, 7.6, { tone: "lo" }, {});
  const Fo = frameUp([OV[0], OV[1], BT + 1.6]);
  turned("oven.body", Fo, [[0, 6.8], [26, 6.8]], { tone: "mid" }, { inner: L(G.arcOf(Fo, 4, 6.8, P) + G.arcOf(Fo, 22, 6.8, P), { tone: "faint" }) });
  discAt("oven.lid", frameUp([OV[0], OV[1], BT + 27.6]), 0, 2.4, 7.4, { tone: "mid", crease: "lo" }, {});
  box("oven.handle", { x: OV[0] - 1.2, y: OV[1] - 4, w: 2.4, d: 8, r: 0.6 }, BT + 30, BT + 32.4, { tone: "hi", crease: "lo" }, {});
  const Fk = frameY([OV[0] - 2.4, OV[1] + 6.36, BT + 18]);
  discAt("oven.knob", Fk, 0, 2.2, 1.8, { tone: "hi", crease: "lo" }, { inner: L(G.ribsOf(Fk, 0.3, 2.2, 1.8, 10, P, { seams: false }), { tone: "lo" }) });
  discAt("oven.lamp", frameY([OV[0] + 2.8, OV[1] + 6.22, BT + 18]), 0, 1.2, 1.2, { tone: "hi", crease: "lo" }, {});
}

// ---------------------------------------------------------------- the burner: gas canister, valve, tube, nozzle
{
  const Fc = frameUp([CAN.x, CAN.y, CAN_Z[0]]);
  const H = CAN_Z[1] - CAN_Z[0] - 1.8;
  const can = [[0, CAN.r - 1.2], [1.2, CAN.r, 1], [H - 10, CAN.r, 1], [H - 3, CAN.r - 5, 1], [H, 5]];
  discAt("burner.foot", frameUp([CAN.x, CAN.y, CAN_Z[0]]), 0, 1.8, CAN.r + 1.4, { tone: "lo" }, {});
  turned("burner.can", G.frameOf([CAN.x, CAN.y, CAN_Z[0] + 1.8], Zv, X, Y), can.map(([a, r, sm]) => (sm ? [a, r, sm] : [a, r])).map((row) => row), { tone: "mid", crease: "lo" }, { inner: L(G.arcOf(Fc, 8, CAN.r, P) + G.arcOf(Fc, 36, CAN.r, P), { tone: "faint" }) });
  discAt("burner.valve", frameUp([CAN.x, CAN.y, CAN_Z[1]]), 0, 9, 4.4, { tone: "mid" });
  const Fk = frameY([CAN.x, CAN.y + 4.4, CAN_Z[1] + 5]);
  discAt("burner.knob", Fk, 0, 4.2, 4, { tone: "hi", crease: "lo" }, { inner: L(G.ribsOf(Fk, 0.4, 4.2, 4, 14, P, { seams: false }), { tone: "lo" }) });
  discAt("burner.head", frameUp([CAN.x, CAN.y, CAN_Z[1] + 9]), 0, 6, 5.2, { tone: "mid", crease: "lo" });
  // the tube from the head toward the flange, then the nozzle
  const dir = G.sub3 ? G.sub3(NOZ_B, NOZ_A) : NOZ_B.map((v, i) => v - NOZ_A[i]);
  const len = Math.hypot(...dir);
  const a = dir.map((v) => v / len);
  const u = [a[2], 0, -a[0]].map((v) => v / Math.hypot(a[2], a[0]));
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  const Ft = G.frameOf(NOZ_A, a, u, v);
  turned("burner.tube", Ft, [[0, 1.8], [len - 12, 1.8]], { tone: "hi", crease: "lo" });
  turned("burner.nozzle", Ft, [[len - 12, 3.2], [len - 6, 3.2], [len - 6, 2.8], [len - 2, 2.8, 1], [len, 2.3]], { tone: "mid", crease: "lo" });
}

// ---------------------------------------------------------------- the temperature recorder on its pedestal
{
  const foot = { x: -85, y: -41, w: 20, d: 16, r: 1 };
  box("rec.foot", foot, BT, BT + 1.6, { tone: "lo" }, { bevel: 0.3, extra: Dt(k.corners(foot, 2.4).map(([x, y]) => at([x, y, BT + 1.6])), { size: 0.42 }) });
  post("rec.post", -75, -33, 2.6, BT + 1.6, REC_Z[0], { tone: "mid" }, { inner: L(k.sideArc(-75, -33, 2.6, 30, P, 16), { tone: "faint" }) });
  const extra = [];
  extra.push(recess(WIN, RF, `<g data-curve=""></g>`, "hz-glass"));
  // fixed screen furniture: 800 and 500 °C rules and the time axis ticks
  const grid = [];
  for (const T of [500, 800]) grid.push(`M${WIN.x0 + 0.4} ${(-plotZ(T)).toFixed(2)}H${(WIN.x1 - 0.4).toFixed(2)}`);
  const ticks = [];
  for (const s of [1, 10, 100]) ticks.push(`M${plotX(s).toFixed(2)} ${(-WIN.z0 - 0.0).toFixed(2)}v-1.6`);
  extra.push(`<g transform="${planeOf(RF - WIN.depth)}" clip-path="url(#hz-clip-${clips - 1})"><path class="hz-rule" d="${grid.join("")}"/><path class="hz-tick" d="${ticks.join("")}"/></g>`);
  extra.push(Dt([[REC.x + 2.6, RF, REC_Z[0] + 2.6], [REC.x + REC.w - 2.6, RF, REC_Z[0] + 2.6], [REC.x + 2.6, RF, REC_Z[1] - 2.6], [REC.x + REC.w - 2.6, RF, REC_Z[1] - 2.6]].map(at), { size: 0.42 }));
  box("rec.box", REC, REC_Z[0], REC_Z[1], { tone: "mid" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(REC, REC_Z[1] - 3, P, 3), { tone: "faint" }), extra: extra.join("") });
  box("rec.lid", k.insetPlan(REC, 1.2), REC_Z[1], REC_Z[1] + 1.6, { tone: "mid", crease: "lo" }, { bevel: 0.3 });
  // two knobs and a lamp under the screen
  const knob = (name, x) => {
    const F = frameY([x, RF, REC_Z[0] + 5]);
    discAt(name, F, 0, 2.4, 2.6, { tone: "hi", crease: "lo" }, { inner: L(G.ribsOf(F, 0.4, 2.4, 2.6, 12, P, { seams: false }), { tone: "lo" }) });
  };
  knob("rec.knob1", -92);
  knob("rec.knob2", -84);
  discAt("rec.lamp", frameY([-58, RF, REC_Z[0] + 5]), 0, 1.4, 1.8, { tone: "hi", crease: "lo" }, { attrs: ' data-lamp=""' });
  // the terminal block on the left side, two posts for the two leads
  box("rec.terminal", { x: REC.x + REC.w, y: REC.y + 2, w: 3, d: 6, r: 0.4 }, REC_Z[0] + 4, REC_Z[0] + 14, { tone: "lo" }, {});
  for (const [y, z] of [[REC.y + 4, REC_Z[0] + 11], [REC.y + 6, REC_Z[0] + 7]]) discAt("rec.plug", frameX([REC.x + REC.w + 3, y, z]), 0, 2.6, 1.1, { tone: "hi", crease: "lo" }, {});
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);

// the two thermocouple leads: one from the magnet probe, one plunged in the right fillet
const T1 = [REC.x + REC.w + 5.6, REC.y + 4, REC_Z[0] + 11];
const T2 = [REC.x + REC.w + 5.6, REC.y + 6, REC_Z[0] + 7];
const leads = [
  k.wireSvg(at([PROBE[0], PROBE[1], ZT + 9]), at(T1), { via: [at([PROBE[0], PROBE[1], ZT + 16]), at([-40, -30, ZT + 22])], tone: "mid", size: 0.8 }),
  k.wireSvg(at([-WEB - LEG * 0.42, 4, ZT + LEG * 0.6]), at(T2), { via: [at([-WEB - LEG * 0.42, 4, ZT + 26]), at([-38, -26, ZT + 28])], tone: "mid", size: 0.8 }),
].join("");

// the flame of the burner (opacity live): a soft cone from the nozzle to the flange top
const flame = (() => {
  const dir = FLAME_END.map((v, i) => v - NOZ_B[i]);
  const len = Math.hypot(...dir);
  const pts = [];
  const side = [0, 1, 0];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const r = 3.0 * Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.1)) + 0.8;
    pts.push(at(NOZ_B.map((v, j) => v + dir[j] * t + side[j] * r + (j === 2 ? r * 0.3 : 0))));
  }
  for (let i = 12; i >= 0; i--) {
    const t = i / 12;
    const r = 3.0 * Math.sin(Math.PI * Math.min(1, t * 0.9 + 0.1)) + 0.8;
    pts.push(at(NOZ_B.map((v, j) => v + dir[j] * t - side[j] * r - (j === 2 ? r * 0.3 : 0))));
  }
  void len;
  const core = [at(NOZ_B), at(NOZ_B.map((v, j) => v + dir[j] * 0.45))];
  return `<g data-flame="" style="opacity:0"><path class="hz-flame" d="${k.pathOf(pts, true)}"/><path class="hz-flame-core" d="${k.pathOf(core)}"/></g>`;
})();

// the etched section, drawn on the cut face (live)
const L4 = LEVELS[4];
const t0 = t85Of(L4.t, L4.q, L4.d);
const section = `<g transform="${planeOf(YF)}"><g data-section="">${sectionSvg(L4.d, t0, hvOf(t0), 0, "hz-cut")}</g></g>`;

// the loupe: the etched section around the root, enlarged, to the right of the bench
const LOUPE = (() => {
  const r = Math.min(98, HEIGHT / 2 - 12);
  return { cx: WIDTH - r - 10, cy: HEIGHT / 2 + 4, r };
})();
const LENS_MM = 15.5; // the lens shows ±15.5 mm around the root
const LENS_C = [0, ZT + 3.5]; // centre of the view, mm
const lensTx = `scale(${(LOUPE.r / LENS_MM).toFixed(4)}) translate(${-LENS_C[0]} ${LENS_C[1]})`;
const lensScale = (() => {
  // a millimetre scale along the bottom of the lens, ticks hanging from a rule
  const z = ZT - 8;
  const minor = [], major = [];
  for (let x = -10; x <= 10; x += 1) (x % 5 === 0 ? major : minor).push(`M${x} ${-z}v${x % 5 === 0 ? 1.6 : 0.9}`);
  return `<path class="hz-rule" d="M-10.4 ${-z}H10.4"/><path class="hz-tick" d="${minor.join("")}"/><path class="hz-tick-major" d="${major.join("")}"/>`;
})();
const loupe = [
  `<g class="hz-loupe" transform="translate(${LOUPE.cx.toFixed(1)} ${LOUPE.cy.toFixed(1)})">`,
  `<circle class="hz-lens" r="${LOUPE.r}"/>`,
  `<clipPath id="hz-lens-clip"><circle r="${LOUPE.r - 1}"/></clipPath>`,
  `<g clip-path="url(#hz-lens-clip)"><g transform="${lensTx}"><g data-lens="">${sectionSvg(L4.d, t0, hvOf(t0), 0, "hz-cut-l")}</g><g data-indents="">${indentsSvg(t0)}</g>${lensScale}</g></g>`,
  `<circle class="hz-rim" r="${LOUPE.r}"/>`,
  `</g>`,
].join("");

const body = [...halo, ...groups, section, leads, flame, loupe, `<g data-mark=""></g>`];

const LABEL_NL =
  "Een proefstuk op een werkbank: een doorgezaagde T-verbinding van een stalen flens met een staander, aan beide kanten een hoeklas. Op het gezaagde, geëtste vlak zie je het lasmetaal, de smeltlijn en daaromheen de warmtebeïnvloede zone. De flens ligt op twee steunblokken. Links verwarmt een gasbrander de flens voor; rechts meet een magneetthermometer de voorwarmtemperatuur en een thermokoppel in de las meet de afkoeling. Een schrijver op een statief toont de afkoelcurve met de lijnen voor 800 en 500 °C.";
const LABEL_EN =
  "A test piece on a bench: a sawn T-joint of a steel flange and a web, a fillet weld on each side. On the sawn, etched face you see the weld metal, the fusion line and around it the heat-affected zone. The flange rests on two support blocks. On the left a gas burner preheats the flange; on the right a magnetic thermometer reads the preheat temperature and a thermocouple in the weld records the cooling. A recorder on a stand shows the cooling curve with lines for 800 and 500 °C.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "flange", at: [-34, YF, ZT - 8] },
  { key: "web", at: [0, YF, ZT + 32] },
  { key: "weld", at: [-WEB - 3, YF, ZT + 3] },
  { key: "haz", at: [-WEB - LEG - 1.6, YF, ZT - 1.4] },
  { key: "fusion", at: [WEB + LEG * 0.7, YF, ZT - 1] },
  { key: "burner", at: [-60, -3, 64] },
  { key: "can", at: [CAN.x, CAN.y + CAN.r, 30] },
  { key: "probe", at: [PROBE[0], PROBE[1], ZT + 4] },
  { key: "couple", at: [WEB + 4, 8, ZT + 12] },
  { key: "recorder", at: [(WIN.x0 + WIN.x1) / 2, RF, (WIN.z0 + WIN.z1) / 2] },
  { key: "block", at: [29, YF - 4, (BT + ZT - 20) / 2] },
  { key: "bench", at: [-60, 40, BT] },
  // the same zones in the loupe, by their position on the card
  ...[["weld", -WEB - 2.6, ZT + 2.6], ["haz", -WEB - LEG - 1.6, ZT - 0.5], ["fusion", WEB + LEG * 0.5, ZT - 1.1], ["web", 0, ZT + 11], ["flange", 9, ZT - 5.5]].map(([key, x, z]) => ({ key, scr: [LOUPE.cx + (LOUPE.r / LENS_MM) * (x - LENS_C[0]), LOUPE.cy + (LOUPE.r / LENS_MM) * (LENS_C[1] - z)] })),
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
  --hz-hair:rgba(240,233,218,.12);--hz-accent:#5C9FAE;--hz-glass:#0A1E23;
  --hz-weld:#3F6F7A;--hz-haz:#2B5C66;--hz-cg:#5C9FAE;--hz-glow:#BFE3EA;--hz-warm:#5C9FAE;--hz-band:rgba(92,159,174,.28);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --hz-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --hz-hair:rgba(11,41,27,.14);--hz-accent:#276F81;--hz-glass:#E2ECEA;
  --hz-weld:#A9CACD;--hz-haz:#D5E3E1;--hz-cg:#276F81;--hz-glow:#7FB6C3;--hz-warm:#276F81;--hz-band:rgba(39,111,129,.2);
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--hz-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:156px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:270px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--hz-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="1"] .iso-plate{--bottom:142px}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--hz-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important;max-width:78%;text-align:right}
.iso-plate-corner[data-corner="hint"]{bottom:62px!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:80px!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.hz-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hz-acc{color:var(--hz-accent);font-weight:600}
.hz-strong{color:var(--anatomy-strong);font-weight:600}
.hz-mute{color:var(--anatomy-muted)}
.hz-warn{color:var(--hz-accent);font-weight:700;text-decoration:underline;text-underline-offset:2px}
.hz-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.hz-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.hz-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.hz-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.hz-row{display:flex;gap:4px;height:44px}
.hz-row[hidden]{display:none}
.hz-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--hz-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--hz-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.hz-btn[hidden]{display:none}
.hz-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.hz-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--hz-accent);color:var(--hz-accent);font-weight:600}
.hz-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.hz-btn:disabled{opacity:.4;cursor:default}
.hz-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.hz-btn sub{font-size:9px}
.hz-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.hz-glass{fill:var(--hz-glass);stroke:none}
.hz-weld{fill:var(--hz-weld);stroke:none}
.hz-haz{fill:var(--hz-haz);stroke:none}
.hz-cg{fill:var(--hz-cg);stroke:none;transition:opacity .4s}
.hz-glow{fill:var(--hz-glow);stroke:none}
.hz-grain{fill:none;stroke:var(--anatomy-lo);stroke-width:.14px;stroke-linecap:round}
.hz-haz-line{fill:none;stroke:var(--hz-accent);stroke-width:.16px;stroke-dasharray:.7 .5}
.hz-fusion{fill:none;stroke:var(--anatomy-hi);stroke-width:.2px}
.hz-ind{fill:var(--anatomy-lo);stroke:none}
.hz-ind-on{fill:var(--hz-accent);stroke:none}
.hz-ind-weld{fill:var(--anatomy-mid);stroke:none}
html:not([data-level="4"]) [data-indents]{display:none}
.hz-warm{fill:var(--hz-warm);stroke:none;pointer-events:none}
.hz-flame{fill:var(--hz-glow);stroke:none;opacity:.55}
.hz-flame-core{fill:none;stroke:var(--hz-accent);stroke-width:1.6px;stroke-linecap:round}
.hz-rule{fill:none;stroke:var(--anatomy-lo);stroke-width:.18px}
.hz-tick{fill:none;stroke:var(--anatomy-mid);stroke-width:.2px}
.hz-tick-major{fill:none;stroke:var(--anatomy-hi);stroke-width:.22px}
.hz-band{fill:var(--hz-band);stroke:none}
.hz-lens{fill:var(--anatomy-card);stroke:none}
.hz-rim{fill:none;stroke:var(--anatomy-mid);stroke-width:1px}
.hz-steel{fill:var(--anatomy-face);stroke:none}
.hz-cut-edge{fill:none;stroke:var(--anatomy-mid);stroke-width:.2px;stroke-linejoin:round}
.hz-curve{fill:none;stroke:var(--hz-accent);stroke-width:.5px;stroke-linejoin:round;stroke-linecap:round}
.hz-now{fill:var(--anatomy-hi);stroke:none}
.hz-mark{fill:none;stroke:var(--hz-accent);stroke-width:1.4px}
.hz-mark-dot{fill:var(--hz-accent);stroke:none}
html:not([data-level="1"]) [data-mark]{display:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .3s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--hz-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,.hz-cg{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const ZT = ${ZT}, HALF = ${HALF}, WEB = ${WEB}, WEB_TOP = ${WEB_TOP}, LEG = ${LEG}, YF = ${YF};
const PLOT = ${JSON.stringify(PLOT)};
const F2 = ${F2}, F3 = ${F3}, C_PCT = ${C_PCT}, CEB = ${CEB}, CET = ${CET}, CEV = ${CEV};
const Q_LIST = ${JSON.stringify(Q_LIST)}, T_LIST = ${JSON.stringify(T_LIST)}, D_LIST = ${JSON.stringify(D_LIST)}, H_LIST = ${JSON.stringify(H_LIST)};
const LEVELS = ${JSON.stringify(LEVELS)};
const PARTS = ${JSON.stringify(PARTS)};
const t3Of = ${t3Of.toString()};
const t2Of = ${t2Of.toString()};
const t85Of = ${t85Of.toString()};
const flowOf = ${flowOf.toString()};
const dtOf = ${dtOf.toString()};
const hvOf = ${hvOf.toString()};
const tpOf = ${tpOf.toString()};
const hazOf = ${hazOf.toString()};
const bandOf = ${bandOf.toString()};
const riskOf = ${riskOf.toString()};
const curveOf = ${curveOf.toString()};
${boundOf.toString()}
${zonesOf.toString()}
${insideOf.toString()}
${sectionSvg.toString()}
${indentsSvg.toString()}
${plotX.toString()}
${plotZ.toString()}
${curveSvg.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", heat: "Heat input", pre: "preheat", plate: "plate", flow3: "3D heat flow (thick plate)", flow2: "2D heat flow (thin plate)", trans: "thicker than ≈", transTail: "mm: thickness no longer shortens t8/5",
      band: ["short: fast cooling, hard HAZ (martensite)", "moderate cooling", "long: slow cooling, softer, less tough HAZ"], bandShort: ["short", "moderate", "long"],
      hard: "HAZ ≈", hv: "HV (estimate)", limit: "limit 380", over: "over", under: "under", tp: "preheat needed ≈", tpNone: "no preheat needed", risk: "Hydrogen crack risk", riskW: ["LOW", "WATCH", "HIGH"],
      cold: "cold, 20 °C", warm: "preheated, 150 °C", tapPart: "tap a part to name it", fillet: "a6 fillet weld", now: "now", h: "hydrogen", cev: "CEV",
      parts: { flange: ["Base metal", "the flange, S355 steel"], web: ["Web", "the plate welded onto the flange"], weld: ["Weld metal", "the fillet weld, melted and frozen"], haz: ["HAZ", "heat-affected zone: steel next to the weld that got hot"], fusion: ["Fusion line", "where weld metal meets base metal"], burner: ["Burner", "preheats the flange before welding"], can: ["Gas canister", "propane for the burner"], probe: ["Contact thermometer", "reads the preheat temperature"], couple: ["Thermocouple", "in the weld: records the cooling"], recorder: ["Recorder", "the cooling curve, 800 → 500 °C is t8/5"], block: ["Support block", "holds the test piece"], bench: ["Bench", "with a scale in mm"] } }
  : { dec: ",", heat: "Warmte-inbreng", pre: "voorwarmen", plate: "plaat", flow3: "3D-warmtestroom (dikke plaat)", flow2: "2D-warmtestroom (dunne plaat)", trans: "dikker dan ≈", transTail: "mm: dikte verkort t8/5 niet meer",
      band: ["kort: snel afgekoeld, harde WBZ (martensiet)", "gematigde afkoeling", "lang: traag afgekoeld, zachtere, minder taaie WBZ"], bandShort: ["kort", "gematigd", "lang"],
      hard: "WBZ ≈", hv: "HV (schatting)", limit: "grens 380", over: "boven", under: "onder", tp: "voorwarmen nodig ≈", tpNone: "geen voorwarmen nodig", risk: "Risico waterstofscheur", riskW: ["LAAG", "LET OP", "HOOG"],
      cold: "koud, 20 °C", warm: "voorgewarmd, 150 °C", tapPart: "tik een onderdeel voor de naam", fillet: "hoeklas a6", now: "nu", h: "waterstof", cev: "CEV",
      parts: { flange: ["Basismateriaal", "de flens, staal S355"], web: ["Staander", "de plaat die op de flens is gelast"], weld: ["Lasmetaal", "de hoeklas, gesmolten en gestold"], haz: ["WBZ", "warmtebeïnvloede zone: staal naast de las dat heet werd"], fusion: ["Smeltlijn", "waar lasmetaal en basismateriaal elkaar raken"], burner: ["Brander", "warmt de flens voor vóór het lassen"], can: ["Gasfles", "propaan voor de brander"], probe: ["Contactthermometer", "meet de voorwarmtemperatuur"], couple: ["Thermokoppel", "in de las: meet de afkoeling"], recorder: ["Schrijver", "de afkoelcurve; 800 → 500 °C is t8/5"], block: ["Steunblok", "draagt het proefstuk"], bench: ["Werkbank", "met een schaal in mm"] } };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);

const stage = document.querySelector(".hz-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { section: q("[data-section]"), lens: q("[data-lens]"), indents: q("[data-indents]"), curve: q("[data-curve]"), flame: q("[data-flame]"), warm: q("[data-warm]"), lamp: q("[data-lamp]"), mark: q("[data-mark]"), variants: [...svg.querySelectorAll("[data-d]")] };
const lines = [...document.querySelectorAll("[data-readout] .hz-line")];
const announcer = document.querySelector(".hz-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { q: L0.q, t: L0.t, d: L0.d, h: L0.h, sel: "q" };
const model = () => {
  const t85 = t85Of(st.t, st.q, st.d);
  const fn = curveOf(st.t, st.q, st.d);
  const peak = fn(1);
  const t8 = flowOf(st.t, st.q, st.d) === 3 ? (peak - st.t) / (800 - st.t) : ((peak - st.t) / (800 - st.t)) ** 2;
  const tp = tpOf(st.d, st.h, st.q);
  return { t85, fn, t8, t5: t8 + t85, hv: hvOf(t85), flow: flowOf(st.t, st.q, st.d), tp, risk: riskOf(st.t, tp) };
};
// the cooling cycle, in log time: weld laid, then cooled to 100 s, then a pause
const cyc = { s: PLOT.tmax, hold: 0 };
let m = model();

// ------------------------------------------------ drawing
let lastSection = "", lastD = -1;
function draw() {
  const temp = m.fn(Math.max(PLOT.tmin, cyc.s));
  const glow = smooth(450, 1100, temp) * 0.85;
  const key = [st.d, m.t85.toFixed(3), Math.round(m.hv), glow.toFixed(2)].join("|");
  if (key !== lastSection) { lastSection = key; el.section.innerHTML = sectionSvg(st.d, m.t85, m.hv, glow, "hz-cut"); el.lens.innerHTML = sectionSvg(st.d, m.t85, m.hv, glow, "hz-cut-l"); el.indents.innerHTML = indentsSvg(m.t85); }
  if (lastD !== st.d) { lastD = st.d; el.variants.forEach((n) => { n.style.display = Number(n.dataset.d) === st.d ? "" : "none"; }); }
  el.curve.innerHTML = curveSvg(m.fn, m.t8, m.t5, cyc.s);
  const pre = clamp((st.t - 20) / 180, 0, 1);
  el.warm.style.opacity = (pre * 0.32).toFixed(3);
  el.flame.style.opacity = (st.t > 20 ? 0.55 + 0.45 * pre : 0).toFixed(3);
  if (cyc.s < PLOT.tmax) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  drawMark();
  readout();
}
let marked = -1;
function drawMark() {
  if (LVL !== 1 || marked < 0) { el.mark.innerHTML = ""; return; }
  const [x, y] = PARTS[marked].scr || iso(PARTS[marked].at, P);
  el.mark.innerHTML = '<circle class="hz-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="hz-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
}
function readout() {
  const out = [];
  const b = bandOf(m.t85);
  const tLine = "t8/5 = " + '<span class="hz-acc">' + fmt(m.t85, 1) + " s</span>";
  if (LVL === 1) {
    out.push(T.fillet + " · " + T.plate + " " + st.d + " mm · " + T.heat + " " + fmt(st.q, 1) + " kJ/mm");
    out.push(T.pre + " " + st.t + " °C → " + tLine + " · " + T.bandShort[b]);
    out.push(T.band[b]);
    if (marked >= 0) { const [name, what] = T.parts[PARTS[marked].key]; out.push('<span class="hz-acc">' + name + "</span> · " + what); }
    else out.push('<span class="hz-mute">' + T.tapPart + "</span>");
  } else {
    out.push(T.heat + " " + fmt(st.q, 1) + " kJ/mm · " + T.pre + " " + st.t + " °C · " + T.plate + " " + st.d + " mm");
    out.push(tLine + " · " + (m.flow === 3 ? T.flow3 : T.flow2));
    out.push("≈ " + T.band[b]);
    if (LVL === 3) out.push(T.trans + " " + Math.round(dtOf(st.t, st.q)) + " " + T.transTail);
    if (LVL === 4) {
      const hv = Math.round(m.hv / 10) * 10;
      out.push(T.hard + " " + hv + " " + T.hv + " · " + T.limit + " · " + T.cev + " " + fmt(CEV, 2));
      const tp = Math.round(m.tp / 5) * 5;
      const word = '<span class="' + (m.risk === 2 ? "hz-warn" : "hz-strong") + '">' + T.riskW[m.risk] + "</span>";
      out.push((m.tp <= 20 ? T.tpNone : T.tp + " " + tp + " °C") + " (H" + st.h + ") · " + T.risk + " " + word);
    }
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

// ------------------------------------------------ the cooling cycle
const RATE = 0.62; // decades of log time per second: 0.5 → 100 s in about 3.7 s
function stepCycle(dt) {
  if (cyc.hold > 0) { cyc.hold -= dt; if (cyc.hold <= 0 && cyc.s >= PLOT.tmax) { cyc.s = PLOT.tmin; onPass(); } return; }
  const lg = Math.log10(cyc.s) + dt * RATE * (cyc.s < m.t5 && cyc.s > m.t8 ? 0.55 : 1);
  cyc.s = Math.min(PLOT.tmax, 10 ** lg);
  if (cyc.s >= PLOT.tmax) cyc.hold = 2.2;
}

// ------------------------------------------------ the idle tour
const TOURS = {
  1: [{ t: 20 }, { t: 150 }],
  2: [{ q: 1.0, t: 20 }, { q: 1.0, t: 150 }, { q: 2.0, t: 20 }],
  3: [{ d: 10, t: 20 }, { d: 30, t: 20 }, { d: 30, t: 150 }],
  4: [{ t: 20, h: 10 }, { t: 150, h: 10 }, { t: 150, h: 5 }],
};
let touring = !still.matches, tourStep = 0, idleTimer = 0;
function onPass() {
  if (!touring) return;
  tourStep = (tourStep + 1) % TOURS[LVL].length;
  Object.assign(st, TOURS[LVL][tourStep]);
  m = model();
  sync();
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (calm) { cyc.s = PLOT.tmax; cyc.hold = 0; }
  else stepCycle(dt);
  draw();
  frame = visible && !calm ? requestAnimationFrame(tick) : 0;
}
const go = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else go(); };
function steer() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; go(); } }, 40000);
}

// ------------------------------------------------ controls
const LISTS = { q: Q_LIST, t: T_LIST, d: D_LIST, h: H_LIST };
const SHOWN = { 1: [], 2: ["q", "t"], 3: ["q", "t", "d"], 4: ["q", "t", "d", "h"] }[LVL];
const pick = [...document.querySelectorAll("[data-pick]")];
const preBtns = [...document.querySelectorAll("[data-pre]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
document.querySelector('[data-row="pre"]').hidden = LVL !== 1;
document.querySelector('[data-row="vals"]').hidden = LVL === 1;
pick.forEach((b) => { b.hidden = !SHOWN.includes(b.dataset.pick); });
const show = (key) => key === "q" ? fmt(st.q, 1) : String(st[key]);
function sync() {
  pick.forEach((b) => { b.setAttribute("aria-checked", String(b.dataset.pick === st.sel)); b.tabIndex = b.dataset.pick === st.sel ? 0 : -1; b.querySelector("b").textContent = show(b.dataset.pick); });
  preBtns.forEach((b) => { const on = (b.dataset.pre === "warm") === (st.t > 20); b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  const list = LISTS[st.sel];
  const i = list.indexOf(st[st.sel]);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1));
  describe();
}
function describe() {
  let text = T.heat + " " + fmt(st.q, 1) + " kJ/mm, " + T.pre + " " + st.t + " °C, " + T.plate + " " + st.d + " mm: t8/5 " + fmt(m.t85, 1) + " s, " + T.bandShort[bandOf(m.t85)];
  if (LVL === 4) text += ", " + T.hard + " " + Math.round(m.hv / 10) * 10 + " HV, " + (m.tp <= 20 ? T.tpNone : T.tp + " " + Math.round(m.tp / 5) * 5 + " °C") + ", " + T.risk + " " + T.riskW[m.risk];
  if (LVL === 1 && marked >= 0) text += ", " + T.parts[PARTS[marked].key].join(": ");
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function changed() { steer(); m = model(); cyc.s = PLOT.tmin; cyc.hold = 0; lastSection = ""; sync(); announce(); kick(); }
function stepValue(dir) {
  const key = st.sel;
  const list = LISTS[key];
  let i = list.indexOf(st[key]);
  if (i < 0) i = 0;
  i = clamp(i + dir, 0, list.length - 1);
  st[key] = list[i];
  changed();
}
pick.forEach((b) => b.addEventListener("click", () => { st.sel = b.dataset.pick; steer(); sync(); }));
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
preBtns.forEach((b) => b.addEventListener("click", () => { st.t = b.dataset.pre === "warm" ? 150 : 20; changed(); }));
function radioKeys(group, keys, current, set) {
  group.addEventListener("keydown", (event) => {
    const ks = keys();
    const i = ks.indexOf(current());
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % ks.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + ks.length - 1) % ks.length;
    if (next < 0) return;
    event.preventDefault();
    set(ks[next]);
    [...group.querySelectorAll('[role="radio"]')].filter((n) => !n.hidden)[next].focus();
  });
}
radioKeys(document.querySelector('[data-row="vals"] [role="radiogroup"]'), () => SHOWN, () => st.sel, (v) => { st.sel = v; steer(); sync(); });
radioKeys(document.querySelector('[data-row="pre"]'), () => ["cold", "warm"], () => (st.t > 20 ? "warm" : "cold"), (v) => { st.t = v === "warm" ? 150 : 20; changed(); });

// tap the drawing: at level 1 name the nearest part
function toView(event) {
  const mtx = svg.getScreenCTM();
  if (!mtx) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(mtx.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 46;
  PARTS.forEach((p, i) => {
    const [px, py] = p.scr || iso(p.at, P);
    const dd = Math.hypot(px - x, py - y);
    if (dd < bestD) { bestD = dd; best = i; }
  });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL !== 1) return;
  marked = nearestPart(toView(event));
  steer(); sync(); announce(); kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL === 1 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL === 1 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; steer(); sync(); announce(); kick(); }
  else if (LVL > 1 && event.key === "ArrowUp") stepValue(1);
  else if (LVL > 1 && event.key === "ArrowDown") stepValue(-1);
  else if (LVL > 1 && ["1", "2", "3", "4"].includes(event.key) && SHOWN[Number(event.key) - 1]) { st.sel = SHOWN[Number(event.key) - 1]; steer(); sync(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) go();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { cyc.s = PLOT.tmin; go(); } });
if (!still.matches) cyc.s = PLOT.tmin;
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Warmte en de WBZ: t8/5, hardheid, voorwarmen",
    hint1: "Tik een onderdeel · kies koud of voorgewarmd",
    hint2: "Kies een waarde, dan − of + · tijd op log-schaal",
    cold: "Koud · 20 °C",
    warm: "Voorgewarmd · 150 °C",
    vals: "Instelling",
    pres: "Voorwarmen",
    minus: "Lager",
    plus: "Hoger",
    label: LABEL_NL,
    aria: "Doorsnede van een hoeklas met de WBZ. Niveau 1: pijltjes kiezen een onderdeel. Vanaf niveau 2: toetsen 1 tot 4 kiezen warmte-inbreng Q, voorwarmtemperatuur T0, plaatdikte d of waterstof H, pijl omhoog en omlaag veranderen de waarde.",
  },
  en: {
    title: "Heat and the HAZ: t8/5, hardness, preheat",
    hint1: "Tap a part · pick cold or preheated",
    hint2: "Pick a value, then − or + · time on a log scale",
    cold: "Cold · 20 °C",
    warm: "Preheated · 150 °C",
    vals: "Setting",
    pres: "Preheat",
    minus: "Lower",
    plus: "Higher",
    label: LABEL_EN,
    aria: "Cross-section of a fillet weld with the HAZ. Level 1: arrows pick a part. From level 2: keys 1 to 4 pick heat input Q, preheat temperature T0, plate thickness d or hydrogen H, up and down change the value.",
  },
};

const sN = STRINGS.nl;
const valBtn = (key, labelHtml) => `<button type="button" class="hz-btn" role="radio" data-pick="${key}" aria-checked="${key === "q"}" tabindex="${key === "q" ? 0 : -1}">${labelHtml}&nbsp;<b></b></button>`;
const controls = [
  `<div class="hz-controls">`,
  `<div class="hz-row" data-row="pre" role="radiogroup" aria-label="${sN.pres}"><button type="button" class="hz-btn" role="radio" data-pre="cold" aria-checked="true">${sN.cold}</button><button type="button" class="hz-btn" role="radio" data-pre="warm" aria-checked="false" tabindex="-1">${sN.warm}</button></div>`,
  `<div class="hz-row" data-row="vals"><div role="radiogroup" aria-label="${sN.vals}" style="display:flex;gap:4px;flex:1 1 auto">${valBtn("q", "<i>Q</i>")}${valBtn("t", "<i>T</i>₀")}${valBtn("d", "<i>d</i>")}${valBtn("h", "H")}</div><button type="button" class="hz-btn" data-step="-" aria-label="${sN.minus}">−</button><button type="button" class="hz-btn" data-step="+" aria-label="${sN.plus}">+</button></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="hz-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="hz-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="hz-line"></span>'.repeat(5)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=lv==="1"?s.hint1:s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
var set=function(sel,txt){var n=document.querySelector(sel);if(n)n.textContent=txt;};
set('[data-pre="cold"]',s.cold);set('[data-pre="warm"]',s.warm);
document.querySelector('[data-row="pre"]').setAttribute("aria-label",s.pres);
document.querySelector('[data-row="vals"] [role="radiogroup"]').setAttribute("aria-label",s.vals);
document.querySelector('[data-step="-"]').setAttribute("aria-label",s.minus);document.querySelector('[data-step="+"]').setAttribute("aria-label",s.plus);
var st=document.querySelector(".hz-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
const rep = (T0, Q, d, H) => `T0 ${T0} Q ${Q} d ${d}: t8/5 ${t85Of(T0, Q, d).toFixed(1)} s (${flowOf(T0, Q, d)}D) HV ${hvOf(t85Of(T0, Q, d)).toFixed(0)} Tp(H${H}) ${tpOf(d, H, Q).toFixed(0)} °C`;
console.log(`model: CEV ${CEV.toFixed(2)} CET ${CET.toFixed(3)} CEB ${CEB.toFixed(3)} · dt(20,1) ${dtOf(20, 1).toFixed(1)} mm`);
for (const r of [[20, 1, 10, 10], [20, 1, 20, 10], [20, 1, 30, 10], [20, 1, 40, 10], [150, 1, 40, 10], [150, 1, 40, 5], [20, 2, 20, 10], [150, 1, 20, 10]]) console.log("  " + rep(...r));
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

for (const [item, svg0] of AUDIT_SVG) item.svg = svg0;
A.auditOrExit(R, P, {});
