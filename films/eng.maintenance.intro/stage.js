// The stage of the module intro film "De vuleenheid heel houden / Keeping the filling unit whole": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the run field film: the filling unit over the belt of line 3
// with its cartons, you and the team lead; the tag on the unit's front upright appears at the sentence that gives a deviation
// its label, the CILT standard on its board at the sentence that names it, the laptop at the sentence that names the CMMS.
// The panel at the right draws each beat as a schema, labelled "voorbeeld" (the unit's way) or "schema" (the module's map).
// The strategies, the planning and the measures are panel schemas only. Every part a sentence can light is a static data-cue
// group (build.mjs); this script only fills the panel and shows or hides the room's moving parts. The closing scene (the
// shared Engineering map, then the module's four topics with their levels) is ONE function, closing; the map itself is the
// kit's mapScene.
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
  const IDS = ['strategy', 'tpm', 'planning', 'measure'];
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
  // end of the last topic (where the unit stays whole). The tag stands on the unit from the sentence that gives a deviation its
  // label, the CILT standard on its board from the sentence that names it, the laptop from the sentence that names the CMMS
  function room(si, b) {
    show(E['o-tag'], (si === 2 && b >= 1) || si >= 3 ? 1 : 0);
    show(E['o-cilt'], (si === 2 && b >= 2) || si >= 3 ? 1 : 0);
    show(E['o-lap'], (si === 3 && b >= 3) || si >= 4 ? 1 : 0);
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

  // ---- s1: the unit must run the whole shift; the module goes from breakdown to predictive and covers the numbers; you and the
  // team lead keep the unit whole for a shift.
  function unitDrawing(last) {
    return card1(64, 'De vuleenheid', 'The filling unit') + arrow(476, 112, 476, 126) + card1(130, 'Een hele dienst', 'A whole shift', last);
  }
  function modDrawing() {
    return card1(64, 'Storing', 'Breakdown') + arrow(476, 112, 476, 126) + card1(130, 'Voorspellend', 'Predictive') + card1(196, 'Cijfers', 'Numbers');
  }
  function shiftDrawing() {
    let s = txt(334, 112, tr('Een hele dienst', 'A whole shift', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 8; i++) s += rect(334 + i * 36, 126, 32, 34, 'pm-tile', 6);
    return s + path('M334 196H618M610 191L618 196L610 201', 'pm-arrow') + txt(334, 236, tr('de eenheid heel', 'the unit whole', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: four strategies; parts wear with age or fail at random, so a fixed interval does not fit everything; the bathtub
  // curve (the chip above) is the chance of failure against age, early, then flat, then rising.
  function ladDrawing(named) {
    const names = [tr('Na de storing', 'After breakdown'), tr('Vast interval', 'Fixed interval'), tr('Op de conditie', 'On condition'), tr('Voorspelling', 'Forecast')];
    let s = '';
    names.forEach((t, i) => {
      const x = 334 + i * 18;
      const y = 100 + i * 46;
      s += named ? rect(x, y, 230, 34, 'pm-tile', 6) + txt(x + 12, y + 25, t, 22, 'start', 'pm-txt') : rect(x, y, 230, 34, 'pm-out', 6);
    });
    return s;
  }
  function wearDrawing() {
    return rect(334, 100, 284, 78, 'pm-card', 8) + txt(346, 128, tr('Slijt met leeftijd', 'Wears with age', 260), 22, 'start', 'pm-big') + path('M346 166C440 164 540 156 606 136', 'pm-arrow')
      + rect(334, 196, 284, 78, 'pm-card', 8) + txt(346, 224, tr('Faalt willekeurig', 'Fails at random', 260), 22, 'start', 'pm-big') + path('M346 254H606', 'pm-dash');
  }
  function bathDrawing() {
    return path('M342 330H612M342 330V172', 'pm-link') + path('M346 186C352 262 372 304 430 304H520C580 304 600 252 610 190', 'pm-arrow') + txt(612, 356, tr('leeftijd', 'age', 120), 22, 'end', 'pm-mute');
  }

  // ---- s3: operators do the basic care; they clean, inspect, lubricate and tighten, and anything that is off gets a tag; the
  // CILT standard (the chip above) is one sheet with the checks.
  function opDrawing() {
    return card1(100, 'Operators', 'Operators') + arrow(476, 148, 476, 162) + card1(166, 'Basiszorg', 'Basic care', 'pm-crit');
  }
  function cyclDrawing() {
    let s = '';
    [['Schoonmaken', 'Clean'], ['Inspecteren', 'Inspect'], ['Smeren', 'Lubricate'], ['Aandraaien', 'Tighten']].forEach((t, i) => { s += tile(100 + i * 38, t[0], t[1]); });
    return s + rect(334, 266, 284, 44, 'pm-out', 8) + txt(346, 297, tr('Label', 'Tag', 260), 22, 'start', 'pm-big');
  }
  function sheetDrawing() {
    let s = rect(334, 160, 284, 190, 'pm-card', 8);
    [150, 200, 120, 180, 160].forEach((len, i) => { const y = 180 + i * 32; s += rect(346, y, 20, 20, 'pm-tile', 3) + path(`M378 ${y + 10}h${len * 0.78}`, 'pm-link'); });
    return s;
  }

  // ---- s4: planning, scheduling and spare parts; a job is prepared with steps, parts and tools; the week is filled up to the
  // hours available; the CMMS (the chip above) takes a work order from notification to closing.
  function p3Drawing() {
    return card1(100, 'Werkvoorbereiding', 'Planning') + card1(154, 'Planning', 'Scheduling') + card1(208, 'Reservedelen', 'Spare parts');
  }
  function jobDrawing() {
    return rect(334, 100, 284, 150, 'pm-card', 8) + [['Stappen', 'Steps'], ['Onderdelen', 'Parts'], ['Gereedschap', 'Tools']].map((t, i) => rect(346, 112 + i * 42, 260, 34, 'pm-tile', 6) + txt(358, 137 + i * 42, tr(t[0], t[1], 236), 22, 'start', 'pm-txt')).join('');
  }
  function weekDrawing() {
    let s = path('M334 262v8h280v-8', 'pm-link') + txt(334, 300, tr('beschikbare uren', 'hours available', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 5; i++) {
      s += rect(334 + i * 56, 130, 52, 120, 'pm-tile', 4);
      for (let j = 0; j < 4; j++) s += rect(338 + i * 56, 222 - j * 28, 44, 24, 'pm-bar', 3);
    }
    return s;
  }
  function cmmsDrawing() {
    let s = rect(334, 190, 130, 56, 'pm-card', 8) + txt(399, 225, tr('Melding', 'Notification', 126), 22, 'middle', 'pm-big') + arrow(468, 218, 484, 218)
      + rect(488, 190, 130, 56, 'pm-crit', 8) + txt(553, 225, tr('Afsluiting', 'Closing', 120), 22, 'middle', 'pm-on');
    for (let i = 0; i < 5; i++) s += rect(334 + i * 62, 276, 34, 34, i === 0 ? 'pm-card' : i === 4 ? 'pm-crit' : 'pm-tile', 5);
    return s + path('M368 293H396M430 293H458M492 293H520M554 293H582', 'pm-link');
  }

  // ---- s5: how often the unit stops and how long it takes; how many of all the hours were planned work; work sampling (the
  // chip above) notes at random moments what a technician is doing. The shift ends with the unit whole.
  function cntDrawing() {
    let s = rect(334, 100, 284, 78, 'pm-card', 8) + txt(346, 128, tr('Hoe vaak', 'How often', 260), 22, 'start', 'pm-big');
    for (let i = 0; i < 5; i++) s += dot(356 + i * 56, 158, 8);
    return s + rect(334, 196, 284, 78, 'pm-card', 8) + txt(346, 224, tr('Hoe lang', 'How long', 260), 22, 'start', 'pm-big') + rect(346, 244, 190, 18, 'pm-crit', 4);
  }
  function hrsDrawing() {
    return txt(334, 118, tr('Alle uren', 'All hours', 284), 22, 'start', 'pm-mute') + rect(334, 130, 284, 40, 'pm-bar', 6) + rect(334, 130, 200, 40, 'pm-crit', 6)
      + txt(334, 208, tr('Gepland werk', 'Planned work', 284), 22, 'start', 'pm-big');
  }
  function smpDrawing() {
    let s = path('M338 270H614', 'pm-link');
    [[346, 1], [384, 0], [412, 0], [468, 1], [496, 1], [536, 0], [566, 1], [598, 0]].forEach(([x, c]) => { s += rect(x, 224, 14, 38, c ? 'pm-crit' : 'pm-tile', 3); });
    return s;
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
      const lines = wrap(t, GRID.tile - 12).slice(0, 3);
      const y0 = y + (GRID.h - lines.length * 22) / 2 + 17;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.1, i * 0.1 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 8, GB, GRID.h - 16, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 3, GB + 10, GRID.h - 6, 'pm-out', 10);
    return out;
  }

  const HEAD = [[tr('Strategieën', 'Strategies', 165)], [tr('TPM', 'TPM', 165)], [tr('Planning', 'Planning', 165)], [tr('Meten', 'Measuring', 165)]];

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
      if (b === 0) o.unitS = op(span(p, 0.05, 0.4), unitDrawing('pm-out'));
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
      if (si === 1) Object.assign(o, { ladS: b === 0 ? op(span(p, 0.1, 0.5), ladDrawing(false)) : b === 1 ? ladDrawing(true) : '', wearS: fade(b, 2, p, wearDrawing(), 0.1, 0.5), bathS: b === 3 ? op(span(p, 0.3, 0.7), bathDrawing()) : '', ...tools(b, p, 3, tr('Badkuipkromme', 'Bathtub curve', 260)) });
      if (si === 2) Object.assign(o, { opS: fade(b, 0, p, opDrawing(), 0.1, 0.5), cyclS: fade(b, 1, p, cyclDrawing(), 0.1, 0.5), sheetS: b === 2 ? op(span(p, 0.3, 0.7), sheetDrawing()) : '', ...tools(b, p, 2, tr('CILT-standaard', 'CILT standard', 260)) });
      if (si === 3) Object.assign(o, { p3S: fade(b, 0, p, p3Drawing(), 0.1, 0.5), jobS: fade(b, 1, p, jobDrawing(), 0.1, 0.5), weekS: fade(b, 2, p, weekDrawing(), 0.1, 0.5), cmmsS: b === 3 ? op(span(p, 0.3, 0.7), cmmsDrawing()) : '', ...tools(b, p, 3, tr('CMMS', 'CMMS', 260)) });
      if (si === 4) Object.assign(o, { cntS: fade(b, 0, p, cntDrawing(), 0.1, 0.5), hrsS: fade(b, 1, p, hrsDrawing(), 0.1, 0.5), smpS: b === 2 ? op(span(p, 0.3, 0.7), smpDrawing()) : '', endS: fade(b, 3, p, `<g transform="translate(0 56)">${unitDrawing('pm-crit')}</g>`, 0.1, 0.5), ...tools(b, p, 2, tr('Multimomentopname', 'Work sampling', 260)) });
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
