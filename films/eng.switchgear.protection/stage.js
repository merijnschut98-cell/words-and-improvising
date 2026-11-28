// The stage of the film "Van kortsluiting tot uitschakeling / From short
// circuit to trip": a pure function of (scene, u). Inlined into the page after
// the anatomy kit (iso-kit functions in scope) and a preamble from build.mjs
// that defines P (projection), C (world constants and the model's data), CAM
// (one camera move per scene), W and H. Moves are placed per caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. The cards' fixed parts are drawn once at load.
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
  const grp = (v) => { const s = String(Math.round(v)); return s.length >= 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',') : s; };
  const dec = (v) => (NL ? String(v).replace('.', ',') : String(v));
  const txt = (x, y, t, size = 20, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const tick = (x, y, cls = 'mf-accl') => `<path class="${cls}" d="M${f1(x - 9)} ${f1(y - 6)}l7 8l14 -16"/>`;
  const cross = (x, y, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x - 8)} ${f1(y - 14)}l16 16M${f1(x + 8)} ${f1(y - 14)}l-16 16"/>`;
  const star = (x, y, r, k) => { const p = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * 2 * Math.PI; const rr = i % 2 ? r * 0.42 : r * (0.8 + 0.2 * Math.sin(k + i)); p.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]); } return fmt(p) + 'Z'; };
  const EX = tr('voorbeeld', 'example');
  const SCH = tr('schema', 'diagram');
  const PANEL = () => rect(204, 12, 428, 376);
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

  let scaleNow = 1;
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    scaleNow = s;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the mimic on the RMU: the switch and earthing blades (closed, not earthed)
  const M = C.MIMIC;
  C.blades.forEach(({ cx, ex }, i) => {
    const L1 = M.top - M.piv;
    E[`sw${i}`].setAttribute('d', `M${f1(cx)} ${f1(-M.piv)}L${f1(cx)} ${f1(-(M.piv + L1))}`);
    const b = 0.62;
    const L2 = M.tee - (M.ep - 3);
    E[`ea${i}`].setAttribute('d', `M${f1(ex)} ${f1(-(M.ep - 3))}L${f1(ex - L2 * Math.sin(b))} ${f1(-(M.ep - 3 + L2 * Math.cos(b)))}`);
  });

  // the fault on the feeder (world space) and the relay's trip lamp
  function flash(a, clockS) {
    if (a <= 0.01) return '';
    const [x, y] = C.FLASH;
    const r = 13 / Math.max(0.6, scaleNow) * (1 + 0.15 * Math.sin(clockS * 9));
    return op(a, `<path class="mf-accf" d="${star(x, y, r * 1.6, clockS * 3)}" style="opacity:.5"/><path class="mf-acc" d="${star(x, y, r, clockS * 5)}"/>`);
  }

  // ------------------------------------------------------------ s2: the measuring transformers (a schema)
  function mtBase() {
    return PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute') + line(222, 206, 614, 206, 'mf-grid');
  }
  function mtCt(a, val, std, clockS) {
    if (a <= 0.01) return '';
    let s = '';
    // the primary: the cable through the ring; the secondary: two wires down to the relay
    s += rect(224, 102, 196, 16, 'mf-iron', 4);
    s += `<ellipse class="mf-line" cx="300" cy="110" rx="16" ry="40" style="stroke-width:7"/>`;
    s += rect(292, 102, 8, 16, 'mf-iron', 0);
    s += line(296, 150, 296, 172, 'mf-line') + line(304, 150, 304, 172, 'mf-line') + rect(262, 172, 76, 24, 'mf-tile', 4);
    s += txt(300, 190, tr('relais', 'relay'), 20, 'middle', 'mf-mute');
    // current: many dots along the cable, few along the secondary
    for (let i = 0; i < 8; i++) { const x = 230 + ((i * 25 + clockS * 60) % 186); s += dot(x, 110, 2.6, 'mf-dot'); }
    s += dot(304, 152 + ((clockS * 12) % 18), 2.2, 'mf-dot');
    s += op(val, txt(330, 90, `${C.CT[0]} A`, 22, 'start', 'mf-big') + txt(350, 190, `${C.CT[1]} A`, 22, 'start', 'mf-big'));
    s += txt(222, 44, tr('stroomtransformator', 'current transformer'), 20, 'start', 'mf-txt');
    s += op(val, txt(440, 118, `${C.CT[0]}/${C.CT[1]} A`, 26, 'start', 'mf-big'));
    s += op(std, txt(440, 160, tr(`of ${C.CT[0]}/5 A`, `or ${C.CT[0]}/5 A`), 20, 'start', 'mf-mute'));
    return op(a, s);
  }
  function mtVt(a, std) {
    if (a <= 0.01) return '';
    let s = line(224, 290, 274, 290, 'mf-line') + `<circle class="mf-iron" cx="290" cy="290" r="20"/><circle class="mf-iron" cx="316" cy="290" r="20" style="fill:none"/>` + line(336, 290, 380, 290, 'mf-line') + rect(380, 278, 30, 24, 'mf-tile', 4);
    s += txt(224, 276, '10 kV', 22, 'start', 'mf-big') + txt(395, 330, '100 V', 22, 'middle', 'mf-big');
    s += txt(222, 240, tr('spanningstransformator', 'voltage transformer'), 20, 'start', 'mf-txt');
    s += txt(440, 304, '10 kV → 100 V', 22, 'start', 'mf-big');
    s += op(std, txt(440, 346, tr('veilig en standaard', 'safe and standard'), 20, 'start', 'mf-on'));
    return op(a, s);
  }

  // ------------------------------------------------------------ s3: the relay decides, in milliseconds (a schema)
  const BX = [[222, 100, tr('meten', 'measure')], [348, 110, tr('relais', 'relay')], [486, 128, tr('schakelaar', 'breaker')]];
  const box3 = (i, cls) => rect(BX[i][0], 56, BX[i][1], 52, cls, 6) + txt(BX[i][0] + BX[i][1] / 2, 89, BX[i][2], 20, 'middle', 'mf-txt');
  function rlBase() {
    let s = PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute');
    s += box3(0, 'mf-tile');
    s += line(322, 82, 348, 82, 'mf-line') + line(458, 82, 486, 82, 'mf-ghost') + dot(348, 82, 3.5) + dot(486, 82, 3.5, 'mf-dot');
    return s;
  }
  function rlRelay(a, sets) {
    let s = box3(1, 'mf-tile');
    s += op(sets, txt(348, 140, tr('instellingen', 'settings'), 20, 'start', 'mf-mute') + txt(348, 168, tr('I>   vertraagd', 'I>   delayed'), 20, 'start', 'mf-mono') + txt(348, 194, tr('I>>  direct', 'I>>  instant'), 20, 'start', 'mf-mono'));
    return op(a, s);
  }
  function rlCb(a, open) {
    let s = box3(2, open > 0.5 ? 'mf-accf' : 'mf-tile');
    s += op(open, line(458, 82, 486, 82, 'mf-accl') + txt(550, 140, tr('open', 'open'), 20, 'middle', 'mf-on'));
    return op(a, s);
  }
  // the milliseconds: measuring at once, the relay's decision, the set delay, the breaker opening
  function rlTime(a, k) {
    if (a <= 0.01) return '';
    const y = 300;
    const x = [224, 232, 352, 470, 572];
    let s = line(224, y, 614, y, 'mf-axis') + txt(224, y + 28, tr('fout', 'fault'), 20, 'start', 'mf-mute');
    const segs = [[0, tr('meten', 'measure'), 'fp-meter'], [1, tr('beslissen', 'decide'), 'fp-meter'], [2, tr('+ vertraging', '+ delay'), 'gd'], [3, tr('openen', 'open'), 'fp-meter']];
    segs.forEach(([i, label, cls], j) => {
      const w = (x[i + 1] - x[i]) * clamp(k * 4 - j, 0, 1);
      if (w <= 0) return;
      s += cls === 'gd' ? rect(x[i], y - 30, w, 22, 'mf-tile', 3) + `<path class="mf-gdash" d="M${f1(x[i] + 4)} ${y - 19}H${f1(x[i] + w - 4)}"/>` : `<rect class="${cls}" ${j === 3 ? 'data-top=""' : ''} x="${f1(x[i])}" y="${y - 30}" width="${f1(w)}" height="22" rx="3"/>`;
      if (j > 0) s += op(clamp(k * 4 - j, 0, 1), txt(x[i] + (x[i + 1] - x[i]) / 2, y - 42, label, 20, 'middle', j === 3 ? 'mf-on' : 'mf-mute'));
    });
    s += op(clamp(k * 4 - 3.6, 0, 1), dot(572, y, 6, 'mf-acc') + txt(572, y + 28, tr('stroom weg', 'current off'), 20, 'middle', 'mf-on'));
    s += txt(222, 232, tr('enkele tientallen ms + vertraging', 'tens of ms + the set delay'), 20, 'start', 'mf-txt');
    return op(a, s);
  }
  function rlLog(a) {
    return op(a, rect(222, 214, 392, 120, 'mf-tile', 6) + txt(238, 246, tr('geregistreerd', 'recorded'), 20, 'start', 'mf-mute')
      + txt(238, 278, tr('welke trap', 'which stage'), 20, 'start', 'mf-mono') + txt(238, 306, tr('welke foutstroom, wanneer', 'which current, when'), 20, 'start', 'mf-mono')
      + txt(614, 370, tr('test: stroom injecteren', 'test: inject current'), 20, 'end', 'mf-on'));
  }

  // ------------------------------------------------------------ s4-s5: the time-current curve (a schema; the example's numbers)
  const X0 = 270;
  const X1 = 612;
  const Y0 = 320;
  const Y1 = 64;
  const lx = (a) => X0 + (X1 - X0) * (Math.log10(a) - 2) / (Math.log10(20000) - 2);
  const ty = (t) => Y0 - (t / 1.2) * (Y0 - Y1);
  function tcBase() {
    return PANEL();
  }
  function tcAx() {
    let s = line(X0, Y1 - 6, X0, Y0) + line(X0, Y0, X1, Y0);
    for (const a of [100, 1000, 10000]) s += line(lx(a), Y0, lx(a), Y0 + 8) + txt(lx(a), Y0 + 30, grp(a), 20, 'middle', 'mf-mute');
    for (const t of [0.5, 1]) s += line(X0 - 8, ty(t), X0, ty(t)) + line(X0, ty(t), X1, ty(t), 'mf-grid') + txt(X0 - 12, ty(t) + 7, dec(t), 20, 'end', 'mf-mute');
    s += txt(222, 44, tr('tijd, s', 'time, s'), 20, 'start', 'mf-mute') + txt(X1, 378, tr('stroom, A', 'current, A'), 20, 'end', 'mf-mute');
    return s;
  }
  const CURVE = () => [[lx(C.S1), ty(1.2)], [lx(C.S1), ty(C.T1)], [lx(C.S2), ty(C.T1)], [lx(C.S2), ty(0.03)], [lx(20000), ty(0.03)]];
  function partial(pts, k) {
    let len = 0;
    const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); len += l; }
    let left = len * clamp(k, 0, 1);
    const out = [pts[0]];
    for (let i = 1; i < pts.length && left > 0; i++) { const t = Math.min(1, left / seg[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)]); left -= seg[i - 1]; }
    return out;
  }
  function tcCurve(k) {
    return k <= 0.01 ? '' : `<path class="mf-line" d="${fmt(partial(CURVE(), k))}"/>`;
  }
  // labels: the two stages (nums: with the example's values), the load band, the smallest fault, the trip dots
  function tcIn(stages, nums, band, fault, dots) {
    let s = '';
    s += op(stages, txt(lx(C.S1) + 10, ty(C.T1) - 14, nums ? `${tr('trap 1', 'stage 1')}: ${C.S1} A, ${dec(C.T1)} s` : tr('trap 1: vertraagd', 'stage 1: delayed'), 20, 'start', 'mf-txt')
      + txt(lx(C.S2) - 10, ty(0.2), nums ? `${tr('trap 2', 'stage 2')}: ${grp(C.S2)} A` : tr('trap 2: direct', 'stage 2: instant'), 20, 'end', 'mf-txt'));
    s += op(band, `<rect class="mf-band" x="${f1(X0)}" y="${f1(Y1)}" width="${f1(lx(C.LOAD) - X0)}" height="${f1(Y0 - Y1)}"/>` + txt(X0 + 8, Y0 - 14, tr('belasting', 'load'), 20, 'start', 'mf-mute')
      + line(lx(C.FMIN), Y1, lx(C.FMIN), Y0, 'mf-dash') + txt(lx(C.FMIN) + 8, ty(0.88), tr('fout eind', 'end fault'), 20, 'start', 'mf-on'));
    s += op(fault, txt(lx(C.FMIN) + 8, ty(1.1), nums ? `${grp(C.FMIN)} A` : '', 20, 'start', 'mf-on'));
    s += op(dots[0], dot(lx(C.FMIN), ty(C.T1), 7, 'mf-acc') + txt(lx(C.FMIN), ty(C.T1) + 30, `${dec(C.T1)} s`, 20, 'middle', 'mf-on'));
    s += op(dots[1], dot(lx(C.FNEAR), ty(0.03), 7, 'mf-acc') + txt(lx(C.FNEAR), ty(0.03) - 44, `${grp(C.FNEAR)} A`, 20, 'middle', 'mf-on') + txt(lx(C.FNEAR), ty(0.03) - 20, tr('direct', 'instant'), 20, 'middle', 'mf-on'));
    return s;
  }
  // the example's sums
  function exIn(a) {
    const rows = [
      [tr('maximale belasting', 'maximum load'), `${C.LOAD} A`],
      [tr('kleinste fout, eind', 'smallest fault, end'), `${grp(C.FMIN)} A`],
      [tr('stroomtransformator', 'current transformer'), `${C.CT[0]}/${C.CT[1]} A`],
      [tr(`trap 1: ${dec(1.5)} × ${C.LOAD}`, `stage 1: ${dec(1.5)} × ${C.LOAD}`), `${C.S1} A`],
      [tr('vertraging', 'delay'), `${dec(C.T1)} s`],
      [tr(`relais: ${C.S1} / ${C.CT[0]}`, `relay: ${C.S1} / ${C.CT[0]}`), `${dec(C.RELAY_A)} A`],
    ];
    let s = PANEL() + txt(620, 40, EX, 20, 'end', 'mf-mute');
    rows.forEach(([l, v], i) => { s += op(a[i], txt(222, 84 + i * 50, l, 20, 'start', 'mf-txt') + txt(612, 84 + i * 50, v, 22, 'end', i === 5 ? 'mf-on' : 'mf-big')); });
    return s;
  }

  // ------------------------------------------------------------ s6: earth fault and the star point (a schema)
  function efBase() { return PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute') + line(222, 212, 614, 212, 'mf-grid'); }
  function efSum(a, leak, sens) {
    if (a <= 0.01) return '';
    const cx = 300;
    const cy = 124;
    const r = 46;
    const ang = [-90, 150, 30].map((d) => (d * Math.PI) / 180);
    let s = '';
    ang.forEach((t, i) => {
      const rr = i === 0 ? r * (1 + 0.5 * leak) : r;
      const x = cx + rr * Math.cos(t);
      const y = cy + rr * Math.sin(t);
      s += line(cx, cy, x, y, 'mf-line') + dot(x, y, 4) + txt(cx + (rr + 22) * Math.cos(t), cy + (rr + 22) * Math.sin(t) + 7, `L${i + 1}`, 20, 'middle', 'mf-mute');
    });
    s += dot(cx, cy, 4);
    if (leak > 0.01) s += op(leak, line(cx + 40, cy, cx + 40, cy - r * 0.5 * leak, 'mf-accl') + dot(cx + 40, cy - r * 0.5 * leak, 4, 'mf-acc'));
    s += txt(430, 92, tr('som van drie fasen', 'sum of three phases'), 20, 'start', 'mf-txt');
    s += sens > 0.5 ? txt(430, 132, tr('klein: gevoelig,', 'small: sensitive,'), 20, 'start', 'mf-on') + txt(430, 160, tr('richtingsgevoelig', 'directional'), 20, 'start', 'mf-on')
      : leak > 0.5 ? txt(430, 136, tr('≠ 0: aardfout', '≠ 0: earth fault'), 22, 'start', 'mf-on') : txt(430, 136, tr('= 0: gezond', '= 0: healthy'), 22, 'start', 'mf-big');
    return op(a, s);
  }
  // three ways to earth the star point: a resistor, a coil, not at all
  function mini(cx, kind, lit) {
    const cy = 262;
    let s = '';
    for (const d of [-90, 150, 30]) { const t = (d * Math.PI) / 180; s += line(cx, cy, cx + 30 * Math.cos(t), cy + 30 * Math.sin(t), 'mf-line'); }
    s += dot(cx, cy, 5, lit ? 'mf-acc' : 'mf-dot') + line(cx, cy, cx, cy + 22, 'mf-line');
    if (kind === 0) s += rect(cx - 7, cy + 22, 14, 26, 'mf-tile', 2) + line(cx, cy + 48, cx, cy + 58, 'mf-line');
    if (kind === 1) s += `<path class="mf-line" d="M${cx} ${cy + 22}c10 0 10 9 0 9c10 0 10 9 0 9c10 0 10 9 0 9"/>` + line(cx, cy + 49, cx, cy + 58, 'mf-line');
    if (kind === 2) s += cross(cx, cy + 50, 'mf-axis');
    if (kind !== 2) s += line(cx - 14, cy + 58, cx + 14, cy + 58, 'mf-line') + line(cx - 9, cy + 64, cx + 9, cy + 64, 'mf-line') + line(cx - 4, cy + 70, cx + 4, cy + 70, 'mf-line');
    return s;
  }
  function efStar(a, opts) {
    if (a <= 0.01) return '';
    const names = [tr('weerstand', 'resistor'), tr('spoel', 'coil'), tr('niet geaard', 'unearthed')];
    let s = txt(296, 250, tr('sterpunt', 'star point'), 20, 'start', 'mf-on');
    [280, 420, 556].forEach((x, i) => { s += op(i === 0 ? 1 : opts, mini(x, i, true)) + op(opts, txt(x, 372, names[i], 20, 'middle', 'mf-txt')); });
    return op(a, s);
  }

  // ------------------------------------------------------------ s7: the settings sheet and what changes it (a schema)
  function stBase() { return PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute'); }
  function stDoc(a) {
    if (a <= 0.01) return '';
    let s = rect(222, 56, 232, 300, 'mf-tile', 4) + txt(236, 88, tr('instellingen', 'settings'), 20, 'start', 'mf-txt') + line(236, 100, 440, 100, 'mf-grid');
    s += txt(236, 132, `I>  ${C.S1} A ${dec(C.T1)} s`, 20, 'start', 'mf-mono') + txt(236, 162, `I>> ${grp(C.S2)} A`, 20, 'start', 'mf-mono');
    // the title block, as on a drawing
    s += rect(236, 262, 204, 80, 'mf-panel', 2) + line(236, 302, 440, 302, 'mf-grid');
    s += txt(246, 289, tr('eigenaar', 'owner'), 20, 'start', 'mf-mute') + txt(246, 329, tr('versie 3', 'version 3'), 20, 'start', 'mf-mono');
    return op(a, s);
  }
  function stIn(park, stamp, clockS) {
    let s = '';
    if (park > 0.01) {
      let p = rect(476, 56, 138, 40, 'mf-tile', 4) + txt(545, 83, tr('relais', 'relay'), 20, 'middle', 'mf-txt');
      p += line(490, 96, 490, 304, 'mf-line');
      p += rect(476, 170, 138, 40, 'mf-accf', 4) + txt(545, 197, tr('zonnepark', 'solar park'), 20, 'middle', 'mf-on');
      p += `<path class="mf-acc" d="${star(490, 316, 12, clockS * 4)}"/>`;
      p += txt(502, 250, tr('omvormers:', 'inverters:'), 20, 'start', 'mf-mute') + txt(502, 276, tr('foutstroom', 'fault current'), 20, 'start', 'mf-on');
      p += txt(502, 140, tr('ziet minder', 'sees less'), 20, 'start', 'mf-mute');
      s += op(park, p);
    }
    s += op(stamp, rect(236, 186, 204, 62, 'mf-accf', 4) + txt(338, 212, tr('ter plaatse aangepast', 'changed on site'), 20, 'middle', 'mf-on') + txt(338, 238, tr('nooit vastgelegd', 'never recorded'), 20, 'middle', 'mf-on'));
    return s;
  }

  // ------------------------------------------------------------ s8: selectivity, time grading, the margin and backup (after the figure eng.switchgear.selectivity)
  function slBase() { return PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute'); }
  // the chain from substation to street: breaker, MV fuse, LV fuse, the fault; only the LV fuse opens
  function slSel(a, opened, clockS) {
    if (a <= 0.01) return '';
    const y = 120;
    let s = line(236, y, 590, y, 'mf-line');
    s += rect(266, y - 16, 32, 32, 'mf-tile', 3) + txt(282, y + 46, tr('onderstation', 'substation'), 20, 'middle', 'mf-mute');
    s += rect(388, y - 10, 44, 20, 'mf-tile', 8) + txt(410, y - 26, tr('MS-zekering', 'MV fuse'), 20, 'middle', 'mf-mute');
    s += rect(506, y - 8, 34, 16, opened > 0.5 ? 'mf-accf' : 'mf-tile', 6) + txt(523, y + 46, tr('LS-zekering', 'LV fuse'), 20, 'middle', opened > 0.5 ? 'mf-on' : 'mf-mute');
    if (opened > 0.5) s += rect(540, y - 6, 54, 12, 'mf-panel', 0);
    s += `<path class="mf-acc" d="${star(600, y, opened > 0.5 ? 8 : 12, clockS * 4)}"/>`;
    s += op(opened, tick(282, y - 34) + tick(410, y + 30));
    return op(a, s);
  }
  // three graded relays (onderstation 0,9 s, schakelstation 0,5 s, klantstation 0,1 s) and their timers
  const RX = [284, 408, 532];
  function slTg(a, tsim, fail, link) {
    if (a <= 0.01) return '';
    const y = 262;
    const names = [tr('onderstation', 'substation'), tr('schakelstation', 'switching station'), tr('klantstation', 'customer station')];
    const tripAt = fail ? C.GRADE[1] : C.GRADE[2];
    const tripped = (i) => (fail ? i === 1 : i === 2) && tsim >= tripAt;
    let s = line(224, y, 590, y, 'mf-line') + `<path class="mf-acc" d="${star(600, y, 10, tsim * 20)}"/>`;
    RX.forEach((x, i) => {
      const lit = tripped(i);
      s += rect(x - 16, y - 16, 32, 32, lit ? 'mf-accf' : 'mf-tile', 3);
      if (fail && i === 2) s += cross(x, y + 8, 'mf-accl');
      s += txt(x, i === 1 ? y + 50 : y - 30, names[i], 20, 'middle', 'mf-mute');
      const run = Math.min(tsim, tripAt);
      const w = 100 * clamp(run / 1, 0, 1);
      const full = 100 * C.GRADE[i];
      s += rect(x - 50, y + 64, 100, 14, 'mf-panel', 3) + `<rect class="fp-meter"${lit ? ' data-top=""' : ''} x="${f1(x - 50)}" y="${y + 64}" width="${f1(Math.min(w, full))}" height="14" rx="3"/>` + line(x - 50 + full, y + 58, x - 50 + full, y + 84, 'mf-axis');
      s += txt(x, y + 108, `${dec(C.GRADE[i])} s`, 20, 'middle', lit ? 'mf-on' : 'mf-mono');
    });
    if (link > 0.01) s += op(link, `<path class="mf-gdash" d="M${RX[0]} ${y - 16}C${RX[0]} ${y - 60} ${RX[2]} ${y - 60} ${RX[2]} ${y - 16}"/>`);
    return op(a, s);
  }
  // the margin between two relays: opening time, run-on, tolerance
  function slStep(a) {
    if (a <= 0.01) return '';
    const y = 76;
    const parts = [[tr('openen', 'opening'), 150], [tr('naijlen', 'run-on'), 110], [tr('meetfout', 'tolerance'), 130]];
    let x = 226;
    let s = txt(222, y - 14, tr(`tijdtrap ${dec(0.3)}–${dec(0.4)} s`, `grading margin ${dec(0.3)}–${dec(0.4)} s`), 20, 'start', 'mf-on');
    parts.forEach(([l, w], i) => { s += rect(x, y, w - 4, 22, i === 0 ? 'mf-accf' : 'mf-tile', 3) + txt(x + (w - 4) / 2, y + 48, l, 20, 'middle', 'mf-mute'); x += w; });
    return op(a, s);
  }
  const slBack = (a) => op(a, txt(614, 196, tr('later, meer klanten uit', 'later, more customers off'), 20, 'end', 'mf-on'));

  // ------------------------------------------------------------ s9: the fuse curves (a schema, not a maker's curve)
  const FX0 = 270;
  const FX1 = 612;
  const FY0 = 316;
  const FY1 = 70;
  const fx = (a) => FX0 + (FX1 - FX0) * (Math.log10(a) - 2) / (Math.log10(30000) - 2);
  const fy = (t) => FY0 - (FY0 - FY1) * (Math.log10(t) + 2) / 5; // 0,01 to 1.000 s
  const IF = 4000; // the fault current of the schema
  const tLV = (r, I) => 2000 * Math.pow(r / I, 4);
  const tMV = (I) => 8 * Math.pow(1000 / I, 3);
  function curve(fn, a0, a1) {
    const pts = [];
    for (let i = 0; i <= 40; i++) { const a = a0 * Math.pow(a1 / a0, i / 40); const t = fn(a); if (t >= 0.01 && t <= 1000) pts.push([fx(a), fy(t)]); }
    return fmt(pts);
  }
  function fzBase() {
    let s = PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute') + line(FX0, FY1 - 6, FX0, FY0) + line(FX0, FY0, FX1, FY0);
    for (const a of [100, 1000, 10000]) s += line(fx(a), FY0, fx(a), FY0 + 8) + txt(fx(a), FY0 + 30, grp(a), 20, 'middle', 'mf-mute');
    s += txt(222, 44, tr('tijd', 'time'), 20, 'start', 'mf-mute') + txt(FX1, 378, tr('stroom, A', 'current, A'), 20, 'end', 'mf-mute');
    return s;
  }
  function fzIn(a, show400, fault, back, homes) {
    const [r1, r2] = C.FUSE;
    let s = '';
    s += op(a, `<path class="${back > 0.5 ? 'mf-accl' : 'mf-ghost'}" d="${curve((I) => tLV(r1, I), r1 * 1.4, 30000)}"/>` + txt(fx(r1 * 1.5) - 6, fy(300), `${tr('LS', 'LV')} ${r1} A`, 20, 'end', back > 0.5 ? 'mf-on' : 'mf-txt'));
    s += op(a, `<path class="mf-line" d="${curve(tMV, 900, 30000)}"/>` + txt(FX1, FY1 + 6, tr('MS-zekering', 'MV fuse'), 20, 'end', 'mf-txt'));
    s += op(a * (1 - fault), txt(FX0 + 10, FY0 - 16, tr(`erboven ≥ ${dec(1.6)} ×`, `upstream ≥ ${dec(1.6)} ×`), 20, 'start', 'mf-mute'));
    s += op(show400 * (1 - back), `<path class="mf-accl" d="${curve((I) => tLV(r2, I), r2 * 1.4, 30000)}"/>` + txt(fx(r2 * 1.5) + 8, fy(300), `${r2} A`, 20, 'start', 'mf-on'));
    if (fault > 0.01) {
      const tm = tMV(IF);
      s += op(fault * (1 - back), line(fx(IF), FY1, fx(IF), FY0, 'mf-gdash') + dot(fx(IF), fy(tm), 7, 'mf-acc') + dot(fx(IF), fy(tLV(r2, IF)), 5, 'mf-dot')
        + txt(fx(IF) - 10, fy(tm) + 30, tr('MS eerst', 'MV first'), 20, 'end', 'mf-on'));
      s += op(homes * (1 - back), rect(430, 92, 180, 66, 'mf-accf', 6) + txt(520, 120, `${C.HOMES[1]} ${tr('woningen', 'homes')}`, 22, 'middle', 'mf-on') + txt(520, 146, tr(`niet ${C.HOMES[0]}`, `not ${C.HOMES[0]}`), 20, 'middle', 'mf-txt'));
    }
    s += op(back, txt(FX1, 120, tr(`terug naar ${r1} A`, `back to ${r1} A`), 22, 'end', 'mf-on') + txt(FX1, 148, tr('waarom sloeg hij door?', 'why did it blow?'), 20, 'end', 'mf-txt'));
    return s;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['mt', 'rl', 'ex', 'tc', 'ef', 'st', 'sl', 'fz'];
  set(E.mtBase, mtBase());
  set(E.rlBase, rlBase());
  set(E.tcBase, tcBase());
  set(E.tcAx, tcAx());
  set(E.efBase, efBase());
  set(E.stBase, stBase());
  set(E.slBase, slBase());
  set(E.fzBase, fzBase());
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let fl = 0;
    let led = false;

    if (si === 0) {
      fl = b === 1 ? span(p, 0.1, 0.25) : b === 2 ? 1 - span(p, 0.5, 0.9) : 0;
      led = b === 2 && p > 0.3;
    } else if (si === 1) {
      vis.mt = span(u, 0.02, 0.1);
      set(E.mtCt, mtCt(1, on(b, 0, p, 0.2, 0.5), on(b, 2, p, 0.1, 0.4), clockS));
      set(E.mtVt, mtVt(on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.3, 0.6)));
    } else if (si === 2) {
      vis.rl = span(u, 0.02, 0.1);
      led = b >= 1 && (b > 1 || p > 0.3);
      set(E.rlRelay, rlRelay(1, on(b, 0, p, 0.3, 0.6)));
      set(E.rlCb, rlCb(1, b === 1 ? span(p, 0.75, 0.85) : b > 1 ? 1 : 0));
      set(E.rlIn, b === 1 ? rlTime(span(p, 0, 0.1), span(p, 0.1, 0.85)) : b === 2 ? rlLog(span(p, 0.05, 0.3)) : '');
    } else if (si === 3 || si === 4) {
      const ex = si === 4 && b < 2;
      vis.ex = ex ? 1 : 0;
      vis.tc = ex ? 0 : 1;
      if (ex) {
        set(E.exIn, exIn([on(b, 0, p, 0.1, 0.3), on(b, 0, p, 0.35, 0.55), on(b, 0, p, 0.6, 0.8), on(b, 1, p, 0.05, 0.3), on(b, 1, p, 0.3, 0.5), on(b, 1, p, 0.6, 0.85)]));
      } else if (si === 3) {
        set(E.tcCurve, tcCurve(on(b, 0, p, 0.1, 0.8)));
        set(E.tcIn, tcIn(on(b, 1, p, 0.4, 0.7), false, on(b, 2, p, 0.1, 0.5), 0, [0, 0]));
      } else {
        set(E.tcCurve, tcCurve(1));
        set(E.tcIn, tcIn(1, true, 1, 1, [on(b, 3, p, 0.15, 0.3), on(b, 3, p, 0.6, 0.75)]));
      }
    } else if (si === 5) {
      vis.ef = span(u, 0.02, 0.1);
      set(E.efSum, efSum(1, b === 0 ? span(p, 0.6, 0.8) : 0, b === 2 && p > 0.45 ? 1 : 0));
      set(E.efStar, efStar(on(b, 1, p, 0.05, 0.3), on(b, 2, p, 0.05, 0.35)));
    } else if (si === 6) {
      vis.st = span(u, 0.02, 0.1);
      set(E.stDoc, stDoc(1));
      set(E.stIn, stIn(b === 1 ? span(p, 0.3, 0.5) : 0, on(b, 2, p, 0.05, 0.25), clockS));
    } else if (si === 7) {
      vis.sl = span(u, 0.02, 0.08);
      const tsim = b === 1 ? 0.15 * span(p, 0.2, 0.8) : b === 3 ? 0.55 * span(p, 0.05, 0.5) : b === 2 ? 0.15 : 0;
      set(E.slSel, slSel(b === 0 ? 1 : 0.35, b === 0 ? (p > 0.5 ? 1 : 0) : 1, clockS));
      set(E.slTg, slTg(on(b, 1, p, 0.0, 0.15), tsim, b === 3, b === 3 ? span(p, 0.75, 0.9) : 0));
      set(E.slStep, slStep(b === 2 ? span(p, 0.1, 0.3) : 0));
      set(E.slBack, slBack(b === 3 ? span(p, 0.45, 0.6) : 0));
      if (b >= 2) fade(E.slSel, 0); else fade(E.slSel, 1);
    } else if (si === 8) {
      vis.fz = span(u, 0.02, 0.08);
      set(E.fzIn, fzIn(1, on(b, 1, p, 0.2, 0.5), on(b, 2, p, 0.05, 0.3), on(b, 3, p, 0.05, 0.3), on(b, 2, p, 0.4, 0.6)));
    }
    set(E.flash, flash(fl, clockS));
    if (E.led) E.led.toggleAttribute('data-hot', led);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
