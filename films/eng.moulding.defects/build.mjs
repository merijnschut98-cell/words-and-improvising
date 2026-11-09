// Dev tool, not shipped. Builds the explainer film "Hoe een fout ontstaat /
// How a defect forms" for the topic Fouten of Spuitgieten (defects L1,
// diagnose L2, warpage L3, defectdata L4).
//
//   node films/eng.moulding.defects/build.mjs            build the page
//   node films/eng.moulding.defects/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.moulding.defects.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.3.
//
// The drawing: a moving mould half in the style of the films eng.moulding.setting
// and eng.moulding.machine (same terms and palette), out of the press and laid on the toolroom
// bench with its parting face up, so we look straight into the cavity: the
// cold runner with its sprue puller, the gate, the cavity of a flat cover
// (200 × 100 mm, the cover of the warpage lesson, gated at one short end) with
// a core pin for a hole, two rib grooves and ejector pins, the vents and their
// relief channels at the end of the flow path, guide pillars, cooling-water
// nipples and a cavity pressure sensor near the end of fill. Beside it a
// measuring plate, where a moulded cover lies and warps. The melt, its flow
// front and every defect are drawn per frame on the parting plane (stage.js);
// cards in stage space carry the section of a rib, the questions, the fill
// study, the shrinkage, the DOE and the cavity pressure curve.
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
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the lessons (the build fails if a
// value drifts). The captions' and the narration's {n:...} numbers are then
// checked against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// defects: vents 0,01–0,05 mm deep; a PP crate flashes after 80.000 shots,
// 180 → 220 t hides a worn parting line, repaired and back on 180 t
const VENT = { min: 0.01, max: 0.05 };
const CRATE = { shots: 80000, clamp: 180, raised: 220 };
assert(CRATE.raised > CRATE.clamp && VENT.min < VENT.max, 'crate and vents');
// defects: measure warp-sensitive parts after a fixed wait, e.g. 24 h
const WAIT_H = 24;
// diagnose: 1 in 20 shots short, always cavity 2 of 4 → 5 % of shots, 1,25 % of parts
const DIAG = { every: 20, cav: 2, cavities: 4 };
const SHOTS_PCT = 100 / DIAG.every;
const PARTS_PCT = SHOTS_PCT / DIAG.cavities;
assert(SHOTS_PCT === 5 && near(PARTS_PCT, 1.25), '1 in 20 = 5 %, / 4 = 1,25 %');
assert(near((100 / 10) / 8, 1.25), 'recall: 1 in 10 of 8 cavities = 1,25 %');
// diagnose: a fill study to 50, 70, 90 and 95 % full; wait 20–30 min after a temperature change
const STUDY = [50, 70, 90, 95];
const WAIT_T = [20, 30];
// warpage: PA6 GF30 cover 200 × 100 mm, 0,3 % along and 0,7 % across, steel at one 0,5 %
const SH = { L: 200, W: 100, along: 0.003, across: 0.007, one: 0.005 };
const STEEL = { L: SH.L * (1 + SH.one), W: SH.W * (1 + SH.one) };
const PART = { L: Math.round(STEEL.L * (1 - SH.along) * 10) / 10, W: Math.round(STEEL.W * (1 - SH.across) * 10) / 10 };
const PER = { L: Math.round(SH.L * (1 + SH.along) * 10) / 10, W: Math.round(SH.W * (1 + SH.across) * 10) / 10 };
assert(near(STEEL.L, 201) && near(STEEL.W, 100.5), 'steel 201,0 × 100,5');
assert(PART.L === 200.4 && PART.W === 99.8, 'part 200,4 × 99,8');
assert(PER.L === 200.6 && PER.W === 100.7, 'steel per direction 200,6 × 100,7');
assert(SH.across / SH.along >= 2 && SH.across / SH.along <= 3, 'across shrinks 2–3 × along');
// conditioning: a fixed time in a fixed climate, e.g. 23 °C and 50 % RH (the standard
// atmosphere of ISO 291); the lesson gives no time, so the film names none
const COND = { T: 23, rh: 50 };
const HALVES_DT = 10; // "zo’n 10 °C verschil tussen de helften kan al genoeg zijn"
// defectdata: 2 × 2 DOE on sink depth (µm): [time short/long][pressure low/high]
const DOE = [[40, 30], [24, 10]];
const avg = (a, b) => (a + b) / 2;
const ME = {
  pHi: avg(DOE[0][1], DOE[1][1]), pLo: avg(DOE[0][0], DOE[1][0]),
  tHi: avg(DOE[1][0], DOE[1][1]), tLo: avg(DOE[0][0], DOE[0][1]),
};
assert(ME.pHi === 20 && ME.pLo === 32 && ME.pHi - ME.pLo === -12, 'pressure main effect −12 µm');
assert(ME.tHi === 17 && ME.tLo === 35 && ME.tHi - ME.tLo === -18, 'time main effect −18 µm');
assert(DOE[0][1] - DOE[0][0] === -10 && DOE[1][1] - DOE[1][0] === -14, 'interaction: −10 short, −14 long');
assert(2 ** 2 === 4 && 2 ** 3 === 8, 'runs');

// ---------------------------------------------------------------- the world
// x along the flow (gate at x = −100, end of fill at x = +100), y across, z up;
// the parting face is the plane z = 0. World units are millimetres.
const W = 640;
const H = 400;
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const CAV = { x0: -100, x1: 100, y0: -50, y1: 50, d: 6 };
const RUN = { x0: -150, x1: -104, h: 4, d: 4 };
const GATE = { x0: -104, x1: -100, h: 2, d: 2.5 };
const PIN = { x: -20, y: 0, r: 12 };
const RIBS = [30, 62]; // rib grooves across the cavity floor, 6 wide
const EJ = [[-70, -28], [-70, 28], [10, -28], [10, 28], [80, -28], [80, 28]];
const VENTS = [-34, 0, 34];
const SENSOR = { x: 90, y: -14, r: 3.2 };
const PLATE = { x: -170, y: -110, w: 340, d: 220, r: 2 };
const CLAMPP = { x: -184, y: -122, w: 368, d: 244, r: 2 };
const BENCH = { x: -250, y: -175, w: 730, d: 330, r: 3 };
const MPLATE = { x: 222, y: -80, w: 228, d: 160, r: 2 }; // the measuring plate
const MP_TOP = -54;
const PILLARS = [[-148, -88], [148, -88], [-148, 88], [148, 88]];
const Z_BENCH = -112;

const FIT = [...k.boxCorners(BENCH, Z_BENCH - 20, 46)];
const P = k.fitProjection(FIT, W, H, { pad: 6, azimuth: 52, elevation: 38 });
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const slab = (plan, z0, z1, style = {}, bevel = 0.6) => S(k.slabOf({ r: 0.8, ...plan }, z0, z1 - z0, P, 4, bevel), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const top = (pts, z, cls) => `<path class="${cls}" d="${k.onTop(pts, z, P, true)}"/>`;
const rectXY = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const ringXY = (cx, cy, r, n = 28) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cy + r * Math.sin((i / n) * Math.PI * 2)]);
const dots = (pts, size = 0.55, tone = 'mid') => k.dotsSvg(pts.map(at), { size, tone });
const V = k.towardViewer(P);

// A pocket cut into a face at z = 0: its floor, then the inner walls that face
// the viewer (a wall is seen when its inward normal points at the viewer).
function pocket(ring, depth, { floor = 'fp-bore', rim = 'fp-cutline', z = 0 } = {}) {
  let s = top(ring, z - depth, floor);
  // the inward normal of edge a → b points from its middle toward the ring's centre
  const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const cy = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length];
    let n = [-(b[1] - a[1]), b[0] - a[0]];
    if (n[0] * (cx - (a[0] + b[0]) / 2) + n[1] * (cy - (a[1] + b[1]) / 2) < 0) n = [-n[0], -n[1]];
    const len = Math.hypot(n[0], n[1]) || 1;
    const facing = (n[0] * V[0] + n[1] * V[1]) / len;
    if (facing <= 0.02) return;
    const q = [[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z - depth], [a[0], a[1], z - depth]].map(at);
    s += `<path class="${facing > 0.7 ? 'fp-wall' : 'fp-wall2'}" d="${k.pathOf(q, true)}"/>`;
  });
  return s + `<path class="${rim}" d="${k.onTop(ring, z, P, true)}"/>`;
}
const ccw = (x0, x1, y0, y1) => [[x0, y0], [x0, y1], [x1, y1], [x1, y0]];

// ---------------------------------------------------------------- static parts, back to front
const bench = [
  slab(BENCH, Z_BENCH - 22, Z_BENCH, { tone: 'lo' }, 1),
  L(k.sideSeam(BENCH, Z_BENCH - 6, P, 4), { tone: 'faint' }),
  // a ruler strip along the bench's near edge, with ticks every 10 mm
  slab({ x: BENCH.x + 20, y: BENCH.y + BENCH.d - 22, w: 300, d: 14, r: 0.5 }, Z_BENCH, Z_BENCH + 1.2, { tone: 'lo', crease: 'lo' }, 0.3),
  ...(() => { const t = k.topTicks(BENCH.x + 26, BENCH.x + 314, 10, 5, BENCH.y + BENCH.d - 22, Z_BENCH + 1.2, [4, 8], P); return [L(t.minor, { tone: 'lo' }), L(t.major, { tone: 'mid' })]; })(),
].join('');

const clampPlate = [
  slab(CLAMPP, -86, -62, { tone: 'lo' }, 0.8),
  // the clamp slots at both ends, where the mould is bolted to the platen
  ...[-1, 1].flatMap((sx) => [-70, 70].map((y) => top(rectXY(sx > 0 ? 172 : -184, sx > 0 ? 184 : -172, y - 9, y + 9), -62, 'fp-bore'))),
  dots([[-178, -100, -62], [178, -100, -62], [-178, 100, -62], [178, 100, -62]], 0.6),
].join('');

// the mould half: the cavity plate on its support plate, seams on the sides
const plate = [
  slab(PLATE, -62, 0, { tone: 'mid', inner: L(k.sideSeam(PLATE, -34, P, 4), { tone: 'lo' }) }, 0.8),
  // screws of the cavity plate on the face, and the plate's engraved number field
  dots([[-160, -100, 0], [160, -100, 0], [-160, 100, 0], [160, 100, 0], [0, -100, 0], [0, 100, 0]], 0.6),
  ...[[-160, -100], [160, -100], [-160, 100], [160, 100], [0, -100], [0, 100]].map(([x, y]) => L(k.onTop(ringXY(x, y, 3.2, 16), 0, P, true), { tone: 'lo' })),
  top(rectXY(-150, -112, 74, 96), 0, 'fp-label-plate'),
  ...[80, 85, 90].map((y) => L(k.onTop([[-146, y], [y === 90 ? -126 : -118, y]], 0, P), { tone: 'lo', free: true })),
].join('');

// cooling water: nipples on the near side face (y = +110), each on a drilled channel
const nipples = [-120, -40, 40, 120].map((x) => [
  S(G.solidOf([[0, 6.5], [3, 6.5], [3, 4.6], [9, 4.6], [9, 5.6], [12, 5.6], [12, 3.6], [15, 3.6]], G.frameOf([x, 110, -24], Y, X, Z), P), { tone: 'mid', crease: 'lo' }),
].join('')).join('');
// the channel ends on the right side face (x = +170), plugged
const plugs = [-70, 0, 70].map((y) => L(G.circleOf(G.frameOf([170, y, -24], X, Y, Z), 0, 4.2, P), { tone: 'mid' }) + dots([[170.2, y, -24]], 0.5)).join('');
// a label plate on the near face: mould number, cavities, material
const label = [
  `<path class="fp-label-plate" d="${k.pathOf([[50, 110, -10], [110, 110, -10], [110, 110, -26], [50, 110, -26]].map(at), true)}"/>`,
  ...[-14, -18, -22].map((z) => L(k.pathOf([[54, 110, z], [z === -22 ? 86 : 104, 110, z]].map(at)), { tone: 'lo', free: true })),
  dots([[52, 110, -12], [108, 110, -12], [52, 110, -24], [108, 110, -24]], 0.45),
].join('');

// the feed system and the cavity, cut into the face
const RUNNER = ccw(RUN.x0, RUN.x1, -RUN.h, RUN.h);
const GATER = ccw(GATE.x0, GATE.x1, -GATE.h, GATE.h);
const CAVR = ccw(CAV.x0, CAV.x1, CAV.y0, CAV.y1);
const cavity = [
  pocket(RUNNER, RUN.d),
  // the sprue puller at the runner's start: a cold-slug well with an undercut
  top(ringXY(RUN.x0, 0, 6.5, 20), 0, 'fp-bore'), L(k.onTop(ringXY(RUN.x0, 0, 6.5, 20), 0, P, true), { tone: 'mid' }),
  top(ringXY(RUN.x0, 0, 3.6, 16), -6, 'fp-deep'),
  pocket(GATER, GATE.d),
  pocket(CAVR, CAV.d),
  // two rib grooves across the cavity floor (the thick ribs of the cover)
  ...RIBS.map((x) => pocket(ccw(x, x + 6, CAV.y0, CAV.y1), 10, { z: -CAV.d, floor: 'fp-deep' })),
  // ejector pins flush with the floor
  ...EJ.map(([x, y]) => top(ringXY(x, y, 3.4, 16), -CAV.d + 0.05, 'fp-steel') + L(k.onTop(ringXY(x, y, 3.4, 16), -CAV.d + 0.05, P, true), { tone: 'mid' })),
].join('');
// vents: shallow lands from the cavity edge, then deeper relief channels to the plate's edge
const vents = VENTS.map((y) => top(rectXY(CAV.x1, CAV.x1 + 14, y - 5, y + 5), -0.05, 'fp-vent') + `<path class="fp-mark" d="${k.onTop(rectXY(CAV.x1, CAV.x1 + 14, y - 5, y + 5), 0, P, true)}"/>`).join('');
const relief = VENTS.map((y) => pocket(ccw(CAV.x1 + 14, 170, y - 6, y + 6), 2)).join('');
// the gate (lit when named) and the cavity outline (the "cavity" cue)
const gateMark = `<path class="fp-mark" d="${k.onTop(rectXY(GATE.x0 - 3, GATE.x1 + 3, -6, 6), 0.1, P, true)}"/>`;
const cavMark = `<path class="fp-mark" d="${k.onTop(CAVR, 0.1, P, true)}"/>`;

// guide pillars at the corners, with a lube groove; far ones before the cavity content, near ones after
const pillar = ([x, y]) => [
  S(G.solidOf([[0, 13], [4, 13]], G.frameOf([x, y, 0], Z, X, Y), P), { tone: 'mid', crease: 'lo' }),
  S(G.solidOf([[0, 9], [26, 9], [26, 8.2], [29, 8.2], [29, 9], [40, 9], [44, 6.5]], G.frameOf([x, y, 4], Z, X, Y), P), { tone: 'hi', crease: 'lo' }),
].join('');
const farPillars = PILLARS.filter(([, y]) => y < 0).map(pillar).join('');
const nearPillars = PILLARS.filter(([, y]) => y > 0).map(pillar).join('');

// the core pin for the hole, standing 2 mm proud of the face
const corePin = S(k.cylinder(PIN.x, PIN.y, PIN.r, -CAV.d, CAV.d + 2, P, 32, 0.4), { tone: 'hi', crease: 'lo' })
  + L(k.onTop(ringXY(PIN.x, PIN.y, PIN.r - 3, 24), 2, P, true), { tone: 'lo' });
// the cavity pressure sensor near the end of fill: a flush pin, its cable out
// through a relief channel to a connector block on the near face
const sensor = [
  top(ringXY(SENSOR.x, SENSOR.y, SENSOR.r, 18), -CAV.d + 0.08, 'fp-sens'),
  `<path class="fp-mark" d="${k.onTop(ringXY(SENSOR.x, SENSOR.y, SENSOR.r + 1.4, 18), -CAV.d + 0.08, P, true)}"/>`,
].join('');
const sensorCable = [
  slab({ x: 128, y: 110, w: 26, d: 10, r: 0.6 }, -20, -4, { tone: 'mid', crease: 'lo' }, 0.4),
  dots([[134, 120, -8], [148, 120, -8]], 0.55, 'hi'),
  S(G.solidOf([[0, 2.2], [26, 2.2]], G.frameOf([141, 120, -12], Y, X, Z), P), { tone: 'lo', crease: 'none' }),
].join('');

// the measuring plate (granite) with its grid, on the bench to the right
const mplate = [
  slab(MPLATE, Z_BENCH, MP_TOP, { tone: 'mid' }, 1.2),
  L(k.sideSeam(MPLATE, MP_TOP - 8, P, 4), { tone: 'faint' }),
  ...[0, 1, 2, 3, 4].map((i) => L(k.onTop([[MPLATE.x + 8, MPLATE.y + 16 + i * 32], [MPLATE.x + MPLATE.w - 8, MPLATE.y + 16 + i * 32]], MP_TOP, P), { tone: 'faint' })),
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => L(k.onTop([[MPLATE.x + 16 + i * 32.6, MPLATE.y + 8], [MPLATE.x + 16 + i * 32.6, MPLATE.y + MPLATE.d - 8]], MP_TOP, P), { tone: 'faint' })),
].join('');
// a height gauge standing at the far edge of the plate, its probe over the cover's end
const GAUGE = { x: 412, y: -66 };
const gauge = [
  slab({ x: GAUGE.x - 14, y: GAUGE.y - 10, w: 28, d: 20, r: 1 }, MP_TOP, MP_TOP + 8, { tone: 'mid' }, 0.6),
  S(k.cylinder(GAUGE.x, GAUGE.y, 3.2, MP_TOP + 8, 70, P, 20), { tone: 'mid', crease: 'lo' }),
  slab({ x: GAUGE.x - 6, y: GAUGE.y - 4, w: 12, d: 30, r: 0.6 }, MP_TOP + 50, MP_TOP + 56, { tone: 'hi', crease: 'lo' }, 0.3),
  S(k.cylinder(GAUGE.x, GAUGE.y + 24, 1.4, MP_TOP + 30, 20, P, 12), { tone: 'hi', crease: 'lo' }),
].join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  g('bench', bench),
  g('clampP', clampPlate),
  g('plate', plate),
  g('plugs', plugs),
  g('farP', farPillars),
  g('cavity', cavity),
  g('relief', relief),
  g('vents', vents, ' data-cue="vent"'),
  g('wear', '', ' data-cue="wear"'),
  g('melt', '', ' data-cue="short"'),
  g('splay', '', ' data-cue="splay"'),
  g('weld', '', ' data-cue="weld"'),
  g('front', '', ' data-cue="front"'),
  g('sensorS', sensor, ' data-cue="sensor"'),
  g('jet', '', ' data-cue="jet"'),
  g('air', '', ' data-cue="air"'),
  g('burn', '', ' data-cue="burn"'),
  g('flash', '', ' data-cue="flash"'),
  g('rib', '', ' data-cue="rib"'),
  g('pack', '', ' data-cue="pack"'),
  g('pin', corePin),
  g('gate', gateMark, ' data-cue="gate"'),
  g('cavM', cavMark, ' data-cue="cavity"'),
  g('nipples', nipples + label),
  g('cable', sensorCable, ' data-cue="sensor"'),
  g('nearP', nearPillars),
  g('mplate', mplate),
  `<g data-cue="diff">${g('part', '', ' data-cue="warp"')}</g>`,
  g('gauge', gauge),
].join('');

// ---------------------------------------------------------------- cards (stage space, not under the camera)
const slot = (cue, key) => `<g data-cue="${cue}">${g(key, '')}</g>`;
const hud = [
  g('sinkC', [g('sinkBase', ''), slot('sink', 'sinkBody'), slot('void', 'voidBody')].join('')),
  g('askC', slot('ask', 'askBody')),
  g('cav4C', slot('cav4', 'cav4Body')),
  g('studyC', slot('study', 'studyBody')),
  g('logC', slot('log', 'logBody')),
  g('sampleC', slot('sample', 'sampleBody')),
  g('shrinkC', slot('shrink', 'shrinkBody')),
  g('cornerC', slot('corner', 'cornerBody')),
  g('condC', slot('cond', 'condBody')),
  g('solvedC', slot('solved', 'solvedBody')),
  g('doeC', [g('doeBase', ''), slot('doe', 'doeCells'), slot('main', 'doeMain'), slot('inter', 'doeInter')].join('')),
  g('curveC', [g('curveBase', ''), slot('sensor', 'curveOne'), slot('monitor', 'curveLim')].join('')),
  g('clockC', slot('clock', 'clockBody')),
].join('');
// Page weight: drop a line point within 0.2 units of the last one kept (plain M/L/Z paths only).
const slim = (s) => s.replace(/ d="([^"]*)"/g, (m, d) => {
  if (!/^[MLZ0-9 .-]+$/.test(d)) return m;
  const out = [];
  let last = null;
  for (const tok of d.match(/[MLZ][^MLZ]*/g) ?? []) {
    if (tok[0] === 'Z') { out.push('Z'); last = null; continue; }
    const xy = tok.slice(1).trim();
    const [x, y] = xy.split(/\s+/).map(Number);
    if (tok[0] === 'L' && last && Math.hypot(x - last[0], y - last[1]) < 0.2) continue;
    out.push(tok[0] + xy);
    last = [x, y];
  }
  return ` d="${out.join('')}"`;
});
const svg = slim(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras: [cx, cy, w] per beat
// cam(p, w, s): world point p at stage point s, w wide
const cam = (p, w, s = [W / 2, H / 2]) => { const [x, y] = at(p); const kk = w / W; return [Math.round((x + (W / 2 - s[0]) * kk) * 10) / 10, Math.round((y + (H / 2 - s[1]) * kk) * 10) / 10, w]; };
const MOULD = cam([0, 0, -30], 470);
const CAVV = cam([0, 0, -6], 330);
const CAV_L = cam([-10, 0, -6], 330, [190, 214]);
const END = cam([60, 0, -6], 250);
const GATEV = cam([-80, 0, -6], 250);
const CORNER = cam([90, -40, 0], 220);
const PARTV = cam([336, 0, -50], 330);
const PART_L = cam([336, 0, -50], 380, [190, 214]);
const WHOLE = cam([110, -10, -50], 680);
const KEYS = [
  [MOULD, CAVV, END, CAVV], // s1 how the cavity fills
  [CAVV, END, END], // s2 short shot, vents, burn marks
  [CORNER, CORNER, CORNER], // s3 flash
  [CAV_L, CAV_L, CAVV, GATEV], // s4 sink, voids, weld line, splay
  [WHOLE, PARTV, MOULD], // s5 warpage
  [CAV_L, CAV_L, CAV_L, GATEV], // s6 look first
  [CAV_L, CAV_L], // s7 one thing at a time
  [PARTV, PART_L, PART_L, PART_L], // s8 shrinkage and size
  [CAV_L, CAV_L, CAV_L, CAV_L, CAV_L], // s9 solving for good
];

// ---------------------------------------------------------------- the film
const DE = 'eng.moulding.defects';
const DI = 'eng.moulding.diagnose';
const WA = 'eng.moulding.warpage';
const DD = 'eng.moulding.defectdata';
const spec = {
  id: 'eng.moulding.defects',
  title: { nl: 'Hoe een fout ontstaat', en: 'How a defect forms' },
  lessons: [DE, DI, WA, DD],
  scenes: [
    {
      // v14b: the Basis "how it works": how the cavity fills, where a defect can start
      id: 's1', lesson: DE, level: 1, still: 0.5, title: { nl: 'Hoe de holte vol loopt', en: 'How the cavity fills' },
      beats: [
        { nl: 'Een open matrijshelft: het verdeelkanaal, het aanspuitpunt en de holte, de vorm van het product.', en: 'An open mould half: the runner, the gate and the cavity, the shape of the part.', cues: ['cavity', 'gate'] },
        { nl: 'De smelt stroomt vanaf het aanspuitpunt; de voorkant heet het {t:Vloeifront|vloeifront}.', en: 'The melt flows out from the gate; its leading edge is the {t:Flow front|flow front}.', cue: { Vloeifront: 'front' } },
        { nl: 'De lucht in de holte moet eruit, via de {t:Ontluchting|ontluchting} op de deellijn.', en: 'The air in the cavity has to escape, through the {t:Vents|vents} at the parting line.', cue: { Ontluchting: 'vent' }, read: { nl: 'meestal {n:0.01}–{n:0.05} mm diep', en: 'typically {n:0.01}–{n:0.05} mm deep' } },
        { nl: 'Dan nadruk, koelen en uitwerpen. Elke fout ontstaat in een van deze stappen.', en: 'Then holding pressure, cooling and ejection. Every defect forms in one of these steps.', cues: ['pack'], read: { nl: 'vullen → nadrukken → koelen → uitwerpen', en: 'fill → pack → cool → eject' } },
      ],
    },
    {
      id: 's2', lesson: DE, level: 1, still: 0.5, title: { nl: 'Short shot en brandplekken', en: 'Short shots and burn marks' },
      beats: [
        { nl: 'Een {t:Short shot|short shot}: het vloeifront haalt het eind van de vloeiweg niet.', en: 'A {t:Short shot|short shot}: the flow front does not reach the end of the flow path.', cue: { 'Short shot': 'short' }, cues: ['front'] },
        { nl: 'Dichte ontluchting: de lucht kan niet weg en houdt de kunststof tegen.', en: 'Clogged vents: the air cannot escape and holds the plastic back.', cues: ['vent', 'air'] },
        { nl: 'Brandplekken: samengeperste lucht wordt zo heet dat de kunststof verschroeit.', en: 'Burn marks: compressed air gets so hot that it scorches the plastic.', cues: ['burn'] },
      ],
    },
    {
      id: 's3', lesson: DE, level: 1, still: 0.5, title: { nl: 'Braam', en: 'Flash' },
      beats: [
        { nl: '{t:Braam|Braam} is het omgekeerde: kunststof lekt als een dun vliesje uit op de deellijn.', en: '{t:Flash|Flash} is the opposite: plastic leaks out as a thin fin at the parting line.', cue: { Braam: 'flash' } },
        { nl: 'Een krat geeft na {n:80000} shots braam op één hoek. Meer sluitkracht, en hij is weg.', en: 'A crate starts flashing at one corner after {n:80000} shots. More clamp force, and it is gone.', cues: ['flash'], read: { nl: 'sluitkracht {n:180} → {n:220} t', en: 'clamp force {n:180} → {n:220} t' } },
        { nl: 'Twee weken later is hij terug: de deellijn is versleten. Repareren, en weer op {n:180} ton.', en: 'Two weeks later it is back: the parting line is worn. Repair it, and back to {n:180} tonnes.', cues: ['wear'], read: { nl: 'deellijn gerepareerd · {n:180} t', en: 'parting line repaired · {n:180} t' } },
      ],
    },
    {
      id: 's4', lesson: DE, level: 1, still: 0.5, title: { nl: 'Inzakplek en bindnaad', en: 'Sink marks and weld lines' },
      beats: [
        { nl: 'Een {t:Inzakplek|inzakplek}: boven een dikke rib trekt de krimpende kern de huid naar binnen.', en: 'A {t:Sink mark|sink mark}: above a thick rib the shrinking core pulls the skin inwards.', cue: { Inzakplek: 'sink' }, cues: ['rib'] },
        { nl: 'Te weinig nadruk, of een aanspuitpunt dat te vroeg bevriest. Binnenin: vacuümbellen.', en: 'Too little holding pressure, or a gate that freezes too early. Inside: voids.', cues: ['void'] },
        { nl: 'Een {t:Bindnaad|bindnaad}: achter het gat komen twee vloeifronten samen in een dun lijntje.', en: 'A {t:Weld line|weld line}: behind the hole two flow fronts meet in a thin line.', cue: { Bindnaad: 'weld' } },
        { nl: 'Zilverstrepen vanaf het aanspuitpunt wijzen meestal op nat materiaal.', en: 'Silver streaks fanning out from the gate usually point to wet material.', cues: ['splay'] },
      ],
    },
    {
      id: 's5', lesson: DE, level: 1, still: 0.5, title: { nl: 'Kromtrekken', en: 'Warpage' },
      beats: [
        { nl: '{t:Kromtrekken|Kromtrekken}: na het uitwerpen buigt het product, omdat het ongelijk krimpt.', en: '{t:Warpage|Warpage}: after ejection the part bends, because it shrinks unevenly.', cue: { Kromtrekken: 'warp' } },
        { nl: 'Vaak pas uren later. Meet gevoelige producten na een vaste wachttijd, bijvoorbeeld {n:24} uur.', en: 'Often only hours later. Measure sensitive parts after a fixed wait, for example {n:24} hours.', cues: ['warp'] },
        { nl: 'Voordat je aan de instellingen komt: welke holte, waar op het product, en sinds wanneer?', en: 'Before touching the settings: which cavity, where on the part, and since when?', cues: ['cavity'] },
      ],
    },
    {
      id: 's6', lesson: DI, level: 2, still: 0.5, title: { nl: 'Eerst kijken', en: 'Look first' },
      beats: [
        { nl: 'Vier vragen: welke holte, waar, elk shot of af en toe, en sinds wanneer?', en: 'Four questions: which cavity, where, every shot or now and then, and since when?', cues: ['ask'] },
        { nl: 'Eén op {n:20} shots short in holte {n:2}: {n:5}% van de shots, gedeeld door {n:4} is {n:1.25}%.', en: 'One in {n:20} shots short in cavity {n:2}: {n:5}% of shots, divided by {n:4} is {n:1.25}%.', cues: ['cav4'] },
        { nl: 'Een {t:Vulstudie|vulstudie}: short shots met opzet, tot {n:50}, {n:70}, {n:90} en {n:95}% vol.', en: 'A {t:Fill study|fill study}: short shots on purpose, to {n:50}, {n:70}, {n:90} and {n:95}% full.', cue: { Vulstudie: 'study' }, cues: ['front'] },
        { nl: '{t:Jetting|Jetting}: uit een klein aanspuitpunt spuit een slangetje de lege holte in.', en: '{t:Jetting|Jetting}: a snake squirts from a small gate into the empty cavity.', cue: { Jetting: 'jet' } },
      ],
    },
    {
      id: 's7', lesson: DI, level: 2, still: 0.5, title: { nl: 'Eén ding tegelijk', en: 'One thing at a time' },
      beats: [
        { nl: 'Verander één ding en wacht: zo’n tien shots, na een temperatuur {n:20} tot {n:30} minuten.', en: 'Change one thing and wait: about ten shots, after a temperature change {n:20} to {n:30} minutes.', cues: ['log'] },
        { nl: 'Een {t:Grensmonster|grensmonster}: een product precies op de grens, getekend door kwaliteit.', en: 'A {t:Boundary sample|boundary sample}: a part right on the limit, signed by quality.', cue: { Grensmonster: 'sample' } },
      ],
    },
    {
      id: 's8', lesson: WA, level: 3, still: 0.5, title: { nl: 'Krimp en maat', en: 'Shrinkage and size' },
      beats: [
        { nl: '{t:Ongelijke krimp|Ongelijke krimp}: door dikte, temperatuur of vezels krimpt het ene deel meer.', en: '{t:Differential shrinkage|Differential shrinkage}: thickness, temperature or fibres make one region shrink more.', cue: { 'Ongelijke krimp': 'diff' } },
        { nl: '{t:Verwerkingskrimp|Verwerkingskrimp} {n:0.3}% langs, {n:0.7}% dwars; staal op {n:0.5}%: {n:201.0} mm wordt {n:200.4}.', en: '{t:Mould shrinkage|Mould shrinkage} {n:0.3}% along, {n:0.7}% across; steel at {n:0.5}%: {n:201.0} mm becomes {n:200.4}.', cue: { Verwerkingskrimp: 'shrink' }, read: { nl: 'staal per richting: {n:200.6} × {n:100.7} mm', en: 'steel per direction: {n:200.6} × {n:100.7} mm' } },
        { nl: 'Het {t:Hoekeffect|hoekeffect}: warmte in de binnenhoek van de kern trekt de wanden naar binnen.', en: 'The {t:Corner effect|corner effect}: heat in the inside corner of the core pulls the walls in.', cue: { Hoekeffect: 'corner' }, read: { nl: 'oplossing: meer koeling in de kern', en: 'fix: more cooling in the core' } },
        { nl: '{t:Conditioneren|Conditioneren}: een vaste tijd in een vast klimaat, zoals {n:23} °C en {n:50}% vocht.', en: '{t:Conditioning|Conditioning}: a fixed time in a fixed climate, such as {n:23} °C and {n:50}% humidity.', cue: { Conditioneren: 'cond' }, read: { nl: 'eerst stabiel, dan meten, één keer corrigeren', en: 'stabilise, measure, correct once' } },
      ],
    },
    {
      id: 's9', lesson: DD, level: 4, still: 0.5, title: { nl: 'Blijvend oplossen', en: 'Solving it for good' },
      beats: [
        { nl: 'Blijvend opgelost: de oorzaak bewezen met data, het procesvenster bekend, en bewaking.', en: 'Solved for good: the cause proven with data, the process window known, and monitoring.', cues: ['solved'] },
        { nl: 'Een proefopzet ({t:DOE|DOE}) op inzakplekken: {n:2} instellingen, laag en hoog: {n:40}, {n:30}, {n:24} en {n:10} µm.', en: 'A {t:DOE|DOE} on sink marks: {n:2} settings, low and high: {n:40}, {n:30}, {n:24} and {n:10} µm.', cue: { DOE: 'doe' } },
        { nl: '{t:Hoofdeffect|Hoofdeffect}: druk −{n:12}, tijd −{n:18} µm; en een kleine {t:Interactie|interactie}.', en: '{t:Main effect|Main effect}: pressure −{n:12}, time −{n:18} µm; and a small {t:Interaction|interaction}.', cue: { Hoofdeffect: 'main', Interactie: 'inter' } },
        { nl: 'Een {t:Holtedruksensor|holtedruksensor} aan het eind van de vulling meet elk shot de druk in de holte.', en: 'A {t:Cavity pressure sensor|cavity pressure sensor} near the end of fill measures the pressure in the cavity every shot.', cue: { Holtedruksensor: 'sensor' } },
        { nl: '{t:Procesbewaking|Procesbewaking}: een shot buiten de grenzen wordt automatisch uitgesorteerd.', en: '{t:Process monitoring|Process monitoring}: a shot outside the limits is diverted automatically.', cue: { Procesbewaking: 'monitor' } },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the film replaces the lesson text. Same markers; the build checks
// its terms and numbers against the lessons. Units are written as said
// (millimeter, ton, procent, graden, micrometer); a number the voice would read
// badly (80.000) is written as a word. A term is named while its cue is lit.
const SAY = [
  [ // s1 how the cavity fills
    { nl: 'Via het verdeelkanaal en het aanspuitpunt komt de smelt in de holte: hier een plat deksel met een gat en twee ribben.',
      en: 'Through the runner and the gate the melt enters the cavity: here a flat cover with a hole and two ribs.' },
    { nl: 'De smelt stroomt vanaf het aanspuitpunt. De voorkant heet het {t:Vloeifront|vloeifront}; het laatste punt is het eind van de vloeiweg.',
      en: 'The melt flows out from the gate. Its leading edge is the {t:Flow front|flow front}; the last spot is the end of the flow path.' },
    { nl: 'De lucht ontsnapt via de {t:Ontluchting|ontluchting}: sleufjes op de deellijn, meestal {n:0.01} tot {n:0.05} millimeter diep, afhankelijk van de kunststof. Te dun voor kunststof.',
      en: 'The air escapes through the {t:Vents|vents}: slots at the parting line, typically {n:0.01} to {n:0.05} millimetres deep, depending on the plastic. Too thin for plastic.' },
    { nl: 'Dan perst de nadruk kunststof na tegen de krimp; het product koelt en wordt uitgeworpen. In elk van die stappen kan een fout ontstaan.',
      en: 'Then holding pressure packs in more plastic against the shrinkage; the part cools and is ejected. A defect can form in each of those steps.' },
  ],
  [ // s2 short shot, vents, burn marks
    { nl: 'Een {t:Short shot|short shot} is niet vol: het vloeifront haalt het eind niet. Oorzaken: te weinig kunststof, druk of snelheid, te koud, of opgesloten lucht.',
      en: 'A {t:Short shot|short shot} is not full: the flow front does not reach the end. Causes: too little plastic, pressure or speed, too cold, or trapped air.' },
    { nl: 'Ontluchting slibt dicht: een matrijs die vorige maand vol liep, geeft nu short shots. Check eerst de ontluchting, dan pas de druk.',
      en: 'Vents clog: a mould that filled last month short-shots now. Check the vents first, the pressure later.' },
    { nl: 'Kan de lucht niet weg, dan wordt hij samengeperst en heet: het dieseleffect. De kunststof verschroeit tot brandplekken aan het eind.',
      en: 'If the air cannot get out, it is compressed and heats up: the diesel effect. The plastic scorches into burn marks, right at the end.' },
  ],
  [ // s3 flash
    { nl: '{t:Braam|Braam} is het omgekeerde: een dun vliesje kunststof op de deellijn. Oorzaken: te veel druk, te weinig sluitkracht, te hete kunststof of slijtage.',
      en: '{t:Flash|Flash} is the opposite: a thin fin of plastic at the parting line. Causes: too much pressure, too little clamp force, plastic too hot, or wear.' },
    { nl: 'Een krat geeft na tachtigduizend shots braam op één hoek. De insteller zet de sluitkracht van {n:180} naar {n:220} ton: weg.',
      en: 'A crate starts flashing at one corner after eighty thousand shots. The setter raises the clamp force from {n:180} to {n:220} tonnes: gone.' },
    { nl: 'Twee weken later is hij terug, erger: de deellijn is versleten. Matrijs eruit, deellijn repareren, en weer op {n:180} ton.',
      en: 'Two weeks later it is back, worse: the parting line is worn. Mould out, repair the parting line, and back to {n:180} tonnes.' },
  ],
  [ // s4 sink, voids, weld line, splay
    { nl: 'Een {t:Inzakplek|inzakplek} is een deukje boven een dik deel, zoals een rib. De huid stolt eerst; de hete kern krimpt door en trekt hem naar binnen.',
      en: 'A {t:Sink mark|sink mark} is a dent above a thick section, such as a rib. The skin sets first; the hot core keeps shrinking and pulls it inwards.' },
    { nl: 'Oorzaak: te weinig nadruk, of een aanspuitpunt dat te vroeg bevriest. Binnenin geeft dat vacuümbellen; die zie je pas op een röntgenfoto of na doorzagen.',
      en: 'The cause: too little holding pressure, or a gate that freezes too early. Inside, that gives voids, seen only on an X-ray or in a sawn-through part.' },
    { nl: 'Achter het gat komen twee vloeifronten weer samen in een {t:Bindnaad|bindnaad}: een dun lijntje, zwakker en soms zichtbaar.',
      en: 'Behind the hole two flow fronts meet again in a {t:Weld line|weld line}: a thin line, weaker and sometimes visible.' },
    { nl: 'Zilverstrepen vanaf het aanspuitpunt zijn meestal vocht uit nat materiaal: dan zit de oorzaak in de droger.',
      en: 'Silver streaks from the gate are usually moisture from wet material: then the cause is in the dryer.' },
  ],
  [ // s5 warpage
    { nl: 'Bij {t:Kromtrekken|kromtrekken} buigt het product na het uitwerpen, omdat het ongelijk krimpt: door ongelijke wanden, een warmere matrijshelft, gerichte vezels of te warm uitwerpen.',
      en: 'In {t:Warpage|warpage} the part bends after ejection, because it shrinks unevenly: through uneven walls, a hotter mould half, aligned fibres, or ejecting too hot.' },
    { nl: 'Vaak pas uren later: goed bij de machine, afgekeurd bij de klant. Meet daarom na een vaste wachttijd, bijvoorbeeld {n:24} uur.',
      en: 'Often only hours later: good at the machine, rejected at the customer. So measure after a fixed wait, for example {n:24} hours.' },
    { nl: 'Vraag eerst, voordat je aan de instellingen komt: welke holte, waar op het product, en sinds wanneer?',
      en: 'Before you touch the settings, ask first: which cavity, where on the part, and since when?' },
  ],
  [ // s6 look first
    { nl: 'Eerst kijken, dan draaien. Eén holte wijst naar de matrijs, alle holtes naar het proces of het materiaal, af en toe naar iets instabiels.',
      en: 'Look before you touch. One cavity points at the mould, all cavities at the process or the material, now and then at something unstable.' },
    { nl: 'Eén op de {n:20} shots is short, steeds in holte {n:2}: {n:5} procent van de shots, gedeeld door {n:4} holtes {n:1.25} procent van de producten.',
      en: 'One shot in {n:20} is short, always in cavity {n:2}: {n:5} percent of shots, divided by {n:4} cavities {n:1.25} percent of parts.' },
    { nl: 'Bij een {t:Vulstudie|vulstudie} maak je short shots met opzet, tot {n:50}, {n:70}, {n:90} en {n:95} procent vol. Zo zie je waar het vloeifront aarzelt.',
      en: 'In a {t:Fill study|fill study} you make short shots on purpose, to {n:50}, {n:70}, {n:90} and {n:95} percent full. They show where the flow front hesitates.' },
    { nl: 'Bij {t:Jetting|jetting} spuit de kunststof uit een klein aanspuitpunt de lege holte in en vouwt over zichzelf. Begin langzamer, of richt het aanspuitpunt op een wand.',
      en: 'In {t:Jetting|jetting} the plastic squirts from a small gate into the empty cavity and folds over itself. Start slower, or aim the gate at a wall.' },
  ],
  [ // s7 one thing at a time
    { nl: 'Verander één ding tegelijk en wacht: na druk of snelheid zo’n tien shots, na een temperatuur vaak {n:20} tot {n:30} minuten. Hielp het niet, draai het terug.',
      en: 'Change one thing at a time and wait: about ten shots after pressure or speed, often {n:20} to {n:30} minutes after a temperature. If it did not help, undo it.' },
    { nl: 'Een {t:Grensmonster|grensmonster} is een product precies op de grens, getekend door kwaliteit en bewaard bij de machine. Zo oordeelt elke dienst hetzelfde.',
      en: 'A {t:Boundary sample|boundary sample} is a part right on the limit, signed by quality and kept at the machine. So every shift judges the same way.' },
  ],
  [ // s8 shrinkage and size
    { nl: 'Kromtrekken is altijd {t:Ongelijke krimp|ongelijke krimp}. Dikke delen en de warmere kant krimpen meer; zo’n {n:10} graden verschil tussen de helften kan genoeg zijn. Glasvezels remmen de krimp langs de stroming.',
      en: 'Warpage is always {t:Differential shrinkage|differential shrinkage}. Thick regions and the hotter side shrink more; about {n:10} degrees between the halves can be enough. Glass fibres hold back shrinkage along the flow.' },
    { nl: 'De {t:Verwerkingskrimp|verwerkingskrimp}: zo’n {n:0.3} procent langs, {n:0.7} procent dwars. Staal op {n:0.5} procent, {n:201.0} millimeter, geeft {n:200.4}: te lang. Vraag de krimp per richting.',
      en: 'The {t:Mould shrinkage|mould shrinkage}: about {n:0.3} percent along, {n:0.7} percent across. Steel at {n:0.5} percent, {n:201.0} millimetres, gives {n:200.4}: too long. Ask for shrinkage per direction.' },
    { nl: 'Bij een bak zie je het {t:Hoekeffect|hoekeffect}: de binnenhoek van de kern blijft warm, krimpt meer en trekt de wanden naar binnen.',
      en: 'A box shows the {t:Corner effect|corner effect}: the inside corner of the core stays hot, shrinks more and pulls the walls inwards.' },
    { nl: 'Meet pas na {t:Conditioneren|conditioneren}: een vaste tijd in een vast klimaat, bijvoorbeeld {n:23} graden en {n:50} procent vocht; polyamide neemt water op. Corrigeer dan één keer het staal.',
      en: 'Measure only after {t:Conditioning|conditioning}: a fixed time in a fixed climate, for example {n:23} degrees and {n:50} percent humidity; polyamide takes up water. Then correct the steel once.' },
  ],
  [ // s9 solving for good
    { nl: 'Blijvend oplossen vraagt drie dingen: een bewezen oorzaak, een bekend procesvenster en bewaking. Tellen met een paretodiagram en oorzaken zoeken leer je in de modules kwaliteit en probleemoplossen.',
      en: 'Solving a defect for good takes three things: a proven cause, a known process window and monitoring. Counting with a Pareto chart and finding causes are taught in the quality and problem-solving modules.' },
    { nl: 'Een {t:DOE|DOE}, een proefopzet, verandert instellingen tegelijk volgens een vast patroon. Nadruk en nadruktijd, laag en hoog: inzakplekken van {n:40}, {n:30}, {n:24} en {n:10} micrometer.',
      en: 'A {t:DOE|DOE}, a design of experiments, changes settings together in a planned pattern. Holding pressure and time, low and high: sinks of {n:40}, {n:30}, {n:24} and {n:10} micrometres.' },
    { nl: 'Het {t:Hoofdeffect|hoofdeffect}: hoge druk maakt de inzakplek gemiddeld {n:12} micrometer ondieper, lange tijd {n:18}. Druk helpt meer bij lange tijd, {n:14} tegen {n:10}: een kleine {t:Interactie|interactie}.',
      en: 'The {t:Main effect|main effect}: high pressure makes the sink {n:12} micrometres shallower on average, long time {n:18}. Pressure helps more at the long time, {n:14} against {n:10}: a small {t:Interaction|interaction}.' },
    { nl: 'Een {t:Holtedruksensor|holtedruksensor} meet elk shot de druk in de holte. Aan het eind van de vulling ziet hij een short shot direct.',
      en: 'A {t:Cavity pressure sensor|cavity pressure sensor} measures the pressure in the cavity every shot. Near the end of fill it sees a short shot at once.' },
    { nl: 'Bij {t:Procesbewaking|procesbewaking} gaat een shot buiten de grenzen naar de afkeur. Zet de grenzen op een goede run: te krap geeft vals alarm, te ruim laat afkeur door.',
      en: 'With {t:Process monitoring|process monitoring} a shot outside the limits goes to the reject bin. Set the limits on a good run: too tight gives false alarms, too wide lets bad parts through.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Scene lengths from the captions (reading pace with some air), then reduced
// motion: each beat's still sits late in that beat, where the stage has drawn
// what the beat names.
const C = {
  W, H, CAV, RUN, GATE, PIN, RIBS, VENTS, SENSOR, MPLATE, MP_TOP, GAUGE, KEYS,
  CRATE, WAIT_H, DIAG, SHOTS_PCT, PARTS_PCT, STUDY, WAIT_T, SH, STEEL, PART, PER, COND, HALVES_DT, DOE, ME,
};
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 2.5 * s.beats.length);
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
.iso{--fp-burn:#010605}
.iso[data-theme="light"]{--fp-burn:#3A2A1E}
.fp-svg .fp-label{font-family:var(--fp-sans);font-weight:600}
.fp-svg .fp-small{font-family:var(--fp-sans);font-weight:500}
.fp-svg .fp-big{font-family:var(--fp-sans);font-weight:700}
.fp-svg .fp-tx{fill:var(--anatomy-text)}
.fp-cutline{fill:none;stroke:var(--anatomy-mid);stroke-width:.8;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-bore{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.fp-deep{fill:var(--anatomy-halo);fill-opacity:.55;stroke:none}
.fp-wall{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-wall2{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.5;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-steel{fill:var(--anatomy-face);stroke:none}
.fp-sens{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.8;vector-effect:non-scaling-stroke}
.fp-vent{fill:var(--anatomy-shade-1);stroke:none}
.fp-clog{fill:var(--anatomy-lo);stroke:none}
.fp-label-plate{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:.7;vector-effect:non-scaling-stroke}
.fp-melt{fill:color-mix(in srgb,var(--anatomy-hi) 42%,var(--anatomy-card));stroke:var(--anatomy-mid);stroke-width:.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-solid{fill:color-mix(in srgb,var(--anatomy-hi) 70%,var(--anatomy-card));stroke:none}
.fp-film{fill:color-mix(in srgb,var(--anatomy-hi) 42%,var(--anatomy-card));fill-opacity:.8;stroke:var(--anatomy-hi);stroke-width:.7;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-burn{fill:var(--fp-burn);stroke:none}
.fp-wear{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.8;stroke-dasharray:3 2;vector-effect:non-scaling-stroke}
.fp-splay{fill:none;stroke:var(--anatomy-paper);stroke-width:1.6;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-jet{fill:none;stroke:color-mix(in srgb,var(--anatomy-hi) 42%,var(--anatomy-card));stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round}
.fp-jet-edge{fill:none;stroke:var(--anatomy-hi);stroke-width:6.2;stroke-linecap:round;stroke-linejoin:round}
.fp-airdot{fill:var(--anatomy-mid)}
.fp-pt{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:.7;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-ps{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:.7;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-fibre{fill:none;stroke:var(--anatomy-mid);stroke-width:.8;stroke-linecap:round;vector-effect:non-scaling-stroke}
.fp-hud-bg{fill:var(--anatomy-shade-0);stroke:none;opacity:.97}
.fp-frame{fill:none;stroke:var(--anatomy-mid);stroke-width:1;vector-effect:non-scaling-stroke}
.fp-shape{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-shape2{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.2;vector-effect:non-scaling-stroke}
.fp-hot{fill:color-mix(in srgb,var(--anatomy-hi) 42%,var(--anatomy-card));stroke:none}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter2{fill:var(--anatomy-lo)}
.fp-band2{fill:var(--anatomy-mid);opacity:.22}
.fp-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-dasharray:5 4;vector-effect:non-scaling-stroke}
.fp-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-curve{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.fp-curve2{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2;stroke-linejoin:round;opacity:.7;vector-effect:non-scaling-stroke}
.fp-zone{fill:none;stroke:none}
[data-cue][data-on] .fp-vent{fill:var(--fp-accent);fill-opacity:.55}
[data-cue][data-on] .fp-melt,[data-cue][data-on] .fp-film,[data-cue][data-on] .fp-hot{fill:color-mix(in srgb,var(--fp-accent) 50%,var(--anatomy-card))}
[data-cue][data-on] .fp-film,[data-cue][data-on] .fp-sens{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-jet{stroke:color-mix(in srgb,var(--fp-accent) 55%,var(--anatomy-card))}
[data-cue][data-on] .fp-jet-edge,[data-cue][data-on] .fp-splay{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-airdot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-wear{stroke:var(--fp-accent);fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-pt{fill:var(--anatomy-lit-top);stroke:var(--fp-accent)}
[data-cue][data-on] .fp-ps{fill:var(--anatomy-lit-shade);stroke:var(--fp-accent)}
[data-cue][data-on] .fp-fibre{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
[data-cue][data-on] .fp-shape,[data-cue][data-on] .fp-shape2,[data-cue][data-on] .fp-frame{stroke:var(--fp-accent);stroke-width:1.8}
[data-cue][data-on] .fp-shape{fill:var(--anatomy-lit-shade)}
[data-cue][data-on] .fp-dash,[data-cue][data-on] .fp-arrow,[data-cue][data-on] .fp-curve{stroke:var(--fp-accent)}
[data-cue][data-on] .fp-band2{fill:var(--fp-accent);opacity:.3}
[data-cue][data-on] .fp-zone{fill:var(--fp-accent);fill-opacity:.28;stroke:var(--fp-accent);stroke-width:1.2;vector-effect:non-scaling-stroke}
`;

const label2 = {
  nl: 'Een open matrijshelft op de werkbank, met de deellijn naar boven: het verdeelkanaal, het aanspuitpunt en de holte van een plat deksel met een kernpen voor een gat, twee ribben, uitwerppennen, ontluchting en een holtedruksensor. De smelt vult de holte met een zichtbaar vloeifront; short shot, brandplekken, braam, inzakplek, bindnaad, zilverstrepen en jetting ontstaan erin. Ernaast een meetplaat waarop een deksel kromtrekt. Kaarten tonen een doorsnede van een rib, de vier vragen, een vulstudie, de krimp, het hoekeffect, conditioneren, de drie delen van blijvend oplossen, een DOE en de holtedrukcurve.',
  en: 'An open mould half on the bench, parting face up: the runner, the gate and the cavity of a flat cover with a core pin for a hole, two ribs, ejector pins, vents and a cavity pressure sensor. The melt fills the cavity with a visible flow front; short shot, burn marks, flash, sink, weld line, silver streaks and jetting form in it. Beside it a measuring plate where a cover warps. Cards show a section through a rib, the four questions, a fill study, shrinkage, the corner effect, conditioning, the three parts of solving for good, a DOE and the cavity pressure curve.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label: label2 });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
