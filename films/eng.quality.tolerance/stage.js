// The stage of the film "Van maat tot spreiding / From dimension to spread": a
// pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants and the model's data), CAM (one camera move
// per scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, translateAlong, span, beatStarts, ring */
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
  const at = (p) => iso(p, P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'tl-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'tl-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'tl-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'tl-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const exTag = (x, y) => txt(x, y, EX, 21, 'end', 'tl-mute');
  const PANEL = () => rect(232, 12, 400, 376);
  // a bracket with end ticks: horizontal at y from x0 to x1
  const bracket = (x0, x1, y, cls = 'tl-accl') => `<path class="${cls}" d="M${f1(x0)} ${f1(y - 7)}L${f1(x0)} ${f1(y + 7)}M${f1(x0)} ${f1(y)}L${f1(x1)} ${f1(y)}M${f1(x1)} ${f1(y - 7)}L${f1(x1)} ${f1(y + 7)}"/>`;

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

  // ------------------------------------------------------------ the world
  const LX = (i) => 40 + (i - C.MID) * C.LW;
  // the parts in the rack: the first n of lanes (arrival order); the next part
  // falls into its place while fr runs 0..1; shift moves the whole stack (lanes)
  function partsSvg(lanes, n, fr) {
    const k = Math.min(lanes.length, Math.floor(n));
    const h = Array(C.LANES).fill(0);
    const placed = [];
    for (let i = 0; i < k; i++) placed.push([lanes[i], h[lanes[i]]++]);
    placed.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const one = (l, z) => `<g transform="${translateAlong(P, [LX(l), 0, z])}">${C.PART}</g>`;
    const stack = placed.map(([l, j]) => one(l, C.PZ0 + j * C.PITCH)).join('');
    let drop = '';
    if (k < lanes.length && fr > 0.02) {
      const l = lanes[k];
      const z1 = C.PZ0 + h[l] * C.PITCH;
      drop = `<g style="opacity:${Math.min(1, fr * 3).toFixed(2)}">${one(l, lerp(z1 + 40, z1, fr * fr))}</g>`;
    }
    return { stack, drop };
  }
  const countsOf = (lanes, n = lanes.length) => { const c = Array(C.LANES).fill(0); for (let i = 0; i < n; i++) c[lanes[i]]++; return c; };
  // chips curling off the insert while it cuts
  const rnd = (i) => { const s = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return s - Math.floor(s); };
  const KS = Math.hypot(...((a, b) => [b[0] - a[0], b[1] - a[1]])(at([0, 0, 0]), at([1, 0, 0])));
  function chipsSvg(clockS) {
    let out = '';
    for (let i = Math.max(0, Math.floor((clockS - 1) / 0.25)); i * 0.25 <= clockS; i++) {
      const age = clockS - i * 0.25;
      if (age > 1 || age < 0) continue;
      const a = rnd(i) * Math.PI;
      const [sx, sy] = at([-266 + 6 * age * Math.cos(a), C.LY - 4 - 10 * age, C.LZ - 2 - 18 * age * age + 4 * age * Math.sin(a)]);
      const sz = 0.9 * KS;
      out += `<path class="tl-acc" style="opacity:${(1 - age).toFixed(2)}" d="M${f2(sx - sz)} ${f2(sy)}Q${f2(sx)} ${f2(sy - sz * 1.4)} ${f2(sx + sz)} ${f2(sy)}Q${f2(sx)} ${f2(sy - sz * 0.5)} ${f2(sx - sz)} ${f2(sy)}Z"/>`;
    }
    return out;
  }
  // the knob's index mark at angle a (radians, 0 = up)
  function knobMark(a) {
    const { x, z, y, r } = C.KNOB;
    const yy = y + 3.7;
    const p0 = at([x + Math.sin(a) * r * 0.25, yy, z + Math.cos(a) * r * 0.25]);
    const p1 = at([x + Math.sin(a) * r * 0.85, yy, z + Math.cos(a) * r * 0.85]);
    return `<path class="tl-accl" style="stroke-width:${f2(0.8 * KS)}" d="${fmt([p0, p1])}"/>`;
  }
  // the bushes in the quarantine crate, seen as end rings on top
  function crateIn(n) {
    let out = '';
    const c = C.CRATE;
    for (let i = 0; i < n; i++) {
      const x = c.x + 6 + (i % 5) * 6;
      const y = c.y + 5 + Math.floor(i / 5) * 6;
      out += `<path class="tl-hollow" style="stroke-width:.8" d="${ring(x, y, 2.2, C.CRATE_H - 1.5, P, 14)}"/>`;
    }
    return out;
  }

  // ------------------------------------------------------------ the drawing (s1, s2)
  // asym: 0 the shaft Ø20 ±0,05, 1 the bush Ø12 +0,018/0
  function dwgIn() {
    return PANEL() + rect(244, 24, 376, 352, 'tl-sheet', 2) + exTag(608, 52);
  }
  function dNom(asym) {
    const a = 1 - asym;
    let out = `<path class="tl-line" style="stroke-width:1.8" d="M266 82L270 76L422 76L426 82L426 130L422 136L270 136L266 130Z"/>`;
    out += line(256, 106, 436, 106, 'tl-dash');
    out += op(asym, line(266, 92, 426, 92, 'tl-lim') + line(266, 120, 426, 120, 'tl-lim'));
    const y0 = lerp(76, 92, asym);
    const y1 = lerp(136, 120, asym);
    out += line(430, y0, 462, y0, 'tl-grid') + line(430, y1, 462, y1, 'tl-grid');
    out += `<path class="tl-line" style="stroke-width:1.4" d="M454 ${f1(y0)}L454 ${f1(y1)}M450 ${f1(y0 + 8)}L454 ${f1(y0)}L458 ${f1(y0 + 8)}M450 ${f1(y1 - 8)}L454 ${f1(y1)}L458 ${f1(y1 - 8)}"/>`;
    out += op(a, txt(466, 116, 'Ø20', 30, 'start', 'tl-big')) + op(asym, txt(466, 116, 'Ø12', 30, 'start', 'tl-big'));
    return out;
  }
  function dTol(asym) {
    return op(1 - asym, txt(532, 114, '±' + dec(0.05, 2), 24, 'start', 'tl-big'))
      + op(asym, txt(530, 102, '+' + dec(0.018, 3), 22, 'start', 'tl-big') + txt(530, 128, '0', 22, 'start', 'tl-big'));
  }
  // the spec line: the band between the limits, nominal tick and the labels
  function dSpec(asym, a = 1) {
    const sx = (v, lo, hi) => 266 + ((v - lo) / (hi - lo)) * 334;
    const L = lerp(sx(19.95, 19.94, 20.06), sx(12, 11.994, 12.024), asym);
    const R = lerp(sx(20.05, 19.94, 20.06), sx(12.018, 11.994, 12.024), asym);
    let out = line(266, 222, 600, 222);
    for (let i = 0; i <= 12; i++) out += line(266 + i * 27.83, 222, 266 + i * 27.83, i % 6 === 0 ? 232 : 228, 'tl-axis');
    out += `<rect class="tl-band" x="${f1(L)}" y="196" width="${f1(R - L)}" height="26"/>`;
    out += line(L, 182, L, 236, 'tl-line') + line(R, 182, R, 236, 'tl-line');
    out += txt(L, 174, 'LSL', 21, 'middle', 'tl-mute') + txt(R, 174, 'USL', 21, 'middle', 'tl-mute');
    out += op(1 - asym, txt(L, 260, dec(19.95, 2), 22, 'middle', 'tl-big') + txt(R, 260, dec(20.05, 2), 22, 'middle', 'tl-big') + txt(433, 260, dec(20, 2), 21, 'middle', 'tl-mono'));
    out += op(asym, txt(L, 260, dec(12, 3), 22, 'middle', 'tl-big') + txt(R, 260, dec(12.018, 3), 22, 'middle', 'tl-big'));
    return op(a, out);
  }
  function dStamp() {
    let out = rect(372, 280, 240, 88, 'tl-paper', 2);
    out += line(372, 306, 612, 306, 'tl-grid') + line(372, 336, 612, 336, 'tl-grid');
    out += txt(382, 300, tr('stempel · rev. B', 'title block · rev. B'), 21, 'start', 'tl-mute');
    out += txt(382, 329, tr('Algemene tolerantie', 'General tolerance'), 22, 'start', 'tl-txt');
    out += txt(382, 360, `ISO 2768-m ±${dec(0.2, 1)}`, 22, 'start', 'tl-big');
    return out;
  }
  // tighter costs: a bearing seat ±0,01 against a cover-plate hole ±0,2
  function dCost(a) {
    if (a <= 0.01) return '';
    let out = txt(266, 176, tr('lagerzitting', 'bearing seat'), 22) + txt(600, 176, `±${dec(0.01, 2)}`, 22, 'end', 'tl-big');
    out += `<rect class="tl-acc" x="${f1(440 - 5.5)}" y="186" width="11" height="14"/>` + line(330, 193, 550, 193, 'tl-grid');
    out += txt(266, 236, tr('afdekplaat', 'cover plate'), 22) + txt(600, 236, `±${dec(0.2, 1)}`, 22, 'end', 'tl-big');
    out += `<rect class="tl-band" x="330" y="246" width="220" height="14"/>` + line(330, 253, 550, 253, 'tl-grid');
    return op(a, out);
  }

  // ------------------------------------------------------------ out of spec (s3)
  const ox = (v) => 270 + ((v - 11.996) / 0.028) * 330;
  function oLine() {
    let out = PANEL() + exTag(620, 378);
    out += line(262, 140, 612, 140);
    out += `<rect class="tl-band" x="${f1(ox(12))}" y="80" width="${f1(ox(12.018) - ox(12))}" height="60"/>`;
    out += line(ox(12), 70, ox(12), 150, 'tl-line') + line(ox(12.018), 70, ox(12.018), 150, 'tl-line');
    out += txt(ox(12), 172, dec(12, 3), 22, 'middle', 'tl-big') + txt(ox(12.018), 172, dec(12.018, 3), 22, 'middle', 'tl-big');
    for (let i = 0; i < 40; i++) out += dot(ox(12.0025 + rnd(i + 3) * 0.0125), 92 + (i % 4) * 12 + rnd(i) * 4, 3.4, 'tl-hollow');
    return out;
  }
  function oOut(n) {
    let out = '';
    for (let i = 0; i < n; i++) out += dot(ox(12.021) - 10 + (i % 3) * 10, 128 - Math.floor(i / 3) * 12, 4.4, 'tl-acc');
    if (n >= 15) out += txt(612, 50, tr('15 van 500 = 3%', '15 of 500 = 3%'), 22, 'end', 'tl-big');
    return out;
  }
  function oForm(a) {
    if (a <= 0.01) return '';
    let out = rect(248, 196, 176, 178, 'tl-paper', 4);
    out += txt(262, 228, tr('DEVIATIE', 'DEVIATION'), 22, 'start', 'tl-big');
    out += `<path class="tl-grid" style="stroke-width:3" d="M262 252L404 252M262 270L384 270M262 288L398 288M262 306L370 306"/>`;
    out += txt(262, 342, tr('akkoord klant', 'customer OK'), 21, 'start', 'tl-mute');
    out += `<path class="tl-line" style="stroke-width:1.6" d="M262 360L410 360M330 352C340 340 350 362 360 348S380 344 392 352"/>`;
    return op(a, out);
  }
  function oCost(a, k) {
    if (a <= 0.01) return '';
    const full = 170;
    let out = txt(438, 222, 'machine', 21, 'start', 'tl-mute');
    out += `<rect class="fp-meter" x="438" y="232" width="${f1(full * (67.5 / 650))}" height="18" rx="3"/>` + txt(470, 248, `€${dec(67.5, 2)}`, 21, 'start', 'tl-big');
    out += txt(438, 300, tr('klant', 'customer'), 21, 'start', 'tl-mute');
    out += `<rect class="fp-meter" data-top="" x="438" y="310" width="${f1(full * lerp(67.5 / 650, 1, k))}" height="18" rx="3"/>`;
    out += op(k, txt(608, 356, '≈ × 10', 24, 'end', 'tl-on'));
    return op(a, out);
  }

  // ------------------------------------------------------------ the histogram (s4, s7, s8)
  // A narrower panel (stage x 312 on), so the rack stays in view beside it.
  const PANEL2 = () => rect(312, 12, 320, 376);
  const HX0 = 336;
  const HW = 276 / 19;
  const hx = (l) => HX0 + (l + 0.5) * HW;
  const HB = 300;
  const phi = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  // m: mean lane, s: sigma in lanes, n: parts, hu: px per part
  const curveH = (l, m, s, n, hu) => (n / s) * phi((l - m) / s) * hu;
  const lx = (x) => clamp(x, 350, 598);
  function hBase(counts, shift, specL, specR, labels, hu, title) {
    let out = PANEL2() + exTag(620, 44) + (title || txt(326, 44, tr('histogram', 'histogram'), 22, 'start', 'tl-mute'));
    out += line(HX0, 70, HX0, HB) + line(HX0, HB, HX0 + 276, HB);
    let bars = '';
    counts.forEach((c, l) => { if (c) bars += `<rect class="tl-bar" x="${f1(hx(l) - HW / 2 + 1)}" y="${f1(HB - c * hu)}" width="${f1(HW - 2)}" height="${f1(c * hu)}"/>`; });
    out += shift ? `<g transform="translate(${f1(shift * HW)} 0)">${bars}</g>` : bars;
    out += line(hx(specL), 64, hx(specL), HB + 6, 'tl-lim') + line(hx(specR), 64, hx(specR), HB + 6, 'tl-lim');
    out += txt(lx(hx(specL)), 354, labels[0], 22, 'middle', 'tl-big') + txt(lx(hx(specR)), 354, labels[1], 22, 'middle', 'tl-big');
    out += txt(lx(hx(specL)), 378, 'LSL', 21, 'middle', 'tl-mute') + txt(lx(hx(specR)), 378, 'USL', 21, 'middle', 'tl-mute');
    return out;
  }
  function hCurve(m, s, n, hu, band) {
    const pts = [];
    for (let i = -40; i <= 40; i++) { const l = m + (i / 10) * s; if (l >= -0.5 && l <= 18.5) pts.push([hx(l), HB - curveH(l, m, s, n, hu)]); }
    let out = '';
    if (band > 0.01) {
      // the ±3σ band; its limits are in the readout of the beat
      out += op(band, `<rect class="tl-band" x="${f1(hx(m - 3 * s))}" y="70" width="${f1(6 * s * HW)}" height="${HB - 70}"/>`
        + txt(hx(m), 94, '±3σ', 21, 'middle', 'tl-big'));
    }
    return out + `<path class="tl-line" d="${fmt(pts)}"/>`;
  }
  function hMean(m, label, top = 76) {
    return line(hx(m), top, hx(m), HB, 'tl-line') + txt(hx(m), 326, label, 22, 'middle', 'tl-big');
  }
  function hSig(m, s, n, hu, label) {
    const y = HB - curveH(m + s, m, s, n, hu);
    return bracket(hx(m), hx(m + s), y) + txt(hx(m + s) + 10, y + 8, label, 22, 'start', 'tl-big');
  }
  // Cp: the tolerance width against six sigma, each bracket labelled above it
  function hCp(m, s, specL, specR, a) {
    if (a <= 0.01) return '';
    let out = bracket(hx(specL), hx(specR), 100) + txt((hx(specL) + hx(specR)) / 2, 88, `${tr('tolerantie', 'tolerance')} ${dec(0.04, 3)}`, 21, 'middle', 'tl-big');
    out += bracket(hx(m - 3 * s), hx(m + 3 * s), 146) + txt(hx(m), 134, `6σ ${dec(0.024, 3)}`, 21, 'middle', 'tl-big');
    return op(a, out);
  }
  // Cpk: the mean to the nearest limit against three sigma
  function hCpk(m, s, specR, a, distText) {
    if (a <= 0.01) return '';
    let out = bracket(hx(m), hx(specR), 100) + txt((hx(m) + hx(specR)) / 2, 88, distText, 21, 'middle', 'tl-big');
    out += bracket(hx(m), hx(m + 3 * s), 146) + txt(hx(m) + 4, 134, `3σ ${dec(0.012, 3)}`, 21, 'start', 'tl-big');
    return op(a, out);
  }
  function hPpm(a) {
    if (a <= 0.01) return '';
    const row = (y, c, ppm, hi) => (hi ? rect(330, y - 24, 286, 34, 'tl-accf', 4) : '') + txt(340, y, `Cpk ${c}`, 22, 'start', hi ? 'tl-on' : 'tl-big') + txt(606, y, ppm, 22, 'end', hi ? 'tl-on' : 'tl-txt');
    return op(a, rect(322, 54, 300, 136, 'tl-panel', 6) + row(88, dec(1.67, 2), '< 1 ppm') + row(126, dec(1.33, 2), '≈ 63 ppm', true) + row(164, dec(1, 1), `≈ ${NL ? '2.700' : '2,700'} ppm`));
  }

  // ------------------------------------------------------------ the run chart (s5)
  const ry = (v) => 300 - ((v - 19.99) / 0.04) * 220;
  const THU = [0.0006, -0.0012, 0.0015, -0.0004, 0.0019, -0.0016, 0.0003, -0.0008, 0.0011, -0.0002];
  function rBase(n) {
    let out = PANEL2() + exTag(620, 44) + txt(326, 44, tr('gem. per uur', 'mean per hour'), 22, 'start', 'tl-mute');
    out += line(336, 70, 336, 300) + line(336, 300, 612, 300) + line(500, 80, 500, 300, 'tl-grid');
    out += txt(418, 326, tr('donderdag', 'Thursday'), 21, 'middle', 'tl-mute') + txt(560, 326, tr('maandag', 'Monday'), 21, 'middle', 'tl-mute');
    const pts = THU.slice(0, n).map((d, i) => [352 + i * 14.6, ry(C.V.mean + d)]);
    if (pts.length > 1) out += `<path class="tl-line" style="stroke-width:1.5" d="${fmt(pts)}"/>`;
    out += pts.map(([x, y]) => dot(x, y, 4.2)).join('');
    return out;
  }
  function rCom(a, words = a) {
    if (a <= 0.01) return '';
    return op(a, `<rect class="tl-band" x="344" y="${f1(ry(C.V.mean + 0.003))}" width="148" height="${f1(ry(C.V.mean - 0.003) - ry(C.V.mean + 0.003))}"/>`
      + txt(492, ry(C.V.mean + 0.003) - 8, dec(C.V.mean, 3), 21, 'end', 'tl-big')
      + op(words, txt(346, 96, tr('materiaal, warmte,', 'material, heat,'), 21, 'start', 'tl-mute') + txt(346, 120, tr('speling, operator', 'play, operator'), 21, 'start', 'tl-mute')));
  }
  function rJump(k, fix) {
    let out = '';
    const pts = [[518, ry(20.025)], [566, ry(20.005)], [604, ry(20.003)]].slice(0, Math.max(0, Math.ceil(k * 3)));
    if (pts.length > 1) out += `<path class="tl-line" style="stroke-width:1.5" d="${fmt(pts)}"/>`;
    pts.forEach(([x, y], i) => { out += dot(x, y, i === 0 ? 7 : 4.2, i === 0 ? 'tl-acc' : 'tl-dot'); });
    if (pts.length) out += txt(530, ry(20.025) - 16, dec(20.025, 3), 22, 'middle', 'tl-big') + txt(518, 352, '6:00', 21, 'middle', 'tl-mono');
    if (pts.length > 1) out += txt(574, ry(20.005) + 32, dec(20.005, 3), 21, 'middle', 'tl-big') + txt(578, 352, '7:00', 21, 'middle', 'tl-mono');
    out += op(fix, txt(620, 378, tr('opwarmen 20 min', 'warm-up 20 min'), 21, 'end', 'tl-on'));
    return out;
  }

  // ------------------------------------------------------------ tampering: the spread meter (s6)
  function tampSvg(k) {
    let out = rect(372, 14, 260, 156);
    out += txt(386, 46, tr('spreiding', 'spread'), 21, 'start', 'tl-mute') + exTag(620, 46);
    out += txt(386, 80, tr('met rust', 'left alone'), 21, 'start', 'tl-txt') + `<rect class="fp-meter" x="500" y="64" width="80" height="18" rx="3"/>`;
    out += txt(386, 120, tr('bijgesteld', 'adjusted'), 21, 'start', 'tl-txt') + `<rect class="fp-meter" data-top="" x="500" y="104" width="${f1(80 * lerp(1, 1.4, k))}" height="18" rx="3"/>`;
    out += op(k, txt(616, 156, '≈ +40%', 22, 'end', 'tl-on'));
    return out;
  }

  // ------------------------------------------------------------ short term against overall (s9)
  const HOURS = [-1.4, -0.4, 0.5, 1.3, 0.1];
  const px = (v) => 474 + v * 20; // v in short-term sigmas
  function pBase(n) {
    let out = PANEL2() + exTag(620, 44);
    out += line(336, 300, 612, 300) + line(px(-6.5), 70, px(-6.5), 306, 'tl-lim') + line(px(6.5), 70, px(6.5), 306, 'tl-lim');
    out += txt(px(-6.5), 324, 'LSL', 21, 'middle', 'tl-mute') + txt(px(6.5), 324, 'USL', 21, 'middle', 'tl-mute');
    HOURS.slice(0, Math.ceil(n)).forEach((m, i) => {
      const a = i < Math.floor(n) ? 1 : n - Math.floor(n);
      const pts = [];
      for (let j = -30; j <= 30; j++) { const v = m + j / 10; pts.push([px(v), 300 - 150 * Math.exp(-((j / 10) ** 2) / 2)]); }
      out += op(a, `<path class="tl-line" style="stroke-width:1.4;opacity:.75" d="${fmt(pts)}"/>`);
    });
    out += txt(326, 352, tr('per uur: Cp, Cpk', 'per hour: Cp, Cpk'), 22, 'start', 'tl-txt');
    return out;
  }
  function pTot(a) {
    if (a <= 0.01) return '';
    const mm = HOURS.reduce((x, y) => x + y, 0) / HOURS.length;
    const st = Math.sqrt(1 + HOURS.reduce((x, y) => x + (y - mm) ** 2, 0) / HOURS.length);
    const pts = [];
    for (let j = -32; j <= 32; j++) { const v = mm + (j / 10) * st; pts.push([px(v), 300 - (150 / st) * Math.exp(-((j / 10) ** 2) / 2)]); }
    return op(a, `<path class="tl-accl" d="${fmt(pts)}"/>` + txt(326, 378, tr('alles samen: Ppk', 'all together: Ppk'), 22, 'start', 'tl-on'));
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['dwg', 'out', 'hist', 'run', 'tamp', 'ppk'];
  const S4 = C.S4;
  const S7 = C.S7;
  const m4 = C.MID + (C.V.mean - 20) / C.BIN4;
  const s4 = C.V.sd / C.BIN4;
  const m7 = C.MID + (C.CAP.mean - 30.02) / C.BIN7;
  const s7 = C.CAP.sd / C.BIN7;
  const lab4 = [dec(19.95, 2), dec(20.05, 2)];
  const HU4 = 15.5;
  const HU7 = 10;
  const lab7 = [dec(30, 3), dec(30.04, 3)];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let gate = C.GATE4;
    let lanes = [];
    let n = 0;
    let fr = 0;
    let shift = 0;
    let chips = false;
    let crateN = 0;
    let knobA = 0;
    let micro = 0;

    if (si === 0 || si === 1) {
      vis.dwg = si === 0 ? span(u, 0.04, 0.12) : 1;
      set(E.dwgIn, dwgIn());
      const asym = si === 0 && b === 3 ? span(p, 0.05, 0.35) : 0;
      set(E.dNom, dNom(asym));
      set(E.dTol, dTol(asym));
      const cost = si === 1 && b >= 2 ? (b === 2 ? span(p, 0.05, 0.25) : 1) : 0;
      set(E.dSpec, dSpec(asym, 1 - cost));
      set(E.dStamp, dStamp());
      set(E.dCost, dCost(cost));
    } else if (si === 2) {
      vis.out = span(u, 0, 0.05);
      set(E.oLine, oLine());
      set(E.oOut, oOut(b === 0 ? Math.round(span(p, 0.2, 0.8) * 15) : 15));
      set(E.oForm, oForm(b >= 2 ? (b === 2 ? span(p, 0.05, 0.25) : 1) : 0));
      set(E.oCost, oCost(b === 3 ? span(p, 0.03, 0.15) : 0, b === 3 ? span(p, 0.25, 0.7) : 0));
      crateN = b < 1 ? 0 : b === 1 ? Math.round(span(p, 0.1, 0.8) * 15) : 15;
    } else if (si === 3) {
      lanes = S4;
      chips = b === 0;
      const k = b === 0 ? span(p, 0.03, 0.97) * S4.length : S4.length;
      n = Math.floor(k);
      fr = k - n;
      micro = b === 0 ? Math.sin(Math.PI * ((clockS * 1.3) % 1)) : 0;
      vis.hist = b >= 1 ? (b === 1 ? span(p, 0, 0.12) : 1) : 0;
      if (vis.hist > 0.01) {
        const counts = countsOf(S4);
        set(E.hBase, hBase(counts, 0, C.MID - C.GATE4, C.MID + C.GATE4, lab4, HU4));
        set(E.hMean, hMean(m4, dec(C.V.mean, 3), 104));
        set(E.hSig, b >= 2 ? op(b === 2 ? span(p, 0.1, 0.3) : 1, hSig(m4, s4, S4.length, HU4, `σ ${dec(C.V.sd, 3)}`)) : '');
        set(E.hCurve, b >= 3 ? op(span(p, 0.05, 0.25), hCurve(m4, s4, S4.length, HU4, span(p, 0.4, 0.6))) : '');
        set(E.hCp, '');
        set(E.hCpk, '');
        set(E.hPpm, '');
      }
    } else if (si === 4) {
      lanes = S4;
      n = S4.length;
      vis.run = span(u, 0, 0.05);
      set(E.rBase, rBase(b === 0 ? 2 + span(p, 0.05, 0.6) * 8 : THU.length));
      set(E.rCom, rCom(b <= 1 ? (b === 0 ? span(p, 0.4, 0.6) : 1) : 0.35, b <= 1 ? (b === 0 ? span(p, 0.4, 0.6) : 1) : b === 2 ? 0.35 * (1 - span(p, 0, 0.15)) : 0));
      set(E.rJump, b >= 2 ? rJump(b === 2 ? span(p, 0.15, 0.8) : 1, b === 3 ? span(p, 0.3, 0.5) : 0) : '');
    } else if (si === 5) {
      // tampering: the knob jumps after every part; the stacks refill wider
      chips = b <= 1;
      const part = Math.floor(clockS / 0.9);
      knobA = b <= 1 ? clamp(rnd(part + 5) * 2 - 1, -1, 1) * 1.6 : 0;
      if (b === 0) { lanes = S4; n = S4.length; } else {
        lanes = C.TAMP;
        const k = b === 1 ? span(p, 0.05, 0.98) * C.TAMP.length : C.TAMP.length;
        n = Math.floor(k);
        fr = k - n;
      }
      vis.tamp = b >= 2 ? (b === 2 ? span(p, 0, 0.12) : 1) : 0;
      if (vis.tamp > 0.01) set(E.tamp, tampSvg(b === 2 ? span(p, 0.15, 0.6) : 1));
    } else if (si === 6 || si === 7) {
      lanes = S7;
      if (si === 6) {
        gate = lerp(C.GATE4, C.GATE7, b === 0 ? span(p, 0.1, 0.5) : 1);
        const k = b === 0 ? span(p, 0.45, 1) * 18 : b === 1 ? 18 + span(p, 0, 0.95) * (S7.length - 18) : S7.length;
        n = Math.floor(k);
        fr = k - n;
        vis.hist = b >= 1 ? (b === 1 ? span(p, 0.5, 0.65) : 1) : 0;
      } else {
        gate = C.GATE7;
        n = S7.length;
        vis.hist = 1;
        shift = b >= 2 ? -2 * (b === 2 ? span(p, 0.1, 0.45) : 1) : 0;
        knobA = b === 2 ? -1.2 * span(p, 0.1, 0.45) : b === 3 ? -1.2 : 0;
      }
      if (vis.hist > 0.01) {
        const counts = countsOf(S7);
        const m = m7 + shift;
        const moved = si === 7 && shift < -1.99;
        const big = (t) => txt(326, 46, t, 26, 'start', 'tl-big');
        const title = si === 6 ? (b >= 2 ? big(`Cp ${dec(1.67, 2)}`) : null) : big(`Cpk ${moved ? dec(1.67, 2) : dec(1.17, 2)}`);
        set(E.hBase, hBase(counts, shift, C.MID - C.GATE7, C.MID + C.GATE7, lab7, HU7, title));
        set(E.hMean, hMean(m, dec(moved ? 30.02 : C.CAP.mean, 3), 158));
        set(E.hSig, '');
        set(E.hCurve, hCurve(m, s7, S7.length, HU7, 0));
        if (si === 6) {
          set(E.hCp, hCp(m, s7, C.MID - C.GATE7, C.MID + C.GATE7, b >= 2 ? (b === 2 ? span(p, 0.1, 0.3) : 1) : 0));
          set(E.hCpk, '');
          set(E.hPpm, '');
        } else {
          set(E.hCp, '');
          set(E.hCpk, hCpk(m, s7, C.MID + C.GATE7, b === 3 ? 1 - span(p, 0, 0.12) : b === 0 ? span(p, 0.1, 0.3) : 1, moved ? dec(0.02, 3) : dec(0.014, 3)));
          set(E.hPpm, b === 3 ? hPpm(span(p, 0.08, 0.2)) : '');
        }
      }
    } else if (si === 8) {
      lanes = S7;
      n = S7.length;
      gate = C.GATE7;
      shift = -2;
      knobA = -1.2;
      vis.ppk = span(u, 0, 0.05);
      set(E.pBase, pBase(b === 0 ? 1 + span(p, 0.1, 0.8) * 4 : 5));
      set(E.pTot, b >= 1 ? pTot(b === 1 ? span(p, 0.1, 0.35) : 1) : '');
    }

    // world parts
    const pr = partsSvg(lanes, n, fr);
    set(E.parts, shift ? `<g transform="${translateAlong(P, [shift * C.LW, 0, 0])}">${pr.stack}</g>` : pr.stack);
    set(E.drop, pr.drop);
    move(E.gateL, [-gate * C.LW, 0, 0]);
    move(E.gateR, [gate * C.LW, 0, 0]);
    set(E.chips, chips ? chipsSvg(clockS) : '');
    set(E.knobMark, knobMark(knobA));
    move(E.spindle, [-2.4 * micro, 0, 0]);
    set(E.crateIn, crateIn(crateN));
    flag(E.lamp0, 'data-lit', true);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
