// The stage of the field film "Dingen maken / Making things": a pure function of (scene, u). Inlined into the page
// after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, MAPZ, ZBAND, MAPSZ, ROW, HEAD, CW and
// wrapUnits. The story is drawn in hall B at the left: the new filling unit over the start of line 3's belt (a frame
// with welded corners, a plate with four holes, a plastic cover), the tank behind it, the table with the drawing, and
// you, the engineer. The panel at the right draws each station as four small schemas (what it is for, how it works,
// then one for each of its two tools as the voice names it), the two tools as chips, then a dashed card with what
// goes wrong without it.
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows
// or hides the room's moving parts. The closing scene (the shared Engineering map with the six stations lit: the
// whole map, the making zone, then place by place) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than
// the panel (the kit checks that they fit). Station titles come from the page data (the index's module titles):
// the road wraps them with the kit's own wrapUnits (ROW, CW), the panel heading with the panel's width (HEAD).
/* global CAM, W, H, MAPZ, ZBAND, MAPSZ, ROW, HEAD, CW, wrapUnits, span, beatStarts */
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
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  // a straight arrow, in any of the four directions
  const arrow = (x0, y0, x1, y1) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const head = dy === 0 ? `M${f1(x1 - 6 * dx)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6 * dx)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * dy)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * dy)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  const TITLES = D.stations.map((s) => tr(s.title.nl, s.title.en));

  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }
  // the camera: CAM[si] = { from: [ox, oy, s], to: [ox, oy, s] }, the point (ox, oy) of the hall brought to the
  // middle of the hall's half of the stage (160, 200), at scale s
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * lerp(c.from[0], c.to[0], kk))} ${f1(200 - s * lerp(c.from[1], c.to[1], kk))}) scale(${s.toFixed(4)})`);
  }

  // ---- the road. s1 beat 3: one row per station, each a numbered stop on a dashed road with the station's title
  // (wrapped into at most two lines of ROW units). s2 to s7: a strip of numbered squares under the heading.
  const N = TITLES.length;
  const rowY = (i) => 58 + i * 54;
  function roadRows(a4) {
    const rows = TITLES.map((t, i) => {
      const y = rowY(i);
      const lines = wrapUnits(t, ROW, CW);
      const label = lines.map((ln, j) => txt(380, y + (lines.length > 1 ? 16 + j * 26 : 28), ln, 22, 'start', 'pm-big')).join('');
      return op(a4[i], `<circle class="pm-dot" cx="352" cy="${y + 20}" r="16"/>` + txt(352, y + 28, String(i + 1), 22, 'middle', 'pm-on') + label);
    });
    const line = `<path class="pm-road" d="M352 ${rowY(0) + 38}V${rowY(N - 1) + 2}"/>`;
    return { rows, line: op(a4[0], line) };
  }
  // the strip: small numbered squares under the heading, the scene's own station filled
  function strip(cur) {
    return TITLES.map((t, i) => rect(334 + i * 28, 72, 24, 24, i === cur ? 'pm-crit' : 'pm-tile', 5) + txt(334 + i * 28 + 12, 91, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // the dashed card at the foot of each station: what goes wrong without it
  function without(text, a) {
    const cross = '<path class="pm-cross" d="M346 346l16 16M362 346l-16 16"/>';
    return op(a, rect(334, 334, 284, 40, 'pm-out', 6) + cross + txt(374, 362, text, 22, 'start', 'pm-txt'));
  }
  // the two tools of a station as two chips (names only, nothing explained)
  function chip(y, label, a) {
    return op(a, rect(334, y, 284, 38, 'pm-badge', 6) + `<circle class="pm-dot" cx="354" cy="${y + 19}" r="6"/>` + txt(370, y + 28, label, 22, 'start', 'pm-txt'));
  }
  // a row of a schema: a tile with its label
  const row = (y, label, cls = 'pm-tile', tcls = 'pm-txt', h = 30) => rect(334, y, 284, h, cls, 6) + txt(346, y + h - 8, label, 22, 'start', tcls);
  // a short row for a chain with an arrow between the rows (h 28, gap 12: rows at 108, 148 and 188)
  const step = (y, label, cls = 'pm-card', tcls = 'pm-txt', w = 284) => rect(334, y, w, 28, cls, 6) + txt(346, y + 21, label, 22, 'start', tcls);
  const down = (y, x = 476) => arrow(x, y + 28, x, y + 40);
  const hole = (x, y, r = 4) => `<circle class="pm-dot" cx="${x}" cy="${y}" r="${r}"/>`;

  // ---- s1: the opening. Beat 1 what the unit does (the tank's product into the cartons on the belt), beat 2 its four
  // parts, beat 3 the route, beat 4 the road.
  function fills(a) {
    return op(a, step(56, 'Tank') + down(56) + step(96, tr('Vuleenheid', 'Filling unit')) + down(96)
      + step(136, tr('Dozen op de band', 'Cartons on the belt'), 'pm-crit', 'pm-on'));
  }
  function parts(a) {
    return op(a, [['Frame', 'Frame'], ['Plaat', 'Plate'], ['Tank', 'Tank'], ['Kap', 'Cover']]
      .map(([nl, en], i) => row(56 + i * 44, tr(nl, en), 'pm-card', 'pm-txt', 34)).join(''));
  }
  function route(a) {
    return op(a, step(56, tr('Materiaal', 'Material')) + down(56) + step(96, tr('Onderdeel', 'Part')) + down(96)
      + step(136, tr('Eenheid', 'Unit')) + down(136) + step(176, tr('Lijn 3', 'Line 3'), 'pm-crit', 'pm-on'));
  }

  // ---- the four schemas of each station (y 108 to 214): [what it is for, how it works, tool 1, tool 2]
  const FOR = [
    [ // s2 Materials and strength
      // a beam on two supports with a load on it
      () => rect(346, 152, 260, 20, 'pm-card', 4) + '<path class="pm-tile" d="M368 172L356 198H380ZM584 172L572 198H596Z"/>'
        + arrow(476, 112, 476, 148) + txt(492, 134, tr('Belasting', 'Load'), 22, 'start', 'pm-big'),
      // the load is short, the strength is long: the margin between them
      () => txt(334, 130, tr('Belasting', 'Load'), 22, 'start', 'pm-big') + rect(474, 112, 100, 24, 'pm-crit', 5)
        + txt(334, 178, tr('Sterkte', 'Strength'), 22, 'start', 'pm-big') + rect(474, 160, 144, 24, 'pm-card', 5)
        + rect(574, 160, 44, 24, 'pm-out', 5) + txt(576, 208, tr('Marge', 'Margin'), 22, 'middle', 'pm-mute'),
      // tool 1: the tensile test, a bar pulled at both ends
      () => rect(390, 130, 172, 28, 'pm-card', 4) + '<path class="pm-arrow" d="M390 144H346M352 138L346 144L352 150M562 144H606M600 138L606 144L600 150"/>'
        + '<path class="pm-link" d="M346 206V176M346 206H430"/><path class="pm-arrow" d="M346 200C372 196 388 176 412 176S450 184 462 204"/>',
      // tool 2: the hardness test, a point pressed into the surface
      () => rect(374, 156, 204, 48, 'pm-tile', 4) + '<path class="pm-solid" d="M476 110L458 152H494Z"/><path class="pm-crit" d="M476 156L468 164L476 172L484 164Z"/>',
    ],
    [ // s3 Machining
      // a block becomes a plate with holes
      () => rect(334, 124, 96, 62, 'pm-tile', 6) + txt(382, 210, tr('Blok', 'Block'), 22, 'middle', 'pm-mute') + arrow(438, 155, 484, 155)
        + rect(490, 124, 128, 62, 'pm-crit', 6) + hole(512, 142) + hole(596, 142) + hole(512, 168) + hole(596, 168) + txt(554, 210, tr('Plaat', 'Plate'), 22, 'middle', 'pm-mute'),
      // metal away, then the shape, then the holes
      () => step(108, tr('Metaal weg', 'Metal away')) + down(108) + step(148, tr('Vorm', 'Shape')) + down(148) + step(188, tr('Gaten', 'Holes'), 'pm-crit', 'pm-on'),
      // tool 1: the end mill, a shank and a fluted cutter
      () => rect(458, 108, 36, 40, 'pm-solid', 3) + rect(450, 148, 52, 66, 'pm-card', 5)
        + '<path class="pm-link" d="M452 192L500 164M452 176L500 148M452 208L500 180"/>',
      // tool 2: the twist drill, a spiral body and a point
      () => rect(466, 108, 20, 36, 'pm-solid', 3) + rect(458, 144, 36, 54, 'pm-card', 4) + '<path class="pm-card" d="M458 198L476 214L494 198Z"/>'
        + '<path class="pm-link" d="M460 156L492 168M460 172L492 184M460 188L488 196"/>',
    ],
    [ // s4 Process engineering basics
      // a tank with a stream in and a stream out
      () => rect(436, 112, 90, 96, 'pm-card', 8) + txt(481, 166, tr('Product', 'Product'), 22, 'middle', 'pm-txt')
        + arrow(340, 140, 430, 140) + arrow(532, 184, 612, 184),
      // batch: loads one after the other; continuous: a stream that does not stop
      () => rect(334, 112, 284, 40, 'pm-card', 6) + txt(346, 139, tr('Batch', 'Batch'), 22, 'start', 'pm-txt')
        + [0, 1, 2].map((i) => rect(484 + i * 44, 122, 32, 20, 'pm-tile', 4)).join('')
        + rect(334, 164, 284, 40, 'pm-card', 6) + txt(346, 191, tr('Continu', 'Continuous'), 22, 'start', 'pm-txt') + arrow(500, 184, 606, 184),
      // tool 1: the process flow diagram, equipment as boxes with the stream between
      () => ['Tank', tr('Pomp', 'Pump'), tr('Vuller', 'Filler')].map((t, i) => rect(334 + i * 102, 128, 80, 44, i === 2 ? 'pm-crit' : 'pm-card', 6)
        + txt(374 + i * 102, 157, t, 22, 'middle', i === 2 ? 'pm-on' : 'pm-txt')).join('') + arrow(414, 150, 432, 150) + arrow(516, 150, 534, 150),
      // tool 2: the mass balance, a dashed box around a step with the kilos in and out
      () => rect(430, 112, 102, 96, 'pm-out', 8) + rect(446, 128, 70, 64, 'pm-card', 6)
        + arrow(340, 160, 424, 160) + arrow(538, 160, 612, 160)
        + txt(340, 144, tr('kg in', 'kg in', 84), 22, 'start', 'pm-big') + txt(612, 144, tr('kg uit', 'kg out', 80), 22, 'end', 'pm-big'),
    ],
    [ // s5 Drawings and control
      // a sheet with the plate drawn on it: outline, holes, a dimension line and notes
      () => rect(400, 108, 150, 108, 'pm-tile', 5) + rect(416, 122, 70, 44, 'pm-card', 3) + hole(428, 134, 3.5) + hole(474, 134, 3.5) + hole(428, 154, 3.5) + hole(474, 154, 3.5)
        + '<path class="pm-link" d="M416 190H486M416 184V196M486 184V196M502 130H536M502 144H536M502 158H526"/>',
      // what you read: the shape, the sizes and how exact
      () => row(108, tr('Vorm', 'Shape')) + row(148, tr('Maten', 'Sizes')) + row(188, tr('Hoe nauw', 'How exact'), 'pm-crit', 'pm-on'),
      // tool 1: the title block, four boxes
      () => [[tr('Nummer', 'Number'), 0, 0], [tr('Materiaal', 'Material'), 1, 0], [tr('Schaal', 'Scale'), 0, 1], [tr('Revisie', 'Revision'), 1, 1]]
        .map(([t, c, r]) => rect(334 + c * 142, 112 + r * 48, 142, 48, r === 1 && c === 1 ? 'pm-crit' : 'pm-tile', 4) + txt(346 + c * 142, 142 + r * 48, t, 22, 'start', r === 1 && c === 1 ? 'pm-on' : 'pm-txt')).join(''),
      // tool 2: the tolerance frame, a symbol, a value and a datum
      () => rect(334, 136, 60, 52, 'pm-card', 3) + '<circle class="pm-link" cx="364" cy="162" r="13"/><path class="pm-link" d="M364 143V181M345 162H383"/>'
        + rect(394, 136, 140, 52, 'pm-card', 3) + txt(464, 172, '0,1', 22, 'middle', 'pm-big') + rect(534, 136, 60, 52, 'pm-crit', 3) + txt(564, 172, 'A', 22, 'middle', 'pm-on'),
    ],
    [ // s6 Welding and joining
      // two parts and a seam make one frame
      () => rect(334, 118, 124, 52, 'pm-card', 4) + txt(396, 150, tr('Deel A', 'Part A'), 22, 'middle', 'pm-txt') + rect(462, 118, 156, 52, 'pm-card', 4) + txt(540, 150, tr('Deel B', 'Part B'), 22, 'middle', 'pm-txt')
        + '<path class="pm-arrow" d="M460 112V176"/><path class="pm-link" d="M334 184V192H618V184"/>' + txt(476, 220, tr('Eén frame', 'One frame'), 22, 'middle', 'pm-big'),
      // melt, set, one piece
      () => step(108, tr('Smelten', 'Melt')) + down(108) + step(148, tr('Stollen', 'Set')) + down(148) + step(188, tr('Eén stuk', 'One piece'), 'pm-crit', 'pm-on'),
      // tool 1: MIG/MAG, a torch with an arc over the seam
      () => '<path class="pm-solid" d="M420 108L458 108L490 152L462 152Z"/><path class="pm-card" d="M462 152L490 152L484 170L468 170Z"/>'
        + '<path class="pm-arrow" d="M476 172V186"/><path class="pm-link" d="M352 204H600"/><ellipse class="pm-crit" cx="476" cy="198" rx="30" ry="8"/>',
      // tool 2: the welding fixture, a base with two clamps holding the parts
      () => rect(346, 190, 260, 16, 'pm-solid', 3) + rect(358, 146, 40, 44, 'pm-card', 4) + rect(554, 146, 40, 44, 'pm-card', 4) + rect(398, 166, 156, 24, 'pm-crit', 4),
    ],
    [ // s7 Injection moulding
      // pellets go into a mould and a cover comes out
      () => [tr('Korrels', 'Pellets'), tr('Matrijs', 'Mould'), tr('Kap', 'Cover')].map((t, i) => rect(334 + i * 102, 128, 80, 44, i === 2 ? 'pm-crit' : 'pm-card', 6)
        + txt(374 + i * 102, 157, t, 22, 'middle', i === 2 ? 'pm-on' : 'pm-txt')).join('') + arrow(414, 150, 432, 150) + arrow(516, 150, 534, 150),
      // the cycle: inject, cool, eject
      () => step(108, tr('Inspuiten', 'Inject')) + down(108) + step(148, tr('Koelen', 'Cool')) + down(148) + step(188, tr('Uitwerpen', 'Eject'), 'pm-crit', 'pm-on'),
      // tool 1: the hot runner, a heated channel inside the mould that feeds two cavities
      () => rect(334, 110, 284, 100, 'pm-tile', 6) + rect(362, 134, 228, 12, 'pm-crit', 4) + rect(384, 146, 12, 34, 'pm-crit', 3) + rect(528, 146, 12, 34, 'pm-crit', 3)
        + rect(366, 180, 48, 20, 'pm-card', 4) + rect(510, 180, 48, 20, 'pm-card', 4),
      // tool 2: the setting sheet, a list of settings with their values
      () => rect(334, 108, 284, 106, 'pm-tile', 6) + [[tr('Temperatuur', 'Temperature'), 0], [tr('Snelheid', 'Speed'), 1], [tr('Nadruk', 'Holding'), 2]]
        .map(([t, i]) => txt(346, 138 + i * 32, t, 22, 'start', 'pm-txt') + rect(510, 120 + i * 32, 96 - i * 14, 14, 'pm-badge', 4)).join(''),
    ],
  ];
  const TOOLS = [
    [tr('Trekproef', 'Tensile test'), tr('Hardheidsmeting', 'Hardness test')],
    [tr('Vingerfrees', 'End mill'), tr('Spiraalboor', 'Twist drill')],
    [tr('Processchema', 'Process flow diagram'), tr('Massabalans', 'Mass balance')],
    [tr('Stempel', 'Title block'), tr('Tolerantiekader', 'Feature control frame')],
    ['MIG/MAG', tr('Lasmal', 'Welding fixture')],
    [tr('Heetkanaal', 'Hot runner'), tr('Instelkaart', 'Setting sheet')],
  ];
  const WITHOUT = [
    tr('breuk na maanden', 'break after months'),
    tr('gaten verschoven', 'holes shifted'),
    tr('product verdwijnt', 'product goes missing'),
    tr('meten verschilt', 'measuring differs'),
    tr('frame trekt krom', 'frame warps'),
    tr('braam, inzakplek', 'flash, sink marks'),
  ];
  function station(si, b, p) {
    const k = si - 1;
    // beat 1 shows what the station is for, beat 2 how it works; beat 3 names the two tools: the schema of how it works
    // gives way to the schema of the first tool at the start and to the schema of the second halfway, as the voice
    // names the second tool
    const a1 = span(p, 0.05, 0.2);
    const a2 = span(p, 0.5, 0.65);
    const sw = span(p, 0.05, 0.3);
    const w = b === 0 ? [1, 0, 0, 0] : b === 1 ? [1 - sw, sw, 0, 0] : b === 2 ? [0, 1 - a1, a1 - a2, a2] : [0, 0, 0, 1];
    const fade = b === 0 ? span(p, 0.1, 0.45) : 1;
    return {
      forB: op(fade, FOR[k].map((f, i) => op(w[i], f())).join('')),
      t1B: chip(224, TOOLS[k][0], b >= 2 ? (b === 2 ? span(p, 0, 0.3) : 1) : 0),
      t2B: chip(270, TOOLS[k][1], b >= 2 ? (b === 2 ? span(p, 0.2, 0.5) : 1) : 0),
      withoutB: without(WITHOUT[k], b >= 3 ? span(p, 0, 0.4) : 0),
    };
  }

  // ---- s8: the closing scene. ONE function. The shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with the six stations lit: first the whole map, which shows all its zones, then the making zone, then
  // the zoom moves place by place (at 1.5 a lit place's label is 22 units), and at the end back out to the zone.
  // A view is { s, x, y }: the map scaled by s, its origin at (x, y) of the stage. At 1.5 the view is clamped
  // to the map's edges, so the zoom never shows the empty stage beside the map.
  const ZC = (ZBAND[0] + ZBAND[1]) / 2;
  const WHOLE = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
  const ZONEV = { s: 1, x: 0, y: H / 2 - ZC };
  // place by place: at 1.5 the stage shows 427 of the map's 640 units, two of the zone's three columns. A place in
  // the left column is shown with the middle one, the others with the right column, so no lit label is cut by the
  // edge of the stage; both rows of the zone are in view, so the zone's band fills the stage's height
  const zoom = (cx) => ({ s: 1.5, x: cx < MAPSZ[0] / 3 ? 0 : W - MAPSZ[0] * 1.5, y: H / 2 - ZC * 1.5 });
  // after the last place: back to the zone, for how the stations connect and where to start
  const VIEWS = [ZONEV, ...MAPZ.map((m) => zoom(m[0]))];
  const view = (b) => VIEWS[b] || ZONEV;
  function closing(b, p) {
    const from = b === 0 ? WHOLE : view(b - 1);
    const to = view(b);
    const z = b === 0 ? span(p, 0.45, 0.95) : span(p, 0, 0.45);
    const v = { s: lerp(from.s, to.s, z), x: lerp(from.x, to.x, z), y: lerp(from.y, to.y, z) };
    move(E.mapG, `translate(${f1(v.x)} ${f1(v.y)}) scale(${v.s.toFixed(4)})`);
  }

  const PANEL = ['flowB', 'goalB', 'routeB', 'forB', 't1B', 't2B', 'withoutB', 'roadB'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = Object.fromEntries(PANEL.map((k2) => [k2, '']));
    const rd = TITLES.map(() => '');
    let head = '';
    const isMap = si === D.scenes.length - 1;
    show(E.world, isMap ? 0 : 1);
    show(E.mapG, isMap ? 1 : 0);
    show(E.hud, isMap ? 0 : 1);
    show(E['pp-jij'], si === 0 ? 1 : 0); // you stand by the unit in the opening only; later you would hide the tank or the table
    if (si === 0) {
      const t = [tr('De vuleenheid', 'The filling unit'), tr('De delen', 'The parts'), tr('De route', 'The route'), tr('De weg', 'The road')][b];
      head = txt(334, 38, t, 22, 'start', 'pm-big') + txt(618, 38, b <= 1 ? tr('voorbeeld', 'example') : tr('schema', 'diagram'), 22, 'end', 'pm-mute');
      if (b === 0) o.flowB = fills(span(p, 0.05, 0.4));
      else if (b === 1) o.goalB = parts(span(p, 0.05, 0.4));
      else if (b === 2) o.routeB = route(span(p, 0.05, 0.4));
      else {
        const r = roadRows(TITLES.map((tt, i) => span(p, 0.05 + i * 0.12, 0.3 + i * 0.12)));
        r.rows.forEach((x, i) => { rd[i] = x; });
        o.roadB = r.line;
      }
    } else if (!isMap) {
      const lines = wrapUnits(TITLES[si - 1], HEAD, CW);
      head = lines.map((ln, j) => txt(334, 34 + j * 26, ln, 22, 'start', 'pm-big')).join('') + txt(618, 92, tr('voorbeeld', 'example'), 22, 'end', 'pm-mute');
      strip(si - 1).forEach((x, i) => { rd[i] = x; });
      Object.assign(o, station(si, b, p));
    } else closing(b, p);
    set(E.pHead, isMap ? '' : head);
    rd.forEach((x, i) => set(E[`rd${i}`], x));
    for (const k2 of PANEL) set(E[k2], o[k2]);
  }

  return { render };
})();
