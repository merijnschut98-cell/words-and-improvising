// Dev tool, not shipped. The things of the lab and the workshop in the module intro film "Het frame en zijn staal /
// The frame and its steel" (eng.mechanics.intro), drawn with the shared pm world (films/_pm/world.mjs, read-only)
// and the anatomy kit: the frame of the filling unit (two uprights and a beam, the field film's frame, with the
// plate on four bolts and the plastic cover) on a work platform, the tank behind it at the back wall (the field
// film's tank, the load), a sling with its tag on the cover, the crack in the right corner, a tensile test
// machine with a test bar, a rack of steel bars at the front left, and a table with a hardness tester and a microscope with a broken
// bar. Simple solids at person scale (the frame is 1.6 m high, a person 1.65 m), no detail the story does not
// need. World units are centimetres, as in world.mjs.
//
//   import { workshopWorld } from './workshop.mjs';
//   const s = workshopWorld(w, k, G, P);   // w: pmWorld(k, G, P)
//   s.parts({ cueG, g })                   // { ... } the parts, each an SVG string in the order the caller paints
//
// The caller wraps what the stage script shows or hides in data-k groups (g) and what a sentence
// lights in data-cue groups (cueG); this file does both for its own parts.
export const WORKSHOP_CSS = `
.pm-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:.6}
.pm-code{fill:none;stroke:var(--anatomy-hi);stroke-width:.9;stroke-linecap:round}
[data-cue][data-on] .pm-code{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-screen{fill:var(--fp-focus-shade)}
`;

export function workshopWorld(w, k, G, P) {
  const L = (d, style) => k.lineSvg(d, style);
  const Dt = (points, style) => k.dotsSvg(points, style);
  const S = (paths, style) => k.solidSvg(paths, style);
  const at = (p) => k.iso(p, P);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const ball = (c, r, tone = 'hi') => S(G.sphereOf(c, r, P, { steps: 10 }), { tone, crease: 'none' });
  const poly = (pts) => 'M' + pts.map((p) => at(p).map(f1).join(' ')).join('L');

  // ---- where things stand (cm). The frame of the filling unit stands on a work platform at the left: two
  // uprights and a beam across at the top (150 high, the beam to 160); the tank at the back wall behind it. The tensile
  // test machine stands at the back right, the rack of steel bars at the back middle, the table at the front right.
  const UP = { l: 34, r: 104, y: 40, w: 8, d: 8, top: 150, beam: 160, z0: 5 };
  const BEAM = { x: UP.l, y: UP.y, w: UP.r + UP.w - UP.l, d: UP.d };
  const FACE = UP.y + UP.d; // the front face of the frame, where the plate hangs
  const PLATE = { x: 52, w: 46, z0: 100, z1: 146 };
  const HOLES = [[63, 114], [87, 114], [63, 132], [87, 132]];
  const BOLTS = [[57, 142.5], [93, 142.5], [57, 103.5], [93, 103.5]];
  const TABLE = { x: 132, y: 112, w: 112, d: 44, h: 74 };
  const TM = { x: 200, y: 12, w: 48, d: 28 }; // the tensile test machine

  const platform = () => w.box({ x: 18, y: 28, w: 112, d: 34, r: 2 }, 0, UP.z0, { tone: 'lo' }, { steps: 1 });
  const frame = () => [
    w.box({ x: UP.l, y: UP.y, w: UP.w, d: UP.d, r: 1 }, UP.z0, UP.top, { tone: 'mid' }, { steps: 1 }),
    w.box({ x: UP.r, y: UP.y, w: UP.w, d: UP.d, r: 1 }, UP.z0, UP.top, { tone: 'mid' }, { steps: 1 }),
    w.box({ ...BEAM, r: 1 }, UP.top, UP.beam, { tone: 'mid' }, { steps: 1 }),
  ].join('');
  const plate = () => w.box({ x: PLATE.x, y: FACE, w: PLATE.w, d: 3.2, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 1 })
    + Dt(HOLES.map(([x, z]) => at([x, FACE + 3.3, z])), { size: 2.1, tone: 'lo' })
    + Dt(BOLTS.map(([x, z]) => at([x, FACE + 3.5, z])), { size: 2.9, tone: 'hi' });
  const cover = () => w.box({ x: UP.l - 6, y: UP.y - 4, w: BEAM.w + 12, d: UP.d + 8, r: 7 }, UP.beam, UP.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
  // the tank behind the frame, at the back wall (the load of the frame)
  const tank = () => w.post(138, 20, 16, 0, 96, { tone: 'mid' }, 24) + w.post(138, 20, 16, 96, 103, { tone: 'hi' }, 24);
  // the sling: a strap round each end of the beam (outside the plastic cover, which could not take the weight), the two
  // straps rising to a hook; the tag hangs on the left strap. The frame is lifted by its beam, to go to hall B
  const HOOK = [73, 44, 208];
  const STRAP = [[23, 44], [123, 44]];
  const sling = () => STRAP.map(([x, y]) => w.bar([x, y, 155], [x < 70 ? UP.l : UP.r + UP.w, y, 155], 1, { tone: 'lo' })
    + w.bar([x, y, 155], [x, y, 190], 1, { tone: 'lo' }) + w.bar([x, y, 190], HOOK, 1, { tone: 'lo' })).join('')
    + ball(HOOK, 5, 'hi') + w.box({ x: 17, y: 42.5, w: 12, d: 3, r: 0.6 }, 164, 178, { tone: 'hi' }, { steps: 1 });
  // the crack in the right corner of the frame, where the upright meets the beam
  const CR = [[105.5, 150], [110, 142], [105.5, 134], [110, 125]];
  const crack = () => CR.slice(1).map((p, i) => w.bar([CR[i][0], FACE + 0.8, CR[i][1]], [p[0], FACE + 0.8, p[1]], 0.9, { tone: 'lo' })).join('');

  // the tensile test machine: a base, two columns, a fixed top beam, a moving crosshead and the test bar between grips
  const tensile = () => [
    w.box({ ...TM, r: 2 }, 0, 14, { tone: 'mid' }, { steps: 1, bevel: 0.4 }),
    w.post(TM.x + 8, TM.y + 14, 3, 14, 132, { tone: 'lo' }, 12), w.post(TM.x + 40, TM.y + 14, 3, 14, 132, { tone: 'lo' }, 12),
    w.box({ x: TM.x, y: TM.y, w: TM.w, d: TM.d, r: 2 }, 132, 144, { tone: 'mid' }, { steps: 1, bevel: 0.4 }),
    w.box({ x: TM.x + 4, y: TM.y + 4, w: TM.w - 8, d: TM.d - 8, r: 1.5 }, 76, 86, { tone: 'mid' }, { steps: 1 }),
    w.post(TM.x + 24, TM.y + 14, 4.4, 14, 30, { tone: 'lo' }, 12), w.post(TM.x + 24, TM.y + 14, 4.4, 70, 76, { tone: 'lo' }, 12),
    w.post(TM.x + 24, TM.y + 14, 2.6, 30, 70, { tone: 'hi' }, 12),
  ].join('');
  // the rack of steel bars: a pallet at the front left with a stack of round bars lying on it (3, 2 and 1)
  const RK = { x: 2, y: 98, w: 62, d: 30 };
  const stock = () => w.box({ ...RK, r: 1 }, 0, 5, { tone: 'lo' }, { steps: 1 })
    + [[103.5, 9.5], [112.5, 9.5], [121.5, 9.5], [108, 18.5], [117, 18.5], [112.5, 27.5]]
      .map(([y, z]) => w.bar([5, y, z], [61, y, z], 4.5, { tone: 'hi' })).join('');

  // the table: the hardness tester (a base with a test block, a column and a head with the indenter) and the microscope
  // with a broken bar under it
  const table = () => w.table(TABLE);
  const hard = () => w.box({ x: 140, y: 122, w: 24, d: 20, r: 1 }, TABLE.h, TABLE.h + 4, { tone: 'lo' }, { steps: 1 })
    + w.box({ x: 146, y: 128, w: 12, d: 10, r: 1 }, TABLE.h + 4, TABLE.h + 9, { tone: 'hi' }, { steps: 1 })
    + w.post(160, 126, 2.4, TABLE.h + 4, TABLE.h + 34, { tone: 'mid' }, 12)
    + w.box({ x: 148, y: 120, w: 14, d: 12, r: 1.5 }, TABLE.h + 26, TABLE.h + 34, { tone: 'mid' }, { steps: 1 })
    + w.post(152, 126, 1.3, TABLE.h + 15, TABLE.h + 26, { tone: 'hi' }, 10);
  const micro = () => w.box({ x: 188, y: 122, w: 24, d: 20, r: 1 }, TABLE.h, TABLE.h + 3, { tone: 'lo' }, { steps: 1 })
    + w.box({ x: 194, y: 132, w: 12, d: 6, r: 0.8 }, TABLE.h + 3, TABLE.h + 7, { tone: 'hi' }, { steps: 1 })
    + w.post(192, 126, 2.2, TABLE.h + 3, TABLE.h + 34, { tone: 'mid' }, 12)
    + w.bar([192, 126, TABLE.h + 34], [201, 133, TABLE.h + 20], 2.6, { tone: 'hi' });

  // the parts in painting order: back to front
  function parts({ cueG, g }) {
    return {
      back: g('tankK', cueG('tank', tank())) + g('tensK', cueG('tens', tensile())),
      platform: platform(),
      frame: cueG('frame', frame()) + cueG('plate', plate()) + cueG('cover', cover()) + g('slingK', cueG('sling', sling())) + g('crackK', cueG('crack', crack())),
      table: cueG('table', table()),
      tools: g('stockK', cueG('stock', stock())) + g('t-hard', cueG('hard', hard())) + g('t-micro', cueG('micro', micro())),
    };
  }
  return { parts, at, L };
}
