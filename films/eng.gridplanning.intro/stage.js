// The stage of the module intro film "Waarom lijn 3 moet wachten / Why line 3 has to wait": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left: the cable from the grid comes in through the left wall to the power
// cabinet with a dashed cable beside it (the heavier connection, not laid yet), line 3 stands at the right; you and a grid
// planner come and go. The panel at the right draws each beat as a schema, labelled "voorbeeld" (line 3's way) or "schema"
// (the module's map). Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel
// and shows or hides the room's moving parts. The closing scene (the shared Engineering map, then the module's four topics
// with their levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a literal tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the
// panel (the kit checks that they fit).
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
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const head = dy === 0 ? `M${f1(x1 - 6 * dx)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6 * dx)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * dy)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * dy)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const IDS = ['load', 'design', 'invest', 'flex'];
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

  // ---- the room: who stands there, per scene (si) and beat (b). The planner stands by the wall entry from the first beat
  // on (he fades in while the first sentence is said); you stand in the hall in the opening scene only.
  function room(si, b, p) {
    show(E['pp-jij'], si === 0 ? 1 : 0);
    show(E['pp-planner'], si === 0 ? (b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.6) : 1) : si <= 4 ? 1 : 0);
  }

  // ---- the four topic tiles
  // the route (s1, the last two beats): the module's four topics in two groups, the map before the detail. The two
  // about what is coming and whether the grid holds (topics 1 and 2) and the two about what gets built and how you
  // buy time (topics 3 and 4), each row with its number and its index title, wrapped by the kit's widths into 240 units
  // left of the number; a title of more lines gets a taller row
  function routeGroup(first, head, a) {
    let y = first === 0 ? 74 : 236;
    let s = txt(334, y, head, 22, 'start', 'pm-mute');
    y += 8;
    for (let i = first; i < first + 2; i++) {
      const lines = wrap(TITLE[i], 240);
      const h = lines.length * 22 + 12;
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
    const chip = (y, label) => (Array.isArray(label)
      ? rect(334, y, 284, 58, 'pm-badge', 6) + txt(342, y + 25, label[0], 22, 'start', 'pm-txt') + txt(342, y + 49, label[1], 22, 'start', 'pm-txt')
      : rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt'));
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');

  // ---- s1: line 3 waits for a heavier connection, and the planner asks how much power flows at once. Panel under the heading (y from 60).
  function waitDrawing() {
    return txt(334, 84, tr('de aansluiting', 'the connection', 284), 22, 'start', 'pm-mute')
      + rect(334, 98, 110, 44, 'pm-card', 8) + txt(346, 128, tr('nu', 'now', 90), 22, 'start', 'pm-big')
      + rect(334, 160, 284, 44, 'pm-crit', 8) + txt(346, 190, tr('lijn 3 vraagt meer', 'line 3 asks for more', 260), 22, 'start', 'pm-on')
      + arrow(476, 212, 476, 240)
      + rect(334, 248, 284, 52, 'pm-card', 8) + txt(346, 281, tr('wacht op zijn beurt', 'waits its turn', 260), 22, 'start', 'pm-big');
  }
  function nowDrawing() {
    let s = rect(334, 64, 284, 44, 'pm-card', 8) + txt(346, 94, tr('hoeveel vermogen?', 'how much power?', 260), 22, 'start', 'pm-big');
    s += rect(372, 214, 76, 80, 'pm-bar', 4) + rect(500, 144, 76, 150, 'pm-crit', 4) + path('M334 296H618', 'pm-link') + arrow(460, 190, 492, 160);
    return s + txt(410, 326, tr('nu', 'now', 100), 22, 'middle', 'pm-mute') + txt(538, 326, tr('straks', 'later', 110), 22, 'middle', 'pm-big');
  }

  // ---- s2: simultaneity (three peaks that do not meet), then the growth of demand towards a limit.
  function gelDrawing() {
    let s = '';
    for (let i = 0; i < 3; i++) s += rect(334 + i * 36, 238, 30, 56, 'pm-bar', 4);
    s += path('M334 296H618', 'pm-link');
    s += rect(470, 124, 56, 170, 'pm-out', 4) + rect(562, 194, 56, 100, 'pm-crit', 4);
    s += txt(334, 322, tr('elk een piek', 'each a peak', 130), 22, 'start', 'pm-mute');
    s += txt(498, 350, tr('opgeteld', 'added up', 120), 22, 'middle', 'pm-mute');
    return s + txt(618, 322, tr('samen', 'together', 100), 22, 'end', 'pm-big');
  }
  function growDrawing() {
    const hs = [40, 46, 54, 62, 74, 90, 110];
    let s = '';
    hs.forEach((h, i) => { s += rect(336 + i * 40, 296 - h, 34, h, i >= 5 ? 'pm-full' : 'pm-bar', 3); });
    s += rect(336 + 2 * 40, 296 - 54 - 34, 34, 34, 'pm-crit', 3);
    return s + path('M334 296H618', 'pm-link') + path('M334 212H618', 'pm-dash') + txt(462, 203, tr('grens', 'limit', 72), 22, 'start', 'pm-mute')
      + txt(334, 326, tr('nu', 'now', 80), 22, 'start', 'pm-mute') + txt(618, 326, tr('later', 'later', 100), 22, 'end', 'pm-mute') + txt(416, 190, tr('lijn 3', 'line 3', 100), 22, 'middle', 'pm-big');
  }

  // ---- s3: the four checks (the last, the reserve, lit), then the ring with a failed cable and the other side feeding.
  function critDrawing() {
    const row = (y, cls, ink, label) => rect(334, y, 284, 46, cls, 8) + txt(346, y + 31, label, 22, 'start', ink);
    return row(100, 'pm-card', 'pm-big', tr('Thermisch', 'Thermal', 260)) + row(156, 'pm-card', 'pm-big', tr('Spanning', 'Voltage', 260))
      + row(212, 'pm-card', 'pm-big', tr('Kortsluiting', 'Short circuit', 260)) + row(268, 'pm-crit', 'pm-on', tr('Reserve', 'Reserve', 260))
      + txt(334, 346, tr('vier toetsen', 'four checks', 284), 22, 'start', 'pm-mute');
  }
  function ringDrawing(p) {
    const ring = path('M510 150H430V290H505', 'pm-link') + path('M510 150H590V290H515', 'pm-link');
    const stn = rect(460, 104, 100, 34, 'pm-card', 6) + txt(510, 128, tr('Station', 'Station', 90), 22, 'middle', 'pm-big') + path('M510 138V150', 'pm-link');
    const hall = rect(334, 196, 86, 34, 'pm-crit', 6) + txt(377, 220, tr('Hal B', 'Hall B', 70), 22, 'middle', 'pm-on') + path('M420 213H430', 'pm-link');
    const cut = path('M418 160L442 184M442 160L418 184', 'pm-gap');
    const feed = path('M510 150H590V290H430V236', 'pm-arrow') + path('M425 244L430 234L435 244', 'pm-arrow');
    return ring + stn + hall + op(span(p, 0.05, 0.4), cut) + op(span(p, 0.5, 0.85), feed);
  }

  // ---- s4: more bottlenecks than people and money; the ranking; line 3 lower in the order.
  function qDrawing() {
    let s = txt(334, 106, tr('knelpunten', 'bottlenecks', 160), 22, 'start', 'pm-mute');
    for (let i = 0; i < 5; i++) s += rect(334, 120 + i * 38, 150, 28, 'pm-bar', 5);
    s += rect(510, 120, 108, 100, 'pm-card', 8) + txt(564, 160, tr('mensen', 'people', 96), 22, 'middle', 'pm-big') + txt(564, 192, tr('geld', 'money', 96), 22, 'middle', 'pm-big');
    return s + txt(334, 346, tr('meer dan er past', 'more than fits', 284), 22, 'start', 'pm-mute');
  }
  function rkDrawing() {
    const row = (y, label) => rect(334, y, 284, 34, 'pm-tile', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return row(104, tr('risico', 'risk', 260)) + row(146, tr('wachtende klanten', 'waiting customers', 260)) + row(188, tr('klaar om te bouwen', 'ready to build', 260))
      + arrow(476, 228, 476, 256) + rect(334, 262, 284, 44, 'pm-card', 8) + txt(346, 292, tr('de rangorde', 'the ranking', 260), 22, 'start', 'pm-big');
  }
  function rnDrawing() {
    const row = (y, n, cls, ink, label) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, n, 22, 'start', 'pm-mute') + txt(378, y + 31, label, 22, 'start', ink);
    return row(104, '1', 'pm-tile', 'pm-txt', '') + row(160, '2', 'pm-tile', 'pm-txt', '') + row(216, '3', 'pm-crit', 'pm-on', tr('lijn 3', 'line 3', 200)) + row(272, '4', 'pm-tile', 'pm-txt', '');
  }

  // ---- s5: without building or later; the hours above the limit; the time bought.
  function altDrawing() {
    return rect(334, 100, 284, 44, 'pm-card', 8) + txt(346, 130, tr('knelpunt', 'bottleneck', 260), 22, 'start', 'pm-big') + arrow(476, 150, 476, 174)
      + rect(334, 178, 284, 44, 'pm-crit', 8) + txt(346, 208, tr('zonder bouwen?', 'without building?', 260), 22, 'start', 'pm-on')
      + txt(476, 252, tr('of', 'or', 60), 22, 'middle', 'pm-mute')
      + rect(334, 266, 284, 44, 'pm-card', 8) + txt(346, 296, tr('later bouwen?', 'build later?', 260), 22, 'start', 'pm-big');
  }
  function curveDrawing() {
    const above = path('M336 178V112L352 128L368 150L384 178Z', 'pm-crit');
    const curve = path('M336 112L352 128L368 150L384 178L400 204L440 236L500 258L560 270L616 276', 'pm-link');
    return path('M334 300H618', 'pm-link') + above + curve + path('M334 178H618', 'pm-dash') + txt(618, 166, tr('grens', 'limit', 120), 22, 'end', 'pm-mute')
      + path('M336 308V314H384V308', 'pm-link') + txt(334, 342, tr('een paar honderd uur', 'a few hundred hours', 284), 22, 'start', 'pm-big');
  }
  function timeDrawing() {
    return txt(334, 106, tr('lijn 3', 'line 3', 284), 22, 'start', 'pm-mute') + rect(334, 114, 284, 34, 'pm-crit', 6) + txt(346, 139, tr('draait al', 'already runs', 260), 22, 'start', 'pm-on')
      + txt(334, 186, tr('zwaardere aansluiting', 'heavier connection', 284), 22, 'start', 'pm-mute') + rect(480, 194, 138, 34, 'pm-out', 6) + txt(492, 219, tr('later', 'later', 110), 22, 'start', 'pm-big')
      + path('M334 250V258H476V250', 'pm-link') + txt(334, 288, tr('tijd gekocht', 'time bought', 284), 22, 'start', 'pm-big');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Netplanning en de energietransitie lit, the whole sheet and then zoomed to the lit place at 1.5; then the
  // module's four topics, each with its four levels as columns (the words the app uses for the levels), the
  // start marker on the first level of the first topic.
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
      const y0 = y + GRID.h / 2 + 7 - (lines.length - 1) * 11;
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
      title = b >= 3 ? tr('De route', 'The route') : tr('Lijn 3', 'Line 3');
      if (b <= 1) o.waitS = op(b === 0 ? span(p, 0.05, 0.4) : 1, waitDrawing());
      if (b === 2) o.nowS = op(span(p, 0.05, 0.4), nowDrawing());
      if (b >= 3) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, tr('Vraag en reserve', 'Demand and reserve', 284), b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b === 4) o.grpB = routeGroup(2, tr('Bouwen en tijd kopen', 'Building and buying time', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Belasting', 'Load', 150), tr('Ontwerp', 'Design', 150), tr('Plan', 'Plan', 150), tr('Flexibiliteit', 'Flexibility', 150)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { gelS: fade(b, 0, p, gelDrawing(), 0.1, 0.5), growS: fade(b, 1, p, growDrawing()), ...tools(b, p, 2, tr('Loadflow', 'Load flow', 260)) });
      if (si === 2) Object.assign(o, { critS: fade(b, 0, p, critDrawing(), 0.1, 0.5), ringS: b === 1 ? ringDrawing(p) : '', ...tools(b, p, 2, tr('Spanningsbudget', 'Voltage budget', 260)) });
      if (si === 3) Object.assign(o, { qS: fade(b, 0, p, qDrawing(), 0.1, 0.5), rkS: fade(b, 1, p, rkDrawing()), rnS: fade(b, 2, p, rnDrawing()), ...tools(b, p, 3, tr('Scenario', 'Scenario', 260), tr('Investeringsplan', 'Investment plan', 260)) });
      if (si === 4) Object.assign(o, { altS: fade(b, 0, p, altDrawing(), 0.1, 0.5), curveS: fade(b, 1, p, curveDrawing()), timeS: fade(b, 3, p, timeDrawing()), ...tools(b, p, 2, [tr('Capaciteitssturings-', 'Capacity steering', 260), tr('contract (CSC)', 'contract (CSC)', 260)]) });
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
