// The stage of the module intro film "Elke versie naar de vloer / Every version to the floor": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, as in
// field film 4 (films/pm.field.it): line 3 and line 4 at the back wall, the new MES
// as a laptop on the table at the front, and a cast that changes per topic (the IT
// team, the plant manager, the team lead of line 3, the operators). The panel at the
// right draws each step as a schema, labelled "voorbeeld" (the MES in use) or
// "schema". Every part a sentence lights is a static data-cue group (build.mjs);
// this script only fills the panel and shows or hides the room's moving parts.
// The closing scene (the shared Projects map, then the module's four topics with
// their levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third
// argument where it is narrower than the panel (the kit checks that they fit).
/* global CAM, W, H, LV, MAPZ, GRID, CW, wrapUnits, span, beatStarts */
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
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const up = y1 < y0 ? -1 : 1;
    const horiz = Math.abs(y1 - y0) < 1;
    const head = horiz ? `M${f1(x1 - 6)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * up)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * up)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['pipeline', 'dora', 'release', 'itsm'];
  const TITLE = ORDER.map((id) => TOP[D.topics.findIndex((t) => t.id === id)]);
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
  // the camera: CAM[si] = { from: [ox, oy, s], to: [ox, oy, s] }, the point (ox, oy) of the hall brought to the
  // middle of the hall's half of the stage (160, 200), at scale s
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- the cast of hall B: who stands there when. [scene, first beat]: present from that beat to the scene's end.
  // sponsor: the plant manager (who has the MES built, and chooses when line 3 sees the screen); devs: the IT team at the
  // MES table; lead: the team lead of line 3 (checks the screen in acceptance); crew: the two operators at line 3 (who
  // see the screen, and report a fault at the service desk)
  const FROM = {
    sponsor: [[0, 1], [3, 2], [5, 0]],
    devs: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],
    lead: [[3, 1], [5, 0]],
    crew: [[3, 2], [4, 0], [5, 0]],
  };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }

  // ---- the four topic tiles
  // the route (s1): four full-width rows with their title. "IT-servicemanagement en incidenten" has a word of 252
  // units, wider than the default 128-unit tile, so the film declares tileUnits (D.tileUnits, the room of its
  // narrowest title box, the closing grid's tile) and every title box wraps with it and holds three lines, as the
  // kit's checkLabels holds the titles (a renamed title redraws from the page data without a rebuild)
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = 50 + i * 82;
      const lines = wrap(t, D.tileUnits).slice(0, 3);
      let s = rect(330, y, 292, 78, 'pm-tile', 8);
      lines.forEach((l, j) => { s += txt(342, y + 47 - (lines.length - 1) * 12 + j * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- s1: the goal. The MES for the orders on the floor, with the screen of the rejected pieces that is the next
  // version, and who does what: the plant manager sponsors, you lead, the IT team builds and runs
  function goalCard(a) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Nieuwe MES-versie', 'New MES version', 262), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('met afgekeurde stuks', 'with rejected pieces', 262), 22, 'start', 'pm-txt');
    return op(a, s);
  }
  function teamCard(a) {
    const row = (i, who, what) => rect(334, 162 + i * 42, 284, 36, 'pm-badge', 6) + txt(346, 162 + i * 42 + 26, who, 22, 'start', 'pm-big') + txt(606, 162 + i * 42 + 26, what, 22, 'end', 'pm-txt');
    return op(a, row(0, tr('Plantmanager', 'Plant manager', 160), tr('sponsor', 'sponsor', 90)) + row(1, tr('Jij', 'You', 60), tr('leidt het project', 'lead the project', 190))
      + row(2, tr('IT-team', 'IT team', 100), tr('bouwt en draait', 'builds and runs', 190)));
  }

  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). Shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(330, y, 292, 34, 'pm-badge', 6) + txt(340, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(296, one)) : '', tool2B: b === at ? op(span(p, 0.25, 0.65), chip(338, two)) : '' };
  }

  // ---- s2: the pipeline. One change of the MES goes through the same steps (commit, build, tests, artefact, test
  // environment); a failing test stops the line, so the later steps do not happen.
  function pipeParts(b, p) {
    const names = [tr('Commit', 'Commit', 240), tr('Build', 'Build', 240), tr('Tests', 'Tests', 240), tr('Artefact', 'Artefact', 240), tr('Testomgeving', 'Test environment', 240)];
    const row = (i, cls, on) => rect(334, 92 + i * 38, 284, 32, cls, 6) + txt(372, 92 + i * 38 + 24, names[i], 22, 'start', on ? 'pm-on' : 'pm-txt') + `<circle class="pm-dot" cx="353" cy="${92 + i * 38 + 16}" r="6"/>`;
    let pipe = '';
    for (let i = 0; i < 5; i++) {
      if (i === 2 && b >= 2) continue;
      const a = b === 1 ? span(p, i * 0.14, i * 0.14 + 0.3) : b >= 2 && i > 2 ? 0.35 : 1;
      pipe += op(a, row(i, 'pm-card', false));
    }
    const tests = b >= 2 ? op(b === 2 ? span(p, 0.05, 0.4) : 1, row(2, 'pm-crit', true)) : '';
    const stop = b >= 2 ? op(b === 2 ? span(p, 0.4, 0.8) : 1, rect(536, 92 + 76 + 4, 74, 24, 'pm-rag-r', 5) + txt(573, 92 + 76 + 22, tr('Stop', 'Stop', 70), 22, 'middle', 'pm-on')) : '';
    return { pipeB: b === 0 ? '' : pipe, testsB: tests, stopB: stop, ...tools(b, p, 3, tr('Versiebeheer', 'Version control', 274), tr('Testpiramide', 'Test pyramid', 274)) };
  }

  // ---- s3: DORA. Two measures about speed, two about stability, and all four together.
  function doraParts(b, p) {
    const sp = [tr('Deployfrequentie', 'Deployment frequency', 262), tr('Doorlooptijd', 'Change lead time', 262)];
    const st = [tr('Faalpercentage', 'Change fail rate', 262), tr('Hersteltijd', 'Recovery time', 262)];
    const rows = (list, y0, cls, on) => list.map((n, i) => rect(334, y0 + i * 34, 284, 30, cls, 6) + txt(346, y0 + i * 34 + 22, n, 22, 'start', on ? 'pm-on' : 'pm-txt')).join('');
    const speed = txt(334, 112, tr('Snelheid', 'Speed', 260), 22, 'start', 'pm-mute') + rows(sp, 120, 'pm-card', false);
    const stab = txt(334, 214, tr('Stabiliteit', 'Stability', 260), 22, 'start', 'pm-mute') + rows(st, 222, 'pm-card', false);
    const all4 = rows(sp, 120, 'pm-crit', true) + rows(st, 222, 'pm-crit', true);
    return { speedB: b === 0 ? '' : b === 1 ? op(span(p, 0.1, 0.5), speed) : speed, stabB: b <= 1 ? '' : b === 2 ? op(span(p, 0.1, 0.5), stab) : stab,
      all4B: b >= 3 ? (b === 3 ? op(span(p, 0.1, 0.5), all4) : all4) : '',
      ...tools(b, p, 4, tr('Mediaan', 'Median', 274), tr('State of DevOps-rapport', 'State of DevOps report', 274)) };
  }

  // ---- s4: release and environment management. The four environments, with the team lead checking in acceptance;
  // installing (deploy) next to releasing with a switch that the plant chooses to turn on; a new version goes to one
  // line first, so a fault touches few lines.
  function relParts(b, p) {
    const names = [tr('Ontwikkeling', 'Development', 200), tr('Test', 'Test', 200), tr('Acceptatie', 'Acceptance', 200), tr('Productie', 'Production', 200)];
    let env = '';
    names.forEach((n, i) => { env += rect(334, 94 + i * 44, 284, 34, 'pm-card', 6) + txt(346, 94 + i * 44 + 25, n, 22, 'start', 'pm-txt'); });
    const acc = rect(334, 94 + 88, 284, 34, 'pm-crit', 6) + txt(346, 94 + 88 + 25, names[2], 22, 'start', 'pm-on') + txt(606, 94 + 88 + 25, tr('teamleider', 'team lead', 120), 22, 'end', 'pm-on');
    const dep = rect(334, 94, 284, 40, 'pm-card', 8) + txt(346, 122, tr('Installeren', 'Installing', 200), 22, 'start', 'pm-big')
      + `<path class="pm-arrow" d="M580 115L588 123L604 105"/>`;
    const sw = b === 2 ? span(p, 0.45, 0.85) : 1;
    const rel = rect(334, 144, 284, 40, 'pm-card', 8) + txt(346, 172, tr('Vrijgeven', 'Releasing', 160), 22, 'start', 'pm-big')
      + rect(548, 152, 58, 24, sw > 0.5 ? 'pm-crit' : 'pm-off', 12) + `<circle class="pm-dot" cx="${f1(lerp(560, 594, sw))}" cy="164" r="9"/>`
      + txt(334, 214, tr('Scherm voor lijn 3', 'Screen for line 3', 280), 22, 'start', 'pm-mute');
    const impact = rect(334, 100, 120, 44, 'pm-crit', 8) + txt(394, 130, tr('Lijn 3', 'Line 3', 100), 22, 'middle', 'pm-on') + arrow(460, 122, 494, 122)
      + rect(498, 100, 120, 44, 'pm-tile', 8) + txt(558, 130, tr('Lijn 4', 'Line 4', 100), 22, 'middle', 'pm-mute') + txt(334, 186, tr('Eerst één lijn', 'One line first', 280), 22, 'start', 'pm-mute');
    return { envB: b === 1 ? op(span(p, 0.05, 0.4), env) : '', acceptB: b === 1 ? op(span(p, 0.3, 0.7), acc) : '',
      depB: b === 2 ? op(span(p, 0.05, 0.4), dep) : '', relB: b === 2 ? op(span(p, 0.25, 0.6), rel) : '', impactB: b >= 3 ? op(b === 3 ? span(p, 0.1, 0.5) : 1, impact) : '',
      ...tools(b, p, 4, tr('Feature flag', 'Feature flag', 274), tr('Rollbackplan', 'Rollback plan', 274)) };
  }

  // ---- s5: IT service management and incidents. The MES stops: the operators call the service desk, the goal is to work
  // again (an incident); the same fault again and again has a cause to find (a problem); an agreement on how fast to
  // respond and fix, with a priority (a line that is down before an office printer); a blameless post-mortem.
  function itParts(b, p) {
    const inc = rect(334, 94, 284, 36, 'pm-card', 6) + txt(346, 119, tr('MES valt stil', 'MES stops', 230), 22, 'start', 'pm-txt') + `<circle class="pm-rag-r" cx="600" cy="112" r="8"/>`
      + arrow(476, 134, 476, 152) + rect(334, 154, 284, 36, 'pm-tile', 6) + txt(346, 179, tr('Servicedesk', 'Service desk', 262), 22, 'start', 'pm-txt')
      + arrow(476, 194, 476, 212) + rect(334, 214, 284, 36, 'pm-crit', 6) + txt(346, 239, tr('Weer werken', 'Working again', 262), 22, 'start', 'pm-on');
    let prob = '';
    for (let i = 0; i < 3; i++) prob += rect(334 + i * 98, 100, 88, 40, 'pm-card', 6) + `<circle class="pm-rag-r" cx="${f1(378 + i * 98)}" cy="120" r="8"/>`;
    prob += txt(334, 168, tr('Zelfde storing', 'Same fault', 280), 22, 'start', 'pm-mute') + arrow(476, 178, 476, 198) + rect(334, 200, 284, 40, 'pm-crit', 6) + txt(346, 227, tr('Oorzaak zoeken', 'Find the cause', 262), 22, 'start', 'pm-on');
    const bar = (y, label, w2, cls) => txt(334, y + 18, label, 22, 'start', 'pm-txt') + rect(470, y, w2, 24, cls, 5);
    const prio = (y, label, n, cls, on) => rect(334, y, 284, 30, cls, 6) + txt(346, y + 22, label, 22, 'start', on ? 'pm-on' : 'pm-txt') + `<circle class="pm-dot" cx="598" cy="${y + 15}" r="12"/>` + txt(598, y + 23, n, 22, 'middle', 'pm-big');
    const sla = rect(334, 94, 284, 36, 'pm-card', 6) + txt(346, 119, tr('SLA', 'SLA', 100), 22, 'start', 'pm-big') + txt(606, 119, tr('afspraak', 'agreement', 150), 22, 'end', 'pm-mute')
      + bar(144, tr('Reactie', 'Response', 120), 60, 'pm-badge') + bar(180, tr('Oplossing', 'Resolution', 120), 148, 'pm-badge')
      + prio(220, tr('Lijn staat stil', 'Line is down', 210), '1', 'pm-crit', true) + prio(256, tr('Kantoorprinter', 'Office printer', 210), '4', 'pm-card', false);
    let pm = '';
    [tr('Tijdlijn', 'Timeline', 240), tr('Oorzaken', 'Causes', 240), tr('Acties met eigenaar', 'Actions with an owner', 262)].forEach((n, i) => { pm += rect(334, 94 + i * 40, 284, 34, 'pm-card', 6) + txt(346, 94 + i * 40 + 25, n, 22, 'start', 'pm-txt'); });
    pm += rect(334, 220, 284, 34, 'pm-crit', 6) + txt(346, 245, tr('Schuldvrij', 'Blameless', 240), 22, 'start', 'pm-on');
    return { incB: b === 1 ? op(span(p, 0.1, 0.5), inc) : '', probB: b === 2 ? op(span(p, 0.1, 0.5), prob) : '', slaB: b === 3 ? op(span(p, 0.1, 0.5), sla) : '',
      pmB: b >= 4 ? (b === 4 ? op(span(p, 0.1, 0.5), pm) : pm) : '',
      ...tools(b, p, 5, tr('Prioriteitsmatrix', 'Priority matrix', 274), tr('A3', 'A3', 274)) };
  }

  // ---- s6: one whole. The four topics in a row, and what they give together: small and often, fast and stable.
  function wholeParts(b, p) {
    const rows = [tr('Pipeline: de weg', 'Pipeline: the route', 262), tr('DORA: de meting', 'DORA: measuring', 262), tr('Uitrol: veilig', 'Roll-out: safely', 262), tr('Incidenten: vangnet', 'Incidents: safety net', 262)];
    let whole = '';
    rows.forEach((n, i) => {
      whole += rect(334, 94 + i * 46, 284, 36, 'pm-card', 6) + txt(346, 119 + i * 46, n, 22, 'start', 'pm-txt');
      if (i) whole += arrow(476, 94 + i * 46 - 10, 476, 94 + i * 46);
    });
    const dec = rect(334, 290, 284, 62, 'pm-crit', 8) + txt(346, 316, tr('Klein en vaak', 'Small and often', 260), 22, 'start', 'pm-on')
      + txt(346, 342, tr('snel en stabiel', 'fast and stable', 260), 22, 'start', 'pm-on');
    return { wholeB: op(b === 0 ? span(p, 0, 0.5) : 1, whole), decisionB: op(b >= 1 ? span(p, 0, 0.5) : 0, dec) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with DevOps en levering lit, then zoomed to it; then the module's four topics, each with its four levels as
  // columns (the words the app uses for the levels), the start marker on the first level of the first topic.
  const MAP0 = { s: 0.77, x: 73.6, y: 0 };
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
  const gridY = (i) => 70 + i * 82;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], l1: '', l2: '', l3: '', l4: '', st: '' };
    const lv = ['l1', 'l2', 'l3', 'l4'];
    LW.forEach((w, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, w, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      const lines = wrap(t, D.tileUnits).slice(0, 3);
      let s = rect(20, y, GRID.tile, 78, 'pm-tile', 8);
      lines.forEach((l, j) => { s += txt(26, y + 46 - (lines.length - 1) * 12 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }


  const KEYS = ['goalB', 'teamB', 'pipeB', 'testsB', 'stopB', 'speedB', 'stabB', 'all4B', 'envB', 'acceptB', 'depB', 'relB', 'impactB', 'incB', 'probB', 'slaB', 'pmB', 'tool1B', 'tool2B', 'wholeB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 6;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = tr('Het MES', 'The MES');
      o.goalB = b >= 2 ? '' : goalCard(b === 0 ? span(p, 0.05, 0.4) : 1);
      o.teamB = b === 1 ? teamCard(span(p, 0.1, 0.5)) : '';
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Pipeline', 'Pipeline'), tr('DORA', 'DORA'), tr('Release', 'Release'), tr('Incidenten', 'Incidents')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, pipeParts(b, p));
    if (si === 2) { Object.assign(o, doraParts(b, p)); lab = tr('schema', 'diagram'); }
    if (si === 3) Object.assign(o, relParts(b, p));
    if (si === 4) Object.assign(o, itParts(b, p));
    if (si === 5) {
      title = tr('Eén geheel', 'One whole');
      lab = tr('schema', 'diagram');
      Object.assign(o, wholeParts(b, p));
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
        o.r = m.r; o.l1 = m.l1; o.l2 = m.l2; o.l3 = m.l3; o.l4 = m.l4; o.st = b >= 2 ? m.st : '';
        title = '';
        lab = '';
      }
    }
    show(E.mapG, mapA);
    show(E.hud, hudA);
    if (E.pbg.__v !== pbg) { for (const kv of pbg.split(' ')) { const [k, v] = kv.split('='); E.pbg.setAttribute(k, v.replace(/"/g, '')); } E.pbg.__v = pbg; }
    const head = closing && b > 0 ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    ['r0', 'r1', 'r2', 'r3'].forEach((k2, i) => set(E[k2], o.r[i]));
    for (const k2 of KEYS) set(E[k2], o[k2]);
  }

  return { render };
})();
