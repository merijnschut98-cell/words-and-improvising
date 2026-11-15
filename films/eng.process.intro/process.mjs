// Dev tool, not shipped. The things of the process plant in the module intro film "Van ketel naar tank / From
// kettle to tank" (eng.process.intro), drawn with the shared pm world (films/_pm/world.mjs, read-only) and the
// anatomy kit: along the back wall, from the right to the left, the way the product flows: a batch kettle with
// an agitator motor and a batch tag, a pump, a plate heat exchanger, a tank (the tank of line 3 in hall B, the
// field film films/eng.field.making) and the pipe that leaves through the left wall towards hall B, with a
// Coriolis meter on it. A Pt100 sits in the pipe between the heat exchanger and the tank. Equipment tags on the
// pump and the tank. In front: a pallet of sacks (what goes in), a floor drain (where product can go missing), a
// small pilot kettle on a table. Simple solids at person scale (the tank is 1.3 m high, a person 1.65 m), no
// detail the story does not need. World units are centimetres, as in world.mjs.
//
//   import { processWorld, PROCESS_CSS } from './process.mjs';
//   const s = processWorld(w, k, G, P);   // w: pmWorld(k, G, P)
//   s.parts({ cueG, g })                  // { kettle, line, tank, outlet, floor, pilot }
//
// Each part is an SVG string in the order the caller paints it. The caller wraps what the stage script shows or
// hides in data-k groups (g) and what a sentence lights in data-cue groups (cueG); this file does both for its
// own parts.
export const PROCESS_CSS = `
.pm-plate{fill:none;stroke:var(--anatomy-hi);stroke-width:1.1;stroke-linecap:round}
.pm-grate{fill:none;stroke:var(--anatomy-mid);stroke-width:.9;stroke-linecap:round}
[data-cue][data-on] :is(.pm-plate,.pm-grate){stroke:var(--fp-accent)}
`;

export function processWorld(w, k, G, P) {
  const Dt = (points, style) => k.dotsSvg(points, style);
  const at = (p) => k.iso(p, P);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();

  // ---- where things stand (cm). The product flows from the right to the left along the back wall:
  // kettle (x 218 to 262) -> pipe -> pump (170 to 198) -> pipe -> heat exchanger (120 to 158) -> pipe with the Pt100
  // -> tank (x 42 to 82) -> pipe through the left wall with the Coriolis meter. In front: the pallet of sacks at the
  // right, the drain at the left, the pilot kettle on its table in the middle.
  const KET = { x: 240, y: 42, r: 22 };
  const TANK = { x: 62, y: 42, r: 20, h: 130 };
  const PUMP = { x0: 170, x1: 198 };
  const HX = { x0: 120, x1: 158, y0: 30, y1: 54, h: 70 };
  const PIPE = { y: 42, low: 24, mid: 50, out: 40 };
  const PALLET = { x: 248, y: 72 };
  const DRAIN = { x: 70, y: 104, w: 34, d: 14 };
  const PTAB = { x: 126, y: 98, w: 34, d: 26, h: 30 };

  const kettle = () => [[-15, -13], [15, -13], [0, 15]].map(([dx, dy]) => w.post(KET.x + dx, KET.y + dy, 3, 0, 22, { tone: 'lo' }, 10)).join('')
    + w.post(KET.x, KET.y, KET.r, 22, 104, { tone: 'mid' }, 28)
    + w.post(KET.x, KET.y, KET.r - 2, 104, 110, { tone: 'lo' }, 24)
    + w.box({ x: KET.x - 7, y: KET.y - 7, w: 14, d: 14, r: 1.5 }, 110, 128, { tone: 'lo' }, { steps: 2 })
    + w.bar([KET.x, KET.y, 128], [KET.x, KET.y, 138], 1.6, { tone: 'hi' })
    // the batch tag on the front of the kettle: one batch, one number
    + w.box({ x: KET.x - 8, y: KET.y + KET.r - 0.5, w: 16, d: 1.4, r: 0.4 }, 58, 74, { tone: 'hi' }, { steps: 1 });

  const pipe = (x0, x1, z) => w.bar([x0, PIPE.y, z], [x1, PIPE.y, z], 3, { tone: 'lo' });
  const pump = () => w.box({ x: PUMP.x0, y: 32, w: PUMP.x1 - PUMP.x0, d: 20, r: 2 }, 4, 34, { tone: 'mid' }, { steps: 3, bevel: 0.5 })
    + w.post(184, 42, 8, 34, 42, { tone: 'lo' }, 16);
  // the equipment tag of the pump and of the tank: a small plate on the front, with a code line
  const tagPump = () => w.box({ x: 176, y: 51.4, w: 12, d: 1.4, r: 0.4 }, 10, 22, { tone: 'hi' }, { steps: 1 });
  const tagTank = () => w.box({ x: 56, y: TANK.y + TANK.r - 1.2, w: 12, d: 1.8, r: 0.4 }, 62, 74, { tone: 'hi' }, { steps: 1 });
  // the plate heat exchanger: a block with a stack of plates on its front face
  const hx = () => {
    const body = w.box({ x: HX.x0, y: HX.y0, w: HX.x1 - HX.x0, d: HX.y1 - HX.y0, r: 1.5 }, 0, HX.h, { tone: 'mid' }, { steps: 3, bevel: 0.6 });
    const lines = [126, 131, 136, 141, 146, 151].map((x) => `M${x} -8V-${HX.h - 8}`).join('');
    return body + `<g transform="${w.planeY(HX.y1 + 0.4)}"><path class="pm-plate" d="${lines}"/></g>`;
  };
  // the Pt100: a thin probe in the pipe between the heat exchanger and the tank, with a small head on top
  const pt100 = () => w.post(100, PIPE.y, 1.5, PIPE.mid + 3, PIPE.mid + 18, { tone: 'hi' }, 10)
    + w.box({ x: 96.5, y: PIPE.y - 3.5, w: 7, d: 7, r: 1.2 }, PIPE.mid + 18, PIPE.mid + 25, { tone: 'lo' }, { steps: 2 });
  const tank = () => w.post(TANK.x, TANK.y, TANK.r, 0, TANK.h, { tone: 'mid' }, 28)
    + w.post(TANK.x, TANK.y, TANK.r - 4, TANK.h, TANK.h + 5, { tone: 'lo' }, 24);
  // the Coriolis meter on the pipe to hall B: a block on the pipe with a bent tube on top
  const meter = () => w.box({ x: 14, y: 35, w: 20, d: 14, r: 2 }, PIPE.out - 8, PIPE.out + 8, { tone: 'mid' }, { steps: 3, bevel: 0.5 })
    + w.box({ x: 18, y: 38, w: 12, d: 8, r: 3 }, PIPE.out + 8, PIPE.out + 20, { tone: 'hi' }, { steps: 3, bevel: 0.6 });

  // the pallet with three sacks (what goes in)
  const sacks = () => w.box({ x: PALLET.x, y: PALLET.y, w: 40, d: 26, r: 1 }, 0, 8, { tone: 'lo' }, { steps: 1 })
    + w.box({ x: PALLET.x + 3, y: PALLET.y + 3, w: 16, d: 20, r: 5 }, 8, 26, { tone: 'hi' }, { steps: 3, bevel: 1 })
    + w.box({ x: PALLET.x + 21, y: PALLET.y + 3, w: 16, d: 20, r: 5 }, 8, 26, { tone: 'hi' }, { steps: 3, bevel: 1 })
    + w.box({ x: PALLET.x + 12, y: PALLET.y + 5, w: 16, d: 16, r: 5 }, 26, 42, { tone: 'hi' }, { steps: 3, bevel: 1 });
  // the floor drain: a dark grate in the floor
  const drain = () => {
    const slits = [0, 1, 2, 3, 4].map((i) => `M${DRAIN.x + 4 + i * 6.5} ${DRAIN.y + 2}V${DRAIN.y + DRAIN.d - 2}`).join('');
    return w.box({ x: DRAIN.x, y: DRAIN.y, w: DRAIN.w, d: DRAIN.d, r: 1 }, 0, 0.8, { tone: 'lo' }, { steps: 1 })
      + `<g transform="${w.planeTop(0, 0, 0.9)}"><path class="pm-grate" d="${slits}"/></g>`;
  };
  // the pilot kettle: a small kettle on a table, with a small agitator motor
  const pilot = () => w.table(PTAB)
    + w.post(PTAB.x + 17, PTAB.y + 13, 9, PTAB.h, PTAB.h + 40, { tone: 'mid' }, 20)
    + w.post(PTAB.x + 17, PTAB.y + 13, 8, PTAB.h + 40, PTAB.h + 44, { tone: 'lo' }, 16)
    + w.box({ x: PTAB.x + 13, y: PTAB.y + 9, w: 8, d: 8, r: 1 }, PTAB.h + 44, PTAB.h + 56, { tone: 'lo' }, { steps: 2 });

  // the parts in painting order: back to front (the product flows from the right to the left)
  function parts({ cueG, g }) {
    return {
      kettle: cueG('kettle', kettle()),
      line: cueG('pipe1', pipe(198, KET.x - KET.r, PIPE.low)) + cueG('pump', pump()) + cueG('tagP', tagPump())
        + cueG('pipe2', pipe(158, PUMP.x0, PIPE.low)) + cueG('hx', hx())
        + cueG('pipe3', pipe(82, HX.x0, PIPE.mid)) + cueG('pt', pt100()),
      tank: cueG('tank', tank()) + cueG('tagT', tagTank()),
      outlet: cueG('pipe4', pipe(0, TANK.x - TANK.r, PIPE.out)) + cueG('meter', meter()),
      floor: cueG('drain', drain()) + cueG('sacks', sacks()),
      pilot: g('pilotK', cueG('pilot', pilot())),
    };
  }
  return { parts, at };
}
