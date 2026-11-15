// Dev tool, not shipped. The things of the workshop in the module intro film "Eén frame, zes
// verbindingen / One frame, six ways of joining" (eng.joining.intro), drawn with the shared pm world
// (films/_pm/world.mjs, read-only) and the anatomy kit: the frame of the filling unit (two uprights
// and a beam, the field film's frame) on a work platform, with its welds, the plate hung from the
// beam on four bolts and the plastic cover on top; a MIG/MAG welder with a gas bottle; a pedestal spot
// welder with its control; a table with the tools of the topics; the robot and the jig of the weld
// cell; a light curtain. Simple solids at person scale (the frame is 1.6 m high, a person 1.65 m), no
// detail the story does not need. World units are centimetres, as in world.mjs.
//
//   import { workshopWorld, WORKSHOP_CSS } from './workshop.mjs';
//   const s = workshopWorld(w, k, G, P);   // w: pmWorld(k, G, P)
//   s.parts({ cueG, g })                   // { ... } the parts, each an SVG string in the order the caller paints
//
// The caller wraps what the stage script shows or hides in data-k groups (g) and what a sentence
// lights in data-cue groups (cueG); this file does both for its own parts.
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
  const S = (paths, style) => k.solidSvg(paths, style);
  const at = (p) => k.iso(p, P);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const rectD = (u0, v0, u1, v1) => `M${f1(u0)} ${f1(v0)}H${f1(u1)}V${f1(v1)}H${f1(u0)}Z`;
  const ball = (c, r, tone = 'hi') => S(G.sphereOf(c, r, P, { steps: 20 }), { tone, crease: 'none' });
  const poly = (pts) => 'M' + pts.map((p) => at(p).map(f1).join(' ')).join('L');

  // ---- where things stand (cm). The frame of the filling unit stands on a work platform at the left: two
  // uprights and a beam across at the top (the field film's frame, 150 high, the beam to 160). A MIG/MAG welder
  // (power source with the wire feeder on it, and the gas bottle) stands right of it, the pedestal spot welder
  // at the back right with its control, the table with the tools of the topics at the front right.
  const UP = { l: 34, r: 104, y: 40, w: 8, d: 8, top: 150, beam: 160, z0: 5 };
  const BEAM = { x: UP.l, y: UP.y, w: UP.r + UP.w - UP.l, d: UP.d };
  const FACE = UP.y + UP.d; // the front face of the frame, where the plate hangs
  const PLATE = { x: 52, w: 46, z0: 100, z1: 146 };
  const HOLES = [[63, 114], [87, 114], [63, 132], [87, 132]];
  const BOLTS = [[57, 142.5], [93, 142.5], [57, 103.5], [93, 103.5]];
  const HAND = [122, 57, 149]; // where the welder's hand holds the torch, the right corner of the frame
  const CORNER = [112, FACE + 1, 151]; // the weld the torch is on
  const TABLE = { x: 132, y: 112, w: 112, d: 44, h: 74 };
  const SHEET = { x: 140, y: 120, z: TABLE.h };

  const platform = () => w.box({ x: 18, y: 28, w: 112, d: 34, r: 2 }, 0, UP.z0, { tone: 'lo' }, { steps: 1 });
  const frame = () => [
    w.box({ x: UP.l, y: UP.y, w: UP.w, d: UP.d, r: 1 }, UP.z0, UP.top, { tone: 'mid' }, { steps: 1 }),
    w.box({ x: UP.r, y: UP.y, w: UP.w, d: UP.d, r: 1 }, UP.z0, UP.top, { tone: 'mid' }, { steps: 1 }),
    w.box({ ...BEAM, r: 1 }, UP.top, UP.beam, { tone: 'mid' }, { steps: 1 }),
  ].join('');
  const welds = () => [UP.l, UP.r].map((x) => w.box({ x: x - 2, y: UP.y - 2, w: UP.w + 4, d: UP.d + 4, r: 2.5 }, UP.top - 5, UP.beam + 2, { tone: 'hi' }, { steps: 1 })).join('');
  const plate = () => w.box({ x: PLATE.x, y: FACE, w: PLATE.w, d: 3.2, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 1 })
    + Dt(HOLES.map(([x, z]) => at([x, FACE + 3.3, z])), { size: 2.1, tone: 'lo' });
  const bolts = () => Dt(BOLTS.map(([x, z]) => at([x, FACE + 3.5, z])), { size: 2.9, tone: 'hi' });
  const cover = () => w.box({ x: UP.l - 6, y: UP.y - 4, w: BEAM.w + 12, d: UP.d + 8, r: 7 }, UP.beam, UP.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
  // the glue bead: a row of dots along the foot of the cover, on its front and its right side
  const bead = () => {
    const y1 = UP.y - 4 + UP.d + 8;
    const x1 = UP.l - 6 + BEAM.w + 12;
    return Dt([...Array(12).keys()].map((i) => at([UP.l - 4 + i * 7.6, y1 + 0.3, UP.beam + 1.2])).concat([...Array(4).keys()].map((i) => at([x1 + 0.3, UP.y - 1 + i * 6, UP.beam + 1.2]))), { size: 1.7, tone: 'lo' });
  };

  // the MIG/MAG welder: the power source with the wire feeder on it, the gas bottle, a cable to the torch
  const mig = () => [
    w.box({ x: 150, y: 8, w: 28, d: 24, r: 2 }, 0, 70, { tone: 'mid' }, { steps: 1, bevel: 0.4 }),
    w.box({ x: 153, y: 11, w: 22, d: 18, r: 2 }, 70, 90, { tone: 'lo' }, { steps: 1 }),
    w.post(192, 20, 6.5, 0, 128, { tone: 'lo' }, 16), w.post(192, 20, 3, 128, 136, { tone: 'hi' }, 12),
    L(poly([[160, 30, 90], [150, 44, 60], [134, 60, 90], [HAND[0], HAND[1], HAND[2] - 3]]), { tone: 'lo' }),
  ].join('');
  const torch = () => w.bar(HAND, [CORNER[0] + 1, CORNER[1] + 1, CORNER[2] - 0.5], 1.5, { tone: 'lo' })
    + w.bar([CORNER[0] + 1, CORNER[1] + 1, CORNER[2] - 0.5], CORNER, 2.4, { tone: 'hi' });
  const arc = () => Dt([[CORNER[0] - 1.2, CORNER[1] + 1.6, CORNER[2] + 0.6], [CORNER[0] + 1.8, CORNER[1] + 1.6, CORNER[2] + 2], [CORNER[0], CORNER[1] + 2, CORNER[2] - 1.6]].map(at), { size: 3.2, tone: 'hi' });
  // the welder: the shared person (a work vest) reaching with the torch hand, in a welding helmet and gloves
  const welder = (x, y) => {
    const fig = w.person({ x, y, role: 'teamlead', along: 'x', reach: HAND });
    const helmet = ball([x + 0.5, y + 0.5, 162], 13.4, 'lo') + w.box({ x: x - 7, y: y + 9, w: 15, d: 6, r: 2 }, 154, 166, { tone: 'mid' }, { steps: 1 });
    const gloves = ball(HAND, 4.6, 'lo') + w.box({ x: x - 24.9, y: y - 4.4, w: 8.8, d: 8.8, r: 3 }, 86, 96, { tone: 'lo' }, { steps: 1 });
    if (!fig.endsWith('</g>')) throw new Error('cast: a figure is one group');
    return fig.slice(0, -4) + helmet + gloves + '</g>';
  };

  // the pedestal spot welder: a column, two arms with a copper tip each, two overlapping sheets between the tips
  const SP = { tipX: 217, y: 24 };
  const spot = () => [
    w.box({ x: 244, y: 16, w: 16, d: 26, r: 2 }, 0, 130, { tone: 'mid' }, { steps: 2, bevel: 0.4 }),
    w.box({ x: 212, y: SP.y, w: 40, d: 10, r: 1.5 }, 90, 98, { tone: 'mid' }, { steps: 1 }),
    w.box({ x: 212, y: SP.y, w: 40, d: 10, r: 1.5 }, 119, 127, { tone: 'mid' }, { steps: 1 }),
  ].join('');
  const tips = () => w.post(SP.tipX, SP.y + 5, 3.2, 98, 106, { tone: 'hi' }, 12) + w.post(SP.tipX, SP.y + 5, 3.2, 111, 119, { tone: 'hi' }, 12);
  const sheets = () => w.box({ x: 202, y: 18, w: 26, d: 22, r: 0.4 }, 106, 108.4, { tone: 'lo' }, { steps: 1 })
    + w.box({ x: 208, y: 18, w: 26, d: 22, r: 0.4 }, 108.4, 110.8, { tone: 'hi' }, { steps: 1 });
  const lens = () => Dt([[SP.tipX, SP.y + 5], [SP.tipX + 8, SP.y - 1], [SP.tipX + 8, SP.y + 11]].map(([x, y]) => at([x, y, 111])), { size: 2.5, tone: 'hi' });
  // the control of the spot welder, with the stepper curve on its screen (a staircase of rising current)
  const control = () => {
    const body = w.box({ x: 266, y: 14, w: 16, d: 28, r: 1 }, 0, 112, { tone: 'mid' }, { steps: 1, bevel: 0.4 });
    const stairs = [[-39, -76], [-36, -76], [-36, -80], [-33, -80], [-33, -84], [-30, -84], [-30, -88], [-27, -88], [-27, -92], [-24, -92], [-24, -96], [-21, -96]];
    const path = 'M' + stairs.map(([u, v]) => `${u} ${v}`).join('L');
    const screen = `<g transform="${w.planeX(282.4)}"><path class="pm-screen" d="${rectD(-41, -101, -19, -73)}"/><path class="pm-code" d="${path}"/></g>`;
    return { body, screen };
  };

  // the table with the tools of the topics (one set per scene, shown by the stage script)
  const table = () => w.table(TABLE);
  // the drawing is not here: the frame is the field film's. On the table: the tool of each topic.
  const tig = () => w.bar([146, 128, TABLE.h + 3], [176, 128, TABLE.h + 8], 1.8, { tone: 'lo' }) + w.bar([176, 128, TABLE.h + 8], [184, 128, TABLE.h + 10], 1.1, { tone: 'hi' })
    + w.box({ x: 252, y: 122, w: 16, d: 12, r: 2 }, 0, 6, { tone: 'lo' }, { steps: 1 }) + w.bar([260, 124, 6], [260, 132, 12], 3, { tone: 'mid' });
  const print = () => {
    const s = w.sheet({ x: SHEET.x + 4, y: SHEET.y, z: SHEET.z, lines: 0 });
    return s.svg + `<g transform="${s.face}"><circle class="pm-rule" cx="10.5" cy="9" r="4.4"/><circle class="pm-rule" cx="10.5" cy="9" r="2.2"/><path class="pm-rule" d="M3 19H18M3 21.6H14"/></g>`;
  };
  const pen = () => w.post(150, 132, 3.4, TABLE.h, TABLE.h + 17, { tone: 'hi' }, 12) + w.post(150, 132, 2.2, TABLE.h + 17, TABLE.h + 21, { tone: 'lo' }, 10);
  const ut = () => {
    const body = w.box({ x: 172, y: 122, w: 22, d: 16, r: 1 }, TABLE.h, TABLE.h + 12, { tone: 'mid' }, { steps: 1, bevel: 0.4 });
    const screen = `<g transform="${w.planeTop(174, 124, TABLE.h + 12.2)}"><path class="pm-screen" d="${rectD(0, 0, 18, 12)}"/><path class="pm-code" d="M2 9L6 3L9 8L13 4L16 9"/></g>`;
    return body + screen + w.box({ x: 198, y: 126, w: 8, d: 6, r: 1 }, TABLE.h, TABLE.h + 6, { tone: 'hi' }, { steps: 1 });
  };
  const nut = () => w.post(150, 132, 2.6, TABLE.h, TABLE.h + 22, { tone: 'lo' }, 10)
    + w.bar([150, 132, TABLE.h + 22], [186, 132, TABLE.h + 22], 3.6, { tone: 'mid' })
    + w.post(186, 132, 2.3, TABLE.h + 14, TABLE.h + 22, { tone: 'hi' }, 10);
  const mixer = () => w.box({ x: 146, y: 126, w: 30, d: 12, r: 1.5 }, TABLE.h + 4, TABLE.h + 16, { tone: 'mid' }, { steps: 1 })
    + w.post(152, 140, 2.2, TABLE.h, TABLE.h + 9, { tone: 'lo' }, 10)
    + w.bar([176, 132, TABLE.h + 10], [196, 132, TABLE.h + 10], 3.4, { tone: 'hi' })
    + w.bar([196, 132, TABLE.h + 10], [222, 132, TABLE.h + 10], 1.8, { tone: 'lo' })
    + Dt([199, 203, 207, 211, 215, 219].map((x) => at([x, 132, TABLE.h + 12])), { size: 1.1, tone: 'hi' });

  // the weld cell: the jig (stops at the feet, clamps at the beam ends) and the robot with its torch at the corner
  const jig = () => [UP.l, UP.r].map((x) => w.box({ x: x - 4, y: UP.y - 4, w: UP.w + 8, d: 3, r: 0.5 }, UP.z0, UP.z0 + 17, { tone: 'lo' }, { steps: 1 })
    + w.box({ x: x - 4, y: UP.y + UP.d + 1, w: UP.w + 8, d: 3, r: 0.5 }, UP.z0, UP.z0 + 17, { tone: 'lo' }, { steps: 1 })).join('')
    + w.box({ x: UP.l - 9, y: UP.y + 1, w: 7, d: 6, r: 0.8 }, UP.top + 1, UP.beam - 1, { tone: 'lo' }, { steps: 1 })
    + w.box({ x: UP.r + UP.w + 2, y: UP.y + 1, w: 7, d: 6, r: 0.8 }, UP.top + 1, UP.beam - 1, { tone: 'lo' }, { steps: 1 });
  const robot = () => {
    const J = [[122, 82, 30], [118, 70, 98], [113, 60, 146]];
    return w.post(122, 82, 12, 0, 26, { tone: 'lo' }, 16) + ball(J[0], 8, 'hi')
      + w.bar(J[0], J[1], 5.4, { tone: 'mid' }) + ball(J[1], 6, 'hi')
      + w.bar(J[1], J[2], 4.2, { tone: 'mid' }) + ball(J[2], 4.2, 'hi')
      + w.bar(J[2], [CORNER[0] + 1.5, CORNER[1] + 1.5, CORNER[2] - 0.5], 1.5, { tone: 'lo' })
      + w.bar([CORNER[0] + 1.5, CORNER[1] + 1.5, CORNER[2] - 0.5], CORNER, 2.4, { tone: 'hi' });
  };
  // the light curtain at the loading side of the cell: two posts with beams of light between them
  const curtain = () => {
    const x0 = 14;
    const x1 = 126;
    const y = 128;
    return w.post(x0, y, 2.4, 0, 124, { tone: 'lo' }, 10) + w.post(x1, y, 2.4, 0, 124, { tone: 'lo' }, 10)
      + [30, 60, 90, 120].map((z) => L(poly([[x0, y, z], [x1, y, z]]), { tone: 'faint' })).join('');
  };

  // the parts in painting order: back to front
  function parts({ cueG, g }) {
    const c = control();
    return {
      back: cueG('spot', spot()) + cueG('sheets', sheets()) + cueG('tips', tips()) + g('lensK', cueG('lens', lens())),
      control: c.body + cueG('stepper', c.screen),
      mig: cueG('mig', mig()),
      platform: cueG('posit', platform()),
      frame: g('jigK', cueG('jig', jig())) + cueG('frame', frame()) + g('plateK', cueG('plate', plate()) + cueG('bolts', bolts()))
        + g('coverK', cueG('cover', cover()) + cueG('bead', bead())) + g('weldsK', cueG('welds', welds())),
      robot: g('robotK', cueG('robot', robot())),
      welder: (x, y) => g('pp-welder', welder(x, y)) + g('torchK', cueG('torch', torch())) + g('arcK', cueG('arc', arc())),
      table: cueG('table', table()),
      tools: g('t-tig', cueG('tig', tig())) + g('t-spot', cueG('print', print())) + g('t-def', cueG('pen', pen()) + cueG('ut', ut()))
        + g('t-bolt', cueG('nut', nut())) + g('t-glue', cueG('mix', mixer())),
      curtain: g('curtainK', cueG('curtain', curtain())),
    };
  }
  return { parts, at, L };
}
