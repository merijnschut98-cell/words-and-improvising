// Dev tool, not shipped. Builds the explainer film "Van korrel tot smelt /
// From pellet to melt" for the topic Kunststoffen of Spuitgieten (materials L1,
// polymers L2, drying L3, fillers L4).
//
//   node films/eng.moulding.materials/build.mjs            build the page
//   node films/eng.moulding.materials/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.materials.html: one offline
// page with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, §3.3.
//
// The drawing is the world of the figure eng.moulding.dryer (its geometry is
// copied here, with the cues added): the rear of a press with the barrel and
// its heater bands, the water-cooled feed throat and the drive; on the throat a
// drying hopper with a sight glass and a loader with a regrind inlet; beside the
// press a desiccant dryer on castors with two desiccant towers, a return-air
// filter, a dew-point display and a moisture meter on its lid; the supply and
// return hoses between them. Cards in stage space carry what the press cannot
// show: the molecules, the shrinkage, the sums.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const A = await import(pathToFileURL(join(SKILL, 'kit/audit.mjs')).href);
const { tubePieces, tubeSvg } = await import(pathToFileURL(join(SKILL, 'kit/tube.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The {n:...} numbers of the captions and the narration are then
// checked against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// materials: PA6 GF30, dryer 50 kg, press 12 kg/h, 4 h drying → 48 kg; 20 kg topped up lasts 1,7 h
const DRYER = { kg: 50, use: 12, hours: 4, topUp: 20 };
assert(DRYER.use * DRYER.hours === 48 && 48 <= DRYER.kg, '4 × 12 = 48 kg, under the 50 kg hopper');
assert(near(Math.round((DRYER.topUp / DRYER.use) * 10) / 10, 1.7), '20 / 12 ≈ 1,7 h');
assert(DRYER.topUp / DRYER.use < DRYER.hours, 'the topped-up 20 kg never dried 4 h');
// polymers: PP 1,5 % → cavity 101,5 mm; ABS 0,5 % from that cavity → 101,0 mm (tolerance ±0,2)
const SHRINK = { part: 100, pp: 0.015, abs: 0.005, tol: 0.2 };
const CAVITY = SHRINK.part * (1 + SHRINK.pp);
assert(near(CAVITY, 101.5, 1e-9), '100 × 1,015 = 101,5 mm');
const ABS_PART = Math.round(CAVITY * (1 - SHRINK.abs) * 10) / 10;
assert(near(ABS_PART, 101.0), '101,5 × 0,995 ≈ 101,0 mm');
assert(ABS_PART - SHRINK.part > SHRINK.tol, 'a millimetre over ±0,2 mm');
// drying: PC lens, limit 0,02 %; 20,000 g → 19,994 g
const SAMPLE = { before: 20.000, after: 19.994, limit: 0.02 };
const LOSS = Math.round((SAMPLE.before - SAMPLE.after) * 1000) / 1000;
assert(near(LOSS, 0.006), '20,000 − 19,994 = 0,006 g');
const MOIST = Math.round((LOSS / SAMPLE.before) * 100 * 1000) / 1000;
assert(near(MOIST, 0.03), '0,006 / 20 = 0,03 %');
assert(MOIST > SAMPLE.limit, '0,03 % is over the 0,02 % limit');
assert(near((1000 * SAMPLE.limit) / 100, 0.2), '0,02 % of a kilo is 0,2 g');
// fillers: PA66 GF30, 50 cm³ × 1,36 g/cm³ = 68 g × € 4,00/kg ≈ € 0,272; GF shrink 0,3 % along, 0,7 % across
const BRACKET = { cm3: 50, rho: 1.36, eur: 4.0 };
const GRAMS = Math.round(BRACKET.cm3 * BRACKET.rho);
assert(GRAMS === 68, '50 × 1,36 = 68 g');
assert(near((GRAMS / 1000) * BRACKET.eur, 0.272, 1e-9), '68 g × € 4,00 per kg = € 0,272');
const GF = { along: 0.3, across: 0.7 };
assert(GF.along < GF.across, 'less shrinkage along the fibres');
// lesson values the cards show (hedged as "about" in the script)
const FACTS = { tgPC: 145, tmPA6: 220, dew: -40, dewBad: -15, regrind: [10, 25], dryT: [80, 120], dryH: [2, 4], amorf: 0.5, semi: [1, 2], pet: 0.005 };

// ---------------------------------------------------------------- the world (from figures/eng.moulding.dryer)
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

const W = 640;
const H = 400;
const FIT = [
  ...k.boxCorners(BED, 0, BED_TOP),
  ...k.boxCorners({ x: HX - 16, y: YC - 16, w: 32, d: 32 }, 80, 160),
  ...k.boxCorners(DRY, 0, 86),
];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: 52, elevation: 24 });
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
function turned(name, F, profile, style = {}, { extra = "", inner = "", owner, lathe = {}, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P, lathe), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = "", inner = "", owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}
function hose(base, route, r, tone = "mid", attrs = "") {
  const id = R.nameFor(base);
  R.route(id, route, r, { owner: id });
  tubePieces(route, r, P, { maxLength: 14 }).forEach((part, index) =>
    put(`${id}:${index}`, part.mid, tubeSvg(part, { tone }), [A.tube(part.points, part.radii, { name: id, owner: id })], { route: id, chunk: index, attrs }),
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
  post("bed.jack", x, y, 1.3, 1.2, 3, { tone: "mid", crease: "none" }, { steps: 8 });
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
  turned("inj.barrel", F, prof, { tone: "mid" }, { attrs: ' data-cue="barrel"' });
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
  turned("hop.body", FH, [[0, 4], [H_CYL - H_Z0, H_R], [H_TOP - H_Z0, H_R]], { tone: "mid" }, { inner: ribs + seams, attrs: ' data-cue="hopper"' });
  const FL = frameZ([HX, YC, H_TOP]);
  const bolts = [];
  for (let i = 0; i < 12; i++) bolts.push(at(G.pointOf(FL, 1.6, H_R - 0.4, (i / 12) * Math.PI * 2)));
  discAt("hop.lid", FL, 0, 1.6, H_R + 1, { tone: "mid" }, { extra: Dt(bolts, { size: 0.4 }), attrs: ' data-cue="hopper"' });
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
  discAt("hop.regrind", Fr, 0, 3, 1.8, { tone: "mid" }, { attrs: ' data-cue="regrind"' });
  discAt("hop.regrind-cap", Fr, 3, 4.6, 2.5, { tone: "mid" }, { steps: 6, attrs: ' data-cue="regrind"' });
  // sight glass on the front of the cylinder: the granulate inside, live
  const fy = GLASS.y + GLASS.d;
  const screws = [[GLASS.x + 0.8, fy, GLASS_Z[0] + 0.8], [GLASS.x + GLASS.w - 0.8, fy, GLASS_Z[0] + 0.8], [GLASS.x + 0.8, fy, GLASS_Z[1] - 0.8], [GLASS.x + GLASS.w - 0.8, fy, GLASS_Z[1] - 0.8]];
  box("hop.glass", GLASS, GLASS_Z[0], GLASS_Z[1], { tone: "mid" }, {
    steps: 2,
    attrs: ' data-cue="glass"',
    extra: recess(WIN, fy, `<g data-k="pel"></g>`) + Dt(screws.map(at), { size: 0.4 }),
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
  discAt("stand.wheel", frameY([cx, cy - 0.9, 2.1]), 0, 1.8, 2.1, { tone: "lo" }, { steps: 10 });
}
{
  const fy = DFACE;
  const slots = [];
  for (const z of [14, 17, 20, 23, 26]) slots.push(k.pathOf(k.roundedPlan({ x: 66, y: z, w: 22, d: 1.2, r: 0.55 }, 3).map(([u, w]) => at([u, fy, w])), true));
  const label = [[66, fy, 38], [78, fy, 38], [78, fy, 32], [66, fy, 32]];
  const display = [
    `<text class="dr-lcd" data-k="lcdDp" x="${DISP.x0 + 1.6}" y="${-(DISP.z0 + 4.6)}" font-size="3.8">−40 °C</text>`,
    `<text class="dr-lcd dr-lcd-s" data-k="lcdT" x="${DISP.x0 + 1.6}" y="${-(DISP.z0 + 1.4)}" font-size="2.4">80 °C</text>`,
    `<path class="iso-line" data-tone="lo" d="M${DISP.x0 + 16} ${-DISP.z0}L${DISP.x0 + 16} ${-DISP.z1}"/>`,
    `<g data-ledrow="">${[0, 1].map((i) => `<circle class="dr-led" data-led="${i}" cx="${DISP.x0 + 18 + i * 2.2}" cy="${-(DISP.z0 + 7.4)}" r="0.8"/>`).join("")}</g>`,
    `<text class="dr-lcd dr-lcd-s" x="${DISP.x0 + 17.1}" y="${-(DISP.z0 + 3.4)}" font-size="1.6">A B</text>`,
  ].join("");
  const screws = [[63.2, fy, 8.4], [90.8, fy, 8.4], [63.2, fy, 58.6], [90.8, fy, 58.6]];
  box("dry.cabinet", DRY, DRY_Z[0], DRY_Z[1], { tone: "mid" }, {
    steps: 3,
    bevel: 0.7,
    attrs: ' data-cue="dryer"',
    inner: L(slots.join("") + k.sideSeam(DRY, 31, P, 3), { tone: "lo" }),
    extra:
      `<g data-cue="dew">${recess(DISP, fy, display, "dr-screen")}</g>` +
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
      attrs: ' data-cue="desiccant"',
      lathe: { steps: 32, smooth: { rows: 4, error: 0.6, depth: 6 } },
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
  box("dry.meter", METER, DRY_Z[1], DRY_Z[1] + 4, { tone: "mid" }, { steps: 2, bevel: 0.3, attrs: ' data-cue="meter"', extra: recess(MWIN, METER.y + METER.d, `<text class="dr-lcd" data-k="lcdM" x="${MWIN.x0 + 0.5}" y="${-(MWIN.z0 + 0.55)}" font-size="1.4">0,000 g</text>`, "dr-screen") });
  turned("dry.meter-hood", frameZ([METER.x + METER.w / 2, METER.y + METER.d / 2, DRY_Z[1] + 4]), [[0, 3], [1, 3], [2.2, 2.2, 1], [2.8, 0.8]], { tone: "hi", crease: "lo" }, { attrs: ' data-cue="meter"', lathe: { steps: 32, smooth: { rows: 4, error: 0.5, depth: 6 } } });
}

// ---------------------------------------------------------------- the air hoses
{
  const IN_END = HX + H_R + 4.2;
  const supply = G.fillet([[DRY.x - 3.7, YC, 40], [48, YC, 40], [48, YC, IN_Z], [IN_END, YC, IN_Z]], 5.2, 9, { P, tube: 2 });
  hose("air.supply", supply, 2, "mid", ' data-cue="air"');
  const back = G.fillet([[IN_END, YC, OUT_Z], [FILTER[0], YC, OUT_Z], [FILTER[0], YC, FILTER_TOP]], 6, 9, { P, tube: 2 });
  hose("air.return", back, 2, "lo");
}


// ---------------------------------------------------------------- settle and assemble the world
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const halos = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(BED, -2), 0, 2, P)}"/>`,
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(DRY, -1.5), 0, 1.5, P)}"/>`,
].join('');
const items = R.items.map((item) => (item.attrs ? `<g${item.attrs}>${item.svg}</g>` : item.svg)).join('');
// pellets behind the sight glass, in the plane of the glass (x, −z): a jittered
// grid, filled from the bottom by the stage
const PEL = (() => {
  let s = 5;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const out = [];
  for (let row = 0; row < 22; row++) {
    for (let col = 0; col < 5; col++) {
      const x = WIN.x0 + 0.75 + col * 1.15 + (row % 2) * 0.5 + (r() - 0.5) * 0.25;
      if (x > WIN.x1 - 0.5) continue;
      out.push([Math.round(x * 100) / 100, Math.round((WIN.z0 + 0.6 + row * 1.12 + (r() - 0.5) * 0.2) * 100) / 100]);
    }
  }
  return out;
})();

const g = (key, body = '', extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const slot = (cue, key) => `<g data-cue="${cue}">${g(key)}</g>`;
const world = halos + items + g('wfx');
// the cards: a base without a cue, then one slot per cue, so a named part of a
// card turns petrol while it is named
const CUES = ['hygro', 'splay', 'regrind', 'mb', 'semi', 'amorf', 'tg', 'cryst', 'cavity', 'post', 'crack', 'rest', 'hydro', 'over', 'kf', 'abr', 'fibre', 'aniso', 'recy', 'mfi', 'dew', 'meter', 'desiccant'];
const hud = g('base') + CUES.map((c) => slot(c, `c-${c}`)).join('') + g('top');
// Page weight (after the film eng.moulding.machine): in plain M/L/Z paths, drop
// a line point within 0.2 units of the last one kept, round points to 0.1 unit
// (at the closest camera, the meter at about 6×, that is under a pixel) and
// write the lines as relative steps in one implicit "l" run: the same shapes in
// about two thirds of the bytes.
const tenth = (n) => { const a = Math.abs(n); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return n < 0 ? `-${t}` : t; };
const slim = (s) => s.replace(/ d="([^"]*)"/g, (m, d) => {
  if (!/^[MLZ0-9 .-]+$/.test(d)) return m;
  let out = '';
  let last = null; // the last point kept, unrounded
  let pen = null; // the pen in tenths
  let run = false; // inside an "l" run
  let start = null; // the subpath's first point, where Z leaves the pen
  const num = (v) => { const t = tenth(v); out += (out && !/[A-Za-z]$/.test(out) && t[0] !== '-' ? ' ' : '') + t; };
  for (const tok of d.match(/[MLZ][^MLZ]*/g) ?? []) {
    if (tok[0] === 'Z') { out += 'Z'; last = null; run = false; pen = start; continue; }
    const [x, y] = tok.slice(1).trim().split(/\s+/).map(Number);
    if (tok[0] === 'L' && last && Math.hypot(x - last[0], y - last[1]) < 0.2) continue;
    const q = [Math.round(x * 10), Math.round(y * 10)];
    if (tok[0] === 'M' || !pen) { out += 'M'; num(q[0]); num(q[1]); run = false; start = q; }
    else { if (!run) { out += 'l'; run = true; } num(q[0] - pen[0]); num(q[1] - pen[1]); }
    pen = q;
    last = [x, y];
  }
  return ` d="${out}"`;
});
const svg = slim(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat
// cam(p, w, s): world point p at stage point s, w wide
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WHOLE = [W / 2, H / 2, W];
const PRESS_L = cam([-14, YC, 96], 420, [186, 212]);
const BOTH_L = cam([42, YC, 74], 380, [186, 200]);
const LOADER_L = cam([HX, YC + 6, 146], 190, [186, 196]);
const HOP_L = cam([HX, YC, 116], 210, [186, 205]);
const GLASS_L = cam([HX, GLASS.y + GLASS.d, 120], 120, [186, 200]);
const DRY_L = cam([76, -6, 56], 220, [186, 200]);
const DEW_L = cam([77, DFACE, 50], 120, [186, 205]);
const METER_L = cam([84, 4, 61], 110, [186, 210]);
const BARREL_L = cam([-30, YC, 74], 220, [186, 205]);
const KEYS = [
  [WHOLE, PRESS_L, PRESS_L, BOTH_L], // s1 how it works
  [HOP_L, BOTH_L, DEW_L, HOP_L, GLASS_L], // s2 moisture and the dryer
  [PRESS_L, LOADER_L, PRESS_L, PRESS_L], // s3 splay, regrind, colour
  [WHOLE, WHOLE], // s4 two families (full card)
  [WHOLE, WHOLE, WHOLE, WHOLE], // s5 cooling (full card)
  [WHOLE, WHOLE, WHOLE, WHOLE], // s6 shrinkage (full card)
  [HOP_L, HOP_L, DRY_L], // s7 what water does
  [METER_L, METER_L, DRY_L, DRY_L], // s8 measuring and the dryer
  [BARREL_L, WHOLE, WHOLE, PRESS_L, PRESS_L], // s9 fillers and recyclate
];

// ---------------------------------------------------------------- the film
const MAT = 'eng.moulding.materials';
const POL = 'eng.moulding.polymers';
const DRY_ = 'eng.moulding.drying';
const FIL = 'eng.moulding.fillers';
const spec = {
  id: 'eng.moulding.materials',
  title: { nl: 'Van korrel tot smelt', en: 'From pellet to melt' },
  lessons: [MAT, POL, DRY_, FIL],
  scenes: [
    {
      // v14b: the Basis "how it works" tour, from the bag to the barrel
      id: 's1', lesson: MAT, level: 1, still: 0.5, title: { nl: 'Van korrel tot product', en: 'From pellet to part' },
      beats: [
        { nl: 'Korrels gaan via de trechter de verwarmde cilinder in en smelten.', en: 'Pellets go through the hopper into the heated barrel and melt.', cues: ['hopper', 'barrel'] },
        { nl: 'Thermoplasten smelten bij warmte en worden weer vast bij afkoelen.', en: 'Thermoplastics melt when heated and set again when cooled.' },
        { nl: 'Vier veelgebruikte: PP, ABS, PA (nylon) en PC.', en: 'Four common ones: PP, ABS, PA (nylon) and PC.' },
        { nl: 'Sommige moeten eerst drogen; daarvoor staat de droger naast de pers.', en: 'Some must be dried first; that is what the dryer beside the press is for.', cues: ['dryer', 'air'] },
      ],
    },
    {
      id: 's2', lesson: MAT, level: 1, still: 0.5, title: { nl: 'Vocht in de korrel', en: 'Moisture in the pellet' },
      beats: [
        { nl: 'Een {t:Hygroscopisch|hygroscopische} kunststof trekt water uit de lucht.', en: 'A {t:Hygroscopic|hygroscopic} plastic absorbs water from the air.', cue: { Hygroscopisch: 'hygro' } },
        { nl: 'Drogen: meestal {n:2} tot {n:4} uur op {n:80} tot {n:120} °C.', en: 'Drying: typically {n:2} to {n:4} hours at {n:80} to {n:120} °C.', cues: ['air', 'desiccant', 'hopper'] },
        { nl: 'Het {t:Dauwpunt|dauwpunt} zegt hoe droog de lucht is: −{n:40} °C is heel droog.', en: 'The {t:Dew point|dew point} tells how dry the air is: −{n:40} °C is very dry.', cue: { Dauwpunt: 'dew' } },
        { nl: '{n:12} kg per uur × {n:4} uur drogen = {n:48} kg in de trechter.', en: '{n:12} kg per hour × {n:4} hours of drying = {n:48} kg in the hopper.', cues: ['hopper'], read: { nl: 'trechter {n:50} kg ≥ {n:48} kg', en: 'hopper {n:50} kg ≥ {n:48} kg' } },
        { nl: 'Leeggelopen, dan {n:20} kg nat erin: in {n:1.7} uur op, nooit {n:4} uur gedroogd.', en: 'Run empty, then {n:20} kg of wet pellets: used in {n:1.7} hours, never dried {n:4} hours.', cues: ['glass'], read: { nl: '{n:20} / {n:12} ≈ {n:1.7} uur', en: '{n:20} / {n:12} ≈ {n:1.7} h' } },
      ],
    },
    {
      id: 's3', lesson: MAT, level: 1, still: 0.5, title: { nl: 'Splay, maalgoed en kleur', en: 'Splay, regrind and colour' },
      beats: [
        { nl: 'Nat materiaal geeft {t:Splay|splay}: zilverstrepen, en zwakke producten.', en: 'Wet material gives {t:Splay|splay}: silver streaks, and weak parts.', cue: { Splay: 'splay' } },
        { nl: '{t:Maalgoed|Maalgoed} gaat terug in de trechter; klanten staan vaak {n:10} tot {n:25}% toe.', en: '{t:Regrind|Regrind} goes back into the hopper; customers often allow {n:10} to {n:25}%.', cue: { Maalgoed: 'regrind' } },
        { nl: 'Kleur komt uit {t:Masterbatch|masterbatch}: een paar procent kleurkorrels.', en: 'Colour comes from {t:Masterbatch|masterbatch}: a few percent of colour pellets.', cue: { Masterbatch: 'mb' } },
        { nl: 'Een kleurwissel betekent spoelen: plan van licht naar donker.', en: 'A colour change means purging: plan from light to dark.' },
      ],
    },
    {
      id: 's4', lesson: MAT, level: 1, still: 0.5, title: { nl: 'Twee families', en: 'Two families' },
      beats: [
        { nl: 'Amorf stolt als glas; {t:Semi-kristallijn|semi-kristallijn} vormt kleine kristallen.', en: 'Amorphous sets like glass; {t:Semi-crystalline|semi-crystalline} forms tiny crystals.', cue: { 'Semi-kristallijn': 'semi' } },
        { nl: 'Amorf krimpt zo’n {n:0.5}%, semi-kristallijn vaak {n:1} tot {n:2}%.', en: 'Amorphous shrinks about {n:0.5}%, semi-crystalline often {n:1} to {n:2}%.', cues: ['semi'] },
      ],
    },
    {
      id: 's5', lesson: POL, level: 2, still: 0.5, title: { nl: 'Kluwen of kristal', en: 'Tangle or crystal' },
      beats: [
        { nl: 'In een {t:Amorf|amorfe} kunststof blijven de ketens een kluwen.', en: 'In an {t:Amorphous|amorphous} plastic the chains stay a tangle.', cue: { Amorf: 'amorf' } },
        { nl: 'Boven de {t:Glasovergangstemperatuur|glasovergangstemperatuur} wordt hij zacht: PC rond {n:145} °C.', en: 'Above the {t:Glass transition temperature|glass transition temperature} it softens: PC at about {n:145} °C.', cue: { Glasovergangstemperatuur: 'tg' } },
        { nl: 'Semi-kristallijn heeft een scherp smeltpunt: PA6 zo’n {n:220} °C.', en: 'Semi-crystalline has a sharp melting point: PA6 about {n:220} °C.', cues: ['semi'] },
        { nl: 'De {t:Kristalliniteit|kristalliniteit} groeit in een warmere matrijs.', en: 'The {t:Crystallinity|crystallinity} grows in a warmer mould.', cue: { Kristalliniteit: 'cryst' } },
      ],
    },
    {
      id: 's6', lesson: POL, level: 2, still: 0.5, title: { nl: 'Krimp en de matrijs', en: 'Shrinkage and the mould' },
      beats: [
        { nl: 'PP krimpt zo’n {n:1.5}%: voor {n:100} mm wordt de holte {n:101.5} mm.', en: 'PP shrinks about {n:1.5}%: for {n:100} mm the cavity is {n:101.5} mm.', cues: ['cavity'] },
        { nl: 'ABS krimpt zo’n {n:0.5}%: uit die holte komt {n:101.0} mm, te lang.', en: 'ABS shrinks about {n:0.5}%: that cavity gives {n:101.0} mm, too long.', cues: ['cavity'] },
        { nl: '{t:Nakrimp|Nakrimp}: na een te koude matrijs krimpt het product dagen door.', en: '{t:Post-shrinkage|Post-shrinkage}: after a too-cold mould the part shrinks for days.', cue: { Nakrimp: 'post' } },
        { nl: 'Amorf is maatvast, maar gevoelig voor {t:Spanningsscheuren|spanningsscheuren}.', en: 'Amorphous holds its size, but is prone to {t:Stress cracking|stress cracking}.', cue: { Spanningsscheuren: 'crack' } },
      ],
    },
    {
      id: 's7', lesson: DRY_, level: 3, still: 0.5, title: { nl: 'Wat water aanricht', en: 'What water does' },
      beats: [
        { nl: '{t:Restvocht|Restvocht}, typische grens: PC {n:0.02}%, PET {n:0.005}%.', en: '{t:Residual moisture|Residual moisture}, typical limit: PC {n:0.02}%, PET {n:0.005}%.', cue: { Restvocht: 'rest' } },
        { nl: '{t:Hydrolyse|Hydrolyse}: water knipt in de hete smelt de ketens door.', en: '{t:Hydrolysis|Hydrolysis}: water cuts the chains in the hot melt.', cue: { Hydrolyse: 'hydro' } },
        { nl: '{t:Overdrogen|Overdrogen} laat PA vergelen: droog op zo’n {n:80} °C.', en: '{t:Over-drying|Over-drying} yellows PA: dry at about {n:80} °C.', cue: { Overdrogen: 'over' } },
      ],
    },
    {
      id: 's8', lesson: DRY_, level: 3, still: 0.5, title: { nl: 'Meten en de droger', en: 'Measuring and the dryer' },
      beats: [
        { nl: 'De {t:Vochtmeter|vochtmeter} weegt, verwarmt en weegt opnieuw.', en: 'The {t:Moisture analyser|moisture analyser} weighs, heats and weighs again.', cue: { Vochtmeter: 'meter' } },
        { nl: '{n:20.000} g wordt {n:19.994} g: {n:0.03}%, boven de {n:0.02}%.', en: '{n:20.000} g becomes {n:19.994} g: {n:0.03}%, above the {n:0.02}%.', cues: ['meter'], read: { nl: '{n:0.006} g / {n:20} g = {n:0.03}%', en: '{n:0.006} g / {n:20} g = {n:0.03}%' } },
        { nl: 'Voor PET is er {t:Karl Fischer-titratie|Karl Fischer-titratie}: die meet alleen water.', en: 'For PET there is {t:Karl Fischer titration|Karl Fischer titration}: it measures only water.', cue: { 'Karl Fischer-titratie': 'kf' }, read: { nl: 'PET ≤ {n:0.005}%', en: 'PET ≤ {n:0.005}%' } },
        { nl: 'Verzadigd {t:Droogmiddel|droogmiddel}: het dauwpunt kruipt omhoog.', en: 'Saturated {t:Desiccant|desiccant}: the dew point creeps up.', cue: { Droogmiddel: 'desiccant' }, cues: ['dew'], read: { nl: 'dauwpunt −{n:40} → −15 °C', en: 'dew point −{n:40} → −15 °C' } },
      ],
    },
    {
      id: 's9', lesson: FIL, level: 4, still: 0.5, title: { nl: 'Glasvezel en recyclaat', en: 'Glass fibre and recyclate' },
      beats: [
        { nl: 'Glasvezel maakt stijf, maar geeft {t:Abrasie|abrasie}: slijtage van schroef en cilinder.', en: 'Glass fibre adds stiffness, but causes {t:Abrasion|abrasion}: wear of screw and barrel.', cue: { Abrasie: 'abr' }, cues: ['barrel'] },
        { nl: '{t:Vezeloriëntatie|Vezeloriëntatie}: de vezels gaan in de vloeirichting liggen.', en: '{t:Fibre orientation|Fibre orientation}: the fibres line up with the flow.', cue: { Vezeloriëntatie: 'fibre' } },
        { nl: '{t:Anisotrope krimp|Anisotrope krimp}: zo’n {n:0.3}% in de lengte, {n:0.7}% dwars.', en: '{t:Anisotropic shrinkage|Anisotropic shrinkage}: about {n:0.3}% along, {n:0.7}% across.', cue: { 'Anisotrope krimp': 'aniso' } },
        { nl: '{t:Recyclaat|Recyclaat} varieert per batch, ook in {t:Smeltindex|smeltindex}.', en: '{t:Recyclate|Recyclate} varies by batch, also in {t:Melt flow index|melt flow index}.', cue: { Recyclaat: 'recy', Smeltindex: 'mfi' } },
        { nl: 'Vergelijk per stuk, niet per kilo: {n:50} cm³ × {n:1.36} g/cm³ = {n:68} g.', en: 'Compare per part, not per kilo: {n:50} cm³ × {n:1.36} g/cm³ = {n:68} g.', read: { nl: '{n:68} g × € 4,00/kg ≈ € {n:0.272}', en: '{n:68} g × € 4.00/kg ≈ € {n:0.272}' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Units are written as said (graden,
// kilo, procent, millimeter); a term is named while its cue is lit.
const SAY = [
  [ // s1 from pellet to part
    { nl: 'Elk spuitgietproduct begint als korrels. Ze vallen uit de trechter in de verwarmde cilinder en smelten daar.',
      en: 'Every moulded part starts as pellets. They drop from the hopper into the heated barrel and melt there.' },
    { nl: 'Het zijn thermoplasten: warm worden ze vloeibaar, koud weer vast, keer op keer, net als kaarsvet.',
      en: 'They are thermoplastics: hot they turn liquid, cold they set again, over and over, like candle wax.' },
    { nl: 'Vier zie je overal: PP voor doppen en kratten, ABS voor behuizingen, PA of nylon voor sterke delen, PC voor heldere lenzen.',
      en: 'Four are everywhere: PP for caps and crates, ABS for housings, PA or nylon for strong parts, PC for clear lenses.' },
    { nl: 'Sommige korrels moeten eerst drogen; daarvoor staat deze droger naast de pers.',
      en: 'Some pellets must be dried first; that is what this dryer beside the press is for.' },
  ],
  [ // s2 moisture in the pellet
    { nl: 'Een {t:Hygroscopisch|hygroscopische} kunststof, zoals PA, PC, PET of PBT, neemt water op uit de lucht. PP nauwelijks.',
      en: 'A {t:Hygroscopic|hygroscopic} plastic, such as PA, PC, PET or PBT, absorbs water from the air. PP hardly does.' },
    { nl: 'De droger blaast droge, warme lucht door de korrels, meestal {n:2} tot {n:4} uur op {n:80} tot {n:120} graden.',
      en: 'The dryer blows dry, warm air through the pellets, typically {n:2} to {n:4} hours at {n:80} to {n:120} degrees.' },
    { nl: 'Het display toont het {t:Dauwpunt|dauwpunt}: de temperatuur waarbij het vocht in de lucht zou condenseren. Min {n:40} graden is heel droog.',
      en: 'The display shows the {t:Dew point|dew point}: the temperature at which the moisture in the air would condense. Minus {n:40} degrees is very dry.' },
    { nl: 'De pers verbruikt {n:12} kilo per uur en dit nylon droogt {n:4} uur, dus moet er {n:48} kilo in de trechter. Er past {n:50} in.',
      en: 'The press uses {n:12} kilos an hour and this nylon dries for {n:4} hours, so the hopper must hold {n:48} kilos. It holds {n:50}.' },
    { nl: 'Loopt hij ’s nachts leeg en gaat er dan {n:20} kilo natte korrels in, dan zijn die in {n:1.7} uur op. Niets heeft {n:4} uur gedroogd: brosse beugels.',
      en: 'If it runs empty at night and then {n:20} kilos of wet pellets go in, they are used up in {n:1.7} hours. None of it dried {n:4} hours: brittle brackets.' },
  ],
  [ // s3 splay, regrind and colour
    { nl: 'Nat materiaal geeft soms {t:Splay|splay}: zilverstrepen. Erger zijn producten die er goed uitzien en later breken.',
      en: 'Wet material sometimes gives {t:Splay|splay}: silver streaks. Worse are parts that look fine and break later.' },
    { nl: 'Via deze inlaat gaat {t:Maalgoed|maalgoed} terug: vermalen aanspuitingen en afkeur. Elke keer door de cilinder verzwakt de kunststof, dus klanten staan vaak {n:10} tot {n:25} procent toe, soms niets.',
      en: 'Through this inlet {t:Regrind|regrind} goes back in: ground runners and rejects. Each pass through the barrel weakens the plastic, so customers often allow {n:10} to {n:25} percent, sometimes none.' },
    { nl: 'De kleur komt meestal uit {t:Masterbatch|masterbatch}: geconcentreerde kleurkorrels, er gaat een paar procent bij.',
      en: 'The colour usually comes from {t:Masterbatch|masterbatch}: concentrated colour pellets, mixed in at a few percent.' },
    { nl: 'Een kleurwissel betekent spoelen; zwart naar wit duurt lang, dus plan van licht naar donker.',
      en: 'A colour change means purging; black to white takes long, so plan from light to dark.' },
  ],
  [ // s4 two families
    { nl: 'ABS en PC zijn amorf: ze stollen als glas. PP en PA zijn {t:Semi-kristallijn|semi-kristallijn}: ze vormen bij afkoelen piepkleine kristallen.',
      en: 'ABS and PC are amorphous: they set like glass. PP and PA are {t:Semi-crystalline|semi-crystalline}: they form tiny crystals as they cool.' },
    { nl: 'Amorf krimpt zo’n {n:0.5} procent, semi-kristallijn vaak {n:1} tot {n:2} procent en minder gelijkmatig, dus trekt het makkelijker krom.',
      en: 'Amorphous shrinks about {n:0.5} percent, semi-crystalline often {n:1} to {n:2} percent and less evenly, so it warps more easily.' },
  ],
  [ // s5 tangle or crystal
    { nl: 'In een {t:Amorf|amorfe} kunststof blijven de ketens bij het afkoelen kriskras verstrengeld, zonder scherp smeltpunt.',
      en: 'In an {t:Amorphous|amorphous} plastic the chains stay tangled at random as it cools, with no sharp melting point.' },
    { nl: 'Boven de {t:Glasovergangstemperatuur|glasovergangstemperatuur} wordt hij geleidelijk zacht, als warme toffee. Voor PC ligt die rond {n:145} graden.',
      en: 'Above the {t:Glass transition temperature|glass transition temperature} it softens gradually, like warm toffee. For PC that is around {n:145} degrees.' },
    { nl: 'Semi-kristallijn heeft wel een scherp smeltpunt, voor PA6 zo’n {n:220} graden. Daaronder stolt hij snel, dus spuit je hem snel in.',
      en: 'A semi-crystalline plastic does have a sharp melting point, about {n:220} degrees for PA6. Below it, it sets quickly, so you inject it fast.' },
    { nl: 'Het deel dat kristalliseert heet de {t:Kristalliniteit|kristalliniteit}. Hoe langzamer het product afkoelt, in een warmere matrijs, hoe meer kristallen.',
      en: 'The share that crystallises is the {t:Crystallinity|crystallinity}. The more slowly the part cools, in a warmer mould, the more crystals grow.' },
  ],
  [ // s6 shrinkage and the mould
    { nl: 'De holte wordt groter gefreesd, met de krimp erbij. PP krimpt zo’n {n:1.5} procent: voor een product van {n:100} millimeter wordt de holte {n:101.5}.',
      en: 'The cavity is cut larger, by the shrinkage. PP shrinks about {n:1.5} percent: for a {n:100} millimetre part the cavity is {n:101.5}.' },
    { nl: 'Spuit je in die holte ABS, dat zo’n {n:0.5} procent krimpt, dan wordt het product {n:101.0} millimeter: een millimeter te lang.',
      en: 'Mould ABS in that cavity, which shrinks about {n:0.5} percent, and the part comes out at {n:101.0} millimetres: a millimetre too long.' },
    { nl: 'Uit een te koude matrijs groeien de kristallen nog dagen door. Door die {t:Nakrimp|nakrimp} past het product bij de pers wel, en bij de klant niet.',
      en: 'From a too-cold mould the crystals keep growing for days. Because of that {t:Post-shrinkage|post-shrinkage}, the part fits at the press but not at the customer.' },
    { nl: 'Amorf krimpt gelijkmatiger. Zijn zwakke plek zijn {t:Spanningsscheuren|spanningsscheuren}: ingevroren spanning plus een schoonmaakmiddel geeft fijne scheurtjes.',
      en: 'Amorphous shrinks more evenly. Its weak spot is {t:Stress cracking|stress cracking}: frozen-in stress plus a cleaning agent gives fine cracks.' },
  ],
  [ // s7 what water does
    { nl: 'Elke kunststof heeft een grens voor {t:Restvocht|restvocht}, typisch {n:0.02} procent voor PC en {n:0.005} voor PET. Van een kilo is {n:0.02} procent maar {n:0.2} gram.',
      en: 'Every plastic has a limit for {t:Residual moisture|residual moisture}, typically {n:0.02} percent for PC and {n:0.005} for PET. Of a kilo, {n:0.02} percent is just {n:0.2} grams.' },
    { nl: 'In PC, PET en PBT geeft water {t:Hydrolyse|hydrolyse}: in de hete smelt knipt het de ketens door. Het product ziet er goed uit, maar is bros.',
      en: 'In PC, PET and PBT water causes {t:Hydrolysis|hydrolysis}: in the hot melt it cuts the chains. The part looks fine, but is brittle.' },
    { nl: 'Ook {t:Overdrogen|overdrogen}, te heet of te lang, schaadt: PA vergeelt. Daarom droogt PA op zo’n {n:80} graden, niet op {n:120}.',
      en: '{t:Over-drying|Over-drying}, too hot or too long, does harm too: PA turns yellow. That is why PA is dried at about {n:80} degrees, not {n:120}.' },
  ],
  [ // s8 measuring and the dryer
    { nl: 'De {t:Vochtmeter|vochtmeter} weegt een monster, verwarmt het en weegt opnieuw. Het gewichtsverlies is het vocht.',
      en: 'The {t:Moisture analyser|moisture analyser} weighs a sample, heats it and weighs it again. The weight loss is the moisture.' },
    { nl: 'Een monster PC van {n:20.000} gram weegt daarna {n:19.994}: {n:0.006} gram minder, {n:0.03} procent. Boven de grens van {n:0.02}, dus de lens mag niet draaien.',
      en: 'A PC sample of {n:20.000} grams then weighs {n:19.994}: {n:0.006} grams less, {n:0.03} percent. Above the {n:0.02} limit, so the lens must not run.' },
    { nl: 'Voor de lage grens van PET gebruikt het lab {t:Karl Fischer-titratie|Karl Fischer-titratie}, een chemische test die alleen op water reageert.',
      en: 'For PET’s low limit, the lab uses {t:Karl Fischer titration|Karl Fischer titration}, a chemical test that reacts only to water.' },
    { nl: 'Het {t:Droogmiddel|droogmiddel} in de torens haalt het water uit de lucht en wordt om beurten geregenereerd. Raakt het verzadigd, dan kruipt het dauwpunt omhoog, naar min vijftien. Check ook temperatuur, luchtdebiet en droogtijd.',
      en: 'The {t:Desiccant|desiccant} in the towers takes the water out of the air and is regenerated in turn. Once it is saturated, the dew point creeps up, to minus fifteen. Check temperature, airflow and drying time too.' },
  ],
  [ // s9 glass fibre and recyclate
    { nl: 'Glasvezel maakt een kunststof veel stijver; GF30 bevat er {n:30} procent van. Maar het glas slijpt schroef, cilinder en matrijs: {t:Abrasie|abrasie}.',
      en: 'Glass fibre makes a plastic much stiffer; GF30 holds {n:30} percent of it. But the glass wears screw, barrel and mould: {t:Abrasion|abrasion}.' },
    { nl: 'Bij het vullen gaan de vezels vanaf het aanspuitpunt in de stroming liggen: de {t:Vezeloriëntatie|vezeloriëntatie}.',
      en: 'While the mould fills, the fibres line up with the flow from the gate: the {t:Fibre orientation|fibre orientation}.' },
    { nl: 'In de vloeirichting krimpt het product veel minder dan dwars, zo’n {n:0.3} tegen {n:0.7} procent. Die {t:Anisotrope krimp|anisotrope krimp} laat het kromtrekken, dus het aanspuitpunt bepaalt hoe.',
      en: 'Along the flow the part shrinks much less than across it, about {n:0.3} against {n:0.7} percent. That {t:Anisotropic shrinkage|anisotropic shrinkage} makes it warp, so the gate decides how.' },
    { nl: '{t:Recyclaat|Recyclaat} is kunststof uit afval, opnieuw tot korrels gemaakt. De {t:Smeltindex|smeltindex}, hoe makkelijk de smelt vloeit, verschilt per batch. Vraag dus de spreiding, niet alleen het gemiddelde.',
      en: '{t:Recyclate|Recyclate} is plastic made from waste, pelletised again. The {t:Melt flow index|melt flow index}, how easily the melt flows, differs per batch. So ask for the spread, not just the average.' },
    { nl: 'Vergelijk per stuk, niet per kilo, want de dichtheid telt mee. Een beugel van {n:50} kubieke centimeter, dichtheid {n:1.36}, weegt {n:68} gram; bij vier euro per kilo zo’n {n:0.272} euro.',
      en: 'Compare per part, not per kilo, because density counts. A {n:50} cubic centimetre bracket at a density of {n:1.36} weighs {n:68} grams; at four euros a kilo that is about {n:0.272} euros.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Scene lengths from the captions (reading pace with some air), then reduced
// motion: each beat's still sits late in that beat, where the stage has drawn
// what the beat names.
const C = { W, H, WIN, PEL, KEYS, DRYER, SHRINK, CAVITY, ABS_PART, SAMPLE, LOSS, MOIST, BRACKET, GRAMS, GF, FACTS, HX, YC, IN_Z, OUT_Z, H_R, GLASS };
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 2.2 * s.beats.length);
  });
  C.dur = spec.scenes.map((s) => s.dur);
  const again = resolveFilm(spec, await allLessons());
  again.scenes.forEach((s, si) => {
    const st = beatStarts(s, 'nl').map((t) => t / s.dur);
    spec.scenes[si].beats.forEach((b, bi) => {
      const a = st[bi];
      const e = bi + 1 < st.length ? st[bi + 1] : 1;
      b.still = Math.round((a + 0.8 * (e - a)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, '../_kit/audio-warp.js'), 'utf8') + '\n' + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
.iso{--dr-glass:#06161A;--dr-screen:#06161A;--dr-lcd:#8FC3CF;--dr-seg:#2A4A4A;--dr-pel:#7C9289;--dr-wet:#5C9FAE;--dr-water:#8FC3CF;--dr-yellow:#C9B26A;--dr-mb:#E4DDCC}
.iso[data-theme="light"]{--dr-glass:#E4DCC9;--dr-screen:#1E3328;--dr-lcd:#BFD6D8;--dr-seg:#C2C3B2;--dr-pel:#7D877A;--dr-wet:#276F81;--dr-water:#276F81;--dr-yellow:#B08F2A;--dr-mb:#1E3328}
.dr-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.dr-glass{fill:var(--dr-glass);stroke:none}
.dr-screen{fill:var(--dr-screen);stroke:none}
.dr-lcd{fill:var(--dr-lcd);font-family:var(--anatomy-mono);font-weight:600;letter-spacing:0}
.dr-lcd-s{font-weight:500;opacity:.8}
.dr-led{fill:var(--dr-seg);stroke:none}
.dr-pel{fill:var(--dr-pel);stroke:none}
.dr-wet{fill:var(--dr-wet);stroke:none}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-svg .fp-tx{fill:var(--anatomy-text)}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-hatchc{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-shape{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-shape2{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-chain{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-xtal{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter2{fill:var(--anatomy-lo)}
.fp-band2{fill:var(--anatomy-mid);opacity:.22}
.fp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:5 4;vector-effect:non-scaling-stroke}
.fp-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-water{fill:var(--dr-water);stroke:none}
.fp-streak{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-linecap:round;opacity:.85;vector-effect:non-scaling-stroke}
.fp-yellow{fill:var(--dr-yellow)}
.fp-mbp{fill:var(--dr-mb)}
[data-cue][data-on] .fp-shape,[data-cue][data-on] .fp-shape2,[data-cue][data-on] .fp-frame{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-shape{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .fp-chain,[data-cue][data-on] .fp-xtal,[data-cue][data-on] .fp-hatchc,[data-cue][data-on] .fp-dash,[data-cue][data-on] .fp-arrow,[data-cue][data-on] .fp-streak{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-band2{fill:var(--fp-accent);opacity:.3}
[data-cue][data-on] .fp-mbp{fill:var(--fp-accent)}
.fp-solid{opacity:1}
`;

const label = {
  nl: 'De achterkant van een spuitgietpers: de cilinder met verwarmingsbanden, de trechtervoet en daarop een droogtrechter met kijkglas en een laadkop met een inlaat voor maalgoed. Naast de pers een droogmiddeldroger op wielen met twee droogmiddeltorens, een filter, een dauwpuntdisplay en een vochtmeter, en slangen voor droge en vochtige lucht. Daarover kaarten met een vochtige korrel, splay, maalgoed en masterbatch, de moleculen van amorfe en semi-kristallijne kunststoffen, krimp en de holtemaat, restvocht en hydrolyse, de vochtmeting, glasvezels in de stroming, recyclaat en de prijs per stuk.',
  en: 'The rear of an injection moulding press: the barrel with heater bands, the feed throat and on it a drying hopper with a sight glass and a loader with a regrind inlet. Beside the press a desiccant dryer on castors with two desiccant towers, a filter, a dew-point display and a moisture analyser, and hoses for dry and moist air. Over it cards with a moist pellet, splay, regrind and masterbatch, the molecules of amorphous and semi-crystalline plastics, shrinkage and the cavity size, residual moisture and hydrolysis, the moisture reading, glass fibres in the flow, recyclate and the price per part.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
