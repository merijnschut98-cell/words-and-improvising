// The stage of the module intro film "Het adviesvak in een opdracht / The consulting craft in one assignment": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is drawn in hall B at the left, the hall
// of field film 3 (films/pm.field.portfolio): line 3 on its floor, the switchboard on the wall, the
// cable connected, and a cast that changes per topic (the plant manager who pays for the advice, the team lead,
// the operators). You, the consultant, are not drawn. The panel at the right draws each step
// as a schema, labelled "voorbeeld" (the plant's story) or "schema" (the module's map).
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
  const ORDER = ['offer', 'advisor', 'ethics', 'grow'];
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

  // ---- the cast of hall B: who stands there, per scene. sponsor: the plant manager, who pays for the advice; lead: the
  // team lead of the line; crew: the two operators at line 3 (whose employee stop times are in the data of s4)
  const HERE = [
    { sponsor: 1, lead: 0, crew: 1 }, // s1 too many jobs are cancelled
    { sponsor: 1, lead: 1, crew: 0 }, // s2 his problem, told on the floor
    { sponsor: 1, lead: 0, crew: 0 }, // s3 trust is between you and him
    { sponsor: 1, lead: 0, crew: 1 }, // s4 the operators, whose stop times per employee are in the data
    { sponsor: 1, lead: 1, crew: 0 }, // s5 the results are handed over
    { sponsor: 1, lead: 1, crew: 1 }, // s6 all of them
  ];
  function cast(si) {
    const h = HERE[si] || { sponsor: 0, lead: 0, crew: 0 };
    show(E['pp-sponsor'], h.sponsor);
    show(E['pp-lead'], h.lead);
    show(E['pp-crew'], h.crew);
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

  // ---- s1: the goal (too many jobs are still cancelled, the plant manager wants advice); then who he is and who you are
  function goalCard(a) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Te veel afzeggingen', 'Too many cancellations', 272), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('hij vraagt jou om advies', 'he asks you for advice', 272), 22, 'start', 'pm-txt');
    return op(a, s);
  }

  // ---- the tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). one, two: the scene's labels; shown in the beat of the sentence (b === at)
  // a label too long for one line is given as two (an array of two): the chip is then 56 units high
  function tools(b, p, at, one, two, y0 = 296) {
    const chip = (y, label) => { const ls = [].concat(label); return rect(334, y, 284, ls.length > 1 ? 56 : 34, 'pm-badge', 6) + ls.map((l, i) => txt(346, y + 25 + i * 23, l, 22, 'start', 'pm-txt')).join(''); };
    const y1 = y0 + 42;
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(y0, one)) : '', tool2B: b === at && two ? op(span(p, 0.25, 0.65), chip(y1, two)) : '' };
  }
  // a card with a big line and a small one under it (two lines in a 56-unit card: baselines at 24 and 47 keep
  // the first line clear of the top edge and leave room under the descents of the second line)
  const card2 = (y, big, small, cls = 'pm-card') => rect(334, y, 284, 56, cls, 8) + txt(346, y + 24, big, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-big') + txt(346, y + 47, small, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-mute');
  // a row that does not help: dashed, muted, with a cross
  const no = (y, label) => rect(334, y, 284, 36, 'pm-out', 8) + txt(346, y + 26, label, 22, 'start', 'pm-mute') + mark(592, y + 18, false);
  // a plain row of one line
  const row = (y, label, cls = 'pm-card') => rect(334, y, 284, 38, cls, 8) + txt(346, y + 27, label, 22, 'start', cls === 'pm-crit' ? 'pm-on' : 'pm-txt');

  function needParts(b, p) {
    const need = card2(94, tr('Plantmanager', 'Plant manager'), tr('betaalt voor advies', 'pays for advice', 260))
      + card2(160, tr('Jij', 'You'), tr('de adviseur', 'the consultant', 260), 'pm-crit');
    return { needB: b === 1 ? op(span(p, 0.05, 0.4), need) : '' };
  }

  // ---- s2: proposal and price. A proposal wins on its first page: his problem in his words and numbers, your method later;
  // then the outcome, the price and what he delivers himself; two or three options, so he chooses how and not whether.
  function offerParts(b, p) {
    const page1 = card2(94, tr('Pagina één', 'Page one'), tr('wint de offerte', 'wins the proposal', 260), 'pm-crit');
    const prob = card2(94, tr('Zijn probleem', 'His problem'), tr('zijn eigen woorden', 'his own words', 260), 'pm-crit')
      + rect(334, 160, 284, 56, 'pm-out', 8) + txt(346, 184, tr('Jouw aanpak', 'Your method'), 22, 'start', 'pm-mute') + txt(346, 207, tr('komt later', 'comes later', 260), 22, 'start', 'pm-mute');
    const give = row(94, tr('De uitkomst', 'The outcome', 260)) + row(142, tr('De prijs', 'The price', 260)) + row(190, tr('Wat hij zelf levert', 'What he delivers', 260));
    let opts = card2(94, tr('Twee of drie opties', 'Two or three options', 272), tr('hij kiest hoe, niet of', 'he picks how, not if', 272));
    ['A', 'B', 'C'].forEach((l, i) => { opts += rect(334 + i * 98, 168, 88, 44, i === 1 ? 'pm-crit' : 'pm-tile', 8) + txt(334 + i * 98 + 44, 198, l, 22, 'middle', i === 1 ? 'pm-on' : 'pm-txt'); });
    return { page1B: b === 0 ? op(span(p, 0.1, 0.5), page1) : '', probB: b === 1 ? op(span(p, 0.05, 0.4), prob) : '', giveB: b === 2 ? op(span(p, 0, 0.4), give) : '', optsB: b === 3 ? op(span(p, 0, 0.4), opts) : '',
      ...tools(b, p, 4, tr('Diagnosefase', 'Diagnostic phase', 260), tr('Nulmeting', 'Baseline', 260)) };
  }

  // ---- s3: the trusted-advisor relationship. He has to dare to tell you what worries him; he cannot judge your method yet
  // and watches small things (the minutes the same day); ten small promises kept do more than one brilliant analysis;
  // sometimes you advise less work than you could sell, and that pays back.
  function trustParts(b, p) {
    const dare = card2(94, tr('Hij vertelt je', 'He tells you'), tr('wat hem zorgen baart', 'what really worries him', 272), 'pm-crit');
    const small = no(94, tr('Methode toetsen', 'Judging method', 220))
      + card2(146, tr('Kleine dingen', 'Small things'), tr('notulen dezelfde dag', 'minutes the same day', 260), 'pm-crit');
    const ten = card2(94, tr('Tien kleine beloftes', 'Ten small promises'), tr('nagekomen', 'kept', 260), 'pm-crit')
      + card2(160, tr('Eén briljante analyse', 'One brilliant analysis', 272), tr('weegt minder', 'weighs less', 260));
    const less = card2(94, tr('Soms minder werk', 'Sometimes less work'), tr('dan je kunt verkopen', 'than you could sell', 260), 'pm-crit')
      + card2(160, tr('Dat betaalt zich', 'That pays back'), tr('vele keren terug', 'many times', 260));
    return { dareB: b === 0 ? op(span(p, 0.1, 0.5), dare) : '', smallB: b === 1 ? op(span(p, 0.05, 0.4), small) : '', tenB: b === 2 ? op(span(p, 0, 0.4), ten) : '', lessB: b === 3 ? op(span(p, 0, 0.4), less) : '',
      ...tools(b, p, 4, tr('Vertrouwensformule', 'Trust equation', 272)) };
  }

  // ---- s4: ethics and independence. Only the client pays for your advice; a supplier's money per client you send breaks it,
  // because the client can no longer tell whether it bent you; facts first, then conclusion, then advice; his data holds
  // the stop times per employee, and what you learn there stays there.
  function ethicsParts(b, p) {
    const indep = card2(94, tr('Alleen de klant', 'Only the client'), tr('betaalt voor je advies', 'pays for your advice', 260), 'pm-crit')
      + card2(160, tr('Onafhankelijk', 'Independent'), tr('je advies is geld waard', 'your advice is worth it', 272));
    const fee = card2(94, tr('Leverancier betaalt', 'Supplier pays'), tr('geld per klant', 'money per client', 260))
      + no(160, tr('Onafhankelijk', 'Independent', 220))
      + card2(206, tr('Klant ziet niet', 'Client cannot tell'), tr('of het je advies buigt', 'if it bent your advice', 272), 'pm-crit');
    let hard = '';
    [tr('Eerst de feiten', 'First the facts', 260), tr('Dan je conclusie', 'Then your conclusion', 260), tr('Dan je advies', 'Then your advice', 260)].forEach((n, i) => {
      const y = 94 + i * 54;
      hard += row(y, n, i === 2 ? 'pm-crit' : 'pm-card');
      if (i) hard += arrow(476, y - 16, 476, y);
    });
    const data = card2(94, tr('Zijn data', 'His data'), tr('stoptijd per medewerker', 'stop times per employee', 272))
      + card2(160, tr('Wat je leert', 'What you learn'), tr('blijft bij hem', 'stays with him', 260), 'pm-crit');
    return { indepB: b === 0 ? op(span(p, 0.1, 0.5), indep) : '', feeB: b === 1 ? op(span(p, 0.05, 0.4), fee) : '', hardB: b === 2 ? op(span(p, 0, 0.4), hard) : '', dataB: b === 3 ? op(span(p, 0, 0.4), data) : '',
      ...tools(b, p, 4, tr('Dataminimalisatie', 'Data minimisation', 260), tr('Pseudonimiseren', 'Pseudonymising', 260)) };
  }

  // ---- s5: growing the client and the practice. At close-out you hand over the results and name what else you saw; good,
  // visible work brings the next problem; a known client costs hours, a new one months; a result people can repeat in one
  // sentence brings referrals.
  function growParts(b, p) {
    const hand = card2(94, tr('Resultaten', 'Results'), tr('overgedragen', 'handed over', 260), 'pm-crit')
      + card2(160, tr('Ook gezien', 'Also seen'), tr('een ander probleem', 'another problem', 260));
    const next = card2(94, tr('Goed, zichtbaar werk', 'Good, visible work', 272), tr('jouw opdracht', 'your assignment', 260))
      + arrow(476, 152, 476, 176)
      + card2(180, tr('Volgend probleem', 'Next problem'), tr('komt vanzelf naar je toe', 'comes to you', 272), 'pm-crit');
    const known = card2(94, tr('Bekende klant', 'Known client'), tr('een paar uur praten', 'a few hours of talk', 260), 'pm-crit')
      + card2(160, tr('Nieuwe klant', 'New client'), tr('maanden werk eraan', 'months of work', 260));
    const refer = card2(94, tr('Eén zin', 'One sentence'), tr('die ze navertellen', 'they can repeat', 260), 'pm-crit')
      + arrow(476, 152, 476, 176)
      + card2(180, tr('Doorverwijzing', 'Referral'), tr('van klant naar collega', 'from client to colleague', 272));
    return { handB: b === 0 ? op(span(p, 0.1, 0.5), hand) : '', nextB: b === 1 ? op(span(p, 0.05, 0.4), next) : '', knownB: b === 2 ? op(span(p, 0, 0.4), known) : '', referB: b === 3 ? op(span(p, 0, 0.4), refer) : '',
      ...tools(b, p, 4, tr('Positionering', 'Positioning', 260), tr('Declarabele dagen', 'Billable days', 260)) };
  }

  // ---- s6: one whole. The chain from the proposal to the client who comes back, and the choice he makes after the diagnostic phase.
  function flowParts(b, p) {
    const rows = [tr('Offerte', 'Proposal', 270), tr('Vertrouwen', 'Trust', 270), tr('Onafhankelijk advies', 'Independent advice', 270), tr('Klant komt terug', 'Client comes back', 270)];
    let flow = '';
    rows.forEach((n, i) => {
      const y = 56 + i * 54;
      flow += rect(334, y, 284, 36, i === 3 ? 'pm-crit' : 'pm-card', 6) + txt(346, y + 26, n, 22, 'start', i === 3 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, y - 17, 476, y);
    });
    const dec = card2(272, tr('Na de diagnosefase', 'After the diagnosis', 270), tr('beslist hij over doorgaan', 'he decides if it goes on', 272));
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

  const KEYS = ['goalB', 'needB', 'page1B', 'probB', 'giveB', 'optsB', 'dareB', 'smallB', 'tenB', 'lessB', 'indepB', 'feeB', 'hardB', 'dataB', 'handB', 'nextB', 'knownB', 'referB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si);
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 6;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = tr('De opdracht', 'The assignment');
      o.goalB = b >= 1 ? '' : goalCard(span(p, 0.05, 0.4));
      if (b === 1) Object.assign(o, needParts(b, p));
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Offerte', 'Proposal'), tr('Vertrouwen', 'Trust'), tr('Ethiek', 'Ethics'), tr('Groeien', 'Growing')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, offerParts(b, p));
    if (si === 2) Object.assign(o, trustParts(b, p));
    if (si === 3) Object.assign(o, ethicsParts(b, p));
    if (si === 4) Object.assign(o, growParts(b, p));
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
