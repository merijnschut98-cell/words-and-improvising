// Dev tool, not shipped. The things of the workshop in the module intro film "De plaat
// in de werkplaats / The plate in the workshop" (eng.machining.intro), drawn with the shared
// pm world (films/_pm/world.mjs, read-only) and the anatomy kit: a milling machine with a
// vise, the plate (a block first, then the milled plate, then four holes), a wall of tools in
// holders, a control with a screen, a lathe with a bar, a block of steel on a table with the drawing, the measured plate and a micrometer. Simple solids at person scale
// (the machines are 1.9 m high, a person 1.65 m), no detail the story does not need. World
// units are centimetres, as in world.mjs.
//
//   import { workshopWorld, WORKSHOP_CSS } from './workshop.mjs';
//   const s = workshopWorld(w, k, G, P);   // w: pmWorld(k, G, P)
//   s.parts({ cueG, g })                   // { mill, rack, control, lathe, stock, table }
//
// Each part is an SVG string in the order the caller paints it. The caller wraps what the
// stage script shows or hides in data-k groups (g) and what a sentence lights in data-cue
// groups (cueG); this file does both for its own parts.
export const WORKSHOP_CSS = `
.pm-cross{fill:none;stroke:var(--anatomy-hi);stroke-width:1.2;stroke-linecap:round}
.pm-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:.6}
.pm-code{fill:none;stroke:var(--anatomy-hi);stroke-width:.9;stroke-linecap:round}
[data-cue][data-on] .pm-cross,[data-cue][data-on] .pm-code{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-screen{fill:var(--fp-focus-shade)}
`;

export function workshopWorld(w, k, G, P) {
  const L = (d, style) => k.lineSvg(d, style);
  const Dt = (points, style) => k.dotsSvg(points, style);
  const at = (p) => k.iso(p, P);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const rectD = (u0, v0, u1, v1) => `M${f1(u0)} ${f1(v0)}H${f1(u1)}V${f1(v1)}H${f1(u0)}Z`;

  // ---- where things stand (cm). The milling machine is at the back wall at the left, its table at z 64; the vise on
  // it holds the plate between two jaws; the spindle hangs above the plate's middle. The wall of tools hangs on the
  // back wall right of the mill, the control with its screen stands at the mill's right front corner. The lathe is at
  // the back wall at the right, its bar along x. The pallet with the block stands between the control and the table,
  // the table with the drawing at the front right.
  const PLATE = { x: 38, y: 34, w: 46, d: 36 }; // the plate lies flat in the vise: 46 long, 36 wide
  const TOP = 75; // the milled plate's top
  const HOLES = [[50, 44], [72, 44], [50, 60], [72, 60]];
  const SPINDLE = [61, 52];
  const TABLE = { x: 24, y: 112, w: 100, d: 46, h: 74 };
  const SHEET = { x: 32, y: 120, z: TABLE.h };
  const PLATE_T = { x: 64, y: 122, w: 34, d: 26 };

  const mill = () => [
    w.box({ x: 14, y: 8, w: 90, d: 70, r: 2 }, 0, 58, { tone: 'lo' }, { steps: 2 }),
    w.box({ x: 20, y: 22, w: 78, d: 52, r: 1.5 }, 58, 64, { tone: 'mid' }, { steps: 2 }),
    w.box({ x: 28, y: 8, w: 62, d: 20, r: 2 }, 64, 188, { tone: 'mid' }, { steps: 3, bevel: 0.5 }),
    w.box({ x: 34, y: 22, w: 52, d: 44, r: 3 }, 138, 188, { tone: 'mid' }, { steps: 3, bevel: 0.5 }),
    w.post(SPINDLE[0], SPINDLE[1], 8, 112, 138, { tone: 'lo' }, 18),
  ].join('');

  // the vise (two jaws and a base), the plate in it (a block, then the milled plate), the tools in the spindle
  const viseBase = () => w.box({ x: 30, y: 30, w: 62, d: 44, r: 1 }, 64, 68, { tone: 'lo' }, { steps: 1 });
  const jawBack = () => w.box({ x: 30, y: 32, w: 8, d: 40, r: 1 }, 68, 82, { tone: 'lo' }, { steps: 1 });
  const jawFront = () => w.box({ x: 84, y: 32, w: 8, d: 40, r: 1 }, 68, 82, { tone: 'lo' }, { steps: 1 });
  const blank = () => w.box({ ...PLATE, r: 1 }, 68, 84, { tone: 'hi' }, { steps: 2 });
  const plate = () => w.box({ ...PLATE, r: 1.5 }, 68, TOP, { tone: 'hi' }, { steps: 2 });
  const holes = () => Dt(HOLES.map(([x, y]) => at([x, y, TOP + 0.1])), { size: 2.3, tone: 'lo' });
  const datum = () => `<g transform="${w.planeTop(PLATE.x, PLATE.y, TOP + 0.3)}"><path class="pm-cross" d="M-10 0H18M0 -10V18"/><circle class="pm-cross" cx="0" cy="0" r="3"/></g>`;
  const spEnd = () => w.post(SPINDLE[0], SPINDLE[1], 3.2, 84, 112, { tone: 'hi' }, 12);
  const spDrill = () => w.post(SPINDLE[0], SPINDLE[1], 2.4, 84, 112, { tone: 'hi' }, 12);
  const spCentre = () => w.post(SPINDLE[0], SPINDLE[1], 2.4, 96, 112, { tone: 'hi' }, 12);

  // the wall of tools: a board, two rows of three holders; each holder carries a tool tip. The four tools the film
  // names hang at the front of the rows (face mill, end mill, centre drill, twist drill), two more are spares.
  const RACK_X = [122, 136, 150];
  const RACK_Y = 8;
  const rackBoard = () => w.box({ x: 110, y: 0, w: 48, d: 4, r: 1 }, 66, 186, { tone: 'lo' }, { steps: 2 });
  const holder = (x, z0, z1) => w.post(x, RACK_Y, 4.4, z0, z1, { tone: 'lo' }, 12);
  const holders = () => [[0, 150, 176], [1, 150, 176], [2, 150, 176], [0, 96, 118], [1, 96, 118], [2, 96, 118]].map(([c, a, b]) => holder(RACK_X[c], a, b)).join('');
  const tip = (c, r, z0, z1, tone = 'hi') => w.post(RACK_X[c], RACK_Y, r, z0, z1, { tone }, 14);

  const control = () => {
    const body = w.box({ x: 106, y: 66, w: 14, d: 24, r: 1 }, 100, 128, { tone: 'mid' }, { steps: 2, bevel: 0.4 });
    const stem = w.box({ x: 110, y: 76, w: 6, d: 6, r: 1 }, 0, 100, { tone: 'lo' }, { steps: 1 });
    // the screen on the +x face (plane x = 120.4): local (u, v) = (-y, -z)
    const rules = [[-120, 20], [-116, 14], [-112, 18], [-108, 10]].map(([v, len]) => `M${f1(-87)} ${v}H${f1(-87 + len)}`).join('');
    const screen = `<g transform="${w.planeX(120.4)}"><path class="pm-screen" d="${rectD(-89, -125, -67, -103)}"/><path class="pm-code" d="${rules}"/></g>`;
    return { stem, body, screen };
  };

  const lathe = () => [
    w.box({ x: 176, y: 10, w: 108, d: 38, r: 2 }, 0, 64, { tone: 'lo' }, { steps: 2 }),
    w.box({ x: 172, y: 12, w: 116, d: 34, r: 2 }, 64, 70, { tone: 'mid' }, { steps: 2 }),
    w.box({ x: 176, y: 14, w: 36, d: 30, r: 2 }, 70, 122, { tone: 'mid' }, { steps: 3, bevel: 0.4 }),
    w.bar([212, 29, 98], [222, 29, 98], 15, { tone: 'lo' }),
    w.box({ x: 246, y: 44, w: 24, d: 16, r: 1 }, 70, 96, { tone: 'mid' }, { steps: 2 }),
  ].join('');
  const bar = () => w.bar([222, 29, 98], [268, 29, 98], 7.5, { tone: 'hi' }) + w.bar([268, 29, 98], [282, 29, 98], 5, { tone: 'hi' });
  const insert = () => w.box({ x: 252, y: 38, w: 12, d: 7, r: 0.6 }, 92, 100, { tone: 'hi' }, { steps: 1 });

  // the block of steel lies on the table where the plate will lie later, beside the drawing
  const stock = () => w.box({ x: PLATE_T.x, y: PLATE_T.y - 1, w: 34, d: 26, r: 1.5 }, TABLE.h, TABLE.h + 22, { tone: 'hi' }, { steps: 2 });

  const sheet = () => {
    const s = w.sheet({ x: SHEET.x, y: SHEET.y, z: SHEET.z, lines: 0 });
    const drawn = `<g transform="${s.face}"><path class="pm-rule" d="M3 4H18V15H3Z"/>`
      + [[6, 7], [15, 7], [6, 12], [15, 12]].map(([x, y]) => `<circle class="pm-rule" cx="${x}" cy="${y}" r="1.1"/>`).join('')
      + '<path class="pm-rule" d="M3 19H18M3 21.6H14M3 24.2H17"/></g>';
    return s.svg + drawn;
  };
  const plateT = () => w.box({ ...PLATE_T, r: 1 }, TABLE.h, TABLE.h + 4, { tone: 'hi' }, { steps: 2 })
    + Dt([[72, 128], [90, 128], [72, 141], [90, 141]].map(([x, y]) => at([x, y, TABLE.h + 4.1])), { size: 2, tone: 'lo' });
  // a micrometer: a C-shaped frame with an anvil below, a spindle above and a thimble on it
  const mic = () => w.box({ x: 108, y: 127, w: 4, d: 8, r: 0.6 }, TABLE.h, TABLE.h + 26, { tone: 'hi' }, { steps: 1 })
    + w.box({ x: 100, y: 127, w: 12, d: 8, r: 0.6 }, TABLE.h + 22, TABLE.h + 26, { tone: 'hi' }, { steps: 1 })
    + w.box({ x: 100, y: 127, w: 4, d: 8, r: 0.6 }, TABLE.h, TABLE.h + 4, { tone: 'mid' }, { steps: 1 })
    + w.post(102, 131, 2.4, TABLE.h + 26, TABLE.h + 34, { tone: 'mid' }, 10);

  // the parts in painting order: back to front
  function parts({ cueG, g }) {
    const c = control();
    return {
      mill: mill()
        + g('spEnd', spEnd()) + g('spDrill', spDrill()) + g('spCentre', spCentre())
        + cueG('vise', viseBase() + jawBack())
        + g('blankK', cueG('blank', blank())) + g('plateK', cueG('plateM', plate()))
        + g('holesK', cueG('holes', holes())) + g('datumK', cueG('datum', datum()))
        + cueG('vise', jawFront()),
      rack: cueG('rack', rackBoard()
        + cueG('holders', holders())
        + cueG('tFace', tip(0, 7, 138, 150)) + cueG('tEnd', tip(1, 3.2, 120, 150)) + cueG('tCentre', tip(2, 2.2, 132, 150))
        + cueG('tTwist', tip(0, 2.6, 80, 96)) + cueG('spare', tip(1, 2.6, 84, 96, 'mid') + tip(2, 3.4, 80, 96, 'mid'))),
      control: c.stem + c.body + cueG('screen', c.screen),
      lathe: cueG('lathe', lathe()) + cueG('bar', bar()) + cueG('insert', insert()),
      table: cueG('table', w.table(TABLE)) + cueG('sheet', sheet()) + g('stockK', cueG('stock', stock())) + g('plateTK', cueG('plateT', plateT())) + cueG('mic', mic()),
    };
  }
  return { parts, at, L };
}
