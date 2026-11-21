// Dev tool, not shipped. The things of hall B in the module intro film "Lijn 3
// verhuist / Line 3 moves", drawn with the shared pm world (films/_pm/world.mjs,
// read-only) and the anatomy kit: a packing line (a conveyor with cartons), the
// power cabinet with its cable, the switchboard on the wall, the marked floor of
// line 3 and a hard hat for the outside installer. Simple solids, no detail the
// story does not need. World units are centimetres, as in world.mjs.
//
//   import { hallWorld, HALL_CSS } from './hall.mjs';
//   const h = hallWorld(w, k, G, P);   // w: pmWorld(k, G, P)
//
// Every builder returns an SVG string; the caller wraps it in the cue groups
// (data-cue) and the toggles (data-k) of the film.
export const HALL_CSS = `
.pm-slab{fill:var(--anatomy-shade-1);stroke:none}
.pm-outline{fill:none;stroke:var(--anatomy-hi);stroke-width:1.1;stroke-dasharray:5 4;stroke-linejoin:round}
.pm-ghost{fill:none;stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:4 3;stroke-linejoin:round}
.pm-hat>.iso-fill,.pm-hat>.iso-top{fill:#C98B2B}
.pm-hat>.iso-shade[data-shade="0"]{fill:#B87A1F}
.pm-hat>.iso-shade[data-shade="1"]{fill:#AB6F1A}
.pm-hat>.iso-shade[data-shade="2"]{fill:#9E6416}
.pm-hat>.iso-shade[data-shade="3"]{fill:#915A12}
[data-cue][data-on] .pm-outline,[data-cue][data-on] .pm-ghost{stroke:var(--fp-focus);stroke-width:1.8}
[data-cue][data-on] .pm-slab{fill:var(--fp-focus-shade)}
`;

export function hallWorld(w, k, G, P) {
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const Dt = (points, style) => k.dotsSvg(points, style);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => k.iso(p, P);
  const rectD = (u0, v0, u1, v1) => `M${f1(u0)} ${f1(v0)}H${f1(u1)}V${f1(v1)}H${f1(u0)}Z`;

  // the painted floor of a line: a slab of new floor and the dashed outline of the machine
  function floorMark({ x, y, w: fw, d: fd }) {
    const face = w.planeTop(x, y, 0.2);
    return `<g transform="${face}"><path class="pm-slab" d="${rectD(0, 0, fw, fd)}"/><path class="pm-outline" d="${rectD(8, 8, fw - 8, fd - 8)}"/></g>`;
  }

  // a packing line: a machine bench with the belt on top and cartons on it, a control box on a post at the +x end
  function conveyor({ x, y, len = 160, dep = 40, cartons = 4, tone = 'mid' }) {
    const out = [];
    out.push(w.box({ x, y, w: len, d: dep, r: 2 }, 0, 50, { tone: 'lo' }, { steps: 2 }));
    out.push(w.box({ x: x - 2, y: y + 3, w: len + 4, d: dep - 6, r: 2 }, 50, 60, { tone }, { steps: 2 }));
    for (let i = 0; i < cartons; i++) out.push(w.box({ x: x + 8 + i * ((len - 40) / Math.max(1, cartons - 1)), y: y + dep / 2 - 9, w: 20, d: 18, r: 1 }, 60, 80, { tone: 'hi' }, { steps: 1 }));
    out.push(w.box({ x: x + len + 4, y: y + dep / 2 - 5, w: 8, d: 10, r: 1 }, 0, 92, { tone: 'lo' }, { steps: 1 }));
    out.push(w.box({ x: x + len + 1, y: y + dep / 2 - 8, w: 14, d: 16, r: 1.5 }, 92, 116, { tone: 'mid' }, { steps: 2 }));
    return out.join('');
  }

  // the power cabinet against the back wall: a tall grey cabinet with a door and a handle
  function cabinet({ x, y = 0, w: cw = 40, d: cd = 26, h = 124 }) {
    const plan = { x, y, w: cw, d: cd, r: 1 };
    const inner = L(k.sideSeam(plan, h - 12, P, 2) + k.sideSeam(plan, 14, P, 2), { tone: 'lo' });
    return w.box(plan, 0, h, { tone: 'mid' }, { steps: 3, bevel: 0.5, inner })
      + w.box({ x: x + cw - 8, y: y + cd, w: 3, d: 1.6, r: 0.4 }, 56, 70, { tone: 'hi' }, { steps: 1 })
      + w.box({ x: x + 6, y: y + cd, w: 12, d: 0.8, r: 0.3 }, h - 36, h - 24, { tone: 'lo' }, { steps: 1 });
  }

  // the cable on the floor, from a wall opening to the cabinet and on to the line; dashed = not connected yet
  function cable(points, { dashed = false } = {}) {
    return L(k.pathOf(points.map(([px, py]) => at([px, py, 0.4]))), { tone: dashed ? 'mid' : 'hi', dashed });
  }

  // the switchboard on the back wall (x from x0, width sw, between z0 and z1): a door and four rows of switches
  function switchboard({ x: x0, w: sw = 52, z0 = 96, z1 = 176 }) {
    const out = [];
    out.push(w.box({ x: x0, y: 0, w: sw, d: 9, r: 1 }, z0, z1, { tone: 'mid' }, { steps: 3, bevel: 0.4 }));
    const dots = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) dots.push(at([x0 + 9 + c * ((sw - 18) / 3), 9.4, z0 + 14 + r * ((z1 - z0 - 28) / 3)]));
    out.push(Dt(dots, { size: 1.4, tone: 'hi' }));
    out.push(L(`M${at([x0 + 4, 9.4, z1 - 6]).map(f1).join(' ')}L${at([x0 + sw - 4, 9.4, z1 - 6]).map(f1).join(' ')}`, { tone: 'lo' }));
    return out.join('');
  }
  // where the switchboard will hang: a dashed outline on the wall
  function switchboardGhost({ x: x0, w: sw = 52, z0 = 96, z1 = 176 }) {
    return `<g transform="${w.planeY(0.3)}"><path class="pm-ghost" d="${rectD(x0, -z1, x0 + sw, -z0)}"/></g>`;
  }

  // the installer's hard hat: a dome on the head and a brim, in the cast's own look (a cue part of the person)
  function hat(x, y) {
    return S(G.sphereOf([x, y, 165], 12.4, P, { steps: 20 }), { tone: 'mid', crease: 'none', className: 'pm-hat' })
      + S(G.disc(0, 1.8, 15.5, G.frameOf([x, y, 163], [0, 0, 1], [1, 0, 0], [0, 1, 0]), P, { steps: 24 }), { tone: 'mid', crease: 'none', className: 'pm-hat' });
  }

  return { floorMark, conveyor, cabinet, cable, switchboard, switchboardGhost, hat, at };
}
