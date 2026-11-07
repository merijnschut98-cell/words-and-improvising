// The stage of the film "Van staaf tot as / From bar to shaft": a pure function
// of (scene, u). Inlined into the page after the anatomy kit (iso-kit functions
// in scope, the lathe module as G) and a preamble from build.mjs that defines P
// (projection), C (world constants), CAM (one camera move per scene), BEATS
// (beat starts as a share of each scene), W and H.
/* global G, P, C, CAM, BEATS, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, translateAlong, span */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const X = [1, 0, 0];
  const Y = [0, 1, 0];
  const Z = [0, 0, 1];
  const TAU = Math.PI * 2;
  const { ST, PROF, STOCK, KEYS, HOLE_S } = C;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => iso(p, P);
  const V = G.viewOf(P);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const mark = (d, extra = '') => `<path class="fp-mark" d="${d}"${extra}/>`;
  let camW = W;
  const label = (x, y, text, size = 22, anchor = 'middle') => `<text class="fp-ink fp-label" x="${f1(x)}" y="${f1(y)}" font-size="${f1(size * camW / W)}" text-anchor="${anchor}">${text}</text>`;
  const arrowHead = (from, to, len) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    const l = len * camW / W;
    return `M${f1(to[0] - ux * l - uy * l * 0.55)} ${f1(to[1] - uy * l + ux * l * 0.55)}L${f1(to[0])} ${f1(to[1])}L${f1(to[0] - ux * l + uy * l * 0.55)} ${f1(to[1] - uy * l - ux * l * 0.55)}`;
  };
  // beat b of scene si starts at this share of the scene
  const beat = (si, b) => BEATS[si][Math.min(b, BEATS[si].length - 1)];

  // ------------------------------------------------------------ the shaft
  // s runs from the bearing-seat end (s = 0, at +x) to the chuck end (s = 240).
  const frameAt = (X0, y, z) => G.frameOf([X0, y, z], [-1, 0, 0], [0, 0, 1], [0, 1, 0]);
  function radiusAt(s) {
    let r = PROF[0][1];
    for (const [ks, kr] of PROF) if (ks <= s + 1e-9) r = kr;
    for (let i = 1; i < PROF.length; i++) {
      const [s0, r0] = PROF[i - 1];
      const [s1, r1] = PROF[i];
      if (s > s0 && s < s1 && s1 > s0) return r0 + ((r1 - r0) * (s - s0)) / (s1 - s0);
    }
    return r;
  }
  // the profile with the turning pass at s = c: finished for s < c, bar beyond
  function profileUpTo(c) {
    if (c <= 0.5) return STOCK;
    const out = PROF.filter(([s]) => s < c);
    out.push([c, radiusAt(c)], [c, STOCK[0][1]], [240, STOCK[0][1]]);
    return out;
  }
  const solid = (F, knots, tone = 'mid') => solidSvg(G.solidOf(knots, F, P), { tone, crease: 'lo' });
  // witness lines on the surface turn with the spindle, so a spinning part reads as spinning
  function spinLines(F, s0, s1, r, theta) {
    const lines = [];
    for (let k = 0; k < 6; k++) {
      const a = theta + (k * TAU) / 6;
      if (G.dot3(G.radialOf(F, a), V) < 0.2) continue;
      lines.push(pathOf([at(G.pointOf(F, s0, r, a)), at(G.pointOf(F, s1, r, a))]));
    }
    return lineSvg(lines.join(''), { tone: 'faint' });
  }
  // the keyway: a slot with round ends on top of the Ø40 body (r 20)
  function keywaySvg(F, from, to) {
    if (to - from < 0.5) return '';
    const w = C.KEY / 2;
    const top = 20.05;
    const pts = [];
    const a0 = from + w;
    const a1 = Math.max(a0, to - w);
    for (let i = 0; i <= 8; i++) { const t = -Math.PI / 2 + (i / 8) * Math.PI; pts.push([a1 + Math.cos(t) * w, Math.sin(t) * w]); }
    for (let i = 0; i <= 8; i++) { const t = Math.PI / 2 + (i / 8) * Math.PI; pts.push([a0 + Math.cos(t) * w, Math.sin(t) * w]); }
    const world = pts.map(([s, y]) => at([F.o[0] - s, F.o[1] + y, F.o[2] + top]));
    // the far wall of the slot shows as a band below its back edge
    const wall = pts.filter(([, y]) => y < -w + 0.5).map(([s, y]) => at([F.o[0] - s, F.o[1] + y, F.o[2] + top - 5]));
    return `<path class="fp-groove" d="${pathOf(world, true)}"/>` + (wall.length > 1 ? lineSvg(pathOf(wall), { tone: 'faint' }) : '');
  }
  function holeSvg(F, s) {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * TAU; pts.push(at([F.o[0] - s + Math.cos(t) * (C.HOLE / 2), F.o[1] + Math.sin(t) * (C.HOLE / 2), F.o[2] + 20.05])); }
    return `<path class="fp-groove" d="${pathOf(pts, true)}"/>`;
  }
  // the part as it is after `done` steps: 0 bar, 1 turned, 2 keyway, 3 cross hole
  function partSvg(F, done, opts = {}) {
    let out = solid(F, done >= 1 ? PROF : STOCK, opts.tone || 'mid');
    if (opts.theta !== undefined) out += spinLines(F, 100, done >= 1 ? 236 : 236, done >= 1 ? 20 : STOCK[0][1], opts.theta);
    return out;
  }

  // ------------------------------------------------------------ the chuck jaws (lathe)
  function jawsSvg(R, theta) {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const a = theta + (i * TAU) / 3;
      const F = G.frameOf([ST.lathe.CF, 0, 0], X, [0, Math.cos(a), Math.sin(a)], [0, -Math.sin(a), Math.cos(a)]);
      const facing = G.dot3(F.u, V);
      const html = solidSvg(G.prismOf(F, [[R + 16, -8], [R + 30, -8], [R + 30, 8], [R + 16, 8]], -0.5, 16, P), { tone: 'mid', crease: 'lo' })
        + solidSvg(G.prismOf(F, [[R, -7], [R + 16, -7], [R + 16, 7], [R, 7]], -0.5, 12, P), { tone: 'mid', crease: 'lo' });
      rows.push({ facing, html });
    }
    rows.sort((a, b) => a.facing - b.facing);
    return { back: rows.filter((r) => r.facing <= 0).map((r) => r.html).join(''), front: rows.filter((r) => r.facing > 0).map((r) => r.html).join('') };
  }

  // ------------------------------------------------------------ chips and sparks (deterministic in time)
  function chipPath(cx, cy, size, turn) {
    const outer = [];
    const inner = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const a = turn + t * TAU * 1.2;
      const r = size * (0.42 + 0.58 * t);
      const w = size * (0.12 + 0.18 * t);
      outer.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.66]);
      inner.push([cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.66]);
    }
    return pathOf(outer.concat(inner.reverse()), true);
  }
  function chipsSvg(tip, clockS, rate, size, dir = [10, 22, 26]) {
    let out = '';
    const period = 1 / rate;
    const k = G.scaleOf(P);
    for (let i = Math.max(0, Math.floor((clockS - 1.4) / period)); i * period <= clockS; i++) {
      const age = clockS - i * period;
      if (age > 1.4) continue;
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const p = [tip[0] + dir[0] * age * (0.6 + rnd), tip[1] + dir[1] * age, tip[2] + dir[2] * age - 60 * age * age];
      const [sx, sy] = at(p);
      const alpha = Math.min(1, age / 0.12) * (1 - clamp((age - 1.1) / 0.3, 0, 1));
      out += `<path class="fp-chip" style="opacity:${alpha.toFixed(2)}" d="${chipPath(sx, sy, size * k * (0.85 + 0.3 * rnd), rnd * 6.28 + age * 5)}"/>`;
    }
    return out;
  }
  function sparksSvg(p0, clockS) {
    const lines = [];
    for (let i = 0; i < 26; i++) {
      const seed = Math.sin(i * 78.233 + 1.7) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const age = (clockS * 1.8 + rnd) % 1;
      const dir = [(rnd - 0.5) * 120, 90 + 80 * rnd, -40 - 120 * rnd];
      const a = [p0[0] + dir[0] * age, p0[1] + dir[1] * age, p0[2] + dir[2] * age - 90 * age * age];
      const b = [a[0] - dir[0] * 0.08, a[1] - dir[1] * 0.08, a[2] - dir[2] * 0.08];
      lines.push(`<path class="fp-spark" style="opacity:${(1 - age).toFixed(2)}" d="${pathOf([at(b), at(a)])}"/>`);
    }
    return lines.join('');
  }

  // ------------------------------------------------------------ camera
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const w = lerp(c.from[2], c.to[2], k);
    camW = w;
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the cart: where it stands, and the part on it
  const CART_X = [150, 1160, 2210, 3060, 3900, 4350];
  // [from station, to station, move from u, to u, part on the cart until u] per scene
  const TRIP = [
    null,
    [0, 1, 0, 0.14, 0.16],
    null,
    [1, 2, 0, 0.16, 0.18],
    null,
    [2, 3, 0, 0.2, 0.3],
    [3, 4, 0, 0.16, 0.18],
    [4, 5, 0, 0.22, 2],
  ];
  const STAY = [0, 1, 1, 2, 2, 3, 4, 5];

  // ------------------------------------------------------------ tools in the machining centre
  // drawn at the head's rest pose: the spindle nose ends at z 126, the tool tip at z 26 (drill 22)
  const SX = ST.mill.SX;
  const TF = G.frameOf([SX, 0, 126], [0, 0, -1], [1, 0, 0], [0, -1, 0]);
  const holder = solidSvg(G.solidOf([[0, 22], [18, 22], [24, 12], [60, 12]], TF, P), { tone: 'mid', crease: 'lo' });
  function toolSvg(kind, spin) {
    if (!kind) return '';
    let body;
    let marks = '';
    if (kind === 'mill') {
      body = G.solidOf([[60, 5], [99, 5], [100, 4.4]], TF, P);
      for (let i = 0; i < 4; i++) {
        const a0 = spin + (i * TAU) / 4;
        const pts = [];
        for (let j = 0; j <= 8; j++) { const t = j / 8; const a = a0 + t * 1.6; if (G.dot3(G.radialOf(TF, a), V) > 0.1) pts.push(at(G.pointOf(TF, 64 + t * 34, 5, a))); }
        if (pts.length > 1) marks += pathOf(pts);
      }
    } else if (kind === 'drill') {
      body = G.solidOf([[60, 3.9], [100, 3.9], [104, 0.4]], TF, P);
      for (let i = 0; i < 2; i++) {
        const a0 = spin + i * Math.PI;
        const pts = [];
        for (let j = 0; j <= 12; j++) { const t = j / 12; const a = a0 + t * 3.2; if (G.dot3(G.radialOf(TF, a), V) > 0.1) pts.push(at(G.pointOf(TF, 66 + t * 34, 3.9, a))); }
        if (pts.length > 1) marks += pathOf(pts);
      }
    } else {
      body = G.solidOf([[60, 4], [99, 4], [100, 3.4]], TF, P);
      for (let i = 0; i < 6; i++) {
        const a = spin + (i * TAU) / 6;
        if (G.dot3(G.radialOf(TF, a), V) > 0.15) marks += pathOf([at(G.pointOf(TF, 70, 4, a)), at(G.pointOf(TF, 99, 4, a))]);
      }
    }
    return holder + solidSvg(body, { tone: 'hi', crease: 'lo', inner: lineSvg(marks, { tone: 'lo' }) });
  }

  // ------------------------------------------------------------ the routing strip and the furnace clock (HUD)
  const STEP = [0, 1, 1, 2, 2, 3, 4, 5];
  function route(si) {
    for (let i = 0; i < 5; i++) {
      const state = i < STEP[si] ? 'done' : i === STEP[si] ? 'now' : 'todo';
      const el = E[`node${i}`];
      if (el.getAttribute('data-state') !== state) el.setAttribute('data-state', state);
    }
    const last = Math.min(STEP[si], 4);
    const [x0, y0] = C.NODES[0];
    set(E.routeDone, last > 0 ? `<path class="fp-mark" style="stroke:var(--anatomy-hi);stroke-width:2.4" d="M${x0} ${y0}L${C.NODES[last][0]} ${y0}"/>` : '');
  }
  function clockSvg(turns, alpha) {
    if (alpha <= 0.01) return '';
    const cx = W - 60;
    const cy = 98;
    const a = turns * TAU;
    const ticks = Array.from({ length: 12 }, (_, i) => {
      const t = (i / 12) * TAU;
      return `M${f1(cx + Math.sin(t) * 24)} ${f1(cy - Math.cos(t) * 24)}L${f1(cx + Math.sin(t) * 29)} ${f1(cy - Math.cos(t) * 29)}`;
    }).join('');
    return `<g style="opacity:${alpha.toFixed(2)}"><circle class="fp-node" cx="${cx}" cy="${cy}" r="33"/><path class="fp-mark" d="${ticks}"/>`
      + `<path class="fp-mark" style="stroke:var(--anatomy-hi);stroke-width:2.4" d="M${cx} ${cy}L${f1(cx + Math.sin(a) * 21)} ${f1(cy - Math.cos(a) * 21)}"/>`
      + `<path class="fp-mark" style="stroke:var(--anatomy-hi);stroke-width:2.4" d="M${cx} ${cy}L${f1(cx + Math.sin(a / 12) * 13)} ${f1(cy - Math.cos(a / 12) * 13)}"/><circle class="fp-ink" cx="${cx}" cy="${cy}" r="3"/></g>`;
  }

  // ------------------------------------------------------------ render
  const MOVING = ['sawChips', 'lChips', 'lDim', 'mChips', 'sparks', 'fPart', 'mSpie', 'lShaft', 'lJawsB', 'lJawsF', 'mShaft', 'mKey', 'mHole', 'gShaft'];
  let shown = -1;
  function render(si, u) {
    if (si !== shown) { shown = si; route(si); }
    camera(si, u);
    const clockS = u * C.dur[si];
    const vis = new Set();

    // the cart and the part riding on it
    const trip = TRIP[si];
    let cx = CART_X[STAY[si]];
    let onCart = si === 7;
    if (trip) {
      cx = lerp(CART_X[trip[0]], CART_X[trip[1]], span(u, trip[2], trip[3]));
      onCart = u < trip[4];
    }
    // the furnace scene: the part goes in, and comes back out on the cart
    if (si === 5) onCart = u < 0.3 || u > beat(5, 1) + 0.08;
    move(E.cart, [cx, 0, 0]);
    if (onCart) {
      const cDone = si === 1 ? 0 : si === 3 ? 1 : si === 5 ? 3 : 3;
      const Fcs = frameAt(120, ST.cart.y, ST.cart.z + 8 + (cDone >= 1 ? 20 : 27.5));
      set(E.cTurn, partSvg(Fcs, cDone));
      set(E.cKey, cDone >= 2 ? keywaySvg(Fcs, KEYS[0], KEYS[1]) : '');
      set(E.cHole, cDone >= 3 ? holeSvg(Fcs, HOLE_S) : '');
      set(E.cSeat, si === 7 ? solid(Fcs, [[0, 16.6], [1, 17.6], [50, 17.6]]) : '');
    } else {
      set(E.cTurn, '');
      set(E.cKey, '');
      set(E.cHole, '');
      set(E.cSeat, '');
    }

    // ---- the saw: the bar waits on the rollers; the head comes down and cuts a piece off
    {
      const B = ST.saw.blade;
      const Fb = frameAt(ST.saw.X0, 0, 0);
      let cut = 0;
      let dz = 0;
      if (si === 0) {
        // the head comes down to the bar while the routing is named, then cuts
        const b1 = beat(0, 1);
        const b2 = beat(0, 2);
        cut = span(u, b2, 0.93);
        dz = -35 * span(u, b1 + 0.1, b2) - 70 * cut;
      }
      move(E.sawHead, [0, 0, dz]);
      const spin = clockS * 9;
      const F = G.frameOf([B, 0, 210], Y, Z, X);
      const teeth = [];
      for (let i = 0; i < 40; i++) {
        const a = spin + (i * TAU) / 40;
        teeth.push(pathOf([at(G.pointOf(F, 1.6, 128, a)), at(G.pointOf(F, 1.6, 138, a))]));
      }
      set(E.blade, solidSvg(G.disc(-1.5, 1.5, 140, F, P), { tone: 'hi', crease: 'lo', inner: lineSvg(teeth.join(''), { tone: 'lo' }) })
        + solidSvg(G.disc(1.5, 4, 34, F, P), { tone: 'mid', crease: 'lo' }));
      // the bar: before the cut it runs from the rollers to the end stop; after it, a piece lies free
      const barRest = solidSvg(G.solidOf([[0, 27.5], [ST.saw.X0 + 720, 27.5]], frameAt(ST.saw.X0, 0, 0), P), { tone: 'mid', crease: 'lo' });
      const piece = si === 0 && cut >= 0.999;
      const pieceGone = si > 0;
      let bar;
      if (!piece && !pieceGone) bar = barRest;
      else {
        bar = solidSvg(G.solidOf([[0, 27.5], [742, 27.5]], frameAt(B - 2, 0, 0), P), { tone: 'mid', crease: 'lo' });
        if (piece) bar += partSvg(frameAt(ST.saw.X0 + 14 * span(u, 0.93, 0.99), 0, 0), 0);
      }
      set(E.bar, bar);
      if (si === 0 && cut > 0.02 && cut < 0.999) {
        vis.add('sawChips');
        set(E.sawChips, chipsSvg([B, 20, -27.5 + 55 * (1 - cut)], clockS, 6, 2.6, [30, 50, -10]));
      }
    }

    // ---- the lathe: the bar spins in the chuck; the tool follows the contour
    if (si === 1 || si === 2) {
      const { X0, CF } = ST.lathe;
      const F = frameAt(X0, 0, 0);
      const inChuck = si === 2 || u >= TRIP[1][4];
      let c = si === 2 ? 240 : 0;
      let tip = [X0 + 14, 40, 0];
      let theta = 0;
      if (si === 1) {
        const t0 = beat(1, 1);
        const pass = span(u, t0, 0.9);
        c = 220 * pass;
        theta = clockS * 14 * span(u, 0.18, 0.26);
        if (pass > 0 && pass < 1) tip = [X0 - c, radiusAt(c), 0];
        else if (pass >= 1) tip = [lerp(X0 - 220, X0 + 40, span(u, 0.94, 0.99)), lerp(radiusAt(219), 46, span(u, 0.9, 0.94)), 0];
        else tip = [lerp(X0 + 14, X0 + 1, span(u, t0 - 0.06, t0)), lerp(40, STOCK[0][1] + 0.5, span(u, t0 - 0.06, t0)), 0];
        if (pass > 0.01 && pass < 0.99) {
          vis.add('lChips');
          set(E.lChips, chipsSvg([tip[0], tip[1] + 2, 2], clockS, 3, 4));
        }
      } else {
        tip = [X0 + 40, 46, 0];
      }
      if (inChuck) {
        ['lShaft', 'lJawsB', 'lJawsF'].forEach((key) => vis.add(key));
        const prof = si === 2 ? PROF : profileUpTo(c);
        let html = solid(F, prof);
        if (theta) html += spinLines(F, 228, 238, STOCK[0][1], theta) + (c < 200 ? spinLines(F, Math.max(c + 4, 100), 226, STOCK[0][1], theta) : '');
        set(E.lShaft, html);
        const jw = jawsSvg(STOCK[0][1], theta);
        set(E.lJawsB, jw.back);
        set(E.lJawsF, jw.front);
      }
      move(E.lCar, [tip[0] - (X0 + 14), 0, 0]);
      move(E.lSlide, [tip[0] - (X0 + 14), tip[1] - 40, 0]);
      if (si === 2) {
        // the diameter of the shoulder, with its tolerance in the readout
        vis.add('lDim');
        const xs = X0 - 82;
        const y = 34;
        const a = at([xs, y, -25]);
        const b = at([xs, y, 25]);
        const grow = span(u, 0.25, 0.4);
        const lp = at([xs - 4, y, 40]);
        set(E.lDim, `<g style="opacity:${grow.toFixed(2)}">` + mark(pathOf([at([xs, 0, 25]), at([xs, y + 6, 25])])) + mark(pathOf([at([xs, 0, -25]), at([xs, y + 6, -25])]))
          + mark(pathOf([a, b])) + mark(arrowHead(a, b, 8)) + mark(arrowHead(b, a, 8)) + label(lp[0], lp[1], 'Ø50', 22) + '</g>');
      }
    } else {
      move(E.lCar, [0, 0, 0]);
      move(E.lSlide, [0, 0, 0]);
    }

    // ---- the machining centre: the table carries the part under the spindle
    {
      const { X0 } = ST.mill;
      let dx = 0;
      let dz = 60;
      let kind = 'mill';
      let key = 0; // keyway length cut
      let hole = 0; // 0 none, 1 drilled, 2 reamed
      let spie = 0;
      let reaming = false;
      if (si === 3) {
        const b1 = beat(3, 1);
        const b2 = beat(3, 2);
        const b3 = beat(3, 3);
        dx = lerp(0, 20, span(u, 0.18, b1));
        dz = lerp(60, -11, span(u, b1 + 0.04, b1 + 0.12));
        const run = span(u, b1 + 0.14, b3 - 0.02);
        dx += 70 * run;
        key = 70 * run;
        dz = lerp(dz, 60, span(u, b3 - 0.02, b3 + 0.05));
        spie = span(u, b3 + 0.04, b3 + 0.2);
        if (run > 0.01 && run < 0.99) {
          vis.add('mChips');
          set(E.mChips, chipsSvg([SX - 4, 6, 18], clockS, 5, 2.2, [-30, 40, 40]));
        }
      } else if (si === 4) {
        key = 70;
        const b2 = beat(4, 2);
        dx = lerp(90, 106, span(u, 0.04, 0.16));
        kind = u < 0.1 ? 'mill' : u < b2 + 0.02 ? 'drill' : 'ream';
        reaming = kind === 'ream';
        if (kind === 'drill') {
          // peck drilling: down, out to clear the chips, then through
          const down = lerp(60, 0, span(u, 0.14, 0.2));
          const d1 = 30 * span(u, 0.2, 0.34);
          const out = span(u, 0.36, 0.4) - span(u, 0.41, 0.45);
          const depth = u < 0.45 ? d1 * (1 - out) : 30 + 20 * span(u, 0.46, b2 - 0.12);
          dz = lerp(down - depth, 60, span(u, b2 - 0.08, b2 - 0.02));
          hole = u > 0.25 ? 1 : 0;
        } else if (kind === 'ream') {
          dz = lerp(60, -51, span(u, b2 + 0.06, 0.9));
          dz = lerp(dz, 60, span(u, 0.92, 0.99));
          hole = 1 + (26 + dz < 19 ? 1 : 0);
        } else dz = 60;
        if (u > 0.3 && kind !== 'mill') hole = Math.max(hole, 1);
        if (kind === 'drill' && 22 + dz < 20) {
          vis.add('mChips');
          set(E.mChips, chipsSvg([SX + 4, 6, 20], clockS, 6, 1.8, [30, 40, 50]));
        }
      } else if (si > 4) {
        key = 70;
        hole = 2;
      }
      move(E.millTable, [dx, 0, 0]);
      move(E.millHead, [0, 0, dz]);
      const spin = clockS * 11;
      set(E.mTool, reaming ? holder : toolSvg(kind, spin));
      set(E.mReamer, reaming ? toolSvg('ream', spin) : '');
      const inVice = (si === 3 && u >= TRIP[3][4]) || si === 4;
      if (inVice) {
        const F = frameAt(X0, 0, 0);
        ['mShaft', 'mKey', 'mHole'].forEach((kk) => vis.add(kk));
        set(E.mShaft, solid(F, PROF));
        set(E.mKey, keywaySvg(F, KEYS[0], KEYS[0] + key));
        set(E.mHole, hole ? holeSvg(F, HOLE_S) : '');
        if (si === 3 && spie > 0) {
          vis.add('mSpie');
          // the key drops into its slot (shown, not part of the routing)
          const z0 = 20 + lerp(70, -3, spie);
          const s0 = KEYS[0] + 6;
          const s1 = KEYS[1] - 6;
          const ring = [];
          for (let i = 0; i <= 8; i++) { const t = -Math.PI / 2 + (i / 8) * Math.PI; ring.push([X0 - s0 + Math.cos(t) * 4.8, Math.sin(t) * 4.8]); }
          for (let i = 0; i <= 8; i++) { const t = Math.PI / 2 + (i / 8) * Math.PI; ring.push([X0 - s1 + Math.cos(t) * 4.8, Math.sin(t) * 4.8]); }
          set(E.mSpie, solidSvg(G.prismOf(G.frameOf([0, 0, z0], Z, X, Y), ring, 0, 8, P), { tone: 'hi', crease: 'lo' }));
        }
      }
    }

    // ---- the furnace: the door drops, three days pass, the door opens
    {
      let open = 1;
      let clock = 0;
      let alpha = 0;
      if (si === 5) {
        const b1 = beat(5, 1);
        open = 1 - span(u, 0.36, 0.46) + span(u, b1, b1 + 0.08);
        clock = 3 * span(u, 0.46, b1);
        alpha = span(u, 0.3, 0.36) * (1 - span(u, b1 + 0.1, b1 + 0.16));
        if (u >= 0.3 && u <= b1 + 0.08) {
          vis.add('fPart');
          const Ff = frameAt(ST.furnace.x + 120, 40, -300);
          set(E.fPart, partSvg(Ff, 3) + keywaySvg(Ff, KEYS[0], KEYS[1]) + holeSvg(Ff, HOLE_S));
        }
      }
      move(E.fDoor, [0, 0, 190 * open]);
      set(E.clock, clockSvg(clock, alpha));
    }

    // ---- the grinder: the part turns between centres; the wheelhead feeds in; the table strokes
    {
      const { X0, WX, WR } = ST.grind;
      let dx = 0;
      let feed = -40;
      let spinning = false;
      if (si === 6) {
        const b1 = beat(6, 1);
        feed = lerp(-40, 0, span(u, b1 - 0.06, b1));
        feed = lerp(feed, -40, span(u, 0.94, 0.99));
        spinning = u > 0.18;
        const t = clockS - C.dur[6] * b1;
        dx = feed > -1 ? Math.sin(Math.max(0, t) * 1.4) * 14 : 0;
        if (feed > -0.5) {
          vis.add('sparks');
          set(E.sparks, sparksSvg([WX + dx * 0, -17.5, -6], clockS));
        }
      }
      move(E.grTable, [dx, 0, 0]);
      move(E.grHead, [0, feed, 0]);
      const spin = clockS * 7;
      const wy = -(WR + 17.5);
      const Fw = G.frameOf([WX, wy, 0], X, Y, Z);
      set(E.wheel, solidSvg(G.disc(-26, 26, WR, Fw, P), { tone: 'hi', crease: 'lo', inner: dotsSvg(G.dotsOf(Fw, 26, WR * 0.72, 14, P, { phase: spin, all: true }).concat(G.dotsOf(Fw, 26, WR * 0.45, 9, P, { phase: -spin * 0.5 + 1, all: true })), { size: 0.55, tone: 'lo' }) })
        + solidSvg(G.disc(26, 30, 40, Fw, P), { tone: 'mid', crease: 'lo' }));
      if ((si === 6 && u >= TRIP[6][4])) {
        vis.add('gShaft');
        const F = frameAt(X0, 0, 0);
        set(E.gShaft, solid(F, PROF) + (spinning ? spinLines(F, 100, 236, 20, clockS * 8) : '') + keywaySvg(F, KEYS[0], KEYS[1]) + holeSvg(F, HOLE_S));
      }
    }

    for (const key of MOVING) show(E[key], vis.has(key));
  }

  return { render };
})();
