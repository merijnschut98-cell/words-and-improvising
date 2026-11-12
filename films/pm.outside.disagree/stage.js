// The stage of the film "Oneens en overbezet / Disagreement and busy experts":
// a pure function of (scene, u). Inlined into the page after the anatomy kit
// and a preamble from build.mjs that defines C (the calendar cells, the numbers
// of the worked examples), CAM (one camera move per scene), W and H. Moves are
// placed per caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
// The panel at the right gets one card per scene, each block in its own cue
// group (o[key] goes into data-k "p_<key>"); all text is 22 units (a film for
// video). The board in the room repeats the card in miniature, the calendar
// strip on the side wall carries the weeks (a decision that drags, two fixed
// days a week, the Thursday timebox, a fixed day every two weeks and the two
// half days of the safety test), and the sheet on the table the criteria and
// the prepared questions. Three scenes carry two cards each (seq): structure
// and criteria, then fact and judgement; the second opinion, then the
// failures; the three drivers, then what you do with them.
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
  const dot = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const tick = (x, y, cls = 'pm-line') => path(`M${f1(x - 7)} ${f1(y)}l5 5l10 -11`, cls);
  const cross = (x, y, cls = 'pm-strike') => path(`M${f1(x - 6)} ${f1(y - 6)}l12 12M${f1(x + 6)} ${f1(y - 6)}l-12 12`, cls);
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  const L = (nl, en) => (NL ? nl : en);
  const CUES = C.CUES;

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
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // a page of the card that shows from beat k0 and gives way at beat k1 (-1: never)
  const page = (b, p, k0, k1) => (b < k0 ? 0 : b === k0 && k0 > 0 ? span(p, 0.02, 0.2) : b < k1 || k1 < 0 ? 1 : b === k1 ? 1 - span(p, 0, 0.12) : 0);
  const DIA = tr('schema', 'diagram');
  const EX = tr('voorbeeld', 'example');

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1a: structure, not content; assumptions and priorities; the decision criteria
  function s1a(b, p) {
    const o = { head: [tr('oneens', 'disagreeing'), DIA] };
    const A = page(b, p, 0, 2);
    o.structure = op(A, lines(80, L([['structuur, geen', 'pm-big'], ['inhoud', 'pm-big'], ['de inhoud beoordeel'], ['je niet, het besluit'], ['structureren wel', 'pm-on']],
      [['structure, not', 'pm-big'], ['content', 'pm-big'], ['you can’t judge the'], ['content; you can'], ['structure the decision', 'pm-on']])));
    o.causes = op(A * at(b, p, 1), card(214, 108, 'pm-hot') + lines(244, L([['zelden over feiten', 'pm-mute'], ['andere aannames', 'pm-on'], ['andere prioriteiten', 'pm-on']],
      [['rarely about facts', 'pm-mute'], ['other assumptions', 'pm-on'], ['other priorities', 'pm-on']])));
    if (b >= 2) {
      const items = L(['kosten', 'risico', 'tijd', 'kwaliteit', 'onderhoud'], ['cost', 'risk', 'time', 'quality', 'upkeep']);
      o.criteria = op(page(b, p, 2, -1), lines(80, L([['besliscriteria', 'pm-big'], ['eerst, vóór de opties', 'pm-on']], [['decision criteria', 'pm-big'], ['first, before options', 'pm-on']]))
        + items.map((t, i) => op(span(b === 2 ? p : 1, 0.15 + i * 0.1, 0.25 + i * 0.1), tick(X0 + 10, 150 + i * 32) + txt(X0 + 34, 158 + i * 32, t))).join(''));
    }
    return o;
  }
  // s1b: fact or judgement; where disagreements sit; what would change your mind
  function s1b(b, p) {
    const o = { head: [tr('feit of oordeel', 'fact or judgement'), DIA] };
    o.judge = lines(80, L([['feit: controleerbaar', 'pm-big'], [`‘${C.TR.age} jaar oud’`], [''], ['oordeel: inschatting', 'pm-big'], ['‘nog tien jaar mee’']],
      [['fact: can be checked', 'pm-big'], [`‘${C.TR.age} years old’`], [''], ['judgement: assessed', 'pm-big'], ['‘ten more years’']]))
      + tick(X1 - 12, 100) + op(at(b, p, 0, 0.4, 0.6), txt(X1 - 6, 184, '?', 'pm-big', 'end'));
    o.where = op(at(b, p, 1), card(208, 56, 'pm-hot') + txt(X0, 244, tr('verschil: in oordelen', 'it sits in judgements'), 'pm-on'));
    o.mind = op(at(b, p, 2), card(280, 100) + lines(310, L([['‘Wat zou jou van', 'pm-on'], ['mening doen', 'pm-on'], ['veranderen?’', 'pm-on']],
      [['‘What would change', 'pm-on'], ['your mind?’', 'pm-on'], ['what it rests on', 'pm-mute']])));
    return o;
  }

  // s2: the weighted score: weights, scores, multiply and add; weights with the
  // sponsor; where the options differ; a weight moving a little
  function s2(b, p) {
    const o = { head: [tr('gewogen score', 'weighted score'), DIA] };
    const rows = L(['kosten', 'risico', 'tijd'], ['cost', 'risk', 'time']);
    // an illustration, no lesson numbers: weights and scores as bars and dots
    const shift = b >= 4 ? (b === 4 ? span(p, 0.2, 0.7) : 1) : 0;
    const wt = [3, 2 + 0.6 * shift, 1];
    const sa = [2, 3, 1];
    const sb = [3, 1, 3];
    const tot = (s) => s.reduce((a, v, i) => a + v * wt[i], 0);
    const yRow = (i) => 124 + i * 34;
    let m = txt(X0 + 106, 90, tr('gewicht', 'weight'), 'pm-mute') + txt(X0 + 222, 90, 'A', 'pm-big', 'middle') + txt(X0 + 266, 90, 'B', 'pm-big', 'middle');
    rows.forEach((r, i) => {
      const y = yRow(i);
      const hot = b === 3 && i !== 1 ? 0 : 0;
      m += txt(X0, y + 7, r) + rect(X0 + 106, y - 8, wt[i] * 26, 16, 'pm-blk', 3) + hot;
      for (let k = 0; k < 3; k++) {
        m += dot(X0 + 206 + k * 8 + (k > 0 ? 0 : 0), y, 3.6, k < sa[i] ? 'pm-blk' : 'pm-sq');
        m += dot(X0 + 250 + k * 8, y, 3.6, k < sb[i] ? 'pm-blk' : 'pm-sq');
      }
    });
    o.score = m;
    if (b >= 1) {
      const sc = CW / 16;
      const ta = tot(sa);
      const tb = tot(sb);
      o.sum = op(at(b, p, 1), txt(X0, 240, tr('× gewicht, tel op', '× weight, add up'), 'pm-mute')
        + txt(X0, 268, 'A') + rect(X0 + 26, 254, (ta - 6) * sc, 18, 'pm-blk', 3)
        + txt(X0, 296, 'B') + rect(X0 + 26, 282, (tb - 6) * sc, 18, 'pm-blk2', 3));
    }
    if (b >= 2) o.weights = op(page(b, p, 2, 3), card(312, 70, 'pm-hot') + lines(340, L([['gewichten: zakelijk,', 'pm-on'], ['vast met de sponsor']], [['weights: business,', 'pm-on'], ['set with the sponsor']])));
    if (b >= 3) {
      // the rows where A and B differ most: cost and time
      o.differ = op(page(b, p, 3, 4), [0, 2].map((i) => rect(X0 + 196, yRow(i) - 12, 84, 24, 'pm-line', 8)).join('')
        + card(312, 70, 'pm-hot') + lines(340, L([['waar verschillen de', 'pm-on'], ['opties?']], [['where do the options', 'pm-on'], ['differ?']])));
    }
    if (b >= 4) {
      o.shift = op(span(p, 0.02, 0.2), path(`M${f1(X0 + 106 + wt[1] * 26 + 6)} ${yRow(1)}l10 0`, 'pm-line')
        + card(312, 70, 'pm-hot') + lines(340, L([['gewicht iets anders:', 'pm-on'], ['verandert de uitkomst?']], [['a weight moves a bit:', 'pm-on'], ['does the outcome change?']])));
    }
    return o;
  }

  // s3a: the second opinion; the brief; stating the other's position
  function s3a(b, p) {
    const o = { head: [tr('second opinion', 'second opinion'), DIA] };
    o.second = lines(80, L([['second opinion', 'pm-big'], ['onafhankelijk, buiten'], ['de discussie'], ['grote keuzes, moeilijk', 'pm-mute'], ['terug te draaien', 'pm-mute']],
      [['second opinion', 'pm-big'], ['independent, outside'], ['the argument'], ['big choices, hard', 'pm-mute'], ['to undo', 'pm-mute']]));
    o.brief = op(at(b, p, 1), card(202, 82, 'pm-hot') + lines(232, L([['vraag en criteria mee', 'pm-on'], ['niet wie wat zei']], [['the question, criteria', 'pm-on'], ['not who said what']])));
    o.restate = op(at(b, p, 2), card(298, 82) + lines(328, L([['verwoord de ander,', 'pm-on'], ['tot die het eens is']], [['state the other’s view', 'pm-on'], ['until they agree']])));
    return o;
  }
  // s3b: the failures; letting it drag; the sharp question
  function s3b(b, p) {
    const o = { head: [tr('valkuilen', 'traps'), DIA] };
    const items = L(['senioriteit', 'wie het hardst praat', 'het verschil delen'], ['seniority', 'who talks loudest', 'splitting the difference']);
    o.fails = txt(X0, 80, tr('beslissen op:', 'deciding by:'), 'pm-big')
      + items.map((t, i) => op(span(b === 0 ? p : 1, 0.1 + i * 0.2, 0.25 + i * 0.2), cross(X0 + 8, 110 + i * 28) + txt(X0 + 26, 118 + i * 28, t))).join('');
    o.drag = op(at(b, p, 1), cross(X0 + 8, 194) + txt(X0 + 26, 202, tr('laten slepen', 'letting it drag')) + txt(X0 + 26, 228, tr('het project wacht', 'the project waits'), 'pm-mute'));
    o.ask = op(at(b, p, 2), card(248, 134, 'pm-hot') + lines(276, L([['‘Optie van je collega:', 'pm-on'], ['wat gaat er mis, en', 'pm-on'], ['hoe waarschijnlijk?’', 'pm-on'], ['mening wordt risico', 'pm-mute']],
      [['‘If we chose the other', 'pm-on'], ['option: what goes', 'pm-on'], ['wrong, how likely?’', 'pm-on'], ['opinions become risks', 'pm-mute']])));
    return o;
  }

  // s4: the transformer: service or replace; four steps; the outcome
  function s4(b, p) {
    const o = { head: [tr('transformator', 'transformer'), EX] };
    const V = C.TR;
    const title = txt(X0, 80, tr('netproject, fabriek', 'grid project, factory'), 'pm-big');
    o.case = title + op(page(b, p, 0, 1), lines(120, L([['fabriek: houden en'], ['reviseren'], ['installateur:'], ['vervangen']], [['factory engineer:'], ['keep and service'], ['installer:'], ['replace']])));
    if (b >= 1) o.step1 = op(page(b, p, 1, 2), lines(120, L([['stap 1: criteria', 'pm-big'], ['met de sponsor', 'pm-mute'], [`kosten over ${V.keep} jaar`], ['risico op uitval'], ['stilstand tijdens werk']],
      [['step 1: criteria', 'pm-big'], ['with the sponsor', 'pm-mute'], [`cost over ${V.keep} years`], ['risk of outage'], ['downtime during work']])));
    if (b >= 2) o.step2 = op(page(b, p, 2, 3), lines(120, L([['stap 2', 'pm-big'], ['feit: olietest, vocht'], ['stijgt', 'pm-mute'], [`oordeel: nog ${V.keep} jaar`], [`of uitval binnen ${V.fail}`]],
      [['step 2', 'pm-big'], ['fact: oil test, rising'], ['moisture', 'pm-mute'], [`judgement: ${V.keep} years,`], [`or failure within ${V.fail}`]])));
    if (b >= 3) o.step3 = op(page(b, p, 3, 4), lines(120, L([['stap 3', 'pm-big'], ['wat verandert je', 'pm-mute'], ['mening?', 'pm-mute'], ['fabriek: slechtere'], ['olietest volgend jaar'], ['installateur: een'], ['schone test']],
      [['step 3', 'pm-big'], ['what would change', 'pm-mute'], ['your mind?', 'pm-mute'], ['factory: a worse oil'], ['test next year'], ['installer: a clean'], ['test']])));
    if (b >= 4) o.step4 = op(page(b, p, 4, -1), lines(120, L([['stap 4', 'pm-big'], ['second opinion:'], ['onafhankelijk'], ['testbureau, olie', 'pm-mute']],
      [['step 4', 'pm-big'], ['second opinion:'], ['independent test'], ['company, oil results', 'pm-mute']])));
    if (b >= 5) o.outcome = op(span(p, 0.05, 0.25), card(244, 128, 'pm-hot') + lines(274, L([[`vervangen binnen ${V.replace}`, 'pm-on'], ['jaar', 'pm-on'], ['sponsor: zomerstop'], ['volgend jaar']],
      [[`replace within ${V.replace}`, 'pm-on'], ['years', 'pm-on'], ['sponsor: next'], ['summer’s shutdown']])));
    return o;
  }

  // s5: scarce experts; the plan as real as their availability; context
  // switching; Weinberg's rule of thumb on two and five projects
  function s5(b, p) {
    const o = { head: [tr('schaars', 'scarce'), DIA] };
    const A = page(b, p, 0, 2);
    o.scarce = op(A, lines(80, L([['schaarste middel', 'pm-big'], ['weinig kunnen het,'], ['veel projecten'], ['willen ze']], [['the scarcest resource', 'pm-big'], ['few can do the work,'], ['many projects'], ['want them']])));
    o.real = op(A * at(b, p, 1), card(184, 82, 'pm-hot') + lines(214, L([['planning zo echt als', 'pm-on'], ['hun beschikbaarheid', 'pm-on']], [['the plan is as real', 'pm-on'], ['as their availability', 'pm-on']])));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.switch = op(B, lines(80, L([['contextwisseling', 'pm-big'], ['wisselen, en tijd'], ['kwijt om er weer in'], ['te komen']], [['context switching', 'pm-big'], ['moving between tasks,'], ['losing time getting'], ['back in']])));
      const bar = (y, lost, a) => rect(X0, y, CW * (1 - lost / 100), 20, 'pm-blk', 3) + op(a, rect(X0 + CW * (1 - lost / 100) + 2, y, CW * (lost / 100) - 2, 20, 'pm-lost', 3));
      if (b >= 3) {
        o.weinberg = op(at(b, p, 3), txt(X0, 196, 'Weinberg, 1992', 'pm-mute') + txt(X0, 224, tr('2 projecten', '2 projects'))
          + txt(X1, 224, tr('een vijfde weg', 'a fifth lost'), 'pm-on', 'end') + bar(232, C.WB.two, b > 3 ? 1 : span(p, 0.4, 0.7)));
      }
      if (b >= 4) {
        o.five = op(at(b, p, 4), txt(X0, 286, tr('5 projecten', '5 projects')) + txt(X1, 286, tr('tot driekwart', 'up to ¾'), 'pm-on', 'end')
          + bar(294, C.WB.five, b > 4 ? 1 : span(p, 0.3, 0.7)));
      }
      if (b >= 5) o.rough = op(at(b, p, 5), txt(X0, 350, tr('grove richtlijn,', 'a rough guide,'), 'pm-mute') + txt(X0, 376, tr('geen meting', 'not a measurement'), 'pm-mute'));
    }
    return o;
  }

  // s6: blocks, not percentages; prepare; a two-line summary; the timebox
  function s6(b, p) {
    const o = { head: [tr('blokken', 'blocks'), DIA] };
    const A = page(b, p, 0, 3);
    const days = L(['ma', 'di', 'wo', 'do', 'vr'], ['Mo', 'Tu', 'We', 'Th', 'Fr']);
    o.blocks = op(A, txt(X0, 80, tr('blokken, geen %', 'blocks, not %'), 'pm-big')
      + days.map((d, i) => rect(X0 + i * 57, 98, 51, 40, i === 1 || i === 3 ? 'pm-hot' : 'pm-card', 5) + txt(X0 + i * 57 + 25.5, 125, d, i === 1 || i === 3 ? 'pm-on' : 'pm-mute', 'middle')).join('')
      + txt(X0, 170, tr('‘di en do’, niet ‘40%’', '‘Tue and Thu’, not 40%'), 'pm-on'));
    o.prep = op(A * at(b, p, 1), lines(212, L([['bereid voor:', 'pm-big'], ['vragen, data,'], ['besluiten op een rij']], [['prepare:', 'pm-big'], ['questions, data,'], ['decisions lined up']])));
    o.meet = op(A * at(b, p, 2), txt(X0, 312, tr('niet nodig: 2 regels', 'not needed: 2 lines'), 'pm-mute') + rect(X0, 326, 150, 4, 'pm-blk2', 2) + rect(X0, 338, 110, 4, 'pm-blk2', 2));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      const k = b === 3 ? span(p, 0.3, 0.9) : 1;
      o.box = op(B, lines(80, L([['timebox', 'pm-big'], ['vast tijdslot, stopt'], ['als de tijd om is']], [['timebox', 'pm-big'], ['a fixed slot that ends'], ['when the time is up']]))
        + rect(X0, 152, CW, 26, 'pm-card', 5) + rect(X0 + 2, 154, (CW - 4) * k, 22, 'pm-blk', 4) + path(`M${X1} 144v42`, 'pm-strike'));
      o.boxex = op(at(b, p, 4), card(222, 110, 'pm-hot') + lines(252, L([['‘Do, twee uur:', 'pm-on'], ['koppelingsontwerp', 'pm-on'], ['besluiten’', 'pm-on']],
        [['‘Thursday, two hours:', 'pm-on'], ['decide the interface', 'pm-on'], ['design’', 'pm-on']])));
    }
    return o;
  }

  // s7a: Pink's three drivers
  function s7a(b, p) {
    const o = { head: [tr('motivatie', 'motivation'), DIA] };
    o.pink = lines(80, L([['Pink, Drive, 2009', 'pm-big'], ['op Deci en Ryan,', 'pm-mute'], ['psychologen', 'pm-mute'], ['drie drijfveren:']], [['Pink, Drive, 2009', 'pm-big'], ['on Deci and Ryan,', 'pm-mute'], ['psychologists', 'pm-mute'], ['three drivers:']]));
    const drv = (i, name, def) => card(178 + i * 70, 64, b === i + 1 ? 'pm-hot' : 'pm-card') + txt(X0, 178 + i * 70 + 27, name, 'pm-big') + txt(X0, 178 + i * 70 + 53, def);
    o.auto = op(at(b, p, 1), drv(0, tr('autonomie', 'autonomy'), tr('zeggenschap over hoe', 'say in how you work')));
    o.mast = op(at(b, p, 2), drv(1, tr('meesterschap', 'mastery'), tr('beter in wat telt', 'better at what matters')));
    o.purp = op(at(b, p, 3), drv(2, tr('zingeving', 'purpose'), tr('zien waarvoor het is', 'what the work is for')));
    return o;
  }
  // s7b: autonomy over the how; the problem, not the task; credit; what kills it
  function s7b(b, p) {
    const o = { head: [tr('zo gebruik je het', 'using it'), DIA] };
    o.how = lines(80, L([['autonomie: het hoe', 'pm-big'], ['stevig: wat, wanneer', 'pm-on']], [['autonomy: the how', 'pm-big'], ['firm: what and when', 'pm-on']]));
    o.problem = op(at(b, p, 1), card(122, 116) + lines(150, L([['het probleem, niet'], ['alleen de taak:'], [`‘operators: ${20} min`, 'pm-on'], ['per dienst kwijt’', 'pm-on']],
      [['the problem, not'], ['just the task:'], ['‘operators lose 20', 'pm-on'], ['minutes a shift’', 'pm-on']])));
    o.credit = op(at(b, p, 2), txt(X0, 268, tr('bij naam, bij sponsor', 'by name, to sponsor'), 'pm-on'));
    o.kills = op(at(b, p, 3), lines(300, L([['wat sloopt:', 'pm-big'], ['koers wijzigt zonder'], ['uitleg; overleg'], ['zonder doel']], [['what kills it:', 'pm-big'], ['changes unexplained,'], ['advice overruled,'], ['pointless meetings']])));
    return o;
  }

  // s8: the manager is not the only lever; earn their attention; the question; the answers
  function s8(b, p) {
    const o = { head: [tr('aandacht', 'attention'), DIA] };
    o.lever = lines(80, L([['fout: de manager als', 'pm-big'], ['enige hefboom', 'pm-big']], [['failure: the manager', 'pm-big'], ['as the only lever', 'pm-big']]));
    o.earn = op(at(b, p, 1), lines(138, L([['manager: de uren'], ['aandacht: verdienen', 'pm-on']], [['manager: the hours'], ['attention: earned', 'pm-on']])));
    o.worth = op(at(b, p, 2), card(190, 82, 'pm-hot') + lines(220, L([['‘Wat maakt dit project', 'pm-on'], ['jouw tijd waard?’', 'pm-on']], [['‘What would make this', 'pm-on'], ['worth your time?’', 'pm-on']])));
    const items = L(['interessant probleem', 'nette overdracht', 'niet ’s nachts gebeld'], ['an interesting problem', 'a clean handover', 'no calls at night']);
    o.answers = op(at(b, p, 3), items.map((t, i) => op(span(b === 3 ? p : 1, 0.05 + i * 0.2, 0.2 + i * 0.2), dot(X0 + 6, 294 + i * 26, 5, 'pm-dot') + txt(X0 + 20, 302 + i * 26, t))).join(''));
    o.remember = op(at(b, p, 4), txt(X1, 378, tr('onthoud het antwoord', 'remember the answer'), 'pm-on', 'end'));
    return o;
  }

  // s9: the safety specialist: 40 hours in 8 weeks; 80 on paper, 32 after
  // switching; blocks of 4 days and two half days; prepare; ask and credit
  function s9(b, p) {
    const o = { head: [tr('specialist', 'specialist'), EX] };
    const V = C.SP;
    const A = page(b, p, 0, 2);
    o.case2 = op(A, lines(80, L([['robotcel', 'pm-big'], ['veiligheidsspecialist'], ['op 4 projecten'], ['mist jouw sessies', 'pm-mute']], [['robot cell', 'pm-big'], ['the safety specialist'], ['on 4 projects'], ['misses your sessions', 'pm-mute']])));
    o.need = op(A * at(b, p, 1), card(184, 82, 'pm-hot') + lines(214, L([[`nodig: ${V.need} uur, ${V.weeks} wk`, 'pm-on'], [`manager: ‘${V.paper}%’`, 'pm-mute']], [[`need: ${V.need} h in ${V.weeks} wk`, 'pm-on'], [`manager: ‘${V.paper}%’`, 'pm-mute']])));
    const sx = (h) => X0 + (CW * h) / V.onPaper;
    const chart = page(b, p, 2, 6);
    if (b >= 2) {
      const k = b === 2 ? span(p, 0.4, 0.8) : 1;
      o.paper = op(chart, txt(X0, 80, tr('hoe regel je zijn tijd?', 'how to get his time?'), 'pm-big')
        + txt(X0, 116, tr(`op papier: ${V.onPaper} uur`, `on paper: ${V.onPaper} hours`)) + rect(X0, 124, (sx(V.onPaper) - X0) * k, 20, 'pm-blk2', 3));
    }
    if (b >= 3) {
      const k = b === 3 ? span(p, 0.3, 0.7) : 1;
      o.cut = op(chart * at(b, p, 3), txt(X0, 176, tr(`${V.real}% per project: ${V.afterSwitch} uur`, `${V.real}% each: ${V.afterSwitch} hours`))
        + rect(X0, 184, (sx(V.afterSwitch) - X0) * k, 20, 'pm-lost', 3) + path(`M${f1(sx(V.need))} 104V312`, 'pm-strike')
        + txt(sx(V.need) + 6, 230, tr(`nodig ${V.need}`, `need ${V.need}`), 'pm-on'));
    }
    if (b >= 4) {
      let seg = '';
      for (let i = 0; i < V.days; i++) seg += op(span(b === 4 ? p : 1, 0.2 + i * 0.12, 0.3 + i * 0.12), rect(sx(i * V.day) + 1, 276, sx(V.day) - X0 - 2, 20, 'pm-blk', 3));
      o.blocks2 = op(chart, txt(X0, 268, tr(`${V.days} dagen van ${V.day} uur`, `${V.days} days of ${V.day} hours`)) + seg);
    }
    if (b >= 5) {
      let seg = '';
      for (let i = 0; i < 2; i++) seg += op(span(b === 5 ? p : 1, 0.2 + i * 0.2, 0.35 + i * 0.2), rect(sx(V.blocks + i * V.half) + 1, 276, sx(V.half) - X0 - 2, 20, 'pm-hot', 3));
      o.test = op(chart, seg + txt(X0, 330, tr(`+ 2 halve dagen: ${V.need}`, `+ 2 half days: ${V.need} h`), 'pm-on'));
    }
    if (b >= 6) {
      o.prep2 = op(page(b, p, 6, -1), lines(80, L([['elke dag voorbereid:', 'pm-big'], ['vragen, tekeningen,'], ['besluiten klaar']], [['each day prepared:', 'pm-big'], ['questions, drawings,'], ['decisions ready']])));
    }
    if (b >= 7) {
      o.ask2 = op(span(p, 0.05, 0.25), card(184, 160, 'pm-hot') + lines(214, L([['wat maakt het de', 'pm-on'], ['moeite waard?', 'pm-on'], ['minder late', 'pm-mute'], ['telefoontjes?', 'pm-mute'], ['noem hem: stuurgroep']],
        [['what makes it worth', 'pm-on'], ['his while?', 'pm-on'], ['fewer late calls', 'pm-mute'], ['from the site?', 'pm-mute'], ['credit him: steering']])));
    }
    return o;
  }
  // two cards in one scene: the first for its n beats, then the second, faded in
  const seq = (f, n, g) => (b, p) => {
    if (b < n) return f(b, p);
    const o = g(b - n, p);
    if (b > n) return o;
    const a = span(p, 0.02, 0.2);
    for (const key of Object.keys(o)) if (key !== 'head') o[key] = op(a, o[key]);
    return o;
  };
  const CARDS = [seq(s1a, 3, s1b), s2, seq(s3a, 3, s3b), s4, s5, s6, seq(s7a, 4, s7b), s8, s9];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip: weeks lost while a decision drags (s3); weeks taken by
  // other projects (s5); two fixed days a week and the Thursday timebox (s6);
  // a fixed day every two weeks and the two half days of the safety test (s9)
  function calendar(si, b, p) {
    const cell = (wk) => C.CELLS[wk - 1];
    const fill = (wk, cls, a = 1, f0 = 0, f1v = 1) => { const [x0, y0, x1, y1] = cell(wk); const h = y1 - y0; return op(a, rect(x0, y0 + h * f0, x1 - x0, h * (f1v - f0), cls, 1)); };
    let s = '';
    const grow = (from, to, cls, a) => { for (let wk = from; wk <= to; wk++) s += fill(wk, cls, clamp(a * (to - from + 1) - (wk - from), 0, 1)); };
    if (si === 2 && b >= 4) grow(1, 6, 'pm-blk2', b > 4 ? 1 : span(p, 0.1, 0.7));
    if (si === 4 && b >= 1) [1, 2, 4, 5, 7, 9, 10, 12].forEach((wk, i) => { s += fill(wk, 'pm-blk2', b > 1 ? 1 : span(p, 0.1 + i * 0.05, 0.2 + i * 0.05)); });
    if (si === 5) {
      for (let wk = 1; wk <= 8; wk++) {
        const a = b > 0 ? 1 : span(p, 0.15 + wk * 0.05, 0.25 + wk * 0.05);
        s += fill(wk, 'pm-blk', a, 0.25, 0.4) + fill(wk, 'pm-blk', a, 0.65, 0.8);
      }
      if (b >= 4) s += fill(3, 'pm-hot', b > 4 ? 1 : span(p, 0.1, 0.3), 0.6, 0.85);
    }
    if (si === 8) {
      if (b >= 4) [2, 4, 6, 8].forEach((wk, i) => { s += fill(wk, 'pm-blk', b > 4 ? 1 : span(p, 0.2 + i * 0.12, 0.3 + i * 0.12)); });
      if (b >= 5) [7, 8].forEach((wk, i) => { s += fill(wk, 'pm-hot', b > 5 ? 1 : span(p, 0.2 + i * 0.2, 0.35 + i * 0.2), 0.5, 1); });
    }
    return s;
  }
  // the sheet on the table: the five criteria (s1), the prepared questions
  // (s6), the prepared day (s9)
  function sheet(si, b, p) {
    let s = '';
    const row = (i, w0 = 18) => `<path class="pm-line" d="M6 ${f1(4 + i * 3.2)}H${f1(w0 - (i % 3) * 2)}"/>`;
    const mark = (i, a = 1) => op(a, `<path class="pm-line" d="M2 ${f1(4 + i * 3.2)}l1.2 1.2l2.2 -2.6"/>`);
    if (si === 0 && b >= 2) for (let i = 0; i < 5; i++) s += row(i) + mark(i, b > 2 ? 1 : span(p, 0.15 + i * 0.1, 0.25 + i * 0.1));
    if (si === 5 && b >= 1) for (let i = 0; i < 6; i++) s += op(b > 1 ? 1 : span(p, 0.1 + i * 0.06, 0.2 + i * 0.06), row(i, 15));
    if (si === 8 && b >= 6) for (let i = 0; i < 7; i++) s += row(i) + mark(i, b > 6 ? 1 : span(p, 0.1 + i * 0.07, 0.2 + i * 0.07));
    return s;
  }
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    let mini = '';
    for (const c of CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.cMarks, calendar(si, b, p));
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
