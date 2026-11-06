// Dev tool, not shipped. Builds the standalone figure for the topic
// "Matrijzen" (module Spuitgieten): the lessons eng.moulding.tooling (level 1),
// mouldparts (level 2), mouldcare (level 3) and newmould (level 4).
//
//   node figures/eng.moulding.mould/build.mjs            build the page
//   node figures/eng.moulding.mould/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.moulding.mould.html: one offline page
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
const OUT = join(ROOT, "src/content/courses/figures/eng.moulding.mould.html");

// ---------------------------------------------------------------- the model
// A two-cavity mould for a housing, opened in a vertical C-frame press: the
// fixed half (top) sits against the machine's nozzle, the moving half (bottom)
// carries the cores, the ejector plates and the shot counter. Numbers are the
// lessons' own:
//   Level 1 (tooling)     cold vs hot runner in words; maintenance every
//                         50,000–100,000 shots, read off the shot counter; a
//                         change 1–2 h, with SMED 15–30 min; a simple mould from
//                         about €20,000, 10–16 weeks to T1.
//   Level 2 (mouldparts)  the worked example: part 18 g, cold runner 6 g, shot
//                         2 × 18 + 6 = 42 g, runner 6 / 42 = 14 % (regrind limit
//                         15 %: just fits; 10 %: part is waste). A hot runner
//                         removes the 6 g. Cycle: cold 20 s (the mouldcare
//                         recall); hot 18 s is illustrative ("often a shorter
//                         cycle": no sprue to cool). Parts per hour = 2 × 3600 /
//                         cycle.
//   Level 3 (mouldcare)   the recall: cycle 20 s, 16 h a day → 2,880 shots a
//                         day; maintenance every 50,000 shots → 17.4 days. The
//                         counter starts 14,000 shots before the interval; a
//                         mould run past it shows flash on the parting line.
//   Level 4 (newmould)    the faded example: 1.5 M parts from a 2-cavity mould
//                         = 750,000 shots. Offer A, SPI class 103, € 45,000,
//                         under 500,000 cycles → two moulds, € 90,000, € 0.060
//                         a part; offer B, class 101, € 75,000, € 0.050 a part.
const PART_G = 18;
const CAV = 2;
const RUN_G = 6;
const CYCLE = { cold: 20, hot: 18 };
const HOURS = 16;
const PM = 50000;
const REGRIND = [15, 10];
const START = { total: 241360, since: 36000 };
const LIFE = { parts: 1500000, offers: { A: { cls: 103, price: 45000, life: 500000 }, B: { cls: 101, price: 75000, life: 1000000 } } };
const shotG = (runner) => CAV * PART_G + (runner === "cold" ? RUN_G : 0);
const perDay = (runner) => (HOURS * 3600) / CYCLE[runner];
const perHour = (runner) => (CAV * 3600) / CYCLE[runner];
const shotsNeeded = () => LIFE.parts / CAV;
const mouldsFor = (o) => Math.ceil(shotsNeeded() / LIFE.offers[o].life);
const costPer = (o) => (mouldsFor(o) * LIFE.offers[o].price) / LIFE.parts;
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(shotG("cold"), 42, 1e-9, "mouldparts example shot");
  near(Math.round((RUN_G / shotG("cold")) * 1000) / 10, 14.3, 1e-9, "mouldparts example runner share");
  near(Math.round((8 / (4 * 12 + 8)) * 1000) / 10, 14.3, 1e-9, "mouldparts recall runner share");
  near(15 * (2 - 0.5), 22.5, 1e-9, "tooling recall SMED hours");
  near(perDay("cold"), 2880, 1e-9, "mouldcare recall shots a day");
  near(Math.round((PM / perDay("cold")) * 10) / 10, 17.4, 1e-9, "mouldcare recall days");
  near(80000 / 2000, 40, 1e-9, "mouldcare pre days");
  near(Math.round((100000 / ((120 * 3600) / 12)) * 10) / 10, 2.8, 1e-9, "mouldcare example weeks");
  near(shotsNeeded(), 750000, 1e-9, "newmould example shots");
  near(mouldsFor("A"), 2, 1e-9, "offer A moulds");
  near(mouldsFor("B"), 1, 1e-9, "offer B moulds");
  near(costPer("A"), 0.06, 1e-12, "offer A per part");
  near(costPer("B"), 0.05, 1e-12, "offer B per part");
  near(90000 / 1200000, 0.075, 1e-12, "newmould recall per part");
  near(perHour("cold"), 360, 1e-9, "parts per hour cold");
}

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, +y toward the operator, +x to the right.
// A C-frame press: bed, column at the back, arm with the top platen and the
// injection barrel. The bottom platen rides on a ram; at rest (the pose drawn
// and audited) the mould is open by OPEN and the ejectors are back.
const WIDTH = 600;
const OPEN = 105; // opening stroke
const EJ = 22; // ejector stroke
const BED = { x: -175, y: -165, w: 350, d: 335, r: 4 };
const BED_Z = [6, 48];
const PLB = { x: -150, y: -95, w: 300, d: 200, r: 3 };
const PLB_Z = [62, 86];
const CLP = { x: -130, y: -80, w: 260, d: 160, r: 2 }; // clamp plates
const MP = { x: -110, y: -80, w: 220, d: 160, r: 2 }; // mould plates
const ZB = { clamp: [86, 101], spacer: [101, 151], support: [151, 163], core: [163, 196] };
const PF = 196; // parting face of the moving half, open
const PFT = PF + OPEN; // parting face of the fixed half
const ZT = { a: [PFT, PFT + 42], top: [PFT + 42, PFT + 70] };
const PLT = { x: -150, y: -95, w: 300, d: 200, r: 3 };
const PLT_Z = [ZT.top[1], ZT.top[1] + 26];
const COL = { x: -100, y: -165, w: 200, d: 58, r: 3 };
const ARM = { x: -112, y: -165, w: 224, d: 265, r: 3 };
const ARM_Z = [PLT_Z[1], PLT_Z[1] + 38];
const CAVS = [-56, 56];
const PART = { w: 64, d: 50, h: 22, r: 6 };
const CORE = { w: 54, d: 40, h: 18, r: 4 };
const RUN_R = 4;
const SPRUE = [5.5, 2.5];
const FRONT = MP.y + MP.d; // 80, front face of the mould plates
const NIP_Y = [-14, 12]; // cooling couplings on the right side faces
const SIDE = MP.x + MP.w; // 110
const HOSE_X = PLB.x + PLB.w + 6; // 156, hoses run down the platens' right faces
const NIP_ZB = 179, NIP_ZT = PFT + 21;
const MAN = { y: -30, d: 58 };
const CNT = { x0: -102, x1: -52, z0: 168, z1: 190 }; // shot counter face
const CNT_Y = FRONT + 9;

const FIT = [
  ...k.boxCorners(BED, 0, BED_Z[1]),
  ...k.boxCorners(ARM, ARM_Z[0], ARM_Z[1] + 52),
  ...k.boxCorners({ x: PLT.x, y: PLT.y, w: PLT.w, d: PLT.d + 14 }, PLB_Z[0], PLT_Z[1]),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 56);
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
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameUp = (o) => G.frameOf(o, Zv, X, Y);
const frameDown = (o) => G.frameOf(o, [0, 0, -1], X, Y);
const fix = (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(3);
// a 2D frame in the plane y = py: u along +x, v down
function planeMatrix(ox, py, oz) {
  const p0 = at([ox, py, oz]);
  const p1 = at([ox + 1, py, oz]);
  const p2 = at([ox, py, oz - 1]);
  return `matrix(${[p1[0] - p0[0], p1[1] - p0[1], p2[0] - p0[0], p2[1] - p0[1], p0[0], p0[1]].map(fix).join(" ")})`;
}
const plateCard = (pts) => `<path class="mp-card" d="${k.pathOf(pts.map(at), true)}"/>`;
const centred = (cx, cy, w, d, r) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });

// ---------------------------------------------------------------- recorder
// Pieces: "b" the moving half (bottom platen and everything on it) closes by
// OPEN; "e" the ejected set (ejector plates, parts, runner) moves with it and
// rises EJ more when the ejectors push (share EJ / OPEN with b at 0).
const MOVES = { b: [0, 0, OPEN], e: [0, 0, OPEN] };
const R = A.recorder(P, { order: ["b", "e"], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { piece = "", bias = 0, attrs = "", ...rest } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece, move: piece ? MOVES[piece] : [0, 0, 0], attrs: (piece ? ` data-g="${piece}"` : "") + attrs, ...rest });
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
function turned(name, F, profile, style = {}, { extra = "", inner = "", owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: "mid", ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
function hose(name, route, r, opts = {}) {
  const id = R.nameFor(name);
  R.route(id, route, r, { owner: id, piece: opts.piece ?? "", move: opts.piece ? MOVES[opts.piece] : [0, 0, 0] });
  tubePieces(route, r, P, { maxLength: 16 }).forEach((part, index) =>
    put(`${id}:${index}`, part.mid, tubeSvg(part, { tone: opts.tone ?? "lo" }), [A.tube(part.points, part.radii, { name: id, owner: id })], { route: id, chunk: index, piece: opts.piece ?? "", attrs: opts.attrs ?? "" }),
  );
}

// ---------------------------------------------------------------- bed and feet
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BED, -4), 0, 2, P)}"/>`];
for (const [x, y] of k.corners(BED, 18)) post("stand.foot", x, y, 11, 0, BED_Z[0], { tone: "lo" }, { steps: 24, ground: true });
{
  const fy = BED.y + BED.d;
  const screws = [BED.x + 10, BED.x + BED.w - 10].flatMap((x) => [[x, fy, BED_Z[0] + 8], [x, fy, BED_Z[1] - 8]]);
  const lx = -150;
  const label = [[lx, fy, 38], [lx + 64, fy, 38], [lx + 64, fy, 18], [lx, fy, 18]];
  // vent slots on the bed's right side, closed
  const sx = BED.x + BED.w;
  const slots = [];
  for (let i = 0; i < 6; i++) {
    const y0 = -120 + i * 34;
    slots.push(k.pathOf([[sx, y0, 20], [sx, y0 + 22, 20], [sx, y0 + 22, 34], [sx, y0, 34]].map(at), true));
  }
  const extra =
    `<path class="mp-slot" d="${slots.join("")}"/>` +
    plateCard(label) +
    L([33, 28, 23].map((z, i) => k.segment([lx + 6, fy, z], [lx + 6 + [40, 30, 50][i], fy, z], P)).join(""), { tone: "lo", free: true }) +
    Dt(screws.map(at), { size: 0.5 });
  const top = k.planOutline(k.insetPlan(BED, 6), BED_Z[1], P, 3);
  box("stand.bed", BED, BED_Z[0], BED_Z[1], { tone: "lo" }, { steps: 3, bevel: 0.8, inner: L(top + k.sideSeam(BED, 27, P, 3), { tone: "faint" }), extra, ground: true });
}
// a tote for the parts at the front left, an e-stop box at the front right
{
  const tote = { x: -160, y: 114, w: 96, d: 50, r: 3 };
  const rim = k.insetPlan(tote, 3);
  const zt = BED_Z[1] + 28;
  const inside = `<path class="mp-slot" d="${k.planOutline(rim, zt, P, 3)}"/>`;
  const tops = [[-138, 136], [-96, 142]].map(([cx, cy]) => `<path class="mp-inpart" d="${k.planOutline(centred(cx, cy, 30, 22, 3), zt - 4, P, 3)}"/>`).join("");
  const clip = `<clipPath id="mm-tote"><path d="${k.planOutline(rim, zt, P, 3)}"/></clipPath><g clip-path="url(#mm-tote)">${tops}</g>`;
  box("tote", tote, BED_Z[1], zt, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(tote, zt - 8, P, 3), { tone: "faint" }), extra: inside + clip });
}
{
  const eb = { x: 96, y: 124, w: 50, d: 36, r: 2 };
  const ez = BED_Z[1] + 24;
  box("estop.box", eb, BED_Z[1], ez, { tone: "mid" }, { steps: 2, bevel: 0.5, extra: Dt(k.corners(eb, 4).map(([x, y]) => at([x, y, ez])), { size: 0.4 }) + plateCard([[eb.x + 6, eb.y + eb.d, ez - 6], [eb.x + 24, eb.y + eb.d, ez - 6], [eb.x + 24, eb.y + eb.d, ez - 14], [eb.x + 6, eb.y + eb.d, ez - 14]]) });
  post("estop.collar", 121, 142, 11, ez, ez + 3, { tone: "lo" }, { steps: 32 });
  post("estop.stem", 121, 142, 5, ez + 3, ez + 7, { tone: "mid" }, { steps: 20 });
  post("estop.head", 121, 142, 9, ez + 7, ez + 12, { tone: "hi", crease: "lo" }, { steps: 32, bevel: 1.2 });
}
// ram gland on the bed and the ram (rebuilt live as it rises)
post("bed.gland", 0, 0, 46, BED_Z[1], BED_Z[1] + 4, { tone: "mid" }, { steps: 40, bevel: 0.4, extra: Dt([0, 1, 2, 3, 4, 5, 6, 7].map((i) => at([41 * Math.cos((i * Math.PI) / 4 + 0.2), 41 * Math.sin((i * Math.PI) / 4 + 0.2), BED_Z[1] + 4])), { size: 0.45 }) });
{
  const z0 = BED_Z[1] + 4;
  const shape = R.solid(A.cylinder(0, 0, 32, z0, PLB_Z[0] - z0, { name: "ram" }));
  put("ram", [0, 0, (z0 + PLB_Z[0]) / 2], `<g data-ram="">${S(k.cylinder(0, 0, 32, z0, PLB_Z[0] - z0, P, 40), { tone: "hi", crease: "none" })}</g>`, [shape]);
}

// ---------------------------------------------------------------- column, arm, top platen and barrel
{
  // the column's visible right face: a cabinet door with hinges and a handle,
  // vent slots above it and a type plate
  const fx = COL.x + COL.w;
  const z0 = BED_Z[1], z1 = ARM_Z[0];
  const y0 = COL.y + 8, y1 = COL.y + COL.d - 8;
  const onX = (pts) => k.pathOf(pts.map(([y, z]) => at([fx, y, z])), true);
  const door = onX([[y0, 96], [y1, 96], [y1, 300], [y0, 300]]);
  const handle = onX([[y1 - 9, 186], [y1 - 5, 186], [y1 - 5, 214], [y1 - 9, 214]]);
  const slots = [];
  for (let i = 0; i < 4; i++) { const z = 318 + i * 13; slots.push(onX([[y0 + 4, z], [y1 - 4, z], [y1 - 4, z + 5], [y0 + 4, z + 5]])); }
  const label = [[fx, y0 + 4, 84], [fx, y1 - 4, 84], [fx, y1 - 4, 64], [fx, y0 + 4, 64]];
  const extra =
    `<path class="mp-slot" d="${slots.join("")}"/>` +
    L(door + handle, { tone: "lo" }) +
    plateCard(label) +
    L([79, 74, 69].map((z, i) => k.segment([fx, y0 + 8, z], [fx, y0 + 8 + [30, 22, 34][i], z], P)).join(""), { tone: "lo", free: true }) +
    Dt([[fx, y0 + 3, 120], [fx, y0 + 3, 276], [fx, y1 - 7, 200]].map(at), { size: 0.5 }) +
    Dt([[fx, COL.y + 4, z0 + 8], [fx, COL.y + COL.d - 4, z0 + 8], [fx, COL.y + 4, z1 - 6], [fx, COL.y + COL.d - 4, z1 - 6]].map(at), { size: 0.45 });
  box("frame.column", COL, z0, z1, { tone: "mid" }, { steps: 3, bevel: 0.8, extra });
}
{
  const fy = ARM.y + ARM.d;
  const screws = [ARM.x + 8, ARM.x + ARM.w - 8].flatMap((x) => [[x, fy, ARM_Z[0] + 8], [x, fy, ARM_Z[1] - 8]]);
  box("frame.arm", ARM, ARM_Z[0], ARM_Z[1], { tone: "mid" }, { steps: 3, bevel: 0.8, inner: L(k.planOutline(k.insetPlan(ARM, 6), ARM_Z[1], P, 3), { tone: "faint" }), extra: Dt(screws.map(at), { size: 0.5 }) });
}
{
  const fy = PLT.y + PLT.d;
  const screws = [PLT.x + 8, PLT.x + PLT.w - 8].map((x) => [x, fy, (PLT_Z[0] + PLT_Z[1]) / 2]);
  box("frame.top-platen", PLT, PLT_Z[0], PLT_Z[1], { tone: "mid" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLT, PLT_Z[0] + 6, P, 3), { tone: "faint" }), extra: Dt(screws.map(at), { size: 0.5 }) });
}
{
  // the injection barrel standing on the arm, its nozzle down through the arm
  const z0 = ARM_Z[1];
  post("barrel.flange", 0, -20, 34, z0, z0 + 6, { tone: "mid" }, { steps: 40, bevel: 0.4, extra: Dt([0, 1, 2, 3, 4, 5].map((i) => at([29 * Math.cos((i * Math.PI) / 3 + 0.5), -20 + 29 * Math.sin((i * Math.PI) / 3 + 0.5), z0 + 6])), { size: 0.45 }) });
  // the barrel with three heater bands, one turned body
  const prof = [[0, 20]];
  for (const zb of [4, 18, 32]) prof.push([zb, 20], [zb, 23], [zb + 8, 23], [zb + 8, 20]);
  prof.push([44, 20]);
  turned("barrel.tube", frameUp([0, -20, z0 + 6]), prof, { tone: "hi", crease: "lo" });
  post("barrel.cap", 0, -20, 24, z0 + 50, z0 + 56, { tone: "mid" }, { steps: 32, bevel: 0.6 });
  // feed throat and hopper on the barrel
  turned("barrel.hopper", frameUp([0, -20, z0 + 56]), [[0, 9], [8, 9], [8, 16], [26, 30], [30, 30]], { tone: "mid" }, { extra: `<path class="mp-slot" d="${k.ring(0, -20, 26.5, z0 + 86, P, 40)}"/>` + `<g class="mp-pellets">${Array.from({ length: 22 }, (_, i) => { const a = i * 2.39996, r = 4 + 20 * Math.sqrt((i + 0.5) / 22); const [px, py] = at([r * Math.cos(a), -20 + r * Math.sin(a), z0 + 84.5]); return `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="0.9"/>`; }).join("")}</g>` });
  // the injection carriage: two cylinders that press the nozzle onto the mould
  for (const x of [-52, 52]) {
    post("barrel.carriage-foot", x, -20, 13, z0, z0 + 4, { tone: "lo" }, { steps: 28 });
    post("barrel.carriage", x, -20, 10, z0 + 4, z0 + 40, { tone: "mid" }, { steps: 28, inner: L(k.sideArc(x, -20, 10, z0 + 12, P, 20) + k.sideArc(x, -20, 10, z0 + 32, P, 20), { tone: "faint" }) });
    post("barrel.carriage-cap", x, -20, 11.5, z0 + 40, z0 + 45, { tone: "mid" }, { steps: 28, bevel: 0.5, extra: Dt([at([x, -20, z0 + 45])], { size: 0.5, tone: "hi" }) });
  }
  // cable duct along the back of the arm
  const duct = { x: -100, y: ARM.y + 6, w: 200, d: 18, r: 1 };
  box("arm.duct", duct, z0, z0 + 14, { tone: "lo" }, { steps: 1, bevel: 0.3, inner: L([-50, 0, 50].map((x) => k.segment([x, duct.y + duct.d, z0], [x, duct.y + duct.d, z0 + 14], P) + k.segment([x, duct.y, z0 + 14], [x, duct.y + duct.d, z0 + 14], P)).join(""), { tone: "faint" }) });
  // lifting eyes on the arm's front corners
  for (const x of [ARM.x + 22, ARM.x + ARM.w - 22]) post("arm.eye", x, ARM.y + ARM.d - 22, 7, z0, z0 + 4, { tone: "mid" }, { steps: 6, extra: `<path class="mp-slot" d="${k.ring(x, ARM.y + ARM.d - 22, 3, z0 + 4, P, 16)}"/>` });
}

// ---------------------------------------------------------------- the fixed half (top)
{
  const fy = FRONT;
  const lx = -100;
  const label = [[lx, fy, PFT + 32], [lx + 44, fy, PFT + 32], [lx + 44, fy, PFT + 12], [lx, fy, PFT + 12]];
  const screws = [MP.x + 8, MP.x + MP.w - 8].map((x) => [x, fy, PFT + 34]);
  const extra = plateCard(label) + L([PFT + 27, PFT + 22, PFT + 17].map((z, i) => k.segment([lx + 5, fy, z], [lx + 5 + [30, 22, 34][i], fy, z], P)).join(""), { tone: "lo", free: true }) + Dt(screws.map(at), { size: 0.45 });
  box("fixed.a-plate", MP, ZT.a[0], ZT.a[1], { tone: "mid" }, { steps: 2, bevel: 0.6, extra });
}
{
  const fy = FRONT;
  const screws = [CLP.x + 6, CLP.x + CLP.w - 6, -40, 40].map((x) => [x, fy, (ZT.top[0] + ZT.top[1]) / 2]);
  box("fixed.top-plate", CLP, ZT.top[0], ZT.top[1], { tone: "mid" }, { steps: 2, bevel: 0.6, extra: Dt(screws.map(at), { size: 0.45 }) });
}
// strap clamps holding the top clamp plate to the top platen (from below)
for (const sx of [-1, 1]) {
  for (const yc of [-45, 45]) {
    const heel = sx > 0 ? { x: 134, y: yc - 12, w: 12, d: 24, r: 1 } : { x: -146, y: yc - 12, w: 12, d: 24, r: 1 };
    const strap = sx > 0 ? { x: 114, y: yc - 12, w: 32, d: 24, r: 1 } : { x: -146, y: yc - 12, w: 32, d: 24, r: 1 };
    box("fixed.clamp-heel", heel, ZT.top[0], PLT_Z[0], { tone: "lo" }, { steps: 1, bevel: 0.3 });
    box("fixed.clamp", strap, ZT.top[0] - 8, ZT.top[0], { tone: "mid" }, { steps: 1, bevel: 0.3 });
    post("fixed.clamp-bolt", sx * 127, yc, 6, ZT.top[0] - 14, ZT.top[0] - 8, { tone: "mid" }, { steps: 6, extra: Dt([at([sx * 127, yc, ZT.top[0] - 14])], { size: 0.4 }) });
  }
}
// cooling couplings on the fixed half's right side, hoses up to the top platen's manifold
for (const y of NIP_Y) {
  const F = frameX([SIDE, y, NIP_ZT]);
  discAt("fixed.nipple-hex", F, 0, 4, 6, { tone: "mid" }, { steps: 6 });
  discAt("fixed.nipple", F, 4, 12, 4, { tone: "hi", crease: "lo" }, { steps: 20 });
}
{
  const blk = { x: PLT.x + PLT.w, y: MAN.y, w: 12, d: MAN.d, r: 1 };
  box("fixed.manifold", blk, PLT_Z[0] + 2, PLT_Z[1] - 2, { tone: "mid" }, { steps: 1, bevel: 0.3, extra: Dt([[blk.x + blk.w, MAN.y + 4, PLT_Z[1] - 6], [blk.x + blk.w, MAN.y + MAN.d - 4, PLT_Z[1] - 6]].map(at), { size: 0.4 }) });
  for (const y of NIP_Y) {
    discAt("fixed.manifold-nipple", frameDown([HOSE_X, y, PLT_Z[0] + 2]), 0, 8, 4, { tone: "hi", crease: "lo" }, { steps: 20 });
    hose("fixed.hose", G.fillet([[SIDE + 12, y, NIP_ZT], [HOSE_X, y, NIP_ZT], [HOSE_X, y, PLT_Z[0] - 6]], 12, 7, { P, tube: 3.4 }), 3.4);
  }
}
// hot runner: the heater-zone box on the top plate, its cable straight up to a
// junction box on the arm
const HOT_Y = 116;
{
  const hb = { x: -52, y: FRONT, w: 40, d: HOT_Y - FRONT + 8, r: 1 };
  const z0 = ZT.top[0] + 4, z1 = ZT.top[1] - 4;
  const fy = hb.y + hb.d;
  box("hot.box", hb, z0, z1, { tone: "mid" }, { steps: 1, bevel: 0.3, attrs: ' data-hot=""', extra: Dt([[hb.x + 4, fy, z0 + 3], [hb.x + hb.w - 4, fy, z0 + 3], [hb.x + 4, fy, z1 - 3], [hb.x + hb.w - 4, fy, z1 - 3]].map(at), { size: 0.4 }) + `<g data-zones="">${[-41, -23].map((x) => `<circle class="mp-zone" cx="${at([x, fy, z0 + 9])[0].toFixed(2)}" cy="${at([x, fy, z0 + 9])[1].toFixed(2)}" r="1.4"/>`).join("")}</g>` });
  discAt("hot.socket", frameUp([-32, HOT_Y, z1]), 0, 7, 4.6, { tone: "hi", crease: "lo" }, { steps: 20, attrs: ' data-hot=""' });
  const jb = { x: -50, y: ARM.y + ARM.d, w: 36, d: HOT_Y - (ARM.y + ARM.d) + 10, r: 1 };
  const jz0 = ARM_Z[0] + 4, jz1 = ARM_Z[1] - 4;
  box("hot.junction", jb, jz0, jz1, { tone: "mid" }, { steps: 1, bevel: 0.3, attrs: ' data-hot=""', extra: Dt([[jb.x + 4, jb.y + jb.d, jz1 - 3], [jb.x + jb.w - 4, jb.y + jb.d, jz1 - 3]].map(at), { size: 0.4 }) });
  discAt("hot.arm-socket", frameDown([-32, HOT_Y, jz0]), 0, 7, 4.6, { tone: "hi", crease: "lo" }, { steps: 20, attrs: ' data-hot=""' });
  hose("hot.cable", [[-32, HOT_Y, z1 + 7], [-32, HOT_Y, jz0 - 7]], 2.6, { tone: "mid", attrs: ' data-hot=""' });
}

// ---------------------------------------------------------------- the moving half (bottom), piece b
const B = { piece: "b" };
{
  const fy = PLB.y + PLB.d;
  const screws = [PLB.x + 8, PLB.x + PLB.w - 8].map((x) => [x, fy, (PLB_Z[0] + PLB_Z[1]) / 2]);
  // T-slots on the platen top, closed slots either side of the mould
  const slots = [];
  for (const x0 of [-146, 118]) for (const y0 of [-70, 30]) slots.push(k.pathOf([[x0, y0, PLB_Z[1]], [x0 + 28, y0, PLB_Z[1]], [x0 + 28, y0 + 6, PLB_Z[1]], [x0, y0 + 6, PLB_Z[1]]].map(at), true));
  box("move.platen", PLB, PLB_Z[0], PLB_Z[1], { tone: "mid" }, { ...B, steps: 3, bevel: 0.6, inner: L(k.sideSeam(PLB, PLB_Z[0] + 6, P, 3), { tone: "faint" }), extra: Dt(screws.map(at), { size: 0.5 }) });
}
box("move.clamp-plate", CLP, ZB.clamp[0], ZB.clamp[1], { tone: "mid" }, { ...B, steps: 2, bevel: 0.5, extra: Dt([CLP.x + 6, CLP.x + CLP.w - 6].map((x) => at([x, FRONT, (ZB.clamp[0] + ZB.clamp[1]) / 2])), { size: 0.45 }) });
for (const sx of [-1, 1]) {
  for (const yc of [-45, 45]) {
    const heel = sx > 0 ? { x: 134, y: yc - 12, w: 12, d: 24, r: 1 } : { x: -146, y: yc - 12, w: 12, d: 24, r: 1 };
    const strap = sx > 0 ? { x: 114, y: yc - 12, w: 32, d: 24, r: 1 } : { x: -146, y: yc - 12, w: 32, d: 24, r: 1 };
    box("move.clamp-heel", heel, PLB_Z[1], ZB.clamp[1], { tone: "lo" }, { ...B, steps: 1, bevel: 0.3 });
    box("move.clamp", strap, ZB.clamp[1], ZB.clamp[1] + 8, { tone: "mid" }, { ...B, steps: 1, bevel: 0.3 });
    post("move.clamp-bolt", sx * 127, yc, 6, ZB.clamp[1] + 8, ZB.clamp[1] + 14, { tone: "mid" }, { ...B, steps: 6, extra: Dt([at([sx * 127, yc, ZB.clamp[1] + 14])], { size: 0.4, tone: "hi" }) });
  }
}
// spacer blocks (rails) with the open ejector box between them
for (const x0 of [MP.x, MP.x + MP.w - 28]) {
  box("move.spacer", { x: x0, y: MP.y, w: 28, d: MP.d, r: 1 }, ZB.spacer[0], ZB.spacer[1], { tone: "mid" }, { ...B, steps: 2, bevel: 0.4, extra: Dt([at([x0 + 14, FRONT, ZB.spacer[0] + 8]), at([x0 + 14, FRONT, ZB.spacer[1] - 8])], { size: 0.45 }) });
}
const E = { piece: "e" };
{
  const ep = { x: -78, y: -72, w: 156, d: 144, r: 1.5 };
  box("eject.plate", ep, ZB.spacer[0], ZB.spacer[0] + 12, { tone: "lo" }, { ...E, steps: 2, bevel: 0.3, owner: "eject", extra: Dt([-60, 60].map((x) => at([x, ep.y + ep.d, ZB.spacer[0] + 6])), { size: 0.4 }) });
  box("eject.retainer", ep, ZB.spacer[0] + 12, ZB.spacer[0] + 23, { tone: "mid" }, { ...E, steps: 2, bevel: 0.3, owner: "eject", extra: Dt([-60, -20, 20, 60].map((x) => at([x, ep.y + ep.d, ZB.spacer[0] + 17.5])), { size: 0.4 }) });
}
box("move.support", MP, ZB.support[0], ZB.support[1], { tone: "mid" }, { ...B, steps: 2, bevel: 0.4 });
// the core plate: parting face with ejector-pin heads, runner groove, vents;
// live ejector pins and the counter are drawn with it
const PINS = [];
for (const cx of CAVS) for (const sx of [-1, 1]) for (const sy of [-1, 1]) PINS.push([cx + sx * 29.5, sy * 20.5]);
PINS.push([-12, 0], [12, 0]);
{
  const fy = FRONT;
  const pinHeads = PINS.map(([x, y]) => k.ring(x, y, 2, PF, P, 16)).join("");
  const groove = k.planOutline({ x: -24, y: -RUN_R, w: 48, d: 2 * RUN_R, r: RUN_R }, PF, P, 6);
  const vents = CAVS.map((cx) => k.planOutline({ x: cx - 12, y: -25 - 9, w: 24, d: 4, r: 2 }, PF, P, 3)).join("");
  const screws = [MP.x + 8, MP.x + MP.w - 8].map((x) => [x, fy, ZB.core[0] + 6]);
  const extra =
    L(pinHeads, { tone: "lo" }) +
    `<g data-cold="">${L(groove, { tone: "lo" })}</g>` +
    L(vents, { tone: "faint" }) +
    Dt(screws.map(at), { size: 0.45 }) +
    `<g data-pins=""></g>`;
  box("move.core-plate", MP, ZB.core[0], ZB.core[1], { tone: "mid" }, { ...B, steps: 2, bevel: 0.6, inner: L(k.planOutline(k.insetPlan(MP, 4), PF, P, 2), { tone: "faint" }), extra });
}
for (const [x, y] of k.corners(MP, 14)) {
  post("move.leader-pin", x, y, 7, PF, PF + 34, { tone: "hi", crease: "lo" }, { ...B, steps: 24, bevel: 1.2, inner: L(k.sideArc(x, y, 7, PF + 6, P, 16), { tone: "faint" }) });
}
CAVS.forEach((cx, i) => {
  box(`move.core`, centred(cx, 0, CORE.w, CORE.d, CORE.r), PF, PF + CORE.h, { tone: "mid", crease: "lo" }, { ...B, steps: 4, bevel: 0.8, owner: `cav${i}`, inner: L(k.planOutline(k.insetPlan(centred(cx, 0, CORE.w, CORE.d, CORE.r), 6), PF + CORE.h, P, 3), { tone: "faint" }) });
});
// cold runner: the runner bar and the sprue standing on it (ejected set)
{
  const Fb = frameX([-24, 0, PF + RUN_R]);
  const Fs = frameUp([0, 0, PF + 2 * RUN_R - 2]);
  const prof = [[0, SPRUE[0]], [ZT.top[1] - PFT - (2 * RUN_R - 2), SPRUE[1]]];
  const shapes = [R.solid(A.disc(Fb, 0, 48, RUN_R, { name: "runner", owner: "runner" })), R.solid(A.solid(Fs, prof, { name: "runner", owner: "runner" }))];
  const svgR = S(G.disc(0, 48, RUN_R, Fb, P, { steps: 20 }), { tone: "hi", crease: "lo" }) + S(G.solidOf(prof, Fs, P), { tone: "hi", crease: "lo" });
  put("runner", [0, 0, PF + 20], svgR, shapes, { ...E, attrs: ' data-cold="" data-shot=""' });
}
// the two parts on their cores (ejected set): housings 18 g each
CAVS.forEach((cx, i) => {
  const plan = centred(cx, 0, PART.w, PART.d, PART.r);
  const gate = [cx + (cx < 0 ? 26 : -26), 0, PF + PART.h];
  box(`part.${i}`, plan, PF, PF + PART.h, { tone: "hi", lit: true, crease: "lo" }, {
    ...E,
    steps: 4,
    bevel: 1,
    owner: `cav${i}`,
    attrs: ' data-shot=""',
    inner: L(k.planOutline(k.insetPlan(plan, 7), PF + PART.h, P, 3), { tone: "lo" }),
    extra: Dt([at(gate)], { size: 0.5, tone: "hi" }) + `<path class="mp-flash" data-flash="" d="${k.planOutline(k.insetPlan(plan, -3.2), PF + 0.3, P, 4)}${k.planOutline(plan, PF + 0.3, P, 4)}" fill-rule="evenodd"/>`,
  });
});
// shot counter on the front of the core plate, with its window drawn live
{
  const cb = { x: CNT.x0 - 3, y: FRONT, w: CNT.x1 - CNT.x0 + 6, d: CNT_Y - FRONT, r: 1 };
  const m = planeMatrix(CNT.x0, CNT_Y + 0.01, CNT.z1);
  const cw = CNT.x1 - CNT.x0, ch = CNT.z1 - CNT.z0;
  const face = `<g transform="${m}"><rect class="mw-scr" x="2" y="6" width="${cw - 4}" height="${ch - 9}" rx="1"/><g data-count=""></g><rect class="mw-scr-rim" x="2" y="6" width="${cw - 4}" height="${ch - 9}" rx="1"/></g>` + Dt([[cb.x + 2.4, CNT_Y, CNT.z1 - 2.4], [cb.x + cb.w - 2.4, CNT_Y, CNT.z1 - 2.4]].map(at), { size: 0.4 });
  box("move.counter", cb, CNT.z0 - 3, CNT.z1 + 3, { tone: "mid" }, { ...B, steps: 1, bevel: 0.3, extra: face });
}
// cooling couplings on the moving half's right side, hoses down to the platen manifold
for (const y of NIP_Y) {
  const F = frameX([SIDE, y, NIP_ZB]);
  discAt("move.nipple-hex", F, 0, 4, 6, { tone: "mid" }, { ...B, steps: 6 });
  discAt("move.nipple", F, 4, 12, 4, { tone: "hi", crease: "lo" }, { ...B, steps: 20 });
}
{
  const blk = { x: PLB.x + PLB.w, y: MAN.y, w: 12, d: MAN.d, r: 1 };
  box("move.manifold", blk, PLB_Z[0] + 2, PLB_Z[1] - 2, { tone: "mid" }, { ...B, steps: 1, bevel: 0.3, extra: Dt([[blk.x + blk.w, MAN.y + 4, PLB_Z[0] + 6], [blk.x + blk.w, MAN.y + MAN.d - 4, PLB_Z[0] + 6]].map(at), { size: 0.4 }) });
  for (const y of NIP_Y) {
    discAt("move.manifold-nipple", frameUp([HOSE_X, y, PLB_Z[1] - 2]), 0, 8, 4, { tone: "hi", crease: "lo" }, { ...B, steps: 20 });
    hose("move.hose", G.fillet([[SIDE + 12, y, NIP_ZB], [HOSE_X, y, NIP_ZB], [HOSE_X, y, PLB_Z[1] + 6]], 12, 7, { P, tube: 3.4 }), 3.4, { piece: "b" });
  }
}

// ---------------------------------------------------------------- settle and assemble
const SH = EJ / OPEN;
const STATES = [
  ...[0.25, 0.5].map((s) => ({ label: `close ${s}`, shares: { b: s, e: s } })),
  { label: "ejected", shares: { b: 0, e: SH } },
];
// (closed, the sprue and the leader pins sit inside the fixed half, as in the
// real mould; the parts and runner are hidden then and the fixed half is drawn
// over the moving half, so only the open poses are settled and checked)
A.settle(R, P, { states: [0, ...STATES] });
R.items.sort((a, b) => a.key - b.key);
if (process.env.ORDER) console.log(R.items.map((i, n) => n + " " + i.name).join("\n"));
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups, `<g data-mark=""></g>`];

const LABEL_NL =
  "Een verticale spuitgietpers met een C-frame: een machinebed, een kolom achter en een arm met de bovenste opspanplaat en de cilinder van de spuiteenheid. Daartussen hangt een tweeplatenmatrijs, open. Boven de vaste helft met koelwaterkoppelingen; onder de bewegende helft op een plunjer, met twee kernen, een koudkanaal met aanspuitkegel, uitwerppennen, het uitwerppakket tussen de steunblokken en een shotteller. Per niveau gaat de matrijs open en dicht, toont het koud- of heetkanaal met aanspuitafval en cyclus, telt de shots tot het onderhoud of rekent de matrijskosten per product.";
const LABEL_EN =
  "A vertical C-frame injection moulding press: a machine bed, a column at the back and an arm carrying the top platen and the injection barrel. Between them hangs a two-plate mould, open. Above, the fixed half with cooling-water couplings; below, the moving half on a ram, with two cores, a cold runner with its sprue, ejector pins, the ejector plates between the spacer blocks and a shot counter. Depending on the level, the mould opens and closes, shows cold or hot runner with runner waste and cycle, counts shots up to maintenance, or works out the mould cost per part.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "fixed", at: [-60, FRONT, PFT + 30] },
  { key: "moving", at: [-30, FRONT, ZB.core[0] + 16] },
  { key: "sprue", at: [0, 0, PF + 46], cold: true },
  { key: "runner", at: [-14, 0, PF + 2 * RUN_R], cold: true },
  { key: "part", at: [56, 0, PF + PART.h] },
  { key: "core", at: [-56, 22, PF + 8] },
  { key: "pins", at: [-28, 20, PF] },
  { key: "eject", at: [0, 72, ZB.spacer[0] + 17] },
  { key: "leader", at: [96, 66, PF + 30] },
  { key: "cooling", at: [SIDE + 8, 0, NIP_ZB] },
  { key: "counter", at: [-78, CNT_Y, 180] },
  { key: "hot", at: [-32, HOT_Y, ZT.top[0] + 14], hot: true },
  { key: "clamp", at: [127, 45, ZB.clamp[1] + 10] },
  { key: "nozzle", at: [0, 3, ARM_Z[1] + 30] },
  { key: "hopper", at: [0, 10, ARM_Z[1] + 80] },
  { key: "tote", at: [-112, 164, BED_Z[1] + 20] },
  { key: "estop", at: [121, 151, BED_Z[1] + 36] },
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
  --mp-hair:rgba(240,233,218,.12);--mp-accent:#5C9FAE;--mp-hole:#071A1E;--mp-flash:rgba(92,159,174,.9);--mp-zone:#5C9FAE;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --mp-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mw-scr-bg:#06171B;--mw-scr-ink:#D9E4DE;--mw-scr-acc:#6FB3C2;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --mp-hair:rgba(11,41,27,.14);--mp-accent:#276F81;--mp-hole:#D5CCB6;--mp-flash:rgba(39,111,129,.85);--mp-zone:#276F81;
  --mw-scr-bg:#0D2A2E;--mw-scr-ink:#EAF0EA;--mw-scr-acc:#7FC0CE;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--mp-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:1;--lines:5;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--mp-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="1"] .iso-plate{--lines:6}
html[data-level="3"] .iso-plate{--lines:4}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--mp-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.mp-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-acc{color:var(--mp-accent);font-weight:600}
.mp-strong{color:var(--anatomy-strong);font-weight:600}
.mp-mute{color:var(--anatomy-muted)}
.mp-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.mp-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.mp-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.mp-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.mp-row{display:flex;gap:4px;height:44px;align-items:center}
.mp-row[hidden]{display:none}
.mp-group{display:flex;gap:4px;height:44px;min-width:0}
.mp-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--mp-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--mp-hair);display:inline-flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap;overflow:hidden}
.mp-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.mp-btn[aria-checked="true"],.mp-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--mp-accent);color:var(--mp-accent);font-weight:600}
.mp-play{flex:0 0 52px}
.mp-play svg{width:14px;height:14px;fill:currentColor}
.mp-play [data-icon="pause"]{display:none}
.mp-play[aria-pressed="true"] [data-icon="pause"]{display:block}
.mp-play[aria-pressed="true"] [data-icon="play"]{display:none}
.mp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mp-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mp-slot{fill:var(--mp-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mp-flash{fill:var(--mp-flash);stroke:none;opacity:0}
.mp-zone{fill:var(--mp-zone);stroke:none;opacity:.35}
.mp-inpart{fill:var(--anatomy-lit-top);stroke:var(--anatomy-lit);stroke-width:var(--anatomy-weight)}
.mp-pellets circle{fill:var(--anatomy-mid);stroke:none}
html[data-runner="hot"] [data-cold]{display:none}
html:not([data-runner="hot"]) [data-hot]{display:none}
.mw-scr{fill:var(--mw-scr-bg);stroke:none}
.mw-scr-rim{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.s-t{font-family:var(--anatomy-mono);fill:var(--mw-scr-ink)}
.s-a{font-family:var(--anatomy-mono);fill:var(--mw-scr-acc);font-weight:700}
.mp-mark{fill:none;stroke:var(--mp-accent);stroke-width:1.4px}
.mp-mark-dot{fill:var(--mp-accent);stroke:none}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const OPEN = ${OPEN}, EJ = ${EJ}, PF = ${PF}, BASE_Z = ${BED_Z[1] + 4}, PLB_Z0 = ${PLB_Z[0]};
const PART_G = ${PART_G}, CAV = ${CAV}, RUN_G = ${RUN_G}, CYCLE = ${JSON.stringify(CYCLE)}, HOURS = ${HOURS}, PM = ${PM}, REGRIND = ${JSON.stringify(REGRIND)};
const START = ${JSON.stringify(START)}, LIFE = ${JSON.stringify(LIFE)};
const PINS = ${JSON.stringify(PINS)}, PARTS = ${JSON.stringify(PARTS)};
const CW = ${CNT.x1 - CNT.x0}, CH = ${CNT.z1 - CNT.z0};
const shotG = ${shotG.toString()};
const perDay = ${perDay.toString()};
const perHour = ${perHour.toString()};
const shotsNeeded = ${shotsNeeded.toString()};
const mouldsFor = ${mouldsFor.toString()};
const costPer = ${costPer.toString()};

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
const root = document.documentElement;
root.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",", shot: "shot", tapPart: "tap a part to name it",
      phase: { close: "closing", fill: "injecting", cool: "cooling", open: "opening", eject: "ejecting", take: "parts out", back: "ejectors back", rest: "mould open" },
      l1cold: "cold runner: sets with the parts, ejected as regrind", l1pm: "maintenance every 50,000–100,000 shots, by the counter", l1smed: "mould change 1–2 h · with SMED 15–30 min", l1cost: "simple mould from ~€ 20,000 · 10–16 weeks to T1",
      shotCold: "shot = 2 × 18 g + 6 g runner = 42 g", shotHot: "shot = 2 × 18 g + 0 g runner = 36 g", shareCold: "runner 6 / 42 = 14 % · regrind limit 15 %: fits; 10 %: waste", shareHot: "no runner waste · dearer mould; a heater zone can burn out",
      cyc: "cycle", perH: "parts/h", runDay: "kg runner a day", illus: "(illustrative)",
      counter: "counter", sincePm: "since maintenance", aDay: "shots/day", every: "maintenance every", days: "days", left: "left", over: "overdue", ok: "runs", flash: "flash on the parting line → to the toolroom", done: "maintained at", logged: "logged in the mould logbook", wait: "plan it at the next order change",
      need: "1,500,000 parts / 2 cavities = 750,000 shots", offer: "offer", cls: "class", life: "cycles", under: "under", over1: "1 million +", moulds: "moulds needed", per: "a part", cheaper: "less over the life", vs: "vs", mould: "mould", worn: "worn: flash", runs: "runs", second: "new T1 and PPAP",
      parts: { fixed: ["Fixed half", "against the nozzle, forms the outside"], moving: ["Moving half", "opens; holds the cores and ejectors"], sprue: ["Sprue", "cone channel from the nozzle into the mould"], runner: ["Runner (cold)", "spreads the plastic over the cavities; 6 g a shot"], part: ["Part: housing", "18 g, stays on the core when the mould opens"], core: ["Core", "forms the inside; walls need draft (~1°)"], pins: ["Ejector pins", "push the part off; leave a small round mark"], eject: ["Ejector plates", "carry all pins; pushed by the machine"], leader: ["Leader pin", "lines the halves up as they close"], cooling: ["Cooling-water couplings", "quick couplings into the cooling channels"], counter: ["Shot counter", "+1 every cycle: says when maintenance is due"], hot: ["Hot runner: heater zones", "keeps the plastic molten up to the gates"], clamp: ["Clamp", "holds the clamp plate on the platen"], nozzle: ["Injection barrel and nozzle", "the nozzle sits on the sprue bushing"], hopper: ["Hopper", "dried pellets feed the screw"], tote: ["Tote", "good parts; the runner goes to the grinder"], estop: ["Emergency stop", "stops the press at once"] } }
  : { dec: ",", grp: ".", shot: "shot", tapPart: "tik een onderdeel voor de naam",
      phase: { close: "sluiten", fill: "inspuiten", cool: "koelen", open: "openen", eject: "uitwerpen", take: "producten eruit", back: "uitwerpers terug", rest: "matrijs open" },
      l1cold: "koudkanaal: stolt mee, wordt uitgeworpen als maalgoed", l1pm: "onderhoud elke 50.000–100.000 shots, op de shotteller", l1smed: "matrijswissel 1–2 uur · met SMED 15–30 min", l1cost: "eenvoudige matrijs vanaf ~€ 20.000 · 10–16 weken tot T1",
      shotCold: "shot = 2 × 18 g + 6 g aanspuiting = 42 g", shotHot: "shot = 2 × 18 g + 0 g aanspuiting = 36 g", shareCold: "aanspuiting 6 / 42 = 14 % · maalgoed ≤ 15 %: past net; bij 10 %: deel afval", shareHot: "geen aanspuitafval · duurdere matrijs; een zone kan doorbranden",
      cyc: "cyclus", perH: "producten/uur", runDay: "kg aanspuiting per dag", illus: "(illustratief)",
      counter: "teller", sincePm: "sinds onderhoud", aDay: "shots/dag", every: "onderhoud elke", days: "dagen", left: "nog", over: "over tijd", ok: "draait", flash: "braam op de deellijn → naar de gereedschapmakerij", done: "onderhouden bij", logged: "vastgelegd in het matrijslogboek", wait: "plan het bij de volgende orderwissel",
      need: "1.500.000 producten / 2 holtes = 750.000 shots", offer: "offerte", cls: "klasse", life: "cycli", under: "onder", over1: "1 miljoen +", moulds: "matrijzen nodig", per: "per product", cheaper: "minder over de levensduur", vs: "t.o.v.", mould: "matrijs", worn: "versleten: braam", runs: "draait", second: "opnieuw T1 en PPAP",
      parts: { fixed: ["Vaste helft", "zit tegen de spuitmond, vormt de zichtkant"], moving: ["Bewegende helft", "gaat open; draagt kernen en uitwerpers"], sprue: ["Aanspuitkegel", "kegelvormig kanaal van spuitmond naar matrijs"], runner: ["Verdeelkanaal (koud)", "verdeelt de kunststof over de holtes; 6 g per shot"], part: ["Product: behuizing", "18 g, blijft op de kern als de matrijs opengaat"], core: ["Kern", "vormt de binnenkant; wanden met lossingshoek (~1°)"], pins: ["Uitwerppennen", "duwen het product eraf; laten een rond merkje"], eject: ["Uitwerppakket", "platen met alle pennen; de machine duwt ze"], leader: ["Geleidepen", "lijnt de helften uit bij het sluiten"], cooling: ["Koelwaterkoppelingen", "snelkoppelingen naar de koelkanalen"], counter: ["Shotteller", "+1 per cyclus: zegt wanneer onderhoud nodig is"], hot: ["Heetkanaal: verwarmingszones", "houdt de kunststof vloeibaar tot de aanspuitpunten"], clamp: ["Spanklauw", "zet de opspanplaat vast op de machineplaat"], nozzle: ["Cilinder en spuitmond", "de spuitmond drukt op de aanspuitbus"], hopper: ["Trechter", "gedroogd granulaat naar de schroef"], tote: ["Bak", "goede producten; de aanspuiting gaat naar de maler"], estop: ["Noodstop", "zet de pers direct stil"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const grouped = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);
const euro = (v) => "€ " + grouped(v);

const stage = document.querySelector(".mp-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { ram: q("[data-ram]"), pins: q("[data-pins]"), count: q("[data-count]"), mark: q("[data-mark]"), zones: [...svg.querySelectorAll(".mp-zone")], flash: [...svg.querySelectorAll("[data-flash]")], b: [...svg.querySelectorAll('.it[data-g="b"]')], e: [...svg.querySelectorAll('.it[data-g="e"]')], shot: [...svg.querySelectorAll(".it[data-shot]")] };
const lines = [...document.querySelectorAll("[data-readout] .mp-line")];
const announcer = document.querySelector(".mp-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
const UP = (() => { const a = iso([0, 0, 0], P), b = iso([0, 0, 1], P); return [b[0] - a[0], b[1] - a[1]]; })();

// ------------------------------------------------ state
const st = { runner: "cold", total: START.total, since: START.since, shown: START.total, offer: "A", life: 0, lifeShown: 0, lifeRun: false, done: -1 };
const PHASES = [["close", 0.9], ["fill", 0.5], ["cool", 0.8], ["open", 0.9], ["eject", 0.45], ["take", 0.6], ["back", 0.5]];
const anim = { i: 3, t: 0.9, b: 0, ej: 0, show: 1 };
let playing = !still.matches && LVL !== 4;

function pose() {
  const [name, dur] = PHASES[anim.i];
  const u = ease(anim.t / dur);
  let b = 0, ej = 0, show = 1;
  if (name === "close") { b = u; show = 0; }
  else if (name === "fill" || name === "cool") { b = 1; show = 0; }
  else if (name === "open") { b = 1 - u; }
  else if (name === "eject") { ej = u; }
  else if (name === "take") { ej = 1; show = 1 - u; }
  else { ej = 1 - u; show = 0; }
  anim.b = b; anim.ej = ej; anim.show = show;
}
function onPhase(name) {
  if (name === "fill" && LVL <= 3) { st.total += 1; st.since += 1; st.shown = st.total; }
}
function advance(dt) {
  anim.t += dt;
  while (anim.t >= PHASES[anim.i][1]) { anim.t -= PHASES[anim.i][1]; anim.i = (anim.i + 1) % PHASES.length; onPhase(PHASES[anim.i][0]); }
  pose();
}

// ------------------------------------------------ drawing
const tr = (dz) => "translate(" + (UP[0] * dz).toFixed(2) + " " + (UP[1] * dz).toFixed(2) + ")";
const tx = (x, y, s, cls, text, anchor) => '<text class="' + cls + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + s + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + ">" + text + "</text>";
let lastRam = -1, lastPins = -1, lastCount = "";
function flashLevel() {
  if (LVL === 3) return st.since > PM ? clamp((st.since - PM) / 3000 + 0.35, 0, 1) : 0;
  if (LVL === 4) { const o = LIFE.offers[st.offer]; const used = st.lifeShown % o.life; return st.lifeShown < shotsNeeded() && used > 0.9 * o.life ? clamp((used - 0.9 * o.life) / (0.05 * o.life), 0, 1) : 0; }
  return 0;
}
function draw() {
  const bz = anim.b * OPEN, ez = bz + anim.ej * EJ;
  const tb = tr(bz), te = tr(ez);
  el.b.forEach((n) => n.setAttribute("transform", tb));
  el.e.forEach((n) => n.setAttribute("transform", te));
  el.shot.forEach((n) => { n.style.opacity = anim.show.toFixed(3); });
  if (Math.abs(bz - lastRam) > 0.05) { lastRam = bz; el.ram.innerHTML = solidSvg(cylinder(0, 0, 32, BASE_Z, PLB_Z0 - BASE_Z + bz, P, 40), { tone: "hi", crease: "none" }); }
  // ejector pins standing out of the parting face while the ejectors push
  const pz = anim.ej * EJ;
  if (Math.abs(pz - lastPins) > 0.05) {
    lastPins = pz;
    el.pins.innerHTML = pz > 0.3 ? PINS.filter((p, i) => st.runner === "cold" || i < PINS.length - 2).map(([x, y]) => solidSvg(cylinder(x, y, 2, PF, pz, P, 14), { tone: "hi", crease: "none" })).join("") : "";
  }
  const f = flashLevel();
  el.flash.forEach((n) => { n.style.opacity = f.toFixed(3); });
  el.zones.forEach((n) => { n.style.opacity = st.runner === "hot" ? "1" : ".35"; });
  // the counter's window
  const value = LVL === 4 ? Math.round(st.lifeShown % LIFE.offers[st.offer].life) : Math.round(st.shown);
  const digits = String(value).padStart(7, "0");
  const cnt = tx(CW / 2, CH - 5.6, 8.2, LVL === 3 && st.since > PM ? "s-a" : "s-t", digits, "middle");
  if (cnt !== lastCount) { el.count.innerHTML = cnt; lastCount = cnt; }
  if (marked >= 0) {
    const [x, y] = iso(PARTS[marked].at, P);
    const moves = ["moving", "sprue", "runner", "part", "core", "pins", "eject", "leader", "cooling", "counter", "clamp"].includes(PARTS[marked].key);
    const dz = moves ? (["sprue", "runner", "part", "eject"].includes(PARTS[marked].key) ? ez : bz) : 0;
    el.mark.innerHTML = '<g transform="' + tr(dz) + '"><circle class="mp-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="mp-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/></g>';
  } else el.mark.innerHTML = "";
  readout();
}

// ------------------------------------------------ readout
let marked = -1;
const acc = (s) => '<span class="mp-acc">' + s + "</span>";
const strong = (s) => '<span class="mp-strong">' + s + "</span>";
function phaseName() { return still.matches || !playing ? (anim.b < 0.01 ? T.phase.rest : T.phase[PHASES[anim.i][0]]) : T.phase[PHASES[anim.i][0]]; }
function readout() {
  const out = [];
  const r = st.runner;
  if (LVL === 1) {
    out.push(strong(phaseName()) + " · " + T.counter + " " + grouped(st.shown));
    out.push(T.l1cold);
    out.push(T.l1pm);
    out.push(T.l1smed);
    out.push(T.l1cost);
  } else if (LVL === 2) {
    out.push(strong(r === "cold" ? T.shotCold : T.shotHot));
    out.push(r === "cold" ? T.shareCold : T.shareHot);
    out.push(T.cyc + " " + CYCLE[r] + " s" + (r === "hot" ? " " + T.illus : "") + " → " + strong(grouped(perHour(r)) + " " + T.perH) + (r === "cold" ? " · " + fmt((perDay(r) * RUN_G) / 1000, 1) + " " + T.runDay : ""));
    out.push(strong(phaseName()) + " · " + T.counter + " " + grouped(st.shown));
  } else if (LVL === 3) {
    const left = (PM - st.since) / perDay(r);
    out.push(T.counter + " " + strong(grouped(st.shown)) + " · " + T.sincePm + " " + (st.since > PM ? acc(grouped(st.since)) : grouped(st.since)) + " / " + grouped(PM));
    out.push(T.cyc + " " + CYCLE[r] + " s · " + HOURS + " h → " + grouped(perDay(r)) + " " + T.aDay);
    out.push(T.every + " " + grouped(PM) + " = " + fmt(PM / perDay(r), 1) + " " + T.days + " · " + (left >= 0 ? T.left + " " + fmt(left, 1) + " " + T.days : acc(T.over + " " + fmt(-left, 1) + " " + T.days)));
    out.push(st.since > PM ? acc(T.flash) : st.done >= 0 && st.since < perDay(r) ? T.done + " " + grouped(st.done) + ": " + T.logged : strong(T.ok) + " · " + T.wait);
  } else {
    const o = LIFE.offers[st.offer], other = st.offer === "A" ? "B" : "A";
    const n = mouldsFor(st.offer);
    const used = Math.min(st.lifeShown, shotsNeeded());
    const no = Math.min(n, Math.floor(used / o.life) + 1);
    out.push(T.need);
    out.push(T.offer + " " + st.offer + " · " + T.cls + " " + o.cls + " · " + (o.life >= 1000000 ? T.over1 : T.under + " " + grouped(o.life)) + " " + T.life + " · " + euro(o.price));
    out.push(T.moulds + " " + strong(String(n)) + " → " + euro(n * o.price) + " → " + strong(euro(0).replace("0", "") + fmt(costPer(st.offer), 3) + " " + T.per));
    const diff = (mouldsFor("A") * LIFE.offers.A.price) - (mouldsFor("B") * LIFE.offers.B.price);
    out.push("B " + T.vs + " A: " + acc(euro(diff) + " " + T.cheaper));
    out.push(T.shot + " " + grouped(used) + " / " + grouped(shotsNeeded()) + " · " + T.mould + " " + no + " · " + (flashLevel() > 0.05 ? acc(T.worn) : no > 1 ? acc(T.second) : T.runs));
  }
  if (LVL <= 2) out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : '<span class="mp-mute">' + T.tapPart + "</span>");
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

// ------------------------------------------------ loop
let frame = 0, lastT = 0, visible = false;
function busy() { return playing || Math.abs(st.shown - st.total) > 0.5 || (LVL === 4 && st.lifeShown < st.life - 0.5); }
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  if (still.matches) { st.shown = st.total; st.lifeShown = st.life; }
  else {
    if (playing) advance(dt);
    st.shown += (st.total - st.shown) * (1 - Math.exp(-dt / 0.35));
    if (Math.abs(st.total - st.shown) < 0.5) st.shown = st.total;
    if (LVL === 4 && st.lifeShown < st.life) { st.lifeShown = Math.min(st.life, st.lifeShown + dt * shotsNeeded() / 6); if (st.lifeShown >= st.life) { setPlay(false); } }
  }
  draw();
  frame = visible && !still.matches && busy() ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { lastT = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) { st.shown = st.total; st.lifeShown = st.life; draw(); } else run(); };

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll(".mp-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const playBtns = [...document.querySelectorAll(".mp-play")];
function setPlay(on) {
  if (LVL === 4) { playing = false; if (on) { st.life = shotsNeeded(); if (st.lifeShown >= shotsNeeded() - 0.5) st.lifeShown = 0; if (still.matches) st.lifeShown = st.life; } else if (st.lifeShown < st.life) st.life = st.lifeShown; }
  else playing = on && !still.matches;
  sync();
}
function sync() {
  root.setAttribute("data-runner", st.runner);
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  const on = LVL === 4 ? st.lifeShown < st.life - 0.5 : playing;
  playBtns.forEach((b) => { b.setAttribute("aria-pressed", String(on)); b.setAttribute("aria-label", on ? b.dataset.pause : b.dataset.play); });
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }
function changed() { sync(); readout(); announce(); kick(); }
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  if (key === "runner") { st.runner = val; if (marked >= 0 && ((PARTS[marked].cold && val === "hot") || (PARTS[marked].hot && val === "cold"))) marked = -1; }
  else if (key === "offer") { st.offer = val; st.life = 0; st.lifeShown = 0; }
  lastPins = -1;
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
    event.stopPropagation();
    items[next].click();
    items[next].focus();
  });
});
playBtns.forEach((b) => b.addEventListener("click", () => { setPlay(!(LVL === 4 ? st.lifeShown < st.life - 0.5 : playing)); changed(); }));
function addDay() { const n = Math.round(perDay(st.runner)); st.total += n; st.since += n; if (still.matches) st.shown = st.total; changed(); }
function maintain() { st.done = st.total; st.since = 0; changed(); }
const dayBtn = document.querySelector("[data-day]");
const pmBtn = document.querySelector("[data-pm]");
if (dayBtn) dayBtn.addEventListener("click", addDay);
if (pmBtn) pmBtn.addEventListener("click", maintain);

// tap the drawing: at levels 1 and 2 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function shownParts() { return PARTS.map((p, i) => i).filter((i) => !(PARTS[i].cold && st.runner === "hot") && !(PARTS[i].hot && st.runner === "cold")); }
function nearestPart([x, y]) {
  let best = -1, bestD = 70;
  shownParts().forEach((i) => { const [px, py] = iso(PARTS[i].at, P); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) return;
  marked = nearestPart(toView(event));
  draw(); announce(); kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  const list = shownParts();
  if (LVL <= 2 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { marked = list[(list.indexOf(marked) + 1) % list.length]; draw(); announce(); }
  else if (LVL <= 2 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { marked = list[(list.indexOf(marked) + list.length - 1 + (marked < 0 ? 1 : 0)) % list.length]; draw(); announce(); }
  else if (event.key === " " || event.key === "Enter") { setPlay(!(LVL === 4 ? st.lifeShown < st.life - 0.5 : playing)); changed(); }
  else if (LVL === 3 && event.key === "+") addDay();
  else if (LVL === 3 && (event.key === "m" || event.key === "M")) maintain();
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
pose();
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) tick(performance.now()); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => {
  if (still.matches) { cancelAnimationFrame(frame); frame = 0; playing = false; anim.i = 3; anim.t = PHASES[3][1]; pose(); sync(); tick(performance.now()); }
  else { playing = LVL !== 4; sync(); run(); }
});
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Matrijzen",
    hint1: "Tik een onderdeel · speel de cyclus",
    hint2: "Tik een onderdeel · kies koud- of heetkanaal",
    hint3: "Draai een dag · plan het onderhoud op tijd",
    hint4: "Kies een offerte en speel de levensduur af",
    play: "Speel de cyclus",
    pause: "Pauze",
    playLife: "Speel de levensduur",
    runners: "Aanspuitsysteem",
    cold: "Koudkanaal",
    hot: "Heetkanaal",
    coldS: "Koud",
    hotS: "Heet",
    day: "+1 dag",
    pm: "Onderhoud",
    offers: "Offerte",
    offA: "A · kl. 103",
    offB: "B · kl. 101",
    cycle: "Cyclus",
    life: "Levensduur",
    label: LABEL_NL,
    aria: "Een open tweeplatenmatrijs in een verticale spuitgietpers. Niveau 1 en 2: pijltjes kiezen een onderdeel. Spatie speelt de cyclus af of pauzeert. Niveau 3: plus draait een dag, M doet onderhoud.",
  },
  en: {
    title: "Moulds",
    hint1: "Tap a part · play the cycle",
    hint2: "Tap a part · pick cold or hot runner",
    hint3: "Run a day · plan maintenance in time",
    hint4: "Pick an offer and play the product life",
    play: "Play the cycle",
    pause: "Pause",
    playLife: "Play the product life",
    runners: "Runner system",
    cold: "Cold runner",
    hot: "Hot runner",
    coldS: "Cold",
    hotS: "Hot",
    day: "+1 day",
    pm: "Maintain",
    offers: "Offer",
    offA: "A · cl. 103",
    offB: "B · cl. 101",
    cycle: "Cycle",
    life: "Life",
    label: LABEL_EN,
    aria: "An open two-plate mould in a vertical injection moulding press. Levels 1 and 2: arrows pick a part. Space plays or pauses the cycle. Level 3: plus runs a day, M maintains.",
  },
};

const sN = STRINGS.nl;
const ICONS = `<svg viewBox="0 0 14 14" aria-hidden="true" data-icon="play"><path d="M3.5 2.2v9.6l8-4.8z"/></svg><svg viewBox="0 0 14 14" aria-hidden="true" data-icon="pause"><path d="M3.2 2.4h2.6v9.2H3.2zM8.2 2.4h2.6v9.2H8.2z"/></svg>`;
const radio = (set, text, attr) => `<button type="button" class="mp-btn" role="radio" data-set="${set}"${attr ? ` data-t="${attr}"` : ""} aria-checked="false" tabindex="-1">${text}</button>`;
const play = (labelKey, wide, textKey) => `<button type="button" class="mp-btn mp-play"${wide ? ' style="flex:1 1 0"' : ""} data-play="${sN[labelKey]}" data-pause="${sN.pause}" data-t-play="${labelKey}" aria-label="${sN[labelKey]}" aria-pressed="false">${ICONS}${textKey ? `<span data-t="${textKey}">${sN[textKey]}</span>` : ""}</button>`;
const controls = [
  `<div class="mp-controls">`,
  `<div class="mp-row" data-levels="1">${play("play", true, "cycle")}</div>`,
  `<div class="mp-row" data-levels="2">${play("play", false)}<div class="mp-group" style="flex:1 1 auto" role="radiogroup" aria-label="${sN.runners}" data-t-label="runners">${radio("runner:cold", sN.cold, "cold")}${radio("runner:hot", sN.hot, "hot")}</div></div>`,
  `<div class="mp-row" data-levels="3"><div class="mp-group" style="flex:2 1 0" role="radiogroup" aria-label="${sN.runners}" data-t-label="runners">${radio("runner:cold", sN.coldS, "coldS")}${radio("runner:hot", sN.hotS, "hotS")}</div><button type="button" class="mp-btn" data-day="" data-t="day">${sN.day}</button><button type="button" class="mp-btn" data-pm="" data-t="pm">${sN.pm}</button></div>`,
  `<div class="mp-row" data-levels="4"><div class="mp-group" style="flex:2 1 0" role="radiogroup" aria-label="${sN.offers}" data-t-label="offers">${radio("offer:A", sN.offA, "offA")}${radio("offer:B", sN.offB, "offB")}</div>${play("playLife", true, "life")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="mp-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="mp-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="mp-line"></span>'.repeat(6)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));d.setAttribute("data-level",String(l>=1&&l<=4?l:2));d.setAttribute("data-runner","cold");
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=s["hint"+lv]||s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
document.querySelectorAll("[data-t]").forEach(function(n){n.textContent=s[n.getAttribute("data-t")];});
document.querySelectorAll("[data-t-label]").forEach(function(n){n.setAttribute("aria-label",s[n.getAttribute("data-t-label")]);});
document.querySelectorAll("[data-t-play]").forEach(function(n){n.dataset.play=s[n.getAttribute("data-t-play")];n.dataset.pause=s.pause;n.setAttribute("aria-label",n.dataset.play);});
var st=document.querySelector(".mp-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: shot cold ${shotG("cold")} g (runner ${((RUN_G / shotG("cold")) * 100).toFixed(1)} %) · hot ${shotG("hot")} g · ${perDay("cold")} shots/day → PM every ${(PM / perDay("cold")).toFixed(1)} days · A €${costPer("A").toFixed(3)} B €${costPer("B").toFixed(3)} per part`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

// closing frames are left out of the clearance check: there the sprue and the
// leader pins enter the fixed half through its sprue bushing and guide bushings
A.auditOrExit(R, P, { frames: STATES.filter((s) => s.label === "ejected"), apart: false, cover: ["part.0", "part.1"] });
