// The stage of the film "Vragen stellen buiten je vak / Asking questions
// outside your field": a pure function of (scene, u). Inlined into the page
// after the anatomy kit and a preamble from build.mjs that defines C (the
// calendar cells, the numbers of the two worked examples), CAM (one camera
// move per scene), W and H. Moves are placed per caption beat (beatStarts), so
// the video's narration timing (films/_kit/beatwarp.js) keeps them in step.
// The panel at the right gets one card per scene, each block in its own cue
// group (o[key] goes into data-k "p_<key>"); the five areas of the question
// set are five groups (n1 to n5): rows in scene 1, a numbered strip in scenes
// 2 to 5. The board in the room repeats the card in miniature, the calendar
// strip on the side wall carries the weeks (the moments to ask, the clean-up
// range, the range of an estimate, the reference class), and the sheet on the
// table fills as the question set, one line per area.
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
  const txt = (x, y, t, cls = 'pm-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="20" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const dot = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const dia = (x, y, s = 9, cls = 'pm-dia') => path(`M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z`, cls);
  const tick = (x, y, cls = 'pm-line') => path(`M${f1(x - 7)} ${f1(y)}l5 5l10 -11`, cls);
  const cross = (x, y, cls = 'pm-strike') => path(`M${f1(x - 6)} ${f1(y - 6)}l12 12M${f1(x + 6)} ${f1(y - 6)}l-12 12`, cls);
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
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
  const AREAS = [tr('scope', 'scope'), tr('aannames', 'assumptions'), tr('risico’s', 'risks'), tr('schattingen', 'estimates'), tr('afhankelijkheden', 'dependencies')];
  // the five areas as a numbered strip at the top of the card: hot (being
  // asked), done (asked) or still to come
  const strip = (o, state) => {
    for (let i = 0; i < 5; i++) {
      const x = X0 + 14 + i * 32;
      const s = state[i];
      o[`n${i + 1}`] = dot(x, 66, 13, s === 'hot' ? 'pm-hot' : 'pm-card') + txt(x, 73, String(i + 1), s === 'hot' ? 'pm-on' : s === 'done' ? 'pm-txt' : 'pm-mute', 'middle');
    }
    o.stripNote = txt(X1, 73, tr('vragenset', 'question set'), 'pm-mute', 'end');
  };
  const states = (hot, done) => [0, 1, 2, 3, 4].map((i) => (hot.includes(i + 1) ? 'hot' : i + 1 <= done ? 'done' : 'todo'));
  // a weeks axis: x of week w on 0..max, from X0 + 6 to X1 - 6
  const axis = (y, max, every, unit) => {
    const xw = (w) => X0 + 6 + (w / max) * (CW - 12);
    let s = path(`M${f1(xw(0))} ${y}H${f1(xw(max))}`, 'pm-axis');
    for (let w = 0; w <= max; w += every) s += path(`M${f1(xw(w))} ${y - 4}V${y + 4}`, 'pm-axis');
    s += txt(X1, y + 26, unit, 'pm-mute', 'end');
    return { s, xw };
  };

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: your questions are your expertise; the question set; five areas in order
  function s1(b, p) {
    const o = { head: [tr('vijf gebieden', 'five areas'), DIA] };
    const A = page(b, p, 0, 2);
    o.skill = op(A, card(52, 118) + lines(78, [[tr('buiten je vak', 'outside your field'), 'pm-big'], [tr('antwoorden niet te', 'answers you can’t')], [tr('beoordelen? je vragen', 'judge? your questions')], [tr('zijn je vakkennis', 'are your expertise'), 'pm-on']]));
    o.set = op(A * at(b, p, 1), lines(208, [[tr('vragenset', 'question set'), 'pm-big'], [tr('korte, vaste lijst', 'a short, fixed list')], [tr('per fase, welk vak ook:', 'per phase, any field:')], [tr('database, kabel, robot', 'database, cable, robot'), 'pm-mute']])
      + [0, 1, 2, 3, 4].map((i) => path(`M${X0 + 2} ${f1(320 + i * 12)}H${f1(X0 + 150 - (i % 3) * 24)}`, 'pm-line')).join(''));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const q = b === 2 ? p : 1;
      AREAS.forEach((t, i) => {
        const y = 96 + i * 46;
        const hot = b === 2;
        o[`n${i + 1}`] = op(B * span(q, 0.05 + i * 0.13, 0.15 + i * 0.13), dot(X0 + 14, y - 7, 14, hot ? 'pm-hot' : 'pm-card') + txt(X0 + 14, y, String(i + 1), hot ? 'pm-on' : 'pm-txt', 'middle')
          + txt(X0 + 42, y, t, 'pm-big') + (i < 4 ? path(`M${X0 + 14} ${y + 8}V${y + 24}`, 'pm-line') : ''));
      });
      o.order = op(B * at(b, p, 3), card(306, 76, 'pm-hot') + lines(334, [[tr('in die volgorde:', 'in that order:'), 'pm-on'], [tr('elk bouwt op de vorige', 'each builds on the last')]]));
    }
    return o;
  }

  // s2: scope, and what is not in it; assumptions, written down until checked
  function s2(b, p) {
    const o = { head: [tr('scope en aannames', 'scope, assumptions'), DIA] };
    strip(o, states(b < 2 ? [1] : [2], b < 2 ? 0 : 1));
    const A = page(b, p, 0, 2);
    o.scope = op(A, lines(118, [[tr('scope', 'scope'), 'pm-big'], [tr('‘Wat hebben we precies', '‘What exactly will we')], [tr('aan het eind?’', 'have at the end?’')]]));
    o.notin = op(A * at(b, p, 1), card(208, 132, 'pm-hot') + lines(236, [[tr('‘Wat zit er uitdrukkelijk', '‘What is explicitly'), 'pm-on'], [tr('niet in?’', 'not included?’'), 'pm-on'], [tr('de belangrijkste helft:', 'the half that matters:')], [tr('daar zitten misverstanden', 'where confusion lives'), 'pm-mute']]));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.assume = op(B, lines(118, [[tr('aanname', 'assumption'), 'pm-big'], [tr('waar voor nu, geen bewijs', 'true for now, no proof')], [tr('‘Wat nemen we aan dat,', '‘What are we assuming')], [tr('als het niet klopt, de', 'that, if wrong, changes')], [tr('planning verandert?’', 'the plan?’')]]));
      o.unchecked = op(B * at(b, p, 3), card(250, 132) + lines(276, [[tr('‘het netwerk kan de', '‘the network can carry')], [tr('nieuwe data aan’', 'the new data’')], [tr('schrijf het op: een risico', 'write it down: a risk'), 'pm-on'], [tr('tot het gecheckt is', 'until it is checked'), 'pm-on']]));
    }
    return o;
  }

  // s3: risks, one expert at a time; estimates, a forecast with a range
  function s3(b, p) {
    const o = { head: [tr('risico’s, schattingen', 'risks, estimates'), DIA] };
    strip(o, states(b < 2 ? [3] : [4], b < 2 ? 2 : 3));
    const A = page(b, p, 0, 2);
    o.risk = op(A, lines(118, [[tr('risico', 'risk'), 'pm-big'], [tr('kan gebeuren, schaadt het', 'may happen, hurts the')], [tr('doel. ‘Grootste zorg?', 'goal. ‘What worries you')], [tr('Wat ging er mis bij', 'most? What went wrong')], [tr('vergelijkbare klussen?’', 'on similar jobs?’')]]));
    o.apart = op(A * at(b, p, 1), card(264, 118, 'pm-hot') + lines(292, [[tr('elke expert apart', 'each expert separately'), 'pm-on'], [tr('in een groep zet de', 'in a group the most')], [tr('meest senior stem de toon', 'senior voice sets the tone')]]));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.est = op(B, lines(118, [[tr('schatting', 'estimate'), 'pm-big'], [tr('voorspelling, geen belofte', 'a forecast, not a promise')], [tr('‘Hoe zeker ben je, en', '‘How sure are you, and')], [tr('waarop is het gebaseerd?’', 'what is it based on?’')]]));
      // one number against a range: a dot, then a bar from low to high
      const k = b === 3 ? span(p, 0.15, 0.6) : b > 3 ? 1 : 0;
      o.ask = op(at(b, p, 3), card(236, 146, 'pm-hot') + lines(264, [[tr('vraag een bandbreedte,', 'ask for a range,'), 'pm-on'], [tr('niet één getal', 'not one number')]])
        + dot(X0 + 60, 330, 6, 'pm-dot') + txt(X0 + 60, 362, tr('één getal', 'one number'), 'pm-mute', 'middle')
        + rect(X0 + 140, 322, 120 * k, 16, 'pm-blk', 4) + op(k, txt(X0 + 200, 362, tr('laag tot hoog', 'low to high'), 'pm-txt', 'middle')));
    }
    return o;
  }

  // s4: dependencies; the delays nobody owned; when to ask; asked once and filed
  function s4(b, p) {
    const o = { head: [tr('afhankelijkheden', 'dependencies'), DIA] };
    strip(o, states(b < 3 ? [5] : [], b < 3 ? 4 : 5));
    const A = page(b, p, 0, 3);
    o.dep = op(A, lines(118, [[tr('afhankelijkheid', 'dependency'), 'pm-big'], [tr('je werk wacht op een ander', 'your work needs another')], [tr('‘Wat heb je van anderen', '‘What do you need from')], [tr('nodig, en wanneer?’', 'others, and by when?’')]]));
    o.depex = op(A * at(b, p, 1), lines(226, [[tr('netbeheerder: eerst', 'grid operator: first the')], [tr('belastingdata, dan de', 'load data, then size')], [tr('kabel dimensioneren', 'the cable')], [tr('MES: koppeling van ERP', 'MES: interface from ERP')]]));
    o.owner = op(A * at(b, p, 2), card(318, 64, 'pm-hot') + lines(344, [[tr('meeste vertraging: niet', 'most delays: not'), 'pm-on'], [tr('technisch, geen eigenaar', 'technical, nobody owned')]]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      const moments = [tr('bij de start', 'at the start'), tr('bij elke wijziging', 'at every change'), tr('voor elk go/no-go', 'before each go/no-go')];
      o.when = op(B, txt(X0, 118, tr('wanneer?', 'when?'), 'pm-big')
        + moments.map((t, i) => op(span(b === 3 ? p : 1, 0.08 + i * 0.15, 0.18 + i * 0.15), dia(X0 + 9, 144 + i * 28 - 7, 7) + txt(X0 + 26, 144 + i * 28, t))).join('')
        + op(span(b === 3 ? p : 1, 0.55, 0.7), txt(X0, 234, tr('elke keer dezelfde vragen', 'same questions every time'), 'pm-on')));
      o.archive = op(at(b, p, 4), lines(266, [[tr('fout: één keer, bij de', 'mistake: once, at the'), 'pm-mute'], [tr('kick-off, dan archiveren', 'kick-off, then filed'), 'pm-mute']]));
      o.close = op(at(b, p, 4, 0.35, 0.55), card(306, 76, 'pm-hot') + lines(332, [[tr('‘Wat namen we vandaag aan', '‘What did we assume today'), 'pm-on'], [tr('dat niemand checkte?’', 'that nobody checked?’'), 'pm-on']]));
    }
    return o;
  }

  // s5: the MES kick-off at a metal parts maker, five questions
  function s5(b, p) {
    const o = { head: [tr('kick-off MES', 'MES kick-off'), EX] };
    strip(o, states([[], [1], [2], [3, 4], [5]][b], [0, 0, 1, 2, 4][b]));
    const A = page(b, p, 0, 3);
    o.case = op(A, lines(118, [[tr('maker van metalen', 'metal parts maker'), 'pm-big'], [tr('onderdelen; leverancier', 'with the supplier')], [tr('en IT-lead', 'and the IT lead')]]));
    o.q1 = op(A * at(b, p, 1), card(186, 72) + lines(212, [[tr('scope: welke lijnen?', 'scope: which lines?'), 'pm-big'], [tr('lijn 1 en 2; 3 niet', 'lines 1 and 2; not 3'), 'pm-on']]));
    o.q2 = op(A * at(b, p, 2), card(270, 112) + lines(296, [[tr('aanname: machinedata', 'assumption: machine data'), 'pm-big'], [tr('via het bestaande netwerk', 'via the existing network')], [tr('niet gecheckt', 'unchecked'), 'pm-on']]) + cross(X1 - 16, 344));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.q3 = op(B, lines(118, [[tr('risico: stamgegevens', 'risk: master data was'), 'pm-big'], [tr('waren elders vervuild', 'dirty elsewhere')], [tr('producten en routings', 'products and routings'), 'pm-mute']]));
      o.q4 = op(B * at(b, p, 3, 0.45, 0.6), lines(200, [[tr('schatting: opschonen', 'estimate: clean-up'), 'pm-big'], [tr(`${C.CLEAN[0]} tot ${C.CLEAN[1]} weken`, `${C.CLEAN[0]} to ${C.CLEAN[1]} weeks`), 'pm-on']]));
      o.q5 = op(at(b, p, 4), lines(256, [[tr('afhankelijkheid: ERP-', 'dependency: an ERP'), 'pm-big'], [tr('koppeling, vóór 1 maart', 'interface, by 1 March'), 'pm-on']]));
      o.tally = op(at(b, p, 4, 0.45, 0.65), card(306, 76, 'pm-hot') + lines(334, [[tr('5 vragen, 3 nieuwe', '5 questions, 3 new'), 'pm-on'], [tr('risico’s, elk een eigenaar', 'risks, one owner each')]]));
    }
    return o;
  }

  // s6: check how an estimate was made; the planning fallacy; range; three points; PERT
  function s6(b, p) {
    const o = { head: [tr('hoe is hij gemaakt?', 'how was it made?'), DIA] };
    const A = page(b, p, 0, 2);
    const tools = [tr('bandbreedte', 'range'), tr('referentieklasse', 'reference class'), tr('tweede schatting', 'second estimate')];
    o.tools = op(A, lines(78, [[tr('niet het werk toetsen,', 'don’t judge the work,'), 'pm-big'], [tr('maar hoe het gemaakt is', 'check how it was made')]])
      + tools.map((t, i) => op(span(b === 0 ? p : 1, 0.3 + i * 0.12, 0.4 + i * 0.12), txt(X0 + 14, 140 + i * 28, String(i + 1), 'pm-on', 'middle') + txt(X0 + 32, 140 + i * 28, t))).join(''));
    o.fallacy = op(A * at(b, p, 1), card(214, 168, 'pm-hot') + lines(240, [[tr('planningsdrogreden', 'planning fallacy'), 'pm-on'], [tr('eigen taak onderschatten,', 'underrating your own task,')], [tr('ook als vergelijkbare', 'even when similar tasks')], [tr('taken uitliepen', 'ran late')], [tr('experts ook', 'experts too'), 'pm-big'], [tr('Kahneman, Tversky, 1979', 'Kahneman, Tversky, 1979'), 'pm-mute']]));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const ax = axis(150, 8, 1, tr('weken', 'weeks'));
      const k = b === 2 ? span(p, 0.15, 0.55) : 1;
      o.range = op(B, txt(X0, 78, tr('bandbreedte', 'range'), 'pm-big') + txt(X1, 78, tr(`${C.RANGE[0]} tot ${C.RANGE[1]} wk`, `${C.RANGE[0]} to ${C.RANGE[1]} wk`), 'pm-on', 'end')
        + ax.s + rect(ax.xw(C.RANGE[0]), 108, (ax.xw(C.RANGE[1]) - ax.xw(C.RANGE[0])) * k, 18, 'pm-blk', 4)
        + txt(ax.xw(C.RANGE[0]), 176, String(C.RANGE[0]), 'pm-txt', 'middle') + op(k, txt(ax.xw(C.RANGE[1]), 176, String(C.RANGE[1]), 'pm-txt', 'middle')));
      const rows = [['O', tr('optimistisch', 'optimistic')], ['M', tr('meest waarschijnlijk', 'most likely')], ['P', tr('pessimistisch', 'pessimistic')]];
      o.three = op(B * at(b, p, 3), txt(X0, 212, tr('driepuntsschatting', 'three-point estimate'), 'pm-big')
        + rows.map(([l, t], i) => op(at(b, p, 3, 0.15 + i * 0.12, 0.25 + i * 0.12), txt(X0 + 8, 238 + i * 24, l, 'pm-on', 'middle') + txt(X0 + 28, 238 + i * 24, t))).join(''));
      o.pert = op(B * at(b, p, 3, 0.55, 0.75), card(298, 84, b >= 4 ? 'pm-hot' : 'pm-card') + lines(322, [[tr('(O + 4M + P) ÷ 6', '(O + 4M + P) ÷ 6'), 'pm-on'], [tr('PERT, Polaris, 1958', 'PERT, Polaris, 1958'), 'pm-mute']])
        + op(at(b, p, 4), txt(X0, 370, tr('afspraak: naar de staart', 'a convention: to the tail'))));
    }
    return o;
  }

  // s7: the reference class; the last five like this; the base rates of large projects
  function s7(b, p) {
    const o = { head: [tr('referentieklasse', 'reference class'), DIA] };
    const A = page(b, p, 0, 2);
    o.ref = op(A, lines(78, [[tr('referentieklasse', 'reference class'), 'pm-big'], [tr('vergelijkbare eerdere', 'similar past projects')], [tr('projecten als maatstaf', 'as a yardstick')], [tr('Kahneman, Flyvbjerg', 'Kahneman, Flyvbjerg'), 'pm-mute']]));
    // five past jobs as bars of their real length
    const past = [7, 9, 8, 11, 9];
    o.last5 = op(A * at(b, p, 1), card(186, 196, 'pm-hot') + lines(214, [[tr('niet vanuit het plan:', 'not from the plan:')], [tr('‘Hoe lang duurden de', '‘How long did the last'), 'pm-on'], [tr('laatste vijf zoals deze?’', 'five like this take?’'), 'pm-on']])
      + past.map((wk, i) => op(at(b, p, 1, 0.3 + i * 0.1, 0.4 + i * 0.1), rect(X0 + 4, 290 + i * 17, wk * 20, 11, 'pm-blk2', 3))).join(''));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const q = b === 2 ? p : 1;
      const bar = (y, share, a) => rect(X0, y, CW, 18, 'pm-card', 4) + op(a, rect(X0, y, Math.max(3, CW * share / 100), 18, 'pm-blk', 4));
      o.flyv = op(B, lines(78, [[tr('Flyvbjerg, Gardner, 2023', 'Flyvbjerg, Gardner, 2023'), 'pm-big'], [tr('± 16.000 projecten, vooral', '± 16,000 projects, mostly'), 'pm-mute'], [tr('grote', 'large ones'), 'pm-mute']])
        + bar(148, C.BOTH, span(q, 0.25, 0.45)) + op(span(q, 0.25, 0.45), txt(X0, 190, tr(`${String(C.BOTH).replace('.', ',')}%: budget én planning`, `${C.BOTH}%: budget and schedule`), 'pm-on'))
        + bar(204, C.ALL, span(q, 0.6, 0.8)) + op(span(q, 0.6, 0.8), txt(X0, 246, tr(`${String(C.ALL).replace('.', ',')}%: ook de baten`, `${C.ALL}%: benefits too`), 'pm-on')));
      o.base = op(at(b, p, 3), card(270, 112, 'pm-hot') + lines(298, [[tr('zo’n basiscijfer', 'a base rate like that'), 'pm-on'], [tr('wint van een', 'beats a confident')], [tr('zelfverzekerd plan', 'plan')]]));
    }
    return o;
  }

  // s8: a second estimate; the gap; the language; the debate; twice as long
  function s8(b, p) {
    const o = { head: [tr('tweede schatting', 'second estimate'), DIA] };
    const A = page(b, p, 0, 2);
    const ax = axis(196, 12, 2, tr('weken', 'weeks'));
    // expert B's number: first close to A's, then (the gap) far from it
    const far = b >= 1 ? span(b === 1 ? p : 1, 0.2, 0.5) : 0;
    const two = lerp(C.TWO[0] + 1, C.TWO[1], far);
    o.second = op(A, lines(78, [[tr('tweede schatting', 'second estimate'), 'pm-big'], [tr('andere expert, zonder', 'another expert, without')], [tr('het eerste getal', 'the first number')]])
      + ax.s + dia(ax.xw(C.TWO[0]), 180, 8) + txt(ax.xw(C.TWO[0]), 166, 'A', 'pm-txt', 'middle')
      + op(at(b, p, 0, 0.4, 0.6), dia(ax.xw(two), 180, 8) + txt(ax.xw(two), 166, 'B', 'pm-txt', 'middle')));
    o.gap = op(A * at(b, p, 1), card(242, 140, 'pm-hot') + lines(268, [[tr('dichtbij: mooi', 'close: good')], [tr('ver uit elkaar: het', 'far apart: the gap is'), 'pm-on'], [tr('verschil is het gesprek', 'the conversation'), 'pm-on'], [tr('‘Wat zie jij waardoor', '‘What makes it longer')], [tr('het langer duurt?’', 'for you?’')]]));
    if (b === 2 || b === 3) {
      const B = page(b, p, 2, 4);
      o.words = op(B, lines(78, [[tr('‘drie weken als er', '‘three weeks if nothing'), 'pm-big'], [tr('niks misgaat’', 'goes wrong’'), 'pm-big'], [tr('= het beste geval', '= the best case'), 'pm-on'], [tr('maanden hetzelfde getal:', 'same number for months:')], [tr('niet bijgewerkt', 'not being updated'), 'pm-mute']]));
      o.debate = op(B * at(b, p, 3), card(220, 162) + lines(246, [[tr('experts twisten', 'experts argue'), 'pm-big'], [tr('agile: uit eigen', 'agile: forecast from')], [tr('trackrecord; of een vast', 'track record; or a firm')], [tr('getal voor het contract', 'number for the contract')], [tr('voorspelling of hoop?', 'a forecast, or a hope?'), 'pm-on']]));
    }
    if (b >= 4) {
      o.twice = op(page(b, p, 4, -1), card(52, 150, 'pm-hot') + lines(80, [[tr('‘Waardoor zou het twee', '‘What would make it'), 'pm-on'], [tr('keer zo lang duren?’', 'take twice as long?’'), 'pm-on'], [tr('komt het antwoord meteen:', 'if the answer is instant:')], [tr('in de bandbreedte', 'put it in the range'), 'pm-big']])
        + rect(X0, 232, CW * 0.4, 18, 'pm-blk', 4) + op(span(p, 0.4, 0.7), rect(X0 + CW * 0.4, 232, CW * 0.4, 18, 'pm-blk2', 4)) + op(span(p, 0.4, 0.7), txt(X0 + CW * 0.8, 276, tr('× 2', '× 2'), 'pm-on', 'middle')));
    }
    return o;
  }

  // s9: the robot cell: 6, 8, 16 gives 9; the last three cells 9, 11, 10; plan 10 to 11
  function s9(b, p) {
    const o = { head: [tr('robotcel', 'robot cell'), EX] };
    const V = C.CELL;
    const ax = axis(140, 18, 2, tr('weken', 'weeks'));
    const pts = [['O', V.o], ['M', V.m], ['P', V.p]];
    o.case2 = ax.s + pts.map(([l, v], i) => op(b > 0 ? 1 : span(p, 0.15 + i * 0.15, 0.25 + i * 0.15), dia(ax.xw(v), 140, 8) + txt(ax.xw(v), 120, l, 'pm-on', 'middle') + txt(ax.xw(v), 102, String(v), 'pm-txt', 'middle'))).join('');
    o.calc = op(at(b, p, 1), lines(196, [[`(${V.o} + 4×${V.m} + ${V.p}) ÷ 6`, 'pm-big'], [tr(`= ${V.sum} ÷ 6 = ${V.pert} weken`, `= ${V.sum} ÷ 6 = ${V.pert} weeks`), 'pm-on']]) + op(at(b, p, 1, 0.4, 0.6), dot(ax.xw(V.pert), 140, 6, 'pm-ring')));
    o.ref3 = op(at(b, p, 2), lines(252, [[tr(`laatste 3: ${V.past.join(', ')} wk`, `last 3: ${V.past.join(', ')} wk`), 'pm-on'], [tr(`${V.pert} = de optimistische kant`, `${V.pert} = the optimistic end`), 'pm-mute']])
      + V.past.map((v, i) => op(at(b, p, 2, 0.2 + i * 0.12, 0.3 + i * 0.12), dot(ax.xw(v), 162, 5, 'pm-blk'))).join(''));
    if (b === 3) o.plan = op(span(p, 0.05, 0.2), card(298, 84, 'pm-hot') + lines(324, [[tr(`plan ${V.plan[0]} tot ${V.plan[1]} weken`, `plan ${V.plan[0]} to ${V.plan[1]} weeks`), 'pm-on'], [tr('‘Waardoor sneller?’', '‘What makes it faster?’')]]));
    if (b >= 4) o.verdict = op(span(p, 0.05, 0.2), card(298, 84, 'pm-hot') + lines(324, [[tr('hergebruikte code? prima', 'reused code? fine'), 'pm-on'], [tr('anders: het langere getal', 'else: the longer figure')]]));
    if (b >= 3) o.planBar = op(b === 3 ? span(p, 0.2, 0.4) : 1, rect(ax.xw(V.plan[0]), 148, ax.xw(V.plan[1]) - ax.xw(V.plan[0]), 6, 'pm-blk', 2));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip: twelve weeks; the moments to ask (s4), the clean-up of
  // four to eight weeks and 1 March (s5), a range of 3 to 6 weeks (s6), the
  // reference class of 9 to 11 weeks and the plan (s9)
  function calendar(si, b, p) {
    const cell = (wk) => C.CELLS[wk - 1];
    const fill = (wk, cls, a = 1) => { const [x0, y0, x1, y1] = cell(wk); return op(a, rect(x0, y0, x1 - x0, y1 - y0, cls, 1)); };
    let s = '';
    const grow = (from, to, cls, a) => { for (let wk = from; wk <= to; wk++) s += fill(wk, cls, clamp(a * (to - from + 1) - (wk - from), 0, 1)); };
    if (si === 3 && b >= 3) [1, 5, 10].forEach((wk, i) => { s += fill(wk, 'pm-hot', b > 3 ? 1 : span(p, 0.08 + i * 0.15, 0.18 + i * 0.15)); });
    if (si === 4 && b >= 3) {
      grow(1, C.CLEAN[0], 'pm-hot', b > 3 ? 1 : span(p, 0.5, 0.7));
      grow(C.CLEAN[0] + 1, C.CLEAN[1], 'pm-card', b > 3 ? 1 : span(p, 0.65, 0.85));
      if (b >= 4) s += fill(10, 'pm-blk2', span(p, 0.1, 0.3));
    }
    if (si === 5 && b >= 2) {
      grow(1, C.RANGE[0], 'pm-hot', b > 2 ? 1 : span(p, 0.15, 0.35));
      grow(C.RANGE[0] + 1, C.RANGE[1], 'pm-card', b > 2 ? 1 : span(p, 0.35, 0.55));
    }
    if (si === 8 && b >= 2) {
      grow(1, C.CELL.past[0], 'pm-hot', b > 2 ? 1 : span(p, 0.15, 0.5));
      grow(C.CELL.past[0] + 1, Math.max(...C.CELL.past), 'pm-card', b > 2 ? 1 : span(p, 0.5, 0.7));
    }
    return s;
  }
  // the sheet on the table: the question set, a line per area, ticked as it is asked
  function sheet(si, b, p) {
    if (si > 4 || (si === 0 && b < 1)) return '';
    const done = [b < 2 ? 0 : 5, b < 2 ? 1 : 2, b < 2 ? 3 : 4, 5, [0, 1, 2, 4, 5][b]][si];
    const n = si === 0 ? 5 : 5;
    let s = '';
    for (let i = 0; i < n; i++) {
      s += `<path class="pm-line" d="M6 ${f1(4 + i * 4.6)}H${f1(18 - (i % 3) * 2)}"/>`;
      const y = 4 + i * 4.6;
      if (si === 4 && i === 1 && b >= 2) s += `<path class="pm-strike" d="M1.6 ${f1(y - 1.4)}l2.8 2.8M4.4 ${f1(y - 1.4)}l-2.8 2.8"/>`;
      else if (si > 0 && i < done) s += op(si === 4 && i === done - 1 ? span(p, 0.2, 0.5) : 1, `<path class="pm-line" d="M2 ${f1(y)}l1.2 1.2l2.2 -2.6"/>`);
    }
    return s;
  }
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    let mini = '';
    for (const c of CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.pExtra, (o.stripNote || '') + (o.planBar || ''));
    set(E.bMini, mini + (o.planBar || ''));
    set(E.cMarks, calendar(si, b, p));
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
