// The stage of the field film "Energie en het net / Energy and the grid": a pure function of (scene, u). Inlined into the
// page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, MAPZ, ZBAND, MAPSZ, ROW, HEAD, CW and
// wrapUnits. The story is drawn in hall B at the left: the cable from the grid, the power cabinet, the transformer, the
// switchboard above line 3, the filling unit with its tank and pump, the motor and the compressor, the installer and
// you, the engineer. The panel at the right draws each station as four small schemas (what it is for, how it works, then
// one for each of its two tools as the voice names it), the two tools as chips, then a dashed card with what goes wrong
// without it.
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or
// hides the room's moving parts. The closing scene (the shared Engineering map with the seven stations lit: the whole
// map, the energy zone, then place by place) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the
// panel (the kit checks that they fit). Station names come from the page data (the index's module titles, or the film's
// label for a title that does not fit a station): the road wraps them with the kit's own wrapUnits (ROW, CW), the panel
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
  // (wrapped into at most two lines of ROW units). s2 to s8: a strip of numbered squares under the heading.
  const N = TITLES.length;
  // the rows have the height of their lines: a one-line title 32 units, a two-line title 50 (the lines 24 apart)
  const ROWS = (() => { let y = 50; return TITLES.map((t) => { const lines = wrapUnits(t, ROW, CW); const r = { y, lines, h: lines.length > 1 ? 50 : 32 }; y += r.h; return r; }); })();
  function roadRows(a4) {
    const rows = ROWS.map((r, i) => {
      const cy = r.y + r.h / 2;
      const label = r.lines.map((ln, j) => txt(380, r.lines.length > 1 ? r.y + 18 + j * 24 : r.y + 23, ln, 22, 'start', 'pm-big')).join('');
      return op(a4[i], `<circle class="pm-dot" cx="352" cy="${f1(cy)}" r="16"/>` + txt(352, cy + 8, String(i + 1), 22, 'middle', 'pm-on') + label);
    });
    const line = `<path class="pm-road" d="M352 ${f1(ROWS[0].y + ROWS[0].h / 2 + 16)}V${f1(ROWS[N - 1].y + ROWS[N - 1].h / 2 - 16)}"/>`;
    return { rows, line: op(a4[0], line) };
  }
  // the strip: small numbered squares under the heading, the scene's own station filled
  function strip(cur) {
    return TITLES.map((t, i) => rect(334 + i * 26, 72, 24, 24, i === cur ? 'pm-crit' : 'pm-tile', 5) + txt(334 + i * 26 + 12, 91, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
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

  // ---- s1: the opening. Beat 1 the move (line 3 moves and needs more power), beat 2 the chain the power runs through
  // (grid, cabinet, transformer, switchboard, motor), beat 3 the route (you follow it), beat 4 the road.
  function fills(a) {
    return op(a, step(56, tr('Lijn 3 verhuist', 'Line 3 moves', 270)) + down(56) + step(96, tr('Nieuwe plek', 'New place', 270)) + down(96)
      + step(136, tr('Meer stroom nodig', 'More power needed', 270), 'pm-crit', 'pm-on'));
  }
  function parts(a) {
    return op(a, [['Net', 'Grid'], ['Kast', 'Cabinet'], ['Transformator', 'Transformer'], ['Schakelbord', 'Switchboard'], ['Motor', 'Motor']]
      .map(([nl, en], i) => row(56 + i * 44, tr(nl, en), 'pm-card', 'pm-txt', 34)).join(''));
  }
  function route(a) {
    return op(a, step(56, tr('Net', 'Grid')) + down(56) + step(96, tr('Fabriek', 'Plant')) + down(96)
      + step(136, tr('Machine', 'Machine')) + down(136) + step(176, tr('Lijn 3', 'Line 3'), 'pm-crit', 'pm-on'));
  }

  // ---- the four schemas of each station (y 108 to 214): [what it is for, how it works, tool 1, tool 2]
  const FOR = [
    [ // s2 The electricity grid
      // from high to low voltage
      () => step(108, tr('Hoogspanning', 'High voltage', 270)) + down(108) + step(148, tr('Middenspanning', 'Medium voltage', 270)) + down(148)
        + step(188, tr('Laagspanning', 'Low voltage', 270), 'pm-crit', 'pm-on'),
      // high voltage: a small current and little loss
      () => txt(334, 129, tr('Spanning', 'Voltage', 130), 22, 'start', 'pm-big') + rect(474, 110, 144, 24, 'pm-card', 5)
        + txt(334, 165, tr('Stroom', 'Current', 130), 22, 'start', 'pm-big') + rect(474, 146, 60, 24, 'pm-card', 5)
        + txt(334, 201, tr('Verlies', 'Loss', 130), 22, 'start', 'pm-big') + rect(474, 182, 18, 24, 'pm-crit', 5),
      // tool 1: the capacity map, areas with room and an area that is full
      () => rect(334, 110, 284, 100, 'pm-tile', 6) + rect(346, 122, 80, 76, 'pm-card', 6) + rect(436, 122, 80, 76, 'pm-crit', 6) + rect(526, 122, 80, 76, 'pm-out', 6),
      // tool 2: the flexible contract, the peaks above a limit are the ones you give up
      () => [30, 46, 70, 84, 52, 34].map((h, i) => rect(350 + i * 44, 206 - h, 30, h, h > 66 ? 'pm-crit' : 'pm-card', 4)).join('')
        + '<path class="pm-road" d="M340 140H612"/>',
    ],
    [ // s3 Switchgear and protection
      // grid, a switch with its blade open, the hall
      () => rect(334, 128, 80, 44, 'pm-card', 6) + txt(374, 157, tr('Net', 'Grid', 76), 22, 'middle', 'pm-txt')
        + '<path class="pm-arrow" d="M414 150H448M492 150H536"/><circle class="pm-dot" cx="452" cy="150" r="5"/><circle class="pm-dot" cx="488" cy="150" r="5"/><path class="pm-arrow" d="M452 150L484 128"/>'
        + rect(538, 128, 80, 44, 'pm-crit', 6) + txt(578, 157, tr('Hal B', 'Hall B', 76), 22, 'middle', 'pm-on'),
      // only the nearest protection trips
      () => step(108, tr('Blijft aan', 'Stays on', 270)) + down(108) + step(148, tr('Schakelt af', 'Trips', 270), 'pm-crit', 'pm-on') + down(148)
        + step(188, tr('Fout', 'Fault', 270), 'pm-out', 'pm-txt'),
      // tool 1: the protection relay, a case with a display and the settings
      () => rect(406, 110, 140, 100, 'pm-card', 8) + rect(420, 122, 112, 32, 'pm-tile', 4) + '<path class="pm-link" d="M430 144L450 132L468 144L488 132L506 144L522 138"/>'
        + hole(436, 182, 5) + hole(466, 182, 5) + hole(496, 182, 5) + '<circle class="pm-crit" cx="524" cy="182" r="6"/>'
        + '<path class="pm-arrow" d="M346 160H400M552 160H606"/>',
      // tool 2: the earthing set, three phases clamped to one bar and to the ground
      () => [0, 1, 2].map((i) => rect(380 + i * 88, 112, 40, 30, 'pm-card', 4) + `<path class="pm-link" d="M${400 + i * 88} 142V160"/>`).join('')
        + rect(370, 160, 230, 10, 'pm-solid', 3) + '<path class="pm-link" d="M485 170V190M463 190H507M472 198H498M479 206H491"/>',
    ],
    [ // s4 Transformers and cables
      // an iron core with a coil on each side, high voltage in, low voltage out
      () => rect(414, 112, 148, 96, 'pm-card', 8) + rect(444, 134, 88, 52, 'pm-tile', 4) + rect(420, 128, 30, 64, 'pm-crit', 4) + rect(526, 128, 30, 64, 'pm-card', 4)
        + txt(334, 166, tr('Hoog', 'High', 76), 22, 'start', 'pm-big') + txt(618, 166, tr('Laag', 'Low', 52), 22, 'end', 'pm-big'),
      // heat shortens the life
      () => txt(334, 129, tr('Warmte', 'Heat', 130), 22, 'start', 'pm-big') + rect(474, 110, 144, 24, 'pm-crit', 5)
        + txt(334, 189, tr('Levensduur', 'Lifetime', 138), 22, 'start', 'pm-big') + rect(474, 170, 50, 24, 'pm-card', 5),
      // tool 1: dissolved gas analysis, a flask with oil and bubbles
      () => '<path class="pm-card" d="M452 110H500V140L536 198A8 8 0 0 1 529 210H423A8 8 0 0 1 416 198L452 140Z"/>'
        + '<path class="pm-link" d="M436 176H516"/>' + hole(470, 190, 4) + hole(490, 184, 4) + hole(480, 198, 3.5),
      // tool 2: the reflectometer, a pulse into the cable and the echo from the fault
      () => rect(334, 150, 284, 14, 'pm-card', 4) + rect(548, 144, 16, 26, 'pm-crit', 3) + arrow(346, 128, 540, 128) + arrow(556, 192, 346, 192),
    ],
    [ // s5 Motors and fluid power
      // power, motor, belt
      () => [tr('Net', 'Grid', 76), tr('Motor', 'Motor', 76), tr('Band', 'Belt', 76)].map((t, i) => rect(334 + i * 102, 128, 80, 44, i === 2 ? 'pm-crit' : 'pm-card', 6)
        + txt(374 + i * 102, 157, t, 22, 'middle', i === 2 ? 'pm-on' : 'pm-txt')).join('') + arrow(414, 150, 432, 150) + arrow(516, 150, 534, 150),
      // compressor, hose, a leak
      () => step(108, tr('Compressor', 'Compressor', 270)) + down(108) + step(148, tr('Slang', 'Hose', 270)) + down(148) + step(188, tr('Lek', 'Leak', 270), 'pm-crit', 'pm-on'),
      // tool 1: the clamp meter, a jaw closed around one cable
      () => rect(334, 152, 98, 12, 'pm-card', 4) + rect(532, 152, 86, 12, 'pm-card', 4) + rect(432, 112, 100, 98, 'pm-card', 10)
        + '<circle class="pm-tile" cx="482" cy="158" r="24"/>' + rect(458, 152, 48, 12, 'pm-card', 3),
      // tool 2: the leak test, a tank with air escaping
      () => rect(380, 120, 170, 64, 'pm-card', 30) + arrow(420, 190, 420, 210) + arrow(465, 190, 465, 210) + arrow(510, 190, 510, 210),
    ],
    [ // s6 Pumps, flow and heat
      // tank, pump, filler
      () => [tr('Tank', 'Tank', 76), tr('Pomp', 'Pump', 76), tr('Vuller', 'Filler', 76)].map((t, i) => rect(334 + i * 102, 128, 80, 44, i === 2 ? 'pm-crit' : 'pm-card', 6)
        + txt(374 + i * 102, 157, t, 22, 'middle', i === 2 ? 'pm-on' : 'pm-txt')).join('') + arrow(414, 150, 432, 150) + arrow(516, 150, 534, 150),
      // the duty point: where the pump curve and the pipe curve cross
      () => '<path class="pm-link" d="M346 128V200H606"/><path class="pm-arrow" d="M362 142C440 142 520 160 590 196"/><path class="pm-link" d="M362 196C440 194 520 168 590 140"/>'
        + '<circle class="pm-crit" cx="518" cy="166" r="7"/>' + txt(606, 120, tr('Werkpunt', 'Duty point', 200), 22, 'end', 'pm-big'),
      // tool 1: the pump curve, head against flow
      () => '<path class="pm-link" d="M346 128V200H606"/><path class="pm-acc" d="M362 142C440 142 520 160 590 196"/>',
      // tool 2: the plate heat exchanger, a stack of plates, warm and cold passing
      () => [0, 1, 2, 3, 4, 5].map((i) => rect(430 + i * 14, 112, 8, 96, 'pm-card', 2)).join('')
        + arrow(346, 128, 422, 128) + arrow(516, 190, 606, 190) + '<path class="pm-arrow" d="M346 192H422M516 130H606"/>',
    ],
    [ // s7 Grid operations and assets
      // request, upgrade, connection
      () => step(108, tr('Aanvraag', 'Request', 270)) + down(108) + step(148, tr('Verzwaren', 'Upgrade', 270)) + down(148) + step(188, tr('Aansluiting', 'Connection', 270), 'pm-crit', 'pm-on'),
      // watch, repair, steer
      () => row(108, tr('Net bewaken', 'Watch the grid', 270)) + row(148, tr('Storing herstellen', 'Fix an outage', 270)) + row(188, tr('Piek bijsturen', 'Steer the peak', 270), 'pm-crit', 'pm-on'),
      // tool 1: the readiness check, four lines (design, permit, material, crew) each ticked
      () => [0, 1, 2, 3].map((i) => rect(400, 110 + i * 26, 20, 20, 'pm-tile', 3) + `<path class="pm-acc" d="M404 ${120 + i * 26}l5 5 8-10"/>` + rect(430, 116 + i * 26, 130, 8, 'pm-card', 3)).join(''),
      // tool 2: the switching plan, numbered steps
      () => [0, 1, 2].map((i) => `<circle class="pm-dot" cx="352" cy="${126 + i * 34}" r="12"/>` + txt(352, 134 + i * 34, String(i + 1), 22, 'middle', 'pm-txt') + rect(376, 114 + i * 34, 242, 24, i === 1 ? 'pm-crit' : 'pm-tile', 4)).join(''),
    ],
    [ // s8 Grid planning and the transition
      // now against later, with the limit of the grid
      () => txt(334, 129, tr('Nu', 'Now', 90), 22, 'start', 'pm-big') + rect(430, 110, 90, 24, 'pm-card', 5)
        + txt(334, 177, tr('Straks', 'Later', 90), 22, 'start', 'pm-big') + rect(430, 158, 188, 24, 'pm-crit', 5)
        + '<path class="pm-road" d="M540 102V196"/>' + txt(540, 214, tr('Grens', 'Limit', 100), 22, 'middle', 'pm-mute'),
      // growth crosses the limit: the bottleneck
      () => '<path class="pm-link" d="M346 108V200H606"/><path class="pm-arrow" d="M356 190C420 184 480 160 590 112"/><path class="pm-road" d="M350 146H606"/>'
        + '<circle class="pm-crit" cx="468" cy="146" r="7"/>' + txt(484, 184, tr('Knelpunt', 'Bottleneck', 130), 22, 'start', 'pm-big'),
      // tool 1: the load flow, a network with one line loaded to the limit
      () => '<path class="pm-link" d="M366 160L440 120L514 160L588 120M440 120V190L514 160"/><path class="pm-acc" d="M440 190L514 160"/>'
        + [[366, 160], [440, 120], [514, 160], [588, 120], [440, 190]].map(([x, y]) => `<circle class="pm-dot" cx="${x}" cy="${y}" r="8"/>`).join(''),
      // tool 2: the scenarios, three pictures of the demand to come (low, middle, high) against the limit of the grid
      () => '<path class="pm-link" d="M346 108V200H606"/><path class="pm-road" d="M350 140H606"/><path class="pm-link" d="M356 190C440 186 520 176 590 168M356 190C440 182 520 150 590 112"/><path class="pm-acc" d="M356 190C440 184 520 164 590 140"/>',
    ],
  ];
  const TOOLS = [
    [tr('Capaciteitskaart', 'Capacity map', 244), tr('Flexibel contract', 'Flexible contract', 244)],
    [tr('Beveiligingsrelais', 'Protection relay', 244), tr('Aardgarnituur', 'Earthing set', 244)],
    [tr('DGA-olietest', 'DGA oil test', 244), tr('Reflectiemeter', 'Reflectometer', 244)],
    [tr('Stroomtang', 'Clamp meter', 244), tr('Lektest', 'Leak test', 244)],
    [tr('Pompkarakteristiek', 'Pump curve', 244), tr('Platenwisselaar', 'Plate exchanger', 244)],
    [tr('Gereedheidscheck', 'Readiness check', 244), tr('Schakelplan', 'Switching plan', 244)],
    [tr('Loadflow', 'Load flow', 244), tr('Scenario', 'Scenario', 244)],
  ];
  const WITHOUT = [
    tr('wachtrij voor stroom', 'queue for power', 244),
    tr('één fout, alles uit', 'one fault, all off', 244),
    tr('uitval, lang zoeken', 'outage, long search', 244),
    tr('lekken, te grote motor', 'leaks, big motor', 244),
    tr('pomp op fout punt', 'pump off its point', 244),
    tr('late aansluiting', 'late connection', 244),
    tr('verzwaring te laat', 'upgrade too late', 244),
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

  // ---- s9: the closing scene. ONE function. The shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with the seven stations lit: first the whole map, which shows all its zones, then the energy zone, then
  // the zoom moves place by place (at 1.5 a lit place's label is 22 units), and at the end back out to the zone.
  // A view is { s, x, y }: the map scaled by s, its origin at (x, y) of the stage. At 1.5 the view is clamped
  // to the map's edges, so the zoom never shows the empty stage beside the map.
  const ZC = (ZBAND[0] + ZBAND[1]) / 2;
  const WHOLE = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
  const ZONEV = { s: 1, x: 0, y: H / 2 - ZC };
  // place by place: at 1.5 the stage shows 427 of the map's 640 units. The lit place is centred, as far as the map's
  // edges allow, so no lit label is cut by the edge of the stage; both rows of the zone are in view, so the zone's
  // band fills the stage's height
  const zoom = (cx) => ({ s: 1.5, x: clamp(W / 2 - cx * 1.5, W - MAPSZ[0] * 1.5, 0), y: H / 2 - ZC * 1.5 });
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
    // you, at the front left of the hall, from the route of the opening on: in the first two beats you would stand in
    // front of the lit cable through the wall
    show(E['pp-jij'], si === 0 && b >= 2 ? (b === 2 ? span(p, 0, 0.15) : 1) : 0);
    show(E['pp-installer'], si === 2 ? 1 : 0); // the installer stands by the cabinet while the station of the switchgear is told
    if (si === 0) {
      const t = [tr('De verhuizing', 'The move'), tr('De keten', 'The chain'), tr('De route', 'The route'), tr('De weg', 'The road')][b];
      head = txt(334, 38, t, 22, 'start', 'pm-big') + txt(618, 38, b <= 1 ? tr('voorbeeld', 'example') : tr('schema', 'diagram'), 22, 'end', 'pm-mute');
      if (b === 0) o.flowB = fills(span(p, 0.05, 0.4));
      else if (b === 1) o.goalB = parts(span(p, 0.05, 0.4));
      else if (b === 2) o.routeB = route(span(p, 0.05, 0.4));
      else {
        const r = roadRows(TITLES.map((tt, i) => span(p, 0.05 + i * 0.1, 0.3 + i * 0.1)));
        r.rows.forEach((x, i) => { rd[i] = x; });
        o.roadB = r.line;
      }
    } else if (!isMap) {
      const lines = wrapUnits(TITLES[si - 1], HEAD, CW);
      head = lines.map((ln, j) => txt(334, 34 + j * 26, ln, 22, 'start', 'pm-big')).join('') + txt(618, 92, tr('schema', 'diagram', 90), 22, 'end', 'pm-mute');
      strip(si - 1).forEach((x, i) => { rd[i] = x; });
      Object.assign(o, station(si, b, p));
    } else closing(b, p);
    set(E.pHead, isMap ? '' : head);
    rd.forEach((x, i) => set(E[`rd${i}`], x));
    for (const k2 of PANEL) set(E[k2], o[k2]);
  }

  return { render };
})();
