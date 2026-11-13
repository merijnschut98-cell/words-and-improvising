// The stage of the film "Conflict: belangen en het lastige gesprek / Conflict:
// interests and the difficult conversation": a pure function of (scene, u).
// Inlined into the page after the anatomy kit and a preamble from build.mjs
// that defines C (the panel's blocks, the calendar cells, the hours), CAM (one
// camera move per scene), W and H. Moves are placed per Dutch caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. The panel at the right gets one card per scene, each block in
// its own cue group (o[key] goes into data-k "p_<key>"), all text at 22 units
// (a video film); a card that needs more room turns a page within its scene.
// Positions and interests are an iceberg: the position above a dashed
// waterline, the interest below it. The board in the room repeats the card in
// miniature, the calendar strip lights the four trial weeks (s5), and the
// sheet on the table fills with the option (s5) and the first sentence (s6).
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
  const tick = (x, y) => path(`M${f1(x - 8)} ${f1(y)}l6 6l12 -13`, 'pm-line');
  const cross = (x, y) => path(`M${f1(x - 8)} ${f1(y - 8)}l16 16M${f1(x + 8)} ${f1(y - 8)}l-16 16`, 'pm-strike');
  // a numbered step: a ring with the digit, a bold name and one more line
  const step = (y, n, name, more, hot) => `<circle class="pm-ring" cx="${X0 + 12}" cy="${f1(y - 7)}" r="14"/>` + txt(X0 + 12, y + 1, String(n), 'pm-big', 'middle')
    + txt(X0 + 36, y, name, hot ? 'pm-on' : 'pm-big') + (more ? txt(X0 + 36, y + 26, more, 'pm-txt') : '');
  // the iceberg's waterline, with a small label at the right
  const water = (y, label) => path(`M${X0 - 6} ${f1(y)}H${X1 + 6}`, 'pm-water') + (label ? txt(X1, y - 8, label, 'pm-mute', 'end') : '');
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
  // s1: the book; the iceberg (position above, interest below); then the clash
  // of positions, the option the interests allow, and the two questions
  function s1(b, p) {
    const o = { head: [tr('belangen', 'interests'), DIA] };
    const A = page(b, p, 0, 3);
    o.book = op(A, lines(80, [['Getting to Yes', 'pm-big'], [tr('Fisher en Ury, 1981', 'Fisher and Ury, 1981'), 'pm-mute']]));
    if (b >= 1) o.pos = op(A * at(b, p, 1), box(124, tr('standpunt: wat', 'position: what'), [tr('“geen stops door', '“no stops during'), [tr('de week”', 'the week”'), 'pm-on']], b === 1));
    if (b >= 2) {
      o.int = op(A * at(b, p, 2), water(246, tr('waarom?', 'why?'))
        + box(260, tr('belang: waarom', 'interest: why'), [tr('“levering aan grootste', '“the delivery to our'), [tr('klant niet missen”', 'biggest customer”'), 'pm-on']], b === 2));
    }
    const B = page(b, p, 3, -1);
    if (b >= 3) {
      const half = (CW - 28) / 2;
      o.clash = op(B, txt(X0, 80, tr('standpunten botsen', 'positions clash'), 'pm-big')
        + rect(X0 - 6, 96, half + 6, 52, 'pm-card') + txt(X0 + 4, 130, tr('geen stops', 'no stops'))
        + rect(X1 + 6 - half - 6, 96, half + 6, 52, 'pm-card') + txt(X1 - half + 4, 130, tr('4 uur stop', '4 h stop'))
        + cross(X0 + CW / 2, 122));
      o.opt = op(B * at(b, p, 3, 0.35, 0.6), water(176, '') + txt(X0, 206, tr('belangen vaak niet:', 'interests often don’t:'), 'pm-mute')
        + box(218, tr('4 uur op maandag-', '4 hours on Monday'), [tr('ochtend, order al weg', 'morning, order shipped')], true) + tick(X1 - 14, 248));
    }
    if (b >= 4) o.ask = op(at(b, p, 4), lines(326, [[tr('vraag: “waarvoor nodig?”', '“what do you need it for?”'), 'pm-on'], [tr('“waar zorg je je om?”', '“what worries you?”'), 'pm-on']]));
    return o;
  }

  // s2: mediating: apart first, no side; then together, options, criteria
  function s2(b, p) {
    const o = { head: [tr('bemiddelen', 'mediating'), b === 2 ? EX : DIA] };
    const A = page(b, p, 0, 2);
    // two small boxes with a gap: you talk to each side alone
    o.apart = op(A, txt(X0, 80, tr('1. eerst apart', '1. separately first'), 'pm-big')
      + card(96, 46) + txt(X0 + 4, 126, tr('productie, alleen', 'production, alone'))
      + card(150, 46) + txt(X0 + 4, 180, tr('onderhoud, alleen', 'maintenance, alone'))
      + txt(X0, 224, tr('luister naar beide', 'listen to both sides'), 'pm-mute'));
    if (b >= 1) o.side = op(A * at(b, p, 1), box(244, tr('kies geen kant', 'don’t take sides'), [tr('ook niet als een van', 'not even when one'), tr('de twee gelijk heeft', 'of them is right')], true));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.both = op(B, box(54, tr('2. samen', '2. together'), [[tr('“allebei: lijn draait', '“you both want the'), 'pm-on'], [tr('betrouwbaar; verschil:', 'line reliable; you differ'), 'pm-on'], [tr('wanneer stilzetten”', 'on when to stop it”'), 'pm-on']], b === 2, 'pm-dash'));
    if (b >= 3) o.opts = op(B * at(b, p, 3), txt(X0, 200, tr('3. opties voor beide', '3. options for both'), 'pm-big'));
    if (b >= 4) {
      o.crit = op(B * at(b, p, 4), box(218, tr('objectieve criteria', 'objective criteria'), [tr('vooraf aanvaard:', 'agreed beforehand:'), tr('stilstanduren, gemiste', 'downtime hours, missed'), tr('leveringen', 'deliveries')], true)
        + op(at(b, p, 4, 0.45, 0.7), txt(X0, 370, tr('niet: wie het hardst roept', 'not: who shouts loudest'), 'pm-mute')));
    }
    return o;
  }

  // s3: the BATNA of each side; their alternatives; then splitting the
  // difference (a four-hour bar halved) and values or status
  function s3(b, p) {
    const o = { head: ['BATNA', DIA] };
    const A = page(b, p, 0, 3);
    o.batna = op(A, box(54, tr('BATNA van elke kant', 'each side’s BATNA'), [['best alternative to a', 'pm-mute'], ['negotiated agreement', 'pm-mute'], [tr('geen afspraak: wat dan?', 'no deal: then what?')]], b === 0));
    if (b >= 1) o.alt = op(A * at(b, p, 1), lines(200, [[tr('zonder gezamenlijke stop:', 'without a shared stop:'), 'pm-mute'], [tr('onderhoud: storing', 'maintenance: breakdown')], [tr('productie: levering mis', 'production: no delivery')]]));
    if (b >= 2) o.deal = op(A * at(b, p, 2), card(290, 72, 'pm-hot') + lines(320, [[tr('afspraak wordt', 'a deal becomes'), 'pm-on'], [tr('aantrekkelijker', 'more attractive'), 'pm-on']], X0 + 4));
    const B = page(b, p, 3, -1);
    if (b >= 3) {
      const full = CW - 40;
      const k = at(b, p, 3, 0.3, 0.7);
      o.split = op(B, lines(80, [[tr('wat misgaat:', 'what goes wrong:'), 'pm-mute'], [tr('het verschil delen', 'splitting the difference'), 'pm-big']])
        + rect(X0, 132, full - 40, 22, 'pm-blk2', 3) + txt(X0 + full - 32, 151, tr('4 uur', '4 h'))
        + rect(X0, 166, (full - 40) * (1 - 0.5 * k), 22, 'pm-blk', 3) + txt(X0 + (full - 40) * (1 - 0.5 * k) + 8, 185, k > 0.5 ? tr('2 uur', '2 h') : tr('4 uur', '4 h'))
        + op(at(b, p, 3, 0.6, 0.85), lines(222, [[tr('2 uur in plaats van 4:', '2 hours instead of 4:')], [tr('niemand blij', 'satisfies nobody'), 'pm-on']])));
    }
    if (b >= 4) o.values = op(B * at(b, p, 4), box(270, tr('waarden of status?', 'values or status?'), [tr('escaleer naar wie', 'escalate to someone'), tr('kan beslissen', 'who can decide')], true));
    return o;
  }

  // s4: the dairy plant: the clash, two positions above the waterline; then
  // talking to each alone, two interests below it
  function s4(b, p) {
    const o = { head: [tr('zuivelfabriek', 'dairy plant'), EX] };
    const A = page(b, p, 0, 5);
    o.dairy = op(A, lines(80, [[tr('jij: junior consultant', 'you: junior consultant'), 'pm-big'], [tr('weekoverleg, lijn 1', 'weekly meeting, line 1'), 'pm-mute']]));
    if (b >= 1) o.meet = op(A * at(b, p, 1), txt(X0, 138, tr('productie ↔ onderhoud', 'production↔maintenance'), 'pm-txt'));
    if (b >= 2) o.ppos = op(A * at(b, p, 2), box(152, tr('productie:', 'production:'), [[tr('“geen stops meer,', '“no more stops,'), 'pm-on'], [tr('we lopen achter”', 'we’re behind”'), 'pm-on']], b === 2));
    if (b >= 3) o.mpos = op(A * at(b, p, 3), box(256, tr('onderhoud:', 'maintenance:'), [[tr('“dan gaat hij stuk,', '“then it will break,'), 'pm-on'], [tr('dat is erger”', 'that’s worse”'), 'pm-on']], b === 3));
    if (b >= 4) o.stop = op(A * at(b, p, 4), txt(X0, 382, tr('stop: ieder apart', 'stop: each alone'), 'pm-on'));
    const B = page(b, p, 5, -1);
    if (b >= 5) {
      o.pint = op(B, water(66, '')
        + box(80, tr('belang productie', 'interest: production'), [tr('elke donderdag grote', 'a big retail order'), tr('order naar retailer', 'ships every Thursday'), [tr('(supermarktketen)', ''), 'pm-mute']], b === 5));
    }
    if (b >= 6) o.mint = op(B * at(b, p, 6), box(228, tr('belang onderhoud', 'interest: maintenance'), [tr('3 uur per week:', '3 hours a week:'), tr('versleten afdichtingen', 'replace worn seals'), tr('vervangen vóór falen', 'before they fail')], b === 6));
    return o;
  }

  // s5: the shared interest and the two fears; then the option, the trial and
  // the criteria
  function s5(b, p) {
    const o = { head: [tr('de optie', 'the option'), EX] };
    const A = page(b, p, 0, 2);
    o.shared = op(A, box(54, tr('gedeeld belang', 'shared interest'), [[tr('“allebei: lijn 1', '“you both want line 1'), 'pm-on'], [tr('donderdag betrouwbaar”', 'reliable for Thursday”'), 'pm-on']], b === 0));
    if (b >= 1) {
      o.fears = op(A * at(b, p, 1), lines(190, [[tr('productie vreest:', 'production fears:'), 'pm-mute'], [tr('gemiste levering', 'missing the shipment')], [tr('onderhoud vreest:', 'maintenance fears:'), 'pm-mute'], [tr('storing, dus ook gemist', 'a breakdown: missed too')]]));
    }
    const B = page(b, p, 2, -1);
    if (b >= 2) o.option = op(B, box(54, tr('optie: vrijdagochtend', 'option: Friday morning'), [tr('3 uur stop, de dag na', '3-hour stop, the day'), tr('de donderdaglevering', 'after Thursday’s shipment')], b === 2));
    if (b >= 3) o.trial = op(B * at(b, p, 3), box(170, tr('4 weken proberen', 'try it 4 weeks'), [tr('dan kijken naar:', 'then look at:'), tr('stilstanduren, gemiste', 'downtime hours, missed'), tr('leveringen', 'deliveries')], b === 3));
    if (b >= 4) o.loud = op(at(b, p, 4), txt(X0, 326, tr('niet: wie het hardst riep', 'not: who argued loudest'), 'pm-big'));
    return o;
  }

  // s6: the difficult conversation as four numbered steps
  function s6(b, p) {
    const o = { head: [tr('lastig gesprek', 'difficult talk'), b >= 1 && b <= 3 ? EX : DIA] };
    o.four = lines(80, [[tr('liever uit de weg?', 'rather avoid it?'), 'pm-mute'], [tr('4 stappen', '4 steps'), b === 0 ? 'pm-on' : 'pm-big']]);
    if (b >= 1) o.saw = op(at(b, p, 1), step(160, 1, tr('wat ik zag', 'what I saw'), tr('“data 2× niet klaar”', '“data late twice”'), b === 1));
    if (b >= 2) o.effect = op(at(b, p, 2), step(222, 2, tr('het effect', 'the impact'), tr('“overleg op gevoel”', '“meeting guesses”'), b === 2));
    if (b >= 3) o.view = op(at(b, p, 3), step(284, 3, tr('hun kijk', 'their view'), tr('“hoe zie jij het?”', '“how do you see it?”'), b === 3));
    if (b >= 4) {
      o.next = op(at(b, p, 4), step(346, 4, tr('volgende stap, samen', 'next step, together'), '', true));
      o.first = op(at(b, p, 4, 0.45, 0.7), txt(X0 + 36, 374, tr('eerste zin klaar', 'first sentence ready'), 'pm-mute'));
    }
    return o;
  }

  // s7: with the client: no defence in the room, the reply, the same steps;
  // then separate the people and ask a senior colleague
  function s7(b, p) {
    const o = { head: [tr('met de klant', 'with the client'), b === 1 ? EX : DIA] };
    const A = page(b, p, 0, 3);
    o.blame = op(A, box(54, tr('klant geeft project', 'client blames the'), [tr('de schuld', 'project')], b === 0)
      + op(at(b, p, 0, 0.4, 0.65), lines(160, [[tr('verdedig je niet', 'don’t defend yourself'), 'pm-big'], [tr('in de zaal', 'in the room'), 'pm-mute']])));
    if (b >= 1) o.reply = op(A * at(b, p, 1), box(200, tr('“Ik hoor dat je niet', '“I hear you’re unhappy.'), [[tr('tevreden bent. Morgen', 'Twenty minutes'), 'pm-on'], [tr('twintig minuten?”', 'tomorrow?”'), 'pm-on']], false, 'pm-dash'));
    if (b >= 2) o.same = op(A * at(b, p, 2), txt(X0, 336, tr('dan: dezelfde 4 stappen', 'then: the same 4 steps'), 'pm-big')
      + [1, 2, 3, 4].map((n, i) => `<circle class="pm-ring" cx="${X0 + 12 + i * 40}" cy="362" r="12"/>` + txt(X0 + 12 + i * 40, 370, String(n), 'pm-txt', 'middle')).join(''));
    const B = page(b, p, 3, -1);
    if (b >= 3) o.sep = op(B, box(54, tr('weet je het niet?', 'don’t know what to do?'), [tr('haal ze uit elkaar,', 'separate the people,'), tr('praat met ieder apart', 'talk to each alone')], b === 3));
    if (b >= 4) o.senior = op(B * at(b, p, 4), box(186, tr('vraag een senior', 'ask a senior'), [tr('collega, dan pas', 'colleague, then'), tr('iets doen', 'act')], true));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7];

  // ---------------------------------------------------------------- the calendar strip
  // the four trial weeks light in s5 from beat 3, one by one
  function calendar(si, b, p) {
    if (si !== 4 || b < 3) return '';
    let s = '';
    for (let i = 0; i < C.HRS.trial; i++) {
      const a = b > 3 ? 1 : span(p, 0.1 + i * 0.12, 0.2 + i * 0.12);
      const [x0, y0, x1, y1] = C.CELLS[i];
      s += op(a, rect(x0, y0, x1 - x0, y1 - y0, 'pm-blk', 1));
    }
    return s;
  }

  // ---------------------------------------------------------------- the sheet on the table
  // the option (s5, from beat 2) and the prepared first sentence (s6, beat 4)
  function sheet(si, b, p) {
    let n = 0;
    if (si === 4) n = b < 2 ? 0 : b === 2 ? 3 * span(p, 0.1, 0.8) : 3 + (b >= 3 ? span(b === 3 ? p : 1, 0.1, 0.8) : 0);
    else if (si === 5) n = b < 4 ? 0 : 2 * span(p, 0.4, 0.9);
    let s = '';
    for (let i = 0; i < 5; i++) {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += `<path class="pm-line" d="M2.5 ${f1(4 + i * 3.2)}H${f1(2.5 + 15 * a)}"/>`;
    }
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    let mini = '';
    for (const c of C.CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.cMarks, calendar(si, b, p));
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
