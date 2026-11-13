// The stage of the film "Voorspellen en sturen op flow / Forecasting and
// steering on flow": a pure function of (scene, u). Inlined into the page after
// the anatomy kit and a preamble from build.mjs that defines C (the panel's
// blocks, the strip's parts, the board's note grid, the week cells, the two
// examples' data), CAM (one camera move per scene), W and H. Moves are placed
// per Dutch caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the top right gets
// one card per scene, each block in its own cue group (o[key] goes into data-k
// "p_<key>"), all text at 22 units (a video film); a card that needs more room
// turns a page within its scene. The strip along the bottom carries the
// scene's chart: the cone, the range of weeks, the histogram of runs, the
// steps of NoEstimates and Goodhart, the throughput bars and the share of runs
// done, the sorted cycle times, the ages, the cumulative flow diagram and the
// utilisation curve. The board in the room gets its notes (open, under way,
// done; one item ages in test), the week strip its marks.
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
  // s1: the cone; the range at the initial idea; how it narrows
  function s1(b, p) {
    const o = { head: [tr('de kegel', 'the cone'), DIA] };
    o.cone = box(54, tr('onzekerheidskegel', 'cone of uncertainty'), [[tr('Boehm, 1981; later', 'Boehm, 1981; later'), 'pm-mute'], [tr('uitgewerkt: McConnell', 'worked out: McConnell'), 'pm-mute'], tr('hoe vroeger, hoe breder', 'the earlier, the wider')], b === 0);
    if (b >= 1) o.range = op(at(b, p, 1), lines(194, [[tr('eerste idee: 0,25× tot 4×', 'initial idea: 0.25× to 4×'), b === 1 ? 'pm-on' : 'pm-big'], [tr('ervaringsoordeel,', 'expert judgement,'), 'pm-mute'], [tr('geen harde meting', 'not hard measurement'), 'pm-mute']]));
    if (b >= 2) o.narrow = op(page(b, p, 2, -1), card(184, 100, 'pm-hot') + lines(212, [[tr('smalt alleen door', 'narrows only by'), 'pm-on'], [tr('✓ werkende stukken', '✓ working pieces'), 'pm-big'], [tr('✗ alleen tijd', '✗ time on its own'), 'pm-big']], X0 + 4));
    if (b >= 2) o.range = op(b === 2 ? 1 - span(p, 0, 0.15) : 0, o.range);
    return o;
  }
  // s2: a probability, not a date; the sponsor chooses; throughput; the range
  function s2(b, p) {
    const o = { head: [tr('een kans', 'a chance'), DIA] };
    const A = page(b, p, 0, 2);
    o.prob = op(A, box(54, tr('85% kans:', 'an 85% chance:'), [tr('klaar vóór 1 maart', 'done before 1 March'), [tr('geen datum, een kans', 'not a date, a chance'), 'pm-mute']], b === 0));
    if (b >= 1) o.honest = op(A * at(b, p, 1), lines(180, [[tr('eerlijker dan', 'more honest than'), 'pm-big'], [tr('één datum; de opdracht-', 'one date; the sponsor'), ''], [tr('gever kiest zelf hoeveel', 'chooses how much'), ''], [tr('zekerheid hij wil', 'certainty he wants'), '']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.tp = op(B, box(54, 'throughput', [tr('items af per week,', 'items finished a week,'), [tr('uit historische data', 'from historical data'), 'pm-mute']], b === 2));
    if (b >= 3) o.calc = op(B * at(b, p, 3), lines(182, [[tr('4 tot 8 per week, 60 open', '4 to 8 a week, 60 open'), 'pm-mute'], [tr('60 / 8 = 7,5 weken', '60 / 8 = 7.5 weeks'), 'pm-big'], [tr('60 / 4 = 15 weken', '60 / 4 = 15 weeks'), 'pm-on']]));
    return o;
  }
  // s3: the simulation; reading off 50 and 85 %; Vacanti and Magennis
  function s3(b, p) {
    const o = { head: ['Monte Carlo', DIA] };
    o.mc = box(54, tr('maakt het preciezer:', 'makes it more precise:'), [tr('trek weken uit de', 'draw weeks from the'), tr('historie: 5, 7, 4, 6 …', 'history: 5, 7, 4, 6 …'), tr('tel op tot 60 af', 'add up to 60 done')], b === 0);
    if (b >= 1) o.read = op(at(b, p, 1), lines(208, [[tr('duizenden einddata:', 'thousands of end dates:'), 'pm-mute'], [tr('50% klaar na … weken', '50% done after … weeks'), 'pm-big'], [tr('85% klaar na … weken', '85% done after … weeks'), 'pm-on']]));
    if (b >= 2) {
      const f = span(p, 0.02, 0.2);
      o.mc = op(1 - f, o.mc);
      o.read = op(1 - f, o.read);
      o.vac = op(f, box(54, tr('Vacanti, Magennis:', 'Vacanti, Magennis:'), [tr('populair in agile teams', 'popular in agile teams'), [tr('werkt alleen als de', 'only works if the way'), 'pm-mute'], [tr('manier van werken', 'of working stays'), 'pm-mute'], [tr('ongeveer gelijk blijft', 'roughly the same'), 'pm-mute']], true));
    }
    return o;
  }
  // s4: NoEstimates; critics; Goodhart; serving the measure; for you; the questions
  function s4(b, p) {
    const o = { head: ['NoEstimates', DIA] };
    const A = page(b, p, 0, 2);
    o.noest = op(A, box(54, tr('beweging, rond 2012', 'a movement, ~2012'), [tr('niet elk item schatten,', 'don’t estimate each item,'), tr('werk klein knippen,', 'cut work small,'), tr('voorspellen met aantal', 'forecast with the count')], b === 0));
    if (b >= 1) o.critic = op(A * at(b, p, 1), lines(210, [[tr('critici: investeren', 'critics: investing'), 'pm-big'], [tr('vraagt om een grootte', 'needs a size'), 'pm-mute']]));
    const B = page(b, p, 2, 4);
    if (b >= 2) o.good = op(B, box(54, tr('wet van Goodhart', 'Goodhart’s law'), [[tr('terugkerend probleem:', 'a recurring problem:'), 'pm-mute'], tr('maat wordt doel → geen', 'measure becomes target'), tr('goede maat meer', '→ no good measure')], b === 2));
    if (b >= 3) o.serve = op(B * at(b, p, 3), lines(204, [[tr('velocity of punten', 'velocity or points'), 'pm-big'], [tr('als doel: men bedient', 'as a target: people'), ''], [tr('de maat, niet het werk', 'serve the measure'), 'pm-on']]));
    const Cc = page(b, p, 4, -1);
    if (b >= 4) o.you = op(Cc, box(54, tr('voor jou', 'for you'), [tr('bandbreedtes uit eigen', 'ranges from the team’s'), [tr('teamdata, geen gevoel', 'own data, not a feeling'), 'pm-mute']], b === 4));
    if (b >= 5) o.askf = op(Cc * at(b, p, 5), lines(182, [[tr('op welke data?', 'what data?'), 'pm-big'], [tr('hoeveel % zekerheid?', 'what % of certainty?'), 'pm-big'], [tr('backlog +20%: en dan?', 'backlog +20%: then?'), 'pm-big'], [tr('wanneer bijwerken?', 'when do we update?'), 'pm-on']]));
    return o;
  }
  // s5: the packaging-film maker: 48 items; ten weeks; the simulation; the sum; the slowest week; the advice; what to add
  function s5(b, p) {
    const o = { head: [tr('livegangdatum', 'go-live date'), EX] };
    const A = page(b, p, 0, 3);
    o.film = op(A, lines(70, [[tr('verpakkingsfolie: oud', 'packaging film: old'), b === 0 ? 'pm-on' : 'pm-big'], [tr('labelsysteem vervangen', 'labelling system out'), 'pm-mute'], [tr('48 items, klein: elk', '48 small items, each'), ''], [tr('een paar dagen werk', 'a few days of work'), '']]));
    if (b >= 1) o.hist = op(A * at(b, p, 1), lines(184, [[tr('10 weken: samen 50,', '10 weeks: total 50,'), b === 1 ? 'pm-on' : 'pm-big'], [tr('gemiddeld 5 per week', 'average 5 a week'), 'pm-mute']]));
    if (b >= 2) o.sim = op(A * at(b, p, 2), lines(250, [[tr('10.000 runs, zie strook', '10,000 runs, see below'), 'pm-on']]));
    const B = page(b, p, 3, 6);
    if (b >= 3) o.sum = op(B, box(54, tr('48 / 5 = 9,6 → ±10 wk', '48 / 5 = 9.6 → ~10 wk'), [[tr('klopt: de meeste runs', 'matches: most runs'), 'pm-mute'], [tr('klaar in week 10', 'done in week 10'), 'pm-mute']], b === 3));
    if (b >= 4) o.slow = op(B * at(b, p, 4), lines(178, [[tr('traagst: 48 / 3 = 16 wk', 'slowest: 48 / 3 = 16 wk'), 'pm-big'], [tr('elke week zo traag:', 'every week that slow:'), 'pm-mute'], [tr('onwaarschijnlijk', 'unlikely'), 'pm-mute']]));
    if (b >= 5) o.advise = op(B * at(b, p, 5), lines(264, [[tr('85% zeker: 11 weken', '85% sure: 11 weeks'), 'pm-on']]));
    if (b >= 6) o.add = op(page(b, p, 6, -1), box(54, tr('zeg erbij', 'add'), [tr('10 weken historie: weinig,', '10 weeks history: little,'), [tr('spreiding wellicht groter', 'spread probably wider'), 'pm-mute'], tr('geldt voor 48 items:', 'holds for 48 items:'), tr('groeit de lijst, schuift', 'list grows, date moves'), tr('de datum; elke week bij,', 'update every week, see'), tr('verschuiving vroeg zien', 'a shift early')], true));
    return o;
  }
  // s6: the SLE; the percentile; more than an average
  function s6(b, p) {
    const o = { head: ['SLE', DIA] };
    o.sle = box(54, 'service level expectation', [[tr('Kanban Guide:', 'Kanban Guide:'), 'pm-mute'], tr('een tijd met een kans,', 'a time with a chance,'), tr('85% binnen 8 dagen', '85% within 8 days')], b === 0);
    if (b >= 1) o.pct = op(at(b, p, 1), lines(198, [[tr('percentiel: de waarde', 'percentile: the value'), b === 1 ? 'pm-on' : 'pm-big'], [tr('waar een deel van de', 'below which a share of'), ''], [tr('metingen onder valt', 'the measurements falls'), '']]));
    if (b >= 2) o.avg = op(at(b, p, 2), lines(276, [[tr('85e > gemiddelde', '85th > the average'), 'pm-on']]));
    return o;
  }
  // s7: work item age; the control chart; the CFD; growing WIP; conservation of flow
  function s7(b, p) {
    const o = { head: [tr('sturen op flow', 'steering on flow'), DIA] };
    const A = page(b, p, 0, 2);
    o.age = op(A, box(54, 'work item age', [[tr('leeftijd: items onderweg', 'age of items under way'), 'pm-mute'], tr('7 van 8 dagen: nu', '7 of 8 days: discuss now,'), tr('bespreken, niet te laat', 'not when it is late')], b === 0));
    if (b >= 1) o.ctrl = op(A * at(b, p, 1), lines(194, [[tr('vroeg signaal, zoals', 'early signal, like a'), 'pm-big'], [tr('een regelkaart: ingrijpen', 'control chart: step in'), ''], [tr('vóór buiten specificatie', 'before out of spec'), '']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.cfd = op(B, box(54, tr('cumulatief', 'cumulative flow'), [[tr('stroomdiagram', 'diagram'), 'pm-big'], [tr('per dag, banden per stap', 'per day, a band a step'), 'pm-mute'], tr('dikker = bottleneck', 'thicker = bottleneck')], b === 2));
    if (b >= 3) o.grow = op(B * at(b, p, 3) * (b === 4 ? 1 - span(p, 0, 0.15) : 1), lines(206, [[tr('in en klaar uit elkaar:', 'in and done apart:'), b === 3 ? 'pm-on' : 'pm-big'], [tr('onderhanden werk groeit', 'work in progress grows'), 'pm-mute']]));
    if (b >= 4) o.cons = op(at(b, p, 4, 0.1, 0.3), lines(206, [[tr('behoud van flow: wat', 'conservation of flow:'), 'pm-on'], [tr('begint, komt ook af; nodig', 'what starts, finishes;'), ''], [tr('voor de wet van Little', 'needed for Little’s law'), '']]));
    return o;
  }
  // s8: utilisation and the queueing factor; Reinertsen; 100 %; for you; the experts
  function s8(b, p) {
    const o = { head: [tr('bezettingsgraad', 'utilisation'), DIA] };
    const A = page(b, p, 0, 3);
    o.util = op(A, box(54, tr('bezettingsgraad', 'utilisation'), [[tr('deel van de tijd bezig', 'share of time busy'), 'pm-mute'], tr('wachttijd ~ b / (1 − b)', 'waiting ~ u / (1 − u)'), tr('80% → 4, 90% → 9', '80% → 4, 90% → 9'), tr('95% → 19', '95% → 19')], b === 0));
    if (b >= 1) o.rein = op(A * at(b, p, 1), lines(222, [[tr('één model; de vorm geldt', 'one model; the shape'), 'pm-mute'], [tr('breed (Reinertsen)', 'holds widely (Reinertsen)'), 'pm-big']]));
    if (b >= 2) o.full = op(A * at(b, p, 2), lines(274, [[tr('100%: geen ruimte', '100%: no room'), 'pm-on']]));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.lean = op(B, box(54, tr('voor jou', 'for you'), [tr('lijkt op buffers en', 'like buffers and'), tr('heijunka: gelijkmatig', 'heijunka: level'), tr('plannen; kenniswerk', 'scheduling; knowledge'), [tr('varieert veel meer', 'work varies far more'), 'pm-mute']], b === 3));
    if (b >= 4) o.exp = op(B * at(b, p, 4), lines(228, [[tr('vraag: onze SLE? hoeveel', 'ask: our SLE? how many'), 'pm-big'], [tr('items boven de helft?', 'items past half of it?'), 'pm-big'], [tr('welke band groeit?', 'which band is growing?'), 'pm-on']]));
    return o;
  }
  // s9: twenty cycle times; the 85th percentile; the 9-day item; the tail
  function s9(b, p) {
    const o = { head: [tr('SLE afspreken', 'agreeing an SLE'), EX] };
    const A = page(b, p, 0, 2);
    o.sort = op(A, lines(70, [[tr('sorteermachines:', 'sorting machines:'), b === 0 ? 'pm-on' : 'pm-big'], [tr('20 cycle times, gemiddeld', '20 cycle times, average'), ''], [tr('160 / 20 = 8 dagen', '160 / 20 = 8 days'), ''], [tr('maar waar kan de klant', 'what can the customer'), 'pm-mute'], [tr('op rekenen?', 'count on?'), 'pm-mute']]));
    if (b >= 1) o.p85 = op(A * at(b, p, 1), lines(212, [[tr('85% van 20 = 17; 17e: 11', '85% of 20 = 17; 17th: 11'), 'pm-big'], [tr('SLE: 85% binnen 11 dagen', 'SLE: 85% in 11 days'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.nine = op(B, box(54, tr('9 dagen in testen', '9 days in testing'), [tr('op de machine: bijna 11', 'on the machine: near 11'), tr('vandaag in het overleg:', 'today, team meeting:'), [tr('wat houdt het op? hulp?', 'what holds it? help?'), 'pm-mute']], b === 2));
    if (b >= 3) o.tail = op(B * at(b, p, 3), lines(192, [[tr('staart: 14, 18, 25 dagen', 'tail: 14, 18, 25 days'), 'pm-big'], [tr('gemeen? bijv. wachten op', 'shared? e.g. waiting for'), ''], [tr('een machine om te testen', 'a machine to test on'), ''], [tr('vaak de echte verbetering', 'often the real gain'), 'pm-on']]));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the strip
  const BASE = 386;
  // a row of labels laid out by their length (about 13 units a lower-case
  // character at 22 units, bold; 16 a capital), centred in the strip, arrows
  // between them, each in a box
  const wOf = (t) => [...t].reduce((a, ch) => a + (/[A-Z%]/.test(ch) ? 16 : /[ ?.,:]/.test(ch) ? 7 : 13), 0);
  const row = (items, hot = -1) => {
    const gap = 46;
    const ws = items.map((t) => wOf(t) + 20);
    let x = 320 - (ws.reduce((a, v) => a + v, 0) + gap * (items.length - 1)) / 2;
    return items.map((t, i) => {
      const w = ws[i];
      let out = '';
      if (i > 0) out += path(`M${f1(x - 32)} 345h18M${f1(x - 19)} 340l5 5l-5 5`, 'pm-line');
      out += rect(x, 326, w, 38, i === hot ? 'pm-barhot' : 'pm-blk', 5) + txt(x + w / 2, 352, t, 'pm-big', 'middle');
      x += w + gap;
      return out;
    }).join('');
  };
  // s1: the cone, 4× above and 0.25× below at the left, 1× at the right
  const CONE = { x0: 112, x1: 580, mid: 345, half: 41 };
  const coneH = (x) => CONE.half * Math.pow(1 - (x - CONE.x0) / (CONE.x1 - CONE.x0), 1.3);
  function coneSvg() {
    const top = [];
    const bot = [];
    for (let i = 0; i <= 24; i++) { const x = lerp(CONE.x0, CONE.x1, i / 24); top.push(`${f1(x)} ${f1(CONE.mid - coneH(x))}`); bot.push(`${f1(x)} ${f1(CONE.mid + coneH(x))}`); }
    return path(`M${top.join('L')}L${bot.reverse().join('L')}Z`, 'pm-band')
      + path(`M${CONE.x0} ${CONE.mid}H${CONE.x1}`, 'pm-line')
      + txt(18, 320, '4×', 'pm-big') + txt(18, 386, tr('0,25×', '0.25×'), 'pm-big') + txt(588, 352, '1×', 'pm-big');
  }
  // the narrowing in steps: only where a working piece is delivered (✓)
  function narrowSvg(t) {
    const drops = [210, 330, 450];
    let top = `M${CONE.x0} ${f1(CONE.mid - CONE.half)}`;
    let bot = `M${CONE.x0} ${f1(CONE.mid + CONE.half)}`;
    let marks = '';
    drops.forEach((x, i) => {
      if (t < (i + 1) / 4) return;
      const h0 = i === 0 ? CONE.half : coneH(drops[i - 1]);
      top += `H${x}V${f1(CONE.mid - coneH(x))}`;
      bot += `H${x}V${f1(CONE.mid + coneH(x))}`;
      marks += txt(x + 4, f1(CONE.mid - h0 + 18), '✓', 'pm-on');
    });
    return path(top, 'pm-curve') + path(bot, 'pm-curve') + marks;
  }
  // s2: the probability over the end date, 85 % before the marker
  function dateSvg() {
    const g = (x) => Math.exp(-0.5 * Math.pow((x - 300) / 80, 2));
    const pts = [];
    for (let x = 60; x <= 560; x += 20) pts.push(`${x} ${f1(BASE - 66 * g(x))}`);
    const m = 383;
    const fill = [];
    for (let x = 60; x <= m; x += 20) fill.push(`${x} ${f1(BASE - 66 * g(x))}`);
    fill.push(`${m} ${f1(BASE - 66 * g(m))}`);
    return path(`M60 ${BASE}L${fill.join('L')}L${m} ${BASE}Z`, 'pm-band') + path(`M${pts.join('L')}`, 'pm-line')
      + path(`M40 ${BASE}H600`, 'pm-line') + path(`M${m} 304V${BASE}`, 'pm-mark')
      + txt(230, 374, '85%', 'pm-big', 'middle') + txt(m + 8, 322, tr('1 maart', '1 March'), 'pm-on');
  }
  // the range: 60 items at 8 or 4 a week, 7.5 to 15 weeks
  const wx = (wk) => 150 + wk * 29;
  function rangeSvg(a) {
    let ticks = '';
    for (let i = 0; i <= 16; i++) ticks += `M${f1(wx(i))} 352v${i % 5 ? 5 : 9}`;
    return txt(16, 352, tr('60 items', '60 items'), 'pm-big') + path(`M${wx(0)} 352H${wx(16)}${ticks}`, 'pm-line')
      + op(a, rect(wx(7.5), 316, wx(15) - wx(7.5), 30, 'pm-barhot', 4) + txt(wx(7.5), 384, tr('7,5', '7.5'), 'pm-big', 'middle')
        + txt(624, 384, tr('15 weken', '15 weeks'), 'pm-big', 'end'));
  }
  // s3: the histogram of end weeks over thousands of runs; the 50 and 85 % lines
  const HB = [1, 3, 7, 12, 14, 11, 7, 4, 2, 1];
  const hx = (i) => 130 + i * 38;
  function histSvg(g) {
    return HB.map((v, i) => rect(hx(i), BASE - 5 * v * g, 32, 5 * v * g, 'pm-bar', 2)).join('') + path(`M110 ${BASE}H520`, 'pm-line')
      + txt(16, 352, 'runs', 'pm-mute');
  }
  // the weeks by which 50 and 85 % of the runs are done (the bins' running share)
  const share = (q) => { const all = HB.reduce((a, v) => a + v, 0); let acc = 0; for (let i = 0; i < HB.length; i++) { acc += HB[i]; if (acc / all >= q) return i; } return HB.length - 1; };
  const qLine = (q, lab) => { const x = hx(share(q)) + 32; return path(`M${x} 300V${BASE}`, 'pm-mark') + txt(x + 6, 320, lab, 'pm-on'); };
  // s5: the ten weeks of throughput, the average; the share of runs done by week 10, 11, 12
  function tpSvg(hot) {
    const out = C.TP.map((v, i) => { const x = 24 + i * 50; const h = 9 * v; return rect(x, BASE - h, 34, h, hot && v === 3 ? 'pm-barhot' : 'pm-bar', 2) + txt(x + 17, BASE - 6, String(v), hot && v === 3 ? 'pm-on' : 'pm-big', 'middle'); });
    return out.join('') + path(`M16 ${BASE}H520`, 'pm-line') + path(`M16 ${BASE - 45}H520`, 'pm-over') + txt(530, BASE - 37, tr('gem. 5', 'avg 5'), 'pm-on');
  }
  const CUM = [[10, 75, '≈75%'], [11, 98, '98%'], [12, 100, '≈100%']];
  function cumSvg(hot, line) {
    const x0 = 132;
    const full = 480;
    const out = CUM.map(([wk, pc, lab], i) => {
      const y = 300 + i * 30;
      return txt(16, y + 21, tr(`≤ ${wk} wk`, `≤ ${wk} wk`), 'pm-big') + rect(x0, y, full * (pc / 100), 25, i === hot ? 'pm-barhot' : 'pm-bar', 3) + txt(x0 + full * (pc / 100) - 8, y + 21, lab, i === hot ? 'pm-on' : 'pm-big', 'end');
    }).join('');
    return out + (line ? path(`M${f1(x0 + full * 0.85)} 298V356`, 'pm-mark') : '');
  }
  // s6 and s9: the twenty cycle times from short to long
  const bx = (i) => 54 + i * 27.5;
  const bh = (v) => v * 2.7;
  const BB = 366;
  function barsSvg(labels, hot) {
    return C.CT.map((v, i) => rect(bx(i), BB - bh(v), 20, bh(v), hot(i) ? 'pm-barhot' : 'pm-bar', 2)
      + (labels ? txt(bx(i) + 10, 391, String(v), hot(i) ? 'pm-on' : 'pm-mute', 'middle') : '')).join('') + path(`M44 ${BB}H608`, 'pm-line');
  }
  const p85x = bx(16) + 24;
  const p85 = (lab) => path(`M${f1(p85x)} 298V${BB}`, 'pm-mark') + txt(p85x - 6, 320, lab, 'pm-on', 'end');
  // s7: the ages of the items under way against the 8 days of the SLE
  const AGES = [2, 5, 3, 7, 1, 4];
  function ageSvg(hotAge) {
    const lim = BASE - 8 * 9;
    return AGES.map((v, i) => { const x = 150 + i * 62; const hot = v === 7 && hotAge; return rect(x, BASE - 9 * v, 36, 9 * v, hot ? 'pm-barhot' : 'pm-bar', 2) + (hot ? txt(x + 18, BASE - 9 * v - 6, '7', 'pm-on', 'middle') : ''); }).join('')
      + path(`M140 ${BASE}H530`, 'pm-line') + path(`M140 ${lim}H530`, 'pm-over') + txt(16, lim + 8, tr('SLE: 8 d', 'SLE: 8 d'), 'pm-on') + txt(16, BASE - 6, tr('leeftijd', 'age'), 'pm-mute');
  }
  // the cumulative flow diagram: arrived, started and done per day, the middle band growing
  const DAYS = 12;
  const cx = (d) => 140 + d * 38;
  const cy = (n) => BASE - n * 2.2;
  const ARR = (d, k) => 4 + d * 3;
  const STA = (d, k) => 2 + d * 2.8;
  const DON = (d, k) => (k ? d * 2.75 : d * (2.4 - d * 0.1));
  function cfdSvg(k, edge) {
    const line = (f) => Array.from({ length: DAYS }, (_, d) => `${f1(cx(d))} ${f1(cy(f(d, k)))}`);
    const band = (f, g, cls) => path(`M${line(f).join('L')}L${line(g).reverse().join('L')}Z`, cls);
    return band(ARR, STA, 'pm-band3') + band(STA, DON, 'pm-band') + path(`M${line(DON).join('L')}L${f1(cx(DAYS - 1))} ${BASE}L${cx(0)} ${BASE}Z`, 'pm-band2')
      + (edge ? path(`M${line(ARR).join('L')}`, 'pm-curve') + path(`M${line(DON).join('L')}`, 'pm-curve') : '')
      + txt(16, 322, tr('in', 'in'), 'pm-mute') + txt(16, BASE - 6, tr('klaar', 'done'), 'pm-mute');
  }
  // s8: waiting against utilisation, u / (1 − u), with 80, 90 and 95 %
  const ux = (u) => 70 + ((u - 0.5) / 0.5) * 520;
  const uy = (f) => 364 - f * 2.8;
  function curveSvg() {
    const pts = [];
    for (let u = 0.5; u <= 0.955; u += 0.015) pts.push(`${f1(ux(u))} ${f1(uy(u / (1 - u)))}`);
    const dot = (u, f, lab, dx) => `<circle class="pm-dot" cx="${f1(ux(u))}" cy="${f1(uy(f))}" r="5"/>` + txt(ux(u) + dx, uy(f) + 8, lab, 'pm-on', dx < 0 ? 'end' : 'start');
    return path(`M${ux(0.5)} 364H${ux(1)}`, 'pm-line') + path(`M${pts.join('L')}`, 'pm-curve')
      + dot(0.8, 4, '4', -10) + dot(0.9, 9, '9', -10) + dot(0.95, 19, '19', -10)
      + txt(ux(0.8), 390, '80%', 'pm-big', 'middle') + txt(ux(0.9), 390, '90%', 'pm-big', 'middle') + txt(ux(0.95) + 8, 390, '95%', 'pm-big', 'start')
      + txt(16, 322, tr('wacht', 'wait'), 'pm-mute');
  }
  function strip(si, b, p) {
    const L = {};
    if (si === 0) {
      L.sCone = op(b === 0 ? span(p, 0.05, 0.4) : 1, coneSvg());
      if (b >= 2) L.sNarrow = narrowSvg(b === 2 ? span(p, 0.1, 0.9) : 1);
    }
    if (si === 1) {
      if (b < 2) L.sDate = op(b === 0 ? span(p, 0.05, 0.4) : 1, dateSvg());
      else L.sRange = op(b === 2 ? span(p, 0, 0.2) : 1, rangeSvg(at(b, p, 3, 0.1, 0.4)));
    }
    if (si === 2) {
      L.sHist = histSvg(b === 0 ? span(p, 0.1, 0.9) : 1);
      if (b >= 1) { L.sP50 = op(at(b, p, 1, 0.1, 0.3), qLine(0.5, '50%')); L.sP85 = op(at(b, p, 1, 0.4, 0.6), qLine(0.85, '85%')); }
    }
    if (si === 3) {
      if (b < 2) L.sRow = op(b === 0 ? span(p, 0.05, 0.3) : 1, row([tr('klein knippen', 'cut small'), tr('tellen', 'count'), tr('voorspellen', 'forecast')], b === 0 ? 1 : -1));
      else if (b < 4) L.sGood = op(b === 2 ? span(p, 0, 0.2) : 1, row([tr('maat', 'measure'), tr('doel', 'target'), tr('geen goede maat', 'no good measure')], b === 3 ? 2 : 1));
      else L.sAsk = op(b === 4 ? span(p, 0, 0.2) : 1, row([tr('data?', 'data?'), tr('zeker?', 'certain?'), '+20%?', tr('bijwerken?', 'update?')], b === 5 ? 2 : -1));
    }
    if (si === 4) {
      if (b < 2 || b === 4) L.sTp = op(b === 0 ? span(p, 0.1, 0.4) : 1, tpSvg(b === 4));
      else L.sCum = op(b === 2 ? span(p, 0, 0.25) : 1, cumSvg(b === 5 || b === 6 ? 1 : b === 3 ? 0 : -1, b >= 5));
    }
    if (si === 5) {
      L.sSort = op(b === 0 ? span(p, 0.1, 0.5) : 1, barsSvg(false, (i) => b >= 1 && i <= 16));
      if (b >= 1) L.sPct = op(at(b, p, 1, 0.3, 0.6), p85('85%') + (b >= 2 ? path(`M44 ${f1(BB - bh(8))}H608`, 'pm-over') + txt(48, f1(BB - bh(8) - 6), tr('gem.', 'avg'), 'pm-mute') : ''));
    }
    if (si === 6) {
      if (b < 2) L.sAge = op(b === 0 ? span(p, 0.05, 0.3) : 1, ageSvg(true));
      else if (b < 4) L.sCfd = op(b === 2 ? span(p, 0, 0.25) : 1, cfdSvg(false, false));
      if (b === 3) L.sGrow = op(span(p, 0.1, 0.4), cfdSvg(false, true));
      if (b === 4) L.sCons = op(span(p, 0, 0.3), cfdSvg(true, true));
    }
    if (si === 7) {
      if (b < 3) L.sCurve = op(b === 0 ? span(p, 0.05, 0.4) : 1, curveSvg());
      else if (b === 3) L.sLean = op(span(p, 0, 0.25), row([tr('buffers', 'buffers'), 'heijunka']));
      else L.sLean = op(span(p, 0, 0.25), row([tr('plan < 100%', 'plan < 100%'), tr('kleiner werk', 'smaller work')]));
    }
    if (si === 8) {
      L.sBars = barsSvg(true, (i) => (b === 1 && i === 16) || (b === 3 && i >= 17));
      if (b >= 1 && b < 3) L.sP17 = op(at(b, p, 1, 0.3, 0.6), p85(tr('85%: 11', '85%: 11')));
      if (b === 2) L.sNine = op(span(p, 0.1, 0.4), path(`M44 ${f1(BB - bh(11))}H608`, 'pm-over') + path(`M44 ${f1(BB - bh(9))}H${f1(bx(14) + 20)}`, 'pm-mark') + txt(48, f1(BB - bh(11) - 6), tr('SLE 11 · nu 9', 'SLE 11 · now 9'), 'pm-on'));
    }
    return L;
  }

  // ---------------------------------------------------------------- the board's notes and the weeks
  const N = C.NOTES;
  const note = (c, r, cls) => { const u = N.u0 + c * N.du; const v = N.v0 + r * N.dv; return `<rect class="${cls}" x="${f1(u)}" y="${f1(v)}" width="${N.w}" height="${N.h}" rx=".6"/>`; };
  const col = (c, n, cls) => { let s = ''; for (let r = 0; r < n; r++) s += note(c, r, typeof cls === 'function' ? cls(r) : cls); return s; };
  function notes(si, b, p) {
    if (si === 0) return col(0, 8, 'pm-note');
    if (si <= 3) return col(0, 6, 'pm-note') + col(1, 2, 'pm-note') + col(2, 1, 'pm-note') + col(3, 3, 'pm-note');
    if (si === 4) return col(0, 8, 'pm-note') + col(3, 6, 'pm-note');
    // flow: to do, under way, test, done; one item ages in test (s7, s9)
    const ageing = (si === 6 && b <= 1) || (si === 8 && b === 2);
    return col(0, 3, 'pm-note') + col(1, 3, 'pm-note') + col(2, 2, (r) => (r === 0 && ageing ? (si === 8 ? 'pm-hotnote' : 'pm-old') : 'pm-note')) + col(3, 4, 'pm-note');
  }
  function weeks(si, b) {
    const cell = (i, cls) => { const [a, bb, c, d] = C.CELLS[i]; return `<rect class="${cls}" x="${f1(a)}" y="${f1(bb)}" width="${f1(c - a)}" height="${f1(d - bb)}"/>`; };
    let s = '';
    if (si === 1 && b >= 2) for (let i = 0; i < 8; i++) s += cell(i, 'pm-wk');
    if (si === 4 && b >= 1) {
      for (let i = 0; i < 10; i++) s += cell(i, 'pm-wk');
      if (b >= 5) s += cell(10, 'pm-wkhot');
    }
    return s;
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
    set(E.cMarks, weeks(si, b));
  }

  return { render };
})();
