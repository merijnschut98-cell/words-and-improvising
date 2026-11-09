// The stage of the film "Opspannen: 3-2-1 en nulpuntsystemen / Workholding": a
// pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope, the lathe module as G) and a preamble from
// build.mjs that defines P (projection), C (world constants), CAM (camera key
// frames per scene), W and H. Moves are placed per caption beat (beatStarts),
// so the video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global G, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, extrude, cylinder, slabOf, onTop, cameraOf, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const LANG = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'nl';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const fmt = (pts, close) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') + (close ? 'Z' : '') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const dec = (v, d) => { const t = String(Number(v.toFixed(d))); return LANG === 'nl' ? t.replace('.', ',') : t; };
  const tr = (nl, en) => (LANG === 'nl' ? nl : en);
  const txt = (x, y, t, size = 19, anchor = 'start', cls = 'wh-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${f1(size)}" text-anchor="${anchor}">${t}</text>`;
  const S = (paths, style = {}) => solidSvg(paths, { tone: 'mid', ...style });
  const ph = (p, a, b) => span(p, a, b);

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

  // ------------------------------------------------------------ camera: eased key frames
  let camW = 300;
  function camera(si, u) {
    const keys = CAM[si];
    let c = keys[0][1];
    for (let i = 0; i + 1 < keys.length; i++) {
      const [u0, c0] = keys[i];
      const [u1, c1] = keys[i + 1];
      if (u >= u0) { const t = span(u, u0, u1); c = [lerp(c0[0], c1[0], t), lerp(c0[1], c1[1], t), lerp(c0[2], c1[2], t)]; }
    }
    camW = c[2];
    const s = W / c[2];
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-c[0])} ${f1(-c[1])})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }
  // a font size in world units that shows as `px` stage units
  const wfs = (px) => (px * camW) / W;

  // ------------------------------------------------------------ the housing, drawn from its pose
  // Flange and body boxes and the bore, moved by a small twist about pose.o:
  // p' = p + v + w × (p − o). The bore is an ellipse (a along x, b along y)
  // on the body top. Returns the flange and the body separately (the vice's
  // back lip sits between them in depth).
  const CAMV = cameraOf(P);
  const VIEW = [CAMV.cosA * CAMV.cosE, CAMV.sinA * CAMV.cosE, CAMV.sinE];
  const LIGHT = [-CAMV.sinA, CAMV.cosA];
  function partSvg(pose) {
    const { o, v, w } = pose;
    const mv = (p) => { const r = [p[0] - o[0], p[1] - o[1], p[2] - o[2]]; return [p[0] + v[0] + w[1] * r[2] - w[2] * r[1], p[1] + v[1] + w[2] * r[0] - w[0] * r[2], p[2] + v[2] + w[0] * r[1] - w[1] * r[0]]; };
    const turn = (n) => [n[0] + w[1] * n[2] - w[2] * n[1], n[1] + w[2] * n[0] - w[0] * n[2], n[2] + w[0] * n[1] - w[1] * n[0]];
    const hull = (pts) => {
      const s = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cr = (q, a, b) => (a[0] - q[0]) * (b[1] - q[1]) - (a[1] - q[1]) * (b[0] - q[0]);
      const lo = [];
      const hi = [];
      for (const p of s) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
      for (const p of s.slice().reverse()) { while (hi.length > 1 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
      return lo.slice(0, -1).concat(hi.slice(0, -1));
    };
    function boxOf({ x, y, w: bw, d }, z0, z1, top) {
      const c = [];
      for (let i = 0; i < 8; i++) c.push(mv([i & 1 ? x + bw : x, i & 2 ? y + d : y, i & 4 ? z1 : z0]));
      const sc = c.map(at);
      const faces = [[0, 0, [0, 2, 6, 4]], [0, 1, [1, 3, 7, 5]], [1, 0, [0, 1, 5, 4]], [1, 1, [2, 3, 7, 6]], [2, 0, [0, 1, 3, 2]], [2, 1, [4, 5, 7, 6]]].map(([ax, side, idx]) => {
        const n0 = [0, 0, 0];
        n0[ax] = side ? 1 : -1;
        const n = turn(n0);
        return { ax, side, idx, n, show: n[0] * VIEW[0] + n[1] * VIEW[1] + n[2] * VIEW[2] > 1e-6 };
      });
      const face = (ax, side) => faces[ax * 2 + side];
      const shades = [[], [], [], []];
      let topD = '';
      for (const f of faces) {
        if (!f.show) continue;
        const d = fmt(f.idx.map((i) => sc[i]), true);
        if (f.ax === 2) { topD += d; continue; }
        const lit = (f.n[0] * LIGHT[0] + f.n[1] * LIGHT[1] + 1) / 2;
        shades[Math.min(3, Math.max(0, Math.floor(lit * 4)))].push(d);
      }
      const outline = [];
      const crease = [];
      for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) for (let sa = 0; sa < 2; sa++) for (let sb = 0; sb < 2; sb++) {
        const fa = face(a, sa);
        const fb = face(b, sb);
        const ends = [];
        for (let i = 0; i < 8; i++) if (((i >> a) & 1) === sa && ((i >> b) & 1) === sb) ends.push(i);
        const d = fmt(ends.map((i) => sc[i]));
        if (fa.show !== fb.show) outline.push(d);
        else if (fa.show && (a === 2 || b === 2)) crease.push(d);
      }
      return '<g class="iso-solid"><path class="iso-fill" d="' + fmt(hull(sc), true) + '"/>'
        + shades.map((list, i) => (list.length ? '<path class="iso-shade" data-shade="' + i + '" d="' + list.join('') + '"/>' : '')).join('')
        + '<path class="iso-top" d="' + topD + '"/><path class="iso-line iso-crease" data-tone="lo" d="' + crease.join('') + '"/>'
        + top + '<path class="iso-line iso-edge" data-tone="hi" d="' + outline.join('') + '"/></g>';
    }
    const ring = (cx, cy, rx, ry, z, steps) => fmt(Array.from({ length: steps }, (_, i) => { const t = (i / steps) * TAU; return at(mv([cx + rx * Math.cos(t), cy + ry * Math.sin(t), z])); }), true);
    const F = pose.flange;
    const B = pose.body;
    const holes = pose.holes.map(([x, y]) => ring(x, y, 2.4, 2.4, pose.ft, 14)).join('');
    const gw = 2;
    const lid = fmt([[B.x + gw, B.y + gw], [B.x + B.w - gw, B.y + gw], [B.x + B.w - gw, B.y + B.d - gw], [B.x + gw, B.y + B.d - gw]].map(([x, y]) => at(mv([x, y, pose.bt]))), true);
    const [bx, by] = pose.boreAt;
    const boreD = ring(bx, by, pose.bore[0], pose.bore[1], pose.bt, 56);
    const bodyTop = '<path class="iso-line" data-tone="faint" d="' + lid + '"/>'
      + '<path class="iso-line" data-tone="faint" d="' + ring(bx, by, pose.bore[0] + 1.6, pose.bore[1] + 1.6, pose.bt, 56) + '"/>'
      + '<path class="wh-bore" d="' + boreD + '"/><path class="iso-line" data-tone="hi" d="' + boreD + '"/>';
    return {
      flange: boxOf(F, pose.pb, pose.ft, '<path class="iso-line" data-tone="lo" d="' + holes + '"/>'),
      body: boxOf(B, pose.ft, pose.bt, bodyTop),
      boreRing: boreD,
      mv,
    };
  }
  const POSE = { o: C.O, v: [0, 0, 0], w: [0, 0, 0], flange: C.FL, body: C.BODY, pb: C.PB, ft: C.FT, bt: C.BT, holes: C.HOLES, bore: [C.BORE_R, C.BORE_R], boreAt: [0, 0] };
  const VFL = { ...C.FL, x: C.FL.x + C.VX };
  const VHOLES = C.HOLES.map(([x, y]) => [x + C.VX, y]);

  // ------------------------------------------------------------ small drawing helpers
  // an arrow along screen points, with a head at the end (and the start if both)
  function arrowSvg(pts, cls = 'wh-arrow', both = false, on = false, size = 5) {
    if (pts.length < 2) return '';
    const head = (a, b) => {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      const ux = dx / l;
      const uy = dy / l;
      const s = size;
      return `<path class="${cls === 'wh-force' ? 'wh-forcehead' : 'wh-head'}"${on ? ' data-on=""' : ''} d="${fmt([[b[0] + ux * s * 0.6, b[1] + uy * s * 0.6], [b[0] - ux * s + uy * s * 0.6, b[1] - uy * s - ux * s * 0.6], [b[0] - ux * s - uy * s * 0.6, b[1] - uy * s + ux * s * 0.6]], true)}"/>`;
    };
    return `<path class="${cls}"${on ? ' data-on=""' : ''} d="${fmt(pts)}"/>` + head(pts[pts.length - 2], pts[pts.length - 1]) + (both ? head(pts[1], pts[0]) : '');
  }
  // a circle in the plane perpendicular to world axis ax, around c
  const arcPts = (c, ax, r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => {
    const t = a0 + ((a1 - a0) * i) / n;
    const u = Math.cos(t) * r;
    const v = Math.sin(t) * r;
    const p = ax === 0 ? [c[0], c[1] + u, c[2] + v] : ax === 1 ? [c[0] + u, c[1], c[2] + v] : [c[0] + u, c[1] + v, c[2]];
    return at(p);
  });

  // ------------------------------------------------------------ the degrees-of-freedom gizmo
  const G0 = [104, -20, 176];
  function dofSvg(lit, alpha) {
    if (alpha <= 0.01) return '';
    const L = 26;
    let out = '';
    const dirs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    dirs.forEach((d, i) => {
      if (alpha * lit[i].a <= 0.01) return;
      const p0 = at([G0[0] - d[0] * L, G0[1] - d[1] * L, G0[2] - d[2] * L]);
      const p1 = at([G0[0] + d[0] * L, G0[1] + d[1] * L, G0[2] + d[2] * L]);
      out += `<g style="opacity:${(alpha * lit[i].a).toFixed(2)}">${arrowSvg([p0, p1], 'wh-arrow', true, lit[i].on, 4)}</g>`;
    });
    dirs.forEach((d, i) => {
      const l = lit[3 + i];
      if (alpha * l.a <= 0.01) return;
      const c = [G0[0] + d[0] * (L + 8), G0[1] + d[1] * (L + 8), G0[2] + d[2] * (L + 8)];
      out += `<g style="opacity:${(alpha * l.a).toFixed(2)}">${arrowSvg(arcPts(c, i, 9, 0.3, 0.3 + TAU * 0.78), 'wh-arrow', false, l.on, 4)}</g>`;
    });
    out += dotsSvg([at(G0)], { size: 0.6, tone: 'hi' });
    return out;
  }

  // ------------------------------------------------------------ the spindle with an end mill or a boring bar
  function spindleSvg(x, y, zTip, kind, zCut) {
    const z0 = Math.max(zTip, zCut);
    const r = kind === 'bore' ? 7 : 8;
    let out = '';
    const toolLen = 44;
    if (zTip + toolLen > z0) out += S(cylinder(x, y, r, z0, zTip + toolLen - z0, P, 28), { tone: 'hi', crease: 'lo' });
    if (kind === 'mill' && zTip + toolLen > z0 + 6) {
      // flutes: two helix lines on the visible side
      const lines = [0, Math.PI].map((ph0) => fmt(Array.from({ length: 9 }, (_, i) => { const t = i / 8; const a = ph0 + t * 2.2 + 0.9; return at([x + r * Math.cos(a), y + r * Math.sin(a), z0 + 3 + t * (zTip + toolLen - z0 - 8)]); }))).join('');
      out += lineSvg(lines, { tone: 'lo' });
    }
    if (kind === 'bore' && zTip >= zCut - 1) out += S(slabOf({ x: x + r - 1, y: y - 2, w: 9, d: 4, r: 0.5 }, zTip, 4, P, 2), { tone: 'hi' });
    out += S(cylinder(x, y, 15, zTip + toolLen, 26, P, 36), { crease: 'lo', inner: lineSvg(onTop(Array.from({ length: 36 }, (_, i) => [x + 15 * Math.cos(i / 36 * TAU), y + 15 * Math.sin(i / 36 * TAU)]), zTip + toolLen + 8, P, true), { tone: 'faint' }) });
    out += S(cylinder(x, y, 24, zTip + toolLen + 26, 40, P, 40), { tone: 'lo', crease: 'lo' });
    return out;
  }

  // ------------------------------------------------------------ the vice and its housing
  // s: wall squeeze (world mm, exaggerated); g: the moving jaw's offset;
  // bore: [a, b]; lift: the housing above its parallels
  function renderVice(st) {
    const sq = st.s || 0;
    const pose = {
      o: [C.VX, 0, C.VPB], v: [0, 0, st.lift || 0], w: [0, 0, 0], flange: VFL,
      body: { x: C.VX - 38, y: -35, w: 76, d: 70 - sq, r: 1.2 }, pb: C.VPB, ft: C.VFT, bt: C.VBT,
      holes: VHOLES, bore: st.bore || [C.BORE_R, C.BORE_R], boreAt: [C.VX, -sq / 2],
    };
    const part = partSvg(pose);
    set(E.vFlange, st.part ? part.flange : '');
    set(E.vBody, st.part ? part.body : '');
    const refRing = fmt(Array.from({ length: 56 }, (_, i) => { const t = (i / 56) * TAU; return at([C.VX + C.BORE_R * Math.cos(t), -sq / 2 + C.BORE_R * Math.sin(t), C.VBT]); }), true);
    set(E.boreMark, st.part && st.mark ? `<path class="fp-mark" d="${part.boreRing}"/>` + (st.ref ? `<path class="wh-ref" d="${refRing}"/>` : '') : '');
    move(E.viceFront, [0, st.g ?? 0, 0]);
    let tool = '';
    if (st.tool) tool += spindleSvg(st.tool.x, st.tool.y, st.tool.z, st.tool.kind, st.tool.kind === 'bore' ? C.VBT : -999);
    if (st.force) {
      const z = C.VBT;
      tool += arrowSvg([at([C.VX - 10 + st.force.x, -20, z + 4]), at([C.VX + 22 + st.force.x, -20, z + 4])], 'wh-force', false, false, 7);
    }
    set(E.vTool, tool);
  }

  // ------------------------------------------------------------ the fixture
  // st: pose (v, w, o), straps (0 down, 1 released and slid back), push (0 in, 1 back),
  // chip, wrench angle, air, pallet lift and alpha
  function renderFixture(st) {
    const pose = { ...POSE, v: st.v || [0, 0, 0], w: st.w || [0, 0, 0], o: st.o || C.O };
    const part = partSvg(pose);
    set(E.part, st.part === false ? '' : part.flange + part.body);
    // straps: lift 7, then slide back along their slots
    const rel = st.straps || 0;
    const lift = 7 * span(rel, 0, 0.35);
    const slide = 26 * span(rel, 0.35, 1);
    move(E.strapL, [-slide, 0, lift]);
    move(E.strapR, [slide, 0, lift]);
    // push screws (retract 9)
    const back = 9 * (st.push ?? 0);
    const sb = G.frameOf([C.PUSH.back.x, -54, C.PZ + 14], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
    const se = G.frameOf([-80, C.PUSH.end.y, C.PZ + 14], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    const tipB = 9 - back; // the screw runs from the bush (y = −54) to the flange (y = −45)
    set(E.screwsBack, S(G.disc(-14, Math.max(0.5, tipB), 3, sb, P), { tone: 'hi', crease: 'none' }) + S(G.disc(-22, -14, 5, sb, P), { crease: 'lo' })
      + S(G.disc(-14, Math.max(0.5, 10 - back), 3, se, P), { tone: 'hi', crease: 'none' }) + S(G.disc(-22, -14, 5, se, P), { crease: 'lo' }));
    // chip on rest button A1
    if (st.chip > 0.01) {
      const [x, y] = C.LOC.A1.p;
      const dx = st.chipGo || 0;
      const flake = Array.from({ length: 11 }, (_, i) => { const t = i / 10; const a = 0.4 + t * 4.2; const r = 2 + 5 * t; return at([x + 1 - dx * 0.8 + r * Math.cos(a), y + 2 + dx + r * Math.sin(a) * 0.8, C.PB + 0.2 + dx * 0.4]); });
      set(E.chip, `<g style="opacity:${st.chip.toFixed(2)}"><path class="wh-chip" d="${fmt(flake)}"/></g>`);
    } else set(E.chip, '');
    // datum faces A (bottom: its visible bottom edges), B (front), C (end)
    if (st.datum > 0.01) {
      const mv = part.mv;
      const F = C.FL;
      const face = (pts) => `<path class="wh-face" d="${fmt(pts.map((p) => at(mv(p))), true)}"/>`;
      const y1 = F.y + F.d;
      const x1 = F.x + F.w;
      const fs = wfs(19);
      const tag = (p, l) => { const [sx, sy] = at(p); const r = fs * 0.78; return `<circle class="wh-tag" cx="${f1(sx)}" cy="${f1(sy)}" r="${f2(r)}"/>` + txt(sx, sy + fs * 0.36, l, fs, 'middle', 'wh-acc'); };
      const edgeA = `<path class="wh-face" style="fill:none;stroke-width:3" d="${fmt([[F.x, y1, C.PB], [x1, y1, C.PB], [x1, F.y, C.PB]].map((p) => at(mv(p))))}"/>`;
      set(E.marks, `<g style="opacity:${st.datum.toFixed(2)}">${edgeA}${face([[F.x, y1, C.PB], [x1, y1, C.PB], [x1, y1, C.FT], [F.x, y1, C.FT]])}${face([[x1, F.y, C.PB], [x1, y1, C.PB], [x1, y1, C.FT], [x1, F.y, C.FT]])}`
        + tag([F.x - 4, y1 + 14, C.PB - 12], 'A') + tag([-10, y1 + 2, C.PB + 6], 'B') + tag([x1 + 2, -24, C.PB + 6], 'C') + '</g>');
    } else if (st.gap > 0.01) {
      // the gap the chip leaves under the flange's near corner, marked
      const F = C.FL;
      const p0 = [F.x, F.y + F.d, C.PB];
      const a0 = at(p0);
      const a1 = at(part.mv(p0));
      const len = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]);
      if (len > 1) {
        const w = 5;
        set(E.marks, `<g style="opacity:${st.gap.toFixed(2)}"><path class="wh-face" style="fill:none;stroke-width:2.4" d="M${f2(a0[0] - w - 4)} ${f2(a0[1])}H${f2(a0[0] - 4)}M${f2(a1[0] - w - 4)} ${f2(a1[1])}H${f2(a1[0] - 4)}M${f2(a0[0] - w / 2 - 4)} ${f2(a0[1])}L${f2(a1[0] - w / 2 - 4)} ${f2(a1[1])}"/></g>`);
      } else set(E.marks, '');
    } else set(E.marks, '');
    // torque wrench on the right strap's nut
    if (st.wrench !== undefined) {
      const st0 = C.STRAPS[1];
      const cx = st0.stud;
      const cy = st0.y;
      const z = C.FT + 10.4;
      const a = st.wrench;
      const ux = Math.cos(a);
      const uy = Math.sin(a);
      const rect = (s0, s1, hw) => [[cx + ux * s0 - uy * hw, cy + uy * s0 + ux * hw], [cx + ux * s1 - uy * hw, cy + uy * s1 + ux * hw], [cx + ux * s1 + uy * hw, cy + uy * s1 - ux * hw], [cx + ux * s0 + uy * hw, cy + uy * s0 - ux * hw]];
      const head = S(cylinder(cx, cy, 9, z, 5.4, P, 32), { crease: 'lo' }) + lineSvg(onTop(Array.from({ length: 6 }, (_, i) => [cx + 4 * Math.cos(i / 6 * TAU), cy + 4 * Math.sin(i / 6 * TAU)]), z + 5.4, P, true), { tone: 'lo' });
      const handle = S(extrude(rect(6, 100, 3.4), z + 1.2, 3, P), { crease: 'lo' });
      const scale = lineSvg(onTop([[cx + ux * 30 - uy * 1.4, cy + uy * 30 + ux * 1.4], [cx + ux * 62 - uy * 1.4, cy + uy * 62 + ux * 1.4]], z + 4.2, P), { tone: 'lo' });
      const ticks = lineSvg([36, 42, 48, 54, 60].map((s) => fmt([at([cx + ux * s - uy * 0.2, cy + uy * s + ux * 0.2, z + 4.2]), at([cx + ux * s - uy * 2.6, cy + uy * s + ux * 2.6, z + 4.2])])).join(''), { tone: 'lo' });
      const grip = S(extrude(rect(74, 104, 5.2), z, 5.4, P), { tone: 'hi', crease: 'lo' });
      set(E.wrench, head + handle + scale + ticks + grip + (st.click ? `<g style="opacity:${st.click.toFixed(2)}"><path class="wh-oval" d="${fmt(arcPts([cx, cy, z + 5.4], 2, 14 + 6 * st.click, 0, TAU, 32), true)}"/></g>` : ''));
    } else set(E.wrench, '');
    // the air gun aimed at A1, with streaks
    if (st.air > 0.01) {
      const tip = [-70, 44, C.PB + 8];
      const from = [-112, 96, C.PB + 34];
      const dir = G.sub3(tip, from);
      const len = Math.hypot(...dir);
      const a = G.mul3(dir, 1 / len);
      const side = [-a[1], a[0], 0];
      const sl = Math.hypot(...side) || 1;
      const s = G.mul3(side, 1 / sl);
      const up = [a[1] * s[2] - a[2] * s[1], a[2] * s[0] - a[0] * s[2], a[0] * s[1] - a[1] * s[0]];
      const F = G.frameOf(from, a, s, up);
      const gun = S(G.solidOf([[0, 4.5], [len - 22, 4.5], [len - 18, 2.6], [len, 1.6]], F, P), { tone: 'hi', crease: 'lo' })
        + S(G.disc(-26, 0, 6.5, F, P), { crease: 'lo' });
      const [x, y] = C.LOC.A1.p;
      const streaks = [[-3, 0], [0, 0], [3, 1]].map(([dx, dz], i) => `<path class="wh-air" style="stroke-dashoffset:${f1(-(st.flow || 0) * 60 - i * 3)}" d="${fmt([at([tip[0] + dx, tip[1], tip[2] + dz]), at([x + dx * 2, y - 6, C.PB + 2 + dz])])}"/>`).join('');
      set(E.air, `<g style="opacity:${st.air.toFixed(2)}">${streaks}${gun}</g>`);
    } else set(E.air, '');
    // the pallet: lifted and faded for a change; the pins under it show between it and the modules
    const dz = st.pallet || 0;
    move(E.pallet, [0, 0, dz]);
    fade(E.pallet, st.palletA ?? 1);
    if (dz > 0.3) {
      const top = C.MOD_TOP + dz;
      const lo = Math.max(C.MOD_TOP, top - 14);
      set(E.pins, `<g style="opacity:${(st.palletA ?? 1).toFixed(2)}">` + C.MODS.map(([x, y]) => S(cylinder(x, y, 5, lo, top - lo, P, 24), { tone: 'hi', crease: 'lo' })).join('') + '</g>');
    } else set(E.pins, '');
  }

  // ------------------------------------------------------------ HUD panels (stage space)
  function countSvg(free, alpha) {
    if (alpha <= 0.01) return '';
    return `<g style="opacity:${alpha.toFixed(2)}"><rect class="wh-panel" x="12" y="12" width="210" height="66" rx="8"/>`
      + txt(26, 38, tr('vrijheidsgraden', 'degrees of freedom'), 19, 'start', 'wh-mute')
      + txt(26, 66, tr('vrij: ', 'free: ') + `<tspan class="wh-acc">${free}</tspan>` + tr(' van 6', ' of 6'), 23) + '</g>';
  }
  // the out-of-round bars against the H7 tolerance (scale 0 … 0,05 mm)
  function roundSvg(rows, alpha) {
    if (alpha <= 0.01) return '';
    const pw = 340;
    const h = 44 + rows.length * 52;
    const X0 = W - 12 - pw;
    const Y0 = H - 12 - h;
    const x0 = X0 + 14;
    const x1 = X0 + pw - 14;
    const sx = (v) => x0 + ((x1 - x0) * v) / 0.05;
    const tx = sx(0.025);
    let out = `<rect class="wh-panel" x="${X0}" y="${Y0}" width="${pw}" height="${h}" rx="8"/>`;
    out += txt(x0, Y0 + 28, tr('onrond na lossen', 'out of round'), 19, 'start', 'wh-mute');
    out += txt(x1, Y0 + 28, tr('mag: ', 'allowed: ') + dec(0.025, 3) + ' mm', 19, 'end', 'wh-txt');
    rows.forEach((r, i) => {
      const y = Y0 + 42 + i * 52;
      out += `<rect class="wh-bar" data-c="lo" x="${x0}" y="${y}" width="${x1 - x0}" height="12" rx="3"/>`;
      if (r.v > 0) out += `<rect class="wh-bar" data-c="${r.c}" x="${x0}" y="${y}" width="${f1(Math.max(0, sx(r.v) - x0))}" height="12" rx="3"/>`;
      out += `<path class="wh-tol" d="M${f1(tx)} ${y - 4}V${y + 16}"/>`;
      out += txt(x0, y + 36, r.label + ': ' + dec(r.shown, 3) + ' mm', 19, 'start', r.c === 'acc' ? 'wh-txt' : 'wh-mute');
    });
    return `<g style="opacity:${alpha.toFixed(2)}">${out}</g>`;
  }
  // the setup timeline: last good part → first good part
  function setupSvg(fill90, show25, alpha) {
    if (alpha <= 0.01) return '';
    const x0 = 26;
    const x1 = 614;
    const sx = (m) => x0 + ((x1 - x0) * m) / 90;
    const segs = [20, 25, 15, 15, 15];
    const h = show25 > 0.01 ? 150 : 80;
    const Y0 = 12;
    let out = `<rect class="wh-panel" x="12" y="${Y0}" width="616" height="${h}" rx="8"/>`;
    out += txt(x0, Y0 + 26, tr('laatste goede stuk', 'last good part'), 19, 'start', 'wh-mute') + txt(x1, Y0 + 26, tr('eerste goede stuk', 'first good part'), 19, 'end', 'wh-mute');
    let m = 0;
    segs.forEach((sg, i) => {
      const a = m;
      const b = Math.min(m + sg, 90 * fill90);
      if (b > a) out += `<rect class="wh-bar" data-c="${i % 2 ? 'lo' : 'acc'}" x="${f1(sx(a))}" y="${Y0 + 36}" width="${f1(Math.max(0, sx(b) - sx(a) - 1))}" height="12" rx="2"/>`;
      m += sg;
    });
    out += txt(x0, Y0 + 70, Math.round(90 * fill90) + ' min', 20, 'start', 'wh-txt');
    if (show25 > 0.01) {
      out += `<g style="opacity:${show25.toFixed(2)}"><rect class="wh-bar" data-c="acc" x="${x0}" y="${Y0 + 82}" width="${f1(sx(25 * show25) - x0)}" height="12" rx="2"/>`
        + txt(sx(25 * show25) + 10, Y0 + 95, tr('met nulpuntpallet: ', 'with a zero-point pallet: ') + '25 min', 19, 'start', 'wh-txt')
        + txt(x0, Y0 + 130, '(90 − 25) × 8 = 520 min = ' + dec(8.67, 2) + tr(' uur per week', ' hours a week'), 20, 'start', 'wh-acc') + '</g>';
    }
    return `<g style="opacity:${alpha.toFixed(2)}">${out}</g>`;
  }

  // ------------------------------------------------------------ the scenes
  const ROT = 0.03; // a turn in the DOF demo (rad)
  const free = (n) => Array.from({ length: 6 }, () => ({ a: 1, on: false })).map((x, i) => ({ ...x, a: n[i] ?? 1 }));

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    // defaults: the vice closed and empty, the fixture clamped with its part
    let vice = { part: false, g: 0 };
    let fix = { straps: 0, push: 0 };
    let dof = null;
    let count = 0;
    let freeN = 6;
    let round = null;
    let roundA = 0;
    let setup = null;

    if (si === 0) {
      // b0: the housing goes into the open vice, the jaw closes; b1: the end mill
      // comes down and cuts across the top, the cutting force pushes; b2: on to the fixture
      const drop = b === 0 ? 1 - ph(p, 0.05, 0.45) : 0;
      const close = b === 0 ? ph(p, 0.5, 0.85) : 1;
      vice = { part: true, lift: 40 * drop, g: C.OPEN * (1 - close) };
      if (b >= 1) {
        const down = b === 1 ? ph(p, 0.0, 0.25) : 1 - ph(p, 0, 0.2);
        const run = b === 1 ? ph(p, 0.25, 0.95) : 1;
        const tx = lerp(-62, 62, run);
        vice.tool = { x: C.VX + tx, y: -20, z: C.VBT + 30 * (1 - down), kind: 'mill' };
        if (b === 1 && p > 0.25 && p < 0.95) vice.force = { x: tx };
      } else vice.tool = { x: C.VX - 62, y: -20, z: C.VBT + 60, kind: 'mill' };
    } else if (si === 1) {
      // the housing floats; it slides along x, y, z, then turns about x, y, z
      const lit = free([]);
      const v = [0, 0, 40];
      const w = [0, 0, 0];
      const o = [0, 0, C.BT];
      if (b < 2) {
        const k = Math.min(2, Math.floor(p * 3));
        const q = Math.sin((p * 3 - k) * TAU);
        const i = b * 3 + k;
        lit[i].on = true;
        if (b === 0) v[k] += 9 * q;
        else w[k] += ROT * q * (k === 2 ? 3 : 1);
      } else lit.forEach((x) => { x.on = true; });
      fix = { straps: 1, push: 1, v, w, o };
      dof = { lit, a: ph(u, 0, 0.06) };
      count = ph(u, 0, 0.06);
      freeN = 6;
    } else if (si === 2) {
      // 3 rest buttons (z, tilt x, tilt y), 2 side pins (y, spin), 1 end stop (x)
      const down = b === 0 ? ph(p, 0.1, 0.7) : 1;
      const yIn = b === 0 ? 0 : b === 1 ? ph(p, 0.1, 0.7) : 1;
      const xIn = b === 2 ? ph(p, 0.1, 0.6) : 0;
      fix = { straps: 1, push: 1, v: [-6 * (1 - xIn), -6 * (1 - yIn), 40 * (1 - down)] };
      const gone = { z: down, ty: down, tx: down, y: yIn, sp: yIn, x: xIn };
      const lit = [{ a: 1 - gone.x }, { a: 1 - gone.y }, { a: 1 - gone.z }, { a: 1 - gone.tx }, { a: 1 - gone.ty }, { a: 1 - gone.sp }].map((x) => ({ a: 0.12 + 0.88 * x.a, on: x.a > 0.5 }));
      dof = { lit, a: 1 };
      count = 1;
      freeN = 6 - (down > 0.95 ? 3 : 0) - (yIn > 0.95 ? 2 : 0) - (xIn > 0.95 ? 1 : 0);
    } else if (si === 3) {
      // datum faces, then the clamps close, then the whole fixture
      const close = b === 0 ? 0 : b === 1 ? ph(p, 0.05, 0.8) : 1;
      fix = { straps: 1 - close, push: 1 - close, datum: b === 0 ? ph(p, 0, 0.15) : b === 1 ? 1 - ph(p, 0.8, 1) : 0 };
    } else if (si === 4) {
      // clamped hard: the walls squeeze in; the bore is machined round; released, it springs oval
      let s = 0;
      let g = 0;
      let bore = [C.BORE_R, C.BORE_R];
      let tool = null;
      let mark = false;
      let ref = false;
      if (b === 0) { mark = true; } else if (b === 1) {
        mark = true;
        s = C.SQUEEZE * ph(p, 0.0, 0.3);
        g = -s;
        const cut = ph(p, 0.45, 0.85);
        bore = [C.BORE_R, lerp(C.BORE_R - s / 2, C.BORE_R, cut)];
        const down = ph(p, 0.32, 0.45) - ph(p, 0.85, 0.97);
        tool = { x: C.VX, y: -s / 2, z: C.VBT + 30 - 46 * down, kind: 'bore' };
      } else {
        const open = ph(p, 0.05, 0.4);
        s = C.SQUEEZE * (1 - open);
        g = -s + (C.OPEN) * ph(p, 0.4, 0.6);
        bore = [C.BORE_R, C.BORE_R + (C.SQUEEZE / 2) * open];
        mark = open > 0.5;
        ref = open > 0.5;
        round = [{ v: 0.04 * ph(p, 0.45, 0.8), shown: 0.04, label: tr('hard op de wand', 'hard on the wall'), c: 'acc' }];
        roundA = ph(p, 0.4, 0.55);
      }
      vice = { part: true, s, g, bore, tool, mark, ref };
    } else if (si === 5) {
      // clamps on the flange, the torque wrench clicks, the bore stays round
      if (b === 0) fix = { straps: 0, push: 0 };
      else if (b === 1) {
        const turn = ph(p, 0.1, 0.65);
        fix = { wrench: 0.55 + 0.6 * turn, click: p > 0.65 && p < 0.95 ? 1 - ph(p, 0.65, 0.95) : 0 };
      } else fix = {};
      if (b === 2) {
        round = [{ v: 0.04, shown: 0.04, label: tr('hard op de wand', 'hard on the wall'), c: 'lo' }, { v: 0.008 * ph(p, 0.1, 0.5), shown: 0.008, label: tr('op de flens', 'on the flange'), c: 'acc' }];
        roundA = ph(p, 0, 0.15);
      }
    } else if (si === 6) {
      // a chip under A1 tilts the part; an air blast; the part lies flat
      const tiltPose = (t) => ({ v: [0, 0, 0], w: [0, -t / 120, 0], o: [60, 0, C.PB] });
      if (b === 0) {
        const lift = ph(p, 0.05, 0.3) - ph(p, 0.45, 0.75);
        const tilt = 7 * ph(p, 0.6, 0.75);
        const tp = tiltPose(tilt);
        fix = { straps: ph(p, 0, 0.2), push: 1, chip: ph(p, 0.25, 0.4), v: [0, 0, 26 * lift], w: tp.w, o: tp.o, gap: ph(p, 0.7, 0.8) };
      } else if (b === 1) {
        const blow = ph(p, 0.05, 0.25) * (1 - ph(p, 0.7, 0.9));
        const go = ph(p, 0.15, 0.5);
        const lift = ph(p, 0.05, 0.25) - ph(p, 0.5, 0.8);
        const tilt = 7 * (1 - ph(p, 0.05, 0.25));
        const tp = tiltPose(tilt);
        fix = { straps: 1, push: 1, chip: 1 - go, chipGo: 30 * go, air: blow, flow: p * 20, v: [0, 0, 26 * lift], w: tp.w, o: tp.o, gap: 1 - ph(p, 0, 0.1) };
      } else fix = { straps: 1 - ph(p, 0.05, 0.5), push: 1 - ph(p, 0.05, 0.5) };
    } else if (si === 7) {
      // the setup timeline; the pallet lifts out and the next one drops in and locks
      if (b === 0) {
        const up = ph(p, 0.45, 0.95);
        fix = { pallet: 120 * up, palletA: 1 - ph(p, 0.75, 0.95) };
        setup = { fill: ph(p, 0.05, 0.45), s25: 0, a: ph(p, 0, 0.08) };
      } else if (b === 1) {
        const down = ph(p, 0.0, 0.7);
        fix = { pallet: 120 * (1 - down), palletA: ph(p, 0, 0.2) };
        setup = { fill: 1, s25: 0, a: 1 - ph(p, 0, 0.1) * 0.6 };
      } else {
        setup = { fill: 1, s25: ph(p, 0.05, 0.5), a: 1 };
      }
    }

    renderVice(vice);
    renderFixture(fix);
    set(E.dof, dof ? dofSvg(dof.lit, dof.a) : '');
    set(E.count, count ? countSvg(freeN, count) : '');
    set(E.round, round ? roundSvg(round, roundA) : '');
    set(E.setup, setup ? setupSvg(setup.fill, setup.s25, setup.a) : '');
  }

  return { render };
})();
