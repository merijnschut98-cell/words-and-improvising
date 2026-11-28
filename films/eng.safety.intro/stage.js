// The stage of the module intro film "Veilig door de dienst / Safe through the shift": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the run field film: the filling unit over the belt of line 3
// with its cartons, you and the team lead; the grey cabinet with its switch at the back wall appears at the sentence that
// cuts the energy off there, its lock and tag at the sentence that names the lockout. The panel at the right draws each beat
// as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map). The hazard, the risk, the RI&E, the check,
// the guard and the incident are panel schemas only. Every part a sentence lights is a static data-cue group (build.mjs);
// this script only fills the panel and shows or hides the room's moving parts. The closing scene (the shared Engineering
// map, then the module's four topics with their levels) is ONE function, closing; the map itself is the kit's mapScene.
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
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const dot = (x, y, r) => `<circle class="pm-joint" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const head = dy === 0 ? `M${f1(x1 - 6 * dx)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6 * dx)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * dy)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * dy)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const IDS = ['risk', 'energy', 'machine', 'culture'];
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

  // ---- the room: you and the team lead come in at the sentence that names you (the opening's third beat) and again at the
  // end of the last topic (where the shift ends with line 3 safe). The grey cabinet with its switch stands from the sentence
  // that cuts the energy off there (the second beat of the isolation scene), its lock and tag from the sentence that names
  // the lockout (the fourth beat)
  function room(si, b) {
    show(E['o-iso'], (si === 2 && b >= 1) ? 1 : 0);
    show(E['o-lock'], (si === 2 && b >= 3) ? 1 : 0);
    show(E['pp-jij'], (si === 0 && b >= 2) || (si === 4 && b === 3) ? 1 : 0);
    show(E['pp-teamlead'], (si === 0 && b >= 2) || (si === 4 && b === 3) ? 1 : 0);
  }


  // ---- the route (s1, the last three beats): the module's four topics in two groups, the map before the detail. Each
  // row has its number and its index title, wrapped by the kit's widths into 240 units left of the number; a title of two
  // or three lines gets a taller row. The rows keep their place whichever groups show
  const ROUTE = (() => {
    const rows = [];
    let y = 52;
    [[0, 1], [2, 3]].forEach((grp) => {
      grp.forEach((i) => {
        const lines = wrap(TITLE[i], 240);
        const h = lines.length === 1 ? 34 : lines.length === 2 ? 56 : 78;
        rows.push({ i, y, h, lines });
        y += h + 6;
      });
      y += 10;
    });
    return rows;
  })();
  function routeGroup(first, count, a) {
    let s = '';
    ROUTE.filter((r) => r.i >= first && r.i < first + count).forEach((r) => {
      s += rect(334, r.y, 284, r.h, 'pm-tile', 6) + txt(610, r.y + 25, String(r.i + 1), 22, 'end', 'pm-on');
      r.lines.forEach((l, j) => { s += txt(346, r.y + 25 + j * 22, l, 22, 'start', 'pm-txt'); });
    });
    return op(a, s);
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }
  // the tool's name as a chip high in the panel under the strip (one short sentence names it; it is not explained). Shown in
  // the beat of the sentence (b === at)
  function tools(b, p, at, one, key) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { [key]: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a card with a name and one muted line under it (a 62-unit card)
  const card2 = (y, a, b, c, d, cls = 'pm-card', room = 260) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a card with one line (a 44-unit card)
  const card1 = (y, a, b, cls = 'pm-card', room = 260) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
  // a tile with one line (a 34-unit row)
  const tile = (y, a, b, cls = 'pm-tile', room = 260) => rect(334, y, 284, 34, cls, 6) + txt(346, y + 25, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');

  // ---- s1: line 3 must not hurt anyone; the module runs from the risks to a culture that learns; a whole shift.
  function safeDrawing() {
    return card1(64, 'Lijn 3', 'Line 3') + arrow(476, 112, 476, 126) + card1(130, 'Mensen', 'People') + arrow(476, 178, 476, 192) + card1(196, 'Niemand gewond', 'Nobody hurt', 'pm-crit');
  }
  function askDrawing() {
    return card1(64, 'Risico’s', 'Risk') + arrow(476, 112, 476, 126) + card1(130, 'Een cultuur die leert', 'A culture that learns', 'pm-crit');
  }
  function shiftDrawing() {
    let s = txt(334, 112, tr('Een hele dienst', 'A whole shift', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 8; i++) s += rect(334 + i * 36, 126, 32, 34, i < 7 ? 'pm-tile' : 'pm-out', 6);
    return s + path('M334 196H618M610 191L618 196L610 201', 'pm-arrow') + txt(334, 236, tr('veilig, de hele dienst', 'safe, all shift', 284), 22, 'start', 'pm-mute');
  }

  // ---- s2: a hazard is anything that can do harm; risk is how likely the harm is, combined with how bad it would be; the
  // RI&E (chip above) records the risks with a plan of action (which measure, who, by when); the LMRA (chip above) is a short
  // check just before the start that catches what has changed.
  function hazDrawing() {
    return card2(104, 'Gevaar', 'Hazard', 'kan schade doen', 'can do harm') + arrow(476, 170, 476, 184) + card1(188, 'Schade', 'Harm', 'pm-crit');
  }
  function riskDrawing() {
    return tile(104, 'Hoe waarschijnlijk', 'How likely') + tile(144, 'Hoe erg', 'How bad') + arrow(476, 182, 476, 196) + card1(200, 'Risico', 'Risk', 'pm-crit');
  }
  function rieDrawing() {
    // a form with a plan of action: three columns (measure, who, by when) and three rows
    let s = rect(334, 166, 284, 176, 'pm-card', 8) + txt(346, 196, tr('plan van aanpak', 'plan of action', 260), 22, 'start', 'pm-mute')
      + txt(346, 232, tr('maatregel', 'measure', 112), 22, 'start', 'pm-mute') + txt(460, 232, tr('wie', 'who', 50), 22, 'start', 'pm-mute') + txt(514, 232, tr('wanneer', 'by when', 100), 22, 'start', 'pm-mute');
    [262, 292, 322].forEach((y) => { s += path(`M346 ${y}H446`, 'pm-link') + rect(460, y - 10, 36, 20, 'pm-bar', 4) + rect(514, y - 10, 80, 20, 'pm-bar', 4); });
    return s;
  }
  function lmraDrawing() {
    // a short check: three questions, each a box and a line; the last answer is a no, so you do not start
    let s = txt(334, 176, tr('vlak voor de start', 'just before the start', 284), 22, 'start', 'pm-mute') + rect(334, 190, 284, 146, 'pm-card', 8);
    [214, 254, 294].forEach((y, i) => {
      s += rect(348, y, 28, 28, i < 2 ? 'pm-tile' : 'pm-out', 6) + path(`M392 ${y + 14}H${i === 1 ? 560 : 596}`, 'pm-link');
      if (i < 2) s += path(`M354 ${y + 15}L361 ${y + 22}L371 ${y + 7}`, 'pm-arrow');
      else s += path(`M355 ${y + 7}L369 ${y + 21}M369 ${y + 7}L355 ${y + 21}`, 'pm-cross');
    });
    return s;
  }

  // ---- s3: stopping is not isolating (a stop can be reset, bridged or fail); the energy is cut off at the switch in the grey
  // cabinet, the isolation point; lockout-tagout (chip above) fits your own lock and a tag with your name on that switch.
  function stopDrawing() {
    return card2(108, 'Stoppen', 'Stopping', 'kan weer starten', 'can start again') + card2(188, 'Scheiden', 'Isolating', 'de energie is weg', 'the energy is cut off', 'pm-crit');
  }
  function isoDrawing() {
    return card1(104, 'Energie', 'Energy') + arrow(476, 152, 476, 166) + card1(170, 'Schakelaar', 'Switch', 'pm-crit') + arrow(476, 218, 476, 232) + card1(236, 'Eenheid', 'Unit');
  }
  function permDrawing() {
    // electrical work needs a written appointment; risky work such as welding needs a permit to work
    return card2(108, 'Elektrisch werk', 'Electrical work', 'alleen aangewezen', 'only if appointed') + card2(196, 'Werkvergunning', 'Permit to work', 'riskant werk', 'risky work');
  }
  function lockDrawing() {
    // the switch with its handle, your lock on it and a tag with your name hanging from the lock
    let s = rect(346, 182, 96, 128, 'pm-card', 8) + rect(378, 198, 32, 52, 'pm-lvl', 6) + rect(388, 262, 26, 22, 'pm-crit', 5) + path('M393 262V254A8 8 0 0 1 409 254V262', 'pm-link')
      + rect(402, 288, 30, 22, 'pm-card', 4) + path('M408 299H426', 'pm-link');
    s += txt(458, 230, tr('eigen slot', 'own lock', 160), 22, 'start', 'pm-mute') + txt(458, 300, tr('naamlabel', 'name tag', 160), 22, 'start', 'pm-mute');
    return s;
  }

  // ---- s4: most accidents with machines happen in the danger zone; a guard keeps people out or stops the motion before they
  // are there; the interlocked guard (chip above) is a door or cover with a safety switch that stops the dangerous motion.
  function zoneBase(person) {
    return rect(392, 112, 214, 190, 'pm-out', 12) + rect(444, 156, 110, 88, 'pm-bar', 8) + (person === 'in' ? dot(420, 258, 10) + path('M420 268V290', 'pm-link') : '');
  }
  function zoneDrawing() {
    return zoneBase('in') + txt(499, 340, tr('gevarenzone', 'danger zone', 284), 22, 'middle', 'pm-mute');
  }
  function guardDrawing() {
    // the same zone with a guard between it and the person outside
    return zoneBase('out') + rect(372, 104, 10, 206, 'pm-crit', 3) + dot(348, 270, 10) + path('M348 280V300', 'pm-link') + txt(334, 340, tr('afscherming', 'guard', 284), 22, 'start', 'pm-mute');
  }
  function ilkDrawing() {
    // a door in a frame with a safety switch on its edge; opening it stops the motion
    return rect(346, 176, 14, 132, 'pm-tile', 3) + rect(366, 176, 90, 132, 'pm-card', 6) + rect(446, 226, 20, 32, 'pm-crit', 4) + arrow(470, 242, 520, 242) + rect(524, 224, 90, 36, 'pm-badge', 6) + txt(569, 249, tr('stopt', 'stops', 80), 22, 'middle', 'pm-txt');
  }

  // ---- s5: a near miss is an event that could have done harm but did not; you report it without blame and it gives free
  // lessons; the incident investigation (chip above) asks what happened, why it made sense and what must change, not who is
  // to blame; the shift ends with line 3 safe.
  function nearDrawing() {
    // a carton falls where, by luck, nobody stands
    return rect(420, 110, 46, 40, 'pm-card', 5) + path('M443 160V248', 'pm-dash') + rect(334, 262, 284, 10, 'pm-bar', 4) + dot(556, 226, 10) + path('M556 236V262', 'pm-link') + txt(334, 318, tr('bijna-ongeval', 'near miss', 284), 22, 'start', 'pm-mute');
  }
  function learnDrawing() {
    return card1(104, 'Bijna-ongeval', 'Near miss') + arrow(476, 152, 476, 166) + card1(170, 'Melding', 'Report') + arrow(476, 218, 476, 232) + card1(236, 'Een gratis les', 'A free lesson', 'pm-crit') + txt(334, 324, tr('zonder schuldvraag', 'without blame', 284), 22, 'start', 'pm-mute');
  }
  function invDrawing() {
    return tile(166, 'Wat gebeurde er', 'What happened') + tile(206, 'Waarom was het logisch', 'Why it made sense') + tile(246, 'Wat moet er veranderen', 'What must change')
      + rect(334, 296, 284, 34, 'pm-out', 6) + txt(346, 321, tr('Wie heeft schuld', 'Who is to blame', 200), 22, 'start', 'pm-mute') + path('M586 304L604 322M604 304L586 322', 'pm-cross');
  }
  function endDrawing() {
    return card1(120, 'Jij en de teamleider', 'You and the team lead') + arrow(476, 168, 476, 182) + card1(186, 'Lijn 3', 'Line 3') + arrow(476, 234, 476, 248) + card1(252, 'Een veilige dienst', 'A safe shift', 'pm-crit');
  }


  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Safety lit, the whole sheet and then zoomed to the lit place at 1.5; then the
  // module's four topics, each with its four levels as columns (the words the app uses for the levels), the start marker on
  // the first level of the first topic.
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
  // the columns (GRID from build.mjs, which checks the level words fit): a tile column of GRID.tile units, four level
  // columns of GRID.col from GRID.x with boxes of GRID.box. The level words stand on one line each, staggered over two
  // rows (the first and third high, the second and fourth low), so neighbours never meet.
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
      const y0 = lines.length === 1 ? y + 38 : y + 27;
      lines.forEach((l, j) => { s += txt(26, y0 + j * 22, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.1, i * 0.1 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 8, GB, GRID.h - 16, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.start = rect(GX - 5, gridY(0) + 3, GB + 10, GRID.h - 6, 'pm-out', 10);
    return out;
  }


  const HEAD = [[tr('Risico’s', 'Risk', 165)], [tr('Scheiden', 'Isolation', 165)], [tr('Machines', 'Machines', 165)], [tr('Incidenten', 'Incidents', 165)]];

  function render(si, u) {
    const { b, p } = beatOf(si, u);
    camera(si, u, b, p);
    room(si, b);
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
      if (b === 0) o.safeS = op(span(p, 0.05, 0.4), safeDrawing());
      if (b === 1) o.askS = askDrawing();
      if (b === 2) o.shiftS = op(span(p, 0.05, 0.4), shiftDrawing());
      if (b >= 3) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, 2, b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b >= 4) o.grpB = routeGroup(2, 2, b === 4 ? span(p, 0.05, 0.4) : 1);
      }
    } else if (si >= 1 && si <= 4) {
      title = HEAD[si - 1][0];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { hazS: fade(b, 0, p, hazDrawing(), 0.1, 0.5), riskS: fade(b, 1, p, riskDrawing(), 0.1, 0.5), rieS: b === 2 ? op(span(p, 0.3, 0.7), rieDrawing()) : '', lmraS: b === 3 ? op(span(p, 0.3, 0.7), lmraDrawing()) : '', ...tools(b, p, 2, tr('RI&E', 'RI&E', 260), 'tool1'), ...tools(b, p, 3, tr('LMRA', 'LMRA', 260), 'tool2') });
      if (si === 2) Object.assign(o, { stopS: fade(b, 0, p, stopDrawing(), 0.1, 0.5), isoS: fade(b, 1, p, isoDrawing(), 0.1, 0.5), permS: b === 2 ? op(span(p, 0.3, 0.7), permDrawing()) : '', lockS: b === 3 ? op(span(p, 0.3, 0.7), lockDrawing()) : '', ...tools(b, p, 3, tr('Vergrendelen en labelen', 'LOTO', 268), 'tool1') });
      if (si === 3) Object.assign(o, { zoneS: fade(b, 0, p, zoneDrawing(), 0.1, 0.5), guardS: fade(b, 1, p, guardDrawing(), 0.1, 0.5), ilkS: b === 2 ? op(span(p, 0.3, 0.7), ilkDrawing()) : '', ...tools(b, p, 2, tr('Beveiligde afscherming', 'Interlocked guard', 260), 'tool1') });
      if (si === 4) Object.assign(o, { nearS: fade(b, 0, p, nearDrawing(), 0.1, 0.5), learnS: fade(b, 1, p, learnDrawing(), 0.1, 0.5), invS: b === 2 ? op(span(p, 0.3, 0.7), invDrawing()) : '', endS: fade(b, 3, p, endDrawing(), 0.1, 0.5), ...tools(b, p, 2, tr('Incidentonderzoek', 'Incident investigation', 260), 'tool1') });
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
