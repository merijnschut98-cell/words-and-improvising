// The stage of the module intro film "Elke doos goed / Every carton good": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the run field film: the filling unit over the belt of line 3
// with its cartons, you and the team lead; the check table at the end of the belt appears at the sentence that names the
// check sheet, the marked quarantine place at the sentence that sets a bad carton apart. The panel at the right draws each
// beat as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map). The tolerance, the spread, the
// control chart and the report are panel schemas only. Every part a sentence lights is a static data-cue group (build.mjs);
// this script only fills the panel and shows or hides the room's moving parts. The closing scene (the shared Engineering
// map, then the module's four topics with their levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the panel
// (the kit checks that they fit).
/* global CAM, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW, wrapUnits, span, beatStarts */
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
  const set = (e, html) => { if (e && e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, t) => { if (e && e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  // a moving part of the room or the map: shown with an opacity, hidden when it is 0
  const show = (e, a) => {
    if (!e) return;
    const v = a <= 0.01 ? 0 : a >= 0.999 ? 1 : Math.round(a * 100) / 100;
    if (e.__a === v) return;
    e.__a = v;
    e.style.display = v === 0 ? 'none' : '';
    e.style.opacity = v === 1 ? '' : String(v);
  };
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'pm-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const dot = (x, y, r) => `<circle class="pm-joint" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const head = dy === 0 ? `M${f1(x1 - 6 * dx)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6 * dx)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * dy)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * dy)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const IDS = ['tolerances', 'capability', 'spc', 'risk'];
  const TITLE = IDS.map((id) => { const t = D.topics.find((x) => x.id === id); return tr(t.title.nl, t.title.en); });
  const LW = NL ? LV.nl : LV.en;

  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }
  // the camera: CAM[si] = { from: [ox, oy, s], to: [ox, oy, s] }, the point (ox, oy) of the room brought to the
  // middle of the room's half of the stage (160, 200), at scale s
  function camera(si, u, b, p) {
    const c = CAM[si];
    const kk = c.at === undefined ? span(u, 0, 1) : b < c.at ? 0 : span(p, 0, 0.7);
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- the room: you and the team lead come in at the sentence that names you (the opening's third beat) and again at the
  // end of the last topic (where the shift ends with every carton good). The check table stands from the sentence that names
  // the check sheet kept on it (the third beat of the SPC scene), the quarantine place from the sentence that sets a bad
  // carton apart (the second beat of the risk scene)
  function room(si, b) {
    show(E['o-sheet'], (si === 3 && b >= 2) || si === 4 ? 1 : 0);
    show(E['o-quar'], si === 4 && b >= 1 ? 1 : 0);
    show(E['pp-jij'], (si === 0 && b >= 2) || (si === 4 && b === 3) ? 1 : 0);
    show(E['pp-teamlead'], (si === 0 && b >= 2) || (si === 4 && b === 3) ? 1 : 0);
  }


  // ---- the route (s1, the last three beats): the module's four topics in two groups, the map before the detail. Each
  // row has its number and its index title, wrapped by the kit's widths into 240 units left of the number; a title of two
  // lines gets a taller row. The rows keep their place whichever groups show
  const ROUTE = (() => {
    const rows = [];
    let y = 52;
    [[0, 1], [2, 3]].forEach((grp) => {
      grp.forEach((i) => {
        const lines = wrap(TITLE[i], 240).slice(0, 2);
        const h = lines.length === 1 ? 34 : 56;
        rows.push({ i, y, h, lines });
        y += h + 6;
      });
      y += 10;
    });
    return rows;
  })();
  function routeGroup(first, count, a) {
    let s = '';
    ROUTE.filter((r) => r.i >= first && r.i < first + count).forEach((r) => {
      s += rect(334, r.y, 284, r.h, 'pm-tile', 6) + txt(610, r.y + 25, String(r.i + 1), 22, 'end', 'pm-on');
      r.lines.forEach((l, j) => { s += txt(346, r.y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
    });
    return op(a, s);
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // the tool's name as a chip high in the panel under the strip (one short sentence names it; it is not explained). Shown in
  // the beat of the sentence (b === at)
  function tools(b, p, at, one) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a card with a name and one muted line under it (a 62-unit card)
  const card2 = (y, a, b, c, d, cls = 'pm-card', room = 260) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a card with one line (a 44-unit card)
  const card1 = (y, a, b, cls = 'pm-card', room = 260) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
  // a tile with one line (a 34-unit row)
  const tile = (y, a, b, cls = 'pm-tile', room = 260) => rect(334, y, 284, 34, cls, 6) + txt(346, y + 25, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');

  // ---- s1: every carton that leaves line 3 must be good; the module is how engineers talk about good parts; a whole shift.
  function goodDrawing() {
    return card1(64, 'Lijn 3', 'Line 3') + arrow(476, 112, 476, 126) + card1(130, 'Doos', 'Carton') + arrow(476, 178, 476, 192) + card1(196, 'Goed', 'Good', 'pm-crit');
  }
  function askDrawing() {
    return card1(64, 'Engineers', 'Engineers') + arrow(476, 112, 476, 126) + card1(130, 'Goede onderdelen', 'Good parts');
  }
  function shiftDrawing() {
    let s = txt(334, 112, tr('Een hele dienst', 'A whole shift', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 8; i++) s += rect(334 + i * 36, 126, 32, 34, i < 7 ? 'pm-tile' : 'pm-out', 6);
    return s + path('M334 196H618M610 191L618 196L610 201', 'pm-arrow') + txt(334, 236, tr('elke doos goed', 'every carton good', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: the tolerance is how far a dimension may deviate and still work; the spec limits are the edges of what the
  // customer accepts, a carton outside them is nonconforming; the caliper (the chip above) measures the dimension.
  // A band along a line: the middle part is the tolerance, a mark beyond its right edge is a carton outside it.
  const BAND = { x0: 346, x1: 606, l: 436, r: 516, y: 150 };
  function tolDrawing() {
    return rect(BAND.x0, BAND.y, BAND.x1 - BAND.x0, 26, 'pm-bar', 6) + rect(BAND.l, BAND.y, BAND.r - BAND.l, 26, 'pm-crit', 6)
      + txt(476, 226, tr('tolerantie', 'tolerance', 200), 22, 'middle', 'pm-mute');
  }
  function limDrawing() {
    return rect(BAND.x0, BAND.y, BAND.x1 - BAND.x0, 26, 'pm-bar', 6) + rect(BAND.l, BAND.y, BAND.r - BAND.l, 26, 'pm-crit', 6)
      + path(`M${BAND.l} ${BAND.y - 24}V${BAND.y + 50}M${BAND.r} ${BAND.y - 24}V${BAND.y + 50}`, 'pm-dash')
      + path(`M566 ${BAND.y + 6}L586 ${BAND.y + 20}M586 ${BAND.y + 6}L566 ${BAND.y + 20}`, 'pm-cross')
      + txt(334, 244, tr('specgrens', 'spec limit', 140), 22, 'start', 'pm-mute') + txt(618, 244, tr('specgrens', 'spec limit', 140), 22, 'end', 'pm-mute');
  }
  function calDrawing() {
    // the caliper: a rule with a fixed jaw at the left, a sliding jaw and a carton between the jaws
    let s = rect(346, 270, 260, 24, 'pm-bar', 4) + rect(346, 214, 18, 80, 'pm-tile', 4) + rect(364, 238, 80, 56, 'pm-card', 4) + rect(444, 214, 18, 80, 'pm-crit', 4);
    for (let i = 0; i < 6; i++) s += path(`M${484 + i * 20} 270v10`, 'pm-link');
    return s;
  }

  // ---- s3: no two cartons are exactly alike, the spread; capability says whether line 3 can stay within the tolerance; the
  // Cpk (the chip above) works it out, with the nearest limit. Seven bars make the bell of the spread.
  const BARS = [14, 34, 62, 86, 62, 34, 14];
  const LIM = { l: 346, r: 606, base: 290 };
  function bell(x0, outFrom) {
    let s = '';
    BARS.forEach((h, i) => { const x = x0 + i * 30; s += rect(x, LIM.base - h, 26, h, x + 26 > LIM.r && outFrom ? 'pm-crit' : 'pm-bar', 3); });
    return s;
  }
  const lims = (top = 112) => path(`M${LIM.l} ${top}V${LIM.base + 8}M${LIM.r} ${top}V${LIM.base + 8}`, 'pm-dash');
  function varDrawing() {
    return bell(373) + path(`M${373 + 3 * 30 + 13} 170V${LIM.base}`, 'pm-dash') + txt(476, 336, tr('spreiding', 'variation', 284), 22, 'middle', 'pm-mute');
  }
  function capDrawing() {
    return lims() + bell(373) + path(`M${LIM.l} 124H${LIM.r}M${LIM.l + 6} 119L${LIM.l} 124L${LIM.l + 6} 129M${LIM.r - 6} 119L${LIM.r} 124L${LIM.r - 6} 129`, 'pm-arrow')
      + txt(476, 336, tr('binnen de tolerantie', 'within the tolerance', 284), 22, 'middle', 'pm-mute');
  }
  function cpkDrawing() {
    // the same bell shifted towards the upper limit, the distance from its middle to that limit
    return lims(156) + bell(410, true) + path(`M${410 + 3 * 30 + 13} 176H${LIM.r}M${LIM.r - 6} 171L${LIM.r} 176L${LIM.r - 6} 181`, 'pm-arrow');
  }

  // ---- s4: SPC follows a running process; a control chart has a centre line and two control limits and shows a change; the
  // check sheet (the chip above) is a form with tally marks, kept on the table at the end of the belt.
  const DOTS = [[466, 206], [494, 190], [522, 214], [550, 198], [578, 188], [606, 120]];
  function spcDrawing() {
    // points in time, joined by a line
    const pts = DOTS.slice(0, 5);
    return path(`M${pts.map((p) => p.join(' ')).join('L')}`, 'pm-link') + pts.map((p) => dot(p[0], p[1], 6)).join('')
      + path('M334 290H618M610 285L618 290L610 295', 'pm-arrow');
  }
  function chartDrawing() {
    // the same points, now with a centre line, two control limits and a last point outside the upper limit
    return path('M466 200H618', 'pm-link') + path('M466 150H618M466 250H618', 'pm-dash')
      + path(`M${DOTS.map((p) => p.join(' ')).join('L')}`, 'pm-link') + DOTS.slice(0, 5).map((p) => dot(p[0], p[1], 6)).join('') + rect(600, 114, 12, 12, 'pm-crit', 3)
      + txt(334, 142, tr('regelgrens', 'control limit', 130), 22, 'start', 'pm-mute') + txt(334, 192, tr('middellijn', 'centre line', 130), 22, 'start', 'pm-mute')
      + path('M334 290H618M610 285L618 290L610 295', 'pm-arrow');
  }
  function sheetDrawing() {
    // a form with rows of tally marks, four strokes and a slash to a group
    let s = rect(334, 172, 284, 168, 'pm-card', 8);
    [0, 1, 2].forEach((r) => {
      const y = 206 + r * 44;
      s += path(`M346 ${y}h64`, 'pm-link');
      for (let gi = 0; gi < 2 - (r === 2 ? 1 : 0); gi++) {
        const x = 440 + gi * 84;
        s += path([0, 1, 2, 3].map((i) => `M${x + i * 12} ${y - 16}v26`).join('') + `M${x - 6} ${y + 4}L${x + 42} ${y - 8}`, 'pm-link');
      }
    });
    return s;
  }

  // ---- s5: a bad carton must first stop moving; set aside in the marked place it is in quarantine; the nonconformance report
  // (the chip above) says what, how many and the decision; the shift ends with good cartons for the customer.
  function badDrawing() {
    return rect(334, 200, 284, 12, 'pm-bar', 4) + rect(346, 156, 46, 40, 'pm-card', 5) + rect(436, 156, 46, 40, 'pm-crit', 5) + rect(526, 156, 46, 40, 'pm-card', 5)
      + path('M444 164L474 188M474 164L444 188', 'pm-cross');
  }
  function quaDrawing() {
    return rect(334, 160, 284, 12, 'pm-bar', 4) + rect(346, 116, 46, 40, 'pm-crit', 5) + arrow(369, 178, 369, 232)
      + rect(334, 236, 284, 104, 'pm-out', 10) + rect(346, 262, 46, 40, 'pm-crit', 5) + txt(408, 288, tr('Quarantaine', 'Quarantine', 200), 22, 'start', 'pm-txt');
  }
  function ncrDrawing() {
    // a form: a heading line, three rows, a box with a mark for the decision
    return rect(334, 172, 284, 168, 'pm-card', 8) + path('M346 198h120', 'pm-link') + path('M346 232h226M346 262h226M346 292h160', 'pm-link')
      + rect(560, 290, 44, 36, 'pm-crit', 6) + path('M570 308L580 318L596 298', 'pm-arrow');
  }
  function endDrawing() {
    return card1(120, 'Lijn 3', 'Line 3') + arrow(476, 168, 476, 182) + card1(186, 'Goede dozen', 'Good cartons', 'pm-crit') + arrow(476, 234, 476, 248) + card1(252, 'De klant', 'The customer');
  }


  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Data and digital manufacturing lit, the whole sheet and then zoomed to the lit place at 1.5; then the
  // module's four topics, each with its four levels as columns (the words the app uses for the levels), the start marker on
  // the first level of the first topic.
  const MAP0 = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
  // the zoom on the lit place stays inside the sheet (no empty strip beside the map)
  const MAP1 = { s: 1.5, x: clamp(320 - MAPZ[0] * 1.5, W - MAPSZ[0] * 1.5, 0), y: clamp(200 - MAPZ[1] * 1.5, H - MAPSZ[1] * 1.5, 0) };
  function mapPlace(b, p) {
    const z = b === 0 ? span(p, 0.35, 1) : 1;
    const s = lerp(MAP0.s, MAP1.s, z);
    move(E.mapG, `translate(${f1(lerp(MAP0.x, MAP1.x, z))} ${f1(lerp(MAP0.y, MAP1.y, z))}) scale(${s.toFixed(4)})`);
    // the map fades out once, in the second beat, and stays hidden after it (it must not come back at the start of
    // every later beat, behind the grid)
    return b === 0 ? 1 : b === 1 ? 1 - span(p, 0, 0.45) : 0;
  }
  // the columns (GRID from build.mjs, which checks the level words fit): a tile column of GRID.tile units, four level
  // columns of GRID.col from GRID.x with boxes of GRID.box. The level words stand on one line each, staggered over two
  // rows (the first and third high, the second and fourth low), so neighbours never meet.
  const GX = GRID.x;
  const GW = GRID.col;
  const GB = GRID.box;
  const gridY = (i) => GRID.top + i * GRID.pitch;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], lv1: '', lv2: '', lv3: '', lv4: '', start: '' };
    const lv = ['lv1', 'lv2', 'lv3', 'lv4'];
    LW.forEach((wd, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, wd, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, GRID.h, 'pm-tile', 8);
      const lines = wrap(t, GRID.tile - 12).slice(0, 2);
      const y0 = lines.length === 1 ? y + 38 : y + 27;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.1, i * 0.1 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 8, GB, GRID.h - 16, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 3, GB + 10, GRID.h - 6, 'pm-out', 10);
    return out;
  }

  const HEAD = [[tr('Toleranties', 'Tolerances', 165)], [tr('Spreiding', 'Variation', 165)], [tr('SPC', 'SPC', 165)], [tr('Risico', 'Risk', 165)]];

  function render(si, u) {
    const { b, p } = beatOf(si, u);
    camera(si, u, b, p);
    room(si, b);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 5;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 3 ? tr('De route', 'The route') : tr('Lijn 3', 'Line 3');
      if (b === 0) o.goodS = op(span(p, 0.05, 0.4), goodDrawing());
      if (b === 1) o.askS = askDrawing();
      if (b === 2) o.shiftS = op(span(p, 0.05, 0.4), shiftDrawing());
      if (b >= 3) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, 2, b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b >= 4) o.grpB = routeGroup(2, 2, b === 4 ? span(p, 0.05, 0.4) : 1);
      }
    } else if (si >= 1 && si <= 4) {
      title = HEAD[si - 1][0];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { tolS: fade(b, 0, p, tolDrawing(), 0.1, 0.5), limS: fade(b, 1, p, limDrawing(), 0.1, 0.5), calS: b === 2 ? op(span(p, 0.3, 0.7), calDrawing()) : '', ...tools(b, p, 2, tr('Schuifmaat', 'Caliper', 260)) });
      if (si === 2) Object.assign(o, { varS: fade(b, 0, p, varDrawing(), 0.1, 0.5), capS: fade(b, 1, p, capDrawing(), 0.1, 0.5), cpkS: b === 2 ? op(span(p, 0.3, 0.7), cpkDrawing()) : '', ...tools(b, p, 2, tr('Cpk', 'Cpk', 260)) });
      if (si === 3) Object.assign(o, { spcS: fade(b, 0, p, spcDrawing(), 0.1, 0.5), chartS: fade(b, 1, p, chartDrawing(), 0.1, 0.5), sheetS: b === 2 ? op(span(p, 0.3, 0.7), sheetDrawing()) : '', ...tools(b, p, 2, tr('Turflijst', 'Check sheet', 260)) });
      if (si === 4) Object.assign(o, { badS: fade(b, 0, p, badDrawing(), 0.1, 0.5), quaS: fade(b, 1, p, quaDrawing(), 0.1, 0.5), ncrS: b === 2 ? op(span(p, 0.3, 0.7), ncrDrawing()) : '', endS: fade(b, 3, p, endDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Afwijkingsrapport', 'Nonconformance report', 260)) });
    }
    let pbg = 'x="322" y="12" width="308" height="376"';
    if (closing) {
      title = tr('De kaart', 'The map');
      lab = tr('schema', 'diagram');
      mapA = mapPlace(b, p);
      if (b === 0) hudA = 0;
      else {
        hudA = span(p, 0.2, 0.6);
        if (b > 1) hudA = 1;
        pbg = 'x="8" y="6" width="624" height="388"';
        const m = grid(b, p);
        o.r = m.r; o.lv1 = m.lv1; o.lv2 = m.lv2; o.lv3 = m.lv3; o.lv4 = m.lv4; o.start = b >= 2 ? m.start : '';
        title = '';
        lab = '';
      }
    }
    show(E.mapG, mapA);
    show(E.hud, hudA);
    if (E.pbg.__v !== pbg) { for (const kv of pbg.split(' ')) { const [k, v] = kv.split('='); E.pbg.setAttribute(k, v.replace(/"/g, '')); } E.pbg.__v = pbg; }
    const head = closing && b > 0 ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    for (let i = 0; i < 4; i++) set(E[`r${i}`], o.r[i]);
    for (const k2 of KEYS) set(E[`k_${k2}`], o[k2]);
  }

  return { render };
})();
