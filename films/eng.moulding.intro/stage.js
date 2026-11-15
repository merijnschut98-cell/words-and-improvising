// The stage of the module intro film "De kap uit de pers / The cover from the press": a pure function of
// (scene, u). Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H,
// LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the
// drawing wraps as the kit's label check measures). The story is drawn in the plant's moulding shop at the
// left: a press along the back wall (the clamp unit with the mould on four tie bars, the injection unit with a
// hopper and a dryer), a temperature control unit with a hose to the mould, a control with a screen, a bin of
// granules, a table with the setting sheet, the cover and the boundary sample and a trolley with a
// mould opened for maintenance; an operator and you, the engineer, come and go. The panel at the right draws
// each beat as a schema, labelled "voorbeeld" (the cover's job) or "schema" (the module's map). Every part a
// sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or hides
// the room's moving parts. The closing scene (the shared Engineering map, then the module's six topics with
// their levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower
// than the panel (the kit checks that they fit).
/* global CAM, OPSHIFT, JIJSHIFT, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW, wrapUnits, span, beatStarts */
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
  const IDS = ['machine', 'cycle', 'materials', 'defects', 'setting', 'moulds'];
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

  // ---- the room: who stands there and what has happened to the cover, per scene (si) and beat (b).
  // The cover lies on the table from the start; s5 shows its two faults and then the boundary sample on its stand;
  // s7 brings the trolley with the opened mould, and you take the cover to hall B (b3)
  function room(si, b, p) {
    // the operator: at the press (s1 to s3), at the hopper (s4), by the table (s6), by the trolley (s7, until you take the cover)
    const sh = OPSHIFT[si];
    move(E['pp-opP'], sh ? `translate(${sh[0]} ${sh[1]})` : '');
    show(E['pp-opP'], si <= 3 || si === 5 || (si === 6 && b <= 2) ? ((si === 0 && b < 1) || (si >= 3 && b === 0 && si !== 6) ? span(p, 0, 0.35) : 1) : 0);
    const js = JIJSHIFT[si];
    move(E['pp-jij'], js ? `translate(${js[0]} ${js[1]})` : '');
    show(E['pp-jij'], si === 0 || si === 4 || (si === 6 && b >= 3) ? 1 : 0);
    // the table (with the cover and the setting sheet) and the control stand in front of the press: they are there
    // when a sentence is about them and out of the way of the press when it is not
    show(E.tableK, si === 0 || si >= 3 ? 1 : 0);
    show(E.controlK, si === 0 || si === 5 ? 1 : 0);
    show(E.coverK, 1);
    show(E.flashK, si === 4 ? span(p, 0, 0.35) : 0);
    show(E.sinkK, si === 4 ? (b === 0 ? span(p, 0, 0.35) : 1) : 0);
    show(E.sampleK, si === 4 && b >= 2 ? (b === 2 ? span(p, 0, 0.35) : 1) : 0);
    show(E.trolleyK, si === 6 ? (b === 0 ? span(p, 0, 0.35) : 1) : 0);
  }

  // ---- the six topic tiles
  // the route (s1, the last two beats): the module's six topics in two groups, the map before the detail. The three
  // that make the cover (topics 1 to 3) and the three that keep it right (topics 4 to 6), each row with its number
  // and its index title, wrapped by the kit's widths into 240 units left of the number; a title of two lines gets a
  // taller row. The second group ends at most at y 376 (three rows, one of them of two lines)
  function routeGroup(first, head, a) {
    let y = first === 0 ? 74 : 232;
    let s = txt(334, y, head, 22, 'start', 'pm-mute');
    y += 8;
    for (let i = first; i < first + 3; i++) {
      const lines = wrap(TITLE[i], 240).slice(0, 2);
      const h = lines.length === 1 ? 34 : 56;
      s += rect(334, y, 284, h, 'pm-tile', 6) + txt(610, y + 25, String(i + 1), 22, 'end', 'pm-on');
      lines.forEach((l, j) => { s += txt(346, y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
      y += h + 6;
    }
    return op(a, s);
  }
  // the topic strip (s2 to s7): six small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3, 4, 5].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // tool names as chips high in the panel under the strip (one short sentence names them; they are not
  // explained). Shown in the beat of the sentence (b === at); a topic with one tool leaves the second out
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');

  // ---- s1: the cover. Granules become a cover in a mould: the press makes it, for line 3 in hall B.
  function coverFlow() {
    return rect(334, 66, 284, 64, 'pm-card', 8) + txt(346, 94, tr('Korrels', 'Granules', 260), 22, 'start', 'pm-big') + txt(346, 120, tr('in de spuitgieterij', 'in the moulding shop', 260), 22, 'start', 'pm-mute')
      + arrow(476, 136, 476, 168)
      + rect(334, 172, 284, 64, 'pm-crit', 8) + txt(346, 200, tr('Kap', 'Cover', 260), 22, 'start', 'pm-on') + txt(346, 226, tr('voor de vuleenheid', 'for the filling unit', 260), 22, 'start', 'pm-on')
      + txt(334, 290, tr('voor lijn 3 in hal B', 'for line 3 in hall B', 284), 22, 'start', 'pm-mute');
  }
  // the definition: granules are melted and injected into a steel mould and set there into the cover
  function shotDrawing() {
    const dots = [[350, 128], [366, 124], [382, 130], [356, 146], [374, 148], [390, 142], [362, 162], [380, 164]].map(([x, y]) => circ(x, y, 4, 'pm-chip')).join('');
    return rect(334, 108, 84, 74, 'pm-card', 8) + dots + arrow(422, 145, 440, 145)
      + rect(444, 108, 50, 74, 'pm-bar', 6) + rect(500, 108, 50, 74, 'pm-bar', 6) + rect(490, 128, 16, 34, 'pm-crit', 3)
      + arrow(554, 145, 570, 145) + rect(574, 124, 32, 42, 'pm-card', 10)
      + txt(376, 214, tr('korrels', 'granules', 96), 22, 'middle', 'pm-mute') + txt(497, 214, tr('matrijs', 'mould', 96), 22, 'middle', 'pm-mute') + txt(608, 214, tr('kap', 'cover', 62), 22, 'end', 'pm-mute')
      + txt(334, 288, tr('spuiten, dan stollen', 'inject, then set', 284), 22, 'start', 'pm-big');
  }

  // ---- s2: the machine. The injection unit melts the plastic and pushes it on; the clamp unit holds the mould shut.
  function pressParts(b, p) {
    const units = rect(334, 100, 284, 62, 'pm-card', 8) + txt(346, 128, tr('Spuitunit', 'Injection unit', 260), 22, 'start', 'pm-big') + txt(346, 152, tr('smelt de kunststof', 'melts the plastic', 260), 22, 'start', 'pm-mute')
      + arrow(476, 166, 476, 194)
      + rect(334, 198, 284, 62, 'pm-crit', 8) + txt(346, 226, tr('Sluitunit', 'Clamp unit', 260), 22, 'start', 'pm-on') + txt(346, 250, tr('houdt de matrijs vast', 'holds the mould', 260), 22, 'start', 'pm-on');
    const clamp = rect(388, 130, 84, 90, 'pm-bar', 6) + rect(480, 130, 84, 90, 'pm-bar', 6) + arrow(334, 175, 382, 175) + arrow(618, 175, 570, 175)
      + txt(334, 268, tr('sluitkracht', 'clamp force', 284), 22, 'start', 'pm-big') + txt(334, 298, tr('tegen de druk', 'against the melt', 284), 22, 'start', 'pm-mute');
    return { pressS: fade(b, 0, p, units, 0.1, 0.5), clampS: fade(b, 1, p, clamp), ...tools(b, p, 2, tr('Geleidekolommen', 'Tie bars', 260)) };
  }

  // ---- s3: cycle and output. One cycle of six steps (closing, injecting, holding, cooling, opening, ejecting) in a
  // loop; the cooling is the longest.
  function cycleBar(hot) {
    const W6 = [28, 20, 40, 120, 28, 48];
    let x = 334;
    let s = '';
    W6.forEach((wd, i) => { s += rect(x, 140, wd, 40, hot && i === 3 ? 'pm-crit' : 'pm-bar', 3); x += wd; });
    return s + path('M618 186Q618 214 592 214H360Q334 214 334 192', 'pm-arrow') + path('M328 200L334 190L341 200', 'pm-arrow');
  }
  function cycleParts(b, p) {
    const one = cycleBar(false) + txt(334, 262, tr('één cyclus', 'one cycle', 284), 22, 'start', 'pm-big') + txt(334, 292, tr('van sluiten tot sluiten', 'from closing to closing', 284), 22, 'start', 'pm-mute');
    const cool = cycleBar(true) + txt(334, 262, tr('koelen duurt het langst', 'cooling takes longest', 284), 22, 'start', 'pm-big') + txt(334, 292, tr('bepaalt de output', 'sets the output', 284), 22, 'start', 'pm-mute');
    return { cycleS: fade(b, 0, p, one), coolS: fade(b, 1, p, cool, 0.05, 0.3), ...tools(b, p, 2, tr('Koelkanalen', 'Cooling channels', 260), tr('Temperatuurregelaar', 'Temperature control unit', 272)) };
  }

  // ---- s4: plastics. Thermoplastics melt and set again; the cover is polycarbonate, which takes up water.
  function plasticsParts(b, p) {
    const row = (y, a, c, cls) => rect(334, y, 284, 52, cls, 8) + txt(346, y + 34, a, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(610, y + 34, c, 22, 'end', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
    const thermo = row(100, tr('Korrels', 'Granules', 150), tr('vast', 'solid', 100), 'pm-card') + arrow(476, 156, 476, 176)
      + row(180, tr('Smelt', 'Melt', 150), tr('vloeibaar', 'liquid', 120), 'pm-crit') + arrow(476, 236, 476, 256)
      + row(260, tr('Kap', 'Cover', 150), tr('weer vast', 'solid again', 120), 'pm-card');
    const pc = rect(334, 100, 284, 84, 'pm-card', 8) + txt(346, 132, tr('Polycarbonaat', 'Polycarbonate', 260), 22, 'start', 'pm-big') + txt(346, 164, tr('bijna onbreekbaar', 'hard to break', 260), 22, 'start', 'pm-mute')
      + [400, 450, 500].map((x, i) => circ(x, 212 + (i % 2) * 14, 7, 'pm-hole') + arrow(x, 232 + (i % 2) * 14, x, 252)).join('')
      + rect(334, 258, 284, 52, 'pm-crit', 8) + txt(346, 292, tr('neemt water op', 'absorbs water', 260), 22, 'start', 'pm-on');
    return { thermoS: fade(b, 0, p, thermo, 0.1, 0.5), pcS: fade(b, 1, p, pc), ...tools(b, p, 2, tr('Droger', 'Dryer', 260)) };
  }

  // ---- s5: defects. Flash is plastic where it does not belong, a sink mark is a dent above a thick part; the
  // boundary sample is the product on the limit between good and bad.
  function defectParts(b, p) {
    const top = rect(346, 108, 190, 104, 'pm-card', 22) + circ(420, 160, 10, 'pm-hole') + rect(536, 140, 16, 40, 'pm-chip', 2)
      + txt(420, 256, tr('inzakplek', 'sink mark', 150), 22, 'middle', 'pm-txt') + txt(560, 256, tr('braam', 'flash', 90), 22, 'middle', 'pm-txt')
      + arrow(420, 236, 420, 176) + arrow(560, 236, 556, 188);
    const flash = rect(350, 104, 110, 46, 'pm-bar', 4) + rect(472, 104, 110, 46, 'pm-bar', 4) + rect(460, 118, 12, 16, 'pm-chip', 2)
      + txt(334, 182, tr('braam', 'flash', 284), 22, 'start', 'pm-big') + txt(334, 210, tr('op de deellijn', 'on the parting line', 284), 22, 'start', 'pm-mute');
    const sink = rect(350, 240, 232, 44, 'pm-bar', 4) + path('M440 240Q470 258 500 240Z', 'pm-crit')
      + txt(334, 316, tr('inzakplek', 'sink mark', 284), 22, 'start', 'pm-big') + txt(334, 344, tr('boven een dik deel', 'over a thick part', 284), 22, 'start', 'pm-mute');
    return { defS: fade(b, 0, p, top, 0.1, 0.5), defX: fade(b, 1, p, flash + sink), ...tools(b, p, 2, tr('Grensmonster', 'Boundary sample', 260)) };
  }

  // ---- s6: process setting. Five groups of settings decide the part; they influence each other; the setting sheet is
  // the approved list for this mould on this press.
  function settingParts(b, p) {
    const names = [tr('Temperaturen', 'Temperatures', 260), tr('Inspuitsnelheid', 'Injection speed', 260), tr('Omschakelpunt', 'Switchover point', 260), tr('Nadruk', 'Holding pressure', 260), tr('Koeltijd', 'Cooling time', 260)];
    const five = names.map((nm, i) => rect(334, 100 + i * 40, 284, 34, 'pm-tile', 6) + txt(346, 125 + i * 40, nm, 22, 'start', 'pm-txt')).join('');
    const link = [[404, 150], [548, 150], [476, 252]].map(([x, y]) => circ(x, y, 28, 'pm-card')).join('')
      + path('M432 150H520M420 174L462 228M532 174L490 228', 'pm-link') + txt(334, 340, tr('ze beïnvloeden elkaar', 'they affect each other', 284), 22, 'start', 'pm-big');
    return { fiveS: fade(b, 0, p, five, 0.1, 0.5), linkS: fade(b, 1, p, link), ...tools(b, p, 2, tr('Instelkaart', 'Setting sheet', 260)) };
  }

  // ---- s7: moulds. The mould is the costly part made for this cover; it is kept up before it breaks; then the cover
  // is good and goes to hall B.
  function mouldParts(b, p) {
    const mould = rect(350, 112, 110, 116, 'pm-bar', 6) + rect(474, 112, 110, 116, 'pm-bar', 6) + rect(460, 138, 14, 64, 'pm-crit', 2)
      + txt(334, 264, tr('het dure deel', 'the costly part', 284), 22, 'start', 'pm-big') + txt(334, 294, tr('alleen voor deze kap', 'only for this cover', 284), 22, 'start', 'pm-mute');
    const care = rect(334, 150, 284, 26, 'pm-bar', 4) + rect(334, 150, 212, 26, 'pm-card', 4) + rect(540, 130, 8, 66, 'pm-crit', 2)
      + txt(334, 234, tr('onderhoud', 'maintenance', 284), 22, 'start', 'pm-big') + txt(334, 264, tr('voordat hij stukgaat', 'before it breaks', 284), 22, 'start', 'pm-mute');
    // under the topic strip (which ends at y 84)
    const ship = rect(334, 104, 284, 50, 'pm-card', 8) + txt(346, 136, tr('De kap is goed', 'The cover is good', 260), 22, 'start', 'pm-big')
      + arrow(476, 160, 476, 190) + rect(334, 194, 284, 66, 'pm-crit', 8) + txt(346, 222, tr('Hal B, lijn 3', 'Hall B, line 3', 260), 22, 'start', 'pm-on') + txt(346, 248, tr('de vuleenheid', 'the filling unit', 260), 22, 'start', 'pm-on');
    return { mouldS: fade(b, 0, p, mould), careS: fade(b, 1, p, care), ...tools(b, p, 2, tr('Heetkanaal', 'Hot runner', 260), tr('Shotteller', 'Shot counter', 260)), ship: fade(b, 3, p, ship) };
  }

  // ---- s8: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Injection moulding lit, the whole sheet and then zoomed to the lit place at 1.5; then the module's six
  // topics, each with its four levels as columns (the words the app uses for the levels), the start marker on the first
  // level of the first topic.
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
    const out = { r: ['', '', '', '', '', ''], lv1: '', lv2: '', lv3: '', lv4: '', start: '' };
    const lv = ['lv1', 'lv2', 'lv3', 'lv4'];
    LW.forEach((wd, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, wd, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, GRID.h, 'pm-tile', 8);
      const lines = wrap(t, GRID.tile - 12).slice(0, 2);
      const y0 = lines.length === 1 ? y + 32 : y + 21;
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
    const o = { r: ['', '', '', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 7;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 2 ? tr('De route', 'The route') : tr('De kap', 'The cover');
      if (b === 0) o.flow = op(span(p, 0.05, 0.4), coverFlow());
      if (b === 1) o.shotS = op(span(p, 0.05, 0.4), shotDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.cutters = routeGroup(0, tr('De kap maken', 'Making the cover'), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.support = routeGroup(3, tr('De kap goed houden', 'Keeping it right'), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 6) {
      title = [tr('Machine', 'Machine', 150), tr('Cyclus', 'Cycle', 150), tr('Kunststoffen', 'Plastics', 150), tr('Fouten', 'Defects', 150), tr('Instellen', 'Setting', 150), tr('Matrijzen', 'Moulds', 150)][si - 1];
      o.r = strip(si - 1);
      Object.assign(o, [pressParts, cycleParts, plasticsParts, defectParts, settingParts, mouldParts][si - 1](b, p));
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
    for (let i = 0; i < 6; i++) set(E[`r${i}`], o.r[i]);
    for (const k2 of KEYS) set(E[`k_${k2}`], o[k2]);
  }

  return { render };
})();
