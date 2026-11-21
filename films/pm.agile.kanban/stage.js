// The stage of the film "Flow op een kanbanbord / Flow on a kanban board": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and
// a preamble from build.mjs that defines C (the panel's blocks, the board's
// columns and card states, the limits, the week strip, the helper's walk), CAM
// (one camera move per scene), W and H. Moves are placed per Dutch caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. The panel at the right gets one card per scene, each block in
// its own cue group (o[key] goes into data-k "p_<key>"), all text at 22 units
// (a video film); a card that needs more room turns a page within its scene.
// The kanban board on the back wall has five columns; its cards move between
// them per beat (C.BOARD, made in build.mjs), with flags for blocked (a red
// sticker), ageing (a dark card), faint (counted, not named) and tracked (the
// accent card). The header strip of a column shows its WIP limit as slots,
// filled by the cards in it, and turns to the accent colour when the column is
// full. Left of the board, on the wall, the queue of requests that wait before
// the board; on the side wall a strip of eight weeks.
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
  const sticker = (x, y) => `<circle class="pm-red" cx="${f1(x)}" cy="${f1(y)}" r="7"/>`;

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
  // s1: Toyota's card and bin, pull, knowledge work; the Kanban Guide's definition
  function s1(b, p) {
    const o = { head: ['Kanban', DIA] };
    const A = page(b, p, 0, 3);
    let bin = rect(X0 + 4, 110, 112, 44, 'pm-card', 4);
    for (let i = 0; i < 5; i++) bin += `<circle class="pm-ring" cx="${X0 + 18 + i * 21}" cy="132" r="8"/>`;
    bin += rect(X0 + 70, 84, 34, 44, 'pm-hot', 3) + path(`M${X0 + 76} 98h22M${X0 + 76} 108h22M${X0 + 76} 118h14`, 'pm-line');
    o.toyota = op(A, txt(X0, 72, tr('Toyota · Taiichi Ohno', 'Toyota · Taiichi Ohno'), 'pm-big') + bin
      + lines(118, [[tr('kaart bij', 'a card with'), 'pm-txt'], [tr('een bak', 'a bin'), 'pm-txt']], X0 + 132));
    if (b >= 1) o.pull = op(A * at(b, p, 1), lines(196, [[tr('bak leeg → kaart terug', 'bin empty → card back')], [tr('= maak bij', '= make more')], [tr('verbruik trekt: pull', 'use pulls: pull'), 'pm-on'], [tr('geen overproductie', 'no overproduction'), 'pm-mute']]));
    if (b >= 2) o.anderson = op(A * at(b, p, 2), lines(306, [[tr('kenniswerk: stroom', 'knowledge work: flow'), 'pm-big'], [tr('zichtbaar en sturen', 'visible, and steered')], [tr('Anderson: vanaf 2004,', 'Anderson: from 2004,'), 'pm-mute']]));
    if (b >= 2) o.anderson += op(A * at(b, p, 2), txt(X0, 384, tr('boek 2010', 'book 2010'), 'pm-mute'));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.guide = op(B, box(54, 'Kanban Guide 2020', [tr('strategie: de stroom', 'a strategy: optimise'), tr('van waarde door een', 'the flow of value'), tr('proces optimaliseren', 'through a process'), [tr('visueel, met pull', 'visual, pull-based'), 'pm-on']], true));
    return o;
  }

  // s2: the board and the work item; start where you are; the Definition of
  // Workflow; blocked cards and the andon
  function s2(b, p) {
    const o = { head: [tr('kanbanbord', 'Kanban board'), DIA] };
    const A = page(b, p, 0, 2);
    o.cols = op(A, lines(80, [[tr('een kolom per stap:', 'a column per step:'), b === 0 ? 'pm-on' : 'pm-big'], [tr('te doen · analyse', 'to do · analysis')], [tr('bouwen · testen', 'build · test')], [tr('klaar', 'done')]]));
    if (b >= 1) o.item = op(A * at(b, p, 1), box(196, tr('werkitem = kaart', 'work item = card'), [tr('een wens, een storing', 'a request, a fault'), tr('schuift naar rechts →', 'moves to the right →')], b === 1));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.start = op(B, box(54, tr('begin waar je bent', 'start where you are'), [tr('teken het werk zoals', 'draw the work as it'), tr('het echt loopt', 'really flows'), [tr('niet zoals op papier', 'not as on paper'), 'pm-mute'], [tr('geen vaste rollen of', 'no fixed roles or'), 'pm-mute'], [tr('sprints; ook naast Scrum', 'sprints; fine with Scrum'), 'pm-mute']], b === 2));
    if (b >= 3) o.dow = op(B * at(b, p, 3), lines(258, [['Definition of Workflow', b === 3 ? 'pm-on' : 'pm-big'], [tr('wat is een werkitem?', 'what is a work item?')], [tr('begin en klaar, stappen', 'start, done, steps')], [tr('WIP-grens, regels', 'WIP limits, rules')], [tr('hoe lang meestal?', 'how long, usually?')]]));
    const Cp = page(b, p, 4, -1);
    if (b >= 4) o.blk = op(Cp, box(54, tr('geblokkeerd', 'blocked'), [tr('wacht op leverancier,', 'waits on a supplier,'), tr('besluit, testomgeving', 'decision, test system'), [tr('rode sticker', 'red sticker'), 'pm-on'], tr('goudmijn: waar het', 'gold mine: where the'), tr('systeem hapert', 'system stutters')], b === 4) + sticker(X1 - 12, 76));
    if (b >= 5) o.andon = op(Cp * at(b, p, 5), box(240, tr('Lean-blik', 'Lean view'), [tr('visueel managementbord', 'visual management board'), tr('geblokkeerd = andon:', 'blocked = andon:'), [tr('de lijn staat stil', 'the line has stopped'), 'pm-on']], b === 5));
    return o;
  }

  // s3: the honest difference and the mistake; then the machine builder
  function s3(b, p) {
    const o = { head: [tr('machinebouwer', 'machine builder'), b >= 2 ? EX : DIA] };
    const A = page(b, p, 0, 2);
    o.diff = op(A, box(54, tr('anders dan Toyota', 'unlike Toyota'), [tr('daar: standaarddeel', 'there: a standard part'), tr('hier: elk item anders', 'here: every item differs'), [tr('kaart = werk,', 'card = work,'), 'pm-on'], [tr('geen voorraad', 'not stock'), 'pm-on']], b === 0));
    if (b >= 1) o.mistake = op(A * at(b, p, 1), box(216, tr('fout: geen grens', 'mistake: no limit'), [tr('takenlijst aan de muur,', 'a to-do list on a wall,'), tr('nog geen pullsysteem', 'not yet a pull system'), [tr('begonnen? klaar?', 'started? done?'), 'pm-on']], b === 1) + cross(X1 - 14, 240));
    const B = page(b, p, 2, 5);
    if (b >= 2) o.mb = op(B, lines(72, [[tr('whiteboard, 40 losse', 'whiteboard, 40 loose'), b === 2 ? 'pm-on' : 'pm-big'], [tr('post-its: wat loopt er?', 'notes: what’s running?')]]));
    if (b >= 3) o.cols5 = op(B * at(b, p, 3), lines(140, [[tr('aangevraagd', 'requested')], [tr('ontwerp', 'design')], [tr('controle (2e engineer)', 'check (2nd engineer)')], [tr('wacht op klant', 'waiting for customer')], [tr('vrijgegeven', 'released')]]));
    if (b >= 4) o.count = op(B * at(b, p, 4), lines(282, [[tr('ontwerp 12 · wacht 9', 'design 12 · waiting 9'), 'pm-big'], [tr('6 al > 3 weken', '6 for > 3 weeks'), 'pm-on'], [tr('19 in andere kolommen,', '19 in other columns,'), 'pm-mute'], [tr('verdeling: voorbeeld', 'split: illustrative'), 'pm-mute']]));
    const Cp = page(b, p, 5, -1);
    if (b >= 5) {
      o.blk4 = op(Cp, box(54, tr('4 geblokkeerd', '4 blocked'), [tr('klantspecificatie mist', 'no customer spec')], true) + sticker(X1 - 12, 76)
        + box(166, tr('afspraak', 'agreement'), [tr('begonnen: engineer', 'started: an engineer'), tr('pakt de kaart', 'takes the card'), tr('klaar: de tekening', 'done: the drawing'), tr('is vrijgegeven', 'is released')]));
    }
    return o;
  }

  // s4: WIP and the WIP limit; context switching, and work lying idle
  function s4(b, p) {
    const o = { head: ['WIP', DIA] };
    const A = page(b, p, 0, 2);
    o.wip = op(A, box(54, 'WIP: work in progress', [tr('begonnen, niet af', 'started, not done'), [tr('= onderhanden werk', 'same term in a factory'), 'pm-mute'], tr('kost geld, verbergt', 'costs money, hides'), tr('problemen, vertraagt', 'problems, slows down')], b === 0));
    if (b >= 1) o.lim = op(A * at(b, p, 1), box(216, tr('WIP-limiet', 'WIP limit'), [tr('maximum per kolom', 'a maximum per column'), tr('of hele systeem', 'or the whole system'), [tr('testen: hooguit 2', 'test: at most 2'), 'pm-on'], [tr('vol? niets nieuws', 'full? nothing new'), 'pm-mute']], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.switch = op(B, box(54, tr('contextwisseling', 'context switching'), [tr('5 dingen tegelijk:', '5 things at once:'), tr('steeds schakelen', 'switching all day'), [tr('Weinberg 1992: ±20%', 'Weinberg 1992: ~20%'), 'pm-on'], [tr('per extra project', 'per extra project'), 'pm-on'], [tr('schatting, geen meting', 'an estimate, not data'), 'pm-mute']], b === 2));
    if (b >= 3) o.idle = op(B * at(b, p, 3), box(244, tr('belangrijker', 'more important'), [tr('elk item ligt langer', 'each item sits idle'), tr('stil; iedereen druk,', 'longer; all are busy,'), [tr('de klant wacht', 'the customer waits'), 'pm-on']], b === 3));
    return o;
  }

  // s5: swarming; the starting number; the buffer and the bottleneck; mistakes
  // and one limit for the whole system
  function s5(b, p) {
    const o = { head: [tr('kolom vol', 'column full'), DIA] };
    const A = page(b, p, 0, 2);
    o.swarm = op(A, box(54, 'swarming', [tr('kolom vol? niets', 'column full? nothing'), tr('nieuws: help rechts', 'new: help finish'), tr('afmaken, samen', 'further right, together'), [tr('één item', 'one item'), 'pm-on']], b === 0));
    if (b >= 1) o.own = op(A * at(b, p, 1), box(216, tr('bijvoorbeeld', 'for example'), [tr('ontwikkelaar test mee,', 'a developer tests,'), tr('engineer doet controle', 'an engineer checks'), [tr('onwennig, maar het', 'feels odd, but the'), 'pm-on'], [tr('team levert meer', 'team delivers more'), 'pm-on']], b === 1));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.startn = op(B, box(54, tr('startgetal', 'starting number'), [tr('± mensen in de stap,', '~ people in the step,'), tr('of iets minder;', 'or a few fewer;'), tr('dan bijstellen', 'then adjust'), [tr('te ruim: niets', 'too loose: no change'), 'pm-mute'], [tr('te krap: wachten', 'too tight: waiting'), 'pm-mute']], b === 2));
    if (b >= 3) o.buffer = op(B * at(b, p, 3), box(242, tr('Lean-blik', 'Lean view'), [tr('supermarkt, vaste', 'a supermarket, a fixed'), tr('buffer', 'buffer'), [tr('ophoping = bottleneck', 'pile-up = bottleneck'), 'pm-on']], b === 3));
    const Cp = page(b, p, 4, -1);
    if (b >= 4) o.errs = op(Cp, box(54, tr('fouten', 'mistakes'), [tr('oprekken bij drukte', 'stretched when busy'), tr('per persoon, niet stap', 'per person, not step'), tr('geen afspraak bij vol', 'no rule for a full one')], b === 4) + cross(X1 - 14, 76));
    if (b >= 5) o.sys = op(Cp * at(b, p, 5), box(192, tr('discussie', 'debate'), [tr('één limiet voor het', 'one limit for the'), tr('hele systeem: simpeler', 'whole system: simpler'), [tr('vraag: klaar, en de', 'ask: done, and the'), 'pm-on'], [tr('volgende kolom vol?', 'next column is full?'), 'pm-on']], b === 5));
    return o;
  }

  // s6: the dairy plant's IT team
  function s6(b, p) {
    const o = { head: [tr('zuivelfabriek', 'dairy plant'), EX] };
    const A = page(b, p, 0, 2);
    o.dairy = op(A, box(54, tr('IT-team van 5', 'IT team of 5'), [tr('15 items onderhanden', '15 items in progress'), tr('3 per persoon', '3 per person'), [tr('6 weken per wens', '6 weeks per request'), 'pm-on']], b === 0));
    if (b >= 1) o.lims = op(A * at(b, p, 1), lines(220, [[tr('WIP-limieten:', 'WIP limits:'), 'pm-mute'], [tr('bouwen ≤ 4', 'build ≤ 4'), b === 1 ? 'pm-on' : 'pm-big'], [tr('testen ≤ 2', 'test ≤ 2'), b === 1 ? 'pm-on' : 'pm-big']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.week1 = op(B, box(54, tr('week 1: testen vol', 'week 1: test full'), [tr('5e in bouwen? nee,', '5th in build? no,'), tr('hij helpt testen', 'he helps test'), [tr('zelfde dag 1 klaar', 'one done that day'), 'pm-on']], b === 2));
    if (b >= 3) o.after6 = op(B * at(b, p, 3), box(204, tr('na 6 weken', 'after 6 weeks'), [tr('6 tegelijk, niet 15', '6 at once, not 15'), [tr('± 2,5 week per wens', '~2.5 weeks a request'), 'pm-on']], true));
    return o;
  }

  // s7: the four flow measures; the trap in the words; lead time
  function s7(b, p) {
    const o = { head: [tr('flowmaten', 'flow measures'), DIA] };
    const A = page(b, p, 0, 3);
    o.tp = op(A, txt(X0, 72, tr('Kanban Guide: minimaal 4', 'Kanban Guide: at least 4'), 'pm-mute') + box(90, 'WIP · throughput', [tr('items af per week', 'items done per week')], b === 0));
    if (b >= 1) o.age = op(A * at(b, p, 1), box(172, 'work item age', [tr('onaf item: hoe lang', 'unfinished: how long'), tr('al onderweg', 'under way so far')], b === 1));
    if (b >= 2) o.ct = op(A * at(b, p, 2), box(280, 'cycle time', [tr('begin → klaar, afgerond', 'start → done, finished'), [tr('punten: je afspraak', 'points: your agreement'), 'pm-mute']], b === 2));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.trap = op(B, box(54, tr('valkuil: woorden', 'trap: the words'), [tr('Lean: cyclustijd =', 'Lean: cycle time ='), tr('tijd per stuk, 45 s', 'time per unit, 45 s'), [tr('Kanban: begin → klaar', 'Kanban: start → done'), 'pm-on'], [tr('fabriek: doorlooptijd', 'factory: throughput time'), 'pm-mute']], b === 3));
    if (b >= 4) o.lt = op(B * at(b, p, 4), box(216, 'lead time', [tr('vanaf de aanvraag,', 'from the request,'), tr('met wachten vooraf', 'waiting included'), [tr('spreek af wat je', 'agree which one'), 'pm-on'], [tr('bedoelt', 'you mean'), 'pm-on']], b === 4));
    return o;
  }

  // s8: Little's law, its example, halving; its conditions, Vacanti, the spread
  function s8(b, p) {
    const o = { head: [tr('wet van Little', 'Little’s law'), DIA] };
    const A = page(b, p, 0, 3);
    o.little = op(A, rect(X0 - 6, 52, CW + 12, 110, b === 0 ? 'pm-hot' : 'pm-dash', 8) + lines(76, [['John Little, 1961', 'pm-mute'], ['cycle time =', 'pm-big'], [tr('WIP ÷ throughput', 'WIP ÷ throughput'), 'pm-big'], [tr('gemiddeld', 'on average'), 'pm-mute']], X0 + 4));
    if (b >= 1) o.ex12 = op(A * at(b, p, 1), box(170, tr('12 onderhanden', '12 in progress'), [tr('3 per week af', '3 a week done'), [tr('→ gemiddeld 4 weken', '→ 4 weeks on average'), 'pm-on'], [tr('fabriek: hetzelfde', 'factory: the same'), 'pm-mute'], [tr('periode, niet één item', 'a period, not one item'), 'pm-mute']], b === 1));
    if (b >= 2) o.half = op(A * at(b, p, 2), lines(372, [[tr('WIP ÷ 2 → tijd ÷ 2', 'WIP ÷ 2 → time ÷ 2'), 'pm-on']]));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.stable = op(B, box(54, tr('voorwaarde: stabiel', 'condition: stable'), [tr('in = uit, gemiddeld', 'in = out, on average'), tr('WIP begin ≈ eind', 'WIP start ≈ end'), [tr('stapel groeit? dan', 'pile growing? then'), 'pm-mute'], [tr('klopt de som niet', 'the sum fails'), 'pm-mute']], b === 3));
    if (b >= 4) o.vacanti = op(B * at(b, p, 4), box(212, 'Vacanti', [tr('verband achteraf,', 'averages after the fact,'), tr('geen voorspelmachine', 'no forecasting machine')], b === 4));
    if (b >= 5) o.spread = op(B * at(b, p, 5), lines(332, [[tr('minder WIP: korter', 'less WIP: shorter'), 'pm-txt'], [tr('kijk naar de spreiding', 'look at the spread'), 'pm-on'], [tr('klok: begin en eind?', 'clock: start and stop?'), 'pm-txt']]));
    return o;
  }

  // s9: the office-furniture maker, the faded example and its reveal
  function s9(b, p) {
    const o = { head: [tr('meubelfabriek', 'furniture maker'), EX] };
    const A = page(b, p, 0, 2);
    o.furn = op(A, box(54, tr('8 weken gemeten', '8 weeks measured'), [tr('12 onderhanden', '12 in progress'), tr('3 per week uit, 3 in', '3 a week out, 3 in'), [tr('stabiel', 'stable'), 'pm-on']], b === 0));
    if (b >= 1) o.calc4 = op(A * at(b, p, 1), box(190, tr('12 ÷ 3 = 4 weken', '12 ÷ 3 = 4 weeks'), [tr('gemeten 4,2: klopt', 'measured 4.2: a match'), [tr('plantmanager: te', 'plant manager: too'), 'pm-mute'], [tr('lang voor kleine wensen', 'long for small requests'), 'pm-mute']], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.calc2 = op(B, box(54, tr('WIP-limiet 6', 'WIP limit 6'), [tr('nog 3 per week af', 'still 3 a week done'), [tr('6 ÷ 3 = 2 weken', '6 ÷ 3 = 2 weeks'), 'pm-on']], b === 2));
    if (b >= 3) o.watch = op(B * at(b, p, 3), box(160, tr('bewaak', 'watch'), [tr('throughput blijft 3', 'throughput stays 3'), tr('geen werk naast bord', 'no work off the board'), [tr('meet na 4 weken', 'measure after 4 weeks'), 'pm-mute']], b === 3));
    if (b >= 4) o.queue = op(B * at(b, p, 4), box(288, tr('instroom > 3 per week?', 'arrivals > 3 a week?'), [tr('rij vóór bord groeit,', 'the queue grows, seen'), [tr('zit in de lead time', 'in lead time, not cycle'), 'pm-on']], b === 4));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the board
  // A beat's state: "cols|flags", one character per card; cols: 0-4 a column,
  // . hidden, s scattered (the loose notes), q in the queue left of the board;
  // flags: b blocked, a ageing, f faint, h tracked, space none. A beat may hold
  // a list of states, played one after the other over the beat.
  const N = C.N;
  const parse = (s) => { const [c, f = ''] = s.split('|'); return { c, f: f.padEnd(N, ' ') }; };
  function stateAt(si, b, p) {
    const s = C.BOARD[si];
    const e = s[Math.min(b, s.length - 1)];
    const list = Array.isArray(e) ? e : [e];
    const k = Math.min(list.length - 1, Math.floor(p * list.length));
    const lp = p * list.length - k;
    let was;
    if (k > 0) was = list[k - 1];
    else if (b > 0) { const pe = s[Math.min(b - 1, s.length - 1)]; was = Array.isArray(pe) ? pe[pe.length - 1] : pe; } else if (si > 0) { const ps = C.BOARD[si - 1]; const pe = ps[ps.length - 1]; was = Array.isArray(pe) ? pe[pe.length - 1] : pe; } else was = list[0];
    return { now: parse(list[k]), was: parse(was), t: span(list.length > 1 ? lp : p, list.length > 1 ? 0.1 : 0.15, list.length > 1 ? 0.7 : 0.6) };
  }
  function spot(st, i) {
    const c = st.c[i];
    if (c === '.' || c === undefined) return null;
    if (c === 's') return C.SC[i];
    let j = 0;
    for (let n = 0; n < i; n++) if (st.c[n] === c) j++;
    if (c === 'q') return [C.Q.x0, -C.BA.z1 + 17 + j * 13];
    const col = C.COLS[Number(c)];
    return [col.x0 + 2 + (j % 2) * (C.CARD.w + 2), -C.BA.z1 + 17 + Math.floor(j / 2) * C.CARD.py];
  }
  function board(si, b, p) {
    const { now, was, t } = stateAt(si, b, p);
    let s = '';
    for (let i = 0; i < N; i++) {
      const a = spot(was, i);
      const z = spot(now, i);
      let pos;
      let alpha = 1;
      if (z && a) pos = [lerp(a[0], z[0], t), lerp(a[1], z[1], t)];
      else if (z) { pos = z; alpha = t; } else if (a) { pos = a; alpha = 1 - t; } else continue;
      const fl = (t > 0.5 ? now : was).f[i];
      if (fl === 'f') alpha *= 0.45;
      if (alpha <= 0.01) continue;
      const cls = fl === 'h' ? 'pm-note2' : fl === 'a' ? 'pm-old' : 'pm-note';
      s += op(alpha, rect(pos[0], pos[1], C.CARD.w, C.CARD.h, cls, 1) + (fl === 'b' ? `<circle class="pm-red" cx="${f1(pos[0] + C.CARD.w - 3)}" cy="${f1(pos[1] + 3)}" r="2.6"/>` : ''));
    }
    return s;
  }
  // limits: "LLLLL" digits per column (0 none), or "sN": one limit N on the
  // columns in progress (1 to 3)
  function limits(si, b, p) {
    const L = C.LIM[si][Math.min(b, C.LIM[si].length - 1)];
    const prev = b > 0 ? C.LIM[si][Math.min(b - 1, C.LIM[si].length - 1)] : L;
    const a = L === prev ? 1 : span(p, 0.05, 0.3);
    if (!L || L === '00000') return '';
    const { now } = stateAt(si, b, p);
    const count = (c) => [...now.c].filter((x) => x === String(c)).length;
    const y = -C.BA.z1 + 3;
    let s = '';
    const slots = (x0, x1, n, filled) => {
      const w = Math.min(7, (x1 - x0 - 4) / n - 1.5);
      let out = '';
      for (let k = 0; k < n; k++) out += rect(x0 + 2 + k * (w + 1.5), y + 1.5, w, 7, k < filled ? 'pm-blk' : 'pm-slot', 1);
      return out;
    };
    if (L[0] === 's') {
      const n = Number(L.slice(1));
      const x0 = C.COLS[1].x0;
      const x1 = C.COLS[3].x1;
      const c = count(1) + count(2) + count(3);
      s += rect(x0, y - 1, x1 - x0, 12, c >= n ? 'pm-full' : 'pm-slotbar', 1) + slots(x0 + (x1 - x0) / 2 - n * 4.5, x1, n, c);
    } else {
      for (let k = 0; k < 5; k++) {
        const n = Number(L[k]);
        if (!n) continue;
        const col = C.COLS[k];
        const c = count(k);
        s += rect(col.x0, y - 1, col.x1 - col.x0, 12, c >= n ? 'pm-full' : 'pm-slotbar', 1) + slots(col.x0, col.x1, n, c);
      }
    }
    return op(a, s);
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
      s += op(fa, rect(x0 + 1, y0 + 1, x1 - x0 - 2, y1 - y0 - 2, 'pm-blk', 1));
    }
    return s;
  }
  function helper(si, b, p) {
    const s = C.HELP[si];
    const h1 = s[Math.min(b, s.length - 1)];
    const h0 = b > 0 ? s[Math.min(b - 1, s.length - 1)] : si > 0 ? C.HELP[si - 1][C.HELP[si - 1].length - 1] : h1;
    const h = lerp(h0, h1, span(p, 0.1, 0.6));
    move(E.helper, `translate(${f1(C.HV[0] * h)} ${f1(C.HV[1] * h)})`);
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    set(E.bCards, board(si, b, p));
    set(E.bLim, limits(si, b, p));
    set(E.cMarks, weeks(si, b, p));
    helper(si, b, p);
  }

  return { render };
})();
