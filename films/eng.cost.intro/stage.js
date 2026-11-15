// The stage of the module intro film "Wat een te lichte doos kost / What a too-light carton costs": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the better field film: the filling unit over the belt of line 3
// with its cartons, you and the team lead; the crate with the bad cartons stands from the first sentence (the carton goes in the
// bin), the table with the laptop appears at the sentence that names the laptop and the sheet on it at the sentence that puts the
// payback on it. The panel at the right draws each beat as a schema, labelled "voorbeeld" (the unit's way) or "schema" (the
// module's map). The cost price, the decision, the investment and the savings are panel schemas only. Every part a sentence can
// light is a static data-cue group (build.mjs); this script only fills the panel and shows or hides the room's moving parts. The
// closing scene (the shared Engineering map, then the module's four topics with their levels) is ONE function, closing; the map
// itself is the kit's mapScene.
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
  const IDS = ['costprice', 'decisions', 'invest', 'lean'];
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

  // ---- the room: the crate with the bad cartons stands from the first sentence (the carton goes in the bin). You and the team lead come
  // in at the sentence that names you (the opening's third beat) and are both there again at the last sentence of the film. The table with
  // the laptop stands from the sentence that names the laptop, the sheet on it from the sentence that puts the payback on it
  function room(si, b) {
    show(E['o-crate'], 1);
    show(E['o-lap'], (si === 3 && b >= 2) || si >= 4 ? 1 : 0);
    show(E['o-sheet'], (si === 3 && b >= 3) || si >= 4 ? 1 : 0);
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

  // ---- s1: a too-light carton of line 3 goes in the bin and costs money; the module is about what a part really costs and whether a
  // fix is worth it; you and the team lead work it out after the shift.
  function unitDrawing() {
    return card1(64, 'Te lichte doos', 'Too-light carton') + arrow(476, 112, 476, 126) + card1(130, 'In de bak', 'In the bin') + arrow(476, 178, 476, 192) + card1(196, 'Kost geld', 'Costs money', 'pm-crit');
  }
  function modDrawing() {
    return card1(64, 'Wat iets kost', 'What it costs') + arrow(476, 112, 476, 126) + card1(130, 'Loont de fix?', 'Does the fix pay?', 'pm-crit');
  }
  function shiftDrawing() {
    let s = txt(334, 112, tr('Na de dienst', 'After the shift', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 8; i++) s += rect(334 + i * 36, 126, 32, 34, i < 6 ? 'pm-tile' : 'pm-out', 6);
    return s + path('M334 196H618M610 191L618 196L610 201', 'pm-arrow') + txt(334, 236, tr('jullie rekenen het uit', 'you work it out', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: you build the cost price of a carton from the bottom up; every line is a quantity times a rate; a carton scrapped late
  // carries all the cost put into it; the overhead surcharge (the chip above) spreads the indirect costs.
  function buildDrawing() {
    return tile(100, 'Materiaal', 'Material') + tile(138, 'Machinetijd', 'Machine time') + tile(176, 'Arbeid', 'Labour') + tile(214, 'Omstellen', 'Setup') + arrow(476, 252, 476, 266) + card1(270, 'Kostprijs', 'Cost price', 'pm-crit');
  }
  function rateDrawing() {
    return tile(100, 'Machinetijd', 'Machine time') + txt(476, 158, '×', 22, 'middle', 'pm-mute') + tile(166, 'Uurtarief', 'Hour rate') + arrow(476, 204, 476, 218) + card1(222, 'Een regel', 'One line', 'pm-crit');
  }
  function carryDrawing() {
    let s = '';
    for (let i = 0; i < 4; i++) s += rect(334, 100 + i * 30, 284, 24, 'pm-bar', 4);
    return s + arrow(476, 224, 476, 238) + card2(242, 'In de bak', 'In the bin', 'met alle kosten erin', 'with all its cost in it', 'pm-crit');
  }
  // the chip sits at y 110 to 144, so the schema starts under it
  function ovDrawing() {
    let s = card1(166, 'Indirecte kosten', 'Indirect costs');
    for (let i = 0; i < 3; i++) s += rect(338 + i * 94, 252, 88, 34, 'pm-tile', 5);
    return s + path('M476 214V236M382 236H570M382 236V252M476 236V252M570 236V252', 'pm-link') + txt(334, 326, tr('over de producten', 'over the products', 284), 22, 'start', 'pm-mute');
  }

  // ---- s3: decisions and prices; only the costs that differ between the options count; fixed costs stay the same, variable costs
  // move with each carton; the contribution margin (the chip above) is the price minus the variable cost of a good carton.
  function topDrawing() {
    return card1(100, 'Besluiten', 'Decisions') + card1(166, 'Prijzen', 'Prices');
  }
  function relDrawing() {
    return rect(334, 100, 136, 44, 'pm-card', 8) + txt(346, 130, tr('Zo laten', 'Leave it', 112), 22, 'start', 'pm-big') + rect(482, 100, 136, 44, 'pm-card', 8) + txt(494, 130, tr('Oplossen', 'Fix it', 112), 22, 'start', 'pm-big')
      + card1(170, 'Wat verschilt', 'What differs', 'pm-crit') + card1(236, 'Wat gelijk blijft', 'What stays equal', 'pm-out');
  }
  function fixDrawing() {
    return card2(100, 'Vast', 'Fixed', 'blijft gelijk', 'stays the same') + card2(172, 'Variabel', 'Variable', 'gaat mee per doos', 'moves per carton');
  }
  function marDrawing() {
    return txt(334, 182, tr('Prijs', 'Price', 284), 22, 'start', 'pm-mute') + rect(334, 192, 176, 40, 'pm-tile', 6) + rect(514, 192, 104, 40, 'pm-crit', 6)
      + txt(334, 262, tr('Variabel', 'Variable', 176), 22, 'start', 'pm-mute') + txt(618, 262, tr('Bijdrage', 'Margin', 104), 22, 'end', 'pm-mute');
  }

  // ---- s4: the fix costs money too, spent once on something that lasts for years; what counts is cash; the cash saving (the chip
  // above) is worked out on the laptop; the payback, the investment over the yearly cash saving, goes on the sheet.
  function onceDrawing() {
    let s = rect(334, 120, 64, 120, 'pm-crit', 6);
    for (let i = 0; i < 5; i++) s += rect(420 + i * 40, 210, 34, 30, 'pm-tile', 4);
    return s + txt(334, 276, tr('Eén keer uit', 'Spent once', 284), 22, 'start', 'pm-mute') + txt(334, 310, tr('jaren in gebruik', 'years in use', 284), 22, 'start', 'pm-mute');
  }
  function cashDrawing() {
    return txt(334, 118, tr('Telt alleen als', 'Counts only if', 284), 22, 'start', 'pm-mute') + rect(334, 134, 136, 44, 'pm-tile', 8) + txt(346, 164, tr('Minder uit', 'Less out', 112), 22, 'start', 'pm-txt')
      + rect(482, 134, 136, 44, 'pm-tile', 8) + txt(494, 164, tr('Meer in', 'More in', 112), 22, 'start', 'pm-txt') + arrow(402, 184, 402, 210) + arrow(550, 210, 550, 184) + card1(226, 'Kasgeld', 'Cash', 'pm-crit');
  }
  // the chip sits at y 110 to 144, so the schema starts under it
  function saveDrawing() {
    let s = '';
    for (let i = 0; i < 5; i++) s += rect(334 + i * 58, 190, 52, 60, 'pm-tile', 4);
    return s + txt(334, 296, tr('Elk jaar', 'Every year', 284), 22, 'start', 'pm-mute');
  }
  function payDrawing() {
    return tile(100, 'Investering', 'Investment') + path('M334 148H618', 'pm-link') + tile(158, 'Kasbesparing per jaar', 'Cash saving per year') + arrow(476, 196, 476, 210) + card1(214, 'Terugverdientijd', 'Payback time', 'pm-crit');
  }

  // ---- s5: waste in euros; stock is money on the shelf; a carton in the bin is priced at what is really lost; the cost of poor quality
  // (the chip above) is the failure part of the cost of quality. The shift ends with what line 3 really costs.
  function wasteDrawing() {
    return card1(100, 'Verspilling', 'Waste') + arrow(476, 148, 476, 162) + card1(166, 'Euro’s', 'Euros', 'pm-crit');
  }
  function stockDrawing() {
    let s = path('M334 190H618M334 280H618', 'pm-link');
    for (let i = 0; i < 4; i++) s += rect(342 + i * 62, 150, 52, 40, 'pm-tile', 4);
    for (let i = 0; i < 2; i++) s += rect(342 + i * 62, 240, 52, 40, 'pm-tile', 4);
    s += rect(466, 240, 52, 40, 'pm-out', 4);
    return s + txt(334, 326, tr('Geld op de plank', 'Money on the shelf', 284), 22, 'start', 'pm-mute');
  }
  function lossDrawing() {
    return txt(334, 122, tr('Wat erin zit', 'What is in it', 284), 22, 'start', 'pm-mute') + rect(334, 132, 284, 30, 'pm-bar', 5)
      + txt(334, 212, tr('Wat echt verloren gaat', 'What is really lost', 284), 22, 'start', 'pm-mute') + rect(334, 222, 150, 30, 'pm-crit', 5);
  }
  // the chip sits at y 110 to 144, so the schema starts under it
  function failDrawing() {
    return tile(166, 'Uitval', 'Scrap') + tile(208, 'Herbewerking', 'Rework') + tile(250, 'Claims', 'Claims');
  }
  function endDrawing() {
    return card1(140, 'Wat lijn 3 kost', 'What line 3 costs') + arrow(476, 188, 476, 202) + card1(206, 'Loont de fix?', 'Does the fix pay?', 'pm-crit');
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

  const HEAD = [[tr('Kostprijs', 'Cost price', 165)], [tr('Besluiten', 'Decisions', 165)], [tr('Investeren', 'Investing', 165)], [tr('Besparingen', 'Savings', 165)]];

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
      if (si === 1) Object.assign(o, { buildS: fade(b, 0, p, buildDrawing(), 0.1, 0.5), rateS: fade(b, 1, p, rateDrawing(), 0.1, 0.5), carryS: fade(b, 2, p, carryDrawing(), 0.1, 0.5), ovS: b === 3 ? op(span(p, 0.3, 0.7), ovDrawing()) : '', ...tools(b, p, 3, tr('Overheadopslag', 'Overhead surcharge', 260)) });
      if (si === 2) Object.assign(o, { topS: fade(b, 0, p, topDrawing(), 0.1, 0.5), relS: fade(b, 1, p, relDrawing(), 0.1, 0.5), fixS: fade(b, 2, p, fixDrawing(), 0.1, 0.5), marS: b === 3 ? op(span(p, 0.3, 0.7), marDrawing()) : '', ...tools(b, p, 3, tr('Dekkingsbijdrage', 'Contribution margin', 260)) });
      if (si === 3) Object.assign(o, { onceS: fade(b, 0, p, onceDrawing(), 0.1, 0.5), cashS: fade(b, 1, p, cashDrawing(), 0.1, 0.5), saveS: b === 2 ? op(span(p, 0.3, 0.7), saveDrawing()) : '', payS: fade(b, 3, p, payDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Kasbesparing', 'Cash saving', 260)) });
      if (si === 4) Object.assign(o, { wasteS: fade(b, 0, p, wasteDrawing(), 0.1, 0.5), stockS: fade(b, 1, p, stockDrawing(), 0.1, 0.5), lossS: fade(b, 2, p, lossDrawing(), 0.1, 0.5), failS: b === 3 ? op(span(p, 0.3, 0.7), failDrawing()) : '', endS: fade(b, 4, p, endDrawing(), 0.1, 0.5), ...tools(b, p, 3, tr('Faalkosten', 'Cost of poor quality', 260)) });
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
