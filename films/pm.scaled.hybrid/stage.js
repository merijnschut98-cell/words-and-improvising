// The stage of the film "Stage-gate met sprints / Stage-gate with sprints": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and
// a preamble from build.mjs that defines C (the panel's blocks, the board's
// drawing area, the e-bike's weeks), CAM (one camera move per scene), W and H.
// Moves are placed per Dutch caption beat (beatStarts), so the video's
// narration timing (films/_kit/beatwarp.js) keeps them in step. The panel at
// the right gets one card per scene, each block in its own cue group (o[key]
// goes into data-k "p_<key>"), all text at 22 units (a video film); a card that
// needs more room turns a page within its scene. The whiteboard on the back
// wall carries the plan as shapes only, each layer its own cue group: in s1 to
// s5 the gates as diamonds above, the five stages below them, the sprints as
// loops below the stages and three cost bars; in s6 to s9 a timeline in weeks
// to the SOP flag, the mould's lead time planned back to the design freeze,
// two trial-mould variants, milestones, and the sprints running on.
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
  const dia = (x, y, r, cls = 'pm-dia') => path(`M${f1(x)} ${f1(y - r)}l${f1(r)} ${f1(r)}l${f1(-r)} ${f1(r)}l${f1(-r)} ${f1(-r)}Z`, cls);
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // a page of the card that shows from beat k0 and gives way at beat k1 (-1: never)
  const page = (b, p, k0, k1) => (b < k0 ? 0 : b === k0 && k0 > 0 ? span(p, 0.02, 0.2) : b < k1 || k1 < 0 ? 1 : b === k1 ? 1 - span(p, 0, 0.12) : 0);
  const DIA = tr('schema', 'diagram');
  const EX = tr('voorbeeld', 'example');
  const eur = (n) => (NL ? `€ ${n.toLocaleString('de-DE')}` : `€${n.toLocaleString('en-GB')}`);

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
  // s1: stage-gate, its five stages with gates between, the gate, go/kill
  function s1(b, p) {
    const o = { head: ['stage-gate', DIA] };
    const A = page(b, p, 0, 2);
    o.sg = op(A, box(54, 'stage-gate', [tr('nieuwe producten', 'new products'), tr('in fases', 'in stages'), [tr('R. G. Cooper, jaren 80', 'R. G. Cooper, 1980s on'), 'pm-mute']], b === 0));
    if (b >= 1) {
      const ST = [tr('verkennen', 'scoping'), tr('businesscase', 'business case'), tr('ontwikkelen', 'development'), tr('testen', 'testing'), tr('lanceren', 'launch')];
      let s = '';
      ST.forEach((t, i) => {
        s += op(at(b, p, 1, 0.05 + i * 0.1, 0.15 + i * 0.1), txt(X0 + 30, 214 + i * 34, `${i + 1}  ${t}`, 'pm-txt')
          + (i < 4 ? dia(X0 + 10, 214 + i * 34 + 10, 6) : ''));
      });
      o.phases = op(A * at(b, p, 1), s);
    }
    const B = page(b, p, 2, -1);
    if (b >= 2) o.gate = op(B, box(54, 'gate', [tr('beslismoment tussen', 'decision moment'), tr('twee fases, op afge-', 'between two stages,'), tr('sproken resultaten', 'on agreed deliverables')], b === 2) + dia(X1 - 12, 76, 9));
    if (b >= 3) {
      const GK = [[tr('doorgaan', 'continue'), 'pm-on'], [tr('stoppen', 'stop')], [tr('aanhouden', 'hold')], [tr('fase overdoen', 'redo the stage')]];
      o.gokill = op(B * at(b, p, 3), box(204, tr('go/kill-beslissing', 'go/kill decision'), GK, b === 3));
    }
    return o;
  }

  // s2: the cost of change rising: CAD, the hardened mould, after delivery;
  // then the long lead times and the CE marking
  function s2(b, p) {
    const o = { head: [tr('wijzigen kost', 'cost of change'), DIA] };
    const A = page(b, p, 0, 3);
    o.coc = op(A, lines(80, [[tr('kosten van verandering', 'cost of change'), b === 0 ? 'pm-on' : 'pm-big'], [tr('stijgen naarmate je', 'rises the further'), ''], [tr('verder bent', 'along you are'), '']]));
    // one row per moment: a name, a bar that grows, a note below
    const row = (y, name, note, wd, hot) => txt(X0, y, name, 'pm-big') + rect(X1 - wd, y - 16, wd, 18, hot ? 'pm-hot' : 'pm-card', 3) + txt(X0, y + 26, note, 'pm-mute');
    if (b >= 1) o.cad = op(A * at(b, p, 1), row(184, 'CAD', tr('een paar uur', 'a few hours'), 14, false)
      + op(at(b, p, 1, 0.45, 0.7), row(246, tr('stalen matrijs', 'steel mould'), tr('tienduizenden euro’s', 'tens of thousands of €'), 110, false)));
    if (b >= 2) o.recall = op(A * at(b, p, 2), row(308, tr('na levering', 'after delivery'), tr('terugroepactie', 'a recall'), 150, true));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.lead = op(B, box(54, tr('en daarbij', 'and on top'), [tr('lange levertijden', 'long lead times'), tr('voor gereedschap', 'for tooling')], b === 3)
      + box(186, tr('CE-markering', 'CE marking'), [[tr('EU-verklaring: het', 'EU declaration: the'), 'pm-mute'], [tr('product voldoet aan', 'product meets the'), 'pm-mute'], [tr('de veiligheidseisen', 'safety requirements'), 'pm-mute']], false));
    return o;
  }

  // s3: uncertainty inside the stages, Agile-Stage-Gate; what sits in the
  // stages, the gates for investments; first results and limited evidence
  function s3(b, p) {
    const o = { head: [tr('agile erin', 'agile inside'), DIA] };
    const A = page(b, p, 0, 2);
    o.doubt = op(A, lines(80, [[tr('binnen de fases:', 'within the stages:'), 'pm-big'], [tr('wil de klant dit?', 'does the customer'), ''], [tr('werkt het ontwerp?', 'want it? does the'), ''], [tr('', 'design work?'), '']]));
    if (b >= 1) o.asg = op(A * at(b, p, 1), box(196, 'Agile-Stage-Gate', [tr('Cooper 2016; met', 'Cooper 2016; with'), tr('Sommer 2018', 'Sommer 2018'), [tr('sprints binnen fases', 'sprints in the stages'), 'pm-on']], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.events = op(B, box(54, tr('in de fases', 'inside the stages'), [tr('sprints, dagelijks', 'sprints, daily short'), tr('kort overleg, demo’s,', 'meetings, demos,'), tr('retrospectives', 'retrospectives')], b === 2)
      + lines(212, [[tr('gates: investeringen', 'gates: investments'), 'pm-on']]));
    if (b >= 3) o.evidence = op(B * at(b, p, 3), box(236, tr('handvol bedrijven', 'a handful of firms'), [tr('sneller op de markt,', 'faster to market,'), tr('ook worstelingen', 'also struggles'), [tr('bewijs: nog beperkt', 'evidence: still limited'), 'pm-on']], b === 3));
    return o;
  }

  // s4: what is done after a hardware sprint, four examples, the question;
  // then the gate as a quality gate turned paperwork, and the sharp question
  function s4(b, p) {
    const o = { head: [tr('hardwaresprint', 'hardware sprint'), DIA] };
    const A = page(b, p, 0, 3);
    o.done = op(A, box(54, tr('af na een sprint', 'done after a sprint'), [tr('testen of laten zien', 'to test or to show'), [tr('geen leverbaar product', 'not a shippable product'), 'pm-mute']], b === 0));
    if (b >= 1) {
      const L = [tr('✓ CAD-model + klant', '✓ CAD model + customer'), tr('✓ 3D-geprint model', '✓ 3D-printed model'), tr('✓ test van prototype', '✓ prototype test'), tr('✓ besturingssoftware', '✓ control software'), tr('   op testopstelling', '   on a test rig')];
      o.done4 = op(A * at(b, p, 1), L.map((t, i) => op(at(b, p, 1, 0.05 + Math.min(i, 3) * 0.15, 0.2 + Math.min(i, 3) * 0.15), txt(X0, 184 + i * 26, t, 'pm-txt'))).join(''));
    }
    if (b >= 2) o.learned = op(A * at(b, p, 2), lines(334, [[tr('wat leerden we deze', 'what did we learn'), 'pm-on'], [tr('twee weken?', 'these two weeks?'), 'pm-on']]));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.paper = op(B, box(54, tr('Lean: kwaliteitspoort', 'Lean: a quality gate'), [tr('valkuil: papieren-', 'pitfall: a paperwork'), tr('controle: documenten,', 'check: documents,'), tr('niet: werkt het?', 'not: does it work?')], b === 3));
    if (b >= 4) o.ask = op(at(b, p, 4), lines(212, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('wat moet bij de volgende', 'what must be proven at'), ''], [tr('gate bewezen zijn, en', 'the next gate, and which'), ''], [tr('welke sprint levert dat?', 'sprint delivers it?'), ''], [tr('“het ontwerpdossier”?', '“the design file”?'), 'pm-big'], [tr('→ een formaliteit', '→ a formality'), 'pm-on']]));
    return o;
  }

  // s5: the pump housing: the same change at three moments (bars on a log
  // scale), then 26 weeks of development as 13 sprints
  function s5(b, p) {
    const o = { head: [tr('pomphuis', 'pump housing'), EX] };
    const A = page(b, p, 0, 4);
    o.pump = op(A, box(54, tr('nieuw pomphuis', 'new pump housing'), [tr('wijziging: andere', 'change: a different'), tr('flensmaat', 'flange size'), [tr('bedragen ter illustratie', 'illustrative amounts'), 'pm-mute']], b === 0));
    // a bar's width on a log scale, so 360 still shows next to 35,000
    const bw = (v) => (Math.log10(v) - 2) * 100;
    const row = (y, name, v, hot) => txt(X0, y, name, 'pm-big') + txt(X1, y, eur(v), hot ? 'pm-on' : 'pm-big', 'end') + rect(X0, y + 8, bw(v), 10, hot ? 'pm-hot' : 'pm-card', 2);
    if (b >= 1) o.c1 = op(A * at(b, p, 1), row(214, tr('CAD: 4 u × € 90', 'CAD: 4 h × €90'), 360, b === 1));
    if (b >= 2) o.c2 = op(A * at(b, p, 2), row(266, tr('nieuw prototype', 'new prototype'), 3000, b === 2));
    if (b >= 3) o.c3 = op(A * at(b, p, 3), row(318, tr('na de matrijs', 'after the mould'), 35000, b === 3) + txt(X0, 362, tr('+ 6 weken vertraging', '+ 6 weeks of delay'), 'pm-mute'));
    const B = page(b, p, 4, -1);
    if (b >= 4) {
      let loops = '';
      for (let i = 0; i < 13; i++) loops += op(at(b, p, 4, 0.1 + i * 0.03, 0.18 + i * 0.03), `<circle class="${i === 0 ? 'pm-ring' : 'pm-line'}" cx="${f1(X0 + 9 + i * 21.8)}" cy="210" r="8"/>`);
      o.c13 = op(B, box(54, tr('ontwikkelen: 26 weken', 'development: 26 weeks'), [tr('26 / 2 = 13 sprints', '26 / 2 = 13 sprints')], true) + loops
        + lines(258, [[tr('13 kansen, zolang een', '13 chances while a'), ''], [tr('wijziging nog honderden', 'change still costs'), ''], [tr('euro’s kost, geen', 'hundreds of euros, not'), ''], [tr('tienduizenden', 'tens of thousands'), 'pm-on']]));
    }
    return o;
  }

  // s6: long-lead items, the SOP, backward planning and the design freeze
  function s6(b, p) {
    const o = { head: [tr('levertijden', 'lead times'), DIA] };
    const A = page(b, p, 0, 2);
    o.lli = op(A, box(54, 'long-lead item', [tr('levertijd bepaalt', 'its lead time drives'), tr('de hele planning', 'the whole schedule')], b === 0));
    if (b >= 1) o.lliex = op(A * at(b, p, 1), lines(186, [[tr('spuitgietmatrijs,', 'injection mould,'), ''], [tr('gietstuk, motor, chip', 'casting, motor, chip'), ''], [tr('matrijs: 8 tot 20 wk', 'mould: 8 to 20 weeks'), 'pm-big'], [tr('vraag de leverancier', 'ask the supplier'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.sop = op(B, box(54, 'SOP', ['start of production', [tr('vast: beurs, contract', 'fixed: fair, contract'), 'pm-mute'], [tr('of seizoen', 'or season'), 'pm-mute']], b === 2));
    if (b >= 3) o.back = op(B * at(b, p, 3), lines(206, [[tr('terugplannen', 'backward planning'), b === 3 ? 'pm-on' : 'pm-big'], [tr('SOP − validatie', 'SOP − validation'), ''], [tr('− proefspuiten', '− trial runs'), ''], [tr('− matrijsbouw', '− building the tool'), ''], [tr('− bestellen', '− ordering'), '']]));
    if (b >= 4) o.freeze = op(at(b, p, 4), lines(340, [[tr('= design freeze', '= design freeze'), 'pm-on'], [tr('dan: engineering change', 'then: engineering change'), 'pm-mute']]));
    return o;
  }

  // s7: the clash and the distinction; then set-based design, its source and
  // soft tooling
  function s7(b, p) {
    const o = { head: [tr('vroeg en laat', 'early and late'), DIA] };
    const A = page(b, p, 0, 2);
    o.clash = op(A, box(54, tr('agile botst', 'agile clashes'), [tr('sprints willen leren', 'sprints want to learn'), tr('long-lead items vragen', 'long-lead items need'), tr('vroege beslissingen', 'early decisions')], b === 0));
    if (b >= 1) o.split = op(A * at(b, p, 1), lines(212, [[tr('onderscheid maken:', 'make a distinction:'), 'pm-big'], [tr('✓ long-lead vroeg vast', '✓ long-lead fixed early'), ''], [tr('✓ de rest flexibel', '✓ the rest flexible'), ''], [tr('✓ interfaces vroeg:', '✓ interfaces early:'), ''], [tr('  bevestigingspunten,', '  mounting points,'), 'pm-mute'], [tr('  aansluitingen', '  connections'), 'pm-mute']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.sbd = op(B, box(54, 'set-based design', [tr('een paar opties open;', 'a few options open;'), tr('afvallen bij kennis', 'drop them with knowledge')], b === 2));
    if (b >= 3) o.toyota = op(B * at(b, p, 3), lines(184, [[tr('onderzoek naar Toyota,', 'research on Toyota,'), ''], [tr('jaren 90; ook in SAFe', 'the 1990s; also in SAFe'), 'pm-mute']]));
    if (b >= 4) {
      const ab = rect(X0, 244, 54, 22, 'pm-card', 3) + txt(X0 + 27, 262, 'A', 'pm-big', 'middle') + rect(X0, 274, 54, 22, 'pm-card', 3) + txt(X0 + 27, 292, 'B', 'pm-big', 'middle')
        + path(`M${X0 + 62} 270h40`, 'pm-line') + path(`M${X0 + 96} 264l7 6l-7 6`, 'pm-line') + rect(X0 + 112, 252, 70, 36, 'pm-hot', 3);
      o.soft = op(at(b, p, 4), ab + txt(X0 + 192, 266, tr('staal', 'steel'), 'pm-big') + lines(326, [['soft tooling:', 'pm-big'], [tr('aluminium proefmatrijzen', 'aluminium trial moulds'), 'pm-mute']]));
    }
    return o;
  }

  // s8: purchasing missing, hearing too late; milestones on the board; the question
  function s8(b, p) {
    const o = { head: [tr('inkoop', 'purchasing'), DIA] };
    const A = page(b, p, 0, 3);
    o.buyer = op(A, box(54, tr('inkoop ontbreekt', 'purchasing is missing'), [tr('bij de sprintplanning', 'at the sprint planning'), tr('en de PI Planning', 'and the PI Planning')], b === 0));
    if (b >= 1) o.late = op(A * at(b, p, 1), lines(184, [[tr('hoort het bij', 'hears of it at'), 'pm-mute'], ['“' + tr('bijna klaar', 'almost done') + '”', 'pm-big'], [tr('levertijd al te lang', 'lead time too long now'), 'pm-on']]));
    if (b >= 2) o.miles = op(A * at(b, p, 2), box(262, tr('planningsbord', 'planning board'), [tr('long-lead = mijlpaal', 'long-lead = milestone'), tr('+ nodig inkoop uit', '+ invite purchasing')], b === 2) + dia(X1 - 14, 284, 9));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.ask2 = op(B, lines(80, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('welk onderdeel heeft', 'which part has the'), 'pm-big'], [tr('de langste levertijd?', 'longest lead time?'), 'pm-big'], ['', ''], [tr('in welke week moet', 'in which week must'), 'pm-on'], [tr('het ontwerp uiterlijk', 'its design be fixed'), 'pm-on'], [tr('vast zijn?', 'at the latest?'), 'pm-on']]));
    return o;
  }

  // s9: the e-bike: SOP in week 40, then back step by step to the freeze, and the check
  function s9(b, p) {
    const o = { head: ['e-bike', EX] };
    o.bike = box(54, tr('SOP: week 40', 'SOP: week 40'), [tr('elektrische fiets:', 'electric bike: the'), tr('accuhuis spuitgegoten', 'battery housing, moulded')], b === 0);
    const step = (y, name, wk, hot) => txt(X0, y, name, 'pm-txt') + txt(X1, y, `${tr('wk', 'wk')} ${wk}`, hot ? 'pm-on' : 'pm-big', 'end');
    if (b >= 1) o.w1 = op(at(b, p, 1), step(186, tr('validatie 4 wk', 'validation 4 wk'), C.STARTS[0], b === 1));
    if (b >= 2) o.w2 = op(at(b, p, 2), step(212, tr('proefspuiten 3 wk', 'trial runs 3 wk'), C.STARTS[1], b === 2));
    if (b >= 3) {
      o.w3 = op(at(b, p, 3), step(238, tr('matrijsbouw 14 wk', 'mould build 14 wk'), C.STARTS[2], false)
        + op(at(b, p, 3, 0.45, 0.65), step(264, tr('bestellen 1 wk', 'ordering 1 wk'), C.STARTS[3], false)
        + rect(X0 - 6, 276, CW + 12, 34, 'pm-hot', 6) + txt(X0 + 4, 300, tr('design freeze: week 18', 'design freeze: week 18'), 'pm-on')));
    }
    if (b >= 4) o.check = op(at(b, p, 4), lines(342, [['40 − 4 − 3 − 14 − 1 = 18', 'pm-big'], [tr('rest: langer flexibel', 'the rest: flexible longer'), 'pm-on']]));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the board
  // Face units (u to the right, v down); A: C.AREA. Mode A (s1 to s5): five
  // stages with four gates above and sprints below; mode B (s6 to s9): weeks
  // 10 to 42 with the SOP, the mould's lead time and the freeze.
  const A = C.AREA;
  const SW = (A.u1 - A.u0 - 4 * 6) / 5;
  const sx = (i) => A.u0 + i * (SW + 6);
  const VG = A.v0 + 6;
  const VS = A.v0 + 16;
  const VL = A.v0 + 42;
  const loop = (x, y, r = 3.4) => `<circle class="pm-loop" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>` + path(`M${f1(x + r - 1.4)} ${f1(y - 1.6)}l1.4 1.6l1.4 -1.6`, 'pm-loop');
  // the three cost bars at the foot of the board (log heights), shown up to n
  const cost = (shown, hot) => [3, 12, 30].map((h, i) => op(shown[i] || 0, rect(A.u0 + 4 + i * 18, A.v1 - h, 12, h, i === hot ? 'pm-note2' : 'pm-note', 0.6))).join('');
  function boardA(si, b, p) {
    const L = {};
    const stagesIn = si === 0 && b === 0 ? [0, 1, 2, 3, 4].map((i) => span(p, 0.1 + i * 0.12, 0.22 + i * 0.12)) : [1, 1, 1, 1, 1];
    L.bStages = [0, 1, 2, 3, 4].map((i) => op(stagesIn[i], rect(sx(i), VS, SW, 14, si === 4 && i === 2 ? 'pm-note2' : 'pm-note', 1))).join('');
    const gIn = si === 0 ? at(b, p, 2) : 1;
    L.bGates = op(gIn, [1, 2, 3, 4].map((i) => dia(sx(i) - 3, VG, 4.5) + path(`M${f1(sx(i) - 3)} ${f1(VG + 5)}V${f1(VL + 6)}`, 'pm-bdash')).join(''));
    const sIn = si < 2 ? 0 : si === 2 ? at(b, p, 1) : 1;
    if (si === 4 && b >= 4) {
      // development (stage 3) as 13 two-week sprints
      let t = '';
      for (let i = 0; i < 13; i++) t += op(span(p, 0.1 + i * 0.04, 0.2 + i * 0.04), path(`M${f1(sx(2) + 1 + i * (SW - 2) / 12.5)} ${f1(VL - 4)}v8`, 'pm-loop'));
      L.bSprints = t + [0, 1, 3].map((i) => loop(sx(i) + SW * 0.3, VL) + loop(sx(i) + SW * 0.72, VL)).join('');
    } else {
      L.bSprints = op(sIn, [0, 1, 2, 3].map((i) => loop(sx(i) + SW * 0.3, VL) + loop(sx(i) + SW * 0.72, VL)).join(''));
    }
    if (si === 1) L.bCost = cost([at(b, p, 0, 0.3, 0.45), at(b, p, 1, 0.1, 0.3), at(b, p, 2, 0.1, 0.3)], b >= 2 ? 2 : b === 1 ? 1 : 0);
    else if (si === 4) L.bCost = cost([at(b, p, 1), at(b, p, 2), at(b, p, 3)], b >= 1 && b <= 3 ? b - 1 : -1);
    else L.bCost = '';
    return L;
  }
  // mode B: weeks to u
  const WK0 = 10;
  const WK1 = 42;
  const wu = (wk) => A.u0 + ((wk - WK0) / (WK1 - WK0)) * (A.u1 - A.u0);
  const VP = A.v0 + 18;
  const VB = A.v1 - 4;
  function boardB(si, b, p) {
    const L = { bStages: '', bCost: '' };
    // the week axis (in the gates' group, which is not lit in these scenes)
    let ax = path(`M${f1(A.u0)} ${f1(VB)}H${f1(A.u1)}`, 'pm-bdash');
    for (let wk = WK0; wk <= WK1; wk += 2) ax += path(`M${f1(wu(wk))} ${f1(VB - 2)}v4`, 'pm-loop');
    L.bGates = ax;
    const sopIn = si === 5 ? at(b, p, 2) : 1;
    L.bSop = op(sopIn, path(`M${f1(wu(C.SOP))} ${f1(A.v0 + 2)}V${f1(VB)}`, 'pm-loop') + rect(wu(C.SOP), A.v0 + 2, 10, 7, 'pm-note2', 0.5));
    // the mould's lane, right to left: validation, trial runs, build, ordering
    const seg = [[C.STARTS[0], C.SOP], [C.STARTS[1], C.STARTS[0]], [C.STARTS[2], C.STARTS[1]], [C.STARTS[3], C.STARTS[2]]];
    let shown;
    if (si === 5) shown = [at(b, p, 3, 0.15, 0.3), at(b, p, 3, 0.3, 0.45), b === 1 ? span(p, 0.1, 0.3) : at(b, p, 3, 0.45, 0.6), at(b, p, 3, 0.6, 0.75)];
    else if (si === 8) shown = [at(b, p, 1), at(b, p, 2), at(b, p, 3), at(b, p, 3, 0.45, 0.65)];
    else shown = [1, 1, 1, 1];
    if (si === 5 && b >= 1) shown[2] = Math.max(shown[2], 1);
    L.bPlan = seg.map(([a, z], i) => op(shown[i], rect(wu(a), VP, wu(z) - wu(a) - 0.6, 12, i === 2 ? 'pm-note2' : 'pm-note', 0.6))).join('');
    const frIn = si === 5 ? at(b, p, 4) : si === 8 ? at(b, p, 3, 0.45, 0.65) : 1;
    L.bFreeze = op(frIn, path(`M${f1(wu(C.FREEZE))} ${f1(A.v0 + 2)}V${f1(VB)}`, 'pm-bdash') + path(`M${f1(wu(C.FREEZE) - 3)} ${f1(A.v0 + 2)}h6l-3 4Z`, 'pm-dia'));
    // the rest of the product: sprints every two weeks, flexible longer
    let sp = '';
    for (let wk = WK0 + 1; wk < C.STARTS[0]; wk += 2) sp += loop(wu(wk), A.v0 + 46, 3);
    L.bSprints = sp;
    // two trial-mould variants before the freeze (s7 onwards), B struck once A wins
    if (si >= 6) {
      const vin = si === 6 ? at(b, p, 2) : 1;
      const strike = si === 6 ? at(b, p, 4, 0.4, 0.6) : 1;
      L.bVariants = op(vin, rect(wu(12), A.v0 + 60, wu(C.FREEZE) - wu(12), 5, 'pm-note', 0.5) + rect(wu(12), A.v0 + 68, wu(C.FREEZE) - wu(12), 5, 'pm-note', 0.5)
        + op(strike, path(`M${f1(wu(12))} ${f1(A.v0 + 75)}L${f1(wu(C.FREEZE))} ${f1(A.v0 + 66)}`, 'pm-bstrike')));
    } else L.bVariants = '';
    // milestones on the plan (s8 onwards): the freeze, the mould ready, the SOP
    if (si >= 7) {
      const mIn = si === 7 ? at(b, p, 2) : 1;
      L.bMiles = op(mIn, [C.FREEZE, C.STARTS[1], C.SOP].map((wk) => dia(wu(wk), VP - 7, 4)).join(''));
    } else L.bMiles = '';
    return L;
  }
  const LAYERS = ['bGates', 'bStages', 'bSprints', 'bCost', 'bPlan', 'bSop', 'bFreeze', 'bMiles', 'bVariants'];

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    const L = si < 5 ? boardA(si, b, p) : boardB(si, b, p);
    for (const k of LAYERS) set(E[k], L[k] || '');
  }

  return { render };
})();
