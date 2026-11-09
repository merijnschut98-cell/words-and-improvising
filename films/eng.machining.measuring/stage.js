// The stage of the film "Meten en een capabel proces / Measuring and a capable
// process": a pure function of (scene, u). Inlined into the page after the
// anatomy kit (iso-kit functions in scope, the lathe module as G) and a
// preamble from build.mjs that defines P (projection), C (world constants), CAM
// (one camera move per scene), W and H. Moves are placed per caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step.
/* global G, P, C, CAM, W, H, iso, solidSvg, lineSvg, cylinder, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const LANG = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'nl';
  const X = [1, 0, 0];
  const Y = [0, 1, 0];
  const Z = [0, 0, 1];
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const KS = G.scaleOf(P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const dec = (v, d) => (LANG === 'nl' ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const txt = (x, y, t, size = 20, anchor = 'middle', cls = 'ms-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const S = (paths, style = {}) => solidSvg(paths, { tone: 'mid', ...style });
  const rect = (x, y, w, h, cls = 'ms-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'ms-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const rnd = (i) => { const s = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return s - Math.floor(s); };
  const gauss = (i) => (rnd(i) + rnd(i + 0.37) + rnd(i + 0.71) - 1.5) * 1.41;

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
    const w = lerp(c.from[2], c.to[2], k);
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the machine
  // st: { dz (head), tool: 'cut' | 'probe', spin, heat 0..1, chips, dx }
  function chipsSvg(clockS) {
    let out = '';
    for (let i = Math.max(0, Math.floor((clockS - 1.2) / 0.3)); i * 0.3 <= clockS; i++) {
      const age = clockS - i * 0.3;
      if (age > 1.2 || age < 0) continue;
      const r = rnd(i);
      const a = r * TAU;
      const p = [C.MX + Math.cos(a) * (9 + 30 * age), Math.sin(a) * (9 + 30 * age), C.M_TOP + 2 + 26 * age - 40 * age * age];
      const [sx, sy] = at(p);
      const sz = 1.6 * KS;
      const al = Math.min(1, age / 0.1) * (1 - clamp((age - 0.9) / 0.3, 0, 1));
      out += `<path class="fp-chip" style="opacity:${al.toFixed(2)}" d="M${f2(sx - sz)} ${f2(sy)}Q${f2(sx)} ${f2(sy - sz * 1.4)} ${f2(sx + sz)} ${f2(sy)}Q${f2(sx)} ${f2(sy - sz * 0.5)} ${f2(sx - sz)} ${f2(sy)}Z"/>`;
    }
    return out;
  }
  function headHeat(h) {
    if (h <= 0.01) return '';
    // a warm glow over the spindle housing and the head's lower front
    const glow = cylinder(C.MX, 0, 15.2, 136, 14.2, P, 32, 0).fill;
    return `<g style="opacity:${(0.18 + 0.5 * h).toFixed(2)}"><path class="ms-heat" d="${glow}"/>`
      + `<path class="ms-heat" d="${fmt([[-358, 14, 150], [-302, 14, 150], [-302, 14, 150 + 34 * h], [-358, 14, 150 + 34 * h]].map(at))}Z"/></g>`;
  }
  function renderMachine(clockS, st) {
    move(E.head, [st.dx || 0, 0, st.dz || 0]);
    show(E.mTool, st.tool === 'probe');
    show(E.mCut, st.tool !== 'probe');
    set(E.mHeat, headHeat(st.heat || 0));
    set(E.mChips, st.chips ? chipsSvg(clockS) : '');
  }

  // ------------------------------------------------------------ the bench
  const SHAFT_F = G.frameOf([C.SX[0], 0, C.SZ], X, Y, Z);
  const LEN = C.SX[1] - C.SX[0];
  function shaftHeat(h) {
    if (h <= 0.01) return '';
    const s = G.solidOf([[1, C.SR + 0.05], [LEN - 1, C.SR + 0.05]], SHAFT_F, P);
    return `<path class="ms-heat" style="opacity:${(0.38 * h).toFixed(2)}" d="${s.fill}"/>`;
  }
  function chatterSvg(a) {
    if (a <= 0.01) return '';
    let d = '';
    for (let s = 64; s <= 150; s += 5) d += G.arcOf(SHAFT_F, s, C.SR + 0.05, P);
    return `<g style="opacity:${a.toFixed(2)}"><path class="ms-wave" d="${d}"/></g>`;
  }
  function burrSvg(a) {
    if (a <= 0.01) return '';
    // a ragged lip standing proud of the end face, all round its edge
    const pts = [];
    const n = 40;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * TAU;
      const r = C.SR + 0.6 + 1.6 * a * (0.5 + 0.5 * rnd(i * 3.1));
      pts.push(at([C.SX[1] + 0.6, Math.cos(t) * r, C.SZ + Math.sin(t) * r]));
    }
    const inner = [];
    for (let i = n; i >= 0; i--) { const t = (i / n) * TAU; inner.push(at([C.SX[1] + 0.2, Math.cos(t) * (C.SR - 1), C.SZ + Math.sin(t) * (C.SR - 1)])); }
    return `<path class="ms-burr" d="${fmt(pts)}Z${fmt(inner)}Z" fill-rule="evenodd"/>`;
  }
  // the go/no-go plug gauge, vertical over the ring; z0 is its lower end, the part
  // below the ring's top is inside the bore and not drawn
  function gaugeSvg(z0, flipped, alpha) {
    if (alpha <= 0.01) return '';
    const [x, y] = C.RING;
    const top = C.RING_Z[1];
    const F = G.frameOf([x, y, 0], Z, X, Y);
    const seg = (a, b, r, style) => { const lo = Math.max(a, top + 0.01); return b - lo > 0.2 ? S(G.disc(lo, b, r, F, P), style) : ''; };
    const pin = flipped ? [9.6, 8] : [9.6, 18];
    const pin2 = flipped ? [9.6, 18] : [9.6, 8];
    let z = z0;
    let out = seg(z, z + pin[1], pin[0], { tone: 'hi', crease: 'lo' });
    z += pin[1];
    out += seg(z, z + 3, 7, { crease: 'lo' });
    z += 3;
    out += seg(z, z + 34, 6, { crease: 'lo' });
    const knurl = [];
    for (let k2 = 0; k2 < 10; k2++) { const zz = z + 6 + k2 * 2.4; knurl.push(G.arcOf(F, zz, 6.02, P)); }
    out += lineSvg(knurl.join(''), { tone: 'faint' });
    z += 34;
    out += seg(z, z + 3, 7, { crease: 'lo' });
    z += 3;
    out += seg(z, z + pin2[1], pin2[0], { tone: 'hi', crease: 'lo' });
    // the no-go end carries a band
    const ng = flipped ? z0 + 4 : z + 4;
    if (ng > top) out += `<path class="ms-ring" d="${G.arcOf(F, ng, 9.65, P)}"/>`;
    return `<g style="opacity:${alpha.toFixed(2)}">${out}</g>`;
  }

  // ------------------------------------------------------------ the CMM
  function touchSvg(pts, fit) {
    let out = '';
    if (fit > 0.01) out += `<path class="ms-accl" style="opacity:${fit.toFixed(2)}" d="${fmt(Array.from({ length: 49 }, (_, i) => at([C.CX + (C.C_BORE - 0.2) * Math.cos((i / 48) * TAU), (C.C_BORE - 0.2) * Math.sin((i / 48) * TAU), C.C_TOP - 4])))}"/>`;
    for (const a of pts) { const [sx, sy] = at([C.CX + C.C_BORE * Math.cos(a), C.C_BORE * Math.sin(a), C.C_TOP - 4]); out += `<circle class="ms-acc" cx="${f1(sx)}" cy="${f1(sy)}" r="${f2(1.2 * KS)}"/>`; }
    return out;
  }

  // ------------------------------------------------------------ HUD panels
  // the roughness profile in the loupe (centre 520,148, r 104)
  function profileSvg(kind, prog) {
    const x0 = 420;
    const x1 = 620;
    const y0 = 160;
    const pts = [];
    const n = 120;
    const shown = Math.round(n * clamp(prog, 0, 1));
    for (let i = 0; i <= shown; i++) {
      const x = lerp(x0, x1, i / n);
      let y = y0 + 12 * Math.sin(i * 0.8) * (0.6 + 0.4 * rnd(i)) + 7 * Math.sin(i * 2.1 + 1) + 4 * (rnd(i * 2.3) - 0.5);
      if (kind === 'chatter') y = y0 + 26 * Math.sin((i / n) * TAU * 5) + 4 * (rnd(i) - 0.5);
      if (kind === 'burr') y = i < 80 ? y0 + 5 * Math.sin(i * 1.7) * rnd(i) : i < 84 ? y0 - 60 * ((i - 80) / 4) : y0 + 80;
      pts.push([x, y]);
    }
    let out = '';
    if (kind === 'ra') {
      out += line(x0, y0, x1, y0, 'ms-grid') + line(x0, y0 - 11, x1, y0 - 11, 'ms-lim') + line(x0, y0 + 11, x1, y0 + 11, 'ms-lim');
      out += txt(520, 92, 'Ra', 26, 'middle', 'ms-big');
    }
    if (kind === 'chatter') out += txt(520, 92, LANG === 'nl' ? 'golven' : 'waves', 20, 'middle', 'ms-mute');
    if (kind === 'burr') out += line(520, 240, 520, 250, 'ms-grid');
    out += `<path class="ms-curve" data-c="acc" d="${fmt(pts)}"/>`;
    if (kind === 'ra') out += txt(520, 222, LANG === 'nl' ? 'µm, gemiddeld' : 'µm, average', 19, 'middle', 'ms-mute');
    return out;
  }
  // a thermometer at the right edge
  function thermSvg(temp) {
    const x = 590;
    const yTop = 40;
    const yBot = 230;
    const h = (t) => lerp(yBot - 10, yTop + 10, (t - 15) / 25);
    let out = rect(536, 22, 96, 260);
    out += `<rect class="ms-tube" x="${x - 7}" y="${yTop}" width="14" height="${yBot - yTop}" rx="7"/><circle class="ms-tube" cx="${x}" cy="${yBot + 8}" r="14"/>`;
    out += `<rect class="ms-acc" x="${x - 4}" y="${f1(h(temp))}" width="8" height="${f1(yBot - h(temp) + 4)}" rx="4"/><circle class="ms-acc" cx="${x}" cy="${yBot + 8}" r="10"/>`;
    for (const t of [20, 30, 40]) out += line(x - 22, h(t), x - 10, h(t), 'ms-axis') + txt(x - 26, h(t) + 6, String(t), 19, 'end', 'ms-mute');
    out += txt(584, 274, `${Math.round(temp)} °C`, 22, 'middle', 'ms-big');
    return out;
  }
  // the tolerance band of Ø30 h6 and the reading
  function bandSvg(val, show2) {
    const x0 = 330;
    const x1 = 610;
    const lo = 29.98;
    const hi = 30.003;
    const xs = (v) => lerp(x0, x1, (v - lo) / (hi - lo));
    let out = rect(306, 300, 326, 94);
    out += `<rect class="ms-zone" data-z="0" x="${f1(xs(C.H6[0]))}" y="336" width="${f1(xs(C.H6[1]) - xs(C.H6[0]))}" height="16" rx="2"/>`;
    out += line(x0, 344, x1, 344, 'ms-axis');
    out += txt(xs(C.H6[0]), 378, dec(C.H6[0], 3), 19, 'middle', 'ms-mute') + txt(xs(C.H6[1]), 378, dec(C.H6[1], 3), 19, 'middle', 'ms-mute');
    if (show2 > 0.01) {
      const vx = xs(val);
      const out2 = val < C.H6[0] - 1e-6;
      out += `<g style="opacity:${show2.toFixed(2)}"><path class="${out2 ? 'ms-accl' : 'ms-curve'}" d="M${f1(vx)} 330L${f1(vx)} 358"/>`
        + txt(vx, 324, dec(val, 3), 20, 'middle', 'ms-big') + '</g>';
    }
    return out;
  }
  // the micrometer readout
  function lcdSvg(val, unit) {
    return rect(404, 24, 226, 92) + rect(416, 34, 202, 52, 'ms-zone', 4) + txt(610, 74, dec(val, 3), 34, 'end', 'ms-big') + txt(517, 108, unit, 19, 'middle', 'ms-mute');
  }
  // resolution and uncertainty: the band 0,04 as a bar, a ruler in 0,001 steps
  // (the micrometer) and in 0,01 steps (the caliper), the reading and its spread
  const UX0 = 300;
  const UX1 = 620;
  const ux = (v) => lerp(UX0, UX1, (v + 0.02) / 0.04); // v: deviation from nominal, mm
  function uncBase() {
    let out = rect(270, 190, 362, 204);
    out += txt(UX0, 214, dec(-0.02, 2).replace('-', '−'), 19, 'start', 'ms-mute') + txt(UX1, 214, '+' + dec(0.02, 2), 19, 'end', 'ms-mute');
    out += `<rect class="ms-zone" data-z="0" x="${UX0}" y="222" width="${UX1 - UX0}" height="12" rx="2"/>`;
    // the caliper ruler, 0,01 steps
    out += line(UX0, 360, UX1, 360, 'ms-axis');
    for (let i = 0; i <= 4; i++) out += line(ux(-0.02 + i * 0.01), 360, ux(-0.02 + i * 0.01), 370, 'ms-axis');
    out += txt(UX1, 388, LANG === 'nl' ? 'schuifmaat 0,01' : 'caliper 0.01', 19, 'end', 'ms-mute');
    return out;
  }
  function uncRes(step) {
    let out = line(UX0, 306, UX1, 306, 'ms-curve');
    for (let i = 0; i <= 40; i++) { const x = ux(-0.02 + i * 0.001); out += line(x, 306, x, i % 5 ? 312 : 318, 'ms-curve'); }
    out += txt(UX1, 340, LANG === 'nl' ? 'micrometer 0,001' : 'micrometer 0.001', 19, 'end', 'ms-mute');
    if (step > 0.01) out += `<g style="opacity:${step.toFixed(2)}"><rect class="ms-acc" x="${f1(ux(0))}" y="298" width="${f1(ux(0.004) - ux(0))}" height="6"/>${txt(ux(0) - 6, 296, '≤ ' + dec(0.004, 3), 19, 'end', 'ms-big')}</g>`;
    return out;
  }
  function uncRd(spread, scatter) {
    const v = 0.002;
    let out = '';
    if (spread > 0.01) {
      const w = 0.004 * spread;
      out += `<path class="ms-ring" d="M${f1(ux(v - w))} 246L${f1(ux(v - w))} 266L${f1(ux(v + w))} 266L${f1(ux(v + w))} 246"/>`;
    }
    out += `<circle class="ms-dot" cx="${f1(ux(v))}" cy="256" r="5"/>`;
    for (let i = 0; i < Math.round(12 * scatter); i++) out += `<circle class="ms-dot" cx="${f1(ux(v + 0.0022 * gauss(i + 5)))}" cy="${f1(256 + (i % 2 ? -1 : 1) * (5 + (i % 3) * 4))}" r="3.2"/>`;
    return out;
  }
  // gauge R&R: 10 parts, 3 operators, 3 repeats
  const GX0 = 250;
  const GX1 = 610;
  const gy = (v) => 196 - v * 16000; // reading minus the part's reference, mm → y
  const BIAS = [0, 0.0012, -0.001];
  const reading = (pi, oi, r) => BIAS[oi] + 0.0007 * gauss(pi * 31 + oi * 7 + r * 3 + 1);
  const gxOf = (pi, oi) => lerp(GX0 + 20, GX1 - 30, pi / 9) + (oi - 1) * 9;
  function grrBase(shown) {
    let out = rect(214, 58, 418, 336);
    out += line(GX0, 88, GX0, 330, 'ms-axis') + line(GX0, 330, GX1, 330, 'ms-axis') + line(GX0, gy(0), GX1, gy(0), 'ms-grid');
    out += txt(GX0 + 6, 84, LANG === 'nl' ? 'meting − referentie' : 'reading − reference', 19, 'start', 'ms-mute');
    out += txt(GX1, 356, LANG === 'nl' ? 'stuk 1–10 · operator A B C' : 'part 1–10 · operator A B C', 19, 'end', 'ms-mute');
    const n = Math.round(90 * shown);
    let c = 0;
    for (let pi = 0; pi < 10; pi++) for (let oi = 0; oi < 3; oi++) for (let r = 0; r < 3; r++) {
      if (c++ >= n) continue;
      const x = gxOf(pi, oi);
      const y = gy(reading(pi, oi, r));
      out += oi === 0 ? `<circle class="ms-dot" cx="${f1(x)}" cy="${f1(y)}" r="3.6"/>` : oi === 1 ? `<circle class="ms-ring" cx="${f1(x)}" cy="${f1(y)}" r="3.4"/>` : `<rect class="ms-dot" x="${f1(x - 3)}" y="${f1(y - 3)}" width="6" height="6"/>`;
    }
    return out;
  }
  function grrRep(a) {
    if (a <= 0.01) return '';
    const pi = 6;
    const oi = 0;
    const ys = [0, 1, 2].map((r) => gy(reading(pi, oi, r)));
    const x = gxOf(pi, oi);
    return `<g style="opacity:${a.toFixed(2)}"><rect class="ms-ring" x="${f1(x - 8)}" y="${f1(Math.min(...ys) - 8)}" width="16" height="${f1(Math.max(...ys) - Math.min(...ys) + 16)}" rx="8"/></g>`;
  }
  function grrRepro(a) {
    if (a <= 0.01) return '';
    let out = '';
    BIAS.forEach((b, oi) => {
      const y = gy(b) + 0;
      out += `<path class="ms-ring" style="stroke-dasharray:${oi === 0 ? 'none' : oi === 1 ? '6 4' : '2 4'}" d="M${GX0 + 4} ${f1(y)}L${GX1 - 16} ${f1(y)}"/>`;
      out += txt(GX1 - 10, y + 6 + (oi === 0 ? 0 : oi === 1 ? -6 : 6), 'ABC'[oi], 19, 'start', 'ms-mute');
    });
    return `<g style="opacity:${a.toFixed(2)}">${out}</g>`;
  }
  function grrVer(a, fill) {
    if (a <= 0.01) return '';
    const x0 = 250;
    const x1 = 610;
    const xs = (pc) => lerp(x0, x1, pc / 40);
    let out = rect(214, 236, 418, 158);
    out += `<rect class="ms-zone" data-z="0" x="${x0}" y="300" width="${f1(xs(10) - x0)}" height="20"/>`;
    out += `<rect class="ms-zone" data-z="1" x="${f1(xs(10))}" y="300" width="${f1(xs(30) - xs(10))}" height="20"/>`;
    out += `<rect class="ms-zone" data-z="2" x="${f1(xs(30))}" y="300" width="${f1(x1 - xs(30))}" height="20"/>`;
    for (const pc of [0, 10, 30, 40]) out += txt(xs(pc), 346, `${pc}%`, 19, 'middle', 'ms-mute');
    const v = 22.5 * fill;
    out += `<path class="ms-accl" d="M${f1(xs(v))} 292L${f1(xs(v))} 328"/>` + txt(xs(v), 282, `${dec(v, 1)}%`, 24, 'middle', 'ms-big');
    out += txt(430, 380, LANG === 'nl' ? 'GRR / tolerantieband' : 'GRR / tolerance band', 19, 'middle', 'ms-mute');
    return `<g style="opacity:${a.toFixed(2)}">${out}</g>`;
  }
  // the bore's mean through a day, 7:00 → 17:00, against the limits
  const RX0 = 330;
  const RX1 = 556;
  const ry = (v) => lerp(330, 110, (v + 0.018) / 0.036); // deviation from 25,000
  const rx = (h) => lerp(RX0, RX1, (h - 7) / 10);
  function runSvg(mean, until, sigmaBell, cpkText, bracket) {
    let out = rect(300, 56, 332, 338);
    out += line(RX0, 100, RX0, 342, 'ms-axis') + line(RX0, 342, 620, 342, 'ms-axis');
    out += line(RX0, ry(0.015), 620, ry(0.015), 'ms-lim') + line(RX0, ry(-0.015), 620, ry(-0.015), 'ms-lim') + line(RX0, ry(0), 620, ry(0), 'ms-grid');
    out += txt(RX0 + 4, ry(0.015) - 8, dec(25.015, 3), 19, 'start', 'ms-mute');
    out += txt(RX0 + 4, ry(0) - 8, dec(25, 3), 19, 'start', 'ms-mute');
    out += txt(RX0 + 4, ry(-0.015) + 22, dec(24.985, 3), 19, 'start', 'ms-mute');
    out += txt(RX0, 368, '7:00', 19, 'middle', 'ms-mute') + txt(rx(12), 368, '12:00', 19, 'middle', 'ms-mute') + txt(RX1, 368, '17:00', 19, 'middle', 'ms-mute');
    const pts = [];
    for (let h = 7; h <= until + 1e-9; h += 0.1) pts.push([rx(h), ry(mean(h))]);
    if (pts.length > 1) out += `<path class="ms-curve" d="${fmt(pts)}"/>`;
    if (sigmaBell) {
      // the spread at this moment: a bell standing on its side at the last point
      const m = mean(until);
      const bx = Math.min(rx(until), RX1) + 6;
      const bell = [];
      for (let i = -30; i <= 30; i++) { const v = m + (i / 10) * C.SIG; bell.push([bx + 40 * Math.exp(-((i / 10) ** 2) / 2), ry(v)]); }
      out += `<path class="ms-curve" d="${fmt(bell)}"/>`;
      if (bracket > 0.01) out += `<g style="opacity:${bracket.toFixed(2)}"><path class="ms-accl" d="M${f1(bx + 50)} ${f1(ry(m))}L${f1(bx + 50)} ${f1(ry(0.015))}"/><path class="ms-accl" d="M${f1(bx + 44)} ${f1(ry(m))}L${f1(bx + 56)} ${f1(ry(m))}M${f1(bx + 44)} ${f1(ry(0.015))}L${f1(bx + 56)} ${f1(ry(0.015))}"/></g>`;
    }
    if (cpkText) out += txt(620, 92, cpkText, 26, 'end', 'ms-big');
    return out;
  }
  function warmSvg(prog) {
    let out = rect(300, 56, 332, 338);
    const x0 = 340;
    const x1 = 610;
    const yb = 330;
    const yt = 130;
    const steps = [0.25, 0.5, 0.75, 1];
    out += line(x0, yb, x1, yb, 'ms-axis') + line(x0, yt - 20, x0, yb, 'ms-axis');
    const pts = [[x0, yb]];
    const n = clamp(prog, 0, 1) * 4;
    for (let i = 0; i < 4; i++) {
      if (n <= i) break;
      const xa = lerp(x0, x1, i / 4);
      const xb = lerp(x0, x1, Math.min(n, i + 1) / 4);
      const y = lerp(yb, yt, steps[i]);
      pts.push([xa, y], [xb, y]);
    }
    out += `<path class="ms-curve" data-c="acc" d="${fmt(pts)}"/>`;
    out += txt(x0 + 8, 96, LANG === 'nl' ? 'toerental' : 'spindle speed', 19, 'start', 'ms-mute');
    out += txt(x1, 362, LANG === 'nl' ? 'tijd' : 'time', 19, 'end', 'ms-mute');
    return out;
  }
  const meanDrift = (h) => 0.006 * clamp((h - 7) / 5, 0, 1) ** 0.8;

  // ------------------------------------------------------------ the scenes
  const HUDS = ['loupe', 'therm', 'band', 'unc', 'grr', 'run', 'warmc', 'lcd'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    const mach = { dz: 0, tool: 'cut', heat: 0, chips: false };
    let sheat = 0;
    let chat = 0;
    let burr = 0;
    let gauge = null;
    let ramBy = [0, 0, 0];
    let touches = [];
    let fit = 0;

    if (si === 0) {
      mach.chips = u < 0.4;
      mach.dz = -14 * span(u, 0, 0.08) + 14 * span(u, 0.36, 0.44);
      ramBy = [0, 0, -33 * span(u, 0.82, 0.92)];
    } else if (si === 1) {
      vis.loupe = span(u, 0, 0.05);
      const kind = b === 0 ? 'ra' : b === 1 ? 'chatter' : 'burr';
      set(E.loupeIn, profileSvg(kind, b === 0 ? span(p, 0.05, 0.6) : span(p, 0, 0.4)));
      chat = b === 1 ? span(p, 0.1, 0.4) : b === 2 ? 1 - span(p, 0, 0.2) : 0;
      burr = b === 2 ? span(p, 0.1, 0.4) : 0;
    } else if (si === 2) {
      vis.lcd = b < 2 ? span(u, 0, 0.04) * (b === 1 ? 1 - span(p, 0.8, 1) : 1) : 0;
      if (vis.lcd > 0.01) set(E.lcd, lcdSvg(29.998 + 0.001 * Math.round(2 * Math.sin(clockS * 1.3)), b === 0 ? (LANG === 'nl' ? 'stap 0,001 mm' : 'step 0.001 mm') : (LANG === 'nl' ? '±0,01 → 0,001' : '±0.01 → 0.001')));
      if (b === 2) {
        // go end down into the bore, out, turn over, no-go end stops on the rim
        const into = span(p, 0.05, 0.25) - span(p, 0.32, 0.45);
        const swap = span(p, 0.45, 0.6);
        const down = span(p, 0.6, 0.78);
        const flipped = swap > 0.5;
        const z0 = flipped ? lerp(C.RING_Z[1] + 30, C.RING_Z[1] + 0.2, down) : lerp(C.RING_Z[1] + 30, C.RING_Z[1] - 12, into);
        gauge = { z0, flipped, a: Math.abs(swap - 0.5) * 2 };
      } else gauge = { z0: C.RING_Z[1] + 30, flipped: false, a: b === 1 ? span(p, 0.7, 1) : 0 };
    } else if (si === 3) {
      const dive = b === 0 ? span(p, 0.1, 0.35) : 1;
      const k4 = b === 0 ? Math.floor(clamp((p - 0.35) / 0.6, 0, 0.999) * 4) : 4;
      const kp = b === 0 ? ((p - 0.35) / 0.6 * 4) % 1 : 0;
      const angs = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
      let off = [0, 0];
      if (b === 0 && p > 0.35 && k4 < 4) { const a = angs[k4]; const r = 9.4 * Math.sin(Math.PI * clamp(kp, 0, 1)); off = [Math.cos(a) * r, Math.sin(a) * r]; }
      touches = angs.slice(0, b === 0 ? k4 + (kp > 0.5 ? 1 : 0) : 4);
      fit = b >= 1 ? span(p, 0, 0.3) : 0;
      ramBy = [off[0], off[1], -33 * dive + (b === 2 ? 33 * span(p, 0, 0.3) : 0)];
      vis.therm = b === 2 ? span(p, 0, 0.15) : 0;
      if (vis.therm > 0.01) set(E.therm, thermSvg(20));
    } else if (si === 4) {
      // warm off the machine at 35 °C, cooling to 20 °C; the reading follows
      const cool = b < 2 ? 0 : b === 2 ? span(p, 0, 0.6) : 1;
      const temp = lerp(35, 20, cool);
      sheat = (temp - 20) / 15;
      vis.therm = span(u, 0, 0.04);
      set(E.therm, thermSvg(temp));
      vis.band = b >= 1 ? (b === 1 ? span(p, 0, 0.15) : 1) : 0;
      if (vis.band > 0.01) set(E.band, bandSvg(lerp(C.WARM, C.COLD, cool), b === 1 ? span(p, 0.4, 0.6) : 1));
    } else if (si === 5) {
      vis.unc = span(u, 0, 0.04);
      set(E.uncBase, uncBase());
      set(E.uncRes, uncRes(b === 2 ? span(p, 0.2, 0.5) : b === 3 ? 1 : 0));
      set(E.uncRd, uncRd(b === 0 ? span(p, 0.2, 0.6) : 1, b === 3 ? span(p, 0.1, 0.7) : 0));
    } else if (si === 6) {
      vis.grr = span(u, 0, 0.04);
      set(E.grrBase, grrBase(b === 0 ? span(p, 0.1, 0.9) : 1));
      set(E.grrRep, grrRep(b === 1 ? span(p, 0.1, 0.3) : 0));
      set(E.grrRepro, grrRepro(b === 2 ? span(p, 0.1, 0.3) : 0));
      set(E.grrVer, grrVer(b === 3 ? span(p, 0, 0.12) : 0, b === 3 ? span(p, 0.15, 0.6) : 0));
    } else if (si === 7) {
      // the head warms and creeps down (exaggerated); back in the morning the
      // mean sits on nominal; through the day it walks toward the limit
      let hour = 7;
      if (b === 0) { mach.heat = span(p, 0.05, 0.8); } else if (b === 1) { mach.heat = 1 - span(p, 0, 0.3); } else if (b === 3) { hour = lerp(7, 12, span(p, 0.05, 0.5)); mach.heat = (hour - 7) / 5; }
      mach.dz = -4 * mach.heat;
      vis.run = b === 0 ? 0 : b === 1 ? span(p, 0, 0.12) : 1;
      const cp = (C.TOL - meanDrift(hour)) / (3 * C.SIG);
      const cpTxt = Math.abs(cp - 1) < 0.005 ? dec(1, 1) : dec(cp, 2);
      set(E.runIn, runSvg(meanDrift, hour, true, b >= 2 ? `Cpk ${cpTxt}` : '', b === 1 ? span(p, 0.25, 0.5) : b === 3 ? 1 : 0));
    } else if (si === 8) {
      // the warm-up steps; then the probe measures the bore and the control corrects
      vis.warmc = b === 0 ? span(p, 0, 0.1) : 0;
      vis.run = b === 0 ? 0 : b === 1 ? span(p, 0, 0.12) : 1;
      set(E.warmc, warmSvg(b === 0 ? span(p, 0.1, 0.85) : 1));
      mach.heat = b === 0 ? 0.6 * span(p, 0.1, 0.85) : 0.6;
      if (b >= 1) {
        mach.tool = 'probe';
        const dive = b === 1 ? span(p, 0.2, 0.4) - span(p, 0.85, 1) : 0;
        const side = b === 1 ? Math.sin(Math.PI * span(p, 0.45, 0.8)) * 4.8 : 0;
        mach.dz = -7 * dive;
        mach.dx = side;
      }
      const until = b >= 2 ? lerp(7, 17, span(p, 0.05, 0.6)) : 7;
      const held = (hh) => 0.0007 * Math.sin((hh - 7) * 2.3);
      set(E.runIn, runSvg(held, until, true, b >= 2 ? `Cpk ${dec(1.56, 2)}` : '', 0));
    }

    renderMachine(clockS, mach);
    set(E.sHeat, shaftHeat(sheat));
    set(E.chatter, chatterSvg(chat));
    set(E.burr, burrSvg(burr));
    set(E.gauge, gauge ? gaugeSvg(gauge.z0, gauge.flipped, gauge.a) : '');
    move(E.ram, ramBy);
    move(E.car, [ramBy[0], 0, 0]);
    set(E.touch, touchSvg(touches, fit));
    for (const h of HUDS) { const a = vis[h] || 0; show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
