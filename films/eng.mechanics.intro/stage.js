// The stage of the module intro film "Het frame en zijn staal / The frame and its steel": a pure function of
// (scene, u). Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV,
// MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as
// the kit's label check measures). The story is drawn in the plant's lab and workshop at the left: the frame of the
// filling unit on a work platform with the tank behind it, a sling, the crack in its corner, a tensile test machine, a
// rack of steel bars and a table with a hardness tester and a microscope; a lab technician, a rigger and you, the
// engineer, come and go. The panel at the right draws each beat as a schema, labelled "voorbeeld" (the frame's job) or
// "schema" (the module's map). Every part a sentence lights is a static data-cue group (build.mjs); this script only
// fills the panel and shows or hides the room's moving parts.
// The closing scene (the shared Engineering map, then the module's four topics with their levels) is ONE function,
// closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower
// than the panel (the kit checks that they fit).
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
  const IDS = ['load', 'strength', 'failure', 'choice'];
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
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- the room: who stands there and what is in view, per scene (si) and beat (b).
  // s1 the frame and the tank stand in the workshop; s2 the rigger hangs a sling on the frame (the tag is the tool);
  // s3 the test machine in the lab with the technician: a bar is pulled; s4 the crack in the corner and the microscope
  // on the table; s5 the rack of steel bars, the hardness tester and the technician; you take the steel on
  function room(si, b, p) {
    const in1 = (a) => (b === 0 ? span(p, 0.05, 0.4) * a : a);
    show(E.tankK, si <= 2 ? 1 : 0);
    show(E.slingK, si === 1 && b === 2 ? span(p, 0, 0.4) : 0);
    show(E['pp-rig'], si === 1 && b === 2 ? span(p, 0, 0.4) : 0);
    show(E.tensK, si === 2 ? (b === 0 ? 0 : b === 1 ? span(p, 0.05, 0.4) : 1) : 0);
    show(E['pp-tech'], si === 2 || si === 4 ? in1(1) : 0);
    show(E.crackK, si === 3 ? (b === 0 ? 0 : b === 1 ? span(p, 0.2, 0.6) : 1) : 0);
    show(E['t-micro'], si === 3 && b === 2 ? span(p, 0, 0.4) : 0);
    show(E.stockK, si === 4 ? in1(1) : 0);
    show(E['t-hard'], si === 4 && b === 2 ? span(p, 0, 0.4) : 0);
    show(E['pp-jij'], si === 0 || (si === 4 && b === 3) ? 1 : 0);
  }

  // ---- the four topic tiles
  // the route (s1, the last two beats): the module's four topics in two groups, in the module's order, the map before
  // the detail: what the frame carries and what the steel can take, then how it can still break and which steel to choose.
  // Each row has its number and its index title, wrapped by the kit's widths into 244 units left of the number; a title of
  // two lines gets a taller row. A group with a heading starts below it. The rows end inside the panel (388)
  function routeGroup(y, first, count, head, a) {
    let s = '';
    if (head) { s += txt(334, y + 20, head, 22, 'start', 'pm-mute'); y += 26; }
    for (let i = first; i < first + count; i++) {
      const lines = wrap(TITLE[i], 244);
      if (lines.length > 2) throw new Error(`route row ${TITLE[i]} wraps to ${lines.length} lines`);
      const h = lines.length === 1 ? 34 : 56;
      s += rect(334, y, 284, h, 'pm-tile', 6) + txt(610, y + 25, String(i + 1), 22, 'end', 'pm-on');
      lines.forEach((l, j) => { s += txt(346, y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
      y += h + 3;
    }
    return op(a, s);
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // one or two tool names as chips high in the panel under the strip (one short sentence names them; they are not
  // explained). Shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');

  // ---- s1: the frame and what the module is about
  // the frame under its load: the unit on the beam, an arrow down
  function frameFlow() {
    return rect(390, 60, 172, 56, 'pm-crit', 8) + txt(476, 95, tr('Vuleenheid', 'Filling unit', 160), 22, 'middle', 'pm-on')
      + arrow(476, 122, 476, 168)
      + rect(366, 172, 220, 24, 'pm-bar', 3) + rect(380, 196, 24, 96, 'pm-bar', 3) + rect(548, 196, 24, 96, 'pm-bar', 3)
      + txt(334, 330, tr('frame draagt de eenheid', 'frame carries the unit', 284), 22, 'start', 'pm-big')
      + txt(334, 360, tr('van lijn 3 in hal B', 'of line 3 in hall B', 284), 22, 'start', 'pm-mute');
  }
  // two words of the module: a load (a force on the frame) and strength (what the steel takes before it bends for good)
  function meltDrawing() {
    return rect(334, 62, 284, 130, 'pm-card', 8) + txt(346, 94, tr('Belasting', 'Load', 260), 22, 'start', 'pm-big')
      + txt(346, 122, tr('wat het frame draagt', 'what the frame carries', 260), 22, 'start', 'pm-mute') + arrow(476, 134, 476, 178)
      + rect(334, 214, 284, 130, 'pm-card', 8) + txt(346, 246, tr('Sterkte', 'Strength', 260), 22, 'start', 'pm-big')
      + txt(346, 274, tr('wat het staal aankan', 'what the steel takes', 260), 22, 'start', 'pm-mute')
      + rect(346, 296, 170, 22, 'pm-bar', 3) + path('M526 292V324', 'pm-dash');
  }

  // ---- s2: loads. The frame carries the full tank; every filling is a shock; stress is force per area; the sling has its WLL.
  function loadParts(b, p) {
    const carry = rect(400, 100, 152, 54, 'pm-card', 8) + txt(476, 134, tr('tank', 'tank', 140), 22, 'middle', 'pm-txt') + arrow(476, 160, 476, 206)
      + rect(366, 210, 220, 24, 'pm-bar', 3) + rect(380, 234, 24, 70, 'pm-bar', 3) + rect(548, 234, 24, 70, 'pm-bar', 3)
      + path('M524 162l-9 11 18 11-18 11 9 11', 'pm-heat')
      + txt(334, 340, tr('gewicht van de tank', 'weight of the tank', 284), 22, 'start', 'pm-big') + txt(334, 368, tr('elke vulling een stoot', 'every filling a shock', 284), 22, 'start', 'pm-mute');
    const bars = rect(404, 142, 40, 130, 'pm-bar', 3) + rect(512, 142, 14, 130, 'pm-crit', 3) + arrow(424, 100, 424, 136) + arrow(519, 100, 519, 136)
      + txt(424, 304, tr('dik', 'thick', 80), 22, 'middle', 'pm-txt') + txt(519, 304, tr('dun', 'thin', 80), 22, 'middle', 'pm-txt')
      + txt(334, 346, tr('spanning is kracht', 'stress is force', 284), 22, 'start', 'pm-big') + txt(334, 374, tr('per oppervlak', 'per area', 284), 22, 'start', 'pm-mute');
    return { sA: fade(b, 0, p, carry, 0.05, 0.45), sB: fade(b, 1, p, bars), ...tools(b, p, 2, tr('Werklast (WLL)', 'Working load limit', 260)) };
  }

  // ---- s3: strength and testing. A bar from the frame's steel goes to the lab; the curve: yield, the frame stays under it.
  function strengthParts(b, p) {
    const bar = rect(334, 96, 284, 52, 'pm-card', 8) + txt(346, 130, tr('Staal van het frame', 'Steel of the frame', 260), 22, 'start', 'pm-txt')
      + arrow(476, 154, 476, 198) + rect(366, 206, 40, 40, 'pm-bar', 4) + rect(406, 216, 100, 20, 'pm-bar', 3) + rect(506, 206, 40, 40, 'pm-bar', 4)
      + txt(334, 290, tr('proefstaaf', 'test bar', 284), 22, 'start', 'pm-big') + txt(334, 318, tr('naar het lab', 'to the lab', 284), 22, 'start', 'pm-mute');
    const curve = path('M352 330H606M352 330V124', 'pm-link') + path('M352 330L420 196C450 170 520 146 560 158L584 214', 'pm-arrow')
      + circ(420, 196, 5, 'pm-chip') + path('M352 262H606', 'pm-dash')
      + txt(432, 232, tr('vloeigrens', 'yield', 170), 22, 'start', 'pm-txt') + txt(606, 252, tr('frame', 'frame', 90), 22, 'end', 'pm-mute')
      + txt(352, 116, tr('spanning', 'stress', 150), 22, 'start', 'pm-mute') + txt(606, 356, tr('rek', 'strain', 90), 22, 'end', 'pm-mute');
    return { sA: fade(b, 0, p, bar, 0.05, 0.45), sB: fade(b, 1, p, curve), ...tools(b, p, 2, tr('Trekproef', 'Tensile test', 260)) };
  }

  // ---- s4: fatigue and fracture. The frame is strong enough once and cracks after months in a sharp corner; the break is read.
  function failureParts(b, p) {
    const corner = rect(366, 106, 220, 30, 'pm-bar', 3) + rect(366, 106, 30, 160, 'pm-bar', 3) + path('M396 136l-8 10 10 8-8 12', 'pm-heat')
      + txt(334, 310, tr('sterk genoeg', 'strong enough', 284), 22, 'start', 'pm-big') + txt(334, 340, tr('en toch een scheur', 'and still a crack', 284), 22, 'start', 'pm-mute');
    const rings = path('M352 130l16-30 16 30 16-30 16 30 16-30 16 30 16-30 16 30 16-30 16 30', 'pm-heat')
      + path('M386 224A26 26 0 0 1 412 250M386 224A48 48 0 0 1 434 272M386 224A70 70 0 0 1 456 294', 'pm-link') + rect(386, 218, 8, 6, 'pm-crit', 2)
      + txt(334, 186, tr('miljoenen keren', 'millions of times', 284), 22, 'start', 'pm-big') + txt(474, 246, tr('de scheur', 'the crack', 144), 22, 'start', 'pm-txt') + txt(474, 272, tr('groeit', 'grows', 144), 22, 'start', 'pm-txt')
      + txt(334, 340, tr('uit een scherpe hoek', 'from a sharp corner', 284), 22, 'start', 'pm-mute');
    return { sA: fade(b, 0, p, corner, 0.05, 0.45), sB: fade(b, 1, p, rings), ...tools(b, p, 2, tr('Fractografie', 'Fractography', 260)) };
  }

  // ---- s5: heat treatment and choice of material. Constructional steel for the frame; heat, quench and temper; a block goes on to machining.
  function choiceParts(b, p) {
    const row = (y, label, cls) => rect(334, y, 284, 34, cls, 6) + txt(346, y + 25, label, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');
    const list = row(104, tr('Constructiestaal S355', 'Structural steel S355', 260), 'pm-crit') + row(146, tr('Roestvast staal', 'Stainless steel', 260), 'pm-tile')
      + row(188, tr('Aluminium', 'Aluminium', 260), 'pm-tile') + row(230, tr('Gietijzer', 'Cast iron', 260), 'pm-tile')
      + txt(334, 312, tr('voor het frame', 'for the frame', 284), 22, 'start', 'pm-big') + txt(334, 342, tr('sterk, stijf, lasbaar', 'strong, stiff, weldable', 284), 22, 'start', 'pm-mute');
    const heat = path('M352 250H606M352 250V104', 'pm-link') + path('M356 244L398 128H452L474 236H506L526 184H570L596 244', 'pm-heat')
      + txt(334, 292, tr('verhitten', 'heat', 284), 22, 'start', 'pm-txt') + txt(334, 320, tr('afschrikken: hard, bros', 'quench: hard, brittle', 284), 22, 'start', 'pm-txt') + txt(334, 348, tr('ontlaten: taaier', 'temper: tougher', 284), 22, 'start', 'pm-txt');
    const ship = rect(334, 104, 284, 50, 'pm-card', 8) + txt(346, 136, tr('Staal gekozen', 'Steel chosen', 260), 22, 'start', 'pm-big')
      + arrow(476, 160, 476, 190) + rect(334, 194, 284, 66, 'pm-crit', 8) + txt(346, 222, tr('Verspanen', 'Machining', 260), 22, 'start', 'pm-on') + txt(346, 248, tr('de plaat uit een blok', 'the plate from a block', 260), 22, 'start', 'pm-on');
    return { sA: fade(b, 0, p, list, 0.05, 0.45), sB: fade(b, 1, p, heat), ...tools(b, p, 2, tr('Hardheid', 'Hardness', 260)), ship: fade(b, 3, p, ship) };
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Materials and strength lit, the whole sheet and then zoomed to the lit place at 1.5; then the module's four
  // topics, each with its four levels as columns (the words the app uses for the levels), the start marker on the first level
  // of the first topic.
  const MAP0 = { s: H / MAPSZ[1], x: (W - MAPSZ[0] * H / MAPSZ[1]) / 2, y: 0 };
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
  const gridY = (i) => GRID.top + i * GRID.pitch;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], lv1: '', lv2: '', lv3: '', lv4: '', start: '' };
    const lv = ['lv1', 'lv2', 'lv3', 'lv4'];
    LW.forEach((wd, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, wd, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, GRID.h, 'pm-tile', 8);
      const lines = wrap(t, GRID.tile - 12);
      if (lines.length > 2) throw new Error(`grid row ${t} wraps to ${lines.length} lines`);
      const y0 = lines.length === 1 ? y + GRID.h / 2 + 8 : y + GRID.h / 2 - 3;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.1, i * 0.1 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 9, GB, GRID.h - 18, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 4, GB + 10, GRID.h - 8, 'pm-out', 10);
    return out;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
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
      title = b >= 2 ? tr('De route', 'The route') : tr('Het frame', 'The frame');
      if (b === 0) o.flow = op(span(p, 0.05, 0.4), frameFlow());
      if (b === 1) o.melt = op(span(p, 0.05, 0.4), meltDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.cutters = routeGroup(48, 0, 2, tr('Last en sterkte', 'Load and strength', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.support = routeGroup(213, 2, 2, tr('Breken en kiezen', 'Breaking and choosing', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Krachten', 'Loads', 150), tr('Sterkte', 'Strength', 150), tr('Vermoeiing', 'Fatigue', 150), tr('Materiaal', 'Material', 150)][si - 1];
      o.r = strip(si - 1);
      Object.assign(o, [loadParts, strengthParts, failureParts, choiceParts][si - 1](b, p));
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
