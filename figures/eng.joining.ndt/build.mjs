// Dev tool, not shipped. Builds the standalone figure for the topic Lasfouten
// en inspectie (module Lassen en verbinden): the lessons eng.joining.defects
// (level 1), inspection (level 2), ndt (level 3) and weldrca (level 4).
//
//   node figures/eng.joining.ndt/build.mjs            build the page
//   node figures/eng.joining.ndt/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.joining.ndt.html: one offline page
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
const OUT = join(ROOT, "src/content/courses/figures/eng.joining.ndt.html");

// ---------------------------------------------------------------- the model
// A butt-weld test coupon: two 25 mm S355 plates, single-V preparation with a
// 60° included angle (each fusion face, the "flank", 30° from vertical) and a
// 2 mm root gap, welded full length (240 mm). Inside it hide four defects; on
// its surface sit three that a visual inspection (VT) sees.
//
// Ultrasonic testing (UT) with an angle probe of θ = 45, 60 or 70° on the near
// plate, its index point a millimetres from the weld axis. The beam runs down at
// θ from vertical, bounces off the back wall (half skip at a = t·tanθ) and runs
// up again (second leg). At depth d the beam centre lies at
//   first leg   a − d·tanθ,          sound path s = d / cosθ
//   second leg  a − (2t − d)·tanθ,   sound path s = (2t − d) / cosθ
// A defect echoes when the beam centre passes it. Echo height, in % of full
// screen height, on a screen corrected to the reference reflector (the DAC
// line, set at 80 %, from the calibration block):
//   A = 80 · R · exp(−(Δy/σ)²) · g(x) · f(θ)       σ = 2.5 + 0.06·s  (beam spread)
// R is the reflectivity of the defect type (planar lack of fusion 1.25, a root
// corner 1.0, slag 0.6, rounded pores 0.45), g(x) the beam's overlap with the
// defect along the weld, and f(θ) the facing: a planar flaw on the 30° flank
// faces a 60° beam head on (second leg for the near flank), and falls off as
// exp(−((θ − 60°)/12°)²); a root corner reflects 1.0 / 0.95 / 0.55 at
// 45 / 60 / 70°. Recording level 40 % (−6 dB to the reference): only echoes
// above it are marked. So 60° finds the lack of fusion (+2 dB), 45° misses it
// (−12 dB) and 70° cannot reach it on this coupon; every probe finds the root;
// the pores stay under the recording level (rounded flaws: RT sees them better,
// as the lesson says).
//
// Acceptance (level 4): ISO 5817:2014, Table 1, for t = s = 25 mm:
//   gas pore 2011 d ≤ B 0.2s max 3 · C 0.3s max 4 · D 0.4s max 5 mm
//   surface pore 2017 d ≤ B not permitted · C 0.2s max 2 · D 0.3s max 3
//   undercut 5011 (smooth) h ≤ B 0.05t max 0.5 · C 0.1t max 0.5 · D 0.2t max 1
//   slag 301 h ≤ B 0.2s max 2 · C 0.3s max 3 · D 0.4s max 4
//   lack of fusion 401: B, C not permitted · D short, h ≤ 0.4s max 4
//   incomplete root penetration 402: B, C not permitted · D short, h ≤ 0.2t max 2
// EN 1090-2 links EXC1 → D, EXC2 → C, EXC3 → B (lesson ndt).
const T_PL = 25;
const GAP = 2;
const BEVEL = 30; // degrees from vertical
const RECORD = 40; // % FSH, −6 dB to the 80 % reference
const REF = 80;
const ANGLES = [45, 60, 70];
const QUALITY = ["B", "C", "D"];
const EXC = { EXC1: "D", EXC2: "C", EXC3: "B" };
const A_MIN = 24; // the probe's toe clears the cap
const A_MAX = 74;
const X_MIN = -88;
const X_MAX = 74;
const flankY = (d) => GAP / 2 + (T_PL - d) * Math.tan((BEVEL * Math.PI) / 180);
// the hidden defects (y across the weld, + toward the probe; d depth below the top)
const DEFECTS = [
  { key: "pores", code: 2011, kind: "round", x: [-80, -68], y: 0, d: 12, h: 3.5, R: 0.45 },
  { key: "slag", code: 301, kind: "round", x: [-36, -24], y: 4, d: 18, h: 2.5, R: 0.6 },
  { key: "lof", code: 401, kind: "flank", x: [-8, 10], y: flankY(15), d: 15, h: 3, R: 1.25 },
  { key: "root", code: 402, kind: "corner", x: [56, 72], y: 0, d: T_PL, h: 1.5, R: 1.0 },
];
// what VT sees on the surface
const SURFACE = [
  { key: "undercut", code: 5011, x: [22, 46], h: 0.8 },
  { key: "spore", code: 2017, x: [-56, -48], h: 1.5 },
];
const CORNER = { 45: 1, 60: 0.95, 70: 0.55 };
const LIMIT = {
  2011: { B: Math.min(0.2 * T_PL, 3), C: Math.min(0.3 * T_PL, 4), D: Math.min(0.4 * T_PL, 5) },
  2017: { B: 0, C: Math.min(0.2 * T_PL, 2), D: Math.min(0.3 * T_PL, 3) },
  5011: { B: Math.min(0.05 * T_PL, 0.5), C: Math.min(0.1 * T_PL, 0.5), D: Math.min(0.2 * T_PL, 1) },
  301: { B: Math.min(0.2 * T_PL, 2), C: Math.min(0.3 * T_PL, 3), D: Math.min(0.4 * T_PL, 4) },
  401: { B: 0, C: 0, D: Math.min(0.4 * T_PL, 4) },
  402: { B: 0, C: 0, D: Math.min(0.2 * T_PL, 2) },
};
const passes = (code, h, q) => LIMIT[code][q] > 0 && h <= LIMIT[code][q] + 1e-9;

// One echo per defect: the stronger of the two legs.
function echoesOf(xp, a, theta) {
  const tn = Math.tan((theta * Math.PI) / 180), cs = Math.cos((theta * Math.PI) / 180);
  const out = [];
  for (const D of DEFECTS) {
    let best = { key: D.key, amp: 0, s: 0, leg: 1, depth: D.d };
    for (const leg of [1, 2]) {
      const dd = leg === 1 ? D.d : 2 * T_PL - D.d;
      if (leg === 2 && D.d >= T_PL) continue;
      const yb = a - dd * tn;
      const s = dd / cs;
      const sig = 2.5 + 0.06 * s;
      const gy = Math.exp(-(((yb - D.y) / sig) ** 2));
      const dx = xp < D.x[0] ? D.x[0] - xp : xp > D.x[1] ? xp - D.x[1] : 0;
      const gx = Math.exp(-((dx / 4) ** 2));
      let f = 1;
      if (D.kind === "flank") f = leg === 2 ? Math.exp(-(((theta - 60) / 12) ** 2)) : 0.12;
      else if (D.kind === "corner") f = CORNER[theta] ?? 0.8;
      const amp = REF * D.R * gy * gx * f;
      if (amp > best.amp) best = { key: D.key, amp, s, leg, depth: D.d };
    }
    out.push(best);
  }
  return out;
}
const dB = (amp) => 20 * Math.log10(amp / REF);
// the probe position that puts the beam centre on a defect
const aimOf = (D, theta, leg) => D.y + (leg === 1 ? D.d : 2 * T_PL - D.d) * Math.tan((theta * Math.PI) / 180);
const peakOf = (key, theta) => {
  const D = DEFECTS.find((d) => d.key === key);
  const xp = (D.x[0] + D.x[1]) / 2;
  let best = 0;
  for (let a = A_MIN; a <= A_MAX; a += 0.1) best = Math.max(best, echoesOf(xp, a, theta).find((e) => e.key === key).amp);
  return best;
};

const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
const truth = (ok, what) => { if (!ok) throw new Error(what); };
// lesson ndt: EXC map, 10 % of 160 and 20 % of 240, angle probes 45/60/70
near(0.1 * 160, 16, 1e-9, "faded example 16 welds");
near(0.2 * 240, 48, 1e-9, "recall 48 welds");
truth(EXC.EXC2 === "C" && EXC.EXC3 === "B" && EXC.EXC1 === "D", "EXC map");
// lesson defects: 300 → 405 mm/min drops the arc energy 26 %
near(Math.round((1 - 300 / 405) * 100), 26, 0, "26 % less heat");
// lesson weldrca: repair rate 62 / 2400
near(Math.round((62 / 2400) * 1000) / 10, 2.6, 1e-9, "repair rate 2.6 %");
// the beam geometry and the echoes
near(aimOf(DEFECTS[2], 60, 2), 67.4, 0.05, "60° second leg on the lack of fusion");
near(T_PL * Math.tan(Math.PI / 3), 43.3, 0.05, "60° half skip");
truth(peakOf("lof", 60) > REF, "60° finds the lack of fusion above the reference");
truth(peakOf("lof", 45) < RECORD, "45° misses the lack of fusion");
truth(peakOf("lof", 70) < RECORD, "70° cannot reach the lack of fusion");
for (const th of ANGLES) truth(peakOf("root", th) >= RECORD, `root found at ${th}°`);
for (const th of ANGLES) truth(peakOf("pores", th) < RECORD, `pores stay under recording at ${th}°`);
truth(peakOf("slag", 60) >= RECORD, "slag found at 60°");
// ISO 5817 verdicts the figure shows
truth(!passes(2017, 1.5, "B") && passes(2017, 1.5, "C"), "surface pore B/C");
truth(!passes(5011, 0.8, "C") && passes(5011, 0.8, "D"), "undercut C/D");
truth(!passes(301, 2.5, "B") && passes(301, 2.5, "C"), "slag B/C");
truth(!passes(401, 3, "C") && passes(401, 3, "D"), "lack of fusion C/D");
truth(!passes(402, 1.5, "C") && passes(402, 1.5, "D"), "root C/D");

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the weld, +y toward the viewer
// (the probe's side). The bench top is z = 0.
const WIDTH = 600;
const FLOOR = -26;
const TABLE = { x: -126, y: -116, w: 388, d: 232, r: 3 };
const SUP_Z = 8;
const PT = SUP_Z + T_PL; // coupon top
const CP = { x: -100, y: -100, w: 200, d: 200, r: 0.8 };
const CAP_W = 2 * flankY(0) + 4; // the cap laps 2 mm over each edge of the groove
const CAP_H = 2.4;
const DET = { x: 120, y: -106, w: 134, d: 52, r: 3 };
const DET_Z = [5, 122];
const FACE = DET.y + DET.d; // the detector's screen face
const WIN = { x0: 129, x1: 221, z0: 46, z1: 110, r: 2, depth: 1.4 };
const GRID = { x0: WIN.x0 + 4, x1: WIN.x1 - 4, z0: WIN.z0 + 4, z1: WIN.z1 - 5 };
const S_MAX = 125; // sound path across the screen, mm
const SOCKET = [146, -64, DET_Z[1] + 6];
const PROBE = { w: 16, back: 20, front: 6 }; // footprint around the index point
const PROBE_Z = [PT, PT + 9, PT + 21]; // wedge, case

const FIT = [
  ...k.boxCorners(TABLE, FLOOR, 0),
  ...k.boxCorners(DET, DET_Z[0], DET_Z[1] + 14),
  [CP.x, CP.y + CP.d, PT + 80],
];
const PAD = 6;
const AZIMUTH = Number(process.env.AZ ?? 56);
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
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameUp = (o) => G.frameOf(o, Zv, X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const { sinA } = k.cameraOf(P);

// ---------------------------------------------------------------- recorder
const REST = { x: X_MIN, a: A_MIN };
const MOVE = [X_MAX - X_MIN, A_MAX - A_MIN, 0];
const R = A.recorder(P, { order: ["p"], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "", ...rest } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVE : [0, 0, 0], attrs, ...rest });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const grp = (g) => ({ piece: g === "p" ? "p" : "", attrs: ` data-g="${g}"` });
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = "", inner = "", g = "s", owner, ...opts } = {}) {
  const ground = name.startsWith("stand.");
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ...(ground ? { ground: true } : {}) }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], { ...grp(g), ...opts });
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = "", inner = "", g = "s", ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, ...(name.startsWith("stand.") ? { ground: true } : {}) }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], { ...grp(g), ...opts });
}
function turned(name, F, profile, style = {}, { extra = "", inner = "", g = "s", ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], { ...grp(g), ...opts });
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", g = "s", steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], { ...grp(g), ...opts });
}

// A recess in the face y = const: inner walls shaded by facing, a back plane
// holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "nd-glass") {
  const id = `nd-clip-${clips++}`;
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
// These take the kit as an argument, so the build and the page run the same code.

// The sound beam inside the coupon (seen as if the steel were glass): from the
// index point down to the back wall and up to the top surface, in the plane
// x = xp. It stops where it leaves the coupon.
function beamSvg(K, P, xp, a, theta) {
  const tn = Math.tan((theta * Math.PI) / 180);
  const y1 = a - T_PL * tn;
  let y2 = a - 2 * T_PL * tn;
  let z2 = PT;
  const yEdge = CP.y + 2;
  if (y2 < yEdge) { z2 = SUP_Z + T_PL * ((yEdge - y1) / (y2 - y1)); y2 = yEdge; }
  const pts = [[xp, a, PT], [xp, y1, SUP_Z], [xp, y2, z2]];
  const flat = pts.map((p) => K.iso(p, P));
  const f = (v) => v.toFixed(2);
  // the slice of steel the beam runs in: from the probe to the far edge, full thickness
  const slice = [[xp, a, PT], [xp, CP.y, PT], [xp, CP.y, SUP_Z], [xp, a, SUP_Z]].map((p) => K.iso(p, P));
  let out = `<path class="nd-slice" d="${K.pathOf(slice, true)}"/>`;
  out += `<path class="nd-beam-glow" d="M${flat.map(([x, y]) => f(x) + " " + f(y)).join("L")}"/>`;
  out += `<path class="nd-beam" d="M${flat.map(([x, y]) => f(x) + " " + f(y)).join("L")}"/>`;
  out += flat.slice(1).map(([x, y]) => `<circle class="nd-beam-dot" cx="${f(x)}" cy="${f(y)}" r="1.1"/>`).join("");
  return out;
}

// A defect seen through the steel: a capsule along the weld, lit by its echo.
function ghostSvg(K, P, D, glow, found) {
  const z = PT - D.d;
  const r = Math.max(1.4, D.h * 0.6);
  const pts = [];
  for (let i = 0; i <= 12; i++) { const t = -Math.PI / 2 + (Math.PI * i) / 12; pts.push([D.x[1] + Math.cos(t) * r * 0.7, D.y + Math.sin(t) * r]); }
  for (let i = 0; i <= 12; i++) { const t = Math.PI / 2 + (Math.PI * i) / 12; pts.push([D.x[0] + Math.cos(t) * r * 0.7, D.y + Math.sin(t) * r]); }
  const d = K.pathOf(pts.map(([x, y]) => K.iso([x, y, z], P)), true);
  const a = Math.max(found ? 0.35 : 0, glow);
  if (a < 0.01) return "";
  return `<path class="nd-ghost" style="opacity:${a.toFixed(3)}" d="${d}"/>`;
}

// The inspector's paint mark beside the weld over a found indication.
function markSvg(K, P, x0, x1, bad) {
  const y = CAP_W / 2 + 7;
  const pts = [[x0, y + 3], [x0, y], [x1, y], [x1, y + 3]].map((p) => K.iso([p[0], p[1], PT + 0.05], P));
  return `<path class="nd-mark${bad ? " nd-bad" : ""}" d="${K.pathOf(pts)}"/>`;
}

// The A-scan, in the plane of the screen (u = x, v = −z).
function traceOf(echoes, theta, seed) {
  const N = 170;
  const out = [];
  const zOf = (amp) => GRID.z0 + ((GRID.z1 - GRID.z0) * Math.min(amp, 104)) / 100;
  for (let i = 0; i <= N; i++) {
    const s = (S_MAX * i) / N;
    let amp = 1.2 + 1.4 * Math.abs(Math.sin(i * 12.9898 + seed * 3.1) * Math.sin(i * 4.1 + seed));
    amp += 70 * Math.exp(-(((s - 1.2) / 1.1) ** 2)); // the wedge echo at the index
    for (const e of echoes) if (e.amp > 0.5) amp += e.amp * Math.exp(-(((s - e.s) / 1.6) ** 2));
    out.push([GRID.x0 + ((GRID.x1 - GRID.x0) * i) / N, -zOf(amp)]);
  }
  return "M" + out.map(([u, v]) => u.toFixed(2) + " " + v.toFixed(2)).join("L");
}

// ---------------------------------------------------------------- bench
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(TABLE, -4), FLOOR, 2, P)}"/>`];
for (const [x, y] of k.corners(TABLE, 18)) post("stand.foot", x, y, 9, FLOOR, -14, { tone: "lo" }, { steps: 8 });
{
  const bolts = k.corners(TABLE, 7);
  const fy = TABLE.y + TABLE.d;
  const plate = [
    `<g transform="${planeOf(fy)}"><path class="nd-card" d="${flatRect(-130, -11, -82, -3, 1.2, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-125 8.4H-92M-125 6H-100"/></g>`,
    Dt([[-127.5, fy, -4.5], [-84.5, fy, -4.5], [-127.5, fy, -9.5], [-84.5, fy, -9.5]].map(at), { size: 0.4 }),
  ].join("");
  box("stand.bench", TABLE, -14, 0, { tone: "lo" }, {
    steps: 3,
    bevel: 0.8,
    inner: L(k.sideSeam(TABLE, -9, P, 3), { tone: "faint" }),
    extra: L(k.planOutline(k.insetPlan(TABLE, 5), 0, P, 3), { tone: "faint" }) + Dt(bolts.map(([x, y]) => at([x, y, 0])), { size: 0.5 }) + plate,
  });
}
// two support bars under the coupon
for (const xc of [-64, 64]) box("support", { x: xc - 7, y: -92, w: 14, d: 184, r: 0.8 }, 0, SUP_Z, { tone: "lo" }, { bevel: 0.3 });

// ---------------------------------------------------------------- the coupon
{
  const XE = CP.x + CP.w; // the cut end face (+x), with the weld macro on it
  const fl = (d) => flankY(d);
  // macro: the groove, the cap profile and the fusion lines on the end face
  const capProfile = [];
  for (let i = 0; i <= 16; i++) { const u = -CAP_W / 2 + (CAP_W * i) / 16; capProfile.push([XE, u, PT + CAP_H * (1 - (2 * u / CAP_W) ** 2)]); }
  const weldArea = [[XE, -fl(T_PL), SUP_Z], [XE, -CAP_W / 2, PT], ...capProfile.slice(1, -1), [XE, CAP_W / 2, PT], [XE, fl(T_PL), SUP_Z]].map((p, i) => p);
  weldArea[0] = [XE, -GAP / 2 - 1.2, SUP_Z];
  weldArea[weldArea.length - 1] = [XE, GAP / 2 + 1.2, SUP_Z];
  const macro = [
    `<path class="nd-weldmetal" d="${k.pathOf(weldArea.map(at), true)}"/>`,
    L(k.pathOf([[XE, -GAP / 2 - 1.2, SUP_Z], [XE, -fl(0), PT - 0.01], [XE, -CAP_W / 2, PT]].map(at)) + k.pathOf([[XE, GAP / 2 + 1.2, SUP_Z], [XE, fl(0), PT - 0.01], [XE, CAP_W / 2, PT]].map(at)), { tone: "lo" }),
    // run lines between the passes
    L([10, 18].map((d) => k.pathOf([[XE, -fl(d), PT - d], [XE, 0, PT - d + 1.6], [XE, fl(d), PT - d]].map(at))).join(""), { tone: "faint" }),
  ].join("");
  // a scribed reference line on the parent metal, 100 mm from the weld axis
  const ref = L(k.lineOnTop([CP.x, 90], [XE, 90], PT, P), { tone: "faint" });
  // centre punch marks at both ends of the weld axis beside the cap
  const punches = Dt([[CP.x + 4, CAP_W / 2 + 3, PT], [XE - 4, CAP_W / 2 + 3, PT], [CP.x + 4, -CAP_W / 2 - 3, PT], [XE - 4, -CAP_W / 2 - 3, PT]].map(at), { size: 0.45, tone: "lo" });
  // spatter on the near plate
  const spatter = Dt([[-84, 26, PT], [-80, 31, PT], [-88, 34, PT], [-74, 24, PT], [-92, 23, PT], [-77, 40, PT], [-20, -28, PT], [-14, -33, PT]].map(at), { size: 0.55, tone: "mid" });
  box("coupon", CP, SUP_Z, PT, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.5, extra: macro + ref + punches + spatter });
}
// the cap: a crowned bead with ripples, an undercut along one toe and two
// surface pores
function capSvg() {
  const half = CAP_W / 2;
  const x0 = CP.x, x1 = CP.x + CP.w;
  const zc = (u) => PT + CAP_H * (1 - (2 * u / CAP_W) ** 2);
  const far = [], crest = [], nearT = [];
  for (let i = 0; i <= 12; i++) {
    const x = x0 + ((x1 - x0) * i) / 12;
    far.push(at([x, -half, PT]));
    crest.push(at([x, 0, zc(0)]));
    nearT.push(at([x, half, PT]));
  }
  // end profile at +x
  const endProfile = [];
  for (let i = 0; i <= 16; i++) { const u = half - (CAP_W * i) / 16; endProfile.push(at([x1, u, zc(u)])); }
  const backHalf = k.pathOf([...far, ...crest.slice().reverse()], true);
  const frontHalf = k.pathOf([...crest, ...nearT.slice().reverse()], true);
  const fill = k.pathOf([...far, ...endProfile.slice().reverse().slice(1), ...nearT.slice().reverse()], true);
  // ripples: chevrons pointing back along the weld (the weld ran toward +x)
  const rip = [];
  for (let x = x0 + 5; x < x1 - 2; x += 4.6) {
    const pts = [];
    for (let j = 0; j <= 8; j++) {
      const u = -half + (2 * half * j) / 8;
      pts.push(at([x - 2.4 * (1 - (u / half) ** 2), u, zc(u) + 0.02]));
    }
    rip.push(k.pathOf(pts));
  }
  // undercut: a dark groove just outside the near toe
  const uc = SURFACE[0];
  const groove = [];
  for (let i = 0; i <= 10; i++) { const x = uc.x[0] + ((uc.x[1] - uc.x[0]) * i) / 10; const w = 0.9 * Math.sin((Math.PI * i) / 10); groove.push(at([x, half + 0.4 + w, PT])); }
  for (let i = 10; i >= 0; i--) { const x = uc.x[0] + ((uc.x[1] - uc.x[0]) * i) / 10; groove.push(at([x, half + 0.1, PT])); }
  const sp = SURFACE[1];
  const pores = [[sp.x[0] + 1.5, 3.2, 0.75], [sp.x[0] + 4.5, -2.4, 0.6], [sp.x[1] - 1.2, 1.2, 0.5]].map(([x, u, r]) => {
    const ring = [];
    for (let i = 0; i < 14; i++) { const t = (i / 14) * Math.PI * 2; ring.push(at([x + Math.cos(t) * r, u + Math.sin(t) * r, zc(u) + 0.05])); }
    return k.pathOf(ring, true);
  });
  return [
    `<path class="iso-fill" d="${fill}"/>`,
    `<path class="nd-cap-top" d="${backHalf}"/>`,
    `<path class="nd-cap-side" d="${frontHalf}"/>`,
    `<path class="nd-cap-end" d="${k.pathOf(endProfile, false)}"/>`,
    L(rip.join(""), { tone: "faint" }),
    `<path class="nd-pit" d="${k.pathOf(groove, true)}"/>`,
    `<path class="nd-pit" d="${pores.join("")}"/>`,
    L(k.pathOf(far) + k.pathOf(nearT), { tone: "mid" }),
    L(k.pathOf(endProfile), { tone: "mid" }),
  ].join("");
}
put("cap", [0, 0, PT + 1], capSvg(), [R.solid(A.box([CP.x, -CAP_W / 2, PT], [CP.x + CP.w, CAP_W / 2, PT + CAP_H], { name: "cap", owner: "weld" }))], { attrs: ' data-g="s"' });
solids++;
// a steel rule along the near edge (x) and one across the plate at the +x end (a)
{
  const strip = { x: CP.x + 6, y: 95, w: CP.w - 12, d: 4.5, r: 0.4 };
  const ticks = k.topTicks(strip.x + 2, strip.x + strip.w - 2, 5, 5, strip.y, PT + 0.6, [2.2, 4.2], P, "x");
  box("rule.x", strip, PT, PT + 0.6, { tone: "lo", crease: "none" }, { extra: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) });
  const cross = { x: 85, y: 22, w: 6, d: 66, r: 0.4 };
  const t2 = k.topTicks(cross.y + 2, cross.y + cross.d - 2, 5, 5, cross.x, PT + 0.6, [2.2, 4.2], P, "y");
  box("rule.a", cross, PT, PT + 0.6, { tone: "lo", crease: "none" }, { extra: L(t2.minor, { tone: "lo" }) + L(t2.major, { tone: "mid" }) });
}

// ---------------------------------------------------------------- the angle probe (piece "p")
// Recorded at REST; the page moves it with the same offset the audit poses.
{
  const P_ = { g: "p" };
  const x = REST.x, a = REST.a;
  const wedge = { x: x - PROBE.w / 2, y: a - PROBE.front, w: PROBE.w, d: PROBE.front + PROBE.back, r: 1 };
  // the index mark on the wedge's side at the beam exit, and the couplant film
  const idx = L(k.pathOf([[x + PROBE.w / 2, a, PT + 0.4], [x + PROBE.w / 2, a, PT + 4.2]].map(at)), { tone: "mid" });
  box("probe.wedge", wedge, PROBE_Z[0], PROBE_Z[1], { tone: "lo" }, { ...P_, steps: 2, bevel: 0.3, extra: idx });
  const caseP = k.insetPlan({ ...wedge, y: wedge.y + 2, d: wedge.d - 2 }, 0.8);
  const label = k.faceTextSvg(k.sideMatrix([x + PROBE.w / 2 - 0.8, caseP.y + caseP.d - 3], PROBE_Z[2] - 4.5, P, "right"), "60°", { size: 5.2, tone: "hi" }).replace("<text ", '<text data-angle="" ');
  box("probe.case", caseP, PROBE_Z[1], PROBE_Z[2], { tone: "hi", crease: "lo", lit: true }, { ...P_, steps: 2, bevel: 0.4, inner: L(k.sideSeam(caseP, PROBE_Z[1] + 2.2, P, 2), { tone: "faint" }), extra: label });
  const Fc = frameUp([x, a + 12, PROBE_Z[2]]);
  discAt("probe.socket", Fc, 0, 3, 4, { tone: "mid" }, { ...P_ });
  discAt("probe.plug", Fc, 3, 9, 3.2, { tone: "hi", crease: "lo" }, { ...P_, inner: L(G.ribsOf(Fc, 3.6, 8.4, 3.2, 12, P, { seams: false }), { tone: "lo" }) });
  discAt("probe.boot", Fc, 9, 14, 2.2, { tone: "lo" }, { ...P_, extra: Dt([at([x, a + 12, PROBE_Z[2] + 14])], { size: 0.9, tone: "mid" }) });
}

// ---------------------------------------------------------------- the flaw detector
{
  const fy = FACE;
  for (const xc of [DET.x + 16, DET.x + DET.w - 16]) box("det.foot", { x: xc - 10, y: DET.y + 6, w: 20, d: DET.d - 12, r: 1.5 }, 0, DET_Z[0], { tone: "lo" }, { bevel: 0.2 });
  const grid = [];
  const gx = (i) => GRID.x0 + ((GRID.x1 - GRID.x0) * i) / 10;
  const gz = (i) => GRID.z0 + ((GRID.z1 - GRID.z0) * i) / 5;
  for (let i = 0; i <= 10; i++) grid.push(`M${gx(i).toFixed(2)} ${(-GRID.z0).toFixed(2)}V${(-GRID.z1).toFixed(2)}`);
  for (let i = 0; i <= 5; i++) grid.push(`M${GRID.x0} ${(-gz(i)).toFixed(2)}H${GRID.x1}`);
  const zRef = GRID.z0 + ((GRID.z1 - GRID.z0) * REF) / 100;
  const zRec = GRID.z0 + ((GRID.z1 - GRID.z0) * RECORD) / 100;
  const screen = [
    `<path class="nd-grid" d="${grid.join("")}"/>`,
    `<path class="nd-ref" d="M${GRID.x0} ${(-zRef).toFixed(2)}H${GRID.x1}"/>`,
    `<path class="nd-rec" d="M${GRID.x0} ${(-zRec).toFixed(2)}H${GRID.x1}"/>`,
    `<path class="nd-trace" data-trace="" d="${traceOf([], 60, 0)}"/>`,
  ].join("");
  const faceBits = [
    recess(WIN, fy, screen),
    Dt([[DET.x + 5, fy, DET_Z[0] + 5], [DET.x + DET.w - 5, fy, DET_Z[0] + 5], [DET.x + 5, fy, DET_Z[1] - 5], [DET.x + DET.w - 5, fy, DET_Z[1] - 5]].map(at), { size: 0.45 }),
    // vent slots on the +x side
    L([0, 1, 2, 3, 4].map((i) => { const z = 40 + i * 9; return k.pathOf([at([DET.x + DET.w, DET.y + 12, z]), at([DET.x + DET.w, DET.y + 40, z]), at([DET.x + DET.w, DET.y + 40, z + 3]), at([DET.x + DET.w, DET.y + 12, z + 3])], true); }).join(""), { tone: "lo" }),
  ].join("");
  box("det.body", DET, DET_Z[0], DET_Z[1], { tone: "mid" }, { steps: 4, bevel: 0.6, inner: L(k.sideSeam(DET, DET_Z[0] + 12, P, 4), { tone: "faint" }), extra: faceBits });
  // rubber bumpers on the four top corners
  for (const [cx, cy] of [[DET.x + 6, DET.y + 6], [DET.x + DET.w - 6, DET.y + 6], [DET.x + 6, DET.y + DET.d - 6], [DET.x + DET.w - 6, DET.y + DET.d - 6]]) box("det.bumper", { x: cx - 7, y: cy - 7, w: 14, d: 14, r: 3 }, DET_Z[1], DET_Z[1] + 3, { tone: "lo" }, { steps: 3 });
  // carry handle
  for (const xc of [DET.x + 30, DET.x + DET.w - 30]) box("det.handle-post", { x: xc - 4, y: DET.y + 22, w: 8, d: 10, r: 1 }, DET_Z[1], DET_Z[1] + 10, { tone: "mid" }, { steps: 2 });
  box("det.handle", { x: DET.x + 24, y: DET.y + 21, w: DET.w - 48, d: 12, r: 3 }, DET_Z[1] + 10, DET_Z[1] + 14, { tone: "hi", crease: "lo" }, { steps: 3, bevel: 0.3 });
  // probe sockets on top
  for (const [i, xc] of [[0, SOCKET[0]], [1, SOCKET[0] + 14]]) {
    const F = frameUp([xc, SOCKET[1], DET_Z[1]]);
    discAt(i ? "det.socket-rx" : "det.socket", F, 0, 6, 4.2, { tone: "hi", crease: "lo" }, { extra: L(G.circleOf(F, 6, 2, P, 16), { tone: "lo" }) });
  }
  // keypad under the screen, two knobs and the power lamp on the right
  for (let i = 0; i < 5; i++) {
    const F = frameY([WIN.x0 + 8 + i * 19, fy, 28]);
    discAt("det.key", F, 0, 1.6, 5, { tone: "mid", crease: "lo" }, { steps: 20 });
  }
  const knob = (name, z) => {
    const F = frameY([240, fy, z]);
    discAt(name, F, 0, 2, 8, { tone: "mid" });
    discAt(name + "-cap", F, 2, 7, 6.2, { tone: "hi", crease: "lo" }, { inner: L(G.ribsOf(F, 2.6, 7, 6.2, 18, P, { seams: false }), { tone: "lo" }), extra: Dt([at(G.pointOf(F, 7, 4, -Math.PI / 2))], { size: 0.55, tone: "mid" }) });
  };
  knob("det.gain", 92);
  knob("det.range", 64);
  const FL = frameY([240, fy, 30]);
  discAt("det.lamp-ring", FL, 0, 1.4, 4, { tone: "mid" });
  discAt("det.lamp", FL, 1.4, 2.6, 2.8, { tone: "hi", crease: "none" }, { attrs: ' data-g="s" data-lamp=""' });
}

// ---------------------------------------------------------------- calibration block, couplant, marker
{
  // the V2 (K2) calibration block: 75 × 43 × 12.5 with an R25 and an R50 arc
  const blk = { x: 132, y: -42, w: 75, d: 43, r: 6 };
  const engr = L(k.pathOf(Array.from({ length: 13 }, (_, i) => { const t = Math.PI * 0.5 + (Math.PI * i) / 12; return at([blk.x + 37.5 + Math.cos(t) * 12, blk.y + 21.5 + Math.sin(t) * 12, 12.5]); })), { tone: "faint" });
  const hole = L(k.ring(blk.x + 37.5, blk.y + 21.5, 2.5, 12.5, P, 18), { tone: "lo" });
  box("block", blk, 0, 12.5, { tone: "hi", crease: "lo" }, { steps: 6, bevel: 0.4, extra: engr + hole + Dt([at([blk.x + 37.5, blk.y + 9.5, 12.5]), at([blk.x + 37.5, blk.y + 33.5, 12.5])], { size: 0.5, tone: "lo" }) });
}
{
  const c = [236, -22];
  post("bottle", c[0], c[1], 13, 0, 46, { tone: "mid" }, { steps: 40, inner: L(k.sideArc(c[0], c[1], 13, 18, P, 40) + k.sideArc(c[0], c[1], 13, 34, P, 40), { tone: "faint" }) });
  turned("bottle.shoulder", frameUp([c[0], c[1], 46]), [[0, 13], [4, 11, 1], [7, 6]], { tone: "mid" });
  post("bottle.cap", c[0], c[1], 6, 53, 60, { tone: "hi", crease: "lo" }, { steps: 24 });
  post("bottle.nozzle", c[0], c[1], 2, 60, 70, { tone: "hi", crease: "lo" }, { steps: 14, extra: Dt([at([c[0], c[1], 70])], { size: 0.5, tone: "mid" }) });
}
{
  // a paint marker lying on the bench
  const F = frameX([150, 34, 6]);
  discAt("marker", F, 0, 92, 6, { tone: "mid" }, { inner: L(G.arcOf(F, 60, 6, P), { tone: "faint" }) });
  discAt("marker.cap", F, 92, 118, 6.4, { tone: "hi", crease: "lo" }, { inner: L(G.arcOf(F, 96, 6.4, P), { tone: "lo" }) });
  turned("marker.tip", F, [[0, 5], [-5, 2.6, 1], [-8, 1.6]], { tone: "lo" });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: A.uniformStates(12) });
R.items.sort((a, b) => a.key - b.key);
// the live layers (marks, ghosts, beam) sit on the coupon, just before the probe
const firstProbe = R.items.findIndex((item) => item.name.startsWith("probe."));
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const live = `<g data-marks=""></g><g data-ghosts=""></g><g data-beam="">${beamSvg(k, P, REST.x, REST.a, 60)}</g>`;
groups.splice(firstProbe, 0, live);

const LABEL_NL =
  "Een inspectietafel met een proefstuk: twee stalen platen van 25 mm met een V-naad, kant op kant gelast, op twee steunen. Op de las zie je de rups met rimpels, een randinkarteling langs één rand, een paar oppervlakteporiën en spatten. Op het kopse einde is de doorsnede van de V-naad geëtst. Een ultrasone hoekkop staat naast de las; een kabel loopt naar het ultrasoontoestel achter op tafel, waarvan het scherm een A-scan toont: een lijn met pieken, waarbij elke piek een echo van een fout binnenin is. Verder liggen er een ijkblok, een fles koppelmiddel en een verfstift.";
const LABEL_EN =
  "An inspection bench with a test coupon: two 25 mm steel plates with a single-V butt weld, on two supports. The weld shows its cap with ripples, undercut along one toe, a few surface pores and spatter. The cut end is etched to show the V-groove cross-section. An ultrasonic angle probe sits beside the weld; a cable runs to the flaw detector at the back of the bench, whose screen shows an A-scan: a line with peaks, each peak an echo from a flaw inside. A calibration block, a bottle of couplant and a paint marker lie on the bench.";

const body = [...halo, ...groups, `<path class="nd-cable" data-cable="" d=""/>`, `<g data-ends=""></g>`, `<g data-pick=""></g>`];
const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "probe", g: "p", at: [REST.x, REST.a + 6, PROBE_Z[2]] },
  { key: "cable", g: "s", at: [SOCKET[0], SOCKET[1], DET_Z[1] + 30] },
  { key: "screen", g: "s", at: [(WIN.x0 + WIN.x1) / 2, FACE, (WIN.z0 + WIN.z1) / 2] },
  { key: "detector", g: "s", at: [240, FACE, 78] },
  { key: "cap", g: "s", at: [-10, 0, PT + CAP_H] },
  { key: "undercut", g: "s", at: [34, CAP_W / 2, PT] },
  { key: "spore", g: "s", at: [-52, 0, PT + CAP_H] },
  { key: "spatter", g: "s", at: [-82, 30, PT] },
  { key: "coupon", g: "s", at: [-50, 66, PT] },
  { key: "macro", g: "s", at: [CP.x + CP.w, 0, PT - 10] },
  { key: "rule", g: "s", at: [0, 97, PT] },
  { key: "block", g: "s", at: [170, -20, 12.5] },
  { key: "bottle", g: "s", at: [236, -22, 50] },
  { key: "marker", g: "s", at: [200, 34, 12] },
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
  --nd-hair:rgba(240,233,218,.12);--nd-accent:#5C9FAE;--nd-glass:#071A1E;--nd-grid:rgba(124,146,137,.28);--nd-trace:#BFE3EA;
  --nd-weld:#1B4049;--nd-cap-top:#1A3C44;--nd-cap-side:#143139;--nd-pit:#06161A;--nd-cable:#45615D;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --nd-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --nd-hair:rgba(11,41,27,.14);--nd-accent:#276F81;--nd-glass:#E2ECEA;--nd-grid:rgba(30,51,40,.16);--nd-trace:#0B291B;
  --nd-weld:#DCE6E2;--nd-cap-top:#EEF2EC;--nd-cap-side:#DCE3DB;--nd-pit:#5A6B60;--nd-cable:#7D877A;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--nd-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:156px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:270px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--nd-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--nd-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:58px!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap}
.iso-plate-corner[data-corner="readout"]{bottom:76px!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.nd-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nd-acc{color:var(--nd-accent);font-weight:600}
.nd-strong{color:var(--anatomy-strong);font-weight:600}
.nd-mute{color:var(--anatomy-muted)}
.nd-warn{color:var(--nd-accent);font-weight:700;text-decoration:underline;text-underline-offset:2px}
.nd-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:none;-webkit-tap-highlight-color:transparent;cursor:crosshair;border-radius:8px}
.nd-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.nd-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.nd-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;gap:4px;height:44px}
.nd-seg{display:flex;gap:4px;flex:1 1 auto}
.nd-seg[hidden]{display:none}
.nd-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 6px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--nd-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--nd-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.nd-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.nd-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--nd-accent);color:var(--nd-accent);font-weight:600}
.nd-play{flex:0 0 44px}
.nd-play svg{width:14px;height:14px;fill:currentColor}
.nd-play [data-icon="pause"]{display:none}
.nd-play[data-on] [data-icon="pause"]{display:block}
.nd-play[data-on] [data-icon="play"]{display:none}
.nd-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.nd-glass{fill:var(--nd-glass);stroke:none}
.nd-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso .iso-face-text{font-family:var(--anatomy-mono);font-weight:600}
.nd-grid{fill:none;stroke:var(--nd-grid);stroke-width:.35px}
.nd-ref{fill:none;stroke:var(--anatomy-mid);stroke-width:.7px}
.nd-rec{fill:none;stroke:var(--nd-accent);stroke-width:.6px;stroke-dasharray:2 1.6}
.nd-trace{fill:none;stroke:var(--nd-trace);stroke-width:1.1px;stroke-linejoin:round}
.nd-weldmetal{fill:var(--nd-weld);stroke:none}
.nd-cap-top{fill:var(--nd-cap-top);stroke:none}
.nd-cap-side{fill:var(--nd-cap-side);stroke:none}
.nd-cap-end{fill:var(--nd-weld);stroke:none}
.nd-pit{fill:var(--nd-pit);stroke:var(--anatomy-lo);stroke-width:.25px}
.nd-beam{fill:none;stroke:var(--nd-accent);stroke-width:1.2px;stroke-linejoin:round;stroke-linecap:round}
.nd-beam-glow{fill:none;stroke:var(--nd-accent);stroke-width:5px;stroke-linejoin:round;stroke-linecap:round;opacity:.18}
.nd-beam-dot{fill:var(--nd-accent);stroke:none}
.nd-slice{fill:var(--nd-accent);fill-opacity:.1;stroke:var(--nd-accent);stroke-opacity:.45;stroke-width:.5px;stroke-linejoin:round}
.nd-ghost{fill:var(--nd-accent);stroke:var(--anatomy-strong);stroke-width:.4px}
.nd-mark{fill:none;stroke:var(--anatomy-mid);stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}
.nd-mark.nd-bad{stroke:var(--nd-accent);stroke-width:2px}
.nd-cable{fill:none;stroke:var(--nd-cable);stroke-width:2.2px;stroke-linecap:round}
.nd-end{fill:var(--anatomy-mid);stroke:none}
.nd-pick{fill:none;stroke:var(--nd-accent);stroke-width:1.4px}
.nd-pick-dot{fill:var(--nd-accent);stroke:none}
html:not([data-level="1"]) [data-pick]{display:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .3s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--nd-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const liveJs = `
const P = ${JSON.stringify(P)};
const T_PL = ${T_PL}, SUP_Z = ${SUP_Z}, PT = ${PT}, CAP_W = ${CAP_W}, REF = ${REF}, RECORD = ${RECORD}, S_MAX = ${S_MAX};
const CP = ${JSON.stringify(CP)}, GRID = ${JSON.stringify(GRID)}, REST = ${JSON.stringify(REST)};
const A_MIN = ${A_MIN}, A_MAX = ${A_MAX}, X_MIN = ${X_MIN}, X_MAX = ${X_MAX};
const DEFECTS = ${JSON.stringify(DEFECTS)};
const SURFACE = ${JSON.stringify(SURFACE)};
const CORNER = ${JSON.stringify(CORNER)};
const LIMIT = ${JSON.stringify(LIMIT)};
const ANGLES = ${JSON.stringify(ANGLES)}, QUALITY = ${JSON.stringify(QUALITY)};
const PARTS = ${JSON.stringify(PARTS)};
const SOCKET = ${JSON.stringify(SOCKET)}, PROBE_Z = ${JSON.stringify(PROBE_Z)}, DET_TOP = ${DET_Z[1]};
const passes = ${passes.toString()};
${echoesOf.toString()}
const dB = ${dB.toString()};
${beamSvg.toString()}
${ghostSvg.toString()}
${markSvg.toString()}
${traceOf.toString()}
const K = { iso, pathOf };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", probe: "Angle probe", a: "a", from: "from the weld axis", s: "sound path s", depth: "depth", leg1: "1st leg", leg2: "2nd leg", none: "no echo", ref: "vs reference", under: "under the recording level", round: "rounded flaw: RT sees it better",
      found: "found", of: "of", ind: "indications", vtLine: "VT (outside): undercut · surface pores · spatter", vtIn: "inside it looks perfect: UT", tapPart: "tap a part or a defect",
      head: "hits the flank (30°) square on", oblique: "misses the flank face", reach: "cannot reach the flank's 2nd leg here",
      level: "ISO 5817 level", reject: "reject", ok: "within", verdict: "REJECT", accept: "ACCEPT", gouge: "gouge out, reweld and retest", release: "release the weld", none2: "nothing",
      names: { pores: "pores", slag: "slag", lof: "lack of fusion", root: "root", undercut: "undercut", spore: "surface pore" },
      parts: { probe: ["Angle probe", "sends sound into the steel at a slant"], cable: ["Probe cable", "pulses out, echoes back"], screen: ["A-scan", "a line with peaks: each peak an echo"], detector: ["Flaw detector", "gain and range knobs, keypad"], cap: ["Weld cap", "the top of the weld with its ripples"], undercut: ["Undercut", "a groove melted along the weld toe"], spore: ["Surface pores", "pinholes: trapped gas"], spatter: ["Spatter", "metal drops beside the weld: cosmetic"], coupon: ["Test coupon", "two 25 mm plates, butt welded"], macro: ["Cross-section", "V-groove, flanks and root, etched"], rule: ["Steel rule", "the position along the weld"], block: ["Calibration block", "sets the reference echo"], bottle: ["Couplant", "gel: lets the sound into the steel"], marker: ["Paint marker", "marks each indication on the plate"] } }
  : { dec: ",", probe: "Hoekkop", a: "a", from: "van de lasas", s: "geluidsweg s", depth: "diepte", leg1: "1e been", leg2: "2e been", none: "geen echo", ref: "t.o.v. referentie", under: "onder het registratieniveau", round: "ronde fout: RT ziet hem beter",
      found: "gevonden", of: "van", ind: "indicaties", vtLine: "VT (van buiten): randinkarteling · poriën · spatten", vtIn: "van binnen ziet hij er perfect uit: UT", tapPart: "tik een onderdeel of een fout",
      head: "raakt de lasflank (30°) loodrecht", oblique: "raakt de flank scheef", reach: "haalt de flank (2e been) hier niet",
      level: "ISO 5817 niveau", reject: "afkeur", ok: "binnen", verdict: "AFKEUR", accept: "GOED", gouge: "uitgutsen, opnieuw lassen en testen", release: "las vrijgeven", none2: "niets",
      names: { pores: "poriën", slag: "slak", lof: "bindingsfout", root: "wortel", undercut: "randinkarteling", spore: "oppervlakteporie" },
      parts: { probe: ["Hoekkop", "stuurt geluid schuin het staal in"], cable: ["Taster­kabel", "pulsen heen, echo’s terug"], screen: ["A-scan", "een lijn met pieken: elke piek een echo"], detector: ["Ultrasoontoestel", "knoppen voor versterking en bereik"], cap: ["Lasrups", "de bovenkant van de las, met rimpels"], undercut: ["Randinkarteling", "een groefje langs de lasrand"], spore: ["Oppervlakteporiën", "speldenprikjes: opgesloten gas"], spatter: ["Spatten", "metaaldruppels naast de las: cosmetisch"], coupon: ["Proefstuk", "twee platen van 25 mm, stomp gelast"], macro: ["Doorsnede", "V-naad, flanken en grondnaad, geëtst"], rule: ["Meetlat", "de plaats langs de las"], block: ["IJkblok", "geeft de referentie-echo"], bottle: ["Koppelmiddel", "gel: laat het geluid het staal in"], marker: ["Verfstift", "markeert elke indicatie op de plaat"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const sgn = (v, d) => (v >= 0 ? "+" : "−") + fmt(Math.abs(v), d);

const stage = document.querySelector(".nd-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  trace: q("[data-trace]"), beam: q("[data-beam]"), ghosts: q("[data-ghosts]"), marks: q("[data-marks]"), cable: q("[data-cable]"), ends: q("[data-ends]"), pick: q("[data-pick]"),
  lamp: q("[data-lamp]"), angle: q("[data-angle]"), gp: [...svg.querySelectorAll('[data-g="p"]')],
};
const lines = [...document.querySelectorAll("[data-readout] .nd-line")];
const announcer = document.querySelector(".nd-sr");
const playBtn = document.querySelector(".nd-play");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ------------------------------------------------ state
const st = { x: -20, a: 50, theta: 60, q: "C", playing: !still.matches, t: 0, seed: 0 };
const found = new Set();
const VT_KEYS = ["undercut", "spore"];
// level 4 opens on a finished scan: everything 60° UT records, plus VT
if (LVL === 4) for (const D of DEFECTS) { let m = 0; for (let a = A_MIN; a <= A_MAX; a += 0.5) m = Math.max(m, echoesOf((D.x[0] + D.x[1]) / 2, a, 60).find((e) => e.key === D.key).amp); if (m >= RECORD) found.add(D.key); }
let echoes = [];
let marked = -1;

// the tour: the inspector's zigzag along the weld, a over a sine
const SWEEP = 2.4; // s per in-and-out stroke
const XSPEED = 6.5; // mm/s along the weld
function tourAt(t) {
  const span = X_MAX - X_MIN;
  const run = span / XSPEED;
  const u = t % (2 * run);
  const x = u < run ? X_MIN + u * XSPEED : X_MAX - (u - run) * XSPEED;
  const a = A_MIN + (A_MAX - A_MIN) * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / SWEEP));
  return [x, a];
}
// park the probe on the lesson's echo for the still pose and the start
function park() {
  if (LVL === 4 || LVL === 1) { st.x = 5; st.a = 67.4; }
  else { st.x = 5; st.a = 67.4; }
}

// ------------------------------------------------ drawing
function place() {
  const t = translateAlong(P, [st.x - REST.x, st.a - REST.a, 0]);
  el.gp.forEach((n) => n.setAttribute("transform", t));
}
function verdictOf(key, code, h) { return passes(code, h, st.q); }
function drawCoupon() {
  el.beam.innerHTML = beamSvg(K, P, st.x, st.a, st.theta);
  let g = "";
  for (const D of DEFECTS) {
    const e = echoes.find((x) => x.key === D.key);
    const glow = e ? Math.min(1, e.amp / REF) : 0;
    g += ghostSvg(K, P, D, glow > 0.06 ? 0.25 + 0.75 * glow : 0, found.has(D.key));
  }
  if (el.ghosts.innerHTML !== g) el.ghosts.innerHTML = g;
  let m = "";
  for (const D of DEFECTS) if (found.has(D.key)) m += markSvg(K, P, D.x[0], D.x[1], LVL === 4 && !passes(D.code, D.h, st.q));
  if (LVL === 4) for (const S of SURFACE) m += markSvg(K, P, S.x[0], S.x[1], !passes(S.code, S.h, st.q));
  if (el.marks.innerHTML !== m) el.marks.innerHTML = m;
}
function drawCable() {
  const p0 = [st.x, st.a + 12, PROBE_Z[2] + 14];
  const p3 = [SOCKET[0], SOCKET[1], DET_TOP + 6];
  const p1 = [p0[0] + 6, p0[1] - 4, p0[2] + 30];
  const p2 = [p3[0] - 34, p3[1] + 34, p3[2] + 22];
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24, u = 1 - t;
    const p = [0, 1, 2].map((j) => u * u * u * p0[j] + 3 * u * u * t * p1[j] + 3 * u * t * t * p2[j] + t * t * t * p3[j]);
    pts.push(iso(p, P));
  }
  el.cable.setAttribute("d", pathOf(pts));
  const [a, b] = [pts[0], pts[pts.length - 1]];
  el.ends.innerHTML = '<circle class="nd-end" cx="' + a[0].toFixed(1) + '" cy="' + a[1].toFixed(1) + '" r="1.3"/><circle class="nd-end" cx="' + b[0].toFixed(1) + '" cy="' + b[1].toFixed(1) + '" r="1.3"/>';
}
function drawScreen() {
  el.trace.setAttribute("d", traceOf(echoes, st.theta, st.seed));
  const top = echoes.reduce((m, e) => (e.amp > m.amp ? e : m), { amp: 0 });
  if (top.amp >= RECORD) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  if (el.angle && el.angle.textContent !== st.theta + "°") el.angle.textContent = st.theta + "°";
}
function drawPick() {
  if (LVL !== 1 || marked < 0) { el.pick.innerHTML = ""; return; }
  const p = PARTS[marked];
  const o = p.g === "p" ? [st.x - REST.x, st.a - REST.a] : [0, 0];
  const [x, y] = iso([p.at[0] + o[0], p.at[1] + o[1], p.at[2]], P);
  el.pick.innerHTML = '<circle class="nd-pick" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="nd-pick-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
}
function echoLines() {
  const top = echoes.reduce((m, e) => (e.amp > m.amp ? e : m), { amp: 0 });
  const pos = T.probe + " " + st.theta + "° · " + T.a + " " + fmt(st.a, 0) + " mm " + T.from;
  if (top.amp < 8) return [pos, '<span class="nd-mute">' + T.none + "</span>", "", top];
  const D = DEFECTS.find((d) => d.key === top.key);
  const l2 = T.s + " " + fmt(top.s, 0) + " mm → " + T.depth + " " + fmt(top.depth, 0) + " mm · " + (top.leg === 1 ? T.leg1 : T.leg2);
  let l3 = "echo " + fmt(Math.min(top.amp, 100), 0) + "% · " + sgn(dB(top.amp), 0) + " dB " + T.ref;
  if (top.amp >= RECORD) l3 += ' · <span class="nd-acc">' + T.names[top.key] + "</span>";
  else l3 += ' · <span class="nd-mute">' + T.under + (D.kind === "round" ? ": " + T.round : "") + "</span>";
  return [pos, l2, l3, top];
}
function readout() {
  const out = [];
  if (LVL === 1) {
    out.push(T.vtLine);
    out.push('<span class="nd-mute">' + T.vtIn + "</span>");
    const [pos, , l3] = echoLines();
    out.push(l3 || pos);
    if (marked >= 0) { const [name, what] = T.parts[PARTS[marked].key]; out.push('<span class="nd-acc">' + name + "</span> · " + what); }
    else out.push('<span class="nd-mute">' + T.tapPart + "</span>");
  } else if (LVL === 2 || LVL === 3) {
    const [pos, l2, l3] = echoLines();
    out.push(pos);
    out.push(l2);
    out.push(l3 || "");
    if (LVL === 3) {
      const f = st.theta === 60 ? T.head : st.theta === 45 ? T.oblique : T.reach;
      out.push(st.theta + "°: " + f);
    }
    out.push(T.found + ": " + (found.size ? [...found].map((k) => T.names[k]).join(" · ") : "—") + " (" + found.size + " " + T.of + " " + DEFECTS.length + ")");
  } else {
    const items = [];
    for (const D of DEFECTS) if (found.has(D.key)) items.push({ key: D.key, code: D.code, h: D.h, x: D.x });
    for (const S of SURFACE) items.push({ key: S.key, code: S.code, h: S.h, x: S.x });
    const bad = items.filter((i) => !passes(i.code, i.h, st.q));
    const good = items.filter((i) => passes(i.code, i.h, st.q));
    const exc = st.q === "C" ? " (EXC2)" : st.q === "B" ? " (EXC3)" : " (EXC1)";
    out.push(T.level + " " + st.q + exc + " · t 25 mm");
    const lab = (i) => i.code + " " + T.names[i.key] + " " + (i.key === "pores" || i.key === "spore" ? "Ø" : "h") + fmt(i.h, i.h % 1 ? 1 : 0);
    // wrap both lists over three lines of about 56 characters
    const rows = [];
    const add = (head, list, cls) => {
      let row = head, plain = head.length;
      if (!list.length) { rows.push(head + T.none2); return; }
      let first = true;
      list.forEach((txt) => {
        if (!first && plain + 3 + txt.length > 58) { rows.push(row); row = "  "; plain = 2; first = true; }
        const sep = first ? "" : " · ";
        row += sep + (cls ? '<span class="' + cls + '">' + txt + "</span>" : txt);
        plain += sep.length + txt.length;
        first = false;
      });
      rows.push(row);
    };
    add(T.reject + ": ", bad.map(lab), "nd-acc");
    if (good.length || !bad.length) add(T.ok + ": ", good.map((i) => lab(i) + " ≤ " + fmt(LIMIT[i.code][st.q], LIMIT[i.code][st.q] % 1 ? 1 : 0)), "");
    while (rows.length > 3) { rows[rows.length - 2] += " " + rows.pop().trim(); }
    rows.forEach((r) => out.push(r));
    const len = bad.reduce((s, i) => s + (i.x[1] - i.x[0]), 0);
    out.push(bad.length ? '<span class="nd-warn">' + T.verdict + "</span> · " + len + " mm " + T.gouge : '<span class="nd-strong">' + T.accept + "</span> · " + T.release);
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function draw() {
  echoes = echoesOf(st.x, st.a, st.theta);
  for (const e of echoes) if (e.amp >= RECORD && !found.has(e.key)) { found.add(e.key); announce(); }
  place();
  drawCoupon();
  drawCable();
  drawScreen();
  drawPick();
  readout();
}

// ------------------------------------------------ time
let frame = 0, last = 0, visible = false, idleTimer = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (!still.matches) {
    st.seed = (st.seed + dt * 7) % 1000;
    if (st.playing) {
      st.t += dt;
      const [x, a] = tourAt(st.t);
      st.x += (x - st.x) * Math.min(1, dt * 6);
      st.a += (a - st.a) * Math.min(1, dt * 6);
      // a fresh scan each time the tour comes back to the start
      if (LVL === 2 || LVL === 3) { const run = (X_MAX - X_MIN) / XSPEED; if (st.t % (2 * run) < dt) found.clear(); }
    }
  }
  draw();
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const go = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else go(); };
function steer() {
  st.playing = false;
  syncPlay();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { st.playing = true; syncPlay(); go(); } }, 40000);
}
function syncPlay() {
  if (st.playing) playBtn.setAttribute("data-on", ""); else playBtn.removeAttribute("data-on");
  playBtn.setAttribute("aria-label", st.playing ? playBtn.dataset.pause : playBtn.dataset.play);
}
function describe() {
  const parts = [];
  parts.push(T.probe + " " + st.theta + "°, x " + fmt(st.x, 0) + " mm, " + T.a + " " + fmt(st.a, 0) + " mm");
  const top = echoes.reduce((m, e) => (e.amp > m.amp ? e : m), { amp: 0 });
  if (top.amp >= 8) parts.push("echo " + fmt(Math.min(top.amp, 100), 0) + "%, " + T.s + " " + fmt(top.s, 0) + " mm, " + T.names[top.key]);
  else parts.push(T.none);
  parts.push(T.found + ": " + ([...found].map((k) => T.names[k]).join(", ") || "—"));
  if (LVL === 4) parts.push(T.level + " " + st.q);
  if (LVL === 1 && marked >= 0) parts.push(T.parts[PARTS[marked].key].join(": "));
  const text = parts.join(". ");
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }

// ------------------------------------------------ controls
const angleBtns = [...document.querySelectorAll("[data-angle-btn]")];
const qBtns = [...document.querySelectorAll("[data-q]")];
document.querySelector('[data-row="angle"]').hidden = LVL !== 3;
document.querySelector('[data-row="q"]').hidden = LVL !== 4;
function sync() {
  angleBtns.forEach((b) => { const on = Number(b.dataset.angleBtn) === st.theta; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  qBtns.forEach((b) => { const on = b.dataset.q === st.q; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  syncPlay();
  describe();
}
function setAngle(th) { st.theta = th; if (LVL === 3) found.clear(); sync(); announce(); kick(); }
function setQ(v) { st.q = v; sync(); announce(); kick(); }
angleBtns.forEach((b) => b.addEventListener("click", () => setAngle(Number(b.dataset.angleBtn))));
qBtns.forEach((b) => b.addEventListener("click", () => setQ(b.dataset.q)));
playBtn.addEventListener("click", () => { clearTimeout(idleTimer); st.playing = !st.playing; if (st.playing) st.t = 0; syncPlay(); kick(); });
function radioKeys(group, keys, current, set) {
  group.addEventListener("keydown", (event) => {
    const i = keys.indexOf(current());
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % keys.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + keys.length - 1) % keys.length;
    if (next < 0) return;
    event.preventDefault();
    set(keys[next]);
    group.querySelectorAll('[role="radio"]')[next].focus();
  });
}
radioKeys(document.querySelector('[data-row="angle"]'), ANGLES, () => st.theta, setAngle);
radioKeys(document.querySelector('[data-row="q"]'), QUALITY, () => st.q, setQ);

// the drawing: drag the probe; a tap on the plate puts it there; at level 1 a
// tap elsewhere names the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
const O = iso([0, 0, PT], P), EX = iso([1, 0, PT], P), EY = iso([0, 1, PT], P);
const ax = [EX[0] - O[0], EX[1] - O[1]], ay = [EY[0] - O[0], EY[1] - O[1]];
const det = ax[0] * ay[1] - ax[1] * ay[0];
function toPlate([sx, sy]) {
  const dx = sx - O[0], dy = sy - O[1];
  return [(dx * ay[1] - dy * ay[0]) / det, (ax[0] * dy - ax[1] * dx) / det];
}
function moveTo(x, a) { st.x = clamp(x, X_MIN, X_MAX); st.a = clamp(a, A_MIN, A_MAX); }
function nearestPart([x, y]) {
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => {
    const o = p.g === "p" ? [st.x - REST.x, st.a - REST.a] : [0, 0];
    const [px, py] = iso([p.at[0] + o[0], p.at[1] + o[1], p.at[2]], P);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
let press = null;
stage.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const v = toView(event);
  const [wx, wy] = toPlate(v);
  const onProbe = Math.abs(wx - st.x) < 14 && wy > st.a - 12 && wy < st.a + 28;
  press = { v, x0: st.x, a0: st.a, w0: [wx, wy], onProbe, dragging: false, id: event.pointerId };
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const v = toView(event);
  if (!press.dragging && Math.hypot(v[0] - press.v[0], v[1] - press.v[1]) > 5) { press.dragging = true; try { stage.setPointerCapture(event.pointerId); } catch {} steer(); }
  if (press.dragging) {
    const [wx, wy] = toPlate(v);
    moveTo(press.x0 + wx - press.w0[0], press.a0 + wy - press.w0[1]);
    kick();
  }
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (!press.dragging && event.type === "pointerup") {
    const [wx, wy] = press.w0;
    const onPlate = wx > CP.x && wx < CP.x + CP.w && wy > CAP_W / 2 && wy < CP.y + CP.d;
    if (LVL === 1 && !press.onProbe) { marked = nearestPart(press.v); steer(); describe(); announce(); kick(); }
    else if (onPlate) { steer(); moveTo(wx, wy); announce(); kick(); }
  }
  try { stage.releasePointerCapture(event.pointerId); } catch {}
  press = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  const step = event.shiftKey ? 10 : 2;
  let handled = true;
  if (event.key === "ArrowRight") { steer(); moveTo(st.x + step, st.a); }
  else if (event.key === "ArrowLeft") { steer(); moveTo(st.x - step, st.a); }
  else if (event.key === "ArrowUp") { steer(); moveTo(st.x, st.a - step); }
  else if (event.key === "ArrowDown") { steer(); moveTo(st.x, st.a + step); }
  else if (event.key === " " || event.key === "Enter") { playBtn.click(); }
  else if (LVL === 1 && (event.key === "n" || event.key === "N")) { marked = (marked + 1) % PARTS.length; steer(); }
  else if (LVL === 3 && ["1", "2", "3"].includes(event.key)) setAngle(ANGLES[Number(event.key) - 1]);
  else if (LVL === 4 && ["1", "2", "3"].includes(event.key)) setQ(QUALITY[Number(event.key) - 1]);
  else handled = false;
  if (handled) { event.preventDefault(); announce(); kick(); }
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) go();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { st.playing = false; park(); cancelAnimationFrame(frame); frame = 0; sync(); tick(performance.now()); } else { st.playing = true; sync(); go(); } });
park();
if (!still.matches) { st.t = 0; [st.x, st.a] = tourAt(0); }
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Ultrasoon onderzoek van een stompe las",
    hint1: "Tik een onderdeel of fout · sleep de hoekkop",
    hint2: "Sleep de hoekkop langs de las",
    hint3: "Kies de hoek · sleep de hoekkop",
    hint4: "Kies het kwaliteitsniveau",
    play: "Afspelen",
    pause: "Pauze",
    angles: "Hoek van de hoekkop",
    levels: "Kwaliteitsniveau ISO 5817",
    label: LABEL_NL,
    aria: "Ultrasoon onderzoek. Pijltjes verschuiven de hoekkop (Shift: verder), spatie speelt de scan af of pauzeert. Niveau 1: N noemt het volgende onderdeel. Niveau 3: toetsen 1 tot 3 kiezen 45, 60 of 70 graden. Niveau 4: toetsen 1 tot 3 kiezen B, C of D.",
  },
  en: {
    title: "Ultrasonic testing of a butt weld",
    hint1: "Tap a part or a defect · drag the probe",
    hint2: "Drag the probe along the weld",
    hint3: "Pick the angle · drag the probe",
    hint4: "Pick the quality level",
    play: "Play",
    pause: "Pause",
    angles: "Probe angle",
    levels: "ISO 5817 quality level",
    label: LABEL_EN,
    aria: "Ultrasonic testing. Arrows move the probe (Shift: further), Space plays or pauses the scan. Level 1: N names the next part. Level 3: keys 1 to 3 pick 45, 60 or 70 degrees. Level 4: keys 1 to 3 pick B, C or D.",
  },
};

const sN = STRINGS.nl;
const ICONS = `<svg viewBox="0 0 14 14" aria-hidden="true" data-icon="play"><path d="M3.5 2.2v9.6l8-4.8z"/></svg><svg viewBox="0 0 14 14" aria-hidden="true" data-icon="pause"><path d="M3.2 2.4h2.6v9.2H3.2zM8.2 2.4h2.6v9.2H8.2z"/></svg>`;
const controls = [
  `<div class="nd-controls">`,
  `<button type="button" class="nd-btn nd-play" data-play="${sN.play}" data-pause="${sN.pause}" aria-label="${sN.play}">${ICONS}</button>`,
  `<div class="nd-seg" data-row="angle" role="radiogroup" aria-label="${sN.angles}">${ANGLES.map((a) => `<button type="button" class="nd-btn" role="radio" data-angle-btn="${a}" aria-checked="${a === 60}" tabindex="${a === 60 ? 0 : -1}">${a}°</button>`).join("")}</div>`,
  `<div class="nd-seg" data-row="q" role="radiogroup" aria-label="${sN.levels}">${QUALITY.map((v) => `<button type="button" class="nd-btn" role="radio" data-q="${v}" aria-checked="${v === "C"}" tabindex="${v === "C" ? 0 : -1}">${v}</button>`).join("")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="nd-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="nd-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="nd-line"></span>'.repeat(5)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=s["hint"+lv];
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
var p=document.querySelector(".nd-play");p.dataset.play=s.play;p.dataset.pause=s.pause;p.setAttribute("aria-label",s.play);
document.querySelector('[data-row="angle"]').setAttribute("aria-label",s.angles);document.querySelector('[data-row="q"]').setAttribute("aria-label",s.levels);
var st=document.querySelector(".nd-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + liveJs).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: lof peak 60° ${peakOf("lof", 60).toFixed(0)}% (${dB(peakOf("lof", 60)).toFixed(1)} dB) · 45° ${peakOf("lof", 45).toFixed(0)}% · 70° ${peakOf("lof", 70).toFixed(0)}% · root ${ANGLES.map((t) => peakOf("root", t).toFixed(0)).join("/")}% · slag ${peakOf("slag", 60).toFixed(0)}% · pores ${peakOf("pores", 60).toFixed(0)}%`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { frames: A.uniformStates(12), apart: true });
