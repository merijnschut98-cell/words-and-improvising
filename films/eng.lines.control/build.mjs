// Dev tool, not shipped. Builds the explainer film "Hoe een machine denkt /
// How a machine thinks" for the topic Besturing en data of Lijnen en
// automatisering: plc (level 1), safety (2), oee_auto (3) and stoppages (4).
//
//   node films/eng.lines.control/build.mjs            build the page
//   node films/eng.lines.control/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.lines.control.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.4.
//
// Three places on one floor, left to right. The press station of the plc
// lesson: a control cabinet with its door off (power supply, PLC, input and
// output cards with a lamp per channel, a safety relay with two contactors, a
// terminal strip, a signal tower on the roof), a bench with a nest and its part,
// a part sensor, a clamp cylinder with a reed sensor, a press, a valve manifold,
// and an operator console with the HMI, the emergency stop, start and reset.
// A robot cell behind a guard fence with an interlocked door. A bottling line:
// six machines on one conveyor (filler, capper and labeller among them). Charts
// (the scan cycle, a ladder rung, the HMI, the risk graph, the line OEE, the
// machine states, the alarm log and the Pareto chart) sit in stage space over
// the drawing.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport } from '../_kit/build-film.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts); the {n:...} numbers are then checked against the Dutch lesson
// text by defineFilm. Sources as in the lessons and the figure eng.lines.plc:
// EN 60204-1 (an emergency stop is stop category 0 or 1), EN ISO 13850 (it
// latches; releasing it never restarts), ISO 13849-1 (PL a … e from the risk
// graph S, F, P; its 2015 note reads exposure more often than once per 15 min
// as F2, so 10 times an hour counts as frequent, which the lesson hedges as
// its own reading), Machinery Regulation (EU) 2023/1230 from 20 January 2027.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
// plc: scan 10 ms → inputs read 1000 / 10 = 100 times a second; the press hangs in step 3
const SCAN = 10;
assert(1000 / SCAN === 100, '10 ms scan → 100 times a second');
const STEPS = ['part', 'clamp', 'check', 'press', 'release'];
assert(STEPS.length === 5 && STEPS[2] === 'check', 'step 3 waits for "klem dicht"');
// safety: door opened 10 times an hour; risk graph S2 F2 P1 → PL d, S2 F2 P2 → PL e
const RISK = { S1F1P1: 'a', S1F1P2: 'b', S1F2P1: 'b', S1F2P2: 'c', S2F1P1: 'c', S2F1P2: 'd', S2F2P1: 'd', S2F2P2: 'e' };
const DOOR_PER_HOUR = 10;
assert(60 / DOOR_PER_HOUR < 15, '10 times an hour is more often than once per 15 min (F2)');
assert(RISK.S2F2P1 === 'd' && RISK.S2F2P2 === 'e', 'risk graph: severe, frequent, avoidable → d; not avoidable → e');
const MR_DATE = '2027-01-20';
assert(MR_DATE === '2027-01-20', 'Machinery Regulation applies from 20 January 2027');
// oee_auto: six machines, each above 90 % on its screen, line OEE 58 %; a week of states
const STATES = {
  filler: { run: 71, blocked: 22 },
  capper: { run: 68, blocked: 25 },
  labeller: { run: 74, fault: 23, starved: 2, blocked: 1 },
};
assert(STATES.labeller.run + STATES.labeller.fault + STATES.labeller.starved + STATES.labeller.blocked === 100, 'labeller states sum to 100 %');
const runMost = Object.entries(STATES).sort((a, b) => b[1].run - a[1].run)[0][0];
const waitOf = (s) => (s.blocked || 0) + (s.starved || 0);
assert(runMost === 'labeller' && waitOf(STATES.labeller) < waitOf(STATES.filler) && waitOf(STATES.labeller) < waitOf(STATES.capper), 'the labeller runs most and waits least: the hidden bottleneck');
// stoppages: one week of 10 shifts
const ALARMS = [
  { key: 'part', n: 1200, s: 20 },
  { key: 'servo', n: 6, s: 25 * 60 },
  { key: 'door', n: 300, s: 30 },
];
const minutesOf = (a) => (a.n * a.s) / 60;
assert(minutesOf(ALARMS[0]) === 400 && minutesOf(ALARMS[1]) === 150 && minutesOf(ALARMS[2]) === 150, '400, 150 and 150 minutes');
assert(ALARMS[0].n / 10 === 120, '120 micro-stops per shift');
assert([...ALARMS].sort((a, b) => b.n - a.n)[0].key === 'part' && [...ALARMS].sort((a, b) => minutesOf(b) - minutesOf(a))[0].key === 'part', '"part missing" tops both Paretos');

// ---------------------------------------------------------------- the world
// x to the right along the floor (press station at -x, bottling line at +x), y
// toward the viewer, z up; the floor is z = 0. Units of about 5 mm.
const W = 640;
const H = 400;
const BT = 36; // bench top
const CAB = { x: -334, y: -40, w: 66, d: 26, r: 0.8 };
const CAB_H = 132;
const MP_Y = CAB.y + 3.2; // mounting plate face
const PARTC = [-188, 0];
const PART = { w: 12, d: 10, h: 5 };
const NEST_Z = BT + 6;
const PART_TOP = NEST_Z + PART.h;
const CL = { x0: -164, x1: -142, y: 0, z: NEST_Z + 5, r: 4.5 }; // clamp cylinder along x
const JAW = { x: -176, w: 3, stroke: 6 }; // jaw face lands on the part's right edge (-182)
const PR = { x: -188, y: 0, r: 5, z0: 92, z1: 114 }; // press cylinder
const RAM_REST = 70;
const RAM_STROKE = RAM_REST - PART_TOP;
const ESTOP = [-226, 46];
const CON_Z = 62;
const ROBOT = [20, -28];
const FENCE_Y = 30;
const DOOR = { x0: 34, x1: 64 }; // hinge at x1
const BELT_Z = 34;
const MACH = [170, 240, 310, 380, 450, 520];
const C = {
  BT, PARTC, PART, NEST_Z, PART_TOP, CL, JAW, PR, RAM_REST, RAM_STROKE, ESTOP, CON_Z, ROBOT, FENCE_Y, DOOR, BELT_Z, MACH,
  STATES, ALARMS: ALARMS.map((a) => ({ ...a, min: minutesOf(a) })),
  // the risk graph's leaves in the order S1F1P1 … S2F2P2, and the two paths the film draws
  PL: Object.values(RISK), LEAF_D: Object.keys(RISK).indexOf('S2F2P1'), LEAF_E: Object.keys(RISK).indexOf('S2F2P2'),
};
assert(C.LEAF_D === 6 && C.LEAF_E === 7 && C.PL.join('') === 'abbccdde', 'risk graph leaves');

const FIT = [[-340, -72, 0], [570, 52, 0], [-340, -72, CAB_H + 20], [570, -72, 110], [-340, 52, 0], [570, 52, 0]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 52, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 1) => S(k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 20) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), style);
const alongX = (y, z, x0, x1, r, style = {}, steps) => S(G.disc(x0, x1, r, G.frameOf([0, y, z], X, Y, Z), P, steps ? { steps } : {}), style);
const alongY = (x, z, y0, y1, r, style = {}, steps) => S(G.disc(y0, y1, r, G.frameOf([x, 0, z], Y, X, Z), P, steps ? { steps } : {}), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf(plan, z, pad, P)}"/>`;
const screws = (plan, z, inset = 2.4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });
// a flat rectangle on a face of constant y (the front of a module)
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'lc-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const rules = (x0, y, z, lens, step = 1.6) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(''), { tone: 'lo', free: true });
const led = (key, p, r = 0.7) => { const [x, y] = at(p); return `<circle class="lc-led" data-led="${key}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * G.scaleOf(P)).toFixed(2)}"/>`; };

// ---------------------------------------------------------------- the control cabinet (door off)
const ON_RAIL = MP_Y + 1;
const MOD = {
  psu: { x: -326, w: 8, d: 9, z0: 100, z1: 118 },
  cpu: { x: -316, w: 11, d: 11, z0: 99, z1: 119 },
  di: { x: -303, w: 6, d: 10, z0: 100, z1: 118 },
  dout: { x: -295.5, w: 6, d: 10, z0: 100, z1: 118 },
  drive: { x: -287, w: 11, d: 12, z0: 98, z1: 120 },
};
const fyOf = (m) => ON_RAIL + m.d;
const planOf = (m) => ({ x: m.x, y: ON_RAIL, w: m.w, d: m.d, r: 0.4 });
const rail = (z, x0, x1) => box({ x: x0, y: MP_Y, w: x1 - x0, d: 1, r: 0.1 }, z - 2, z + 2, { crease: 'none' }, 0, 1) + Dt([[x0 + 1.6, MP_Y + 1, z], [x1 - 1.6, MP_Y + 1, z]].map(at), { size: 0.35 });
const cabBack = [
  halo(k.insetPlan(CAB, -3), 0, 2),
  box({ ...CAB, d: 3.2 }, 0, CAB_H, { tone: 'lo' }, 0.2, 1),
  box({ x: CAB.x, y: CAB.y + 3, w: 2, d: CAB.d - 3 }, 0, CAB_H, {}, 0.2, 1),
  box({ x: CAB.x + 2, y: CAB.y + 3, w: CAB.w - 4, d: CAB.d - 3 }, 0, 6, { tone: 'lo', inner: seam({ x: CAB.x + 2, y: CAB.y + 3, w: CAB.w - 4, d: CAB.d - 3 }, 3) }, 0.2, 1),
  box({ x: CAB.x + 4, y: CAB.y + 2.2, w: CAB.w - 8, d: 1, r: 0.2 }, 10, CAB_H - 6, { tone: 'lo', crease: 'none' }, 0, 1),
  Dt([[CAB.x + 5.6, MP_Y, 12], [CAB.x + CAB.w - 5.6, MP_Y, 12], [CAB.x + 5.6, MP_Y, CAB_H - 8], [CAB.x + CAB.w - 5.6, MP_Y, CAB_H - 8]].map(at), { size: 0.45 }),
  rail(109, CAB.x + 6, CAB.x + CAB.w - 6),
  rail(72, CAB.x + 6, CAB.x + CAB.w - 6),
  rail(34, CAB.x + 6, CAB.x + CAB.w - 6),
].join('');
const psu = box(planOf(MOD.psu), MOD.psu.z0, MOD.psu.z1, {}, 0.2)
  + `<path class="lc-hole" d="${[0, 1, 2, 3].map((i) => faceY(fyOf(MOD.psu), MOD.psu.x + 1.6, MOD.psu.x + MOD.psu.w - 1.6, MOD.psu.z1 - 3 - i * 2, MOD.psu.z1 - 2.3 - i * 2)).join('')}"/>`
  + led('psu', [MOD.psu.x + 2, fyOf(MOD.psu), MOD.psu.z0 + 3], 0.6);
const cpu = box(planOf(MOD.cpu), MOD.cpu.z0, MOD.cpu.z1, { tone: 'hi', crease: 'lo' }, 0.25)
  + card(fyOf(MOD.cpu), MOD.cpu.x + 1.6, MOD.cpu.x + MOD.cpu.w - 1.6, MOD.cpu.z1 - 7, MOD.cpu.z1 - 1.8) + rules(MOD.cpu.x + 2.6, fyOf(MOD.cpu), MOD.cpu.z1 - 3, [5, 3.4, 4.2])
  + led('run', [MOD.cpu.x + 2.4, fyOf(MOD.cpu), MOD.cpu.z1 - 9.5]) + led('err', [MOD.cpu.x + 5, fyOf(MOD.cpu), MOD.cpu.z1 - 9.5])
  + `<path class="lc-hole" d="${faceY(fyOf(MOD.cpu), MOD.cpu.x + 2.4, MOD.cpu.x + MOD.cpu.w - 2.4, MOD.cpu.z0 + 2.4, MOD.cpu.z0 + 5)}"/>`;
const ioCard = (m, pre) => box(planOf(m), m.z0, m.z1, {}, 0.2)
  + [0, 1, 2, 3].map((i) => led(pre + i, [m.x + 1.7, fyOf(m), m.z1 - 3 - i * 2.4], 0.6)).join('')
  + rules(m.x + 3, fyOf(m), m.z1 - 3, [1.6, 1.6, 1.6, 1.6], 2.4) + Dt([at([m.x + m.w / 2, fyOf(m), m.z0 + 2])], { size: 0.4 });
const drive = box(planOf(MOD.drive), MOD.drive.z0, MOD.drive.z1, {}, 0.25)
  + `<path class="lc-hole" d="${[0, 1, 2, 3, 4].map((i) => faceY(fyOf(MOD.drive), MOD.drive.x + 1.8 + i * 1.8, MOD.drive.x + 2.7 + i * 1.8, MOD.drive.z0 + 2.4, MOD.drive.z0 + 8)).join('')}"/>`
  + card(fyOf(MOD.drive), MOD.drive.x + 1.8, MOD.drive.x + MOD.drive.w - 1.8, MOD.drive.z1 - 6, MOD.drive.z1 - 1.8, 'lc-screen');
// the wire duct between the rails
const duct = (() => {
  const dp = { x: CAB.x + 6, y: MP_Y, w: CAB.w - 12, d: 7, r: 0.2 };
  const combs = [];
  for (let x = dp.x + 2; x < dp.x + dp.w - 1; x += 2.6) combs.push(k.segment([x, MP_Y + 7, 86], [x, MP_Y + 7, 92], P));
  return box(dp, 86, 92, { tone: 'lo' }, 0, 1) + L(combs.join(''), { tone: 'faint' });
})();
// rail B: safety relay K0, contactors K1, K2
const relay = (() => {
  const sr = { x: -326, w: 9, d: 11, z0: 62, z1: 82 };
  const fy = ON_RAIL + sr.d;
  return box({ x: sr.x, y: ON_RAIL, w: sr.w, d: sr.d, r: 0.4 }, sr.z0, sr.z1, { tone: 'hi', crease: 'lo' }, 0.2)
    + led('k0a', [sr.x + 2, fy, sr.z1 - 3]) + led('k0b', [sr.x + 4.5, fy, sr.z1 - 3]) + led('k0p', [sr.x + 7, fy, sr.z1 - 3])
    + rules(sr.x + 1.8, fy, sr.z1 - 6.5, [5, 3.6, 4.4]) + Dt([2, 4.5, 7].map((dx) => at([sr.x + dx, fy, sr.z0 + 2])), { size: 0.4 });
})();
const contactor = (x, i) => {
  const c = { x, w: 8, d: 10, z0: 63, z1: 81 };
  const fy = ON_RAIL + c.d;
  return box({ x, y: ON_RAIL, w: c.w, d: c.d, r: 0.4 }, c.z0, c.z1, {}, 0.2)
    + `<path class="lc-flag" data-flag="k${i}" d="${faceY(fy, x + 2, x + c.w - 2, c.z1 - 7, c.z1 - 4)}"/>`
    + Dt([[x + 2, fy, c.z0 + 2], [x + 4, fy, c.z0 + 2], [x + 6, fy, c.z0 + 2], [x + 2, fy, c.z1 - 1.8], [x + 4, fy, c.z1 - 1.8], [x + 6, fy, c.z1 - 1.8]].map(at), { size: 0.38 });
};
const terminals = Array.from({ length: 9 }, (_, i) => {
  const x = -326 + i * 4.4;
  return box({ x, y: ON_RAIL, w: 3, d: 7, r: 0.2 }, 29, 39, { tone: i === 0 || i === 8 ? 'hi' : 'mid', crease: 'lo' }, 0, 1) + Dt([at([x + 1.5, ON_RAIL + 7, 37]), at([x + 1.5, ON_RAIL + 7, 31])], { size: 0.32 });
}).join('');
const cabSide = (() => {
  const xs = CAB.x + CAB.w;
  const rw = { x: xs - 2, y: CAB.y + 3, w: 2, d: CAB.d - 3, r: 0.2 };
  return box(rw, 0, CAB_H, {}, 0.2, 1)
    + S(G.disc(0, 1.4, 4.2, G.frameOf([xs, CAB.y + 13, 96], X, Y, Z), P, { steps: 20 }), { tone: 'lo' })
    + box({ x: xs + 1.4, y: CAB.y + 12, w: 1.6, d: 2, r: 0.3 }, 92, 100, { tone: 'hi', crease: 'lo' }, 0, 1)
    + box(k.insetPlan(CAB, -0.8), CAB_H, CAB_H + 3, {}, 0.4);
})();
const STACK = [CAB.x + CAB.w - 10, CAB.y + 10];
const stackBase = post(STACK[0], STACK[1], 3, CAB_H + 3, CAB_H + 5, { tone: 'lo' });
const stackSeg = (i) => post(STACK[0], STACK[1], 2.6, CAB_H + 5 + i * 4.4, CAB_H + 9.4 + i * 4.4, { crease: 'lo', inner: i ? L(k.sideArc(STACK[0], STACK[1], 2.6, CAB_H + 5 + i * 4.4, P, 20), { tone: 'faint' }) : '' });
const stackCap = post(STACK[0], STACK[1], 2.8, CAB_H + 18.2, CAB_H + 19.4) + Dt([at([STACK[0], STACK[1], CAB_H + 19.4])], { size: 0.4, tone: 'hi' });

// ---------------------------------------------------------------- the bench, nest, clamp, press, valves
const BENCH = { x: -252, y: -32, w: 150, d: 62, r: 1.5 };
const bench = [
  halo(k.insetPlan(BENCH, -3), 0, 2),
  ...k.corners(BENCH, 6).map(([x, y]) => post(x, y, 3, 0, 4, { tone: 'lo' }, 16)).join(''),
  box(BENCH, 4, BT, { tone: 'lo', inner: seam(BENCH, BT - 6, 3) + seam(BENCH, 10, 3) }, 0.6, 3),
  L(k.planOutline(k.insetPlan(BENCH, 3), BT, P, 3), { tone: 'faint' }),
  screws(BENCH, BT, 3),
  // the CE type plate on the bench top, front right, three engraved rule lines
  cue('ce', box({ x: -126, y: 18, w: 18, d: 8, r: 0.4 }, BT, BT + 0.5, { tone: 'lo', crease: 'none' }, 0, 1)
    + L([0, 1, 2].map((i) => k.lineOnTop([-123.6, 20 + i * 2], [-123.6 + [12, 8, 10][i], 20 + i * 2], BT + 0.5, P)).join(''), { tone: 'lo', free: true })),
].join('');
const NEST = { x: -204, y: -9, w: 30, d: 18, r: 0.8 };
const nest = box(NEST, BT, NEST_Z, { inner: seam(NEST, BT + 2) }, 0.5)
  + L(k.corners(NEST, 2.4).map(([x, y]) => k.ring(x, y, 1.2, NEST_Z, P, 12)).join(''), { tone: 'lo' }) + screws(NEST, NEST_Z, 2.4)
  + L(k.planOutline({ x: PARTC[0] - 6.6, y: PARTC[1] - 5.6, w: 13.2, d: 11.2, r: 0.4 }, NEST_Z, P, 2), { tone: 'faint' })
  + box({ x: PARTC[0] - 9, y: -4, w: 2.6, d: 8, r: 0.3 }, NEST_Z, NEST_Z + 5, { tone: 'hi', crease: 'lo' }, 0, 1);
const valves = (() => {
  const MAN = { x: -156, y: -28, w: 30, d: 9, r: 0.5 };
  let out = box(MAN, BT, BT + 4, { tone: 'lo' }, 0.3) + screws(MAN, BT + 4, 1.4);
  [-153, -141].forEach((x, i) => {
    out += box({ x, y: MAN.y + 1, w: 10, d: 7, r: 0.4 }, BT + 4, BT + 13, {}, 0.2);
    out += box({ x: x + 1.5, y: MAN.y + 8, w: 7, d: 3, r: 0.4 }, BT + 5, BT + 12, { tone: 'hi', crease: 'lo' }, 0.2) + led('y' + (i + 1), [x + 3.4, MAN.y + 11, BT + 10]);
    out += post(x + 2.5, MAN.y + 4.5, 0.8, BT + 13, BT + 15, {}, 10) + post(x + 7.5, MAN.y + 4.5, 0.8, BT + 13, BT + 15, {}, 10);
  });
  return out;
})();
// the press column, arm and cylinder; the ram moves
const pressBack = post(PR.x, -24, 5.5, BT, BT + 2, { tone: 'lo' }, 20) + post(PR.x, -24, 3.2, BT + 2, PR.z1 + 4, { crease: 'none', inner: L(k.sideArc(PR.x, -24, 3.2, 80, P, 20), { tone: 'faint' }) });
const pressFront = box({ x: PR.x - 3.2, y: -27, w: 6.4, d: 30, r: 0.6 }, PR.z1 + 4, PR.z1 + 9, {}, 0.4) + Dt([at([PR.x, -24, PR.z1 + 9]), at([PR.x, 0, PR.z1 + 9])], { size: 0.45 })
  + post(PR.x, PR.y, PR.r, PR.z0, PR.z1 + 4, { tone: 'hi', crease: 'lo', inner: L(k.sideArc(PR.x, PR.y, PR.r, PR.z1, P, 18) + k.sideArc(PR.x, PR.y, PR.r, PR.z0 + 2, P, 18), { tone: 'faint' }) }, 20)
  + post(PR.x, PR.y, 2.6, PR.z0 - 1.6, PR.z0, {}, 8)
  + box({ x: PR.x - 1.6, y: PR.r - 0.2, w: 3.2, d: 1.6, r: 0.3 }, PR.z0 + 2, PR.z0 + 6, { tone: 'hi', crease: 'lo' }, 0, 1);
const ram = post(PR.x, PR.y, 1.3, RAM_REST + 2, PR.z0, { tone: 'hi', crease: 'none' }, 16) + post(PR.x, PR.y, 3.6, RAM_REST, RAM_REST + 2.4, {}, 18);
const part = box({ x: PARTC[0] - PART.w / 2, y: PARTC[1] - PART.d / 2, w: PART.w, d: PART.d, r: 0.5 }, NEST_Z, PART_TOP, { tone: 'hi', crease: 'lo' }, 0.4)
  + L(k.ring(PARTC[0] + 2, PARTC[1], 1.8, PART_TOP, P, 16), { tone: 'lo' });
// the clamp cylinder on two feet with a reed sensor ("klem dicht") on top
const clampBody = [-160, -147].map((x) => box({ x, y: -3.5, w: 3.4, d: 7, r: 0.3 }, BT, CL.z - CL.r + 0.4, { tone: 'lo' }, 0, 1)).join('')
  + alongX(CL.y, CL.z, CL.x0, CL.x0 + 2, CL.r + 0.7, {}, 20)
  + alongX(CL.y, CL.z, CL.x0 + 2, CL.x1 - 2, CL.r, { tone: 'hi', crease: 'lo' }, 22)
  + alongX(CL.y, CL.z, CL.x1 - 2, CL.x1, CL.r + 0.7, {}, 20)
  + post(CL.x0 + 1, 0, 0.8, CL.z + CL.r + 0.4, CL.z + CL.r + 2.4, {}, 10) + post(CL.x1 - 1, 0, 0.8, CL.z + CL.r + 0.4, CL.z + CL.r + 2.4, {}, 10);
const reed = box({ x: -161, y: -1, w: 5, d: 2, r: 0.3 }, CL.z + CL.r - 0.2, CL.z + CL.r + 1.4, { tone: 'hi', crease: 'lo' }, 0, 1) + led('b1', [-158.5, 1, CL.z + CL.r + 0.8], 0.5);
const jaw = alongX(CL.y, CL.z, JAW.x + JAW.w, CL.x0 + 6, 1.4, { tone: 'hi', crease: 'none' }, 16)
  + box({ x: JAW.x, y: -5, w: JAW.w, d: 10, r: 0.3 }, NEST_Z, NEST_Z + 7, {}, 0, 1);
// the diffuse part sensor on a short post, its lens on the part
const SENS = { x: -192, y: 13, w: 6, d: 5 };
const sensor = post(SENS.x + 3, SENS.y + 3, 1.6, BT, BT + 7, {}, 14)
  + box({ ...SENS, r: 0.5 }, BT + 7, BT + 12, { tone: 'hi', crease: 'lo' }, 0.2)
  + led('b0', [SENS.x + 4.6, SENS.y + SENS.d, BT + 10.6], 0.6) + Dt([at([SENS.x + 1.4, SENS.y + SENS.d, BT + 10.6])], { size: 0.35 });
// the operator console on a pedestal: HMI, emergency stop, start and reset
const CON = { x: -244, y: 40, w: 42, d: 16, r: 1 };
const HMI_F = CON.y + 3;
const consoleBack = [
  halo({ x: -228, y: 44, w: 10, d: 10, r: 2 }, 0, 2),
  post(-223, 48, 4, 0, 2, { tone: 'lo' }, 18),
  box({ x: -226, y: 45, w: 6, d: 6, r: 0.6 }, 2, CON_Z - 8, {}, 0.3, 1),
  box(CON, CON_Z - 8, CON_Z, { inner: seam(CON, CON_Z - 4) }, 0.4) + screws(CON, CON_Z, 1.4),
].join('');
const hmi = box({ x: -240, y: CON.y, w: 30, d: 3, r: 0.4 }, CON_Z, CON_Z + 22, {}, 0.3)
  + card(HMI_F, -238, -212, CON_Z + 2, CON_Z + 20, 'lc-screen')
  + `<g data-k="hmiTxt"></g>`;
const buttons = [[-214, 'start'], [-207, 'reset']].map(([x, key]) => post(x, ESTOP[1] + 4, 2.4, CON_Z, CON_Z + 0.8, { tone: 'lo' }, 14)
  + g('btn-' + key, post(x, ESTOP[1] + 4, 1.8, CON_Z + 0.8, CON_Z + 2, { tone: 'hi', crease: 'lo' }, 14))).join('');
const estopCollar = post(ESTOP[0], ESTOP[1] + 4, 4, CON_Z, CON_Z + 1, { tone: 'lo' }, 20);
const estopHead = post(ESTOP[0], ESTOP[1] + 4, 1.5, CON_Z + 1, CON_Z + 3, {}, 16) + S(k.cylinder(ESTOP[0], ESTOP[1] + 4, 3.2, CON_Z + 3, 2.2, P, 28, 0.6), { tone: 'hi', crease: 'lo', lit: true });
// cables: sensors to the input card, outputs to the valves (on the bench top and up into the cabinet)
const xs = CAB.x + CAB.w;
const wire = (pts, key, tone = 'lo') => `<g data-sig="${key}">${k.wireSvg(at(pts[0]), at(pts[pts.length - 1]), { via: pts.slice(1, -1).map(at), tone, size: 0.9, ends: 'both' })}</g>`;
const cables = [
  wire([[SENS.x + 3, SENS.y, BT + 9], [-196, 24, BT + 0.4], [-244, 24, BT + 0.4], [xs + 2, -10, 52], [xs, -10, 60]], 'i0'),
  wire([[-158.5, 0, CL.z + CL.r + 1.6], [-156, 10, BT + 0.4], [-244, 22, BT + 0.4], [xs + 2, -12, 50], [xs, -12, 58]], 'i1'),
  wire([[-148, -17, BT + 9], [-148, -12, BT + 0.4], [-244, -12, BT + 0.4], [xs + 2, -16, 48], [xs, -16, 56]], 'q0'),
  wire([[-136, -17, BT + 9], [-136, -14, BT + 0.4], [-246, -14, BT + 0.4], [xs + 2, -18, 46], [xs, -18, 54]], 'q1'),
].join('');
// air hoses from the valves to the clamp cylinder and the press
const hose = (pts) => k.wireSvg(at(pts[0]), at(pts[pts.length - 1]), { via: pts.slice(1, -1).map(at), tone: 'mid', size: 0.8, ends: 'both' });
const hoses = hose([[-150.5, -23.5, BT + 15], [-152, -12, BT + 18], [CL.x0 + 1, -6, CL.z + 12], [CL.x0 + 1, 0, CL.z + CL.r + 2.4]]) // to the clamp, both ports
  + hose([[-145.5, -23.5, BT + 15], [-144, -12, BT + 18], [CL.x1 - 1, -6, CL.z + 12], [CL.x1 - 1, 0, CL.z + CL.r + 2.4]])
  + hose([[-133.5, -23.5, BT + 15], [-133.5, -23.5, BT + 22], [PR.x + 6, -24, BT + 22], [PR.x + 6, -24, PR.z0 + 6], [PR.x + 6, -4, PR.z0 + 6], [PR.x + PR.r, 0, PR.z0 + 6]]);
// the emergency-stop chain: two channels from the console to the safety relay; "cut" has a gap
const chainPts = (dz) => [[-223, 45, CON_Z - 9], [-223 - dz, 44, 2], [-259 - dz, 38, 1], [-259 - dz, -8, 1], [xs + 2, -8, 30 + dz], [xs, -8, 36 + dz]];
const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const cutOf = (pts) => {
  const c0 = lerp3(pts[2], pts[3], 0.4);
  const c1 = lerp3(pts[2], pts[3], 0.52);
  return wire([...pts.slice(0, 3), c0], 'chain') + wire([c1, ...pts.slice(3)], 'chain');
};
const chain = `<g data-k="chainWhole">${wire(chainPts(0), 'chain')}${wire(chainPts(2), 'chain')}</g><g data-k="chainCut" style="display:none">${cutOf(chainPts(0))}${cutOf(chainPts(2))}</g>`;

// ---------------------------------------------------------------- the robot cell
const CELLF = { x: -62, y: -74, w: 150, d: 110, r: 2 };
const cellFloor = halo(k.insetPlan(CELLF, -2), 0, 2) + box(CELLF, 0, 2, { tone: 'lo', crease: 'none' }, 0.3, 2)
  + L(k.planOutline(k.insetPlan(CELLF, 4), 2, P, 2), { tone: 'faint' });
const robotBase = post(ROBOT[0], ROBOT[1], 13, 2, 8, { tone: 'lo' }, 20) + screws({ x: ROBOT[0] - 10, y: ROBOT[1] - 10, w: 20, d: 20 }, 8, 0)
  + post(ROBOT[0], ROBOT[1], 10, 8, 22, { crease: 'lo' }, 20);
// the safety door switch on the latch post, its actuator on the door
const doorSwitch = box({ x: DOOR.x0 + 1.6, y: FENCE_Y + 1.6, w: 4, d: 3, r: 0.4 }, 46, 56, { tone: 'hi', crease: 'lo' }, 0.2) + led('ds', [DOOR.x0 + 3.6, FENCE_Y + 4.6, 53], 0.6);

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('scan', '', ' data-cue="scan"'),
  g('ladder', '', ' data-cue="ladder"'),
  g('hmiz', '', ' data-cue="hmi2"'),
  g('risk', '', ' data-cue="pl"'),
  g('reg', '', ' data-cue="reg"'),
  g('oee', '', ' data-cue="oee"'),
  g('tags', ''),
  g('states', '', ' data-cue="states"'),
  g('log', g('logIn', '') + cue('first', g('logFirst', ''))),
  g('pareto', '', ' data-cue="pareto"'),
  g('mes', '', ' data-cue="mes"'),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('cabinet', [
    cabBack,
    psu, cue('plc', cpu), cue('io', ioCard(MOD.di, 'i') + ioCard(MOD.dout, 'q')), drive, duct,
    cue('relay', relay + contactor(-315, 1) + contactor(-305, 2)), terminals,
    cabSide, stackBase, g('seg0', stackSeg(0)), g('seg1', stackSeg(1)), g('seg2', stackSeg(2)), stackCap,
  ].join('')),
  g('station', [
    bench,
    cue('io', cables),
    cue('chain', chain),
    valves, pressBack, nest, g('part', part),
    cue('clamp', clampBody + g('jaw', jaw)),
    cue('sensor', reed),
    g('ram', ram), pressFront,
    cue('sensor', sensor),
    hoses,
    consoleBack, cue('hmi', hmi), buttons, cue('estop', estopCollar + g('estopHead', estopHead)),
  ].join('')),
  g('cell', [
    cellFloor, robotBase, g('robot', ''), g('fence', ''), cue('door', g('door', '') + doorSwitch), g('doorFront', ''),
  ].join('')),
  // the bottling line's six identical machines and the fence's mesh are drawn by
  // the stage when the page opens (stage.js, repeated), which keeps the page small
  g('line', ''),
].join('');

// Static paths written with relative line-tos (the helper from the measuring film):
// the same points (to 0,1), about a third fewer bytes. Only M, L and Z paths at one
// decimal are rewritten, and each rewrite is read back to prove it exact.
function compactPath(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g);
  const n = (v) => { const a = Math.abs(v); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return (v < 0 ? '-' : '') + t; };
  let out = '';
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  let last = '';
  const put = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    for (const v of nums) { const t = n(v); s += (s && !/[MlZ]$/.test(s) && t[0] !== '-' ? ' ' : '') + t; }
    if (!/^[MlZ]/.test(s) && out && !/[MlZ]$/.test(out) && s[0] !== '-') out += ' ';
    out += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put('M', p); cur = p; start = p; cmd = 'L'; } else { put('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
  }
  return out;
}
function pointsOf(d) {
  const tok = d.match(/[MLZlz]|-?\d*\.?\d+/g);
  const out = [];
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  for (let i = 0; i < tok.length;) {
    if (/[MLZlz]/.test(tok[i])) { cmd = tok[i++]; if (/[Zz]/.test(cmd)) { out.push('Z'); cur = start; } continue; }
    const v = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    cur = cmd === 'l' ? [cur[0] + v[0], cur[1] + v[1]] : v;
    if (cmd === 'M') { start = cur; cmd = 'L'; out.push('M'); }
    out.push(cur.join());
  }
  return out.join(' ');
}
const compact = (html) => html.replace(/ d="([MLZ\d.\s-]+)"/g, (m, d) => {
  if (/\.\d\d/.test(d)) return m;
  const c = compactPath(d);
  if (pointsOf(c) !== pointsOf(d)) throw new Error(`compactPath changed a path: ${d.slice(0, 60)}`);
  return ` d="${c}"`;
});
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
const cam = (p, w) => { const [x, y] = at(p); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const CAM = [
  { from: cam([-230, 0, 70], 330), to: cam([-215, 5, 60], 270), a: 0.05, b: 0.9 },
  { from: cam([-185, 10, 72], 300), to: cam([-180, 10, 70], 290) },
  { from: cam([-215, 15, 62], 250), to: cam([-170, 5, 52], 190), a: 0.74, b: 0.88 },
  { from: cam([-235, 15, 50], 260), to: cam([-250, 5, 60], 300), a: 0.3, b: 0.6 },
  { from: cam([75, 0, 45], 270), to: cam([-30, 0, 45], 340), a: 0.72, b: 0.92 },
  { from: cam([340, -20, 45], 430), to: cam([350, -20, 45], 400) },
  { from: cam([350, -20, 45], 400), to: cam([390, -20, 45], 380) },
  { from: cam([-200, 0, 60], 300), to: cam([-200, 0, 60], 300) },
  { from: cam([-200, 0, 60], 300), to: cam([-190, 0, 60], 300) },
];

// ---------------------------------------------------------------- the film
const PLC = 'eng.lines.plc';
const SAF = 'eng.lines.safety';
const OEE = 'eng.lines.oee_auto';
const STOP = 'eng.lines.stoppages';
const DUR = [32, 34, 32, 32, 36, 30, 34, 32, 36];
C.dur = DUR;
const spec = {
  id: 'eng.lines.control',
  title: { nl: 'Hoe een machine denkt', en: 'How a machine thinks' },
  lessons: [PLC, SAF, OEE, STOP],
  scenes: [
    {
      id: 's1', lesson: PLC, level: 1, dur: DUR[0], still: 0.6, title: { nl: 'Ogen, brein en handen', en: 'Eyes, brain and hands' },
      beats: [
        { nl: 'Een {t:Sensor|sensor} ziet iets: ligt het onderdeel er, is de klem dicht?', en: 'A {t:Sensor|sensor} detects something: is the part there, is the clamp closed?', cue: { Sensor: 'sensor' }, still: 0.15 },
        { nl: 'De PLC in de kast is het brein: hij beslist wat er daarna gebeurt.', en: 'The PLC in the cabinet is the brain: it decides what happens next.', cues: ['plc'], still: 0.4 },
        { nl: 'Een {t:Actuator|actuator} doet iets: hier duwt een luchtcilinder de klem dicht.', en: 'An {t:Actuator|actuator} does something: here an air cylinder pushes the clamp shut.', cue: { Actuator: 'clamp' }, still: 0.65 },
        { nl: 'Sensoren op ingangen, actuatoren op uitgangen: samen de {t:I/O|I/O}.', en: 'Sensors on inputs, actuators on outputs: together the {t:I/O|I/O}.', cue: { 'I/O': 'io' }, still: 0.92 },
      ],
    },
    {
      id: 's2', lesson: PLC, level: 1, dur: DUR[1], still: 0.85, title: { nl: 'De scancyclus', en: 'The scan cycle' },
      beats: [
        { nl: 'De {t:Scancyclus|scancyclus}: ingangen lezen, programma doorlopen, uitgangen schrijven.', en: 'The {t:Scan cycle|scan cycle}: read the inputs, run the program, write the outputs.', cue: { Scancyclus: 'scan' }, still: 0.2 },
        { nl: 'Een scan van {n:10} ms: elke ingang wordt {n:100} keer per seconde gelezen.', en: 'A {n:10} ms scan: every input is read {n:100} times a second.', cues: ['scan'], read: { nl: '1 s / {n:10} ms = {n:100} × per seconde', en: '1 s / {n:10} ms = {n:100} × a second' }, still: 0.42 },
        { nl: 'Een {t:Ladderdiagram|ladderdiagram} lijkt op een schema met sporten: links voorwaarden, rechts acties.', en: 'A {t:Ladder diagram|ladder diagram} looks like a drawing with rungs: conditions left, actions right.', cue: { Ladderdiagram: 'ladder' }, still: 0.65 },
        { nl: 'Onderdeel aanwezig? Dan gaat de uitgang aan en sluit de klem.', en: 'Part present? Then the output switches on and the clamp closes.', cues: ['ladder', 'clamp'], still: 0.9 },
      ],
    },
    {
      id: 's3', lesson: PLC, level: 1, dur: DUR[2], still: 0.6, title: { nl: 'Stap 3: wacht op klem dicht', en: 'Step 3: waiting for clamp closed' },
      beats: [
        { nl: 'Op de {t:HMI|HMI} ziet de operator status, alarmen en recepten.', en: 'On the {t:HMI|HMI} the operator sees the status, alarms and recipes.', cue: { HMI: 'hmi' }, still: 0.15 },
        { nl: 'Het programma loopt in stappen; de volgende komt pas als de voorwaarde er is.', en: 'The program runs in steps; the next one only comes when its condition is met.', cues: ['hmi2'], still: 0.38 },
        { nl: 'De HMI zegt waarop hij wacht: “Stap {n:3}: wacht op klem dicht”.', en: 'The HMI says what it is waiting for: “Step {n:3}: waiting for clamp closed”.', cues: ['hmi2'], still: 0.62 },
        { nl: 'Klem dicht? Dan de sensor. Klem open? Dan de lucht of het ventiel.', en: 'Clamp closed? Then the sensor. Clamp open? Then the air or the valve.', cues: ['clamp', 'sensor'], still: 0.9 },
      ],
    },
    {
      id: 's4', lesson: SAF, level: 2, dur: DUR[3], still: 0.4, title: { nl: 'De noodstop', en: 'The emergency stop' },
      beats: [
        { nl: 'De {t:Noodstop|noodstop} stopt de machine: meteen, of eerst afremmen en dan de energie eraf.', en: 'The {t:Emergency stop|emergency stop} stops the machine: at once, or braking first, then the power off.', cue: { Noodstop: 'estop' }, still: 0.15 },
        { nl: 'Een {t:Veiligheidsfunctie|veiligheidsfunctie}: het veiligheidsrelais laat twee schakelaars afvallen.', en: 'A {t:Safety function|safety function}: the safety relay drops out two contactors.', cue: { Veiligheidsfunctie: 'relay' }, still: 0.4 },
        { nl: 'Een gebroken draad stopt de machine ook.', en: 'A broken wire stops the machine too.', cues: ['chain'], still: 0.66 },
        { nl: 'Knop eruit start niets: eerst bewust resetten, dan starten.', en: 'Pulling the button out starts nothing: first a deliberate reset, then start.', cues: ['estop'], still: 0.92 },
      ],
    },
    {
      id: 's5', lesson: SAF, level: 2, dur: DUR[4], still: 0.45, title: { nl: 'Hoe betrouwbaar?', en: 'How reliable?' },
      beats: [
        { nl: 'Een operator opent de deur van een robotcel zo’n {n:10} keer per uur.', en: 'An operator opens the door of a robot cell about {n:10} times an hour.', cues: ['door'], still: 0.2 },
        { nl: '{t:Performance level|Performance level} (ISO 13849-1): van PL a, laagst, tot PL e, hoogst.', en: '{t:Performance level|Performance level} (ISO 13849-1): from PL a, lowest, to PL e, highest.', cue: { 'Performance level': 'pl' }, still: 0.34 },
        { nl: 'Ernstig, vaak (onze lezing), ontwijken mogelijk: PL d. Is de robot snel, dan PL e.', en: 'Severe, frequent (our reading), avoidable: PL d. If the robot is fast, PL e.', cues: ['pl'], still: 0.6 },
        { nl: '{t:CE-markering|CE-markering}; vanaf 20 januari 2027 geldt de {t:Machineverordening|Machineverordening}.', en: '{t:CE marking|CE marking}; from 20 January 2027 the {t:Machinery Regulation|Machinery Regulation} applies.', cue: { 'CE-markering': 'ce', Machineverordening: 'reg' }, still: 0.9 },
      ],
    },
    {
      id: 's6', lesson: OEE, level: 3, dur: DUR[5], still: 0.5, title: { nl: 'Zes machines, één lijn', en: 'Six machines, one line' },
      beats: [
        { nl: 'Een bottellijn: zes machines achter elkaar, met vuller, sluiter en etiketteerder.', en: 'A bottling line: six machines in a row, with a filler, a capper and a labeller.', cues: [], still: 0.12 },
        { nl: 'Elke machine boven {n:90}%, maar de lijn haalt een {t:OEE|OEE} van {n:58}%.', en: 'Every machine above {n:90}%, but the line reaches an {t:OEE|OEE} of {n:58}%.', cue: { OEE: 'oee' }, still: 0.4 },
        { nl: 'Een {t:Microstop|microstop}: seconden tot minuten stil, snel gereset, zelden opgeschreven.', en: 'A {t:Micro-stop|micro-stop}: seconds to minutes stopped, quickly reset, rarely written down.', cue: { Microstop: 'lab' }, still: 0.66 },
        { nl: 'Het team wil de vuller vervangen: op papier de langzaamste. Terecht?', en: 'The team wants to replace the filler: the slowest on paper. Rightly?', cues: [], still: 0.92 },
      ],
    },
    {
      id: 's7', lesson: OEE, level: 3, dur: DUR[6], still: 0.7, title: { nl: 'De verborgen bottleneck', en: 'The hidden bottleneck' },
      beats: [
        { nl: '{t:Machinestatussen|Machinestatussen}: draaien, storing, starved of blocked.', en: '{t:Machine states|Machine states}: running, faulted, starved or blocked.', cue: { Machinestatussen: 'states' }, still: 0.15 },
        { nl: 'Vuller {n:71}% draaien, {n:22}% blocked. Sluiter {n:68}%, {n:25}% blocked. Etiketteerder {n:74}%.', en: 'Filler {n:71}% running, {n:22}% blocked. Capper {n:68}%, {n:25}% blocked. Labeller {n:74}%.', cues: ['states'], still: 0.4 },
        { nl: 'De etiketteerder wacht bijna nooit: de {t:Verborgen bottleneck|verborgen bottleneck}.', en: 'The labeller hardly ever waits: the {t:Hidden bottleneck|hidden bottleneck}.', cue: { 'Verborgen bottleneck': 'lab' }, still: 0.65 },
        { nl: '{n:40} stops per uur, de meeste korter dan een minuut: daar zit het verlies.', en: '{n:40} stops an hour, most under a minute: that is where the loss is.', cues: ['lab'], still: 0.92 },
      ],
    },
    {
      id: 's8', lesson: STOP, level: 4, dur: DUR[7], still: 0.7, title: { nl: 'De alarmlog', en: 'The alarm log' },
      beats: [
        { nl: 'De {t:Alarmlog|alarmlog}: tijd, code, tekst en duur van elk alarm.', en: 'The {t:Alarm log|alarm log}: time, code, text and duration of every alarm.', cue: { Alarmlog: 'log' }, still: 0.15 },
        { nl: 'Eén vastloper geeft een keten van alarmen. Welke kwam eerst?', en: 'One jam gives a chain of alarms. Which came first?', cues: ['log'], still: 0.38 },
        { nl: 'Het {t:First-out alarm|first-out alarm} is het eerste in de keten: meestal de oorzaak.', en: 'The {t:First-out alarm|first-out alarm} is the first in the chain: usually the cause.', cue: { 'First-out alarm': 'first' }, still: 0.62 },
        { nl: 'Eén week: niet aanwezig {n:1200} keer, servo {n:6} keer, deur {n:300} keer.', en: 'One week: part missing {n:1200} times, servo {n:6} times, door {n:300} times.', cues: ['log'], still: 0.9 },
      ],
    },
    {
      id: 's9', lesson: STOP, level: 4, dur: DUR[8], still: 0.6, title: { nl: 'Van Pareto naar actie', en: 'From Pareto to action' },
      beats: [
        { nl: '{t:Paretodiagram|Paretodiagram} op aantal: ‘onderdeel niet aanwezig’ wint ruim.', en: '{t:Pareto chart|Pareto chart} by count: ‘part missing’ wins by far.', cue: { Paretodiagram: 'pareto' }, still: 0.15 },
        { nl: 'Op verloren minuten ook: {n:400}, tegen {n:150} en {n:150}.', en: 'By lost minutes too: {n:400}, against {n:150} and {n:150}.', cues: ['pareto'], read: { nl: '{n:1200} × {n:20} s = {n:400} min', en: '{n:1200} × {n:20} s = {n:400} min' }, still: 0.42 },
        { nl: 'Eerst de toevoer; de deur verdwijnt misschien mee. De servo gaat naar onderhoud.', en: 'The feeder first; the door may go with it. The servo goes to maintenance.', cues: ['pareto'], still: 0.66 },
        { nl: 'Een {t:MES|MES} koppelt alarmen aan order en dienst. Elke ochtend: de top drie.', en: 'An {t:MES|MES} links alarms to order and shift. Every morning: the top three.', cue: { MES: 'mes' }, still: 0.92 },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. Level 1 is a broad "how it works" of one station.
// No "/" or "&" in the spoken text; I/O, OEE, MES and HMI are said as letters, starved, blocked
// and paretodiagram in a Dutch spelling (films/_kit/timeline.mjs, SAY). Standard numbers stay in the captions only.
const SAY = [
  [ // s1 eyes, brain, hands
    { nl: 'Een machine werkt als een mens: met ogen, een brein en handen. De ogen zijn {t:Sensor|sensoren}: ligt er een onderdeel, is de klem dicht, is de druk bereikt?',
      en: 'A machine works like a person: with eyes, a brain and hands. The eyes are {t:Sensor|sensors}: is there a part, is the clamp closed, is the pressure reached?' },
    { nl: 'Het brein is de PLC, een kleine industriële computer in de kast die beslist wat er daarna gebeurt.',
      en: 'The brain is the PLC, the programmable logic controller: a small industrial computer in the cabinet that decides what happens next.' },
    { nl: 'De handen zijn {t:Actuator|actuatoren}: ze laten iets bewegen, zoals een motor, een ventiel of de luchtcilinder die de klem dichtduwt.',
      en: 'The hands are {t:Actuator|actuators}: they make something move, like a motor, a valve or the air cylinder that pushes the clamp shut.' },
    { nl: 'Sensoren zitten op ingangen van de PLC, actuatoren op uitgangen: samen de {t:I/O|I/O}. De meeste zijn aan of uit, meestal op {n:24} volt.',
      en: 'Sensors sit on inputs of the PLC, actuators on outputs: together the {t:I/O|I/O}. Most are on or off, usually at {n:24} volts.' },
  ],
  [ // s2 the scan cycle
    { nl: 'De PLC werkt in rondes, de {t:Scancyclus|scancyclus}: ingangen lezen, het programma van boven naar beneden doorlopen, uitgangen schrijven, en opnieuw.',
      en: 'The PLC works in rounds, the {t:Scan cycle|scan cycle}: read the inputs, run the program from top to bottom, write the outputs, and again.' },
    { nl: 'Eén ronde duurt meestal een paar tot tientallen milliseconden. Bij {n:10} milliseconden leest de PLC elke ingang {n:100} keer per seconde.',
      en: 'One round usually takes a few to a few tens of milliseconds. At {n:10} milliseconds, the PLC reads every input {n:100} times a second.' },
    { nl: 'Het programma staat vaak in een {t:Ladderdiagram|ladderdiagram}, een schema met sporten: links de voorwaarden, rechts wat er moet gebeuren.',
      en: 'The program is often written as a {t:Ladder diagram|ladder diagram}, a drawing with rungs: the conditions on the left, what should happen on the right.' },
    { nl: 'Op deze sport: ligt er een onderdeel en drukt niemand op stop? Dan gaat de uitgang klem sluiten aan.',
      en: 'On this rung: is there a part, and is nobody pressing stop? Then the output close clamp switches on.' },
  ],
  [ // s3 step 3
    { nl: 'De operator praat met de machine via de {t:HMI|HMI}. Dat is het scherm met status, alarmen en recepten.',
      en: 'The operator talks to the machine through the {t:HMI|HMI}, the human-machine interface: the screen with the status, alarms and recipes.' },
    { nl: 'Het programma loopt in stappen: wachten op onderdeel, klemmen, checken, persen, loslaten. Elke stap wacht op zijn voorwaarde; een interlock werkt net zo.',
      en: 'The program runs in steps: wait for a part, clamp, check, press, release. Each step waits for its condition; an interlock works the same way.' },
    { nl: 'Nu valt het station stil. Op de HMI staat: stap {n:3}, wacht op klem dicht. De PLC is niet traag; hij wacht.',
      en: 'Now the station stops. The HMI says: step {n:3}, waiting for clamp closed. The PLC is not slow; it is waiting.' },
    { nl: 'Kijk dus naar de klem. Dicht? Dan ligt het aan de sensor: verschoven, vuil of een kapotte kabel. Open? Dan de lucht of het ventiel.',
      en: 'So look at the clamp. Closed? Then it is the sensor: shifted, dirty or a broken cable. Open? Then the air or the valve.' },
  ],
  [ // s4 the emergency stop
    { nl: 'De {t:Noodstop|noodstop}, rood op geel, stopt de machine: meteen de energie eraf, of eerst afremmen en dan de energie eraf.',
      en: 'The {t:Emergency stop|emergency stop}, red on yellow, stops the machine: the power off at once, or braking first and then the power off.' },
    { nl: 'Hij hangt niet aan de gewone PLC, maar via twee draden aan een veiligheidsrelais dat twee magneetschakelaars laat afvallen: een {t:Veiligheidsfunctie|veiligheidsfunctie}.',
      en: 'It is not wired to the ordinary PLC but with two wires to a safety relay, which drops out two contactors: a {t:Safety function|safety function}.' },
    { nl: 'Breekt er een draad, dan valt het relais ook af: een fout maakt de machine stil, niet gevaarlijk.',
      en: 'If a wire breaks, the relay drops out too: a fault makes the machine stop, not dangerous.' },
    { nl: 'Hij blijft ingedrukt staan, en knop eruit start niets: eerst bewust resetten, dan starten. Een noodstop vervangt nooit de afscherming.',
      en: 'It stays pressed in, and pulling it out starts nothing: first a deliberate reset, then start. An emergency stop never replaces the guarding.' },
  ],
  [ // s5 how reliable
    { nl: 'Hoe betrouwbaar moet zo’n functie zijn? Een operator opent de deur van een robotcel zo’n {n:10} keer per uur. Deur open, robot stopt.',
      en: 'How reliable does such a function have to be? An operator opens the door of a robot cell about {n:10} times an hour. Door open, robot stops.' },
    { nl: 'Dat is het {t:Performance level|performance level}, van PL a tot PL e. De risicobeoordeling vraagt: hoe ernstig, hoe vaak, en kun je nog wegkomen?',
      en: 'That is the {t:Performance level|performance level}, from PL a to PL e. The risk assessment asks: how severe, how often, and can you still get away?' },
    { nl: 'Ernstig letsel; tien keer per uur lezen wij als vaak; de robot is hier traag, dus wegkomen kan. Dat geeft PL d. Een snelle robot: PL e.',
      en: 'Severe injury; we read ten times an hour as frequent; the robot is slow here, so getting away is possible. That gives PL d. A fast robot: PL e.' },
    { nl: 'Met de {t:CE-markering|CE-markering} verklaart de maker dat de machine aan de regels voldoet. Vanaf 20 januari 2027 vervangt de {t:Machineverordening|Machineverordening} de Machinerichtlijn.',
      en: 'With the {t:CE marking|CE marking} the maker declares that the machine meets the rules. From 20 January 2027 the {t:Machinery Regulation|Machinery Regulation} replaces the Machinery Directive.' },
  ],
  [ // s6 six machines
    { nl: 'Nu een bottellijn: zes machines achter elkaar, met de vuller, de sluiter en de etiketteerder.',
      en: 'Now a bottling line: six machines in a row, with the filler, the capper and the labeller.' },
    { nl: '{t:OEE|OEE} is beschikbaarheid maal prestatie maal kwaliteit. Elke machine meldt boven {n:90} procent beschikbaarheid, maar de lijn-OEE is {n:58} procent.',
      en: '{t:OEE|OEE} is availability times performance times quality. Every machine reports above {n:90} percent availability, but the line OEE is {n:58} percent.' },
    { nl: 'Het verborgen verlies: de {t:Microstop|microstop}, seconden tot minuten stil, snel gereset en bijna nooit opgeschreven.',
      en: 'The hidden loss: the {t:Micro-stop|micro-stop}, seconds to minutes stopped, quickly reset and hardly ever written down.' },
    { nl: 'Het team wil de vuller vervangen, op papier de langzaamste. Terecht?',
      en: 'The team wants to replace the filler, the slowest on paper. Rightly?' },
  ],
  [ // s7 the hidden bottleneck
    { nl: 'Elke PLC logt zijn {t:Machinestatussen|machinestatussen}: draaien, storing, starved, wachten op aanvoer, of blocked, niet kwijt kunnen.',
      en: 'Every PLC logs its {t:Machine states|machine states}: running, faulted, starved, waiting for supply, or blocked, unable to pass on.' },
    { nl: 'De vuller draait {n:71} procent, {n:22} procent blocked. De sluiter {n:68} procent, {n:25} procent blocked. De etiketteerder draait {n:74} procent, {n:23} procent in storing.',
      en: 'The filler runs {n:71} percent, {n:22} percent blocked. The capper {n:68} percent, {n:25} percent blocked. The labeller runs {n:74} percent, {n:23} percent faulted.' },
    { nl: 'De etiketteerder wacht bijna nooit: hij is de {t:Verborgen bottleneck|verborgen bottleneck}. Een nieuwe vuller staat alleen vaker blocked.',
      en: 'The labeller hardly ever waits: it is the {t:Hidden bottleneck|hidden bottleneck}. A new filler would just be blocked more often.' },
    { nl: 'Hij logt zo’n {n:40} stops per uur. Pak die microstops aan, en kijk daarna opnieuw: de bottleneck kan verschuiven.',
      en: 'It logs about {n:40} stops an hour. Tackle those micro-stops, then look again: the bottleneck may move.' },
  ],
  [ // s8 the alarm log
    { nl: 'Terug naar het persstation. Elke stop staat in de {t:Alarmlog|alarmlog}: tijd, alarmcode, tekst en duur.',
      en: 'Back to the press station. Every stop is in the {t:Alarm log|alarm log}: time, alarm code, text and duration.' },
    { nl: 'Maar één vastloper geeft een hele keten alarmen.',
      en: 'But one jam gives a whole chain of alarms.' },
    { nl: 'Het {t:First-out alarm|first-out alarm} is het eerste in die keten, meestal de oorzaak. Zonder first-out jagen mensen op symptomen, zoals deur open.',
      en: 'The {t:First-out alarm|first-out alarm} is the first in that chain, usually the cause. Without the first-out, people chase symptoms, such as door open.' },
    { nl: 'Een week van {n:10} diensten: onderdeel niet aanwezig {n:1200} keer, servostoring {n:6} keer, deur geopend {n:300} keer.',
      en: 'A week of {n:10} shifts: part missing {n:1200} times, servo fault {n:6} times, door opened {n:300} times.' },
  ],
  [ // s9 Pareto and MES
    { nl: 'Zet ze in een {t:Paretodiagram|paretodiagram}, van groot naar klein, en maak hem twee keer. Op aantal wint onderdeel niet aanwezig ruim.',
      en: 'Put them in a {t:Pareto chart|Pareto chart}, from largest to smallest, and make it twice. By count, part missing wins by far.' },
    { nl: 'Op minuten: {n:1200} keer {n:20} seconden is {n:400} minuten; servostoring en deur geopend elk {n:150}. Ook hier staat hij bovenaan.',
      en: 'By minutes: {n:1200} times {n:20} seconds is {n:400} minutes; servo fault and door opened {n:150} each. It is on top here too.' },
    { nl: 'Check de first-out en kijk naar de toevoer. De deur gaat vermoedelijk open om die onderdelen los te halen. De servo gaat naar onderhoud.',
      en: 'Check the first-out and look at the feeder. The door probably opens to free those parts. The servo goes to maintenance.' },
    { nl: 'Een {t:MES|MES}, software boven de machines, koppelt statussen en alarmen aan order, dienst en reden. Bespreek elke ochtend de top drie aan de lijn.',
      en: 'An {t:MES|MES}, a manufacturing execution system, links states and alarms to order, shift and reason. Go over the top three at the line every morning.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// ---------------------------------------------------------------- page script and styles
// The page needs the code only: the lathe module and the stage go in without
// their indentation, and without whole-line comments.
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const latheSource = lean(readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, ''));
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, pointOf, radialOf, solidOf, prismOf, disc, sphereOf, arcOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.lc-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.lc-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.lc-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6}
.lc-glass{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6}
.lc-hole{fill:var(--anatomy-shade-0);stroke:none}
.lc-led{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.lc-led[data-on]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.lc-flag{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.lc-flag[data-on]{fill:var(--anatomy-hi)}
.lc-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.lc-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.lc-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.lc-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:500}
.lc-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.lc-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.lc-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.lc-dim{fill:none;stroke:var(--anatomy-lo);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.lc-acc{fill:var(--fp-accent);stroke:none}
.lc-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.lc-row{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-shade-0));stroke:var(--fp-accent);stroke-width:1.4}
.lc-lamp{fill:var(--fp-accent)}
.lc-s0{fill:var(--anatomy-hi)}
.lc-s1{fill:var(--fp-accent)}
.lc-s2{fill:var(--anatomy-mid)}
.lc-s3{fill:var(--anatomy-lo)}
.lc-s4{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:1}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
.lc-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.lc-inv0{fill:var(--anatomy-shade-0);font-family:var(--anatomy-mono);font-weight:700}
.lc-inv1{fill:var(--fp-on-accent);font-family:var(--anatomy-mono);font-weight:700}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
[data-cue][data-on] .lc-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .lc-big{fill:var(--fp-accent-text)}
`;

const label = {
  nl: 'Drie plekken naast elkaar. Een persstation: een besturingskast zonder deur met een voeding, de PLC, een ingangskaart en een uitgangskaart met lampjes, een veiligheidsrelais met twee magneetschakelaars en een signaalzuil; een werkbank met een mal en een onderdeel, een aanwezigheidssensor, een klemcilinder met een sensor, een pers en twee ventielen; een bedienpaneel met een HMI-scherm, een noodstop, een startknop en een resetknop. Een robotcel achter een hek met een deur en een deurschakelaar. Een bottellijn met zes machines op één transportband. Grafieken tonen de scancyclus, een ladderdiagram, het HMI-scherm, de risicograaf, de lijn-OEE, de machinestatussen, de alarmlog en een paretodiagram.',
  en: 'Three places side by side. A press station: a control cabinet with its door off holding a power supply, the PLC, an input card and an output card with lamps, a safety relay with two contactors and a signal tower; a bench with a fixture and a part, a presence sensor, a clamp cylinder with a sensor, a press and two valves; an operator panel with an HMI screen, an emergency stop, a start button and a reset button. A robot cell behind a fence with a door and a door switch. A bottling line with six machines on one conveyor. Charts show the scan cycle, a ladder diagram, the HMI screen, the risk graph, the line OEE, the machine states, the alarm log and a Pareto chart.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
