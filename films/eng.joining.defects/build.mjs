// Dev tool, not shipped. Builds the explainer film "Lasfouten vinden / Finding
// weld defects" for the topic Lasfouten en inspectie of Lassen en verbinden
// (defects L1, inspection L2, ndt L3, weldrca L4).
//
//   node films/eng.joining.defects/build.mjs            build the page
//   node films/eng.joining.defects/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.defects.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.2. The
// figure eng.joining.ndt (a test coupon on an inspection bench, an angle probe
// and a flaw detector) is the visual starting point: same coupon, same joint.
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
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The captions' {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// defects: the boom. Arc energy scales with 1 / travel speed.
const BOOM = { welds: 40, bad: 3, wps: 300, real: 405, repairH: 3.5 };
assert(near(BOOM.real / BOOM.wps - 1, 0.35, 0.005), '405 is 35 % faster than 300');
assert(near(1 - BOOM.wps / BOOM.real, 0.26, 0.005), '26 % less arc energy');
assert(near(BOOM.wps / BOOM.real, 0.74, 0.005), '300 / 405 = 0,74');
// inspection: destroyed peel-test parts, 12 robots × 3 shifts × €140
const PEEL = { robots: 12, shifts: 3, part: 140, welds: 32, button: 4.4 };
assert(PEEL.robots * PEEL.shifts * PEEL.part === 5040, '€5.040 a day');
// ndt: EXC2 hall, 160 butt welds, 10 % UT
const HALL = { welds: 160, share: 0.1 };
assert(Math.round(HALL.welds * HALL.share) === 16, '16 welds tested');
// EN 1090-2: EXC1 → D, EXC2 → C, EXC3 → B (lesson ndt)
const EXC = [['EXC1', 'D'], ['EXC2', 'C'], ['EXC3', 'B']];
// weldrca: a quarter's repairs
const RCA = { tested: 2400, lof: 41, undercut: 12, pores: 9, vertical: 33 };
RCA.repaired = RCA.lof + RCA.undercut + RCA.pores;
assert(RCA.repaired === 62, '41 + 12 + 9 = 62 m');
assert(near((100 * RCA.repaired) / RCA.tested, 2.6, 0.05), 'repair rate 2,6 %');
assert(RCA.vertical <= RCA.lof && RCA.vertical / RCA.lof > 0.75, '33 of the 41 m vertical-up');
// overwelding: weld metal grows with the throat squared
assert(near((5 / 4) ** 2, 1.56, 0.005), '(5/4)² = 1,56');
// The joint (as in the figure eng.joining.ndt, drawn here 20 mm thick): single
// V, 60° included (each flank 30° from vertical), root gap 2 mm, root face 2 mm.
// A 60° angle probe's beam (60° from vertical) meets a 30° flank square on, so
// a lack of fusion on that flank sends its echo straight back: the reason the
// lesson's 60° probe finds it. Checked as a dot product.
const T = 20;
const BEVEL = 30;
const rad = (d) => (d * Math.PI) / 180;
const flankUp = [-Math.sin(rad(BEVEL)), Math.cos(rad(BEVEL))]; // the far flank, going up (y, z)
const beam60 = [-Math.sin(rad(60)), -Math.cos(rad(60))]; // down and toward the weld
assert(Math.abs(flankUp[0] * beam60[0] + flankUp[1] * beam60[1]) < 1e-9, 'a 60° beam meets the 30° flank square on');
// the lack of fusion on the far flank, 2,5 to 6 mm above the root
const flankY = (z) => -(1 + Math.max(0, z - 2) * Math.tan(rad(BEVEL)));
const LOF = { z0: 2.5, z1: 6 };
const LOF_Z = (LOF.z0 + LOF.z1) / 2;
const LOF_D = T - LOF_Z; // depth below the top
const PROBE_HIT = flankY(LOF_Z) + LOF_D * Math.tan(rad(60)); // index point over the flaw
const ECHO_S = LOF_D / Math.cos(rad(60)); // sound path to it
assert(PROBE_HIT > 18 && PROBE_HIT < 30, `the probe sits beside the cap: ${PROBE_HIT}`);
assert(near(ECHO_S, 31.5, 0.6), `echo at about 31 mm sound path: ${ECHO_S}`);

// ---------------------------------------------------------------- the world (mm)
// x along the weld, y toward the viewer, z up; the table top is z = 0. A butt
// weld test coupon of two 20 mm plates, its cap along y = 0; the section face
// at x = XE. Behind it the flaw detector; beside it the penetrant cans.
const W = 640;
const H = 400;
const PT = T;
const XE = 110;
const XS = -110;
const CAP = { w: 26, h: 3 };
const CRACK = { x0: -34, x1: -8, y: CAP.w / 2 + 0.6 }; // the toe crack PT and MT find
const DUR = [24, 34, 32, 26, 30, 26, 36, 30, 30];
const C = {
  W, H, PT, XE, XS, CAP, CRACK, T, BEVEL, LOF, PROBE_HIT, ECHO_S, dur: DUR, BOOM, PEEL, HALL, EXC, RCA,
  DET: { x: -160, y: -150, w: 92, d: 50 }, DZ: 70,
  SOCKET: [-80, -100, 18],
  PROBE: { x: 2, a0: 64 }, // probe rest: index point at x, a0 from the weld axis
  HEAT_AX: [-0.35, 0.75, 0.62],
  YOKE: { x: CRACK.x0 + 14, y0: -4, y1: 34 },
};

const FIT = [...k.boxCorners({ x: -165, y: -160, w: 330, d: 255 }, -40, 0), [-160, -150, 90], [0, 0, 130]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 58, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0, ...plan }, z0, z1 - z0, P, plan.w > 60 ? 4 : 2, plan.w > 60 ? bevel : 0), style);
const cyl = (cx, cy, r, z0, z1, style = {}) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, r > 8 ? 28 : 14, 0), style);
const LO = { steps: 18 };
const solidOf = (pr, F, o = {}) => G.solidOf(pr, F, P, { ...LO, ...o });
const discOf = (a, b, r, F, o = {}) => G.disc(a, b, r, F, P, { ...LO, ...o });
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const onX = (x, pts) => k.pathOf(pts.map(([y, z]) => at([x, y, z])), true);
const onYf = (y, pts) => k.pathOf(pts.map(([x, z]) => at([x, y, z])), true);
const onZ = (z, pts, closed = true) => k.pathOf(pts.map(([x, y]) => at([x, y, z])), closed);
const seeded = (i) => { const s = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return s - Math.floor(s); };

// ---------------------------------------------------------------- the table
const TB = { x: -165, y: -160, w: 330, d: 255, r: 3 };
const table = (() => {
  const holes = [];
  for (let x = -150; x <= 150; x += 30) for (let y = -145; y <= 80; y += 30) holes.push(at([x, y, 0]));
  return [
    box({ x: TB.x + 14, y: TB.y + 14, w: TB.w - 28, d: TB.d - 28, r: 2 }, -40, -16, { tone: 'lo' }),
    box(TB, -16, 0, {}, 0.8),
    L(k.sideSeam(TB, -5, P, 4), { tone: 'faint' }),
    k.dotsSvg(holes, { size: 1.1, tone: 'lo' }),
  ].join('');
})();

// ---------------------------------------------------------------- the flaw detector (UT set), its screen on the front face
const detector = (() => {
  const D = C.DET;
  const yf = D.y + D.d;
  const xr = D.x + D.w;
  const feet = k.corners(D, 6).map(([x, y]) => cyl(x, y, 3.2, 0, 3, { tone: 'lo' })).join('');
  const body = box({ ...D, r: 4 }, 3, C.DZ, {}, 1);
  const lid = box(k.insetPlan({ ...D, r: 4 }, 3), C.DZ, C.DZ + 2, { crease: 'lo' }, 0.4);
  const handle = [
    box({ x: D.x + 10, y: D.y + 20, w: 5, d: 10 }, C.DZ + 2, C.DZ + 12, { crease: 'lo' }),
    box({ x: xr - 15, y: D.y + 20, w: 5, d: 10 }, C.DZ + 2, C.DZ + 12, { crease: 'lo' }),
    box({ x: D.x + 8, y: D.y + 21, w: D.w - 16, d: 8, r: 3 }, C.DZ + 12, C.DZ + 17, { tone: 'hi', crease: 'lo' }),
  ].join('');
  // the screen: a window with a grid, a baseline, the start pulse and an echo
  const sx0 = D.x + 8;
  const sx1 = D.x + 62;
  const z0 = 26;
  const z1 = 62;
  const screen = `<path class="fp-disp" d="${onYf(yf + 0.2, [[sx0, z0], [sx1, z0], [sx1, z1], [sx0, z1]])}"/>`;
  const grid = [];
  for (let i = 1; i < 6; i++) { const x = sx0 + ((sx1 - sx0) * i) / 6; grid.push(k.pathOf([[x, yf + 0.3, z0 + 1], [x, yf + 0.3, z1 - 1]].map(at))); }
  for (let i = 1; i < 4; i++) { const z = z0 + ((z1 - z0) * i) / 4; grid.push(k.pathOf([[sx0 + 1, yf + 0.3, z], [sx1 - 1, yf + 0.3, z]].map(at))); }
  const trace = [[sx0 + 2, z0 + 3], [sx0 + 4, z0 + 3], [sx0 + 5, z1 - 4], [sx0 + 6, z0 + 3], [sx0 + 23, z0 + 3], [sx0 + 24.5, z0 + 22], [sx0 + 26, z0 + 3], [sx1 - 2, z0 + 3]];
  const tr = k.pathOf(trace.map(([x, z]) => at([x, yf + 0.4, z])));
  const keys = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) keys.push(box({ x: D.x + 68 + c * 9, y: yf - 1, w: 6, d: 2 }, 30 + r * 10, 36 + r * 10, { tone: 'hi', crease: 'lo' }, 0.2));
  const knob = S(discOf(0, 4, 5, G.frameOf([D.x + 76, yf, 16], Y, X, Z)), { tone: 'hi', crease: 'lo' });
  const socket = S(solidOf([[0, 4.5], [4, 4.5], [4, 3.4], [7, 3.4]], G.frameOf(C.SOCKET, Y, X, Z)), { crease: 'lo' });
  const vents = [14, 20, 26, 32, 38, 44].map((z) => k.pathOf([[xr, D.y + 8, z], [xr, D.y + 24, z]].map(at))).join('');
  const screws = [[D.x + 4, 8], [xr - 4, 8], [D.x + 4, C.DZ - 5], [xr - 4, C.DZ - 5]].map(([x, z]) => at([x, yf, z]));
  return [
    feet, body, lid, handle,
    `<g data-cue="detector">${screen}${L(grid.join(''), { tone: 'faint' })}<path class="fp-trace" d="${tr}"/></g>`,
    keys.join(''), knob, socket,
    L(vents, { tone: 'lo' }),
    k.dotsSvg(screws, { size: 0.55 }),
    L(k.sideSeam({ ...D, r: 4 }, 20, P, 4), { tone: 'faint' }),
  ].join('');
})();

// ---------------------------------------------------------------- the coupon: two plates, the cap, the section face
const coupon = (() => {
  const far = box({ x: XS, y: -72, w: XE - XS, d: 72, r: 0 }, 0, PT, {}, 0);
  const nearP = box({ x: XS, y: 0, w: XE - XS, d: 72, r: 0 }, 0, PT, {}, 0);
  return { far, near: nearP };
})();
// the section (x = XE): the weld metal and its HAZ, drawn on the plates' end face
const G30 = Math.tan(rad(BEVEL));
const fus = (z) => (z <= 2 ? 1 : 1 + (z - 2) * G30); // the groove half-width at height z
const FT = fus(PT) + 1.6; // the cap laps over the groove edge
const SECT = (() => {
  const right = [];
  const left = [];
  for (let z = 0; z <= PT + 0.01; z += 2) { right.push([fus(z) + 0.6, z]); left.push([-(fus(z) + 0.6), z]); }
  const cap = [];
  for (let i = 0; i <= 12; i++) { const y = FT - (2 * FT * i) / 12; cap.push([y, PT + CAP.h * Math.sqrt(Math.max(0, 1 - (y / FT) ** 2))]); }
  const root = [];
  for (let i = 0; i <= 6; i++) { const y = -2.2 + (4.4 * i) / 6; root.push([y, -1 * Math.sqrt(Math.max(0, 1 - (y / 2.2) ** 2))]); }
  const weld = [...root, ...right, ...cap, ...left.reverse()];
  const hz = (z) => fus(z) + 3.6;
  const hr = [];
  const hl = [];
  for (let z = 0; z <= PT + 0.01; z += 2) { hr.push([hz(z), z]); hl.push([-hz(z), z]); }
  const haz = [[-4, -0.5], [4, -0.5], ...hr, [FT + 2.4, PT], [-FT - 2.4, PT], ...hl.reverse()];
  const passes = [5, 10, 15].map((zk) => {
    const pts = [];
    const f = fus(zk) + 0.6;
    for (let i = 0; i <= 10; i++) { const y = -f + (2 * f * i) / 10; pts.push([y, zk + 1.6 * (1 - (y / f) ** 2)]); }
    return pts;
  });
  return { weld, haz, passes };
})();
C.SECT = SECT;
C.FT = FT;
const section = (() => {
  const sec = (pts) => onX(XE + 0.15, pts);
  const line = (pts) => k.pathOf(pts.map(([y, z]) => at([XE + 0.15, y, z])));
  return `<path class="fp-hazf" d="${sec(SECT.haz)}"/><path class="fp-weld" d="${sec(SECT.weld)}"/><path class="fp-ripple" d="${SECT.passes.map(line).join('')}"/>`;
})();
// the cap bead along the whole coupon, its ripples, and what VT sees on it
const zCap = (y) => PT + CAP.h * Math.sqrt(Math.max(0, 1 - (2 * y / CAP.w) ** 2));
const cap = (() => {
  const hw = CAP.w / 2;
  const ys = [];
  for (let i = 0; i <= 10; i++) ys.push(hw - (2 * hw * i) / 10);
  const capAt = (x) => ys.map((y) => at([x, y, zCap(y)]));
  const front = [];
  const back = [];
  for (let x = XE; x >= XS - 0.01; x -= 10) { front.push(at([x, hw, PT])); back.push(at([x, -hw, PT])); }
  const fill = `<path class="fp-bead" d="${k.pathOf([...front, ...capAt(XS), ...back.reverse(), ...capAt(XE).reverse()], true)}"/>`;
  const lines = [];
  for (let x = XS + 3; x < XE - 1; x += 2.8) lines.push(k.pathOf(ys.map((y) => at([x - 1.8 * (1 - (y / hw) ** 2), y, zCap(y) + 0.05]))));
  return fill + `<path class="fp-ripple" d="${lines.join('')}"/>`;
})();
const surface = (() => {
  // surface pores (pinholes) on the cap
  const pores = [];
  for (let i = 0; i < 7; i++) {
    const x = -62 + seeded(i) * 14;
    const y = (seeded(i + 9) - 0.5) * 12;
    const r = 0.7 + seeded(i + 20) * 0.7;
    const ring = [];
    for (let kk = 0; kk < 10; kk++) { const a = (kk / 10) * Math.PI * 2; ring.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
    pores.push(`<path class="fp-pore" d="${onZ(zCap(y) + 0.1, ring)}"/>`);
  }
  // undercut: a groove melted along the near toe
  const uc = `<path class="fp-groove" d="${onZ(PT + 0.05, [[22, CAP.w / 2], [46, CAP.w / 2], [46, CAP.w / 2 + 1.4], [22, CAP.w / 2 + 1.4]])}"/>`;
  // the toe crack: hairline, nearly invisible until PT or MT shows it
  const cr = [];
  for (let i = 0; i <= 13; i++) cr.push([CRACK.x0 + ((CRACK.x1 - CRACK.x0) * i) / 13, CRACK.y + (i % 2 ? 0.35 : -0.3)]);
  return `<g data-cue="vt">${pores.join('')}${uc}</g><path class="fp-hair" d="${onZ(PT + 0.06, cr, false)}"/>`;
})();
C.CRACK_PTS = (() => { const cr = []; for (let i = 0; i <= 13; i++) cr.push([CRACK.x0 + ((CRACK.x1 - CRACK.x0) * i) / 13, CRACK.y + (i % 2 ? 0.35 : -0.3)]); return cr; })();

// ---------------------------------------------------------------- the angle probe (built at rest: index point at [0, 0, PT], facing -y)
const probe = (() => {
  const foot = { x: -8, y: -4, w: 16, d: 24, r: 1 };
  const wedge = box(foot, PT, PT + 7, { tone: 'lo' }, 0.3);
  const caseB = box({ x: -7, y: -2, w: 14, d: 20, r: 2 }, PT + 7, PT + 19, { tone: 'hi', crease: 'lo' }, 0.4);
  const conn = S(solidOf([[0, 3.2], [5, 3.2], [5, 2.4], [9, 2.4]], G.frameOf([0, 12, PT + 19], Z, X, Y)), { crease: 'lo' });
  const index = L(k.pathOf([[0, -4, PT + 1], [0, -4, PT + 6]].map(at)), { tone: 'hi' });
  const seam = L(k.sideSeam({ x: -7, y: -2, w: 14, d: 20, r: 2 }, PT + 13, P, 4), { tone: 'faint' });
  return `<g data-cue="probe">${wedge}${caseB}${seam}${conn}${index}</g>`;
})();

// ---------------------------------------------------------------- the three cans: cleaner, red penetrant, white developer
const can = (cx, cy, tone, band) => {
  const F = G.frameOf([cx, cy, 0], Z, X, Y);
  return [
    S(solidOf([[0, 9], [44, 9], [48, 7.5], [52, 4.5], [54, 4]], F), { tone: 'hi', crease: 'lo', inner: L(G.arcOf(F, 6, 9, P) + G.arcOf(F, 38, 9, P), { tone: 'faint' }) }),
    `<g class="${band}">${S(G.lathe([[14, 9.12], [30, 9.12]], F, P, LO), { tone, crease: 'none' })}</g>`,
    S(solidOf([[54, 3], [60, 3], [61, 2]], F), { tone: 'mid', crease: 'lo' }),
    box({ x: cx - 1, y: cy + 1, w: 2, d: 3 }, 57, 59, { tone: 'hi', crease: 'lo' }, 0.1),
  ].join('');
};
const cans = `<g data-cue="cans">${can(146, -70, 'lo', 'fp-cb0')}${can(146, -40, 'mid', 'fp-cb1')}${can(146, -10, 'lo', 'fp-cb2')}</g>`;

// ---------------------------------------------------------------- the magnet yoke (MT), built in place, lowered in scene 7
const yoke = (() => {
  const { x, y0, y1 } = C.YOKE;
  const leg = (y) => box({ x: x - 6, y: y - 4, w: 12, d: 8, r: 1 }, PT + 0.5, PT + 34, { tone: 'mid', crease: 'lo' }, 0.3)
    + box({ x: x - 7, y: y - 5, w: 14, d: 10, r: 1 }, PT, PT + 3, { tone: 'lo' }, 0.2);
  const bar = box({ x: x - 8, y: y0 - 6, w: 16, d: y1 - y0 + 12, r: 3 }, PT + 34, PT + 46, { tone: 'hi', crease: 'lo' }, 0.6);
  const grip = box({ x: x - 5, y: (y0 + y1) / 2 - 10, w: 10, d: 20, r: 3 }, PT + 46, PT + 54, { tone: 'lo', crease: 'lo' }, 0.4);
  const coil = [];
  for (let z = PT + 8; z <= PT + 28; z += 3) coil.push(k.pathOf([[x - 6, y0 + 4, z], [x + 6, y0 + 4, z]].map(at)), k.pathOf([[x + 6, y0 - 4, z], [x + 6, y0 + 4, z]].map(at)));
  return `<g data-cue="yoke">${leg(y0)}${L(coil.join(''), { tone: 'lo' })}${leg(y1)}${bar}${grip}</g>`;
})();

// ---------------------------------------------------------------- the preheat burner (built at rest: the nozzle tip at the origin)
const heater = (() => {
  const F = G.frameAlong([0, 0, 0], C.HEAT_AX);
  return [
    S(solidOf([[96, 6.5], [100, 7], [150, 7], [154, 5]], F), { tone: 'mid', crease: 'lo', inner: L(G.ribsOf(F, 104, 148, 7, 12, P, { least: 0.15 }), { tone: 'lo' }) }),
    S(solidOf([[18, 2.2], [96, 2.2]], F), { tone: 'hi', crease: 'lo' }),
    S(discOf(80, 86, 4.5, F), { tone: 'lo', crease: 'lo' }),
    `<g data-cue="preheat">${S(solidOf([[6, 5.5], [18, 4]], F), { tone: 'hi', crease: 'lo' })}</g>`,
  ].join('');
})();

// ---------------------------------------------------------------- the drawing
const world = [
  g('table', table),
  g('detector', detector),
  g('cable', ''),
  g('platesFar', coupon.far, ' data-cue="plates"'),
  g('platesNear', coupon.near, ' data-cue="plates"'),
  g('section', section, ' data-cue="section"'),
  g('cap', cap, ' data-cue="bead"'),
  g('surface', surface),
  g('film', `<g data-cue="dye">${g('filmDye', '')}</g>${g('filmDev', '')}<g data-cue="indic">${g('filmInd', '')}</g>`),
  g('powder', '', ' data-cue="powder"'),
  g('probe', probe),
  g('beamW', ''),
  g('cans', cans),
  g('spray', ''),
  g('yoke', yoke),
  g('flame', ''),
  g('heatT', heater),
].join('');
// HUD groups, in stage space; the stage fills their slots per frame. A slot
// that a caption's cue lights is wrapped in a static data-cue group here, since
// the player collects the cue elements once, at load.
const cueSlot = (cue, key) => `<g data-cue="${cue}">${g(key, '')}</g>`;
const hud = [
  g('scrim', `<rect class="fp-scrim" x="0" y="0" width="${W}" height="${H}"/>`),
  g('macro', [g('mBase', ''), cueSlot('mhaz', 'mHaz'), cueSlot('mweld', 'mWeld'), cueSlot('pores', 'mPores'), cueSlot('lof', 'mLof'), cueSlot('crack', 'mCrack'), cueSlot('resid', 'mResid'), cueSlot('beam', 'mBeam'), cueSlot('mprobe', 'mProbe'), g('mText', '')].join('')),
  g('dist', cueSlot('dist', 'distBody')),
  g('cards', cueSlot('iso5817', 'cardsBody')),
  g('speed', [g('speedBase', ''), cueSlot('speed', 'speedRow'), cueSlot('heatbar', 'heatBody')].join('')),
  g('loop', cueSlot('loop', 'loopBody')),
  g('peel', cueSlot('peel', 'peelBody')),
  g('docs', [cueSlot('lmb', 'lmbBody'), cueSlot('lmk', 'lmkBody')].join('')),
  g('ascan', cueSlot('ascan', 'ascanBody')),
  g('exc', [cueSlot('exc', 'excL'), g('excR', '')].join('')),
  g('grid', cueSlot('grid', 'gridBody')),
  g('cert', cueSlot('cert', 'certBody')),
  g('rate', cueSlot('rate', 'rateBody')),
  g('pareto', [g('paretoBase', ''), cueSlot('codes', 'paretoCodes'), cueSlot('vert', 'paretoVert')].join('')),
  g('oven', cueSlot('oven', 'ovenBody')),
  g('fillet', cueSlot('over', 'filletBody')),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label=""><defs><radialGradient id="fp-glow"><stop offset="0" class="fp-glow0"/><stop offset="0.35" class="fp-glow1"/><stop offset="1" class="fp-glow2"/></radialGradient></defs>${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat key
// cam(p, w, [sx, sy]): world point p lands at stage point (sx, sy) with a view w wide
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const WIDE = cam([-6, -34, 30], 640);
C.KEYS = [
  [cam([-10, -40, 24], 600), cam([XE, 0, 12], 260, [200, 260]), cam([-10, -40, 30], 600)], // s1: coupon, the section, the bench
  [WIDE, WIDE, WIDE, WIDE], // s2: the macro and the distortion card over the dimmed bench
  [cam([-30, 10, 26], 300), WIDE, WIDE, WIDE], // s3: the preheat burner, then the ISO 5817 cards, the boom
  [cam([-14, -20, 30], 420), cam([-20, 20, 22], 200), cam([-20, 20, 22], 190)], // s4: VT and the cans, then the crack
  [cam([-30, -10, 34], 380), WIDE, WIDE], // s5: probe and detector, then the peel test, the papers
  [WIDE, WIDE], // s6: macro with the beam, A-scan
  [WIDE, WIDE, cam([C.YOKE.x, 16, 30], 230), WIDE], // s7: EXC, the 160 welds, the yoke, the certificate
  [WIDE, WIDE, WIDE], // s8
  [WIDE, WIDE, WIDE], // s9
];

// ---------------------------------------------------------------- the film
const D1 = 'eng.joining.defects';
const IN = 'eng.joining.inspection';
const ND = 'eng.joining.ndt';
const RC = 'eng.joining.weldrca';
const spec = {
  id: 'eng.joining.defects',
  title: { nl: 'Lasfouten vinden', en: 'Finding weld defects' },
  lessons: [D1, IN, ND, RC],
  scenes: [
    {
      // v14b: the Basis "how it works" opening
      id: 's1', lesson: D1, level: 1, dur: DUR[0], still: 0.5, title: { nl: 'Hoe een las fout gaat', en: 'How a weld goes wrong' },
      beats: [
        { nl: 'Een las smelt twee platen samen tot één stuk staal.', en: 'A weld melts two plates together into one piece of steel.', cues: ['bead'] },
        { nl: 'In de doorsnede: het lasmetaal, en ernaast het staal dat heet werd.', en: 'In the section: the weld metal, and beside it the steel that got hot.', cues: ['section', 'mweld', 'mhaz'] },
        { nl: 'Van buiten kan een las goed lijken en van binnen fout zijn: dus kijken, meten en repareren.', en: 'A weld can look fine outside and be wrong inside: so look, measure and repair.', cues: ['detector', 'cans'] },
      ],
    },
    {
      id: 's2', lesson: D1, level: 1, dur: DUR[1], still: 0.5, title: { nl: 'Vier fouten', en: 'Four defects' },
      beats: [
        { nl: '{t:Porositeit|Porositeit}: gasbelletjes in de las, vaak doordat het beschermgas wegviel.', en: '{t:Porosity|Porosity}: gas bubbles in the weld, often because the shielding gas was lost.', cue: { Porositeit: 'pores' } },
        { nl: 'Een {t:Bindingsfout|bindingsfout}: het lasmetaal ligt tegen de flank, maar smolt er niet in.', en: '{t:Lack of fusion|Lack of fusion}: the weld metal lies against the side wall but never melted into it.', cue: { Bindingsfout: 'lof' } },
        { nl: 'Een {t:Waterstofscheur|waterstofscheur} komt uren later, naast de las. Een scheur mag nooit.', en: 'A {t:Hydrogen crack|hydrogen crack} comes hours later, beside the weld. A crack is never allowed.', cue: { Waterstofscheur: 'crack' } },
        { nl: '{t:Vervorming|Vervorming}: de las krimpt bij het afkoelen en trekt de platen krom.', en: '{t:Distortion|Distortion}: the weld shrinks as it cools and pulls the plates out of line.', cue: { Vervorming: 'dist' } },
      ],
    },
    {
      id: 's3', lesson: D1, level: 1, dur: DUR[2], still: 0.4, title: { nl: 'Voorkomen en grenzen', en: 'Prevention and limits' },
      beats: [
        { nl: '{t:Voorwarmen|Voorwarmen}, tot bijvoorbeeld {n:100} °C, en droge draad houden waterstof buiten.', en: '{t:Preheating|Preheating}, to {n:100} °C for example, and dry wire keep hydrogen out.', cue: { Voorwarmen: 'preheat' } },
        { nl: '{t:ISO 5817|ISO 5817} zegt hoe groot een fout mag zijn: niveau B is streng, C normaal, D licht.', en: '{t:ISO 5817|ISO 5817} sets how big a defect may be: level B is strict, C normal, D light.', cue: { 'ISO 5817': 'iso5817' } },
        { nl: 'Een giek: {n:3} van {n:40} lassen met bindingsfout, gelast op {n:405} in plaats van {n:300} mm/min.', en: 'A boom: {n:3} of {n:40} welds with lack of fusion, welded at {n:405} instead of {n:300} mm/min.', cues: ['speed'], read: { nl: '{n:405} / {n:300} = 1,35: {n:35}% te snel', en: '{n:405} / {n:300} = 1.35: {n:35}% too fast' } },
        { nl: 'Dat is {n:26}% minder warmte. Elke reparatie kost zo’n {n:3.5} uur.', en: 'That is {n:26}% less heat. Each repair takes about {n:3.5} hours.', cues: ['heatbar', 'loop'], read: { nl: '{n:300} / {n:405} = {n:0.74}', en: '{n:300} / {n:405} = {n:0.74}' } },
      ],
    },
    {
      id: 's4', lesson: IN, level: 2, dur: DUR[3], still: 0.5, title: { nl: 'Kijken en penetrant', en: 'Looking, and penetrant' },
      beats: [
        { nl: 'Controleren zonder iets kapot te maken heet {t:NDO|NDO}. Kijken komt eerst.', en: 'Checking without breaking anything is called {t:NDT|NDT}. Looking comes first.', cue: { NDO: 'vt' } },
        { nl: '{t:Penetrantonderzoek|Penetrantonderzoek}: een rode vloeistof trekt in de scheur.', en: '{t:Dye penetrant|Dye penetrant} testing: a red liquid seeps into the crack.', cue: { Penetrantonderzoek: 'dye' } },
        { nl: 'Afvegen, witte ontwikkelaar erop: de scheur verschijnt als een rood lijntje.', en: 'Wipe it off, spray on white developer: the crack shows as a red line.', cues: ['indic'] },
      ],
    },
    {
      id: 's5', lesson: IN, level: 2, dur: DUR[4], still: 0.5, title: { nl: 'In de las kijken', en: 'Looking inside the weld' },
      beats: [
        { nl: '{t:Ultrasoon onderzoek|Ultrasoon onderzoek}: geluid kaatst terug op een fout binnenin.', en: '{t:Ultrasonic testing|Ultrasonic testing}: sound bounces back off a flaw inside.', cue: { 'Ultrasoon onderzoek': 'probe' }, cues: ['detector'] },
        { nl: 'Kapotmaken kost: {n:12} robots × {n:3} ploegen × €{n:140} = €{n:5040} per dag.', en: 'Breaking parts costs: {n:12} robots × {n:3} shifts × €{n:140} = €{n:5040} a day.', cues: ['peel'] },
        { nl: 'De {t:LMB|LMB} is het lasrecept; de {t:LMK|LMK} bewijst met een proefstuk dat het werkt.', en: 'The {t:WPS|WPS} is the welding recipe; the {t:WPQR|WPQR} proves with a test piece that it works.', cue: { LMB: 'lmb', LMK: 'lmk' } },
      ],
    },
    {
      id: 's6', lesson: ND, level: 3, dur: DUR[5], still: 0.6, title: { nl: 'Hoekkop en A-scan', en: 'Angle probe and A-scan' },
      beats: [
        { nl: 'Een {t:Hoekkop|hoekkop} stuurt het geluid schuin in, vaak onder {n:45}, {n:60} of {n:70} graden.', en: 'An {t:Angle probe|angle probe} sends the sound in at a slant, often at {n:45}, {n:60} or {n:70} degrees.', cue: { Hoekkop: 'mprobe' }, cues: ['beam'] },
        { nl: 'Op de {t:A-scan|A-scan} is elke piek een echo; deze komt boven de referentielijn uit.', en: 'On the {t:A-scan|A-scan} each peak is an echo; this one rises above the reference line.', cue: { 'A-scan': 'ascan' } },
      ],
    },
    {
      id: 's7', lesson: ND, level: 3, dur: DUR[6], still: 0.5, title: { nl: 'Wie kiest, wie test', en: 'Who chooses, who tests' },
      beats: [
        { nl: 'De {t:Uitvoeringsklasse|uitvoeringsklasse} geeft het niveau: EXC1 is D, EXC2 is C, EXC3 is B.', en: 'The {t:Execution class|execution class} sets the level: EXC1 is D, EXC2 is C, EXC3 is B.', cue: { Uitvoeringsklasse: 'exc' } },
        { nl: 'Hal in EXC2: {n:160} stompe lassen, {n:10}% ultrasoon is {n:16} lassen, op niveau C.', en: 'A hall in EXC2: {n:160} butt welds, {n:10}% ultrasonic is {n:16} welds, at level C.', cues: ['grid'] },
        { nl: '{t:Magnetisch onderzoek|Magnetisch onderzoek}: ijzerpoeder hoopt zich op bij een scheur.', en: '{t:Magnetic particle testing|Magnetic particle testing}: iron powder gathers at a crack.', cue: { 'Magnetisch onderzoek': 'yoke' }, cues: ['powder'] },
        { nl: 'Wie test, heeft {t:ISO 9712|ISO 9712}: niveau {n:2} test en beoordeelt, niveau {n:3} schrijft procedures.', en: 'Whoever tests holds {t:ISO 9712|ISO 9712}: level {n:2} tests and assesses, level {n:3} writes procedures.', cue: { 'ISO 9712': 'cert' } },
      ],
    },
    {
      id: 's8', lesson: RC, level: 4, dur: DUR[7], still: 0.5, title: { nl: 'Van reparatie naar oorzaak', en: 'From repairs to the cause' },
      beats: [
        { nl: '{t:Reparatiepercentage|Reparatiepercentage}: {n:62} m gerepareerd van {n:2400} m getest is {n:2.6}%.', en: '{t:Repair rate|Repair rate}: {n:62} m repaired of {n:2400} m tested is {n:2.6}%.', cue: { Reparatiepercentage: 'rate' } },
        { nl: 'Elke fout krijgt een code uit {t:ISO 6520-1|ISO 6520-1}: {n:401} is bindingsfout.', en: 'Each defect gets a code from {t:ISO 6520-1|ISO 6520-1}: {n:401} is lack of fusion.', cue: { 'ISO 6520-1': 'codes' } },
        { nl: '{n:41} m bindingsfout, {n:12} m randinkarteling, {n:9} m poriën; {n:33} m daarvan verticaal opgaand.', en: '{n:41} m lack of fusion, {n:12} m undercut, {n:9} m pores; {n:33} m of it welded vertical-up.', cues: ['vert'] },
      ],
    },
    {
      id: 's9', lesson: RC, level: 4, dur: DUR[8], still: 0.5, title: { nl: 'Restspanning en overlassen', en: 'Residual stress and overwelding' },
      beats: [
        { nl: '{t:Restspanning|Restspanning}: de las wil krimpen, het koude staal houdt hem tegen.', en: '{t:Residual stress|Residual stress}: the weld wants to shrink, the cold steel holds it back.', cue: { Restspanning: 'resid' } },
        { nl: '{t:Spanningsarmgloeien|Spanningsarmgloeien}: in een oven langzaam opwarmen en afkoelen.', en: '{t:Stress relieving|Stress relieving}: heating slowly in a furnace and cooling slowly.', cue: { Spanningsarmgloeien: 'oven' } },
        { nl: '{t:Overlassen|Overlassen}: keel {n:5} in plaats van {n:4} geeft {n:56}% meer lasmetaal.', en: '{t:Overwelding|Overwelding}: throat {n:5} instead of {n:4} means {n:56}% more weld metal.', cue: { Overlassen: 'over' }, read: { nl: '({n:5} / {n:4})² = {n:1.56}', en: '({n:5} / {n:4})² = {n:1.56}' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. A term is named while its cue is
// lit. Numbers the voice would read badly (2.400, €5.040, 3,5 h) are written
// as said; the caption carries them as checked numbers.
const SAY = [
  [ // s1 how a weld goes wrong
    { nl: 'Twee stalen platen, aan elkaar gelast: de las smelt hun randen samen tot één stuk staal.',
      en: 'Two steel plates, welded together: the weld melts their edges into one piece of steel.' },
    { nl: 'In de doorsnede zie je het lasmetaal, en ernaast een zone die heet werd. Daar ontstaan de fouten.',
      en: 'In the section you see the weld metal, and beside it a zone that got hot. That is where defects form.' },
    { nl: 'Van buiten kan een las prachtig lijken, en van binnen fout zijn. Daarom wordt elke las gecontroleerd, en een foute las gerepareerd.',
      en: 'A weld can look perfect from outside and be wrong inside. So every weld is checked, and a bad weld gets repaired.' },
  ],
  [ // s2 four defects
    { nl: 'Eerst {t:Porositeit|porositeit}: gasbelletjes in de las. Meestal viel het beschermgas weg, bijvoorbeeld door tocht. Een paar kleine poriën mag vaak, een hele rij niet.',
      en: 'First {t:Porosity|porosity}: gas bubbles in the weld. Usually the shielding gas was lost, through a draught for example. A few small pores are often allowed; a whole row is not.' },
    { nl: 'De meest gevreesde fout is de {t:Bindingsfout|bindingsfout}: het lasmetaal ligt tegen de schuine flank van de plaat, maar smolt er nooit in. Van buiten zie je niets, en onder wisselende belasting groeit de spleet uit tot een scheur. De oorzaak: te weinig warmte, of te snel lassen.',
      en: 'The most feared defect is {t:Lack of fusion|lack of fusion}: the weld metal lies against the slanted side wall of the plate, but never melted into it. From outside you see nothing, and under changing loads the gap grows into a crack. The cause: too little heat, or welding too fast.' },
    { nl: 'Dan de {t:Waterstofscheur|waterstofscheur}: vocht brengt waterstof in de las, en uren later scheurt het harde staal ernaast open. Een scheur mag nooit.',
      en: 'Then the {t:Hydrogen crack|hydrogen crack}: moisture brings hydrogen into the weld, and hours later the hard steel beside it cracks open. A crack is never allowed.' },
    { nl: 'En {t:Vervorming|vervorming}: de las krimpt bij het afkoelen, en trekt de platen krom. Klemmen, vooraf schuin zetten en een slimme lasvolgorde helpen.',
      en: 'And {t:Distortion|distortion}: the weld shrinks as it cools, and pulls the plates out of line. Clamps, pre-setting the parts and a smart welding sequence help.' },
  ],
  [ // s3 prevention and limits
    { nl: 'Tegen waterstof helpen droge draad en {t:Voorwarmen|voorwarmen}, tot bijvoorbeeld {n:100} graden: dan koelt de las trager af. Bij dik staal wacht de controle vaak {n:16} tot {n:48} uur.',
      en: 'Against hydrogen, dry wire helps, and so does {t:Preheating|preheating}, to {n:100} degrees for example: the weld then cools more slowly. On thick steel the final check often waits {n:16} to {n:48} hours.' },
    { nl: 'Hoe groot mag een fout zijn? Dat zegt {t:ISO 5817|ISO 5817}. Niveau B is het strengst, voor kranen en drukdelen. C is normaal constructiewerk, D licht werk.',
      en: 'How big may a defect be? That is set by {t:ISO 5817|ISO 5817}. Level B is the strictest, for cranes and pressure parts. C is normal structural work, D light work.' },
    { nl: 'Bindingsfouten in drie van de veertig lassen van een giek. Voorgeschreven was {n:300} millimeter per minuut, gelast werd op {n:405}: {n:35} procent te snel.',
      en: 'Take lack of fusion in three of the forty welds on a boom. The procedure said {n:300} millimetres per minute; the welds were made at {n:405}: {n:35} percent too fast.' },
    { nl: 'Dat is {n:26} procent minder warmte. Elke reparatie kost zo’n drieënhalf uur.',
      en: 'That is {n:26} percent less heat. Each repair takes about three and a half hours.' },
  ],
  [ // s4 looking, and penetrant
    { nl: 'Controleren zonder kapot te maken heet {t:NDO|NDO}: niet-destructief onderzoek. Het begint met kijken, naar de lasmaat, randinkarteling, poriën en scheuren.',
      en: 'Checking without breaking is called {t:NDT|NDT}: non-destructive testing. It starts with looking, at the weld size, undercut, pores and cracks.' },
    { nl: 'Een fijne scheur zie je vaak niet. Bij {t:Penetrantonderzoek|penetrantonderzoek} trekt een rode vloeistof in de scheur.',
      en: 'A fine crack is often invisible. In {t:Dye penetrant|dye penetrant} testing a red liquid seeps into the crack.' },
    { nl: 'Afvegen, een witte ontwikkelaar erop, en die zuigt de vloeistof terug: een rood lijntje. Snel en goedkoop, maar alleen aan het oppervlak.',
      en: 'Wipe it off, spray on a white developer, and it draws the liquid back out: a red line. Quick and cheap, but only at the surface.' },
  ],
  [ // s5 looking inside
    { nl: 'Voor fouten binnenin is er {t:Ultrasoon onderzoek|ultrasoon onderzoek}: een meetkop stuurt geluidspulsen het staal in, en een bindingsfout kaatst ze terug. Een getrainde operator leest het echobeeld. Röntgen ziet ronde poriën beter.',
      en: 'For flaws inside there is {t:Ultrasonic testing|ultrasonic testing}: a probe sends sound pulses into the steel, and a lack of fusion bounces them back. A trained operator reads the echo screen. X-ray sees round pores better.' },
    { nl: 'Kapotmaken kan ook. Een carrosseriebouw met {n:12} robots scheurt per robot per ploeg een onderdeel open, en meet alle {n:32} punten: minstens {n:4.4} millimeter. Bij {n:140} euro per stuk is dat vijfduizend veertig euro per dag.',
      en: 'Breaking parts works too. A body shop with {n:12} robots tears open one part per robot per shift, and measures all {n:32} welds: at least {n:4.4} millimetres. At {n:140} euros a part, that is five thousand and forty euros a day.' },
    { nl: 'De {t:LMB|LMB}, de lasmethodebeschrijving, is het recept bij de werkplek. De {t:LMK|LMK}, de lasmethodekwalificatie, bewijst met een getest proefstuk dat het werkt.',
      en: 'The {t:WPS|WPS}, the welding procedure specification, is the recipe at the workstation. The {t:WPQR|WPQR}, the procedure qualification record, proves with a tested piece that it works.' },
  ],
  [ // s6 angle probe and A-scan
    { nl: 'De operator zet een {t:Hoekkop|hoekkop} naast de las. Die stuurt het geluid schuin in, vaak onder {n:45}, {n:60} of {n:70} graden. Hier raakt de bundel van {n:60} graden de flank recht van voren, waar de bindingsfout ligt.',
      en: 'The operator places an {t:Angle probe|angle probe} next to the weld. It sends the sound in at a slant, often at {n:45}, {n:60} or {n:70} degrees. Here the {n:60} degree beam meets the side wall head on, where the lack of fusion lies.' },
    { nl: 'Op de {t:A-scan|A-scan} staat links de startpuls, en elke piek daarna is een echo: hoe verder naar rechts, hoe langer de geluidsweg. Hij vergelijkt de piek met een referentie uit een ijkblok, en meet de lengte.',
      en: 'On the {t:A-scan|A-scan} the start pulse is on the left, and each peak after it is an echo: the further right, the longer the sound path. The operator compares it with a reference from a calibration block, and measures the length.' },
  ],
  [ // s7 who chooses, who tests
    { nl: 'Wie kiest het niveau? De ontwerper of de klant, op de tekening. In de staalbouw geeft de {t:Uitvoeringsklasse|uitvoeringsklasse} een standaard: EXC1 hoort bij D, EXC2 bij C, EXC3 bij B.',
      en: 'Who chooses the level? The designer or the customer, on the drawing. In structural steel the {t:Execution class|execution class} gives a default: EXC1 goes with D, EXC2 with C, EXC3 with B.' },
    { nl: 'Een hal in EXC2 heeft {n:160} stompe lassen, en de specificatie vraagt {n:10} procent ultrasoon: {n:16} lassen. Een afgekeurde las wordt hersteld en opnieuw getest.',
      en: 'A hall in EXC2 has {n:160} butt welds, and the specification asks for {n:10} percent ultrasonic: {n:16} welds. A rejected weld is repaired and tested again.' },
    { nl: 'Snel, ook op hoeklassen, is {t:Magnetisch onderzoek|magnetisch onderzoek}: een magneetjuk magnetiseert het staal, en ijzerpoeder hoopt zich op bij scheuren, ook net onder het oppervlak.',
      en: 'Quick, on fillet welds too, is {t:Magnetic particle testing|magnetic particle testing}: a magnet yoke magnetises the steel, and iron powder gathers at cracks, also just below the surface.' },
    { nl: 'Wie test, is gecertificeerd volgens {t:ISO 9712|ISO 9712}: niveau {n:2} test en beoordeelt, niveau {n:3} schrijft de procedures. Een test te vroeg na het lassen telt niet.',
      en: 'Whoever tests is certified to {t:ISO 9712|ISO 9712}: level {n:2} tests and assesses, level {n:3} writes the procedures. A test too soon after welding does not count.' },
  ],
  [ // s8 from repairs to the cause
    { nl: 'Een manager kijkt naar het {t:Reparatiepercentage|reparatiepercentage}: gerepareerde las gedeeld door geteste las. Tweeduizend vierhonderd meter getest, {n:62} gerepareerd: {n:2.6} procent.',
      en: 'A manager watches the {t:Repair rate|repair rate}: weld repaired divided by weld tested. Two thousand four hundred metres tested, {n:62} repaired: {n:2.6} percent.' },
    { nl: 'Leg elke fout vast met een code uit {t:ISO 6520-1|ISO 6520-1}, zoals {n:401} voor bindingsfout, plus de lasser, de positie en de ploeg. Zet dat in een pareto.',
      en: 'Record every defect with a code from {t:ISO 6520-1|ISO 6520-1}, such as {n:401} for lack of fusion, plus the welder, the position and the shift. Put that in a Pareto.' },
    { nl: '{n:41} meter bindingsfout, {n:12} meter randinkarteling, {n:9} meter poriën. En {n:33} van die {n:41} meter is verticaal opgaand gelast, bij alle lassers. De fout volgt de positie, niet de persoon: kijk naar de techniek en de LMB daar.',
      en: '{n:41} metres of lack of fusion, {n:12} of undercut, {n:9} of pores. And {n:33} of those {n:41} metres were welded vertical-up, by all the welders. The defect follows the position, not the person: look at the technique and the WPS there.' },
  ],
  [ // s9 residual stress and overwelding
    { nl: 'Na het lassen blijft er {t:Restspanning|restspanning} achter: de las wil krimpen, en het koude staal houdt hem tegen. Verspaan je later, dan trekt het onderdeel krom.',
      en: 'After welding, {t:Residual stress|residual stress} stays behind: the weld wants to shrink, and the cold steel holds it back. Machine it later, and the part warps.' },
    { nl: 'Daarom eerst {t:Spanningsarmgloeien|spanningsarmgloeien}: in de oven langzaam opwarmen, vasthouden, en langzaam afkoelen.',
      en: 'So first comes {t:Stress relieving|stress relieving}: in a furnace, heat slowly, hold, and cool slowly.' },
    { nl: 'En de stille kostenpost: {t:Overlassen|overlassen}. Lasmetaal groeit met het kwadraat van de keel: keel {n:5} in plaats van {n:4} kost {n:56} procent meer draad, tijd en warmte.',
      en: 'And the silent cost: {t:Overwelding|overwelding}. Weld metal grows with the square of the throat: throat {n:5} instead of {n:4} costs {n:56} percent more wire, time and heat.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Reduced motion: each beat's still sits late in that beat, where the stage
// has drawn what the beat names. The beat starts come from the resolved captions
// (with the Dutch glosses), exactly as the stage reads them.
{
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
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
:root{--fp-hot:#FFF4DC;--fp-dye:#C8644F;--fp-dev:#F4EFE3}
.iso[data-theme="light"]{--fp-hot:#FFFFFF;--fp-dye:#A8432F;--fp-dev:#FFFFFF}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-steel{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-scrim{fill:var(--anatomy-card);opacity:.9}
.fp-card{fill:var(--anatomy-paper);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-rule{fill:none;stroke:var(--anatomy-lo);stroke-width:3;stroke-linecap:round}
.fp-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-fill{fill:var(--anatomy-mid);opacity:.55}
.fp-disp{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-trace{fill:none;stroke:var(--anatomy-hi);stroke-width:.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-hose{fill:none;stroke:var(--anatomy-shade-0);stroke-linecap:round;stroke-linejoin:round}
.fp-hose-hi{fill:none;stroke:var(--anatomy-lo);stroke-linecap:round;stroke-linejoin:round}
.fp-bead{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:.9;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-ripple{fill:none;stroke:var(--anatomy-mid);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-hazf{fill:var(--anatomy-lo);opacity:.55;stroke:var(--anatomy-mid);stroke-width:.5;vector-effect:non-scaling-stroke}
.fp-weld{fill:var(--anatomy-shade-3);stroke:var(--anatomy-hi);stroke-width:.9;vector-effect:non-scaling-stroke}
.fp-pore{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-groove{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:.4;vector-effect:non-scaling-stroke}
.fp-hair{fill:none;stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-gap{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-crack{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-dyef{fill:var(--fp-dye);stroke:none}
.fp-dyel{fill:none;stroke:var(--fp-dye);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-devf{fill:var(--fp-dev);stroke:var(--anatomy-mid);stroke-width:.4;vector-effect:non-scaling-stroke}
.fp-mist{fill:var(--anatomy-hi);stroke:none}
.fp-beam{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-beamw{fill:var(--anatomy-hi);opacity:.12;stroke:none}
.fp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:6 5;vector-effect:non-scaling-stroke}
.fp-grid{fill:none;stroke:var(--anatomy-faint);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-sig{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-cell{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-cell-on{fill:var(--anatomy-mid);stroke:var(--anatomy-hi);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-flame{fill:var(--fp-hot);stroke:var(--anatomy-hi);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-glow0{stop-color:var(--fp-hot);stop-opacity:1}
.fp-glow1{stop-color:var(--fp-hot);stop-opacity:.55}
.fp-glow2{stop-color:var(--fp-hot);stop-opacity:0}
.iso[data-theme="light"] .fp-glow1{stop-color:var(--anatomy-lo);stop-opacity:.35}
.iso[data-theme="light"] .fp-glow2{stop-color:var(--anatomy-lo);stop-opacity:0}
.fp-powder{fill:var(--anatomy-hi);stroke:none}
.fp-cb1 .iso-top,.fp-cb1 .iso-shade,.fp-cb1 .iso-fill{fill:var(--fp-dye)}
.fp-cb2 .iso-top,.fp-cb2 .iso-shade,.fp-cb2 .iso-fill{fill:var(--fp-dev)}
[data-cue][data-on] .fp-bead,[data-cue][data-on] .fp-card,[data-cue][data-on] .fp-bar,[data-cue][data-on] .fp-weld,[data-cue][data-on] .fp-cell-on{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-hazf,[data-cue][data-on] .fp-fill,[data-cue][data-on] .fp-cell-on{fill:var(--fp-accent);opacity:.7}
[data-cue][data-on] .fp-pore,[data-cue][data-on] .fp-gap,[data-cue][data-on] .fp-groove{stroke:var(--fp-accent);stroke-width:1.6}
[data-cue][data-on] .fp-crack,[data-cue][data-on] .fp-rule,[data-cue][data-on] .fp-sig,[data-cue][data-on] .fp-beam,[data-cue][data-on] .fp-trace,[data-cue][data-on] .fp-dash{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-disp{stroke:var(--fp-accent);stroke-width:1.4}
[data-cue][data-on] .fp-powder,[data-cue][data-on] .fp-mist{fill:var(--fp-accent)}
[data-cue][data-on] .fp-beamw{fill:var(--fp-accent);opacity:.22}
`;

const label = {
  nl: 'Een inspectietafel met een gelast proefstuk van twee stalen platen, een ultrasoon apparaat met een hoekkop aan een kabel, drie spuitbussen voor penetrantonderzoek, een voorwarmbrander en een magneetjuk; daarover een doorsnede van de las met poriën, een bindingsfout en een scheur, de kwaliteitsniveaus B, C en D, een A-scan, en grafieken van reparaties.',
  en: 'An inspection bench with a welded test coupon of two steel plates, an ultrasonic set with an angle probe on a cable, three spray cans for penetrant testing, a preheat burner and a magnet yoke; over it a section of the weld with pores, a lack of fusion and a crack, the quality levels B, C and D, an A-scan, and charts of repairs.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
