// The stage of the field film "De fabriek draaiend houden / Keeping the plant running": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, MAPZ, ZBAND, MAPSZ,
// ROW, HEAD, CW and wrapUnits. The story is drawn in hall B at the left: the filling unit over the start of line 3's
// belt, the tank, a stop log on the back wall, a table with a check sheet at the end of the belt and the marked
// quarantine place in front of it, the CILT standard on its board, a tag on the unit, a laptop on a table, the isolator in
// its cabinet, and you and the team lead. The panel at the right draws each station as four small schemas (what it is
// for, how it works, then one for each of its two tools as the voice names it), the two tools as chips, then a dashed
// card with what goes wrong without it. Every part a sentence lights is a static data-cue group (build.mjs); this script
// only fills the panel and shows or hides the room's moving parts. The closing scene (the shared Engineering map with the
// four stations lit: the whole map, the zone, then place by place) is ONE function, closing; the map itself is the kit's
// mapScene. Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than
// the panel (the kit checks that they fit). Station names come from the page data (the label of the film, else the
// index's module title): the road wraps them with the kit's own wrapUnits (ROW, CW), the panel heading with the panel's
// width (HEAD).
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
  const TITLES = D.stations.map((s) => { const n = s.label || s.title; return tr(n.nl, n.en); });

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
  // the shift you and the team lead keep it going for, beat 3 what the shift needs in four steps, beat 4 the road.
  function flow(a) {
    return op(a, step(56, 'Tank') + down(56) + step(96, tr('Vuleenheid', 'Filling unit')) + down(96)
      + step(136, tr('Dozen op de band', 'Cartons on the belt'), 'pm-crit', 'pm-on'));
  }
  // the shift: a bar for the whole shift with the unit running along it
  function shift(a) {
    return op(a, rect(334, 56, 284, 40, 'pm-card', 6) + txt(346, 84, tr('Een dienst', 'One shift'), 22, 'start', 'pm-txt')
      + '<path class="pm-road" d="M346 128H606"/>' + [0, 1, 2, 3, 4].map((i) => `<circle class="pm-dot" cx="${346 + i * 65}" cy="128" r="7"/>`).join('')
      + arrow(346, 168, 604, 168) + txt(346, 204, tr('Vuleenheid draait', 'Unit running', 260), 22, 'start', 'pm-big'));
  }
  function route(a) {
    return op(a, [[tr('Tempo', 'Pace'), 'pm-card', 'pm-txt'], [tr('Goede dozen', 'Good cartons'), 'pm-card', 'pm-txt'], [tr('Eenheid heel', 'Unit whole'), 'pm-card', 'pm-txt'],
      [tr('Veilig werk', 'Safe work'), 'pm-crit', 'pm-on']]
      .map(([t, c, tc], i) => step(56 + i * 40, t, c, tc) + (i < 3 ? down(56 + i * 40) : '')).join(''));
  }

  // ---- the four schemas of each station (y 108 to 214): [what it is for, how it works, tool 1, tool 2]
  const FOR = [
    [ // s2 Capacity and flow
      // what the customer asks against what the line makes
      () => [[tr('Vraag', 'Demand', 108), 150, 'pm-card'], [tr('Lijn 3', 'Line 3', 108), 100, 'pm-crit']]
        .map(([t, v, c], i) => txt(346, 142 + i * 50, t, 22, 'start', 'pm-big') + rect(462, 118 + i * 50, v, 34, c, 5)).join(''),
      // the customer sets the pace, the line follows
      () => step(108, tr('Vraag', 'Demand')) + down(108) + step(148, tr('Tempo', 'Pace')) + down(148) + step(188, tr('Lijn 3', 'Line 3'), 'pm-crit', 'pm-on'),
      // tool 1: takt time, one carton on every beat of an even tick
      () => '<path class="pm-road" d="M334 192H618"/>' + [0, 1, 2, 3].map((i) => `<path class="pm-link" d="M${364 + i * 70} 118V150"/>` + rect(342 + i * 70, 156, 44, 32, i === 3 ? 'pm-crit' : 'pm-card', 4)).join(''),
      // tool 2: the downtime log, a row per stop with its time, length and cause
      () => [0, 1, 2].map((i) => rect(334, 112 + i * 34, 284, 28, 'pm-tile', 5) + rect(344, 120 + i * 34, 52, 12, 'pm-badge', 3) + rect(412, 120 + i * 34, 28 + i * 18, 12, 'pm-badge', 3) + rect(520, 120 + i * 34, 82, 12, i === 0 ? 'pm-crit' : 'pm-badge', 3)).join(''),
    ],
    [ // s3 Quality
      // cartons on the belt towards the customer
      () => rect(334, 184, 150, 14, 'pm-card', 3) + rect(344, 150, 40, 34, 'pm-tile', 4) + rect(394, 150, 40, 34, 'pm-tile', 4) + rect(444, 150, 40, 34, 'pm-crit', 4)
        + arrow(492, 168, 540, 168) + rect(548, 128, 70, 80, 'pm-card', 6) + txt(583, 174, tr('Klant', 'Client', 70), 22, 'middle', 'pm-txt'),
      // a good carton goes on, a faulty one goes into quarantine
      () => rect(334, 112, 76, 40, 'pm-card', 6) + txt(372, 140, tr('Goed', 'Good', 76), 22, 'middle', 'pm-txt') + arrow(416, 132, 438, 132) + rect(442, 112, 176, 40, 'pm-card', 6) + txt(454, 140, tr('Naar de klant', 'To the client', 156), 22, 'start', 'pm-txt')
        + rect(334, 168, 76, 40, 'pm-out', 6) + txt(372, 196, tr('Fout', 'Fault', 76), 22, 'middle', 'pm-txt') + arrow(416, 188, 438, 188) + rect(442, 168, 176, 40, 'pm-crit', 6) + txt(454, 196, tr('Quarantaine', 'Quarantine', 156), 22, 'start', 'pm-on'),
      // tool 1: the check sheet, a row per kind of fault with tally strokes
      () => [[tr('Kras', 'Scratch', 120), 3], [tr('Deuk', 'Dent', 120), 5], [tr('Vlek', 'Stain', 120), 2]]
        .map(([t, n], i) => rect(334, 112 + i * 34, 284, 28, 'pm-tile', 5) + txt(346, 133 + i * 34, t, 22, 'start', 'pm-txt')
          + [...Array(n).keys()].map((j) => `<path class="pm-link" d="M${470 + j * 16} ${118 + i * 34}V${134 + i * 34}"/>`).join('')).join(''),
      // tool 2: the nonconformance report, what, how many, the decision
      () => [[tr('Wat', 'What', 110), 130], [tr('Hoeveel', 'How many', 120), 60], [tr('Besluit', 'Decision', 110), 100]]
        .map(([t, v], i) => rect(334, 112 + i * 34, 284, 28, 'pm-card', 5) + txt(346, 133 + i * 34, t, 22, 'start', 'pm-txt') + rect(470, 120 + i * 34, v, 12, i === 2 ? 'pm-crit' : 'pm-badge', 3)).join(''),
    ],
    [ // s4 Maintenance
      // wear: a line that slowly goes down
      () => '<path class="pm-road" d="M346 132L420 138L500 160L596 202"/><circle class="pm-dot" cx="596" cy="202" r="9"/>' + txt(346, 196, tr('Slijtage', 'Wear', 200), 22, 'start', 'pm-big'),
      // the round: look, find a deviation, tag it
      () => step(108, tr('Ronde', 'Round')) + down(108) + step(148, tr('Afwijking?', 'Off?')) + down(148) + step(188, tr('Label', 'Tag'), 'pm-crit', 'pm-on'),
      // tool 1: the CILT standard, four checks: clean, inspect, lubricate, tighten
      () => [[tr('Schoon', 'Clean', 124), 0, 0], [tr('Kijk', 'Inspect', 124), 1, 0], [tr('Smeer', 'Lubricate', 124), 0, 1], [tr('Draai aan', 'Tighten', 124), 1, 1]]
        .map(([t, cx, cy]) => rect(334 + cx * 146, 112 + cy * 52, 138, 44, 'pm-card', 6) + txt(346 + cx * 146, 141 + cy * 52, t, 22, 'start', 'pm-txt')).join(''),
      // tool 2: the CMMS, a report becomes a work order and is closed
      () => [[tr('Melding', 'Report'), 'pm-card', 'pm-txt'], [tr('Werkorder', 'Work order'), 'pm-card', 'pm-txt'], [tr('Klaar', 'Done'), 'pm-crit', 'pm-on']]
        .map(([t, c, tc], i) => step(108 + i * 40, t, c, tc) + (i < 2 ? down(108 + i * 40) : '')).join(''),
    ],
    [ // s5 Safety
      // the unit jams and the energy is still there: you at one side, the unit at the other
      () => rect(334, 140, 110, 44, 'pm-card', 6) + txt(389, 169, tr('Jij', 'You', 110), 22, 'middle', 'pm-txt') + rect(508, 140, 110, 44, 'pm-crit', 6) + txt(563, 169, tr('Eenheid', 'Unit', 110), 22, 'middle', 'pm-on')
        + arrow(504, 162, 448, 162) + txt(476, 134, tr('Energie', 'Energy', 150), 22, 'middle', 'pm-mute'),
      // look round, energy off, a lock and a tag on it
      () => step(108, tr('Rondkijken', 'Look round')) + down(108) + step(148, tr('Energie eraf', 'Energy off')) + down(148) + step(188, tr('Slot en label', 'Lock and tag'), 'pm-crit', 'pm-on'),
      // tool 1: the LMRA, three questions before you start
      () => [tr('Wat kan misgaan?', 'What can go wrong?', 270), tr('Maatregelen genomen?', 'Measures taken?', 270), tr('Twijfel? Dan stop je', 'Doubt? Then stop', 270)]
        .map((t, i) => row(112 + i * 34, t, 'pm-card')).join(''),
      // tool 2: lockout-tagout, a switch off and a lock on it
      () => rect(334, 118, 170, 60, 'pm-card', 8) + txt(346, 154, tr('Schakelaar', 'Switch', 150), 22, 'start', 'pm-txt')
        + '<path class="pm-link" d="M556 140V124Q556 108 576 108Q596 108 596 124V140"/>' + rect(540, 138, 72, 48, 'pm-crit', 8)
        + txt(476, 210, tr('Slot en label', 'Lock and tag', 280), 22, 'middle', 'pm-big'),
    ],
  ];
  const TOOLS = [
    [tr('Takttijd', 'Takt time', 248), tr('Stilstandregistratie', 'Downtime log', 248)],
    [tr('Turflijst', 'Check sheet', 248), tr('Afwijkingsrapport', 'NCR', 248)],
    [tr('CILT-standaard', 'CILT standard', 248), 'CMMS'],
    ['LMRA', 'LOTO'],
  ];
  const WITHOUT = [
    tr('minuten raken zoek', 'minutes get lost'),
    tr('foute doos naar klant', 'bad carton to client'),
    tr('slijtage onopgemerkt', 'wear goes unseen'),
    tr('start onverwacht', 'starts unexpectedly'),
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

  // ---- s6: the closing scene. ONE function. The shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with the four stations lit: first the whole map, which shows all its zones, then the zone of the four, then
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

  const PANEL = ['flowB', 'shiftB', 'routeB', 'forB', 't1B', 't2B', 'withoutB', 'roadB'];
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
    // you and the team lead come in at the second beat of the opening, where the shift starts; before that you would
    // hide the belt the first beat lights, and in the scenes of the stations you would hide the tank, the board or the table
    show(E['pp-jij'], si === 0 && b >= 1 ? 1 : 0);
    show(E['pp-teamlead'], si === 0 && b >= 1 ? 1 : 0);
    // each thing of the room shows from the scene of its station: the stop log from the second, the check table and the
    // quarantine place from the third, the CILT standard, the tag and the laptop from the fourth, the isolator from the fifth
    show(E['o-log'], si >= 1 ? 1 : 0);
    show(E['o-q'], si >= 2 ? 1 : 0);
    show(E['o-cilt'], si >= 3 ? 1 : 0);
    show(E['o-lap'], si >= 3 ? 1 : 0);
    show(E['o-iso'], si >= 4 ? 1 : 0);
    if (si === 0) {
      const t = [tr('De eenheid', 'The unit'), tr('De dienst', 'The shift'), tr('Vier dingen', 'Four things'), tr('De weg', 'The road')][b];
      head = txt(334, 38, t, 22, 'start', 'pm-big') + txt(618, 38, b <= 1 ? tr('voorbeeld', 'example') : tr('schema', 'diagram'), 22, 'end', 'pm-mute');
      if (b === 0) o.flowB = flow(span(p, 0.05, 0.4));
      else if (b === 1) o.shiftB = shift(span(p, 0.05, 0.4));
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
