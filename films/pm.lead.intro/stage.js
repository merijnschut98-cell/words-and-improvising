// The stage of the module intro film "Lijn 3 verhuist: de mensen erbij / Line 3 moves: bringing the people along": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, the hall
// of the people field film (films/pm.field.people): the new place of line 3 as a
// dashed outline, line 4 that stays, the power cabinet and the switchboard's place,
// and a cast that changes per topic (the buyer, the sponsor, the team lead of the line, two
// crew members). The panel at the right draws each step as a schema, labelled
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
  const ORDER = ['influence', 'feedback', 'coaching', 'teams'];
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
  // crew: the two members of the crew; lead: the team lead of the line; buyer: the buyer; sponsor: the sponsor
  const FROM = { sponsor: [[1, 1]], buyer: [[0, 1], [1, 0], [3, 0], [5, 0]], lead: [[0, 1], [2, 0], [4, 0], [5, 0]], crew: [[0, 1], [2, 0], [4, 0], [5, 0]] };
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
  // the route (s1): four rows, each with its title and number. The rows are 284 units wide, so a long title
  // (Feedback and difficult conversations) wraps by the film's own tile width, D.tileUnits, into at most three lines
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

  // ---- s1: the goal, with the shutdown weeks of the calendar; then the two people who do not report to you
  function goalCard(a) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Lijn 3 naar hal B', 'Line 3 to hall B', 272), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('het plan klopt', 'the plan is right', 272), 22, 'start', 'pm-txt');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? 'pm-badge' : 'pm-tile', 3);
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
  // a row that does not help: dashed, muted, with a cross
  const no = (y, label) => rect(334, y, 284, 36, 'pm-out', 8) + txt(346, y + 26, label, 22, 'start', 'pm-mute') + mark(592, y + 18, false);
  // a row that helps: filled, with a tick
  const yes = (y, label) => rect(334, y, 284, 38, 'pm-card', 8) + txt(346, y + 27, label, 22, 'start', 'pm-txt') + mark(592, y + 19, true);

  function needParts(b, p) {
    const need = card2(94, tr('De inkoper', 'The buyer'), tr('bestelt de schakelkast', 'orders the switchboard', 260))
      + card2(160, tr('De teamleider', 'The team lead'), tr('maakt zijn ploeg vrij', 'frees his crew', 260))
      + rect(334, 226, 284, 38, 'pm-out', 8) + txt(346, 253, tr('rapporteren niet aan jou', 'do not report to you', 260), 22, 'start', 'pm-mute');
    return { needB: b === 1 ? op(span(p, 0.05, 0.4), need) : '' };
  }

  // ---- s2: influence without authority. You cannot order the buyer; the sponsor lends a little position power and it
  // wears thin; your own expert and referent power grow with your work.
  function influenceParts(b, p) {
    const order = no(94, tr('Opdragen', 'Ordering', 220)) + rect(334, 140, 284, 38, 'pm-crit', 8) + txt(346, 167, tr('Invloed opbouwen', 'Build influence', 260), 22, 'start', 'pm-on');
    const borrow = card2(94, tr('Positiemacht', 'Position power'), tr('geleend van de sponsor', 'lent by the sponsor', 260))
      + rect(334, 170, 284, 30, 'pm-out', 8) + rect(334, 170, Math.max(40, 284 * (1 - 0.72 * p)), 30, 'pm-bar', 8)
      + txt(346, 232, tr('slijt bij elk gebruik', 'wears thin with use', 260), 22, 'start', 'pm-mute');
    const own = card2(94, tr('Deskundigheid', 'Expertise'), tr('je cijfers kloppen', 'numbers are right', 220)) + mark(592, 122, true)
      + card2(160, tr('Referentie', 'Reference'), tr('je houdt je woord', 'you keep your word', 220)) + mark(592, 188, true)
      + txt(346, 246, tr('groeit met je werk', 'grows with your work', 260), 22, 'start', 'pm-mute');
    return { orderB: b === 0 ? op(span(p, 0.1, 0.5), order) : '', borrowB: b === 1 ? op(span(p, 0.05, 0.4), borrow) : '', ownB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, own) : '',
      ...tools(b, p, 3, tr('Stakeholderkaart', 'Stakeholder map', 260), null) };
  }

  // ---- s3: feedback. The team lead walked away twice; say what a camera saw, not a label; soon, in private, with a
  // question; his reason (line 4 had stopped).
  function feedbackParts(b, p) {
    const walk = card2(94, tr('Teamleider', 'Team lead'), tr('liep twee keer weg', 'walked away twice', 260))
      + card2(160, tr('Tijdens de start', 'During the start'), tr('van de dienst', 'of the shift', 260))
      + rect(334, 226, 284, 38, 'pm-out', 8) + txt(346, 253, tr('dinsdag, woensdag', 'Tuesday, Wednesday', 260), 22, 'start', 'pm-mute');
    const label = no(94, tr('Onbetrouwbaar', 'Unreliable', 220))
      + rect(334, 140, 284, 38, 'pm-crit', 8) + txt(346, 167, tr('Liep twee keer weg', 'Walked away twice', 260), 22, 'start', 'pm-on')
      + rect(334, 186, 284, 38, 'pm-card', 8) + txt(346, 213, tr('Ploeg zonder plan', 'Crew without a plan', 260), 22, 'start', 'pm-txt');
    const talk = card2(94, tr('Snel, onder vier ogen', 'Soon, in private', 260), tr('met een vraag', 'with a question', 260))
      + rect(334, 160, 284, 38, 'pm-crit', 8) + txt(346, 187, tr('Wat speelde er?', 'What was going on?', 260), 22, 'start', 'pm-on')
      + card2(208, tr('Lijn 4 stond stil', 'Line 4 had stopped', 260), tr('hij moest erheen', 'he had to go there', 260));
    return { walkB: b === 0 ? op(span(p, 0.1, 0.5), walk) : '', labelB: b === 1 ? op(span(p, 0, 0.4), label) : '', talkB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, talk) : '',
      ...tools(b, p, 3, tr('SBI', 'SBI', 260), tr('Feedforward', 'Feedforward', 260)) };
  }

  // ---- s4: listening. The buyer says it is too expensive; under pressure you defend or fix, listen first; a worry underneath.
  function listenParts(b, p) {
    const price = card2(94, tr('Te duur', 'Too expensive'), tr('zegt de inkoper', 'says the buyer', 260));
    const react = no(166, tr('Verdedigen', 'Defend', 220)) + no(208, tr('Meteen oplossen', 'Fix it at once', 220)) + rect(334, 250, 284, 38, 'pm-crit', 8) + txt(346, 277, tr('Eerst luisteren', 'Listen first', 260), 22, 'start', 'pm-on');
    const worry = card2(166, tr('Wat houdt je bezig?', 'What is on your mind?', 260), tr('dan luisteren', 'then listen', 260))
      + card2(232, tr('Zijn budget', 'His budget'), tr('is al gekort', 'has been cut', 260), 'pm-crit');
    return { priceB: b === 0 ? op(span(p, 0.1, 0.5), price) : price, reactB: b === 1 ? op(span(p, 0, 0.4), react) : '', worryB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, worry) : '',
      ...tools(b, p, 3, tr('Actief luisteren', 'Active listening', 260), tr('MORE PIES', 'MORE PIES', 260)) };
  }

  // ---- s5: leading teams and yourself. Monday, the youngest in the room; a first impression forms fast; act on evidence.
  function teamParts(b, p) {
    const meet = card2(94, tr('Maandag', 'Monday'), tr('ploeg en teamleider', 'crew and team lead', 260))
      + card2(160, tr('Jij', 'You'), tr('de jongste in de kamer', 'youngest in the room', 260));
    const first = yes(94, tr('Ken je cijfers', 'Know your numbers', 220)) + yes(140, tr('Zit aan tafel', 'Sit at the table', 220)) + yes(186, tr('Geen voorbehoud', 'No hedge', 220))
      + no(232, tr('Sorry, maar', 'Sorry, but', 220));
    const proof = card2(94, tr('Een bedrieger?', 'A fraud?'), tr('komt vaak voor', 'it is common', 260))
      + card2(160, tr('Handel op bewijs', 'Act on evidence'), tr('niet op gevoel', 'not on feeling', 260), 'pm-crit')
      + card2(226, tr('Wat heb je voorbereid?', 'What did you prepare?', 270), tr('en wat weet jij extra?', 'and what do you know?', 260));
    return { meetB: b === 0 ? op(span(p, 0.1, 0.5), meet) : '', firstB: b === 1 ? op(span(p, 0, 0.4), first) : '', proofB: b >= 2 ? op(b === 2 ? span(p, 0, 0.4) : 1, proof) : '',
      ...tools(b, p, 3, tr('Assertieve uitspraak', 'Assertive statement', 260), tr('Herkaderen', 'Reframing', 260)) };
  }

  // ---- s6: one whole. The chain from your own influence to the decision, and the result.
  function flowParts(b, p) {
    const rows = [tr('Eigen invloed', 'Your own influence', 270), tr('Feedback op gedrag', 'Feedback on behaviour', 270), tr('Luisteren', 'Listening', 270), tr('Duidelijk zeggen', 'Say it clearly', 270)];
    let flow = '';
    rows.forEach((n, i) => {
      const y = 56 + i * 54;
      flow += rect(334, y, 284, 36, i === 3 ? 'pm-crit' : 'pm-card', 6) + txt(346, y + 26, n, 22, 'start', i === 3 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, y - 17, 476, y);
    });
    const dec = card2(272, tr('Kast besteld, ploeg vrij', 'Ordered, crew free', 270), tr('lijn 3 op zijn plek', 'line 3 in place', 260));
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

  const KEYS = ['goalB', 'needB', 'orderB', 'borrowB', 'ownB', 'walkB', 'labelB', 'talkB', 'priceB', 'reactB', 'worryB', 'meetB', 'firstB', 'proofB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
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
      o.goalB = b >= 1 ? '' : goalCard(span(p, 0.05, 0.4));
      if (b === 1) Object.assign(o, needParts(b, p));
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Invloed', 'Influence'), tr('Feedback', 'Feedback'), tr('Luisteren', 'Listening'), tr('Jezelf', 'Yourself')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, influenceParts(b, p));
    if (si === 2) Object.assign(o, feedbackParts(b, p));
    if (si === 3) Object.assign(o, listenParts(b, p));
    if (si === 4) Object.assign(o, teamParts(b, p));
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
