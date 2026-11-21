// The stage of the film "Plannen toetsen, jargon vertalen / Testing plans,
// translating jargon": a pure function of (scene, u). Inlined into the page
// after the anatomy kit and a preamble from build.mjs that defines C (the
// calendar cells, the numbers of the two worked examples), CAM (one camera
// move per scene), W and H. Moves are placed per caption beat (beatStarts), so
// the video's narration timing (films/_kit/beatwarp.js) keeps them in step.
// The panel at the right gets one card per scene, each block in its own cue
// group (o[key] goes into data-k "p_<key>"), all text at 22 units (a video
// film). The board in the room repeats the card in miniature, the calendar
// strip on the side wall carries the go-live about two months away and the
// scanner test next week, and the sheet on the table fills with the
// premortem's written reasons, later the one plain sentence.
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
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  // rows with a bullet (a small diamond) from y down, 26 apart
  const bullets = (y, list, a = 1) => list.map((t, i) => op(a, dia(X0 + 7, y + i * 26 - 7, 5) + txt(X0 + 20, y + i * 26, t))).join('');
  // a numbered step: a ring with the number, then its text lines
  const step = (y, n, list, hot = false) => dot(X0 + 12, y - 7, 13, hot ? 'pm-hot' : 'pm-card') + txt(X0 + 12, y, String(n), hot ? 'pm-on' : 'pm-txt', 'middle') + lines(y, list, X0 + 34);
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
  // s1: two questions; the first finds risks, the second checks claims; together
  function s1(b, p) {
    const o = { head: [tr('twee vragen', 'two questions'), DIA] };
    o.q1 = card(52, 104) + lines(80, [[tr('‘Waardoor zou dit', '‘What would make'), 'pm-big'], [tr('mislukken?’', 'this fail?’'), 'pm-big']]);
    o.finds = op(at(b, p, 1), txt(X0, 132, tr('vindt risico’s', 'finds risks'), 'pm-on') + dia(X1 - 12, 125, 8));
    o.q2 = op(at(b, p, 0, 0.35, 0.55), card(168, 78) + lines(196, [[tr('‘Hoe weet je dat?’', '‘How do you know?’'), 'pm-big']]));
    o.checks = op(at(b, p, 1, 0.35, 0.55), txt(X0, 222, tr('toetst beweringen', 'checks the claims'), 'pm-on') + tick(X1 - 12, 216));
    o.together = op(at(b, p, 2), card(262, 120, 'pm-hot') + lines(290, [[tr('samen: een plan', 'together: test a'), 'pm-on'], [tr('testen zonder elk', 'plan without knowing')], [tr('detail te snappen', 'every detail')]]));
    return o;
  }

  // s2: the premortem; Klein 2007; the 1989 study; reasons, not quality; write first
  function s2(b, p) {
    const o = { head: [tr('premortem', 'premortem'), DIA] };
    const A = page(b, p, 0, 2);
    o.pm = op(A, lines(78, [[tr('premortem', 'premortem'), 'pm-big'], [tr('vraag 1, vaste vorm:', 'question 1, fixed form:'), 'pm-mute'], [tr('‘het project is al', '‘the project has'), 'pm-on'], [tr('mislukt’; iedereen', 'failed’; each writes'), 'pm-on'], [tr('schrijft op waarom,', 'down why, before')], [tr('voordat iemand praat', 'anyone speaks')]]));
    o.klein = op(A * at(b, p, 1), card(242, 100) + lines(270, [[tr('Gary Klein, 2007', 'Gary Klein, 2007'), 'pm-big'], [tr('Harvard Business', 'Harvard Business'), 'pm-mute'], [tr('Review', 'Review'), 'pm-mute']]));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const q = b === 2 ? p : 1;
      // reasons found: looking ahead against imagining it already happened
      const base = 150;
      o.study = op(B, lines(78, [[tr('onderzoek, 1989', 'a 1989 study'), 'pm-big'], [tr('Mitchell, Russo,', 'Mitchell, Russo,'), 'pm-mute'], [tr('Pennington', 'Pennington'), 'pm-mute']])
        + rect(X0, 150, base, 16, 'pm-blk2', 4) + txt(X0 + base + 10, 166, tr('vooruit', 'ahead'), 'pm-mute')
        + rect(X0, 180, base * (1 + 0.3 * span(q, 0.25, 0.6)), 16, 'pm-blk', 4) + op(span(q, 0.5, 0.7), txt(X1, 196, '+30%', 'pm-on', 'end'))
        + txt(X0, 222, tr('al gebeurd', 'already happened'), 'pm-txt'));
      o.count = op(at(b, p, 3), lines(258, [[tr('telt redenen, niet', 'counts reasons, not'), 'pm-txt'], [tr('hun kwaliteit', 'their quality'), 'pm-mute']]));
      o.write = op(at(b, p, 4), card(300, 82, 'pm-hot') + lines(328, [[tr('eerst schrijven:', 'write first:'), 'pm-on'], [tr('geen senior toon', 'no senior tone')]]));
    }
    return o;
  }

  // s3: the single point of failure; three examples; the mitigation; a worry
  function s3(b, p) {
    const o = { head: [tr('zwakke plek', 'weak spot'), DIA] };
    const A = page(b, p, 0, 2);
    o.spof = op(A, lines(78, [[tr('single point of', 'single point of'), 'pm-big'], [tr('failure', 'failure'), 'pm-big'], [tr('één onderdeel, persoon', 'one part, person or')], [tr('of leverancier valt', 'supplier fails:')], [tr('uit: alles ligt stil', 'everything stops'), 'pm-on']]));
    const ex = [tr('server, geen back-up', 'server, no backup'), tr('één programmeur', 'one programmer'), tr('kabel voor de fabriek', 'cable to the factory')];
    o.three = op(A * at(b, p, 1), card(220, 118) + ex.map((t, i) => op(at(b, p, 1, 0.1 + i * 0.2, 0.25 + i * 0.2), dia(X0 + 9, 248 + i * 30 - 7, 6) + txt(X0 + 24, 248 + i * 30, t))).join(''));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.mit = op(B, lines(78, [[tr('beheersmaatregel', 'mitigation'), 'pm-big'], [tr('wat we nu doen:', 'what we do now:')], [tr('minder waarschijnlijk', 'less likely')], [tr('of minder erg', 'or less bad')], [tr('en wie is eigenaar?', 'and who owns it?'), 'pm-on']]));
      o.worry = op(at(b, p, 3), card(226, 108, 'pm-hot') + lines(254, [[tr('geen maatregel, geen', 'no mitigation, no'), 'pm-on'], [tr('eigenaar: alleen', 'owner: just a'), 'pm-on'], [tr('een zorg', 'worry')]]));
    }
    return o;
  }

  // s4: evidence; the ladder; ask calmly; the first answer; MORE PIES; the rule
  function s4(b, p) {
    const o = { head: [tr('hoe weet je dat?', 'evidence'), DIA] };
    const A = page(b, p, 0, 3);
    o.proof = op(A, lines(78, [[tr('bewijs', 'evidence'), 'pm-big'], [tr('zien, testen of', 'see, test or check')], [tr('controleren; geen mening', 'not an opinion'), 'pm-mute']]));
    // the ladder: four rungs, each a longer bar
    const rungs = [tr('ik denk het', 'I think so'), tr('werkte eerder', 'worked before'), tr('hier getest', 'tested here'), tr('testrapport', 'test report')];
    o.ladder = op(A * at(b, p, 1), rungs.map((t, i) => {
      const y = 254 - i * 26;
      return op(at(b, p, 1, 0.1 + i * 0.15, 0.22 + i * 0.15), rect(X0, y - 14, 18 + i * 18, 16, i === 3 ? 'pm-blk' : 'pm-blk2', 3) + txt(X0 + 104, y, t, i === 3 ? 'pm-on' : 'pm-txt'));
    }).join('') + op(at(b, p, 1, 0.7, 0.9), txt(X0, 280, tr('zwak naar sterk', 'weak to strong'), 'pm-mute')));
    o.calm = op(A * at(b, p, 2), card(294, 88) + lines(320, [[tr('‘Hoe weten we dat het', '‘How do we know the'), 'pm-on'], [tr('netwerk dit aankan?’', 'network can carry it?’'), 'pm-on']]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.first = op(B, lines(78, [[tr('eerste antwoord:', 'the first answer:'), 'pm-big'], [tr('het comfortabele', 'the comfortable one')], [tr('na een pauze komt', 'the useful one comes')], [tr('het bruikbare', 'after a pause'), 'pm-on']]));
      o.pies = op(at(b, p, 4), card(176, 106) + lines(204, [[tr('MORE PIES, later meer', 'MORE PIES, more later'), 'pm-big'], [tr('S: stilte, zwijg even', 'S: Silence, stay quiet')], [tr('I: één laag dieper', 'I: Inquiry, go deeper')]]));
      o.rule = op(at(b, p, 5), card(292, 92, 'pm-hot') + lines(318, [[tr('vuistregel van veel', 'many project leaders:'), 'pm-mute'], [tr('projectleiders: niets', 'no surprises? then'), 'pm-on'], [tr('verrast? niet eerlijk', 'not honest yet'), 'pm-on']]));
    }
    return o;
  }

  // s5: the MES premortem in five steps
  function s5(b, p) {
    const o = { head: [tr('MES-livegang', 'MES go-live'), EX] };
    const A = page(b, p, 0, 3);
    o.case = op(A, lines(78, [[tr('2 maanden voor live', '2 months to go-live'), 'pm-big'], [tr('30 min, 8 mensen', '30 min, 8 people'), 'pm-mute']]));
    o.st1 = op(A * at(b, p, 1), step(140, 1, [[tr('‘Het is september.', '‘It’s September.'), 'pm-txt'], [tr('Mislukt. Waarom?’', 'Failed. Why?’')], [tr('alleen, 5 minuten', 'alone, 5 minutes'), 'pm-mute']], b === 1));
    const said = [tr('scanners lijn 2', 'line 2 scanners'), tr('nachtdienst', 'night shift'), tr('alleen Ahmed', 'only Ahmed')];
    o.st2 = op(A * at(b, p, 2), step(248, 2, [[tr('voorlezen:', 'read out:'), 'pm-txt']], b === 2)
      + said.map((t, i) => op(at(b, p, 2, 0.15 + i * 0.2, 0.3 + i * 0.2), dia(X0 + 41, 274 + i * 26 - 7, 5) + txt(X0 + 54, 274 + i * 26, t))).join(''));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.st3 = op(B, step(80, 3, [[tr('groeperen, de drie', 'group, pick the three'), 'pm-txt'], [tr('ernstigste kiezen', 'most serious')]], b === 3));
      o.st4 = op(at(b, p, 4), step(150, 4, [[tr('‘Hoe weten we dat?’', '‘How do we know?’'), 'pm-txt'], [tr('kantoor, niet de lijn', 'office, not the line'), 'pm-mute'], [tr('zwak bewijs', 'weak evidence'), 'pm-on']], b === 4)
        + op(at(b, p, 4, 0.5, 0.7), cross(X1 - 10, 196)));
      o.st5 = op(at(b, p, 5), card(240, 142, 'pm-hot') + step(268, 5, [[tr('scannertest lijn 2,', 'scanner test line 2,'), 'pm-on'], [tr('volgende week', 'next week')], [tr('eigenaar: IT-lead', 'owner: the IT lead')], [tr('Ahmed: 2e persoon', 'Ahmed: a second'), 'pm-mute'], [tr('', 'person'), 'pm-mute']], true));
    }
    return o;
  }

  // s6: jargon; the problem; translate back into four
  function s6(b, p) {
    const o = { head: [tr('jargon', 'jargon'), DIA] };
    o.jargon = lines(78, [[tr('jargon', 'jargon'), 'pm-big'], [tr('vaktaal: precies voor', 'specialist language:')], [tr('insiders, voor de rest', 'precise for insiders,')], [tr('ondoorzichtig', 'opaque for the rest'), 'pm-mute']]);
    o.problem = op(at(b, p, 1), card(172, 78) + lines(198, [[tr('probleem: besluiten', 'problem: decisions'), 'pm-on'], [tr('die niemand snapt', 'nobody understands')]]));
    const four = [tr('doel', 'goal'), tr('kosten', 'cost'), tr('tijd', 'time'), tr('risico', 'risk')];
    // a two by two grid: wide enough for "kosten" and "risico" at 22 units
    o.four = op(at(b, p, 2), txt(X0, 270, tr('terugvertalen naar', 'translate back into'), 'pm-big')
      + four.map((t, i) => op(at(b, p, 2, 0.15 + i * 0.12, 0.27 + i * 0.12), rect(X0 + (i % 2) * 146, 280 + Math.floor(i / 2) * 40, 138, 34, 'pm-hot', 6) + txt(X0 + (i % 2) * 146 + 69, 304 + Math.floor(i / 2) * 40, t, 'pm-on', 'middle'))).join('')
      + op(at(b, p, 2, 0.7, 0.9), txt(X0, 378, tr('voor sponsor en vloer', 'for sponsor and floor'), 'pm-mute')));
    return o;
  }

  // s7: active listening; the eight letters; P and I; the correction; silence
  function s7(b, p) {
    const o = { head: [tr('luisteren', 'listening'), DIA] };
    const A = page(b, p, 0, 2);
    o.active = op(A, lines(78, [[tr('actief luisteren', 'active listening'), 'pm-big'], [tr('om te begrijpen, niet', 'to understand, not')], [tr('om te antwoorden', 'to reply')]]));
    const L = [['M', tr('Mood: sfeer', 'Mood')], ['O', tr('Open vragen', 'Open questions')], ['R', tr('Reflecteren', 'Reflecting')], ['E', tr('Empathie', 'Empathy')],
      ['P', tr('Parafraseren', 'Paraphrasing')], ['I', tr('Inquiry: doorvragen', 'Inquiry')], ['E', tr('Experience: ervaring', 'Experience')], ['S', tr('Silence: stilte', 'Silence')]];
    o.letters = op(A * at(b, p, 0, 0.4, 0.6), L.map(([l, t], i) => {
      const y = 170 + i * 26;
      const hot = (i === 4 || i === 5) && b >= 1;
      return (hot ? rect(X0 - 4, y - 19, CW + 8, 25, 'pm-hot', 5) : '') + txt(X0 + 10, y, l, hot ? 'pm-on' : 'pm-big', 'middle') + txt(X0 + 32, y, t, hot ? 'pm-on' : 'pm-txt');
    }).join(''));
    if (b === 2 || b === 3) {
      const B = page(b, p, 2, 4);
      o.para = op(B, lines(78, [[tr('P: parafraseren', 'P: paraphrasing'), 'pm-big'], [tr('in eigen woorden,', 'in your own words,')], [tr('om te checken', 'to check you')], [tr('‘Dus wat je zegt is…', '‘So what you’re saying'), 'pm-on'], [tr('Klopt dat?’', 'is… Right?’'), 'pm-on']]));
      o.correct = op(B * at(b, p, 3), card(230, 108, 'pm-hot') + lines(258, [[tr('expert verbetert:', 'the expert corrects:'), 'pm-on'], [tr('daar zit wat', 'that is where'), 'pm-txt'], [tr('je leert', 'you learn')]]));
    }
    if (b >= 4) {
      const B = page(b, p, 4, -1);
      const qs = [tr('de datum?', 'the date?'), tr('de kosten?', 'the cost?'), tr('het risico?', 'the risk?')];
      o.inq = op(B, lines(78, [[tr('I: doorvragen', 'I: inquiry'), 'pm-big'], [tr('één laag dieper', 'one level deeper')], [tr('wat betekent dat voor', 'what does it mean for'), 'pm-mute']])
        + qs.map((t, i) => op(at(b, p, 4, 0.3 + i * 0.15, 0.42 + i * 0.15), dia(X0 + 9, 158 + i * 28 - 7, 6) + txt(X0 + 24, 158 + i * 28, t, 'pm-on'))).join(''));
      o.silence = op(at(b, p, 5), card(266, 104) + lines(294, [[tr('stilte: wacht na de', 'silence: after the'), 'pm-big'], [tr('parafrase op de', 'paraphrase, wait for')], [tr('verbetering', 'the correction')]]));
    }
    return o;
  }

  // s8: teach-back; the other way round; the sentence; the failures; one sentence
  function s8(b, p) {
    const o = { head: [tr('terugvertellen', 'teach-back'), DIA] };
    const A = page(b, p, 0, 3);
    o.tb = op(A, lines(78, [[tr('terugvertellen', 'teach-back'), 'pm-big'], [tr('uit de zorg: patiënt', 'from health care: the')], [tr('vertelt instructies', 'patient explains it')], [tr('in eigen woorden terug', 'back in own words'), 'pm-mute']]));
    o.round = op(A * at(b, p, 1), card(178, 104, 'pm-hot') + lines(206, [[tr('andersom: jij vertelt', 'other way round: you'), 'pm-on'], [tr('het terug als aan de', 'tell it back as to the')], [tr('sponsor; hij verbetert', 'sponsor; he fixes it')]]));
    o.line = op(A * at(b, p, 2), lines(320, [[tr('één zin voor de', 'one sentence for the'), 'pm-big'], [tr('stuurgroep, goed geciteerd', 'steering, not misquoted')]]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.loose = op(B, lines(78, [[tr('fout: te los vertaald', 'failure: too loose'), 'pm-big'], [tr('‘dus eigenlijk is het', '‘so it’s basically'), 'pm-on'], [tr('prima?’', 'fine?’'), 'pm-on']]) + cross(X1 - 10, 124));
      o.fails = op(at(b, p, 4), bullets(178, [tr('jargon voor bestuur', 'jargon to the board'), tr('doen alsof je volgt', 'pretending to follow'), tr('onvertaald doorgeven', 'passed on unexplained')]));
      o.one = op(at(b, p, 5), card(266, 116, 'pm-hot') + lines(294, [[tr('voor managers: eerst', 'before managers: agree'), 'pm-on'], [tr('samen de ene zin', 'the one sentence'), 'pm-on'], [tr('voor de sponsor', 'for the sponsor')]]));
    }
    return o;
  }

  // s9: the ERP interface: the jargon, the paraphrase, the honest question, teach-back
  function s9(b, p) {
    const o = { head: [tr('ERP-koppeling', 'ERP interface'), EX] };
    const A = page(b, p, 0, 2);
    o.case2 = op(A, lines(78, [[tr('‘batch, niet', '‘batch, not'), 'pm-big'], [tr('real-time: tot 15 min', 'real-time: up to 15 min'), 'pm-big'], [tr('latency’', 'latency’'), 'pm-big']]));
    o.idem = op(A * at(b, p, 1), lines(170, [[tr('‘geen idempotentie', '‘no idempotency'), 'pm-txt'], [tr('bij retries’', 'on retries’')]]));
    o.para2 = op(A * at(b, p, 1, 0.4, 0.6), card(240, 112, 'pm-hot') + lines(268, [[tr('jij: orders komen tot', 'you: orders arrive up'), 'pm-on'], [tr('15 min te laat aan', 'to 15 min late')], [tr('hij knikt', 'he nods'), 'pm-mute']]) + tick(X1 - 14, 320));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.ask = op(B, lines(78, [[tr('‘In gewone woorden?', '‘In plain words? And'), 'pm-big'], [tr('En het gevolg?’', 'the consequence?’'), 'pm-big']]));
      o.answer = op(at(b, p, 3), lines(146, [[tr('2× verstuurd: order', 'sent twice: an order'), 'pm-txt'], [tr('dubbel. Kosten? Vaak?', 'doubled. Cost? Often?'), 'pm-on']]));
      o.tbline = op(at(b, p, 4), card(200, 112, 'pm-hot') + lines(228, [[tr('‘tot 15 min te laat,', '‘up to 15 min late,'), 'pm-on'], [tr('soms dubbel: check', 'sometimes doubled:')], [tr('nodig. Klopt dat?’', 'a check. Fair?’')]]));
      o.final = op(at(b, p, 5), lines(346, [[tr('1 woord aangepast:', '1 word changed:'), 'pm-big'], [tr('naar de stuurgroep', 'to the steering group'), 'pm-on']]));
    }
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip: the go-live about two months away (s5 b1), the scanner
  // test next week (s5 b6)
  function calendar(si, b, p) {
    if (si !== 4) return '';
    const cell = (wk) => C.CELLS[wk - 1];
    const fill = (wk, cls, a = 1) => { const [x0, y0, x1, y1] = cell(wk); return op(a, rect(x0, y0, x1 - x0, y1 - y0, cls, 1)); };
    const mark = (wk, a = 1) => { const [x0, y0, x1, y1] = cell(wk); return op(a, dia((x0 + x1) / 2, (y0 + y1) / 2, Math.min(x1 - x0, y1 - y0) * 0.4)); };
    let s = '';
    if (b === 0) for (let wk = 1; wk <= 8; wk++) s += fill(wk, 'pm-card', span(p, 0.2 + wk * 0.05, 0.3 + wk * 0.05));
    if (b >= 0) s += mark(9, b > 0 ? 1 : span(p, 0.6, 0.8));
    if (b >= 5) s += fill(1, 'pm-hot', span(p, 0.1, 0.3));
    return s;
  }
  // the sheet on the table: the written reasons (s2, s5), the one sentence (s8, s9)
  function sheet(si, b, p) {
    const rule = (i, len = 12) => `<path class="pm-line" d="M4 ${f1(4 + i * 4.2)}H${f1(4 + len)}"/>`;
    let s = '';
    if ((si === 1 && b <= 1) || (si === 4 && b >= 1 && b <= 3)) {
      const k = si === 1 && b === 0 ? p : si === 4 && b === 1 ? p : 1;
      for (let i = 0; i < 6; i++) s += op(span(k, 0.15 + i * 0.1, 0.25 + i * 0.1), rule(i, 14 - (i % 3) * 3));
    }
    if ((si === 7 && b >= 2) || (si === 8 && b >= 4)) {
      s += op(si === 7 && b === 2 ? span(p, 0.2, 0.5) : si === 8 && b === 4 ? span(p, 0.2, 0.5) : 1, rule(2, 15) + rule(3, 10));
      if (si === 8 && b >= 5) s += '<path class="pm-line" d="M2 12l1.2 1.2l2.2 -2.6"/>';
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
