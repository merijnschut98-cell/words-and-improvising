// The stage of the film "Een CNC-programma loopt / A CNC program runs": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope, the lathe module as G) and a preamble from build.mjs that
// defines P (projection), C (world constants, the compiled slot program and
// the beat starts per scene), CAM (one camera move per scene), W, H and the
// HUD boxes LIST, TAB, INS, CAMS.
/* global G, P, C, CAM, W, H, LIST, TAB, INS, CAMS, iso, pathOf, solidSvg, lineSvg, dotsSvg, slabOf, cylinder, translateAlong, span */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const LANG = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'nl';
  const X = [1, 0, 0];
  const Y = [0, 1, 0];
  const Z = [0, 0, 1];
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => iso(p, P);
  const V = G.viewOf(P);
  const TOP = C.TOP;
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, o) => { const s = String(Math.round(clamp(o, 0, 1) * 100) / 100); if (e.style.opacity !== s) e.style.opacity = s; };
  const num = (v, dec) => { const s = v.toFixed(dec); return LANG === 'nl' ? s.replace('.', ',') : s; };
  let camW = W;
  const label = (x, y, text, size = 22, anchor = 'middle', hud = false, cls = 'fp-ink fp-label') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${f1(hud ? size : (size * camW) / W)}" text-anchor="${anchor}">${text}</text>`;
  const mark = (d, extra = '') => `<path class="fp-mark" d="${d}"${extra}/>`;
  const arrowHead = (from, to, len, hud = false) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    const l = hud ? len : (len * camW) / W;
    return `M${f1(to[0] - ux * l - uy * l * 0.55)} ${f1(to[1] - uy * l + ux * l * 0.55)}L${f1(to[0])} ${f1(to[1])}L${f1(to[0] - ux * l + uy * l * 0.55)} ${f1(to[1] - uy * l - ux * l * 0.55)}`;
  };
  // keyframes [[u, ...values]], eased between neighbours
  const kf = (frames, u) => {
    if (u <= frames[0][0]) return frames[0].slice(1);
    for (let i = 1; i < frames.length; i++) {
      const [u1] = frames[i];
      if (u <= u1) {
        const a = frames[i - 1];
        const t = span(u, a[0], u1);
        return a.slice(1).map((v, j) => lerp(v, frames[i][j + 1], t));
      }
    }
    return frames[frames.length - 1].slice(1);
  };

  // ------------------------------------------------------------ program and table coordinates
  // program (G54) point → table-local world point
  const Wp = (x, y, z = 0) => [x - 10, 25 - y, TOP + z];
  function posAt(b, u) {
    const z = b.from[2] + (b.to[2] - b.from[2]) * u;
    if (b.kind === 'arc') { const a = b.a0 - b.sw * u; return [b.c[0] + Math.cos(a) * b.r, b.c[1] + Math.sin(a) * b.r, z]; }
    return [b.from[0] + (b.to[0] - b.from[0]) * u, b.from[1] + (b.to[1] - b.from[1]) * u, z];
  }
  // put the tool tip at a table-local point: the table moves under the fixed spindle
  let rel = [0, 0];
  function place(local, tool) {
    rel = [local[0], local[1]];
    move(E.table, [-local[0], -local[1], 0]);
    move(E.saddle, [0, -local[1], 0]);
    const hb = local[2] + C.TOOLS[tool].len + 30;
    move(E.head, [0, 0, hb - C.HB0]);
    return local[2];
  }
  const overPlate = () => Math.abs(rel[0] - (C.PL.x + C.PL.w / 2)) < C.PL.w / 2 && Math.abs(rel[1] - (C.PL.y + C.PL.d / 2)) < C.PL.d / 2;

  // ------------------------------------------------------------ the tool in the spindle (world, at x = y = 0)
  const HOLDER = [[0, 17], [3, 17], [3.5, 19], [8, 19], [8.5, 15], [12, 13], [26, 10], [30, 8]];
  function cutProfile(prof, sMax) {
    const out = [];
    for (let i = 0; i < prof.length; i++) {
      const [s, r] = prof[i];
      if (s <= sMax) { out.push([s, r]); continue; }
      if (i > 0 && prof[i - 1][0] < sMax) {
        const [s0, r0] = prof[i - 1];
        out.push([sMax, r0 + ((r - r0) * (sMax - s0)) / (s - s0)]);
      }
      break;
    }
    return out;
  }
  function flutes(F, s0, s1, r, n, phase) {
    const lead = 0.6 / r;
    const lines = [];
    for (let i = 0; i < n; i++) {
      let run = [];
      for (let s = s0; s <= s1 + 1e-6; s += 1) {
        const t = phase + (i / n) * TAU - (s - s0) * lead;
        if (G.dot3(G.radialOf(F, t), V) > 0.05) run.push(at(G.pointOf(F, s, r, t)));
        else if (run.length) { if (run.length > 1) lines.push(pathOf(run)); run = []; }
      }
      if (run.length > 1) lines.push(pathOf(run));
    }
    return lines.join('');
  }
  function toolSvg(tool, tip, phase) {
    const T = C.TOOLS[tool];
    const nose = tip + T.len;
    const F = G.frameOf([0, 0, nose], [0, 0, -1], X, Y);
    const sMax = overPlate() && tip < TOP ? nose - TOP : T.len + 1;
    let out = solidSvg(G.solidOf(HOLDER, F, P), { tone: 'mid', crease: 'lo' }) + dotsSvg(G.dotsOf(F, 5.8, 19, 6, P), { size: 0.45, tone: 'lo' });
    if (tool === 'probe') {
      out += solidSvg(G.solidOf([[30, 9], [46, 9], [50, 6], [52, 2]], F, P), { tone: 'mid', crease: 'lo' });
      out += lineSvg(G.arcOf(F, 38, 9, P), { tone: 'faint' }) + dotsSvg([at(G.pointOf(F, 42, 9, Math.atan2(V[1], V[0])))], { size: 0.9, tone: 'hi' });
      out += solidSvg(G.solidOf([[52, 1.5], [T.len - 5.6, 1.5]], F, P), { tone: 'hi', crease: 'none' });
      out += solidSvg(G.solidOf([[T.len - 6, 0.6], [T.len - 5, 2.4], [T.len - 3, 3], [T.len - 1, 2.4], [T.len, 0.5]], F, P), { tone: 'hi', crease: 'none' });
    } else {
      const r = T.r;
      const body = tool === 'drill' ? [[30, r], [T.len - 2.4, r], [T.len, 0.4]] : [[30, r], [T.len - 0.6, r], [T.len, r - 0.6]];
      const prof = cutProfile(body, sMax);
      if (prof.length > 1) {
        out += solidSvg(G.solidOf(prof, F, P), { tone: 'hi', crease: 'lo' });
        const sf = tool === 'drill' ? 36 : T.len - 24;
        const se = Math.min(sMax, T.len - (tool === 'drill' ? 2.6 : 0.8));
        if (se > sf + 1) out += lineSvg(flutes(F, sf, se, r, tool === 'drill' ? 2 : 4, phase) + (tool === 'mill' ? G.arcOf(F, sf, r, P) : ''), { tone: 'lo' });
      }
    }
    return out;
  }
  // the length dimension beside the tool: from the spindle nose to the tip
  function lenDimSvg(tool, tip) {
    const nose = tip + C.TOOLS[tool].len;
    const x = 26;
    const a = at([x, 0, nose]);
    const b = at([x, 0, tip]);
    return mark(pathOf([at([12, 0, nose]), at([x + 6, 0, nose])])) + mark(pathOf([at([6, 0, tip]), at([x + 6, 0, tip])]))
      + mark(pathOf([a, b])) + mark(arrowHead(a, b, 8)) + mark(arrowHead(b, a, 8))
      + label(at([x + 8, 0, (nose + tip) / 2])[0], at([x + 8, 0, (nose + tip) / 2])[1] + 8 * camW / W, 'L', 24, 'start');
  }

  // ------------------------------------------------------------ the slot, as far as it is cut (table-local)
  function slotOutline(pts, r) {
    const out = [];
    const n = pts.length;
    if (n < 2) {
      for (let i = 0; i < 28; i++) { const a = (i / 28) * TAU; out.push([pts[0][0] + Math.cos(a) * r, pts[0][1] + Math.sin(a) * r]); }
      return out;
    }
    const tan = pts.map((_, i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(n - 1, i + 1)];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      return [dx / l, dy / l];
    });
    const left = pts.map(([x, y], i) => [x - tan[i][1] * r, y + tan[i][0] * r]);
    const right = pts.map(([x, y], i) => [x + tan[i][1] * r, y - tan[i][0] * r]);
    const cap = (p, from) => {
      const res = [];
      const a0 = Math.atan2(from[1] - p[1], from[0] - p[0]);
      for (let i = 1; i < 14; i++) { const a = a0 - (Math.PI * i) / 14; res.push([p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r]); }
      return res;
    };
    return [...left, ...cap(pts[n - 1], left[n - 1]), ...right.slice().reverse(), ...cap(pts[0], right[0])];
  }
  function cutOf(i, u) {
    const pts = [];
    let depth = 0;
    for (let j = 0; j <= i && j < C.blocks.length; j++) {
      const b = C.blocks[j];
      if (b.kind === 'none' || b.kind === 'rapid') continue;
      const uu = j < i ? 1 : u;
      const steps = Math.max(1, Math.ceil((b.len * uu) / 1.5));
      for (let s = 0; s <= steps; s++) {
        const p = posAt(b, (uu * s) / steps);
        if (p[2] > -1e-6) continue;
        depth = Math.max(depth, -p[2]);
        const last = pts[pts.length - 1];
        if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.4) pts.push([p[0], p[1]]);
      }
    }
    return pts.length ? { pts, depth } : null;
  }
  function slotSvg(cut) {
    if (!cut) return '';
    const ol = slotOutline(cut.pts, C.TOOLS.mill.r);
    const top = pathOf(ol.map(([x, y]) => at(Wp(x, y, 0))), true);
    const floor = pathOf(ol.map(([x, y]) => at(Wp(x, y, -cut.depth))), true);
    return `<clipPath id="fp-slotclip"><path d="${top}"/></clipPath><path class="iso-shade" data-shade="0" d="${top}"/><g clip-path="url(#fp-slotclip)"><path class="fp-cut" d="${floor}"/>${lineSvg(floor, { tone: 'lo' })}</g>${lineSvg(top, { tone: 'mid' })}`;
  }
  const FULL = cutOf(C.blocks.length - 1, 1);

  // ------------------------------------------------------------ marks on the plate (table-local)
  function g54Svg() {
    const o = at(Wp(0, 0, 0));
    const ex = at(Wp(14, 0, 0));
    const ey = at(Wp(0, 14, 0));
    const ring = [];
    for (let i = 0; i <= 24; i++) { const a = (i / 24) * TAU; ring.push(at(Wp(Math.cos(a) * 3.4, Math.sin(a) * 3.4, 0))); }
    const lp = at(Wp(-7, -7, 0));
    return mark(pathOf(ring, true)) + mark(pathOf([o, ex])) + mark(arrowHead(o, ex, 7)) + mark(pathOf([o, ey])) + mark(arrowHead(o, ey, 7))
      + label(lp[0], lp[1], 'G54', 20, 'end') + label(ex[0] + 4 * camW / W, ex[1] + 14 * camW / W, 'X', 18, 'start') + label(ey[0], ey[1] - 6 * camW / W, 'Y', 18, 'middle');
  }
  // a dimension along program Y at program x, from y0 to y1, raised a little over the plate
  function dimY(x, y0, y1, text, dashed = false, anchor = 'start') {
    const a = at(Wp(x, y0, 0.5));
    const b = at(Wp(x, y1, 0.5));
    const lp = at(Wp(x, y1 + 4, 0.5));
    const extra = dashed ? ' stroke-dasharray="5 4"' : '';
    return mark(pathOf([a, b]), extra) + mark(arrowHead(a, b, 8)) + mark(pathOf([at(Wp(x - 3, y0, 0.5)), at(Wp(x + 3, y0, 0.5))]))
      + label(lp[0] + (anchor === 'end' ? -4 : 4) * camW / W, lp[1], text, 18, anchor);
  }

  // the depth gauge of the first-off check, on the plate over the slot
  function gaugeSvg(lift, needle) {
    const cx = -10;
    const cy = 5;
    const z = TOP + lift;
    let out = solidSvg(slabOf({ x: cx - 18, y: cy - 3, w: 36, d: 6, r: 1 }, z, 5, P, 2, 0.4), { tone: 'mid', crease: 'lo' });
    out += solidSvg(cylinder(cx, cy, 2.4, z + 5, 9, P, 14), { tone: 'mid', crease: 'lo' });
    const F = G.frameOf([cx, cy - 3, z + 26], Y, X, Z);
    out += solidSvg(G.disc(0, 6, 12, F, P), { tone: 'mid', crease: 'lo' });
    out += solidSvg(G.disc(6, 7, 10.5, F, P), { tone: 'hi', crease: 'none' });
    const ticks = [];
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * TAU;
      ticks.push(pathOf([at(G.pointOf(F, 7, 8.6, a)), at(G.pointOf(F, 7, i % 5 ? 9.6 : 10.2, a))]));
    }
    out += lineSvg(ticks.join(''), { tone: 'lo' });
    const a = needle * TAU * 0.8 + Math.PI / 2;
    out += `<path class="fp-mark" style="stroke-width:1.8" d="${pathOf([at(G.pointOf(F, 7, 0, 0)), at(G.pointOf(F, 7, 8, a))])}"/>` + dotsSvg([at(G.pointOf(F, 7, 0, 0))], { size: 0.8, tone: 'hi' });
    out += solidSvg(G.disc(-4, 0, 2.2, G.frameOf([cx, cy - 3, z + 40], Y, X, Z), P), { tone: 'lo' });
    return out;
  }

  // ------------------------------------------------------------ HUD pieces
  const mono = (x, y, t, size = 20, anchor = 'start', cls = 'fp-ink fp-code') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  function curSvg(i) {
    if (i < 0) return '';
    const y = LIST.y + 32 + i * LIST.lh;
    return `<path class="fp-cur" d="M${LIST.x + 6} ${y - 20}h${LIST.w - 12}v26h${-(LIST.w - 12)}z"/>` + mono(LIST.x + 10, y, '▸', 20, 'start', 'fp-ink fp-code');
  }
  // a table row: T, L and R columns; `typed` reveals the value from the left
  function rowSvg(row, t, l, r, typedL = 1, typedR = 1, strike = '') {
    const y = TAB.y + 64 + row * 0;
    const cut = (s, k) => s.slice(0, Math.round(s.length * clamp(k, 0, 1)));
    let out = mono(TAB.x + 16, y, t) + mono(TAB.x + 120, y, cut(l, typedL), 20, 'end') + mono(TAB.x + 196, y, cut(r, typedR), 20, 'end');
    if (strike) out += mono(TAB.x + 132, y, strike, 18, 'start', 'fp-ink fp-code fp-ghost');
    return out;
  }
  // the close-ups are not to scale: say so
  function bigTag(top) {
    const t = LANG === 'nl' ? 'vergroot' : 'enlarged';
    const w = 104;
    const x = top ? INS.x + 8 : INS.x + INS.w - 8 - w;
    const y = top ? INS.y + 8 : INS.y + INS.h - 38;
    return `<path class="fp-panel" d="M${x} ${y}h${w}v30h${-w}z"/>` + label(x + w / 2, y + 21, t, 20, 'middle', true, 'fp-ink fp-label fp-dim');
  }
  // the inset: a top view of radius compensation
  function insetRadius(k1, wear) {
    const cx = INS.x + INS.w / 2;
    const yC = INS.y + 140; // the contour (the part edge)
    const sc = 13; // px per mm
    const r = 4.99 * sc;
    let body = `<path class="fp-solidfill" d="M${INS.x} ${yC}H${INS.x + INS.w}V${INS.y + INS.h}H${INS.x}z"/>`;
    const hatch = [];
    for (let x = INS.x - 60; x < INS.x + INS.w; x += 12) hatch.push(`M${x} ${INS.y + INS.h}L${x + 60} ${yC}`);
    body += `<path class="fp-hatch" d="${hatch.join('')}"/>`;
    const cyT = yC - r * k1;
    const toolX = cx - 70 + 50 * span(k1, 0.2, 1);
    let rc = `<circle class="fp-solidfill" cx="${f1(toolX)}" cy="${f1(cyT)}" r="${f1(r)}"/>`;
    // the programmed contour, and the centre path a radius above it
    rc += `<path class="fp-mark" d="M${INS.x + 10} ${yC}H${INS.x + INS.w - 10}"/>`;
    if (k1 > 0.05) rc += `<path class="fp-mark" stroke-dasharray="6 5" d="M${INS.x + 10} ${f1(cyT)}H${INS.x + INS.w - 10}"/>`;
    rc += `<path class="fp-mark" d="M${f1(toolX)} ${f1(cyT)}V${yC}"/>${mark(arrowHead([toolX, cyT], [toolX, yC], 9, true))}` + label(toolX + 8, (cyT + yC) / 2 + 8, 'r', 22, 'start', true);
    rc += label(INS.x + 16, INS.y + 34, 'G41', 20, 'start', true, 'fp-ink fp-code');
    let w = '';
    if (wear > 0) {
      const dy = 7 * wear; // drawn far larger than true
      // a negative wear on a bore: the centre path moves toward the wall, which cuts the bore larger
      w = `<path class="fp-mark" stroke-dasharray="3 4" d="M${INS.x + 10} ${f1(cyT + dy)}H${INS.x + INS.w - 10}"/>` + mark(arrowHead([INS.x + INS.w - 30, cyT], [INS.x + INS.w - 30, cyT + dy + 2], 7, true))
        + label(INS.x + INS.w - 16, INS.y + 34, `${LANG === 'nl' ? '−0,005' : '−0.005'}`, 20, 'end', true, 'fp-ink fp-code');
    }
    return { body: body + bigTag(), rc, w };
  }
  // the inset: a section through the plate at the hole
  const SEC = { top: INS.y + 54, sc: 4.6 };
  function insetSection(tipZ, target, crashK) {
    const cx = INS.x + INS.w / 2;
    const yz = (z) => SEC.top - z * SEC.sc; // program z (0 = plate top) → inset y
    const pb = yz(-20);
    const vb = yz(-24);
    let body = `<path class="fp-solidfill" d="M${INS.x} ${f1(SEC.top)}H${INS.x + INS.w}V${f1(pb)}H${INS.x}z"/>`;
    body += `<path class="fp-air" d="M${INS.x} ${f1(pb)}H${INS.x + INS.w}V${f1(vb)}H${INS.x}z"/>`;
    body += `<path class="fp-mark" d="M${INS.x + 70} ${f1(pb)}h-30v${f1(vb - pb)}h30zM${INS.x + INS.w - 70} ${f1(pb)}h30v${f1(vb - pb)}h-30z"/>`;
    body += `<path class="fp-solidfill" d="M${INS.x} ${f1(vb)}H${INS.x + INS.w}V${INS.y + INS.h}H${INS.x}z"/>`;
    const hatch = [];
    for (let x = INS.x - 80; x < INS.x + INS.w; x += 12) hatch.push(`M${x} ${f1(pb)}L${x + (pb - SEC.top)} ${f1(SEC.top)}M${x} ${INS.y + INS.h}L${x + (INS.y + INS.h - vb)} ${f1(vb)}`);
    body += `<clipPath id="fp-hclip"><path d="M${INS.x} ${f1(SEC.top)}H${INS.x + INS.w}V${f1(pb)}H${INS.x}zM${INS.x} ${f1(vb)}H${INS.x + INS.w}V${INS.y + INS.h}H${INS.x}z"/></clipPath><path class="fp-hatch" clip-path="url(#fp-hclip)" d="${hatch.join('')}"/>`;
    const r = 4 * SEC.sc;
    // the hole drilled so far
    const depth = Math.max(0, -tipZ);
    if (depth > 0) body += `<path class="fp-air" d="M${f1(cx - r)} ${f1(SEC.top)}V${f1(yz(-Math.min(depth, 20)))}H${f1(cx + r)}V${f1(SEC.top)}z"/>`;
    // the drill: body above, point at the tip
    const ty = yz(tipZ);
    const pt = 2.4 * SEC.sc;
    let s = `<path class="fp-solidfill" d="M${f1(cx - r)} ${INS.y}V${f1(ty - pt)}L${f1(cx)} ${f1(ty)}L${f1(cx + r)} ${f1(ty - pt)}V${INS.y}z"/>`;
    s += `<path class="fp-hatch" d="M${f1(cx - r)} ${f1(ty - pt - 30)}L${f1(cx + r)} ${f1(ty - pt - 46)}M${f1(cx - r)} ${f1(ty - pt - 70)}L${f1(cx + r)} ${f1(ty - pt - 86)}"/>`;
    // the depth the program meant, and how far past it the drill went
    const gy = yz(target);
    s += `<path class="fp-mark" stroke-dasharray="6 5" d="M${INS.x + 12} ${f1(gy)}H${INS.x + INS.w - 12}"/>`;
    if (tipZ < target - 0.5) {
      const xA = cx + r + 26;
      s += mark(`M${f1(xA)} ${f1(gy)}V${f1(ty)}`) + mark(arrowHead([xA, gy], [xA, ty], 7, true)) + label(xA + 8, (gy + ty) / 2 + 7, '9', 22, 'start', true);
    }
    let c = '';
    if (crashK > 0) {
      const rr = 8 + 26 * crashK;
      c = `<circle class="fp-touch" cx="${f1(cx)}" cy="${f1(vb)}" r="${f1(rr)}" style="opacity:${f1(1 - crashK * 0.6)}"/><circle class="fp-touch" cx="${f1(cx)}" cy="${f1(vb)}" r="${f1(rr * 0.55)}"/>`;
    }
    return { body: body + bigTag(true), s, c };
  }
  // the CAM screen: top view with the toolpath, the post, a side-view simulation
  const CV = { x: CAMS.x + 24, y: CAMS.y + 52, sc: 1.55 }; // top view: program mm → px
  const cvP = (x, y) => [CV.x + (x + 20) * CV.sc, CV.y + (75 - y) * CV.sc];
  const SIDE = { x: CAMS.x + 194, y: CAMS.y + 168, w: 170, h: 100 };
  function camSvg(si, u, B) {
    const kPath = span(u, 0.02, B[1] * 0.95);
    const kPost = span(u, B[1], B[2] - 0.02);
    const kSim = clamp((u - B[2]) / (B[3] - B[2] - 0.02), 0, 1);
    // the part: the plate's outline and the finished slot
    const pl = [cvP(-20, -25), cvP(40, -25), cvP(40, 75), cvP(-20, 75)];
    let body = `<path class="fp-solidfill" d="${pathOf(pl, true)}"/>`;
    body += `<path class="fp-mark" d="${pathOf(slotOutline(FULL.pts, C.TOOLS.mill.r).map(([x, y]) => cvP(x, y)), true)}"/>`;
    // the toolpath: rapids dashed, feeds solid, drawn as far as kPath
    const pts = [];
    C.blocks.forEach((b) => { if (b.kind !== 'none') for (let s = 0; s <= 12; s++) pts.push({ p: posAt(b, s / 12), rapid: b.kind === 'rapid' }); });
    const nShow = Math.floor(pts.length * kPath);
    let feed = [];
    let rapid = [];
    for (let i = 1; i < nShow; i++) {
      const seg = `M${f1(cvP(pts[i - 1].p[0], pts[i - 1].p[1])[0])} ${f1(cvP(pts[i - 1].p[0], pts[i - 1].p[1])[1])}L${f1(cvP(pts[i].p[0], pts[i].p[1])[0])} ${f1(cvP(pts[i].p[0], pts[i].p[1])[1])}`;
      (pts[i].rapid ? rapid : feed).push(seg);
    }
    let path = `<path class="fp-path" d="${feed.join('')}"/><path class="fp-path" stroke-dasharray="4 5" style="stroke-width:1.4" d="${rapid.join('')}"/>`;
    // the post: a box that turns the path into this machine's code
    let post = '';
    if (kPost > 0) {
      const px = CAMS.x + 194;
      const py = CAMS.y + 52;
      post += `<path class="fp-mark" d="M${px} ${py}h${SIDE.w}v28h${-SIDE.w}z"/>` + label(px + SIDE.w / 2, py + 20, 'POST', 18, 'middle', true, 'fp-ink fp-code');
      post += mark(`M${px - 14} ${py + 14}h12`) + mark(arrowHead([px - 14, py + 14], [px - 2, py + 14], 7, true));
      const lines = ['N10 G90 G54', 'N20 T3 M06', 'N30 S3200 M03', 'N40 G00 G43 H3'];
      const n = Math.floor(kPost * (lines.length + 0.99));
      lines.slice(0, n).forEach((t, i) => { post += mono(px + 4, py + 54 + i * 22, t, 17); });
    }
    // the simulation: side view of the fixed jaw and the tool on a too-low rapid
    let sim = '';
    if (kSim > 0) {
      const { x, y, w, h } = SIDE;
      const zY = (z) => y + h - 16 - z * 2.6; // z over the plate top → px
      sim += `<path class="fp-mark" d="M${x} ${f1(zY(0))}h${w}"/><path class="fp-solidfill" d="M${x + 54} ${f1(zY(0))}v${f1(zY(8) - zY(0))}h18v${f1(zY(0) - zY(8))}z"/>`;
      const hitX = x + 54 - 6;
      const tx = lerp(x + 6, hitX, span(kSim, 0, 0.55));
      const tz = 2;
      sim += `<path class="fp-mark" d="M${x + 6} ${f1(zY(tz))}H${f1(tx)}"/>`;
      sim += `<path class="fp-solidfill" d="M${f1(tx - 6)} ${f1(zY(tz))}h12v-22h10v-22h-32v22h10z"/>`;
      if (kSim > 0.55) {
        const kc = span(kSim, 0.55, 0.75);
        sim += `<circle class="fp-touch" cx="${f1(hitX + 6)}" cy="${f1(zY(5))}" r="${f1(6 + 14 * kc)}"/>`;
        const kr = span(kSim, 0.75, 1);
        if (kr > 0) sim += `<path class="fp-path" stroke-dasharray="5 4" d="M${x + 6} ${f1(zY(tz))}L${f1(lerp(x + 6, x + 40, kr))} ${f1(zY(tz))}L${f1(lerp(x + 40, x + 48, kr))} ${f1(lerp(zY(tz), zY(18), kr))}L${f1(lerp(x + 48, x + 84, kr))} ${f1(zY(18))}"/>`;
      }
    }
    return { body, path, post, sim };
  }

  // ------------------------------------------------------------ camera
  function camera(si, u) {
    const c = CAM[si];
    const a = si === 6 ? C.B[6][3] : c.a ?? 0;
    const b = si === 6 ? C.B[6][3] + 0.14 : c.b ?? 1;
    const k = span(u, a, b);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const w = lerp(c.from[2], c.to[2], k);
    camW = w;
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ render
  let shown = -1;
  const ALL = ['sbk', 'slot', 'hole', 'g54', 'absDim', 'incDim', 'gauge', 'touch', 'lenDim', 'list', 'tab', 'counter', 'inset', 'cam', 'stamp', 'lamp'];
  const VIS = [
    ['touch', 'g54'],
    ['lenDim', 'tab', 'list'],
    ['slot', 'gauge', 'counter', 'list', 'stamp'],
    ['slot', 'g54', 'absDim', 'incDim', 'list'],
    ['slot', 'g54', 'lenDim', 'tab', 'inset'],
    ['slot', 'hole', 'tab', 'inset'],
    ['slot', 'cam', 'lamp', 'sbk'],
  ];

  function render(si, u) {
    if (si !== shown) {
      shown = si;
      for (const k of ALL) show(E[k], VIS[si].includes(k));
      for (const k of ALL) E[k].style.opacity = '';
      for (const k of ['insR', 'insW', 'insS', 'insC', 'insBody']) set(E[k], '');
    }
    camera(si, u);
    const B = C.B[si];
    const clock = u * C.dur[si];
    let tool = 'mill';
    let tip = TOP + 40;
    let phase = 0;

    if (si === 0) {
      // the probe touches the fixed jaw (x), its front end (y) and the plate (z); then G54
      tool = 'probe';
      const b1 = B[1];
      const b2 = B[2];
      const q = (i) => b1 + ((b2 - b1) * i) / 12;
      const frames = [
        [0, -10, 25, 210], [b1 * 0.95, -18, 0, 140],
        [q(1), -18, 0, 124], [q(2), -27, 0, 124], [q(2.6), -18, 0, 124], [q(3.4), -18, 0, 140],
        [q(4.2), -37, 66, 140], [q(5), -37, 66, 115], [q(6), -37, 55, 115], [q(6.6), -37, 64, 115], [q(7.4), -37, 64, 140],
        [q(8.4), -10, 25, 140], [q(10), -10, 25, 123], [q(11), -10, 25, 132], [B[2] + 0.2, -10, 25, 150], [1, -10, 25, 165],
      ];
      const [x, y, zc] = kf(frames, u);
      tip = place([x, y, zc - 3], 'probe');
      // a ring where the ball touches
      const hits = [[q(2), [-27, 0, 124]], [q(6), [-37, 55, 115]], [q(10), [-10, 25, 123]]];
      let ring = '';
      for (const [uh, p] of hits) {
        const kk = (u - uh) / 0.06;
        if (kk < 0 || kk > 1) continue;
        const [sx, sy] = at([p[0] - x, p[1] - y, p[2]]);
        ring += `<circle class="fp-touch" cx="${f1(sx)}" cy="${f1(sy)}" r="${f1((4 + 10 * kk) * camW / W * 2)}" style="opacity:${f1(1 - kk)}"/>`;
      }
      set(E.touch, ring);
      set(E.g54, g54Svg());
      fade(E.g54, span(u, b2, b2 + 0.06));
    } else if (si === 1) {
      // the drill, T5, touches the tool setter; its length goes into the table
      tool = 'drill';
      const b1 = B[1];
      const b2 = B[2];
      const [sx, sy, sz] = C.SETTER;
      const touch = b1 + (b2 - b1) * 0.55;
      const frames = [[0, -10, 25, TOP + 60], [b1 * 0.9, sx, sy, sz + 40], [b1 + (b2 - b1) * 0.3, sx, sy, sz + 6], [touch, sx, sy, sz], [b2 - 0.02, sx, sy, sz], [1, sx, sy, sz + 30]];
      const [x, y, z] = kf(frames, u);
      tip = place([x, y, z], 'drill');
      set(E.lenDim, lenDimSvg('drill', tip));
      set(E.rowT3, rowSvg(0, '3', '—', '—'));
      set(E.rowT5, '');
      const typed = span(u, touch, touch + 0.08);
      set(E.rowT3, '');
      set(E.rowT5, rowSvg(0, '5', num(121.43, 2), '—', typed, typed));
      fade(E.list, span(u, b2, b2 + 0.06));
      fade(E.tab, 1 - span(u, b2, b2 + 0.06));
      set(E.cur, '');
    } else if (si === 2) {
      // the first part: the depth gauge on the slot, the run counter, the stamp
      tool = 'mill';
      tip = place([25, -55, TOP + 70], 'mill');
      set(E.slot, slotSvg(FULL));
      set(E.g54, g54Svg());
      fade(E.g54, 1);
      const lift = 50 * (1 - span(u, 0.02, B[1] * 0.6));
      const needle = 0.55 * span(u, B[1] * 0.6, B[1] * 0.95);
      set(E.gauge, gaugeSvg(lift, needle));
      fade(E.gauge, span(u, 0, 0.08));
      const k1 = span(u, B[1], B[1] + 0.05);
      set(E.counter, `<g style="opacity:${f1(k1)}"><path class="fp-panel" d="M${W - 194} ${H - 62}h180v48h-180z"/>${mono(W - 28, H - 28, LANG === 'nl' ? 'stuk 1 / 200' : 'part 1 / 200', 22, 'end')}</g>`);
      fade(E.list, 1);
      set(E.cur, '');
      fade(E.stamp, span(u, B[2], B[2] + 0.06));
    } else if (si === 3) {
      // the program runs, block by block, in step with the captions
      tool = 'mill';
      set(E.g54, g54Svg());
      fade(E.g54, 1);
      fade(E.list, 1);
      const win = (a, b) => clamp((u - a) / (b - a), 0, 1);
      const b4 = B[4];
      const plan = [
        [0, B[0], B[1]], [1, B[1], lerp(B[1], B[2], 1 / 3)], [2, lerp(B[1], B[2], 1 / 3), lerp(B[1], B[2], 2 / 3)], [3, lerp(B[1], B[2], 2 / 3), B[2]],
        [4, B[2], lerp(B[2], B[3], 0.7)],
        [5, b4, lerp(b4, 1, 0.18)], [6, lerp(b4, 1, 0.18), lerp(b4, 1, 0.62)], [7, lerp(b4, 1, 0.62), lerp(b4, 1, 0.82)], [8, lerp(b4, 1, 0.82), lerp(b4, 1, 0.92)], [9, lerp(b4, 1, 0.92), 1],
      ];
      let cur = 0;
      let v = 0;
      for (const [i, a, b] of plan) if (u >= a) { cur = i; v = win(a, b); }
      const bl = C.blocks[cur];
      const p = bl.kind === 'none' ? bl.from : posAt(bl, v);
      tip = place(Wp(p[0], p[1], p[2]), 'mill');
      const spinning = cur >= 2 && cur < 9;
      phase = spinning ? clock * 9 : 0;
      set(E.cur, curSvg(cur));
      set(E.slot, slotSvg(cutOf(cur, v)));
      // G90: Y-10 from G54; later G90 Y40 against G91 Y50
      const kAbs = span(u, B[2], B[2] + 0.04);
      const kInc = span(u, B[3], B[3] + 0.04);
      const fadeOut = 1 - span(u, b4, b4 + 0.05);
      set(E.absDim, kInc < 0.5 ? dimY(-18, 0, -10, 'Y-10', false, 'start') : dimY(-18, 0, 40, 'Y40', false, 'end'));
      fade(E.absDim, kAbs * fadeOut);
      set(E.incDim, dimY(14, -10, 40, 'Y50', true));
      fade(E.incDim, kInc * fadeOut);
    } else if (si === 4) {
      // the offsets: the length beside the tool, then radius and wear in the inset
      tool = 'mill';
      tip = place(Wp(0, 40, 12), 'mill');
      set(E.slot, slotSvg(FULL));
      set(E.g54, g54Svg());
      fade(E.g54, 1);
      set(E.lenDim, lenDimSvg('mill', tip));
      set(E.rowT3, rowSvg(0, '3', '—', num(4.99, 2), 1, span(u, B[1] + 0.05, B[1] + 0.13)));
      set(E.rowT5, '');
      const k1 = span(u, B[1], B[1] + 0.2);
      const wear = span(u, B[2] + 0.03, B[2] + 0.15);
      fade(E.inset, span(u, B[1] - 0.04, B[1] + 0.02));
      const I = insetRadius(k1, wear);
      set(E.insBody, I.body);
      set(E.insR, I.rc);
      set(E.insW, I.w);
      phase = clock * 9;
    } else if (si === 5) {
      // the crash: 112,43 typed for 121,43; the drill goes 9 mm too deep
      tool = 'drill';
      const target = -14;
      const typed = span(u, 0.04, B[1] * 0.8);
      set(E.rowT3, '');
      set(E.rowT5, rowSvg(0, '5', num(112.43, 2), '', typed, 1, typed > 0.99 ? `≠ ${num(121.43, 2)}` : ''));
      const zt = kf([[0, 25], [B[1], 2], [B[2] - 0.02, target - 9], [1, target - 9]], u);
      const zp = zt[0];
      set(E.slot, slotSvg(FULL));
      tip = place(Wp(C.HOLE[0], C.HOLE[1], zp), 'drill');
      const hw = Wp(C.HOLE[0], C.HOLE[1], 0);
      const F = G.frameOf(hw, Z, X, Y);
      set(E.hole, zp < 0 ? `<path class="fp-cut" d="${G.circleOf(F, 0, 4.4, P, 28)}"/>${lineSvg(G.circleOf(F, 0, 4.4, P, 28), { tone: 'mid' })}` : '');
      phase = clock * 7;
      fade(E.inset, span(u, B[1] - 0.06, B[1]));
      const crashK = clamp((u - (B[2] + 0.02)) / 0.12, 0, 1);
      const I = insetSection(zp, target, crashK);
      set(E.insBody, I.body);
      set(E.insS, I.s);
      set(E.insC, I.c);
    } else if (si === 6) {
      // CAM on the screen; then the prove-out on the machine
      const B3 = B[3];
      const I = camSvg(si, u, B);
      set(E.camBody, I.body);
      set(E.camPath, I.path);
      set(E.camPost, I.post);
      set(E.camSim, I.sim);
      fade(E.cam, 1 - span(u, B3, B3 + 0.08));
      fade(E.sbk, span(u, B3 + 0.06, B3 + 0.12));
      const v = span(u, B3 + 0.05, 1);
      const n70 = C.blocks[6];
      let cut;
      let p;
      if (u < B3 + 0.05) { p = [START_X, START_Y, 50]; cut = null; } else { p = posAt(n70, v); cut = cutOf(6, v); }
      set(E.slot, slotSvg(cut));
      tip = place(Wp(p[0], p[1], p[2]), 'mill');
      phase = u > B3 ? clock * 3 : 0;
      const fy = -56;
      const lampOn = u > B3;
      const Fl = G.frameOf([-232, fy + 0.2, 192], Y, X, Z);
      set(E.lamp, lampOn ? `<path class="fp-lamp" d="${G.circleOf(Fl, 0, 4, P, 18)}"/>` : '');
    }

    set(E.tool, toolSvg(tool, tip, phase));
  }
  const START_X = C.START[0];
  const START_Y = C.START[1];

  return { render };
})();
