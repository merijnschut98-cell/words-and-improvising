// The stage of the module intro film "Het MES kiezen en invoeren / Choosing and introducing the MES": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, as in
// field film 4 (films/pm.field.it): line 3 on its floor, line 4, the power cabinet
// and its cable, the switchboard on the wall, the new MES as a laptop on the table
// at the front, and a cast that changes per topic (the sponsor, the IT team, the
// team lead of line 3 as a key user, the operators). The panel at the right draws each
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
  const ORDER = ['scope', 'vendor', 'golive', 'adoption'];
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
  // sponsor: the plant manager; devs: the IT team at the MES table; lead: the team lead of line 3, who knows the work
  // (he helps write the requirements and tests as a key user); crew: the two operators at line 3
  const FROM = {
    sponsor: [[0, 1], [5, 1]],
    devs: [[0, 1], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],
    lead: [[1, 2], [4, 2], [5, 0]],
    crew: [[3, 2], [4, 4], [5, 0]],
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
  // the route (s1): four full-width rows, each with its title (no number: the English title needs the room of the row). The index title "ERP/MES invoeren: van migratie
  // tot hypercare" wraps to four lines in the default 128-unit tile, so the film declares tileUnits (D.tileUnits,
  // the room of its narrowest title box, the closing grid's tile) and every title box wraps with it and holds three
  // lines, as the kit's checkLabels holds the titles (a renamed title redraws from the page data without a rebuild)
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = 50 + i * 82;
      const lines = wrap(t, D.tileUnits).slice(0, 3);
      let s = rect(334, y, 284, 78, 'pm-tile', 8);
      lines.forEach((l, j) => { s += txt(346, y + 47 - (lines.length - 1) * 12 + j * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- s1: the goal. The MES for the orders on the floor, and who does what: the plant manager sponsors, you lead,
  // the IT team takes part
  function goalCard(a) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Nieuw MES voor lijn 3', 'New MES for line 3', 262), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('de orders op de vloer', 'the orders on the floor', 262), 22, 'start', 'pm-txt');
    return op(a, s);
  }
  function teamCard(a) {
    const row = (i, who, what) => rect(334, 162 + i * 42, 284, 36, 'pm-badge', 6) + txt(346, 162 + i * 42 + 26, who, 22, 'start', 'pm-big') + txt(606, 162 + i * 42 + 26, what, 22, 'end', 'pm-txt');
    return op(a, row(0, tr('Plantmanager', 'Plant manager', 160), tr('sponsor', 'sponsor', 90)) + row(1, tr('Jij', 'You', 60), tr('leidt het project', 'lead the project', 190))
      + row(2, tr('IT-team', 'IT team', 100), tr('bouwt het uit', 'builds on it', 190)));
  }

  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). a: the scene's two labels; shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 32, 'pm-badge', 6) + txt(346, y + 24, label, 22, 'start', 'pm-txt');
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(300, one)) : '', tool2B: b === at ? op(span(p, 0.25, 0.65), chip(340, two)) : '' };
  }

  // ---- s2: requirements and scope. One requirement (what the MES must do, written so you can check it), written with the
  // people who know the work, then a list that does not fit the first version: what must be in at go-live and what may wait.
  function reqParts(b, p) {
    let req = rect(334, 94, 284, 64, 'pm-card', 8) + txt(346, 122, tr('Afgekeurde stuks tonen', 'Show rejected pieces', 262), 22, 'start', 'pm-big')
      + txt(346, 148, tr('controleerbaar', 'checkable', 262), 22, 'start', 'pm-mute');
    let who = rect(334, 170, 284, 36, 'pm-badge', 6) + txt(346, 196, tr('Teamleider lijn 3', 'Team lead line 3', 262), 22, 'start', 'pm-big')
      + txt(346, 232, tr('kent het werk', 'knows the work', 262), 22, 'start', 'pm-mute');
    const row = (y, t, cls) => rect(334, y, 284, 30, cls, 6) + txt(346, y + 22, t, 22, 'start', 'pm-txt');
    let list = txt(334, 120, tr('Bij de go-live', 'At go-live', 284), 22, 'start', 'pm-mute') + row(128, tr('Orders per lijn', 'Orders per line', 262), 'pm-crit').replace('pm-txt', 'pm-on')
      + row(162, tr('Afgekeurde stuks', 'Rejected pieces', 262), 'pm-crit').replace('pm-txt', 'pm-on')
      + `<path class="pm-dash" d="M334 203L618 203"/>` + txt(334, 226, tr('Later', 'Later', 284), 22, 'start', 'pm-mute')
      + row(232, tr('Rapport per ploeg', 'Report per shift', 262), 'pm-card') + row(266, tr('Mooi dashboard', 'Nice dashboard', 262), 'pm-card');
    return { reqB: b === 1 ? op(span(p, 0.1, 0.5), req) : b === 2 ? req + op(span(p, 0.1, 0.5), who) : '', listB: b >= 3 ? (b === 3 ? op(span(p, 0.1, 0.5), list) : list) : '',
      ...tools(b, p, 4, tr('MoSCoW', 'MoSCoW', 260), tr('To-be-proces', 'To-be process', 260)) };
  }

  // ---- s3: the vendor. Build, buy or rent (SaaS); the vendor makes the package, the partner sets it up, our IT team builds on it and runs it, and we write down who does what;
  // the tools of choosing are named, not explained.
  function vendorParts(b, p) {
    const opt = (i, t, lit) => rect(334, 94 + i * 40, 284, 34, lit ? 'pm-crit' : 'pm-card', 6) + txt(346, 94 + i * 40 + 25, t, 22, 'start', lit ? 'pm-on' : 'pm-txt');
    const options = opt(0, tr('Zelf bouwen', 'Build it', 262), false) + opt(1, tr('Kopen', 'Buy it', 262), false) + opt(2, tr('Huren: SaaS', 'Rent it: SaaS', 262), true);
    const party = (i, who, what) => rect(334, 94 + i * 42, 284, 36, 'pm-badge', 6) + txt(346, 94 + i * 42 + 26, who, 22, 'start', 'pm-big') + txt(606, 94 + i * 42 + 26, what, 22, 'end', 'pm-txt');
    const parties = party(0, tr('Leverancier', 'Vendor', 150), tr('het pakket', 'the package', 140)) + party(1, tr('Partner', 'Partner', 100), tr('richt het in', 'sets it up', 150))
      + party(2, tr('IT-team', 'IT team', 100), tr('bouwt, draait', 'extends, runs', 160));
    const table = `<rect class="pm-out" x="328" y="88" width="296" height="132" rx="10"/>` + txt(334, 242, tr('Eén tabel', 'One table', 284), 22, 'start', 'pm-mute');
    return { optB: b === 1 ? op(span(p, 0.1, 0.5), options) : '', partyB: b === 2 ? op(span(p, 0.1, 0.5), parties) : b >= 3 ? parties : '', tableB: b === 3 ? op(span(p, 0.1, 0.5), table) : b >= 4 ? table : '',
      ...tools(b, p, 4, tr('RFP', 'RFP', 260), tr('Beoordelingsmatrix', 'Scoring matrix', 260)) };
  }

  // ---- s4: implementation and go-live. The go-live is the day the new MES becomes the official system (the old one then does no
  // new work); big bang is everything at once, phased goes line by line.
  function liveParts(b, p) {
    const line = txt(440, 112, tr('Go-live', 'Go-live', 150), 22, 'middle', 'pm-big') + rect(334, 122, 98, 36, 'pm-bar', 6) + txt(383, 147, tr('Oud', 'Old', 80), 22, 'middle', 'pm-mute')
      + dia(440, 140, 10, 'pm-dia') + rect(448, 122, 170, 36, 'pm-crit', 6) + txt(533, 147, tr('Nieuw MES', 'New MES', 150), 22, 'middle', 'pm-on');
    const sq = (x, y, lit) => rect(x, y, 34, 30, lit ? 'pm-crit' : 'pm-tile', 5);
    const how = txt(334, 190, tr('Big bang', 'Big bang', 284), 22, 'start', 'pm-mute') + sq(334, 198, true) + sq(378, 198, true) + sq(422, 198, true)
      + txt(334, 252, tr('Gefaseerd', 'Phased', 284), 22, 'start', 'pm-mute') + sq(334, 260, true) + sq(378, 260, false) + sq(422, 260, false);
    return { lineB: b >= 1 ? (b === 1 ? op(span(p, 0.1, 0.5), line) : line) : '', howB: b >= 2 ? (b === 2 ? op(span(p, 0.1, 0.5), how) : how) : '',
      ...tools(b, p, 3, tr('Pilot', 'Pilot', 260), tr('Proefmigratie', 'Mock migration', 260)) };
  }

  // ---- s5: testing and adoption. The UAT (future users check that the MES supports their work, with a situation from real work),
  // the sign-off by the process owners, and the question after go-live: is it used?
  function testParts(b, p) {
    const uat = txt(334, 112, tr('UAT', 'UAT', 284), 22, 'start', 'pm-big') + rect(334, 122, 140, 36, 'pm-tile', 6) + txt(404, 147, tr('Gebruikers', 'Users', 120), 22, 'middle', 'pm-txt')
      + arrow(480, 140, 500, 140) + rect(504, 122, 114, 36, 'pm-crit', 6) + txt(561, 147, tr('MES', 'MES', 100), 22, 'middle', 'pm-on');
    const sit = txt(334, 196, tr('Situatie uit het werk', 'Situation from the work', 284), 22, 'start', 'pm-mute') + rect(334, 206, 284, 36, 'pm-card', 6) + txt(346, 232, tr('Een lijnstop melden', 'Reporting a line stop', 262), 22, 'start', 'pm-txt');
    const sign = rect(334, 252, 284, 36, 'pm-crit', 6) + txt(346, 278, tr('Sign-off', 'Sign-off', 120), 22, 'start', 'pm-on') + txt(606, 278, tr('geaccepteerd', 'accepted', 160), 22, 'end', 'pm-on');
    const use = rect(334, 100, 284, 44, 'pm-card', 8) + txt(346, 130, tr('Wordt het gebruikt?', 'Is it used?', 262), 22, 'start', 'pm-big')
      + rect(334, 160, 284, 28, 'pm-tile', 6) + rect(334, 160, 170, 28, 'pm-range', 6);
    return { uatB: b >= 1 && b <= 3 ? (b === 1 ? op(span(p, 0.1, 0.5), uat) : uat) : '', sitB: b >= 2 && b <= 3 ? (b === 2 ? op(span(p, 0.1, 0.5), sit) : sit) : '',
      signB: b === 3 ? op(span(p, 0.1, 0.5), sign) : '', useB: b >= 4 ? (b === 4 ? op(span(p, 0.1, 0.5), use) : use) : '',
      ...tools(b, p, 5, tr('Testscript', 'Test script', 260), tr('Triage', 'Triage', 260)) };
  }

  // ---- s6: one whole. The project in the order it runs, and the day all of it points at.
  function wholeParts(b, p) {
    const rows = [tr('Requirements', 'Requirements', 262), tr('Leverancier', 'Vendor', 262), tr('Testen', 'Testing', 262), tr('Go-live', 'Go-live', 262), tr('Echt gebruik', 'Real use', 262)];
    let flow = '';
    rows.forEach((n, i) => {
      flow += rect(334, 94 + i * 40, 284, 32, i === 3 && b === 1 ? 'pm-crit' : 'pm-card', 6) + txt(346, 118 + i * 40, n, 22, 'start', i === 3 && b === 1 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, 94 + i * 40 - 8, 476, 94 + i * 40);
    });
    const dec = rect(334, 300, 284, 62, 'pm-crit', 8) + txt(346, 326, tr('Go-live kiezen', 'Choose the go-live', 260), 22, 'start', 'pm-on')
      + txt(346, 352, tr('niet in je drukste tijd', 'not in your busiest time', 260), 22, 'start', 'pm-on');
    return { flowB: op(b === 0 ? span(p, 0, 0.5) : 1, flow), decisionB: op(b >= 1 ? span(p, 0, 0.5) : 0, dec) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with IT projects lit, then zoomed to it; then the module's four topics, each with its four levels as
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


  const KEYS = ['goalB', 'teamB', 'reqB', 'listB', 'optB', 'partyB', 'tableB', 'lineB', 'howB', 'uatB', 'sitB', 'signB', 'useB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
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
      title = [tr('Eisen', 'Needs'), tr('Leverancier', 'Vendor'), tr('Invoeren', 'Roll-out'), tr('Testen', 'Testing')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, reqParts(b, p));
    if (si === 2) { Object.assign(o, vendorParts(b, p)); lab = tr('schema', 'diagram'); }
    if (si === 3) { Object.assign(o, liveParts(b, p)); lab = tr('schema', 'diagram'); }
    if (si === 4) Object.assign(o, testParts(b, p));
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
