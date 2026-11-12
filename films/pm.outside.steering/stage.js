// The stage of the film "Voortgang zien zonder vakkennis / Seeing progress
// without the expertise": a pure function of (scene, u). Inlined into the page
// after the anatomy kit and a preamble from build.mjs that defines C (the
// calendar cells, the numbers of the two worked examples), CAM (one camera
// move per scene), W and H. Moves are placed per caption beat (beatStarts), so
// the video's narration timing (films/_kit/beatwarp.js) keeps them in step.
// The panel at the right gets one card per scene, each block in its own cue
// group (o[key] goes into data-k "p_<key>"), all text at 22 units (a video
// film). The board in the room repeats the card in miniature, the calendar
// strip on the side wall carries the weeks (milestones as diamonds, a demo
// every two weeks, the third milestone in two weeks, the four weeks until the
// load figures), and the sheet on the table is the signed test report, then
// the six milestones ticked by their evidence, then the decision memo.
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
  const dia = (x, y, s = 9, cls = 'pm-dia') => path(`M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z`, cls);
  const tick = (x, y, cls = 'pm-line') => path(`M${f1(x - 7)} ${f1(y)}l5 5l10 -11`, cls);
  const cross = (x, y, cls = 'pm-strike') => path(`M${f1(x - 6)} ${f1(y - 6)}l12 12M${f1(x + 6)} ${f1(y - 6)}l-12 12`, cls);
  // an arrow from x0 to x1 at y, with a head at x1 (and at x0 when both)
  const arrow = (x0, x1, y, both = false) => path(`M${f1(x0)} ${f1(y)}H${f1(x1)}M${f1(x1 - 8)} ${f1(y - 6)}L${f1(x1)} ${f1(y)}L${f1(x1 - 8)} ${f1(y + 6)}`
    + (both ? `M${f1(x0 + 8)} ${f1(y - 6)}L${f1(x0)} ${f1(y)}L${f1(x0 + 8)} ${f1(y + 6)}` : ''), 'pm-line');
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  // rows with a bullet (a small diamond) from y down, 26 apart
  const bullets = (y, list, a = 1) => list.map((t, i) => op(a, dia(X0 + 7, y + i * 26 - 7, 5) + txt(X0 + 20, y + i * 26, t))).join('');
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
  // s1: you can't judge the work; done or not done; the milestone; yes or no
  function s1(b, p) {
    const o = { head: [tr('wat af is', 'what is done'), DIA] };
    const A = page(b, p, 0, 2);
    o.judge = op(A, card(52, 100) + lines(80, [[tr('het werk zelf?', 'the work itself?'), 'pm-big'], [tr('niet te beoordelen', 'you can’t judge it')], [tr('buiten je vak', 'outside your field'), 'pm-mute']]));
    o.done = op(A * at(b, p, 1), lines(196, [[tr('meet wat af is', 'measure what’s done'), 'pm-big'], [tr('af of niet af,', 'done or not done,')], [tr('met bewijs dat', 'with evidence')], [tr('je kunt zien', 'you can see'), 'pm-on']])
      + op(at(b, p, 1, 0.3, 0.5), tick(X1 - 40, 250) + cross(X1 - 12, 250)));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.mile = op(B, lines(80, [[tr('mijlpaal', 'milestone'), 'pm-big'], [tr('een punt waarop een', 'a point where a')], [tr('duidelijk resultaat', 'clear result has')], [tr('er moet zijn', 'to exist')]]) + dia(X1 - 12, 73, 10));
      o.mileex = op(B * at(b, p, 3), card(180, 116) + lines(206, [[tr('‘koppeling getest', '‘interface tested')], [tr('met echte orders’', 'with real orders’')], [tr('‘schakelinstallatie', '‘switchgear')], [tr('onder spanning’', 'energised’')]]));
      o.yesno = op(at(b, p, 4), card(306, 76, 'pm-hot') + lines(334, [[tr('ja of nee,', 'yes or no,'), 'pm-on'], [tr('geen percentage', 'not a percentage')]]));
    }
    return o;
  }

  // s2: percent complete, an opinion stalling near 90%; budget spent; count milestones with evidence
  function s2(b, p) {
    const o = { head: [tr('tel wat bewezen is', 'count the proof'), DIA] };
    const A = page(b, p, 0, 3);
    o.pct = op(A, lines(80, [[tr('percentage gereed', 'percent complete'), 'pm-big'], [tr('deel dat af zou zijn', 'share said finished')], [tr('de zwakste maat', 'the weakest measure'), 'pm-mute']]));
    if (b >= 1) {
      // the bar creeps to 90% and stalls there
      const q = b === 1 ? p : 1;
      const fill = lerp(0, 0.9, span(q, 0.05, 0.4));
      o.stuck = op(A, rect(X0, 152, CW, 20, 'pm-card', 4) + rect(X0, 152, CW * fill, 20, 'pm-blk', 4)
        + op(span(q, 0.3, 0.45), txt(X0 + CW * 0.9, 198, `${C.INFO.late}%`, 'pm-on', 'middle'))
        + lines(226, [[tr('een mening; blijft', 'an opinion; it')], [tr('hangen rond 90%', 'stalls near 90%'), 'pm-on']]));
    }
    o.budget = op(A * at(b, p, 2), card(278, 104) + lines(304, [[tr('budget uitgegeven:', 'budget spent:'), 'pm-big'], [tr('over geld, niet', 'money, not')], [tr('over voortgang', 'progress'), 'pm-on']]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.count = op(B, lines(80, [[tr('tel mijlpalen', 'count milestones'), 'pm-big'], [tr('die af zijn, pas', 'that are done, only')], [tr('als bewijs er is', 'once evidence exists'), 'pm-on']])
        + [0, 1, 2].map((i) => op(at(b, p, 3, 0.3 + i * 0.12, 0.42 + i * 0.12), dia(X0 + 14 + i * 40, 176, 10) + tick(X0 + 14 + i * 40, 202))).join(''));
      o.proof = op(at(b, p, 4), card(224, 158, 'pm-hot') + lines(252, [[tr('bewijs:', 'evidence:'), 'pm-on'], [tr('getekend testrapport', 'signed test report')], [tr('een demo', 'a demo')], [tr('goedgekeurde tekening', 'approved drawing')]]));
    }
    return o;
  }

  // s3: acceptance criteria, the label example, agreed; the definition of done; the Scrum Guide
  function s3(b, p) {
    const o = { head: [tr('wanneer is het af?', 'when is it done?'), DIA] };
    const A = page(b, p, 0, 3);
    o.accept = op(A, lines(80, [[tr('acceptatiecriteria', 'acceptance criteria'), 'pm-big'], [tr('voorwaarden om te', 'conditions to be')], [tr('accepteren, vooraf', 'accepted, written')], [tr('opgeschreven', 'before work starts'), 'pm-mute']]));
    o.label = op(A * at(b, p, 1), card(184, 100) + lines(210, [[tr('label print in < 3 s', 'label prints in < 3 s'), 'pm-on'], [tr('12 van 12 velden', '12 of 12 fields')], [tr('kloppen met order', 'match the order')]]));
    o.agree = op(A * at(b, p, 2), card(294, 88, 'pm-hot') + lines(322, [[tr('afspreken met', 'agree with the'), 'pm-on'], [tr('expert en gebruiker', 'expert and the user')]]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      const items = [tr('getest', 'tested'), tr('gedocumenteerd', 'documented'), tr('gereviewd', 'reviewed')];
      o.dod = op(B, lines(80, [['definition of done', 'pm-big'], [tr('gedeelde norm om', 'shared standard to')], [tr('als af te tellen', 'count as finished')]])
        + items.map((t, i) => op(at(b, p, 3, 0.4 + i * 0.12, 0.52 + i * 0.12), tick(X0 + 10, 168 + i * 26 - 7) + txt(X0 + 30, 168 + i * 26, t))).join(''));
      o.scrum = op(at(b, p, 4), card(262, 120, 'pm-hot') + lines(290, [[tr('uit de Scrum Guide', 'from the Scrum Guide'), 'pm-on'], [tr('meestal een korte', 'mostly a short')], [tr('checklist; elk project', 'checklist; any project')]]));
    }
    return o;
  }

  // s4: FAT at the supplier, SAT on site, open points; demos; months apart; two weeks
  function s4(b, p) {
    const o = { head: [tr('FAT, SAT, demo’s', 'FAT, SAT, demos'), DIA] };
    const A = page(b, p, 0, 3);
    o.fat = op(A, lines(80, [[tr('fabrieksacceptatie-', 'factory acceptance'), 'pm-big'], [tr('test (FAT): bij de', 'test (FAT): at the')], [tr('leverancier, voor', 'supplier, before')], [tr('verzending', 'shipping')]]));
    o.sat = op(A * at(b, p, 1), lines(192, [[tr('locatieacceptatie-', 'site acceptance'), 'pm-big'], [tr('test (SAT): na', 'test (SAT): after')], [tr('installatie, klant', 'installing on site')]]) + op(at(b, p, 1, 0.3, 0.5), arrow(X1 - 70, X1 - 4, 184)));
    o.punch = op(A * at(b, p, 2), card(276, 106, 'pm-hot') + lines(302, [[tr('FAT met open punten:', 'FAT with open points:'), 'pm-on'], [tr('gewoon; elk punt een', 'common; each one an')], [tr('eigenaar en datum', 'owner and a date')]]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.demo = op(B, lines(80, [[tr('demo’s: beste meter', 'demos: best meter'), 'pm-big'], [tr('regelmatig, kort,', 'regular, short,')], [tr('met echte data', 'with real data')], [tr('1 per 2 weken zegt', '1 every 2 weeks says'), 'pm-on'], [tr('> 10 statusrapporten', '> 10 status reports'), 'pm-on']]));
      o.gap = op(at(b, p, 4), lines(232, [[tr('fout: maanden niets', 'failure: months blank'), 'pm-mute'], [tr('regel: elke 2 à 4 wk', 'rule: every 2 to 4 wk'), 'pm-on']])
        + Array.from({ length: 12 }, (_, i) => rect(X0 + i * 23.6, 272, 20, 14, i % 3 === 2 ? 'pm-blk' : 'pm-card', 2)).join(''));
      o.ask = op(at(b, p, 5), card(298, 84, 'pm-hot') + lines(326, [[tr('‘Wat laat je me', '‘What can you show'), 'pm-on'], [tr('over 2 weken zien?’', 'me in two weeks?’'), 'pm-on']]));
    }
    return o;
  }

  // s5: the MES supplier's 70%: six milestones, their evidence, two proven, report 2 of 6
  function s5(b, p) {
    const o = { head: [tr('70% gereed', 'seventy percent'), EX] };
    const M = C.MES;
    o.claim = op(page(b, p, 0, 1), card(52, 76) + lines(80, [[tr('MES-leverancier:', 'MES supplier:')], [tr(`‘${M.claim}% gereed’`, `‘${M.claim}% complete’`), 'pm-big']]));
    const miles = [tr('ontwerp goedgekeurd', 'design approved'), tr('testomgeving draait', 'test system running'), tr('stamgegevens geladen', 'master data loaded'),
      tr('koppeling getest', 'interface tested'), tr('schermen geaccepteerd', 'screens accepted'), tr('generale repetitie', 'go-live rehearsal')];
    const proofs = [tr('getekend ontwerp', 'signed design'), tr('een demo', 'a demo'), tr('datacontrole', 'data check'),
      tr('testrapport', 'test report'), tr('akkoord gebruikers', 'user sign-off'), tr('verslag repetitie', 'rehearsal report')];
    const row = (i, t, a, cls) => op(a, txt(X0 + 8, 80 + i * 26, String(i + 1), 'pm-on', 'middle') + txt(X0 + 26, 80 + i * 26, t, cls));
    if (b >= 1) {
      o.m6 = op(page(b, p, 1, 2), miles.map((t, i) => row(i, t, b > 1 ? 1 : span(p, 0.08 + i * 0.1, 0.18 + i * 0.1))).join(''));
    }
    if (b >= 2) {
      o.ev = op(page(b, p, 2, -1), proofs.map((t, i) => row(i, t, b > 2 ? 1 : span(p, 0.08 + i * 0.1, 0.18 + i * 0.1), b >= 3 && i >= M.proven.length ? 'pm-mute' : 'pm-txt')).join(''));
    }
    if (b >= 3) {
      o.tally = op(span(b === 3 ? p : 1, 0.05, 0.3), M.proven.map((n) => tick(X1 - 12, 80 + (n - 1) * 26 - 7)).join('') + txt(X1 - 10, 80 + (M.open - 1) * 26, '?', 'pm-on', 'middle')
        + card(236, 56) + lines(258, [[tr('bewijs: alleen 1 en 2', 'evidence: only 1, 2'), 'pm-on'], [tr('3 ‘bijna klaar’', '3 ‘almost done’'), 'pm-mute']]));
    }
    if (b >= 4) {
      o.report = op(span(p, 0.05, 0.25), card(298, 86, 'pm-hot') + lines(322, [[tr('meld 2 van 6, de 3e', 'report 2 of 6, the 3rd'), 'pm-on'], [tr('over twee weken', 'in two weeks')], [tr('70% = inspanning', '70% = effort spent'), 'pm-mute']]));
    }
    return o;
  }

  // s6: rarely certainty; the reversible decision; two doors; 70% not 90%; one-way: lead time; slow down
  function s6(b, p) {
    const o = { head: [tr('welke deur?', 'which door?'), DIA] };
    const A = page(b, p, 0, 2);
    o.skill = op(A, lines(80, [[tr('zelden zekerheid', 'rarely certainty'), 'pm-big'], [tr('beslis goed met wat', 'decide well with')], [tr('je hebt; weet wanneer', 'what you have; know')], [tr('het niet aan jou is', 'when it isn’t yours')]]));
    o.rev = op(A * at(b, p, 1), card(200, 92, 'pm-hot') + lines(228, [[tr('omkeerbaar besluit:', 'reversible decision:'), 'pm-on'], [tr('goedkoop terug', 'cheap to undo')], [tr('te draaien', ''), '']]));
    if (b === 2 || b === 3) {
      const B = page(b, p, 2, 4);
      o.doors = op(B, lines(80, [[tr('eenrichtingsdeur', 'one-way door'), 'pm-big'], [tr('onomkeerbaar', 'irreversible'), 'pm-mute']]) + arrow(X1 - 52, X1 - 4, 73)
        + lines(140, [[tr('tweerichtingsdeur', 'two-way door'), 'pm-big'], [tr('omkeerbaar', 'reversible'), 'pm-mute']]) + arrow(X1 - 52, X1 - 4, 133, true)
        + txt(X0, 200, tr('Bezos, brief over 2015', 'Bezos, letter for 2015'), 'pm-mute'));
      o.seventy = op(B * at(b, p, 3), card(220, 140, 'pm-hot') + lines(248, [[tr('tweerichting: snel', 'two-way: decide fast'), 'pm-on'], [tr('beslissen en leren', 'and learn')], [tr(`${C.INFO.enough}% info, niet ${C.INFO.late}%`, `${C.INFO.enough}% info, not ${C.INFO.late}%`)], [tr('een vuistregel', 'a rule of thumb'), 'pm-mute']]));
    }
    if (b >= 4) {
      const Cc = page(b, p, 4, -1);
      o.lead = op(Cc, lines(80, [[tr('eenrichtingsdeur', 'one-way door'), 'pm-big'], [tr('schakelinstallatie', 'switchgear with a')], [tr('met lange levertijd,', 'long lead time, or')], [tr('of oud systeem uit', 'old system off')]])
        + lines(200, [[tr('levertijd: van', 'lead time: from'), 'pm-mute'], [tr('bestelling tot levering', 'order to delivery'), 'pm-mute']]));
      o.slow = op(at(b, p, 5), card(256, 126, 'pm-hot') + lines(282, [[tr('vertraag:', 'slow down:'), 'pm-on'], [tr('meer bewijs', 'more evidence')], [tr('second opinion', 'a second opinion')], [tr('de sponsor beslist', 'the sponsor decides')]]));
    }
    return o;
  }

  // s7: escalation; not failure; when; early, with options
  function s7(b, p) {
    const o = { head: [tr('escaleren', 'escalating'), DIA] };
    const A = page(b, p, 0, 2);
    o.esc = op(A, lines(80, [[tr('escalatie', 'escalation'), 'pm-big'], [tr('voorleggen aan wie', 'to someone with')], [tr('meer bevoegdheid heeft,', 'more authority,')], [tr('omdat het buiten', 'because it is')], [tr('de jouwe valt', 'beyond yours')]])
      + arrow(X1 - 40, X1 - 4, 73));
    o.system = op(A * at(b, p, 1), card(232, 88, 'pm-hot') + lines(260, [[tr('geen falen: het', 'not failure: the'), 'pm-on'], [tr('systeem dat werkt', 'system working'), 'pm-on']]));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.when = op(B, txt(X0, 80, tr('escaleer als', 'escalate when'), 'pm-big')
        + bullets(112, [tr('buiten je mandaat', 'outside your mandate'), tr('experts zitten vast', 'experts are stuck'), tr('doel, budget of datum', 'goal, budget or date')], 1)
        + txt(X0 + 20, 190, tr('in gevaar', 'at risk')));
      o.opts = op(at(b, p, 3), card(222, 160, 'pm-hot') + lines(250, [[tr('vroeg, met opties:', 'early, with options:'), 'pm-on'], [tr('‘twee opties, wat', '‘two options, what')], [tr('elk kost, en mijn', 'each costs, and my')], [tr('advies’', 'recommendation’')], [tr('niet alleen probleem', 'not just a problem'), 'pm-mute']]));
    }
    return o;
  }

  // s8: the decision memo; consequences; state it clearly; calm, firm; failures; the sharp question
  function s8(b, p) {
    const o = { head: [tr('één A4', 'one page'), DIA] };
    const A = page(b, p, 0, 2);
    const parts = [tr('vraag', 'question'), tr('opties', 'options'), tr('criteria', 'criteria'), tr('advies experts', 'expert advice'), tr('jouw aanbeveling', 'recommendation'), tr('deadline', 'deadline')];
    o.memo = op(A, txt(X0, 80, tr('beslisnotitie', 'decision memo'), 'pm-big') + txt(X1, 80, tr('1 A4', '1 page'), 'pm-mute', 'end')
      + parts.map((t, i) => op(span(b === 0 ? p : 1, 0.1 + i * 0.1, 0.2 + i * 0.1), dia(X0 + 7, 112 + i * 26 - 7, 5) + txt(X0 + 20, 112 + i * 26, t))).join(''));
    o.conseq = op(A * at(b, p, 1), card(270, 112, 'pm-hot') + lines(298, [[tr('dwingt je techniek', 'forces you: technical'), 'pm-on'], [tr('te vertalen naar', 'part translated')], [tr('gevolgen', 'into consequences'), 'pm-big']]));
    if (b === 2 || b === 3) {
      const B = page(b, p, 2, 4);
      o.power = op(B, lines(80, [[tr('breng het helder,', 'state it clearly,'), 'pm-big'], [tr('zonder excuus', 'without apology')], [tr('Pfeffer, 7 Rules', 'Pfeffer, 7 Rules'), 'pm-mute'], [tr('of Power:', 'of Power:'), 'pm-mute'], ['‘show up in powerful', 'pm-on'], ['fashion’', 'pm-on']]));
      o.sorry = op(B * at(b, p, 3), card(250, 110, 'pm-hot') + lines(278, [[tr('rustig en stevig', 'calm and firm'), 'pm-on'], [tr('niet: ‘sorry,', 'not: ‘sorry,')], [tr('misschien…’', 'maybe…’')]])
        + op(at(b, p, 3, 0.4, 0.6), path(`M${X0 + 50} 298H${X1 - 60}M${X0} 324H${X0 + 130}`, 'pm-strike')));
    }
    if (b >= 4) {
      const Cc = page(b, p, 4, -1);
      o.fails = op(Cc, txt(X0, 80, tr('klassieke fouten', 'typical failures'), 'pm-big')
        + bullets(112, [tr('te laat: geen opties', 'too late: no options'), tr('zonder advies: de', 'no recommendation:'), tr('sponsor denkt voor je', 'sponsor thinks for you'), tr('elke week weer open', 'reopened every week')]));
      o.ask2 = op(at(b, p, 5), card(232, 150, 'pm-hot') + lines(260, [[tr('‘Niet terug te', '‘Can’t undo it?'), 'pm-on'], [tr('draaien? wie, wanneer?', 'who decides, by when?'), 'pm-on'], [tr('Wel? wat kost', 'Can? what does a')], [tr('een week wachten?’', 'week’s wait cost?’')]]));
    }
    return o;
  }

  // s9: the switchgear: 26 weeks, 4 weeks; one-way; the engineer; the factory; the memo; the sponsor decides
  function s9(b, p) {
    const o = { head: [tr('nu bestellen?', 'switchgear'), EX] };
    const Gd = C.GRID;
    const A = page(b, p, 0, 3);
    o.case = op(A, lines(80, [[tr(`levertijd ${Gd.lead} weken`, `lead time ${Gd.lead} weeks`), 'pm-big'], [tr('belastingcijfers', 'final load figures')], [tr(`pas over ${Gd.wait} weken`, `in ${Gd.wait} more weeks`)], [tr('wachten: ~1 maand later', 'waiting: ~1 month later'), 'pm-mute']]));
    o.st1 = op(A * at(b, p, 1), lines(204, [[tr('1 eenrichtingsdeur', '1 a one-way door'), 'pm-on'], [tr('annuleren kost veel', 'cancelling costs a lot')]]));
    o.st2 = op(A * at(b, p, 2), card(266, 86, 'pm-hot') + lines(292, [[tr('2 netengineer: alleen', '2 grid engineer: only'), 'pm-on'], [tr(`bij > ${Gd.rise}% meer last`, `if load rises > ${Gd.rise}%`)]]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.st3 = op(B, lines(80, [[tr('3 fabriek: heel', '3 factory: very'), 'pm-on'], [tr('onwaarschijnlijk', 'unlikely')]]));
      o.st4 = op(at(b, p, 4), card(132, 150) + lines(160, [[tr('4 beslisnotitie:', '4 decision memo:'), 'pm-big'], [tr('nu bestellen, risico', 'order now, risk named;')], [tr(`benoemd; of ${Gd.wait} weken`, `or wait ${Gd.wait} weeks,`)], [tr('wachten, 1 maand later', 'slip a month')], [tr('advies: nu bestellen', 'advice: order now'), 'pm-on']]));
      o.st5 = op(at(b, p, 5), card(296, 86, 'pm-hot') + lines(322, [[tr('5 sponsor beslist;', '5 sponsor decides;'), 'pm-on'], [tr('jij legt vast en', 'you record it and')], [tr('kondigt helder aan', 'announce it plainly')]]));
    }
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip: twelve weeks; milestones as diamonds (s1), a demo every
  // two weeks and milestones three weeks apart (s4), the third milestone in two
  // weeks (s5), the four weeks until the load figures (s9)
  function calendar(si, b, p) {
    const cell = (wk) => C.CELLS[wk - 1];
    const fill = (wk, cls, a = 1) => { const [x0, y0, x1, y1] = cell(wk); return op(a, rect(x0, y0, x1 - x0, y1 - y0, cls, 1)); };
    const mark = (wk, a = 1) => { const [x0, y0, x1, y1] = cell(wk); return op(a, dia((x0 + x1) / 2, (y0 + y1) / 2, Math.min(x1 - x0, y1 - y0) * 0.4)); };
    let s = '';
    if (si === 0 && b >= 2) [3, 6, 9, 12].forEach((wk, i) => { s += mark(wk, b > 2 ? 1 : span(p, 0.1 + i * 0.12, 0.2 + i * 0.12)); });
    if (si === 3 && b === 3) [2, 4, 6, 8, 10, 12].forEach((wk, i) => { s += fill(wk, 'pm-hot', span(p, 0.3 + i * 0.08, 0.38 + i * 0.08)); });
    if (si === 3 && b >= 4) [3, 6, 9, 12].forEach((wk, i) => { s += mark(wk, b > 4 ? 1 : span(p, 0.3 + i * 0.1, 0.4 + i * 0.1)); });
    if (si === 4 && b >= 4) { s += fill(1, 'pm-card') + fill(2, 'pm-hot', span(p, 0.2, 0.4)) + mark(2, span(p, 0.3, 0.5)); }
    if (si === 8 && (b === 0 || b === 4)) {
      for (let wk = 1; wk <= C.GRID.wait; wk++) s += fill(wk, wk === C.GRID.wait ? 'pm-hot' : 'pm-card', span(p, 0.3 + wk * 0.08, 0.4 + wk * 0.08));
    }
    return s;
  }
  // the sheet on the table: a signed test report (s2), the six milestones ticked
  // by their evidence (s5), the decision memo (s8, s9)
  function sheet(si, b, p) {
    const rule = (i, len = 12) => `<path class="pm-line" d="M4 ${f1(4 + i * 4.2)}H${f1(4 + len)}"/>`;
    let s = '';
    if (si === 1 && b >= 4) {
      for (let i = 0; i < 4; i++) s += rule(i, 13 - (i % 2) * 3);
      s += op(span(p, 0.3, 0.6), '<path class="pm-line" d="M6 24c1.5 -2 2.5 -2 3 0s1.5 2 3 0s2 -1 3 0"/>');
    }
    if (si === 4 && b >= 1) {
      for (let i = 0; i < 6; i++) {
        s += `<path class="pm-line" d="M7 ${f1(4 + i * 4)}H${f1(18 - (i % 3) * 2)}"/>`;
        if (b >= 3 && i < C.MES.proven.length) s += op(b === 3 ? span(p, 0.1, 0.3) : 1, `<path class="pm-line" d="M2 ${f1(4 + i * 4)}l1.2 1.2l2.2 -2.6"/>`);
      }
    }
    if ((si === 7 && b <= 1) || (si === 8 && b >= 4)) {
      s += '<path class="pm-line" d="M4 4H14"/>';
      for (let i = 1; i < 6; i++) s += op(si === 7 && b === 0 ? span(p, 0.1 + i * 0.1, 0.2 + i * 0.1) : 1, rule(i + 0.4, 15 - (i % 3) * 3));
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
    set(E.pExtra, '');
    set(E.bMini, mini);
    set(E.cMarks, calendar(si, b, p));
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
