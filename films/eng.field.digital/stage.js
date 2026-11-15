// The stage of the field film "Automatisering en IT / Automation and IT": a pure function of (scene, u). Inlined into
// the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, MAPZ, ZBAND, MAPSZ, ROW, HEAD, CW
// and wrapUnits. The story is drawn in hall B at the left: the new filling unit over the start of line 3's belt, the PLC
// cabinet and the network cabinet at the back wall, the cable between them and on to the MES laptop, the line's own zone
// on the floor with a guard on the cable, the photo-eyes across the belt, an edge box and a screen, and you, the engineer.
// The panel at the right draws each station as four small schemas (what it is for, how it works, then one for each of its
// two tools as the voice names it), the two tools as chips, then a dashed card with what goes wrong without it.
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows
// or hides the room's moving parts. The closing scene (the shared Engineering map with the five stations lit: the
// whole map, the digital zone, then place by place) is ONE function, closing; the map itself is the kit's mapScene.
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
  // (wrapped into at most two lines of ROW units). s2 to s6: a strip of numbered squares under the heading.
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

  // ---- s1: the opening. Beat 1 what the unit does (it fills the cartons on the belt with the tank's product), beat 2
  // the MES that sends it orders and gets counts back, beat 3 the route in five steps, beat 4 the road.
  function flow(a) {
    return op(a, step(56, 'Tank') + down(56) + step(96, tr('Vuleenheid', 'Filling unit')) + down(96)
      + step(136, tr('Dozen op de band', 'Cartons on the belt'), 'pm-crit', 'pm-on'));
  }
  function orders(a) {
    return op(a, step(56, 'MES') + arrow(400, 84, 400, 108) + txt(412, 104, tr('orders', 'orders'), 22, 'start', 'pm-mute')
      + arrow(520, 108, 520, 84) + txt(532, 104, tr('telling', 'count'), 22, 'start', 'pm-mute')
      + step(112, tr('Vuleenheid', 'Filling unit'), 'pm-crit', 'pm-on'));
  }
  function route(a) {
    return op(a, [[tr('Netwerk', 'Network'), 'pm-card', 'pm-txt'], [tr('Besturing', 'Control'), 'pm-card', 'pm-txt'], [tr('Beveiliging', 'Security'), 'pm-card', 'pm-txt'],
      [tr('Lijn', 'Line'), 'pm-card', 'pm-txt'], [tr('Data', 'Data'), 'pm-crit', 'pm-on']]
      .map(([t, c, tc], i) => step(56 + i * 40, t, c, tc) + (i < 4 ? down(56 + i * 40) : '')).join(''));
  }

  // ---- the four schemas of each station (y 108 to 214): [what it is for, how it works, tool 1, tool 2]
  const FOR = [
    [ // s2 IT fundamentals
      // an order from the MES to the unit
      () => rect(334, 128, 110, 44, 'pm-card', 6) + txt(389, 157, 'MES', 22, 'middle', 'pm-txt') + rect(508, 128, 110, 44, 'pm-crit', 6) + txt(563, 157, tr('Eenheid', 'Unit', 110), 22, 'middle', 'pm-on')
        + arrow(448, 150, 504, 150) + txt(476, 122, tr('order', 'order'), 22, 'middle', 'pm-mute'),
      // a message goes to an address and reaches the device
      () => step(108, tr('Bericht', 'Message')) + down(108) + step(148, tr('IP-adres', 'IP address')) + down(148) + step(188, tr('Apparaat', 'Device'), 'pm-crit', 'pm-on'),
      // tool 1: the switch, a box of ports with the devices cabled to it
      () => rect(346, 126, 260, 36, 'pm-solid', 4) + [0, 1, 2, 3, 4, 5].map((i) => rect(360 + i * 38, 136, 16, 16, 'pm-tile', 3)).join('')
        + '<path class="pm-link" d="M368 162V190M444 162V190M520 162V190"/>'
        + rect(346, 190, 44, 24, 'pm-card', 4) + rect(422, 190, 44, 24, 'pm-crit', 4) + rect(498, 190, 44, 24, 'pm-card', 4),
      // tool 2: the VLAN, one network cut into an office part and a line part
      () => rect(334, 110, 284, 40, 'pm-card', 6) + txt(346, 138, tr('Kantoor', 'Office'), 22, 'start', 'pm-txt') + [0, 1, 2].map((i) => rect(506 + i * 32, 120, 20, 20, 'pm-tile', 3)).join('')
        + rect(334, 170, 284, 40, 'pm-crit', 6) + txt(346, 198, tr('Lijn', 'Line'), 22, 'start', 'pm-on') + [0, 1, 2].map((i) => rect(506 + i * 32, 180, 20, 20, 'pm-tile', 3)).join('')
        + '<path class="pm-road" d="M334 160H618"/>',
    ],
    [ // s3 IT/OT on the shop floor
      // the MES above, the PLC below, one link
      () => rect(334, 108, 284, 36, 'pm-card', 6) + txt(346, 134, 'MES', 22, 'start', 'pm-txt') + rect(334, 184, 284, 36, 'pm-crit', 6) + txt(346, 210, 'PLC', 22, 'start', 'pm-on')
        + '<path class="pm-link" d="M476 144V184"/>',
      // orders go down, confirmations go up
      () => rect(334, 108, 284, 36, 'pm-card', 6) + txt(346, 134, 'MES', 22, 'start', 'pm-txt') + rect(334, 184, 284, 36, 'pm-crit', 6) + txt(346, 210, 'PLC', 22, 'start', 'pm-on')
        + arrow(346, 147, 346, 181) + txt(358, 170, tr('Orders', 'Orders', 80), 22, 'start', 'pm-big')
        + arrow(440, 181, 440, 147) + txt(452, 170, tr('Terugmelding', 'Confirmation', 160), 22, 'start', 'pm-big'),
      // tool 1: the OPC server inside the PLC, offering its data to the MES
      () => rect(334, 112, 160, 100, 'pm-card', 8) + txt(346, 138, 'PLC', 22, 'start', 'pm-txt') + rect(342, 152, 144, 44, 'pm-crit', 6) + txt(414, 181, tr('OPC-server', 'OPC server', 140), 22, 'middle', 'pm-on')
        + arrow(498, 174, 540, 174) + rect(546, 140, 72, 68, 'pm-tile', 6) + txt(582, 180, 'MES', 22, 'middle', 'pm-txt'),
      // tool 2: tags, each one a named value
      () => [[tr('Status', 'Status'), 100], [tr('Teller', 'Count'), 70], [tr('Niveau', 'Level'), 40]]
        .map(([t, v], i) => rect(334, 112 + i * 34, 284, 28, 'pm-tile', 5) + txt(346, 133 + i * 34, t, 22, 'start', 'pm-txt') + rect(486, 118 + i * 34, v + 20, 16, 'pm-badge', 4)).join(''),
    ],
    [ // s4 Cybersecurity
      // the office on one side, the line on the other, an attack that is stopped
      () => rect(334, 128, 110, 44, 'pm-card', 6) + txt(389, 157, tr('Kantoor', 'Office', 110), 22, 'middle', 'pm-txt') + rect(508, 128, 110, 44, 'pm-crit', 6) + txt(563, 157, tr('Lijn 3', 'Line 3', 110), 22, 'middle', 'pm-on')
        + arrow(448, 150, 488, 150) + '<path class="pm-cross" d="M492 140l12 20M504 140l-12 20"/>' + txt(476, 122, tr('Aanval', 'Attack'), 22, 'middle', 'pm-mute'),
      // the line's own zone with its PLC and unit, one guard on the link to the rest
      () => rect(334, 110, 196, 100, 'pm-out', 10) + txt(346, 138, tr('Lijn 3', 'Line 3', 180), 22, 'start', 'pm-big')
        + rect(346, 152, 56, 44, 'pm-card', 4) + txt(374, 180, 'PLC', 22, 'middle', 'pm-txt') + rect(412, 152, 100, 44, 'pm-card', 4) + txt(462, 180, tr('Eenheid', 'Unit', 100), 22, 'middle', 'pm-txt')
        + rect(520, 152, 20, 44, 'pm-crit', 3) + '<path class="pm-link" d="M540 174H562"/>' + rect(562, 140, 56, 68, 'pm-tile', 6) + txt(590, 180, tr('Rest', 'Rest', 56), 22, 'middle', 'pm-txt'),
      // tool 1: a zone, a dashed group of devices
      () => rect(374, 112, 204, 100, 'pm-out', 10) + [0, 1, 2].map((i) => rect(394 + i * 58, 136, 44, 40, 'pm-card', 4)).join('') + txt(476, 202, tr('Zone', 'Zone'), 22, 'middle', 'pm-big'),
      // tool 2: a conduit, the guarded link between two zones
      () => rect(334, 124, 100, 70, 'pm-out', 8) + rect(354, 144, 60, 30, 'pm-card', 3) + rect(518, 124, 100, 70, 'pm-out', 8) + rect(538, 144, 60, 30, 'pm-card', 3)
        + '<path class="pm-link" d="M434 159H518"/>' + rect(462, 142, 28, 34, 'pm-crit', 4) + txt(476, 214, tr('Conduit', 'Conduit'), 22, 'middle', 'pm-big'),
    ],
    [ // s5 Lines and automation
      // a belt with three cartons, the plate above the middle one
      () => rect(334, 184, 284, 14, 'pm-card', 3) + rect(346, 150, 48, 34, 'pm-tile', 4) + rect(452, 150, 48, 34, 'pm-crit', 4) + rect(558, 150, 48, 34, 'pm-tile', 4)
        + rect(440, 112, 72, 22, 'pm-solid', 4) + arrow(476, 136, 476, 148),
      // a carton there? then fill, then on
      () => step(108, tr('Doos?', 'Carton?')) + down(108) + step(148, tr('Vullen', 'Fill')) + down(148) + step(188, tr('Door', 'Move on'), 'pm-crit', 'pm-on'),
      // tool 1: poka-yoke, an empty spot under the plate: no carton, no filling
      () => rect(334, 186, 284, 14, 'pm-card', 3) + rect(346, 152, 48, 34, 'pm-tile', 4) + rect(452, 152, 48, 34, 'pm-out', 4) + rect(558, 152, 48, 34, 'pm-tile', 4)
        + rect(440, 114, 72, 22, 'pm-solid', 4) + '<path class="pm-cross" d="M462 160l28 18M490 160l-28 18"/>',
      // tool 2: the interlock, a rule between the check and the filling
      () => rect(334, 128, 100, 44, 'pm-card', 6) + txt(384, 157, tr('Sensor', 'Sensor', 100), 22, 'middle', 'pm-txt') + rect(518, 128, 100, 44, 'pm-solid', 6) + txt(568, 157, tr('Vullen', 'Fill', 100), 22, 'middle', 'pm-txt')
        + arrow(438, 150, 458, 150) + rect(462, 136, 28, 28, 'pm-crit', 4) + arrow(494, 150, 514, 150),
    ],
    [ // s6 Data and digital manufacturing
      // what the floor has to see: made, scrap, downtime
      () => [[tr('Gemaakt', 'Made'), 144, 'pm-card'], [tr('Afkeur', 'Scrap'), 44, 'pm-crit'], [tr('Stilstand', 'Downtime'), 26, 'pm-card']]
        .map(([t, v, c], i) => txt(334, 134 + i * 36, t, 22, 'start', 'pm-big') + rect(468, 112 + i * 36, v, 28, c, 5)).join(''),
      // the line's numbers go to the MES and on to a screen
      () => step(108, tr('Lijn 3', 'Line 3')) + down(108) + step(148, 'MES') + down(148) + step(188, tr('Scherm', 'Screen'), 'pm-crit', 'pm-on'),
      // tool 1: the edge gateway between the PLC and the MES
      () => ['PLC', 'Edge', 'MES'].map((t, i) => rect(334 + i * 102, 128, 80, 44, i === 1 ? 'pm-crit' : 'pm-card', 6)
        + txt(374 + i * 102, 157, t, 22, 'middle', i === 1 ? 'pm-on' : 'pm-txt')).join('') + arrow(414, 150, 432, 150) + arrow(516, 150, 534, 150),
      // tool 2: the dashboard, bars against a target line
      () => rect(334, 108, 284, 104, 'pm-tile', 6) + '<path class="pm-road" d="M346 152H606"/>'
        + [30, 52, 40, 64].map((h, i) => rect(364 + i * 60, 198 - h, 36, h, i === 3 ? 'pm-crit' : 'pm-card', 4)).join(''),
    ],
  ];
  const TOOLS = [
    [tr('Switch', 'Switch'), 'VLAN'],
    [tr('OPC-server', 'OPC server'), 'Tag'],
    ['Zone', 'Conduit'],
    ['Poka-yoke', 'Interlock'],
    [tr('Edge gateway', 'Edge gateway'), 'Dashboard'],
  ];
  const WITHOUT = [
    tr('order komt niet aan', 'order never arrives'),
    tr('MES ziet niets', 'MES sees nothing'),
    tr('lijn staat stil', 'line stands still'),
    tr('product op de band', 'product on the belt'),
    tr('cijfers laat of fout', 'late or wrong data'),
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

  // ---- s7: the closing scene. ONE function. The shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with the five stations lit: first the whole map, which shows the four zones, then the digital zone, then
  // the zoom moves place by place (at 1.5 a lit place's label is 22 units), and at the end back out to the zone.
  // A view is { s, x, y }: the map scaled by s, its origin at (x, y) of the stage. At 1.5 the view is clamped
  // to the map's edges, so the zoom never shows the empty stage beside the map.
  const ZC = (ZBAND[0] + ZBAND[1]) / 2;
  const WHOLE = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
  const ZONEV = { s: 1, x: 0, y: H / 2 - ZC };
  // place by place: at 1.5 the stage shows 427 of the map's 640 units. A place whose centre lies in the left 270
  // units is shown at the left edge, the others at the right edge, so no lit label is cut by the edge of the stage
  // (the zone's bottom row is two places at 116 to 316 and 324 to 524: the first with the left view, the second with
  // the right one); both rows of the zone are in view, so the zone's band fills the stage's height
  const zoom = (cx) => ({ s: 1.5, x: cx < 270 ? 0 : W - MAPSZ[0] * 1.5, y: H / 2 - ZC * 1.5 });
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

  const PANEL = ['flowB', 'ordersB', 'routeB', 'forB', 't1B', 't2B', 'withoutB', 'roadB'];
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
    // you come in at the third beat of the opening, where the route starts; before that you would hide the belt the
    // first beats light, and later the tank or the table
    show(E['pp-jij'], si === 0 && b >= 2 ? 1 : 0);
    // each thing of the room shows from the scene of its station: the network cabinet, its cable and the control
    // cabinet from the second, the zone and its guard from the fourth, the photo-eyes from the fifth, the edge box and
    // the screen from the sixth
    show(E['o-net'], si >= 1 ? 1 : 0);
    show(E['o-zone'], si >= 3 ? 1 : 0);
    show(E['o-gate'], si >= 3 ? 1 : 0);
    show(E['o-eye'], si >= 4 ? 1 : 0);
    show(E['o-data'], si >= 5 ? 1 : 0);
    if (si === 0) {
      const t = [tr('De eenheid', 'The unit'), tr('De orders', 'The orders'), tr('De route', 'The route'), tr('De weg', 'The road')][b];
      head = txt(334, 38, t, 22, 'start', 'pm-big') + txt(618, 38, b <= 1 ? tr('voorbeeld', 'example') : tr('schema', 'diagram'), 22, 'end', 'pm-mute');
      if (b === 0) o.flowB = flow(span(p, 0.05, 0.4));
      else if (b === 1) o.ordersB = orders(span(p, 0.05, 0.4));
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
