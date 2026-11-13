// The stage of the film "Van idee tot sprintklaar / From idea to sprint-ready":
// a pure function of (scene, u). Inlined into the page after the anatomy kit
// and a preamble from build.mjs that defines C (the panel's blocks, the list
// and cutting area of the board, the Developers' heads, the poker rounds), CAM
// (one camera move per scene), W and H. Moves are placed per Dutch caption
// beat (beatStarts), so the video's narration timing (films/_kit/beatwarp.js)
// keeps them in step. The panel at the right gets one card per scene, each
// block in its own cue group (o[key] goes into data-k "p_<key>"), all text at
// 22 units (a video film); a card that needs more room turns a page within its
// scene. On the back wall the Product Backlog: an ordered column of cards (the
// current story in the accent colour), an epic that arrives on top, is cut on
// the right of the board (three layers, crossed out; then four vertical
// slices) and drops into the list; in the points scenes each card carries a
// size chip. Above the Developers' heads the planning poker cards (s8).
/* global C, CAM, W, H, span, beatStarts */
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
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, t) => { if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const txt = (x, y, t, cls = 'pm-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="22" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  // a card from y with a first line in bold (accent when hot) and more lines below
  const box = (y, head, rest, hot = false, cls) => {
    const more = rest.map((t) => (Array.isArray(t) ? t : [t])).filter(([t]) => t);
    return card(y, 20 + 26 * (more.length + 1), cls || (hot ? 'pm-hot' : 'pm-card')) + lines(y + 28, [[head, hot ? 'pm-on' : 'pm-big'], ...more], X0 + 4);
  };
  const tick = (x, y) => path(`M${f1(x - 8)} ${f1(y)}l6 6l12 -13`, 'pm-line');
  const cross = (x, y) => path(`M${f1(x - 7)} ${f1(y - 7)}l14 14M${f1(x + 7)} ${f1(y - 7)}l-14 14`, 'pm-strike');
  // a numbered step: a ring with the digit, a bold name and one more line
  const step = (y, n, name, more, hot) => `<circle class="pm-ring" cx="${X0 + 12}" cy="${f1(y - 7)}" r="14"/>` + txt(X0 + 12, y + 1, String(n), 'pm-big', 'middle')
    + txt(X0 + 36, y, name, hot ? 'pm-on' : 'pm-big') + (more ? txt(X0 + 36, y + 26, more, 'pm-txt') : '');
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // a page of the card that shows from beat k0 and gives way at beat k1 (-1: never)
  const page = (b, p, k0, k1) => (b < k0 ? 0 : b === k0 && k0 > 0 ? span(p, 0.02, 0.2) : b < k1 || k1 < 0 ? 1 : b === k1 ? 1 - span(p, 0, 0.12) : 0);
  const DIA = tr('schema', 'diagram');
  const EX = tr('voorbeeld', 'example');

  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const cx = lerp(c.from[0], c.to[0], kk);
    const cy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(cx)} ${f1(cy)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`);
  }

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: what a story is, the template, the downtime example and its "so
  // that"; then the three Cs and the promise of a conversation
  function s1(b, p) {
    const o = { head: ['user story', b === 2 || b === 3 ? EX : DIA] };
    const A = page(b, p, 0, 2);
    o.story = op(A, lines(80, [[tr('een user story', 'a user story'), 'pm-big'], [tr('wat een gebruiker wil,', 'what a user wants,')], [tr('in eigen woorden', 'in their own words')]]));
    if (b >= 1) o.tmpl = op(A * at(b, p, 1), box(160, tr('Connextra, ±2001', 'Connextra, c. 2001'), [tr('Als [rol] wil ik', 'As a [role] I want'), tr('[iets], zodat', '[something], so that'), tr('[waarde].', '[value].')], b === 1));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.ex1 = op(B, box(54, tr('operator, lijn 3', 'operator, line 3'), [tr('“Als operator wil ik bij', '“As an operator I want'), tr('een stilstand met twee', 'to pick a cause in two'), tr('tikken een oorzaak', 'taps when the line'), tr('kiezen, zodat de ploeg-', 'stops, so that the shift'), tr('leider weet waar de', 'leader knows where the'), tr('tijd heen ging.”', 'time went.”')], b === 2));
    if (b >= 3) o.why = op(B * at(b, p, 3), box(278, tr('“zodat” = waarom', '“so that” = why'), [tr('het belangrijkste deel', 'the most important part')], true));
    const Cp = page(b, p, 4, -1);
    if (b >= 4) {
      o.threec = op(Cp, lines(76, [[tr('geen specificatie', 'not a specification'), 'pm-mute'], ['Ron Jeffries, 2001', 'pm-big'], [tr('XP: vroege agile methode', 'XP: an early agile way'), 'pm-mute']])
        + step(170, 1, 'Card', tr('kaartje, geheugensteun', 'a card, a reminder'), b === 4)
        + op(at(b, p, 4, 0.3, 0.5), step(228, 2, 'Conversation', tr('details uit gesprek', 'details from talking'), b === 4))
        + op(at(b, p, 4, 0.55, 0.75), step(286, 3, 'Confirmation', tr('zo controleer je het', 'how you check it'), b === 4)));
    }
    if (b >= 5) o.promise = op(Cp * at(b, p, 5), lines(352, [[tr('belofte, geen contract', 'a promise, no contract'), 'pm-on']]));
    return o;
  }

  // s2: acceptance criteria, the three for the downtime story, without them;
  // then the epic and the Product Backlog items; mistakes and the question
  function s2(b, p) {
    const o = { head: [tr('criteria, epic', 'criteria, epic'), DIA] };
    const A = page(b, p, 0, 3);
    o.ac = op(A, box(54, tr('acceptatiecriteria', 'acceptance criteria'), [tr('concreet en toetsbaar:', 'concrete and testable:'), tr('wanneer is hij af?', 'when is it done?')], b === 0));
    if (b >= 1) o.ac3 = op(A * at(b, p, 1), lines(180, [[tr('voorbeeld: stilstand', 'example: downtime'), 'pm-mute'], [tr('✓ hooguit 8 oorzaken', '✓ at most 8 causes')], [tr('✓ met werkhandschoenen', '✓ with work gloves on')], [tr('✓ binnen 1 minuut bij', '✓ within 1 minute in')], [tr('  de ploegleider', '  the shift leader’s view')]]));
    if (b >= 2) o.noac = op(A * at(b, p, 2), lines(332, [[tr('zonder: discussie pas', 'without: the argument'), 'pm-on'], [tr('bij de oplevering', 'only at delivery'), 'pm-on']]));
    const B = page(b, p, 3, 5);
    if (b >= 3) o.epic = op(B, box(54, 'epic', [tr('te groot voor 1 sprint', 'too big for 1 sprint'), tr('bv. OEE per lijn voor', 'e.g. OEE per line for'), tr('de plantmanager', 'the plant manager'), [tr('OEE: beschikbaarheid ×', 'OEE: availability ×'), 'pm-mute'], [tr('prestatie × kwaliteit', 'performance × quality'), 'pm-mute'], [tr('later knippen', 'cut it later'), 'pm-on']], b === 3));
    if (b >= 4) o.pbi = op(B * at(b, p, 4), lines(278, [[tr('story, epic: soorten', 'story, epic: kinds of'), 'pm-big'], [tr('Product Backlog-items', 'Product Backlog items')], [tr('Scrum Guide: geen vorm', 'Scrum Guide: no format'), 'pm-mute'], [tr('stories: een keuze', 'stories: a choice'), 'pm-mute']]));
    const Cp = page(b, p, 5, -1);
    if (b >= 5) o.errs = op(Cp, lines(80, [[tr('fouten', 'mistakes'), 'pm-big'], [tr('taak als story: “als', 'a task as a story: “as a'), 'pm-txt'], [tr('ontwikkelaar wil ik een', 'developer I want a'), 'pm-txt'], [tr('database”', 'database”'), 'pm-txt'], [tr('geen “zodat”', 'no “so that”')], [tr('rol: “de gebruiker”', 'role: “the user”')]]) + cross(X1 - 12, 74));
    if (b >= 6) o.ask = op(at(b, p, 6), lines(250, [[tr('sjabloon te schools?', 'template too formal?'), 'pm-big'], [tr('prima, als wie, wat en', 'fine, if who, what and')], [tr('waarom erin staan', 'why are in it')], [tr('wie merkt het als dit af', 'who notices when this is'), 'pm-on'], [tr('is, en waaraan?', 'done, and how?'), 'pm-on']]));
    return o;
  }

  // s3: the steel doors: thirty pages, page 4, the story after ten minutes,
  // its criteria and what is left of the thirty pages
  function s3(b, p) {
    const o = { head: [tr('stalen deuren', 'steel doors'), EX] };
    const A = page(b, p, 0, 2);
    o.doors = op(A, box(54, tr('30 blz. eisen', '30 pages of requirements'), [tr('van de planner, voor', 'from the planner, for'), tr('een nieuw planscherm', 'a new planning screen')], b === 0));
    if (b >= 1) o.p4 = op(A * at(b, p, 1), lines(184, [[tr('blz. 4:', 'page 4:'), 'pm-mute'], [tr('“toon de bezetting van', '“show the load on all')], [tr('alle machines”', 'machines”')], [tr('wie? en waarvoor?', 'who? and what for?'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.story3 = op(B, box(54, tr('na 10 min gesprek:', 'after a 10-min talk:'), [tr('Als planner wil ik per', 'As a planner I want to'), tr('lasrobot de bezetting', 'see each welding robot’s'), tr('voor 5 werkdagen zien,', 'load for 5 working days,'), tr('zodat ik spoedorders', 'so that I can put rush'), tr('op een robot met ruimte', 'orders on a robot'), tr('kan zetten.', 'with room.')], b === 2));
    if (b >= 3) o.crit3 = op(at(b, p, 3), lines(284, [[tr('✓ uren per dag', '✓ hours per day')], [tr('✓ rood boven 90%', '✓ red above 90%')], [tr('✓ elke 15 min ververst', '✓ refreshed every 15 min')]]));
    if (b >= 4) o.result = op(at(b, p, 4), lines(372, [[tr('±25 stories; 6 blz.: niets', '~25 stories; 6 pages: none'), 'pm-on']]));
    return o;
  }

  // s4: refinement, the weekly slot, who does what; then INVEST and its six
  // letters, and what a weak letter tells you
  function s4(b, p) {
    const o = { head: ['refinement', DIA] };
    const A = page(b, p, 0, 3);
    o.refine = op(A, box(54, 'refinement', [tr('doorlopend: knippen,', 'ongoing: cut smaller,'), tr('details en criteria,', 'add details, criteria,'), tr('grootte inschatten', 'and size')], b === 0));
    if (b >= 1) o.slot = op(A * at(b, p, 1), lines(208, [[tr('geen event; vaak', 'not an event; often'), 'pm-big'], [tr('1 à 2 uur per week', '1 to 2 hours a week')]]));
    if (b >= 2) o.who = op(A * at(b, p, 2), box(262, tr('wie?', 'who?'), [tr('Developers: grootte', 'Developers: the size'), tr('PO: wat en waarom', 'PO: what and why')], b === 2));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.invest = op(B, lines(72, [['INVEST', b === 3 ? 'pm-on' : 'pm-big'], ['Bill Wake, 2003', 'pm-mute']]));
    if (b >= 4) {
      const L = [['I', 'ndependent', tr('los', 'separate')], ['N', 'egotiable', tr('open', 'open')], ['V', 'aluable', tr('waardevol', 'of value')],
        ['E', 'stimable', tr('te schatten', 'sizable')], ['S', 'mall', tr('klein', 'fits a sprint')], ['T', 'estable', tr('testbaar', 'checkable')]];
      o.letters = L.map(([l, rest, nl], i) => op(at(b, p, 4, 0.05 + i * 0.1, 0.15 + i * 0.1),
        txt(X0, 136 + i * 32, l, 'pm-on') + txt(X0 + 18, 136 + i * 32, `${rest}:`, 'pm-txt') + txt(X1, 136 + i * 32, nl, 'pm-mute', 'end'))).join('');
    }
    if (b >= 5) o.fail = op(at(b, p, 5), lines(340, [[tr('zwakke letter? dan weet', 'weak letter? then you'), 'pm-on'], [tr('je wat je moet doen', 'know what to do'), 'pm-on']]));
    return o;
  }

  // s5: story splitting; horizontal layers crossed out, vertical slices
  // through all layers; then the Definition of Ready and ordering
  function s5(b, p) {
    const o = { head: [tr('story splitsen', 'story splitting'), DIA] };
    const A = page(b, p, 0, 3);
    o.split = op(A, lines(80, [[tr('story splitsen', 'story splitting'), 'pm-big'], [tr('elk stuk levert iets', 'each piece delivers')], [tr('werkends op', 'something working')]]));
    const LY = [tr('scherm', 'screen'), tr('logica', 'logic'), 'database'];
    if (b >= 1) {
      let s = txt(X0, 158, tr('horizontaal', 'horizontal'), 'pm-big');
      LY.forEach((t, i) => { s += rect(X0, 170 + i * 32, 132, 28, 'pm-card', 4) + txt(X0 + 66, 191 + i * 32, t, 'pm-txt', 'middle'); });
      s += op(at(b, p, 1, 0.4, 0.6), path(`M${X0 + 4} 172l124 88M${X0 + 128} 172l-124 88`, 'pm-strike'));
      o.horiz = op(A * at(b, p, 1), s);
    }
    if (b >= 2) {
      const x0 = X0 + 156;
      let s = txt(x0, 158, tr('verticaal', 'vertical'), 'pm-big');
      for (let i = 0; i < 3; i++) s += rect(x0, 170 + i * 32, 128, 28, 'pm-dash', 4);
      for (let i = 0; i < 4; i++) s += op(at(b, p, 2, 0.1 + i * 0.08, 0.25 + i * 0.08), rect(x0 + 4 + i * 31, 166, 26, 100, i === 0 ? 'pm-hot' : 'pm-card', 3));
      s += op(at(b, p, 2, 0.5, 0.7), lines(296, [[tr('per stap, regel, lijn', 'by step, rule, line'), 'pm-txt'], [tr('of soort product', 'or product type'), 'pm-txt'], [tr('eenvoudigste eerst,', 'simplest first,'), 'pm-on'], [tr('dan de uitzonderingen', 'then the exceptions'), 'pm-on']], X0));
      o.vert = op(A * at(b, p, 2), s);
    }
    const B = page(b, p, 3, -1);
    if (b >= 3) o.dor = op(B, box(54, 'Definition of Ready', [tr('klaar voor een sprint?', 'ready for a sprint?'), [tr('bv. criteria bekend', 'e.g. criteria known'), 'pm-mute'], tr('niet in de Scrum Guide', 'not in the Scrum Guide'), [tr('geen nieuwe poort', 'no new gate'), 'pm-on']], b === 3));
    if (b >= 4) o.order = op(B * at(b, p, 4), box(222, tr('ordenen: de PO', 'ordering: the PO'), [tr('op waarde, risico en', 'by value, risk and'), tr('afhankelijkheden', 'dependencies'), [tr('vaak eerst: veel waarde', 'often first: high value'), 'pm-mute'], [tr('of veel onzekerheid weg', 'or much uncertainty gone'), 'pm-mute']], b === 4));
    return o;
  }

  // s6: work preparation and the mistakes; then the window frames: the story,
  // three sprints, four vertical slices, and what story 1 brings
  function s6(b, p) {
    const o = { head: [tr('kozijnen', 'window frames'), b >= 2 ? EX : DIA] };
    const A = page(b, p, 0, 2);
    o.prep = op(A, box(54, tr('Lean: werkvoorbereiding', 'Lean: work preparation'), [tr('klus zonder onderdelen', 'a job without parts'), tr('en tekening loopt vast;', 'and drawings gets stuck;'), tr('zo ook een story', 'so does a story'), tr('zonder criteria', 'without criteria')], b === 0));
    if (b >= 1) o.errs2 = op(A * at(b, p, 1), lines(236, [[tr('fouten', 'mistakes'), 'pm-big'], [tr('lang over werk voor over', 'long talks about work')], [tr('een half jaar; of niets,', 'six months out; or none,')], [tr('dan uren Sprint Planning', 'then hours of planning')], [tr('klaar voor 2 sprints?', 'ready for 2 sprints?'), 'pm-on']]));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.frames = op(B, box(54, tr('kozijnen', 'window frames'), [tr('Als planner wil ik dat', 'As a planner I want the'), tr('het systeem de orders', 'system to spread orders'), tr('over de zaagmachines', 'over the saws, so that'), tr('verdeelt, zodat ik geen', 'I don’t spend an hour'), tr('uur per dag puzzel.', 'a day puzzling.')], b === 2));
    if (b >= 3) o.cut3 = op(B * at(b, p, 3), lines(268, [[tr('team: 3 sprints', 'team: 3 sprints'), 'pm-big'], [tr('→ verticaal knippen', '→ cut vertically'), 'pm-on']]));
    const Cp = page(b, p, 4, -1);
    if (b >= 4) {
      o.slices = op(Cp, step(84, 1, tr('1 zaag, alleen', '1 saw, standard'), tr('standaardprofielen', 'profiles only'), true)
        + op(at(b, p, 4, 0.25, 0.4), step(150, 2, tr('alle 3 zagen', 'all 3 saws'), ''))
        + op(at(b, p, 4, 0.45, 0.6), step(196, 3, tr('spoedorders eerst', 'rush orders first'), ''))
        + op(at(b, p, 4, 0.65, 0.8), step(242, 4, tr('omsteltijd: machine', 'changeover: set up for'), tr('naar ander profiel', 'another profile'))));
    }
    if (b >= 5) o.learn = op(Cp * at(b, p, 5), lines(310, [[tr('story 1: 1 sprint', 'story 1: 1 sprint'), 'pm-on'], [tr('na 2 weken op 1 machine', 'in use after 2 weeks')], [tr('team leert of de regels', 'team learns if the rules')], [tr('kloppen', 'are right')]]));
    return o;
  }

  // s7: relative estimation, story points, per team; then the deck, the
  // doubt between 8 and 13, and where points came from
  function s7(b, p) {
    const o = { head: ['story points', DIA] };
    const A = page(b, p, 0, 3);
    o.rel = op(A, lines(80, [[tr('relatief schatten', 'relative estimation'), 'pm-big'], [tr('niet: hoeveel uur?', 'not: how many hours?'), 'pm-mute'], [tr('wel: groter of kleiner', 'but: bigger or smaller'), 'pm-on'], [tr('dan bekend werk?', 'than known work?'), 'pm-on']]));
    if (b >= 1) {
      const chip = (x, n, sz) => rect(x, 300 - sz, sz, sz, 'pm-blk', 2) + txt(x + sz + 8, 300, String(n), 'pm-big');
      o.sp = op(A * at(b, p, 1), box(178, 'story points', [tr('werk + complexiteit', 'work + complexity'), tr('+ onzekerheid', '+ uncertainty')], b === 1)
        + op(at(b, p, 1, 0.4, 0.6), chip(X0, 2, 14) + chip(X0 + 70, 8, 28) + txt(X1, 300, tr('8 ≈ 4 × 2', '8 ≈ 4 × 2'), 'pm-on', 'end')));
    }
    if (b >= 2) o.perteam = op(A * at(b, p, 2), lines(338, [[tr('per team: 5 bij A is', 'per team: A’s 5 is'), 'pm-big'], [tr('niet 5 bij B', 'not B’s 5')]]));
    const B = page(b, p, 3, 5);
    if (b >= 3) {
      let row = '';
      C.FIB.forEach((n, i) => {
        const x = X0 + (i < 5 ? i * 57 : (i - 5) * 72);
        const y = i < 5 ? 92 : 140;
        const wd = i < 5 ? 50 : 64;
        const hot = b >= 4 && (n === 8 || n === 13);
        row += op(at(b, p, 3, 0.05 + i * 0.05, 0.15 + i * 0.05), rect(x, y, wd, 38, hot ? 'pm-hot' : 'pm-card', 4) + txt(x + wd / 2, y + 27, String(n), hot ? 'pm-on' : 'pm-big', 'middle'));
      });
      o.fib = op(B, txt(X0, 76, tr('aangepaste Fibonacci', 'modified Fibonacci'), 'pm-big') + row + lines(208, [[tr('gaten groeien mee: groot', 'gaps grow: big work is'), 'pm-mute'], [tr('werk is minder precies', 'less precise'), 'pm-mute']]));
    }
    if (b >= 4) o.doubt = op(B * at(b, p, 4), box(270, tr('8 of 13?', '8 or 13?'), [tr('groot en onzeker:', 'big and uncertain:'), [tr('knip hem misschien', 'maybe cut it'), 'pm-on']], true));
    const Cp = page(b, p, 5, -1);
    if (b >= 5) {
      o.origin = op(Cp, box(54, tr('herkomst: XP', 'origin: XP'), [tr('eerst “ideale dagen”:', 'first “ideal days”:'), tr('1 ideale dag ≈ 3 echte', '1 ideal day ≈ 3 real'), tr('→ hernoemd', '→ renamed')], false)
        + op(at(b, p, 5, 0.4, 0.6), lines(232, [['Ron Jeffries, 2019,', 'pm-big'], [tr('half als grap:', 'half joking:'), 'pm-mute'], [tr('“misschien bedacht,', '“may have invented', ''), 'pm-on'], [tr('en nu spijt”', 'them; sorry now”'), 'pm-on']])));
    }
    return o;
  }

  // s8: planning poker in three steps; then velocity, the spread, no target,
  // and counting items
  function s8(b, p) {
    const o = { head: [tr('planning poker', 'planning poker'), DIA] };
    const A = page(b, p, 0, 3);
    o.poker = op(A, box(54, 'planning poker', ['James Grenning, 2002', tr('samen schatten, kaarten', 'estimating with cards')], b === 0));
    if (b >= 1) o.read = op(A * at(b, p, 1), step(184, 1, tr('PO leest voor', 'PO reads out'), '', b === 1) + step(220, 2, tr('iedereen kiest stil', 'all pick silently'), '', b === 1) + step(256, 3, tr('tegelijk omdraaien', 'turn over at once'), '', b === 1));
    if (b >= 2) o.talk = op(A * at(b, p, 2), box(278, tr('3 en 13?', '3 and 13?'), [tr('hoogste, laagste: uitleg', 'highest, lowest explain'), [tr('dat gesprek is de waarde', 'that talk is the value'), 'pm-mute']], b === 2));
    const B = page(b, p, 3, 6);
    if (b >= 3) o.vel = op(B, box(54, 'velocity', [tr('punten per sprint af,', 'points done per sprint,'), tr('volgens Definition of Done', 'by the Definition of Done'), [tr('over sprints: bandbreedte', 'over sprints: a range'), 'pm-mute']], b === 3));
    if (b >= 4) o.spread = op(B * at(b, p, 4), lines(210, [[tr('18 tot 30 punten?', '18 to 30 points?'), 'pm-big'], [tr('plan niet op 30', 'don’t plan on 30'), 'pm-on'], [tr('zelfde team, stabiel', 'same team, stable'), 'pm-mute'], [tr('schatten', 'estimating'), 'pm-mute']]));
    if (b >= 5) o.goal = op(B * at(b, p, 5), lines(334, [[tr('geen productiviteitsmaat', 'no productivity measure'), 'pm-big'], [tr('doel → ruimer schatten', 'target → estimates grow'), 'pm-on']]));
    const Cp = page(b, p, 6, -1);
    if (b >= 6) o.count = op(Cp, lines(80, [[tr('Lean: lijkt output per', 'Lean: looks like output'), 'pm-mute'], [tr('ploeg, maar is het niet', 'per shift, but isn’t'), 'pm-mute'], ['', ''], [tr('sommigen tellen items:', 'some count items:'), 'pm-big'], [tr('even goed bij kleine,', 'as good when items are'), 'pm-txt'], [tr('gelijke items', 'small and alike'), 'pm-txt'], ['', ''], [tr('vraag: waarvoor die', 'ask: what are these'), 'pm-on'], [tr('punten, wie kijkt?', 'points for, who looks?'), 'pm-on']]));
    return o;
  }

  // s9: the tow bars: six sprints as bars, the mean, 120 left, the single
  // number; then the range from fastest and slowest, in weeks, and the caveat
  function s9(b, p) {
    const o = { head: [tr('trekhaken', 'tow bars'), EX] };
    const A = page(b, p, 0, 3);
    {
      let s = txt(X0, 72, tr('velocity, 6 sprints', 'velocity, 6 sprints'), 'pm-big');
      const base = 210;
      C.VEL.forEach((v, i) => {
        const x = X0 + i * 48;
        const hgt = v * 2.6;
        const a = at(b, p, 0, 0.05 + i * 0.07, 0.2 + i * 0.07);
        s += op(a, rect(x, base - hgt, 38, hgt, v === 30 || v === 18 ? 'pm-hot' : 'pm-card', 3) + txt(x + 19, base - hgt - 6, String(v), 'pm-txt', 'middle'));
      });
      const ym = base - 23.3 * 2.6;
      s += op(at(b, p, 0, 0.6, 0.8), path(`M${X0 - 4} ${f1(ym)}H${X1}`, 'pm-dash') + txt(X0, 240, tr('gem. 140 / 6 = 23,3', 'mean 140 / 6 = 23.3'), 'pm-on'));
      o.vel6 = op(A, s);
    }
    if (b >= 1) o.when = op(A * at(b, p, 1), lines(282, [[tr('nog 120 punten', '120 points left'), 'pm-big'], [tr('“wanneer klaar?”', '“when is it done?”')]]));
    if (b >= 2) o.single = op(A * at(b, p, 2), lines(344, [[tr('120 / 23,3 = 5,1 → 6?', '120 / 23.3 = 5.1 → 6?'), 'pm-mute'], [tr('schijnzekerheid', 'false certainty'), 'pm-on']]) + cross(X1 - 12, 338));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.range = op(B, box(54, tr('bandbreedte', 'range'), [tr('snelst: 120 / 30 = 4', 'fastest: 120 / 30 = 4'), tr('traagst: 120 / 18 = 6,7', 'slowest: 120 / 18 = 6.7'), tr('→ 7 sprints', '→ 7 sprints')], b === 3));
    if (b >= 4) o.weeks = op(B * at(b, p, 4), box(196, tr('4 tot 7 sprints', '4 to 7 sprints'), [tr('= 8 tot 14 weken', '= 8 to 14 weeks'), tr('waarschijnlijk 6: 12 wk', 'likely 6: 12 weeks')], true));
    if (b >= 5) o.grow = op(B * at(b, p, 5), lines(326, [[tr('alleen als de lijst niet', 'only if the list doesn’t'), 'pm-mute'], [tr('groeit; elke sprint bijwerken', 'grow; update each sprint'), 'pm-on']]));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the Product Backlog
  // Items: u the current story, a to d other items, E the epic (two rows tall),
  // k1 to k4 its vertical slices, F the window-frame epic, f1 to f4 its slices,
  // n1 and n2 new work. A state lists the ordered column and what lies in the
  // cutting area (E or F whole, as three layers, or with cut lines; slices).
  const L = C.LIST;
  const K = C.CUT;
  const LW = L.x1 - L.x0;
  const SIZE = { u: 3, a: 5, b: 2, c: 8, d: 1, k1: 2, k2: 3, k3: 3, k4: 5, f1: 2, f2: 3, f3: 5, f4: 3 };
  const BASE = ['u', 'a', 'b', 'c', 'd'];
  const WITH_E = ['E', 'u', 'a', 'b', 'c'];
  const AFTER_K = ['k1', 'k2', 'k3', 'k4', 'u', 'a'];
  const AFTER_F = ['f1', 'f2', 'f3', 'f4', 'k1', 'k2'];
  const st = (list, cut = [], mode = '') => ({ list, cut, mode });
  const BOARD = [
    [st(BASE)],
    [st(BASE), st(BASE), st(BASE), st(WITH_E)],
    [st(WITH_E)],
    [st(WITH_E)],
    [st(BASE, ['E']), st(BASE, ['E'], 'layers'), st(BASE, ['k1', 'k2', 'k3', 'k4']), st(BASE, ['k1', 'k2', 'k3', 'k4']), st(AFTER_K)],
    [st(AFTER_K), st(AFTER_K), st(AFTER_K, ['F']), st(AFTER_K, ['F'], 'lines'), st(AFTER_K, ['f1', 'f2', 'f3', 'f4']), st(AFTER_F)],
    [st(AFTER_F)],
    [st(AFTER_F)],
    [st(AFTER_F), st(AFTER_F), st(AFTER_F), st(AFTER_F), st(AFTER_F), st(AFTER_F, ['n1', 'n2'])],
  ];
  const ACCENT = ['u', 'u', 'u', 'u', 'k1', 'f1', 'f1', 'f1', 'f1'];
  const boardAt = (si, b) => { const s = BOARD[si]; return s[Math.min(b, s.length - 1)]; };
  // where each item sits in a state: [x, v, w, h] in the board's face plane
  function layout(state) {
    const out = {};
    let r = 0;
    for (const id of state.list) {
      if (r > 5) break;
      const tall = id === 'E' || id === 'F';
      out[id] = [L.x0, L.v0 + r * L.pitch, LW, tall ? L.h + L.pitch : L.h];
      r += tall ? 2 : 1;
    }
    const cw = K.x1 - K.x0;
    const ch = K.v1 - K.v0;
    state.cut.forEach((id, i) => {
      if (id === 'E' || id === 'F') out[id] = [K.x0, K.v0, cw, ch];
      else if (id[0] === 'n') out[id] = [K.x0, K.v0 + i * L.pitch, cw, L.h];
      else { const sw = (cw - 9) / 4; out[id] = [K.x0 + i * (sw + 3), K.v0, sw, ch]; }
    });
    return out;
  }
  function board(si, b, p) {
    const now = boardAt(si, b);
    const prev = b > 0 ? boardAt(si, b - 1) : si > 0 ? boardAt(si - 1, 99) : now;
    const A = layout(now);
    const Z = layout(prev);
    const t = span(p, 0.15, 0.6);
    const chips = si >= 6 || (si === 5 ? false : false) ? 1 : 0;
    const chipA = si === 6 ? at(b, p, 1, 0.3, 0.6) : chips;
    let s = '';
    const ids = [...new Set([...Object.keys(Z), ...Object.keys(A)])];
    for (const id of ids) {
      const a = Z[id];
      const z = A[id];
      let rc;
      let alpha = 1;
      if (a && z) rc = a.map((v, i) => lerp(v, z[i], t));
      else if (z) { rc = z; alpha = t; } else { rc = a; alpha = 1 - t; }
      if (alpha <= 0.01) continue;
      const hot = id === ACCENT[si];
      let body;
      if ((id === 'E' || id === 'F') && z && now.mode === 'layers') {
        const lh = (rc[3] - 6) / 3;
        body = [0, 1, 2].map((i) => rect(rc[0], rc[1] + i * (lh + 3), rc[2], lh, 'pm-note', 1)).join('')
          + op(span(p, 0.4, 0.6), path(`M${f1(rc[0])} ${f1(rc[1])}l${f1(rc[2])} ${f1(rc[3])}M${f1(rc[0] + rc[2])} ${f1(rc[1])}l${f1(-rc[2])} ${f1(rc[3])}`, 'pm-strike'));
      } else {
        body = rect(rc[0], rc[1], rc[2], rc[3], hot ? 'pm-note2' : 'pm-note', 1);
        if ((id === 'E' || id === 'F') && z && now.mode === 'lines') {
          const sw = (rc[2] - 9) / 4;
          body += op(span(p, 0.2, 0.5), path([1, 2, 3].map((i) => `M${f1(rc[0] + i * (sw + 3) - 1.5)} ${f1(rc[1] - 2)}v${f1(rc[3] + 4)}`).join(''), 'pm-dash'));
        }
        const pts = SIZE[id];
        if (pts && chipA > 0.01 && rc[3] <= L.h + 0.5) {
          const sz = 3 + 1.6 * Math.sqrt(pts);
          body += op(chipA, rect(rc[0] + rc[2] - sz - 1.5, rc[1] + (rc[3] - sz) / 2, sz, sz, 'pm-blk', 0.6));
        }
      }
      s += op(alpha, body);
    }
    return s;
  }

  // ---------------------------------------------------------------- the poker cards
  // Above each Developer's head: face down when chosen, turned over together
  // (3, 5, 13), the far ones lit while they explain, then a second round.
  function poker(si, b, p) {
    if (si !== 7 || b > 3) return '';
    const fade = b === 0 ? span(p, 0.3, 0.6) : b === 3 ? 1 - span(p, 0, 0.3) : 1;
    if (fade <= 0.01) return '';
    let face = 0;
    let vals = C.POKER.first;
    if (b === 1) face = span(p, 0.6, 0.8);
    if (b >= 2) face = 1;
    const second = b === 2 ? span(p, 0.72, 0.9) : b === 3 ? 1 : 0;
    let s = '';
    C.HEADS.forEach(([hx, hy], i) => {
      const x = hx - 17;
      const y = hy - 80;
      const one = (v, hot) => rect(x, y, 34, 44, hot ? 'pm-hot' : 'pm-pk', 3) + txt(hx, y + 30, String(v), hot ? 'pm-on' : 'pm-big', 'middle');
      let c = '';
      const back = rect(x, y, 34, 44, 'pm-pkb', 3);
      if (face < 1) c += op(1 - face, back);
      const lit = b === 2 && (vals[i] === 3 || vals[i] === 13);
      if (face > 0) c += op(face * (1 - second), one(vals[i], lit));
      if (second > 0) c += op(second, one(C.POKER.second[i], false));
      s += c;
    });
    return op(fade, s);
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    set(E.bCards, board(si, b, p));
    set(E.pk, poker(si, b, p));
  }

  return { render };
})();
