// The stage of the film "Loadflow en N-1 / Load flow and N-1": a pure function
// of (scene, u). Inlined into the page after the anatomy kit (iso-kit functions
// in scope) and a preamble from build.mjs that defines P (projection), C (the
// model's data), CAM (one camera move per scene), W and H. Moves are placed per
// caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
/* global C, CAM, W, H, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  // repeated parts ship once (build.mjs, dedupe): each <g data-r> copies its template
  svg.querySelectorAll('[data-r]').forEach((el) => { el.innerHTML = svg.querySelector(`[data-t="${el.getAttribute('data-r')}"]`).innerHTML; });
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const T1 = [...svg.querySelectorAll('[data-n^="t1."]')];
  T1.forEach((el) => el.classList.add('ws-off'));
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
  const txt = (x, y, t, size = 20, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8, extra = '') => `<rect class="${cls}"${extra} x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const circ = (x, y, r, cls = 'mf-wire') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const SCH = tr('schema', 'diagram');
  const tag = (t, x = 620, y = 40, anchor = 'end') => txt(x, y, t, 20, anchor, 'mf-mute');
  const PANEL = (x0 = 204) => rect(x0, 12, 632 - x0, 376);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);
  // a transformer symbol: two overlapping windings
  const trafo = (x, y, r = 14, cls = 'mf-wire') => circ(x, y - r * 0.6, r, cls) + circ(x, y + r * 0.6, r, cls);
  const bldg = (x, y, w, h, cls = 'mf-home') => `<path class="${cls}" d="M${f1(x)} ${f1(y + h * 0.35)}L${f1(x + w / 2)} ${f1(y)}L${f1(x + w)} ${f1(y + h * 0.35)}L${f1(x + w)} ${f1(y + h)}L${f1(x)} ${f1(y + h)}Z"/>`;

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

  // ------------------------------------------------------------ s1: the load-flow schema of the feeder
  const NODES = [330, 400, 470, 540];
  const SEC = [[266, 330], [330, 400], [400, 470], [470, 540], [540, 576]];
  const LOAD = [74, 62, 50, 38, 22]; // % of the rating, per cable section (schema)
  const VOLT = [99, 98, 97, 96]; // % of nominal, per node (schema)
  const BB = 300; // bar base
  const BK = 1.4; // px per %
  function lfBase() { return PANEL() + tag(SCH); }
  function lfNet(net, sw) {
    let out = rect(222, 72, 44, 56, 'mf-tile', 4) + trafo(244, 100, 10);
    if (net > 0.01) {
      out += line(266, 100, lerp(266, 576, net), 100, 'mf-wire');
      NODES.forEach((x) => { if (lerp(266, 576, net) >= x) out += rect(x - 8, 92, 16, 16, 'mf-tile', 2); });
      if (net > 0.98) out += bldg(576, 80, 30, 34, 'mf-tile');
    }
    out += op(sw, txt(222, 50, 'Vision · PowerFactory', 20, 'start', 'mf-mute'));
    return out;
  }
  function lfBars(a, red) {
    if (a <= 0.01) return '';
    let out = `<path class="mf-dash" d="M276 ${BB - 100 * BK}L604 ${BB - 100 * BK}"/>` + txt(222, BB - 100 * BK + 7, '100%', 20, 'start', 'mf-on') + line(276, BB, 604, BB);
    SEC.forEach(([x0, x1], i) => {
      const pct = i === 0 ? lerp(LOAD[0], 108, red) : LOAD[i];
      const h = pct * BK * a;
      const top = i === 0 && red > 0.5;
      out += `<rect class="fp-meter"${top ? ' data-top=""' : ''} x="${f1((x0 + x1) / 2 - 13)}" y="${f1(BB - h)}" width="26" height="${f1(h)}" rx="2"/>`;
    });
    out += op(a, txt(222, 250, 'I %', 20, 'start', 'mf-mute') + txt(222, 334, 'U %', 20, 'start', 'mf-mute')
      + NODES.map((x, i) => txt(x, 334, `${VOLT[i]}`, 20, 'middle', 'mf-mono')).join(''));
    out += op(red, txt(222, 372, tr('rood: boven 100% of buiten de band', 'red: above 100% or outside the band'), 20, 'start', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ s2: the rating of a cable
  function raBase() { return PANEL(); }
  function raCable(a) {
    if (a <= 0.01) return '';
    let out = rect(222, 60, 166, 166, 'mf-band', 6);
    for (let i = 0; i < 26; i++) out += circ(230 + ((i * 47) % 150), 68 + ((i * 29) % 150), 1.4, 'mf-dot');
    out += circ(296, 142, 54, 'mf-tile');
    for (let i = 0; i < 3; i++) {
      const t = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
      const x = 296 + 25 * Math.cos(t);
      const y = 142 + 25 * Math.sin(t);
      out += circ(x, y, 21, 'mf-home') + `<circle class="fp-meter" cx="${f1(x)}" cy="${f1(y)}" r="13"/>`;
    }
    out += circ(366, 206, 14, 'mf-home');
    const L4 = [tr('doorsnede', 'cross-section'), tr('grondsoort', 'soil type'), tr('grondtemperatuur', 'soil temperature'), tr('kabels ernaast', 'cables nearby')];
    out += L4.map((t, i) => txt(404, 92 + i * 34, t, 20, 'start', 'mf-txt')).join('');
    return op(a, out);
  }
  function raTxt(r2, r3) {
    return op(r2, txt(222, 262, tr('Al MS-kabel: 250–300 A', 'Al MV cable: 250–300 A'), 20) + txt(222, 292, tr('op 10 kV ≈ 4–5 MVA ≈ MW', 'at 10 kV ≈ 4–5 MVA ≈ MW'), 20, 'start', 'mf-mute'))
      + op(r3, txt(222, 336, 'I = S / (√3 × U)', 21, 'start', 'mf-big') + txt(222, 368, tr('2,5 MVA op 10 kV ≈ 144 A', '2.5 MVA at 10 kV ≈ 144 A'), 21, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s3: the station against its feeders
  const FK = 2; // px per %
  function feBase() { return PANEL() + tag(SCH); }
  function feBars(a, uneven) {
    if (a <= 0.01) return '';
    const base = 290;
    let out = line(222, base, 612, base) + `<path class="mf-dash" d="M222 ${base - 100 * FK}L612 ${base - 100 * FK}"/>` + txt(612, base - 100 * FK - 10, tr('grens', 'limit'), 20, 'end', 'mf-on');
    const st = 52 * a;
    out += `<rect class="fp-meter" data-alt="" x="236" y="${f1(base - st * FK)}" width="54" height="${f1(st * FK)}" rx="3"/>` + txt(263, base + 26, 'station', 20, 'middle', 'mf-txt');
    for (let i = 0; i < 5; i++) {
      const pct = (i === 0 ? lerp(40, 100, uneven) : 40) * a;
      const x = 330 + i * 56;
      out += `<rect class="fp-meter"${i === 0 && uneven > 0.5 ? ' data-top=""' : ''} x="${x}" y="${f1(base - pct * FK)}" width="38" height="${f1(pct * FK)}" rx="3"/>`;
      if (i === 0) out += op(uneven, txt(x + 19, base - pct * FK - 10, '100%', 20, 'middle', 'mf-on'));
      if (i === 2) out += txt(x + 19, base - 40 * FK - 10, '40%', 20, 'middle', 'mf-mono');
    }
    out += txt(468, base + 26, tr('strengen', 'feeders'), 20, 'middle', 'mf-txt');
    return out;
  }
  function feMap(a) {
    return op(a, rect(222, 336, 28, 28, 'mf-tile', 4) + txt(262, 350, tr('groen op de kaart:', 'green on the map:'), 20, 'start', 'mf-txt')
      + txt(262, 378, tr('nog geen ruimte op jouw adres', 'not yet room at your address'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s4: the voltage along the feeder, and the band
  const VX0 = 268;
  const VX1 = 604;
  const vy = (v) => 200 - (v - 230) * 4.4;
  const vx = (s) => VX0 + (VX1 - VX0) * s;
  function voBase() {
    return PANEL() + tag(SCH) + line(VX0, vy(262), VX0, vy(203)) + line(VX0, vy(203), VX1, vy(203))
      + txt(VX0 - 8, vy(253) + 7, '253', 20, 'end', 'mf-mute') + txt(VX0 - 8, vy(230) + 7, '230', 20, 'end', 'mf-mute') + txt(VX0 - 8, vy(207) + 7, '207', 20, 'end', 'mf-mute')
      + txt(VX0 - 8, vy(262) + 4, 'V', 20, 'end', 'mf-mute') + line(VX0, vy(230), VX1, vy(230), 'mf-grid')
      + txt(VX0, vy(203) + 24, 'station', 20, 'start', 'mf-mute') + txt(VX1, vy(203) + 24, tr('eind', 'end'), 20, 'end', 'mf-mute');
  }
  function voBand(a) {
    return op(a, rect(VX0, vy(253), VX1 - VX0, vy(207) - vy(253), 'mf-band', 0)
      + line(VX0, vy(253), VX1, vy(253), 'mf-dash') + line(VX0, vy(207), VX1, vy(207), 'mf-dash')
      + txt(VX0 + 10, vy(207) - 10, 'EN 50160: 230 V ±10%', 20, 'start', 'mf-on'));
  }
  const winter = (s) => 238 - 26 * s ** 0.8;
  const sunny = (s, over) => 238 + (13 + 7 * over) * s ** 1.2;
  function curve(fn, draw, cls) {
    if (draw <= 0.01) return '';
    const pts = [];
    for (let i = 0; i <= 40 * draw; i++) pts.push([vx(i / 40), vy(fn(i / 40))]);
    return `<path class="${cls}" d="${fmt(pts)}"/>`;
  }
  function voCurve(w, s, over) {
    let out = curve(winter, w, 'mf-line') + curve((x) => sunny(x, over), s, 'mf-l2');
    if (over > 0.05) {
      const xs = [];
      for (let i = 0; i <= 40; i++) { const v = sunny(i / 40, over); if (v > 253) xs.push([vx(i / 40), vy(v)]); }
      if (xs.length) out += op(over, `<circle class="mf-acc" cx="${f1(VX1)}" cy="${f1(vy(sunny(1, over)))}" r="6"/>` + txt(VX1 - 12, vy(sunny(1, over)) - 6, tr('omvormer uit', 'inverter off'), 20, 'end', 'mf-on'));
    }
    return out;
  }
  function voTxt(w, s, split) {
    const leg = op((1 - split) * w, line(222, 360, 246, 360, 'mf-line') + txt(254, 367, tr('winteravond', 'winter evening'), 20))
      + op((1 - split) * s, line(410, 360, 434, 360, 'mf-l2') + txt(442, 367, tr('zonnige middag', 'sunny afternoon'), 20));
    const sp = op(split, txt(222, 368, tr('band verdeeld:', 'band split:'), 20, 'start', 'mf-mute')
      + rect(370, 348, 100, 28, 'mf-tile', 4) + txt(420, 369, tr('MS', 'MV'), 20, 'middle', 'mf-mono')
      + rect(474, 348, 138, 28, 'fp-meter', 4, ' data-alt=""') + txt(543, 369, tr('LS', 'LV'), 20, 'middle', 'mf-mono'));
    return leg + sp;
  }

  // ------------------------------------------------------------ s5: two worst moments
  function twBase() { return PANEL(); }
  function twTiles(a1, a2) {
    const moon = `<path class="mf-acc" d="M322 78A24 24 0 1 0 342 116A20 20 0 0 1 322 78Z"/>`;
    let rays = '';
    for (let i = 0; i < 8; i++) { const t = (i * Math.PI) / 4; rays += line(522 + 22 * Math.cos(t), 102 + 22 * Math.sin(t), 522 + 32 * Math.cos(t), 102 + 32 * Math.sin(t), 'mf-accl'); }
    return op(a1, rect(222, 40, 190, 236, 'mf-tile', 8) + moon + txt(317, 168, tr('winteravond', 'winter evening'), 20, 'middle')
      + txt(317, 200, tr('afname', 'offtake'), 21, 'middle', 'mf-on') + txt(317, 240, tr('warmtepompen', 'heat pumps'), 20, 'middle', 'mf-mute') + txt(317, 264, tr('laadpalen', 'chargers'), 20, 'middle', 'mf-mute'))
      + op(a2, rect(426, 40, 192, 236, 'mf-tile', 8) + circ(522, 102, 15, 'mf-acc') + rays + txt(522, 168, tr('voorjaarsmiddag', 'spring afternoon'), 20, 'middle')
      + txt(522, 200, tr('invoeding', 'feed-in'), 21, 'middle', 'mf-on') + txt(522, 240, tr('weinig verbruik', 'low demand'), 20, 'middle', 'mf-mute') + txt(522, 264, tr('veel zon', 'lots of sun'), 20, 'middle', 'mf-mute'));
  }
  function twAsk(a) {
    return op(a, rect(222, 296, 396, 78, 'mf-accf', 8) + txt(420, 326, tr('wat is maatgevend?', 'what is decisive?'), 20, 'middle')
      + txt(420, 358, tr('afname of invoeding', 'offtake or feed-in'), 21, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ s6: the factory example
  const EB = 340;
  const AK = 0.45; // px per A
  const MK = 2.1; // px per MVA
  function e1Base() { return PANEL() + tag(EX); }
  function e1Bars(a, ask, add) {
    let out = op(a, txt(222, 44, tr('streng 300 A · piek 210 A', 'feeder 300 A · peak 210 A'), 20)
      + txt(222, 72, tr('station 80 MVA · piek 45', 'station 80 MVA · peak 45'), 20, 'start', 'mf-mute'));
    if (a <= 0.01) return out;
    out += line(232, EB, 612, EB);
    // the feeder: its rating, the peak, the factory's 144 A on top
    out += `<path class="mf-dash" d="M244 ${f1(EB - C.RATE * AK)}L340 ${f1(EB - C.RATE * AK)}"/>` + op(a, txt(348, EB - C.RATE * AK + 7, '300 A', 20, 'start', 'mf-on'));
    out += `<rect class="fp-meter" data-alt="" x="256" y="${f1(EB - C.PEAK_A * AK * a)}" width="64" height="${f1(C.PEAK_A * AK * a)}" rx="3"/>`;
    if (add > 0.01) {
      out += `<rect class="fp-meter" data-top="" x="256" y="${f1(EB - (C.PEAK_A + C.ADD_A * add) * AK)}" width="64" height="${f1(C.ADD_A * add * AK)}" rx="3"/>`;
      out += op(add, txt(288, EB - (C.PEAK_A + C.ADD_A) * AK - 10, '354 A · 118%', 21, 'middle', 'mf-on'));
    }
    out += txt(288, EB + 26, tr('streng', 'feeder'), 20, 'middle');
    // the station: 45 of 80
    out += `<path class="mf-dash" d="M508 ${f1(EB - C.ST * MK)}L604 ${f1(EB - C.ST * MK)}"/>`;
    out += `<rect class="fp-meter" data-alt="" x="524" y="${f1(EB - C.ST_PEAK * MK * a)}" width="64" height="${f1(C.ST_PEAK * MK * a)}" rx="3"/>`;
    out += txt(556, EB + 26, 'station', 20, 'middle');
    out += op(ask, rect(222, 92, 210, 30, 'mf-accf', 6) + txt(232, 114, tr('fabriek: +2,5 MVA', 'factory: +2.5 MVA'), 20, 'start', 'mf-on')
      + txt(612, EB - C.ST_PEAK * MK - 14, tr('sales: “half vol”', 'sales: “half full”'), 20, 'end', 'mf-txt'));
    out += op(add, txt(440, 114, '≈ 144 A', 20, 'start', 'mf-on'));
    return out;
  }
  function e1Opt(a) {
    if (a <= 0.01) return '';
    const rows = [tr('normaal openpunt verleggen', 'move the normally open point'), tr('eigen kabel vanaf station', 'dedicated cable from station'), tr('non-firm of buiten de piek', 'non-firm or outside the peak')];
    let out = rect(214, 136, 410, 244, 'mf-panel', 8);
    rows.forEach((t, i) => {
      const y = 152 + i * 74;
      out += rect(222, y, 396, 60, 'mf-tile', 6) + `<circle class="mf-acc" cx="250" cy="${y + 30}" r="15"/>` + txt(250, y + 37, `${i + 1}`, 20, 'middle', 'mf-inv') + txt(276, y + 37, t, 20);
    });
    return op(a, out);
  }

  // ------------------------------------------------------------ s7: N-1 on a one-line diagram
  const RY = 172;
  function n1Base() { return PANEL(); }
  function n1Net(trip) {
    const t1 = op(1 - 0.7 * trip, line(300, 30, 300, 52, 'mf-wire') + trafo(300, 76, 15) + line(300, 100, 300, RY, 'mf-wire'));
    const t2 = line(520, 30, 520, 52, 'mf-wire') + trafo(520, 76, 15) + line(520, 100, 520, RY, 'mf-wire');
    let out = t1 + t2 + txt(270, 82, 'T1', 20, 'end', 'mf-mono') + txt(550, 82, 'T2', 20, 'start', 'mf-mono');
    if (trip > 0.01) out += op(trip, line(284, 58, 316, 94, 'mf-accl') + line(316, 58, 284, 94, 'mf-accl'));
    for (const x of [300, 380, 460, 540]) out += line(x, RY, x, 228, 'mf-wire') + rect(x - 8, 228, 16, 16, 'mf-tile', 2);
    out += op(1 - trip, txt(420, 276, tr('N: alles in bedrijf', 'N: everything in service'), 20, 'middle', 'mf-txt'))
      + op(trip, txt(420, 276, tr('N-1: T1 uit, levering blijft', 'N-1: T1 out, supply stays'), 20, 'middle', 'mf-on'));
    return out;
  }
  function n1Rail() { return `<path class="mf-thick" d="M262 ${RY}L556 ${RY}"/>` + txt(564, RY + 7, tr('rail', 'busbar'), 20, 'start', 'mf-txt'); }
  function n1Txt(comp, notc) {
    return op(comp * (1 - notc), txt(420, 322, tr('trafo · kabel · lijn · rail', 'transformer · cable · line · busbar'), 20, 'middle', 'mf-on'))
      + op(notc, txt(222, 316, tr('niet: twee storingen tegelijk', 'not: two faults at once'), 20)
        + txt(222, 344, tr('niet: storing tijdens onderhoud', 'not: a fault during maintenance'), 20)
        + txt(222, 372, tr('onderhoud bij lage belasting', 'maintenance at low load'), 20, 'start', 'mf-mute'));
  }

  // ------------------------------------------------------------ s8: firm capacity
  const FB = 330;
  const FKM = 3; // px per MVA
  function fiBase() { return PANEL(); }
  function fiBars(a, reserve, cold) {
    if (a <= 0.01) return '';
    let out = line(232, FB, 612, FB);
    const h1 = C.UNIT * FKM * clamp(a * 2, 0, 1);
    const h2 = C.UNIT * FKM * clamp(a * 2 - 1, 0, 1);
    out += `<rect class="fp-meter" x="300" y="${f1(FB - h1)}" width="90" height="${f1(h1)}" rx="3"/>`;
    out += `<rect class="fp-meter" data-alt="" x="300" y="${f1(FB - C.UNIT * FKM - h2)}" width="90" height="${f1(h2)}" rx="3"/>`;
    out += op(a, txt(290, FB - 52, 'T1', 20, 'end', 'mf-mono') + txt(290, FB - C.UNIT * FKM - 52, 'T2', 20, 'end', 'mf-mono')
      + txt(408, FB - 2 * C.UNIT * FKM + 18, tr('opgesteld 80 MVA', 'installed 80 MVA'), 20, 'start', 'mf-mute'));
    const fy = FB - C.UNIT * FKM;
    out += op(a, `<path class="mf-dash" d="M240 ${fy}L612 ${fy}"/>` + txt(408, fy + 28, tr('vast ≈ 40 MVA', 'firm ≈ 40 MVA'), 21, 'start', 'mf-on'));
    if (reserve > 0.01) {
      let hatch = '';
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) hatch += line(308 + c * 14, fy - 10 - r * 28, 318 + c * 14, fy - 22 - r * 28, 'mf-hatch');
      out += op(reserve, hatch + txt(408, fy - 66, tr('reserve: staat stil', 'reserve: sits idle'), 20, 'start', 'mf-txt')
        + txt(222, 372, tr('half leeg én vol', 'half empty and full'), 21, 'start', 'mf-on'));
    }
    out += op(cold, `<rect class="fp-meter" data-top="" x="300" y="${fy - 12}" width="90" height="12" rx="2"/>` + txt(408, fy - 16, tr('kou: paar uur meer', 'cold: a few hours more'), 20, 'start', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ s9: the rules per voltage level
  function ruBase() { return PANEL(); }
  function ruRows(a1, a2, a3) {
    return op(a1, rect(222, 26, 396, 176, 'mf-tile', 6) + txt(238, 56, tr('HS: 110 kV en hoger', 'HV: 110 kV and above'), 21, 'start', 'mf-on')
      + txt(238, 86, tr('N-1 in de Energiewet', 'N-1 in the Energy Act'), 20) + txt(238, 114, tr('sinds 1 januari 2026', 'since 1 January 2026'), 20, 'start', 'mf-mute'))
      + op(a2, txt(238, 152, tr('hooguit kort uit; oude Netcode:', 'a short break at most; old code:'), 20)
        + txt(238, 182, tr('10 min, 100 MW, tot 6 uur', '10 min, 100 MW, up to 6 h'), 20, 'start', 'mf-mono'))
      + op(a3, rect(222, 214, 396, 74, 'mf-tile', 6) + txt(238, 244, tr('MS-ring', 'MV ring'), 21, 'start', 'mf-on') + txt(238, 272, tr('omschakelen: binnen uren', 'switch over: within hours'), 20)
        + rect(222, 300, 396, 74, 'mf-tile', 6) + txt(238, 330, tr('LS', 'LV'), 21, 'start', 'mf-on') + txt(238, 358, tr('wachten op de reparatie', 'wait for the repair'), 20));
  }

  // ------------------------------------------------------------ s10: the emergency lane
  function laBase() { return PANEL(); }
  function laRoad(a, clock, out) {
    if (a <= 0.01) return '';
    let s = rect(222, 36, 396, 128, 'mf-tile', 4) + rect(223, 120, 394, 43, 'mf-band', 0)
      + `<path class="mf-grid" style="stroke-dasharray:14 10;stroke-width:2" d="M222 78L618 78"/>` + line(222, 120, 618, 120);
    for (let i = 0; i < 4; i++) {
      const x = 230 + ((clock * 36 + i * 110) % 440) - 40;
      if (x > 226 && x < 560) s += `<rect class="fp-meter" x="${f1(x)}" y="${i % 2 ? 90 : 48}" width="52" height="22" rx="5"/>`;
    }
    // the non-firm user in the emergency lane: drives normally, pulls out when the reserve is needed
    const tx = 236 + ((clock * 24) % 140);
    s += op(1 - out, `<rect class="mf-acc" x="${f1(tx)}" y="128" width="84" height="26" rx="5"/>`);
    s += txt(612, 148, tr('vluchtstrook', 'emergency lane'), 20, 'end', 'mf-on');
    return op(a, s);
  }
  function laTxt(a1, a3, a4) {
    return op(a1, txt(222, 192, tr('non-firm: gebruikt de reserve', 'non-firm: uses the reserve'), 20, 'start', 'mf-txt')
      + txt(222, 220, tr('bij uitval of onderhoud: terug', 'curtailed at a fault or in maintenance'), 20, 'start', 'mf-mute'))
      + op(a3, txt(222, 260, tr('contract: wie draagt het risico?', 'contract: who carries the risk?'), 20)
        + txt(222, 288, tr('terugregelen binnen minuten', 'curtail within minutes'), 20, 'start', 'mf-mute'))
      + op(a4, rect(222, 304, 396, 74, 'mf-accf', 6) + txt(420, 334, tr('thermisch, of N-1-reserve?', 'thermal, or the N-1 reserve?'), 20, 'middle', 'mf-on')
        + txt(420, 362, tr('en als T2 in onderhoud is?', 'and if T2 is in maintenance?'), 20, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ s11: the redundancy example
  const XB = 330;
  const XK = 3.2; // px per MVA
  function e2Base() { return PANEL() + tag(EX, 620, 380); }
  function e2Bars(a, trip, idle) {
    let out = op(a, txt(222, 44, tr('piek 46 MVA · +2 per jaar', 'peak 46 MVA · +2 a year'), 20) + txt(222, 72, tr('nieuw station over 6 jaar', 'new station in 6 years'), 20, 'start', 'mf-mute')
      + rect(466, 98, 152, 36, 'mf-tile', 6) + txt(542, 123, tr('koelhuis 3', 'cold store 3'), 20, 'middle') + rect(466, 142, 152, 36, 'mf-tile', 6) + txt(542, 167, tr('batterij 4', 'battery 4'), 20, 'middle'));
    if (a <= 0.01) return out;
    const lim = XB - C.UNIT * XK;
    out += line(232, XB, 446, XB) + `<path class="mf-dash" d="M236 ${f1(lim)}L446 ${f1(lim)}"/>` + txt(236, lim - 8, '40', 20, 'start', 'mf-on');
    const each = (C.PEAK / 2) * a;
    const v1 = each * (1 - trip);
    const v2 = each + (C.PEAK / 2) * trip * a;
    out += op(1 - 0.6 * trip, `<rect class="fp-meter" data-alt="" x="262" y="${f1(XB - v1 * XK)}" width="64" height="${f1(v1 * XK)}" rx="3"/>`);
    const over = Math.max(0, v2 - C.UNIT);
    out += `<rect class="fp-meter" data-alt="" x="362" y="${f1(XB - Math.min(v2, C.UNIT) * XK)}" width="64" height="${f1(Math.min(v2, C.UNIT) * XK)}" rx="3"/>`;
    if (over > 0) out += `<rect class="fp-meter" data-top="" x="362" y="${f1(XB - v2 * XK)}" width="64" height="${f1(over * XK)}" rx="3"/>`;
    out += txt(294, XB + 26, 'T1', 20, 'middle', 'mf-mono') + txt(394, XB + 26, 'T2', 20, 'middle', 'mf-mono');
    out += op(trip, txt(394, XB - v2 * XK - 10, '115%', 21, 'middle', 'mf-on') + txt(466, 232, tr('6 boven N-1', '6 over N-1'), 20, 'start', 'mf-on'));
    if (idle > 0.01) {
      out += op(idle, rect(262, lim, 64, (C.UNIT - C.PEAK / 2) * XK, 'mf-accf', 3) + rect(362, lim, 64, (C.UNIT - C.PEAK / 2) * XK, 'mf-accf', 3)
        + txt(466, 268, '80 − 46 = 34', 21, 'start', 'mf-big') + txt(466, 296, tr('stil: non-firm', 'idle: non-firm'), 20, 'start', 'mf-on'));
    }
    return out;
  }
  function e2Txt(g) {
    return op(g, txt(466, 340, tr('3 jaar: 52 MVA', '3 years: 52 MVA'), 21, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['lf', 'rate', 'feed', 'volt', 'two', 'ex1', 'n1', 'firm', 'rules', 'lane', 'ex2'];
  set(E.lfBase, lfBase());
  set(E.raBase, raBase());
  set(E.feBase, feBase());
  set(E.voBase, voBase());
  set(E.twBase, twBase());
  set(E.e1Base, e1Base());
  set(E.n1Base, n1Base());
  set(E.n1Rail, n1Rail());
  set(E.fiBase, fiBase());
  set(E.ruBase, ruBase());
  set(E.laBase, laBase());
  set(E.e2Base, e2Base());
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let feed = 0;
    let flow = 0;
    let trip = 0;
    let feedT = 0;

    if (si === 0) {
      vis.lf = on(b, 1, p, 0, 0.12);
      feed = b === 0 ? span(p, 0.5, 0.8) : 1;
      flow = feed;
      feedT = feed;
      set(E.lfNet, lfNet(on(b, 1, p, 0.05, 0.5), on(b, 1, p, 0.6, 0.8)));
      set(E.lfBars, lfBars(on(b, 2, p, 0.05, 0.4), on(b, 2, p, 0.6, 0.85)));
    } else if (si === 1) {
      vis.rate = span(u, 0, 0.04);
      feed = 1;
      set(E.raCable, raCable(b === 0 ? span(p, 0.05, 0.3) : 1));
      set(E.raTxt, raTxt(on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.3)));
    } else if (si === 2) {
      vis.feed = span(u, 0, 0.04);
      feed = 1;
      feedT = 1;
      set(E.feBars, feBars(b === 0 ? span(p, 0.05, 0.5) : 1, on(b, 1, p, 0.2, 0.7)));
      set(E.feMap, feMap(on(b, 2, p, 0.05, 0.3)));
    } else if (si === 3) {
      // the voltage along the feeder (beats 1-4), then the two worst moments (beats 5-6)
      const two = on(b, 4, p, 0, 0.12);
      vis.volt = span(u, 0, 0.04) * (1 - two);
      vis.two = two;
      feed = b === 0 ? 1 : 0;
      flow = b === 0 ? 1 : 0;
      set(E.voBand, voBand(on(b, 2, p, 0.05, 0.4)));
      set(E.voCurve, voCurve(b === 0 ? span(p, 0.1, 0.7) : 1, on(b, 1, p, 0.1, 0.7), on(b, 3, p, 0.05, 0.4)));
      set(E.voTxt, voTxt(b === 0 ? span(p, 0.1, 0.4) : 1, on(b, 1, p, 0.1, 0.4), on(b, 3, p, 0.5, 0.8)));
      set(E.twTiles, twTiles(on(b, 4, p, 0.1, 0.3), on(b, 4, p, 0.5, 0.7)));
      set(E.twAsk, twAsk(on(b, 5, p, 0.1, 0.4)));
    } else if (si === 4) {
      vis.ex1 = span(u, 0, 0.04);
      feed = 1;
      flow = 1;
      set(E.e1Bars, e1Bars(b === 0 ? span(p, 0.05, 0.5) : 1, on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.4)));
      set(E.e1Opt, e1Opt(on(b, 3, p, 0.05, 0.25)));
    } else if (si === 5) {
      // N-1 on the one-line diagram (beats 1-3), then the rules per voltage level (beats 4-5)
      const rules = on(b, 3, p, 0, 0.12);
      vis.n1 = span(u, 0, 0.04) * (1 - rules);
      vis.rules = rules;
      trip = b === 0 ? span(p, 0.35, 0.6) : b === 1 ? 1 - span(p, 0, 0.2) : 0;
      feedT = 1;
      feed = b === 4 ? 1 : 0;
      set(E.n1Net, n1Net(trip));
      set(E.n1Txt, n1Txt(on(b, 1, p, 0.2, 0.5), on(b, 2, p, 0.05, 0.3)));
      set(E.ruRows, ruRows(on(b, 3, p, 0.1, 0.3), on(b, 3, p, 0.55, 0.75), on(b, 4, p, 0.05, 0.3)));
    } else if (si === 6) {
      vis.firm = span(u, 0, 0.04);
      feedT = 1;
      set(E.fiBars, fiBars(b === 0 ? span(p, 0.05, 0.6) : 1, on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.4)));
    } else if (si === 7) {
      vis.lane = span(u, 0, 0.04);
      const out = b === 0 ? span(p, 0.6, 0.85) * (1 - span(p, 0.92, 1)) : 0;
      set(E.laRoad, laRoad(1, clockS, out));
      set(E.laTxt, laTxt(b === 0 ? span(p, 0.1, 0.4) : 1, on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.3, 0.55)));
    } else if (si === 8) {
      vis.ex2 = span(u, 0, 0.04);
      trip = b === 1 ? span(p, 0.2, 0.45) : 0;
      feedT = 1;
      set(E.e2Bars, e2Bars(b === 0 ? span(p, 0.05, 0.4) : 1, trip, on(b, 2, p, 0.1, 0.4)));
      set(E.e2Txt, e2Txt(on(b, 3, p, 0.05, 0.3)));
    }

    // currents in the world: dashes along the feeder, the street cable and the transformer trenches
    const dash = f1(-clockS * 9);
    E.flowF.style.opacity = feed > 0.01 ? feed.toFixed(2) : '0';
    E.flowF.style.strokeDashoffset = dash;
    E.flow.style.opacity = flow > 0.01 ? flow.toFixed(2) : '0';
    E.flow.style.strokeDashoffset = dash;
    const t1 = feedT * (1 - trip);
    E.flowT1.style.opacity = t1 > 0.01 ? t1.toFixed(2) : '0';
    E.flowT2.style.opacity = feedT > 0.01 ? feedT.toFixed(2) : '0';
    E.flowT1.style.strokeDashoffset = dash;
    E.flowT2.style.strokeDashoffset = f1(-clockS * (9 + 9 * trip));
    const dim = trip > 0.01 ? (1 - 0.6 * trip).toFixed(2) : '';
    for (const el of T1) if (el.style.opacity !== dim) el.style.opacity = dim;
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
