// The stage of the module intro film "Lijn 3 staat stil / Line 3 stands still": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, the hall
// of the people field film (films/pm.field.people): the new place of line 3 as a
// dashed outline, line 4 that stays, the power cabinet and the switchboard's place,
// and a cast that changes per topic (the sponsor, the team lead of the line, two
// operators). The panel at the right draws each step as a schema, labelled
// "voorbeeld" (line 3's story) or "schema" (the module's map). Every part a
// sentence lights is a static data-cue group (build.mjs); this script only fills
// the panel and shows or hides the room's moving parts.
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
  // a round mark: a tick on green, a cross on red (shapes, not symbols), centred on (x, y)
  const mark = (x, y, ok) => `<circle class="${ok ? 'pm-rag-g' : 'pm-rag-r'}" cx="${f1(x)}" cy="${f1(y)}" r="13"/>`
    + `<path class="pm-tick" d="${ok ? `M${f1(x - 6)} ${f1(y)}L${f1(x - 2)} ${f1(y + 5)}L${f1(x + 6)} ${f1(y - 5)}` : `M${f1(x - 5)} ${f1(y - 5)}L${f1(x + 5)} ${f1(y + 5)}M${f1(x + 5)} ${f1(y - 5)}L${f1(x - 5)} ${f1(y + 5)}`}"/>`;
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['diagnose', 'unknown', 'politics', 'restart'];
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
  // crew: the two members of the crew, who wait; lead: the team lead of the line; sponsor: the sponsor
  const FROM = { sponsor: [[0, 1], [2, 0], [4, 0], [5, 0]], lead: [[0, 0], [1, 0], [3, 0], [4, 2], [5, 0]], crew: [[0, 0], [1, 0], [3, 0], [5, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, first] of FROM[who]) if (sc === si && b >= first) a = b === first ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things that change: the power is connected from the start (the plan is right); line 3 stands in its outline
  // and the switchboard hangs on the wall once the project moves again (before that it is a dashed outline)
  function things(si, b, p) {
    const done = si === 5 ? (b === 0 ? 0 : span(p, 0.2, 0.7)) : 0;
    show(E.line3S, done);
    show(E.swS, done);
    show(E.swG, 1 - done);
    show(E.cabOn, 1);
    show(E.cabOff, 0);
  }

  // ---- the four topic tiles
  // the route (s1): a 2 by 2 grid of tiles, each with its number and title
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const x = 334 + (i % 2) * 144;
      const y = 112 + Math.floor(i / 2) * 90;
      // a 140-unit tile with 5 units of padding each side holds 130 units of text, up to three lines (the kit's TILE_UNITS)
      const lines = wrap(t, D.tileUnits);
      let s = rect(x, y, 140, 84, 'pm-tile', 8) + txt(x + 132, y + 74, String(i + 1), 22, 'end', 'pm-on');
      lines.slice(0, 3).forEach((l, j) => { s += txt(x + 5, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- s1: the goal, with the shutdown weeks of the calendar: line 3 stands still
  function goalCard(a, stopOn) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Lijn 3 naar hal B', 'Line 3 to hall B', 272), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('de lijn staat stil', 'the line stands still', 272), 22, 'start', 'pm-txt');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? (stopOn ? 'pm-crit' : 'pm-badge') : 'pm-tile', 3);
    s += cells + txt(618, 206, tr('zomerstop', 'summer shutdown'), 22, 'end', 'pm-mute');
    return op(a, s);
  }

  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). a: the scene's two labels; shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(296, one)) : '', tool2B: b === at && two ? op(span(p, 0.25, 0.65), chip(338, two)) : '' };
  }
  // a card with a big line and a small one under it (two lines in a 56-unit card: baselines at 24 and 47 keep
  // the first line clear of the top edge and leave room under the descenders of the second line)
  const card2 = (y, big, small, cls = 'pm-card') => rect(334, y, 284, 56, cls, 8) + txt(346, y + 24, big, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 47, small, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');

  // ---- s2: diagnosing. The four kinds of stuck, then the four questions: goal and way are clear, someone's support is
  // missing, so it is a people problem (the first no is where you start).
  function diagParts(b, p) {
    const kinds = [tr('Onduidelijk doel', 'Unclear goal', 240), tr('Onduidelijke weg', 'Unclear way', 240), tr('Mensenprobleem', 'People problem', 240), tr('Capaciteitsprobleem', 'Capacity problem', 240)];
    let rows = '';
    kinds.forEach((k2, i) => {
      const a = b === 1 ? span(p, i * 0.18, i * 0.18 + 0.3) : b > 1 ? 1 : 0;
      const y = 94 + i * 46;
      const hot = b >= 2 && i === 2;
      rows += op(a, rect(334, y, 284, 38, hot ? 'pm-crit' : 'pm-card', 8) + txt(346, y + 27, k2, 22, 'start', hot ? 'pm-on' : 'pm-txt'));
    });
    let marks = '';
    [true, true, false].forEach((ok, i) => { marks += op(b === 2 ? span(p, 0.2 + i * 0.22, 0.5 + i * 0.22) : b > 2 ? 1 : 0, mark(592, 94 + i * 46 + 19, ok)); });
    return { kindsB: rows, askB: marks, ...tools(b, p, 4, tr('Triangulatie', 'Triangulation', 260), tr('Besluitenlijst', 'Decision log', 260)) };
  }

  // ---- s3: when you don't know. The sponsor's question and the honest answer with a moment; then what you know, what you
  // think and what you do not know yet.
  function unknownParts(b, p) {
    const qa = card2(94, tr('Wanneer draait lijn 3?', 'When does line 3 run?', 260), tr('vraagt de sponsor', 'the sponsor asks', 260))
      + rect(334, 158, 284, 38, 'pm-card', 8) + txt(346, 185, tr('Ik weet het nog niet', 'I do not know yet', 260), 22, 'start', 'pm-txt')
      + rect(334, 204, 284, 38, 'pm-crit', 8) + txt(346, 231, tr('Antwoord donderdag', 'Answer on Thursday', 260), 22, 'start', 'pm-on');
    const know = card2(94, tr('We weten', 'We know', 260), tr('lijn 3 staat stil', 'line 3 stands still', 260))
      + card2(154, tr('We denken', 'We think', 260), tr('de ploeg is niet vrij', 'the crew is not free', 260))
      + card2(214, tr('We weten nog niet', 'We do not know yet', 260), tr('wanneer ze weer draait', 'when it runs again', 260));
    return { qaB: b === 1 ? op(span(p, 0.1, 0.45), qa) : '', knowB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, know) : '',
      ...tools(b, p, 3, tr('Tussenbericht', 'Holding statement', 260), tr('Bandbreedte', 'Range', 260)) };
  }

  // ---- s4: resistance and politics. "Good idea, but not right now"; pushing and working around make it worse, so first
  // understand why; a one-to-one conversation, and only then escalate (and tell him first).
  function politicsParts(b, p) {
    const quote = card2(94, tr('Goed idee,', 'Good idea,', 260), tr('maar nu even niet', 'but not right now', 260));
    const no = (y, label) => rect(334, y, 284, 36, 'pm-out', 8) + txt(346, y + 26, label, 22, 'start', 'pm-mute') + mark(592, y + 18, false);
    const reflex = no(166, tr('Duwen', 'Push', 220)) + no(208, tr('Er omheen werken', 'Work around', 220)) + rect(334, 250, 284, 38, 'pm-crit', 8) + txt(346, 277, tr('Begrijp eerst waarom', 'First understand why', 260), 22, 'start', 'pm-on');
    const talk = card2(166, tr('Onder vier ogen', 'One to one', 260), tr('wat maakt het lastig?', 'what makes it hard?', 260))
      + card2(232, tr('Lukt het niet?', 'Does it fail?', 260), tr('zeg het hem eerst', 'tell him first', 260), 'pm-crit');
    return { quoteB: b === 0 ? op(span(p, 0.1, 0.5), quote) : quote, reflexB: b === 1 ? op(span(p, 0, 0.4), reflex) : '', talkB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, talk) : '',
      ...tools(b, p, 3, tr('Niveaus van weerstand', 'Levels of resistance', 260)) };
  }

  // ---- s5: restarting with the sponsor. What a sponsor does (decide, make room, give air cover), then a concrete ask with
  // a name and a date.
  function restartParts(b, p) {
    let tasks = '';
    [tr('Beslissen', 'Decide', 260), tr('Ruimte maken', 'Make room', 260), tr('Rugdekking', 'Air cover', 260)].forEach((t, i) => {
      const a = b === 1 ? span(p, i * 0.2, i * 0.2 + 0.3) : 0;
      tasks += op(a, rect(334, 94 + i * 46, 284, 38, 'pm-card', 8) + txt(346, 94 + i * 46 + 27, t, 22, 'start', 'pm-txt'));
    });
    const ask = rect(334, 94, 284, 106, 'pm-card', 8) + txt(346, 124, tr('Naam: de teamleider', 'Name: the team lead', 260), 22, 'start', 'pm-big')
      + txt(346, 152, tr('Wat: de ploeg vrij', 'What: crew free', 250), 22, 'start', 'pm-txt') + txt(346, 180, tr('Datum: maandag', 'Date: Monday', 260), 22, 'start', 'pm-txt');
    return { tasksB: b === 1 ? tasks : '', concB: b >= 2 ? op(b === 2 ? span(p, 0, 0.45) : 1, ask) : '',
      ...tools(b, p, 3, tr('Sponsorgesprek', 'Sponsor check-in', 260)) };
  }

  // ---- s6: one whole. The chain from the facts to the sponsor, and the decision that gets line 3 moving.
  function flowParts(b, p) {
    const rows = [tr('Feiten', 'Facts', 270), tr('Eerlijk blijven', 'Stay honest', 270), tr('Het gesprek', 'The conversation', 270), tr('Sponsor beslist', 'Sponsor decides', 270)];
    let flow = '';
    rows.forEach((n, i) => {
      const y = 56 + i * 54;
      flow += rect(334, y, 284, 36, i === 3 ? 'pm-crit' : 'pm-card', 6) + txt(346, y + 26, n, 22, 'start', i === 3 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, y - 17, 476, y);
    });
    const dec = card2(272, tr('Ploeg weer vrij', 'Crew free again', 260), tr('op de besluitenlijst', 'on the decision log', 260));
    return { flowB: op(b === 0 ? span(p, 0, 0.5) : 1, flow), decisionB: op(b >= 1 ? span(p, 0, 0.5) : 0, dec) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with this module lit, then zoomed to it; then the module's four topics, each with its four levels as
  // columns (the words the app uses for the levels), the start marker on the first level of the first topic.
  const MAP0 = { s: 0.77, x: 73.6, y: 0 };
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
  const gridY = (i) => 70 + i * 82;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], l1: '', l2: '', l3: '', l4: '', st: '' };
    const lv = ['l1', 'l2', 'l3', 'l4'];
    LW.forEach((w, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, w, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, 78, 'pm-tile', 8);
      wrap(t, GRID.tile - 12).slice(0, 3).forEach((l, j) => { s += txt(26, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }

  const KEYS = ['goalB', 'kindsB', 'askB', 'qaB', 'knowB', 'quoteB', 'reflexB', 'talkB', 'tasksB', 'concB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    things(si, b, p);
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
      o.goalB = b >= 2 ? '' : goalCard(b === 0 ? span(p, 0.05, 0.4) : 1, b === 0 && p > 0.5 || b > 0);
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Diagnose', 'Diagnosis'), tr('Niet weten', 'Not knowing'), tr('Weerstand', 'Resistance'), tr('Herstart', 'Restart')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) { Object.assign(o, diagParts(b, p)); lab = tr('schema', 'diagram'); }
    if (si === 2) Object.assign(o, unknownParts(b, p));
    if (si === 3) Object.assign(o, politicsParts(b, p));
    if (si === 4) Object.assign(o, restartParts(b, p));
    if (si === 5) {
      title = tr('Eén geheel', 'One whole');
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
