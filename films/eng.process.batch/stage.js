// The scenes and cards of the film eng.process.batch (batch cycles and
// capacity), put into the shared stage of the juice line
// (films/eng.process.plant/stage-common.js) at its SCENES marker: every helper
// of the shared stage is in scope here. SCN[name] gets the beat b, its
// progress p, the scene's u and clock, and st (the state of the drawing) and
// vis (the cards' opacities) to fill. The mixing vat of the juice line follows
// the phase the cycle ring's hand is in: it fills, mixes, waits, drains and is
// cleaned.
/* global SCN, NL, tr, clamp, lerp, f1, fmt, txt, rect, path, circ, arrow, set, E, EX, C, span, num */
const SCHEMA = tr('schema', 'diagram');
// a cycle: [name nl, name en, minutes, kind]; kinds drive the vat and the colours
const GEN = [
  ['vullen', 'fill', 30, 'fill'], ['opwarmen', 'heat', 60, 'heat'], ['reageren/mengen', 'react / mix', 120, 'mix'],
  ['afkoelen', 'cool', 45, 'cool'], ['wachten', 'waiting', 30, 'wait'], ['legen', 'empty', 15, 'empty'], ['reinigen', 'clean', 30, 'clean'],
];
const PAINT = [
  ['vullen', 'fill', 40, 'fill'], ['dispergeren', 'disperse', 90, 'mix'], ['QC-monster', 'QC sample', 50, 'wait'],
  ['bijstellen', 'adjust', 20, 'adjust'], ['aftappen', 'fill off', 60, 'empty'], ['reinigen', 'clean', 40, 'clean'],
];
const SEG = { fill: 'pb-segA', empty: 'pb-segA', clean: 'pb-segA', wait: 'pb-segW', mix: 'pb-seg', heat: 'pb-seg', cool: 'pb-seg', adjust: 'pb-seg' };

// the vat follows the phase at fraction q of a cycle: it fills through the
// inlet on top, mixes, waits full and still, drains through the pump, and is
// rinsed through the inlet (CIP)
function vatFollow(st, rows, q) {
  const total = rows.reduce((a, r) => a + r[2], 0);
  let acc = 0;
  let level = 0;
  let kind = 'wait';
  for (const r of rows) {
    const a0 = acc / total;
    const a1 = (acc + r[2]) / total;
    acc += r[2];
    if (q < a0) break;
    const f = clamp((q - a0) / (a1 - a0), 0, 1);
    if (r[3] === 'fill') level = 0.8 * f;
    else if (r[3] === 'empty') level = 0.8 * (1 - f);
    else if (r[3] === 'clean') level = 0;
    if (q < a1) kind = r[3];
  }
  st.level = level;
  st.mix = kind === 'mix' || kind === 'heat' || kind === 'cool' || kind === 'adjust';
  st.pump = kind === 'empty';
  st.flow = { fA: kind === 'empty' ? 1 : 0, fI: kind === 'fill' || kind === 'clean' ? 1 : 0 };
  st.belt = 0;
}

// an annular sector, clockwise from twelve o'clock
function sector(cx, cy, R, r, a0, a1) {
  const n = Math.max(2, Math.ceil((a1 - a0) / 0.07));
  const pt = (rad, a) => [cx + rad * Math.sin(a), cy - rad * Math.cos(a)];
  const o = [];
  const i = [];
  for (let k = 0; k <= n; k++) { const a = a0 + ((a1 - a0) * k) / n; o.push(pt(R, a)); i.push(pt(r, a)); }
  return `${fmt(o.concat(i.reverse()))}Z`;
}
// the cycle ring: one sector per phase, a legend, the total in the middle,
// the hand at q (null: no hand), lit rows in petrol, sums under the ring
function ringSvg({ rows, q = null, lit = [], tag, title, minutes = true, sums = [] }) {
  const X = 232;
  let out = rect(X, 12, 396, 376);
  out += txt(X + 16, 44, title, 20, 'start', 'pl-mute') + txt(X + 380, 44, tag, 20, 'end', 'pl-mute');
  const cx = 324;
  const cy = 196;
  const R = 82;
  const r = 52;
  const total = rows.reduce((a, x) => a + x[2], 0);
  const A = 2 * Math.PI;
  const qa = q === null ? A : q * A;
  let acc = 0;
  rows.forEach((x, i) => {
    const a0 = (acc / total) * A + 0.012;
    const a1 = ((acc + x[2]) / total) * A - 0.012;
    acc += x[2];
    const on = lit.includes(i);
    if (a0 < qa) out += `<path class="${on ? 'pb-segH' : SEG[x[3]]}" d="${sector(cx, cy, R, r, a0, Math.min(a1, qa))}"/>`;
    const y = 84 + i * 30;
    const seen = a0 < qa;
    out += `<rect class="${on ? 'pb-segH' : SEG[x[3]]}" x="420" y="${y - 15}" width="14" height="14" rx="3"${seen ? '' : ' opacity=".35"'}/>`;
    out += txt(440, y, NL ? x[0] : x[1], 20, 'start', on ? 'pl-on' : seen ? 'pl-txt' : 'pl-mute');
    if (minutes) out += txt(612, y, String(Math.round(x[2])), 20, 'end', on ? 'pl-on' : 'pl-mono');
  });
  out += circ(cx, cy, r - 2, 'pl-panel');
  if (minutes) out += txt(cx, cy + 4, String(Math.round(q === null ? total : total * q)), 26, 'middle', 'pl-big') + txt(cx, cy + 28, 'min', 20, 'middle', 'pl-mute');
  else out += txt(cx, cy + 8, tr('cyclus', 'cycle'), 20, 'middle', 'pl-mute');
  if (q !== null && q < 0.999) {
    const a = q * A;
    out += path([[cx + 10 * Math.sin(a), cy - 10 * Math.cos(a)], [cx + (R + 9) * Math.sin(a), cy - (R + 9) * Math.cos(a)]], 'pl-accl');
  }
  sums.forEach(([t, cls], i) => { out += txt(X + 16, 330 + i * 34, t, cls === 'pl-big' ? 22 : 20, 'start', cls); });
  return out;
}

// the lab: samples from the whole site in a queue, ours (the paint) last; the wait timer
function labSvg(step, wq) {
  const X = 232;
  let out = rect(X, 12, 396, 376);
  out += txt(X + 16, 44, 'lab', 20, 'start', 'pl-mute') + txt(X + 380, 44, EX, 20, 'end', 'pl-mute');
  out += txt(X + 16, 82, tr('QC-vrijgave', 'QC release'), 22, 'start', 'pl-big');
  out += txt(X + 16, 112, tr('eerst goedkeuring, dan verder', 'approval first, then on'), 20, 'start', 'pl-txt');
  if (step >= 1) out += txt(X + 16, 142, tr('één lab voor de hele locatie', 'one lab for the whole site'), 20, 'start', 'pl-txt');
  // the bench
  out += rect(252, 262, 356, 12, 'pl-wall', 3) + path([[268, 274], [268, 300]], 'pl-dim') + path([[592, 274], [592, 300]], 'pl-dim');
  const shift = wq * 5;
  for (let i = 0; i < 6; i++) {
    const pos = i - shift;
    if (pos < -0.98) continue;
    const a = clamp(pos + 1, 0, 1);
    const x = 284 + pos * 52;
    const ours = i === 5;
    const g = `${rect(x, 210, 28, 52, ours ? 'pl-badge' : 'pl-bub', 5)}${rect(x + 5, 198, 18, 12, 'pl-mid', 3)}${ours ? txt(x + 14, 188, tr('verf', 'paint'), 20, 'middle', 'pl-on') : ''}`;
    out += a < 0.999 ? `<g opacity="${a.toFixed(2)}">${g}</g>` : g;
  }
  out += rect(252, 318, 356, 22, 'pl-dim', 4);
  if (wq > 0.005) out += `<rect class="pb-segW" x="252" y="318" width="${f1(356 * wq)}" height="22" rx="4"/>`;
  out += txt(252, 372, tr('vat wacht, vol en stil', 'vessel waits, full and still'), 20, 'start', 'pl-txt');
  out += txt(608, 372, `${Math.round(50 * wq)} min`, 20, 'end', 'pl-on');
  return out;
}

// CIP: a cut through the vat with the spray ball; then the levers; then the campaign debate
function cipSvg(step, clockS) {
  const X = 316;
  let out = rect(X, 12, 312, 376);
  out += txt(X + 16, 44, step === 2 ? tr('reinigen', 'cleaning') : step === 1 ? tr('meer capaciteit', 'more capacity') : 'CIP', 20, 'start', step === 0 ? 'pl-big' : 'pl-mute');
  out += txt(X + 296, 44, SCHEMA, 20, 'end', 'pl-mute');
  if (step === 0) {
    const L = 384;
    const R = 560;
    const T = 104;
    const B = 280;
    out += rect(L, T, R - L, B - T, 'pl-wall', 10);
    out += path([[472, 62], [472, T + 14]], 'pl-line') + circ(472, T + 22, 9, 'pl-bub');
    // the wet film on the walls, and the rinse running to the drain
    out += path([[L + 5, T + 10], [L + 5, B - 5], [R - 5, B - 5], [R - 5, T + 10]], 'pl-accl');
    out += arrow([[472, B], [472, B + 30]], 'pl-accl', 7);
    // spray: droplets out along rays from the ball to the walls
    const rays = [[-1, -0.25], [-1, 0.25], [-1, 0.8], [-0.55, 1], [0, 1], [0.55, 1], [1, 0.8], [1, 0.25], [1, -0.25]];
    rays.forEach(([dx, dy], k) => {
      const y0 = T + 22;
      const ts = [dx > 0 ? (R - 6 - 472) / dx : dx < 0 ? (L + 6 - 472) / dx : Infinity, dy > 0 ? (B - 6 - y0) / dy : dy < 0 ? (T + 6 - y0) / dy : Infinity];
      const tt = Math.min(...ts);
      const tx = 472 + dx * tt;
      const ey = y0 + dy * tt;
      out += path([[472, y0], [tx, ey]], 'pl-dim');
      for (const ph of [0, 0.5]) {
        const s = (clockS * 1.1 + k * 0.17 + ph) % 1;
        out += circ(lerp(472, tx, s), lerp(y0, ey, s), 2.6, 'pl-acc');
      }
    });
    out += txt(X + 16, 346, tr('heet water + reinigingsmiddel', 'hot water + detergent'), 20, 'start', 'pl-txt');
    out += txt(X + 16, 376, tr('niets uit elkaar', 'nothing taken apart'), 20, 'start', 'pl-on');
  } else if (step === 1) {
    const rows = NL ? ['snellere labtests', 'meten in de leiding', 'korter CIP-programma'] : ['faster lab tests', 'measuring in the pipe', 'shorter CIP programme'];
    rows.forEach((t, i) => { out += circ(X + 26, 92 + i * 44, 6, 'pl-acc') + txt(X + 42, 99 + i * 44, t, 20, 'start', 'pl-txt'); });
    out += path([[X + 16, 236], [X + 296, 236]], 'pl-dim');
    out += txt(X + 16, 274, tr('wachten en reinigen:', 'waiting and cleaning:'), 20, 'start', 'pl-mute');
    out += txt(X + 16, 304, tr('de twee grote', 'the two big ones'), 20, 'start', 'pl-on');
  } else {
    // product blocks (P) and cleans (C) in a row: after every batch, or a campaign first
    const row = (y, seq) => seq.split('').map((c, i) => rect(X + 16 + i * 34, y, 30, 30, c === 'P' ? 'pb-seg' : 'pb-segW', 4)).join('');
    out += txt(X + 16, 82, tr('na elke batch', 'after every batch'), 20, 'start', 'pl-txt') + row(94, 'PCPCPCPC');
    out += txt(X + 16, 160, tr('campagne', 'campaign'), 20, 'start', 'pl-txt') + row(172, 'PPPPPPPC');
    out += txt(X + 16, 238, tr('+ minder CIP-tijd', '+ less CIP time'), 20, 'start', 'pl-on');
    out += txt(X + 16, 272, tr('− bewijs: hygiënisch?', '− proof: still hygienic?'), 20, 'start', 'pl-txt');
    out += txt(X + 16, 306, tr('− langere opslag', '− longer storage'), 20, 'start', 'pl-txt');
    out += rect(X + 16, 334, 22, 22, 'pb-seg', 4) + txt(X + 46, 352, tr('product', 'product'), 20, 'start', 'pl-mute');
    out += rect(X + 150, 334, 22, 22, 'pb-segW', 4) + txt(X + 180, 352, 'CIP', 20, 'start', 'pl-mute');
  }
  return out;
}

// the bottleneck: a reactor feeding a filter on a time line, then a second reactor
function neckSvg(step, t) {
  let out = rect(12, 12, 616, 376);
  out += txt(28, 44, tr('reactor → filter', 'reactor → filter'), 20, 'start', 'pl-mute') + txt(612, 44, SCHEMA, 20, 'end', 'pl-mute');
  const x0 = 156;
  const x1 = 604;
  const sx = (h) => x0 + ((x1 - x0) * h) / 12;
  const rowsY = step >= 1 ? { A: 82, B: 132, F: 182 } : { A: 82, F: 132 };
  const name = { A: step >= 1 ? 'reactor A' : 'reactor', B: 'reactor B', F: 'filter' };
  for (const [k, y] of Object.entries(rowsY)) out += txt(28, y + 26, name[k], 20, 'start', 'pl-txt') + path([[x0, y + 34], [x1, y + 34]], 'pl-dim');
  const bars = [];
  bars.push(['A', 0, 6], ['A', 6, 12]);
  if (step >= 1) bars.push(['B', 3, 9], ['B', 9, 12], ['F', 6, 9], ['F', 9, 12]);
  else bars.push(['F', 6, 9]);
  for (const [k, a, b] of bars) {
    if (t <= a) continue;
    const e = Math.min(b, t);
    out += rect(sx(a) + 2, rowsY[k] + 4, sx(e) - sx(a) - 4, 30, k === 'F' ? 'pb-segA' : 'pb-seg', 4);
    if (k !== 'F' && e === b && b - a === 6) out += txt((sx(a) + sx(e)) / 2, rowsY[k] + 26, `${e - a} h`, 20, 'middle', 'pb-segT');
    if (k === 'F' && e - a > 1.2) out += txt((sx(a) + sx(e)) / 2, rowsY[k] + 26, `${e - a} h`, 20, 'middle', 'pl-mono');
    if (k === 'F' && t >= b) out += circ(sx(b) - 2, rowsY.F + 19, 7, 'pl-acc');
  }
  const ay = rowsY.F + 58;
  out += path([[x0, ay], [x1, ay]], 'pl-line');
  for (let h = 0; h <= 12; h += 3) out += path([[sx(h), ay], [sx(h), ay + 7]], 'pl-line') + txt(sx(h), ay + 30, h === 12 ? '12 h' : String(h), 20, 'middle', 'pl-mono');
  const by = step >= 1 ? 304 : 254;
  out += txt(28, by, step >= 1 ? tr('1 batch per 3 h', '1 batch every 3 h') : tr('1 batch per 6 h', '1 batch every 6 h'), 22, 'start', 'pl-big');
  if (step === 0) out += txt(28, by + 34, tr('het filter wacht de helft van de tijd', 'the filter waits half the time'), 20, 'start', 'pl-txt');
  if (step >= 2) {
    out += txt(28, 340, tr('tijd per batch / parallelle vaten:', 'time per batch / parallel vessels:'), 20, 'start', 'pl-on');
    out += txt(28, 372, tr('reactoren 6 / 2 = 3 h · filter 3 / 1 = 3 h', 'reactors 6 / 2 = 3 h · filter 3 / 1 = 3 h'), 20, 'start', 'pl-mono');
  }
  return out;
}

// the recipe (ISA-88): the levels down to the phase, then the phases with their set values
const PHASES = NL
  ? [['doseren', num('1.500 kg')], ['opwarmen', '60 °C'], ['aanhouden', '30 min'], ['overpompen', '→ tank 2']]
  : [['charge', num('1.500 kg')], ['heat', '60 °C'], ['hold', '30 min'], ['transfer', '→ tank 2']];
function recipeSvg(step, active) {
  const X = 300;
  let out = rect(X, 12, 328, 376);
  out += txt(X + 16, 44, tr('recept · ISA-88', 'recipe · ISA-88'), 20, 'start', 'pl-mute') + txt(X + 312, 44, EX, 20, 'end', 'pl-mute');
  const lv = NL ? ['procedure', 'unit procedure', 'operatie', 'fase'] : ['procedure', 'unit procedure', 'operation', 'phase'];
  lv.forEach((t, i) => {
    const x = X + 20 + i * 22;
    const y = 80 + i * 30;
    if (i) out += path([[x - 14, y - 24], [x - 14, y - 6], [x - 4, y - 6]], 'pl-dim');
    out += txt(x, y, t, 20, 'start', i === 3 && step >= 1 ? 'pl-on' : 'pl-txt');
  });
  if (step >= 1) {
    out += path([[X + 16, 192], [X + 312, 192]], 'pl-dim');
    PHASES.forEach(([n, v], i) => {
      const y = 224 + i * 30;
      const on = i === active;
      if (on) out += rect(X + 10, y - 22, 308, 30, 'pl-liq', 4);
      out += txt(X + 20, y, n, 20, 'start', on ? 'pl-on' : 'pl-txt') + txt(X + 308, y, v, 20, 'end', 'pl-mono');
    });
  }
  if (step >= 2) out += txt(X + 16, 368, tr('→ batchrapport: elke fase', '→ batch report: every phase'), 20, 'start', 'pl-on');
  return out;
}

// batch reports: the cycle times of the last 50 batches, fastest to slowest; then the trap; then the question
const TIMES = (() => {
  const out = [];
  let s = 7;
  for (let i = 0; i < 50; i++) { s = (s * 9301 + 49297) % 233280; out.push(268 + (s / 233280) * 70 + (i % 9 === 0 ? 25 : 0)); }
  return out.sort((a, b) => a - b);
})();
function reportSvg(step, q) {
  const X = 300;
  let out = rect(X, 12, 328, 376);
  if (step === 2) {
    out += txt(X + 16, 44, tr('scherpe vraag', 'sharp question'), 20, 'start', 'pl-mute');
    const lines = NL ? ['Hoeveel minuten', 'per batch wacht', 'dit vat op', 'een mens, het lab', 'of een vrije tank?'] : ['Per batch, how many', 'minutes does this', 'vessel wait for', 'a person, the lab', 'or a free tank?'];
    lines.forEach((t, i) => { out += txt(X + 16, 96 + i * 36, t, 22, 'start', i >= 3 ? 'pl-on' : 'pl-big'); });
    return out;
  }
  out += txt(X + 16, 44, tr('50 batches', '50 batches'), 20, 'start', 'pl-mute') + txt(X + 312, 44, EX, 20, 'end', 'pl-mute');
  const base = 250;
  const n = Math.round(50 * q);
  TIMES.forEach((v, i) => {
    if (i >= n) return;
    const h = (v - 230) * 1.4;
    const cls = i < 5 || i >= 45 ? 'pb-segH' : 'pb-seg';
    out += `<rect class="${cls}" x="${f1(X + 18 + i * 5.8)}" y="${f1(base - h)}" width="4.4" height="${f1(h)}"/>`;
  });
  out += path([[X + 16, base], [X + 312, base]], 'pl-line');
  out += txt(X + 16, base + 28, tr('snelst', 'fastest'), 20, 'start', 'pl-mute') + txt(X + 312, base + 28, tr('traagst', 'slowest'), 20, 'end', 'pl-mute');
  out += txt(X + 16, 74, tr('cyclustijd per batch', 'cycle time per batch'), 20, 'start', 'pl-txt');
  if (q >= 1) out += txt(X + 16, 314, tr('het verschil: de winst', 'the gap: the gain'), 20, 'start', 'pl-on');
  if (step >= 1) out += txt(X + 16, 352, tr('valkuil: vol bij ploegwissel', 'trap: full at shift change'), 20, 'start', 'pl-txt');
  return out;
}

SCN.cycle = ({ b, u, st, vis }) => {
  const q = span(u, 0.04, 0.62);
  vatFollow(st, GEN, q);
  vis.ring = 1;
  const sums = b >= 2 ? [[num('4 t / 5 h = 0,8 t/h'), 'pl-big'], [tr('dag en nacht: ≈ 19 t/dag', 'round the clock: ≈ 19 t/day'), 'pl-on']] : [];
  set(E.ring, ringSvg({ rows: GEN, q: q < 1 ? q : null, lit: b === 1 ? [4] : [], tag: SCHEMA, title: tr('batchcyclus', 'batch cycle'), minutes: false, sums }));
};
SCN.paint = ({ b, p, st, vis }) => {
  const split = 130 / 300;
  const q = b === 0 ? split * span(p, 0.08, 0.92) : b === 1 ? lerp(split, 1, span(p, 0.04, 0.9)) : 1;
  vatFollow(st, PAINT, q < 1 ? q : 0.999);
  if (b >= 2) { st.level = 0; st.mix = false; st.flow = {}; st.pump = false; }
  vis.ring = 1;
  let sums = [];
  if (b === 0) sums = [[num('3.000 kg per batch'), 'pl-big']];
  if (b === 1) sums = [[num('3.000 kg per batch'), 'pl-big']];
  if (b === 2) sums = [[num('3.000 kg / 5 h'), 'pl-big'], [num('= 600 kg/h'), 'pl-on']];
  if (b === 3) sums = [[tr('elke minuut telt even zwaar', 'every minute counts the same'), 'pl-txt'], [tr('hier 190 van de 300 min', 'here 190 of the 300 min'), 'pl-on']];
  set(E.ring, ringSvg({ rows: PAINT, q: q < 1 ? q : null, lit: b === 3 ? [0, 2, 4, 5] : [], tag: EX, title: tr('mengvat voor verf', 'paint mixing vessel'), sums }));
};
SCN.qc = ({ b, p, st, vis }) => {
  st.level = 0.8; st.mix = false; st.pump = false; st.flow = {}; st.belt = 0;
  vis.lab = 1;
  set(E.lab, labSvg(b, b === 0 ? 0.12 * span(p, 0.3, 1) : lerp(0.12, 1, span(p, 0.05, 0.85))));
};
SCN.cip = ({ b, clockS, st, vis }) => {
  st.level = 0; st.mix = false; st.pump = false; st.belt = 0;
  st.flow = { fI: b === 0 ? 1 : 0.4 };
  vis.cip = 1;
  set(E.cip, cipSvg(b, clockS));
};
SCN.inline = ({ b, p, u, st, vis }) => {
  const k = b === 0 ? 0 : b === 1 ? span(p, 0.05, 0.5) : 1;
  const rows = PAINT.map((r, i) => (i === 2 ? [r[0], r[1], lerp(50, 15, k), r[3]] : r));
  vatFollow(st, rows, u);
  vis.ring = 1;
  let sums = [[tr('inline viscositeitsmeter', 'inline viscosity meter'), 'pl-txt'], [tr('+ vast spoedmoment in het lab', '+ fast-track slot in the lab'), 'pl-txt']];
  if (b === 1) sums = [[tr('wachten: 50 → 15 min', 'waiting: 50 → 15 min'), 'pl-txt'], [tr('nieuwe cyclus: 265 min', 'new cycle: 265 min'), 'pl-on']];
  if (b === 2) sums = [[num('3.000 kg / 4,417 h = 679 kg/h'), 'pl-mono'], [tr('+13%, zelfde vat', '+13%, same vessel'), 'pl-on']];
  set(E.ring, ringSvg({ rows, q: null, lit: [2], tag: EX, title: tr('mengvat voor verf', 'paint mixing vessel'), sums }));
};
SCN.neck = ({ b, p, st, vis }) => {
  st.level = 0.6; st.mix = true; st.flow = {}; st.pump = false; st.belt = 0;
  vis.neck = 1;
  set(E.neck, neckSvg(b, b === 2 ? 12 : 12 * span(p, 0.05, 0.85)));
};
SCN.recipe = ({ b, p, st, vis }) => {
  const active = b === 0 ? -1 : Math.min(3, Math.floor((b === 1 ? span(p, 0.25, 1) : span(p, 0, 0.6)) * 4));
  const f = b === 0 ? 0 : (b === 1 ? span(p, 0.25, 1) : span(p, 0, 0.6)) * 4 - Math.max(0, active);
  st.belt = 0;
  st.flow = {};
  st.pump = false;
  st.mix = active === 1 || active === 2;
  st.level = active < 0 ? 0 : active === 0 ? 0.8 * clamp(f, 0, 1) : active === 3 ? 0.8 * (1 - clamp(f, 0, 1)) : 0.8;
  if (active === 0) st.flow = { fI: 1 };
  if (active === 3 && f < 1) { st.pump = true; st.flow = { fA: 1 }; }
  vis.recipe = 1;
  set(E.recipe, recipeSvg(b, active));
};
SCN.report = ({ b, p, st, vis }) => {
  st.level = 0.8; st.mix = false; st.pump = false; st.flow = {}; st.belt = 0;
  vis.report = 1;
  set(E.report, reportSvg(b, b === 0 ? span(p, 0.05, 0.6) : 1));
};
