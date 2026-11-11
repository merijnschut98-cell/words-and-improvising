// The scenes and cards of the film eng.process.plant (process types), put
// into the shared stage (stage-common.js, in this folder) at its SCENES
// marker: every helper of the shared stage is in scope here. SCN[name] gets
// the beat b, its progress p, the scene's u and clock, and st (the state of
// the drawing) and vis (the cards' opacities) to fill.
/* global SCN, NL, tr, clamp, lerp, f1, txt, rect, path, circ, arrow, set, E, EX, C, span, num, pillsSvg */
const STEPS = NL ? ['mengen', 'pompen', 'verhitten', 'heethouden', 'koelen'] : ['mixing', 'pumping', 'heating', 'holding', 'cooling'];
const SPOTS = [[-160, 0, 196], [-90, 0, 100], [32, 0, 116], [100, 12, 96], [232, 0, 104]];
// the title card: what the numbered steps are, and what comes after them
function stepsSvg() {
  let out = rect(392, 12, 236, 84);
  out += txt(408, 44, 'unit operations', 21, 'start', 'pl-big');
  out += txt(408, 78, tr('daarna: afvullen', 'then: filling'), 20, 'start', 'pl-mute');
  return out;
}
// a numbered badge at each unit operation, with its name on a pill; the one being named is lit
function badgesSvg(n, hot) {
  return pillsSvg(SPOTS.slice(0, n).map((p, i) => ({ p, t: STEPS[i], n: String(i + 1), hot: i === hot })));
}
function sepSvg(n) {
  const rows = NL ? ['filtreren', 'centrifugeren', 'destilleren', 'indampen'] : ['filtering', 'centrifuging', 'distilling', 'evaporating'];
  const top = 262;
  let out = rect(12, top, 292, 126);
  out += txt(28, top + 32, tr('ook scheiden:', 'separating too:'), 20, 'start', 'pl-mute');
  rows.forEach((r, i) => { if (i < n) out += txt(28 + (i % 2) * 124, top + 66 + Math.floor(i / 2) * 38, r, 20, 'start', 'pl-txt'); });
  return out;
}
// the batch: four phases in time; only mixing makes product, the rest is fill, empty, clean
function batchSvg(step, q) {
  let out = rect(12, 12, 312, 264);
  out += txt(28, 44, 'batch 0412', 21, 'start', 'pl-big') + txt(308, 44, EX, 20, 'end', 'pl-mute');
  const ph = NL ? ['vullen', 'mengen', 'legen', 'reinigen'] : ['fill', 'mix', 'empty', 'clean'];
  ph.forEach((name, i) => {
    const done = clamp(q * 4 - i, 0, 1);
    const y = 56 + i * 32;
    out += txt(28, y + 20, name, 20, 'start', done > 0.01 ? 'pl-txt' : 'pl-mute');
    out += rect(132, y + 2, 176, 24, 'pl-dim', 4);
    if (done > 0.01) out += `<rect class="pl-meter"${i === 1 ? ' data-top=""' : ''} x="132" y="${y + 2}" width="${f1(176 * done)}" height="24" rx="4"/>`;
  });
  if (step >= 1) out += txt(28, 210, tr('één partij, één batchnummer', 'one lot, one batch number'), 20, 'start', 'pl-txt');
  if (step >= 2) out += txt(28, 238, tr('vullen, legen, reinigen:', 'fill, empty, clean:'), 20, 'start', 'pl-txt') + txt(28, 264, tr('levert niks op', 'produce nothing'), 20, 'start', 'pl-on');
  return out;
}
// where a way of working fits: a small card with two lines
function whereSvg(x, y, title, lines) {
  let out = rect(x, y, 312, 40 + 28 * lines.length);
  out += txt(x + 16, y + 28, title, 19, 'start', 'pl-mute');
  lines.forEach((l, i) => { out += txt(x + 16, y + 58 + 28 * i, l, 20, 'start', 'pl-txt'); });
  return out;
}
// steady state: temperature, pressure and flow climb at start-up, then stay flat
function trendSvg(step, q) {
  const ox = 316;
  let out = rect(ox + 12, 12, 300, 200);
  out += txt(ox + 28, 42, 'trend', 20, 'start', 'pl-mute') + txt(ox + 296, 42, EX, 20, 'end', 'pl-mute');
  const x0 = ox + 36;
  const x1 = ox + 292;
  const y0 = 176;
  out += path([[x0, 56], [x0, y0], [x1, y0]], 'pl-dim');
  const xs = x0 + 66;
  if (step >= 2) out += `<rect class="pl-liq" x="${x0 + 2}" y="58" width="${xs - x0 - 2}" height="${y0 - 60}"/>` + txt(x0 + 8, 76, 'off-spec', 20, 'start', 'pl-on');
  const xe = lerp(x0, x1, q);
  [[150, 80], [150, 112], [150, 144]].forEach(([s, lvl], i) => {
    const pts = [];
    for (let x = x0; x <= xe; x += 4) { const t = clamp((x - x0) / (xs - x0), 0, 1); pts.push([x, lerp(s + 20, lvl, t * t * (3 - 2 * t))]); }
    if (pts.length > 1) out += path(pts, i === 0 ? 'pl-accl' : 'pl-line');
  });
  out += txt(x1, 202, tr('tijd', 'time'), 20, 'end', 'pl-mute');
  if (q > 0.5) out += txt(x1, 102, 'T', 20, 'end', 'pl-big') + txt(x1, 134, 'p', 20, 'end', 'pl-big') + txt(x1, 166, 'Q', 20, 'end', 'pl-big');
  return out;
}
// residence time on a tank: 6 m³ with 3 m³/h in and out, then 50 % more flow
function tankSvg(step, clockS) {
  let out = rect(12, 12, 300, 376);
  out += txt(28, 44, tr('verblijftijd', 'residence time'), 20, 'start', 'pl-mute') + txt(296, 44, EX, 20, 'end', 'pl-mute');
  // the tank, the product in it, the flow in at the top left and out at the bottom right
  out += rect(84, 74, 120, 128, 'pl-wall', 6) + rect(86, 96, 116, 104, 'pl-liq', 3);
  out += txt(144, 156, '6 m³', 24, 'middle', 'pl-big');
  out += arrow([[36, 62], [104, 62], [104, 92]], 'pl-accl', 7) + arrow([[184, 202], [184, 222], [282, 222]], 'pl-accl', 7);
  out += txt(220, 72, '3 m³/h', 19, 'start', 'pl-mono') + txt(282, 250, '3 m³/h', 19, 'end', 'pl-mono');
  const k = (clockS * 0.5) % 1;
  out += circ(lerp(36, 104, k), 62, 3.5, 'pl-acc') + circ(lerp(184, 282, k), 222, 3.5, 'pl-acc');
  if (step >= 1) {
    out += txt(28, 290, tr('volume / debiet', 'volume / flow'), 20, 'start', 'pl-txt');
    out += txt(28, 326, '6 / 3 = 2 h', 24, 'start', 'pl-big');
  }
  if (step === 2) out += txt(28, 356, num('+50%: 4,5 m³/h'), 19, 'start', 'pl-mono') + txt(28, 380, '⅔ × 2 h = 1 h 20 min', 19, 'start', 'pl-on');
  if (step >= 3) out += txt(28, 358, tr('verhitten, warmhouden,', 'heating, keeping hot,'), 19, 'start', 'pl-on') + txt(28, 382, tr('reageren, bezinken', 'reacting, settling'), 19, 'start', 'pl-on');
  return out;
}
// a stirred tank, side view: a short cut from the inlet to the outlet, loops round the agitator, dead corners
function deadSvg(step, clockS) {
  let out = rect(12, 12, 300, 376);
  out += txt(28, 44, tr('geroerde tank', 'stirred tank'), 20, 'start', 'pl-mute') + txt(296, 44, EX, 20, 'end', 'pl-mute');
  const L = 44;
  const R = 256;
  const T = 92;
  const B = 300;
  out += rect(L, T, R - L, B - T, 'pl-wall', 4) + rect(L + 2, T + 12, R - L - 4, B - T - 14, 'pl-liq', 2);
  // the dead corners at the bottom, where the agitator hardly reaches
  const lit = step >= 1 ? 'pl-dead' : 'pl-deadM';
  out += `<path class="${lit}" d="M${L + 2} ${B - 2}L${L + 2} ${B - 70}Q${L + 20} ${B - 20} ${L + 70} ${B - 2}Z"/>`;
  out += `<path class="${lit}" d="M${R - 2} ${B - 2}L${R - 2} ${B - 70}Q${R - 20} ${B - 20} ${R - 70} ${B - 2}Z"/>`;
  // two loops round the agitator, with product moving slowly round them
  const cx = 150;
  const cy = 196;
  const loop = (ox) => { const pts = []; for (let i = 0; i <= 28; i++) { const a = (i / 28) * 2 * Math.PI; pts.push([ox + 42 * Math.cos(a), cy + 56 * Math.sin(a)]); } return pts; };
  out += path(loop(cx - 52), 'pl-dim') + path(loop(cx + 52), 'pl-dim');
  [[cx - 52, 1, 0], [cx + 52, -1, 0.5]].forEach(([ox, dir, ph]) => { const a = dir * clockS * 0.7 + ph * Math.PI; out += circ(ox + 42 * Math.cos(a), cy + 56 * Math.sin(a), 3.5, 'pl-mid'); });
  // the agitator: drive, shaft and blades, turning
  const sw = 30 * Math.cos(clockS * 4);
  out += rect(cx - 12, T - 22, 24, 14, 'pl-bub', 3) + path([[cx, T - 8], [cx, cy]], 'pl-line') + path([[cx - sw, cy - 5], [cx + sw, cy + 5]], 'pl-line');
  // the dots that sit in the dead corners
  out += circ(L + 16, B - 16, 3.5, 'pl-mid') + circ(R - 16, B - 16, 3.5, 'pl-mid');
  // in at the top left, out through the right wall near the top, and the short cut between them
  out += arrow([[L + 18, T - 30], [L + 18, T + 18]], 'pl-line', 7) + arrow([[R, T + 62], [R + 40, T + 62]], 'pl-line', 7);
  const cut = [[L + 18, T + 22], [L + 52, T + 52], [R - 40, T + 58], [R - 4, T + 62]];
  out += path(cut, 'pl-accl');
  const k = (clockS * 0.45) % 1;
  const seg = Math.min(2, Math.floor(k * 3));
  const t = k * 3 - seg;
  out += circ(lerp(cut[seg][0], cut[seg + 1][0], t), lerp(cut[seg][1], cut[seg + 1][1], t), 4.5, 'pl-acc');
  out += txt(R - 6, T + 90, tr('minuten', 'minutes'), 20, 'end', 'pl-on');
  if (step >= 1) out += txt(L, B + 28, tr('uren', 'hours'), 20, 'start', 'pl-on') + txt(R, B + 28, tr('uren', 'hours'), 20, 'end', 'pl-on');
  if (step >= 2) out += txt(160, 374, tr('ontwerp op het snelste deel', 'design on the fastest part'), 19, 'middle', 'pl-on');
  return out;
}
// the residence-time sum of the holding tube, with a clock of the drop in the tube
function calcSvg(step, secs) {
  let out = rect(12, 12, 300, 252);
  out += txt(28, 44, tr('verblijftijd', 'residence time'), 20, 'start', 'pl-mute') + txt(296, 44, tr('heethoudbuis', 'holding tube'), 20, 'end', 'pl-mute');
  out += txt(28, 80, tr('volume / debiet', 'volume / flow'), 21, 'start', 'pl-txt');
  out += txt(28, 116, num('0,1 m³ / 12 m³/h'), 20, 'start', 'pl-mono');
  out += txt(28, 150, '= 30 s', 24, 'start', 'pl-big');
  if (secs !== undefined) out += txt(296, 150, `${Math.floor(secs)} s`, 24, 'end', 'pl-on');
  out += txt(28, 190, 'minimum: 20 s', 20, 'start', step >= 2 ? 'pl-on' : 'pl-txt');
  if (step >= 2) out += txt(28, 222, num('18 m³/h: 20 s'), 20, 'start', 'pl-mono');
  if (step >= 2) out += txt(28, 250, step >= 4 ? tr('meer output: langere buis', 'more output: longer tube') : tr('geen marge', 'no margin'), 20, 'start', step >= 4 ? 'pl-on' : 'pl-mute');
  return out;
}
// the velocity profile in the tube: fastest in the centre
function profSvg() {
  let out = rect(12, 276, 300, 112);
  out += txt(28, 302, tr('snelheid in de buis', 'speed in the tube'), 20, 'start', 'pl-mute');
  out += path([[28, 318], [296, 318]], 'pl-line') + path([[28, 378], [296, 378]], 'pl-line');
  for (let i = 0; i <= 6; i++) {
    const y = 324 + i * 8;
    const r = (i - 3) / 3.4;
    const len = 30 + 130 * (1 - r * r);
    out += arrow([[48, y], [48 + len, y]], i === 3 ? 'pl-accl' : 'pl-dim', 6);
  }
  out += txt(296, 352, tr('snelst', 'fastest'), 20, 'end', 'pl-on');
  return out;
}
// the debate in pharma, and the sharp question
function pharmaSvg(step) {
  const x = 328;
  let out = rect(x, 12, 300, step >= 2 ? 300 : step >= 1 ? 184 : 92);
  out += txt(x + 16, 44, tr('farma', 'pharma'), 20, 'start', 'pl-mute');
  out += txt(x + 16, 80, tr('batch → continu?', 'batch → continuous?'), 22, 'start', 'pl-big');
  if (step >= 1) {
    out += txt(x + 16, 120, tr('FDA: moedigt continu aan', 'FDA: encourages it'), 19, 'start', 'pl-txt');
    out += txt(x + 16, 150, tr('auditors: kennen de', 'auditors: know the'), 19, 'start', 'pl-txt') + txt(x + 16, 176, tr('batchregistratie', 'batch record'), 19, 'start', 'pl-txt');
  }
  if (step >= 2) {
    out += path([[x + 16, 196], [x + 284, 196]], 'pl-dim');
    out += txt(x + 16, 228, tr('welke stappen batch?', 'which steps batch?'), 19, 'start', 'pl-on');
    out += txt(x + 16, 256, tr('welke continu?', 'which continuous?'), 19, 'start', 'pl-on');
    out += txt(x + 16, 284, tr('waar raken ze elkaar?', 'where do they meet?'), 19, 'start', 'pl-on');
  }
  return out;
}

SCN.units = ({ b, p, st, vis }) => {
  st.mix = true;
  const n = b === 1 ? 1 + Math.floor(span(p, 0.05, 0.75) * 4.99) : 5;
  vis.badges = b >= 1 ? (b === 1 ? span(p, 0, 0.1) : 1) : 0;
  if (vis.badges > 0.01) set(E.badges, badgesSvg(n, b === 1 ? n - 1 : -1));
  vis.steps = vis.badges;
  if (vis.steps > 0.01) set(E.steps, stepsSvg());
  vis.sep = b === 2 ? span(p, 0, 0.1) : 0;
  if (vis.sep > 0.01) set(E.sep, sepSvg(1 + Math.floor(span(p, 0.1, 0.8) * 3.99)));
};
SCN.batch = ({ b, p, u, st, vis }) => {
  // fill, mix, empty, clean over the scene
  const q = clamp(u * 1.05, 0, 1);
  const fill = span(q, 0.02, 0.25);
  const empty = span(q, 0.5, 0.74);
  st.level = 0.8 * fill * (1 - empty);
  st.mix = q > 0.25 && q < 0.5;
  st.pump = q > 0.5 && q < 0.74;
  st.flow = { fA: st.pump ? 1 : 0 };
  st.belt = 0;
  vis.batch = 1;
  set(E.batch, batchSvg(b >= 3 ? 2 : Math.min(b, 1), q));
  vis.where = b === 2 ? span(p, 0, 0.1) : 0;
  if (vis.where > 0.01) set(E.where, whereSvg(12, 292, tr('past bij:', 'suits:'), NL ? ['farma, specialistische', 'chemie, veel voeding'] : ['pharma, specialty', 'chemicals, much food']));
};
SCN.cont = ({ b, p, st, vis }) => {
  st.mix = true;
  vis.trend = b >= 1 && b <= 3 ? (b === 1 ? span(p, 0, 0.1) : 1) : 0;
  if (vis.trend > 0.01) set(E.trend, trendSvg(b === 3 ? 2 : 1, b === 1 ? span(p, 0.05, 0.9) : 1));
  vis.where = b === 2 ? span(p, 0, 0.1) : 0;
  if (vis.where > 0.01) set(E.where, whereSvg(316, 224, tr('grote volumes:', 'large volumes:'), NL ? ['raffinaderijen, papier,', 'bulkchemie, melkpoeder'] : ['refineries, paper, bulk', 'chemicals, milk powder']));
};
// the vat runs continuously here: in at the top, out at the bottom, the line runs on
const through = (st) => { st.mix = true; st.flow = { fI: 1, fA: 1, fB: 0.6, fC: 0.6, fH: 0.4, fR: 0.4 }; };
SCN.tank = ({ b, clockS, st, vis }) => {
  through(st);
  vis.tank = 1;
  set(E.tank, tankSvg(b, clockS));
};
SCN.mix = ({ b, clockS, st, vis }) => {
  through(st);
  vis.dead = 1;
  set(E.dead, deadSvg(b, clockS));
};
SCN.hold = ({ b, p, st, vis }) => {
  st.flow = { fA: 0.4, fB: 0.6, fC: 0.4, fH: 0.4, fR: 0.4 };
  vis.calc = b >= 1 ? (b === 1 ? span(p, 0, 0.1) : 1) : 0;
  if (b === 1) { const q = span(p, 0.1, 0.92); st.drop = { q }; if (vis.calc > 0.01) set(E.calc, calcSvg(1, q * C.T1)); } else if (b === 2) {
    const q = span(p, 0.08, 0.7); st.drop = { q }; set(E.calc, calcSvg(2, q * C.T2));
  } else if (b === 3) { const q = span(p, 0.05, 0.6); st.drop = { q, ghost: q * 0.5 }; set(E.calc, calcSvg(3)); } else if (b === 4) set(E.calc, calcSvg(4));
  vis.prof = b >= 3 ? (b === 3 ? span(p, 0, 0.1) : 1) : 0;
  if (vis.prof > 0.01) set(E.prof, profSvg());
};
SCN.pharma = ({ b, p, st, vis }) => {
  st.mix = true;
  vis.pharma = b <= 2 ? 1 : 1 - span(p, 0, 0.1);
  if (vis.pharma > 0.01) set(E.pharma, pharmaSvg(b));
  vis.pills = b === 3 ? span(p, 0, 0.12) : 0;
  if (vis.pills > 0.01) {
    set(E.pills, pillsSvg([
      { p: [-160, 0, 150], t: 'batch', n: 'B' },
      { p: [92, 12, 90], t: tr('continu', 'continuous'), n: 'C', left: true },
      { p: [-90, 0, 94], t: tr('hier raken ze elkaar', 'they meet here'), n: '↔', hot: true },
    ]));
  }
};
