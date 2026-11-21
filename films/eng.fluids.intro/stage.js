// The stage of the module intro film "De leiding naar lijn 3 / The pipe to line 3": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, JIJSHIFT, W, H,
// LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as
// the kit's label check measures). The story is drawn in hall B, at the left: the tank, the pump and the pipe with its valve and
// the plate heat exchanger over to the filling unit of line 3, with the steam pipe through the back wall; you come and go.
// The panel at the right draws each beat as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map).
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or hides
// the room's moving part (you). The closing scene (the shared Engineering map, then the module's four topics with their
// levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the panel
// (the kit checks that they fit).
/* global CAM, JIJSHIFT, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW, wrapUnits, span, beatStarts */
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
  const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const head = dy === 0 ? `M${f1(x1 - 6 * dx)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6 * dx)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * dy)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * dy)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const IDS = ['pipes', 'pumps', 'heat', 'utilities'];
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

  // ---- the room: who stands there, per scene (si) and beat (b).
  // You stand in the hall in the first scene and, in the other topic scenes, only in the beat that names the tool (you read the
  // curve, you pick the exchanger, you check the trap); the scene's own place for you is JIJSHIFT[si]
  function room(si, b, p) {
    const sh = JIJSHIFT[si];
    move(E['pp-jij'], sh ? `translate(${sh[0]} ${sh[1]})` : '');
    show(E['pp-jij'], si === 0 ? 0 : si >= 1 && si <= 4 && b >= 2 ? (b === 2 ? span(p, 0, 0.35) : 1) : 0);
  }

  // ---- the four topic tiles
  // the route (s1, the last two beats): the module's four topics in two groups, the map before the detail. The two
  // that move the product (pipes and pumps, topics 1 and 2) and the two about the heat (exchangers and steam, topics 3 and 4), each row with its number and its index title, wrapped by the kit's widths into 240 units left of the
  // number; a title of two lines gets a taller row
  function routeGroup(first, head, a) {
    let y = first === 0 ? 74 : 236;
    let s = txt(334, y, head, 22, 'start', 'pm-mute');
    y += 8;
    for (let i = first; i < first + 2; i++) {
      const lines = wrap(TITLE[i], 240).slice(0, 2);
      const h = lines.length === 1 ? 34 : 56;
      s += rect(334, y, 284, h, 'pm-tile', 6) + txt(610, y + 25, String(i + 1), 22, 'end', 'pm-on');
      lines.forEach((l, j) => { s += txt(346, y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
      y += h + 6;
    }
    return op(a, s);
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // the tool name as a chip high in the panel under the strip (one short sentence names it; it is not
  // explained). Shown in the beat of the sentence (b === at)
  function tools(b, p, at, one) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');

  // ---- s1: the way of the product; the pump makes the pressure and the rest uses it; the utilities. Panel under the heading (y from 60).
  function flowDrawing() {
    const box = (y, a, b, cls) => rect(334, y, 284, 40, cls, 8) + txt(346, y + 28, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
    const rows = [['Tank', 'Tank'], ['Pomp', 'Pump'], ['Warmtewisselaar', 'Heat exchanger'], ['Vuleenheid', 'Filling unit'], ['Lijn 3', 'Line 3']];
    let s = '';
    rows.forEach(([n, e], i) => { s += box(62 + i * 58, n, e, i === 1 ? 'pm-crit' : 'pm-card') + (i < 4 ? arrow(476, 104 + i * 58, 476, 118 + i * 58) : ''); });
    return s + txt(334, 366, tr('de weg van het product', 'the way of the product', 284), 22, 'start', 'pm-mute');
  }
  function defDrawing() {
    const row = (y, a, b, c, d, cls) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return row(96, 'Pomp', 'Pump', 'maakt de druk', 'makes the pressure', 'pm-crit') + row(172, 'Leiding en afsluiter', 'Pipe and valve', 'verbruiken druk', 'use up pressure', 'pm-tile') + row(248, 'Warmtewisselaar', 'Heat exchanger', 'verbruikt druk', 'uses up pressure', 'pm-tile');
  }
  function utilDrawing() {
    const card = (y, a, b, c, d, cls) => rect(334, y, 284, 74, cls, 8) + txt(346, y + 32, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 60, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return card(110, 'Stoom', 'Steam', 'brengt warmte', 'brings heat', 'pm-card') + card(206, 'Koelwater', 'Cooling water', 'voert warmte af', 'takes heat away', 'pm-card')
      + txt(334, 330, tr('de utilities', 'the utilities', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: bends, valves and filters cost pressure; the pump delivers it again
  function dropDrawing() {
    const hs = [150, 112, 78, 48];
    let s = '';
    hs.forEach((hh, i) => { s += rect(334 + i * 74, 270 - hh, 62, hh, i === 0 ? 'pm-crit' : 'pm-bar', 3); });
    s += path('M334 272H618', 'pm-link');
    const lab = [['pomp', 'pump'], ['bocht', 'bend'], ['afsluiter', 'valve'], ['filter', 'filter']];
    lab.forEach(([a, b], i) => { s += txt(365 + i * 74, 298 + (i % 2) * 26, tr(a, b, 110), 22, 'middle', 'pm-txt'); });
    return s + txt(334, 366, tr('de druk zakt', 'the pressure falls', 284), 22, 'start', 'pm-mute');
  }
  function whyDrawing() {
    const card = (y, a, b, c, d, cls) => rect(334, y, 284, 74, cls, 8) + txt(346, y + 32, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 60, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return card(110, 'Pomp', 'Pump', 'levert de druk', 'delivers the pressure', 'pm-card') + arrow(476, 188, 476, 204) + card(208, 'Drukval', 'Pressure drop', 'verloren in de leiding', 'lost in the pipe', 'pm-crit');
  }

  // ---- s3: the pump and pipe curves; where they cross is the duty point
  const curveY = (kind, u) => (kind === 'pump' ? 138 + 124 * u * u : 250 - 120 * Math.pow(u, 1.5));
  function curveLines() {
    const pts = (kind) => { let d = ''; for (let i = 0; i <= 12; i++) { const u = i / 12; d += `${i ? 'L' : 'M'}${f1(352 + 252 * u)} ${f1(curveY(kind, u))}`; } return d; };
    return path('M346 124V300H618', 'pm-link') + path(pts('pump'), 'pm-arrow') + path(pts('pipe'), 'pm-link')
      + txt(612, 292, tr('pomp', 'pump', 110), 22, 'end', 'pm-txt') + txt(612, 120, tr('leiding', 'pipe', 110), 22, 'end', 'pm-txt');
  }
  function curveDrawing() {
    return curveLines() + txt(334, 366, tr('druk tegen debiet', 'pressure against flow', 284), 22, 'start', 'pm-mute');
  }
  function dutyDrawing() {
    const u = 0.64;
    const x = 352 + 252 * u;
    const y = curveY('pump', u);
    return curveLines() + path(`M${f1(x)} ${f1(y)}V300`, 'pm-dash') + circ(x, y, 7, 'pm-crit') + txt(x, 330, tr('werkpunt', 'duty point', 200), 22, 'middle', 'pm-big');
  }

  // ---- s4: heat goes through a wall; the product takes up heat
  function passDrawing() {
    return rect(334, 100, 284, 50, 'pm-crit', 8) + txt(346, 133, tr('warm', 'hot', 260), 22, 'start', 'pm-on')
      + rect(334, 178, 284, 10, 'pm-bar', 3) + txt(610, 218, tr('wand', 'wall', 120), 22, 'end', 'pm-mute')
      + arrow(420, 156, 420, 230) + arrow(520, 156, 520, 230)
      + rect(334, 236, 284, 50, 'pm-card', 8) + txt(346, 269, tr('koud', 'cold', 260), 22, 'start', 'pm-big')
      + txt(334, 330, tr('zonder te mengen', 'without mixing', 284), 22, 'start', 'pm-mute');
  }
  function giveDrawing() {
    return rect(334, 130, 124, 74, 'pm-card', 8) + txt(344, 162, tr('Stoom', 'Steam', 104), 22, 'start', 'pm-big') + txt(344, 190, tr('warm', 'hot', 104), 22, 'start', 'pm-mute')
      + arrow(462, 167, 492, 167)
      + rect(496, 130, 122, 74, 'pm-crit', 8) + txt(506, 162, tr('Product', 'Product', 102), 22, 'start', 'pm-on') + txt(506, 190, tr('warmer', 'warmer', 102), 22, 'start', 'pm-on')
      + txt(334, 260, tr('warmte gaat over', 'heat passes on', 284), 22, 'start', 'pm-mute');
  }

  // ---- s5: steam gives its heat and is water again; the condensate has to leave; a trap stuck open
  function steamDrawing() {
    const card = (y, a, b, cls) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 30, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
    return card(100, 'Ketelhuis', 'Boiler house', 'pm-card') + arrow(476, 146, 476, 168) + txt(496, 163, tr('stoom', 'steam', 110), 22, 'start', 'pm-mute')
      + card(172, 'Wisselaar', 'Exchanger', 'pm-crit') + arrow(476, 218, 476, 240) + txt(496, 235, tr('dan water', 'then water', 120), 22, 'start', 'pm-mute')
      + card(244, 'Water', 'Water', 'pm-card');
  }
  function condDrawing() {
    const card = (y, a, b, c, d, cls) => rect(334, y, 284, 74, cls, 8) + txt(346, y + 32, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 60, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return card(110, 'Condensaat', 'Condensate', 'moet de wisselaar uit', 'must leave the exchanger', 'pm-card') + arrow(476, 188, 476, 204) + card(208, 'Anders', 'Otherwise', 'zakt de verwarming', 'the heating drops', 'pm-crit');
  }
  function lossDrawing() {
    const card = (y, a, b, c, d, cls) => rect(334, y, 284, 74, cls, 8) + txt(346, y + 32, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 60, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return card(110, 'Pot staat open', 'Trap stuck open', 'verse stoom weg', 'live steam blows off', 'pm-card') + arrow(476, 188, 476, 204) + card(208, 'Energie', 'Energy', 'gaat verloren', 'is lost', 'pm-crit');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Pumps, flow and heat lit, the whole sheet and then zoomed to the lit place at 1.5; then the
  // module's four topics, each with its four levels as columns (the words the app uses for the levels), the start
  // marker on the first level of the first topic.
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
  // the columns (GRID from build.mjs, which checks the level words fit): a tile column of GRID.tile units, four
  // level columns of GRID.col from GRID.x with boxes of GRID.box. The level words stand on one line each,
  // staggered over two rows (the first and third high, the second and fourth low), so neighbours never meet.
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
      const y0 = lines.length === 1 ? y + 39 : y + 27;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.1, i * 0.1 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 9, GB, GRID.h - 18, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 4, GB + 10, GRID.h - 8, 'pm-out', 10);
    return out;
  }

  function render(si, u) {
    const { b, p } = beatOf(si, u);
    camera(si, u, b, p);
    room(si, b, p);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 5;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 3 ? tr('De route', 'The route') : tr('Hal B', 'Hall B');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing());
      if (b === 1) o.defS = op(span(p, 0.05, 0.4), defDrawing());
      if (b === 2) o.utilS = op(span(p, 0.05, 0.4), utilDrawing());
      if (b >= 3) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, tr('Het product', 'The product', 284), b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b === 4) o.grpB = routeGroup(2, tr('De warmte', 'The heat', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Leidingen', 'Pipes', 150), tr('Pompen', 'Pumps', 150), tr('Warmte', 'Heat', 150), tr('Stoom', 'Steam', 150)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { dropS: fade(b, 0, p, dropDrawing(), 0.1, 0.5), whyS: fade(b, 1, p, whyDrawing()), ...tools(b, p, 2, tr('Moody-diagram', 'Moody chart', 260)) });
      if (si === 2) Object.assign(o, { curveS: fade(b, 0, p, curveDrawing(), 0.1, 0.5), dutyS: fade(b, 1, p, dutyDrawing(), 0, 0.01), ...tools(b, p, 2, tr('Pompkarakteristiek', 'Pump curve', 260)) });
      if (si === 3) Object.assign(o, { passS: fade(b, 0, p, passDrawing(), 0.1, 0.5), giveS: fade(b, 1, p, giveDrawing()), ...tools(b, p, 2, tr('Platenwarmtewisselaar', 'Plate heat exchanger', 260)) });
      if (si === 4) Object.assign(o, { steamS: fade(b, 0, p, steamDrawing(), 0.1, 0.5), condS: fade(b, 1, p, condDrawing()), ...tools(b, p, 2, tr('Condenspot', 'Steam trap', 260)), lossS: fade(b, 3, p, lossDrawing()) });
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
