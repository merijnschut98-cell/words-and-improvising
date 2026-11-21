// The stage of the module intro film "Lijn 3 en haar cijfers / Line 3 and its numbers": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs that defines CAM, W, H, LV, MAPZ, MAPSZ, GRID,
// KEYS, CW and wrapUnits (the kit's measured character widths and its wrap, so the drawing wraps as the kit's label check
// measures). The story is drawn in hall B, at the left, as in the digital field film: the filling unit over the belt of
// line 3 with its cartons and you; the screen and the MES table appear at the sentence that sends the numbers there, the PLC
// cabinet with its edge box at the sentence that reads the numbers from it. The panel at the right draws each beat as a
// schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map). Data quality, the data platform and the models
// are panel schemas only. Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the
// panel and shows or hides the room's moving parts. The closing scene (the shared Engineering map, then the module's four
// topics with their levels) is ONE function, closing; the map itself is the kit's mapScene.
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
  const IDS = ['quality', 'dashboards', 'integration', 'ai'];
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

  // ---- the room: you come in at the route of the opening and again at the end of the last topic (where the numbers
  // become decisions). The screen and the MES table stand from the second beat of the opening (the sentence that sends the
  // numbers there), the PLC cabinet and the edge box from the third beat of the data quality scene (the sentence that reads
  // the numbers from the cabinet)
  function room(si, b) {
    show(E['o-scr'], (si === 0 && b >= 1) || (si >= 1 && si <= 4) ? 1 : 0);
    show(E['o-mes'], (si === 0 && b >= 1) || (si >= 1 && si <= 4) ? 1 : 0);
    show(E['o-plc'], (si === 1 && b >= 2) || (si >= 2 && si <= 4) ? 1 : 0);
    show(E['o-edge'], (si === 1 && b >= 2) || (si >= 2 && si <= 4) ? 1 : 0);
    show(E['pp-jij'], (si === 0 && b >= 2) || (si === 4 && b === 3) ? 1 : 0);
  }

  // ---- the route (s1, the last three beats): the module's four topics in two groups, the map before the detail. Each
  // row has its number and its index title, wrapped by the kit's widths into 240 units left of the number; a title of two
  // lines gets a taller row. The rows keep their place whichever groups show
  const ROUTE = (() => {
    const rows = [];
    let y = 52;
    [[0, 1], [2, 3]].forEach((grp) => {
      grp.forEach((i) => {
        const lines = wrap(TITLE[i], 240).slice(0, 2);
        const h = lines.length === 1 ? 34 : 56;
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
  function tools(b, p, at, one) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(342, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1: b === at ? op(span(p, 0, 0.4), chip(110, one)) : '' };
  }
  const fade = (b, i, p, body, a = 0.05, z = 0.4) => (b === i ? op(span(p, a, z), body) : '');
  // a card with a name and one muted line under it (a 62-unit card)
  const card2 = (y, a, b, c, d, cls = 'pm-card', room = 260) => rect(334, y, 284, 62, cls, 8) + txt(346, y + 26, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 50, tr(c, d, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a card with one line (a 44-unit card)
  const card1 = (y, a, b, cls = 'pm-card', room = 260) => rect(334, y, 284, 44, cls, 8) + txt(346, y + 31, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big');
  // a tile with one line (a 34-unit row)
  const tile = (y, a, b, cls = 'pm-tile', room = 260) => rect(334, y, 284, 34, cls, 6) + txt(346, y + 25, tr(a, b, room), 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');

  // ---- s1: line 3 makes numbers and the module turns them into decisions; the unit's numbers go to the MES and to a screen.
  function flowDrawing(last) {
    return card1(64, 'Lijn 3', 'Line 3') + arrow(476, 112, 476, 126) + card1(130, 'Cijfers', 'Numbers') + arrow(476, 178, 476, 192) + card1(196, 'Beslissingen', 'Decisions', last);
  }
  function goDrawing() {
    return card1(64, 'De eenheid', 'The unit') + arrow(402, 112, 402, 146) + arrow(550, 112, 550, 146)
      + rect(334, 150, 136, 44, 'pm-card', 8) + txt(402, 181, 'MES', 22, 'middle', 'pm-big') + rect(482, 150, 136, 44, 'pm-card', 8) + txt(550, 181, tr('Scherm', 'Screen', 120), 22, 'middle', 'pm-big');
  }

  // ---- s2: good data are fit for the use; on time and right; the PLC cabinet is read by the edge gateway (its chip above).
  function qualDrawing() {
    return card1(100, 'Data', 'Data') + arrow(476, 148, 476, 176) + card1(180, 'Gebruik', 'Use', 'pm-crit') + txt(334, 262, tr('geschikt voor het gebruik', 'fit for the use', 284), 22, 'start', 'pm-mute');
  }
  function timeDrawing() {
    return rect(334, 110, 134, 110, 'pm-card', 8) + dot(401, 152, 20) + path('M401 152V138M401 152L411 158', 'pm-arrow') + txt(401, 202, tr('Op tijd', 'On time', 120), 22, 'middle', 'pm-big')
      + rect(484, 110, 134, 110, 'pm-card', 8) + path('M528 152L544 168L574 134', 'pm-arrow') + txt(551, 202, tr('Klopt', 'Right', 120), 22, 'middle', 'pm-big');
  }
  function gateDrawing() {
    return card2(200, 'PLC-kast', 'PLC cabinet', 'de cijfers', 'the numbers') + arrow(476, 198, 476, 154);
  }

  // ---- s3: a KPI against its goal; the screen by the line seen at a glance (the dashboard is the chip above in its beat).
  function kpiDrawing() {
    return card1(100, 'KPI', 'KPI') + rect(346, 176, 240, 24, 'pm-bar', 5) + rect(346, 176, 180, 24, 'pm-crit', 5) + path('M540 160V216', 'pm-dash')
      + txt(540, 244, tr('doel', 'goal', 120), 22, 'middle', 'pm-mute');
  }
  function glanceDrawing(dy) {
    return `<g transform="translate(0 ${dy})">` + rect(334, 100, 284, 130, 'pm-card', 8) + [0, 1, 2, 3].map((i) => rect(362 + i * 56, 200 - [40, 62, 50, 82][i], 38, [40, 62, 50, 82][i], 'pm-bar', 4)).join('')
      + path('M350 150H602', 'pm-dash') + txt(334, 266, tr('in één oogopslag', 'at a glance', 284), 22, 'start', 'pm-mute') + '</g>';
  }

  // ---- s4: where each number is born (the PLC, the MES), the data platform that brings the sources together for reports,
  // the data warehouse (the chip above) where the numbers are stored.
  function srcDrawing() {
    return card1(100, 'Elk getal', 'Every number') + arrow(402, 148, 402, 176) + arrow(550, 148, 550, 176)
      + rect(334, 180, 136, 44, 'pm-card', 8) + txt(402, 211, 'PLC', 22, 'middle', 'pm-big') + rect(482, 180, 136, 44, 'pm-card', 8) + txt(550, 211, 'MES', 22, 'middle', 'pm-big');
  }
  function platDrawing(b) {
    if (b === 2) return card1(200, 'Dataplatform', 'Data platform') + arrow(476, 198, 476, 154);
    return rect(334, 100, 136, 44, 'pm-card', 8) + txt(402, 131, 'PLC', 22, 'middle', 'pm-big') + rect(482, 100, 136, 44, 'pm-card', 8) + txt(550, 131, 'MES', 22, 'middle', 'pm-big')
      + arrow(402, 148, 402, 176) + arrow(550, 148, 550, 176) + card1(180, 'Dataplatform', 'Data platform', 'pm-crit') + arrow(476, 228, 476, 256) + card1(260, 'Rapport', 'Report');
  }

  // ---- s5: a model learns a pattern from examples; it is only as good as its data and failures are rare; anomaly detection
  // learns what normal looks like and flags what deviates (the chip above); the story ends: the numbers become decisions.
  function mlDrawing() {
    return card1(100, 'Voorbeelden', 'Examples') + arrow(476, 148, 476, 176) + card1(180, 'Patroon', 'Pattern', 'pm-crit');
  }
  function dataDrawing() {
    let dots = '';
    for (let r = 0; r < 2; r++) for (let c = 0; c < 10; c++) dots += dot(346 + c * 26, 150 + r * 32, 8);
    dots += `<circle class="pm-crit" cx="346" cy="222" r="8"/><circle class="pm-crit" cx="372" cy="222" r="8"/>`;
    return txt(334, 118, tr('Voorbeelden', 'Examples', 284), 22, 'start', 'pm-mute') + dots + txt(394, 230, tr('Storingen', 'Failures', 220), 22, 'start', 'pm-big');
  }
  function anomDrawing() {
    return path('M346 280l24-14 24 14 24-14 24 14 24-14 24 14 12-64 12 64 24-14 24 14 24-14 24 14', 'pm-link') + `<circle class="pm-crit" cx="502" cy="216" r="8"/>` + txt(502, 196, tr('afwijking', 'deviation', 200), 22, 'middle', 'pm-big');
  }

  // ---- s6: the closing scene. ONE function. First the shared Engineering map (the kit's mapScene, the very drawing of
  // the app) with Data and digital manufacturing lit, the whole sheet and then zoomed to the lit place at 1.5; then the
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

  const HEAD = [[tr('Datakwaliteit', 'Data quality', 165)], [tr('Dashboards', 'Dashboards', 165)], [tr('Integratie', 'Integration', 165)], [tr('AI en modellen', 'AI and models', 165)]];

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
      title = b >= 2 ? tr('De route', 'The route') : tr('Lijn 3', 'Line 3');
      if (b === 0) o.flowS = op(span(p, 0.05, 0.4), flowDrawing('pm-out'));
      if (b === 1) o.goS = op(span(p, 0.05, 0.4), goDrawing());
      if (b >= 2) {
        lab = tr('schema', 'diagram');
        o.grpA = routeGroup(0, 2, b === 2 ? span(p, 0.05, 0.4) : 1);
        if (b >= 3) o.grpB = routeGroup(2, 2, b === 3 ? span(p, 0.05, 0.4) : 1);
      }
    } else if (si >= 1 && si <= 4) {
      title = HEAD[si - 1][0];
      o.r = strip(si - 1);
      if (si === 1) Object.assign(o, { qualS: fade(b, 0, p, qualDrawing(), 0.1, 0.5), timeS: fade(b, 1, p, timeDrawing(), 0.1, 0.5), gateS: b === 2 ? op(span(p, 0.3, 0.7), gateDrawing()) : '', ...tools(b, p, 2, tr('Edge gateway', 'Edge gateway', 260)) });
      if (si === 2) Object.assign(o, { kpiS: fade(b, 0, p, kpiDrawing(), 0.1, 0.5), glanceS: b === 1 ? op(span(p, 0.05, 0.4), glanceDrawing(0)) : b === 2 ? op(span(p, 0.3, 0.7), glanceDrawing(70)) : '', ...tools(b, p, 2, tr('Dashboard', 'Dashboard', 260)) });
      if (si === 3) Object.assign(o, { srcS: fade(b, 0, p, srcDrawing(), 0.1, 0.5), platS: b === 1 ? op(span(p, 0.05, 0.4), platDrawing(1)) : b === 2 ? op(span(p, 0.3, 0.7), platDrawing(2)) : '', ...tools(b, p, 2, tr('Datawarehouse', 'Data warehouse', 260)) });
      if (si === 4) Object.assign(o, { mlS: fade(b, 0, p, mlDrawing(), 0.1, 0.5), dataS: fade(b, 1, p, dataDrawing(), 0.1, 0.5), anomS: b === 2 ? op(span(p, 0.3, 0.7), anomDrawing()) : '', nextS: fade(b, 3, p, `<g transform="translate(0 56)">${flowDrawing('pm-crit')}</g>`, 0.1, 0.5), ...tools(b, p, 2, tr('Anomaliedetectie', 'Anomaly detection', 260)) });
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
