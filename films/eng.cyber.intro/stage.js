// The stage of the module intro film "Een aanval op kantoor / An attack on the office": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the digital field film: the filling unit over the belt of
// line 3, the MES laptop on the table, you; the network cabinet, the control cabinet, the cable with its gate and the
// line's own zone appear in the OT scene, at the sentence that gives each its reason. The panel at the right draws each
// beat as a schema, labelled "voorbeeld" (the attack's way) or "schema" (the module's map). Every part a sentence lights
// is a static data-cue group (build.mjs); this script only fills the panel and shows or hides the room's moving parts.
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
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    const head = dy === 0 ? `M${f1(x1 - 6 * dx)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6 * dx)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * dy)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * dy)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a cross over a link: this way is closed
  const cross = (x, y) => `<path class="pm-cross" d="M${f1(x - 9)} ${f1(y - 9)}l18 18M${f1(x + 9)} ${f1(y - 9)}l-18 18"/>`;
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const IDS = ['basics', 'ot', 'rules', 'response'];
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

  // ---- the room: you come in at the route of the opening and again at the end of the last topic (the story picks up
  // there); before that you would stand in front of the unit a beat lights. The network cabinet, the control cabinet and
  // the cable stand from the second beat of the OT scene on, the zone and its gate with them (the sentence that names the
  // link gives each its reason). The MES table stands where the MES is named (s5, the fourth beat): it would hide the gate
  function room(si, b) {
    const net = si > 2 || (si === 2 && b >= 1) ? 1 : 0;
    show(E['o-net'], net);
    show(E['o-zone'], net);
    show(E['o-gate'], net);
    show(E['o-mes'], si === 4 && b >= 3 ? 1 : 0);
    show(E['pp-jij'], (si === 0 && b >= 2) || (si === 4 && b === 4) ? 1 : 0);
  }

  // ---- the route (s1, the last two beats): the module's four topics in two groups, the map before the detail. The
  // two that are about the attack and the line's defence (the basics, OT security) and the two about the law and the
  // answer (NIS2, incident response), each row with its number and its index title, wrapped by the kit's widths into 240
  // units left of the number; a title of two lines gets a taller row
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
  function tools(b, p, at, one, two, more = '') {
    const chip = (y, label, extra) => rect(334, y, 284, extra ? 56 : 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt') + (extra ? txt(342, y + 47, extra, 22, 'start', 'pm-txt') : '');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one, more)) : '', tool2: b === at && two ? op(span(p, 0.25, 0.65), chip(152, two, '')) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a card with a name and one muted line under it (a 62-unit card)
  const card2 = (y, a, b, c, d, cls = 'pm-card', room = 260) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a card with one line (a 44-unit card)
  const card1 = (y, a, b, cls = 'pm-card', room = 260) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
  // a tile with one line (a 34-unit row)
  const tile = (y, a, b, cls = 'pm-tile', room = 260, x = 334, wd = 284) => rect(x, y, wd, 34, cls, 6) + txt(x + 12, y + 25, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');

  // ---- s1: an attack on the office must not stop line 3, and what the module is for. Panel under the heading.
  function flowDrawing(y = 64) {
    return card1(y, 'Kantoor', 'Office') + path(`M476 ${y + 48}V${y + 112}`, 'pm-link') + cross(476, y + 70) + txt(496, y + 76, tr('aanval', 'attack', 110), 22, 'start', 'pm-mute')
      + card1(y + 116, 'Lijn 3', 'Line 3', 'pm-crit') + txt(334, y + 198, tr('blijft draaien', 'keeps running', 284), 22, 'start', 'pm-mute');
  }
  function defDrawing() {
    return rect(334, 64, 284, 150, 'pm-card', 8) + txt(346, 98, tr('Cybersecurity', 'Cybersecurity', 260), 22, 'start', 'pm-big')
      + txt(346, 136, tr('wat een fabriek moet', 'what a plant must', 260), 22, 'start', 'pm-mute') + txt(346, 164, tr('regelen en hoe je', 'arrange and how', 260), 22, 'start', 'pm-mute')
      + txt(346, 192, tr('erover praat', 'to talk about it', 260), 22, 'start', 'pm-mute');
  }

  // ---- s2: office and plant weigh differently (b 0 and 1: the card of the beat is filled), a fake mail leads to a click.
  function ciaDrawing(b) {
    return card2(100, 'Kantoor', 'Office', 'vertrouwelijkheid', 'confidentiality', b === 0 ? 'pm-crit' : 'pm-card') + card2(176, 'Fabriek', 'Plant', 'beschikbaarheid', 'availability', b === 1 ? 'pm-crit' : 'pm-card')
      + txt(334, 276, tr('en veiligheid', 'and safety', 284), 22, 'start', 'pm-mute');
  }
  function phishDrawing() {
    return card1(100, 'Nepmail', 'Fake mail') + arrow(476, 148, 476, 176) + card1(180, 'Een klik', 'A click') + arrow(476, 228, 476, 256) + card1(260, 'Binnen', 'Inside', 'pm-crit');
  }

  // ---- s3: the standard, the line's own floor with one guarded link.
  function normDrawing() {
    return rect(334, 100, 284, 180, 'pm-card', 8) + txt(346, 134, 'IEC 62443', 22, 'start', 'pm-big')
      + tile(148, 'Fabriek', 'Plant', 'pm-tile', 236, 346, 260) + tile(190, 'Integrator', 'Integrator', 'pm-tile', 236, 346, 260) + tile(232, 'Leverancier', 'Supplier', 'pm-tile', 236, 346, 260);
  }
  // the network cabinet at the top (it carries the office network), the one guarded link, the dashed zone of line 3 with the
  // control cabinet and the unit in it; in the next beat the infection is stopped at the guard
  function zoneDrawing(attack) {
    return card2(100, 'Netwerkkast', 'Network cabinet', 'kantoornetwerk', 'office network', 'pm-card', 260)
      + path('M476 162V192', 'pm-link') + (attack ? cross(476, 180) + txt(496, 186, tr('infectie', 'infection', 110), 22, 'start', 'pm-mute') : '')
      + rect(462, 192, 28, 22, 'pm-crit', 4) + path('M476 214V232', 'pm-link')
      + rect(334, 232, 284, 136, 'pm-out', 10) + txt(346, 260, tr('Lijn 3', 'Line 3', 260), 22, 'start', 'pm-big')
      + rect(346, 270, 260, 34, 'pm-card', 6) + txt(358, 295, tr('Besturingskast', 'Control cabinet', 240), 22, 'start', 'pm-txt')
      + rect(346, 312, 260, 34, 'pm-card', 6) + txt(358, 337, tr('Vuleenheid', 'Filling unit', 240), 22, 'start', 'pm-txt');
  }

  // ---- s4: the law, its obligations and the board, an attack that stops the line, sector and size.
  function lawDrawing() {
    return card1(100, 'NIS2', 'NIS2') + arrow(476, 148, 476, 176) + card2(180, 'De wet', 'The law', 'Cyberbeveiligingswet', 'Cybersecurity Act', 'pm-crit');
  }
  function dutyDrawing() {
    return tile(100, 'Zorgplicht', 'Duty of care') + tile(144, 'Meldplicht', 'Reporting') + tile(188, 'Registratieplicht', 'Registration');
  }
  function stopDrawing() {
    return card1(100, 'Lijn 3 staat stil', 'Line 3 is down') + arrow(476, 148, 476, 176) + card1(180, 'Melding?', 'Report?', 'pm-crit') + txt(334, 260, tr('als het ernstig is', 'if it is serious', 284), 22, 'start', 'pm-mute');
  }
  function scopeDrawing() {
    return card2(100, 'Sector', 'Sector', 'welke bedrijfstak', 'which industry') + card2(176, 'Omvang', 'Size', 'hoe groot', 'how big');
  }

  // ---- s5: incident response and its five phases; in containment the link to the office is closed.
  function incDrawing() {
    return card2(100, 'Incidentrespons', 'Incident response', 'een vaste aanpak', 'a fixed approach', 'pm-crit');
  }
  function cycDrawing(hot) {
    const rows = [['Voorbereiding', 'Preparation'], ['Detectie', 'Detection'], ['Indamming', 'Containment'], ['Herstel', 'Recovery'], ['Evaluatie', 'Lessons learned']];
    return rows.map((r, i) => rect(334, 100 + i * 42, 284, 34, i === hot ? 'pm-crit' : 'pm-tile', 6) + txt(346, 125 + i * 42, tr(r[0], r[1], 230), 22, 'start', i === hot ? 'pm-on' : 'pm-txt') + txt(610, 125 + i * 42, String(i + 1), 22, 'end', i === hot ? 'pm-on' : 'pm-mute')).join('');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Cybersecurity lit, the whole sheet and then zoomed to the lit place at 1.5; then the module's four
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
      title = b >= 2 ? tr('De route', 'The route') : tr('De aanval', 'The attack');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing());
      if (b === 1) o.defS = op(span(p, 0.05, 0.4), defDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, tr('Binnen en verdedigen', 'In and defence', 284), b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b === 3) o.grpB = routeGroup(2, tr('Wet en antwoord', 'Law and answer', 284), span(p, 0.05, 0.4));
      }
    } else if (si >= 1 && si <= 4) {
      title = [tr('De basis', 'Basics', 165), tr('OT-beveiliging', 'OT security', 165), tr('NIS2', 'NIS2', 165), tr('Respons', 'Response', 165)][si - 1];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { ciaS: b <= 1 ? op(span(p, 0.05, 0.4), ciaDrawing(b)) : '', phishS: fade(b, 2, p, phishDrawing(), 0.1, 0.5), ...tools(b, p, 3, tr('Meldknop', 'Report button', 260)) });
      if (si === 2) Object.assign(o, { normS: fade(b, 0, p, normDrawing(), 0.1, 0.5), zoneS: b === 1 || b === 2 ? op(span(p, 0.05, 0.4), zoneDrawing(b === 2)) : '', ...tools(b, p, 3, tr('Zone', 'Zone', 260), tr('Conduit', 'Conduit', 260)) });
      if (si === 3) Object.assign(o, { lawS: fade(b, 0, p, lawDrawing(), 0.1, 0.5), dutyS: fade(b, 1, p, dutyDrawing(), 0.1, 0.5), stopS: fade(b, 2, p, stopDrawing(), 0.1, 0.5), scopeS: fade(b, 3, p, scopeDrawing(), 0.1, 0.5), ...tools(b, p, 4, tr('Bijlage I', 'Annex I', 260), tr('Bijlage II', 'Annex II', 260)) });
      if (si === 4) Object.assign(o, { incS: fade(b, 0, p, incDrawing(), 0.1, 0.5), cycS: b === 1 || b === 2 ? op(span(p, 0.05, 0.4), cycDrawing(b === 2 ? 2 : -1)) : '', flowS: b === 4 ? op(span(p, 0.05, 0.4), flowDrawing(100)) : '', ...tools(b, p, 3, tr('Noodprocedure', 'Manual fallback', 260), '', NL ? '' : 'procedure') });
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
