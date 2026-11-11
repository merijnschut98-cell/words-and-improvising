// The stage of the film "Een avondpiek in de straat / An evening peak in the
// street": a pure function of (scene, u). Inlined into the page after the
// anatomy kit (iso-kit functions in scope) and a preamble from build.mjs that
// defines P (projection), C (the model's data), CAM (one camera move per
// scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, span, beatStarts */
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
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const grp = (v) => { const s = String(Math.round(v)); return s.length >= 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',') : s; };
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8, extra = '') => `<rect class="${cls}"${extra} x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const tag = (t, x = 620, y = 40, anchor = 'end') => txt(x, y, t, 20, anchor, 'mf-mute');
  const PANEL = (x0 = 204) => rect(x0, 12, 632 - x0, 376);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);

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

  // ------------------------------------------------------------ s1: the water pipe
  const PY = 168;
  const PH = 40;
  function pipeBase() {
    return PANEL() + tag(tr('vergelijking', 'analogy'))
      + rect(232, PY - PH / 2, 376, PH, 'mf-water', 6) + line(232, PY - PH / 2, 608, PY - PH / 2) + line(232, PY + PH / 2, 608, PY + PH / 2)
      + rect(226, PY - PH / 2 - 6, 8, PH + 12, 'mf-tile', 2) + rect(602, PY - PH / 2 - 6, 8, PH + 12, 'mf-tile', 2);
  }
  function gauge(a, v) {
    if (a <= 0.01) return '';
    const cx = 300;
    const cy = 92;
    const r = 34;
    let out = line(cx, cy + r, cx, PY - PH / 2, 'mf-axis') + `<circle class="mf-tile" cx="${cx}" cy="${cy}" r="${r}"/>`;
    for (let i = 0; i <= 8; i++) { const t = Math.PI * (0.75 + (i / 8) * 1.5); out += line(cx + (r - 7) * Math.cos(t), cy + (r - 7) * Math.sin(t), cx + (r - 2) * Math.cos(t), cy + (r - 2) * Math.sin(t)); }
    const t = Math.PI * (0.75 + clamp(v, 0, 1) * 1.5);
    out += line(cx, cy, cx + (r - 9) * Math.cos(t), cy + (r - 9) * Math.sin(t), 'mf-accl') + dot(cx, cy, 4);
    out += txt(352, 82, tr('spanning = druk', 'voltage = push'), 21, 'start', 'mf-txt') + txt(352, 110, `${tr('volt', 'volts')} (V): ${C.U} V`, 21, 'start', 'mf-mono');
    return op(a, out);
  }
  function turbine(a, ph) {
    if (a <= 0.01) return '';
    const cx = 500;
    let out = '';
    for (let i = 0; i < 4; i++) { const t = ph + (i * Math.PI) / 4; out += line(cx - 15 * Math.cos(t), PY - 15 * Math.sin(t), cx + 15 * Math.cos(t), PY + 15 * Math.sin(t), 'mf-line'); }
    out += dot(cx, PY, 4);
    out += txt(232, 230, tr('stroom = doorstroming', 'current = flow'), 21, 'start', 'mf-txt') + txt(232, 258, tr('ampère (A)', 'amperes (A)'), 21, 'start', 'mf-mono');
    return op(a, out);
  }
  function flowDash(a, ph) {
    if (a <= 0.01) return '';
    let out = '';
    for (let i = 0; i < 9; i++) { const x = 240 + ((i * 44 + ph * 44) % 360); out += line(x, PY, Math.min(x + 18, 600), PY, 'mf-accl'); }
    return op(a, out);
  }
  function watt(a, b) {
    return op(a, txt(232, 306, tr('vermogen = spanning × stroom', 'power = voltage × current'), 21, 'start', 'mf-on')
      + txt(232, 334, tr('watt (W); 1.000 W = 1 kW', 'watts (W); 1,000 W = 1 kW'), 20, 'start', 'mf-mute'))
      + op(b, txt(232, 368, `${grp(C.KETTLE)} W ÷ ${C.U} V ≈ ${dec(C.KETTLE / C.U, 1)} A`, 22, 'start', 'mf-big'));
  }

  // ------------------------------------------------------------ s2: the kettle's power and energy
  function meterBase() {
    return PANEL() + tag(EX) + rect(216, 56, 196, 200, 'mf-tile', 8) + rect(424, 56, 196, 200, 'mf-tile', 8);
  }
  function kwTile(v) {
    const cx = 314;
    const cy = 206;
    const r = 60;
    let out = txt(232, 92, 'kW', 26, 'start', 'mf-big') + txt(232, 120, tr('vermogen, nu', 'power, now'), 20, 'start', 'mf-mute');
    const arc = (a0, a1, rr) => `M${f1(cx + rr * Math.cos(a0))} ${f1(cy + rr * Math.sin(a0))}A${rr} ${rr} 0 0 1 ${f1(cx + rr * Math.cos(a1))} ${f1(cy + rr * Math.sin(a1))}`;
    out += `<path class="mf-axis" d="${arc(Math.PI, 2 * Math.PI, r)}"/>`;
    for (let i = 0; i <= 6; i++) { const a = Math.PI + (i / 6) * Math.PI; out += line(cx + (r - 8) * Math.cos(a), cy + (r - 8) * Math.sin(a), cx + r * Math.cos(a), cy + r * Math.sin(a)); }
    out += txt(cx - r, cy + 26, '0', 20, 'middle', 'mf-mute') + txt(cx + r, cy + 26, '3', 20, 'middle', 'mf-mute');
    const a = Math.PI + clamp(v / 3, 0, 1) * Math.PI;
    out += line(cx, cy, cx + (r - 12) * Math.cos(a), cy + (r - 12) * Math.sin(a), 'mf-accl') + dot(cx, cy, 5);
    out += txt(cx, cy + 44, `${dec(v, 1)} kW`, 21, 'middle', 'mf-mono');
    return out;
  }
  function kwhTile(min) {
    const e = (2 * min) / 60;
    return txt(440, 92, 'kWh', 26, 'start', 'mf-big') + txt(440, 120, tr('energie, opgeteld', 'energy, added up'), 20, 'start', 'mf-mute')
      + rect(446, 144, 152, 52, 'mf-panel', 6) + txt(586, 182, dec(e, 3), 30, 'end', 'mf-mono')
      + txt(522, 232, tr(`${dec(min, 1)} min`, `${dec(min, 1)} min`), 21, 'middle', 'mf-txt');
  }
  function meterYear(a1, a2) {
    return op(a1, txt(222, 296, tr('per jaar zo’n 2.700 kWh', 'about 2,700 kWh a year'), 21, 'start', 'mf-txt')
      + txt(222, 326, `${tr('2.700 ÷ 8.760 uur', '2,700 ÷ 8,760 h')} ≈ ${dec(C.AVG, 2)} kW`, 22, 'start', 'mf-on'))
      + op(a2, txt(222, 362, tr('rekening: kWh; net: hoogste kW', 'bill: kWh; grid: highest kW'), 20, 'start', 'mf-mute'));
  }

  // ------------------------------------------------------------ s3: alternating current and three phases
  const WX0 = 262;
  const WX1 = 612;
  const WY = 130;
  const WA = 56;
  const wave = (k, x) => WY - WA * Math.sin(2 * Math.PI * 2 * (x - WX0) / (WX1 - WX0) - k * 2 * Math.PI / 3);
  const WCLS = ['mf-line', 'mf-l2', 'mf-l3'];
  function wavesBase() {
    return PANEL() + tag(tr('schema', 'diagram')) + line(WX0, WY, WX1, WY, 'mf-grid') + line(WX0, WY - WA - 12, WX0, WY + WA + 12, 'mf-axis') + txt(WX0 - 10, WY + 7, '0', 20, 'end', 'mf-mute');
  }
  function wavePath(k, pr) {
    const pts = [];
    for (let x = WX0; x <= lerp(WX0, WX1, pr) + 1e-9; x += 3) pts.push([x, wave(k, x)]);
    return `<path class="${WCLS[k]}" d="${fmt(pts)}"/>`;
  }
  function waveOne(pr, hz) {
    if (pr <= 0.01) return '';
    return wavePath(0, pr) + op(hz, txt(222, 44, tr('50 Hz: 50 keer per seconde', '50 Hz: 50 times a second'), 20, 'start', 'mf-txt'));
  }
  // three phases, and a section through the four-core street cable
  function waveThree(pr, sec) {
    let out = '';
    if (pr > 0.01) {
      out += wavePath(1, pr) + wavePath(2, pr);
      [0, 1, 2].forEach((k) => { out += op(pr, `<path class="${WCLS[k]}" d="M${236 + k * 120} 222L${268 + k * 120} 222"/>` + txt(276 + k * 120, 229, `L${k + 1}`, 20, 'start', 'mf-txt')); });
    }
    if (sec > 0.01) {
      const cx = 290;
      const cy = 312;
      let s = `<circle class="mf-tile" cx="${cx}" cy="${cy}" r="50"/><circle class="mf-panel" cx="${cx}" cy="${cy}" r="44"/>`;
      ['L1', 'L2', 'L3', 'N'].forEach((n, i) => {
        const a = -Math.PI / 4 + (i * Math.PI) / 2;
        const x = cx + 22 * Math.cos(a);
        const y = cy + 22 * Math.sin(a);
        s += `<circle class="${i < 3 ? 'mf-hollow' : 'mf-tile'}" cx="${f1(x)}" cy="${f1(y)}" r="16"/>` + txt(x, y + 7, n, 20, 'middle', 'mf-mono');
      });
      out += op(sec, s + txt(cx + 58, 372, tr('doorsnede kabel', 'cable section'), 20, 'start', 'mf-mute'));
    }
    return out;
  }
  function wavesTxt(tf, v) {
    return op(tf, txt(222, 262, tr('transformator: omhoog of omlaag', 'transformer: up or down'), 20, 'start', 'mf-txt'))
      + op(v, txt(360, 300, tr(`${C.U} V fase–nul`, `${C.U} V phase–neutral`), 21, 'start', 'mf-txt') + txt(360, 334, tr(`${C.ULL} V fase–fase`, `${C.ULL} V phase–phase`), 21, 'start', 'mf-txt'));
  }

  // ------------------------------------------------------------ s4: one home, one day
  const DX0 = 252;
  const DX1 = 584;
  const DB = 352;
  const DK = 10.6; // px per kW
  const hx = (h) => DX0 + ((DX1 - DX0) * h) / 24;
  const ky = (v) => DB - v * DK;
  // a day's demand, kW: low at night, a breakfast bump, the evening cooking around 18:00
  const homeKw = (h) => 0.18 + 0.5 * Math.exp(-(((h - 7.5) / 0.8) ** 2)) + 0.25 * Math.exp(-(((h - 13) / 2.5) ** 2)) + 0.7 * Math.exp(-(((h - 18.6) / 1.6) ** 2));
  function dayBase() {
    let out = PANEL() + tag(EX, 620, 128) + line(DX0, DB, DX1, DB) + line(DX0, DB, DX0, ky(19.5));
    for (const h of [0, 6, 12, 18, 24]) out += line(hx(h), DB, hx(h), DB + 6) + txt(hx(h), DB + 26, `${h}`, 20, 'middle', 'mf-mute');
    out += txt(DX1 + 8, DB + 7, tr('uur', 'h'), 20, 'start', 'mf-mute');
    for (const v of [5, 10, 15]) out += line(DX0 - 6, ky(v), DX0, ky(v)) + txt(DX0 - 10, ky(v) + 7, `${v}`, 20, 'end', 'mf-mute');
    return out;
  }
  function dayConn(a, lit) {
    return op(a, rect(216, 22, 300, 74, lit ? 'mf-accf' : 'mf-tile', 6)
      + rect(230, 40, 16, 38, 'mf-panel', 3) + line(238, 46, 238, 72, 'mf-line')
      + txt(260, 54, tr('3 × 25 A aansluiting', '3 × 25 A connection'), 20, 'start', 'mf-txt') + txt(260, 82, `≈ ${Math.round(C.CONN)} kVA ${tr('maximaal', 'at most')}`, 21, 'start', 'mf-big'))
      + op(a, `<path class="mf-dash" d="M${DX0} ${f1(ky(C.CONN))}L${DX1} ${f1(ky(C.CONN))}"/>` + txt(DX0 + 8, ky(C.CONN) - 8, `${Math.round(C.CONN)} kVA`, 20, 'start', 'mf-on'));
  }
  function dayCurve(draw, avg, peak, car) {
    let out = '';
    if (draw > 0.01) {
      const pts = [];
      for (let h = 0; h <= 24 * draw + 1e-9; h += 0.25) pts.push([hx(h), ky(homeKw(h))]);
      out += `<path class="mf-line" d="${fmt(pts)}"/>`;
    }
    out += op(avg, line(DX0, ky(C.AVG), DX1, ky(C.AVG), 'mf-l2') + line(222, 122, 252, 122, 'mf-l2') + txt(260, 129, tr(`jaargemiddelde ${dec(C.AVG, 2)} kW`, `yearly average ${dec(C.AVG, 2)} kW`), 20, 'start', 'mf-txt'));
    // the 18:00 stack: oven, kettle, dishwasher, then the car
    const x = hx(18) - 14;
    const parts = [[3, tr('oven', 'oven')], [2, tr('waterkoker', 'kettle')], [2, tr('vaatwasser', 'dishwasher')]];
    let base = 0;
    parts.forEach(([v, name], i) => {
      const a = clamp(peak * 3 - i, 0, 1);
      if (a <= 0.01) { base += v; return; }
      out += `<rect class="fp-meter"${i % 2 ? ' data-alt=""' : ''} x="${f1(x)}" y="${f1(ky(base + v * a))}" width="28" height="${f1(v * a * DK)}" rx="2"/>`;
      out += op(a, txt(x - 8, DB - 8 - 24 * i, `${name} ${v}`, 20, 'end', 'mf-txt'));
      base += v;
    });
    if (peak > 0.99) out += txt(x + 36, ky(7) + 8, `${C.PEAK_HOME} kW`, 21, 'start', 'mf-big');
    if (car > 0.01) {
      out += `<rect class="fp-meter" data-top="" x="${f1(x)}" y="${f1(ky(7 + C.EV * car))}" width="28" height="${f1(C.EV * car * DK)}" rx="2"/>`;
      out += op(car, txt(x - 8, ky(12.5) + 7, tr(`auto ${C.EV}`, `car ${C.EV}`), 20, 'end', 'mf-txt') + txt(x + 14, ky(18) - 12, `${C.PEAK_HOME + C.EV} kW`, 22, 'middle', 'mf-on'));
    }
    return out;
  }

  // ------------------------------------------------------------ s5: 150 homes on one netstation
  const HC = 15;
  const HR = 10;
  const homeAt = (i) => [236 + (i % HC) * 25.4, 40 + Math.floor(i / HC) * 19];
  const seed = (i) => { const s = Math.sin(i * 12.9898) * 43758.5453; return s - Math.floor(s); };
  const icon = (x, y, cls) => `<path class="${cls}" d="M${f1(x)} ${f1(y + 6)}L${f1(x + 8)} ${f1(y)}L${f1(x + 16)} ${f1(y + 6)}L${f1(x + 16)} ${f1(y + 14)}L${f1(x)} ${f1(y + 14)}Z"/>`;
  let HOMES0 = '';
  for (let i = 0; i < C.HOMES; i++) { const [x, y] = homeAt(i); HOMES0 += icon(x, y, 'mf-home'); }
  function gridBase() { return PANEL() + tag(tr('schema', 'diagram'), 620, 252); }
  function gridHomes(a, clockS, sim) {
    let out = op(a, HOMES0);
    if (sim > 0.01) {
      let lit = '';
      for (let i = 0; i < C.HOMES; i++) {
        const v = Math.sin(clockS * (0.9 + seed(i) * 0.8) + seed(i + 99) * 40);
        if (v > 0.8) { const [x, y] = homeAt(i); lit += icon(x, y, 'mf-homeOn'); }
      }
      out += op(sim, lit);
    }
    return out;
  }
  // the netstation's load over a winter day, its peak in the evening
  const stationKw = (h) => 0.35 + 0.25 * Math.exp(-(((h - 8) / 1.5) ** 2)) + 0.2 * Math.exp(-(((h - 13) / 3) ** 2)) + 0.65 * Math.exp(-(((h - 18.6) / 1.9) ** 2));
  function gridPeak(a) {
    if (a <= 0.01) return '';
    const x0 = 236;
    const x1 = 600;
    const y0 = 360;
    const pts = [];
    for (let h = 0; h <= 24; h += 0.25) pts.push([x0 + ((x1 - x0) * h) / 24, y0 - stationKw(h) * 92]);
    let mx = pts[0];
    for (const pnt of pts) if (pnt[1] < mx[1]) mx = pnt;
    return op(a, line(x0, y0, x1, y0) + `<path class="mf-line" d="${fmt(pts)}"/>` + dot(mx[0], mx[1], 5, 'mf-acc')
      + txt(mx[0] - 12, mx[1] - 12, tr('piek: winteravond', 'peak: winter evening'), 20, 'end', 'mf-on'));
  }
  function gridSum(a) {
    if (a <= 0.01) return '';
    const x0 = 236;
    const w = 360;
    const f = C.OLD / C.S_TR;
    return op(a, txt(x0, 286, `${C.HOMES} × ${dec(C.PER_HOME, 1)} kVA = ${C.OLD} kVA`, 22, 'start', 'mf-big')
      + rect(x0, 306, w, 26, 'mf-tile', 4) + `<rect class="fp-meter" data-top="" x="${x0}" y="306" width="${f1(w * f * a)}" height="26" rx="4"/>`
      + txt(x0 + w * f + 10, 327, `${Math.round(f * 100)}%`, 21, 'start', 'mf-on') + txt(x0 + w, 360, `${tr('van', 'of')} ${C.S_TR} kVA`, 20, 'end', 'mf-mute'));
  }

  // ------------------------------------------------------------ s6: kVA and kW, the power factor
  const PO = [248, 292];
  const LH = 260;
  function pfBase() { return PANEL() + tag(tr('schema', 'diagram')); }
  function pfIn(grow) {
    if (grow <= 0.01) return '';
    const pf = 0.9;
    const act = LH * pf * grow;
    const rea = LH * Math.sqrt(1 - pf * pf) * grow * 1.3; // the reactive side drawn larger, so it can be seen
    const A = [PO[0] + act, PO[1]];
    const B = [PO[0] + act, PO[1] - rea];
    return line(PO[0], PO[1], A[0], A[1], 'mf-line') + line(A[0], A[1], B[0], B[1], 'mf-l2') + line(PO[0], PO[1], B[0], B[1], 'mf-line')
      + op(grow, txt((PO[0] + A[0]) / 2, PO[1] + 30, tr('kW: nuttig', 'kW: useful'), 21, 'middle', 'mf-txt')
        + txt(A[0] + 10, (A[1] + B[1]) / 2 + 7, tr('heen en weer', 'back and forth'), 20, 'start', 'mf-mute')
        + txt((PO[0] + B[0]) / 2 - 16, (PO[1] + B[1]) / 2 - 18, tr('kVA: alles', 'kVA: all'), 21, 'end', 'mf-txt'));
  }
  function pfSum(a1, a2) {
    return op(a1, txt(222, 58, tr('cos φ = kW ÷ kVA', 'cos φ = kW ÷ kVA'), 22, 'start', 'mf-on') + txt(222, 88, tr('woningen: 0,9 tot 1', 'homes: 0.9 to 1'), 20, 'start', 'mf-txt'))
      + op(a2, txt(222, 362, tr('400 kVA → zo’n 360 tot 400 kW', '400 kVA → about 360 to 400 kW'), 22, 'start', 'mf-big'));
  }

  // ------------------------------------------------------------ s7: the winter evening stack
  const SB = 352;
  const SK = 0.62; // px per kVA
  const SX = 290; // a narrower card, so the street (heat pump, car) stays large at 390 px
  function stackBase() {
    return PANEL(270) + tag(EX) + line(282, SB, 612, SB)
      + `<path class="mf-dash" d="M282 ${f1(SB - C.S_TR * SK)}L612 ${f1(SB - C.S_TR * SK)}"/>` + txt(612, SB - C.S_TR * SK + 26, tr(`transformator ${C.S_TR} kVA`, `transformer ${C.S_TR} kVA`), 20, 'end', 'mf-on');
  }
  function stackBars(hp, ev) {
    let out = `<rect class="fp-meter" data-alt="" x="${SX}" y="${f1(SB - C.OLD * SK)}" width="74" height="${f1(C.OLD * SK)}" rx="3"/>`;
    out += txt(SX + 86, SB - (C.OLD * SK) / 2 + 7, tr(`oude piek ${C.OLD}`, `old peak ${C.OLD}`), 20, 'start', 'mf-txt');
    let base = C.OLD;
    if (hp > 0.01) {
      out += `<rect class="fp-meter" x="${SX}" y="${f1(SB - (base + C.HP * hp) * SK)}" width="74" height="${f1(C.HP * hp * SK)}" rx="3"/>`;
      out += op(hp, txt(SX + 86, SB - (base + C.HP / 2) * SK + 7, tr(`+ warmtepompen ${C.HP}`, `+ heat pumps ${C.HP}`), 20, 'start', 'mf-txt'));
    }
    base += C.HP;
    if (ev > 0.01) {
      out += `<rect class="fp-meter" data-top="" x="${SX}" y="${f1(SB - (base + C.CARS * ev) * SK)}" width="74" height="${f1(C.CARS * ev * SK)}" rx="3"/>`;
      out += op(ev, txt(SX + 86, SB - (base + C.CARS * 0.78) * SK + 7, tr(`+ auto’s ${C.CARS}`, `+ cars ${C.CARS}`), 20, 'start', 'mf-txt'));
    }
    return out;
  }
  function stackSum(a, y) {
    return op(a, txt(SX, SB - C.NEW * SK - 12, `${C.NEW} kVA · ${Math.round((C.NEW / C.S_TR) * 100)}%`, 22, 'start', 'mf-on'))
      + op(y, txt(612, 380, tr('piek: meer dan 2 ×', 'peak: more than 2 ×'), 20, 'end', 'mf-txt'));
  }

  // ------------------------------------------------------------ s8: the voltage along the cable at noon
  const VX0 = 262;
  const VX1 = 600;
  const VB = 350;
  const vy = (v) => VB - (v - 222) * 5.6;
  function voltBase() {
    let out = PANEL() + tag(EX) + line(VX0, VB, VX1, VB) + line(VX0, VB, VX0, vy(260));
    out += line(VX0, vy(230), VX1, vy(230), 'mf-grid') + txt(VX0 - 8, vy(230) + 7, '230', 20, 'end', 'mf-mute');
    out += `<path class="mf-dash" d="M${VX0} ${f1(vy(253))}L${VX1} ${f1(vy(253))}"/>` + txt(VX0 - 8, vy(253) + 7, '253', 20, 'end', 'mf-on');
    out += txt(VX0, VB + 26, tr('netstation', 'distribution substation'), 20, 'start', 'mf-mute') + txt(VX1, VB + 26, tr('eind kabel', 'cable end'), 20, 'end', 'mf-mute');
    return out;
  }
  function sun(a, clockS) {
    if (a <= 0.01) return '';
    const cx = 252;
    const cy = 66;
    let out = `<circle class="mf-accf" cx="${cx}" cy="${cy}" r="16"/>`;
    for (let i = 0; i < 8; i++) { const t = (i * Math.PI) / 4 + clockS * 0.2; out += line(cx + 22 * Math.cos(t), cy + 22 * Math.sin(t), cx + 30 * Math.cos(t), cy + 30 * Math.sin(t), 'mf-accl'); }
    return op(a, out + txt(296, 60, tr('alle daken leveren terug', 'every roof feeds back'), 20, 'start', 'mf-txt'));
  }
  function inverter(a) {
    return op(a, rect(330, 74, 160, 40, 'mf-tile', 6) + txt(410, 101, tr('omvormer', 'inverter'), 20, 'middle', 'mf-txt')
      + txt(320, 101, 'DC', 20, 'end', 'mf-mono') + txt(500, 101, 'AC', 20, 'start', 'mf-mono'));
  }
  function voltLines(rise, cut) {
    let out = '';
    const pts = [];
    const pts0 = [];
    for (let x = VX0; x <= VX1 + 1e-9; x += 6) {
      const f = (x - VX0) / (VX1 - VX0);
      pts0.push([x, vy(231 - 6 * f * (2 - f))]);
      let v = 232 + 26 * rise * f * (2 - f);
      if (cut > 0.5 && v > 253) v = 253 - (v - 253) * 0.2 * cut;
      pts.push([x, vy(v)]);
    }
    out += `<path class="mf-l2" d="${fmt(pts0)}"/>` + txt(VX0 + 8, vy(224.5), tr('avond, afname', 'evening, demand'), 20, 'start', 'mf-mute');
    if (rise > 0.01) out += `<path class="mf-line" style="stroke:var(--fp-accent)" d="${fmt(pts)}"/>` + op(rise, txt(VX1, vy(241), tr('middag, teruglevering', 'midday, feed-in'), 20, 'end', 'mf-on'));
    if (cut > 0.01) out += op(cut, txt(VX1, vy(258) - 4, tr('omvormer uit', 'inverter off'), 21, 'end', 'mf-big'));
    return out;
  }

  // ------------------------------------------------------------ s9: smart charging
  const MX0 = 252;
  const MX1 = 608;
  const MB = 352;
  const mh = (h) => MX0 + ((MX1 - MX0) * (h - 16)) / 16; // 16:00 to 08:00
  const raw = (h) => 1.0 * Math.exp(-(((h - 19) / 1.4) ** 2));
  const smart = (h) => (h > 21 && h < 30 ? 0.3 * Math.min(1, (h - 21) / 0.8, (30 - h) / 0.8) : 0) + 0.12 * Math.exp(-(((h - 18) / 0.8) ** 2));
  function smartBase() {
    let out = PANEL() + tag(EX) + line(MX0, MB, MX1, MB);
    for (const [h, t] of [[16, '16'], [20, '20'], [24, '0'], [28, '4'], [32, '8']]) out += line(mh(h), MB, mh(h), MB + 6) + txt(mh(h), MB + 26, t, 20, 'middle', 'mf-mute');
    return out;
  }
  function smartScale(a, b) {
    return op(a, rect(222, 56, 392, 12, 'mf-tile', 6) + txt(222, 46, tr('gelijktijdigheid?', 'simultaneity?'), 21, 'start', 'mf-on')
      + dot(418, 62, 9, 'mf-acc'))
      + op(b, txt(222, 96, tr('te laag: overbelast', 'too low: overloaded'), 20, 'start', 'mf-txt') + txt(614, 124, tr('te hoog: te vroeg open', 'too high: dug up early'), 20, 'end', 'mf-txt'));
  }
  function smartCurves(a, s) {
    let out = '';
    if (a > 0.01) {
      const pts = [];
      for (let h = 16; h <= 32; h += 0.2) pts.push([mh(h), MB - raw(h) * 150]);
      out += op(a, `<path class="mf-l2" d="${fmt(pts)}"/>` + txt(mh(19) + 20, MB - 136, tr('zonder sturing', 'unmanaged'), 20, 'start', 'mf-txt'));
    }
    if (s > 0.01) {
      const pts = [];
      for (let h = 16; h <= 16 + 16 * s + 1e-9; h += 0.2) pts.push([mh(h), MB - smart(h) * 150]);
      out += `<path class="mf-line" style="stroke:var(--fp-accent)" d="${fmt(pts)}"/>` + op(s, txt(mh(26), MB - 62, tr('slim laden', 'smart charging'), 21, 'middle', 'mf-on'));
    }
    return out;
  }
  function smartTxt(a) {
    return op(a, rect(222, 140, 392, 44, 'mf-accf', 6) + txt(418, 169, tr('op welke gelijktijdigheid?', 'which simultaneity?'), 21, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['pipe', 'meter', 'waves', 'day', 'grid', 'pf', 'stack', 'volt', 'smart'];
  set(E.pbBase, pipeBase());
  set(E.mtBase, meterBase());
  set(E.wvBase, wavesBase());
  set(E.dyBase, dayBase());
  set(E.gdBase, gridBase());
  set(E.pfBase, pfBase());
  set(E.skBase, stackBase());
  set(E.vlBase, voltBase());
  set(E.smBase, smartBase());
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let flow = 0;
    let flowDir = 1;

    if (si === 0) {
      vis.pipe = on(b, 1, p, 0, 0.12);
      set(E.pbVolt, gauge(on(b, 1, p, 0.05, 0.3), on(b, 1, p, 0.3, 0.7) * 0.62));
      set(E.pbAmp, turbine(on(b, 2, p, 0.05, 0.3), clockS * 2));
      set(E.pbFlow, flowDash(on(b, 2, p, 0.05, 0.3), clockS));
      set(E.pbWatt, watt(on(b, 3, p, 0.1, 0.4), on(b, 4, p, 0.1, 0.4)));
      flow = on(b, 2, p, 0.05, 0.3);
    } else if (si === 1) {
      vis.meter = span(u, 0, 0.04);
      const min = b === 0 ? 0 : b === 1 ? 3 * span(p, 0.15, 0.85) : 3;
      set(E.mtKw, kwTile(b === 0 ? 0 : 2 * span(b === 1 ? p : 1, 0.05, 0.2)));
      set(E.mtKwh, kwhTile(min));
      set(E.mtYear, meterYear(on(b, 2, p, 0.1, 0.4), on(b, 3, p, 0.1, 0.4)));
    } else if (si === 2) {
      vis.waves = span(u, 0, 0.04);
      set(E.wvOne, waveOne(b === 0 ? span(p, 0.05, 0.7) : 1, on(b, 0, p, 0.6, 0.85)));
      set(E.wvThree, waveThree(on(b, 2, p, 0.05, 0.5), on(b, 2, p, 0.4, 0.7)));
      set(E.wvTxt, wavesTxt(b === 1 ? span(p, 0.05, 0.25) : 0, on(b, 3, p, 0.1, 0.4)));
    } else if (si === 3) {
      vis.day = span(u, 0, 0.04);
      set(E.dyConn, dayConn(b === 0 ? span(p, 0.05, 0.3) : 1, b === 0 || b === 3));
      set(E.dyCurve, dayCurve(on(b, 1, p, 0.05, 0.7), on(b, 1, p, 0.6, 0.9), on(b, 2, p, 0.1, 0.7), on(b, 3, p, 0.1, 0.5)));
    } else if (si === 4) {
      vis.grid = span(u, 0, 0.04);
      set(E.gdHomes, gridHomes(b === 0 ? span(p, 0.1, 0.5) : 1, clockS, on(b, 1, p, 0.05, 0.25)));
      set(E.gdPeak, gridPeak(b === 2 ? span(p, 0.05, 0.3) : 0));
      set(E.gdSum, gridSum(b === 3 ? span(p, 0.1, 0.6) : 0));
    } else if (si === 5) {
      vis.pf = span(u, 0, 0.04);
      set(E.pfIn, pfIn(b === 0 ? span(p, 0.1, 0.6) : 1));
      set(E.pfSum, pfSum(on(b, 1, p, 0.1, 0.4), on(b, 2, p, 0.1, 0.4)));
    } else if (si === 6) {
      vis.stack = span(u, 0, 0.04);
      set(E.skBars, stackBars(b === 0 ? span(p, 0.3, 0.7) : 1, on(b, 1, p, 0.3, 0.7)));
      set(E.skSum, stackSum(on(b, 2, p, 0.2, 0.5), on(b, 3, p, 0.2, 0.5)));
    } else if (si === 7) {
      vis.volt = span(u, 0, 0.04);
      set(E.vlTxt, sun(b === 0 ? span(p, 0.05, 0.3) : 1, clockS) + inverter(on(b, 1, p, 0.05, 0.3)));
      set(E.vlLines, voltLines(on(b, 2, p, 0.1, 0.8), on(b, 3, p, 0.3, 0.6)));
      flow = on(b, 0, p, 0.1, 0.4);
      flowDir = -1;
    } else if (si === 8) {
      vis.smart = span(u, 0, 0.04);
      set(E.smTxt, smartScale(b === 0 ? span(p, 0.05, 0.3) : 1, on(b, 1, p, 0.1, 0.4)) + smartTxt(on(b, 3, p, 0.1, 0.4)));
      set(E.smCurves, smartCurves(on(b, 1, p, 0.6, 0.9), on(b, 2, p, 0.05, 0.8)));
    }

    // the current along the street cable: dashes running away from the netstation (back toward it at noon)
    E.flow.style.opacity = flow > 0.01 ? flow.toFixed(2) : '0';
    E.flow.style.strokeDashoffset = f1(-clockS * 9 * flowDir);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
