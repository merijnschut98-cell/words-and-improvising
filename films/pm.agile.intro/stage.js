// The stage of the module intro film "Het MES in korte rondes / The MES in short rounds": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, as in
// field film 4 (films/pm.field.it): line 3 on its floor, line 4, the power cabinet
// and its cable, the switchboard on the wall, the new MES as a laptop on the table
// at the front, and a cast that changes per topic (the sponsor, the IT team, the
// team lead as Product Owner, the operators). The panel at the right draws each
// step as a schema, labelled "voorbeeld" (the MES in use) or "schema". Every part a
// sentence lights is a static data-cue group (build.mjs); this script only fills
// the panel and shows or hides the room's moving parts.
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
  const dia = (x, y, s = 9, cls = 'pm-dia') => `<path class="${cls}" d="M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z"/>`;
  const arrow = (x0, y0, x1, y1) => {
    const up = y1 < y0 ? -1 : 1;
    const horiz = Math.abs(y1 - y0) < 1;
    const head = horiz ? `M${f1(x1 - 6)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * up)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * up)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['mindset', 'scrum', 'backlog', 'kanban'];
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
  // sponsor: the plant manager; devs and sm: the IT team (Developers and Scrum Master) at the MES table; lead: the
  // team lead of line 3, the Product Owner; crew: the two operators at line 3
  const FROM = {
    sponsor: [[0, 1]],
    devs: [[0, 1], [1, 2], [2, 0], [3, 0], [4, 1], [5, 0]],
    sm: [[2, 3], [5, 0]],
    lead: [[2, 2], [3, 1], [5, 0]],
    crew: [[1, 1], [4, 0], [5, 0]],
  };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things of the room do not change in this module: line 3 stands in its place, the switchboard hangs on the
  // wall and the power is connected (the work of the modules before); the MES is the laptop on the table
  function things() {
    show(E.line3S, 1);
    show(E.swS, 1);
    show(E.swG, 0);
    show(E.cabOn, 1);
    show(E.cabOff, 0);
  }

  // ---- the four topic tiles
  // the route (s1): four full-width rows, each with its number and its title. The index title "Scrum: rollen,
  // events en artefacten" wraps to four lines in the default 128-unit tile, so the film declares tileUnits (D.tileUnits,
  // the room of its narrowest title box, the closing grid's tile) and every title box wraps with it and holds three
  // lines, as the kit's checkLabels holds the titles (a renamed title redraws from the page data without a rebuild)
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = 50 + i * 82;
      const lines = wrap(t, D.tileUnits).slice(0, 3);
      let s = rect(334, y, 284, 78, 'pm-tile', 8) + `<circle class="pm-dot" cx="360" cy="${y + 39}" r="16"/>` + txt(360, y + 47, String(i + 1), 22, 'middle', 'pm-on');
      lines.forEach((l, j) => { s += txt(386, y + 47 - (lines.length - 1) * 12 + j * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- s1: the goal. The MES for the orders on the floor, and who does what: the plant manager sponsors, you lead,
  // the IT team builds
  function goalCard(a) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Nieuw MES voor lijn 3', 'New MES for line 3', 262), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('de orders op de vloer', 'the orders on the floor', 262), 22, 'start', 'pm-txt');
    return op(a, s);
  }
  function teamCard(a) {
    const row = (i, who, what) => rect(334, 162 + i * 42, 284, 36, 'pm-badge', 6) + txt(346, 162 + i * 42 + 26, who, 22, 'start', 'pm-big') + txt(606, 162 + i * 42 + 26, what, 22, 'end', 'pm-txt');
    return op(a, row(0, tr('Plantmanager', 'Plant manager', 160), tr('sponsor', 'sponsor', 90)) + row(1, tr('Jij', 'You', 60), tr('leidt het project', 'lead the project', 190))
      + row(2, tr('IT-team', 'IT team', 100), tr('bouwt het MES', 'builds the MES', 190)));
  }

  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). a: the scene's two labels; shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(296, one)) : '', tool2B: b === at ? op(span(p, 0.25, 0.65), chip(338, two)) : '' };
  }

  // ---- s2: the agile mindset. The waterfall: the operators see the MES for the first time at the end. Short
  // rounds: each one a small piece that works. The loop: the operators try it and the team adjusts.
  function mindParts(b, p) {
    const wf = txt(334, 108, tr('Watervalaanpak', 'Waterfall', 284), 22, 'start', 'pm-mute') + rect(334, 118, 284, 36, 'pm-bar', 6)
      + txt(346, 143, tr('Bouwen, dan tonen', 'Build, then show', 262), 22, 'start', 'pm-txt')
      + dia(606, 176, 9, 'pm-dia') + txt(588, 183, tr('eerste keer zien', 'first look', 240), 22, 'end', 'pm-mute');
    let rounds = txt(334, 222, tr('Korte rondes', 'Short rounds', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 5; i++) {
      const a = b === 2 ? span(p, i * 0.14, i * 0.14 + 0.3) : 1;
      rounds += op(a, rect(334 + i * 59, 232, 50, 34, 'pm-card', 6) + dia(334 + i * 59 + 25, 249, 9, 'pm-dia'));
    }
    const loop = rect(334, 278, 136, 34, 'pm-tile', 6) + txt(402, 302, tr('Proberen', 'Try it', 124), 22, 'middle', 'pm-txt') + arrow(474, 295, 494, 295)
      + rect(498, 278, 120, 34, 'pm-crit', 6) + txt(558, 302, tr('Bijsturen', 'Adjust', 108), 22, 'middle', 'pm-on');
    return { wfB: op(b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.5) : 1, wf), roundsB: op(b <= 1 ? 0 : b === 2 ? 1 : 1, rounds), loopB: b === 3 ? op(span(p, 0.1, 0.5), loop) : '',
      ...tools(b, p, 4, tr('Agile Manifesto', 'Agile Manifesto', 260), tr('Hybride aanpak', 'Hybrid approach', 260)) };
  }

  // ---- s3: Scrum. A sprint of two weeks (ten workdays) with something usable at the end, and the three
  // accountabilities: Product Owner (what comes first), Scrum Master (helps, clears obstacles), Developers (build).
  function scrumParts(b, p) {
    let sprint = rect(334, 94, 284, 40, 'pm-card', 8) + txt(346, 122, tr('Sprint van twee weken', 'Sprint of two weeks', 262), 22, 'start', 'pm-big');
    for (let i = 0; i < 10; i++) sprint += rect(334 + i * 29, 142, 24, 14, i === 9 ? 'pm-crit' : 'pm-tile', 3);
    const role = (i, who, what, lit) => rect(334, 168 + i * 42, 284, 36, lit ? 'pm-crit' : 'pm-card', 6) + txt(346, 168 + i * 42 + 26, who, 22, 'start', lit ? 'pm-on' : 'pm-big') + txt(606, 168 + i * 42 + 26, what, 22, 'end', lit ? 'pm-on' : 'pm-txt');
    const po = role(0, tr('Product Owner', 'Product Owner', 170), tr('eerst', 'first', 90), b === 2);
    const smr = role(1, tr('Scrum Master', 'Scrum Master', 170), tr('helpt', 'helps', 90), b === 3);
    const dvr = role(2, tr('Developers', 'Developers', 170), tr('bouwen', 'build', 90), b === 3);
    return { sprintB: op(b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.5) : 1, sprint), poB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, po),
      smB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.4) : 1) : 0, smr), dvB: op(b >= 3 ? (b === 3 ? span(p, 0.2, 0.6) : 1) : 0, dvr),
      ...tools(b, p, 4, tr('Daily Scrum', 'Daily Scrum', 260), tr('Sprint Review', 'Sprint Review', 260)) };
  }

  // ---- s4: backlog and estimating. One list in order of value (the MES's own parts: orders per line, what is
  // made, what is rejected), relative sizes, and an honest end date: a range with a probability, not one date.
  function backParts(b, p) {
    const items = [tr('Orders per lijn', 'Orders per line', 230), tr('Wat is gemaakt', 'What is made', 230), tr('Wat is afgekeurd', 'What is rejected', 230)];
    let list = '';
    items.forEach((t, i) => {
      list += rect(334, 94 + i * 32, 284, 30, i === 0 && b === 1 ? 'pm-crit' : 'pm-card', 6) + `<circle class="pm-dot" cx="354" cy="${109 + i * 32}" r="11"/>` + txt(354, 116 + i * 32, String(i + 1), 22, 'middle', 'pm-mute')
        + txt(376, 117 + i * 32, t, 22, 'start', i === 0 && b === 1 ? 'pm-on' : 'pm-txt');
    });
    let size = rect(334, 226, 24, 24, 'pm-card', 4) + rect(366, 214, 36, 36, 'pm-card', 4) + rect(410, 196, 54, 54, 'pm-card', 4)
      + txt(480, 229, tr('vergelijken', 'comparing', 138), 22, 'start', 'pm-mute');
    const range = rect(334, 258, 284, 30, 'pm-tile', 6) + rect(420, 258, 150, 30, 'pm-range', 6) + txt(495, 280, tr('bandbreedte', 'range', 140), 22, 'middle', 'pm-txt');
    return { listB: op(b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.5) : 1, list), sizeB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.5) : 1) : 0, size), rangeB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.5) : 1) : 0, range),
      ...tools(b, p, 4, tr('User story', 'User story', 260), tr('Planning poker', 'Planning poker', 260)) };
  }

  // ---- s5: Kanban and flow. A board with three columns; a card (a wish or a fault from the floor) moves from left to
  // right; one card is blocked; the time from start to done is the cycle time.
  const COLX = [334, 430, 526];
  function kanbanParts(b, p) {
    const names = [tr('Open', 'Open', 84), tr('Bezig', 'Doing', 84), tr('Klaar', 'Done', 84)];
    let board = '';
    names.forEach((n, i) => { board += rect(COLX[i], 94, 92, 168, 'pm-tile', 6) + txt(COLX[i] + 46, 120, n, 22, 'middle', 'pm-mute'); });
    const card = (x, y, cls) => rect(x, y, 76, 28, cls || 'pm-card', 5);
    // the cards: two waiting, one in progress that is blocked from the second beat, one that is done; a moving card
    // slides from the first column to the last during the first beat
    board += card(342, 134) + card(342, 168);
    board += card(438, 134, b >= 2 ? 'pm-crit' : 'pm-card');
    if (b >= 2) board += txt(476, 156, '!', 22, 'middle', 'pm-on');
    board += card(534, 134);
    const mx = b === 1 ? lerp(342, 534, span(p, 0.2, 0.9)) : b === 0 ? 342 : 342;
    if (b === 1) board += card(mx, 202, 'pm-crit');
    else board += card(342, 202);
    const cards = op(b === 0 ? 0 : 1, board);
    const blocked = b === 2 ? op(span(p, 0.1, 0.5), txt(476, 292, tr('Geblokkeerd', 'Blocked', 150), 22, 'middle', 'pm-txt')) : '';
    const cycle = b === 3 ? op(span(p, 0.1, 0.55), arrow(344, 280, 606, 280) + txt(475, 304, tr('Cycle time', 'Cycle time', 200), 22, 'middle', 'pm-txt')) : '';
    return { boardB: cards, blockB: blocked, cycleB: cycle,
      ...tools(b, p, 4, tr('Kanbanbord', 'Kanban board', 260), tr('WIP-limiet', 'WIP limit', 260)) };
  }

  // ---- s6: one whole. The four topics in a row, and the pair that can stand side by side.
  function flowParts(b, p) {
    const rows = [tr('Agile: de reden', 'Agile: the reason', 262), tr('Scrum: het ritme', 'Scrum: the rhythm', 262), tr('Backlog: de volgorde', 'Backlog: the order', 262), tr('Kanban: de stroom', 'Kanban: the flow', 262)];
    let flow = '';
    rows.forEach((n, i) => {
      flow += rect(334, 94 + i * 46, 284, 36, 'pm-card', 6) + txt(346, 119 + i * 46, n, 22, 'start', 'pm-txt');
      if (i) flow += arrow(476, 94 + i * 46 - 10, 476, 94 + i * 46);
    });
    const dec = rect(334, 290, 284, 62, 'pm-crit', 8) + txt(346, 316, tr('Scrum en Kanban', 'Scrum and Kanban', 260), 22, 'start', 'pm-on')
      + txt(346, 342, tr('ook naast elkaar', 'also side by side', 260), 22, 'start', 'pm-on');
    return { flowB: op(b === 0 ? span(p, 0, 0.5) : 1, flow), decisionB: op(b >= 1 ? span(p, 0, 0.5) : 0, dec) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with Agile and Scrum lit, then zoomed to it; then the module's four topics, each with its four levels as
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
      let s = rect(20, y, GRID.tile, 78, 'pm-tile', 8);
      wrap(t, D.tileUnits).slice(0, 3).forEach((l, j) => { s += txt(26, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }


  const KEYS = ['goalB', 'teamB', 'wfB', 'roundsB', 'loopB', 'sprintB', 'poB', 'smB', 'dvB', 'listB', 'sizeB', 'rangeB', 'boardB', 'blockB', 'cycleB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    things();
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
      title = [tr('Agile', 'Agile'), tr('Scrum', 'Scrum'), tr('Backlog', 'Backlog'), tr('Kanban', 'Kanban')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) { Object.assign(o, mindParts(b, p)); lab = tr('schema', 'diagram'); }
    if (si === 2) { Object.assign(o, scrumParts(b, p)); lab = tr('schema', 'diagram'); }
    if (si === 3) Object.assign(o, backParts(b, p));
    if (si === 4) Object.assign(o, kanbanParts(b, p));
    if (si === 5) {
      title = tr('Eén geheel', 'One whole');
      lab = tr('schema', 'diagram');
      Object.assign(o, flowParts(b, p));
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
