// The stage of the module intro film "Het vulgewicht gelezen / Reading the fill weight": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the better field film: the filling unit over the belt of line 3
// with its cartons, you and the team lead; the scale on the table at the end of the belt appears at the sentence that has the
// cartons weighed there, the control chart on the back wall at the sentence that names it. The panel at the right draws each
// beat as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map). The measurement error, the spread, the
// report and the routine are panel schemas only. Every part a sentence lights is a static data-cue group (build.mjs);
// this script only fills the panel and shows or hides the room's moving parts. The closing scene (the shared Engineering
// map, then the module's four topics with their levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the panel
// (the kit checks that they fit).
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
  const IDS = ['msa', 'charts', 'capability', 'practice'];
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
  // end of the last topic (where the fill weight is followed with data). The scale stands from the sentence that has the cartons
  // weighed at the end of the belt (the second beat of the measurement scene), the control chart on the wall from the sentence
  // that names the control chart (the first beat of the charts scene)
  function room(si, b) {
    show(E['o-scale'], (si === 1 && b >= 1) || (si >= 2 && si <= 4) ? 1 : 0);
    show(E['o-chart'], si >= 2 && si <= 4 ? 1 : 0);
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

  // ---- s1: too-light cartons come from line 3; the module goes beyond the basics and reads the fill weight with statistics; after
  // the shift you follow the fill weight.
  function lightDrawing() {
    return card1(64, 'Lijn 3', 'Line 3') + arrow(476, 112, 476, 126) + card1(130, 'Doos', 'Carton') + arrow(476, 178, 476, 192) + card1(196, 'Te licht', 'Too light', 'pm-crit');
  }
  function askDrawing() {
    return card1(64, 'Vulgewicht', 'Fill weight') + arrow(476, 112, 476, 126) + card1(130, 'Statistiek', 'Statistics', 'pm-crit');
  }
  function shiftDrawing() {
    let s = txt(334, 112, tr('Na de dienst', 'After the shift', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 8; i++) s += rect(334 + i * 36, 126, 32, 34, i < 7 ? 'pm-tile' : 'pm-out', 6);
    return s + path('M334 196H618M610 191L618 196L610 201', 'pm-arrow') + txt(334, 236, tr('het vulgewicht volgen', 'follow the fill weight', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: every reading is the true value plus a measurement error; a noisy scale makes the spread look larger than it is; the
  // gauge R&R (the chip above): two people weigh the same carton a few times, each row of dots is one person.
  function errDrawing() {
    return card1(104, 'Echte waarde', 'True value') + path('M476 150V162M470 156H482', 'pm-arrow') + card1(166, 'Meetfout', 'Measurement error')
      + arrow(476, 214, 476, 228) + card1(232, 'Uitlezing', 'Reading', 'pm-crit');
  }
  function wideDrawing() {
    // the spread of the cartons themselves (a short bar) against the spread you read from a noisy scale (a longer one)
    return txt(334, 150, tr('de dozen zelf', 'the cartons', 284), 22, 'start', 'pm-mute') + rect(406, 164, 140, 26, 'pm-bar', 6)
      + txt(334, 240, tr('wat je leest', 'what you read', 284), 22, 'start', 'pm-mute') + rect(366, 254, 220, 26, 'pm-crit', 6);
  }
  function rrDrawing() {
    // one carton, read three times by two people: each row of dots is one person
    let s = rect(334, 214, 56, 48, 'pm-card', 6) + path('M390 224H430M390 252H430', 'pm-link');
    [446, 468, 490].forEach((x, i) => { s += dot(x, 224 + (i % 2) * 6, 7); });
    [506, 528, 550].forEach((x, i) => { s += dot(x, 252 - (i % 2) * 6, 7); });
    return s + path('M334 298H618M610 293L618 298L610 303', 'pm-arrow');
  }

  // ---- s3: a control chart plots a result over time; the centre line and two limits show what line 3 does by itself; a point
  // outside a limit is a signal; the np chart (the chip above) plots the count of too-light cartons of each weighing.
  const DOTS = [[474, 214], [508, 198], [542, 224], [576, 204], [602, 128]];
  const axis = path('M334 306H618M610 301L618 306L610 311', 'pm-arrow');
  function chDrawing() {
    const pts = DOTS.slice(0, 4);
    return path(`M${pts.map((p) => p.join(' ')).join('L')}`, 'pm-link') + pts.map((p) => dot(p[0], p[1], 6)).join('') + axis
      + txt(334, 348, tr('in de tijd', 'over time', 284), 22, 'start', 'pm-mute');
  }
  function limDrawing() {
    return path('M334 206H618', 'pm-link') + path('M334 152H618M334 260H618', 'pm-dash')
      + path(`M${DOTS.slice(0, 4).map((p) => p.join(' ')).join('L')}`, 'pm-link') + DOTS.slice(0, 4).map((p) => dot(p[0], p[1], 6)).join('')
      + txt(334, 140, tr('grens', 'limit', 130), 22, 'start', 'pm-mute') + txt(334, 196, tr('middellijn', 'centre line', 130), 22, 'start', 'pm-mute') + axis;
  }
  function sigDrawing() {
    return path('M334 206H618', 'pm-link') + path('M334 152H618M334 260H618', 'pm-dash')
      + path(`M${DOTS.map((p) => p.join(' ')).join('L')}`, 'pm-link') + DOTS.slice(0, 4).map((p) => dot(p[0], p[1], 6)).join('') + rect(594, 120, 16, 16, 'pm-crit', 3)
      + txt(334, 118, tr('signaal', 'signal', 240), 22, 'start', 'pm-mute') + axis;
  }
  function npDrawing() {
    // the np chart: the count of too-light cartons of each weighing, with a centre line and two limits
    const xs = [410, 450, 490, 530, 570];
    const ys = [262, 240, 276, 252, 232];
    return path('M334 258H618', 'pm-link') + path('M334 196H618M334 312H618', 'pm-dash')
      + path(`M${xs.map((x, i) => `${x} ${ys[i]}`).join('L')}`, 'pm-link') + xs.map((x, i) => dot(x, ys[i], 6)).join('')
      + txt(334, 356, tr('aantal te licht', 'number too light', 284), 22, 'start', 'pm-mute');
  }

  // ---- s4: capability compares the spread of the process with the tolerance; only for a stable process, so first stable, then
  // capable; the capability report (the chip above) with its histogram and the spec limits. Seven bars make the bell.
  const BARS = [14, 34, 62, 86, 62, 34, 14];
  const LIM = { l: 346, r: 606, base: 290 };
  function bell(x0, top = 0) {
    let s = '';
    BARS.forEach((h, i) => { s += rect(x0 + i * 30, LIM.base - h - top, 26, h, 'pm-bar', 3); });
    return s;
  }
  const lims = (top = 112) => path(`M${LIM.l} ${top}V${LIM.base + 8}M${LIM.r} ${top}V${LIM.base + 8}`, 'pm-dash');
  function spreadDrawing() {
    return lims() + bell(373) + path(`M${LIM.l} 124H${LIM.r}M${LIM.l + 6} 119L${LIM.l} 124L${LIM.l + 6} 129M${LIM.r - 6} 119L${LIM.r} 124L${LIM.r - 6} 129`, 'pm-arrow')
      + txt(476, 336, tr('spreiding en tolerantie', 'spread and tolerance', 284), 22, 'middle', 'pm-mute');
  }
  function stabDrawing() {
    return card1(104, '1 Stabiel maken', '1 Make it stable') + arrow(476, 152, 476, 166) + card1(170, '2 Geschiktheid meten', '2 Measure capability', 'pm-crit');
  }
  function repDrawing() {
    // a report: a page with a histogram between two spec limits and a few lines of figures under it
    return rect(334, 164, 284, 188, 'pm-card', 8) + path(`M346 180V292M606 180V292`, 'pm-dash') + bell(373, 8) + path('M358 308H520M358 330H470', 'pm-link');
  }

  // ---- s5: on the floor SPC is a routine; measure more often where things change, such as after a changeover; the first-off
  // check (the chip above) weighs one carton first. The story ends on the fill weight followed with data.
  function floorDrawing() {
    return tile(104, 'Meten', 'Measure') + arrow(476, 140, 476, 154) + tile(158, 'Punt uitzetten', 'Plot the point') + arrow(476, 194, 476, 208) + tile(212, 'Reageren', 'React', 'pm-crit');
  }
  function whenDrawing() {
    // a row of readings in time: close together (small squares) where things change, after the changeover line, further apart before it
    let s = '';
    for (let i = 0; i < 4; i++) s += rect(334 + i * 28, 190, 22, 34, 'pm-tile', 5);
    for (let i = 0; i < 6; i++) s += rect(458 + i * 28, 190, 22, 34, 'pm-crit', 5);
    return s + path('M446 160V250', 'pm-dash') + txt(446, 280, tr('omstelling', 'changeover', 240), 22, 'middle', 'pm-mute') + txt(334, 148, tr('vaker meten', 'measure more often', 284), 22, 'start', 'pm-mute');
  }
  function fofDrawing() {
    // after the changeover one carton first, then the run
    let s = txt(334, 190, tr('na de omstelling', 'after the changeover', 284), 22, 'start', 'pm-mute') + rect(334, 208, 46, 40, 'pm-crit', 5) + path('M388 228H410M404 223L410 228L404 233', 'pm-arrow');
    for (let i = 0; i < 5; i++) s += rect(420 + i * 38, 208, 34, 40, 'pm-card', 5);
    return s + txt(334, 292, tr('één doos, dan de serie', 'one carton, then the run', 284), 22, 'start', 'pm-mute');
  }
  function endDrawing() {
    return card1(120, 'Vulgewicht', 'Fill weight') + arrow(476, 168, 476, 182) + card1(186, 'Data, geen gevoel', 'Data, not feel', 'pm-crit');
  }


  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Measurement and SPC in depth lit, the whole sheet and then zoomed to the lit place at 1.5; then the
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

  const HEAD = [[tr('Meetsystemen', 'Measuring', 165)], [tr('Regelkaarten', 'Charts', 165)], [tr('Geschiktheid', 'Capability', 165)], [tr('Op de vloer', 'On the floor', 165)]];

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
      if (b === 0) o.lightS = op(span(p, 0.05, 0.4), lightDrawing());
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
      if (si === 1) Object.assign(o, { errS: fade(b, 0, p, errDrawing(), 0.1, 0.5), wideS: fade(b, 1, p, wideDrawing(), 0.1, 0.5), rrS: b === 2 ? op(span(p, 0.3, 0.7), rrDrawing()) : '', ...tools(b, p, 2, tr('Gauge R&R', 'Gauge R&R', 260)) });
      if (si === 2) Object.assign(o, { chS: fade(b, 0, p, chDrawing(), 0.1, 0.5), limS: fade(b, 1, p, limDrawing(), 0.1, 0.5), sigS: fade(b, 2, p, sigDrawing(), 0.1, 0.5), npS: b === 3 ? op(span(p, 0.3, 0.7), npDrawing()) : '', ...tools(b, p, 3, tr('np-kaart', 'np chart', 260)) });
      if (si === 3) Object.assign(o, { spreadS: fade(b, 0, p, spreadDrawing(), 0.1, 0.5), stabS: fade(b, 1, p, stabDrawing(), 0.1, 0.5), repS: b === 2 ? op(span(p, 0.3, 0.7), repDrawing()) : '', ...tools(b, p, 2, tr('Capability-rapport', 'Capability report', 260)) });
      if (si === 4) Object.assign(o, { floorS: fade(b, 0, p, floorDrawing(), 0.1, 0.5), whenS: fade(b, 1, p, whenDrawing(), 0.1, 0.5), fofS: b === 2 ? op(span(p, 0.3, 0.7), fofDrawing()) : '', endS: fade(b, 3, p, endDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Eerstestukcontrole', 'First-off check', 260)) });
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
