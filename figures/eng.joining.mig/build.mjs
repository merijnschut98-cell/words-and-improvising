// Dev tool, not shipped. Builds the standalone figure for the topic Booglassen
// (module Lassen en verbinden): the lessons eng.joining.arc (level 1),
// weldparams (level 2), wps (level 3) and metallurgy (level 4).
//
//   node figures/eng.joining.mig/build.mjs            build the page
//   node figures/eng.joining.mig/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.joining.mig.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark, ?lang=nl|en and ?level=1..4 from its URL (defaults:
// prefers-color-scheme, Dutch, level 2).
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
const { tubePieces, tubeSvg } = await import(pathToFileURL(join(SKILL, "kit/tube.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.joining.mig.html");

// ---------------------------------------------------------------- the model
// Mechanised MAG welding: a bead on a 12 mm S355 plate, Ø1.2 mm solid wire,
// Ar + 18 % CO₂. The torch stands still; the carriage carries the plate under it.
//   arc energy   E  = U · I · 60 / (v · 1000)            [kJ/mm]  (v in mm/min)
//   heat input   Q  = k · E,  k = 0.8 for MIG/MAG       (EN 1011-1, process efficiency)
// The power source holds U; the current follows the wire feed. For Ø1.2 mm
// steel wire, approximately
//   wire feed    wfs = (I − 70) / 23                    [m/min]   (10 m/min ↔ 300 A, as in the lesson)
//   deposit      Ad  = 0.95 · π/4 · 1.2² · wfs · 1000 / v [mm² of bead cross-section; 5 % spatter]
// The bead's reinforcement is a parabola, A = 2/3 · w · h, and the voltage sets
// how flat it is (higher U, longer arc, wider and flatter): w/h = 2 + 0.25 · (U − 18).
//   bead width   w  = √(1.5 · Ad · w/h)                  [mm]   (an estimate, shown with ≈)
// Lesson numbers (asserted below): 24 V, 220 A, 400 mm/min → E 0.79, Q 0.63
// kJ/mm, inside a 0.5–0.9 procedure; 29 V, 300 A, 420 mm/min → E 1.24, Q 1.0;
// recalls 25/200/300 → E 1.0 and 28/250/350 → Q 0.96. Level 3 (lesson "wps"):
// the WPQR was welded at 1.2 kJ/mm; with impact and hardness requirements the
// range is ± 25 % (ISO 15614-1): 0.90–1.50 kJ/mm, so the 1.6 the welders want
// is outside it. Level 4 (lesson "metallurgy"): the HAZ, drawn schematically;
// in thick plate t8/5 grows in proportion to Q (EN 1011-2, three-dimensional
// heat flow), so more heat means slower cooling and a softer, wider HAZ.
const K_MAG = 0.8;
const WIRE = 1.2;
const arcOf = (u, i, v) => (u * i * 60) / (v * 1000);
const heatOf = (u, i, v) => K_MAG * arcOf(u, i, v);
const wfsOf = (i) => (i - 70) / 23;
const depositOf = (i, v) => (0.95 * Math.PI / 4 * WIRE * WIRE * wfsOf(i) * 1000) / v;
const ratioOf = (u) => 2 + 0.25 * (u - 18);
const widthOf = (u, i, v) => Math.sqrt(1.5 * depositOf(i, v) * ratioOf(u));
const heightOf = (u, i, v) => (1.5 * depositOf(i, v)) / widthOf(u, i, v);
const penOf = (i, v) => 0.0125 * i * Math.sqrt(400 / v); // fusion depth, schematic
const hazOf = (q) => 2.4 * Math.sqrt(q); // HAZ band, schematic (∝ √Q)
const transferOf = (u, i) => (i >= 260 && u >= 26 ? "spray" : i <= 200 && u <= 22 ? "short" : "globular");
const WPS = { tested: 1.2, lo: 0.9, hi: 1.5 }; // 1.2 × 0.75 and 1.2 × 1.25
const near = (a, b, tol, what) => { if (Math.abs(a - b) > tol) throw new Error(`${what}: ${a} ≠ ${b}`); };
near(arcOf(24, 220, 400), 0.79, 0.005, "lesson arc energy");
near(heatOf(24, 220, 400), 0.63, 0.005, "lesson heat input");
near(arcOf(25, 200, 300), 1.0, 1e-9, "recall arc energy");
near(heatOf(28, 250, 350), 0.96, 1e-9, "recall heat input");
near(arcOf(29, 300, 420), 1.24, 0.005, "L2 arc energy");
near(heatOf(29, 300, 420), 1.0, 0.01, "L2 heat input");
near(wfsOf(300), 10, 1e-9, "L2 wire feed");
near(depositOf(300, 420), 25, 1, "L2 a5 cross-section");
near(heatOf(29, 300, 210), 2 * heatOf(29, 300, 420), 1e-9, "half speed doubles heat input");
near(WPS.tested * 1.25, WPS.hi, 1e-9, "WPS upper limit");
near(WPS.tested * 0.75, WPS.lo, 1e-9, "WPS lower limit");
near(heatOf(30, 300, 270), 1.6, 1e-9, "L3 welders' 1.6");
near(1.4 * 1.25, 1.75, 1e-9, "recall L3");

const U_LIST = [18, 20, 22, 24, 25, 26, 28, 29, 30, 32, 34];
const I_LIST = [120, 150, 180, 200, 220, 250, 280, 300, 320, 350];
const V_LIST = [200, 210, 250, 270, 300, 350, 400, 420, 500, 600, 700];
const LEVELS = {
  1: { u: 24, i: 220, v: 400 },
  2: { u: 29, i: 300, v: 420 },
  3: { u: 30, i: 300, v: 270 },
  4: { u: 29, i: 300, v: 420 },
};
const TS = 4; // simulated seconds per real second

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, x along the weld, +y toward the viewer.
// The torch stands at x = 0, y = 0. The carriage, with the plate clamped on it,
// is recorded at its start position (offset XH), where the torch is over the
// start of the weld; it travels −2·XH along x during a pass.
const WIDTH = 600;
const FLOOR = -12;
const TABLE = { x: -130, y: -92, w: 260, d: 168, r: 3 };
const TT = 18; // table top
const RAIL_Z = [TT, TT + 8];
const RAILS = [-45, 45];
const CAR = { x: -66, y: -56, w: 132, d: 112, r: 2 };
const CAR_Z = [32, 40];
const PLATE = { x: -58, y: -36, w: 116, d: 72, r: 0.6 };
const PT = 52; // plate top
const WELD = [-50, 50]; // the weld, plate coordinates
const XH = 50; // the carriage's recorded (start) offset
const NOZ = [67, 100]; // nozzle tip and top
const COL = { x: 0, y: -72, r: 9 };
const BOOM = { x: -9, y: -84, w: 18, d: 96, r: 1.5 };
const BOOM_Z = [180, 194];
const TORCH_TOP = 208;
const FEED = { x: -30, y: -96, w: 60, d: 50, r: 2 };
const FEED_Z = [194, 242];
const FY = FEED.y + FEED.d; // the feeder's front face
const HOSE_Z = 226;
const WIN = { x0: -27, x1: -7, z0: 227, z1: 238, r: 1.2, depth: 1 };
const REEL = { y: -71, z: 218, r: 17 };

const FIT = [
  ...k.boxCorners(TABLE, FLOOR, TT),
  ...k.boxCorners({ x: 112, y: -12, w: 54, d: 24 }, TT, 44),
  ...k.boxCorners({ x: CAR.x - XH, y: CAR.y, w: CAR.w + 2 * XH, d: CAR.d }, CAR_Z[0], PT + 6),
  ...k.boxCorners(FEED, FEED_Z[0], FEED_Z[1] + 12),
  [FEED.x + FEED.w + 8, REEL.y, REEL.z + REEL.r],
];
const PAD = 6;
const MACHINE_W = 380; // the bench fills the left of the card, the section the right
const AZIMUTH = Number(process.env.AZ ?? 58);
const ELEVATION = Number(process.env.EL ?? 27);
const P0 = k.fitProjection(FIT, MACHINE_W, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD + 4);
const P = { ...P0, origin: [P0.origin[0] + 4, P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);
const V = G.viewOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameUp = (o) => G.frameOf(o, Zv, X, Y);
const frameDown = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const { sinA } = k.cameraOf(P);

// ---------------------------------------------------------------- recorder
const MOVE = [-2 * XH, 0, 0];
const R = A.recorder(P, { order: ["x"], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "", ...rest } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVE : [0, 0, 0], attrs, ...rest });
}
const S = (paths, style) => {
  solids++;
  return k.solidSvg(paths, style);
};
const grp = (g) => ({ piece: g === "x" ? "x" : "", attrs: ` data-g="${g}"` });
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
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "wd-glass") {
  const id = `wd-clip-${clips++}`;
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
// These draw the parts that change every frame. They take the kit as an
// argument, so the build and the page run the very same code.

// The bead on the plate from xs to xe (plate coordinates), width w, with its
// ripples, and (level 4) the heat-tinted HAZ beside it. Drawn at the carriage's
// recorded position; the carriage group moves it.
function beadSvg(K, P, xs, xe, w, haz, ripple) {
  if (xe - xs < 0.3) return "";
  const z = PT + 0.05;
  const W = (x, y, zz = z) => K.iso([x + XH, y, zz], P);
  const f = (pts) => K.pathOf(pts, true);
  const half = w / 2;
  const cap = (cx, dir, r) => {
    const out = [];
    for (let i = 0; i <= 10; i++) { const t = -Math.PI / 2 + (Math.PI * i) / 10; out.push([cx + dir * Math.cos(t) * r * 0.6, Math.sin(t) * r]); }
    return dir > 0 ? out : out.reverse();
  };
  const outline = (r) => [...cap(xe, 1, r), ...cap(xs, -1, r)];
  let out = "";
  if (haz > 0.05) out += `<path class="wd-haz" d="${f(outline(half + haz).map(([x, y]) => W(x, y)))}"/>`;
  const ring = outline(half);
  out += `<path class="wd-bead" d="${f(ring.map(([x, y]) => W(x, y)))}"/>`;
  const lines = [];
  const step = Math.max(1.6, ripple);
  const bow = 0.3 * w;
  for (let x = xe - step * 0.6; x - bow > xs + 0.4; x -= step) {
    const pts = [];
    for (let j = 0; j <= 10; j++) {
      const y = -half + (w * j) / 10;
      pts.push(W(x - bow * (1 - (2 * y / w) ** 2), y));
    }
    lines.push(K.pathOf(pts));
  }
  out += `<path class="iso-line" data-tone="lo" d="${lines.join("")}"/>`;
  out += `<path class="iso-line" data-tone="mid" d="${f(ring.map(([x, y]) => W(x, y)))}"/>`;
  return out;
}

// The arc, the wire below the nozzle and the weld pool at the torch (fixed in
// the world). `on` 0..1 fades the arc; `w` sets the pool.
function arcSvg(K, P, w, arcLen, on, flick) {
  const z = PT + 0.1;
  const half = w / 2;
  const pool = [];
  for (let i = 0; i < 28; i++) {
    const t = (i / 28) * Math.PI * 2;
    const c = Math.cos(t);
    pool.push(K.iso([(c > 0 ? c * half * 0.55 : c * half * 1.35) - 0.5, Math.sin(t) * half * 0.92, z], P));
  }
  const tip = PT + arcLen;
  const [wx0, wy0] = K.iso([0, 0, NOZ[0] + 1], P);
  const [wx1, wy1] = K.iso([0, 0, tip], P);
  const [bx, by] = K.iso([0, 0, PT], P);
  const g = (0.85 + 0.15 * flick) * on;
  let out = `<path class="wd-pool" style="opacity:${(0.25 + 0.75 * on).toFixed(3)}" d="${K.pathOf(pool, true)}"/>`;
  if (on > 0.01) out += `<circle class="wd-glow" cx="${bx.toFixed(2)}" cy="${(by - 1).toFixed(2)}" r="${(10 + 3 * flick).toFixed(2)}" style="opacity:${g.toFixed(3)}"/>`;
  out += `<path class="wd-wire" d="M${wx0.toFixed(2)} ${wy0.toFixed(2)}L${wx1.toFixed(2)} ${wy1.toFixed(2)}"/>`;
  if (on > 0.01) {
    const s = KS * (0.7 + arcLen * 0.25);
    out += `<path class="wd-arc" style="opacity:${on.toFixed(3)}" d="M${(wx1 - 0.6).toFixed(2)} ${wy1.toFixed(2)}L${(bx - s).toFixed(2)} ${by.toFixed(2)}L${(bx + s).toFixed(2)} ${by.toFixed(2)}L${(wx1 + 0.6).toFixed(2)} ${wy1.toFixed(2)}Z"/>`;
    out += `<circle class="wd-core" cx="${bx.toFixed(2)}" cy="${(by - 0.6).toFixed(2)}" r="${(1.6 + flick * 0.5).toFixed(2)}" style="opacity:${on.toFixed(3)}"/>`;
  }
  return out;
}

// The cross-section in the loupe: plate, weld metal (reinforcement over the
// fusion zone), HAZ band and a millimetre scale under the plate. Section
// coordinates in mm: u across the weld, v down, plate top at v = 0.
function sectionSvg(w, h, p, haz) {
  const f2 = (v) => v.toFixed(2);
  const T = 12;
  const half = w / 2;
  const hf = half * 0.92;
  const out = [];
  out.push(`<path class="wd-mat" d="M-60 0H60V${T}H-60Z"/>`);
  if (haz > 0.05) {
    const a = hf + haz, b = p + haz, pts = [];
    for (let i = 0; i <= 24; i++) { const t = Math.PI * (i / 24); pts.push([-Math.cos(t) * a, Math.sin(t) * b]); }
    out.push(`<path class="wd-haz-s" d="M${pts.map(([u, v]) => f2(u) + " " + f2(v)).join("L")}Z"/>`);
    out.push(`<path class="wd-haz-line" d="M${pts.map(([u, v]) => f2(u) + " " + f2(v)).join("L")}"/>`);
  }
  const top = [], bottom = [];
  for (let i = 0; i <= 24; i++) {
    const u = -half + (w * i) / 24;
    top.push([u, -h * (1 - (2 * u / w) ** 2)]);
  }
  for (let i = 24; i >= 0; i--) {
    const t = Math.PI * (i / 24);
    bottom.push([-Math.cos(t) * hf, Math.sin(t) * p]);
  }
  const weld = [...top, [half, 0], [hf, 0], ...bottom, [-hf, 0], [-half, 0]];
  out.push(`<path class="wd-weld" d="M${weld.map(([u, v]) => f2(u) + " " + f2(v)).join("L")}Z"/>`);
  out.push(`<path class="wd-fusion" d="M${bottom.map(([u, v]) => f2(u) + " " + f2(v)).join("L")}"/>`);
  // the plate surface beside the bead, the bead's crown and the plate bottom
  out.push(`<path class="wd-edge" d="M-60 0H${f2(-half)}M${f2(half)} 0H60M-60 ${T}H60"/>`);
  out.push(`<path class="wd-crown" d="M${top.map(([u, v]) => f2(u) + " " + f2(v)).join("L")}"/>`);
  // a millimetre scale hanging from the plate bottom
  const minor = [], major = [];
  for (let u = -24; u <= 24; u += 1) (u % 5 === 0 ? major : minor).push(`M${u} ${T}v${u % 5 === 0 ? 2.2 : 1.2}`);
  out.push(`<path class="wd-tick" d="${minor.join("")}"/><path class="wd-tick-major" d="${major.join("")}"/>`);
  // the toes: where the bead meets the plate, its width
  out.push(`<circle class="wd-toe" cx="${f2(-half)}" cy="0" r="0.75"/><circle class="wd-toe" cx="${f2(half)}" cy="0" r="0.75"/>`);
  return out.join("");
}

// ---------------------------------------------------------------- floor, table, rails
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(TABLE, -4), FLOOR, 2, P)}"/>`];
for (const [x, y] of k.corners(TABLE, 16)) post("stand.foot", x, y, 9, FLOOR, 0, { tone: "lo" }, { steps: 6 });
{
  // a fixture table: a grid of Ø16 holes at 50 mm, screws at the corners
  const holes = [];
  for (let x = -100; x <= 100; x += 50) for (const y of [-70, 20]) holes.push([x, y]);
  const bolts = k.corners(TABLE, 7);
  const extra =
    L(holes.map(([x, y]) => k.ring(x, y, 5, TT, P, 16)).join(""), { tone: "lo" }) +
    L(k.planOutline(k.insetPlan(TABLE, 4), TT, P, 3), { tone: "faint" }) +
    Dt(bolts.map(([x, y]) => at([x, y, TT])), { size: 0.5 });
  const fy = TABLE.y + TABLE.d;
  const plate = [
    `<g transform="${planeOf(fy)}"><path class="wd-card" d="${flatRect(-118, 4, -74, 14, 1.2, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-113 -11.2H-82M-113 -8.4H-90M-113 -5.6H-86"/></g>`,
    Dt([[-116, fy, 12.6], [-76, fy, 12.6], [-116, fy, 5.4], [-76, fy, 5.4]].map(at), { size: 0.4 }),
  ].join("");
  box("stand.table", TABLE, 0, TT, { tone: "lo" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(TABLE, 5, P, 3), { tone: "faint" }), extra: extra + plate });
}
for (const yc of RAILS) {
  const rail = { x: -122, y: yc - 5, w: 244, d: 10, r: 0.8 };
  const bolts = [-100, -60, -20, 20, 60, 100].map((x) => at([x, yc, RAIL_Z[1]]));
  box("rail", rail, RAIL_Z[0], RAIL_Z[1], { tone: "mid", crease: "lo" }, { bevel: 0.3, extra: Dt(bolts, { size: 0.36, tone: "lo" }) });
  for (const x of [-128, 122]) box("rail.stop", { x, y: yc - 6, w: 6, d: 12, r: 0.6 }, TT, RAIL_Z[1] + 4, { tone: "mid" }, { bevel: 0.3 });
}
{
  // the travel scale in front of the carriage
  const strip = { x: -120, y: 58, w: 240, d: 8, r: 0.4 };
  const ticks = k.topTicks(-120, 120, 5, 5, strip.y, TT + 0.6, [2.4, 4.6], P, "x");
  box("ruler", strip, TT, TT + 0.6, { tone: "lo", crease: "none" }, { extra: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) });
}
// the lead screw that drives the carriage, its bearing and the drive motor
{
  const Fs = frameX([-118, 0, 26]);
  discAt("screw", Fs, 0, 236, 3, { tone: "mid", crease: "none" });
  box("screw.bearing", { x: -126, y: -9, w: 8, d: 18, r: 0.8 }, TT, 31, { tone: "mid" }, { bevel: 0.3, extra: Dt([at([-122, 9, 28])], { size: 0.4, tone: "hi" }) });
  box("drive.bracket", { x: 118, y: -12, w: 12, d: 24, r: 0.8 }, TT, 44, { tone: "mid" }, { bevel: 0.3, extra: Dt([[124, 12, 40], [124, 12, 22]].map(at), { size: 0.4 }) });
  const Fm = frameX([130, 0, 31]);
  const fins = G.ribsOf(Fm, 3, 26, 12, 18, P, { fade: [0.04, 0.42], seams: true });
  turned("drive.motor", Fm, [[0, 12], [29, 12]], { tone: "mid", crease: "lo" }, { inner: k.fadedSvg(fins, { tone: "lo" }) });
  discAt("drive.cap", Fm, 29, 33, 9, { tone: "mid" }, { extra: Dt([at(G.pointOf(Fm, 33, 0, 0))], { size: 0.5, tone: "hi" }) });
}

// ---------------------------------------------------------------- the carriage and the plate (X)
const XG = { g: "x" };
const vx = (plan) => ({ ...plan, x: plan.x + XH });
for (const xc of [-50, 50]) for (const yc of RAILS) {
  box("x.block", vx({ x: xc - 12, y: yc - 7, w: 24, d: 14, r: 1 }), RAIL_Z[1], CAR_Z[0], { tone: "mid" }, { ...XG, bevel: 0.3 });
}
box("x.nut", vx({ x: -10, y: -8, w: 20, d: 16, r: 1 }), 30, CAR_Z[0], { tone: "lo" }, XG);
{
  const c = vx(CAR);
  const dots = k.corners(c, 5).map(([x, y]) => at([x, y, CAR_Z[1]]));
  box("x.carriage", c, CAR_Z[0], CAR_Z[1], { tone: "mid" }, { ...XG, steps: 3, bevel: 0.6, inner: L(k.sideSeam(c, CAR_Z[0] + 3, P, 3), { tone: "faint" }), extra: Dt(dots, { size: 0.45 }) });
}
// the index that reads the travel on the scale
box("x.index", vx({ x: -1.5, y: CAR.y + CAR.d, w: 3, d: 6, r: 0.3 }), CAR_Z[0] + 1, CAR_Z[1] - 3, { tone: "hi", crease: "lo" }, XG);
// the plate: 12 mm S355, its scribed seam line
{
  const pl = vx(PLATE);
  const seam = k.lineOnTop([WELD[0] - 4 + XH, 0], [WELD[1] + 4 + XH, 0], PT, P);
  const ends = Dt([at([WELD[0] - 4 + XH, 0, PT]), at([WELD[1] + 4 + XH, 0, PT])], { size: 0.45, tone: "lo" });
  box("x.plate", pl, CAR_Z[1], PT, { tone: "hi", crease: "lo" }, { ...XG, bevel: 0.4, extra: L(seam, { tone: "faint" }) + ends });
}
// four toggle clamps hold the plate down
for (const dir of [-1, 1]) for (const yc of [-24, 24]) {
  const bx = dir > 0 ? 58 : -64;
  const ax = dir > 0 ? 49 : -58;
  box("x.clamp", vx({ x: bx, y: yc - 5, w: 6, d: 10, r: 0.6 }), CAR_Z[1], PT + 6, { tone: "mid" }, { ...XG, bevel: 0.3 });
  box("x.clamp-arm", vx({ x: ax, y: yc - 3, w: 9, d: 6, r: 0.6 }), PT, PT + 4, { tone: "mid", crease: "lo" }, { ...XG, extra: Dt([at([ax + 4.5 + XH, yc, PT + 4])], { size: 0.42, tone: "hi" }) });
}
// the earth clamp on the carriage's front edge
box("x.earth", vx({ x: 24, y: 42, w: 16, d: 11, r: 1 }), CAR_Z[1], CAR_Z[1] + 5, { tone: "lo" }, { ...XG, bevel: 0.3 });
box("x.earth-jaw", vx({ x: 26, y: 44, w: 12, d: 7, r: 0.8 }), CAR_Z[1] + 5, CAR_Z[1] + 9, { tone: "mid", crease: "lo" }, { ...XG, extra: Dt([at([32 + XH, 47.5, CAR_Z[1] + 9])], { size: 0.45, tone: "hi" }) });

// the bead, rebuilt live; recorded as a full-length bead
const W0 = widthOf(29, 300, 420);
put("x.bead", [XH, 0, PT + 1], beadSvg(k, P, WELD[0], WELD[1], W0, 0, 3), [R.solid(A.box([WELD[0] - W0 * 0.3 + XH, -W0 / 2, PT], [WELD[1] + W0 * 0.3 + XH, W0 / 2, PT + 2], { name: "x.bead", owner: "weld" }))], { piece: "x", attrs: ' data-g="x" data-bead=""' });
solids++;

// ---------------------------------------------------------------- column, boom, torch
{
  const Fc = frameUp([COL.x, COL.y, TT]);
  discAt("col.flange", Fc, 0, 4, 15, { tone: "mid" }, { extra: Dt(G.dotsOf(Fc, 4, 12, 6, P, { all: true }), { size: 0.4 }) });
  post("col.post", COL.x, COL.y, COL.r, TT + 4, BOOM_Z[0] - 4, { tone: "mid" }, { inner: L(k.sideArc(COL.x, COL.y, COL.r, 60, P, 18), { tone: "faint" }) });
  discAt("col.cap", frameUp([COL.x, COL.y, BOOM_Z[0] - 4]), 0, 4, 12, { tone: "mid", crease: "lo" });
  box("boom", BOOM, BOOM_Z[0], BOOM_Z[1], { tone: "mid" }, { bevel: 0.4, inner: L(k.sideSeam(BOOM, BOOM_Z[0] + 4, P, 2), { tone: "faint" }), extra: Dt([[0, BOOM.y + 4, BOOM_Z[1]], [0, -48, BOOM_Z[1]]].map(at), { size: 0.4 }) });
  const Fk = frameX([BOOM.x + BOOM.w, 0, (BOOM_Z[0] + BOOM_Z[1]) / 2]);
  discAt("boom.knob", Fk, 0, 5, 4.4, { tone: "hi", crease: "lo" }, { inner: L(G.ribsOf(Fk, 0.6, 4.4, 4.4, 14, P, { seams: false }), { tone: "lo" }) });
}
{
  const Fu = frameUp([0, 0, 0]);
  discAt("torch.body", Fu, NOZ[1] + 4, BOOM_Z[0], 8, { tone: "mid" }, { inner: L(G.arcOf(Fu, 150, 8, P) + G.arcOf(Fu, 154, 8, P), { tone: "faint" }) });
  discAt("torch.head", Fu, BOOM_Z[1], TORCH_TOP, 7, { tone: "mid", crease: "lo" }, { inner: L(G.arcOf(Fu, BOOM_Z[1] + 6, 7, P), { tone: "faint" }) });
  discAt("torch.insulator", Fu, NOZ[1], NOZ[1] + 4, 8.6, { tone: "lo" });
  const Fd = frameDown([0, 0, NOZ[1]]);
  turned("torch.nozzle", Fd, [[0, 9.2], [22, 8.8], [NOZ[1] - NOZ[0], 6.8]], { tone: "hi", crease: "lo" }, { inner: L(G.arcOf(Fd, 4, 9.15, P, { slope: -0.018 }), { tone: "lo" }) });
}
// the wire, the arc and the pool: fixed under the torch
put("arc", [0, 0, PT + 6], arcSvg(k, P, W0, 4.5, 1, 0.5), [R.solid(A.cylinder(0, 0, 0.7, PT + 2.2, NOZ[0] - PT - 2.2, { name: "arc", owner: "weld" }))], { attrs: ' data-arc=""' });
solids++;

// ---------------------------------------------------------------- the wire feeder on the boom
{
  const extra = [];
  const fy = FY;
  // the display (U and I) and the flow meter in recesses, two knobs, two lamps
  const digits = [
    k.faceTextSvg(k.sideMatrix([WIN.x0 + 1.6, fy - WIN.depth], WIN.z1 - 4.4, P, "left"), "29,0 V", { size: 3.4, tone: "hi" }).replace("<text ", '<text data-volt="" '),
    k.faceTextSvg(k.sideMatrix([WIN.x0 + 1.6, fy - WIN.depth], WIN.z1 - 9, P, "left"), "300 A", { size: 3.4, tone: "hi" }).replace("<text ", '<text data-amp="" '),
  ].join("");
  extra.push(recess(WIN, fy, "", "wd-glass"));
  extra.push(`<g clip-path="url(#wd-clip-${clips - 1})">${digits}</g>`);
  const FLOW = { x0: -26, x1: -21, z0: 199, z1: 222, r: 1.6, depth: 1 };
  extra.push(recess(FLOW, fy, `<path class="iso-line" data-tone="lo" d="M-23.5 ${-FLOW.z0}V${-FLOW.z1}"/>`));
  extra.push(`<g data-float="">${Dt([at([-23.5, fy - 1, 212])], { size: 1.2, tone: "hi" })}</g>`);
  extra.push(Dt([[FEED.x + 3, fy, FEED_Z[0] + 3], [FEED.x + FEED.w - 3, fy, FEED_Z[0] + 3], [FEED.x + 3, fy, FEED_Z[1] - 3], [FEED.x + FEED.w - 3, fy, FEED_Z[1] - 3]].map(at), { size: 0.42 }));
  // vent slots on the side
  const vents = [0, 1, 2, 3].map((i) => {
    const z = 202 + i * 5;
    return k.pathOf([at([FEED.x + FEED.w, -92, z]), at([FEED.x + FEED.w, -84, z]), at([FEED.x + FEED.w, -84, z + 2]), at([FEED.x + FEED.w, -92, z + 2])], true);
  }).join("");
  extra.push(L(vents, { tone: "lo" }));
  box("feeder", FEED, FEED_Z[0], FEED_Z[1], { tone: "mid" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(FEED, FEED_Z[1] - 8, P, 3), { tone: "faint" }), extra: extra.join("") });
  box("feeder.lid", k.insetPlan(FEED, 2), FEED_Z[1], FEED_Z[1] + 3, { tone: "mid", crease: "lo" }, { bevel: 0.3 });
  // a carry handle on the lid
  for (const y of [-84, -58]) box("feeder.handle-post", { x: -3, y: y - 2, w: 6, d: 4, r: 0.5 }, FEED_Z[1] + 3, FEED_Z[1] + 9, { tone: "mid" });
  box("feeder.handle", { x: -3.5, y: -86.5, w: 7, d: 31, r: 1.2 }, FEED_Z[1] + 9, FEED_Z[1] + 12, { tone: "hi", crease: "lo" }, { bevel: 0.3 });
  const knob = (name, x, z) => {
    const F = frameY([x, fy, z]);
    discAt(name, F, 0, 1.4, 4.6, { tone: "mid" });
    discAt(name + "-cap", F, 1.4, 4.4, 3.6, { tone: "hi", crease: "lo" }, { inner: L(G.ribsOf(F, 1.8, 4.4, 3.6, 14, P, { seams: false }), { tone: "lo" }), extra: Dt([at(G.pointOf(F, 4.4, 2.4, -Math.PI / 2))], { size: 0.45, tone: "mid" }) });
  };
  knob("feeder.uknob", 13, 216);
  knob("feeder.iknob", 24, 216);
  const lamp = (name, x, z, attr) => {
    const F = frameY([x, fy, z]);
    discAt(name, F, 0, 1.2, 2.8, { tone: "mid" });
    discAt(name + "-cap", F, 1.2, 2.4, 2, { tone: "hi", crease: "lo" }, { attrs: ` data-g="s" ${attr}=""` });
  };
  lamp("feeder.arc-lamp", 13, 204, "data-lamp");
  lamp("feeder.wps-lamp", 24, 204, "data-wps");
  // the wire reel on the side, behind a hinged window: a spool on a hub
  const Fr = frameX([FEED.x + FEED.w, REEL.y, REEL.z]);
  discAt("feeder.reel", Fr, 0, 3, REEL.r, { tone: "mid" }, { inner: L(G.arcOf(Fr, 1.5, REEL.r, P), { tone: "faint" }), extra: L(G.circleOf(Fr, 3, REEL.r - 4, P, 48), { tone: "lo" }) });
  discAt("feeder.hub", Fr, 3, 6, 6, { tone: "hi", crease: "lo" }, { extra: Dt([at(G.pointOf(Fr, 6, 0, 0))], { size: 0.55, tone: "mid" }) });
  // the Euro connector for the torch hose
  discAt("feeder.euro", frameY([0, fy, HOSE_Z]), 0, 6, 5.5, { tone: "hi", crease: "lo" });
}
// the torch hose: from the torch head up and back into the Euro connector
{
  const route = G.fillet([[0, 0, TORCH_TOP], [0, 0, HOSE_Z], [0, FY + 6, HOSE_Z]], 9, 12, { P, tube: 3 });
  const id = R.nameFor("hose");
  R.route(id, route, 3, { owner: id });
  tubePieces(route, 3, P, { maxLength: 12 }).forEach((part, index) =>
    put(`${id}:${index}`, part.mid, tubeSvg(part, { tone: "mid" }), [A.tube(part.points, part.radii)], { route: id, chunk: index }),
  );
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, { states: A.uniformStates(12) });
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);

// the cross-section loupe sits to the right of the bench
const LOUPE = (() => {
  const r = Math.min(96, HEIGHT / 2 - 10);
  return { cx: WIDTH - r - 12, cy: HEIGHT / 2, r };
})();
const LENS_MM = 17; // the lens shows ±17 mm
const loupe = [
  `<g class="wd-loupe" data-loupe="" transform="translate(${LOUPE.cx.toFixed(1)} ${LOUPE.cy.toFixed(1)})">`,
  `<circle class="wd-lens" r="${LOUPE.r}"/>`,
  `<clipPath id="wd-lens-clip"><circle r="${LOUPE.r - 1}"/></clipPath>`,
  `<g clip-path="url(#wd-lens-clip)"><g data-view="" transform="scale(${(LOUPE.r / LENS_MM).toFixed(3)}) translate(0 -3)">${sectionSvg(W0, heightOf(29, 300, 420), penOf(300, 420), 0)}</g></g>`,
  `<circle class="wd-rim" r="${LOUPE.r}"/>`,
  `</g>`,
].join("");

const body = [...halo, ...groups, `<g data-sparks=""></g>`, `<g data-mark=""></g>`, loupe];

const LABEL_NL =
  "Een gemechaniseerde MAG-lasopstelling: een lastafel op stelvoeten met twee geleiders, een slede met een spindel en motor, daarop een stalen plaat van 12 mm onder vier spanklemmen en een massaklem. Een kolom draagt een arm met de toorts: het gasmondstuk wijst naar de plaat, de draad komt eruit en de boog brandt op de plaat in het smeltbad. Achter de rups zit de gestolde las. Op de arm staat de draadaanvoer met de haspel, een display voor volt en ampère, een gasdebietmeter en het slangpakket naar de toorts. Een vergrootglas toont de doorsnede van de las.";
const LABEL_EN =
  "A mechanised MAG welding set-up: a fixture table on levelling feet with two rails, a carriage with a lead screw and motor, carrying a 12 mm steel plate under four toggle clamps and an earth clamp. A column holds an arm with the torch: the gas nozzle points at the plate, the wire comes out of it and the arc burns on the plate in the weld pool. Behind it lies the solid bead. On the arm sits the wire feeder with its reel, a display for volts and amps, a gas flow meter and the hose to the torch. A loupe shows the cross-section of the weld.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (level 1)
const PARTS = [
  { key: "torch", g: "s", at: [0, 8, 150] },
  { key: "nozzle", g: "s", at: [0, 8, 84] },
  { key: "wire", g: "s", at: [0, 0, 61] },
  { key: "arc", g: "s", at: [0, 0, PT + 1] },
  { key: "bead", g: "s", at: [-26, 0, PT + 1] },
  { key: "plate", g: "x", at: [WELD[1] - 20 + XH, 26, PT] },
  { key: "clamp", g: "x", at: [-61 + XH, 24, PT + 4] },
  { key: "earth", g: "x", at: [32 + XH, 48, CAR_Z[1] + 8] },
  { key: "carriage", g: "x", at: [-40 + XH, CAR.y + CAR.d, 36] },
  { key: "ruler", g: "s", at: [-95, 62, TT + 0.6] },
  { key: "motor", g: "s", at: [146, 12, 31] },
  { key: "feeder", g: "s", at: [(WIN.x0 + WIN.x1) / 2, FY, (WIN.z0 + WIN.z1) / 2] },
  { key: "gas", g: "s", at: [-23.5, FY, 211] },
  { key: "reel", g: "s", at: [FEED.x + FEED.w + 4, REEL.y, REEL.z] },
  { key: "hose", g: "s", at: [0, -22, HOSE_Z] },
  { key: "column", g: "s", at: [0, -63, 120] },
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
  --wd-hair:rgba(240,233,218,.12);--wd-accent:#5C9FAE;--wd-glass:#0A1E23;--wd-mat:#16353D;--wd-bead:#2A5560;--wd-weld:#2E6270;
  --wd-haz:rgba(92,159,174,.22);--wd-glow:#BFE3EA;--wd-core:#F4FBFC;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --wd-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --wd-hair:rgba(11,41,27,.14);--wd-accent:#276F81;--wd-glass:#E2ECEA;--wd-mat:#EBE4D4;--wd-bead:#C9DCDC;--wd-weld:#A9CACD;
  --wd-haz:rgba(39,111,129,.16);--wd-glow:#7FB6C3;--wd-core:#FFFFFF;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--wd-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--bottom:156px;height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:270px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--wd-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="1"] .iso-plate{--bottom:148px}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--wd-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:62px!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap}
.iso-plate-corner[data-corner="readout"]{bottom:80px!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.wd-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wd-acc{color:var(--wd-accent);font-weight:600}
.wd-strong{color:var(--anatomy-strong);font-weight:600}
.wd-mute{color:var(--anatomy-muted)}
.wd-warn{color:var(--wd-accent);font-weight:700;text-decoration:underline;text-underline-offset:2px}
.wd-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.wd-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.wd-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.wd-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.wd-row{display:flex;gap:4px;height:44px}
.wd-row[hidden]{display:none}
.wd-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--wd-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--wd-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.wd-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.wd-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--wd-accent);color:var(--wd-accent);font-weight:600}
.wd-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.wd-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.wd-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.wd-glass{fill:var(--wd-glass);stroke:none}
.wd-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso .iso-face-text{font-family:var(--anatomy-mono);font-weight:600}
.wd-bead{fill:var(--wd-bead);stroke:none}
.wd-haz{fill:var(--wd-haz);stroke:none}
.wd-pool{fill:var(--wd-accent);stroke:none}
.wd-glow{fill:url(#wd-glow-grad);stroke:none;pointer-events:none}
.wd-arc{fill:var(--wd-glow);stroke:none}
.wd-core{fill:var(--wd-core);stroke:none}
.wd-wire{stroke:var(--anatomy-hi);stroke-width:.9px;stroke-linecap:round;fill:none}
.wd-spark-line{stroke:var(--wd-glow);stroke-width:.7px;stroke-linecap:round;fill:none}
.wd-lens{fill:var(--anatomy-card);stroke:none}
.wd-rim{fill:none;stroke:var(--anatomy-mid);stroke-width:1px}
.wd-mat{fill:var(--wd-mat);stroke:none}
.wd-weld{fill:var(--wd-weld);stroke:none}
.wd-haz-s{fill:var(--wd-haz);stroke:none}
.wd-haz-line{fill:none;stroke:var(--wd-accent);stroke-width:.12px;stroke-dasharray:.6 .5}
.wd-fusion{fill:none;stroke:var(--anatomy-hi);stroke-width:.14px}
.wd-edge{fill:none;stroke:var(--anatomy-mid);stroke-width:.16px}
.wd-crown{fill:none;stroke:var(--anatomy-hi);stroke-width:.2px}
.wd-tick{fill:none;stroke:var(--anatomy-lo);stroke-width:.12px}
.wd-tick-major{fill:none;stroke:var(--anatomy-mid);stroke-width:.16px}
.wd-toe{fill:var(--wd-accent);stroke:none}
.wd-mark{fill:none;stroke:var(--wd-accent);stroke-width:1.4px}
.wd-mark-dot{fill:var(--wd-accent);stroke:none}
html:not([data-level="1"]) [data-mark]{display:none}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,[data-wps] .iso-top,[data-wps] .iso-shade,[data-wps] .iso-fill{transition:fill .3s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill,[data-wps][data-on] .iso-top,[data-wps][data-on] .iso-shade,[data-wps][data-on] .iso-fill{fill:var(--wd-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,[data-wps] .iso-top,[data-wps] .iso-shade,[data-wps] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const TS = ${TS}, PT = ${PT}, XH = ${XH}, NOZ = ${JSON.stringify(NOZ)}, WELD = ${JSON.stringify(WELD)};
const K_MAG = ${K_MAG}, WIRE = ${WIRE}, WPS = ${JSON.stringify(WPS)}, LENS_MM = ${LENS_MM};
const U_LIST = ${JSON.stringify(U_LIST)}, I_LIST = ${JSON.stringify(I_LIST)}, V_LIST = ${JSON.stringify(V_LIST)};
const LEVELS = ${JSON.stringify(LEVELS)};
const PARTS = ${JSON.stringify(PARTS)};
const arcOf = ${arcOf.toString()};
const heatOf = ${heatOf.toString()};
const wfsOf = ${wfsOf.toString()};
const depositOf = ${depositOf.toString()};
const ratioOf = ${ratioOf.toString()};
const widthOf = ${widthOf.toString()};
const heightOf = ${heightOf.toString()};
const penOf = ${penOf.toString()};
const hazOf = ${hazOf.toString()};
const transferOf = ${transferOf.toString()};
${beadSvg.toString()}
${arcSvg.toString()}
${sectionSvg.toString()}
const K = { iso, pathOf };

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",", arcE: "Arc energy", heat: "Heat input", wire: "wire", wide: "bead ≈", wideTail: "mm wide", area: "mm²", spray: "spray arc", short: "short arc", globular: "large drops, spatter", tapPart: "tap a part to name it",
      mag: "MAG · Ar + 18% CO₂ · 15 l/min · steel", mig: "MIG · pure argon · 15 l/min · aluminium", wps: "WPS", inRange: "inside the WPS", over: "OUTSIDE THE WPS: too hot", under: "OUTSIDE THE WPS: too cold", tested: "WPQR 1.2 ± 25%",
      hot: "wider, softer HAZ", cold: "hard HAZ, crack risk", mid: "HAZ in the middle", vsRef: "vs 1.0 kJ/mm",
      parts: { torch: ["Torch", "the welding gun, held by the arm"], nozzle: ["Gas nozzle", "the copper cup that steers the gas"], wire: ["Wire", "Ø1.2 mm: the electrode and the filler"], arc: ["Arc and weld pool", "a continuous spark melts plate and wire"], bead: ["Weld", "the pool freezes into the bead"], plate: ["Base metal", "12 mm S355 plate"], clamp: ["Clamp", "holds the plate flat while it heats"], earth: ["Earth clamp", "closes the circuit back to the source"], carriage: ["Carriage", "moves the plate: the travel speed"], ruler: ["Scale", "reads the travel in mm"], motor: ["Drive", "motor and lead screw set the travel speed"], feeder: ["Wire feeder", "the display shows volts and amps"], gas: ["Shielding gas", "flow meter: 12 to 18 litres a minute"], reel: ["Wire reel", "pushes wire through the hose"], hose: ["Hose", "wire, gas and current to the torch"], column: ["Column", "carries the arm with feeder and torch"] } }
  : { dec: ",", grp: ".", arcE: "Booglasenergie", heat: "Warmte-inbreng", wire: "draad", wide: "rups ≈", wideTail: "mm breed", area: "mm²", spray: "sproeiboog", short: "kortsluitboog", globular: "grote druppels, spatten", tapPart: "tik een onderdeel voor de naam",
      mag: "MAG · Ar + 18% CO₂ · 15 l/min · staal", mig: "MIG · zuiver argon · 15 l/min · aluminium", wps: "LMB", inRange: "binnen de LMB", over: "BUITEN DE LMB: te warm", under: "BUITEN DE LMB: te koud", tested: "LMK 1,2 ± 25%",
      hot: "WBZ breder, zachter", cold: "harde WBZ, scheurgevaar", mid: "WBZ gemiddeld", vsRef: "t.o.v. 1,0 kJ/mm",
      parts: { torch: ["Toorts", "het laspistool, vast in de arm"], nozzle: ["Gasmondstuk", "het koperen kapje dat het gas richt"], wire: ["Draad", "Ø1,2 mm: elektrode én toevoegmateriaal"], arc: ["Boog en smeltbad", "een doorlopende vonk smelt plaat en draad"], bead: ["Las", "het smeltbad stolt tot de rups"], plate: ["Basismateriaal", "plaat S355 van 12 mm"], clamp: ["Spanklem", "houdt de plaat vlak als hij warm wordt"], earth: ["Massaklem", "sluit de stroomkring terug naar de bron"], carriage: ["Slede", "beweegt de plaat: de lassnelheid"], ruler: ["Schaal", "leest de verplaatsing in mm"], motor: ["Aandrijving", "motor en spindel bepalen de lassnelheid"], feeder: ["Draadaanvoer", "het display toont volt en ampère"], gas: ["Beschermgas", "debietmeter: 12 tot 18 liter per minuut"], reel: ["Draadhaspel", "duwt draad door het slangpakket"], hose: ["Slangpakket", "draad, gas en stroom naar de toorts"], column: ["Kolom", "draagt de arm met draadaanvoer en toorts"] } };
const fmt = (value, digits) => value.toFixed(digits).replace(".", T.dec);
const grouped = (value) => String(Math.round(value)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);

const stage = document.querySelector(".wd-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  bead: q("[data-bead]"), arc: q("[data-arc]"), sparks: q("[data-sparks]"), mark: q("[data-mark]"), view: q("[data-view]"),
  lamp: q("[data-lamp]"), wps: q("[data-wps]"), volt: q("[data-volt]"), amp: q("[data-amp]"), float: q("[data-float]"),
  gx: [...svg.querySelectorAll('[data-g="x"]')],
};
const lines = [...document.querySelectorAll("[data-readout] .wd-line")];
const announcer = document.querySelector(".wd-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// a radial gradient for the arc glow
(() => {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = '<radialGradient id="wd-glow-grad"><stop offset="0" style="stop-color:var(--wd-core);stop-opacity:.95"/><stop offset=".25" style="stop-color:var(--wd-glow);stop-opacity:.7"/><stop offset="1" style="stop-color:var(--wd-glow);stop-opacity:0"/></radialGradient>';
  svg.insertBefore(defs, svg.firstChild);
})();

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { u: L0.u, i: L0.i, v: L0.v, mig: false, sel: "u" };
const qNow = () => heatOf(st.u, st.i, st.v);
const wNow = () => widthOf(st.u, st.i, st.v);
const arcLen = () => clamp(0.3 * (st.u - 14), 1, 6);
const wpsState = () => { const qv = qNow(); return qv > WPS.hi + 1e-9 ? 1 : qv < WPS.lo - 1e-9 ? -1 : 0; };

// the pass: strike → weld along the seam → arc off → carriage back → a fresh plate
const cyc = { phase: "strike", t: 0, xw: WELD[0], on: 0, fresh: 0 };
const run = { xs: WELD[0], xe: WELD[0] };
let flick = 0.5, sparkClock = 0;
const sparks = [];

// ------------------------------------------------ drawing
let lastBead = "";
function place() {
  const off = -cyc.xw - XH; // the carriage moves so that the torch is over xw
  const t = translateAlong(P, [off, 0, 0]);
  el.gx.forEach((n) => n.setAttribute("transform", t));
  return off;
}
function drawBead() {
  const w = wNow();
  const haz = LVL >= 4 ? hazOf(qNow()) : 0;
  const ripple = clamp(st.v / 140, 1.6, 5);
  const key = [run.xs, run.xe, w, haz, ripple, cyc.fresh].map((v) => v.toFixed(2)).join("|");
  if (key === lastBead) return;
  lastBead = key;
  let out = beadSvg(K, P, run.xs, run.xe, w, haz, ripple);
  if (cyc.fresh > 0.004) out = '<g style="opacity:' + (1 - cyc.fresh).toFixed(3) + '">' + out + "</g>";
  el.bead.innerHTML = out;
}
function drawArc() {
  el.arc.innerHTML = arcSvg(K, P, wNow(), arcLen(), cyc.on, flick);
}
function drawSparks() {
  let html = "";
  for (const s of sparks) {
    const [x, y] = iso(s.p, P);
    const [x0, y0] = iso(s.q, P);
    html += '<path class="wd-spark-line" style="opacity:' + s.a.toFixed(2) + '" d="M' + x0.toFixed(1) + " " + y0.toFixed(1) + "L" + x.toFixed(1) + " " + y.toFixed(1) + '"/>';
  }
  el.sparks.innerHTML = html;
}
function drawSection() {
  const w = wNow();
  el.view.innerHTML = sectionSvg(w, heightOf(st.u, st.i, st.v), penOf(st.i, st.v), LVL >= 4 ? hazOf(qNow()) : 0);
}
let marked = -1;
function drawMark(off) {
  if (LVL !== 1 || marked < 0) { el.mark.innerHTML = ""; return; }
  const p = PARTS[marked];
  const o = p.g === "x" ? off : 0;
  const [x, y] = iso([p.at[0] + o, p.at[1], p.at[2]], P);
  el.mark.innerHTML = '<circle class="wd-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="wd-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
}
function readout() {
  const out = [];
  const E = arcOf(st.u, st.i, st.v), Q = qNow();
  const formula = T.arcE + " = " + st.u + " × " + st.i + " × 60 / (" + st.v + " × 1" + T.grp + "000) = " + fmt(E, 2) + " kJ/mm";
  if (LVL === 1) {
    out.push(st.mig ? T.mig : T.mag);
    out.push(st.u + " V · " + st.i + " A · " + st.v + " mm/min · " + T.wire + " Ø" + fmt(WIRE, 1));
    out.push(T.arcE + " = " + st.u + " × " + st.i + " × 60 / (" + st.v + " × 1" + T.grp + "000) = " + '<span class="wd-acc">' + fmt(E, 2) + "</span> kJ/mm");
    if (marked >= 0) { const [name, what] = T.parts[PARTS[marked].key]; out.push('<span class="wd-acc">' + name + "</span> · " + what); }
    else out.push('<span class="wd-mute">' + T.tapPart + "</span>");
  } else {
    out.push("U " + st.u + " V · I " + st.i + " A ← " + T.wire + " " + fmt(wfsOf(st.i), 1) + " m/min · " + T[transferOf(st.u, st.i)]);
    out.push(formula);
    out.push(T.heat + " = " + fmt(K_MAG, 1) + " × " + fmt(E, 2) + ' = <span class="wd-acc">' + fmt(Q, 2) + "</span> kJ/mm");
    out.push(T.wide + " " + fmt(wNow(), 1) + " " + T.wideTail + " · " + fmt(depositOf(st.i, st.v), 1) + " " + T.area);
    if (LVL === 3) {
      const s = wpsState();
      out.push(T.wps + " " + fmt(WPS.lo, 2) + "–" + fmt(WPS.hi, 2) + " kJ/mm (" + T.tested + ") · " + (s === 0 ? '<span class="wd-strong">' + T.inRange + "</span>" : '<span class="wd-warn">' + (s > 0 ? T.over : T.under) + "</span>"));
    } else if (LVL === 4) {
      const txt = Q > 1.2 ? T.hot : Q < 0.75 ? T.cold : T.mid;
      out.push("t8/5 ×" + fmt(Q / 1.0, 1) + " " + T.vsRef + " · " + txt);
    }
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
function drawPanel() {
  const vt = fmt(st.u, 1) + " V", at = st.i + " A";
  if (el.volt.textContent !== vt) el.volt.textContent = vt;
  if (el.amp.textContent !== at) el.amp.textContent = at;
  if (cyc.on > 0.5) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  if (LVL >= 3 && wpsState() !== 0) el.wps.setAttribute("data-on", ""); else el.wps.removeAttribute("data-on");
}
function draw() {
  const off = place();
  drawBead();
  drawArc();
  drawSparks();
  drawSection();
  drawMark(off);
  drawPanel();
  readout();
}

// ------------------------------------------------ the welding cycle
const DUR = { strike: 0.35, stop: 0.35, back: 1.0, load: 0.6 };
function stepCycle(dt) {
  cyc.t += dt;
  if (cyc.phase === "strike") {
    cyc.on = smooth(0, DUR.strike, cyc.t);
    if (cyc.t >= DUR.strike) { cyc.phase = "weld"; cyc.t = 0; cyc.on = 1; }
  } else if (cyc.phase === "weld") {
    const mmPerS = (st.v / 60) * TS;
    cyc.xw = Math.min(WELD[1], cyc.xw + dt * mmPerS);
    run.xe = cyc.xw;
    sparkClock += dt * (st.i / 250) * (transferOf(st.u, st.i) === "globular" ? 2.2 : 1);
    if (sparkClock > 0.09) { sparkClock = 0; spawnSpark(); }
    if (cyc.xw >= WELD[1]) { cyc.phase = "stop"; cyc.t = 0; }
  } else if (cyc.phase === "stop") {
    cyc.on = 1 - smooth(0, DUR.stop, cyc.t);
    if (cyc.t >= DUR.stop) { cyc.phase = "back"; cyc.t = 0; cyc.on = 0; }
  } else if (cyc.phase === "back") {
    cyc.xw = WELD[1] - (WELD[1] - WELD[0]) * smooth(0, DUR.back, cyc.t);
    if (cyc.t >= DUR.back) { cyc.phase = "load"; cyc.t = 0; cyc.xw = WELD[0]; }
  } else if (cyc.phase === "load") {
    cyc.fresh = smooth(0, DUR.load, cyc.t);
    if (cyc.t >= DUR.load) { cyc.fresh = 0; run.xs = run.xe = WELD[0]; cyc.phase = "strike"; cyc.t = 0; onPass(); }
  }
}
function spawnSpark() {
  if (sparks.length > 10) return;
  const a = Math.random() * Math.PI * 2, sp = 30 + Math.random() * 40;
  sparks.push({ p0: [0, 0, PT + 1], p: [0, 0, PT + 1], q: [0, 0, PT + 1], age: 0, a: 0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, vz: 30 + Math.random() * 30 });
}
function stepSparks(dt) {
  for (const s of sparks) {
    s.age += dt;
    const t = s.age, t0 = Math.max(0, t - 0.035);
    const at = (tt) => [s.p0[0] + s.vx * tt, s.p0[1] + s.vy * tt, Math.max(PT, s.p0[2] + s.vz * tt - 160 * tt * tt)];
    s.p = at(t); s.q = at(t0);
    s.a = smooth(0, 0.03, t) * (1 - smooth(0.2, 0.45, t));
  }
  for (let i = sparks.length - 1; i >= 0; i--) if (sparks[i].age > 0.45) sparks.splice(i, 1);
}
function stillPose() {
  sparks.length = 0;
  cyc.phase = "weld"; cyc.t = 0; cyc.on = 1; cyc.fresh = 0;
  cyc.xw = 10; run.xs = WELD[0]; run.xe = 10; flick = 0.5;
}

// ------------------------------------------------ the idle tour
// Level 1: MAG on steel twice, then MIG on aluminium. Level 2: the lesson's
// robot weld (29 V, 300 A, 420 mm/min: 1.0 kJ/mm), the recall (28 V, 250 A,
// 350: 0.96), then half the speed (2.0). Level 3: the 1.6 the welders want
// (outside the WPS), then 300 mm/min (1.44, inside), then 1.6 again.
// Level 4: 1.0, then hot (2.0), then cold (24 V, 220 A, 400: 0.63).
const TOURS = {
  1: [{ mig: false }, { mig: false }, { mig: true }],
  2: [{ u: 29, i: 300, v: 420 }, { u: 28, i: 250, v: 350 }, { u: 29, i: 300, v: 210 }],
  3: [{ u: 30, i: 300, v: 270 }, { u: 30, i: 300, v: 300 }],
  4: [{ u: 29, i: 300, v: 420 }, { u: 29, i: 300, v: 210 }, { u: 24, i: 220, v: 400 }],
};
let touring = !still.matches, tourStep = 0, idleTimer = 0;
function onPass() {
  if (!touring) return;
  tourStep = (tourStep + 1) % TOURS[LVL].length;
  Object.assign(st, TOURS[LVL][tourStep]);
  lastBead = "";
  sync();
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (calm) stillPose();
  else {
    stepCycle(dt);
    stepSparks(dt);
    flick += (Math.random() - flick) * Math.min(1, dt * 18);
  }
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
const LISTS = { u: U_LIST, i: I_LIST, v: V_LIST };
const pick = [...document.querySelectorAll("[data-pick]")];
const procBtns = [...document.querySelectorAll("[data-proc]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
document.querySelector('[data-row="proc"]').hidden = LVL !== 1;
document.querySelector('[data-row="vals"]').hidden = LVL === 1;
function sync() {
  pick.forEach((b) => { b.setAttribute("aria-checked", String(b.dataset.pick === st.sel)); b.tabIndex = b.dataset.pick === st.sel ? 0 : -1; b.querySelector("b").textContent = String(st[b.dataset.pick]); });
  procBtns.forEach((b) => { const on = (b.dataset.proc === "mig") === st.mig; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  const list = LISTS[st.sel];
  const i = list.indexOf(st[st.sel]);
  stepBtns.forEach((b) => (b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1));
  describe();
}
function describe() {
  let text;
  const E = arcOf(st.u, st.i, st.v), Q = qNow();
  if (LVL === 1) text = (st.mig ? T.mig : T.mag) + ", " + T.arcE + " " + fmt(E, 2) + " kJ/mm" + (marked >= 0 ? ", " + T.parts[PARTS[marked].key].join(": ") : "");
  else {
    text = "U " + st.u + " V, I " + st.i + " A, v " + st.v + " mm/min: " + T.arcE + " " + fmt(E, 2) + ", " + T.heat + " " + fmt(Q, 2) + " kJ/mm, " + T.wide + " " + fmt(wNow(), 1) + " " + T.wideTail;
    if (LVL === 3) { const s = wpsState(); text += ", " + (s === 0 ? T.inRange : s > 0 ? T.over : T.under); }
  }
  stage.setAttribute("aria-valuetext", text);
  return text;
}
let quiet = 0;
function announce() { clearTimeout(quiet); quiet = setTimeout(() => { announcer.textContent = describe() + "."; }, 600); }
function changed() { steer(); lastBead = ""; sync(); announce(); kick(); }
function stepValue(dir) {
  const key = st.sel;
  const list = LISTS[key];
  let i = list.indexOf(st[key]);
  if (i < 0) i = 0;
  i = clamp(i + dir, 0, list.length - 1);
  st[key] = list[i];
  changed();
}
pick.forEach((b) => b.addEventListener("click", () => { st.sel = b.dataset.pick; changed(); }));
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
procBtns.forEach((b) => b.addEventListener("click", () => { st.mig = b.dataset.proc === "mig"; changed(); }));
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
radioKeys(document.querySelector('[data-row="vals"] [role="radiogroup"]'), ["u", "i", "v"], () => st.sel, (v) => { st.sel = v; changed(); });
radioKeys(document.querySelector('[data-row="proc"]'), ["mag", "mig"], () => (st.mig ? "mig" : "mag"), (v) => { st.mig = v === "mig"; changed(); });

// tap the drawing: at level 1 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  const off = -cyc.xw - XH;
  let best = -1, bestD = 46;
  PARTS.forEach((p, i) => {
    const o = p.g === "x" ? off : 0;
    const [px, py] = iso([p.at[0] + o, p.at[1], p.at[2]], P);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
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
  else if (LVL > 1 && ["1", "2", "3"].includes(event.key)) { st.sel = ["u", "i", "v"][Number(event.key) - 1]; changed(); }
  else handled = false;
  if (handled) event.preventDefault();
});
stage.addEventListener("focus", () => { describe(); kick(); });

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) go();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { touring = !still.matches; if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { cyc.phase = "strike"; cyc.t = 0; go(); } });
if (still.matches) stillPose(); else { cyc.phase = "strike"; cyc.xw = WELD[0]; run.xs = run.xe = WELD[0]; }
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "MAG-lassen: boog, draad en warmte",
    hint1: "Tik een onderdeel · kies MAG of MIG · 1 s = 4 s",
    hint2: "Kies U, I of v, dan − of + · 1 s = 4 s",
    mag: "MAG · staal",
    mig: "MIG · aluminium",
    vals: "Lasparameter",
    procs: "Proces",
    minus: "Lager",
    plus: "Hoger",
    label: LABEL_NL,
    aria: "MAG-lasopstelling. Niveau 1: pijltjes kiezen een onderdeel. Vanaf niveau 2: toetsen 1 tot 3 kiezen spanning U, stroom I of lassnelheid v, pijl omhoog en omlaag veranderen de waarde.",
  },
  en: {
    title: "MAG welding: arc, wire and heat",
    hint1: "Tap a part · pick MAG or MIG · 1 s = 4 s",
    hint2: "Pick U, I or v, then − or + · 1 s = 4 s",
    mag: "MAG · steel",
    mig: "MIG · aluminium",
    vals: "Welding parameter",
    procs: "Process",
    minus: "Lower",
    plus: "Higher",
    label: LABEL_EN,
    aria: "MAG welding set-up. Level 1: arrows pick a part. From level 2: keys 1 to 3 pick voltage U, current I or travel speed v, up and down change the value.",
  },
};

const sN = STRINGS.nl;
const valBtn = (key, labelHtml) => `<button type="button" class="wd-btn" role="radio" data-pick="${key}" aria-checked="${key === "u"}" tabindex="${key === "u" ? 0 : -1}">${labelHtml}&nbsp;<b></b></button>`;
const controls = [
  `<div class="wd-controls">`,
  `<div class="wd-row" data-row="proc" role="radiogroup" aria-label="${sN.procs}"><button type="button" class="wd-btn" role="radio" data-proc="mag" aria-checked="true">${sN.mag}</button><button type="button" class="wd-btn" role="radio" data-proc="mig" aria-checked="false" tabindex="-1">${sN.mig}</button></div>`,
  `<div class="wd-row" data-row="vals"><div role="radiogroup" aria-label="${sN.vals}" style="display:flex;gap:4px;flex:1 1 auto">${valBtn("u", "<i>U</i>")}${valBtn("i", "<i>I</i>")}${valBtn("v", "<i>v</i>")}</div><button type="button" class="wd-btn" data-step="-" aria-label="${sN.minus}">−</button><button type="button" class="wd-btn" data-step="+" aria-label="${sN.plus}">+</button></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="wd-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="wd-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="wd-line"></span>'.repeat(5)}</span>`)
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
set('[data-proc="mag"]',s.mag);set('[data-proc="mig"]',s.mig);
document.querySelector('[data-row="proc"]').setAttribute("aria-label",s.procs);
document.querySelector('[data-row="vals"] [role="radiogroup"]').setAttribute("aria-label",s.vals);
document.querySelector('[data-step="-"]').setAttribute("aria-label",s.minus);document.querySelector('[data-step="+"]').setAttribute("aria-label",s.plus);
var st=document.querySelector(".wd-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: E ${arcOf(24, 220, 400).toFixed(3)} Q ${heatOf(24, 220, 400).toFixed(3)} · L2 Q ${heatOf(29, 300, 420).toFixed(3)} w ${widthOf(29, 300, 420).toFixed(1)} mm Ad ${depositOf(300, 420).toFixed(1)} · L3 Q ${heatOf(30, 300, 270).toFixed(2)} WPS ${WPS.lo}–${WPS.hi}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)} · loupe r ${LOUPE.r}`);

A.auditOrExit(R, P, { frames: A.uniformStates(20), apart: true, cover: ["arc"] });
