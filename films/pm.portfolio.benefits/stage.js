// The stage of the film "Van resultaat tot baten / From output to benefits": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and
// a preamble from build.mjs that defines C (the lesson's numbers, the monthly
// sketch of s5, the panel's blocks), CAM (one camera move per scene), W and H.
// Moves are placed per Dutch caption beat (beatStarts), so a video's narration
// timing (films/_kit/beatwarp.js) keeps them in step. The panel at the right is
// drawn here each frame, every block in its own cue group (o[key] goes into
// data-k "p_<key>"); the board in the room repeats the panel in miniature and
// the sheet on the table is the written baseline, then the close-out plan.
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
  const txt = (x, y, t, cls = 'pb-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="22" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const dot = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  const XM = (X0 + X1) / 2;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pb-txt') : '')).join('');
  const card = (y, h, cls = 'pb-card') => rect(X0 - 6, y, X1 - X0 + 12, h, cls, 8);
  const down = (y0, y1) => path(`M${f1(XM)} ${f1(y0)}V${f1(y1)}M${f1(XM - 6)} ${f1(y1 - 7)}L${f1(XM)} ${f1(y1)}L${f1(XM + 6)} ${f1(y1 - 7)}`, 'pb-arrow');
  const right = (x0, x1, y) => path(`M${f1(x0)} ${f1(y)}H${f1(x1)}M${f1(x1 - 7)} ${f1(y - 6)}L${f1(x1)} ${f1(y)}L${f1(x1 - 7)} ${f1(y + 6)}`, 'pb-arrow');
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  const first = (b, p) => span(b === 0 ? p : 1, 0.06, 0.3);

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

  // a block of the chain: a card with a title and value lines, an owner tag at the right
  function block(y, h, title, vals, hot, tag) {
    return card(y, h, hot ? 'pb-hot' : 'pb-card') + lines(y + 24, [[title, 'pb-lab'], ...vals.map((v) => [v])]) + (tag ? txt(X1, y + 24, tag, 'pb-on', 'end') : '');
  }

  // ------------------------------------------------------------ the scenes
  // Each returns o: the panel's blocks by cue key, plus head [title, 'ex' | 'dia'].
  const S = [];
  // s1: output, outcome, benefits as a chain; the project and the line
  S[0] = (b, p) => {
    const own = at(b, p, 3);
    return {
      head: [tr('output → baten', 'output → benefit'), 'dia'],
      output: op(first(b, p), block(54, 62, 'output', [tr('wat het project oplevert', 'what the project delivers')], b === 0)),
      outcome: op(at(b, p, 1), down(118, 136) + block(138, 62, tr('uitkomst', 'outcome'), [tr('verandering in prestatie', 'change in performance')], b === 1)),
      benefit: op(at(b, p, 2), down(202, 220) + block(222, 88, tr('baten', 'benefit'), [tr('meetbare winst voor', 'measurable gain for'), tr('de organisatie', 'the organisation')], b === 2)),
      owners: op(own, txt(X1, 78, 'project', 'pb-on', 'end') + txt(X1, 162, tr('lijn', 'line'), 'pb-on', 'end') + txt(X1, 246, tr('lijn', 'line'), 'pb-on', 'end')
        + card(326, 60, 'pb-hot') + lines(350, [[tr('project levert output;', 'the project: output;'), 'pb-on'], [tr('lijn: uitkomst + baten', 'line: outcome + benefit'), 'pb-on']])),
    };
  };
  // s2: the readiness check through the chain, its sum, and who brings it in
  S[1] = (b, p) => ({
    head: [tr('de check', 'readiness check'), 'ex'],
    exOut: op(first(b, p), block(54, 60, 'output', [tr('de check gaat live', 'the check goes live')], b === 0)),
    exOc: op(at(b, p, 1), down(116, 132) + block(134, 60, tr('uitkomst', 'outcome'), [tr('afzeggingen 14% → 8%', 'cancellations 14% → 8%')], b === 1)),
    exBen: op(at(b, p, 2), down(196, 212) + block(214, 86, tr('baten', 'benefit'), [tr('≈ 1.200 ploegdagen', '≈ 1,200 crew-days'), tr('per jaar minder', 'fewer a year')], b === 2)),
    exSum: op(at(b, p, 3), card(312, 72, 'pb-hot') + lines(336, [[tr('× € 750 per ploegdag', '× €750 per crew-day')], [tr('= € 900k per jaar', '= €900k a year'), 'pb-on']])),
    exOwn: op(at(b, p, 4), txt(X1, 78, 'project', 'pb-on', 'end') + txt(X1, 158, tr('lijn', 'line'), 'pb-on', 'end') + txt(X1, 238, tr('lijn', 'line'), 'pb-on', 'end')),
  });
  // s3: a timeline: the benefit owner named before the start and staying; the project lead leaving at closing
  S[2] = (b, p) => {
    const TX0 = 346;
    const TX1 = 610;
    const xs = 404;
    const xc = 524;
    const bar = (x0, x1, y, cls) => rect(x0, y, x1 - x0, 12, cls, 4);
    const own = first(b, p);
    const ownX = lerp(xs - 34, TX1 - 8, span(b === 0 ? p : 1, 0.15, 0.7));
    return {
      head: [tr('batenhouder', 'benefit owner'), 'dia'],
      axis: path(`M${TX0} 300H${TX1}`, 'pb-axis') + path(`M${xs} 292V308M${xc} 292V308`, 'pb-axis')
        + txt(xs, 330, 'start', 'pb-mute', 'middle') + txt(xc, 330, tr('afsluiting', 'closing'), 'pb-mute', 'middle'),
      ownerBar: op(own, txt(xs - 34, 182, tr('batenhouder', 'benefit owner'), 'pb-lab') + bar(xs - 34, ownX, 192, 'pb-bar2') + right(ownX - 2, ownX + 10, 198)
        + dot(xs - 34, 198, 5, 'pb-hotdot') + txt(X0, 372, tr('naam vóór de start', 'named before the start'), 'pb-on')),
      kpi: op(at(b, p, 1), card(54, 92, 'pb-card') + lines(78, [[tr('een lijnmanager:', 'a line manager:'), 'pb-lab'], [tr('op zijn budget of KPI', 'whose budget or KPI')], [tr('landt het', 'carries it')]])),
      plBar: op(at(b, p, 2), txt(xs, 240, tr('projectleider', 'project lead'), 'pb-txt') + bar(xs, xc, 250, 'pb-bar') + txt(xc + 6, 262, tr('vertrekt', 'leaves'), 'pb-on')),
    };
  };
  // s4: the baseline, its questions, signed off; without it, arguments
  S[3] = (b, p) => ({
    head: [tr('nulmeting', 'baseline'), 'dia'],
    base: op(first(b, p), card(54, 88, b === 0 ? 'pb-hot' : 'pb-card') + lines(78, [[tr('nulmeting', 'baseline'), 'pb-lab'], [tr('startwaarde, en precies', 'starting value, and')], [tr('hoe je die meet', 'exactly how to measure')]])),
    qs: op(at(b, p, 1), lines(176, [[tr('hoe tel je een afzegging?', 'counting a cancellation?')], [tr('over welke periode?', 'over which period?')], [tr('stormweken mee of niet?', 'storm weeks in or out?')]])),
    sign: op(at(b, p, 2), card(250, 40, 'pb-hot') + txt(X0, 277, tr('op papier, controller ✓', 'written, controller ✓'), 'pb-on')),
    nobase: op(at(b, p, 3), lines(326, [[tr('zonder nulmeting:', 'without a baseline:'), 'pb-lab'], [tr('discussie over definities', 'argue about definitions')]])),
  });
  // s5: monthly points after go-live, check-ins at 3 and 6, the trigger line, the close-out plan
  S[4] = (b, p) => {
    const xM = (m) => 356 + m * 20.5;
    const yV = (v) => 262 - (v - 7.4) * 52;
    const yL = yV(C.LINE);
    const n = b < 1 ? 0 : b === 1 ? span(p, 0.1, 0.9) * (C.MONTHLY.length - 2 + 0.99) : b === 2 ? C.MONTHLY.length - 2 + span(p, 0.05, 0.5) * 2 : C.MONTHLY.length;
    let d = '';
    let dots = '';
    C.MONTHLY.forEach((v, i) => {
      const a = clamp(n - i, 0, 1);
      if (a <= 0.01) return;
      d += `${d ? 'L' : 'M'}${f1(xM(i + 1))} ${f1(yV(v))}`;
      dots += op(a, dot(xM(i + 1), yV(v), 3.6, v > C.LINE ? 'pb-hotdot' : 'pb-dot'));
    });
    return {
      head: [tr('na de livegang', 'after go-live'), 'dia'],
      span: op(first(b, p), path(`M${f1(xM(0))} 270H${f1(xM(12))}`, 'pb-axis') + path(`M${f1(xM(0))} 262V278M${f1(xM(12))} 262V278`, 'pb-axis')
        + txt(xM(0), 296, tr('livegang', 'go-live'), 'pb-mute') + txt(xM(12), 296, tr('12 mnd', '12 mo'), 'pb-mute', 'end')
        + path(`M${f1(xM(0))} 84V92H${f1(xM(6))}V84`, 'pb-line') + path(`M${f1(xM(6))} 92H${f1(xM(12))}V84`, 'pb-dash') + txt(X1, 76, tr('volgen: 6–12 maanden', 'track: 6–12 months'), 'pb-on', 'end')),
      monthly: (d ? path(d, 'pb-line') : '') + dots + op(at(b, p, 1, 0.5, 0.7), txt(X1, 318, tr('elke maand', 'monthly'), 'pb-txt', 'end')),
      checks: op(at(b, p, 1, 0.2, 0.45), C.TRACK.checks.map((m) => path(`M${f1(xM(m))} ${f1(yL + 8)}V266`, 'pb-dash') + txt(xM(m), 318, `${m}`, 'pb-on', 'middle')).join('')
        + txt(xM(4.5), 344, 'check-ins', 'pb-on', 'middle')),
      trig: op(at(b, p, 2), path(`M${f1(xM(0))} ${f1(yL)}H${f1(xM(12))}`, 'pb-trig') + txt(xM(0) + 2, yL - 8, 'trigger', 'pb-on')
        + op(at(b, p, 2, 0.5, 0.7), txt(X1, 118, tr('2× erover: ingrijpen', '2× past: act'), 'pb-on', 'end'))),
      plan: op(at(b, p, 3), card(354, 32, 'pb-hot') + txt(X0, 377, tr('afsluitplan: namen, data', 'close-out: names, dates'), 'pb-on')),
    };
  };
  // s6: attribution: the drop split into the check's 60–70% and the rest; a comparison region; a modest number
  S[5] = (b, p) => {
    const BX0 = 340;
    const BX1 = 612;
    const bx = (f) => BX0 + (BX1 - BX0) * f;
    const y0 = 148;
    return {
      head: [tr('eerlijk claimen', 'honest claims'), 'dia'],
      attr: op(first(b, p), lines(76, [[tr('toerekening:', 'attribution:'), 'pb-lab'], [tr('hoeveel is van jou?', 'how much is yours?')]])),
      drop: op(first(b, p), txt(BX0, y0 - 10, tr('daling 14% → 8%', 'drop 14% → 8%'), 'pb-txt') + rect(BX0, y0, BX1 - BX0, 26, 'pb-rest', 4)),
      est: op(at(b, p, 2), rect(BX0, y0, bx(C.SHARE[0] / 100) - BX0, 26, 'pb-bar2', 4) + rect(bx(C.SHARE[0] / 100), y0, bx(C.SHARE[1] / 100) - bx(C.SHARE[0] / 100), 26, 'pb-band', 2)
        + txt(BX0, y0 + 76, tr('check: 60–70%', 'check: 60–70%'), 'pb-on') + txt(BX0, y0 + 102, tr('+ laat zien waarom', '+ show why'), 'pb-txt')),
      contractor: op(at(b, p, 1), txt(BX1, y0 + 50, tr('aannemer?', 'contractor?'), 'pb-lab', 'end')),
      region: op(at(b, p, 3), lines(276, [[tr('sterkste bewijs:', 'cleanest evidence:'), 'pb-lab'], [tr('regio zonder de check,', 'a region without it,')], [tr('dezelfde maanden', 'same months')]])),
      modest: op(at(b, p, 4), card(344, 42, 'pb-hot') + txt(X0, 372, tr('klein maar verdedigbaar', 'modest, defensible'), 'pb-on')),
    };
  };
  // s7: boards sceptical; the programme view; a number that slides back after closing; the sharp question
  S[6] = (b, p) => {
    const LX0 = 344;
    const LX1 = 612;
    const vals = [270, 268, 272, 262, 246, 228, 214, 212, 216, 226, 240, 252, 262, 266];
    const iClose = 7;
    const xi = (i) => LX0 + i * ((LX1 - LX0) / (vals.length - 1));
    const shown = b < 2 ? 0 : b === 2 ? span(p, 0.05, 0.85) * (vals.length + 0.99) : vals.length;
    let d = '';
    vals.forEach((v, i) => { if (shown - i > 0.01) d += `${d ? 'L' : 'M'}${f1(xi(i))} ${f1(v)}`; });
    return {
      head: [tr('weglekken', 'benefits leak'), 'dia'],
      sceptic: op(first(b, p), lines(76, [[tr('terecht sceptisch:', 'sceptical, rightly:'), 'pb-lab'], [tr('baten vallen vaak tegen', 'benefits fall short')]])),
      scope: op(at(b, p, 1), lines(140, [[tr('hier: programma, portfolio', 'here: programme, portfolio'), 'pb-on'], [tr('één project: Landen', 'one project: Land'), 'pb-mute']])),
      leak: op(at(b, p, 2, 0, 0.1), path(`M${LX0} 282H${LX1}`, 'pb-axis') + path(`M${f1(xi(iClose))} 200V290`, 'pb-dash') + txt(xi(iClose), 196, tr('afsluiting', 'closing'), 'pb-mute', 'middle')
        + (d ? path(d, 'pb-line') : '') + op(at(b, p, 2, 0.75, 0.9), txt(LX1, 310, tr('oude manier sluipt terug', 'the old way creeps back'), 'pb-on', 'end'))),
      ask: op(at(b, p, 3), card(326, 60, 'pb-hot') + lines(350, [[tr('wie kijkt volgende maand?', 'who looks next month?'), 'pb-on'], [tr('en wat doet die dan?', 'and what then?'), 'pb-on']])),
    };
  };
  // s8: the changeover project: 90 → 45 at closing, back to 70; 300k promised; capacity unused
  S[7] = (b, p) => {
    const bx0 = 410;
    const sc = 1.8;
    const row = (y, lab, v, cls, a) => txt(X0, y, lab, 'pb-mute') + rect(bx0, y - 15, v * sc * a, 18, cls, 3) + op(a, txt(bx0 + v * sc + 6, y, `${v}`, 'pb-txt'));
    return {
      head: [tr('de € 300k', 'the €300k'), 'ex'],
      case: op(first(b, p), txt(X0, 76, tr('omsteltijd, minuten', 'changeover, minutes'), 'pb-lab')
        + row(106, tr('voor', 'before'), C.CHANGE[0], 'pb-bar', span(b === 0 ? p : 1, 0.15, 0.45)) + row(134, tr('maart', 'March'), C.CHANGE[1], 'pb-bar2', span(b === 0 ? p : 1, 0.45, 0.75))),
      promise: op(at(b, p, 1), lines(210, [[tr('beloofd: € 300k per jaar', 'promised: €300k a year')], [tr('sept., CFO: waar is het?', 'Sept., CFO: where is it?'), 'pb-on']])),
      crept: op(at(b, p, 2), row(162, tr('sept.', 'Sept.'), C.CHANGE[2], 'pb-bar', span(b === 2 ? p : 1, 0.1, 0.5)) + op(at(b, p, 2, 0.5, 0.65), txt(X1, 162, tr('1', '1'), 'pb-on', 'end'))),
      unused: op(at(b, p, 3), card(270, 112, 'pb-card') + txt(X1, 294, '2', 'pb-on', 'end') + lines(294, [[tr('capaciteit niet benut:', 'capacity never used:'), 'pb-lab'], [tr('geen extra volume,', 'no extra volume,')], [tr('weekenddienst draait', 'weekend shift kept')], [tr('gewoon door', 'running')]])),
    };
  };
  // s9: two problems pulled apart; the choice to the MT; book only after the decision; tell the CFO
  S[8] = (b, p) => ({
    head: [tr('2 problemen', 'two problems'), 'ex'],
    fixOc: op(first(b, p), lines(76, [[tr('1 uitkomst weggezakt:', '1 outcome slipped:'), 'pb-lab'], [tr('operationeel manager,', 'operations manager:')], [tr('audit + maandreview', 'audit + monthly review')]])),
    money: op(at(b, p, 1), lines(166, [[tr('2 bij 45 min: geen baten', '2 at 45 min: no benefit'), 'pb-lab'], [tr('capaciteit ≠ geld', 'capacity ≠ money')]])),
    choice: op(at(b, p, 2), lines(230, [[tr('MT kiest, met getallen:', 'MT decides, with numbers:'), 'pb-lab'], [tr('weekenddienst eraf', 'cut the weekend shift')], [tr('of meer volume verkopen', 'or sell more volume')]])),
    book: op(at(b, p, 3), card(296, 60, 'pb-hot') + lines(320, [[tr('1 batenhouder + controller', '1 owner + controller'), 'pb-txt'], [tr('€ 300k pas na besluit', '€300k only after that'), 'pb-on']])),
    direct: op(at(b, p, 4), txt(X0, 380, tr('tegen de CFO: direct', 'to the CFO: directly'), 'pb-on')),
  });

  // the sheet on the table: the baseline written down (s4 b3 on), signed; the close-out plan (s5 b4)
  function sheet(si, b, p) {
    const n = si < 3 ? 0 : si === 3 ? (b < 2 ? 0 : span(b === 2 ? p : 1, 0.1, 0.7) * 6) : si === 4 && b >= 3 ? 6 + span(p, 0.1, 0.6) * 3 : si === 4 ? 6 : 9;
    let s = '';
    for (let i = 0; i < 9; i++) {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += `<path class="pb-row" d="M2.5 ${f1(4 + i * 2.6)}H${f1(2.5 + (15 - (i % 3) * 2) * a)}"/>`;
    }
    if (si > 3 || (si === 3 && b >= 2 && p > 0.6)) s += '<path class="pb-tick" d="M12 25l2 2l4 -5"/>';
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = S[si](b, p);
    const lab = o.head[1] === 'dia' ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    set(E.pHead, txt(X0, 38, o.head[0], 'pb-big') + txt(X1, 38, lab, 'pb-mute', 'end'));
    let mini = '';
    for (const c of C.SLOTS) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
