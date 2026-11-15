// The stage of the module intro film "Lijn 3 automatiseren / Automating line 3": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the digital field film: the filling unit over the belt of
// line 3 with its cartons and you; the pair of sensors, the product on the belt and the PLC cabinet appear at the sentence
// that gives each its reason. The panel at the right draws each beat as a schema, labelled "voorbeeld" (line 3's way) or
// "schema" (the module's map). Robots, recipes, ladder logic and the business case are panel schemas only. Every part a
// sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or hides the room's
// moving parts. The closing scene (the shared Engineering map, then the module's six topics with their levels) is ONE
// function, closing; the map itself is the kit's mapScene.
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
  const IDS = ['design', 'robots', 'errorproof', 'variants', 'control', 'business'];
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

  // ---- the room: you come in at the route of the opening and again at the end of the last topic (the story picks up
  // there). The sensors stand from the second beat of the error-proofing scene on (the sentence that names them), the
  // product on the belt only in the beat that says it, the PLC cabinet from the second beat of the control scene on
  function room(si, b) {
    show(E['o-eye'], (si === 3 && b >= 1) || (si > 3 && si < 7) ? 1 : 0);
    show(E['o-spill'], si === 3 && b === 2 ? 1 : 0);
    show(E['o-plc'], (si === 5 && b >= 1) || si === 6 ? 1 : 0);
    show(E['pp-jij'], (si === 0 && b >= 2) || (si === 6 && b === 3) ? 1 : 0);
  }

  // ---- the route (s1, the last three beats): the module's six topics in three groups, the map before the detail. Each
  // row has its number and its index title, wrapped by the kit's widths into 240 units left of the number; a title of two
  // lines gets a taller row. The rows keep their place whichever groups show
  const ROUTE = (() => {
    const rows = [];
    let y = 52;
    [[0, 1], [2, 3, 4], [5]].forEach((grp) => {
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
  // the topic strip (s2 to s7): six small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3, 4, 5].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // tool names as chips high in the panel under the strip (one short sentence names them; they are not explained). Shown
  // in the beat of the sentence (b === at); a topic with one tool leaves the second out
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a card with a name and one muted line under it (a 62-unit card)
  const card2 = (y, a, b, c, d, cls = 'pm-card', room = 260) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a card with one line (a 44-unit card)
  const card1 = (y, a, b, cls = 'pm-card', room = 260) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
  // a tile with one line (a 34-unit row)
  const tile = (y, a, b, cls = 'pm-tile', room = 260) => rect(334, y, 284, 34, cls, 6) + txt(346, y + 25, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');

  // ---- s1: line 3 is a row of stations (carton in, filling, carton out), and what the module is for.
  function flowDrawing() {
    return card1(64, 'Doos erop', 'Carton in') + arrow(476, 112, 476, 126) + card1(130, 'Vullen', 'Filling', 'pm-crit') + arrow(476, 178, 476, 192) + card1(196, 'Doos eruit', 'Carton out')
      + txt(334, 276, tr('elk één vast deel werk', 'one fixed part each', 284), 22, 'start', 'pm-mute');
  }
  function defDrawing() {
    return rect(334, 64, 284, 170, 'pm-card', 8) + txt(346, 98, tr('Lijnen en', 'Lines and', 260), 22, 'start', 'pm-big') + txt(346, 124, tr('automatisering', 'automation', 260), 22, 'start', 'pm-big')
      + txt(346, 166, tr('assemblagelijnen', 'assembly lines', 260), 22, 'start', 'pm-mute') + txt(346, 194, tr('ontwerpen en', 'designing and', 260), 22, 'start', 'pm-mute')
      + txt(346, 222, tr('verbeteren', 'improving', 260), 22, 'start', 'pm-mute');
  }

  // ---- s2: follow one carton along three stations; the slowest station sets the pace; the conveyor.
  function stationsDrawing(p) {
    const xs = [334, 440, 546];
    const chain = xs.map((x, i) => rect(x, 130, 72, 60, 'pm-card', 8) + txt(x + 36, 168, String(i + 1), 22, 'middle', 'pm-big')).join('') + arrow(408, 160, 438, 160) + arrow(514, 160, 544, 160);
    const cx = lerp(358, 570, span(p, 0.1, 0.9));
    return chain + rect(cx - 13, 96, 26, 24, 'pm-crit', 4) + txt(334, 236, tr('tel de stations', 'count the stations', 284), 22, 'start', 'pm-mute');
  }
  function bottleDrawing() {
    const bars = [80, 150, 100];
    return bars.map((bw, i) => txt(346, 134 + i * 46, tr('Station ' + (i + 1), 'Station ' + (i + 1), 100), 22, 'start', i === 1 ? 'pm-big' : 'pm-txt') + rect(450, 112 + i * 46, bw, 30, i === 1 ? 'pm-crit' : 'pm-bar', 5)).join('')
      + txt(334, 276, tr('bepaalt het tempo', 'sets the pace', 284), 22, 'start', 'pm-mute');
  }
  function beltDrawing() {
    return rect(334, 224, 284, 16, 'pm-bar', 4) + [350, 420, 490].map((x) => rect(x, 196, 30, 26, 'pm-tile', 4)).join('') + arrow(560, 262, 600, 262);
  }

  // ---- s3: a robot arm (base, link, link, wrist, gripper), a carton set down at the start of a belt, the teach pendant.
  function armDrawing(b, p) {
    const arm = path('M416 332V282L488 250L548 272', 'pm-arm') + path('M548 272L539 296M548 272L557 296', 'pm-link')
      + [dot(416, 282, 8), dot(488, 250, 8), dot(548, 272, 8)].join('') + rect(392, 332, 48, 14, 'pm-card', 4) + dot(416, 332, 8);
    let s = arm;
    if (b === 0) s += txt(446, 228, tr('assen', 'axes', 150), 22, 'start', 'pm-mute') + txt(526, 322, tr('grijper', 'gripper', 90), 22, 'end', 'pm-mute');
    if (b === 1) s += rect(470, 332, 148, 14, 'pm-bar', 4) + rect(534, lerp(296, 304, span(p, 0.1, 0.8)), 28, 28, 'pm-crit', 4) + txt(470, 374, tr('bandbegin', 'belt start', 148), 22, 'start', 'pm-mute');
    if (b === 2) s += rect(334, 236, 64, 50, 'pm-card', 6) + path('M366 286V339H392', 'pm-link');
    return `<g transform="translate(0 -60)">${s}</g>`;
  }

  // ---- s4: the unit fills only under the plate, two sensors across the belt, product on the belt without a carton.
  function errDrawing() {
    return card1(100, 'Doos onder de plaat', 'Carton under the plate') + arrow(476, 148, 476, 176) + card1(180, 'Dan pas vullen', 'Then fill', 'pm-crit');
  }
  function eyesDrawing() {
    return `<g transform="translate(0 -90)">` + rect(334, 230, 284, 50, 'pm-bar', 6) + rect(452, 240, 40, 30, 'pm-card', 4) + dot(472, 200, 10) + dot(472, 310, 10) + path('M472 212V298', 'pm-dash')
      + txt(334, 360, tr('twee sensoren', 'two sensors', 284), 22, 'start', 'pm-mute') + '</g>';
  }
  function spillDrawing() {
    return `<g transform="translate(0 -90)">` + rect(334, 230, 284, 50, 'pm-bar', 6) + rect(452, 240, 40, 30, 'pm-out', 4) + [[462, 250], [478, 246], [470, 260], [484, 262]].map(([x, y]) => dot(x, y, 4)).join('')
      + txt(334, 340, tr('geen doos', 'no carton', 284), 22, 'start', 'pm-mute') + txt(334, 368, tr('product op de band', 'product on the belt', 284), 22, 'start', 'pm-mute') + '</g>';
  }

  // ---- s5: two variants of one product, a changeover gap, the recipe's settings.
  function variantsDrawing() {
    return card2(100, 'Variant A', 'Variant A', 'kleine doos', 'small carton') + card2(176, 'Variant B', 'Variant B', 'grote doos', 'large carton') + txt(334, 276, tr('dezelfde lijn', 'same line', 284), 22, 'start', 'pm-mute');
  }
  function changeDrawing() {
    return rect(334, 130, 96, 44, 'pm-card', 8) + txt(382, 160, 'A', 22, 'middle', 'pm-big') + rect(440, 130, 80, 44, 'pm-out', 8) + rect(530, 130, 88, 44, 'pm-card', 8) + txt(574, 160, 'B', 22, 'middle', 'pm-big')
      + txt(480, 206, tr('omstellen', 'changeover', 140), 22, 'middle', 'pm-txt') + txt(334, 262, tr('de lijn maakt niks', 'the line makes nothing', 284), 22, 'start', 'pm-mute');
  }
  function settingsDrawing() {
    return tile(176, 'Snelheid', 'Speed') + tile(218, 'Posities', 'Positions') + tile(260, 'Checks', 'Checks');
  }

  // ---- s6: sensor, PLC and actuator (eyes, brain, hands), the logic of the line, one rung of a ladder diagram.
  function controlDrawing(b) {
    const hot = b === 1 ? [0, 1] : [];
    const cards = [['Sensor', 'Sensor', 'de ogen', 'the eyes'], ['PLC', 'PLC', 'het brein', 'the brain'], ['Actuator', 'Actuator', 'de handen', 'the hands']];
    return cards.map((c, i) => card2(92 + i * 80, c[0], c[1], c[2], c[3], hot.includes(i) ? 'pm-crit' : 'pm-card')).join('') + arrow(476, 154, 476, 170) + arrow(476, 234, 476, 250);
  }
  function logicDrawing() {
    return card2(100, 'De logica', 'The logic', 'wanneer doet wat', 'when to do what', 'pm-crit');
  }
  function rungDrawing() {
    return path('M346 190V300M606 190V300M346 245H416M444 245H526M554 245H606', 'pm-link') + path('M416 227V263M444 227V263', 'pm-arrow') + dot(540, 245, 14)
      + txt(430, 296, tr('doos', 'carton', 100), 22, 'middle', 'pm-mute') + txt(540, 296, tr('vullen', 'fill', 100), 22, 'middle', 'pm-mute');
  }

  // ---- s7: whether automating pays (four questions), the payback time, and where the story goes on.
  function bizDrawing() {
    return card2(100, 'Automatiseren?', 'Automate?', 'vier vragen', 'four questions', 'pm-crit');
  }
  function fourDrawing() {
    return tile(100, 'Arbeid', 'Labour') + tile(142, 'Volume', 'Volume') + tile(184, 'Variatie', 'Variation') + tile(226, 'Kwaliteit', 'Quality');
  }
  function payDrawing() {
    return txt(334, 196, tr('Investering', 'Investment', 284), 22, 'start', 'pm-mute') + rect(334, 206, 284, 22, 'pm-bar', 5)
      + txt(334, 262, tr('Besparing per jaar', 'Saving per year', 284), 22, 'start', 'pm-mute') + [334, 432, 530].map((x) => rect(x, 272, 88, 22, 'pm-card', 5)).join('');
  }
  function nextDrawing() {
    return card1(100, 'Lijn 3', 'Line 3') + arrow(476, 148, 476, 176) + card1(180, 'De cijfers', 'The numbers', 'pm-crit');
  }

  // ---- s8: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Lines and automation lit, the whole sheet and then zoomed to the lit place at 1.5; then the module's six
  // topics, each with its four levels as columns (the words the app uses for the levels), the start marker on the first
  // level of the first topic.
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
    const out = { r: ['', '', '', '', '', ''], lv1: '', lv2: '', lv3: '', lv4: '', start: '' };
    const lv = ['lv1', 'lv2', 'lv3', 'lv4'];
    LW.forEach((wd, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, wd, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, GRID.h, 'pm-tile', 8);
      const lines = wrap(t, GRID.tile - 12).slice(0, 2);
      const y0 = lines.length === 1 ? y + 31 : y + 21;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.08, i * 0.08 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 8, GB, GRID.h - 16, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 3, GB + 10, GRID.h - 6, 'pm-out', 10);
    return out;
  }

  const HEAD = [[tr('Lijnontwerp', 'Line design', 165)], [tr('Robots', 'Robots', 165)], [tr('Foutvrij maken', 'Error-proofing', 165)], [tr('Varianten', 'Variants', 165)], [tr('Besturing', 'Control', 165)], [tr('Businesscase', 'Business case', 165)]];

  function render(si, u) {
    const { b, p } = beatOf(si, u);
    camera(si, u, b, p);
    room(si, b);
    const o = { r: ['', '', '', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 7;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 2 ? tr('De route', 'The route') : tr('Lijn 3', 'Line 3');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing());
      if (b === 1) o.defS = op(span(p, 0.05, 0.4), defDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, 2, b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b >= 3) o.grpB = routeGroup(2, 3, b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b === 4) o.grpC = routeGroup(5, 1, span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 6) {
      title = HEAD[si - 1][0];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { staS: b === 0 ? op(span(p, 0.05, 0.4), stationsDrawing(p)) : b === 2 ? op(span(p, 0.3, 0.7), beltDrawing()) : '', botS: fade(b, 1, p, bottleDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Transportband', 'Conveyor', 260)) });
      if (si === 2) Object.assign(o, { robS: op(span(p, 0.05, 0.4), armDrawing(b, p)), ...tools(b, p, 2, tr('Teach pendant', 'Teach pendant', 260)) });
      if (si === 3) Object.assign(o, { errS: fade(b, 0, p, errDrawing(), 0.1, 0.5), eyeS: fade(b, 1, p, eyesDrawing(), 0.1, 0.5), spillS: fade(b, 2, p, spillDrawing(), 0.1, 0.5), ...tools(b, p, 3, tr('Poka-yoke', 'Poka-yoke', 260), tr('Interlock', 'Interlock', 260)) });
      if (si === 4) Object.assign(o, { varS: b === 0 ? op(span(p, 0.05, 0.4), variantsDrawing()) : b === 2 ? op(span(p, 0.3, 0.7), settingsDrawing()) : '', chgS: fade(b, 1, p, changeDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Recept', 'Recipe', 260)) });
      if (si === 5) Object.assign(o, { ctlS: b <= 1 ? op(span(p, 0.05, 0.4), controlDrawing(b)) : '', logS: b === 2 ? op(span(p, 0.05, 0.4), logicDrawing()) : b === 3 ? op(span(p, 0.3, 0.7), rungDrawing()) : '', ...tools(b, p, 3, tr('Ladderdiagram', 'Ladder diagram', 260)) });
      if (si === 6) Object.assign(o, { bizS: fade(b, 0, p, bizDrawing(), 0.1, 0.5), fourS: fade(b, 1, p, fourDrawing(), 0.1, 0.5), payS: b === 2 ? op(span(p, 0.3, 0.7), payDrawing()) : '', nextS: fade(b, 3, p, nextDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Terugverdientijd', 'Payback time', 260)) });
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
    for (let i = 0; i < 6; i++) set(E[`r${i}`], o.r[i]);
    for (const k2 of KEYS) set(E[`k_${k2}`], o[k2]);
  }

  return { render };
})();
