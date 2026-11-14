// The stage of the module intro film "Verhuis lijn 3 / Move line 3" (Intake): a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, as in the
// Planning intro and the lifecycle film: the new floor with the dashed outline of
// line 3 (the line is still in the old hall), line 4 that stays, the power cabinet
// with its cable still to be connected, the dashed place of the switchboard and the
// calendar of the shutdown; the cast changes per topic (the sponsor, the team lead,
// the operators). The panel at the right draws each step as a schema, labelled
// "voorbeeld" (the line's move) or "schema" (the module's map). Every part a
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
  const arrow = (x0, y0, x1, y1) => {
    const up = y1 < y0 ? -1 : 1;
    const horiz = Math.abs(y1 - y0) < 1;
    const head = horiz ? `M${f1(x1 - 6)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * up)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * up)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // the width of a drawn word (the kit's measured table), for a pill that fits its text
  const wide = (s) => [...s].reduce((a, c) => a + (CW[c] === undefined ? 14 : CW[c]), 0);
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['problem', 'people', 'scope', 'case'];
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
  // A person who stood there at the end of the scene before is there from the first frame (no blink at a cut).
  const FROM = { sponsor: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]], lead: [[2, 2], [3, 0], [5, 0]], crew: [[2, 3], [4, 2], [5, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      const carried = FROM[who].some(([sc]) => sc === si - 1);
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from && !carried ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }

  // ---- the four topic tiles
  // the route (s1): four full-width rows, each with its number and its title (wrapped into the room of a row,
  // D.tileUnits: the index titles Stakeholders and projectopdracht do not fit the pilot's 128-unit tile)
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = 60 + i * 74;
      const lines = wrap(t, D.tileUnits);
      let s = rect(334, y, 284, 64, 'pm-tile', 8) + `<circle class="pm-dot" cx="360" cy="${y + 32}" r="16"/>` + txt(360, y + 40, String(i + 1), 22, 'middle', 'pm-on');
      lines.slice(0, 3).forEach((l, j) => { s += txt(386, y + (lines.length > 1 ? 27 : 39) + j * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- s1: the request, the road from a request to a project worth doing, the route
  function requestCard(a, stopOn) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Verzoek van de sponsor', 'The sponsor’s request', 272), 22, 'start', 'pm-mute');
    s += txt(346, 126, tr('Verhuis lijn 3', 'Move line 3', 272), 22, 'start', 'pm-big');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? (stopOn ? 'pm-crit' : 'pm-badge') : 'pm-tile', 3);
    s += cells + txt(618, 206, tr('zomerstop', 'summer shutdown'), 22, 'end', 'pm-mute');
    return op(a, s);
  }
  function pathBox(a) {
    let s = rect(334, 232, 284, 34, 'pm-tile', 6) + txt(346, 257, tr('Vraag van de klant', 'The client’s question', 262), 22, 'start', 'pm-txt');
    s += arrow(476, 268, 476, 282);
    s += rect(334, 284, 284, 34, 'pm-crit', 6) + txt(346, 309, tr('Intake', 'Intake', 262), 22, 'start', 'pm-on');
    s += arrow(476, 320, 476, 334);
    s += rect(334, 336, 284, 34, 'pm-card', 6) + txt(346, 361, tr('Project dat het waard is', 'A project worth doing', 262), 22, 'start', 'pm-txt');
    return op(a, s);
  }

  // ---- s2: from question to problem. The request is a solution; the two questions behind it; the goal.
  function problemParts(b, p) {
    const ask = rect(334, 98, 284, 40, 'pm-card', 6) + txt(346, 125, tr('Vraag: verhuis lijn 3', 'Ask: move line 3', 270), 22, 'start', 'pm-txt');
    const tag = txt(346, 166, tr('een oplossing', 'a solution', 270), 22, 'start', 'pm-mute');
    const why = arrow(400, 142, 400, 156) + arrow(552, 142, 552, 156)
      + rect(334, 158, 138, 38, 'pm-badge', 6) + txt(403, 184, tr('Waarom?', 'Why?', 126), 22, 'middle', 'pm-txt')
      + rect(480, 158, 138, 38, 'pm-badge', 6) + txt(549, 184, tr('Wanneer?', 'When?', 126), 22, 'middle', 'pm-txt');
    const goal = arrow(476, 200, 476, 216) + rect(334, 218, 284, 96, 'pm-crit', 8)
      + txt(346, 246, tr('Doel', 'Goal', 140), 22, 'start', 'pm-mute') + txt(606, 246, tr('sponsor', 'sponsor', 130), 22, 'end', 'pm-on')
      + txt(346, 276, tr('lijn 3 draait in hal B', 'line 3 runs in hall B', 260), 22, 'start', 'pm-big')
      + txt(346, 302, tr('even snel als nu', 'as fast as now', 260), 22, 'start', 'pm-txt');
    return {
      askB: op(b === 0 ? span(p, 0.05, 0.4) : 1, ask) + (b === 0 ? op(span(p, 0.4, 0.8), tag) : ''),
      whyB: op(b === 1 ? span(p, 0.05, 0.5) : b > 1 ? 1 : 0, why),
      goalB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, goal),
    };
  }

  // ---- s3: stakeholders. The stakeholder map: influence up, interest to the right; four people as pills.
  const MAPX = { l: 346, mid: 470, r: 618, top: 118, mid2: 226, bot: 334 };
  function pill(x1, y, label, cls, anchor) {
    const w = wide(label) + 20;
    const x = anchor === 'end' ? x1 - w : x1;
    return rect(x, y, w, 36, cls, 8) + txt(x + w / 2, y + 26, label, 22, 'middle', 'pm-txt');
  }
  function peopleParts(b, p) {
    const frame = rect(MAPX.l, MAPX.top, MAPX.r - MAPX.l, MAPX.bot - MAPX.top, 'pm-out', 6)
      + `<path class="pm-link" d="M${MAPX.mid} ${MAPX.top}V${MAPX.bot}M${MAPX.l} ${MAPX.mid2}H${MAPX.r}"/>`
      + txt(334, 108, tr('invloed', 'influence', 200), 22, 'start', 'pm-mute') + txt(618, 366, tr('belang', 'interest', 200), 22, 'end', 'pm-mute');
    const sp = pill(MAPX.r - 6, 128, tr('Sponsor', 'Sponsor', 130), 'pm-crit', 'end');
    const ld = pill(MAPX.r - 6, 174, tr('Teamleider', 'Team lead', 140), 'pm-badge', 'end');
    const ops = pill(MAPX.r - 6, 270, tr('Operators', 'Operators', 140), 'pm-tile', 'end');
    const orp = pill(MAPX.l + 6, 128, tr('OR', 'Council', 118), 'pm-pkg', 'start');
    const a1 = b === 1 ? span(p, 0.1, 0.6) : 1;
    return {
      smapB: op(b >= 1 ? a1 : 0, frame),
      psB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, sp),
      plB: op(b >= 2 ? (b === 2 ? span(p, 0.3, 0.7) : 1) : 0, ld),
      poB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.4) : 1) : 0, ops),
      orB: op(b >= 3 ? (b === 3 ? span(p, 0.3, 0.7) : 1) : 0, orp),
    };
  }

  // ---- s4: scope and charter. The one page: the goal sentence, the baseline, what is in and out of scope.
  function scopeParts(b, p) {
    const goal = rect(342, 104, 268, 92, 'pm-crit', 8)
      + txt(354, 130, tr('Doel', 'Goal', 240), 22, 'start', 'pm-mute')
      + txt(354, 160, tr('lijn 3 draait in hal B', 'line 3 runs in hall B', 250), 22, 'start', 'pm-big')
      + txt(354, 186, tr('even snel als nu', 'as fast as now', 250), 22, 'start', 'pm-txt');
    const base = rect(342, 206, 268, 40, 'pm-badge', 6) + txt(354, 233, tr('Nulmeting: snelheid', 'Baseline: speed', 246), 22, 'start', 'pm-txt');
    const inn = rect(342, 258, 268, 40, 'pm-pkg', 6) + txt(354, 285, tr('In scope: lijn 3', 'In scope: line 3', 246), 22, 'start', 'pm-txt');
    const out = rect(342, 310, 268, 40, 'pm-out', 6) + txt(354, 337, tr('Buiten scope: lijn 4', 'Out of scope: line 4', 246), 22, 'start', 'pm-txt');
    const page = rect(330, 92, 292, 270, 'pm-out', 10);
    return {
      goalSB: op(b >= 1 ? (b === 1 ? span(p, 0, 0.4) : 1) : 0, goal),
      baseB: op(b >= 1 ? (b === 1 ? span(p, 0.3, 0.7) : 1) : 0, base),
      scopeInB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, inn),
      scopeOutB: op(b >= 2 ? (b === 2 ? span(p, 0.3, 0.7) : 1) : 0, out),
      pageB: op(b >= 3 ? span(p, 0, 0.4) : 0, page),
    };
  }

  // ---- s5: business case and proposal. Costs against benefits (no figures), then the proposal.
  function caseParts(b, p) {
    const costsHead = txt(334, 124, tr('Kosten', 'Costs', 140), 22, 'start', 'pm-big');
    const cost = (y, lab) => rect(334, y, 150, 40, 'pm-badge', 6) + txt(409, y + 27, lab, 22, 'middle', 'pm-txt');
    const costs = costsHead + (b >= 2 ? cost(134, tr('installateur', 'installer', 138)) + cost(180, tr('schakelkast', 'switchboard', 138)) + cost(226, tr('operators', 'operators', 138)) : '');
    const benHead = txt(618, 124, tr('Baten', 'Benefits', 120), 22, 'end', 'pm-big');
    const ben = benHead + (b >= 3 ? rect(494, 134, 124, 132, 'pm-crit', 8) + txt(556, 206, tr('in euro’s', 'in euros', 112), 22, 'middle', 'pm-on') : '');
    const prop = rect(334, 284, 284, 84, 'pm-card', 8) + txt(346, 314, tr('Voorstel', 'Proposal', 260), 22, 'start', 'pm-big')
      + txt(346, 350, tr('aanpak, resultaat, prijs', 'approach, result, price', 262), 22, 'start', 'pm-txt');
    return {
      costsB: op(b >= 1 ? (b === 1 ? span(p, 0.1, 0.6) : b === 2 ? 1 : 1) : 0, costs),
      benefitsB: op(b >= 1 ? (b === 1 ? span(p, 0.2, 0.7) : 1) : 0, ben),
      propB: op(b >= 4 ? (b === 4 ? span(p, 0, 0.4) : 1) : 0, prop),
    };
  }

  // ---- s6: how the four hang together
  function fourParts(b, p) {
    const T = [[tr('Doel', 'Goal', 120), 0], [tr('Mensen', 'People', 120), 1], [tr('Scope', 'Scope', 120), 2], [tr('Waarde', 'Value', 120), 3]];
    let s = '';
    T.forEach(([l, i]) => {
      const x = 334 + (i % 2) * 148;
      const y = 56 + Math.floor(i / 2) * 100;
      s += rect(x, y, 142, 90, 'pm-card', 8) + txt(x + 8, y + 26, l, 22, 'start', 'pm-big');
      if (i === 0) s += rect(x + 12, y + 50, 100, 12, 'pm-crit', 3) + rect(x + 12, y + 68, 60, 8, 'pm-bar', 3);
      if (i === 1) s += `<circle class="pm-dia" cx="${x + 28}" cy="${y + 62}" r="9"/><circle class="pm-dia" cx="${x + 62}" cy="${y + 62}" r="9"/><circle class="pm-dia" cx="${x + 96}" cy="${y + 62}" r="9"/>`;
      if (i === 2) s += rect(x + 14, y + 44, 110, 36, 'pm-out', 4) + rect(x + 26, y + 54, 50, 16, 'pm-pkg', 3);
      if (i === 3) s += rect(x + 14, y + 52, 40, 22, 'pm-badge', 3) + rect(x + 62, y + 44, 40, 30, 'pm-crit', 3);
    });
    const names = [tr('Doel', 'Goal', 270), tr('Scope', 'Scope', 270), tr('Ja: naar Plannen', 'Yes: on to Plan', 270)];
    let chain = '';
    names.forEach((n, i) => { chain += rect(334, 262 + i * 44, 284, 32, i === 2 ? 'pm-crit' : 'pm-card', 6) + txt(476, 262 + i * 44 + 24, n, 22, 'middle', i === 2 ? 'pm-on' : 'pm-txt'); if (i) chain += arrow(476, 262 + i * 44 - 12, 476, 262 + i * 44); });
    return { fourB: op(span(b === 0 ? p : 1, 0, 0.4), s), chainB: op(b >= 1 ? span(p, 0, 0.5) : 0, chain) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with Intake lit, then zoomed to it; then the module's four topics, each with its four levels as
  // columns (the words the app uses for the levels), the start marker on the first level of the first topic.
  const MAP0 = { s: 0.77, x: 73.6, y: 0 };
  const MAP1 = { s: 1.5, x: 320 - MAPZ[0] * 1.5, y: 200 - MAPZ[1] * 1.5 };
  function mapPlace(b, p) {
    const z = b === 0 ? span(p, 0.35, 1) : 1;
    const s = lerp(MAP0.s, MAP1.s, z);
    move(E.mapG, `translate(${f1(lerp(MAP0.x, MAP1.x, z))} ${f1(lerp(MAP0.y, MAP1.y, z))}) scale(${s.toFixed(4)})`);
    return b === 0 ? 1 : 1 - span(p, 0, 0.45);
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
      wrap(t, GRID.tile - 12).slice(0, 3).forEach((l, j) => { s += txt(26, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }

  const PANEL = ['l1', 'l2', 'l3', 'l4', 'st', 'reqB', 'pathB', 'askB', 'whyB', 'goalB', 'smapB', 'psB', 'plB', 'poB', 'orB', 'goalSB', 'baseB', 'scopeInB', 'scopeOutB', 'pageB', 'costsB', 'benefitsB', 'propB', 'fourB', 'chainB'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    const o = Object.fromEntries(PANEL.map((k2) => [k2, '']));
    o.r = ['', '', '', ''];
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 6;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = tr('Verzoek', 'Request');
      o.reqB = b >= 2 ? '' : requestCard(b === 0 ? span(p, 0.05, 0.4) : 1, b === 0 && p > 0.5 || b > 0);
      if (b === 1) { o.pathB = pathBox(span(p, 0.1, 0.5)); lab = tr('schema', 'diagram'); }
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Vraag en doel', 'Ask and goal'), tr('Stakeholders', 'Stakeholders'), tr('Eén pagina', 'One page'), tr('Businesscase', 'Business case')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, problemParts(b, p));
    if (si === 2) Object.assign(o, peopleParts(b, p));
    if (si === 3) Object.assign(o, scopeParts(b, p));
    if (si === 4) Object.assign(o, caseParts(b, p));
    if (si === 5) {
      title = tr('Samen', 'Together');
      lab = tr('schema', 'diagram');
      Object.assign(o, fourParts(b, p));
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
    if (E.pbg.__v !== pbg) { for (const kv of pbg.split(' ')) { const [k2, v] = kv.split('='); E.pbg.setAttribute(k2, v.replace(/"/g, '')); } E.pbg.__v = pbg; }
    const head = closing && b > 0 ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    ['r0', 'r1', 'r2', 'r3'].forEach((k2, i) => set(E[k2], o.r[i]));
    for (const k2 of PANEL) set(E[k2], o[k2]);
  }

  return { render };
})();
