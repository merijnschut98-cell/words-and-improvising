// Dev tool, not shipped. Builds the standalone figure for the topic
// "Besturing en data" (module Lijnen en automatisering): the lessons
// eng.lines.plc (level 1), safety (level 2) and stoppages (level 4). Level 3
// (oee_auto) keeps its own figure, eng.lines.auto; this page opens level 3 like
// level 2 so a stray link still works.
//
//   node figures/eng.lines.plc/build.mjs            build the page
//   node figures/eng.lines.plc/build.mjs --audit    build, then prove the geometry
//
// Writes src/content/courses/figures/eng.lines.plc.html: one offline page with
// the anatomy kit and the live script inlined. The page reads ?theme=light|dark,
// ?lang=nl|en and ?level=1..4 from its URL (defaults: prefers-color-scheme,
// Dutch, level 2).
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
const OUT = join(ROOT, "src/content/courses/figures/eng.lines.plc.html");

// ---------------------------------------------------------------- the model
// A press station with its control cabinet (the plc lesson's worked example).
// Sensors are wired to PLC inputs, actuators to outputs (24 V on/off):
//   I0.0 onderdeel aanwezig (diffuse sensor at the nest)
//   I0.1 klem dicht        (reed sensor on the clamp cylinder)
//   I0.2 pers onder        (reed sensor on the press cylinder)
//   Q0.0 klem sluiten → valve Y1 → clamp cylinder
//   Q0.1 persen       → valve Y2 → press cylinder
// The program runs in steps: 1 wait for part, 2 close clamp, 3 wait for
// "klem dicht", 4 press, 5 release. A dirty or shifted sensor means the input
// never comes: the machine hangs in step 3 (the lesson's "hangt in stap 3").
// Scan cycle 10 ms → inputs read 1000/10 = 100× per second (worked example);
// 20 ms → 50× (recall).
//
// Safety (the safety lesson; checked against the sources below): the emergency
// stop has two normally closed channels wired to a safety relay, which drops two
// contactors K1 and K2 in series in the supply of the outputs. A pressed button
// or a broken wire opens the chain, so both mean a safe stop (fail-safe).
// Releasing the button does not restart; the relay needs a deliberate Reset,
// and the machine then still waits for Start.
//   Stop category 0: energy removed at once; category 1: braked to standstill
//   first, then energy removed (EN 60204-1, 9.2.2; an emergency stop is
//   category 0 or 1, 9.2.3.4.2 / EN ISO 13850). The 0.5 s braking time is an
//   assumption for the figure.
//   Performance level PL a … e (ISO 13849-1), from the risk graph S, F, P
//   (Annex A); the lesson's example: S2 F2 P1 → PL d, S2 F2 P2 → PL e.
//   EU: Machinery Directive 2006/42/EC, replaced by the Machinery Regulation
//   (EU) 2023/1230 from 20 January 2027 (Art. 54).
//
// Level 4 (the stoppages lesson's faded example, one week of 10 shifts):
//   onderdeel niet aanwezig 1,200 × 20 s = 400 min, servostoring 6 × 25 min =
//   150 min, deur geopend 300 × 30 s = 150 min; a Pareto by count or by minutes.
//   1,200 / 10 shifts = 120 micro-stops per shift. Recall: 900 × 20 s = 300 min.
const SCANS = [10, 20]; // ms
const ALARMS = [
  { key: "part", n: 1200, s: 20 },
  { key: "servo", n: 6, s: 25 * 60 },
  { key: "door", n: 300, s: 30 },
];
const SHIFTS = 10;
const BRAKE = 0.5; // s, stop category 1 (assumption)
const RISK = { S1F1P1: "a", S1F1P2: "b", S1F2P1: "b", S1F2P2: "c", S2F1P1: "c", S2F1P2: "d", S2F2P1: "d", S2F2P2: "e" };
const MR_DATE = "2027-01-20";
function perSecond(scan) { return 1000 / scan; }
function minutesOf(a) { return (a.n * a.s) / 60; }
{
  const near = (a, b, e, what) => { if (Math.abs(a - b) > e) throw new Error(`${what}: ${a} is not ${b}`); };
  near(perSecond(10), 100, 1e-9, "plc example: 10 ms → 100× per second");
  near(perSecond(20), 50, 1e-9, "plc recall: 20 ms → 50× per second");
  near(minutesOf(ALARMS[0]), 400, 1e-9, "stoppages: 1,200 × 20 s = 400 min");
  near(minutesOf(ALARMS[1]), 150, 1e-9, "stoppages: 6 × 25 min = 150 min");
  near(minutesOf(ALARMS[2]), 150, 1e-9, "stoppages: 300 × 30 s = 150 min");
  near(ALARMS[0].n / SHIFTS, 120, 1e-9, "stoppages: 120 micro-stops per shift");
  near((900 * 20) / 60, 300, 1e-9, "stoppages recall: 900 × 20 s = 300 min");
  if (RISK.S2F2P1 !== "d" || RISK.S2F2P2 !== "e") throw new Error("safety: risk graph S2 F2 P1 → d, P2 → e");
  if (MR_DATE !== "2027-01-20") throw new Error("safety: Machinery Regulation from 20 January 2027");
}

// ---------------------------------------------------------------- the world
// World units are about 5 mm, z up, +y toward the operator (front), +x right.
// The top of the bench is z = 0.
const WIDTH = 600;
const BENCH = { x: -92, y: -40, w: 184, d: 78, r: 2 };
const CAB = { x: -86, y: -36, w: 56, d: 22, r: 0.6 };
const CAB_H = 66;
const WALL = 1.6;
const MP_Y = CAB.y + WALL + 1; // the mounting plate's face
const NEST = { x: 27, y: -5, w: 26, d: 14, r: 0.8 };
const NEST_Z = 6;
const PARTC = [40, 2];
const PART = { w: 10, d: 8, h: 4 };
const CL = { x0: 56, x1: 76, y: 2, z: 9, r: 4 }; // clamp cylinder along x
const JAW = { x: 50, w: 3, y: -3, d: 10, z0: NEST_Z, z1: 12 };
const JAW_STROKE = JAW.x - (PARTC[0] + PART.w / 2); // 5: the jaw lands on the part
const PR = { x: 40, y: 2, r: 4.5, z0: 37, z1: 56 }; // press cylinder
const RAM = { r: 3, h: 2, rest: 22 };
const RAM_STROKE = RAM.rest - (NEST_Z + PART.h); // 12: the ram lands on the part
const COL = [40, -22];
const MAN = { x: 54, y: -34, w: 24, d: 8, r: 0.5 };
const VALVES = [58, 68]; // left x of Y1, Y2
const FRL = [86, -30];
const CON = { x: -14, y: 18, w: 36, d: 12, r: 1 };
const CON_H = 9;
const HMI = { x: -13, y: 18, w: 28, d: 2.4, r: 0.4 };
const HMI_Z = [CON_H, 31];
const HMI_F = HMI.y + HMI.d; // face
const SCREEN = { x0: -11, x1: 13, z0: 11, z1: 29 };
const ESTOP = [-6, 25];
const SENS = { x: 37.5, y: 13, w: 5, d: 4, z0: 6, z1: 10 }; // diffuse part sensor
const STACK = [CAB.x + CAB.w - 9, CAB.y + 8];

const FIT = [...k.boxCorners(BENCH, -11, 0), [STACK[0], STACK[1], CAB_H + 15], [COL[0], COL[1], 61], [CAB.x, CAB.y, CAB_H + 2]];
const PAD = 6;
const AZIMUTH = Number(process.env.AZ ?? 58);
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
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const f2 = (v) => v.toFixed(2);

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
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = "pc-card") => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const rulesY = (x0, y, z, lens, step = 1.4) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(""), { tone: "lo", free: true });
const led = (key, p, r = 0.55) => { const [x, y] = at(p); return `<circle class="pc-led" data-led="${key}" cx="${f2(x)}" cy="${f2(y)}" r="${f2(r * KS)}"/>`; };

// ---------------------------------------------------------------- bench and feet
const halo = `<path class="iso-halo" d="${k.haloOf(k.insetPlan(BENCH, -2), -11, 2, P)}"/>`;
for (const [x, y] of k.corners(BENCH, 8)) post("stand.foot", x, y, 3.6, -11, -6, { tone: "lo" }, { steps: 24, layer: "floor", ground: true });
{
  const screws = k.corners(BENCH, 3.6);
  box("stand.bench", BENCH, -6, 0, { tone: "lo" }, {
    steps: 3, bevel: 0.6, layer: "floor", ground: true,
    inner: L(k.sideSeam(BENCH, -3, P, 3), { tone: "faint" }),
    extra: L(k.planOutline(k.insetPlan(BENCH, 2.4), 0, P, 3), { tone: "faint" }) + L(screws.map(([x, y]) => k.ring(x, y, 1.3, 0, P, 14)).join(""), { tone: "lo" }) + Dt(screws.map(([x, y]) => at([x, y, 0])), { size: 0.45 }),
  });
}
// the CE type plate at the front right, three engraved rule lines
{
  const lp = { x: 62, y: 27, w: 20, d: 8, r: 0.5 };
  box("stand.label", lp, 0, 0.4, { tone: "lo", crease: "none" }, {
    steps: 2, layer: "floor",
    extra: L([0, 1, 2].map((i) => k.lineOnTop([lp.x + 2.4, lp.y + 2 + i * 2], [lp.x + 2.4 + [13, 9, 11][i], lp.y + 2 + i * 2], 0.4, P)).join(""), { tone: "lo", free: true }) + Dt(k.corners(lp, 1).map(([x, y]) => at([x, y, 0.4])), { size: 0.3 }),
  });
}
// a ruler strip along the front edge, ticks every 5 units, major every 25
{
  const rs = { x: -84, y: 32, w: 62, d: 3.4, r: 0.3 };
  const ticks = [];
  for (let i = 0; i <= 12; i++) {
    const x = rs.x + 1 + i * 5;
    ticks.push(k.lineOnTop([x, rs.y], [x, rs.y + (i % 5 === 0 ? 2.6 : 1.4)], 0.4, P));
  }
  box("stand.ruler", rs, 0, 0.4, { tone: "lo", crease: "none" }, { steps: 2, layer: "floor", extra: L(ticks.join(""), { tone: "mid" }) });
}

// ---------------------------------------------------------------- the control cabinet (door off)
const GLANDS = { chainA: -78, chainB: -75.2, i0: -68, i1: -64, i2: -60, q0: -52, q1: -48 };
{
  const fy = CAB.y + CAB.d;
  box("cab.plinth", CAB, 0, 3, { tone: "lo" }, {
    steps: 2, bevel: 0.3,
    extra: Object.values(GLANDS).map((x) => `<path class="pc-hole" d="${k.pathOf(Array.from({ length: 14 }, (_, i) => at([x + 0.9 * Math.cos((i / 14) * Math.PI * 2), fy, 1.5 + 0.9 * Math.sin((i / 14) * Math.PI * 2)])), true)}"/>`).join(""),
  });
  box("cab.back", { x: CAB.x, y: CAB.y, w: CAB.w, d: WALL, r: 0.2 }, 3, CAB_H, { tone: "lo" }, { steps: 1 });
  box("cab.left", { x: CAB.x, y: CAB.y + WALL, w: WALL, d: CAB.d - WALL, r: 0.2 }, 3, CAB_H, { tone: "mid" }, {
    steps: 1,
    extra: Dt([[CAB.x + WALL, fy - 0.6, 12], [CAB.x + WALL, fy - 0.6, CAB_H - 9]].map(at), { size: 0.5 }),
  });
  box("cab.floor", { x: CAB.x + WALL, y: CAB.y + WALL, w: CAB.w - 2 * WALL, d: CAB.d - WALL, r: 0.2 }, 3, 4.4, { tone: "lo" }, { steps: 1 });
  box("cab.plate", { x: CAB.x + 4, y: CAB.y + WALL, w: CAB.w - 8, d: 1, r: 0.2 }, 6, CAB_H - 4, { tone: "lo", crease: "none" }, {
    steps: 1,
    extra: Dt([[CAB.x + 5.4, MP_Y, 7.4], [CAB.x + CAB.w - 5.4, MP_Y, 7.4], [CAB.x + 5.4, MP_Y, CAB_H - 5.4], [CAB.x + CAB.w - 5.4, MP_Y, CAB_H - 5.4]].map(at), { size: 0.45 }),
  });
}
const rail = (name, z, x0, x1) => box(name, { x: x0, y: MP_Y, w: x1 - x0, d: 0.8, r: 0.1 }, z - 1.6, z + 1.6, { tone: "mid", crease: "none" }, { steps: 1, extra: Dt([[x0 + 1.4, MP_Y + 0.8, z], [x1 - 1.4, MP_Y + 0.8, z]].map(at), { size: 0.35 }) });
const ON_RAIL = MP_Y + 0.8;
// rail A: power supply, PLC, input card, output card, servo drive
rail("cab.rail-a", 50, CAB.x + 5, CAB.x + CAB.w - 7);
const MOD = {
  psu: { x: -80, w: 7, d: 8, z0: 43, z1: 57 },
  cpu: { x: -72.4, w: 9, d: 10, z0: 42, z1: 58 },
  di: { x: -62.8, w: 5, d: 9, z0: 43, z1: 57 },
  dout: { x: -57.2, w: 5, d: 9, z0: 43, z1: 57 },
  drive: { x: -50.6, w: 10, d: 11, z0: 41, z1: 59 },
};
{
  const { psu, cpu, di, dout, drive } = MOD;
  const fyOf = (m) => ON_RAIL + m.d;
  const plan = (m) => ({ x: m.x, y: ON_RAIL, w: m.w, d: m.d, r: 0.4 });
  box("cab.psu", plan(psu), psu.z0, psu.z1, { tone: "mid" }, {
    steps: 2, bevel: 0.2,
    extra: `<path class="pc-hole" d="${[0, 1, 2, 3].map((i) => faceY(fyOf(psu), psu.x + 1.4, psu.x + psu.w - 1.4, psu.z1 - 2.4 - i * 1.6, psu.z1 - 1.8 - i * 1.6)).join("")}"/>` + led("psu", [psu.x + 1.8, fyOf(psu), psu.z0 + 2.4]) +
      Dt([[psu.x + 3.6, fyOf(psu), psu.z0 + 2.4], [psu.x + 5.2, fyOf(psu), psu.z0 + 2.4]].map(at), { size: 0.4 }),
  });
  box("cab.cpu", plan(cpu), cpu.z0, cpu.z1, { tone: "hi", crease: "lo" }, {
    steps: 2, bevel: 0.25,
    extra: card(fyOf(cpu), cpu.x + 1.4, cpu.x + cpu.w - 1.4, cpu.z1 - 6, cpu.z1 - 1.6) + rulesY(cpu.x + 2.2, fyOf(cpu), cpu.z1 - 2.6, [4, 3, 3.6]) +
      led("run", [cpu.x + 2, fyOf(cpu), cpu.z1 - 8]) + led("err", [cpu.x + 4, fyOf(cpu), cpu.z1 - 8]) +
      `<path class="pc-hole" d="${faceY(fyOf(cpu), cpu.x + 2, cpu.x + cpu.w - 2, cpu.z0 + 2, cpu.z0 + 4)}"/>`,
  });
  for (const [m, name, keyOf] of [[di, "cab.di", (i) => "i" + i], [dout, "cab.do", (i) => "q" + i]]) {
    const fy = fyOf(m);
    box(name, plan(m), m.z0, m.z1, { tone: "mid" }, {
      steps: 2, bevel: 0.2,
      extra: [0, 1, 2, 3].map((i) => led(keyOf(i), [m.x + 1.4, fy, m.z1 - 2.4 - i * 1.8], 0.5)).join("") + rulesY(m.x + 2.4, fy, m.z1 - 2.4, [1.4, 1.4, 1.4, 1.4], 1.8) +
        Dt([[m.x + m.w / 2, fy, m.z0 + 1.8]].map(at), { size: 0.45 }),
    });
  }
  box("cab.drive", plan(drive), drive.z0, drive.z1, { tone: "mid" }, {
    steps: 2, bevel: 0.25,
    extra: `<path class="pc-hole" d="${[0, 1, 2, 3, 4].map((i) => faceY(fyOf(drive), drive.x + 1.6 + i * 1.6, drive.x + 2.4 + i * 1.6, drive.z0 + 2, drive.z0 + 7)).join("")}"/>` +
      card(fyOf(drive), drive.x + 1.6, drive.x + drive.w - 1.6, drive.z1 - 5, drive.z1 - 1.6, "pc-screen") + led("drive", [drive.x + drive.w - 2, fyOf(drive), drive.z0 + 9]),
  });
}
// the wire duct between the rails, with its comb slots
{
  const dz = [35.5, 39.5];
  const dp = { x: CAB.x + 5, y: MP_Y, w: CAB.w - 12, d: 6, r: 0.2 };
  const fy = MP_Y + 6;
  const combs = [];
  for (let x = dp.x + 2; x < dp.x + dp.w - 1; x += 2.2) combs.push(k.segment([x, fy, dz[0]], [x, fy, dz[1]], P));
  box("cab.duct", dp, dz[0], dz[1], { tone: "lo" }, { steps: 1, extra: L(combs.join(""), { tone: "faint" }) });
}
// rail B: safety relay K0 and the contactors K1, K2
rail("cab.rail-b", 28, CAB.x + 5, CAB.x + CAB.w - 7);
{
  const sr = { x: -80, w: 7, d: 10, z0: 20, z1: 35 };
  const fy = ON_RAIL + sr.d;
  box("cab.relay", { x: sr.x, y: ON_RAIL, w: sr.w, d: sr.d, r: 0.4 }, sr.z0, sr.z1, { tone: "hi", crease: "lo" }, {
    steps: 2, bevel: 0.2,
    extra: led("k0a", [sr.x + 1.8, fy, sr.z1 - 2.6]) + led("k0b", [sr.x + 3.6, fy, sr.z1 - 2.6]) + led("k0p", [sr.x + 5.4, fy, sr.z1 - 2.6]) +
      rulesY(sr.x + 1.4, fy, sr.z1 - 5, [4.2, 3, 3.6]) + Dt([[sr.x + 1.6, fy, sr.z0 + 1.6], [sr.x + 3.5, fy, sr.z0 + 1.6], [sr.x + 5.4, fy, sr.z0 + 1.6]].map(at), { size: 0.4 }),
  });
  for (const [i, x] of [[1, -71.6], [2, -64.6]]) {
    const c = { x, w: 6, d: 9, z0: 21, z1: 34 };
    const cfy = ON_RAIL + c.d;
    box("cab.k" + i, { x, y: ON_RAIL, w: c.w, d: c.d, r: 0.4 }, c.z0, c.z1, { tone: "mid" }, {
      steps: 2, bevel: 0.2,
      extra: `<path class="pc-flag" data-flag="k${i}" d="${faceY(cfy, x + 1.6, x + c.w - 1.6, c.z1 - 5.4, c.z1 - 3)}"/>` +
        Dt([[x + 1.4, cfy, c.z0 + 1.6], [x + 3, cfy, c.z0 + 1.6], [x + 4.6, cfy, c.z0 + 1.6], [x + 1.4, cfy, c.z1 - 1.4], [x + 3, cfy, c.z1 - 1.4], [x + 4.6, cfy, c.z1 - 1.4]].map(at), { size: 0.38 }),
    });
  }
}
// rail C: the terminal strip X1
rail("cab.rail-c", 12, CAB.x + 5, CAB.x + CAB.w - 7);
for (let i = 0; i < 11; i++) {
  const x = -80 + i * 2.3;
  box("cab.terminal", { x, y: ON_RAIL, w: 2, d: 6, r: 0.2 }, 8.6, 15.4, { tone: i === 0 || i === 10 ? "hi" : "mid", crease: "lo" }, {
    steps: 1, extra: Dt([at([x + 1, ON_RAIL + 6, 14]), at([x + 1, ON_RAIL + 6, 10])], { size: 0.32 }),
  });
}
// the right wall with the main switch, and the roof with the signal tower
{
  const rw = { x: CAB.x + CAB.w - WALL, y: CAB.y + WALL, w: WALL, d: CAB.d - WALL, r: 0.2 };
  box("cab.right", rw, 3, CAB_H, { tone: "mid" }, { steps: 1, layer: "front" });
  const xs = CAB.x + CAB.w;
  discAt("cab.switch", frameX([xs, CAB.y + 11, 46]), 0, 1, 3.4, { tone: "lo" }, { steps: 28, layer: "front" });
  box("cab.handle", { x: xs + 1, y: CAB.y + 10, w: 1.4, d: 2, r: 0.3 }, 42.4, 49.6, { tone: "hi", crease: "lo" }, { steps: 1, layer: "front", extra: Dt([at([xs + 2.4, CAB.y + 11, 46])], { size: 0.4, tone: "hi" }) });
  box("cab.roof", k.insetPlan(CAB, -0.6), CAB_H, CAB_H + 2, { tone: "mid" }, { steps: 2, bevel: 0.4, layer: "front" });
  const [sx, sy] = STACK;
  post("cab.stack-base", sx, sy, 2.6, CAB_H + 2, CAB_H + 3.6, { tone: "lo" }, { steps: 20, layer: "front" });
  [0, 1, 2].forEach((i) => {
    const z0 = CAB_H + 3.6 + i * 3.6;
    post("cab.stack-" + i, sx, sy, 2.2, z0, z0 + 3.6, { tone: "mid", crease: "lo" }, { steps: 20, layer: "front", attrs: ` data-seg="${i}"`, inner: i ? L(k.sideArc(sx, sy, 2.2, z0, P, 20), { tone: "faint" }) : "" });
  });
  post("cab.stack-cap", sx, sy, 2.4, CAB_H + 14.4, CAB_H + 15.4, { tone: "mid" }, { steps: 20, layer: "front", extra: Dt([at([sx, sy, CAB_H + 15.4])], { size: 0.4, tone: "hi" }) });
}

// ---------------------------------------------------------------- the nest, the clamp and the press
{
  const bolts = k.corners(NEST, 2);
  box("jig.nest", NEST, 0, NEST_Z, { tone: "mid" }, {
    steps: 2, bevel: 0.5, inner: L(k.sideSeam(NEST, 2, P, 2), { tone: "faint" }),
    extra: L(bolts.map(([x, y]) => k.ring(x, y, 1.1, NEST_Z, P, 12)).join(""), { tone: "lo" }) + Dt(bolts.map(([x, y]) => at([x, y, NEST_Z])), { size: 0.4 }) +
      L(k.planOutline({ x: PARTC[0] - PART.w / 2 - 0.5, y: PARTC[1] - PART.d / 2 - 0.5, w: PART.w + 1, d: PART.d + 1, r: 0.4 }, NEST_Z, P, 2), { tone: "faint" }),
  });
  // the back stop the clamp pushes the part against
  box("jig.stop", { x: PARTC[0] - PART.w / 2 - 2.4, y: -3, w: 2.4, d: 10, r: 0.3 }, NEST_Z, NEST_Z + 4, { tone: "hi", crease: "lo" }, { steps: 1 });
}
// the clamp cylinder on two feet, a reed sensor on top, two air fittings
{
  for (const x of [58, 71]) box("clamp.foot", { x, y: CL.y - 3, w: 3, d: 6, r: 0.3 }, 0, CL.z - CL.r, { tone: "lo" }, { steps: 1, layer: "front", extra: Dt([at([x + 1.5, CL.y + 3, 1.6])], { size: 0.35 }) });
  const F = frameX([0, CL.y, CL.z]);
  discAt("clamp.cap-rod", F, CL.x0, CL.x0 + 1.6, CL.r + 0.6, { tone: "mid" }, { steps: 28, layer: "front" });
  discAt("clamp.body", F, CL.x0 + 1.6, CL.x1 - 1.6, CL.r, { tone: "hi", crease: "lo" }, { steps: 32, layer: "front" });
  discAt("clamp.cap", F, CL.x1 - 1.6, CL.x1, CL.r + 0.6, { tone: "mid" }, { steps: 28, layer: "front", extra: Dt([at([CL.x1, CL.y, CL.z])], { size: 0.45 }) });
  box("clamp.reed", { x: 58.4, y: CL.y - 0.8, w: 4, d: 1.6, r: 0.3 }, CL.z + CL.r - 0.1, CL.z + CL.r + 1.2, { tone: "hi", crease: "lo" }, { steps: 1, layer: "front" });
  for (const x of [CL.x0 + 0.8, CL.x1 - 0.8]) post("clamp.fitting", x, CL.y, 0.7, CL.z + CL.r + 0.4, CL.z + CL.r + 2, { tone: "mid" }, { steps: 10, layer: "front" });
}
// the moving clamp rod and jaw (translate along x)
const jawSvg =
  S(G.disc(JAW.x + JAW.w, CL.x0 + 8, 1.2, frameX([0, CL.y, CL.z]), P, { steps: 16 }), { tone: "hi", crease: "none" }) +
  S(k.slabOf({ x: JAW.x, y: JAW.y, w: JAW.w, d: JAW.d, r: 0.3 }, JAW.z0, JAW.z1 - JAW.z0, P, 1), { tone: "mid" }) +
  Dt([at([JAW.x + JAW.w, CL.y, CL.z])], { size: 0.45, tone: "hi" });
// the press: a column, an arm, the cylinder with a reed sensor and two fittings
{
  const [cx, cy] = COL;
  post("press.base", cx, cy, 5, 0, 1.6, { tone: "lo" }, { steps: 32, bevel: 0.3, extra: Dt([[cx - 3.6, cy], [cx + 3.6, cy], [cx, cy - 3.6], [cx, cy + 3.6]].map(([x, y]) => at([x, y, 1.6])), { size: 0.4 }) });
  post("press.column", cx, cy, 3, 1.6, 56, { tone: "mid", crease: "none" }, { steps: 24, inner: L(k.sideArc(cx, cy, 3, 30, P, 20), { tone: "faint" }) });
  box("press.arm", { x: cx - 3, y: cy - 3, w: 6, d: PR.y - cy + 7, r: 0.6 }, 56, 61, { tone: "mid" }, { layer: "front", steps: 2, bevel: 0.4, extra: Dt([at([cx, cy, 61]), at([PR.x, PR.y, 61])], { size: 0.45 }) });
  post("press.cylinder", PR.x, PR.y, PR.r, PR.z0, PR.z1, { tone: "hi", crease: "lo" }, { layer: "front", steps: 32, inner: L(k.sideArc(PR.x, PR.y, PR.r, PR.z1 - 2, P, 24) + k.sideArc(PR.x, PR.y, PR.r, PR.z0 + 2, P, 24), { tone: "faint" }) });
  post("press.gland", PR.x, PR.y, 2.4, PR.z0 - 1.4, PR.z0, { tone: "mid" }, { layer: "front", steps: 6 });
  box("press.reed", { x: PR.x - 1.5, y: PR.y + PR.r - 0.2, w: 3, d: 1.4, r: 0.3 }, PR.z0 + 1, PR.z0 + 4, { tone: "hi", crease: "lo" }, { layer: "front", steps: 1 });
  for (const z of [PR.z0 + 3, PR.z1 - 3]) discAt("press.fitting", frameX([0, PR.y, z]), PR.x + PR.r - 0.2, PR.x + PR.r + 1.4, 0.8, { tone: "mid" }, { layer: "front", steps: 8 });
}
const ramSvg =
  S(k.cylinder(PR.x, PR.y, 1.1, RAM.rest + RAM.h, PR.z0 + 12 - RAM.rest - RAM.h, P, 16), { tone: "hi", crease: "none" }) +
  S(k.cylinder(PR.x, PR.y, RAM.r, RAM.rest, RAM.h, P, 20), { tone: "mid" });
// the diffuse part sensor on a short post, its lens looking back at the part
{
  post("sensor.post", SENS.x + SENS.w / 2, SENS.y + 3, 1.4, 0, SENS.z0, { tone: "mid" }, { steps: 16, layer: "front" });
  const sp = { x: SENS.x, y: SENS.y, w: SENS.w, d: SENS.d, r: 0.5 };
  box("sensor.body", sp, SENS.z0, SENS.z1, { tone: "hi", crease: "lo" }, {
    steps: 2, bevel: 0.2, layer: "front",
    extra: led("b0", [SENS.x + SENS.w - 1, SENS.y + SENS.d, SENS.z1 - 1.2]) + Dt([at([SENS.x + 1.2, SENS.y + SENS.d, SENS.z1 - 1.2])], { size: 0.35 }),
  });
}
// the valve manifold with valves Y1 and Y2, and the air service unit
{
  box("valve.manifold", MAN, 0, 4, { tone: "lo" }, { steps: 2, bevel: 0.3, extra: Dt([[MAN.x + 1.4, MAN.y + MAN.d / 2], [MAN.x + MAN.w - 1.4, MAN.y + MAN.d / 2]].map(([x, y]) => at([x, y, 4])), { size: 0.4 }) });
  VALVES.forEach((x, i) => {
    box("valve.y" + (i + 1), { x, y: MAN.y + 1, w: 8, d: 6, r: 0.4 }, 4, 12, { tone: "mid" }, { steps: 2, bevel: 0.2, extra: Dt([at([x + 4, MAN.y + 4, 12])], { size: 0.35 }) });
    box("valve.coil" + (i + 1), { x: x + 1, y: MAN.y + 7, w: 6, d: 3, r: 0.4 }, 5, 11, { tone: "hi", crease: "lo" }, {
      steps: 2, bevel: 0.2, extra: led("y" + (i + 1), [x + 2.4, MAN.y + 10, 9]) + Dt([at([x + 4.6, MAN.y + 10, 9])], { size: 0.4 }),
    });
    for (const dx of [2, 6]) post("valve.fitting", x + dx, MAN.y + 4, 0.7, 12, 13.6, { tone: "mid" }, { steps: 10 });
  });
  const [fx, fy] = FRL;
  post("air.bowl", fx, fy, 2.2, 0, 9, { tone: "lo", crease: "none" }, { steps: 20, inner: L(k.sideArc(fx, fy, 2.2, 3, P, 20), { tone: "faint" }) });
  box("air.head", { x: fx - 3, y: fy - 3, w: 6, d: 6, r: 0.5 }, 9, 14, { tone: "mid" }, { steps: 2, bevel: 0.3 });
  discAt("air.gauge", frameY([fx, fy + 3, 11.5]), 0, 0.8, 2, { tone: "hi", crease: "lo" }, { steps: 20, extra: L(k.segment([fx, fy + 3.8, 11.5], [fx + 1.1, fy + 3.8, 12.6], P), { tone: "lo", free: true }) + Dt([at([fx, fy + 3.8, 11.5])], { size: 0.35 }) });
  post("air.knob", fx, fy, 1.8, 14, 16.4, { tone: "hi", crease: "lo" }, { steps: 20, inner: L(k.knurl(fx, fy, 1.8, 14, 16.4, 9, P), { tone: "faint" }) });
}

// ---------------------------------------------------------------- the operator console: HMI, emergency stop, start, reset
{
  box("ctl.box", CON, 0, CON_H, { tone: "mid" }, { steps: 2, bevel: 0.4, layer: "front", extra: Dt(k.corners(CON, 1.2).map(([x, y]) => at([x, y, CON_H])), { size: 0.35 }) });
  box("ctl.hmi", HMI, HMI_Z[0], HMI_Z[1], { tone: "mid" }, {
    steps: 2, bevel: 0.3, layer: "front",
    extra: card(HMI_F, SCREEN.x0, SCREEN.x1, SCREEN.z0, SCREEN.z1, "pc-screen") + Dt([[HMI.x + HMI.w - 1, HMI_F, HMI_Z[0] + 1], [HMI.x + 1, HMI_F, HMI_Z[0] + 1]].map(at), { size: 0.35 }),
  });
  const [ex, ey] = ESTOP;
  post("ctl.estop-collar", ex, ey, 3.6, CON_H, CON_H + 0.8, { tone: "lo" }, { steps: 28, layer: "front" });
  for (const [x, key] of [[7, "start"], [14, "reset"]]) {
    post("ctl.collar-" + key, x, ey, 2.4, CON_H, CON_H + 0.8, { tone: "lo" }, { steps: 24, layer: "front" });
    post("ctl." + key, x, ey, 1.8, CON_H + 0.8, CON_H + 1.8, { tone: "hi", crease: "lo" }, { steps: 24, layer: "front" });
  }
}
const estopSvg =
  S(k.cylinder(ESTOP[0], ESTOP[1], 1.3, CON_H + 0.8, 1.6, P, 16), { tone: "mid" }) +
  S(k.cylinder(ESTOP[0], ESTOP[1], 2.8, CON_H + 2.4, 1.8, P, 28, 0.5), { tone: "hi", crease: "lo", lit: true });

// ---------------------------------------------------------------- cables and hoses
const fyCab = CAB.y + CAB.d;
const cableTo = (gx, pts) => [...pts, [gx, fyCab + 2.5, 0.4], [gx, fyCab + 0.2, 1.5]];
const route = (pts, sig, { ends = "both", tone = "lo", size = 0.9 } = {}) => {
  const pp = pts.map(at);
  return `<g data-sig="${sig}">${k.wireSvg(pp[0], pp[pp.length - 1], { via: pp.slice(1, -1), tone, size, ends })}</g>`;
};
const I_ROUTE_Y = 11;
const cables = [
  route(cableTo(GLANDS.i0, [[SENS.x + SENS.w, SENS.y + 2, 8], [46, SENS.y + 2, 0.4], [46, I_ROUTE_Y, 0.4], [GLANDS.i0 + 4, I_ROUTE_Y, 0.4]]), "i0"),
  route(cableTo(GLANDS.i1, [[62.4, CL.y, CL.z + CL.r + 0.6], [64.4, CL.y + 5, 0.4], [64.4, I_ROUTE_Y + 1.4, 0.4], [GLANDS.i1 + 4, I_ROUTE_Y + 1.4, 0.4]]), "i1"),
  route(cableTo(GLANDS.i2, [[PR.x + 1.5, PR.y + PR.r + 1.2, PR.z0 + 2.5], [47.6, 10.2, PR.z0 - 2], [47.6, 10.2, 0.4], [47.6, I_ROUTE_Y + 2.8, 0.4], [GLANDS.i2 + 4, I_ROUTE_Y + 2.8, 0.4]]), "i2"),
  route(cableTo(GLANDS.q0, [[VALVES[0] + 4.6, MAN.y + 10, 7], [VALVES[0] + 4.6, MAN.y + 13, 0.4], [26, MAN.y + 13, 0.4], [GLANDS.q0 + 4, -9, 0.4]]), "q0"),
  route(cableTo(GLANDS.q1, [[VALVES[1] + 4.6, MAN.y + 10, 7], [VALVES[1] + 4.6, MAN.y + 14.6, 0.4], [26, MAN.y + 14.6, 0.4], [GLANDS.q1 + 4, -7.4, 0.4]]), "q1"),
];
// the emergency-stop chain: two channels from the button to the safety relay;
// "broken" draws the same wire with a gap and two cut ends
const chainPts = (gx, dx) => cableTo(gx, [[CON.x, ESTOP[1] - dx * 0.5, 2.4], [CON.x - 6, ESTOP[1] - dx * 0.5, 0.4], [gx + 3, 6 - dx, 0.4]]);
const chainA = chainPts(GLANDS.chainA, 0), chainB = chainPts(GLANDS.chainB, 1.4);
const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const brokenOf = (pts) => {
  const a = pts[2], b = pts[3];
  const c0 = lerp3(a, b, 0.42), c1 = lerp3(a, b, 0.56);
  return route([...pts.slice(0, 3), c0], "chain") + route([c1, ...pts.slice(3)], "chain");
};
const chainSvg = `<g data-chain="whole">${route(chainA, "chain")}${route(chainB, "chain")}</g><g data-chain="cut" style="display:none">${brokenOf(chainA)}${brokenOf(chainB)}</g>`;
// air hoses from the valves to the cylinders, drawn over the parts they reach
const hose = (pts) => route(pts, "air", { tone: "mid", size: 0.8 });
const hoses = [
  hose([[VALVES[0] + 2, MAN.y + 4, 13.6], [VALVES[0] + 2, -18, 17], [CL.x0 + 0.8, CL.y - 6, 17], [CL.x0 + 0.8, CL.y, CL.z + CL.r + 2]]),
  hose([[VALVES[0] + 6, MAN.y + 4, 13.6], [CL.x1 - 0.8, -18, 17], [CL.x1 - 0.8, CL.y - 6, 17], [CL.x1 - 0.8, CL.y, CL.z + CL.r + 2]]),
  hose([[VALVES[1] + 2, MAN.y + 4, 13.6], [VALVES[1] + 2, -12, 30], [PR.x + PR.r + 6, PR.y, PR.z0 + 3], [PR.x + PR.r + 1.4, PR.y, PR.z0 + 3]]),
  hose([[VALVES[1] + 6, MAN.y + 4, 13.6], [VALVES[1] + 6, -12, 44], [PR.x + PR.r + 6, PR.y, PR.z1 - 3], [PR.x + PR.r + 1.4, PR.y, PR.z1 - 3]]),
  hose([[FRL[0], FRL[1] - 3, 11.5], [FRL[0] - 3, FRL[1] - 5, 2], [MAN.x + MAN.w, MAN.y + 2, 2]]),
].join("");

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P, {});
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);
if (process.env.ORDER) console.log(R.items.slice().sort((a, b) => a.key - b.key).map((i, n) => n + " " + i.layer + " " + i.name).join("\n"));
const body = [
  halo,
  ...layerOf("floor"),
  cables.join(""),
  chainSvg,
  ...layerOf("back"),
  `<g data-part=""></g>`,
  `<g data-jaw="">${jawSvg}</g>`,
  `<g data-ram="">${ramSvg}</g>`,
  ...layerOf("front"),
  `<g data-beam=""></g>`,
  `<g data-estop="">${estopSvg}</g>`,
  `<g data-hmi=""></g>`,
  hoses,
  `<g data-mark=""></g>`,
];

const LABEL_NL =
  "Een persstation met zijn besturingskast. Links staat de kast zonder deur: op de montageplaat een voeding, de PLC, een ingangskaart en een uitgangskaart met lampjes per kanaal, een servodrive, een kabelgoot, een veiligheidsrelais met twee magneetschakelaars en een klemmenstrook; op het dak een signaalzuil en op de zijkant de hoofdschakelaar. Rechts een mal met een onderdeel, een klemcilinder en een perscilinder, elk met een sensor, een aanwezigheidssensor bij het onderdeel en twee ventielen op een eiland. Kabels lopen van de sensoren naar de ingangen en van de uitgangen naar de ventielen. Vooraan een bedienpaneel met een HMI-scherm, een noodstop, een startknop en een resetknop; de noodstop is met twee draden met het veiligheidsrelais verbonden.";
const LABEL_EN =
  "A press station with its control cabinet. On the left is the cabinet with its door off: on the mounting plate a power supply, the PLC, an input card and an output card with a lamp per channel, a servo drive, a wire duct, a safety relay with two contactors and a terminal strip; on the roof a signal tower and on the side the main switch. On the right a fixture with a part, a clamp cylinder and a press cylinder, each with a sensor, a presence sensor at the part and two valves on a manifold. Cables run from the sensors to the inputs and from the outputs to the valves. At the front an operator panel with an HMI screen, an emergency stop, a start button and a reset button; the emergency stop is wired to the safety relay with two wires.";

const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL_NL, body });

// ---------------------------------------------------------------- parts to name on tap (levels 1 and 2)
const PARTS = [
  { key: "cpu", at: [MOD.cpu.x + 4.5, ON_RAIL + MOD.cpu.d, 50] },
  { key: "di", at: [MOD.di.x + 2.5, ON_RAIL + MOD.di.d, 50] },
  { key: "dout", at: [MOD.dout.x + 2.5, ON_RAIL + MOD.dout.d, 50] },
  { key: "psu", at: [MOD.psu.x + 3.5, ON_RAIL + MOD.psu.d, 50] },
  { key: "drive", at: [MOD.drive.x + 5, ON_RAIL + MOD.drive.d, 50] },
  { key: "relay", at: [-76.5, ON_RAIL + 10, 28] },
  { key: "k12", at: [-64.6, ON_RAIL + 9, 28] },
  { key: "terminals", at: [-68, ON_RAIL + 6, 12] },
  { key: "mainsw", at: [CAB.x + CAB.w + 1, CAB.y + 11, 46] },
  { key: "stack", at: [STACK[0], STACK[1], CAB_H + 9] },
  { key: "b0", at: [SENS.x + SENS.w / 2, SENS.y + SENS.d, 8] },
  { key: "b1", at: [60.4, CL.y, CL.z + CL.r + 0.6] },
  { key: "b2", at: [PR.x, PR.y + PR.r + 1.2, PR.z0 + 2.5] },
  { key: "clamp", at: [66, CL.y + CL.r, CL.z] },
  { key: "press", at: [PR.x, PR.y + PR.r, 48] },
  { key: "part", at: [PARTC[0], PARTC[1] + PART.d / 2, NEST_Z + 2] },
  { key: "valves", at: [VALVES[1], MAN.y + 10, 8] },
  { key: "air", at: [FRL[0], FRL[1] + 3, 11.5] },
  { key: "hmi", at: [1, HMI_F, 20] },
  { key: "estop", at: [ESTOP[0], ESTOP[1], CON_H + 3] },
  { key: "start", at: [7, ESTOP[1], CON_H + 1.8] },
  { key: "reset", at: [14, ESTOP[1], CON_H + 1.8] },
  { key: "chain", at: chainA[2] },
  { key: "ce", at: [72, 31, 0.4] },
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
  --pc-hair:rgba(240,233,218,.12);--pc-accent:#5C9FAE;--pc-hole:#071A1E;--pc-glass:#0A2228;
  --anatomy-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --pc-sans:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
.iso[data-theme="light"]{
  --anatomy-page:#E8DFCA;--anatomy-card:#F4EFE3;--anatomy-text:#1E3328;--anatomy-strong:#0B291B;--anatomy-muted:#5A6B60;
  --anatomy-paper:#F4EFE3;--anatomy-face:#FAF7EE;--anatomy-top:#FBF8F1;
  --anatomy-shade-0:#DDD4BF;--anatomy-shade-1:#E4DCC9;--anatomy-shade-2:#EBE4D4;--anatomy-shade-3:#F0EADD;
  --anatomy-lit-top:#BFD6D8;--anatomy-lit-shade:#A6C4C8;
  --anatomy-hi:#1E3328;--anatomy-mid:#7D877A;--anatomy-lo:#A9AE9E;--anatomy-faint:#D0CAB8;--anatomy-lit:#276F81;
  --anatomy-halo:#5A6B60;--anatomy-halo-opacity:.3;--anatomy-dot:#1E3328;
  --pc-hair:rgba(11,41,27,.14);--pc-accent:#276F81;--pc-hole:#D5CCB6;--pc-glass:#DCE7E4;
}
*{box-sizing:border-box}
html{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}
html,body{margin:0;padding:0;height:100%}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.5 var(--pc-sans);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
main{height:100%}
.iso-figure{margin:0;height:100%}
.iso-plate{--rows:3;--lines:5;--bottom:calc(var(--rows) * 48px + var(--lines) * 14px + 40px);height:100%;max-height:calc((100vw - 8px) * ${(HEIGHT / WIDTH).toFixed(4)} + var(--bottom) + 30px);min-height:260px;padding:26px 4px var(--bottom);border-radius:14px;background:var(--anatomy-card);box-shadow:inset 0 0 0 1px var(--pc-hair);display:flex;flex-direction:column;justify-content:center}
html[data-level="1"] .iso-plate{--rows:2;--lines:4}
html[data-level="4"] .iso-plate{--rows:1;--lines:5}
.iso-plate-corners{inset:12px 14px 10px 14px}
.iso-plate-corner{font-family:var(--pc-sans);font-size:11px;letter-spacing:0;text-transform:none!important;line-height:1.3}
.iso-plate-corner[data-corner="fig"]{color:var(--anatomy-strong);font-weight:600}
.iso-plate-corner[data-corner="title"]{color:var(--anatomy-muted);letter-spacing:0!important}
.iso-plate-corner[data-corner="hint"]{bottom:calc(var(--rows) * 48px + 4px)!important;left:0!important;max-width:100%;color:var(--anatomy-muted);letter-spacing:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iso-plate-corner[data-corner="readout"]{bottom:calc(var(--rows) * 48px + 22px)!important;left:0!important;right:0!important;font-family:var(--anatomy-mono);font-size:9.5px;line-height:1.45;text-align:left;color:var(--anatomy-text);letter-spacing:0}
.pc-line{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-acc{color:var(--pc-accent);font-weight:600}
.pc-strong{color:var(--anatomy-strong);font-weight:600}
.pc-mute{color:var(--anatomy-muted)}
.pc-stage{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;outline:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;border-radius:8px}
.pc-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:-1px}
.pc-stage .iso-svg{overflow:hidden;width:100%;height:100%;max-height:100%}
.pc-controls{position:absolute;left:10px;right:10px;bottom:10px;display:flex;flex-direction:column;gap:4px}
.pc-row{display:flex;gap:4px;height:44px;align-items:center}
.pc-row[hidden]{display:none}
.pc-btn{flex:1 1 0;min-width:44px;min-height:44px;height:44px;padding:0 3px;border:0;border-radius:10px;background:transparent;color:var(--anatomy-text);font:500 12px/1 var(--pc-sans);cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:inset 0 0 0 1px var(--pc-hair);display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
.pc-btn:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:1px}
.pc-btn:disabled{opacity:.4;cursor:default}
.pc-btn[aria-checked="true"],.pc-btn[aria-pressed="true"]{box-shadow:inset 0 0 0 1.5px var(--pc-accent);color:var(--pc-accent);font-weight:600}
.pc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.pc-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.pc-screen{fill:var(--pc-glass);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.pc-hole{fill:var(--pc-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.pc-led{fill:var(--anatomy-lo);stroke:none}
.pc-led[data-on]{fill:var(--pc-accent)}
.pc-flag{fill:var(--pc-hole);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.pc-flag[data-on]{fill:var(--pc-accent)}
[data-sig] path{transition:stroke .12s}
[data-sig][data-on] path{stroke:var(--pc-accent)!important}
[data-sig][data-on] circle{stroke:var(--pc-accent)!important}
.pc-beam{fill:none;stroke:var(--pc-accent);stroke-width:1.1px;stroke-linecap:round;stroke-dasharray:2 2.2}
.pc-beam-dot,.pc-mark-dot{fill:var(--pc-accent);stroke:none}
.pc-cell{fill:none;stroke:var(--anatomy-lo);stroke-width:.8px}
.pc-cell[data-on]{fill:var(--pc-accent);stroke:var(--pc-accent)}
.pc-cell[data-done]{fill:var(--anatomy-lo)}
.pc-bar{fill:var(--anatomy-lo);stroke:var(--anatomy-mid);stroke-width:.6px}
.pc-bar[data-on]{fill:var(--pc-accent);stroke:var(--pc-accent)}
.pc-cum{fill:none;stroke:var(--anatomy-hi);stroke-width:.9px;stroke-linejoin:round}
.pc-cum-dot{fill:var(--anatomy-hi);stroke:none}
.pc-base{fill:none;stroke:var(--anatomy-mid);stroke-width:.8px}
.pc-mark{fill:none;stroke:var(--pc-accent);stroke-width:1.4px}
[data-seg] .iso-top,[data-seg] .iso-shade,[data-seg] .iso-fill{transition:fill .15s}
[data-seg][data-on] .iso-top,[data-seg][data-on] .iso-shade,[data-seg][data-on] .iso-fill{fill:var(--pc-accent)}
@media (prefers-reduced-motion:reduce){[data-seg] .iso-top,[data-seg] .iso-shade,[data-seg] .iso-fill,[data-sig] path{transition:none}}
`;

// ---------------------------------------------------------------- live script
const live = `
const P = ${JSON.stringify(P)};
const KS = ${KS};
const SCANS = ${JSON.stringify(SCANS)}, ALARMS = ${JSON.stringify(ALARMS)}, SHIFTS = ${SHIFTS}, BRAKE = ${BRAKE};
const PARTC = ${JSON.stringify(PARTC)}, PART = ${JSON.stringify(PART)}, NEST_Z = ${NEST_Z}, SENS = ${JSON.stringify(SENS)};
const JAW_STROKE = ${JAW_STROKE}, RAM_STROKE = ${RAM_STROKE};
const HMI_F = ${HMI_F}, SCREEN = ${JSON.stringify(SCREEN)};
const PARTS = ${JSON.stringify(PARTS)};
${perSecond.toString()}
${minutesOf.toString()}

const params = new URLSearchParams(location.search);
const EN = params.get("lang") === "en";
const LVL0 = [1, 2, 3, 4].includes(Number(params.get("level"))) ? Number(params.get("level")) : 2;
const LVL = LVL0 === 3 ? 2 : LVL0; // level 3 has its own figure; open the safety view
const T = EN
  ? { dec: ".", grp: ",",
      steps: ["wait for part", "close clamp", "wait for clamp closed", "press", "release"],
      step: "Step", wait: "input", hang: "hanging in step 3: “clamp closed” never comes", hangWhy: "check the clamp: closed? then the sensor",
      inN: ["part", "clamp-closed", "press-down"], outN: ["clamp", "press"], scanL: "scan", scanR: "inputs read", perS: "× per second",
      run: "Running", stopped: "Safe stop", ready: "Ready: press Start", stopping: "Braking…",
      chainOk: "e-stop chain: 2 channels closed → safety relay on", chainPressed: "e-stop pressed: chain open → K1 and K2 drop", chainCut: "wire broken: chain open → safe stop (fail-safe)",
      cat0: "stop category 0: energy off at once (EN 60204-1)", cat1: "stop category 1: brake 0.5 s first, then energy off",
      needPull: "pull the e-stop out first; that alone restarts nothing", needReset: "e-stop out: still stopped until Reset", needRepair: "repair the wire: Reset does nothing", needStart: "reset done: waits for a deliberate Start",
      plLine: "safety relay, not the PLC · PL a–e from the risk graph (ISO 13849-1)",
      log: "alarm log · 1 week, 10 shifts · by", byN: "count", byM: "minutes", times: "×",
      alarms: { part: "Part not present in nest", servo: "Servo fault", door: "Door opened" },
      perShift: "micro-stops per shift", firstOut: "first-out: the first alarm in the chain",
      tapPart: "tap a part to name it",
      parts: { cpu: ["PLC (CPU)", "reads inputs, runs the steps, writes outputs"], di: ["Input card", "a lamp per sensor: 24 V on or off"], dout: ["Output card", "a lamp per output: valve, lamp"], psu: ["Power supply 24 V", "feeds the PLC, sensors and valves"], drive: ["Servo drive", "drives a servo motor; its fault is an alarm"], relay: ["Safety relay", "watches the e-stop chain, two channels"], k12: ["Contactors K1, K2", "in series: cut the outputs’ power"], terminals: ["Terminal strip X1", "every field wire lands here"], mainsw: ["Main switch", "isolates the whole cabinet"], stack: ["Signal tower", "running · waiting · stopped"], b0: ["Presence sensor", "input I0.0: part there, yes or no"], b1: ["Sensor clamp closed", "input I0.1: reed switch on the cylinder"], b2: ["Sensor press down", "input I0.2"], clamp: ["Clamp cylinder", "actuator: air pushes the piston out"], press: ["Press cylinder", "actuator"], part: ["Part", "what the station works on"], valves: ["Valves Y1, Y2", "outputs Q0.0 and Q0.1 switch the air"], air: ["Air service unit", "filter and pressure regulator, 6 bar"], hmi: ["HMI", "touch screen: step, alarms, recipes"], estop: ["Emergency stop", "red on yellow; stays pressed in"], start: ["Start", "a deliberate start after reset"], reset: ["Reset", "re-arms the safety relay; starts nothing"], chain: ["E-stop chain", "two wires: a break also stops (fail-safe)"], ce: ["CE type plate", "2006/42/EC; from 20 January 2027 Regulation (EU) 2023/1230"] } }
  : { dec: ",", grp: ".",
      steps: ["wacht op onderdeel", "klem sluiten", "wacht op klem dicht", "persen", "loslaten"],
      step: "Stap", wait: "ingang", hang: "hangt in stap 3: “klem dicht” komt niet", hangWhy: "kijk naar de klem: dicht? dan de sensor",
      inN: ["onderdeel", "klem-dicht", "pers-onder"], outN: ["klem", "pers"], scanL: "scan", scanR: "ingangen", perS: "× per seconde gelezen",
      run: "Draait", stopped: "Veilig gestopt", ready: "Klaar: druk op Start", stopping: "Remt af…",
      chainOk: "noodstopketen: 2 kanalen dicht → veiligheidsrelais aan", chainPressed: "noodstop ingedrukt: keten open → K1 en K2 vallen af", chainCut: "draadbreuk: keten open → veilige stop (faalveilig)",
      cat0: "stopcategorie 0: energie meteen weg (EN 60204-1)", cat1: "stopcategorie 1: eerst 0,5 s remmen, dan energie weg",
      needPull: "trek eerst de noodstop uit; dat alleen start niets", needReset: "noodstop uit: blijft stil tot Reset", needRepair: "repareer de draad: Reset doet niets", needStart: "gereset: wacht op een bewuste Start",
      plLine: "veiligheidsrelais, niet de PLC · PL a–e uit de risicograaf (ISO 13849-1)",
      log: "alarmlog · 1 week, 10 diensten · op", byN: "aantal", byM: "minuten", times: "×",
      alarms: { part: "Onderdeel niet aanwezig in nest", servo: "Servostoring", door: "Deur geopend" },
      perShift: "microstops per dienst", firstOut: "first-out: het eerste alarm in de keten",
      tapPart: "tik een onderdeel voor de naam",
      parts: { cpu: ["PLC (CPU)", "leest ingangen, doorloopt de stappen, schrijft uitgangen"], di: ["Ingangskaart", "een lampje per sensor: 24 V aan of uit"], dout: ["Uitgangskaart", "een lampje per uitgang: ventiel, lamp"], psu: ["Voeding 24 V", "voedt PLC, sensoren en ventielen"], drive: ["Servodrive", "stuurt een servomotor; een storing is een alarm"], relay: ["Veiligheidsrelais", "bewaakt de noodstopketen, twee kanalen"], k12: ["Magneetschakelaars K1, K2", "in serie: nemen de spanning van de uitgangen weg"], terminals: ["Klemmenstrook X1", "hier komt elke veldkabel binnen"], mainsw: ["Hoofdschakelaar", "schakelt de hele kast vrij"], stack: ["Signaalzuil", "draait · wacht · gestopt"], b0: ["Aanwezigheidssensor", "ingang I0.0: onderdeel er, ja of nee"], b1: ["Sensor klem dicht", "ingang I0.1: reedschakelaar op de cilinder"], b2: ["Sensor pers onder", "ingang I0.2"], clamp: ["Klemcilinder", "actuator: lucht duwt de zuiger uit"], press: ["Perscilinder", "actuator"], part: ["Onderdeel", "waar het station aan werkt"], valves: ["Ventielen Y1, Y2", "uitgangen Q0.0 en Q0.1 schakelen de lucht"], air: ["Luchtverzorging", "filter en drukregelaar, 6 bar"], hmi: ["HMI", "touchscreen: stap, alarmen, recepten"], estop: ["Noodstop", "rood op geel; blijft ingedrukt staan"], start: ["Start", "een bewuste start na de reset"], reset: ["Reset", "zet het veiligheidsrelais weer aan; start niets"], chain: ["Noodstopketen", "twee draden: een breuk stopt ook (faalveilig)"], ce: ["CE-typeplaat", "2006/42/EG; vanaf 20 januari 2027 Verordening (EU) 2023/1230"] } };
const fmt = (v, d) => v.toFixed(d).replace(".", T.dec);
const grp = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, T.grp);

const stage = document.querySelector(".pc-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const qa = (sel) => [...svg.querySelectorAll(sel)];
const el = { part: q("[data-part]"), jaw: q("[data-jaw]"), ram: q("[data-ram]"), beam: q("[data-beam]"), estop: q("[data-estop]"), hmi: q("[data-hmi]"), mark: q("[data-mark]"),
  whole: q('[data-chain="whole"]'), cut: q('[data-chain="cut"]'), segs: [0, 1, 2].map((i) => q('[data-seg="' + i + '"]')) };
const sigs = {}; qa("[data-sig]").forEach((g) => { (sigs[g.dataset.sig] = sigs[g.dataset.sig] || []).push(g); });
const leds = {}; qa("[data-led]").forEach((c) => { leds[c.dataset.led] = c; });
const flags = qa("[data-flag]");
const lines = [...document.querySelectorAll("[data-readout] .pc-line")];
const announcer = document.querySelector(".pc-sr");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (t) => t * t * (3 - 2 * t);
const at = (p) => iso(p, P);
const f2 = (v) => v.toFixed(2);
const on = (node, v) => { if (!node) return; if (v) node.setAttribute("data-on", ""); else node.removeAttribute("data-on"); };

// ------------------------------------------------ state
const st = { auto: LVL !== 1 ? true : true, dirty: false, scan: 10, tokens: 0,
  estop: false, broken: false, relay: true, run: true, cat: 0, by: "m" };
const sim = { step: 1, t: 0, jaw: 0, ram: 0, part: 0, partOut: 0, power: 1, kOn: true, brake: 0, cycle: 0, late: 0, flash: 0 };
let marked = -1, clock = 0;

function inputs() {
  return [sim.part >= 1 && sim.partOut === 0, sim.jaw >= 0.995 && !st.dirty, sim.ram >= 0.995];
}
function outputs() {
  const s = sim.step;
  return [s === 2 || s === 3 || s === 4, s === 4];
}
function safeOk() { return st.relay && !st.estop && !st.broken; }
function canGo() { return st.auto || st.tokens > 0; }
function go(next) { if (!st.auto) st.tokens = Math.max(0, st.tokens - 1); sim.step = next; sim.t = 0; }

function advance(dt) {
  clock += dt;
  // safety: the chain, the relay and the contactors
  const chain = !st.estop && !st.broken;
  if (!chain && st.relay) { st.relay = false; st.run = false; sim.brake = st.cat === 1 ? BRAKE : 0; }
  if (!st.relay || !st.run) {
    if (sim.brake > 0) { sim.brake = Math.max(0, sim.brake - dt); sim.power = sim.brake / BRAKE; sim.kOn = true; }
    else { sim.power = 0; sim.kOn = st.relay && false; }
    if (st.relay && !st.run) sim.kOn = true;
  } else { sim.power = 1; sim.kOn = true; }
  const running = st.relay && st.run;
  // motion: the cylinders follow their valves, scaled by the power left
  const [q0, q1] = outputs();
  const live = sim.kOn ? sim.power : 0;
  const mv = (v, target, time) => clamp(v + Math.sign(target - v) * Math.min(Math.abs(target - v), (dt / time) * live), 0, 1);
  if (running || sim.brake > 0) { sim.jaw = mv(sim.jaw, q0 ? 1 : 0, 0.5); sim.ram = mv(sim.ram, q1 ? 1 : 0, 0.6); }
  // the part comes and goes on its own (the operator), at full speed while running
  if (running) {
    if (sim.step === 1 && sim.partOut === 0 && sim.part < 1) {
      sim.late = Math.max(0, sim.late - dt);
      if (sim.late === 0) sim.part = clamp(sim.part + dt / 0.7, 0, 1);
    }
    if (sim.partOut > 0) { sim.partOut = clamp(sim.partOut + dt / 0.7, 0, 1); if (sim.partOut >= 1) { sim.partOut = 0; sim.part = 0; sim.cycle++; sim.late = LVL === 4 && sim.cycle % 3 === 0 ? 2 : 0.4; } }
  }
  if (!running) return;
  sim.t += dt;
  const [i0, i1, i2] = inputs();
  const s = sim.step;
  if (s === 1 && i0 && sim.t > 0.2 && canGo()) go(2);
  else if (s === 2 && sim.t > 0.3 && canGo()) go(3);
  else if (s === 3 && i1 && canGo()) go(4);
  else if (s === 4 && i2 && sim.t > 0.9 && canGo()) go(5);
  else if (s === 5 && sim.jaw <= 0.005 && sim.ram <= 0.005 && canGo()) { go(1); sim.partOut = 0.001; }
}
function hanging() { return sim.step === 3 && sim.t > 2.2 && st.relay && st.run; }

// ------------------------------------------------ drawing
function partSvg() {
  const fadeIn = ease(sim.part), out = sim.partOut;
  if (fadeIn <= 0) return "";
  const z = NEST_Z + (1 - fadeIn) * 10 + ease(out) * 10;
  const op = fadeIn * (1 - out);
  const ringP = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [PARTC[0] + (u * PART.w) / 2, PARTC[1] + (v * PART.d) / 2]);
  return '<g opacity="' + op.toFixed(3) + '">' + solidSvg(extrude(ringP, z, PART.h, P), { tone: "hi", crease: "lo", lit: true }) + "</g>";
}
let partKey = "";
function draw() {
  const [i0, i1, i2] = inputs();
  const [q0, q1] = outputs();
  const powered = sim.kOn;
  const key = sim.part.toFixed(3) + "/" + sim.partOut.toFixed(3);
  if (key !== partKey) { partKey = key; el.part.innerHTML = partSvg(); }
  el.jaw.setAttribute("transform", translateAlong(P, [-JAW_STROKE * sim.jaw, 0, 0]));
  el.ram.setAttribute("transform", translateAlong(P, [0, 0, -RAM_STROKE * sim.ram]));
  el.estop.setAttribute("transform", translateAlong(P, [0, 0, st.estop ? -1.4 : 0]));
  // the beam from the sensor lens to the part face
  let beam = "";
  if (i0) {
    const a = at([SENS.x + SENS.w / 2, SENS.y, 8]), b = at([SENS.x + SENS.w / 2, PARTC[1] + PART.d / 2, 8]);
    beam = '<path class="pc-beam" d="M' + f2(a[0]) + " " + f2(a[1]) + "L" + f2(b[0]) + " " + f2(b[1]) + '"/><circle class="pc-beam-dot" cx="' + f2(b[0]) + '" cy="' + f2(b[1]) + '" r="1.3"/>';
  }
  if (el.beam.innerHTML !== beam) el.beam.innerHTML = beam;
  // inputs and outputs: cables and card lamps
  [i0, i1, i2].forEach((v, i) => { (sigs["i" + i] || []).forEach((g) => on(g, v)); on(leds["i" + i], v); });
  on(leds.b0, i0);
  [q0 && powered, q1 && powered].forEach((v, i) => { (sigs["q" + i] || []).forEach((g) => on(g, v)); on(leds["q" + i], v); on(leds["y" + (i + 1)], v); });
  on(leds.q2, hanging() || !st.relay);
  on(leds.q3, false);
  on(leds.psu, true); on(leds.run, true); on(leds.err, hanging() && Math.sin(clock * 8) > 0); on(leds.drive, st.relay);
  const chain = !st.estop && !st.broken;
  (sigs.chain || []).forEach((g) => on(g, chain));
  on(leds.k0a, chain); on(leds.k0b, chain); on(leds.k0p, st.relay);
  flags.forEach((f) => on(f, powered && st.relay));
  el.whole.style.display = st.broken ? "none" : "";
  el.cut.style.display = st.broken ? "" : "none";
  // signal tower: 0 running (bottom), 1 waiting, 2 stopped
  const running = st.relay && st.run;
  on(el.segs[0], running && !hanging());
  on(el.segs[1], hanging() || (st.relay && !st.run));
  on(el.segs[2], !st.relay);
  drawHmi(running);
  if (marked >= 0) {
    const [x, y] = at(PARTS[marked].at);
    el.mark.innerHTML = '<circle class="pc-mark" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9"/><circle class="pc-mark-dot" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6"/>';
  } else el.mark.innerHTML = "";
}
const quad = (x0, x1, z0, z1) => "M" + [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([x, z]) => { const p = at([x, HMI_F, z]); return f2(p[0]) + " " + f2(p[1]); }).join("L") + "Z";
let hmiKey = "";
function drawHmi(running) {
  let out = "", key;
  const { x0, x1, z0, z1 } = SCREEN;
  if (LVL === 4) {
    const rows = sorted();
    const vals = rows.map((a) => (st.by === "n" ? a.n : minutesOf(a)));
    const total = vals.reduce((s, v) => s + v, 0), max = vals[0];
    key = "4" + st.by + (sim.late > 0 && sim.step === 1 ? "w" : "");
    const bw = 5.4, gap = 1.8, bx = x0 + 2.6;
    const base = z0 + 1.6, top = z1 - 2.4;
    let cum = 0;
    const pts = [];
    rows.forEach((a, i) => {
      const h = ((top - base) * vals[i]) / max;
      const xa = bx + i * (bw + gap);
      const lit = a.key === "part" && sim.late > 0 && sim.step === 1;
      out += '<path class="pc-bar"' + (lit ? " data-on" : "") + ' d="' + quad(xa, xa + bw, base, base + Math.max(h, 0.3)) + '"/>';
      cum += vals[i];
      const p = at([xa + bw, HMI_F, base + ((top - base) * cum) / total]);
      pts.push(p);
    });
    const p0 = at([bx, HMI_F, base]);
    const poly = [p0, ...pts];
    out += '<path class="pc-cum" d="M' + poly.map((p) => f2(p[0]) + " " + f2(p[1])).join("L") + '"/>';
    out += poly.map((p) => '<circle class="pc-cum-dot" cx="' + f2(p[0]) + '" cy="' + f2(p[1]) + '" r="0.9"/>').join("");
    const b0 = at([x0, HMI_F, base]), b1 = at([x1, HMI_F, base]);
    out += '<path class="pc-base" d="M' + f2(b0[0]) + " " + f2(b0[1]) + "L" + f2(b1[0]) + " " + f2(b1[1]) + '"/>';
  } else {
    key = sim.step + "/" + running + "/" + st.relay + "/" + (hanging() && Math.sin(clock * 8) > 0);
    const cw = 3.9, cg = 0.6, cx0 = x0 + 0.9;
    for (let i = 0; i < 5; i++) {
      const xa = cx0 + i * (cw + cg);
      const now = i + 1 === sim.step && running;
      const blink = now && hanging() && Math.sin(clock * 8) <= 0;
      out += '<path class="pc-cell"' + (now && !blink ? " data-on" : i + 1 < sim.step ? " data-done" : "") + ' d="' + quad(xa, xa + cw, z1 - 5.2, z1 - 1.4) + '"/>';
    }
    out += '<path class="pc-cell"' + (running ? " data-on" : st.relay ? " data-done" : "") + ' d="' + quad(x0 + 0.8, x1 - 0.8, z0 + 1.4, z0 + 4.4) + '"/>';
  }
  if (key !== hmiKey) { hmiKey = key; el.hmi.innerHTML = out; }
}

// ------------------------------------------------ readout
const acc = (s) => '<span class="pc-acc">' + s + "</span>";
const strong = (s) => '<span class="pc-strong">' + s + "</span>";
const mute = (s) => '<span class="pc-mute">' + s + "</span>";
const sq = (v) => (v ? "■" : "□");
function sorted() {
  const rows = ALARMS.slice();
  return st.by === "n" ? rows.sort((a, b) => b.n - a.n) : rows.sort((a, b) => minutesOf(b) - minutesOf(a));
}
function durOf(a) { return a.s >= 60 ? a.s / 60 + " min" : a.s + " s"; }
function readout() {
  const out = [];
  const [i0, i1, i2] = inputs();
  const [q0, q1] = outputs();
  if (LVL === 1) {
    const s = sim.step;
    const waits = { 1: "I0.0", 3: "I0.1", 4: "I0.2" };
    out.push(hanging() ? strong(T.hang) : strong(T.step + " " + s) + " · " + T.steps[s - 1] + (waits[s] ? mute(" (" + T.wait + " " + waits[s] + ")") : ""));
    out.push("I: " + T.inN.map((n, i) => n + sq([i0, i1, i2][i])).join(" ") + " · Q: " + T.outN.map((n, i) => n + sq([q0, q1][i])).join(" "));
    out.push(T.scanL + " " + st.scan + " ms → " + T.scanR + " " + acc(perSecond(st.scan) + T.perS));
    if (hanging()) out.push(mute(T.hangWhy));
    else out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : mute(T.tapPart));
  } else if (LVL === 2) {
    const running = st.relay && st.run;
    out.push(running ? strong(T.run) + " · " + T.step + " " + sim.step + ": " + T.steps[sim.step - 1] : sim.brake > 0 ? strong(T.stopping) : st.relay ? strong(T.ready) : acc(T.stopped));
    out.push(st.broken ? acc(T.chainCut) : st.estop ? acc(T.chainPressed) : T.chainOk);
    out.push(st.cat === 0 ? T.cat0 : T.cat1);
    out.push(st.broken ? strong(T.needRepair) : st.estop ? mute(T.needPull) : !st.relay ? strong(T.needReset) : !st.run ? strong(T.needStart) : mute(T.plLine));
    out.push(marked >= 0 ? acc(T.parts[PARTS[marked].key][0]) + " · " + T.parts[PARTS[marked].key][1] : mute(T.tapPart));
  } else {
    out.push(T.log + " " + strong(st.by === "n" ? T.byN : T.byM));
    sorted().forEach((a, i) => {
      const m = minutesOf(a);
      const txt = (i + 1) + " " + T.alarms[a.key] + " " + grp(a.n) + " " + T.times + " " + durOf(a) + " = ";
      out.push((i === 0 ? strong(txt) : txt) + (i === 0 ? acc(grp(m) + " min") : grp(m) + " min"));
    });
    out.push(grp(ALARMS[0].n) + " / " + SHIFTS + " = " + acc(grp(ALARMS[0].n / SHIFTS) + " " + T.perShift));
  }
  out.forEach((html, i) => { if (lines[i] && lines[i].innerHTML !== html) lines[i].innerHTML = html; });
  for (let i = out.length; i < lines.length; i++) if (lines[i].innerHTML) lines[i].innerHTML = "";
}
let lastSay = "";
function announce() { const s = lines.map((l) => l.textContent).filter(Boolean).join(". "); if (s !== lastSay) { lastSay = s; announcer.textContent = s; } }

// ------------------------------------------------ loop
let frame = 0, lastT = 0, visible = false, readT = 0;
function tick(now) {
  const dt = lastT ? Math.min((now - lastT) / 1000, 1 / 20) : 1 / 60;
  lastT = now;
  advance(dt);
  draw();
  readT += dt;
  if (readT > 0.1) { readT = 0; readout(); }
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { lastT = 0; frame = requestAnimationFrame(tick); } };
function settleStill(seconds) { for (let t = 0; t < seconds; t += 1 / 30) advance(1 / 30); draw(); readout(); announce(); }
const SIM0 = { ...sim };
function restill() {
  // reduced motion: one telling still per level. Stepping by hand moves on
  // from where the still is; anything else starts the cycle again and stops at
  // the moment that tells: pressing (or hanging in step 3 with a dirty sensor).
  if (LVL === 1 && !st.auto) { settleStill(1.5); return; }
  Object.assign(sim, SIM0);
  const done = () => (LVL === 1 && st.dirty ? hanging() : sim.step === 4 && sim.ram > 0.5);
  for (let t = 0; t < 15 && !done(); t += 1 / 30) advance(1 / 30);
  if (LVL !== 1) settleStill(1);
  draw(); readout(); announce();
}

// ------------------------------------------------ controls
const rows = [...document.querySelectorAll(".pc-row")];
rows.forEach((row) => { row.hidden = !row.dataset.levels.split(",").includes(String(LVL)); });
const radios = [...document.querySelectorAll("[data-set]")];
const toggles = [...document.querySelectorAll("[data-toggle]")];
function sync() {
  radios.forEach((b) => { const [key, val] = b.dataset.set.split(":"); const yes = String(st[key]) === val; b.setAttribute("aria-checked", String(yes)); b.tabIndex = yes ? 0 : -1; });
  toggles.forEach((b) => b.setAttribute("aria-pressed", String(!!st[b.dataset.toggle])));
  const reset = document.querySelector("[data-act='reset']"), start = document.querySelector("[data-act='start']");
  if (reset) reset.disabled = st.relay || st.estop || st.broken;
  if (start) start.disabled = !st.relay || st.run;
}
function changed() {
  sync(); readout(); announce();
  if (still.matches) restill(); else { draw(); run(); }
}
radios.forEach((b) => b.addEventListener("click", () => {
  const [key, val] = b.dataset.set.split(":");
  st[key] = key === "by" ? val : Number(val);
  changed();
}));
toggles.forEach((b) => b.addEventListener("click", () => {
  const key = b.dataset.toggle;
  st[key] = !st[key];
  if (key === "auto" && st.auto) st.tokens = 0;
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
    event.preventDefault(); event.stopPropagation();
    items[next].click(); items[next].focus();
  });
});
document.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
  const act = b.dataset.act;
  if (act === "step") { st.auto = false; st.tokens = 1; }
  if (act === "reset" && !st.estop && !st.broken) { st.relay = true; st.run = false; sim.brake = 0; }
  if (act === "start" && st.relay) st.run = true;
  changed();
}));

// tap the drawing: at levels 1 and 2 name the nearest part
function toView(event) {
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
  return [p.x, p.y];
}
function nearestPart([x, y]) {
  let best = -1, bestD = 50;
  PARTS.forEach((p, i) => { const [px, py] = at(p.at); const d = Math.hypot(px - x, py - y); if (d < bestD) { bestD = d; best = i; } });
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
if (LVL === 2) { st.estop = true; settleStill(0); }
new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) { if (still.matches) restill(); else run(); }
}, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { if (still.matches) { cancelAnimationFrame(frame); frame = 0; restill(); } else run(); });
sync();
if (still.matches) restill(); else { draw(); readout(); }
`;

// ---------------------------------------------------------------- strings and page
const STRINGS = {
  nl: {
    title: "Besturing en data",
    hint1: "Tik een onderdeel · stap door het programma",
    hint2: "Tik een onderdeel · druk de noodstop of breek de draad",
    hint4: "Sorteer de alarmlog op aantal of op minuten",
    step: "Volgende stap", auto: "Automatisch", dirty: "Sensor vuil",
    scan: "Scancyclus",
    estop: "Noodstop", broken: "Draad breken", reset: "Reset", start: "Start",
    cat: "Stopcategorie", cat0: "Stop 0", cat1: "Stop 1",
    by: "Sorteer op", byN: "Aantal", byM: "Minuten",
    label: LABEL_NL,
    aria: "Persstation met besturingskast, sensoren, ventielen, cilinders en een noodstop. Niveau 1 en 2: pijltjes kiezen een onderdeel.",
  },
  en: {
    title: "Control and data",
    hint1: "Tap a part · step through the program",
    hint2: "Tap a part · press the e-stop or break the wire",
    hint4: "Sort the alarm log by count or by minutes",
    step: "Next step", auto: "Automatic", dirty: "Sensor dirty",
    scan: "Scan cycle",
    estop: "E-stop", broken: "Break wire", reset: "Reset", start: "Start",
    cat: "Stop category", cat0: "Stop 0", cat1: "Stop 1",
    by: "Sort by", byN: "Count", byM: "Minutes",
    label: LABEL_EN,
    aria: "Press station with a control cabinet, sensors, valves, cylinders and an emergency stop. Levels 1 and 2: arrows pick a part.",
  },
};

const sN = STRINGS.nl;
const radio = (set, key) => `<button type="button" class="pc-btn" role="radio" data-set="${set}" data-t="${key}" aria-checked="false" tabindex="-1">${sN[key] ?? key}</button>`;
const radioRaw = (set, text) => `<button type="button" class="pc-btn" role="radio" data-set="${set}" aria-checked="false" tabindex="-1">${text}</button>`;
const toggle = (key) => `<button type="button" class="pc-btn" data-toggle="${key}" data-t="${key}" aria-pressed="false">${sN[key]}</button>`;
const action = (act, key) => `<button type="button" class="pc-btn" data-act="${act}" data-t="${key}">${sN[key]}</button>`;
const controls = [
  `<div class="pc-controls">`,
  `<div class="pc-row" data-levels="1">${action("step", "step")}${toggle("auto")}${toggle("dirty")}</div>`,
  `<div class="pc-row" data-levels="1" role="radiogroup" aria-label="${sN.scan}" data-t-label="scan">${SCANS.map((s) => radioRaw(`scan:${s}`, `${s} ms`)).join("")}</div>`,
  `<div class="pc-row" data-levels="2">${toggle("estop")}${toggle("broken")}</div>`,
  `<div class="pc-row" data-levels="2">${action("reset", "reset")}${action("start", "start")}</div>`,
  `<div class="pc-row" data-levels="2" role="radiogroup" aria-label="${sN.cat}" data-t-label="cat">${radio("cat:0", "cat0")}${radio("cat:1", "cat1")}</div>`,
  `<div class="pc-row" data-levels="4" role="radiogroup" aria-label="${sN.by}" data-t-label="by">${radio("by:n", "byN")}${radio("by:m", "byM")}</div>`,
  `</div>`,
].join("");

const plate = k.plateHtml({
  fig: "Fig 1",
  title: STRINGS.nl.title,
  hint: "HINT",
  readout: "",
  body: `<div class="pc-stage" tabindex="0" role="application" aria-label="${STRINGS.nl.aria}">${svg}</div>${controls}<div class="pc-sr" aria-live="polite"></div>`,
})
  .replace("data-readout></span>", `data-readout>${'<span class="pc-line"></span>'.repeat(5)}</span>`)
  .replace(">HINT<", `><span data-hint></span><`);

const BOOT = `(function(){var q=new URLSearchParams(location.search),t=q.get("theme"),d=document.documentElement;
function apply(){d.setAttribute("data-theme",t==="light"||t==="dark"?t:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));}
apply();if(t!=="light"&&t!=="dark"){var m=matchMedia("(prefers-color-scheme: light)");m.addEventListener&&m.addEventListener("change",apply);}
var l=Number(q.get("level"));l=l>=1&&l<=4?l:2;if(l===3)l=2;d.setAttribute("data-level",String(l));
if(q.get("lang")==="en")d.setAttribute("lang","en");})();`;

const LANG = `(function(){var en=new URLSearchParams(location.search).get("lang")==="en";var s=en?${JSON.stringify(STRINGS.en)}:${JSON.stringify({ ...STRINGS.nl, label: undefined })};
var lv=document.documentElement.getAttribute("data-level");document.querySelector("[data-hint]").textContent=s["hint"+lv]||s.hint2;
if(!en)return;
document.title=s.title;document.querySelector('.iso-plate-corner[data-corner="title"]').textContent=s.title;
document.querySelectorAll("[data-t]").forEach(function(n){n.textContent=s[n.getAttribute("data-t")];});
document.querySelectorAll("[data-t-label]").forEach(function(n){n.setAttribute("aria-label",s[n.getAttribute("data-t-label")]);});
var st=document.querySelector(".pc-stage");st.setAttribute("aria-label",s.aria);st.querySelector("svg").setAttribute("aria-label",s.label);})();`;

const page = `<!doctype html><html lang="nl" class="iso" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${STRINGS.nl.title}</title><script>${BOOT}</script><style>${k.ISO_CSS}${VANTAGE_CSS}</style></head><body><main>${plate}</main><script>${LANG}</script><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, page);
console.log(`model: scan 10 ms → ${perSecond(10)}/s · alarms ${ALARMS.map((a) => minutesOf(a)).join("/")} min · ${ALARMS[0].n / SHIFTS} per shift`);
console.log(`wrote ${OUT} · ${(page.length / 1024).toFixed(1)} KB · ${solids} solids · ${R.items.length} items · viewBox ${WIDTH}×${HEIGHT} · scale ${KS.toFixed(3)}`);

A.auditOrExit(R, P, { apart: false });
