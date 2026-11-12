// The stage of the film "Werken met experts / Working with experts": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C (the calendar cells, the numbers of
// the worked examples), CAM (one camera move per scene), W and H. Moves are
// placed per caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
// The panel at the right gets one card per scene, each block in its own cue
// group (o[key] goes into data-k "p_<key>"); all text is 22 units (a film for
// video). The forty items of the robot cell are one group (grid). The board in
// the room repeats the card in miniature, the calendar strip on the side wall
// carries the weeks (the percentage that hangs, three weeks of almost done, the
// moved demo, the fixed demo day). Two scenes carry two cards each (seq): trust
// but verify, then results and the four-eyes principle; red flags, then the
// ninety-ninety rule, and the sheet on the table is the
// supplier's checklist, then the list of open issues.
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
  // a red flag on a pole, its foot at (x, y), s high
  const flag = (x, y, s = 26) => path(`M${f1(x)} ${f1(y)}V${f1(y - s)}`, 'pm-pole') + path(`M${f1(x)} ${f1(y - s)}l${f1(s * 0.8)} ${f1(s * 0.28)}l${f1(-s * 0.8)} ${f1(s * 0.28)}Z`, 'pm-flag');
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
  // s1: trust but verify; the working rule; experts check each other
  function s1(b, p) {
    const o = { head: [tr('vertrouwen', 'trust'), DIA] };
    const A = page(b, p, 0, 2);
    o.trust = op(A, lines(80, L([['vertrouwen maar', 'pm-big'], ['controleren', 'pm-big'], ['oud Russisch spreekwoord'], ['Reagan, jaren tachtig:', 'pm-mute'], ['wapenonderhandelingen', 'pm-mute']],
      [['trust but verify', 'pm-big'], ['an old Russian proverb'], ['Reagan, 1980s:', 'pm-mute'], ['arms talks', 'pm-mute']])));
    o.rule = op(A * at(b, p, 1), card(222, 124, 'pm-hot') + lines(252, L([['vertrouw: vakmanschap'], ['en bedoelingen'], ['controleer: resultaten', 'pm-on'], ['die echt tellen', 'pm-on']],
      [['trust: skill and intent'], ['check: the results', 'pm-on'], ['that matter', 'pm-on']])));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.peers = op(B, lines(80, L([['geen wantrouwen', 'pm-big'], ['experts controleren'], ['elkaar: codereviews,'], ['testrapporten, een'], ['tweede engineer tekent'], ['de tekening', 'pm-mute']],
        [['not distrust', 'pm-big'], ['experts check each'], ['other: code reviews,'], ['test reports, a second'], ['engineer signs the'], ['drawing', 'pm-mute']])));
      o.same = op(B * span(p, 0.45, 0.65), card(266, 56, 'pm-hot') + txt(X0, 302, tr('jij vraagt hetzelfde', 'you ask for the same'), 'pm-on'));
    }
    return o;
  }

  // s2: results, not methods; watch the test; the four-eyes principle; your job
  function s2(b, p) {
    const o = { head: [tr('resultaten', 'results'), DIA] };
    const A = page(b, p, 0, 2);
    o.results = op(A, lines(80, L([['resultaten,', 'pm-big'], ['geen methodes', 'pm-big'], ['kabel berekend? vraag:', 'pm-mute'], ['‘Wie controleerde het,'], ['en waar getekend?’']],
      [['results,', 'pm-big'], ['not methods', 'pm-big'], ['cable sized? ask:', 'pm-mute'], ['‘Who checked it,'], ['and where is it signed?’']])));
    o.test = op(A * at(b, p, 1), card(232, 88, 'pm-hot') + lines(264, L([['code lezen? nee', 'pm-mute'], ['bij de test kijken: ja', 'pm-on']],
      [['read the code? no', 'pm-mute'], ['watch the test: yes', 'pm-on']])));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      // two pairs of eyes: the maker and the second, qualified checker
      const eyes = (x, cls) => dot(x - 13, 214, 10, 'pm-card') + dot(x + 13, 214, 10, 'pm-card') + dot(x - 13, 214, 4, cls) + dot(x + 13, 214, 4, cls);
      o.four = op(B, lines(80, L([['vier-ogenprincipe', 'pm-big'], ['belangrijk werk: een'], ['tweede bevoegde'], ['persoon controleert']],
        [['four-eyes principle', 'pm-big'], ['important work checked'], ['by a second qualified'], ['person']]))
        + eyes(X0 + 60, 'pm-dot') + op(span(b === 2 ? p : 1, 0.3, 0.5), eyes(X0 + 200, 'pm-blk')));
      o.yourjob = op(B * at(b, p, 3), card(250, 106, 'pm-hot') + lines(280, L([['jouw taak: zorgen dat', 'pm-on'], ['die ogen er zijn,'], ['niet ze zelf zijn']],
        [['your job: make sure', 'pm-on'], ['those eyes exist,'], ['not be them']])));
    }
    return o;
  }

  // forty items as a 10 by 4 grid: state(i) gives each square's class
  const grid = (y, state, a = () => 1) => {
    let s = '';
    for (let i = 0; i < C.CELL.all; i++) {
      const x = X0 + 14 + (i % 10) * 26;
      const yy = y + Math.floor(i / 10) * 26;
      s += op(a(i), rect(x, yy, 20, 20, state(i), 3));
    }
    return s;
  };
  const sqAt = (i, y) => [X0 + 24 + (i % 10) * 26, y + 10 + Math.floor(i / 10) * 26];
  const SPOT = [13, 26, 37];

  // s3: risk-based checking; a full check; a spot check; two failures
  function s3(b, p) {
    const o = { head: [tr('risico', 'risk'), DIA] };
    const A = page(b, p, 0, 2);
    o.risk = op(A, lines(80, L([['risicogestuurd', 'pm-big'], ['harder controleren waar'], ['een fout het meest'], ['pijn doet']],
      [['risk-based checking', 'pm-big'], ['check harder where a'], ['mistake would hurt'], ['most']])));
    o.full = op(A * at(b, p, 1), card(206, 172, 'pm-hot') + lines(236, L([['volledige controle', 'pm-on'], ['veiligheid'], ['geld'], ['alles wat je niet'], ['terug kunt draaien']],
      [['full check', 'pm-on'], ['safety'], ['money'], ['anything you'], ['can’t undo']])));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const q = b === 2 ? p : 1;
      o.spot = op(B, lines(80, L([['steekproef', 'pm-big'], ['klein willekeurig deel']], [['spot check', 'pm-big'], ['a small random sample']]))
        + grid(124, (i) => (SPOT.includes(i) && q > 0.4 ? 'pm-hot' : 'pm-sq'))
        + txt(X0, 248, tr('3 van de 40 tekeningen', '3 of the 40 drawings'), 'pm-on'));
      o.twoerr = op(B * at(b, p, 3), card(266, 112) + lines(296, L([['twee fouten:', 'pm-big'], ['niks controleren'], ['alles: experts trager']],
        [['two failures:', 'pm-big'], ['checking nothing'], ['all: experts slow down']])));
    }
    return o;
  }

  // s4: process, not person, upfront; the sentence; timing; push-back; the sharp question
  function s4(b, p) {
    const o = { head: [tr('zo vraag je', 'how to ask'), DIA] };
    const A = page(b, p, 0, 3);
    o.process = op(A, lines(80, L([['over het proces,', 'pm-big'], ['niet de persoon,', 'pm-big'], ['en vooraf gezegd', 'pm-on']],
      [['about the process,', 'pm-big'], ['not the person,', 'pm-big'], ['said upfront', 'pm-on']])));
    o.quote = op(A * at(b, p, 1), card(156, 128) + lines(186, L([['‘In elk project vraag'], ['ik de testresultaten'], ['van veiligheidspunten.'], ['Niet om jou.’', 'pm-on']],
      [['‘On every project I'], ['ask for the test results'], ['for the safety items.'], ['It’s not about you.’', 'pm-on']])));
    o.timing = op(A * at(b, p, 2), lines(318, L([['vooraf: routine', 'pm-on'], ['erna: verdenking'], ['pas bij wantrouwen: laat', 'pm-mute']],
      [['upfront: routine', 'pm-on'], ['after: suspicion'], ['once distrusted: late', 'pm-mute']])));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.push = op(B, lines(80, L([['‘al dat papierwerk’', 'pm-big'], ['soms terecht: ritueel'], ['welke controles vangen'], ['echt iets? houd die', 'pm-on']],
        [['‘no time for paperwork’', 'pm-big'], ['sometimes fair: ritual'], ['which checks catch'], ['problems? keep those', 'pm-on']])));
      o.sharp = op(at(b, p, 4), card(204, 176, 'pm-hot') + lines(234, L([['‘Als dit fout was, hoe', 'pm-on'], ['komen we erachter,', 'pm-on'], ['en hoe snel?’', 'pm-on'], ['bij livegang? dan een'], ['controle vooraf']],
        [['‘If this were wrong,', 'pm-on'], ['how would we find out,', 'pm-on'], ['and how soon?’', 'pm-on'], ['at go-live? then a'], ['check before then']])));
    }
    return o;
  }

  // s5: the robot cell: forty items, sorted 5 + 3 + 32; the safety items; full and spot checks; agreed upfront
  function s5(b, p) {
    const o = { head: [tr('robotcel', 'robot cell'), EX] };
    const V = C.CELL;
    const sorted = b >= 1 ? (b === 1 ? span(p, 0.15, 0.5) : 1) : 0;
    const cls = (i) => (sorted > 0.5 && i < V.safety ? 'pm-flag' : sorted > 0.5 && i < V.safety + V.perf ? 'pm-blk2' : 'pm-sq');
    o.case = txt(X0, 78, tr(`${V.all} punten, checklist`, `${V.all} items, checklist`), 'pm-big');
    let marks = '';
    if (b >= 3) {
      const k = b === 3 ? p : 1;
      for (let i = 0; i < V.safety + V.perf; i++) { const [x, y] = sqAt(i, 92); marks += op(span(k, 0.1 + i * 0.03, 0.2 + i * 0.03), tick(x - 1, y - 1, 'pm-strike')); }
      SPOT.forEach((i, j) => { const [x, y] = sqAt(i, 92); marks += op(span(k, 0.6 + j * 0.08, 0.7 + j * 0.08), dot(x, y, 13, 'pm-pole')); });
    }
    o.grid = grid(92, cls, (i) => (b > 0 ? 1 : span(p, 0.05 + i * 0.008, 0.12 + i * 0.008))) + marks;
    o.case += op(page(b, p, 0, 1), lines(232, L([['geen ervan kun je', 'pm-mute'], ['zelf beoordelen', 'pm-mute']], [['none you can judge', 'pm-mute'], ['yourself', 'pm-mute']])));
    if (b >= 1) {
      const sw = (y, c) => rect(X0, y - 17, 20, 20, c, 3);
      o.sort = op(page(b, p, 1, 2), txt(X0, 232, tr('stap 1: op risico', 'step 1: by risk'), 'pm-big')
        + sw(258, 'pm-flag') + txt(X0 + 32, 258, tr(`${V.safety} veiligheid`, `${V.safety} safety`))
        + sw(284, 'pm-blk2') + txt(X0 + 32, 284, tr(`${V.perf} prestaties`, `${V.perf} performance`))
        + sw(310, 'pm-sq') + txt(X0 + 32, 310, tr(`${V.routine} routine`, `${V.routine} routine`))
        + txt(X0, 336, tr('met veiligheidskundige', 'with safety engineer'), 'pm-mute'));
    }
    if (b >= 2) {
      o.safety = op(page(b, p, 2, 3), lines(232, L([['veiligheid:', 'pm-big'], ['noodstoppen'], ['lichtscherm: straal'], ['stopt de robot', 'pm-mute'], ['hekvergrendeling:'], ['deur open, robot stopt', 'pm-mute']],
        [['safety:', 'pm-big'], ['emergency stops'], ['light curtain: a beam'], ['stops the robot', 'pm-mute'], ['fence interlocks: a'], ['gate opens, it stops', 'pm-mute']])));
    }
    if (b >= 3) {
      o.check = op(page(b, p, 3, 4), lines(232, L([['stap 2: 8 volledig', 'pm-big'], ['jij bij de test; tekent:'], ['de veiligheidskundige', 'pm-mute'], ['stap 3: 3 willekeurig', 'pm-big']],
        [['step 2: 8 in full', 'pm-big'], ['you at the test, signed'], ['by the safety engineer', 'pm-mute'], ['step 3: 3 at random', 'pm-big']])));
    }
    if (b >= 4) {
      o.agree = op(span(p, 0.05, 0.2), card(208, 150, 'pm-hot') + lines(238, L([['stap 4: bij de start', 'pm-on'], ['‘zo controleer ik,'], ['in elk project’'], ['grip op 8,', 'pm-on'], ['een lichte hand op 32']],
        [['step 4: at the start', 'pm-on'], ['‘this is how I check,'], ['on every project’'], ['grip on 8,', 'pm-on'], ['a light touch on 32']])));
    }
    return o;
  }

  // s6: a red flag; signals; three that cover a lot
  function s6(b, p) {
    const o = { head: [tr('rode vlag', 'red flag'), DIA] };
    const A = page(b, p, 0, 2);
    o.flag = op(A, lines(80, L([['rode vlag', 'pm-big'], ['waarschuwingsteken:'], ['iets is mis, voordat'], ['de planning het toont']],
      [['red flag', 'pm-big'], ['a warning sign:'], ['something is wrong'], ['before the plan shows it']])) + flag(X1 - 30, 92, 34));
    o.signals = op(A * at(b, p, 1), card(214, 106, 'pm-hot') + lines(244, L([['probleem: onzichtbaar', 'pm-mute'], ['signalen: hoe mensen', 'pm-on'], ['praten en rapporteren', 'pm-on']],
      [['the problem: hidden', 'pm-mute'], ['signals: how people', 'pm-on'], ['talk and report', 'pm-on']])));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const items = L(['altijd bijna klaar', 'vage antwoorden', 'geen demo'], ['always almost done', 'vague answers', 'no demo']);
      o.three = op(B, txt(X0, 80, tr('drie dekken veel', 'three cover a lot'), 'pm-big')
        + items.map((t, i) => op(span(p, 0.1 + i * 0.2, 0.25 + i * 0.2), flag(X0 + 6, 140 + i * 60, 30) + txt(X0 + 40, 132 + i * 60, t))).join(''));
    }
    return o;
  }

  // s7: the ninety-ninety rule; the two halves of the time; the percentage that hangs
  function s7(b, p) {
    const o = { head: [tr('bijna klaar', 'almost done'), DIA] };
    o.rule90 = lines(80, L([['negentig-negentigregel', 'pm-big'], ['Tom Cargill, Bell Labs'], ['Jon Bentley, 1985', 'pm-mute']],
      [['ninety-ninety rule', 'pm-big'], ['Tom Cargill, Bell Labs'], ['Jon Bentley, 1985', 'pm-mute']]));
    if (b >= 1) {
      // time on 0..180 %: the first 90 % of the code in 90 % of the time, the last 10 % in another 90 %
      const s = CW / 180;
      const k = b === 1 ? span(p, 0.45, 0.85) : 1;
      const N = C.NN;
      o.bars = op(at(b, p, 1), txt(X0 + 45 * s, 164, tr(`${N.first}% code`, `${N.first}% code`), 'pm-txt', 'middle') + rect(X0, 172, N.first * s - 2, 22, 'pm-blk', 3)
        + op(k, txt(X0 + 135 * s, 164, tr(`${N.rest}% code`, `${N.rest}% code`), 'pm-on', 'middle')) + rect(X0 + N.first * s, 172, N.first * s * k, 22, 'pm-blk2', 3)
        + path(`M${X0} 204H${X1}`, 'pm-axis') + txt(X0, 228, '0', 'pm-mute') + txt(X0 + 90 * s, 228, '90%', 'pm-mute', 'middle') + op(k, txt(X1, 228, '180%', 'pm-mute', 'end'))
        + op(k, txt(X0, 254, tr('tijd: nog eens 90%', 'time: another 90%'), 'pm-on')));
    }
    if (b >= 2) {
      o.hang = op(span(p, 0.05, 0.2), card(264, 116, 'pm-hot') + lines(292, L([['% hangt al wekenlang?', 'pm-on'], ['vraag wat er over is,'], ['punt voor punt; wat'], ['is het moeilijkst?']],
        [['% stuck for weeks?', 'pm-on'], ['ask what is left,'], ['item by item; which'], ['is the hardest?']])));
    }
    return o;
  }

  // s8: vague answers; ask for specifics; the watermelon status
  function s8(b, p) {
    const o = { head: [tr('vaag', 'vague'), DIA] };
    const A = page(b, p, 0, 2);
    o.vague = op(A, lines(80, L([['‘we zijn ermee bezig’'], ['‘het zou goed moeten'], ['komen’'], ['‘wat kleine issues’'], ['één keer: normaal', 'pm-mute'], ['patroon: signaal', 'pm-on']],
      [['‘we’re working on it’'], ['‘it should be fine’'], ['‘some minor issues’'], ['once: normal', 'pm-mute'], ['a pattern: a signal', 'pm-on']])));
    o.detail = op(A * at(b, p, 1), card(232, 148, 'pm-hot') + lines(262, L([['‘Welke issues, en wat', 'pm-on'], ['is bij elk de volgende', 'pm-on'], ['stap?’', 'pm-on'], ['in de hand: één zin'], ['anders: steeds vager', 'pm-mute']],
      [['‘Which issues, and', 'pm-on'], ['the next step on each?’', 'pm-on'], ['in control: a sentence'], ['if not: ever vaguer', 'pm-mute']])));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const cx = X0 + CW / 2;
      const r = 78;
      const half = (rr) => `M${f1(cx - rr)} 128A${rr} ${rr} 0 0 0 ${f1(cx + rr)} 128Z`;
      const seeds = [[-40, 146], [-14, 160], [14, 152], [40, 144], [0, 178], [-28, 176], [28, 174]].map(([dx, y]) => dot(cx + dx, y, 3.4, 'pm-pole')).join('');
      o.melon = op(B, txt(X0, 80, tr('watermeloenstatus', 'watermelon status'), 'pm-big')
        + path(half(r), 'pm-green') + op(span(b === 2 ? p : 1, 0.3, 0.55), path(half(r - 10), 'pm-flag') + seeds)
        + lines(250, L([['buiten groen gemeld,', 'pm-on'], ['van binnen rood:'], ['het team weet het', 'pm-mute']], [['reported green outside,', 'pm-on'], ['red inside:'], ['the team knows it', 'pm-mute']])));
    }
    return o;
  }

  // s9: a demo; none after months; other signals
  function s9(b, p) {
    const o = { head: [tr('geen demo', 'no demo'), DIA] };
    const A = page(b, p, 0, 2);
    const scr = rect(X0, 150, 96, 58, 'pm-card', 4) + path(`M${X0 + 38} 163l22 16l-22 16Z`, 'pm-blk');
    o.demo = op(A, lines(80, L([['demo', 'pm-big'], ['het ding live laten'], ['werken, geen slides']], [['demo', 'pm-big'], ['the thing working,'], ['live, not slides']])) + scr);
    o.strong = op(A * at(b, p, 1), card(226, 106, 'pm-hot') + lines(256, L([['maanden gebouwd, niets', 'pm-on'], ['werkends te zien:'], ['de sterkste vlag', 'pm-on']],
      [['months of building,', 'pm-on'], ['nothing working shown:'], ['the strongest flag', 'pm-on']])) + flag(X1 - 24, 320, 30));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      const items = L([['1 persoon weet alles', 1], ['steeds ander contact', 1], ['testen uitgesteld', 1], ['slecht nieuws vlak', 1], ['voor een deadline', 0]],
        [['one person knows all', 1], ['changing contacts', 1], ['tests postponed', 1], ['bad news the day', 1], ['before a deadline', 0]]);
      o.others = op(B, txt(X0, 80, tr('andere signalen', 'other signals'), 'pm-big')
        + items.map(([t, bullet], i) => op(span(p, 0.05 + i * 0.12, 0.15 + i * 0.12), (bullet ? dot(X0 + 6, 120 + i * 30, 5, 'pm-flag') : '') + txt(X0 + 20, 128 + i * 30, t))).join(''));
    }
    return o;
  }

  // s10: one flag is a reason to ask; questions and evidence; look at yourself; the worry question
  function s10(b, p) {
    const o = { head: [tr('reageren', 'responding'), DIA] };
    const A = page(b, p, 0, 2);
    o.one = op(A, lines(80, L([['1 vlag: reden om', 'pm-big'], ['te vragen, geen bewijs', 'pm-big'], ['experts: vaak eerlijk'], ['optimistisch; soms is'], ['het echt bijna opgelost', 'pm-mute']],
      [['1 flag: a reason', 'pm-big'], ['to ask, not proof', 'pm-big'], ['experts: often honestly'], ['optimistic; some things'], ['are really almost solved', 'pm-mute']])));
    o.evidence = op(A * at(b, p, 1), card(222, 82, 'pm-hot') + lines(254, L([['vragen en bewijs,', 'pm-on'], ['geen beschuldigingen']], [['questions, evidence,', 'pm-on'], ['not accusations']])));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.mirror = op(B, lines(80, L([['kijk naar jezelf', 'pm-big'], ['slecht nieuws laat?'], ['misschien voelt het'], ['niet veilig om het'], ['te brengen', 'pm-mute']],
        [['look at yourself', 'pm-big'], ['bad news late?'], ['maybe it doesn’t'], ['feel safe to'], ['bring it', 'pm-mute']])));
      o.worry = op(at(b, p, 3), card(232, 112, 'pm-hot') + lines(264, L([['‘Waar maak je je zorgen', 'pm-on'], ['over dat je me nog', 'pm-on'], ['niet verteld hebt?’', 'pm-on']],
        [['‘What are you worried', 'pm-on'], ['about that you haven’t', 'pm-on'], ['told me yet?’', 'pm-on']])));
    }
    return o;
  }

  // s11: the label printing module: three weeks almost done, green; the moved demo; four flags; this week; owner and sponsor
  function s11(b, p) {
    const o = { head: [tr('labelmodule', 'label module'), EX] };
    const V = C.MES;
    const A = page(b, p, 0, 2);
    const status = b >= 4 ? 'pm-amber' : 'pm-green';
    o.case2 = op(A, lines(80, L([[`MES, maand ${V.month}`, 'pm-big'], [`labelprinten, ${V.weeks} weken:`], ['‘bijna klaar, wat', 'pm-mute'], ['kleine issues’', 'pm-mute']],
      [[`MES, month ${V.month}`, 'pm-big'], [`label printing, ${V.weeks} wks:`], ['‘almost done, a few', 'pm-mute'], ['small issues’', 'pm-mute']]))
      + dot(X1 - 10, 73, 10, status) + txt(X1 - 28, 80, tr('groen', 'green'), 'pm-txt', 'end'));
    o.slip = op(A * at(b, p, 1), card(196, 154) + lines(226, L([['demo vrijdag verzet:'], ['‘testomgeving lag plat’', 'pm-mute'], ['de developer zit nu'], ['bij een andere klant'], ['van de leverancier', 'pm-mute']],
      [['Friday’s demo moved:'], ['‘test environment down’', 'pm-mute'], ['the developer left for'], ['another client of the'], ['supplier', 'pm-mute']])));
    if (b === 2) {
      const flags = L(['wekenlang bijna klaar', 'vage kleine issues', 'demo uitgesteld', 'sleutelpersoon weg'], ['almost done for weeks', 'vague small issues', 'demo postponed', 'key person leaving']);
      o.count = op(span(p, 0.02, 0.2), txt(X0, 80, tr(`${V.flags} rode vlaggen`, `${V.flags} red flags`), 'pm-big')
        + flags.map((t, i) => op(span(p, 0.1 + i * 0.1, 0.2 + i * 0.1), flag(X0 + 6, 124 + i * 32, 24) + txt(X0 + 32, 120 + i * 32, t))).join('')
        + op(span(p, 0.6, 0.75), card(258, 82, 'pm-hot') + lines(290, L([['groen? misschien een', 'pm-on'], ['watermeloen', 'pm-on']], [['green? maybe a', 'pm-on'], ['watermelon', 'pm-on']]))));
    }
    if (b >= 3) {
      o.week = op(page(b, p, 3, -1), lines(80, L([['deze week', 'pm-big'], ['open issues als lijst:'], ['eigenaar en datum', 'pm-mute'], ['demo op vaste dag,'], ['desnoods een laptop', 'pm-mute']],
        [['this week', 'pm-big'], ['open issues as a list:'], ['owner and date each', 'pm-mute'], ['demo on a fixed day,'], ['even on a laptop', 'pm-mute']])));
    }
    if (b >= 4) {
      o.owner = op(span(p, 0.05, 0.25), lines(222, L([['wie is nu eigenaar?'], ['hoe ging de overdracht?']], [['who owns it now?'], ['how was the handover?']]))
        + card(272, 108, 'pm-hot') + lines(302, L([['sponsor: oranje', 'pm-on'], ['tot de demo,'], ['met de redenen']], [['sponsor: amber', 'pm-on'], ['until the demo,'], ['with the reasons']]))
        + dot(X1 - 14, 295, 10, 'pm-amber'));
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
  const CARDS = [seq(s1, 3, s2), s3, s4, s5, seq(s6, 3, s7), s8, s9, s10, s11];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip: the weeks the percentage hangs (s5); three weeks of
  // almost done, the moved demo and the fixed demo day (s9)
  function calendar(si, b, p) {
    const cell = (wk) => C.CELLS[wk - 1];
    const fill = (wk, cls, a = 1) => { const [x0, y0, x1, y1] = cell(wk); return op(a, rect(x0, y0, x1 - x0, y1 - y0, cls, 1)); };
    let s = '';
    const grow = (from, to, cls, a) => { for (let wk = from; wk <= to; wk++) s += fill(wk, cls, clamp(a * (to - from + 1) - (wk - from), 0, 1)); };
    if (si === 4 && b >= 5) grow(1, 6, 'pm-blk2', b > 5 ? 1 : span(p, 0.1, 0.6));
    if (si === 8) {
      grow(1, C.MES.weeks, 'pm-hot', b > 0 ? 1 : span(p, 0.2, 0.6));
      if (b >= 1) {
        const [x0, y0, x1, y1] = cell(C.MES.weeks + 1);
        s += op(b > 1 ? 1 : span(p, 0.05, 0.25), path(`M${f1(x0 + 1)} ${f1(y0 + 2)}L${f1(x1 - 1)} ${f1(y1 - 2)}M${f1(x1 - 1)} ${f1(y0 + 2)}L${f1(x0 + 1)} ${f1(y1 - 2)}`, 'pm-strike'));
      }
      if (b >= 3) s += fill(C.MES.weeks + 2, 'pm-blk', b > 3 ? 1 : span(p, 0.55, 0.75));
    }
    return s;
  }
  // the sheet on the table: drawings with three picked (s2), the forty-item
  // checklist with its eight and three (s4), the list of open issues (s9)
  function sheet(si, b, p) {
    let s = '';
    const row = (i, w0 = 18) => `<path class="pm-line" d="M6 ${f1(4 + i * 3.2)}H${f1(w0 - (i % 3) * 2)}"/>`;
    const mark = (i, a = 1) => op(a, `<path class="pm-line" d="M2 ${f1(4 + i * 3.2)}l1.2 1.2l2.2 -2.6"/>`);
    if (si === 1 && b >= 2) for (let i = 0; i < 8; i++) s += row(i) + ([1, 4, 6].includes(i) ? mark(i, b > 2 ? 1 : span(p, 0.4, 0.6)) : '');
    if (si === 3) for (let i = 0; i < 8; i++) s += row(i) + (b >= 3 && (i < 3 || i === 6) ? mark(i, b > 3 ? 1 : span(p, 0.2 + i * 0.05, 0.3 + i * 0.05)) : '');
    if (si === 8 && b >= 3) for (let i = 0; i < 6; i++) s += op(b > 3 ? 1 : span(p, 0.1 + i * 0.06, 0.2 + i * 0.06), row(i, 14) + `<path class="pm-rule" d="M15.5 ${f1(4 + i * 3.2)}H19"/>`);
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
