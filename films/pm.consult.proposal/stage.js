// The stage of the film "Van telefoontje tot offerte / From phone call to
// proposal": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the examples'
// numbers and the panel's blocks), CAM (one camera move per scene), W and H.
// Moves are placed per Dutch caption beat (beatStarts on the Dutch captions;
// films/_kit/beatwarp.js sets STAGE.nlBeats), so the video's narration timing
// keeps them in step. The panel at the right gets one card per scene, each
// block in its own cue group; the board in the room repeats it in miniature,
// and the proposal's first page on the table fills in as the film builds it.
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
  const X0 = 334;
  const X1 = 618;
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, X1 - X0 + 12, h, cls, 8);
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0, dy = 26) => list.map(([t, cls], i) => (t ? txt(x, y + i * dy, t, cls || 'pm-txt') : '')).join('');
  const tick = (x, y) => `<path class="pm-line" d="M${f1(x)} ${f1(y)}l5 5l10 -12"/>`;
  // a block fades in over the start of its beat and stays; only: shown in beat n alone
  const inAt = (b, p, n, a0 = 0.05, a1 = 0.3) => (b > n ? 1 : b === n ? span(p, a0, a1) : 0);
  const only = (b, p, n, a0 = 0.05, a1 = 0.3) => (b === n ? span(p, a0, a1) : 0);
  // money as the lesson writes it per language: € 14.400 / €14,400
  const eur = (v) => (NL ? `€ ${v.toLocaleString('nl-NL')}` : `€${v.toLocaleString('en-GB')}`);
  const eurk = (v) => (NL ? `€ ${v}k` : `€${v}k`);

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
  // a horizontal bar of `days` on a scale where `full` days fill the card
  const dayW = (days, full) => (days / full) * (X1 - X0);

  // ---------------------------------------------------------------- the cards
  // Each fills o[slot] and sets o.head = [title, 'dia' | 'ex'].
  const S = [];
  S[0] = (b, p, o) => { // page one
    o.head = [tr('pagina één', 'page one'), 'dia'];
    o.page1 = card(54, 66) + txt(X0, 80, tr('een offerte', 'a proposal'), 'pm-mute') + txt(X0, 106, tr('wint op pagina één', 'wins on page one'), 'pm-big');
    if (b >= 1) o.problem = op(inAt(b, p, 1), card(134, 118, 'pm-hot') + lines(162, [[tr('hun probleem, hun getallen', 'their problem, their numbers'), 'pm-mute'], [tr('14% van de klussen afgezegd', '14% of jobs cancelled')], [tr('afzegging = een ploegdag', 'cancellation = a crew day')], [tr('doel: 8% in Q4', 'target: 8% by Q4'), 'pm-on']]));
    if (b >= 2) o.yes = op(inAt(b, p, 2), lines(282, [[tr('sponsor: betaalt, eigenaar', 'sponsor: pays, owns it'), 'pm-mute'], [tr('“Ja, precies dat.”', '“Yes, that’s exactly it.”'), 'pm-big']]));
    if (b >= 3) o.method = op(inAt(b, p, 3), txt(X0, 358, tr('je aanpak: later', 'your method: later'), 'pm-on'));
  };
  S[1] = (b, p, o) => { // outcome and diagnostic
    o.head = [tr('diagnose eerst', 'diagnostic first'), 'dia'];
    o.outcome = card(54, 92) + lines(82, [[tr('uitkomst', 'outcome'), 'pm-big'], [tr('maatstaf, doel, eigenaar', 'measure, target, owner')]]);
    o.base = txt(X0, 134, tr('nulmeting: vóór de start', 'baseline: before you start'), 'pm-on');
    const y = 178;
    if (b >= 1) {
      o.diag = op(inAt(b, p, 1), rect(X0, y, 112, 40, 'pm-hot', 6) + txt(X0 + 56, y + 27, tr('diagnose', 'diagnostic'), 'pm-on', 'middle'))
        + op(inAt(b, p, 1, 0.4, 0.65), lines(y + 72, [[tr('3 weken', '3 weeks')], [tr('12 dagen', '12 days')], [eur(C.DIAG.fee), 'pm-big']]));
    }
    if (b >= 2) {
      const cx = X0 + 142;
      const cy = y + 20;
      o.gonogo = op(inAt(b, p, 2), path(`M${cx - 22} ${cy}L${cx} ${cy - 22}L${cx + 22} ${cy}L${cx} ${cy + 22}Z`, 'pm-card')
        + txt(cx, cy - 32, 'go/no-go', 'pm-on', 'middle')
        + lines(y + 72, [[tr('doorgaan', 'continue')], [tr('bijsturen', 'change')], [tr('stoppen', 'stop')]], X0 + 130));
    }
    if (b >= 3) {
      o.later = op(inAt(b, p, 3), rect(X0 + 176, y, X1 - X0 - 176, 40, 'pm-dash', 6) + txt(X0 + 176 + (X1 - X0 - 176) / 2, y + 27, tr('de rest', 'the rest'), 'pm-mute', 'middle')
        + lines(338, [[tr('rest: prijs na de data', 'rest: priced after data'), 'pm-on'], [tr('minder risico voor beiden', 'less risk for both sides'), 'pm-mute']]));
    }
  };
  S[2] = (b, p, o) => { // commitments and options
    o.head = [tr('inzet en opties', 'asks and options'), 'dia'];
    o.commit = card(54, 146) + lines(82, [[tr('inzet van de klant', 'client commitments'), 'pm-big'], [tr('sponsor: 1 uur per 2 weken', 'sponsor: 1 hour per 2 weeks')], [tr('aanspreekpunt: 1 dag/week', 'counterpart: 1 day a week')]])
      + op(inAt(b, p, 1), lines(160, [[tr('planningsdata: week 1', 'planning data: week 1')], [tr('2 sessies, teamleiders', '2 sessions, team leads')]]));
    if (b === 2) o.slip = op(span(p, 0.05, 0.3), lines(230, [[tr('geen kleine lettertjes', 'not small print'), 'pm-on'], [tr('uitloop begint vaak', 'slips often start'), 'pm-mute'], [tr('aan de klantkant', 'on the client side'), 'pm-mute'], [tr('benoemd: gedeelde afspraak,', 'named: a shared commitment,')], [tr('geen excuus achteraf', 'not a later excuse'), 'pm-mute']]));
    if (b >= 3) {
      const list = [tr('A: alleen de diagnose', 'A: diagnostic only'), tr('B: + pilot in 1 regio', 'B: + pilot in 1 region'), tr('C: hele programma', 'C: full programme')];
      o.opts = list.map((t, i) => op(inAt(b, p, 3, 0.1 + i * 0.12, 0.25 + i * 0.12), rect(X0 - 6, 212 + i * 36, X1 - X0 + 12, 30, 'pm-chip', 6) + txt(X0 + 4, 233 + i * 36, t))).join('');
    }
    if (b === 4) o.choice = op(span(p, 0.05, 0.3), lines(342, [[tr('1 optie: ja of nee', '1 option: yes or no'), 'pm-mute'], [tr('opties: kiezen tussen ja’s', 'options: a choice of yeses'), 'pm-on']]));
    if (b >= 5) o.call = op(span(p, 0.05, 0.3), lines(338, [[tr('5 of 6 pagina’s', '5 or 6 pages'), 'pm-big'], [tr('eerst bellen: de opzet', 'call first: the outline'), 'pm-on'], [tr('stuk bevestigt het gesprek', 'the paper confirms a talk'), 'pm-mute']], X0, 22));
  };
  S[3] = (b, p, o) => { // what you see in practice
    o.head = [tr('in de praktijk', 'in practice'), 'dia'];
    o.about = card(54, 92) + lines(82, [[tr('vaak gezien', 'often seen'), 'pm-mute'], [tr('vooral over het bureau,', 'mostly about the firm,')], [tr('nauwelijks over de klant', 'hardly about the client')]]);
    if (b >= 1) o.buyer = op(inAt(b, p, 1), lines(176, [[tr('inkoop: alleen dagtarief', 'purchasing: day rate only')], [tr('vraag vroeg: hoe valt', 'ask early: how is it'), 'pm-on'], [tr('de keuze, en door wie?', 'chosen, and by whom?'), 'pm-on']]));
    if (b === 2) o.range = op(span(p, 0.05, 0.3), lines(272, [[tr('latere fases? adviseurs', 'later phases? consultants'), 'pm-mute'], [tr('verschillen van mening', 'disagree'), 'pm-mute'], [tr('bandbreedte: vertrouwen', 'a range: trust')], [tr('één getal: blijft hangen', 'one number: it sticks')]]));
    if (b >= 3) o.six = op(span(p, 0.05, 0.3), card(256, 120, 'pm-hot') + lines(284, [[tr('Als dit lukt, wat is er', 'If this succeeds, what'), 'pm-on'], [tr('over zes maanden anders,', 'is different in six months,'), 'pm-on'], [tr('en waar zien we dat aan?', 'and how will we see it?'), 'pm-on'], [tr('vraag het voor je schrijft', 'ask before you write'), 'pm-mute']]));
  };
  S[4] = (b, p, o) => { // two thermoforming lines
    if (b <= 3) {
      o.head = [tr('thermovormen', 'thermoforming'), 'ex'];
      o.call5 = lines(76, [[tr('belt: operationeel directeur', 'calling: operations director'), 'pm-mute'], [tr('verpakkingsfabrikant', 'packaging manufacturer')], [tr('warme plaat → bakjes', 'heated sheet → trays'), 'pm-mute'], [tr('omstellen gaat traag', 'changeovers are slow'), 'pm-big']]);
      if (b >= 1) o.oee = op(inAt(b, p, 1), lines(186, [[tr('OEE rond 58% van de tijd', 'OEE around 58% of the time'), 'pm-big'], [tr('budget: € 60k dit jaar', 'budget: €60k this year')]]));
      if (b >= 2) o.worry = op(inAt(b, p, 2), card(228, 64, 'pm-hot') + lines(254, [[tr('grote klant dreigt weg:', 'large customer may leave:'), 'pm-on'], [tr('leverbetrouwbaarheid 85%', 'on-time delivery 85%')]]));
      if (b >= 3) o.buy5 = op(inAt(b, p, 3), lines(320, [[tr('inkoop: drie offertes,', 'purchasing: three quotes,'), 'pm-mute'], [tr('“plan met een vaste prijs”', '“plan with a fixed price”'), 'pm-mute']]));
      return;
    }
    o.head = [tr('jouw offerte', 'your proposal'), 'ex'];
    o.lead = card(54, 92) + lines(80, [[tr('pagina één', 'page one'), 'pm-mute'], [tr('levering 85%, klant weg?', 'on time 85%, customer at risk')], [tr('oorzaak? OEE rond 58%', 'likely cause: OEE ≈ 58%')]]);
    o.goal5 = op(inAt(b, p, 4, 0.45, 0.7), txt(X0, 174, tr('doel: boven 95%, op datum', 'target: above 95%, by a date'), 'pm-on'));
    if (b === 5) {
      o.ph1 = op(span(p, 0.05, 0.3), card(190, 70, 'pm-hot') + lines(216, [[tr('fase 1: diagnose, 3 weken', 'phase 1: diagnostic, 3 weeks'), 'pm-on'], [tr(`12 dagen, ${eur(C.DIAG.fee)} vast`, `12 days, ${eur(C.DIAG.fee)} fixed`)]]))
        + op(span(p, 0.2, 0.4), lines(286, [[tr('toont waar de uren weglekken', 'shows where the hours go'), 'pm-mute'], [tr('fase 2: twee opties,', 'phase 2: two options,'), 'pm-big'], [tr('bandbreedte, vast na fase 1', 'a range, fixed after phase 1')]]));
    }
    if (b === 6) {
      o.need = op(span(p, 0.05, 0.3), lines(214, [[tr('nodig:', 'needed:'), 'pm-mute'], [tr('lijndata uit het MES', 'line data from the MES')], [tr('MES: logt wat lijnen doen', 'MES: logs what lines do'), 'pm-mute'], [tr('engineer: 1 dag per week', 'engineer: 1 day a week')], [tr('sponsor: elke 2 weken', 'sponsor: every 2 weeks')]]))
        + op(span(p, 0.3, 0.5), [0, 2, 3].map((i) => tick(X1 - 22, 236 + i * 26)).join(''));
    }
    if (b >= 7) {
      // the budget as a bar: phase 1's €14.400 is the filled share of the €60k
      const share = C.DIAG.fee / C.DIAG.budget;
      const bw = X1 - X0;
      o.total = op(span(p, 0.05, 0.3), lines(214, [[tr(`binnen ${eurk(60)} in totaal`, `within ${eurk(60)} in total`), 'pm-big']])
        + rect(X0, 230, bw, 24, 'pm-dash', 4) + rect(X0, 230, bw * share, 24, 'sc-you', 4)
        + txt(X0, 280, tr(`fase 1: ${eur(C.DIAG.fee)}`, `phase 1: ${eur(C.DIAG.fee)}`), 'pm-mute')
        + card(300, 74, 'pm-hot') + lines(330, [[tr('bel vóór het versturen:', 'call before sending:'), 'pm-on'], [tr('hoe vergelijkt inkoop?', 'how will purchasing compare?')]]));
    }
  };
  S[5] = (b, p, o) => { // three ways to price, on one slider
    o.head = [tr('drie prijsmodellen', 'three price models'), 'dia'];
    const xs = [X0 + 14, (X0 + X1) / 2, X1 - 14];
    const y = 112;
    // the marker travels day → fixed → value over the first three beats and rests at value
    let at = 0;
    if (b === 0) at = 0;
    else if (b === 1) at = span(p, 0.05, 0.3);
    else if (b === 2) at = 1 + span(p, 0.05, 0.3);
    else at = 2;
    const mx = at <= 1 ? lerp(xs[0], xs[1], at) : lerp(xs[1], xs[2], at - 1);
    o.slide = path(`M${f1(xs[0])} ${y}H${f1(xs[2])}`, 'pm-axis') + xs.map((x) => path(`M${f1(x)} ${y - 6}V${y + 6}`, 'pm-axis')).join('')
      + dot(mx, y, 9, 'pm-dot') + txt(X0, 64, tr('betaald voor: uren → resultaat', 'paid for: hours → result'), 'pm-mute');
    o.day = txt(xs[0] - 8, y + 32, tr('dagtarief', 'day rate'), b === 0 ? 'pm-on' : 'pm-txt');
    o.fixed = txt(xs[1], y - 16, tr('vaste prijs', 'fixed price'), b === 1 ? 'pm-on' : 'pm-txt', 'middle');
    o.value = txt(xs[2] + 8, y + 32, tr('waarde', 'value'), b === 2 ? 'pm-on' : 'pm-txt', 'end');
    const box = (list, hot) => card(164, 30 + 26 * list.length, hot ? 'pm-hot' : 'pm-card') + lines(192, list);
    if (b === 0) o.day += op(span(p, 0.1, 0.35), box([[tr(`${eur(C.DIAG.rate)} per gewerkte dag`, `${eur(C.DIAG.rate)} per day worked`), 'pm-big'], [tr('simpel; betaald voor uren', 'simple; paid for hours')], [tr('risico uitloop: de klant', 'overrun risk: the client'), 'pm-on']]));
    if (b === 1) o.fixed += op(span(p, 0.3, 0.55), box([[tr(`${eurk(48)} voor een vaste scope`, `${eurk(48)} for an agreed scope`), 'pm-big'], [tr('scope: lijst wat je oplevert', 'scope: what you deliver')], [tr('klant kent de prijs', 'the client knows the bill')], [tr('risico uitloop: jij', 'overrun risk: you'), 'pm-on']]));
    if (b === 2) o.value += op(span(p, 0.3, 0.55), box([[tr(`${eurk(80)} voor ${eurk(900)} per jaar`, `${eurk(80)} for ${eurk(900)} a year`), 'pm-big'], [tr('het bedrag volgt de waarde', 'the fee follows the worth')], [tr('van het resultaat', 'of the result')]]));
    if (b === 3) o.cond = op(span(p, 0.05, 0.3), box([[tr('meeste potentieel, alleen als:', 'most upside, only if:'), 'pm-mute'], [tr('de waarde meetbaar is', 'the value is measurable')], [tr('nulmeting is afgesproken', 'the baseline is agreed')], [tr('jij genoeg invloed hebt', 'you control enough'), 'pm-on']]));
    if (b === 4) o.weiss = op(span(p, 0.05, 0.3), box([[tr('voorstanders, zoals', 'advocates, such as'), 'pm-mute'], [tr('Alan Weiss: het eerlijkste', 'Alan Weiss: the fairest'), 'pm-big'], [tr('model voor beide kanten', 'model for both sides'), 'pm-big'], [tr('inkoop: liever dagtarief,', 'purchasing: day rates,')], [tr('makkelijk te vergelijken', 'easy to compare'), 'pm-mute']]));
    if (b >= 5) o.trust = op(span(p, 0.05, 0.3), box([[tr('in de praktijk: werkt het', 'in practice: works best'), 'pm-on'], [tr('best bij een klant die je', 'with a client who'), 'pm-on'], [tr('al vertrouwt', 'already trusts you'), 'pm-on']], true));
  };
  S[6] = (b, p, o) => { // fixed price, tight scope
    o.head = [tr('vaste prijs', 'fixed price'), 'dia'];
    if (b <= 3) {
      const full = 54;
      o.bet = txt(X0, 72, tr(`geschat 40 dagen: ${eurk(48)}`, `estimated 40 days: ${eurk(48)}`)) + rect(X0, 80, dayW(C.BET.est, full), 20, 'sc-you', 3)
        + op(inAt(b, p, 0, 0.4, 0.7), txt(X0, 128, tr('het worden er 50', 'it takes 50')) + rect(X0, 136, dayW(C.BET.real, full), 20, 'sc-them', 3)
          + path(`M${f1(X0 + dayW(C.BET.est, full))} 76V160`, 'pm-dash'))
        + op(inAt(b, p, 1), txt(X0, 190, `${eurk(48)} / 50 = ${eur(C.BET.rate)}`, 'pm-big') + txt(X0, 216, tr('per dag: 20% onder je tarief', 'a day: 20% under your rate'), 'pm-on'));
      if (b === 2) o.margin = op(span(p, 0.05, 0.3), card(234, 98, 'pm-hot') + lines(262, [[tr('risico-opslag', 'risk margin'), 'pm-on'], [tr('vaak 15 tot 25% erbovenop', 'often 15 to 25% on top')], [tr('voor wat je nog niet weet', 'for what you don’t yet know'), 'pm-mute']]));
      if (b === 3) o.scopel = op(span(p, 0.05, 0.3), lines(260, [[tr('scope strak op papier:', 'scope, tightly written:'), 'pm-big'], [tr('opleveringen', 'deliverables')], [tr('aantal sessies', 'number of sessions')], [tr('wat erbuiten valt', 'what is out')]]));
      return;
    }
    o.assume = card(54, 92) + lines(82, [[tr('aanname: “data in week 1”', 'assumption: “data in week 1”')], [tr('klopt hij niet?', 'it fails?'), 'pm-mute'], [tr('dan meerwerk', 'then a change request'), 'pm-on']]);
    if (b >= 5) o.change = op(inAt(b, p, 5), lines(170, [[tr('meerwerk: buiten de scope', 'change request:'), 'pm-big'], [tr('kort en schriftelijk,', 'short and written,')], [tr('toevoegen of ruilen,', 'add or swap work,')], [tr('met dagen en prijs', 'with days and price')]], X0, 24))
      + op(inAt(b, p, 6, 0.05, 0.3), txt(X0, 268, tr('bewaak meteen, vriendelijk', 'guard it at once, kindly'), 'pm-mute'));
    if (b === 6) o.script = op(span(p, 0.05, 0.3), card(282, 100, 'pm-hot') + lines(306, [[tr('“Nog één analyse?”', '“One more analysis?”'), 'pm-mute'], [tr('“Graag. Valt erbuiten:', '“Happy to. It’s outside:'), 'pm-on'], [tr('zo’n 3 dagen. Meerwerk,', 'about 3 days. Add it,'), 'pm-on'], [tr('of ruilen voor workshop 2?”', 'or swap workshop 2?”'), 'pm-on']], X0, 24));
    if (b >= 7) o.free = op(span(p, 0.05, 0.3), card(282, 74) + lines(312, [[tr('één keer gratis:', 'free once:'), 'pm-big'], [tr('alles daarna op nul', 'all that follows at zero'), 'pm-on']]));
  };
  S[7] = (b, p, o) => { // discounts
    o.head = [tr('korting', 'discounts'), 'dia'];
    const full = 1300;
    o.disc = txt(X0, 72, tr(`tarief ${eur(C.DIAG.rate)}`, `rate ${eur(C.DIAG.rate)}`)) + rect(X0, 80, dayW(C.DIAG.rate, full), 18, 'sc-you', 3)
      + op(inAt(b, p, 0, 0.25, 0.5), txt(X0, 124, tr(`−10% = ${eur(C.DISC.net)}`, `−10% = ${eur(C.DISC.net)}`)) + rect(X0, 132, dayW(C.DISC.net, full), 18, 'sc-them', 3))
      + op(inAt(b, p, 0, 0.55, 0.8), txt(X0, 176, tr('1.200 / 1.080 ≈ 1,11', '1,200 / 1,080 ≈ 1.11'), 'pm-mute') + txt(X0, 202, tr('≈ 11% meer dagen werken', '≈ 11% more days to work'), 'pm-big'));
    if (b === 1) o.trade = op(span(p, 0.05, 0.3), lines(240, [[tr('korting? ruil dan:', 'a discount? trade it:'), 'pm-on'], [tr('langere opdracht', 'a longer commitment')], [tr('referentie met naam', 'a named reference')], [tr('sneller betalen', 'faster payment')], [tr('minder scope', 'less scope')]]));
    if (b === 2) o.never = op(span(p, 0.05, 0.3), lines(240, [[tr('nooit kale korting', 'never a bare discount'), 'pm-big'], [tr('niet zakken met fase 1', 'don’t cut phase 1'), 'pm-on'], [tr('anders is je prijs', 'or your price becomes'), 'pm-mute'], [tr('een openingsbod', 'an opening bid'), 'pm-mute']]));
    if (b >= 3) o.leave = op(span(p, 0.05, 0.3), card(232, 76, 'pm-hot') + lines(262, [[tr('Wat wil je', 'What would you like'), 'pm-on'], [tr('eruit laten?', 'to leave out?'), 'pm-on']]));
  };
  S[8] = (b, p, o) => { // scrap on an extrusion line
    o.head = [tr('extrusielijn', 'extrusion line'), 'ex'];
    o.ask9 = lines(70, [[tr('plantdirecteur', 'plant director'), 'pm-mute'], [tr('hete kunststof → profielen', 'hot plastic → profiles'), 'pm-mute'], [tr(`uitval: ${eurk(400)} per jaar`, `scrap: ${eurk(400)} a year`), 'pm-big'], [tr('wil een vaste prijs', 'wants a fixed price')]], X0, 22);
    const full = 50;
    const rows = [[tr('schone data: 30 dagen', 'clean data: 30 days'), C.EXT.est[0], C.EXT.clean], [tr('anders: 45 dagen', 'if not: 45 days'), C.EXT.est[1], C.EXT.dirty]];
    if (b >= 1) {
      o.est = rows.map(([t, d], i) => op(inAt(b, p, 1, 0.1 + i * 0.2, 0.3 + i * 0.2), txt(X0, 164 + i * 50, t) + rect(X0, 172 + i * 50, dayW(d, full), 18, 'sc-them', 3))).join('')
        + (b === 1 ? op(span(p, 0.15, 0.35), txt(X0, 272, tr(`bekend in week 2; ${eur(C.DIAG.rate)}/dag`, `known in week 2; ${eur(C.DIAG.rate)}/day`), 'pm-mute')) : '');
    }
    if (b === 2) o.comp = op(span(p, 0.05, 0.3), card(256, 46, 'pm-chip') + txt(X0, 286, tr(`concurrent: ${eurk(30)}`, `competitor: ${eurk(30)}`), 'pm-big'));
    if (b >= 3) {
      o.split = op(inAt(b, p, 3), rows.map((r, i) => rect(X0, 172 + i * 50, dayW(C.EXT.p1, full), 18, 'pm-hot', 3)).join(''))
        + (b === 3 ? op(span(p, 0.3, 0.55), lines(280, [[tr(`fase 1: 8 dagen, ${eur(9600)}`, `phase 1: 8 days, ${eur(9600)}`), 'pm-on'], [tr('vast, met de datacheck', 'fixed, data check included')]])) : '');
    }
    if (b >= 4) {
      o.ph2b = op(inAt(b, p, 4), rows.map(([, , d], i) => rect(X0 + dayW(C.EXT.p1, full), 172 + i * 50, dayW(d, full), 18, 'sc-you', 3)
        + txt(X0 + dayW(C.EXT.p1 + d, full) + 6, 188 + i * 50, String(d), 'pm-txt')).join(''))
        + (b === 4 ? op(span(p, 0.3, 0.55), lines(280, [[tr('fase 2 vast na week 2:', 'phase 2 fixed after week 2:'), 'pm-on'], [tr('22 of 37 dagen + 15%', '22 or 37 days + 15%')]])) : '');
    }
    if (b === 5) o.valopt = op(span(p, 0.05, 0.3), card(256, 124, 'pm-hot') + lines(280, [[tr('of een waardeoptie:', 'or a value option:'), 'pm-on'], [tr('lager vast + bonus', 'lower fixed fee + bonus')], [tr('bij afgesproken daling', 'if scrap falls as agreed')], [tr('gemeten door de controller', 'measured by the controller'), 'pm-mute'], [tr('(financiën, bewaakt cijfers)', '(finance, checks numbers)'), 'pm-mute']], X0, 22));
    if (b >= 6) o.thirty = op(span(p, 0.05, 0.3), card(256, 124, 'pm-hot') + lines(278, [[tr(`${eurk(30)}? hun scope: onbekend`, `${eurk(30)}? their scope: unknown`), 'pm-mute'], [tr('wat levert elke offerte,', 'what does each deliver,'), 'pm-on'], [tr('wie draagt het risico', 'who carries the risk'), 'pm-on'], [tr('als de data slecht is?', 'if the data is poor?'), 'pm-on'], [tr('niet blind zakken', 'don’t match it blind'), 'pm-mute']], X0, 24));
  };

  // ---------------------------------------------------------------- the proposal's first page
  // rule lines (of 8) on the page: they fill as the film builds the proposal in
  // s1 to s3, start again for the thermoforming proposal in s5 and stay full
  function page(si, b, p) {
    let n = 8;
    if (si === 0) n = b < 1 ? 0 : 2 + (b === 1 ? span(p, 0.1, 0.8) : 1);
    else if (si === 1) n = 3 + (b < 1 ? 0 : b < 4 ? 1 + span(b === 1 ? p : 1, 0, 1) : 3);
    else if (si === 2) n = 6 + (b < 3 ? 1 : 2);
    else if (si === 4) n = b < 4 ? 0 : Math.min(8, (b - 4) * 1.6 + span(p, 0.1, 0.8) * 1.6);
    let s = '';
    for (let i = 0; i < 8; i++) {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += `<path class="pm-line" d="M2.5 ${f1(4 + i * 3)}H${f1(2.5 + (i % 3 === 2 ? 10 : 16) * a)}"/>`;
    }
    return s;
  }

  // the operations director (s5) stands in the sponsor's place; elsewhere the sponsor
  const cast = (si) => {
    const od = si === 4;
    if (E.odWrap.__od !== od) { E.odWrap.style.display = od ? '' : 'none'; E.spWrap.style.display = od ? 'none' : ''; E.odWrap.__od = od; }
  };
  function render(si, u) {
    camera(si, u);
    cast(si);
    const { b, p } = beatOf(si, u);
    const o = { head: ['', 'dia'] };
    for (const key of C.SLOTS) o[key] = '';
    S[si](b, p, o);
    let mini = '';
    for (const key of C.SLOTS) { set(E[`t_${key}`], o[key]); mini += o[key]; }
    const lab = o.head[1] === 'dia' ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, lab, 'pm-mute', 'end'));
    set(E.bMini, mini);
    set(E.dLines, page(si, b, p));
  }

  return { render };
})();
