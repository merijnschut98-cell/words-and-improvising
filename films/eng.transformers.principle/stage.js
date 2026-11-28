// The stage of the film "Hoe een transformator werkt / How a transformer works":
// a pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope) and a preamble from build.mjs that defines P
// (projection), C (the model's data), CAM (one camera move per scene), W and H.
// Moves are placed per caption beat (beatStarts), so the video's narration
// timing (films/_kit/beatwarp.js) keeps them in step.
/* global C, CAM, W, H, span, beatStarts */
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
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1, cls = 'mf-axis') => {
    const a = Math.atan2(y1 - y0, x1 - x0);
    const h = (s) => [x1 - 9 * Math.cos(a + s), y1 - 9 * Math.sin(a + s)];
    return line(x0, y0, x1, y1, cls) + `<path class="${cls}" d="${fmt([h(0.5), [x1, y1], h(-0.5)])}"/>`;
  };
  const EX = tr('voorbeeld', 'example');
  const SCH = tr('schema', 'diagram');
  const tag = (t, x = 620, y = 40, anchor = 'end') => txt(x, y, t, 20, anchor, 'mf-mute');
  const PANEL = (x0 = 204) => rect(x0, 12, 632 - x0, 376);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);
  // a coil drawn across a vertical leg: n turns between y0 and y1
  const coil = (x0, x1, y0, y1, n, cls = 'mf-coil') => {
    let d = '';
    for (let i = 0; i < n; i++) { const y = y0 + ((i + 0.5) * (y1 - y0)) / n; d += `M${f1(x0)} ${f1(y + 3)}L${f1(x1)} ${f1(y - 3)}`; }
    return `<path class="${cls}" d="${d}"/>`;
  };

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

  // ------------------------------------------------------------ s1: in, out
  function ioCard(a, b) {
    return op(a, rect(16, 262, 290, 80, 'mf-panel', 8)
      + txt(30, 294, tr('in', 'in'), 20, 'start', 'mf-mute') + txt(76, 294, '10 kV', 22, 'start', 'mf-big') + txt(166, 294, tr('midden', 'medium'), 20, 'start', 'mf-mute')
      + txt(30, 328, tr('uit', 'out'), 20, 'start', 'mf-mute') + txt(76, 328, '400 V', 22, 'start', 'mf-big') + txt(166, 328, tr('laag', 'low'), 20, 'start', 'mf-mute'))
      + op(b, rect(16, 348, 290, 40, 'mf-accf', 8) + txt(161, 375, tr('er draait niets', 'nothing turns'), 21, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ s2: the chain
  function chainBase() {
    return rect(420, 12, 212, 376) + tag(SCH);
  }
  function chainIn(a1, a2, a3, clockS) {
    let out = '';
    const tile = (y, a, t1, t2, extra = '') => op(a, rect(432, y, 188, 92, 'mf-tile', 8) + txt(446, y + 34, t1, 21, 'start', 'mf-txt') + txt(446, y + 64, t2, 20, 'start', 'mf-mute') + extra);
    const sine = (() => {
      const pts = [];
      for (let x = 0; x <= 36; x += 2) pts.push([576 + x, 120 + 8 * Math.sin((x / 36) * 4 * Math.PI - clockS * 3)]);
      return `<path class="mf-accl" d="${fmt(pts)}"/>`;
    })();
    out += tile(56, a1, tr('wisselstroom', 'AC current'), tr('1e wikkeling', '1st winding'), sine);
    out += op(a2, arrow(526, 152, 526, 170, 'mf-accl'));
    out += tile(176, a2, tr('wisselend veld', 'changing field'), tr('in de kern', 'in the core'));
    out += op(a3, arrow(526, 272, 526, 290, 'mf-accl'));
    out += tile(296, a3, tr('spanning', 'voltage'), tr('2e wikkeling', '2nd winding'));
    return out;
  }

  // ------------------------------------------------------------ s3: the turns ratio
  const RC = { x0: 244, x1: 408, y0: 64, y1: 196, t: 28 };
  function ratioBase() {
    const { x0, x1, y0, y1, t } = RC;
    return PANEL() + tag(SCH)
      + `<path class="mf-iron" d="M${x0} ${y0}H${x1}V${y1}H${x0}Z M${x0 + t} ${y0 + t}V${y1 - t}H${x1 - t}V${y0 + t}Z" fill-rule="evenodd"/>`
      + txt((x0 + x1) / 2, y0 + t + 26, tr('kern', 'core'), 20, 'middle', 'mf-mute');
  }
  function ratioCoils(clockS, flux) {
    const { x0, x1, y0, y1, t } = RC;
    const loop = [[x0 + t / 2, y0 + t / 2], [x1 - t / 2, y0 + t / 2], [x1 - t / 2, y1 - t / 2], [x0 + t / 2, y1 - t / 2]];
    const fl = flux > 0.01 ? `<path class="mf-dash" style="stroke-dashoffset:${f1(Math.sin(clockS * 1.6) * 18)};opacity:${flux.toFixed(2)}" d="${fmt(loop)}Z"/>` : '';
    return fl + coil(x0 - 8, x0 + t + 8, y0 + t + 4, y1 - t - 4, 12) + coil(x1 - t - 8, x1 + 8, y0 + t + 24, y1 - t - 24, 3)
      + txt(x0 + t / 2, y0 - 12, 'N1', 21, 'middle', 'mf-mono') + txt(x1 - t / 2, y0 - 12, 'N2', 21, 'middle', 'mf-mono');
  }
  function ratioEq(a, b) {
    return op(a, txt(226, 312, 'U1 : U2 = N1 : N2', 22, 'start', 'mf-big'))
      + op(b, txt(226, 350, NL ? '10.000 : 400 = 25' : '10,000 : 400 = 25', 22, 'start', 'mf-mono'));
  }
  function ratioTxt(a, b) {
    return op(a, txt(226, 230, tr('veel', 'many'), 20, 'start', 'mf-txt') + txt(226, 258, NL ? '10.000 V' : '10,000 V', 21, 'start', 'mf-mono')
      + txt(426, 230, tr('weinig', 'few'), 20, 'end', 'mf-txt') + txt(426, 258, '400 V', 21, 'end', 'mf-mono'))
      + op(b, rect(440, 64, 182, 116, 'mf-accf', 8) + txt(452, 96, tr('spanning ÷ 25', 'voltage ÷ 25'), 20, 'start', 'mf-on')
        + txt(452, 128, tr('stroom × 25', 'current × 25'), 20, 'start', 'mf-on') + txt(452, 160, tr('vermogen ≈', 'power ≈'), 20, 'start', 'mf-txt'));
  }

  // ------------------------------------------------------------ s4: kVA and the currents
  function kvaBase() {
    return PANEL() + tag(EX) + txt(222, 48, tr('kVA = spanning × stroom', 'kVA = voltage × current'), 22, 'start', 'mf-on');
  }
  function kvaSizes(a, lit, sub) {
    let out = '';
    [[250, 0], [400, 1], [630, 2]].forEach(([s, i]) => {
      const side = 7 + Math.sqrt(s) * 2.2;
      const x = 236 + i * 70;
      const y = 140 - side;
      out += rect(x, y, side, side, i === 1 && lit ? 'mf-accf' : 'mf-tile', 4) + txt(x + side / 2, 166, String(s), 20, 'middle', 'mf-mono');
    });
    out += txt(440, 116, 'kVA', 20, 'start', 'mf-mute') + txt(236, 194, tr('netstation', 'secondary substation'), 20, 'start', 'mf-txt');
    return op(a, out) + op(sub, txt(236, 222, tr('onderstation: tientallen MVA', 'substation: tens of MVA'), 20, 'start', 'mf-mute'));
  }
  function kvaCur(f, bars) {
    let out = op(f, line(222, 238, 618, 238, 'mf-grid') + txt(222, 268, tr('stroom =', 'current ='), 20, 'start', 'mf-txt')
      + txt(222, 296, tr('vermogen / (1,73 × spanning)', 'power / (1.73 × voltage)'), 20, 'start', 'mf-mono'));
    if (bars > 0.01) {
      const len = 210 * span(bars, 0, 0.7);
      out += op(bars, txt(222, 330, '400 V', 20, 'start', 'mf-mono') + rect(296, 314, len, 22, 'mf-accf', 4) + txt(618, 330, `≈ ${Math.round(C.I_LV)} A`, 20, 'end', 'mf-big')
        + txt(222, 368, '10 kV', 20, 'start', 'mf-mono') + rect(296, 359, Math.max(2, (len * C.I_MV) / C.I_LV), 6, 'mf-tile', 2) + txt(618, 368, `≈ ${Math.round(C.I_MV)} A`, 20, 'end', 'mf-big'));
    }
    return out;
  }

  // ------------------------------------------------------------ s5: losses against the load
  const LX0 = 262;
  const LX1 = 600;
  const LB = 320;
  const LK = 40; // px per kW
  const lx = (f) => LX0 + (LX1 - LX0) * f;
  const ly = (kw) => LB - kw * LK;
  function lossBase() {
    let out = PANEL() + tag(tr('voorbeeld: 630 kVA', 'example: 630 kVA')) + line(LX0, LB, LX1 + 6, LB) + line(LX0, LB, LX0, ly(5.2));
    for (const [f, t] of [[0, '0'], [0.5, '50'], [1, '100']]) out += line(lx(f), LB, lx(f), LB + 6) + txt(lx(f), LB + 26, t, 20, 'middle', 'mf-mute');
    out += txt(LX1, LB + 54, tr('belasting, %', 'load, %'), 20, 'end', 'mf-mute');
    for (const v of [1, 2, 3, 4, 5]) out += line(LX0 - 6, ly(v), LX0, ly(v)) + txt(LX0 - 10, ly(v) + 7, String(v), 20, 'end', 'mf-mute');
    out += txt(LX0 - 34, ly(5.2) - 10, 'kW', 20, 'start', 'mf-mute');
    return out;
  }
  function lossP0(a) {
    return op(a, line(LX0, ly(C.P0), LX1, ly(C.P0), 'mf-line') + txt(LX1, ly(C.P0) - 10, tr(`nullast ${dec(C.P0, 2)} kW`, `no-load ${dec(C.P0, 2)} kW`), 20, 'end', 'mf-txt'));
  }
  function lossPk(draw, half) {
    let out = '';
    if (draw > 0.01) {
      const pts = [];
      for (let f = 0; f <= draw + 1e-9; f += 0.02) pts.push([lx(f), ly(C.PK * f * f)]);
      out += `<path class="mf-line" d="${fmt(pts)}"/>`;
      out += op(span(draw, 0.85, 1), dot(lx(1), ly(C.PK), 5) + txt(lx(1) - 12, ly(C.PK) + 6, tr(`vollast ${dec(C.PK, 1)} kW`, `full load ${dec(C.PK, 1)} kW`), 20, 'end', 'mf-txt'));
    }
    out += op(half, `<path class="mf-dash" d="M${f1(lx(0.5))} ${LB}V${f1(ly(C.PK / 4))}H${LX0}"/>` + dot(lx(0.5), ly(C.PK / 4), 5, 'mf-acc')
      + txt(lx(0.5) - 8, ly(C.PK / 4) - 12, tr('halve last: ¼', 'half load: ¼'), 20, 'end', 'mf-on'));
    return out;
  }
  function lossTxt(a) {
    return op(a, rect(278, 116, 176, 66, 'mf-accf', 8) + txt(292, 144, tr('rendement', 'efficiency'), 20, 'start', 'mf-txt') + txt(292, 172, `≈ ${Math.round(C.EFF * 100)}%`, 22, 'start', 'mf-big')
      + txt(278, 210, tr('ecodesign: maximum', 'ecodesign: a cap'), 20, 'start', 'mf-mute'));
  }

  // ------------------------------------------------------------ s6: ONAN and the hum
  const TK = { x0: 232, x1: 400, y0: 70, y1: 330 };
  const FIN = { x0: 400, x1: 436 };
  const OIL = [[372, 290], [372, 108], [418, 108], [418, 300], [372, 300]];
  function onanBase() {
    let out = PANEL() + tag(SCH);
    out += rect(TK.x0, TK.y0, TK.x1 - TK.x0, TK.y1 - TK.y0, 'mf-oil', 4);
    let fins = '';
    for (let y = TK.y0 + 30; y < TK.y1 - 24; y += 14) fins += `M${FIN.x0} ${y}H${FIN.x1}`;
    out += `<path class="mf-axis" d="${fins}M${FIN.x0} ${TK.y0 + 26}H${FIN.x1}V${TK.y1 - 26}H${FIN.x0}"/>`;
    out += rect(262, 150, 86, 150, 'mf-iron', 2) + coil(256, 296, 166, 284, 9) + coil(314, 354, 166, 284, 9);
    out += txt(TK.x0 + 10, TK.y0 + 30, tr('olie', 'oil'), 20, 'start', 'mf-mute');
    return out;
  }
  function onanFlow(a, clockS) {
    if (a <= 0.01) return '';
    return op(a, `<path class="mf-accl" style="stroke-dasharray:8 9;stroke-dashoffset:${f1(-clockS * 14)}" d="${fmt(OIL)}"/>`
      + txt(452, 110, tr('warm omhoog', 'warm rises'), 20, 'start', 'mf-on') + txt(452, 282, tr('koel omlaag', 'cool sinks'), 20, 'start', 'mf-on')
      + txt(452, 206, tr('koelribben', 'fins'), 20, 'start', 'mf-txt'));
  }
  function onanHum(a, l, clockS) {
    let out = op(l, rect(448, 132, 120, 42, 'mf-accf', 8) + txt(508, 161, 'ONAN', 22, 'middle', 'mf-big'));
    if (a > 0.01) {
      const pts = [];
      for (let x = 0; x <= 150; x += 3) pts.push([456 + x, 362 + 9 * Math.sin((x / 150) * 6 * Math.PI - clockS * 4)]);
      out += op(a, `<path class="mf-accl" d="${fmt(pts)}"/>` + txt(456, 336, '100 Hz', 21, 'start', 'mf-big'));
    }
    return out;
  }

  // ------------------------------------------------------------ s7: the nameplate
  function plateBase() {
    return PANEL() + tag(EX);
  }
  function plateRows(a, lit) {
    const rows = [['400 kVA', 'mf-mono'], [NL ? '10.000 / 400 V' : '10,000 / 400 V', 'mf-mono'], ['ONAN', 'mf-mono'], ['Dyn5', lit ? 'mf-on' : 'mf-mono']];
    let out = rect(220, 48, 218, 200, 'mf-tile', 6) + txt(236, 80, tr('typeplaatje', 'nameplate'), 20, 'start', 'mf-mute');
    rows.forEach(([t, cls], i) => { out += txt(236, 120 + i * 34, t, 22, 'start', cls); });
    return op(a, out);
  }
  function plateDy(d, y, r) {
    let out = '';
    if (d > 0.01) {
      const P3 = [[546, 56], [602, 150], [490, 150]];
      let s = '';
      for (let i = 0; i < 3; i++) {
        const [ax, ay] = P3[i];
        const [bx, by] = P3[(i + 1) % 3];
        s += line(ax, ay, bx, by, 'mf-line') + dot(ax, ay, 5);
      }
      out += op(d, s + txt(546, 184, tr('D: driehoek, 10 kV', 'D: delta, 10 kV'), 20, 'middle', 'mf-txt'));
    }
    if (y > 0.01) {
      let s = dot(546, 270, 6, 'mf-acc');
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        s += line(546, 270, 546 + 46 * Math.cos(a), 270 + 46 * Math.sin(a), 'mf-line') + dot(546 + 46 * Math.cos(a), 270 + 46 * Math.sin(a), 5);
      }
      out += op(y, s + txt(530, 262, 'N', 20, 'end', 'mf-mono') + txt(546, 350, tr('yn: ster, 230 V', 'yn: star, 230 V'), 20, 'middle', 'mf-txt'));
    }
    out += op(r, rect(220, 272, 218, 96, 'mf-accf', 8) + txt(236, 306, NL ? '10.000 / 230' : '10,000 / 230', 21, 'start', 'mf-mono')
      + txt(236, 344, tr('≈ 43, niet 25', '≈ 43, not 25'), 22, 'start', 'mf-big'));
    return out;
  }

  // ------------------------------------------------------------ s8: the tap changer
  const TAPY = (i) => 140 + i * 30; // positions 1..5 at i = 0..4
  function tapBase() {
    let out = PANEL() + tag(SCH) + coil(232, 272, 60, 340, 24) + line(252, 60, 252, 340, 'mf-axis');
    for (let i = 0; i < 5; i++) out += line(272, TAPY(i), 304, TAPY(i)) + dot(304, TAPY(i), 4) + txt(296, TAPY(i) - 8, String(i + 1), 20, 'end', 'mf-mute');
    out += txt(232, 44, tr('wikkeling met aftakkingen', 'winding with taps'), 20, 'start', 'mf-txt');
    return out;
  }
  function tapSel(pos, a) {
    const y = lerp(TAPY(0), TAPY(4), (pos - 1) / 4);
    return line(372, 240, 310, y, 'mf-accl') + dot(372, 240, 7, 'mf-acc') + dot(310, y, 5, 'mf-acc')
      + op(a, txt(382, 236, tr('± 2,5% per stap', '± 2.5% a step'), 20, 'start', 'mf-txt') + txt(382, 266, tr('alleen spanningsloos', 'only switched off'), 20, 'start', 'mf-on'));
  }
  function tapOltc(a) {
    return op(a, rect(440, 52, 182, 108, 'mf-tile', 8) + txt(452, 82, tr('onderstation', 'substation'), 20, 'start', 'mf-mute')
      + txt(452, 112, tr('regelschakelaar', 'on-load'), 21, 'start', 'mf-txt') + txt(452, 142, tr('onder belasting', 'under load'), 20, 'start', 'mf-txt'));
  }
  function tapFaults(a) {
    const rows = [tr('stand jaren verkeerd', 'tap wrong for years'), tr('overbelasting', 'overload'), tr('vocht in de olie', 'moisture in the oil')];
    let out = txt(330, 302, tr('typische fouten', 'typical failures'), 20, 'start', 'mf-mute');
    rows.forEach((t, i) => { out += dot(338, 324 + i * 24 - 6, 4) + txt(350, 324 + i * 24, t, 20, 'start', 'mf-txt'); });
    return op(a, out);
  }

  // ------------------------------------------------------------ s9: the solar street
  const EX0 = 262;
  const EX1 = 600;
  const EV = (v) => 338 - (v - 228) * 5.1;
  const ex = (f) => EX0 + (EX1 - EX0) * f;
  const vAt = (f, shift) => 240 + 12 * f * (2 - f) - shift;
  function exBase() {
    let out = PANEL() + tag(EX, 620, 40) + line(EX0, 338, EX1, 338) + line(EX0, 338, EX0, EV(257));
    for (const v of [230, 240, 250]) out += line(EX0 - 6, EV(v), EX0, EV(v)) + txt(EX0 - 10, EV(v) + 7, String(v), 20, 'end', 'mf-mute');
    out += txt(EX0, 366, tr('netstation', 'transformer'), 20, 'start', 'mf-mute') + txt(EX1, 366, tr('eind kabel', 'cable end'), 20, 'end', 'mf-mute');
    out += `<path class="mf-dash" d="M${EX0} ${f1(EV(253))}H${EX1}"/>` + txt(EX0 + 8, EV(253) - 10, tr('grens 253 V', 'limit 253 V'), 20, 'start', 'mf-on');
    out += txt(EX0 - 12, EV(257) - 4, 'V', 20, 'end', 'mf-mute');
    return out;
  }
  function exLines(before, after) {
    let out = '';
    const path = (draw, shift, cls) => {
      const pts = [];
      for (let f = 0; f <= draw + 1e-9; f += 0.02) pts.push([ex(f), EV(vAt(f, shift))]);
      return `<path class="${cls}" d="${fmt(pts)}"/>`;
    };
    if (before > 0.01) out += path(before, 0, after > 0.01 ? 'mf-l2' : 'mf-line') + op(span(before, 0.8, 1), dot(ex(1), EV(252), 5) + txt(ex(1) - 12, EV(252) + 24, '252 V', 20, 'end', 'mf-big'));
    if (after > 0.01) out += path(after, 6, 'mf-accl') + op(span(after, 0.8, 1), dot(ex(1), EV(246), 5, 'mf-acc') + txt(ex(1) - 12, EV(246) + 26, '≈ 246 V', 20, 'end', 'mf-on'));
    return out;
  }
  function exTxt(inv, stand, step, off, ask) {
    let out = op(inv, txt(222, 74, tr('omvormers vallen uit', 'inverters drop out'), 20, 'start', 'mf-txt'));
    out += op(stand, txt(440, 74, step > 0.5 ? tr('stand: 1 lager', 'tap: 1 lower') : tr('stand: midden', 'tap: middle'), 20, 'start', step > 0.5 ? 'mf-on' : 'mf-txt'));
    out += op(off, rect(222, 86, 398, 34, 'mf-tile', 6) + txt(232, 109, tr('even spanningsloos: brief vooraf', 'briefly off: letter beforehand'), 20, 'start', 'mf-txt'));
    out += op(ask, rect(222, 126, 398, 38, 'mf-accf', 6) + txt(421, 151, tr('op welke stand staat hij?', 'what tap is it on?'), 21, 'middle', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['io', 'chain', 'ratio', 'kva', 'loss', 'onan', 'plate', 'tapc', 'ex'];
  set(E.chBase, chainBase());
  set(E.raBase, ratioBase());
  set(E.kvBase, kvaBase());
  set(E.lsBase, lossBase());
  set(E.onBase, onanBase());
  set(E.plBase, plateBase());
  set(E.tcBase, tapBase());
  set(E.exBase, exBase());
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let flux = 0;

    if (si === 0) {
      vis.io = b >= 1 ? 1 : 0;
      set(E.ioIn, ioCard(on(b, 1, p, 0.05, 0.25), on(b, 2, p, 0.3, 0.5)));
    } else if (si === 1) {
      vis.chain = span(u, 0, 0.04);
      set(E.chIn, chainIn(on(b, 1, p, 0.02, 0.2), on(b, 1, p, 0.5, 0.7), on(b, 2, p, 0.1, 0.35), clockS));
      flux = on(b, 1, p, 0.4, 0.7);
    } else if (si === 2) {
      vis.ratio = span(u, 0, 0.04);
      set(E.raCoils, ratioCoils(clockS, 1));
      set(E.raEq, ratioEq(on(b, 0, p, 0.4, 0.7), on(b, 1, p, 0.2, 0.5)));
      set(E.raTxt, ratioTxt(on(b, 0, p, 0.1, 0.4), on(b, 2, p, 0.1, 0.4)));
      flux = 0.6;
    } else if (si === 3) {
      vis.kva = span(u, 0, 0.04);
      set(E.kvSizes, kvaSizes(on(b, 1, p, 0.05, 0.3), b >= 1, on(b, 1, p, 0.6, 0.8)));
      set(E.kvCur, kvaCur(on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.05, 0.6)));
    } else if (si === 4) {
      vis.loss = span(u, 0, 0.04);
      set(E.lsP0, lossP0(b === 0 ? span(p, 0.1, 0.4) : 1));
      set(E.lsPk, lossPk(on(b, 1, p, 0.1, 0.8), on(b, 2, p, 0.05, 0.3)));
      set(E.lsTxt, lossTxt(on(b, 3, p, 0.05, 0.3)));
    } else if (si === 5) {
      vis.onan = span(u, 0, 0.04);
      set(E.onFlow, onanFlow(on(b, 1, p, 0.05, 0.3), clockS));
      set(E.onHum, onanHum(on(b, 3, p, 0.05, 0.3), on(b, 1, p, 0.6, 0.85), clockS));
    } else if (si === 6) {
      vis.plate = span(u, 0, 0.04);
      set(E.plRows, plateRows(b === 0 ? span(p, 0.05, 0.3) : 1, b >= 0 && span(b === 0 ? p : 1, 0.6, 0.8) > 0.5));
      set(E.plDy, plateDy(on(b, 1, p, 0.05, 0.35), on(b, 2, p, 0.05, 0.35), on(b, 3, p, 0.05, 0.3)));
    } else if (si === 7) {
      vis.tapc = span(u, 0, 0.04);
      // the selector visits the taps once while they are named, then rests in the middle
      const pos = b === 0 ? 3 - span(p, 0.4, 0.6) + 2 * span(p, 0.7, 0.9) - span(p, 0.92, 1) : 3;
      set(E.tcSel, tapSel(pos, on(b, 1, p, 0.05, 0.3)));
      set(E.tcOltc, tapOltc(on(b, 2, p, 0.05, 0.3)));
      set(E.tcFaults, tapFaults(on(b, 3, p, 0.05, 0.3)));
    } else if (si === 8) {
      vis.ex = span(u, 0, 0.04);
      set(E.exLines, exLines(b === 0 ? span(p, 0.2, 0.8) : 1, on(b, 2, p, 0.2, 0.8)));
      set(E.exTxt, exTxt(on(b, 1, p, 0.05, 0.3), on(b, 1, p, 0.5, 0.7), on(b, 2, p, 0.1, 0.2), on(b, 3, p, 0.05, 0.3), on(b, 4, p, 0.05, 0.3)));
    }

    // the field in the core: dashes running back and forth, as an alternating field does
    const fo = flux > 0.01 ? flux.toFixed(2) : '0';
    const off = f1(Math.sin(clockS * 1.6) * 18);
    for (const e of [E.fluxA, E.fluxB]) {
      if (e.style.opacity !== fo) e.style.opacity = fo;
      e.style.strokeDashoffset = e === E.fluxA ? off : f1(-Number(off));
    }
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
