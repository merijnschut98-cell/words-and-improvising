// Dev tool, not shipped. The things of the office corner, the workshop bench and the tank in the module intro film
// "Van tekening tot regeling / From drawing to control" (eng.drawings.intro), drawn with the shared pm world
// (films/_pm/world.mjs, read-only) and the anatomy kit: a drawing table at the front left with the drawing of the
// plate (the field film's plate with four holes: its front view, a side view, the tolerance frame at a hole and the
// title block bottom right), a workshop bench at the front right with the plate itself lying on it, and at the back
// the tank of the filling unit (the field film's tank) with its level transmitter on top, the control valve in the
// inlet pipe, the outlet pipe with a pump going to the unit, and a control screen on the wall with the level trend.
// Simple solids at person scale, no detail the story does not need. World units are centimetres, as in world.mjs.
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
.pm-sheetline{fill:none;stroke:var(--anatomy-mid);stroke-width:.5;stroke-linejoin:round}
.pm-sheetbox{fill:none;stroke:var(--anatomy-hi);stroke-width:.6}
[data-cue][data-on] .pm-code{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-screen{fill:var(--fp-focus-shade)}
[data-cue][data-on] .pm-sheetline,[data-cue][data-on] .pm-sheetbox{stroke:var(--fp-accent)}
`;

export function workshopWorld(w, k, G, P) {
  const L = (d, style) => k.lineSvg(d, style);
  const Dt = (points, style) => k.dotsSvg(points, style);
  const at = (p) => k.iso(p, P);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();

  // ---- where things stand (cm). The drawing table at the front left (the office corner), the workshop bench at the
  // front right, the tank at the back right with its pipes, the control screen on the back wall.
  const DT = { x: 8, y: 104, w: 116, d: 54, h: 74 };
  const SHEET = { x: 14, y: 109, z: DT.h, w: 104, d: 44 };
  const BENCH = { x: 152, y: 112, w: 92, d: 44, h: 74 };
  const PLATE = { x: 170, y: 116, w: 44, d: 36 };
  const HOLES = [[180, 124], [204, 124], [180, 144], [204, 144]];
  const TANK = { x: 246, y: 44, r: 21, h: 100 };
  const PIPE_Z = 22; // the outlet pipe runs at this height along y 44 to the left wall, to the unit
  const SCREEN = { x0: 92, x1: 150, z0: 104, z1: 152 };

  const drawingTable = () => w.table(DT);
  // the drawing of the plate on the table: the front view (a square with its four holes), a side view, the tolerance
  // frame at the right-hand hole with its leader, the title block bottom right with its rows
  const sheet = w.sheet({ ...SHEET, lines: 0 });
  const sheetLines = () => {
    const [x0, y0, x1, y1] = [30, 5, 66, 41];
    const holes = [[39, 14], [57, 14], [39, 32], [57, 32]];
    const ring = (u, v, r) => `M${f1(u + r)} ${v}A${r} ${r} 0 1 0 ${f1(u - r)} ${v}A${r} ${r} 0 1 0 ${f1(u + r)} ${v}`;
    return `<g transform="${sheet.face}"><path class="pm-sheetline" d="M${x0} ${y0}H${x1}V${y1}H${x0}Z${holes.map(([u, v]) => ring(u, v, 2.4)).join('')}M72 ${y0}H77V${y1}H72Z"/>`
      + `<path class="pm-sheetline" d="M${x0 - 4} ${y0 + 4}V${y1 - 4}M${x1 + 4} ${y0 + 4}V${y1 - 4}" style="stroke-dasharray:1.6 1.2"/></g>`;
  };
  const tframe = () => `<g transform="${sheet.face}"><path class="pm-sheetbox" d="M4 8H26V14H4ZM10 8V14M18 8V14"/><path class="pm-sheetline" d="M26 11L56 13.4"/></g>`;
  const tblock = () => `<g transform="${sheet.face}"><path class="pm-sheetbox" d="M80 34H104V42H80ZM80 37.4H104M80 40H104M92 34V42"/></g>`;

  // the plate lying on the workshop bench: the steel plate with its four holes
  const bench = () => w.table(BENCH);
  const plate = () => w.box({ ...PLATE, r: 0.8 }, BENCH.h, BENCH.h + 2.6, { tone: 'mid' }, { steps: 1 })
    + Dt(HOLES.map(([x, y]) => at([x, y, BENCH.h + 2.8])), { size: 3, tone: 'lo' });

  // the tank (the field film's tank, now the tank of the loop): a cylinder with a domed top
  const tank = () => w.post(TANK.x, TANK.y, TANK.r, 0, TANK.h, { tone: 'mid' }, 28) + w.post(TANK.x, TANK.y, TANK.r, TANK.h, TANK.h + 6, { tone: 'hi' }, 28);
  // the level transmitter on top of the tank (a small flange with a head)
  const lt = () => w.post(TANK.x - 9, TANK.y + 8, 3.2, TANK.h + 6, TANK.h + 16, { tone: 'lo' }, 12)
    + w.box({ x: TANK.x - 14, y: TANK.y + 3, w: 10, d: 10, r: 1.5 }, TANK.h + 16, TANK.h + 28, { tone: 'hi' }, { steps: 1 });
  // the inlet pipe out of the back wall at 150, with the control valve (a body and an air-driven dome), down into the tank
  const IN = [TANK.x + 6, TANK.y];
  const valve = () => w.bar([IN[0], 0, 150], [IN[0], IN[1], 150], 2.2, { tone: 'lo' })
    + w.bar([IN[0], IN[1], 150], [IN[0], IN[1], TANK.h + 6], 2.2, { tone: 'lo' })
    + w.box({ x: IN[0] - 6, y: 14, w: 12, d: 14, r: 1.5 }, 144, 158, { tone: 'mid' }, { steps: 1 })
    + w.post(IN[0], 21, 6, 158, 168, { tone: 'hi' }, 16) + w.post(IN[0], 21, 1.2, 168, 176, { tone: 'lo' }, 8);
  // the outlet pipe at the bottom of the tank to the left wall, with a pump on it
  const OUTX = 176;
  const pump = () => w.bar([TANK.x - TANK.r, TANK.y, PIPE_Z], [4, TANK.y, PIPE_Z], 2.4, { tone: 'lo' })
    + w.box({ x: OUTX - 12, y: TANK.y - 9, w: 24, d: 18, r: 3 }, PIPE_Z - 9, PIPE_Z + 9, { tone: 'mid' }, { steps: 2 })
    + w.post(OUTX + 22, TANK.y, 9, PIPE_Z - 9, PIPE_Z + 9, { tone: 'hi' }, 16) + w.bar([OUTX + 10, TANK.y, PIPE_Z], [OUTX + 22, TANK.y, PIPE_Z], 2.4, { tone: 'lo' });

  // the control screen on the back wall: the level trend, a dashed line for the setpoint (the streefwaarde), a bar of the valve output
  const screen = () => {
    const box = w.box({ x: SCREEN.x0, y: 0, w: SCREEN.x1 - SCREEN.x0, d: 3, r: 0.8 }, SCREEN.z0, SCREEN.z1, { tone: 'lo' }, { steps: 2, bevel: 0.4 });
    const face = w.planeY(3.1);
    const [x0, x1, z0, z1] = [SCREEN.x0 + 3, SCREEN.x1 - 3, SCREEN.z0 + 3, SCREEN.z1 - 3];
    const midz = (z0 + z1) / 2 + 3;
    const trend = `M${x0 + 4} ${-(midz - 2)}L${x0 + 12} ${-(midz - 3)}L${x0 + 18} ${-(midz - 14)}L${x0 + 24} ${-(midz - 8)}L${x0 + 30} ${-(midz + 1)}L${x0 + 38} ${-(midz - 1)}L${x1 - 4} ${-midz}`;
    return box + `<g transform="${face}"><path class="pm-screen" d="M${x0} ${-z1}H${x1}V${-z0}H${x0}Z"/>`
      + `<path class="pm-code" d="${trend}"/><path class="pm-code" style="stroke-dasharray:2.4 1.8;opacity:.7" d="M${x0 + 3} ${-midz}H${x1 - 3}"/>`
      + `<path class="pm-code" d="M${x0 + 4} ${-(z0 + 4)}H${x0 + 22}M${x1 - 20} ${-(z0 + 4)}H${x1 - 4}"/></g>`;
  };

  // the parts in painting order: back to front
  function parts({ cueG, g }) {
    return {
      back: g('tankK', cueG('tank', tank()) + cueG('lt', lt())) + cueG('screen', screen()),
      pipes: cueG('valve', valve()) + cueG('pump', pump()),
      office: cueG('desk', drawingTable()) + cueG('sheet', sheet.svg + sheetLines()) + cueG('tframe', tframe()) + cueG('tblock', tblock()),
      bench: cueG('bench', bench()) + cueG('plate', plate()),
    };
  }
  return { parts, at, L };
}
