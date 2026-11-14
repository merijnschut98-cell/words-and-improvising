// Dev tool, not shipped. Builds the explainer film "Van sensor tot ERP / From
// sensor to ERP" for IT/OT op de fabrieksvloer: the levels topic (levels, level
// 1; purdue, level 2) and the stack topic (systems, level 1).
//
//   node films/eng.ot.isa95/build.mjs            build the page
//   node films/eng.ot.isa95/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.ot.isa95.html: one offline page with the
// anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9:
// levels 0–4 as floors of the plant → an order from ERP to MES to the PLC →
// machine data back up → where the IT/OT boundary and the DMZ sit.
//
// The plant is a stepped building, each step one level, back and up. On the
// ground (levels 0 and 1) an injection moulding machine: base, three platens on
// four tie bars, the two mould halves, the barrel with heater bands, a hopper and
// its drive, a stack light, its own HMI, a temperature sensor on the mould and a
// cooling-water valve, a bin of caps and a pallet of granulate. Level 2: the
// control cabinet with the PLC and its I/O cards, and the SCADA desk with three
// screens under a wall screen. Level 3: the MES terminal, the MES server rack,
// the quality PC and a small MES connector. A narrow ledge at 3.5 (the
// industrial DMZ: two firewalls and a relay, shown from the DMZ scene). Level 4:
// the planner's desk with the ERP laptop and a filing cabinet. Level 5 (the
// Purdue enterprise network, shown from the Purdue scene): two central racks, an
// internet mast and, apart, the cloud MES. A cable runs up the left side; orders
// travel down it and data comes back up. Panels (the timescale, the order card,
// master data, the report, the two maps) sit in stage space over the drawing.
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
// Asserted against the worked examples (the build fails if a value drifts);
// the {n:...} numbers are then checked against the Dutch lesson text by
// defineFilm. Facts, as in the lessons: ISA-95 = IEC 62264, part 1 in 2000
// (ANSI/ISA-95.00.01-2000), levels 0–4; its timescales (part 1): level 4
// months, weeks, days; level 3 days, shifts, hours, minutes, seconds. The Purdue
// Enterprise Reference Architecture (T. J. Williams, Purdue University, early
// 1990s); level 3.5, the industrial DMZ, was added later by practitioners;
// security slides usually draw levels 0–5. Zones and conduits as in IEC 62443
// (the cyber module); "OT puts availability and safety first" as in itbasics.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const LEVELS = [0, 1, 2, 3, 4];
assert(LEVELS.length === 5, 'five ISA-95 levels, 0 to 4');
// systems: 2.000 caps × 25 g = 50 kg; routing 12 s on machine 4; master data says 10 s; 1.960 good + 40 scrap
const ORDER = { qty: 2000, gram: 25, machine: 4, cycle: 12, master: 10, good: 1960, scrap: 40 };
assert((ORDER.qty * ORDER.gram) / 1000 === 50, '2.000 × 25 g = 50 kg');
assert(ORDER.good + ORDER.scrap === ORDER.qty, '1.960 good + 40 scrap = 2.000');
assert(ORDER.master < ORDER.cycle, 'master data 10 s, machine 12 s: every shift looks too slow');
// Facts written as plain text (not {n:} markers, which would format 2000 as 2.000 or 3.5 as 3,5):
// checked here against the Dutch lesson text.
const OT = (await import(pathToFileURL(join(HERE, '../../src/content/courses/eng/ot.nl.js')).href)).default.lessons;
const textOf = (id) => { const l = OT.find((x) => x.id === id); return [...l.teach, l.example.text].join('\n'); };
assert(textOf('eng.ot.levels').includes('IEC 62264') && textOf('eng.ot.levels').includes('verscheen in 2000'), 'ISA-95 is IEC 62264, first part 2000');
assert(textOf('eng.ot.purdue').includes('niveau 3.5') && textOf('eng.ot.purdue').includes('begin jaren negentig'), 'Purdue: early 1990s, DMZ at 3.5');
assert(textOf('eng.ot.purdue').includes('niveau 5 het bedrijfsnetwerk'), 'Purdue: level 5 the enterprise network');

// ---------------------------------------------------------------- the world
// x to the right, y toward the viewer, z up. The steps go back (-y) and up.
const W = 640;
const H = 400;
const X0 = -150;
const XW = 300;
const TIER = {
  t5: { y0: -252, y1: -200, z: 150 },
  t4: { y0: -200, y1: -140, z: 114 },
  td: { y0: -140, y1: -122, z: 96 },
  t3: { y0: -122, y1: -62, z: 78 },
  t2: { y0: -62, y1: -2, z: 42 },
  t0: { y0: -2, y1: 92, z: 6 },
};
const MB = { x: -132, y: 22, w: 150, d: 34 }; // machine base
const MZ = 34; // machine base top
const PL = { rear: -132, move: -104, a: -96, b: -82, fix: -68 }; // platen and mould x
const MOULD_OPEN = 8;
const BAR = { y: [27, 51], z: [42, 70], x0: -132, x1: -60 };
const BRL = { y: 39, z: 60, x0: -60, x1: 2, r: 4.6 };
const STACK = [-64, 32];
const SENS = [-89, 39];
const BIN = { x: -104, y: 62, w: 28, d: 20, r: 0.8 };
const CAB = { x: -132, y: -58, w: 40, d: 14 };
const DESK = { x: 4, y: -40, w: 78, d: 22 };
const KIOSK = [-62, -84];
const RACK = { x: 64, y: -114, w: 24, d: 22 };
const QPC = { x: -14, y: -104, w: 32, d: 16 };
const CONN = { x: 104, y: -86, w: 12, d: 9 };
const RELAY = { x: -12, y: -136, w: 22, d: 11 };
const ODESK = { x: -50, y: -186, w: 64, d: 26 };
const ERACK = [{ x: -82, y: -246, w: 22, d: 24 }, { x: -54, y: -246, w: 22, d: 24 }];
const CLOUD = { x: 96, y: -246, w: 26, d: 26 };
const MAST = [40, -232];
// the cable up the left side: machine → cabinet → MES → ledge → ERP desk (and on to level 5)
const ROUTE = [
  [-132, 36, 14], [-142, 36, 6.6], [-142, -2.6, 6.6], [-142, -2.6, 42.6], [-142, -50, 42.6], [-132, -50, 60],
  [-132, -50, 60], [-142, -50, 42.6], [-142, -62.6, 42.6], [-142, -62.6, 78.6], [-142, -84, 78.6], [-74, -84, 78.6],
  [-142, -84, 78.6], [-142, -122.6, 78.6], [-142, -122.6, 96.6], [-142, -140.6, 96.6], [-142, -140.6, 114.6], [-142, -174, 114.6], [-50, -174, 114.6],
];
const C = {
  TIER, X0, XW, MB, MZ, PL, MOULD_OPEN, STACK, SENS, BIN, CAB, DESK, KIOSK, RACK, QPC, CONN, RELAY, ODESK, ERACK, CLOUD, MAST, ORDER,
  // where a packet rides: the stops along the cable (indices into ROUTE)
  ROUTE, STOP: { machine: 0, plc: 5, mes: 11, erp: 18 },
};

const FIT = [[X0, 92, 0], [X0 + XW, 92, 0], [X0, -252, 200], [X0 + XW, -252, 200], [X0, 92, 40], [X0 + XW, -252, 150]];
const P = k.fitProjection(FIT, W, H, { pad: 8, azimuth: 40, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
// small parts get no bevel (it would not read at this scale, and it keeps the page under 300 kB)
const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 1) => S(k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, Math.min(plan.w, plan.d) < 10 ? 0 : bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 14) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), style);
const alongX = (y, z, x0, x1, r, style = {}, steps) => S(G.disc(x0, x1, r, G.frameOf([0, y, z], X, Y, Z), P, steps ? { steps } : {}), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf({ ...plan, r: Number.isFinite(plan.r) ? Math.max(0.5, plan.r) : 1 }, z, pad, P)}"/>`;
const screws = (plan, z, inset = 2.4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });
const faceY = (y, x0, x1, z0, z1) => k.pathOf([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]].map(at), true);
const card = (y, x0, x1, z0, z1, cls = 'ia-card') => `<path class="${cls}" d="${faceY(y, x0, x1, z0, z1)}"/>`;
const rules = (x0, y, z, lens, step = 2) => L(lens.map((len, i) => k.segment([x0, y, z - i * step], [x0 + len, y, z - i * step], P)).join(''), { tone: 'lo', free: true });
const led = (key, p, r = 0.8) => { const [x, y] = at(p); return `<circle class="ia-led" data-led="${key}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * G.scaleOf(P)).toFixed(2)}"/>`; };
const wire = (pts, tone = 'lo', size = 0.9) => k.wireSvg(at(pts[0]), at(pts[pts.length - 1]), { via: pts.slice(1, -1).map(at), tone, size, ends: 'both' });

// ---------------------------------------------------------------- the steps
// Each step is a block from the floor to its top, with a seam under the lip,
// joints on the riser and a groove round its top.
function tier(t, tone = 'lo') {
  const plan = { x: X0, y: t.y0, w: XW, d: t.y1 - t.y0, r: 1 };
  const joints = [];
  for (let x = X0 + 60; x < X0 + XW - 10; x += 60) joints.push(k.segment([x, t.y1, 2], [x, t.y1, t.z - 4], P));
  return halo(k.insetPlan(plan, -3), 0, 2)
    + box(plan, 0, t.z, { tone, inner: seam(plan, t.z - 3, 2) + L(joints.join(''), { tone: 'faint' }) }, 0.6, 1)
    + L(k.planOutline(k.insetPlan(plan, 4), t.z, P, 2), { tone: 'faint' });
}

// ---------------------------------------------------------------- ground: the moulding machine (levels 0 and 1)
const T0 = TIER.t0.z;
const mBase = halo(k.insetPlan(MB, -3), T0, 2)
  + [[-128, 25], [-128, 53], [14, 25], [14, 53]].map(([x, y]) => post(x, y, 2, T0, T0 + 3, { tone: 'lo' }, 12)).join('')
  + box(MB, T0 + 3, MZ, { tone: 'lo', inner: seam(MB, MZ - 4, 2) + seam(MB, T0 + 8, 2) }, 0.6, 2)
  + card(MB.y + MB.d, -40, -6, T0 + 10, MZ - 8, 'ia-hole') + rules(-36, MB.y + MB.d, MZ - 10, [14, 10, 12], 2.4)
  + screws(MB, MZ, 2);
const platen = (x, w, y0, y1, z0, z1, tone = 'mid') => box({ x, y: y0, w, d: y1 - y0, r: 0.6 }, z0, z1, { tone, crease: 'lo', inner: seam({ x, y: y0, w, d: y1 - y0 }, z1 - 3, 1.4) }, 0.4, 1)
  + Dt([[x + w / 2, y1, z0 + 3], [x + w / 2, y1, z1 - 3]].map(at), { size: 0.4 });
const barsBack = BAR.z.map((z) => alongX(BAR.y[0], z, BAR.x0, BAR.x1, 1.8, { tone: 'hi', crease: 'none' }, 14)).join('');
const barsFront = BAR.z.map((z) => alongX(BAR.y[1], z, BAR.x0, BAR.x1, 1.8, { tone: 'hi', crease: 'none' }, 14)).join('');
const rearPlaten = platen(PL.rear, 8, 23, 55, MZ, 76, 'mid');
const fixedPlaten = platen(PL.fix, 8, 21, 57, MZ, 78, 'mid');
// the moving platen and mould half A slide together (MOULD_OPEN along -x)
const moving = platen(PL.move, 8, 23, 55, MZ + 2, 76)
  + box({ x: PL.a, y: 28, w: PL.b - PL.a, d: 22, r: 0.5 }, 44, 68, { tone: 'hi', crease: 'lo', inner: seam({ x: PL.a, y: 28, w: PL.b - PL.a, d: 22 }, 56, 1.2) }, 0.3, 1)
  + alongX(39, 56, PL.rear + 8, PL.move, 2.6, { tone: 'hi', crease: 'none' }, 14); // the clamp ram
const mouldB = box({ x: PL.b, y: 28, w: PL.fix - PL.b, d: 22, r: 0.5 }, 44, 68, { tone: 'hi', crease: 'lo', inner: seam({ x: PL.b, y: 28, w: PL.fix - PL.b, d: 22 }, 56, 1.2) }, 0.3, 1)
  + L([0, 1].map((i) => k.ring(PL.b + 6 + i * 6, 39, 1.6, 68, P, 12)).join(''), { tone: 'lo' });
// the cooling water: a pipe along the front of mould half B, the valve on the base in front
const cooling = alongX(52, 50, PL.b + 1, PL.fix - 1, 1.1, { tone: 'lo', crease: 'none' }, 10);
const VALVE = [-74, 60];
const valve = box({ x: VALVE[0] - 4, y: VALVE[1] - 3, w: 8, d: 6, r: 0.5 }, MZ, MZ + 6, { tone: 'hi', crease: 'lo' }, 0.3, 1)
  + post(VALVE[0], VALVE[1], 0.8, MZ + 6, MZ + 10, {}, 10)
  + S(k.cylinder(VALVE[0], VALVE[1], 3.4, MZ + 10, 1, P, 20, 0.3), { tone: 'mid', crease: 'lo' })
  + Dt([at([VALVE[0], VALVE[1], MZ + 11])], { size: 0.4 });
const valveHose = wire([[VALVE[0], VALVE[1] - 3, MZ + 3], [VALVE[0], 53, MZ + 3], [VALVE[0], 53, 50]], 'mid', 0.8);
const sensor = post(SENS[0], SENS[1], 1.3, 68, 73, { tone: 'hi', crease: 'lo' }, 12) + post(SENS[0], SENS[1], 2, 73, 75, {}, 12)
  + wire([[SENS[0], SENS[1], 75], [SENS[0] - 6, SENS[1] - 6, 82], [PL.rear + 4, 30, 82], [PL.rear + 2, 30, 76]], 'lo', 0.7);
// the injection unit: barrel with heater bands, hopper, drive
const barrel = alongX(BRL.y, BRL.z, BRL.x0, BRL.x1, BRL.r, { tone: 'hi', crease: 'lo' }, 18)
  + [-48, -34, -20].map((x) => alongX(BRL.y, BRL.z, x, x + 6, BRL.r + 1, {}, 14)).join('')
  + alongX(BRL.y, BRL.z, -64, -60, 2.4, {}, 14);
const barrelSupport = box({ x: -10, y: 33, w: 10, d: 12, r: 0.4 }, MZ, BRL.z - BRL.r + 0.5, { tone: 'lo' }, 0.2, 1);
const hopper = post(-10, BRL.y, 2.4, BRL.z + BRL.r - 0.5, BRL.z + 10, {}, 14)
  + S(k.extrude(k.circleRing(-10, BRL.y, 4, 14), BRL.z + 10, 4, P), { tone: 'mid', crease: 'lo' })
  + post(-10, BRL.y, 7, BRL.z + 14, BRL.z + 26, { tone: 'mid', crease: 'lo', inner: L(k.sideArc(-10, BRL.y, 7, BRL.z + 22, P, 16), { tone: 'faint' }) }, 16)
  + S(k.cylinder(-10, BRL.y, 7.4, BRL.z + 26, 1.4, P, 16, 0.4), { tone: 'hi', crease: 'lo' });
const drive = box({ x: 2, y: 28, w: 16, d: 22, r: 0.8 }, MZ, 70, { inner: seam({ x: 2, y: 28, w: 16, d: 22 }, 64, 1.6) }, 0.4, 1)
  + `<path class="ia-hole" d="${[0, 1, 2, 3].map((i) => faceY(50, 4 + i * 3.4, 6 + i * 3.4, MZ + 6, MZ + 18)).join('')}"/>`
  + screws({ x: 2, y: 28, w: 16, d: 22 }, 70, 1.6);
// stack light on the fixed platen: three segments (run, wait, stop)
const stackBase = post(STACK[0], STACK[1], 2.4, 78, 80, { tone: 'lo' }, 14);
const stackSeg = (i) => post(STACK[0], STACK[1], 2, 80 + i * 3.6, 83.6 + i * 3.6, { crease: 'lo' }, 14);
const stackCap = post(STACK[0], STACK[1], 2.2, 90.8, 91.8, {}, 14);
// the machine's own HMI on a swing arm at the front
const HMI_Y = 61;
const hmi = post(-30, 58, 1.2, MZ, 50, {}, 10)
  + box({ x: -42, y: HMI_Y - 3, w: 24, d: 3, r: 0.4 }, 50, 66, {}, 0.3, 1)
  + card(HMI_Y, -40.5, -19.5, 52, 64.5, 'ia-screen') + g('hmiTxt', '');
// the bin of caps under the mould, and a pallet of granulate bags
const bin = box(BIN, T0, T0 + 14, { tone: 'lo', inner: seam(BIN, T0 + 11, 1.4) }, 0.4, 1)
  + box(k.insetPlan(BIN, 1.6), T0 + 13, T0 + 14, { tone: 'mid', crease: 'none' }, 0, 1);
const caps = (() => {
  const pts = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) pts.push([BIN.x + 6 + i * 8 + (j % 2) * 3, BIN.y + 6 + j * 7]);
  pts.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P));
  return pts.map(([x, y]) => post(x, y, 2, T0 + 14, T0 + 16, { tone: 'hi', crease: 'lo' }, 9)).join('');
})();
const chute = box({ x: -92, y: 52, w: 10, d: 12, r: 0.3 }, T0 + 20, T0 + 22, { tone: 'mid' }, 0, 1);
const PAL = { x: 60, y: 24, w: 56, d: 46 };
const pallet = [0, 1, 2].map((i) => box({ x: PAL.x, y: PAL.y + 2 + i * 18, w: PAL.w, d: 6, r: 0.2 }, T0, T0 + 4, { tone: 'lo' }, 0, 1)).join('')
  + box(PAL, T0 + 4, T0 + 6, { tone: 'lo', crease: 'none' }, 0, 1);
const bags = [[64, 28], [90, 28], [64, 48], [90, 48]].map(([x, y], i) => box({ x, y, w: 22, d: 18, r: 3 }, T0 + 6 + (i > 1 ? 0 : 0), T0 + 16, { tone: 'mid', inner: seam({ x, y, w: 22, d: 18 }, T0 + 12, 2) }, 1, 2)).reverse();
const bagsTop = box({ x: 76, y: 38, w: 22, d: 18, r: 3 }, T0 + 16, T0 + 26, { tone: 'hi', crease: 'lo', inner: seam({ x: 76, y: 38, w: 22, d: 18 }, T0 + 22, 2) }, 1, 2);

// ---------------------------------------------------------------- level 2: cabinet with the PLC, SCADA desk
const T2 = TIER.t2.z;
const CF = CAB.y + CAB.d; // the cabinet's open front
const cabinet = halo(k.insetPlan(CAB, -2), T2, 1.6)
  + box(CAB, T2, T2 + 64, { tone: 'lo' }, 0.4, 1)
  + box({ x: CAB.x - 0.8, y: CAB.y - 0.8, w: CAB.w + 1.6, d: CAB.d + 1.6, r: 0.4 }, T2 + 64, T2 + 67, {}, 0.3, 1)
  + card(CF, CAB.x + 2, CAB.x + CAB.w - 2, T2 + 4, T2 + 62, 'ia-hole')
  + [T2 + 50, T2 + 32, T2 + 14].map((z) => box({ x: CAB.x + 3, y: CF - 2, w: CAB.w - 6, d: 1.4, r: 0.1 }, z - 1.4, z + 1.4, { crease: 'none' }, 0, 1)).join('');
const plcCpu = box({ x: CAB.x + 4, y: CF - 2, w: 10, d: 4, r: 0.3 }, T2 + 42, T2 + 58, { tone: 'hi', crease: 'lo' }, 0.2, 1)
  + card(CF + 2, CAB.x + 5.4, CAB.x + 12.6, T2 + 50, T2 + 56.4) + led('run', [CAB.x + 6.6, CF + 2, T2 + 46]) + led('err', [CAB.x + 9.6, CF + 2, T2 + 46]);
const ioCards = [0, 1, 2].map((i) => {
  const x = CAB.x + 15.6 + i * 6.4;
  return box({ x, y: CF - 2, w: 5.4, d: 4, r: 0.3 }, T2 + 42, T2 + 58, {}, 0.2, 1)
    + [0, 1, 2, 3].map((j) => led(`io${i}${j}`, [x + 1.6, CF + 2, T2 + 55 - j * 3], 0.6)).join('');
}).join('');
const relays = [0, 1, 2, 3].map((i) => box({ x: CAB.x + 4 + i * 8.2, y: CF - 2, w: 5.4, d: 4, r: 0.3 }, T2 + 24, T2 + 38, {}, 0.2, 1)
  + Dt([at([CAB.x + 6.7 + i * 8.2, CF + 2, T2 + 35])], { size: 0.38 })).join('');
const terminals = Array.from({ length: 6 }, (_, i) => box({ x: CAB.x + 4 + i * 5.4, y: CF - 2, w: 4.4, d: 3.4, r: 0.2 }, T2 + 8, T2 + 18, { tone: i % 3 === 0 ? 'hi' : 'mid', crease: 'lo' }, 0, 1)).join('');
const SCR_Y = DESK.y + 4;
const deskLegs = [[DESK.x + 3, DESK.y + 3], [DESK.x + DESK.w - 3, DESK.y + 3], [DESK.x + 3, DESK.y + DESK.d - 3], [DESK.x + DESK.w - 3, DESK.y + DESK.d - 3]];
const scadaWall = post(DESK.x + 20, -58, 1.4, T2, T2 + 44, {}, 10) + post(DESK.x + DESK.w - 20, -58, 1.4, T2, T2 + 44, {}, 10)
  + box({ x: DESK.x + 4, y: -58, w: DESK.w - 8, d: 3, r: 0.4 }, T2 + 40, T2 + 62, {}, 0.3, 1) + card(-55, DESK.x + 6, DESK.x + DESK.w - 6, T2 + 42, T2 + 60, 'ia-screen') + g('wallTxt', '');
const deskBack = deskLegs.slice(0, 2).map(([x, y]) => post(x, y, 1.2, T2, T2 + 20, { tone: 'lo' }, 10)).join('');
const deskTop = box(DESK, T2 + 20, T2 + 23, {}, 0.4, 1) + deskLegs.slice(2).map(([x, y]) => post(x, y, 1.2, T2, T2 + 20, { tone: 'lo' }, 10)).join('');
const monitors = [0, 1, 2].map((i) => {
  const x = DESK.x + 6 + i * 23.4;
  return post(x + 9, SCR_Y + 2, 2.6, T2 + 23, T2 + 24, { tone: 'lo' }, 10) + post(x + 9, SCR_Y + 2, 0.8, T2 + 24, T2 + 28, {}, 8)
    + box({ x, y: SCR_Y, w: 18, d: 2.4, r: 0.3 }, T2 + 28, T2 + 40, {}, 0.2, 1) + card(SCR_Y + 2.4, x + 1.2, x + 16.8, T2 + 29.2, T2 + 38.8, 'ia-screen');
}).join('') + g('scadaTxt', '');
const keyboard = box({ x: DESK.x + 26, y: DESK.y + 12, w: 22, d: 6, r: 0.4 }, T2 + 23, T2 + 24, { tone: 'lo', crease: 'none' }, 0, 1)
  + Dt(k.dotGrid(DESK.x + 28, DESK.y + 13.6, 10, 2, 2, T2 + 24, P), { size: 0.3, tone: 'lo' });

// ---------------------------------------------------------------- level 3: MES terminal, rack, quality PC, connector
const T3 = TIER.t3.z;
const kiosk = post(KIOSK[0], KIOSK[1], 5, T3, T3 + 2, { tone: 'lo' }, 18) + box({ x: KIOSK[0] - 2, y: KIOSK[1] - 2, w: 4, d: 4, r: 0.4 }, T3 + 2, T3 + 22, {}, 0.2, 1)
  + box({ x: KIOSK[0] - 13, y: KIOSK[1] + 1, w: 26, d: 3, r: 0.4 }, T3 + 22, T3 + 40, {}, 0.3, 1) + card(KIOSK[1] + 4, KIOSK[0] - 11.5, KIOSK[0] + 11.5, T3 + 23.5, T3 + 38.5, 'ia-screen') + g('kioskTxt', '');
const rack = box(RACK, T3, T3 + 52, { tone: 'lo', inner: seam(RACK, T3 + 48, 1.6) }, 0.4, 1)
  + Array.from({ length: 6 }, (_, i) => {
    const z = T3 + 6 + i * 7.2;
    return box({ x: RACK.x + 2, y: RACK.y + RACK.d - 1, w: RACK.w - 4, d: 1.4, r: 0.1 }, z, z + 6, { tone: i % 3 === 0 ? 'hi' : 'mid', crease: 'lo' }, 0, 1)
      + led(`r${i}`, [RACK.x + RACK.w - 4, RACK.y + RACK.d + 0.4, z + 3], 0.55);
  }).join('') + screws(RACK, T3 + 52, 1.6);
const qpc = box({ x: QPC.x + 2, y: QPC.y + 2, w: 2, d: 2, r: 0.2 }, T3, T3 + 16, { tone: 'lo' }, 0, 1) + box({ x: QPC.x + QPC.w - 4, y: QPC.y + 2, w: 2, d: 2, r: 0.2 }, T3, T3 + 16, { tone: 'lo' }, 0, 1)
  + box(QPC, T3 + 16, T3 + 18, {}, 0.3, 1)
  + box({ x: QPC.x + 7, y: QPC.y + 2, w: 18, d: 2, r: 0.3 }, T3 + 20, T3 + 31, {}, 0.2, 1) + post(QPC.x + 16, QPC.y + 3, 0.7, T3 + 18, T3 + 20, {}, 8)
  + card(QPC.y + 4, QPC.x + 8, QPC.x + 24, T3 + 21, T3 + 30, 'ia-screen') + rules(QPC.x + 10, QPC.y + 4, T3 + 28, [9, 6, 11], 2.4)
  + box({ x: QPC.x + 8, y: QPC.y + 9, w: 16, d: 4, r: 0.3 }, T3 + 18, T3 + 19, { tone: 'lo', crease: 'none' }, 0, 1);
const conn = box(CONN, T3, T3 + 8, { tone: 'hi', crease: 'lo' }, 0.3, 1) + led('conn', [CONN.x + 3, CONN.y + CONN.d, T3 + 5], 0.6)
  + rules(CONN.x + 5, CONN.y + CONN.d, T3 + 6, [5, 4], 1.8)
  + wire([[CONN.x, CONN.y + 4, T3 + 4], [RACK.x + RACK.w + 1, CONN.y + 4, T3 + 0.4], [RACK.x + RACK.w, RACK.y + 10, T3 + 10]], 'lo', 0.7);

// ---------------------------------------------------------------- 3.5: the industrial DMZ (two firewalls and a relay)
const TD = TIER.td.z;
const fw = (x, y) => box({ x, y, w: 20, d: 6, r: 0.4 }, TD, TD + 7, { tone: 'mid', inner: seam({ x, y, w: 20, d: 6 }, TD + 4, 1) }, 0.3, 1)
  + [0, 1, 2, 3].map((i) => led(`fw${x}${i}`, [x + 4 + i * 3, y + 6, TD + 2.4], 0.5)).join('');
const dmz = fw(-70, -129) + box(RELAY, TD, TD + 13, { tone: 'hi', crease: 'lo', inner: seam(RELAY, TD + 10, 1.2) }, 0.3, 1)
  + rules(RELAY.x + 4, RELAY.y + RELAY.d, TD + 8, [10, 7], 2) + led('relay', [RELAY.x + 18, RELAY.y + RELAY.d, TD + 4], 0.7) + fw(36, -129);

// ---------------------------------------------------------------- level 4: the planner's desk with the ERP laptop
const T4 = TIER.t4.z;
const OL = [[ODESK.x + 3, ODESK.y + 3], [ODESK.x + ODESK.w - 3, ODESK.y + 3], [ODESK.x + 3, ODESK.y + ODESK.d - 3], [ODESK.x + ODESK.w - 3, ODESK.y + ODESK.d - 3]];
const officeBack = OL.slice(0, 2).map(([x, y]) => post(x, y, 1.2, T4, T4 + 20, { tone: 'lo' }, 10)).join('');
const officeTop = box(ODESK, T4 + 20, T4 + 23, {}, 0.4, 1) + OL.slice(2).map(([x, y]) => post(x, y, 1.2, T4, T4 + 20, { tone: 'lo' }, 10)).join('');
const LAP = { x: ODESK.x + 20, y: ODESK.y + 10, w: 22, d: 14 };
const laptop = box(LAP, T4 + 23, T4 + 24.4, { tone: 'mid', crease: 'lo' }, 0.2, 1)
  + Dt(k.dotGrid(LAP.x + 3, LAP.y + 5, 9, 3, 2, T4 + 24.4, P), { size: 0.3, tone: 'lo' })
  + box({ x: LAP.x, y: LAP.y - 1, w: LAP.w, d: 1.4, r: 0.2 }, T4 + 24.4, T4 + 38, {}, 0.2, 1)
  + card(LAP.y + 0.4, LAP.x + 1.4, LAP.x + LAP.w - 1.4, T4 + 25.6, T4 + 36.8, 'ia-screen') + g('erpTxt', '');
const papers = box({ x: ODESK.x + 4, y: ODESK.y + 6, w: 12, d: 16, r: 0.3 }, T4 + 23, T4 + 24, { tone: 'hi', crease: 'none' }, 0, 1)
  + rules(ODESK.x + 6, ODESK.y + 22, T4 + 24, [0], 1);
const FILE = { x: 30, y: -192, w: 20, d: 22 };
const filing = box(FILE, T4, T4 + 30, { tone: 'lo' }, 0.4, 1)
  + [0, 1, 2].map((i) => card(FILE.y + FILE.d, FILE.x + 2, FILE.x + FILE.w - 2, T4 + 2 + i * 9.4, T4 + 10 + i * 9.4, 'ia-card')
    + box({ x: FILE.x + 7, y: FILE.y + FILE.d, w: 6, d: 1, r: 0.2 }, T4 + 7 + i * 9.4, T4 + 8.2 + i * 9.4, { tone: 'hi', crease: 'none' }, 0, 1)).join('');

// ---------------------------------------------------------------- level 5: the enterprise network (Purdue), the cloud MES
const T5 = TIER.t5.z;
const eRack = (r, n) => box(r, T5, T5 + 46, { tone: 'lo', inner: seam(r, T5 + 42, 1.6) }, 0.4, 1)
  + card(r.y + r.d, r.x + 2, r.x + r.w - 2, T5 + 4, T5 + 40) + L(Array.from({ length: 6 }, (_, i) => k.segment([r.x + 2, r.y + r.d, T5 + 9.6 + i * 5.2], [r.x + r.w - 2, r.y + r.d, T5 + 9.6 + i * 5.2], P)).join(''), { tone: 'lo' })
    + Array.from({ length: 7 }, (_, i) => led(`e${n}${i}`, [r.x + r.w - 4, r.y + r.d, T5 + 7 + i * 5.2], 0.55)).join('');
const mast = post(MAST[0], MAST[1], 4, T5, T5 + 2, { tone: 'lo' }, 12) + post(MAST[0], MAST[1], 1, T5 + 2, T5 + 40, {}, 8)
  + S(k.cylinder(MAST[0], MAST[1], 3, T5 + 30, 1.2, P, 12, 0.3), { tone: 'hi', crease: 'lo' })
  + S(k.cylinder(MAST[0], MAST[1], 2, T5 + 38, 1.2, P, 12, 0.3), { tone: 'hi', crease: 'lo' })
  + Dt([at([MAST[0], MAST[1], T5 + 41])], { size: 0.5, tone: 'hi' });
const cloud = box(CLOUD, T5, T5 + 36, { tone: 'mid', inner: seam(CLOUD, T5 + 32, 1.6) }, 0.6, 2)
  + card(CLOUD.y + CLOUD.d, CLOUD.x + 3, CLOUD.x + CLOUD.w - 3, T5 + 4, T5 + 30) + L([0, 1, 2, 3].map((i) => k.segment([CLOUD.x + 3, CLOUD.y + CLOUD.d, T5 + 9.2 + i * 5.2], [CLOUD.x + CLOUD.w - 3, CLOUD.y + CLOUD.d, T5 + 9.2 + i * 5.2], P)).join(''), { tone: 'lo' })
    + [0, 1, 2, 3, 4].map((i) => led(`c${i}`, [CLOUD.x + CLOUD.w - 6, CLOUD.y + CLOUD.d, T5 + 6.6 + i * 5.2], 0.55)).join('');

// ---------------------------------------------------------------- the cable up the left side
const cable = (a, b) => `<g data-cue="flow">${wire(ROUTE.slice(a, b + 1), 'lo', 1)}</g>`;

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('tags', '', ' data-cue="levels"'),
  g('title', ''),
  g('time', '', ' data-cue="time"'),
  g('order', g('orderHead', '', ' data-cue="order"') + g('orderBom', '', ' data-cue="bom"') + g('orderRoute', '', ' data-cue="routing"')),
  g('stam', '', ' data-cue="stam"'),
  g('plan', ''),
  g('report', ''),
  g('maps', g('imap', '', ' data-cue="imap"') + g('pmap', '', ' data-cue="pmap"')),
  g('cloudTag', ''),
  g('packets', ''),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('lvl5', tier(TIER.t5) + cue('ent', eRack(ERACK[0], 0) + eRack(ERACK[1], 1) + mast) + cue('cloud', cloud)),
  tier(TIER.t4),
  cable(15, 18),
  filing, officeBack, cue('erp', officeTop + laptop) , papers,
  tier(TIER.td),
  cable(13, 15),
  g('dmzKit', cue('dmz', dmz)),
  tier(TIER.t3, 'lo'),
  g('b34', '', ' data-cue="b34"'),
  cable(7, 12),
  cue('mes', rack), cue('qms', qpc), cue('conn', conn), cue('mes', kiosk),
  tier(TIER.t2),
  cable(3, 6),
  cue('plc', cabinet + plcCpu + ioCards + relays + terminals),
  cue('scada', scadaWall + deskBack + deskTop + monitors + keyboard),
  tier(TIER.t0),
  cable(0, 3),
  pallet, cue('granulate', bags.join('') + bagsTop),
  mBase,
  barsBack, rearPlaten, cue('process', g('moving', moving) + mouldB), cue('valve', cooling), fixedPlaten,
  cue('sensor', sensor),
  barrelSupport, barrel, hopper, drive,
  barsFront,
  stackBase, g('seg0', stackSeg(0)), g('seg1', stackSeg(1)), g('seg2', stackSeg(2)), stackCap,
  cue('process', chute + bin + g('caps', caps)),
  cue('valve', valveHose + valve),
  cue('hmi', hmi),
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
// [world point, width shown, optional shift in picture units] per end of the move
const cam = ([p, w, dx = 0, dy = 0]) => { const [x, y] = at(p); return [Math.round((x + dx) * 10) / 10, Math.round((y + dy) * 10) / 10, w]; };
const CAMS = [
  [[[0, -80, 80], 560, -75, -15], [[0, -80, 80], 530, -75, -15]],
  [[[-70, -10, 50], 330], [[-80, -20, 55], 290]],
  [[[0, -140, 100], 340], [[0, -150, 105], 310]],
  [[[0, -80, 80], 700, -120, -70], [[0, -80, 80], 680, -120, -70]],
  [[[-20, -175, 140], 330, -80, 20], [[-20, -175, 140], 310, -80, 20]],
  [[[-40, -120, 110], 440, -70, 0], [[-30, 60, 60], 250, -50, -10], 0.55, 0.85],
  [[[0, -80, 80], 560, -75, -25], [[0, -80, 80], 540, -75, -25]],
  [[[0, -120, 100], 660], [[0, -120, 100], 640]],
  [[[0, -131, 100], 300], [[40, -170, 130], 430], 0.3, 0.55],
];
const CAM = CAMS.map(([f, t, a, b]) => ({ from: cam(f), to: cam(t), ...(a !== undefined ? { a, b } : {}) }));

// ---------------------------------------------------------------- the film
const LV = 'eng.ot.levels';
const SY = 'eng.ot.systems';
const PU = 'eng.ot.purdue';
const spec = {
  id: 'eng.ot.isa95',
  title: { nl: 'Van sensor tot ERP', en: 'From sensor to ERP' },
  lessons: [LV, SY, PU],
  scenes: [
    {
      id: 's1', lesson: LV, level: 1, still: 0.7, title: { nl: 'Een fabriek in lagen', en: 'A plant in layers' },
      beats: [
        { nl: '{t:ISA-95|ISA-95} (IEC 62264) beschrijft hoe de systemen van een fabriek samenhangen.', en: '{t:ISA-95|ISA-95} (IEC 62264) describes how the systems of a plant fit together.', cue: { 'ISA-95': 'levels' }, still: 0.3 },
        { nl: 'Vijf niveaus, van 0 tot 4: één taal voor IT, OT en leveranciers.', en: 'Five levels, from 0 to 4: one language for IT, OT and suppliers.', cues: ['levels'], still: 0.85 },
      ],
    },
    {
      id: 's2', lesson: LV, level: 1, still: 0.85, title: { nl: 'Niveau 0, 1 en 2', en: 'Levels 0, 1 and 2' },
      beats: [
        { nl: 'Niveau 0 is het proces zelf: kunststof die in de matrijs een dop wordt.', en: 'Level 0 is the process itself: plastic turning into a cap in the mould.', cues: ['process'], still: 0.12 },
        { nl: 'Niveau 1 meet en beweegt: de temperatuurvoeler in de matrijs, de klep van het koelwater.', en: 'Level 1 measures and moves: the temperature sensor in the mould, the cooling-water valve.', cues: ['sensor', 'valve'], still: 0.36 },
        { nl: 'Niveau 2 bestuurt: de {t:PLC|PLC} in de kast. Sommige tekeningen zetten hem op niveau 1.', en: 'Level 2 controls: the {t:PLC|PLC} in the cabinet. Some drawings put it at level 1.', cue: { PLC: 'plc' }, still: 0.62 },
        { nl: 'Ook {t:SCADA|SCADA} zit op niveau 2: de schermen waarop operators de installatie bedienen.', en: '{t:SCADA|SCADA} sits at level 2 too: the screens operators use to run the installation.', cue: { SCADA: 'scada' }, still: 0.9 },
      ],
    },
    {
      id: 's3', lesson: LV, level: 1, still: 0.6, title: { nl: 'Niveau 3 en 4', en: 'Levels 3 and 4' },
      beats: [
        { nl: 'Niveau 3 stuurt de productie, meestal met een {t:MES|MES}: welke order op welke lijn.', en: 'Level 3 runs production, usually with an {t:MES|MES}: which order on which line.', cue: { MES: 'mes' }, still: 0.15 },
        { nl: 'Het kwaliteitssysteem werkt per order en dienst: ook niveau 3.', en: 'The quality system works per order and shift: level 3 too.', cues: ['qms'], still: 0.4 },
        { nl: 'Niveau 4 is de bedrijfsplanning in het {t:ERP|ERP}: klantorders, inkoop, voorraad en kosten.', en: 'Level 4 is business planning in the {t:ERP|ERP}: customer orders, purchasing, stock and cost.', cue: { ERP: 'erp' }, still: 0.66 },
        { nl: 'De norm gaat vooral over de grens tussen niveau 3 en 4.', en: 'The standard is mostly about the boundary between levels 3 and 4.', cues: ['b34'], still: 0.92 },
      ],
    },
    {
      id: 's4', lesson: LV, level: 1, still: 0.4, title: { nl: 'De tijdschaal', en: 'The timescale' },
      beats: [
        { nl: 'Het handigste onderscheid: de {t:Tijdschaal|tijdschaal}, hoe snel beslissingen vallen.', en: 'The most useful distinction: the {t:Timescale|timescale}, how fast decisions are made.', cue: { Tijdschaal: 'time' }, still: 0.12 },
        { nl: 'Niveau 4: maanden tot dagen. Niveau 3: dagen tot seconden. Niveau 1 en 2: seconden en sneller.', en: 'Level 4: months to days. Level 3: days to seconds. Levels 1 and 2: seconds and faster.', cues: ['time'], still: 0.36 },
        { nl: 'Een uur uit? Zonder PLC staat de machine stil. Zonder ERP draait de lijn meestal door.', en: 'Down for an hour? Without the PLC the machine stops. Without the ERP the line usually runs on.', cues: ['plc', 'erp'], still: 0.62 },
        { nl: 'Fout: ‘we halen de OEE uit SAP’. Vraag: op welk niveau ontstaat dit getal?', en: 'Mistake: ‘we take OEE from SAP’. Ask: at which level does this number arise?', cues: ['erp'], still: 0.9 },
      ],
    },
    {
      id: 's5', lesson: SY, level: 1, still: 0.85, title: { nl: 'Een order komt binnen', en: 'An order comes in' },
      beats: [
        { nl: 'Het ERP maakt een {t:Productieorder|productieorder}: {n:2000} doppen type A, klaar donderdag.', en: 'The ERP creates a {t:Production order|production order}: {n:2000} caps of type A, ready Thursday.', cue: { Productieorder: 'order' }, still: 0.2 },
        { nl: 'De {t:Stuklijst|stuklijst}: {n:25} g granulaat per dop, dus {n:2000} × {n:25} g = {n:50} kg.', en: 'The {t:Bill of materials|bill of materials}: {n:25} g of granulate per cap, so {n:2000} × {n:25} g = {n:50} kg.', cue: { Stuklijst: 'bom' }, still: 0.55 },
        { nl: 'De {t:Routing|routing}: spuitgieten op machine {n:4}, {n:12} s per cyclus.', en: 'The {t:Routing|routing}: injection moulding on machine {n:4}, {n:12} s per cycle.', cue: { Routing: 'routing' }, still: 0.9 },
      ],
    },
    {
      id: 's6', lesson: SY, level: 1, still: 0.9, title: { nl: 'Van plan tot machine', en: 'From plan to machine' },
      beats: [
        { nl: 'Stuklijst en routing zijn {t:Stamdata|stamdata}: vast in het ERP, als kopie naar het MES.', en: 'Bill of materials and routing are {t:Master data|master data}: fixed in the ERP, copied to the MES.', cue: { Stamdata: 'stam' }, still: 0.15 },
        { nl: 'Staat er {n:10} s terwijl de machine er {n:12} haalt, dan lijkt elke dienst te traag.', en: 'If it says {n:10} s while the machine manages {n:12}, every shift looks too slow.', cues: ['stam'], still: 0.38 },
        { nl: 'Het MES plant de order op dinsdag, vroege dienst, op machine {n:4}.', en: 'The MES schedules the order on Tuesday, early shift, on machine {n:4}.', cues: ['mes'], still: 0.62 },
        { nl: 'De operator start de order op de {t:HMI|HMI}; de PLC laadt de instellingen voor type A.', en: 'The operator starts the order on the {t:HMI|HMI}; the PLC loads the settings for type A.', cue: { HMI: 'hmi' }, still: 0.92 },
      ],
    },
    {
      id: 's7', lesson: SY, level: 1, still: 0.4, title: { nl: 'Gegevens gaan omhoog', en: 'Data goes up' },
      beats: [
        { nl: 'De PLC telt elke cyclus, SCADA toont de voortgang, de historian bewaart de temperaturen.', en: 'The PLC counts every cycle, SCADA shows the progress, the historian stores the temperatures.', cues: ['plc', 'scada'], still: 0.15 },
        { nl: 'Aan het eind meldt het MES {n:1960} goed en {n:40} afkeur terug aan het ERP.', en: 'At the end the MES reports {n:1960} good and {n:40} scrap back to the ERP.', cues: ['mes', 'erp'], still: 0.42 },
        { nl: 'ERP: order, stuklijst, voorraad. MES: echte tijden, afkeur, batch. PLC: instellingen, teller.', en: 'ERP: order, bill of materials, stock. MES: actual times, scrap, batch. PLC: settings, counter.', cues: ['erp', 'mes', 'plc'], still: 0.66 },
        { nl: '‘Dat staat in SAP’ en ‘dat zit in de machine’: over hetzelfde getal kan allebei waar zijn.', en: '‘That’s in SAP’ and ‘that’s in the machine’: about the same number, both can be true.', cues: ['erp', 'plc'], still: 0.9 },
      ],
    },
    {
      id: 's8', lesson: PU, level: 2, still: 0.9, title: { nl: 'Twee kaarten', en: 'Two maps' },
      beats: [
        { nl: 'Het {t:Purdue-model|Purdue-model} (begin jaren negentig) dient nu vooral als netwerkkaart.', en: 'The {t:Purdue model|Purdue model} (early 1990s) now serves mainly as a network map.', cue: { 'Purdue-model': 'pmap' }, still: 0.15 },
        { nl: 'ISA-95 is een {t:Functiemodel|functiemodel}: welke taken er zijn, niet waar ze staan.', en: 'ISA-95 is a {t:Functional model|functional model}: which tasks exist, not where they sit.', cue: { Functiemodel: 'imap' }, still: 0.38 },
        { nl: 'Een {t:Informatiestroom|informatiestroom}: een vaste uitwisseling, zoals de planning van ERP naar MES.', en: 'An {t:Information flow|information flow}: a fixed exchange, such as the schedule from ERP to MES.', cue: { Informatiestroom: 'flow' }, still: 0.62 },
        { nl: 'Purdue: 0 tot 3 de fabriek, 4 het kantoornetwerk, 5 het {t:Bedrijfsnetwerk|bedrijfsnetwerk}.', en: 'Purdue: 0 to 3 the plant, 4 the office network, 5 the {t:Enterprise network|enterprise network}.', cue: { Bedrijfsnetwerk: 'ent' }, still: 0.92 },
      ],
    },
    {
      id: 's9', lesson: PU, level: 2, still: 0.7, title: { nl: 'De DMZ', en: 'The DMZ' },
      beats: [
        { nl: 'Op 3.5 zit de {t:Industriële DMZ|industriële DMZ}: een tussennetwerk, later toegevoegd.', en: 'At 3.5 sits the {t:Industrial DMZ|industrial DMZ}: a buffer network, added later.', cue: { 'Industriële DMZ': 'dmz' }, still: 0.12 },
        { nl: '‘Niveau 3’: de leverancier bedoelt een taak, de netwerkbeheerder een netwerkdeel.', en: '‘Level 3’: the supplier means a task, the network administrator a part of the network.', cues: ['mes'], still: 0.32 },
        { nl: 'Een cloud-MES: functioneel niveau 3, in het netwerk buiten niveau 5.', en: 'A cloud MES: functionally level 3, in the network beyond level 5.', cues: ['cloud'], still: 0.52 },
        { nl: 'Een connector op niveau 3 belt zelf naar buiten, naar een doorgeefluik in de DMZ.', en: 'A connector at level 3 calls out by itself, to a relay in the DMZ.', cues: ['conn', 'dmz'], still: 0.72 },
        { nl: 'Zones en conduits (IEC 62443). Lagen op papier bewijzen niets: vraag de firewallregels.', en: 'Zones and conduits (IEC 62443). Layers on paper prove nothing: ask for the firewall rules.', cues: ['dmz'], still: 0.92 },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// The film replaces the lessons' text and worked examples, so this explains
// fully. No "/" or "&" in the spoken text; standard numbers (IEC 62264, IEC
// 62443) stay in the captions only; "3.5" is said in words. ERP, PLC, SCADA,
// DMZ, IT and OT read right as they are; MES and HMI are said as letters (MES with
// a word after it as "em ee es", else the S is a bare hiss), and
// Purdue, functiemodel, productieorder, stamdata, tijdschaal and firewall get a
// Dutch spoken form (films/_kit/timeline.mjs, SAY).
const SAY = [
  [ // s1 a plant in layers
    { nl: '{t:ISA-95|ISA-95} is de internationale norm over hoe de systemen van een fabriek samenhangen. Het eerste deel verscheen in 2000.',
      en: '{t:ISA-95|ISA-95} is the international standard that describes how a plant’s systems fit together. Its first part appeared in 2000.' },
    { nl: 'Met de niveaus spreek je één taal met IT, met OT, de techniek die machines bestuurt, en met leveranciers. Vijf, van nul tot vier: de verdiepingen van deze fabriek.',
      en: 'Its levels give you one language with IT, with OT, the technology that controls machines, and with suppliers. Five, from zero to four: the floors of this plant.' },
  ],
  [ // s2 levels 0, 1 and 2
    { nl: 'Niveau nul is het proces zelf: de kunststof die in de matrijs een dop wordt.',
      en: 'Level zero is the process itself: the plastic that becomes a cap in the mould.' },
    { nl: 'Niveau één meet en beweegt: sensoren zoals de temperatuurvoeler, actuatoren zoals de koelwaterklep.',
      en: 'Level one measures and moves: sensors such as the temperature sensor, actuators such as the cooling-water valve.' },
    { nl: 'Niveau twee bewaakt en bestuurt: de {t:PLC|PLC}, de industriële computer die de machine aanstuurt. Sommige tekeningen zetten hem op niveau één.',
      en: 'Level two monitors and controls: the {t:PLC|PLC}, the industrial computer that runs the machine. Some drawings put it at level one.' },
    { nl: 'Ook {t:SCADA|SCADA} hoort hier. Daarmee volgen en bedienen operators de hele installatie op schermen.',
      en: '{t:SCADA|SCADA} belongs here too: with it, operators watch and run the whole installation on screens.' },
  ],
  [ // s3 levels 3 and 4
    { nl: 'Niveau drie stuurt de productie, meestal met een {t:MES|MES}: welke order op welke machine, wat er verbruikt, gemaakt en afgekeurd is.',
      en: 'Level three runs production, usually with an {t:MES|MES}: which order on which machine, what was used, made and scrapped.' },
    { nl: 'Het kwaliteitssysteem voor meetrapporten werkt per order en dienst: ook niveau drie.',
      en: 'The quality system for inspection reports works per order and shift: level three too.' },
    { nl: 'Niveau vier is de bedrijfsplanning in het {t:ERP|ERP}, zoals SAP: klantorders, inkoop, voorraad en kosten.',
      en: 'Level four is business planning in the {t:ERP|ERP}, such as SAP: customer orders, purchasing, stock and cost.' },
    { nl: 'De norm gaat vooral over de grens tussen drie en vier: welke informatie daar heen en weer gaat.',
      en: 'The standard is mostly about the boundary between three and four: which information goes back and forth there.' },
  ],
  [ // s4 the timescale
    { nl: 'Het handigste onderscheid is de {t:Tijdschaal|tijdschaal}: hoe snel beslissingen op een niveau vallen.',
      en: 'The most useful distinction is the {t:Timescale|timescale}: how fast decisions are made at a level.' },
    { nl: 'Niveau vier denkt in maanden tot dagen, niveau drie in dagen tot seconden, één en twee in seconden en sneller; de voeler zelfs in milliseconden.',
      en: 'Level four thinks in months to days, level three in days to seconds, levels one and two in seconds and faster; the sensor even in milliseconds.' },
    { nl: 'Valt een systeem een uur uit? Zonder PLC staat de machine stil, zonder ERP draait de lijn meestal door.',
      en: 'A system down for an hour? Without the PLC the machine stops; without the ERP the line usually runs on.' },
    { nl: 'Typische fout: we halen de OEE uit SAP. Het ERP weet wat er geboekt is, niet wat de machine per minuut deed. Vraag dus: op welk niveau ontstaat dit getal, en waar gebruiken we het?',
      en: 'Typical mistake: we take OEE from SAP. The ERP knows what was booked, not what the machine did each minute. So ask: at which level does this number arise, and where do we use it?' },
  ],
  [ // s5 an order comes in
    { nl: 'Volg nu één order. Het ERP maakt een {t:Productieorder|productieorder}: {n:2000} doppen van type A, klaar op donderdag.',
      en: 'Follow one order. The ERP creates a {t:Production order|production order}: {n:2000} caps of type A, ready on Thursday.' },
    { nl: 'De {t:Stuklijst|stuklijst} zegt welke materialen erin gaan, en hoeveel: {n:25} gram granulaat per dop. {n:2000} maal {n:25} gram is {n:50} kilo.',
      en: 'The {t:Bill of materials|bill of materials} lists the materials and how much: {n:25} grams of granulate per cap. {n:2000} times {n:25} grams is {n:50} kilos.' },
    { nl: 'De {t:Routing|routing} zegt welke bewerkingen, in welke volgorde, waar en hoe lang: spuitgieten op machine {n:4}, {n:12} seconden per cyclus.',
      en: 'The {t:Routing|routing} says which operations, in which order, where and how long: injection moulding on machine {n:4}, {n:12} seconds per cycle.' },
  ],
  [ // s6 from plan to machine
    { nl: 'Stuklijst en routing zijn {t:Stamdata|stamdata}: vaste gegevens voor veel orders, beheerd in het ERP, met een kopie in het MES.',
      en: 'Bill of materials and routing are {t:Master data|master data}: fixed information for many orders, kept in the ERP, with a copy in the MES.' },
    { nl: 'Staat er {n:10} seconden terwijl de machine er {n:12} haalt, dan lijkt elke dienst te traag. Vaak zijn stamdata bij de MES-invoering één keer overgenomen en nooit bijgehouden. Vraag dus wie een cyclustijd aanpast, en waar.',
      en: 'If it says {n:10} seconds while the machine manages {n:12}, every shift looks too slow. Often master data were copied once at MES go-live and never kept up. So ask who changes a cycle time, and where.' },
    { nl: 'Het MES verdeelt het werk over lijnen en diensten: deze order op dinsdag, vroege dienst, machine {n:4}.',
      en: 'The MES spreads the work over lines and shifts: this order on Tuesday, early shift, machine {n:4}.' },
    { nl: 'De operator start hem op de {t:HMI|HMI}, het aanraakscherm aan de machine. De PLC laadt de instellingen voor type A.',
      en: 'The operator starts it on the {t:HMI|HMI}, the touch screen on the machine. The PLC loads the settings for type A.' },
  ],
  [ // s7 data goes up
    { nl: 'De PLC telt elke cyclus, SCADA toont de voortgang, de historian bewaart de temperaturen.',
      en: 'The PLC counts every cycle, SCADA shows the progress, the historian stores the temperatures.' },
    { nl: 'Aan het eind meldt het MES {n:1960} goed en {n:40} afkeur terug aan het ERP. Orders gaan omlaag, gegevens komen omhoog.',
      en: 'At the end the MES reports {n:1960} good and {n:40} scrap back to the ERP. Orders go down, data comes up.' },
    { nl: 'Meestal heeft het ERP de order, stuklijst en voorraad, het MES de echte tijden, afkeur met redenen en batches, de PLC de instellingen en de teller.',
      en: 'Usually the ERP has the order, bill of materials and stock; the MES the actual times, scrap with reasons and batches; the PLC the settings and counter.' },
    { nl: 'Dus dat staat in SAP en dat zit in de machine kunnen over hetzelfde getal allebei waar zijn.',
      en: 'So that is in SAP and that is in the machine can both be true about the same number.' },
  ],
  [ // s8 two maps
    { nl: 'Netwerkbeveiligers tekenen bijna dezelfde lagen: het {t:Purdue-model|Purdue-model}, van begin jaren negentig, nu vooral een netwerkkaart: welk systeem waar staat, en welk verkeer mag.',
      en: 'Network security people draw almost the same layers: the {t:Purdue model|Purdue model}, from the early nineties, now mainly a network map: which system sits where, and which traffic may pass.' },
    { nl: 'ISA-95 bouwde erop voort, maar is een {t:Functiemodel|functiemodel}: welke taken er zijn en welke informatie ertussen gaat. Over kabels en firewalls zegt het niets.',
      en: 'ISA-95 built on it, but it is a {t:Functional model|functional model}: which tasks exist and which information passes between them. It says nothing about cables or firewalls.' },
    { nl: 'Zo’n vaste uitwisseling heet een {t:Informatiestroom|informatiestroom}, zoals de productieplanning van het ERP naar het MES.',
      en: 'Such a fixed exchange is an {t:Information flow|information flow}, like the schedule from ERP to MES.' },
    { nl: 'Bij Purdue zijn nul tot drie de fabriek, vier het kantoornetwerk van de site, en vijf het {t:Bedrijfsnetwerk|bedrijfsnetwerk}, met de centrale systemen en internet.',
      en: 'In Purdue, zero to three are the plant, four the site’s office network, and five the {t:Enterprise network|enterprise network}, with the central systems and the internet.' },
  ],
  [ // s9 the DMZ
    { nl: 'Tussen drie en vier, op drie punt vijf, zit de {t:Industriële DMZ|industriële DMZ}, een later toegevoegd tussennetwerk. Kantoor en fabriek praten ermee, niet met elkaar.',
      en: 'Between three and four, at three point five, sits the {t:Industrial DMZ|industrial DMZ}: a buffer network, added later. Office and plant both talk to it, not to each other.' },
    { nl: 'Niveau drie is voor een MES-leverancier een taak, voor een netwerkbeheerder een plek onder de DMZ. Vraag: bedoel je wat het systeem doet, of waar het staat? De nummering is een gewoonte, geen wet.',
      en: 'Level three is a task to an MES supplier, a place below the DMZ to a network administrator. So ask: what the system does, or where it sits? The numbering is a habit, not a law.' },
    { nl: 'Een cloud-MES dat orders stuurt en tellingen terugkrijgt, is functioneel niveau drie, maar staat buiten niveau vijf. Past Purdue dan nog? De meeste experts zeggen ja, als denkkader, met nieuw verkeer via de DMZ.',
      en: 'A cloud MES that sends orders and gets counts back is functionally level three, but sits beyond level five. Does Purdue still fit? Most experts say yes, as a way of thinking, with new traffic through the DMZ.' },
    { nl: 'Geen verbinding die buiten begint, mag de fabriek bereiken: een connector op niveau drie zelf naar buiten, naar een doorgeefluik in de DMZ dat met de cloud praat; daarover komen de orders binnen.',
      en: 'No connection started outside may reach the plant: a connector at level three calls out itself, to a relay in the DMZ that talks to the cloud; orders come in over that link.' },
    { nl: 'De beveiligingsnorm spreekt van zones en conduits: groepen apparaten en de gecontroleerde verbindingen ertussen. Noteer beide kaarten, en vraag bij mooie lagen de firewallregels: vaak hangt alles toch in één netwerk.',
      en: 'The security standard speaks of zones and conduits: groups of devices and the controlled connections between them. Record both maps, and behind neat layers, ask for the firewall rules: often everything hangs in one network.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// Scene length from the narration (about 2.6 words a second plus a look), 60–300 s in all.
const wordsOfSay = (s) => s.beats.map((b) => b.say.nl.replace(/\{[tn]:([^}|]*)(\|[^}]*)?\}/g, '$1')).join(' ').split(/\s+/).length;
const DUR = spec.scenes.map((s) => Math.round(wordsOfSay(s) / 2.8 + 2.5));
spec.scenes.forEach((s, i) => { s.dur = DUR[i]; });
C.dur = DUR;

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.ia-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.ia-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.ia-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6}
.ia-hole{fill:var(--anatomy-shade-0);stroke:none}
.ia-led{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.ia-led[data-on]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.ia-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.ia-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.ia-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.ia-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ia-dim{fill:none;stroke:var(--anatomy-lo);stroke-width:1.6;stroke-linecap:round}
.ia-acc{fill:var(--fp-accent);stroke:none}
.ia-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.ia-row{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-shade-0));stroke:var(--fp-accent);stroke-width:1.4}
.ia-pill{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:1.2}
.ia-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.ia-inv{fill:var(--fp-on-accent);font-family:var(--anatomy-mono);font-weight:700}
.ia-scr{fill:none;stroke:var(--anatomy-hi);stroke-width:.7;stroke-linecap:round}
.ia-scra{fill:none;stroke:var(--fp-accent);stroke-width:.9;stroke-linecap:round}
[data-lit] .iso-fill,[data-lit] .iso-top,[data-lit] .iso-shade{fill:var(--fp-accent)}
[data-cue][data-on] .ia-pill,[data-cue][data-on] .ia-panel{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .ia-big{fill:var(--fp-accent-text)}
[data-cue][data-on] .ia-line{stroke:var(--fp-accent)}
[data-cue="b34"][data-on] .fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
.ia-band{stroke:var(--fp-accent);stroke-width:2.4}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
.ia-band{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:4 4}
`;

const label = {
  nl: 'Een fabriek als trapvormig gebouw, elke trede één niveau. Onderaan, niveau 0 en 1, een spuitgietmachine met matrijs, temperatuurvoeler, koelwaterklep en eigen HMI-scherm. Niveau 2: de kast met de PLC en een SCADA-bureau. Niveau 3: een MES-terminal en serverkast. Op 3.5 de industriële DMZ met twee firewalls en een doorgeefluik. Niveau 4: het ERP op de laptop van de planner. Niveau 5: het bedrijfsnetwerk en een cloud-MES. Orders reizen langs een kabel omlaag, gegevens omhoog.',
  en: 'A plant as a stepped building, each step one level. At the bottom, levels 0 and 1, an injection moulding machine with its mould, a temperature sensor, a cooling-water valve and its own HMI screen. Level 2: the cabinet with the PLC and a SCADA desk. Level 3: an MES terminal and server rack. At 3.5 the industrial DMZ with two firewalls and a relay. Level 4: the ERP on the planner’s laptop. Level 5: the enterprise network and a cloud MES. Orders travel down a cable, data comes up.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  for (const lang of ['nl', 'en']) console.log(`narration ${lang}: ${data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).length, 0), 0)} words`);
}
if (process.env.SIZES) {
  const parts = { tiers: Object.values(TIER).map((t) => tier(t)).join(''), mBase, barsBack, barsFront, rearPlaten, fixedPlaten, moving, mouldB, barrel, hopper, drive, caps, bags: bags.join('') + bagsTop, pallet, cabinet, plcCpu, ioCards, relays, terminals, scadaWall, monitors, keyboard, deskTop, kiosk, rack, qpc, conn, dmz, officeTop, laptop, filing, eRacks: eRack(ERACK[0], 0) + eRack(ERACK[1], 1), mast, cloud, sensor, valve, hmi, bin };
  for (const [n, v] of Object.entries(parts).sort((a, b) => b[1].length - a[1].length)) console.log(n, (compact(v).length / 1024).toFixed(1));
  console.log('stage script', (stageScript.length / 1024).toFixed(1), 'css', ((css.length + k.ISO_CSS.length) / 1024).toFixed(1));
}
