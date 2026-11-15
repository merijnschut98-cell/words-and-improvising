// The stage of the module intro film "De unit betrouwbaarder maken / Making the unit more reliable": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the better field film: the filling unit over the belt of line 3 with
// its cartons, you and the team lead, and from the sentence that names the risk matrix and the FMECA the two boards on the side
// wall. The panel at the right draws each beat as a schema, labelled "voorbeeld" (the unit's way) or "schema" (the module's map).
// How a part fails, the failure data, the criticality, the function, the hidden failure, the stop and the decision are panel
// schemas only. Every part a sentence can light is a static data-cue group (build.mjs); this script only fills the panel and shows
// or hides the room's moving parts. The closing scene (the shared Engineering map, then the module's four topics with their
// levels) is ONE function, closing; the map itself is the kit's mapScene.
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
  const IDS = ['failure', 'risk', 'strategy', 'decide'];
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
    const kk = c.at === undefined ? span(u, 0, 1) : b < c.at ? 0 : b === c.at ? span(p, 0, 0.7) : 1;
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- the room: you and the team lead come in at the sentence that names you (the opening's third beat) and are both there again at
  // the last sentence of the film. The two boards on the side wall (the risk matrix and the FMECA sheet) hang from the sentence that
  // names them (the third beat of the third scene) and hang there for the rest of that scene
  function room(si, b) {
    show(E['o-wall'], si === 2 && b >= 2 ? 1 : 0);
    show(E['pp-jij0'], (si === 0 && b >= 2) || (si === 4 && b === 4) ? 1 : 0);
    show(E['pp-teamlead'], (si === 0 && b >= 2) || (si === 4 && b === 4) ? 1 : 0);
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
  // the beat of the sentence (b === at). The second topic has two (the risk matrix and the FMECA, one idea), one under the other
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    if (Array.isArray(one)) return { tool1: b === at ? op(span(p, 0, 0.4), rect(334, 100, 284, 56, 'pm-badge', 6) + txt(342, 125, one[0], 22, 'start', 'pm-txt') + txt(342, 147, one[1], 22, 'start', 'pm-txt')) : '' };
    if (two) return { tool1: b === at ? op(span(p, 0, 0.3), chip(96, one)) : '', tool2: b === at ? op(span(p, 0.2, 0.5), chip(134, two)) : '' };
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a card with a name and one muted line under it (a 62-unit card)
  const card2 = (y, a, b, c, d, cls = 'pm-card', room = 260) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a card with one line (a 44-unit card)
  const card1 = (y, a, b, cls = 'pm-card', room = 260) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
  // a tile with one line (a 34-unit row)
  const tile = (y, a, b, cls = 'pm-tile', room = 260) => rect(334, y, 284, 34, cls, 6) + txt(346, y + 25, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');

  // ---- s1: the filling unit of line 3 sometimes fails and then the line stands still; the module is about how parts fail and what you do
  // about it; you and the team lead make the unit more reliable after the shift.
  function unitDrawing() {
    return card1(64, 'Unit valt uit', 'Unit fails') + arrow(476, 112, 476, 126) + card1(130, 'Lijn 3 staat stil', 'Line 3 stands still', 'pm-crit');
  }
  function modDrawing() {
    return card1(64, 'Hoe onderdelen falen', 'How parts fail') + arrow(476, 112, 476, 126) + card1(130, 'Wat je eraan doet', 'What you do about it', 'pm-crit');
  }
  function shiftDrawing() {
    let s = txt(334, 112, tr('Na de dienst', 'After the shift', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 8; i++) s += rect(334 + i * 36, 126, 32, 34, i < 6 ? 'pm-tile' : 'pm-out', 6);
    return s + path('M334 196H618M610 191L618 196L610 201', 'pm-arrow') + txt(334, 236, tr('betrouwbaarder maken', 'make it more reliable', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: a part fails when the load on it is higher than its strength; wear usually gives a warning, a sudden overload does not; the
  // Weibull fit (the chip above) turns the failure data into a pattern.
  function failDrawing() {
    return tile(100, 'Onderdeel', 'Part') + arrow(476, 138, 476, 152) + card1(156, 'Faalt', 'Fails', 'pm-crit');
  }
  function loadDrawing() {
    return txt(334, 122, tr('Belasting', 'Load', 284), 22, 'start', 'pm-mute') + rect(334, 132, 270, 28, 'pm-crit', 5)
      + txt(334, 202, tr('Sterkte', 'Strength', 284), 22, 'start', 'pm-mute') + rect(334, 212, 180, 28, 'pm-bar', 5)
      + arrow(476, 252, 476, 266) + card1(270, 'Het onderdeel faalt', 'The part fails');
  }
  function warnDrawing() {
    return card2(100, 'Slijtage', 'Wear', 'met waarschuwing', 'with warning') + card2(176, 'Overbelasting', 'Overload', 'zonder waarschuwing', 'without warning', 'pm-crit');
  }
  // the chip sits at y 110 to 144, so the schema starts under it: failures against age, with the fitted curve through the points
  function weibDrawing() {
    let s = txt(334, 172, tr('Uitgevallen', 'Failed', 284), 22, 'start', 'pm-mute');
    s += path('M340 340V180M340 340H614', 'pm-link') + path('M344 336C400 336 430 300 470 262C510 224 540 196 604 188', 'pm-arrow');
    [[380, 334], [424, 316], [462, 270], [504, 232], [548, 204], [596, 190]].forEach(([x, y]) => { s += dot(x, y, 5); });
    return s + txt(340, 372, tr('Leeftijd', 'Age', 284), 22, 'start', 'pm-mute');
  }

  // ---- s3: not every part counts the same; what happens when it fails and how likely that is; the risk matrix and the FMECA (the chips
  // above, the boards on the side wall); the marked cell is the part you tackle first.
  function partsDrawing() {
    return txt(334, 122, tr('Onderdelen', 'Parts', 284), 22, 'start', 'pm-mute') + rect(346, 190, 50, 42, 'pm-card', 5) + rect(406, 170, 60, 62, 'pm-card', 5)
      + rect(476, 150, 80, 82, 'pm-crit', 5) + rect(566, 184, 48, 48, 'pm-card', 5) + txt(334, 270, tr('Niet even zwaar', 'Not equal weight', 284), 22, 'start', 'pm-mute');
  }
  function critDrawing() {
    return tile(100, 'Gevolg', 'Consequence') + tile(142, 'Kans', 'Likelihood') + arrow(476, 180, 476, 194) + card1(198, 'Kritikaliteit', 'Criticality', 'pm-crit');
  }
  // the chips sit at y 96 to 168: the small matrix at the left (three by three, the top right cell as on the wall) and the sheet at the right
  function matDrawing() {
    let s = txt(334, 196, tr('Kans', 'Likelihood', 160), 22, 'start', 'pm-mute');
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) s += rect(346 + i * 50, 208 + j * 44, 46, 40, 'pm-tile', 4);
    s += path('M346 350H492M484 345L492 350L484 355', 'pm-arrow') + txt(346, 376, tr('Gevolg', 'Consequence', 160), 22, 'start', 'pm-mute');
    s += rect(520, 208, 98, 24, 'pm-badge', 4);
    [60, 44, 30].forEach((v, i) => { s += rect(520, 238 + i * 34, 98, 28, 'pm-tile', 4) + rect(528, 248 + i * 34, v, 8, 'pm-badge', 3); });
    return s;
  }
  function markDrawing() {
    let s = txt(334, 118, tr('Kans', 'Likelihood', 284), 22, 'start', 'pm-mute');
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) s += rect(346 + i * 88, 128 + j * 62, 82, 56, i === 2 && j === 0 ? 'pm-crit' : 'pm-tile', 6);
    return s + txt(563, 164, tr('Eerst', 'First', 76), 22, 'middle', 'pm-on') + path('M346 330H604M596 325L604 330L596 335', 'pm-arrow') + txt(346, 360, tr('Gevolg', 'Consequence', 284), 22, 'start', 'pm-mute');
  }

  // ---- s4: RCM chooses which maintenance each part really needs; you start with what the unit must do (a verb, an object and a standard);
  // a protection can fail without anyone noticing (a hidden failure); the failure-finding task (the chip above) tests it on an interval.
  function rcmDrawing() {
    return card1(100, 'Welk onderhoud?', 'Which maintenance?') + arrow(476, 148, 476, 162) + card1(166, 'Per onderdeel', 'For each part', 'pm-crit');
  }
  function funcDrawing() {
    return txt(334, 120, tr('Een functie', 'A function', 284), 22, 'start', 'pm-mute') + tile(132, 'Werkwoord', 'Verb') + tile(172, 'Object', 'Object') + tile(212, 'Eis', 'Standard', 'pm-crit');
  }
  function hidDrawing() {
    return card1(100, 'Beveiliging', 'Protection', 'pm-out') + path('M584 110L602 128M602 110L584 128', 'pm-cross') + arrow(476, 148, 476, 162) + card1(166, 'Niemand merkt het', 'Nobody notices', 'pm-crit');
  }
  // the chip sits at y 110 to 144, so the schema starts under it: a test, again and again, on a fixed interval
  function ffDrawing() {
    let s = '';
    for (let i = 0; i < 4; i++) s += rect(344 + i * 74, 196, 34, 34, 'pm-crit', 6) + path(`M${352 + i * 74} 214l7 8l12-14`, 'pm-arrow');
    return s + arrow(334, 256, 614, 256) + txt(334, 296, tr('op een vast interval', 'on a fixed interval', 284), 22, 'start', 'pm-mute');
  }

  // ---- s5: the numbers decide; how often the unit fails and how long it then stands still; in many plants waiting is the biggest share
  // of the downtime, not the repair; the operational availability (the chip above) counts the whole stop. The story ends here.
  function dataDrawing() {
    return tile(100, 'Cijfers', 'Numbers') + arrow(476, 138, 476, 152) + card1(156, 'Besluit', 'Decision', 'pm-crit');
  }
  function countDrawing() {
    return card2(100, 'Hoe vaak', 'How often', 'de unit uitvalt', 'the unit fails') + card2(176, 'Hoe lang', 'How long', 'hij dan stilstaat', 'it then stands still');
  }
  function waitDrawing() {
    return txt(334, 122, tr('Repareren', 'Repairing', 284), 22, 'start', 'pm-mute') + rect(334, 132, 80, 30, 'pm-tile', 5)
      + txt(334, 202, tr('Wachten', 'Waiting', 284), 22, 'start', 'pm-mute') + rect(334, 212, 284, 30, 'pm-crit', 5);
  }
  // the chip sits at y 100 to 156 (two lines), so the schema starts under it: the time running and the whole stop
  function opDrawing() {
    return rect(334, 200, 120, 34, 'pm-tile', 5) + rect(454, 200, 100, 34, 'pm-crit', 5) + rect(554, 200, 64, 34, 'pm-tile', 5)
      + txt(334, 268, tr('Draait', 'Running', 110), 22, 'start', 'pm-mute') + txt(454, 268, tr('Hele stop', 'Whole stop', 164), 22, 'start', 'pm-mute');
  }
  function endDrawing() {
    return card1(140, 'Waar het telt', 'Where it counts') + arrow(476, 188, 476, 202) + card1(206, 'Unit betrouwbaarder', 'More reliable unit', 'pm-crit');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Reliability and asset strategy lit, the whole sheet and then zoomed to the lit place at 1.5; then the
  // module's four topics, each with its four levels as columns (the words the app uses for the levels), the start marker on
  // the first level of the first topic.
  const MAP0 = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
  // the zoom on the lit place stays inside the sheet (no empty strip beside the map). Reliability and asset strategy is on the last row of its
  // zone and the zone's name, which the beat says ("in De fabriek beter maken"), stays on screen above it
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

  const HEAD = [[tr('Falen', 'Failure', 165)], [tr('Kritikaliteit', 'Criticality', 165)], [tr('Onderhoud', 'Maintenance', 165)], [tr('Besluiten', 'Decisions', 165)]];

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
      if (si === 1) Object.assign(o, { failS: fade(b, 0, p, failDrawing(), 0.1, 0.5), loadS: fade(b, 1, p, loadDrawing(), 0.1, 0.5), warnS: fade(b, 2, p, warnDrawing(), 0.1, 0.5), weibS: b === 3 ? op(span(p, 0.3, 0.7), weibDrawing()) : '', ...tools(b, p, 3, tr('Vormparameter', 'Shape parameter', 260)) });
      if (si === 2) Object.assign(o, { partsS: fade(b, 0, p, partsDrawing(), 0.1, 0.5), critS: fade(b, 1, p, critDrawing(), 0.1, 0.5), matS: b === 2 ? op(span(p, 0.3, 0.7), matDrawing()) : '', markS: fade(b, 3, p, markDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Risicomatrix', 'Risk matrix', 260), 'FMECA') });
      if (si === 3) Object.assign(o, { rcmS: fade(b, 0, p, rcmDrawing(), 0.1, 0.5), funcS: fade(b, 1, p, funcDrawing(), 0.1, 0.5), hidS: fade(b, 2, p, hidDrawing(), 0.1, 0.5), ffS: b === 3 ? op(span(p, 0.3, 0.7), ffDrawing()) : '', ...tools(b, p, 3, tr('Failure-finding-taak', 'Failure-finding task', 260)) });
      if (si === 4) Object.assign(o, { dataS: fade(b, 0, p, dataDrawing(), 0.1, 0.5), countS: fade(b, 1, p, countDrawing(), 0.1, 0.5), waitS: fade(b, 2, p, waitDrawing(), 0.1, 0.5), opS: b === 3 ? op(span(p, 0.3, 0.7), opDrawing()) : '', endS: fade(b, 4, p, endDrawing(), 0.1, 0.5), ...tools(b, p, 3, [tr('Operationele', 'Operational', 260), tr('beschikbaarheid', 'availability', 260)]) });
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
