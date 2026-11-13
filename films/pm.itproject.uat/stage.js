// The stage of the film "De gebruikersacceptatietest / The user acceptance
// test": a pure function of (scene, u). Inlined into the page after the anatomy
// kit and a preamble from build.mjs that defines C (the panel's blocks, the
// strip's parts and geometry, the board's note grid), CAM (one camera move per
// scene), W and H. Moves are placed per Dutch caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step. The
// panel at the top right gets one card per scene, each block in its own cue
// group (o[key] goes into data-k "p_<key>"), all text at 22 units (a video
// film); a card that needs more room turns a page within its scene. The strip
// along the bottom: the four test levels on top (system test, chain test, UAT,
// sign-off), below them the weeks of the UAT or the bar of 120 scripts. The
// board in the room gets its notes: test scripts per process, then defects
// per severity; the sheet on the table its pass and fail marks.
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
  const X0 = 340;
  const X1 = 620;
  const CW = X1 - X0;
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  // a card from y with a first line in bold (accent when hot) and more lines below
  const box = (y, head, rest, hot = false) => {
    const more = rest.map((t) => (Array.isArray(t) ? t : [t])).filter(([t]) => t);
    return card(y, 20 + 26 * (more.length + 1), hot ? 'pm-hot' : 'pm-card') + lines(y + 28, [[head, hot ? 'pm-on' : 'pm-big'], ...more], X0 + 4);
  };
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // a page of the card that shows from beat k0 and gives way at beat k1 (-1: never)
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

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: the test levels: system test, chain test; the UAT; ISTQB
  function s1(b, p) {
    const o = { head: [tr('testniveaus', 'test levels'), DIA] };
    const A = page(b, p, 0, 2);
    o.lev = op(A, box(54, tr('1  systeemtest', '1  system test'), [[tr('de partner test zijn', 'the partner tests its'), ''], [tr('eigen configuratie', 'own configuration'), '']], b === 0));
    if (b >= 1) o.chain = op(A * at(b, p, 1), box(160, tr('2  ketentest', '2  chain test'), [tr('order → MES → etiket', 'order → MES → label'), tr('→ verzending → factuur', '→ shipment → invoice')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.uat = op(B, box(54, '3  UAT', [[tr('gebruikers accepteren', 'users check and accept'), 'pm-on']], b === 2));
    if (b >= 3) o.istqb = op(B * at(b, p, 3), lines(154, [['ISTQB:', 'pm-mute'], [tr('formeel testen tegen', 'formal testing against'), ''], [tr('gebruikersbehoeften,', 'user needs,'), ''], [tr('requirements en', 'requirements and'), ''], [tr('bedrijfsprocessen', 'business processes'), '']]));
    return o;
  }
  // s2: key users; test scenarios from real work; back to the requirements
  function s2(b, p) {
    const o = { head: ['key users', DIA] };
    const A = page(b, p, 0, 1);
    o.ku = op(A, box(54, 'key users', [tr('ervaren, van elke', 'experienced, from'), tr('afdeling: ontwerpen,', 'each department: design,'), tr('testen, later trainen', 'test, later train'), [tr('niet de partner', 'not the partner'), 'pm-on']], b === 0));
    const B = page(b, p, 1, -1);
    if (b >= 1) o.scen = op(B, box(54, tr('testscenario’s', 'test scenarios'), [tr('spoedorder, terwijl', 'a rush order while'), tr('een materiaal tekort is', 'a material is short')], b === 1));
    if (b >= 1) o.scen2 = op(B * at(b, p, 1, 0.3, 0.5), lines(180, [[tr('batch half verpakt,', 'a half-packed batch'), ''], [tr('kwaliteit blokkeert', 'blocked by quality'), ''], [tr('klant stuurt pallet terug', 'a returned pallet'), '']]));
    if (b >= 2) o.trace = op(at(b, p, 2), lines(262, [[tr('→ elke Must getest', '→ every Must tested'), 'pm-on']]));
    return o;
  }
  // s3: the test script; pass or fail; real data; invented data hides errors
  function s3(b, p) {
    const o = { head: [tr('testscript', 'test script'), DIA] };
    const A = page(b, p, 0, 1);
    o.script = op(A, box(54, tr('testscript', 'test script'), [tr('1  de stappen', '1  the steps'), tr('2  de invoer', '2  the input data'), tr('3  verwacht resultaat', '3  expected result')], b === 0));
    o.passfail = op(A * at(b, p, 0, 0.5, 0.7), lines(214, [[tr('wat gebeurde er echt?', 'what really happened?'), 'pm-mute'], [tr('✓ geslaagd  ✗ gezakt', '✓ pass   ✗ fail'), 'pm-big']]));
    const B = page(b, p, 1, -1);
    if (b >= 1) o.data = op(B, box(54, tr('echte data', 'real data'), [tr('uit de laatste', 'from the last'), tr('proefmigratie', 'mock migration'), [tr('verkeerde eenheid?', 'wrong unit?'), 'pm-mute'], [tr('routing mist een stap?', 'a step missing?'), 'pm-mute']], b === 1));
    if (b >= 2) o.fake = op(B * at(b, p, 2), lines(240, [[tr('verzonnen data:', 'invented data:'), 'pm-mute'], [tr('fouten tot de go-live', 'errors until go-live'), 'pm-on']]));
    return o;
  }
  // s4: sign-off; not the training, not new wishes; what goes wrong; the question
  function s4(b, p) {
    const o = { head: ['sign-off', DIA] };
    const A = page(b, p, 0, 2);
    o.sign = op(A, box(54, 'sign-off', [tr('proceseigenaren tekenen', 'process owners accept'), [tr('vaak met een betaling', 'often with a payment'), 'pm-mute']], b === 0));
    if (b >= 1) o.not = op(A * at(b, p, 1), lines(180, [[tr('✗ niet de training', '✗ not the training'), 'pm-big'], [tr('✗ “Het zou handig', '✗ “It would be handy'), 'pm-big'], [tr('   zijn als…”', '   if…”'), 'pm-big'], [tr('→ wijzigingsproces', '→ the change process'), 'pm-on']]));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.wrong = op(B, box(54, tr('wat vaak misgaat', 'often goes wrong'), [tr('bouw loopt uit: UAT', 'build late: the UAT'), [tr('van 4 weken naar 1', 'from 4 weeks to 1'), 'pm-on'], tr('testen tussen het werk', 'testing between work')], b === 2));
    if (b >= 3) o.happy = op(B * at(b, p, 3), lines(214, [[tr('alleen het happy path:', 'only the happy path:'), 'pm-big'], [tr('alles gaat goed', 'everything goes right'), 'pm-mute']]));
    if (b >= 4) o.askq = op(page(b, p, 4, -1), lines(80, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('wie test?', 'who tests?'), 'pm-big'], [tr('hoeveel uur per week', 'how many hours a week'), 'pm-big'], [tr('vrijgemaakt?', 'are they freed?'), 'pm-big'], [tr('met welke data?', 'with which data?'), 'pm-on']]));
    return o;
  }
  // s5: the food producer: 120 scripts; the awkward cases; effort, capacity, time; the plan; backfill
  function s5(b, p) {
    const o = { head: [tr('UAT plannen', 'planning the UAT'), EX] };
    const A = page(b, p, 0, 2);
    o.food = op(A, lines(80, [[tr('nieuw ERP, 4 processen:', 'new ERP, 4 processes:'), b === 0 ? 'pm-on' : 'pm-big'], [tr('order tot betaling,', 'order to cash,'), 'pm-mute'], [tr('productie, inkoop,', 'production, purchasing,'), 'pm-mute'], [tr('kwaliteit: 120 scripts', 'quality: 120 scripts'), 'pm-mute']]));
    o.awk = op(A * at(b, p, 0, 0.35, 0.55), lines(190, [[tr('kwaliteitsblokkade,', 'quality hold, recall,'), ''], [tr('terugroepactie, spoed', 'rush order with'), ''], [tr('met een tekort', 'a shortage'), '']]));
    if (b >= 1) o.effort = op(A * at(b, p, 1), lines(276, [[tr('120 × 1,5 u = 180 uur', '120 × 1.5 h = 180 hours'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.cap = op(B, lines(66, [[tr('8 key users × 18 u', '8 key users × 18 h'), b === 2 ? 'pm-on' : 'pm-big'], [tr('(½ van 36) = 144 u/wk', '(½ of 36) = 144 h/wk'), 'pm-mute']]));
    if (b >= 3) o.time = op(at(b, p, 3), lines(126, [[tr('180 / 144 = 1,25 week', '180 / 144 = 1.25 weeks'), b === 3 ? 'pm-on' : 'pm-big']]));
    if (b >= 4) o.plan = op(at(b, p, 4), box(140, tr('gepland', 'planned'), [tr('ronde 1: twee weken', 'round 1: two weeks'), tr('ronde 2: hertesten', 'round 2: retesting')], b === 4));
    if (b >= 5) o.backfill = op(at(b, p, 5), lines(266, [[tr('vervanging geregeld', 'backfill arranged'), 'pm-on']]));
    return o;
  }
  // s6: the defect; not every defect a fault; severity 1 to 4; priority
  function s6(b, p) {
    const o = { head: [tr('bevinding', 'defect'), DIA] };
    const A = page(b, p, 0, 2);
    o.defect = op(A, box(54, tr('bevinding', 'defect'), [tr('wijkt af van verwacht', 'differs from expected'), tr('stappen, scherm, nummer', 'steps, screenshot, ID')], b === 0));
    if (b >= 1) o.nofault = op(A * at(b, p, 1), lines(180, [[tr('geen fout als het is:', 'no fault when it is:'), 'pm-mute'], [tr('verkeerde testdata,', 'wrong test data,'), ''], [tr('nog niet geleerd, of', 'not learned yet, or'), ''], [tr('nieuwe wens → wijziging', 'a new wish → change'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.sev = op(B, box(54, tr('ernst', 'severity'), [tr('1  blokkerend: niet', '1  blocking: cannot'), [tr('   verzenden of boeken', '   ship or book stock'), 'pm-mute'], tr('2  zwaar, wel omweg', '2  serious, workaround'), tr('3 klein  4 cosmetisch', '3 minor  4 cosmetic')], b === 2));
    if (b >= 3) o.prio = op(at(b, p, 3), lines(232, [[tr('prioriteit: hoe snel', 'priority: how fast'), 'pm-big'], [tr('datum kan hem verhogen', 'a date can raise it'), 'pm-on']]));
    return o;
  }
  // s7: triage and the andon response; retest; regression test
  function s7(b, p) {
    const o = { head: ['triage', DIA] };
    const A = page(b, p, 0, 2);
    o.triage = op(A, box(54, tr('triage, dagelijks', 'triage, daily'), [tr('fout? welke ernst?', 'a fault? what severity?'), tr('wie lost op, wanneer?', 'who fixes, by when?')], b === 0));
    if (b >= 1) o.andon = op(A * at(b, p, 1), lines(180, [[tr('als een andonreactie:', 'like an andon response:'), 'pm-mute'], [tr('snel, dicht bij het werk', 'fast, close to the work'), ''], [tr('ernst: de proces-', 'severity: the process'), 'pm-on'], [tr('eigenaar, niet de partner', 'owner, not the partner'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.retest = op(B, box(54, tr('hertest', 'retest'), [tr('script opnieuw na fix', 'rerun after a fix'), [tr('✓ dan gaat hij dicht', '✓ then it is closed'), 'pm-on']], b === 2));
    if (b >= 3) o.regr = op(B * at(b, p, 3), box(166, tr('regressietest', 'regression test'), [tr('eerder geslaagde', 'scripts that passed'), tr('scripts opnieuw', 'before, run again')], b === 3));
    return o;
  }
  // s8: exit criteria; the example criteria; severity 2; the question
  function s8(b, p) {
    const o = { head: [tr('exitcriteria', 'exit criteria'), DIA] };
    const A = page(b, p, 0, 2);
    o.exit = op(A, box(54, tr('exitcriteria', 'exit criteria'), [tr('vooraf afgesproken:', 'agreed in advance:'), tr('wanneer is de UAT klaar?', 'when is the UAT done?')], b === 0));
    if (b >= 1) o.ex1 = op(A * at(b, p, 1), lines(180, [[tr('✓ 100% uitgevoerd', '✓ 100% run'), ''], [tr('✓ minstens 95% geslaagd', '✓ at least 95% passed'), ''], [tr('✓ geen open ernst 1', '✓ no open severity 1'), '']]));
    if (b >= 1) o.ex2 = op(A * at(b, p, 1, 0.45, 0.65), lines(258, [[tr('ernst 2: omweg + datum', 'sev. 2: workaround + date'), 'pm-on']]));
    if (b >= 2) o.askd = op(page(b, p, 2, -1), lines(80, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('wie bepaalt de ernst?', 'who decides severity?'), 'pm-big'], [tr('kan de partner hem', 'can the partner lower'), 'pm-big'], [tr('zelf verlagen?', 'it on its own?'), 'pm-big'], ['', ''], [tr('zo ja: criteria zo sterk', 'if so: only as strong'), 'pm-on'], [tr('als de partner wil', 'as the partner wants'), 'pm-on']]));
    return o;
  }
  // s9: day 8: the counts; triage; the 17 by severity; the two severity 1s; the exit sum; the fix
  function s9(b, p) {
    const o = { head: [tr('dag 8', 'day 8'), EX] };
    const A = page(b, p, 0, 4);
    o.day = op(A, lines(70, [[tr('nieuw MES, 120 scripts:', 'new MES, 120 scripts:'), b === 0 ? 'pm-on' : 'pm-big'], [tr('112 gedaan, 101 geslaagd', '112 run, 101 passed'), ''], [tr('23 bevindingen open', '23 defects open'), '']]));
    if (b >= 1) o.six = op(A * at(b, p, 1), lines(152, [[tr('triage: 6 geen fout', 'triage: 6 no fault'), b === 1 ? 'pm-on' : 'pm-big'], [tr('3 testdata, 2 training,', '3 test data, 2 training,'), 'pm-mute'], [tr('1 wens → wijziging', '1 wish → change'), 'pm-mute']]));
    if (b >= 2) o.left = op(A * at(b, p, 2), lines(238, [[tr('17: 2, 5, 7, 3 per ernst', '17: 2, 5, 7, 3 by severity'), b === 2 ? 'pm-on' : 'pm-big']]));
    if (b >= 3) o.sev1 = op(A * at(b, p, 3), lines(266, [[tr('ernst 1: werkorder, etiket', 'sev. 1: work order, label'), 'pm-on']]));
    const B = page(b, p, 4, -1);
    if (b >= 4) o.need = op(B, box(54, tr('95% van 120 = 114', '95% of 120 = 114'), [[tr('114 − 101 = nog 13', '114 − 101 = 13 more'), 'pm-on']], b === 4));
    if (b >= 5) o.fix = op(B * at(b, p, 5), box(136, tr('beide ernst 1', 'both severity 1'), [tr('oplossen, hertesten,', 'fix, retest, cover'), tr('regressieset', 'with a regression set'), [tr('eerst, met een datum', 'first, with a date'), 'pm-mute']], b === 5));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the strip
  const S = C.STRIP;
  // row A: the four test levels; which show from which scene and beat
  const LEV = [['lSys', tr('systeemtest', 'system test')], ['lChain', tr('ketentest', 'chain test')], ['lUat', 'UAT'], ['lSign', 'sign-off']];
  const levShown = (i, si, b, p) => {
    if (i < 3) return si > 0 ? 1 : at(b, p, i, 0.05, 0.3);
    return si > 3 ? 1 : si === 3 ? at(b, p, 0, 0.1, 0.4) : 0;
  };
  // row B: the scripts bar, x of script n (0..120)
  const bx = (n) => S.bar0 + (n / 120) * S.barW;
  function strip(si, b, p) {
    const L = {};
    LEV.forEach(([key, name], i) => {
      const x = S.lx[i];
      const arrow = i > 0 ? path(`M${f1(x - 8)} ${S.ay}l6 0M${f1(x - 5)} ${S.ay - 4}l3 4l-3 4`, 'pm-line') : '';
      L[key] = op(levShown(i, si, b, p), arrow + rect(x, S.ly, S.lw, 34, 'pm-blk', 5) + txt(x + S.lw / 2, S.ly + 25, name, 'pm-big', 'middle'));
    });
    // a row of labels laid out by their length (about 13 units a lower-case character at 22 units, bold; 16 a
    // capital), centred in the strip; sep: arrows between them, boxed: each in a box
    const wOf = (t) => [...t].reduce((a, ch) => a + (/[A-Z]/.test(ch) ? 16 : 13), 0);
    const row = (items, sep, boxed) => {
      const gap = sep ? 46 : 10;
      const ws = items.map((t) => wOf(t) + (boxed ? 18 : 0));
      let x = 320 - (ws.reduce((a, v) => a + v, 0) + gap * (items.length - 1)) / 2;
      return items.map((t, i) => {
        const w = ws[i];
        let out = '';
        if (i > 0 && sep) out += path(`M${f1(x - 32)} ${S.ry + 20}l18 0M${f1(x - 19)} ${S.ry + 15}l5 5l-5 5`, 'pm-line');
        out += (boxed ? rect(x, S.ry + 2, w, 36, 'pm-blk', 4) : '') + txt(x + w / 2, S.ry + 28, t, 'pm-big', 'middle');
        x += w + gap;
        return out;
      }).join('');
    };
    // s1 to s3: the chain test's chain, from s1 beat 1
    if (si <= 2 && (si > 0 || b >= 1)) L.sChain = op(si > 0 ? 1 : at(b, p, 1, 0.2, 0.5), row(['order', 'MES', tr('etiket', 'label'), tr('verzending', 'shipment'), tr('factuur', 'invoice')], true, false));
    // s6 from beat 2 and s7: the severity scale
    if ((si === 5 && b >= 2) || si === 6) L.sSev = op(si === 6 ? 1 : at(b, p, 2, 0.1, 0.4), row([tr('1 blokkerend', '1 blocking'), tr('2 zwaar', '2 serious'), tr('3 klein', '3 minor'), tr('4 cosmetisch', '4 cosmetic')], false, true));
    // s4 page B: the four weeks squeezed to one
    if (si === 3 && b >= 2) {
      const sq = b === 2 ? span(p, 0.3, 0.8) : 1;
      let body = '';
      for (let i = 0; i < 4; i++) {
        const w = i === 0 ? 146 : 146 * (1 - sq);
        body += rect(16 + i * 150 * (1 - sq), S.ry, w, 40, i === 0 && sq > 0.5 ? 'pm-over' : 'pm-blk', 4);
      }
      body += txt(16 + 73, S.ry + 28, sq < 0.5 ? tr('4 weken UAT', '4 weeks of UAT') : tr('1 week', '1 week'), 'pm-big', 'middle');
      L.wSqueeze = op(at(b, p, 2), body);
    }
    // s5 page B: the weeks: round 1 (two weeks), round 2 (one), and the 1.25 weeks needed
    if (si === 4 && b >= 3) {
      const wk = 186;
      L.wNeed = op(at(b, p, 3), rect(16, S.ry, 1.25 * wk, 40, 'pm-over', 4) + txt(16 + 1.25 * wk - 6, S.ry + 28, tr('1,25', '1.25'), 'pm-on', 'end'));
      if (b >= 4) {
        L.wR1 = op(at(b, p, 4), rect(16, S.ry, 2 * wk - 3, 40, 'pm-blk', 4) + txt(16 + 2 * wk - 12, S.ry + 28, tr('ronde 1', 'round 1'), 'pm-big', 'end'));
        L.wR2 = op(at(b, p, 4, 0.3, 0.5), rect(16 + 2 * wk + 3, S.ry, wk, 40, 'pm-blk', 4) + txt(16 + 2.5 * wk + 3, S.ry + 28, tr('ronde 2', 'round 2'), 'pm-big', 'middle'));
      }
    }
    // s8: the bar of all scripts, the 95 % line; s9: 112 run, 101 passed, 114 needed
    if (si === 7 && b >= 1) {
      L.bRun = op(at(b, p, 1), rect(bx(0), S.ry, S.barW, 40, 'pm-blk', 4) + txt(bx(0) + 8, S.ry + 28, tr('100% uitgevoerd', '100% run'), 'pm-big'));
      L.bLine = op(at(b, p, 1, 0.4, 0.6), path(`M${f1(bx(114))} ${S.ry - 4}v48`, 'pm-mark') + txt(bx(114) - 8, S.ry + 28, '95%', 'pm-on', 'end'));
    }
    if (si === 8) {
      L.bRun = rect(bx(0), S.ry, bx(112) - bx(0), 40, 'pm-blk', 4) + (b < 4 ? txt(bx(112) - 4, S.ry + 28, '112', 'pm-big', 'end') : '');
      L.bPass = rect(bx(0), S.ry, bx(101) - bx(0), 40, 'pm-barpass', 4) + txt(bx(101) - 6, S.ry + 28, '101', 'pm-big', 'end');
      if (b >= 4) L.bLine = op(at(b, p, 4), rect(bx(101), S.ry + 6, bx(114) - bx(101), 28, 'pm-over', 3) + path(`M${f1(bx(114))} ${S.ry - 4}v48`, 'pm-mark') + txt(bx(114) + 6, S.ry + 28, '114', 'pm-on'));
    }
    return L;
  }

  // ---------------------------------------------------------------- the board's notes
  // C.NOTES: the grid on the board's face (u = x, v = -z): column c, row r
  const N = C.NOTES;
  const note = (c, r, cls) => { const u = N.u0 + c * N.du; const v = N.v0 + r * N.dv; return `<rect class="${cls}" x="${f1(u)}" y="${f1(v)}" width="${N.w}" height="${N.h}" rx=".6"/>`; };
  const col = (c, n, cls, from = 0) => { let s = ''; for (let r = from; r < n; r++) s += note(c, r, typeof cls === 'function' ? cls(r) : cls); return s; };
  function notes(si, b, p) {
    if (si === 0) return '';
    // the UAT: three to six scripts per process
    if (si <= 4) {
      const n = si === 4 ? [6, 5, 4, 5] : [3, 3, 2, 3];
      const grow = si === 1 ? at(b, p, 1, 0.1, 0.6) : 1;
      const cls = (c) => (r) => {
        if (si === 2 && (b >= 1 || p > 0.6)) return c === 2 && r === 1 ? 'pm-fail' : 'pm-pass';
        if (si === 3) return 'pm-pass';
        return 'pm-note';
      };
      return op(grow, n.map((k, c) => col(c, k, cls(c))).join(''));
    }
    // the defects: by severity in four columns
    if (si === 5) return op(at(b, p, 2, 0.1, 0.5), [1, 2, 3, 2].map((k, c) => col(c, k, 'pm-def')).join(''));
    if (si === 6) {
      const closed = b >= 2 ? at(b, p, 2, 0.4, 0.7) : 0;
      return [1, 2, 3, 2].map((k, c) => col(c, k, (r) => (c === 1 && r === 0 && closed > 0.5 ? 'pm-pass' : 'pm-def'))).join('');
    }
    if (si === 7) return [1, 2, 3, 2].map((k, c) => col(c, k, 'pm-def')).join('');
    // s9: 23 open, 6 are no fault (fade out), 17 sorted 2, 5, 7, 3; severity 1 hot
    const six = b === 0 ? 1 : b === 1 ? 1 - span(p, 0.5, 0.9) : 0;
    const mixed = b === 0 ? 1 : b === 1 ? 1 : b === 2 ? 1 - span(p, 0, 0.3) : 0;
    const sorted = b < 2 ? 0 : b === 2 ? span(p, 0.2, 0.5) : 1;
    let s = '';
    // before sorting: 17 defects in rows of four, the 6 below them in grey
    let m = '';
    for (let i = 0; i < 17; i++) m += note(i % 4, Math.floor(i / 4), 'pm-def');
    s += op(mixed, m);
    let g = '';
    for (let i = 0; i < 6; i++) g += note(i % 4, 5 + Math.floor(i / 4), 'pm-grey');
    s += op(six, g);
    s += op(sorted, [2, 5, 7, 3].map((k, c) => col(c, k, c === 0 && b >= 3 ? 'pm-hotnote' : 'pm-def')).join(''));
    return s;
  }
  // the sheet's marks: pass and fail per row, in s3 from beat 1
  function marks(si, b, p) {
    if (si !== 2 && si !== 5 && si !== 6) return '';
    const tk = (y) => path(`M14.5 ${f1(y)}l1.2 1.3l2.6 -3`, 'pm-btick');
    const cx = (y) => path(`M14.5 ${f1(y - 1.4)}l3 3M17.5 ${f1(y - 1.4)}l-3 3`, 'pm-bcross');
    if (si === 2) return op(b >= 1 ? 1 : at(b, p, 0, 0.55, 0.8), tk(6) + tk(11) + cx(16) + tk(21));
    if (si === 5) return tk(6) + tk(11) + cx(16);
    return tk(6) + tk(11) + (b >= 2 ? op(at(b, p, 2, 0.4, 0.7), tk(16)) : cx(16));
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    const L = strip(si, b, p);
    for (const k of C.SPARTS) set(E[k], L[k] || '');
    set(E.notesIn, notes(si, b, p));
    set(E.marks, marks(si, b, p));
  }

  return { render };
})();
