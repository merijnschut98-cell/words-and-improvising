// The stage of the film "Een vol net / A full grid": a pure function of
// (scene, u). Inlined into the page after the anatomy kit (iso-kit functions in
// scope) and a preamble from build.mjs that defines P (projection), C (the
// model's data), CAM (one camera move per scene), W and H. Moves are placed per
// caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
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
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8, extra = '') => `<rect class="${cls}"${extra} x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const tag = (t, x = 620, y = 40, anchor = 'end') => txt(x, y, t, 20, anchor, 'mf-mute');
  const PANEL = (x0 = 204) => rect(x0, 12, 632 - x0, 376);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);
  // a small building: a block with a pitched roof (w × h), its door a slot
  const bldg = (x, y, w, h, cls = 'mf-home') => `<path class="${cls}" d="M${f1(x)} ${f1(y + h * 0.35)}L${f1(x + w / 2)} ${f1(y)}L${f1(x + w)} ${f1(y + h * 0.35)}L${f1(x + w)} ${f1(y + h)}L${f1(x)} ${f1(y + h)}Z"/>`;

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

  // ------------------------------------------------------------ s1: demand against the grid's limits over a day
  const CX0 = 250;
  const CX1 = 604;
  const CZ = 236; // zero: nothing taken, nothing fed in
  const CTOP = 118; // the limit for consumption
  const CBOT = 344; // the limit for feed-in
  const chx = (h) => CX0 + ((CX1 - CX0) * h) / 24;
  // consumption above zero, an evening peak just over the limit; with sun, a midday dip below zero
  const use = (h) => 62 + 30 * Math.exp(-(((h - 8) / 1.6) ** 2)) + 80 * Math.exp(-(((h - 18.4) / 1.7) ** 2));
  const sun = (h) => 190 * Math.exp(-(((h - 13) / 2.4) ** 2));
  function congBase() {
    return PANEL() + tag(tr('schema', 'diagram'))
      + line(CX0, CZ, CX1, CZ, 'mf-grid') + line(CX0, 60, CX0, 372)
      + `<path class="mf-dash" d="M${CX0} ${CTOP}L${CX1} ${CTOP}"/>` + txt(CX0 + 6, CTOP - 10, tr('grens afname', 'limit, consumption'), 20, 'start', 'mf-on')
      + txt(CX1, CZ + 24, tr('24 uur', '24 h'), 20, 'end', 'mf-mute') + txt(CX0 - 8, CZ + 7, '0', 20, 'end', 'mf-mute');
  }
  function congCurve(draw, over, feed) {
    let out = '';
    if (draw > 0.01) {
      const pts = [];
      for (let h = 0; h <= 24 * draw + 1e-9; h += 0.25) pts.push([chx(h), CZ - use(h)]);
      out += `<path class="mf-line" d="${fmt(pts)}"/>`;
    }
    if (over > 0.01) {
      // the evening peak above the limit, filled
      const pts = [];
      for (let h = 15; h <= 22; h += 0.1) { const y = CZ - use(h); if (y < CTOP) pts.push([chx(h), y]); }
      if (pts.length > 1) out += op(over, `<path class="mf-accf" d="${fmt([[pts[0][0], CTOP], ...pts, [pts[pts.length - 1][0], CTOP]])}Z"/>` + txt(pts[pts.length - 1][0] + 8, CTOP - 34, tr('piek', 'peak'), 21, 'start', 'mf-on'));
    }
    if (feed > 0.01) {
      const pts = [];
      for (let h = 0; h <= 24; h += 0.25) pts.push([chx(h), CZ - (use(h) - sun(h) * feed) * 1]);
      out += `<path class="mf-l2" d="${fmt(pts)}"/>`;
      out += op(feed, `<path class="mf-dash" d="M${CX0} ${CBOT}L${CX1} ${CBOT}"/>` + txt(CX0 + 6, CBOT + 26, tr('grens invoeding', 'limit, feed-in'), 20, 'start', 'mf-on'));
      const dip = [];
      for (let h = 9; h <= 17; h += 0.1) { const y = CZ - (use(h) - sun(h)); if (y > CBOT) dip.push([chx(h), y]); }
      if (dip.length > 1 && feed > 0.6) out += op(span(feed, 0.6, 1), `<path class="mf-accf" d="${fmt([[dip[0][0], CBOT], ...dip, [dip[dip.length - 1][0], CBOT]])}Z"/>`);
    }
    return out;
  }
  function congTxt(a1, a2) {
    return op(a1, txt(CX0 + 6, 206, tr('afname: een bedrijventerrein', 'consumption: an industrial area'), 20, 'start', 'mf-txt'))
      + op(a2, txt(612, CBOT - 10, tr('invoeding: zonneparken', 'feed-in: solar parks'), 20, 'end', 'mf-txt'));
  }

  // ------------------------------------------------------------ s2: the waiting list and the capacity map
  const QY = 150;
  function queueBase() { return PANEL(); }
  function queueLine(a, small) {
    let out = '';
    if (a > 0.01) {
      out += rect(232, QY - 34, 10, 58, 'mf-tile', 2) + line(242, QY - 26, 274, QY - 26, 'mf-accl');
      for (let i = 0; i < 8; i++) {
        const x = 286 + i * 40 + (1 - a) * 200;
        if (x > 600) continue;
        out += bldg(x, QY - 18, 28, 32, i === 0 ? 'mf-homeOn' : 'mf-home');
      }
      out += op(a, txt(232, QY + 44, tr('wachtrij: duizenden bedrijven', 'waiting list: thousands of firms'), 20, 'start', 'mf-txt'));
    }
    if (small > 0.01) {
      for (let i = 0; i < 4; i++) out += op(small, bldg(236 + i * 30 + (1 - small) * 40, QY + 58, 18, 20, 'mf-home'));
      out += op(small, txt(356, QY + 76, tr('ook klein, sinds juli 2026', 'small too, since July 2026'), 20, 'start', 'mf-txt'));
    }
    return out;
  }
  function queueTxt(a) {
    return op(a, txt(232, 50, tr('grootverbruiker', 'large consumer'), 21, 'start', 'mf-on')
      + txt(232, 80, tr('boven 3 × 80 A ≈ 55 kVA', 'above 3 × 80 A ≈ 55 kVA'), 21, 'start', 'mf-big'));
  }
  // a capacity map: a coarse grid of areas, full (accent), limited (mid) or with room (light)
  const MAPC = [
    '..ffl...l.',
    '.fffl..ll.',
    'lfflll.lf.',
    '.llll.lff.',
  ];
  function queueMap(a) {
    if (a <= 0.01) return '';
    let out = tag(EX, 620, 380);
    MAPC.forEach((row, r) => [...row].forEach((ch, c) => {
      const x = 236 + c * 26;
      const y = 262 + r * 26;
      const cls = ch === 'f' ? 'mf-acc' : ch === 'l' ? 'fp-meter' : 'mf-tile';
      out += `<rect class="${cls}"${ch === 'l' ? ' data-alt=""' : ''} x="${x}" y="${y}" width="22" height="22" rx="3"/>`;
    }));
    const lx = 510;
    out += `<rect class="mf-acc" x="${lx}" y="262" width="16" height="16" rx="3"/>` + txt(lx + 24, 277, tr('vol', 'full'), 20)
      + `<rect class="fp-meter" data-alt="" x="${lx}" y="292" width="16" height="16" rx="3"/>` + txt(lx + 24, 307, tr('beperkt', 'limited'), 20)
      + `<rect class="mf-tile" x="${lx}" y="322" width="16" height="16" rx="3"/>` + txt(lx + 24, 337, tr('ruimte', 'room'), 20);
    return op(a, out);
  }

  // ------------------------------------------------------------ s3: build times, and the full substation
  const YX0 = 290;
  const YX1 = 600;
  const yx = (y) => YX0 + ((YX1 - YX0) * y) / 10;
  function yearsBase() {
    let out = PANEL() + line(YX0, 128, YX1, 128);
    for (const y of [0, 5, 10]) out += line(yx(y), 128, yx(y), 134) + txt(yx(y), 154, `${y}`, 20, 'middle', 'mf-mute');
    return out + txt(YX1, 176, tr('jaar', 'years'), 20, 'end', 'mf-mute');
  }
  function yearsBars(a, scarce) {
    return op(a, txt(222, 46, tr('nieuw onderstation', 'new substation'), 20) + rect(yx(5), 56, yx(10) - yx(5), 18, 'mf-accf', 4)
      + txt(222, 98, tr('MS-verzwaring', 'MV reinforcement'), 20) + rect(yx(0.3), 106, yx(2) - yx(0.3), 14, 'fp-meter', 4, ' data-alt=""'))
      + op(scarce, txt(222, 204, tr('schaars: monteurs, trafo’s, ruimte', 'scarce: crews, transformers, space'), 20, 'start', 'mf-txt'));
  }
  const SB = 368;
  const SK = 4.0; // px per MVA
  function yearsSub(a, ask, wait) {
    if (a <= 0.01) return '';
    let out = tag(EX, 620, 290) + line(300, SB, 470, SB);
    out += `<path class="mf-dash" d="M300 ${f1(SB - C.S_SUB * SK)}L470 ${f1(SB - C.S_SUB * SK)}"/>` + txt(222, SB - C.S_SUB * SK + 7, `${C.S_SUB} MVA`, 20, 'start', 'mf-on');
    out += `<rect class="fp-meter" data-alt="" x="340" y="${f1(SB - C.PEAK * SK * a)}" width="56" height="${f1(C.PEAK * SK * a)}" rx="3"/>`;
    out += op(a, txt(406, SB - (C.PEAK * SK) / 2 + 7, tr(`piek ${C.PEAK}`, `peak ${C.PEAK}`), 20));
    if (ask > 0.01) {
      out += `<rect class="fp-meter" data-top="" x="340" y="${f1(SB - (C.PEAK + C.ASK * ask) * SK)}" width="56" height="${f1(C.ASK * ask * SK)}" rx="3"/>`;
      out += op(ask, txt(406, SB - (C.PEAK + C.ASK) * SK + 10, tr(`+ ${C.ASK} gevraagd`, `+ ${C.ASK} requested`), 20, 'start', 'mf-on'));
    }
    out += op(wait, rect(486, 300, 132, 64, 'mf-accf', 6) + txt(552, 326, tr('wachtrij', 'waiting list'), 20, 'middle', 'mf-txt') + txt(552, 354, tr(`± ${C.YEARS} jaar`, `± ${C.YEARS} years`), 21, 'middle', 'mf-big'));
    return out;
  }

  // ------------------------------------------------------------ s4: the load-duration curve
  const LX0 = 262;
  const LX1 = 604;
  const LB = 330;
  const LK = 8.4; // px per MVA
  const lx = (h) => LX0 + ((LX1 - LX0) * h) / C.YEAR_H;
  const ly = (v) => LB - v * LK;
  // sorted load: the year's 8.760 hours from high to low; 29 MVA at the top, 24 MVA at 180 h
  const TAU = -C.HRS / Math.log((C.LIM - 10 - 9 * (1 - C.HRS / C.YEAR_H)) / 10);
  const load = (h) => 10 + 9 * (1 - h / C.YEAR_H) + 10 * Math.exp(-h / TAU);
  function ldcBase() {
    let out = PANEL() + tag(EX) + line(LX0, LB, LX1, LB) + line(LX0, LB, LX0, ly(32));
    for (const v of [10, 20, 30]) out += line(LX0 - 6, ly(v), LX0, ly(v)) + txt(LX0 - 10, ly(v) + 7, `${v}`, 20, 'end', 'mf-mute');
    out += txt(LX0 - 10, ly(32) - 8, 'MVA', 20, 'start', 'mf-mute');
    out += txt(LX0, LB + 26, '0', 20, 'middle', 'mf-mute') + txt(LX1, LB + 26, tr('8.760 uur', '8,760 h'), 20, 'end', 'mf-mute');
    out += `<path class="mf-dash" d="M${LX0} ${f1(ly(C.S_SUB))}L${LX1} ${f1(ly(C.S_SUB))}"/>` + txt(LX1, ly(C.S_SUB) - 8, tr(`grens ${C.S_SUB} MVA`, `limit ${C.S_SUB} MVA`), 20, 'end', 'mf-on');
    return out;
  }
  function ldcCurve(draw, hi) {
    let out = '';
    if (draw > 0.01) {
      const pts = [];
      const end = C.YEAR_H * draw;
      for (let i = 0; i <= 160; i++) { const h = end * (i / 160) ** 2; pts.push([lx(h), ly(load(h))]); }
      out += `<path class="mf-line" d="${fmt(pts)}"/>`;
    }
    if (hi > 0.01) {
      const pts = [[lx(0), ly(C.LIM)]];
      for (let h = 0; h <= C.HRS; h += 10) pts.push([lx(h), ly(load(h))]);
      pts.push([lx(C.HRS), ly(C.LIM)]);
      out += op(hi, line(LX0, ly(C.LIM), LX1, ly(C.LIM), 'mf-l2') + txt(LX1, ly(C.LIM) + 24, `${C.LIM} MVA`, 20, 'end', 'mf-mute')
        + `<path class="mf-acc" d="${fmt(pts)}Z"/>` + line(lx(C.HRS) + 3, ly(C.LIM) - 4, 330, 106, 'mf-accl')
        + txt(336, 112, tr(`${C.HRS} uur ≈ 2%`, `${C.HRS} h ≈ 2%`), 22, 'start', 'mf-on'));
    }
    return out;
  }
  function ldcTxt(a) {
    return op(a, txt(612, 380, tr('vol: tientallen tot honderden uren', 'full: tens to hundreds of hours'), 20, 'end', 'mf-txt'));
  }

  // ------------------------------------------------------------ s5: GOPACS, the cold store's shift, the flexible contract
  function flexBase() { return PANEL(); }
  function flexGo(a) {
    if (a <= 0.01) return '';
    return op(a, rect(216, 30, 128, 60, 'mf-tile', 6) + txt(280, 56, tr('netbeheerder', 'operator'), 20, 'middle') + txt(280, 80, tr('verzoek', 'request'), 20, 'middle', 'mf-mute')
      + rect(364, 30, 108, 60, 'mf-accf', 6) + txt(418, 68, 'GOPACS', 21, 'middle', 'mf-on')
      + rect(492, 30, 128, 60, 'mf-tile', 6) + txt(556, 56, tr('bedrijf', 'company'), 20, 'middle') + txt(556, 80, tr('aanbod', 'offer'), 20, 'middle', 'mf-mute')
      + line(344, 60, 364, 60, 'mf-accl') + line(472, 60, 492, 60, 'mf-accl'));
  }
  // the substation over a day, MVA: 29 at the evening peak, 4 of it cooling that can move
  const DX0 = 252;
  const DX1 = 604;
  const DB = 300;
  const DK = 4.4;
  const dx = (h) => DX0 + ((DX1 - DX0) * h) / 24;
  const dy = (v) => DB - v * DK;
  const base = (h) => 14 + 5 * Math.exp(-(((h - 9) / 2.5) ** 2)) + 11 * Math.exp(-(((h - 18.5) / 1.6) ** 2));
  // the cooling block: at the evening peak, or (s = 1) moved to the middle of the day, the same energy
  const g = (h, c, w) => Math.exp(-(((h - c) / w) ** 2));
  const total = (h, s) => base(h) + C.SHIFT * ((1 - s) * g(h, 18.5, 1.6) + s * (1.6 / 2.2) * g(h, 13, 2.2));
  function flexShift(a, s) {
    if (a <= 0.01) return '';
    let out = tag(EX, 620, 128) + line(DX0, DB, DX1, DB);
    for (const h of [0, 12, 24]) out += txt(dx(h), DB + 24, `${h}`, 20, 'middle', 'mf-mute');
    out += `<path class="mf-dash" d="M${DX0} ${f1(dy(C.S_SUB))}L${DX1} ${f1(dy(C.S_SUB))}"/>` + txt(DX0 + 4, dy(C.S_SUB) - 8, `${C.S_SUB} MVA`, 20, 'start', 'mf-on');
    const p0 = [];
    const p1 = [];
    for (let h = 0; h <= 24; h += 0.25) { p0.push([dx(h), dy(total(h, 0))]); p1.push([dx(h), dy(total(h, s))]); }
    out += op(a * (s > 0.02 ? 1 : 0), `<path class="mf-l2" d="${fmt(p0)}"/>`);
    out += op(a, `<path class="mf-line" style="stroke:var(--fp-accent)" d="${fmt(p1)}"/>` + txt(dx(18.5) + 18, dy(total(18.5, 0)) - 6, tr(`piek ${C.PEAK}`, `peak ${C.PEAK}`), 20, 'start', 'mf-txt'));
    if (s > 0.05) out += op(s, txt(dx(12), DB - 14, tr(`koeling ${C.SHIFT} MVA eerder`, `cooling ${C.SHIFT} MVA earlier`), 20, 'middle', 'mf-on'));
    return out;
  }
  function flexFlex(a, two) {
    let out = '';
    if (a > 0.01) {
      // a day strip: capacity at every hour but the evening peak
      const y = 36;
      out += op(a, txt(216, y + 2, tr('flexibel contract', 'flexible contract'), 20, 'start', 'mf-on'));
      for (let h = 0; h < 24; h++) {
        const peak = h >= 17 && h < 20;
        out += op(a, `<rect class="${peak ? 'mf-tile' : 'fp-meter'}" x="${f1(dx(h) + 1)}" y="${y + 14}" width="${f1((DX1 - DX0) / 24 - 2)}" height="22" rx="2"/>`);
      }
      out += op(a, txt(dx(18.5), y + 62, tr('geen piek', 'no peak'), 20, 'middle', 'mf-txt') + txt(DX0, y + 62, tr('lager tarief', 'lower tariff'), 20, 'start', 'mf-mute'));
    }
    if (two > 0.01) {
      for (let i = 0; i < 3; i++) out += op(two, bldg(236 + i * 44, 334, 30, 36, i < 2 ? 'mf-homeOn' : 'mf-home'));
      out += op(two, txt(380, 362, tr('2 van 3: binnen een jaar', '2 of 3: within a year'), 21, 'start', 'mf-on'));
    }
    return out;
  }

  // ------------------------------------------------------------ s6: who goes first
  const ROWS = [
    { nl: 'bedrijf A', en: 'company A', arrive: 0, prio: 3, other: true },
    { nl: 'school', en: 'school', arrive: 1, prio: 2 },
    { nl: 'bedrijf B', en: 'company B', arrive: 2, prio: 4, other: true },
    { nl: 'ziekenhuis', en: 'hospital', arrive: 3, prio: 1 },
    { nl: 'verlicht congestie', en: 'relieves congestion', arrive: 4, prio: 0 },
  ];
  const CAT = [tr('1 congestie', '1 congestion'), tr('2 veiligheid', '2 safety'), tr('3 basisbehoefte', '3 basic needs'), '', ''];
  function prioBase() { return PANEL() + tag(EX); }
  function prioRows(re, late) {
    let out = '';
    ROWS.forEach((r) => {
      const y = 70 + lerp(r.arrive, r.prio, re) * 52;
      const lit = r.other && late > 0.5;
      out += rect(232, y, 200, 40, lit ? 'mf-accf' : 'mf-tile', 6) + txt(248, y + 27, tr(r.nl, r.en), 20, 'start', 'mf-txt');
      if (!r.other) out += op(re, txt(612, y + 27, CAT[r.prio], 20, 'end', 'mf-on'));
      if (r.other) out += op(late, txt(612, y + 27, tr('wacht langer', 'waits longer'), 20, 'end', 'mf-txt'));
    });
    return out + txt(232, 54, re < 0.5 ? tr('wie het eerst komt', 'first come') : tr('maatschappelijke waarde', 'social value'), 20, 'start', 'mf-mute');
  }
  function prioTxt(a) {
    return op(a, rect(222, 334, 396, 44, 'mf-accf', 6) + txt(420, 363, tr('hoeveel uur boven de grens?', 'how many hours over?'), 21, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ s7: five tasks, the plan, the supplier
  const TASKS = [['aansluiten', 'connect'], ['transporteren', 'transport'], ['onderhouden', 'maintain'], ['storingen verhelpen', 'restore outages'], ['plannen en bouwen', 'plan and build']];
  function tasksBase() { return PANEL(); }
  function tasksRows(pr) {
    let out = '';
    TASKS.forEach(([nl, en], i) => {
      const a = clamp(pr * 5 - i, 0, 1);
      const y = 34 + i * 40;
      out += op(0.35 + 0.65 * a, `<circle class="${a > 0.5 ? 'mf-acc' : 'mf-tile'}" cx="236" cy="${y + 14}" r="12"/>` + txt(236, y + 21, `${i + 1}`, 18, 'middle', a > 0.5 ? 'mf-mono' : 'mf-mute') + txt(258, y + 21, tr(nl, en), 20));
    });
    return out;
  }
  function tasksPlan(a) {
    if (a <= 0.01) return '';
    let out = rect(484, 34, 104, 132, 'mf-tile', 4);
    for (let i = 0; i < 6; i++) out += line(498, 60 + i * 16, i % 3 === 2 ? 540 : 574, 60 + i * 16, 'mf-grid');
    out += rect(498, 48, 40, 6, 'mf-acc', 2);
    return op(a, out + txt(536, 190, tr('elke 2 jaar', 'every 2 years'), 20, 'middle', 'mf-on'));
  }
  function tasksSup(a) {
    return op(a, rect(222, 238, 192, 132, 'mf-accf', 6) + txt(318, 266, tr('leverancier', 'supplier'), 20, 'middle', 'mf-on')
      + txt(318, 300, tr('verkoopt energie', 'sells energy'), 20, 'middle') + txt(318, 332, tr('kies je zelf', 'you choose'), 20, 'middle', 'mf-mute')
      + rect(426, 238, 192, 132, 'mf-tile', 6) + txt(522, 266, tr('netbeheerder', 'grid operator'), 20, 'middle', 'mf-txt')
      + txt(522, 300, tr('transport', 'transport'), 20, 'middle') + txt(522, 332, tr('vast per gebied', 'fixed per area'), 20, 'middle', 'mf-mute'));
  }

  // ------------------------------------------------------------ s8: outage minutes and the worked example
  function saidiBase() { return PANEL(); }
  function saidiBars(a) {
    if (a <= 0.01) return '';
    const k = 6.4; // px per minute
    return op(a, txt(222, 44, tr('2024, minuten per klant', '2024, minutes per customer'), 20, 'start', 'mf-mute')
      + `<rect class="fp-meter" data-top="" x="222" y="58" width="${f1(23.9 * k * a)}" height="24" rx="3"/>` + txt(222 + 23.9 * k + 10, 78, tr('± 24 onvoorzien', '± 24 unplanned'), 20, 'start', 'mf-on')
      + `<rect class="fp-meter" data-alt="" x="222" y="92" width="${f1(23.3 * k * a)}" height="24" rx="3"/>` + txt(222 + 23.3 * k + 10, 112, tr('+ ± 23 gepland', '+ ± 23 planned'), 20, 'start', 'mf-txt'));
  }
  function saidiCalc(avg, big, back) {
    let out = op(avg, tag(EX, 620, 150) + txt(222, 176, tr('70 mln klantminuten', '70 m customer minutes'), 21, 'start', 'mf-txt')
      + txt(222, 206, tr('÷ 2,8 mln klanten = 25 min', '÷ 2.8 m customers = 25 min'), 21, 'start', 'mf-big'));
    if (big > 0.01) {
      // 3.000 customers × 90 minutes as an area: a block of customers by a bar of time
      const w = 300 * big;
      out += rect(222, 230, w, 76, 'mf-accf', 4);
      for (let i = 1; i < 10; i++) if (i * 30 < w) out += line(222 + i * 30, 230, 222 + i * 30, 306, 'mf-grid');
      out += op(big, txt(222, 330, tr('3.000 klanten × 90 min', '3,000 customers × 90 min'), 20) + txt(222, 360, tr('= 270.000 klantminuten', '= 270,000 customer minutes'), 21, 'start', 'mf-big'));
    }
    out += op(back, rect(538, 230, 80, 76, 'mf-tile', 4) + txt(578, 262, tr('eerst', 'switch'), 20, 'middle', 'mf-on') + txt(578, 288, tr('terug', 'back'), 20, 'middle', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ s9: the regulated monopoly and the regulator
  const AREAS = [
    'M232 60L300 44L344 70L336 128L276 140L236 116Z',
    'M344 70L420 52L470 84L456 140L392 150L336 128Z',
    'M276 140L336 128L392 150L380 196L300 200L262 176Z',
  ];
  function acmBase() { return PANEL(); }
  function acmArea(a) {
    return op(a, AREAS.map((d, i) => `<path class="${i === 1 ? 'mf-accf' : 'mf-tile'}" d="${d}"/>`).join('')
      + txt(288, 98, 'A', 21, 'middle', 'mf-mono') + txt(402, 108, 'B', 21, 'middle', 'mf-mono') + txt(326, 172, 'C', 21, 'middle', 'mf-mono')
      + txt(486, 92, tr('eigen gebied', 'own area'), 20) + txt(486, 122, tr('geen keuze', 'no choice'), 20, 'start', 'mf-mute'));
  }
  function acmBox(a) {
    return op(a, rect(222, 220, 396, 64, 'mf-tile', 6) + txt(240, 246, 'ACM', 21, 'start', 'mf-on')
      + txt(240, 272, tr('inkomsten · codes · kwaliteit', 'income · codes · quality'), 20, 'start', 'mf-txt'));
  }
  function acmTxt(a1, a2) {
    return op(a1, txt(222, 316, tr('Energiewet sinds 1 januari 2026', 'Energy Act since 1 January 2026'), 20) + txt(222, 342, tr('eigenaar: provincies, gemeenten', 'owners: provinces, municipalities'), 20, 'start', 'mf-mute'))
      + op(a2, txt(222, 372, tr('waar gaat de dag van een monteur heen?', 'where does a crew’s day go?'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['cong', 'queue', 'years', 'ldc', 'flex', 'prio', 'tasks', 'saidi', 'acm'];
  set(E.cgBase, congBase());
  set(E.quBase, queueBase());
  set(E.yrBase, yearsBase());
  set(E.ldBase, ldcBase());
  set(E.fxBase, flexBase());
  set(E.prBase, prioBase());
  set(E.tkBase, tasksBase());
  set(E.saBase, saidiBase());
  set(E.acBase, acmBase());
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let flow = 0;

    if (si === 0) {
      vis.cong = on(b, 1, p, 0, 0.12);
      set(E.cgCurve, congCurve(on(b, 1, p, 0.05, 0.6), on(b, 1, p, 0.6, 0.9), on(b, 3, p, 0.2, 0.8)));
      set(E.cgTxt, congTxt(on(b, 3, p, 0.05, 0.3), on(b, 3, p, 0.6, 0.9)));
      flow = b === 0 ? span(p, 0.3, 0.6) : b === 2 ? 1 : 0;
    } else if (si === 1) {
      vis.queue = span(u, 0, 0.04);
      set(E.quTxt, queueTxt(b === 0 ? span(p, 0.1, 0.4) : 1));
      set(E.quLine, queueLine(on(b, 1, p, 0.05, 0.5), on(b, 2, p, 0.1, 0.6)));
      set(E.quMap, queueMap(on(b, 3, p, 0.1, 0.5)));
    } else if (si === 2) {
      vis.years = span(u, 0, 0.04);
      set(E.yrBars, yearsBars(b === 0 ? span(p, 0.05, 0.4) : 1, on(b, 1, p, 0.05, 0.3)));
      set(E.yrSub, yearsSub(on(b, 2, p, 0.05, 0.4), on(b, 2, p, 0.5, 0.85), on(b, 3, p, 0.1, 0.4)));
    } else if (si === 3) {
      vis.ldc = span(u, 0, 0.04);
      set(E.ldCurve, ldcCurve(b === 0 ? span(p, 0.1, 0.85) : 1, on(b, 1, p, 0.05, 0.4)));
      set(E.ldTxt, ldcTxt(on(b, 2, p, 0.1, 0.4)));
    } else if (si === 4) {
      vis.flex = span(u, 0, 0.04);
      const go = on(b, 1, p, 0.05, 0.3) * (1 - on(b, 3, p, 0, 0.2));
      set(E.fxGo, flexGo(go));
      set(E.fxShift, flexShift(b === 0 ? span(p, 0.1, 0.4) : 1, on(b, 2, p, 0.1, 0.8)));
      set(E.fxFlex, flexFlex(on(b, 3, p, 0.15, 0.4), on(b, 4, p, 0.1, 0.4)));
    } else if (si === 5) {
      vis.prio = span(u, 0, 0.04);
      set(E.prRows, prioRows(on(b, 1, p, 0.15, 0.6), on(b, 2, p, 0.05, 0.3)));
      set(E.prTxt, prioTxt(on(b, 3, p, 0.1, 0.4)));
    } else if (si === 6) {
      vis.tasks = span(u, 0, 0.04);
      set(E.tkRows, tasksRows(b === 0 ? span(p, 0.05, 0.9) : 1));
      set(E.tkPlan, tasksPlan(on(b, 1, p, 0.05, 0.3)));
      set(E.tkSup, tasksSup(on(b, 2, p, 0.05, 0.3)));
      flow = b === 0 ? span(p, 0.2, 0.4) : 0;
    } else if (si === 7) {
      vis.saidi = on(b, 1, p, 0, 0.1);
      set(E.saBars, saidiBars(on(b, 1, p, 0.05, 0.4)));
      set(E.saCalc, saidiCalc(on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.05, 0.5), on(b, 4, p, 0.05, 0.3)));
      flow = b === 4 ? span(p, 0.3, 0.6) : 0;
    } else if (si === 8) {
      vis.acm = span(u, 0, 0.04);
      set(E.acArea, acmArea(b === 0 ? span(p, 0.05, 0.3) : 1));
      set(E.acBox, acmBox(on(b, 1, p, 0.05, 0.3)));
      set(E.acTxt, acmTxt(on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.05, 0.3)));
    }

    // the current along the street cable: dashes running away from the netstation
    E.flow.style.opacity = flow > 0.01 ? flow.toFixed(2) : '0';
    E.flow.style.strokeDashoffset = f1(-clockS * 9);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
