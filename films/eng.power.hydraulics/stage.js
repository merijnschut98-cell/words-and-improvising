// The stage of the film "Hydrauliek / Hydraulics": a pure function of
// (scene, u). Inlined into the page after the anatomy kit (iso-kit functions in
// scope) and a preamble from build.mjs that defines P (projection), C (world
// constants), CAM (one camera move per scene), W and H. Moves are placed per
// caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const at = (p) => iso(p, P);
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const LED = {};
  svg.querySelectorAll('[data-led]').forEach((el) => { LED[el.getAttribute('data-led')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'hy-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'hy-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (pts, cls) => `<path class="${cls}" d="${fmt(pts)}"/>`;
  // an arrow along pts, its head at the last point
  const arrow = (pts, cls = 'hy-accl', head = 8) => {
    const [x1, y1] = pts[pts.length - 1];
    const [x0, y0] = pts[pts.length - 2];
    const a = Math.atan2(y1 - y0, x1 - x0);
    const h = (s) => [x1 - head * Math.cos(a + s), y1 - head * Math.sin(a + s)];
    return path(pts, cls) + path([h(0.5), [x1, y1], h(-0.5)], cls);
  };
  const EX = tr('voorbeeld', 'example');
  const num = (nl, en) => tr(nl, en);

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

  let view = { cx: 0, cy: 0, s: 1 };
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    view = { cx, cy, s };
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }
  const toStage = (p) => { const [x, y] = at(p); return [(x - view.cx) * view.s + W / 2, (y - view.cy) * view.s + H / 2]; };

  // ------------------------------------------------------------ drawn parts
  // the accumulator gauge's needle: v from 0 (zero) to 1 (full scale)
  function needleSvg(v) {
    const a = ((-135 + 270 * v) * Math.PI) / 180;
    const y = C.GAUGE[1] + 1.7;
    const c = at([C.GAUGE[0], y, C.GAUGE[2]]);
    const tip = at([C.GAUGE[0] + 4.4 * Math.sin(a), y, C.GAUGE[2] + 4.4 * Math.cos(a)]);
    const tail = at([C.GAUGE[0] - 1.2 * Math.sin(a), y, C.GAUGE[2] - 1.2 * Math.cos(a)]);
    return `<path class="hy-needle" d="${fmt([tail, tip])}"/><circle class="hy-acc" cx="${f2(c[0])}" cy="${f2(c[1])}" r="1.2"/>`;
  }
  // the thermometer's column on the tank front: T in °C, 20 to 80 over its scale
  function mercurySvg(T) {
    const t = C.THERM;
    const z = lerp(t.z0 + 1, t.z1 - 1, clamp((T - 20) / 60, 0, 1));
    const x0 = t.x0 + 1;
    const x1 = t.x1 - 1;
    return `<path class="hy-merc" d="${fmt([[x0, t.y, t.z0 + 0.6], [x1, t.y, t.z0 + 0.6], [x1, t.y, z], [x0, t.y, z]].map(at))}Z"/>`;
  }
  // the pinhole jet from the fitting; with the cardboard in place it ends on it
  function jetSvg(len, board, clockS) {
    const f = C.FIT_AT;
    const a = [f[0], f[1] - 2, f[2]];
    const end = board ? [f[0] + 0.4, C.CARD.y, f[2] - 0.6] : [f[0] + 3, f[1] - 2 - 40 * len, f[2] - 4 * len];
    const pts = [a, end].map(at);
    const drops = [0.3, 0.55, 0.8].map((q) => { const k = (q + clockS * 0.9) % 1; return [lerp(a[0], end[0], k), lerp(a[1], end[1], k), lerp(a[2], end[2], k) - 0.6 * k]; });
    return `<path class="hy-jet" d="${fmt(pts)}"/>` + drops.map((d) => { const [x, y] = at(d); return `<circle class="hy-acc" cx="${f2(x)}" cy="${f2(y)}" r=".45"/>`; }).join('');
  }

  // ------------------------------------------------------------ HUD panels
  // a section through the main cylinder: oil above the piston, the pressure on every face, the force on the rod
  function forceSvg(step, py) {
    let out = rect(12, 12, 290, 376);
    out += txt(24, 42, tr('kracht = druk × oppervlak', 'force = pressure × area'), 20, 'start', 'hy-mute');
    const x0 = 92;
    const x1 = 222;
    out += rect(x0, 58, x1 - x0, 12, 'hy-wall', 2) + rect(x0, 58, 12, 192, 'hy-wall', 2) + rect(x1 - 12, 58, 12, 192, 'hy-wall', 2);
    out += rect(x0, 238, 50, 12, 'hy-wall', 2) + rect(x1 - 50, 238, 50, 12, 'hy-wall', 2);
    out += rect(x0 + 12, 70, x1 - x0 - 24, py - 70, 'hy-oil', 0);
    out += rect(141, py + 22, 32, 268 - py - 22, 'hy-steel', 2);
    out += rect(x0 + 12, py, x1 - x0 - 24, 22, 'hy-steel', 3);
    out += txt(157, (70 + py) / 2 + 9, 'p', 26, 'middle', 'hy-big');
    [116, 136, 178, 198].forEach((x) => { out += arrow([[x, py - 22], [x, py - 3]], 'hy-accl', 6); });
    if (step >= 1) {
      const ym = (70 + py) / 2;
      out += arrow([[x0 + 30, ym], [x0 + 15, ym]], 'hy-accl', 6) + arrow([[x1 - 30, ym], [x1 - 15, ym]], 'hy-accl', 6);
      out += arrow([[136, 92], [136, 73]], 'hy-accl', 6) + arrow([[178, 92], [178, 73]], 'hy-accl', 6);
    }
    if (step >= 3) out += arrow([[157, 270], [157, 296]], 'hy-accl', 10) + txt(172, 294, 'F', 22, 'start', 'hy-big');
    if (step >= 2) {
      out += txt(24, 326, num('200 bar = 20 N/mm²', '200 bar = 20 N/mm²'), 20, 'start', 'hy-mono');
      out += txt(24, 352, num('× 7.854 mm² (Ø100)', '× 7,854 mm² (Ø100)'), 20, 'start', 'hy-mono');
    }
    if (step >= 3) out += txt(24, 378, num('≈ 157 kN ≈ 16 ton', '≈ 157 kN ≈ 16 t'), 20, 'start', 'hy-big');
    return out;
  }
  // the directional valve in section: the spool shifts and connects P to A or B, the other side to T
  function spoolSvg(pos) {
    let out = rect(12, 150, 300, 238);
    out += txt(26, 180, tr('stuurventiel, doorsnede', 'directional valve, section'), 20, 'start', 'hy-mute');
    const PX = { A: 120, B: 204, P: 162, T1: 78, T2: 246 };
    out += rect(40, 228, 244, 74, 'hy-wall', 6);
    out += rect(PX.A - 7, 204, 14, 26, 'hy-wall', 1) + rect(PX.B - 7, 204, 14, 26, 'hy-wall', 1);
    out += rect(PX.P - 7, 300, 14, 26, 'hy-wall', 1) + rect(PX.T1 - 7, 300, 14, 26, 'hy-wall', 1) + rect(PX.T2 - 7, 300, 14, 26, 'hy-wall', 1);
    out += txt(PX.A, 200, 'A', 20, 'middle', 'hy-big') + txt(PX.B, 200, 'B', 20, 'middle', 'hy-big');
    out += txt(PX.P, 348, 'P', 20, 'middle', 'hy-big') + txt(PX.T1, 348, 'T', 20, 'middle', 'hy-big') + txt(PX.T2, 348, 'T', 20, 'middle', 'hy-big');
    const sh = 26 * pos;
    out += rect(52 + sh, 252, 220, 26, 'hy-steel', 3);
    [70, 140, 184, 254].forEach((x) => { out += rect(x - 10 + sh, 246, 20, 38, 'hy-steel', 2); });
    if (pos > 0.5) out += arrow([[PX.P, 324], [PX.P, 266], [PX.A, 266], [PX.A, 210]]) + arrow([[PX.B, 210], [PX.B, 266], [PX.T2, 266], [PX.T2, 324]], 'hy-line');
    if (pos < -0.5) out += arrow([[PX.P, 324], [PX.P, 266], [PX.B, 266], [PX.B, 210]]) + arrow([[PX.A, 210], [PX.A, 266], [PX.T1, 266], [PX.T1, 324]], 'hy-line');
    const st = pos > 0.5 ? tr('A: boven de zuiger, omlaag', 'A: above the piston, down') : pos < -0.5 ? tr('B: onder de zuiger, omhoog', 'B: below the piston, up') : tr('midden: alles dicht', 'centre: all closed');
    out += txt(26, 378, st, 20, 'start', 'hy-txt');
    return out;
  }
  function speedSvg() {
    let out = rect(12, 226, 300, 162);
    out += txt(30, 280, 'v = Q / A', 32, 'start', 'hy-big');
    out += txt(30, 318, tr('v: snelheid, Q: debiet,', 'v: speed, Q: flow,'), 20, 'start', 'hy-txt');
    out += txt(30, 348, tr('A: zuigeroppervlak', 'A: piston area'), 20, 'start', 'hy-txt');
    out += txt(30, 376, tr('minder debiet: trager', 'less flow: slower'), 20, 'start', 'hy-mute');
    return out;
  }
  // the gauge, large, with the relief valve's setting marked
  function gaugeSvg(v, setMark) {
    const cx = 108;
    const cy = 138;
    const r = 66;
    let out = rect(12, 12, 196, 246);
    out += txt(26, 42, tr('manometer', 'gauge'), 21, 'start', 'hy-mute');
    out += `<circle class="hy-dial" cx="${cx}" cy="${cy}" r="${r}"/>`;
    for (let i = 0; i <= 20; i++) {
      const a = ((-135 + i * 13.5) * Math.PI) / 180;
      const r1 = i % 5 ? r - 10 : r - 18;
      out += `<path class="${i % 5 ? 'hy-dim' : 'hy-line'}" d="M${f1(cx + (r - 4) * Math.sin(a))} ${f1(cy - (r - 4) * Math.cos(a))}L${f1(cx + r1 * Math.sin(a))} ${f1(cy - r1 * Math.cos(a))}"/>`;
    }
    if (setMark) {
      const a = ((-135 + 270 * 0.78) * Math.PI) / 180;
      out += `<path class="hy-accl" d="M${f1(cx + (r + 2) * Math.sin(a))} ${f1(cy - (r + 2) * Math.cos(a))}L${f1(cx + (r - 22) * Math.sin(a))} ${f1(cy - (r - 22) * Math.cos(a))}"/>`;
      out += txt(cx, cy + 32, tr('instelling', 'setting'), 20, 'middle', 'hy-mute');
    }
    const a0 = (-135 * Math.PI) / 180;
    out += txt(cx + (r + 12) * Math.sin(a0) - 6, cy - (r + 12) * Math.cos(a0) + 10, '0', 22, 'middle', 'hy-big');
    const a = ((-135 + 270 * v) * Math.PI) / 180;
    out += `<path class="hy-accl" d="M${f1(cx - 12 * Math.sin(a))} ${f1(cy + 12 * Math.cos(a))}L${f1(cx + (r - 16) * Math.sin(a))} ${f1(cy - (r - 16) * Math.cos(a))}"/>`;
    out += `<circle class="hy-acc" cx="${cx}" cy="${cy}" r="6"/>`;
    out += txt(cx + 24, cy + r + 36, v < 0.005 ? '0 bar' : 'bar', 24, 'middle', 'hy-big');
    return out;
  }
  // step badges 1 and 2: the block, then the accumulator
  function badgesSvg(n) {
    const spots = [[C.BLOCK.x - 8, 8, 110], [C.ACC[0], C.ACC[1], 106]];
    let out = '';
    spots.forEach((p, i) => {
      if (i >= n) return;
      const [x, y] = toStage(p);
      out += `<circle class="hy-badge" cx="${f1(x)}" cy="${f1(y)}" r="16"/>` + txt(x, y + 7.5, String(i + 1), 22, 'middle', 'hy-badgeT');
    });
    return out;
  }
  // the worked example: expected and measured speed, the lost quarter, the oil temperature
  function calcSvg(step, T) {
    const x0 = 336;
    let out = rect(x0, 12, 292, 376);
    out += txt(x0 + 14, 42, EX, 20, 'start', 'hy-mute');
    out += txt(x0 + 14, 74, num('Ø125: 12.272 mm²', 'Ø125: 12,272 mm²'), 20, 'start', 'hy-mono');
    out += txt(x0 + 14, 102, num('60 l/min = 0,001 m³/s', '60 L/min = 0.001 m³/s'), 20, 'start', 'hy-mono');
    const sc = 3.2;
    if (step >= 1) {
      out += txt(x0 + 14, 140, tr('verwacht', 'expected'), 20, 'start', 'hy-txt') + txt(x0 + 278, 140, '81 mm/s', 20, 'end', 'hy-mono');
      out += `<rect class="fp-meter" x="${x0 + 14}" y="150" width="${f1(C.V_EXP * sc)}" height="18" rx="3"/>`;
    }
    if (step >= 2) {
      out += txt(x0 + 14, 196, tr('gemeten', 'measured'), 20, 'start', 'hy-txt') + txt(x0 + 278, 196, '60 mm/s', 20, 'end', 'hy-big');
      out += `<rect class="fp-meter" data-top="" x="${x0 + 14}" y="206" width="${f1(C.V_MEAS * sc)}" height="18" rx="3"/>`;
      out += rect(x0 + 14 + C.V_MEAS * sc + 3, 206, (C.V_EXP - C.V_MEAS) * sc - 3, 18, 'hy-dim', 3);
    }
    if (step >= 3) out += txt(x0 + 14, 254, tr('¼ van het debiet: warmte', '¼ of the flow: heat'), 20, 'start', 'hy-on');
    if (step >= 2) {
      // a thermometer: tube, bulb, ticks at 60 and 70 °C
      const tx = x0 + 22;
      const zt = (t) => 372 - ((t - 20) / 60) * 92;
      out += rect(tx, 276, 14, 96, 'hy-wall', 7) + `<circle class="hy-wall" cx="${tx + 7}" cy="374" r="11"/>`;
      out += rect(tx + 4, zt(T), 6, 374 - zt(T), 'hy-acc', 3) + `<circle class="hy-acc" cx="${tx + 7}" cy="374" r="7"/>`;
      out += txt(tx + 34, 304, `${Math.round(T)} °C`, 24, 'start', 'hy-big');
      if (step >= 4) {
        out += txt(tx + 34, 338, tr('boven 60 °C: snel oud', 'above 60 °C: ages fast'), 20, 'start', 'hy-txt');
        out += txt(tx + 34, 368, tr('+10 °C ≈ ½ levensduur', '+10 °C ≈ ½ the life'), 20, 'start', 'hy-txt');
      }
    }
    return out;
  }
  // ISO 4406: a magnified drop with its particles, the three size classes and their code numbers
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const DOTS = [[48, 1.6], [12, 3.2], [2, 6]].map(([n, r]) => Array.from({ length: n }, () => { let x; let y; do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; } while (x * x + y * y > 0.8); return [x, y, r]; }));
  function isoSvg(step, q) {
    let out = rect(12, 12, 290, 376);
    out += txt(26, 44, 'ISO 4406', 22, 'start', 'hy-big') + txt(288, 44, EX, 20, 'end', 'hy-mute');
    const cx = 92;
    const cy = 150;
    const R = 68;
    out += `<circle class="hy-oil" cx="${cx}" cy="${cy}" r="${R}"/><circle class="hy-dim" cx="${cx}" cy="${cy}" r="${R}"/>`;
    DOTS.forEach((set, k) => set.forEach(([x, y, r], i) => { if (i / set.length <= q) out += `<circle class="${k === 2 ? 'hy-acc' : 'hy-dot'}" cx="${f1(cx + x * R)}" cy="${f1(cy + y * R)}" r="${r}"/>`; }));
    out += txt(cx, cy + R + 28, tr('olie, vergroot', 'oil, magnified'), 20, 'middle', 'hy-mute');
    C.SIZES.forEach((s, i) => {
      const y = 110 + i * 44;
      out += txt(178, y, `> ${s} µm`, 20, 'start', 'hy-txt') + txt(290, y, String(C.CODE[i]), 22, 'end', 'hy-big');
    });
    out += txt(26, 300, `${C.CODE.join('/')}`, 30, 'start', 'hy-big');
    if (step >= 2) {
      out += txt(26, 340, tr('1 stap lager ≈ ½ zoveel', '1 step lower ≈ ½ as many'), 20, 'start', 'hy-txt');
      out += txt(26, 372, tr('lager = schoner', 'lower = cleaner'), 20, 'start', 'hy-big');
    }
    return out;
  }
  // a checklist panel: rows ticked (or crossed, mark 'x') one by one
  function listSvg(title, rows, ticked, x0 = 12, w = 300, marks = []) {
    const h = 56 + rows.length * 40;
    const top = 392 - h;
    let out = `<g transform="translate(${x0 - 12} 0)">` + rect(12, top, w, h);
    out += txt(28, top + 34, title, 21, 'start', 'hy-mute');
    rows.forEach((t, i) => {
      const y = top + 50 + i * 40;
      const on = i < ticked;
      out += marks[i] === 'x'
        ? `<path class="${on ? 'hy-accl' : 'hy-dim'}" d="M31 ${y + 9}L47 ${y + 25}M47 ${y + 9}L31 ${y + 25}"/>`
        : `<path class="${on ? 'hy-accl' : 'hy-dim'}" d="M30 ${y + 18}L37 ${y + 25}L50 ${y + 10}"/>`;
      out += txt(64, y + 26, t, 21, 'start', on ? 'hy-txt' : 'hy-mute');
    });
    return out + '</g>';
  }

  // ------------------------------------------------------------ oil flow
  const FLOWS = ['fP', 'fA', 'fB', 'fT'];
  function flow(st, clockS) {
    for (const key of FLOWS) {
      const d = st.flow[key] || 0;
      const a = Math.min(1, Math.abs(d));
      fade(E[key], a);
      if (a > 0.01) { const off = f1(-clockS * 9 * Math.sign(d)); if (E[key].__o !== off) { E[key].style.strokeDashoffset = off; E[key].__o = off; } }
    }
  }
  // the press cycle: down, hold, up, rest (period 8 s); the ram's travel and the valve's position
  function cycle(t, slow = 1) {
    const c = (t * slow) % 8;
    const down = span(c, 0.4, 3);
    const up = span(c, 4.2, 6.6);
    const ram = down - up;
    const pos = c > 0.4 && c < 3 ? 1 : c > 4.2 && c < 6.6 ? -1 : 0;
    return { ram, pos };
  }
  function moving(st, pos, k = 1) {
    st.pos = pos;
    if (pos > 0) st.flow = { fP: k, fA: k, fB: -k, fT: k };
    else if (pos < 0) st.flow = { fP: k, fA: -k, fB: k, fT: k };
    else st.flow = { fP: 0.5 * k, fT: 0.5 * k };
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['force', 'spool', 'speed', 'gaugeBig', 'badges', 'calc', 'iso', 'care', 'jetc'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    const st = { ram: 0, pos: 0, flow: {}, motor: true, gaugeV: 0.72, block: 0, T: 45, jet: 0, board: 0, stain: 0 };

    if (si === 0) {
      const c = cycle(clockS, 0.8);
      st.ram = c.ram; moving(st, c.pos);
      vis.force = b >= 1 ? (b === 1 ? span(p, 0, 0.12) : 1) : 0;
      if (vis.force > 0.01) set(E.force, forceSvg(b, 150 + 10 * st.ram));
    } else if (si === 1) {
      if (b === 0) { st.ram = 0; st.flow = { fP: span(p, 0.3, 0.5) }; } else if (b === 1) {
        // out, then back: the valve switches from A to B
        const down = p < 0.5;
        st.ram = down ? span(p, 0.08, 0.42) : 1 - span(p, 0.56, 0.92);
        moving(st, down ? (p > 0.08 ? 1 : 0) : (p > 0.56 ? -1 : 0));
      } else if (b === 2) {
        st.ram = 1 - span(p, 0.05, 1); moving(st, -1); st.flow.fT = 1.6;
      } else { const c = cycle(clockS, 1); st.ram = c.ram; moving(st, c.pos); }
      vis.spool = b === 1 || b === 2 ? 1 : 0;
      if (vis.spool) set(E.spool, spoolSvg(st.pos));
      vis.speed = b === 3 ? span(p, 0, 0.1) : 0;
      if (vis.speed > 0.01) set(E.speed, speedSvg());
    } else if (si === 2) {
      if (b === 0) { st.ram = 0.85 * span(p, 0.05, 0.95); moving(st, 1); st.gaugeV = 0.1; } else if (b === 1) {
        st.ram = 0.85 + 0.15 * span(p, 0, 0.25); st.gaugeV = 0.1 + 0.68 * span(p, 0.2, 0.85); moving(st, 1, 1 - span(p, 0.2, 0.85) * 0.8);
      } else {
        st.ram = 1; st.gaugeV = 0.78; st.pos = 1; st.flow = { fP: 1, fT: 1.4 };
        if (b === 3) st.T = 45 + 12 * span(p, 0, 0.9);
      }
      vis.gaugeBig = 1;
      set(E.gaugeBig, gaugeSvg(st.gaugeV, b >= 1));
    } else if (si === 3) {
      st.motor = !(b > 1 || (b === 1 && p > 0.2));
      st.flow = st.motor ? { fP: 0.5, fT: 0.5 } : {};
      st.gaugeV = b <= 1 ? 0.72 : b === 2 ? 0.72 * (1 - span(p, 0.62, 0.98)) : 0;
      st.block = b === 2 ? span(p, 0.05, 0.5) : b > 2 ? 1 : 0;
      vis.gaugeBig = b === 1 || b === 3 ? span(p, 0, 0.1) : 0;
      if (vis.gaugeBig > 0.01) set(E.gaugeBig, gaugeSvg(st.gaugeV, false));
      vis.badges = b >= 2 ? (b === 2 ? span(p, 0.45, 0.55) : 1) : 0;
      if (vis.badges > 0.01) set(E.badges, badgesSvg(b === 2 && p < 0.6 ? 1 : 2));
    } else if (si === 4) {
      const c = cycle(clockS, 0.74);
      st.ram = c.ram; moving(st, c.pos, 0.75);
      st.T = b <= 1 ? 45 + 25 * span(u, 0, 0.3) : 70;
      vis.calc = 1;
      set(E.calc, calcSvg(b, st.T));
    } else if (si === 5) {
      st.flow = { fP: 0.5, fT: 0.5 };
      vis.iso = b >= 1 && b <= 2 ? (b === 1 ? span(p, 0, 0.1) : 1) : 0;
      if (vis.iso > 0.01) set(E.iso, isoSvg(b, b === 1 ? span(p, 0.1, 0.8) : 1));
      vis.care = b === 3 ? span(p, 0, 0.08) : 0;
      if (vis.care > 0.01) {
        set(E.care, listSvg(tr('goede praktijk', 'good practice'), NL ? ['filter op streefcode', 'afgesloten ontluchter', 'olieanalyse', 'niet uit open vat'] : ['filter for a target code', 'sealed breather', 'oil analysis', 'not from an open drum'], 1 + Math.floor(span(p, 0.08, 0.8) * 3.99)));
      }
    } else if (si === 6) {
      st.ram = 0.4;
      st.jet = span(u, 0.02, 0.1);
      st.board = b >= 1 ? (b === 1 ? span(p, 0.3, 0.75) : 1) : 0;
      st.stain = b >= 1 ? (b === 1 ? span(p, 0.75, 1) : 1) : 0;
      vis.jetc = b === 1 || b === 3 ? span(p, 0, 0.1) : b === 2 ? 1 : 0;
      if (vis.jetc > 0.01) {
        if (b <= 2) set(E.jetc, listSvg(tr('een lek zoeken', 'finding a leak'), NL ? ['met je hand: nooit', 'met karton'] : ['with your hand: never', 'with cardboard'], b === 1 ? 1 + (p > 0.4 ? 1 : 0) : 2, 12, 300, ['x', 'v']));
        else set(E.jetc, listSvg(tr('injectieletsel', 'injection injury'), NL ? ['altijd spoedgeval', 'meteen naar de SEH', 'zeg: olie, hoge druk'] : ['always an emergency', 'straight to A&E', 'say: oil, high pressure'], 1 + Math.floor(span(p, 0.1, 0.7) * 2.99)));
      }
    }

    // ---- the drawing
    move(E.ram, [0, 0, -C.STROKE * st.ram]);
    const bp = C.BLOCK_PARK;
    const lift = span(st.block, 0, 0.45);
    const slide = span(st.block, 0.45, 1);
    const inside = slide > 0.55;
    show(E.block, inside);
    show(E.blockOut, !inside);
    move(inside ? E.block : E.blockOut, [bp[0] * (1 - slide), bp[1] * (1 - slide), bp[2] * (1 - lift)]);
    set(E.needle, needleSvg(st.gaugeV));
    set(E.therm, mercurySvg(st.T));
    flag(LED.motor, 'data-on', st.motor);
    flag(LED.solR, 'data-on', st.pos > 0);
    flag(LED.solL, 'data-on', st.pos < 0);
    flow(st, clockS);
    set(E.jetLine, st.jet > 0.01 ? jetSvg(st.jet, st.board > 0.98, clockS) : '');
    show(E.cardboard, st.board > 0.01);
    if (st.board > 0.01) move(E.cardboard, [36 * (1 - st.board), 0, 0]);
    if (st.stain > 0.01) {
      const f = C.FIT_AT;
      const [x, y] = at([f[0] + 0.4, C.CARD.y, f[2] - 0.6]);
      set(E.stain, `<ellipse class="hy-stain" cx="${f2(x)}" cy="${f2(y)}" rx="${f2(2.2 * st.stain)}" ry="${f2(1.4 * st.stain)}"/>`);
    } else set(E.stain, '');
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
