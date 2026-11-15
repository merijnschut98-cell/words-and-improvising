// The stage of the module intro film "De kast in hal B / The cabinet in hall B": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, INSTSHIFT, JIJSHIFT, W, H,
// LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as
// the kit's label check measures). The story is drawn in hall B, at the left: the cable from the grid comes in through the
// left wall to the cabinet, a row of two panels along the back wall, line 3 stands at the right; you and the installer come
// and go. The panel at the right draws each beat as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's
// map). Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or
// hides the room's moving parts. The closing scene (the shared Engineering map, then the module's four topics with their
// levels) is ONE function, closing; the map itself is the kit's mapScene.
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
  const IDS = ['devices', 'stations', 'protection', 'switching'];
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
  // You stand in the hall in s1 and s5 (s5: at some distance from the cabinet, you touch nothing); the installer comes to
  // the cabinet in the relay beat of s4 and stays for s5
  function room(si, b, p) {
    const mv = (e, sh) => move(e, sh ? `translate(${sh[0]} ${sh[1]})` : '');
    mv(E['pp-jij'], JIJSHIFT[si]);
    show(E['pp-jij'], si === 0 || si === 4 ? 1 : 0);
    mv(E['pp-installer'], INSTSHIFT[si]);
    show(E['pp-installer'], si === 3 && b === 3 ? span(p, 0, 0.35) : si === 4 && b >= 2 ? (b === 2 ? span(p, 0, 0.35) : 1) : 0);
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

  // ---- s1: the power comes into the cabinet and goes on to line 3; what switchgear does. Panel under the heading (y from 60).
  function flowDrawing() {
    const box = (y, a, b, cls) => rect(334, y, 284, 40, cls, 8) + txt(346, y + 28, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
    const rows = [['Het net', 'The grid'], ['De kast', 'The cabinet'], ['Transformator', 'Transformer'], ['Schakelbord', 'Switchboard'], ['Lijn 3', 'Line 3']];
    let s = '';
    rows.forEach(([n, e], i) => { s += box(62 + i * 58, n, e, i === 1 ? 'pm-crit' : 'pm-card') + (i < 4 ? arrow(476, 104 + i * 58, 476, 118 + i * 58) : ''); });
    return s + txt(334, 366, tr('de stroom van buiten', 'power from outside', 284), 22, 'start', 'pm-mute');
  }
  function defDrawing() {
    const row = (y, a, b, c, d) => rect(334, y, 284, 62, 'pm-tile', 8) + txt(346, y + 26, tr(a, b, 260), 22, 'start', 'pm-big') + txt(346, y + 50, tr(c, d, 260), 22, 'start', 'pm-mute');
    return row(100, 'Schakelen', 'Switching', 'stroom aan en uit', 'power on and off') + row(170, 'Beveiligen', 'Protecting', 'bij een fout', 'at a fault') + row(240, 'Scheiden', 'Isolating', 'om veilig te werken', 'to work safely');
  }

  // ---- s2: two questions for every device; normal current against a fault
  function askDrawing() {
    const card = (y, a, b, c, d, cls) => rect(334, y, 284, 74, cls, 8) + txt(346, y + 32, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 60, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return card(110, 'Inschakelen', 'Switching on', 'wat kan het aan?', 'what can it take?', 'pm-card') + card(206, 'Onderbreken', 'Breaking', 'wat kan het stoppen?', 'what can it stop?', 'pm-crit');
  }
  function curDrawing() {
    return rect(344, 232, 70, 36, 'pm-bar', 3) + rect(504, 120, 70, 148, 'pm-crit', 3) + path('M334 270H618', 'pm-link')
      + txt(379, 300, tr('normaal', 'normal', 130), 22, 'middle', 'pm-big') + txt(539, 300, tr('fout', 'fault', 130), 22, 'middle', 'pm-big')
      + txt(334, 340, tr('een fout komt harder aan', 'a fault hits harder', 284), 22, 'start', 'pm-mute');
  }

  // ---- s3: a row of panels; air against gas
  function rowDrawing() {
    let s = '';
    for (let i = 0; i < 2; i++) s += rect(334 + i * 148, 110, 136, 130, i === 0 ? 'pm-crit' : 'pm-card', 8) + txt(402 + i * 148, 182, tr('Veld', 'Panel', 120), 22, 'middle', i === 0 ? 'pm-on' : 'pm-big');
    return s + txt(334, 282, tr('een rij stalen kasten', 'a row of steel cabinets', 284), 22, 'start', 'pm-mute');
  }
  function mediumDrawing() {
    return rect(334, 100, 150, 160, 'pm-card', 8) + txt(346, 186, tr('Lucht', 'Air', 126), 22, 'start', 'pm-big') + txt(346, 214, tr('groot', 'big', 126), 22, 'start', 'pm-mute')
      + rect(500, 160, 118, 100, 'pm-crit', 8) + txt(512, 206, tr('Gas', 'Gas', 98), 22, 'start', 'pm-on') + txt(512, 234, tr('compact', 'compact', 100), 22, 'start', 'pm-on');
  }

  // ---- s4: a short circuit at line 3; measure, compare, open; a wrong setting
  function faultDrawing() {
    return rect(334, 100, 284, 52, 'pm-card', 8) + txt(346, 133, tr('De kast', 'The cabinet', 260), 22, 'start', 'pm-big')
      + path('M476 154V182L492 194L460 212L476 224V246', 'pm-gap') + txt(504, 202, tr('fout', 'fault', 110), 22, 'start', 'pm-big')
      + rect(334, 250, 284, 52, 'pm-card', 8) + txt(346, 283, tr('Lijn 3', 'Line 3', 260), 22, 'start', 'pm-big')
      + txt(334, 340, tr('een kortsluiting', 'a short circuit', 284), 22, 'start', 'pm-mute');
  }
  function stepsDrawing() {
    const row = (y, a, b, c, d, cls) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return row(100, 'Meten', 'Measure', 'de stroom', 'the current', 'pm-tile') + arrow(476, 164, 476, 172) + row(174, 'Vergelijken', 'Compare', 'met de instelling', 'with the setting', 'pm-tile')
      + arrow(476, 238, 476, 246) + row(248, 'Openen', 'Open', 'de schakelaar', 'the breaker', 'pm-crit');
  }
  function setDrawing() {
    const card = (y, a, b, c, d) => rect(334, y, 284, 74, 'pm-card', 8) + txt(346, y + 32, tr(a, b, 260), 22, 'start', 'pm-big') + txt(346, y + 60, tr(c, d, 260), 22, 'start', 'pm-mute');
    return txt(334, 116, tr('een verkeerde instelling', 'a wrong setting', 284), 22, 'start', 'pm-mute') + card(132, 'Te vaak open', 'Opens too often', 'ongewenst uit', 'unwanted trips') + card(228, 'Nooit open', 'Never opens', 'de fout blijft', 'the fault stays');
  }

  // ---- s5: working dead; the five rules in order; who is appointed
  function liveDrawing() {
    return rect(334, 100, 284, 62, 'pm-card', 8) + txt(346, 126, tr('Onder spanning', 'Live', 260), 22, 'start', 'pm-big') + txt(346, 150, tr('niet aanraken', 'do not touch', 260), 22, 'start', 'pm-mute')
      + arrow(476, 168, 476, 204) + rect(334, 208, 284, 62, 'pm-crit', 8) + txt(346, 234, tr('Spanningsloos', 'Dead', 260), 22, 'start', 'pm-on') + txt(346, 258, tr('uit en veilig gemaakt', 'off and made safe', 260), 22, 'start', 'pm-on');
  }
  function rulesDrawing() {
    const names = [['Vrijschakelen', 'Disconnect'], ['Slot en label', 'Lock and tag'], ['Spanningsloos meten', 'Verify dead'], ['Aarden en kortsluiten', 'Earth and short'], ['Afschermen', 'Shield']];
    let s = '';
    names.forEach(([a, b], i) => {
      const y = 100 + i * 46;
      s += rect(334, y, 284, 38, 'pm-tile', 6) + rect(334, y, 38, 38, 'pm-crit', 6) + txt(353, y + 27, String(i + 1), 22, 'middle', 'pm-on') + txt(382, y + 27, tr(a, b, 230), 22, 'start', 'pm-txt');
    });
    return s;
  }
  function whoDrawing() {
    const card = (y, a, b, c, d, cls) => rect(334, y, 284, 74, cls, 8) + txt(346, y + 32, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 60, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return card(110, 'Installateur', 'Installer', 'aangewezen', 'appointed', 'pm-crit') + card(206, 'Jij', 'You', 'raakt niets aan', 'touch nothing', 'pm-card');
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
      title = b >= 2 ? tr('De route', 'The route') : tr('De kast', 'The cabinet');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing());
      if (b === 1) o.defS = op(span(p, 0.05, 0.4), defDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, tr('De apparatuur', 'The equipment', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.grpB = routeGroup(2, tr('Fout en veiligheid', 'Faults and safety', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Apparaten', 'Devices', 150), tr('Installaties', 'Installations', 150), tr('Beveiliging', 'Protection', 150), tr('Veilig', 'Safely', 150)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { askS: fade(b, 0, p, askDrawing(), 0.1, 0.5), curS: fade(b, 1, p, curDrawing()), ...tools(b, p, 2, tr('Vermogensschakelaar', 'Circuit breaker', 260), tr('Lastscheider', 'Load-break switch', 260)) });
      if (si === 2) Object.assign(o, { rowS: fade(b, 0, p, rowDrawing(), 0.1, 0.5), mediumS: fade(b, 1, p, mediumDrawing()), ...tools(b, p, 2, tr('RMU', 'RMU', 260)) });
      if (si === 3) Object.assign(o, { faultS: fade(b, 0, p, faultDrawing(), 0.1, 0.5), stepsS: fade(b, 1, p, stepsDrawing()), setS: fade(b, 2, p, setDrawing()), ...tools(b, p, 3, tr('Beveiligingsrelais', 'Protection relay', 260)) });
      if (si === 4) Object.assign(o, { liveS: fade(b, 0, p, liveDrawing(), 0.1, 0.5), rulesS: fade(b, 1, p, rulesDrawing()), whoS: fade(b, 2, p, whoDrawing()), ...tools(b, p, 3, tr('Spanningzoeker', 'Voltage detector', 260), tr('Aardgarnituur', 'Earthing set', 260)) });
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
