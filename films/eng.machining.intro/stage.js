// The stage of the module intro film "De plaat in de werkplaats / The plate in the workshop": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a preamble from build.mjs that
// defines CAM, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths
// and its wrap, so the drawing wraps as the kit's label check measures). The story is drawn in the
// plant's workshop at the left: a milling machine with a vise and the plate (a block, then the milled
// plate, then four holes), a wall of tools, a control with a screen, a lathe with a bar, a pallet with a
// block of steel, and a table with the drawing, the measured plate and a micrometer; two operators and
// you, the engineer, come and go. The panel at the right draws each beat as a schema, labelled
// "voorbeeld" (the plate's job) or "schema" (the module's map). Every part a sentence lights is a static
// data-cue group (build.mjs); this script only fills the panel and shows or hides the room's moving parts.
// The closing scene (the shared Engineering map, then the module's six topics with their levels) is ONE
// function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower
// than the panel (the kit checks that they fit).
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
  const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const head = dy === 0 ? `M${f1(x1 - 6 * dx)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6 * dx)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * dy)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * dy)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const IDS = ['turning', 'milling', 'drilling', 'cnc', 'tooling', 'workholding'];
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
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- the room: who stands there and what has happened to the plate, per scene (si) and beat (b).
  // s1 the block lies on its pallet; s3 it sits in the vise (b0), is milled into the plate (b1), s4 gets its four holes,
  // s7 is measured on the table (from b1) with the drawing beside it, and you take it to hall B (b3)
  function room(si, b, p) {
    show(E['pp-opL'], si === 1 && b >= 1 ? (b === 1 ? span(p, 0, 0.35) : 1) : 0);
    show(E['pp-opM'], si >= 2 && si <= 6 ? (si === 2 && b === 0 ? span(p, 0, 0.35) : 1) : 0);
    show(E['pp-jij'], si === 0 || (si === 6 && b >= 1) ? 1 : 0);
    show(E.stockK, si <= 1 ? 1 : 0);
    show(E.blankK, si === 2 && b === 0 ? 1 : 0);
    const inVise = (si === 2 && b >= 1) || (si >= 3 && si <= 5) || (si === 6 && b < 1);
    show(E.plateK, inVise ? (si === 2 && b === 1 ? span(p, 0, 0.35) : 1) : 0);
    show(E.holesK, inVise && (si >= 4 || (si === 3 && b >= 1)) ? (si === 3 && b === 1 ? span(p, 0.2, 0.7) : 1) : 0);
    show(E.datumK, si === 4 && b >= 2 ? 1 : 0);
    show(E.spEnd, si === 2 ? 1 : 0);
    show(E.spDrill, (si === 3 && b !== 2) || (si >= 4 && si <= 6) ? 1 : 0);
    show(E.spCentre, si === 3 && b === 2 ? 1 : 0);
    show(E.plateTK, si === 6 && b >= 1 ? (b === 1 ? span(p, 0, 0.35) : 1) : 0);
  }

  // ---- the six topic tiles
  // the route (s1, the last two beats): the module's six topics in two groups, the map before the detail. The three ways
  // of cutting (topics 1 to 3) and the three things every cut needs (topics 4 to 6), each row with its number and its
  // index title, wrapped by the kit's widths into 240 units left of the number; a title of two lines (Workholding and
  // measuring) gets a taller row. The second group ends at most at y 376 (three rows, one of them of two lines)
  function routeGroup(first, head, a) {
    let y = first === 0 ? 74 : 232;
    let s = txt(334, y, head, 22, 'start', 'pm-mute');
    y += 8;
    for (let i = first; i < first + 3; i++) {
      const lines = wrap(TITLE[i], 240).slice(0, 2);
      const h = lines.length === 1 ? 34 : 56;
      s += rect(334, y, 284, h, 'pm-tile', 6) + txt(610, y + 25, String(i + 1), 22, 'end', 'pm-on');
      lines.forEach((l, j) => { s += txt(346, y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
      y += h + 6;
    }
    return op(a, s);
  }
  // the topic strip (s2 to s7): six small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3, 4, 5].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // two tool names as chips high in the panel under the strip (one short sentence names them; they are not
  // explained). Shown in the beat of the sentence (b === at); a topic with one tool leaves the second out
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');

  // ---- s1: the plate
  function plateFlow() {
    return rect(334, 66, 284, 64, 'pm-card', 8) + txt(346, 94, tr('Blok staal', 'Block of steel', 260), 22, 'start', 'pm-big') + txt(346, 120, tr('in de werkplaats', 'in the workshop', 260), 22, 'start', 'pm-mute')
      + arrow(476, 136, 476, 168)
      + rect(334, 172, 284, 64, 'pm-crit', 8) + txt(346, 200, tr('Plaat', 'Plate', 260), 22, 'start', 'pm-on') + txt(346, 226, tr('voor de vuleenheid', 'for the filling unit', 260), 22, 'start', 'pm-on')
      + txt(334, 290, tr('voor lijn 3 in hal B', 'for line 3 in hall B', 284), 22, 'start', 'pm-mute');
  }
  // the plate with its four holes (two by two, as the drawing and the plate in hall B) and a carton under each place of
  // the belt: the product runs through the holes into the cartons
  function holesDrawing(label, dy = 0) {
    let s = rect(376, 64 + dy, 200, 84, 'pm-card', 8);
    [[426, 90], [526, 90], [426, 124], [526, 124]].forEach(([x, y]) => { s += circ(x, y + dy, 11, 'pm-hole'); });
    [0, 1, 2, 3].forEach((i) => {
      const x = 392 + i * 64;
      s += arrow(x, 154 + dy, x, 186 + dy) + rect(x - 24, 192 + dy, 48, 42, 'pm-tile', 4);
    });
    return s + txt(334, 274 + dy, label, 22, 'start', 'pm-big');
  }
  function cutDrawing() {
    return rect(334, 70, 110, 90, 'pm-bar', 6) + txt(389, 190, tr('blok', 'block', 110), 22, 'middle', 'pm-mute')
      + arrow(452, 115, 492, 115) + rect(500, 86, 118, 58, 'pm-crit', 6) + txt(559, 190, tr('plaat', 'plate', 118), 22, 'middle', 'pm-mute')
      + rect(446, 150, 12, 7, 'pm-chip', 2) + rect(466, 164, 12, 7, 'pm-chip', 2) + rect(486, 150, 12, 7, 'pm-chip', 2)
      + txt(334, 250, tr('materiaal weg', 'material removed', 284), 22, 'start', 'pm-big') + txt(334, 280, tr('tot de vorm klopt', 'until the shape fits', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: turning. The pipe of the tank meets the back of the plate with a round connector; the workpiece turns and a
  // still tool moves along it.
  function turnParts(b, p) {
    const row = (y, label, cls) => rect(334, y, 284, 40, cls, 6) + txt(346, y + 28, label, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');
    const chain = row(100, tr('Tank en pijp', 'Tank and pipe', 260), 'pm-card') + arrow(476, 144, 476, 156) + row(160, tr('Rond aansluitstuk', 'Round connector', 260), 'pm-crit')
      + arrow(476, 204, 476, 216) + row(220, tr('Plaat', 'Plate', 260), 'pm-card');
    const spin = circ(420, 190, 56, 'pm-card') + circ(420, 190, 6, 'pm-chip')
      + path('M420 116A74 74 0 0 0 346 190', 'pm-arrow') + path('M340 182L346 192L353 182', 'pm-arrow')
      + rect(476, 176, 56, 28, 'pm-crit', 4)
      + txt(334, 288, tr('werkstuk draait', 'workpiece turns', 284), 22, 'start', 'pm-txt') + txt(334, 318, tr('beitel staat stil', 'tool stands still', 284), 22, 'start', 'pm-txt');
    return { chain: fade(b, 0, p, chain, 0.1, 0.5), turnS: fade(b, 1, p, spin), ...tools(b, p, 2, tr('Wisselplaat', 'Carbide insert', 260)) };
  }

  // ---- s3: milling. The tool turns, the workpiece is held; first the top is made flat, then the outline.
  function millParts(b, p) {
    const mill = circ(460, 176, 30, 'pm-crit') + circ(460, 176, 5, 'pm-chip') + path('M424 148A50 50 0 0 1 496 146', 'pm-arrow') + path('M490 138L497 147L487 151', 'pm-arrow')
      + rect(360, 232, 200, 50, 'pm-card', 6) + rect(344, 224, 12, 66, 'pm-lvl', 3) + rect(564, 224, 12, 66, 'pm-lvl', 3)
      + txt(334, 114, tr('gereedschap draait', 'tool turns', 284), 22, 'start', 'pm-txt') + txt(334, 326, tr('werkstuk ligt vast', 'workpiece is held', 284), 22, 'start', 'pm-txt');
    const plan = rect(334, 100, 136, 120, 'pm-card', 8) + [128, 160, 192].map((y) => arrow(346, y, 458, y)).join('')
      + rect(482, 100, 136, 120, 'pm-card', 8) + path('M498 116H602V204H498Z', 'pm-dash')
      + txt(402, 254, tr('vlak', 'flat', 130), 22, 'middle', 'pm-txt') + txt(550, 254, tr('omtrek', 'outline', 130), 22, 'middle', 'pm-txt');
    return { millS: fade(b, 0, p, mill, 0.05, 0.45), plan: fade(b, 1, p, plan), ...tools(b, p, 2, tr('Vlakfrees', 'Face mill', 260), tr('Vingerfrees', 'End mill', 260)) };
  }

  // ---- s4: drilling. Four holes, each in its place above a carton.
  function drillParts(b, p) {
    const drill = rect(350, 250, 220, 26, 'pm-bar', 4) + rect(380, 250, 18, 26, 'pm-hole', 2) + rect(450, 130, 22, 120, 'pm-crit', 3) + path('M450 250L461 268L472 250Z', 'pm-crit')
      + path('M434 122A32 12 0 0 1 488 122', 'pm-arrow') + path('M482 114L489 122L480 127', 'pm-arrow')
      + txt(334, 318, tr('de boor draait', 'the drill turns', 284), 22, 'start', 'pm-txt');
    return { drillS: fade(b, 0, p, drill, 0.05, 0.45), holesP: fade(b, 1, p, holesDrawing(tr('elk gat boven een doos', 'each hole over a carton', 284), 40)),
      ...tools(b, p, 2, tr('Centreerboor', 'Centre drill', 260), tr('Spiraalboor', 'Twist drill', 260)) };
  }

  // ---- s5: CNC. A computer drives the machine from a program; every line is one move; the machine has to know where the
  // plate lies.
  function cncParts(b, p) {
    const lens = [120, 170, 90, 150, 110, 60];
    const code = rect(334, 96, 284, 150, 'pm-card', 8) + lens.map((l, i) => rect(350, 114 + i * 22, l, 8, 'pm-bar', 3)).join('')
      + arrow(476, 252, 476, 280) + rect(334, 286, 284, 40, 'pm-crit', 6) + txt(346, 314, tr('de machine volgt', 'the machine follows', 260), 22, 'start', 'pm-on');
    const route = rect(360, 100, 200, 130, 'pm-card', 8) + arrow(380, 120, 540, 120) + arrow(540, 120, 540, 210) + arrow(540, 210, 380, 210) + arrow(380, 210, 380, 120)
      + txt(334, 272, tr('regel voor regel', 'line by line', 284), 22, 'start', 'pm-big');
    const datum = rect(360, 120, 200, 110, 'pm-card', 8) + path('M344 120H378M360 104V138', 'pm-arrow') + circ(360, 120, 5, 'pm-chip') + path('M390 172H540', 'pm-dash')
      + txt(334, 272, tr('waar ligt de plaat?', 'where is the plate?', 284), 22, 'start', 'pm-big');
    return { codeS: fade(b, 0, p, code, 0.05, 0.45), pathS: fade(b, 1, p, route), datumP: fade(b, 2, p, datum),
      ...tools(b, p, 3, tr('G-code', 'G-code', 260), tr('Werkstuknulpunt', 'Work offset', 260)) };
  }

  // ---- s6: tooling. The edge peels a chip; it gets hot, has to stay hard and has to suit the material (here steel).
  function toolParts(b, p) {
    const wedge = path('M452 232L538 232L538 146L494 146Z', 'pm-crit');
    const edge = rect(344, 232, 230, 46, 'pm-bar', 6) + wedge + path('M446 232C436 214 448 194 464 198C476 202 474 218 460 216', 'pm-arrow')
      + txt(334, 322, tr('snijkant en spaan', 'edge and chip', 284), 22, 'start', 'pm-big');
    const heat = rect(344, 232, 230, 46, 'pm-bar', 6) + wedge
      + ['M470 138q-8-10 0-20t0-20', 'M494 138q-8-10 0-20t0-20', 'M518 138q-8-10 0-20t0-20'].map((d) => path(d, 'pm-heat')).join('')
      + txt(334, 310, tr('heet en toch hard', 'hot and still hard', 284), 22, 'start', 'pm-big') + txt(334, 340, tr('past bij staal', 'suits steel', 284), 22, 'start', 'pm-mute');
    return { edgeS: fade(b, 0, p, edge, 0.05, 0.45), heatS: fade(b, 1, p, heat), ...tools(b, p, 2, tr('Gereedschapshouder', 'Tool holder', 260), tr('Zustergereedschap', 'Sister tool', 260)) };
  }

  // ---- s7: workholding and measuring. The plate is held in the same place every time; then it is measured against the
  // drawing; then it goes to hall B.
  function holdParts(b, p) {
    const hold = rect(384, 150, 150, 90, 'pm-card', 8) + path('M372 138H550V252H372Z', 'pm-dash') + rect(350, 130, 28, 130, 'pm-lvl', 4) + rect(540, 130, 28, 130, 'pm-lvl', 4)
      + arrow(332, 195, 346, 195) + arrow(590, 195, 574, 195)
      + txt(334, 296, tr('steeds dezelfde plek', 'always the same place', 284), 22, 'start', 'pm-big');
    const plateOutline = (x) => rect(x, 110, 126, 92, 'pm-card', 8) + [[28, 26], [98, 26], [28, 66], [98, 66]].map(([a, c]) => circ(x + a, 110 + c, 7, 'pm-hole')).join('');
    const meas = plateOutline(334) + plateOutline(492) + rect(466, 144, 20, 5, 'pm-bar', 2) + rect(466, 158, 20, 5, 'pm-bar', 2)
      + txt(397, 232, tr('tekening', 'drawing', 126), 22, 'middle', 'pm-txt') + txt(555, 232, tr('plaat', 'plate', 126), 22, 'middle', 'pm-txt')
      + txt(334, 286, tr('klopt dat?', 'do they match?', 284), 22, 'start', 'pm-big');
    // under the topic strip (which ends at y 84)
    const ship = rect(334, 104, 284, 50, 'pm-card', 8) + txt(346, 136, tr('Gemeten en goed', 'Measured and good', 260), 22, 'start', 'pm-big')
      + arrow(476, 160, 476, 190) + rect(334, 194, 284, 66, 'pm-crit', 8) + txt(346, 222, tr('Hal B, lijn 3', 'Hall B, line 3', 260), 22, 'start', 'pm-on') + txt(346, 248, tr('de vuleenheid', 'the filling unit', 260), 22, 'start', 'pm-on');
    return { holdS: fade(b, 0, p, hold), measP: fade(b, 1, p, meas), ...tools(b, p, 2, tr('Mal', 'Fixture', 260), tr('Micrometer', 'Micrometer', 260)), ship: fade(b, 3, p, ship) };
  }

  // ---- s8: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Machining lit, the whole sheet and then zoomed to the lit place at 1.5; then the module's six topics, each
  // with its four levels as columns (the words the app uses for the levels), the start marker on the first level of the first topic.
  const MAP0 = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
  const MAP1 = { s: 1.5, x: 320 - MAPZ[0] * 1.5, y: 200 - MAPZ[1] * 1.5 };
  function mapPlace(b, p) {
    const z = b === 0 ? span(p, 0.35, 1) : 1;
    const s = lerp(MAP0.s, MAP1.s, z);
    move(E.mapG, `translate(${f1(lerp(MAP0.x, MAP1.x, z))} ${f1(lerp(MAP0.y, MAP1.y, z))}) scale(${s.toFixed(4)})`);
    // the map fades out once, in the second beat, and stays hidden after it (it must not come back at the start of
    // every later beat, behind the grid)
    return b === 0 ? 1 : b === 1 ? 1 - span(p, 0, 0.45) : 0;
  }
  // the columns (GRID from build.mjs, which checks the level words fit): a tile column of GRID.tile units, four
  // level columns of GRID.col from GRID.x with boxes of GRID.box. The level words stand on one line each,
  // staggered over two rows (the first and third high, the second and fourth low), so neighbours never meet.
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
      const y0 = lines.length === 1 ? y + 32 : y + 21;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.1, i * 0.1 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 9, GB, GRID.h - 18, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 4, GB + 10, GRID.h - 8, 'pm-out', 10);
    return out;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    room(si, b, p);
    const o = { r: ['', '', '', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 7;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 3 ? tr('De route', 'The route') : tr('De plaat', 'The plate');
      if (b === 0) o.flow = op(span(p, 0.05, 0.4), plateFlow());
      if (b === 1) o.plate = op(span(p, 0.05, 0.4), holesDrawing(tr('product door de gaten', 'product through the holes', 284)));
      if (b === 2) o.cut = op(span(p, 0.05, 0.4), cutDrawing());
      if (b >= 3) {
        lab = tr('schema', 'diagram');
        o.cutters = routeGroup(0, tr('Manieren van snijden', 'Ways of cutting', 284), b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b === 4) o.support = routeGroup(3, tr('Bij elke snede', 'At every cut', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 6) {
      title = [tr('Draaien', 'Turning', 150), tr('Frezen', 'Milling', 150), tr('Boren', 'Drilling', 150), tr('CNC', 'CNC', 150), tr('Gereedschap', 'Tooling', 150), tr('Opspanning', 'Workholding', 150)][si - 1];
      o.r = strip(si - 1);
      Object.assign(o, [turnParts, millParts, drillParts, cncParts, toolParts, holdParts][si - 1](b, p));
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
