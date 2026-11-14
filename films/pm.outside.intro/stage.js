// The stage of the module intro film "Lijn 3 en de experts / Line 3 and the experts": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, the hall
// of the people field film (films/pm.field.people): the new place of line 3 as a
// dashed outline, line 4 that stays, the power cabinet with its cable (dashed until the
// installer has connected it) and the switchboard's place, and a cast that changes per
// topic (the installer, the PLC programmer, the sponsor). The panel at the right draws each step
// as a schema, labelled "voorbeeld" (line 3's story) or "schema" (the module's map).
// Every part a sentence lights is a static data-cue group (build.mjs); this script only
// fills the panel and shows or hides the room's moving parts.
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
  const ORDER = ['mindset', 'questions', 'experts', 'steer'];
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
  // installer: the installer from outside (hard hat) at the cabinet; plc: the PLC programmer (a laptop); sponsor: the sponsor
  const FROM = { installer: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]], plc: [[0, 1], [3, 3], [5, 0]], sponsor: [[1, 2], [4, 2], [5, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, first] of FROM[who]) if (sc === si && b >= first) a = b === first ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things that change: the cable is a dashed line until the installer has connected it, and line 3 stands in its
  // outline and the switchboard hangs on the wall once the date is made (before that it is a dashed outline)
  function things(si, b, p) {
    const done = si === 5 ? (b === 0 ? 0 : span(p, 0.2, 0.7)) : 0;
    show(E.line3S, done);
    show(E.swS, done);
    show(E.swG, 1 - done);
    show(E.cabOn, done);
    show(E.cabOff, 1 - done);
  }

  // ---- the four topic tiles
  // the route (s1): four rows, each with its title and number. The rows are 284 units wide, so a long title
  // (Preparing: interests and alternatives) wraps by the film's own tile width, D.tileUnits, into at most three lines
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

  // ---- s1: the goal, with the shutdown weeks of the calendar; then the two experts you cannot judge and you
  function goalCard(a) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Lijn 3 naar hal B', 'Line 3 to hall B', 272), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('stroom, kast en PLC', 'power, cabinet, PLC', 272), 22, 'start', 'pm-txt');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? 'pm-badge' : 'pm-tile', 3);
    s += cells + txt(618, 206, tr('zomerstop', 'summer shutdown'), 22, 'end', 'pm-mute');
    return op(a, s);
  }

  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). a: the scene's two labels; shown in the beat of the sentence (b === at)
  // a label too long for one line is given as two (an array of two): the chip is then 56 units high
  function tools(b, p, at, one, two, y0 = 296) {
    const chip = (y, label) => { const ls = [].concat(label); return rect(334, y, 284, ls.length > 1 ? 56 : 34, 'pm-badge', 6) + ls.map((l, i) => txt(346, y + 25 + i * 23, l, 22, 'start', 'pm-txt')).join(''); };
    const y1 = y0 + 42;
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(y0, one)) : '', tool2B: b === at && two ? op(span(p, 0.25, 0.65), chip(y1, two)) : '' };
  }
  // a card with a big line and a small one under it (two lines in a 56-unit card: baselines at 24 and 47 keep
  // the first line clear of the top edge and leave room under the descenders of the second line)
  const card2 = (y, big, small, cls = 'pm-card') => rect(334, y, 284, 56, cls, 8) + txt(346, y + 24, big, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 47, small, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a row that does not help: dashed, muted, with a cross
  const no = (y, label) => rect(334, y, 284, 36, 'pm-out', 8) + txt(346, y + 26, label, 22, 'start', 'pm-mute') + mark(592, y + 18, false);
  // a row that helps: filled, with a tick
  const yes = (y, label) => rect(334, y, 284, 38, 'pm-card', 8) + txt(346, y + 27, label, 22, 'start', 'pm-txt') + mark(592, y + 19, true);

  function needParts(b, p) {
    const need = card2(94, tr('Installateur', 'Installer'), tr('de aansluiting', 'the connection', 260))
      + card2(160, tr('PLC-programmeur', 'PLC programmer'), tr('de besturing', 'the controls', 260))
      + card2(226, tr('Jij', 'You'), tr('leidt het project', 'lead the project', 260), 'pm-crit');
    return { needB: b === 1 ? op(span(p, 0.05, 0.4), need) : '' };
  }

  // ---- s2: mindset. The installer is the subject matter expert and owns how the connection works; you are the director
  // and own the route, the experts own the engine, a technical question goes to the right person by a date; what the
  // project delivers is yours with the sponsor, how it is built is theirs.
  function mindParts(b, p) {
    const owner = card2(94, tr('Installateur', 'Installer'), tr('de vakexpert', 'the subject expert', 260))
      + card2(160, tr('Hoe het werkt', 'How it works'), tr('is van hem', 'is his', 260));
    const director = card2(94, tr('Jij: regisseur', 'You: director'), tr('eigenaar van de route', 'owner of the route', 260), 'pm-crit')
      + card2(160, tr('Experts', 'Experts'), tr('eigenaar van de motor', 'owner of the engine', 260))
      + card2(226, tr('Technische vraag', 'Technical question'), tr('wie en wanneer', 'who and when', 260));
    const split = card2(94, tr('Wat het oplevert', 'What it delivers'), tr('jij en de sponsor', 'you and the sponsor', 260), 'pm-crit')
      + card2(160, tr('Hoe het gebouwd wordt', 'How it is built', 272), tr('de installateur', 'the installer', 260));
    return { ownerB: b === 0 ? op(span(p, 0.1, 0.5), owner) : '', directorB: b === 1 ? op(span(p, 0.05, 0.4), director) : '', splitB: b === 2 ? op(span(p, 0, 0.4), split) : '',
      ...tools(b, p, 3, tr('Naïeve vraag', 'Naive question', 260)) };
  }

  // ---- s3: asking questions. You cannot judge the answers, so your questions are your expertise; ask what is explicitly not
  // in the connection (that is where the misunderstandings live); the installer assumes the cabinet is big enough, and an
  // assumption is a risk until it is checked.
  function questParts(b, p) {
    const blind = no(94, tr('Zelf beoordelen', 'Judging it yourself', 220))
      + card2(146, tr('Goede vragen', 'Good questions'), tr('dat is je vakkennis', 'that is your expertise', 260), 'pm-crit');
    const notin = card2(94, tr('Wat zit er niet in?', 'What is not in?', 272), tr('de aansluiting', 'the connection', 260))
      + card2(160, tr('Daar zitten', 'That is where'), tr('de misverstanden', 'misunderstandings', 260), 'pm-crit');
    const assume = card2(94, tr('Aanname', 'Assumption'), tr('kast is groot genoeg', 'cabinet is big enough', 260))
      + card2(160, tr('Risico', 'Risk'), tr('tot het gecheckt is', 'until it is checked', 260), 'pm-crit');
    return { blindB: b === 0 ? op(span(p, 0.1, 0.5), blind) : '', notinB: b === 1 ? op(span(p, 0.05, 0.4), notin) : '', assumeB: b === 2 ? op(span(p, 0, 0.4), assume) : '',
      ...tools(b, p, 3, tr('Vragenset', 'Question set', 260), tr('Premortem', 'Premortem', 260)) };
  }

  // ---- s4: working with experts. The installer says the cabinet is big enough; you trust his skill and check the result (who
  // checked the calculation, where is it signed); a second qualified person checks important work and you see that he exists;
  // the PLC programmer finds the cabinet too small, two experts, two opinions.
  function expParts(b, p) {
    const claim = card2(94, tr('Installateur', 'Installer'), tr('kast is groot genoeg', 'cabinet is big enough', 260));
    const verify = card2(94, tr('Vertrouwen', 'Trust'), tr('zijn vakmanschap', 'his skill', 260))
      + card2(160, tr('Controleren', 'Check'), tr('het resultaat', 'the result', 260), 'pm-crit')
      + card2(226, tr('Wie controleerde het?', 'Who checked it?', 272), tr('waar is het getekend?', 'where is it signed?', 272));
    const eyes = card2(94, tr('Tweede paar ogen', 'Second pair of eyes'), tr('bij belangrijk werk', 'for important work', 260))
      + card2(160, tr('Jij regelt dat', 'You arrange it'), tr('je bent het niet zelf', 'you are not it', 260), 'pm-crit');
    const clash = card2(94, tr('Installateur', 'Installer'), tr('kast is groot genoeg', 'cabinet is big enough', 260))
      + card2(160, tr('PLC-programmeur', 'PLC programmer'), tr('kast is te klein', 'cabinet is too small', 260), 'pm-crit')
      + rect(334, 226, 284, 38, 'pm-out', 8) + txt(346, 253, tr('niet te beoordelen', 'you cannot judge it', 260), 22, 'start', 'pm-mute');
    return { claimB: b === 0 ? op(span(p, 0.1, 0.5), claim) : '', verifyB: b === 1 ? op(span(p, 0.05, 0.4), verify) : '', eyesB: b === 2 ? op(span(p, 0, 0.4), eyes) : '', clashB: b === 3 ? op(span(p, 0, 0.4), clash) : '',
      ...tools(b, p, 4, tr('Steekproef', 'Spot check', 260), tr('Second opinion', 'Second opinion', 260)) };
  }

  // ---- s5: steering and deciding. The installer says ninety percent; a percentage is an opinion; milestones are yes or no;
  // a milestone counts with evidence you can see, and the sponsor decides on facts.
  function steerParts(b, p) {
    const pct = card2(94, tr('Installateur', 'Installer'), tr('negentig procent klaar', 'ninety percent done', 260))
      + no(160, tr('Alleen een mening', 'Only an opinion', 220));
    const mile = txt(334, 112, tr('Mijlpalen: ja of nee', 'Milestones: yes or no', 280), 22, 'start', 'pm-mute')
      + yes(126, tr('Kabel getest', 'Cable tested', 220)) + no(176, tr('Onder spanning', 'Energised', 220));
    const proof = card2(94, tr('Telt met bewijs', 'Counts with evidence'), tr('dat je kunt zien', 'you can see', 260), 'pm-crit')
      + card2(160, tr('Getekend testrapport', 'Signed test report'), tr('of een demo', 'or a demo', 260));
    return { pctB: b === 0 ? op(span(p, 0.1, 0.5), pct) : '', mileB: b === 1 ? op(span(p, 0.05, 0.4), mile) : '', proofB: b === 2 ? op(span(p, 0, 0.4), proof) : '',
      ...tools(b, p, 3, tr('Fabrieksacceptatietest', 'Factory acceptance test', 272)) };
  }

  // ---- s6: one whole. The chain from mindset to steering, and the result.
  function flowParts(b, p) {
    const rows = [tr('Regisseren', 'Directing', 270), tr('Vragen stellen', 'Asking questions', 270), tr('Vertrouw, controleer', 'Trust and check', 270), tr('Sturen op bewijs', 'Steering on evidence', 270)];
    let flow = '';
    rows.forEach((n, i) => {
      const y = 56 + i * 54;
      flow += rect(334, y, 284, 36, i === 3 ? 'pm-crit' : 'pm-card', 6) + txt(346, y + 26, n, 22, 'start', i === 3 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, y - 17, 476, y);
    });
    const dec = card2(272, tr('Kast wordt groter', 'Cabinet gets bigger', 270), tr('lijn 3 op zijn plek', 'line 3 in place', 260));
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

  const KEYS = ['goalB', 'needB', 'ownerB', 'directorB', 'splitB', 'blindB', 'notinB', 'assumeB', 'claimB', 'verifyB', 'eyesB', 'clashB', 'pctB', 'mileB', 'proofB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
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
      title = [tr('Instelling', 'Mindset'), tr('Vragen stellen', 'Asking questions'), tr('Experts', 'Experts'), tr('Sturen', 'Steering')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, mindParts(b, p));
    if (si === 2) Object.assign(o, questParts(b, p));
    if (si === 3) Object.assign(o, expParts(b, p));
    if (si === 4) Object.assign(o, steerParts(b, p));
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
