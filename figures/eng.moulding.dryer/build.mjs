// Dev tool, not shipped. Builds the standalone figure for the topic "Kunststoffen"
// (module Spuitgieten): the lessons eng.moulding.materials (level 1), polymers
// (level 2), drying (level 3) and fillers (level 4).
//
//   node figures/eng.moulding.dryer/build.mjs            build the page
//   node figures/eng.moulding.dryer/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.moulding.dryer.html: one offline page
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
const { tubePieces, tubeSvg } = await import(pathToFileURL(join(SKILL, "kit/tube.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "src/content/courses/figures/eng.moulding.dryer.html");

// ---------------------------------------------------------------- the model
// From the four lessons of the topic "Kunststoffen", with typical supplier
// values (hedged: always the grade's own datasheet first):
//   PC   120 °C, 2–4 h, max 0.02 % (Covestro Makrolon processing data)
//   PA6   80 °C, ~4 h, max 0.15 % (BASF Ultramid datasheets: aim 0.03–0.06 %,
//         max 0.15 %; the lesson: 0.03–0.15 % by type; hotter yellows it)
//   PET  160 °C, ~4 h, max 0.005 % = 50 ppm (lesson; 150–180 °C in practice)
//   ABS   80 °C, 2–4 h, max ~0.1 % (suppliers 0.1–0.2 %; ARBURG lists < 0.2 %)
//   PP   takes up hardly any water: no drying.
// Drying is drawn as a first-order approach to the equilibrium moisture the dry
// air allows (a teaching model, not a datasheet curve):
//   M(t) = Me + (M0 − Me) · exp(−t / τ)
//   Me = Me₋₄₀ · 10^((dew point + 40) / 32)     wetter air, higher floor
//   τ  = τ₀ · 2^((T₀ − T) / 15)                 15 °C colder, twice as slow
// M0 is wet granulate from an opened bag. Residence time = hopper content /
// throughput (lesson materials: 50 kg hopper, 12 kg/h, 4 h → 48 kg needed).
// Regrind (level 4): if every shot's regrind goes back at share r, a granule
// has passed the barrel on average 1 / (1 − r) times, and a share r² has done
// so three times or more.
const MATS = {
  PP: { dry: false, M0: 0.02, fam: "semi", shrink: "1,5", melt: 165, tg: 0 },
  ABS: { dry: true, T0: 80, tmax: 90, time: "2–4", req: 3, M0: 0.3, limit: 0.1, tau: 1.0, me: 0.02, fam: "amorf", shrink: "0,5", tg: 105, melt: 0 },
  PA6: { dry: true, T0: 80, tmax: 90, time: "4", req: 4, M0: 0.8, limit: 0.15, tau: 1.5, me: 0.02, fam: "semi", shrink: "1–2", melt: 220, tg: 0 },
  PC: { dry: true, T0: 120, tmax: 130, time: "2–4", req: 3, M0: 0.2, limit: 0.02, tau: 0.8, me: 0.004, fam: "amorf", shrink: "0,5", tg: 145, melt: 0 },
  PET: { dry: true, T0: 160, tmax: 180, time: "4", req: 4, M0: 0.3, limit: 0.005, tau: 0.85, me: 0.001, fam: "semi", shrink: "1–2", melt: 250, tg: 0 },
};
const THROUGHPUT = 12; // kg/h, the materials lesson's press
const HOPPER = 50; // kg
const SAMPLE = 20; // g, the drying lesson's sample
const REGRIND_MAX = 25; // %, the materials lesson: customers allow 10 to 25 %
const moistureOf = (m, T, dp, t) => {
  if (!m.dry) return m.M0;
  const me = m.me * Math.pow(10, (dp + 40) / 32);
  const tau = m.tau * Math.pow(2, (m.T0 - T) / 15);
  return me + (m.M0 - me) * Math.exp(-t / tau);
};
const passesOf = (r) => 1 / (1 - r);
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  const PA = MATS.PA6, PC = MATS.PC, PET = MATS.PET;
  near(PA.req * THROUGHPUT, 48, 0, "materials example: 4 h × 12 kg/h");
  near(Math.round((20 / THROUGHPUT) * 10) / 10, 1.7, 0, "materials example: 20 kg lasts 1.7 h");
  near(3 * 20, 60, 0, "materials recall: 3 h × 20 kg/h");
  if (moistureOf(PA, 80, -40, HOPPER / THROUGHPUT) > PA.limit) throw new Error("PA6 full hopper should be dry");
  if (moistureOf(PA, 80, -40, 20 / THROUGHPUT) < PA.limit) throw new Error("PA6 after 1.7 h should be wet");
  if (moistureOf(PC, 120, -40, 3) > PC.limit) throw new Error("PC 3 h at −40 should be dry");
  if (moistureOf(PET, 160, -40, 4) > PET.limit) throw new Error("PET 4 h at −40 should be dry");
  if (MATS.PP.M0 > 0.05) throw new Error("PP is dry from the bag");
  // drying lesson: PC at a dew point crept to −15 °C, 3 h → about 0.03 %, the
  // moisture meter reads 20.000 g → 19.994 g
  const m = moistureOf(PC, 120, -15, 3);
  near(Math.round(m * 100) / 100, 0.03, 0, "drying example: PC at −15 °C");
  const after = Math.round(SAMPLE * (1 - m / 100) * 1000) / 1000;
  near(after, 19.994, 1e-9, "drying example: sample after the meter");
  near(Math.round(((SAMPLE - after) / SAMPLE) * 100 * 100) / 100, 0.03, 0, "drying example: 0.03 %");
  near(((10 - 9.99) / 10) * 100, 0.1, 1e-9, "drying recall: PA 10.000 → 9.990 g");
  near(100000 * 0.00005, 5, 1e-9, "drying recall: PET 100 kg × 0.005 %");
  near(passesOf(0.2), 1.25, 1e-9, "regrind 20 %");
  near(PC.limit, 0.02, 0, "PC limit");
  near(PET.limit, 0.005, 0, "PET limit");
}
const LEVELS = {
  1: { mat: "PA6", kg: 50, dp: -40, regrind: 0 },
  2: { mat: "PA6", kg: 50, dp: -40, regrind: 0 },
  3: { mat: "PC", kg: 36, dp: -15, regrind: 0, T: 120 },
  4: { mat: "PA6", kg: 50, dp: -40, regrind: 20 },
};

// ---------------------------------------------------------------- the world
// World units are centimetres (the hopper a little larger than life), z up, x
// along the press (nozzle at −x), +y toward the operator. The drying hopper
// sits on the feed throat of the injection unit; the desiccant dryer stands on
// castors beside the press and blows dry air in at the bottom of the hopper's
// cylinder; the moist air comes back from the top through a filter.
const WIDTH = 600;
const BED = { x: -80, y: -24, w: 122, d: 34, r: 1.2 };
const BED_TOP = 56;
const PLATE = { x: -76, y: -18, w: 116, d: 24, r: 0.8 };
const PLATE_TOP = 60;
const ZC = 72;
const YC = -6;
const THROAT = { x: 4, y: -14, w: 14, d: 16, r: 0.6 };
const THROAT_TOP = 80;
const DRIVE = { x: 18, y: -16, w: 22, d: 20, r: 0.8 };
const DRIVE_TOP = 86;
const HX = 11; // hopper axis x (y = YC)
const H_R = 14;
const H_Z0 = 88; // bottom of the cone
const H_CYL = 100; // cone meets cylinder
const H_TOP = 140;
const GLASS = { x: 7, y: 8, w: 8, d: 2.4, r: 0.4 };
const GLASS_Z = [106, 134];
const WIN = { x0: 8, x1: 14, z0: 107.4, z1: 132.6, r: 0.6, depth: 0.7 };
const IN_Z = 108;
const OUT_Z = 134;
const DRY = { x: 62, y: -20, w: 30, d: 30, r: 1 };
const DRY_Z = [7, 60];
const DFACE = DRY.y + DRY.d; // 10
const DISP = { x0: 66, x1: 88, z0: 44, z1: 55, r: 0.8, depth: 0.7 };
const TOWERS = [[68, -14], [86, -14]];
const FILTER = [57.5, YC];
const FILTER_TOP = 54 + 13.6;
const METER = { x: 80, y: 1, w: 9, d: 7, r: 0.5 };
const MWIN = { x0: 80.6, x1: 88.4, z0: 60.9, z1: 63.3, r: 0.3, depth: 0.3 };

const FIT = [
  ...k.boxCorners(BED, 0, BED_TOP),
  ...k.boxCorners({ x: HX - 16, y: YC - 16, w: 32, d: 32 }, 80, 160),
  ...k.boxCorners(DRY, 0, 86),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 52);
const ELEVATION = Number(process.env.EL ?? 24);
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
const R = A.recorder(P, {});
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "", ...rest } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, attrs, ...rest });
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
function hose(base, route, r, tone = "mid") {
  const id = R.nameFor(base);
  R.route(id, route, r, { owner: id });
  tubePieces(route, r, P, { maxLength: 14 }).forEach((part, index) =>
    put(`${id}:${index}`, part.mid, tubeSvg(part, { tone }), [A.tube(part.points, part.radii, { name: id, owner: id })], { route: id, chunk: index }),
  );
}

// A recess in the face y = const (after the desk computer's screen): inner walls
// shaded by facing, a back plane holding `back`, clipped to the opening.
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "dr-glass") {
  const id = `dr-clip-${clips++}`;
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

// ---------------------------------------------------------------- floor and press bed
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(BED, -2), 0, 2, P)}"/>`,
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(DRY, -1.5), 0, 1.5, P)}"/>`,
];
for (const x of [-76, -20, 38]) for (const y of [-20, 6]) {
  post("stand.foot", x, y, 3, 0, 1.2, { tone: "lo" }, { steps: 6 });
  post("bed.jack", x, y, 1.3, 1.2, 3, { tone: "mid", crease: "none" }, { steps: 16 });
}
{
  const fy = BED.y + BED.d;
  const seams = [-30].map((x) => k.segment([x, fy, 3], [x, fy, BED_TOP], P)).join("");
  const slots = [];
  for (const [x0, x1] of [[-74, -36], [-24, 36]]) for (const z of [14, 18, 22]) slots.push(k.pathOf(k.roundedPlan({ x: x0 + 6, y: z, w: x1 - x0 - 12, d: 1.4, r: 0.6 }, 3).map(([u, w]) => at([u, fy, w])), true));
  const screws = [-78, -32, -28, 40].flatMap((x) => [[x, fy, 6], [x, fy, BED_TOP - 3]]);
  const label = [[-20, fy, 46], [2, fy, 46], [2, fy, 38], [-20, fy, 38]];
  const extra =
    `<path class="dr-card" d="${k.pathOf(label.map(at), true)}"/>` +
    L([44, 42, 40].map((z, i) => k.segment([-18.4, fy, z], [-18.4 + [16, 10, 13][i], fy, z], P)).join(""), { tone: "lo", free: true }) +
    Dt(screws.map(at), { size: 0.42 });
  box("bed.frame", BED, 3, BED_TOP, { tone: "mid" }, {
    steps: 3,
    bevel: 0.7,
    inner: L(seams + slots.join("") + k.sideSeam(BED, 8, P, 3), { tone: "lo" }),
    extra,
  });
}
box("inj.plate", PLATE, BED_TOP, PLATE_TOP, { tone: "mid" }, { steps: 2, bevel: 0.4, extra: Dt(k.corners(PLATE, 2).map(([x, y]) => at([x, y, PLATE_TOP])), { size: 0.42 }) });

// ---------------------------------------------------------------- injection unit: barrel, throat, drive
const BANDS = [[6, 14], [22, 30], [38, 46], [54, 62]];
{
  const F = frameX([-66, YC, ZC]);
  const prof = [[0, 6]];
  for (const [b0, b1] of BANDS) prof.push([b0, 6], [b0, 7.2], [b1, 7.2], [b1, 6]);
  prof.push([70, 6]);
  turned("inj.barrel", F, prof, { tone: "mid" }, {});
  turned("inj.head", frameX([-72, YC, ZC]), [[0, 7.6], [6, 7.6]], { tone: "mid" }, {});
  turned("inj.nozzle", frameNX([-72, YC, ZC]), [[0, 4.2], [3, 4.2], [7, 2.6], [8.5, 1.4]], { tone: "hi", crease: "lo" }, {});
}
for (const x of [-48, -32]) box("inj.saddle", { x: x - 1.6, y: YC - 2, w: 3.2, d: 4, r: 0.3 }, PLATE_TOP, ZC - 6, { tone: "mid" }, { steps: 2 });
{
  // feed throat: water-cooled, two cooling-water nipples on its front face
  const fy = THROAT.y + THROAT.d;
  box("inj.throat", THROAT, PLATE_TOP, THROAT_TOP, { tone: "mid" }, {
    steps: 2,
    bevel: 0.4,
    inner: L(k.sideSeam(THROAT, 64, P, 2), { tone: "faint" }),
    extra: Dt(k.corners(THROAT, 1.6).map(([x, y]) => at([x, y, THROAT_TOP])), { size: 0.42 }),
  });
  for (const z of [66, 74]) discAt("inj.water", frameY([14, fy, z]), 0, 2, 1.2, { tone: "mid" }, { steps: 6, extra: Dt([at([14, fy + 2, z])], { size: 0.4, tone: "hi" }) });
}
{
  box("inj.drive", DRIVE, PLATE_TOP, DRIVE_TOP, { tone: "mid" }, {
    steps: 2,
    bevel: 0.6,
    inner: L(k.sideSeam(DRIVE, 66, P, 2), { tone: "faint" }),
    extra: Dt(k.corners(DRIVE, 1.8).map(([x, y]) => at([x, y, DRIVE_TOP])), { size: 0.42 }),
  });
  const FM = frameZ([34, YC, DRIVE_TOP]);
  turned("inj.motor", FM, [[0, 6], [10, 6]], { tone: "mid" }, { inner: k.fadedSvg(G.ribsOf(FM, 0.6, 9.4, 6, 20, P, { fade: [0.04, 0.42], seams: true }), { tone: "lo" }) });
  discAt("inj.motor-cap", FM, 10, 11.6, 4.8, { tone: "mid" }, { extra: Dt([at([34, YC, DRIVE_TOP + 11.6])], { size: 0.45, tone: "hi" }) });
}

// ---------------------------------------------------------------- the drying hopper
{
  // slide gate (magnet drawer) on the throat, its pull knob to the front
  const gate = { x: 4, y: -13, w: 14, d: 14, r: 0.5 };
  box("hop.gate", gate, THROAT_TOP, THROAT_TOP + 4, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(gate, 1.2).map(([x, y]) => at([x, y, THROAT_TOP + 4])), { size: 0.4 }) });
  discAt("hop.knob", frameY([HX, gate.y + gate.d, THROAT_TOP + 2]), 0, 2.4, 1.4, { tone: "hi", crease: "lo" }, { extra: Dt([at([HX, gate.y + gate.d + 2.4, THROAT_TOP + 2])], { size: 0.4, tone: "mid" }) });
  post("hop.neck", HX, YC, 4, THROAT_TOP + 4, H_Z0, { tone: "mid" }, { steps: 24 });
  const FH = frameZ([HX, YC, H_Z0]);
  const ribs = k.fadedSvg(G.ribsOf(FH, H_CYL - H_Z0 + 1, H_TOP - H_Z0 - 1, H_R, 22, P, { fade: [0.04, 0.4], seams: true }), { tone: "faint" });
  const seams = L([H_CYL - H_Z0, 22, 34].map((s) => G.arcOf(FH, s, H_R, P)).join(""), { tone: "lo" });
  turned("hop.body", FH, [[0, 4], [H_CYL - H_Z0, H_R], [H_TOP - H_Z0, H_R]], { tone: "mid" }, { inner: ribs + seams });
  const FL = frameZ([HX, YC, H_TOP]);
  const bolts = [];
  for (let i = 0; i < 12; i++) bolts.push(at(G.pointOf(FL, 1.6, H_R - 0.4, (i / 12) * Math.PI * 2)));
  discAt("hop.lid", FL, 0, 1.6, H_R + 1, { tone: "mid" }, { extra: Dt(bolts, { size: 0.4 }) });
  // the vacuum loader on the lid: virgin granulate in from the +x stub,
  // regrind from the front stub (the two lines run off to the silo and the
  // granulator; their couplings are capped here)
  post("hop.loader-neck", HX, YC, 4, H_TOP + 1.6, H_TOP + 3, { tone: "mid" }, { steps: 24 });
  const FLo = frameZ([HX, YC, H_TOP + 3]);
  turned("hop.loader", FLo, [[0, 8], [12, 8]], { tone: "mid" }, { inner: L(G.arcOf(FLo, 6, 8, P), { tone: "faint" }) });
  turned("hop.loader-cap", frameZ([HX, YC, H_TOP + 15]), [[0, 8.4], [1.2, 8.4], [3, 5], [3.6, 2]], { tone: "mid" }, { extra: Dt([at([HX, YC, H_TOP + 18.6])], { size: 0.5, tone: "hi" }) });
  const Fv = frameX([HX + 8, YC, H_TOP + 9]);
  discAt("hop.virgin", Fv, 0, 3, 1.8, { tone: "mid" }, {});
  discAt("hop.virgin-cap", Fv, 3, 4.6, 2.5, { tone: "mid" }, { steps: 6 });
  const Fr = frameY([HX, YC + 8, H_TOP + 9]);
  discAt("hop.regrind", Fr, 0, 3, 1.8, { tone: "mid" }, { attrs: ' data-rg=""' });
  discAt("hop.regrind-cap", Fr, 3, 4.6, 2.5, { tone: "mid" }, { steps: 6, attrs: ' data-rg=""' });
  // sight glass on the front of the cylinder: the granulate inside, live
  const fy = GLASS.y + GLASS.d;
  const screws = [[GLASS.x + 0.8, fy, GLASS_Z[0] + 0.8], [GLASS.x + GLASS.w - 0.8, fy, GLASS_Z[0] + 0.8], [GLASS.x + 0.8, fy, GLASS_Z[1] - 0.8], [GLASS.x + GLASS.w - 0.8, fy, GLASS_Z[1] - 0.8]];
  box("hop.glass", GLASS, GLASS_Z[0], GLASS_Z[1], { tone: "mid" }, {
    steps: 2,
    extra: recess(WIN, fy, `<path class="dr-pellets" data-pellets="" d=""/><path class="dr-flakes" data-flakes="" d=""/><path class="iso-line" data-tone="mid" data-levelline="" d=""/>`) + Dt(screws.map(at), { size: 0.4 }),
  });
  // air ports on the +x side: dry air in low, moist air out high
  for (const [name, z] of [["hop.inlet", IN_Z], ["hop.outlet", OUT_Z]]) {
    const F = frameX([HX + H_R, YC, z]);
    discAt(name, F, 0, 3, 2.6, { tone: "mid" }, {});
    discAt(name + "-flange", F, 3, 4.2, 3.8, { tone: "mid" }, { steps: 8 });
  }
}

// ---------------------------------------------------------------- the desiccant dryer on castors
for (const [cx, cy] of k.corners(DRY, 3.5)) {
  box("dry.fork", { x: cx - 1.6, y: cy - 1.6, w: 3.2, d: 3.2, r: 0.3 }, 4.2, DRY_Z[0], { tone: "mid" }, { steps: 1 });
  discAt("stand.wheel", frameY([cx, cy - 0.9, 2.1]), 0, 1.8, 2.1, { tone: "lo" }, { steps: 16 });
}
{
  const fy = DFACE;
  const slots = [];
  for (const z of [14, 17, 20, 23, 26]) slots.push(k.pathOf(k.roundedPlan({ x: 66, y: z, w: 22, d: 1.2, r: 0.55 }, 3).map(([u, w]) => at([u, fy, w])), true));
  const label = [[66, fy, 38], [78, fy, 38], [78, fy, 32], [66, fy, 32]];
  const display = [
    `<text class="dr-lcd" data-lcd="dp" x="${DISP.x0 + 1.6}" y="${-(DISP.z0 + 4.6)}" font-size="3.8">−40 °C</text>`,
    `<text class="dr-lcd dr-lcd-s" data-lcd="t" x="${DISP.x0 + 1.6}" y="${-(DISP.z0 + 1.4)}" font-size="2.4">80 °C</text>`,
    `<path class="iso-line" data-tone="lo" d="M${DISP.x0 + 16} ${-DISP.z0}L${DISP.x0 + 16} ${-DISP.z1}"/>`,
    `<g data-ledrow="">${[0, 1].map((i) => `<circle class="dr-led" data-led="${i}" cx="${DISP.x0 + 18 + i * 2.2}" cy="${-(DISP.z0 + 7.4)}" r="0.8"/>`).join("")}</g>`,
    `<text class="dr-lcd dr-lcd-s" x="${DISP.x0 + 17.1}" y="${-(DISP.z0 + 3.4)}" font-size="1.6">A B</text>`,
  ].join("");
  const screws = [[63.2, fy, 8.4], [90.8, fy, 8.4], [63.2, fy, 58.6], [90.8, fy, 58.6]];
  box("dry.cabinet", DRY, DRY_Z[0], DRY_Z[1], { tone: "mid" }, {
    steps: 3,
    bevel: 0.7,
    inner: L(slots.join("") + k.sideSeam(DRY, 31, P, 3), { tone: "lo" }),
    extra:
      recess(DISP, fy, display, "dr-screen") +
      `<path class="dr-card" d="${k.pathOf(label.map(at), true)}"/>` +
      L([36.4, 34.8, 33.4].map((z, i) => k.segment([67.2, fy, z], [67.2 + [8.4, 6, 7.4][i], fy, z], P)).join(""), { tone: "lo", free: true }) +
      Dt(screws.map(at), { size: 0.42 }),
  });
  discAt("dry.switch", frameY([85, fy, 35]), 0, 1.4, 2.6, { tone: "mid" }, { steps: 20 });
  discAt("dry.switch-grip", frameY([85, fy, 35]), 1.4, 3, 0.9, { tone: "hi", crease: "lo" }, { steps: 12 });
  // dry-air outlet on the −x side
  const Fo = frameNX([DRY.x, YC, 40]);
  discAt("dry.port", Fo, 0, 2.5, 2.6, { tone: "mid" }, {});
  discAt("dry.port-flange", Fo, 2.5, 3.7, 3.8, { tone: "mid" }, { steps: 8 });
}
{
  // twin desiccant towers: one dries the process air, the other regenerates
  TOWERS.forEach(([x, y], i) => {
    const F = frameZ([x, y, DRY_Z[1]]);
    turned("dry.tower", F, [[1.2, 4.5], [20, 4.5], [22.5, 3.8, 1], [24, 2.4, 1], [24.6, 0.6]], { tone: "mid" }, {
      attrs: ` data-tower="${i}"`,
      inner: L([3, 17].map((s) => G.arcOf(F, s, 4.5, P)).join(""), { tone: "lo" }),
    });
    discAt("dry.tower-foot", F, 0, 1.2, 5.4, { tone: "mid" }, { steps: 8 });
  });
  // the return-air filter canister on the dryer's −x side, on a bracket
  const FZ = 54;
  box("dry.bracket", { x: FILTER[0] + 3.5, y: FILTER[1] - 1.5, w: DRY.x - FILTER[0] - 3.5, d: 3, r: 0.2 }, FZ + 1, FZ + 5, { tone: "mid" }, { steps: 1 });
  const FF = frameZ([FILTER[0], FILTER[1], FZ]);
  turned("dry.filter", FF, [[0, 3.5], [10, 3.5]], { tone: "mid" }, { inner: k.fadedSvg(G.ribsOf(FF, 1, 9, 3.5, 14, P, { fade: [0.05, 0.4], seams: true }), { tone: "faint" }) });
  discAt("dry.filter-lid", FF, 10, 11.4, 4.1, { tone: "mid" }, { steps: 10 });
  post("dry.filter-stub", FILTER[0], FILTER[1], 2.6, FZ + 11.4, FZ + 13.6, { tone: "mid" }, { steps: 20 });
  // moisture meter on the dryer's lid: a sample pan under a hinged heater hood
  box("dry.meter", METER, DRY_Z[1], DRY_Z[1] + 4, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: recess(MWIN, METER.y + METER.d, `<text class="dr-lcd" data-lcd="m" x="${MWIN.x0 + 0.5}" y="${-(MWIN.z0 + 0.55)}" font-size="1.4">0,03 %</text>`, "dr-screen") });
  turned("dry.meter-hood", frameZ([METER.x + METER.w / 2, METER.y + METER.d / 2, DRY_Z[1] + 4]), [[0, 3], [1, 3], [2.2, 2.2, 1], [2.8, 0.8]], { tone: "hi", crease: "lo" }, {});
}

// ---------------------------------------------------------------- the air hoses
{
  const IN_END = HX + H_R + 4.2;
  const supply = G.fillet([[DRY.x - 3.7, YC, 40], [48, YC, 40], [48, YC, IN_Z], [IN_END, YC, IN_Z]], 5.2, 9, { P, tube: 2 });
  hose("air.supply", supply, 2, "mid");
  const back = G.fillet([[IN_END, YC, OUT_Z], [FILTER[0], YC, OUT_Z], [FILTER[0], YC, FILTER_TOP]], 6, 9, { P, tube: 2 });
  hose("air.return", back, 2, "lo");
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
if (process.env.ORDER) console.log(R.items.map((i, n) => n + " " + i.name).join("\n"));
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups, `<g data-mark=""></g>`];

const LABEL_NL =
  "Het achterste deel van een spuitgietmachine: de cilinder met verwarmingsbanden, de watergekoelde trechtervoet en de aandrijving. Op de trechtervoet staat een droogtrechter met afsluitschuif, een kijkglas waarin de korrels te zien zijn, en bovenop een laadkop met een aansluiting voor vers materiaal en een voor maalgoed. Naast de pers staat een droogmiddeldroger op wielen met twee droogmiddeltorens, een filter, een display met dauwpunt en luchttemperatuur, en een vochtmeter. Een slang brengt droge, warme lucht onder in de trechter; een tweede slang voert de vochtige lucht bovenuit terug naar de droger.";
const LABEL_EN =
  "The rear of an injection moulding machine: the barrel with heater bands, the water-cooled feed throat and the drive. On the feed throat stands a drying hopper with a slide gate, a sight glass that shows the granules, and on top a loader with one inlet for virgin material and one for regrind. Beside the press stands a desiccant dryer on castors with two desiccant towers, a filter, a display with dew point and air temperature, and a moisture meter. One hose carries dry, warm air into the bottom of the hopper; a second brings the moist air from the top back to the dryer.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "loader", at: [HX, YC, H_TOP + 10] },
  { key: "regrind", at: [HX, YC + 12, H_TOP + 9] },
  { key: "hopper", at: [HX - 6, YC + 10, 122] },
  { key: "glass", at: [11, GLASS.y + GLASS.d, 120] },
  { key: "gate", at: [HX, 1, THROAT_TOP + 2] },
  { key: "throat", at: [11, 2, 70] },
  { key: "barrel", at: [-40, YC + 6, ZC] },
  { key: "supply", at: [48, YC, 80] },
  { key: "return", at: [56, YC, OUT_Z] },
  { key: "towers", at: [77, -14, 76] },
  { key: "filter", at: [FILTER[0], FILTER[1] + 3.5, 52] },
  { key: "display", at: [77, DFACE, 50] },
  { key: "meter", at: [84.5, 8, 63] },
  { key: "dryer", at: [77, DFACE, 22] },
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
  --dr-hair:rgba(240,233,218,.12);--dr-accent:#5C9FAE;--dr-glass:#06161A;--dr-screen:#06161A;--dr-lcd:#8FC3CF;--dr-seg:#2A4A4A;
  --dr-pel:#5C9FAE;--dr-pel-clear:#3F8797;--dr-pel-edge:#C6E2E8;--dr-flake:#9FB3A6;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --dr-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --dr-hair:rgba(11,41,27,.14);--dr-accent:#276F81;--dr-glass:#E4DCC9;--dr-screen:#1E3328;--dr-lcd:#BFD6D8;--dr-seg:#C2C3B2;
  --dr-pel:#276F81;--dr-pel-clear:#D6E4E3;--dr-pel-edge:#276F81;--dr-flake:#7D877A;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--dr-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:2;--lines:4;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--dr-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="2"] .iso-plate{--rows:1;--lines:5}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--dr-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.dr-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dr-acc{color:var(--dr-accent);font-weight:600}
.dr-strong{color:var(--anatomy-strong);font-weight:600}
.dr-mute{color:var(--anatomy-muted)}
.dr-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.dr-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.dr-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.dr-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.dr-row{display:flex;gap:4px;height:44px;align-items:center}
.dr-row[hidden]{display:none}
.dr-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 4px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--dr-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--dr-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
.dr-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.dr-btn:disabled{opacity:.4;cursor:default}
.dr-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--dr-accent);color:var(--dr-accent);font-weight:600}
.dr-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.dr-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.dr-group{display:flex;gap:4px;flex:1 1 auto;height:44px}
.dr-range{flex:1 1 auto;min-width:0;height:44px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer;touch-action:none}
.dr-range:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px;border-radius:8px}
.dr-range::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:var(--dr-seg)}
.dr-range::-moz-range-track{height:4px;border-radius:2px;background:var(--dr-seg)}
.dr-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;margin-top:-9px;border-radius:50%;background:var(--anatomy-card);box-shadow:inset 0 0 0 2px var(--dr-accent)}
.dr-range::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:50%;background:var(--anatomy-card);box-shadow:inset 0 0 0 2px var(--dr-accent)}
.dr-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.dr-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.dr-glass{fill:var(--dr-glass);stroke:none}
.dr-screen{fill:var(--dr-screen);stroke:none}
.dr-lcd{fill:var(--dr-lcd);font-family:var(--anatomy-mono);font-weight:600;letter-spacing:0}
.dr-lcd-s{font-weight:500;opacity:.8}
.dr-led{fill:var(--dr-seg);stroke:none}
.dr-led[data-on]{fill:var(--dr-lcd)}
.dr-pellets{fill:var(--dr-pel);stroke:none}
html[data-clear] .dr-pellets{fill:var(--dr-pel-clear);stroke:var(--dr-pel-edge);stroke-width:.24px}
.dr-flakes{fill:var(--dr-flake);stroke:none}
.dr-mark{fill:none;stroke:var(--dr-accent);stroke-width:1.4px}
.dr-mark-dot{fill:var(--dr-accent);stroke:none}
[data-tower][data-on] .iso-top,[data-tower][data-on] .iso-shade,[data-tower][data-on] .iso-fill{fill:var(--anatomy-lit-shade);stroke:var(--anatomy-lit-shade);transition:fill .8s,stroke .8s}
[data-tower] .iso-top,[data-tower] .iso-shade,[data-tower] .iso-fill{transition:fill .8s,stroke .8s}
html[data-level="4"] [data-rg] .iso-top,html[data-level="4"] [data-rg] .iso-shade,html[data-level="4"] [data-rg] .iso-fill{fill:var(--anatomy-lit-shade);stroke:var(--anatomy-lit-shade)}
@media (prefers-reduced-motion:reduce){[data-tower] .iso-top,[data-tower] .iso-shade,[data-tower] .iso-fill{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const MATS = ${JSON.stringify(MATS)};
const LEVELS = ${JSON.stringify(LEVELS)};
const PARTS = ${JSON.stringify(PARTS)};
const THROUGHPUT = ${THROUGHPUT}, HOPPER = ${HOPPER}, SAMPLE = ${SAMPLE}, REGRIND_MAX = ${REGRIND_MAX};
const WIN = ${JSON.stringify(WIN)};
const moistureOf = ${moistureOf.toString()};
const passesOf = ${passesOf.toString()};

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", hygro: "hygroscopic", noDry: "takes up hardly any water", noDry2: "no drying needed", dp: "dew point", hopper: "hopper", need: "needs", moist: "moisture", limit: "limit", ok: "dry enough", wet: "too wet: splay, brittle parts", stop: "STOP", go: "OK to run", amorf: "amorphous", semi: "semi-crystalline", tg: "glass transition", tm: "melting point", shrink: "shrinkage", cavity: "cavity for 100 mm", dry: "dry", meter: "meter", kf: "meter too coarse: Karl Fischer titration", hot: { ABS: "too hot: granules stick", PA6: "too hot: PA yellows", PC: "above the supplier's maximum", PET: "above the supplier's maximum" }, dpHigh: "dew point too high: regenerate the desiccant", short: "too short: hopper too empty", cold: "too cold: drying too slow", allOk: "temperature, dew point, air flow and time good", regrind: "regrind", max: "customer max", overMax: "above the customer's max", passes: "times through the barrel on average", thrice: "of the granules 3 times or more", tapPart: "tap a part to name it", ppm: "ppm",
      parts: { loader: ["Loader", "sucks granulate up from the silo"], regrind: ["Regrind inlet", "ground sprues and rejects back in"], hopper: ["Drying hopper", "every granule stays here its drying time"], glass: ["Sight glass", "shows the granules and the level"], gate: ["Slide gate", "shuts the hopper off from the throat"], throat: ["Feed throat", "water-cooled, so granules don't stick"], barrel: ["Barrel", "heater bands melt the granules"], supply: ["Dry air in", "warm, dry air into the bottom of the hopper"], return: ["Return air", "moist air back to the dryer"], towers: ["Desiccant towers", "one dries, the other regenerates"], filter: ["Filter", "clogged: less air flow"], display: ["Dew point display", "−40 °C means very dry air"], meter: ["Moisture meter", "weighs, heats, weighs again"], dryer: ["Desiccant dryer", "blower, heater and desiccant"] } }
  : { dec: ",", hygro: "hygroscopisch", noDry: "neemt nauwelijks water op", noDry2: "drogen niet nodig", dp: "dauwpunt", hopper: "trechter", need: "nodig", moist: "vocht", limit: "grens", ok: "droog genoeg", wet: "te nat: splay, brosse producten", stop: "STOP", go: "mag draaien", amorf: "amorf", semi: "semi-kristallijn", tg: "glasovergang", tm: "smeltpunt", shrink: "krimp", cavity: "holte voor 100 mm", dry: "drogen", meter: "vochtmeter", kf: "vochtmeter te grof: Karl Fischer-titratie", hot: { ABS: "te heet: korrels plakken", PA6: "te heet: PA vergeelt", PC: "boven het maximum van de leverancier", PET: "boven het maximum van de leverancier" }, dpHigh: "dauwpunt te hoog: droogmiddel regenereren", short: "te kort: trechter te leeg", cold: "te koud: drogen gaat te traag", allOk: "temperatuur, dauwpunt, lucht en tijd goed", regrind: "maalgoed", max: "klant max", overMax: "boven het maximum van de klant", passes: "keer door de cilinder, gemiddeld", thrice: "van de korrels 3 keer of vaker", tapPart: "tik een onderdeel voor de naam", ppm: "ppm",
      parts: { loader: ["Laadkop", "zuigt korrels aan uit het silo"], regrind: ["Inlaat maalgoed", "vermalen aanspuitingen en afkeur terug"], hopper: ["Droogtrechter", "elke korrel zit hier zijn droogtijd"], glass: ["Kijkglas", "toont de korrels en het niveau"], gate: ["Afsluitschuif", "sluit de trechter af van de intrek"], throat: ["Trechtervoet", "watergekoeld, zodat korrels niet plakken"], barrel: ["Cilinder", "verwarmingsbanden smelten de korrels"], supply: ["Droge lucht in", "warme, droge lucht onder in de trechter"], return: ["Retourlucht", "vochtige lucht terug naar de droger"], towers: ["Droogmiddeltorens", "één droogt, de ander regenereert"], filter: ["Filter", "verstopt: minder luchtdebiet"], display: ["Dauwpuntdisplay", "−40 °C betekent heel droge lucht"], meter: ["Vochtmeter", "weegt, verwarmt, weegt opnieuw"], dryer: ["Droogmiddeldroger", "ventilator, verwarming en droogmiddel"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const pct = (m) => (m < 0.0095 ? fmt(m, 4) : m < 0.095 ? fmt(m, 3) : fmt(m, 2)) + " %";

const stage = document.querySelector(".dr-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  pellets: q("[data-pellets]"), flakes: q("[data-flakes]"), level: q("[data-levelline]"),
  dp: q('[data-lcd="dp"]'), t: q('[data-lcd="t"]'), m: q('[data-lcd="m"]'),
  leds: [...svg.querySelectorAll("[data-led]")], towers: [...svg.querySelectorAll("[data-tower]")], mark: q("[data-mark]"),
};
const lines = [...document.querySelectorAll("[data-readout] .dr-line")];
const announcer = document.querySelector(".dr-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ------------------------------------------------ state
const L0 = LEVELS[LVL];
const st = { mat: L0.mat, kg: L0.kg, dp: L0.dp, T: L0.T ?? (MATS[L0.mat].T0 ?? 80), regrind: L0.regrind, sel: "T" };
const mat = () => MATS[st.mat];
const hours = () => st.kg / THROUGHPUT;
const moisture = () => moistureOf(mat(), st.T, st.dp, hours());
const LISTS = { T: Array.from({ length: 25 }, (_, i) => 60 + 5 * i), dp: Array.from({ length: 10 }, (_, i) => -50 + 5 * i), kg: Array.from({ length: 23 }, (_, i) => 6 + 2 * i) };

// ------------------------------------------------ readout
const strong = (s) => '<span class="dr-strong">' + s + "</span>";
const acc = (s) => '<span class="dr-acc">' + s + "</span>";
const mute = (s) => '<span class="dr-mute">' + s + "</span>";
let marked = -1;
function verdict(m) {
  const M = mat();
  return m <= M.limit ? T.ok : acc(T.wet);
}
function cause(m) {
  const M = mat();
  if (st.T > M.tmax) return acc(T.hot[st.mat]);
  if (m <= M.limit) return T.allOk;
  if (st.dp > -30) return acc(T.dpHigh);
  if (hours() < M.req) return acc(T.short);
  if (st.T < M.T0 - 2) return acc(T.cold);
  return acc(T.short);
}
function famLine() {
  const M = mat();
  const fam = M.fam === "amorf" ? T.amorf : T.semi;
  const temp = M.tg ? T.tg + " ≈ " + M.tg + " °C" : T.tm + " ≈ " + M.melt + " °C";
  return st.mat + " · " + strong(fam) + " · " + temp;
}
function dryLine() {
  const M = mat();
  if (!M.dry) return st.mat + " · " + T.noDry + " · " + strong(T.noDry2);
  return st.mat + " · " + T.hygro + " · " + M.T0 + " °C, " + M.time.replace("–", "–") + " h, " + T.dp + " −40 °C";
}
function moistLine(m) {
  const M = mat();
  if (!M.dry) return T.moist + " ≈ " + pct(m) + " · " + T.ok;
  return T.moist + " " + strong(pct(m)) + " · " + T.limit + " " + pct(M.limit) + " · " + verdict(m);
}
function hopperLine() {
  const M = mat();
  const h = fmt(hours(), 1);
  const base = T.hopper + " " + st.kg + " kg / " + THROUGHPUT + " kg/h = " + h + " h";
  if (!M.dry) return base;
  return base + " · " + T.need + " " + M.req + " h × " + THROUGHPUT + " = " + M.req * THROUGHPUT + " kg";
}
function readout() {
  const out = [];
  const M = mat();
  const m = moisture();
  if (LVL === 1) {
    out.push(dryLine());
    out.push(hopperLine());
    out.push(moistLine(m));
  } else if (LVL === 2) {
    out.push(famLine());
    const s = M.shrink;
    const cav = s.includes("–") ? "101–102 mm" : fmt(100 * (1 + Number(s.replace(",", ".")) / 100), 1) + " mm";
    out.push(T.shrink + " ≈ " + s + " % · " + T.cavity + " ≈ " + cav);
    out.push(M.dry ? T.dry + " " + M.T0 + " °C · " + M.time + " h · " + T.limit + " " + pct(M.limit) : T.noDry + " · " + T.noDry2);
    out.push(moistLine(m));
  } else if (LVL === 3) {
    if (!M.dry) {
      out.push(dryLine());
      out.push(moistLine(m));
    } else {
      out.push(st.mat + " · " + st.T + " °C · " + T.dp + " " + (st.dp < 0 ? "−" : "") + Math.abs(st.dp) + " °C · " + st.kg + " kg = " + fmt(hours(), 1) + " h");
      out.push(T.moist + " " + pct(M.M0) + " → " + strong(pct(m)) + " · " + T.limit + " " + pct(M.limit) + " · " + (m <= M.limit && st.T <= M.tmax ? T.go : acc(T.stop)));
      if (st.mat === "PET") out.push(T.meter + ": " + mute(T.kf) + " · " + fmt(m * 10000, 0) + " " + T.ppm);
      else {
        const after = Math.round(SAMPLE * (1 - m / 100) * 1000) / 1000;
        const read = ((SAMPLE - after) / SAMPLE) * 100;
        out.push(T.meter + " " + fmt(SAMPLE, 3) + " g → " + fmt(after, 3) + " g = " + strong(fmt(read, 2) + " %"));
      }
      out.push(cause(m));
    }
  } else {
    const r = st.regrind / 100;
    out.push((st.mat === "PA6" ? "PA6 GF30" : st.mat) + " · " + T.regrind + " " + strong(st.regrind + " %") + " · " + T.max + " " + REGRIND_MAX + " %" + (st.regrind > REGRIND_MAX ? " · " + acc(T.overMax) : ""));
    out.push("1 / (1 − " + fmt(r, 2) + ") = " + strong(fmt(passesOf(r), 2)) + " " + T.passes);
    out.push(fmt(r * r * 100, r * r * 100 < 10 ? 1 : 0) + " % " + T.thrice);
    out.push(moistLine(m));
  }
  if (LVL <= 2) out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : mute(T.tapPart));
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

// ------------------------------------------------ the granules in the sight glass (plane coordinates: x, −z)
const DX = 1.3, DZ = 1.12, PR = 0.52;
const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
let level = 0; // eased level in z
const levelOf = () => WIN.z0 + 0.4 + (WIN.z1 - WIN.z0 - 0.8) * clamp((st.kg - 6) / (HOPPER - 6), 0, 1);
function granules(drop) {
  let pel = "", fl = "";
  const n0 = Math.floor(drop / DZ);
  const off = drop - n0 * DZ;
  const r = LVL === 4 ? st.regrind / 100 : 0;
  for (let j = 0; ; j++) {
    const z = WIN.z0 + PR + j * DZ - off;
    if (z > level - PR * 0.3) break;
    if (z < WIN.z0 - PR) continue;
    const row = n0 + j;
    const shiftX = (row % 2) * DX * 0.5;
    for (let c = 0; c < 6; c++) {
      const x = WIN.x0 + PR + shiftX + c * DX + (hash(row, c) - 0.5) * 0.18;
      if (x > WIN.x1 + PR) break;
      const y = -(z + (hash(c, row) - 0.5) * 0.14);
      if (hash(row * 7 + 3, c * 13 + 1) < r) {
        const a = hash(row, c * 3) * Math.PI, s = PR * 1.15, w = PR * 0.55;
        const ca = Math.cos(a), sa = Math.sin(a);
        const pts = [[s, w * 0.6], [-s * 0.8, w], [-s, -w * 0.5], [s * 0.7, -w]].map(([u, v]) => (x + u * ca - v * sa).toFixed(2) + " " + (y + u * sa + v * ca).toFixed(2));
        fl += "M" + pts.join("L") + "Z";
      } else {
        pel += "M" + (x - PR).toFixed(2) + " " + y.toFixed(2) + "a" + PR + " " + PR + " 0 1 0 " + (2 * PR) + " 0a" + PR + " " + PR + " 0 1 0 " + (-2 * PR) + " 0Z";
      }
    }
  }
  el.pellets.setAttribute("d", pel);
  el.flakes.setAttribute("d", fl);
  const lz = -level;
  el.level.setAttribute("d", "M" + WIN.x0 + " " + lz.toFixed(2) + "L" + WIN.x1 + " " + lz.toFixed(2));
}

// ------------------------------------------------ draw
const clock = { drop: 0, t: 0, playing: !still.matches };
function draw() {
  granules(clock.drop);
  const M = mat();
  const m = moisture();
  el.dp.textContent = (st.dp < 0 ? "−" : "") + Math.abs(st.dp) + " °C";
  el.t.textContent = (M.dry ? st.T : 0) + " °C";
  el.m.textContent = (st.mat === "PET" ? fmt(m * 10000, 0) + " ppm" : fmt(m, m < 0.095 ? 3 : 2) + " %");
  const phase = Math.floor(clock.t / 8) % 2;
  el.towers.forEach((n, i) => { if (i === phase) n.setAttribute("data-on", ""); else n.removeAttribute("data-on"); });
  el.leds.forEach((n, i) => { if (i === phase) n.setAttribute("data-on", ""); else n.removeAttribute("data-on"); });
  if (M.dry === false || st.mat === "PC" || st.mat === "PET") document.documentElement.toggleAttribute("data-clear", st.mat === "PC" || st.mat === "PET");
  else document.documentElement.removeAttribute("data-clear");
  if (marked >= 0) {
    const [x, y] = iso(PARTS[marked].at, P);
    el.mark.innerHTML = '<circle class="dr-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="dr-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
  readout();
}

// ------------------------------------------------ loop
let frame = 0, lastT = 0, visible = false;
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 30) : 1 / 60;
  lastT = now;
  const target = levelOf();
  if (still.matches) level = target;
  else level += (target - level) * (1 - Math.exp(-dt * 5));
  if (!still.matches && clock.playing) {
    clock.drop += dt * 0.35;
    clock.t += dt;
  }
  draw();
  const moving = Math.abs(target - level) > 0.01;
  frame = visible && !still.matches && (clock.playing || moving) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { lastT = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) { level = levelOf(); draw(); } else run(); };

// ------------------------------------------------ controls
const $ = (sel) => document.querySelector(sel);
const rows = [...document.querySelectorAll(".dr-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const pickBtns = [...document.querySelectorAll("[data-pick]")];
const stepBtns = [...document.querySelectorAll("[data-row='vals'] [data-step]")];
const fill = $("[data-row='fill'] .dr-range");
const fMinus = $("[data-row='fill'] [data-step='-']");
const fPlus = $("[data-row='fill'] [data-step='+']");
const rg = $("[data-row='regrind'] .dr-range");
const gMinus = $("[data-row='regrind'] [data-step='-']");
const gPlus = $("[data-row='regrind'] [data-step='+']");
function valueText(key) { return key === "T" ? st.T + " °C" : key === "dp" ? (st.dp < 0 ? "−" : "") + Math.abs(st.dp) + " °C" : st.kg + " kg"; }
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  pickBtns.forEach((b) => { const on = b.dataset.pick === st.sel; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; b.querySelector("b").textContent = valueText(b.dataset.pick); });
  const list = LISTS[st.sel];
  const i = list.findIndex((v) => v === st[st.sel]);
  stepBtns.forEach((b) => (b.disabled = !mat().dry || (b.dataset.step === "-" ? i <= 0 : i >= list.length - 1)));
  fill.value = String(st.kg); fill.setAttribute("aria-valuetext", st.kg + " kg");
  fMinus.disabled = st.kg <= 5; fPlus.disabled = st.kg >= HOPPER;
  rg.value = String(st.regrind); rg.setAttribute("aria-valuetext", st.regrind + " %");
  gMinus.disabled = st.regrind <= 0; gPlus.disabled = st.regrind >= 40;
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }
function changed() { sync(); draw(); announce(); kick(); }
radios.forEach((b) => b.addEventListener("click", () => {
  const [, val] = b.dataset.set.split(":");
  st.mat = val;
  st.T = MATS[val].T0 ?? 80;
  if (LVL === 3 && st.kg % 2) st.kg += 1;
  changed();
}));
document.querySelectorAll("[role='radiogroup']").forEach((group) => {
  group.addEventListener("keydown", (event) => {
    const items = [...group.querySelectorAll('[role="radio"]')];
    const i = items.findIndex((b) => b.getAttribute("aria-checked") === "true");
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % items.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + items.length - 1) % items.length;
    if (next < 0) return;
    event.preventDefault();
    items[next].click();
    items[next].focus();
  });
});
pickBtns.forEach((b) => b.addEventListener("click", () => { st.sel = b.dataset.pick; changed(); }));
function stepValue(dir) {
  if (!mat().dry) return;
  const list = LISTS[st.sel];
  let i = list.findIndex((v) => v === st[st.sel]);
  if (i < 0) i = 0;
  st[st.sel] = list[clamp(i + dir, 0, list.length - 1)];
  changed();
}
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
fill.addEventListener("input", () => { st.kg = Number(fill.value); changed(); });
fMinus.addEventListener("click", () => { st.kg = Math.max(5, st.kg - 1); changed(); });
fPlus.addEventListener("click", () => { st.kg = Math.min(HOPPER, st.kg + 1); changed(); });
rg.addEventListener("input", () => { st.regrind = Number(rg.value); changed(); });
gMinus.addEventListener("click", () => { st.regrind = Math.max(0, st.regrind - 5); changed(); });
gPlus.addEventListener("click", () => { st.regrind = Math.min(40, st.regrind + 5); changed(); });

// tap the drawing: at levels 1 and 2 name the nearest part, at 3 and 4 pause
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [pt.x, pt.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 40;
  PARTS.forEach((p, i) => {
    const [px, py] = iso(p.at, P);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
function togglePlay() {
  if (still.matches) return;
  clock.playing = !clock.playing;
  if (clock.playing) run(); else draw();
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) { togglePlay(); return; }
  marked = nearestPart(toView(event));
  draw(); announce(); kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL <= 2 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = (marked + 1) % PARTS.length; draw(); announce(); kick(); }
  else if (LVL <= 2 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = (marked + PARTS.length - 1) % PARTS.length; draw(); announce(); kick(); }
  else if (LVL === 3 && event.key === "ArrowUp") stepValue(1);
  else if (LVL === 3 && event.key === "ArrowDown") stepValue(-1);
  else if (LVL === 3 && ["1", "2", "3"].includes(event.key)) { st.sel = ["T", "dp", "kg"][Number(event.key) - 1]; changed(); }
  else if (event.key === " " || event.key === "Enter") togglePlay();
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) tick(performance.now()); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { cancelAnimationFrame(frame); frame = 0; tick(performance.now()); } else { clock.playing = true; run(); } });
level = levelOf();
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Droogtrechter en droger",
    hint1: "Tik een onderdeel · kies kunststof en vulling",
    hint2: "Tik een onderdeel · kies de kunststof",
    hint3: "Kies T, dauwpunt of kg, dan − of + · tik: pauze",
    hint4: "Kies kunststof en % maalgoed · tik: pauze",
    mats: "Kunststof",
    fill: "Vulling van de trechter in kg, 5 tot 50",
    regrind: "Maalgoed in procent, 0 tot 40",
    vals: "Waarde",
    minus: "Lager",
    plus: "Hoger",
    label: LABEL_NL,
    aria: "Droogtrechter op een spuitgietmachine met een droogmiddeldroger. Niveau 1 en 2: pijltjes kiezen een onderdeel. Niveau 3: toetsen 1 tot 3 kiezen temperatuur, dauwpunt of vulling, pijl omhoog en omlaag veranderen de waarde. Spatie pauzeert.",
  },
  en: {
    title: "Dryer hopper and dryer",
    hint1: "Tap a part · pick material and fill",
    hint2: "Tap a part · pick the material",
    hint3: "Pick T, dew point or kg, then − or + · tap: pause",
    hint4: "Pick material and % regrind · tap: pause",
    mats: "Material",
    fill: "Hopper fill in kg, 5 to 50",
    regrind: "Regrind in percent, 0 to 40",
    vals: "Value",
    minus: "Lower",
    plus: "Higher",
    label: LABEL_EN,
    aria: "Drying hopper on an injection moulding machine with a desiccant dryer. Levels 1 and 2: arrows pick a part. Level 3: keys 1 to 3 pick temperature, dew point or fill, up and down change the value. Space pauses.",
  },
};

const sN = STRINGS.nl;
const radio = (set, text) => `<button type="button" class="dr-btn" role="radio" data-set="${set}" aria-checked="false" tabindex="-1">${text}</button>`;
const valBtn = (key, labelHtml) => `<button type="button" class="dr-btn" role="radio" data-pick="${key}" aria-checked="${key === "T"}" tabindex="${key === "T" ? 0 : -1}">${labelHtml}&nbsp;<b></b></button>`;
const slider = (row, levels, min, max, step, value, label) => `<div class="dr-row" data-row="${row}" data-levels="${levels}"><button type="button" class="dr-btn" data-step="-" aria-label="${sN.minus}" data-t-label="minus">−</button><input class="dr-range" type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${sN[label]}" data-t-label="${label}"><button type="button" class="dr-btn" data-step="+" aria-label="${sN.plus}" data-t-label="plus">+</button></div>`;
const controls = [
  `<div class="dr-controls">`,
  `<div class="dr-row" data-row="mat" data-levels="1,2,3,4" role="radiogroup" aria-label="${sN.mats}" data-t-label="mats">${Object.keys(MATS).map((m) => radio("mat:" + m, m)).join("")}</div>`,
  slider("fill", "1", 5, HOPPER, 1, 50, "fill"),
  `<div class="dr-row" data-row="vals" data-levels="3"><div class="dr-group" role="radiogroup" aria-label="${sN.vals}" data-t-label="vals">${valBtn("T", "<i>T</i>")}${valBtn("dp", "<i>Td</i>")}${valBtn("kg", "<i>m</i>")}</div><button type="button" class="dr-btn" data-step="-" aria-label="${sN.minus}" data-t-label="minus">−</button><button type="button" class="dr-btn" data-step="+" aria-label="${sN.plus}" data-t-label="plus">+</button></div>`,
  slider("regrind", "4", 0, 40, 5, 20, "regrind"),
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="dr-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="dr-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="dr-line"></span>'.repeat(5)}</span>`)
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
document.querySelectorAll("[data-t-label]").forEach(function(n){n.setAttribute("aria-label",s[n.getAttribute("data-t-label")]);});
var st=document.querySelector(".dr-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
const show = (m, T, dp, t) => moistureOf(MATS[m], T, dp, t).toFixed(4);
console.log(`model: PA6 50 kg ${show("PA6", 80, -40, HOPPER / THROUGHPUT)} % · PA6 20 kg ${show("PA6", 80, -40, 20 / THROUGHPUT)} % · PC 3 h −40 ${show("PC", 120, -40, 3)} % · PC 3 h −15 ${show("PC", 120, -15, 3)} % · PET 4 h ${show("PET", 160, -40, 4)} % · ABS 3 h ${show("ABS", 80, -40, 3)} %`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P);
