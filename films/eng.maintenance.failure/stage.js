// The stage of the film "Hoe machines falen / How machines fail": a pure
// function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants and the model's data), CAM (one camera move
// per scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, span, beatStarts */
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
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const cross = (x, y, s = 8) => `<path class="mf-accl" d="M${f1(x - s)} ${f1(y - s)}L${f1(x + s)} ${f1(y + s)}M${f1(x - s)} ${f1(y + s)}L${f1(x + s)} ${f1(y - s)}"/>`;
  const EX = tr('voorbeeld', 'example');
  const exTag = (x = 620, y = 40) => txt(x, y, EX, 20, 'end', 'mf-mute');
  const PANEL = () => rect(204, 12, 428, 376);
  const MARKS = [E['mk-stud'], E['mk-sight']].filter(Boolean);

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
    // the part markers: a radius of 18 stage units whatever the zoom (the kit draws circles with a non-scaling stroke)
    for (const m of MARKS) m.setAttribute('r', f1(18 / s));
  }

  // ------------------------------------------------------------ the world's live parts
  const level = (t) => C.V0 + C.DRIFT * t + (t > C.T0 ? C.AMP * (Math.exp((t - C.T0) / C.TAU) - 1) : 0);
  // the fan behind the cowl's grille: seven blades
  function fanPath(phase) {
    let d = '';
    for (let i = 0; i < 7; i++) {
      const t = phase + (i / 7) * Math.PI * 2;
      const a = at([C.COWL_X, 2.6 * Math.cos(t), C.ZC + 2.6 * Math.sin(t)]);
      const b = at([C.COWL_X, 11 * Math.cos(t + 0.35), C.ZC + 11 * Math.sin(t + 0.35)]);
      d += `M${f2(a[0])} ${f2(a[1])}L${f2(b[0])} ${f2(b[1])}`;
    }
    return d;
  }
  // the panel's screen (flat coordinates of the face plane: x, −z): the curve up to week wk
  const sx = (wk) => C.PLOT.x0 + ((C.PLOT.x1 - C.PLOT.x0) * wk) / C.WEEKS;
  const sz = (v) => -(C.PLOT.z0 + ((C.PLOT.z1 - C.PLOT.z0) * Math.min(v, C.PLOT.vmax)) / C.PLOT.vmax);
  function screen(wk) {
    if (wk <= 0) return '';
    const pts = [];
    for (let w = 0; w <= wk + 1e-9; w += 0.5) pts.push([sx(w), sz(level(w))]);
    pts.push([sx(wk), sz(level(wk))]);
    const [nx, ny] = pts[pts.length - 1];
    return `<path class="mf-scr" d="${pts.map(([x, y], i) => (i ? 'L' : 'M') + f2(x) + ' ' + f2(y)).join('')}"/><circle class="mf-now" cx="${f2(nx)}" cy="${f2(ny)}" r="0.6"/>`;
  }
  const wisps = E.wisps ? [...E.wisps.querySelectorAll('circle')] : [];
  const TOP = at([C.STUD[0], C.STUD[1], C.STUD[2] + 3.6]);
  function smoke(a, clockS) {
    wisps.forEach((c, i) => {
      const cyc = (clockS * 0.28 + i / wisps.length) % 1;
      c.setAttribute('cx', f1(TOP[0] + 6 * cyc + 2 * Math.sin(i * 2 + clockS)));
      c.setAttribute('cy', f1(TOP[1] - 4 - 40 * cyc));
      c.setAttribute('r', f1(3 + 9 * cyc));
      c.style.opacity = (a * 0.55 * Math.sin(Math.PI * cyc)).toFixed(3);
    });
  }

  // ------------------------------------------------------------ s1: four timelines of the same bearing
  // Each row plots the bearing's vibration over time under one strategy.
  const SX0 = 236;
  const SX1 = 612;
  const ROWS = [
    tr('correctief: draaien tot hij stuk gaat', 'reactive: run until it breaks'),
    tr('preventief: vast interval', 'preventive: fixed interval'),
    tr('toestandsafhankelijk: meten, grens', 'condition-based: measure, limit'),
    tr('predictief: trend, geplande stop', 'predictive: trend, planned stop'),
  ];
  const lifeOf = (x, x0, x1) => { // 0..1 vibration along one bearing life from x0 to x1
    const t = (x - x0) / (x1 - x0);
    return t <= 0.45 ? 0.08 + 0.04 * t : 0.1 + 0.9 * Math.pow((t - 0.45) / 0.55, 2.2);
  };
  function stratRow(i, prog) {
    const y0 = 24 + i * 84;
    const yb = y0 + 78; // baseline
    const yy = (v) => yb - v * 40;
    let out = txt(SX0 - 12, y0 + 18, ROWS[i], 20, 'start', 'mf-txt');
    out += line(SX0 - 8, yb, SX1, yb, 'mf-grid');
    const xEnd = lerp(SX0, SX1, clamp(prog, 0, 1));
    const pts = [];
    let marks = '';
    if (i === 0) {
      // runs until it breaks at x 540, a stop, then a new bearing
      for (let x = SX0; x <= Math.min(xEnd, 540); x += 4) pts.push([x, yy(lifeOf(x, SX0, 540))]);
      if (xEnd > 540) marks += cross(540, yy(1)) + `<rect class="mf-band" x="540" y="${f1(yb - 46)}" width="22" height="46"/>`;
      if (xEnd > 566) { const p2 = []; for (let x = 566; x <= xEnd; x += 4) p2.push([x, yy(lifeOf(x, 566, 980))]); marks += `<path class="mf-line" d="${fmt(p2)}"/>`; }
    } else if (i === 1) {
      // swapped every 110 units, long before it wears: good parts thrown away
      const swaps = [346, 456, 566];
      let s0 = SX0;
      for (let x = SX0; x <= xEnd; x += 4) {
        const sw = swaps.filter((s) => s <= x).pop();
        if (sw && sw !== s0) { s0 = sw; pts.push(null); }
        pts.push([x, yy(lifeOf(x, s0, s0 + 300))]);
      }
      swaps.forEach((s) => { if (xEnd >= s) marks += line(s, yb - 44, s, yb + 4, 'mf-accl'); });
    } else {
      // condition rises; at the limit (row 3) act; along the trend (row 4) plan the stop
      const lim = yy(0.55);
      marks += line(SX0 - 8, lim, SX1, lim, 'mf-lim');
      const cross3 = 524;
      for (let x = SX0; x <= Math.min(xEnd, i === 2 ? cross3 : 470); x += 4) pts.push([x, yy(lifeOf(x, SX0, 600))]);
      if (i === 2) {
        // monthly measurements as dots
        for (let x = SX0 + 24; x <= Math.min(xEnd, cross3); x += 48) marks += dot(x, yy(lifeOf(x, SX0, 600)), 3.6);
        if (xEnd >= cross3) marks += dot(cross3, yy(lifeOf(cross3, SX0, 600)), 6.5, 'mf-acc') + line(cross3 + 14, yb - 40, cross3 + 14, yb + 4, 'mf-accl');
      } else {
        for (let x = SX0 + 24; x <= Math.min(xEnd, 470); x += 48) marks += dot(x, yy(lifeOf(x, SX0, 600)), 3.6);
        if (xEnd > 470) {
          const xe = Math.min(xEnd, 548);
          marks += `<path class="mf-dash" d="M470 ${f1(yy(lifeOf(470, SX0, 600)))}L${f1(xe)} ${f1(yy(lifeOf(xe, SX0, 600)))}"/>`;
        }
        if (xEnd > 500) marks += `<rect class="mf-accf" x="496" y="${f1(yb - 46)}" width="22" height="46" rx="3"/>` + txt(507, yb + 22, tr('stop', 'stop'), 20, 'middle', 'mf-on');
      }
    }
    // split into runs at null (a swap)
    const runs = [[]];
    pts.forEach((p) => { if (p) runs[runs.length - 1].push(p); else runs.push([]); });
    out += runs.filter((r) => r.length > 1).map((r) => `<path class="mf-line" d="${fmt(r)}"/>`).join('') + marks;
    return out;
  }
  const stratBase = () => PANEL() + txt(224, 380, EX, 20, 'start', 'mf-mute');

  // ------------------------------------------------------------ s2: two assets
  function choiceSvg(n, verdict) {
    let out = PANEL() + exTag();
    const tile = (x, title, lines, res, on) => {
      let o = rect(x, 60, 196, 228, 'mf-tile', 8) + txt(x + 14, 92, title, 22, 'start', 'mf-big');
      lines.forEach((l, j) => { o += txt(x + 14, 128 + j * 30, l, 21, 'start', 'mf-txt'); });
      if (on > 0.01) o += `<g style="opacity:${on.toFixed(2)}">${rect(x + 10, 232, 176, 42, 'mf-accf', 6)}${txt(x + 98, 260, res, 21, 'middle', 'mf-on')}</g>`;
      return o;
    };
    out += tile(216, tr('tandwielkast', 'gearbox'), [tr('bottleneckpers', 'bottleneck press'), '€' + (NL ? '60.000' : '60,000'), tr('10 wk levertijd', '10 wk delivery')], tr('meten', 'measure'), verdict[0]);
    if (n >= 2) out += tile(424, tr('bandmotor', 'conveyor'), [tr('inpaklijn', 'packing line'), '€400', tr('reserve, 15 min', 'spare, 15 min')], tr('laten draaien', 'run it'), verdict[1]);
    return out;
  }
  function plannedSvg(a) {
    if (a <= 0.01) return '';
    const w = 380;
    return `<g style="opacity:${a.toFixed(2)}">${txt(222, 322, tr('gepland werk', 'planned work'), 21, 'start', 'mf-txt')}${txt(612, 322, `≥ ${C.PLANNED}%`, 21, 'end', 'mf-big')}`
      + `<rect class="fp-meter" x="222" y="336" width="${w}" height="16" rx="3"/><rect class="fp-meter" data-top="" x="222" y="336" width="${f1(w * C.PLANNED / 100 * a)}" height="16" rx="3"/></g>`;
  }

  // ------------------------------------------------------------ s3: the bathtub curve
  const TX0 = 262;
  const TX1 = 612;
  const TY0 = 70;
  const TY1 = 262;
  const tubH = (t) => 0.95 * Math.exp(-t / 0.07) + 0.16 + 0.85 * Math.pow(Math.max(0, (t - 0.72) / 0.28), 2.4);
  const tx = (t) => lerp(TX0, TX1, t);
  const ty = (h) => TY1 - (TY1 - TY0) * Math.min(h, 1.1) / 1.1;
  const ZONES = [[0, 0.2], [0.2, 0.75], [0.75, 1]];
  function tubBase() {
    let out = PANEL() + exTag();
    out += line(TX0, TY0 - 14, TX0, TY1) + line(TX0, TY1, TX1, TY1);
    out += txt(TX0 - 10, TY0 + 6, tr('faal-', 'failure'), 20, 'end', 'mf-mute') + txt(TX0 - 10, TY0 + 30, tr('kans', 'rate'), 20, 'end', 'mf-mute');
    out += txt(TX1, TY1 + 28, tr('leeftijd →', 'age →'), 20, 'end', 'mf-mute');
    return out;
  }
  function zoneSvg(i, a) {
    if (a <= 0.01) return '';
    const [t0, t1] = ZONES[i];
    const pts = [];
    for (let t = t0; t <= t1 + 1e-9; t += 0.01) pts.push([tx(t), ty(tubH(t))]);
    const d = fmt(pts) + `L${f1(tx(t1))} ${TY1}L${f1(tx(t0))} ${TY1}Z`;
    const name = [tr('vroeg', 'early'), tr('willekeurig', 'random'), tr('slijtage', 'wear-out')][i];
    return `<g style="opacity:${a.toFixed(2)}"><path class="mf-band" d="${d}"/>${txt((tx(t0) + tx(t1)) / 2, TY1 + (i === 1 ? 28 : 52), name, 20, 'middle', 'mf-txt')}</g>`;
  }
  function tubCurve(prog) {
    const pts = [];
    for (let t = 0; t <= prog + 1e-9; t += 0.01) pts.push([tx(t), ty(tubH(t))]);
    return pts.length > 1 ? `<path class="mf-line" d="${fmt(pts)}"/>` : '';
  }
  function tubBar(a) {
    if (a <= 0.01) return '';
    const x0 = 222;
    const w = 390;
    const y = 330;
    const e = w * C.EARLY / 100;
    const r = w * (100 - C.EARLY - C.WEAR) / 100;
    return `<g style="opacity:${a.toFixed(2)}">${rect(x0, y, e * a, 22, 'fp-meter', 3)}${rect(x0 + e, y, r * a, 22, 'mf-tile', 0)}<rect class="fp-meter" data-top="" x="${f1(x0 + e + r)}" y="${y}" width="${f1(w * C.WEAR / 100 * a)}" height="22" rx="3"/>`
      + txt(x0, y + 50, `${C.EARLY}% ${tr('vroeg', 'early')}`, 20, 'start', 'mf-txt') + txt(x0 + w, y + 50, `${C.WEAR}% ${tr('slijt', 'wear')}`, 20, 'end', 'mf-on') + '</g>';
  }

  // ------------------------------------------------------------ s4: a year of the servo bearings
  const MX0 = 300;
  const MX1 = 606;
  const mx = (m) => lerp(MX0, MX1, m / 12);
  const BEF = [1.4, 3.1, 5.6, 7.2, 9.5, 11.1];
  const SWAPS = [1, 3, 5, 7, 9];
  const AFT = [1.25, 2.3, 3.3, 5.2, 7.25, 8.4, 9.3, 10.6, 11.6]; // five of them just after a swap
  const SOONI = [0, 2, 3, 4, 6];
  function mifBase() {
    let out = PANEL() + exTag();
    out += txt(222, 64, tr('{n} servo-assen, één jaar', '{n} servo axes, one year').replace('{n}', '24'), 21, 'start', 'mf-txt');
    for (const [y, name] of [[150, tr('vóór', 'before')], [262, tr('na', 'after')]]) {
      out += txt(222, y + 7, name, 21, 'start', 'mf-mute') + line(MX0, y, MX1, y, 'mf-grid');
    }
    out += [0, 3, 6, 9, 12].map((m) => line(mx(m), 286, mx(m), 296, 'mf-axis')).join('');
    out += txt(MX0, 320, tr('jan', 'Jan'), 20, 'middle', 'mf-mute') + txt(MX1, 320, tr('dec', 'Dec'), 20, 'middle', 'mf-mute');
    return out;
  }
  function mifRows(nb, na, sw, cnt) {
    let out = '';
    BEF.slice(0, nb).forEach((m) => { out += cross(mx(m), 150, 6); });
    SWAPS.forEach((m, i) => { if (i < sw) out += line(mx(m), 236, mx(m), 288, 'mf-lim') + txt(mx(m), 228, '↻', 20, 'middle', 'mf-mute'); });
    AFT.slice(0, na).forEach((m) => { out += cross(mx(m), 262, 6); });
    if (cnt > 0.01) out += `<g style="opacity:${cnt.toFixed(2)}">${txt(612, 120, String(nb), 30, 'end', 'mf-big')}${na ? txt(612, 232, String(na), 30, 'end', 'mf-big') : ''}</g>`;
    return out;
  }
  function mifSoon(a) {
    if (a <= 0.01) return '';
    let out = '';
    SOONI.forEach((i) => { out += `<circle class="mf-accf" cx="${f1(mx(AFT[i]))}" cy="262" r="14"/>`; });
    out += txt(222, 360, tr('5 binnen twee weken na een wissel', '5 within two weeks after a swap'), 21, 'start', 'mf-on');
    return `<g style="opacity:${a.toFixed(2)}">${out}</g>`;
  }

  // ------------------------------------------------------------ s5: three Weibull shapes
  const WB = [{ b: 0.5, t: 'β < 1', n: tr('vroeg', 'early') }, { b: 1, t: 'β ≈ 1', n: tr('willekeurig', 'random') }, { b: 3, t: 'β > 1', n: tr('slijtage', 'wear-out') }];
  function weibSvg(lit, val, prog) {
    let out = '';
    WB.forEach((w, i) => {
      const x0 = 216 + i * 138;
      const on = lit.includes(i);
      out += rect(x0, 56, 128, 170, on ? 'mf-accf' : 'mf-tile', 6);
      const yy = (h) => 196 - Math.min(h, 1) * 110;
      const pts = [];
      for (let t = 0.04; t <= lerp(0.04, 1, prog) + 1e-9; t += 0.03) pts.push([lerp(x0 + 14, x0 + 114, t), yy(w.b * Math.pow(t, w.b - 1) * (w.b === 1 ? 0.45 : w.b < 1 ? 0.18 : 0.33))]);
      out += line(x0 + 12, 198, x0 + 116, 198, 'mf-axis');
      if (pts.length > 1) out += `<path class="mf-line" d="${fmt(pts)}"/>`;
      out += txt(x0 + 64, 88, w.t, 22, 'middle', on ? 'mf-on' : 'mf-big') + txt(x0 + 64, 254, w.n, 20, 'middle', on ? 'mf-on' : 'mf-txt');
    });
    if (val > 0.01) out += `<g style="opacity:${val.toFixed(2)}">${txt(354 + 64, 284, `β = ${dec(1, 1)}`, 24, 'middle', 'mf-on')}</g>`;
    return out;
  }
  function weibBars(a) {
    if (a <= 0.01) return '';
    const rows = [[tr('vóór', 'before'), C.BEFORE], [tr('wissel', 'swap'), C.AFTER], [tr('meten', 'measure'), C.NEXT]];
    let out = '';
    rows.forEach(([n, v], i) => {
      const y = 300 + i * 28;
      out += txt(222, y + 16, n, 20, 'start', 'mf-mute') + `<rect class="fp-meter"${i === 2 ? ' data-top=""' : ''} x="330" y="${y}" width="${f1(28 * v * a)}" height="18" rx="3"/>` + txt(340 + 28 * v * a, y + 16, String(v), 20, 'start', 'mf-big');
    });
    return `<g style="opacity:${a.toFixed(2)}">${out}</g>`;
  }

  // ------------------------------------------------------------ s6/s7: the P-F curve
  const PX0 = 256;
  const PX1 = 612;
  const PY0 = 64;
  const PY1 = 216;
  const px = (wk) => lerp(PX0, PX1, wk / C.WEEKS);
  const py = (v) => PY1 - (PY1 - PY0) * Math.min(v, 12) / 12;
  // a ball bearing seen end on, with a pit in its outer race that grows from P
  function bearing(cx, cy, pit) {
    let o = `<circle class="mf-tile" cx="${cx}" cy="${cy}" r="30"/><circle class="mf-panel" cx="${cx}" cy="${cy}" r="22"/><circle class="mf-tile" cx="${cx}" cy="${cy}" r="12"/><circle class="mf-panel" cx="${cx}" cy="${cy}" r="6"/>`;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; o += dot(cx + 17 * Math.cos(a), cy + 17 * Math.sin(a), 4.2, 'mf-hollow'); }
    if (pit > 0.01) { const a0 = -Math.PI / 2 - 0.5 * pit; const a1 = -Math.PI / 2 + 0.5 * pit; o += `<path class="mf-accl" d="M${f1(cx + 25 * Math.cos(a0))} ${f1(cy + 25 * Math.sin(a0))}A25 25 0 0 1 ${f1(cx + 25 * Math.cos(a1))} ${f1(cy + 25 * Math.sin(a1))}"/>`; }
    return o;
  }
  function pfBase() {
    let out = PANEL() + exTag(620, 40);
    out += line(PX0, PY0 - 10, PX0, PY1) + line(PX0, PY1, PX1, PY1);
    out += line(PX0, py(C.ACT), PX1, py(C.ACT), 'mf-lim');
    out += txt(PX0 - 8, PY0 + 8, tr('tril-', 'vibr-'), 20, 'end', 'mf-mute') + txt(PX0 - 8, PY0 + 30, tr('ling', 'ation'), 20, 'end', 'mf-mute');
    out += txt(PX0, PY1 + 26, tr('nieuw', 'new'), 20, 'start', 'mf-mute') + txt(px(30), PY1 + 26, tr('weken →', 'weeks →'), 20, 'end', 'mf-mute');
    return out;
  }
  function pfCurve(wk, marks) {
    const pts = [];
    for (let w = 0; w <= Math.min(wk, C.F_WK) + 1e-9; w += 0.5) pts.push([px(w), py(level(w))]);
    let out = pts.length > 1 ? `<path class="mf-line" d="${fmt(pts)}"/>` : '';
    if (wk >= C.P_WK) out += dot(px(C.P_WK), py(level(C.P_WK)), 6, 'mf-acc') + txt(px(C.P_WK) - 10, py(level(C.P_WK)) - 12, 'P', 22, 'end', 'mf-on');
    if (wk >= C.F_WK) out += cross(px(C.F_WK), py(level(C.F_WK))) + txt(px(C.F_WK) + 14, py(level(C.F_WK)) + 8, 'F', 22, 'start', 'mf-big');
    out += marks;
    return out;
  }
  function pfBracket(a) {
    if (a <= 0.01) return '';
    const y = PY1 + 52;
    return `<g style="opacity:${a.toFixed(2)}"><path class="mf-line" d="M${f1(px(C.P_WK))} ${y - 8}L${f1(px(C.P_WK))} ${y + 8}M${f1(px(C.P_WK))} ${y}L${f1(px(C.F_WK))} ${y}M${f1(px(C.F_WK))} ${y - 8}L${f1(px(C.F_WK))} ${y + 8}"/>`
      + `<rect class="mf-band" x="${f1(px(C.P_WK))}" y="${PY0}" width="${f1(px(C.F_WK) - px(C.P_WK))}" height="${PY1 - PY0}"/>`
      + txt((px(C.P_WK) + px(C.F_WK)) / 2, y + 30, tr('P-F', 'P-F'), 21, 'middle', 'mf-txt') + '</g>';
  }
  // inspections every `every` weeks: hollow ticks, the first one inside the window lit
  function inspections(every, upto) {
    let out = '';
    let found = false;
    for (let w = every; w <= Math.min(upto, C.WEEKS); w += every) {
      const inside = w >= C.P_WK && w < C.F_WK && !found;
      if (inside) found = true;
      out += line(px(w), PY1 - 8, px(w), PY1 + 8, inside ? 'mf-accl' : 'mf-axis') + dot(px(w), PY1, inside ? 6 : 4, inside ? 'mf-acc' : 'mf-hollow');
    }
    return out;
  }
  const METH = [['mUs', tr('ultrasoon', 'ultrasound')], ['mVib', tr('trilling', 'vibration')], ['mOil', tr('olie', 'oil')], ['mIr', tr('thermografie', 'thermography')], ['mHand', tr('hand', 'hand')]];
  function methRow(i, a) {
    if (a <= 0.01) return '';
    const wk = C.TECH[i][1];
    const y = 264 + i * 25;
    const x0 = px(C.F_WK - wk);
    return `<g style="opacity:${a.toFixed(2)}">${txt(x0 - 8, y + 7, `${METH[i][1]} ${wk}`, 20, 'end', 'mf-txt')}<path class="mf-line" d="M${f1(x0)} ${y}L${f1(px(C.F_WK))} ${y}"/>${dot(x0, y, 5)}</g>`;
  }

  // ------------------------------------------------------------ s8: the monthly trend
  const RX0 = 270;
  const RX1 = 612;
  const RY0 = 58;
  const RY1 = 300;
  const rx = (m) => lerp(RX0, RX1, m / 6);
  const ry = (v) => RY1 - (RY1 - RY0) * v / 5;
  function trendSvg(n, ext, stop) {
    let out = PANEL() + exTag(620, 380);
    out += line(RX0, RY0 - 8, RX0, RY1) + line(RX0, RY1, RX1, RY1);
    out += txt(RX0 - 8, RY0 + 8, 'mm/s', 20, 'end', 'mf-mute');
    for (const v of [0, 1, 2, 3, 4]) out += txt(RX0 - 8, ry(v) + 7, String(v), 20, 'end', 'mf-mute');
    const mon = NL ? ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    mon.forEach((m, i) => { out += txt(rx(i + 0.5), RY1 + 26, m, 20, 'middle', 'mf-mute'); });
    out += line(RX0, ry(C.ACT), RX1, ry(C.ACT), 'mf-lim') + txt(RX0 + 8, ry(C.ACT) - 8, `${tr('actiegrens', 'action level')} ${dec(C.ACT, 1)}`, 20, 'start', 'mf-txt');
    out += line(RX0, ry(C.WARN), RX1, ry(C.WARN), 'mf-grid') + txt(RX1, ry(C.WARN) - 8, dec(C.WARN, 1), 20, 'end', 'mf-mute');
    const pts = C.TREND.slice(0, Math.ceil(n)).map((v, i) => [rx(i + 0.5), ry(v)]);
    const k = Math.floor(n);
    if (pts.length > 1) out += `<path class="mf-line" d="${fmt(pts.slice(0, Math.max(1, k + (n - k > 0.5 ? 1 : 0))))}"/>`;
    pts.forEach(([x, y], i) => { out += `<g style="opacity:${(i < k ? 1 : n - k).toFixed(2)}">${dot(x, y, 5.5)}${txt(x, y - 14, dec(C.TREND[i], 1), 20, 'middle', 'mf-big')}</g>`; });
    if (ext > 0.01) {
      const m0 = 3.5;
      const m1 = m0 + C.MONTHS * ext;
      out += `<path class="mf-dash" d="M${f1(rx(m0))} ${f1(ry(C.TREND[3]))}L${f1(rx(m1))} ${f1(ry(C.TREND[3] + C.RATE * (m1 - m0)))}"/>`;
      if (ext > 0.98) out += dot(rx(m0 + C.MONTHS), ry(C.ACT), 6, 'mf-acc');
    }
    if (stop > 0.01) {
      out += `<g style="opacity:${stop.toFixed(2)}"><rect class="mf-accf" x="${f1(rx(4.4))}" y="${RY0}" width="${f1(rx(4.6) - rx(4.4))}" height="${RY1 - RY0}" rx="3"/>`
        + txt(rx(4.5), RY1 + 54, tr('stop half mei', 'stop mid-May'), 20, 'middle', 'mf-on') + '</g>';
    }
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['strat', 'choice', 'tub', 'mif', 'weib', 'pf', 'trend'];
  set(E.stBase, stratBase());
  set(E.tbBase, tubBase());
  set(E.mfBase, mifBase());
  set(E.pfBase, pfBase());
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let running = true;
    let smokeA = 0;
    let ping = -1; // seconds since the last measurement, or −1
    let tag = false;
    let wk = 0; // the panel screen's week

    if (si === 0) {
      // the four strategies, one row per beat; the bearing fails in beat 2
      vis.strat = b >= 1 ? (b === 1 ? span(p, 0, 0.12) : 1) : 0;
      const rows = [E.rRun, E.rPrev, E.rCbm, E.rPdm];
      rows.forEach((el, i) => set(el, b >= i + 1 ? stratRow(i, b === i + 1 ? span(p, 0.1, 0.85) : 1) : ''));
      if (b === 1) { running = p < 0.62; smokeA = span(p, 0.5, 0.65) * (1 - span(p, 0.9, 1)); }
      if (b === 3) ping = (clockS % 2.4);
      tag = b === 4 && p > 0.5;
      wk = b === 3 ? 4 + 26 * span(p, 0.1, 0.9) : b === 4 ? 30 : 0;
    } else if (si === 1) {
      vis.choice = span(u, 0, 0.04);
      set(E.chIn, choiceSvg(b >= 2 ? 2 : 1, [b >= 1 ? (b === 1 ? span(p, 0.5, 0.75) : 1) : 0, b >= 2 ? (b === 2 ? span(p, 0.5, 0.75) : 1) : 0]));
      set(E.chBar, plannedSvg(b === 3 ? span(p, 0.35, 0.8) : 0));
      if (b === 1) ping = (clockS % 2.4);
    } else if (si === 2) {
      vis.tub = span(u, 0, 0.04);
      set(E.tbCurve, tubCurve(b === 0 ? span(p, 0.1, 0.9) : 1));
      set(E.zInf, zoneSvg(0, b >= 1 ? (b === 1 ? span(p, 0.05, 0.3) : 1) : 0));
      set(E.zRnd, zoneSvg(1, b >= 2 ? (b === 2 ? span(p, 0.0, 0.2) : 1) : 0));
      set(E.zWear, zoneSvg(2, b >= 2 ? (b === 2 ? span(p, 0.5, 0.7) : 1) : 0));
      set(E.tbBar, tubBar(b === 3 ? span(p, 0.05, 0.6) : 0));
    } else if (si === 3) {
      vis.mif = span(u, 0, 0.04);
      const nb = b === 0 ? 0 : b === 1 ? Math.round(span(p, 0.05, 0.4) * 6) : 6;
      const na = b < 1 ? 0 : b === 1 ? Math.round(span(p, 0.45, 0.85) * 9) : 9;
      set(E.mfBase, mifBase() + mifRows(nb, na, b === 0 ? Math.round(span(p, 0.2, 0.8) * 5) : 5, b >= 1 ? (b === 1 ? span(p, 0.85, 1) : 1) : 0));
      set(E.mfSoon, mifSoon(b >= 2 ? (b === 2 ? span(p, 0.1, 0.4) : 1) : 0));
      tag = b === 3;
    } else if (si === 4) {
      vis.weib = span(u, 0, 0.04);
      const lit = b === 1 ? [Math.min(2, Math.floor(span(p, 0.05, 0.95) * 2.999))] : b >= 2 ? [1] : [];
      set(E.wbIn, weibSvg(lit, b >= 2 ? (b === 2 ? span(p, 0.1, 0.35) : 1) : 0, b === 0 ? span(p, 0.2, 0.9) : 1));
      set(E.wbBars, weibBars(b === 3 ? span(p, 0.1, 0.6) : 0));
      if (b === 3) ping = (clockS % 2.4);
    } else if (si === 5) {
      vis.pf = span(u, 0, 0.04);
      wk = b === 0 ? 4 + 31 * span(p, 0.05, 0.95) : 35;
      let marks = '';
      if (b === 2) marks = inspections(C.PF / 2, 40 * span(p, 0.1, 0.9)) + txt(612, 372, tr(`venster ${C.PF} wk: meten om de ${C.PF / 2} wk`, `${C.PF} wk window: measure every ${C.PF / 2} wk`), 20, 'end', 'mf-mute');
      if (b === 3) marks = inspections(12, 40 * span(p, 0.1, 0.9)) + txt(612, 372, tr(`venster ${C.PF} wk, ronde om de 12 wk`, `${C.PF} wk window, route every 12 wk`), 20, 'end', 'mf-mute');
      set(E.pfIn, pfCurve(wk, marks) + bearing(300, 296, wk <= C.P_WK ? 0 : 0.2 + 0.8 * (wk - C.P_WK) / C.PF));
      set(E.pfBrIn, pfBracket(b >= 1 ? (b === 1 ? span(p, 0.05, 0.3) : 1) : 0));
      running = wk < C.F_WK;
    } else if (si === 6) {
      vis.pf = span(u, 0, 0.04);
      wk = 35;
      set(E.pfIn, pfCurve(35, ''));
      set(E.pfBrIn, '');
      const order = [0, 1, 2, 3, 4];
      order.forEach((i) => {
        const beat = i <= 2 ? i : 3;
        const a = b > beat ? 1 : b === beat ? span(p, i === 4 ? 0.55 : 0.05, i === 4 ? 0.75 : 0.3) : 0;
        set(E[METH[i][0]], methRow(i, a));
      });
      running = true;
      if (b === 1 || b === 0) ping = (clockS % 2.4);
    } else if (si === 7) {
      vis.trend = span(u, 0, 0.04);
      const n = b === 0 ? 0.5 + span(p, 0.05, 0.9) * 3.5 : 4;
      set(E.trIn, trendSvg(n, b === 1 ? span(p, 0.2, 0.8) : b >= 2 ? 1 : 0, b >= 2 ? (b === 2 ? span(p, 0.4, 0.7) : 1) : 0));
      if (b === 0) ping = (clockS % 2.4);
      tag = b === 3;
    }

    // world parts
    E.fan.setAttribute('d', running ? fanPath(clockS * 2.2) : fanPath(0.4));
    flag(E.lamp, 'data-lit', running);
    smoke(smokeA, clockS);
    if (E.ping) E.ping.style.opacity = ping < 0 ? '0' : (span(ping, 0, 0.1) * Math.exp(-Math.max(0, ping - 0.1) / 0.4)).toFixed(3);
    show(E.tag, tag);
    set(E.scr, screen(wk));
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
