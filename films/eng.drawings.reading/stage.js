// The stage of the film "Een tekening lezen / Reading a drawing": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants), CAM (one camera move per scene), W and H.
// Moves are placed per caption beat (beatStarts), so the video's narration
// timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, translateAlong, span, beatStarts */
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
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const xf = (e, t) => { if (e.__t !== t) { if (t) e.setAttribute('transform', t); else e.removeAttribute('transform'); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const txt = (x, y, t, size = 24, anchor = 'start', cls = 'tl-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'tl-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (d, cls = 'tl-ink', style = '') => `<path class="${cls}"${style ? ` style="${style}"` : ''} d="${d}"/>`;
  const line = (x0, y0, x1, y1, cls = 'tl-thin') => path(`M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}`, cls);
  const circle = (x, y, r, cls = 'tl-hole') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const tg = (x, y, body) => `<g transform="translate(${f1(x)} ${f1(y)})">${body}</g>`;
  const EX = tr('voorbeeld', 'example');
  const exTag = (x, y, anchor = 'start') => txt(x, y, EX, 24, anchor, 'tl-mute');
  // an arrow head at (x, y) pointing along (dx, dy)
  const head = (x, y, dx, dy, s = 7) => { const l = Math.hypot(dx, dy); const ux = dx / l; const uy = dy / l; return `M${f1(x - ux * s - uy * s * 0.5)} ${f1(y - uy * s + ux * s * 0.5)}L${f1(x)} ${f1(y)}L${f1(x - ux * s + uy * s * 0.5)} ${f1(y - uy * s - ux * s * 0.5)}`; };
  // a dimension: line from a to b with arrow heads, the text at its middle
  const dimH = (x0, x1, y, t, ty = y - 6) => path(`M${f1(x0)} ${f1(y)}L${f1(x1)} ${f1(y)}${head(x0, y, -1, 0)}${head(x1, y, 1, 0)}`, 'tl-thin') + txt((x0 + x1) / 2, ty, t, 24, 'middle', 'tl-big');
  const dimV = (x, y0, y1, t, tx = x + 6) => path(`M${f1(x)} ${f1(y0)}L${f1(x)} ${f1(y1)}${head(x, y0, 0, -1)}${head(x, y1, 0, 1)}`, 'tl-thin') + txt(tx, (y0 + y1) / 2 + 8, t, 24, 'start', 'tl-big');

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

  // ------------------------------------------------------------ the bracket's drawing (s1–s4)
  // Sheet 1,2 px per mm. Front view: 120 × 60 with its bottom-left at (244, 118);
  // left view (first angle: right of the front view) 50 × 60 from x 420; top
  // view (first angle: below) 120 × 50 from y 148, the upright at its top edge.
  const SC = 1.2;
  const FX = 244;
  const FB = 118;
  const LX = 420;
  const TY = 148;
  const fx = (mm) => FX + mm * SC;
  const fz = (mm) => FB - mm * SC;
  function shBase() {
    return rect(220, 12, 412, 376) + rect(228, 20, 396, 360, 'tl-sheetbg', 2) + exTag(616, 42, 'end');
  }
  function frontView(hl) {
    let out = path(`M${FX} ${FB}L${f1(fx(120))} ${FB}L${f1(fx(120))} ${f1(fz(60))}L${FX} ${f1(fz(60))}Z`, 'tl-fill');
    out += line(FX, fz(4), fx(120), fz(4), 'tl-ink');
    out += circle(fx(60), fz(35), 4.5 * SC);
    out += line(fx(60) - 9, fz(35), fx(60) + 9, fz(35), 'tl-chain') + line(fx(60), fz(35) - 9, fx(60), fz(35) + 9, 'tl-chain');
    out += op(hl, path(`M${f1(fx(60) - 4)} ${f1(fz(35) - 3)}L${f1(fx(22))} ${f1(fz(48))}`, 'tl-thin') + txt(fx(4), fz(42), 'Ø9', 24, 'start', 'tl-big'));
    return out;
  }
  // the L of the left view (the back on the right); section: hatched and cut
  // at the hole Ø9
  function leftView(section) {
    const x = (mm) => LX + mm * SC;
    const z = fz;
    const outer = `M${f1(x(0))} ${FB}L${f1(x(50) - 7 * SC)} ${FB}Q${f1(x(50))} ${FB} ${f1(x(50))} ${f1(z(7))}L${f1(x(50))} ${f1(z(60))}L${f1(x(46))} ${f1(z(60))}L${f1(x(46))} ${f1(z(7))}Q${f1(x(46))} ${f1(z(4))} ${f1(x(43))} ${f1(z(4))}L${f1(x(0))} ${f1(z(4))}Z`;
    if (!section) return path(outer, 'tl-fill');
    // cut at the hole: two hatched pieces, the hole's far wall as two lines between
    const lower = `M${f1(x(0))} ${FB}L${f1(x(50) - 7 * SC)} ${FB}Q${f1(x(50))} ${FB} ${f1(x(50))} ${f1(z(7))}L${f1(x(50))} ${f1(z(30.5))}L${f1(x(46))} ${f1(z(30.5))}L${f1(x(46))} ${f1(z(7))}Q${f1(x(46))} ${f1(z(4))} ${f1(x(43))} ${f1(z(4))}L${f1(x(0))} ${f1(z(4))}Z`;
    const upper = `M${f1(x(46))} ${f1(z(39.5))}L${f1(x(50))} ${f1(z(39.5))}L${f1(x(50))} ${f1(z(60))}L${f1(x(46))} ${f1(z(60))}Z`;
    return path(lower, 'tl-hatch') + path(upper, 'tl-hatch')
      + line(x(46), z(39.5), x(50), z(39.5), 'tl-ink') + line(x(46), z(30.5), x(50), z(30.5), 'tl-ink')
      + txt(x(25), fz(60) - 8, 'A-A', 24, 'middle', 'tl-big');
  }
  function topView() {
    let out = path(`M${FX} ${TY}L${f1(fx(120))} ${TY}L${f1(fx(120))} ${f1(TY + 50 * SC)}L${FX} ${f1(TY + 50 * SC)}Z`, 'tl-fill');
    out += line(FX, TY + 4 * SC, fx(120), TY + 4 * SC, 'tl-ink');
    for (const m of [25, 95]) out += circle(fx(m), TY + 30 * SC, 3.3 * SC + 0.4);
    return out;
  }
  // the cutting line A-A through the hole, arrows looking right (the section
  // is drawn right of the front view)
  function cutLine() {
    const x = fx(60);
    const y0 = fz(60) - 8;
    const y1 = FB + 8;
    return line(x, y0, x, y1, 'tl-chain')
      + path(`M${f1(x)} ${y0}L${f1(x + 14)} ${y0}${head(x + 14, y0, 1, 0, 6)}M${f1(x)} ${y1}L${f1(x + 14)} ${y1}${head(x + 14, y1, 1, 0, 6)}`, 'tl-ink', 'stroke-width:2')
      + txt(x + 18, y0 + 4, 'A', 24, 'start', 'tl-big') + txt(x + 18, y1 + 18, 'A', 24, 'start', 'tl-big');
  }
  // the dimensions: 120 under the top view, 50 beside it (with its general
  // tolerance band when tol > 0)
  function dims(tol) {
    let out = dimH(FX, fx(120), TY + 50 * SC + 12, '120', TY + 50 * SC + 38);
    out += dimV(fx(120) + 12, TY, TY + 50 * SC, '50', fx(120) + 18);
    if (tol > 0.01) out += op(tol, rect(fx(120) + 50, TY + 6, 150, 34, 'tl-accf', 4) + txt(fx(120) + 125, TY + 31, `${dec(49.7, 1)}–${dec(50.3, 1)}`, 24, 'middle', 'tl-on'));
    return out;
  }
  // the projection symbol for first angle: the cone (narrow end left) and its
  // view from the left, two circles, placed on the right
  function projSym(x, y, third) {
    const cone = `M${f1(x)} ${f1(y - 6)}L${f1(x + 22)} ${f1(y - 11)}L${f1(x + 22)} ${f1(y + 11)}L${f1(x)} ${f1(y + 6)}Z`;
    const cx = third ? x - 18 : x + 40;
    return path(cone, 'tl-ink') + line(x - 4, y, x + 26, y, 'tl-chain') + circle(cx, y, 11, 'tl-ink') + circle(cx, y, 6, 'tl-ink');
  }
  // the title block: 4 rows in 400..624 × 252..382
  function titleBlock() {
    let out = rect(400, 252, 224, 130, 'tl-paper', 2);
    out += line(400, 288, 624, 288, 'tl-grid') + line(400, 318, 624, 318, 'tl-grid') + line(400, 350, 624, 350, 'tl-grid') + line(484, 288, 484, 318, 'tl-grid') + line(548, 288, 548, 318, 'tl-grid');
    out += txt(408, 279, '4711-203', 24, 'start', 'tl-big') + txt(616, 279, tr('beugel', 'bracket'), 24, 'end', 'tl-txt');
    out += txt(408, 312, 'S235', 24, 'start', 'tl-big') + txt(516, 312, '1:1', 24, 'middle', 'tl-big');
    out += txt(408, 375, tr('revisie C', 'revision C'), 24, 'start', 'tl-big');
    return out;
  }
  const tbSym = () => projSym(558, 303);
  const tbGen = () => txt(408, 343, 'ISO 2768-m', 24, 'start', 'tl-big');
  // the revision table, bottom left (where the small iso view was)
  function revTable(rows) {
    const x = 236;
    const y = 252;
    let out = rect(x, y, 158, 100, 'tl-paper', 2) + line(x, y + 32, x + 158, y + 32, 'tl-grid') + line(x + 36, y, x + 36, y + 100, 'tl-grid');
    out += txt(x + 6, y + 24, 'rev', 22, 'start', 'tl-mute') + txt(x + 44, y + 24, tr('wijziging', 'change'), 22, 'start', 'tl-mute');
    out += op(rows, txt(x + 18, y + 59, 'B', 24, 'middle', 'tl-big') + txt(x + 44, y + 59, `Ø${dec(8.5, 1)} → Ø9`, 22, 'start', 'tl-txt')
      + line(x, y + 67, x + 158, y + 67, 'tl-grid') + txt(x + 18, y + 92, 'C', 24, 'middle', 'tl-big') + txt(x + 44, y + 92, 'R2 → R3', 22, 'start', 'tl-txt'));
    return out;
  }
  // detail of the bend at 5:1 (4 px per mm): inner R (2 → 3), outer R + 4
  function detail(r) {
    const cx = 540;
    const cy = 186;
    const s = 4;
    // the corner: the base along the bottom, the upright on the right
    const ox = cx + 14;
    const oy = cy + 14;
    const ri = r * s;
    const ro = (r + 4) * s;
    const out = `M${cx - 44} ${f1(oy)}L${f1(ox - ro)} ${f1(oy)}Q${f1(ox)} ${f1(oy)} ${f1(ox)} ${f1(oy - ro)}L${f1(ox)} ${cy - 44}`;
    const inn = `M${cx - 44} ${f1(oy - 16)}L${f1(ox - 16 - ri)} ${f1(oy - 16)}Q${f1(ox - 16)} ${f1(oy - 16)} ${f1(ox - 16)} ${f1(oy - 16 - ri)}L${f1(ox - 16)} ${cy - 44}`;
    return `<clipPath id="dr-dc"><circle cx="${cx}" cy="${cy}" r="44"/></clipPath>` + circle(cx, cy, 44, 'tl-paper')
      + `<g clip-path="url(#dr-dc)">${path(out, 'tl-ink')}${path(inn, 'tl-ink')}</g>`
      + circle(cx, cy, 44, 'tl-thin') + txt(cx - 40, cy - 18, `R${r === 3 ? 3 : 2}`, 24, 'start', 'tl-big') + txt(cx, 252 - 6, '5:1', 22, 'middle', 'tl-mute');
  }
  // a ruler across the print, crossed out
  function ruler(a) {
    if (a <= 0.01) return '';
    let t = '';
    const y = FB + 4;
    for (let i = 0; i <= 36; i++) t += `M${f1(FX + i * 4)} ${y + 2}L${f1(FX + i * 4)} ${i % 5 === 0 ? y + 10 : y + 7}`;
    return op(a, rect(FX - 4, y, 152, 20, 'tl-paper', 2) + path(t, 'tl-thin') + path(`M${FX + 52} ${y - 8}L${FX + 92} ${y + 28}M${FX + 92} ${y - 8}L${FX + 52} ${y + 28}`, 'tl-accl'));
  }
  function note(a, kind) {
    if (a <= 0.01) return '';
    if (kind === 'old') return op(a, rect(236, 252, 158, 100, 'tl-panel', 6) + txt(248, 282, 'print: rev B', 24, 'start', 'tl-txt') + txt(248, 312, '400 × R2', 24, 'start', 'tl-big') + txt(248, 340, tr('afgekeurd', 'rejected'), 22, 'start', 'tl-mute'));
    return op(a, rect(236, 252, 158, 100, 'tl-panel', 6) + txt(248, 282, tr('scherm, PDM', 'screen, PDM'), 24, 'start', 'tl-txt') + txt(248, 316, tr('alleen rev C', 'only rev C'), 24, 'start', 'tl-on'));
  }

  // ------------------------------------------------------------ the plate's drawing and the zone (s5–s8)
  const GP = () => rect(312, 12, 320, 376);
  // the plate in top view, C on the left edge, B the bottom edge; sc px per mm
  function plateDwg(ox, oy, sc, ghost) {
    const x = (mm) => ox + mm * sc;
    const y = (mm) => oy - mm * sc;
    let out = path(`M${f1(x(0))} ${f1(y(0))}L${f1(x(120))} ${f1(y(0))}L${f1(x(120))} ${f1(y(80))}L${f1(x(0))} ${f1(y(80))}Z`, 'tl-fill');
    [[40, 25], [80, 25], [40, 55], [80, 55]].forEach(([c, b], i) => {
      const gx = i === 3 && ghost ? ghost * 6 : 0;
      const gy = i === 3 && ghost ? -ghost * 4 : 0;
      if (i === 3 && ghost > 0.01) out += circle(x(c), y(b), 5.1 * sc, 'tl-hid');
      out += circle(x(c) + gx, y(b) + gy, 5.1 * sc) + line(x(c) - 7 * sc, y(b), x(c) + 7 * sc, y(b), 'tl-chain') + line(x(c), y(b) - 7 * sc, x(c), y(b) + 7 * sc, 'tl-chain');
    });
    // the datum triangles on the edges: B under the bottom edge, C left of the left edge
    // a filled triangle on the edge, a short stem and the letter in a box
    const bx = x(100);
    const by = y(0);
    out += path(`M${f1(bx - 7)} ${f1(by)}L${f1(bx + 7)} ${f1(by)}L${f1(bx)} ${f1(by + 10)}Z`, 'tl-acc') + line(bx, by + 10, bx, by + 16, 'tl-thin')
      + rect(bx - 13, by + 16, 26, 26, 'tl-paper', 2) + txt(bx, by + 37, 'B', 22, 'middle', 'tl-big');
    const cx = x(0);
    const cy = y(65);
    out += path(`M${f1(cx)} ${f1(cy - 7)}L${f1(cx)} ${f1(cy + 7)}L${f1(cx - 10)} ${f1(cy)}Z`, 'tl-acc') + line(cx - 10, cy, cx - 16, cy, 'tl-thin')
      + rect(cx - 42, cy - 13, 26, 26, 'tl-paper', 2) + txt(cx - 29, cy + 8, 'C', 22, 'middle', 'tl-big');
    return out;
  }
  function sizeLabel(ox, oy, sc) {
    const hx = ox + 80 * sc;
    const hy = oy - 55 * sc;
    return path(`M${f1(hx + 3.6 * sc)} ${f1(hy - 3.6 * sc)}L${f1(hx + 14 * sc)} ${f1(oy - 80 * sc - 14)}`, 'tl-thin')
      + txt(326, oy - 80 * sc - 20, `4× Ø${dec(10.2, 1)} +${dec(0.1, 1)}/0`, 24, 'start', 'tl-big');
  }
  // boxed basic dimensions to hole 1: 40 from C along the bottom, 25 from B up the left
  function basicDims(ox, oy, sc) {
    const hx = ox + 40 * sc;
    const hy = oy - 25 * sc;
    // 40 along the bottom, under the plate; 25 up a line just left of the
    // plate, its box over the plate's left edge
    const yb = oy + 32;
    let out = line(hx, hy, hx, yb + 6, 'tl-grid') + path(`M${f1(ox)} ${f1(yb)}L${f1(hx)} ${f1(yb)}${head(ox, yb, -1, 0, 6)}${head(hx, yb, 1, 0, 6)}`, 'tl-thin');
    out += rect((ox + hx) / 2 - 18, yb - 28, 36, 26, 'tl-paper', 1) + txt((ox + hx) / 2, yb - 7, '40', 22, 'middle', 'tl-big');
    const xl = ox - 12;
    out += line(hx, hy, xl - 6, hy, 'tl-grid') + path(`M${f1(xl)} ${f1(oy)}L${f1(xl)} ${f1(hy)}${head(xl, oy, 0, 1, 6)}${head(xl, hy, 0, -1, 6)}`, 'tl-thin');
    out += rect(xl + 4, (oy + hy) / 2 - 13, 36, 26, 'tl-paper', 1) + txt(xl + 22, (oy + hy) / 2 + 8, '25', 22, 'middle', 'tl-big');
    return out;
  }
  // the feature control frame at (x, y): position | Ø0,3 Ⓜ | A | B | C
  const CELLS = [44, 120, 40, 40, 40];
  const cellX = (x, i) => x + CELLS.slice(0, i).reduce((a, b) => a + b, 0);
  function frame(x, y) {
    const w = CELLS.reduce((a, b) => a + b, 0);
    let out = rect(x, y, w, 44, 'tl-paper', 1);
    for (let i = 1; i < CELLS.length; i++) out += line(cellX(x, i), y, cellX(x, i), y + 44, 'tl-ink');
    out += circle(x + 22, y + 22, 10, 'tl-ink') + line(x + 8, y + 22, x + 36, y + 22, 'tl-ink') + line(x + 22, y + 8, x + 22, y + 36, 'tl-ink');
    out += txt(cellX(x, 1) + 8, y + 31, `Ø${dec(0.3, 1)}`, 24, 'start', 'tl-big') + circle(cellX(x, 1) + 98, y + 22, 13, 'tl-ink') + txt(cellX(x, 1) + 98, y + 30, 'M', 22, 'middle', 'tl-big');
    ['A', 'B', 'C'].forEach((l, i) => { out += txt(cellX(x, i + 2) + 20, y + 31, l, 24, 'middle', 'tl-big'); });
    return out;
  }
  // the accent box over cells i0..i1 (fractional i for the Ⓜ half of cell 1)
  function frameHi(x, y, i0, i1, a) {
    if (a <= 0.01) return '';
    const x0 = i0 === 1.5 ? cellX(x, 1) + 82 : cellX(x, i0);
    const x1 = i1 === 1.5 ? cellX(x, 2) : cellX(x, i1 + 1);
    return op(a, rect(x0 - 3, y - 3, x1 - x0 + 6, 50, 'tl-accf', 4));
  }
  // datum rows (s6)
  function datumRow(y, l, nl, en) {
    return path(`M336 ${y + 6}L350 ${y - 6}L350 ${y + 18}Z`, 'tl-acc') + line(350, y + 6, 362, y + 6, 'tl-thin') + rect(362, y - 7, 26, 26, 'tl-paper', 2)
      + txt(375, y + 14, l, 22, 'middle', 'tl-big') + txt(404, y + 14, tr(nl, en), 24, 'start', 'tl-txt');
  }
  // the loupe on the zone: centre (lx, ly), px per mm s, zone diameter zd (mm)
  function loupe(lx, ly, s, zd, a, labelAt) {
    if (a <= 0.01) return '';
    const R = (zd / 2) * s;
    return op(a, circle(lx, ly, R + 22, 'tl-paper') + `<circle class="tl-band" cx="${f1(lx)}" cy="${f1(ly)}" r="${f1(R)}"/>` + circle(lx, ly, R, 'tl-ink')
      + line(lx - 12, ly, lx + 12, ly, 'tl-ink') + line(lx, ly - 12, lx, ly + 12, 'tl-ink')
      + txt(labelAt[0], labelAt[1], `Ø${dec(zd, 2).replace(/0$/, '')}`, 24, labelAt[2], 'tl-big'));
  }
  function square(lx, ly, s, a) {
    if (a <= 0.01) return '';
    const h = 0.1 * s;
    return op(a, rect(lx - h, ly - h, 2 * h, 2 * h, 'tl-hatch', 0) + txt(330, ly - 6, tr('rond:', 'round:'), 24, 'start', 'tl-on') + txt(330, ly + 24, '+57%', 26, 'start', 'tl-on'));
  }
  // the measured centre 0,12 in X and 0,09 in Y off (y up on the drawing)
  function point(lx, ly, s, a, k) {
    if (a <= 0.01) return '';
    const px = lx + 0.12 * s * k;
    const py = ly - 0.09 * s * k;
    return op(a, path(`M${f1(lx)} ${f1(ly)}L${f1(px)} ${f1(py)}`, 'tl-accl') + circle(px, py, 6, 'tl-acc'));
  }

  // ------------------------------------------------------------ the CMM's moves
  // the probe: from rest to a spot (x, y) at ball height z, k 0..1
  function probeTo(x, y, z, kk) {
    const dx = (x - C.CX) * kk;
    const dy = y * kk;
    const dz = (z - C.BALL) * kk;
    move(E.car, [dx, 0, 0]);
    move(E.ram, [dx, dy, dz]);
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['sheet', 'gd'];
  const SHEET = ['fv', 'tv', 'lv', 'cutL', 'dims', 'isoM', 'scl', 'ruler', 'tb', 'tbSym', 'tbGen', 'rt', 'det', 'note'];
  const GDK = ['gdBase', 'pd', 'pdSize', 'pdBasic', 'fr', 'frHi', 'gps', 'dl', 'lp', 'lpSq', 'lpPt', 'lpMmc', 'lpTxt'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const vis = {};
    const sv = {}; // sheet parts' opacity
    const gv = {};
    let plateOff = [0, 0, 0];
    const H1 = C.HOLES[0];

    if (si <= 3) {
      vis.sheet = si === 0 ? span(u, 0.1, 0.2) : 1;
      set(E.shBase, shBase());
      const dimAll = si === 2 ? 0.4 : 1;
      // s1: the views unfold from behind the front view
      const unfold = si === 0 ? (b === 0 ? span(p, 0.45, 0.95) : 1) : 1;
      const third = si === 0 && b === 2 ? Math.min(span(p, 0.1, 0.4), 1 - span(p, 0.8, 1)) : 0;
      sv.fv = si === 0 ? (b === 0 ? span(p, 0.25, 0.4) : 1) : dimAll;
      sv.tv = si === 0 ? (b === 0 ? span(p, 0.45, 0.6) : 1) : dimAll;
      sv.lv = sv.tv;
      set(E.fv, frontView(si === 3 && b >= 1 ? 1 : 0));
      set(E.tv, topView());
      xf(E.tv, unfold < 1 || third > 0 ? `translate(0 ${f1(lerp(FB - TY - 60 * SC, 0, unfold) - third * 100)})` : '');
      xf(E.lv, unfold < 1 || third > 0 ? `translate(${f1(lerp(FX - LX, 0, unfold))} ${f1(third * 70)})` : '');
      xf(E.fv, third > 0 ? `translate(0 ${f1(third * 70)})` : '');
      const section = si === 1 ? (b === 0 ? span(p, 0.3, 0.5) : 1) : si > 1 ? 1 : 0;
      set(E.lv, section >= 0.5 ? leftView(true) : leftView(false));
      sv.cutL = si === 1 ? (b === 0 ? span(p, 0.1, 0.3) : 1) : si > 1 ? 0.4 : 0;
      set(E.cutL, cutLine());
      // third angle: a label beside the moved top view
      set(E.note, third > 0.01 ? op(third, txt(fx(120) + 12, TY - 64, tr('VS', 'US'), 24, 'start', 'tl-on')) : si === 3 && b >= 2 ? note(b === 2 ? span(p, 0.3, 0.45) : span(p, 0.3, 0.45), b === 2 ? 'old' : 'new') : '');
      sv.note = 1;
      // dimensions: from s2 on; the general tolerance band in s3 beat 4
      sv.dims = si === 0 ? 0 : si === 1 ? (b >= 3 ? span(p, 0, 0.2) : 0) : si === 2 ? (b === 3 ? 1 : 0.4) : 1;
      set(E.dims, dims(si === 2 && b === 3 ? span(p, 0.15, 0.35) : 0));
      // the iso view and the scale (s2)
      sv.isoM = si === 1 ? (b >= 1 ? span(b === 1 ? p : 1, 0.05, 0.2) : 0) : si === 2 ? 0.4 : 0;
      const half = si === 1 && b === 2 ? Math.min(span(p, 0.25, 0.45), 1 - span(p, 0.8, 0.95)) : 0;
      // 1:2: the views shrink to half about the front view's top-left corner
      const sk = 1 - half * 0.5;
      xf(E.views, half > 0 ? `translate(${f1(FX * (1 - sk))} ${f1(fz(60) * (1 - sk))}) scale(${sk.toFixed(3)})` : '');
      sv.scl = si === 1 && b === 2 ? span(p, 0, 0.15) : 0;
      set(E.scl, txt(440, 236, `${tr('schaal', 'scale')} ${half > 0.5 ? '1:2' : '1:1'}`, 26, 'middle', 'tl-big'));
      sv.ruler = 1;
      set(E.ruler, si === 1 && b === 3 ? ruler(span(p, 0.25, 0.4)) : '');
      // the title block: faint with the symbol in s1 beat 4, full in s3, faint after
      const tbA = si === 0 ? (b === 3 ? span(p, 0, 0.2) * 0.45 : 0) : si === 1 ? 0.45 : si === 2 ? (b === 0 ? span(p, 0, 0.15) : 1) : 0.6;
      sv.tb = tbA;
      sv.tbSym = si === 0 ? (b === 3 ? span(p, 0, 0.2) : 0) : tbA;
      sv.tbGen = tbA;
      set(E.tb, titleBlock());
      set(E.tbSym, tbSym());
      set(E.tbGen, tbGen());
      // the revision table and the detail (s4)
      sv.rt = si === 3 ? (b === 0 ? span(p, 0.05, 0.2) : b === 1 ? 1 : 1 - span(p, 0.2, 0.3)) : 0;
      set(E.rt, revTable(si === 3 && b >= 1 ? (b === 1 ? span(p, 0.05, 0.3) : 1) : 0));
      sv.det = si === 3 && b >= 1 ? (b === 1 ? span(p, 0.35, 0.5) : 1) : 0;
      set(E.det, detail(si === 3 && b === 1 && p < 0.7 ? 2 : 3));
    } else {
      vis.gd = si === 4 ? span(u, 0.12, 0.25) : 1;
      gv.gdBase = 1;
      set(E.gdBase, GP() + exTag(620, 40, 'end'));
      if (si === 4) {
        const ox = 362;
        const oy = 214;
        const sc = 1.5;
        gv.pd = 1;
        set(E.pd, plateDwg(ox, oy, sc, b === 0 ? Math.sin(Math.PI * span(p, 0.4, 1)) : 0));
        gv.pdSize = b === 0 ? span(p, 0.1, 0.25) : 1;
        set(E.pdSize, sizeLabel(ox, oy, sc));
        gv.fr = b >= 1 ? (b === 1 ? span(p, 0.1, 0.3) : 1) : 0;
        set(E.fr, frame(336, 262));
        // beat 3 walks the cells: symbol, tolerance, Ⓜ, A, B, C
        const steps = [[0, 0], [1, 1], [1.5, 1.5], [2, 2], [3, 3], [4, 4]];
        const st = steps[Math.min(5, Math.floor(span(p, 0.05, 0.95) * 6))];
        gv.frHi = 1;
        set(E.frHi, b === 2 ? frameHi(336, 262, st[0], st[1], 1) : '');
        gv.gps = b === 3 ? span(p, 0.05, 0.2) : 0;
        set(E.gps, txt(336, 342, tr('ISO GPS: Europa', 'ISO GPS: Europe'), 24, 'start', 'tl-txt') + txt(336, 372, tr('ASME Y14.5: VS', 'ASME Y14.5: US'), 24, 'start', 'tl-txt'));
      } else if (si === 5) {
        // the plate drops onto A, slides back against B, then left against C
        const dA = b === 0 ? 30 * (1 - span(p, 0.5, 0.95)) : 0;
        const dB = b <= 1 ? 10 : b === 2 ? 10 * (1 - span(p, 0.05, 0.35)) : 0;
        const dC = b <= 1 ? 10 : b === 2 ? 10 * (1 - span(p, 0.5, 0.8)) : 0;
        plateOff = [dC, dB, dA];
        gv.dl = 1;
        // beat 1: how a datum is drawn, a triangle on the surface and its letter
        gv.gps = b === 0 ? span(p, 0.1, 0.25) : 0;
        set(E.gps, path('M336 120L470 120', 'tl-ink') + path('M396 120L410 120L403 108Z', 'tl-acc') + line(403, 108, 403, 96, 'tl-thin')
          + rect(390, 70, 26, 26, 'tl-paper', 2) + txt(403, 91, 'A', 22, 'middle', 'tl-big')
          + txt(336, 170, tr('vlak om vanaf', 'the surface you'), 24, 'start', 'tl-txt') + txt(336, 200, tr('te meten', 'measure from'), 24, 'start', 'tl-txt'));
        set(E.dlA, op(b >= 1 ? (b === 1 ? span(p, 0.05, 0.2) : 1) : 0, datumRow(70, 'A', '3 punten', '3 points')));
        set(E.dlB, op(b >= 2 ? span(b === 2 ? p : 1, 0.05, 0.2) : 0, datumRow(130, 'B', '2 punten', '2 points')));
        set(E.dlC, op(b >= 2 ? span(b === 2 ? p : 1, 0.5, 0.65) : 0, datumRow(190, 'C', '1 punt', '1 point')));
        gv.lpTxt = b === 3 ? span(p, 0.1, 0.25) : 0;
        set(E.lpTxt, txt(336, 270, tr('volgorde:', 'order:'), 24, 'start', 'tl-mute') + txt(336, 304, 'A → B → C', 26, 'start', 'tl-on'));
      } else if (si === 6) {
        const ox = 356;
        const oy = 340;
        const sc = 1.3;
        gv.pd = 1;
        set(E.pd, plateDwg(ox, oy, sc, 0));
        gv.pdSize = b === 0 ? span(p, 0.1, 0.25) : 0;
        set(E.pdSize, sizeLabel(ox, oy, sc));
        gv.pdBasic = b >= 1 ? (b === 1 ? span(p, 0.05, 0.2) : 1) : 0;
        set(E.pdBasic, basicDims(ox, oy, sc));
        const zone = b >= 2 ? (b === 2 ? span(p, 0.05, 0.25) : 1) : 0;
        gv.lp = zone;
        set(E.lp, loupe(550, 122, 360, b === 3 ? lerp(0.3, 0.28, span(p, 0.05, 0.3)) : 0.3, 1, [550, 226, 'middle'])
          + path(`M${f1(ox + 40 * sc + 6)} ${f1(oy - 25 * sc - 6)}L${f1(550 - 56)} ${f1(122 + 56)}`, 'tl-thin'));
        gv.lpSq = b === 3 ? span(p, 0.3, 0.5) : 0;
        set(E.lpSq, square(550, 122, 360, 1));
      } else {
        // the probe goes into hole 1 and touches; the loupe shows the zone
        const kIn = b === 0 ? span(p, 0.1, 0.6) : 1;
        const touch = b === 0 ? span(p, 0.6, 1) : 1;
        const a = touch * 2 * Math.PI * 2;
        const wig = b === 0 && touch > 0 && touch < 1 ? 2.2 : 0;
        if (kIn < 1) probeTo(H1[0], H1[1], 90, kIn);
        else probeTo(H1[0] + Math.cos(a) * wig, H1[1] + Math.sin(a) * wig, 90, 1);
        const zd = b === 3 ? lerp(0.3, 0.35, span(p, 0.3, 0.6)) : 0.3;
        gv.lp = b === 0 ? span(p, 0.6, 0.8) : 1;
        set(E.lp, loupe(472, 172, 600, zd, 1, [330, 56, 'start']));
        gv.lpPt = b >= 1 ? 1 : 0;
        set(E.lpPt, point(472, 172, 600, 1, b === 1 ? span(p, 0.05, 0.4) : 1));
        gv.fr = 1;
        set(E.fr, frame(336, 338));
        gv.frHi = 1;
        set(E.frHi, b >= 2 ? frameHi(336, 338, 1.5, 1.5, b === 2 ? span(p, 0.05, 0.2) : 1) : '');
        gv.lpTxt = b >= 1 ? 1 : 0;
        const t = b === 1 ? (p > 0.4 ? `${dec(0.15, 2)} → Ø${dec(0.3, 2)}: ${tr('grens', 'limit')}` : `X ${dec(0.12, 2)}  Y ${dec(0.09, 2)}`)
          : b === 2 ? `MMC: Ø${dec(10.2, 1)}` : b === 3 ? (p > 0.6 ? `Ø${dec(0.35, 2)}: ${tr('goed', 'good')}` : `Ø${dec(10.25, 2)}: +${dec(0.05, 2)}`) : '';
        set(E.lpTxt, t ? txt(336, 326, t, 24, 'start', b === 3 && p > 0.6 ? 'tl-on' : 'tl-big') : '');
        gv.lpMmc = b >= 2 ? 1 : 0;
        set(E.lpMmc, b === 3 ? op(span(p, 0.3, 0.6), circle(472, 172, (lerp(0.3, 0.35, span(p, 0.3, 0.6)) / 2) * 600, 'tl-accl')) : '');
      }
      if (si >= 6) plateOff = [0, 0, 0];
    }
    if (si < 4) plateOff = [0, 0, 0];
    move(E.plate, plateOff);
    if (si !== 7) { move(E.car, [0, 0, 0]); move(E.ram, [0, 0, 0]); }

    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
    for (const k of SHEET) { const a = Math.min(1, sv[k] || 0); show(E[k], a > 0.01); fade(E[k], a); }
    for (const k of GDK) { const a = Math.min(1, gv[k] ?? 0); show(E[k], a > 0.01); fade(E[k], a); }
  }

  return { render };
})();
