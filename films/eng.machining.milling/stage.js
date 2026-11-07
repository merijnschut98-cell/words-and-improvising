// The stage of the film "Frezen / Milling": a pure function of (scene, u).
// Inlined into the page after the anatomy kit (iso-kit functions in scope, the
// lathe module as G) and a preamble from build.mjs that defines P (projection),
// C (world constants), CAM (one camera move per scene), W and H.
/* global G, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, slabOf, cylinder, translateAlong, span */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const el = (k) => svg.querySelector(`[data-k="${k}"]`);
  const E = {};
  ['world', 'column', 'mag', 'magFace', 'saddle', 'table', 'viceB', 'trunB', 'block', 'pocket', 'viceF', 'trunF', 'con', 'head', 'tool', 'chips',
    'contour', 'troch', 'ae', 'q', 'vf', 'lock', 'simul', 'lp1', 'lp1In', 'lp1Lab', 'lp2', 'lp2In', 'lp2Lab'].forEach((k) => { E[k] = el(k); });
  const X = [1, 0, 0];
  const Y = [0, 1, 0];
  const Z = [0, 0, 1];
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => iso(p, P);
  const V = G.viewOf(P);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, o) => { const s = String(Math.round(o * 100) / 100); if (e.style.opacity !== s) e.style.opacity = s; };
  const { TOP, B0, ZN0, BX, BY } = C;
  let camW = W;
  const label = (x, y, text, size = 22, anchor = 'middle', hud = false) => `<text class="fp-ink fp-label" x="${f1(x)}" y="${f1(y)}" font-size="${f1(hud ? size : size * camW / W)}" text-anchor="${anchor}">${text}</text>`;
  const arrowHead = (from, to, len, hud = false) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    const l = hud ? len : len * camW / W;
    return `M${f1(to[0] - ux * l - uy * l * 0.55)} ${f1(to[1] - uy * l + ux * l * 0.55)}L${f1(to[0])} ${f1(to[1])}L${f1(to[0] - ux * l + uy * l * 0.55)} ${f1(to[1] - uy * l - ux * l * 0.55)}`;
  };
  const mark = (d, extra = '') => `<path class="fp-mark" d="${d}"${extra}/>`;
  const poly = (pts) => pathOf(pts, true);
  const fdown = (o) => G.frameOf(o, [0, 0, -1], X, Y);
  const shadeOf = (nx, ny) => {
    const sinA = Math.sin(P.azimuth * DEG);
    const cosA = Math.cos(P.azimuth * DEG);
    return Math.min(3, Math.max(0, Math.floor(((nx * -sinA + ny * cosA + 1) / 2) * 4)));
  };
  const SY = shadeOf(0, 1);
  const SX = shadeOf(1, 0);

  // ------------------------------------------------------------ the block in the vice
  // Block-local x, y (centre 0, 0); world = local + table offset (tx, ty).
  // cut: a step along the front face (x from rx0 to BX, y from yb to BY, ap deep).
  function lShape(a0, a1, b0, b1, n0, n1, bn) {
    n0 = Math.max(n0, a0);
    n1 = Math.min(n1, a1);
    if (n1 - n0 < 1e-6) return [[a0, b0], [a1, b0], [a1, b1], [a0, b1]];
    const out = [[a0, b0], [a1, b0]];
    if (n1 >= a1 - 1e-6) out.push([a1, bn]);
    else out.push([a1, b1], [n1, b1], [n1, bn]);
    if (n0 <= a0 + 1e-6) out.push([a0, bn]);
    else out.push([n0, bn], [n0, b1], [a0, b1]);
    return out;
  }
  function blockSvg(tx, ty, cut) {
    const rx0 = cut ? clamp(cut.rx0, -BX, BX) : BX;
    const rx1 = BX;
    const yb = cut ? cut.yb : BY;
    const zc = TOP - (cut ? cut.ap : 0);
    const Wp = (x, y, z) => at([x + tx, y + ty, z]);
    const faces = [];
    const edges = [];
    const add = (cls, pts) => { const d = poly(pts); faces.push(`<path class="${cls}" d="${d}"/>`); edges.push(d); };
    const sy = `iso-shade" data-shade="${SY}`;
    const sx = `iso-shade" data-shade="${SX}`;
    const cutting = rx1 - rx0 > 1e-6;
    if (cutting) {
      add('fm-cut iso-top', [[rx0, yb], [rx1, yb], [rx1, BY], [rx0, BY]].map(([x, y]) => Wp(x, y, zc)));
      add('fm-cut ' + sy, [[rx0, TOP], [rx1, TOP], [rx1, zc], [rx0, zc]].map(([x, z]) => Wp(x, yb, z)));
      if (rx0 > -BX + 1e-6) add('fm-cut ' + sx, [[yb, TOP], [BY, TOP], [BY, zc], [yb, zc]].map(([y, z]) => Wp(rx0, y, z)));
    }
    add('iso-top', lShape(-BX, BX, -BY, BY, rx0, rx1, yb).map(([x, y]) => Wp(x, y, TOP)));
    add(sy, lShape(-BX, BX, B0, TOP, rx0, rx1, zc).map(([x, z]) => Wp(x, BY, z)));
    add(sx, (cutting ? lShape(-BY, BY, B0, TOP, yb, BY, zc) : [[-BY, B0], [BY, B0], [BY, TOP], [-BY, TOP]]).map(([y, z]) => Wp(BX, y, z)));
    return `<g class="iso-solid">${faces.join('')}<path class="iso-line iso-edge" data-tone="mid" d="${edges.join('')}"/></g>`;
  }
  // The face-milled top: each pass a swept disc, with the cutter's swirl marks.
  function facedSvg(tx, ty, passes) {
    const R = C.FACE_R;
    const top = poly([[-BX, -BY], [BX, -BY], [BX, BY], [-BX, BY]].map(([x, y]) => at([x + tx, y + ty, TOP])));
    const fills = [];
    const swirls = [];
    for (const [v, xa, xb] of passes) {
      if (Math.abs(xb - xa) < 0.5) continue;
      const dir = Math.sign(xb - xa);
      const pts = [];
      for (let i = 0; i <= 16; i++) { const t = -Math.PI / 2 + (i / 16) * Math.PI; pts.push([xb + dir * Math.cos(t) * R, v + Math.sin(t) * R]); }
      for (let i = 0; i <= 16; i++) { const t = Math.PI / 2 + (i / 16) * Math.PI; pts.push([xa + dir * Math.cos(t) * R, v + Math.sin(t) * R]); }
      fills.push(poly(pts.map(([x, y]) => at([x + tx, y + ty, TOP]))));
      for (let x = xa + dir * 4; dir * (xb - x) > 0; x += dir * 7) {
        const arc = [];
        for (let i = 0; i <= 14; i++) { const t = Math.PI / 2 + (i / 14) * Math.PI; arc.push(at([x + dir * Math.cos(t) * R * 0.98 + tx, v + Math.sin(t) * R * 0.98 + ty, TOP])); }
        swirls.push(pathOf(arc));
      }
    }
    if (!fills.length) return '';
    return `<clipPath id="fm-topclip"><path d="${top}"/></clipPath><g clip-path="url(#fm-topclip)"><path class="fm-cut" d="${fills.join('')}"/><path class="iso-line" data-tone="lo" d="${swirls.join('')}"/></g><path class="iso-line" data-tone="mid" d="${top}"/>`;
  }
  // A recess (pocket or slot) of the rectangle [x0, x1] × [y0, y1], depth deep;
  // seen through `open` (block-local polygon at the top), whose projection clips it.
  function recessSvg(tx, ty, r, depth, open, id) {
    const [x0, x1, y0, y1] = r;
    const zb = TOP - depth;
    const Wp = (x, y, z) => at([x + tx, y + ty, z]);
    const openD = poly(open.map(([x, y]) => Wp(x, y, TOP)));
    const floor = poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => Wp(x, y, zb)));
    const back = poly([[x0, TOP], [x1, TOP], [x1, zb], [x0, zb]].map(([x, z]) => Wp(x, y0, z)));
    const left = poly([[y0, TOP], [y1, TOP], [y1, zb], [y0, zb]].map(([y, z]) => Wp(x0, y, z)));
    const seams = pathOf([Wp(x0, y1, zb), Wp(x0, y0, zb), Wp(x1, y0, zb)]);
    return `<clipPath id="${id}"><path d="${openD}"/></clipPath><g clip-path="url(#${id})" class="iso-solid"><path class="fm-cut iso-top" d="${floor}"/><path class="iso-shade" data-shade="${SY}" d="${back}"/><path class="iso-shade" data-shade="${SX}" d="${left}"/><path class="iso-line" data-tone="lo" d="${seams}"/></g><path class="iso-line iso-edge" data-tone="mid" d="${openD}"/>`;
  }
  const roundRect = (x0, x1, y0, y1, r, n = 5) => {
    const out = [];
    const c = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]];
    for (const [cx, cy, a0] of c) for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * (Math.PI / 2); out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return out;
  };

  // ------------------------------------------------------------ tools
  // s along the spindle axis, downward from the nose; the tool hangs at x = y = 0.
  function holderSvg(F) {
    return solidSvg(G.disc(0, 6, 23, F, P), { tone: 'mid', crease: 'lo' })
      + solidSvg(G.disc(6, 9, 19, F, P), { tone: 'lo', crease: 'none' })
      + solidSvg(G.disc(9, 14, 23, F, P), { tone: 'mid', crease: 'lo' })
      + solidSvg(G.solidOf([[14, 16], [26, 13.5], [30, 13.5]], F, P), { tone: 'mid', crease: 'lo' })
      + solidSvg(G.disc(30, C.TOOL_S, 15, F, P, { steps: 8 }), { tone: 'hi', crease: 'lo' });
  }
  function flutes(F, r, teeth, phase, s0, s1) {
    const lead = 0.55 / r;
    const lines = [];
    for (let i = 0; i < teeth; i++) {
      let run = [];
      for (let s = s0; s <= s1 + 1e-6; s += 1) {
        const t = phase + (i / teeth) * TAU - (s - s0) * lead;
        const facing = Math.cos(t) * V[0] + Math.sin(t) * V[1];
        if (facing > 0.04) run.push(at(G.pointOf(F, Math.min(s, s1), r, t)));
        else if (run.length) { if (run.length > 1) lines.push(pathOf(run)); run = []; }
      }
      if (run.length > 1) lines.push(pathOf(run));
    }
    return lines.join('');
  }
  // an end mill of diameter d; below z = clipZ only what shows through the opening
  function endMillSvg(zn, d, teeth, phase, clip) {
    const F = fdown([0, 0, zn]);
    const r = d / 2;
    const s0 = C.TOOL_S;
    const s1 = s0 + C.END_L;
    const sf = s1 - 26;
    const sCut = clip ? clamp(zn - clip.z, s0, s1) : s1;
    let out = holderSvg(F);
    const body = (a, b, tip) => solidSvg(G.solidOf(tip ? [[a, r], [b - 0.6, r], [b, r - 0.6]] : [[a, r], [b, r]], F, P), { tone: 'hi', crease: 'lo', lit: true });
    if (sCut > s0 + 0.2) out += body(s0, sCut, sCut >= s1 - 1e-6) + lineSvg(flutes(F, r, teeth, phase, sf, Math.min(sCut, s1 - 0.6)) + (sf < sCut ? G.arcOf(F, sf, r, P) : ''), { tone: 'lo' });
    if (clip && sCut < s1 - 0.2) {
      out += `<clipPath id="fm-toolclip"><path d="${clip.d}"/></clipPath><g clip-path="url(#fm-toolclip)">${body(sCut, s1, true)}${lineSvg(flutes(F, r, teeth, phase, Math.max(sf, sCut), s1 - 0.6), { tone: 'lo' })}</g>`;
    }
    return out;
  }
  function faceMillSvg(zn, phase) {
    const R = C.FACE_R;
    const F = fdown([0, 0, zn]);
    const S0 = C.TOOL_S;
    const S1 = C.FACE_S;
    let out = solidSvg(G.disc(0, 6, 23, F, P), { tone: 'mid', crease: 'lo' }) + solidSvg(G.disc(6, 9, 19, F, P), { tone: 'lo', crease: 'none' }) + solidSvg(G.disc(9, 14, 23, F, P), { tone: 'mid', crease: 'lo' });
    out += solidSvg(G.solidOf([[14, 14], [S0 - 4, 14], [S0, 22], [S0 + 4, R - 2.5], [S1 - 3, R - 2.5], [S1 - 1.5, R - 4]], F, P, { steps: 72 }), { tone: 'mid', crease: 'lo' });
    const inserts = [];
    const pockets = [];
    for (let i = 0; i < 5; i++) {
      const t = phase + (i / 5) * TAU;
      const facing = Math.cos(t + 0.12) * V[0] + Math.sin(t + 0.12) * V[1];
      if (facing < 0.08) continue;
      inserts.push(poly([[S1 - 9, R - 2.5, t], [S1 - 9, R - 2.5, t + 0.24], [S1, R, t + 0.24], [S1, R, t]].map(([s, rr, a]) => at(G.pointOf(F, s, rr, a)))));
      pockets.push(poly([[S1 - 15, R - 2.5, t - 0.16], [S1 - 15, R - 2.5, t + 0.04], [S1 - 9, R - 2.5, t + 0.04], [S1 - 9, R - 2.5, t - 0.16]].map(([s, rr, a]) => at(G.pointOf(F, s, rr, a)))));
    }
    out += `<path class="fm-plate" d="${pockets.join('')}"/><path class="fm-insert" d="${inserts.join('')}"/>`;
    out += lineSvg(G.arcOf(F, S0 + 4, R - 2.5, P), { tone: 'lo' });
    return out;
  }
  // nose height for a tool tip at z
  const noseFor = (tool, zTip) => zTip + (tool === 'face' ? C.FACE_S : C.TOOL_S + C.END_L);

  // ------------------------------------------------------------ chips, deterministic in time
  function chipPath(cx, cy, size, turn) {
    const outer = [];
    const inner = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const a = turn + t * TAU * 1.1;
      const r = size * (0.42 + 0.58 * t);
      const w = size * (0.14 + 0.2 * t);
      outer.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.66]);
      inner.push([cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.66]);
    }
    return pathOf(outer.concat(inner.reverse()), true);
  }
  function chipsSvg(from, dir, clockS, rate, size = 2.6) {
    let out = '';
    const period = 1 / rate;
    const first = Math.floor((clockS - 1.2) / period);
    const k = G.scaleOf(P);
    for (let i = Math.max(0, first); i * period <= clockS; i++) {
      const age = clockS - i * period;
      if (age > 1.2) continue;
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const side = rnd > 0.5 ? 1 : -1;
      const p = [from[0] + dir[0] * 34 * age + side * 10 * age, from[1] + dir[1] * 34 * age, from[2] + 30 * age - 26 * age * age + 2];
      const [sx, sy] = at(p);
      const alpha = Math.min(1, age / 0.1) * (1 - clamp((age - 0.9) / 0.3, 0, 1));
      out += `<path class="fm-chip" style="opacity:${alpha.toFixed(2)}" d="${chipPath(sx, sy, size * 1.7 * k * (0.8 + 0.4 * rnd), rnd * 6.28 + age * 6)}"/>`;
    }
    return out;
  }

  // ------------------------------------------------------------ the loupe: a top view of the cutter in the cut
  // Lens units: radius 46; u to the right (+x), v down (−y), so the material lies
  // below the cutter. climb: the cutter travels toward −u with the material on
  // its −y side and turns clockwise seen from above, so each tooth enters thick.
  function loupeSvg(d, ae, teeth, phase, climb, fz, scale, opts = {}) {
    const R = 24;
    const kk = R / (d / 2);
    const a = Math.min(ae, d) * kk;
    const cy = -6;
    const edge = cy + R - a;
    const done = cy + R;
    const dir = climb ? -1 : 1; // travel along u
    const f2 = (v) => v.toFixed(2);
    const out = [];
    // the arc of the cut, from where the old face meets the circle to the new face
    const s = Math.sqrt(Math.max(0, 1 - ((R - a) / R) ** 2));
    const th0 = Math.atan2(R - a, dir * R * s);
    const th1 = Math.PI / 2;
    const arc = [];
    for (let i = 0; i <= 18; i++) { const th = th0 + ((th1 - th0) * i) / 18; arc.push([Math.cos(th) * R, cy + Math.sin(th) * R]); }
    const back = -dir * 60;
    const mat = [[dir * 60, edge], ...arc, [back, done], [back, 60], [dir * 60, 60]];
    out.push(`<path class="fm-mat" d="M${mat.map(([u, v]) => f2(u) + ' ' + f2(v)).join('L')}Z"/>`);
    out.push(`<path class="iso-line" data-tone="mid" d="M${f2(dir * 60)} ${f2(edge)}L${arc.map(([u, v]) => f2(u) + ' ' + f2(v)).join('L')}H${f2(back)}"/>`);
    // the chip of the next tooth: thick where the feed points into the material
    const thick = (th) => Math.max(0, Math.cos(th) * dir);
    const pts = [];
    const outer = [];
    const nominal = [];
    for (let i = 0; i <= 18; i++) {
      const th = th0 + ((th1 - th0) * i) / 18;
      const h = Math.min(R * 0.6, fz * thick(th) * scale);
      pts.push([Math.cos(th) * R, cy + Math.sin(th) * R]);
      outer.push([Math.cos(th) * (R + h), cy + Math.sin(th) * (R + h)]);
      nominal.push([Math.cos(th) * (R + fz * scale), cy + Math.sin(th) * (R + fz * scale)]);
    }
    out.push(`<path class="fm-bite" d="M${pts.concat(outer.slice().reverse()).map(([u, v]) => f2(u) + ' ' + f2(v)).join('L')}Z"/>`);
    if (opts.nominal) out.push(`<path class="fp-mark" d="M${nominal.map(([u, v]) => f2(u) + ' ' + f2(v)).join('L')}"/>`);
    // feed marks on the new face: one per tooth bite, fz apart (spacing exaggerated)
    if (opts.marks) {
      const step = fz * scale * 1.2;
      const ticks = [];
      for (let u = 0; Math.abs(u) < 44; u -= dir * step) ticks.push(`M${f2(u)} ${f2(done)}v4`);
      out.push(`<path class="iso-line" data-tone="lo" d="${ticks.join('')}"/>`);
      const u0 = -dir * step * 3;
      const u1 = u0 - dir * step;
      out.push(mark(`M${f2(u0)} ${f2(done + 8)}v4M${f2(u1)} ${f2(done + 8)}v4M${f2(u0)} ${f2(done + 10)}H${f2(u1)}`));
      out.push(`<text class="fp-ink fp-label" x="${f2((u0 + u1) / 2)}" y="${f2(done + 24)}" font-size="11" text-anchor="middle">fz</text>`);
    }
    // the cutter and its teeth, turning clockwise seen from above (v down: angle grows)
    out.push(`<circle class="fm-tool" cx="0" cy="${f2(cy)}" r="${R}"/>`);
    const teethD = [];
    for (let i = 0; i < teeth; i++) {
      const t = phase + (i / teeth) * TAU;
      teethD.push(`M${f2(Math.cos(t) * (R - 7))} ${f2(cy + Math.sin(t) * (R - 7))}L${f2(Math.cos(t) * R)} ${f2(cy + Math.sin(t) * R)}`);
    }
    out.push(`<path class="iso-line" data-tone="hi" d="${teethD.join('')}"/>`);
    out.push(`<circle class="fm-dot" cx="0" cy="${f2(cy)}" r="2.6"/>`);
    // the rotation (a short arc with a head) and the travel (a track ending on a dot)
    const ra = [];
    for (let i = 0; i <= 10; i++) { const t = -2.2 + (i / 10) * 1.2; ra.push([Math.cos(t) * (R + 8), cy + Math.sin(t) * (R + 8)]); }
    out.push(`<path class="fp-mark" d="M${ra.map(([u, v]) => f2(u) + ' ' + f2(v)).join('L')}"/><path class="fp-mark" d="${arrowHead(ra[8], ra[10], 5, true)}"/>`);
    out.push(`<path class="fp-mark" d="M0 ${f2(cy)}h${f2(dir * 15)}"/><path class="fp-mark" d="${arrowHead([0, cy], [dir * 15, cy], 4, true)}"/>`);
    return out.join('');
  }
  function loupeIn(key, [cx, cy], inner) {
    const sc = C.LR / 46;
    set(E[key + 'In'], `<g transform="translate(${cx} ${cy}) scale(${sc.toFixed(4)})">${inner}</g>`);
  }

  // ------------------------------------------------------------ the trunnion table (scene 7)
  // A tilts the cradle about the Y axis through the pivot (0, 0, ZA), so the
  // part's right-hand face rises toward the cutter; C turns the platter about the
  // cradle's own z. Everything is offset by the table position (tx, ty).
  const add3 = G.add3;
  const mul3 = G.mul3;
  const BK = { hx: 28, hy: 22, s0: -18, s1: 12 }; // the part on the platter
  function trunFrames(tx, ty, a, c) {
    const o = [tx, ty, C.ZA];
    const ex = [Math.cos(a), 0, Math.sin(a)];
    const ez = [-Math.sin(a), 0, Math.cos(a)];
    const bx = add3(mul3(ex, Math.cos(c)), mul3(Y, Math.sin(c)));
    const by = add3(mul3(ex, -Math.sin(c)), mul3(Y, Math.cos(c)));
    return { o, ex, ez, bx, by, pt: (p) => add3(o, add3(add3(mul3(bx, p[0]), mul3(by, p[1])), mul3(ez, p[2]))) };
  }
  function trunnionSvg(tx, ty, a, c, feats, trail) {
    const T = trunFrames(tx, ty, a, c);
    const pv = T.o;
    const Fy = G.frameOf(pv, Y, [0, 0, 1], [1, 0, 0]);
    const tower = (y0, y1) => {
      const plan = { x: -18 + tx, y: y0 + ty, w: 36, d: y1 - y0, r: 1 };
      return solidSvg(slabOf(plan, 64, C.ZA - 64, P, 3, 0.5), { tone: 'mid' })
        + solidSvg(G.disc(y0, y1, 18, Fy, P), { tone: 'mid', crease: 'lo' })
        + dotsSvg([[-15, y0 + 3], [15, y0 + 3], [-15, y1 - 3], [15, y1 - 3]].map(([x, y]) => at([x + tx, y + ty, 64])), { size: 0.42 });
    };
    const boss = (s0, s1) => solidSvg(G.disc(s0, s1, 11, Fy, P), { tone: 'hi', crease: 'lo' }) + dotsSvg(G.dotsOf(Fy, s1 > 0 ? s1 : s0, 7.5, 6, P, { least: -1 }), { size: 0.42 });
    const cheekPoly = [[-30, -36], [30, -36], [30, -10], [14, 4], [-14, 4], [-30, -10]];
    const Fc = G.frameOf(pv, Y, T.ex, T.ez);
    const cheek = (y0, y1) => solidSvg(G.prismOf(Fc, cheekPoly, y0, y1, P), { tone: 'mid', crease: 'lo' });
    const Fb = G.frameOf(pv, T.ez, T.ex, Y);
    const plate = solidSvg(G.prismOf(Fb, [[-34, -40], [34, -40], [34, 40], [-34, 40]], -36, -26, P), { tone: 'mid', crease: 'lo' });
    const Fp = G.frameOf(pv, T.ez, T.bx, T.by);
    const platter = solidSvg(G.disc(-26, -19, 30, Fp, P), { tone: 'mid', crease: 'lo' })
      + (G.dot3(T.ez, V) > 0.05 ? lineSvg(G.circleOf(Fp, -19, 22, P), { tone: 'faint' }) + dotsSvg(G.dotsOf(Fp, -19, 26, 8, P, { least: -1 }), { size: 0.45 }) : '');
    const part = solidSvg(G.prismOf(Fp, [[-BK.hx, -BK.hy], [BK.hx, -BK.hy], [BK.hx, BK.hy], [-BK.hx, BK.hy]], BK.s0, BK.s1, P), { tone: 'hi', crease: 'lo' });
    // machined features on the part's faces, drawn when the face looks at us
    let marks = '';
    for (const f of feats) {
      const n = add3(add3(mul3(T.bx, f.n[0]), mul3(T.by, f.n[1])), mul3(T.ez, f.n[2]));
      if (G.dot3(n, V) < 0.05 || f.r < 0.3) continue;
      const u = T.ez;
      const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
      const Ff = G.frameOf(T.pt(f.c), n, u, v);
      const d = G.circleOf(Ff, 0, f.r, P, 28);
      marks += `<path class="fm-hole" d="${d}"/><path class="iso-line" data-tone="hi" d="${d}"/>`;
    }
    const back = [tower(-66, -52) + boss(-71, -66), cheek(-52, -40), plate, platter, part, marks];
    const front = [cheek(40, 52), tower(52, 66) + boss(66, 71)];
    let tr = '';
    if (trail && trail.length > 1) tr = `<path class="fm-path" d="${pathOf(trail.map((p) => at(T.pt(p))))}"/>`;
    return { back: back.join(''), front: front.join(''), T, trail: tr };
  }
  // the top edge of the part, as a loop (block-local), t in 0..1
  function edgeAt(t) {
    const { hx, hy, s1 } = BK;
    const per = 4 * (hx + hy);
    let d = ((t % 1) + 1) % 1 * per;
    const seg = [[hx * 2, [-hx, hy], [1, 0]], [hy * 2, [hx, hy], [0, -1]], [hx * 2, [hx, -hy], [-1, 0]], [hy * 2, [-hx, -hy], [0, 1]]];
    for (const [len, p, dv] of seg) {
      if (d <= len) return [p[0] + dv[0] * d, p[1] + dv[1] * d, s1];
      d -= len;
    }
    return [-hx, hy, s1];
  }

  // ------------------------------------------------------------ camera
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], kk);
    const cy = lerp(c.from[1], c.to[1], kk);
    const w = lerp(c.from[2], c.to[2], kk);
    camW = w;
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the programme of scenes 1–3 (block-local tool positions)
  const PASS = [[-20, 85, -85], [20, -85, 85]]; // face mill: v, from, to
  const STRIPS = [-15, -9, -3, 3, 9, 15]; // T2 roughing rows (Ø10), x from -25 to 25
  function roughAt(t) {
    // t in 0..1 over the zigzag; returns the tool position and the cleared area
    const n = STRIPS.length;
    const k = Math.min(n - 1, Math.floor(t * n));
    const f = t * n - k;
    const x = k % 2 === 0 ? lerp(-25, 25, f) : lerp(25, -25, f);
    return { x, y: STRIPS[k], k, f };
  }
  function roughOpen(t) {
    const { x, y, k } = roughAt(t);
    const right = k % 2 === 0;
    const xa = right ? -30 : x - 5;
    const xb = right ? x + 5 : 30;
    if (k === 0) return [[xa, -20], [xb, -20], [xb, y + 5], [xa, y + 5]];
    const yd = y - 1; // rows before this one are cleared up to here
    return right
      ? [[-30, -20], [30, -20], [30, yd], [xb, yd], [xb, y + 5], [-30, y + 5]]
      : [[-30, -20], [30, -20], [30, y + 5], [xa, y + 5], [xa, yd], [-30, yd]];
  }
  const CONTOUR = (() => {
    // T3's centre path: the pocket outline offset by its radius 4, start mid front
    const r = 4;
    const pts = [[0, C.PD - r], [-(C.PW - r), C.PD - r], [-(C.PW - r), -(C.PD - r)], [C.PW - r, -(C.PD - r)], [C.PW - r, C.PD - r], [0, C.PD - r]];
    const len = [];
    let tot = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); len.push(l); tot += l; }
    return { pts, len, tot };
  })();
  function contourAt(t) {
    let d = clamp(t, 0, 1) * CONTOUR.tot;
    for (let i = 0; i < CONTOUR.len.length; i++) {
      if (d <= CONTOUR.len[i]) { const a = CONTOUR.pts[i]; const b = CONTOUR.pts[i + 1]; const f = d / CONTOUR.len[i]; return { p: [lerp(a[0], b[0], f), lerp(a[1], b[1], f)], i }; }
      d -= CONTOUR.len[i];
    }
    return { p: CONTOUR.pts[CONTOUR.pts.length - 1], i: CONTOUR.len.length - 1 };
  }
  // the wall the cutter leaves: the pocket outline, traced as far as the cutter got
  function contourTrace(t) {
    const out = [];
    const ring = roundRect(-C.PW, C.PW, -C.PD, C.PD, 4, 6);
    // start at the middle of the front wall and run the same way as the cutter
    const start = ring.findIndex(([x, y]) => y > C.PD - 0.01 && x <= 0);
    const ordered = ring.slice(start).concat(ring.slice(0, start + 1));
    const m = Math.max(2, Math.round(ordered.length * clamp(t, 0, 1)));
    for (let i = 0; i < Math.min(m, ordered.length); i++) out.push(ordered[i]);
    return out;
  }

  // ------------------------------------------------------------ render
  let shown = -1;
  const ALL = ['viceB', 'viceF', 'block', 'pocket', 'trunB', 'trunF', 'contour', 'troch', 'ae', 'q', 'vf', 'lock', 'simul', 'lp1', 'lp2', 'chips', 'tool'];
  const VIS = [
    ['viceB', 'viceF', 'block', 'tool'],
    ['viceB', 'viceF', 'block', 'tool', 'chips'],
    ['viceB', 'viceF', 'block', 'pocket', 'tool', 'chips', 'contour'],
    ['viceB', 'viceF', 'block', 'tool', 'chips', 'ae', 'q', 'vf', 'lp1'],
    ['viceB', 'viceF', 'block', 'tool', 'chips', 'lp1', 'lp2'],
    ['viceB', 'viceF', 'block', 'pocket', 'tool', 'chips', 'troch', 'lp1'],
    ['trunB', 'trunF', 'tool', 'lock', 'simul'],
  ];

  function render(si, u) {
    if (si !== shown) {
      shown = si;
      for (const k of ALL) show(E[k], VIS[si].includes(k));
    }
    camera(si, u);
    const clockS = u * C.dur[si];
    let tx = 0;
    let ty = 0;
    let tool = 'end10';
    let zTip = TOP + 40;
    let toolOn = 1;
    let phase = clockS * 7;
    let clip = null;
    let chips = '';
    let magTurn = 0;
    let blk = '';
    let pocket = '';

    if (si === 0) {
      // the block comes in; the magazine indexes; T1 goes into the spindle and comes down
      magTurn = span(u, 0.2, 0.5) * (TAU / 16) * 3;
      tool = 'face';
      toolOn = span(u, 0.5, 0.6);
      zTip = lerp(TOP + 80, TOP + 18, span(u, 0.62, 0.95));
      const m = span(u, 0.08, 0.9);
      tx = lerp(0, -PASS[0][1], m);
      ty = lerp(30, -PASS[0][0], m);
      phase = clockS * 4 * span(u, 0.6, 0.8);
      blk = blockSvg(tx, ty, null);
    } else if (si === 1) {
      tool = 'face';
      const p1 = span(u, 0.1, 0.47);
      const sw = span(u, 0.47, 0.55);
      const p2 = span(u, 0.55, 0.92);
      const x = p2 > 0 ? lerp(PASS[1][1], PASS[1][2], p2) : lerp(PASS[0][1], PASS[0][2], p1);
      const v = lerp(PASS[0][0], PASS[1][0], sw);
      tx = -x;
      ty = -v;
      zTip = lerp(TOP + 18, TOP, span(u, 0, 0.08)) + 18 * span(u, 0.94, 1);
      phase = clockS * 5;
      const passes = [[PASS[0][0], PASS[0][1], lerp(PASS[0][1], PASS[0][2], p1)]];
      if (p2 > 0) passes.push([PASS[1][0], PASS[1][1], lerp(PASS[1][1], PASS[1][2], p2)]);
      blk = blockSvg(tx, ty, null) + facedSvg(tx, ty, passes);
      if ((p1 > 0 && p1 < 1) || (p2 > 0 && p2 < 1)) {
        const inBlock = Math.abs(x) < BX + C.FACE_R - 4;
        if (inBlock) chips = chipsSvg([0, 22, TOP + 1], [0.4, 1], clockS, 6, 2.2);
      }
    } else if (si === 2) {
      // T2 roughs the pocket (zigzag); T3 runs the contour
      const ch1 = span(u, 0, 0.1);
      const rough = span(u, 0.12, 0.58);
      const ch2 = span(u, 0.6, 0.68);
      const cont = span(u, 0.7, 0.97);
      let p = [-25, -15];
      let open = null;
      if (u < 0.6) {
        tool = 'end10';
        toolOn = u < 0.05 ? span(u, 0, 0.05) : 1;
        const r = roughAt(rough);
        p = [r.x, r.y];
        zTip = rough > 0 ? TOP - C.PDEPTH : lerp(TOP + 30, TOP + 2, ch1);
        if (u > 0.58) zTip = TOP - C.PDEPTH + 40 * span(u, 0.58, 0.6);
        if (rough > 0) open = roughOpen(rough);
      } else {
        tool = 'end8';
        toolOn = span(u, 0.61, 0.66);
        const c = contourAt(cont);
        p = cont > 0 ? c.p : [0, C.PD - 4];
        zTip = cont > 0 ? TOP - C.PDEPTH : lerp(TOP + 40, TOP - C.PDEPTH, span(ch2, 0.4, 1));
        if (u > 0.975) zTip = TOP - C.PDEPTH + 30 * span(u, 0.975, 1);
        open = roundRect(-C.PW, C.PW, -C.PD, C.PD, cont > 0.98 ? 4 : 5);
      }
      tx = -p[0];
      ty = -p[1];
      blk = blockSvg(tx, ty, null) + facedSvg(tx, ty, PASS.map(([v, a, b]) => [v, a, b]));
      if (open) {
        pocket = recessSvg(tx, ty, [-C.PW, C.PW, -C.PD, C.PD], C.PDEPTH, open, 'fm-pk');
        clip = { z: TOP, d: poly(open.map(([x, y]) => at([x + tx, y + ty, TOP]))) };
      }
      // the contour: the finished wall traced petrol behind T3
      if (u >= 0.6) {
        const tr = contourTrace(cont);
        set(E.contour, tr.length > 1 ? `<path class="fm-path" d="${pathOf(tr.map(([x, y]) => at([x + tx, y + ty, TOP])))}"/>` : '');
      } else set(E.contour, '');
      const cutting = (u > 0.12 && u < 0.58) || (u > 0.7 && u < 0.97);
      if (cutting) chips = chipsSvg([0, 0, TOP], [0.3, 1], clockS, 5, 1.8);
    } else if (si === 3 || si === 4) {
      // a step along the front face, ae 3, ap 10, the Ø12 cutter in climb
      tool = 'end12';
      const ap = 10;
      const ae = 3;
      const yb = BY - ae;
      const yc = BY + 6 - ae;
      const t = span(u, 0.04, 0.96);
      const x = lerp(BX + 14, -BX + 6, t);
      tx = -x;
      ty = -yc;
      zTip = lerp(TOP + 14, TOP - ap, span(u, 0, 0.04));
      phase = clockS * 6;
      blk = blockSvg(tx, ty, { rx0: x, yb, ap });
      if (x < BX + 6) chips = chipsSvg([-4, -4, TOP - 4], [0.2, 1], clockS, 6, 2);
      if (si === 3) {
        // ae: the band ahead of the cutter; Q: the band it has removed; vf: the table's travel
        const a0 = at([-BX + tx, yb + ty, TOP]);
        const a1 = at([Math.min(x, BX) - 8 + tx, yb + ty, TOP]);
        const b0 = at([-BX + tx, BY + ty, TOP]);
        const b1 = at([Math.min(x, BX) - 8 + tx, BY + ty, TOP]);
        const lp = at([Math.min(x, BX) - 26 + tx, BY + ty + 12, TOP + 2]);
        set(E.ae, mark(pathOf([a0, a1]) + pathOf([b0, b1]) + pathOf([a0, b0])) + label(lp[0], lp[1], 'ae', 20, 'middle'));
        const q0 = Math.min(Math.max(x, -BX), BX);
        const Q = [[q0, yb, TOP], [BX, yb, TOP], [BX, BY, TOP], [q0, BY, TOP]];
        const Qb = Q.map(([qx, qy]) => [qx, qy, TOP - ap]);
        const Wq = (p) => at([p[0] + tx, p[1] + ty, p[2]]);
        const ql = Wq([(q0 + BX) / 2, BY + 4, TOP + 14]);
        set(E.q, BX - q0 > 2 ? mark(poly(Q.map(Wq)) + pathOf([Wq(Q[3]), Wq(Qb[3]), Wq(Qb[2]), Wq(Q[2])]) + pathOf([Wq(Qb[2]), Wq(Qb[1]), Wq(Q[1])])) + label(ql[0], ql[1], 'Q', 22) : '');
        const v0 = at([TABLE_X0 + tx, 62 + ty, 60]);
        const v1 = at([TABLE_X0 + 60 + tx, 62 + ty, 60]);
        const vl = at([TABLE_X0 + 30 + tx, 62 + ty, 44]);
        set(E.vf, mark(pathOf([v0, v1])) + mark(arrowHead(v0, v1, 9)) + label(vl[0], vl[1], 'vf', 20));
        loupeIn('lp1', C.L1, loupeSvg(12, ae, 3, -clockS * 2.4, true, 0.05, 200, { marks: true }));
        set(E.lp1Lab, '');
      } else {
        loupeIn('lp1', C.L1, loupeSvg(12, ae * 2, 3, -clockS * 2.4, true, 0.05, 200));
        loupeIn('lp2', C.L2, loupeSvg(12, ae * 2, 3, -clockS * 2.4, false, 0.05, 200));
        set(E.lp1Lab, '');
        set(E.lp2Lab, '');
      }
    } else if (si === 5) {
      // beats 1–2: a light side cut, ae 1 of Ø10, and its thin chip; beat 3: a trochoidal slot
      const tr = span(u, 0.7, 0.98);
      if (u < 0.68) {
        tool = 'end10';
        const yb = BY - 1;
        const x = lerp(BX + 12, -BX + 10, span(u, 0.03, 0.66));
        tx = -x;
        ty = -(BY + 5 - 1);
        zTip = TOP - 10;
        blk = blockSvg(tx, ty, { rx0: x, yb, ap: 10 });
        if (x < BX + 5) chips = chipsSvg([-4, -4, TOP - 4], [0.2, 1], clockS, 6, 1.6);
        set(E.troch, '');
        set(E.pocket, '');
      } else {
        tool = 'end10';
        const depth = 18;
        const xs = 31;
        const xe = -31;
        const loops = 9;
        const rr = 3.5;
        const pathPt = (t) => [lerp(xs, xe, t) + rr * Math.cos(t * loops * TAU), rr * Math.sin(t * loops * TAU)];
        const p = pathPt(tr);
        tx = -p[0];
        ty = -p[1];
        zTip = u < 0.7 ? lerp(TOP + 20, TOP - depth, span(u, 0.68, 0.7)) : TOP - depth;
        if (u > 0.985) zTip = TOP - depth + 40 * span(u, 0.985, 1);
        blk = blockSvg(tx, ty, null);
        const xLo = Math.min(xs + rr, lerp(xs, xe, tr) - 5 - rr);
        const open = roundRect(xLo, xs + rr + 5, -(rr + 5), rr + 5, rr + 5, 6);
        pocket = recessSvg(tx, ty, [xLo, xs + rr + 5, -(rr + 5), rr + 5], depth, open, 'fm-sl');
        clip = { z: TOP, d: poly(open.map(([x, y]) => at([x + tx, y + ty, TOP]))) };
        const ahead = [];
        for (let i = 0; i <= 160; i++) { const t = tr + (1 - tr) * (i / 160); ahead.push(pathPt(t)); }
        set(E.troch, `<path class="fm-path" d="${pathOf(ahead.map(([x, y]) => at([x + tx, y + ty, TOP + 0.2])))}"/>`);
        if (tr > 0 && tr < 1) chips = chipsSvg([0, 0, TOP], [0.3, 1], clockS, 6, 1.6);
      }
      loupeIn('lp1', C.L1, loupeSvg(10, 1, 4, -clockS * 2.4, true, 0.05, 300, { nominal: true }));
      set(E.lp1Lab, '');
    } else if (si === 6) {
      // the trunnion: turn and tilt; 3+2 (lock, cut a feature); another face; then simultaneous
      tool = 'end10';
      const b2 = 0.27;
      const b3 = 0.5;
      const b4 = 0.74;
      let a = 0;
      let c = 0;
      const feats = [];
      const lockOn = u > b2 + 0.03 && u < b4;
      c = span(u, 0.04, 0.14) * (Math.PI / 4) - span(u, 0.14, 0.2) * (Math.PI / 4);
      a = span(u, 0.12, 0.24) * 30 * DEG;
      // 3+2 on the front face
      const cut1 = span(u, b2 + 0.06, b2 + 0.18);
      const f1c = { n: [1, 0, 0], c: [BK.hx, 0, -3], r: 9 * cut1 };
      // turn 90°: the part's −y face comes up to the cutter
      const turn = span(u, b3 + 0.02, b3 + 0.08);
      c += turn * (Math.PI / 2);
      const cut2 = span(u, b3 + 0.1, b3 + 0.2);
      const f2c = { n: [0, -1, 0], c: [0, -BK.hy, -3], r: 9 * cut2 };
      feats.push(f1c, f2c);
      // simultaneous: A and C move together while the cutter follows the top edge
      const sim = span(u, b4 + 0.02, 0.98);
      let target = null;
      let trail = null;
      if (u >= b4) {
        const tt = sim;
        c = Math.PI / 2 + tt * TAU;
        a = (30 - 14 * Math.sin(tt * TAU * 2) * span(u, b4, b4 + 0.05)) * DEG;
        const e0 = 0.125;
        target = edgeAt(e0 + tt);
        trail = [];
        for (let i = 0; i <= 64; i++) trail.push(edgeAt(e0 + tt * (i / 64)));
      }
      // where the cutter works: its target point under the spindle
      const T0 = trunFrames(0, 0, a, c);
      let zt = TOP + 70;
      let hover = null;
      if (u > b2 && u < b3) hover = f1c.c;
      else if (u > b3 + 0.08 && u < b4) hover = f2c.c;
      const goal = target || hover;
      if (goal) {
        const gp = T0.pt(goal);
        tx = -gp[0];
        ty = -gp[1];
        let dip = 1;
        if (!target) {
          const ph = u < b3 ? span(u, b2 + 0.02, b2 + 0.06) * (1 - span(u, b2 + 0.19, b2 + 0.22)) : span(u, b3 + 0.08, b3 + 0.1) * (1 - span(u, b3 + 0.21, b3 + 0.23));
          dip = ph;
        } else dip = span(u, b4, b4 + 0.03);
        zt = lerp(gp[2] + 50, gp[2], dip);
      }
      zTip = zt;
      const tr = trunnionSvg(tx, ty, a, c, feats, trail);
      set(E.trunB, tr.back);
      set(E.trunF, tr.front);
      set(E.simul, tr.trail);
      // the lock: rings at the A bosses and round the platter while the rotary axes stand
      const T = tr.T;
      if (lockOn) {
        const Fy = G.frameOf(T.o, Y, Z, X);
        const Fp = G.frameOf(T.o, T.ez, T.bx, T.by);
        const al = at([T.o[0] - 4, T.o[1] + 72, T.o[2] + 30]);
        const cl = at(add3(add3(T.o, mul3(T.ex, 44)), mul3(T.ez, -22)));
        set(E.lock, mark(G.circleOf(Fy, 71.5, 14, P, 32)) + mark(G.circleOf(Fp, -22.5, 33, P, 48)) + label(al[0], al[1], 'A', 20, 'middle') + label(cl[0], cl[1], 'C', 20, 'start'));
      } else set(E.lock, '');
      phase = clockS * 7;
      if (goal && zTip < (target ? T.pt(target)[2] : T.pt(hover)[2]) + 1) chips = chipsSvg([0, 0, zTip], [0.3, 1], clockS, 5, 1.6);
    }

    // the machine follows: saddle in Y, table in X and Y, head in Z
    move(E.saddle, [0, ty, 0]);
    move(E.table, [tx, ty, 0]);
    move(E.viceB, [tx, ty, 0]);
    move(E.viceF, [tx, ty, 0]);
    const zn = noseFor(tool, zTip);
    move(E.head, [0, 0, zn - ZN0]);
    if (si < 6) { set(E.block, blk); if (si === 2 || (si === 5 && u >= 0.68)) set(E.pocket, pocket); }
    // the magazine's tool pockets
    {
      const [mx, my, mz] = C.MAG;
      const F = G.frameOf([mx, my, mz], X, Y, Z);
      const pk = [];
      const dots = [];
      for (let i = 0; i < 16; i++) {
        const p = G.pointOf(F, 14, 33, (i / 16) * TAU + 0.1 + magTurn);
        const Fp = G.frameOf(p, X, Y, Z);
        pk.push(G.circleOf(Fp, 0, 4.4, P, 14));
        dots.push(at(p));
      }
      set(E.magFace, lineSvg(pk.join(''), { tone: 'lo' }) + dotsSvg(dots, { size: 0.5, tone: 'mid' }) + lineSvg(G.circleOf(F, 14, 24, P, 48), { tone: 'faint' }));
    }
    let toolHtml = '';
    if (toolOn > 0.02) {
      if (tool === 'face') toolHtml = faceMillSvg(zn, phase);
      else toolHtml = endMillSvg(zn, tool === 'end12' ? 12 : tool === 'end8' ? 8 : 10, tool === 'end12' ? 3 : 4, phase, clip);
    }
    set(E.tool, toolHtml);
    fade(E.tool, toolOn);
    set(E.chips, chips);
  }
  const TABLE_X0 = -100;

  return { render };
})();
