// Dev tool, not shipped. The shared world of the Projects (pm) films: people
// and documents, not machines. Plan: docs/superpowers/plans/2026-11-07-v14-explainer-films.md,
// 3.7 ("People films use the kit's flat-iso people … a meeting table, a wall
// board, documents that fill in, and a calendar strip").
//
//   import { pmWorld, CAST, PM_CSS } from '../_pm/world.mjs';
//   const w = pmWorld(k, G, P);      // k: anatomy iso-kit, G: kit/lathe.mjs, P: the projection
//   w.room(...), w.board(...), w.table(...), w.person(...), w.sheet(...), w.calendar(...)
//
// Every builder returns an SVG string drawn with the anatomy kit (solids with
// the kit's four-tone shading, lines that end on edges, a halo under what
// stands on the floor), so a pm film reads like the engineering films. The
// caller paints back to front: walls, what hangs on them, people behind the
// table, the table and what lies on it, people in front of it.
//
// World units are centimetres: x to the right, y toward the viewer, z up. The
// room's back wall is the plane y = 0 (its face looks at +y), the side wall the
// plane x = 0 (its face looks at +x). Things on a wall are drawn in the wall's
// plane through planeY / planeX: local (u, v) is (x, -z) on the back wall and
// (-y, -z) on the side wall.
//
// The recurring characters (CAST): "jij" the consultant, always in petrol (the
// pm-jij class, a muted tint of the accent, so a petrol cue on a part still
// stands out), the sponsor in a dark suit with a tie and grey hair, the team
// lead from the floor in a work vest with reflective bands, and the planner in
// a light jumper with a tablet. Their names are in both languages for the
// films' captions; each person is a cue group (data-cue = the key), so a film
// can light the one the narration names.

export const CAST = {
  jij: { nl: 'jij', en: 'you', role: { nl: 'de adviseur', en: 'the consultant' } },
  sponsor: { nl: 'de sponsor', en: 'the sponsor', role: { nl: 'opdrachtgever', en: 'client lead' } },
  teamlead: { nl: 'de teamleider', en: 'the team lead', role: { nl: 'van de vloer', en: 'from the floor' } },
  planner: { nl: 'de planner', en: 'the planner', role: { nl: 'maakt het rooster', en: 'makes the schedule' } },
};

// The people and paper styles. The jij jacket is a muted petrol, on every face
// tone, in both themes; a person's cue glow comes from the player's CSS.
export const PM_CSS = `
.pm-jij>.iso-fill,.pm-jij>.iso-top{fill:color-mix(in srgb,var(--fp-accent) 58%,var(--anatomy-top))}
.pm-jij>.iso-shade[data-shade="0"]{fill:color-mix(in srgb,var(--fp-accent) 62%,var(--anatomy-shade-0))}
.pm-jij>.iso-shade[data-shade="1"]{fill:color-mix(in srgb,var(--fp-accent) 56%,var(--anatomy-shade-1))}
.pm-jij>.iso-shade[data-shade="2"]{fill:color-mix(in srgb,var(--fp-accent) 50%,var(--anatomy-shade-2))}
.pm-jij>.iso-shade[data-shade="3"]{fill:color-mix(in srgb,var(--fp-accent) 44%,var(--anatomy-shade-3))}
.pm-paper{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:.5;stroke-linejoin:round}
.pm-board{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.6}
.pm-rule{fill:none;stroke:var(--anatomy-lo);stroke-width:.5;stroke-linecap:round}
.pm-cell{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.35}
.pm-hatch{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:.35}
.pm-pin{fill:var(--anatomy-mid)}
[data-cue][data-on] .pm-board,[data-cue][data-on] .pm-paper{stroke:var(--fp-accent);stroke-width:1}
[data-cue][data-on] .pm-cell{stroke:var(--fp-accent)}
`;

// k: the anatomy iso-kit module; G: kit/lathe.mjs; P: the film's projection.
export function pmWorld(k, G, P) {
  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const Dt = (points, style) => k.dotsSvg(points, style);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const box = (plan, z0, z1, style = {}, { steps = 3, bevel = 0, inner = '', extra = '' } = {}) => S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style, inner }) + extra;
  const post = (cx, cy, r, z0, z1, style = {}, steps = 16) => S(k.cylinder(cx, cy, r, z0, z1 - z0, P, steps), { tone: 'mid', crease: 'none', ...style });
  const halo = (plan) => `<path class="iso-halo" d="${k.haloOf(plan, 0, 2, P)}"/>`;
  const planeY = (y) => k.sideMatrix([0, y], 0, P, 'left'); // local (u, v) = (x, -z)
  const planeX = (x) => k.sideMatrix([x, 0], 0, P, 'right'); // local (u, v) = (-y, -z)
  const planeTop = (x, y, z) => k.topMatrix([x, y], z, P); // local (u, v) = (x - x0, y - y0)
  const rectD = (u0, v0, u1, v1) => `M${f1(u0)} ${f1(v0)}H${f1(u1)}V${f1(v1)}H${f1(u0)}Z`;
  const Y = [0, 1, 0];
  // a square bar between two world points (an arm, a pen)
  const bar = (from, to, half, style) => {
    const a = G.unit3(G.sub3(to, from));
    const side = Math.abs(a[1]) > 0.9 ? [1, 0, 0] : Y;
    const v = G.unit3(G.cross3(a, side));
    const F = G.frameOf(from, a, side, v);
    return S(G.prismOf(F, [[-half, -half], [half, -half], [half, half], [-half, half]], 0, G.len3(G.sub3(to, from)), P), { tone: 'mid', crease: 'none', ...style });
  };

  // ------------------------------------------------------------ the room
  // A floor with a skirting board along two walls, the back wall (y = 0) with a
  // dado rail, a socket and a wall clock, and the side wall (x = 0).
  function room({ w = 300, d = 240, h = 230 } = {}) {
    const out = [];
    out.push(box({ x: -10, y: -10, w: w + 10, d: d + 10, r: 1 }, -4, 0, { tone: 'lo' }, { steps: 2 }));
    // floor boards: seams across the floor, ending on the floor's edges
    const seams = [];
    for (let y = 30; y < d; y += 30) seams.push(`M${at([0, y, 0]).map(f1).join(' ')}L${at([w, y, 0]).map(f1).join(' ')}`);
    out.push(L(seams.join(''), { tone: 'faint' }));
    out.push(box({ x: -10, y: -10, w: 10, d: d + 10, r: 0.5 }, 0, h, { tone: 'lo' }, { steps: 2 }));
    out.push(box({ x: 0, y: -10, w, d: 10, r: 0.5 }, 0, h, { tone: 'lo' }, { steps: 2 }));
    // skirting boards and the dado rail on the back wall
    out.push(box({ x: 0, y: 0, w: 1.4, d, r: 0.2 }, 0, 8, { tone: 'lo' }, { steps: 1 }));
    out.push(box({ x: 0, y: 0, w, d: 1.4, r: 0.2 }, 0, 8, { tone: 'lo' }, { steps: 1 }));
    out.push(box({ x: 0, y: 0, w, d: 1.2, r: 0.2 }, 76, 79, { tone: 'lo' }, { steps: 1 }));
    // a double socket under the rail at the right
    out.push(box({ x: w - 52, y: 0, w: 16, d: 1.2, r: 0.6 }, 30, 38, { tone: 'mid' }, { steps: 2, extra: Dt([[w - 47, 1.3, 34], [w - 41, 1.3, 34]].map(at), { size: 0.5, tone: 'hi' }) }));
    return out.join('');
  }
  // a wall clock on the back wall at (x, z): rim, face, twelve ticks and two hands
  function clock(x, z, r = 12) {
    const F = G.frameOf([x, 0, z], Y, [1, 0, 0], [0, 0, 1]);
    const ticks = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r0 = i % 3 ? r * 0.72 : r * 0.62;
      ticks.push(`M${f1(x + Math.sin(a) * r0)} ${f1(-(z + Math.cos(a) * r0))}L${f1(x + Math.sin(a) * r * 0.82)} ${f1(-(z + Math.cos(a) * r * 0.82))}`);
    }
    return S(G.disc(0, 2.4, r, F, P, { steps: 40 }), { tone: 'mid' })
      + `<g transform="${planeY(2.5)}"><path class="pm-rule" d="${ticks.join('')}"/>`
      + `<path class="pm-rule" style="stroke-width:1.1" d="M${f1(x)} ${f1(-z)}L${f1(x + r * 0.45)} ${f1(-z + r * 0.2)}M${f1(x)} ${f1(-z)}L${f1(x - r * 0.12)} ${f1(-z - r * 0.62)}"/>`
      + `<circle class="pm-pin" cx="${f1(x)}" cy="${f1(-z)}" r="1"/></g>`;
  }

  // ------------------------------------------------------------ the wall board
  // A whiteboard on the back wall: an aluminium frame, the white face, a marker
  // tray with three markers and an eraser, and a magnet in each corner. Returns
  // { svg, face } where face is the transform of the board's face plane, for
  // drawing what is written on it (local u = x, v = -z), and area its box.
  function board({ x0 = 60, x1 = 230, z0 = 92, z1 = 196 } = {}) {
    const out = [];
    out.push(box({ x: x0, y: 0, w: x1 - x0, d: 2.6, r: 0.6 }, z0, z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 }));
    const face = planeY(2.65);
    const m = 2.4;
    out.push(`<g transform="${face}"><path class="pm-board" d="${rectD(x0 + m, -(z1 - m), x1 - m, -(z0 + m))}"/></g>`);
    out.push(Dt([[x0 + 5, 2.8, z1 - 5], [x1 - 5, 2.8, z1 - 5], [x0 + 5, 2.8, z0 + 5], [x1 - 5, 2.8, z0 + 5]].map(at), { size: 1.1, tone: 'mid' }));
    // the tray, with markers lying along it and an eraser at the right
    out.push(box({ x: x0 + 8, y: 0, w: x1 - x0 - 16, d: 7, r: 0.6 }, z0 - 4, z0 - 1.6, { tone: 'mid' }, { steps: 2 }));
    out.push(box({ x: x0 + 9, y: 5.2, w: x1 - x0 - 18, d: 1.6, r: 0.3 }, z0 - 1.6, z0 + 0.4, { tone: 'mid' }, { steps: 1 }));
    for (const [mx, len] of [[x0 + 18, 13], [x0 + 36, 13], [x0 + 52, 12]]) {
      out.push(S(G.disc(0, len, 1.1, G.frameOf([mx, 3.4, z0 - 0.4], [1, 0, 0], Y, [0, 0, 1]), P, { steps: 12 }), { tone: 'hi', crease: 'none' }));
    }
    out.push(box({ x: x1 - 34, y: 1.2, w: 14, d: 4.6, r: 0.8 }, z0 - 1.6, z0 + 2.4, { tone: 'lo' }, { steps: 2, extra: '' }));
    return { svg: out.join(''), face, area: { x0: x0 + m, x1: x1 - m, z0: z0 + m, z1: z1 - m } };
  }

  // ------------------------------------------------------------ the calendar strip
  // A wall calendar on the side wall (x = 0): a hanging rail, a strip of `weeks`
  // week cells in two rows of months, and its own small header rule. Returns
  // { svg, face, cell(i) } with cell(i) the local rectangle of week i (u, v).
  function calendar({ y0 = 40, z0 = 128, weeks = 15, cw = 9.2, ch = 18 } = {}) {
    const face = planeX(1.1);
    const u0 = -(y0 + weeks * cw) - 3;
    const u1 = -y0 + 3;
    const out = [];
    out.push(box({ x: 0, y: y0 - 4, w: 2, d: weeks * cw + 8, r: 0.4 }, z0 + ch + 12, z0 + ch + 15, { tone: 'mid' }, { steps: 1 }));
    const cells = [];
    const cell = (i) => { const u = -(y0 + (weeks - i) * cw); return [u + 0.6, -(z0 + ch), u + cw - 0.6, -z0]; };
    for (let i = 0; i < weeks; i++) { const [a, b, c, d] = cell(i); cells.push(`<path class="pm-cell" d="${rectD(a, b, c, d)}"/>`); }
    out.push(`<g transform="${face}"><path class="pm-paper" d="${rectD(u0, -(z0 + ch + 12), u1, -(z0 - 3))}"/>`
      + `<path class="pm-rule" d="M${f1(u0 + 3)} ${f1(-(z0 + ch + 6))}H${f1(u0 + 40)}M${f1(u1 - 30)} ${f1(-(z0 + ch + 6))}H${f1(u1 - 3)}"/>`
      + cells.join('') + '</g>');
    return { svg: out.join(''), face, cell };
  }

  // ------------------------------------------------------------ the table and chairs
  // A meeting table: four legs, an apron, a top with a bevel.
  function table({ x, y, w, d, h = 74 }) {
    const out = [halo({ x: x - 4, y: y - 4, w: w + 8, d: d + 8, r: 6 })];
    for (const [lx, ly] of k.corners({ x, y, w, d }, 7)) out.push(box({ x: lx - 2.4, y: ly - 2.4, w: 4.8, d: 4.8, r: 0.6 }, 0, h - 8, { tone: 'lo' }, { steps: 1 }));
    out.push(box({ x: x + 5, y: y + 5, w: w - 10, d: d - 10, r: 1 }, h - 9, h - 4, { tone: 'lo' }, { steps: 1 }));
    out.push(box({ x, y, w, d, r: 2.5 }, h - 4, h, { tone: 'mid' }, { steps: 3, bevel: 0.6 }));
    return out.join('');
  }
  // a chair pushed in, its back toward -y (behind the table) or toward +y
  function chair({ x, y, back = -1 }) {
    const out = [halo({ x: x - 22, y: y - 22, w: 44, d: 44, r: 10 })];
    const seat = { x: x - 22, y: y - 21, w: 44, d: 42, r: 3 };
    for (const [lx, ly] of k.corners(seat, 3)) out.push(post(lx, ly, 1.3, 0, 43, { tone: 'lo' }, 8));
    const backY = back < 0 ? seat.y : seat.y + seat.d - 3;
    if (back < 0) out.push(box({ x: x - 20, y: backY, w: 40, d: 3, r: 1 }, 50, 86, { tone: 'mid' }, { steps: 2 }));
    out.push(box(seat, 43, 47, { tone: 'mid' }, { steps: 3, bevel: 0.4 }));
    if (back > 0) out.push(box({ x: x - 20, y: backY, w: 40, d: 3, r: 1 }, 50, 86, { tone: 'mid' }, { steps: 2 }));
    return out.join('');
  }

  // ------------------------------------------------------------ paper on a table
  // A sheet (A4 is 21 by 29.7) lying at (x, y) on a top at height z, with
  // `lines` printed rule lines; returns { svg, face } (face: the sheet's plane,
  // local u, v from its corner, for what fills in on it).
  function sheet({ x, y, z, w = 21, d = 29.7, lines = 0 }) {
    const face = planeTop(x, y, z + 0.15);
    let rules = '';
    for (let i = 0; i < lines; i++) rules += `M2.5 ${f1(3 + i * 2.6)}H${f1(w - 2.5 - (i % 3) * 3)}`;
    return { svg: `<g transform="${face}"><path class="pm-paper" d="${rectD(0, 0, w, d)}"/>${rules ? `<path class="pm-rule" d="${rules}"/>` : ''}</g>`, face };
  }
  // a stack of n sheets, each a little turned, with a binder clip on top
  function stack({ x, y, z, n = 4 }) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const face = planeTop(x + (i % 2) * 0.8, y - i * 0.5, z + 0.3 * i);
      out.push(`<g transform="${face}"><path class="pm-paper" d="${rectD(0, 0, 21, 29.7)}"/></g>`);
    }
    out.push(box({ x: x + 7, y: y - 2, w: 6, d: 3, r: 0.5 }, z + 0.3 * n, z + 0.3 * n + 1.4, { tone: 'lo' }, { steps: 1 }));
    return out.join('');
  }
  // a cup of coffee: body, rim and handle
  function cup(x, y, z) {
    return post(x, y, 3.6, z, z + 8.5, { tone: 'hi' }, 18)
      + `<path class="pm-rule" d="${k.pathOf(k.circleRing(x, y, 2.8, 18).map(([px, py]) => at([px, py, z + 8.5])), true)}"/>`
      + box({ x: x + 3.2, y: y - 0.6, w: 2.4, d: 1.2, r: 0.4 }, z + 2.4, z + 6.6, { tone: 'hi' }, { steps: 1 });
  }
  // a laptop, open, its screen toward +y or -y
  function laptop({ x, y, z, toward = 1 }) {
    const base = { x: x - 16, y: y - 11, w: 32, d: 22, r: 1 };
    const keys = k.dotGrid(x - 12, y - (toward > 0 ? 6 : -1), 9, 3, 2.9, z + 1.6, P);
    const lidY = toward > 0 ? base.y : base.y + base.d - 1.2;
    const lid = box({ x: x - 16, y: lidY, w: 32, d: 1.2, r: 0.5 }, z + 1.6, z + 22, { tone: 'mid' }, { steps: 2 });
    const body = box(base, z, z + 1.6, { tone: 'mid' }, { steps: 2, extra: Dt(keys, { size: 0.45, tone: 'lo' }) });
    return toward > 0 ? lid + body : body + lid;
  }

  // ------------------------------------------------------------ people
  // A flat-iso person standing at (x, y): shoes, legs, a torso with its seams,
  // arms, a neck, a head with hair. along: the shoulder line ('x' or 'y').
  // role: a CAST key, which sets the clothes and what they hold. reach: a world
  // point the right hand reaches to (a marker on the board), or null.
  function person({ x, y, role, along = 'x', reach = null }) {
    const ax = along === 'x';
    const off = (s) => (ax ? [x + s, y] : [x, y + s]);
    const looks = {
      jij: { jacket: { tone: 'mid', className: 'pm-jij' }, legs: 'lo', hair: 'lo', head: 'hi' },
      sponsor: { jacket: { tone: 'lo' }, legs: 'lo', hair: 'hi', head: 'hi' },
      teamlead: { jacket: { tone: 'mid' }, legs: 'lo', hair: 'lo', head: 'hi' },
      planner: { jacket: { tone: 'hi' }, legs: 'mid', hair: 'mid', head: 'hi' },
    }[role];
    const out = [halo({ x: x - 16, y: y - 12, w: 32, d: 24, r: 10 })];
    // shoes and legs, the far one first (the viewer is toward +x, +y)
    for (const s of [-7, 7]) {
      const [px, py] = off(s);
      out.push(box(ax ? { x: px - 5, y: py - 5, w: 10, d: 14, r: 2.4 } : { x: px - 5, y: py - 5, w: 14, d: 10, r: 2.4 }, 0, 4.5, { tone: 'lo' }, { steps: 2 }));
      out.push(post(px, py, 6.4, 4, 84, { tone: looks.legs }, 14));
    }
    const half = ax ? { x: 16, y: 10 } : { x: 10, y: 16 };
    const torso = { x: x - half.x, y: y - half.y, w: 2 * half.x, d: 2 * half.y, r: 5.5 };
    const arm = (s) => { const [px, py] = off(s); return box({ x: px - 4, y: py - 4, w: 8, d: 8, r: 3 }, 90, 140, looks.jacket, { steps: 2 }); };
    let inner = L(k.sideSeam(torso, 136, P, 4), { tone: 'lo' });
    if (role === 'teamlead') inner += L(k.sideSeam(torso, 104, P, 4) + k.sideSeam(torso, 110, P, 4), { tone: 'hi' });
    if (role === 'planner') inner += L(k.sideSeam(torso, 86, P, 4), { tone: 'mid' });
    out.push(arm(-20.5));
    out.push(box(torso, 82, 144, looks.jacket, { steps: 4, bevel: 0.6, inner }));
    // the sponsor's tie on the front of the jacket
    if (role === 'sponsor') {
      const ty = ax ? y + half.y : y;
      const tx = ax ? x : x + half.x;
      out.push(box(ax ? { x: tx - 1.6, y: ty, w: 3.2, d: 0.8, r: 0.3 } : { x: tx, y: ty - 1.6, w: 0.8, d: 3.2, r: 0.3 }, 112, 141, { tone: 'hi' }, { steps: 1 }));
    }
    if (reach) {
      const [sx, sy] = off(20.5);
      out.push(bar([sx, sy, 136], reach, 3.8, { ...looks.jacket, tone: 'mid' }));
      out.push(S(G.sphereOf(reach, 3.4, P, { steps: 16 }), { tone: looks.head, crease: 'none' }));
    } else out.push(arm(20.5));
    // the planner holds a tablet at the chest
    if (role === 'planner') {
      const [px, py] = ax ? [x, y + half.y + 1] : [x + half.x + 1, y];
      out.push(box(ax ? { x: px - 10, y: py, w: 20, d: 1.4, r: 0.6 } : { x: px, y: py - 10, w: 1.4, d: 20, r: 0.6 }, 104, 128, { tone: 'lo' }, { steps: 2 }));
    }
    out.push(post(x, y, 4.4, 144, 150, { tone: looks.head }, 12));
    out.push(S(G.sphereOf([x - 1.4, y - 1.4, 163], 12, P, { steps: 28 }), { tone: looks.hair, crease: 'none' }));
    out.push(S(G.sphereOf([x + 0.5, y + 0.5, 160.5], 11.4, P, { steps: 28 }), { tone: looks.head, crease: 'none' }));
    return `<g data-cue="${role}">${out.join('')}</g>`;
  }

  return { at, box, post, bar, halo, planeY, planeX, planeTop, rectD, room, clock, board, calendar, table, chair, sheet, stack, cup, laptop, person };
}
