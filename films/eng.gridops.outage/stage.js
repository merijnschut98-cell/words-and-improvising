// The stage of the film "Een storing in de meldkamer / An outage in the
// control room": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the model's data),
// CAM (one camera move per scene, each in drawing A, the street, or B, the
// station), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step. The
// cards' fixed parts are drawn once at load.
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
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const grp = (v) => { const s = String(Math.round(v)); return s.length >= 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',') : s; };
  const dec = (v) => (NL ? String(v).replace('.', ',') : String(v));
  const txt = (x, y, t, size = 20, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const tick = (x, y, cls = 'mf-accl') => `<path class="${cls}" d="M${f1(x - 9)} ${f1(y - 6)}l7 8l14 -16"/>`;
  const EX = tr('voorbeeld', 'example');
  const SCH = tr('schema', 'diagram');
  const FULL = () => rect(16, 12, 608, 376);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);
  // a beat's own content: fades in at its start and out as the next beat starts
  const only = (b, i, p) => (b === i ? span(p, 0, 0.1) : b === i + 1 ? 1 - span(p, 0, 0.1) : 0);

  // the beat on screen and its progress, from the caption beats of the scene
  const fracs = (si) => { const sc = D.scenes[si]; return beatStarts(sc, 'nl').map((x) => x / sc.dur); };
  function beatOf(si, u) {
    const fr = fracs(si);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }

  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const s = W / lerp(c.from[2], c.to[2], k);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-lerp(c.from[0], c.to[0], k))} ${f1(-lerp(c.from[1], c.to[1], k))})`;
    const el = c.w === 'A' ? E.worldA : E.worldB;
    show(E.worldA, c.w === 'A');
    show(E.worldB, c.w === 'B');
    if (el.__t !== t) { el.setAttribute('transform', t); el.__t = t; }
  }

  // ------------------------------------------------------------ drawing B: the RMU's mimic blades and fault indicators
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
  const lamp = (lit) => [0, 1].forEach((i) => { const e = E[`fpi${i}`]; if (e.hasAttribute('data-lit') !== lit) e.toggleAttribute('data-lit', lit); });
  function tag(a, n, sub) {
    return op(a, rect(24, 24, 262, 74) + txt(40, 54, tr(`station ${n}`, `station ${n}`), 22, 'start', 'mf-txt') + txt(40, 84, sub, 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ the ring in SCADA (an example)
  const TOPY = 130;
  const BOTY = 262;
  const XS = [150, 230, 310, 390, 470, 550];
  const RX = 600;
  const pos = (n) => (n <= 6 ? [XS[n - 1], TOPY] : [XS[12 - n], BOTY]);
  const SW5 = 492;
  const SW6 = 528;
  const FX = 510;
  function rgBase() {
    let out = FULL() + txt(612, 46, EX, 20, 'end', 'mf-mute');
    // the substation: a busbar in a frame, the neighbouring ring's feed at the bottom left
    out += rect(28, 100, 48, 60, 'mf-iron', 4) + line(52, 108, 52, 152, 'mf-line') + line(52, TOPY, 76, TOPY, 'mf-line') + line(76, TOPY, 94, TOPY, 'mf-line');
    out += txt(28, 88, tr('onderstation', 'substation'), 20, 'start', 'mf-mute') + txt(104, 182, tr('veld', 'feeder'), 20, 'middle', 'mf-mute');
    out += line(40, BOTY, 92, BOTY, 'mf-line') + dot(40, BOTY, 5) + txt(28, 336, tr('naburige ring', 'neighbouring ring'), 20, 'start', 'mf-mute');
    return out;
  }
  const rgHead = () => txt(28, 46, 'SCADA', 22, 'start', 'mf-txt') + txt(112, 46, tr('bedrijfsvoeringscentrum', 'control room'), 20, 'start', 'mf-mute');
  const swBox = (x, y, closed, s = 18, lit = false) => rect(x - s / 2, y - s / 2, s, s, closed ? 'mf-tile' : lit ? 'mf-accf' : 'mf-ring', 2);
  // st: cb (feeder breaker closed), iso (both switches round the faulty cable open), nop (open point closed),
  // fault (the zigzag, 0..1), flow (a travelling dot, 0..1 or null)
  function rgNet(st) {
    const live6 = (st.cb && !st.iso) || st.nop;
    const L = (pts, live) => `<path class="${live ? 'mf-line' : 'mf-dead'}" d="${fmt(pts)}"/>`;
    let out = L([[104, TOPY], [XS[0], TOPY]], st.cb);
    for (let n = 1; n < 5; n++) out += L([pos(n), pos(n + 1)], st.cb);
    out += L([[XS[4], TOPY], [SW5, TOPY]], st.cb) + L([[SW5, TOPY], [SW6, TOPY]], st.cb && !st.iso) + L([[SW6, TOPY], [XS[5], TOPY]], live6);
    out += L([[XS[5], TOPY], [RX, TOPY], [RX, BOTY], [XS[5], BOTY]], live6);
    for (let n = 7; n < 12; n++) out += L([pos(n), pos(n + 1)], live6);
    out += L([[XS[0], BOTY], [110, BOTY]], live6) + L([[92, BOTY], [110, BOTY]], st.nop);
    // the two switches round the faulty cable, in stations 5 and 6
    out += swBox(SW5, TOPY, !st.iso, 16, st.iso) + swBox(SW6, TOPY, !st.iso, 16, st.iso);
    // the stations
    for (let n = 1; n <= 12; n++) {
      const [x, y] = pos(n);
      const live = n <= 5 ? st.cb : live6;
      out += rect(x - 17, y - 17, 34, 34, live ? 'mf-tile' : 'mf-off', 4) + txt(x, y + 7, n, 20, 'middle', live ? 'mf-txt' : 'mf-mute');
    }
    if (st.fault > 0.01) out += op(st.fault, `<path class="mf-accl" d="M${FX - 8} ${TOPY - 14}L${FX + 4} ${TOPY - 3}L${FX - 4} ${TOPY + 3}L${FX + 8} ${TOPY + 14}"/>` + txt(FX, 100, tr('fout', 'fault'), 20, 'middle', 'mf-on'));
    if (st.flow !== null && st.flow !== undefined) {
      // a dot runs from the substation along the fed half, another from the neighbouring ring up to the open point
      const path = [[76, TOPY], [XS[5], TOPY], [RX, TOPY], [RX, BOTY], [110, BOTY]];
      const lens = path.slice(1).map((q, i) => Math.hypot(q[0] - path[i][0], q[1] - path[i][1]));
      let d = st.flow * lens.reduce((a, v) => a + v, 0);
      let i = 0;
      while (i < lens.length - 1 && d > lens[i]) { d -= lens[i]; i++; }
      const t = clamp(d / lens[i], 0, 1);
      out += dot(lerp(path[i][0], path[i + 1][0], t), lerp(path[i][1], path[i + 1][1], t), 6, 'mf-acc') + dot(lerp(40, 88, st.flow), BOTY, 6, 'mf-acc');
    }
    return out;
  }
  const rgCb = (closed) => swBox(104, TOPY, closed, 20, !closed);
  const rgNop = (closed, a) => swBox(101, BOTY, closed, 18, !closed) + op(a, txt(101, 300, closed ? tr('dicht', 'closed') : tr('normaal open', 'normally open'), 20, 'middle', 'mf-on'));
  function rgFpi(a, lit) {
    if (a <= 0.01) return '';
    let out = '';
    for (let n = 1; n <= 12; n++) {
      const [x, y] = pos(n);
      out += dot(x, n <= 6 ? y + 38 : y - 38, 6, n <= lit ? 'mf-acc' : 'mf-ring');
    }
    return op(a, out);
  }

  // ------------------------------------------------------------ s2: low voltage (notes beside the street)
  function lsIn(b, p, clockS) {
    let out = rect(372, 20, 252, 222);
    out += txt(386, 54, `${tr('LS', 'LV')} ${400}/${230} V`, 20, 'start', 'mf-txt') + txt(386, 80, tr('nauwelijks gemeten', 'barely measured'), 20, 'start', 'mf-mute');
    out += op(on(b, 1, p, 0.05, 0.2), txt(386, 116, tr('klant belt', 'customer calls'), 20, 'start', 'mf-txt'));
    out += op(on(b, 1, p, 0.3, 0.45), txt(386, 142, tr('slimme meter', 'smart meter'), 20, 'start', 'mf-txt'));
    out += op(on(b, 1, p, 0.55, 0.7), txt(386, 168, tr('sensor in station', 'station sensor'), 20, 'start', 'mf-txt'));
    if (b === 2) out += op(span(p, 0.05, 0.2), txt(386, 210, `+${Math.min(30, 1 + Math.floor(clockS / 1.5) % 30)} min`, 24, 'start', 'mf-big') + txt(500, 210, tr('telt mee', 'counts'), 20, 'start', 'mf-mute'));
    if (b === 3) out += op(span(p, 0.05, 0.2), txt(386, 210, tr('hoe snel weten we het?', 'how soon do we know?'), 20, 'start', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ s6: restoring and repairing
  const tmBase = () => FULL();
  function tmIn(b, p) {
    let out = '';
    // beat 1: by hand against remote control (a diagram); minutes 0..120 on x 230..590
    const a0 = b === 0 ? span(p, 0, 0.1) : b === 1 ? 1 - span(p, 0, 0.1) : 0;
    if (a0 > 0.01) {
      const x = (m) => 230 + 3 * m;
      let s = txt(612, 46, SCH, 20, 'end', 'mf-mute');
      s += txt(28, 118, tr('met de hand', 'by hand'), 20, 'start', 'mf-txt') + rect(x(60), 96, x(120) - x(60), 30, 'mf-band', 4) + txt(x(90), 86, tr('1–2 uur', '1–2 hours'), 20, 'middle', 'mf-mono');
      s += op(span(p, 0.4, 0.6), txt(28, 198, tr('op afstand', 'remote'), 20, 'start', 'mf-txt') + `<rect class="fp-meter" data-top="" x="${x(0)}" y="176" width="${f1(x(4) - x(0))}" height="30" rx="3"/>` + txt(x(4) + 10, 198, tr('minuten', 'minutes'), 20, 'start', 'mf-on'));
      s += line(x(0), 240, x(120), 240) + [0, 30, 60, 90, 120].map((m) => line(x(m), 240, x(m), 248) + txt(x(m), 272, m, 20, 'middle', 'mf-mute')).join('') + txt(612, 304, 'min', 20, 'end', 'mf-mute');
      out += op(a0, s);
    }
    // beat 2: the example's customer minutes: 1.800 customers × 50 min on average
    const a1 = only(b, 1, p);
    if (a1 > 0.01) {
      const x = (m) => 230 + 5.6 * m;
      const grow = b === 1 ? span(p, 0.1, 0.45) : 1;
      let s = txt(612, 46, EX, 20, 'end', 'mf-mute');
      s += rect(x(0), 330 - 180, (x(C.AVG) - x(0)) * grow, 180, 'mf-accf', 2);
      s += txt(218, 158, grp(C.CUST), 22, 'end', 'mf-mono') + txt(218, 184, tr('klanten', 'customers'), 20, 'end', 'mf-mute');
      s += line(x(0), 330, x(60), 330) + [0, 10, 20, 30, 40, 50, 60].map((m) => line(x(m), 330, x(m), 338) + txt(x(m), 362, m, 20, 'middle', 'mf-mute')).join('') + txt(612, 316, 'min', 20, 'end', 'mf-mute');
      s += op(span(p, 0.3, 0.5) + (b > 1 ? 1 : 0), txt(x(25), 136, tr(`gemiddeld ${C.AVG} min`, `${C.AVG} min on average`), 20, 'middle', 'mf-txt'));
      s += op(b === 1 ? span(p, 0.5, 0.7) : 1, txt(x(25), 250, grp(C.CMIN), 30, 'middle', 'mf-big') + txt(x(25), 280, tr('klantminuten', 'customer minutes'), 20, 'middle', 'mf-txt'));
      out += op(a1, s);
    }
    // beat 3: the repair, inside the isolated section (a diagram)
    const a2 = only(b, 2, p);
    if (a2 > 0.01) {
      const rows = [tr('eerst: de vijf veiligheidsregels', 'first: the five safety rules'), tr('meetwagen zoekt de fout', 'a van locates the fault'), tr('ploeg graaft', 'the crew digs'), tr('één of twee moffen', 'one or two joints'), tr('kabel testen', 'test the cable')];
      let s = txt(612, 46, SCH, 20, 'end', 'mf-mute') + txt(28, 52, tr('reparatie', 'repair'), 22, 'start', 'mf-txt');
      rows.forEach((r, i) => { s += op(b === 2 ? span(p, 0.08 + i * 0.15, 0.2 + i * 0.15) : 1, tick(54, 104 + i * 54) + txt(80, 110 + i * 54, r, 20, 'start', 'mf-txt')); });
      out += op(a2, s);
    }
    // beat 4: a day, and a ring with no backup
    const a3 = b === 3 ? span(p, 0, 0.1) : 0;
    if (a3 > 0.01) {
      let s = txt(320, 120, tr('vaak een dag', 'often a day'), 34, 'middle', 'mf-big');
      // the ring as a loop, open at the isolated section: no other side to feed from
      s += `<path class="mf-line" d="M238 180H402M432 180H470V300H170V180H208"/>` + `<path class="mf-dead" d="M208 180H238M402 180H432"/>`;
      s += [170, 260, 350, 470].map((x) => dot(x, x === 170 || x === 470 ? 240 : 300, 7, 'mf-dot')).join('');
      s += txt(320, 350, tr('ring zonder reserve', 'ring without backup'), 22, 'middle', 'mf-on');
      out += op(a3, s);
    }
    return out;
  }

  // ------------------------------------------------------------ s7: SAIFI × CAIDI = SAIDI (Netbeheer Nederland, 2024)
  function sdBase() {
    return FULL() + txt(28, 46, tr('Nederland, 2024, onvoorzien', 'Netherlands, 2024, unplanned'), 20, 'start', 'mf-txt') + txt(612, 46, 'Netbeheer Nederland', 20, 'end', 'mf-mute');
  }
  function sdBox(x, w, a, name, val, s1, s2) {
    const cx = x + w / 2;
    return op(a, rect(x, 70, w, 160, 'mf-tile', 8) + txt(cx, 104, name, 24, 'middle', 'mf-txt') + txt(cx, 152, val, 29, 'middle', 'mf-big') + txt(cx, 186, s1, 20, 'middle', 'mf-mute') + txt(cx, 212, s2, 20, 'middle', 'mf-mute'));
  }
  function sdTxt(b, p) {
    let out = op(on(b, 1, p, 0.0, 0.2), txt(224, 160, '×', 30, 'middle', 'mf-txt')) + op(on(b, 2, p, 0.0, 0.2), txt(436, 160, '=', 30, 'middle', 'mf-txt'));
    out += op(on(b, 2, p, 0.6, 0.75), txt(28, 266, tr(`gepland werk: + ${dec(C.PLANNED)} min`, `planned work: + ${dec(C.PLANNED)} min`), 20, 'start', 'mf-txt'));
    const a = on(b, 3, p, 0.05, 0.4);
    if (a > 0.01) {
      // the customer minutes of a region, stacked per feeder: one long rural feeder dominates (a diagram)
      const parts = [40, 36, 30, 28, 24, 20, 18, 16, 14, 12];
      let x = 28;
      let s = '';
      parts.forEach((w) => { s += rect(x, 298, w - 2, 28, 'mf-band', 2); x += w; });
      s += `<rect class="fp-meter" data-top="" x="${x}" y="298" width="${f1((612 - x) * clamp(a * 1.4, 0, 1))}" height="28" rx="2"/>`;
      s += txt(612, 288, tr('één lange streng, platteland', 'one long rural feeder'), 20, 'end', 'mf-on') + txt(28, 356, tr('klantminuten per streng, schema', 'customer minutes per feeder, diagram'), 20, 'start', 'mf-mute');
      out += op(a, s);
    }
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['ls', 'tag', 'ring', 'tm', 'sd'];
  set(E.rgBase, rgBase());
  set(E.rgHead, rgHead());
  set(E.tmBase, tmBase());
  set(E.sdBase, sdBase());
  const NORMAL = { cb: 1, iso: 0, nop: 0, fault: 0, flow: null };
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let sw = [1, 1, 1];
    let lit = false;
    let st = NORMAL;
    let cb = 1;
    let nop = 0;
    let nopLabel = 0;
    let fpi = 0;
    let fpiLit = 0;
    let txtR = '';
    const calls = si === 1 ? [0, 1, 2].map((i) => (b > 1 ? 1 : b === 1 ? span(p, 0.05 + 0.12 * i, 0.15 + 0.12 * i) : 0)) : [0, 0, 0];
    calls.forEach((a, i) => { show(E[`call${i}`], a > 0.01); fade(E[`call${i}`], a); });

    if (si === 0) {
      vis.ring = b >= 1 ? on(b, 1, p, 0, 0.12) : 0;
      const trip = b > 1 || (b === 1 && p > 0.45);
      cb = trip ? 0 : 1;
      st = { cb, iso: 0, nop: 0, fault: 0, flow: null };
      if (b === 1) txtR = trip ? txt(28, 376, tr('07:40 · veld uit', '07:40 · feeder tripped'), 20, 'start', 'mf-on') : txt(28, 376, '07:40', 20, 'start', 'mf-mono');
      if (b === 2) txtR = txt(28, 376, tr('07:40 · veld uit', '07:40 · feeder tripped'), 20, 'start', 'mf-on');
      if (b === 3) txtR = op(span(p, 0.1, 0.3), txt(28, 376, tr(`zonder stroom: ${grp(C.CUST)} klanten`, `off supply: ${grp(C.CUST)} customers`), 20, 'start', 'mf-on'));
    } else if (si === 1) {
      vis.ls = span(u, 0.02, 0.08);
      set(E.lsIn, lsIn(b, p, clockS));
    } else if (si === 2) {
      vis.ring = span(u, 0, 0.04);
      nopLabel = on(b, 1, p, 0.05, 0.3);
      st = { ...NORMAL, flow: b === 2 ? span(p, 0.1, 0.9) : null };
      txtR = txt(28, 376, tr('normaal bedrijf', 'normal operation'), 20, 'start', 'mf-mute');
    } else if (si === 3) {
      vis.tag = b === 1 ? span(p, 0.15, 0.3) : 0;
      lit = b >= 1 && (b > 1 || p > 0.3);
      set(E.tgIn, tag(1, 5, tr('verklikker: aan', 'indicator: on')));
      vis.ring = b >= 2 ? on(b, 2, p, 0, 0.1) : 0;
      cb = 0;
      st = { cb: 0, iso: 0, nop: 0, fault: b === 3 ? span(p, 0.1, 0.3) : 0, flow: null };
      fpi = 1;
      fpiLit = b === 2 ? Math.floor(clamp((p - 0.1) / 0.5, 0, 1) * C.LIT + 0.001) : C.LIT;
      txtR = txt(28, 376, tr('08:15 · monteur ter plaatse', '08:15 · technician on site'), 20, 'start', 'mf-mute');
    } else if (si === 4) {
      // beat 1: station 5 opens its switch towards 6, then station 6 its switch towards 5; then the ring card
      const six = b === 0 && p > 0.42;
      if (b === 0) {
        vis.tag = span(p, 0.04, 0.12);
        lit = !six;
        if (!six) sw = [1, 1 - span(p, 0.18, 0.32), 1];
        else sw = [1 - span(p, 0.5, 0.64), 1, 1];
        set(E.tgIn, six ? tag(1, 6, tr('naar 5: open', 'towards 5: open')) : tag(1, 5, tr('naar 6: open', 'towards 6: open')));
      }
      vis.ring = b === 0 ? span(p, 0.74, 0.86) : 1;
      cb = b === 0 ? 0 : b === 1 ? (p > 0.35 ? 1 : 0) : 1;
      nop = b === 3 && p > 0.3 ? 1 : 0;
      nopLabel = b === 3 ? 1 : 0;
      st = { cb, iso: 1, nop, fault: 1, flow: null };
      if (b === 2) txtR = txt(196, 336, p > 0.6 ? tr('ochtendbelasting: past', 'morning load: fits') : tr('ochtendbelasting: past het?', 'morning load: does it fit?'), 20, 'start', p > 0.6 ? 'mf-on' : 'mf-txt');
      if (b === 3) txtR = op(span(p, 0.5, 0.65), txt(28, 376, tr('iedereen terug', 'everyone back'), 20, 'start', 'mf-on'));
    } else if (si === 5) {
      vis.tm = span(u, 0, 0.03);
      set(E.tmIn, tmIn(b, p));
    } else if (si === 6) {
      vis.sd = span(u, 0, 0.03);
      set(E.sdF, sdBox(28, 180, on(b, 0, p, 0.05, 0.25), 'SAIFI', dec(C.SAIFI), tr('onderbrekingen', 'interruptions'), tr('per klant', 'per customer')));
      set(E.sdC, sdBox(240, 180, on(b, 1, p, 0.05, 0.25), 'CAIDI', `${dec(C.CAIDI)} min`, tr('per onderbreking', 'per interruption'), tr('getroffen klant', 'if affected')));
      set(E.sdD, sdBox(452, 160, on(b, 2, p, 0.05, 0.3), 'SAIDI', `${dec(C.SAIDI)} min`, tr('per klant', 'per customer'), tr('per jaar', 'per year')));
      set(E.sdTxt, sdTxt(b, p));
    }
    if (vis.ring) {
      set(E.rgNet, rgNet(st));
      set(E.rgCb, rgCb(st.cb));
      set(E.rgNop, rgNop(st.nop, nopLabel));
      set(E.rgFpi, rgFpi(fpi, fpiLit));
      set(E.rgTxt, txtR);
    }
    blades(sw);
    lamp(lit);
    // under a full-stage card the drawing behind it fades out, so its edges never show at the card's margins
    const full = Math.max(vis.ring || 0, vis.tm || 0, vis.sd || 0);
    const wEl = CAM[si].w === 'A' ? E.worldA : E.worldB;
    fade(wEl, 1 - full);
    if (full >= 0.999) show(wEl, false);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
