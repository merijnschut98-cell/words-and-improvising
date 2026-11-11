// Dev tool, not shipped. Builds the explainer film "Wat kan deze schakelaar? /
// What can this switch do?" for the grid module Schakelinstallaties en
// beveiliging: the level 1 lessons of its topics Schakelapparaten
// (eng.switchgear.devices) and MS-installaties en stations
// (eng.switchgear.installations).
//
//   node films/eng.switchgear.devices/build.mjs            build the page
//   node films/eng.switchgear.devices/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.switchgear.devices.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.6
// (eng.switchgear.devices). The plan row lists the lessons "devices" and
// "installations"; both ids still exist after the topics x levels rebuild, as
// level 1 of their topics, so no mapping was needed. The higher levels
// (ratings, interruption, faultlevel; automation, substation, sf6) are not
// served: SF6 and its phase-out are named only as far as the installations
// lesson names them.
//
// The drawing is a secondary substation: an RMU (a steel tank on a base frame
// with three panels; each panel has a fascia with its part of the mimic diagram,
// the operating sockets for the switch and the earthing switch, and a lower
// cover; the transformer panel's cover is the fuse compartment), a pressure
// gauge and a padlock, a cable from the RMU to a 400 kVA transformer with
// cooling fins and LV bushings, all on the station floor. The mimic's switch
// and earthing blades move with the story. Cards in stage space: a vacuum
// interrupter with its arc and the current through a current zero (a schema),
// the fault level against breaker ratings with the worked example, an MV fuse
// with sand, element and striker, the three-position switch with its
// interlock, air- against gas-insulated switchgear, the SF6 sums and dates, and
// the table "what can this switch do"; example cards are labelled "voorbeeld"
// (or "schema").
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
const A = await import(pathToFileURL(join(SKILL, 'kit/audit.mjs')).href);
const T = await import(pathToFileURL(join(SKILL, 'kit/tube.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the lessons' text and worked examples (the build fails if a
// value drifts); {n:...} numbers are then checked against the Dutch lesson text
// by defineFilm. Facts checked against:
// - Circuit breaker, load-break switch, disconnector, earthing switch and
//   fuse-switch combination: IEC 62271-100 (breakers), -103 (switches), -102
//   (disconnectors and earthing switches), -105 (switch-fuse combinations: the
//   striker of a blown fuse trips the switch so all three phases open, said as
//   "meestal"); ABB and Siemens MV distribution guides. A load-break switch can
//   make onto a fault (a short-circuit making rating) but not break it.
// - Arc quenching: an AC arc goes out at a current zero; in a vacuum
//   interrupter it burns only in metal vapour from the contacts, which condenses
//   within microseconds after the zero, so the gap recovers fast (said "heel
//   snel"). SF6 is electronegative: it captures free electrons, so a puffer
//   breaker blows it through the arc; only named as "dooft bogen extreem goed".
// - MV fuses (current-limiting, IEC 60282-1): silver elements in quartz sand,
//   the sand quenches the arc; a striker pin on the end cap.
// - SF6: GWP100 about 23,500 (IPCC AR5; AR6 gives about 24,300, as the
//   lesson's pre-question says). EU F-gas Regulation (EU) 2024/573, Annex IV:
//   new MV switchgear up to 24 kV without F-gases from 1 January 2026, above
//   24 up to 52 kV from 1 January 2030, with narrow exceptions (for example
//   when no F-gas-free offer is available in a tender), said "in principe" and
//   "met beperkte uitzonderingen".
// - Arc flash: heat, light and pressure; internal arc classification
//   (IEC 62271-200, IAC) vents the blast away from the operator.
const DEV = 'eng.switchgear.devices';
const INS = 'eng.switchgear.installations';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
{
  const d = lessons.nl.get(DEV);
  const t = d.teach.join('\n');
  assert(t.includes('16 tot 25 kA'), 'breakers 16 to 25 kA');
  assert(t.includes('ruwweg 15 tot 20 kA') && t.includes('10 kV-net'), 'fault level 15 to 20 kA in a 10 kV grid');
  assert(t.includes('zwaarder zijn dan het kortsluitvermogen op zijn plek'), 'breaker above the fault level');
  assert(t.includes('inschakelen op een fout') && t.includes('geen kortsluiting onderbreken'), 'load-break switch');
  assert(t.includes('door te smelten, één keer'), 'fuse once');
  assert(t.includes('alleen stroomloos bediend'), 'disconnector dead only');
  assert(t.includes('niet door een mens') && t.includes('vergrendelingen (interlocks)'), 'earthing switch, interlocks');
  assert(t.includes('vacuümbuis') && t.includes('vlamboog'), 'vacuum, arc flash');
  const x = d.example.text;
  assert(x.includes('vermogensschakelaar van 20 kA') && x.includes('ziet 8 kA') && x.includes('zo’n 0,3 s') && x.includes('400 kVA'), 'the worked example');
  const n = lessons.nl.get(INS);
  const u = n.teach.join('\n');
  assert(u.includes('twee kabelvelden voor de ring en één transformatorveld'), 'RMU: two ring panels and a transformer panel');
  assert(u.includes('23.500 keer CO2 per kilo'), 'SF6 23.500');
  assert(u.includes('tot 24 kV vanaf 2026') && u.includes('tot 52 kV vanaf 2030'), 'F-gas dates');
  assert(u.includes('vacuümschakelbuis') && u.includes('droge lucht'), 'the alternatives');
  assert(u.includes('drukmeter') && u.includes('interne boog'), 'gauge and internal arc');
  assert(u.includes('30 tot 50 jaar'), '30 to 50 years');
  assert(n.example.text.includes('20.000 RMU’s') && n.example.text.includes('1,5 kg') && n.example.text.includes('0,1%') && n.example.text.includes('ruwweg 700 ton'), 'the SF6 example');
}
// the worked example: a 20 kA breaker, an 8 kA fault, about 0,3 s
const CB_KA = 20;
const FAULT_KA = 8;
const T_OPEN = 0.3;
const FL = [15, 20];
const CB_RANGE = [16, 25];
assert(FAULT_KA < CB_KA && CB_KA >= FL[1], 'the breaker is rated above the fault level and the fault');
// the fault level as current: a few hundred MVA at 10 kV is about 15 to 20 kA (I = S / (√3 U))
assert(near(260e6 / (Math.sqrt(3) * 10e3) / 1000, FL[0], 0.1) && near(350e6 / (Math.sqrt(3) * 10e3) / 1000, FL[1], 0.3), 'a few hundred MVA ≈ 15 to 20 kA');
// the SF6 sums: 20.000 × 1,5 kg = 30 t; 0,1 % = 30 kg; × 23.500 ≈ 705 t ≈ 700 t
const RMUS = 20000;
const KG = 1.5;
const GWP = 23500;
const STOCK_T = (RMUS * KG) / 1000;
const LEAK_KG = RMUS * KG * 0.001;
const CO2_T = (LEAK_KG * GWP) / 1000;
assert(STOCK_T === 30 && near(LEAK_KG, 30, 1e-9) && near(CO2_T, 705, 1e-6), 'SF6 sums');
assert(near(CO2_T, 700, 10), 'about 700 t');

// ---------------------------------------------------------------- the world: a secondary substation
// World units are centimetres, z up, x along the front (RMU at −x, transformer at
// +x), +y toward the viewer. The top of the station floor is z = 0.
const W = 640;
const H = 400;
const FLOOR = -6;
const SLAB = { x: -74, y: -46, w: 226, d: 96, r: 2 };
const BASE = { x: -58, y: -33, w: 110, d: 64, r: 0.8 };
const BASE_TOP = 9;
const TANK = { x: -56, y: -31, w: 106, d: 60, r: 1 };
const TANK_TOP = 118;
const FY = TANK.y + TANK.d; // the RMU's front face
const PW = TANK.w / 3;
const PX = [0, 1, 2].map((i) => TANK.x + i * PW);
const PC = PX.map((x) => x + PW / 2);
const FASCIA = [56, 112];
const COVER = [14, 50];
const FF = FY + 0.6; // the fascia's face
const TR = { x: 74, y: -24, w: 58, d: 40, r: 1 };
const TR_Z = [5, 84];
const TRY = TR.y + TR.d;
const MIMIC = { bus: 104, top: 97, piv: 87, tee: 80, ep: 73, low: 62 };

const FIT = [
  ...k.boxCorners(SLAB, FLOOR, 0),
  ...k.boxCorners({ x: TANK.x, y: TANK.y, w: TANK.w, d: TANK.d }, 0, TANK_TOP + 4),
  ...k.boxCorners({ x: TR.x, y: TR.y, w: TR.w + 8, d: TR.d }, 0, 98),
];
const P = k.fitProjection(FIT, W, H, { pad: 16, azimuth: 66, elevation: 24 });
const at = (point) => k.iso(point, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (points, style) => k.dotsSvg(points, style);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Zv = [0, 0, 1];
const frameX = (o) => G.frameOf(o, X, Y, Zv);
const frameY = (o) => G.frameOf(o, Y, X, Zv);
const frameZ = (o) => G.frameOf(o, Zv, Y, X);
const planeOf = (y) => k.sideMatrix([0, y], 0, P, 'left');
const flatRect = (x0, z0, x1, z1, r, steps = 6) => k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z]), true);
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const seg2 = (pts) => 'M' + pts.map(([x, z]) => `${f1(x)} ${f1(-z)}`).join('L');

// ---------------------------------------------------------------- recorder
// Each part carries the cues of its assembly (outermost first), so a term can
// light the RMU, one panel, the ring panels' fascias, the fuse compartment, the
// gauge, the padlock, the earthing socket, the transformer or the cable.
const cuesOf = (name) => {
  if (/^rmu\.fascia0/.test(name)) return ['rmu', 'panel', 'ring'];
  if (/^rmu\.fascia1/.test(name)) return ['rmu', 'ring'];
  if (/^rmu\.cover0/.test(name)) return ['rmu', 'panel'];
  if (/^rmu\.cover2/.test(name)) return ['rmu', 'fuse'];
  if (/^rmu\.gauge/.test(name)) return ['rmu', 'gauge'];
  if (/^rmu\.lock/.test(name)) return ['rmu', 'lock'];
  if (/^rmu\.esock0/.test(name)) return ['rmu', 'earth'];
  if (/^rmu\./.test(name)) return ['rmu'];
  if (/^trafo\./.test(name)) return ['trafo'];
  if (/^cable/.test(name)) return ['cable'];
  return [];
};
const R = A.recorder(P, {});
function put(name, ref, svg, shapes, { bias = 0, attrs = '' } = {}) {
  const c = cuesOf(name);
  const body = c.slice(1).reduceRight((s, cue) => `<g data-cue="${cue}">${s}</g>`, svg);
  return R.put({ name, at: ref, bias, svg: body, shapes, attrs: (c.length ? ` data-cue="${c[0]}"` : '') + attrs });
}
const S = (paths, style) => k.solidSvg(paths, style);
function box(name, plan, z0, z1, style = {}, { steps = 2, bevel = 0, extra = '', inner = '', owner, ground, ...opts } = {}) {
  const shape = R.solid(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  const svg = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, (z0 + z1) / 2], svg, [shape], opts);
}
function post(name, cx, cy, r, z0, z1, style = {}, { steps = 24, bevel = 0, extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z0, z1 - z0, { name, owner }));
  const svg = S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  return put(name, [cx, cy, (z0 + z1) / 2], svg, [shape], opts);
}
function turned(name, F, profile, style = {}, { extra = '', inner = '', owner, ...opts } = {}) {
  const shape = R.solid(A.solid(F, profile, { name, owner }));
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const svg = S(G.solidOf(profile, F, P), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, mid)), svg, [shape], opts);
}
function discAt(name, F, s0, s1, r, style = {}, { extra = '', inner = '', owner, steps, ...opts } = {}) {
  const shape = R.solid(A.disc(F, s0, s1, r, { name, owner }));
  const svg = S(G.disc(s0, s1, r, F, P, steps ? { steps } : {}), { tone: 'mid', ...style, inner }) + extra;
  return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg, [shape], opts);
}

// ---------------------------------------------------------------- the station floor
const halo = [
  `<path class="iso-halo" d="${k.haloOf(k.insetPlan(SLAB, -2), FLOOR, 2, P)}"/>`,
];
{
  const anchors = k.corners(SLAB, 5);
  const extra = L(k.planOutline(k.insetPlan(SLAB, 3), 0, P, 3), { tone: 'faint' })
    + L(anchors.map(([x, y]) => k.ring(x, y, 1.4, 0, P, 14)).join(''), { tone: 'lo' })
    + Dt(anchors.map(([x, y]) => at([x, y, 0])), { size: 0.45 })
    // the cable trench cover in front of the RMU: a plate with its seam and lifting holes
    + L(k.planOutline({ x: -54, y: 34, w: 102, d: 9, r: 0.6 }, 0, P, 2), { tone: 'lo' })
    + L([-30, -6, 18].map((x) => k.segment([x, 34, 0], [x, 43, 0], P)).join(''), { tone: 'faint' })
    + Dt([-42, -18, 6, 30].map((x) => at([x, 38.5, 0])), { size: 0.4 });
  box('floor.slab', SLAB, FLOOR, 0, { tone: 'lo' }, { steps: 3, bevel: 0.6, ground: true, inner: L(k.sideSeam(SLAB, -2.5, P, 3), { tone: 'faint' }), extra });
}

// ---------------------------------------------------------------- the RMU
{
  const bolts = [-52, -4, 46].flatMap((x) => [[x, BASE.y + 2.6], [x, BASE.y + BASE.d - 2.6]]);
  box('rmu.base', BASE, 0, BASE_TOP, { tone: 'lo' }, {
    steps: 2, bevel: 0.4,
    inner: L(k.sideSeam(BASE, 1.6, P, 2), { tone: 'faint' }),
    extra: L(bolts.map(([x, y]) => k.ring(x, y, 1.1, BASE_TOP, P, 12)).join(''), { tone: 'lo' }) + Dt(bolts.map(([x, y]) => at([x, y, BASE_TOP])), { size: 0.45 }),
  });
}
{
  // the tank: panel seams down its front, a weld seam round its top, lifting eyes on the lid
  const seams = PX.slice(1).map((x) => k.segment([x, FY, BASE_TOP + 1], [x, FY, TANK_TOP - 1], P)).join('');
  box('rmu.tank', TANK, BASE_TOP, TANK_TOP, { tone: 'mid' }, { steps: 2, bevel: 0.5, inner: L(seams, { tone: 'lo' }) + L(k.sideSeam(TANK, TANK_TOP - 3, P, 2), { tone: 'faint' }) });
  const lid = { x: TANK.x - 1, y: TANK.y - 1, w: TANK.w + 2, d: TANK.d + 2, r: 1 };
  box('rmu.lid', lid, TANK_TOP, TANK_TOP + 3, { tone: 'mid' }, { steps: 2, bevel: 0.4, extra: L(k.planOutline(k.insetPlan(lid, 3), TANK_TOP + 3, P, 2), { tone: 'faint' }) + Dt(k.corners(lid, 2).map(([x, y]) => at([x, y, TANK_TOP + 3])), { size: 0.45 }) });
  for (const x of [TANK.x + 10, TANK.x + TANK.w - 10]) {
    box('rmu.eye', { x: x - 2, y: -2, w: 4, d: 4, r: 0.4 }, TANK_TOP + 3, TANK_TOP + 6, { tone: 'mid' }, { steps: 2, bevel: 0.2, extra: L(k.ring(x, 0, 1, TANK_TOP + 6, P, 12), { tone: 'lo' }) });
  }
}
// per panel: the lower cover (cable compartment; the fuse compartment in the
// transformer panel), the fascia with its part of the mimic, and the sockets
const blades = [];
for (let i = 0; i < 3; i++) {
  const x0 = PX[i] + 2.2;
  const x1 = PX[i] + PW - 2.2;
  const cx = PC[i];
  {
    const plan = { x: x0, y: FY, w: x1 - x0, d: 1.2, r: 0.5 };
    const fy = FY + 1.2;
    const pts = [[x0 + 1.3, COVER[0] + 1.3], [x1 - 1.3, COVER[0] + 1.3], [x0 + 1.3, COVER[1] - 1.3], [x1 - 1.3, COVER[1] - 1.3]].map(([x, z]) => at([x, fy, z]));
    let face = '';
    if (i === 2) {
      // three inspection windows, one per fuse
      face += [-7, 0, 7].map((dx) => `<path class="mf-glass" d="${flatRect(cx + dx - 1.6, 30, cx + dx + 1.6, 42, 0.8, 3)}"/><path class="iso-line" data-tone="lo" d="${flatRect(cx + dx - 1.6, 30, cx + dx + 1.6, 42, 0.8, 3)}"/>`).join('');
    } else {
      // the cable-test sockets cover and its label
      face += `<path class="mf-card" d="${flatRect(cx - 7, 36, cx + 7, 42, 0.5, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M${f1(cx - 5.5)} ${-40.2}H${f1(cx + 4)}M${f1(cx - 5.5)} ${-38.2}H${f1(cx + 1)}"/>`;
    }
    // the warning triangle
    face += `<path class="mf-card" d="M${f1(cx)} ${-27}L${f1(cx + 3.4)} ${-21.2}L${f1(cx - 3.4)} ${-21.2}Z"/><path class="iso-line" data-tone="mid" d="M${f1(cx + 0.4)} ${-25.6}L${f1(cx - 0.6)} ${-23.8}L${f1(cx + 0.6)} ${-23.6}L${f1(cx - 0.4)} ${-22}"/>`;
    box(`rmu.cover${i}`, plan, COVER[0], COVER[1], { tone: 'hi' }, {
      steps: 2, bevel: 0.25,
      extra: `<g transform="${planeOf(fy)}">${face}</g>` + Dt(pts, { size: 0.42, tone: 'mid' }),
    });
  }
  {
    const plan = { x: x0, y: FY, w: x1 - x0, d: 0.6, r: 0.4 };
    const m = MIMIC;
    const ex = cx + 6.5;
    let mim = `M${f1(x0 + 0.8)} ${-m.bus}H${f1(x1 - 0.8)}M${f1(cx)} ${-m.bus}V${-m.top}M${f1(cx)} ${-m.piv}V${-m.ep + 0.5}`;
    mim += `M${f1(cx)} ${-m.tee}H${f1(ex)}M${f1(ex)} ${-(m.ep - 3)}V${-(m.ep - 4.5)}M${f1(ex - 2.4)} ${-(m.ep - 4.5)}H${f1(ex + 2.4)}M${f1(ex - 1.5)} ${-(m.ep - 5.5)}H${f1(ex + 1.5)}M${f1(ex - 0.6)} ${-(m.ep - 6.5)}H${f1(ex + 0.6)}`;
    if (i === 2) mim += `M${f1(cx)} ${-(m.ep - 0.5)}V${-(m.ep - 2)}M${f1(cx)} ${-(m.ep - 8)}V${-(m.low + 2)}`;
    else mim += `M${f1(cx)} ${-(m.ep - 0.5)}V${-(m.low + 1)}M${f1(cx - 2)} ${-(m.low + 3)}L${f1(cx)} ${-(m.low + 0.6)}L${f1(cx + 2)} ${-(m.low + 3)}`;
    let face = `<path class="iso-line" data-tone="mid" d="${mim}"/>`;
    face += [cx, ex].map((x, j) => `<circle class="mf-pivot" cx="${f1(x)}" cy="${f1(-(j ? m.ep - 3 : m.piv))}" r="0.7"/>`).join('');
    if (i === 2) face += `<path class="mf-card" d="${flatRect(cx - 1.4, m.ep - 8, cx + 1.4, m.ep - 2, 0.3, 2)}"/><path class="iso-line" data-tone="mid" d="${flatRect(cx - 1.4, m.ep - 8, cx + 1.4, m.ep - 2, 0.3, 2)}"/>`
      + `<circle class="iso-line" data-tone="mid" fill="none" cx="${f1(cx)}" cy="${-(m.low + 0.4)}" r="1.6"/><circle class="iso-line" data-tone="mid" fill="none" cx="${f1(cx)}" cy="${-(m.low - 1.8)}" r="1.6"/>`;
    face += `<path class="mf-blade" data-k="sw${i}" d=""/><path class="mf-blade" data-k="ea${i}" d=""/>`;
    // the panel's name plate at the top of the fascia
    face += `<path class="mf-card" d="${flatRect(x0 + 2, 107.4, x1 - 2, 110.6, 0.4, 3)}"/><path class="iso-line" data-tone="lo" data-free="" d="M${f1(x0 + 3.4)} -109H${f1(x1 - 9)}"/>`;
    blades.push({ cx, ex });
    box(`rmu.fascia${i}`, plan, FASCIA[0], FASCIA[1], { tone: 'mid' }, {
      steps: 2, bevel: 0.2,
      extra: `<g transform="${planeOf(FF)}">${face}</g>` + Dt([[x0 + 1, FF, FASCIA[0] + 1], [x1 - 1, FF, FASCIA[0] + 1], [x0 + 1, FF, FASCIA[1] - 1], [x1 - 1, FF, FASCIA[1] - 1]].map(at), { size: 0.38, tone: 'mid' }),
    });
  }
  // the operating sockets: the switch (left) and the earthing switch (right), each a collar with a dark hole
  for (const [kind, dx] of [['sock', -6], ['esock', 6]]) {
    const F = frameY([cx + dx, FF, 64.5]);
    discAt(`rmu.${kind}${i}`, F, 0, 1.4, 2.3, { tone: 'mid' }, { steps: 20, extra: `<path class="mf-well" d="${G.circleOf(F, 1.4, 1.1, P, 18)}"/>` + Dt([at([cx + dx, FF + 1.4, 64.5 + 1.7])], { size: 0.3, tone: 'hi' }) });
  }
}
// the padlock on panel 1's switch socket (the padlock: a body and its shackle)
{
  const cx = PC[0] - 6;
  box('rmu.lock', { x: cx - 1.6, y: FF, w: 3.2, d: 3, r: 0.4 }, 58.6, 61.6, { tone: 'hi' }, {
    steps: 2, bevel: 0.15,
    extra: L(k.segment([cx - 1, FF + 2.2, 61.6], [cx - 1, FF + 2.2, 62.6], P) + k.segment([cx + 1, FF + 2.2, 61.6], [cx + 1, FF + 2.2, 62.6], P) + k.segment([cx - 1, FF + 2.2, 62.6], [cx + 1, FF + 2.2, 62.6], P), { tone: 'mid' })
      + Dt([at([cx, FF + 3, 60])], { size: 0.32, tone: 'lo' }),
  });
}
// the pressure gauge on panel 2's fascia: a bezel, its dial with a green band and the needle
{
  const cx = PC[1];
  const F = frameY([cx, FF, 100]);
  const dial = [];
  for (let j = 0; j <= 8; j++) {
    const a = -2.2 + (4.4 * j) / 8;
    dial.push(`M${f1(cx + 2.5 * Math.sin(a))} ${f1(-(100 + 2.5 * Math.cos(a)))}L${f1(cx + 2.9 * Math.sin(a))} ${f1(-(100 + 2.9 * Math.cos(a)))}`);
  }
  const band = [];
  for (let a = 0.3; a <= 2.2; a += 0.19) band.push([cx + 2.75 * Math.sin(a), -(100 + 2.75 * Math.cos(a))]);
  discAt('rmu.gauge', F, 0, 1.2, 3.4, { tone: 'mid' }, {
    steps: 28,
    extra: `<g transform="${planeOf(FF + 1.25)}"><circle class="mf-dial" cx="${f1(cx)}" cy="-100" r="3.05"/><path class="iso-line" data-tone="lo" d="${dial.join('')}"/><path class="mf-band2" d="M${band.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}"/><path class="mf-needle" data-k="needle" d="M${f1(cx)} -100L${f1(cx + 2.3 * Math.sin(1.1))} ${f1(-(100 + 2.3 * Math.cos(1.1)))}"/><circle class="mf-pivot" cx="${f1(cx)}" cy="-100" r="0.5"/></g>`,
  });
}
// the RMU's rating plate on the lid's front edge area
{
  const x0 = PC[2] - 9;
  box('rmu.plate', { x: x0, y: FY, w: 18, d: 0.4, r: 0.2 }, 113, 116.4, { tone: 'hi' }, {
    steps: 2,
    extra: L([115.4, 114.2].map((z, j) => k.segment([x0 + 1.2, FY + 0.4, z], [x0 + 18 - [2, 6][j], FY + 0.4, z], P)).join(''), { tone: 'lo', free: true }),
  });
}
// the cable gland on the RMU's side
const GL = [TANK.x + TANK.w, -6, 30];
discAt('rmu.gland', frameX(GL), 0, 2.4, 2.4, { tone: 'mid' }, { steps: 6 });

// ---------------------------------------------------------------- the transformer
for (const y of [TR.y - 2, TR.y + TR.d - 3]) {
  box('trafo.skid', { x: TR.x - 2, y, w: TR.w + 4, d: 5, r: 0.4 }, 0, TR_Z[0], { tone: 'lo' }, { steps: 2, bevel: 0.3, extra: Dt([at([TR.x + 2, y + 2.5, TR_Z[0]]), at([TR.x + TR.w - 2, y + 2.5, TR_Z[0]])], { size: 0.45 }) });
}
box('trafo.tank', TR, TR_Z[0], TR_Z[1], { tone: 'mid' }, { steps: 2, bevel: 0.5, inner: L(k.sideSeam(TR, TR_Z[1] - 3, P, 2) + k.sideSeam(TR, TR_Z[0] + 4, P, 2), { tone: 'faint' }) });
{
  const lid = { x: TR.x - 1, y: TR.y - 1, w: TR.w + 2, d: TR.d + 2, r: 1 };
  const bolts = [];
  for (let j = 0; j < 7; j++) bolts.push([lid.x + 3 + (j * (lid.w - 6)) / 6, lid.y + lid.d - 1.4]);
  box('trafo.lid', lid, TR_Z[1], TR_Z[1] + 3, { tone: 'mid' }, { steps: 2, bevel: 0.4, extra: Dt(bolts.map(([x, y]) => at([x, y, TR_Z[1] + 3])), { size: 0.4 }) });
}
// cooling fins on the front and on the +x side
for (let j = 0; j < 9; j++) box('trafo.fin', { x: TR.x + 3 + j * 6.2, y: TRY, w: 1.4, d: 8, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
for (let j = 0; j < 6; j++) box('trafo.fin', { x: TR.x + TR.w, y: TR.y + 3 + j * 6.4, w: 8, d: 1.4, r: 0.2 }, TR_Z[0] + 7, TR_Z[1] - 8, { tone: 'hi' }, { steps: 1 });
// three LV bushings and the neutral on the lid
for (const [j, x] of [92, 102, 112, 122].entries()) {
  const y = 4;
  const z0 = TR_Z[1] + 3;
  // the porcelain body with two sheds, one turned solid
  turned('trafo.bush', frameZ([x, y, z0]), [[0, 1.7], [2.2, 1.7], [2.2, 2.5], [3, 2.5], [3, 1.7], [4.6, 1.7], [4.6, 2.5], [5.4, 2.5], [5.4, 1.7], [7, 1.7]], { tone: 'hi' });
  post('trafo.stud', x, y, 0.8, z0 + 7, z0 + 9.5, { tone: 'mid', crease: 'none' }, { steps: 12, extra: Dt([at([x, y, z0 + 9.5])], { size: 0.35, tone: 'hi' }) });
  if (j === 3) box('trafo.n', { x: x + 2.6, y: y - 1.2, w: 2.4, d: 2.4, r: 0.3 }, z0, z0 + 0.6, { tone: 'lo' }, { steps: 1 });
}
// the oil filling plug, the tap changer knob and the rating plate on the lid
post('trafo.plug', 82, -14, 2.2, TR_Z[1] + 3, TR_Z[1] + 5, { tone: 'mid' }, { steps: 6, extra: Dt([at([82, -14, TR_Z[1] + 5])], { size: 0.4, tone: 'hi' }) });
post('trafo.tap', 82, 6, 3, TR_Z[1] + 3, TR_Z[1] + 4.6, { tone: 'mid' }, { steps: 22, extra: L(k.segment([79.6, 6, TR_Z[1] + 4.6], [84.4, 6, TR_Z[1] + 4.6], P), { tone: 'lo' }) });
// the MV plug-in bushing on the transformer's −x side, where the cable lands
const TB = [TR.x, -6, 56];
discAt('trafo.mvplug', frameX(TB), -3, 0, 2.6, { tone: 'mid' }, { steps: 20 });

// ---------------------------------------------------------------- the MV cable from the RMU to the transformer
{
  const r = 1.3;
  const start = [GL[0] + 2.4, GL[1], GL[2]];
  const end = [TB[0] - 3, TB[1], TB[2]];
  const mid = 64;
  const route = G.fillet([start, [mid, GL[1], GL[2]], [mid, GL[1], TB[2]], end], 5, 9, { P, tube: r });
  R.route('cable', route, r, {});
  T.tubePieces(route, r, P, { maxLength: 30, spacing: 1 }).forEach((piece, i) => {
    put(`cable:${i}`, piece.mid, T.tubeSvg(piece, { tone: 'lo' }), [A.tube(piece.points, piece.radii, { name: 'cable' })], { bias: 0.05 });
  });
}

// ---------------------------------------------------------------- settle and assemble
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const RMU_AT = at([PC[1], FY, 70]);
const TR_AT = at([TR.x + TR.w / 2, TRY, 50]);
const world = [
  ...halo,
  ...R.items.map((item) => `<g data-n="${item.name}"${item.attrs ?? ''}>${item.svg}</g>`),
  // markers for the RMU and the transformer: at the card scenes' camera the station is about 80 px wide at
  // 390 px, so a lit part alone is small; stage.js keeps the rings a fixed size on screen
  `<g data-cue="rmu"><circle class="mf-mark" data-k="mk-rmu" cx="${RMU_AT[0].toFixed(1)}" cy="${RMU_AT[1].toFixed(1)}" r="0"/></g>`,
  `<g data-cue="trafo"><circle class="mf-mark" data-k="mk-trafo" cx="${TR_AT[0].toFixed(1)}" cy="${TR_AT[1].toFixed(1)}" r="0"/></g>`,
].join('');

// ---------------------------------------------------------------- cards (stage space, over the camera)
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hud = [
  g('vb', g('vbBase', '') + cue('cb', g('vbBody', '') + g('vbCb', '')) + cue('vib', g('vbIn', '')) + cue('relay', g('vbRelay', '')) + g('vbTxt', '')),
  g('fl', g('flBase', '') + cue('fl', g('flIn', '')) + g('flTxt', '')),
  g('fz', g('fzBase', '') + cue('fuse', g('fzIn', '')) + g('fzTxt', '')),
  g('ds', g('dsBase', '') + cue('iso', g('dsIso', '')) + cue('earth', g('dsEarth', '')) + cue('lock', g('dsLock', '')) + g('dsTxt', '')),
  g('ag', g('agBase', '') + g('agRow', '') + cue('ais', g('agAis', '')) + cue('gis', g('agGis', '')) + cue('sf6', g('agSf6', '')) + cue('gauge', g('agGauge', ''))),
  g('sf', g('sfBase', '') + cue('sf6', g('sfIn', '')) + cue('vib', g('sfAlt', ''))),
  g('tb', g('tbBase', '') + g('tbIn', '')),
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
const MIDW = [38, 0, 50];
const SIDE = (w0, w1) => ({ from: cam(MIDW, w0, 104), to: cam(MIDW, w1, 104) });
const CAM = [
  { from: cam(MIDW, 680), to: cam([PC[1], FY, 62], 620), a: 0.45, b: 0.95 },
  { from: cam([PC[1], FY, 62], 620), to: cam(MIDW, 2000, 104), a: 0.0, b: 0.16 },
  SIDE(2000, 1900),
  { from: cam([PC[1], FY, 60], 900, 120), to: cam([PC[1], FY, 60], 820, 120) },
  { from: cam([PC[0], FY, 84], 380, 104), to: cam([PC[0], FY, 84], 330, 104) },
  SIDE(1950, 1880),
  SIDE(1900, 1850),
  SIDE(1950, 1850),
];

// ---------------------------------------------------------------- the film
const DUR = [35, 38, 32, 42, 43, 34, 38, 28];
const C = { MIMIC, blades, FF, CB_KA, FAULT_KA, T_OPEN, FL, CB_RANGE, RMUS, KG, GWP, STOCK_T, LEAK_KG, CO2_T, dur: DUR };
const B = (nl, en, more = {}) => ({ nl, en, ...more });
const spec = {
  id: 'eng.switchgear.devices',
  title: { nl: 'Wat kan deze schakelaar?', en: 'What can this switch do?' },
  lessons: [DEV, INS],
  scenes: [
    {
      id: 's1', lesson: INS, level: 1, dur: DUR[0], still: 0.92, title: { nl: 'Een netstation', en: 'A secondary substation' },
      beats: [
        B('Een netstation in de straat: de MS-schakelinstallatie en de transformator.', 'A secondary substation in the street: the MV switchgear and the transformer.', { cues: [] }),
        B('Het MS-deel is een {t:RMU|RMU}: één compact blok in een stalen tank.', 'The MV part is an {t:RMU|RMU}: one compact block in a steel tank.', { cue: { RMU: 'rmu' } }),
        B('Elk {t:Veld|veld} is één kast: twee voor de ring, één voor de transformator.', 'Each {t:Panel|panel} is one cabinet: two for the ring, one for the transformer.', { cue: { Veld: 'panel' } }),
        B('Vraag bij elke schakelaar: wat kan hij inschakelen, en wat kan hij onderbreken?', 'Ask of every switch: what can it make, and what can it break?', { cues: [] }),
      ],
    },
    {
      id: 's2', lesson: DEV, level: 1, dur: DUR[1], still: 0.92, title: { nl: 'De vermogensschakelaar', en: 'The circuit breaker' },
      beats: [
        B('In het onderstation begint elke MS-kabel bij een {t:Vermogensschakelaar|vermogensschakelaar}.', 'In the substation, every MV feeder starts at a {t:Circuit breaker|circuit breaker}.', { cue: { Vermogensschakelaar: 'cb' } }),
        B('Hij schakelt belasting, en onderbreekt ook kortsluitstromen: meestal {n:16} tot {n:25} kA.', 'It switches load and also breaks short-circuit currents: typically {n:16} to {n:25} kA.', { cues: ['cb'] }),
        B('Een beveiligingsrelais ziet de fout en geeft hem de opdracht om te openen.', 'A protection relay sees the fault and tells it to open.', { cues: ['relay'] }),
        B('De contacten gaan open in een {t:Vacuümschakelbuis|vacuümschakelbuis}; de boog dooft bij een nuldoorgang.', 'The contacts part in a {t:Vacuum interrupter|vacuum interrupter}; the arc dies at a current zero.', { cue: { Vacuümschakelbuis: 'vib' } }),
      ],
    },
    {
      id: 's3', lesson: DEV, level: 1, dur: DUR[2], still: 0.92, title: { nl: 'Het kortsluitvermogen', en: 'The fault level' },
      beats: [
        B('Het {t:Kortsluitvermogen|kortsluitvermogen}: hoe hard een fout op die plek aankomt.', 'The {t:Fault level|fault level}: how hard a fault hits at that point.', { cue: { Kortsluitvermogen: 'fl' } }),
        B('Vlak bij een onderstation in een {n:10} kV-net: ruwweg {n:15} tot {n:20} kA.', 'Near a substation in a {n:10} kV grid: roughly {n:15} to {n:20} kA.', { cues: ['fl'] }),
        B('De schakelaar moet zwaarder zijn dan het kortsluitvermogen op zijn plek.', 'The breaker must be rated above the fault level where it sits.', { cues: ['fl'] }),
        B('Voorbeeld: een schakelaar van {n:20} kA ziet {n:8} kA en opent in zo’n {n:0.3} s.', 'Example: a {n:20} kA breaker sees {n:8} kA and opens in about {n:0.3} s.', { cues: ['fl'] }),
      ],
    },
    {
      id: 's4', lesson: DEV, level: 1, dur: DUR[3], still: 0.92, title: { nl: 'Lastscheider en zekering', en: 'Load-break switch and fuse' },
      beats: [
        B('Terug in het netstation: de twee ringvelden hebben een {t:Lastscheider|lastscheider}.', 'Back in the secondary substation: the two ring panels have a {t:Load-break switch|load-break switch}.', { cue: { Lastscheider: 'ring' } }),
        B('Hij schakelt belasting en kan inschakelen op een fout, maar onderbreekt geen kortsluiting.', 'It switches load and can close onto a fault, but cannot break a short circuit.', { cues: ['ring'] }),
        B('De transformator van {n:400} kVA krijgt een lastscheider met een {t:Zekering|zekering} per fase.', 'The {n:400} kVA transformer gets a load-break switch with a {t:Fuse|fuse} per phase.', { cue: { Zekering: 'fuse' } }),
        B('Bij een fout smelt de zekering door, één keer; daarna moet er een nieuwe in.', 'On a fault the fuse melts, once; then a new one must go in.', { cues: ['fuse'] }),
      ],
    },
    {
      id: 's5', lesson: DEV, level: 1, dur: DUR[4], still: 0.92, title: { nl: 'Scheiden en aarden', en: 'Isolating and earthing' },
      beats: [
        B('Een {t:Scheider|scheider} bedien je alleen stroomloos: hij maakt een veilige scheiding.', 'You operate a {t:Disconnector|disconnector} only without current: it makes a safe gap.', { cue: { Scheider: 'iso' } }),
        B('Een {t:Aardingsschakelaar|aardingsschakelaar} verbindt het spanningsloze deel met aarde.', 'An {t:Earthing switch|earthing switch} connects the dead section to earth.', { cue: { Aardingsschakelaar: 'earth' } }),
        B('Eerst scheiden, dan aarden; de vergrendeling (interlock) blokkeert de verkeerde volgorde.', 'Isolate first, then earth; the interlock blocks the wrong order.', { cues: ['lock'] }),
        B('Een scheider onder belasting bedienen kan een vlamboog geven: hitte, licht en druk.', 'Operating a disconnector under load can cause an arc flash: heat, light and pressure.', { cues: ['iso'] }),
      ],
    },
    {
      id: 's6', lesson: INS, level: 1, dur: DUR[5], still: 0.92, title: { nl: 'Lucht of gas', en: 'Air or gas' },
      beats: [
        B('In een onderstation een rij velden, elk met schakelaar, meettransformatoren en relais.', 'In a substation, a row of panels, each with a breaker, measuring transformers and a relay.', { cues: [] }),
        B('Een {t:Luchtgeïsoleerde installatie|luchtgeïsoleerde installatie} is groot: lucht isoleert, dus afstand.', '{t:Air-insulated switchgear|Air-insulated switchgear} is large: air insulates, so it needs distance.', { cue: { 'Luchtgeïsoleerde installatie': 'ais' } }),
        B('Een {t:Gasgeïsoleerde installatie|gasgeïsoleerde installatie} zit in een tank met {t:SF6|SF6}: compact.', '{t:Gas-insulated switchgear|Gas-insulated switchgear} sits in a tank of {t:SF6|SF6}: compact.', { cue: { 'Gasgeïsoleerde installatie': 'gis', SF6: 'sf6' } }),
        B('Een drukmeter laat zien of het gas er nog in zit.', 'A pressure gauge shows the gas is still in.', { cues: ['gauge'] }),
      ],
    },
    {
      id: 's7', lesson: INS, level: 1, dur: DUR[6], still: 0.92, title: { nl: 'SF6 eruit', en: 'SF6 out' },
      beats: [
        B('Maar SF6 is een heel sterk broeikasgas: zo’n {n:23500} keer CO2 per kilo.', 'But SF6 is a very strong greenhouse gas: about {n:23500} times CO2 per kilogram.', { cues: ['sf6'] }),
        B('Voorbeeld: {n:20000} RMU’s met {n:1.5} kg is {n:30} ton; {n:0.1}% lek is {n:30} kg per jaar.', 'Example: {n:20000} RMUs with {n:1.5} kg is {n:30} t; a {n:0.1}% leak is {n:30} kg a year.', { cues: ['sf6'] }),
        B('Dat is ruwweg {n:700} ton CO2-equivalent per jaar.', 'That is roughly {n:700} t of CO2 equivalent a year.', { cues: ['sf6'] }),
        B('Nieuw tot {n:24} kV vanaf 2026, tot {n:52} kV vanaf 2030: in principe zonder SF6, met vacuüm.', 'New up to {n:24} kV from 2026, up to {n:52} kV from 2030: in principle without SF6, with vacuum.', { cues: ['vib'] }),
      ],
    },
    {
      id: 's8', lesson: DEV, level: 1, dur: DUR[7], still: 0.92, title: { nl: 'Wat kan hij?', en: 'What can it do?' },
      beats: [
        B('Vermogensschakelaar: last schakelen en kortsluiting onderbreken, telkens opnieuw.', 'Circuit breaker: switches load and breaks short circuits, again and again.', { cues: [] }),
        B('Lastscheider: last schakelen, geen kortsluiting. Zekering: onderbreekt, één keer.', 'Load-break switch: switches load, no short circuit. Fuse: breaks it, once.', { cues: [] }),
        B('Scheider: alleen stroomloos. Aardingsschakelaar: het dode deel naar aarde.', 'Disconnector: only without current. Earthing switch: the dead section to earth.', { cues: [] }),
        B('Een installatie staat er {n:30} tot {n:50} jaar. Vraag dus: welk type is het?', 'An installation stays {n:30} to {n:50} years. So ask: which type is it?', { cues: ['rmu'] }),
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", "×", "=", "%" or units as symbols in the
// spoken text: kA, kV and kVA are written out, and "0,1%" is said "0,1
// procent". Terms as in the grid modules (netstation, onderstation, ring,
// beveiligingsrelais, kortsluitverklikker not needed here), the five safety
// rules word for word as eng.gridops (vrijschakelen, beveiligen tegen
// herinschakelen, spanningsloosheid vaststellen, aarden en kortsluiten,
// naastgelegen delen onder spanning afschermen) and the LOTO and permit films
// (vergrendeling). Dutch words checked with espeak-ng phonemes (Piper's own
// bridge, films/_kit/voice-ab/phon.py with nl_NL-alex-medium). Dutch-only SAY
// rules in films/_kit/timeline.mjs: vermogensschakelaar and
// aardingsschakelaar (singular; espeak-ng stresses "-ke-" with the e of "bed",
// as the drives film's magneetschakelaar), kortsluitvermogen (stressed on
// "-mo-"; said KORTsluit-vermogen), vrijschakelen (stressed on "-ke-"; said
// VRIJ-schakelen), schakelstation and klantstation (said like netstation)
// and RMU as letters (espeak-ng reads the
// word "rmu"). Kept out of the Dutch narration: installatie alone (espeak-ng
// stresses "IN-"; schakelinstallatie is read right), blindschema and
// ringkabel (stressed on the head), materialen (stressed on "MA-"),
// kortsluitstroom (stressed on "stroom"),
// transformatorveld, "ring main unit" (read as Dutch). Read right:
// lastscheider, zekering, scheider, vacuümschakelbuis, smeltpatroon, slagpen,
// beveiligingsrelais, luchtgeïsoleerde, gasgeïsoleerde, drukmeter, SF6, CO2,
// F-gassenverordening, spanningsloosheid, vergrendeling, netstation.
const SAY = [
  [ // s1 a secondary substation
    B('Dit netstation voedt een paar straten. Links de schakelinstallatie voor de middenspanning, rechts de transformator die {n:10} kilovolt omzet naar laagspanning.',
      'This secondary substation feeds a few streets. On the left the medium-voltage switchgear, on the right the transformer that steps {n:10} kilovolts down to low voltage.'),
    B('Een schakelinstallatie schakelt, beveiligt en scheidt delen van het net. Hier is dat een {t:RMU|RMU}: één compact blok in een gesloten stalen tank.',
      'Switchgear switches, protects and isolates parts of the grid. Here it is an {t:RMU|RMU}, a ring main unit: one compact block in a sealed steel tank.'),
    B('Die heeft drie {t:Veld|velden}: één kast per kabel of transformator. Twee velden koppelen het station in de ring, het derde voedt de transformator. Een lijntekening op de voorkant toont welke schakelaar open, dicht of geaard is.',
      'It has three {t:Panel|panels}: one cabinet per cable or transformer. Two panels link the station into the ring; the third feeds the transformer. A line drawing on the front shows which switch is open, closed or earthed.'),
    B('Vraag bij elk apparaat twee dingen. Wat kan hij inschakelen, en wat kan hij onderbreken?',
      'Ask two things of every device. What can it make, and what can it break?'),
  ],
  [ // s2 the circuit breaker
    B('In het onderstation begint elke uitgaande middenspanningskabel, die een ring van netstations voedt, bij een {t:Vermogensschakelaar|vermogensschakelaar}. Die zit ook in schakelstations en grote klantstations.',
      'In the substation, every outgoing medium-voltage feeder, which feeds a ring of stations, starts at a {t:Circuit breaker|circuit breaker}. Breakers also sit in switching and large customer stations.'),
    B('Die schakelt belasting, maar onderbreekt ook een kortsluiting, telkens opnieuw. Meestal is hij gebouwd voor {n:16} tot {n:25} kiloampère.',
      'It switches load, but also breaks a short circuit, again and again, and is typically rated for {n:16} to {n:25} kiloamps.'),
    B('Een beveiligingsrelais meet de stroom. Ziet het een fout, dan laat het de schakelaar openen.',
      'A protection relay measures the current. When it sees a fault, it tells the breaker to open.'),
    B('Gaan de contacten uit elkaar, dan springt er een boog over. In een {t:Vacuümschakelbuis|vacuümschakelbuis} brandt die alleen in metaaldamp. Bij de volgende nuldoorgang van de stroom dooft hij, en de damp slaat meteen neer.',
      'As the contacts part, an arc jumps across. In a {t:Vacuum interrupter|vacuum interrupter} it burns only in metal vapour. At the next current zero it goes out, and the vapour condenses at once.'),
  ],
  [ // s3 the fault level
    B('Hoe zwaar? Dat hangt af van het {t:Kortsluitvermogen|kortsluitvermogen}: hoe hard een kortsluiting op die plek aankomt.',
      'How heavy? That depends on the {t:Fault level|fault level}: how hard a short circuit hits at that point.'),
    B('Vlak bij een onderstation, in een net van {n:10} kilovolt, is dat een paar honderd megavoltampère, ruwweg {n:15} tot {n:20} kiloampère.',
      'Near a substation, in a {n:10} kilovolt grid, it is a few hundred megavolt-amperes, roughly {n:15} to {n:20} kiloamps.'),
    B('Elke vermogensschakelaar moet zwaarder zijn dan het kortsluitvermogen op zijn plek.',
      'Every circuit breaker must be rated above the fault level where it sits.'),
    B('Een voorbeeld. Een graafmachine raakt een kabel van de ring. Het relais ziet {n:8} kiloampère, en de schakelaar van {n:20} kiloampère opent in zo’n {n:0.3} seconde.',
      'An example: a digger hits a ring cable. The relay sees {n:8} kiloamps, and the {n:20} kiloamp breaker opens in about {n:0.3} seconds.'),
  ],
  [ // s4 load-break switch and fuse
    B('Terug in het netstation. De twee velden voor de ring hebben een {t:Lastscheider|lastscheider}: daarmee schakelen monteurs delen van de ring in en uit.',
      'Back in the secondary substation, the two ring panels each have a {t:Load-break switch|load-break switch}, for switching sections of the ring in and out.'),
    B('Een lastscheider schakelt de normale belasting, en kan inschakelen op een fout, maar geen kortsluiting onderbreken. In het voorbeeld opent dus eerst de vermogensschakelaar. Daarna opent een monteur de lastscheiders rond het kapotte stuk, en gaat de vermogensschakelaar weer in.',
      'A load-break switch switches the normal load, and can close onto a fault, but cannot break a short circuit. So when the digger strikes, the breaker opens first. Then a technician opens the load-break switches around the damaged section, and the breaker goes back in.'),
    B('Het derde veld voedt de transformator van {n:400} kilovoltampère, met een lastscheider en een {t:Zekering|zekering} per fase: een smeltpatroon vol zand, met een dunne draad van zilver.',
      'The third panel feeds the {n:400} kilovolt-ampere transformer, through a load-break switch and a {t:Fuse|fuse} per phase: a sand-filled cartridge with a thin silver element.'),
    B('Bij een fout smelt de draad door en dooft het zand de boog. Meestal springt er een slagpen uit, die de lastscheider laat openen. Daarna moet er een nieuwe zekering in.',
      'On a fault the element melts and the sand quenches the arc. Usually a striker pin pops out and trips the load-break switch. Then the fuse is replaced.'),
  ],
  [ // s5 isolating and earthing
    B('Voor werk achter een veld is er de {t:Scheider|scheider}. Die bedien je alleen stroomloos: hij maakt een veilige scheiding.',
      'For work behind a panel there is the {t:Disconnector|disconnector}. You operate it only without current: it makes a safe gap.'),
    B('De {t:Aardingsschakelaar|aardingsschakelaar} verbindt het spanningsloze deel met aarde. Komt er per ongeluk toch spanning op, dan gaat de stroom naar aarde, niet door een mens.',
      'The {t:Earthing switch|earthing switch} connects the dead section to earth. If voltage comes back by mistake, the current flows to earth, not through a person.'),
    B('In een RMU is dat vaak één schakelaar met drie standen: dicht, open en geaard. Een vergrendeling blokkeert de verkeerde volgorde, zoals een kabel aarden die nog onder spanning staat. Die volgorde hoort bij de vijf veiligheidsregels: vrijschakelen, beveiligen tegen herinschakelen, spanningsloosheid vaststellen, aarden en kortsluiten, en naastgelegen delen onder spanning afschermen.',
      'In an RMU this is often one three-position switch: closed, open and earthed. An interlock blocks the wrong order, such as earthing a cable that is still live. That order belongs to the five safety rules: disconnect, secure against reconnection, verify absence of voltage, earth and short-circuit, and protect against adjacent live parts.'),
    B('Een scheider onder belasting bedienen, of inschakelen op een fout die de schakelaar niet aankan, kan een vlamboog geven: hitte, licht en druk die de bediener verbranden. Goede schakelinstallaties zijn beproefd op een interne boog, binnen in de kast: de klap gaat weg van de bediener.',
      'Operating a disconnector under load, or closing a switch onto a fault it cannot handle, can cause an arc flash: heat, light and pressure that burn the operator. Good switchgear is tested against an internal arc, inside the cabinet, and vents the blast away from the operator.'),
  ],
  [ // s6 air or gas
    B('In een onderstation staat een rij velden, elk met een vermogensschakelaar, meettransformatoren die stroom en spanning terugschalen, en een beveiligingsrelais.',
      'A substation has a row of panels, each with a circuit breaker, measuring transformers that scale current and voltage down, and a protection relay.'),
    B('Een {t:Luchtgeïsoleerde installatie|luchtgeïsoleerde schakelinstallatie} is groot: de lucht tussen de delen onder spanning isoleert, en dat vraagt afstand.',
      '{t:Air-insulated switchgear|Air-insulated switchgear} is large: air between the live parts insulates them, so it needs distance.'),
    B('Een {t:Gasgeïsoleerde installatie|gasgeïsoleerde schakelinstallatie} zet die delen in een gesloten tank met {t:SF6|SF6}, een isolerend gas, en is veel compacter. Ook veel RMU’s zijn met SF6 geïsoleerd. Veel netstations hebben nog oudere types met vaste kunsthars, zoals de Magnefix, soms met extra regels voor het bedienen.',
      '{t:Gas-insulated switchgear|Gas-insulated switchgear} puts those parts in a sealed tank of {t:SF6|SF6}, an insulating gas, and is much more compact. Many RMUs are SF6-insulated too. Many stations still have older types, like the resin-insulated Magnefix, some with extra operating rules.'),
    B('Een drukmeter op de voorkant laat zien of het gas er nog in zit.',
      'A pressure gauge on the front shows the gas is still in.'),
  ],
  [ // s7 SF6 out
    B('{t:SF6|SF6} isoleert en dooft bogen extreem goed. Maar het is het sterkste broeikasgas dat veel gebruikt wordt: zo’n {n:23500} keer CO2, per kilo.',
      '{t:SF6|SF6} insulates and quenches arcs extremely well. But it is the strongest greenhouse gas in common use: about {n:23500} times CO2, per kilogram.'),
    B('Een voorbeeld: {n:20000} RMU’s met elk {n:1.5} kilo gas is {n:30} ton. Lekt er {n:0.1} procent per jaar weg, dan is dat {n:30} kilo.',
      'An example: {n:20000} RMUs with {n:1.5} kilograms of gas each is {n:30} tonnes. If {n:0.1} percent leaks each year, that is {n:30} kilograms.'),
    B('Maal {n:23500} is dat ruwweg {n:700} ton CO2-equivalent, elk jaar.',
      'Times {n:23500}, that is roughly {n:700} tonnes of CO2 equivalent, every year.'),
    B('Daarom mogen nieuwe schakelinstallaties tot {n:24} kilovolt volgens de Europese F-gassenverordening vanaf 2026 in principe geen SF6 meer gebruiken, en tot {n:52} kilovolt vanaf 2030. De nieuwe types onderbreken de boog in vacuüm, en isoleren met droge lucht of vaste isolatie. Netbeheerders passen hun standaard netstation aan, scholen monteurs om, en zamelen SF6 uit oude schakelinstallaties veilig in.',
      'So under the EU F-gas Regulation, new switchgear up to {n:24} kilovolts may in principle no longer use SF6 from 2026, and up to {n:52} kilovolts from 2030. New types break the arc in vacuum and insulate with dry air or solid materials. Grid operators update their station design, retrain technicians and safely collect SF6 from old units.'),
  ],
  [ // s8 what can it do
    B('Samengevat. De vermogensschakelaar onderbreekt kortsluitingen, telkens opnieuw.',
      'In short: the circuit breaker breaks short circuits, again and again.'),
    B('De lastscheider schakelt belasting, maar geen kortsluiting. De zekering onderbreekt een fout, één keer.',
      'The load-break switch switches load, not short circuits; the fuse breaks a fault once.'),
    B('De scheider bedien je alleen stroomloos, de aardingsschakelaar aardt het dode deel. Weten wat elk apparaat kan is basisveiligheid.',
      'The disconnector works only without current; the earthing switch earths the dead section. Knowing what each device can do is basic safety.'),
    B('Een schakelinstallatie staat er {n:30} tot {n:50} jaar, dus die keuze weegt zwaar. Vraag altijd: welk type is het? En wat houdt iemand tegen die hem verkeerd gebruikt? Oudere schakelinstallaties missen een deel van de vergrendelingen.',
      'Switchgear stays {n:30} to {n:50} years, so purchasing and standardisation matter. Always ask: which type is it? And what stops someone using it wrong? Older units lack some of the interlocks.'),
  ],
];
// Each beat's still (reduced motion) sits late in its own share of the scene,
// where the stage has finished that beat's move.
{
  const resolved = resolveFilm(spec, lessons);
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

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.mf-glass{fill:var(--anatomy-shade-0);stroke:none}
.mf-well{fill:var(--anatomy-shade-0);stroke:none}
.mf-card{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linejoin:round}
.mf-dial{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.mf-band2{fill:none;stroke:var(--anatomy-mid);stroke-width:.5px}
.mf-needle{fill:none;stroke:var(--anatomy-strong);stroke-width:.35px;stroke-linecap:round}
.mf-pivot{fill:var(--anatomy-hi)}
.mf-blade{fill:none;stroke:var(--anatomy-strong);stroke-width:.55px;stroke-linecap:round}
[data-cue][data-on] .mf-blade,[data-cue][data-on] .mf-needle,[data-cue][data-on] .mf-band2{stroke:var(--fp-accent)}
.mf-mark{fill:none;stroke:var(--fp-accent);stroke-width:2px;opacity:0}
[data-cue][data-on] .mf-mark{opacity:1}
.mf-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.mf-tile{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.8}
.mf-iron{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.mf-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.mf-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.mf-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.mf-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.mf-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.mf-grid{fill:none;stroke:var(--fp-hair);stroke-width:1}
.mf-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.mf-ghost{fill:none;stroke:var(--anatomy-lo);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;opacity:.7}
.mf-dash{fill:none;stroke:var(--fp-accent);stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
.mf-dot{fill:var(--anatomy-hi)}
.mf-sand{fill:var(--anatomy-lo)}
.mf-acc{fill:var(--fp-accent);stroke:none}
.mf-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.mf-accf{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1.4}
.mf-band{fill:color-mix(in srgb,var(--anatomy-mid) 16%,transparent);stroke:none}
.mf-gas{fill:color-mix(in srgb,var(--anatomy-mid) 14%,transparent);stroke:var(--anatomy-mid);stroke-width:1.2}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .mf-line{stroke:var(--fp-accent);stroke-width:2.8}
[data-cue][data-on] .mf-band{fill:color-mix(in srgb,var(--fp-accent) 26%,transparent)}
[data-cue][data-on] .mf-gas{fill:color-mix(in srgb,var(--fp-accent) 20%,transparent);stroke:var(--fp-accent)}
[data-cue][data-on] .mf-tile,[data-cue][data-on] .mf-iron{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .mf-txt,[data-cue][data-on] .mf-mono{fill:var(--fp-accent-text)}
[data-cue][data-on] .mf-dot{fill:var(--fp-accent)}
[data-cue][data-on] .fp-meter{fill:var(--fp-accent)}
`;

const label = {
  nl: 'Een netstation: een RMU met drie velden, elk met een lijntekening van het circuit en bedieningsgaten, een drukmeter en een hangslot, en een kabel naar een transformator met koelribben. Kaarten tonen een vacuümschakelbuis met de boog en de stroom door nul, het kortsluitvermogen met het voorbeeld, een MS-zekering, de schakelaar met drie standen en de vergrendeling, lucht- tegenover gasgeïsoleerde installaties, de SF6-sommen en een tabel van wat elke schakelaar kan.',
  en: 'A secondary substation: an RMU with three panels, each with a line drawing of its circuit and operating sockets, a pressure gauge and a padlock, and a cable to a transformer with cooling fins. Cards show a vacuum interrupter with its arc and the current through zero, the fault level with the worked example, an MV fuse, the three-position switch and its interlock, air- against gas-insulated switchgear, the SF6 sums and a table of what each switch can do.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  A.auditOrExit(R, P);
}
