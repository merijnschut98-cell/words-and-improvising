// The stage of the field film "De fabriek beter maken / Making the plant better": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, MAPZ, ZBAND, MAPSZ,
// ROW, HEAD, CW and wrapUnits. The story is drawn in hall B at the left: the filling unit over the start of line 3's
// belt and the tank, the chalk circle on the floor and the board with the why tree, a table with a scale at the end of the
// belt and the control chart on the back wall, a crate with the bad cartons and a table with the laptop and the sheet of the
// case, the risk matrix and the FMECA sheet on the side wall, and you and the team lead. The panel at the right draws each
// station as four small schemas (what it is for, how it works, then one for each of its two tools as the voice names it),
// the two tools as chips, then a dashed card with what goes wrong without it. Every part a sentence lights is a static
// data-cue group (build.mjs); this script only fills the panel and shows or hides the room's moving parts. The closing scene
// (the shared Engineering map with the four stations lit: the whole map, the zone, then place by place) is ONE function,
// closing; the map itself is the kit's mapScene. Every label is a tr('nl', 'en') pair, with the width of its box as a third
// argument where it is narrower than the panel (the kit checks that they fit). Station names come from the page data (the
// label of the film, else the index's module title): the road wraps them with the kit's own wrapUnits (ROW, CW), the panel
// heading with the panel's width (HEAD).
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

  // ---- s1: the opening. Beat 1 what the unit does and the problem (it fills cartons, and some come out too light), beat 2
  // the shift that is over and what you and the team lead do after it, beat 3 what that takes in four steps, beat 4 the road.
  function flow(a) {
    return op(a, step(56, tr('Vuleenheid', 'Filling unit')) + down(56) + step(96, tr('Dozen op de band', 'Cartons on the belt')) + down(96)
      + step(136, tr('Te lichte doos', 'Too-light carton'), 'pm-crit', 'pm-on'));
  }
  // after the shift: the shift is over, you and the team lead stay, the line gets better
  function shift(a) {
    return op(a, step(56, tr('Dienst voorbij', 'Shift over')) + down(56) + step(96, tr('Jij en de teamleider', 'You and the team lead', 262)) + down(96)
      + step(136, tr('Lijn 3 beter', 'Line 3 better'), 'pm-crit', 'pm-on'));
  }
  function route(a) {
    return op(a, [[tr('Oorzaak', 'Cause'), 'pm-card', 'pm-txt'], [tr('Proces lezen', 'Read the process'), 'pm-card', 'pm-txt'], [tr('Kosten', 'Cost'), 'pm-card', 'pm-txt'],
      [tr('Betrouwbaar', 'Reliable'), 'pm-crit', 'pm-on']]
      .map(([t, c, tc], i) => step(56 + i * 40, t, c, tc) + (i < 3 ? down(56 + i * 40) : '')).join(''));
  }

  // ---- the four schemas of each station (y 108 to 214): [what it is for, how it works, tool 1, tool 2]
  const FOR = [
    [ // s2 Engineering problem solving
      // what you see against what causes it: the too-light carton is the symptom, the root cause is behind it
      () => step(108, tr('Te lichte doos', 'Too-light carton')) + down(108) + step(148, tr('Grondoorzaak', 'Root cause'), 'pm-crit', 'pm-on')
        + txt(346, 208, tr('Symptoom of oorzaak?', 'Symptom or cause?', 270), 22, 'start', 'pm-mute'),
      // go and see, look for the cause, then a countermeasure to test
      () => step(108, tr('Ga kijken', 'Go and see')) + down(108) + step(148, tr('Oorzaak zoeken', 'Find the cause')) + down(148) + step(188, tr('Tegenmaatregel', 'Countermeasure'), 'pm-crit', 'pm-on'),
      // tool 1: the Ohno circle, a circle on the floor with a figure in it looking at the machine
      () => '<ellipse class="pm-link" cx="440" cy="158" rx="76" ry="38"/><circle class="pm-dot" cx="440" cy="138" r="9"/><path class="pm-link" d="M440 147V174M440 174L430 192M440 174L450 192"/>'
        + arrow(462, 144, 538, 144) + rect(548, 118, 70, 54, 'pm-card', 6)
        + txt(334, 210, tr('Blijf staan en kijk', 'Stand still and watch', 284), 22, 'start', 'pm-big'),
      // tool 2: the why tree, a why with branches
      () => rect(334, 140, 112, 34, 'pm-card', 6) + txt(390, 164, tr('Waarom?', 'Why?', 108), 22, 'middle', 'pm-txt')
        + '<path class="pm-link" d="M446 157H462M462 128V186M462 128H486M462 186H486M542 186H550M550 166V206M550 166H564M550 206H564"/>'
        + rect(486, 112, 56, 32, 'pm-tile', 5) + rect(486, 170, 56, 32, 'pm-tile', 5) + rect(564, 152, 54, 28, 'pm-tile', 5) + rect(564, 192, 54, 28, 'pm-crit', 5),
    ],
    [ // s3 Measurement and SPC in depth
      // the weights of seven cartons: one is too light
      () => txt(346, 130, tr('Gewicht per doos', 'Weight per carton', 270), 22, 'start', 'pm-big')
        + [64, 70, 62, 72, 66, 44, 68].map((h, i) => rect(346 + i * 38, 212 - h, 28, h, i === 5 ? 'pm-crit' : 'pm-card', 4)).join(''),
      // weigh, plot, react
      () => step(108, tr('Weeg', 'Weigh')) + down(108) + step(148, tr('Zet uit op een kaart', 'Plot on a chart')) + down(148) + step(188, tr('Reageer op een signaal', 'React to a signal'), 'pm-crit', 'pm-on'),
      // tool 1: the first-off check, the first part after a changeover is measured before the run goes on
      () => step(108, tr('Omstelling', 'Changeover')) + down(108) + step(148, tr('Eerste stuk meten', 'Measure the first part')) + down(148) + step(188, tr('Serie loopt door', 'Run goes on'), 'pm-crit', 'pm-on'),
      // tool 2: the np chart, a count per sample with a centre line and an upper limit, the last point over it
      () => '<path class="pm-road" d="M338 168H614"/><path class="pm-road" d="M338 128H614"/>'
        + '<path class="pm-link" d="M352 172L388 160L424 178L460 156L496 168L532 150L568 176"/>'
        + [[352, 172], [388, 160], [424, 178], [460, 156], [496, 168], [532, 150]].map(([cx, cy]) => `<circle class="pm-dot" cx="${cx}" cy="${cy}" r="5"/>`).join('')
        + '<path class="pm-link" d="M568 176L598 114"/><circle class="pm-crit" cx="598" cy="114" r="8"/>'
        + txt(334, 210, tr('Te lichte dozen', 'Too-light cartons', 284), 22, 'start', 'pm-mute'),
    ],
    [ // s4 Cost engineering
      // the problem against the fix, two bars
      () => [[tr('Probleem', 'Problem', 108), 150, 'pm-crit'], [tr('Aanpak', 'Fix', 108), 90, 'pm-card']]
        .map(([t, v, c], i) => txt(346, 142 + i * 50, t, 22, 'start', 'pm-big') + rect(462, 118 + i * 50, v, 34, c, 5)).join(''),
      // scrap, what it costs, what the fix saves
      () => step(108, tr('Uitval', 'Scrap')) + down(108) + step(148, tr('Wat het kost', 'What it costs')) + down(148) + step(188, tr('Wat het scheelt', 'What it saves'), 'pm-crit', 'pm-on'),
      // tool 1: the cost of poor quality, three kinds of loss with a bar each
      () => [[tr('Uitval', 'Scrap', 120), 130], [tr('Sorteren', 'Sorting', 120), 76], [tr('Retour', 'Returns', 120), 48]]
        .map(([t, v], i) => rect(334, 112 + i * 34, 284, 28, 'pm-tile', 5) + txt(346, 133 + i * 34, t, 22, 'start', 'pm-txt') + rect(470, 120 + i * 34, v, 12, i === 0 ? 'pm-crit' : 'pm-badge', 3)).join(''),
      // tool 2: the cash saving, less scrap, less material, a saving that counts
      () => [[tr('Minder uitval', 'Less scrap'), 'pm-card', 'pm-txt'], [tr('Minder materiaal', 'Less material'), 'pm-card', 'pm-txt'], [tr('Kasbesparing', 'Cash saving'), 'pm-crit', 'pm-on']]
        .map(([t, c, tc], i) => step(108 + i * 40, t, c, tc) + (i < 2 ? down(108 + i * 40) : '')).join(''),
    ],
    [ // s5 Reliability and asset strategy
      // the parts of the unit, one of them weighs far more than the others
      () => txt(346, 130, tr('Onderdelen', 'Parts', 128), 22, 'start', 'pm-big')
        + rect(346, 170, 50, 42, 'pm-card', 5) + rect(406, 150, 60, 62, 'pm-card', 5) + rect(476, 130, 80, 82, 'pm-crit', 5) + rect(566, 164, 48, 48, 'pm-card', 5),
      // consequence, likelihood, ranking
      () => step(108, tr('Gevolg', 'Consequence')) + down(108) + step(148, tr('Kans', 'Likelihood')) + down(148) + step(188, tr('Rangorde', 'Ranking'), 'pm-crit', 'pm-on'),
      // tool 1: the risk matrix, a grid of three by three with the top right cell marked
      () => [0, 1, 2].map((j) => [0, 1, 2].map((i) => rect(334 + i * 96, 112 + j * 34, 90, 28, i === 2 && j === 0 ? 'pm-crit' : 'pm-tile', 5)).join('')).join(''),
      // tool 2: the FMECA, a row each for the failure mode, its effect and its cause
      () => [[tr('Faalwijze', 'Failure mode', 146), 110], [tr('Effect', 'Effect', 146), 80], [tr('Oorzaak', 'Cause', 146), 56]]
        .map(([t, v], i) => rect(334, 112 + i * 34, 284, 28, 'pm-card', 5) + txt(346, 133 + i * 34, t, 22, 'start', 'pm-txt') + rect(496, 120 + i * 34, v, 12, i === 0 ? 'pm-crit' : 'pm-badge', 3)).join(''),
    ],
  ];
  const TOOLS = [
    [tr('Ohno-cirkel', 'Ohno circle', 248), tr('Waaromboom', 'Why tree', 248)],
    [tr('Eerstestukcontrole', 'First-off check', 248), tr('np-kaart', 'np chart', 248)],
    [tr('Faalkosten', 'Cost of poor quality', 248), tr('Kasbesparing', 'Cash saving', 248)],
    [tr('Risicomatrix', 'Risk matrix', 248), 'FMECA'],
  ];
  const WITHOUT = [
    tr('kans op terugkeer', 'it may come back', 244),
    tr('ruis of verandering?', 'noise or change?', 244),
    tr('onzeker of het loont', 'unsure it pays off', 244),
    tr('geen prioriteit', 'no priority', 244),
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
    // you and the team lead come in at the second beat of the opening, where the shift is over; before that you would hide
    // the belt the first beat lights. In the second scene you stand in the chalk circle from the second beat on and the team
    // lead is gone; in the other scenes you would hide the tank, the board or the table
    show(E['pp-jij0'], si === 0 && b >= 1 ? 1 : 0);
    show(E['pp-jij'], si === 1 && b >= 1 ? 1 : 0);
    show(E['pp-teamlead'], si === 0 && b >= 1 ? 1 : 0);
    // each thing of the room shows from the scene of its station: the chalk circle and the why tree from the second, the scale
    // and the chart from the third, the crate and the laptop with the case from the fourth, the risk matrix and the FMECA from the fifth
    show(E['o-ring'], si >= 1 ? 1 : 0);
    show(E['o-tree'], si >= 1 ? 1 : 0);
    show(E['o-scale'], si >= 2 ? 1 : 0);
    show(E['o-chart'], si >= 2 ? 1 : 0);
    show(E['o-crate'], si >= 3 ? 1 : 0);
    show(E['o-lap'], si >= 3 ? 1 : 0);
    show(E['o-wall'], si >= 4 ? 1 : 0);
    if (si === 0) {
      const t = [tr('Het probleem', 'The problem'), tr('Na de dienst', 'After the shift'), tr('Vier dingen', 'Four things'), tr('De weg', 'The road')][b];
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
