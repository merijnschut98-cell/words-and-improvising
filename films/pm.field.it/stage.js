// The stage of the field film "IT en agile / IT and agile": a pure function of (scene, u). Inlined into the page
// after the anatomy kit and a preamble from build.mjs that defines CAM, W, H and MAPZ (the centres of the four
// stations on the shared map). The story is drawn in hall B at the left, as in the pilot and in field films 1 to 3:
// line 3 runs on its floor, the switchboard hangs, the cable is connected, a laptop on a table is the new MES, and
// a cast that changes per scene: the team lead and the operators at line 3, the plant manager who sponsors the
// project. The panel at the right draws each station as four small schemas (what it is for, how it works, then
// one for each of its two tools as the voice names it), the two tools as chips, then a dashed card with what goes
// wrong without it.
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows
// or hides the room's moving parts. The closing scene (the shared Projects map with the four stations lit, the
// zoom place by place) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than
// the panel (the kit checks that they fit). Station titles come from the page data (the index's module titles):
// the road wraps them with the kit's own wrapUnits (ROW, CW), the panel heading with the panel's width (HEAD).
/* global CAM, W, H, MAPZ, ROW, HEAD, CW, wrapUnits, span, beatStarts */
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
  const arrow = (x0, y0, x1, y1) => {
    const up = y1 < y0 ? -1 : 1;
    const horiz = Math.abs(y1 - y0) < 1;
    const head = horiz ? `M${f1(x1 - 6)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * up)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * up)}`;
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

  // ---- the cast of hall B: who stands there when. [scene, first beat]: present from that beat to the scene's end.
  const FROM = {
    sponsor: [[0, 1], [2, 0], [4, 0]],
    lead: [[0, 0], [1, 0], [4, 0]],
    crew: [[0, 0], [3, 0]],
  };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }

  // ---- the road. s1 beat 3: one row per station, each a numbered stop on a dashed road with the station's title
  // (wrapped into at most two lines of ROW units). s2 to s5: a strip of numbered squares under the heading.
  const N = TITLES.length;
  const rowY = (i) => 66 + i * 62;
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
  // the strip: four small numbered squares under the heading, the scene's own station filled
  function strip(cur) {
    return TITLES.map((t, i) => rect(334 + i * 30, 72, 26, 26, i === cur ? 'pm-crit' : 'pm-tile', 5) + txt(334 + i * 30 + 13, 92, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
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
  // a small person glyph (head and shoulders), for the people of the opening
  const glyph = (cx, cy, cls) => `<circle class="${cls}" cx="${cx}" cy="${cy - 10}" r="9"/><path class="${cls}" d="M${cx - 15} ${cy + 22}v-6a15 12 0 0 1 30 0v6z"/>`;
  // a row of a schema: a tile with its label
  const row = (y, label, cls = 'pm-tile', tcls = 'pm-txt', h = 30) => rect(334, y, 284, h, cls, 6) + txt(346, y + h - 8, label, 22, 'start', tcls);
  // a short row for a chain with an arrow between the rows (h 28, gap 12: rows at 108, 148 and 188)
  const step = (y, label, cls = 'pm-card', tcls = 'pm-txt', w = 284) => rect(334, y, w, 28, cls, 6) + txt(346, y + 21, label, 22, 'start', tcls);
  const down = (y, x = 476) => arrow(x, y + 28, x, y + 40);

  // ---- s1: the opening. Beat 1 the new MES (its three jobs), beat 2 the people, beat 3 the road.
  function mes(a) {
    return op(a, row(56, tr('Orders per lijn', 'Orders per line', 262), 'pm-crit', 'pm-on', 34)
      + row(98, tr('Wat gemaakt is', 'What is made', 262), 'pm-card', 'pm-txt', 34)
      + row(140, tr('Wat afgekeurd is', 'What is rejected', 262), 'pm-card', 'pm-txt', 34));
  }
  function people3(a) {
    return op(a, rect(334, 56, 284, 44, 'pm-card', 8) + glyph(362, 76, 'pm-tile') + txt(394, 86, tr('Plantmanager', 'Plant manager', 216), 22, 'start', 'pm-txt')
      + arrow(476, 104, 476, 116)
      + rect(334, 120, 284, 44, 'pm-crit', 8) + glyph(362, 140, 'pm-on') + txt(394, 150, tr('Jij: leidt', 'You: lead', 216), 22, 'start', 'pm-on')
      + arrow(476, 168, 476, 180)
      + rect(334, 184, 284, 44, 'pm-card', 8) + glyph(362, 204, 'pm-tile') + txt(394, 214, tr('IT-team: bouwt', 'IT team: builds', 216), 22, 'start', 'pm-txt'));
  }

  // ---- the four schemas of each station (y 108 to 214): [what it is for, how it works, tool 1, tool 2]
  const tick = (x, y) => `<path class="pm-arrow" d="M${x} ${y + 15}l8 8l16 -18"/>`;
  const toggle = (y, on) => rect(540, y + 4, 64, 22, on ? 'pm-crit' : 'pm-tile', 11) + `<circle class="pm-dot" cx="${on ? 593 : 551}" cy="${y + 15}" r="8"/>`;
  const FOR = [
    [ // s2 Agile and Scrum
      // three short rounds, each ending in something that works
      () => ['Sprint 1', 'Sprint 2', 'Sprint 3'].map((t, i) => rect(334, 108 + i * 38, 200, 30, 'pm-card', 6) + txt(346, 130 + i * 38, t, 22, 'start', 'pm-txt') + tick(560, 108 + i * 38)).join(''),
      // the feedback loop: make, show, adjust
      () => step(108, tr('Maken', 'Make', 216), 'pm-card', 'pm-txt', 240) + down(108, 454)
        + step(148, tr('Laten zien', 'Show', 216), 'pm-card', 'pm-txt', 240) + down(148, 454)
        + step(188, tr('Bijsturen', 'Adjust', 216), 'pm-crit', 'pm-on', 240)
        + '<path class="pm-link" d="M574 202H594V122H578"/><path class="pm-arrow" d="M584 118L578 122L584 126"/>',
      // tool 1: the kanban board, cards moving from left to right
      () => rect(334, 108, 100, 106, 'pm-tile', 6) + txt(384, 132, tr('Te doen', 'To do', 90), 22, 'middle', 'pm-txt')
        + rect(342, 144, 84, 20, 'pm-badge', 4) + rect(342, 170, 84, 20, 'pm-badge', 4)
        + rect(438, 108, 100, 106, 'pm-tile', 6) + txt(488, 132, tr('Bezig', 'Doing', 90), 22, 'middle', 'pm-txt')
        + rect(446, 144, 84, 20, 'pm-crit', 4)
        + rect(542, 108, 76, 106, 'pm-tile', 6) + txt(580, 132, tr('Klaar', 'Done', 66), 22, 'middle', 'pm-txt')
        + rect(550, 144, 60, 20, 'pm-badge', 4),
      // tool 2: planning poker, three cards turned over together
      () => [['3', 'pm-card'], ['13', 'pm-crit'], ['5', 'pm-card']].map(([n, c], i) => rect(342 + i * 98, 112, 80, 96, c, 8) + txt(382 + i * 98, 172, n, 30, 'middle', c === 'pm-crit' ? 'pm-on' : 'pm-big')).join(''),
    ],
    [ // s3 Scaling
      // a dependency: team A waits for work from team B
      () => rect(334, 112, 120, 44, 'pm-card', 6) + txt(394, 142, 'Team A', 22, 'middle', 'pm-txt')
        + rect(498, 112, 120, 44, 'pm-crit', 6) + txt(558, 142, 'Team B', 22, 'middle', 'pm-on')
        + '<path class="pm-arrow" d="M494 134H460"/><path class="pm-arrow" d="M466 130L460 134L466 138"/>'
        + txt(334, 196, tr('A wacht op B', 'A waits for B', 284), 22, 'start', 'pm-big'),
      // the cadence: the iterations of one planning interval, the last one for improving and planning
      () => [['1', 'pm-card'], ['2', 'pm-card'], ['3', 'pm-card'], ['IP', 'pm-crit']].map(([n, c], i) => rect(334 + i * 74, 108, 62, 40, c, 6) + txt(365 + i * 74, 136, n, 22, 'middle', c === 'pm-crit' ? 'pm-on' : 'pm-txt')).join('')
        + '<path class="pm-link" d="M334 164V174H618V164"/>' + txt(476, 204, 'Planning Interval', 22, 'middle', 'pm-big'),
      // tool 1: PI Planning, the teams in rows and the iterations in columns, a red string between two of them
      () => ['A', 'B', 'C'].map((t, r) => txt(334, 132 + r * 36, t, 22, 'start', 'pm-big')
        + [0, 1, 2].map((c) => rect(376 + c * 82, 110 + r * 36, 74, 28, (r === 0 && c === 1) || (r === 1 && c === 2) ? 'pm-crit' : 'pm-tile', 5)).join('')).join('')
        + '<path class="pm-arrow" d="M495 138L536 146"/>',
      // tool 2: WSJF, the cost of delay over the job size, highest first
      () => txt(476, 130, 'Cost of Delay', 22, 'middle', 'pm-big') + '<path class="pm-road" d="M370 142H582"/>'
        + txt(476, 168, tr('Jobgrootte', 'Job size', 220), 22, 'middle', 'pm-big')
        + rect(374, 182, 204, 32, 'pm-crit', 6) + txt(476, 205, tr('Hoogste eerst', 'Highest first', 190), 22, 'middle', 'pm-on'),
    ],
    [ // s4 DevOps and delivery
      // one team builds and runs
      () => rect(334, 108, 284, 34, 'pm-crit', 6) + txt(476, 132, tr('Eén team', 'One team', 262), 22, 'middle', 'pm-on')
        + rect(334, 150, 138, 34, 'pm-card', 6) + txt(403, 174, tr('Bouwen', 'Build', 120), 22, 'middle', 'pm-txt')
        + rect(480, 150, 138, 34, 'pm-card', 6) + txt(549, 174, tr('Draaien', 'Run', 120), 22, 'middle', 'pm-txt'),
      // a version goes through the environments before the floor
      () => step(108, tr('Test', 'Test', 262)) + down(108) + step(148, tr('Acceptatie', 'Acceptance', 262)) + down(148) + step(188, tr('Productie', 'Production', 262), 'pm-crit', 'pm-on'),
      // tool 1: the pipeline, every change the same steps
      () => step(108, tr('Commit', 'Commit', 262)) + down(108) + step(148, tr('Build en tests', 'Build and tests', 262)) + down(148) + step(188, tr('Echte systemen', 'Real systems', 262), 'pm-crit', 'pm-on'),
      // tool 2: the feature flag, a switch that is on for line 2 and off for line 3
      () => txt(334, 130, tr('Nieuw scherm', 'New screen', 284), 22, 'start', 'pm-big')
        + rect(334, 142, 284, 30, 'pm-card', 6) + txt(346, 164, tr('Lijn 2', 'Line 2', 190), 22, 'start', 'pm-txt') + toggle(142, true)
        + rect(334, 180, 284, 30, 'pm-card', 6) + txt(346, 202, tr('Lijn 3', 'Line 3', 190), 22, 'start', 'pm-txt') + toggle(180, false),
    ],
    [ // s5 Leading IT projects
      // from requirements and vendor to go-live
      () => step(108, tr('Eisen', 'Requirements', 262)) + down(108) + step(148, tr('Leverancier', 'Vendor', 262)) + down(148) + step(188, 'Go-live', 'pm-crit', 'pm-on'),
      // the test levels
      () => step(108, tr('Systeemtest', 'System test', 262)) + down(108) + step(148, tr('Ketentest', 'Chain test', 262)) + down(148) + step(188, 'UAT', 'pm-crit', 'pm-on'),
      // tool 1: MoSCoW, four bins
      () => rect(334, 108, 138, 40, 'pm-crit', 6) + txt(403, 136, 'Must', 22, 'middle', 'pm-on') + rect(480, 108, 138, 40, 'pm-card', 6) + txt(549, 136, 'Should', 22, 'middle', 'pm-txt')
        + rect(334, 156, 138, 40, 'pm-card', 6) + txt(403, 184, 'Could', 22, 'middle', 'pm-txt') + rect(480, 156, 138, 40, 'pm-out', 6) + txt(549, 184, 'Won’t', 22, 'middle', 'pm-mute'),
      // tool 2: the cutover plan, hour by hour from the freeze to the first shift
      () => [[tr('Vr 18:00', 'Fri 18:00', 124), 'Freeze'], [tr('Za 12:00', 'Sat 12:00', 124), 'Go/no-go'], [tr('Ma 06:00', 'Mon 06:00', 124), tr('Eerste ploeg', 'First shift', 144)]]
        .map(([t, a], i) => rect(334, 108 + i * 38, 284, 30, i === 2 ? 'pm-crit' : 'pm-card', 6) + txt(346, 130 + i * 38, t, 22, 'start', i === 2 ? 'pm-on' : 'pm-txt') + txt(470, 130 + i * 38, a, 22, 'start', i === 2 ? 'pm-on' : 'pm-txt')).join(''),
    ],
  ];
  const TOOLS = [
    [tr('Kanbanbord', 'Kanban board', 256), 'Planning poker'],
    ['PI Planning', 'WSJF'],
    ['Pipeline', 'Feature flag'],
    ['MoSCoW', tr('Cutoverdraaiboek', 'Cutover plan', 256)],
  ];
  const WITHOUT = [
    tr('te laat ontdekt', 'found out too late', 240),
    tr('wachten op elkaar', 'waiting on each other', 240),
    tr('handwerk', 'manual work', 240),
    tr('onduidelijke scope', 'unclear scope', 240),
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

  // ---- s6: the closing scene. ONE function. The shared Projects map (the kit's mapScene, the very drawing of the
  // app) with the four stations lit: first the four places together, then the zoom moves place by place (at 1.5 a
  // lit place's label is 22 units), and at the end back out to the whole map.
  // A view is { s, x, y }: the map scaled by s, its origin at (x, y) of the stage. At 1.5 the view is clamped
  // to the map's edges, so the zoom never shows the empty stage beside the map.
  const WHOLE = { s: 0.77, x: 73.6, y: 0 };
  const ROADV = { s: 1, x: 0, y: 200 - MAPZ[0][1] };
  const zoom = (cx) => ({ s: 1.5, x: clamp(320 - cx * 1.5, 640 - 640 * 1.5, 0), y: 200 - MAPZ[0][1] * 1.5 });
  const VIEWS = [ROADV, ...MAPZ.map((m) => zoom(m[0])), WHOLE];
  function closing(b, p) {
    const from = b === 0 ? WHOLE : VIEWS[b - 1];
    const to = VIEWS[b];
    const z = b === 0 ? span(p, 0.45, 0.95) : span(p, 0, 0.45);
    const v = { s: lerp(from.s, to.s, z), x: lerp(from.x, to.x, z), y: lerp(from.y, to.y, z) };
    move(E.mapG, `translate(${f1(v.x)} ${f1(v.y)}) scale(${v.s.toFixed(4)})`);
  }

  const PANEL = ['goalB', 'peopleB', 'forB', 't1B', 't2B', 'withoutB', 'roadB'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    const o = Object.fromEntries(PANEL.map((k2) => [k2, '']));
    const rd = TITLES.map(() => '');
    let head = '';
    const isMap = si === 5;
    show(E.world, isMap ? 0 : 1);
    show(E.mapG, isMap ? 1 : 0);
    show(E.hud, isMap ? 0 : 1);
    if (si === 0) {
      const t = [tr('Het MES', 'The MES'), tr('Wie doet wat', 'Who does what'), tr('De weg', 'The road')][b];
      head = txt(334, 38, t, 22, 'start', 'pm-big') + txt(618, 38, b === 0 ? tr('voorbeeld', 'example') : tr('schema', 'diagram'), 22, 'end', 'pm-mute');
      if (b === 0) o.goalB = mes(span(p, 0.05, 0.4));
      else if (b === 1) o.peopleB = people3(span(p, 0.05, 0.4));
      else {
        const r = roadRows(TITLES.map((tt, i) => span(p, 0.05 + i * 0.15, 0.3 + i * 0.15)));
        r.rows.forEach((x, i) => { rd[i] = x; });
        o.roadB = r.line;
      }
    } else if (si <= 4) {
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
