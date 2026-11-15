// The stage of the module intro film "Van MES-order tot draaiende eenheid / From MES order to a running unit": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H,
// LV, MAPZ, MAPSZ, GRID, KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as
// the kit's label check measures). The story is drawn in hall B, at the left: the new filling unit over the start of line 3's
// belt with the tank behind it, the MES laptop on the table at the front, and you, the engineer; the PLC cabinet, the pair of
// photo-eyes, the network cabinet and the cable between the laptop and the PLC cabinet appear in the beat that names them.
// The panel at the right draws each beat as a schema, labelled "voorbeeld" (the unit's way) or "schema" (the module's map).
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows or hides
// the room's moving parts. The closing scene (the shared Engineering map, then the module's four topics with their levels)
// is ONE function, closing; the map itself is the kit's mapScene.
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
  const IDS = ['levels', 'stack', 'protocols', 'convergence'];
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

  // ---- the room: who and what stands there, per scene (si) and beat (b). The MES laptop, the unit, its tank and line 3 are
  // there from the first beat; you appear in the second (the question is yours); the PLC cabinet and the photo-eyes appear
  // in the beat that names them (s2, beat 2); the network cabinet and the cable in the beat of the order's way down (s3, beat 3).
  function room(si, b, p) {
    show(E['pp-jij'], si === 0 ? (b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.6) : 1) : si <= 4 ? 1 : 0);
    const lvl = si === 1 ? (b >= 1 ? 1 : 0) : si >= 2 && si <= 4 ? 1 : 0;
    show(E['o-plc'], lvl);
    show(E['o-eye'], lvl);
    show(E['o-net'], si === 2 ? (b >= 2 ? 1 : 0) : si >= 3 && si <= 4 ? 1 : 0);
  }

  // ---- the four topic tiles
  // the route (s1, the last two beats): the module's four topics in two groups, the map before the detail. The two about
  // the layers and the systems (topics 1 and 2) and the two about how they talk and who looks after them (topics 3 and 4),
  // each row with its number and its index title, wrapped by the kit's widths into 240 units left of the number; a title of
  // more lines gets a taller row
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
  // explained). Shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a drawing that stays from beat i to beat j, fading in once, in beat i
  const stay = (b, i, j, p, body, a = 0.05, z = 0.4) => (b < i || b > j ? '' : b === i ? op(span(p, a, z), body) : body);

  // ---- s1 and s5: three boxes one above the other with a middle one in dashes or lit. s1: the order on the MES, what lies
  // between, the machine that fills; then the business system, the systems and the machine. s5: office IT and the floor
  // grow together (the arrows point to each other).
  function frameDrawing(top, mid, bottom, midCls, toward) {
    const label = (y, t, cls) => rect(334, y, 284, 44, cls, 8) + txt(476, y + 30, t, 22, 'middle', 'pm-big');
    return label(100, top, 'pm-card') + (toward ? arrow(476, 150, 476, 166) + arrow(476, 254, 476, 238) : arrow(476, 150, 476, 166) + arrow(476, 254, 476, 270))
      + rect(334, 172, 284, 64, midCls, 8) + txt(476, 212, mid, 22, 'middle', midCls === 'pm-crit' ? 'pm-on' : 'pm-big')
      + label(262, bottom, 'pm-card');
  }
  const orderDrawing = (crit) => frameDrawing(tr('order op het MES', 'order on the MES', 270), crit ? tr('wat gebeurt hier?', 'what happens here?', 270) : '?', tr('de eenheid vult', 'the unit fills', 270), crit ? 'pm-crit' : 'pm-out', false);
  const isaDrawing = () => frameDrawing(tr('bedrijfssysteem', 'business system', 270), tr('de systemen', 'the systems', 270), tr('machine', 'machine', 270), 'pm-crit', false);
  const joinDrawing = () => frameDrawing(tr('kantoor-IT', 'office IT', 270), tr('groeien samen', 'grow together', 270), tr('de vloer', 'the floor', 270), 'pm-crit', true);

  // ---- s2: the five levels, level 4 at the top. lvLow: levels 2, 1 and 0; lvHigh: levels 4 and 3. The level number at the left,
  // its name beside it.
  function levelRows(rows) {
    return rows.map(([n, name]) => rect(334, 100 + (4 - n) * 46, 284, 40, 'pm-tile', 6) + txt(346, 128 + (4 - n) * 46, String(n), 22, 'start', 'pm-mute') + txt(380, 128 + (4 - n) * 46, name, 22, 'start', 'pm-txt')).join('');
  }
  const lowRows = () => levelRows([[2, 'PLC'], [1, tr('fotocel', 'photo eye', 230)], [0, tr('het proces', 'the process', 230)]]);
  const highRows = () => levelRows([[4, 'ERP'], [3, 'MES']]);

  // ---- s3: the systems from ERP at the top to PLC at the bottom, each with what it is for; then the order's arrow down
  // (right of the rows) and what is made going up
  function sysDrawing() {
    const row = (y, name, role) => rect(334, y, 250, 44, 'pm-card', 8) + txt(346, y + 30, name, 22, 'start', 'pm-big') + txt(436, y + 30, role, 22, 'start', 'pm-mute');
    return row(100, 'ERP', tr('bedrijf', 'business', 140)) + row(152, 'MES', tr('productie', 'production', 140)) + row(204, 'SCADA', tr('bewaken', 'monitoring', 140)) + row(256, 'PLC', tr('machine', 'machine', 140));
  }
  const downDrawing = () => arrow(600, 104, 600, 296) + txt(334, 336, tr('order omlaag', 'order down', 260), 22, 'start', 'pm-big');
  const upDrawing = () => arrow(618, 296, 618, 104) + txt(334, 366, tr('telling omhoog', 'count up', 260), 22, 'start', 'pm-big');

  // ---- s4: the PLC and the MES with a talk between them (agreed language), then the two protocols; the historian: a database
  // drum with a trend beside it
  function talkDrawing() {
    return rect(334, 140, 110, 54, 'pm-card', 8) + txt(389, 175, 'PLC', 22, 'middle', 'pm-big') + rect(508, 140, 110, 54, 'pm-card', 8) + txt(563, 175, 'MES', 22, 'middle', 'pm-big')
      + arrow(450, 156, 502, 156) + arrow(502, 178, 450, 178) + txt(476, 226, tr('afgesproken taal', 'agreed language', 284), 22, 'middle', 'pm-mute');
  }
  function protoDrawing() {
    const row = (y, name, what) => rect(334, y, 284, 44, 'pm-tile', 8) + txt(346, y + 30, name, 22, 'start', 'pm-big') + txt(450, y + 30, what, 22, 'start', 'pm-mute');
    return row(262, 'OPC UA', tr('machinedata', 'machine data', 160)) + row(314, 'MQTT', tr('berichten', 'messages', 160));
  }
  function histDrawing() {
    const drum = path('M346 124A44 14 0 0 1 434 124V196A44 14 0 0 1 346 196Z', 'pm-card') + path('M346 124A44 14 0 0 0 434 124', 'pm-link');
    const trend = path('M470 190L494 168L518 176L542 140L566 150L590 122L614 132', 'pm-arrow') + path('M470 200H618', 'pm-link') + path('M470 200V112', 'pm-link');
    return drum + trend + txt(390, 246, tr('historian', 'historian', 130), 22, 'middle', 'pm-big') + txt(544, 246, tr('trend', 'trend', 130), 22, 'middle', 'pm-mute')
      + txt(334, 304, tr('waarde en tijd', 'value and time', 284), 22, 'start', 'pm-mute');
  }

  // ---- s5: who looks after what; a patch every month in the office against the floor, where a restart stops the line;
  // the story's end
  function ownDrawing() {
    const card = (y, name, what) => rect(334, y, 284, 62, 'pm-card', 8) + txt(346, y + 26, name, 22, 'start', 'pm-big') + txt(346, y + 52, what, 22, 'start', 'pm-mute');
    return card(100, 'IT', tr('netwerk en servers', 'network and servers', 260)) + card(172, tr('Automatisering', 'Automation', 260), tr('de PLC en SCADA', 'the PLC and SCADA', 260)) + card(244, tr('Machinebouwer', 'Machine builder', 260), tr('levert de besturing', 'supplies the controls', 260));
  }
  function patchDrawing() {
    let s = txt(334, 112, tr('kantoor, elke maand', 'office, every month', 284), 22, 'start', 'pm-mute');
    for (let i = 0; i < 6; i++) s += rect(334 + i * 50, 124, 34, 34, 'pm-bar', 4);
    s += txt(334, 214, tr('vloer, de lijn draait', 'floor, the line runs', 284), 22, 'start', 'pm-mute') + rect(334, 228, 284, 34, 'pm-bar', 4) + rect(500, 228, 54, 34, 'pm-crit', 4);
    return s + txt(334, 302, tr('herstart stopt de lijn', 'a restart stops the line', 284), 22, 'start', 'pm-big');
  }
  function runDrawing() {
    return rect(334, 120, 284, 44, 'pm-card', 8) + txt(346, 150, tr('het MES telt mee', 'the MES counts along', 260), 22, 'start', 'pm-big') + arrow(476, 216, 476, 172)
      + rect(334, 222, 284, 44, 'pm-crit', 8) + txt(346, 252, tr('de eenheid vult', 'the unit fills', 260), 22, 'start', 'pm-on');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with IT/OT op de fabrieksvloer lit, the whole sheet and then zoomed to the lit place at 1.5; then the
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
    camera(si, u);
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
      title = b >= 3 ? tr('De route', 'The route') : tr('De order', 'The order');
      if (b <= 2) o.frameS = op(b === 0 ? span(p, 0.05, 0.4) : 1, b === 2 ? isaDrawing() : orderDrawing(b === 1));
      if (b >= 2) lab = tr('schema', 'diagram');
      if (b >= 3) {
        o.grpA = routeGroup(0, tr('Niveaus en systemen', 'Levels and systems', 284), b === 3 ? span(p, 0.05, 0.4) : 1);
        if (b === 4) o.grpB = routeGroup(2, tr('Praten en beheren', 'Talking and looking after', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Niveaus', 'Levels', 150), tr('Systemen', 'Systems', 150), tr('Protocollen', 'Protocols', 150), tr('Beheer', 'Ownership', 150)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) {
        lab = tr('schema', 'diagram');
        const a = b === 0 ? span(p, 0.1, 0.5) : 1;
        if (b <= 2) Object.assign(o, { lvLow: op(a, lowRows()), lvHigh: op(a, highRows()) });
        Object.assign(o, tools(b, p, 3, 'ISA-95', tr('Purdue-model', 'Purdue model', 260)));
        if (b === 3) lab = tr('voorbeeld', 'example');
      }
      if (si === 2) {
        if (b <= 1) lab = tr('schema', 'diagram');
        Object.assign(o, { sysS: b <= 3 ? op(b === 0 ? span(p, 0.1, 0.5) : 1, sysDrawing()) : '', downS: stay(b, 2, 3, p, downDrawing()), upS: fade(b, 3, p, upDrawing()), ...tools(b, p, 4, tr('Productieorder', 'Production order', 260), tr('Terugmelding', 'Confirmation', 260)) });
      }
      if (si === 3) {
        if (b >= 1 && b <= 2) lab = tr('schema', 'diagram');
        Object.assign(o, { talkS: stay(b, 0, 1, p, talkDrawing(), 0.1, 0.5), protoS: fade(b, 1, p, protoDrawing(), 0.1, 0.5), histS: fade(b, 2, p, histDrawing(), 0.1, 0.5), ...tools(b, p, 3, tr('OPC-server', 'OPC server', 260), tr('Tag', 'Tag', 260)) });
      }
      if (si === 4) {
        if (b <= 2) lab = tr('schema', 'diagram');
        Object.assign(o, { joinS: fade(b, 0, p, joinDrawing(), 0.1, 0.5), ownS: fade(b, 1, p, ownDrawing(), 0.1, 0.5), patchS: fade(b, 2, p, patchDrawing(), 0.1, 0.5), runS: fade(b, 4, p, runDrawing()), ...tools(b, p, 3, tr('Vrijgegeven patch', 'Qualified patch', 260), tr('Patchvenster', 'Patch window', 260)) });
      }
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
