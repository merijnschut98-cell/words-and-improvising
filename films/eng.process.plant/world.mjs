// Dev tool, not shipped. The shared world of the two Procestechniek films
// eng.process.plant (process types) and eng.process.measure (measuring the
// process variables): one small juice line on a floor, drawn once and used by
// both builds, with the shared stage script (stage.js in this folder) that
// draws the cards of both films.
//
// One small juice plant on a floor: a batch mixing vat on legs (agitator
// drive, manhole, inlet, a sight glass and a pressure-type level transmitter
// at the bottom), an in-line pump, a Coriolis meter with its transmitter
// head, a pressure gauge on a stub, a plate heat exchanger (frame, plate pack,
// carrying and guide bar, tie bolts) with its hot-water supply and return and
// a pneumatic control valve, a Pt100 head in a thermowell, a serpentine
// holding tube on two stands, a small plate cooler with its ice-water pipes,
// and a rotary filler on a cabinet with a conveyor and bottles.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
export const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

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
const C = { PZ, VAT, SG, LT, GAUGE, TUBE, BELT };

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
// the inlet on top of the vat, for the scenes where the vat runs continuously (in at the top, out at the bottom)
const ROUTE_I = [[VAT.c[0] + 30, VAT.c[1] - 14, 196], [VAT.c[0] + 16, VAT.c[1] - 14, 196], [VAT.c[0] + 16, VAT.c[1] - 14, VAT.z1 + 16]];
const flows = [flowPath('fI', ROUTE_I), flowPath('fA', ROUTE_A), flowPath('fB', ROUTE_B), flowPath('fC', TOFILL)].join('');
const lineCue = cue('line', [pipe([[-116, 0, PZ], [-101, 0, PZ]]), pipe([[-79, 0, PZ], [-65, 0, PZ]]), pipe([[-47, 0, PZ], [-2, 0, PZ]])].join(''));


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

// ---------------------------------------------------------------- what a film build takes
export { W, H, P, C };
// the whole picture with the film's own cards (HUD groups in stage space, over the camera)
export const svgOf = (huds) => compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', huds.map((key) => g(key, '', ` data-cue="${key}"`)).join(''))}</svg>`);

// ---------------------------------------------------------------- cameras (one move per scene)
// cam(p, w, sx): world point p lands at stage x sx (default the centre) in a view w wide
export const cam = (p, w, sx = W / 2, sy = H / 2) => { const [x, y] = at(p); return [Math.round((x + (W / 2 - sx) * (w / W)) * 10) / 10, Math.round((y + (H / 2 - sy) * (w / W)) * 10) / 10, w]; };

// the page script: the kit, the preamble (projection, world constants with the
// film's own, its cameras), the shared stage with the film's own scenes
// (ownStage, its stage.js) put in at its marker, and the beat warp
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
export const stageScriptOf = (own, CAM, ownStage) => {
  const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify({ ...C, ...own })};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
  const common = readFileSync(join(HERE, 'stage-common.js'), 'utf8');
  if (!common.includes('/*@SCENES@*/')) throw new Error('stage-common.js lost its SCENES marker');
  const stage = common.replace('/*@SCENES@*/', () => readFileSync(ownStage, 'utf8'));
  return kitScript() + '\n' + preamble + lean(stage) + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');
};
export const kitCss = k.ISO_CSS;

export const css = `
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
.pl-meter{fill:var(--anatomy-mid)}
.pl-meter[data-top]{fill:var(--fp-accent)}
.pl-mid{fill:var(--anatomy-mid);stroke:none}
.pl-deadM{fill:var(--anatomy-mid);opacity:.25}
.pl-dead{fill:var(--anatomy-mid);opacity:.55}
[data-cue][data-on] .pl-line{stroke:var(--fp-accent);stroke-width:2.6}
[data-cue][data-on] .pl-bub{stroke:var(--fp-accent)}
[data-cue][data-on] .pl-big{fill:var(--fp-accent-text)}
`;
