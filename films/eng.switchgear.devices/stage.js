// The stage of the film "Wat kan deze schakelaar? / What can this switch do?":
// a pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants and the model's data), CAM (one camera move
// per scene), W and H. Moves are placed per caption beat (beatStarts), so the
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
  const cross = (x, y, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x - 8)} ${f1(y - 14)}l16 16M${f1(x + 8)} ${f1(y - 14)}l-16 16"/>`;
  const EX = tr('voorbeeld', 'example');
  const SCH = tr('schema', 'diagram');
  const PANEL = () => rect(204, 12, 428, 376);
  const MARKS = [E['mk-rmu'], E['mk-trafo']].filter(Boolean);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);

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
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
    for (const m of MARKS) m.setAttribute('r', f1(18 / s));
  }

  // ------------------------------------------------------------ the mimic on the RMU: switch and earthing blades
  // closed 0..1 for each panel's switch, earthed 0..1 for its earthing switch (flat face coordinates x, −z)
  const M = C.MIMIC;
  function blades(sw, ea) {
    C.blades.forEach(({ cx, ex }, i) => {
      const a = lerp(0.62, 0, sw[i]);
      const L1 = M.top - M.piv;
      setD(E[`sw${i}`], `M${f1(cx)} ${f1(-M.piv)}L${f1(cx - L1 * Math.sin(a))} ${f1(-(M.piv + L1 * Math.cos(a)))}`);
      const b = lerp(0.62, 0, ea[i]);
      const L2 = M.tee - (M.ep - 3);
      setD(E[`ea${i}`], `M${f1(ex)} ${f1(-(M.ep - 3))}L${f1(ex - L2 * Math.sin(b))} ${f1(-(M.ep - 3 + L2 * Math.cos(b)))}`);
    });
  }

  // ------------------------------------------------------------ s2: the vacuum interrupter (a schema)
  const VB = { x: 300, top: 70, bot: 330 };
  function vbBase() {
    return PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute') + txt(284, 382, tr('vacuüm', 'vacuum'), 20, 'end', 'mf-mute');
  }
  const vbBody = () => rect(232, 52, 136, 300, 'mf-tile', 12) + line(232, 92, 368, 92, 'mf-grid') + line(232, 312, 368, 312, 'mf-grid');
  // the moving contact's gap (0 closed, 1 open), the arc's strength
  function vbIn(gap, arc, clockS) {
    const g = 46 * gap;
    let out = '';
    // the shield round the contacts, the fixed contact and stem from the top, the moving one from below
    out += `<path class="mf-ghost" d="M256 130V270M344 130V270"/>`;
    out += rect(291, 22, 18, 158, 'mf-iron', 3) + rect(270, 172, 60, 14, 'mf-iron', 4);
    out += rect(270, 190 + g, 60, 14, 'mf-iron', 4) + rect(291, 204 + g, 18, 176 - g, 'mf-iron', 3);
    // the bellows that let the moving stem slide in the sealed bottle
    const bz = [];
    for (let i = 0; i <= 8; i++) bz.push([i % 2 ? 278 : 322, lerp(270 + g * 0.6, 310, i / 8)]);
    out += `<path class="mf-ghost" d="${fmt(bz)}"/>`;
    if (arc > 0.01) {
      const pts = [];
      for (let i = 0; i <= 6; i++) pts.push([300 + (i % 2 ? 1 : -1) * (4 + 5 * Math.abs(Math.sin(clockS * 13 + i))), lerp(186, 190 + g, i / 6)]);
      out += op(arc, `<path class="mf-accl" style="stroke-width:5;opacity:.35" d="${fmt(pts)}"/><path class="mf-accl" d="${fmt(pts)}"/>`);
    }
    return out;
  }
  // the current through the contacts: a sine; from the parting (tp) the arc carries it to the next zero
  const IX0 = 404;
  const IX1 = 612;
  const IY = 300;
  function vbTrace(draw, tp) {
    const pts = [];
    const n = Math.round(draw * 120);
    let zero = null;
    for (let i = 0; i <= n; i++) {
      const t = i / 120;
      let v = Math.sin(t * 4 * Math.PI + 0.6);
      if (t > tp) {
        const tz = (Math.ceil((tp * 4 * Math.PI + 0.6) / Math.PI) * Math.PI - 0.6) / (4 * Math.PI);
        if (t >= tz) { v = 0; if (zero === null) zero = tz; }
      }
      pts.push([lerp(IX0, IX1, t), IY - 44 * v]);
    }
    let out = line(IX0, IY, IX1, IY, 'mf-grid') + `<path class="mf-line" d="${fmt(pts)}"/>` + txt(IX0, IY - 60, tr('stroom', 'current'), 20, 'start', 'mf-mute');
    if (draw > tp) out += line(lerp(IX0, IX1, tp), IY - 50, lerp(IX0, IX1, tp), IY + 50, 'mf-grid') + txt(lerp(IX0, IX1, tp) - 6, IY + 74, tr('open', 'open'), 20, 'end', 'mf-mute');
    if (zero !== null) out += dot(lerp(IX0, IX1, zero), IY, 6, 'mf-acc') + txt(IX1, IY + 74, tr('nul: boog uit', 'zero: arc out'), 20, 'end', 'mf-on');
    return out;
  }
  function vbRelay(a, trip) {
    return op(a, rect(404, 56, 208, 64, 'mf-tile', 6) + txt(418, 84, tr('relais', 'relay'), 20, 'start', 'mf-txt') + txt(418, 108, trip > 0.5 ? tr('fout: open!', 'fault: open!') : tr('meet de stroom', 'measures current'), 20, 'start', trip > 0.5 ? 'mf-on' : 'mf-mute'));
  }
  function vbRating(a) {
    return op(a, txt(404, 172, tr('onderbreekt', 'breaks'), 20, 'start', 'mf-mute') + txt(404, 204, `${C.CB_RANGE[0]}–${C.CB_RANGE[1]} kA`, 26, 'start', 'mf-big'));
  }

  // ------------------------------------------------------------ s3: the fault level (an example)
  const KX0 = 236;
  const KX1 = 600;
  const kx = (ka) => KX0 + (KX1 - KX0) * (ka / 25);
  function flBase() {
    let out = PANEL() + txt(222, 40, 'kA', 20, 'start', 'mf-mute') + txt(620, 40, EX, 20, 'end', 'mf-mute');
    out += line(KX0, 300, KX1, 300) + [0, 5, 10, 15, 20, 25].map((v) => line(kx(v), 300, kx(v), 308) + txt(kx(v), 330, v, 20, 'middle', 'mf-mute')).join('');
    return out;
  }
  function flIn(a, rate, ex) {
    let out = '';
    // the fault level near a substation: a band, 15 to 20 kA
    out += op(a, txt(222, 78, tr('kortsluitvermogen bij onderstation', 'fault level near a substation'), 20, 'start', 'mf-txt')
      + `<rect class="mf-band" x="${f1(kx(C.FL[0]))}" y="92" width="${f1(kx(C.FL[1]) - kx(C.FL[0]))}" height="26" rx="3"/>` + txt(kx(C.FL[1]) + 8, 112, `${C.FL[0]}–${C.FL[1]}`, 20, 'start', 'mf-mono'));
    // the breaker ratings above it
    out += op(rate, txt(222, 160, tr('schakelaar: zwaarder', 'breaker: rated above'), 20, 'start', 'mf-txt')
      + `<rect class="fp-meter" x="${KX0}" y="172" width="${f1((kx(C.CB_KA) - KX0) * rate)}" height="22" rx="3"/>` + line(kx(C.FL[1]), 84, kx(C.FL[1]), 300, 'mf-dash') + op(span(rate, 0.6, 1), txt(kx(C.CB_KA) + 8, 190, `${C.CB_KA}`, 20, 'start', 'mf-mono')));
    // the example: an 8 kA fault, opened in about 0,3 s
    out += op(ex, txt(222, 236, tr('graafschade', 'digger fault'), 20, 'start', 'mf-txt')
      + `<rect class="fp-meter" data-top="" x="${KX0}" y="248" width="${f1((kx(C.FAULT_KA) - KX0) * clamp(ex * 1.5, 0, 1))}" height="22" rx="3"/>` + txt(kx(C.FAULT_KA) + 8, 266, `${C.FAULT_KA}`, 20, 'start', 'mf-on')
      + op(span(ex, 0.55, 0.9), txt(612, 266, tr(`open na ${dec(C.T_OPEN)} s`, `open after ${dec(C.T_OPEN)} s`), 20, 'end', 'mf-on')));
    return out;
  }

  // ------------------------------------------------------------ s4: the MV fuse (a schema)
  const FZ = { x0: 252, x1: 568, y0: 142, y1: 222 };
  function fzBase() {
    let out = PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute') + txt(222, 40, tr('MS-zekering', 'MV fuse'), 20, 'start', 'mf-txt');
    out += rect(FZ.x0, FZ.y0, FZ.x1 - FZ.x0, FZ.y1 - FZ.y0, 'mf-tile', 14);
    out += rect(FZ.x0 - 26, FZ.y0 - 8, 30, FZ.y1 - FZ.y0 + 16, 'mf-iron', 5) + rect(FZ.x1 - 4, FZ.y0 - 8, 30, FZ.y1 - FZ.y0 + 16, 'mf-iron', 5);
    return out;
  }
  // the element (melted 0..1)
  function fzIn(melt, clockS) {
    const ym = (FZ.y0 + FZ.y1) / 2;
    const xm = (FZ.x0 + FZ.x1) / 2;
    const gap = 30 * melt;
    const zig = (xa, xb) => { const p = []; for (let x = xa; x <= xb + 0.1; x += 8) p.push([x, ym + (Math.round((x - FZ.x0) / 8) % 2 ? 7 : -7)]); return fmt(p); };
    let s = `<path class="mf-line" d="${zig(FZ.x0 + 4, xm - gap)}"/><path class="mf-line" d="${zig(xm + gap, FZ.x1 - 4)}"/>`;
    if (melt > 0.05 && melt < 0.7) s += op(1 - melt, `<path class="mf-accl" d="M${f1(xm - gap)} ${ym}L${f1(xm - gap / 3)} ${f1(ym - 8 * Math.sin(clockS * 17))}L${f1(xm + gap / 3)} ${f1(ym + 8)}L${f1(xm + gap)} ${ym}"/>`);
    s += op(1, txt(xm, FZ.y0 - 18, tr('smeltdraad', 'element'), 20, 'middle', 'mf-txt'));
    return s;
  }
  function fzTxt(a, b) {
    return op(a, txt(222, 300, tr(`transformator ${400} kVA`, `transformer ${400} kVA`), 20, 'start', 'mf-txt') + txt(222, 328, tr('één zekering per fase', 'one fuse per phase'), 20, 'start', 'mf-mute'))
      + op(b, txt(222, 362, tr('werkt één keer: daarna vervangen', 'works once: then replace'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s5: the three-position switch (a schema)
  const SP = { x: 330, piv: 262, bus: 82, fix: 150, ex: 420, ey: 236 };
  function dsBase() {
    let out = PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute');
    out += line(240, SP.bus, 420, SP.bus, 'mf-line') + txt(222, SP.bus - 14, tr('rail', 'busbar'), 20, 'start', 'mf-mute');
    out += line(SP.x, SP.bus, SP.x, SP.fix, 'mf-line') + dot(SP.x, SP.fix, 5);
    out += line(SP.x, SP.piv, SP.x, 340, 'mf-line') + dot(SP.x, SP.piv, 6) + txt(SP.x + 12, 336, tr('kabel', 'cable'), 20, 'start', 'mf-mute');
    // the earth contact and symbol
    out += dot(SP.ex - 34, SP.ey, 5) + line(SP.ex - 34, SP.ey, SP.ex, SP.ey, 'mf-line') + line(SP.ex, SP.ey, SP.ex, SP.ey + 22, 'mf-line')
      + line(SP.ex - 16, SP.ey + 22, SP.ex + 16, SP.ey + 22, 'mf-line') + line(SP.ex - 10, SP.ey + 30, SP.ex + 10, SP.ey + 30, 'mf-line') + line(SP.ex - 4, SP.ey + 38, SP.ex + 4, SP.ey + 38, 'mf-line');
    return out;
  }
  // the blade angle: 0 closed (up to the busbar contact), 0.6 open, 1.35 earthed (to the earth contact)
  function dsBlade(pos) {
    const a = pos;
    const len = SP.piv - SP.fix;
    return `<path class="mf-line" style="stroke-width:4" d="M${SP.x} ${SP.piv}L${f1(SP.x + len * Math.sin(a))} ${f1(SP.piv - len * Math.cos(a))}"/>`;
  }
  function dsLabels(state) {
    const items = [[tr('dicht', 'closed'), 0], [tr('open', 'open'), 1], [tr('geaard', 'earthed'), 2]];
    return items.map(([t, i]) => txt(470, 128 + i * 34, t, 22, 'start', state === i ? 'mf-on' : 'mf-mute')).join('');
  }
  function dsLock(a, blocked) {
    return op(a, rect(462, 252, 150, 62, 'mf-accf', 6) + txt(474, 278, tr('vergrendeling', 'interlock'), 20, 'start', 'mf-on') + txt(474, 302, blocked ? tr('geblokkeerd', 'blocked') : tr('volgorde klopt', 'order is right'), 20, 'start', 'mf-txt'))
      + op(a * (blocked ? 1 : 0), cross(SP.ex - 60, SP.ey - 20, 'mf-accl'));
  }
  function dsFlash(a, clockS) {
    if (a <= 0.01) return '';
    const cx = SP.x;
    const cy = SP.fix + 12;
    let s = '';
    for (let i = 0; i < 10; i++) { const t = (i / 10) * 2 * Math.PI + clockS; const r = 26 + 10 * Math.sin(clockS * 9 + i); s += line(cx + 10 * Math.cos(t), cy + 10 * Math.sin(t), cx + r * Math.cos(t), cy + r * Math.sin(t), 'mf-accl'); }
    return op(a, s + txt(612, 360, tr('vlamboog', 'arc flash'), 22, 'end', 'mf-on'));
  }

  // ------------------------------------------------------------ s6: air against gas (a schema, not to scale)
  function agBase() {
    return PANEL() + txt(620, 40, tr('schema, niet op schaal', 'diagram, not to scale'), 20, 'end', 'mf-mute');
  }
  // a substation's row of panels: each a breaker, a measuring transformer (a ring) and a relay
  function agRow(a) {
    if (a <= 0.01) return '';
    let s = '';
    for (let i = 0; i < 4; i++) {
      const x = 226 + i * 98;
      s += rect(x, 70, 88, 260, 'mf-tile', 4) + rect(x + 10, 84, 68, 34, 'mf-panel', 3) + dot(x + 22, 101, 3) + line(x + 30, 101, x + 66, 101, 'mf-axis');
      s += rect(x + 28, 150, 32, 62, 'mf-iron', 4) + `<circle class="mf-iron" cx="${x + 44}" cy="${250}" r="12"/>` + line(x + 44, 212, x + 44, 238, 'mf-line') + line(x + 44, 262, x + 44, 330, 'mf-line');
    }
    s += txt(226, 362, tr('per veld: relais, schakelaar, meettrafo', 'per panel: relay, breaker, CT'), 20, 'start', 'mf-mute');
    return op(a, s);
  }
  function agAis(a) {
    if (a <= 0.01) return '';
    let s = rect(226, 64, 170, 280, 'mf-tile', 6);
    [262, 311, 360].forEach((x) => { s += line(x, 96, x, 300, 'mf-line') + dot(x, 96, 5) + dot(x, 300, 5); });
    s += `<path class="mf-dash" d="M268 200H305M317 200H354"/>` + txt(311, 230, tr('lucht', 'air'), 20, 'middle', 'mf-mute');
    s += txt(311, 372, 'AIS', 22, 'middle', 'mf-txt');
    return op(a, s);
  }
  function agGis(a) {
    if (a <= 0.01) return '';
    let s = rect(448, 164, 150, 180, 'mf-tile', 6) + `<rect class="mf-gas" x="462" y="182" width="122" height="120" rx="14"/>`;
    [503, 523, 543].forEach((x) => { s += line(x, 196, x, 288, 'mf-line') + dot(x, 196, 4) + dot(x, 288, 4); });
    s += txt(523, 372, 'GIS', 22, 'middle', 'mf-txt');
    return op(a, s);
  }
  const agSf6 = (a) => op(a, txt(574, 296, 'SF6', 20, 'end', 'mf-on'));
  function agGauge(a) {
    if (a <= 0.01) return '';
    const cx = 523;
    const cy = 112;
    const band = [];
    for (let t = 0.3; t <= 2.2; t += 0.1) band.push([cx + 30 * Math.sin(t), cy - 30 * Math.cos(t)]);
    return op(a, `<circle class="mf-tile" cx="${cx}" cy="${cy}" r="38"/><path class="mf-accl" d="${fmt(band)}"/>` + line(cx, cy, cx + 28 * Math.sin(1.1), cy - 28 * Math.cos(1.1), 'mf-line') + dot(cx, cy, 4) + txt(cx - 50, cy + 8, tr('druk', 'pressure'), 20, 'end', 'mf-on'));
  }

  // ------------------------------------------------------------ s7: the SF6 sums and dates (an example)
  function sfBase() { return PANEL() + txt(620, 40, EX, 20, 'end', 'mf-mute'); }
  function sfIn(a) {
    const rows = [
      [`1 kg SF6`, `≈ ${grp(C.GWP)} kg CO2`],
      [`${grp(C.RMUS)} RMU × ${dec(C.KG)} kg`, `${C.STOCK_T} t SF6`],
      [tr(`${dec(0.1)}% lek per jaar`, `${dec(0.1)}% leak a year`), `${C.LEAK_KG} kg`],
      [`× ${grp(C.GWP)}`, tr('≈ 700 t CO2-eq.', '≈ 700 t CO2-eq.')],
    ];
    return rows.map(([l, v], i) => op(a[i], txt(222, 76 + i * 44, l, 20, 'start', 'mf-txt') + txt(612, 76 + i * 44, v, 22, 'end', i === 3 ? 'mf-on' : 'mf-big'))).join('');
  }
  function sfAlt(a) {
    if (a <= 0.01) return '';
    const x = (y) => lerp(236, 600, (y - 2024) / 8);
    let s = line(236, 300, 600, 300) + [2024, 2026, 2028, 2030, 2032].map((y) => line(x(y), 300, x(y), 308) + txt(x(y), 330, y, 20, 'middle', 'mf-mute')).join('');
    s += op(span(a, 0, 0.4), `<rect class="mf-accf" x="${f1(x(2026))}" y="256" width="${f1(x(2032) - x(2026))}" height="18" rx="3"/>` + txt(x(2026), 248, tr('tot 24 kV', 'up to 24 kV'), 20, 'start', 'mf-on'));
    s += op(span(a, 0.4, 0.8), `<rect class="mf-accf" x="${f1(x(2030))}" y="278" width="${f1(x(2032) - x(2030))}" height="16" rx="3"/>` + txt(x(2030) - 8, 370, tr('tot 52 kV', 'up to 52 kV'), 20, 'start', 'mf-on'));
    s += op(span(a, 0.7, 1), txt(222, 370, tr('vacuüm, droge lucht', 'vacuum, dry air'), 20, 'start', 'mf-txt'));
    return s;
  }

  // ------------------------------------------------------------ s8: what can this switch do (a schema)
  const TB = [[tr('vermogensschakelaar', 'circuit breaker'), 'y', 'y'], [tr('lastscheider', 'load-break switch'), 'y', 'n'], [tr('zekering', 'fuse'), '-', '1'], [tr('scheider', 'disconnector'), 's', 's'], [tr('aardingsschakelaar', 'earthing switch'), 'e', 'e']];
  function tbBase() {
    return PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute') + txt(486, 72, tr('last', 'load'), 20, 'middle', 'mf-mute') + txt(572, 72, tr('kortsl.', 'fault'), 20, 'middle', 'mf-mute');
  }
  function cell(v, x, y, lit) {
    const c = lit ? 'mf-accl' : 'mf-line';
    if (v === 'y') return tick(x, y, c);
    if (v === 'n') return cross(x, y + 2, lit ? 'mf-accl' : 'mf-axis');
    if (v === '1') return txt(x, y + 4, '1×', 20, 'middle', lit ? 'mf-on' : 'mf-txt');
    return line(x - 8, y - 4, x + 8, y - 4, 'mf-axis');
  }
  function tbIn(a, lit) {
    return TB.map(([name, l1, l2], i) => {
      const y = 92 + i * 56;
      const hot = lit.includes(i);
      let row = rect(222, y, 390, 46, hot ? 'mf-accf' : 'mf-tile', 5) + txt(234, y + 30, name, 20, 'start', hot ? 'mf-on' : 'mf-txt');
      if (l1 === 's') row += txt(600, y + 30, tr('alleen stroomloos', 'dead only'), 20, 'end', hot ? 'mf-on' : 'mf-mute');
      else if (l1 === 'e') row += txt(600, y + 30, tr('naar aarde', 'to earth'), 20, 'end', hot ? 'mf-on' : 'mf-mute');
      else row += cell(l1, 486, y + 28, hot) + cell(l2, 572, y + 28, hot);
      return op(a[i], row);
    }).join('');
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['vb', 'fl', 'fz', 'ds', 'ag', 'sf', 'tb'];
  set(E.vbBase, vbBase());
  set(E.vbBody, vbBody());
  set(E.flBase, flBase());
  set(E.fzBase, fzBase());
  set(E.dsBase, dsBase());
  set(E.agBase, agBase());
  set(E.sfBase, sfBase());
  set(E.tbBase, tbBase());
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let sw = [1, 1, 1];
    let ea = [0, 0, 0];

    if (si === 1) {
      vis.vb = span(u, 0.04, 0.12);
      const open = b === 3 ? span(p, 0.12, 0.3) : 0;
      const tp = 0.32;
      const draw = b === 3 ? span(p, 0.02, 0.75) : 0;
      const tz = 0.375;
      const arc = b === 3 && open > 0.05 && draw < tz + 0.01 ? 1 : 0;
      set(E.vbCb, vbRating(on(b, 1, p, 0.1, 0.4)));
      set(E.vbIn, vbIn(open, arc, clockS));
      set(E.vbRelay, vbRelay(on(b, 2, p, 0.0, 0.25), b === 2 ? (p > 0.5 ? 1 : 0) : b > 2 ? 1 : 0));
      set(E.vbTxt, b === 3 ? vbTrace(draw, tp) : '');
    } else if (si === 2) {
      vis.fl = span(u, 0, 0.04);
      set(E.flIn, flIn(on(b, 0, p, 0.1, 0.5), on(b, 2, p, 0.05, 0.5), on(b, 3, p, 0.05, 0.6)));
      set(E.flTxt, '');
    } else if (si === 3) {
      vis.fz = b === 2 ? span(p, 0, 0.08) : b > 2 ? 1 : 0;
      // the ring switch is opened and closed again to show switching load
      if (b === 1) sw = [p > 0.35 && p < 0.75 ? 0 : 1, 1, 1];
      const melt = b === 3 ? span(p, 0.15, 0.45) : 0;
      set(E.fzIn, fzIn(melt, clockS));
      set(E.fzTxt, fzTxt(on(b, 2, p, 0.3, 0.6), b === 3 ? span(p, 0.75, 0.9) : 0));
    } else if (si === 4) {
      vis.ds = span(u, 0, 0.04);
      // the three-position switch: closed → open (beat 1) → earthed (beat 2); beat 3 tries the wrong order
      let pos = 0;
      let state = 0;
      if (b === 0) { pos = 0.6 * span(p, 0.35, 0.6); state = p > 0.5 ? 1 : 0; }
      if (b === 1) { pos = lerp(0.6, 1.35, span(p, 0.3, 0.6)); state = p > 0.5 ? 2 : 1; }
      if (b === 2) { pos = p < 0.5 ? 1.35 - 1.35 * span(p, 0.05, 0.3) : 0; state = p < 0.3 ? 2 : 0; }
      if (b === 3) { pos = 0.6 * span(p, 0.2, 0.4); state = 1; }
      sw[0] = pos <= 0.6 ? 1 - pos / 0.6 : 0;
      ea[0] = pos > 0.6 ? (pos - 0.6) / 0.75 : 0;
      set(E.dsIso, dsBlade(pos) + dsLabels(state));
      set(E.dsEarth, '');
      set(E.dsLock, dsLock(b === 2 ? span(p, 0.3, 0.45) : 0, b === 2 && p > 0.5));
      set(E.dsTxt, dsFlash(b === 3 ? span(p, 0.3, 0.45) * (1 - span(p, 0.85, 1)) : 0, clockS));
    } else if (si === 5) {
      vis.ag = span(u, 0, 0.04);
      set(E.agRow, agRow(b === 0 ? span(p, 0.05, 0.3) : b === 1 ? 1 - span(p, 0, 0.12) : 0));
      set(E.agAis, agAis(b >= 1 ? on(b, 1, p, 0.12, 0.4) : 0));
      set(E.agGis, agGis(on(b, 2, p, 0.05, 0.4)));
      set(E.agSf6, agSf6(on(b, 2, p, 0.3, 0.6)));
      set(E.agGauge, agGauge(on(b, 3, p, 0.05, 0.35)));
    } else if (si === 6) {
      vis.sf = span(u, 0, 0.04);
      set(E.sfIn, sfIn([on(b, 0, p, 0.2, 0.5), on(b, 1, p, 0.05, 0.3), on(b, 1, p, 0.5, 0.75), on(b, 2, p, 0.05, 0.4)]));
      set(E.sfAlt, sfAlt(b === 3 ? span(p, 0.05, 0.85) : 0));
    } else if (si === 7) {
      vis.tb = span(u, 0, 0.04);
      // the closing scene is one beat: the table builds row by row while the question is asked
      set(E.tbIn, tbIn([0, 1, 2, 3, 4].map((i) => span(p, 0.04 + i * 0.1, 0.16 + i * 0.1)), []));
    }
    blades(sw, ea);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
