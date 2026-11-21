// The stage of the film "De wisselplaat en zijn slijtage / The insert and its
// wear": a pure function of (scene, u). Inlined into the page after the anatomy
// kit (iso-kit functions in scope, the lathe module as G) and a preamble from
// build.mjs that defines P (projection), C (world constants), CAM (one camera
// move per scene), W and H. Moves are placed per caption beat (beatStarts), so
// the video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global G, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, extrude, onTop, slabOf, sideMatrix, faceTextSvg, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const LANG = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'nl';
  const X = [1, 0, 0];
  const Y = [0, 1, 0];
  const Z = [0, 0, 1];
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const V = G.viewOf(P);
  const KS = G.scaleOf(P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : a.toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const hi = (e, on) => { if (e.hasAttribute('data-hi') !== !!on) e.toggleAttribute('data-hi', !!on); };
  const dec = (v, d) => (LANG === 'nl' ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const txt = (x, y, t, size = 14, anchor = 'middle', cls = 'tl-txt', extra = '') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}"${extra}>${t}</text>`;
  const mark = (d, extra = '') => (d ? `<path class="fp-mark" d="${d}"${extra}/>` : '');
  const S = (paths, style = {}) => solidSvg(paths, { tone: 'mid', ...style });

  // the beat on screen and its progress, from the caption beats of the scene
  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }
  const ph = (p, a, b) => span(p, a, b);

  // ------------------------------------------------------------ the insert (nose radius) in plan
  function roundPoly(verts, r, steps = 4) {
    const out = [];
    const n = verts.length;
    const norm = ([x, y]) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
    for (let i = 0; i < n; i++) {
      const Vv = verts[i];
      const d1 = norm([verts[(i + n - 1) % n][0] - Vv[0], verts[(i + n - 1) % n][1] - Vv[1]]);
      const d2 = norm([verts[(i + 1) % n][0] - Vv[0], verts[(i + 1) % n][1] - Vv[1]]);
      const half = Math.acos(clamp(d1[0] * d2[0] + d1[1] * d2[1], -1, 1)) / 2;
      const bis = norm([d1[0] + d2[0], d1[1] + d2[1]]);
      const c = [Vv[0] + (bis[0] * r) / Math.sin(half), Vv[1] + (bis[1] * r) / Math.sin(half)];
      const t1 = [Vv[0] + (d1[0] * r) / Math.tan(half), Vv[1] + (d1[1] * r) / Math.tan(half)];
      const t2 = [Vv[0] + (d2[0] * r) / Math.tan(half), Vv[1] + (d2[1] * r) / Math.tan(half)];
      const a1 = Math.atan2(t1[1] - c[1], t1[0] - c[0]);
      let da = Math.atan2(t2[1] - c[1], t2[0] - c[0]) - a1;
      while (da > Math.PI) da -= TAU;
      while (da < -Math.PI) da += TAU;
      for (let j = 0; j <= steps; j++) out.push([c[0] + r * Math.cos(a1 + (da * j) / steps), c[1] + r * Math.sin(a1 + (da * j) / steps)]);
    }
    return out;
  }
  const INS = C.INS.map(([x, y]) => [x, C.RC + y]);
  const INS_C = [INS.reduce((a, p) => a + p[0], 0) / 4, INS.reduce((a, p) => a + p[1], 0) / 4];
  const turnAbout = (pts, c, a) => { const cs = Math.cos(a); const sn = Math.sin(a); return pts.map(([x, y]) => [c[0] + (x - c[0]) * cs - (y - c[1]) * sn, c[1] + (x - c[0]) * sn + (y - c[1]) * cs]); };
  // the working insert at rest (tip at [0, RC]), turned by `turn` about its hole, lifted by `lift`
  function insertSvg(turn, lift) {
    const ring = roundPoly(turnAbout(INS, INS_C, turn), C.RE, 4);
    const inner = ring.map(([x, y]) => [INS_C[0] + (x - INS_C[0]) * 0.66, INS_C[1] + (y - INS_C[1]) * 0.66]);
    return S(extrude(ring, -4.8 + lift, 4.8, P), { tone: 'hi', crease: 'lo', inner: lineSvg(onTop(inner, lift, P, true), { tone: 'lo' }) + lineSvg(ring2(INS_C, 2.6, lift), { tone: 'mid' }) });
  }
  const ring2 = (c, r, z) => onTop(Array.from({ length: 24 }, (_, i) => [c[0] + r * Math.cos((i / 24) * TAU), c[1] + r * Math.sin((i / 24) * TAU)]), z, P, true);
  // wear on the rake face along the major edge (from the tip toward +y), w 0..1
  function wearSvg(w) {
    if (w <= 0.01) return '';
    const e = INS[3];
    const len = Math.hypot(e[0] - INS[0][0], e[1] - INS[0][1]);
    const ux = (e[0] - INS[0][0]) / len;
    const uy = (e[1] - INS[0][1]) / len;
    const [tx, ty] = INS[0];
    const l = 2.5 + 6 * w;
    const d = 0.8 + 2.2 * w;
    const pts = [[tx + 0.3, ty + 0.2], [tx + ux * l, ty + uy * l], [tx + ux * l + uy * d * 0.9, ty + uy * l - ux * d * 0.9 + d * 0.2], [tx + d * 0.8, ty + d * 0.5]];
    return `<path class="tl-wear" d="${onTop(pts, 0.05, P, true)}"/>`;
  }
  function bueSvg(b) {
    if (b <= 0.01) return '';
    const [tx, ty] = INS[0];
    const r = 0.6 + 1.6 * b;
    const pts = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * TAU; const rr = r * (1 + 0.25 * Math.sin(a * 3 + 1)); return at([tx + 0.8 + rr * Math.cos(a), ty + 1.6 + rr * 0.8 * Math.sin(a), 0.2 + rr * 0.35 * (1 + Math.sin(a))]); });
    return `<path class="tl-bue" d="${fmt(pts)}Z"/>`;
  }

  // ------------------------------------------------------------ the bar, the jaws, chips, coolant
  function shaftSvg(xt, theta) {
    const F = G.frameOf([C.CF, 0, 0], X, Y, Z);
    const L = C.BAR_L;
    const cut = clamp(xt - C.CF, 0, L);
    let out = '';
    if (cut > 0.05) out += S(G.solidOf([[0, C.R0], [cut, C.R0]], F, P), { crease: 'lo' });
    if (cut < L - 0.05) out += S(G.solidOf([[cut, C.RC], [L, C.RC]], F, P), { tone: 'hi', crease: 'lo' });
    const lines = [];
    for (let k = 0; k < 6; k++) {
      const a = theta + (k * TAU) / 6;
      if (G.dot3(G.radialOf(F, a), V) < 0.15) continue;
      if (cut > 12) lines.push(fmt([at(G.pointOf(F, 4, C.R0, a)), at(G.pointOf(F, cut - 4, C.R0, a))]));
      if (L - cut > 10) lines.push(fmt([at(G.pointOf(F, cut + 3, C.RC, a)), at(G.pointOf(F, L - 3, C.RC, a))]));
    }
    return out + lineSvg(lines.join(''), { tone: 'faint' });
  }
  function jawsSvg(theta) {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const a = theta + (i * TAU) / 3;
      const F = G.frameOf([C.CF, 0, 0], X, [0, Math.cos(a), Math.sin(a)], [0, -Math.sin(a), Math.cos(a)]);
      const facing = G.dot3(F.u, V);
      const html = S(G.prismOf(F, [[C.R0 + 14, -6.5], [C.R0 + 24, -6.5], [C.R0 + 24, 6.5], [C.R0 + 14, 6.5]], -0.5, 12, P), { crease: 'lo' })
        + S(G.prismOf(F, [[C.R0, -6], [C.R0 + 14, -6], [C.R0 + 14, 6], [C.R0, 6]], -0.5, 9, P), { crease: 'lo' });
      rows.push({ facing, html });
    }
    rows.sort((p, q) => p.facing - q.facing);
    return { back: rows.filter((r) => r.facing <= 0).map((r) => r.html).join(''), front: rows.filter((r) => r.facing > 0).map((r) => r.html).join('') };
  }
  function chipPath(cx, cy, size, turn) {
    const outer = [];
    const inner = [];
    for (let i = 0; i <= 18; i++) {
      const t = i / 18;
      const a = turn + t * TAU * 1.25;
      const r = size * (0.42 + 0.58 * t);
      const w = size * (0.12 + 0.18 * t);
      outer.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.66]);
      inner.push([cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.66]);
    }
    return fmt(outer.concat(inner.reverse())) + 'Z';
  }
  function chipsSvg(tip, clockS, rate, size = 2.6) {
    let out = '';
    const period = 1 / rate;
    for (let i = Math.max(0, Math.floor((clockS - 1.4) / period)); i * period <= clockS; i++) {
      const age = clockS - i * period;
      if (age > 1.4 || age < 0) continue;
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const p = [tip[0] + 3 + 16 * age, tip[1] + 4 + 8 * age * (0.5 + rnd), tip[2] + 2 + 18 * age - 34 * age * age];
      const [sx, sy] = at(p);
      const alpha = Math.min(1, age / 0.12) * (1 - clamp((age - 1.1) / 0.3, 0, 1));
      out += `<path class="fp-chip" style="opacity:${alpha.toFixed(2)}" d="${chipPath(sx, sy, size * KS * (0.85 + 0.3 * rnd), rnd * 6.28 + age * 5)}"/>`;
    }
    return out;
  }
  function dropsSvg(clockS, by) {
    let out = '';
    const a = G.add3(C.NOZ.tip, [by[0], by[1], 0]);
    const b = [by[0] + 1, C.RC + by[1] + 1.5, 0.6];
    for (let i = 0; i < 12; i++) {
      const t = ((clockS * 2.2 + i / 12) % 1);
      const p = [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t) + 1.2 * Math.sin(t * Math.PI)];
      const [sx, sy] = at(p);
      out += `<circle class="tl-drop" cx="${f1(sx)}" cy="${f1(sy)}" r="${f2(0.55 * KS)}"/>`;
    }
    // a little spray off the cut, along the bar
    for (let i = 0; i < 10; i++) {
      const t = ((clockS * 1.4 + i / 10) % 1);
      const seed = Math.sin(i * 78.233) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const p = [b[0] + (rnd - 0.3) * 14 * t, b[1] + 6 * t, 0.6 - 14 * t * t];
      const [sx, sy] = at(p);
      out += `<circle class="tl-drop" style="opacity:${(1 - t).toFixed(2)}" cx="${f1(sx)}" cy="${f1(sy)}" r="${f2(0.45 * KS)}"/>`;
    }
    return out;
  }
  function heatSvg(a, clockS) {
    if (a <= 0.01) return '';
    const [sx, sy] = at([INS[0][0] + 0.8, INS[0][1] + 0.6, 0.1]);
    const pulse = 0.75 + 0.25 * Math.sin(clockS * 4);
    return `<g style="opacity:${(a * pulse).toFixed(2)}"><ellipse class="tl-drop" cx="${f1(sx)}" cy="${f1(sy)}" rx="${f2(3.2 * KS)}" ry="${f2(1.8 * KS)}" style="opacity:.35"/><ellipse class="tl-drop" cx="${f1(sx)}" cy="${f1(sy)}" rx="${f2(1.6 * KS)}" ry="${f2(0.9 * KS)}"/></g>`;
  }

  // ------------------------------------------------------------ the lathe per scene
  // st: { xt (tool x), by: [dx, dy] block offset, spin, w (wear), bue, turn, lift, chips, cool, heat }
  function renderLathe(si, u, st) {
    const clockS = u * C.dur[si];
    const theta = st.spin ? clockS * 2.4 : 0.4;
    const j = jawsSvg(theta);
    set(E.jawsB, j.back);
    set(E.jawsF, j.front);
    set(E.shaft, shaftSvg(st.cut ?? st.xt, theta));
    const by = [st.xt + st.by[0], st.by[1]];
    move(E.tools, [by[0], by[1], 0]);
    move(E.car, [by[0], 0, 0]);
    move(E.heat, [by[0], by[1], 0]);
    set(E.mainIns, insertSvg(st.turn || 0, st.lift || 0));
    set(E.mainWear, st.turn ? '' : wearSvg(st.w || 0));
    set(E.mainBue, bueSvg(st.bue || 0));
    set(E.heat, heatSvg(st.heat || 0, clockS));
    set(E.drops, st.cool ? dropsSvg(clockS, by) : '');
    set(E.chips, st.chips ? chipsSvg([st.xt, C.RC, 0], clockS, st.chips) : '');
  }

  // ------------------------------------------------------------ the bench
  // a small box of inserts: a slab with a lid, its ISO colour stripe and letter on the front
  function smallBox(x, y, grp, alpha = 1) {
    const plan = { x, y, w: 38, d: 26, r: 2 };
    const z0 = C.BENCH_Z;
    const yf = y + plan.d + 0.1;
    const stripe = [[x + 3, yf, z0 + 2.5], [x + 11, yf, z0 + 2.5], [x + 11, yf, z0 + 10.5], [x + 3, yf, z0 + 10.5]].map(at);
    const tf = sideMatrix([x + 7, yf], z0 + 4.5, P, 'left');
    const body = S(slabOf(plan, z0, 13, P, 4, 0.5), {}) + S(slabOf({ x: x + 1, y: y + 1, w: 36, d: 24, r: 1.5 }, z0 + 13, 4, P, 4, 0.4), { tone: 'hi', crease: 'lo' })
      + `<path class="tl-stripe" data-g="${grp}" d="${fmt(stripe)}Z"/>` + faceTextSvg(tf, grp, { size: 5.5, tone: 'hi', anchor: 'middle' })
      + lineSvg(pathOf([[x + 15, yf, z0 + 5], [x + 32, yf, z0 + 5]].map(at)) + pathOf([[x + 15, yf, z0 + 8.5], [x + 27, yf, z0 + 8.5]].map(at)), { tone: 'lo', free: true });
    return { depth: x * 0.53 + y * 0.85, html: alpha < 0.999 ? `<g style="opacity:${alpha.toFixed(2)}">${body}</g>` : body };
  }
  const draw = (boxes) => boxes.sort((a, b) => a.depth - b.depth).map((b) => b.html).join('');
  const GROUPS = ['P', 'M', 'K', 'N', 'S', 'H'];
  function renderGroups(k, lit) {
    // the six boxes come onto the bench, then light one by one as the narration names them
    const boxes = GROUPS.map((g, i) => {
      const a = span(k, i * 0.1, 0.4 + i * 0.1);
      if (a <= 0.01) return null;
      const bx = smallBox(-196 + i * 44, 30 - (1 - a) * 18, g, a);
      if (lit === i) bx.html = `<g data-hi="">${bx.html}</g>`;
      return bx;
    }).filter(Boolean);
    set(E.groups, draw(boxes));
  }
  // the shelf: twelve kinds, then four of one kind
  const SHELF = ['P', 'M', 'P', 'K', 'N', 'P', 'S', 'M', 'P', 'H', 'K', 'P'];
  function renderShelf(k) {
    const keep = [0, 2, 5, 8];
    const boxes = SHELF.map((g, i) => {
      const x0 = -170 + (i % 6) * 48;
      const y0 = i < 6 ? -70 : -20;
      const ki = keep.indexOf(i);
      if (ki < 0) {
        const a = 1 - span(k, 0.05 + (i % 6) * 0.03, 0.3 + (i % 6) * 0.03);
        return a > 0.01 ? smallBox(x0, y0, g, a) : null;
      }
      const t = span(k, 0.35, 0.75);
      return smallBox(lerp(x0, -110 + ki * 48, t), lerp(y0, 20, t), 'P');
    }).filter(Boolean);
    set(E.shelf, draw(boxes));
  }
  // the marks on the magnified insert: C (shape), N (0° clearance), G, 12, 04, 08, and the four edges
  const BR = C.bigRing;
  const BT = C.BIG_TOP;
  function bigMarks(which) {
    let out = '';
    const [cx, cy] = C.BIG_C;
    const U = C.BIG_U;
    const Vv = C.BIG_V;
    const pt = (a, b2) => [cx + a * U[0] + b2 * Vv[0], cy + a * U[1] + b2 * Vv[1]];
    const Z0 = C.BENCH_Z;
    const F = pt(0, C.BIG_DS - C.RE * C.BIG * 1.3); // the front corner, on its rounding
    const A = pt(C.BIG_DL - C.RE * C.BIG * 1.3, 0); // the right-hand 80° corner
    const B = pt(-C.BIG_DL + C.RE * C.BIG * 1.3, 0); // the left-hand 80° corner
    if (which.N) {
      // 0° clearance: the side stands square to the top; a right-angle mark at the front corner
      const d = [A[0] - F[0], A[1] - F[1]];
      const l = Math.hypot(d[0], d[1]);
      const e = [F[0] + (d[0] / l) * 8, F[1] + (d[1] / l) * 8];
      out += mark(fmt([at([F[0], F[1], BT]), at([F[0], F[1], Z0])]), ' style="stroke-width:2.4"')
        + mark(fmt([at([e[0], e[1], BT - 0.2]), at([e[0], e[1], BT - 8]), at([F[0], F[1], BT - 8])]), ' style="stroke-width:1.6"');
    }
    if (which.T) {
      // the thickness: a dimension line in front of the front corner, end ticks along the edge
      const o = [F[0] + Vv[0] * 9, F[1] + Vv[1] * 9];
      const t = (z) => fmt([at([o[0] - U[0] * 4, o[1] - U[1] * 4, z]), at([o[0] + U[0] * 4, o[1] + U[1] * 4, z])]);
      out += mark(fmt([at([o[0], o[1], Z0]), at([o[0], o[1], BT])]) + t(Z0) + t(BT), ' style="stroke-width:2"');
    }
    if (which.R) {
      // the nose radius at the right-hand corner
      const tip = pt(C.BIG_DL, 0);
      const corner = BR.filter((p) => Math.hypot(p[0] - tip[0], p[1] - tip[1]) < C.RE * C.BIG * 2.2);
      out += mark(fmt(corner.map(([x, y]) => at([x, y, BT + 0.2]))), ' style="stroke-width:3.2"');
    }
    if (which.E) {
      // four edges: the two 80° corners on top, and the same two underneath
      const lab = (p, n, dy) => { const [sx, sy] = at(p); return `<circle class="tl-dot" data-c="acc" cx="${f1(sx)}" cy="${f1(sy)}" r="4.5"/>` + txt(sx, sy + dy, n, 14); };
      out += lab([A[0], A[1], BT], '1', -10) + lab([B[0], B[1], BT], '2', -10) + lab([A[0], A[1], Z0 + 0.5], '3', 20);
      const [bx, by] = at([B[0], B[1], Z0]);
      out += txt(bx, by + 20, '4', 14, 'middle', 'tl-mute');
    }
    return out;
  }

  // ------------------------------------------------------------ HUD: the code strip
  const CODE = ['C', 'N', 'M', 'G', '12', '04', '08'];
  function codeSvg(on, alpha) {
    const x0 = W / 2 - 170;
    let out = `<rect class="tl-panel" x="${x0 - 14}" y="${H - 66}" width="368" height="52" rx="8"/>`;
    let x = x0;
    CODE.forEach((c, i) => {
      const w = c.length === 1 ? 34 : 56;
      if (i === 4) x += 18;
      out += `<text class="tl-code tl-mono" x="${f1(x + w / 2)}" y="${H - 28}" font-size="32" text-anchor="middle"${on[i] ? ' data-hi=""' : ''}>${c}</text>`;
      x += w;
    });
    return `<g style="opacity:${alpha.toFixed(2)}">${out}</g>`;
  }

  // ------------------------------------------------------------ HUD: magnifier contents
  const [MX, MY] = C.MAG;
  const MR = C.MAG_R;
  // carbide in section: tungsten-carbide grains (WC) in a cobalt binder (Co), and the coating's layers on top
  const GRAINS = (() => {
    const out = [];
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 14; col++) {
        const cx = MX - MR + col * 16 + (row % 2) * 8 + (rnd() - 0.5) * 5;
        const cy = MY - 26 + row * 14 + (rnd() - 0.5) * 4;
        const r = 5.5 + rnd() * 3;
        const n = 5 + Math.floor(rnd() * 2);
        const rot = rnd() * TAU;
        out.push(Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rot + (i / n) * TAU) * (0.85 + 0.3 * rnd()), cy + r * 0.85 * Math.sin(rot + (i / n) * TAU) * (0.85 + 0.3 * rnd())]));
      }
    }
    return out;
  })();
  function grainsSvg(a) {
    if (a <= 0.01) return '';
    return `<g style="opacity:${a.toFixed(2)}"><rect class="tl-co" x="${MX - MR}" y="${MY - 34}" width="${2 * MR}" height="${MR + 40}"/>`
      + GRAINS.map((pts) => `<path class="tl-grain" d="${fmt(pts)}Z"/>`).join('')
      + txt(MX - 46, MY + 76, 'WC', 15, 'middle', 'tl-txt') + txt(MX + 40, MY + 76, 'Co', 15, 'middle', 'tl-txt') + '</g>';
  }
  function coatSvg(a) {
    if (a <= 0.01) return '';
    const hgt = [12, 18, 8];
    let y = MY - 34;
    let out = '';
    hgt.forEach((h, i) => {
      const hh = h * a;
      out += `<rect class="tl-layer" data-l="${i}" x="${MX - MR}" y="${f1(y - hh)}" width="${2 * MR}" height="${f1(hh)}"/>`;
      y -= hh;
    });
    // a scale bar: 5 µm (grains of about 1 µm; a CVD coating of about 10 µm)
    out += mark(`M${MX + 18} ${MY - 76}H${MX + 62}`, ' style="stroke-width:2"') + txt(MX + 40, MY - 82, '5 µm', 12, 'middle', 'tl-mute');
    return out;
  }
  // the flank face on (as the figure's loupe): the cutting edge across the top, the wear land below it
  function landSvg(vb, crit) {
    const S0 = 2 * 60; // px per mm
    const edge = MY - 40;
    const left = MX - MR;
    let out = `<path class="tl-flank" d="M${left} ${edge}H${MX + MR}V${MY + MR}H${left}Z"/>` + mark(`M${left} ${edge}H${MX + MR}`, ' style="stroke-width:2"');
    if (vb > 0.002) {
      const top = [];
      const bot = [];
      for (let i = 0; i <= 40; i++) {
        const x = left + (2 * MR * i) / 40;
        const notch = Math.exp(-(((x - (MX + 40)) / 12) ** 2)) * 0.35;
        const wob = 0.06 * Math.sin(x * 0.7) + 0.04 * Math.sin(x * 1.3 + 1);
        top.push([x, edge]);
        bot.push([x, edge + vb * S0 * (1 + notch + wob)]);
      }
      out += `<path class="tl-land" d="${fmt(top.concat(bot.reverse()))}Z"/>`;
    }
    // the ruler at the right, 0,1 mm a tick
    const rx = MX + 58;
    let ticks = '';
    for (let i = 0; i <= 6; i++) ticks += `M${rx} ${f1(edge + i * 0.1 * S0)}h${i % 3 === 0 ? 10 : 5}`;
    out += `<path class="tl-axis" d="${ticks}M${rx} ${edge}V${f1(edge + 0.6 * S0)}"/>`;
    out += txt(rx + 14, edge + 0.3 * S0 + 5, dec(0.3, 1), 13, 'start', 'tl-mute') + txt(rx + 14, edge + 5, '0', 13, 'start', 'tl-mute');
    out += txt(MX - 60, edge - 10, 'VB', 15, 'middle', 'tl-txt');
    return { base: out, crit: crit ? `<path class="tl-crit" d="M${left} ${f1(edge + 0.3 * S0)}H${rx}"/>` : '' };
  }
  function bueLoupe(b) {
    if (b <= 0.01) return '';
    const edge = MY - 40;
    const pts = Array.from({ length: 18 }, (_, i) => { const a = Math.PI + (i / 17) * Math.PI; const r = 10 + 26 * b; return [MX - 20 + r * 1.3 * Math.cos(a), edge + 2 + r * 0.7 * Math.sin(a) * (1 + 0.15 * Math.sin(i * 2.1))]; });
    return `<path class="tl-bue" d="${fmt(pts)}Z"/>`;
  }

  // ------------------------------------------------------------ HUD: spindle load trace
  const LP = { x: 14, y: H - 132, w: 238, h: 118 };
  function loadSvg(p, mode) {
    const { x, y, w, h } = LP;
    const px = x + 34;
    const pw = w - 46;
    const py0 = y + h - 18;
    const ph0 = h - 40;
    const yOf = (pct) => py0 - (pct / 100) * ph0;
    let out = `<rect class="tl-panel" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`;
    out += `<path class="tl-grid" d="M${px} ${f1(yOf(50))}H${px + pw}M${px} ${f1(yOf(100))}H${px + pw}"/>`;
    out += `<path class="tl-axis" d="M${px} ${y + 14}V${py0}H${px + pw}"/>`;
    out += txt(px - 6, f1(yOf(100) + 4), '100', 11, 'end', 'tl-mute') + txt(px - 6, f1(yOf(50) + 4), '50', 11, 'end', 'tl-mute') + txt(px - 6, f1(py0 + 4), '0', 11, 'end', 'tl-mute');
    out += txt(px + pw, y + 16, LANG === 'en' ? 'spindle %' : 'spil %', 12, 'end', 'tl-mute');
    const n = Math.max(2, Math.round(80 * p));
    const pts = [];
    let stop = -1;
    for (let i = 0; i < n; i++) {
      const t = i / 79;
      let pct;
      if (mode === 'wear') pct = 42 + 34 * t ** 2.2 + 3 * Math.sin(i * 1.7) + 2 * Math.sin(i * 0.6);
      else {
        pct = 58 + 3 * Math.sin(i * 1.7) + 2 * Math.sin(i * 0.6);
        if (t > 0.55 && t < 0.6) pct = 58 + (t - 0.55) * 840;
        if (t >= 0.6) { pct = Math.max(0, 100 - (t - 0.6) * 2400); if (stop < 0) stop = i; }
      }
      pts.push([px + pw * t, yOf(clamp(pct, 0, 104))]);
    }
    out += `<path class="tl-curve" data-c="acc" d="${fmt(pts)}"/>`;
    if (mode === 'break' && stop >= 0 && p > 0.66) out += txt(px + pw * 0.8, yOf(70), 'STOP', 18, 'middle', 'tl-txt', ' style="fill:var(--fp-accent-text)"');
    return out;
  }

  // ------------------------------------------------------------ HUD: charts (Taylor, cost per part)
  const CH = { x: 318, y: 44, w: 308, h: 244 };
  const PX0 = CH.x + 44;
  const PX1 = CH.x + CH.w - 14;
  const PY0 = CH.y + CH.h - 34;
  const PY1 = CH.y + 26;
  function axes(xr, yr, xt, yt, xl, yl) {
    const xOf = (v) => PX0 + ((v - xr[0]) / (xr[1] - xr[0])) * (PX1 - PX0);
    const yOf = (v) => PY0 - ((v - yr[0]) / (yr[1] - yr[0])) * (PY0 - PY1);
    let out = `<rect class="tl-panel" x="${CH.x}" y="${CH.y}" width="${CH.w}" height="${CH.h}" rx="10"/>`;
    out += `<path class="tl-grid" d="${yt.map((v) => `M${PX0} ${f1(yOf(v))}H${PX1}`).join('')}"/>`;
    out += `<path class="tl-axis" d="M${PX0} ${PY1 - 6}V${PY0}H${PX1}"/>`;
    out += xt.map((v) => txt(xOf(v), PY0 + 16, String(v), 11, 'middle', 'tl-mute') + `<path class="tl-axis" d="M${f1(xOf(v))} ${PY0}v4"/>`).join('');
    out += yt.map((v) => txt(PX0 - 6, yOf(v) + 4, typeof v === 'number' && v % 1 ? dec(v, 1) : String(v), 11, 'end', 'tl-mute')).join('');
    out += txt(PX1, PY0 + 30, xl, 12, 'end', 'tl-mute') + txt(CH.x + 12, CH.y + 18, yl, 12, 'start', 'tl-mute');
    return { out, xOf, yOf };
  }
  const lifeOf = (v) => C.T1 * (C.V1 / v) ** (1 / C.nT);
  const curve = (f, v0, v1, xOf, yOf, upto = 1, ymax = Infinity) => {
    const pts = [];
    const n = 80;
    for (let i = 0; i <= Math.round(n * upto); i++) {
      const v = v0 + ((v1 - v0) * i) / n;
      const yv = f(v);
      if (yv > ymax) continue;
      pts.push([xOf(v), yOf(yv)]);
    }
    return fmt(pts);
  };
  const dot = (x, y, acc = false) => `<circle class="tl-dot"${acc ? ' data-c="acc"' : ''} cx="${f1(x)}" cy="${f1(y)}" r="5"/>`;
  function taylorChart(b, p) {
    const A = axes([140, 280], [0, 40], [150, 200, 250], [0, 10, 20, 30, 40], 'V (m/min)', 'T (min)');
    const draw = b === 0 ? span(p, 0.1, 0.8) : 1;
    const base = A.out;
    const line = `<path class="tl-curve" d="${curve(lifeOf, 150, 280, A.xOf, A.yOf, draw, 40)}"/>`;
    let pts = '';
    if (b >= 1) {
      const k = b === 1 ? span(p, 0.4, 0.8) : 1;
      pts += dot(A.xOf(200), A.yOf(15)) + txt(A.xOf(200) + 9, A.yOf(15) - 8, '15', 12, 'start', 'tl-txt');
      if (k > 0) pts += `<g style="opacity:${k.toFixed(2)}">${dot(A.xOf(250), A.yOf(lifeOf(250)), true)}${txt(A.xOf(250) + 8, A.yOf(lifeOf(250)) - 9, dec(lifeOf(250), 1), 12, 'start', 'tl-txt')}${mark(`M${f1(A.xOf(200))} ${f1(A.yOf(15))}L${f1(A.xOf(250))} ${f1(A.yOf(lifeOf(250)))}`, ' stroke-dasharray="4 3"')}</g>`;
    }
    if (b >= 2) {
      const k = b === 2 ? span(p, 0.45, 0.75) : 1;
      if (k > 0) pts += `<g style="opacity:${k.toFixed(2)}">${dot(A.xOf(220), A.yOf(lifeOf(220)), true)}${txt(A.xOf(220) + 9, A.yOf(lifeOf(220)) - 8, dec(lifeOf(220), 1), 12, 'start', 'tl-txt')}</g>`;
    }
    return { base, curve: line + pts };
  }
  const costOf = (v, tch) => { const tc = (0.5 * C.V1) / v; const T = lifeOf(v); return { m: C.M * tc, e: ((tch * C.M + C.CE) * tc) / T }; };
  const veOf = (tch) => C.C / ((1 / C.nT - 1) * (tch + C.CE / C.M)) ** C.nT;
  function costChart(b, p) {
    const A = axes([140, 300], [0, 1.4], [150, 200, 250, 300], [0, 0.5, 1], 'V (m/min)', LANG === 'en' ? '€ per part' : '€ per stuk');
    const k0 = b === 0 ? span(p, 0.1, 0.7) : 1;
    let curves = `<path class="tl-curve" data-c="lo" d="${curve((v) => costOf(v, 2).m, 150, 300, A.xOf, A.yOf, k0)}"/>`
      + `<path class="tl-curve" data-c="lo" d="${curve((v) => costOf(v, 2).e, 150, 300, A.xOf, A.yOf, k0, 1.4)}"/>`;
    if (k0 > 0.95) curves += txt(A.xOf(158), A.yOf(costOf(158, 2).m) + 18, LANG === 'en' ? 'machine' : 'machine', 11, 'start', 'tl-mute') + txt(A.xOf(272), A.yOf(costOf(272, 2).e) + 4, LANG === 'en' ? 'edge' : 'kant', 11, 'end', 'tl-mute');
    let min = '';
    let min2 = '';
    if (b >= 2) {
      const k = b === 2 ? span(p, 0.1, 0.8) : 1;
      const ve = veOf(2);
      min += `<path class="tl-curve" d="${curve((v) => { const c = costOf(v, 2); return c.m + c.e; }, 150, 300, A.xOf, A.yOf, k, 1.4)}"/>`;
      if (b >= 3 || k > 0.99) {
        const c = costOf(ve, 2);
        const xv = A.xOf(ve);
        const yv = A.yOf(c.m + c.e);
        min += mark(`M${f1(xv)} ${f1(yv)}V${PY0}`, ' stroke-dasharray="4 3"') + dot(xv, yv, true) + txt(xv, PY0 - 6 - (yv > PY0 - 40 ? 0 : 0), String(Math.round(ve)), 12, 'middle', 'tl-txt', ' dy="-4"');
      }
    }
    if (b >= 4) {
      const k = span(p, 0.15, 0.7);
      const ve = veOf(0.3);
      min2 += `<path class="tl-curve" data-c="acc" d="${curve((v) => { const c = costOf(v, 0.3); return c.m + c.e; }, 150, 300, A.xOf, A.yOf, k, 1.4)}"/>`;
      if (k > 0.99) {
        const c = costOf(ve, 0.3);
        min2 += dot(A.xOf(ve), A.yOf(c.m + c.e), true) + txt(A.xOf(ve) + 8, A.yOf(c.m + c.e) + 18, String(Math.round(ve)), 12, 'start', 'tl-txt');
      }
    }
    return { base: A.out, curves, min, min2 };
  }

  // ------------------------------------------------------------ HUD: the presetter
  function presetSvg(p) {
    const x = 392;
    const y = 40;
    const w = 234;
    const h = 214;
    let out = `<rect class="tl-panel" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>`;
    // base, column and the camera head on its slide
    out += `<rect class="fp-box" x="${x + 20}" y="${y + h - 34}" width="${w - 40}" height="18" rx="3"/>`;
    out += `<rect class="fp-box" x="${x + w - 60}" y="${y + 22}" width="20" height="${h - 56}" rx="2"/>`;
    const camY = y + 60 + 50 * span(p, 0.15, 0.55);
    out += `<rect class="fp-box" x="${x + w - 104}" y="${f1(camY - 16)}" width="64" height="32" rx="4"/><circle class="fp-mark" cx="${x + w - 104}" cy="${f1(camY)}" r="9"/>`;
    // the holder upright in its spindle adapter, the insert's tip at the top
    const hx = x + 70;
    out += `<rect class="fp-box" x="${hx - 22}" y="${y + h - 60}" width="44" height="26" rx="3"/><rect class="fp-box" x="${hx - 9}" y="${y + 92}" width="18" height="${h - 152}" rx="1"/>`;
    out += `<path class="fp-box" d="M${hx - 9} ${y + 92}L${hx - 9} ${y + 80}L${hx + 3} ${y + 72}L${hx + 9} ${y + 80}L${hx + 9} ${y + 92}Z"/>`;
    // the crosshair on the tip, and the two dimensions: L (length), R (radius)
    const on = span(p, 0.5, 0.75);
    if (on > 0.01) {
      out += `<g style="opacity:${on.toFixed(2)}">${mark(`M${hx + 3} ${y + 58}V${y + 86}M${hx - 11} ${y + 72}H${hx + 17}`, ' style="stroke-width:1.6"')}`
        + `${mark(`M${hx - 34} ${y + 72}V${y + h - 34}M${hx - 39} ${y + 72}h10M${hx - 39} ${y + h - 34}h10`, ' style="stroke-width:1.6"')}${txt(hx - 44, y + 150, 'L', 15, 'end')}`
        + `${mark(`M${hx} ${y + 50}H${hx + 3}M${hx} ${y + 46}v8`, '')}${txt(hx + 22, y + 52, 'R', 15, 'start')}</g>`;
    }
    return out;
  }

  // ------------------------------------------------------------ camera
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const w = lerp(c.from[2], c.to[2], k);
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the scenes
  const LATHE = [0, 4, 5, 6, 7];
  const BENCH_PARTS = ['big', 'bigBreaker', 'bigHole', 'bigIc', 'bigMarks', 'hss', 'box', 'groups', 'shelf'];
  const BENCH_VIS = {
    1: ['big', 'bigBreaker', 'bigHole', 'hss'],
    2: ['big', 'bigBreaker', 'bigHole', 'bigIc', 'bigMarks', 'box'],
    3: ['box', 'groups'],
    8: ['shelf'],
  };
  const HUDS = ['mag', 'code', 'load', 'chart', 'preset'];
  let shown = -1;

  function render(si, u) {
    if (si !== shown) {
      shown = si;
      const lathe = LATHE.includes(si);
      show(E.lathe, lathe);
      show(E.bench, !lathe);
      if (!lathe) for (const k of BENCH_PARTS) show(E[k], BENCH_VIS[si].includes(k));
    }
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const hud = { mag: 0, code: 0, load: 0, chart: 0, preset: 0 };
    let mag = { grains: 0, coat: 0, vb: 0, bue: 0, crit: false };
    let chart = null;

    if (si === 0) {
      // the tool comes in and cuts; then it backs off and the insert is turned to its next edge
      const xt = b < 2 ? lerp(66, 8, span(u, 0.04, 0.62)) : 8;
      const off = b === 2 ? span(p, 0.45, 0.6) - span(p, 0.88, 0.98) : 0;
      const turn = b === 2 ? Math.PI * span(p, 0.6, 0.86) : 0;
      renderLathe(si, u, { xt, by: [0, 14 * off], spin: true, w: b === 2 ? 1 - span(p, 0.6, 0.7) : 0.15, turn, lift: 3 * (span(p, 0.58, 0.64) - span(p, 0.82, 0.88)) * (b === 2 ? 1 : 0), chips: off > 0.05 || xt > 56 ? 0 : 3, heat: b === 2 ? 1 - span(p, 0.4, 0.5) : 0 });
    } else if (si === 4) {
      // wear grows (loupe), a built-up edge sticks, the spindle load climbs
      const xt = lerp(30, -30, u);
      const vb = b === 0 ? 0.3 * span(p, 0.05, 0.95) ** 1.6 : 0.3;
      const bueA = b === 1 ? span(p, 0.25, 0.75) : b > 1 ? 1 - span(p, 0, 0.15) : 0;
      renderLathe(si, u, { xt, by: [0, 0], spin: true, w: vb / 0.3, bue: bueA, chips: 3 });
      hud.mag = b < 2 ? span(u, 0, 0.06) : 1 - span(p, 0, 0.15);
      mag = { vb, bue: bueA, crit: false };
      hud.load = b === 2 ? span(p, 0, 0.12) : 0;
      if (hud.load > 0) set(E.load, loadSvg(span(p, 0.08, 0.9), 'wear'));
    } else if (si === 5) {
      // coolant on; presetting on the side; at the limit the sister tool takes over:
      // back off, run out past the bar end, shift one station, come in and cut
      let st = { xt: lerp(36, -10, span(u, 0, 0.6)), by: [0, 0], spin: true, w: 0.5, cool: b === 0 ? span(p, 0.05, 0.2) > 0.5 : true, chips: 3 };
      if (b === 2) {
        const back = span(p, 0.25, 0.38);
        const run = span(p, 0.38, 0.55);
        const shift = span(p, 0.55, 0.7);
        const down = span(p, 0.7, 0.8);
        const cutNew = span(p, 0.82, 1);
        st = { xt: lerp(-10, 40, run) - 18 * cutNew, cut: -10, by: [36 * shift, 16 * back - 24 * down], spin: true, w: 0.5 + 0.5 * span(p, 0, 0.2), cool: true, chips: back < 0.02 || cutNew > 0.02 ? 3 : 0 };
      }
      renderLathe(si, u, st);
      hud.preset = b === 1 ? span(p, 0, 0.1) * (1 - span(p, 0.92, 1)) : 0;
      if (hud.preset > 0) set(E.preset, presetSvg(p));
    } else if (si === 6) {
      // Taylor: the curve, two speeds, the example; then the wear criterion and tool monitoring
      const broken = b === 4 && p > 0.57;
      const xt = lerp(30, -30, u);
      renderLathe(si, u, { xt, by: [0, broken ? 14 * span(p, 0.6, 0.75) : 0], spin: !broken, w: 0.6, chips: broken ? 0 : 3 });
      hud.chart = b < 3 ? span(u, 0, 0.04) : 1 - span(p, 0, 0.1) * (b === 3 ? 1 : 1);
      if (b >= 3) hud.chart = b === 3 ? 1 - span(p, 0, 0.1) : 0;
      chart = b < 3 || hud.chart > 0 ? taylorChart(Math.min(b, 2), b < 3 ? p : 1) : null;
      hud.mag = b === 3 ? span(p, 0.05, 0.18) : 0;
      mag = { vb: 0.3, crit: true };
      hud.load = b === 4 ? span(p, 0, 0.1) : 0;
      if (hud.load > 0) set(E.load, loadSvg(span(p, 0.05, 0.85), 'break'));
    } else if (si === 7) {
      renderLathe(si, u, { xt: lerp(30, -30, u), by: [0, 0], spin: true, w: 0.4, chips: 3 });
      hud.chart = span(u, 0, 0.04);
      chart = costChart(b, p);
    } else if (si === 1) {
      // HSS, then carbide in section, then its coating
      hud.mag = b >= 1 ? span(p, 0, 0.12) + (b > 1 ? 1 : 0) : 0;
      mag = { grains: b >= 1 ? 1 : 0, coat: b === 2 ? span(p, 0.1, 0.5) : 0 };
    } else if (si === 2) {
      // the code strip, letter by letter, and the matching feature on the insert
      const on = [false, false, false, false, false, false, false];
      const which = {};
      let shape = false;
      let hole = false;
      let ic = false;
      if (b === 1) {
        const k = [0, 0.3, 0.55, 0.7].filter((x) => p >= x).length - 1;
        on[k] = true;
        shape = k === 0;
        which.N = k === 1;
        hole = k === 3;
      } else if (b === 2) {
        const k = [0, 0.38, 0.7].filter((x) => p >= x).length - 1;
        on[4 + k] = true;
        ic = k === 0;
        which.T = k === 1;
        which.R = k === 2;
      } else if (b === 3) {
        which.E = true;
      }
      hi(E.big, shape);
      hi(E.bigHole, hole);
      hi(E.bigBreaker, hole);
      hi(E.bigIc, ic);
      fade(E.bigIc, b === 2 ? 1 : 0.0001);
      set(E.bigMarks, bigMarks(which));
      hud.code = span(u, 0.02, 0.1);
      set(E.code, codeSvg(on, 1));
    } else if (si === 3) {
      renderGroups(b === 0 ? span(p, 0.05, 0.9) : 1, b === 1 ? Math.min(5, Math.floor(p * 6.2)) : -1);
    } else if (si === 8) {
      renderShelf(b === 0 ? p : 1);
    }

    // HUD layers
    fade(E.mag, hud.mag);
    show(E.mag, hud.mag > 0.01);
    if (hud.mag > 0.01) {
      if (si === 1) {
        set(E.magGrains, grainsSvg(mag.grains));
        set(E.magCoat, coatSvg(mag.coat));
        set(E.magWear, '');
        set(E.magBue, '');
        set(E.magCrit, '');
      } else {
        const l = landSvg(mag.vb, mag.crit);
        set(E.magGrains, '');
        set(E.magCoat, '');
        set(E.magWear, l.base);
        set(E.magBue, bueLoupe(mag.bue || 0));
        set(E.magCrit, l.crit);
      }
    }
    show(E.code, si === 2);
    fade(E.code, hud.code);
    show(E.load, hud.load > 0.01);
    fade(E.load, hud.load);
    show(E.preset, hud.preset > 0.01);
    fade(E.preset, hud.preset);
    show(E.chart, hud.chart > 0.01 && !!chart);
    fade(E.chart, hud.chart);
    if (chart) {
      set(E.chBase, chart.base);
      set(E.chCurve, chart.curve || '');
      set(E.chCurves, chart.curves || '');
      set(E.chMin, chart.min || '');
      set(E.chMin2, chart.min2 || '');
    }
  }

  return { render };
})();
