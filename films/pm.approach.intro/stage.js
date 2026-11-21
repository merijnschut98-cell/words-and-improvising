// The stage of the module intro film "Jij begint bij de klant / You start at the client" (Aanpak en gereedschap): a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, as in the
// field film and the other Projects intros: the new floor with the dashed outline of
// line 3 (the line is still in the old hall), line 4 that stays, the power cabinet
// with its cable still to be connected, the dashed place of the switchboard and the
// calendar of the shutdown, a whiteboard on the back wall (the team's task board in
// s4) and a desk with a laptop (the client's planner in s5); "jij" stands in the room
// and the cast changes per topic (the sponsor, the team lead, the planner). The panel
// at the right draws each step as a schema, labelled "voorbeeld" (the line's move) or
// "schema" (the module's map). Every part a sentence lights is a static data-cue
// group (build.mjs); this script only fills the panel and shows or hides the room's
// moving parts. Nothing is drawn with a label before the narration names it.
// The closing scene (the shared Projects map, then the module's four topics with
// their levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third
// argument where it is narrower than the panel (the kit checks that they fit).
/* global CAM, W, H, LV, MAPZ, GRID, CW, wrapUnits, span, beatStarts */
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
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const arrow = (x0, y0, x1, y1) => {
    const up = y1 < y0 ? -1 : 1;
    const horiz = Math.abs(y1 - y0) < 1;
    const head = horiz ? `M${f1(x1 - 6)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * up)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * up)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['route', 'method', 'tools', 'enterprise'];
  const TITLE = ORDER.map((id) => TOP[D.topics.findIndex((t) => t.id === id)]);
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
  // the camera: CAM[si] = { from: [ox, oy, s], to: [ox, oy, s] }, the point (ox, oy) of the hall brought to the
  // middle of the hall's half of the stage (160, 200), at scale s
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- the cast of hall B: who stands there when. [scene, first beat]: present from that beat to the scene's end.
  // A person who stood there at the end of the scene before is there from the first frame (no blink at a cut).
  const FROM = { jij: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], sponsor: [[0, 0], [1, 0], [2, 0]], lead: [[3, 0]], planner: [[4, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      const carried = FROM[who].some(([sc]) => sc === si - 1);
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from && !carried ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
    // the team's tasks on the whiteboard: they come when the narration puts them on a task board and stay
    show(E.cardsG, si === 3 ? (b >= 3 ? span(p, 0, 0.5) : 0) : si > 3 ? 1 : 0);
  }

  // ---- the four topic tiles
  // the route (s1): four rows in two groups (how you work: route and approach; what you work with: tools and the
  // client's systems), each with its title and number. The rows are 284 units wide, so a long title wraps by the
  // film's own tile width, D.tileUnits, into at most three lines
  const routeY = (i) => 52 + i * 80 + (i >= 2 ? 12 : 0);
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = routeY(i);
      const lines = wrap(t, D.tileUnits).slice(0, 3);
      let s = rect(334, y, 284, 76, i < 2 ? 'pm-tile' : 'pm-card', 8) + txt(610, y + 30, String(i + 1), 22, 'end', 'pm-on');
      lines.forEach((l, j) => { s += txt(344, y + 46 + (j - (lines.length - 1) / 2) * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- the tool chip of a topic scene: one short sentence names it, it is not explained. Shown in the beat of the
  // sentence (b === at) and after it
  function tool(b, p, at, y, label) {
    return { tool1B: b >= at ? op(b === at ? span(p, 0, 0.4) : 1, rect(334, y, 284, 36, 'pm-badge', 6) + txt(346, y + 26, label, 22, 'start', 'pm-txt')) : '' };
  }

  // ---- s1: the request, where this module sits, the four topics in two groups
  function requestCard(a, stopOn) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Verzoek van de sponsor', 'The sponsor’s request', 272), 22, 'start', 'pm-mute');
    s += txt(346, 126, tr('Verhuis lijn 3', 'Move line 3', 272), 22, 'start', 'pm-big');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? (stopOn ? 'pm-crit' : 'pm-badge') : 'pm-tile', 3);
    s += cells + txt(618, 206, tr('zomerstop', 'summer shutdown'), 22, 'end', 'pm-mute');
    return op(a, s);
  }
  // the module between the request and the intake: three boxes and two arrows
  function pathBox(a) {
    let s = rect(334, 232, 284, 34, 'pm-tile', 6) + txt(342, 257, tr('Verzoek van de sponsor', 'The sponsor’s request', 270), 22, 'start', 'pm-txt');
    s += arrow(476, 268, 476, 282);
    s += rect(334, 284, 284, 34, 'pm-crit', 6) + txt(342, 309, tr('Aanpak en gereedschap', 'Approach and tools', 270), 22, 'start', 'pm-on');
    s += arrow(476, 320, 476, 334);
    s += rect(334, 336, 284, 34, 'pm-card', 6) + txt(346, 361, tr('Intake', 'Intake', 262), 22, 'start', 'pm-txt');
    return op(a, s);
  }

  // ---- s2: the route. Five stages, the stage product of each, the mandate, the status check of a running project.
  const SY = (i) => 94 + i * 36;
  function routeParts(b, p) {
    const names = [tr('Intake', 'Intake', 140), tr('Plannen', 'Plan', 140), tr('Uitvoeren', 'Run', 140), tr('Landen', 'Land', 140), tr('Afsluiten', 'Close', 140)];
    const prods = [tr('opdracht', 'assignment', 150), tr('plan', 'plan', 150), tr('ritme', 'rhythm', 150), tr('overdracht', 'handover', 150), tr('besluit', 'decision', 150)];
    const ask = rect(334, 98, 284, 50, 'pm-card', 8) + txt(346, 130, tr('Van begin tot eind?', 'From start to finish?', 262), 22, 'start', 'pm-big');
    let stages = '';
    let products = '';
    names.forEach((n, i) => {
      const a = b === 1 ? span(p, i * 0.12, i * 0.12 + 0.3) : b > 1 ? 1 : 0;
      stages += op(a, rect(334, SY(i), 284, 32, 'pm-tile', 6) + txt(346, SY(i) + 24, n, 22, 'start', 'pm-txt'));
      const pa = b === 2 ? span(p, i * 0.1, i * 0.1 + 0.3) : b > 2 ? 1 : 0;
      products += op(pa, txt(606, SY(i) + 24, prods[i], 22, 'end', 'pm-mute'));
    });
    const mandate = rect(334, 282, 284, 40, 'pm-crit', 8) + txt(346, 309, tr('Mandaat: de sponsor', 'Mandate: the sponsor', 262), 22, 'start', 'pm-on');
    return {
      askB: b === 0 ? op(span(p, 0.1, 0.5), ask) : '',
      stagesB: stages,
      productsB: products,
      mandateB: b >= 3 ? op(b === 3 ? span(p, 0, 0.4) : 1, mandate) : '',
      ...tool(b, p, 4, 336, tr('Statuscheck', 'Status check', 262)),
    };
  }

  // ---- s3: choosing an approach. The move as the question, the four families and a mix, the move is predictive,
  // an improvement project is built on DMAIC.
  const FY = (i) => 156 + i * 34;
  function methodParts(b, p) {
    const ask = rect(334, 94, 284, 56, 'pm-card', 8) + txt(346, 118, tr('Verhuis lijn 3', 'Move line 3', 262), 22, 'start', 'pm-big') + txt(346, 144, tr('welke aanpak?', 'which approach?', 262), 22, 'start', 'pm-mute');
    const names = [tr('Voorspellend', 'Predictive', 250), tr('Agile', 'Agile', 250), tr('Lean', 'Lean', 250), tr('DMAIC-verbeteren', 'DMAIC improvement', 250), tr('Mengvorm', 'Mix', 250)];
    let fams = '';
    names.forEach((n, i) => { fams += op(b === 1 ? span(p, i * 0.1, i * 0.1 + 0.3) : 1, rect(334, FY(i), 284, 30, 'pm-tile', 6) + txt(346, FY(i) + 23, n, 22, 'start', 'pm-txt')); });
    const hit = (i) => rect(334, FY(i), 284, 30, 'pm-crit', 6) + txt(346, FY(i) + 23, names[i], 22, 'start', 'pm-on');
    return {
      askB: ask,
      famsB: b >= 1 ? fams : '',
      predB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, hit(0)) : '',
      sigB: b >= 3 ? op(b === 3 ? span(p, 0, 0.4) : 1, hit(3)) : '',
      ...tool(b, p, 3, 336, tr('DMAIC', 'DMAIC', 262)),
    };
  }

  // ---- s4: choosing tools. The question, what a tool yields against what it costs, two tool families, and the
  // task board of the team on the whiteboard (the chip names it).
  function toolParts(b, p) {
    const ask = rect(334, 98, 284, 50, 'pm-card', 8) + txt(346, 130, tr('Welk gereedschap?', 'Which tool?', 262), 22, 'start', 'pm-big');
    const worth = txt(334, 120, tr('Levert op', 'Yields', 284), 22, 'start', 'pm-mute') + rect(334, 128, 250, 22, 'pm-crit', 4)
      + txt(334, 176, tr('Kost', 'Costs', 284), 22, 'start', 'pm-mute') + rect(334, 184, 96, 22, 'pm-bar', 4);
    const fam = (y, label) => rect(334, y, 284, 32, 'pm-tile', 6) + txt(346, y + 24, label, 22, 'start', 'pm-txt');
    const fams = op(b === 2 ? span(p, 0, 0.4) : 1, fam(224, tr('Spreadsheet', 'Spreadsheet', 262))) + op(b === 2 ? span(p, 0.25, 0.65) : 1, fam(264, tr('Planningstool', 'Scheduling tool', 262)));
    return {
      askB: b === 0 ? op(span(p, 0.1, 0.5), ask) : '',
      worthB: b >= 1 ? op(b === 1 ? span(p, 0.05, 0.55) : 1, worth) : '',
      tfamsB: b >= 2 ? fams : '',
      ...tool(b, p, 3, 336, tr('Takenbord', 'Task board', 262)),
    };
  }

  // ---- s5: tools at large organisations. Many systems, each with one task; a system of record; the project code
  // the planner gives you and the ERP you book hours in.
  const RY = (i) => 98 + i * 40;
  function sysParts(b, p) {
    // the first row also carries the tag "officieel" at the right (s5 beat 3), so its label has the room left of it
    const names = [tr('uren en geld', 'hours, money', 150), tr('projecten', 'projects', 262), tr('tekeningen', 'drawings', 262)];
    let sys = '';
    names.forEach((n, i) => {
      sys += op(b === 0 ? span(p, 0.1 + i * 0.15, 0.5 + i * 0.15) : 1, rect(334, RY(i), 284, 34, 'pm-tile', 6) + (b >= 1 ? op(b === 1 ? span(p, i * 0.15, i * 0.15 + 0.35) : 1, txt(346, RY(i) + 26, n, 22, 'start', 'pm-txt')) : ''));
    });
    const record = rect(334, RY(0), 284, 34, 'pm-crit', 6) + txt(346, RY(0) + 26, names[0], 22, 'start', 'pm-on') + txt(606, RY(0) + 26, tr('officieel', 'official', 120), 22, 'end', 'pm-on');
    const proj = rect(334, 232, 284, 34, 'pm-card', 6) + txt(346, 257, tr('Projectnummer', 'Project code', 262), 22, 'start', 'pm-txt') + arrow(476, 268, 476, 290);
    return {
      sysB: sys,
      recordB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, record) : '',
      projB: b >= 3 ? op(span(p, 0, 0.4), proj) : '',
      ...tool(b, p, 3, 292, tr('ERP', 'ERP', 262)),
    };
  }

  // ---- s6: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with Aanpak en gereedschap lit, then zoomed to it; then the module's four topics, each with its four
  // levels as columns (the words the app uses for the levels), the start marker on the first level of the first
  // topic. Aanpak en gereedschap lies at the left edge of the map: at 1.5 the view is clamped to the map's edge.
  const MAP0 = { s: 0.77, x: 73.6, y: 0 };
  const MAP1 = { s: 1.5, x: Math.max(640 - 640 * 1.5, Math.min(0, 320 - MAPZ[0] * 1.5)), y: Math.max(400 - 520 * 1.5, Math.min(0, 200 - MAPZ[1] * 1.5)) };
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
  const gridY = (i) => 70 + i * 82;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], l1: '', l2: '', l3: '', l4: '', st: '' };
    const lv = ['l1', 'l2', 'l3', 'l4'];
    LW.forEach((w, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, w, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, 78, 'pm-tile', 8);
      const gl = wrap(t, D.tileUnits).slice(0, 3);
      gl.forEach((l, j) => { s += txt(26, y + 46 + (j - (gl.length - 1) / 2) * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }

  const KEYS = ['reqB', 'pathB', 'stagesB', 'productsB', 'mandateB', 'askB', 'famsB', 'predB', 'sigB', 'worthB', 'tfamsB', 'sysB', 'recordB', 'projB', 'tool1B', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 5;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = b >= 2 ? tr('Onderwerpen', 'Topics') : tr('Verzoek', 'Request');
      o.reqB = b >= 2 ? '' : requestCard(b === 0 ? span(p, 0.05, 0.4) : 1, b === 0 && p > 0.5 || b > 0);
      if (b === 1) { o.pathB = pathBox(span(p, 0.1, 0.5)); lab = tr('schema', 'diagram'); }
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('De route', 'The route'), tr('Aanpak', 'Approach'), tr('Gereedschap', 'Tools'), tr('Systemen', 'Systems')][si - 1];
      o.r = strip(si - 1);
      lab = si === 1 ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    }
    if (si === 1) Object.assign(o, routeParts(b, p));
    if (si === 2) Object.assign(o, methodParts(b, p));
    if (si === 3) Object.assign(o, toolParts(b, p));
    if (si === 4) Object.assign(o, sysParts(b, p));
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
        o.r = m.r; o.l1 = m.l1; o.l2 = m.l2; o.l3 = m.l3; o.l4 = m.l4; o.st = b >= 2 ? m.st : '';
        title = '';
        lab = '';
      }
    }
    show(E.mapG, mapA);
    show(E.hud, hudA);
    if (E.pbg.__v !== pbg) { for (const kv of pbg.split(' ')) { const [k, v] = kv.split('='); E.pbg.setAttribute(k, v.replace(/"/g, '')); } E.pbg.__v = pbg; }
    const head = closing && b > 0 ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    ['r0', 'r1', 'r2', 'r3'].forEach((k2, i) => set(E[k2], o.r[i]));
    for (const k2 of KEYS) set(E[k2], o[k2]);
  }

  return { render };
})();
