// The stage of the film "Overdragen en vasthouden / Handing over and holding
// on": a pure function of (scene, u). Inlined into the page after the anatomy
// kit and a preamble from build.mjs that defines C (the calendar cells, the
// handover weeks, the dip numbers), CAM (one camera move per scene), W and H.
// Moves are placed per caption beat (beatStarts), so the video's narration
// timing (films/_kit/beatwarp.js) keeps them in step. The panel at the right
// gets one card per scene, each block in its own cue group (o[key] goes into
// data-k "p_<key>"); the board in the room repeats it in miniature, the
// calendar strip on the side wall carries the weeks (handover, hypercare) and
// the months (follow-ups, the dip), and the sheet on the table fills as the
// handover checklist, the one-page evidence and the open points list.
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
  // three step boxes: watch, beside, alone (a dot for the owner, a dot or ring for you)
  const stepBoxes = (y, a, labels) => labels.map((t, i) => {
    const x = X0 + i * 96;
    const you = i === 0 ? dot(x + 30, y + 44, 7, 'pm-blk') : i === 1 ? dot(x + 30, y + 44, 7, 'pm-ring') : '';
    return op(a[i], rect(x, y, 88, 60, i === 2 ? 'pm-hot' : 'pm-card', 6) + txt(x + 44, y + 24, t, i === 2 ? 'pm-on' : 'pm-txt', 'middle') + dot(x + (i === 2 ? 44 : 58), y + 44, 7, 'pm-blk2') + you);
  }).join('');

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: the line, one process owner, the KPI; what the owner can do alone; the checklist
  function s1(b, p) {
    const o = { head: [tr('de eigenaar', 'the owner'), DIA] };
    const A = page(b, p, 0, 3);
    o.line = op(A, card(52, 96) + lines(78, [[tr('lijnorganisatie', 'line organisation'), 'pm-big'], [tr('draait het werk elke dag', 'runs the work every day')], [tr('eigenaar als jij weg bent', 'owns it after you leave'), 'pm-on']]));
    o.owner = op(A * at(b, p, 1), lines(180, [[tr('1 proceseigenaar per proces', '1 process owner per process'), 'pm-big'], [tr('verantwoordelijk: hoe het', 'responsible: how it runs')], [tr('loopt, en de KPI', 'and the KPI')], [tr('dagelijks bij het werk', 'daily with the work'), 'pm-on']]));
    o.kpi = op(A * at(b, p, 2), card(294, 88, 'pm-hot') + lines(320, [[tr('KPI', 'KPI'), 'pm-on'], [tr('het getal: werkt het?', 'the number: does it work?')], [tr('kritieke prestatie-indicator', 'key performance indicator'), 'pm-mute']]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      const can = [tr('KPI lezen: wat is normaal', 'read KPI: what is normal'), tr('het overleg leiden', 'run the review meeting'), tr('nieuwe mensen inwerken', 'train new people'), tr('gewone problemen oplossen', 'solve common problems'), tr('wie bellen bij zeldzame', 'whom to call: rare ones')];
      o.can = op(B, txt(X0, 78, tr('alleen kunnen', 'can do alone'), 'pm-big') + can.map((t, i) => op(span(b === 3 ? p : 1, 0.08 + i * 0.1, 0.18 + i * 0.1), txt(X0 + 14, 106 + i * 26, t) + op(at(b, p, 4, 0.2 + i * 0.12, 0.3 + i * 0.12), tick(X0 - 1, 100 + i * 26)))).join(''));
      o.check = op(B * at(b, p, 4), card(236, 146, 'pm-hot') + lines(262, [[tr('overdrachtschecklist', 'handover checklist'), 'pm-on'], [tr('samen afvinken,', 'tick off together,')], [tr('punt voor punt,', 'point by point,')], [tr('in het echte werk,', 'in real work,'), 'pm-on'], [tr('niet in een presentatie', 'not in a presentation'), 'pm-mute']]));
    }
    return o;
  }

  // s2: in steps; KPIs in the line's reports; the people side; hypercare; the folder
  function s2(b, p) {
    const o = { head: [tr('in stappen', 'in steps'), DIA] };
    const A = page(b, p, 0, 2);
    const sa = [0, 1, 2].map((i) => (b > 0 ? 1 : span(p, 0.1 + i * 0.22, 0.25 + i * 0.22)));
    o.steps = op(A, stepBoxes(56, sa, [tr('kijkt', 'watches'), tr('doet, jij', 'runs, you'), tr('alleen', 'alone')])
      + lines(148, [[tr('kijken, ernaast, alleen', 'watch, beside, alone'), 'pm-big'], [tr('elke stap: een paar cycli,', 'each step: a few cycles,')], [tr('bijv. 3 weekoverleggen', 'e.g. 3 weekly meetings'), 'pm-on']]));
    o.reports = op(A * at(b, p, 1), card(244, 138) + lines(270, [[tr('KPI’s in de rapportages', 'KPIs in the reports'), 'pm-big'], [tr('die de lijn al gebruikt', 'the line already uses'), 'pm-on'], [tr('niet: een apart project-', 'not: a separate project'), 'pm-mute'], [tr('dashboard; dat sterft', 'dashboard; it dies'), 'pm-mute']]) + cross(X1 - 20, 336));
    if (b === 2 || b === 3) {
      const B = page(b, p, 2, 3);
      o.ask = op(B, lines(78, [[tr('tegenzin: nog een ding', 'reluctant: one more thing'), 'pm-big'], [tr('op het bord', 'on the plate')]]) + card(126, 92, 'pm-hot') + lines(152, [[tr('‘Wat heb je nodig om dit', '‘What would you need to'), 'pm-on'], [tr('zonder mij te draaien?’', 'run this without me?’'), 'pm-on']]));
      o.need = op(B * at(b, p, 2, 0.35, 0.5), lines(256, [[tr('tijd, een analist, data', 'time, an analyst, data')], [tr('krijgt hij het niet:', 'can’t get it:')], [tr('nog niet realistisch,', 'not realistic yet,')], [tr('de sponsor moet het weten', 'the sponsor must know'), 'pm-on']]));
    }
    if (b >= 3) {
      const Cc = page(b, p, 3, -1);
      // a strip: go-live, then hypercare two to six weeks, then normal support
      const q = b === 3 ? p : 1;
      let h = txt(X0, 78, tr('hypercare', 'hypercare'), 'pm-big') + txt(X1, 78, tr('2–6 weken', '2–6 weeks'), 'pm-on', 'end');
      h += dia(X0 + 8, 112, 8) + txt(X0, 150, tr('start', 'go-live'), 'pm-mute');
      for (let i = 0; i < 6; i++) h += op(span(q, 0.15 + i * 0.08, 0.25 + i * 0.08), rect(X0 + 26 + i * 34, 100, 30, 24, i < 2 ? 'pm-hot' : 'pm-card', 3));
      h += op(span(q, 0.6, 0.75), path(`M${X0 + 236} 94V130`, 'pm-strike') + txt(X1, 150, tr('einddatum', 'end date'), 'pm-on', 'end'));
      h += lines(180, [[tr('extra steun, dan de', 'extra support, then')], [tr('gewone ondersteuning', 'normal support')], [tr('verbeterprojecten ook', 'improvement projects too'), 'pm-mute']]);
      o.hyper = op(Cc, h);
      o.folder = op(Cc * at(b, p, 4), card(262, 120) + lines(288, [[tr('mis: presentatie + map;', 'wrong: slides + a folder;'), 'pm-mute'], [tr('na 3 maanden dicht', 'shut 3 months later'), 'pm-mute'], [tr('‘Al iets opgelost', '‘Solved a problem'), 'pm-on'], [tr('zonder mij?’', 'without me yet?’'), 'pm-on']]));
    }
    return o;
  }

  // s3: Sanne at the cable manufacturer: the checklist, the nine weeks, the proof
  function s3(b, p) {
    const o = { head: [tr('kabelfabrikant', 'cable manufacturer'), EX] };
    const A = page(b, p, 0, 2);
    o.case = op(A, card(52, 144) + lines(78, [[tr('planningsoverleg naar', 'planning meeting to'), 'pm-big'], [tr('Sanne, planningsmanager', 'Sanne, planning manager')], [tr('KPI: leverbetrouwbaarheid', 'KPI: on-time delivery')], [tr(`${C.NORMAL}% is normaal`, `${C.NORMAL}% is normal`), 'pm-on'], [tr('nog 9 weken', '9 weeks left'), 'pm-mute']]));
    const list = [tr(`KPI lezen, ${C.NORMAL}% normaal`, `read KPI, ${C.NORMAL}% normal`), tr('het overleg voorzitten', 'chair the meeting'), tr('capaciteitsmodel uitleggen', 'explain capacity model'), tr('spoedorder opvangen', 'handle a rush order')];
    o.list = op(A * at(b, p, 1), txt(X0, 232, tr('checklist', 'checklist'), 'pm-big')
      // the capacity model's note sits under its own row; the last row moves down
      + list.map((t, i) => { const y = 248 + i * 30 + (i === 3 ? 22 : 0); return op(span(b === 1 ? p : 1, 0.1 + i * 0.16, 0.2 + i * 0.16), rect(X0, y, 16, 16, 'pm-card', 3) + txt(X0 + 26, y + 15, t) + (i === 2 ? txt(X0 + 26, y + 41, tr('machine- en mensuren', 'machine and staff hours'), 'pm-mute') : '')); }).join(''));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const q = b === 2 ? p : 1;
      const groups = [[tr('wk 1–3', 'wk 1–3'), tr('jij voor, zij kijkt', 'she watches you')], [tr('wk 4–6', 'wk 4–6'), tr('zij, jij ernaast', 'she, you beside')], [tr('wk 7–9', 'wk 7–9'), tr('zij alleen', 'she alone')]];
      o.weeks = op(B, groups.map(([w, t], i) => op(span(q, 0.05 + i * 0.28, 0.2 + i * 0.28), rect(X0, 56 + i * 52, CW, 44, i === 2 ? 'pm-hot' : 'pm-card', 6) + txt(X0 + 10, 84 + i * 52, w, 'pm-big') + txt(X1 - 10, 84 + i * 52, t, i === 2 ? 'pm-on' : 'pm-txt', 'end'))).join('')
        + op(span(q, 0.4, 0.55), txt(X0, 230, tr('+ 10 min nabespreken', '+ 10 min debrief'), 'pm-mute')));
      o.proof = op(B * at(b, p, 3), card(252, 130, 'pm-hot') + lines(278, [[tr('wk 8: machine valt uit', 'wk 8: machine breaks down'), 'pm-on'], [tr('ze plant om, belt niet', 'she re-plans, no call')], [tr('KPI in het operationele', 'KPI in the monthly')], [tr('maandrapport: klaar', 'operations report: done'), 'pm-on']]) + tick(X1 - 14, 352));
    }
    return o;
  }

  // s4: acceptance criteria in the charter; who signs; the sign-off on one page
  function s4(b, p) {
    const o = { head: [tr('wanneer klaar?', 'when is it done?'), DIA] };
    const A = page(b, p, 0, 3);
    o.crit = op(A, lines(78, [[tr('acceptatiecriteria', 'acceptance criteria'), 'pm-big'], [tr('meetbaar, aan het begin', 'measurable, at the start'), 'pm-on']]));
    o.charter = op(A * at(b, p, 1), card(114, 96) + lines(140, [[tr('in de projectopdracht:', 'in the project charter:'), 'pm-big'], [tr('doel, scope, rollen, planning', 'goal, scope, roles, timing')], [tr('scope: wat erin valt, wat niet', 'scope: what is in, what not'), 'pm-mute']]));
    o.ex1 = op(A * at(b, p, 2), lines(240, [[tr(`afzeggingen < ${C.CANCEL}%, 6 wk,`, `cancellations < ${C.CANCEL}%, 6 wk,`)], [tr('pilotregio; check in alle', 'pilot region; check in all')], [tr('regio’s; eigenaar getraind', 'regions; owner trained')]]));
    o.who = op(A * at(b, p, 2, 0.4, 0.55), card(322, 60, 'pm-hot') + lines(346, [[tr('schrijf op wie tekent', 'write down who signs'), 'pm-on'], [tr('anders: tot iemand moe is', 'else: till someone tires'), 'pm-mute']]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      const q = b === 3 ? p : 1;
      const rows = [[tr('criterium 1', 'criterion 1'), tr('gehaald', 'met'), 'pm-on'], [tr('criterium 2', 'criterion 2'), tr('deels', 'partly'), 'pm-txt'], [tr('criterium 3', 'criterion 3'), tr('niet', 'not met'), 'pm-mute']];
      o.sign = op(B, lines(78, [[tr('ondertekening', 'sign-off'), 'pm-big'], [tr('het ja van de sponsor', 'the sponsor’s formal yes')]]) + card(116, 104)
        + rows.map(([c, s, cls], i) => op(span(q, 0.2 + i * 0.12, 0.3 + i * 0.12), txt(X0, 142 + i * 30, c) + txt(X1, 142 + i * 30, s, cls, 'end'))).join('')
        + op(span(q, 0.55, 0.7), txt(X0, 250, tr('bewijs op één A4, dan', 'evidence on one page,')) + txt(X0, 276, tr('handtekening of mail', 'then signature or email'), 'pm-on')));
      o.protect = op(B * at(b, p, 4), card(292, 90) + lines(318, [[tr('beschermt beide kanten', 'protects both sides'), 'pm-big'], [tr('klant weet wat hij kreeg', 'client knows what he got')], [tr(`zonder: laatste ${C.LAST}% hangt`, `without: last ${C.LAST}% drags`), 'pm-mute']]));
    }
    return o;
  }

  // s5: the open points list; outputs or outcomes; the benefits review; new wishes; no criteria
  function s5(b, p) {
    const o = { head: [tr('open punten', 'open points'), DIA] };
    const A = page(b, p, 0, 2);
    let t = lines(78, [[tr('openpuntenlijst', 'open points list'), 'pm-big']]);
    [tr('punt', 'item'), tr('eigenaar', 'owner'), tr('datum', 'date')].forEach((c, i) => { t += txt(X0 + [0, 110, 220][i], 110, c, 'pm-mute'); });
    for (let i = 0; i < 3; i++) t += op(span(b === 0 ? p : 1, 0.2 + i * 0.12, 0.3 + i * 0.12), path(`M${X0} ${130 + i * 24}H${X0 + 90 - i * 12}M${X0 + 110} ${130 + i * 24}H${X0 + 190}M${X0 + 220} ${130 + i * 24}H${X0 + 270}`, 'pm-line'));
    t += op(span(b === 0 ? p : 1, 0.6, 0.8), txt(X0, 222, tr('accepteer met open punten', 'accept with open points'), 'pm-on'));
    o.open = op(A, t);
    o.line2 = op(A * at(b, p, 1), card(246, 136) + lines(272, [[tr('eigenaar in de lijn', 'owner in the line'), 'pm-big'], [tr('bij de lijn: overleeft', 'with the line: survives'), 'pm-on'], [tr('bij het project: sterft', 'with the project: dies'), 'pm-mute'], [tr('niet: tijdelijk team', 'not: temporary team'), 'pm-mute']]));
    if (b === 2 || b === 3) {
      const B = page(b, p, 2, 4);
      o.oo = op(B, lines(78, [[tr('output of resultaat?', 'outputs or outcomes?'), 'pm-big'], [tr('output: wat je opleverde', 'output: what you delivered')], [tr('resultaat (outcome): het', 'outcome: the effect, like')], [tr('effect, minder afzeggingen;', 'fewer cancellations;')], [tr('vaak pas na maanden', 'often months later'), 'pm-mute']]));
      o.benefit = op(B * at(b, p, 3), card(208, 82) + lines(234, [[tr('PRINCE2, veelgebruikt:', 'PRINCE2, widely used:')], [tr('output, later batenreview', 'outputs, benefits review'), 'pm-on']]) + txt(X0, 282, tr('veel sponsors: resultaat', 'many sponsors: outcomes'), 'pm-mute'));
      o.middle = op(B * at(b, p, 3, 0.4, 0.55), card(298, 84, 'pm-hot') + lines(324, [[tr('midden: output + weken', 'middle: outputs + weeks'), 'pm-on'], [tr('resultaat + review 3–6 mnd', 'outcomes + review 3–6 mo')]]));
    }
    if (b >= 4) {
      const Cc = page(b, p, 4, -1);
      o.wish = op(Cc, lines(78, [[tr('nieuwe wensen?', 'new wishes?'), 'pm-big'], [tr('toets aan de criteria', 'check against the criteria')], [tr('van maart; wensen naar de', 'of March; wishes to the')], [tr('lijn of een vervolgproject', 'line or a follow-up project'), 'pm-on']]));
      o.kick = op(Cc, card(196, 186, 'pm-hot') + lines(222, [[tr('nooit afgesproken? neem', 'never agreed? own it,')], [tr('het op je, spreek ze nu af,', 'agree them now, before')], [tr('vóór de laatste week', 'the last week')], [tr('kick-off: ‘Wat moet je', 'kick-off: ‘What would you'), 'pm-on'], [tr('zien om hiervoor te', 'need to see to sign'), 'pm-on'], [tr('tekenen?’', 'this off?’'), 'pm-on']]));
    }
    return o;
  }
  // s6: the cable manufacturer's closing meeting: the charter, one page, the forecast link, open points
  function s6(b, p) {
    const o = { head: [tr('afsluiten', 'closing'), EX] };
    const A = page(b, p, 0, 3);
    o.charter2 = op(A, lines(78, [[tr('projectopdracht', 'project charter'), 'pm-big'], [tr(`leverbetr. ≥ ${C.OTD}%, 8 wk`, `on-time ≥ ${C.OTD}%, 8 wk`)], [tr('planningsoverleg: manager', 'planning meeting: manager')], [tr('capaciteitsmodel: gedocu-', 'capacity model: documented')], [tr('menteerd, uitgelegd', 'and explained')]]));
    const rows = [[tr(`${C.SHOWN[0]}–${C.SHOWN[1]}%, 9 wk`, `${C.SHOWN[0]}–${C.SHOWN[1]}%, 9 wk`), tr('gehaald', 'met'), 'pm-on'], [tr(`zit voor sinds wk ${C.CHAIR}`, `chairs since wk ${C.CHAIR}`), tr('gehaald', 'met'), 'pm-on']];
    o.evidence = op(A * at(b, p, 1), card(214, 98) + txt(X0, 240, tr('één A4', 'one page'), 'pm-big')
      + rows.map(([c, s, cls], i) => op(at(b, p, 1, 0.2 + i * 0.25, 0.35 + i * 0.25), txt(X0, 268 + i * 28, c) + txt(X1, 268 + i * 28, s, cls, 'end'))).join(''));
    o.partly = op(A * at(b, p, 2), lines(346, [[tr('model, 2e planner', 'model, 2nd planner')]]) + txt(X1, 346, tr('deels', 'partly'), 'pm-txt', 'end') + txt(X0, 372, tr('nog niet uitgelegd', 'not yet explained'), 'pm-mute'));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.forecast = op(B, lines(78, [[tr('sponsor: koppeling', 'sponsor: link to the'), 'pm-big'], [tr('met verkoopprognose?', 'sales forecast?'), 'pm-big'], [tr('nooit in scope', 'never in scope'), 'pm-mute'], [tr('‘goed idee: open punt’', '‘good idea: open point’'), 'pm-on']]));
      const pts = [[tr('2e planner trainen', 'train 2nd planner'), tr(`manager, ${C.MAY} mei`, `manager, ${C.MAY} May`)], [tr('koppeling beoordelen', 'assess the link'), tr('IT-lead, juni', 'IT lead, June')]];
      o.points = op(B * at(b, p, 4), card(196, 186, 'pm-hot') + txt(X0, 222, tr('open punten', 'open points'), 'pm-on')
        + pts.map(([a, w], i) => op(at(b, p, 4, 0.1 + i * 0.2, 0.25 + i * 0.2), txt(X0, 252 + i * 52, a) + txt(X0 + 14, 276 + i * 52, w, 'pm-mute'))).join('')
        + op(at(b, p, 4, 0.6, 0.8), txt(X0, 366, tr('hij tekent', 'he signs'), 'pm-big') + tick(X1 - 14, 360)));
    }
    return o;
  }

  // a small line chart: values over time in a box (x0, y0, w, h); vals [label, value]
  const chart = (x0, y0, w, h, vals, shown, lo, hi) => {
    const xs = (i) => x0 + 24 + (i * (w - 48)) / (vals.length - 1);
    const ys = (v) => y0 + h - ((v - lo) / (hi - lo)) * h;
    let s = path(`M${x0} ${y0}V${y0 + h}H${x0 + w}`, 'pm-axis');
    let d = '';
    vals.forEach(([lab, v], i) => {
      const a = clamp(shown - i, 0, 1);
      if (a <= 0.01) return;
      d += `${d ? 'L' : 'M'}${f1(xs(i))} ${f1(ys(v))}`;
      s += op(a, dot(xs(i), ys(v), 5, 'pm-blk') + txt(xs(i) + (i === 0 ? 40 : 0), ys(v) + (i === 0 ? 6 : -12), `${v}%`, i === 2 ? 'pm-on' : 'pm-txt', 'middle') + txt(xs(i), y0 + h + 24, lab, 'pm-mute', 'middle'));
    });
    return (d ? path(d, 'pm-line') : '') + s;
  };

  // s7: the three-month dip; the weekly checks; the layered process audit; the KPI review
  function s7(b, p) {
    const o = { head: [tr('de dip', 'the dip'), DIA] };
    const A = page(b, p, 0, 2);
    // a generic curve: up during the project, a dip a few months after
    let g = path(`M${X0} 66V170H${X1}`, 'pm-axis');
    const k = b > 0 ? 1 : span(p, 0.1, 0.7);
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      if (t > k) break;
      const v = t < 0.35 ? 150 - 80 * span(t, 0, 0.35) : 70 + 30 * Math.sin(Math.PI * span(t, 0.45, 0.85));
      pts.push(`${i ? 'L' : 'M'}${f1(X0 + 8 + t * (CW - 16))} ${f1(v)}`);
    }
    g += path(pts.join(''), 'pm-line') + path(`M${f1(X0 + 8 + 0.35 * (CW - 16))} 64V170`, 'pm-dash')
      + txt(X0 + 4, 196, tr('project', 'project'), 'pm-mute') + op(k > 0.6 ? 1 : 0, txt(X1, 196, tr('± 3 maanden later', '± 3 months later'), 'pm-on', 'end'));
    o.dip = op(A, g + lines(232, [[tr('vuistregel, geen wet', 'rule of thumb, not a law'), 'pm-mute']]));
    o.why = op(A * at(b, p, 1), lines(268, [[tr('aandacht weg, mensen', 'attention gone, people')], [tr('wisselen, druk seizoen,', 'change jobs, busy season,')], [tr('uitzondering wordt gewoonte', 'exceptions become habits')], [tr('plan erop', 'plan for it'), 'pm-on']]));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.weekly = op(B, lines(78, [[tr('elke week, op de vloer:', 'weekly, on the floor:'), 'pm-big'], [tr('bord bijgewerkt?', 'board up to date?')], [tr('checklist gebruikt?', 'checklist used?')], [tr('acties gedaan?', 'actions done?')]]));
      const tiers = [[tr('plantmanager', 'plant manager'), tr('maand', 'monthly')], [tr('managers', 'managers'), tr('week', 'weekly')], [tr('teamleiders', 'team leaders'), tr('dag', 'daily')]];
      o.lpa = op(B * at(b, p, 3), txt(X0, 202, tr('gelaagde procesaudit', 'layered process audit'), 'pm-on')
        + tiers.map(([n, f], i) => op(at(b, p, 3, 0.15 + (2 - i) * 0.12, 0.25 + (2 - i) * 0.12), rect(X0, 214 + i * 34, CW, 28, 'pm-card', 5) + txt(X0 + 8, 235 + i * 34, n) + txt(X1 - 8, 235 + i * 34, f, 'pm-mute', 'end'))).join(''));
      o.review = op(B * at(b, p, 4), card(322, 60, 'pm-hot') + lines(346, [[tr('KPI-review, maandelijks:', 'KPI review, monthly:'), 'pm-on'], [tr('de trend, niet één week', 'the trend, not one week')]]));
    }
    return o;
  }

  // s8: follow-ups and a trigger; when it slips; one enthusiast; how long to stay
  function s8(b, p) {
    const o = { head: [tr('terugkomen', 'coming back'), DIA] };
    const A = page(b, p, 0, 2);
    let f = lines(78, [[tr('follow-up, vooraf', 'follow-up, agreed'), 'pm-big'], [tr('gepland vervolgbezoek', 'a planned return visit')]]);
    f += path(`M${X0} 150H${X1}`, 'pm-axis');
    C.FOLLOW.forEach((m, i) => {
      const x = X0 + 10 + (m / 6) * (CW - 50);
      f += op(b > 0 ? 1 : span(p, 0.2 + i * 0.15, 0.3 + i * 0.15), dot(x, 150, 8, 'pm-ring') + txt(x, 182, tr(`${m} mnd`, `${m} mo`), 'pm-txt', 'middle'));
    });
    o.follow = op(A, f + dia(X0 + 4, 150, 6));
    o.trig = op(A * at(b, p, 1), card(214, 168, 'pm-hot') + lines(240, [[tr('trigger', 'trigger'), 'pm-on'], [tr(`leverbetr. < ${C.TRIGGER}%,`, `on-time < ${C.TRIGGER}%,`)], [tr('3 weken op rij:', '3 weeks in a row:')], [tr('de eigenaar belt ons', 'the owner calls us'), 'pm-on'], [tr('een plan, geen falen', 'a plan, not a failure'), 'pm-mute']]));
    if (b === 2 || b === 3) {
      const B = page(b, p, 2, 3);
      o.slip = op(B, lines(78, [[tr('zakt het weg?', 'slipping?'), 'pm-big'], [tr('niet zelf oplossen: dat', 'don’t fix it: that'), 'pm-on'], [tr('ondermijnt de eigenaar', 'undermines the owner'), 'pm-on'], [tr('wat veranderde? nieuwe', 'what changed? new')], [tr('mensen, volume, een', 'people, volume, a')], [tr('overgeslagen stap', 'skipped step')]])
        + card(250, 118) + lines(276, [[tr('help hem de oorzaak', 'help him find the cause')], [tr('vinden en handelen', 'and act')], [tr('wat wegzakken is normaal;', 'some slipping is normal;'), 'pm-mute'], [tr('de eigenaar ziet het', 'the owner notices, acts'), 'pm-on']]));
    }
    if (b >= 3) {
      const Cc = page(b, p, 3, -1);
      o.second = op(Cc, lines(78, [[tr('één enthousiasteling?', 'one enthusiast?'), 'pm-big'], [tr('vertrekt zij: het valt om', 'she leaves: it collapses'), 'pm-mute'], [tr('check vroeg: kan een', 'check early: can a'), 'pm-on'], [tr('tweede het draaien?', 'second person run it?'), 'pm-on']]));
      o.test = op(Cc * at(b, p, 4), card(196, 186) + lines(222, [[tr('hoe lang blijf je?', 'how long to stay?'), 'pm-big'], [tr('een jaar follow-ups, of', 'a year of follow-ups, or'), 'pm-mute'], [tr('de klant wordt afhankelijk', 'the client gets dependent'), 'pm-mute'], [tr('‘Wat heb je sinds mijn', '‘What have you changed'), 'pm-on'], [tr('vertrek zelf aan het', 'in the process since'), 'pm-on'], [tr('proces veranderd?’', 'I left, without me?’'), 'pm-on']]));
    }
    return o;
  }

  // s9: the food plant: 72, 90, 81, then 88
  function s9(b, p) {
    const o = { head: [tr('levensmiddelen', 'food plant'), EX] };
    const V = C.DIP;
    const vals = [[tr('start', 'start'), V.before], [tr('einde', 'end'), V.after], [tr('+3 mnd', '+3 mo'), V.dip], [tr('+6 wk', '+6 wk'), V.back]];
    const shown = b === 0 ? span(p, 0.05, 0.6) * 3 : b < 3 ? 3 : 3 + at(b, p, 3, 0.1, 0.4);
    o.chart = txt(X0, 78, tr('leverbetrouwbaarheid', 'on-time delivery'), 'pm-big') + chart(X0 + 6, 104, CW - 12, 90, vals, shown, 66, 94);
    o.half = op(at(b, p, 0, 0.6, 0.75), txt(X0, 252, tr(`${V.after - V.before} punten winst, ${V.after - V.dip} weg:`, `${V.after - V.before} points gained, ${V.after - V.dip} lost:`)) + txt(X0, 278, tr('de helft', 'half'), 'pm-on'));
    o.cause = op(page(b, p, 1, 2), card(298, 84) + lines(324, [[tr('eigenaar: operations mgr', 'owner: operations manager'), 'pm-mute'], [tr('mnd 2: 2 planners, niet', 'month 2: 2 planners, not')], [tr('getraind; zomer: 4× afgezegd', 'trained; summer: 4× off')]]));
    if (b >= 2) o.act = op(page(b, p, 2, 3), card(298, 84, 'pm-hot') + lines(324, [[tr('senior planner traint,', 'senior planner trains,'), 'pm-on'], [tr('deze maand; overleg vast,', 'this month; review fixed,')], [tr('met een vervanger', 'with a stand-in')]]));
    if (b >= 3) o.back = op(span(p, 0.05, 0.2), card(298, 84, 'pm-hot') + lines(324, [[tr(`na 6 weken: ${V.back}%`, `after 6 weeks: ${V.back}%`), 'pm-on'], [tr('de eigenaar handelde', 'the owner acted')]]));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip: weeks 1 to 12 (the handover scenes), months 1 to 12 (sustaining)
  function calendar(si, b, p) {
    const cell = (wk) => C.CELLS[wk - 1];
    const mid = (wk) => { const [a, bb, c, d] = cell(wk); return [(a + c) / 2, (bb + d) / 2]; };
    const fill = (wk, cls, a = 1) => { const [x0, y0, x1, y1] = cell(wk); return op(a, rect(x0, y0, x1 - x0, y1 - y0, cls, 1)); };
    let s = '';
    // three steps of three weeks: watch, beside, alone (s2 b1, the example's nine weeks in s3)
    const steps = (a) => { for (let wk = 1; wk <= 9; wk++) s += fill(wk, wk > 6 ? 'pm-hot' : wk > 3 ? 'pm-card' : 'pm-hatch', clamp(a * 9 - (wk - 1), 0, 1)); };
    if (si === 1) {
      if (b < 3) steps(b > 0 ? 1 : span(p, 0.1, 0.8));
      else {
        // hypercare: go-live in week 1, two to six weeks of extra support, an end date
        const [x, y] = mid(1);
        s += dia(x, y - 12, 3.6);
        for (let wk = 2; wk <= 7; wk++) s += fill(wk, wk <= 3 ? 'pm-hot' : 'pm-card', b > 3 ? 1 : span(p, 0.15 + wk * 0.06, 0.25 + wk * 0.06));
      }
    }
    if (si === 2) {
      steps(b < 2 ? 0 : b > 2 ? 1 : span(p, 0.05, 0.85));
      if (b >= 3) { const [x, y] = mid(8); s += op(span(p, 0.1, 0.3), dot(x, y - 6, 5, 'pm-ring')); }
    }
    // the closing: nine weeks at 91 to 94 percent, the manager chairs from week 7
    if (si === 5 && b >= 1) {
      for (let wk = 1; wk <= 9; wk++) s += fill(wk, wk >= C.CHAIR ? 'pm-hot' : 'pm-card', b > 1 ? 1 : span(p, 0.1 + wk * 0.05, 0.2 + wk * 0.05));
    }
    // months: the dip around month 3 (s7), follow-ups at 1, 3 and 6 (s8), the food plant (s9)
    if (si === 6) { const [x, y] = mid(3); s += op(b > 0 ? 1 : span(p, 0.6, 0.8), dot(x, y, 6, 'pm-ring')); }
    if (si === 7 && b < 2) C.FOLLOW.forEach((m, i) => { const [x, y] = mid(m); s += op(b > 0 ? 1 : span(p, 0.2 + i * 0.15, 0.3 + i * 0.15), dot(x, y, 5, 'pm-ring')); });
    if (si === 8) {
      const [x, y] = mid(3);
      s += op(b > 0 ? 1 : span(p, 0.5, 0.7), dot(x, y, 6, 'pm-ring'));
      // six weeks after the month-3 follow-up: between months 4 and 5
      if (b >= 3) { const [xa, ya] = mid(4); const [xb, yb] = mid(5); s += op(span(p, 0.1, 0.3), tick((xa + xb) / 2 + 1, (ya + yb) / 2)); }
    }
    return s;
  }
  // the sheet on the table: the handover checklist (s1, s3), the evidence on one
  // page (s4, s6), the open points (s5, s6)
  function sheet(si, b, p) {
    let n = 0;
    let ticks = 0;
    if (si === 0) { n = b < 3 ? 0 : 5; ticks = b < 4 ? 0 : span(p, 0.2, 0.8) * 5; }
    if (si === 2) { n = b < 1 ? 0 : 4; ticks = b < 3 ? 0 : 4; }
    if (si === 3) { n = b < 3 ? 0 : 3; ticks = b < 3 ? 0 : span(p, 0.2, 0.6) * 3; }
    if (si === 4) n = 3;
    if (si === 5) { n = b < 1 ? 0 : b < 4 ? 3 : 5; ticks = b < 1 ? 0 : b < 2 ? span(p, 0.2, 0.6) * 2 : 2; }
    let s = '';
    for (let i = 0; i < n; i++) {
      s += `<path class="pm-line" d="M6 ${f1(4 + i * 4)}H${f1(18 - (i % 3) * 2)}"/>`;
      const a = clamp(ticks - i, 0, 1);
      if (a > 0.01) s += op(a, `<path class="pm-line" d="M2 ${f1(4 + i * 4)}l1.2 1.2l2.2 -2.6"/>`);
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
    set(E.bMini, mini);
    set(E.cMarks, calendar(si, b, p));
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
