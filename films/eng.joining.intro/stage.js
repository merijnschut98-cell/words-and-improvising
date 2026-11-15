// The stage of the module intro film "Eén frame, zes manieren om te verbinden / One frame, six ways of joining": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a preamble from build.mjs that
// defines CAM, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths
// and its wrap, so the drawing wraps as the kit's label check measures). The story is drawn in the
// plant's workshop at the left: the frame of the filling unit on a work platform (two uprights and a beam,
// then its welds, the plate on four bolts and the plastic cover), a MIG/MAG welder with a gas bottle, a spot
// welder with its control, a table with the tool of each topic, and the weld cell with a robot, a jig and a
// light curtain; a welder, two workers and you, the engineer, come and go. The panel at the right draws each
// beat as a schema, labelled "voorbeeld" (the frame's job) or "schema" (the module's map). Every part a
// sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or hides
// the room's moving parts.
// The closing scene (the shared Engineering map, then the module's six topics with their levels) is ONE
// function, closing; the map itself is the kit's mapScene.
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
  const IDS = ['arc', 'spot', 'defects', 'bolting', 'bonding', 'production'];
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

  // ---- the room: who stands there and what has happened to the plate, per scene (si) and beat (b).
  // s1 the block lies on its pallet; s3 it sits in the vise (b0), is milled into the plate (b1), s4 gets its four holes,
  // s7 is measured on the table (from b1) with the drawing beside it, and you take it to hall B (b3)
  function room(si, b, p) {
    show(E['pp-opL'], si === 1 && b >= 1 ? (b === 1 ? span(p, 0, 0.35) : 1) : 0);
    show(E['pp-opM'], si >= 2 && si <= 6 ? (si === 2 && b === 0 ? span(p, 0, 0.35) : 1) : 0);
    show(E['pp-jij'], si === 0 || (si === 6 && b >= 1) ? 1 : 0);
    show(E.stockK, si <= 1 ? 1 : 0);
    show(E.blankK, si === 2 && b === 0 ? 1 : 0);
    const inVise = (si === 2 && b >= 1) || (si >= 3 && si <= 5) || (si === 6 && b < 1);
    show(E.plateK, inVise ? (si === 2 && b === 1 ? span(p, 0, 0.35) : 1) : 0);
    show(E.holesK, inVise && (si >= 4 || (si === 3 && b >= 1)) ? (si === 3 && b === 1 ? span(p, 0.2, 0.7) : 1) : 0);
    show(E.datumK, si === 4 && b >= 2 ? 1 : 0);
    show(E.spEnd, si === 2 ? 1 : 0);
    show(E.spDrill, (si === 3 && b !== 2) || (si >= 4 && si <= 6) ? 1 : 0);
    show(E.spCentre, si === 3 && b === 2 ? 1 : 0);
    show(E.plateTK, si === 6 && b >= 1 ? (b === 1 ? span(p, 0, 0.35) : 1) : 0);
  }

  // ---- the room: who stands there and what has happened to the frame, per scene (si) and beat (b).
  // s1 the frame stands in loose parts; s2 the welder joins its corners (b1: the welds); s3 the spot welder; s4 the
  // fitter checks the welds; s5 the plate hangs on four bolts; s6 the cover sits on the beam; s7 the robot welds the
  // bare frame in its jig, then (b3) the finished unit with plate and cover and you take it to hall B
  function room(si, b, p) {
    const in1 = (a) => (b === 0 ? span(p, 0.05, 0.4) * a : a);
    show(E['pp-welder'], si === 1 ? in1(1) : 0);
    show(E.torchK, si === 1 ? in1(1) : 0);
    show(E.arcK, si === 1 && b === 1 ? 1 : 0);
    show(E.weldsK, si === 1 ? (b === 0 ? 0 : b === 1 ? span(p, 0.3, 0.7) : 1) : si >= 2 ? 1 : 0);
    show(E.lensK, si === 2 && b >= 1 ? 1 : 0);
    show(E['pp-wrk'], si >= 2 && si <= 5 ? (si === 2 ? in1(1) : 1) : 0);
    show(E.plateK, si === 4 ? in1(1) : si === 5 ? 1 : si === 6 && b === 3 ? span(p, 0, 0.4) : 0);
    show(E.coverK, si === 5 ? in1(1) : si === 6 && b === 3 ? span(p, 0, 0.4) : 0);
    show(E.robotK, si === 6 ? (b === 0 ? span(p, 0.05, 0.4) : 1) : 0);
    show(E.curtainK, si === 6 ? (b === 0 ? span(p, 0.05, 0.4) : 1) : 0);
    show(E.jigK, si === 6 && b >= 1 ? (b === 1 ? span(p, 0.1, 0.5) : 1) : 0);
    show(E['pp-jij'], si === 0 || (si === 6 && b === 3) ? 1 : 0);
    show(E['t-tig'], si === 1 && b === 2 ? span(p, 0, 0.4) : 0);
    show(E['t-spot'], si === 2 && b === 2 ? span(p, 0, 0.4) : 0);
    show(E['t-def'], si === 3 && b === 2 ? span(p, 0, 0.4) : 0);
    show(E['t-bolt'], si === 4 && b === 2 ? span(p, 0, 0.4) : 0);
    show(E['t-glue'], si === 5 && b === 2 ? span(p, 0, 0.4) : 0);
  }

  // ---- the six topic tiles
  // the route (s1, the last two beats): the module's six topics in two groups, the map before the detail. The three
  // about welding (topics 1 to 3) and the three about bolts, glue and the cell (topics 4 to 6), each row with its number and
  // its index title, wrapped by the kit's widths into 244 units left of the number; a title of two lines (Weld defects and
  // inspection, Bonding and mechanical joining) gets a taller row. The second group ends at most at y 376 (the first ends at 208, the second heading stands at 230)
  function routeGroup(first, head, a) {
    let y = first === 0 ? 66 : 230;
    let s = txt(334, y, head, 22, 'start', 'pm-mute');
    y += 8;
    for (let i = first; i < first + 3; i++) {
      const lines = wrap(TITLE[i], 244);
      if (lines.length > 2) throw new Error(`route row ${TITLE[i]} wraps to ${lines.length} lines`);
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
  // one or two tool names as chips high in the panel under the strip (one short sentence names them; they are not
  // explained). Shown in the beat of the sentence (b === at); a topic with one tool leaves the second out
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // two plates side by side or one on the other, as small drawings of a joint
  const plate = (x, y, w, h, cls = 'pm-bar') => rect(x, y, w, h, cls, 3);

  // ---- s1: the frame in loose parts, what joining is
  // the frame: two uprights and a beam, three cards, then one frame
  function frameFlow() {
    const card = (x, label) => rect(x, 66, 92, 44, 'pm-card', 6) + txt(x + 46, 95, label, 22, 'middle', 'pm-txt');
    return card(334, tr('Stijl', 'Upright', 84)) + card(430, tr('Stijl', 'Upright', 84)) + card(526, tr('Balk', 'Beam', 84))
      + arrow(476, 118, 476, 150)
      + rect(334, 156, 284, 64, 'pm-crit', 8) + txt(346, 184, tr('Eén frame', 'One frame', 260), 22, 'start', 'pm-on') + txt(346, 210, tr('voor de vuleenheid', 'for the filling unit', 260), 22, 'start', 'pm-on')
      + txt(334, 274, tr('van lijn 3 in hal B', 'of line 3 in hall B', 284), 22, 'start', 'pm-mute');
  }
  // two ways of joining: with heat, the edges melt together; cold, with a bolt or glue
  function meltDrawing() {
    const hot = rect(334, 66, 136, 208, 'pm-card', 8) + txt(346, 96, tr('Warm', 'Hot', 112), 22, 'start', 'pm-big')
      + plate(346, 140, 54, 30) + plate(404, 140, 54, 30) + circ(402, 155, 13, 'pm-crit')
      + txt(346, 214, tr('lassen', 'welding', 112), 22, 'start', 'pm-mute');
    const cold = rect(482, 66, 136, 208, 'pm-card', 8) + txt(494, 96, tr('Koud', 'Cold', 112), 22, 'start', 'pm-big')
      + plate(494, 132, 108, 16) + plate(494, 152, 108, 16) + rect(542, 118, 12, 64, 'pm-tile', 3) + rect(494, 148, 108, 4, 'pm-crit', 2)
      + txt(494, 214, tr('bouten', 'bolts', 112), 22, 'start', 'pm-mute') + txt(494, 240, tr('en lijm', 'and glue', 112), 22, 'start', 'pm-mute');
    return hot + cold + txt(334, 324, tr('twee manieren', 'two ways', 284), 22, 'start', 'pm-txt');
  }

  // ---- s2: arc welding. The corners of the frame are joined: the arc melts the edges, the weld pool sets, the gas keeps the air away.
  function arcParts(b, p) {
    const corner = rect(366, 130, 200, 26, 'pm-bar', 3) + rect(366, 130, 26, 150, 'pm-bar', 3) + circ(392, 156, 18, 'pm-crit')
      + txt(410, 232, tr('stijl', 'upright', 150), 22, 'start', 'pm-txt') + txt(470, 186, tr('balk', 'beam', 90), 22, 'start', 'pm-txt')
      + txt(334, 318, tr('hoek van het frame', 'corner of the frame', 284), 22, 'start', 'pm-big');
    const arc = rect(446, 98, 44, 48, 'pm-bar', 6) + path('M468 146V190', 'pm-link') + path('M456 192L480 192M468 180V204M458 182L478 202M478 182L458 202', 'pm-cross')
      + plate(366, 210, 92, 24) + plate(478, 210, 92, 24) + `<ellipse class="pm-crit" cx="468" cy="212" rx="30" ry="11"/>`
      + path('M436 150C410 176 410 210 434 236', 'pm-dash') + path('M500 150C526 176 526 210 502 236', 'pm-dash')
      + txt(468, 270, tr('smeltbad', 'weld pool', 140), 22, 'middle', 'pm-txt') + txt(334, 318, tr('gas houdt lucht weg', 'gas keeps air away', 284), 22, 'start', 'pm-big');
    return { chain: fade(b, 0, p, corner, 0.1, 0.5), arcS: fade(b, 1, p, arc), ...tools(b, p, 2, tr('MIG/MAG', 'MIG/MAG', 260), tr('TIG', 'TIG', 260)) };
  }

  // ---- s3: spot welding. A guard of thin steel, two overlapping sheets; a gun squeezes them and current melts a nugget.
  function spotParts(b, p) {
    const guard = rect(366, 106, 150, 110, 'pm-card', 4) + rect(436, 150, 150, 110, 'pm-card', 4)
      + [[452, 186], [476, 186], [500, 186]].map(([x, y]) => circ(x, y, 7, 'pm-crit')).join('')
      + txt(334, 304, tr('scherm van dun staal', 'guard of thin steel', 284), 22, 'start', 'pm-big');
    const gun = rect(446, 100, 40, 54, 'pm-badge', 5) + rect(446, 222, 40, 54, 'pm-badge', 5) + plate(396, 160, 140, 24) + plate(396, 184, 140, 24)
      + `<ellipse class="pm-crit" cx="466" cy="184" rx="22" ry="11"/>` + arrow(466, 76, 466, 98) + arrow(466, 300, 466, 278)
      + txt(334, 336, tr('knijpen en stroom', 'squeeze and current', 284), 22, 'start', 'pm-big');
    return { spotP: fade(b, 0, p, guard, 0.05, 0.45), spotS: fade(b, 1, p, gun), ...tools(b, p, 2, tr('Stepper', 'Stepper', 260), tr('Kapafdruk', 'Tip imprint', 260)) };
  }

  // ---- s4: defects and inspection. The weld is checked; a gap inside grows under load.
  function defParts(b, p) {
    const bead = (y) => plate(346, y, 90, 42) + plate(516, y, 90, 42) + rect(426, y - 8, 100, 58, 'pm-crit', 10);
    const check = bead(120) + [[456, 142], [484, 150], [474, 132]].map(([x, y]) => circ(x, y, 4, 'pm-hole')).join('')
      + txt(334, 252, tr('elke las controleren', 'check every weld', 284), 22, 'start', 'pm-big') + txt(334, 282, tr('gasbelletjes en spleten', 'gas bubbles and gaps', 284), 22, 'start', 'pm-mute');
    const crack = bead(96) + txt(334, 186, tr('buiten goed', 'good outside', 284), 22, 'start', 'pm-mute')
      + bead(212) + path('M450 238H502', 'pm-link') + path('M502 238l12-9 10 15 12-15 12 12', 'pm-heat')
      + txt(334, 318, tr('binnenin een spleet', 'a gap inside', 284), 22, 'start', 'pm-big') + txt(334, 348, tr('groeit onder belasting', 'grows under load', 284), 22, 'start', 'pm-mute');
    return { defS: fade(b, 0, p, check, 0.05, 0.45), crackS: fade(b, 1, p, crack), ...tools(b, p, 2, tr('Penetrantonderzoek', 'Dye penetrant', 260), tr('Ultrasoon onderzoek', 'Ultrasonic testing', 260)) };
  }

  // ---- s5: bolted joints. The plate hangs from the beam on four bolts, so it can come off for service.
  function boltParts(b, p) {
    const hang = plate(366, 106, 206, 30) + rect(386, 160, 166, 80, 'pm-card', 4)
      + [[400, 172], [538, 172], [400, 228], [538, 228]].map(([x, y]) => path(`M${x} ${y}V136`, 'pm-link') + circ(x, y, 6, 'pm-chip')).join('')
      + [[444, 190], [494, 190], [444, 214], [494, 214]].map(([x, y]) => circ(x, y, 6, 'pm-hole')).join('')
      + txt(334, 282, tr('plaat aan de balk', 'plate on the beam', 284), 22, 'start', 'pm-big') + txt(334, 312, tr('voor onderhoud weer los', 'off again for service', 284), 22, 'start', 'pm-mute');
    const parts = rect(430, 104, 56, 20, 'pm-tile', 4) + rect(449, 124, 18, 76, 'pm-bar', 3) + rect(432, 204, 52, 8, 'pm-badge', 3) + rect(438, 214, 40, 24, 'pm-tile', 4)
      + path('M444 114H472', 'pm-code') + txt(504, 122, tr('bout', 'bolt', 112), 22, 'start', 'pm-txt') + txt(504, 214, tr('sluitring', 'washer', 112), 22, 'start', 'pm-txt') + txt(504, 238, tr('moer', 'nut', 112), 22, 'start', 'pm-txt')
      + txt(334, 292, tr('klasse op de kop', 'class on the head', 284), 22, 'start', 'pm-big');
    return { boltP: fade(b, 0, p, hang, 0.05, 0.45), boltS: fade(b, 1, p, parts), ...tools(b, p, 2, tr('Schroefspindel', 'Nutrunner', 260)) };
  }

  // ---- s6: bonding and mechanical joining. The plastic cover on the steel beam with glue; rivets and clinching.
  function glueParts(b, p) {
    const cover = rect(396, 104, 146, 48, 'pm-card', 16) + rect(386, 170, 166, 26, 'pm-bar', 3) + rect(396, 158, 146, 8, 'pm-crit', 4)
      + txt(334, 248, tr('kunststof op staal', 'plastic on steel', 284), 22, 'start', 'pm-big') + txt(334, 278, tr('lijm ertussen', 'glue between', 284), 22, 'start', 'pm-mute');
    const col = (x) => plate(x, 120, 84, 16) + plate(x, 138, 84, 16);
    const mech = col(334) + rect(334, 136, 84, 4, 'pm-crit', 2)
      + col(430) + rect(472, 112, 12, 56, 'pm-tile', 3)
      + col(526) + `<ellipse class="pm-bar" cx="568" cy="160" rx="14" ry="11"/>`
      + txt(376, 214, tr('lijm', 'glue', 96), 22, 'middle', 'pm-txt') + txt(478, 214, tr('klinken', 'rivet', 96), 22, 'middle', 'pm-txt') + txt(574, 214, tr('clinchen', 'clinch', 96), 22, 'middle', 'pm-txt')
      + txt(334, 276, tr('zonder warmte', 'without heat', 284), 22, 'start', 'pm-big');
    return { glueP: fade(b, 0, p, cover, 0.05, 0.45), mechS: fade(b, 1, p, mech), ...tools(b, p, 2, tr('Statische menger', 'Static mixer', 260)) };
  }

  // ---- s7: welding in production. A robot cell behind a fence with a light curtain; the parts stay in place; the frame goes to hall B.
  function cellParts(b, p) {
    const cell = rect(350, 100, 256, 154, 'pm-out', 8) + circ(404, 170, 18, 'pm-crit') + path('M422 170H480', 'pm-arrow') + rect(486, 140, 90, 60, 'pm-card', 6)
      + path('M350 254H606', 'pm-dash') + txt(334, 296, tr('robot in een hek', 'robot in a fence', 284), 22, 'start', 'pm-big') + txt(334, 326, tr('lichtscherm stopt hem', 'light curtain stops it', 284), 22, 'start', 'pm-mute');
    const jig = rect(396, 130, 160, 90, 'pm-card', 6) + [[380, 114], [540, 114], [380, 204], [540, 204]].map(([x, y]) => rect(x, y, 28, 28, 'pm-crit', 4)).join('')
      + path('M396 130C450 94 502 94 556 130', 'pm-dash')
      + txt(334, 286, tr('delen op hun plek', 'parts stay in place', 284), 22, 'start', 'pm-big') + txt(334, 316, tr('anders krom', 'or it warps', 284), 22, 'start', 'pm-mute');
    // under the topic strip (which ends at y 84)
    const ship = rect(334, 104, 284, 50, 'pm-card', 8) + txt(346, 136, tr('Frame klaar', 'Frame done', 260), 22, 'start', 'pm-big')
      + arrow(476, 160, 476, 190) + rect(334, 194, 284, 66, 'pm-crit', 8) + txt(346, 222, tr('Hal B, lijn 3', 'Hall B, line 3', 260), 22, 'start', 'pm-on') + txt(346, 248, tr('de vuleenheid', 'the filling unit', 260), 22, 'start', 'pm-on');
    return { cellS: fade(b, 0, p, cell, 0.05, 0.45), jigS: fade(b, 1, p, jig), ...tools(b, p, 2, tr('Lasmal', 'Welding fixture', 260), tr('Positioner', 'Positioner', 260)), ship: fade(b, 3, p, ship) };
  }

  // ---- s8: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Machining lit, the whole sheet and then zoomed to the lit place at 1.5; then the module's six topics, each
  // with its four levels as columns (the words the app uses for the levels), the start marker on the first level of the first topic.
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
    const out = { r: ['', '', '', '', '', ''], lv1: '', lv2: '', lv3: '', lv4: '', start: '' };
    const lv = ['lv1', 'lv2', 'lv3', 'lv4'];
    LW.forEach((wd, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, wd, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, GRID.h, 'pm-tile', 8);
      const lines = wrap(t, GRID.tile - 12);
      if (lines.length > 2) throw new Error(`grid row ${t} wraps to ${lines.length} lines`);
      const y0 = lines.length === 1 ? y + 32 : y + 21;
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
    const o = { r: ['', '', '', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 7;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 2 ? tr('De route', 'The route') : tr('Het frame', 'The frame');
      if (b === 0) o.flow = op(span(p, 0.05, 0.4), frameFlow());
      if (b === 1) o.melt = op(span(p, 0.05, 0.4), meltDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.cutters = routeGroup(0, tr('Lassen', 'Welding', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.support = routeGroup(3, tr('Bouten, lijm en serie', 'Bolts, glue and series', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 6) {
      title = [tr('Booglassen', 'Arc welding', 150), tr('Puntlassen', 'Spot welding', 150), tr('Lasfouten', 'Defects', 150), tr('Bouten', 'Bolts', 150), tr('Lijmen', 'Bonding', 150), tr('Productie', 'Production', 150)][si - 1];
      o.r = strip(si - 1);
      Object.assign(o, [arcParts, spotParts, defParts, boltParts, glueParts, cellParts][si - 1](b, p));
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
