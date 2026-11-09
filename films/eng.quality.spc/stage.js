// The stage of the film "Een regelkaart slaat alarm / A control chart raises
// the alarm": a pure function of (scene, u). Inlined into the page after the
// anatomy kit (iso-kit functions in scope, the lathe module as G) and a
// preamble from build.mjs that defines P (projection), C (world constants and
// the model's data), CAM (one camera move per scene), W and H. Moves are placed
// per caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
/* global G, P, C, CAM, W, H, iso, translateAlong, span, beatStarts, ring */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const KS = G.scaleOf(P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'sp-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'sp-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'sp-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'sp-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const EX = tr('voorbeeld', 'example');
  const exTag = (x, y) => txt(x, y, EX, 21, 'end', 'sp-mute');

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

  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the world
  const B = C.BOARD;
  const BF = B.y + 3.2;
  // the points on the board's own chart: n hours plotted (the top frame, z 66–104)
  function boardPts(n) {
    let out = '';
    const all = [...C.EARLY, ...C.MEANS];
    const pts = [];
    const rpts = [];
    for (let i = 0; i < Math.min(n, all.length); i++) {
      const x = B.x0 + 12 + i * 5.8;
      pts.push(at([x, BF, 85 + (all[i] - C.NOM) * 1400]));
      rpts.push(at([x, BF, 47 + (C.RANGES[i] - C.RBAR) * 600]));
    }
    if (pts.length > 1) out += `<path class="sp-ink" d="${fmt(pts)}"/><path class="sp-ink" d="${fmt(rpts)}"/>`;
    for (const [x, y] of [...pts, ...rpts]) out += `<circle class="sp-inkdot" cx="${f1(x)}" cy="${f1(y)}" r="${f2(0.9 * KS)}"/>`;
    return out;
  }
  // chips curling off the insert while it cuts
  const rnd = (i) => { const s = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return s - Math.floor(s); };
  function chipsSvg(clockS) {
    let out = '';
    for (let i = Math.max(0, Math.floor((clockS - 1) / 0.25)); i * 0.25 <= clockS; i++) {
      const age = clockS - i * 0.25;
      if (age > 1 || age < 0) continue;
      const a = rnd(i) * Math.PI;
      const p = [-266 + 6 * age * Math.cos(a), C.LY - 4 - 10 * age, C.LZ - 2 - 18 * age * age + 4 * age * Math.sin(a)];
      const [sx, sy] = at(p);
      const sz = 0.9 * KS;
      out += `<path class="sp-acc" style="opacity:${(1 - age).toFixed(2)}" d="M${f2(sx - sz)} ${f2(sy)}Q${f2(sx)} ${f2(sy - sz * 1.4)} ${f2(sx + sz)} ${f2(sy)}Q${f2(sx)} ${f2(sy - sz * 0.5)} ${f2(sx - sz)} ${f2(sy)}Z"/>`;
    }
    return out;
  }
  // the screen of the control panel: the offset as a bar that jumps after every part
  function panelScreen(off) {
    const y = 4 + 12 + 0.1;
    const xs = (v) => -230 + 8 + clamp(v, -1, 1) * 5;
    const bar = [[xs(0), y, 80], [xs(off), y, 80], [xs(off), y, 84], [xs(0), y, 84]].map(at);
    const mid = [at([-222, y, 78]), at([-222, y, 86])];
    return `<path class="sp-acc" d="${fmt(bar)}Z"/><path class="sp-ink" d="${fmt(mid)}"/>`
      + `<path class="sp-ink" style="stroke-width:.6" d="${fmt([at([-227, y, 89]), at([-217, y, 89])])}"/>`;
  }
  // the shafts in the quarantine crate, seen as end rings on top
  function crateIn(n) {
    let out = '';
    const c = C.CRATE;
    for (let i = 0; i < n; i++) {
      const x = c.x + 6 + (i % 6) * 4.6;
      const y = c.y + 6 + Math.floor(i / 6) * 5;
      out += `<path class="sp-hollow" style="stroke-width:.8" d="${ring(x, y, 1.9, C.CRATE_H - 1.5, P, 14)}"/>`;
    }
    return out;
  }
  // the marbles on the paper: landings in funnel units (1 = about 4 world units)
  const MU = 5.6;
  function marblesSvg(list, fresh) {
    let out = '';
    list.forEach(([x, y], i) => {
      const [sx, sy] = at([C.TGT[0] + x * MU, C.TGT[1] + y * MU, C.FT + 1.1]);
      out += `<circle class="sp-marble"${i === fresh ? ' data-new=""' : ''} cx="${f1(sx)}" cy="${f1(sy)}" r="${f2(1.25 * KS)}"/>`;
    });
    return out;
  }
  function fallingSvg(fx, fy, t) {
    if (t <= 0 || t >= 1) return '';
    const [sx, sy] = at([C.TGT[0] + fx * MU, C.TGT[1] + fy * MU, lerp(C.FUN_Z - 1, C.FT + 1.1, t * t)]);
    return `<circle class="sp-marble" data-new="" cx="${f1(sx)}" cy="${f1(sy)}" r="${f2(1.25 * KS)}"/>`;
  }

  // ------------------------------------------------------------ the X-bar and R chart
  const PX0 = 304;
  const PX1 = 606;
  const xh = (i) => lerp(PX0 + 8, PX1 - 8, i / 10); // hour index 0 = 06:00 … 10 = 16:00
  const yX = (v) => lerp(222, 70, (v - 19.984) / 0.032);
  const yR = (v) => lerp(350, 278, v / 0.05);
  const ALL = [...C.EARLY, ...C.MEANS];
  const OFFS = [-0.45, -0.15, 0.05, 0.2, 0.55];
  function xrBase() {
    let out = rect(196, 12, 436, 376);
    out += line(PX0, 62, PX0, 228) + line(PX0, 228, PX1, 228) + line(PX0, yX(C.NOM), PX1, yX(C.NOM), 'sp-grid');
    out += txt(PX0 - 8, yX(C.NOM) + 8, dec(C.NOM, 3), 21, 'end', 'sp-mono');
    out += line(PX0, 272, PX0, 356) + line(PX0, 356, PX1, 356) + line(PX0, yR(C.RBAR), PX1, yR(C.RBAR), 'sp-grid');
    out += txt(PX0 - 8, yR(C.RBAR) + 8, dec(C.RBAR, 3), 21, 'end', 'sp-mono');
    out += txt(xh(0), 382, '06:00', 21, 'middle', 'sp-mute') + txt(xh(4), 382, '10:00', 21, 'middle', 'sp-mute') + txt(xh(10), 382, '16:00', 21, 'middle', 'sp-mute');
    out += exTag(620, 44);
    return out;
  }
  function xrLim(a) {
    if (a <= 0.01) return '';
    const ucl = yX(C.UCL);
    const lcl = yX(C.LCL);
    const rU = yR(C.D4 * C.RBAR);
    return `<g style="opacity:${a.toFixed(2)}">${line(PX0, ucl, PX1, ucl, 'sp-lim')}${line(PX0, lcl, PX1, lcl, 'sp-lim')}${line(PX0, rU, PX1, rU, 'sp-lim')}`
      + txt(PX0 - 8, ucl + 8, dec(C.UCL, 4), 21, 'end', 'sp-big') + txt(PX0 - 8, lcl + 8, dec(C.LCL, 4), 21, 'end', 'sp-big') + '</g>';
  }
  // n: hours plotted (fractional: the next point fades in); hi: index from which
  // the points are lit (the trend); spec: the spec limits' arrows; five: the
  // last subgroup's five shafts spread out beside its mean
  function xrPts(n, { hi = 99, spec = 0, five = 0, trend = 0 } = {}) {
    let out = '';
    const k = Math.floor(n);
    const fr = n - k;
    const xs = [];
    const rs = [];
    for (let i = 0; i < Math.min(ALL.length, Math.ceil(n)); i++) { xs.push([xh(i), yX(ALL[i])]); rs.push([xh(i), yR(C.RANGES[i])]); }
    const shown = (arr) => arr.slice(0, Math.max(1, k + (fr > 0.5 ? 1 : 0)));
    if (xs.length > 1) out += `<path class="sp-line" style="stroke-width:1.6" d="${fmt(shown(xs))}"/><path class="sp-line" style="stroke-width:1.6" d="${fmt(shown(rs))}"/>`;
    xs.forEach(([x, y], i) => {
      const a = i < k ? 1 : fr;
      const lit = i >= hi;
      out += `<g style="opacity:${a.toFixed(2)}">${dot(x, y, lit ? 6.5 : 5, lit ? 'sp-acc' : 'sp-dot')}${dot(rs[i][0], rs[i][1], 4.5)}</g>`;
    });
    if (trend > 0.01) {
      const pts = xs.slice(hi);
      out += `<g style="opacity:${trend.toFixed(2)}"><path class="sp-accl" d="${fmt(pts.map(([x, y]) => [x, y - 14]))}"/>${txt(pts[pts.length - 1][0], pts[pts.length - 1][1] + 40, '7 × ↑', 24, 'end', 'sp-on')}</g>`;
    }
    if (five > 0.01 && k > 0) {
      const i = k - 1;
      const x = xh(i) + 22;
      const r = C.RANGES[i];
      let g = '';
      OFFS.forEach((o) => { g += dot(x, yX(ALL[i] + o * r), 4.5, 'sp-hollow'); });
      g += line(x - 10, yX(ALL[i]), x + 10, yX(ALL[i]), 'sp-accl');
      g += `<path class="sp-accl" d="M${f1(x + 14)} ${f1(yR(0))}L${f1(x + 14)} ${f1(yR(r))}"/>` + line(x + 8, yR(r), x + 20, yR(r), 'sp-accl');
      out += `<g style="opacity:${five.toFixed(2)}">${g}</g>`;
    }
    if (spec > 0.01) {
      out += `<g style="opacity:${spec.toFixed(2)}">${txt(PX1, 72, `↑ spec ${dec(C.NOM + C.TOL, 2)}`, 21, 'end', 'sp-mute')}${txt(PX1, 250, `↓ spec ${dec(C.NOM - C.TOL, 2)}`, 21, 'end', 'sp-mute')}</g>`;
    }
    return out;
  }
  const xbarTitles = () => txt(312, 44, 'X-bar', 24, 'start', 'sp-big') + txt(392, 44, tr('gem. van 5', 'mean of 5'), 21, 'start', 'sp-mute')
    + txt(312, 262, 'R', 24, 'start', 'sp-big') + txt(336, 262, tr('range', 'range'), 21, 'start', 'sp-mute');

  // ------------------------------------------------------------ the rules, four small charts
  function rulesSvg(a, lit) {
    if (a <= 0.01) return '';
    let out = rect(196, 12, 436, 376);
    const cards = [
      { t: tr('1 buiten', '1 outside'), v: [0, 0.4, -0.3, 0.2, 3.4, 0.1, -0.2] },
      { t: tr('7 aan één kant', '7 on one side'), v: [-0.6, 0.6, 0.3, 0.9, 0.5, 1.1, 0.4, 0.8, 0.6] },
      { t: tr('6 stijgend', '6 rising'), v: [-0.4, -1.2, -0.8, -0.3, 0.2, 0.6, 1.1, 1.6] },
      { t: tr('2 van 3 > 2σ', '2 of 3 > 2σ'), v: [0.2, -0.4, 2.4, 0.9, 2.6, 0.3] },
    ];
    cards.forEach((c, i) => {
      const x0 = 208 + (i % 2) * 212;
      const y0 = 24 + Math.floor(i / 2) * 182;
      const on = lit === i;
      out += rect(x0, y0, 200, 170, on ? 'sp-accf' : 'sp-card', 6);
      const yy = (v) => y0 + 86 - v * 17;
      out += line(x0 + 14, yy(0), x0 + 186, yy(0), 'sp-grid') + line(x0 + 14, yy(3), x0 + 186, yy(3), 'sp-lim') + line(x0 + 14, yy(-3), x0 + 186, yy(-3), 'sp-lim');
      const pts = c.v.map((v, j) => [lerp(x0 + 22, x0 + 178, j / (c.v.length - 1)), yy(v)]);
      out += `<path class="sp-line" style="stroke-width:1.6" d="${fmt(pts)}"/>` + pts.map(([x, y]) => dot(x, y, 3.6)).join('');
      out += txt(x0 + 100, y0 + 160, c.t, 21, 'middle', on ? 'sp-on' : 'sp-txt');
    });
    return `<g style="opacity:${a.toFixed(2)}">${out}</g>`;
  }

  // ------------------------------------------------------------ single parts: stable, tampering, calm again
  const ZX0 = 252;
  const ZX1 = 540;
  const yZ = (v) => 196 - v * 30;
  const bell = (x, sd, cls) => {
    const pts = [];
    for (let i = -32; i <= 32; i++) { const v = (i / 10) * sd; pts.push([x + 54 * Math.exp(-((i / 10) ** 2) / 2), yZ(v)]); }
    return `<path class="${cls}" d="${fmt(pts)}"/>`;
  };
  // left/right: how far the two halves are drawn (0..1); mode 'tamp' or 'calm';
  // bells: the spread compared at the right; pct: its label
  function zigSvg(left, right, mode, bells, pct, ref = 1, acc = 1.414) {
    let out = rect(196, 12, 436, 376);
    out += line(ZX0, 60, ZX0, 336) + line(ZX0, 336, ZX1 + 8, 336) + line(ZX0, yZ(0), ZX1 + 8, yZ(0), 'sp-grid');
    out += `<rect class="sp-band" x="${ZX0}" y="${f1(yZ(1.5))}" width="${ZX1 + 8 - ZX0}" height="${f1(yZ(-1.5) - yZ(1.5))}"/>`;
    out += txt(262, 44, tr('losse stuks', 'single parts'), 22, 'start', 'sp-big') + exTag(620, 44);
    out += txt(ZX0 - 6, yZ(0) + 8, tr('nom.', 'nom.'), 21, 'end', 'sp-mute');
    const mid = (ZX0 + ZX1) / 2;
    out += line(mid, 70, mid, 330, 'sp-grid');
    out += txt((ZX0 + mid) / 2, 362, tr('met rust', 'left alone'), 21, 'middle', 'sp-mute');
    out += txt((mid + ZX1) / 2, 362, mode === 'tamp' ? tr('bijgesteld', 'adjusted') : tr('met rust', 'left alone'), 21, 'middle', mode === 'tamp' ? 'sp-on' : 'sp-mute');
    const n = C.ZIG.stable.length;
    const sx = (i, half) => lerp(half ? mid + 6 : ZX0 + 6, half ? ZX1 : mid - 6, i / (n - 1));
    const draw = (vals, half, prog, cls) => {
      const m = Math.round(n * clamp(prog, 0, 1));
      if (m < 1) return '';
      const pts = vals.slice(0, m).map((v, i) => [sx(i, half), yZ(v)]);
      return `<path class="${cls}" style="stroke-width:1.5" d="${fmt(pts)}"/>` + pts.map(([x, y]) => dot(x, y, 3.4)).join('');
    };
    out += draw(C.ZIG.stable, false, left, 'sp-line');
    const second = mode === 'tamp' ? C.ZIG.tamp : C.ZIG.stable.map((v, i) => C.ZIG.stable[(i + 7) % n] * 0.98);
    out += `<g data-z="${mode}">${draw(second, true, right, mode === 'tamp' ? 'sp-line' : 'sp-line')}</g>`;
    if (bells > 0.01) {
      out += `<g style="opacity:${bells.toFixed(2)}">${bell(ZX1 + 14, ref, 'sp-line')}${bell(ZX1 + 14, acc, 'sp-accl')}`
        + txt(620, 86, pct, 24, 'end', 'sp-on') + '</g>';
    }
    return out;
  }
  // wear compensation: the mean creeps up with wear; a fixed offset brings it back
  function sawSvg(prog) {
    let out = rect(196, 12, 436, 376);
    const x0 = 252;
    const x1 = 610;
    const yy = (v) => 220 - v * 34;
    out += line(x0, 60, x0, 336) + line(x0, 336, x1, 336) + line(x0, yy(0), x1, yy(0), 'sp-grid');
    out += line(x0, yy(2.6), x1, yy(2.6), 'sp-lim') + txt(x1, yy(2.6) - 10, tr('afgesproken lijn', 'agreed line'), 21, 'end', 'sp-mute');
    out += txt(262, 44, tr('slijtage', 'wear'), 22, 'start', 'sp-big') + exTag(620, 44);
    out += txt(x0 - 6, yy(0) + 8, tr('nom.', 'nom.'), 21, 'end', 'sp-mute');
    const N = 48;
    const per = 12;
    const m = Math.round(N * clamp(prog, 0, 1));
    const pts = [];
    let marks = '';
    for (let i = 0; i < m; i++) {
      const mean = -1.2 + 3 * ((i % per) / per);
      const v = mean + 0.5 * Math.sin(i * 2.7) * rnd(i);
      const x = lerp(x0 + 8, x1 - 8, i / (N - 1));
      pts.push([x, yy(v)]);
      if (i % per === per - 1 && i + 1 < N) marks += `<path class="sp-accl" d="M${f1(x + 3)} ${f1(yy(1.9))}L${f1(x + 3)} ${f1(yy(-0.9))}"/><path class="sp-acc" d="M${f1(x - 3)} ${f1(yy(-0.6))}L${f1(x + 9)} ${f1(yy(-0.6))}L${f1(x + 3)} ${f1(yy(-1.3))}Z"/>`;
    }
    if (pts.length > 1) out += `<path class="sp-line" style="stroke-width:1.5" d="${fmt(pts)}"/>` + pts.map(([x, y]) => dot(x, y, 3.2)).join('');
    out += marks;
    out += txt((x0 + x1) / 2, 370, tr('vaste correctie na een vast aantal stuks', 'fixed offset after a set number of parts'), 21, 'middle', 'sp-mute');
    return out;
  }
  // the funnel's spread: two meters, left alone against moved
  function meterSvg(a, moved) {
    if (a <= 0.01) return '';
    const w0 = 150;
    let out = rect(372, 14, 260, 128);
    out += txt(386, 46, tr('spreiding', 'spread'), 21, 'start', 'sp-mute') + exTag(620, 46);
    out += txt(386, 80, tr('stil', 'still'), 21, 'start', 'sp-txt') + `<rect class="fp-meter" x="470" y="64" width="${w0}" height="18" rx="3"/>`;
    out += txt(386, 120, tr('verzet', 'moved'), 21, 'start', 'sp-txt') + `<rect class="fp-meter" data-top="" x="470" y="104" width="${f1(w0 * lerp(1, 1.414, moved) * 0.7)}" height="18" rx="3"/>`;
    return `<g style="opacity:${a.toFixed(2)}">${out.replace(`width="${w0}"`, `width="${f1(w0 * 0.7)}"`)}</g>`;
  }

  // ------------------------------------------------------------ the count charts
  function countCard(i, prog) {
    const x0 = 208 + (i % 2) * 212;
    const y0 = 54 + Math.floor(i / 2) * 168;
    const name = ['p', 'np', 'c', 'u'][i];
    const sub = [tr('fractie', 'fraction'), tr('n vast', 'fixed n'), tr('per stuk', 'per unit'), tr('per m²', 'per m²')][i];
    let out = rect(x0, y0, 200, 158, 'sp-card', 6);
    out += txt(x0 + 14, y0 + 40, name, 32, 'start', 'sp-big') + txt(x0 + 186, y0 + 38, sub, 21, 'end', 'sp-mute');
    const yy = (v) => y0 + 132 - v * 12;
    const xs = (j) => lerp(x0 + 18, x0 + 182, j / 9);
    const vals = [[2, 3, 1, 2, 4, 2, 1, 3, 2, 2], [3, 2, 4, 2, 3, 5, 2, 3, 3, 2], [4, 2, 3, 5, 3, 2, 4, 3, 1, 3], [2, 3, 2, 4, 2, 3, 3, 2, 4, 2]][i];
    // limits: p steps with n, u too; np and c flat
    if (i === 0 || i === 3) {
      const w = [1, 1.3, 0.9, 1.1, 1.4, 1, 0.8, 1.2, 1, 1.1];
      let d = '';
      w.forEach((s, j) => { const y = yy(2.4 + 2.6 * s); d += `M${f1(xs(j) - 8)} ${f1(y)}L${f1(xs(j) + 8)} ${f1(y)}`; });
      out += `<path class="sp-lim" d="${d}"/>`;
    } else out += line(x0 + 14, yy(5.6), x0 + 186, yy(5.6), 'sp-lim');
    out += line(x0 + 14, yy(0), x0 + 186, yy(0), 'sp-axis');
    const m = Math.round(10 * clamp(prog, 0, 1));
    const pts = vals.slice(0, m).map((v, j) => [xs(j), yy(v)]);
    if (pts.length > 1) out += `<path class="sp-line" style="stroke-width:1.5" d="${fmt(pts)}"/>`;
    out += pts.map(([x, y]) => dot(x, y, 3.6)).join('');
    return out;
  }
  function pdetSvg(prog, hi) {
    let out = rect(196, 12, 436, 376);
    const x0 = 290;
    const x1 = 610;
    const yy = (pc) => 320 - pc * 34;
    out += txt(400, 44, tr('p-kaart', 'p chart'), 22, 'start', 'sp-big') + exTag(620, 44);
    out += line(x0, 70, x0, 320) + line(x0, 320, x1, 320);
    const ucl = C.PUCL * 100;
    out += line(x0, yy(ucl), x1, yy(ucl), 'sp-lim') + txt(x0 - 8, yy(ucl) + 8, `${dec(ucl, 1)}%`, 21, 'end', 'sp-big');
    out += line(x0, yy(1), x1, yy(1), 'sp-grid') + txt(x0 - 8, yy(1) + 8, '1%', 21, 'end', 'sp-mono');
    out += txt(x0 - 8, yy(0) + 8, '0', 21, 'end', 'sp-mono');
    const vals = [0, 2, 0, 0, 2, 0, 4, 0, 2, 0, 0, 2];
    const m = Math.round(vals.length * clamp(prog, 0, 1));
    const pts = vals.slice(0, m).map((v, j) => [lerp(x0 + 14, x1 - 14, j / (vals.length - 1)), yy(v)]);
    if (pts.length > 1) out += `<path class="sp-line" style="stroke-width:1.5" d="${fmt(pts)}"/>`;
    pts.forEach(([x, y], j) => { out += dot(x, y, vals[j] === 4 && hi ? 7 : 4.2, vals[j] === 4 && hi ? 'sp-acc' : 'sp-dot'); });
    out += txt((x0 + x1) / 2, 360, tr('n = 50 per steekproef', 'n = 50 per sample'), 21, 'middle', 'sp-mute');
    return out;
  }

  // ------------------------------------------------------------ four cavities
  // the mould: four cavities in a 2 × 2 block; lit: index of the lit cavity
  function mouldSvg(lit) {
    let out = rect(196, 12, 436, 376) + txt(281, 236, EX, 21, 'middle', 'sp-mute') + rect(206, 24, 150, 150, 'sp-card', 6);
    for (let i = 0; i < 4; i++) {
      const x = 222 + (i % 2) * 64;
      const y = 40 + Math.floor(i / 2) * 64;
      out += rect(x, y, 54, 54, i === lit ? 'sp-accf' : 'sp-panel', 10) + txt(x + 27, y + 35, String(i + 1), 24, 'middle', i === lit ? 'sp-on' : 'sp-big');
    }
    out += txt(281, 202, tr('holte', 'cavity'), 21, 'middle', 'sp-mute');
    return out;
  }
  // a chart of means: wide (four cavities mixed) or one cavity with its own limits
  function cavChart(mode, prog, frozen) {
    let out = '';
    const x0 = 392;
    const x1 = 612;
    const y0 = 70;
    const y1 = 330;
    const yy = (v) => lerp(y1 - 10, y0 + 10, (v + 4) / 8);
    out += line(x0, y0, x0, y1) + line(x0, y1, x1, y1) + line(x0, yy(0), x1, yy(0), 'sp-grid');
    const lim = mode === 'mixed' ? 3.4 : 1.2;
    out += line(x0, yy(lim), x1, yy(lim), 'sp-lim') + line(x0, yy(-lim), x1, yy(-lim), 'sp-lim');
    out += txt(x0, 50, mode === 'mixed' ? tr('holtes 1–4 samen', 'cavities 1–4 mixed') : tr('alleen holte 3', 'cavity 3 only'), 21, 'start', mode === 'mixed' ? 'sp-txt' : 'sp-on');
    const N = 14;
    const m = Math.round(N * clamp(prog, 0, 1));
    const pts = [];
    for (let i = 0; i < m; i++) {
      const drift = -1.9 * clamp((i - 5) / 8, 0, 1);
      const v = mode === 'mixed' ? drift / 4 + 0.35 * Math.sin(i * 1.9) : drift + 0.32 * Math.sin(i * 2.3);
      pts.push([lerp(x0 + 12, x1 - 12, i / (N - 1)), yy(v)]);
    }
    if (pts.length > 1) out += `<path class="sp-line" style="stroke-width:1.5" d="${fmt(pts)}"/>`;
    pts.forEach(([x, y], i) => {
      const out2 = mode !== 'mixed' && y > yy(-lim);
      out += dot(x, y, out2 ? 6.5 : 4, out2 ? 'sp-acc' : 'sp-dot');
    });
    if (frozen > 0.01) {
      const xf = lerp(x0 + 12, x1 - 12, 5 / (N - 1));
      out += `<g style="opacity:${frozen.toFixed(2)}"><path class="sp-accl" d="M${f1(x0 + 4)} ${f1(y1 + 16)}L${f1(xf)} ${f1(y1 + 16)}"/>${txt(x1, y1 + 46, tr('20–25 subgroepen, dan vast', '20–25 subgroups, then frozen'), 21, 'end', 'sp-on')}</g>`;
    }
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['xr', 'xbar', 'rules', 'zig', 'saw', 'meter', 'counts', 'pdet', 'cav'];
  set(E.xrIn, '');
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let shafts = 5;
    let boardN = 11;
    let chips = false;
    let insertBy = [0, 0, 0];
    let crateN = 0;
    let off = 0;
    let lamp = 0; // 0 run, 2 stop
    let marbles = [];
    let fresh = -1;
    let falling = '';
    let funBy = [0, 0, 0];
    let micro = 0;

    if (si === 0) {
      chips = b <= 1;
      shafts = b < 2 ? 0 : b === 2 ? Math.min(5, Math.floor(span(p, 0.05, 0.75) * 5.999)) : 5;
      micro = b === 2 ? Math.sin(Math.PI * ((p * 5) % 1)) : 0;
      boardN = b < 3 ? 4 : 4 + Math.round(span(p, 0.1, 0.6));
    } else if (si === 1 || si === 2) {
      vis.xr = span(u, 0, 0.04);
      set(E.xrIn, xrBase());
      if (si === 1) {
        boardN = 4;
        vis.xbar = 1;
        set(E.xbar, xbarTitles());
        set(E.xrLim, xrLim(b >= 2 ? (b === 2 ? span(p, 0.05, 0.3) : 1) : 0));
        const n = b === 0 ? 1 + span(p, 0.1, 0.8) * 3 : 4;
        E.xrIn.__h = null;
        set(E.xrIn, xrBase() + xrPts(n, { five: b <= 1 ? (b === 0 ? span(p, 0.4, 0.7) : 1) : 0, spec: b === 3 ? span(p, 0.1, 0.3) : 0 }));
      } else {
        vis.xbar = 1;
        set(E.xbar, xbarTitles());
        set(E.xrLim, xrLim(1));
        const n = b === 0 ? 4 + span(p, 0.1, 0.9) * 4 : b === 1 ? 8 + span(p, 0.1, 0.8) * 3 : 11;
        boardN = Math.round(n);
        vis.xr = b === 3 ? 1 - span(p, 0, 0.12) : vis.xr;
        vis.xbar = vis.xr;
        set(E.xrIn, xrBase() + xrPts(n, { hi: b >= 2 ? 4 : 99, trend: b === 2 ? span(p, 0.1, 0.4) : b === 3 ? 1 : 0 }));
        vis.rules = b === 3 ? span(p, 0.05, 0.2) : 0;
        if (vis.rules > 0.01) set(E.rules, rulesSvg(1, Math.min(3, Math.floor(span(p, 0.2, 0.95) * 3.999))));
      }
    } else if (si === 3) {
      // the rule fired: stop, change the insert at 16:10, set the suspect shafts apart
      lamp = b <= 1 ? 2 : 0;
      if (b === 1) {
        const outA = span(p, 0.15, 0.4);
        const inA = span(p, 0.55, 0.8);
        insertBy = [0, -14 * (outA - inA), 6 * (outA - inA)];
      }
      crateN = b < 2 ? 0 : b === 2 ? Math.round(span(p, 0.15, 0.8) * 12) : 12;
      shafts = b >= 2 ? 0 : 5;
    } else if (si === 4) {
      // tampering: the offset jumps after every part
      shafts = 0;
      const part = Math.floor(clockS / 0.8);
      const n = C.ZIG.tamp.length;
      off = b >= 1 ? clamp(-C.ZIG.tamp[part % n] * 0.45, -1, 1) : 0;
      vis.zig = span(u, 0, 0.04);
      set(E.zig, zigSvg(b === 0 ? span(p, 0.1, 0.9) : 1, b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.9) : 1, 'tamp', b >= 2 ? span(p, 0.2, 0.5) : 0, '+41%'));
    } else if (si === 5) {
      // the funnel: left alone, then moved after every drop
      const N = C.FUN.still.length;
      if (b <= 1) {
        const k = b === 0 ? span(p, 0.3, 1) * 8 : 8 + span(p, 0, 0.9) * (N - 8);
        const kk = Math.floor(k);
        marbles = C.FUN.still.slice(0, kk);
        fresh = kk - 1;
        const nx = C.FUN.still[Math.min(N - 1, kk)];
        falling = fallingSvg(nx[0], nx[1], k - kk);
      } else {
        const k = b === 2 ? span(p, 0.05, 0.95) * N : N;
        const kk = Math.floor(k);
        marbles = C.FUN.moved.slice(0, kk);
        fresh = kk - 1;
        const i = Math.min(N - 1, kk);
        const pos = C.FUN.pos[i];
        // the funnel slides to its new place in the first part of each drop
        const prev = C.FUN.pos[Math.max(0, i - 1)];
        const t = k - kk;
        const sl = span(t, 0, 0.35);
        const fp = b === 2 ? [lerp(prev[0], pos[0], sl), lerp(prev[1], pos[1], sl)] : pos;
        funBy = [fp[0] * MU, fp[1] * MU, 0];
        if (b === 2) { const nx = C.FUN.moved[i]; falling = t > 0.35 ? fallingSvg(fp[0] + (nx[0] - pos[0]) * ((t - 0.35) / 0.65), fp[1] + (nx[1] - pos[1]) * ((t - 0.35) / 0.65), (t - 0.35) / 0.65) : ''; }
      }
      vis.meter = b >= 2 ? (b === 2 ? span(p, 0, 0.15) : 1) : 0;
      if (vis.meter > 0.01) set(E.meter, meterSvg(1, b === 2 ? span(p, 0.2, 0.9) : 1));
    } else if (si === 6) {
      shafts = 0;
      off = b === 3 ? 0.15 * Math.sin(clockS) : 0;
      if (b === 1) {
        vis.saw = span(p, 0, 0.1);
        set(E.saw, sawSvg(span(p, 0.1, 0.9)));
      } else {
        vis.zig = b === 0 ? span(p, 0, 0.1) : b === 2 ? span(p, 0, 0.1) : b === 3 ? 1 - span(p, 0, 0.12) : 0;
        if (vis.zig > 0.01) set(E.zig, zigSvg(1, b === 0 ? span(p, 0.1, 0.9) : 1, 'calm', b >= 2 ? span(p, 0.15, 0.4) : 0, '−29%', 1.414, 1));
      }
    } else if (si === 7) {
      crateN = 12;
      shafts = 0;
      vis.counts = b <= 2 ? span(u, 0, 0.04) : 1 - span(p, 0, 0.12);
      set(E.cP, rect(196, 12, 436, 376) + exTag(620, 40) + countCard(0, b === 0 ? span(p, 0.1, 0.8) : 1));
      set(E.cNP, b >= 1 ? countCard(1, b === 1 ? span(p, 0.1, 0.8) : 1) : '');
      set(E.cC, b >= 2 ? countCard(2, b === 2 ? span(p, 0.05, 0.5) : 1) : '');
      set(E.cU, b >= 2 ? countCard(3, b === 2 ? span(p, 0.5, 0.95) : 1) : '');
      vis.pdet = b === 3 ? span(p, 0.05, 0.2) : 0;
      if (vis.pdet > 0.01) set(E.pdet, pdetSvg(span(p, 0.15, 0.6), p > 0.55));
    } else if (si === 8) {
      shafts = 0;
      vis.cav = span(u, 0, 0.04);
      const mixed = b <= 1;
      set(E.cavIn, mouldSvg(b === 0 ? -1 : 2) + (mixed ? cavChart('mixed', b === 0 ? span(p, 0.1, 0.9) : 1, 0) : ''));
      set(E.cavR, mixed ? '' : cavChart('one', b === 2 ? span(p, 0.1, 0.9) : 1, b === 3 ? span(p, 0.1, 0.35) : 0));
      vis.cav = vis.cav * 1;
    }

    // world parts
    for (let i = 0; i < 5; i++) show(E['sh' + i], i < shafts);
    set(E.boardPts, boardPts(boardN));
    set(E.chips, chips ? chipsSvg(clockS) : '');
    move(E.insert, insertBy);
    move(E.spindle, [-2.4 * micro, 0, 0]);
    set(E.crateIn, crateIn(crateN));
    set(E.panelTxt, panelScreen(off));
    [0, 1, 2].forEach((i) => flag(E['lamp' + i], 'data-lit', (lamp === 2 && i === 2) || (lamp === 0 && i === 0)));
    set(E.marbles, marblesSvg(marbles, fresh) + falling);
    move(E.funnel, funBy);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
