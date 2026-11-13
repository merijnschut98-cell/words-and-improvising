// The stage of the film "MoSCoW en een MVP / MoSCoW and an MVP": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C (the panel's blocks, the board's area,
// the bin stacks and the 300-day bar), CAM (one camera move per scene), W and
// H. Moves are placed per Dutch caption beat (beatStarts), so the video's
// narration timing (films/_kit/beatwarp.js) keeps them in step. The panel at
// the right gets one card per scene, each block in its own cue group (o[key]
// goes into data-k "p_<key>"), all text at 22 units (a video film); a card
// that needs more room turns a page within its scene. On the whiteboard: a
// heap of wish notes, the to-be process as a row of five steps with the notes
// hung under them, duplicates fading and notes parked at the bottom right;
// from s5 four bins along the bottom (Must, Should, Could, Won't) with notes
// stacked in them and the MVP cut line between the Must bin and the rest.
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
  const BINS = [['Must have', 'pm-note2'], ['Should have', 'pm-note3'], ['Could have', 'pm-note'], [tr('Won’t have', 'Won’t have'), 'pm-note4']];

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

  // a horizontal bar of days (the 300 person-days, or 100 % of the effort):
  // segments [days, class], scaled to the card width, from y, 30 high
  const bar = (y, segs, total, a = 1) => {
    let x = X0;
    let s = '';
    for (const [d, cls] of segs) {
      const wd = (d / total) * CW;
      s += rect(x, y, wd * a, 30, cls, 2);
      x += wd;
    }
    return s + rect(X0, y, CW, 30, 'pm-dash', 2);
  };
  const xOf = (d, total) => X0 + (d / total) * CW;

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: what a requirement is and what it is the basis for; functional and
  // non-functional, each with its example
  function s1(b, p) {
    const o = { head: ['requirement', DIA] };
    const A = page(b, p, 0, 2);
    o.req = op(A, box(54, 'requirement', [tr('wat het systeem moet', 'what the system must'), tr('doen of zijn, zo dat je', 'do or be, written so'), tr('het later controleert', 'you can check it later')], b === 0));
    if (b >= 1) o.basis = op(A * at(b, p, 1), lines(218, [[tr('de basis voor:', 'the basis for:'), 'pm-big'], [tr('• offerte leverancier', '• the vendor’s quote')], [tr('• de tests', '• the tests')], [tr('• de acceptatie', '• the acceptance')]]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.func = op(B, box(54, tr('functionele eis', 'functional'), [[tr('wat het systeem doet:', 'what the system does:'), 'pm-mute'], tr('“blokkeert een batch', '“blocks a batch that'), tr('die kwaliteit niet', 'quality has not'), tr('heeft vrijgegeven”', 'released”')], b === 2));
    if (b >= 3) o.nonf = op(B * at(b, p, 3), box(218, tr('niet-functionele eis', 'non-functional'), [[tr('hoe goed: snelheid, be-', 'how well: speed, avail-'), 'pm-mute'], [tr('schikbaarheid, beveiliging', 'ability, security'), 'pm-mute'], tr('“etiket print binnen 3 s', '“label prints within 3 s'), tr('na de laatste doos”', 'of the last box”')], b === 3));
    return o;
  }

  // s2: the to-be process first, per step; the wish list from the old system;
  // testable or not; an ID, a source and a priority
  function s2(b, p) {
    const o = { head: [tr('to-be-proces', 'to-be process'), DIA] };
    const A = page(b, p, 0, 3);
    o.tobe = op(A, box(54, tr('eerst het to-be-proces', 'first the to-be process'), [tr('hoe het werk na de', 'how the work runs'), tr('go-live loopt, stap', 'after go-live, step'), tr('voor stap', 'by step')], b === 0));
    if (b >= 1) o.step = op(A * at(b, p, 1), lines(202, [[tr('per stap: wat moet het', 'per step: what must the'), 'pm-big'], [tr('systeem doen?', 'system do?'), 'pm-big']]));
    if (b >= 2) {
      o.wish = op(A * at(b, p, 2), lines(272, [[tr('vanuit oude systeem:', 'from the old system:'), 'pm-mute'], [tr('wensenlijst: alles wat', 'a wish list: all the')], [tr('de oude schermen deden', 'old screens did, plus')], [tr('+ elke ergernis van', 'every irritation of')], [tr('tien jaar', 'ten years')]])
        + cross(X1 - 10, 266));
    }
    const B = page(b, p, 3, 5);
    if (b >= 3) o.testable = op(B, box(54, tr('toetsbaar?', 'testable?'), [tr('“gebruiksvriendelijk”', '“user-friendly”'), [tr('niemand kan zeggen:', 'nobody can say:'), 'pm-mute'], [tr('geslaagd of gezakt', 'pass or fail'), 'pm-mute']], b === 3) + cross(X1 - 14, 108));
    if (b >= 4) o.test30 = op(B * at(b, p, 4), box(212, tr('wél toetsbaar', 'testable'), [tr('na 1 uur training een', 'after 1 hour of training'), tr('lijnstop in < 30 s door', 'a new operator logs a'), tr('een nieuwe operator', 'line stop in < 30 s')], true) + tick(X1 - 12, 238));
    const Cp = page(b, p, 5, -1);
    if (b >= 5) {
      o.ids = op(Cp, box(54, tr('elke regel', 'every line'), [tr('nummer, bv. R-047', 'an ID, e.g. R-047'), tr('bron: wie vroeg erom,', 'source: who asked,'), tr('en waarom', 'and why'), tr('later: prioriteit', 'later: a priority')], true)
        + lines(256, [[tr('nummer komt terug in', 'the ID comes back in'), 'pm-mute'], [tr('testscripts en contract', 'test scripts, contract'), 'pm-mute'], [tr('zo weet je waar een', 'so you can trace where'), 'pm-on'], [tr('regel vandaan komt', 'a line came from'), 'pm-on']]));
    }
    return o;
  }

  // s3: who writes, a solution disguised as a requirement and the real need;
  // what goes wrong, the scope argument, the sharp question
  function s3(b, p) {
    const o = { head: [tr('behoefte', 'the need'), DIA] };
    const A = page(b, p, 0, 1);
    o.who = op(A, box(54, tr('wie schrijft?', 'who writes?'), [tr('planners, operators,', 'planners, operators,'), tr('kwaliteitsmensen', 'quality staff'), [tr('+ een businessanalist:', '+ a business analyst:'), 'pm-on'], [tr('vertaalt business ↔ IT', 'translates between'), 'pm-mute'], [tr('en schrijft het precies', 'business and IT, writes'), 'pm-mute'], [tr('op', 'it down precisely'), 'pm-mute']], b === 0));
    const B = page(b, p, 1, 3);
    if (b >= 1) o.solution = op(B, box(54, tr('een oplossing:', 'a solution:'), [tr('“Excel-export van', '“an Excel export of'), tr('alle orders”', 'all orders”')], b === 1) + cross(X1 - 14, 108));
    if (b >= 2) o.need = op(B * at(b, p, 2), box(176, tr('de echte behoefte', 'the real need'), [tr('planner ziet de orders', 'the planner sees'), tr('van morgen per lijn,', 'tomorrow’s orders per'), tr('met hun materialen', 'line, with materials'), [tr('misschien zonder Excel', 'maybe with no Excel'), 'pm-mute']], true));
    const Cp = page(b, p, 3, -1);
    if (b >= 3) o.wrong = op(Cp, lines(80, [[tr('wat vaak misgaat', 'what often goes wrong'), 'pm-big'], [tr('2 grote workshops', '2 big workshops')], [tr('niet getoetst aan het', 'no check against the')], [tr('to-be-proces', 'to-be process')], [tr('offerte op 300 vage', 'a quote on 300 vague')], [tr('regels', 'lines')]]));
    if (b >= 4) o.scope = op(Cp * at(b, p, 4), lines(240, [[tr('vage regel: later', 'vague line: later'), 'pm-big'], [tr('“was dit in scope?”', '“was this in scope?”')], [tr('scope: de afgesproken', 'scope: the agreed'), 'pm-mute'], [tr('inhoud van het project', 'content of the project'), 'pm-mute']]));
    if (b >= 5) o.askq = op(at(b, p, 5), lines(346, [[tr('welke stap wordt beter?', 'which step gets better?'), 'pm-on'], [tr('niemand? dan gewoonte', 'nobody? then habit,'), 'pm-txt'], [tr('', 'not need'), 'pm-txt']].filter(([t]) => t)));
    return o;
  }

  // s4: the meat products plant, in four steps
  function s4(b, p) {
    const o = { head: [tr('vleeswaren', 'meat products'), EX] };
    const A = page(b, p, 0, 2);
    o.meat = op(A, box(54, tr('vleeswarenfabriek', 'meat products plant'), [tr('nieuw MES: stuurt de', 'new MES: runs the'), tr('orders op de vloer,', 'orders on the floor,'), tr('registreert productie', 'records production'), [tr('3 workshops: planners,', '3 workshops: planners,'), 'pm-mute'], [tr('ploegleiders, kwaliteit', 'shift leaders, quality'), 'pm-mute'], [tr('→ 240 wensen', '→ 240 wishes'), 'pm-on']], b === 0));
    if (b >= 1) o.dup = op(A * at(b, p, 1), step(290, 1, tr('dubbelingen eruit', 'duplicates out'), '240 − 60 = 180', b === 1));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.r031 = op(B, box(54, tr('stap 2: behoefte', 'step 2: a need'), [[tr('“Excel-export” wordt', '“Excel export” becomes'), 'pm-mute'], tr('R-031: planner ziet de', 'R-031: the planner sees'), tr('orders van morgen per', 'tomorrow’s orders per'), tr('lijn, met materialen', 'line, with materials'), tr('en hun voorraad', 'and their stock')], b === 2));
    if (b >= 3) o.r047 = op(B * at(b, p, 3), box(238, tr('stap 3: toetsbaar', 'step 3: testable'), [[tr('“snelle etiketten” →', '“fast labels” →'), 'pm-mute'], tr('R-047, niet-functioneel:', 'R-047, non-functional:'), tr('binnen 3 s, in 95 van', 'within 3 s, in 95 of'), tr('de 100 tests', '100 tests')], b === 3));
    const Cp = page(b, p, 4, -1);
    if (b >= 4) o.park = op(Cp, step(84, 4, tr('toets aan to-be', 'check against to-be'), tr('36 regels, geen stap', '36 lines, no step'), b === 4) + lines(136, [[tr('→ parkeerlijst', '→ parked'), 'pm-on']], X0 + 36));
    if (b >= 5) o.res = op(Cp * at(b, p, 5), box(176, tr('resultaat: 144', 'result: 144'), [[tr('180 − 36 = 144', '180 − 36 = 144'), 'pm-mute'], tr('requirements, elk met', 'requirements, each with'), tr('nummer, bron en test', 'an ID, source and test')], true));
    return o;
  }

  // the four bins, in two rows of two, with their names; hot: the bin lit
  const bins = (y, hot = -1, a = [1, 1, 1, 1]) => BINS.map(([name, cls], i) => {
    const x = X0 + (i % 2) * 146;
    const yy = y + Math.floor(i / 2) * 74;
    const on = hot === i;
    return op(a[i], rect(x, yy, 138, 64, on ? 'pm-hot' : 'pm-card', 6) + rect(x + 8, yy + 40, 30, 14, cls, 1) + rect(x + 44, yy + 40, 30, 14, cls, 1)
      + txt(x + 8, yy + 28, name, on ? 'pm-on' : 'pm-big'));
  }).join('');

  // s5: MoSCoW: the four bins; the o's; Dai Clegg, DSDM, common in ERP/MES
  function s5(b, p) {
    const o = { head: ['MoSCoW', DIA] };
    const A = page(b, p, 0, 2);
    o.moscow = op(A, `<text class="pm-big" x="${X0}" y="80" font-size="22">M<tspan class="pm-mute">o</tspan>SC<tspan class="pm-mute">o</tspan>W: ${esc(tr('vier bakken', 'four bins'))}</text>`
      + bins(98, -1, [0, 1, 2, 3].map((i) => at(b, p, 0, 0.1 + i * 0.12, 0.25 + i * 0.12))) + lines(276, [['Won’t have this time:', 'pm-mute'], [tr('nu niet', 'not now'), 'pm-mute']]));
    if (b >= 1) o.oos = op(A * at(b, p, 1), lines(352, [[tr('de o’s: alleen uitspraak', 'the o’s: only for sound'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.clegg = op(B, box(54, 'Dai Clegg, 1994', [tr('bij Oracle, voor', 'at Oracle, for'), tr('ontwikkelprojecten', 'development projects'), tr('met weinig tijd', 'with little time')], b === 2));
    if (b >= 3) o.dsdm = op(B * at(b, p, 3), lines(206, [[tr('later vast in DSDM:', 'later fixed in DSDM:'), 'pm-big'], [tr('agile projectmethode', 'an agile project method')], [tr('nu: Agile Business', 'now: Agile Business'), 'pm-mute'], ['Consortium', 'pm-mute']]));
    if (b >= 4) o.common = op(B * at(b, p, 4), lines(336, [[tr('gangbaarst in ERP/MES', 'most common in ERP/MES'), 'pm-on'], [tr('om te prioriteren', 'to prioritise'), 'pm-on']]));
    return o;
  }

  // s6: Must have and its test question; Should have; Could have
  function s6(b, p) {
    const o = { head: [tr('drie bakken', 'three bins'), DIA] };
    const A = page(b, p, 0, 2);
    o.must = op(A, box(54, 'Must have', [tr('zonder dit: go-live', 'without it, go-live'), tr('zinloos, onveilig of', 'makes no sense, is'), tr('onwettig', 'unsafe or illegal'), [tr('DSDM: Minimum Usable', 'DSDM: Minimum Usable'), 'pm-mute'], ['SubseT', 'pm-mute']], b === 0, b === 0 ? 'pm-hot' : 'pm-card'));
    if (b >= 1) o.mtest = op(A * at(b, p, 1), box(244, tr('toetsvraag', 'test question'), [tr('ontbreekt dit: stellen', 'missing: do we postpone'), tr('we de go-live uit?', 'go-live?'), [tr('nee, omweg: geen Must', 'workaround? no Must'), 'pm-mute']], true));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.should = op(B, box(54, 'Should have', [tr('belangrijk, maar een', 'important, but a'), tr('tijdelijke omweg kan', 'workaround for a while')], b === 2));
    if (b >= 3) o.could = op(B * at(b, p, 3), box(192, 'Could have', [tr('mooi meegenomen;', 'nice to have;'), tr('valt als eerste af als', 'goes first when time'), tr('de tijd krap wordt', 'runs short')], b === 3));
    return o;
  }

  // s7: Won't have this time on the list; DSDM's rules of thumb as a bar of
  // 100 % of the effort; the Coulds the reserve; all Musts and what breaks
  function s7(b, p) {
    const o = { head: ['Won’t have', DIA] };
    const A = page(b, p, 0, 2);
    o.wont = op(A, box(54, 'Won’t have this time', [tr('afgesproken: nu niet', 'agreed: not now')], b === 0));
    if (b >= 1) o.list = op(A * at(b, p, 1), lines(166, [[tr('toch op de lijst:', 'on the list anyway:'), 'pm-big'], [tr('iedereen ziet: het is', 'everyone sees it was')], [tr('besproken', 'discussed')], [tr('niet via de achterdeur', 'no creeping back in'), 'pm-on'], [tr('terug', 'by the side door'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) {
      o.rules = op(B, lines(76, [[tr('DSDM-vuistregels', 'DSDM’s rules of thumb'), 'pm-big'], [tr('van de inspanning', 'share of the effort'), 'pm-mute']])
        + bar(108, [[60, 'pm-acc'], [20, 'pm-blk2'], [20, 'pm-card']], 100, at(b, p, 2, 0.1, 0.5))
        + txt(X0, 166, tr('Musts ≤ 60%', 'Musts ≤ 60%'), 'pm-big') + txt(X1, 166, tr('Coulds ± 20%', 'Coulds ~20%'), 'pm-big', 'end')
        + path(`M${f1(xOf(60, 100))} 100v46`, 'pm-cut'));
    }
    if (b >= 3) o.reserve = op(B * at(b, p, 3), lines(204, [[tr('Coulds = je reserve', 'Coulds = your reserve'), 'pm-on']]) + path(`M${f1(xOf(90, 100))} 184v-38`, 'pm-line'));
    if (b >= 4) o.breaks = op(B * at(b, p, 4), box(232, tr('alles Must?', 'all Musts?'), [tr('de scope vangt geen', 'the scope absorbs no'), tr('tegenvaller op: datum', 'setback: the date or'), tr('of budget breekt', 'the budget breaks')], true));
    return o;
  }

  // a sorted list as rows, with the MVP cut line under the first k rows
  const sorted = (y, n, k, a = 1) => {
    let s = '';
    for (let i = 0; i < n; i++) s += rect(X0 + 8, y + i * 16, 80, 11, i < k ? 'pm-acc' : 'pm-blk2', 2);
    s += op(a, path(`M${X0} ${f1(y + k * 16 - 3)}H${X0 + 100}`, 'pm-cut') + txt(X0 + 110, y + k * 16 + 4, tr('MVP-lijn', 'MVP cut line'), 'pm-on'));
    return s;
  };

  // s8: the MVP and where it comes from; the looser IT meaning and the cut
  // line; the whole process thin but complete; half of every screen; the Lean
  // view and the Musts that never go; the first Monday
  function s8(b, p) {
    const o = { head: ['MVP', DIA] };
    const A = page(b, p, 0, 2);
    o.mvp = op(A, box(54, 'MVP', ['minimum viable product', [tr('Frank Robinson, 2001', 'Frank Robinson, 2001'), 'pm-mute']], b === 0));
    if (b >= 1) o.ries = op(A * at(b, p, 1), lines(184, [['Eric Ries, The Lean', 'pm-big'], ['Startup (2011):', 'pm-big'], [tr('kleinste versie, het', 'smallest version, the')], [tr('meest leren van echte', 'most learning from real')], [tr('gebruikers', 'users')]]));
    const B = page(b, p, 2, 3);
    if (b >= 2) {
      o.cutline = op(B, lines(80, [[tr('ERP/MES: losser', 'ERP/MES: looser'), 'pm-big'], [tr('kleinste scope om op een', 'smallest scope to go live')], [tr('echte lijn live te gaan', 'on a real line')]])
        + txt(X0, 176, tr('gesorteerde lijst:', 'the sorted list:'), 'pm-mute') + sorted(192, 8, 4, at(b, p, 2, 0.4, 0.6))
        + op(at(b, p, 2, 0.6, 0.8), txt(X0 + 110, 210, tr('erboven: klaar', 'above: ready'), 'pm-txt') + txt(X0 + 110, 236, tr('voor go-live', 'for go-live'), 'pm-txt')));
    }
    const Cp = page(b, p, 3, 5);
    if (b >= 3) {
      const ST = [tr('order erin', 'order in'), tr('produceren', 'produce'), tr('etiketteren', 'label'), tr('verzenden', 'ship'), tr('factureren', 'invoice')];
      let s = txt(X0, 80, tr('dun maar compleet', 'thin but complete'), 'pm-big');
      ST.forEach((t, i) => { s += op(at(b, p, 3, 0.1 + i * 0.1, 0.2 + i * 0.1), rect(X0, 96 + i * 30, 10, 22, 'pm-acc', 2) + txt(X0 + 20, 114 + i * 30, t, 'pm-txt')); });
      o.thin = op(Cp, s + op(at(b, p, 3, 0.65, 0.8), tick(X1 - 14, 180)));
    }
    if (b >= 4) {
      let s = txt(X0, 276, tr('helft van elk scherm:', 'half of every screen:'), 'pm-big');
      for (let i = 0; i < 5; i++) s += rect(X0 + i * 30, 290, 22, 10, 'pm-blk2', 2) + rect(X0 + i * 30, 302, 11, 10, 'pm-blk2', 2);
      o.half = op(Cp * at(b, p, 4), s + txt(X0 + 160, 310, tr('geen MVP', 'no MVP'), 'pm-on') + lines(346, [[tr('daar werkt niemand mee', 'nobody can work with it'), 'pm-mute']]) + cross(X0 + 146, 302));
    }
    const Dp = page(b, p, 5, -1);
    if (b >= 5) o.lean = op(Dp, box(54, tr('Lean: herkenbaar', 'Lean: familiar'), [tr('klein beginnen, eerst', 'start small, learn on'), tr('op één lijn leren', 'one line first'), [tr('maar nooit weg: wette-', 'never trimmed: legal'), 'pm-on'], [tr('lijke en veiligheids-', 'and safety Musts, such'), 'pm-on'], [tr('Musts, zoals traceren', 'as tracing food'), 'pm-on'], [tr('van voedselbatches', 'batches'), 'pm-on']], b === 5));
    if (b >= 6) o.monday = op(Dp * at(b, p, 6), lines(270, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('wat doen we op de eerste', 'what do we do on the'), 'pm-on'], [tr('maandag zonder dit?', 'first Monday without it?'), 'pm-on']]));
    return o;
  }

  // the 300-day bar of the moulder: Musts, Shoulds, Coulds, with the days
  // under each segment and, from k, the cut line after the Musts
  const BB = C.BAR;
  const daysBar = (y, sp, a, lineA = 0) => {
    const segs = [[sp.m, 'pm-acc'], [sp.s, 'pm-blk2'], [sp.c, 'pm-card']];
    const xm = xOf(sp.m, BB.cap);
    const xs = xOf(sp.m + sp.s, BB.cap);
    return bar(y, segs, BB.cap, a)
      + op(a, txt(X0 + 4, y + 56, `M ${sp.m}`, 'pm-big') + txt(xs - 6, y + 56, `S ${sp.s}`, 'pm-big', 'end') + txt(X1, y + 56, `C ${sp.c}`, 'pm-big', 'end'))
      + op(lineA, path(`M${f1(xm)} ${y - 10}v52`, 'pm-cut'));
  };

  // s9: the moulder: 300 days in three bins, the 70 % check, six Musts with
  // a workaround move to Should, the new split and the MVP cut line
  function s9(b, p) {
    const o = { head: [tr('spuitgieterij', 'the moulder'), EX] };
    const A = page(b, p, 0, 3);
    o.case = op(A, lines(76, [[tr('spuitgieterij voor', 'plastics injection'), 'pm-big'], [tr('kunststof, nieuw MES:', 'moulder, new MES:')], [tr('300 mensdagen tot', '300 person-days to')], [tr('de go-live', 'go-live')]]));
    if (b >= 1) {
      o.sort = op(A * at(b, p, 1), txt(X0, 182, tr('40 eisen:', '40 reqs:'), 'pm-mute') + daysBar(194, BB.before, at(b, p, 1, 0.1, 0.5))
        + op(at(b, p, 1, 0.6, 0.8), txt(X0, 282, tr('precies 300: vol', 'exactly 300: full'), 'pm-on')));
    }
    if (b >= 2) {
      const x60 = xOf(0.6 * BB.cap, BB.cap);
      o.check = op(A * at(b, p, 2), path(`M${f1(x60)} 188v42`, 'pm-line') + txt(x60, 182, '60%', 'pm-big', 'middle')
        + lines(320, [[tr('210 / 300 = 70%', '210 / 300 = 70%'), 'pm-big'], [tr('boven de 60% van DSDM', 'above DSDM’s 60%'), 'pm-on']]));
    }
    const B = page(b, p, 3, -1);
    if (b >= 3) o.move = op(B, box(54, tr('stap 2: toetsvraag', 'step 2: test question'), [tr('6 eisen, 45 dagen: een', '6 reqs, 45 days: a'), tr('werkbare omweg, bv. een', 'workable workaround,'), tr('weekrapport met de hand', 'a weekly report by hand'), [tr('→ ze worden Should', '→ they move to Should'), 'pm-on']], b === 3));
    if (b >= 4) {
      o.split = op(B * at(b, p, 4), txt(X0, 222, tr('stap 3:', 'step 3:'), 'pm-mute') + daysBar(232, BB.after, at(b, p, 4, 0.1, 0.5), 0)
        + op(at(b, p, 4, 0.5, 0.7), txt(X0 + 4, 314, '55%', 'pm-txt') + txt(xOf(BB.after.m + BB.after.s, BB.cap) - 6, 314, '25%', 'pm-txt', 'end') + txt(X1, 314, '20%', 'pm-txt', 'end')));
    }
    if (b >= 5) {
      o.line = op(at(b, p, 5), path(`M${f1(xOf(BB.after.m, BB.cap))} 222v52`, 'pm-cut') + txt(X1, 222, 'reserve', 'pm-on', 'end')
        + lines(350, [[tr('MVP-lijn: order tot ver-', 'MVP cut line: order to'), 'pm-on'], [tr('zending op lijn 1', 'shipment on line 1'), 'pm-txt']]));
    }
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the whiteboard
  // In the board's face plane (u = x, v = -z). Wish notes q0 to q19 (one note
  // is 12 wishes): a heap, or hung under the five steps of the to-be process,
  // duplicates gone, three parked; from s5 bin notes (one note is 15 days in
  // s9) stacked in four bins along the bottom, and the MVP cut line.
  const BA = C.BA;
  const U0 = BA.x0 + 3;
  const STEP = (i) => [U0 + i * 31, -BA.z1 + 4, 27, 10];
  const under = (col, row) => [U0 + col * 31 + 2, -BA.z1 + 19 + row * 9, 23, 7];
  const JX = [0, 3, -2, 2, -3, 1, -1, 3, 0, -2, 2, -1, 1, -3, 0, 2, -2, 3, -1, 1];
  const JY = [1, -2, 2, 0, -1, 2, 0, -2, 1, -1, -1, 2, -2, 0, 1, 0, 2, -1, 1, -2];
  const heap = (i) => [U0 + 4 + (i % 5) * 30 + JX[i], -BA.z1 + 20 + Math.floor(i / 5) * 15 + JY[i], 23, 7];
  const PARK = [BA.x1 - 44, -BA.z0 - 28, 40, 24];
  const parked = (k) => [PARK[0] + 4, PARK[1] + 3 + k * 7, 32, 5];
  const BINU = (j) => U0 + j * 39;
  const BIN_TOP = -BA.z1 + 22;
  const BIN_BOT = -BA.z0 - 3;
  const inBin = (j, k) => [BINU(j) + 3, BIN_BOT - 2 - (k + 1) * 5, 28, 4];
  const CUT_U = BINU(1) - 2.5;
  // a board state: notes {id: [u, v, w, h, cls]}, steps, stepsHot, bins, binHot, line, park
  function state(si, b) {
    const notes = {};
    const st = { notes, steps: 0, stepsHot: 0, bins: 0, binHot: -1, line: 0, park: 0 };
    if (si <= 3) {
      st.steps = si === 0 ? 0 : 1;
      const hot = si === 0 ? 'q0' : si === 2 && (b === 1 || b === 2) ? 'q5' : '';
      if (si === 0 || (si === 1 && b === 0) || (si === 3 && b <= 3)) {
        const n = si === 3 && b >= 1 ? 15 : 20;
        for (let i = 0; i < n; i++) notes[`q${i}`] = [...heap(i), `q${i}` === hot ? 'pm-note2' : 'pm-note'];
      } else if (si === 3) {
        // 12 hung under the steps (3, 3, 2, 2, 2), 3 parked
        const COLS = [3, 3, 2, 2, 2];
        let id = 0;
        COLS.forEach((nr, c) => { for (let r = 0; r < nr; r++) notes[`q${id++}`] = [...under(c, r), 'pm-note']; });
        for (let kk = 0; kk < 3; kk++) notes[`q${12 + kk}`] = [...parked(kk), 'pm-note'];
      } else {
        for (let i = 0; i < 20; i++) notes[`q${i}`] = [...under(i % 5, Math.floor(i / 5)), `q${i}` === hot ? 'pm-note2' : 'pm-note'];
      }
      st.park = si === 3 && b >= 4 ? 1 : 0;
      return st;
    }
    st.steps = 1;
    st.bins = 1;
    const counts = si === 8 && b >= 3 ? C.STACK.after : C.STACK.before;
    // ids per bin, so the three notes that move in s9 keep their identity
    const ids = [[], [], [], []];
    for (let kk = 0; kk < C.STACK.before[0]; kk++) ids[0].push(`m${kk}`);
    for (let kk = 0; kk < C.STACK.before[1]; kk++) ids[1].push(`s${kk}`);
    for (let kk = 0; kk < C.STACK.before[2]; kk++) ids[2].push(`c${kk}`);
    for (let kk = 0; kk < C.STACK.before[3]; kk++) ids[3].push(`w${kk}`);
    if (counts === C.STACK.after) { const moved = ids[0].splice(counts[0]); ids[1].push(...moved); }
    ids.forEach((list, j) => list.forEach((id, kk) => { notes[id] = [...inBin(j, kk), BINS[j][1]]; }));
    if (si === 5) st.binHot = [0, 0, 1, 2][b];
    if (si === 6) st.binHot = [3, 3, -1, 2, 0][b];
    st.line = si === 7 ? (b >= 2 ? 1 : 0) : si === 8 ? (b >= 5 ? 1 : 0) : 0;
    st.stepsHot = si === 7 && b >= 3 && b <= 4 ? 1 : 0;
    return st;
  }
  function board(si, b, p) {
    const now = state(si, b);
    const prev = b > 0 ? state(si, b - 1) : si > 0 ? state(si - 1, D.scenes[si - 1].beats.length - 1) : now;
    const t = span(p, 0.15, 0.6);
    const L = (k) => lerp(prev[k], now[k], t);
    let s = '';
    // the to-be process: five steps along the top
    const sa = L('steps');
    if (sa > 0.01) {
      const hotA = L('stepsHot');
      for (let i = 0; i < 5; i++) {
        const [u, v, wd, h] = STEP(i);
        s += op(sa, rect(u, v, wd, h, 'pm-note3', 1) + (i < 4 ? path(`M${f1(u + wd + 0.6)} ${f1(v + h / 2)}h2.8`, 'pm-bin') : '') + op(hotA, rect(u, v + h - 2.5, wd, 2.5, 'pm-acc', 0.5)));
      }
    }
    // the parking area at the bottom right
    const pa = L('park');
    if (pa > 0.01) s += op(pa, rect(...PARK, 'pm-cut2', 1));
    // the four bins along the bottom
    const ba = L('bins');
    if (ba > 0.01) {
      for (let j = 0; j < 4; j++) {
        const hot = (now.binHot === j ? t : 0) + (prev.binHot === j ? 1 - t : 0);
        const d = `M${f1(BINU(j))} ${f1(BIN_TOP)}V${f1(BIN_BOT)}H${f1(BINU(j) + 34)}V${f1(BIN_TOP)}`;
        s += op(ba, path(d, 'pm-bin') + op(Math.min(1, hot), path(d, 'pm-cut2')));
      }
    }
    // the notes
    const ids = [...new Set([...Object.keys(prev.notes), ...Object.keys(now.notes)])];
    for (const id of ids) {
      const a = prev.notes[id];
      const z = now.notes[id];
      let rc;
      let alpha = 1;
      if (a && z) rc = a.slice(0, 4).map((v, i) => lerp(v, z[i], t));
      else if (z) { rc = z; alpha = t; } else { rc = a; alpha = 1 - t; }
      if (alpha <= 0.01) continue;
      const cls = z && (t > 0.5 || !a) ? z[4] : a[4];
      s += op(alpha, rect(rc[0], rc[1], rc[2], rc[3], cls, 0.8));
    }
    // the MVP cut line between the Must bin and the rest
    const la = L('line');
    if (la > 0.01) s += op(la, path(`M${f1(CUT_U)} ${f1(BIN_TOP - 6)}V${f1(BIN_BOT + 3)}`, 'pm-cut2'));
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    set(E.bNotes, board(si, b, p));
  }

  return { render };
})();
