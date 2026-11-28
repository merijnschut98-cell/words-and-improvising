// The stage of the film "Flex en batterijen op een winteravond / Flex and
// batteries on a winter evening": a pure function of (scene, u). Inlined into
// the page after the anatomy kit (iso-kit functions in scope) and a preamble
// from build.mjs that defines P (projection), C (the model's data), CAM (one
// camera move per scene), W and H. Moves are placed per caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js)
// keeps them in step.
/* global C, CAM, W, H, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  // repeated parts ship once (build.mjs, dedupe): each <g data-r> copies its template
  svg.querySelectorAll('[data-r]').forEach((el) => { el.innerHTML = svg.querySelector(`[data-t="${el.getAttribute('data-r')}"]`).innerHTML; });
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const LAMPS = [0, 1, 2, 3, 4].map((i) => E[`lamp${i}`]);
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
  const U = tr(' u', ' h');
  // an arrow up (dir −1) or down (dir 1) at x, from y over length l
  const arrow = (x, y, l, dir, cls = 'mf-accl') => line(x, y, x, y + dir * l, cls) + line(x - 8, y + dir * (l - 9), x, y + dir * l, cls) + line(x + 8, y + dir * (l - 9), x, y + dir * l, cls);
  const bldg = (x, y, w, h, cls = 'mf-home') => `<path class="${cls}" d="M${f1(x)} ${f1(y + h * 0.35)}L${f1(x + w / 2)} ${f1(y)}L${f1(x + w)} ${f1(y + h * 0.35)}L${f1(x + w)} ${f1(y + h)}L${f1(x)} ${f1(y + h)}Z"/>`;
  const hatch = (x0, y0, x1, y1, step = 9) => {
    let s = '';
    for (let x = x0 - (y1 - y0); x < x1; x += step) {
      const a = Math.max(x, x0);
      const b = Math.min(x + (y1 - y0), x1);
      if (b > a) s += line(a, y1 - (a - x), b, y1 - (b - x), 'mf-hatchl');
    }
    return s;
  };

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

  // ------------------------------------------------------------ the winter weekday profile (s1, s5)
  // MW over the day: 5,8 from 17 to 20, never above 4,2 outside that window (schema)
  const PTS = [[0, 2.6], [5, 2.4], [8, 3.6], [12, 3.4], [15, 3.8], [17, 4.2], [17.25, 5.8], [19.75, 5.8], [20, 4.1], [22, 3.2], [24, 2.6]];
  const load = (h) => { for (let i = 1; i < PTS.length; i++) if (h <= PTS[i][0]) { const [a, va] = PTS[i - 1]; const [b, vb] = PTS[i]; return va + ((vb - va) * (h - a)) / (b - a); } return 2.6; };
  const X0 = 262;
  const X1 = 612;
  const PB = 300;
  const PK = 32; // px per MW
  const hx = (h) => X0 + ((X1 - X0) * h) / 24;
  const my = (v) => PB - v * PK;
  function prBase(ex) {
    let s = PANEL() + tag(ex ? EX : SCH) + txt(222, 40, tr('streng · winterse werkdag', 'feeder · winter weekday'), 20, 'start', 'mf-txt');
    s += line(X0, PB, X1, PB) + line(X0, PB, X0, my(7.8));
    for (const h of [0, 6, 12, 18, 24]) s += txt(hx(h), PB + 24, `${h}`, 20, 'middle', 'mf-mute');
    s += txt(X0 - 8, my(4.2) + 7, NL ? '4,2' : '4.2', 20, 'end', 'mf-mute') + txt(X0 - 8, PB + 7, '0', 20, 'end', 'mf-mute') + txt(X0 - 8, my(7.6) + 7, 'MW', 20, 'end', 'mf-mute');
    s += line(X0, my(4.2), X1, my(4.2), 'mf-grid');
    return s;
  }
  // the window, the limit and the curve; add: the cold store on top (mode 1 firm, 2 time-dependent)
  function prCurve(draw, win, store, mode, stretch) {
    let s = '';
    s += op(win, rect(hx(17), my(7.8), hx(20) - hx(17), PB - my(7.8), 'mf-band', 0) + txt((hx(17) + hx(20)) / 2, PB - 12, `17–20${U}`, 20, 'middle', 'mf-on'));
    s += op(stretch, `<rect class="mf-dashr" x="${f1(hx(16))}" y="${f1(my(7.8))}" width="${f1(hx(21) - hx(16))}" height="${f1(PB - my(7.8))}"/>` + txt(hx(15.6), PB - 44, `16–21${U}?`, 20, 'end', 'mf-on'));
    s += `<path class="mf-dash" d="M${X0} ${my(6)}L${X1} ${my(6)}"/>` + txt(X1, my(6) - 8, tr('grens 6 MW', 'limit 6 MW'), 20, 'end', 'mf-on');
    if (draw > 0.01) {
      const pts = [];
      const n = Math.round(96 * draw);
      for (let i = 0; i <= n; i++) pts.push([hx(i / 4), my(load(i / 4))]);
      if (store > 0.01) {
        const add = (h) => (mode === 1 ? STORE : (h < 17 || h > 20 ? STORE : 0));
        const top = [];
        for (let i = 0; i <= 96; i++) { const h = i / 4; top.push([hx(h), my(load(h) + add(h) * store)]); }
        const bot = [];
        for (let i = 96; i >= 0; i--) bot.push([hx(i / 4), my(load(i / 4))]);
        s += `<path class="mf-accf" d="${fmt([...top, ...bot])}Z"/>`;
      }
      s += `<path class="mf-line" d="${fmt(pts)}"/>`;
      if (draw > 0.98) s += txt(hx(18.5), my(5.8) + 26, NL ? '5,8' : '5.8', 20, 'middle', 'mf-mono');
    }
    return s;
  }
  const STORE = C.STORE;
  function prTop(a) {
    // the top of the peak: the few hours above 4,2
    if (a <= 0.01) return '';
    return op(a, `<rect class="mf-topband" x="${f1(hx(17))}" y="${f1(my(5.8))}" width="${f1(hx(20) - hx(17))}" height="${f1(my(4.2) - my(5.8))}"/>`
      + txt(X0 + 8, my(6.9), tr('top beperken: ruimte', 'limit the top: room'), 20, 'start', 'mf-on'));
  }
  function prYear(a) {
    return op(a, rect(X0, 338, X1 - X0, 16, 'fp-meter', 3, ' data-alt=""') + rect(X1 - 14, 338, 14, 16, 'fp-meter', 3, ' data-top=""')
      + txt(X0, 380, tr('8.760 u per jaar', '8,760 h a year'), 20, 'start', 'mf-mute') + txt(X1, 380, tr('paar honderd: vol', 'a few hundred: full'), 20, 'end', 'mf-on'));
  }
  function prEx(i, a) {
    const rows = [
      tr('koelhuis +1,5 MW · 3 u uit', 'cold store +1.5 MW · 3 h off'),
      tr('vast: 5,8 + 1,5 = 7,3 MW', 'firm: 5.8 + 1.5 = 7.3 MW'),
      tr('zonder 17–20: max 5,7 MW', 'without 17–20: max 5.7 MW'),
      tr('koud? meten? venster?', 'cold? metering? window?'),
    ];
    return op(a, txt(222, 380, rows[i], 21, 'start', i ? 'mf-on' : 'mf-txt'));
  }

  // ------------------------------------------------------------ s2: congestion management, step by step
  function cmRows(title, r1, r2, r3, r4) {
    const rows = [tr('eerst onderzoeken: Systeemcode', 'study first: System Code'), tr('piek een dag vooruit voorspellen', 'forecast the peak a day ahead'), tr('flexibele klanten oproepen', 'call the flexible customers'), tr('meetdata: geleverd?', 'metering data: delivered?')];
    let s = op(title, txt(222, 50, tr('contract of betaalde flex', 'contract or paid flex'), 21, 'start', 'mf-on'));
    [r1, r2, r3, r4].forEach((a, i) => {
      const y = 76 + i * 74;
      s += op(a, rect(222, y, 396, 60, 'mf-tile', 6) + `<circle class="mf-acc" cx="250" cy="${y + 30}" r="15"/>` + txt(250, y + 37, `${i + 1}`, 20, 'middle', 'mf-inv') + txt(276, y + 37, rows[i], 20));
    });
    return s;
  }

  // ------------------------------------------------------------ s3: GOPACS, redispatch, curtailment, the CSP
  function goTop(a) {
    return op(a, rect(338, 26, 164, 46, 'mf-tile', 6) + txt(420, 57, 'GOPACS', 21, 'middle', 'mf-big'));
  }
  function goRedis(a, bal) {
    if (a <= 0.01) return '';
    let s = line(380, 72, 316, 96, 'mf-wire') + line(460, 72, 522, 96, 'mf-wire');
    s += rect(222, 96, 188, 118, 'mf-band', 8) + txt(316, 122, tr('congestiegebied', 'congested area'), 20, 'middle', 'mf-txt') + bldg(244, 140, 40, 50, 'mf-tile') + arrow(330, 140, 52, 1) + txt(352, 186, '−', 24, 'start', 'mf-on');
    s += rect(426, 96, 192, 118, 'mf-tile', 8) + txt(522, 122, tr('erbuiten', 'outside'), 20, 'middle', 'mf-txt') + bldg(448, 140, 40, 50, 'mf-home') + arrow(534, 192, 52, -1) + txt(556, 186, '+', 24, 'start', 'mf-on');
    s += op(bal, txt(420, 240, tr('landelijke balans klopt', 'national balance holds'), 20, 'middle', 'mf-mute'));
    return op(a, s);
  }
  function goCurt(a) {
    if (a <= 0.01) return '';
    const base = 370;
    const pts = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push([236 + 164 * t, base - Math.min(56, 80 * Math.sin(Math.PI * t) ** 1.6)]); }
    const lost = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40; const v = 80 * Math.sin(Math.PI * t) ** 1.6; if (v > 56) lost.push([236 + 164 * t, base - v]); }
    let s = rect(222, 256, 188, 124, 'mf-tile', 6) + txt(232, 282, tr('aftoppen', 'clipping'), 20, 'start', 'mf-txt');
    if (lost.length) s += `<path class="mf-l2" d="${fmt(lost)}"/>`;
    s += `<path class="mf-line" d="${fmt(pts)}"/>` + `<path class="mf-dash" d="M236 ${base - 56}L400 ${base - 56}"/>` + txt(400, base - 62, '70%', 20, 'end', 'mf-on');
    return op(a, s);
  }
  function goCsp(a) {
    return op(a, rect(426, 256, 192, 124, 'mf-tile', 6) + txt(440, 290, 'CSP', 21, 'start', 'mf-big') + txt(440, 324, tr('biedt op GOPACS', 'bids on GOPACS'), 20)
      + txt(440, 358, tr('binnen uren', 'within hours'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s4: the contracts
  const BX0 = 238;
  const BX1 = 602;
  const bx = (h) => BX0 + ((BX1 - BX0) * h) / 24;
  function coTime(a) {
    if (a <= 0.01) return '';
    let s = rect(222, 26, 396, 148, 'mf-tile', 6) + txt(238, 58, tr('tijdsafhankelijk', 'time-dependent'), 21, 'start', 'mf-on');
    s += rect(BX0, 76, bx(17) - BX0, 26, 'fp-meter', 3) + rect(bx(20), 76, BX1 - bx(20), 26, 'fp-meter', 3);
    s += `<rect class="mf-dashr" x="${f1(bx(17))}" y="76" width="${f1(bx(20) - bx(17))}" height="26"/>` + hatch(bx(17), 76, bx(20), 102);
    s += txt(BX0, 126, '0', 20, 'middle', 'mf-mute') + txt(bx(17), 126, '17', 20, 'middle', 'mf-mute') + txt(bx(20), 126, '20', 20, 'middle', 'mf-mute') + txt(BX1, 126, '24', 20, 'middle', 'mf-mute');
    s += txt(238, 160, tr('namen veranderen: check regels', 'names change: check the rules'), 20, 'start', 'mf-mute');
    return op(a, s);
  }
  function coCbc(a, csc) {
    return op(a, rect(222, 184, 396, 86, 'mf-tile', 6) + txt(238, 216, tr('CBC: betaald beperken', 'CBC: paid to limit'), 21, 'start', 'mf-on')
      + txt(238, 252, tr('op verzoek', 'on request'), 20, 'start', 'mf-mute') + arrow(590, 202, 52, 1))
      + op(csc, rect(222, 284, 396, 96, 'mf-tile', 6) + txt(238, 318, tr('CSC · sinds mei 2026', 'CSC · since May 2026'), 21, 'start', 'mf-on')
        + txt(238, 354, tr('groepscontracten lopen door', 'group contracts continue'), 20, 'start', 'mf-txt'));
  }

  // ------------------------------------------------------------ s6: the limits of flex
  function liAll(a1, a2, a3, a4) {
    let s = '';
    s += op(a2, (() => {
      let c = txt(222, 48, tr('warmtepompen: langer', 'heat pumps: longer'), 20, 'start', 'mf-on') + line(BX0, 160, BX1, 160);
      c += rect(bx(17), 66, bx(20) - bx(17), 94, 'mf-band', 0) + `<rect class="mf-dashr" x="${f1(bx(16))}" y="66" width="${f1(bx(21) - bx(16))}" height="94"/>`;
      const pts = [];
      for (let i = 0; i <= 48; i++) { const h = i / 2; const v = h < 16 ? 0.3 + 0.2 * Math.sin(h / 4) : h <= 21 ? 0.92 - 0.04 * Math.abs(h - 18.5) : 0.35; pts.push([bx(h), 160 - 90 * v]); }
      c += `<path class="mf-line" d="${fmt(pts)}"/>` + txt(bx(16), 184, '16', 20, 'middle', 'mf-mute') + txt(bx(21), 184, '21', 20, 'middle', 'mf-mute');
      return c;
    })());
    s += op(a1, rect(222, 198, 396, 64, 'mf-tile', 6) + txt(238, 224, tr('reageert de klant echt?', 'does the customer respond?'), 20) + txt(238, 252, tr('voorspellen · meten', 'forecast · meter'), 20, 'start', 'mf-mute'));
    s += op(a3, txt(222, 292, tr('koopt tijd, vervangt verzwaren zelden', 'buys time, rarely replaces building'), 20, 'start', 'mf-txt'));
    s += op(a4, rect(222, 306, 396, 74, 'mf-accf', 6) + txt(420, 336, tr('hoeveel uur boven de grens?', 'how many hours over the limit?'), 20, 'middle', 'mf-on') + txt(420, 366, tr('en groeit dat?', 'and is it growing?'), 20, 'middle', 'mf-on'));
    return s;
  }

  // ------------------------------------------------------------ s7: the battery as tap and tank, and where it helps
  function baIntro(a) {
    return op(a, txt(222, 48, tr('nu laden, later ontladen', 'charge now, discharge later'), 21, 'start', 'mf-on'));
  }
  function baTank(a, level) {
    if (a <= 0.01) return '';
    const h = 180 * clamp(level, 0, 1);
    let s = rect(240, 80, 90, 190, 'mf-tile', 8) + `<rect class="fp-meter" x="248" y="${f1(262 - h)}" width="74" height="${f1(h)}" rx="4"/>`;
    for (let i = 1; i < 5; i++) s += line(322, 82 + i * 38, 330, 82 + i * 38, 'mf-axis');
    s += txt(285, 300, tr('MWh: tank', 'MWh: tank'), 20, 'middle', 'mf-txt');
    return op(a, s);
  }
  function baTap(a, flow, clock) {
    if (a <= 0.01) return '';
    let s = `<path class="mf-thick" d="M330 246L398 246L398 262"/>` + circ(372, 246, 9, 'mf-dot') + line(372, 237, 372, 226, 'mf-wire') + line(364, 226, 380, 226, 'mf-wire');
    if (flow > 0.01) for (let i = 0; i < 3; i++) { const y = 270 + ((clock * 30 + i * 9) % 26); s += `<circle class="mf-acc" cx="398" cy="${f1(y)}" r="${f1(2 + 2.5 * flow)}"/>`; }
    s += txt(398, 324, tr('MW: kraan', 'MW: tap'), 20, 'middle', 'mf-txt');
    return op(a, s);
  }
  function baNums(a) {
    return op(a, txt(436, 104, '10 MW', 21, 'start', 'mf-mono') + txt(436, 136, '20 MWh', 21, 'start', 'mf-mono') + txt(436, 176, tr('= 2 uur', '= 2 hours'), 21, 'start', 'mf-on')
      + txt(436, 224, tr('meestal 1–4 u', 'mostly 1–4 h'), 20, 'start', 'mf-mute') + txt(436, 256, tr('4 u piek: MWh', '4 h peak: MWh'), 20, 'start', 'mf-on'));
  }
  function baSun(a) {
    if (a <= 0.01) return '';
    const base = 150;
    let s = txt(222, 48, tr('zon: middag laden, avond leeg', 'sun: charge midday, empty evening'), 20, 'start', 'mf-txt') + line(BX0, base, BX1, base);
    const pts = [];
    for (let i = 0; i <= 40; i++) { const h = 7 + 11 * (i / 40); pts.push([bx(h), base - 80 * Math.sin(Math.PI * (i / 40)) ** 1.4]); }
    s += `<path class="mf-l2" d="${fmt(pts)}"/>`;
    for (let h = 11; h < 15; h += 1) s += `<rect class="fp-meter" data-top="" x="${f1(bx(h) + 2)}" y="${base - 34}" width="${f1(bx(1) - BX0 - 4)}" height="34" rx="2"/>`;
    for (let h = 17; h < 21; h += 1) s += `<rect class="fp-meter" data-alt="" x="${f1(bx(h) + 2)}" y="${base}" width="${f1(bx(1) - BX0 - 4)}" height="30" rx="2"/>`;
    s += txt(bx(13), base + 26, tr('laden', 'charge'), 20, 'middle', 'mf-on') + txt(bx(19), base + 54, tr('ontladen', 'discharge'), 20, 'middle', 'mf-mute');
    return op(a, s);
  }
  function baShave(a) {
    if (a <= 0.01) return '';
    const base = 360;
    const cut = 300;
    const yOf = (t) => base - (34 + 52 * Math.sin(Math.PI * t) ** 2 + 6 * Math.sin(t * 19));
    const pts = [];
    const over = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const x = 226 + 214 * t;
      const y = yOf(t);
      pts.push([x, Math.max(y, cut)]);
      over.push([x, Math.min(y, cut)]);
    }
    let s = txt(222, 238, 'peak shaving', 20, 'start', 'mf-txt') + line(226, base, 440, base);
    s += `<path class="mf-shave" d="${fmt([...over, [440, cut], [226, cut]])}Z"/>`;
    s += `<path class="mf-line" d="${fmt(pts)}"/>` + `<path class="mf-dash" d="M226 ${cut}L440 ${cut}"/>`;
    return op(a, s);
  }
  function baMeter(a) {
    if (a <= 0.01) return '';
    let s = line(470, 300, 488, 300, 'mf-wire') + rect(488, 284, 56, 32, 'mf-tile', 4) + txt(516, 307, 'kWh', 20, 'middle', 'mf-mono');
    s += line(544, 300, 562, 300, 'mf-wire') + bldg(562, 262, 50, 56, 'mf-tile') + rect(572, 326, 30, 16, 'mf-acc', 3);
    s += txt(466, 372, tr('achter de meter', 'behind the meter'), 20, 'start', 'mf-on');
    return op(a, s);
  }

  // ------------------------------------------------------------ s8: grid or market
  function mkChart(a, wind) {
    if (a <= 0.01) return '';
    const base = 186;
    let s = txt(222, 48, tr('landelijke prijs ≠ jouw streng', 'national price ≠ your feeder'), 20, 'start', 'mf-txt') + line(BX0, base, BX1, base);
    s += rect(bx(17), 64, bx(20) - bx(17), base - 64, 'mf-band', 0);
    const ld = [];
    for (let i = 0; i <= 48; i++) { const h = i / 2; ld.push([bx(h), base - 100 * (load(h) / 6)]); }
    s += `<path class="mf-line" d="${fmt(ld)}"/>`;
    const pr = [];
    for (let i = 0; i <= 48; i++) { const h = i / 2; const dip = wind * Math.exp(-(((h - 18.5) / 1.6) ** 2)); pr.push([bx(h), base - 70 - 20 * Math.sin((h - 4) / 3.8) + 72 * dip]); }
    s += `<path class="mf-l2" d="${fmt(pr)}"/>` + txt(BX1, 78, tr('prijs', 'price'), 20, 'end', 'mf-mute');
    if (wind > 0.01) {
      for (let h = 17.2; h < 20; h += 0.95) s += `<rect class="fp-meter" data-top="" x="${f1(bx(h))}" y="${f1(base - 24 * wind)}" width="${f1(bx(0.7) - BX0)}" height="${f1(24 * wind)}" rx="2"/>`;
      s += op(wind, txt(222, 222, tr('laadt in de piek · nieuwe pieken', 'charges in the peak · new peaks'), 20, 'start', 'mf-on'));
    }
    return op(a, s);
  }
  function mkYear(a, rest) {
    return op(a, rect(222, 240, 337, 28, 'fp-meter', 3) + rect(561, 240, 57, 28, 'fp-meter', 3, ' data-top=""')
      + txt(222, 298, tr('≥ 85% van de uren gegarandeerd', '≥ 85% of the hours guaranteed'), 20, 'start', 'mf-on'))
      + op(rest, txt(222, 330, tr('15% ≈ 1.300 u: dag vooraf', '15% ≈ 1,300 h: a day ahead'), 20, 'start', 'mf-txt')
        + txt(222, 362, tr('zonnepark + batterij: één aansluiting', 'solar farm + battery: one connection'), 20, 'start', 'mf-mute'));
  }
  function mkWho(a, q) {
    return op(a, txt(222, 56, tr('EU-richtlijn 2019/944', 'EU directive 2019/944'), 21, 'start', 'mf-on') + txt(222, 90, tr('netbeheerder: geen eigen batterij', 'grid operator: no own battery'), 20)
      + txt(222, 122, tr('stuurt via contract en prijs', 'steers by contract and price'), 20, 'start', 'mf-mute')
      + rect(222, 148, 140, 80, 'mf-tile', 6) + txt(292, 196, tr('net', 'grid'), 21, 'middle', 'mf-txt') + rect(478, 148, 140, 80, 'mf-tile', 6) + txt(548, 196, tr('markt', 'market'), 21, 'middle', 'mf-txt')
      + rect(388, 166, 64, 44, 'mf-acc', 5) + line(362, 188, 388, 188, 'mf-wire') + line(452, 188, 478, 188, 'mf-wire'))
      + op(q, txt(222, 270, tr('valkuil: piek verschoven', 'pitfall: the peak moved'), 20, 'start', 'mf-txt')
        + rect(222, 294, 396, 84, 'mf-accf', 6) + txt(420, 326, tr('wie stuurt in het piekuur:', 'who steers in the peak hour:'), 20, 'middle', 'mf-on') + txt(420, 360, tr('het net of de markt?', 'the grid or the market?'), 20, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ s9: the village battery
  const VB = 330;
  const VK = 0.48; // px per kVA
  function vaBars(a, bat, en, day) {
    let s = txt(222, 40, tr('dorp: trafo 400 kVA', 'village: 400 kVA'), 20, 'start', 'mf-txt');
    if (a <= 0.01) return s;
    const lim = VB - C.TRAFO * VK;
    s += op(a, line(232, VB, 330, VB) + `<rect class="fp-meter" data-alt="" x="248" y="${f1(lim)}" width="56" height="${f1(C.TRAFO * VK)}" rx="3"/>`
      + `<rect class="fp-meter" data-top="" x="248" y="${f1(VB - C.VPEAK * VK)}" width="56" height="${f1((C.VPEAK - C.TRAFO) * VK)}" rx="3"/>`
      + `<path class="mf-dash" d="M236 ${f1(lim)}L314 ${f1(lim)}"/>` + txt(318, lim + 7, '400', 20, 'start', 'mf-on') + txt(276, VB - C.VPEAK * VK - 10, '460', 20, 'middle', 'mf-mono')
      + txt(276, VB + 26, `17–20${U}`, 20, 'middle', 'mf-mute'));
    s += op(bat, rect(380, 66, 238, 76, 'mf-tile', 6) + txt(396, 96, tr('buurtbatterij', 'local battery'), 20) + txt(396, 128, '150 kW / 300 kWh', 20, 'start', 'mf-mono'));
    s += op(en, rect(380, 154, 238, 76, 'mf-accf', 6) + txt(396, 184, tr('60 kW × 3 u', '60 kW × 3 h'), 20, 'start', 'mf-txt') + txt(396, 216, '= 180 kWh', 21, 'start', 'mf-on'));
    if (day > 0.01) {
      let d = rect(380, 248, 238, 24, 'fp-meter', 3, ' data-alt=""');
      const dx = (h) => 380 + (238 * h) / 24;
      d += rect(dx(0), 248, dx(6) - dx(0), 24, 'fp-meter', 3, ' data-top=""') + rect(dx(12), 248, dx(15) - dx(12), 24, 'fp-meter', 3, ' data-top=""');
      d += `<rect class="mf-dashr" x="${f1(dx(17))}" y="248" width="${f1(dx(20) - dx(17))}" height="24"/>` + hatch(dx(17), 248, dx(20), 272, 7);
      d += txt(380, 302, tr('laden: nacht, middag', 'charge: night, noon'), 20, 'start', 'mf-on') + txt(380, 334, tr('17–20: niet handelen', '17–20: no trading'), 20, 'start', 'mf-txt');
      s += op(day, d);
    }
    return s;
  }
  function vaGrow(a, end) {
    if (a <= 0.01) return '';
    const base = 320;
    const kk = 0.56;
    let s = txt(222, 40, tr('groei 20 kVA per jaar', 'growth 20 kVA a year'), 20, 'start', 'mf-txt') + line(240, base, 612, base);
    const cap = base - C.BAT_KWH * kk;
    s += `<path class="mf-dash" d="M240 ${f1(cap)}L612 ${f1(cap)}"/>` + txt(240, cap - 10, tr('batterij 300 kWh', 'battery 300 kWh'), 20, 'start', 'mf-on');
    ['nu', '+1', '+2', '+3'].forEach((lab, i) => {
      const v = (C.VPEAK - C.TRAFO + C.GROW * i) * C.HOURS;
      const x = 262 + i * 90;
      const h = Math.min(v, C.BAT_KWH) * kk * a;
      s += `<rect class="fp-meter" data-alt="" x="${x}" y="${f1(base - h)}" width="56" height="${f1(h)}" rx="3"/>`;
      if (v > C.BAT_KWH) s += `<rect class="fp-meter" data-top="" x="${x}" y="${f1(base - v * kk * a)}" width="56" height="${f1((v - C.BAT_KWH) * kk * a)}" rx="3"/>`;
      s += txt(x + 28, base + 26, i ? lab : tr('nu', 'now'), 20, 'middle', 'mf-mute') + op(a, txt(x + 28, base - v * kk - 10, `${v}`, 20, 'middle', v > C.BAT_KWH ? 'mf-on' : 'mf-mono'));
    });
    s += op(end, txt(222, 380, tr('≈ 2 jaar; dan trafo 630 kVA', '≈ 2 years; then 630 kVA'), 21, 'start', 'mf-on'));
    return op(a, s);
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['prof', 'cm', 'gop', 'con', 'lim', 'bat', 'mkt', 'vil'];
  set(E.cmBase, PANEL());
  set(E.goBase, PANEL());
  set(E.coBase, PANEL());
  set(E.liBase, PANEL());
  set(E.baBase, PANEL());
  set(E.mkBase, PANEL() + tag(SCH));
  set(E.viBase, PANEL() + tag(EX));
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let feed = 0;
    let flow = 0;
    let bflow = 0; // battery current: + charging, − discharging
    let charge = 0.5;

    if (si === 0) {
      vis.prof = span(u, 0, 0.04);
      feed = 1;
      flow = 1;
      set(E.prBase, prBase(false));
      set(E.prCurve, prCurve(b === 0 ? span(p, 0.05, 0.6) : 1, b === 0 ? span(p, 0.5, 0.8) : 1, 0, 0, 0));
      set(E.prTop, prTop(on(b, 2, p, 0.1, 0.4)));
      set(E.prFoot, prYear(on(b, 1, p, 0.05, 0.3)));
    } else if (si === 1) {
      vis.cm = span(u, 0, 0.04);
      feed = 1;
      set(E.cmRows, cmRows(b === 0 ? span(p, 0.05, 0.3) : 1, on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.25), on(b, 2, p, 0.3, 0.5), on(b, 2, p, 0.6, 0.8)));
    } else if (si === 2) {
      vis.gop = span(u, 0, 0.04);
      feed = 1;
      set(E.goTop, goTop(b === 0 ? span(p, 0.05, 0.25) : 1));
      set(E.goRedis, goRedis(b === 0 ? span(p, 0.3, 0.55) : 1, b === 0 ? span(p, 0.7, 0.9) : 1));
      set(E.goCurt, goCurt(on(b, 1, p, 0.05, 0.3)));
      set(E.goCsp, goCsp(on(b, 2, p, 0.05, 0.3)));
    } else if (si === 3) {
      vis.con = span(u, 0, 0.04);
      feed = 1;
      set(E.coTime, coTime(b === 0 ? span(p, 0.05, 0.3) : 1));
      set(E.coCbc, coCbc(on(b, 1, p, 0.05, 0.3), on(b, 1, p, 0.5, 0.7)));
    } else if (si === 4) {
      vis.prof = span(u, 0, 0.04);
      feed = 1;
      flow = 1;
      const mode = b <= 1 ? 1 : 2;
      const store = b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.5) : 1;
      set(E.prBase, prBase(true));
      set(E.prCurve, prCurve(1, 1, store, mode, on(b, 3, p, 0.3, 0.6)));
      set(E.prTop, op(b === 1 ? span(p, 0.5, 0.7) : 0, txt(hx(18.5), my(7.3) - 10, NL ? '7,3' : '7.3', 21, 'middle', 'mf-on'))
        + op(b === 2 ? span(p, 0.5, 0.7) : 0, txt(hx(14), my(5.7) - 30, NL ? '5,7' : '5.7', 21, 'middle', 'mf-on')));
      set(E.prFoot, prEx(b, b === 0 ? span(p, 0.05, 0.3) : span(p, 0, 0.2)));
    } else if (si === 5) {
      vis.lim = span(u, 0, 0.04);
      feed = 1;
      set(E.liRows, liAll(b === 0 ? span(p, 0.05, 0.3) : 1, on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.05, 0.3)));
    } else if (si === 6) {
      vis.bat = span(u, 0, 0.04);
      const sun = on(b, 3, p, 0, 0.12);
      // the battery charges and then discharges while the tap and tank are shown
      const cyc = b <= 2 ? (Math.sin((clockS / 9) * Math.PI) + 1) / 2 : 0.5;
      charge = b <= 2 ? cyc : b === 3 ? (p < 0.5 ? span(p, 0, 0.5) : 1 - span(p, 0.5, 1)) : 0.6;
      bflow = b <= 2 ? Math.cos((clockS / 9) * Math.PI) : b === 3 ? (p < 0.5 ? 1 : -1) : 0;
      const keep = 1 - sun;
      set(E.baIntro, op(keep, baIntro(b === 0 ? span(p, 0.05, 0.3) : 1)));
      set(E.baTank, op(keep, baTank(on(b, 1, p, 0.05, 0.3), cyc)));
      set(E.baTap, op(keep, baTap(on(b, 1, p, 0.3, 0.55), Math.abs(bflow), clockS)));
      set(E.baNums, op(keep, baNums(on(b, 2, p, 0.05, 0.3))));
      set(E.baSun, op(sun, baSun(1)));
      set(E.baShave, baShave(on(b, 4, p, 0.05, 0.3)));
      set(E.baMeter, baMeter(on(b, 4, p, 0.35, 0.6)));
    } else if (si === 7) {
      vis.mkt = span(u, 0, 0.04);
      const who = on(b, 4, p, 0, 0.12);
      const wind = on(b, 1, p, 0.05, 0.4);
      bflow = b === 1 ? 1 : 0;
      charge = b === 1 ? 0.3 + 0.6 * span(p, 0.1, 0.9) : 0.5;
      set(E.mkA, op(1 - who, mkChart(b === 0 ? span(p, 0.05, 0.4) : 1, wind)));
      set(E.mkYear, op(1 - who, mkYear(on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.05, 0.3))));
      set(E.mkB, op(who, mkWho(1, on(b, 5, p, 0.05, 0.3))));
    } else if (si === 8) {
      vis.vil = span(u, 0, 0.04);
      const grow = on(b, 4, p, 0, 0.12);
      flow = b <= 2 ? 1 : 0;
      if (b === 3) { charge = span(p, 0.1, 0.6); bflow = p < 0.6 ? 1 : 0; }
      if (b === 2) { charge = 1 - 0.6 * span(p, 0.2, 0.8); bflow = -1; }
      set(E.viA, op(1 - grow, vaBars(b === 0 ? span(p, 0.05, 0.4) : 1, on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.05, 0.3))));
      set(E.viB, op(grow, vaGrow(b === 4 ? span(p, 0.1, 0.6) : b > 4 ? 1 : 0, on(b, 5, p, 0.05, 0.3))));
    }

    // currents in the world: dashes along the feeder, the street cable and the battery's duct
    const dash = f1(-clockS * 9);
    E.flowF.style.opacity = feed > 0.01 ? feed.toFixed(2) : '0';
    E.flowF.style.strokeDashoffset = dash;
    E.flow.style.opacity = flow > 0.01 ? flow.toFixed(2) : '0';
    E.flow.style.strokeDashoffset = dash;
    E.flowB.style.opacity = Math.abs(bflow) > 0.05 ? Math.min(1, Math.abs(bflow) * 1.5).toFixed(2) : '0';
    E.flowB.style.strokeDashoffset = f1(clockS * 9 * Math.sign(bflow || 1));
    // the charge lamps on the container: one per fifth of its energy
    LAMPS.forEach((el, i) => { const lit = charge > i / 5 + 0.04; if (el.__l !== lit) { el.__l = lit; if (lit) el.setAttribute('data-lit', ''); else el.removeAttribute('data-lit'); } });
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
