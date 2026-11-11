// Dev tool, not shipped. Builds the explainer film "Een proceslijn lezen /
// Reading a process line" for Procestechniek: de basis: the level 1 lessons
// eng.process.types (topic Procestypen en processchema's) and
// eng.process.variables (topic Procesgrootheden en regelen), as the plan row
// lists them ("types, variables"). Both lesson ids still exist after the
// rebuild into topics x levels, so no mapping was needed.
//
//   node films/eng.process.plant/build.mjs            build the page
//   node films/eng.process.plant/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.process.plant.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.5
// (eng.process). Both lessons are Basis, so the film is a broad "how it
// works": one juice line from left to right, its unit operations, the batch
// vat against the continuous line, the holding tube of the types example, the
// four process variables with their instruments, a temperature loop read as
// on a P&ID, and the syrup level of the variables example.
//
// One small juice plant on a floor: a batch mixing vat on legs (agitator
// drive, manhole, inlet, a sight glass and a pressure-type level transmitter
// at the bottom), an in-line pump, a Coriolis meter with its transmitter
// head, a pressure gauge on a stub, a plate heat exchanger (frame, plate pack,
// carrying and guide bar, tie bolts) with its hot-water supply and return and
// a pneumatic control valve, a Pt100 head in a thermowell, a serpentine
// holding tube on two stands, a small plate cooler with its ice-water pipes,
// and a rotary filler on a cabinet with a conveyor and bottles. Cards in stage
// space: the steps, the batch phases, a steady-state trend, the residence-time
// sum with a velocity profile, the pressure scales, the mass-flow rule, the
// loop on a P&ID (ISA-5.1 bubbles TT, TIC, TV) and the syrup level sum; cards
// with invented content are labelled "voorbeeld".
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
// The lessons' facts and worked examples, asserted against their current text
// (the build fails if a lesson drifts); {n:...} numbers are then checked against
// the Dutch lesson text by defineFilm. Facts checked against:
// - Unit operations: the classic chemical-engineering idea (pumping, heat
//   transfer, mixing, separation, drying, reaction); filling is packaging, so
//   the film calls it the step after the line, not a unit operation.
// - HTST pasteurisation of juice: heat in a plate heat exchanger, hold in a
//   holding tube for a set time, then cool and fill; holding tubes are sized on
//   the fastest particle (in laminar flow the centre runs at about twice the
//   mean speed), as the lesson says.
// - Residence time = volume / flow: 0,1 m³ / 12 m³/h = 30 s; at 18 m³/h 20 s.
// - Gauge pressure is measured against the surrounding air, absolute against
//   vacuum; at sea level the atmosphere is about 1,013 bar, "about 1 bar".
// - A Coriolis meter vibrates its tube(s) and reads the twist (phase shift)
//   that the flowing mass causes; it gives mass flow directly (accuracy around
//   0,1 % of reading for liquids, as the lesson says).
// - A Pt100 is a platinum resistor of 100 ohm at 0 °C (IEC 60751); it sits in a
//   thermowell, which slows its response.
// - P&ID symbols per ISA-5.1 (as in eng.drawings.pid): first letter the
//   variable (T temperature), next letters the function (T transmitter, I
//   indicate, C control, V valve); a plain circle is a field instrument, a
//   circle in a square sits on the DCS screen; a dashed line is an electric
//   signal; a control valve is a bowtie with a dome (pneumatic actuator). The
//   loop: transmitter, controller, valve; the controller compares the
//   measurement with the setpoint. The film says "meestal" where sites differ.
// - Hydrostatic level: p = ρ g h; a meter set for water reads p / (1.000 × g).
const TYPES = 'eng.process.types';
const VARS = 'eng.process.variables';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const inOrder = (text, words) => { let from = 0; return words.every((w) => { const at = text.indexOf(w, from); if (at < 0) return false; from = at + w.length; return true; }); };
{
  const t = lessons.nl.get(TYPES);
  const tt = t.teach.join('\n');
  assert(inOrder(tt, ['unit operations', 'Pompen, verwarmen en koelen, mengen, scheiden, drogen en reageren']), 'types: the unit operations');
  assert(inOrder(tt, ['filtreren', 'centrifugeren', 'destilleren', 'indampen']), 'types: the ways to separate');
  assert(inOrder(tt, ['batchproces', 'als één partij, met één batchnummer', 'vullen, legen en reinigen leveren niks op']), 'types: batch');
  assert(inOrder(tt, ['continu proces', 'stationaire toestand', 'Opstarten en stoppen duurt uren', 'off-spec', 'batchgewijs mengen dat een continue vullijn voedt']), 'types: continuous');
  assert(inOrder(tt, ['ontwerp je op het snelste deel']), 'types: design on the fastest part');
  const ex = t.example.text;
  assert(inOrder(ex, ['heethoudbuis', '0,1 m³ inhoud, met 12 m³ per uur', '30 seconden', 'minstens 20 seconden', '18 m³ per uur', '20 seconden: precies op het minimum', 'het snelste deeltje', 'langere heethoudbuis']), 'types: the holding-tube example');
  const v = lessons.nl.get(VARS);
  const vt = v.teach.join('\n');
  assert(inOrder(vt, ['druk, temperatuur, debiet en niveau', 'Overdruk', 'buitenlucht', 'absolute druk', 'vacuüm', 'zo’n 1 bar']), 'variables: pressure');
  assert(inOrder(vt, ['Massadebiet = volumedebiet × dichtheid', '1.000 kg/m³', '1 m³/h water is ongeveer 1.000 kg/h', 'vraag wat een meter echt toont']), 'variables: mass flow');
  assert(inOrder(vt, ['Coriolismeter laat een buis trillen', 'verdraaiing', 'direct massa', '0,1%']), 'variables: Coriolis');
  assert(inOrder(vt, ['druksensor onderin', 'gewicht van de vloeistofkolom', 'vraag dan op welk principe']), 'variables: level');
  assert(inOrder(vt, ['Pt100', 'platina weerstand', 'een paar tiende graad', 'beschermhuls', 'minuten achter']), 'variables: Pt100');
  assert(v.terms.find((x) => x.term === 'Pt100').def.includes('100 ohm bij 0 °C'), 'variables: 100 ohm at 0 °C');
  assert(inOrder(v.pre[0].q + v.pre[0].why, ['2 bar', 'zo’n 1 bar', 'ongeveer 3 bar']), 'variables: 2 bar(g) is about 3 bar(a)');
  assert(inOrder(v.example.text, ['ingesteld op water (1.000 kg/m³)', 'siroop van 1.250 kg/m³ in, echt 2,0 m hoog', '24.525 Pa', '2,5 m', 'hoog-niveaualarm kan te vroeg afgaan', 'De massa die de meter aangeeft klopt wel', 'de juiste dichtheid invoeren, of de tank in kg aflezen']), 'variables: the syrup example');
  assert(lessons.nl.get(VARS).said.includes('halve meter te hoog'), 'variables: half a metre too high');
}
// the holding tube: residence time = volume / flow
const VOL = 0.1;
const Q1 = 12;
const Q2 = 18;
const T1 = (VOL / Q1) * 3600;
const T2 = (VOL / Q2) * 3600;
assert(near(T1, 30, 1e-9) && near(T2, 20, 1e-9), '0,1 / 12 h = 30 s; 0,1 / 18 h = 20 s');
const TMIN = 20;
assert(T2 === TMIN, 'at 18 m³/h exactly the minimum');
// pressure: gauge 2 bar at sea level is about 3 bar absolute
assert(2 + 1 === 3, 'absolute = gauge + about 1 bar');
// mass flow: 1 m³/h of water of 1.000 kg/m³ is 1.000 kg/h
assert(1 * 1000 === 1000, 'mass flow = volume flow × density');
// the syrup level
const RHO_W = 1000;
const RHO_S = 1250;
const HREAL = 2.0;
const PB = RHO_S * 9.81 * HREAL;
assert(near(PB, 24525, 1e-6), '1.250 × 9,81 × 2,0 = 24.525 Pa');
const HSHOW = PB / (RHO_W * 9.81);
assert(near(HSHOW, 2.5, 1e-9), 'the meter shows 2,5 m');
assert(near(HSHOW - HREAL, 0.5, 1e-9), 'half a metre too high');

// ---------------------------------------------------------------- the world
// x to the right along the line (the product flows to +x), y toward the viewer,
// z up; the floor is z = 0. Units of about 1 cm.
const W = 640;
const H = 400;
const PZ = 44; // product pipe height from the vat to the heater
const VAT = { c: [-160, 0], R: 34, z0: 30, z1: 140 };
const SG = { a: 62, w: 2.6, z0: 44, z1: 132 }; // the sight glass: angle on the shell (deg), half width, height
const LT = { a: 18, z: 40 }; // the level transmitter at the bottom of the vat
const GAUGE = [-30, 2.2, 66]; // the gauge's dial centre (its face toward +y)
const HOLD_Z = [26, 38, 50, 62, 74];
const HOLD_X = [92, 184];
const HOLD = [[54, 12, 26]];
HOLD_Z.forEach((z, i) => { const [a, b] = i % 2 ? [HOLD_X[1], HOLD_X[0]] : HOLD_X; HOLD.push([a, 12, z], [b, 12, z]); });
HOLD.push([196, 12, 74], [196, 12, 40], [196, 4, 40], [205, 4, 40]);
// the stretch that is the holding tube proper (the drop runs through it)
const TUBE = HOLD.slice(1, 1 + HOLD_Z.length * 2);
const BELT = { y: 39, z: 54, x0: 238, x1: 344, gap: 15 };
const C = { PZ, VAT, SG, LT, GAUGE, TUBE, BELT, T1, T2 };

const FIT = [[-200, -50, 0], [-200, 40, 0], [345, 46, 0], [345, -30, 0], [-160, 0, 196], [300, 0, 110], [0, -50, 110]];
const P = k.fitProjection(FIT, W, H, { pad: 10, azimuth: 64, elevation: 30 });
const at = (p) => k.iso(p, P);
const X = [1, 0, 0];
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 1) => S(k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 20, bevel = 0) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
const alongX = (y, z, x0, x1, r, style = {}, steps) => S(G.disc(x0, x1, r, G.frameOf([0, y, z], X, Y, Z), P, steps ? { steps } : {}), style);
const alongY = (x, z, y0, y1, r, style = {}, steps) => S(G.disc(y0, y1, r, G.frameOf([x, 0, z], Y, X, Z), P, steps ? { steps } : {}), style);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const seam = (plan, z, inset = 2) => L(k.sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
const halo = (plan, z, pad = 2) => `<path class="iso-halo" d="${k.haloOf(plan, z, pad, P)}"/>`;
const screws = (plan, z, inset = 2.4) => Dt(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });
const led = (key, p, r = 0.8) => { const [x, y] = at(p); return `<circle class="pl-led" data-led="${key}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * G.scaleOf(P)).toFixed(2)}"/>`; };
const ringY = (c, r, n = 28) => k.pathOf(Array.from({ length: n }, (_, i) => at([c[0] + r * Math.cos((i / n) * 2 * Math.PI), c[1], c[2] + r * Math.sin((i / n) * 2 * Math.PI)])), true);
// a pipe: a dark outer stroke and a lighter inner one, ends on terminal dots (a flange or a port)
const pipe = (pts, cls = '') => { const d = k.pathOf(pts.map(at)); const e = [pts[0], pts[pts.length - 1]].map(at).map(([x, y]) => `<circle class="pl-end" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9"/>`).join(''); return `<g class="pl-pipe${cls ? ` ${cls}` : ''}"><path class="pl-pipeO" d="${d}"/><path class="pl-pipeI" d="${d}"/>${e}</g>`; };
const flowPath = (key, pts) => `<path class="pl-flow" data-k="${key}" d="${k.pathOf(pts.map(at))}" style="opacity:0"/>`;
// a flat card on the vat shell, tangent at angle a (deg), from z0 to z1, half width w
const shellCard = (a, w, z0, z1, R = VAT.R + 0.3) => {
  const r = (a * Math.PI) / 180;
  const n = [Math.cos(r), Math.sin(r)];
  const t = [-n[1], n[0]];
  const c = [VAT.c[0] + R * n[0], VAT.c[1] + R * n[1]];
  return k.pathOf([[c[0] - w * t[0], c[1] - w * t[1], z0], [c[0] + w * t[0], c[1] + w * t[1], z0], [c[0] + w * t[0], c[1] + w * t[1], z1], [c[0] - w * t[0], c[1] - w * t[1], z1]].map(at), true);
};
C.SGC = (() => { const r = (SG.a * Math.PI) / 180; return [Math.cos(r), Math.sin(r)]; })();

// ---------------------------------------------------------------- the batch vat
const vat = (() => {
  const [cx, cy] = VAT.c;
  const R = VAT.R;
  let out = halo({ x: cx - R - 4, y: cy - R - 4, w: 2 * R + 8, d: 2 * R + 8, r: R }, 0, 2);
  // four legs with foot pads, braced to the shell
  const legs = [45, 135, 225, 315].map((a) => [cx + 26 * Math.cos((a * Math.PI) / 180), cy + 26 * Math.sin((a * Math.PI) / 180)]);
  out += legs.map(([x, y]) => box({ x: x - 4, y: y - 4, w: 8, d: 8, r: 0.6 }, 0, 2, { tone: 'lo' }, 0.2) + post(x, y, 2.4, 2, VAT.z0 + 6, { tone: 'lo' }, 12)).join('');
  // the cone under the shell and its outlet stub
  out += post(cx, cy, 30, VAT.z0 - 4, VAT.z0, { tone: 'lo' }, 32, 2) + post(cx, cy, 3, VAT.z0 - 10, VAT.z0 - 4, { tone: 'lo' }, 12);
  // the shell with two girth seams, a name plate and the dished top
  out += S(k.cylinder(cx, cy, R, VAT.z0, VAT.z1 - VAT.z0, P, 40), {
    tone: 'mid',
    inner: L(k.sideArc(cx, cy, R, VAT.z0 + 36, P, 30), { tone: 'faint' }) + L(k.sideArc(cx, cy, R, VAT.z0 + 74, P, 30), { tone: 'faint' }),
  });
  out += `<path class="pl-plate" d="${shellCard(100, 6, 92, 102)}"/>`;
  out += L(k.segment([cx - 5 * Math.sin(100 * Math.PI / 180) + (R + 0.4) * Math.cos(100 * Math.PI / 180), cy + 5 * Math.cos(100 * Math.PI / 180) + (R + 0.4) * Math.sin(100 * Math.PI / 180), 98], [cx + 3 * Math.sin(100 * Math.PI / 180) + (R + 0.4) * Math.cos(100 * Math.PI / 180), cy - 3 * Math.cos(100 * Math.PI / 180) + (R + 0.4) * Math.sin(100 * Math.PI / 180), 98], P), { tone: 'lo', free: true });
  out += S(k.cylinder(cx, cy, R, VAT.z1, 8, P, 40, 6), { tone: 'hi', crease: 'lo' });
  // the manhole on top, the inlet with its pipe up, the agitator drive
  out += post(cx - 12, cy - 14, 8, VAT.z1 + 6, VAT.z1 + 10, { tone: 'mid' }, 22, 0.5) + post(cx - 12, cy - 14, 6, VAT.z1 + 10, VAT.z1 + 12, { tone: 'hi', crease: 'lo' }, 20, 0.5);
  out += post(cx + 16, cy - 14, 2.6, VAT.z1 + 6, VAT.z1 + 14, {}, 12) + post(cx + 16, cy - 14, 3.6, VAT.z1 + 14, VAT.z1 + 16, { tone: 'lo' }, 12, 0.3);
  out += pipe([[cx + 16, cy - 14, VAT.z1 + 16], [cx + 16, cy - 14, 196], [cx + 30, cy - 14, 196]]);
  out += cue('mixer', box({ x: cx - 9, y: cy - 7, w: 18, d: 14, r: 1 }, VAT.z1 + 8, VAT.z1 + 18, { inner: seam({ x: cx - 9, y: cy - 7, w: 18, d: 14 }, VAT.z1 + 12, 1.4) }, 0.5)
    + post(cx, cy, 7, VAT.z1 + 18, VAT.z1 + 44, { tone: 'hi', crease: 'lo', inner: L([24, 30, 36].map((z) => k.sideArc(cx, cy, 7.1, VAT.z1 + z, P, 16)).join(''), { tone: 'faint' }) }, 20)
    + S(k.cylinder(cx, cy, 7.4, VAT.z1 + 44, 4, P, 20, 2), { tone: 'mid' }));
  out += led('mix', [cx + 7 * C.SGC[0], cy + 7 * C.SGC[1], VAT.z1 + 14], 0.8);
  // the sight glass: a strip of glass in a frame; the stage draws the product in it
  out += `<path class="pl-glassF" d="${shellCard(SG.a, SG.w + 1.4, SG.z0 - 2, SG.z1 + 2)}"/><path class="pl-glass" d="${shellCard(SG.a, SG.w, SG.z0, SG.z1, VAT.R + 0.5)}"/>`;
  out += g('level', '');
  // the level transmitter at the bottom: a stub out of the shell, a round head with a little display
  const r = (LT.a * Math.PI) / 180;
  const n = [Math.cos(r), Math.sin(r)];
  const p0 = [cx + R * n[0], cy + R * n[1]];
  out += cue('lt', S(G.disc(0, 8, 2.2, G.frameOf([p0[0], p0[1], LT.z], [n[0], n[1], 0], [-n[1], n[0], 0], Z), P, { steps: 14 }), { tone: 'mid' })
    + S(G.disc(8, 13, 5, G.frameOf([p0[0], p0[1], LT.z], [n[0], n[1], 0], [-n[1], n[0], 0], Z), P, { steps: 20 }), { tone: 'hi', crease: 'lo' })
    + post(p0[0] + 10.5 * n[0], p0[1] + 10.5 * n[1], 1.4, LT.z + 4.6, LT.z + 8, { tone: 'lo' }, 10));
  return out;
})();

// ---------------------------------------------------------------- pump, meter, gauge
const flangeX = (x, y, z, r = 5) => alongX(y, z, x - 1, x + 1, r, { tone: 'mid' }, 18);
const pump = cue('pump', [
  halo({ x: -100, y: -10, w: 20, d: 20, r: 3 }, 0, 2),
  box({ x: -99, y: -9, w: 18, d: 18, r: 1 }, 0, 4, { tone: 'lo', inner: seam({ x: -99, y: -9, w: 18, d: 18 }, 2, 1.4) }, 0.3),
  screws({ x: -99, y: -9, w: 18, d: 18 }, 4, 2.4),
  post(-90, 0, 4, 4, 34, { tone: 'lo' }, 14),
  flangeX(-101, 0, PZ), flangeX(-79, 0, PZ),
  alongX(0, PZ, -100, -80, 3, { tone: 'mid' }, 14),
  post(-90, 0, 10, 34, 54, { tone: 'mid', inner: L(k.sideArc(-90, 0, 10, 44, P, 20), { tone: 'faint' }) }, 26, 1),
  post(-90, 0, 6, 54, 62, { tone: 'lo' }, 18),
  post(-90, 0, 8.4, 62, 88, { tone: 'hi', crease: 'lo', inner: L([66, 70, 74, 78, 82].map((z) => k.sideArc(-90, 0, 8.5, z, P, 18)).join(''), { tone: 'faint' }) }, 22),
  S(k.cylinder(-90, 0, 8.8, 88, 5, P, 22, 2.4), { tone: 'mid' }),
  box({ x: -84, y: -4, w: 6, d: 8, r: 0.6 }, 72, 80, { tone: 'lo' }, 0.3),
].join('')) + led('pump', [-81.6, 4, 77]);
const meter = cue('ft', [
  flangeX(-65, 0, PZ), flangeX(-47, 0, PZ),
  alongX(0, PZ, -64, -48, 3, { tone: 'mid' }, 14),
  box({ x: -63, y: -5, w: 14, d: 10, r: 2 }, 20, PZ - 3, { tone: 'hi', crease: 'lo', inner: seam({ x: -63, y: -5, w: 14, d: 10 }, 30, 1.4) }, 0.6, 3),
  post(-56, 0, 2, PZ + 3, PZ + 10, { tone: 'lo' }, 12),
  box({ x: -61, y: -6, w: 10, d: 12, r: 2 }, PZ + 10, PZ + 22, { tone: 'mid', inner: seam({ x: -61, y: -6, w: 10, d: 12 }, PZ + 19, 1.2) }, 0.6, 3),
  alongY(-56, PZ + 16, 6, 7, 3.6, { tone: 'lo' }, 18),
  `<path class="pl-screen" d="${ringY([-56, 7.05, PZ + 16], 2.8, 20)}"/>`,
].join(''));
const gauge = cue('gauge', [
  post(-30, 0, 1.4, PZ + 3, GAUGE[2] - 6, { tone: 'lo' }, 10),
  post(-30, 0, 2.2, PZ + 6, PZ + 9, { tone: 'mid' }, 6),
  alongY(-30, GAUGE[2], -1, 2, 6.6, { tone: 'mid' }, 22),
  `<path class="pl-dial" d="${ringY([-30, 2.05, GAUGE[2]], 5.6)}"/>`,
  L(Array.from({ length: 11 }, (_, i) => { const a = ((-135 + i * 27) * Math.PI) / 180; const yy = 2.1; return k.segment([-30 + 5.1 * Math.sin(a), yy, GAUGE[2] + 5.1 * Math.cos(a)], [-30 + (i % 5 ? 4.3 : 3.7) * Math.sin(a), yy, GAUGE[2] + (i % 5 ? 4.3 : 3.7) * Math.cos(a)], P); }).join(''), { tone: 'mid' }),
  g('needle', ''),
].join(''));

// ---------------------------------------------------------------- plate heat exchanger (heater) and its hot water
const phe = (x0, pack, z1, y = 18, key = 'phe', ports = '') => {
  const head = { x: x0, y: -y, w: 6, d: 2 * y, r: 0.6 };
  const pk = { x: x0 + 8, y: -y + 2, w: pack, d: 2 * y - 4, r: 0.4 };
  const pr = { x: x0 + 10 + pack, y: -y, w: 6, d: 2 * y, r: 0.6 };
  const colX = pr.x + 14;
  let out = halo({ x: x0 - 2, y: -y - 2, w: colX + 8 - x0, d: 2 * y + 4, r: 2 }, 0, 2);
  out += box({ x: x0 + 2, y: -3, w: colX - x0, d: 6 }, 2, 6, { tone: 'lo' }, 0.2); // the guide bar
  out += box({ x: x0 - 1, y: -y - 1, w: 8, d: 2 * y + 2 }, 0, 2, { tone: 'lo' }, 0.2);
  out += box(head, 2, z1, { tone: 'mid', inner: seam(head, z1 - 6, 1.2) }, 0.5);
  // the plate pack: thin plates seen as ribs on the front and the top
  const ribs = [];
  for (let x = pk.x + 1.6; x < pk.x + pk.w - 0.8; x += 1.6) {
    ribs.push(k.segment([x, pk.y + pk.d, 10], [x, pk.y + pk.d, z1 - 6], P));
    ribs.push(k.lineOnTop([x, pk.y], [x, pk.y + pk.d], z1 - 6, P));
  }
  out += box(pk, 10, z1 - 6, { tone: 'hi', crease: 'lo', inner: L(ribs.join(''), { tone: 'faint' }) }, 0.3);
  out += box(pr, 2, z1, { tone: 'mid', inner: seam(pr, z1 - 6, 1.2) }, 0.5);
  out += box({ x: colX, y: -5, w: 6, d: 10 }, 0, z1 + 6, { tone: 'lo' }, 0.3);
  out += box({ x: x0, y: -3, w: colX + 6 - x0, d: 6 }, z1, z1 + 6, { tone: 'mid' }, 0.4); // the carrying bar
  // tie bolts in front with their nuts
  for (const z of [16, z1 - 12]) {
    out += alongX(y + 1.6, z, x0 - 3, pr.x + 9, 1, { tone: 'lo' }, 8);
    out += Dt([at([x0 - 3, y + 1.6, z]), at([pr.x + 9, y + 1.6, z])], { size: 0.7 });
  }
  out += screws(head, z1, 1.6) + screws(pr, z1, 1.6);
  return cue(key, out + ports);
};
const hot = [
  pipe([[-2, -10, 84], [-14, -10, 84], [-14, -48, 84]]),
  pipe([[-2, -13, 20], [-24, -13, 20], [-24, -48, 20]]),
  flowPath('fH', [[-14, -48, 84], [-14, -10, 84], [-2, -10, 84]]),
  flowPath('fR', [[-2, -13, 20], [-24, -13, 20], [-24, -48, 20]]),
].join('');
// the control valve on the hot-water supply: body, flanges, yoke, diaphragm actuator and positioner
const valve = cue('tv', [
  alongY(-14, 84, -35, -33, 5, { tone: 'mid' }, 16), alongY(-14, 84, -25, -23, 5, { tone: 'mid' }, 16),
  alongY(-14, 84, -33, -25, 4.4, { tone: 'hi', crease: 'lo' }, 18),
  post(-14, -29, 1, 88, 96, { tone: 'lo' }, 8),
  box({ x: -17, y: -32, w: 6, d: 6, r: 0.4 }, 88, 90, { tone: 'lo' }, 0.2),
  post(-14, -29, 8, 96, 99, { tone: 'mid' }, 24, 0.6),
  S(k.cylinder(-14, -29, 8, 99, 5, P, 24, 3), { tone: 'hi', crease: 'lo' }),
  box({ x: -8, y: -31, w: 4, d: 5, r: 0.4 }, 90, 96, { tone: 'lo' }, 0.2),
].join(''));
const heater = phe(0, 34, 100, 18, 'phe', alongX(12, 26, 50, 54, 3.4, { tone: 'mid' }, 14));

// ---------------------------------------------------------------- the product line after the heater, the Pt100, the holding tube
const tt = cue('tt', post(70, 12, 1.2, 28, 40, { tone: 'lo' }, 10) + post(70, 12, 2.2, 28, 31, { tone: 'mid' }, 6)
  + post(70, 12, 3.4, 40, 46, { tone: 'hi', crease: 'lo' }, 18, 0.6) + post(70, 12, 1.2, 46, 49, { tone: 'lo' }, 8));
const stand = (x) => {
  let out = box({ x: x - 4, y: 0, w: 8, d: 8, r: 0.4 }, 0, 2, { tone: 'lo' }, 0.2);
  out += box({ x: x - 1.5, y: 2.5, w: 3, d: 3, r: 0.3 }, 2, 80, { tone: 'lo' }, 0.1);
  for (const z of HOLD_Z) out += box({ x: x - 1.5, y: 2.5, w: 3, d: 12, r: 0.3 }, z - 4, z - 2.4, { tone: 'lo' }, 0.1);
  return out;
};
const holding = stand(104) + stand(172) + cue('hold', pipe(HOLD, 'pl-hold'));

// ---------------------------------------------------------------- cooler and filler
const ice = [
  pipe([[236, -8, 58], [250, -8, 58], [250, -40, 58]]),
  pipe([[236, -8, 18], [256, -8, 18], [256, -40, 18]]),
].join('');
const cooler = phe(205, 18, 70, 14, 'cooler', alongX(6, 30, 233, 236, 3, { tone: 'mid' }, 14) + alongX(-8, 58, 233, 236, 2.6, { tone: 'mid' }, 12) + alongX(-8, 18, 233, 236, 2.6, { tone: 'mid' }, 12));
const TOFILL = [[236, 6, 30], [252, 6, 30], [252, 6, 104], [278, 6, 104]];
const filler = (() => {
  const cab = { x: 262, y: -28, w: 64, d: 56, r: 1 };
  let out = halo(k.insetPlan(cab, -3), 0, 2);
  out += k.corners(cab, 4).map(([x, y]) => box({ x: x - 3, y: y - 3, w: 6, d: 6, r: 0.4 }, 0, 4, { tone: 'lo' }, 0.2)).join('');
  // the cabinet with two doors (a seam down the middle, handles) and a ventilation slot row
  out += box(cab, 4, 58, { tone: 'lo', inner: seam(cab, 52, 2) + seam(cab, 10, 2) + L(k.segment([294, 28, 12], [294, 28, 50], P), { tone: 'faint' }) }, 0.6, 2);
  out += Dt([at([290, 28, 32]), at([298, 28, 32])], { size: 0.7 });
  out += box({ x: 260, y: -30, w: 68, d: 60, r: 1.4 }, 58, 61, { tone: 'mid' }, 0.4);
  // the carousel: turntable, valves round it (back ones first), the column and the product bowl
  out += post(294, 0, 24, 61, 65, { tone: 'mid' }, 36, 0.6);
  const valves = Array.from({ length: 12 }, (_, i) => (i / 12) * 2 * Math.PI).map((a) => [294 + 20 * Math.cos(a), 20 * Math.sin(a)]);
  valves.sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  // the twelve filling valves are drawn by the stage at load (stage.js), to keep the page small
  const r1 = (v) => v.map((q) => Math.round(q * 100) / 100);
  C.VALVES_B = valves.filter(([x, y]) => k.depthOf([x, y, 0], P) < k.depthOf([294, 0, 0], P)).map(r1);
  C.VALVES_F = valves.filter(([x, y]) => k.depthOf([x, y, 0], P) >= k.depthOf([294, 0, 0], P)).map(r1);
  out += g('valvesB', '');
  out += post(294, 0, 6, 65, 96, { tone: 'mid', inner: L(k.sideArc(294, 0, 6, 80, P, 16), { tone: 'faint' }) }, 20);
  out += S(k.cylinder(294, 0, 16, 96, 12, P, 36, 2), { tone: 'hi', crease: 'lo', inner: L(k.sideArc(294, 0, 16, 102, P, 30), { tone: 'faint' }) });
  out += post(294, 0, 10, 108, 110, { tone: 'mid' }, 28, 0.5) + post(294, 0, 1.6, 110, 116, { tone: 'lo' }, 10);
  out += g('valvesF', '');
  return { body: cue('filler', out), front: '' };
})();
const conveyor = (() => {
  const b = BELT;
  let out = '';
  for (const x of [244, 338]) out += box({ x: x - 2, y: b.y - 6, w: 4, d: 2 }, 0, b.z, { tone: 'lo' }, 0.1) + box({ x: x - 2, y: b.y + 4, w: 4, d: 2 }, 0, b.z, { tone: 'lo' }, 0.1);
  out += box({ x: b.x0, y: b.y - 6, w: b.x1 - b.x0, d: 12, r: 1 }, b.z - 4, b.z, { tone: 'mid', inner: L(k.segment([b.x0 + 2, b.y + 6, b.z - 2], [b.x1 - 2, b.y + 6, b.z - 2], P), { tone: 'faint' }) }, 0.4);
  return out;
})();

// ---------------------------------------------------------------- flows (product), drawn as moving petrol dashes
const ROUTE_A = [[-116, 0, PZ], [-2, 0, PZ]];
const ROUTE_B = HOLD;
const flows = [flowPath('fA', ROUTE_A), flowPath('fB', ROUTE_B), flowPath('fC', TOFILL)].join('');
const lineCue = cue('line', [pipe([[-116, 0, PZ], [-101, 0, PZ]]), pipe([[-79, 0, PZ], [-65, 0, PZ]]), pipe([[-47, 0, PZ], [-2, 0, PZ]])].join(''));

// ---------------------------------------------------------------- HUD (stage space, over the camera)
const hud = ['steps', 'badges', 'sep', 'batch', 'trend', 'calc', 'prof', 'pres', 'mass', 'loop', 'lvl'].map((key) => g(key, '', ` data-cue="${key}"`)).join('');

// ---------------------------------------------------------------- the drawing, back to front
const world = [
  hot,
  valve,
  g('vat', vat),
  lineCue,
  pump,
  meter,
  gauge,
  heater,
  pipe([[54, 12, 26], [92, 12, 26]]),
  tt,
  holding,
  ice,
  cooler,
  `<g class="pl-pipe">${pipe(TOFILL)}</g>`,
  filler.body,
  `<g class="pl-flows">${flows}</g>`,
  g('drop', ''),
  conveyor,
  g('bottles', ''),
].join('');

// Static paths written with relative line-tos (the helper from the measuring
// film, as in eng.power.hydraulics): the same points (to 0,1), about a third
// fewer bytes. Only M, L and Z paths at one decimal are rewritten, and each
// rewrite is read back to prove it exact.
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
if (process.argv.includes('--sizes')) for (const [n, v] of Object.entries({ hot, valve, vat, pump, meter, gauge, heater, holding, ice, cooler, filler: filler.body, conveyor, flows })) console.log(n, (compact(v).length / 1024).toFixed(1));
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx): world point p lands at stage x sx (default the centre) in a view w wide
const cam = (p, w, sx = W / 2, sy = H / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round((y + (H / 2 - sy) * (w / W)) * 10) / 10, w]; };
const CAM = [
  { from: cam([72, 0, 84], 680), to: cam([72, 0, 80], 656) },
  { from: cam([-160, 0, 100], 330, 420), to: cam([-150, 0, 96], 300, 430) },
  { from: cam([72, 0, 80], 656), to: cam([72, 0, 76], 640) },
  { from: cam([150, 8, 50], 330, 470, 200), to: cam([150, 8, 50], 300, 470, 200) },
  { from: cam([-60, 0, 56], 260, 460), to: cam([-46, 0, 56], 230, 460), a: 0.5, b: 0.7 },
  { from: cam([30, -10, 72], 300, 470, 210), to: cam([40, -10, 70], 270, 470, 210) },
  { from: cam([-160, 0, 90], 300, 470), to: cam([-160, 0, 86], 270, 470) },
];

// ---------------------------------------------------------------- the film
const DUR = [40, 36, 42, 48, 52, 42, 40];
C.dur = DUR;
const spec = {
  id: 'eng.process.plant',
  title: { nl: 'Een proceslijn lezen', en: 'Reading a process line' },
  lessons: [TYPES, VARS],
  scenes: [
    {
      id: 's1', lesson: TYPES, level: 1, dur: DUR[0], still: 0.9, title: { nl: 'Een rij bouwstenen', en: 'A row of building blocks' },
      beats: [
        { nl: 'Een kleine sapfabriek: van het mengvat links tot de vulmachine rechts.', en: 'A small juice plant: from the mixing vat on the left to the filler on the right.', cues: ['mixer', 'filler'] },
        { nl: 'Elke stap is een {t:Unit operation|unit operation}: mengen, pompen, verhitten, heethouden, koelen.', en: 'Each step is a {t:Unit operation|unit operation}: mixing, pumping, heating, holding, cooling.', cue: { 'Unit operation': 'steps' }, cues: ['badges'] },
        { nl: 'Scheiden is er ook een: filtreren, centrifugeren, destilleren, indampen.', en: 'Separating is one too: filtering, centrifuging, distilling, evaporating.', cues: ['sep'] },
        { nl: 'Een zuivelfabriek of waterbedrijf gebruikt dezelfde bouwstenen, in een andere volgorde.', en: 'A dairy or a water works uses the same building blocks, in a different order.', cues: ['steps'] },
      ],
    },
    {
      id: 's2', lesson: TYPES, level: 1, dur: DUR[1], still: 0.9, title: { nl: 'Batch: één partij', en: 'Batch: one lot' },
      beats: [
        { nl: 'Het mengvat werkt als {t:Batchproces|batchproces}: een vaste hoeveelheid, stap voor stap bewerkt.', en: 'The mixing vat works as a {t:Batch process|batch process}: a fixed amount, processed step by step.', cue: { Batchproces: 'mixer' }, cues: ['batch'] },
        { nl: 'Vullen, mengen, legen: de hele partij krijgt één batchnummer.', en: 'Fill, mix, empty: the whole lot gets one batch number.', cues: ['batch', 'mixer'] },
        { nl: 'Flexibel en traceerbaar. Maar vullen, legen en reinigen leveren niks op.', en: 'Flexible and traceable. But filling, emptying and cleaning produce nothing.', cues: ['batch'] },
      ],
    },
    {
      id: 's3', lesson: TYPES, level: 1, dur: DUR[2], still: 0.9, title: { nl: 'Continu: non-stop', en: 'Continuous: non-stop' },
      beats: [
        { nl: 'Vanaf de pomp is het een {t:Continu proces|continu proces}: het sap stroomt non-stop in en uit.', en: 'From the pump on it is a {t:Continuous process|continuous process}: the juice flows in and out non-stop.', cue: { 'Continu proces': 'line' }, cues: ['hold'] },
        { nl: 'Draait de lijn, dan is er een {t:Stationaire toestand|stationaire toestand}: overal gelijke waarden.', en: 'Once the line runs, it is at {t:Steady state|steady state}: the same values everywhere.', cue: { 'Stationaire toestand': 'trend' } },
        { nl: 'Opstarten en stoppen duurt uren en geeft product buiten spec. Zo’n lijn stopt liever niet.', en: 'Starting up and shutting down take hours and make off-spec product. Such a line hates stopping.', cues: ['trend'] },
        { nl: 'Veel fabrieken combineren: een batchgewijs mengvat voedt een continue lijn.', en: 'Many plants combine them: a batch mixing vat feeds a continuous line.', cues: ['mixer', 'line'] },
      ],
    },
    {
      id: 's4', lesson: TYPES, level: 1, dur: DUR[3], still: 0.9, title: { nl: 'Hoe lang in de buis', en: 'How long in the tube' },
      beats: [
        { nl: 'De heethoudbuis: {n:0.1} m³ inhoud, {n:12} m³ per uur erdoorheen.', en: 'The holding tube: {n:0.1} m³ inside, {n:12} m³ per hour flowing through.', cues: ['hold'] },
        { nl: '{t:Verblijftijd|Verblijftijd} = volume / debiet: {n:0.1} / {n:12} uur = {n:30} seconden.', en: '{t:Residence time|Residence time} = volume / flow: {n:0.1} / {n:12} hours = {n:30} seconds.', cue: { Verblijftijd: 'hold' }, cues: ['calc'] },
        { nl: 'Bij {n:18} m³ per uur: {n:20} seconden. Precies het minimum, zonder marge.', en: 'At {n:18} m³ per hour: {n:20} seconds. Exactly the minimum, no margin.', cues: ['calc'] },
        { nl: 'In het midden stroomt het sap sneller: ontwerp op het snelste deeltje.', en: 'In the centre the juice flows faster: design on the fastest particle.', cues: ['prof'] },
      ],
    },
    {
      id: 's5', lesson: VARS, level: 1, dur: DUR[4], still: 0.9, title: { nl: 'Druk en debiet', en: 'Pressure and flow' },
      beats: [
        { nl: 'Vier grootheden sturen de lijn: druk, temperatuur, debiet en niveau.', en: 'Four variables run the line: pressure, temperature, flow and level.', cues: ['gauge', 'tt', 'ft', 'lt'] },
        { nl: 'De manometer toont {t:Overdruk|overdruk}: ten opzichte van de buitenlucht, in bar(g).', en: 'The gauge shows {t:Gauge pressure|gauge pressure}: relative to the air around, in bar(g).', cue: { Overdruk: 'gauge' }, cues: ['pres'] },
        { nl: '{t:Absolute druk|Absolute druk} telt vanaf vacuüm: {n:2} bar(g) is ongeveer {n:3} bar(a).', en: '{t:Absolute pressure|Absolute pressure} counts from vacuum: {n:2} bar(g) is about {n:3} bar(a).', cue: { 'Absolute druk': 'pres' } },
        { nl: 'Een {t:Coriolismeter|Coriolismeter} laat een buis trillen en meet direct het {t:Massadebiet|massadebiet}.', en: 'A {t:Coriolis meter|Coriolis meter} vibrates a tube and measures the {t:Mass flow|mass flow} directly.', cue: { Coriolismeter: 'ft', Massadebiet: 'mass' } },
        { nl: 'Massadebiet = volumedebiet × dichtheid. Vraag wat een meter echt toont.', en: 'Mass flow = volume flow × density. Ask what a meter really shows.', cues: ['mass'] },
      ],
    },
    {
      id: 's6', lesson: VARS, level: 1, dur: DUR[5], still: 0.9, title: { nl: 'Temperatuur in een regelkring', en: 'Temperature in a control loop' },
      beats: [
        { nl: 'Na de warmtewisselaar meet een {t:Pt100|Pt100} de temperatuur: een platina weerstand.', en: 'After the heat exchanger a {t:Pt100|Pt100} measures the temperature: a platinum resistor.', cue: { Pt100: 'tt' } },
        { nl: 'Hij zit in een beschermhuls. Bij weinig stroming loopt hij achter.', en: 'It sits in a thermowell. In a slow flow it lags behind.', cues: ['tt'] },
        { nl: 'Op de P&ID: transmitter TT, regelaar TIC, regelklep TV op het hete water.', en: 'On the P&ID: transmitter TT, controller TIC, control valve TV on the hot water.', cues: ['loop', 'tv'] },
        { nl: 'Meten, vergelijken met de gewenste waarde, de klep bijsturen: een regelkring.', en: 'Measure, compare with the setpoint, adjust the valve: a control loop.', cues: ['loop', 'tv', 'tt'] },
      ],
    },
    {
      id: 's7', lesson: VARS, level: 1, dur: DUR[6], still: 0.9, title: { nl: 'Een meter die op water staat', en: 'A meter set for water' },
      beats: [
        { nl: 'De niveaumeter van het mengvat meet de druk onderin, ingesteld op water: {n:1000} kg/m³.', en: 'The vat’s level meter measures the pressure at the bottom, set up for water: {n:1000} kg/m³.', cues: ['lt'] },
        { nl: 'Siroop van {n:1250} kg/m³, echt {n:2.0} m hoog: onderin {n:24525} Pa.', en: 'Syrup of {n:1250} kg/m³, really {n:2.0} m deep: {n:24525} Pa at the bottom.', cues: ['lvl', 'lt'] },
        { nl: 'De meter deelt door de dichtheid van water en toont {n:2.5} m: een halve meter te hoog.', en: 'The meter divides by the density of water and shows {n:2.5} m: half a metre too high.', cues: ['lvl'] },
        { nl: 'De massa klopt wel. Voer de juiste dichtheid in, of lees de tank af in kilo’s.', en: 'The mass is still right. Enter the right density, or read the tank in kilograms.', cues: ['lvl'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson text,
// so this explains fully. No "/", "&", "×", "=" or units as symbols in the
// spoken text: units are written out, P&ID is said as "leiding- en
// instrumentatieschema" and the ISA tags stay on the card. Terms as in the
// films eng.drawings.reading and eng.lines.control (transmitter, regelaar,
// regelklep, sensor) and the permit and LOTO films.
// Words checked with espeak-ng phonemes (Piper's own bridge,
// films/_kit/voice-ab/phon.py with nl_NL-alex-medium): batch (read "batx"; only its compounds are respelled, so the lone word is avoided),
// unit operation (read "uunit oopiraasjon"), Coriolis (stress on Co-) and
// continu, continue (stress on con-) get Dutch spoken forms in
// films/_kit/timeline.mjs (SAY); no other film says them in Dutch. Kept out of
// the Dutch narration: setpoint (read "set-po-int"; said "de gewenste waarde").
// Pt100 is read "pee tee honderd", off-spec, stationaire, verblijftijd,
// massadebiet, overdruk and absolute are read right.
const SAY = [
  [ // s1 a row of building blocks
    { nl: 'Dit is een kleine sapfabriek. Links staat een mengvat, rechts een vulmachine, en daartussen stroomt het sap door een rij apparaten.',
      en: 'This is a small juice plant. On the left stands a mixing vat, on the right a filler, and in between the juice flows through a row of equipment.' },
    { nl: 'Elke stap in die rij is een {t:Unit operation|unit operation}: een fysische basisstap die in elke procesfabriek terugkomt. Hier zijn dat mengen, pompen, verhitten, heethouden en koelen.',
      en: 'Each step in that row is a {t:Unit operation|unit operation}: a basic physical step that comes back in every process plant. Here they are mixing, pumping, heating, holding and cooling.' },
    { nl: 'Ook scheiden is een unit operation. Dat kan op veel manieren: filtreren, centrifugeren, destilleren, of indampen, waarbij je water wegkookt om een vloeistof in te dikken.',
      en: 'Separating is a unit operation too. It has many forms: filtering, centrifuging, distilling, or evaporating, where you boil off water to concentrate a liquid.' },
    { nl: 'Een zuivelfabriek, een chemische fabriek en een waterbedrijf gebruiken dezelfde bouwstenen, alleen in een andere volgorde.',
      en: 'A dairy, a chemical plant and a water works use the same building blocks, just in a different order.' },
  ],
  [ // s2 batch
    { nl: 'Kijk eerst naar het mengvat. Het werkt als {t:Batchproces|batchproces}: een vaste hoeveelheid gaat erin, wordt stap voor stap bewerkt, en komt er als één partij weer uit.',
      en: 'Look at the mixing vat first. It works as a {t:Batch process|batch process}: a fixed amount goes in, is processed step by step, and comes out again as one lot.' },
    { nl: 'Vullen, mengen, en dan het vat leeg. Die hele partij krijgt één batchnummer, met één registratie van wat erin ging en wat er gebeurde.',
      en: 'Fill it, mix it, then empty the vat. That whole lot gets one batch number, with one record of what went in and what happened.' },
    { nl: 'Dat is flexibel en makkelijk te traceren, en het past bij veel recepten en kleine volumes. Het nadeel: vullen, legen en reinigen leveren niks op, en elke partij is net iets anders.',
      en: 'That is flexible and easy to trace, and it suits many recipes and small volumes. The downside: filling, emptying and cleaning produce nothing, and every batch comes out a little different.' },
  ],
  [ // s3 continuous
    { nl: 'Vanaf de pomp is het een {t:Continu proces|continu proces}. Het sap stroomt de hele tijd in en uit: door de warmtewisselaar, de heethoudbuis en de koeler, naar de vulmachine.',
      en: 'From the pump on it is a {t:Continuous process|continuous process}. The juice flows in and out all the time: through the heat exchanger, the holding tube and the cooler, to the filler.' },
    { nl: 'Draait de lijn eenmaal, dan zit ze in een {t:Stationaire toestand|stationaire toestand}. De temperaturen, drukken en debieten blijven overal gelijk, uur na uur, en er hoopt nergens iets op.',
      en: 'Once the line runs, it sits at {t:Steady state|steady state}. The temperatures, pressures and flows stay the same everywhere, hour after hour, and nothing builds up.' },
    { nl: 'Maar opstarten en stoppen duurt uren, en wat je in die tijd maakt, voldoet niet aan de specificatie. Dat heet off-spec. Zulke lijnen stoppen dus liever niet.',
      en: 'But starting up and shutting down take hours, and what you make in that time does not meet the specification. That is called off-spec. So lines like this hate stopping.' },
    { nl: 'Veel fabrieken combineren de twee, zoals hier: een mengvat dat batchgewijs werkt, voedt een continue lijn.',
      en: 'Many plants combine the two, as here: a mixing vat that works in batches feeds a continuous line.' },
  ],
  [ // s4 residence time
    { nl: 'Na het verhitten moet het sap een vaste tijd heet blijven, om ziektekiemen te doden. Daarvoor stroomt het door de heethoudbuis: {n:0.1} kubieke meter inhoud, met {n:12} kubieke meter per uur erdoorheen.',
      en: 'After heating, the juice must stay hot for a set time, to kill germs. So it flows through the holding tube: {n:0.1} cubic metres inside, with {n:12} cubic metres per hour flowing through.' },
    { nl: 'Hoe lang het sap erin zit, is de {t:Verblijftijd|verblijftijd}: het volume gedeeld door het debiet. Dat geeft {n:30} seconden, en het voedselveiligheidsplan eist er minstens {n:20}.',
      en: 'How long the juice stays in it is the {t:Residence time|residence time}: the volume divided by the flow. That gives {n:30} seconds, and the food safety plan demands at least {n:20}.' },
    { nl: 'Wil productie naar {n:18} kubieke meter per uur, dan wordt de verblijftijd {n:20} seconden: precies op het minimum, zonder marge.',
      en: 'If production wants {n:18} cubic metres per hour, the residence time becomes {n:20} seconds: exactly on the minimum, with no margin.' },
    { nl: 'En dat is nog een gemiddelde. In het midden van de buis stroomt het sap sneller, dus daar zit het er korter in. Daarom ontwerp je op het snelste deeltje. Meer output vraagt een langere buis, niet alleen een snellere pomp.',
      en: 'And that is only an average. In the centre of the tube the juice flows faster, so it spends less time there. That is why you design on the fastest particle. More output needs a longer tube, not just a faster pump.' },
  ],
  [ // s5 pressure and flow
    { nl: 'Om zo’n lijn te sturen, meet je vier grootheden: druk, temperatuur, debiet en niveau.',
      en: 'To run a line like this, you measure four variables: pressure, temperature, flow and level.' },
    { nl: 'Na de pomp zit een manometer. Zoals bijna alle manometers toont hij {t:Overdruk|overdruk}: de druk ten opzichte van de buitenlucht.',
      en: 'After the pump sits a pressure gauge. Like almost every gauge, it shows {t:Gauge pressure|gauge pressure}: the pressure relative to the air around it.' },
    { nl: 'De {t:Absolute druk|absolute druk} telt vanaf volledig vacuüm. Op zeeniveau drukt de lucht zelf al zo’n {n:1} bar. Wijst de manometer {n:2} bar aan, dan is de absolute druk dus ongeveer {n:3} bar.',
      en: 'The {t:Absolute pressure|absolute pressure} counts from a perfect vacuum. At sea level the air itself presses about {n:1} bar. So if the gauge reads {n:2} bar, the absolute pressure is about {n:3} bar.' },
    { nl: 'Verderop zit een {t:Coriolismeter|Coriolismeter}. Hij laat een buis trillen en leest de verdraaiing die de stromende massa geeft. Zo meet hij direct het {t:Massadebiet|massadebiet}, in kilo’s per uur.',
      en: 'Further on sits a {t:Coriolis meter|Coriolis meter}. It vibrates a tube and reads the twist the flowing mass causes. So it measures the {t:Mass flow|mass flow} directly, in kilograms per hour.' },
    { nl: 'Andere meters tellen volume. Het massadebiet is dan het volumedebiet maal de dichtheid: één kubieke meter water per uur is zo’n {n:1000} kilo. Recepten rekenen in kilo’s, dus vraag wat een meter echt toont.',
      en: 'Other meters count volume. The mass flow is then the volume flow times the density: one cubic metre of water per hour is about {n:1000} kilograms. Recipes work in kilograms, so ask what a meter really shows.' },
  ],
  [ // s6 temperature and the loop
    { nl: 'Na de warmtewisselaar meet een {t:Pt100|Pt100} de temperatuur van het sap: een platina weerstand, nauwkeurig op een paar tiende graad.',
      en: 'After the heat exchanger a {t:Pt100|Pt100} measures the temperature of the juice: a platinum resistor, accurate to a few tenths of a degree.' },
    { nl: 'De sensor zit in een beschermhuls in de leiding. Bij weinig stroming loopt hij daardoor minuten achter, en reageert de regeling te laat.',
      en: 'The sensor sits in a thermowell in the pipe. In a slow flow it can lag by minutes, and the control reacts too late.' },
    { nl: 'Want die temperatuur wordt geregeld. Op het leiding- en instrumentatieschema zie je drie rondjes: de transmitter, de regelaar in het besturingssysteem, en de regelklep op het hete water.',
      en: 'Because that temperature is controlled. On the piping and instrumentation diagram you see three circles: the transmitter, the controller in the control system, and the control valve on the hot water.' },
    { nl: 'De transmitter stuurt zijn meting naar de regelaar. Die vergelijkt haar met de gewenste waarde, en zet de klep verder open of dicht. Meten, vergelijken, bijsturen: dat is een regelkring.',
      en: 'The transmitter sends its reading to the controller. That compares it with the setpoint, the value you want, and opens or closes the valve a little. Measure, compare, adjust: that is a control loop.' },
  ],
  [ // s7 the syrup level
    { nl: 'Tot slot het niveau in het mengvat. Onderin zit een druksensor: hij meet eigenlijk het gewicht van de vloeistof erboven. Hij is ingesteld op water, {n:1000} kilo per kubieke meter.',
      en: 'Finally, the level in the mixing vat. At the bottom sits a pressure sensor: it really measures the weight of the liquid above it. It is set up for water, {n:1000} kilograms per cubic metre.' },
    { nl: 'Nu staat er siroop in, van {n:1250} kilo per kubieke meter, echt {n:2.0} meter hoog. De druk onderin is dan {n:24525} pascal.',
      en: 'Now it holds syrup of {n:1250} kilograms per cubic metre, really {n:2.0} metres deep. The pressure at the bottom is then {n:24525} pascals.' },
    { nl: 'De meter deelt die druk door de dichtheid van water, en toont {n:2.5} meter. Een halve meter te hoog: het hoog-niveaualarm kan te vroeg afgaan.',
      en: 'The meter divides that pressure by the density of water, and shows {n:2.5} metres. Half a metre too high: the high-level alarm may trip early.' },
    { nl: 'De massa die de meter aangeeft, klopt wel. Voer dus de juiste dichtheid in, of lees de tank af in kilo’s.',
      en: 'The mass the meter implies is still right. So enter the right density, or read the tank in kilograms.' },
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
// no symbol the voice would read aloud in the spoken text
for (const [si, sc] of SAY.entries()) for (const b of sc) for (const lang of ['nl', 'en']) if (/[/&×=]/.test(b[lang])) throw new Error(`narration: a symbol in scene ${si + 1} (${lang})`);

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.pl-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pl-plate{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.5}
.pl-glassF{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.6}
.pl-glass{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.pl-prod{fill:color-mix(in srgb,var(--fp-accent) 55%,transparent);stroke:none}
.pl-screen{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.pl-dial{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.4}
.pl-led{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.4}
.pl-led[data-on]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.pl-needle{fill:none;stroke:var(--anatomy-hi);stroke-width:1.1;stroke-linecap:round}
.pl-pipeO{fill:none;stroke:var(--anatomy-lo);stroke-width:4.6px;stroke-linejoin:round;stroke-linecap:butt}
.pl-pipeI{fill:none;stroke:var(--anatomy-shade-3);stroke-width:2.6px;stroke-linejoin:round;stroke-linecap:butt}
.pl-end{fill:var(--anatomy-mid);stroke:none}
.pl-flow{fill:none;stroke:var(--fp-accent);stroke-width:1.4px;stroke-dasharray:2.2 3.6;stroke-linecap:round}
[data-cue][data-on] .pl-pipeO{stroke:var(--fp-accent)}
[data-cue][data-on] .pl-end{fill:var(--fp-accent)}
.pl-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pl-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pl-big{fill:var(--anatomy-strong);font-family:var(--anatomy-mono);font-weight:700}
.pl-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pl-mono{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.pl-wall{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:1.4}
.pl-liq{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:none}
.pl-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pl-dim{fill:none;stroke:var(--anatomy-lo);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pl-sig{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-dasharray:6 5}
.pl-acc{fill:var(--fp-accent);stroke:none}
.pl-accl{fill:none;stroke:var(--fp-accent);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.pl-bub{fill:var(--anatomy-shade-3);stroke:var(--anatomy-hi);stroke-width:2}
.pl-badge{fill:var(--fp-accent);stroke:none}
.pl-badgeT{fill:var(--fp-on-accent);font-family:var(--anatomy-mono);font-weight:700}
.pl-drop{fill:var(--fp-accent);stroke:var(--anatomy-card);stroke-width:.6}
.fp-meter{fill:var(--anatomy-mid)}
.fp-meter[data-top]{fill:var(--fp-accent)}
[data-cue][data-on] .pl-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .pl-bub{stroke:var(--fp-accent)}
[data-cue][data-on] .pl-big{fill:var(--fp-accent-text)}
`;

const label = {
  nl: 'Een kleine sapfabriek van links naar rechts: een mengvat op poten met roerwerkaandrijving, mangat, inlaat, kijkglas en onderin een niveaumeter; een pomp in de leiding; een Coriolismeter met transmitterkop; een manometer; een platenwarmtewisselaar met de leidingen voor heet water en een regelklep; een Pt100 in een beschermhuls; een heethoudbuis in zigzag op twee steunen; een platenkoeler met ijswaterleidingen; en een vulmachine met carrousel, transportband en flessen. Kaarten tonen de stappen, de fasen van een batch, een trend in stationaire toestand, de som van de verblijftijd met het snelheidsprofiel in de buis, overdruk en absolute druk, het massadebiet, een regelkring op een P&ID en de som van het siroopniveau.',
  en: 'A small juice plant from left to right: a mixing vat on legs with an agitator drive, manhole, inlet, sight glass and a level meter at the bottom; an in-line pump; a Coriolis meter with its transmitter head; a pressure gauge; a plate heat exchanger with its hot-water pipes and a control valve; a Pt100 in a thermowell; a zigzag holding tube on two stands; a plate cooler with ice-water pipes; and a filler with a carousel, a conveyor and bottles. Cards show the steps, the phases of a batch, a steady-state trend, the residence-time sum with the velocity profile in the tube, gauge and absolute pressure, mass flow, a control loop on a P&ID and the syrup level sum.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
