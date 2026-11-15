// The stage of the module intro film "Van ketel naar tank / From kettle to tank": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, OPSHIFT, JIJSHIFT, W, H,
// LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as
// the kit's label check measures). The story is drawn in the plant, at the left: the product flows along the back wall from
// a batch kettle through a pump and a heat exchanger into the tank, and on through the wall to hall B; in front a pallet of
// sacks, a floor drain and a small pilot kettle on a table; an operator and you, the engineer, come and go. The panel at the
// right draws each beat as a schema, labelled "voorbeeld" (the product's way) or "schema" (the module's map). Every part a
// sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or hides the room's
// moving parts. The closing scene (the shared Engineering map, then the module's four topics with their levels) is ONE
// function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the panel
// (the kit checks that they fit).
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
  const IDS = ['types', 'control', 'balances', 'capacity'];
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
  // The operator stands at the kettle (s1, s2), at the pipe (s3), at the drain (s4), at the pilot kettle (s5); you
  // stand at the front right in s1 and take the pipe to hall B in the last beat of s5; the pilot kettle appears when
  // the pilot plant is named
  function room(si, b, p) {
    const sh = OPSHIFT[si];
    move(E['pp-op'], sh ? `translate(${sh[0]} ${sh[1]})` : '');
    show(E['pp-op'], si <= 4 ? (b === 0 && (si === 0 || si >= 2) ? span(p, 0, 0.35) : 1) : 0);
    const js = JIJSHIFT[si];
    move(E['pp-jij'], js ? `translate(${js[0]} ${js[1]})` : '');
    show(E['pp-jij'], si === 0 && b <= 1 ? 1 : si === 4 && b === 3 ? span(p, 0, 0.35) : 0);
    show(E.pilotK, si === 4 && b >= 2 ? (b === 2 ? span(p, 0, 0.35) : 1) : 0);
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

  // ---- s1: the product. Raw material becomes product in the plant, for the tank of line 3; a plant is built from
  // a few steps that come back everywhere.
  function flowDrawing() {
    return rect(334, 66, 284, 64, 'pm-card', 8) + txt(346, 94, tr('Grondstoffen', 'Raw materials', 260), 22, 'start', 'pm-big') + txt(346, 120, tr('in de procesfabriek', 'in the process plant', 260), 22, 'start', 'pm-mute')
      + arrow(476, 136, 476, 168)
      + rect(334, 172, 284, 64, 'pm-crit', 8) + txt(346, 200, tr('Product', 'Product', 260), 22, 'start', 'pm-on') + txt(346, 226, tr('in de tank van lijn 3', 'in the tank of line 3', 260), 22, 'start', 'pm-on')
      + txt(334, 290, tr('voor de vuleenheid', 'for the filling unit', 284), 22, 'start', 'pm-mute');
  }
  function unitDrawing() {
    const row = (y, label) => rect(334, y, 284, 44, 'pm-tile', 8) + txt(346, y + 31, label, 22, 'start', 'pm-txt');
    return row(100, tr('Pompen', 'Pumping', 260)) + row(152, tr('Verwarmen', 'Heating', 260)) + row(204, tr('Mengen', 'Mixing', 260))
      + txt(334, 288, tr('een klein setje stappen', 'a small set of steps', 284), 22, 'start', 'pm-big') + txt(334, 318, tr('overal dezelfde', 'the same everywhere', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: process types. A batch is one lot with one number; continuous flows non-stop; the block diagram.
  function batchDrawing() {
    return rect(334, 100, 120, 110, 'pm-bar', 10) + rect(344, 150, 100, 50, 'pm-crit', 6) + path('M334 124H454', 'pm-link')
      + txt(334, 262, tr('één partij', 'one lot', 284), 22, 'start', 'pm-big') + txt(334, 292, tr('met één batchnummer', 'with one batch number', 284), 22, 'start', 'pm-mute');
  }
  function contDrawing() {
    return rect(334, 100, 110, 70, 'pm-bar', 8) + txt(389, 142, tr('Tank', 'Tank', 100), 22, 'middle', 'pm-txt') + arrow(450, 135, 490, 135)
      + rect(496, 100, 122, 70, 'pm-crit', 8) + txt(557, 142, tr('Vullen', 'Filling', 110), 22, 'middle', 'pm-on')
      + txt(334, 232, tr('non-stop', 'non-stop', 284), 22, 'start', 'pm-big') + txt(334, 262, tr('de dozen blijven komen', 'the cartons keep coming', 284), 22, 'start', 'pm-mute');
  }
  function blockDrawing() {
    const names = [tr('Ketel', 'Kettle', 160), tr('Verwarmen', 'Heating', 160), tr('Tank', 'Tank', 160), tr('Vullen', 'Filling', 160)];
    return names.map((nm, i) => rect(392, 204 + i * 44, 170, 30, 'pm-tile', 6) + txt(477, 227 + i * 44, nm, 22, 'middle', 'pm-txt') + (i < 3 ? arrow(477, 236 + i * 44, 477, 248 + i * 44) : '')).join('');
  }

  // ---- s3: variables. Four quantities run the plant; they are kept at their value.
  function fourDrawing() {
    const names = [tr('Druk', 'Pressure', 260), tr('Temperatuur', 'Temperature', 260), tr('Debiet', 'Flow', 260), tr('Niveau', 'Level', 260)];
    return names.map((nm, i) => rect(334, 100 + i * 48, 284, 40, 'pm-tile', 6) + txt(346, 128 + i * 48, nm, 22, 'start', 'pm-txt')).join('');
  }
  function keepDrawing() {
    return rect(334, 100, 284, 140, 'pm-card', 8) + path('M346 170H606', 'pm-dash') + path('M346 178Q380 150 420 172T500 168T606 170', 'pm-arrow')
      + txt(346, 128, tr('gewenst', 'desired', 200), 22, 'start', 'pm-mute') + txt(346, 226, tr('gemeten', 'measured', 200), 22, 'start', 'pm-mute')
      + txt(334, 290, tr('op hun waarde', 'at their value', 284), 22, 'start', 'pm-big');
  }

  // ---- s4: balances. In equals out plus what stays; a gap in the sum is a leak.
  function balDrawing() {
    return rect(334, 100, 284, 44, 'pm-crit', 8) + txt(346, 130, tr('Erin', 'In', 260), 22, 'start', 'pm-on')
      + arrow(404, 150, 404, 176) + arrow(548, 150, 548, 176)
      + rect(334, 180, 138, 44, 'pm-tile', 8) + txt(344, 210, tr('Eruit', 'Out', 120), 22, 'start', 'pm-txt')
      + rect(480, 180, 138, 44, 'pm-tile', 8) + txt(490, 210, tr('Blijft erin', 'Stays in', 120), 22, 'start', 'pm-txt')
      + txt(334, 282, tr('een tank die volloopt', 'a tank that fills', 284), 22, 'start', 'pm-mute');
  }
  function gapDrawing() {
    return txt(334, 122, tr('erin', 'in', 200), 22, 'start', 'pm-mute') + rect(334, 130, 284, 34, 'pm-crit', 6)
      + txt(334, 198, tr('eruit', 'out', 200), 22, 'start', 'pm-mute') + rect(334, 206, 222, 34, 'pm-bar', 6) + rect(556, 206, 62, 34, 'pm-gap', 6)
      + txt(618, 276, tr('mist', 'missing', 150), 22, 'end', 'pm-big') + arrow(588, 258, 588, 246)
      + txt(334, 330, tr('zoek het lek', 'look for the leak', 284), 22, 'start', 'pm-mute');
  }

  // ---- s5: batch capacity and scale-up. One cycle with a wait in it; a flask, a pilot and a kettle in steps.
  function cycleDrawing() {
    const W7 = [30, 38, 64, 36, 28, 44, 44];
    let x = 334;
    let s = '';
    W7.forEach((wd, i) => { s += rect(x, 140, wd, 40, i === 6 ? 'pm-crit' : 'pm-bar', 3); x += wd; });
    return s + path('M618 186Q618 214 592 214H360Q334 214 334 192', 'pm-arrow') + path('M328 200L334 190L341 200', 'pm-arrow')
      + txt(334, 262, tr('één cyclus', 'one cycle', 284), 22, 'start', 'pm-big') + txt(334, 292, tr('van start tot start', 'from start to start', 284), 22, 'start', 'pm-mute')
      + txt(334, 322, tr('het wachten telt mee', 'waiting counts', 284), 22, 'start', 'pm-mute');
  }
  function scaleDrawing() {
    return rect(344, 190, 30, 50, 'pm-bar', 6) + arrow(380, 215, 410, 215) + rect(416, 160, 60, 80, 'pm-bar', 8) + arrow(482, 200, 512, 200) + rect(518, 110, 92, 130, 'pm-crit', 10)
      + txt(359, 266, tr('kolf', 'flask', 80), 22, 'middle', 'pm-mute') + txt(564, 266, tr('ketel', 'kettle', 100), 22, 'middle', 'pm-mute')
      + txt(334, 322, tr('in stappen', 'in steps', 284), 22, 'start', 'pm-big');
  }
  // the product is good and goes to hall B (under the topic strip, which ends at y 84)
  function shipDrawing() {
    return rect(334, 104, 284, 50, 'pm-card', 8) + txt(346, 136, tr('Het product is klaar', 'The product is ready', 260), 22, 'start', 'pm-big')
      + arrow(476, 160, 476, 190) + rect(334, 194, 284, 66, 'pm-crit', 8) + txt(346, 222, tr('Hal B, lijn 3', 'Hall B, line 3', 260), 22, 'start', 'pm-on') + txt(346, 248, tr('de vuleenheid', 'the filling unit', 260), 22, 'start', 'pm-on');
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
      title = b >= 2 ? tr('De route', 'The route') : tr('Het product', 'The product');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing());
      if (b === 1) o.unitS = op(span(p, 0.05, 0.4), unitDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, tr('Maken en laten stromen', 'Making and flow', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.grpB = routeGroup(2, tr('Tellen en capaciteit', 'Counting and capacity', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Procestypen', 'Types', 150), tr('Grootheden', 'Variables', 150), tr('Balansen', 'Balances', 150), tr('Capaciteit', 'Capacity', 150)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { batchS: fade(b, 0, p, batchDrawing(), 0.1, 0.5), contS: fade(b, 1, p, contDrawing()), blokS: fade(b, 2, p, blockDrawing(), 0.3, 0.7), ...tools(b, p, 2, tr('Blokschema', 'Block diagram', 260), tr('Apparaatcode', 'Equipment tag', 260)) });
      if (si === 2) Object.assign(o, { fourS: fade(b, 0, p, fourDrawing(), 0.1, 0.5), keepS: fade(b, 1, p, keepDrawing()), ...tools(b, p, 2, tr('Coriolismeter', 'Coriolis meter', 260), tr('Pt100', 'Pt100', 260)) });
      if (si === 3) Object.assign(o, { balS: b === 0 ? op(span(p, 0.1, 0.5), balDrawing()) : '', gapS: fade(b, 1, p, gapDrawing()), ...tools(b, p, 2, tr('Massabalans', 'Mass balance', 260)) });
      if (si === 4) Object.assign(o, { cycS: fade(b, 0, p, cycleDrawing(), 0.1, 0.5), scaleS: fade(b, 1, p, scaleDrawing()), ship: fade(b, 3, p, shipDrawing()), ...tools(b, p, 2, tr('Proeffabriek', 'Pilot plant', 260)) });
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
