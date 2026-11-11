// Dev tool, not shipped. Builds the explainer film "Orders omlaag,
// terugmeldingen omhoog / Orders down, confirmations up" for IT/OT op de
// fabrieksvloer: the stack topic, level 2 (eng.ot.orderflow).
//
//   node films/eng.ot.orderflow/build.mjs            build the page
//   node films/eng.ot.orderflow/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.ot.orderflow.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9:
// the two ISA-95 flows across the 4/3 boundary → production order to work order
// → the recipe to the PLC → counts and the confirmation back up → goods receipt
// (SAP 101) and the material out (261) → backflush → the worked example (24 vs
// 25 kg) → where it goes wrong and the sharp question.
//
// The world is the stepped building of eng.ot.isa95 (the same parts and
// numbers, so the two read as one series), without its Purdue level 5 and the
// DMZ kit: on the ground the injection moulding machine with its HMI, the bin
// of caps, a small scrap bin, the pallet of granulate bags and a shelf of
// finished goods; level 2 the PLC cabinet and the SCADA desk; level 3 the MES
// terminal, rack and quality PC; the empty ledge marks the 3/4 boundary; level 4
// the planner's desk with the ERP laptop. Panels (the two flows, the order and
// work order, the recipe, the counts, the confirmation, the stock, backflush,
// the 24/25 kg meter, the causes and the confirmation frequency) sit in stage
// space over the drawing.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts } from '../_kit/timeline.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked example (the build fails if a value drifts); the
// {n:...} numbers are then checked against the Dutch lesson text by defineFilm.
// Facts, checked 2026-11-11 and hedged in the narration:
// - ISA-95 (IEC 62264) part 1 names the exchanges between levels 4 and 3; the
//   main ones are the production schedule (down) and production performance
//   (up), next to product definition (master data, down) and production
//   capability (capacity, up).
// - SAP: movement type 101 is a goods receipt (also for a production order);
//   261 is the goods issue to an order, which backflushing posts automatically
//   at the confirmation. These codes are SAP's own; other ERPs name them
//   differently, so the film says "in SAP, for example".
// - Backflushing books components out from the bill of materials times the
//   confirmed quantity. Whether scrap counts depends on the set-up (SAP takes
//   yield plus confirmed scrap; scrap that is not confirmed is missed), so the
//   film keeps the lesson's "if only the good quantity counts".
// Illustrative values on the panels (recipe settings, other work orders,
// downtime, hours, 25 kg bags, the opening stock) are labelled "voorbeeld".
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
// orderflow: 1.000 caps × 25 g; 960 good + 40 scrap; backflush on good 24 kg, real 25 kg, 1 kg too much
const EX = { qty: 1000, gram: 25, good: 960, scrap: 40, gr: 101, gi: 261 };
assert(EX.good + EX.scrap === EX.qty, '960 good + 40 scrap = 1.000');
assert((EX.good * EX.gram) / 1000 === 24, 'backflush on the good quantity: 960 × 25 g = 24 kg');
assert((EX.qty * EX.gram) / 1000 === 25, 'really used: 1.000 × 25 g = 25 kg');
assert(((EX.qty - EX.good) * EX.gram) / 1000 === 1, 'the ERP shows 1 kg of granulate too much');
// the illustrative stock: five 25 kg bags; the order takes one bag from the pallet
const STOCK = { bag: 25, bags: 5 };
STOCK.kg = STOCK.bag * STOCK.bags;
assert(STOCK.kg - (EX.qty * EX.gram) / 1000 === 100 && STOCK.kg - (EX.good * EX.gram) / 1000 === 101, 'stock 125 kg: really 100 kg left, the ERP says 101 kg');
// Facts written as plain text, checked here against the Dutch lesson text.
const OT = (await import(pathToFileURL(join(HERE, '../../src/content/courses/eng/ot.nl.js')).href)).default.lessons;
const lessonText = (() => { const l = OT.find((x) => x.id === 'eng.ot.orderflow'); return [...l.teach, l.example.text].join('\n'); })();
for (const s of ['tussen niveau 4 en 3', 'productieplanning (production schedule)', 'productieprestaties (production performance)', 'orders omlaag, terugmeldingen omhoog',
  'stamdata omlaag', 'capaciteitsoverzicht omhoog', 'één lijn of machine in één dienst', 'temperaturen, snelheden, tijden', 'afkeur en stilstand', 'bewegingssoort (movement type) 101',
  'met 261', 'elke zak granulaat te scannen', 'rekent met de norm', 'te laat, verkeerde eenheid, of afkeur die niet meegaat', 'per stuk, per dienst of per order',
  'Per stuk is meestal te veel voor het ERP, per week te weinig voor de planner', 'backflush op de totale hoeveelheid, of de afkeur apart als verbruik boeken']) {
  assert(lessonText.includes(s), `lesson text: "${s}"`);
}

// ---------------------------------------------------------------- the world
// The building of eng.ot.isa95: x to the right, y toward the viewer, z up. The
// steps go back (-y) and up.
const W = 640;
const H = 400;
const X0 = -150;
const XW = 300;
const TIER = {
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
const SCRAP = { x: -70, y: 68, w: 14, d: 12, r: 0.6 };
const FGS = { x: 122, y: 26, w: 24, d: 44 }; // the finished-goods shelf
const CAB = { x: -132, y: -58, w: 40, d: 14 };
const DESK = { x: 4, y: -40, w: 78, d: 22 };
const KIOSK = [-62, -84];
const RACK = { x: 64, y: -114, w: 24, d: 22 };
const QPC = { x: -14, y: -104, w: 32, d: 16 };
const ODESK = { x: -50, y: -186, w: 64, d: 26 };
// the cable up the left side: machine → cabinet → MES → ledge → ERP desk
const ROUTE = [
  [-132, 36, 14], [-142, 36, 6.6], [-142, -2.6, 6.6], [-142, -2.6, 42.6], [-142, -50, 42.6], [-132, -50, 60],
  [-132, -50, 60], [-142, -50, 42.6], [-142, -62.6, 42.6], [-142, -62.6, 78.6], [-142, -84, 78.6], [-74, -84, 78.6],
  [-142, -84, 78.6], [-142, -122.6, 78.6], [-142, -122.6, 96.6], [-142, -140.6, 96.6], [-142, -140.6, 114.6], [-142, -174, 114.6], [-50, -174, 114.6],
];
const C = {
  TIER, X0, XW, MB, MZ, PL, MOULD_OPEN, STACK, SENS, BIN, SCRAP, FGS, CAB, DESK, KIOSK, RACK, QPC, ODESK, EX, STOCK,
  // where a packet rides: the stops along the cable (indices into ROUTE)
  ROUTE, STOP: { machine: 0, plc: 5, mes: 11, erp: 18 },
};

const FIT = [[X0, 92, 0], [X0 + XW, 92, 0], [X0, -200, 160], [X0 + XW, -200, 160], [X0, 92, 40], [X0 + XW, -200, 114]];
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

// ---------------------------------------------------------------- new on the ground: the scrap bin and the finished-goods shelf
// a small scrap bin beside the bin of good caps (its caps appear while the order runs)
const scrapBin = box(SCRAP, T0, T0 + 10, { tone: 'lo', inner: seam(SCRAP, T0 + 7.4, 1.2) }, 0.3, 1)
  + box(k.insetPlan(SCRAP, 1.4), T0 + 9, T0 + 10, { tone: 'mid', crease: 'none' }, 0, 1);
const scrapCaps = [[SCRAP.x + 4, SCRAP.y + 4], [SCRAP.x + 9.6, SCRAP.y + 7.4]].map(([x, y]) => post(x, y, 1.8, T0 + 10, T0 + 12, { tone: 'hi', crease: 'lo' }, 9)).join('');
// the shelf: four posts, a floor board and a middle board; three boxes of caps
// arrive with the goods receipt (two on the floor board, one above)
const FGZ = [T0 + 3, T0 + 21];
const fgPost = (x, y) => box({ x, y, w: 2, d: 2, r: 0.2 }, T0, T0 + 38, { tone: 'lo' }, 0, 1);
const fgBoard = (z) => box({ x: FGS.x, y: FGS.y, w: FGS.w, d: FGS.d, r: 0.3 }, z - 2, z, { tone: 'mid' }, 0, 1);
const fgBox = (y, z) => box({ x: FGS.x + 2, y, w: FGS.w - 4, d: 18, r: 0.6 }, z, z + 14, { tone: 'hi', crease: 'lo', inner: seam({ x: FGS.x + 2, y, w: FGS.w - 4, d: 18 }, z + 11, 1.2) }, 0.3, 1)
  + rules(FGS.x + 5, y + 18, z + 8, [8, 5], 2.4);
const FGB = [[FGS.y + 2, FGZ[0]], [FGS.y + 23, FGZ[0]], [FGS.y + 2, FGZ[1]]];
const shelfBack = fgPost(FGS.x, FGS.y) + fgPost(FGS.x + FGS.w - 2, FGS.y);
const shelfFront = fgPost(FGS.x, FGS.y + FGS.d - 2) + fgPost(FGS.x + FGS.w - 2, FGS.y + FGS.d - 2);
const shelf = shelfBack + fgBoard(FGZ[0]) + g('fg0', fgBox(...FGB[0])) + g('fg1', fgBox(...FGB[1])) + fgBoard(FGZ[1]) + g('fg2', fgBox(...FGB[2])) + shelfFront
  + box({ x: FGS.x, y: FGS.y, w: FGS.w, d: FGS.d, r: 0.3 }, T0 + 38, T0 + 40, { tone: 'mid' }, 0, 1);

// ---------------------------------------------------------------- the cable up the left side
const cable = (a, b) => `<g data-cue="flow">${wire(ROUTE.slice(a, b + 1), 'lo', 1)}</g>`;

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = [
  g('tags', ''),
  g('flows', '', ' data-cue="flows"'),
  g('po', ''),
  g('wo', '', ' data-cue="wo"'),
  g('recipe', '', ' data-cue="recipe"'),
  g('count', ''),
  g('conf', '', ' data-cue="conf"'),
  g('stock', '', ' data-cue="stock"'),
  g('bfp', '', ' data-cue="bf"'),
  g('meter', '', ' data-cue="meter"'),
  g('quote', ''),
  g('causes', '', ' data-cue="causes"'),
  g('freq', '', ' data-cue="freq"'),
  g('packets', ''),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  tier(TIER.t4),
  cable(15, 18),
  filing, officeBack, cue('erp', officeTop + laptop), papers,
  tier(TIER.td),
  g('b34', '', ' data-cue="b34"'),
  cable(13, 15),
  tier(TIER.t3, 'lo'),
  cable(7, 12),
  cue('mes', rack), qpc, cue('mes', kiosk),
  tier(TIER.t2),
  cable(3, 6),
  cue('plc', cabinet + plcCpu + ioCards + relays + terminals),
  scadaWall + deskBack + deskTop + monitors + keyboard,
  tier(TIER.t0),
  cable(0, 3),
  pallet, cue('bf', bags.map((b, i) => g(`bag${i}`, b)).join('') + g('bagTop', bagsTop)),
  cue('gr', shelf),
  mBase,
  barsBack, rearPlaten, g('moving', moving), mouldB, cooling, fixedPlaten,
  sensor,
  barrelSupport, barrel, hopper, drive,
  barsFront,
  stackBase, g('seg0', stackSeg(0)), g('seg1', stackSeg(1)), g('seg2', stackSeg(2)), stackCap,
  chute + bin + g('caps', caps),
  valveHose + valve,
  cue('scrap', scrapBin + g('scrapIn', scrapCaps)),
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
// [world point, width shown, where on the 640 × 400 stage the point sits] per end
// of the move; the panels sit top left, so the scene's subject goes right
const cam = ([p, w, sx = W / 2, sy = H / 2]) => { const [x, y] = at(p); const f = w / W; return [Math.round((x - (sx - W / 2) * f) * 10) / 10, Math.round((y - (sy - H / 2) * f) * 10) / 10, w]; };
const CAMS = [
  [[[0, -60, 70], 620, 420, 230], [[0, -60, 70], 600, 420, 230]],
  [[[-60, -130, 100], 400, 470, 250], [[-60, -130, 100], 380, 470, 250]],
  [[[-90, -30, 60], 420, 470, 240], [[-90, -30, 60], 400, 470, 240]],
  [[[-80, 20, 40], 440, 470, 250], [[-40, -80, 80], 580, 450, 240]],
  [[[30, -40, 60], 620, 440, 220], [[30, -40, 60], 600, 440, 220]],
  [[[100, 45, 20], 380, 480, 280], [[100, 45, 20], 360, 480, 280]],
  [[[100, 45, 20], 420, 520, 250], [[100, 45, 20], 400, 520, 250]],
  [[[0, -60, 70], 640, 440, 250], [[0, -60, 70], 620, 440, 250]],
];
const CAM = CAMS.map(([f, t, a, b]) => ({ from: cam(f), to: cam(t), ...(a !== undefined ? { a, b } : {}) }));

// ---------------------------------------------------------------- the film
// Every scene is level 2, the level of eng.ot.orderflow. The film replaces the
// lesson's text and its worked example (lessons with a film no longer show the
// example block), so the scenes carry every point of both, in order:
// teach 1 → s1; teach 2 → s2, s3; teach 3 → s4, s5; teach 4 → s6; the worked
// example → s2 (order), s4 (960/40), s5 (goods receipt), s7 (24 vs 25 kg, the
// fix); teach 5 → s8.
const OF = 'eng.ot.orderflow';
const spec = {
  id: 'eng.ot.orderflow',
  title: { nl: 'Orders omlaag, terugmeldingen omhoog', en: 'Orders down, confirmations up' },
  lessons: [OF],
  scenes: [
    {
      id: 's1', lesson: OF, level: 2, still: 0.85, title: { nl: 'Twee stromen', en: 'Two flows' },
      beats: [
        { nl: 'ISA-95 beschrijft twee hoofdstromen tussen niveau 4 en 3: tussen het ERP en het MES.', en: 'ISA-95 describes two main flows between levels 4 and 3: between the ERP and the MES.', cues: ['b34', 'erp', 'mes'], bp: 0.5 },
        { nl: 'Omlaag de productieplanning, omhoog de productieprestaties: orders omlaag, terugmeldingen omhoog.', en: 'Down the production schedule, up the production performance: orders down, confirmations up.', cues: ['flows'], bp: 0.75 },
        { nl: 'Daarnaast gaan stamdata omlaag, en soms gaat een capaciteitsoverzicht omhoog.', en: 'Master data also goes down, and sometimes a capacity overview goes up.', cues: ['flows'], bp: 0.9 },
      ],
    },
    {
      id: 's2', lesson: OF, level: 2, still: 0.85, title: { nl: 'De werkorder', en: 'The work order' },
      beats: [
        { nl: 'Omlaag: het ERP stuurt de productieorder naar het MES: {n:1000} doppen, {n:25} g granulaat per dop.', en: 'Down: the ERP sends the production order to the MES: {n:1000} caps, {n:25} g of granulate per cap.', cues: ['erp', 'mes'], bp: 0.7 },
        { nl: 'Het MES maakt er een {t:Werkorder|werkorder} van: de opdracht voor één machine in één dienst.', en: 'The MES turns it into a {t:Work order|work order}: the job for one machine in one shift.', cue: { Werkorder: 'wo' }, bp: 0.6 },
        { nl: 'In de juiste volgorde: bijvoorbeeld eerst wit, dan grijs, dan zwart, zodat er minder gespoeld wordt.', en: 'In the right sequence: for example white, then grey, then black, so less purging is needed.', cues: ['wo'], bp: 0.9 },
      ],
    },
    {
      id: 's3', lesson: OF, level: 2, still: 0.85, title: { nl: 'Het recept', en: 'The recipe' },
      beats: [
        { nl: 'Bij de start stuurt het MES of de operator het {t:Recept|recept} naar de PLC.', en: 'At the start, the MES or the operator sends the {t:Recipe|recipe} to the PLC.', cue: { Recept: 'recipe' }, cues: ['plc'], bp: 0.6 },
        { nl: 'Een recept is de set instellingen voor dat product: temperaturen, snelheden, tijden.', en: 'A recipe is the set of settings for that product: temperatures, speeds, times.', cues: ['recipe'], bp: 0.6 },
        { nl: 'Zo hoeft niemand de instellingen met de hand in te typen.', en: 'That way nobody has to type the settings in by hand.', cues: ['hmi', 'plc'], bp: 0.85 },
      ],
    },
    {
      id: 's4', lesson: OF, level: 2, still: 0.85, title: { nl: 'Tellen en terugmelden', en: 'Counting and confirming' },
      beats: [
        { nl: 'Omhoog: de PLC telt, het MES verzamelt tellingen, afkeur en stilstand.', en: 'Up: the PLC counts, the MES collects counts, scrap and downtime.', cues: ['plc', 'mes', 'scrap'], bp: 0.8 },
        { nl: 'Aan het eind stuurt het MES een {t:Terugmelding|terugmelding} naar het ERP: {n:960} goed, {n:40} afkeur.', en: 'At the end the MES sends a {t:Confirmation|confirmation} to the ERP: {n:960} good, {n:40} scrap.', cue: { Terugmelding: 'conf' }, bp: 0.85 },
      ],
    },
    {
      id: 's5', lesson: OF, level: 2, still: 0.9, title: { nl: 'Op voorraad', en: 'Into stock' },
      beats: [
        { nl: 'Het ERP boekt een {t:Goederenontvangst|goederenontvangst}: de {n:960} goede doppen komen op voorraad.', en: 'The ERP books a {t:Goods receipt|goods receipt}: the {n:960} good caps go into stock.', cue: { Goederenontvangst: 'gr' }, cues: ['stock'], bp: 0.85 },
        { nl: 'In SAP bijvoorbeeld bewegingssoort (movement type) {n:101}; het verbruik gaat eraf met {n:261}.', en: 'In SAP, for example, movement type {n:101}; the material used is booked out with {n:261}.', cues: ['stock'], bp: 0.8 },
        { nl: 'Andere ERP-systemen gebruiken andere codes. Het idee blijft: product erbij, materiaal eraf.', en: 'Other ERP systems use other codes. The idea stays: product in, material out.', cues: ['gr', 'bf'], bp: 0.9 },
      ],
    },
    {
      id: 's6', lesson: OF, level: 2, still: 0.85, title: { nl: 'Backflush', en: 'Backflush' },
      beats: [
        { nl: 'Veel bedrijven gebruiken {t:Backflush|backflush}: het ERP boekt het materiaal automatisch af.', en: 'Many companies use {t:Backflush|backflush}: the ERP books the material out automatically.', cue: { Backflush: 'bf' }, bp: 0.6 },
        { nl: 'Stuklijst maal teruggemelde hoeveelheid, in plaats van elke zak granulaat te scannen.', en: 'Bill of materials times confirmed quantity, instead of scanning every bag of granulate.', cues: ['bf'], bp: 0.7 },
        { nl: 'Maar backflush rekent met de norm uit de stuklijst, niet met wat er echt verbruikt is.', en: 'But backflush calculates with the standard in the bill of materials, not with what was really used.', cues: ['bf'], bp: 0.85 },
      ],
    },
    {
      id: 's7', lesson: OF, level: 2, still: 0.95, title: { nl: 'Een kilo te veel', en: 'A kilo too much' },
      beats: [
        { nl: 'Backflush op de goede stuks: {n:960} × {n:25} g = {n:24} kg granulaat afgeboekt.', en: 'Backflush on the good parts: {n:960} × {n:25} g = {n:24} kg of granulate booked out.', cues: ['meter'], bp: 0.8 },
        { nl: 'Echt verbruikt: {n:1000} × {n:25} g = {n:25} kg, want ook de afkeur kostte materiaal.', en: 'Really used: {n:1000} × {n:25} g = {n:25} kg, because the scrap took material too.', cues: ['meter', 'scrap'], bp: 0.8 },
        { nl: 'Na deze order staat er {n:1} kg te veel granulaat in het ERP. Zo loopt het verschil op.', en: 'After this order the ERP shows {n:1} kg of granulate too much. That is how the gap grows.', cues: ['meter', 'bf'], bp: 0.8 },
        { nl: 'Oplossing: backflush op de totale hoeveelheid, of de afkeur apart als verbruik boeken.', en: 'Fix: backflush on the total quantity, or book the scrap separately as consumption.', cues: ['meter'], bp: 0.85 },
      ],
    },
    {
      id: 's8', lesson: OF, level: 2, still: 0.9, title: { nl: 'Waar het misgaat', en: 'Where it goes wrong' },
      beats: [
        { nl: 'Je hoort: ‘de voorraad in SAP klopt nooit’. Vaak zit de oorzaak in de terugmelding.', en: 'You hear: ‘stock in SAP is never right’. The cause is often in the confirmation.', cues: ['erp'], bp: 0.6 },
        { nl: 'Ze komt te laat, in de verkeerde eenheid, of de afkeur gaat niet mee.', en: 'It comes too late, in the wrong unit, or the scrap is left out.', cues: ['causes'], bp: 0.85 },
        { nl: 'Vraag: hoe vaak melden we terug, per stuk, per dienst of per order? En de afkeur ook?', en: 'Ask: how often do we confirm, per part, per shift or per order? And scrap too?', cues: ['freq'], bp: 0.6 },
        { nl: 'Per stuk is meestal te veel voor het ERP, per week te weinig voor de planner.', en: 'Per part is usually too much for the ERP; per week too little for the planner.', cues: ['freq'], bp: 0.9 },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// The film replaces the lesson's text and worked example, so this explains
// fully. No "/" or "&" in the spoken text. ERP, PLC, SAP and ISA-95 read right
// as they are; MES and HMI are said as letters (films/_kit/timeline.mjs, SAY).
// Words espeak-ng misreads are avoided ("apart", "manager", "controller") or
// split by a Dutch SAY rule (goederenontvangst). espeak-ng stresses
// PROductieplanning and PROductieprestaties; a kit rule for them would also change
// eng.ot.isa95's voice, so the narration says "de planning (de prestaties) van de
// productie" and only the captions carry the compounds.
const SAY = [
  [ // s1 two flows
    { nl: 'Eerder volgden we één order door de hele fabriek. Nu kijken we scherper naar de grens tussen niveau vier en niveau drie, tussen het ERP en het MES. ISA-95 beschrijft daar twee hoofdstromen.',
      en: 'Earlier we followed one order through the whole plant. Now we look more closely at the boundary between level four and level three, between the ERP and the MES. ISA-95 describes two main flows there.' },
    { nl: 'Omlaag gaat de planning van de productie: wat er gemaakt moet worden. Omhoog gaan de prestaties van de productie: wat er echt gemaakt en verbruikt is. Kort gezegd: orders omlaag, terugmeldingen omhoog.',
      en: 'Down goes the production schedule: what must be made. Up goes the production performance: what was really made and used. In short: orders down, confirmations up.' },
    { nl: 'Daarnaast gaan stamdata omlaag, zoals stuklijsten en routings. En soms gaat er een overzicht van de capaciteit omhoog, zodat de planner weet wat de fabriek nog aankan.',
      en: 'Master data also goes down, such as bills of materials and routings. And sometimes an overview of the capacity goes up, so the planner knows what the plant can still take on.' },
  ],
  [ // s2 the work order
    { nl: 'Eerst omlaag. Het ERP stuurt de productieorder naar het MES: {n:1000} doppen, met volgens de stuklijst {n:25} gram granulaat per dop. Dat is het plan: wat, hoeveel en wanneer.',
      en: 'First, down. The ERP sends the production order to the MES: {n:1000} caps, with {n:25} grams of granulate per cap according to the bill of materials. That is the plan: what, how many and when.' },
    { nl: 'Het MES maakt daar een {t:Werkorder|werkorder} van: de opdracht voor één lijn of machine, in één dienst. Hier is dat machine vier, in de vroege dienst.',
      en: 'The MES turns it into a {t:Work order|work order}: the job for one line or machine, in one shift. Here that is machine four, on the early shift.' },
    { nl: 'En het MES zet de werkorders in de juiste volgorde. Bijvoorbeeld eerst de witte doppen, dan de grijze en dan de zwarte, zodat de machine bij een kleurwissel minder hoeft te spoelen.',
      en: 'And the MES puts the work orders in the right sequence. For example the white caps first, then grey, then black, so the machine needs less purging at each colour change.' },
  ],
  [ // s3 the recipe
    { nl: 'Dan start de order. Het MES, of de operator op de HMI, stuurt het {t:Recept|recept} naar de PLC.',
      en: 'Then the order starts. The MES, or the operator on the HMI, sends the {t:Recipe|recipe} to the PLC.' },
    { nl: 'Een recept is de set instellingen voor dat ene product: de temperaturen, de snelheden en de tijden. Elk product heeft zijn eigen recept.',
      en: 'A recipe is the set of settings for that one product: the temperatures, the speeds and the times. Every product has its own recipe.' },
    { nl: 'Zo hoeft niemand ze met de hand in te typen. Dat scheelt tijd, en een tikfout in een temperatuur kan al snel een bak afkeur kosten.',
      en: 'That way nobody has to type them in by hand. It saves time, and a typo in a temperature can easily cost a bin of scrap.' },
  ],
  [ // s4 counting and confirming
    { nl: 'Dan omhoog. De PLC telt elke cyclus. Het MES verzamelt de tellingen, de afkeur met de reden erbij, en de stilstand. Wat er goed is en wat er afgekeurd is, weet alleen de vloer: het ERP ziet het pas als het MES het meldt.',
      en: 'Now, up. The PLC counts every cycle. The MES collects the counts, the scrap with its reasons, and the downtime. What is good and what is scrap, only the shop floor knows: the ERP sees it only when the MES reports it.' },
    { nl: 'Aan het eind van de order of de dienst stuurt het MES een {t:Terugmelding|terugmelding} naar het ERP: zoveel goed, zoveel afkeur, zoveel uur. Voor deze order: {n:960} goed en {n:40} afkeur.',
      en: 'At the end of the order or the shift, the MES sends a {t:Confirmation|confirmation} to the ERP: so many good, so many scrap, so many hours. For this order: {n:960} good and {n:40} scrap.' },
  ],
  [ // s5 into stock
    { nl: 'Het ERP boekt daarmee een {t:Goederenontvangst|goederenontvangst}: de {n:960} goede doppen komen op voorraad. De afkeur niet.',
      en: 'With it, the ERP books a {t:Goods receipt|goods receipt}: the {n:960} good caps go into stock. The scrap does not.' },
    { nl: 'Hoe dat heet, hangt af van het systeem. In SAP is de goederenontvangst voor een order bijvoorbeeld bewegingssoort {n:101}. Het verbruikte materiaal gaat eraf met bewegingssoort {n:261}: de afgifte aan de order.',
      en: 'What it is called depends on the system. In SAP, for example, the goods receipt for an order is movement type {n:101}. The material used is booked out with movement type {n:261}: the goods issue to the order.' },
    { nl: 'Andere systemen gebruiken andere codes, maar het idee is overal hetzelfde: het product komt erbij, het materiaal gaat eraf.',
      en: 'Other systems use other codes, but the idea is the same everywhere: the product comes in, the material goes out.' },
  ],
  [ // s6 backflush
    { nl: 'Maar hoe gaat dat materiaal eraf? Veel bedrijven gebruiken {t:Backflush|backflush}: het ERP boekt het automatisch af, op basis van de stuklijst en de teruggemelde hoeveelheid.',
      en: 'But how does that material go out? Many companies use {t:Backflush|backflush}: the ERP books it out automatically, from the bill of materials and the confirmed quantity.' },
    { nl: 'Niemand hoeft dus elke zak granulaat te scannen die naar de machine gaat. Dat scheelt veel handwerk. Zo zet één terugmelding vaak twee boekingen in gang: de doppen erbij en het granulaat eraf.',
      en: 'So nobody has to scan every bag of granulate that goes to the machine. That saves a lot of manual work. So one confirmation often sets off two bookings: the caps in and the granulate out.' },
    { nl: 'Maar backflush rekent met de norm. Is de afkeur hoger dan de stuklijst aanneemt, of telt alleen de goede hoeveelheid mee, dan klopt de voorraad niet meer.',
      en: 'But backflush calculates with the standard. If scrap is higher than the bill of materials assumes, or only the good quantity counts, the stock is no longer right.' },
  ],
  [ // s7 a kilo too much
    { nl: 'Reken het na voor deze order. Telt backflush alleen de goede stuks, dan boekt het ERP {n:960} maal {n:25} gram af: {n:24} kilo granulaat.',
      en: 'Work it out for this order. If backflush counts only the good parts, the ERP books out {n:960} times {n:25} grams: {n:24} kilos of granulate.' },
    { nl: 'Maar echt verbruikt is {n:1000} maal {n:25} gram: {n:25} kilo. Ook de {n:40} afgekeurde doppen kostten granulaat.',
      en: 'But what was really used is {n:1000} times {n:25} grams: {n:25} kilos. The {n:40} scrapped caps took granulate too.' },
    { nl: 'Na deze ene order staat er dus {n:1} kilo te veel granulaat in het ERP. Na een paar maanden hoor je dan: volgens SAP hebben we nog drie zakken, maar in het magazijn ligt niets meer.',
      en: 'So after this one order, the ERP shows {n:1} kilo of granulate too much. A few months on, you hear: according to SAP we have three bags left, but there is nothing in the warehouse.' },
    { nl: 'De oplossing: laat backflush rekenen met de totale hoeveelheid, goed plus afkeur. Of boek de afkeur als eigen verbruik.',
      en: 'The fix: let backflush calculate with the total quantity, good plus scrap. Or book the scrap separately as consumption.' },
  ],
  [ // s8 where it goes wrong
    { nl: 'In de praktijk hoor je: de voorraad in SAP klopt nooit. Vaak zit de oorzaak niet in het magazijn, maar in de terugmelding.',
      en: 'In practice you hear: stock in SAP is never right. Often the cause is not in the warehouse, but in the confirmation.' },
    { nl: 'Ze komt te laat. Ze staat in de verkeerde eenheid, bijvoorbeeld in stuks waar het ERP dozen verwacht. Of de afkeur gaat niet mee. Elk van die drie laat de voorraad in het ERP langzaam weglopen van wat er echt ligt.',
      en: 'It comes too late. It is in the wrong unit, for example in pieces where the ERP expects boxes. Or the scrap is left out. Each of the three makes the stock in the ERP slowly drift away from what is really there.' },
    { nl: 'Stel daarom de scherpe vraag: hoe vaak melden we terug, per stuk, per dienst of per order? En wordt de afkeur ook teruggemeld?',
      en: 'So ask the sharp question: how often do we confirm, per part, per shift or per order? And is scrap confirmed too?' },
    { nl: 'Per stuk is meestal te veel voor het ERP, per week te weinig voor de planner. Orders omlaag, terugmeldingen omhoog: klopt die terugweg, dan klopt ook de voorraad.',
      en: 'Per part is usually too much for the ERP; per week, too little for the planner. Orders down, confirmations up: when the way back is right, the stock is right too.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// Scene length from the narration (about 2.8 words a second plus a look), 60–300 s in all.
const wordsOfSay = (s) => s.beats.map((b) => b.say.nl.replace(/\{[tn]:([^}|]*)(\|[^}]*)?\}/g, '$1')).join(' ').split(/\s+/).length;
const DUR = spec.scenes.map((s) => Math.round(wordsOfSay(s) / 2.8 + 2.5));
spec.scenes.forEach((s, i) => { s.dur = DUR[i]; });
C.dur = DUR;
// A beat's still is given as its own progress (bp, 0..1) and placed in the scene
// by the caption beats (beatStarts, as the stage reads them).
{
  const res = resolveFilm(spec, await allLessons());
  spec.scenes.forEach((s, si) => {
    const fr = beatStarts(res.scenes[si], 'nl').map((x) => x / s.dur);
    s.beats.forEach((b, bi) => {
      const a0 = fr[bi];
      const a1 = bi + 1 < fr.length ? fr[bi + 1] : 1;
      b.still = Math.round((a0 + b.bp * (a1 - a0)) * 1000) / 1000;
      delete b.bp;
    });
  });
}

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
[data-cue][data-on] .ia-panel{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .ia-big{fill:var(--fp-accent-text)}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
.ia-band{fill:none;stroke:var(--fp-accent);stroke-width:2.4;stroke-dasharray:4 4}
`;

const label = {
  nl: 'Een fabriek als trapvormig gebouw, elke trede één ISA-95-niveau. Onderaan een spuitgietmachine met eigen HMI-scherm, een bak goede doppen, een kleine afkeurbak, een pallet zakken granulaat en een stelling voor gereed product. Niveau 2: de kast met de PLC. Niveau 3: de MES-terminal en serverkast. Niveau 4: het ERP op de laptop van de planner. Langs een kabel gaan de productieorder en het recept omlaag en de tellingen en de terugmelding omhoog; panelen tonen de werkorder, het recept, de voorraad en de backflush-rekensom.',
  en: 'A plant as a stepped building, each step one ISA-95 level. At the bottom an injection moulding machine with its own HMI screen, a bin of good caps, a small scrap bin, a pallet of granulate bags and a finished-goods shelf. Level 2: the cabinet with the PLC. Level 3: the MES terminal and server rack. Level 4: the ERP on the planner’s laptop. Along a cable the production order and the recipe go down and the counts and the confirmation come up; panels show the work order, the recipe, the stock and the backflush sum.',
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
  const parts = { tiers: Object.values(TIER).map((t) => tier(t)).join(''), mBase, barsBack, barsFront, rearPlaten, fixedPlaten, moving, mouldB, barrel, hopper, drive, caps, bags: bags.join('') + bagsTop, pallet, cabinet, plcCpu, ioCards, relays, terminals, scadaWall, monitors, keyboard, deskTop, kiosk, rack, qpc, officeTop, laptop, filing, sensor, valve, hmi, bin, scrapBin, shelf };
  for (const [n, v] of Object.entries(parts).sort((a, b) => b[1].length - a[1].length)) console.log(n, (compact(v).length / 1024).toFixed(1));
  console.log('stage script', (stageScript.length / 1024).toFixed(1), 'css', ((css.length + k.ISO_CSS.length) / 1024).toFixed(1));
}
