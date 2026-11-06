// Dev tool, not shipped. Builds the standalone figure for the lesson
// "Design of experiments in plain words" (module Improve, eng.improve.doe).
//
//   node figures/eng.improve.doe/build.mjs            build the page
//   node figures/eng.improve.doe/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.improve.doe.html: one offline page
// with the anatomy kit and the live script inlined. The page reads
// ?theme=light|dark and ?lang=nl|en from its URL (defaults:
// prefers-color-scheme, Dutch).
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
const OUT = join(ROOT, "src/content/courses/figures/eng.improve.doe.html");

// ---------------------------------------------------------------- the model
// The lesson's 2×2 on a moulding press, scrap per run of 500 parts.
// Factor T = mould temperature, factor p = hold pressure, each low (L) or
// high (H). Cell keys are T then p: "HL" is high temperature, low pressure.
//   main effect T = mean(HL, HH) − mean(LL, LH)
//   main effect p = mean(LH, HH) − mean(LL, HL)
//   interaction   = ((HH − LH) − (HL − LL)) / 2 = (LL + HH − HL − LH) / 2
// One factor at a time from low/low tests LL, HL and LH and never HH.
const N = 500;
const Y = { LL: 8, HL: 9, LH: 7, HH: 2 };
const mean = (a, b) => (a + b) / 2;
const EFF_T = mean(Y.HL, Y.HH) - mean(Y.LL, Y.LH);
const EFF_P = mean(Y.LH, Y.HH) - mean(Y.LL, Y.HL);
const EFF_TP = (Y.LL + Y.HH - Y.HL - Y.LH) / 2;
const RANDOM_ORDER = ["HL", "LL", "HH", "LH"]; // the 2×2 in a randomised run order
const OFAT_ORDER = ["LL", "HL", "LH"];
{
  // the lesson's numbers (EN and NL) and its worked answer
  const en = (await import(pathToFileURL(join(ROOT, "src/content/courses/eng/improve.en.js")).href)).default;
  const nl = (await import(pathToFileURL(join(ROOT, "src/content/courses/eng/improve.nl.js")).href)).default;
  const lesson = (m) => m.lessons.find((l) => l.id === "eng.improve.doe");
  const ex = lesson(en).example;
  const want = [
    [/run of 500 parts/, "500 parts"],
    [/Low temperature, low pressure: 8%/, "LL 8"],
    [/High temperature, low pressure: 9%/, "HL 9"],
    [/Low temperature, high pressure: 7%/, "LH 7"],
    [/High temperature, high pressure: 2%/, "HH 2"],
    [/starting from low\/low/, "OFAT from low/low"],
    [/best is 7%/, "OFAT best 7"],
  ];
  for (const [re, what] of want) if (!re.test(ex.text)) throw new Error(`lesson text changed: ${what}`);
  if (!/−2 points/.test(ex.reveal) || !/−4 points/.test(ex.reveal) || !/adds 1 point/.test(ex.reveal) || !/removes 5/.test(ex.reveal)) throw new Error("lesson reveal changed");
  const nlText = lesson(nl).example.text;
  for (const s of ["500 delen", "lage druk: 8%", "lage druk: 9%", "hoge druk: 7%", "hoge druk: 2%", "het beste is 7%"]) if (!nlText.includes(s)) throw new Error(`NL lesson text changed: ${s}`);
  if (EFF_T !== -2 || EFF_P !== -4) throw new Error("main effects do not match the lesson");
  if (Y.HL - Y.LL !== 1 || Y.HH - Y.LH !== -5 || EFF_TP !== -3) throw new Error("interaction does not match the lesson");
  if (Math.min(...OFAT_ORDER.map((c) => Y[c])) !== 7) throw new Error("one-at-a-time best is not 7 %");
  for (const c of Object.keys(Y)) if (!Number.isInteger((Y[c] / 100) * N)) throw new Error("scrap count is not whole");
}

// ---------------------------------------------------------------- the world
// World units are centimetres, z up, +x to the right, +y toward the viewer.
// In a row along x: a C-frame press, its chute and two bins, and the control
// cabinet. The plinth top is z = 0.
const WIDTH = 600;
const FLOOR = -4;
const PLINTH = { x: -77, y: -20, w: 132, d: 38, r: 1.5 };
// press
const BED = { x: -73, y: -14, w: 40, d: 26, r: 1 };
const BED_Z = 14;
const BOLSTER = { x: -69, y: -10, w: 32, d: 20, r: 0.6 };
const BOL_Z = BED_Z + 3;
const DIE = { x: -61, y: -6, w: 16, d: 12, r: 0.6 };
const DIE_H = 5;
const CX = DIE.x + DIE.w / 2; // −53, the ram axis
const CY = DIE.y + DIE.d / 2; // 0
const COLUMN = { x: -71, y: -14, w: 24, d: 4, r: 0 };
const ARM = { x: -73, y: -14, w: 28, d: 24, r: 1 };
const ARM_Z = [46, 55];
const STROKE = 8;
const GAUGE = { x: -66.5, z: 50.5, r: 2.9 };
// chute and bins
const CHUTE = { x: -33, y: -4, w: 12, d: 8, r: 0.4 };
const CHUTE_Z = [9.5, 11.5];
const TOTE = { x: -19, y: -15, w: 15, d: 14, r: 0.8 };
const SCRAP = { x: -19, y: 0.5, w: 15, d: 13, r: 0.8 };
const BIN_H = 9;
// cabinet
const CAB = { x: 2, y: -14, w: 48, d: 12, r: 1 };
const CAB_Z = [2, 58];
const FACE_Y = CAB.y + CAB.d; // −2
const WIN = { x0: 5.5, x1: 46.5, z0: 25, z1: 54.5, r: 1.4, depth: 0.8 };
const GRID = { u0: 14, u1: 45, z0: 30.5, z1: 53, gap: 1 };
const KNOBS = { T: [14, 15], p: [38, 15] };
const KNOB_R = 4.2;
const KNOB_D = 2.6;
const LAMP = [26, 17.5];

const FIT = [
  ...k.boxCorners(PLINTH, FLOOR, 0),
  ...k.boxCorners(ARM, ARM_Z[0], ARM_Z[1] + 14),
  ...k.boxCorners(CAB, CAB_Z[0], CAB_Z[1] + 2),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 70);
const ELEVATION = Number(process.env.EL ?? 22);
const P0 = k.fitProjection(FIT, WIDTH, 2000, { pad: PAD, azimuth: AZIMUTH, elevation: ELEVATION });
const FIT_Y = FIT.map((point) => k.iso(point, P0)[1]);
const HEIGHT = Math.round(Math.max(...FIT_Y) - Math.min(...FIT_Y) + 2 * PAD);
const P = { ...P0, origin: [P0.origin[0], P0.origin[1] - Math.min(...FIT_Y) + PAD] };
const KS = G.scaleOf(P);

const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y_ = [0, 1, 0];
const Zv = [0, 0, 1];
const frameY = (o) => G.frameOf(o, Y_, X, Zv);
const frameZ = (o) => G.frameOf(o, Zv, X, Y_);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, "left");
const sideOf = (x) => k.sideMatrix([x, 0], 0, P, "right"); // face coordinates (−y, −z)
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const f2 = (v) => +v.toFixed(2);

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
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}

// A recess in the face y = const: inner walls shaded by facing, a back plane
// holding `back`, clipped to the opening (after the maintenance figure).
let clips = 0;
function recess({ x0, x1, z0, z1, r, depth }, y, back = "", backClass = "dx-glass") {
  const id = `dx-clip-${clips++}`;
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

// An open-top bin: the rim, the inner walls, the floor, and the parts that lie
// on it, all clipped to the opening.
function binTop(plan, z, name) {
  const id = `dx-clip-${clips++}`;
  const open = k.insetPlan(plan, 1.1);
  const rim = k.planOutline(open, z, P, 3);
  const floor = k.planOutline(k.insetPlan(plan, 1.1), 1.4, P, 3);
  return [
    `<clipPath id="${id}"><path d="${rim}"/></clipPath>`,
    `<path class="dx-well" d="${rim}"/>`,
    `<g clip-path="url(#${id})"><path class="dx-floor" d="${floor}"/><g class="dx-parts" data-bin="${name}"></g></g>`,
    L(rim, { tone: "lo" }),
  ].join("");
}

// ---------------------------------------------------------------- plinth
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -2), FLOOR, 2, P)}"/>`];
{
  const anchors = k.corners(PLINTH, 4.5);
  const extra =
    L(k.planOutline(k.insetPlan(PLINTH, 2.6), 0, P, 3), { tone: "faint" }) +
    L(anchors.map(([x, y]) => k.ring(x, y, 1.4, 0, P, 14)).join(""), { tone: "lo" }) +
    Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 });
  box("stand.plinth", PLINTH, FLOOR, 0, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLINTH, -1.8, P, 3), { tone: "faint" }), extra });
}

// ---------------------------------------------------------------- the press
{
  // the cast bed: an access door and a label plate on the front
  const fy = BED.y + BED.d;
  const plate = [
    `<g transform="${planeOf(fy)}">`,
    `<path class="dx-card" d="${flatRect(-46, 6.5, -37, 11, 0.4, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M-44.8 -9.6H-38.4M-44.8 -8.4H-40.4M-44.8 -7.2H-39.2"/>`,
    `</g>`,
  ].join("");
  const door = flatRect(-70.5, 2, -58.5, 11.5, 0.6, 3);
  const extra =
    `<g transform="${planeOf(fy)}">${L(door, { tone: "lo" })}${L(flatRect(-60.8, 5.8, -60, 7.8, 0.4, 3), { tone: "mid" })}</g>` +
    plate +
    Dt([[-69.6, fy, 10.6], [-69.6, fy, 2.9], [-59.4, fy, 10.6], [-59.4, fy, 2.9], [-45.3, fy, 10.3], [-37.7, fy, 10.3], [-45.3, fy, 7.2], [-37.7, fy, 7.2]].map(at), { size: 0.4 }) +
    L(k.planOutline(k.insetPlan(BED, 1.6), BED_Z, P, 3), { tone: "faint" });
  box("press.bed", BED, 0, BED_Z, { tone: "mid" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(BED, 1.4, P, 3), { tone: "faint" }), extra });
  // bolster with T-slots running to its edges
  const slots = [-5.5, 0, 5.5].map((y) => k.segment([BOLSTER.x, y, BOL_Z], [BOLSTER.x + BOLSTER.w, y, BOL_Z], P)).join("");
  box("press.bolster", BOLSTER, BED_Z, BOL_Z, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: L(slots, { tone: "lo" }) });
  // lower half of the mould with its cavity, guide pins and parting line
  const cavity = { x: CX - 3.5, y: CY - 2.6, w: 7, d: 5.2, r: 1.2 };
  box("press.die-lo", DIE, BOL_Z, BOL_Z + DIE_H, { tone: "hi" }, {
    steps: 2,
    bevel: 0.3,
    inner: L(k.sideSeam(DIE, BOL_Z + DIE_H / 2, P, 2), { tone: "lo" }),
    extra: `<path class="dx-well" d="${k.planOutline(cavity, BOL_Z + DIE_H, P, 4)}"/>` + L(k.planOutline(cavity, BOL_Z + DIE_H, P, 4), { tone: "lo" }),
  });
  for (const [x, y] of [[DIE.x + 1.8, DIE.y + 1.8], [DIE.x + DIE.w - 1.8, DIE.y + DIE.d - 1.8]]) post("press.pin", x, y, 0.75, BOL_Z + DIE_H, BOL_Z + DIE_H + 2.4, { tone: "hi", crease: "none" }, { steps: 14, owner: "mould" });
  // the C-frame: column, arm, and the hydraulic cylinder on top
  box("press.column", COLUMN, BED_Z, ARM_Z[0], { tone: "mid" }, {
    steps: 2,
    bevel: 0.4,
    inner: L([24, 32, 40].map((z) => k.pathOf([[COLUMN.x, COLUMN.y + COLUMN.d, z], [COLUMN.x + COLUMN.w, COLUMN.y + COLUMN.d, z], [COLUMN.x + COLUMN.w, COLUMN.y, z]].map(at))).join(""), { tone: "faint" }),
  });
  const ay = ARM.y + ARM.d;
  box("press.arm", ARM, ARM_Z[0], ARM_Z[1], { tone: "mid" }, {
    steps: 3,
    bevel: 0.5,
    inner: L(k.sideSeam(ARM, ARM_Z[0] + 1.6, P, 3), { tone: "faint" }),
    extra: Dt([[-60.5, ay, 53.4], [-46.4, ay, 53.4], [-60.5, ay, 48.8], [-46.4, ay, 48.8]].map(at), { size: 0.4 }),
  });
  const FC = frameZ([CX, CY, ARM_Z[1]]);
  discAt("press.cyl-flange", FC, 0, 1.4, 7.6, { tone: "mid" }, { extra: Dt(G.dotsOf(FC, 1.4, 6.6, 8, P, { fade: [0.0, 0.3], all: true }), { size: 0.42 }) });
  discAt("press.cyl", FC, 1.4, 11.6, 5.8, { tone: "hi", crease: "lo" }, { inner: L(G.arcOf(FC, 6, 5.8, P), { tone: "faint" }) });
  discAt("press.cyl-cap", FC, 11.6, 13.4, 6.4, { tone: "mid" }, { extra: Dt(G.dotsOf(FC, 13.4, 5, 6, P, { fade: [0.0, 0.3], all: true }), { size: 0.42 }) });
  // two hydraulic ports on the cylinder cap
  post("press.port", CX - 2.6, CY + 2.2, 1.2, ARM_Z[1] + 13.4, ARM_Z[1] + 15, { tone: "mid" }, { steps: 6 });
  post("press.port", CX + 2.6, CY - 2.2, 1.2, ARM_Z[1] + 13.4, ARM_Z[1] + 15, { tone: "mid" }, { steps: 6 });
  // the hold-pressure gauge on the arm's front face
  const { x: gx, z: gz, r: gr } = GAUGE;
  const FG = frameY([gx, ay, gz]);
  discAt("press.gauge-body", FG, 0, 1.1, gr + 0.6, { tone: "mid" }, {});
  const ticks = [];
  for (let i = 0; i <= 8; i++) {
    const a = (-135 + (i * 270) / 8) * (Math.PI / 180);
    const r0 = i % 4 === 0 ? gr - 1.1 : gr - 0.7;
    ticks.push(`M${f2(gx + r0 * Math.sin(a))} ${f2(-gz - r0 * Math.cos(a))}L${f2(gx + (gr - 0.15) * Math.sin(a))} ${f2(-gz - (gr - 0.15) * Math.cos(a))}`);
  }
  discAt("press.gauge", FG, 1.1, 1.6, gr, { tone: "hi" }, {
    extra: `<g transform="${planeOf(ay + 1.6)}">${L(ticks.join(""), { tone: "lo" })}<path class="iso-line dx-needle" data-tone="hi" data-free="end" data-gauge="" d="M${gx} ${-gz}L${gx - 1.5} ${-gz + 1.5}"/><circle class="dx-hub" cx="${gx}" cy="${-gz}" r="0.5"/></g>`,
  });
}
// the ram: rod, platen and the upper half of the mould, recorded closed
const RAM = { x: -63, y: -7.5, w: 20, d: 15, r: 0.6 };
const RAM_Z = [BOL_Z + DIE_H * 2, BOL_Z + DIE_H * 2 + 5];
{
  const ramAttr = ' data-ram=""';
  box("press.die-hi", DIE, BOL_Z + DIE_H, BOL_Z + DIE_H * 2, { tone: "hi" }, {
    owner: "mould",
    steps: 2,
    bevel: 0.3,
    attrs: ramAttr,
    inner: L(k.sideSeam(DIE, BOL_Z + DIE_H * 1.5, P, 2), { tone: "lo" }),
  });
  box("press.ram", RAM, RAM_Z[0], RAM_Z[1], { tone: "mid" }, {
    steps: 2,
    bevel: 0.4,
    attrs: ramAttr,
    extra: Dt([[RAM.x + 1.5, RAM.y + RAM.d, RAM_Z[1] - 1.3], [RAM.x + RAM.w - 1.5, RAM.y + RAM.d, RAM_Z[1] - 1.3]].map(at), { size: 0.42 }),
  });
  post("press.rod", CX, CY, 2.4, RAM_Z[1], ARM_Z[0], { tone: "hi", crease: "lo" }, { steps: 28, attrs: ramAttr });
}
// chute off the bed's right side on two brackets, with side rails
{
  const bx = BED.x + BED.w;
  box("chute.bracket", { x: bx, y: CHUTE.y + 0.6, w: 7, d: 1.6, r: 0.3 }, CHUTE_Z[0] - 3, CHUTE_Z[0], { tone: "lo" }, { steps: 2 });
  box("chute.bracket", { x: bx, y: CHUTE.y + CHUTE.d - 2.2, w: 7, d: 1.6, r: 0.3 }, CHUTE_Z[0] - 3, CHUTE_Z[0], { tone: "lo" }, { steps: 2 });
  box("chute.bed", CHUTE, CHUTE_Z[0], CHUTE_Z[1], { tone: "mid" }, {
    steps: 2,
    bevel: 0.2,
    extra: L([CHUTE.y + 2.7, CHUTE.y + 5.3].map((y) => k.segment([CHUTE.x, y, CHUTE_Z[1]], [CHUTE.x + CHUTE.w, y, CHUTE_Z[1]], P)).join(""), { tone: "faint" }),
  });
  box("chute.rail", { x: CHUTE.x, y: CHUTE.y, w: CHUTE.w, d: 1.1, r: 0.3 }, CHUTE_Z[1], CHUTE_Z[1] + 1.8, { tone: "mid" }, { steps: 2 });
  box("chute.rail", { x: CHUTE.x, y: CHUTE.y + CHUTE.d - 1.1, w: CHUTE.w, d: 1.1, r: 0.3 }, CHUTE_Z[1], CHUTE_Z[1] + 1.8, { tone: "mid" }, { steps: 2 });
}
// the good-parts tote behind, the scrap bin in front with its counter
{
  box("bin.tote", TOTE, 0, BIN_H, { tone: "mid" }, {
    steps: 3,
    bevel: 0.4,
    inner: L(k.sideSeam(TOTE, BIN_H - 1.8, P, 3), { tone: "faint" }),
    extra: binTop(TOTE, BIN_H, "good"),
  });
  const sy = SCRAP.y + SCRAP.d;
  box("bin.scrap", SCRAP, 0, BIN_H, { tone: "mid" }, {
    steps: 3,
    bevel: 0.4,
    inner: L(k.sideSeam(SCRAP, BIN_H - 1.8, P, 3), { tone: "faint" }),
    extra: binTop(SCRAP, BIN_H, "scrap"),
  });
  // mechanical counter on the scrap bin's front: a window with three digits
  const CTR = { x: SCRAP.x + 2, y: sy, w: 11, d: 2, r: 0.4 };
  const cy = CTR.y + CTR.d;
  const win = { x0: CTR.x + 1.1, x1: CTR.x + CTR.w - 1.1, z0: 2.9, z1: 6.7, r: 0.5, depth: 0.5 };
  const digits = `<text class="dx-digits" data-count="" x="${f2((win.x0 + win.x1) / 2)}" y="${f2(-(win.z0 + 0.95))}" text-anchor="middle" font-size="3.1">000</text>`;
  box("bin.counter", CTR, 1.6, 7.8, { tone: "mid" }, {
    steps: 2,
    bevel: 0.3,
    extra: recess(win, cy, digits, "dx-lcd") + Dt([[CTR.x + 0.6, cy, 7.2], [CTR.x + CTR.w - 0.6, cy, 7.2]].map(at), { size: 0.36 }),
  });
}

// ---------------------------------------------------------------- the controller cabinet
// grid cells on the screen, in face coordinates (u = x, v = −z)
const CELLS = {};
{
  const { u0, u1, z0, z1, gap } = GRID;
  const cw = (u1 - u0 - gap) / 2;
  const ch = (z1 - z0 - gap) / 2;
  for (const t of ["L", "H"]) for (const p of ["L", "H"]) {
    const x0 = u0 + (t === "H" ? cw + gap : 0);
    const zb = z0 + (p === "H" ? ch + gap : 0);
    CELLS[t + p] = { x0: f2(x0), x1: f2(x0 + cw), z0: f2(zb), z1: f2(zb + ch) };
  }
}
{
  const foot = { x: CAB.x - 1.5, y: CAB.y - 1.5, w: CAB.w + 3, d: CAB.d + 3, r: 0.8 };
  box("cab.plinth", foot, 0, CAB_Z[0], { tone: "lo" }, { steps: 2, bevel: 0.3, extra: Dt(k.corners(foot, 1.4).map(([x, y]) => at([x, y, CAB_Z[0]])), { size: 0.42 }) });
  const fy = FACE_Y;
  // screen: the 2×2 grid with axis marks; live cells
  const cellSvg = Object.entries(CELLS).map(([key, c]) => {
    const r = flatRect(c.x0, c.z0, c.x1, c.z1, 0.5, 3);
    return `<g data-cell="${key}"><path class="dx-cell" d="${r}"/><path class="dx-bar" data-bar="" d=""/><path class="dx-cell-line" d="${r}"/><text class="dx-num" data-num="" x="${f2((c.x0 + c.x1) / 2)}" y="${f2(-(c.z0 + c.z1) / 2 + 1.7)}" text-anchor="middle" font-size="4.8"></text></g>`;
  }).join("");
  const lab = (x, z, s) => `<text class="dx-axis" x="${f2(x)}" y="${f2(-z)}" text-anchor="middle" font-size="2.7">${s}</text>`;
  const cl = CELLS.LL, ch = CELLS.HH;
  const axes = [
    lab((cl.x0 + cl.x1) / 2, 26.6, "T−"),
    lab((ch.x0 + ch.x1) / 2, 26.6, "T+"),
    lab(9.6, (cl.z0 + cl.z1) / 2 - 1, "p−"),
    lab(9.6, (ch.z0 + ch.z1) / 2 - 1, "p+"),
    `<path class="iso-line" data-tone="faint" d="M${GRID.u0 - 1.4} ${-WIN.z0}V${-WIN.z1}"/>`,
    `<path class="iso-line" data-tone="faint" d="M${WIN.x0} ${-(GRID.z0 - 1.4)}H${WIN.x1}"/>`,
  ].join("");
  const screen = axes + cellSvg + `<path class="dx-path" data-ofat="" d="" style="opacity:0"/>`;
  // knobs: low and high marks on the face around each knob
  const tick = (x, z, deg, r0, r1) => {
    const a = (deg * Math.PI) / 180;
    return `M${f2(x + r0 * Math.sin(a))} ${f2(-z - r0 * Math.cos(a))}L${f2(x + r1 * Math.sin(a))} ${f2(-z - r1 * Math.cos(a))}`;
  };
  const marks = Object.values(KNOBS).map(([x, z]) => tick(x, z, -50, KNOB_R + 2.4, KNOB_R + 0.6) + tick(x, z, 50, KNOB_R + 2.4, KNOB_R + 0.6)).join("");
  const markDots = Object.values(KNOBS).flatMap(([x, z]) => [-50, 50].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return at([x + (KNOB_R + 2.4) * Math.sin(a), fy, z + (KNOB_R + 2.4) * Math.cos(a)]);
  }));
  const faceBits = [
    recess(WIN, fy, screen),
    `<g transform="${planeOf(fy)}">`,
    L(marks, { tone: "lo" }),
    `<text class="dx-engrave" x="${KNOBS.T[0]}" y="${-(KNOBS.T[1] - KNOB_R - 3.6)}" text-anchor="middle" font-size="2.8">T</text>`,
    `<text class="dx-engrave" x="${KNOBS.p[0]}" y="${-(KNOBS.p[1] - KNOB_R - 3.6)}" text-anchor="middle" font-size="2.8">p</text>`,
    `<path class="dx-card" d="${flatRect(22.5, 9.5, 29.5, 13, 0.3, 3)}"/>`,
    `<path class="iso-line" data-tone="lo" data-free="" d="M23.3 -11.9H28.6M23.3 -10.7H26.8"/>`,
    // the door seam round the lower panel and its handle
    L(flatRect(4, 4, 48, 22.5, 0.8, 3), { tone: "lo" }),
    L(flatRect(45.6, 12.2, 46.4, 14.4, 0.4, 3), { tone: "mid" }),
    `</g>`,
    Dt(markDots, { size: 0.42, tone: "mid" }),
    Dt([[CAB.x + 1.4, fy, CAB_Z[1] - 1.4], [CAB.x + CAB.w - 1.4, fy, CAB_Z[1] - 1.4], [CAB.x + 1.4, fy, 23.6], [CAB.x + CAB.w - 1.4, fy, 23.6]].map(at), { size: 0.42 }),
  ].join("");
  // vents on the right side face (x = const; face u = −y)
  const sx = CAB.x + CAB.w;
  const side = `<g transform="${sideOf(sx)}">${L([40, 43, 46, 49].map((z) => flatRect(4, z, 12, z + 1.2, 0.55, 3)).join(""), { tone: "lo" })}${L([6, 9, 12].map((z) => flatRect(4, z, 12, z + 1.2, 0.55, 3)).join(""), { tone: "lo" })}</g>`;
  box("cab.body", CAB, CAB_Z[0], CAB_Z[1], { tone: "mid" }, { steps: 2, bevel: 0.6, extra: faceBits + side });
  const hood = { x: CAB.x - 1, y: CAB.y - 0.6, w: CAB.w + 2, d: CAB.d + 2.2, r: 0.8 };
  box("cab.hood", hood, CAB_Z[1], CAB_Z[1] + 1.5, { tone: "mid" }, { steps: 2, bevel: 0.3 });
  // the two setting knobs: skirt, knurled cap and a pointer line on the face
  for (const [name, [x, z]] of Object.entries(KNOBS)) {
    const F = frameY([x, fy, z]);
    discAt(`cab.skirt-${name}`, F, 0, 0.8, KNOB_R + 0.5, { tone: "mid" }, {});
    const ribs = G.ribsOf(F, 0.8, KNOB_D, KNOB_R, 28, P, { fade: [0.04, 0.42], seams: "first" });
    discAt(`cab.knob-${name}`, F, 0.8, KNOB_D, KNOB_R, { tone: "hi", crease: "lo" }, {
      inner: k.fadedSvg(ribs, { tone: "lo" }),
      extra: `<g transform="${planeOf(fy + KNOB_D)}"><path class="iso-line dx-pointer" data-tone="hi" data-free="end" data-knob="${name}" d="M${x} ${-z}L${x} ${-z - KNOB_R + 0.9}"/><circle class="dx-hub" cx="${x}" cy="${-z}" r="0.5"/></g>`,
    });
  }
  // run lamp between the knobs
  const FL = frameY([LAMP[0], fy, LAMP[1]]);
  discAt("cab.lamp-ring", FL, 0, 0.6, 1.8, { tone: "mid" }, {});
  discAt("cab.lamp", FL, 0.6, 1.3, 1.2, { tone: "hi", crease: "none" }, { attrs: ' data-lamp=""' });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups, `<g data-flying=""></g>`];

const LABEL_NL =
  "Een spuitgietpers met C-frame: een gegoten bed met opspanplaat, een matrijs in twee helften, een stoter aan een hydraulische cilinder en een manometer voor de nadruk. Uit de matrijs glijden delen over een goot naar een bak voor goede delen en een uitvalbak met teller. Rechts staat een besturingskast met twee knoppen, temperatuur T en nadruk p, elk laag of hoog, en een scherm met een 2×2-raster. Elke run maakt 500 delen; de uitval per instelling is 8 % (laag, laag), 9 % (T hoog), 7 % (p hoog) en 2 % (beide hoog).";
const LABEL_EN =
  "A C-frame moulding press: a cast bed with a bolster, a two-part mould, a ram on a hydraulic cylinder and a gauge for the hold pressure. Parts slide down a chute into a tote for good parts and a scrap bin with a counter. On the right a control cabinet carries two knobs, temperature T and hold pressure p, each low or high, and a screen with a 2×2 grid. Each run makes 500 parts; the scrap per setting is 8 % (both low), 9 % (T high), 7 % (p high) and 2 % (both high).";

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
  --dx-hair:rgba(240,233,218,.12);--dx-accent:#5C9FAE;--dx-glass:#0A1E23;--dx-well:#081A1E;--dx-floor:#0F272D;--dx-cell:#0F2A30;--dx-bar:#45615D;--dx-part:#9FB3A6;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --dx-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#E2ECEA;--anatomy-lit-shade:#CCDCDB;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --dx-hair:rgba(11,41,27,.14);--dx-accent:#276F81;--dx-glass:#E2ECEA;--dx-well:#D6CDB7;--dx-floor:#E4DCC9;--dx-cell:#F4F7F4;--dx-bar:#A9AE9E;--dx-part:#5A6B60;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--dx-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + 182px);min-height:240px;padding:26px 4px 150px;border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--dx-hair);display:flex;flex-direction:column;justify-content:center}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--dx-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:80px!important;max-width:40%;color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="readout"]{bottom:80px!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:right;color:var(--anatomy-text);letter-spacing:0}
.dx-line{display:block;white-space:pre}
.dx-acc{color:var(--dx-accent);font-weight:600}
.dx-mute{color:var(--anatomy-muted)}
.dx-verdict{position:absolute;left:0;right:0;bottom:0;font-family:var(--dx-sans);font-size:10px;line-height:1.3;color:var(--anatomy-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dx-verdict b{color:var(--dx-accent);font-weight:600}
.dx-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;-webkit-tap-highlight-color:transparent;border-radius:8px}
.dx-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.dx-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.dx-controls{position:absolute;left:10px;right:10px;bottom:24px;height:44px;display:flex;align-items:center;gap:5px}
.dx-btn{min-width:44px;min-height:44px;height:44px;padding:0 7px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--dx-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--dx-hair);display:inline-flex;align-items:center;justify-content:center;gap:3px;white-space:nowrap}
.dx-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.dx-btn small{font-size:10px;color:var(--anatomy-muted);font-weight:400}
.dx-btn[aria-checked="true"],.dx-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--dx-accent);color:var(--dx-accent);font-weight:600}
.dx-btn[aria-checked="true"] small,.dx-btn[aria-pressed="true"] small{color:var(--dx-accent)}
.dx-dial{width:60px}
.dx-seg{display:flex;gap:4px;margin-left:auto}
.dx-play svg{width:14px;height:14px;fill:currentColor}
.dx-play [data-icon="pause"]{display:none}
.dx-play[data-on] [data-icon="pause"]{display:block}
.dx-play[data-on] [data-icon="play"]{display:none}
.dx-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.dx-glass{fill:var(--dx-glass);stroke:none}
.dx-lcd{fill:var(--dx-glass);stroke:none}
.dx-well{fill:var(--dx-well);stroke:none}
.dx-floor{fill:var(--dx-floor);stroke:var(--anatomy-faint);stroke-width:var(--anatomy-weight)}
.dx-parts circle,.dx-fly{fill:var(--dx-part);stroke:var(--anatomy-paper);stroke-width:.35px}
.dx-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.dx-cell{fill:var(--dx-cell);stroke:none}
.dx-cell-line{fill:none;stroke:var(--anatomy-lo);stroke-width:.35px}
[data-cell][data-run] .dx-cell-line,[data-cell][data-best] .dx-cell-line{stroke:var(--dx-accent);stroke-width:.6px}
.dx-bar{fill:var(--dx-bar);stroke:none}
[data-cell][data-best] .dx-bar{fill:var(--dx-accent);opacity:.55}
.dx-num{font-family:var(--anatomy-mono);font-weight:600;fill:var(--anatomy-hi)}
.dx-num[data-open]{fill:var(--anatomy-lo);font-weight:400}
.dx-axis{font-family:var(--anatomy-mono);fill:var(--anatomy-mid)}
.dx-engrave{font-family:var(--anatomy-mono);fill:var(--anatomy-mid);font-weight:600}
.dx-digits{font-family:var(--anatomy-mono);fill:var(--anatomy-hi);font-weight:600;letter-spacing:.06em}
.dx-path{fill:none;stroke:var(--dx-accent);stroke-width:.5px;stroke-dasharray:1 1;transition:opacity .4s}
.dx-hub{fill:var(--anatomy-hi);stroke:none}
.dx-needle,.dx-pointer{stroke-width:.7px!important}
[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill{transition:fill .3s}
[data-lamp][data-on] .iso-top,[data-lamp][data-on] .iso-shade,[data-lamp][data-on] .iso-fill{fill:var(--dx-accent)}
@media (prefers-reduced-motion:reduce){[data-lamp] .iso-top,[data-lamp] .iso-shade,[data-lamp] .iso-fill,.dx-path{transition:none}}
`;

// ---------------------------------------------------------------- live script
const RISE = (() => { const a = at([0, 0, 0]), b = at([0, 0, STROKE]); return [b[0] - a[0], b[1] - a[1]]; })();
const PATH_OUT = [
  [DIE.x + DIE.w + 0.6, CY, BOL_Z + DIE_H + 1],
  [CHUTE.x + 1, CY, CHUTE_Z[1] + 0.9],
  [CHUTE.x + CHUTE.w, CY, CHUTE_Z[1] + 0.9],
].map(at);
const BIN_DROP = { good: at([TOTE.x + 6, TOTE.y + TOTE.d / 2 + 1, 2.5]), scrap: at([SCRAP.x + 6, SCRAP.y + SCRAP.d / 2, 2.5]) };
// resting places for parts inside each bin (fixed pseudo-random scatter on the floor)
function scatter(plan, count, seed) {
  // only spots seen through the opening, the pile rising toward the back
  const rim = k.roundedPlan(k.insetPlan(plan, 1.6), 3).map(([x, y]) => at([x, y, BIN_H]));
  const inside = ([px, py]) => {
    let hit = false;
    for (let i = 0, j = rim.length - 1; i < rim.length; j = i++) {
      const [xi, yi] = rim[i], [xj, yj] = rim[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };
  const out = [];
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let tries = 0; out.length < count && tries < 5000; tries++) {
    const x = plan.x + 2.2 + rnd() * (plan.w - 4.4);
    const y = plan.y + 2.2 + rnd() * (plan.d - 4.4);
    const p = at([x, y, BIN_H - 4.5 + rnd() * 3]);
    if (inside(p)) out.push([f2(p[0]), f2(p[1])]);
  }
  return out;
}
const SPOTS = { good: scatter(TOTE, 40, 7), scrap: scatter(SCRAP, 24, 11) };

const live = `
const N = ${N};
const Y = ${JSON.stringify(Y)};
const RANDOM_ORDER = ${JSON.stringify(RANDOM_ORDER)}, OFAT_ORDER = ${JSON.stringify(OFAT_ORDER)};
const CELLS = ${JSON.stringify(CELLS)};
const KNOBS = ${JSON.stringify(KNOBS)}, KNOB_R = ${KNOB_R}, GAUGE = ${JSON.stringify(GAUGE)};
const RISE = ${JSON.stringify(RISE)};
const PATH_OUT = ${JSON.stringify(PATH_OUT)};
const BIN_DROP = ${JSON.stringify(BIN_DROP)};
const SPOTS = ${JSON.stringify(SPOTS)};
const RUN_S = 3.4, SHOTS = 6;

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const T = EN
  ? { lo: "low", hi: "high", effT: "effect T", effP: "effect p", inter: "T×p", pt: "pt", unknown: "unknown", run: "run", dec: ".", scrap: "scrap",
      verdictWait: "Fill all four cells of the 2×2.", ofatWait: "One at a time from low/low: change T, then p.",
      inter1: (a, b, best) => "<b>Interaction:</b> T " + a + " at low p, " + b + " at high p · best " + best + " %",
      add: (best) => "<b>No interaction:</b> the effects add up · best " + best + " %",
      ofat: (best) => "<b>One at a time:</b> best " + best + " %, high/high never tested",
      back: "back to low", untested: "never tested" }
  : { lo: "laag", hi: "hoog", effT: "effect T", effP: "effect p", inter: "T×p", pt: "pt", unknown: "onbekend", run: "run", dec: ",", scrap: "uitval",
      verdictWait: "Vul alle vier de cellen van de 2×2.", ofatWait: "Eén tegelijk vanuit laag/laag: eerst T, dan p.",
      inter1: (a, b, best) => "<b>Interactie:</b> T " + a + " bij lage p, " + b + " bij hoge p · beste " + best + " %",
      add: (best) => "<b>Geen interactie:</b> de effecten tellen op · beste " + best + " %",
      ofat: (best) => "<b>Eén tegelijk:</b> beste " + best + " %, hoog/hoog nooit getest",
      back: "terug naar laag", untested: "nooit getest" };
const fmt = (v, d = 1) => v.toFixed(d).replace(".", T.dec);
const signed = (v, d = 1) => (v > 0 ? "+" : v < 0 ? "−" : "±") + fmt(Math.abs(v), d);

const stage = document.querySelector(".dx-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = {
  ram: [...svg.querySelectorAll("[data-ram]")],
  gauge: q("[data-gauge]"),
  knob: { T: q('[data-knob="T"]'), p: q('[data-knob="p"]') },
  lamp: q("[data-lamp]"),
  count: q("[data-count]"),
  bins: { good: q('[data-bin="good"]'), scrap: q('[data-bin="scrap"]') },
  fly: q("[data-flying]"),
  ofat: q("[data-ofat]"),
  cells: Object.fromEntries(Object.keys(CELLS).map((c) => [c, q('[data-cell="' + c + '"]')])),
};
const lines = [...document.querySelectorAll("[data-readout] .dx-line")];
const verdictEl = document.querySelector("[data-verdict]");
const playBtn = document.querySelector(".dx-play");
const dialBtns = { T: document.querySelector('[data-dial="T"]'), p: document.querySelector('[data-dial="p"]') };
const modeBtns = [...document.querySelectorAll(".dx-seg .dx-btn")];
const announcer = document.querySelector(".dx-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------ the experiment
const state = {
  mode: "full", dial: { T: 0, p: 0 }, shown: { T: 0, p: 0 }, results: {},
  run: null, queue: [], playing: false, hold: 0, clock: 0, flying: [], ofatNote: "",
};
const cellOf = () => (state.dial.T ? "H" : "L") + (state.dial.p ? "H" : "L");
const scrapOf = (cell) => Math.round((Y[cell] / 100) * N);

function analysis() {
  const r = state.results;
  const has = (c) => r[c] !== undefined;
  const out = { effT: null, effP: null, inter: null, verdict: "" };
  const tested = Object.keys(r);
  const best = tested.length ? Math.min(...tested.map((c) => r[c])) : null;
  if (state.mode === "full") {
    if (["LL", "HL", "LH", "HH"].every(has)) {
      out.effT = (r.HL + r.HH) / 2 - (r.LL + r.LH) / 2;
      out.effP = (r.LH + r.HH) / 2 - (r.LL + r.HL) / 2;
      out.inter = (r.LL + r.HH - r.HL - r.LH) / 2;
      const a = r.HL - r.LL, b = r.HH - r.LH;
      out.verdict = Math.abs(out.inter) < 0.25 ? T.add(fmt(best, 0)) : T.inter1(signed(a, 0), signed(b, 0), fmt(best, 0));
      out.best = tested.filter((c) => r[c] === best);
    } else out.verdict = T.verdictWait;
  } else {
    if (has("LL") && has("HL")) out.effT = r.HL - r.LL;
    if (has("LL") && has("LH")) out.effP = r.LH - r.LL;
    out.verdict = has("LL") && has("HL") && has("LH") ? T.ofat(fmt(best, 0)) : T.ofatWait;
    if (has("LL") && has("HL") && has("LH")) out.best = tested.filter((c) => r[c] === best);
  }
  return out;
}

function startRun(cell) {
  state.run = { cell, t: 0, made: 0, scrap: 0, shot: -1 };
  state.flying = [];
  delete state.results[cell];
  announcer.textContent = "";
}
function finishRun() {
  const run = state.run;
  state.results[run.cell] = Y[run.cell];
  run.made = N; run.scrap = scrapOf(run.cell); run.t = RUN_S; run.done = true;
  const an = analysis();
  announcer.textContent = (EN ? "Run " : "Run ") + label(run.cell) + ": " + run.scrap + " / " + N + " " + T.scrap + ", " + fmt(Y[run.cell]) + " %. " + an.verdict.replace(/<[^>]+>/g, "");
}
const label = (cell) => "T " + (cell[0] === "H" ? T.hi : T.lo) + " · p " + (cell[1] === "H" ? T.hi : T.lo);

// ------------------------------------------------ drawing
function binDots(name, count) {
  const g = el.bins[name];
  const n = Math.min(SPOTS[name].length, count);
  if (g.childElementCount === n) return;
  g.innerHTML = SPOTS[name].slice(0, n).map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="1.25"/>').join("");
}
function knobPath(name, v) {
  const [x, z] = KNOBS[name];
  const a = (-50 + 100 * v) * Math.PI / 180;
  const r = KNOB_R - 0.9;
  return "M" + x + " " + (-z) + "L" + (x + r * Math.sin(a)).toFixed(2) + " " + (-z - r * Math.cos(a)).toFixed(2);
}
function gaugePath(v) {
  // hold pressure: low sits at a third of the scale, high at four fifths
  const a = (-135 + 270 * (0.33 + 0.47 * v)) * Math.PI / 180;
  const r = GAUGE.r - 0.5;
  return "M" + GAUGE.x + " " + (-GAUGE.z) + "L" + (GAUGE.x + r * Math.sin(a)).toFixed(2) + " " + (-GAUGE.z - r * Math.cos(a)).toFixed(2);
}
function screen(an) {
  for (const [c, g] of Object.entries(el.cells)) {
    const box = CELLS[c];
    const running = state.run && !state.run.done && state.run.cell === c;
    const val = running ? (state.run.made ? (100 * state.run.scrap) / state.run.made : 0) : state.results[c];
    const bar = g.querySelector("[data-bar]");
    const num = g.querySelector("[data-num]");
    if (val === undefined) {
      bar.setAttribute("d", "");
      const untested = state.mode === "ofat" && c === "HH";
      num.textContent = untested ? "?" : "";
      num.setAttribute("data-open", "");
    } else {
      const h = (box.z1 - box.z0 - 1.2) * clamp(val / 10, 0, 1);
      const w = box.x1 - box.x0;
      bar.setAttribute("d", "M" + (box.x0 + w * 0.12).toFixed(2) + " " + (-box.z0 - 0.6).toFixed(2) + "h" + (w * 0.18).toFixed(2) + "v" + (-h).toFixed(2) + "h" + (-w * 0.18).toFixed(2) + "Z");
      num.textContent = fmt(val);
      if (running) num.setAttribute("data-open", ""); else num.removeAttribute("data-open");
      num.setAttribute("x", (box.x0 + w * 0.62).toFixed(2));
    }
    if (running) g.setAttribute("data-run", ""); else g.removeAttribute("data-run");
    if (an.best && an.best.includes(c) && !running) g.setAttribute("data-best", ""); else g.removeAttribute("data-best");
  }
  // one at a time: the path it took from low/low
  const show = state.mode === "ofat";
  if (show) {
    const mid = (c) => [((CELLS[c].x0 + CELLS[c].x1) / 2), -((CELLS[c].z0 + CELLS[c].z1) / 2)];
    const ll = mid("LL"), hl = mid("HL"), lh = mid("LH");
    el.ofat.setAttribute("d", "M" + (ll[0] + 3.5) + " " + (ll[1] - 3) + "L" + (hl[0] - 5) + " " + (hl[1] - 3) + "M" + (ll[0] - 4.5) + " " + (ll[1] - 4) + "L" + (lh[0] - 4.5) + " " + (lh[1] + 4));
  }
  el.ofat.style.opacity = show ? "1" : "0";
}
function readout(an) {
  const run = state.run;
  let l1;
  if (!run) l1 = '<span class="dx-mute">' + label(cellOf()) + "</span>";
  else if (!run.done) l1 = label(run.cell) + " · " + String(run.made).padStart(3, " ") + "/" + N;
  else l1 = label(run.cell) + " · " + '<span class="dx-acc">' + fmt(Y[run.cell]) + " %</span>";
  const row = (name, v, note) => name.padEnd(9, " ") + (v === null ? (note || "…").padStart(9, " ") : (signed(v) + " " + T.pt).padStart(9, " "));
  const l2 = row(T.effT, an.effT);
  const l3 = row(T.effP, an.effP);
  const l4 = state.mode === "ofat" ? T.inter.padEnd(9, " ") + T.unknown.padStart(9, " ") : row(T.inter, an.inter);
  [l1, l2, l3, l4].forEach((h, i) => { if (lines[i].innerHTML !== h) lines[i].innerHTML = h; });
  if (verdictEl.innerHTML !== an.verdict) verdictEl.innerHTML = an.verdict;
}
function controls() {
  for (const n of ["T", "p"]) {
    dialBtns[n].setAttribute("aria-pressed", String(!!state.dial[n]));
    const s = dialBtns[n].querySelector("small");
    const txt = state.dial[n] ? T.hi : T.lo;
    if (s.textContent !== txt) s.textContent = txt;
  }
  modeBtns.forEach((b) => { const on = b.dataset.mode === state.mode; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  if (state.playing) playBtn.setAttribute("data-on", ""); else playBtn.removeAttribute("data-on");
  playBtn.setAttribute("aria-label", state.playing ? playBtn.dataset.pause : playBtn.dataset.play);
}
function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function flyPos(f) {
  // out of the mould onto the chute, down the chute, then a fall into a bin
  const a = f.age;
  if (a < 0.25) return lerp(PATH_OUT[0], PATH_OUT[1], ease(a / 0.25));
  if (a < 0.7) return lerp(PATH_OUT[1], PATH_OUT[2], (a - 0.25) / 0.45);
  const t = clamp((a - 0.7) / 0.3, 0, 1);
  const end = BIN_DROP[f.bin];
  return [PATH_OUT[2][0] + (end[0] - PATH_OUT[2][0]) * t, PATH_OUT[2][1] + (end[1] - PATH_OUT[2][1]) * t * t];
}
function draw() {
  const an = analysis();
  // the ram: open between shots, closed while a shot is moulded
  const open = state.ramOpen ?? 1;
  const tr = "translate(" + (RISE[0] * open).toFixed(2) + " " + (RISE[1] * open).toFixed(2) + ")";
  el.ram.forEach((g) => g.setAttribute("transform", tr));
  el.knob.T.setAttribute("d", knobPath("T", state.shown.T));
  el.knob.p.setAttribute("d", knobPath("p", state.shown.p));
  el.gauge.setAttribute("d", gaugePath(state.shown.p));
  if (state.run && !state.run.done) el.lamp.setAttribute("data-on", ""); else el.lamp.removeAttribute("data-on");
  const run = state.run;
  const scrap = run ? run.scrap : 0, good = run ? run.made - run.scrap : 0;
  el.count.textContent = String(scrap).padStart(3, "0");
  binDots("scrap", Math.ceil(scrap / 2));
  binDots("good", Math.ceil(good / 12));
  const fh = state.flying.map((f) => { const [x, y] = flyPos(f); return '<circle class="dx-fly" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.5" opacity="' + (1 - ease((f.age - 0.85) / 0.15)).toFixed(2) + '"/>'; }).join("");
  if (el.fly.innerHTML !== fh) el.fly.innerHTML = fh;
  screen(an);
  readout(an);
}

// ------------------------------------------------ time
function stepRun(dt) {
  const run = state.run;
  if (!run || run.done) { state.ramOpen = 1; return; }
  run.t = Math.min(RUN_S, run.t + dt);
  const u = run.t / RUN_S;
  const shotLen = 1 / SHOTS;
  const shot = Math.min(SHOTS - 1, Math.floor(u / shotLen));
  const ph = (u - shot * shotLen) / shotLen; // 0..1 in this shot: close, hold, open
  state.ramOpen = ph < 0.3 ? 1 - ease(ph / 0.3) : ph < 0.6 ? 0 : ease((ph - 0.6) / 0.3);
  if (ph >= 0.75 && run.shot < shot) {
    run.shot = shot;
    // each shot drops one part you can follow; scrap shots spread evenly over the run
    const scrapShots = Math.max(1, Math.round(Y[run.cell] / 3));
    const isScrap = Math.floor(((shot + 1) * scrapShots) / SHOTS) > Math.floor((shot * scrapShots) / SHOTS);
    state.flying.push({ age: 0, bin: isScrap ? "scrap" : "good" });
  }
  run.made = Math.min(N, Math.round(N * u));
  run.scrap = Math.round(run.made * Y[run.cell] / 100);
  if (run.t >= RUN_S) finishRun();
}
function advance(dt) {
  if (state.hold > 0) { state.hold -= dt; return; }
  if (state.run && !state.run.done) return;
  if (state.pending) { startRun(state.pending); state.pending = null; return; }
  if (state.queue.length) {
    const next = state.queue.shift();
    state.dial.T = next[0] === "H" ? 1 : 0; state.dial.p = next[1] === "H" ? 1 : 0;
    state.pending = next; state.hold = 0.55; // let the knobs turn first
    controls();
    return;
  }
  if (state.playing) { state.playing = false; controls(); onEnd(); }
}

// ------------------------------------------------ idle tour: the 2×2 in random order, then one at a time
let touring = !still.matches, idleTimer = 0, tourNext = null;
function sequence(mode) { return mode === "full" ? RANDOM_ORDER.slice() : OFAT_ORDER.slice(); }
function play(mode) {
  state.mode = mode; state.results = {}; state.run = null; state.flying = [];
  state.queue = sequence(mode); state.pending = null; state.playing = true; state.hold = 0.4;
  controls();
}
function onEnd() {
  if (touring) tourNext = { at: state.clock + 5.5, mode: state.mode === "full" ? "ofat" : "full" };
}
function complete(mode) {
  // the finished experiment at once (reduced motion)
  state.mode = mode; state.run = null; state.flying = []; state.queue = []; state.pending = null; state.playing = false;
  state.results = Object.fromEntries(sequence(mode).map((c) => [c, Y[c]]));
  const lastCell = sequence(mode).slice(-1)[0];
  state.dial.T = lastCell[0] === "H" ? 1 : 0; state.dial.p = lastCell[1] === "H" ? 1 : 0;
  state.shown = { ...state.dial };
  state.run = { cell: lastCell, t: RUN_S, made: N, scrap: scrapOf(lastCell), shot: SHOTS, done: true };
  controls();
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  state.clock += dt;
  if (!still.matches) {
    if (tourNext && state.clock >= tourNext.at) { const m = tourNext.mode; tourNext = null; play(m); }
    advance(dt);
    stepRun(dt);
    for (const n of ["T", "p"]) {
      state.shown[n] += (state.dial[n] - state.shown[n]) * (1 - Math.exp(-dt / 0.12));
      if (Math.abs(state.dial[n] - state.shown[n]) < 0.002) state.shown[n] = state.dial[n];
    }
    state.flying.forEach((f) => (f.age += dt / 0.9));
    state.flying = state.flying.filter((f) => f.age < 1);
  } else {
    state.shown = { ...state.dial }; state.ramOpen = 1;
  }
  draw();
  const moving = state.playing || (state.run && !state.run.done) || state.flying.length || state.shown.T !== state.dial.T || state.shown.p !== state.dial.p || state.ramOpen !== 1 || tourNext;
  frame = visible && !still.matches && moving ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) tick(performance.now()); else run(); };

function steer() {
  touring = false; tourNext = null;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!still.matches) { touring = true; play("full"); run(); } }, 45000);
}
function turnDial(name) {
  steer();
  state.playing = false; state.queue = []; state.pending = null;
  state.dial[name] = state.dial[name] ? 0 : 1;
  let note = "";
  const other = name === "T" ? "p" : "T";
  if (state.mode === "ofat" && state.dial[name] && state.dial[other]) { state.dial[other] = 0; note = other + " " + T.back + ". "; }
  const cell = cellOf();
  if (still.matches) {
    state.results[cell] = Y[cell];
    state.run = { cell, t: RUN_S, made: N, scrap: scrapOf(cell), shot: SHOTS, done: true };
    finishRun();
  } else startRun(cell);
  if (note) announcer.textContent = note + announcer.textContent;
  controls();
  kick();
}
function setMode(mode) {
  steer();
  if (still.matches) complete(mode);
  else { state.mode = mode; state.results = {}; state.run = null; state.flying = []; state.queue = []; state.pending = null; state.playing = false; state.dial = { T: 0, p: 0 }; controls(); }
  kick();
}
function togglePlay() {
  steer();
  if (state.playing) { state.playing = false; state.queue = []; state.pending = null; }
  else if (still.matches) complete(state.mode);
  else play(state.mode);
  controls();
  kick();
}

// ------------------------------------------------ controls
dialBtns.T.addEventListener("click", () => turnDial("T"));
dialBtns.p.addEventListener("click", () => turnDial("p"));
modeBtns.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
document.querySelector(".dx-seg").addEventListener("keydown", (event) => {
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault();
  const next = state.mode === "full" ? "ofat" : "full";
  setMode(next);
  modeBtns.find((b) => b.dataset.mode === next).focus();
});
playBtn.addEventListener("click", togglePlay);
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (event.key === "t" || event.key === "T") turnDial("T");
  else if (event.key === "p" || event.key === "P") turnDial("p");
  else if (event.key === " " || event.key === "Enter") togglePlay();
  else if (event.key === "m" || event.key === "M") setMode(state.mode === "full" ? "ofat" : "full");
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
if (still.matches) complete("full"); else { play("full"); }
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  cancelAnimationFrame(frame); frame = 0;
  if (still.matches) { touring = false; tourNext = null; complete(state.mode); tick(performance.now()); }
  else { touring = true; play("full"); run(); }
});
controls();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Proefopzet 2×2",
    hint: "Tik T of p: één run",
    hint2: "▶ vier runs, willekeurig",
    play: "Afspelen",
    pause: "Pauze",
    group: "Proefopzet",
    full: "2×2",
    ofat: "één tegelijk",
    dialT: "Temperatuur T, laag of hoog: start een run",
    dialP: "Nadruk p, laag of hoog: start een run",
    label: LABEL_NL,
    aria: "Spuitgietpers met een 2×2-proef. Toetsen: T en P draaien een knop en starten een run, M wisselt tussen 2×2 en één tegelijk, spatie speelt de hele proef af.",
  },
  en: {
    title: "A 2×2 experiment",
    hint: "Tap T or p: one run",
    hint2: "▶ four runs, random order",
    play: "Play",
    pause: "Pause",
    group: "Experiment design",
    full: "2×2",
    ofat: "one at a time",
    dialT: "Temperature T, low or high: starts a run",
    dialP: "Hold pressure p, low or high: starts a run",
    label: LABEL_EN,
    aria: "Moulding press with a 2×2 experiment. Keys: T and P turn a knob and start a run, M switches between 2×2 and one at a time, Space plays the whole experiment.",
  },
};

const ICONS = `<svg viewBox="0 0 14 14" aria-hidden="true" data-icon="play"><path d="M3.5 2.2v9.6l8-4.8z"/></svg><svg viewBox="0 0 14 14" aria-hidden="true" data-icon="pause"><path d="M3.2 2.4h2.6v9.2H3.2zM8.2 2.4h2.6v9.2H8.2z"/></svg>`;
const controls = `<div class="dx-controls"><button type="button" class="dx-btn dx-play" data-play="${STRINGS.nl.play}" data-pause="${STRINGS.nl.pause}" aria-label="${STRINGS.nl.play}">${ICONS}</button><button type="button" class="dx-btn dx-dial" data-dial="T" aria-pressed="false" aria-label="${STRINGS.nl.dialT}">T<small>laag</small></button><button type="button" class="dx-btn dx-dial" data-dial="p" aria-pressed="false" aria-label="${STRINGS.nl.dialP}">p<small>laag</small></button><div class="dx-seg" role="radiogroup" aria-label="${STRINGS.nl.group}"><button type="button" class="dx-btn" role="radio" data-mode="full" aria-checked="true" tabindex="0">${STRINGS.nl.full}</button><button type="button" class="dx-btn" role="radio" data-mode="ofat" aria-checked="false" tabindex="-1">${STRINGS.nl.ofat}</button></div></div>`;

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="dx-stage" tabindex="0" role="group" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="dx-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="dx-line"></span>'.repeat(4)}</span><span class="dx-verdict" data-verdict></span>`)
  .replace(">HINT<", `><span data-hint>${STRINGS.nl.hint}</span><br><span data-hint2>${STRINGS.nl.hint2}</span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){if(new URLSearchParams(location.search).get("lang")!=="en")return;var s=${JSON.stringify(STRINGS.en)};
document.title=s.title;var c=function(n){return document.querySelector('.iso-plate-corner[data-corner="'+n+'"]');};
c("title").textContent=s.title;var h=c("hint");h.querySelector("[data-hint]").textContent=s.hint;h.querySelector("[data-hint2]").textContent=s.hint2;
var p=document.querySelector(".dx-play");p.dataset.play=s.play;p.dataset.pause=s.pause;p.setAttribute("aria-label",s.play);
document.querySelector('[data-dial="T"]').setAttribute("aria-label",s.dialT);document.querySelector('[data-dial="p"]').setAttribute("aria-label",s.dialP);
document.querySelector(".dx-seg").setAttribute("aria-label",s.group);document.querySelector('[data-mode="ofat"]').textContent=s.ofat;
var st=document.querySelector(".dx-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: effect T ${EFF_T}, effect p ${EFF_P}, T×p ${EFF_TP} (points); scrap ${Object.entries(Y).map(([c, v]) => `${c} ${(v / 100) * N}`).join(" · ")}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P);
