// The stage of the film "De spuitgietmachine / The moulding machine": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope), a preamble from build.mjs that defines P (projection),
// C (world constants, the model, the beat cameras), W and H, and the kit's
// audio warp.
//
// Each scene is a row of beats; the beat on screen (and how far through it)
// comes from the caption beat starts, so a move lands on the line that names
// it. The press cut open along its axis is the world (one camera framing per
// beat); the cards over it are drawn in stage space.
/* global P, C, W, H, iso, pathOf, translateAlong, span, beatStarts, warpU, introBeat, introCamera */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tx = (nl, en) => (EN ? en : nl);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const num = (v, dec = 0) => {
    const [i, d] = Math.abs(v).toFixed(dec).split('.');
    const grouped = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.') : i;
    return (v < 0 ? '−' : '') + grouped + (d ? (EN ? '.' : ',') + d : '');
  };
  const at = (p) => iso(p, P);
  const sp = (x, z) => at([x, 0, z]);
  const poly = (pts, closed = true) => pathOf(pts.map(([x, z]) => sp(x, z)), closed);
  const rect = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const attr = (e, name, v) => { if (e['__' + name] !== v) { e.setAttribute(name, v); e['__' + name] = v; } };
  const move = (e, by) => attr(e, 'transform', translateAlong(P, by));
  const fade = (e, a) => { const v = String(Math.round(clamp(a, 0, 1) * 100) / 100); if (e.style.opacity !== v) e.style.opacity = v; };
  const M = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
  const mark = (d, cls = 'fp-mark', extra = '') => `<path class="${cls}" d="${d}"${extra}/>`;
  // stage-space text and shapes (cards); sizes are stage units, 640 wide
  const T = (x, y, text, size = 21, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink fp-tx ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
  const card = (x, y, w, h, r = 12) => `<rect class="fp-hud-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fp-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const R = (x, y, w, h, cls, rx = 3) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${rx}"/>`;
  const head = (x0, y0, x1, y1, len) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    return `M${f1(x1 - ux * len - uy * len * 0.55)} ${f1(y1 - uy * len + ux * len * 0.55)}L${f1(x1)} ${f1(y1)}L${f1(x1 - ux * len + uy * len * 0.55)} ${f1(y1 - uy * len - ux * len * 0.55)}`;
  };
  const arrow = (x0, y0, x1, y1, len = 9, cls = 'fp-arrow') => mark(`M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head(x0, y0, x1, y1, len)}`, cls);
  // world-space arrows and dimension lines in the section plane; heads keep their stage size
  let camW = W;
  const wArrow = (a, b, cls = 'fp-arrow') => { const [x0, y0] = sp(a[0], a[1]); const [x1, y1] = sp(b[0], b[1]); return arrow(x0, y0, x1, y1, (9 * camW) / W, cls); };
  const dim = (xa, xb, z, tick = 10) => {
    const a = sp(xa, z);
    const b = sp(xb, z);
    const len = (8 * camW) / W;
    return mark(M([a, b]) + head(b[0], b[1], a[0], a[1], len) + head(a[0], a[1], b[0], b[1], len), 'fp-arrow')
      + mark(M([sp(xa, z - tick), sp(xa, z + tick)]) + M([sp(xb, z - tick), sp(xb, z + tick)]), 'fp-arrow');
  };

  // ------------------------------------------------------------ the screw in section
  const { BORE, ZONES, TIP0, STROKE, SPRUE, GATEN, CAV, PL, OPEN } = C;
  const PITCH = 26;
  const rootAt = (d) => (d < ZONES.meter ? 12.5 : d < ZONES.comp ? lerp(12.5, 7, (d - ZONES.meter) / (ZONES.comp - ZONES.meter)) : 7);
  const PEL = (() => { let s = 11; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); return Array.from({ length: 70 }, () => [r(), r()]); })();
  function screwSvg(xt, rot, open) {
    const r = BORE.r;
    let out = '';
    const xMelt = xt - ZONES.meter - 10;
    const xSoft = xt - ZONES.comp;
    out += `<path class="fp-melt" d="${poly(rect(Math.max(BORE.x0, xMelt), BORE.x1 + 0.2, -r, r))}"/>`;
    if (xSoft < xMelt) out += `<path class="fp-melt" style="opacity:.45" d="${poly(rect(Math.max(BORE.x0, xSoft), xMelt, -r, r))}"/>`;
    // pellets in the feed zone, between the root and the bore
    const pel = [];
    const span0 = Math.max(0, xSoft - BORE.x0);
    for (const [a, b] of PEL) {
      const x = BORE.x0 + a * span0;
      const z = (b < 0.5 ? 1 : -1) * (8.6 + (b % 0.5) * 12);
      pel.push(sp(x, z));
    }
    out += `<g class="fp-pellet">${pel.map(([x, y]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.2"/>`).join('')}</g>`;
    // the root: shallow at the front (metering), tapered (compression), deep at the back (feed)
    const top = [];
    for (let d = 30; d <= ZONES.end; d += 6) top.push([xt - d, rootAt(d)]);
    out += `<path class="fp-screw" d="${poly([...top, ...top.slice().reverse().map(([x, z]) => [x, -z])])}"/>`;
    // flights: a turning helix cut along its axis, from the root to the bore
    const frac = ((rot % 1) + 1) % 1;
    const fl = [];
    for (let j = -1; j < 14; j++) {
      const t = xt - 44 - j * PITCH + frac * PITCH;
      const b = t - PITCH / 2;
      for (const [x, sgn] of [[t, 1], [b, -1]]) {
        const d = xt - x;
        if (d > 38 && d < ZONES.end) { const z0 = rootAt(d) - 0.3; fl.push([[x - 4, sgn * z0], [x + 1, sgn * z0], [x + 4, sgn * (r - 0.5)], [x - 1, sgn * (r - 0.5)]]); }
      }
    }
    out += fl.map((p) => `<path class="fp-screw" d="${poly(p)}"/>`).join('');
    // seat, neck and tip
    out += `<path class="fp-screw" d="${poly([[xt - 30, -14.5], [xt - 24, -14.5], [xt - 24, 14.5], [xt - 30, 14.5]])}"/>`;
    out += `<path class="fp-screw" d="${poly(rect(xt - 25, xt - 13, -5, 5))}"/>`;
    out += `<path class="fp-screw" d="${poly([[xt - 14, -8.5], [xt, 0], [xt - 14, 8.5]])}"/>`;
    // the check ring slides between the seat (closed) and the tip (open)
    const o = 5 * open;
    for (const sgn of [1, -1]) out += `<path class="fp-steel" d="${poly([[xt - 24 + o, sgn * 6], [xt - 17 + o, sgn * 6], [xt - 17 + o, sgn * (r - 0.4)], [xt - 24 + o, sgn * (r - 0.4)]])}"/>`;
    return out;
  }
  function zoneSvg(xt, a, b) {
    const x1 = Math.min(BORE.x1, xt - a);
    const x0 = Math.max(BORE.x0, xt - b);
    return x1 > x0 ? `<path class="fp-zone" d="${poly(rect(x0, x1, -BORE.r + 0.6, BORE.r - 0.6))}"/>` : '';
  }

  // ------------------------------------------------------------ the melt in the mould (the part, with its sprue)
  const PLATE = CAV.h;
  const PATH = CAV.h + CAV.skirt;
  const SPRUE_SHARE = 0.12;
  const sprueR = (x) => SPRUE.r0 + ((x - SPRUE.x0) / (SPRUE.x1 - SPRUE.x0)) * (SPRUE.r1 - SPRUE.r0);
  function partSvg(F, solid, flash) {
    if (F <= 0) return '';
    let melt = '';
    let front = '';
    const xs = SPRUE.x0;
    if (F <= SPRUE_SHARE) {
      const xf = lerp(xs, GATEN.x1, F / SPRUE_SHARE);
      const xe = Math.min(xf, SPRUE.x1);
      melt += poly([[xs, -SPRUE.r0], [xe, -sprueR(xe)], [xe, sprueR(xe)], [xs, SPRUE.r0]]);
      if (xf > SPRUE.x1) melt += poly(rect(SPRUE.x1, xf, -GATEN.r, GATEN.r));
      return `<path class="fp-melt" d="${melt}"/>`;
    }
    melt += poly([[xs, -SPRUE.r0], [SPRUE.x1, -SPRUE.r1], [SPRUE.x1, SPRUE.r1], [xs, SPRUE.r0]]);
    melt += poly([[SPRUE.x1, -SPRUE.r1], [GATEN.x0 + 2, -GATEN.r], [GATEN.x1, -GATEN.r], [GATEN.x1, GATEN.r], [GATEN.x0 + 2, GATEN.r], [SPRUE.x1, SPRUE.r1]]);
    const l = ((F - SPRUE_SHARE) / (1 - SPRUE_SHARE)) * PATH;
    const zp = Math.min(l, PLATE);
    melt += poly(rect(CAV.x0, CAV.x1, -zp, zp));
    const fr = [];
    if (l < PLATE - 0.5) {
      for (const sgn of [1, -1]) fr.push(M([sp(CAV.x0, sgn * (zp - 2.5)), sp((CAV.x0 + CAV.x1) / 2, sgn * (zp + 1.2)), sp(CAV.x1, sgn * (zp - 2.5))]));
    } else {
      const xk = PL + Math.min(CAV.skirt, l - PLATE);
      for (const sgn of [1, -1]) {
        melt += poly(rect(PL - 0.2, xk, sgn > 0 ? CAV.h - CAV.t : -CAV.h, sgn > 0 ? CAV.h : -CAV.h + CAV.t));
        if (l < PATH - 0.3) fr.push(M([sp(xk - 2.5, sgn * (CAV.h - CAV.t)), sp(xk + 1.2, sgn * (CAV.h - CAV.t / 2)), sp(xk - 2.5, sgn * CAV.h)]));
      }
    }
    if (flash > 0) for (const sgn of [1, -1]) melt += poly(rect(PL - 0.6, PL + 0.8, sgn > 0 ? CAV.h : -CAV.h - 26 * flash, sgn > 0 ? CAV.h + 26 * flash : -CAV.h));
    front = fr.length ? mark(fr.join('')) : '';
    const so = solid > 0 ? `<path class="fp-solid" style="opacity:${(0.85 * solid).toFixed(2)}" d="${melt}"/>` : '';
    return `<path class="fp-melt" d="${melt}"/>${so}${front}`;
  }
  // holding pressure: arrows push melt in through the gate
  const packSvg = (a) => (a > 0 ? `<g style="opacity:${a.toFixed(2)}">${[1, -1].map((sgn) => wArrow([CAV.x1 + 9, sgn * 6], [CAV.x1 + 9, sgn * 40])).join('')}${wArrow([-4, 0], [26, 0])}</g>` : '');
  // the melt pressure in the cavity pushes both halves apart
  const pressSvg = () => [-42, -14, 14, 42].map((z) => wArrow([CAV.x0 + 2, z], [CAV.x0 - 22, z]) + wArrow([CAV.x1 - 2, z], [CAV.x1 + 22, z])).join('');
  // the clamp force: the ram pushes the moving platen against the mould
  const forceSvg = (o) => [118, -118].map((z) => wArrow([C.MPL[1] + 110 + o, z], [C.MPL[1] + 12 + o, z])).join('');

  // ------------------------------------------------------------ cards
  const CX = 380; // left edge of the right-hand cards
  const CWD = 250;
  function shadowCard(kb) {
    const sc = 5.6; // px per cm
    const wcm = C.HOUSING.w;
    const dcm = C.HOUSING.d;
    const x0 = CX + 20;
    const y0 = 98;
    const one = (x) => {
      const hatch = [];
      for (let c = -dcm * sc; c < wcm * sc; c += 9) {
        const a = Math.max(0, c);
        const b = Math.min(wcm * sc, c + dcm * sc);
        if (b - a > 1) hatch.push(`M${f1(x + a)} ${f1(y0 + dcm * sc - (a - c))}L${f1(x + b)} ${f1(y0 + dcm * sc - (b - c))}`);
      }
      return R(x, y0, wcm * sc, dcm * sc, 'fp-shape', 4) + mark(hatch.join(''), 'fp-hatchc');
    };
    let s = card(CX, 56, CWD, 330) + T(CX + CWD / 2, 84, tx('gezien vanuit de pers', 'seen from the press'), 20, 'middle', 'fp-small');
    s += one(x0);
    s += T(x0 + (wcm * sc) / 2, y0 + dcm * sc + 26, `${C.HOUSING.w} cm`, 20) + T(x0 + wcm * sc + 8, y0 + (dcm * sc) / 2 + 7, `${C.HOUSING.d}`, 20, 'start');
    if (kb >= 2) s += one(x0 + wcm * sc + 50);
    s += T(CX + CWD / 2, 270, `${num(C.AREA)} cm²${kb >= 2 ? ' × 2' : ''}`, 23, 'middle', 'fp-big');
    if (kb >= 2) {
      s += T(CX + CWD / 2, 308, `× ${num(C.HOUSING.p, 1)} t/cm²`, 21);
      s += T(CX + CWD / 2, 354, `= ${num(C.AREA * C.HOUSING.cav * C.HOUSING.p)} t`, 26, 'middle', 'fp-big');
    }
    return s;
  }
  function rulerCard(sNow) {
    const x0 = CX + 22;
    const x1 = CX + CWD - 22;
    const y = 70;
    const xs = (s) => lerp(x0, x1, s / C.STROKE);
    let s = card(CX, 14, CWD, 112) + T(CX + CWD / 2, 42, tx('doseerslag', 'dosing stroke'), 20, 'middle', 'fp-small');
    s += mark(M([[x0, y], [x1, y]]));
    s += mark([0, 15, 30, 45, 60].map((v) => M([[xs(v), y - 6], [xs(v), y + 6]])).join(''));
    s += R(x0, y - 5, xs(sNow) - x0, 10, 'fp-meter', 2);
    s += T(x0, y + 32, '0', 20) + T(x1, y + 32, `${C.STROKE} mm`, 20, 'end');
    return s;
  }
  function resCard(kb, p) {
    const n = kb >= 2 ? C.SCREW.barrel / C.SCREW.small : C.SCREW.barrel / C.SCREW.shot;
    const total = n * C.SCREW.cycle;
    const x0 = CX + 18;
    const x1 = CX + CWD - 18;
    const y = 180;
    let s = card(CX, 140, CWD, 246) + T(CX + CWD / 2, 168, `${num(C.SCREW.barrel)} g ÷ ${kb >= 2 ? C.SCREW.small : C.SCREW.shot} g = ${n}`, 21, 'middle', 'fp-big');
    // the barrel holding n shots; the oldest shot (front) leaves as the clock runs
    s += R(x0, y, x1 - x0, 34, 'fp-shape', 8);
    const w = (x1 - x0 - 8) / n;
    const pos = clamp(p / 0.7, 0, 1) * n;
    for (let i = 0; i < n; i++) {
      const xa = x0 + 4 + i * w;
      s += R(xa + 1.5, y + 5, w - 3, 24, i === n - 1 - Math.floor(Math.min(n - 1e-6, pos)) ? 'fp-meter' : 'fp-meter2', 3);
    }
    // the pellet's clock
    const sec = Math.round(clamp(p / 0.7, 0, 1) * total);
    s += T(CX + CWD / 2, 262, `${n} × ${C.SCREW.cycle} s`, 21);
    s += T(CX + CWD / 2, 310, `${num(sec)} s`, 34, 'middle', 'fp-big');
    if (kb >= 2) {
      const lim = C.SCREW.limitMin * 60;
      s += T(CX + CWD / 2, 350, tx(`datablad: max ${num(lim)} s`, `data sheet: max ${num(lim)} s`), 20, 'middle', 'fp-small');
    } else s += T(CX + CWD / 2, 350, tx('zo lang heet in de cilinder', 'this long hot in the barrel'), 20, 'middle', 'fp-small');
    return s;
  }
  const tick = (x, y) => mark(`M${f1(x)} ${f1(y)}l6 6l12 -14`, 'fp-arrow');
  const cross = (x, y) => mark(`M${f1(x)} ${f1(y - 7)}l14 14M${f1(x + 14)} ${f1(y - 7)}l-14 14`, 'fp-arrow');
  function checkCard(kb) {
    const y0 = 10;
    let base = card(CX, y0, CWD, 380);
    const row = (y) => mark(M([[CX + 12, y], [CX + CWD - 12, y]]), 'fp-dash');
    base += row(92) + row(146) + row(304);
    set(E.checkBase, base);
    set(E.ckForce, T(CX + 16, 42, tx('1 · sluitkracht', '1 · clamp force'), 21, 'start')
      + T(CX + 16, 76, `${num(C.CLAMP.area * C.CLAMP.p)} t → ${Math.round(C.CLAMP.area * C.CLAMP.p * (1 + C.CLAMP.margin))} t`, 21, 'start', 'fp-big') + tick(CX + CWD - 40, 64));
    set(E.ckShot, kb >= 1 ? T(CX + 16, 126, tx(`2 · shot ${C.CLAMP.shot} cm³`, `2 · shot ${C.CLAMP.shot} cm³`), 21, 'start') : '');
    let u = '';
    if (kb >= 2) {
      const bx0 = CX + 64;
      const bx1 = CX + CWD - 18;
      const bx = (v) => lerp(bx0, bx1, v / 100);
      u += R(bx(20), 160, bx(80) - bx(20), 112, 'fp-band2', 2);
      u += T(bx(20), 292, '20', 20) + T(bx(80), 292, '80%', 20);
      for (const [i, key] of [[0, 'A'], [1, 'B']]) {
        const y = 172 + i * 54;
        const v = C.UTIL[key];
        u += T(CX + 16, y + 14, `${C.CLAMP[key].vmax}`, 20, 'start');
        u += R(bx0, y, bx(v) - bx0, 22, 'fp-meter', 3) + T(Math.min(bx(v) + 6, bx1 - 4), y + 46, `${v}%`, 21, v > 70 ? 'end' : 'start', 'fp-big');
        u += v > 80 ? cross(CX + 30, y + 40) : tick(CX + 26, y + 36);
      }
    }
    set(E.ckUtil, u);
    set(E.ckFit, kb >= 3 ? T(CX + 16, 336, tx('3 · inbouwhoogte', '3 · mould height'), 21, 'start') + tick(CX + CWD - 40, 324) : '');
    set(E.ckOpen, kb >= 4 ? T(CX + 16, 372, tx('4 · openingsslag', '4 · opening stroke'), 21, 'start') + tick(CX + CWD - 40, 360) : '');
  }
  // a hydraulic power unit: oil tank, electric motor, pump, valve block, lines to the cylinders
  function hydCard() {
    const x = CX + 20;
    let s = card(CX, 14, CWD, 220) + T(CX + CWD / 2, 42, tx('hydraulisch', 'hydraulic'), 21, 'middle', 'fp-big');
    s += R(x, 132, 120, 62, 'fp-shape', 6) + mark(M([[x + 6, 148], [x + 114, 148]]), 'fp-dash');
    s += R(x + 12, 86, 54, 40, 'fp-shape2', 8) + mark(M([[x + 22, 90], [x + 22, 122]]) + M([[x + 32, 90], [x + 32, 122]]) + M([[x + 42, 90], [x + 42, 122]]) + M([[x + 52, 90], [x + 52, 122]]), 'fp-hatchc');
    s += `<circle class="fp-shape2" cx="${x + 86}" cy="106" r="16"/>` + mark(M([[x + 80, 106], [x + 92, 106]]) + M([[x + 86, 100], [x + 86, 112]]), 'fp-hatchc');
    s += R(x + 128, 86, 44, 40, 'fp-shape', 4);
    s += arrow(x + 102, 100, x + 126, 100, 8) + arrow(x + 172, 96, CX + CWD - 18, 62, 8) + arrow(x + 172, 116, CX + CWD - 18, 170, 8);
    s += T(CX + CWD / 2, 226, tx('pomp · olie · cilinders', 'pump · oil · cylinders'), 20, 'middle', 'fp-small');
    return s;
  }
  // a servo motor on a belt drive and a ball screw: one per axis
  function servoMotor(x, y) {
    let s = R(x, y, 70, 44, 'fp-shape2', 5);
    s += mark([1, 2, 3, 4, 5].map((i) => M([[x + 10 * i + 4, y + 4], [x + 10 * i + 4, y + 40]])).join(''), 'fp-hatchc');
    s += R(x - 14, y + 8, 14, 28, 'fp-shape', 4) + R(x + 70, y - 4, 8, 52, 'fp-shape', 2) + R(x + 78, y + 18, 14, 8, 'fp-shape2', 2);
    s += R(x + 18, y - 12, 22, 12, 'fp-shape', 2);
    return s;
  }
  function elecCard(kb) {
    const y0 = 14;
    set(E.driveBase, '');
    set(E.dvHyd, kb === 0 ? hydCard() : '');
    let e = '';
    let sv = '';
    let hy = '';
    if (kb >= 1) {
      e = card(CX, y0, CWD, 372) + T(CX + CWD / 2, y0 + 30, tx('volelektrisch', 'all-electric'), 21, 'middle', 'fp-big');
      const x = CX + 40;
      const y = y0 + 66;
      sv = servoMotor(x, y);
      // belt to a ball screw
      e += `<circle class="fp-shape" cx="${x + 100}" cy="${y + 22}" r="12"/><circle class="fp-shape" cx="${x + 100}" cy="${y + 112}" r="20"/>`
        + mark(M([[x + 88, y + 22], [x + 80, y + 112]]) + M([[x + 112, y + 22], [x + 120, y + 112]]), 'fp-arrow')
        + R(x + 120, y + 106, 70, 12, 'fp-shape2', 2) + mark([0, 1, 2, 3, 4, 5, 6].map((i) => M([[x + 126 + i * 9, y + 106], [x + 132 + i * 9, y + 118]])).join(''), 'fp-hatchc');
      e += T(CX + CWD / 2, y0 + 234, tx('servomotor per as', 'servo motor per axis'), 20, 'middle', 'fp-small');
      if (kb >= 2) hy = mark(M([[CX + 14, y0 + 262], [CX + CWD - 14, y0 + 262]]), 'fp-dash')
        + T(CX + CWD / 2, y0 + 300, tx('hybride:', 'hybrid:'), 21, 'middle', 'fp-big')
        + T(CX + CWD / 2, y0 + 330, tx('elektrische schroef', 'electric screw'), 20, 'middle', 'fp-small')
        + T(CX + CWD / 2, y0 + 356, tx('+ hydraulische sluiting', '+ hydraulic clamp'), 20, 'middle', 'fp-small');
    }
    set(E.dvElec, e);
    set(E.dvServo, sv);
    set(E.dvHyb, hy);
  }
  function secCard(p) {
    const y0 = 76; // below a two-line readout at phone width
    let s = card(CX, y0, CWD, 312) + T(CX + CWD / 2, y0 + 32, 'kWh / kg', 22, 'middle', 'fp-big');
    const base = y0 + 240;
    const hMax = 160;
    const g = span(p, 0.05, 0.6);
    for (const [i, v, name] of [[0, C.EL.hyd, tx('hydraulisch', 'hydraulic')], [1, C.EL.ele, tx('elektrisch', 'electric')]]) {
      const x = CX + 40 + i * 110;
      const h = (v / C.EL.hyd) * hMax * g;
      s += R(x, base - h, 64, h, i === 0 ? 'fp-meter2' : 'fp-meter', 3);
      s += T(x + 32, base - h - 10, num(v, 1), 22, 'middle', 'fp-big') + T(x + 32, base + 26, name, 20, 'middle', 'fp-small');
    }
    s += mark(M([[CX + 20, base], [CX + CWD - 20, base]]));
    s += T(CX + CWD / 2, y0 + 296, tx('aanname, meet het zelf', 'assumed: measure it'), 20, 'middle', 'fp-small');
    return s;
  }
  function twokSvg() {
    const x = CX + 22;
    const y = 70;
    // a toothbrush handle: hard core with a soft grip moulded on in the second shot
    let s = card(CX, 14, CWD, 180) + T(CX + CWD / 2 - 14, 44, '2K', 22, 'middle', 'fp-big');
    // the mould turns between the two shots
    const rx = CX + CWD / 2 + 22;
    s += mark(`M${rx + 10} 37A10 10 0 1 1 ${rx} 27`, 'fp-arrow') + mark(head(rx - 4, 27, rx, 27, 6), 'fp-arrow');
    s += `<path class="fp-shape2" d="M${x} ${y + 30}Q${x} ${y + 12} ${x + 30} ${y + 14}L${x + 190} ${y + 22}Q${x + 206} ${y + 26} ${x + 190} ${y + 34}L${x + 30} ${y + 44}Q${x} ${y + 46} ${x} ${y + 30}Z"/>`;
    s += `<path class="fp-shape" d="M${x + 20} ${y + 22}L${x + 110} ${y + 24}L${x + 110} ${y + 38}L${x + 20} ${y + 40}Z"/>`;
    s += mark([0, 1, 2, 3, 4, 5].map((i) => M([[x + 30 + i * 14, y + 24], [x + 30 + i * 14, y + 38]])).join(''), 'fp-hatchc');
    s += T(CX + CWD / 2, y + 90, tx('hard + zacht', 'hard + soft'), 20, 'middle', 'fp-small');
    return s;
  }
  function insertSvg() {
    const x = CX + CWD / 2;
    const y = 290;
    // a threaded brass bush with plastic moulded around it, in section
    let s = card(CX, 206, CWD, 180) + T(CX + CWD / 2, 236, tx('omspuiten', 'insert moulding'), 21, 'middle', 'fp-big');
    s += R(x - 80, y - 36, 160, 72, 'fp-shape', 10);
    s += R(x - 22, y - 36, 44, 72, 'fp-shape2', 2);
    s += mark([0, 1, 2, 3, 4, 5, 6].map((i) => M([[x - 22, y - 30 + i * 10], [x - 12, y - 25 + i * 10]]) + M([[x + 22, y - 30 + i * 10], [x + 12, y - 25 + i * 10]])).join(''), 'fp-hatchc');
    s += T(CX + CWD / 2, y + 66, tx('metalen bus in de matrijs', 'metal bush in the mould'), 20, 'middle', 'fp-small');
    return s;
  }

  // the screw at its true proportion, about 20 diameters long, with its zones
  // (feed about half the flighted length, compression and metering a quarter each)
  const LD = { x0: 60, x1: 580, y: 58 };
  LD.d = (LD.x1 - LD.x0) / C.LD;
  const LDZ = { feed: [0, 0.48], comp: [0.48, 0.74], meter: [0.74, 1] };
  const ldX = (f) => lerp(LD.x0, LD.x1, f);
  function ldBase() {
    const { x0, x1, y, d } = LD;
    let s = card(16, 10, 608, 112);
    // the root: thin at the back (deep channel), tapering, thick at the front (shallow channel)
    const r = (f) => (f < 0.48 ? 0.26 : f < 0.74 ? lerp(0.26, 0.4, (f - 0.48) / 0.26) : 0.4) * d;
    const top = [];
    for (let f = 0; f <= 1.0001; f += 0.02) top.push([ldX(f), y + d / 2 - r(f)]);
    const bot = top.slice().reverse().map(([x, yy]) => [x, 2 * (y + d / 2) - yy]);
    s += `<path class="fp-shape2" d="${M([...top, ...bot])}Z"/>`;
    // flights: one per diameter, slanted across the channel
    const fl = [];
    for (let x = x0 + d * 0.5; x < x1 - 2; x += d) fl.push(M([[x, y], [x + d * 0.45, y + d]]));
    s += mark(fl.join('') + M([[x0, y], [x1, y]]) + M([[x0, y + d], [x1, y + d]]), 'fp-hatchc');
    s += R(x1, y + d * 0.2, 14, d * 0.6, 'fp-shape2', 2) + `<path class="fp-shape2" d="M${x1 + 14} ${f1(y + d * 0.2)}L${x1 + 30} ${f1(y + d / 2)}L${x1 + 14} ${f1(y + d * 0.8)}Z"/>`;
    // the shank at the back, and the diameter and length marks
    s += R(x0 - 34, y + d * 0.3, 34, d * 0.4, 'fp-shape', 2);
    s += T(x0 - 8, y - 16, 'D', 20, 'end');
    s += mark(M([[x0 - 4, y], [x0 - 4, y + d]]), 'fp-arrow');
    s += T((x0 + x1) / 2, y - 16, tx(`L ≈ ${C.LD} × D`, `L ≈ ${C.LD} × D`), 20, 'middle', 'fp-big');
    return s;
  }
  function ldZone(z, on) {
    const [a, b] = LDZ[z];
    if (!on) return `<rect class="fp-zone" x="${f1(ldX(a))}" y="${LD.y - 2}" width="${f1(ldX(b) - ldX(a))}" height="${f1(LD.d + 4)}"/>`;
    const name = { feed: tx('intrekzone', 'feed zone'), comp: tx('compressiezone', 'compression zone'), meter: tx('doseerzone', 'metering zone') }[z];
    return `<rect class="fp-zone" x="${f1(ldX(a))}" y="${LD.y - 2}" width="${f1(ldX(b) - ldX(a))}" height="${f1(LD.d + 4)}"/>${T((ldX(a) + ldX(b)) / 2, LD.y + LD.d + 24, name, 20, 'middle', 'fp-big')}`;
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['ldC', 'shadowC', 'rulerC', 'resC', 'checkC', 'driveC', 'secC', 'specC'];
  const hudOnly = (list) => { for (const k of HUD) show(E[k], list.includes(k)); };
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    camW = introCamera(E.world, C.KEYS[si], d, u, W, H).w;
    const clockS = u * C.dur[si];
    // the machine's state
    let open = 0;
    let s = C.STROKE; // dosed: the screw back by the full stroke
    let rot = 0;
    let ringOpen = 0;
    let F = 0;
    let solid = 0;
    let flash = 0;
    let ej = 0;
    let drop = 0;
    let pack = 0;
    let force = false;
    let press = false;
    let hud = [];
    const zones = { feed: false, comp: false, meter: false };
    let stroke = false;
    let shotv = false;
    let mh = false;
    let os = false;

    if (si === 0) {
      if (kb === 1) { rot = clockS * 0.5; ringOpen = 1; }
      if (kb === 2) open = span(p, 0.1, 0.45) - span(p, 0.6, 0.95);
      if (kb === 3) { F = span(p, 0.05, 0.6); s = lerp(C.STROKE, 6, F); }
    }
    if (si === 1) {
      if (kb === 0) { open = 1 - span(p, 0, 0.3); F = span(p, 0.35, 0.9); s = lerp(C.STROKE, 6, F); }
      if (kb === 1) { F = 1; s = lerp(6, 4, span(p, 0, 0.7)); pack = 1 - span(p, 0.75, 0.95); solid = 0.3 * p; }
      if (kb === 2) { F = 1; solid = 0.3 + 0.7 * span(p, 0, 0.9); s = lerp(4, C.STROKE, span(p, 0.1, 0.9)); rot = clockS * 0.6; ringOpen = 1; }
      if (kb === 3) { F = 1; solid = 1; open = span(p, 0.05, 0.4); ej = span(p, 0.45, 0.62); drop = span(p, 0.65, 0.95); }
    }
    if (si === 2) {
      F = 1; solid = 0.6; s = 6; press = kb === 0 || kb === 3; force = kb !== 1;
      if (kb >= 1 && kb <= 2) hud = ['shadowC'];
      if (kb === 3) { flash = span(p, 0.15, 0.7); open = 0.04 * span(p, 0.1, 0.5); }
    }
    if (si === 3) {
      s = 30; rot = clockS * 0.5; ringOpen = 1;
      zones.feed = kb === 0; zones.comp = kb === 1; zones.meter = kb === 2;
      hud = ['ldC'];
    }
    if (si === 4) {
      if (kb === 0) { s = lerp(6, C.STROKE, span(p, 0.05, 0.85)); rot = clockS * 0.6; ringOpen = 1; stroke = true; shotv = true; hud = ['rulerC']; }
      else { hud = ['resC']; }
    }
    if (si === 5) {
      F = 1; solid = 1;
      if (kb === 0) { press = true; s = 6; }
      if (kb === 1) shotv = true;
      // the mould height is measured on the closed mould, then the press opens for the stroke
      if (kb === 3) mh = true;
      if (kb === 4) { os = true; open = span(p, 0.08, 0.45); }
      hud = ['checkC'];
    }
    if (si === 6) {
      F = 1; solid = 1;
      if (kb === 0) { open = 0.5 - 0.5 * Math.cos(clamp(p / 0.9, 0, 1) * Math.PI * 2); hud = ['driveC']; }
      if (kb === 1 || kb === 2) hud = ['driveC'];
      if (kb === 3) hud = ['secC'];
    }
    if (si === 7) { F = 1; solid = 1; hud = ['specC']; }

    const xt = C.TIP0 - s;
    set(E.screw, screwSvg(xt, rot, ringOpen));
    set(E['z-feed'], zones.feed ? zoneSvg(xt, ZONES.comp, ZONES.end) : '');
    set(E['z-comp'], zones.comp ? zoneSvg(xt, ZONES.meter, ZONES.comp) : '');
    set(E['z-meter'], zones.meter ? zoneSvg(xt, ZONES.flight0 - 6, ZONES.meter) : '');
    set(E.shotv, shotv ? `<path class="fp-zone" style="fill:var(--fp-accent);fill-opacity:.18" d="${poly(rect(xt, BORE.x1, -BORE.r + 0.5, BORE.r - 0.5))}"/>` : '');
    const off = OPEN * open;
    move(E.mov, [off, 0, 0]);
    move(E.movP, [off, 0, 0]);
    move(E.piston, [off, 0, 0]);
    move(E.pins, [off - 10 * ej, 0, 0]);
    set(E.part, partSvg(F, solid, flash));
    move(E.part, [off - 10 * ej, 0, -240 * drop * drop]);
    fade(E.part, 1 - span(drop, 0.5, 1));
    set(E.pack, packSvg(pack));
    set(E.press, press ? pressSvg() : '');
    set(E.force, force ? forceSvg(off) : '');
    set(E.stroke, stroke ? dim(xt, C.TIP0, -C.BORE.r - 32, 7) : '');
    set(E.mh, mh && off < 2 ? dim(-14, C.MPL[0], -172) : '');
    set(E.os, os && off > 2 ? dim(PL, PL + off, 172) : '');

    if (hud.includes('ldC')) {
      set(E.ldBase, ldBase());
      for (const z of ['feed', 'comp', 'meter']) set(E[`ld-${z}`], ldZone(z, zones[z]));
    }
    if (hud.includes('shadowC')) set(E.shadowBody, shadowCard(kb));
    if (hud.includes('rulerC')) set(E.rulerBody, rulerCard(s));
    if (hud.includes('resC')) set(E.resBody, resCard(kb, p));
    if (hud.includes('checkC')) checkCard(kb);
    if (hud.includes('driveC')) elecCard(kb);
    if (hud.includes('secC')) set(E.secBody, secCard(p));
    if (hud.includes('specC')) { set(E.spTwo, twokSvg()); set(E.spIns, kb >= 1 ? insertSvg() : ''); }
    hudOnly(hud);
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
