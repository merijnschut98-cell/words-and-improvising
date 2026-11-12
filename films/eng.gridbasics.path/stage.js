// The stage of the film "Van onderstation tot stopcontact / From substation to
// socket": a pure function of (scene, u). Inlined into the page after the
// anatomy kit (iso-kit functions in scope) and a preamble from build.mjs that
// defines P (projection), C (the model's data), CAM (one camera move per
// scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global C, CAM, W, H, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  // repeated parts ship once (build.mjs, dedupe): each <g data-r> copies its template
  svg.querySelectorAll('[data-r]').forEach((el) => { el.innerHTML = svg.querySelector(`[data-t="${el.getAttribute('data-r')}"]`).innerHTML; });
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
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
  const cue = (name, body) => `<g data-cue="${name}">${body}</g>`;

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

  // ------------------------------------------------------------ s1: current and loss
  function lsBase() { return PANEL(); }
  function lsRule(a1, a2) {
    return op(a1, txt(222, 50, tr('vermogen = spanning × stroom', 'power = voltage × current'), 20)
      + txt(222, 80, tr('verlies in de kabel ~ stroom²', 'loss in the cable ~ current²'), 20, 'start', 'mf-on'))
      + op(a2, rect(222, 96, 396, 40, 'mf-tile', 6) + txt(420, 123, tr('10 × U → I : 10 → verlies : 100', '10 × U → I ÷ 10 → loss ÷ 100'), 20, 'middle', 'mf-mono'));
  }
  // the example: the current at 10 kV and at 150 kV as bars, then the loss
  const LB = 350;
  function lsBars(a, sum) {
    if (a <= 0.01) return '';
    let out = line(222, 156, 612, 156, 'mf-grid') + txt(222, 184, tr('windpark 100 MW', 'wind farm 100 MW'), 20) + tag(EX, 612, 184) + txt(222, 212, tr('I = P / (1,73 × U)', 'I = P / (1.73 × U)'), 20, 'start', 'mf-mono');
    out += line(232, LB, 452, LB);
    const h1 = 100 * a;
    const h2 = 100 * (C.I150 / C.I10) * a;
    out += `<rect class="fp-meter" data-alt="" x="252" y="${f1(LB - h1)}" width="76" height="${f1(h1)}" rx="3"/>`;
    out += `<rect class="fp-meter" data-top="" x="360" y="${f1(LB - Math.max(h2, 2))}" width="76" height="${f1(Math.max(h2, 2))}" rx="2"/>`;
    out += txt(290, LB - h1 - 10, tr('≈ 5.800 A', '≈ 5,800 A'), 20, 'middle', 'mf-mono') + txt(398, LB - 18, '≈ 385 A', 20, 'middle', 'mf-on');
    out += txt(290, LB + 26, '10 kV', 20, 'middle') + txt(398, LB + 26, '150 kV', 20, 'middle');
    out += op(sum, txt(470, 270, tr('15 × minder', '15 × less'), 20, 'start', 'mf-txt') + txt(470, 296, tr('stroom', 'current'), 20, 'start', 'mf-txt')
      + txt(470, 330, tr('≈ 225 × minder', '≈ 225 × less'), 20, 'start', 'mf-on') + txt(470, 356, tr('verlies', 'loss'), 20, 'start', 'mf-on'));
    return op(a, out);
  }

  // ------------------------------------------------------------ s2: the ladder of voltage levels
  const ROWS = [
    { key: 'ehs', nl: 'EHS', en: 'EHV', v: '380 · 220 kV' },
    { key: 'hs', nl: 'HS', en: 'HV', v: '150 · 110 kV' },
    { key: 'ts', nl: 'TS', en: 'IV', v: '50 · 25 kV' },
    { key: 'ms', nl: 'MS', en: 'MV', v: '10–20 kV' },
    { key: 'ls', nl: 'LS', en: 'LV', v: '400/230 V' },
  ];
  const RY = (i) => 36 + i * 58;
  function laBase() { return PANEL(); }
  function laRows(shown, lit) {
    let out = '';
    ROWS.forEach((r, i) => {
      const a = clamp(shown * ROWS.length - i, 0, 1);
      if (a <= 0.01) return;
      const y = RY(i);
      const body = rect(222, y, 232, 46, r.key === 'ts' ? 'mf-band' : 'mf-tile', 6) + txt(238, y + 31, tr(r.nl, r.en), 21, 'start', 'mf-on') + txt(296, y + 31, r.v, 20, 'start', 'mf-mono')
      out += op(a * (lit && lit !== r.key && !(lit === 'mvlv' && (r.key === 'ms' || r.key === 'ls')) ? 0.45 : 1), cue(r.key, body));
    });
    return out;
  }
  // brackets: TenneT over EHS and HS; the regional operators from TS down
  function laOwn(t, d) {
    const br = (y0, y1) => `<path class="mf-accl" d="M462 ${f1(y0)}H472V${f1(y1)}H462"/>`;
    return op(t, cue('tso', br(RY(0) + 4, RY(1) + 42) + txt(484, RY(0) + 40, 'TenneT', 21, 'start', 'mf-on') + txt(484, RY(0) + 68, tr('landelijk', 'national'), 20, 'start', 'mf-txt') + txt(484, RY(0) + 94, tr('van de Staat', 'state-owned'), 20, 'start', 'mf-mute')))
      + op(d, br(RY(2) + 4, RY(4) + 42) + txt(484, RY(3) + 6, tr('regionale', 'regional'), 20, 'start', 'mf-on') + txt(484, RY(3) + 32, tr('netbeheerders', 'grid operators'), 20, 'start', 'mf-on') + txt(484, RY(2) + 31, tr('soms TS', 'IV: some'), 20, 'start', 'mf-mute'));
  }

  // ------------------------------------------------------------ s3: who hangs on MV and on LV, and where a producer connects
  function mvBase() { return PANEL(); }
  function mvRows(ms, big, ls) {
    const tile = (y, name, v, sub, a, cls = 'mf-tile') => op(a, rect(222, y, 396, 92, cls, 6) + txt(238, y + 32, name, 21, 'start', 'mf-on') + txt(602, y + 32, v, 20, 'end', 'mf-mono') + sub);
    return tile(26, tr('MS', 'MV'), '10–20 kV', txt(238, y2(26), tr('onderstation → netstations', 'substation → distribution substations'), 20), ms)
      + op(big, txt(238, 136, tr('+ fabrieken en kassen', '+ factories and greenhouses'), 20, 'start', 'mf-on'))
      + tile(150, tr('LS', 'LV'), '400/230 V', txt(238, y2(150), tr('straatkabels → woningen', 'street cables → homes'), 20) + txt(238, y2(150) + 26, tr('en kleine bedrijven', 'and small businesses'), 20, 'start', 'mf-mute'), ls);
  }
  const y2 = (y) => y + 64;
  function mvConn(a) {
    return op(a, rect(222, 270, 194, 106, 'mf-accf', 6) + txt(238, 300, tr('windpark', 'wind farm'), 20) + txt(238, 328, '100 MW', 20, 'start', 'mf-mono') + txt(238, 358, '→ TenneT 150 kV', 20, 'start', 'mf-on')
      + rect(424, 270, 194, 106, 'mf-tile', 6) + txt(440, 300, tr('losse turbine,', 'single turbine,'), 20) + txt(440, 328, tr('klein zonnepark', 'small solar park'), 20) + txt(440, 358, tr('→ MS-net', '→ MV grid'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s4: the regional grid operators
  function dsBase() { return PANEL() + tag(SCH, 620, 380); }
  function dsTiles(a, mono, own) {
    if (a <= 0.01) return '';
    const T3 = [
      ['Enexis', tr('noorden, oosten, zuiden', 'north, east, south'), tr('(grote delen)', '(large parts)')],
      ['Liander', tr('Gelderland, Noord-Holland,', 'Gelderland, North Holland,'), tr('Flevoland, Friesland', 'Flevoland, Friesland')],
      ['Stedin', tr('Zuid-Holland, Utrecht,', 'South Holland, Utrecht,'), 'Zeeland'],
    ];
    let out = '';
    T3.forEach(([n, l1, l2], i) => {
      const y = 26 + i * 86;
      out += op(clamp(a * 3 - i, 0, 1), rect(222, y, 396, 76, 'mf-tile', 6) + txt(238, y + 30, n, 21, 'start', 'mf-on') + op(mono, txt(344, y + 30, l1, 20) + txt(344, y + 58, l2, 20, 'start', 'mf-mute')));
    });
    out += op(clamp(a * 3 - 2, 0, 1), txt(222, 300, tr('kleiner: Westland Infra,', 'smaller: Westland Infra,'), 20, 'start', 'mf-txt') + txt(222, 326, 'Coteq, Rendo', 20, 'start', 'mf-txt'));
    out += op(mono, txt(612, 300, tr('monopolie', 'a monopoly'), 20, 'end', 'mf-on') + txt(612, 326, tr('per gebied', 'per area'), 20, 'end', 'mf-on'));
    out += op(own, txt(222, 358, tr('bezit en beheer: MS en LS', 'own and run: MV and LV'), 20, 'start', 'mf-on'));
    return cue('dso', out);
  }

  // ------------------------------------------------------------ s5: the substation on a one-line diagram, and the boundary
  const BX = [360, 480];
  const RAILY = 168;
  function boBase() { return PANEL() + tag(EX); }
  function boNet(a, tx, rail, bound) {
    if (a <= 0.01) return '';
    let out = txt(222, 40, 'Tilburg', 21, 'start', 'mf-on') + line(300, 62, 540, 62, 'mf-thick') + txt(548, 69, '150 kV', 20, 'start', 'mf-mono');
    out += op(tx, BX.map((x) => line(x, 62, x, 80, 'mf-wire') + trafo(x, 104, 14) + line(x, 128, x, RAILY, 'mf-wire')).join('') + txt(500, 110, '150/10 kV', 20, 'start', 'mf-mono'));
    out += op(rail, cue('rail', `<path class="mf-thick" d="M300 ${RAILY}L540 ${RAILY}"/>`) + txt(548, RAILY + 7, '10 kV', 20, 'start', 'mf-mono')
      + [320, 370, 420, 470, 520].map((x) => line(x, RAILY, x, RAILY + 24, 'mf-wire') + circ(x, RAILY + 28, 4, 'mf-dot')).join(''));
    out += op(bound, `<path class="mf-dash" d="M222 142L612 142"/>` + txt(222, 132, tr('HS', 'HV'), 20, 'start', 'mf-on') + txt(222, 166, tr('MS', 'MV'), 20, 'start', 'mf-on')
      + txt(222, 230, tr('HS-kant: TenneT', 'HV side: TenneT'), 20, 'start', 'mf-on')
      + txt(222, 256, tr('MS-kant + kabels:', 'MV side + cables:'), 20, 'start', 'mf-on') + txt(222, 282, tr('regionale netbeheerder', 'the DSO'), 20, 'start', 'mf-on')
      + txt(222, 308, tr('trafo ertussen: eigenaar verschilt', 'transformer: owner differs'), 20, 'start', 'mf-mute'));
    return op(a, out);
  }
  function boAsk(a) {
    return op(a, rect(222, 320, 396, 60, 'mf-accf', 8) + txt(420, 345, tr('waar zit de grens:', 'where is the limit:'), 20, 'middle')
      + txt(420, 370, tr('HS- of MS-kant? wie handelt?', 'HV or MV side? who acts?'), 20, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ s6: the ring of 12 netstations, the open point, a fault between 6 and 7
  const RC = [440, 200];
  const RR = [150, 112];
  const NOP = 9; // the open point sits between station 9 and 10 (schema)
  // twelve stations round an ellipse, clockwise from the substation's feeder A (left) to feeder B
  const stAt = (i) => { const t = Math.PI - 0.32 - ((i - 1) / 11) * (2 * Math.PI - 0.64); return [RC[0] + RR[0] * Math.cos(t), RC[1] - RR[1] * Math.sin(t)]; };
  const SUB = [RC[0] - RR[0] - 20, RC[1]];
  function riBase() { return PANEL() + tag(SCH, 620, 380); }
  // fed: per station 0 (dark) or 1; fault: the X between 6 and 7; iso: switches opened; nop: open point closed
  function riNet(a, fed, fault, iso, nopC) {
    if (a <= 0.01) return '';
    const pts = [SUB, ...Array.from({ length: 12 }, (_, i) => stAt(i + 1)), SUB];
    let out = rect(SUB[0] - 26, SUB[1] - 26, 52, 52, 'mf-tile', 4) + trafo(SUB[0], SUB[1], 9);
    // the sections: SUB-1, 1-2, ... 12-SUB; section s joins pts[s] and pts[s+1]
    for (let s = 0; s <= 12; s++) {
      const [x0, y0] = pts[s];
      const [x1, y1] = pts[s + 1];
      if (s === NOP) {
        // the open point: a gap with a switch blade that closes
        const mx = (x0 + x1) / 2;
        const my = (y0 + y1) / 2;
        out += line(x0, y0, lerp(x0, x1, 0.35), lerp(y0, y1, 0.35), 'mf-wire') + line(lerp(x0, x1, 0.65), lerp(y0, y1, 0.65), x1, y1, 'mf-wire');
        const ang = lerp(0.9, 0, nopC);
        const bx = lerp(x0, x1, 0.35);
        const by = lerp(y0, y1, 0.35);
        const dx = (x1 - x0) * 0.3;
        const dy = (y1 - y0) * 0.3;
        const ex = bx + dx * Math.cos(ang) - dy * Math.sin(ang);
        const ey = by + dx * Math.sin(ang) + dy * Math.cos(ang);
        out += cue('nop', circ(mx, my, 16, 'mf-accf') + line(bx, by, ex, ey, 'mf-accl'));
        continue;
      }
      const cut = s === 6 ? fault : 0;
      out += cue('ring', line(x0, y0, x1, y1, cut > 0.5 ? 'mf-l2' : 'mf-wire'));
      if (s === 6 && fault > 0.01) {
        const mx = (x0 + x1) / 2;
        const my = (y0 + y1) / 2;
        out += op(fault, line(mx - 9, my - 9, mx + 9, my + 9, 'mf-accl') + line(mx + 9, my - 9, mx - 9, my + 9, 'mf-accl'));
        // the switches at both ends of the section, opened
        out += op(iso, circ(lerp(x0, x1, 0.18), lerp(y0, y1, 0.18), 5, 'mf-hollow') + circ(lerp(x0, x1, 0.82), lerp(y0, y1, 0.82), 5, 'mf-hollow'));
      }
    }
    for (let i = 1; i <= 12; i++) {
      const [x, y] = stAt(i);
      // a fed station is solid, a dark one an empty outline
      out += rect(x - 11, y - 11, 22, 22, 'mf-home', 3) + op(fed[i - 1], `<rect class="fp-meter" data-top="" x="${f1(x - 11)}" y="${f1(y - 11)}" width="22" height="22" rx="3"/>`);
      if (i === 1 || i === 6 || i === 7 || i === 12) out += txt(x + (x > RC[0] ? 18 : -18), y + 7, `${i}`, 20, x > RC[0] ? 'start' : 'end', i === 7 ? 'mf-on' : 'mf-mono');
    }
    return op(a, out);
  }
  function riTxt(a1, a3) {
    return op(a1 * (1 - a3), txt(222, 372, tr('10 kV · 12 netstations', '10 kV · 12 stations'), 20, 'start', 'mf-mono'))
      + op(a3, txt(222, 372, tr('gesloten: lastige beveiliging', 'closed: complex protection'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s7: inside netstation 7, and an MV room
  function ksBase() { return PANEL() + tag(EX, 620, 380); }
  function ksParts(a1, a2, a3) {
    let out = op(a1, rect(222, 30, 124, 150, 'mf-tile', 6) + line(240, 70, 328, 70, 'mf-thick') + line(260, 70, 260, 120, 'mf-wire') + line(310, 70, 310, 120, 'mf-wire') + line(284, 70, 284, 150, 'mf-wire')
      + txt(284, 58, tr('MS', 'MV'), 20, 'middle', 'mf-on') + txt(250, 146, tr('in', 'in'), 20, 'middle', 'mf-mute') + txt(318, 146, tr('uit', 'out'), 20, 'end', 'mf-mute') + txt(284, 206, tr('schakelaars', 'switches'), 20, 'middle'));
    out += op(a2, line(346, 105, 370, 105, 'mf-wire') + rect(370, 30, 124, 150, 'mf-tile', 6) + trafo(432, 92, 18) + txt(432, 160, '400 kVA', 20, 'middle', 'mf-on') + txt(432, 206, '10 kV → 400 V', 20, 'middle', 'mf-mono')
      + txt(222, 248, tr('meestal 400 of 630 kVA;', 'mostly 400 or 630 kVA;'), 20) + txt(222, 276, tr('oud 250, nieuw soms 1.000', 'older 250, some new 1,000'), 20, 'start', 'mf-mute'));
    if (a3 > 0.01) {
      let fz = '';
      for (let i = 0; i < 6; i++) fz += rect(520 + (i % 3) * 30, 52 + Math.floor(i / 3) * 62, 20, 44, 'fp-meter', 3, i === 0 ? ' data-top=""' : '');
      out += op(a3, line(494, 105, 510, 105, 'mf-wire') + cue('rack', rect(510, 30, 108, 150, 'mf-tile', 6) + fz) + txt(564, 206, tr('LS-rek', 'LV rack'), 20, 'middle')
        + txt(222, 318, tr('6 zekeringen, 6 straatkabels', '6 fuses, 6 street cables'), 20, 'start', 'mf-on'));
    }
    return out;
  }
  function ksRoom(a) {
    if (a <= 0.01) return '';
    let out = rect(204, 12, 428, 376, 'mf-panel', 8) + tag(SCH, 620, 380);
    out += rect(300, 60, 200, 250, 'mf-tile', 4);
    for (let f = 0; f < 4; f++) for (let w = 0; w < 4; w++) out += rect(318 + w * 44, 78 + f * 46, 30, 28, 'mf-band', 2);
    out += cue('msr', rect(300, 270, 200, 40, 'mf-accf', 2) + txt(400, 297, tr('MS-ruimte', 'MV room'), 20, 'middle', 'mf-on'));
    out += line(240, 310, 600, 310) + txt(400, 348, tr('kantoor of grote klant', 'office or large customer'), 20, 'middle', 'mf-txt');
    return op(a, out);
  }

  // ------------------------------------------------------------ s8: the street cable, the house connection and the meter
  function hoBase() { return PANEL(); }
  function hoStreet(a) {
    if (a <= 0.01) return '';
    let out = txt(222, 44, tr('LS-kabel: 35 woningen', 'LV cable: 35 homes'), 20, 'start', 'mf-txt') + line(226, 80, 612, 80, 'mf-wire');
    for (let i = 0; i < 35; i++) {
      const x = 232 + (i % 18) * 21.4;
      const up = i < 18;
      out += line(x + 7, 80, x + 7, up ? 66 : 94, 'mf-wire') + rect(x, up ? 52 : 94, 14, 14, i === 0 ? 'mf-acc' : 'mf-home', 2);
    }
    return op(a, out);
  }
  function hoBox(a, own) {
    if (a <= 0.01) return '';
    let out = rect(222, 136, 396, 156, 'mf-tile', 6) + txt(602, 162, tr('meterkast', 'meter cupboard'), 20, 'end', 'mf-mute');
    out += txt(238, 162, tr('aansluitkabel', 'connection cable'), 20, 'start', 'mf-mute') + `<path class="mf-wire" d="M244 172V236H290"/>`;
    out += cue('fuse', rect(290, 190, 120, 92, 'mf-accf', 4) + txt(350, 222, tr('hoofd-', 'main'), 20, 'middle', 'mf-on') + txt(350, 246, tr('zekering', 'fuse'), 20, 'middle', 'mf-on') + txt(350, 270, '3 × 25 A', 20, 'middle', 'mf-mono'));
    out += line(410, 236, 430, 236, 'mf-wire') + rect(430, 196, 80, 80, 'mf-home', 4) + rect(442, 208, 56, 24, 'mf-panel', 2) + txt(470, 262, tr('meter', 'meter'), 20, 'middle');
    out += line(510, 236, 544, 236, 'mf-wire') + circ(568, 236, 18, 'mf-wire') + circ(562, 236, 2.5, 'mf-dot') + circ(574, 236, 2.5, 'mf-dot');
    out += op(own, rect(222, 304, 290, 34, 'fp-meter', 4, ' data-alt=""') + txt(367, 328, tr('netbeheerder', 'grid operator'), 20, 'middle', 'mf-inv')
      + rect(516, 304, 102, 34, 'mf-tile', 4) + txt(567, 328, tr('eigenaar', 'owner'), 20, 'middle', 'mf-txt')
      + txt(222, 366, tr('t/m de meter', 'incl. the meter'), 20, 'start', 'mf-on'));
    return op(a, out);
  }
  // ------------------------------------------------------------ s9: by hand or remote
  function fiBase() { return PANEL(); }
  function fiTiles(a1, a2, a3) {
    const car = `<path class="mf-acc" d="M244 104h52l10 14h10v16h-80v-16z"/>` + circ(256, 136, 6, 'mf-dot') + circ(300, 136, 6, 'mf-dot');
    let ant = line(452, 80, 452, 132, 'mf-accl') + `<path class="mf-accl" d="M440 92a16 16 0 0 1 24 0M434 82a26 26 0 0 1 36 0"/>`;
    ant += rect(488, 96, 40, 40, 'mf-tile', 4) + circ(508, 116, 9, 'mf-acc');
    return op(a1, rect(222, 30, 194, 236, 'mf-tile', 8) + car + txt(238, 180, tr('met de hand', 'by hand'), 20, 'start', 'mf-on') + txt(238, 208, tr('monteur rijdt', 'a fitter drives'), 20) + txt(238, 232, tr('eerst erheen', 'there first'), 20))
      + op(a2, rect(424, 30, 194, 236, 'mf-tile', 8) + ant + txt(440, 180, tr('op afstand', 'remote'), 20, 'start', 'mf-on') + txt(440, 208, tr('+ kortsluit-', '+ fault passage'), 20) + txt(440, 232, tr('verklikkers', 'indicators'), 20))
      + op(a3, txt(319, 296, tr('≈ 2 uur', '≈ 2 hours'), 21, 'middle', 'mf-big') + txt(521, 296, '≈ 30 min', 21, 'middle', 'mf-big'));
  }
  function fiAsk(a) {
    return op(a, rect(222, 312, 396, 66, 'mf-accf', 8) + txt(420, 340, tr('waar zit het openpunt?', 'where is the open point?'), 20, 'middle')
      + txt(420, 366, tr('kan het op afstand?', 'can we switch it remotely?'), 20, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['loss', 'ladder', 'mvlv', 'dso', 'bound', 'ring', 'kiosk', 'room', 'house', 'field'];
  set(E.lsBase, lsBase());
  set(E.laBase, laBase());
  set(E.mvBase, mvBase());
  set(E.dsBase, dsBase());
  set(E.boBase, boBase());
  set(E.riBase, riBase());
  set(E.ksBase, ksBase());
  set(E.hoBase, hoBase());
  set(E.fiBase, fiBase());
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let hv = 0;
    let feed = 0;
    let flow = 0;
    let trench = 0;

    if (si === 0) {
      // the whole board first, then the line and the loss card
      vis.loss = on(b, 1, p, 0, 0.12);
      hv = b === 0 ? span(p, 0.4, 0.8) : 1;
      set(E.lsRule, lsRule(on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.3)));
      set(E.lsBars, lsBars(on(b, 3, p, 0.05, 0.5), on(b, 4, p, 0.05, 0.3)));
    } else if (si === 1) {
      vis.ladder = span(u, 0, 0.04);
      hv = 1;
      const shown = b === 0 ? lerp(0.2, 0.2, p) : b === 1 ? 0.4 : b === 2 ? 0.4 : lerp(0.4, 1, span(p, 0.05, 0.6));
      set(E.laRows, laRows(shown, b === 1 ? 'hs' : ''));
      set(E.laOwn, laOwn(on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.3, 0.6)));
    } else if (si === 2) {
      vis.mvlv = span(u, 0, 0.04);
      hv = 1;
      trench = 1;
      feed = 1;
      flow = on(b, 2, p, 0, 0.3);
      set(E.mvRows, mvRows(b === 0 ? span(p, 0.05, 0.3) : 1, on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.3)));
      set(E.mvConn, mvConn(on(b, 3, p, 0.05, 0.3)));
    } else if (si === 3) {
      vis.dso = span(u, 0, 0.04);
      feed = 1;
      flow = 1;
      set(E.dsTiles, dsTiles(b === 0 ? span(p, 0.05, 0.6) : 1, on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.3)));
    } else if (si === 4) {
      vis.bound = on(b, 1, p, 0, 0.12);
      hv = 1;
      trench = 1;
      feed = on(b, 2, p, 0.2, 0.6);
      set(E.boNet, boNet(on(b, 1, p, 0.05, 0.3), on(b, 1, p, 0.2, 0.5), on(b, 2, p, 0.05, 0.4), on(b, 3, p, 0.05, 0.4)));
      set(E.boAsk, boAsk(on(b, 4, p, 0.2, 0.45)));
    } else if (si === 5) {
      vis.ring = span(u, 0, 0.04);
      trench = 1;
      // fed per station: normally all; the fault drops 1-9 (the half on feeder A); isolating and
      // re-energising brings 1-6 back from the substation, closing the open point 7-9 from the other side
      const fault = on(b, 3, p, 0.05, 0.25);
      const iso = on(b, 3, p, 0.55, 0.8);
      const nopC = on(b, 4, p, 0.05, 0.35);
      const back16 = on(b, 4, p, 0.05, 0.3);
      const fed = Array.from({ length: 12 }, (_, i) => (i + 1 <= NOP ? (i + 1 <= 6 ? 1 - fault + fault * back16 : 1 - fault + fault * nopC) : 1));
      feed = 1 - fault + fault * back16;
      set(E.riNet, riNet(b === 0 ? span(p, 0.05, 0.5) : 1, fed, fault, iso, nopC));
      set(E.riTxt, riTxt(b === 0 ? span(p, 0.5, 0.8) : 1, on(b, 2, p, 0.05, 0.3) * (1 - on(b, 3, p, 0, 0.2))));
    } else if (si === 6) {
      const room = on(b, 4, p, 0, 0.15);
      vis.kiosk = on(b, 1, p, 0, 0.12) * (1 - room);
      vis.room = room;
      feed = 1;
      flow = 1;
      set(E.ksParts, ksParts(on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.05, 0.3)));
      set(E.ksRoom, ksRoom(1));
    } else if (si === 7) {
      vis.house = span(u, 0, 0.04);
      feed = 1;
      flow = 1;
      set(E.hoStreet, hoStreet(b === 0 ? span(p, 0.05, 0.5) : 1));
      set(E.hoBox, hoBox(on(b, 1, p, 0.05, 0.4), on(b, 2, p, 0.3, 0.6)));
    } else if (si === 8) {
      vis.field = span(u, 0, 0.04);
      feed = 1;
      set(E.fiTiles, fiTiles(b === 0 ? span(p, 0.05, 0.3) : 1, on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.3)));
      set(E.fiAsk, fiAsk(on(b, 3, p, 0.1, 0.4)));
    }

    // currents in the world: dashes along TenneT's line, the trenches, the ring cable and the street cable
    const dash = f1(-clockS * 9);
    for (const [el, a] of [[E.flowH, hv], [E.flowT1, trench], [E.flowT2, trench], [E.flowF, feed], [E.flow, flow]]) {
      el.style.opacity = a > 0.01 ? a.toFixed(2) : '0';
      el.style.strokeDashoffset = dash;
    }
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
