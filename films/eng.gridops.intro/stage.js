// The stage of the module intro film "Het net draaiend houden / Keeping the grid running": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, TECHSHIFT, PLANSHIFT, W, H,
// LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as
// the kit's label check measures). The story is drawn in hall B, at the left: the cable from the grid comes in through the
// left wall to the power cabinet, line 3 stands at the right; a technician and a planner of the grid operator come and go,
// and the hall goes dark while a cable is down. The panel at the right draws each beat as a schema, labelled "voorbeeld"
// (line 3's way) or "schema" (the module's map). Every part a sentence lights is a static data-cue group (build.mjs); this
// script only fills the panel and shows or hides the room's moving parts.
// The closing scene (the shared Engineering map, then the module's four topics with their levels) is ONE function,
// closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than the panel
// (the kit checks that they fit).
/* global CAM, TECHSHIFT, PLANSHIFT, W, H, LV, MAPZ, MAPSZ, GRID, KEYS, CW, wrapUnits, span, beatStarts */
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
  const IDS = ['connect', 'field', 'outage', 'congestion'];
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
  // s1 the technician stands by the wall entry and the planner in the hall; s2 the planner stands by the cabinet; s3 the
  // technician stands by the cabinet; s4 nobody (the hall is dark while the cable is down, and light again when the
  // centre has switched round); s5 both come back in the last beat, with line 3
  function room(si, b, p) {
    const mv = (e, sh) => move(e, sh ? `translate(${sh[0]} ${sh[1]})` : '');
    mv(E['pp-tech'], TECHSHIFT[si]);
    mv(E['pp-planner'], PLANSHIFT[si]);
    const last = si === 4 && b === 3 ? span(p, 0, 0.35) : 0;
    show(E['pp-tech'], si === 0 || si === 2 ? 1 : last);
    show(E['pp-planner'], si === 0 || si === 1 ? 1 : last);
    let dark = 0;
    if (si === 3) dark = b === 0 ? span(p, 0, 0.35) : b <= 2 ? 1 : b === 3 ? 1 - span(p, 0.45, 0.9) : 0;
    show(E.dim, 0.55 * dark);
  }

  // ---- the four topic tiles
  // the route (s1, the last two beats): the module's four topics in two groups, the map before the detail. The request
  // and the field work (topics 1 and 2), then the daily work of outages and a full grid (topics 3 and 4), each row with
  // its number and its index title, wrapped by the kit's widths into 240 units left of the number; a title of two lines
  // gets a taller row
  function routeGroup(first, head, a) {
    let y = first === 0 ? 74 : 206;
    let s = txt(334, y, head, 22, 'start', 'pm-mute');
    y += 8;
    for (let i = first; i < first + 2; i++) {
      const lines = wrap(TITLE[i], 240).slice(0, 3);
      const h = [34, 56, 78][lines.length - 1];
      s += rect(334, y, 284, h, 'pm-tile', 6) + txt(614, y + 25, String(i + 1), 22, 'end', 'pm-on');
      lines.forEach((l, j) => { s += txt(342, y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
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
  const chipAt = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
  const chip1 = chipAt(110, tr('Kortsluitverklikker', 'Fault indicator', 260));
  const chip2 = chipAt(152, tr('Normaal openpunt', 'Normally open point', 260));
  function tools(b, p, at, one, two) {
    const chip = chipAt;
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a card with a bold line and a muted line
  function card(y, a, b, c, d, cls = 'pm-card') {
    return rect(334, y, 284, 58, cls, 8) + txt(346, y + 25, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 49, tr(c, d, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  }

  // ---- s1: line 3 asks for a heavier connection, the grid operator's tasks. Panel under the heading (y from 60).
  function flowDrawing() {
    const box = (y, a, b, cls) => rect(334, y, 284, 52, cls, 8) + txt(346, y + 34, tr(a, b, 260), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
    return box(64, 'Lijn 3', 'Line 3', 'pm-card') + arrow(476, 120, 476, 146) + box(150, 'Netbeheerder', 'Grid operator', 'pm-card') + arrow(476, 206, 476, 232) + box(236, 'Zwaardere aansluiting', 'Heavier connection', 'pm-crit')
      + txt(334, 326, tr('meer stroom voor lijn 3', 'more power for line 3', 284), 22, 'start', 'pm-mute');
  }
  function taskDrawing() {
    const row = (y, a, b, cls) => rect(334, y, 284, 48, cls, 8) + txt(346, y + 32, tr(a, b, 260), 22, 'start', 'pm-big');
    return row(100, 'Aansluiten', 'Connect', 'pm-tile') + row(160, 'Het net onderhouden', 'Maintain the grid', 'pm-tile') + row(220, 'Storingen verhelpen', 'Restore outages', 'pm-tile')
      + txt(334, 310, tr('dag en nacht', 'day and night', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: from request to connection: the offer, work preparation, the readiness check.
  const reqDrawing = () => card(100, 'Aanvraag', 'Request', 'van de fabriek', 'from the plant') + arrow(476, 162, 476, 190) + card(194, 'Offerte', 'Offer', 'van de netbeheerder', 'from the grid operator', 'pm-crit');
  function prepDrawing() {
    const tile = (y, a, b) => rect(334, y, 284, 40, 'pm-tile', 6) + txt(346, y + 28, tr(a, b, 260), 22, 'start', 'pm-txt');
    return rect(334, 100, 284, 46, 'pm-card', 8) + txt(346, 131, tr('Werkvoorbereiding', 'Work preparation', 260), 22, 'start', 'pm-big')
      + tile(160, 'Vergunning', 'Permit') + tile(206, 'Materiaal', 'Material') + tile(252, 'Planning', 'Planning');
  }
  // the readiness check: a list that has to be ticked before the job is planned, under the chip
  function checkDrawing() {
    const row = (y, a, b) => rect(334, y, 284, 36, 'pm-tile', 6) + txt(346, y + 26, tr(a, b, 220), 22, 'start', 'pm-txt') + path(`M572 ${y + 19}l7 8l15 -16`, 'pm-tick');
    return row(172, 'Ontwerp', 'Design') + row(214, 'Vergunning', 'Permit') + row(256, 'Materiaal', 'Material') + row(298, 'Ploeg', 'Crew');
  }

  // ---- s3: field work: the heavier cable, switching a part of the grid off in order, the switching plan.
  const reinfDrawing = () => card(100, 'Zwaardere kabel', 'Heavier cable', 'naar hal B', 'to hall B', 'pm-crit') + arrow(476, 162, 476, 190) + card(194, 'Klus voor de ploeg', 'Job for the crew', 'verzwaring van het net', 'upgrade of the grid');
  function stepDrawing() {
    const row = (y, n, a, b) => rect(334, y, 284, 44, 'pm-tile', 8) + txt(346, y + 31, String(n), 22, 'start', 'pm-on') + txt(378, y + 31, tr(a, b, 230), 22, 'start', 'pm-txt');
    return row(100, 1, 'Uitschakelen', 'Switch off') + arrow(476, 146, 476, 156) + row(158, 2, 'Veilig maken', 'Make safe') + arrow(476, 204, 476, 214) + row(216, 3, 'Terugschakelen', 'Switch back')
      + txt(334, 318, tr('de volgorde telt', 'the order counts', 284), 22, 'start', 'pm-mute');
  }
  // the switching plan: a sheet with numbered lines, under the chip
  function planDrawing() {
    let s = rect(334, 176, 284, 150, 'pm-card', 8);
    for (let i = 0; i < 3; i++) s += txt(348, 214 + i * 46, String(i + 1), 22, 'start', 'pm-big') + rect(380, 198 + i * 46, 222, 16, 'pm-bar', 4);
    return s + txt(334, 356, tr('stap voor stap', 'step by step', 284), 22, 'start', 'pm-mute');
  }

  // ---- s4: outages and asset risk. A medium-voltage ring: a substation feeds two strands that meet at the normally open
  // point; a cable fails on the right strand, the plant (hall B) hangs on the station below it. subY is the top of the
  // substation box, bot the line of the normally open point. ind: the fault indicators (the one the fault current passed
  // is lit); closed: the normally open point is closed and the section below the fault is fed from the other side.
  function ring(subY, bot, ind, closed) {
    const L = 372;
    const R = 580;
    const M = 476;
    const mid = subY + 17;
    const sp = bot - mid;
    const yL1 = mid + sp * 0.3;
    const yL2 = mid + sp * 0.62;
    const yR1 = mid + sp * 0.18;
    const yF = mid + sp * 0.45;
    const yR2 = mid + sp * 0.72;
    const node = (x, y, lit) => rect(x - 8, y - 8, 16, 16, lit ? 'pm-lamp' : 'pm-tile', 3);
    let s = rect(M - 76, subY, 152, 34, 'pm-card', 6) + txt(M, subY + 25, tr('Onderstation', 'Substation', 140), 22, 'middle', 'pm-big');
    s += path(`M${M - 76} ${mid}H${L}V${bot}H${closed ? M : M - 10}`, 'pm-link');
    s += path(`M${M + 76} ${mid}H${R}V${f1(yF - 14)}`, 'pm-link') + path(`M${R - 9} ${f1(yF - 9)}l18 18M${R - 9} ${f1(yF + 9)}l18 -18`, 'pm-gap');
    s += path(`M${R} ${f1(yF + 14)}V${bot}H${closed ? M : M + 10}`, closed ? 'pm-live' : 'pm-link');
    if (closed) s += arrow(M + 14, bot - 14, M + 56, bot - 14);
    s += closed ? circ(M, bot, 8, 'pm-crit') : circ(M, bot, 8, 'pm-tile');
    s += node(L, yL1, false) + node(L, yL2, false) + node(R, yR1, ind) + node(R, yR2, false);
    s += txt(R - 16, f1(yR2 + 7), tr('Hal B', 'Hall B', 80), 22, 'end', 'pm-big') + txt(R - 16, f1(yF + 7), tr('storing', 'fault', 90), 22, 'end', 'pm-big');
    return s;
  }
  const ringDrawing = () => ring(100, 300, false, false);
  function ctrDrawing() {
    return rect(334, 100, 284, 160, 'pm-card', 8) + txt(346, 134, tr('Het centrum', 'The centre', 260), 22, 'start', 'pm-big')
      + txt(346, 164, tr('bewaakt en schakelt', 'watches and switches', 260), 22, 'start', 'pm-mute') + txt(346, 190, tr('het net', 'the grid', 260), 22, 'start', 'pm-mute')
      + rect(346, 208, 260, 40, 'pm-crit', 8) + txt(476, 236, tr('dag en nacht', 'day and night', 240), 22, 'middle', 'pm-on');
  }
  // the ring under the two chips (y 110 to 186), the fault indicator of the last station that sparked lit
  const ring2Drawing = (closed) => ring(198, 366, true, closed);
  // assets ranked by risk: three rows, the longest bar the highest risk
  function riskDrawing() {
    const row = (y, n, a, b, wd, cls) => txt(346, y + 22, tr(a, b, 220), 22, 'start', 'pm-txt') + txt(610, y + 22, String(n), 22, 'end', 'pm-big') + rect(346, y + 32, wd, 16, cls, 4);
    return row(100, 1, 'Oude kabel', 'Old cable', 250, 'pm-crit') + row(160, 2, 'Station', 'Station', 150, 'pm-bar') + row(220, 3, 'Nieuwe kabel', 'New cable', 70, 'pm-bar')
      + txt(334, 326, tr('kans op falen', 'likelihood of failure', 284), 22, 'start', 'pm-mute') + txt(334, 352, tr('maal effect', 'times consequence', 284), 22, 'start', 'pm-mute');
  }

  // ---- s5: a day curve with a peak above the limit, the team steering it down, buying flexibility, the grid keeps running.
  const HS = [34, 30, 38, 60, 96, 128, 136, 116, 70, 44, 36, 32];
  function peakDrawing() {
    let s = '';
    HS.forEach((h, i) => {
      const lo = Math.min(h, 100);
      s += rect(336 + i * 24, 272 - lo, 20, lo, 'pm-bar', 3);
      if (h > 100) s += rect(336 + i * 24, 272 - h, 20, h - 100, 'pm-full', 3);
    });
    return s + path('M334 272H618', 'pm-link') + path('M334 172H618', 'pm-dash') + txt(618, 160, tr('grens', 'limit', 120), 22, 'end', 'pm-mute')
      + txt(334, 316, tr('te veel op de piek', 'too much at the peak', 284), 22, 'start', 'pm-big');
  }
  function steerDrawing() {
    let s = '';
    HS.forEach((h, i) => { s += rect(336 + i * 24, 272 - Math.min(h, 100), 20, Math.min(h, 100), 'pm-bar', 3); });
    s += rect(336, 272 - 34 - 26, 20, 26, 'pm-crit', 3) + rect(360, 272 - 30 - 26, 20, 26, 'pm-crit', 3) + rect(576, 272 - 36 - 26, 20, 26, 'pm-crit', 3);
    return s + path('M334 272H618', 'pm-link') + path('M334 172H618', 'pm-dash') + txt(618, 160, tr('grens', 'limit', 120), 22, 'end', 'pm-mute')
      + path('M470 134Q420 108 370 138', 'pm-arrow') + path('M376 128L368 139L381 142', 'pm-arrow')
      + txt(334, 316, tr('meer klanten passen', 'more customers fit', 284), 22, 'start', 'pm-big') + txt(334, 342, tr('op hetzelfde net', 'on the same grid', 284), 22, 'start', 'pm-mute');
  }
  const gopDrawing = () => card(176, 'Netbeheerder', 'Grid operator', 'vraagt flexibiliteit', 'asks for flexibility') + arrow(476, 238, 476, 266) + card(270, 'Aanbieder', 'Provider', 'neemt minder af', 'takes less', 'pm-crit');
  const endDrawing = () => card(100, 'Het net draait', 'The grid runs', 'dag en nacht bewaakt', 'watched day and night') + arrow(476, 162, 476, 190) + card(194, 'Lijn 3', 'Line 3', 'zwaardere aansluiting', 'heavier connection', 'pm-crit');

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Netbedrijf en assetmanagement lit, the whole sheet and then zoomed to the lit place at 1.5; then the
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
      title = b >= 2 ? tr('De route', 'The route') : b === 1 ? tr('Netbeheerder', 'Grid operator', 190) : tr('Lijn 3', 'Line 3');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing());
      if (b === 1) o.taskS = op(span(p, 0.05, 0.4), taskDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, tr('Van aanvraag tot klus', 'From request to job', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.grpB = routeGroup(2, tr('Het dagelijkse werk', 'The daily work', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Aansluiting', 'Connection', 150), tr('Veldwerk', 'Field work', 150), tr('Storing', 'Outage', 150), tr('Een vol net', 'A full grid', 150)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { reqS: fade(b, 0, p, reqDrawing(), 0.1, 0.5), prepS: fade(b, 1, p, prepDrawing(), 0.1, 0.5), checkS: fade(b, 2, p, checkDrawing(), 0.25, 0.65), ...tools(b, p, 2, tr('Gereedheidscheck', 'Readiness check', 260)) });
      if (si === 2) Object.assign(o, { reinfS: fade(b, 0, p, reinfDrawing(), 0.1, 0.5), stepS: fade(b, 1, p, stepDrawing(), 0.1, 0.5), planS: fade(b, 2, p, planDrawing(), 0.25, 0.65), ...tools(b, p, 2, tr('Schakelplan', 'Switching plan', 260)) });
      if (si === 3) Object.assign(o, { ringS: fade(b, 0, p, ringDrawing(), 0.1, 0.5), ctrS: fade(b, 1, p, ctrDrawing(), 0.1, 0.5), ring2S: b === 2 ? op(span(p, 0.3, 0.7), ring2Drawing(false)) : b === 3 ? ring2Drawing(p > 0.45) : '', riskS: fade(b, 4, p, riskDrawing(), 0.1, 0.5),
        tool1: b === 2 ? op(span(p, 0, 0.4), chip1) : b === 3 ? chip1 : '', tool2: b === 3 ? op(span(p, 0, 0.4), chip2) : '' });
      if (si === 4) Object.assign(o, { peakS: fade(b, 0, p, peakDrawing(), 0.1, 0.5), steerS: fade(b, 1, p, steerDrawing(), 0.1, 0.6), gopS: fade(b, 2, p, gopDrawing(), 0.25, 0.65), endS: fade(b, 3, p, endDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('GOPACS', 'GOPACS', 260)) });
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
