// Dev tool, not shipped. The things of the moulding shop in the module intro film "De kap uit de pers /
// The cover from the press" (eng.moulding.intro), drawn with the shared pm world (films/_pm/world.mjs,
// read-only) and the anatomy kit: an injection moulding press along the back wall (the clamp unit at the
// left with the rear platen, the moving platen, the mould and the fixed platen on four tie bars; the
// injection unit at the right with the nozzle, a barrel with heater bands, a hopper with a dryer on top
// and the drive), the temperature control unit beside the clamp with its hose to the mould, a control
// with a screen, a bin of granules, a table with the setting sheet, the cover and the boundary sample, and a trolley with a
// mould opened for maintenance (a hot runner block and a shot counter). Simple solids at person scale
// (the press is 1.4 m high to the top of its platens, a person 1.65 m), no detail the story does not
// need. World units are centimetres, as in world.mjs.
//
//   import { mouldingWorld, MOULDING_CSS } from './moulding.mjs';
//   const s = mouldingWorld(w, k, G, P);   // w: pmWorld(k, G, P)
//   s.parts({ cueG, g })                   // { press, tcu, control, bin, table, trolley }
//
// Each part is an SVG string in the order the caller paints it. The caller wraps what the stage script
// shows or hides in data-k groups (g) and what a sentence lights in data-cue groups (cueG); this file
// does both for its own parts.
export const MOULDING_CSS = `
.pm-chan{fill:none;stroke:var(--anatomy-hi);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.pm-screen{fill:var(--anatomy-shade-0);stroke:var(--anatomy-mid);stroke-width:.6}
.pm-code{fill:none;stroke:var(--anatomy-hi);stroke-width:.9;stroke-linecap:round}
[data-cue][data-on] .pm-chan,[data-cue][data-on] .pm-code{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-screen{fill:var(--fp-focus-shade)}
`;

export function mouldingWorld(w, k, G, P) {
  const Dt = (points, style) => k.dotsSvg(points, style);
  const at = (p) => k.iso(p, P);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const rectD = (u0, v0, u1, v1) => `M${f1(u0)} ${f1(v0)}H${f1(u1)}V${f1(v1)}H${f1(u0)}Z`;

  // ---- where things stand (cm). The press lies along the back wall: the clamp unit at the left (rear platen
  // 14 to 22, moving platen 80 to 88, the mould 88 to 128 with its parting line at 108, fixed platen 128 to
  // 136) on four tie bars (y 13 and 47, z 82 and 126), the injection unit at the right (nozzle, barrel along
  // x at z 104, hopper at x 196 to 210, drive at the end). The temperature control unit stands in front of the
  // clamp unit, the control and the bin of granules at the right front, the table with the sheet and the cover in
  // front of them, the trolley with the opened mould at the front left.
  const BAR_Y = [13, 47];
  const BAR_Z = [82, 126];
  const MOULD = { y: 18, d: 24, z0: 92, z1: 116 };
  const TABLE = { x: 150, y: 112, w: 112, d: 46, h: 74 };
  const COVER = { x: 180, y: 118, w: 42, d: 24, z1: 92 }; // the finished cover on the table
  const SHEET = { x: 154, y: 118, z: TABLE.h };
  const SAMPLE = { x: 232, y: 124, w: 28, d: 18 }; // the boundary sample: a cover on the limit between good and bad, kept at the machine

  const bed = () => w.box({ x: 10, y: 8, w: 244, d: 44, r: 2 }, 0, 72, { tone: 'lo' }, { steps: 2 });
  const platen = (x0, x1) => w.box({ x: x0, y: 10, w: x1 - x0, d: 42, r: 1.5 }, 72, 138, { tone: 'lo' }, { steps: 3 });
  const bars = (x0, x1, ys) => ys.flatMap((y) => BAR_Z.map((z) => w.bar([x0, y, z], [x1, y, z], 3, { tone: 'hi' }))).join('');
  const half = (x0, x1, tone) => w.box({ x: x0, y: MOULD.y, w: x1 - x0, d: MOULD.d, r: 1 }, MOULD.z0, MOULD.z1, { tone }, { steps: 2 });
  // the cooling channels: three runs of a serpentine on the front face of the moving half of the mould
  const channels = () => `<g transform="${w.planeY(MOULD.y + MOULD.d + 0.4)}"><path class="pm-chan" d="M91 -98H105V-104H91V-110H105"/></g>`;
  const nozzle = () => w.bar([136, 30, 104], [152, 30, 104], 4, { tone: 'hi' });
  const barrel = () => w.bar([152, 30, 104], [216, 30, 104], 8, { tone: 'mid' });
  const bands = () => [162, 178, 194].map((x) => w.box({ x, y: 21, w: 5, d: 18, r: 1 }, 95, 114, { tone: 'lo' }, { steps: 1 })).join('');
  const drive = () => w.box({ x: 216, y: 14, w: 36, d: 32, r: 2 }, 80, 128, { tone: 'mid' }, { steps: 3, bevel: 0.5 });
  // the hopper on the barrel, the dryer on top of it: a tall cylinder with a cap and a little dry-air unit at its side
  const hopper = () => w.box({ x: 196, y: 24, w: 14, d: 12, r: 1.5 }, 112, 134, { tone: 'mid' }, { steps: 2 });
  const dryer = () => w.post(203, 30, 10, 134, 182, { tone: 'hi' }, 20) + w.post(203, 30, 11.4, 182, 187, { tone: 'lo' }, 20)
    + w.box({ x: 214, y: 22, w: 16, d: 16, r: 1.5 }, 134, 160, { tone: 'lo' }, { steps: 2 }) + w.bar([210, 30, 148], [214, 30, 148], 2, { tone: 'mid' });

  const press = ({ cueG }) => [
    cueG('press', bed()
      + platen(14, 22)
      + cueG('cols', bars(22, 80, BAR_Y))
      + platen(80, 88)
      + cueG('cols', bars(88, 128, [BAR_Y[0]]))
      + cueG('mouldP', half(88, 108, 'mid') + half(108, 128, 'mid') + cueG('chan', channels()))
      + cueG('cols', bars(88, 128, [BAR_Y[1]]))
      + platen(128, 136)
      + cueG('inj', nozzle() + barrel() + bands() + drive() + cueG('hopper', hopper()))
      + cueG('dryer', dryer())),
  ].join('');

  // the temperature control unit: a cabinet in front of the clamp unit with a hose to the mould (a pipe in, a pipe out)
  const tcu = () => w.box({ x: 28, y: 62, w: 26, d: 22, r: 1.5 }, 0, 64, { tone: 'mid' }, { steps: 3, bevel: 0.5 })
    + w.box({ x: 32, y: 84, w: 10, d: 1, r: 0.4 }, 40, 52, { tone: 'hi' }, { steps: 1 })
    + w.bar([46, 62, 56], [94, 43, 100], 1.8, { tone: 'lo' });

  const control = () => {
    const body = w.box({ x: 140, y: 64, w: 14, d: 24, r: 1 }, 100, 128, { tone: 'mid' }, { steps: 2, bevel: 0.4 });
    const stem = w.box({ x: 144, y: 74, w: 6, d: 6, r: 1 }, 0, 100, { tone: 'lo' }, { steps: 1 });
    // the screen on the +x face (plane x = 154.4): local (u, v) = (-y, -z)
    const rules = [[-120, 20], [-116, 14], [-112, 18], [-108, 10]].map(([v, len]) => `M-81 ${v}H${-81 + len}`).join('');
    const screen = `<g transform="${w.planeX(154.4)}"><path class="pm-screen" d="${rectD(-83, -125, -61, -103)}"/><path class="pm-code" d="${rules}"/></g>`;
    return { stem, body, screen };
  };

  // the bin of granules: a box with a heap of granules on top (dots)
  const bin = () => w.box({ x: 252, y: 70, w: 30, d: 30, r: 2 }, 0, 34, { tone: 'hi' }, { steps: 2 })
    + Dt([[258, 78], [266, 76], [274, 80], [260, 88], [270, 90], [277, 94], [262, 95]].map(([x, y]) => at([x, y, 34.2])), { size: 2.1, tone: 'lo' });

  // the cover: a plastic housing with rounded corners, as the cover on the beam of the filling unit (eng.field.making)
  const cover = (x, y, z0, z1, tone = 'hi') => w.box({ x, y, w: COVER.w, d: COVER.d, r: 7 }, z0, z1, { tone }, { steps: 4, bevel: 1.2 });
  const flash = () => w.box({ x: COVER.x + COVER.w, y: COVER.y + 5, w: 4, d: 14, r: 0.4 }, TABLE.h + 6, TABLE.h + 7.4, { tone: 'lo' }, { steps: 1 });
  const sink = () => Dt([at([COVER.x + COVER.w / 2, COVER.y + COVER.d / 2, COVER.z1 + 0.2])], { size: 3.6, tone: 'lo' });
  // the boundary sample: a smaller cover on the table beside the good one, with a tag on its front (signed by quality)
  const sample = () => w.box({ x: SAMPLE.x, y: SAMPLE.y, w: SAMPLE.w, d: SAMPLE.d, r: 5 }, TABLE.h, TABLE.h + 12, { tone: 'hi' }, { steps: 3, bevel: 0.8 })
    + w.box({ x: SAMPLE.x + 8, y: SAMPLE.y + SAMPLE.d, w: 10, d: 1.2, r: 0.3 }, TABLE.h + 1, TABLE.h + 8, { tone: 'lo' }, { steps: 1 });

  const sheet = () => {
    const s = w.sheet({ x: SHEET.x, y: SHEET.y, z: SHEET.z, lines: 0 });
    const rows = [5, 9, 13, 17, 21, 25].map((v) => `<path class="pm-rule" d="M3 ${v}H${18 - (v % 3) * 2}"/>`).join('');
    return s.svg + `<g transform="${s.face}">${rows}</g>`;
  };

  // the trolley with a mould opened for maintenance: the cavity half, the core half with a hot runner block on top (with three heater
  // zones) and a shot counter on the corner of the cavity half. Shown from the moulds scene on.
  const TR = { x: 50, y: 104, w: 80, d: 48, h: 50 };
  const trolley = ({ cueG }) => w.box({ x: TR.x, y: TR.y, w: TR.w, d: TR.d, r: 2 }, 0, TR.h, { tone: 'lo' }, { steps: 2 })
    + w.box({ x: TR.x + 6, y: TR.y + 8, w: 32, d: 32, r: 1.5 }, TR.h, TR.h + 16, { tone: 'mid' }, { steps: 2 })
    + Dt([[16, 18], [28, 18], [16, 30], [28, 30]].map(([x, y]) => at([TR.x + x, TR.y + y, TR.h + 16.2])), { size: 2.6, tone: 'lo' })
    + cueG('counter', w.box({ x: TR.x + 12, y: TR.y + 41, w: 12, d: 7, r: 0.8 }, TR.h, TR.h + 9, { tone: 'hi' }, { steps: 2 })
      + Dt([at([TR.x + 18, TR.y + 48.2, TR.h + 5])], { size: 1.8, tone: 'lo' }))
    + w.box({ x: TR.x + 44, y: TR.y + 8, w: 32, d: 32, r: 1.5 }, TR.h, TR.h + 16, { tone: 'mid' }, { steps: 2 })
    + cueG('hotrunner', w.box({ x: TR.x + 50, y: TR.y + 16, w: 20, d: 16, r: 1 }, TR.h + 16, TR.h + 26, { tone: 'lo' }, { steps: 2 })
      + Dt([[54, 24], [60, 24], [66, 24]].map(([x, y]) => at([TR.x + x, TR.y + y, TR.h + 26.2])), { size: 2, tone: 'hi' }));

  // the parts in painting order: back to front
  function parts({ cueG, g }) {
    const c = control();
    return {
      press: press({ cueG }),
      bin: cueG('granules', bin()),
      tcu: cueG('tcu', tcu()),
      control: g('controlK', c.stem + c.body + cueG('screen', c.screen)),
      table: g('tableK', cueG('table', w.table(TABLE)) + cueG('card', sheet())
        + g('coverK', cueG('cover', cover(COVER.x, COVER.y, TABLE.h, COVER.z1)))
        + g('flashK', cueG('flash', flash())) + g('sinkK', cueG('sink', sink())) + g('sampleK', cueG('sample', sample()))),
      trolley: g('trolleyK', cueG('trolley', trolley({ cueG }))),
    };
  }
  return { parts, at, cover };
}
