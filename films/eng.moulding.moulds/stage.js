// The stage of the film "De matrijs als gereedschap / The mould as a tool": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope), a preamble from build.mjs that defines P (projection),
// C (world constants, the model, the beat cameras), W and H, and the kit's
// audio warp.
//
// Each scene is a row of beats; the beat on screen (and how far through it)
// comes from the caption beat starts, so a move lands on the line that names
// it. The mould cut open through the sprue is the world (one camera framing
// per beat); the cards over it are drawn in stage space.
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
  const flipZ = (pts) => pts.map(([x, z]) => [x, -z]);
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
  let camW = W;
  const wArrow = (a, b, cls = 'fp-arrow') => { const [x0, y0] = sp(a[0], a[1]); const [x1, y1] = sp(b[0], b[1]); return arrow(x0, y0, x1, y1, (8 * camW) / W, cls); };
  const tick = (x, y) => mark(`M${f1(x)} ${f1(y)}l6 6l12 -14`, 'fp-arrow');
  const cross = (x, y) => mark(`M${f1(x)} ${f1(y - 7)}l14 14M${f1(x + 14)} ${f1(y - 7)}l-14 14`, 'fp-arrow');

  // ------------------------------------------------------------ the melt in the mould
  const { CAV, CORE, HOLE, GATE, RUN, SPRUE, SLIDE, PIN_A, PIN_TAN, OPEN, EJ_STROKE, BAFFLE, HOT } = C;
  const PL = C.PL;
  const BOT = CAV.z0;
  const TOP = CAV.z1;
  const GX = GATE.b[0];
  // the part as the melt reaches it, l along its path (top cavity; mirrored below)
  function partPieces(l, hot) {
    const out = [];
    const t = CAV.t;
    const topWall = (x0, x1) => {
      if (x1 <= x0) return;
      if (x1 <= HOLE.x0 || x0 >= HOLE.x1) { out.push(rect(x0, x1, TOP - t, TOP)); return; }
      if (x0 < HOLE.x0) out.push(rect(x0, HOLE.x0, TOP - t, TOP));
      if (x1 > HOLE.x1) out.push(rect(HOLE.x1, x1, TOP - t, TOP));
    };
    if (!hot) {
      const left = Math.min(l, GX - CAV.x0);
      if (l > 0) out.push(rect(GX - left, Math.min(PL, GX + l), BOT, BOT + t));
      const lb = l - (GX - CAV.x0);
      if (lb > 0) out.push(rect(CAV.x0, CAV.x0 + t, BOT, Math.min(TOP, BOT + lb)));
      const lt = lb - (TOP - BOT);
      if (lt > 0) topWall(CAV.x0, Math.min(PL, CAV.x0 + lt));
    } else {
      const mid = (BOT + TOP) / 2;
      const half = (TOP - BOT) / 2;
      const lb = Math.min(l, half);
      if (l > 0) out.push(rect(CAV.x0, CAV.x0 + t, mid - lb, mid + lb));
      const lw = l - half;
      if (lw > 0) { out.push(rect(CAV.x0, Math.min(PL, CAV.x0 + lw), BOT, BOT + t)); topWall(CAV.x0, Math.min(PL, CAV.x0 + lw)); }
    }
    return out;
  }
  const PATH_COLD = (GX - CAV.x0) + (TOP - BOT) + (PL - CAV.x0);
  const PATH_HOT = (TOP - BOT) / 2 + (PL - CAV.x0);
  const SHARE = { sprue: 0.14, runner: 0.3, gate: 0.36 };
  const sprueR = (x) => SPRUE.r0 + ((x - SPRUE.x0) / (PL - SPRUE.x0)) * (SPRUE.r1 - SPRUE.r0);
  function gatePoly(f) {
    const [ax, az] = GATE.a;
    const [bx, bz] = GATE.b;
    const ex = lerp(ax, bx, f);
    const ez = lerp(az, bz, f);
    const d = Math.hypot(bx - ax, bz - az);
    const nx = -(bz - az) / d;
    const nz = (bx - ax) / d;
    const re = lerp(GATE.ra, GATE.rb, f);
    return [[ax + nx * GATE.ra, az + nz * GATE.ra], [ex + nx * re, ez + nz * re], [ex - nx * re, ez - nz * re], [ax - nx * GATE.ra, az - nz * GATE.ra]];
  }
  // melt: { spr, run, gate, part } path strings for the fill F (0..1)
  function melt(F, hot) {
    const o = { spr: '', run: '', gate: '', part: [] };
    if (F <= 0) return o;
    const both = (pts) => poly(pts) + poly(flipZ(pts));
    if (hot) {
      const l = clamp(F, 0, 1) * PATH_HOT;
      o.part = partPieces(l, true);
      return o;
    }
    const xs = SPRUE.x0;
    const fs = clamp(F / SHARE.sprue, 0, 1);
    const xe = lerp(xs, PL, fs);
    o.spr = poly([[xs, -SPRUE.r0], [xe, -sprueR(xe)], [xe, sprueR(xe)], [xs, SPRUE.r0]]);
    if (F > SHARE.sprue) {
      const fr = clamp((F - SHARE.sprue) / (SHARE.runner - SHARE.sprue), 0, 1);
      const z = fr * RUN.z;
      o.run = poly(rect(-RUN.h, RUN.h, -z, z)) + poly(rect(PL, 10, -4, 4));
    }
    if (F > SHARE.runner) o.gate = both(gatePoly(clamp((F - SHARE.runner) / (SHARE.gate - SHARE.runner), 0, 1)));
    if (F > SHARE.gate) o.part = partPieces(((F - SHARE.gate) / (1 - SHARE.gate)) * PATH_COLD, false);
    return o;
  }
  const partD = (pieces) => pieces.map((p) => poly(p) + poly(flipZ(p))).join('');
  const meltSvg = (d, solid, cls = 'fp-melt') => (d ? `<path class="${cls}" d="${d}"/>${solid > 0 ? `<path class="fp-solid" style="opacity:${(0.85 * solid).toFixed(2)}" d="${d}"/>` : ''}` : '');
  // the flow front marks of a fill simulation: lines across the walls at equal fill times
  function simSvg(a) {
    if (a <= 0) return '';
    const marks = [];
    const t = CAV.t;
    for (let l = 8; l < PATH_COLD; l += 12) {
      let seg = null;
      const lb = l - (GX - CAV.x0);
      if (lb < 0) seg = [[GX - l, BOT], [GX - l, BOT + t]];
      else if (lb < TOP - BOT) seg = [[CAV.x0, BOT + lb], [CAV.x0 + t, BOT + lb]];
      else { const x = CAV.x0 + lb - (TOP - BOT); if (x < PL - 1 && (x < HOLE.x0 - 0.5 || x > HOLE.x1 + 0.5)) seg = [[x, TOP - t], [x, TOP]]; }
      if (seg) marks.push(M(seg.map(([x, z]) => sp(x, z))) + M(seg.map(([x, z]) => sp(x, -z))));
    }
    // the weld line behind the clip hole, where the two fronts meet again
    const wx = HOLE.x1 + 1.2;
    const weld = M([sp(wx, TOP - t - 1), sp(wx, TOP + 1)]) + M([sp(wx, -TOP + t + 1), sp(wx, -TOP - 1)]);
    return `<g style="opacity:${a.toFixed(2)}">${mark(marks.join(''), 'fp-flow')}${mark(weld, 'fp-arrow')}</g>`;
  }

  // ------------------------------------------------------------ marks in the world
  // the vent: a slot (drawn much deeper than it is) from the last corner to fill, along the slide's seat to the open air
  const ventSvg = () => {
    const a = [[PL, TOP], [SLIDE.x1, TOP], [SLIDE.x1, SLIDE.z1 + 10], [SLIDE.x1 + 1.4, SLIDE.z1 + 10], [SLIDE.x1 + 1.4, TOP + 1.4], [PL, TOP + 1.4]];
    return `<path class="fp-glow" d="${poly(a)}${poly(flipZ(a))}"/>` + wArrow([SLIDE.x1 + 0.7, SLIDE.z1 - 4], [SLIDE.x1 + 0.7, SLIDE.z1 + 14]) + wArrow([SLIDE.x1 + 0.7, -SLIDE.z1 + 4], [SLIDE.x1 + 0.7, -SLIDE.z1 - 14]);
  };
  // draft: the core's wall, tapered by much more than 1° so it can be seen
  const draftSvg = () => {
    const z = CORE.z1;
    const ex = 7; // exaggerated
    return mark(M([sp(PL, z), sp(CORE.x0, z)]), 'fp-dash')
      + `<path class="fp-glow" d="${poly([[PL, z], [CORE.x0, z - ex], [CORE.x0, z]])}"/>`
      + mark(M([sp(PL, z), sp(CORE.x0, z - ex)]), 'fp-arrow')
      + T(sp(CORE.x0 - 3, z - 2)[0], sp(CORE.x0 - 3, z - 2)[1], `${C.DRAFT}°`, (20 * camW) / W, 'end', 'fp-big');
  };
  // the undercut: the clip hole lit, and the part's way out (to the right, with the core) blocked by the slide's pin
  const undercutSvg = () => {
    const glow = `<path class="fp-glow" d="${poly(rect(HOLE.x0, HOLE.x1, TOP - CAV.t - 0.5, TOP + 0.5))}${poly(flipZ(rect(HOLE.x0, HOLE.x1, TOP - CAV.t - 0.5, TOP + 0.5)))}"/>`;
    const c = 1.6;
    return glow + [1, -1].map((sg) => {
      const z = sg * (TOP - CAV.t / 2);
      const xk = HOLE.x0 - 3;
      return wArrow([HOLE.x0 - 15, z], [HOLE.x0 - 5.5, z]) + mark(M([sp(xk - c, z - c), sp(xk + c, z + c)]) + M([sp(xk + c, z - c), sp(xk - c, z + c)]), 'fp-arrow');
    }).join('');
  };
  // the tunnel gate named in the close-up (accent: drawn per frame, outside the cue groups)
  const tunnelLabel = () => {
    const [x, y] = sp(-9, GATE.a[1] - 1);
    return T(x, y, 'tunnel', (20 * camW) / W, 'end', 'fp-big fp-acc');
  };

  // water through the baffle: up one side, down the other
  const waterSvg = () => [1, -1].map((s) => wArrow([C.BAFFLE.x1 - 4, s * (BAFFLE.z + 2)], [BAFFLE.x0 + 6, s * (BAFFLE.z + 2)]) + wArrow([BAFFLE.x0 + 6, s * (BAFFLE.z - 2)], [C.BAFFLE.x1 - 4, s * (BAFFLE.z - 2)])).join('');
  // air out of the cavity through the vent
  // the melt arrow from the nozzle in the hot runner
  // ------------------------------------------------------------ cards
  const CX = 380; // left edge of the right-hand cards
  const CWD = 250;
  const MID = CX + CWD / 2;
  function runnerIcon(x, y, w, hot) {
    // a two-part shot seen from the side: sprue, runner, two parts
    let s = '';
    if (!hot) {
      s += R(x + w / 2 - 4, y, 8, 34, 'fp-shape2', 2);
      s += R(x + 26, y + 34, w - 52, 8, 'fp-shape2', 2);
    } else {
      s += R(x + 18, y + 8, w - 36, 22, 'fp-shape', 4);
      s += [x + 34, x + w / 2 - 6, x + w - 46].map((cx) => `<circle class="fp-shape2" cx="${f1(cx + 6)}" cy="${f1(y + 19)}" r="3"/>`).join('');
    }
    s += R(x, y + 42, 50, 30, 'fp-shape', 4) + R(x + w - 50, y + 42, 50, 30, 'fp-shape', 4);
    return s;
  }
  function chCard(kb) {
    let cold = card(CX, 14, CWD, 180) + T(MID, 44, tx('koudkanaal', 'cold runner'), 21, 'middle', 'fp-big');
    cold += runnerIcon(CX + 30, 60, CWD - 60, false);
    cold += T(MID, 170, tx('afval of maalgoed', 'waste or regrind'), 20, 'middle', 'fp-small');
    set(E.chCold, cold);
    let hot = '';
    if (kb >= 1) {
      hot = card(CX, 206, CWD, 180) + T(MID, 236, tx('heetkanaal', 'hot runner'), 21, 'middle', 'fp-big');
      hot += runnerIcon(CX + 30, 250, CWD - 60, true);
      if (kb >= 2) {
        hot += tick(CX + 18, 344) + T(CX + 44, 352, tx('geen afval, sneller', 'no waste, faster'), 19, 'start', 'fp-small');
        hot += cross(CX + 20, 369) + T(CX + 44, 376, tx('duurder, meer storing', 'dearer, more to fail'), 19, 'start', 'fp-small');
      } else hot += T(MID, 362, tx('verwarmd verdeelblok', 'heated manifold'), 20, 'middle', 'fp-small');
    }
    set(E.chHot, hot);
  }
  function tlCard(p) {
    const x0 = CX + 22;
    const x1 = CX + CWD - 22;
    const wk = (w) => lerp(x0, x1, w / 18);
    let s = card(CX, 120, CWD, 266) + T(MID, 150, tx('weken', 'weeks'), 20, 'middle', 'fp-small');
    const y = 200;
    s += mark(M([[x0, y + 24], [x1, y + 24]]));
    s += mark([0, 4, 8, 12, 16].map((w) => M([[wk(w), y + 24], [wk(w), y + 32]])).join(''));
    s += [0, 8, 16].map((w) => T(wk(w), y + 54, String(w), 20)).join('');
    const g = span(p, 0.05, 0.6);
    s += R(x0, y, (wk(C.LEAD[0]) - x0) * Math.min(1, g * 1.6), 20, 'fp-meter', 3);
    if (g > 0.6) s += R(wk(C.LEAD[0]), y, (wk(C.LEAD[1]) - wk(C.LEAD[0])) * span(g, 0.6, 1), 20, 'fp-band2', 3);
    s += T(MID, y + 90, tx(`${C.LEAD[0]}–${C.LEAD[1]} weken bouwen`, `${C.LEAD[0]}–${C.LEAD[1]} weeks to build`), 20, 'middle', 'fp-small');
    if (p > 0.55) {
      const xf = wk(C.LEAD[1]);
      s += mark(M([[xf, y - 4], [xf, y - 34]])) + `<path class="fp-shape2" d="M${f1(xf)} ${y - 34}l16 6l-16 6z"/>` + T(xf - 6, y - 16, 'T1', 21, 'end', 'fp-big');
    }
    s += T(MID, y + 130, tx('T1: de eerste proef', 'T1: the first trial'), 20, 'middle', 'fp-big');
    s += T(MID, y + 162, tx('daarna T2, T3', 'then T2, T3'), 20, 'middle', 'fp-small');
    return s;
  }
  function counterRow(x, y, value, w = 200) {
    const digits = String(Math.floor(value)).padStart(6, '0');
    const dw = w / 6;
    let s = R(x - 6, y - 6, w + 12, 58, 'fp-shape', 6);
    for (let i = 0; i < 6; i++) s += R(x + i * dw + 2, y, dw - 4, 46, 'fp-shape2', 3) + T(x + i * dw + dw / 2, y + 33, digits[i], 26, 'middle', 'fp-big');
    return s;
  }
  function cntCard(value) {
    let s = card(CX, 14, CWD, 132) + T(MID, 42, tx('shotteller', 'shot counter'), 20, 'middle', 'fp-small');
    s += counterRow(CX + 25, 62, value);
    return s;
  }
  function pmCard(p) {
    let s = card(CX, 158, CWD, 228);
    s += T(MID, 188, `${num(C.PM_RANGE[0])}–${num(C.PM_RANGE[1])} shots`, 21, 'middle', 'fp-big');
    const items = [tx('ontluchting schoon', 'clean the vents'), tx('pennen nakijken', 'check the pins'), tx('koeling ontkalken', 'descale cooling'), tx('deellijn nakijken', 'check parting line')];
    items.forEach((it, i) => {
      const y = 228 + i * 40;
      if (p > 0.1 + i * 0.15) s += tick(CX + 18, y - 6);
      s += T(CX + 48, y + 2, it, 19, 'start', 'fp-small');
    });
    return s;
  }
  function smCard(kb, p) {
    const x0 = CX + 20;
    const xs = (m) => x0 + (m / 90) * (CWD - 40);
    let s = card(CX, 64, CWD, 322) + T(MID, 94, tx('één wissel', 'one change'), 20, 'middle', 'fp-small');
    s += R(x0, 112, xs(C.SMED.before) - x0, 26, 'fp-meter2', 3) + T(x0, 162, `${C.SMED.before} min`, 20, 'start');
    const g = kb >= 4 ? 1 : span(p, 0.15, 0.7);
    s += R(x0, 180, (xs(C.SMED.after) - x0) * g, 26, 'fp-meter', 3) + T(x0, 230, `SMED: ${C.SMED.after} min`, 20, 'start', 'fp-big');
    if (kb >= 4) {
      s += mark(M([[CX + 14, 254], [CX + CWD - 14, 254]]), 'fp-dash');
      s += T(MID, 288, `${C.SMED.changes} × 1 ${tx('uur', 'h')} = ${C.SMED_H} ${tx('uur', 'h')}`, 21, 'middle', 'fp-big');
      s += T(MID, 322, tx('per week vrij', 'freed a week'), 20, 'middle', 'fp-small');
      s += T(MID, 362, `× €${C.SMED.rate} = €${num(C.SMED_H * C.SMED.rate)}`, 21, 'middle', 'fp-big');
    } else {
      s += T(MID, 290, tx('voorwarmen', 'pre-heat'), 19, 'middle', 'fp-small') + T(MID, 320, tx('standaard opspanplaten', 'standard clamp plates'), 19, 'middle', 'fp-small') + T(MID, 350, tx('snelkoppelingen', 'quick couplings'), 19, 'middle', 'fp-small');
    }
    return s;
  }
  function shCard(p) {
    const x0 = CX + 20;
    const total = C.SHOT_G;
    const xs = (g) => x0 + (g / total) * (CWD - 40);
    let s = card(CX, 64, CWD, 322) + T(MID, 96, tx('één shot', 'one shot'), 20, 'middle', 'fp-small');
    const g = span(p, 0.05, 0.6);
    const y = 124;
    s += R(x0, y, (xs(C.SHOT.part) - x0) * Math.min(1, g * 3), 34, 'fp-meter2', 3);
    if (g > 0.33) s += R(xs(C.SHOT.part) + 2, y, (xs(2 * C.SHOT.part) - xs(C.SHOT.part) - 2) * Math.min(1, (g - 0.33) * 3), 34, 'fp-meter2', 3);
    if (g > 0.66) s += R(xs(2 * C.SHOT.part) + 2, y, (xs(total) - xs(2 * C.SHOT.part) - 2) * Math.min(1, (g - 0.66) * 3), 34, 'fp-meter', 3);
    s += T((x0 + xs(C.SHOT.part)) / 2, y + 62, String(C.SHOT.part), 21) + T((xs(C.SHOT.part) + xs(2 * C.SHOT.part)) / 2, y + 62, String(C.SHOT.part), 21) + T((xs(2 * C.SHOT.part) + xs(total)) / 2, y + 62, String(C.SHOT.runner), 21, 'middle', 'fp-big');
    s += T(MID, y + 106, `= ${total} g`, 26, 'middle', 'fp-big');
    s += mark(M([[CX + 14, y + 128], [CX + CWD - 14, y + 128]]), 'fp-dash');
    s += T(MID, y + 164, `${C.SHOT.runner} / ${total} = ${C.RUNNER_PCT} %`, 21, 'middle', 'fp-big');
    s += T(MID, y + 198, tx('maalgoed tot 15 %: past', 'regrind up to 15 %: fits'), 19, 'middle', 'fp-small');
    s += T(MID, y + 228, tx('tot 10 %: deels afval', 'up to 10 %: part waste'), 19, 'middle', 'fp-small');
    return s;
  }
  function planCard(p) {
    const x0 = CX + 20;
    const x1 = CX + CWD - 20;
    const per = C.WEEK;
    const xs = (shots) => lerp(x0, x1, shots / (3 * per));
    let s = card(CX, 14, CWD, 372) + T(MID, 44, tx('shots per week', 'shots a week'), 20, 'middle', 'fp-small');
    s += T(MID, 82, `${C.CARE.hours} × 3.600 / ${C.CARE.cycle}`.replace('3.600', EN ? '3,600' : '3.600'), 20, 'middle');
    s += T(MID, 118, `= ${num(per)}`, 25, 'middle', 'fp-big');
    const g = span(p, 0.1, 0.8);
    const y = 160;
    for (let w = 0; w < 3; w++) {
      const f = clamp(g * 3 - w, 0, 1);
      if (f > 0) s += R(xs(w * per) + 1.5, y, (xs((w + f) * per) - xs(w * per)) - 3, 34, w === 2 ? 'fp-meter2' : 'fp-meter', 3);
      s += T((xs(w * per) + xs((w + 1) * per)) / 2, y + 62, `${tx('wk', 'wk')} ${w + 1}`, 19, 'middle', 'fp-small');
    }
    const xp = xs(C.CARE.pm);
    s += mark(M([[xp, y - 14], [xp, y + 44]]), 'fp-arrow');
    s += T(MID, y + 110, tx(`onderhoud elke ${num(C.CARE.pm)}`, `service every ${num(C.CARE.pm)}`), 20, 'middle', 'fp-small');
    s += T(MID, y + 150, tx(`= elke ${num(C.CARE.pm / per, 1)} weken`, `= every ${num(C.CARE.pm / per, 1)} weeks`), 22, 'middle', 'fp-big');
    s += T(MID, y + 192, tx('plan bij een orderwissel', 'plan at an order change'), 19, 'middle', 'fp-small');
    return s;
  }
  function wearCard() {
    let s = card(CX, 14, CWD, 372) + T(MID, 44, tx('op voorraad', 'on stock'), 20, 'middle', 'fp-small');
    const rows = [tx('uitwerppennen', 'ejector pins'), tx('slijtplaten', 'wear plates'), tx('afdichtingen', 'seals'), tx('verwarmingen', 'heaters'), tx('voelers', 'sensors')];
    rows.forEach((r, i) => {
      const y = 88 + i * 60;
      const x = CX + 22;
      if (i === 0) s += R(x, y - 3, 40, 6, 'fp-shape2', 2) + R(x + 36, y - 7, 6, 14, 'fp-shape2', 1);
      if (i === 1) s += R(x, y - 6, 42, 12, 'fp-shape2', 2) + mark(M([[x + 8, y - 6], [x + 14, y + 6]]) + M([[x + 22, y - 6], [x + 28, y + 6]]), 'fp-hatchc');
      if (i === 2) s += `<circle class="fp-shape2" cx="${x + 21}" cy="${y}" r="10"/><circle class="fp-shape" cx="${x + 21}" cy="${y}" r="5"/>`;
      if (i === 3) s += mark(`M${x} ${y}q5 -10 10 0t10 0t10 0t10 0`, 'fp-arrow');
      if (i === 4) s += R(x + 6, y - 9, 8, 18, 'fp-shape2', 2) + mark(M([[x + 14, y], [x + 42, y]]), 'fp-hatchc');
      s += T(CX + 76, y + 7, r, 19, 'start', 'fp-small');
    });
    return s;
  }
  function logCard(p) {
    let s = card(CX, 14, CWD, 372) + T(MID, 44, tx('matrijslogboek', 'mould logbook'), 20, 'middle', 'fp-big');
    s += T(CX + 18, 80, 'shots', 19, 'start', 'fp-small') + T(CX + 118, 80, tx('reparatie', 'repair'), 19, 'start', 'fp-small');
    s += mark(M([[CX + 12, 90], [CX + CWD - 12, 90]]), 'fp-dash');
    const rows = [[18400, tx('pen holte 2', 'pin cav 2'), false], [31200, tx('schuif 1', 'slide 1'), true], [52700, tx('afdichting', 'seal'), false], [61500, tx('schuif 1', 'slide 1'), true], [92300, tx('schuif 1', 'slide 1'), true]];
    rows.forEach(([shots, what, hit], i) => {
      if (p < 0.08 + i * 0.12) return;
      const y = 124 + i * 44;
      if (hit && p > 0.75) s += R(CX + 10, y - 26, CWD - 20, 36, 'fp-band2', 4);
      s += T(CX + 18, y, num(shots), 19, 'start', hit ? 'fp-big' : 'fp-small') + T(CX + 118, y, what, 19, 'start', hit ? 'fp-big' : 'fp-small');
    });
    if (p > 0.8) s += T(MID, 362, tx(`elke ${num(C.CARE.slide)}: ontwerp`, `every ${num(C.CARE.slide)}: design`), 20, 'middle', 'fp-big');
    return s;
  }
  function lastCard() {
    let s = card(CX, 14, CWD, 372) + T(MID, 44, tx('laatste shot', 'last-shot sample'), 20, 'middle', 'fp-big');
    // a tray with the last two parts and the runner, a tag with the shot count
    s += R(CX + 20, 70, CWD - 40, 150, 'fp-shape', 8);
    s += runnerIcon(CX + 40, 92, CWD - 80, false);
    // flash on cavity 2: a ragged edge, circled
    const fx = CX + CWD - 64;
    s += mark(`M${fx} 164l4 6l3 -4l4 7l3 -5l4 6`, 'fp-arrow');
    s += `<circle class="fp-dash" cx="${fx + 11}" cy="168" r="18"/>`;
    s += T(MID, 254, tx('braam op holte 2', 'flash on cavity 2'), 20, 'middle', 'fp-big');
    s += T(MID, 292, tx('gaat mee met de matrijs', 'goes with the mould'), 19, 'middle', 'fp-small');
    s += T(MID, 326, tx('repareren op de bank,', 'repair on the bench,'), 19, 'middle', 'fp-small');
    s += T(MID, 356, tx('niet bij het opstarten', 'not during start-up'), 19, 'middle', 'fp-small');
    return s;
  }
  // the change, before and after: internal work with the press stopped, external work while it runs
  function setCard(kb, p) {
    const xm = (m) => lerp(40, 600, (m + 104) / 204);
    const x0 = xm(0);
    let base = card(16, 168, 608, 218);
    base += T(36, 196, tx('voor', 'before'), 19, 'start', 'fp-small');
    base += T(36, 264, tx('na', 'after'), 19, 'start', 'fp-small');
    // the stop starts at the last good part
    base += mark(M([[x0, 178], [x0, 352]]), 'fp-dash');
    base += T(x0 - 8, 225, tx('laatste goede', 'last good part'), 19, 'end', 'fp-small');
    set(E.setBase, base);
    const g = kb >= 2 ? 1 : span(p, 0.05, 0.6);
    let int = R(x0, 204, xm(90) - x0, 30, 'fp-meter', 3) + T(xm(45), 225, tx('90 min intern', '90 min internal'), 19, 'middle', 'fp-big fp-inv');
    if (kb >= 1) int += R(x0, 272, xm(30) - x0, 30, 'fp-meter', 3) + T(xm(30) + 8, 293, '30 min', 19, 'start', 'fp-big');
    set(E.setInt, int);
    let ext = '';
    if (kb >= 1) {
      const blocks = [[tx('drogen', 'drying'), -98, -68], [tx('slangen', 'hoses'), -65, -36], [tx('voorwarmen', 'pre-heat'), -33, -2]];
      blocks.forEach(([name, a, b], i) => {
        if (g < 0.15 + i * 0.2) return;
        ext += R(xm(a), 272, xm(b) - xm(a), 30, 'fp-meter2', 3) + T((xm(a) + xm(b)) / 2, i === 1 ? 346 : 322, name, 19, 'middle', 'fp-small');
      });
      ext += T(xm(-52), 374, tx('extern: de pers draait', 'external: press running'), 19, 'middle', 'fp-small');
    }
    if (kb >= 2) {
      const xe = xm(30);
      ext += mark(M([[xe, 266], [xe, 352]]), 'fp-dash') + T(xe + 8, 350, tx('eerste goede', 'first good part'), 19, 'start', 'fp-small');
    }
    set(E.setExt, ext);
  }
  // the road of a new mould, one step per beat
  function roadCard(kb, p) {
    const steps = [['dfm', 'DFM'], ['sim', tx('vulsimulatie', 'fill simulation')], ['spi', tx('staal, SPI-klasse', 'steel, SPI class')], ['t0', 'T0 · T1'], ['ppap', 'PPAP']];
    set(E.roadBase, card(CX, 14, CWD, 372) + mark(M([[CX + 34, 60], [CX + 34, 308]]), 'fp-dash'));
    const keys = { dfm: 'rdDfm', sim: 'rdSim', spi: 'rdSpi', t0: 'rdT0', ppap: 'rdPpap' };
    steps.forEach(([cue, name], i) => {
      const y = 60 + i * 62;
      let s = '';
      if (i <= kb) {
        s += `<circle class="${i === kb ? 'fp-shape' : 'fp-shape2'}" cx="${CX + 34}" cy="${y}" r="11"/>`;
        s += T(CX + 58, y + 7, name, 20, 'start', i === kb ? 'fp-big' : 'fp-small');
        if (i === kb && cue === 'ppap') {
          s += T(CX + 58, y + 32, tx(`${C.NEW.ppap} op rij, op tempo`, `${C.NEW.ppap} in a row, at rate`), 19, 'start', 'fp-small');
          const n = Math.round(span(p, 0.1, 0.8) * 30);
          for (let j = 0; j < n; j++) s += R(CX + 58 + (j % 15) * 11, y + 42 + Math.floor(j / 15) * 12, 8, 8, 'fp-meter', 2);
        }
        if (i === kb && cue === 'dfm') s += T(CX + 58, y + 34, tx('wanden, ribben', 'walls, ribs, draft'), 19, 'start', 'fp-small');
        if (i === kb && cue === 't0') s += T(CX + 58, y + 34, tx('werkt hij? meten', 'works? measure'), 19, 'start', 'fp-small');
      } else s += `<circle class="fp-shape" cx="${CX + 34}" cy="${y}" r="6"/>` + T(CX + 58, y + 7, name, 19, 'start', 'fp-small');
      set(E[keys[cue]], s);
    });
  }
  function spiCard(p) {
    let s = card(CX, 64, CWD, 322);
    s += T(MID, 94, tx('levensduur (cycli)', 'life (cycles)'), 19, 'middle', 'fp-small');
    const rows = [['101', '≥ 1M', 1], ['102', '≤ 1M', 0.8], ['103', '< 500k', 0.5], ['104', '< 100k', 0.18], ['105', '~500', 0.04]];
    const x0 = CX + 136;
    const x1 = CX + CWD - 18;
    rows.forEach(([cls, life, f], i) => {
      const y = 112 + i * 34;
      const on = cls === '101' || cls === '103';
      s += T(CX + 16, y + 18, cls, 19, 'start', on ? 'fp-big' : 'fp-small');
      s += T(CX + 62, y + 18, life, 19, 'start', 'fp-small');
      s += R(x0, y + 4, (x1 - x0) * f * span(p, 0.05, 0.4), 18, on ? 'fp-meter' : 'fp-meter2', 3);
    });
    // the job: 750.000 shots
    const xj = x0 + (x1 - x0) * 0.75;
    s += mark(M([[xj, 106], [xj, 282]]), 'fp-arrow') + T(CX + CWD - 12, 302, tx('750k nodig', '750k needed'), 19, 'end', 'fp-small');
    if (p > 0.45) {
      s += T(MID, 326, `A · 103: 2 × €${num(C.NEW.A.price)}`, 19, 'middle', 'fp-small') + T(MID, 346, `= €${num((2 * C.NEW.A.price) / C.NEW.parts, 3)} ${tx('per stuk', 'a part')}`, 19, 'middle', 'fp-big');
      s += T(MID, 370, `B · 101: €${num(C.NEW.B.price / C.NEW.parts, 3)} ${tx('per stuk', 'a part')}`, 19, 'middle', 'fp-big');
    }
    return s;
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['chC', 'tlC', 'pmC', 'cntC', 'smC', 'shC', 'planC', 'wearC', 'logC', 'lastC', 'setC', 'roadC', 'spiC'];
  const hudOnly = (list) => { for (const key of HUD) show(E[key], list.includes(key)); };
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    camW = introCamera(E.world, C.KEYS[si], d, u, W, H).w;
    let open = 0;
    let ej = 0;
    let drop = 0;
    let runDrop = -1; // -1: the runner falls with the parts
    let F = 1;
    let solid = 1;
    let hot = false;
    let vent = false;
    let draft = false;
    let undercut = false;
    let water = false;
    let sim = 0;
    let snap = false;
    let count = 0;
    let hud = [];

    if (si === 0) {
      F = 0; solid = 0;
      if (kb === 1) F = lerp(0, 0.14, span(p, 0.1, 0.8));
      if (kb === 2) F = lerp(0.14, 0.38, span(p, 0.05, 0.75));
      if (kb === 3) { F = lerp(0.38, 1, span(p, 0.02, 0.7)); solid = 0.5 * span(p, 0.5, 1); vent = true; }
      if (kb === 4) { F = 1; solid = 0.5 + 0.5 * span(p, 0, 0.2); open = span(p, 0.2, 0.55); ej = span(p, 0.62, 0.8); }
    }
    if (si === 1) {
      if (kb === 0) { open = span(p, 0.1, 0.35); ej = span(p, 0.4, 0.55); drop = span(p, 0.6, 0.95); hud = ['chC']; }
      if (kb >= 1) { hot = true; F = kb === 1 ? span(p, 0.2, 0.8) : 1; solid = kb === 1 ? 0 : 0.6; hud = ['chC']; }
    }
    if (si === 2) {
      if (kb === 0) { hud = ['tlC']; F = span(p, 0.55, 0.85); solid = 0; }
      if (kb === 1 || kb === 2) {
        hud = kb === 1 ? ['cntC'] : ['cntC', 'pmC'];
        const cyc = kb === 1 ? (p * 2.5) % 1 : 0.9;
        open = kb === 1 ? span(cyc, 0.55, 0.7) - span(cyc, 0.85, 0.98) : 0;
        count = kb === 1 ? 49820 + Math.floor(p * 2.5) * 2 : 50000;
        F = 1;
      }
      if (kb >= 3) hud = ['smC'];
    }
    if (si === 3) {
      if (kb === 1) { open = span(p, 0.05, 0.35); ej = span(p, 0.4, 0.6); snap = open > 0.25; drop = span(p, 0.62, 0.95); runDrop = span(p, 0.7, 1); }
      if (kb === 2) hud = ['shC'];
      if (kb === 3) water = true;
    }
    if (si === 4) {
      if (kb === 0) { open = span(p, 0.05, 0.35); ej = span(p, 0.45, 0.7); }
      if (kb === 1) { open = 1; ej = 1; drop = 1; draft = true; }
      if (kb === 2) { undercut = true; }
      if (kb === 3) { open = span(p, 0.05, 0.6); ej = span(p, 0.72, 0.92); }
    }
    if (si === 5) {
      if (kb === 0) { hud = ['planC']; }
      if (kb === 1) hud = ['wearC'];
      if (kb === 2) hud = ['logC'];
      if (kb === 3) { hud = ['lastC']; open = span(p, 0.05, 0.3); ej = span(p, 0.35, 0.5); }
    }
    if (si === 6) hud = ['setC'];
    if (si === 7) {
      hud = kb === 2 ? ['spiC'] : ['roadC'];
      if (kb === 1) { F = span(p, 0.05, 0.85); solid = 0; sim = span(p, 0.2, 0.9); }
      if (kb === 3) { F = span(p, 0.1, 0.6); solid = span(p, 0.6, 0.9); }
    }

    const off = OPEN * open;
    const lift = PIN_TAN * Math.min(off, PIN_A.b[0] - SLIDE.x0);
    move(E.mov, [off, 0, 0]);
    move(E.pins, [off - EJ_STROKE * ej, 0, 0]);
    move(E.slideT, [off, 0, lift]);
    move(E.slideB, [off, 0, -lift]);
    const m = melt(F, hot);
    set(E.sprM, meltSvg(m.spr, solid));
    set(E.runM, meltSvg(m.run, solid));
    const ring = si === 3 && kb === 0 ? [1, -1].map((s) => { const [cx, cy] = sp(-1.5, s * 47); return `<circle class="fp-dash" cx="${f1(cx)}" cy="${f1(cy)}" r="${f1((9 * camW) / W * 3)}"/>`; }).join('') : '';
    set(E.gateM, meltSvg(m.gate, solid) + ring);
    set(E.partM, meltSvg(partD(m.part), solid));
    const ejx = off - EJ_STROKE * ej;
    move(E.meltAll, [ejx, 0, 0]);
    // after ejection the parts (and the runner, a moment later when it snapped off) fall into the tote
    const rd = runDrop < 0 ? drop : runDrop;
    move(E.partFall, [snap ? -2 : 0, 0, -260 * drop * drop]);
    fade(E.partFall, 1 - span(drop, 0.5, 1));
    move(E.runFall, [0, 0, -260 * rd * rd]);
    fade(E.runFall, 1 - span(rd, 0.5, 1));
    show(E.hot, hot);
    show(E.hotTop, hot);
    show(E.bush, !hot);
    set(E.vent, vent && off < 1 ? ventSvg() : '');
    set(E.draft, draft ? draftSvg() : '');
    move(E.draft, [off, 0, 0]);
    set(E.undercut, undercut ? undercutSvg() : '');
    set(E.edge, si === 3 && kb === 0 ? tunnelLabel() : '');
    set(E.fillC, simSvg(sim));
    set(E.flow, water ? waterSvg() : '');
    move(E.flow, [off, 0, 0]);

    if (hud.includes('chC')) chCard(kb);
    if (hud.includes('tlC')) set(E.tlBody, tlCard(p));
    if (hud.includes('cntC')) set(E.cntBody, cntCard(count));
    if (hud.includes('pmC')) set(E.pmBody, pmCard(p));
    if (hud.includes('smC')) set(E.smBody, smCard(kb, p));
    if (hud.includes('shC')) set(E.shBody, shCard(p));
    if (hud.includes('planC')) set(E.planBody, planCard(p));
    if (hud.includes('wearC')) set(E.wearBody, wearCard());
    if (hud.includes('logC')) set(E.logBody, logCard(p));
    if (hud.includes('lastC')) set(E.lastBody, lastCard());
    if (hud.includes('setC')) setCard(kb, p);
    if (hud.includes('roadC')) roadCard(kb, p);
    if (hud.includes('spiC')) set(E.spiBody, spiCard(p));
    hudOnly(hud);
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
