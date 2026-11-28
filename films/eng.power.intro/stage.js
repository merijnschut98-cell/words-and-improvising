// The stage of the module intro film "Van stroom naar beweging / From power to motion": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ,
// MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's
// label check measures). The story is drawn in hall B, at the right: the switchboard on the back wall, line 3 with the
// motor under its belt, the compressor in front with its hose to the line; you appear when you measure and test. The panel
// at the right draws each beat as a schema, labelled "voorbeeld" (hall B's way) or "schema" (the module's map). Every part a
// sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or hides you.
// The closing scene (the shared Engineering map, then the module's four topics with their levels) is ONE function,
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
  const IDS = ['electric', 'motors', 'drives', 'fluid'];
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

  // ---- the room: you stand in the hall at the left in s1 (the whole hall), and are not in the picture after that, so that
  // nothing a beat lights is hidden.
  function room(si) {
    show(E['pp-jij'], si === 0 ? 1 : 0);
  }

  // ---- the four topic tiles
  // the route (s1, the last two beats): the module's four topics in two groups, the map before the detail. The power and
  // the motor that uses it (topics 1 and 2), and starting the motor and carrying power in air and oil (topics 3 and 4),
  // each row with its number and its index title, wrapped by the kit's widths into 240 units left of the number; a
  // title of two lines gets a taller row
  function routeGroup(first, head, a) {
    let y = first === 0 ? 70 : 230;
    let s = txt(334, y, head, 22, 'start', 'pm-mute');
    y += 8;
    for (let i = first; i < first + 2; i++) {
      const lines = wrap(TITLE[i], 240);
      const h = lines.length === 1 ? 34 : lines.length * 22 + 8;
      const y1 = lines.length === 1 ? 25 : 22;
      s += rect(334, y, 284, h, 'pm-tile', 6) + txt(610, y + y1, String(i + 1), 22, 'end', 'pm-on');
      lines.forEach((l, j) => { s += txt(346, y + y1 + j * 22, l, 22, 'start', 'pm-txt'); });
      y += h + 4;
    }
    return op(a, s);
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // tool names as chips high in the panel under the strip (one short sentence names them; they are not explained). Shown in
  // the beat of the sentence (b === at); the second chip of a scene (s4) joins the first, which stays
  const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');

  // ---- s1: hall B's switchboard feeds the motor and the compressor, and what power is. Panel under the heading (y from 60).
  function flowDrawing() {
    const box = (y, a, b, cls) => rect(334, y, 284, 52, cls, 8) + txt(346, y + 34, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
    return box(64, 'Het schakelbord', 'The switchboard', 'pm-card') + arrow(476, 120, 476, 146) + box(150, 'Motor en compressor', 'Motor and compressor', 'pm-card') + arrow(476, 206, 476, 232) + box(236, 'Band en lucht', 'Belt and air', 'pm-crit')
      + txt(334, 326, tr('stroom wordt beweging', 'power becomes motion', 284), 22, 'start', 'pm-mute');
  }
  function defDrawing() {
    const card = (y, a, b, unit, sub1, sub2, cls) => rect(334, y, 284, 88, cls, 8) + txt(346, y + 34, tr(a, b, 170), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(606, y + 34, unit, 22, 'end', cls === 'pm-crit' ? 'pm-on' : 'pm-big')
      + txt(346, y + 68, tr(sub1, sub2, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    return card(64, 'Vermogen', 'Power', 'kW', 'hoe snel', 'how fast', 'pm-card') + arrow(476, 158, 476, 188) + card(194, 'Energie', 'Energy', 'kWh', 'vermogen maal tijd', 'power times time', 'pm-crit');
  }

  // ---- s2: the bill counts kWh and the connection kW; efficiency, the rest is heat.
  function kwDrawing() {
    const row = (y, a, b, unit, cls) => rect(334, y, 284, 66, cls, 8) + txt(346, y + 42, tr(a, b, 190), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt') + txt(606, y + 42, unit, 22, 'end', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
    return row(104, 'De rekening', 'The bill', 'kWh', 'pm-tile') + row(184, 'De aansluiting', 'The connection', 'kW', 'pm-crit')
      + txt(334, 304, tr('niet door elkaar halen', 'do not mix them up', 284), 22, 'start', 'pm-mute');
  }
  function effDrawing() {
    return txt(334, 116, tr('rendement', 'efficiency', 284), 22, 'start', 'pm-mute') + rect(334, 134, 250, 44, 'pm-crit', 6) + rect(584, 134, 34, 44, 'pm-full', 6)
      + txt(334, 210, tr('beweging', 'motion', 150), 22, 'start', 'pm-big') + txt(618, 210, tr('warmte', 'heat', 100), 22, 'end', 'pm-mute')
      + txt(334, 266, tr('het deel dat als', 'the share that is', 284), 22, 'start', 'pm-mute') + txt(334, 294, tr('beweging overblijft', 'left as motion', 284), 22, 'start', 'pm-big');
  }

  // ---- s3: what a motor drives, the stator with the rotor, the half load.
  function motDrawing() {
    const items = [[tr('Pompen', 'Pumps', 220), 0], [tr('Ventilatoren', 'Fans', 220), 0], [tr('Transportbanden', 'Conveyors', 220), 1], [tr('Compressoren', 'Compressors', 220), 0]];
    let s = '';
    items.forEach(([name, hot], i) => { s += rect(334, 104 + i * 54, 284, 46, hot ? 'pm-crit' : 'pm-tile', 6) + txt(346, 135 + i * 54, name, 22, 'start', hot ? 'pm-on' : 'pm-txt'); });
    return s + txt(334, 346, tr('allemaal een motor', 'all driven by a motor', 284), 22, 'start', 'pm-mute');
  }
  function fieldDrawing() {
    return txt(476, 128, tr('stator', 'stator', 120), 22, 'middle', 'pm-mute') + circ(476, 214, 78, 'pm-bar') + circ(476, 214, 62, 'pm-panel') + circ(476, 214, 40, 'pm-crit')
      + txt(476, 222, tr('rotor', 'rotor', 70), 22, 'middle', 'pm-on')
      + txt(334, 326, tr('draaiend veld', 'rotating field', 284), 22, 'start', 'pm-big') + txt(334, 354, tr('sleept de rotor mee', 'drags the rotor along', 284), 22, 'start', 'pm-mute');
  }
  function loadDrawing() {
    return txt(334, 182, tr('vaak de helft of minder', 'often half or less', 284), 22, 'start', 'pm-mute') + rect(334, 200, 284, 34, 'pm-bar', 6) + rect(334, 200, 142, 34, 'pm-crit', 6)
      + txt(334, 266, tr('belasting', 'load', 150), 22, 'start', 'pm-big');
  }

  // ---- s4: the spike of a direct start, the soft starter's ramp, the VFD's speed. The chips stand at y 96 and 136.
  function peakDrawing() {
    return txt(334, 116, tr('direct inschakelen', 'switching on directly', 284), 22, 'start', 'pm-mute')
      + rect(350, 160, 76, 150, 'pm-full', 4) + rect(462, 270, 76, 40, 'pm-bar', 4) + path('M334 310H618', 'pm-link')
      + txt(388, 340, tr('piek', 'spike', 110), 22, 'middle', 'pm-big') + txt(500, 340, tr('nominaal', 'rated', 110), 22, 'middle', 'pm-mute');
  }
  function softDrawing() {
    return path('M346 326V224H610', 'pm-gap') + path('M346 326L500 224H610', 'pm-arrow') + path('M334 326H618', 'pm-link')
      + path('M346 366H376', 'pm-gap') + txt(384, 373, tr('direct', 'direct', 80), 22, 'start', 'pm-mute') + path('M480 366H510', 'pm-arrow') + txt(518, 373, tr('zacht', 'soft', 90), 22, 'start', 'pm-mute');
  }
  function speedDrawing() {
    const box = (y, a, b, cls) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');
    return box(196, 'frequentie', 'frequency', 'pm-tile') + arrow(476, 244, 476, 262) + box(266, 'toerental', 'speed', 'pm-crit')
      + txt(334, 346, tr('traploos', 'smoothly', 284), 22, 'start', 'pm-mute');
  }

  // ---- s5: compressed air, the leaks, the leak test, the oil.
  function airDrawing() {
    return txt(334, 116, tr('de compressor', 'the compressor', 284), 22, 'start', 'pm-mute') + rect(334, 134, 284, 44, 'pm-full', 6) + rect(334, 134, 30, 44, 'pm-crit', 6)
      + txt(334, 210, tr('werk', 'work', 100), 22, 'start', 'pm-big') + txt(618, 210, tr('warmte', 'heat', 100), 22, 'end', 'pm-mute')
      + txt(334, 266, tr('zo’n 10% werk', 'around 10% work', 284), 22, 'start', 'pm-big') + txt(334, 294, tr('de rest is warmte', 'the rest is heat', 284), 22, 'start', 'pm-mute');
  }
  function leakDrawing() {
    let s = rect(334, 130, 160, 50, 'pm-tile', 8) + txt(346, 162, tr('Compressor', 'Compressor', 140), 22, 'start', 'pm-txt') + arrow(494, 155, 618, 155);
    [[516, 186], [556, 194], [596, 186]].forEach(([x, y]) => { s += circ(x, y, 6, 'pm-full'); });
    return s + txt(334, 266, tr('lekken', 'leaks', 150), 22, 'start', 'pm-big') + txt(334, 294, tr('koppelingen en slangen', 'couplings and hoses', 284), 22, 'start', 'pm-mute');
  }
  function testDrawing() {
    return txt(334, 182, tr('weekend, geen productie', 'weekend, no production', 284), 22, 'start', 'pm-mute') + rect(334, 200, 284, 34, 'pm-bar', 6) + rect(334, 200, 84, 34, 'pm-crit', 6)
      + txt(334, 266, tr('compressor in last', 'compressor loaded', 284), 22, 'start', 'pm-big') + txt(334, 294, tr('is wat weglekt', 'is what leaks', 284), 22, 'start', 'pm-mute');
  }
  function hydDrawing() {
    return txt(334, 116, tr('hydrauliek', 'hydraulics', 284), 22, 'start', 'pm-mute') + rect(346, 150, 200, 62, 'pm-bar', 4) + rect(446, 146, 10, 70, 'pm-crit', 2) + rect(456, 174, 156, 14, 'pm-lvl', 3)
      + txt(346, 246, tr('olie onder druk', 'oil under pressure', 270), 22, 'start', 'pm-mute') + txt(334, 310, tr('grote kracht', 'large force', 284), 22, 'start', 'pm-big') + txt(334, 338, tr('in een kleine ruimte', 'in a small space', 284), 22, 'start', 'pm-mute');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Motors, drives and fluid power lit, the whole sheet and then zoomed to the lit place at 1.5; then the
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
      const lines = wrap(t, GRID.tile - 12);
      const y0 = y + (GRID.h - (lines.length - 1) * 22) / 2 + 7;
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
    room(si);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 5;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 2 ? tr('De route', 'The route') : tr('Hal B', 'Hall B');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing());
      if (b === 1) o.defS = op(span(p, 0.05, 0.4), defDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, tr('Stroom en motor', 'Power and the motor', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.grpB = routeGroup(2, tr('Aansturen en lucht', 'Control and air', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Elektriciteit', 'Electricity', 190), tr('De motor', 'The motor', 150), tr('Aanlopen', 'Starting', 150), tr('Perslucht', 'Compressed air', 190)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { kwS: fade(b, 0, p, kwDrawing(), 0.1, 0.5), effS: fade(b, 1, p, effDrawing()), tool1: b === 2 ? op(span(p, 0, 0.4), chip(110, tr('Typeplaatje', 'Nameplate'))) : '' });
      if (si === 2) Object.assign(o, { motS: fade(b, 0, p, motDrawing(), 0.1, 0.5), fieldS: fade(b, 1, p, fieldDrawing()), loadS: fade(b, 2, p, loadDrawing(), 0.15, 0.55), tool1: b === 2 ? op(span(p, 0, 0.4), chip(110, tr('Stroomtang', 'Clamp meter'))) : '' });
      if (si === 3) {
        Object.assign(o, { peakS: fade(b, 0, p, peakDrawing(), 0.1, 0.5), softS: fade(b, 1, p, softDrawing(), 0.15, 0.55), speedS: fade(b, 2, p, speedDrawing(), 0.15, 0.55) });
        o.tool1 = b === 1 ? op(span(p, 0, 0.4), chip(96, tr('Softstarter', 'Soft starter'))) : b === 2 ? chip(96, tr('Softstarter', 'Soft starter')) : '';
        o.tool2 = b === 2 ? op(span(p, 0.1, 0.5), chip(136, tr('Frequentieregelaar', 'VFD'))) : '';
      }
      if (si === 4) Object.assign(o, { airS: fade(b, 0, p, airDrawing(), 0.1, 0.5), leakS: fade(b, 1, p, leakDrawing(), 0.1, 0.5), testS: fade(b, 2, p, testDrawing(), 0.15, 0.55), hydS: fade(b, 3, p, hydDrawing(), 0.1, 0.5), tool1: b === 2 ? op(span(p, 0, 0.4), chip(110, tr('Lektest', 'Leak test'))) : '' });
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
