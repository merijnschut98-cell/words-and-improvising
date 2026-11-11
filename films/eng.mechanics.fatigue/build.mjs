// Dev tool, not shipped. Builds the explainer film "Hoe een as breekt / How a
// shaft breaks" for the topic Vermoeiing en breuk of Materialen en sterkte:
// level 1, eng.mechanics.fatigue (Vermoeiing en kerfwerking).
//
//   node films/eng.mechanics.fatigue/build.mjs            build the page
//   node films/eng.mechanics.fatigue/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.mechanics.fatigue.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5.
//
// The drawing is the agitator of the lesson's worked example, in a tank cut
// open toward the viewer: a tank on a skirt with anchor lugs, a floor plate, a
// back wall with two baffles and a weld seam, a rim flange with bolts, a bridge
// of two beams with end plates, and on it a mounting plate, a gearbox with
// ribs, a name plate, a breather and a drain plug, a motor with fins, terminal
// box and fan cowl. Under the bridge the output bearing housing, a rigid flange
// coupling with six bolts, and the shaft with its keyway and key; at the bottom
// the impeller, four pitched blades on a hub with a nut. The shaft turns, the
// keyway's corner goes from tension to compression; a crack starts at the
// keyway's end, grows and the shaft breaks. Cards in stage space carry the
// load-cycle counter, the plate with a hole, the fracture face with its beach
// marks, the S-N curve and the fix; every card is labelled "voorbeeld".
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
// Asserted against the lesson (the build fails if a value drifts); the {n:...}
// numbers are then checked against the Dutch lesson text by defineFilm.
// Sources for the hedges in the narration: the S-N curve and the endurance
// limit of steels (a knee somewhere between about 10^6 and 10^7 cycles, an
// endurance limit of very roughly half the tensile strength for polished
// samples, up to about 1.400 MPa tensile strength) as in Shigley's Mechanical
// Engineering Design and ASM Handbook vol. 19; failures beyond 10^7 cycles
// (very-high-cycle fatigue, Bathias); aluminium without a true limit; the
// stress concentration of a small round hole in a wide plate under tension
// (Kirsch: 3 at the hole's edge); beach marks and the size of the final zone
// (ASM Handbook vol. 11); a tensile mean stress lowering the allowed stress
// amplitude (Goodman, Gerber), a compressive skin from shot peening raising it.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
// load cycles: one per revolution of a bending, rotating shaft
const RPM = 1500;
const PER_DAY = RPM * 60 * 24;
assert(PER_DAY === 2160000 && PER_DAY > 2e6, '1.500 rpm gives more than 2 million cycles a day');
assert(1000 * 60 * 16 === 960000, 'the recall: 1.000 rpm, 16 h → 960.000');
assert(PER_DAY * 365 > 1e8 && PER_DAY * 365 < 1e9, 'a year at 1.500 rpm: hundreds of millions');
// the S-N curve: endurance limit about half the tensile strength at 10 million cycles
const N_LIMIT = 10; // million
const LIMIT_RATIO = 0.5;
assert(N_LIMIT * 1e6 === 1e7 && LIMIT_RATIO === 0.5, '10 million cycles, half the tensile strength');
// stress concentration: Kirsch along the section through a hole of radius a, at distance r
const kirsch = (rr) => 1 + 0.5 * rr ** -2 + 1.5 * rr ** -4;
assert(kirsch(1) === 3 && kirsch(3) < 1.1, 'a round hole triples the stress at its edge and fades within a few radii');
// the agitator: broke twice in 18 months at the keyway end
const MONTHS = 18;
const BREAKS = 2;
assert(MONTHS === 18 && BREAKS === 2, 'twice in 18 months');
// the crack on the fracture face: grows a little per run, each stop leaves a ring;
// a small final zone (low stress) — the crack reaches about 0,8 of the way across
const RINGS = 9;
const CRACK_END = 0.8;
assert(CRACK_END > 0.6, 'a small final zone: the crack grew most of the way');

// ---------------------------------------------------------------- the world
// World units are centimetres, z up; the viewer looks from the azimuth (66°).
// The tank is cut open on the half toward the viewer.
const W = 640;
const H = 400;
const AZ = 66;
const AV = (AZ * Math.PI) / 180;
const R = 40; // tank inner radius
const WALL = 1.5;
const FLOOR = 6;
const TOP = 80;
const CUT = [AV + Math.PI / 2, AV + (3 * Math.PI) / 2]; // the back half runs from CUT[0] to CUT[1]
const BEAM_Z = [82.5, 90];
const PLATE_Z = [90, 92];
const GB = { x: -12, y: -9, w: 24, d: 18, r: 1.4 };
const GB_Z = [92, 114];
const MOT_R = 10;
const MOT_Z = [118, 146];
const FAN_Z = [146, 153];
const SHAFT_R = 2.4;
const HOUSING = [79, 90];
const CPL = { hubU: [72, 79], flU: [69, 72], flL: [66, 69], hubL: [58, 66], rHub: 4.4, rFl: 8, rBolt: 6.3 };
const KEY = { z0: 50.5, zKey: 53, half: 0.4 }; // keyway end, key end, half angle of the slot
const CRACK_Z = 50.5;
const IMP = { hub: [28, 36], rHub: 4, nut: [25.6, 28], r0: 4, r1: 15, z: 32, chord: 2.3 };

const FIT = [
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => [(R + 3) * Math.cos(i * Math.PI / 4), (R + 3) * Math.sin(i * Math.PI / 4), -2]),
  [0, 0, FAN_Z[1] + 2], [R + 3, 0, TOP], [-R - 3, 0, TOP],
];
const P = k.fitProjection(FIT, W, H, { pad: 14, azimuth: AZ, elevation: 22 });
const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const S = (paths, style) => k.solidSvg(paths, style);
const Zv = [0, 0, 1];
const X = [1, 0, 0];
const Y = [0, 1, 0];
const frameZ = (o) => G.frameOf(o, Zv, X, Y);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, 'left');
const flatRect = (x0, z0, x1, z1, r, steps = 4) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const box = (plan, z0, z1, style = {}, { steps = 3, bevel = 0, inner = '', extra = '' } = {}) => S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
const post = (cx, cy, r, z0, z1, style = {}, { steps = 28, bevel = 0, inner = '', extra = '' } = {}) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
const ext = (ring, z0, z1, style = {}, { convex = true, inner = '', extra = '' } = {}) => S(k.extrude(ring, z0, z1 - z0, P, { convex }), { tone: 'mid', ...style, inner }) + extra;
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const polar = (r, a, z) => [r * Math.cos(a), r * Math.sin(a), z];
const arcPts = (r, a0, a1, z, n = 40) => Array.from({ length: n + 1 }, (_, i) => polar(r, a0 + (a1 - a0) * (i / n), z));
// a rotated rectangle (a plan for extrude): centre, length along angle a, width across
const rrect = (cx, cy, len, wid, a) => {
  const u = [Math.cos(a), Math.sin(a)];
  const v = [-u[1], u[0]];
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [cx + u[0] * s * len / 2 + v[0] * t * wid / 2, cy + u[1] * s * len / 2 + v[1] * t * wid / 2]);
};
// a half annulus (a plan for extrude) from angle a0 to a1
const annulus = (r0, r1, a0, a1, n = 36) => [
  ...Array.from({ length: n + 1 }, (_, i) => polar(r1, a0 + (a1 - a0) * (i / n), 0).slice(0, 2)),
  ...Array.from({ length: n + 1 }, (_, i) => polar(r0, a1 - (a1 - a0) * (i / n), 0).slice(0, 2)),
];
// a face plate on the face y = fy: a card with three printed rule lines and four screws
const plate = (fy, x0, z0, x1, z1) => [
  `<g transform="${planeOf(fy)}">`,
  `<path class="fa-card" d="${flatRect(x0, z0, x1, z1, 0.5)}"/>`,
  `<path class="iso-line" data-tone="lo" data-free="" d="${[0.3, 0.5, 0.7].map((f, i) => `M${(x0 + 1.4).toFixed(1)} ${(-(z1 - (z1 - z0) * f)).toFixed(1)}H${(x1 - 1.4 - i * (x1 - x0) * 0.18).toFixed(1)}`).join('')}"/>`,
  '</g>',
  Dt([[x0 + 0.8, fy, z0 + 0.8], [x1 - 0.8, fy, z0 + 0.8], [x0 + 0.8, fy, z1 - 0.8], [x1 - 0.8, fy, z1 - 0.8]].map(at), { size: 0.4 }),
].join('');

// ---------------------------------------------------------------- the tank
const parts = [];
parts.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan({ x: -R - 2, y: -R - 2, w: 2 * R + 4, d: 2 * R + 4, r: R + 2 }, -3), 0, 2, P)}"/>`);
// the skirt and its anchor lugs (the ones toward the viewer)
parts.push(post(0, 0, R + WALL + 0.6, 0, 4, { tone: 'lo' }, { steps: 64, inner: L(k.sideArc(0, 0, R + WALL + 0.6, 2, P, 48), { tone: 'faint' }) }));
for (const a of [AV - 0.9, AV + 0.2, AV + 1.3]) {
  const [cx, cy] = polar(R + WALL + 2.4, a, 0);
  parts.push(ext(rrect(cx, cy, 4, 5, a + Math.PI / 2), 0, 1.6, { tone: 'lo' }, { extra: Dt([at([cx, cy, 1.6])], { size: 0.5 }) }));
}
// the floor plate: its top is the tank's floor
parts.push(post(0, 0, R + WALL, 4, FLOOR, { tone: 'mid' }, { steps: 64 }));
// the back wall's inside, seen through the cut: a weld seam and a faint level line
{
  const top = arcPts(R, CUT[0], CUT[1], TOP, 48).map(at);
  const bot = arcPts(R, CUT[1], CUT[0], FLOOR, 48).map(at);
  const seam = k.pathOf(arcPts(R, CUT[0], CUT[1], 44, 48).map(at));
  const level = k.pathOf(arcPts(R, CUT[0] + 0.05, CUT[1] - 0.05, 66, 48).map(at));
  parts.push(`<path class="fa-wall" d="${k.pathOf([...top, ...bot], true)}"/>`
    + `<path class="iso-line" data-tone="faint" d="${seam}"/><path class="fa-level" d="${level}"/>`
    + `<path class="iso-line" data-tone="lo" d="${k.pathOf(bot)}"/>`);
}
// two baffles on the back wall, on small brackets
for (const a of [CUT[0] + 0.9, CUT[1] - 0.9]) {
  const [cx, cy] = polar(R - 2.6, a, 0);
  const [bx, by] = polar(R - 0.8, a, 0);
  for (const z of [16, 70]) parts.push(ext(rrect(bx, by, 1.8, 1.4, a), z - 1, z + 1, { tone: 'lo' }));
  parts.push(ext(rrect(cx, cy, 3.6, 0.9, a), 12, 74, { tone: 'mid' }));
}
// the rim flange on the back half, with its bolts
parts.push(ext(annulus(R, R + WALL + 2.6, CUT[0], CUT[1]), TOP, TOP + 2.5, { tone: 'mid' }, { convex: false,
  extra: Dt(Array.from({ length: 13 }, (_, i) => at(polar(R + WALL + 1.3, CUT[0] + 0.12 + (Math.PI - 0.24) * (i / 12), TOP + 2.5))), { size: 0.42 }) }));
// the wall where the cut runs through it
for (const a of CUT) {
  const [x0, y0] = polar(R - 0.2, a, 0);
  const [x1, y1] = polar(R + WALL, a, 0);
  const ring = [[x0, y0], [x1, y1], [x1 - 0.6 * Math.cos(AV), y1 - 0.6 * Math.sin(AV)], [x0 - 0.6 * Math.cos(AV), y0 - 0.6 * Math.sin(AV)]];
  parts.push(ext(ring, 4, TOP + 2.5, { tone: 'mid', crease: 'none' }));
}

// ---------------------------------------------------------------- the impeller and the lower shaft (live, they fall)
parts.push(cueG('imp', g('lower', '')));
// the shaft above the crack, with its keyway and key (live, it turns)
parts.push(cueG('shaft', g('upper', '')));
parts.push(cueG('keyway', g('kw', '')));
parts.push(cueG('crack', g('crk', '')));
parts.push(g('flow', ''));
// ---------------------------------------------------------------- the coupling
{
  const hubL = post(0, 0, CPL.rHub, CPL.hubL[0], CPL.hubL[1], { tone: 'mid' }, { steps: 32, inner: L(k.sideArc(0, 0, CPL.rHub, CPL.hubL[0] + 2.6, P, 24), { tone: 'faint' }) });
  const fl = post(0, 0, CPL.rFl, CPL.flL[0], CPL.flL[1], { tone: 'mid' }, { steps: 40, bevel: 0.3 })
    + post(0, 0, CPL.rFl, CPL.flU[0], CPL.flU[1], { tone: 'mid' }, { steps: 40, bevel: 0.3 });
  parts.push(cueG('cpl', hubL + fl + g('bolts', '') + post(0, 0, CPL.rHub, CPL.hubU[0], CPL.hubU[1], { tone: 'mid' }, { steps: 32 })));
  // the output bearing housing under the bridge, with its seal
  parts.push(post(0, 0, 3.2, HOUSING[0], HOUSING[0] + 1, { tone: 'lo' }, { steps: 24 }));
  parts.push(post(0, 0, 4.8, HOUSING[0] + 1, HOUSING[1], { tone: 'mid' }, { steps: 32, bevel: 0.3,
    inner: L(k.sideArc(0, 0, 4.8, HOUSING[0] + 4, P, 24), { tone: 'faint' }),
    extra: Dt([0, 1, 2, 3].map((i) => at(polar(3.9, AV - 1.2 + i * 0.8, HOUSING[0] + 1))), { size: 0.36 }) }));
}
// ---------------------------------------------------------------- the front of the tank, cut low
parts.push(ext(annulus(R, R + WALL, CUT[1] - 2 * Math.PI, CUT[0], 40), FLOOR - 2, 15, { tone: 'mid' }, { convex: false }));
// ---------------------------------------------------------------- the bridge: two beams along the cut, end plates
{
  const a = CUT[0];
  const u = [Math.cos(a), Math.sin(a)];
  const v = [-u[1], u[0]];
  const len = 2 * R + 8;
  for (const off of [-8, 8]) {
    const cx = v[0] * off;
    const cy = v[1] * off;
    parts.push(ext(rrect(cx, cy, len, 3.4, a), BEAM_Z[0], BEAM_Z[1], { tone: 'mid' }, {
      inner: L(k.pathOf([at([cx - u[0] * len / 2 + v[0] * 1.7, cy - u[1] * len / 2 + v[1] * 1.7, BEAM_Z[0] + 1.2]), at([cx + u[0] * len / 2 + v[0] * 1.7, cy + u[1] * len / 2 + v[1] * 1.7, BEAM_Z[0] + 1.2])]), { tone: 'faint' }) }));
  }
  for (const s of [-1, 1]) {
    const cx = u[0] * s * (R + 1.2);
    const cy = u[1] * s * (R + 1.2);
    parts.push(ext(rrect(cx, cy, 6, 24, a), TOP + 2.5, BEAM_Z[0], { tone: 'lo' }, {
      extra: Dt([-9, -3, 3, 9].map((t) => at([cx + v[0] * t, cy + v[1] * t, BEAM_Z[0]])), { size: 0.42 }) }));
  }
}
// ---------------------------------------------------------------- the drive: plate, gearbox, motor
{
  const PL = { x: -15, y: -13, w: 30, d: 26, r: 1 };
  parts.push(box(PL, PLATE_Z[0], PLATE_Z[1], { tone: 'lo' }, { steps: 3, extra: Dt(k.corners(PL, 2).map(([x, y]) => at([x, y, PLATE_Z[1]])), { size: 0.5 }) }));
  const fy = GB.y + GB.d;
  const ribs = [-8, -4, 0, 4, 8].map((x) => `M${x} ${-(GB_Z[0] + 2)}V${-(GB_Z[1] - 3)}`).join('');
  const face = [
    `<g transform="${planeOf(fy)}"><path class="iso-line" data-tone="faint" d="${ribs}"/></g>`,
    plate(fy, -6.5, GB_Z[0] + 8, 6.5, GB_Z[0] + 15),
  ].join('');
  parts.push(cueG('drive', box(GB, GB_Z[0], GB_Z[1], { tone: 'mid' }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(GB, GB_Z[0] + 11, P, 3), { tone: 'faint' }),
    extra: face + Dt(k.corners(GB, 1.6).map(([x, y]) => at([x, y, GB_Z[1]])), { size: 0.45 }) })));
  // the drain plug on the front face and the breather on top
  const FD = frameY([8, fy, GB_Z[0] + 3]);
  parts.push(S(G.disc(0, 0.8, 1.3, FD, P, { steps: 6 }), { tone: 'mid' }));
  parts.push(post(-7, -4, 1.1, GB_Z[1], GB_Z[1] + 2.4, { tone: 'mid' }, { steps: 6 }) + post(-7, -4, 1.6, GB_Z[1] + 2.4, GB_Z[1] + 3.4, { tone: 'hi' }, { steps: 16 }));
  // the motor adapter, the finned body, the terminal box and the fan cowl
  parts.push(post(0, 0, 8.6, GB_Z[1], MOT_Z[0], { tone: 'mid' }, { steps: 40, bevel: 0.3 }));
  const FM = frameZ([0, 0, 0]);
  parts.push(post(0, 0, MOT_R, MOT_Z[0], MOT_Z[1], { tone: 'mid' }, { steps: 48, bevel: 0.4,
    inner: L(G.ribsOf(FM, MOT_Z[0] + 1.5, MOT_Z[1] - 1.5, MOT_R, 28, P, { least: 0.2 }), { tone: 'faint' }) }));
  const TB = { x: -3.5, y: MOT_R - 1, w: 7, d: 4, r: 0.5 };
  parts.push(box(TB, 128, 137, { tone: 'mid' }, { steps: 2, bevel: 0.3, inner: L(k.sideSeam(TB, 135, P, 2), { tone: 'faint' }),
    extra: Dt(k.corners(TB, 0.8).map(([x, y]) => at([x, y, 137])), { size: 0.38 }) }));
  parts.push(S(G.disc(0, 1.2, 1.1, frameY([0, TB.y + TB.d, 130.5]), P, { steps: 6 }), { tone: 'hi' }));
  parts.push(post(0, 0, MOT_R + 0.5, FAN_Z[0], FAN_Z[1], { tone: 'mid' }, { steps: 48, bevel: 0.5,
    extra: L(k.planOutline(k.insetPlan({ x: -MOT_R, y: -MOT_R, w: 2 * MOT_R, d: 2 * MOT_R, r: MOT_R }, 2.5), FAN_Z[1], P, 32), { tone: 'faint' })
      + Dt(k.dotGrid(-4.5, -4.5, 4, 4, 3, FAN_Z[1], P), { size: 0.36 }) }));
}
const world = parts.join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const hud = [
  g('cyc', g('cyIn', '') + cueG('cycle', g('cyTrace', ''))),
  g('kerf', cueG('holeC', g('kfIn', ''))),
  g('face', g('faBase', '') + cueG('beach', g('faMarks', '')) + g('faRest', '')),
  g('sn', g('snBase', '') + cueG('snSteel', g('snSteel', '')) + cueG('limit', g('snLim', '')) + cueG('alu', g('snAlu', '')) + g('snReal', '')),
  g('fix', g('fxIn', '')),
].join('');

// Static paths written with relative line-tos (the helper from the measuring
// film): the same points, about a third fewer bytes. Only M, L and Z paths at
// one decimal are rewritten, and each rewrite is read back to prove it exact.
function compactPath(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g);
  const n = (v) => { const a = Math.abs(v); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return (v < 0 ? '-' : '') + t; };
  let out = '';
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  let last = '';
  const put2 = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    for (const v of nums) { const t = n(v); s += (s && !/[MlZ]$/.test(s) && t[0] !== '-' ? ' ' : '') + t; }
    if (!/^[MlZ]/.test(s) && out && !/[MlZ]$/.test(out) && s[0] !== '-') out += ' ';
    out += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put2('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put2('M', p); cur = p; start = p; cmd = 'L'; } else { put2('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
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
// cam(p, w, sx): world point p lands at stage x sx (default the centre) in a view w wide
const cam = (p, w, sx = W / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round(y * 10) / 10, w]; };
const WHOLE = cam([0, 0, 78], 600);
const SIDE = cam([0, 0, 50], 300, 104);
const KEYV = cam([0, 0, 54], 140, 104);
const CAM = [
  { from: WHOLE, to: SIDE, a: 0.3, b: 0.52 },
  { from: SIDE, to: KEYV, a: 0, b: 0.3 },
  { from: KEYV, to: cam([0, 0, 53], 132, 104) },
  { from: cam([0, 0, 53], 132, 104), to: cam([0, 0, 45], 210, 104), a: 0.05, b: 0.3 },
  { from: cam([0, 0, 45], 210, 104), to: cam([0, 0, 50], 300, 104) },
  { from: cam([0, 0, 54], 150, 104), to: SIDE, a: 0.42, b: 0.66 },
];

// ---------------------------------------------------------------- the film
const FAT = 'eng.mechanics.fatigue';
const DUR = [44, 42, 44, 40, 48, 46];
const C = {
  AV, R, FLOOR, TOP, CUT, SHAFT_R, CPL, KEY, CRACK_Z, IMP, RPM, PER_DAY, N_LIMIT, LIMIT_RATIO, RINGS, CRACK_END, MONTHS,
  dur: DUR,
};
const spec = {
  id: 'eng.mechanics.fatigue',
  title: { nl: 'Hoe een as breekt', en: 'How a shaft breaks' },
  lessons: [FAT],
  scenes: [
    {
      id: 's1', lesson: FAT, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Een as die steeds buigt', en: 'A shaft that keeps bending' },
      beats: [
        { nl: 'Een roerwerk: motor en tandwielkast op een brug, de as aan een koppeling, onderaan de roerder.', en: 'An agitator: motor and gearbox on a bridge, the shaft on a coupling, the impeller at the bottom.', cues: ['drive', 'imp'] },
        { nl: '{t:Vermoeiing|Vermoeiing}: een steeds herhaalde last laat een scheurtje groeien, ruim onder de vloeigrens.', en: '{t:Fatigue|Fatigue}: a load repeated again and again grows a small crack, well below the yield strength.', cue: { Vermoeiing: 'shaft' } },
        { nl: 'De as buigt iets door. Per omwenteling gaat elk punt van trek naar druk: één {t:Lastwisseling|lastwisseling}.', en: 'The shaft bends a little. Each turn takes every point from tension to compression: one {t:Load cycle|load cycle}.', cue: { Lastwisseling: 'cycle' }, cues: ['keyway'] },
        { nl: '{n:1500} toeren per minuut is meer dan {n:2} miljoen lastwisselingen per dag.', en: '{n:1500} rpm is more than {n:2} million load cycles a day.', cues: ['cycle'] },
      ],
    },
    {
      id: 's2', lesson: FAT, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Kerfwerking', en: 'Stress concentration' },
      beats: [
        { nl: 'Deze as brak twee keer in {n:18} maanden, steeds aan het eind van de spiebaan.', en: 'This shaft broke twice in {n:18} months, each time at the end of the keyway.', cues: ['keyway'] },
        { nl: '{t:Kerfwerking|Kerfwerking}: in de scherpe hoek van de spiebaan loopt de spanning plaatselijk op.', en: '{t:Stress concentration|Stress concentration}: in the sharp corner of the keyway the stress piles up locally.', cue: { Kerfwerking: 'keyway' } },
        { nl: 'Een klein rond gat in een brede plaat maakt de spanning aan zijn rand drie keer zo hoog.', en: 'A small round hole in a wide plate makes the stress at its edge three times as high.', cues: ['holeC'] },
        { nl: 'Ook gaten, schroefdraad, een lasteen, krassen en putcorrosie zijn kerven.', en: 'Holes, threads, a weld toe, scratches and corrosion pits are notches too.', cues: ['holeC'] },
      ],
    },
    {
      id: 's3', lesson: FAT, level: 1, dur: DUR[2], still: 0.92, title: { nl: 'Rustlijnen', en: 'Beach marks' },
      beats: [
        { nl: 'In die hoek begint een scheurtje. Bij elke periode van draaien groeit het een stukje.', en: 'A small crack starts in that corner. In each period of running it grows a little.', cues: ['crack'] },
        { nl: 'Elke stop of lastverandering laat een ring achter: {t:Rustlijnen|rustlijnen}.', en: 'Each stop or change of load leaves a ring: {t:Beach marks|beach marks}.', cue: { Rustlijnen: 'beach' } },
        { nl: 'Ze waaieren uit vanaf het startpunt. Zo lees je af waar de scheur begon.', en: 'They spread out from the start point. That is how you read where the crack began.', cues: ['beach', 'keyway'] },
        { nl: 'Dat deel blijft vrij glad: de scheurvlakken schuurden langs elkaar.', en: 'That zone stays fairly smooth: the crack faces rubbed against each other.', cues: ['beach'] },
      ],
    },
    {
      id: 's4', lesson: FAT, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'De restbreuk', en: 'The final fracture' },
      beats: [
        { nl: 'Het metaal dat nog heel is, wordt steeds kleiner. De spanning daarin loopt op.', en: 'The metal that is still whole gets ever smaller. The stress in it rises.', cues: [] },
        { nl: 'Dan breekt de rest in één keer: een ruwe, korrelige restbreuk.', en: 'Then the rest breaks at once: a rough, grainy final zone.', cues: ['imp'] },
        { nl: 'Klein restvlak: lage spanning, de scheur had lang de tijd om te groeien.', en: 'A small final zone: low stress, the crack had a long time to grow.', cues: [] },
        { nl: 'Eerder vinden? Penetrant trekt rood in de scheur en tekent hem af op een witte laag.', en: 'Find it sooner? Dye penetrant seeps red into the crack and shows it on a white coating.', cues: ['crack'] },
      ],
    },
    {
      id: 's5', lesson: FAT, level: 1, dur: DUR[4], still: 0.92, title: { nl: 'De Wöhlerkromme', en: 'The S-N curve' },
      beats: [
        { nl: 'De {t:Wöhlerkromme|Wöhlerkromme}: spanning tegen het aantal wisselingen tot breuk. Lager belast, langer leven.', en: 'The {t:S-N curve|S-N curve}: stress against the number of cycles to failure. Less stress, longer life.', cue: { Wöhlerkromme: 'snSteel' } },
        { nl: 'Veel staalsoorten hebben een {t:Vermoeiingsgrens|vermoeiingsgrens}: ruwweg de helft van de treksterkte.', en: 'Many steels have an {t:Endurance limit|endurance limit}: roughly half the tensile strength.', cue: { Vermoeiingsgrens: 'limit' } },
        { nl: 'Aluminium heeft geen echte grens. En ook staal kan na {n:10} miljoen nog breken.', en: 'Aluminium has no real limit. And steel can still break after {n:10} million too.', cues: ['alu'] },
        { nl: 'Een echt onderdeel zit lager: ruw oppervlak, groter, corrosie, lassen, trekspanning erbovenop.', en: 'A real part sits lower: rough surface, larger size, corrosion, welds, tensile stress on top.', cues: ['snSteel'] },
      ],
    },
    {
      id: 's6', lesson: FAT, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'De oplossing', en: 'The fix' },
      beats: [
        { nl: 'Na de eerste breuk kwam er sterker staal in. Hij brak opnieuw, op dezelfde plek.', en: 'After the first failure a stronger steel went in. It broke again, in the same place.', cues: ['keyway'] },
        { nl: 'Haal de kerf weg: een afgerond eind van de spiebaan, een glad oppervlak.', en: 'Remove the notch: a rounded end to the keyway, a smooth surface.', cues: ['keyway'] },
        { nl: 'Haal de wisselende last weg: de roerder balanceren en de uitlijning controleren.', en: 'Remove the changing load: balance the impeller and check the alignment.', cues: ['imp', 'cpl'] },
        { nl: 'Breekt een sterker exemplaar weer? Vraag naar de wisselingen, de trilling en de afronding.', en: 'Does a stronger part break again? Ask about the cycles, the vibration and the radius.', cues: ['keyway'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", σ or a caret in the spoken text; 10^7 is
// said as "tien miljoen", and numbers as words where the voice would misread
// them. The Dutch words were checked with espeak-ng phonemes through Piper's
// own bridge (nl_NL-alex, films/_kit/voice-ab/phon.py): Wöhlerkromme (read
// "wohhler", with the o of "bot" and a sounded h), lastwisseling ("wisSEEling"),
// vermoeiingsgrens (a schwa in "grens"), kogelstralen (stress on "stralen")
// and lasteen ("lasTEEN") get Dutch spoken forms in films/_kit/timeline.mjs
// (SAY); levensduur (stressed on "duur") is used by other films and is kept
// out of this narration; hogesterktestaal and overgangsstraal are kept out too.
const SAY = [
  [ // s1 a shaft that keeps bending
    { nl: 'Dit is een roerwerk, een menger in een tank. Op de brug staan een motor en een tandwielkast. Daaronder hangt de as aan een koppeling, met onderaan de roerder: de schoepen die de vloeistof mengen.',
      en: 'This is an agitator, a mixer in a tank. On the bridge sit a motor and a gearbox. Below them the shaft hangs from a coupling, with the impeller at the bottom: the blades that mix the liquid.' },
    { nl: 'Zo\'n as breekt zelden door één te zware klap. Veel vaker is het {t:Vermoeiing|vermoeiing}: een belasting die miljoenen keren terugkomt, laat een klein scheurtje groeien tot de as knapt. En dat terwijl de spanning ruim onder de vloeigrens blijft.',
      en: 'A shaft like this rarely breaks from one blow that is too heavy. Far more often it is {t:Fatigue|fatigue}: a load that comes back millions of times grows a small crack until the shaft snaps. And all the while the stress stays well below the yield strength.' },
    { nl: 'De roerder is uit balans, dus de as buigt een beetje door. Draait de as, dan komt elk punt van het oppervlak beurtelings aan de kant die rekt en aan de kant die wordt ingedrukt. Volg de stip: trek, druk, en weer trek. Elke omwenteling is één {t:Lastwisseling|lastwisseling}.',
      en: 'The impeller is out of balance, so the shaft bends a little. As it turns, every point of its surface comes in turn to the side that stretches and the side that is squeezed. Follow the dot: tension, compression, and tension again. One revolution is one {t:Load cycle|load cycle}.' },
    { nl: 'Dat telt snel op. Een as op {n:1500} toeren per minuut krijgt meer dan {n:2} miljoen lastwisselingen per dag. Een roerwerk draait meestal langzamer, maar ook dan zijn het er in een paar jaar vele miljoenen.',
      en: 'That adds up fast. A shaft at {n:1500} revolutions per minute sees more than {n:2} million load cycles a day. An agitator usually turns slower, but even then it sees many millions within a few years.' },
  ],
  [ // s2 stress concentration
    { nl: 'Deze as brak in {n:18} maanden twee keer, steeds aan het eind van de spiebaan. Dat is de sleuf voor de spie, het stalen blokje dat de koppeling op de as vastzet.',
      en: 'This shaft broke twice in {n:18} months, each time at the end of the keyway. That is the slot for the key, the steel block that locks the coupling to the shaft.' },
    { nl: 'Daar zit {t:Kerfwerking|kerfwerking}, of spanningsconcentratie: de vorm laat de spanning plaatselijk oplopen. De kracht moet om de sleuf heen, en in de scherpe hoek komt alles samen.',
      en: 'That is where the {t:Stress concentration|stress concentration} sits: the shape makes the stress pile up locally. The force has to flow around the slot, and in the sharp corner it all crowds together.' },
    { nl: 'Een bekend voorbeeld: een klein rond gat in een brede plaat die je uittrekt. Aan de rand van het gat is de spanning ongeveer drie keer zo hoog. Een scherpe hoek kan nog erger zijn.',
      en: 'A well-known example: a small round hole in a wide plate that you pull on. At the edge of the hole the stress is about three times as high. A sharp corner can be worse still.' },
    { nl: 'Daarom beginnen scheuren bij scherpe hoeken, gaten, spiebanen, schroefdraad en de lasteen, waar lasmetaal en plaat elkaar raken, maar ook bij krassen en putjes van corrosie.',
      en: 'That is why cracks start at sharp corners, holes, keyways, threads and the weld toe, where weld metal meets the plate, and also at scratches and corrosion pits.' },
  ],
  [ // s3 beach marks
    { nl: 'In die hoek begint een scheurtje, te klein om te zien. Bij elke periode van draaien groeit het een stukje verder de as in.',
      en: 'In that corner a small crack starts, too small to see. In each period of running it grows a little further into the shaft.' },
    { nl: 'Elke stop, of elke verandering van belasting, laat een ring achter op het breukvlak. Dat zijn {t:Rustlijnen|rustlijnen}: gebogen lijnen, zoals de lijnen die een golf op het strand achterlaat.',
      en: 'Each stop, or each change of load, leaves a ring on the fracture surface. Those are {t:Beach marks|beach marks}: curved lines, like the lines a wave leaves on the sand.' },
    { nl: 'Ze waaieren uit vanaf het startpunt, dus op het breukvlak lees je af waar de scheur begon: hier, in de hoek van de spiebaan. Kom niet aan het breukvlak en bewaar beide helften.',
      en: 'They spread out from the start point, so the fracture surface tells you where the crack began: here, in the corner of the keyway. Don\'t touch the fracture surface, and keep both halves.' },
    { nl: 'Dat deel is vrij glad, soms zelfs glanzend: de scheurvlakken schuurden langs elkaar.',
      en: 'That zone is fairly smooth, sometimes even shiny: the crack faces rubbed against each other.' },
  ],
  [ // s4 the final fracture
    { nl: 'Ondertussen wordt het metaal dat nog heel is steeds kleiner. Dezelfde last rust op een kleinere doorsnede, dus de spanning daarin loopt op.',
      en: 'Meanwhile the metal that is still whole gets smaller and smaller. The same load rests on a smaller cross-section, so the stress in it rises.' },
    { nl: 'Op een dag is de rest te klein, en breekt hij in één keer. Dat stuk is ruw en korrelig: de restbreuk.',
      en: 'One day the rest is too small, and it breaks at once. That part is rough and grainy: the final fracture zone.' },
    { nl: 'Is de restbreuk klein, dan was de spanning laag, en had de scheur de tijd om bijna dwars door de as te groeien. Een grote restbreuk wijst op een hoge spanning.',
      en: 'If the final zone is small, the stress was low, and the crack had time to grow almost right through the shaft. A large final zone points to a high stress.' },
    { nl: 'Zo ver hoeft het niet te komen. Op locatie vind je scheuren met penetrant: een rode vloeistof die in de scheur trekt, en hem laat zien op een witte laag.',
      en: 'It need not get that far. On site, you find cracks with dye penetrant: a red liquid that seeps into the crack, and shows it on a white coating.' },
  ],
  [ // s5 the S-N curve
    { nl: 'Hoe lang houdt een onderdeel het vol? De {t:Wöhlerkromme|Wöhlerkromme} zet de spanning uit tegen het aantal wisselingen tot breuk. Hoe lager de spanning, hoe meer wisselingen het overleeft.',
      en: 'How long does a part last? The {t:S-N curve|S-N curve} plots stress against the number of cycles to failure. The lower the stress, the more cycles it survives.' },
    { nl: 'Veel staalsoorten hebben een {t:Vermoeiingsgrens|vermoeiingsgrens}. Onder ruwweg de helft van de treksterkte halen gepolijste proefstaafjes {n:10} miljoen wisselingen, en rekent men met een oneindig leven. De kromme vlakt meestal ergens tussen één en tien miljoen wisselingen af.',
      en: 'Many steels show an {t:Endurance limit|endurance limit}. Below roughly half their tensile strength, polished test samples survive {n:10} million cycles, and are taken to last indefinitely. The curve usually levels off somewhere between one and ten million cycles.' },
    { nl: 'Aluminium heeft geen echte grens: een ontwerp noemt daar een leven in wisselingen. En ook staal breekt soms ver na {n:10} miljoen wisselingen. Oneindig leven is een handige benadering, geen natuurwet.',
      en: 'Aluminium has no real limit: a design states a life in cycles. And steels too sometimes fail far beyond {n:10} million cycles. Infinite life is a useful approximation, not a law.' },
    { nl: 'Een echt onderdeel zit lager dan dat gladde staafje: een ruw oppervlak, een groter formaat, corrosie en lassen halen er allemaal wat af. Een constante trekspanning erbovenop doet dat ook. Een statische berekening bewijst dus niks voor een trillend onderdeel.',
      en: 'A real part sits lower than that smooth sample: a rough surface, a larger size, corrosion and welds all take something off. A constant tensile stress on top does too. So a static calculation proves nothing for a vibrating part.' },
  ],
  [ // s6 the fix
    { nl: 'Terug naar het roerwerk. Na de eerste breuk kwam er sterker staal in, en hij brak opnieuw op dezelfde plek. Staal met een hoge sterkte is vaak juist gevoeliger voor kerven.',
      en: 'Back to the agitator. After the first failure a stronger steel went in, and it broke again in the same place. High-strength steels are often more sensitive to notches.' },
    { nl: 'Dus pak je de oorzaken aan. Eerst de kerf: de spiebaan krijgt een afgerond eind, en waar de as dunner wordt een ruime afronding. Een glad oppervlak en kogelstralen, dat de huid onder druk zet, helpen nog meer.',
      en: 'So you tackle the causes. First the notch: the keyway gets a rounded end, and where the shaft steps down, a generous radius. A smooth surface and shot peening, which puts the skin under compression, help further.' },
    { nl: 'Dan de wisselende last: de roerder wordt gebalanceerd, en de uitlijning wordt gecontroleerd. Minder buiging per omwenteling geeft een veel langer leven.',
      en: 'Then the changing load: the impeller is balanced, and the alignment is checked. Less bending per revolution gives a much longer life.' },
    { nl: 'Sterker staal hielp niet, een afronding wel. Breekt een onderdeel opnieuw na een sterker exemplaar, denk dan aan vermoeiing, en vraag naar de wisselingen, de trillingen en de afrondingsstraal.',
      en: 'Stronger steel did not help, a radius did. When a part breaks again after a stronger one went in, think of fatigue, and ask about the cycles, the vibration and the corner radius.' },
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
{
  const resolved = resolveFilm(spec, await allLessons());
  resolved.scenes.forEach((rs, si) => {
    const st = beatStarts(rs, 'nl');
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = st[bi] / rs.dur;
      const a1 = bi + 1 < st.length ? st[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
  });
}
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud in the spoken script
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  if (/[/&σε°^]|MPa|10\d/.test(line[lang])) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.fa-wall{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.fa-level{fill:none;stroke:var(--anatomy-mid);stroke-width:.6;stroke-dasharray:3 3}
.fa-well{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.5}
.fa-slot{fill:var(--anatomy-panel,var(--anatomy-card));stroke:var(--anatomy-hi);stroke-width:1.4}
.fa-key{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.5}
.fa-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.fa-crack{fill:none;stroke:var(--fp-accent);stroke-width:2px;stroke-linecap:round;stroke-linejoin:round}
.fa-pen{fill:var(--anatomy-face);stroke:none;opacity:.9}
.fa-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.fa-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.fa-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.fa-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.fa-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.fa-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.fa-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.fa-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.fa-lim{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:6 4}
.fa-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.fa-ghost{fill:none;stroke:var(--anatomy-mid);stroke-width:1.8;stroke-linecap:round;stroke-dasharray:3 5}
.fa-dot{fill:var(--anatomy-hi)}
.fa-acc{fill:var(--fp-accent);stroke:none}
.fa-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.fa-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.fa-band{fill:color-mix(in srgb,var(--anatomy-mid) 18%,transparent);stroke:none}
.fa-solid{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:1.4;stroke-linejoin:round}
.fa-face{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.6}
.fa-smooth{fill:color-mix(in srgb,var(--anatomy-mid) 30%,var(--anatomy-face));stroke:none}
.fa-mark{fill:none;stroke:var(--anatomy-mid);stroke-width:1.3}
.fa-grain{fill:var(--anatomy-mid)}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .fa-line{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .fa-mark{stroke:var(--fp-accent)}
[data-cue][data-on] .fa-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fa-lim{stroke:var(--fp-accent)}
[data-cue][data-on] .fa-txt{fill:var(--fp-accent-text)}
[data-cue][data-on] .fa-well{stroke:var(--fp-accent);stroke-width:.8}
`;

const label = {
  nl: 'Een roerwerk in een tank die aan de voorkant is opengesneden: een tank op een voetring met ankerlippen, een bodemplaat, een achterwand met twee keerschotten en een lasnaad, een randflens met bouten en een brug van twee balken. Op de brug een montageplaat, een tandwielkast met ribben, typeplaatje, ontluchter en aftapplug, en een motor met koelribben, klemmenkast en ventilatorkap. Onder de brug het lagerhuis, een flenskoppeling met zes bouten en de as met spiebaan en spie; onderaan de roerder met vier schuine schoepen op een naaf. De as draait, in de hoek van de spiebaan groeit een scheur en de as breekt. Kaarten, elk gemarkeerd als voorbeeld, tonen de teller van lastwisselingen, een plaat met een gat, het breukvlak met rustlijnen, de Wöhlerkromme en de oplossing.',
  en: 'An agitator in a tank cut open at the front: a tank on a skirt with anchor lugs, a floor plate, a back wall with two baffles and a weld seam, a rim flange with bolts and a bridge of two beams. On the bridge a mounting plate, a gearbox with ribs, name plate, breather and drain plug, and a motor with cooling fins, terminal box and fan cowl. Under the bridge the bearing housing, a flange coupling with six bolts and the shaft with its keyway and key; at the bottom the impeller with four pitched blades on a hub. The shaft turns, a crack grows in the keyway corner and the shaft breaks. Cards, each marked as an example, show the load-cycle counter, a plate with a hole, the fracture surface with beach marks, the S-N curve and the fix.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
