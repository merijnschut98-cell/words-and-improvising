// The stage of the film "Het draaiveld / The rotating field": a pure function
// of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants and the model's data), CAM (one camera move
// per scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, span, beatStarts */
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
  const f2 = (v) => v.toFixed(2);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const grp = (v) => { const s = String(Math.round(v)); return s.length >= 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',') : s; };
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const exTag = (x = 620, y = 40) => txt(x, y, EX, 20, 'end', 'mf-mute');
  const PANEL = () => rect(204, 12, 428, 376);
  const MARKS = [E['mk-plate']].filter(Boolean);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);

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
    // the part marker: a radius of 18 stage units whatever the zoom (the kit draws circles with a non-scaling stroke)
    for (const m of MARKS) m.setAttribute('r', f1(18 / s));
  }

  // ------------------------------------------------------------ the world's live parts
  // the fan behind the cowl's grille: seven blades
  const at = (p) => iso(p, P);
  function fanPath(phase) {
    let d = '';
    for (let i = 0; i < 7; i++) {
      const t = phase + (i / 7) * Math.PI * 2;
      const a = at([C.COWL_X, 2.6 * Math.cos(t), C.ZC + 2.6 * Math.sin(t)]);
      const b = at([C.COWL_X, 11 * Math.cos(t + 0.35), C.ZC + 11 * Math.sin(t + 0.35)]);
      d += `M${f2(a[0])} ${f2(a[1])}L${f2(b[0])} ${f2(b[1])}`;
    }
    return d;
  }
  // the meter's screen (flat coordinates of the face plane: x, −z): the power line up to `prog` of the
  // time axis, and the energy under it shaded up to `fill`
  const sx = (t) => C.PLOT.x0 + (C.PLOT.x1 - C.PLOT.x0) * t;
  const sz = (t) => -(C.PLOT.z0 + (C.PLOT.z1 - C.PLOT.z0) * (0.6 + 0.025 * Math.sin(t * 23) + (t < 0.03 ? -0.6 * (1 - t / 0.03) : 0)));
  function screen(prog, fill) {
    if (prog <= 0) return '';
    const pts = [];
    for (let t = 0; t <= prog + 1e-9; t += 0.0125) pts.push([sx(t), sz(t)]);
    pts.push([sx(prog), sz(prog)]);
    let out = '';
    if (fill > 0) {
      const ar = [[sx(0), -C.PLOT.z0]];
      for (let t = 0; t <= fill + 1e-9; t += 0.0125) ar.push([sx(t), sz(t)]);
      ar.push([sx(fill), sz(fill)], [sx(fill), -C.PLOT.z0]);
      out += `<path class="mf-area" d="${ar.map(([x, y], i) => (i ? 'L' : 'M') + f2(x) + ' ' + f2(y)).join('')}Z"/>`;
    }
    return out + `<path class="mf-scr" d="${pts.map(([x, y], i) => (i ? 'L' : 'M') + f2(x) + ' ' + f2(y)).join('')}"/>`;
  }

  // ------------------------------------------------------------ s1: the meter's two readings
  function meterBase() {
    return PANEL() + exTag(620, 40) + rect(216, 56, 196, 214, 'mf-tile', 8) + rect(424, 56, 196, 214, 'mf-tile', 8);
  }
  function kwTile(v) {
    const cx = 314;
    const cy = 214;
    const r = 64;
    let out = rect(216, 56, 196, 214, 'mf-tile', 8) + txt(232, 92, 'kW', 26, 'start', 'mf-big') + txt(232, 120, tr('vermogen, nu', 'power, now'), 20, 'start', 'mf-mute');
    const arc = (a0, a1, rr) => `M${f1(cx + rr * Math.cos(a0))} ${f1(cy + rr * Math.sin(a0))}A${rr} ${rr} 0 0 1 ${f1(cx + rr * Math.cos(a1))} ${f1(cy + rr * Math.sin(a1))}`;
    out += `<path class="mf-axis" d="${arc(Math.PI, 2 * Math.PI, r)}"/>`;
    for (let i = 0; i <= 6; i++) { const a = Math.PI + (i / 6) * Math.PI; out += line(cx + (r - 8) * Math.cos(a), cy + (r - 8) * Math.sin(a), cx + r * Math.cos(a), cy + r * Math.sin(a)); }
    out += txt(cx - r, cy + 26, '0', 20, 'middle', 'mf-mute') + txt(cx + r, cy + 26, '30', 20, 'middle', 'mf-mute');
    const a = Math.PI + clamp(v / 30, 0, 1) * Math.PI;
    out += line(cx, cy, cx + (r - 12) * Math.cos(a), cy + (r - 12) * Math.sin(a), 'mf-accl') + dot(cx, cy, 5);
    out += txt(cx, cy + 46, `${dec(v, 1)} kW`, 22, 'middle', 'mf-mono');
    return out;
  }
  function kwhTile(h) {
    const e = C.KW * h;
    let out = rect(424, 56, 196, 214, 'mf-tile', 8) + txt(440, 92, 'kWh', 26, 'start', 'mf-big') + txt(440, 120, tr('energie, opgeteld', 'energy, added up'), 20, 'start', 'mf-mute');
    out += rect(446, 146, 152, 52, 'mf-panel', 6) + txt(586, 184, String(Math.floor(e + 1e-6)).padStart(4, '0'), 32, 'end', 'mf-mono');
    out += txt(522, 236, tr(`${dec(h, 1)} uur`, `${dec(h, 1)} h`), 21, 'middle', 'mf-txt');
    return out;
  }
  function meterSum(a) {
    return op(a, txt(222, 318, `${C.KW} kW × ${C.HRS} ${tr('uur', 'h')} = ${C.KW * C.HRS} kWh`, 22, 'start', 'mf-on')
      + txt(222, 352, tr('rekening: kWh; aansluiting en piek: kW', 'bill: kWh; connection and peak: kW'), 20, 'start', 'mf-mute'));
  }

  // ------------------------------------------------------------ s2: the efficiency chain
  const BX = [252, 402, 552];
  const BW = 46;
  const BY = 300;
  const KSC = 10; // px per kW
  function chainBase() {
    return PANEL() + txt(224, 380, EX, 20, 'start', 'mf-mute') + line(222, BY, 612, BY, 'mf-axis');
  }
  function chainIn(aW, aS, aN, lit) {
    const vals = [C.P_IN, C.P_SHAFT, C.HYD];
    const names = [tr('net', 'grid'), tr('as', 'shaft'), tr('water', 'water')];
    const a = [aN, aS, aW];
    let out = '';
    vals.forEach((v, i) => {
      if (a[i] <= 0.01) return;
      const h = v * KSC * a[i];
      out += `<rect class="fp-meter"${i === 0 && lit ? ' data-top=""' : ''} x="${BX[i]}" y="${f1(BY - h)}" width="${BW}" height="${f1(h)}" rx="3"/>`;
      out += op(a[i], txt(BX[i] + BW / 2, BY - v * KSC - 12, `${dec(v, v === C.HYD ? 0 : 1)} kW`, 21, 'middle', i === 0 && lit ? 'mf-on' : 'mf-big') + txt(BX[i] + BW / 2, BY + 26, names[i], 20, 'middle', 'mf-mute'));
    });
    // the losses between the bars, and the efficiency of each step
    const step = (i, aa, name, eta) => {
      if (aa <= 0.01) return '';
      const x0 = BX[i] + BW;
      const x1 = BX[i + 1];
      const y0 = BY - vals[i] * KSC;
      const y1 = BY - vals[i + 1] * KSC;
      return op(aa, `<path class="mf-band" d="M${x0} ${f1(y0)}L${x1} ${f1(y1)}L${x1} ${BY}L${x0} ${BY}Z"/>`
        + txt((x0 + x1) / 2, (y0 + y1) / 2 + 30, tr('warmte', 'heat'), 20, 'middle', 'mf-mute')
        + txt((x0 + x1) / 2, BY - 50, name, 20, 'middle', 'mf-txt') + txt((x0 + x1) / 2, BY - 24, `${Math.round(eta * 100)}%`, 21, 'middle', 'mf-big'));
    };
    out += step(1, aS, tr('pomp', 'pump'), C.ETA_P) + step(0, aN, 'motor', C.ETA_M);
    return out;
  }
  function chainYear(a) {
    const e = Math.round(Math.round(C.P_IN * 10) * C.YEAR_H / 10);
    return op(a, txt(222, 52, `${grp(e)} kWh ${tr('per jaar', 'a year')}`, 22, 'start', 'mf-on') + txt(222, 82, `≈ €${grp(Math.round(e * 0.15 / 100) * 100)} ${tr('bij €0,15', 'at €0.15')}`, 20, 'start', 'mf-txt'));
  }

  // ------------------------------------------------------------ s3: three phase voltages
  const WX0 = 262;
  const WX1 = 612;
  const WY = 140;
  const WA = 60;
  const wave = (k, x) => WY - WA * Math.sin(2 * Math.PI * 2 * (x - WX0) / (WX1 - WX0) - k * 2 * Math.PI / 3);
  const WCLS = ['mf-line', 'mf-l2', 'mf-l3'];
  function wavesBase() {
    let out = PANEL() + txt(620, 40, tr('schema', 'diagram'), 20, 'end', 'mf-mute');
    out += line(WX0, WY, WX1, WY, 'mf-grid') + line(WX0, WY - WA - 14, WX0, WY + WA + 14, 'mf-axis');
    out += txt(WX0 - 10, WY + 7, '0', 20, 'end', 'mf-mute');
    return out;
  }
  function wavesIn(draw, cursor) {
    let out = '';
    draw.forEach((pr, k) => {
      if (pr <= 0.01) return;
      const pts = [];
      for (let x = WX0; x <= lerp(WX0, WX1, pr) + 1e-9; x += 3) pts.push([x, wave(k, x)]);
      out += `<path class="${WCLS[k]}" d="${fmt(pts)}"/>`;
      // the legend: a short sample of each line with its name
      out += op(pr, `<path class="${WCLS[k]}" d="M${236 + k * 128} 238L${276 + k * 128} 238"/>` + txt(284 + k * 128, 245, `L${k + 1}`, 20, 'start', 'mf-txt'));
    });
    if (cursor >= 0) {
      const x = lerp(WX0, WX1, cursor);
      out += line(x, WY - WA - 10, x, WY + WA + 10, 'mf-dash');
      [0, 1, 2].forEach((k) => { if (draw[k] > 0.99) out += dot(x, wave(k, x), 5); });
    }
    return out;
  }
  function wavesTxt(third, t1, t2) {
    let out = '';
    if (third > 0.01) {
      const xa = WX0 + (WX1 - WX0) / 8;
      const xb = xa + (WX1 - WX0) / 6;
      out += op(third, `<path class="mf-accl" d="M${f1(xa)} 70L${f1(xa)} 62L${f1(xb)} 62L${f1(xb)} 70"/>` + txt((xa + xb) / 2, 52, tr('⅓ periode', '⅓ cycle'), 20, 'middle', 'mf-on'));
    }
    out += op(t1, txt(222, 290, tr('50 Hz: 50 keer per seconde', '50 Hz: 50 times a second'), 21, 'start', 'mf-txt'));
    out += op(t2, txt(222, 322, tr(`${C.U_LL} V tussen twee fasen`, `${C.U_LL} V between two phases`), 21, 'start', 'mf-txt') + txt(222, 354, tr(`${C.U_LN} V tussen fase en nul`, `${C.U_LN} V phase to neutral`), 21, 'start', 'mf-txt'));
    return out;
  }

  // ------------------------------------------------------------ s4: the power-factor triangle
  const PO = [244, 292];
  const LH = 320;
  function pfBase() { return PANEL() + exTag(620, 40); }
  function pfIn(grow, light) {
    if (grow <= 0.01) return '';
    const act = lerp(LH * C.PF, 96, light);
    const rea = LH * C.Q_SHARE;
    const cos = act / Math.hypot(act, rea);
    const A = [PO[0] + act * grow, PO[1]];
    const B = [PO[0] + act * grow, PO[1] - rea * grow];
    let out = line(PO[0], PO[1], A[0], A[1], 'mf-line') + line(A[0], A[1], B[0], B[1], 'mf-l2') + line(PO[0], PO[1], B[0], B[1], 'mf-line');
    out += op(grow, txt(Math.max((PO[0] + A[0]) / 2, PO[0] + 76), PO[1] + 30, tr('werkstroom', 'working current'), 20, 'middle', 'mf-txt')
      + txt(A[0] + 12, (A[1] + B[1]) / 2 - 4, tr('veld-', 'field'), 20, 'start', 'mf-txt') + txt(A[0] + 12, (A[1] + B[1]) / 2 + 20, tr('stroom', 'current'), 20, 'start', 'mf-txt')
      + txt((PO[0] + B[0]) / 2 - 18, (PO[1] + B[1]) / 2 - 14, light > 0.5 ? tr('totaal', 'total') : tr(`totaal ${C.AMPS} A`, `total ${C.AMPS} A`), 20, 'end', 'mf-txt'));
    const ang = Math.atan2(rea, act);
    out += `<path class="mf-axis" d="M${PO[0] + 52} ${PO[1]}A52 52 0 0 0 ${f1(PO[0] + 52 * Math.cos(ang))} ${f1(PO[1] - 52 * Math.sin(ang))}"/>` + txt(PO[0] + 62, PO[1] - 12, 'φ', 21, 'start', 'mf-txt');
    return { svg: out, cos };
  }
  function pfLabel(a, cos, light) {
    return op(a, txt(222, 60, `cos φ ${light > 0.5 ? '≈' : '='} ${dec(cos, light > 0.5 ? 1 : 2)}`, 24, 'start', 'mf-on')
      + (light > 0.5 ? txt(222, 88, tr('licht belast', 'light load'), 20, 'start', 'mf-mute') : txt(222, 88, tr('vol belast: 0,8 à 0,9', 'full load: 0.8 to 0.9'), 20, 'start', 'mf-mute')));
  }
  function pfSum(a) {
    return op(a, txt(222, 362, `√3 × ${C.U_LL} × ${C.AMPS} × ${dec(C.PF, 2)} = ${dec(17.7, 1)} kW`, 22, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s5–s7: a section through the motor
  const SC = [318, 204];
  const RO = 114;
  const RB = 80;
  const RR = 72;
  const SLOTS = 12;
  function sectBase() {
    return PANEL() + txt(222, 380, tr('schema, vertraagd, slip overdreven', 'diagram, slowed, slip exaggerated'), 20, 'start', 'mf-mute');
  }
  // the stator: a ring with twelve slots; each slot's copper lit by its phase current (positive petrol, negative grey)
  function statorSvg(wt, cur) {
    let out = `<path class="mf-iron" fill-rule="evenodd" d="M${SC[0] + RO} ${SC[1]}A${RO} ${RO} 0 1 0 ${SC[0] - RO} ${SC[1]}A${RO} ${RO} 0 1 0 ${SC[0] + RO} ${SC[1]}ZM${SC[0] + RB} ${SC[1]}A${RB} ${RB} 0 1 0 ${SC[0] - RB} ${SC[1]}A${RB} ${RB} 0 1 0 ${SC[0] + RB} ${SC[1]}Z"/>`;
    for (let i = 0; i < SLOTS; i++) {
      const a = (i / SLOTS) * 2 * Math.PI;
      const c = Math.cos(wt - a);
      const pts = [[RB + 3, -0.11], [RB + 26, -0.13], [RB + 26, 0.13], [RB + 3, 0.11]].map(([r, d]) => [SC[0] + r * Math.cos(a + d), SC[1] + r * Math.sin(a + d)]);
      out += `<path class="mf-panel" d="${fmt(pts)}Z"/>`;
      if (cur > 0.01) out += `<path class="${c >= 0 ? 'mf-cu' : 'mf-cuN'}" style="opacity:${(cur * (0.15 + 0.85 * Math.abs(c))).toFixed(2)}" d="${fmt(pts)}Z"/>`;
    }
    // the three phases' names at their slots
    ['U', 'V', 'W'].forEach((n, k) => { const a = (k * 2 * Math.PI) / 3 - Math.PI / 2; out += txt(SC[0] + (RO + 16) * Math.cos(a), SC[1] + (RO + 16) * Math.sin(a) + 7, n, 20, 'middle', 'mf-mute'); });
    return out;
  }
  // the cage rotor: laminations, 16 bars and the shaft with its key, turned by th
  function rotorSvg(th) {
    let out = `<circle class="mf-tile" cx="${SC[0]}" cy="${SC[1]}" r="${RR}"/>`;
    for (let i = 0; i < 16; i++) { const a = th + (i / 16) * 2 * Math.PI; out += dot(SC[0] + (RR - 10) * Math.cos(a), SC[1] + (RR - 10) * Math.sin(a), 4.5, 'mf-hollow'); }
    out += `<circle class="mf-iron" cx="${SC[0]}" cy="${SC[1]}" r="17"/>`;
    out += line(SC[0] + 17 * Math.cos(th), SC[1] + 17 * Math.sin(th), SC[0] + (RR - 22) * Math.cos(th), SC[1] + (RR - 22) * Math.sin(th), 'mf-line');
    return out;
  }
  // the field: an arrow across the bore, N at its head
  function fieldSvg(ang, a) {
    if (a <= 0.01) return '';
    const L = RB - 6;
    const hx = SC[0] + L * Math.cos(ang);
    const hy = SC[1] + L * Math.sin(ang);
    const head = [[hx, hy], [hx - 24 * Math.cos(ang - 0.42), hy - 24 * Math.sin(ang - 0.42)], [hx - 24 * Math.cos(ang + 0.42), hy - 24 * Math.sin(ang + 0.42)]];
    return op(a, `<path class="mf-accl" style="stroke-width:4" d="M${f1(SC[0] - L * Math.cos(ang))} ${f1(SC[1] - L * Math.sin(ang))}L${f1(hx - 14 * Math.cos(ang))} ${f1(hy - 14 * Math.sin(ang))}"/>` + `<path class="mf-acc" d="${fmt(head)}Z"/>`);
  }
  function sideSvg(lines) {
    return lines.map(([t, a, cls, y]) => op(a, txt(458, y, t, 21, 'start', cls || 'mf-txt'))).join('');
  }

  // ------------------------------------------------------------ s8: the nameplate
  const ROWS = () => [
    ['3~ Mot', 'IEC 60034'],
    [`${C.P_FAN} kW`, 'S1   50 Hz'],
    ['400 V Δ', '54 A'],
    [`${grp(C.N_FAN)} min⁻¹`, `cos φ ${dec(C.PF, 2)}`],
    ['IE3', `${dec(93.6, 1)}%   IP55`],
  ];
  function plateBase() {
    let out = PANEL() + exTag(620, 36) + rect(232, 48, 372, 304, 'mf-tile', 6);
    for (const [x, y] of [[244, 60], [592, 60], [244, 340], [592, 340]]) out += dot(x, y, 4, 'mf-hollow');
    return out;
  }
  function plateIn(rowsA, lit) {
    let out = '';
    ROWS().forEach(([a, b], i) => {
      const y = 98 + i * 44;
      if (lit.includes(i)) out += rect(248, y - 30, 340, 42, 'mf-accf', 4);
      out += op(rowsA, txt(262, y, a, 23, 'start', i === 0 ? 'mf-big' : 'mf-mono') + txt(576, y, b, 23, 'end', 'mf-mono'));
    });
    return out;
  }
  function plateIsol(a, lit, temp) {
    const y = 98 + 5 * 44;
    let out = '';
    if (lit) out += rect(248, y - 30, 340, 42, 'mf-accf', 4);
    out += op(a, txt(262, y, tr('Isol.Kl. F', 'Ins.Cl. F'), 23, 'start', 'mf-mono') + txt(576, y, '155 °C', 23, 'end', 'mf-mono'));
    out += op(temp, txt(222, 378, tr('+10 °C: ruwweg halve levensduur', '+10 °C: roughly half the life'), 20, 'start', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ s9: the IE classes
  function ieBase() { return PANEL() + exTag(620, 380); }
  function ieLadder(mark) {
    let out = '';
    for (let i = 0; i < 5; i++) {
      const x = 222 + i * 78;
      const lit = i === 2 && mark > 0.5;
      out += rect(x, 40, 70, 42, lit ? 'mf-accf' : 'mf-tile', 5) + txt(x + 35, 69, `IE${i + 1}`, 21, 'middle', lit ? 'mf-on' : 'mf-mono');
    }
    out += op(mark, txt(222, 116, tr('EU: IE3 sinds 2021 (0,75 tot 1.000 kW)', 'EU: IE3 since 2021 (0.75 to 1,000 kW)'), 20, 'start', 'mf-txt')
      + txt(222, 144, tr('IE4 sinds 2023 (75 tot 200 kW)', 'IE4 since 2023 (75 to 200 kW)'), 20, 'start', 'mf-txt'));
    return out;
  }
  function ieIn(bars, save) {
    let out = '';
    const W0 = 390;
    const row = (y, name, v, a, top) => op(a, txt(222, y, name, 21, 'start', 'mf-txt') + txt(612, y, `${dec(v, 1)} kW`, 21, 'end', 'mf-big')
      + `<rect class="fp-meter"${top ? ' data-top=""' : ''} x="222" y="${y + 10}" width="${f1(W0 * v / C.IN1 * a)}" height="16" rx="3"/>`);
    out += row(196, tr('IE1, zo’n 90%', 'IE1, about 90%'), C.IN1, span(bars, 0, 0.5), false);
    out += row(254, `IE3, ${dec(93.6, 1)}%`, C.IN3, span(bars, 0.4, 0.9), false);
    if (bars > 0.95) out += `<rect class="mf-accf" x="${f1(222 + W0 * C.IN3 / C.IN1)}" y="206" width="${f1(W0 * (1 - C.IN3 / C.IN1))}" height="16" rx="2"/>`;
    out += op(save, txt(222, 318, `${dec(1.1, 1)} kW × ${grp(C.YEAR_H)} ${tr('uur', 'h')} ≈ ${grp(6400)} kWh`, 22, 'start', 'mf-on') + txt(222, 348, tr('≈ €960 per jaar, bij €0,15', '≈ €960 a year, at €0.15'), 20, 'start', 'mf-txt'));
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['meter', 'chain', 'waves', 'pf', 'sect', 'plateK', 'ie'];
  set(E.mtBase, meterBase());
  set(E.chBase, chainBase());
  set(E.wvBase, wavesBase());
  set(E.pfBase, pfBase());
  set(E.scBase, sectBase());
  set(E.plBase, plateBase());
  set(E.ieBase, ieBase());
  const SLOW = 2 * Math.PI * 0.22; // the drawn field turns 0,22 times a second
  const SLIPV = 0.18; // the drawn slip, much larger than 2 % so the eye can see it
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let scrProg = 1;
    let scrFill = 1;

    if (si === 0) {
      vis.meter = span(u, 0.42, 0.5);
      scrProg = b === 0 ? span(p, 0.1, 0.9) * 0.4 : b === 1 ? 0.4 + 0.6 * span(p, 0, 0.9) : 1;
      scrFill = b < 3 ? 0 : span(p, 0.1, 0.8);
      set(E.mtKw, kwTile(b < 2 ? 0 : C.KW * (b === 2 ? span(p, 0.1, 0.4) : 1)));
      set(E.mtKwh, kwhTile(b < 3 ? 0 : C.HRS * span(p, 0.1, 0.8)));
      set(E.mtSum, meterSum(b === 3 ? span(p, 0.7, 0.9) : 0));
    } else if (si === 1) {
      vis.chain = span(u, 0, 0.04);
      const aW = b === 0 ? span(p, 0.3, 0.7) : 1;
      const aS = on(b, 1, p, 0.2, 0.5);
      const aN = on(b, 1, p, 0.55, 0.85);
      set(E.chIn, chainIn(aW, aS, aN, b >= 2));
      set(E.chYear, chainYear(b === 3 ? span(p, 0.1, 0.5) : 0));
    } else if (si === 2) {
      vis.waves = span(u, 0, 0.04);
      const d1 = b === 0 ? span(p, 0.1, 0.8) : 1;
      const d23 = on(b, 1, p, 0.05, 0.45);
      const cursor = b >= 1 ? (clockS * 0.06) % 1 : -1;
      set(E.wvIn, wavesIn([d1, d23, d23], d23 > 0.99 ? cursor : -1));
      set(E.wvTxt, wavesTxt(b === 1 ? span(p, 0.5, 0.7) : 0, on(b, 0, p, 0.6, 0.9), on(b, 2, p, 0.1, 0.4)));
    } else if (si === 3) {
      vis.pf = span(u, 0, 0.04);
      const light = b === 3 ? span(p, 0.15, 0.6) : 0;
      const t = pfIn(b === 0 ? span(p, 0.2, 0.8) : 1, light);
      set(E.pfIn, t ? t.svg : '');
      set(E.pfSum, pfSum(on(b, 2, p, 0.1, 0.4) * (1 - light)));
      E.pfBase.__lbl = pfLabel(on(b, 1, p, 0.1, 0.35), t ? t.cos : C.PF, light);
      set(E.pfBase, pfBase() + E.pfBase.__lbl);
    } else if (si >= 4 && si <= 6) {
      vis.sect = span(u, 0, 0.04);
      const wt = clockS * SLOW;
      const cur = si === 4 ? on(b, 1, p, 0.3, 0.6) : 1;
      const fieldA = si === 4 ? on(b, 2, p, 0.05, 0.25) : 1;
      // s5: the rotor turns with the field once the field is shown; from s6 on it visibly slips behind
      const rot = wt * (1 - SLIPV) - Math.PI / 2;
      set(E.scStator, statorSvg(wt, cur));
      set(E.scRotor, rotorSvg(fieldA > 0.5 || si > 4 ? rot : -Math.PI / 2));
      set(E.scField, fieldSvg(wt - Math.PI / 2, fieldA));
      let side = [];
      let slip = [];
      let sync = [];
      if (si === 4) {
        side = [[tr('50 Hz', '50 Hz'), on(b, 3, p, 0.2, 0.4), 'mf-big', 70], [tr('2, 4, 6 polen', '2, 4, 6 poles'), on(b, 3, p, 0.4, 0.6), 'mf-txt', 100]];
      } else if (si === 5) {
        side = [[tr('rotor: kooi', 'rotor: cage'), on(b, 0, p, 0.2, 0.5), 'mf-txt', 70], [tr('veld sleept', 'field drags'), on(b, 1, p, 0.3, 0.6), 'mf-on', 120], [tr('de rotor mee', 'the rotor along'), on(b, 1, p, 0.3, 0.6), 'mf-on', 148]];
        slip = [[tr('rotor trager', 'rotor slower'), on(b, 2, p, 0.2, 0.5), 'mf-txt', 250], [tr('slip 1 tot 5%', 'slip 1 to 5%'), on(b, 2, p, 0.4, 0.7), 'mf-big', 280],
          [tr('meer last,', 'more load,'), on(b, 3, p, 0.4, 0.7), 'mf-txt', 330], [tr('meer slip', 'more slip'), on(b, 3, p, 0.4, 0.7), 'mf-txt', 358]];
      } else {
        sync = [['120 × 50 / 4', 1, 'mf-mono', 60], [tr(`= ${grp(1500)} tpm`, `= ${grp(1500)} rpm`), on(b, 0, p, 0.4, 0.7), 'mf-on', 90],
          [tr(`2 polen: ${grp(3000)}`, `2 poles: ${grp(3000)}`), on(b, 1, p, 0.1, 0.4), 'mf-txt', 136],
          [tr(`4 polen: ${grp(1500)}`, `4 poles: ${grp(1500)}`), on(b, 1, p, 0.1, 0.4), 'mf-txt', 164],
          [tr(`6 polen: ${grp(1000)}`, `6 poles: ${grp(1000)}`), on(b, 1, p, 0.3, 0.6), 'mf-txt', 192]];
        slip = [[tr(`rotor ${grp(C.N_FAN)}`, `rotor ${grp(C.N_FAN)}`), on(b, 2, p, 0.1, 0.4), 'mf-txt', 240], [`slip ${Math.round(C.SLIP * 100)}%`, on(b, 2, p, 0.5, 0.8), 'mf-big', 270]];
        side = [[`${Math.round(C.TORQUE)} Nm`, on(b, 3, p, 0.3, 0.6), 'mf-big', 330], [tr(`bij ${C.P_FAN} kW`, `at ${C.P_FAN} kW`), on(b, 3, p, 0.3, 0.6), 'mf-txt', 358]];
      }
      set(E.scSide, sideSvg(side));
      set(E.scSlip, sideSvg(slip));
      set(E.scSync, sideSvg(sync));
    } else if (si === 7) {
      vis.plateK = span(u, 0, 0.04);
      const rowsA = b === 0 ? span(p, 0.2, 0.6) : 1;
      const lit = b === 1 ? [1] : b === 2 ? [2, 3, 4] : [];
      set(E.plIn, plateIn(rowsA, lit));
      set(E.plIsol, plateIsol(rowsA, b >= 3, b === 4 ? span(p, 0.2, 0.5) : 0));
    } else if (si === 8) {
      vis.ie = span(u, 0, 0.04);
      set(E.ieLadder, ieLadder(on(b, 1, p, 0.1, 0.4)));
      set(E.ieIn, ieIn(on(b, 2, p, 0.05, 0.8), b === 3 ? span(p, 0.1, 0.5) : 0));
    }

    // world parts
    E.fan.setAttribute('d', fanPath(clockS * 2.2));
    flag(E.lamp, 'data-lit', true);
    set(E.scr, screen(scrProg, scrFill));
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
