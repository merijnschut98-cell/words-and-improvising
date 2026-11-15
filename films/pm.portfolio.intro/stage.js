// The stage of the module intro film "Vier projecten, twee engineers / Four projects, two engineers" for
// Programma’s en governance: a pure function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits (the kit's measured character
// widths and its wrap, so the drawing wraps as the kit's label check measures). The story is drawn in hall B at the
// left, the hall of field film 3 (films/pm.field.portfolio): line 3 stands on its floor (the project is done), the
// switchboard hangs, the cable is connected, and a cast that changes per topic (the two process engineers, the team
// lead, the sponsor who is the plant manager). The panel at the right draws each step as a schema, labelled
// "voorbeeld" (the plant's story) or "schema" (the module's map).
// Every part a sentence lights is a static data-cue group (build.mjs); this script only fills the panel and shows
// or hides the room's moving parts.
// The closing scene (the shared Projects map, then the module's four topics with their levels) is ONE function,
// closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third argument where it is narrower than
// the panel (the kit checks that they fit).
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
  const ORDER = ['programmes', 'priorities', 'governance', 'benefits'];
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
  // engineers: the two process engineers at the cabinet; teamlead: the team lead of the line; sponsor: the plant manager
  const FROM = {
    engineers: [[0, 1], [2, 0], [5, 0]],
    teamlead: [[0, 0], [1, 0], [3, 0], [4, 0], [5, 0]],
    sponsor: [[0, 2], [1, 0], [2, 2], [3, 0], [4, 1], [5, 0]],
  };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, first] of FROM[who]) if (sc === si && b >= first) a = b === first ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }

  // ---- the four topic tiles
  // the route (s1): four rows, each with its title and number. The rows are 284 units wide, so a long title
  // (Prioritising and capacity) wraps by the film's own tile width, D.tileUnits, into at most three lines
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = 58 + i * 82;
      const lines = wrap(t, D.tileUnits);
      let s = rect(334, y, 284, 80, 'pm-tile', 8) + txt(610, y + 30, String(i + 1), 22, 'end', 'pm-on');
      // the lines stand centred in the 80-unit tile: 24 units for the first baseline of three lines, 12 more for each line fewer
      lines.slice(0, 3).forEach((l, j) => { s += txt(344, y + 24 + (3 - Math.min(3, lines.length)) * 12 + j * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // a row of a schema: a tile with its label
  const row = (y, label, cls = 'pm-tile', tcls = 'pm-txt', h = 30) => rect(334, y, 284, h, cls, 6) + txt(346, y + h - 8, label, 22, 'start', tcls);
  // a card with a big line and a small one under it (two lines in a 56-unit card: baselines at 24 and 47 keep
  // the first line clear of the top edge and leave room under the descenders of the second line)
  const card2 = (y, big, small, cls = 'pm-card') => rect(334, y, 284, 56, cls, 8) + txt(346, y + 24, big, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 47, small, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a row that does not help: dashed, muted, with a cross
  const no = (y, label) => rect(334, y, 284, 36, 'pm-out', 8) + txt(346, y + 26, label, 22, 'start', 'pm-mute') + mark(592, y + 18, false);
  // a row that helps: filled, with a tick
  const yes = (y, label) => rect(334, y, 284, 38, 'pm-card', 8) + txt(346, y + 27, label, 22, 'start', 'pm-txt') + mark(592, y + 19, true);

  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). Shown in the beat of the sentence (b === at), high in the empty panel under the strip; a topic with
  // one tool leaves the second out
  function tools(b, p, at, one, two, y0 = 130) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    const y1 = y0 + 42;
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(y0, one)) : '', tool2B: b === at && two ? op(span(p, 0.25, 0.65), chip(y1, two)) : '' };
  }

  // ---- s1: the four projects of this year (line 3 is done, the other three are to come); then the two process
  // engineers they all need, the same money and what that means; then the module's four topics
  function goalCard(a) {
    return op(a, row(56, tr('Lijn 3 verhuisd', 'Line 3 moved', 262), 'pm-crit', 'pm-on', 34)
      + row(98, tr('Gereedheidscheck', 'Readiness check', 262), 'pm-card', 'pm-txt', 34)
      + row(140, tr('Planningstool', 'Planning tool', 262), 'pm-card', 'pm-txt', 34)
      + row(182, tr('Materiaalproces', 'Materials process', 262), 'pm-card', 'pm-txt', 34));
  }
  function needParts(b, p) {
    const need = card2(94, tr('Twee procesengineers', 'Two process engineers', 272), tr('dezelfde mensen', 'the same people', 260))
      + card2(160, tr('Hetzelfde geld', 'The same money'), tr('voor alle drie', 'for all three', 260))
      + card2(226, tr('Niet genoeg', 'Not enough'), tr('voor alles tegelijk', 'for everything at once', 260), 'pm-crit');
    return { needB: b === 1 ? op(span(p, 0.05, 0.4), need) : '' };
  }

  // ---- s2: programmes. Three projects reach one goal together, fewer cancelled jobs, none of them alone; line 3 is not
  // part of it (drop it and the goal holds: portfolio); each project reports green on its own plan while the goal does
  // not move, so you report the goal's number every month.
  function progParts(b, p) {
    const goal = row(90, tr('Gereedheidscheck', 'Readiness check', 262), 'pm-card', 'pm-txt', 34)
      + row(130, tr('Planningstool', 'Planning tool', 262), 'pm-card', 'pm-txt', 34)
      + row(170, tr('Materiaalproces', 'Materials process', 262), 'pm-card', 'pm-txt', 34)
      + arrow(476, 206, 476, 224)
      + card2(228, tr('Eén doel', 'One goal'), tr('minder afzeggingen', 'fewer cancellations', 260), 'pm-crit');
    const line3 = card2(94, tr('Programma', 'Programme'), tr('de drie projecten', 'the three projects', 260), 'pm-crit')
      + rect(334, 168, 284, 56, 'pm-out', 8) + txt(346, 192, tr('Lijn 3 verhuisd', 'Line 3 moved'), 22, 'start', 'pm-mute') + txt(346, 215, tr('hoort bij het portfolio', 'belongs in the portfolio', 260), 22, 'start', 'pm-mute');
    const green = card2(94, tr('Elk project: groen', 'Each project: green', 272), tr('op zijn eigen plan', 'on its own plan', 260))
      + card2(160, tr('Het doel', 'The goal'), tr('beweegt niet', 'does not move', 260))
      + card2(226, tr('Elke maand', 'Every month'), tr('meld het getal zelf', 'report the number itself', 260), 'pm-crit');
    return { pgoalB: b === 0 ? op(span(p, 0.1, 0.5), goal) : '', pline3B: b === 1 ? op(span(p, 0.05, 0.4), line3) : '', pgreenB: b === 2 ? op(span(p, 0, 0.4), green) : '',
      ...tools(b, p, 3, tr('Programmaraad', 'Programme board', 260)) };
  }

  // ---- s3: prioritising and capacity. The bottleneck is the two process engineers, not the money; count their days,
  // not the headcount; no bare no, but not now and what it would push out.
  function prioParts(b, p) {
    const bottle = card2(94, tr('Knelpunt', 'Bottleneck'), tr('de twee engineers', 'the two engineers', 260), 'pm-crit')
      + card2(160, tr('Niet het geld', 'Not the money'), tr('mensen zijn schaars', 'people are scarce', 260));
    const days = card2(94, tr('Hun dagen tellen', 'Count their days', 272), tr('geen aantal mensen', 'not the headcount', 260), 'pm-crit')
      + card2(160, tr('Meer dagen', 'More days'), tr('zijn er niet', 'do not exist', 260));
    const notnow = card2(94, tr('Geen kaal nee', 'No bare no'), tr('maar niet nu', 'but not now', 260))
      + card2(160, tr('Dit verdringt', 'This pushes out', 272), tr('het materiaalproces', 'the materials process', 260), 'pm-crit');
    return { bottleB: b === 0 ? op(span(p, 0.1, 0.5), bottle) : '', daysB: b === 1 ? op(span(p, 0.05, 0.4), days) : '', notnowB: b === 2 ? op(span(p, 0, 0.4), notnow) : '',
      ...tools(b, p, 3, tr('Capaciteitsstreep', 'Capacity line', 260)) };
  }

  // ---- s4: governance and steering. Who decides what is agreed in advance, for scope, budget, timeline and people;
  // the project lead inside the margins, the steering group beyond, the board on strategy; the steering group's
  // agenda lists decisions, not updates.
  function govParts(b, p) {
    const who = card2(94, tr('Wie beslist wat?', 'Who decides what?', 272), tr('vooraf vastgelegd', 'agreed in advance', 260), 'pm-crit')
      + row(164, tr('Scope en budget', 'Scope and budget', 262), 'pm-card', 'pm-txt', 34)
      + row(204, tr('Planning en mensen', 'Timeline and people', 262), 'pm-card', 'pm-txt', 34);
    const levels = row(92, tr('Directie', 'Board', 262), 'pm-card', 'pm-txt', 40) + arrow(476, 134, 476, 150)
      + row(152, tr('Stuurgroep', 'Steering group', 262), 'pm-card', 'pm-txt', 40) + arrow(476, 194, 476, 210)
      + row(212, tr('Projectleider', 'Project lead', 262), 'pm-crit', 'pm-on', 40);
    const agenda = yes(94, tr('Een besluit', 'A decision', 220))
      + no(146, tr('Een update', 'An update', 220));
    return { whoB: b === 0 ? op(span(p, 0.1, 0.5), who) : '', levelsB: b === 1 ? op(span(p, 0.05, 0.4), levels) : '', agendaB: b === 2 ? op(span(p, 0, 0.4), agenda) : '',
      ...tools(b, p, 3, tr('Beslisbevoegdheden', 'Decision rights', 260), tr('Besluitenlijst', 'Decision log', 260)) };
  }

  // ---- s5: benefits. The check going live is an output, the cancellations that drop are the outcome, the measurable
  // gain is the benefit; the managers who run the plant own it, not the project lead; without anyone watching the old
  // way creeps back, so the number is followed for months.
  function benParts(b, p) {
    const chain = card2(86, tr('Output', 'Output'), tr('de check gaat live', 'the check goes live', 260)) + arrow(476, 144, 476, 154)
      + card2(156, tr('Uitkomst', 'Outcome'), tr('minder afzeggingen', 'fewer cancellations', 260)) + arrow(476, 214, 476, 224)
      + card2(226, tr('Baten', 'Benefits'), tr('de meetbare winst', 'the measurable gain', 260), 'pm-crit');
    const owner = card2(94, tr('Eigenaar van de baten', 'Owner of the benefits', 272), tr('de fabrieksmanagers', 'the plant managers', 260), 'pm-crit')
      + card2(160, tr('Niet de projectleider', 'Not the project lead', 272), tr('want die vertrekt', 'who leaves', 260));
    const leak = card2(94, tr('Project sluit', 'Project closes'), tr('het team gaat verder', 'the team moves on', 260))
      + card2(160, tr('Oude manier', 'Old way'), tr('sluipt terug', 'creeps back', 260))
      + card2(226, tr('Getal blijven volgen', 'Keep following it', 272), tr('maanden na livegang', 'months after go-live', 260), 'pm-crit');
    return { chainB: b === 0 ? op(span(p, 0.1, 0.5), chain) : '', ownerB: b === 1 ? op(span(p, 0.05, 0.4), owner) : '', leakB: b === 2 ? op(span(p, 0, 0.4), leak) : '',
      ...tools(b, p, 3, tr('Nulmeting', 'Baseline', 260), tr('Batenhouder', 'Benefit owner', 260)) };
  }

  // ---- s6: one whole. The chain from programme to benefits, and the result for the materials process.
  function flowParts(b, p) {
    const rows = [tr('Programma', 'Programme', 270), tr('Capaciteit', 'Capacity', 270), tr('Besluiten', 'Decisions', 270), tr('Baten', 'Benefits', 270)];
    let flow = '';
    rows.forEach((n, i) => {
      const y = 56 + i * 54;
      flow += rect(334, y, 284, 36, i === 3 ? 'pm-crit' : 'pm-card', 6) + txt(346, y + 26, n, 22, 'start', i === 3 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, y - 17, 476, y);
    });
    const dec = card2(272, tr('Materiaalproces later', 'Materials process later', 272), tr('de streep valt eronder', 'the line falls under it', 260));
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
      const lines = wrap(t, D.tileUnits);
      let s = rect(20, y, GRID.tile, 80, 'pm-tile', 8);
      lines.slice(0, 3).forEach((l, j) => { s += txt(26, y + 24 + (3 - Math.min(3, lines.length)) * 12 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }


  const KEYS = ['goalB', 'needB', 'pgoalB', 'pline3B', 'pgreenB', 'bottleB', 'daysB', 'notnowB', 'whoB', 'levelsB', 'agendaB', 'chainB', 'ownerB', 'leakB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 6;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = tr('Dit jaar', 'This year');
      o.goalB = b >= 1 ? '' : goalCard(span(p, 0.05, 0.4));
      if (b === 1) Object.assign(o, needParts(b, p));
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Programma’s', 'Programmes'), tr('Prioriteren', 'Prioritising'), tr('Governance', 'Governance'), tr('Baten', 'Benefits')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, progParts(b, p));
    if (si === 2) Object.assign(o, prioParts(b, p));
    if (si === 3) Object.assign(o, govParts(b, p));
    if (si === 4) Object.assign(o, benParts(b, p));
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
    if (E.pbg.__v !== pbg) { for (const kv of pbg.split(' ')) { const [k2, v] = kv.split('='); E.pbg.setAttribute(k2, v.replace(/"/g, '')); } E.pbg.__v = pbg; }
    const head = closing && b > 0 ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    ['r0', 'r1', 'r2', 'r3'].forEach((k2, i) => set(E[k2], o.r[i]));
    for (const k2 of KEYS) set(E[k2], o[k2]);
  }

  return { render };
})();
