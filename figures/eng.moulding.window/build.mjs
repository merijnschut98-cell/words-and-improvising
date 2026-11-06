// Dev tool, not shipped. Builds the standalone figure for the topic
// "Procesinstelling" (module Spuitgieten): the lessons eng.moulding.setup
// (level 1), process (level 2), scientific (level 3) and validation (level 4).
//
//   node figures/eng.moulding.window/build.mjs            build the page
//   node figures/eng.moulding.window/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.moulding.window.html: one offline page
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
const OUT = join(ROOT, "src/content/courses/figures/eng.moulding.window.html");

// ---------------------------------------------------------------- the model
// The press's control panel beside a bench scale with the last shot on it: a
// PP lid. The panel shows what the level is about; the scale weighs the part.
//   Level 1 (setup)       the setting sheet of the lesson's worked example:
//                         melt 230 °C, mould 40 °C, 80 mm/s, switchover at
//                         12 mm from a 60 mm shot stroke, hold 400 bar for 4 s,
//                         cooling 10 s. Fill time (60 − 12) / 80 = 0.6 s; cycle
//                         0.6 + 4 + 10 + 4 (open, eject, close) = 18.6 s.
//   Level 2 (process)     the process window over melt temperature T and hold
//                         pressure p. Short shot below p_s(T) = 400 − 8·(T − 220)
//                         bar, flash above p_f(T) = 400 + 10·(250 − T) bar, so at
//                         400 bar the window is 220–250 °C, the lesson's example
//                         (the slopes are illustrative). Part weight: the
//                         level-3 gate-freeze curve at 400 bar, + 0.06 g per
//                         100 bar of extra packing; a short shot weighs
//                         f = 1 − 0.3 % per bar below p_s (min 55 %) of that;
//                         flash adds 0.2 g per 100 bar above p_f (illustrative).
//                         A ±5 °C, ±25 bar swing (batch, hall temperature)
//                         shows whether the setting is robust.
//   Level 3 (scientific)  gate-freeze study: hold time 1–6 s at 400 bar; the
//                         weights are the lesson's recall: 20.10, 20.35, 20.48,
//                         20.49, 20.49 g at 1–5 s (flat after). Freeze at ~3 s,
//                         so set 3.5–4 s. Pressure check from the faded example:
//                         150 bar × ratio 10 = 1,500 of 2,000 bar = 75 % < 80 %.
//   Level 4 (validation)  SPC on part weight of the lesson's medical cap: PQ
//                         mean 4.820 g, σ 0.006 g, control limits ± 3σ =
//                         4.802–4.838 g, OQ limits 4.780–4.860 g, Cpk =
//                         0.040 / (3 × 0.006) = 2.2. Shots are drawn from a fixed
//                         seeded normal sequence; "check ring leaks" adds a drift
//                         of −0.003 g per shot (illustrative), so the chart
//                         alarms long before parts leave the OQ limits.
const CARD = { Tm: 230, Tw: 40, v: 80, stroke: 60, sw: 12, ph: 400, th: 4, tc: 10, open: 4 };
const fillTime = (c) => (c.stroke - c.sw) / c.v;
const cycleOf = (c) => fillTime(c) + c.th + c.tc + c.open;
const GATE = [[1, 20.1], [2, 20.35], [3, 20.48], [4, 20.49], [5, 20.49]];
const FREEZE = 3;
const pShort = (T) => 400 - 8 * (T - 220);
const pFlash = (T) => 400 + 10 * (250 - T);
const AXIS = { T0: 200, T1: 270, p0: 200, p1: 700 };
const SETS = { T: [200, 210, 220, 230, 240, 250, 260, 270], p: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700], th: [1, 2, 3, 4, 5, 6] };
const SWING = { T: 5, p: 25 };
function gateW(th) {
  if (th <= GATE[0][0]) return GATE[0][1];
  for (let i = 1; i < GATE.length; i++) if (th <= GATE[i][0]) { const [a, wa] = GATE[i - 1], [b, wb] = GATE[i]; return wa + ((wb - wa) * (th - a)) / (b - a); }
  return GATE[GATE.length - 1][1];
}
function stateOf(T, p) { return p < pShort(T) ? "short" : p > pFlash(T) ? "flash" : "good"; }
function fillOf(T, p) { const s = pShort(T); return p >= s ? 1 : Math.max(0.55, 1 - 0.003 * (s - p)); }
function weightOf(T, p, th) {
  const packed = gateW(th) + 0.0006 * (p - 400);
  const f = fillOf(T, p);
  if (f < 1) return packed * f;
  const fin = Math.max(0, p - pFlash(T)) * 0.002;
  return packed + fin;
}
const SPC = { mean: 4.82, sd: 0.006, oqLo: 4.78, oqHi: 4.86, drift: -0.003 };
const PRESS = { hyd: 150, ratio: 10, max: 2000, rule: 0.8 };
// seeded normal sequence for the shots (Box–Muller on a small LCG), kept
// inside ± 2.6 σ so the stable process never alarms by chance
const NOISE = (() => {
  let s = 20261106;
  const r = () => ((s = (s * 1103515245 + 12345) % 2147483648) + 0.5) / 2147483648;
  const out = [];
  while (out.length < 240) {
    const z = Math.sqrt(-2 * Math.log(r())) * Math.cos(2 * Math.PI * r());
    if (Math.abs(z) < 2.6) out.push(Math.round(z * 100) / 100);
  }
  return out;
})();
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(fillTime(CARD), 0.6, 1e-9, "setup example fill time");
  near(cycleOf(CARD), 18.6, 1e-9, "setup example cycle");
  near((50 - 10) / 40, 1, 1e-9, "setup recall fill time");
  near(0.96 * 100, 96, 1e-9, "process recall switchover volume");
  near(pShort(220), 400, 1e-9, "window low edge at 400 bar");
  near(pFlash(250), 400, 1e-9, "window high edge at 400 bar");
  if (stateOf(CARD.Tm, CARD.ph) !== "good") throw new Error("the setting sheet is not inside the window");
  near(weightOf(230, 400, 4), 20.49, 1e-9, "nominal weight");
  near(gateW(1), 20.1, 1e-9, "gate freeze 1 s");
  near(gateW(2), 20.35, 1e-9, "gate freeze 2 s");
  near(gateW(3), 20.48, 1e-9, "gate freeze 3 s");
  near(gateW(4), 20.49, 1e-9, "gate freeze 4 s");
  near(gateW(5), 20.49, 1e-9, "gate freeze 5 s");
  near(120 * 10 * 0.9, 1080, 1e-9, "scientific recall viscosity");
  near(80 * 10 * 1.6, 1280, 1e-9, "viscosity at 40 mm/s");
  near(110 * 10 * 0.8, 880, 1e-9, "viscosity at 80 mm/s");
  near((PRESS.hyd * PRESS.ratio) / PRESS.max, 0.75, 1e-9, "pressure check");
  near(1800 / 2000, 0.9, 1e-9, "scientific recall pressure");
  near(SPC.mean - 3 * SPC.sd, 4.802, 1e-9, "LCL");
  near(SPC.mean + 3 * SPC.sd, 4.838, 1e-9, "UCL");
  near(Math.round(((SPC.oqHi - SPC.mean) / (3 * SPC.sd)) * 10) / 10, 2.2, 1e-9, "Cpk");
  near(12.5 + 3 * 0.02, 12.56, 1e-9, "validation recall UCL");
  near(Math.round((0.1 / (3 * 0.02)) * 100) / 100, 1.67, 1e-9, "validation recall Cpk");
}

// ---------------------------------------------------------------- the world
// World units are millimetres, z up, +y toward the operator. A low bench; on it
// the press's control console on a swivel foot (left) and a bench scale with an
// indicator head on a pillar (right). A tote for good parts stands in front of
// the console.
const WIDTH = 600;
const Z0 = 42; // bench top
const BENCH = { x: -240, y: -76, w: 430, d: 156, r: 2 };
const CON = { x: -232, y: -64, w: 212, d: 46, r: 3, z0: 72, z1: 276 };
const CON_F = CON.y + CON.d; // front face y
const SCR = { x0: -220, x1: -32, z0: 114, z1: 262 };
const SCR_Y = CON_F + 3; // screen plane, on the bezel
const SW = SCR.x1 - SCR.x0, SH = SCR.z1 - SCR.z0;
const BTN_Z = 92;
const TOWER = { x: -46, y: -42 };
const SC = { x: 18, y: -60, w: 152, d: 124, r: 3 }; // scale base
const PAN = { x: 26, y: -46, w: 136, d: 82, r: 2 };
const PAN_Z = 68;
const PILLAR = { x: 94, y: -53 };
const HEAD = { x: 30, y: -68, w: 128, d: 22, r: 3, z0: 172, z1: 218 };
const DISP = { x0: 40, x1: 148, z0: 180, z1: 210 };
const DISP_Y = HEAD.y + HEAD.d + 1.5;
const LID = { cx: 94, cy: -5, R: 34, H: 8 };

const FIT = [
  ...k.boxCorners(BENCH, 0, Z0),
  ...k.boxCorners({ x: CON.x, y: CON.y, w: CON.w, d: CON.d }, CON.z0, CON.z1 + 50),
  ...k.boxCorners({ x: HEAD.x, y: HEAD.y, w: HEAD.w, d: HEAD.d }, HEAD.z0, HEAD.z1),
];
const PAD = 8;
const AZIMUTH = Number(process.env.AZ ?? 60);
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
const frameY = (o) => G.frameOf(o, Y, Zv, X);
const fix = (v) => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(3);
// a 2D frame in the plane y = py: u along +x, v down
function planeMatrix(ox, py, oz) {
  const p0 = at([ox, py, oz]);
  const p1 = at([ox + 1, py, oz]);
  const p2 = at([ox, py, oz - 1]);
  return `matrix(${[p1[0] - p0[0], p1[1] - p0[1], p2[0] - p0[0], p2[1] - p0[1], p0[0], p0[1]].map(fix).join(" ")})`;
}

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, { order: [], spring: {} });
let solids = 0;
function put(name, ref, svg, shapes, { bias = 0, attrs = "" } = {}) {
  return R.put({ name, at: ref, bias, svg, shapes, piece: "", move: [0, 0, 0], attrs });
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
const plateCard = (pts) => `<path class="mp-card" d="${k.pathOf(pts.map(at), true)}"/>`;

// ---------------------------------------------------------------- the bench
const halo = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BENCH, 6), 0, 2, P)}"/>`];
{
  const frame = k.insetPlan(BENCH, 10);
  for (const [x, y] of k.corners(frame, 8)) post("bench.foot", x, y, 6, 0, 4, { tone: "lo" }, { steps: 18, ground: true });
  const fy = frame.y + frame.d;
  const screws = [frame.x + 8, frame.x + frame.w - 8].flatMap((x) => [[x, fy, 10], [x, fy, 24]]);
  const lx = -150;
  const label = [[lx, fy, 23], [lx + 46, fy, 23], [lx + 46, fy, 11], [lx, fy, 11]];
  const extra =
    plateCard(label) +
    L([20, 17, 14].map((z, i) => k.segment([lx + 4, fy, z], [lx + 4 + [30, 22, 36][i], fy, z], P)).join(""), { tone: "lo", free: true }) +
    Dt(screws.map(at), { size: 0.45 });
  box("bench.frame", frame, 4, 30, { tone: "lo" }, { steps: 2, bevel: 0.4, inner: L(k.sideSeam(frame, 17, P, 2), { tone: "faint" }), extra });
  const top = BENCH;
  const groove = k.planOutline(k.insetPlan(top, 5), Z0, P, 2);
  box("bench.top", top, 30, Z0, { tone: "mid" }, { steps: 2, bevel: 0.6, inner: L(groove, { tone: "faint" }), extra: Dt(k.corners(k.insetPlan(top, 9), 2).map(([x, y]) => at([x, y, Z0])), { size: 0.45 }) });
}

// ---------------------------------------------------------------- the control console
const CCX = CON.x + CON.w / 2, CCY = CON.y + CON.d / 2;
post("console.foot", CCX, CCY, 30, Z0, Z0 + 5, { tone: "lo" }, { steps: 40, bevel: 0.6, extra: Dt([0, 1, 2, 3, 4, 5].map((i) => at([CCX + 25 * Math.cos((i * Math.PI) / 3 + 0.3), CCY + 25 * Math.sin((i * Math.PI) / 3 + 0.3), Z0 + 5])), { size: 0.45 }) });
post("console.bearing", CCX, CCY, 16, Z0 + 5, Z0 + 11, { tone: "mid" }, { steps: 32 });
post("console.column", CCX, CCY, 10, Z0 + 11, CON.z0 - 4, { tone: "mid" }, { steps: 28 });
post("console.flange", CCX, CCY, 18, CON.z0 - 4, CON.z0, { tone: "mid" }, { steps: 32 });
{
  const plan = { x: CON.x, y: CON.y, w: CON.w, d: CON.d, r: CON.r };
  // the front: corner screws and a type plate under the buttons
  const fy = CON_F;
  const screws = [[CON.x + 6, fy, CON.z0 + 6], [CON.x + CON.w - 6, fy, CON.z0 + 6], [CON.x + 6, fy, CON.z1 - 6], [CON.x + CON.w - 6, fy, CON.z1 - 6]];
  const tp = [[CON.x + 14, fy, 82], [CON.x + 56, fy, 82], [CON.x + 56, fy, 76], [CON.x + 14, fy, 76]];
  // vent slots on the right side face, closed slots
  const sx = CON.x + CON.w;
  const slots = [];
  for (let i = 0; i < 7; i++) {
    const z = 150 + i * 9;
    slots.push(k.pathOf([[sx, CON.y + 10, z], [sx, CON.y + CON.d - 10, z], [sx, CON.y + CON.d - 10, z + 3.2], [sx, CON.y + 10, z + 3.2]].map(at), true));
  }
  const top = k.planOutline(k.insetPlan(plan, 4), CON.z1, P, 2);
  const extra =
    `<path class="mp-slot" d="${slots.join("")}"/>` +
    plateCard(tp) +
    L(k.segment([CON.x + 18, fy, 79], [CON.x + 46, fy, 79], P), { tone: "lo", free: true }) +
    Dt(screws.map(at), { size: 0.45 });
  box("console.body", plan, CON.z0, CON.z1, { tone: "mid" }, { steps: 3, bevel: 0.8, inner: L(top, { tone: "faint" }), extra });
}
// bezel and the screen, drawn live in the bezel's plane
{
  const bz = { x: SCR.x0 - 6, y: CON_F, w: SW + 12, d: 3, r: 1 };
  const m = planeMatrix(SCR.x0, SCR_Y, SCR.z1);
  const screen =
    `<g transform="${m}"><clipPath id="mw-scr"><rect x="0" y="0" width="${SW}" height="${SH}" rx="1.5"/></clipPath>` +
    `<rect class="mw-scr" x="0" y="0" width="${SW}" height="${SH}" rx="1.5"/>` +
    `<g clip-path="url(#mw-scr)" data-screen=""></g>` +
    `<rect class="mw-scr-rim" x="0" y="0" width="${SW}" height="${SH}" rx="1.5"/></g>`;
  box("console.bezel", bz, SCR.z0 - 6, SCR.z1 + 6, { tone: "mid", crease: "lo" }, { steps: 1, bevel: 0.4, extra: screen });
}
// push buttons, key switch and the emergency stop
const BTNS = [CON.x + 20, CON.x + 42, CON.x + 64, CON.x + 86];
for (const x of BTNS) {
  const F = frameY([x, CON_F, BTN_Z]);
  discAt("console.button-ring", F, 0, 1.4, 7.5, { tone: "lo" }, { steps: 28 });
  discAt("console.button", F, 1.4, 4.4, 5.6, { tone: "mid" }, { steps: 28, extra: Dt([at([x, CON_F + 4.4, BTN_Z])], { size: 0.5, tone: "hi" }) });
}
const KEY_X = CON.x + 120;
{
  const F = frameY([KEY_X, CON_F, BTN_Z]);
  discAt("console.key-ring", F, 0, 1.6, 8, { tone: "lo" }, { steps: 28 });
  discAt("console.key-barrel", F, 1.6, 6, 5, { tone: "mid" }, { steps: 28, extra: L(k.segment([KEY_X - 3, CON_F + 6, BTN_Z], [KEY_X + 3, CON_F + 6, BTN_Z], P), { tone: "hi" }) + Dt([at([KEY_X - 3, CON_F + 6, BTN_Z]), at([KEY_X + 3, CON_F + 6, BTN_Z])], { size: 0.4 }) });
}
const STOP_X = CON.x + CON.w - 30;
{
  const F = frameY([STOP_X, CON_F, BTN_Z]);
  discAt("console.stop-collar", F, 0, 3, 14, { tone: "lo" }, { steps: 40 });
  discAt("console.stop-stem", F, 3, 6, 6, { tone: "mid" }, { steps: 28 });
  discAt("console.stop-head", F, 6, 12, 11, { tone: "hi", crease: "lo" }, { steps: 40, bevel: 1 });
}
// cable gland under the console
post("console.gland", CON.x + 30, CCY, 5, CON.z0 - 8, CON.z0, { tone: "mid" }, { steps: 6 });
// signal tower on top
post("tower.base", TOWER.x, TOWER.y, 8, CON.z1, CON.z1 + 6, { tone: "mid" }, { steps: 28 });
const LAMPS = ["bad", "mid", "good"];
LAMPS.forEach((name, i) => {
  const z0 = CON.z1 + 6 + (2 - i) * 13;
  post(`tower.${name}`, TOWER.x, TOWER.y, 6.5, z0, z0 + 13, { tone: "mid" }, { steps: 28, attrs: ` data-lamp="${name}"` });
});
post("tower.cap", TOWER.x, TOWER.y, 7, CON.z1 + 45, CON.z1 + 48, { tone: "mid" }, { steps: 28, bevel: 0.6, extra: Dt([at([TOWER.x, TOWER.y, CON.z1 + 48])], { size: 0.5, tone: "hi" }) });

// ---------------------------------------------------------------- a tote of good parts in front of the console
{
  const plan = { x: -214, y: 14, w: 112, d: 56, r: 3 };
  const rim = k.insetPlan(plan, 3);
  const inside = `<path class="mp-hole" d="${k.planOutline(rim, 70, P, 3)}"/>`;
  // two lids stacked in the tote, their top edges seen over the rim
  const lids = [];
  for (const [cx, cy] of [[-182, 40], [-138, 44]]) {
    const ring = [];
    for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; ring.push([cx + 18 * Math.cos(a), cy + 18 * Math.sin(a), 66]); }
    lids.push(`<path class="mp-lid" d="${k.pathOf(ring.map(at), true)}"/>`);
  }
  const clip = `<clipPath id="mw-tote"><path d="${k.planOutline(rim, 70, P, 3)}"/></clipPath><g clip-path="url(#mw-tote)">${lids.join("")}</g>`;
  box("tote", plan, Z0, 70, { tone: "lo" }, { steps: 3, bevel: 0.6, inner: L(k.sideSeam(plan, 58, P, 3), { tone: "faint" }), extra: inside + clip });
}

// ---------------------------------------------------------------- the bench scale
for (const [x, y] of k.corners(k.insetPlan(SC, 8), 4)) {
  post("scale.foot", x, y, 5, Z0, Z0 + 2, { tone: "lo" }, { steps: 18 });
  post("scale.foot-screw", x, y, 2.4, Z0 + 2, Z0 + 4, { tone: "mid", crease: "none" }, { steps: 12 });
}
{
  const fy = SC.y + SC.d;
  const tp = [[SC.x + 70, fy, 58], [SC.x + 136, fy, 58], [SC.x + 136, fy, 50], [SC.x + 70, fy, 50]];
  const extra =
    plateCard(tp) +
    L([55.5, 52.5].map((z, i) => k.segment([SC.x + 74, fy, z], [SC.x + 74 + [40, 28][i], fy, z], P)).join(""), { tone: "lo", free: true });
  box("scale.base", SC, Z0 + 4, 62, { tone: "mid" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(SC, 54, P, 3), { tone: "faint" }), extra });
}
// front keys and the level bubble on the ledge
for (const x of [SC.x + 18, SC.x + 36]) {
  const F = frameY([x, SC.y + SC.d, 55.5]);
  discAt("scale.key", F, 0, 2, 4.2, { tone: "hi", crease: "lo" }, { steps: 24 });
}
{
  const lx = SC.x + SC.w - 14, ly = SC.y + SC.d - 12;
  post("scale.level", lx, ly, 5.5, 62, 63.2, { tone: "lo" }, { steps: 28, extra: `<path class="iso-line" data-tone="mid" fill="none" d="${k.onTop(k.circleRing(lx, ly, 2.6, 28), 63.2, P, true)}"/>` + Dt([at([lx + 0.4, ly - 0.3, 63.2])], { size: 0.7, tone: "hi" }) });
}
post("scale.spider", LID.cx, LID.cy, 8, 62, PAN_Z - 4, { tone: "lo" }, { steps: 24 });
{
  const groove = k.planOutline(k.insetPlan(PAN, 5), PAN_Z, P, 2);
  box("scale.pan", PAN, PAN_Z - 4, PAN_Z, { tone: "hi", crease: "lo" }, { steps: 2, bevel: 0.6, inner: L(groove, { tone: "lo" }) });
}
post("scale.pillar", PILLAR.x, PILLAR.y, 4, 62, HEAD.z0 - 6, { tone: "mid" }, { steps: 24 });
box("scale.bracket", { x: PILLAR.x - 9, y: HEAD.y + 4, w: 18, d: 18, r: 1 }, HEAD.z0 - 6, HEAD.z0, { tone: "mid" }, { steps: 1, bevel: 0.4 });
{
  const plan = { x: HEAD.x, y: HEAD.y, w: HEAD.w, d: HEAD.d, r: HEAD.r };
  const fy = HEAD.y + HEAD.d;
  const screws = [[HEAD.x + 4, fy, HEAD.z0 + 4], [HEAD.x + HEAD.w - 4, fy, HEAD.z0 + 4], [HEAD.x + 4, fy, HEAD.z1 - 4], [HEAD.x + HEAD.w - 4, fy, HEAD.z1 - 4]];
  box("scale.head", plan, HEAD.z0, HEAD.z1, { tone: "mid" }, { steps: 3, bevel: 0.8, extra: Dt(screws.map(at), { size: 0.45 }) });
  const win = { x: DISP.x0 - 3, y: fy, w: DISP.x1 - DISP.x0 + 6, d: 1.5, r: 0.8 };
  const m = planeMatrix(DISP.x0, DISP_Y, DISP.z1);
  const dw = DISP.x1 - DISP.x0, dh = DISP.z1 - DISP.z0;
  const disp = `<g transform="${m}"><rect class="mw-scr" x="0" y="0" width="${dw}" height="${dh}" rx="1"/><g data-disp=""></g><rect class="mw-scr-rim" x="0" y="0" width="${dw}" height="${dh}" rx="1"/></g>`;
  box("scale.window", win, DISP.z0 - 3, DISP.z1 + 3, { tone: "lo" }, { steps: 1, extra: disp });
}

// ---------------------------------------------------------------- the part on the pan (drawn live)
{
  const shape = R.solid(A.cylinder(LID.cx, LID.cy, LID.R, PAN_Z, LID.H, { name: "part" }));
  put("part", [LID.cx, LID.cy, PAN_Z + LID.H / 2], `<g data-part=""></g>`, [shape]);
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
R.items.sort((a, b) => a.key - b.key);
if (process.env.ORDER) console.log(R.items.map((i, n) => n + " " + i.name).join("\n"));
const groups = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
const body = [...halo, ...groups, `<g data-mark=""></g>`];

const LABEL_NL =
  "Op een werkbank staat links het bedieningspaneel van de spuitgietpers op een draaivoet: een groot scherm, vier drukknoppen, een sleutelschakelaar, een noodstop en bovenop een signaalmast. Rechts staat een weegschaal met een weegplateau en een display op een zuil; op het plateau ligt het laatste product, een PP-deksel. Voor het paneel staat een bak met goede producten. Het scherm toont per niveau de instelkaart, het procesvenster van smelttemperatuur en nadruk, een gate-freeze-studie of een regelkaart van het productgewicht.";
const LABEL_EN =
  "On a workbench, on the left, the injection press's control panel stands on a swivel foot: a large screen, four push buttons, a key switch, an emergency stop and a signal tower on top. On the right is a scale with a weighing pan and a display on a pillar; the last part, a PP lid, lies on the pan. A tote of good parts stands in front of the panel. Depending on the level, the screen shows the setting sheet, the process window of melt temperature and hold pressure, a gate-freeze study or a control chart of part weight.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "screen", at: [(SCR.x0 + SCR.x1) / 2, SCR_Y, (SCR.z0 + SCR.z1) / 2] },
  { key: "tower", at: [TOWER.x, TOWER.y, CON.z1 + 26] },
  { key: "buttons", at: [BTNS[1] + 11, CON_F + 4, BTN_Z] },
  { key: "key", at: [KEY_X, CON_F + 6, BTN_Z] },
  { key: "stop", at: [STOP_X, CON_F + 12, BTN_Z] },
  { key: "foot", at: [CCX, CCY + 30, Z0 + 5] },
  { key: "tote", at: [-158, 70, 60] },
  { key: "part", at: [LID.cx, LID.cy, PAN_Z + LID.H] },
  { key: "pan", at: [PAN.x + 12, PAN.y + PAN.d - 6, PAN_Z] },
  { key: "display", at: [(DISP.x0 + DISP.x1) / 2, DISP_Y, (DISP.z0 + DISP.z1) / 2] },
  { key: "level", at: [SC.x + SC.w - 14, SC.y + SC.d - 12, 63] },
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
  --mp-hair:rgba(240,233,218,.12);--mp-accent:#5C9FAE;--mp-hole:#071A1E;--mp-lid:#2A4A50;
  --mw-lamp-top:#5C9FAE;--mw-lamp-side:#3F7F8E;
  --mw-p-top:#2A4A50;--mw-p-side:#1E3C44;--mw-shadow:rgba(3,16,15,.55);--mw-flash:rgba(92,159,174,.85);
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --mp-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mw-scr-bg:#06171B;--mw-scr-ink:#D9E4DE;--mw-scr-dim:#6F8C86;--mw-scr-line:#21403F;--mw-scr-acc:#6FB3C2;
  --mw-scr-good:rgba(111,179,194,.26);--mw-scr-bad:rgba(217,228,222,.07);--mw-scr-sel:rgba(111,179,194,.18);
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --mp-hair:rgba(11,41,27,.14);--mp-accent:#276F81;--mp-hole:#D5CCB6;--mp-lid:#F3EEE2;
  --mw-lamp-top:#8FC0C9;--mw-lamp-side:#5E9DAA;
  --mw-p-top:#FDFBF6;--mw-p-side:#E6DFCD;--mw-shadow:rgba(90,107,96,.28);--mw-flash:rgba(39,111,129,.8);
  --mw-scr-bg:#0D2A2E;--mw-scr-ink:#EAF0EA;--mw-scr-dim:#86A39C;--mw-scr-line:#2A4A4A;--mw-scr-acc:#7FC0CE;
  --mw-scr-good:rgba(127,192,206,.28);--mw-scr-bad:rgba(234,240,234,.07);--mw-scr-sel:rgba(127,192,206,.2);
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--mp-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:1;--lines:3;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--mp-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="2"] .iso-plate{--rows:1;--lines:4}
html[data-level="3"] .iso-plate{--rows:1;--lines:4}
html[data-level="4"] .iso-plate{--rows:2;--lines:4}
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
.mp-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--mp-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--mp-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.mp-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.mp-btn:disabled{opacity:.4;cursor:default}
.mp-btn[aria-checked="true"]{box-shadow:inset 0 0 0 1.5px var(--mp-accent);color:var(--mp-accent);font-weight:600}
.mp-btn[data-step]{flex:0 0 44px;font-size:18px;font-weight:400}
.mp-btn i{font-style:italic;font-family:Georgia,serif;font-size:13px}
.mp-btn b{font-weight:inherit}
.mp-row[data-row="setting"] .mp-btn{font-size:11px}
.mp-group{display:flex;gap:4px;flex:1 1 auto;height:44px;min-width:0}
.mp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mp-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mp-slot{fill:var(--mp-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mp-hole{fill:var(--mp-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.mp-lid{fill:var(--mp-lid);stroke:var(--anatomy-mid);stroke-width:var(--anatomy-weight)}
.it[data-lamp][data-on] .iso-shade{fill:var(--mw-lamp-side)}
.it[data-lamp][data-on] .iso-top,.it[data-lamp][data-on] .iso-fill{fill:var(--mw-lamp-top)}
.mw-scr{fill:var(--mw-scr-bg);stroke:none}
.mw-scr-rim{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.s-t{font-family:var(--anatomy-mono);fill:var(--mw-scr-ink)}
.s-d{font-family:var(--anatomy-mono);fill:var(--mw-scr-dim)}
.s-a{font-family:var(--anatomy-mono);fill:var(--mw-scr-acc);font-weight:700}
.s-ln{fill:none;stroke:var(--mw-scr-line);stroke-width:.6px}
.s-ax{fill:none;stroke:var(--mw-scr-dim);stroke-width:.7px}
.s-acc{fill:none;stroke:var(--mw-scr-acc);stroke-width:1.1px;stroke-linejoin:round;stroke-linecap:round}
.s-thin{fill:none;stroke:var(--mw-scr-acc);stroke-width:.7px}
.s-ink{fill:none;stroke:var(--mw-scr-ink);stroke-width:.8px;stroke-linejoin:round}
.s-dot{fill:var(--mw-scr-ink);stroke:none}
.s-dot-a{fill:var(--mw-scr-acc);stroke:none}
.s-good{fill:var(--mw-scr-good);stroke:none}
.s-bad{fill:var(--mw-scr-bad);stroke:none}
.s-sel{fill:var(--mw-scr-sel);stroke:none}
.s-bar{fill:var(--mw-scr-line);stroke:none}
.s-bar-a{fill:var(--mw-scr-acc);stroke:none}
.pt{stroke:var(--anatomy-hi);stroke-width:.45px;stroke-linejoin:round}
.pt-top{fill:var(--mw-p-top)}.pt-side{fill:var(--mw-p-side);stroke:var(--mw-p-side);stroke-width:.3px}
.pt-mark{fill:none;stroke:var(--anatomy-lo);stroke-width:.4px}
.pt-shadow{fill:var(--mw-shadow);stroke:none}
.pt-flash{fill:var(--mw-flash);stroke:var(--mp-accent);stroke-width:.35px;stroke-linejoin:round}
.pt-front{fill:none;stroke:var(--mp-accent);stroke-width:1.1px;stroke-linejoin:round;stroke-linecap:round}
.mp-mark{fill:none;stroke:var(--mp-accent);stroke-width:1.4px}
.mp-mark-dot{fill:var(--mp-accent);stroke:none}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const CARD = ${JSON.stringify(CARD)}, GATE = ${JSON.stringify(GATE)}, FREEZE = ${FREEZE}, AXIS = ${JSON.stringify(AXIS)}, SETS = ${JSON.stringify(SETS)}, SWING = ${JSON.stringify(SWING)};
const SPC = ${JSON.stringify(SPC)}, PRESS = ${JSON.stringify(PRESS)}, NOISE = ${JSON.stringify(NOISE)};
const SW = ${SW}, SH = ${SH}, DW = ${DISP.x1 - DISP.x0}, DH = ${DISP.z1 - DISP.z0}, LID = ${JSON.stringify(LID)}, PAN_Z = ${PAN_Z};
const PARTS = ${JSON.stringify(PARTS)};
const fillTime = ${fillTime.toString()};
const cycleOf = ${cycleOf.toString()};
const pShort = ${pShort.toString()};
const pFlash = ${pFlash.toString()};
${gateW.toString()}
${stateOf.toString()}
${fillOf.toString()}
${weightOf.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
document.documentElement.setAttribute("data-level", String(LVL));
const T = EN
  ? { dec: ".", grp: ",", sheet: "SETTING SHEET · PP LID", window: "PROCESS WINDOW · 4 s HOLD", gate: "GATE-FREEZE STUDY · 400 bar", spc: "SPC · PART WEIGHT · CAP", cycle: "cycle", fill: "fill", hold: "hold", cool: "cool", open: "open", good: "good", short: "short shot", flash: "flash", frozen: "frozen", set: "set", shot: "shot", stable: "STABLE", net: "NET",
      rows: { temp: ["Temperatures", "230 / 40 °C"], speed: ["Injection speed", "80 mm/s"], sw: ["Switchover point", "12 mm"], hold: ["Hold pressure, time", "400 bar · 4 s"], cool: ["Cooling time", "10 s"] },
      why: { temp: "too cold: freezes before full; too hot: flash, longer cooling", speed: "fills in 0.6 s; too fast: burn marks or jetting", sw: "~95–98 % full; switching too late: flash", hold: "until the gate freezes; too little: sink", cool: "the longest step; too short: warpage" },
      temps: "melt 230 °C · mould 40 °C", fillEq: "fill (60 − 12) / 80 = 0.6 s · cycle 18.6 s", tapPart: "tap a part to name it",
      win: "window at", mid: "middle", edge: "margin", swing: "swing ±5 °C, ±25 bar:", stays: "stays good", rejects: "rejects at the edge", outside: "outside the window", none: "none",
      study: "hold 400 bar · hold time", flat: "flat from ~3 s: the gate is frozen → set 3.5–4 s", rising: "vs the shot before: gate still open, keep going", pcheck: "pressure 150 bar × 10 = 1,500 / 2,000 bar = 75 % < 80 %",
      pq: "PQ: mean 4.820 g · σ 0.006 g · limits 4.802–4.838 g", oq: "OQ 4.780–4.860 g · Cpk 0.040 / (3 × 0.006) = 2.2", within: "within the control limits", alarm: "alarm", stillGood: "part still inside OQ", bad: "outside OQ: reject", driftOn: "check ring leaks: −0.003 g a shot", driftOff: "stable: no drift", firstAlarm: "alarm at shot",
      parts: { screen: ["Screen", "setting sheet and process data of the press"], tower: ["Signal tower", "shows the press status at a glance"], buttons: ["Push buttons", "cycle start, mould open, purge, ..."], key: ["Key switch", "only the setter may change the setting sheet"], stop: ["Emergency stop", "stops the press at once"], foot: ["Swivel foot", "turns the panel toward the operator"], tote: ["Tote of good parts", ""], part: ["Part: PP lid", "the last shot, weighed"], pan: ["Scale pan", "part weight: a cheap, strong signal"], display: ["Scale display", "weight in 0.01 g"], level: ["Level bubble", "a scale must stand level to weigh true"] } }
  : { dec: ",", grp: ".", sheet: "INSTELKAART · PP-DEKSEL", window: "PROCESVENSTER · 4 s NADRUK", gate: "GATE-FREEZE-STUDIE · 400 bar", spc: "SPC · PRODUCTGEWICHT · DOP", cycle: "cyclus", fill: "vullen", hold: "nadruk", cool: "koelen", open: "open", good: "goed", short: "short shot", flash: "braam", frozen: "bevroren", set: "zet", shot: "shot", stable: "STABIEL", net: "NETTO",
      rows: { temp: ["Temperaturen", "230 / 40 °C"], speed: ["Inspuitsnelheid", "80 mm/s"], sw: ["Omschakelpunt", "12 mm"], hold: ["Nadruk, nadruktijd", "400 bar · 4 s"], cool: ["Koeltijd", "10 s"] },
      why: { temp: "te koud: stolt voor vol; te heet: braam, langer koelen", speed: "vult in 0,6 s; te snel: brandplekken of jetting", sw: "~95–98 % vol; te laat omschakelen: braam", hold: "tot het aanspuitpunt bevriest; te weinig: inzak", cool: "langste stap; te kort: kromtrekken" },
      temps: "smelt 230 °C · matrijs 40 °C", fillEq: "vullen (60 − 12) / 80 = 0,6 s · cyclus 18,6 s", tapPart: "tik een onderdeel voor de naam",
      win: "venster bij", mid: "midden", edge: "rand op", swing: "schommeling ±5 °C, ±25 bar:", stays: "blijft goed", rejects: "afkeur aan de rand", outside: "buiten het venster", none: "geen",
      study: "nadruk 400 bar · nadruktijd", flat: "vlak vanaf ~3 s: aanspuitpunt bevroren → zet 3,5–4 s", rising: "t.o.v. vorig shot: aanspuitpunt nog open, verder", pcheck: "druk 150 bar × 10 = 1.500 / 2.000 bar = 75 % < 80 %",
      pq: "PQ: gem. 4,820 g · σ 0,006 g · grenzen 4,802–4,838 g", oq: "OQ 4,780–4,860 g · Cpk 0,040 / (3 × 0,006) = 2,2", within: "binnen de regelgrenzen", alarm: "alarm", stillGood: "product nog binnen OQ", bad: "buiten OQ: afkeur", driftOn: "terugslagring lekt: −0,003 g per shot", driftOff: "stabiel: geen verloop", firstAlarm: "alarm bij shot",
      parts: { screen: ["Bedienscherm", "instelkaart en procesdata van de pers"], tower: ["Signaalmast", "toont de status van de pers"], buttons: ["Drukknoppen", "cyclus start, matrijs open, spoelen, ..."], key: ["Sleutelschakelaar", "alleen de insteller wijzigt de instelkaart"], stop: ["Noodstop", "zet de pers direct stil"], foot: ["Draaivoet", "draait het paneel naar de operator"], tote: ["Bak met goede producten", ""], part: ["Product: PP-deksel", "het laatste shot, gewogen"], pan: ["Weegplateau", "productgewicht: goedkoop, sterk signaal"], display: ["Weegdisplay", "gewicht in 0,01 g"], level: ["Waterpas", "een weegschaal moet waterpas staan"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const grouped = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);

const stage = document.querySelector(".mp-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const el = { screen: q("[data-screen]"), disp: q("[data-disp]"), part: q("[data-part]"), mark: q("[data-mark]"), lamps: [...svg.querySelectorAll("[data-lamp]")] };
const lines = [...document.querySelectorAll("[data-readout] .mp-line")];
const announcer = document.querySelector(".mp-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const VIEW = towardViewer(P);

// ------------------------------------------------ state
const ROWS = ["temp", "speed", "sw", "hold", "cool"];
const st = { row: "temp", T: 230, p: 400, th: LVL === 3 ? 3 : 4, seen: 3, drift: false, shots: 12, driftFrom: 0, driftTo: 0 };
function spcWeight(i) {
  const base = SPC.mean + SPC.sd * NOISE[i % NOISE.length];
  return Math.round((base + (st.driftFrom && i >= st.driftFrom && (!st.driftTo || i < st.driftTo) ? SPC.drift * (i - st.driftFrom + 1) : 0)) * 1000) / 1000;
}
function model() {
  if (LVL === 4) return { w: spcWeight(st.shots - 1), fill: 1, fin: 0, state: "good" };
  const T0 = LVL === 2 ? st.T : CARD.Tm, p0 = LVL === 2 ? st.p : CARD.ph, th = LVL === 3 ? st.th : CARD.th;
  const s = stateOf(T0, p0);
  return { w: weightOf(T0, p0, th), fill: fillOf(T0, p0), fin: Math.max(0, p0 - pFlash(T0)), state: s };
}
const shown = { w: 0, fill: 1, fin: 0, drop: 0, T: st.T, p: st.p };
function target() { const m = model(); return { w: m.w, fill: m.fill, fin: m.fin, drop: 0, T: st.T, p: st.p }; }
Object.assign(shown, target());

// ------------------------------------------------ the screen
const tx = (x, y, s, cls, text, anchor) => '<text class="' + cls + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + s + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + ">" + text + "</text>";
const poly = (pts) => "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L");
function header(title) { return '<path class="s-ln" d="M0 15H' + SW + '"/>' + tx(6, 10.5, 7.2, "s-d", title); }
function screenSheet() {
  let out = header(T.sheet);
  ROWS.forEach((r, i) => {
    const y = 20 + i * 20;
    const on = r === st.row;
    if (on) out += '<rect class="s-sel" x="3" y="' + y + '" width="' + (SW - 6) + '" height="18" rx="1.5"/>';
    out += tx(8, y + 12, 8, on ? "s-a" : "s-d", T.rows[r][0]);
    out += tx(SW - 8, y + 12, 8.6, on ? "s-a" : "s-t", T.rows[r][1], "end");
  });
  // cycle bar: fill, hold, cool, open
  const segs = [["fill", fillTime(CARD), ["speed", "sw"]], ["hold", CARD.th, ["hold"]], ["cool", CARD.tc, ["cool"]], ["open", CARD.open, []]];
  const total = cycleOf(CARD), x0 = 8, wbar = SW - 16, y = 128;
  let x = x0;
  out += tx(x0, 124, 6.6, "s-d", T.cycle) + tx(SW - 8, 124, 7.4, "s-t", fmt(total, 1) + " s", "end");
  for (const [name, t, rows] of segs) {
    const w = (wbar * t) / total;
    const on = rows.includes(st.row) || st.row === "temp";
    out += '<rect class="' + (on && st.row !== "temp" ? "s-bar-a" : "s-bar") + '" x="' + (x + 0.4).toFixed(2) + '" y="' + y + '" width="' + Math.max(0.8, w - 0.8).toFixed(2) + '" height="8" rx="0.8"/>';
    if (w > 22) out += tx(x + w / 2, y + 16.5, 6, "s-d", T[name] + " " + fmt(t, 1), "middle");
    x += w;
  }
  return out;
}
// plot frame helper: area u0..u1, v0..v1
function axes(u0, v0, u1, v1) { return '<path class="s-ax" d="M' + u0 + " " + v0 + "V" + v1 + "H" + u1 + '"/>'; }
function screenWindow() {
  let out = header(T.window);
  const u0 = 30, u1 = SW - 8, v0 = 22, v1 = SH - 20;
  const U = (Tc) => u0 + ((Tc - AXIS.T0) / (AXIS.T1 - AXIS.T0)) * (u1 - u0);
  const V = (p) => v1 - ((p - AXIS.p0) / (AXIS.p1 - AXIS.p0)) * (v1 - v0);
  const N = 40, sh = [], fl = [];
  for (let i = 0; i <= N; i++) { const Tc = AXIS.T0 + ((AXIS.T1 - AXIS.T0) * i) / N; sh.push([U(Tc), V(clamp(pShort(Tc), AXIS.p0, AXIS.p1))]); fl.push([U(Tc), V(clamp(pFlash(Tc), AXIS.p0, AXIS.p1))]); }
  // regions: short below the short line, flash above the flash line, good between
  out += '<path class="s-bad" d="' + poly([[u0, v1], ...sh, [u1, v1]]) + 'Z"/>';
  out += '<path class="s-bad" d="' + poly([[u0, v0], ...fl, [u1, v0]]) + 'Z"/>';
  out += '<path class="s-good" d="' + poly([...sh, ...fl.slice().reverse()]) + 'Z"/>';
  out += '<path class="s-thin" d="' + poly(sh) + poly(fl) + '"/>';
  // grid and ticks
  for (const Tc of [220, 240, 260]) out += '<path class="s-ln" d="M' + U(Tc).toFixed(2) + " " + v0 + "V" + v1 + '"/>' + tx(U(Tc), v1 + 8, 6.4, "s-d", Tc, "middle");
  for (const p of [300, 400, 500, 600]) out += '<path class="s-ln" d="M' + u0 + " " + V(p).toFixed(2) + "H" + u1 + '"/>' + tx(u0 - 3, V(p) + 2.2, 6.4, "s-d", p, "end");
  out += axes(u0, v0, u1, v1);
  out += tx(u1, v1 + 16, 6.4, "s-d", "T °C", "end") + tx(4, v0 + 2, 6.4, "s-d", "p", "start");
  out += tx(U(207), V(240), 7.4, "s-t", T.short) + tx(U(266), V(660), 7.4, "s-t", T.flash, "end") + tx(U(247), V(300), 7.6, "s-a", T.good, "middle");
  // the swing box and the setting
  const x = U(shown.T), y = V(shown.p), bw = U(shown.T + SWING.T) - x, bh = y - V(shown.p + SWING.p);
  out += '<rect class="s-ink" x="' + (x - bw).toFixed(2) + '" y="' + (y - bh).toFixed(2) + '" width="' + (2 * bw).toFixed(2) + '" height="' + (2 * bh).toFixed(2) + '"/>';
  out += '<circle class="s-acc" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="4.2"/><circle class="s-dot-a" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="1.8"/>';
  return out;
}
function screenGate() {
  let out = header(T.gate);
  const u0 = 34, u1 = SW - 8, v0 = 24, v1 = SH - 20, w0 = 20.0, w1 = 20.6;
  const U = (t) => u0 + (t / 6) * (u1 - u0);
  const V = (w) => v1 - ((w - w0) / (w1 - w0)) * (v1 - v0);
  // the set band 3.5–4 s once the gate is frozen
  if (st.seen >= 5) out += '<rect class="s-good" x="' + U(3.5).toFixed(2) + '" y="' + v0 + '" width="' + (U(4) - U(3.5)).toFixed(2) + '" height="' + (v1 - v0) + '"/>' + tx((U(3.5) + U(4)) / 2, v0 + 8, 6.4, "s-a", T.set, "middle");
  for (const t of [1, 2, 3, 4, 5, 6]) out += '<path class="s-ln" d="M' + U(t).toFixed(2) + " " + v0 + "V" + v1 + '"/>' + tx(U(t), v1 + 8, 6.4, "s-d", t, "middle");
  for (const w of [20.1, 20.2, 20.3, 20.4, 20.5]) out += '<path class="s-ln" d="M' + u0 + " " + V(w).toFixed(2) + "H" + u1 + '"/>' + tx(u0 - 3, V(w) + 2.2, 6.2, "s-d", fmt(w, 1), "end");
  out += axes(u0, v0, u1, v1) + tx(u1, v1 + 16, 6.4, "s-d", "t s", "end") + tx(4, v0 - 2, 6.4, "s-d", "g", "start");
  if (st.seen >= 5) out += '<path class="s-thin" d="M' + U(FREEZE).toFixed(2) + " " + v0 + "V" + v1 + '"/>' + tx(U(FREEZE) - 2, V(20.15), 6.6, "s-t", T.frozen, "end");
  const pts = [];
  for (let t = 1; t <= st.seen; t++) pts.push([U(t), V(gateW(t))]);
  if (pts.length > 1) out += '<path class="s-ink" d="' + poly(pts) + '"/>';
  pts.forEach((p, i) => { const cur = i + 1 === st.th; out += cur ? '<circle class="s-acc" cx="' + p[0].toFixed(2) + '" cy="' + p[1].toFixed(2) + '" r="4"/><circle class="s-dot-a" cx="' + p[0].toFixed(2) + '" cy="' + p[1].toFixed(2) + '" r="1.8"/>' : '<circle class="s-dot" cx="' + p[0].toFixed(2) + '" cy="' + p[1].toFixed(2) + '" r="1.6"/>'; });
  return out;
}
const SPC_N = 20;
function alarmShot() { for (let i = 0; i < st.shots; i++) { const w = spcWeight(i); if (w < SPC.mean - 3 * SPC.sd || w > SPC.mean + 3 * SPC.sd) return i; } return -1; }
function screenSpc() {
  let out = header(T.spc);
  const u0 = 36, u1 = SW - 22, v0 = 22, v1 = SH - 18, w0 = 4.77, w1 = 4.87;
  const first = Math.max(0, st.shots - SPC_N);
  const U = (i) => u0 + ((i - first + 0.5) / SPC_N) * (u1 - u0);
  const V = (w) => v1 - ((clamp(w, w0, w1) - w0) / (w1 - w0)) * (v1 - v0);
  const hl = (w, cls, label) => '<path class="' + cls + '" d="M' + u0 + " " + V(w).toFixed(2) + "H" + u1 + '"/>' + tx(u1 + 2, V(w) + 2.2, 5.8, cls === "s-ln" ? "s-d" : cls === "s-thin" ? "s-a" : "s-t", label);
  out += '<rect class="s-good" x="' + u0 + '" y="' + V(SPC.mean + 3 * SPC.sd).toFixed(2) + '" width="' + (u1 - u0) + '" height="' + (V(SPC.mean - 3 * SPC.sd) - V(SPC.mean + 3 * SPC.sd)).toFixed(2) + '"/>';
  out += hl(SPC.oqHi, "s-ink", "OQ") + hl(SPC.oqLo, "s-ink", "OQ") + hl(SPC.mean + 3 * SPC.sd, "s-thin", "UCL") + hl(SPC.mean - 3 * SPC.sd, "s-thin", "LCL") + hl(SPC.mean, "s-ln", "CL");
  for (const w of [4.78, 4.8, 4.82, 4.84, 4.86]) out += tx(u0 - 3, V(w) + 2.2, 6, "s-d", fmt(w, 2), "end");
  out += axes(u0, v0, u1, v1) + tx(u0, v1 + 9, 6.2, "s-d", T.shot + " " + (first + 1) + "–" + st.shots);
  const pts = [];
  for (let i = first; i < st.shots; i++) pts.push([U(i), V(spcWeight(i)), spcWeight(i)]);
  if (pts.length > 1) out += '<path class="s-ink" d="' + poly(pts) + '"/>';
  pts.forEach((p, j) => {
    const out1 = p[2] < SPC.mean - 3 * SPC.sd || p[2] > SPC.mean + 3 * SPC.sd;
    const last = j === pts.length - 1;
    if (out1) out += '<circle class="s-acc" cx="' + p[0].toFixed(2) + '" cy="' + p[1].toFixed(2) + '" r="3.6"/>';
    out += '<circle class="' + (last || out1 ? "s-dot-a" : "s-dot") + '" cx="' + p[0].toFixed(2) + '" cy="' + p[1].toFixed(2) + '" r="' + (last ? 2 : 1.4) + '"/>';
  });
  return out;
}
let lastScreen = "";
function drawScreen() {
  const s = LVL === 1 ? screenSheet() : LVL === 2 ? screenWindow() : LVL === 3 ? screenGate() : screenSpc();
  if (s !== lastScreen) { el.screen.innerHTML = s; lastScreen = s; }
  const w = shown.w;
  const txt = LVL === 4 ? fmt(w, 3) : fmt(w, 2);
  const d = tx(DW - 13, DH - 7, 19, "s-t", txt, "end") + tx(DW - 4, DH - 7, 8, "s-d", "g", "end") + tx(4, 8.5, 5.6, "s-d", T.net) + (Math.abs(shown.drop) < 0.5 ? tx(4, DH - 4, 5.6, "s-a", T.stable) : "");
  el.disp.innerHTML = d;
  // signal tower
  const m = model();
  let lamp = "good";
  if (LVL === 2 && m.state !== "good") lamp = "bad";
  if (LVL === 3 && st.seen < 5) lamp = "mid";
  if (LVL === 4 && st.shots > 0) { const w = spcWeight(st.shots - 1); if (w < SPC.mean - 3 * SPC.sd || w > SPC.mean + 3 * SPC.sd) lamp = "bad"; }
  el.lamps.forEach((n) => { if (n.dataset.lamp === lamp) n.setAttribute("data-on", ""); else n.removeAttribute("data-on"); });
}

// ------------------------------------------------ the part on the pan, drawn live
const pt = (p) => iso(p, P);
const pathOfPts = (pts) => "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + "Z";
function drawPart() {
  const cap = LVL === 4;
  const R = cap ? 15 : LID.R, H = cap ? 13 : LID.H, cx = LID.cx, cy = LID.cy;
  const z0 = PAN_Z + shown.drop, z1 = z0 + H;
  const out = [];
  // shadow on the pan
  const sh = []; for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; sh.push(pt([cx + (R + 2) * Math.cos(a), cy + (R + 2) * Math.sin(a), PAN_Z])); }
  out.push('<path class="pt-shadow" style="opacity:' + clamp(1 - shown.drop / 30, 0, 1).toFixed(2) + '" d="' + pathOfPts(sh) + '"/>');
  // outline of what is filled: a disc cut by the flow front around the side gate at angle π
  const gx = cx - R, gy = cy, reach = 2 * R * shown.fill;
  const N = 72, poly2 = [], rim = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const rx = cx + R * Math.cos(a), ry = cy + R * Math.sin(a);
    const d = Math.hypot(rx - gx, ry - gy);
    if (d <= reach || d < 1e-6) { poly2.push([rx, ry]); rim.push(true); }
    else { const f = reach / d; poly2.push([gx + (rx - gx) * f, gy + (ry - gy) * f]); rim.push(false); }
  }
  // side faces, back to front
  const quads = [];
  for (let i = 0; i < N; i++) {
    const a = poly2[i], b = poly2[(i + 1) % N];
    const nx = b[1] - a[1], ny = -(b[0] - a[0]);
    if (nx * VIEW[0] + ny * VIEW[1] <= 0) continue;
    quads.push({ d: (a[0] + b[0]) * VIEW[0] + (a[1] + b[1]) * VIEW[1], p: [pt([a[0], a[1], z0]), pt([b[0], b[1], z0]), pt([b[0], b[1], z1]), pt([a[0], a[1], z1])] });
  }
  quads.sort((u, v) => u.d - v.d);
  out.push('<path class="pt-side" d="' + quads.map((qd) => pathOfPts(qd.p)).join("") + '"/>');
  // the side's outline: bottom edge of the visible run
  // flash: a thin fin on the parting line (mid height) where the rim is filled
  const fw = clamp(shown.fin / 40, 0, 5);
  if (fw > 0.05 && !cap) {
    const o = [], inn = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const f = rim[i] ? fw * (0.75 + 0.25 * Math.sin(i * 1.9)) : 0;
      o.push(pt([cx + (R + f) * Math.cos(a), cy + (R + f) * Math.sin(a), z0 + H * 0.5]));
      inn.push(pt([cx + R * Math.cos(a), cy + R * Math.sin(a), z0 + H * 0.5]));
    }
    out.push('<path class="pt-flash" fill-rule="evenodd" d="' + pathOfPts(o) + pathOfPts(inn) + '"/>');
  }
  const top = poly2.map(([x, y]) => pt([x, y, z1]));
  out.push('<path class="pt pt-top" d="' + pathOfPts(top) + '"/>');
  // the outline of the side: silhouette bottom curve
  const bottom = []; let started = false; let seg = [];
  const segs = [];
  for (let i = 0; i <= N; i++) {
    const j = i % N, a = poly2[j], b = poly2[(j + 1) % N];
    const nx = b[1] - a[1], ny = -(b[0] - a[0]);
    const vis = nx * VIEW[0] + ny * VIEW[1] > 0;
    if (vis) { seg.push(pt([a[0], a[1], z0]), pt([b[0], b[1], z0])); }
    else if (seg.length) { segs.push(seg); seg = []; }
  }
  if (seg.length) segs.push(seg);
  out.push('<path class="pt-mark" style="stroke:var(--anatomy-hi);stroke-width:.45px" d="' + segs.map((s) => "M" + s.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L")).join("") + '"/>');
  // marks on the top, clipped to what is filled: a ring, the gate vestige
  const ring = (r, k) => { const ps = []; for (let i = 0; i < k; i++) { const a = (i / k) * Math.PI * 2; ps.push(pt([cx + r * Math.cos(a), cy + r * Math.sin(a), z1])); } return pathOfPts(ps); };
  out.push('<clipPath id="mw-top"><path d="' + pathOfPts(top) + '"/></clipPath><g clip-path="url(#mw-top)"><path class="pt-mark" d="' + (cap ? ring(R - 3, 40) + ring(4, 20) : ring(R - 5, 64) + ring(R - 7, 64) + ring(5, 24)) + '"/></g>');
  if (!cap) { const g0 = pt([gx + 1.2, gy, z1]); out.push('<circle class="pt-mark" cx="' + g0[0].toFixed(2) + '" cy="' + g0[1].toFixed(2) + '" r="1.1"/>'); }
  // the flow front, where the part is not full
  if (shown.fill < 0.999) {
    const fr = []; let cur = [];
    for (let i = 0; i <= N; i++) { const j = i % N; if (!rim[j]) cur.push(top[j]); else if (cur.length) { fr.push(cur); cur = []; } }
    if (cur.length) fr.push(cur);
    out.push('<path class="pt-front" d="' + fr.filter((s) => s.length > 1).map((s) => "M" + s.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L")).join("") + '"/>');
  }
  el.part.innerHTML = out.join("");
}

// ------------------------------------------------ readout
let marked = -1;
const acc = (s) => '<span class="mp-acc">' + s + "</span>";
const strong = (s) => '<span class="mp-strong">' + s + "</span>";
function windowAt(p) {
  // the temperature range that is good at this hold pressure
  const lo = Math.max(AXIS.T0, 220 + (400 - p) / 8), hi = Math.min(AXIS.T1, 250 - (p - 400) / 10);
  return hi >= lo ? [lo, hi] : null;
}
function readout() {
  const m = model();
  const out = [];
  if (LVL === 1) {
    out.push(strong(T.rows[st.row][0]) + " · " + (st.row === "temp" ? T.temps : T.rows[st.row][1]));
    out.push(T.why[st.row]);
    out.push(T.fillEq);
  } else if (LVL === 2) {
    const name = m.state === "good" ? strong(T.good) : acc(m.state === "short" ? T.short : T.flash);
    out.push("T " + st.T + " °C · p " + st.p + " bar → " + name + " · " + strong(fmt(m.w, 2) + " g"));
    const wv = windowAt(st.p);
    if (wv) {
      const margin = Math.min(st.T - wv[0], wv[1] - st.T);
      out.push(T.win + " " + st.p + " bar: " + Math.round(wv[0]) + "–" + Math.round(wv[1]) + " °C · " + T.mid + " " + Math.round((wv[0] + wv[1]) / 2) + " °C" + (margin >= 0 ? " · " + T.edge + " " + Math.round(margin) + " °C" : ""));
    } else out.push(T.win + " " + st.p + " bar: " + T.none);
    let ok = true;
    for (const dT of [-SWING.T, SWING.T]) for (const dp of [-SWING.p, SWING.p]) if (stateOf(st.T + dT, st.p + dp) !== "good") ok = false;
    out.push(T.swing + " " + (m.state !== "good" ? acc(T.outside) : ok ? T.stays : acc(T.rejects)));
  } else if (LVL === 3) {
    out.push(T.study + " " + st.th + " s → " + strong(fmt(m.w, 2) + " g"));
    const prev = st.th > 1 ? gateW(st.th - 1) : null;
    out.push(GATE.filter(([t]) => t <= st.seen).map(([t, w]) => t + " s " + fmt(w, 2)).join(" · ") + " g");
    if (st.seen >= 5) out.push(acc(T.flat));
    else out.push((prev === null ? "" : "+" + fmt(m.w - prev, 2) + " g ") + T.rising);
    out.push(T.pcheck);
  } else {
    const w = spcWeight(st.shots - 1);
    const outC = w < SPC.mean - 3 * SPC.sd || w > SPC.mean + 3 * SPC.sd;
    const outQ = w < SPC.oqLo || w > SPC.oqHi;
    out.push(T.shot + " " + st.shots + " · " + strong(fmt(w, 3) + " g") + " · " + (outQ ? acc(T.bad) : outC ? acc(T.alarm) + " · " + T.stillGood : T.within));
    out.push(T.pq);
    out.push(T.oq);
    const a = alarmShot();
    out.push(st.drift ? T.driftOn + (a >= 0 ? " · " + T.firstAlarm + " " + (a + 1) : "") : T.driftOff);
  }
  if (LVL <= 2) out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + (T.parts[PARTS[marked].key][1] ? " · " + T.parts[PARTS[marked].key][1] : "") : '<span class="mp-mute">' + T.tapPart + "</span>");
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}

function draw() {
  drawScreen();
  drawPart();
  if (marked >= 0) {
    const [x, y] = iso(PARTS[marked].at, P);
    el.mark.innerHTML = '<circle class="mp-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="mp-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
  readout();
}

// ------------------------------------------------ loop: ease toward the model
let frame = 0, lastT = 0, visible = false;
let tour = LVL === 1 && !still.matches, tourT = 0;
function settled() { const t = target(); return Object.keys(t).every((key) => Math.abs(t[key] - shown[key]) < 1e-3); }
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  const t = target();
  if (still.matches) Object.assign(shown, t);
  else {
    const a = 1 - Math.exp(-dt / 0.25), ad = 1 - Math.exp(-dt / 0.16);
    for (const key of Object.keys(t)) shown[key] += (t[key] - shown[key]) * (key === "drop" ? ad : a);
  }
  if (tour && visible) {
    tourT += dt;
    if (tourT > 3.4) { tourT = 0; st.row = ROWS[(ROWS.indexOf(st.row) + 1) % ROWS.length]; sync(); }
  }
  draw();
  frame = visible && !still.matches && (tour || !settled()) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { lastT = 0; frame = requestAnimationFrame(tick); } };
const kick = () => { if (still.matches) { Object.assign(shown, target()); draw(); } else run(); };
// a new shot lands on the pan
function newShot() { if (!still.matches) shown.drop = 24; }

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll(".mp-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const pickBtns = [...document.querySelectorAll("[data-pick]")];
const stepBtns = [...document.querySelectorAll("[data-step]")];
const weighBtn = document.querySelector("[data-weigh]");
let sel = LVL === 3 ? "th" : "T";
const UNITS = { T: "°", p: "", th: " s" };
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const on = String(st[key]) === val; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  pickBtns.forEach((b) => { const on = b.dataset.pick === sel; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; b.querySelector("b").textContent = st[b.dataset.pick] + UNITS[b.dataset.pick]; });
  stepBtns.forEach((b) => {
    const row = b.closest(".mp-row");
    if (row.hidden) return;
    const list = SETS[sel], i = list.indexOf(st[sel]);
    b.disabled = b.dataset.step === "-" ? i <= 0 : i >= list.length - 1;
  });
}
function announce() { announcer.textContent = lines.map((l) => l.textContent).filter(Boolean).join(". "); }
function changed() { sync(); readout(); announce(); kick(); }
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  tour = false;
  if (key === "row") st.row = val;
  else if (key === "drift") {
    const on = val === "true";
    if (on && !st.drift) { st.driftFrom = st.shots; st.driftTo = 0; }
    if (!on && st.drift) st.driftTo = st.shots;
    st.drift = on;
  }
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
pickBtns.forEach((b) => b.addEventListener("click", () => { sel = b.dataset.pick; changed(); }));
function stepValue(dir) {
  const list = SETS[sel];
  const i = list.indexOf(st[sel]);
  const v = list[clamp(i + dir, 0, list.length - 1)];
  if (v === st[sel]) return;
  st[sel] = v;
  if (sel === "th") st.seen = Math.max(st.seen, v);
  newShot();
  changed();
}
stepBtns.forEach((b) => b.addEventListener("click", () => stepValue(b.dataset.step === "+" ? 1 : -1)));
function weigh() { st.shots += 1; newShot(); changed(); }
if (weighBtn) weighBtn.addEventListener("click", weigh);

// tap the drawing: at levels 1 and 2 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 80;
  PARTS.forEach((p, i) => { const [px, py] = iso(p.at, P); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
  return best;
}
stage.addEventListener("click", (event) => {
  if (LVL > 2) return;
  tour = false;
  marked = nearestPart(toView(event));
  draw(); announce(); kick();
});
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (LVL <= 2 && (event.key === "ArrowRight" || event.key === "ArrowDown")) { tour = false; marked = (marked + 1) % PARTS.length; draw(); announce(); }
  else if (LVL <= 2 && (event.key === "ArrowLeft" || event.key === "ArrowUp")) { tour = false; marked = (marked + PARTS.length - 1) % PARTS.length; draw(); announce(); }
  else if ((LVL === 2 || LVL === 3) && event.key === "+") stepValue(1);
  else if ((LVL === 2 || LVL === 3) && event.key === "-") stepValue(-1);
  else if (LVL === 4 && (event.key === "+" || event.key === " ")) weigh();
  else handled = false;
  if (handled) event.preventDefault();
});

// ------------------------------------------------ start
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) tick(performance.now()); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { cancelAnimationFrame(frame); frame = 0; tour = false; tick(performance.now()); } else run(); });
sync();
draw();
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Procesinstelling",
    hint1: "Tik een onderdeel · kies een instelling",
    hint2: "Tik een onderdeel · kies T of p, dan − of +",
    hint3: "Verleng de nadruktijd en weeg elk shot",
    hint4: "Weeg een shot · laat de terugslagring lekken",
    settings: "Instelling",
    temp: "Temp.",
    speed: "Snelh.",
    sw: "Omsch.",
    hold: "Nadruk",
    cool: "Koelen",
    vals: "Instelling",
    holdT: "Nadruktijd",
    drifts: "Proces",
    stable: "Stabiel",
    leak: "Ring lekt",
    weigh: "Weeg een shot",
    minus: "Lager",
    plus: "Hoger",
    label: LABEL_NL,
    aria: "Bedieningspaneel van een spuitgietpers naast een weegschaal met een product. Niveau 1 en 2: pijltjes kiezen een onderdeel. Plus en min veranderen de gekozen instelling.",
  },
  en: {
    title: "Process setting",
    hint1: "Tap a part · pick a setting",
    hint2: "Tap a part · pick T or p, then − or +",
    hint3: "Lengthen the hold time and weigh each shot",
    hint4: "Weigh a shot · let the check ring leak",
    settings: "Setting",
    temp: "Temp",
    speed: "Speed",
    sw: "Switch",
    hold: "Hold",
    cool: "Cool",
    vals: "Setting",
    holdT: "Hold time",
    drifts: "Process",
    stable: "Stable",
    leak: "Ring leaks",
    weigh: "Weigh a shot",
    minus: "Lower",
    plus: "Higher",
    label: LABEL_EN,
    aria: "Control panel of an injection moulding press beside a scale with a part. Levels 1 and 2: arrows pick a part. Plus and minus change the chosen setting.",
  },
};

const sN = STRINGS.nl;
const radio = (set, text, attr) => `<button type="button" class="mp-btn" role="radio" data-set="${set}"${attr ? ` data-t="${attr}"` : ""} aria-checked="false" tabindex="-1">${text}</button>`;
const valBtn = (key, labelHtml) => `<button type="button" class="mp-btn" role="radio" data-pick="${key}" aria-checked="false" tabindex="-1">${labelHtml}&nbsp;<b></b></button>`;
const steppers = `<button type="button" class="mp-btn" data-step="-" aria-label="${sN.minus}" data-t-label="minus">−</button><button type="button" class="mp-btn" data-step="+" aria-label="${sN.plus}" data-t-label="plus">+</button>`;
const controls = [
  `<div class="mp-controls">`,
  `<div class="mp-row" data-row="setting" data-levels="1" role="radiogroup" aria-label="${sN.settings}" data-t-label="settings">${["temp", "speed", "sw", "hold", "cool"].map((d) => radio(`row:${d}`, sN[d], d)).join("")}</div>`,
  `<div class="mp-row" data-row="vals" data-levels="2"><div class="mp-group" role="radiogroup" aria-label="${sN.vals}" data-t-label="vals">${valBtn("T", "<i>T</i>")}${valBtn("p", "<i>p</i>")}</div>${steppers}</div>`,
  `<div class="mp-row" data-row="hold" data-levels="3"><div class="mp-group" role="radiogroup" aria-label="${sN.vals}" data-t-label="vals">${valBtn("th", `<span data-t="holdT">${sN.holdT}</span>`)}</div>${steppers}</div>`,
  `<div class="mp-row" data-row="drift" data-levels="4" role="radiogroup" aria-label="${sN.drifts}" data-t-label="drifts">${radio("drift:false", sN.stable, "stable")}${radio("drift:true", sN.leak, "leak")}</div>`,
  `<div class="mp-row" data-row="weigh" data-levels="4"><button type="button" class="mp-btn" data-weigh="" data-t="weigh">${sN.weigh}</button></div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="mp-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="mp-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="mp-line"></span>'.repeat(4)}</span>`)
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
var st=document.querySelector(".mp-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: fill ${fillTime(CARD).toFixed(2)} s · cycle ${cycleOf(CARD).toFixed(1)} s · window at 400 bar 220–250 °C · nominal ${weightOf(230, 400, 4).toFixed(2)} g · short 230/250 ${weightOf(230, 250, 4).toFixed(2)} g · flash 260/450 ${weightOf(260, 450, 4).toFixed(2)} g · Cpk ${((SPC.oqHi - SPC.mean) / (3 * SPC.sd)).toFixed(2)}`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { apart: false });
