// The stage of the film "Een ring die zichzelf herstelt / A self-healing ring":
// a pure function of (scene, u). Inlined into the page after the anatomy kit
// and a preamble from build.mjs that defines P (projection), C (world constants
// and the model's data), CAM (one camera move per scene), W and H. Moves are
// placed per caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The cards' fixed parts are drawn
// once at load.
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
  const setD = (e, d) => { if (e.__d !== d) { e.setAttribute('d', d); e.__d = d; } };
  const lit = (e, on) => { if (e && e.hasAttribute('data-lit') !== on) e.toggleAttribute('data-lit', on); };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const grp = (v) => { const s = String(Math.round(v)); return s.length >= 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',') : s; };
  const txt = (x, y, t, size = 20, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const tick = (x, y, cls = 'mf-accl') => `<path class="${cls}" d="M${f1(x - 9)} ${f1(y - 6)}l7 8l14 -16"/>`;
  const SCH = tr('schema, voorbeeld', 'diagram, example');
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);
  const at01 = (b, i, p, t) => b > i || (b === i && p >= t);

  const fracs = (si) => { const sc = D.scenes[si]; return beatStarts(sc, 'nl').map((x) => x / sc.dur); };
  function beatOf(si, u) {
    const fr = fracs(si);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }

  let scale = 1;
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    scale = W / lerp(c.from[2], c.to[2], k);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${scale.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the RMU's mimic blades (as in eng.switchgear.devices)
  const M = C.MIMIC;
  function blades(sw) {
    C.blades.forEach(({ cx, ex }, i) => {
      const a = lerp(0.62, 0, sw[i]);
      const L1 = M.top - M.piv;
      setD(E[`sw${i}`], `M${f1(cx)} ${f1(-M.piv)}L${f1(cx - L1 * Math.sin(a))} ${f1(-(M.piv + L1 * Math.cos(a)))}`);
      const L2 = M.tee - (M.ep - 3);
      setD(E[`ea${i}`], `M${f1(ex)} ${f1(-(M.ep - 3))}L${f1(ex - L2 * Math.sin(0.62))} ${f1(-(M.ep - 3 + L2 * Math.cos(0.62)))}`);
    });
  }
  // radio waves round the antenna tip: three arcs each side, growing outward (screen size kept fixed)
  function waves(a, clockS, broken) {
    if (a <= 0.01) return '';
    let d = '';
    for (let j = 0; j < 3; j++) {
      const ph = (clockS * 0.7 + j / 3) % 1;
      if (broken && (j + Math.floor(clockS * 2)) % 2) continue;
      const r = (6 + 22 * ph) / scale;
      for (const s of [-1, 1]) {
        const a0 = s * 0.5;
        const a1 = s * 1.15;
        d += `M${f1(r * Math.sin(a0) * 1)} ${f1(-r * Math.cos(a0))}`;
        for (let t = 1; t <= 4; t++) { const aa = lerp(a0, a1, t / 4); d += `L${(r * Math.sin(aa)).toFixed(2)} ${(-r * Math.cos(aa)).toFixed(2)}`; }
      }
    }
    return d;
  }

  // ------------------------------------------------------------ the ring (a schema, an example)
  // the substation's breaker at (104,110); stations 1–4 along the top, 5–7 back along the bottom; station 7
  // holds the normally open point to the neighbouring ring
  const NX = [180, 290, 400, 510, 510, 400, 290];
  const NY = [110, 110, 110, 110, 262, 262, 262];
  const HS = 23;
  // the switch points: "in" toward the source, "out" away from it (station 7's out is the open point)
  const swPos = (i, out) => {
    const top = i < 4;
    const dir = (top ? 1 : -1) * (out ? 1 : -1);
    return [NX[i] + dir * 33, NY[i]];
  };
  function rgBase() {
    let s = rect(12, 12, 616, 376);
    s += txt(620, 40, SCH, 20, 'end', 'mf-mute');
    // the substation: a fenced yard with two transformer blocks and its label
    s += rect(28, 84, 64, 52, 'mf-tile', 5) + rect(38, 96, 18, 28, 'mf-panel', 3) + rect(64, 96, 18, 28, 'mf-panel', 3);
    s += txt(24, 164, tr('onderstation', 'substation'), 20, 'start', 'mf-mute');
    s += txt(28, 296, tr('buurring', 'next ring'), 20, 'start', 'mf-mute');
    return s;
  }
  // segments: 0 breaker→1, 1..3 along the top, 4 4→5 round the corner, 5 5→6 (the fault), 6 6→7, 7 7→next ring
  const SEG = [
    [[111, 110], [147, 110]],
    [[213, 110], [257, 110]], [[323, 110], [367, 110]], [[433, 110], [477, 110]],
    [[543, 110], [590, 110], [590, 262], [543, 262]],
    [[477, 262], [433, 262]], [[367, 262], [323, 262]],
    [[257, 262], [120, 262]],
  ];
  const RINGPATH = [[111, 110], [590, 110], [590, 262], [257, 262]];
  const FAULT = [455, 262];
  // the state of the ring: breaker closed, which switches are open, the open point, which stations are live
  function liveOf(st) {
    const live = new Array(7).fill(false);
    const ok = (i, out) => !st.open.includes(`${i}${out ? 'o' : 'i'}`);
    // from the substation along the ring, stopped by an open switch or the fault (until isolated)
    let feed = st.brk && !(st.fault && !st.isolated);
    for (let i = 0; i < 7 && feed; i++) {
      if (!ok(i, false)) break;
      live[i] = true;
      if (!ok(i, true)) break;
      if (i === 4 && st.fault) break;
      if (i === 6) break;
    }
    // from the neighbouring ring through the closed open point
    if (st.nop) {
      for (let i = 6; i >= 0; i--) {
        if (!ok(i, true) && i !== 6) break;
        live[i] = true;
        if (!ok(i, false)) break;
        if (i === 5 && st.fault) break;
      }
    }
    return live;
  }
  function rgLive(st, live, flow, clockS) {
    let s = '';
    SEG.forEach((pts, j) => {
      let on1;
      if (j === 0) on1 = st.brk;
      else if (j === 7) on1 = st.nop;
      else on1 = live[j - 1] && live[j] && !st.open.includes(`${j - 1}o`) && !st.open.includes(`${j}i`);
      s += `<path class="${on1 ? 'mf-line' : 'mf-ghost'}" d="${fmt(pts)}"/>`;
    });
    // the fault current: dashes from the substation to the fault (flow 0..1 is how far it has come)
    if (flow > 0.01) {
      const P2 = [[111, 110], [590, 110], [590, 262], FAULT];
      const lens = P2.slice(1).map((p, i) => Math.hypot(p[0] - P2[i][0], p[1] - P2[i][1]));
      let rest = flow * lens.reduce((a, b) => a + b, 0);
      const pts = [P2[0]];
      for (let i = 0; i < lens.length && rest > 0; i++) {
        const t = Math.min(1, rest / lens[i]);
        pts.push([lerp(P2[i][0], P2[i + 1][0], t), lerp(P2[i][1], P2[i + 1][1], t)]);
        rest -= lens[i];
      }
      s += `<path class="mf-dash" style="stroke-dashoffset:${f1(-clockS * 40)}" d="${fmt(pts)}"/>`;
    }
    return s;
  }
  // how far along the fault current's path each station sits (0..1), for lighting indicators in turn
  const FLOWAT = [0.09, 0.234, 0.378, 0.522, 0.928];
  function rgSt(st, live, o) {
    let s = '';
    // the breaker
    s += rect(97, 103, 14, 14, st.brk ? 'mf-acc' : 'mf-ring', 2);
    if (o.brkHot) s += rect(91, 97, 26, 26, 'mf-accl', 4);
    for (let i = 0; i < 7; i++) {
      const x = NX[i];
      const y = NY[i];
      const hot = (o.hot || []).includes(i);
      s += rect(x - HS, y - HS, 2 * HS, 2 * HS, live[i] ? 'mf-tile' : 'mf-off', 5);
      if (hot) s += rect(x - HS - 5, y - HS - 5, 2 * HS + 10, 2 * HS + 10, 'mf-accl', 8);
      s += txt(x, y + 8, i + 1, 22, 'middle', live[i] ? 'mf-txt' : 'mf-mute');
      // the switches either side
      for (const out of [false, true]) {
        const [sx, sy] = swPos(i, out);
        const key = `${i}${out ? 'o' : 'i'}`;
        const isNop = i === 6 && out;
        const open = isNop ? !st.nop : st.open.includes(key);
        const swHot = (o.swHot || []).includes(key);
        s += open ? circ(sx, sy, 6, swHot ? 'mf-accf' : 'mf-ring') : circ(sx, sy, 4.5, swHot ? 'mf-acc' : 'mf-dot');
      }
      // the fault indicator
      if (o.fpi) s += circ(x + HS, y - HS, 7, o.fpi[i] ? 'mf-acc' : 'mf-ring');
      // the antenna of a key station
      if (o.keys && C.RING.keys.includes(i)) {
        const ax = x - HS + 4;
        const ay = y - HS;
        const c = o.keysHot ? 'mf-accl' : 'mf-axis';
        s += line(ax, ay, ax, ay - 18, c) + `<path class="${c}" d="M${ax - 7} ${ay - 22}q7 -7 14 0M${ax - 12} ${ay - 27}q12 -11 24 0"/>`;
      }
    }
    if (st.fault) s += `<path class="mf-accl" d="M449 244l10 9l-8 3l10 12"/>`;
    // the open point's name, under station 7's left switch
    if (o.nopLabel) s += txt(258, 298, tr('openpunt', 'open point'), 20, 'end', 'mf-on');
    return s;
  }
  // the van: a box body with its cab and two wheels, drawn at (x, y)
  function van(x, y) {
    return rect(x - 18, y - 12, 26, 18, 'mf-tile', 3) + rect(x + 8, y - 6, 10, 12, 'mf-tile', 3) + circ(x - 10, y + 7, 3.5, 'mf-dot') + circ(x + 11, y + 7, 3.5, 'mf-dot');
  }
  const LANE = [[150, 150], [550, 150], [550, 222], [270, 222]];
  const STOPS = [[180, 150], [290, 150], [400, 150], [510, 150], [550, 186], [510, 222], [400, 222]];
  // the station at each stop (the corner is a bend, no station)
  const STOP_ST = [0, 1, 2, 3, -1, 4, 5];
  function vanAt(t) {
    // t 0..1 along the stops, pausing at each; returns the place and the station it stands at
    const n = STOPS.length - 1;
    const seg = Math.min(n - 1, Math.floor(t * n));
    const lt = t * n - seg;
    const e = span(lt, 0.35, 1);
    const a = STOPS[seg];
    const b = STOPS[seg + 1];
    return { xy: [lerp(a[0], b[0], e), lerp(a[1], b[1], e)], at: t >= 1 ? STOP_ST[n] : lt < 0.35 ? STOP_ST[seg] : -1 };
  }
  const clockTxt = (min) => `${Math.floor(min / 60)}:${String(Math.floor(min % 60)).padStart(2, '0')}`;
  function clock(a, text) { return op(a, txt(28, 46, `${tr('tijd', 'time')} ${text}`, 22, 'start', 'mf-mono')); }

  // ------------------------------------------------------------ s2: the control room's SCADA screen and the cabinet (schemas)
  function scBase() {
    return rect(380, 14, 248, 166) + txt(396, 46, 'SCADA', 22, 'start', 'mf-big') + txt(612, 46, tr('schema', 'diagram'), 20, 'end', 'mf-mute')
      + txt(396, 80, tr('station 7', 'station 7'), 20, 'start', 'mf-txt');
  }
  function scIn(state, press, fault) {
    let s = txt(612, 80, state ? tr('dicht', 'closed') : tr('open', 'open'), 20, 'end', press ? 'mf-on' : 'mf-mono');
    s += rect(396, 96, 100, 32, press ? 'mf-accf' : 'mf-tile', 5) + txt(446, 119, tr('open', 'open'), 20, 'middle', press ? 'mf-on' : 'mf-txt');
    s += rect(512, 96, 100, 32, 'mf-tile', 5) + txt(562, 119, tr('dicht', 'close'), 20, 'middle', 'mf-txt');
    s += op(fault, txt(396, 162, tr('fout: tussen 5 en 6', 'fault: between 5 and 6'), 20, 'start', 'mf-on'));
    return s;
  }
  function cbBase() {
    let s = rect(380, 14, 248, 250) + txt(396, 46, tr('kastje', 'cabinet'), 22, 'start', 'mf-txt') + txt(612, 46, tr('schema', 'diagram'), 20, 'end', 'mf-mute');
    return s;
  }
  function cbIn(a) {
    let s = '';
    // the modem with its antenna lead, the control unit with terminals, the battery with its cells
    s += op(a[0], rect(392, 62, 108, 56, 'mf-tile', 5) + txt(446, 96, 'modem', 20, 'middle', 'mf-txt') + circ(470, 104, 3, 'mf-acc') + circ(480, 104, 3, 'mf-acc'));
    s += op(a[1], rect(508, 62, 112, 56, 'mf-tile', 5) + txt(564, 96, tr('besturing', 'controls'), 20, 'middle', 'mf-txt') + [0, 1, 2, 3, 4].map((j) => circ(524 + j * 20, 110, 2.5, 'mf-dot')).join(''));
    s += op(a[2], rect(392, 132, 228, 56, 'mf-tile', 5) + [0, 1, 2, 3].map((j) => rect(402 + j * 30, 142, 24, 36, 'mf-panel', 3)).join('') + txt(612, 166, tr('accu', 'battery'), 20, 'end', 'mf-txt'));
    s += op(a[3], line(564, 118, 564, 132, 'mf-accl') + line(446, 118, 446, 132, 'mf-accl') + line(392, 226, 610, 226, 'mf-accl') + `<path class="mf-accl" d="M600 218l10 8l-10 8"/>` + txt(392, 254, tr('naar de motor', 'to the motor'), 20, 'start', 'mf-on'));
    return s;
  }

  // ------------------------------------------------------------ s6: the trade-off and the Dutch minutes (an example)
  function bcBase() { return rect(12, 12, 616, 376) + txt(620, 40, tr('voorbeeld', 'example'), 20, 'end', 'mf-mute'); }
  function bcIn(a, b) {
    let s = '';
    // the trade-off: the cost of one station against what it saves
    s += op(a, txt(28, 46, tr('per station', 'per station'), 22, 'start', 'mf-txt')
      + rect(28, 66, 260, 120, 'mf-tile', 6) + txt(158, 116, tr('kosten', 'cost'), 22, 'middle', 'mf-txt') + txt(158, 150, tr('kastje, motor, werk', 'cabinet, motor, work'), 20, 'middle', 'mf-mute')
      + txt(320, 136, tr('of', 'or'), 22, 'middle', 'mf-mute')
      + rect(352, 66, 260, 120, 'mf-accf', 6) + txt(482, 116, tr('minder klantminuten', 'fewer cust. minutes'), 20, 'middle', 'mf-on') + txt(482, 150, tr('minder rijden', 'less driving'), 20, 'middle', 'mf-on'));
    // the Dutch average: a band 20–25 minutes, the years as bars
    if (b > 0.01) {
      const X0 = 150;
      const X1 = 600;
      const xm = (m) => X0 + (X1 - X0) * (m / 30);
      let c = txt(28, 236, tr('minuten zonder stroom per klant per jaar', 'minutes without power per customer a year'), 20, 'start', 'mf-txt');
      c += `<rect class="mf-accf" x="${f1(xm(C.NLMIN.lo))}" y="252" width="${f1(xm(C.NLMIN.hi) - xm(C.NLMIN.lo))}" height="84" rx="3" style="opacity:.6"/>`;
      c += line(X0, 340, X1, 340) + [0, 10, 20, 30].map((v) => line(xm(v), 340, xm(v), 347) + txt(xm(v), 370, v, 20, 'middle', 'mf-mute')).join('');
      C.NLMIN.years.map(([y, m], i) => [y, m, 262 + i * 36]).forEach(([y, m, yy], i) => {
        const g = span(b, 0.1 + i * 0.25, 0.45 + i * 0.25);
        c += txt(28, yy + 20, y, 20, 'start', 'mf-mute') + `<rect class="fp-meter" x="${X0}" y="${yy}" width="${f1((xm(m) - X0) * g)}" height="26" rx="3"/>` + op(g, txt(xm(m) + 8, yy + 20, NL ? String(m).replace('.', ',') : m, 20, 'start', 'mf-mono'));
      });
      s += op(span(b, 0, 0.1), c);
    }
    return s;
  }
  // ------------------------------------------------------------ s7: what goes wrong
  function mfBase() { return rect(204, 12, 428, 376); }
  function mfIn(a, q) {
    const rows = [
      [tr('accu leeg', 'battery flat'), ''],
      [tr('verbinding weg in storm', 'link lost in a storm'), tr('netdata kloppen niet', 'network data wrong')],
      [tr('elke verbinding: een ingang', 'every link: a way in'), tr('zones en conduits', 'zones and conduits')],
    ];
    let s = '';
    rows.forEach(([l1, l2], i) => {
      const y = 30 + i * 84;
      s += op(a[i], rect(220, y, 396, 72, i === q ? 'mf-accf' : 'mf-tile', 6) + txt(236, y + 30, l1, 20, 'start', i === q ? 'mf-on' : 'mf-txt') + (l2 ? txt(236, y + 58, l2, 20, 'start', i === q ? 'mf-on' : 'mf-mute') : ''));
    });
    const qs = [tr('Welke ringen geven de', 'Which rings cause the'), tr('meeste klantminuten, en', 'most customer minutes,'), tr('waar helpt één schakelaar', 'and where would one'), tr('het meest?', 'switch help most?')];
    s += op(a[3], qs.map((t, i) => txt(236, 296 + i * 24, t, 20, 'start', 'mf-on')).join(''));
    return s;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['rg', 'sc', 'cb', 'bc', 'mf'];
  set(E.rgBase, rgBase());
  set(E.scBase, scBase());
  set(E.cbBase, cbBase());
  set(E.bcBase, bcBase());
  set(E.mfBase, mfBase());
  const ALL = [true, true, true, true, true, true, true];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let sw = [1, 1, 1];
    let lamp = [false, false];
    let led = [true, true];
    let wave = 0;
    let broken = false;
    let ring = null;
    let o = {};
    let mid = '';
    let count = '';
    let ringHl = 0;
    let vanXY = null;
    let clk = '';
    let flow = 0;

    if (si === 0) {
      vis.rg = 1;
      const fault = at01(b, 1, p, 0.1);
      const st = { brk: !at01(b, 1, p, 0.3), fault, isolated: false, open: [], nop: false };
      o = { nopLabel: b === 0 && p > 0.5, brkHot: b === 1 && p > 0.25 };
      if (b === 2 || b === 3) {
        const t = b === 2 ? span(p, 0.04, 0.8) : 1;
        const v = vanAt(t);
        if (b === 2) vanXY = v.xy;
        o.hot = b === 2 && p < 0.82 && v.at >= 0 ? [v.at] : [];
        clk = clockTxt((b === 2 ? span(p, 0.02, 0.86) : 1) * C.EX.tOut);
        if (at01(b, 2, p, 0.86)) { st.open = ['4o', '5i']; st.isolated = true; st.brk = true; st.nop = true; o.swHot = b === 2 ? ['4o', '5i', '6o'] : []; }
      }
      ring = st;
      const live = liveOf(st);
      if (b === 0) mid = op(span(p, 0.2, 0.5), txt(370, 192, tr(`${grp(C.EX.all)} klanten`, `${grp(C.EX.all)} customers`), 24, 'middle', 'mf-txt'));
      if (b === 1) mid = op(span(p, 0.35, 0.6), txt(370, 192, tr(`${grp(C.EX.all)} zonder stroom`, `${grp(C.EX.all)} without power`), 24, 'middle', 'mf-on'));
      if (b === 3) count = op(span(p, 0.05, 0.4), txt(28, 352, `${grp(C.EX.all)} × ${C.EX.tOut} min = ${grp(C.KM0)}`, 24, 'start', 'mf-big') + txt(28, 380, tr('klantminuten', 'customer minutes'), 20, 'start', 'mf-on'));
      set(E.rgLive, rgLive(st, live, 0, clockS));
      set(E.rgSt, rgSt(st, live, o));
    } else if (si === 1) {
      vis.sc = b === 2 ? 1 - span(p, 0, 0.1) : span(u, 0.15, 0.22);
      vis.cb = b === 2 ? span(p, 0, 0.1) : 0;
      wave = b === 0 || b === 3 ? 1 : b === 1 ? 0.6 : 0;
      lamp = [b === 3, false];
      const press = b === 1 && p > 0.3 && p < 0.55;
      const opened = b === 1 ? (p > 0.45 && p < 0.8) : false;
      sw = [1 - (b === 1 ? span(p, 0.42, 0.55) * (1 - span(p, 0.75, 0.88)) : 0), 1, 1];
      set(E.scIn, scIn(!opened, press, b === 3 ? span(p, 0.2, 0.4) : 0));
      set(E.cbIn, cbIn([on(b, 2, p, 0.1, 0.25), on(b, 2, p, 0.25, 0.4), on(b, 2, p, 0.4, 0.55), on(b, 2, p, 0.6, 0.75)]));
    } else if (si === 2) {
      // beat 0 in the station: the indicator lamp blinks; then the ring
      lamp = [b === 0 && p > 0.2 && Math.floor(clockS * 2) % 2 === 0, false];
      vis.rg = b === 0 ? 0 : b === 1 ? span(p, 0, 0.08) : 1;
      flow = b === 1 ? span(p, 0.1, 0.75) : b > 1 ? 1 : 0;
      const tripped = b > 1 || (b === 1 && p > 0.85);
      const st = { brk: !tripped, fault: b >= 1 && p > 0.05 || b > 1, isolated: false, open: [], nop: false };
      const fpi = [0, 1, 2, 3, 4, 5, 6].map((i) => i < 5 && flow >= FLOWAT[i]);
      o = { fpi, hot: b === 2 && p > 0.15 ? [4, 5] : [], nopLabel: false };
      const live = b >= 1 && !tripped ? ALL : liveOf(st);
      if (b === 3) {
        mid = op(span(p, 0.05, 0.25), rect(235, 163, 270, 50, 'mf-accf', 6) + txt(370, 196, tr('bedrijfsvoeringscentrum', 'control room'), 20, 'middle', 'mf-on')
          + [0, 1, 2, 3, 4].map((i) => (i < 4 ? line(NX[i] + HS, NY[i] - HS + 8, clamp(NX[i] + HS, 250, 490), 163, 'mf-dash') : line(NX[i] + HS, NY[i] - HS + 8, 505, 188, 'mf-dash'))).join(''));
      }
      set(E.rgLive, rgLive(st, live, b === 1 ? flow : b === 2 ? 1 : 0, clockS));
      set(E.rgSt, rgSt(st, live, o));
    } else if (si === 3) {
      vis.rg = 1;
      const st = { brk: true, fault: false, isolated: false, open: [], nop: false };
      o = { keys: true, keysHot: b === 0 || (b === 1 && p > 0.2 && p < 0.8), fpi: null };
      if (b >= 1) {
        st.fault = true;
        st.brk = !(b === 1 && p > 0.06 && p < 0.6);
        if (at01(b, 1, p, 0.3)) st.open.push('3o');
        if (at01(b, 1, p, 0.45)) st.open.push('6i');
        if (at01(b, 1, p, 0.3)) st.isolated = true;
        if (at01(b, 1, p, 0.75)) st.nop = true;
        if (b === 1) o.swHot = ['3o', '6i', '6o'];
        clk = b === 1 ? clockTxt(span(p, 0.15, 0.85) * C.EX.tRemote) : b === 2 ? clockTxt(lerp(C.EX.tRemote, C.EX.tOut, span(p, 0.1, 0.8))) : clockTxt(C.EX.tOut);
        if (at01(b, 2, p, 0.85)) { st.open = ['4o', '5i']; o.swHot = b === 2 ? ['4o', '5i', '3o', '6i'] : []; }
        if (b === 2) o.hot = [4, 5];
      }
      ring = st;
      const live = liveOf(st);
      if (b === 1) mid = op(span(p, 0.75, 0.9), txt(370, 192, tr(`${grp(C.EX.back)} terug na ${C.EX.tRemote} min`, `${grp(C.EX.back)} back after ${C.EX.tRemote} min`), 24, 'middle', 'mf-on'));
      if (b === 2) mid = op(span(p, 0.1, 0.3), txt(370, 192, tr(`${C.EX.wait} wachten ${C.EX.tOut} min`, `${C.EX.wait} wait ${C.EX.tOut} min`), 24, 'middle', 'mf-on'));
      if (b === 3) {
        const g1 = span(p, 0.5, 0.75);
        const g2 = span(p, 0.6, 0.85);
        mid = op(span(p, 0.45, 0.55), `<rect class="mf-panel" x="196" y="138" width="348" height="68" rx="6"/>`
          + `<rect class="fp-meter" x="208" y="146" width="${f1(220 * g1)}" height="22" rx="3"/>` + op(g1, txt(436, 164, grp(C.KM0), 20, 'start', 'mf-mono'))
          + `<rect class="fp-meter" data-top="" x="208" y="176" width="${f1(220 * (C.KM1 / C.KM0) * g2)}" height="22" rx="3"/>` + op(g2, txt(264, 194, `${grp(C.KM1)}  −80%`, 20, 'start', 'mf-monon')));
        count = op(span(p, 0.02, 0.3), txt(28, 352, `${grp(C.EX.back)} × ${C.EX.tRemote} + ${C.EX.wait} × ${C.EX.tOut}`, 24, 'start', 'mf-big')
          + op(span(p, 0.2, 0.45), txt(28, 380, `= ${grp(C.EX.back * C.EX.tRemote)} + ${grp(C.EX.wait * C.EX.tOut)} = ${grp(C.KM1)} ${tr('klantminuten', 'customer minutes')}`, 20, 'start', 'mf-on')));
      }
      set(E.rgLive, rgLive(st, live, 0, clockS));
      set(E.rgSt, rgSt(st, live, o));
    } else if (si === 4) {
      vis.rg = 1;
      const st = { brk: true, fault: false, isolated: false, open: [], nop: false };
      o = { keys: true, fpi: [false, false, false, false, false, false, false] };
      let secs = 0;
      if (b === 0) {
        st.fault = p > 0.15;
        st.brk = !(p > 0.4);
        o.brkHot = p > 0.35;
        mid = op(span(p, 0.45, 0.65), txt(370, 192, tr('relais: eerst afschakelen', 'relay: clear the fault first'), 22, 'middle', 'mf-on'));
      } else {
        st.fault = true;
        const q = b === 1 ? p : 1;
        secs = span(q, 0.05, 0.85) * 45;
        st.brk = q > 0.6;
        o.fpi = [0, 1, 2, 3, 4, 5, 6].map((i) => i < 5 && q > 0.08 + i * 0.03);
        if (q > 0.35) { st.open.push('3o'); st.isolated = true; }
        if (q > 0.48) st.open.push('6i');
        if (q > 0.75) st.nop = true;
        if (b === 1) o.swHot = q > 0.3 && q < 0.85 ? ['3o', '6i', '6o'] : [];
        ringHl = b === 1 ? span(p, 0.85, 1) : 1;
        clk = `${Math.round(secs)} s`;
        const chips = b === 3 ? [[tr('bedrijfsvoerder bevestigt', 'operator confirms'), Math.floor(clockS / 3) % 2 === 0], [tr('logica gaat zelf', 'logic runs alone'), Math.floor(clockS / 3) % 2 === 1]]
          : b === 2 ? [[tr('communicatie', 'communication'), p > 0.1], [tr('netdata', 'network data'), p > 0.35], [tr('geteste logica', 'tested logic'), p > 0.6]]
            : [[tr('1 vinden', '1 locate'), q > 0.08], [tr('2 scheiden', '2 isolate'), q > 0.35], [tr('3 herstellen', '3 restore'), q > 0.6]];
        const w = (616 - 16 * (chips.length - 1)) / chips.length;
        count = chips.map(([t, hot], i) => rect(12 + i * (w + 16), 328, w, 48, hot ? 'mf-accf' : 'mf-tile', 6) + txt(12 + i * (w + 16) + w / 2, 359, t + (b === 2 && hot ? ' ✓' : ''), 20, 'middle', hot ? 'mf-on' : 'mf-mute')).join('');
      }
      ring = st;
      const live = liveOf(st);
      set(E.rgLive, rgLive(st, live, 0, clockS));
      set(E.rgSt, rgSt(st, live, o));
    } else if (si === 5) {
      vis.rg = b === 0 ? 1 : 1 - span(p, 0, 0.1);
      vis.bc = b === 0 ? 0 : span(p, 0, 0.1);
      const st = { brk: true, fault: false, isolated: false, open: [], nop: false };
      o = { keys: true, keysHot: b === 0 && p > 0.3 };
      ring = st;
      const live = liveOf(st);
      if (b === 0) mid = op(span(p, 0.35, 0.6), txt(370, 192, tr('2 à 3 sleutelstations per ring', '2 or 3 key stations per ring'), 22, 'middle', 'mf-on'));
      set(E.rgLive, rgLive(st, live, 0, clockS));
      set(E.rgSt, rgSt(st, live, o));
      set(E.bcIn, bcIn(b === 1 ? span(p, 0.05, 0.3) : b > 1 ? 1 : 0, b === 2 ? span(p, 0.05, 0.9) : 0));
    } else if (si === 6) {
      vis.mf = span(u, 0, 0.04);
      led = [!(b === 0 && p > 0.2), !(b === 0 && p > 0.2)];
      wave = b === 1 ? 1 : b === 2 ? 1 : 0;
      broken = b === 1;
      set(E.mfIn, mfIn([on(b, 0, p, 0.05, 0.2), on(b, 1, p, 0.05, 0.2), on(b, 2, p, 0.05, 0.2), on(b, 3, p, 0.05, 0.2)], b < 3 ? b : -1));
    }
    if (ring || si === 0) {
      set(E.rgRing, op(ringHl, `<path class="mf-line" style="stroke-width:12;opacity:.35" d="${fmt(RINGPATH)}"/>`));
      set(E.rgMid, mid);
      set(E.rgCount, count + clock(clk ? 1 : 0, clk));
      set(E.rgVan, vanXY ? van(vanXY[0], vanXY[1]) : '');
    } else if (si === 2) {
      set(E.rgRing, '');
      set(E.rgMid, mid);
      set(E.rgCount, '');
      set(E.rgVan, '');
    }
    blades(sw);
    lit(E.lamp0, lamp[0]);
    lit(E.lamp1, lamp[1]);
    lit(E.led0, led[0]);
    lit(E.led1, led[1] && Math.floor(clockS * 1.5) % 2 === 0);
    setD(E.waves, waves(wave, clockS, broken));
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
