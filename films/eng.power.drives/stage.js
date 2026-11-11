// The stage of the film "Een motor aanlopen / Starting a motor": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
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
  const grp = (v) => { const s = String(Math.round(v)); return s.length >= 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',') : s; };
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const PANEL = () => rect(204, 12, 428, 376);
  const MARKS = [E['mk-motor'], E['mk-panel']].filter(Boolean);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);
  const sm = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

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
    // the part markers: a radius of 18 stage units whatever the zoom
    for (const m of MARKS) m.setAttribute('r', f1(18 / s));
  }

  // ------------------------------------------------------------ the four starts (illustrative, "voorbeeld")
  // t: seconds after switch-on (0..6); n: speed as a share of synchronous; i: current and q: torque, both
  // times rated. DOL 7 × (6 to 8), star-delta a third, soft starter limited to 3,5 × (3 to 4), VFD about rated.
  const TS = 6;
  const K = {
    dol: { n: (t) => 0.98 * sm(t / 1.4), i: (t) => (t <= 0 ? 0 : 1 + (C.DOL - 1) * (1 - sm((t - 0.9) / 0.6))), q: (t) => (t <= 0 ? 0 : 1 + (1 + 0.6 * sm(t / 1.1)) * (1 - sm((t - 1.1) / 0.4))) },
    yd: {
      n: (t) => (t < 3 ? 0.85 * sm(t / 2.8) : 0.85 + 0.13 * sm((t - 3) / 0.6)),
      i: (t) => (t <= 0 ? 0 : t < 3 ? 1.1 + (C.DOL * C.YD - 1.1) * (1 - sm((t - 1.8) / 1)) : t < 3.08 ? 0.2 : 1 + 3.4 * Math.exp(-(t - 3.08) / 0.18)),
      q: (t) => (t <= 0 ? 0 : t < 3 ? 2 * C.YD + 0.25 * sm(t / 2.2) : t < 3.08 ? 0.1 : 1 + 0.8 * Math.exp(-(t - 3.08) / 0.2)),
    },
    soft: { n: (t) => 0.98 * sm(t / 4.2), i: (t) => (t <= 0 ? 0 : t < 3.8 ? Math.min(C.SOFT, 2.4 + 2 * t) : 1 + (C.SOFT - 1) * (1 - sm((t - 3.8) / 0.7))), q: (t) => (t <= 0 ? 0 : t < 3.8 ? 0.5 + sm((t - 0.5) / 3.3) : 1 + 0.5 * (1 - sm((t - 3.8) / 0.6))) },
    vfd: { n: (t) => 0.98 * Math.min(1, t / 5), i: (t) => (t <= 0 ? 0 : 1.05 * sm(t / 0.3) - (t > 5 ? 0.1 * sm((t - 5) / 0.4) : 0)), q: (t) => (t <= 0 ? 0 : sm(t / 0.3)) },
  };
  const volt = (t) => (t < 3.8 ? 0.5 + 0.13 * t : Math.min(1, 0.994 + (t - 3.8) * 0.05));
  // the chart time τ of a scene: 0..6 s over its beats [bA, bB]
  const WIN = { 0: [2, 2, 0.05, 0.85], 2: [1, 2, 0.15, 0.85], 3: [0, 1, 0.3, 0.85], 4: [2, 3, 0.05, 0.4] };
  const KIND = ['dol', 'dol', 'yd', 'soft', 'vfd', 'dol', 'vfd', 'vfd', 'vfd'];
  function tauOf(si, u) {
    const w = WIN[si];
    if (!w) return TS;
    const fr = fracs(si);
    const end = (b) => (b + 1 < fr.length ? fr[b + 1] : 1);
    const ua = fr[w[0]] + w[2] * (end(w[0]) - fr[w[0]]);
    const ub = fr[w[1]] + w[3] * (end(w[1]) - fr[w[1]]);
    return TS * clamp((u - ua) / (ub - ua), 0, 1);
  }
  const speedOf = (si, u) => (WIN[si] ? K[KIND[si]].n(tauOf(si, u)) : 0.98);

  // ------------------------------------------------------------ the world's live parts
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
  // the starter's screen (flat coordinates of the face plane: x, −z): the motor current of `kind` up to τ
  const sx = (t) => C.PLOT.x0 + (C.PLOT.x1 - C.PLOT.x0) * (t / TS);
  const sz = (v) => -(C.PLOT.z0 + (C.PLOT.z1 - C.PLOT.z0) * (v / 8.4));
  function screen(kind, tau) {
    if (tau <= 0) return '';
    const pts = [];
    for (let t = 0; t <= tau + 1e-9; t += 0.04) pts.push([sx(t), sz(K[kind].i(t))]);
    return `<path class="mf-scr" d="${pts.map(([x, y], i) => (i ? 'L' : 'M') + f2(x) + ' ' + f2(y)).join('')}"/>`;
  }
  const MOTOR = [...svg.querySelectorAll('[data-n^="motor."]')];
  let jolted = 0;
  function jolt(dx) {
    if (Math.abs(dx - jolted) < 0.01) return;
    jolted = dx;
    const t = Math.abs(dx) < 0.01 ? '' : `translate(${dx.toFixed(2)} 0)`;
    for (const m of MOTOR) { if (t) m.setAttribute('transform', t); else m.removeAttribute('transform'); }
  }

  // ------------------------------------------------------------ s1: the contactor (a schema)
  const LX = [384, 444, 504];
  function ctcBase() {
    return PANEL() + txt(620, 40, tr('schema', 'diagram'), 20, 'end', 'mf-mute')
      + LX.map((x, k) => txt(x, 56, `L${k + 1}`, 20, 'middle', 'mf-mute')).join('');
  }
  function ctcIn(close, flow) {
    let out = '';
    // the coil, its two wires and the mechanical link to the three blades
    out += rect(226, 140, 70, 54, close > 0.5 ? 'mf-accf' : 'mf-tile', 4) + txt(261, 174, 'A1 A2', 20, 'middle', 'mf-mono') + txt(261, 222, tr('spoel', 'coil'), 20, 'middle', 'mf-mute');
    const ang = lerp(0.42, 0, close);
    LX.forEach((x) => {
      out += line(x, 66, x, 128, flow > 0.5 ? 'mf-line' : 'mf-axis') + dot(x, 128, 4) + dot(x, 192, 4);
      out += line(x, 128, x + 64 * Math.sin(ang), 128 + 64 * Math.cos(ang), 'mf-line');
      out += line(x, 192, x, 282, flow > 0.5 ? 'mf-line' : 'mf-axis');
    });
    const ly = 128 + 34 * Math.cos(ang);
    out += `<path class="mf-l2" d="M296 167L${f1(LX[2] + 34 * Math.sin(ang))} ${f1(ly)}"/>`;
    // the motor
    out += `<circle class="mf-tile" cx="444" cy="324" r="42"/>` + txt(444, 320, 'M', 24, 'middle', 'mf-big') + txt(444, 346, '3~', 20, 'middle', 'mf-mono');
    out += line(384, 282, 420, 292, flow > 0.5 ? 'mf-line' : 'mf-axis') + line(504, 282, 468, 292, flow > 0.5 ? 'mf-line' : 'mf-axis') + line(444, 282, 444, 282, 'mf-axis');
    out += op(close, txt(226, 290, tr('dicht:', 'closed:'), 20, 'start', 'mf-mute') + txt(226, 316, tr('drie fasen', 'three phases'), 20, 'start', 'mf-txt') + txt(226, 342, tr('tegelijk', 'at once'), 20, 'start', 'mf-txt'));
    return out;
  }

  // ------------------------------------------------------------ s1, s3–s5: current and torque traces
  const X0 = 262;
  const X1 = 612;
  const IY = 200;
  const IS = 17;
  const QY = 340;
  const QS = 30;
  const xt = (t) => X0 + (X1 - X0) * (t / TS);
  function trBase() {
    let out = PANEL() + txt(222, 40, tr('stroom × nominaal', 'current × rated'), 20, 'start', 'mf-mute') + txt(620, 40, EX, 20, 'end', 'mf-mute');
    out += line(X0, IY, X1, IY) + line(X0, IY, X0, IY - 8.4 * IS) + line(X0, IY - IS, X1, IY - IS, 'mf-grid');
    out += [1, 4, 8].map((v) => txt(X0 - 8, IY - v * IS + 7, v, 20, 'end', 'mf-mute')).join('');
    out += txt(222, 236, tr('koppel', 'torque'), 20, 'start', 'mf-mute');
    out += line(X0, QY, X1, QY) + line(X0, QY, X0, QY - 2.8 * QS) + line(X0, QY - QS, X1, QY - QS, 'mf-grid');
    out += [1, 2].map((v) => txt(X0 - 8, QY - v * QS + 7, v, 20, 'end', 'mf-mute')).join('');
    out += [0, 2, 4, 6].map((t) => txt(xt(t), QY + 24, t, 20, 'middle', 'mf-mute')).join('') + txt(X1, QY + 46, tr('seconden', 'seconds'), 20, 'end', 'mf-mute');
    return out;
  }
  function trace(kind, tau, cls) {
    if (tau <= 0) return '';
    const pi = [];
    const pq = [];
    for (let t = 0; t <= tau + 1e-9; t += 0.03) { pi.push([xt(t), IY - K[kind].i(t) * IS]); pq.push([xt(t), QY - K[kind].q(t) * QS]); }
    pi.unshift([X0, IY]);
    pq.unshift([X0, QY]);
    return `<path class="${cls}" d="${fmt(pi)}"/><path class="${cls}" d="${fmt(pq)}"/>`;
  }
  const NAME = { dol: tr('direct', 'DOL'), yd: tr('ster-driehoek', 'star-delta'), soft: tr('softstarter', 'soft starter'), vfd: tr('regelaar', 'VFD') };
  const NAMEAT = { dol: [296, 78], yd: [300, 150], soft: [330, 124], vfd: [470, 172] };
  // ghost: the earlier starts, faint; live: this scene's start, drawn up to τ, with its name
  function trKind(kind, tau, live) {
    if (!live) return trace(kind, TS, 'mf-ghost');
    return trace(kind, tau, 'mf-line') + op(span(tau, 0.3, 1.2), txt(NAMEAT[kind][0], NAMEAT[kind][1], NAME[kind], 20, 'start', 'mf-txt'));
  }
  // the star and delta symbols; the live one in petrol
  function starDelta(delta) {
    const yc = [552, 92];
    let out = '';
    const ys = [0, 2.094, 4.189].map((a) => line(yc[0], yc[1], yc[0] + 18 * Math.sin(a), yc[1] - 18 * Math.cos(a), delta ? 'mf-axis' : 'mf-accl')).join('');
    out += ys + txt(552, 132, tr('ster', 'star'), 20, 'middle', delta ? 'mf-mute' : 'mf-on');
    out += `<path class="${delta ? 'mf-accl' : 'mf-axis'}" d="M600 72L618 104L582 104Z"/>` + txt(600, 132, 'Δ', 20, 'middle', delta ? 'mf-on' : 'mf-mute');
    return out;
  }
  function trTxt(si, b, p, tau) {
    let out = '';
    if (si === 2 && tau > 0) out += starDelta(tau >= 3);
    if (si === 3) {
      out += op(span(tau, 0, 0.3), txt(612, 92, `U ${Math.round(volt(tau) * 100)}%`, 22, 'end', 'mf-on'));
      const a = b === 3 ? span(p, 0.1, 0.4) : 0;
      out += op(a, `<path class="mf-dash" d="M${X0} ${QY - 1.2 * QS}L${X1} ${QY - 1.2 * QS}"/>` + txt(360, QY - 1.2 * QS - 8, tr('last volle breker', 'full crusher load'), 20, 'start', 'mf-on')
        + txt(612, 236, tr('onder de last: blijft hangen', 'below the load: it stalls'), 20, 'end', 'mf-on'));
    }
    if (si === 4) out += op(span(tau, 0, 0.3), txt(612, 92, `f ${Math.round(50 * Math.min(1, tau / 5))} Hz`, 22, 'end', 'mf-on'));
    if (si === 0 && b === 3) out += op(span(p, 0.1, 0.4), txt(612, 236, tr('ruk: vol koppel ineens', 'jolt: full torque at once'), 20, 'end', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ s2: a section through the motor (as eng.power.motor)
  const SC = [318, 204];
  const RO = 114;
  const RB = 80;
  const RR = 72;
  function sectBase() {
    return PANEL() + txt(222, 352, tr('schema, 2-polig', 'diagram, 2-pole'), 20, 'start', 'mf-mute') + txt(222, 380, tr('vertraagd, slip overdreven', 'slowed, slip exaggerated'), 20, 'start', 'mf-mute');
  }
  function statorSvg(wt) {
    let out = `<path class="mf-iron" fill-rule="evenodd" d="M${SC[0] + RO} ${SC[1]}A${RO} ${RO} 0 1 0 ${SC[0] - RO} ${SC[1]}A${RO} ${RO} 0 1 0 ${SC[0] + RO} ${SC[1]}ZM${SC[0] + RB} ${SC[1]}A${RB} ${RB} 0 1 0 ${SC[0] - RB} ${SC[1]}A${RB} ${RB} 0 1 0 ${SC[0] + RB} ${SC[1]}Z"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * 2 * Math.PI;
      const c = Math.cos(wt - a);
      const pts = [[RB + 3, -0.11], [RB + 26, -0.13], [RB + 26, 0.13], [RB + 3, 0.11]].map(([r, d]) => [SC[0] + r * Math.cos(a + d), SC[1] + r * Math.sin(a + d)]);
      out += `<path class="mf-panel" d="${fmt(pts)}Z"/><path class="${c >= 0 ? 'mf-cu' : 'mf-cuN'}" style="opacity:${(0.15 + 0.85 * Math.abs(c)).toFixed(2)}" d="${fmt(pts)}Z"/>`;
    }
    return out;
  }
  function rotorSvg(th, bars) {
    let out = `<circle class="mf-tile" cx="${SC[0]}" cy="${SC[1]}" r="${RR}"/>`;
    for (let i = 0; i < 16; i++) { const a = th + (i / 16) * 2 * Math.PI; out += dot(SC[0] + (RR - 10) * Math.cos(a), SC[1] + (RR - 10) * Math.sin(a), 4.5, bars > 0.5 ? 'mf-acc' : 'mf-hollow'); }
    out += `<circle class="mf-iron" cx="${SC[0]}" cy="${SC[1]}" r="17"/>`;
    out += line(SC[0] + 17 * Math.cos(th), SC[1] + 17 * Math.sin(th), SC[0] + (RR - 22) * Math.cos(th), SC[1] + (RR - 22) * Math.sin(th), 'mf-line');
    return out;
  }
  function fieldSvg(ang) {
    const L = RB - 6;
    const hx = SC[0] + L * Math.cos(ang);
    const hy = SC[1] + L * Math.sin(ang);
    const head = [[hx, hy], [hx - 24 * Math.cos(ang - 0.42), hy - 24 * Math.sin(ang - 0.42)], [hx - 24 * Math.cos(ang + 0.42), hy - 24 * Math.sin(ang + 0.42)]];
    return `<path class="mf-accl" style="stroke-width:4" d="M${f1(SC[0] - L * Math.cos(ang))} ${f1(SC[1] - L * Math.sin(ang))}L${f1(hx - 14 * Math.cos(ang))} ${f1(hy - 14 * Math.sin(ang))}"/><path class="mf-acc" d="${fmt(head)}Z"/>`;
  }
  // the side: the rotor's speed, the slip and the current as a bar
  function slipSvg(k, a) {
    const slip = Math.round(100 - 98 * k);
    const cur = 1 + (C.DOL - 1) * (1 - k);
    let out = op(a, txt(456, 70, tr('veld: vol', 'field: full'), 20, 'start', 'mf-txt') + txt(456, 98, k < 0.02 ? tr('rotor: stil', 'rotor: still') : tr(`rotor: ${100 - slip}%`, `rotor: ${100 - slip}%`), 20, 'start', 'mf-txt'));
    out += op(a, txt(456, 146, `slip ${slip}%`, 24, 'start', 'mf-big'));
    const h = cur * 26;
    out += op(a, `<rect class="fp-meter" data-top="" x="596" y="${f1(320 - h)}" width="22" height="${f1(h)}" rx="3"/>` + line(588, 294, 626, 294, 'mf-dash')
      + txt(456, 300, tr('stroom', 'current'), 20, 'start', 'mf-mute') + txt(456, 326, `≈ ${cur.toFixed(0)} ×`, 22, 'start', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ s6: the crusher
  const CW = 380 / 1300;
  const ROWS = [70, 130, 190, 250];
  function crBase() { return PANEL() + txt(620, 40, EX, 20, 'end', 'mf-mute'); }
  function crRow(i, a, v0, v1, top) {
    const y = ROWS[i] + 10;
    return op(a, `<rect class="fp-meter"${top ? ' data-top=""' : ''} x="222" y="${y}" width="${f1(v0 * CW * Math.min(1, a * 1.2))}" height="16" rx="3"/>` + (v1 ? `<rect class="mf-accf" x="${f1(222 + v0 * CW)}" y="${y}" width="${f1((v1 - v0) * CW * a)}" height="16" rx="2"/>` : ''));
  }
  function crIn(a) {
    return crRow(0, a[0], C.I_CR) + crRow(1, a[1], C.I_ST[0], C.I_ST[1]) + crRow(2, a[2], C.I_CR * 3, C.I_CR * 4) + crRow(3, a[3], C.I_CR, 0, true);
  }
  function crTxt(a, dip, verdict) {
    const rows = [
      [`${C.P_CR} kW, ${tr('nominaal', 'rated')}`, `${C.I_CR} A`],
      [tr('direct', 'DOL'), `${grp(C.I_ST[0])}–${grp(C.I_ST[1])} A`],
      [tr('softstarter', 'soft starter'), tr('3 à 4 ×', '3 to 4 ×')],
      [tr('regelaar', 'VFD'), `≈ ${C.I_CR} A`],
    ];
    let out = rows.map(([l, v], i) => op(a[i], txt(222, ROWS[i], l, 20, 'start', 'mf-txt') + txt(612, ROWS[i], v, 21, 'end', 'mf-big'))).join('');
    if (dip > 0.01) {
      // the plant voltage, dipping at each start
      const pts = [];
      for (let x = 324; x <= 612; x += 4) { const t = (x - 324) / 288; pts.push([x, 330 + 22 * Math.exp(-(((t - 0.18) / 0.05) ** 2)) * (t > 0.18 ? Math.exp(-(t - 0.18) * 6) : 1) + 22 * Math.exp(-(((t - 0.68) / 0.05) ** 2))]); }
      out += op(dip, txt(222, 336, tr('spanning', 'voltage'), 20, 'start', 'mf-mute') + `<path class="mf-accl" d="${fmt(pts)}"/>` + txt(612, 384, tr('elke start een dip', 'a dip at every start'), 20, 'end', 'mf-on'));
    }
    out += op(verdict, txt(222, 324, tr('vol materiaal: softstarter kan hangen,', 'full of material: soft starter may stall,'), 20, 'start', 'mf-txt') + txt(222, 352, tr('de regelaar past', 'the VFD fits'), 20, 'start', 'mf-on'));
    return out;
  }

  // ------------------------------------------------------------ s7: the affinity laws
  const AX0 = 262;
  const AX1 = 602;
  const AY = 320;
  const AH = 250;
  function afBase() {
    let out = PANEL() + txt(222, 40, tr('% van vol', '% of full'), 20, 'start', 'mf-mute') + txt(620, 40, tr('schema', 'diagram'), 20, 'end', 'mf-mute');
    out += line(AX0, AY, AX1, AY) + line(AX0, AY, AX0, AY - AH - 6) + line(AX0, AY - AH, AX1, AY - AH, 'mf-grid');
    out += txt(AX0 - 8, AY + 7, '0', 20, 'end', 'mf-mute') + txt(AX0 - 8, AY - AH + 7, '100', 20, 'end', 'mf-mute') + txt(AX0 + 4, AY + 26, tr('toerental', 'speed'), 20, 'start', 'mf-mute') + txt(AX1, AY + 26, '100%', 20, 'end', 'mf-mute');
    return out;
  }
  const ACLS = ['mf-line', 'mf-l2', 'mf-l3'];
  function afIn(draw, mark) {
    let out = '';
    [1, 2, 3].forEach((pw, k) => {
      if (draw[k] <= 0.01) return;
      const pts = [];
      for (let x = 0; x <= draw[k] + 1e-9; x += 0.02) pts.push([lerp(AX0, AX1, x), AY - AH * x ** pw]);
      out += `<path class="${ACLS[k]}" d="${fmt(pts)}"/>`;
      const lx = [222, 330, 470][k];
      out += op(draw[k], `<path class="${ACLS[k]}" d="M${lx} 372L${lx + 30} 372"/>` + txt(lx + 36, 379, [tr('debiet', 'flow'), tr('druk', 'pressure'), tr('vermogen', 'power')][k], 20, 'start', 'mf-txt'));
    });
    if (mark > 0.01) {
      const x = lerp(AX0, AX1, 0.8);
      out += op(mark, line(x, AY, x, AY - AH * 0.8, 'mf-dash') + txt(x - 8, AY - 10, '80%', 20, 'end', 'mf-on') + dot(x, AY - AH * C.P80, 6, 'mf-acc') + txt(x - 12, AY - AH * C.P80 + 7, tr('≈ half', '≈ half'), 21, 'end', 'mf-on'));
    }
    return out;
  }
  function afTxt(a) {
    return op(a, rect(276, 70, 230, 64, 'mf-tile', 6) + txt(288, 96, tr('50 Hz, het hele jaar:', '50 Hz, all year:'), 20, 'start', 'mf-txt') + txt(288, 122, tr('alleen verlies', 'only losses'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s8: side effects
  function hmBase() { return PANEL() + txt(222, 40, tr('net: spanning en stroom', 'supply: voltage and current'), 20, 'start', 'mf-mute') + txt(620, 40, tr('schema', 'diagram'), 20, 'end', 'mf-mute'); }
  function hmWave(draw, clockS) {
    const x0 = 236;
    const x1 = 612;
    const y = 112;
    const sine = [];
    const puls = [];
    const sh = clockS * 0.8;
    for (let x = x0; x <= lerp(x0, x1, draw) + 1e-9; x += 3) {
      const th = ((x - x0) / (x1 - x0)) * 4 * Math.PI + sh;
      const s = Math.sin(th);
      sine.push([x, y - 46 * s]);
      puls.push([x, y - 50 * Math.sign(s) * Math.max(0, (Math.abs(s) - 0.72) / 0.28) ** 1.5]);
    }
    return line(x0, y, x1, y, 'mf-grid')
      + `<path class="mf-ghost" d="${fmt(sine)}"/><path class="mf-line" d="${fmt(puls)}"/>`
      + op(draw, txt(612, 186, tr('stroom in pulsen', 'current in pulses'), 20, 'end', 'mf-txt'));
  }
  const BC = [300, 282];
  function hmBrg(a, spark, pits, clockS) {
    if (a <= 0.01) return '';
    let out = `<circle class="mf-iron" cx="${BC[0]}" cy="${BC[1]}" r="66"/><circle class="mf-panel" cx="${BC[0]}" cy="${BC[1]}" r="54"/>`;
    out += `<circle class="mf-iron" cx="${BC[0]}" cy="${BC[1]}" r="34"/><circle class="mf-tile" cx="${BC[0]}" cy="${BC[1]}" r="22"/>`;
    const th = clockS * 0.6;
    for (let i = 0; i < 8; i++) { const t = th + (i / 8) * 2 * Math.PI; out += dot(BC[0] + 44 * Math.cos(t), BC[1] + 44 * Math.sin(t), 9, 'mf-hollow'); }
    // pits along the outer raceway
    const n = Math.round(pits * 22);
    for (let i = 0; i < n; i++) { const t = (i / 22) * 2 * Math.PI + 0.3; out += dot(BC[0] + 55 * Math.cos(t), BC[1] + 55 * Math.sin(t), 2, 'mf-acc'); }
    // a spark where a ball touches the outer ring, flickering
    if (spark > 0.01 && Math.sin(clockS * 9) > -0.2) {
      const t = th + Math.PI / 8 * 3;
      const sx0 = BC[0] + 53 * Math.cos(t);
      const sy0 = BC[1] + 53 * Math.sin(t);
      out += op(spark, [0, 1.2, 2.4, 3.6, 4.8].map((r) => line(sx0, sy0, sx0 + 13 * Math.cos(t + r), sy0 + 13 * Math.sin(t + r), 'mf-accl')).join(''));
    }
    return op(a, out + txt(BC[0], 378, tr('motorlager', 'motor bearing'), 20, 'middle', 'mf-txt'));
  }
  function hmFix(a) {
    const items = [tr('afgeschermde kabel', 'shielded cable'), tr('filters', 'filters'), tr('goede aarding', 'good earthing')];
    return items.map((t, i) => op(span(a, i * 0.25, i * 0.25 + 0.4), `<path class="mf-accl" d="M394 ${232 + i * 44}l7 8l14 -16"/>` + txt(424, 240 + i * 44, t, 20, 'start', 'mf-txt'))).join('');
  }

  // ------------------------------------------------------------ s9: the servo and the choice
  function svBase() { return PANEL() + txt(620, 40, tr('schema', 'diagram'), 20, 'end', 'mf-mute'); }
  function svIn(a, clockS, pos) {
    if (a <= 0.01) return '';
    const ec = [282, 112];
    const th = pos * 9;
    let out = `<circle class="mf-tile" cx="${ec[0]}" cy="${ec[1]}" r="46"/>`;
    for (let i = 0; i < 24; i++) { const t = th + (i / 24) * 2 * Math.PI; out += line(ec[0] + 32 * Math.cos(t), ec[1] + 32 * Math.sin(t), ec[0] + 42 * Math.cos(t), ec[1] + 42 * Math.sin(t), 'mf-line'); }
    out += `<circle class="mf-iron" cx="${ec[0]}" cy="${ec[1]}" r="12"/>` + rect(ec[0] + 34, ec[1] - 52, 22, 24, 'mf-accf', 3);
    out += txt(ec[0], 186, 'encoder', 20, 'middle', 'mf-txt');
    // a carriage on a ruler, positioned to the target
    out += line(370, 132, 612, 132) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => line(376 + i * 29, 132, 376 + i * 29, i % 4 ? 140 : 146, 'mf-axis')).join('');
    const xt2 = 376 + 6 * 29;
    out += line(xt2, 94, xt2, 150, 'mf-dash') + txt(xt2, 84, tr('doel', 'target'), 20, 'middle', 'mf-on');
    const cx = lerp(376 + 29, xt2, pos);
    out += rect(cx - 22, 100, 44, 30, 'mf-tile', 4) + dot(cx, 115, 3);
    out += op(span(pos, 0.95, 1), txt(612, 186, tr('± 0,1 mm', '± 0.1 mm'), 20, 'end', 'mf-on'));
    return op(a, out);
  }
  function svTab(a, lit) {
    const rows = [[tr('alleen starten', 'just starting'), tr('direct of softstarter', 'DOL or soft starter')], [tr('ander toerental', 'variable speed'), tr('frequentieregelaar', 'VFD')], [tr('positie', 'position'), 'servo']];
    return rows.map(([l, r], i) => {
      const y = 214 + i * 56;
      return op(span(a, i * 0.2, i * 0.2 + 0.4), rect(222, y, 390, 46, lit.includes(i) ? 'mf-accf' : 'mf-tile', 5) + txt(234, y + 30, l, 20, 'start', 'mf-txt') + txt(600, y + 30, r, 20, 'end', lit.includes(i) ? 'mf-on' : 'mf-txt'));
    }).join('');
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['ctc', 'tr', 'sect', 'cr', 'af', 'hm', 'sv'];
  set(E.ctBase, ctcBase());
  set(E.trBase, trBase());
  set(E.scBase, sectBase());
  set(E.crBase, crBase());
  set(E.afBase, afBase());
  set(E.hmBase, hmBase());
  set(E.svBase, svBase());
  const SLOW = 2 * Math.PI * 0.22; // the drawn field turns 0,22 times a second
  const FAN = 2.2; // the drawn fan at full speed, rad per second
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const dur = C.dur[si];
    const clockS = u * dur;
    const vis = {};
    const tau = tauOf(si, u);
    const kind = KIND[si];
    let lamp = true;
    let dx = 0;

    if (si === 0) {
      vis.ctc = b === 1 ? span(p, 0, 0.1) : b === 2 ? 1 - span(p, 0, 0.08) : 0;
      vis.tr = b >= 2 ? span(p, 0, 0.08) : 0;
      set(E.ctIn, ctcIn(b === 1 ? span(p, 0.35, 0.6) : b > 1 ? 1 : 0, b === 1 ? span(p, 0.6, 0.7) : b > 1 ? 1 : 0));
      set(E.trDol, b >= 2 ? trKind('dol', tau, true) : '');
      set(E.trYd, '');
      set(E.trSoft, '');
      set(E.trVfd, '');
      lamp = b >= 2;
      // the jolt: the motor twitches as the full torque hits
      dx = tau > 0 && tau < 0.8 ? 1.4 * Math.sin(tau * 40) * Math.exp(-tau * 5) : 0;
    } else if (si === 1) {
      vis.sect = span(u, 0, 0.04);
      const fr = fracs(1);
      // the rotor runs up during the third beat: k from 0 to 1, its angle the integral of its speed
      const t0 = fr[2] * dur;
      const t1 = t0 + 0.85 * (fr[3] - fr[2]) * dur;
      const k = clamp((clockS - t0) / (t1 - t0), 0, 1);
      const sMax = 1 - 0.18;
      const ang = clockS < t0 ? 0 : clockS < t1 ? sMax * (clockS - t0) ** 2 / (2 * (t1 - t0)) : sMax * ((t1 - t0) / 2 + (clockS - t1));
      set(E.scStator, statorSvg(clockS * SLOW));
      set(E.scRotor, rotorSvg(ang * SLOW - Math.PI / 2, b === 1 ? 1 : 0));
      set(E.scField, fieldSvg(clockS * SLOW - Math.PI / 2));
      set(E.scSlip, slipSvg(sm(k), on(b, 0, p, 0.3, 0.6)));
      set(E.scSide, '');
    } else if (si >= 2 && si <= 4) {
      vis.tr = span(u, 0, 0.04);
      set(E.trDol, trKind('dol', TS, false));
      set(E.trYd, si === 2 ? trKind('yd', tau, true) : trKind('yd', TS, false));
      set(E.trSoft, si === 3 ? trKind('soft', tau, true) : si > 3 ? trKind('soft', TS, false) : '');
      set(E.trVfd, si === 4 ? trKind('vfd', tau, true) : '');
      lamp = tau > 0;
    } else if (si === 5) {
      vis.cr = span(u, 0, 0.04);
      const a = [b === 0 ? span(p, 0.2, 0.6) : 1, on(b, 1, p, 0.1, 0.6), on(b, 3, p, 0.1, 0.4), on(b, 3, p, 0.4, 0.7)];
      set(E.crIn, crIn(a));
      set(E.crTxt, crTxt(a, b === 2 ? span(p, 0.05, 0.25) : 0, b === 3 ? span(p, 0.6, 0.85) : 0));
      // the lamp flickers with the dip
      lamp = !(b === 2 && p > 0.2 && p < 0.6 && Math.sin(clockS * 31) > 0.3);
    } else if (si === 6) {
      vis.af = span(u, 0, 0.04);
      set(E.afIn, afIn([on(b, 1, p, 0.05, 0.3), on(b, 1, p, 0.3, 0.55), on(b, 1, p, 0.55, 0.8)], on(b, 2, p, 0.1, 0.4)));
      set(E.afTxt, afTxt(b === 3 ? span(p, 0.1, 0.4) : 0));
    } else if (si === 7) {
      vis.hm = span(u, 0, 0.04);
      set(E.hmWave, hmWave(b === 0 ? span(p, 0.1, 0.7) : 1, clockS));
      set(E.hmBrg, hmBrg(on(b, 1, p, 0.0, 0.3), b === 1 ? span(p, 0.5, 0.7) : b === 2 ? 1 : 0, on(b, 2, p, 0.1, 0.9), clockS));
      set(E.hmFix, hmFix(b === 3 ? span(p, 0.05, 0.8) : 0));
    } else if (si === 8) {
      vis.sv = span(u, 0, 0.04);
      set(E.svIn, svIn(1, clockS, b === 0 ? span(p, 0.3, 0.9) : 1));
      set(E.svTab, svTab(on(b, 2, p, 0.0, 0.5), b === 2 ? (p < 0.55 ? [0] : [1]) : b === 3 ? [2] : []));
    }
    if (vis.tr) set(E.trTxt, trTxt(si, b, p, tau));

    // world parts: the fan turns at the motor's speed (its angle the sum of the speeds so far)
    let ph = 0;
    for (let t = 0; t < clockS; t += 0.05) ph += speedOf(si, t / dur) * Math.min(0.05, clockS - t);
    if (si === 0 && b < 2) ph = 0;
    E.fan.setAttribute('d', fanPath(ph * FAN));
    jolt(dx);
    flag(E.lamp, 'data-lit', lamp);
    set(E.scr, screen(kind, si === 0 && b < 2 ? 0 : tau));
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
