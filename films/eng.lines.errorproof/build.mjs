// Dev tool, not shipped. Builds the explainer film "Foutvrij maken /
// Error-proofing" for the topic Foutvrij maken of Lijnen en automatisering:
// errors (level 1, "how it works"), pokayoke (2), sensors (3) and detection (4).
//
//   node films/eng.lines.errorproof/build.mjs            build the page
//   node films/eng.lines.errorproof/build.mjs --audit    build, then report pace, terms and geometry
//
// Writes src/content/courses/films/eng.lines.errorproof.html: one offline page
// with the anatomy kit, the stage script and the player inlined. Storyboard:
// docs/superpowers/plans/2026-11-07-v14-explainer-films.md, section 3.4.
//
// One assembly station on a work table, the world of the figure
// eng.lines.pokayoke grown into a whole cell. Left at the back two bins with
// look-alike brackets (6 and 8 mm), each with a pick-to-light lamp and a hand
// beam across its opening. In the middle the fixture: a plate with a back rail,
// an end stop and an orientation pin that fits only the housing's chamfered
// corner, a through-beam pair across the housing and a swing clamp that holds
// the housing until the PLC's interlock releases it (the lessons' "the pallet
// does not go on" / "the machine lets the product go only when the check is
// OK"). Above it a sensor bridge (an inductive sensor over the bracket, a
// second sensor over the plastic clip), a press that presses in a bearing and a
// torque-controlled nutrunner on a two-link arm that drives the 8 screws. At the
// back right the PLC cabinet with its HMI, signal tower and bypass key. In front
// a reject bin, a plate with reference parts and the outfeed tray. Panels in
// stage space carry the counts, the force-displacement curve, the PFMEA row,
// the escapes and the reaction plan.
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
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// Asserted against the worked examples of the four lessons (the build fails if
// a value drifts); the captions' and the narration's {n:...} numbers are then
// checked against the Dutch lesson text by defineFilm.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
// errors: brackets of 6 and 8 mm; 1 in 5.000 gets the wrong one
const BRACKETS = [6, 8];
const ONE_IN = 5000;
const PPM = 1e6 / ONE_IN;
assert(PPM === 200, '1.000.000 / 5.000 = 200 ppm');
// pokayoke: 8 screws; 1 in 2.000 missing with a hand driver; by eye 80–90 %,
// 400 ppm made with 85 % caught → 60 ppm out; a camera with 3 % false rejects
const SCREWS = 8;
const EYE = 0.85;
const MADE_PK = 400;
assert(near(MADE_PK * (1 - EYE), 60), '400 ppm × 15 % = 60 ppm');
const FALSE_REJECT = 3;
// detection: 1.000 ppm made, 99,9 % caught automatically → 1 ppm, by eye → 150 ppm;
// red rabbit OK at 06:00, passed at 14:00, 60 parts an hour → 480 suspect
const MADE_DT = 1000;
const AUTO = 0.999;
assert(near(MADE_DT * (1 - AUTO), 1) && near(MADE_DT * (1 - EYE), 150), '1.000 ppm: 1 ppm automatic, 150 ppm by eye');
const RR = { ok: 6, fail: 14, rate: 60 };
const SUSPECT = (RR.fail - RR.ok) * RR.rate;
assert(SUSPECT === 480, '(14 − 6) h × 60 = 480 parts');

// ---------------------------------------------------------------- the world (about 1 mm a unit)
// x to the right, y toward the operator, z up; the table top is z = 0.
const W = 640;
const H = 400;
const TABLE = { x: -275, y: -128, w: 545, d: 256, r: 3 };
const FXP = { x: -72, y: -52, w: 144, d: 104, r: 2 }; // fixture plate
const FZ = 10; // fixture plate top, the housing's floor
const HOUSE = { x: -50, y: -35, w: 100, d: 70, cham: 12, h: 32 }; // housing, chamfered at (−50, −35)
const HT = FZ + HOUSE.h; // housing top
const PIN = { x: -46.5, y: -31.5, r: 2.4, top: FZ + 16 };
const BR = { x: -34, y: -13, w: 50, d: 26, tab: 5, tabH: 20 }; // bracket plate and its tab
const THICK = { 6: 4, 8: 5.6 }; // drawn plate thickness of the 6 and 8 mm brackets
const CLIP = { x: 3, y: -6, w: 11, d: 12, h: 6 };
const SCREW_AT = [[-40, -26], [-14, -26], [14, -26], [40, -26], [40, 26], [14, 26], [-14, 26], [-40, 26]];
assert(SCREW_AT.length === SCREWS, 'eight screw holes');
const BEAR = { x: 35, y: 0, r: 8 };
const BINS = [{ x: -258, y: -110, w: 58, d: 60 }, { x: -192, y: -110, w: 58, d: 60 }];
const BIN_H = 34;
const REJ = { x: -262, y: 18, w: 112, d: 96 };
const REJ_H = 28;
const REF = { x: -140, y: 64, w: 104, d: 46, r: 1.5 };
const TRAY = { x: 96, y: -12, w: 150, d: 112, r: 1.5 };
const PRESS = { x: BEAR.x, y: -96, top: 172, cyl: [118, 160], rest: 86 };
const SB = { x: -16, y: -96, z: 84 }; // sensor bridge post, arm height
const SENS = { A: [-16, 0], B: [8.5, 0] };
const CLAMP = { x: 61, y: 45, z: HT + 2 };
const PLC = { x: 140, y: -120, w: 74, d: 34, h: 132 };
const NUT = { x: -118, y: -112, z: 196, l1: 124, l2: 124, park: [-96, -36] };
const TRAYSPOT = [171, 44];
const REJSPOT = [REJ.x + REJ.w / 2, REJ.y + REJ.d / 2];
assert(REJ.w > HOUSE.w && REJ.d > HOUSE.d && TRAY.w > HOUSE.w && TRAY.d > HOUSE.d, 'a housing fits the reject bin and the tray');
assert(Math.hypot(PIN.x - HOUSE.x, PIN.y - HOUSE.y) < HOUSE.cham && (PIN.x + PIN.y) - (HOUSE.x + HOUSE.y + HOUSE.cham) < -PIN.r * Math.SQRT2 * 0.9, 'the pin stands in the chamfered corner');
assert(Math.hypot(NUT.park[0] - NUT.x, NUT.park[1] - NUT.y) < NUT.l1 + NUT.l2, 'the nutrunner reaches its park');
for (const [x, y] of SCREW_AT) assert(Math.hypot(x - NUT.x, y - NUT.y) < NUT.l1 + NUT.l2 - 4, 'the nutrunner reaches every screw');

const FIT = [...k.boxCorners(TABLE, -24, 0), [PLC.x + PLC.w, PLC.y, PLC.h + 30], [PRESS.x, PRESS.y, PRESS.top], [NUT.x, NUT.y, NUT.z + 8]];
const P = k.fitProjection(FIT, W, H, { pad: 6, azimuth: 56, elevation: 30 });
const at = (p) => k.iso(p, P);
const L = (d, style) => k.lineSvg(d, style);
const Dt = (pts, style) => k.dotsSvg(pts, style);
const S = (paths, style = {}) => k.solidSvg(paths, { tone: 'mid', ...style });
const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 2) => S(k.slabOf({ r: 1, ...plan }, z0, z1 - z0, P, steps, bevel), style);
const post = (cx, cy, r, z0, z1, style = {}, steps = 24, bevel = 0) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
const seam = (plan, z, inset = 3) => L(k.sideSeam({ r: 1, ...plan }, z, P, inset), { tone: 'faint' });
const g = (key, body) => `<g data-k="${key}">${body}</g>`;
const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;
const hexHead = (cx, cy, z, r = 2.2) => L(k.ring(cx, cy, r, z, P, 6), { tone: 'lo' }) + Dt([at([cx, cy, z])], { size: 0.4, tone: 'hi' });
const faceY = (x, y, z, text, size = 6, tone = 'mid', anchor = 'start') => k.faceTextSvg(k.sideMatrix([x, y], z, P, 'left'), text, { size, tone, anchor });

// ---------------------------------------------------------------- the table
const table = (() => {
  const ticks = k.sideTicks(TABLE.x + 20, TABLE.x + TABLE.w - 20, 5, 5, TABLE.y + TABLE.d, -1, [1.8, 3.4], P);
  const holes = [];
  for (let x = TABLE.x + 30; x < TABLE.x + TABLE.w - 20; x += 40) for (const y of [TABLE.y + 16, TABLE.y + TABLE.d - 16]) holes.push(k.ring(x, y, 1.6, 0, P, 10));
  return `<path class="iso-halo" d="${k.haloOf(k.insetPlan(TABLE, -3), -24, 2, P)}"/>`
    + box(TABLE, -24, 0, { tone: 'lo', inner: seam(TABLE, -9, 2) }, 0.6, 3)
    + L(k.planOutline(k.insetPlan(TABLE, 6), 0, P, 3), { tone: 'faint' })
    + L(holes.join(''), { tone: 'faint' })
    + L(ticks.minor, { tone: 'lo' }) + L(ticks.major, { tone: 'mid' });
})();

// ---------------------------------------------------------------- the bins with pick-to-light
function binParts(b, i) {
  const t = 2.4;
  const floor = box({ x: b.x + t, y: b.y + t, w: b.w - 2 * t, d: b.d - 2 * t, r: 0.3 }, 0, 2, { tone: 'lo' }, 0, 1);
  const back = box({ x: b.x, y: b.y, w: b.w, d: t, r: 0.3 }, 0, BIN_H, {}, 0, 1)
    + box({ x: b.x, y: b.y + t, w: t, d: b.d - t, r: 0.3 }, 0, BIN_H, {}, 0, 1);
  // three brackets lying in the bin: the 8 mm ones are a little thicker
  const th = THICK[BRACKETS[i]];
  const pile = [[-4, -6, 2], [3, 4, 2 + th], [-2, 10, 2]].map(([dx, dy, z]) => {
    const cx = b.x + b.w / 2 + dx;
    const cy = b.y + b.d / 2 + dy - 6;
    return box({ x: cx - 18, y: cy - 9, w: 36, d: 18, r: 0.6 }, z, z + th, { tone: 'hi', crease: 'lo' }, 0.2, 2)
      + L(k.ring(cx - 9, cy, 2.4, z + th, P, 14) + k.ring(cx + 9, cy, 2.4, z + th, P, 14), { tone: 'lo' });
  }).join('');
  const right = box({ x: b.x + b.w - t, y: b.y + t, w: t, d: b.d - t, r: 0.3 }, 0, BIN_H, {}, 0, 1);
  const fy = b.y + b.d;
  const front = box({ x: b.x + t, y: fy - t, w: b.w - 2 * t, d: t, r: 0.3 }, 0, BIN_H, {}, 0, 1)
    + `<path class="ep-plate" d="${k.pathOf([[b.x + 8, fy, 24], [b.x + 30, fy, 24], [b.x + 30, fy, 14], [b.x + 8, fy, 14]].map(at), true)}"/>`
    + faceY(b.x + 10, fy, 16.2, `${BRACKETS[i]} mm`, 6.2, 'hi');
  // the pick-to-light module on the front wall: housing, lamp lens and a push button
  const m = { x: b.x + b.w - 22, y: fy - 4, w: 18, d: 8, r: 0.8 };
  const module = box(m, BIN_H - 2, BIN_H + 8, { tone: 'mid' }, 0.3, 2)
    + post(m.x + m.w - 5, fy + 1.2, 1.6, BIN_H + 8, BIN_H + 9.2, { tone: 'hi' }, 14);
  const lens = `<path class="ep-lens" d="${k.pathOf(k.circleRing(0, 0, 3.4, 20).map(([u, v]) => at([m.x + 6 + u, fy + 0.2, BIN_H + 3 + v])), true)}"/>`;
  // the hand beam across the opening: an emitter and a receiver on the side walls
  const ey = b.y + b.d * 0.62;
  const eyes = box({ x: b.x + t, y: ey - 2.5, w: 4, d: 5, r: 0.4 }, BIN_H - 6, BIN_H - 1, { tone: 'hi' }, 0, 1)
    + box({ x: b.x + b.w - t - 4, y: ey - 2.5, w: 4, d: 5, r: 0.4 }, BIN_H - 6, BIN_H - 1, { tone: 'hi' }, 0, 1);
  return { floor, back, pile, right, front, module, lens, eyes, ey };
}
const BP = BINS.map(binParts);

// ---------------------------------------------------------------- the fixture
const fixture = (() => {
  const bolts = k.corners(FXP, 6);
  const plate = box(FXP, 0, FZ, { inner: seam(FXP, 4, 3) }, 0.6, 3)
    + L(bolts.map(([x, y]) => k.ring(x, y, 2.4, FZ, P, 12)).join(''), { tone: 'lo' })
    + Dt(bolts.map(([x, y]) => at([x, y, FZ])), { size: 0.45 })
    + L(k.planOutline({ x: HOUSE.x - 1, y: HOUSE.y - 1, w: HOUSE.w + 2, d: HOUSE.d + 2, r: 0.5 }, FZ, P, 2), { tone: 'faint' });
  const rail = box({ x: -46, y: -43, w: 92, d: 6, r: 0.4 }, FZ, FZ + 8, { tone: 'hi', crease: 'lo' }, 0, 1)
    + Dt([at([-34, -40, FZ + 8]), at([34, -40, FZ + 8])], { size: 0.4 });
  const stop = box({ x: -58, y: -24, w: 6, d: 50, r: 0.4 }, FZ, FZ + 8, { tone: 'hi', crease: 'lo' }, 0, 1)
    + Dt([at([-55, -16, FZ + 8]), at([-55, 18, FZ + 8])], { size: 0.4 });
  const pin = post(PIN.x, PIN.y, PIN.r + 1.4, FZ, FZ + 2, { tone: 'lo' }, 16)
    + post(PIN.x, PIN.y, PIN.r, FZ + 2, PIN.top, { tone: 'hi', crease: 'none' }, 16) + Dt([at([PIN.x, PIN.y, PIN.top])], { size: 0.4, tone: 'hi' });
  return { plate, rail, stop, pin };
})();
// the through-beam pair: receiver behind the housing, emitter in front of it
const BEAM_X = -30;
const beamRx = box({ x: BEAM_X - 4, y: -51, w: 8, d: 7, r: 0.5 }, FZ, FZ + 18, { tone: 'mid' }, 0.2, 2) + Dt([at([BEAM_X + 2, -44, FZ + 15])], { size: 0.45, tone: 'hi' });
const beamTx = box({ x: BEAM_X - 4, y: 43, w: 8, d: 7, r: 0.5 }, FZ, FZ + 18, { tone: 'mid' }, 0.2, 2) + Dt([at([BEAM_X + 2, 50, FZ + 15])], { size: 0.45, tone: 'hi' });
// the swing clamp body (its arm is drawn by the page)
const clampBody = post(CLAMP.x, CLAMP.y, 8, FZ, FZ + 4, { tone: 'lo' }, 6)
  + post(CLAMP.x, CLAMP.y, 6, FZ + 4, CLAMP.z - 2, { tone: 'mid', inner: L(k.sideArc(CLAMP.x, CLAMP.y, 6, FZ + 14, P, 20), { tone: 'faint' }) }, 28)
  + post(CLAMP.x + 6.5, CLAMP.y + 2, 1.6, FZ + 16, FZ + 22, { tone: 'hi' }, 10);

// ---------------------------------------------------------------- the press (its rod and foot are drawn by the page)
const press = (() => {
  const base = post(PRESS.x, PRESS.y, 13, 0, 3, { tone: 'lo' }, 6) + Dt([0, 1, 2, 3, 4, 5].map((i) => at([PRESS.x + 10 * Math.cos(i * Math.PI / 3 + 0.5), PRESS.y + 10 * Math.sin(i * Math.PI / 3 + 0.5), 3])), { size: 0.4 });
  const column = post(PRESS.x, PRESS.y, 7, 3, PRESS.top - 14, { crease: 'none', inner: L(k.sideArc(PRESS.x, PRESS.y, 7, 40, P, 20), { tone: 'faint' }) }, 28);
  const arm = box({ x: PRESS.x - 8, y: PRESS.y - 9, w: 16, d: 112, r: 1 }, PRESS.top - 14, PRESS.top, { inner: seam({ x: PRESS.x - 8, y: PRESS.y - 9, w: 16, d: 112 }, PRESS.top - 5, 2) }, 0.5, 2)
    + Dt([at([PRESS.x, PRESS.y, PRESS.top]), at([PRESS.x, 0, PRESS.top])], { size: 0.45 });
  const cyl = post(BEAR.x, 0, 11, PRESS.cyl[0], PRESS.cyl[1], { tone: 'hi', crease: 'lo', inner: L(k.sideArc(BEAR.x, 0, 11, PRESS.cyl[1] - 4, P, 24) + k.sideArc(BEAR.x, 0, 11, PRESS.cyl[0] + 4, P, 24), { tone: 'faint' }) }, 32)
    + post(BEAR.x, 0, 4.5, PRESS.cyl[0] - 3, PRESS.cyl[0], { tone: 'mid' }, 6)
    + post(BEAR.x + 10, 8, 1.6, PRESS.cyl[1] - 10, PRESS.cyl[1] - 6, { tone: 'hi' }, 10) + post(BEAR.x + 10, 8, 1.6, PRESS.cyl[0] + 6, PRESS.cyl[0] + 10, { tone: 'hi' }, 10);
  return { base, column, arm, cyl };
})();

// ---------------------------------------------------------------- the sensor bridge
const bridge = (() => {
  const base = post(SB.x, SB.y, 10, 0, 2.4, { tone: 'lo' }, 24) + Dt([at([SB.x - 7, SB.y, 2.4]), at([SB.x + 7, SB.y, 2.4])], { size: 0.4 });
  const column = post(SB.x, SB.y, 4.5, 2.4, SB.z, { crease: 'none' }, 20);
  const arm = box({ x: SB.x - 5, y: SB.y - 5, w: 10, d: 101, r: 0.6 }, SB.z, SB.z + 8, {}, 0.3, 2);
  const cross = box({ x: SB.x - 5, y: -5, w: SENS.B[0] - SB.x + 11, d: 10, r: 0.6 }, SB.z, SB.z + 8, {}, 0.3, 2)
    + Dt([at([SENS.B[0] + 2, 0, SB.z + 8])], { size: 0.4 });
  // the inductive sensor A over the bracket: an M12 barrel, two nuts, a plug
  const [x, y] = SENS.A;
  const indA = post(x, y, 4.2, HT + 11, SB.z, { tone: 'mid', crease: 'none', inner: L(k.knurl(x, y, 4.2, HT + 13, SB.z - 4, 11, P), { tone: 'faint' }) }, 20)
    + post(x, y, 5.6, SB.z - 3, SB.z, { tone: 'hi', crease: 'lo' }, 6)
    + post(x, y, 3.6, SB.z + 8, SB.z + 13, { tone: 'mid' }, 14) + Dt([at([x, y, SB.z + 13])], { size: 0.4, tone: 'hi' });
  return { base, column, arm, cross, indA };
})();
const SA_FACE = HT + 11; // sensor A face height

// ---------------------------------------------------------------- the nutrunner column (arm and tool by the page)
const nutColumn = post(NUT.x, NUT.y, 14, 0, 3, { tone: 'lo' }, 6)
  + post(NUT.x, NUT.y, 6, 3, NUT.z - 2, { crease: 'none', inner: L(k.sideArc(NUT.x, NUT.y, 6, 60, P, 20), { tone: 'faint' }) }, 24)
  + post(NUT.x, NUT.y, 9, NUT.z - 8, NUT.z, { tone: 'hi', crease: 'lo' }, 28);

// ---------------------------------------------------------------- the PLC cabinet
const plc = (() => {
  const b = { x: PLC.x, y: PLC.y, w: PLC.w, d: PLC.d, r: 1 };
  const fy = PLC.y + PLC.d;
  const door = k.pathOf([[PLC.x + 3, fy, 4], [PLC.x + PLC.w - 3, fy, 4], [PLC.x + PLC.w - 3, fy, PLC.h - 4], [PLC.x + 3, fy, PLC.h - 4]].map(at), true);
  const vents = [12, 16, 20].map((z) => k.pathOf([[PLC.x + 10, fy, z], [PLC.x + 30, fy, z], [PLC.x + 30, fy, z + 2], [PLC.x + 10, fy, z + 2]].map(at), true)).join('');
  const screen = k.pathOf([[PLC.x + 10, fy, 118], [PLC.x + 62, fy, 118], [PLC.x + 62, fy, 84], [PLC.x + 10, fy, 84]].map(at), true);
  const body = box(b, 0, PLC.h, { inner: L(door, { tone: 'lo' }) + seam(b, PLC.h - 8, 2) }, 0.6, 2)
    + `<path class="ep-slot" d="${vents}"/>` + `<path class="ep-screen" d="${screen}"/>`
    + Dt([[PLC.x + 6, fy, 10], [PLC.x + 6, fy, PLC.h - 10]].map(at), { size: 0.45 })
    + Dt([[PLC.x + 14, fy, 70], [PLC.x + 22, fy, 70], [PLC.x + 30, fy, 70]].map(at), { size: 0.5, tone: 'hi' });
  const lx = PLC.x + PLC.w - 12;
  const ly = PLC.y + 10;
  const towerBase = post(lx, ly, 6, PLC.h, PLC.h + 3, { tone: 'lo' }, 20);
  const seg = (i) => post(lx, ly, 4.6, PLC.h + 3 + i * 9, PLC.h + 12 + i * 9, { tone: 'mid', crease: 'lo' }, 22);
  const towerLo = seg(0) + seg(1);
  const towerCap = post(lx, ly, 4.8, PLC.h + 30, PLC.h + 32, { tone: 'mid' }, 22) + Dt([at([lx, ly, PLC.h + 32])], { size: 0.4, tone: 'hi' });
  return { body, towerBase, towerLo, towerCap, lx, ly, fy };
})();
// the bypass key switch on the door: a bezel and a key slot
const KEY = [PLC.x + 54, PLC.y + PLC.d, 56];
const keySvg = (() => {
  const ring = k.circleRing(0, 0, 4.4, 22).map(([u, v]) => at([KEY[0] + u, KEY[1] + 0.2, KEY[2] + v]));
  return `<path class="ep-key" d="${k.pathOf(ring, true)}"/>` + L(k.segment([KEY[0], KEY[1] + 0.3, KEY[2] - 2.6], [KEY[0], KEY[1] + 0.3, KEY[2] + 2.6], P), { tone: 'hi', free: true });
})();
// signal cables along the table: sensor bridge and beam receiver to the cabinet
const cables = k.wireSvg(at([SB.x + 10, SB.y, 1]), at([PLC.x, PLC.y + 14, 1]), { via: [at([SB.x + 20, SB.y - 10, 1]), at([PLC.x - 30, SB.y - 10, 1])], tone: 'lo', size: 0.9 })
  + k.wireSvg(at([BEAM_X, -51, 2]), at([BEAM_X + 4, SB.y - 4, 1]), { tone: 'lo', size: 0.9 });

// ---------------------------------------------------------------- the reject bin, the reference plate and the tray (front)
const rejectBin = (() => {
  const b = REJ;
  const t = 2.4;
  const back = box({ x: b.x + t, y: b.y + t, w: b.w - 2 * t, d: b.d - 2 * t, r: 0.3 }, 0, 2, { tone: 'lo' }, 0, 1)
    + box({ x: b.x, y: b.y, w: b.w, d: t, r: 0.3 }, 0, REJ_H, {}, 0, 1)
    + box({ x: b.x, y: b.y + t, w: t, d: b.d - t, r: 0.3 }, 0, REJ_H, {}, 0, 1);
  const fy = b.y + b.d;
  const front = box({ x: b.x + b.w - t, y: b.y + t, w: t, d: b.d - t, r: 0.3 }, 0, REJ_H, {}, 0, 1)
    + box({ x: b.x + t, y: fy - t, w: b.w - 2 * t, d: t, r: 0.3 }, 0, REJ_H, {}, 0, 1)
    + `<path class="ep-plate" d="${k.pathOf([[b.x + 12, fy, 20], [b.x + 44, fy, 20], [b.x + 44, fy, 8], [b.x + 12, fy, 8]].map(at), true)}"/>`
    + L([0, 1, 2].map((i) => k.segment([b.x + 15, fy, 17 - i * 3], [b.x + 15 + [24, 17, 21][i], fy, 17 - i * 3], P)).join(''), { tone: 'lo', free: true });
  return { back, front };
})();
// reference parts: good, without a clip, with a half-seated clip, each on a tagged spot
const REF_PARTS = [{ clip: 1 }, { clip: 0 }, { clip: 0.5 }];
const refPlate = (() => {
  let out = box(REF, 0, 3, { tone: 'lo', inner: seam(REF, 1.5, 2) }, 0.3, 2);
  REF_PARTS.forEach((rp, i) => {
    const cx = REF.x + 18 + i * 34;
    const cy = REF.y + 20;
    out += L(k.planOutline({ x: cx - 15, y: cy - 9, w: 30, d: 18, r: 0.4 }, 3, P, 2), { tone: 'faint' });
    out += box({ x: cx - 13, y: cy - 7, w: 26, d: 14, r: 0.5 }, 3, 6.5, { tone: 'hi', crease: 'lo' }, 0.2, 2);
    if (rp.clip) {
      const ch = 4 * rp.clip;
      out += box({ x: cx + 2, y: cy - 4, w: 7, d: 8, r: 0.4 }, 6.5 + (rp.clip < 1 ? 1.6 : 0), 6.5 + ch + (rp.clip < 1 ? 1.6 : 0), { tone: 'mid' }, 0.1, 1);
    }
    out += box({ x: cx - 6, y: REF.y + REF.d - 9, w: 12, d: 5, r: 0.3 }, 3, 3.4, { tone: 'mid', crease: 'none' }, 0, 1)
      + Dt([at([cx - 3 + i * 3, REF.y + REF.d - 6.5, 3.4])], { size: 0.45, tone: 'hi' });
  });
  return out;
})();
const tray = (() => {
  const t = 2;
  return {
    back: box(TRAY, 0, 2.4, { tone: 'lo' }, 0.2, 2)
      + L([0, 1, 2, 3, 4, 5].map((i) => k.lineOnTop([TRAY.x + 12 + i * 25, TRAY.y + 4], [TRAY.x + 12 + i * 25, TRAY.y + TRAY.d - 4], 2.4, P)).join(''), { tone: 'faint' })
      + box({ x: TRAY.x, y: TRAY.y, w: TRAY.w, d: t, r: 0.3 }, 2.4, 8, {}, 0, 1)
      + box({ x: TRAY.x + TRAY.w - t, y: TRAY.y + t, w: t, d: TRAY.d - 2 * t, r: 0.3 }, 2.4, 8, {}, 0, 1),
    front: box({ x: TRAY.x, y: TRAY.y + TRAY.d - t, w: TRAY.w, d: t, r: 0.3 }, 2.4, 8, {}, 0, 1),
  };
})();

// ---------------------------------------------------------------- the drawing, back to front
const binsBack = BP.map((b, i) => cue(`bin${i}`, b.floor + b.back + b.pile + b.right + b.eyes)).join('');
const binsFront = BP.map((b, i) => cue(`bin${i}`, b.front) + cue('ptl', cue(`ptl${i}`, b.module + b.lens))).join('');
const world = [
  g('table', table),
  cables,
  cue('nut', nutColumn),
  cue('press', press.base + press.column),
  cue('bridge', bridge.base + bridge.column),
  cue('plc', plc.body + plc.towerBase + plc.towerLo) + cue('tower', g('lamp', '')) + cue('plc', plc.towerCap),
  cue('key', keySvg),
  g('hmi', ''),
  cue('bins', binsBack),
  g('beamBins', ''),
  cue('bins', binsFront),
  cue('fixture', fixture.plate + fixture.rail + fixture.stop),
  cue('beam', beamRx),
  cue('fixture', cue('pin', fixture.pin)),
  cue('beam', g('beam', '')),
  cue('house', g('house', '')),
  cue('beam', g('beamStub', '') + beamTx),
  cue('clamp', clampBody + g('clampArm', '')),
  cue('wrong', g('hand', '')),
  cue('press', press.arm + press.cyl + g('pressRod', '')),
  cue('force', g('pressMark', '')),
  cue('bridge', bridge.arm + bridge.cross),
  cue('ind', bridge.indA + g('fieldA', '')),
  cue('sensB', cue('cap', cue('bgs', g('sensB', '')))),
  g('backTray', tray.back),
  cue('defect', cue('quar', g('trayPart', ''))),
  g('frontTray', tray.front),
  rejectBin.back,
  cue('reject', g('rejPart', '')),
  rejectBin.front,
  cue('refs', refPlate),
  cue('nut', g('nutArm', '')),
].join('');
const hud = [g('panelA', ''), cue('ppm', g('ppm', '')), cue('esc', g('esc', '')), cue('force', g('graph', '')), cue('pfmea', g('pfmea', '')), cue('ap', g('apCell', '')), cue('plan', g('plan', '')), g('clock', '')].join('');
// Static paths written with relative line-tos (as in eng.machining.workholding):
// the same points to 0,1, about a third fewer bytes, proved exact per path.
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

// ---------------------------------------------------------------- cameras (one framing per caption beat)
// [x, y, z, width]: the world point at the centre and the world width shown;
// the camera glides to a beat's framing over the first part of that beat.
const cam = ([x0, y0, z0, w]) => { const [x, y] = at([x0, y0, z0]); return [Math.round(x * 10) / 10, Math.round(y * 10) / 10, w]; };
const ALL = [-10, -10, 50, 600];
const CAM = [
  [[-20, -10, 50, 460], [-40, -20, 50, 560], [40, 10, 40, 520]],
  [[-190, -70, 30, 300], [-110, -40, 40, 440], [40, 0, 40, 480], [60, 0, 40, 520]],
  [[-120, -50, 40, 440], [-150, -60, 40, 380], [-90, -40, 40, 500], [-20, -10, 30, 300]],
  [[-10, -5, 55, 250], [-20, 0, 30, 280], [60, -60, 70, 420]],
  [[0, -10, 55, 330], [10, 0, 50, 330], [0, -10, 50, 420], [-110, 20, 40, 480], [130, -80, 70, 330]],
  [[5, 0, 60, 190], [5, 0, 60, 190], [5, 0, 60, 200]],
  [[30, -20, 80, 360], [30, -20, 80, 360], [-80, 50, 30, 380]],
  [ALL, ALL, ALL],
  [[30, -20, 70, 380], [60, 0, 50, 470], [60, 10, 50, 500], [120, 10, 40, 420]],
].map((sc) => sc.map(cam));

// ---------------------------------------------------------------- the film
const ER = 'eng.lines.errors';
const PK = 'eng.lines.pokayoke';
const SE = 'eng.lines.sensors';
const DT = 'eng.lines.detection';
const spec = {
  id: 'eng.lines.errorproof',
  title: { nl: 'Foutvrij maken', en: 'Error-proofing' },
  lessons: [ER, PK, SE, DT],
  scenes: [
    {
      id: 's1', lesson: ER, level: 1, title: { nl: 'Een montageplek', en: 'An assembly station' },
      beats: [
        { nl: 'Een montageplek: een stalen beugel komt op een behuizing, met clip, schroeven en een lager.', en: 'An assembly station: a steel bracket goes on a housing, with a clip, screws and a bearing.', cues: ['house'] },
        { nl: 'Links de bakken met beugels, midden de houder, erboven de schroefmachine en de pers.', en: 'On the left the bins of brackets, in the middle the holder, above it the nutrunner and the press.', cues: ['bins', 'nut', 'press'] },
        { nl: 'Elke handeling gebeurt hier honderden keren per dag.', en: 'Every action here happens hundreds of times a day.' },
      ],
    },
    {
      id: 's2', lesson: ER, level: 1, title: { nl: 'Een vergissing', en: 'A mistake' },
      beats: [
        { nl: 'Twee beugels, {n:6} en {n:8} mm, lijken op elkaar en liggen naast elkaar.', en: 'Two brackets, {n:6} and {n:8} mm, look alike and lie side by side.', cues: ['bins'] },
        { nl: 'Een {t:Vergissing|vergissing}: na een onderbreking pakt de hand de verkeerde beugel.', en: 'A {t:Mistake|mistake}: after an interruption the hand picks the wrong bracket.', cue: { Vergissing: 'wrong' } },
        { nl: 'Het {t:Defect|defect} is het foute product dat de klant krijgt.', en: 'The {t:Defect|defect} is the faulty product the customer gets.', cue: { Defect: 'defect' } },
        { nl: '1 op de {n:5000}: {n:1000000} / {n:5000} = {n:200} {t:ppm|ppm}, per miljoen stuks.', en: '1 in {n:5000}: {n:1000000} / {n:5000} = {n:200} {t:ppm|ppm}, parts per million.', cue: { ppm: 'ppm' } },
      ],
    },
    {
      id: 's3', lesson: ER, level: 1, title: { nl: 'Poka-yoke', en: 'Poka-yoke' },
      beats: [
        { nl: '{t:Poka-yoke|Poka-yoke} maakt een vergissing onmogelijk, of vangt hem meteen.', en: '{t:Poka-yoke|Poka-yoke} makes a mistake impossible, or catches it at once.', cue: { 'Poka-yoke': 'ptl' }, cues: ['pin'] },
        { nl: '{t:Pick-to-light|Pick-to-light}: de goede bak licht op, een lichtstraal ziet de hand.', en: '{t:Pick-to-light|Pick-to-light}: the right bin lights up, a light beam sees the hand.', cue: { 'Pick-to-light': 'ptl' } },
        { nl: 'De verkeerde bak? Dan blijft de klem dicht: een stop, geen waarschuwing.', en: 'The wrong bin? Then the clamp stays shut: a stop, not a warning.', cues: ['clamp', 'tower'] },
        { nl: 'De {t:Mal|mal} heeft een pen: de behuizing past er maar op één manier in.', en: 'The {t:Fixture|fixture} has a pin: the housing fits only one way round.', cue: { Mal: 'fixture' } },
      ],
    },
    {
      id: 's4', lesson: PK, level: 2, title: { nl: 'Sensoren en de PLC', en: 'Sensors and the PLC' },
      beats: [
        { nl: 'Een {t:Inductieve sensor|inductieve sensor} ziet de stalen beugel, zonder hem aan te raken.', en: 'An {t:Inductive sensor|inductive sensor} sees the steel bracket without touching it.', cue: { 'Inductieve sensor': 'ind' } },
        { nl: 'Een {t:Foto-elektrische sensor|foto-elektrische sensor}: de behuizing onderbreekt de lichtstraal.', en: 'A {t:Photoelectric sensor|photoelectric sensor}: the housing breaks the light beam.', cue: { 'Foto-elektrische sensor': 'beam' }, q: 0.95 },
        { nl: 'Ze melden het aan de {t:PLC|PLC}, de computer die de machine aanstuurt.', en: 'They report to the {t:PLC|PLC}, the computer that runs the machine.', cue: { PLC: 'plc' } },
      ],
    },
    {
      id: 's5', lesson: PK, level: 2, title: { nl: 'Pas na 8 schroeven', en: 'Only after 8 screws' },
      beats: [
        { nl: 'De schroefmachine meet bij elke schroef het moment en de hoek. De PLC telt mee.', en: 'The nutrunner measures the torque and angle of every screw. The PLC counts.', cues: ['nut'] },
        { nl: 'Pas na {n:8} keer OK laat de {t:Interlock|interlock} de behuizing los: de klem gaat open.', en: 'Only after {n:8} OKs does the {t:Interlock|interlock} release the housing: the clamp opens.', cue: { Interlock: 'clamp' } },
        { nl: 'Met het oog vang je zo’n {n:85}%: van {n:400} ppm fout komt {n:60} ppm bij de klant.', en: 'By eye you catch about {n:85}%: of {n:400} ppm made, {n:60} ppm reach the customer.', cues: ['esc'] },
        { nl: 'Een {t:Valse afkeur|valse afkeur}: de check keurt een goede behuizing af.', en: 'A {t:False reject|false reject}: the check turns down a good housing.', cue: { 'Valse afkeur': 'reject' } },
        { nl: 'Bij {n:3}% valse afkeur vindt iemand al snel de overbruggingssleutel.', en: 'At {n:3}% false rejects someone soon finds the bypass key.', cues: ['key'] },
      ],
    },
    {
      id: 's6', lesson: SE, level: 3, title: { nl: 'De goede sensor kiezen', en: 'Choosing the right sensor' },
      beats: [
        { nl: 'Een inductieve sensor boven de kunststof clip ziet de stalen beugel: altijd “aanwezig”.', en: 'An inductive sensor over the plastic clip sees the steel bracket: always “present”.', cues: ['sensB'] },
        { nl: 'Een {t:Capacitieve sensor|capacitieve sensor} ziet ook kunststof, maar reageert ook op vocht en vuil.', en: 'A {t:Capacitive sensor|capacitive sensor} also sees plastic, but reacts to damp and dirt too.', cue: { 'Capacitieve sensor': 'cap' } },
        { nl: 'Een reflectietaster met {t:Achtergrondonderdrukking|achtergrondonderdrukking} negeert alles achter de clip.', en: 'A diffuse sensor with {t:Background suppression|background suppression} ignores everything behind the clip.', cue: { Achtergrondonderdrukking: 'bgs' } },
      ],
    },
    {
      id: 's7', lesson: SE, level: 3, title: { nl: 'Bewaken en bewijzen', en: 'Monitoring and proving' },
      beats: [
        { nl: '{t:Kracht-wegbewaking|Kracht-wegbewaking}: de krachtcurve van het inpersen moet door de vensters.', en: '{t:Force-displacement monitoring|Force-displacement monitoring}: the press-in force curve must pass the windows.', cue: { 'Kracht-wegbewaking': 'force' } },
        { nl: 'Ontbreekt het lager, dan loopt de curve anders en keurt de pers af.', en: 'If the bearing is missing, the curve runs differently and the press rejects.', cues: ['force', 'tower'] },
        { nl: 'Bewijs het met een {t:Referentiedeel|referentiedeel} per faalwijze: wordt elk fout deel afgekeurd?', en: 'Prove it with a {t:Reference part|reference part} per failure mode: is every bad part rejected?', cue: { Referentiedeel: 'refs' } },
      ],
    },
    {
      id: 's8', lesson: DT, level: 4, title: { nl: 'PFMEA en escapes', en: 'PFMEA and escapes' },
      beats: [
        { nl: 'De {t:PFMEA|PFMEA} scoort elke faalwijze op ernst, optreden en detectie.', en: 'The {t:PFMEA|PFMEA} scores each failure mode for severity, occurrence and detection.', cue: { PFMEA: 'pfmea' } },
        { nl: 'De {t:Actieprioriteit|actieprioriteit} zegt waar je eerst ingrijpt. Ernst gaat voor.', en: 'The {t:Action priority|action priority} says where to act first. Severity comes first.', cue: { Actieprioriteit: 'ap' } },
        { nl: 'Een {t:Escape|escape} bereikt de klant: {n:1000} ppm, {n:99.9}% gevangen, geeft {n:1} ppm; met het oog {n:150}.', en: 'An {t:Escape|escape} reaches the customer: {n:1000} ppm, {n:99.9}% caught, gives {n:1} ppm; by eye {n:150}.', cue: { Escape: 'esc' } },
      ],
    },
    {
      id: 's9', lesson: DT, level: 4, title: { nl: 'De red rabbit', en: 'The red rabbit' },
      beats: [
        { nl: 'Een {t:Red rabbit|red rabbit}: een bekend fout deel, hier zonder lager, gaat elke dienst door de check.', en: 'A {t:Red rabbit|red rabbit}: a known bad part, here without a bearing, runs through the check every shift.', cue: { 'Red rabbit': 'house' } },
        { nl: 'Om 06:00 keurt de pers hem af. Om 14:00 keurt hij hem goed: de check is stuk.', en: 'At 06:00 the press rejects it. At 14:00 it accepts it: the check has failed.', cues: ['force'], q: 0.97 },
        { nl: '{t:Reactieplan|Reactieplan}: stoppen, repareren, opnieuw verifiëren, en blokkeren sinds 06:00.', en: '{t:Reaction plan|Reaction plan}: stop, repair, verify again, and contain everything since 06:00.', cue: { Reactieplan: 'plan' } },
        { nl: '{n:8} uur × {n:60} per uur = {n:480} verdachte delen in quarantaine.', en: '{n:8} hours × {n:60} an hour = {n:480} suspect parts in quarantine.', cues: ['quar'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: a fuller explanation than the
// caption, so the learner needs nothing else. Times of day are said as words.
const SAY = [
  [ // s1 how it works
    { nl: 'Een montageplek aan een lijn. De operator legt een behuizing in de houder en zet er een stalen beugel en een kunststof clip op. Dan gaan er schroeven in, en perst de pers er een lager in.',
      en: 'An assembly station on a line. The operator lays a housing in the holder and puts a steel bracket and a plastic clip on it. Then screws go in, and the press presses in a bearing.' },
    { nl: 'Links de bakken met beugels, erboven de schroefmachine en de pers.',
      en: 'On the left the bins of brackets, above them the nutrunner and the press.' },
    { nl: 'Dit gebeurt honderden keren per dag, dus zelfs een heel kleine foutkans geeft elke week foute producten.',
      en: 'This happens hundreds of times a day, so even a tiny chance of error gives faulty products every week.' },
  ],
  [ // s2 a mistake
    { nl: 'De lijn bouwt twee kachels, met een beugel van {n:6} of van {n:8} millimeter. Die lijken bijna hetzelfde en liggen naast elkaar.',
      en: 'The line builds two heaters: with a {n:6} millimetre bracket, or an {n:8}. They look almost the same, and lie side by side.' },
    { nl: 'Na een onderbreking pakt de operator uit de verkeerde bak: een {t:Vergissing|vergissing}, de menselijke handeling die misgaat. Iedereen vergist zich soms.',
      en: 'After an interruption the operator picks from the wrong bin: a {t:Mistake|mistake}, the human action that goes wrong. Everyone makes mistakes now and then.' },
    { nl: 'Gaat hij zo door, dan krijgt de klant een {t:Defect|defect}: een fout product. Shigeo Shingo zei: vergissingen gebeuren, defecten hoeven niet, als je de vergissing op tijd vangt.',
      en: 'If it moves on like this, the customer gets a {t:Defect|defect}: a faulty product. Shigeo Shingo said: mistakes happen, defects need not, if you catch the mistake in time.' },
    { nl: 'Je telt fouten in {t:ppm|ppm}, per miljoen stuks. Eén op de {n:5000} is {n:200} ppm. Vraag niet wie het deed, maar hoe het kon gebeuren.',
      en: 'You count defects in {t:ppm|ppm}, parts per million. One in {n:5000} is {n:200} ppm. Do not ask who did it, but how it could happen.' },
  ],
  [ // s3 poka-yoke
    { nl: 'Shingo’s antwoord was {t:Poka-yoke|poka-yoke}, Japans voor het vermijden van onbedoelde fouten: simpele middelen die een vergissing onmogelijk maken, of meteen vangen.',
      en: 'Shingo’s answer was {t:Poka-yoke|poka-yoke}, Japanese for avoiding inadvertent errors: simple devices that make a mistake impossible, or catch it at once.' },
    { nl: 'Hier is dat {t:Pick-to-light|pick-to-light}: bij de goede bak brandt een lampje, en een lichtstraal ziet of de hand erin ging.',
      en: 'Here that is {t:Pick-to-light|pick-to-light}: a lamp lights at the right bin, and a light beam sees whether the hand went in.' },
    { nl: 'Gaat de hand in de verkeerde bak, dan blijft de klem dicht. Een stop is sterker dan een waarschuwing: een zoemer mis je in een lawaaiige hal.',
      en: 'If the hand goes into the wrong bin, the clamp stays shut. A stop is stronger than a warning: you miss a buzzer in a noisy hall.' },
    { nl: 'Nog beter: maak de fout onmogelijk. De {t:Mal|mal} zet de behuizing op zijn plek; zijn pen past alleen in de schuine hoek, dus verkeerd om kan niet.',
      en: 'Better still: make the error impossible. The {t:Fixture|fixture} puts the housing in place; its pin fits only the chamfered corner, so the wrong way round is impossible.' },
  ],
  [ // s4 sensors and the PLC
    { nl: 'Kan dat niet, detecteer de fout dan en stop. Een {t:Inductieve sensor|inductieve sensor} ziet metaal op een paar millimeter, zonder aanraken: hier de beugel.',
      en: 'If you cannot, detect the error and stop. An {t:Inductive sensor|inductive sensor} sees metal a few millimetres away, without touching: here the bracket.' },
    { nl: 'Een {t:Foto-elektrische sensor|foto-elektrische sensor} werkt met licht: de behuizing in de mal onderbreekt de straal.',
      en: 'A {t:Photoelectric sensor|photoelectric sensor} works with light: the housing in the fixture breaks the beam.' },
    { nl: 'Ze melden het aan de {t:PLC|PLC}: de kleine industriële computer die de machine aanstuurt.',
      en: 'They report to the {t:PLC|PLC}: the small industrial computer that runs the machine.' },
  ],
  [ // s5 interlock and false rejects
    { nl: 'Eerst miste bij één op de {n:2000} behuizingen een van de {n:8} schroeven. Nu meet de schroefmachine van elke schroef moment en hoek; de PLC telt mee.',
      en: 'Before, one housing in {n:2000} lacked one of its {n:8} screws. Now the nutrunner measures the torque and angle of every screw; the PLC counts.' },
    { nl: 'De {t:Interlock|interlock} is een regel in de PLC: de volgende stap pas als alle checks OK zijn. Pas bij acht keer OK laat de klem de behuizing los.',
      en: 'The {t:Interlock|interlock} is a rule in the PLC: the next step only when every check is OK. Only at eight OKs does the clamp release the housing.' },
    { nl: 'Een extra controleur? Met het oog vang je meestal {n:80} tot {n:90} procent. Van {n:400} ppm fout, bij {n:85} procent gevangen, komt nog {n:60} ppm bij de klant.',
      en: 'An extra inspector? By eye you usually catch {n:80} to {n:90} percent. Of {n:400} ppm made, with {n:85} percent caught, {n:60} ppm still reach the customer.' },
    { nl: 'Let ook op {t:Valse afkeur|valse afkeur}: een goed product dat de check afkeurt. Te ruim laat fouten door, te streng geeft valse afkeur.',
      en: 'Watch for a {t:False reject|false reject} too: a good product the check turns down. Too loose lets defects through; too tight gives false rejects.' },
    { nl: 'Keurt een camera {n:3} procent goede producten af, dan vindt iemand de overbruggingssleutel. Vraag dus hoe vaak elke check wordt overbrugd.',
      en: 'If a camera rejects {n:3} percent good products, someone finds the bypass key. So ask how often each check is bypassed.' },
  ],
  [ // s6 choosing the right sensor
    { nl: 'Begin bij het defect: wat is er fysiek anders? Hier een kunststof clip. Een inductieve sensor ziet alleen de stalen beugel erachter, en meldt dus altijd aanwezig.',
      en: 'Start from the defect: what is physically different? Here a plastic clip. An inductive sensor sees only the steel bracket behind it, so it always reports present.' },
    { nl: 'Een {t:Capacitieve sensor|capacitieve sensor} ziet ook kunststof en vloeistof, maar reageert ook op vocht en vuil.',
      en: 'A {t:Capacitive sensor|capacitive sensor} sees plastic and liquid too, but also reacts to damp and dirt.' },
    { nl: 'Hier past een reflectietaster met {t:Achtergrondonderdrukking|achtergrondonderdrukking}: die negeert alles voorbij een ingestelde afstand, net vóór de beugel.',
      en: 'A diffuse sensor with {t:Background suppression|background suppression} fits here: it ignores anything beyond a set distance, just in front of the bracket.' },
  ],
  [ // s7 force-displacement and reference parts
    { nl: '{t:Kracht-wegbewaking|Kracht-wegbewaking} registreert de kracht over de slag van de pers, en toetst de curve aan vensters van goede producten.',
      en: '{t:Force-displacement monitoring|Force-displacement monitoring} records the force over the press stroke, and tests the curve against windows from good parts.' },
    { nl: 'Een ontbrekend lager of een gescheurd huis geeft een andere curve. Zo beoordeelt de pers de verbinding zelf.',
      en: 'A missing bearing or a cracked housing gives a different curve. So the press judges the joint itself.' },
    { nl: 'Bewijs elke check met een {t:Referentiedeel|referentiedeel} per faalwijze: goed, zonder clip, en het grensgeval: half ingedrukt. Elk fout deel moet eruit.',
      en: 'Prove every check with a {t:Reference part|reference part} for each failure mode: good, without a clip, and the borderline case: half-seated. Every bad part must be rejected.' },
  ],
  [ // s8 PFMEA and escapes
    { nl: 'Waar zet je eerst een poka-yoke? Dat bepaalt de {t:PFMEA|PFMEA}, de procesgerichte faalwijze- en effectenanalyse. Elke faalwijze krijgt {n:1} tot {n:10} voor ernst, optreden en detectie.',
      en: 'Where do you put a poka-yoke first? The {t:PFMEA|PFMEA}, the process failure mode and effects analysis, decides. Each failure mode scores {n:1} to {n:10} for severity, occurrence and detection.' },
    { nl: 'Een tabel maakt daar een {t:Actieprioriteit|actieprioriteit} van: hoog, middel of laag. Ernst gaat voor. Keuren met het oog scoort slecht op detectie, een gevalideerde sensor met interlock goed.',
      en: 'A table turns them into an {t:Action priority|action priority}: high, medium or low. Severity comes first. Inspection by eye scores badly on detection, a validated sensor with an interlock well.' },
    { nl: 'Een {t:Escape|escape} glipt langs elke check, tot bij de klant. {n:1000} ppm met {n:99.9} procent gevangen geeft {n:1} ppm; met het oog {n:150}.',
      en: 'An {t:Escape|escape} slips past every check, to the customer. {n:1000} ppm with {n:99.9} percent caught gives {n:1} ppm; by eye, {n:150}.' },
  ],
  [ // s9 the red rabbit
    { nl: 'Een check telt alleen zolang hij werkt. Daarom gaat elke dienst een {t:Red rabbit|red rabbit} door: een bekend fout deel, vaak rood gespoten; hier de donkere behuizing zonder lager.',
      en: 'A check only counts while it works. So every shift a {t:Red rabbit|red rabbit} runs through: a known bad part, often painted red; here the dark housing without a bearing.' },
    { nl: 'Om zes uur ’s ochtends keurt de pers hem af: goed. Om twee uur ’s middags keurt hij hem goed: de check is stuk.',
      en: 'At six in the morning the press rejects it: good. At two in the afternoon it accepts it: the check has failed.' },
    { nl: 'Dan begint het {t:Reactieplan|reactieplan}: stoppen, repareren, opnieuw verifiëren, en alles blokkeren sinds de laatste goede check, want niks daarvan is echt gecontroleerd.',
      en: 'Then the {t:Reaction plan|reaction plan} starts: stop, repair, verify again, and contain everything since the last good check, because none of it was really checked.' },
    { nl: '{n:8} uur maal {n:60} per uur: {n:480} delen. Het interval van de check is ook de omvang van elke terugroepactie.',
      en: '{n:8} hours times {n:60} an hour: {n:480} parts. The check interval is also the size of every recall.' },
  ],
];
spec.scenes.forEach((s, si) => { if (CAM[si].length !== s.beats.length) throw new Error(`camera: scene ${si + 1} needs ${s.beats.length} framings`); });
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});

// Scene lengths from the captions (reading pace with some air), then reduced
// motion: each beat's still sits late in that beat, where the stage has drawn
// what the beat names.
const C = {
  FZ, HT, HOUSE, PIN, BR, THICK, CLIP, SCREW_AT, BEAR, BINS, BIN_H, BIN_EY: BP.map((b) => b.ey), REJ, REJ_H, REF, REF_PARTS, TRAY, TRAYSPOT, REJSPOT,
  PRESS, SB, SENS, SA_FACE, CLAMP, PLC, LAMP: [plc.lx, plc.ly], NUT, BEAM_X, KEY, HMI: { x: PLC.x + 13, y: PLC.y + PLC.d, z: 112 },
  PPM, ONE_IN, EYE, MADE_PK, MADE_DT, AUTO, FALSE_REJECT, RR, SUSPECT, SCREWS,
};
{
  spec.scenes.forEach((s) => { s.dur = 10; });
  const pre = resolveFilm(spec, await allLessons());
  pre.scenes.forEach((s, si) => {
    const words = Math.max(...['nl', 'en'].map((lang) => wordsOf(s.beats.map((b) => b.text[lang]).join(' '))));
    spec.scenes[si].dur = Math.ceil(minSceneDur(words) + 3 * s.beats.length);
  });
  C.dur = spec.scenes.map((s) => s.dur);
  const again = resolveFilm(spec, await allLessons());
  again.scenes.forEach((s, si) => {
    const st = beatStarts(s, 'nl').map((t) => t / s.dur);
    spec.scenes[si].beats.forEach((b, bi) => {
      const a = st[bi];
      const e = bi + 1 < st.length ? st[bi + 1] : 1;
      b.still = Math.round((a + (b.q ?? 0.82) * (e - a)) * 1000) / 1000;
      delete b.q;
    });
    spec.scenes[si].still = spec.scenes[si].beats[spec.scenes[si].beats.length - 1].still;
  });
}

// ---------------------------------------------------------------- page script and styles
const preamble = `const P = ${JSON.stringify(P)};\nconst C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + readFileSync(join(HERE, 'stage.js'), 'utf8')
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = `
.fp-svg .ep-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.fp-svg .ep-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.fp-svg .ep-acc{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.fp-svg .ep-hmi{fill:var(--anatomy-text);font-family:var(--anatomy-mono);font-weight:600}
.ep-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.96}
.ep-plate{fill:var(--anatomy-shade-3);stroke:var(--anatomy-mid);stroke-width:.6;vector-effect:non-scaling-stroke}
.ep-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:.8;vector-effect:non-scaling-stroke}
.ep-slot{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.5;vector-effect:non-scaling-stroke}
.ep-key{fill:var(--anatomy-shade-1);stroke:var(--anatomy-hi);stroke-width:.8;vector-effect:non-scaling-stroke}
.ep-lens{fill:var(--anatomy-shade-1);stroke:var(--anatomy-hi);stroke-width:.7;vector-effect:non-scaling-stroke}
.ep-lens[data-lit],[data-lit]>.ep-lens{fill:var(--fp-accent);stroke:var(--fp-accent)}
.ep-led{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:.6;vector-effect:non-scaling-stroke}
.ep-led[data-lit]{fill:var(--fp-accent);stroke:var(--fp-accent)}
.ep-hole{fill:var(--anatomy-shade-1);stroke:none}
.ep-beam{fill:none;stroke:var(--fp-accent);stroke-width:1.6;stroke-linecap:round;stroke-dasharray:4 4;vector-effect:non-scaling-stroke}
.ep-field{fill:none;stroke:var(--fp-accent);stroke-width:1.2;vector-effect:non-scaling-stroke}
.ep-cone{fill:color-mix(in srgb,var(--fp-accent) 20%,transparent);stroke:var(--fp-accent);stroke-width:1;vector-effect:non-scaling-stroke}
.ep-limit{fill:none;stroke:var(--anatomy-text);stroke-width:1.3;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}
.ep-glow{fill:var(--fp-accent);stroke:none}
.ep-skin{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.9;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.ep-sleeve{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:.9;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.ep-tag{fill:var(--anatomy-card);stroke:var(--fp-accent);stroke-width:1.2;vector-effect:non-scaling-stroke}
.ep-meter{stroke:none;fill:var(--anatomy-shade-2)}
.ep-meter[data-c="acc"]{fill:var(--fp-accent)}
.ep-meter[data-c="lo"]{fill:var(--anatomy-mid)}
.ep-axis{fill:none;stroke:var(--anatomy-mid);stroke-width:1.2}
.ep-win{fill:color-mix(in srgb,var(--fp-accent) 14%,transparent);stroke:var(--anatomy-text);stroke-width:1.2;stroke-dasharray:4 3}
.ep-curve{fill:none;stroke:var(--anatomy-text);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
.ep-curve[data-c="acc"]{stroke:var(--fp-accent)}
.ep-rule{fill:none;stroke:var(--fp-hair);stroke-width:1}
.ep-ring{fill:none;stroke:var(--fp-accent);stroke-width:2;vector-effect:non-scaling-stroke}
.ep-dark .iso-top{fill:var(--anatomy-shade-1)}
.ep-dark .iso-shade{fill:var(--anatomy-shade-0)}
.ep-lit .iso-fill,.ep-lit .iso-top,.ep-lit .iso-shade{fill:var(--fp-accent)}
.ep-drop{fill:var(--anatomy-lit-top);stroke:var(--fp-accent);stroke-width:.8;vector-effect:non-scaling-stroke}
.ep-flow{fill:none;stroke:var(--fp-accent);stroke-width:1.6;stroke-dasharray:3 6;stroke-linecap:round;vector-effect:non-scaling-stroke}
.ep-spin{fill:none;stroke:var(--fp-accent);stroke-width:1.6;stroke-linecap:round;vector-effect:non-scaling-stroke}
`;

const label = {
  nl: 'Een montageplek op een werktafel. Links achter twee bakken met beugels van 6 en 8 mm, elk met een pick-to-light-lampje en een lichtstraal over de opening. In het midden een mal met een aanslag en een pen die alleen in de schuine hoek van de behuizing past, een lichtstraal over de behuizing en een spanklem. Erboven een sensorbrug, een pers die een lager inperst en een schroefmachine aan een arm. Rechts achter de PLC-kast met scherm, signaallamp en overbruggingssleutel. Vooraan een afkeurbak, referentiedelen en de afvoerbak. Panelen tonen de tellingen, de krachtcurve, de PFMEA, de escapes en het reactieplan.',
  en: 'An assembly station on a work table. At the back left two bins of 6 and 8 mm brackets, each with a pick-to-light lamp and a light beam across its opening. In the middle a fixture with a stop and a pin that fits only the chamfered corner of the housing, a light beam across the housing and a clamp. Above it a sensor bridge, a press that presses in a bearing and a nutrunner on an arm. At the back right the PLC cabinet with a screen, a signal tower and a bypass key. In front a reject bin, reference parts and the outfeed tray. Panels show the counts, the force curve, the PFMEA, the escapes and the reaction plan.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
}
