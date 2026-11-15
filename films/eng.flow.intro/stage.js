// The stage of the module intro film "Een dienst op lijn 3 / A shift on line 3": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the run field film: the filling unit over the belt of line 3
// with its cartons, you and the team lead; the stop board on the back wall appears at the sentence that names the downtime
// log kept on it. The panel at the right draws each beat as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the
// module's map). The takt, the bottleneck, the losses and the changeover are panel schemas only. Every part a sentence
// lights is a static data-cue group (build.mjs); this script only fills the panel and shows or hides the room's moving
// parts. The closing scene (the shared Engineering map, then the module's four topics with their levels) is ONE function,
// closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the panel
// (the kit checks that they fit).
/* global CAM, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW, wrapUnits, span, beatStarts */
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
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const dot = (x, y, r) => `<circle class="pm-joint" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const head = dy === 0 ? `M${f1(x1 - 6 * dx)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6 * dx)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * dy)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * dy)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const IDS = ['takt', 'bottleneck', 'oee', 'changeover'];
  const TITLE = IDS.map((id) => { const t = D.topics.find((x) => x.id === id); return tr(t.title.nl, t.title.en); });
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
  // the camera: CAM[si] = { from: [ox, oy, s], to: [ox, oy, s] }, the point (ox, oy) of the room brought to the
  // middle of the room's half of the stage (160, 200), at scale s
  function camera(si, u, b, p) {
    const c = CAM[si];
    const kk = c.at === undefined ? span(u, 0, 1) : b < c.at ? 0 : span(p, 0, 0.7);
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- the room: you and the team lead come in at the sentence that names you (the opening's third beat) and again at the
  // end of the last topic (where the shift ends on pace). The stop board stands from the sentence that names the downtime
  // log kept on it (the third beat of the OEE scene)
  function room(si, b) {
    show(E['o-log'], (si === 3 && b >= 2) || si === 4 ? 1 : 0);
    show(E['pp-jij'], (si === 0 && b >= 2) || (si === 4 && b === 3) ? 1 : 0);
    show(E['pp-teamlead'], (si === 0 && b >= 2) || (si === 4 && b === 3) ? 1 : 0);
  }


  // ---- the route (s1, the last three beats): the module's four topics in two groups, the map before the detail. Each
  // row has its number and its index title, wrapped by the kit's widths into 240 units left of the number; a title of two
  // lines gets a taller row. The rows keep their place whichever groups show
  const ROUTE = (() => {
    const rows = [];
    let y = 52;
    [[0, 1], [2, 3]].forEach((grp) => {
      grp.forEach((i) => {
        const lines = wrap(TITLE[i], 240).slice(0, 2);
        const h = lines.length === 1 ? 34 : 56;
        rows.push({ i, y, h, lines });
        y += h + 6;
      });
      y += 10;
    });
    return rows;
  })();
  function routeGroup(first, count, a) {
    let s = '';
    ROUTE.filter((r) => r.i >= first && r.i < first + count).forEach((r) => {
      s += rect(334, r.y, 284, r.h, 'pm-tile', 6) + txt(610, r.y + 25, String(r.i + 1), 22, 'end', 'pm-on');
      r.lines.forEach((l, j) => { s += txt(346, r.y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
    });
    return op(a, s);
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // the tool's name as a chip high in the panel under the strip (one short sentence names it; it is not explained). Shown in
  // the beat of the sentence (b === at)
  function tools(b, p, at, one) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a card with a name and one muted line under it (a 62-unit card)
  const card2 = (y, a, b, c, d, cls = 'pm-card', room = 260) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a card with one line (a 44-unit card)
  const card1 = (y, a, b, cls = 'pm-card', room = 260) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
  // a tile with one line (a 34-unit row)
  const tile = (y, a, b, cls = 'pm-tile', room = 260) => rect(334, y, 284, 34, cls, 6) + txt(346, y + 25, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');

  // ---- s1: line 3 must make enough cartons for the customer; how much a line can make and why not; a whole shift.
  function flowDrawing(last) {
    return card1(64, 'De klant', 'The customer') + arrow(476, 112, 476, 126) + card1(130, 'Lijn 3', 'Line 3') + arrow(476, 178, 476, 192) + card1(196, 'Dozen per dienst', 'Cartons per shift', last);
  }
  function howDrawing() {
    return card1(64, 'Lijn 3', 'Line 3') + arrow(476, 112, 476, 126) + card1(130, 'Hoeveel?', 'How much?') + card1(196, 'Waarom niet?', 'Why not?');
  }
  function shiftDrawing() {
    let s = txt(334, 112, tr('Een hele dienst', 'A whole shift', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 8; i++) s += rect(334 + i * 36, 126, 32, 34, i < 7 ? 'pm-tile' : 'pm-out', 6);
    return s + path('M334 196H618M610 191L618 196L610 201', 'pm-arrow') + txt(334, 236, tr('op tempo', 'on pace', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: takt is the pace the customer asks for; line balancing puts each station just under it; the yamazumi (the chip
  // above) is a stacked bar per station with the takt line across, one bar sticking out.
  function taktDrawing() {
    return card1(100, 'De klant', 'The customer') + arrow(476, 148, 476, 176) + card1(180, 'Takt', 'Takt', 'pm-crit') + txt(334, 262, tr('tempo van de klant', 'the customer’s pace', 284), 22, 'start', 'pm-mute');
  }
  function balDrawing() {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += rect(334 + i * 74, 120, 62, 62, 'pm-tile', 8) + txt(365 + i * 74, 160, String(i + 1), 22, 'middle', 'pm-big');
      if (i < 3) s += arrow(397 + i * 74, 151, 407 + i * 74, 151);
    }
    return s + txt(334, 226, tr('net onder de takt', 'just under takt', 284), 22, 'start', 'pm-mute');
  }
  function yamDrawing() {
    let s = '';
    [4, 4, 5, 4].forEach((n, i) => {
      for (let j = 0; j < n; j++) s += rect(346 + i * 66, 340 - (j + 1) * 22, 46, 20, i === 2 && j === 4 ? 'pm-crit' : 'pm-bar', 3);
      s += txt(369 + i * 66, 366, String(i + 1), 22, 'middle', 'pm-mute');
    });
    return s + path('M334 252H618', 'pm-dash') + txt(618, 240, tr('takt', 'takt', 80), 22, 'end', 'pm-mute');
  }

  // ---- s3: a line makes no more than its slowest step; capacity is what it can make after losses, not the paper figure;
  // the shift model (the chip above) sets the hours.
  function bnDrawing() {
    let s = '';
    for (let i = 0; i < 3; i++) {
      s += rect(334 + i * 100, 120, 84, 56, i === 1 ? 'pm-crit' : 'pm-card', 8) + txt(376 + i * 100, 156, tr('Stap', 'Step', 76), 22, 'middle', i === 1 ? 'pm-on' : 'pm-big');
      if (i < 2) s += arrow(418 + i * 100, 148, 434 + i * 100, 148);
    }
    return s + txt(476, 212, tr('langzaamste stap', 'slowest step', 200), 22, 'middle', 'pm-mute');
  }
  function capDrawing() {
    return txt(334, 112, tr('Op papier', 'On paper', 284), 22, 'start', 'pm-mute') + rect(334, 122, 284, 30, 'pm-bar', 6)
      + txt(334, 196, tr('Echt, na verliezen', 'Real, after losses', 284), 22, 'start', 'pm-mute') + rect(334, 206, 200, 30, 'pm-crit', 6);
  }
  function shmDrawing() {
    let s = txt(334, 214, tr('ploegen per dag', 'shifts a day', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 3; i++) s += rect(334 + i * 98, 230, 88, 60, 'pm-card', 8) + txt(378 + i * 98, 270, String(i + 1), 22, 'middle', 'pm-big');
    return s;
  }

  // ---- s4: OEE asks how much planned time goes into good parts; the six big losses; the downtime log (the chip above) lists
  // every stop with its time, length and cause.
  function oeeDrawing() {
    return txt(334, 118, tr('Geplande tijd', 'Planned time', 284), 22, 'start', 'pm-mute') + rect(334, 130, 284, 40, 'pm-bar', 6) + rect(334, 130, 190, 40, 'pm-crit', 6)
      + txt(334, 208, tr('Goede stuks', 'Good parts', 150), 22, 'start', 'pm-big') + txt(618, 208, tr('Verlies', 'Loss', 90), 22, 'end', 'pm-mute');
  }
  function lossDrawing() {
    // six rows, the six big losses; only the two the sentence names carry a label (breakdowns, rejects), the four between are blank
    const blank = (y) => rect(334, y, 284, 34, 'pm-out', 6);
    return tile(100, 'Storingen', 'Breakdowns') + blank(142) + blank(184) + blank(226) + blank(268) + tile(310, 'Afkeur', 'Rejects');
  }
  function logDrawing() {
    let s = rect(334, 172, 284, 160, 'pm-card', 8) + txt(346, 204, tr('Tijd', 'Time', 64), 22, 'start', 'pm-mute') + txt(418, 204, tr('Duur', 'Duration', 96), 22, 'start', 'pm-mute') + txt(522, 204, tr('Oorzaak', 'Cause', 94), 22, 'start', 'pm-mute');
    [[40, 56, 64], [34, 36, 50], [40, 66, 40]].forEach((r, i) => { const y = 238 + i * 34; s += path(`M346 ${y}h${r[0]}M418 ${y}h${r[1]}M522 ${y}h${r[2]}`, 'pm-link'); });
    return s;
  }

  // ---- s5: a changeover is switching to another product; the batch size is the number of parts between two changeovers;
  // the changeover cart (the chip above) holds the tools ready; the shift ends on pace.
  function chgDrawing() {
    return rect(334, 130, 124, 56, 'pm-card', 8) + txt(396, 165, tr('Product A', 'Product A', 112), 22, 'middle', 'pm-big') + arrow(462, 158, 490, 158)
      + rect(494, 130, 124, 56, 'pm-card', 8) + txt(556, 165, tr('Product B', 'Product B', 112), 22, 'middle', 'pm-big') + txt(476, 222, tr('omstellen', 'changeover', 200), 22, 'middle', 'pm-mute');
  }
  function batchDrawing() {
    let s = path('M340 116V176M500 116V176', 'pm-dash');
    for (let i = 0; i < 4; i++) s += rect(350 + i * 34, 130, 28, 34, 'pm-crit', 5);
    for (let i = 0; i < 3; i++) s += rect(512 + i * 34, 130, 28, 34, 'pm-tile', 5);
    return s + path('M350 182v10h136v-10', 'pm-link') + txt(350, 230, tr('seriegrootte', 'batch size', 260), 22, 'start', 'pm-big');
  }
  function cartDrawing() {
    return rect(356, 196, 44, 40, 'pm-tile', 4) + rect(412, 208, 36, 28, 'pm-tile', 4) + rect(462, 190, 64, 46, 'pm-tile', 4)
      + rect(334, 240, 270, 50, 'pm-card', 8) + path('M604 240V196H618', 'pm-link') + dot(372, 304, 12) + dot(566, 304, 12)
      + txt(334, 362, tr('alles op vaste plekken', 'all in fixed places', 284), 22, 'start', 'pm-mute');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Data and digital manufacturing lit, the whole sheet and then zoomed to the lit place at 1.5; then the
  // module's four topics, each with its four levels as columns (the words the app uses for the levels), the start marker on
  // the first level of the first topic.
  const MAP0 = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
  // the zoom on the lit place stays inside the sheet (no empty strip beside the map)
  const MAP1 = { s: 1.5, x: clamp(320 - MAPZ[0] * 1.5, W - MAPSZ[0] * 1.5, 0), y: clamp(200 - MAPZ[1] * 1.5, H - MAPSZ[1] * 1.5, 0) };
  function mapPlace(b, p) {
    const z = b === 0 ? span(p, 0.35, 1) : 1;
    const s = lerp(MAP0.s, MAP1.s, z);
    move(E.mapG, `translate(${f1(lerp(MAP0.x, MAP1.x, z))} ${f1(lerp(MAP0.y, MAP1.y, z))}) scale(${s.toFixed(4)})`);
    // the map fades out once, in the second beat, and stays hidden after it (it must not come back at the start of
    // every later beat, behind the grid)
    return b === 0 ? 1 : b === 1 ? 1 - span(p, 0, 0.45) : 0;
  }
  // the columns (GRID from build.mjs, which checks the level words fit): a tile column of GRID.tile units, four level
  // columns of GRID.col from GRID.x with boxes of GRID.box. The level words stand on one line each, staggered over two
  // rows (the first and third high, the second and fourth low), so neighbours never meet.
  const GX = GRID.x;
  const GW = GRID.col;
  const GB = GRID.box;
  const gridY = (i) => GRID.top + i * GRID.pitch;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], lv1: '', lv2: '', lv3: '', lv4: '', start: '' };
    const lv = ['lv1', 'lv2', 'lv3', 'lv4'];
    LW.forEach((wd, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, wd, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, GRID.h, 'pm-tile', 8);
      const lines = wrap(t, GRID.tile - 12).slice(0, 2);
      const y0 = lines.length === 1 ? y + 38 : y + 27;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.1, i * 0.1 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 8, GB, GRID.h - 16, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 3, GB + 10, GRID.h - 6, 'pm-out', 10);
    return out;
  }

  const HEAD = [[tr('Takt', 'Takt', 165)], [tr('Bottleneck', 'Bottleneck', 165)], [tr('OEE', 'OEE', 165)], [tr('Omstellen', 'Changeover', 165)]];

  function render(si, u) {
    const { b, p } = beatOf(si, u);
    camera(si, u, b, p);
    room(si, b);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 5;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 3 ? tr('De route', 'The route') : tr('Lijn 3', 'Line 3');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing('pm-out'));
      if (b === 1) o.flowS = howDrawing();
      if (b === 2) o.shiftS = op(span(p, 0.05, 0.4), shiftDrawing());
      if (b >= 3) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, 2, b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b >= 4) o.grpB = routeGroup(2, 2, b === 4 ? span(p, 0.05, 0.4) : 1);
      }
    } else if (si >= 1 && si <= 4) {
      title = HEAD[si - 1][0];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { taktS: fade(b, 0, p, taktDrawing(), 0.1, 0.5), balS: fade(b, 1, p, balDrawing(), 0.1, 0.5), yamS: b === 2 ? op(span(p, 0.3, 0.7), yamDrawing()) : '', ...tools(b, p, 2, tr('Yamazumi', 'Yamazumi', 260)) });
      if (si === 2) Object.assign(o, { bnS: fade(b, 0, p, bnDrawing(), 0.1, 0.5), capS: fade(b, 1, p, capDrawing(), 0.1, 0.5), shmS: b === 2 ? op(span(p, 0.3, 0.7), shmDrawing()) : '', ...tools(b, p, 2, tr('Ploegenrooster', 'Shift model', 260)) });
      if (si === 3) Object.assign(o, { oeeS: fade(b, 0, p, oeeDrawing(), 0.1, 0.5), lossS: fade(b, 1, p, lossDrawing(), 0.1, 0.5), logS: b === 2 ? op(span(p, 0.3, 0.7), logDrawing()) : '', ...tools(b, p, 2, tr('Stilstandregistratie', 'Downtime log', 260)) });
      if (si === 4) Object.assign(o, { chgS: fade(b, 0, p, chgDrawing(), 0.1, 0.5), batchS: fade(b, 1, p, batchDrawing(), 0.1, 0.5), cartS: b === 2 ? op(span(p, 0.3, 0.7), cartDrawing()) : '', endS: fade(b, 3, p, `<g transform="translate(0 56)">${flowDrawing('pm-crit')}</g>`, 0.1, 0.5), ...tools(b, p, 2, tr('Omstelkar', 'Changeover cart', 260)) });
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
        o.r = m.r; o.lv1 = m.lv1; o.lv2 = m.lv2; o.lv3 = m.lv3; o.lv4 = m.lv4; o.start = b >= 2 ? m.start : '';
        title = '';
        lab = '';
      }
    }
    show(E.mapG, mapA);
    show(E.hud, hudA);
    if (E.pbg.__v !== pbg) { for (const kv of pbg.split(' ')) { const [k, v] = kv.split('='); E.pbg.setAttribute(k, v.replace(/"/g, '')); } E.pbg.__v = pbg; }
    const head = closing && b > 0 ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    for (let i = 0; i < 4; i++) set(E[`r${i}`], o.r[i]);
    for (const k2 of KEYS) set(E[`k_${k2}`], o[k2]);
  }

  return { render };
})();
