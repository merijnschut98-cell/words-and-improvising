// Dev tool, not shipped. Builds the explainer film "Van boog tot scheur / From
// arc to crack" for the topic Booglassen of Lassen en verbinden (arc L1,
// weldparams L2, wps L3, metallurgy L4).
//
//   node films/eng.joining.arc/build.mjs            build the page
//   node films/eng.joining.arc/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.joining.arc.html: one offline page with
// the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.2.
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
// value drifts). The captions' {n:...} numbers are then checked against the
// Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// arc: E = U·I·60 / (v·1000); Q = k·E with k = 0,8 for MAG (EN 1011-1)
const arcOf = (u, i, v) => (u * i * 60) / (v * 1000);
const E = arcOf(24, 220, 400);
assert(near(E, 0.79, 0.005), `arc energy ${E}`);
assert(near(0.8 * E, 0.63, 0.005), 'heat input 0,63 kJ/mm');
assert(0.8 * E > 0.5 && 0.8 * E < 0.9, 'inside the 0,5–0,9 procedure');
assert(near(arcOf(25, 200, 300), 1.0, 1e-9), 'recall: 25 V, 200 A, 300 mm/min → 1,0');
// gas: 15 → 5 L/min is under the sensor's 10 L/min trip level
const GAS = { normal: 15, kinked: 5, trip: 10 };
assert(GAS.kinked < GAS.trip && GAS.normal > GAS.trip, 'the sensor trips between 15 and 5');
// weldparams: Ø1,2 wire at 10 m/min, steel 7,85 g/cm³ → 5,3 kg/h
const dep = (Math.PI / 4) * 1.2 * 1.2 * 10000 / 1000 * 7.85 * 60 / 1000;
assert(near(dep, 5.3, 0.05), `deposition ${dep}`);
// wps: test plate 12 mm → up to 2 × 12 = 24 mm; heat input 1,2 kJ/mm + 25 % = 1,5
const WPS = { t: 12, tMin: 3, tMax: 2 * 12, order: 22, q: 1.2, qMax: 1.2 * 1.25, want: 1.6 };
assert(WPS.tMax === 24 && WPS.order <= WPS.tMax, '22 mm is inside 3–24 mm');
assert(near(WPS.qMax, 1.5, 1e-9) && WPS.want > WPS.qMax, '1,6 is outside the 1,5 limit');
// metallurgy: CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 for the 40 mm crane flange
const CEV = 0.17 + 1.5 / 6 + 0.1 / 5 + 0.3 / 15;
assert(near(CEV, 0.46, 1e-9), `CEV ${CEV}`);
// t8/5 for the cooling curve drawn in scene 7 (EN 1011-2 annex D, 3D heat flow).
// The film's joint is a multi-run V butt weld: F3 = 0,9 (Table D.1, "between
// beads in butt welds"). The figure eng.joining.haz shows a different joint, a
// fillet weld on a T-joint (F3 = 0,67), so it cools faster. Both use the same
// case otherwise (Q 1,0 kJ/mm, no preheat, thick plate: 3D flow), and both land
// in the short (hard) band under about 7 s: the film about 4,8 s, the figure
// about 3,5 s. The film shows no number on its chart, so the learner never sees
// two values for one case; the figure is where t8/5 is computed and read.
const F3_BUTT = 0.9;
const F3_TJOINT = 0.67; // eng.joining.haz
const t85Of = (T0, Q, F3 = F3_BUTT) => (6700 - 5 * T0) * Q * (1 / (500 - T0) - 1 / (800 - T0)) * F3;
const T85 = t85Of(20, 1.0);
assert(T85 > 4 && T85 < 7, `t8/5 ${T85}`);
assert(t85Of(20, 1.0, F3_TJOINT) < T85, 'the T-joint of the figure cools faster than this butt weld');
assert(t85Of(150, 1.0) > T85, 'preheat lengthens t8/5');

// ---------------------------------------------------------------- the world (mm)
// x along the weld (the torch travels toward -x), y toward the viewer, z up.
// The table top is z = 0; two 20 mm plates with a 60° V groove meet at y = 0.
const W = 640;
const H = 400;
const PT = 20; // plate thickness (drawn)
const XE = 110; // the plates' +x end: the section face
const XS = -110;
const GROOVE = { gap: 1, face: 2, top: 1 + 18 * Math.tan(Math.PI / 6) }; // root gap half, root face, groove half-width at the top
const DUR = [19, 14, 19, 20, 16, 24, 19, 19];
const MAG_AX = [0.3, -0.18, 1];
const TIG_AX = [0.32, -0.2, 1];
const HEAT_AX = [-0.35, 0.75, 0.62];
const C = {
  W, H, PT, XE, XS, GROOVE, dur: DUR, MAG_AX, TIG_AX, HEAT_AX, T85,
  MACH: { x: -158, y: -152, w: 82, d: 58 }, MZ: 74,
  SOCKET: [-100, -94, 24], REG: [-48, -138, 132],
  PIPE: { y: -124, r: 13, x0: 28, x1: 150, weld: 92 },
  MAG_TOP: 146, // s of the MAG torch's back end
  DIAL: [74, 326], MAG: [500, 214], MAG_R: 112,
  FLOW: [56, 90, 300], // rotameter x, top y, bottom y
  CHART: { x: 24, y: 200, w: 256, h: 180 },
  MACRO: { x: 300, y: 18, w: 320, h: 222 },
  GAS, WPS, CEV,
};

const FIT = [
  ...k.boxCorners({ x: -165, y: -160, w: 330, d: 255 }, -40, 0),
  [-50, -136, 150], [-150, -150, 80], [0, 0, 150],
];
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
const solidOf = (pr, F, P_, o = {}) => G.solidOf(pr, F, P_, { ...LO, ...o });
const discOf = (a, b, r, F, P_, o = {}) => G.disc(a, b, r, F, P_, { ...LO, ...o });
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const onX = (x, pts) => k.pathOf(pts.map(([y, z]) => at([x, y, z])), true); // a polygon on the plane x = const
const onYf = (y, pts) => k.pathOf(pts.map(([x, z]) => at([x, y, z])), true); // on the plane y = const

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

// ---------------------------------------------------------------- the power source with its wire feeder
const machine = (() => {
  const M = C.MACH;
  const yf = M.y + M.d; // front face
  const xr = M.x + M.w; // right face
  const feet = k.corners(M, 6).map(([x, y]) => cyl(x, y, 3.2, 0, 3, { tone: 'lo' })).join('');
  const body = box({ ...M, r: 3 }, 3, C.MZ, {}, 1);
  const lid = box({ ...k.insetPlan({ ...M, r: 3 }, 3) }, C.MZ, C.MZ + 2, { crease: 'lo' }, 0.4);
  const handle = [
    box({ x: M.x + 20, y: M.y + 24, w: 5, d: 10 }, C.MZ + 2, C.MZ + 12, { crease: 'lo' }),
    box({ x: M.x + 57, y: M.y + 24, w: 5, d: 10 }, C.MZ + 2, C.MZ + 12, { crease: 'lo' }),
    box({ x: M.x + 18, y: M.y + 25, w: 46, d: 8, r: 3 }, C.MZ + 12, C.MZ + 17, { tone: 'hi', crease: 'lo' }),
  ].join('');
  // front panel: an inset plate with two displays, two knobs, the torch socket and a switch
  const panel = onYf(yf + 0.1, [[M.x + 6, 30], [xr - 6, 30], [xr - 6, 68], [M.x + 6, 68]]);
  const disp = (x0) => `<path class="fp-disp" d="${onYf(yf + 0.2, [[x0, 54], [x0 + 26, 54], [x0 + 26, 64], [x0, 64]])}"/>`;
  const knob = (x, z) => S(discOf(0, 5, 5.5, G.frameOf([x, yf, z], Y, X, Z), P), { tone: 'hi', crease: 'lo' })
    + k.dotsSvg([at([x, yf + 5, z + 3])], { size: 0.6, tone: 'hi' });
  const socket = S(solidOf([[0, 7], [4, 7], [4, 5], [7, 5]], G.frameOf(C.SOCKET, Y, X, Z), P), { crease: 'lo' })
    + k.dotsSvg([at([C.SOCKET[0], C.SOCKET[1] + 7, C.SOCKET[2]])], { size: 1, tone: 'lo' });
  const vents = [12, 18, 24, 30, 36].map((z) => k.pathOf([[xr, M.y + 6, z], [xr, M.y + 20, z]].map(at))).join('');
  // the spool window on the right side, the spool behind it (it turns in scene 4)
  const wPts = [[M.y + 26, 32], [M.y + 52, 32], [M.y + 52, 66], [M.y + 26, 66]];
  const window = `<path class="fp-disp" d="${onX(xr + 0.1, wPts)}"/>`;
  const screws = [[M.y + 4, 8], [M.y + 54, 8], [M.y + 4, 68], [M.y + 54, 68]].map(([y, z]) => at([xr, y, z]));
  const fscrews = [[M.x + 4, 8], [xr - 4, 8]].map(([x, z]) => at([x, yf, z]));
  return [
    feet, body, lid, handle,
    `<g data-cue="panel"><path class="fp-panel" d="${panel}"/>${disp(M.x + 12)}${disp(M.x + 44)}</g>`,
    g('digits', ''),
    knob(M.x + 25, 40), knob(M.x + 57, 40), socket,
    box({ x: xr - 14, y: yf - 1, w: 7, d: 3 }, 12, 20, { tone: 'hi', crease: 'lo' }, 0.3),
    L(vents, { tone: 'lo' }),
    window,
    `<g data-cue="wfs">${g('spool', '')}</g>`,
    k.dotsSvg([...screws, ...fscrews], { size: 0.55 }),
    L(k.sideSeam({ ...M, r: 3 }, 26, P, 4), { tone: 'faint' }),
  ].join('');
})();

// ---------------------------------------------------------------- the gas bottle with its regulator
const bottle = (() => {
  const [bx, by] = [-48, -138];
  const F = G.frameOf([bx, by, 0], Z, X, Y);
  return [
    cyl(bx, by, 16, 0, 4, { tone: 'lo' }),
    S(solidOf([[4, 13], [104, 13], [112, 10], [116, 5], [120, 4]], F, P), { tone: 'hi', crease: 'lo', inner: L(G.arcOf(F, 98, 13, P), { tone: 'faint' }) }),
    S(solidOf([[120, 3.4], [128, 3.4]], F, P), { crease: 'lo' }),
    S(discOf(-3, 3, 4.5, G.frameOf([bx + 4.5, by, 126], X, Y, Z), P), { tone: 'hi', crease: 'lo' }),
    // regulator body and its two gauges
    box({ x: bx - 4, y: by - 4, w: 8, d: 8, r: 1.5 }, 128, 138, { crease: 'lo' }, 0.3),
    S(discOf(0, 2.5, 6, G.frameOf([bx - 6, by + 4, 136], Y, X, Z), P), { tone: 'hi', crease: 'lo' }),
    S(discOf(0, 2.5, 6, G.frameOf([bx + 6, by + 4, 136], Y, X, Z), P), { tone: 'hi', crease: 'lo' }),
  ].join('');
})();

// ---------------------------------------------------------------- the stainless pipe (heat tint in scene 8)
const pipe = (() => {
  const { y, r, x0, x1, weld } = C.PIPE;
  const F = G.frameOf([x0, y, r + 4], X, Y, Z);
  const s = weld - x0;
  const band = (a, b, tone) => S(G.lathe([[a, r + 0.12], [b, r + 0.12]], F, P, LO), { tone, crease: 'none', className: 'fp-tint' });
  return [
    box({ x: x0 + 10, y: y - 12, w: 10, d: 24 }, 0, 4, { tone: 'lo' }),
    box({ x: x1 - 22, y: y - 12, w: 10, d: 24 }, 0, 4, { tone: 'lo' }),
    S(solidOf([[0, r], [x1 - x0, r]], F, P), { tone: 'hi', crease: 'lo' }),
    `<g data-cue="tint">${band(s - 13, s - 7, 'mid')}${band(s + 7, s + 13, 'mid')}${band(s - 7, s - 3, 'lo')}${band(s + 3, s + 7, 'lo')}</g>`,
    L([-2.6, -1.3, 0, 1.3, 2.6].map((d) => G.arcOf(F, s + d, r + 0.2, P)).join(''), { tone: 'hi' }),
    `<path class="fp-pore" d="${G.circleOf(F, x1 - x0 + 0.05, r - 1.6, P, 32)}"/>`,
  ].join('');
})();

// ---------------------------------------------------------------- clamps holding the plates
function clamp(x, side) {
  // side -1: behind the far plate, +1: in front of the near plate
  const y0 = side < 0 ? -104 : 74;
  const yArm = side < 0 ? -104 : 54;
  const yPad = side < 0 ? -56 : 60;
  const dArm = side < 0 ? 52 : 40;
  return [
    box({ x: x - 9, y: y0, w: 18, d: 30, r: 1.5 }, 0, 6, { tone: 'lo' }, 0.4),
    k.dotsSvg([at([x - 5, y0 + 4, 6]), at([x + 5, y0 + 26, 6])], { size: 0.55 }),
    box({ x: x - 5, y: side < 0 ? y0 + 4 : y0 + 14, w: 10, d: 12, r: 1 }, 6, 36, {}, 0.4),
    box({ x: x - 4, y: side < 0 ? yArm : yArm, w: 8, d: dArm + 2, r: 1 }, 36, 42, { tone: 'hi', crease: 'lo' }, 0.4),
    cyl(x, yPad, 3, 22, 36, { tone: 'mid' }),
    cyl(x, yPad, 5, 20, 23, { tone: 'lo' }),
    S(discOf(0, 4, 4, G.frameOf([x, yPad, 42], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
  ].join('');
}

// ---------------------------------------------------------------- the plates (V groove), and their section face
const plates = (() => {
  const F = G.frameOf([0, 0, 0], X, Y, Z);
  const { gap, face, top } = GROOVE;
  const far = [[-72, 0], [-gap, 0], [-gap, face], [-top, PT], [-72, PT]];
  const near = [[top, 0], [72, 0], [72, PT], [top, PT]]; // the body; the bevel wedge only shows its end face
  const wedge = `<path class="iso-top" d="${onX(XE, [[gap, 0], [top, 0], [top, PT], [gap, face]])}"/>`;
  const tacks = [-96, -20, 60].map((x) => k.dotsSvg([at([x, 0, PT - 15])], { size: 0.6, tone: 'lo' })).join('');
  return {
    far: S(G.prismOf(F, far, XS, XE, P), { tone: 'mid', crease: 'lo' })
      + `<path class="iso-shade" data-shade="2" d="${k.pathOf([[XS, -gap, face], [XE, -gap, face], [XE, -top, PT], [XS, -top, PT]].map(at), true)}"/>`
      + `<path class="iso-shade" data-shade="0" d="${k.pathOf([[XS, -gap, 0], [XE, -gap, 0], [XE, -gap, face], [XS, -gap, face]].map(at), true)}"/>`
      + L(k.pathOf([[XS, -top, PT], [XE, -top, PT]].map(at)), { tone: 'mid' }) + L(k.pathOf([[XE, -60, 0], [XE, -60, PT]].map(at)), { tone: 'faint' }),
    near: S(G.prismOf(F, near, XS, XE, P), { tone: 'mid', crease: 'lo' }) + `<g class="iso-solid">${wedge}</g>` + L(k.pathOf([[XE, 60, 0], [XE, 60, PT]].map(at)), { tone: 'faint' }) + tacks,
  };
})();

// ---------------------------------------------------------------- the torches (built at rest: the arc point at the origin)
const frameUp = (o, a) => G.frameAlong(o, a);
const mag = (() => {
  const F = frameUp([0, 0, 0], MAG_AX);
  const ribs = G.ribsOf(F, 92, 136, 9.5, 14, P, { least: 0.15 });
  return [
    S(solidOf([[82, 8], [86, 9.5], [138, 9.5], [146, 7]], F, P), { tone: 'mid', crease: 'lo', inner: L(ribs, { tone: 'lo' }) }),
    S(G.prismOf(G.frameOf(G.pointOf(F, 100, 0, 0), F.a, F.u, F.v), [[-7, -2.5], [-14, -2.5], [-14, 2.5], [-7, 2.5]].map(([a, b]) => [a, b]), 0, 12, P), { tone: 'hi', crease: 'lo' }),
    S(solidOf([[44, 5.5], [82, 5.5]], F, P), { tone: 'hi', crease: 'lo' }),
    S(solidOf([[38, 8.2], [44, 8.2]], F, P), { tone: 'lo', crease: 'lo' }),
    `<g data-cue="torch">${S(solidOf([[13, 7], [16, 8.2], [38, 9.6]], F, P), { tone: 'hi', crease: 'lo', inner: L(G.arcOf(F, 34, 9.5, P), { tone: 'faint' }) })}</g>`,
  ].join('');
})();

const tig = (() => {
  const F = frameUp([0, 0, 0], TIG_AX);
  const hAx = G.add3(G.mul3(F.a, 0.35), G.mul3([1, 0.15, 0], 1));
  const Fh = G.frameAlong(G.pointOf(F, 28, 0, 0), hAx);
  return [
    S(solidOf([[6, 7], [12, 7.5], [76, 7.5], [80, 5]], Fh, P), { tone: 'mid', crease: 'lo', inner: L(G.ribsOf(Fh, 30, 72, 7.5, 12, P, { least: 0.15 }), { tone: 'lo' }) }),
    S(solidOf([[34, 5], [62, 5], [65, 3]], F, P), { tone: 'mid', crease: 'lo' }),
    S(solidOf([[21, 8.5], [34, 8.5]], F, P), { tone: 'mid', crease: 'lo' }),
    `<g data-cue="tig">${S(solidOf([[2.4, 0.2], [4.5, 1.2], [9, 1.2]], F, P), { tone: 'hi', crease: 'lo' })}${S(solidOf([[7, 4.6], [21, 7.6]], F, P), { tone: 'lo', crease: 'lo' })}</g>`,
  ].join('');
})();

const heater = (() => {
  const F = frameUp([0, 0, 0], HEAT_AX);
  return [
    S(solidOf([[96, 6.5], [100, 7], [150, 7], [154, 5]], F, P), { tone: 'mid', crease: 'lo', inner: L(G.ribsOf(F, 104, 148, 7, 12, P, { least: 0.15 }), { tone: 'lo' }) }),
    S(solidOf([[18, 2.2], [96, 2.2]], F, P), { tone: 'hi', crease: 'lo' }),
    S(discOf(80, 86, 4.5, F, P), { tone: 'lo', crease: 'lo' }),
    `<g data-cue="preheat">${S(solidOf([[6, 5.5], [18, 4]], F, P), { tone: 'hi', crease: 'lo' })}</g>`,
  ].join('');
})();

// ---------------------------------------------------------------- HUD (stage space, not under the camera)
const ring = (cx, cy, r) => `<circle class="fp-mark" cx="${cx}" cy="${cy}" r="${r}"/>`;
const ticks = (cx, cy, r0, r1, n, from = -2.35, to = 2.35) => Array.from({ length: n }, (_, i) => {
  const a = from + ((to - from) * i) / (n - 1);
  return `M${(cx + Math.sin(a) * r0).toFixed(1)} ${(cy - Math.cos(a) * r0).toFixed(1)}L${(cx + Math.sin(a) * r1).toFixed(1)} ${(cy - Math.cos(a) * r1).toFixed(1)}`;
}).join('');
const [dx, dy] = C.DIAL;
const [mx, my] = C.MAG;
const [fx, fy0, fy1] = C.FLOW;
const CH = C.CHART;
const hud = [
  g('scrim', `<rect class="fp-scrim" x="0" y="0" width="${W}" height="${H}"/>`),
  g('dial', `<circle class="fp-hud-bg" cx="${dx}" cy="${dy}" r="56"/>${ring(dx, dy, 52)}<path class="fp-mark" d="${ticks(dx, dy, 44, 50, 11)}"/>${g('needle', '')}<circle class="fp-ink" cx="${dx}" cy="${dy}" r="3.5"/>${g('dialText', '')}`, ' data-cue="wfs"'),
  g('mag', `${g('magLead', '')}<clipPath id="fp-magclip"><circle cx="${mx}" cy="${my}" r="${C.MAG_R}"/></clipPath><circle class="fp-hud-bg" cx="${mx}" cy="${my}" r="${C.MAG_R}"/><g clip-path="url(#fp-magclip)">${g('magBase', '')}<g data-cue="short">${g('magShort', '')}</g><g data-cue="spray">${g('magSpray', '')}</g></g>${ring(mx, my, C.MAG_R)}`),
  g('flow', `<rect class="fp-hud-bg" x="${fx - 40}" y="${fy0 - 30}" width="104" height="${fy1 - fy0 + 60}" rx="10"/><rect class="fp-glass" x="${fx - 9}" y="${fy0}" width="18" height="${fy1 - fy0}" rx="9"/>${g('flowScale', '')}${g('flowBall', '')}`, ' data-cue="flow"'),
  g('docs', `${g('docA', '', ' data-cue="pwps"')}${g('docEss', '', ' data-cue="ess"')}${g('docB', '')}${g('docRange', '', ' data-cue="range"')}${g('docHeat', '')}${g('docCert', '', ' data-cue="iso"')}${g('docCoord', '', ' data-cue="coord"')}`),
  g('chart', `<rect class="fp-hud-bg" x="${CH.x}" y="${CH.y}" width="${CH.w}" height="${CH.h}" rx="10"/>${g('chartBody', '')}${g('chartCurve', '')}${g('chartT85', '', ' data-cue="t85"')}`),
  g('macro', `${g('macroLead', '')}<clipPath id="fp-macroclip"><rect x="${C.MACRO.x}" y="${C.MACRO.y}" width="${C.MACRO.w}" height="${C.MACRO.h}" rx="10"/></clipPath><rect class="fp-hud-bg" x="${C.MACRO.x}" y="${C.MACRO.y}" width="${C.MACRO.w}" height="${C.MACRO.h}" rx="10"/><g clip-path="url(#fp-macroclip)">${g('macroBody', '')}${g('macroIso', '')}<g data-cue="mart">${g('macroMart', '')}</g>${g('macroCrack', '')}</g><rect class="fp-frame" x="${C.MACRO.x}" y="${C.MACRO.y}" width="${C.MACRO.w}" height="${C.MACRO.h}" rx="10"/>`),
  g('cev', '', ' data-cue="cev"'),
  g('therm', '', ' data-cue="interp"'),
  g('clock', ''),
].join('');

// ---------------------------------------------------------------- the drawing
const world = [
  g('table', table),
  g('machine', machine),
  g('bottle', `<g data-cue="gas">${bottle}</g>`),
  g('ghose', ''),
  g('pipe', pipe),
  g('clampsB', clamp(-60, -1)),
  g('platesFar', plates.far),
  g('platesNear', plates.near),
  g('section', ''),
  g('haz', '', ' data-cue="haz"'),
  g('heat', '', ' data-cue="heat"'),
  g('bead', '', ' data-cue="bead"'),
  g('pores', ''),
  g('pool', '', ' data-cue="pool"'),
  g('gasflow', '', ' data-cue="gas"'),
  g('cable', ''),
  g('arc', ''),
  g('wire', ''),
  g('rod', ''),
  g('magT', mag),
  g('tigT', tig),
  g('flame', ''),
  g('heatT', heater),
  g('clampsF', clamp(64, 1)),
  g('travel', ''),
].join('');
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label=""><defs><radialGradient id="fp-glow"><stop offset="0" class="fp-glow0"/><stop offset="0.35" class="fp-glow1"/><stop offset="1" class="fp-glow2"/></radialGradient></defs>${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, [sx, sy]): world point p lands at stage point (sx, sy) (default the centre) with a view w wide
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const k = w / W; return [Math.round((x + (W / 2 - s[0]) * k) * 10) / 10, Math.round((y + (H / 2 - s[1]) * k) * 10) / 10, w]; };
const CAM = [
  { from: cam([-10, -40, 30], 640), to: cam([78, -6, 24], 270), a: 0.02, b: 0.5 },
  { from: cam([34, -6, 22], 230), to: cam([24, -6, 22], 220) },
  { from: cam([-62, -60, 34], 500), to: cam([-52, -50, 30], 480) },
  { from: cam([-40, -10, 28], 300), to: cam([-62, -10, 28], 300) },
  { from: cam([-62, -70, 46], 470), to: cam([-78, -66, 42], 450) },
  { from: cam([0, -40, 30], 640), to: cam([0, -40, 30], 620) },
  { from: cam([XE, 0, 10], 300, [170, 120]), to: cam([XE, 0, 10], 240, [160, 110]), a: 0, b: 0.4 },
  // scene 8 opens wider than scene 7 ends, so the whole preheat burner is in frame
  { from: cam([60, 40, 60], 560, [150, 190]), to: cam([C.PIPE.weld, C.PIPE.y, 17], 200), a: 0.66, b: 0.82 },
];

// ---------------------------------------------------------------- the film
const A = 'eng.joining.arc';
const WP = 'eng.joining.weldparams';
const WS = 'eng.joining.wps';
const MT = 'eng.joining.metallurgy';
const spec = {
  id: 'eng.joining.arc',
  title: { nl: 'Van boog tot scheur', en: 'From arc to crack' },
  lessons: [A, WP, WS, MT],
  scenes: [
    {
      id: 's1', lesson: A, level: 1, dur: DUR[0], still: 0.85, title: { nl: 'De boog', en: 'The arc' },
      beats: [
        { nl: 'Bij {t:MIG/MAG|MIG/MAG-lassen} smelt de boog een doorlopende draad en de plaat samen.', en: 'In {t:MIG/MAG|MIG/MAG welding} the arc melts a continuously fed wire and the plate together.', cue: { 'MIG/MAG': 'torch' } },
        { nl: 'Het gloeiende plasje is het {t:Smeltbad|smeltbad}: het stolt achter de boog tot de las.', en: 'The glowing puddle is the {t:Weld pool|weld pool}: it freezes behind the arc into the weld.', cue: { Smeltbad: 'pool' } },
        { nl: '{t:Beschermgas|Beschermgas} uit het mondstuk houdt de lucht weg van het smeltbad.', en: '{t:Shielding gas|Shielding gas} from the nozzle keeps the air away from the weld pool.', cue: { Beschermgas: 'gas' } },
      ],
    },
    {
      id: 's2', lesson: A, level: 1, dur: DUR[1], still: 0.5, title: { nl: 'TIG', en: 'TIG' },
      beats: [
        { nl: '{t:TIG|TIG} werkt anders: de wolfraamelektrode smelt niet af; de lasser dipt een losse staaf in het bad.', en: '{t:TIG|TIG} works differently: the tungsten electrode does not melt; the welder dips a separate rod in the pool.', cue: { TIG: 'tig' } },
        { nl: 'Vaak drie tot vijf keer langzamer, maar schoon en precies.', en: 'Often three to five times slower, but clean and precise.', cues: ['tig'] },
      ],
    },
    {
      id: 's3', lesson: A, level: 1, dur: DUR[2], still: 0.8, title: { nl: 'Warmte per millimeter', en: 'Heat per millimetre' },
      beats: [
        { nl: 'Bij {n:24} V, {n:220} A en {n:400} mm/min is de {t:Booglasenergie|booglasenergie} {n:0.79} kJ per mm las.', en: 'At {n:24} V, {n:220} A and {n:400} mm/min the {t:Arc energy|arc energy} is {n:0.79} kJ per mm of weld.', cue: { Booglasenergie: 'panel' }, read: { nl: '{n:24} × {n:220} × {n:60} / ({n:400} × {n:1000}) = {n:0.79} kJ/mm', en: '{n:24} × {n:220} × {n:60} / ({n:400} × {n:1000}) = {n:0.79} kJ/mm' } },
        { nl: 'Maal {n:0.8} voor MAG: een {t:Warmte-inbreng|warmte-inbreng} van {n:0.63} kJ/mm, binnen {n:0.5}–{n:0.9}.', en: 'Times {n:0.8} for MAG: a {t:Heat input|heat input} of {n:0.63} kJ/mm, inside {n:0.5}–{n:0.9}.', cue: { 'Warmte-inbreng': 'heat' }, read: { nl: '{n:0.8} × {n:0.79} = {n:0.63} kJ/mm', en: '{n:0.8} × {n:0.79} = {n:0.63} kJ/mm' } },
        { nl: 'Het staal ernaast werd heet en veranderde: de {t:WBZ|WBZ}.', en: 'The steel beside it got hot and changed: the {t:HAZ|HAZ}.', cue: { WBZ: 'haz' } },
      ],
    },
    {
      id: 's4', lesson: WP, level: 2, dur: DUR[3], still: 0.85, title: { nl: 'Draad en druppels', en: 'Wire and droplets' },
      beats: [
        { nl: 'De {t:Draadsnelheid|draadsnelheid} zet de stroom: meer draad trekt meer ampère.', en: 'The {t:Wire feed speed|wire feed speed} sets the current: more wire draws more amps.', cue: { Draadsnelheid: 'wfs' } },
        { nl: 'Laag tikt de draad in het bad: {t:Kortsluitboog|kortsluitboog}.', en: 'Set low, the wire keeps dipping into the pool: {t:Short arc|short arc}.', cue: { Kortsluitboog: 'short' }, still: 0.4 },
        { nl: 'Hoog vliegt een fijne straal druppels: {t:Sproeiboog|sproeiboog}.', en: 'Set high, fine droplets fly across: {t:Spray arc|spray arc}.', cue: { Sproeiboog: 'spray' }, still: 0.62 },
        { nl: '{n:1.2} mm draad op {n:10} m/min: een {t:Neersmeltsnelheid|neersmeltsnelheid} van {n:5.3} kg/h.', en: '{n:1.2} mm wire at {n:10} m/min: a {t:Deposition rate|deposition rate} of {n:5.3} kg/h.', cue: { Neersmeltsnelheid: 'bead' }, read: { nl: 'π/4 × {n:1.2}² × {n:10} m/min × 7,85 → {n:5.3} kg/h', en: 'π/4 × {n:1.2}² × {n:10} m/min × 7.85 → {n:5.3} kg/h' } },
      ],
    },
    {
      id: 's5', lesson: A, level: 2, dur: DUR[4], still: 0.8, title: { nl: 'Te weinig gas', en: 'Too little gas' },
      beats: [
        { nl: 'De gasslang knikt: het debiet zakt van {n:15} naar {n:5} liter per minuut.', en: 'The gas hose kinks: the flow drops from {n:15} to {n:5} litres per minute.', cues: ['flow'] },
        { nl: 'Binnen een uur zit de las vol poriën.', en: 'Within an hour the weld is full of pores.' },
        { nl: 'De oplossing: een sensor stopt de robot onder {n:10} L/min.', en: 'The fix: a sensor stops the robot below {n:10} L/min.', cues: ['flow'] },
      ],
    },
    {
      id: 's6', lesson: WS, level: 3, dur: DUR[5], still: 0.95, title: { nl: 'Lassen op papier', en: 'Welding on paper' },
      beats: [
        { nl: 'Eerst de {t:pLMB|pLMB}: het testrecept voor een proefstuk.', en: 'First the {t:pWPS|pWPS}: the recipe for a test plate.', cue: { pLMB: 'pwps' }, still: 0.12 },
        { nl: 'Elke {t:Essentiële variabele|essentiële variabele} heeft een {t:Geldigheidsgebied|geldigheidsgebied}.', en: 'Each {t:Essential variable|essential variable} has a {t:Range of qualification|range of qualification}.', cue: { 'Essentiële variabele': 'ess', Geldigheidsgebied: 'range' }, still: 0.34 },
        { nl: 'Dikte: {n:12} mm dekt {n:3} tot {n:24} mm; {n:22} mm is gedekt.', en: 'Thickness: {n:12} mm covers {n:3} to {n:24} mm; {n:22} mm is covered.', cues: ['range'], still: 0.54 },
        { nl: 'Getest op {n:1.2} kJ/mm; met kerfslageisen tot {n:1.5}: {n:1.6} valt erbuiten.', en: 'Tested at {n:1.2} kJ/mm; with impact requirements up to {n:1.5}: {n:1.6} is outside.', cues: ['range'], still: 0.7 },
        { nl: 'De lasser heeft een {t:ISO 9606-1|ISO 9606-1}-certificaat; de {t:Lascoördinator|lascoördinator} bewaakt het.', en: 'The welder holds an {t:ISO 9606-1|ISO 9606-1} certificate; the {t:Welding coordinator|welding coordinator} oversees it.', cue: { 'ISO 9606-1': 'iso', Lascoördinator: 'coord' } },
      ],
    },
    {
      id: 's7', lesson: MT, level: 4, dur: DUR[6], still: 0.76, title: { nl: 'Snel afkoelen', en: 'Cooling fast' },
      beats: [
        { nl: 'De las koelt af: {t:t8/5|t8/5} is de tijd van {n:800} naar {n:500} °C.', en: 'The weld cools: {t:t8/5|t8/5} is the time from {n:800} to {n:500} °C.', cue: { 't8/5': 't85' } },
        { nl: 'Koelt de WBZ te snel af, dan ontstaat {t:Martensiet|martensiet}: hard en bros.', en: 'If the HAZ cools too fast, {t:Martensite|martensite} forms: hard and brittle.', cue: { Martensiet: 'mart' } },
        { nl: 'Het {t:Koolstofequivalent|koolstofequivalent} zegt hoe snel staal hard wordt: CEV {n:0.46} op {n:40} mm: hoog.', en: 'The {t:Carbon equivalent|carbon equivalent} says how quickly steel hardens: CEV {n:0.46} on {n:40} mm is high.', cue: { Koolstofequivalent: 'cev' } },
      ],
    },
    {
      id: 's8', lesson: MT, level: 4, dur: DUR[7], still: 0.56, title: { nl: 'Voorwarmen en wachten', en: 'Preheat and wait' },
      beats: [
        { nl: 'Daarom voorwarmen, en voor elke laag de {t:Tussenlaagtemperatuur|tussenlaagtemperatuur} meten.', en: 'So preheat, and measure the {t:Interpass temperature|interpass temperature} before each pass.', cue: { Tussenlaagtemperatuur: 'interp' }, cues: ['preheat'], still: 0.24 },
        { nl: 'Een waterstofscheur kan uren of dagen later komen: de controle wacht vaak {n:16} tot {n:48} uur.', en: 'A hydrogen crack can come hours or days later: inspection often waits {n:16} to {n:48} hours.', still: 0.6 },
        { nl: 'Bij rvs moeten de {t:Aanloopkleuren|aanloopkleuren} naast de las eraf, anders roest het daar.', en: 'On stainless steel the {t:Heat tint|heat tint} beside the weld must come off, or it rusts there.', cue: { Aanloopkleuren: 'tint' }, still: 0.95 },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- page script and styles
const latheSource = readFileSync(join(SKILL, 'kit/lathe.mjs'), 'utf8').replace(/^import .*$/m, '').replace(/^export /gm, '');
const latheScript = `const G = (() => {${latheSource}\nreturn { viewOf, scaleOf, frameOf, frameAlong, pointOf, radialOf, tangentOf, solidOf, prismOf, lathe, disc, dotsOf, arcOf, circleOf, dot3, add3, sub3, mul3 };})();\n`;
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + latheScript + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8');

const css = `
:root{--fp-hot:#FFF4DC}
.iso[data-theme="light"]{--fp-hot:#FFFFFF}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.96}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-steel{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-scrim{fill:var(--anatomy-card);opacity:.88}
.fp-card{fill:var(--anatomy-paper);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-rule{fill:none;stroke:var(--anatomy-lo);stroke-width:3;stroke-linecap:round}
.fp-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-fill{fill:var(--anatomy-mid);opacity:.55}
.fp-panel{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-disp{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-glass{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-wire{fill:none;stroke:var(--anatomy-hi);stroke-width:1.4;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-hose{fill:none;stroke:var(--anatomy-shade-0);stroke-linecap:round;stroke-linejoin:round}
.fp-hose-hi{fill:none;stroke:var(--anatomy-lo);stroke-linecap:round;stroke-linejoin:round}
.fp-bead{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:.9;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-ripple{fill:none;stroke:var(--anatomy-mid);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-hazf{fill:var(--anatomy-lo);opacity:.55;stroke:var(--anatomy-mid);stroke-width:.5;vector-effect:non-scaling-stroke}
.fp-weld{fill:var(--anatomy-shade-3);stroke:var(--anatomy-hi);stroke-width:.9;vector-effect:non-scaling-stroke}
.fp-pore{fill:var(--anatomy-shade-0);stroke:var(--anatomy-hi);stroke-width:.5;vector-effect:non-scaling-stroke}
.fp-pool{fill:var(--fp-hot);stroke:var(--anatomy-hi);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-hotf{fill:var(--fp-hot);stroke:none}
.fp-iso{fill:none;stroke:var(--anatomy-hi);stroke-width:1;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}
.fp-gas{fill:none;stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:3 4;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-crack{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-needle{fill:none;stroke:var(--anatomy-mid);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-flame{fill:var(--fp-hot);stroke:var(--anatomy-hi);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-drop{fill:var(--anatomy-hi);stroke:none}
.fp-glow0{stop-color:var(--fp-hot);stop-opacity:1}
.fp-glow1{stop-color:var(--fp-hot);stop-opacity:.55}
.fp-glow2{stop-color:var(--fp-hot);stop-opacity:0}
.iso[data-theme="light"] .fp-glow1{stop-color:var(--anatomy-lo);stop-opacity:.35}
.iso[data-theme="light"] .fp-glow2{stop-color:var(--anatomy-lo);stop-opacity:0}
.fp-ray{fill:none;stroke:var(--anatomy-hi);stroke-width:1;stroke-linecap:round;vector-effect:non-scaling-stroke}
[data-cue][data-on] .fp-bead,[data-cue][data-on] .fp-card,[data-cue][data-on] .fp-pool,[data-cue][data-on] .fp-bar{stroke:var(--fp-accent);stroke-width:1.6}
[data-cue][data-on] .fp-hazf,[data-cue][data-on] .fp-fill{fill:var(--fp-accent);opacity:.6}
[data-cue][data-on] .fp-gas,[data-cue][data-on] .fp-iso,[data-cue][data-on] .fp-needle,[data-cue][data-on] .fp-crack,[data-cue][data-on] .fp-rule{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-panel,[data-cue][data-on] .fp-disp,[data-cue][data-on] .fp-glass{stroke:var(--fp-accent);stroke-width:1.4}
[data-cue][data-on] .fp-drop{fill:var(--fp-accent)}
[data-cue][data-on] .fp-wire{stroke:var(--fp-accent)}
`;

const label = {
  nl: 'Een lastafel met twee stalen platen en een V-naad, een MAG-toorts, een TIG-toorts, een lasapparaat met draadhaspel en een gasfles; later de doorsnede van de las met de warmtebeïnvloede zone, een afkoelkromme, een lasmethode op papier, een voorwarmbrander en een rvs-pijp met aanloopkleuren.',
  en: 'A welding table with two steel plates and a V groove, a MAG torch, a TIG torch, a power source with a wire spool and a gas bottle; later the section of the weld with the heat-affected zone, a cooling curve, a welding procedure on paper, a preheat torch and a stainless pipe with heat tint.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
