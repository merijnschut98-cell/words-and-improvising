// The stage of the film "Hoe een fout ontstaat / How a defect forms": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope), a preamble from build.mjs that defines P (projection),
// C (world constants, the model, the beat cameras), W and H, and the kit's
// audio warp.
//
// The world is an open mould half lying parting face up, so the melt, its flow
// front and every defect are drawn per frame on the parting plane (z = 0);
// beside it a cover warps on a measuring plate. Cards over it are drawn in
// stage space. The beat on screen (and how far through it) comes from the
// caption beat starts, so a move lands on the line that names it.
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
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const attr = (e, name, v) => { if (e['__' + name] !== v) { e.setAttribute(name, v); e['__' + name] = v; } };
  const move = (e, by) => attr(e, 'transform', translateAlong(P, by));
  const fade = (e, a) => { const v = String(Math.round(clamp(a, 0, 1) * 100) / 100); if (e.style.opacity !== v) e.style.opacity = v; };
  const M = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
  const mark = (d, cls = 'fp-mark', extra = '') => (d ? `<path class="${cls}" d="${d}"${extra}/>` : '');
  // world helpers on a plane z
  const onZ = (pts, z, closed = true) => pathOf(pts.map(([x, y]) => at([x, y, z])), closed);
  const ringXY = (cx, cy, r, n = 20) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cy + r * Math.sin((i / n) * Math.PI * 2)]);
  // stage-space text and shapes (cards); sizes are stage units, 640 wide
  const T = (x, y, text, size = 20, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink fp-tx ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
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
  const wArrow = (a, b, cls = 'fp-arrow') => { const [x0, y0] = at(a); const [x1, y1] = at(b); return arrow(x0, y0, x1, y1, (8 * camW) / W, cls); };
  const tick = (x, y) => mark(`M${f1(x)} ${f1(y)}l6 6l12 -14`, 'fp-arrow');

  // ------------------------------------------------------------ the melt in the cavity
  const { CAV, RUN, GATE, PIN, RIBS, VENTS } = C;
  const GX = CAV.x0; // the gate, centre of the radial flow
  const LFULL = Math.hypot(CAV.x1 - CAV.x0, CAV.y1);
  const RUN_SHARE = 0.08;
  const Lof = (F) => (F <= RUN_SHARE ? 0 : ((F - RUN_SHARE) / (1 - RUN_SHARE)) * LFULL);
  const Fof = (L) => RUN_SHARE + (L / LFULL) * (1 - RUN_SHARE);
  const PIN_BACK = PIN.x + PIN.r;
  // the front at height y for flow length L: radial from the gate, lagging in the pin's shadow
  function frontX(y, L) {
    if (Math.abs(y) >= L) return null;
    let x = GX + Math.sqrt(L * L - y * y);
    if (x > PIN_BACK) x -= 22 * Math.exp(-((y / PIN.r) ** 2)) * clamp(1 - (x - PIN_BACK) / 55, 0, 1);
    return Math.min(CAV.x1, Math.max(GX, x));
  }
  const YS = Array.from({ length: 49 }, (_, i) => CAV.y0 + ((CAV.y1 - CAV.y0) * i) / 48);
  function meltSvg(F, solid) {
    if (F <= 0) return '';
    let d = '';
    // runner, from the sprue puller to the gate
    const xr = lerp(RUN.x0, GATE.x1, clamp(F / RUN_SHARE, 0, 1));
    d += onZ(ringXY(RUN.x0, 0, 6.2, 16), 0.02);
    d += onZ([[RUN.x0, -RUN.h], [Math.min(xr, RUN.x1), -RUN.h], [Math.min(xr, RUN.x1), RUN.h], [RUN.x0, RUN.h]], 0.02);
    if (xr > GATE.x0) d += onZ([[GATE.x0, -GATE.h], [xr, -GATE.h], [xr, GATE.h], [GATE.x0, GATE.h]], 0.02);
    const L = Lof(F);
    let front = '';
    if (L > 0.5) {
      const ym = Math.min(L, CAV.y1);
      const pts = [[GX, -ym]];
      const fr = [];
      let run = [];
      for (const y of YS) {
        if (Math.abs(y) > ym) continue;
        const x = frontX(y, L);
        pts.push([x, y]);
        if (x < CAV.x1 - 0.3 && x > GX + 0.3) run.push([x, y]); else if (run.length) { fr.push(run); run = []; }
      }
      if (run.length) fr.push(run);
      pts.push([GX, ym]);
      d += onZ(pts, 0.02);
      front = fr.filter((r) => r.length > 1).map((r) => onZ(r, 0.06, false)).join('');
    }
    const so = solid > 0 ? `<path class="fp-solid" style="opacity:${(0.85 * solid).toFixed(2)}" d="${d}"/>` : '';
    return { melt: `<path class="fp-melt" d="${d}"/>${so}`, front };
  }
  // air still in the cavity ahead of the front, as stipple
  const AIR = (() => { const out = []; for (let x = 52; x <= 98; x += 5.5) for (let y = -46; y <= 46; y += 6.5) out.push([x + ((y * 7) % 3), y]); return out; })();
  function airSvg(L, push = 0) {
    const pts = AIR.filter(([x, y]) => { const f = frontX(y, L); return f === null ? x > GX + L + 4 : x > f + 3; })
      .map(([x, y]) => [x + push * (VENTS.some((v) => Math.abs(v - y) < 8) ? 30 : 0), y]);
    return pts.map(([x, y]) => { const [sx, sy] = at([x, y, 0.1]); return `<circle class="fp-airdot" cx="${f1(sx)}" cy="${f1(sy)}" r="1"/>`; }).join('');
  }
  const blob = (cx, cy, r, seed) => ringXY(cx, cy, 1, 14).map(([x, y], i) => [cx + (x - cx) * r * (0.75 + 0.35 * Math.sin(i * 2.3 + seed)), cy + (y - cy) * r * (0.75 + 0.35 * Math.cos(i * 1.7 + seed))]);
  const burnSvg = (a) => (a > 0.02 ? [[CAV.x1 - 4, CAV.y0 + 4, 1], [CAV.x1 - 4, CAV.y1 - 4, 2], [CAV.x1 - 3, 22, 3]].map(([x, y, s]) => `<path class="fp-burn" style="opacity:${(0.9 * a).toFixed(2)}" d="${onZ(blob(x, y, 2 + 5 * a, s), 0.08)}"/>`).join('') : '');
  // flash: a thin fin out of the cavity onto the parting face at the worn corner
  const FC = [CAV.x1, CAV.y0];
  function flashSvg(a) {
    if (a <= 0.02) return '';
    const [cx, cy] = FC;
    const pts = [[cx - 30, cy], [cx - 24, cy - 6 * a], [cx - 10, cy - 14 * a], [cx + 6 * a, cy - 17 * a], [cx + 16 * a, cy - 8 * a], [cx + 17 * a, cy + 8], [cx + 9 * a, cy + 22], [cx, cy + 30], [cx, cy]];
    return `<path class="fp-film" d="${onZ(pts, 0.12)}"/>`;
  }
  const wearSvg = (a) => (a > 0.02 ? `<path class="fp-wear" d="${onZ(blob(FC[0] + 2, FC[1] - 2, 6 + 17 * a, 0.6), 0.04)}"/>` : '');
  // silver streaks fanning out from the gate
  function splaySvg(a) {
    if (a <= 0.02) return '';
    const segs = [];
    for (let i = 0; i < 11; i++) {
      const ang = -0.95 + (1.9 * i) / 10;
      const r0 = 10 + (i % 3) * 5;
      const r1 = r0 + (26 + ((i * 13) % 22)) * a;
      segs.push(onZ([[GX + r0 * Math.cos(ang), r0 * Math.sin(ang)], [GX + r1 * Math.cos(ang), r1 * Math.sin(ang)]], 0.1, false));
    }
    return `<path class="fp-splay" d="${segs.join('')}"/>`;
  }
  // the weld line behind the core pin, once the two fronts have met
  function weldSvg(L) {
    const xf = frontX(0, L);
    if (xf === null || xf < PIN_BACK + 3) return '';
    const x1 = Math.min(xf - 1, 72);
    return x1 > PIN_BACK + 1 ? mark(onZ([[PIN_BACK + 0.5, 0], [x1, 0]], 0.1, false), 'fp-mark fp-weld') : '';
  }
  // jetting: a snake from the small gate into the empty cavity
  function jetSvg(a) {
    if (a <= 0.02) return '';
    const pts = [];
    const len = 95 * a;
    for (let s = 0; s <= len; s += 1.5) pts.push([GX + s, 10 * Math.sin(s / 6.5) * Math.min(1, s / 18)]);
    const d = onZ(pts, 0.1, false);
    return `<path class="fp-jet-edge" d="${d}"/><path class="fp-jet" d="${d}"/>`;
  }
  const ribSvg = () => RIBS.map((x) => `<path class="fp-zone" d="${onZ([[x, CAV.y0], [x + 6, CAV.y0], [x + 6, CAV.y1], [x, CAV.y1]], 0.1)}"/>`).join('');
  const clogSvg = () => VENTS.map((y) => `<path class="fp-clog" d="${onZ([[CAV.x1, y - 5], [CAV.x1 + 14, y - 5], [CAV.x1 + 14, y + 5], [CAV.x1, y + 5]], 0.03)}"/>`).join('');
  // holding pressure: arrows push melt in through the gate
  const packSvg = (a) => (a > 0.02 ? `<g style="opacity:${a.toFixed(2)}">${wArrow([RUN.x0 + 8, 0, 3], [GATE.x0 - 2, 0, 3])}${[-22, 0, 22].map((y) => wArrow([GX + 8, y * 0.3, 3], [GX + 40, y, 3])).join('')}</g>` : '');

  // ------------------------------------------------------------ the cover on the measuring plate
  const PC = { x: 336, y: 0 }; // its centre
  function partSvg(bow, fibres) {
    const N = 20;
    const t = 4;
    const z0 = C.MP_TOP;
    const xs = Array.from({ length: N + 1 }, (_, i) => -100 + (200 * i) / N);
    const zb = (x) => z0 + bow * (x / 100) ** 2;
    const P3 = (x, y, z) => at([PC.x + x, PC.y + y, z]);
    const topPts = [...xs.map((x) => P3(x, -50, zb(x) + t)), ...xs.slice().reverse().map((x) => P3(x, 50, zb(x) + t))];
    const frontPts = [...xs.map((x) => P3(x, 50, zb(x))), ...xs.slice().reverse().map((x) => P3(x, 50, zb(x) + t))];
    const endPts = [P3(100, -50, zb(100)), P3(100, 50, zb(100)), P3(100, 50, zb(100) + t), P3(100, -50, zb(100) + t)];
    let s = `<path class="fp-ps" d="${pathOf(frontPts, true)}"/><path class="fp-ps" d="${pathOf(endPts, true)}"/><path class="fp-pt" d="${pathOf(topPts, true)}"/>`;
    // the hole and the gate vestige on top
    s += `<path class="fp-mark" d="${pathOf(ringXY(-20, 0, 12, 20).map(([x, y]) => P3(x, y, zb(x) + t + 0.05)), true)}"/>`;
    if (fibres > 0) {
      const segs = [];
      for (let y = -40; y <= 40; y += 10) for (let x = -94 + ((y / 10) % 2 ? 6 : 0); x < 90; x += 16) segs.push(pathOf([P3(x, y, zb(x) + t + 0.1), P3(x + 9, y, zb(x + 9) + t + 0.1)]));
      s += `<path class="fp-fibre" style="opacity:${fibres.toFixed(2)}" d="${segs.join('')}"/>`;
    }
    return s;
  }

  // ------------------------------------------------------------ cards
  const CX = 380;
  const CWD = 250;
  function sinkBase() {
    return card(CX, 14, CWD, 330) + T(CX + CWD / 2, 44, tx('doorsnede over een rib', 'section through a rib'), 20, 'middle', 'fp-small');
  }
  // the wall over a rib: the skin freezes inward, the hot core keeps shrinking and pulls a dent
  function sinkBody(p) {
    const x0 = CX + 22;
    const x1 = CX + CWD - 22;
    const rx0 = CX + CWD / 2 - 26;
    const rx1 = CX + CWD / 2 + 26;
    const y0 = 104;
    const y1 = 146;
    const yb = 300;
    const dent = 15 * span(p, 0.25, 0.95);
    const yTop = (x) => y0 + dent * Math.exp(-(((x - (rx0 + rx1) / 2) / 30) ** 2));
    const topEdge = [];
    for (let x = x0; x <= x1 + 0.1; x += 6) topEdge.push([x, yTop(x)]);
    const outline = [...topEdge, [x1, y1], [rx1, y1], [rx1, yb], [rx0, yb], [rx0, y1], [x0, y1]];
    const s0 = 3 + 9 * span(p, 0, 0.8);
    let s = `<path class="fp-shape2" d="${M(outline)}Z"/>`;
    // the hot core: what is still molten inside the frozen skin
    const core = [];
    const wallCore = y1 - s0 > y0 + s0 + dent * 0.6;
    if (wallCore) {
      for (let x = x0 + s0; x <= x1 - s0 + 0.1; x += 6) core.push([x, yTop(x) + s0]);
      core.push([x1 - s0, y1 - s0], [rx1 - s0, y1 - s0]);
    } else core.push([rx1 - s0, (y0 + y1) / 2 + dent * 0.7]);
    core.push([rx1 - s0, yb - s0], [rx0 + s0, yb - s0]);
    if (wallCore) core.push([rx0 + s0, y1 - s0], [x0 + s0, y1 - s0]); else core.push([rx0 + s0, (y0 + y1) / 2 + dent * 0.7]);
    s += `<path class="fp-hot" d="${M(core)}Z"/>`;
    // the shrinking core pulls the skin above it down: the dent
    const xm = (rx0 + rx1) / 2;
    s += arrow(xm, y0 + dent + 10, xm, 196, 7);
    s += T(x0, y0 - 14, dent > 4 ? tx('deukje', 'dent') : '', 20, 'start', 'fp-big') + (dent > 4 ? mark(M([[x0 + 64, y0 - 18], [xm - 12, y0 + dent * 0.6]]), 'fp-dash') : '');
    s += T(x0, y1 + 34, tx('huid', 'skin'), 20, 'start');
    s += T(rx1 + 8, 226, tx('hete kern', 'hot core'), 20, 'start');
    return s;
  }
  const voidBody = (a) => (a > 0.02 ? `<ellipse class="fp-bore" cx="${CX + CWD / 2}" cy="244" rx="${f1(7 * a)}" ry="${f1(14 * a)}"/>${T(CX + CWD - 16, 318, tx('vacuümbel', 'void'), 20, 'end', 'fp-big')}${mark(M([[CX + CWD - 60, 300], [CX + CWD / 2 + 8, 254]]), 'fp-dash')}` : '');

  function askBody(p) {
    const rows = [tx('welke holte?', 'which cavity?'), tx('waar op het product?', 'where on the part?'), tx('elk shot of af en toe?', 'every shot or sometimes?'), tx('sinds wanneer?', 'since when?')];
    let s = card(CX, 14, CWD, 300);
    rows.forEach((r, i) => {
      const y = 70 + i * 66;
      const on = p >= i * 0.18;
      s += `<circle class="${on ? 'fp-shape2' : 'fp-shape'}" cx="${CX + 24}" cy="${y - 6}" r="14"/>` + T(CX + 24, y + 1, String(i + 1), 19, 'middle', 'fp-big');
      s += on ? T(CX + 44, y + 1, r, 19, 'start') : '';
    });
    return s;
  }
  // four cavities; cavity 2 short now and then
  function cav4Body(p) {
    let s = card(CX, 14, CWD, 372) + T(CX + CWD / 2, 44, tx('viervoudige matrijs', 'four-cavity mould'), 20, 'middle', 'fp-small');
    const flick = Math.floor(p * 9) % 3 === 1;
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([c, r], i) => {
      const x = CX + 24 + c * 106;
      const y = 64 + r * 74;
      s += R(x, y, 96, 58, 'fp-shape', 5);
      const short = i === 1 && flick;
      s += R(x + 4, y + 4, short ? 62 : 88, 50, 'fp-hot', 3) + T(x + 48, y + 37, String(i + 1), 20, 'middle', 'fp-big');
      if (i === 1) s += R(x - 4, y - 4, 104, 66, 'fp-dash', 7);
    });
    s += T(CX + CWD / 2, 250, tx(`1 op ${C.DIAG.every} shots = ${num(C.SHOTS_PCT)}%`, `1 in ${C.DIAG.every} shots = ${num(C.SHOTS_PCT)}%`), 20);
    s += T(CX + CWD / 2, 290, `${num(C.SHOTS_PCT)}% ÷ ${C.DIAG.cavities} = ${num(C.PARTS_PCT, 2)}%`, 24, 'middle', 'fp-big');
    s += T(CX + CWD / 2, 326, tx('van alle producten', 'of all parts'), 20, 'middle', 'fp-small');
    return s;
  }
  // a fill study: one part per step, the front further each time
  function studyBody(p) {
    let s = card(CX, 14, CWD, 372) + T(CX + CWD / 2, 44, tx('vulstudie', 'fill study'), 20, 'middle', 'fp-small');
    C.STUDY.forEach((pc, i) => {
      if (p < i * 0.2) return;
      const x = CX + 20;
      const y = 66 + i * 76;
      const w = 150;
      const h = 54;
      s += R(x, y, w, h, 'fp-shape', 4);
      // the filled part, gated at the left edge: the front at pc % of the length, bulging in the middle
      const fx = (w * pc) / 100;
      const pts = [];
      for (let k = 0; k <= 16; k++) { const yy = -h / 2 + (h * k) / 16; pts.push([x + Math.min(w, fx + 4 - 12 * ((2 * yy) / h) ** 2), y + h / 2 + yy]); }
      s += `<path class="fp-hot" d="${M([[x, y], ...pts, [x, y + h]])}Z"/>`;
      s += `<circle class="fp-shape2" cx="${f1(x + w * 0.4)}" cy="${f1(y + h / 2)}" r="6"/>`;
      s += T(CX + CWD - 18, y + h / 2 + 8, `${pc}%`, 22, 'end', 'fp-big');
    });
    return s;
  }
  function logBody(p) {
    let s = card(CX, 14, CWD, 372) + T(CX + CWD / 2, 44, tx('logboek', 'log'), 20, 'middle', 'fp-small');
    const rows = [
      [tx('één wijziging tegelijk', 'one change at a time'), ''],
      [tx('druk of snelheid:', 'pressure or speed:'), tx('wacht ~10 shots', 'wait ~10 shots')],
      [tx('temperatuur:', 'temperature:'), tx(`wacht ${C.WAIT_T[0]}–${C.WAIT_T[1]} min`, `wait ${C.WAIT_T[0]}–${C.WAIT_T[1]} min`)],
      [tx('hielp het niet?', 'did not help?'), tx('terugdraaien', 'undo it')],
    ];
    rows.forEach(([a, b], i) => {
      const y = 80 + i * 76;
      if (p < i * 0.2) return;
      s += T(CX + 18, y, a, 19, 'start') + (b ? T(CX + CWD - 18, y + 28, b, 19, 'end', 'fp-big') : tick(CX + CWD - 40, y + 14));
      if (i < 3) s += mark(M([[CX + 14, y + 44], [CX + CWD - 14, y + 44]]), 'fp-dash');
    });
    return s;
  }
  function sampleBody() {
    let s = card(CX, 14, CWD, 330) + T(CX + CWD / 2, 44, tx('grensmonster', 'boundary sample'), 20, 'middle', 'fp-big');
    const x = CX + 26;
    const y = 76;
    s += R(x, y, 150, 80, 'fp-shape', 5) + `<circle class="fp-shape2" cx="${x + 56}" cy="${y + 40}" r="10"/>`;
    s += mark(M([[x + 67, y + 40], [x + 120, y + 40]]), 'fp-dash');
    // the tag on a string, signed
    s += mark(M([[x + 150, y + 20], [x + 178, y + 66]]));
    s += R(x + 160, y + 66, 52, 86, 'fp-shape2', 5) + `<circle class="fp-shape" cx="${x + 186}" cy="${y + 78}" r="4"/>`;
    s += mark(M([[x + 168, y + 100], [x + 204, y + 100]]) + M([[x + 168, y + 114], [x + 196, y + 114]]), 'fp-dash') + tick(x + 174, y + 130);
    s += T(CX + CWD / 2, 262, tx('bindnaad net zichtbaar', 'weld line just visible'), 19, 'middle', 'fp-small');
    s += T(CX + CWD / 2, 288, tx('op armlengte', 'at arm’s length'), 19, 'middle', 'fp-small');
    s += T(CX + CWD / 2, 322, tx('getekend door kwaliteit', 'signed by quality'), 19, 'middle', 'fp-big');
    return s;
  }
  function shrinkBody(p) {
    let s = card(CX, 76, CWD, 310) + T(CX + CWD / 2, 106, tx('krimp per richting', 'shrinkage per direction'), 20, 'middle', 'fp-small');
    const x = CX + 40;
    const y = 128;
    const w = 170;
    const h = 86;
    const e = span(p, 0.1, 0.7);
    // the steel (dashed) and the part after shrinking, the difference drawn 25 × enlarged
    s += R(x, y, w, h, 'fp-dash', 3);
    const dl = ((C.STEEL.L - C.PART.L) / C.SH.L) * 25 * w * e;
    const dw = ((C.STEEL.W - C.PART.W) / C.SH.W) * 25 * h * e;
    s += R(x + dl / 2, y + dw / 2, w - dl, h - dw, 'fp-shape', 3);
    s += mark([0, 1, 2, 3, 4].map((i) => M([[x + 20 + dl / 2, y + 16 + i * 14], [x + w - 20 - dl / 2, y + 16 + i * 14]])).join(''), 'fp-dash');
    s += arrow(x - 26, y + h / 2, x - 4, y + h / 2, 7);
    s += T(CX + CWD / 2, 254, tx(`langs ${num(C.SH.along * 100, 1)}% · dwars ${num(C.SH.across * 100, 1)}%`, `along ${num(C.SH.along * 100, 1)}% · across ${num(C.SH.across * 100, 1)}%`), 19);
    s += T(CX + CWD / 2, 296, tx(`staal ${num(C.STEEL.L, 1)} → ${num(C.PART.L, 1)} mm`, `steel ${num(C.STEEL.L, 1)} → ${num(C.PART.L, 1)} mm`), 20, 'middle', 'fp-big');
    s += T(CX + CWD / 2, 334, tx(`staal ${num(C.STEEL.W, 1)} → ${num(C.PART.W, 1)} mm`, `steel ${num(C.STEEL.W, 1)} → ${num(C.PART.W, 1)} mm`), 20, 'middle', 'fp-big');
    s += T(CX + CWD / 2, 368, tx('verschil 25 × vergroot', 'difference 25 × enlarged'), 19, 'middle', 'fp-small');
    return s;
  }
  // a box in section: the core, the part's walls, the hot inside corners; the walls lean in
  function cornerBody(p) {
    let s = card(CX, 76, CWD, 310) + T(CX + CWD / 2, 106, tx('bak in doorsnede', 'box in section'), 20, 'middle', 'fp-small');
    const cx = CX + CWD / 2;
    const yb = 296;
    const out = span(p, 0.45, 0.75);
    const lean = 7 * span(p, 0.55, 0.95) * Math.PI / 180;
    const wallH = 140;
    const half = 80;
    const t = 12;
    // the core, pulled out of the part as the beat goes on
    s += `<g style="opacity:${f1(1 - out)}">${R(cx - half + t, yb - wallH - 30 - 60 * out, 2 * (half - t), wallH + 30 - t, 'fp-shape', 2)}</g>`;
    const wall = (sx) => {
      const bx = cx + sx * half;
      const ix = bx - sx * t;
      const topOff = Math.sin(lean) * wallH;
      return `<path class="fp-shape2" d="${M([[bx, yb], [ix, yb - t], [ix - sx * topOff, yb - wallH], [bx - sx * topOff, yb - wallH]])}Z"/>`;
    };
    s += R(cx - half, yb - t, 2 * half, t, 'fp-shape2', 0) + wall(-1) + wall(1);
    s += `<circle class="fp-zone" cx="${cx - half + t + 6}" cy="${yb - t - 6}" r="13"/><circle class="fp-zone" cx="${cx + half - t - 6}" cy="${yb - t - 6}" r="13"/>`;
    if (lean > 0.01) s += T(cx, yb + 38, tx('ontworpen op 90°,', 'designed at 90°,'), 19, 'middle', 'fp-small') + T(cx, yb + 64, tx('wanden naar binnen', 'walls lean in'), 19, 'middle', 'fp-big');
    else s += T(cx, yb + 38, tx('warmte hoopt zich op', 'heat builds up'), 19, 'middle', 'fp-small') + T(cx, yb + 64, tx('in de binnenhoek', 'in the inside corner'), 19, 'middle', 'fp-big');
    return s;
  }
  function condBody(p) {
    let s = card(CX, 76, CWD, 310) + T(CX + CWD / 2, 106, tx('klimaatkast', 'climate cabinet'), 20, 'middle', 'fp-small');
    const x = CX + 34;
    const y = 124;
    s += R(x, y, 120, 184, 'fp-shape', 6) + R(x + 8, y + 8, 104, 168, 'fp-shape2', 3);
    s += [0, 1, 2].map((i) => mark(M([[x + 12, y + 56 + i * 46], [x + 108, y + 56 + i * 46]])) + R(x + 22, y + 44 + i * 46, 76, 10, 'fp-shape', 2)).join('');
    s += R(x + 132, y + 10, 64, 36, 'fp-shape2', 4);
    s += T(x + 164, y + 34, `${C.COND.T}°`, 20, 'middle', 'fp-big') + T(x + 164, y + 74, `${C.COND.rh}%`, 20, 'middle', 'fp-big');
    // the clock: 24 hours
    const a = -Math.PI / 2 + span(p, 0.1, 0.9) * Math.PI * 2;
    s += `<circle class="fp-shape2" cx="${x + 164}" cy="${y + 124}" r="24"/>` + mark(M([[x + 164, y + 124], [x + 164 + 18 * Math.cos(a), y + 124 + 18 * Math.sin(a)]]), 'fp-arrow');
    s += T(x + 164, y + 174, `${C.COND.h} h`, 20, 'middle', 'fp-big');
    s += T(CX + CWD / 2, 362, tx('daarna meten', 'then measure'), 19, 'middle', 'fp-small');
    return s;
  }
  function clockBody(p) {
    const cx = CX + CWD - 54;
    const cy = 74;
    const h = Math.round(span(p, 0.05, 0.85) * C.WAIT_H);
    const a = -Math.PI / 2 + (h / 12) * Math.PI * 2;
    return card(cx - 60, 14, 120, 120) + `<circle class="fp-shape2" cx="${cx}" cy="${cy - 6}" r="30"/>` + mark(M([[cx, cy - 6], [cx + 22 * Math.cos(a), cy - 6 + 22 * Math.sin(a)]]), 'fp-arrow') + T(cx, cy + 50, `${h} h`, 20, 'middle', 'fp-big');
  }
  function paretoBody(p) {
    let s = card(CX, 14, CWD, 330) + T(CX + CWD / 2, 44, tx('afkeur per fout', 'scrap by defect'), 20, 'middle', 'fp-small') + T(CX + CWD / 2, 334, tx('voorbeeld', 'example'), 19, 'middle', 'fp-small');
    const rows = [[tx('short shot', 'short shot'), 1], [tx('braam', 'flash'), 0.62], [tx('inzakplek', 'sink mark'), 0.34], [tx('kromtrekken', 'warpage'), 0.18], [tx('bindnaad', 'weld line'), 0.1]];
    const g = span(p, 0.05, 0.7);
    rows.forEach(([name, v], i) => {
      const y = 62 + i * 50;
      s += T(CX + 122, y + 24, name, 19, 'end');
      s += R(CX + 132, y + 6, 104 * v * g, 26, i === 0 ? 'fp-meter' : 'fp-meter2', 3);
    });
    return s;
  }
  // the 2 × 2 DOE: [time short/long][pressure low/high]
  const DX = CX + 92;
  const DY = 102;
  const CW = 70;
  const CH = 52;
  function doeBase() {
    let s = card(CX, 14, CWD, 372) + T(CX + CWD / 2, 42, tx('inzakdiepte, µm', 'sink depth, µm'), 19, 'middle', 'fp-small');
    s += T(DX + CW, 68, tx('nadruk', 'pressure'), 19, 'middle', 'fp-small') + T(DX + CW / 2, 94, tx('laag', 'low'), 19, 'middle', 'fp-small') + T(DX + CW * 1.5, 94, tx('hoog', 'high'), 19, 'middle', 'fp-small');
    s += T(DX - 10, DY + CH / 2 + 6, tx('kort', 'short'), 19, 'end', 'fp-small') + T(DX - 10, DY + CH * 1.5 + 6, tx('lang', 'long'), 19, 'end', 'fp-small');
    s += T(CX + 16, DY + CH + 6, tx('tijd', 'time'), 19, 'start', 'fp-small');
    return s;
  }
  function doeCells(p) {
    let s = '';
    [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([r, c], i) => {
      if (p < i * 0.18) return;
      const v = C.DOE[r][c];
      s += R(DX + c * CW + 2, DY + r * CH + 2, CW - 4, CH - 4, 'fp-shape', 4);
      s += R(DX + c * CW + 8, DY + r * CH + CH - 10, (CW - 16) * (v / 40), 4, 'fp-meter', 1);
      s += T(DX + c * CW + CW / 2, DY + r * CH + CH / 2 + 6, String(v), 22, 'middle', 'fp-big');
    });
    return s;
  }
  function doeMain() {
    const m = C.ME;
    return T(CX + 16, 238, tx(`druk ${m.pLo} → ${m.pHi}: ${num(m.pHi - m.pLo)}`, `pressure ${m.pLo} → ${m.pHi}: ${num(m.pHi - m.pLo)}`), 19, 'start')
      + T(CX + 16, 274, tx(`tijd ${m.tLo} → ${m.tHi}: ${num(m.tHi - m.tLo)}`, `time ${m.tLo} → ${m.tHi}: ${num(m.tHi - m.tLo)}`), 19, 'start', 'fp-big');
  }
  function doeInter() {
    const d = C.DOE;
    return mark(M([[CX + 14, 296], [CX + CWD - 14, 296]]), 'fp-dash')
      + T(CX + 16, 328, tx(`druk bij kort: ${num(d[0][1] - d[0][0])}`, `pressure, short: ${num(d[0][1] - d[0][0])}`), 19, 'start')
      + T(CX + 16, 362, tx(`druk bij lang: ${num(d[1][1] - d[1][0])}`, `pressure, long: ${num(d[1][1] - d[1][0])}`), 19, 'start');
  }
  // cavity pressure over one shot: filling, packing, cooling
  const PX0 = CX + 30;
  const PX1 = CX + CWD - 16;
  const PY0 = 246;
  const PY1 = 92;
  const cp = (t, peak = 1) => (t < 0.18 ? peak * 0.15 * (t / 0.18) + peak * 0.85 * Math.pow(t / 0.18, 3) : t < 0.5 ? peak * (1 - 0.12 * ((t - 0.18) / 0.32)) : peak * 0.88 * Math.exp(-(t - 0.5) * 5.5));
  const curveD = (to, peak = 1, jit = 0) => { const pts = []; for (let t = 0; t <= to + 1e-9; t += 0.02) pts.push([lerp(PX0, PX1, t), lerp(PY0, PY1, cp(t, peak) * (1 + jit * Math.sin(t * 9)))]); return pts.length > 1 ? M(pts) : ''; };
  function curveBase() {
    let s = card(CX, 14, CWD, 372) + T(CX + CWD / 2, 42, tx('holtedruk per shot', 'cavity pressure per shot'), 19, 'middle', 'fp-small');
    s += mark(M([[PX0, PY1 - 14], [PX0, PY0], [PX1, PY0]]));
    s += T(lerp(PX0, PX1, 0.09), PY0 + 28, tx('vul', 'fill'), 19, 'middle', 'fp-small') + T(lerp(PX0, PX1, 0.34), PY0 + 28, tx('nadruk', 'pack'), 19, 'middle', 'fp-small') + T(lerp(PX0, PX1, 0.76), PY0 + 28, tx('koelen', 'cool'), 19, 'middle', 'fp-small');
    return s;
  }
  const curveOne = (p) => mark(curveD(clamp(p / 0.8, 0, 1)), 'fp-curve');
  function curveLim(p) {
    let s = R(lerp(PX0, PX1, 0.16), lerp(PY0, PY1, 1.07), lerp(PX0, PX1, 0.5) - lerp(PX0, PX1, 0.16), lerp(PY0, PY1, 0.84) - lerp(PY0, PY1, 1.07), 'fp-band2', 2);
    s += [0.02, -0.025, 0.012].map((j) => mark(curveD(1, 1, j), 'fp-curve2')).join('');
    if (p > 0.35) {
      s += mark(curveD(1, 0.68), 'fp-dash');
      s += T(CX + CWD / 2, 310, tx('buiten de grens', 'outside the limit'), 19, 'middle', 'fp-small');
      s += arrow(CX + CWD / 2, 320, CX + CWD / 2, 342, 7) + T(CX + CWD / 2, 368, tx('klep → afkeur', 'flap → reject'), 19, 'middle', 'fp-big');
    }
    return s;
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['sinkC', 'askC', 'cav4C', 'studyC', 'logC', 'sampleC', 'shrinkC', 'cornerC', 'condC', 'paretoC', 'doeC', 'curveC', 'clockC'];
  const hudOnly = (list) => { for (const key of HUD) show(E[key], list.includes(key)); };
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };
  const SHORT = Fof(152);

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    camW = introCamera(E.world, C.KEYS[si], d, u, W, H).w;
    let F = 1;
    let solid = 0;
    let lift = 0;
    let air = false;
    let airPush = 0;
    let clog = false;
    let burn = 0;
    let flash = 0;
    let wear = 0;
    let splay = 0;
    let jet = 0;
    let rib = false;
    let pack = 0;
    let bow = 0;
    let fibres = 0;
    let hud = [];

    if (si === 0) {
      if (kb === 0) F = 0;
      if (kb === 1) F = span(p, 0.05, 0.9) * 0.62;
      if (kb === 2) { F = lerp(0.62, 1, span(p, 0.1, 0.85)); air = true; airPush = span(p, 0.2, 0.9); }
      if (kb === 3) { pack = 1 - span(p, 0.3, 0.45); solid = span(p, 0.2, 0.7); lift = span(p, 0.72, 0.95); }
    }
    if (si === 1) {
      if (kb === 0) F = lerp(0.3, SHORT, span(p, 0.05, 0.7));
      if (kb === 1) { F = SHORT; air = true; clog = true; }
      if (kb === 2) { F = lerp(SHORT, 1, span(p, 0.05, 0.5)); clog = true; air = F < 0.995; burn = span(p, 0.35, 0.9); }
    }
    if (si === 2) {
      if (kb === 0) { wear = 0.35; flash = span(p, 0.1, 0.8); }
      if (kb === 1) { wear = 0.35; flash = 1 - span(p, 0.15, 0.6); }
      if (kb === 2) { wear = lerp(0.35, 1, span(p, 0, 0.3)) * (1 - span(p, 0.6, 0.85)); flash = 1.25 * span(p, 0.05, 0.35) * (1 - span(p, 0.6, 0.85)); }
    }
    if (si === 3) {
      if (kb <= 1) { rib = kb === 0; hud = ['sinkC']; }
      if (kb === 2) F = lerp(0.35, 1, span(p, 0.05, 0.8));
      if (kb === 3) splay = span(p, 0.1, 0.7);
    }
    if (si === 4) {
      if (kb === 0) bow = 9 * span(p, 0.2, 0.9);
      if (kb === 1) { bow = lerp(9, 18, span(p, 0.05, 0.85)); hud = ['clockC']; }
      if (kb === 2) bow = 18;
    }
    if (si === 5) {
      if (kb === 0) hud = ['askC'];
      if (kb === 1) hud = ['cav4C'];
      if (kb === 2) {
        hud = ['studyC'];
        const step = clamp(Math.floor(p / 0.2), 0, 3);
        F = Fof((C.STUDY[step] / 100) * 1.0 * (Math.hypot(200, 50)));
      }
      if (kb === 3) { F = 0.08; jet = span(p, 0.05, 0.75); }
    }
    if (si === 6) hud = kb === 0 ? ['logC'] : ['sampleC'];
    if (si === 7) {
      bow = 14;
      fibres = 1;
      if (kb === 1) hud = ['shrinkC'];
      if (kb === 2) hud = ['cornerC'];
      if (kb === 3) hud = ['condC'];
    }
    if (si === 8) {
      if (kb === 0) hud = ['paretoC'];
      if (kb === 1 || kb === 2) hud = ['doeC'];
      if (kb === 3) { hud = ['curveC']; F = clamp(p / 0.25, 0, 1); }
      if (kb === 4) hud = ['curveC'];
    }

    const L = Lof(F);
    const m = meltSvg(F, solid);
    set(E.melt, m ? m.melt : '');
    set(E.front, m && F < 0.999 ? mark(m.front) : '');
    move(E.melt, [0, 0, 60 * lift]);
    fade(E.melt, 1 - span(lift, 0.6, 1));
    set(E.air, air ? airSvg(L, airPush) + (clog ? clogSvg() : '') : '');
    set(E.burn, burnSvg(burn));
    set(E.flash, flashSvg(flash));
    set(E.wear, wearSvg(wear));
    set(E.splay, splaySvg(splay));
    set(E.weld, F > 0.2 && lift < 0.1 ? weldSvg(L) : '');
    set(E.jet, jetSvg(jet));
    set(E.rib, rib ? ribSvg() : '');
    set(E.pack, packSvg(pack));
    set(E.part, partSvg(bow, fibres));

    if (hud.includes('sinkC')) { set(E.sinkBase, sinkBase()); set(E.sinkBody, sinkBody(kb === 0 ? p : 1)); set(E.voidBody, voidBody(kb === 1 ? span(p, 0.2, 0.7) : 0)); }
    if (hud.includes('askC')) set(E.askBody, askBody(p));
    if (hud.includes('cav4C')) set(E.cav4Body, cav4Body(p));
    if (hud.includes('studyC')) set(E.studyBody, studyBody(p));
    if (hud.includes('logC')) set(E.logBody, logBody(p));
    if (hud.includes('sampleC')) set(E.sampleBody, sampleBody());
    if (hud.includes('shrinkC')) set(E.shrinkBody, shrinkBody(p));
    if (hud.includes('cornerC')) set(E.cornerBody, cornerBody(p));
    if (hud.includes('condC')) set(E.condBody, condBody(p));
    if (hud.includes('clockC')) set(E.clockBody, clockBody(p));
    if (hud.includes('paretoC')) set(E.paretoBody, paretoBody(p));
    if (hud.includes('doeC')) { set(E.doeBase, doeBase()); set(E.doeCells, doeCells(kb === 1 ? p : 1)); set(E.doeMain, kb === 2 ? doeMain() : ''); set(E.doeInter, kb === 2 && p > 0.45 ? doeInter() : ''); }
    if (hud.includes('curveC')) { set(E.curveBase, curveBase()); set(E.curveOne, kb === 3 ? curveOne(p) : ''); set(E.curveLim, kb === 4 ? curveLim(p) : ''); }
    hudOnly(hud);
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
