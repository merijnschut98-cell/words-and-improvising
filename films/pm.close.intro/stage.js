// The stage of the module intro film "Lijn 3 is af / Line 3 is done" (Afsluiten): a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left: line 3
// stands on its floor, the switchboard hangs on the wall, line 4 stays, and a cast
// that changes per topic (the sponsor, the team lead, the operators, the buyer).
// The panel at the right draws each step as a schema, labelled "voorbeeld"
// (the line's close) or "schema" (the module's map). Every part a sentence lights
// is a static data-cue group (build.mjs); this script only fills the panel and
// shows or hides the room's moving parts.
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
  const dia = (x, y, s = 9, cls = 'pm-dia') => `<path class="${cls}" d="M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z"/>`;
  const arrow = (x0, y0, x1, y1) => {
    const up = y1 < y0 ? -1 : 1;
    const horiz = Math.abs(y1 - y0) < 1;
    const head = horiz ? `M${f1(x1 - 6)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * up)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * up)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  const tick = (x, y) => `<path class="pm-arrow" d="M${f1(x)} ${f1(y)}l5 6l10-13"/>`;
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['proof', 'closure', 'learn', 'client'];
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

  // ---- the cast of hall B: who stands there when. [scene, first beat]: present from that beat to the scene's end
  const FROM = { buyer: [[3, 3], [5, 0]], sponsor: [[0, 1], [1, 1], [2, 0], [4, 1], [5, 0]], lead: [[2, 2], [3, 0], [4, 2], [5, 0]], crew: [[1, 1], [3, 0], [5, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things: the shutdown is over, line 3 stands in its outline and the switchboard hangs on the wall
  function things() {
    show(E.line3S, 1);
    show(E.swS, 1);
    show(E.swG, 0);
    show(E.cabOn, 1);
    show(E.cabOff, 0);
  }

  // ---- the four topic tiles
  // the route (s1): four rows, each with its title and number. The rows are 284 units wide, so a long title
  // (Retrospective and lessons learned) wraps by the film's own tile width, D.tileUnits, into at most three lines
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = 58 + i * 82;
      const lines = wrap(t, D.tileUnits);
      let s = rect(334, y, 284, 78, 'pm-tile', 8) + txt(610, y + 30, String(i + 1), 22, 'end', 'pm-on');
      lines.slice(0, 3).forEach((l, j) => { s += txt(344, y + 20 + j * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- s1: the goal of the intake, and the sponsor's question: is it met?
  function goalCard(a, past) {
    let s = rect(334, 56, 284, 100, 'pm-card', 8);
    s += txt(346, 82, tr('Doel', 'Goal', 260), 22, 'start', 'pm-mute');
    s += txt(346, 110, tr('Lijn 3 draait in hal B', 'Line 3 runs in hall B', 262), 22, 'start', 'pm-big');
    s += txt(346, 140, tr('even snel als vroeger', 'as fast as before', 262), 22, 'start', 'pm-txt');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 172, 22, 26, i >= 9 ? (past ? 'pm-badge' : 'pm-crit') : 'pm-tile', 3);
    s += cells + txt(618, 218, tr('zomerstop voorbij', 'shutdown over'), 22, 'end', 'pm-mute');
    return op(a, s);
  }
  function askCard(a) {
    return op(a, rect(334, 240, 284, 70, 'pm-crit', 8) + txt(346, 268, tr('Doel gehaald?', 'Goal met?', 260), 22, 'start', 'pm-on') + txt(346, 296, tr('vraagt de sponsor', 'asks the sponsor', 260), 22, 'start', 'pm-on'));
  }

  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). Shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(302, one)) : '', tool2B: b === at ? op(span(p, 0.25, 0.65), chip(342, two)) : '' };
  }

  // ---- s2: proving results. The speed before the move and now, measured the same way; every week varies a little.
  function proofParts(b, p) {
    const grow = b === 1 ? span(p, 0.15, 0.7) : 1;
    const base = txt(334, 120, tr('Voor de verhuizing', 'Before the move', 284), 22, 'start', 'pm-mute') + rect(334, 130, 230, 18, 'pm-bar', 3)
      + txt(334, 176, tr('Nu, zelfde meting', 'Now, same measure', 284), 22, 'start', 'pm-mute') + rect(334, 186, 236 * grow, 18, 'pm-crit', 3);
    // the weekly values: eight points that swing a little around the line
    const ys = [262, 274, 266, 256, 272, 262, 270, 258];
    let noise = txt(334, 236, tr('Elke week schommelt het', 'Every week it varies', 284), 22, 'start', 'pm-txt')
      + `<path class="pm-out" d="M334 264H618"/>`;
    ys.forEach((y, i) => { noise += dia(346 + i * 36, y, 6); });
    return { baseB: op(b === 0 ? 0 : (b === 1 ? span(p, 0, 0.3) : 1), base), noiseB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.45) : 1) : 0, noise),
      ...tools(b, p, 3, tr('Nulmeting', 'Baseline', 260), tr('Run chart', 'Run chart', 260)) };
  }

  // ---- s3: handover and closure. The criteria checked and the sign-off, an open point with an owner in the line,
  // the close-out; the tools as chips.
  function closureParts(b, p) {
    const row = (i, label, cls) => rect(334, 94 + i * 34, 284, 30, cls, 6) + txt(344, 116 + i * 34, label, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt') + tick(594, 108 + i * 34);
    const criteria = row(0, tr('Snelheid gehaald', 'Speed reached', 244), 'pm-card') + row(1, tr('Operators getraind', 'Operators trained', 244), 'pm-card') + row(2, tr('Overdracht klaar', 'Handover done', 244), 'pm-card');
    const sign = row(3, tr('Sponsor getekend', 'Sponsor signed', 244), 'pm-crit');
    const open = rect(334, 234, 284, 56, 'pm-card', 8) + txt(346, 260, tr('Lijn 4 komt later', 'Line 4 comes later', 260), 22, 'start', 'pm-big')
      + txt(346, 284, tr('eigenaar: teamleider', 'owner: team lead', 260), 22, 'start', 'pm-mute');
    const closeout = row(0, tr('Urencode dicht', 'Time code closed', 244), 'pm-card') + row(1, tr('Eindfactuur verstuurd', 'Final invoice sent', 244), 'pm-card') + row(2, tr('Toegang ingetrokken', 'Access revoked', 244), 'pm-card');
    const early = b <= 2;
    return {
      criteriaB: op(b === 0 ? 0 : (early ? (b === 1 ? span(p, 0, 0.4) : 1) : 0), criteria),
      signB: op(b === 0 ? 0 : (early ? (b === 1 ? span(p, 0.35, 0.8) : 1) : 0), sign),
      openB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.45) : 1) : 0, open),
      closeB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.45) : 1) : 0, closeout),
      ...tools(b, p, 4, tr('Acceptatiecriteria', 'Acceptance criteria', 260), tr('Afsluitchecklist', 'Close-out checklist', 260)),
    };
  }

  // ---- s4: retrospective and lessons. A look back, safe to say what happened, a lesson that becomes an action.
  function learnParts(b, p) {
    const retro = rect(334, 94, 284, 62, 'pm-card', 8) + txt(346, 120, tr('Terugblik', 'Retrospective', 260), 22, 'start', 'pm-big')
      + txt(346, 146, tr('herhalen of veranderen', 'repeat or change', 260), 22, 'start', 'pm-mute');
    const safe = rect(334, 164, 284, 34, 'pm-badge', 6) + txt(346, 188, tr('Veilig praten', 'Safe to speak', 260), 22, 'start', 'pm-txt');
    const action = rect(334, 206, 284, 86, 'pm-crit', 8) + txt(346, 229, tr('Actie: vaste leverdatum', 'Action: fixed date', 262), 22, 'start', 'pm-on')
      + txt(346, 254, tr('eigenaar: de inkoper', 'owner: the buyer', 260), 22, 'start', 'pm-on') + txt(346, 279, tr('bij de volgende start', 'at the next start', 260), 22, 'start', 'pm-on');
    return {
      retroB: op(b >= 1 ? (b === 1 ? span(p, 0, 0.4) : 1) : 0, retro),
      safeB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, safe),
      actionB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.45) : 1) : 0, action),
      ...tools(b, p, 4, tr('Tijdlijn', 'Timeline', 260), tr('Lessenrapport', 'Lessons report', 260)),
    };
  }

  // ---- s5: client relationship and follow-up. The closing report on one page with the answer first, and leaving
  // so that the team lead measures alone.
  function clientParts(b, p) {
    const report = rect(334, 94, 284, 100, 'pm-card', 8) + txt(346, 120, tr('Eén A4', 'One page', 260), 22, 'start', 'pm-mute')
      + txt(346, 150, tr('Lijn 3 is even snel', 'Line 3 is as fast', 262), 22, 'start', 'pm-big') + txt(346, 180, tr('daaronder het bewijs', 'the evidence below', 262), 22, 'start', 'pm-txt');
    const leave = rect(334, 208, 112, 40, 'pm-out', 8) + txt(390, 236, tr('Adviseur', 'Adviser', 100), 22, 'middle', 'pm-mute')
      + arrow(452, 228, 478, 228) + rect(484, 208, 134, 40, 'pm-crit', 8) + txt(551, 236, tr('Teamleider', 'Team lead', 124), 22, 'middle', 'pm-on')
      + txt(334, 274, tr('meet zelf verder', 'keeps measuring', 284), 22, 'start', 'pm-txt');
    return {
      reportB: op(b >= 1 ? (b === 1 ? span(p, 0, 0.4) : 1) : 0, report),
      leaveB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.45) : 1) : 0, leave),
      ...tools(b, p, 3, tr('Klantevaluatie', 'Client evaluation', 260), tr('Follow-up', 'Follow-up', 260)),
    };
  }

  // ---- s6: one close. The chain from the proof to the client who carries on, and the project that is closed.
  function flowParts(b, p) {
    const rows = [tr('Resultaat bewezen', 'Result proven', 270), tr('Sponsor tekent', 'Sponsor signs', 270), tr('Les wordt actie', 'Lesson becomes action', 270), tr('Klant kan zelf door', 'Client carries on', 270)];
    let flow = '';
    rows.forEach((n, i) => {
      flow += rect(334, 58 + i * 52, 284, 38, i === 3 ? 'pm-crit' : 'pm-card', 6) + txt(346, 85 + i * 52, n, 22, 'start', i === 3 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, 58 + i * 52 - 14, 476, 58 + i * 52);
    });
    const end = rect(334, 276, 284, 62, 'pm-card', 8) + txt(346, 302, tr('Project afgesloten', 'Project closed', 260), 22, 'start', 'pm-big')
      + txt(346, 328, tr('lijn 3 draait zelf', 'line 3 runs on its own', 262), 22, 'start', 'pm-mute');
    return { flowB: op(b === 0 ? span(p, 0, 0.5) : 1, flow), endB: op(b >= 1 ? span(p, 0, 0.5) : 0, end) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with Close lit, then zoomed to it; then the module's four topics, each with its four levels as
  // columns (the words the app uses for the levels), the start marker on the first level of the first topic.
  // Close lies at the right edge of the map: at 1.5 the view is clamped to the map's edge (640 units at 1.5
  // is 960, so x never goes below 640 - 960).
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
      wrap(t, D.tileUnits).slice(0, 3).forEach((l, j) => { s += txt(26, y + 20 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }


  const KEYS = ['goalB', 'askB', 'baseB', 'noiseB', 'criteriaB', 'signB', 'openB', 'closeB', 'retroB', 'safeB', 'actionB', 'reportB', 'leaveB', 'tool1B', 'tool2B', 'flowB', 'endB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    things();
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 6;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = tr('Lijn 3', 'Line 3');
      o.goalB = goalCard(b === 0 ? span(p, 0.05, 0.4) : b >= 2 ? 0 : 1, b > 0);
      o.askB = b === 1 ? askCard(span(p, 0.1, 0.5)) : '';
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Bewijs', 'Proof'), tr('Overdracht', 'Handover'), tr('Lessen', 'Lessons'), tr('Klant', 'Client')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, proofParts(b, p));
    if (si === 2) Object.assign(o, closureParts(b, p));
    if (si === 3) Object.assign(o, learnParts(b, p));
    if (si === 4) Object.assign(o, clientParts(b, p));
    if (si === 5) {
      title = tr('Eén afsluiting', 'One close');
      lab = tr('schema', 'diagram');
      Object.assign(o, flowParts(b, p));
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
