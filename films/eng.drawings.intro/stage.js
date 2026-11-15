// The stage of the module intro film "Van tekening tot regeling / From drawing to control": a pure function of
// (scene, u). Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV,
// MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as
// the kit's label check measures). The story is drawn in an office corner, a workbench and the plant's tank at the left:
// a drawing table with the drawing of the plate, the plate on the bench, the tank with its level meter, control valve and
// pump, and a control screen on the wall; a designer, a maker, an operator and you, the engineer, come and go. The panel
// at the right draws each beat as a schema, labelled "voorbeeld" (the plate and the tank) or "schema" (the module's map).
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or
// hides the room's moving parts.
// The closing scene (the shared Engineering map, then the module's four topics with their levels) is ONE function,
// closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower
// than the panel (the kit checks that they fit).
/* global CAM, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW, OPWALK, wrapUnits, span, beatStarts */
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
  // a line through points (axis-aligned steps) with an arrow head on its last step
  const poly = (pts) => {
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
    const [ax, ay] = pts[pts.length - 2];
    const [bx, by] = pts[pts.length - 1];
    const dx = Math.sign(bx - ax);
    const dy = Math.sign(by - ay);
    const head = dy === 0 ? `M${f1(bx - 6 * dx)} ${f1(by - 4)}L${f1(bx)} ${f1(by)}L${f1(bx - 6 * dx)} ${f1(by + 4)}` : `M${f1(bx - 4)} ${f1(by - 6 * dy)}L${f1(bx)} ${f1(by)}L${f1(bx + 4)} ${f1(by - 6 * dy)}`;
    return `<path class="pm-arrow" d="${d}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const IDS = ['draw', 'tol', 'schematics', 'control'];
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

  // ---- the room: who stands there, per scene (si) and beat (b). The drawing table, the bench, the tank and the screen
  // always stand; s1 the designer, the maker and you; s2 the designer hands over the drawing, the maker reads it; s3 the
  // maker with the plate; s4 the operator walks along the tank with the drawing; s5 the operator at the screen
  function room(si, b, p) {
    const in1 = (a) => (b === 0 ? span(p, 0.05, 0.4) * a : a);
    show(E['pp-des'], si === 0 ? in1(1) : si === 1 && b < 2 ? 1 : 0);
    show(E['pp-mak'], si <= 2 ? in1(1) : 0);
    show(E['pp-op'], si === 3 && b === 3 ? span(p, 0, 0.3) : si === 4 ? in1(1) : 0);
    // the operator walks from the control screen to the tank with the drawing (s4, last beat), and stands at the screen in s5
    const wk = si === 3 ? 1 - span(p, 0, 0.8) : si === 4 ? 1 : 0;
    move(E['pp-op'], `translate(${f1(-OPWALK[0] * wk)} ${f1(-OPWALK[1] * wk)})`);
    show(E['pp-jij'], si === 0 ? 1 : 0);
  }

  // ---- the four topic tiles
  // the route (s1, the last two beats): the module's four topics in two groups, in the module's order, the map before
  // the detail: the drawing for the maker, then the diagram of the plant and the control that keeps it at its value.
  // Each row has its number and its index title, wrapped by the kit's widths into 250 units left of the number; a title of
  // two lines gets a taller row. A group with a heading starts below it. The rows end inside the panel (388)
  function routeGroup(y, first, count, head, a) {
    let s = '';
    if (head) { s += txt(334, y + 20, head, 22, 'start', 'pm-mute'); y += 26; }
    for (let i = first; i < first + count; i++) {
      const lines = wrap(TITLE[i], 250);
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
  // four small holes of the plate (a front view): at (cx, cy) with half spacings dx, dy and radius r
  const holes4 = (cx, cy, dx, dy, r, cls = 'pm-hole') => [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => circ(cx + sx * dx, cy + sy * dy, r, cls)).join('');
  // a bowtie valve (a vertical pipe at x, centre y), with an air-driven actuator to its right when act is true
  const valve = (x, y, act, cls = 'pm-bar') => path(`M${x - 12} ${y - 14}H${x + 12}L${x - 12} ${y + 14}H${x + 12}Z`, cls)
    + (act ? path(`M${x + 12} ${y}H${x + 29}`, 'pm-link') + circ(x + 40, y, 11, cls) : '');
  // an instrument bubble: a circle with its letters and loop number, optionally in a square (on the screen of the control system)
  const bubble = (x, y, r, a, b2, square) => (square ? rect(x - 36, y - 36, 72, 72, 'pm-card', 6) : '') + circ(x, y, r, square ? 'pm-tile' : 'pm-card')
    + txt(x, y - 2, a, 22, 'middle', 'pm-txt') + txt(x, y + 21, b2, 22, 'middle', 'pm-txt');

  // ---- s1: the drawing and the loop, and what the module is about
  // from a drawing to a plate: the sheet with its front view, side view and title block, then the plate with four holes
  function drawingFlow() {
    return rect(380, 62, 192, 96, 'pm-card', 8) + rect(394, 74, 44, 44, 'pm-bar', 3) + holes4(416, 96, 11, 11, 3.4) + rect(450, 74, 10, 44, 'pm-bar', 3)
      + rect(500, 126, 62, 22, 'pm-tile', 3)
      + arrow(476, 166, 476, 204)
      + rect(420, 208, 112, 84, 'pm-crit', 8) + holes4(476, 250, 30, 22, 7, 'pm-hole')
      + txt(334, 330, tr('tekening voor de maker', 'drawing for the maker', 284), 22, 'start', 'pm-big')
      + txt(334, 360, tr('de plaat met vier gaten', 'the plate with four holes', 284), 22, 'start', 'pm-mute');
  }
  // two words of the module: a drawing (what the maker makes) and a control loop (what keeps the level at its target)
  function meltDrawing() {
    return rect(334, 62, 284, 130, 'pm-card', 8) + txt(346, 94, tr('Tekening', 'Drawing', 260), 22, 'start', 'pm-big')
      + txt(346, 122, tr('wat de maker maakt', 'what the maker makes', 260), 22, 'start', 'pm-mute') + rect(346, 138, 40, 40, 'pm-bar', 3) + holes4(366, 158, 9, 9, 3, 'pm-hole') + rect(396, 138, 8, 40, 'pm-bar', 3)
      + rect(334, 214, 284, 130, 'pm-card', 8) + txt(346, 246, tr('Regelkring', 'Control loop', 260), 22, 'start', 'pm-big')
      + txt(346, 274, tr('het niveau op waarde', 'level at its target', 260), 22, 'start', 'pm-mute')
      + path('M346 316H606', 'pm-dash') + path('M346 322L380 322L392 310L420 316L446 322L606 316', 'pm-arrow');
  }

  // ---- s2: reading a drawing. The maker was not there; the plate in views; the title block.
  function drawParts(b, p) {
    const carry = rect(334, 100, 284, 60, 'pm-card', 8) + rect(346, 110, 26, 40, 'pm-bar', 3) + txt(386, 138, tr('kantoor', 'office', 220), 22, 'start', 'pm-txt')
      + arrow(476, 166, 476, 200)
      + rect(334, 204, 284, 60, 'pm-card', 8) + rect(346, 214, 40, 36, 'pm-crit', 3) + txt(398, 242, tr('werkplaats', 'workshop', 210), 22, 'start', 'pm-txt')
      + txt(334, 304, tr('de maker was er niet bij', 'the maker was not there', 284), 22, 'start', 'pm-big') + txt(334, 334, tr('alleen de tekening', 'only the drawing', 284), 22, 'start', 'pm-mute');
    const views = rect(346, 104, 92, 92, 'pm-bar', 4) + holes4(392, 150, 22, 22, 7) + rect(454, 104, 18, 92, 'pm-bar', 3) + rect(346, 206, 92, 18, 'pm-bar', 3)
      + path('M498 104V196M492 110L498 104L504 110M492 190L498 196L504 190', 'pm-link')
      + txt(334, 278, tr('aanzichten', 'views', 284), 22, 'start', 'pm-big') + txt(334, 308, tr('van voren, boven en opzij', 'front, top and side', 284), 22, 'start', 'pm-mute')
      + txt(334, 342, tr('lees de maten, meet niet', 'read, do not measure', 284), 22, 'start', 'pm-txt');
    const sheet = rect(334, 170, 284, 170, 'pm-card', 8) + rect(350, 186, 70, 70, 'pm-bar', 4) + holes4(385, 221, 16, 16, 5) + rect(436, 186, 14, 70, 'pm-bar', 3)
      + rect(486, 288, 120, 40, 'pm-crit', 4) + path('M486 301H606M486 315H606M546 288V328', 'pm-link');
    return { sA: fade(b, 0, p, carry, 0.05, 0.45), sB: fade(b, 1, p, views), ship: fade(b, 2, p, sheet, 0.2, 0.6), ...tools(b, p, 2, tr('Stempel', 'Title block', 260)) };
  }

  // ---- s3: tolerances. Four holes on four bolts; a dimension and its tolerance; the datums of the frame.
  function tolParts(b, p) {
    const fit = rect(366, 100, 220, 150, 'pm-bar', 6) + holes4(476, 175, 70, 42, 14) + holes4(476, 175, 70, 42, 6, 'pm-chip')
      + txt(334, 296, tr('vier gaten, vier bouten', 'four holes, four bolts', 284), 22, 'start', 'pm-big') + txt(334, 326, tr('ze moeten passen', 'they must fit', 284), 22, 'start', 'pm-mute');
    const dim = rect(354, 100, 232, 110, 'pm-bar', 6) + circ(494, 155, 14, 'pm-hole') + circ(494, 155, 26, 'pm-dash')
      + path('M354 232H494M362 226L354 232L362 238M486 226L494 232L486 238M354 214V240M494 214V240', 'pm-link')
      + txt(424, 264, tr('40 ±0,1', '40 ±0.1', 130), 22, 'middle', 'pm-txt')
      + txt(334, 310, tr('een maat met tolerantie', 'a size with a tolerance', 284), 22, 'start', 'pm-big') + txt(334, 340, tr('te ver: de bout past niet', 'too far: the bolt will not fit', 284), 22, 'start', 'pm-mute');
    const datums = rect(366, 100, 200, 130, 'pm-bar', 6) + circ(500, 160, 14, 'pm-hole')
      + rect(448, 240, 26, 26, 'pm-crit', 3) + txt(461, 261, 'A', 22, 'middle', 'pm-on') + rect(334, 148, 26, 26, 'pm-crit', 3) + txt(347, 169, 'B', 22, 'middle', 'pm-on')
      + path('M360 190H486M478 184L486 190L478 196M500 174V232M494 224L500 232L506 224', 'pm-link')
      + rect(346, 290, 228, 32, 'pm-card', 4) + path('M393 290V322M463 290V322M526 290V322', 'pm-link')
      + circ(369, 306, 8, 'pm-link') + path('M369 294V318M357 306H381', 'pm-link') + txt(428, 313, '0,2', 22, 'middle', 'pm-txt') + txt(494, 313, 'A', 22, 'middle', 'pm-txt') + txt(550, 313, 'B', 22, 'middle', 'pm-txt')
      + txt(334, 356, tr('zelfde referenties', 'same datums', 284), 22, 'start', 'pm-big');
    const t = { sA: fade(b, 0, p, fit, 0.05, 0.45), sB: fade(b, 1, p, dim), ship: fade(b, 3, p, datums), ...tools(b, p, 2, tr('Tolerantiekader', 'Feature control frame', 260)) };
    if (b === 2) t.tool2 = op(span(p, 0.25, 0.65), rect(346, 190, 260, 56, 'pm-card', 4) + path('M393 190V246M463 190V246M534 190V246', 'pm-link') + circ(369, 218, 12, 'pm-link') + path('M369 200V236M351 218H387', 'pm-link'));
    return t;
  }

  // ---- s4: the P&ID of the tank. First the equipment and the pipes, then the instruments with their tag numbers and the signal lines.
  function pidDrawing(full) {
    let s = rect(420, 160, 80, 120, 'pm-card', 12) + txt(460, 226, 'T-101', 22, 'middle', 'pm-txt')
      + path('M460 96V112M460 140V160', 'pm-pipe') + valve(460, 126, full)
      + path('M460 280V344H600', 'pm-pipe') + circ(528, 344, 15, 'pm-card') + path('M522 336L538 344L522 352Z', 'pm-chip') + path('M594 337L604 344L594 351', 'pm-arrow')
      + txt(528, 378, 'P-101', 22, 'middle', 'pm-mute');
    if (full) {
      s += path('M406 215H420', 'pm-link') + bubble(376, 215, 30, 'LT', '101', false) + bubble(576, 206, 30, 'LIC', '101', true)
        + path('M376 245V300H576V242', 'pm-dash') + path('M576 170V100H500V115', 'pm-dash')
        + txt(438, 134, 'LV 101', 22, 'end', 'pm-mute');
    }
    return s;
  }
  // the walk along the plant: the drawing has one valve, the plant has two (the second was added in a weekend)
  function walkdown() {
    const col = (x, vs, extra) => path(`M${x} 138V310`, 'pm-pipe') + vs.map(([y, cls]) => valve(x, y, false, cls)).join('') + extra;
    return txt(402, 120, tr('tekening', 'drawing', 130), 22, 'middle', 'pm-mute') + txt(550, 120, tr('fabriek', 'plant', 130), 22, 'middle', 'pm-mute')
      + col(402, [[210, 'pm-bar']], '') + col(550, [[190, 'pm-bar'], [250, 'pm-crit']], txt(550, 346, tr('bijgeplaatst', 'added', 134), 22, 'middle', 'pm-txt'));
  }
  function schParts(b, p) {
    const o = { sA: fade(b, 0, p, pidDrawing(false), 0.05, 0.45), sB: fade(b, 1, p, pidDrawing(true)), ship: fade(b, 3, p, walkdown()), ...tools(b, p, 2, tr('Tagnummer', 'Tag number', 260)) };
    if (b === 2) o.tool2 = op(span(p, 0.25, 0.65), circ(476, 250, 52, 'pm-card') + txt(476, 246, 'LT', 22, 'middle', 'pm-txt') + txt(476, 272, '101', 22, 'middle', 'pm-txt'));
    return o;
  }

  // ---- s5: the control loop of the level. Every filling lowers it; a sensor, a controller and a valve bring it back.
  function ctlParts(b, p) {
    const drop = path('M352 330H606M352 330V104', 'pm-link') + path('M352 190H606', 'pm-dash')
      + path('M352 190H388L400 214H430L442 238H472L484 262H514L526 286H560', 'pm-arrow')
      + txt(358, 124, tr('niveau', 'level', 150), 22, 'start', 'pm-mute') + txt(606, 358, tr('tijd', 'time', 90), 22, 'end', 'pm-mute') + txt(606, 176, tr('streefwaarde', 'target', 190), 22, 'end', 'pm-mute');
    const loop = rect(420, 100, 132, 44, 'pm-crit', 6) + txt(486, 130, tr('regelaar', 'controller', 120), 22, 'middle', 'pm-on')
      + rect(334, 200, 104, 44, 'pm-card', 6) + txt(386, 230, tr('sensor', 'sensor', 96), 22, 'middle', 'pm-txt')
      + rect(514, 200, 104, 44, 'pm-card', 6) + txt(566, 230, tr('klep', 'valve', 96), 22, 'middle', 'pm-txt')
      + rect(420, 296, 132, 52, 'pm-tile', 6) + txt(486, 330, tr('tank', 'tank', 120), 22, 'middle', 'pm-txt')
      + poly([[386, 200], [386, 122], [420, 122]]) + poly([[552, 122], [566, 122], [566, 200]]) + poly([[566, 244], [566, 322], [552, 322]]) + poly([[420, 322], [386, 322], [386, 244]])
      + txt(486, 178, tr('streefwaarde', 'target', 170), 22, 'middle', 'pm-mute');
    const done = rect(334, 104, 284, 50, 'pm-card', 8) + txt(346, 136, tr('Niveau op waarde', 'Level at its value', 260), 22, 'start', 'pm-big')
      + arrow(476, 160, 476, 190) + rect(334, 194, 284, 66, 'pm-crit', 8) + txt(346, 222, tr('Eén tekening', 'One drawing', 260), 22, 'start', 'pm-on') + txt(346, 248, tr('frame, plaat en tank', 'frame, plate and tank', 260), 22, 'start', 'pm-on');
    return { sA: fade(b, 0, p, drop, 0.05, 0.45), sB: fade(b, 1, p, loop), ship: fade(b, 3, p, done), ...tools(b, p, 2, tr('PID-regelaar', 'PID controller', 260)) };
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Drawings and control lit, the whole sheet and then zoomed to the lit place at 1.5; then the module's four
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
      title = b >= 2 ? tr('De route', 'The route') : tr('De plaat', 'The plate');
      if (b === 0) o.flow = op(span(p, 0.05, 0.4), drawingFlow());
      if (b === 1) o.melt = op(span(p, 0.05, 0.4), meltDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.cutters = routeGroup(48, 0, 2, tr('Tekening voor de maker', 'Drawing for the maker', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.support = routeGroup(213, 2, 2, tr('Schema en regeling', 'Diagram and control', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Tekening', 'Drawing', 150), tr('Tolerantie', 'Tolerance', 150), tr('Schema', 'Diagram', 150), tr('Regeling', 'Control', 150)][si - 1];
      o.r = strip(si - 1);
      Object.assign(o, [drawParts, tolParts, schParts, ctlParts][si - 1](b, p));
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
