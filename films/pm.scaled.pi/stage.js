// The stage of the film "Een PI-planning in twee dagen / A two-day PI
// planning": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the panel's
// blocks, the board's cards and strings, its states per beat, the iterations
// strip), CAM (one camera move per scene), W and H. Moves are placed per Dutch
// caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the right gets one
// card per scene, each block in its own cue group (o[key] goes into data-k
// "p_<key>"), all text at 22 units (a video film); a card that needs more room
// turns a page within its scene. The ART Planning Board on the back wall fills
// with feature cards and red strings per beat (C.BOARD), its ROAM corner sorts
// four risk notes, and one team's row lights up in the worked example; the
// strip of five iterations on the side wall fills with the cadence.
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
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  const box = (y, head, rest, hot = false, cls) => {
    const more = rest.map((t) => (Array.isArray(t) ? t : [t])).filter(([t]) => t);
    return card(y, 20 + 26 * (more.length + 1), cls || (hot ? 'pm-hot' : 'pm-card')) + lines(y + 28, [[head, hot ? 'pm-on' : 'pm-big'], ...more], X0 + 4);
  };
  const cross = (x, y) => path(`M${f1(x - 7)} ${f1(y - 7)}l14 14M${f1(x + 7)} ${f1(y - 7)}l-14 14`, 'pm-strike');
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
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

  // drawings on the cards: a train of wagons (one per team) on a rail; five
  // fingers of a vote; the rows of a board
  function train(y, a) {
    let s = path(`M${X0} ${y + 40}H${X1}`, 'pm-line');
    const dx = lerp(-30, 0, a);
    s += `<g transform="translate(${f1(dx)} 0)">` + rect(X0 + 4, y + 6, 46, 30, 'pm-hot', 4) + rect(X0 + 36, y - 6, 12, 14, 'pm-card', 2);
    for (let i = 0; i < 4; i++) s += rect(X0 + 56 + i * 52, y + 10, 46, 26, 'pm-card', 3) + `<circle class="pm-ring" cx="${X0 + 66 + i * 52}" cy="${y + 40}" r="4"/><circle class="pm-ring" cx="${X0 + 92 + i * 52}" cy="${y + 40}" r="4"/>`;
    return s + '</g>';
  }
  function fingers(y, n) {
    let s = '';
    for (let i = 0; i < 5; i++) s += rect(X0 + 30 + i * 30, y + 40 - (i === 0 ? 22 : 40 - Math.abs(i - 2.4) * 4), 20, i === 0 ? 22 : 40 - Math.abs(i - 2.4) * 4, i < n ? 'pm-hot' : 'pm-card', 8);
    return s + rect(X0 + 24, y + 38, 160, 34, 'pm-card', 12);
  }

  // ---------------------------------------------------------------- the cards
  // s1: one team is not enough; the dependency; scaling, SAFe and the survey
  function s1(b, p) {
    const o = { head: [tr('opschalen', 'scaling'), DIA] };
    const A = page(b, p, 0, 3);
    o.one = op(A, box(54, tr('één Scrum-team', 'one Scrum team'), [tr('hooguit ± tien mensen', 'ten people at most'), [tr('machine vraagt meer', 'a machine needs more'), 'pm-on']], b === 0));
    if (b >= 1) o.parts = op(A * at(b, p, 1), lines(178, [[tr('PLC · bedieningsscherm', 'PLC · operator screen')], [tr('camera · ERP-koppeling', 'camera · ERP link')]]));
    if (b >= 2) o.dep = op(A * at(b, p, 2), box(236, tr('afhankelijkheid', 'dependency'), [tr('6–7 teams, 1 product', '6–7 teams, 1 product'), [tr('team A wacht op B', 'team A waits for B'), 'pm-on']], b === 2) + path(`M${X1 - 50} 258q20 -14 40 0`, 'pm-redp'));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.scale = op(B, lines(72, [[tr('opschalen: veel teams', 'scaling: many teams'), b === 3 ? 'pm-on' : 'pm-big'], [tr('leveren als één geheel', 'deliver as one')]]));
    if (b >= 4) o.safe = op(B * at(b, p, 4), box(116, 'SAFe', ['Scaled Agile Framework', tr('Dean Leffingwell, 2011', 'Dean Leffingwell, 2011'), [tr('versie 6.0 · begin 2023', 'version 6.0 · early 2023'), 'pm-on']], b === 4));
    if (b >= 5) o.survey = op(B * at(b, p, 5), box(258, 'State of Agile', [tr('Digital.ai: al jaren', 'Digital.ai: most used'), tr('meest gebruikt', 'for years'), [tr('geen steekproef', 'not a sample'), 'pm-mute']], b === 5));
    return o;
  }

  // s2: the train; cadence, the PI and the IP iteration; takt; the question
  function s2(b, p) {
    const o = { head: [tr('de trein', 'the train'), DIA] };
    const A = page(b, p, 0, 3);
    o.art = op(A, box(54, 'Agile Release Train', [tr('ART: team van agile', 'ART: a team of agile'), tr('teams, blijft lang', 'teams, long-lived')], b === 0));
    if (b >= 1) o.size = op(A * at(b, p, 1), lines(174, [[tr('50 tot 125 mensen', '50 to 125 people'), 'pm-on']]));
    if (b >= 2) o.train = op(A * at(b, p, 2), train(206, at(b, p, 2, 0.05, 0.6)) + lines(286, [[tr('vertrekt op vaste tijd;', 'leaves at fixed times;')], [tr('niet klaar: de volgende', 'not ready: the next one')], [tr('werk komt naar de trein', 'work comes to the train'), 'pm-mute']]));
    const B = page(b, p, 3, 6);
    if (b >= 3) o.cad = op(B, box(54, tr('cadans', 'cadence'), [tr('vast ritme: alle teams', 'a fixed rhythm: all'), tr('plannen, bouwen en', 'teams plan, build and'), tr('leveren tegelijk', 'deliver at once')], b === 3));
    if (b >= 4) o.pi = op(B * at(b, p, 4), box(192, 'Planning Interval', [[tr('PI: 8 tot 12 weken', 'PI: 8 to 12 weeks'), 'pm-on'], [tr('tot 6.0: Program', 'until 6.0: Program'), 'pm-mute'], ['Increment', 'pm-mute']], b === 4));
    if (b >= 5) o.ip = op(B * at(b, p, 5), lines(338, [[tr('iteraties ± 2 weken;', 'iterations ~2 weeks;'), b === 5 ? 'pm-on' : 'pm-big'], [tr('laatste: IP-iteratie', 'the last: IP iteration')]]));
    const Cp = page(b, p, 6, -1);
    if (b >= 6) {
      o.ip = op(Cp, box(54, tr('IP-iteratie', 'IP iteration'), ['Innovation and Planning', [tr('verbeteren, plannen', 'improve, plan'), 'pm-mute']]));
      o.takt = op(Cp, lines(176, [[tr('Lean: als takt op een lijn', 'Lean: like takt on a line'), b === 6 ? 'pm-on' : 'pm-big'], [tr('elke 2 weken integreren', 'integrate every 2 weeks')]]));
    }
    if (b >= 7) o.ask = op(Cp * at(b, p, 7), box(234, tr('vraag', 'ask'), [tr('welke teams leveren', 'which teams deliver'), tr('samen iets werkends?', 'something that works?'), [tr('= je trein, niet het', '= your train, not the'), 'pm-on'], [tr('organigram', 'org chart'), 'pm-on']], b === 7));
    return o;
  }

  // s3: the machine builder's 72 people
  function s3(b) {
    const o = { head: [tr('machinebouwer', 'machine builder'), EX] };
    o.mb = box(54, tr('72 mensen, software', '72 people, software'), [tr('nieuwe lijn; teams van 9', 'a new line; teams of 9')], b === 0);
    if (b >= 1) o.calc8 = box(144, tr('72 ÷ 9 = 8 teams', '72 ÷ 9 = 8 teams'), [tr('50 tot 125: één ART', '50 to 125: one ART')], b === 1);
    if (b >= 2) o.calc5 = box(234, tr('PI van 10 weken', 'a 10-week PI'), [tr('10 ÷ 2 = 5 iteraties', '10 ÷ 2 = 5 iterations'), tr('4 bouwen + 1 IP', '4 build + 1 IP')], b === 2);
    if (b >= 3) o.year = lines(354, [[tr('52 ÷ 10 = 5,2: ± 5 × per jaar', '52 ÷ 10 = 5.2: ~5 a year'), 'pm-on']]);
    return o;
  }

  // s4: PI Planning, day 1 and 2; objectives, uncommitted; Business Owners
  function s4(b, p) {
    const o = { head: ['PI Planning', DIA] };
    const A = page(b, p, 0, 4);
    o.pip = op(A, box(54, 'PI Planning', [tr('hele trein, ± 2 dagen,', 'whole train, ~2 days,'), tr('één zaal; IP-iteratie', 'one room; IP iteration')], b === 0));
    if (b >= 1) o.day1 = op(A * at(b, p, 1), lines(172, [[tr('dag 1: context en visie', 'day 1: context, vision'), b === 1 ? 'pm-on' : 'pm-big'], [tr('wat, en waarom?', 'what, and why?')]]));
    if (b >= 2) o.cap = op(A * at(b, p, 2), lines(234, [[tr('teams plannen zelf,', 'teams plan themselves,'), b === 2 ? 'pm-on' : 'pm-txt'], [tr('per iteratie, eigen', 'per iteration, own')], [tr('capaciteit', 'capacity')]]));
    if (b >= 3) o.review = op(A * at(b, p, 3), lines(320, [[tr('eind dag 1: management', 'end of day 1: management'), b === 3 ? 'pm-on' : 'pm-big'], [tr('review, problem solving', 'review, problem solving')], [tr('dag 2: bijstellen, tonen', 'day 2: adjust, present')]]));
    const B = page(b, p, 4, -1);
    if (b >= 4) o.obj = op(B, box(54, 'PI-objectives', [tr('doelen in zakelijke taal:', 'goals in business words:'), [tr('storing melden, 1 tik', 'report a stop, 1 tap'), 'pm-on']], b === 4));
    if (b >= 5) o.unc = op(B * at(b, p, 5), lines(172, [[tr('twijfel? uncommitted', 'unsure? uncommitted'), b === 5 ? 'pm-on' : 'pm-big'], [tr('gepland, geen belofte', 'planned, no promise'), 'pm-mute']]));
    if (b >= 6) o.bo = op(B * at(b, p, 6), box(228, 'Business Owners', [tr('zakelijk verantwoordelijk', 'business-accountable'), [tr('waarde 1 tot 10', 'value 1 to 10'), 'pm-on']], b === 6));
    if (b >= 7) o.bv = op(B * at(b, p, 7), lines(358, [[tr('krap? 9 gaat voor 3', 'tight? 9 before 3'), 'pm-on']]));
    return o;
  }

  // s5: the board, the strings, ROAM; the vote, its rule, the obeya
  function s5(b, p) {
    const o = { head: [tr('het bord', 'the board'), DIA] };
    const A = page(b, p, 0, 3);
    let rows = '';
    for (let r = 0; r < 4; r++) rows += rect(X0 + 150, 72 + r * 18, 120, 14, 'pm-card', 2);
    o.apb = op(A, txt(X0, 78, 'ART Planning', b === 0 ? 'pm-on' : 'pm-big') + txt(X0, 104, 'Board', b === 0 ? 'pm-on' : 'pm-big') + rows
      + lines(170, [[tr('teams in rijen,', 'teams in rows,')], [tr('iteraties in kolommen', 'iterations in columns')], [tr('vroeger: program board', 'formerly: program board'), 'pm-mute']]));
    if (b >= 1) o.red = op(A * at(b, p, 1), path(`M${X0 + 2} 266q30 -22 60 0`, 'pm-redp') + lines(272, [[tr('team B wacht op A', 'team B waits for A'), 'pm-on']], X0 + 74));
    if (b >= 2) o.roamc = op(A * at(b, p, 2), box(296, 'ROAM', [tr('Resolved · Owned ·', 'Resolved · Owned ·'), tr('Accepted · Mitigated', 'Accepted · Mitigated')], b === 2).replace(/height="98"/, 'height="92"'));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.vote = op(B, txt(X0, 72, 'confidence vote', b === 3 ? 'pm-on' : 'pm-big') + fingers(84, b === 3 ? Math.ceil(clamp(p * 6, 0, 5)) : 5)
      + lines(188, [[tr('1–5 vingers: haalbaar?', '1–5 fingers: feasible?')]]));
    if (b >= 4) o.rule = op(B * at(b, p, 4), lines(226, [[tr('gemiddeld ≥ 3: genoeg', 'average ≥ 3: enough'), b === 4 ? 'pm-on' : 'pm-big'], [tr('1 of 2? aan het woord', '1 or 2? gets the floor')], [tr('vuistregel, trainingen', 'a training rule of thumb'), 'pm-mute']]));
    if (b >= 5) o.obeya = op(B * at(b, p, 5), lines(312, [[tr('obeya op grote schaal', 'an obeya at scale'), b === 5 ? 'pm-on' : 'pm-big'], [tr('valkuil: niemand zegt', 'pitfall: nobody says'), 'pm-mute'], [tr('dat het niet past', 'it does not fit'), 'pm-mute']]));
    return o;
  }

  // s6: one team's capacity and objectives
  function s6(b) {
    const o = { head: [tr('één team', 'one team'), EX] };
    o.cap120 = box(54, tr('4 × 30 = 120 punten', '4 × 30 = 120 points'), [[tr('story points: relatief', 'story points: relative'), 'pm-mute']], b === 0);
    if (b >= 1) o.free = lines(150, [[tr('20% vrij: 120 × 0,8', '20% free: 120 × 0.8'), b === 1 ? 'pm-on' : 'pm-big'], [tr('= 96 punten te plannen', '= 96 points to plan')]]);
    if (b >= 2) o.o1 = lines(206, [[tr('punten (waarde):', 'points (value):'), 'pm-mute'], [tr('storing, 1 tik: 40 (9)', 'stop, 1 tap: 40 (9)'), b === 2 ? 'pm-on' : 'pm-txt'], [tr('rapport/ploeg: 35 (6)', 'shift report: 35 (6)'), b === 2 ? 'pm-on' : 'pm-txt']]);
    if (b >= 3) o.o2 = lines(284, [[tr('MES-koppeling: 30 (7)', 'MES link: 30 (7)'), b === 3 ? 'pm-on' : 'pm-txt'], [tr('samen 105 > 96', 'together 105 > 96'), 'pm-big']]) + (b >= 4 ? cross(X1 - 14, 277) : '');
    if (b >= 4) o.commit = lines(342, [[tr('MES: uncommitted;', 'MES: uncommitted;'), 'pm-on'], [tr('beloofd 40 + 35 = 75', 'committed 40 + 35 = 75'), 'pm-on']]);
    return o;
  }

  // s7: the RTE; Product Management, the ART Backlog, the feature; the PO
  function s7(b, p) {
    const o = { head: [tr('de rollen', 'the roles'), DIA] };
    const A = page(b, p, 0, 3);
    o.rtec = op(A, box(54, 'Release Train Engineer', [tr('RTE: dienend leider', 'RTE: servant leader'), tr('en coach van de trein', 'and coach of the train')], b === 0));
    if (b >= 1) o.rtedo = op(A * at(b, p, 1), lines(174, [[tr('begeleidt PI Planning', 'facilitates PI Planning')], [tr('en events; obstakels', 'and events; clears')], [tr('weg; stuurt op flow', 'impediments; flow')]]));
    if (b >= 2) o.rtenot = op(A * at(b, p, 2), box(256, tr('geen baas', 'no boss'), [tr('deelt geen taken uit', 'hands out no tasks'), [tr('valkuil: oud-programma-', 'pitfall: an ex-programme'), 'pm-mute'], [tr('manager', 'manager'), 'pm-mute']], b === 2) + cross(X1 - 14, 278));
    const B = page(b, p, 3, 5);
    if (b >= 3) o.pmc = op(B, box(54, 'Product Management', [tr('gewenst, haalbaar en', 'desirable, feasible'), tr('levensvatbaar?', 'and viable?')], b === 3));
    if (b >= 4) o.backlog = op(B * at(b, p, 4), box(184, 'ART Backlog', [tr('features voor de hele', 'features for the whole'), tr('trein, geordend', 'train, in order')], b === 4));
    const Cp = page(b, p, 5, -1);
    if (b >= 5) o.feat = op(Cp, box(54, 'feature', [tr('past in één PI,', 'fits in one PI,'), tr('waarde voor gebruiker', 'value for a user')], b === 5));
    if (b >= 6) o.poc = op(Cp * at(b, p, 6), box(184, 'Product Owner', [tr('bij één team:', 'with one team:'), tr('features → user stories', 'features → user stories'), tr('ordent teambacklog', 'orders team backlog')], b === 6));
    return o;
  }

  // s8: content authority, the System Architect, the Scrum Master; names; the
  // strong PO; the question
  function s8(b, p) {
    const o = { head: [tr('wie beslist', 'who decides'), DIA] };
    const A = page(b, p, 0, 3);
    o.ca = op(A, box(54, 'content authority', [tr('PM: markt en klant', 'PM: market, customer'), tr('PO: team en details', 'PO: team and details'), [tr('nauw samenwerken', 'working closely'), 'pm-mute']], b === 0));
    if (b >= 1) o.sa = op(A * at(b, p, 1), box(192, 'System Architect', [tr('technische samenhang:', 'technical coherence:'), tr('interfaces, enablers', 'interfaces, enablers')], b === 1));
    if (b >= 2) o.smc = op(A * at(b, p, 2), lines(320, [[tr('Scrum Master: in 6.0', 'Scrum Master: in 6.0'), b === 2 ? 'pm-on' : 'pm-big'], [tr('ook Team Coach', 'also Team Coach')]]));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.names = op(B, box(54, tr('let op namen', 'watch the names'), [tr('"productmanager" bij een', '"product manager" at a'), tr('machinebouwer: vaak', 'machine builder: often'), [tr('marketing en verkoop', 'marketing and sales'), 'pm-mute']], b === 3));
    if (b >= 4) o.po2 = op(B * at(b, p, 4), box(196, tr('sterke PO', 'a strong PO'), [tr('mandaat en tijd', 'mandate and time'), [tr('1 dag/week? gokken', '1 day a week? guessing'), 'pm-mute']], b === 4));
    if (b >= 5) o.ask2 = op(B * at(b, p, 5), lines(326, [[tr('vraag: team 3 vs. PM:', 'ask: team 3 vs. PM:'), b === 5 ? 'pm-on' : 'pm-big'], [tr('wie beslist, hoe snel?', 'who decides, how fast?')]]));
    return o;
  }

  // s9: the weighing-systems maker, the faded example and its reveal
  function s9(b, p) {
    const o = { head: [tr('weegsystemen', 'scales maker'), EX] };
    const A = page(b, p, 0, 3);
    o.weigh = op(A, lines(72, [[tr('trein van zes teams', 'a train of six teams'), b === 0 ? 'pm-on' : 'pm-big'], [tr('een week meekijken', 'a week of watching'), 'pm-mute']]));
    if (b >= 1) o.ex1 = op(A * at(b, p, 1), box(118, 'RTE', [tr('oud-projectmanager:', 'ex-project manager:'), tr('takenlijst ma, check vr', 'task list Mon, check Fri')], b === 1));
    if (b >= 2) o.ex2 = op(A * at(b, p, 2), box(234, 'Product Management', [tr('één persoon, ook', 'one person, also an'), tr('accountmanager;', 'account manager;'), [tr('ART Backlog: 9 mnd oud', 'ART Backlog: 9 months'), 'pm-on']], b === 2));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.ex3 = op(B, box(54, 'PO', [tr('3 van 6 teams: één PO,', '3 of 6 teams: one PO,'), tr('2 middagen per week', '2 afternoons a week'), [tr('mis of te dun?', 'wrong or too thin?'), 'pm-on']], b === 3));
    if (b >= 4) o.rev = op(B * at(b, p, 4), lines(198, [[tr('RTE: taken, geen coach', 'RTE: tasks, no coaching')], [tr('PM: geen tijd, geen orde', 'PM: no time, no order')], [tr('PO: te dun → gokken', 'PO: too thin → guessing')]]));
    if (b >= 5) o.prop = op(B * at(b, p, 5), box(262, tr('voorstel', 'proposal'), [tr('RTE coachen · PM vrij', 'coach RTE · free up PM'), [tr('PO per team, of minder', 'a PO per team, or fewer'), 'pm-on'], [tr('teams tegelijk', 'teams at once'), 'pm-on']], true));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the board
  // A beat's state: c cards shown (the first c of C.CARDS), s strings shown,
  // r the ROAM step (0 none, 1 risks up, 2 sorted), h the highlighted row; a
  // pair [from, to] plays over the beat.
  const val = (v, p) => (Array.isArray(v) ? lerp(v[0], v[1], span(p, 0.08, 0.85)) : v);
  function stateOf(si, b, p) {
    const s = C.BOARD[si];
    const e = s[Math.min(b, s.length - 1)];
    return { c: val(e.c, p), s: val(e.s, p), r: val(e.r, p), h: e.h };
  }
  function board(si, b, p) {
    const S = stateOf(si, b, p);
    let cards = '';
    C.CARDS.forEach(([x, y], i) => {
      const a = clamp(S.c - i, 0, 1);
      if (a <= 0.01) return;
      cards += op(a, rect(x, y, C.CARD.w, C.CARD.h, 'pm-note', 1));
    });
    let str = '';
    C.STRINGS.forEach(([i, j], n) => {
      const a = clamp(S.s - n, 0, 1);
      if (a <= 0.01) return;
      const [x0, y0] = C.CARDS[i];
      const [x1, y1] = C.CARDS[j];
      const ax = x0 + C.CARD.w;
      const ay = y0 + C.CARD.h / 2;
      const bx = x1;
      const by = y1 + C.CARD.h / 2;
      const mx = lerp(ax, bx, 0.5);
      const ex = lerp(ax, bx, a);
      const ey = lerp(ay, by, a);
      str += `<path class="pm-red" d="M${f1(ax)} ${f1(ay)}Q${f1(mx)} ${f1(Math.max(ay, by) + 6)} ${f1(ex)} ${f1(ey)}"/>`
        + `<circle class="pm-blk" cx="${f1(ax)}" cy="${f1(ay)}" r="1"/>` + (a > 0.98 ? `<circle class="pm-blk" cx="${f1(bx)}" cy="${f1(by)}" r="1"/>` : '');
    });
    // ROAM: four risk notes, up in the header row, then sorted into the quadrants
    let roam = '';
    if (S.r > 0.01) {
      for (let q = 0; q < 4; q++) {
        const up = [C.RM.x0 + 3 + q * ((C.RM.x1 - C.RM.x0 - 8) / 4), C.GR.top - 9];
        const to = [C.RM.x0 + (q % 2) * C.RMW + C.RMW / 2 - 5, C.RM.top + Math.floor(q / 2) * 34 + 12];
        const t = clamp(S.r - 1, 0, 1);
        roam += op(clamp(S.r, 0, 1), rect(lerp(up[0], to[0], t), lerp(up[1], to[1], t), 9, 7, 'pm-risk', 1));
      }
    }
    let row = '';
    if (S.h >= 0) row = rect(C.GR.x0 - 15, C.GR.top + S.h * C.RH + 0.6, C.GR.x1 - C.GR.x0 + 15, C.RH - 1.2, 'pm-rowon', 1);
    return { cards, str, roam, row };
  }
  function weeks(si, b, p) {
    const e = C.WEEKS[si][Math.min(b, C.WEEKS[si].length - 1)];
    const [w0, w1] = Array.isArray(e) ? e : [e, e];
    const n = lerp(w0, w1, span(p, 0.1, 0.9));
    let s = '';
    for (let i = 0; i < C.CELLS.length; i++) {
      const fa = clamp(n - i, 0, 1);
      if (fa <= 0.01) continue;
      const [x0, y0, x1, y1] = C.CELLS[i];
      s += op(fa, rect(x0 + 1.5, y0 + 1.5, x1 - x0 - 3, y1 - y0 - 3, i === 4 ? 'pm-note2' : 'pm-blk', 1));
    }
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    const bd = board(si, b, p);
    set(E.bCards, bd.cards);
    set(E.bStr, bd.str);
    set(E.bRoam, bd.roam);
    set(E.bRow, bd.row);
    set(E.cMarks, weeks(si, b, p));
  }

  return { render };
})();
