// The stage of the module intro film "Te lichte dozen op lijn 3 / Too-light cartons on line 3": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the better field film: the filling unit over the belt of line 3
// with its cartons, you and the team lead; the board with the why tree appears at the sentence that names the why tree, the
// chalk circle (you stand in it) at the sentence that names the Ohno circle, the andon on the unit at the sentence that names it.
// The panel at the right draws each beat as a schema, labelled "voorbeeld" (the unit's way) or "schema" (the module's map).
// The root cause, the experiment, the A3 and the value stream are panel schemas only. Every part a sentence can light is a
// static data-cue group (build.mjs); this script only fills the panel and shows or hides the room's moving parts. The closing
// scene (the shared Engineering map, then the module's four topics with their levels) is ONE function, closing; the map itself
// is the kit's mapScene.
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
  const IDS = ['cause', 'facts', 'a3', 'kaizen'];
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

  // ---- the room: you and the team lead come in at the sentence that names you (the opening's third beat). In the facts scene you
  // stand at the front until the Ohno circle is named, then in it. The board with the why tree stands from the sentence that names
  // the why tree, the andon from the sentence that names it, and the team lead comes to help at that sentence (as the sentence says);
  // you and the team lead are both there again at the last sentence of the film
  function room(si, b) {
    show(E['o-tree'], (si === 1 && b >= 3) || si >= 2 ? 1 : 0);
    show(E['o-ring'], (si === 2 && b >= 3) || si >= 3 ? 1 : 0);
    show(E['o-andon'], (si === 4 && b >= 3) ? 1 : 0);
    show(E['pp-jij0'], (si === 0 && b >= 2) || (si === 2 && b < 3) || (si === 4 && b === 4) ? 1 : 0);
    show(E['pp-jij'], si === 2 && b === 3 ? 1 : 0);
    show(E['pp-teamlead'], (si === 0 && b >= 2) || (si === 4 && b >= 3) ? 1 : 0);
  }

  // ---- the route (s1, the last two beats): the module's four topics in two groups, the map before the detail. Each row has
  // its number and its index title, wrapped by the kit's widths into 262 units left of the number; a title of two lines gets a
  // taller row. The rows keep their place whichever groups show
  const ROUTE = (() => {
    const rows = [];
    let y = 52;
    [[0, 1], [2, 3]].forEach((grp) => {
      grp.forEach((i) => {
        const lines = wrap(TITLE[i], 262).slice(0, 3);
        const h = lines.length === 1 ? 34 : lines.length === 2 ? 56 : 78;
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
      s += rect(328, r.y, 296, r.h, 'pm-tile', 6) + txt(616, r.y + 25, String(r.i + 1), 22, 'end', 'pm-on');
      r.lines.forEach((l, j) => { s += txt(336, r.y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
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

  // ---- s1: too-light cartons keep coming out of the filling unit; the module is about finding root causes and improving; you and
  // the team lead stay after the shift to fix it for good.
  function unitDrawing() {
    return card1(64, 'De vuleenheid', 'The filling unit') + arrow(476, 112, 476, 126) + card1(130, 'Te lichte dozen', 'Too-light cartons', 'pm-crit');
  }
  function modDrawing() {
    return card1(64, 'Grondoorzaken', 'Root causes') + arrow(476, 112, 476, 126) + card1(130, 'Verbeteren', 'Improving');
  }
  function shiftDrawing() {
    let s = txt(334, 112, tr('Na de dienst', 'After the shift', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 8; i++) s += rect(334 + i * 36, 126, 32, 34, i < 6 ? 'pm-tile' : 'pm-out', 6);
    return s + path('M334 196H618M610 191L618 196L610 201', 'pm-arrow') + txt(334, 236, tr('jullie blijven nog', 'you stay on', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: a too-light carton is the symptom; the root cause is the cause that stops the problem once removed; you keep asking
  // why until you reach a cause you can act on; a why tree (the chip above) is a 5 whys with branches, drawn on the board.
  function symDrawing() {
    return card2(100, 'Symptoom', 'Symptom', 'Te lichte doos', 'Too-light carton') + arrow(476, 166, 476, 180) + card1(184, 'Oorzaak?', 'Cause?', 'pm-out');
  }
  function rootDrawing() {
    return card1(100, 'Symptoom', 'Symptom') + arrow(476, 148, 476, 162) + card1(166, 'Grondoorzaak', 'Root cause', 'pm-crit') + txt(334, 252, tr('Weg, dan stopt het', 'Remove it, it stops', 284), 22, 'start', 'pm-mute');
  }
  function whyDrawing() {
    let s = '';
    for (let i = 0; i < 3; i++) s += tile(100 + i * 52, 'Waarom?', 'Why?') + arrow(476, 134 + i * 52, 476, 148 + i * 52);
    return s + card1(256, 'Een oorzaak', 'A cause', 'pm-crit');
  }
  function treeDrawing() {
    let s = rect(334, 236, 64, 34, 'pm-card', 6) + rect(428, 190, 64, 34, 'pm-tile', 6) + rect(428, 282, 64, 34, 'pm-tile', 6)
      + rect(522, 164, 96, 30, 'pm-tile', 6) + rect(522, 214, 96, 30, 'pm-tile', 6) + rect(522, 262, 96, 30, 'pm-tile', 6) + rect(522, 306, 96, 30, 'pm-crit', 6);
    return s + path('M398 253H413M413 207V299M413 207H428M413 299H428M492 207H507M507 179V229M507 179H522M507 229H522M492 299H507M507 277V321M507 277H522M507 321H522', 'pm-link');
  }

  // ---- s3: you go and see for yourself where it happens; a report shows what someone chose to record, on the floor you count and
  // measure; with those figures you test what you think, test what you think; the Ohno circle (the chip above) is a chalk
  // circle on the floor.
  function floorDrawing() {
    return card1(100, 'De echte plek', 'The real place', 'pm-crit');
  }
  function cmpDrawing() {
    return card1(100, 'Rapport', 'Report', 'pm-out') + card1(166, 'Tellen en meten', 'Count and measure') + arrow(476, 212, 476, 226) + card1(230, 'Toetsen wat je denkt', 'Test what you think', 'pm-crit');
  }
  function ringDrawing() {
    let s = rect(374, 160, 204, 24, 'pm-tile', 4);
    for (let i = 0; i < 3; i++) s += rect(392 + i * 60, 166, 24, 12, 'pm-bar', 2);
    return s + path('M538 262a62 62 0 1 0 -124 0a62 62 0 1 0 124 0', 'pm-dash') + dot(476, 262, 10);
  }

  // ---- s4: an improvement is an experiment; you predict what a countermeasure does, try it small and compare; the story of the
  // problem fits on one A3 sheet; the trial (the chip above) is the small try on one machine.
  function expDrawing() {
    return card1(100, 'Verbetering', 'Improvement') + arrow(476, 148, 476, 162) + card1(166, 'Experiment', 'Experiment', 'pm-crit');
  }
  // the tool's chip sits at y 110 to 144, so the trial schema starts under it
  function trialDrawing(full) {
    return card1(156, 'Voorspelling', 'Prediction', full ? 'pm-card' : 'pm-crit') + (full ? arrow(476, 204, 476, 216) + card1(220, 'Klein proberen', 'Try it small') + arrow(476, 268, 476, 280) + card1(284, 'Vergelijken', 'Compare', 'pm-crit') : '');
  }
  function sheetDrawing() {
    let s = rect(334, 100, 284, 200, 'pm-card', 8) + path('M476 112V288', 'pm-link') + txt(606, 290, 'A3', 22, 'end', 'pm-mute');
    for (let i = 0; i < 4; i++) s += rect(346, 114 + i * 42, 118, 32, 'pm-tile', 5);
    for (let i = 0; i < 3; i++) s += rect(488, 114 + i * 42, 118, 32, i === 2 ? 'pm-crit' : 'pm-tile', 5);
    return s;
  }
  // ---- s5: kaizen is improving step by step, with the team; every day small, sometimes an event; the value stream shows where
  // the material waits; the andon (the chip above) is how an operator calls the team lead. The shift ends with the problem tackled.
  function stepDrawing() {
    let s = txt(334, 112, tr('Stap voor stap', 'Step by step', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 5; i++) s += rect(334 + i * 58, 300 - (i + 1) * 36, 52, (i + 1) * 36, i === 4 ? 'pm-crit' : 'pm-tile', 4);
    return s;
  }
  function evtDrawing() {
    let s = txt(334, 118, tr('Elke dag', 'Every day', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 7; i++) s += rect(334 + i * 42, 128, 34, 28, 'pm-tile', 4);
    return s + txt(334, 196, tr('Soms een event', 'Sometimes an event', 284), 22, 'start', 'pm-mute') + rect(334, 208, 284, 44, 'pm-crit', 8) + txt(346, 238, tr('Een paar dagen', 'A few days', 260), 22, 'start', 'pm-on');
  }
  function flowDrawing() {
    let s = '';
    for (let i = 0; i < 4; i++) s += rect(334 + i * 78, 130, 50, 34, 'pm-tile', 5);
    for (let i = 0; i < 3; i++) s += path(`M${392 + i * 78} 158h16l-8-16z`, 'pm-link');
    return s + txt(334, 226, tr('Waar het wacht', 'Where it waits', 284), 22, 'start', 'pm-mute') + rect(334, 238, 40, 22, 'pm-crit', 4) + rect(378, 238, 86, 22, 'pm-bar', 4) + rect(468, 238, 30, 22, 'pm-crit', 4) + rect(502, 238, 116, 22, 'pm-bar', 4);
  }
  function andDrawing() {
    let s = `<circle class="pm-crit" cx="476" cy="206" r="22"/>`;
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      s += path(`M${f1(476 + 30 * Math.cos(a))} ${f1(206 + 30 * Math.sin(a))}L${f1(476 + 40 * Math.cos(a))} ${f1(206 + 40 * Math.sin(a))}`, 'pm-link');
    }
    return s + path('M476 250V300', 'pm-link') + rect(466, 300, 20, 26, 'pm-tile', 4);
  }
  function endDrawing() {
    return card1(140, 'Te lichte dozen', 'Too-light cartons', 'pm-out') + arrow(476, 188, 476, 202) + card1(206, 'Komen niet terug', 'No longer come back', 'pm-crit');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Engineering problem solving lit, the whole sheet and then zoomed to the lit place at 1.5; then the
  // module's four topics, each with its four levels as columns (the words the app uses for the levels), the start marker on
  // the first level of the first topic.
  const MAP0 = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
  // the zoom on the lit place stays inside the sheet (no empty strip beside the map). Engineering problem solving is on the
  // first row of its zone and the zone's name, which the beat says ("in De fabriek beter maken"), stays on screen above it
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
      const lines = wrap(t, GRID.tile - 12).slice(0, 3);
      const y0 = y + (GRID.h - lines.length * 22) / 2 + 17;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.1, i * 0.1 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 8, GB, GRID.h - 16, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 3, GB + 10, GRID.h - 6, 'pm-out', 10);
    return out;
  }

  const HEAD = [[tr('Grondoorzaak', 'Root cause', 165)], [tr('Feiten', 'Facts', 165)], [tr('PDCA en A3', 'PDCA and A3', 165)], [tr('Kaizen', 'Kaizen', 165)]];

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
      if (b === 0) o.unitS = op(span(p, 0.05, 0.4), unitDrawing());
      if (b === 1) o.modS = modDrawing();
      if (b === 2) o.shiftS = op(span(p, 0.05, 0.4), shiftDrawing());
      if (b >= 3) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, 2, b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b >= 4) o.grpB = routeGroup(2, 2, b === 4 ? span(p, 0.05, 0.4) : 1);
      }
    } else if (si >= 1 && si <= 4) {
      title = HEAD[si - 1][0];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { symS: b === 0 ? op(span(p, 0.1, 0.5), symDrawing()) : '', rootS: fade(b, 1, p, rootDrawing(), 0.1, 0.5), whyS: fade(b, 2, p, whyDrawing(), 0.1, 0.5), treeS: b === 3 ? op(span(p, 0.3, 0.7), treeDrawing()) : '', ...tools(b, p, 3, tr('Waaromboom', 'Why tree', 260)) });
      if (si === 2) Object.assign(o, { flS: fade(b, 0, p, floorDrawing(), 0.1, 0.5), cmpS: fade(b, 1, p, cmpDrawing(), 0.1, 0.5), ringS: b === 2 ? op(span(p, 0.3, 0.7), ringDrawing()) : '', ...tools(b, p, 2, tr('Ohno-cirkel', 'Ohno circle', 260)) });
      if (si === 3) Object.assign(o, { expS: fade(b, 0, p, expDrawing(), 0.1, 0.5), trialS: b === 1 || b === 2 ? op(span(p, 0.1, 0.5), trialDrawing(b === 2)) : '', sheetS: fade(b, 3, p, sheetDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Proef', 'Trial', 260)) });
      if (si === 4) Object.assign(o, { stepS: fade(b, 0, p, stepDrawing(), 0.1, 0.5), evtS: fade(b, 1, p, evtDrawing(), 0.1, 0.5), flowS: fade(b, 2, p, flowDrawing(), 0.1, 0.5), andS: b === 3 ? op(span(p, 0.3, 0.7), andDrawing()) : '', endS: fade(b, 4, p, endDrawing(), 0.1, 0.5), ...tools(b, p, 3, tr('Andon', 'Andon', 260)) });
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
