// The stage of the module intro film "Eén MES, meer teams / One MES, more teams": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, as in
// field film 4 (films/pm.field.it): line 3 on its floor, line 4, the power cabinet
// and its cable, the switchboard on the wall, the new MES as a laptop on the table
// at the front, the weighing scales of the lines (the hardware topic), and a cast that changes per
// topic (the plant manager, the first IT team, a second IT team). The panel at the right draws each
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
  const ORDER = ['safe', 'portfolio', 'alternatives', 'hybrid'];
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
  // sponsor: the plant manager; devs: the first IT team (two Developers) at the MES table; team2: the second IT team
  const FROM = {
    sponsor: [[0, 1], [2, 0], [4, 2]],
    devs: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],
    team2: [[0, 1], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],
  };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things of the room do not change in this module: line 3 stands in its place, the switchboard hangs on the
  // wall and the power is connected (the work of the modules before); the MES is the laptop on the table. Only the
  // scales of the lines appear, in the hardware topic.
  function things(si, b, p) {
    show(E.line3S, 1);
    show(E.swS, 1);
    show(E.swG, 0);
    show(E.cabOn, 1);
    show(E.cabOff, 0);
    show(E.hw, si === 4 && b >= 1 ? (b === 1 ? span(p, 0, 0.5) : 1) : 0);
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

  // ---- s1: the goal. The MES for the orders on the floor, now for more lines, and who does what: the plant manager
  // sponsors, you lead, the IT teams build
  function goalCard(a) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Nieuw MES', 'New MES', 262), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('voor meer lijnen', 'for more lines', 262), 22, 'start', 'pm-txt');
    return op(a, s);
  }
  function teamCard(a) {
    const row = (i, who, what) => rect(334, 162 + i * 42, 284, 36, 'pm-badge', 6) + txt(346, 162 + i * 42 + 26, who, 22, 'start', 'pm-big') + txt(606, 162 + i * 42 + 26, what, 22, 'end', 'pm-txt');
    return op(a, row(0, tr('Plantmanager', 'Plant manager', 160), tr('sponsor', 'sponsor', 90)) + row(1, tr('Jij', 'You', 60), tr('leidt het project', 'lead the project', 190))
      + row(2, tr('Teams', 'Teams', 100), tr('bouwen het MES', 'build the MES', 190)));
  }

  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). a: the scene's two labels; shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(306, one)) : '', tool2B: b === at ? op(span(p, 0.25, 0.65), chip(346, two)) : '' };
  }
  // a step that appears in beat `at` and stays: 0 before, a fade in during it, 1 after
  const from = (b, p, at, lo = 0, hi = 0.5) => (b < at ? 0 : b === at ? span(p, lo, hi) : 1);

  // ---- s2: SAFe basics. Team A waits for team B (a dependency); the teams on one train that stays together; one
  // fixed rhythm for all of them (five rounds).
  function safeParts(b, p) {
    const dep = rect(334, 98, 118, 34, 'pm-card', 6) + txt(393, 122, tr('Team A', 'Team A', 106), 22, 'middle', 'pm-txt') + arrow(458, 115, 492, 115)
      + rect(498, 98, 120, 34, 'pm-card', 6) + txt(558, 122, tr('Team B', 'Team B', 108), 22, 'middle', 'pm-txt')
      + txt(476, 158, tr('A wacht op B', 'A waits for B', 284), 22, 'middle', 'pm-mute');
    let train = txt(334, 192, tr('Agile Release Train', 'Agile Release Train', 284), 22, 'start', 'pm-mute') + rect(334, 232, 284, 6, 'pm-bar', 3);
    ['A', 'B', 'C', 'D'].forEach((t, i) => { train += rect(334 + i * 74, 200, 62, 30, 'pm-card', 6) + txt(365 + i * 74, 223, t, 22, 'middle', 'pm-txt'); });
    let cad = txt(334, 264, tr('Eén vast ritme', 'One fixed rhythm', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 5; i++) cad += op(b === 3 ? span(p, i * 0.12, i * 0.12 + 0.3) : 1, rect(334 + i * 58.5, 270, 50, 22, 'pm-tile', 5));
    return { depB: op(from(b, p, 1), dep), trainB: op(from(b, p, 2), train), cadB: b >= 3 ? cad : '',
      ...tools(b, p, 4, tr('PI Planning', 'PI Planning', 260), tr('ART Planning Board', 'ART Planning Board', 260)) };
  }

  // ---- s3: portfolio and Lean budgets. All development of the plant is the portfolio (the MES is one of the items);
  // a project has its own budget, the train has a fixed budget; a few strategic themes give the direction.
  function portParts(b, p) {
    const items = [tr('Nieuw MES', 'New MES', 230), tr('Verbeteringen', 'Improvements', 230), tr('Nieuwe producten', 'New products', 230)];
    let list = '';
    items.forEach((t, i) => { list += rect(334, 94 + i * 32, 284, 30, i === 0 ? 'pm-crit' : 'pm-card', 6) + txt(346, 117 + i * 32, t, 22, 'start', i === 0 ? 'pm-on' : 'pm-txt'); });
    const row = (y, who, what, cls) => rect(334, y, 284, 32, cls, 6) + txt(346, y + 24, who, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(606, y + 24, what, 22, 'end', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');
    const fund = row(196, tr('Project', 'Project', 110), tr('eigen budget', 'own budget', 150), 'pm-out') + row(234, tr('Trein', 'Train', 110), tr('vast budget', 'fixed budget', 150), 'pm-crit');
    const themes = rect(334, 270, 284, 30, 'pm-tile', 6) + txt(346, 293, tr('Thema’s: de richting', 'Themes: the direction', 262), 22, 'start', 'pm-txt');
    return { plistB: op(from(b, p, 1), list), fundB: op(from(b, p, 2), fund), themesB: op(from(b, p, 3), themes),
      ...tools(b, p, 4, tr('Lean business case', 'Lean business case', 260), tr('WSJF', 'WSJF', 260)) };
  }

  // ---- s4: alternatives and criticism. The options (SAFe, LeSS, Nexus); LeSS takes things away: three teams, one
  // backlog and one Product Owner; a feature team builds a customer function from start to finish.
  function altParts(b, p) {
    const chip = (i, t, lit) => rect(334 + i * 97, 94, 90, 34, lit ? 'pm-crit' : 'pm-tile', 6) + txt(379 + i * 97, 118, t, 22, 'middle', lit ? 'pm-on' : 'pm-txt');
    const opts = chip(0, tr('SAFe', 'SAFe', 80), false) + chip(1, tr('LeSS', 'LeSS', 80), b >= 1) + chip(2, tr('Nexus', 'Nexus', 80), false);
    let less = '';
    for (let i = 0; i < 3; i++) less += rect(334 + i * 38, 144, 30, 30, 'pm-card', 5);
    less += arrow(446, 159, 462, 159) + rect(466, 142, 152, 34, 'pm-card', 6) + txt(542, 166, tr('Eén backlog', 'One backlog', 140), 22, 'middle', 'pm-txt')
      + rect(334, 186, 284, 32, 'pm-badge', 6) + txt(346, 210, tr('Eén Product Owner', 'One Product Owner', 262), 22, 'start', 'pm-big');
    const feat = rect(334, 228, 284, 62, 'pm-crit', 8) + txt(346, 254, tr('Feature team', 'Feature team', 262), 22, 'start', 'pm-on') + txt(346, 280, tr('begin tot eind', 'start to finish', 262), 22, 'start', 'pm-on');
    return { optsB: op(b === 0 ? span(p, 0.1, 0.5) : 1, opts), lessB: op(from(b, p, 1), less), featB: op(from(b, p, 2), feat),
      ...tools(b, p, 3, tr('Sprint Planning One', 'Sprint Planning One', 260), tr('Cross-Team Refinement', 'Cross-Team Refinement', 270)) };
  }

  // ---- s5: hybrid, stage-gate plus agile. Hardware: the cost of a change rises; stages with a gate between them;
  // sprints inside each stage.
  function hybParts(b, p) {
    let cost = txt(334, 104, tr('Wat een wijziging kost', 'What a change costs', 284), 22, 'start', 'pm-mute');
    [14, 28, 44, 60].forEach((h, i) => { cost += rect(334 + i * 76, 178 - h, 56, h, i === 3 ? 'pm-crit' : 'pm-card', 5); });
    let stages = txt(334, 214, tr('Fases en gates', 'Stages and gates', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 3; i++) stages += rect(334 + i * 102, 222, 80, 36, 'pm-card', 6);
    stages += dia(425, 240, 9) + dia(527, 240, 9);
    let sprints = txt(334, 282, tr('Sprints in elke fase', 'Sprints in each stage', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) sprints += rect(334 + i * 102 + 9 + j * 22, 231, 16, 18, 'pm-tile', 3);
    return { costB: op(from(b, p, 1), cost), stagesB: op(from(b, p, 2), stages), sprintsB: op(from(b, p, 3), sprints),
      ...tools(b, p, 4, tr('Terugplannen', 'Backward planning', 260), tr('Design freeze', 'Design freeze', 260)) };
  }

  // ---- s6: one whole. The four topics in a row, and what scaling means.
  function flowParts(b, p) {
    const rows = [tr('SAFe: de trein', 'SAFe: the train', 262), tr('Portfolio: de volgorde', 'Portfolio: the order', 262), tr('Alternatief: andere weg', 'Options: other ways', 262), tr('Hybride: de hardware', 'Hybrid: the hardware', 262)];
    let flow = '';
    rows.forEach((n, i) => {
      flow += rect(334, 94 + i * 46, 284, 36, 'pm-card', 6) + txt(346, 119 + i * 46, n, 22, 'start', 'pm-txt');
      if (i) flow += arrow(476, 94 + i * 46 - 10, 476, 94 + i * 46);
    });
    const dec = rect(334, 290, 284, 62, 'pm-crit', 8) + txt(346, 316, tr('Veel teams', 'Many teams', 260), 22, 'start', 'pm-on')
      + txt(346, 342, tr('als één geheel', 'as one whole', 260), 22, 'start', 'pm-on');
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


  const KEYS = ['goalB', 'teamB', 'depB', 'trainB', 'cadB', 'plistB', 'fundB', 'themesB', 'optsB', 'lessB', 'featB', 'costB', 'stagesB', 'sprintsB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    things(si, b, p);
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
      title = [tr('SAFe', 'SAFe'), tr('Portfolio', 'Portfolio'), tr('Alternatieven', 'Alternatives'), tr('Hybride', 'Hybrid')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) { Object.assign(o, safeParts(b, p)); lab = tr('schema', 'diagram'); }
    if (si === 2) Object.assign(o, portParts(b, p));
    if (si === 3) { Object.assign(o, altParts(b, p)); lab = tr('schema', 'diagram'); }
    if (si === 4) Object.assign(o, hybParts(b, p));
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
