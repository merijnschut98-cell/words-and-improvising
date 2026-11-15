// The stage of the module intro film "Van het net tot hal B / From the grid to hall B": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, INSTSHIFT, JIJSHIFT, W, H,
// LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as
// the kit's label check measures). The story is drawn in hall B, at the left: the cable from the grid comes in through the
// left wall to the power cabinet with its main fuse, line 3 stands at the right;
// stands at the right; you, the installer and a technician of the grid operator come and go. The panel at the right draws
// each beat as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map). Every part a sentence lights
// is a static data-cue group (build.mjs); this script only fills the panel and shows or hides the room's moving parts.
// The closing scene (the shared Engineering map, then the module's four topics with their levels) is ONE function,
// closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the panel
// (the kit checks that they fit).
/* global CAM, INSTSHIFT, JIJSHIFT, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW, wrapUnits, span, beatStarts */
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
  const IDS = ['power', 'grid', 'rules', 'congestion'];
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

  // ---- the room: who stands there and what is shown, per scene (si) and beat (b).
  // You stand in the hall in s1, s2 and s5 (s5: at the line when the installer comes); the installer stands by the cabinet
  // in s1 and comes to line 3 in the last beat of s5; the technician of the grid operator stands by the wall entry in s4
  function room(si, b, p) {
    const mv = (e, sh) => move(e, sh ? `translate(${sh[0]} ${sh[1]})` : '');
    mv(E['pp-jij'], JIJSHIFT[si]);
    show(E['pp-jij'], si === 0 || si === 4 ? 1 : 0);
    mv(E['pp-installer'], INSTSHIFT[si]);
    show(E['pp-installer'], si === 4 && b === 3 ? span(p, 0, 0.35) : 0);
    show(E['pp-tech'], si === 3 ? (b === 0 ? span(p, 0, 0.35) : 1) : 0);
  }

  // ---- the four topic tiles
  // the route (s1, the last two beats): the module's four topics in two groups, the map before the detail. The two
  // that make the product and let it flow (topics 1 and 2) and the two that count it and plan its capacity (topics 3
  // and 4), each row with its number and its index title, wrapped by the kit's widths into 240 units left of the
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
  // tool names as chips high in the panel under the strip (one short sentence names them; they are not
  // explained). Shown in the beat of the sentence (b === at); a topic with one tool leaves the second out
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');

  // ---- s1: line 3 gets its power from the grid, and what power is. Panel under the heading (y from 60).
  function flowDrawing() {
    const box = (y, a, b, cls) => rect(334, y, 284, 52, cls, 8) + txt(346, y + 34, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
    return box(64, 'Het net', 'The grid', 'pm-card') + arrow(476, 120, 476, 146) + box(150, 'Hal B', 'Hall B', 'pm-card') + arrow(476, 206, 476, 232) + box(236, 'Lijn 3', 'Line 3', 'pm-crit')
      + txt(334, 326, tr('stroom van buiten', 'power from outside', 284), 22, 'start', 'pm-mute');
  }
  function defDrawing() {
    return rect(334, 64, 284, 100, 'pm-card', 8) + txt(346, 96, tr('Vermogen', 'Power', 260), 22, 'start', 'pm-big')
      + txt(346, 126, tr('hoe snel je energie', 'how fast you use', 260), 22, 'start', 'pm-mute') + txt(346, 152, tr('gebruikt', 'energy', 260), 22, 'start', 'pm-mute')
      + arrow(476, 170, 476, 200) + rect(334, 204, 284, 76, 'pm-crit', 8) + txt(346, 236, tr('Het net is gebouwd', 'The grid is built', 260), 22, 'start', 'pm-on') + txt(346, 264, tr('voor de piek', 'for the peak', 260), 22, 'start', 'pm-on');
  }

  // ---- s2: voltage, current and power; the peak the grid is built for.
  function vaDrawing() {
    const row = (y, a, b, c, d) => rect(334, y, 284, 62, 'pm-tile', 8) + txt(346, y + 26, tr(a, b, 260), 22, 'start', 'pm-big') + txt(346, y + 50, tr(c, d, 260), 22, 'start', 'pm-mute');
    return row(100, 'Spanning', 'Voltage', 'de druk', 'the pressure') + row(170, 'Stroom', 'Current', 'de doorstroming', 'the flow') + row(240, 'Vermogen', 'Power', 'hoe snel energie gaat', 'how fast energy goes');
  }
  function peakDrawing() {
    const hs = [26, 24, 30, 44, 66, 96, 128, 88, 52, 36, 30, 26];
    let s = '';
    hs.forEach((h, i) => { s += rect(336 + i * 24, 270 - h, 20, h, i === 6 ? 'pm-crit' : 'pm-bar', 3); });
    return s + path('M334 272H618', 'pm-link') + txt(480, 120, tr('piek', 'peak', 120), 22, 'middle', 'pm-big') + arrow(480, 126, 480, 138)
      + txt(334, 312, tr('niet het jaartotaal', 'not the yearly total', 284), 22, 'start', 'pm-mute');
  }

  // ---- s3: the voltage levels from high to low (TenneT at the top, the regional operators below).
  function ladDrawing(b, p) {
    const rows = [[tr('Hoogspanning', 'High voltage', 200), '380 kV'], [tr('Middenspanning', 'Medium voltage', 200), '10 kV'], [tr('Laagspanning', 'Low voltage', 200), '400 V']];
    let s = '';
    rows.forEach(([name, num], i) => {
      const y = 100 + i * 58;
      s += op(b === 0 ? span(p, 0.1 + i * 0.2, 0.4 + i * 0.2) : 1, rect(334, y, 284, 44, i === 0 ? 'pm-crit' : 'pm-tile', 8) + txt(346, y + 31, name, 22, 'start', i === 0 ? 'pm-on' : 'pm-txt') + txt(606, y + 31, num, 22, 'end', i === 0 ? 'pm-on' : 'pm-big')
        + (i < 2 ? arrow(600, y + 46, 600, y + 58) : ''));
    });
    return s + txt(334, 304, tr('omlaag dicht bij', 'down close to', 284), 22, 'start', 'pm-mute') + txt(334, 330, tr('de gebruiker', 'the user', 284), 22, 'start', 'pm-mute');
  }

  // ---- s4: who does what. One card per role, one for the regulator.
  function roleCard(y, a, b, c, d, cls = 'pm-card') {
    return rect(334, y, 284, 58, cls, 8) + txt(346, y + 25, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 49, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  }
  const nbDrawing = () => roleCard(100, 'Netbeheerder', 'Grid operator', 'kabel tot jouw aansluiting', 'cable to your connection', 'pm-crit');
  const tnDrawing = () => roleCard(168, 'TenneT', 'TenneT', 'het hoogste net', 'the highest grid');
  const lvDrawing = () => roleCard(232, 'Leverancier', 'Supplier', 'verkoopt de energie', 'sells the energy');
  const toeDrawing = () => roleCard(300, 'Toezichthouder', 'Regulator', 'regels en tarieven', 'rules and tariffs');

  // ---- s5: a full grid, the queue, and a day in which line 3 moves out of the peak.
  function fullDrawing() {
    const full = [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1];
    let s = '';
    full.forEach((f, i) => { s += rect(334 + (i % 6) * 48, 100 + Math.floor(i / 6) * 48, 42, 42, f ? 'pm-full' : 'pm-tile', 5); });
    return s + circ(334 + 3 * 48 + 21, 100 + 1 * 48 + 21, 9, 'pm-crit') + txt(334, 318, tr('rood is vol', 'red is full', 284), 22, 'start', 'pm-big') + txt(334, 346, tr('hal B zit in een vol gebied', 'hall B is in a full area', 284), 22, 'start', 'pm-mute');
  }
  function queDrawing() {
    let s = '';
    for (let i = 0; i < 5; i++) s += rect(334 + i * 58, 104, 48, 48, i === 4 ? 'pm-crit' : 'pm-bar', 6);
    s += txt(334, 190, tr('de wachtrij', 'the queue', 284), 22, 'start', 'pm-mute') + txt(618, 190, tr('lijn 3', 'line 3', 100), 22, 'end', 'pm-big');
    return s + rect(334, 224, 284, 76, 'pm-card', 8) + txt(346, 256, tr('vaak 5 tot 10 jaar', 'often 5 to 10 years', 260), 22, 'start', 'pm-big') + txt(346, 284, tr('een nieuw onderstation', 'a new substation', 260), 22, 'start', 'pm-mute');
  }
  function flexDrawing() {
    const hs = [34, 30, 38, 60, 96, 128, 136, 116, 70, 44, 36, 32];
    let s = '';
    hs.forEach((h, i) => { s += rect(336 + i * 24, 262 - h, 20, h, i >= 4 && i <= 7 ? 'pm-full' : 'pm-bar', 3); });
    s += rect(336, 262 - 34 - 26, 20, 26, 'pm-crit', 3) + rect(360, 262 - 30 - 26, 20, 26, 'pm-crit', 3);
    return s + path('M334 262H618', 'pm-link') + path('M334 148H618', 'pm-dash') + txt(618, 138, tr('grens', 'limit', 120), 22, 'end', 'pm-mute')
      + path('M470 122Q420 96 370 126', 'pm-arrow') + path('M376 116L368 127L381 130', 'pm-arrow')
      + txt(334, 304, tr('een paar piekuren', 'a few peak hours', 284), 22, 'start', 'pm-big') + txt(334, 332, tr('lijn 3 schuift weg', 'line 3 moves away', 284), 22, 'start', 'pm-mute');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Process engineering basics lit, the whole sheet and then zoomed to the lit place at 1.5; then the
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
      title = b >= 2 ? tr('De route', 'The route') : tr('Lijn 3', 'Line 3');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing());
      if (b === 1) o.defS = op(span(p, 0.05, 0.4), defDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, tr('De stroom en zijn weg', 'The power and its path', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.grpB = routeGroup(2, tr('Regels en een vol net', 'Rules and a full grid', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Vermogen', 'Power', 150), tr('Het net', 'The grid', 150), tr('Rollen', 'Roles', 150), tr('Een vol net', 'A full grid', 150)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { vaS: fade(b, 0, p, vaDrawing(), 0.1, 0.5), peakS: fade(b, 1, p, peakDrawing()), ...tools(b, p, 2, tr('kVA', 'kVA', 260)) });
      if (si === 2) Object.assign(o, { ladS: b <= 1 ? ladDrawing(b, p) : '', ...tools(b, p, 2, tr('Hoofdzekering', 'Main fuse', 260)) });
      if (si === 3) Object.assign(o, { nbS: b <= 2 ? (b === 0 ? op(span(p, 0.1, 0.5), nbDrawing()) : nbDrawing()) : '', tnS: b === 1 || b === 2 ? (b === 1 ? op(span(p, 0.05, 0.4), tnDrawing()) : tnDrawing()) : '',
        lvS: b === 1 || b === 2 ? (b === 1 ? op(span(p, 0.3, 0.65), lvDrawing()) : lvDrawing()) : '', toeS: fade(b, 2, p, toeDrawing()), ...tools(b, p, 3, tr('Systeemcode', 'System code', 260)) });
      if (si === 4) Object.assign(o, { fullS: fade(b, 0, p, fullDrawing(), 0.1, 0.5), queS: fade(b, 1, p, queDrawing()), flexS: fade(b, 3, p, flexDrawing(), 0.1, 0.6), ...tools(b, p, 2, tr('Capaciteitskaart', 'Capacity map', 260), tr('Flexibel contract', 'Flexible contract', 260)) });
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
