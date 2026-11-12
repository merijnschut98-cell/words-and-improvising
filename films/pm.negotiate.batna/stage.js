// The stage of the film "BATNA, ZOPA en het eerste bod / BATNA, ZOPA and the
// first offer": a pure function of (scene, u). Inlined into the page after
// the anatomy kit and a preamble from build.mjs that defines C (the example's
// numbers and the panel's blocks), CAM (one camera move per scene), W and H.
// Moves are placed per Dutch caption beat (beatStarts on the Dutch captions;
// films/_kit/beatwarp.js sets STAGE.nlBeats), so the video's narration timing
// keeps them in step. The panel at the right gets one card per scene, each
// block in its own cue group; the board in the room repeats it in miniature,
// and the preparation sheet on the table fills in with two columns.
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
  const tick = (x, y) => `<path class="pm-tick" d="M${f1(x)} ${f1(y)}l5 5l10 -12"/>`;
  // a block fades in over the start of its beat and stays; only: shown in beat n alone
  const inAt = (b, p, n, a0 = 0.05, a1 = 0.3) => (b > n ? 1 : b === n ? span(p, a0, a1) : 0);
  const only = (b, p, n, a0 = 0.05, a1 = 0.3) => (b === n ? span(p, a0, a1) : 0);

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

  // a number line from X0 to X1 at y: value v (between lo and hi) to x
  const lineX = (v, lo, hi) => X0 + 6 + ((v - lo) / (hi - lo)) * (X1 - X0 - 12);
  // the two bars: yours runs right from your walk-away point (a), theirs runs
  // left from their limit (t); where they overlap is the zone
  function bars(y, a, t, zone, labels = 1) {
    let s = path(`M${X0} ${y + 40}H${X1}`, 'pm-axis');
    s += rect(lineX(a, 0, 100), y, X1 - lineX(a, 0, 100), 16, 'sc-you', 3);
    s += rect(X0, y + 20, lineX(t, 0, 100) - X0, 16, 'sc-them', 3);
    s += op(labels, txt(X1, y - 8, tr('jij: vanaf je ondergrens', 'you: from your walk-away'), 'pm-mute', 'end')
      + txt(X0, y + 62, tr('zij: tot hun grens', 'they: up to their limit'), 'pm-mute'));
    if (zone > 0.01 && t > a) s += op(zone, rect(lineX(a, 0, 100), y - 2, lineX(t, 0, 100) - lineX(a, 0, 100), 40, 'sc-zone', 3));
    return s;
  }

  // ---------------------------------------------------------------- the cards
  // Each fills o[slot] and sets o.head = [title, 'dia' | 'ex'].
  const S = [];
  S[0] = (b, p, o) => { // position and interest
    o.head = [tr('standpunt en belang', 'position and interest'), 'dia'];
    o.pos = card(54, 92) + lines(82, [[tr('standpunt', 'position'), 'pm-big'], [tr('wat hij zegt te willen', 'what they say they want')], [tr('“vrijdag af”, “10% omlaag”', '“by Friday”, “10% off”'), 'pm-mute']]);
    o.int = op(inAt(b, p, 1), card(156, 92) + lines(184, [[tr('belang', 'interest'), 'pm-on'], [tr('waarom hij het wil', 'why they want it')], [tr('directie maandag, bezuiniging', 'board Monday, a cut'), 'pm-mute']]));
    o.fu = op(only(b, p, 2), lines(282, [[tr('Fisher en Ury, 1981', 'Fisher and Ury, 1981'), 'pm-mute'], [tr('principieel', 'principled'), 'pm-on'], [tr('onderhandelen', 'negotiation'), 'pm-on'], [tr('standpunt graaft in', 'positions dig in'), 'pm-mute']]));
    o.why = op(only(b, p, 3), card(262, 114, 'pm-hot') + lines(290, [[tr('Wat levert dat je op?', 'What would that give you?'), 'pm-on'], [tr('En als het geen vrijdag is?', 'And if it isn’t Friday?')], [tr('Waar maak je je zorgen over?', 'What worries you?')], ['']]));
    o.needs = op(only(b, p, 4), lines(284, [[tr('zekerheid, erkenning, grip,', 'security, recognition,')], [tr('geld en tijd', 'control, money, time')], [tr('hun belangen naast de jouwe', 'theirs next to yours'), 'pm-on'], [tr('vaak op meer manieren', 'often more than one way'), 'pm-mute']]));
  };
  S[1] = (b, p, o) => { // trades and a standard
    o.head = [tr('ruil en maatstaf', 'trade and standard'), 'dia'];
    o.diff = card(54, 92) + txt(X0, 82, tr('gedeeld', 'shared'), 'pm-big') + txt(X0 + 150, 82, tr('verschillend', 'different'), 'pm-big')
      + txt(X0, 110, tr('het project', 'the project')) + txt(X0, 134, tr('slaagt', 'succeeds')) + txt(X0 + 150, 110, tr('de datum', 'the date')) + txt(X0 + 150, 134, tr('of kosten', 'or cost'));
    if (b === 1) {
      const chips = [tr('tijd', 'time'), tr('prijs', 'price'), tr('scope', 'scope')];
      o.pack = op(span(p, 0.05, 0.3), card(160, 214) + txt(X0, 190, tr('pakketdeal', 'package deal'), 'pm-on')
        + chips.map((c, i) => rect(X0 + i * 96, 206, 86, 36, 'pm-chip', 6) + txt(X0 + 43 + i * 96, 231, c, 'pm-txt', 'middle')).join('')
        + lines(272, [[tr('geef wat jou weinig kost,', 'give what is cheap for you,')], [tr('de ander veel waard is', 'valuable for them')]]))
        + op(span(p, 0.6, 0.85), txt(X0, 352, tr('één punt: winnen of verliezen', 'one issue: win or lose'), 'pm-mute'));
    }
    if (b === 2) {
      o.fair = op(span(p, 0.05, 0.3), card(160, 214) + lines(190, [[tr('eerlijke maatstaf', 'fair standard'), 'pm-on'], [tr('marktprijs, data, een norm', 'market rate, past data, a norm')], [tr('Wat is hier redelijk,', 'What would be fair,'), 'pm-big'], [tr('en hoe checken we dat?', 'and how can we check?'), 'pm-big'], [tr('niet wie het sterkst is', 'not who is stronger'), 'pm-mute'], [tr('ja zonder gezichtsverlies', 'yes without losing face'), 'pm-mute']]));
    }
    if (b === 3) {
      o.split = op(span(p, 0.05, 0.3), card(160, 76) + lines(190, [[tr('“Mijn ploegen doen dat niet.”', '“My crews won’t do it.”')], [tr('een standpunt als feit', 'a position dressed as fact'), 'pm-mute']]))
        + op(span(p, 0.4, 0.65), lines(276, [[tr('snel het verschil delen:', 'splitting the difference:')], [tr('voelt eerlijk, maar beloont', 'feels fair, but rewards')], [tr('de extreemste opening', 'the most extreme opener'), 'pm-on']]));
    }
    if (b >= 4) {
      o.voss = op(span(p, 0.05, 0.3), lines(184, [[tr('experts verschillen', 'experts differ'), 'pm-mute'], [tr('Chris Voss, oud-FBI, 2016:', 'Chris Voss, ex-FBI, 2016:')], [tr('emoties beslissen', 'emotions decide'), 'pm-big'], [tr('luister, benoem het gevoel', 'listen, name the feeling')]]))
        + op(span(p, 0.45, 0.7), card(296, 78, 'pm-hot') + lines(326, [[tr('Als je precies dit krijgt,', 'If you got exactly this,'), 'pm-on'], [tr('wat lost dat dan op?', 'what would it solve?'), 'pm-on']]));
    }
  };
  S[2] = (b, p, o) => { // a day extra?
    o.head = [tr('een dag extra?', 'a day extra?'), 'ex'];
    const rows = [tr('vergunningen', 'permits'), tr('materiaal', 'materials'), tr('schakelplan', 'switching plan')];
    o.check = txt(X0, 74, tr('gereedheidscheck', 'readiness check'), 'pm-big') + txt(X0, 100, tr('2 dagen voor de start', '2 days before the start'), 'pm-mute')
      + rows.map((r, i) => op(inAt(b, p, 0, 0.15 + i * 0.15, 0.3 + i * 0.15), tick(X0 + 2, 122 + i * 26) + txt(X0 + 26, 130 + i * 26, r))).join('');
    if (b === 1) o.posx = op(span(p, 0.05, 0.3), card(200, 110) + lines(228, [[tr('hoofd uitvoering', 'head of execution'), 'pm-mute'], [tr('“Mijn ploegen doen dat niet.”', '“My crews won’t do it.”')], [tr('standpunt: geen dag extra', 'position: no extra day'), 'pm-on']]));
    if (b === 2) o.intx = op(span(p, 0.05, 0.3), card(200, 136) + lines(228, [[tr('“Wat zou die dag je kosten?”', '“What would that day cost?”'), 'pm-on'], [tr('belang:', 'interest:'), 'pm-mute'], [tr('geen stilstaande ploegen,', 'no idle crews,')], [tr('geen schuld van planners', 'no blame from planners')]]));
    if (b === 3) {
      o.opt = op(span(p, 0.05, 0.3), lines(228, [[tr('jouw belang:', 'your interest:'), 'pm-mute'], [tr('minder ritten voor niks', 'fewer wasted trips')]]))
        + op(span(p, 0.35, 0.6), card(282, 84, 'pm-hot') + lines(312, [[tr('planners checken,', 'planners check,'), 'pm-on'], [tr('ploegen krijgen klare klussen', 'crews get jobs that pass')]]));
    }
    if (b >= 4) {
      o.pilot = op(span(p, 0.05, 0.3), card(200, 84) + lines(230, [[tr('pilot', 'pilot'), 'pm-on'], [tr('4 weken, 1 regio', '4 weeks, 1 region')]]))
        + op(span(p, 0.4, 0.7), lines(320, [[tr('maatstaf: ritten voor niks', 'standard: wasted trips')], [tr('ervoor en erna', 'before and after'), 'pm-mute']]));
    }
  };
  S[3] = (b, p, o) => { // your alternative
    o.head = [tr('jouw alternatief', 'your alternative'), 'dia'];
    o.batna = card(54, 118) + lines(82, [['BATNA', 'pm-big'], [tr('wat je echt doet', 'what you actually do')], [tr('als je wegloopt', 'if you walk away')], [tr('Fisher en Ury, 1981', 'Fisher and Ury, 1981'), 'pm-mute']]);
    if (b === 1) o.good = op(span(p, 0.05, 0.3), lines(206, [[tr('goed: rustig nee', 'good: say no calmly'), 'pm-on'], [tr('slecht: eerst verbeteren', 'bad: improve it first')]]));
    if (b >= 2) {
      o.floor = op(inAt(b, p, 2), txt(X0, 202, tr('ondergrens: slechtste deal', 'walk-away: the worst deal'), 'pm-on') + txt(X0, 228, tr('die je nog accepteert', 'you still accept')));
    }
    if (b >= 3) {
      const lo = 900;
      const hi = 1050;
      const x = (v) => lineX(v, lo, hi);
      const y = 300;
      let s = txt(X1, 262, tr('voorbeeld', 'example'), 'pm-mute', 'end') + path(`M${X0} ${y}H${X1}`, 'pm-axis');
      s += op(inAt(b, p, 3, 0.1, 0.35), path(`M${f1(x(C.RATE.alt))} ${y - 16}V${y + 16}`, 'sc-mark') + txt(x(C.RATE.alt), y + 40, tr('elders €1.000', 'elsewhere €1,000'), 'pm-txt', 'middle'));
      s += op(inAt(b, p, 3, 0.45, 0.7), dot(x(C.RATE.offer), y, 7, 'pm-dot') + txt(x(C.RATE.offer), y - 16, tr('bod €950', 'offer €950'), 'pm-txt', 'middle'));
      if (b >= 4) s += op(span(p, 0.05, 0.35), rect(X0, y + 6, x(C.RATE.alt) - X0, 8, 'sc-them', 3) + txt(X0, y + 70, tr('onder €1.000: slechter', 'below €1,000: worse off'), 'pm-on'))
      ;
      o.rate = s;
    }
  };
  S[4] = (b, p, o) => { // the ZOPA
    o.head = [tr('de ZOPA', 'the ZOPA'), 'dia'];
    // your bar from 40; theirs slides in from the left until 70 (b1), then the zone (b2), apart (b3), back
    let t = 20;
    if (b === 0) t = lerp(10, 30, span(p, 0.2, 0.9));
    else if (b === 1) t = lerp(30, 70, span(p, 0.05, 0.35));
    else if (b === 2) t = lerp(70, 28, span(p, 0.1, 0.5));
    else if (b === 3) t = lerp(28, 70, span(p, 0, 0.25));
    else t = 70;
    const zone = b === 1 ? span(p, 0.3, 0.5) : b === 2 ? 1 - span(p, 0.05, 0.3) : b === 3 ? span(p, 0.2, 0.35) : b > 3 ? 1 : 0;
    const a = 40;
    o.theirs = (b === 0 ? bars(82, a, t, 0) : '') + op(only(b, p, 0, 0.3, 0.55), txt(X0, 206, tr('hun alternatief?', 'their alternative?'), 'pm-big')
      + lines(232, [[tr('andere leverancier,', 'another supplier,')], [tr('zelf doen, of wachten', 'do it themselves, or wait')]]));
    // from b1 the bars belong to the zone's cue group, so the ZOPA beats light them with the zone
    const za = lineX(a, 0, 100);
    const zt = lineX(t, 0, 100);
    const zm = (za + Math.max(za, zt)) / 2;
    o.zopa = (b >= 1 ? bars(82, a, t, 0, 1 - zone) : '') + op(zone, rect(za, 80, Math.max(0, zt - za), 40, 'sc-zone', 3)
      + path(`M${f1(za)} 126V140H${f1(Math.max(za, zt))}V126M${f1(zm)} 140V156`, 'pm-line') + txt(zm, 178, 'ZOPA', 'pm-on', 'middle'));
    if (b === 2) o.zopa += op(span(p, 0.4, 0.65), lines(206, [[tr('geen ZOPA:', 'no ZOPA:'), 'pm-big'], [tr('geen slimme zin helpt', 'no clever wording helps')], [tr('verander wat er op tafel ligt', 'change what’s on the table'), 'pm-on']]));
    if (b === 3) {
      o.bluff = op(span(p, 0.05, 0.3), lines(206, [[tr('niet bluffen', 'don’t bluff'), 'pm-big'], [tr('een echt alternatief, rustig,', 'a real one, calmly,')], [tr('“Anders doen we het', '“Otherwise we’ll do it'), 'pm-mute'], [tr('volgend jaar.”', 'next year.”'), 'pm-mute']]));
      o.second = op(span(p, 0.5, 0.75), card(296, 84, 'pm-hot') + lines(326, [[tr('een tweede echte optie:', 'a second real option:'), 'pm-on'], [tr('je sterkste middel', 'your strongest tool')]]));
    }
    if (b === 4) {
      o.switch = op(span(p, 0.05, 0.3), lines(206, [[tr('overstapkosten', 'switching cost'), 'pm-big'], [tr('tijd, inwerken', 'time, learning')]]));
      o.qual = op(span(p, 0.35, 0.6), lines(272, [[tr('kwalificatie:', 'qualification:'), 'pm-on'], [tr('testen en goedkeuren', 'testing and approval')], [tr('hoog = zwakker alternatief', 'high = weaker alternative'), 'pm-mute']]));
    }
    if (b >= 5) {
      o.pitfall = op(span(p, 0.05, 0.3), lines(206, [[tr('fout: BATNA overschatten,', 'failure: overrating it,'), 'pm-big'], [tr('of vergeten wat het kost', 'or forgetting its cost')], [tr('sterk: rustig laten zien', 'strong: show it calmly')], [tr('zwak: voor je houden', 'weak: keep it to yourself')]]))
        + op(span(p, 0.4, 0.6), card(296, 84, 'pm-hot') + lines(326, [[tr('Wat doen we maandag echt', 'What do we actually do'), 'pm-on'], [tr('als ze nee zeggen?', 'on Monday if they say no?'), 'pm-on']]));
    }
  };
  S[5] = (b, p, o) => { // coated brackets
    o.head = [tr('gecoate beugels', 'coated brackets'), 'ex'];
    o.rise = card(54, 66) + txt(X0, 82, tr('huidige leverancier', 'current supplier'), 'pm-mute') + txt(X0, 108, tr('+12% aangekondigd', '+12% announced'), 'pm-big');
    if (b >= 1) o.quote = op(inAt(b, p, 1), card(128, 66) + txt(X0, 156, tr('tweede leverancier', 'second supplier'), 'pm-mute') + txt(X0, 182, tr('+4%, 10 weken kwalificatie', '+4%, 10 weeks to qualify'), 'pm-big'))
      + op(inAt(b, p, 1, 0.55, 0.8), txt(X0, 220, tr('zelf coaten: kan niet', 'coating in-house: no'), 'pm-mute'));
    if (b >= 2) o.alts = op(inAt(b, p, 2), txt(X0, 252, tr('jouw BATNA: overstappen', 'your BATNA: switch'), 'pm-on') + txt(X0, 278, tr('hun BATNA: volume kwijt', 'theirs: losing your volume')));
    if (b === 3) o.now = op(span(p, 0.05, 0.3), card(296, 78, 'pm-hot') + lines(326, [[tr('start de kwalificatie nu:', 'start qualifying now:'), 'pm-on'], [tr('beter alternatief, altijd', 'a better alternative, always')]]));
    if (b === 4) o.index = op(span(p, 0.05, 0.3), card(296, 78, 'pm-hot') + lines(326, [[tr('bod: 4% nu + indexclausule', 'offer: 4% now + index clause'), 'pm-on'], [tr('deel prijs volgt energie-index', 'part follows an energy index')]]));
    if (b >= 5) o.floor2 = op(span(p, 0.05, 0.3), card(296, 78) + lines(326, [[tr('ondergrens: ~4%', 'walk-away: about 4%'), 'pm-on'], [tr('+ kosten van kwalificeren', '+ the cost of qualifying')]]));
  };
  S[6] = (b, p, o) => { // the first number
    o.head = [tr('het eerste getal', 'the first number'), 'dia'];
    const x = (v) => lineX(v, 8, 24);
    const y = 300;
    if (b <= 2) {
      o.anchor = lines(82, [[tr('anker', 'anchor'), 'pm-big'], [tr('het eerste getal trekt', 'the first number pulls')], [tr('ieders schatting mee', 'every estimate along')], [tr('Tversky en Kahneman, 1974', 'Tversky and Kahneman, 1974'), 'pm-mute']]);
      if (b >= 1) o.first = op(inAt(b, p, 1), lines(198, [[tr('eerste bod voorspelt de deal', 'first offer predicts the deal')], [tr('Galinsky en Mussweiler, 2001', 'Galinsky and Mussweiler, 2001'), 'pm-mute']]));
      if (b >= 2) o.defend = op(inAt(b, p, 2), card(262, 112, 'pm-hot') + lines(290, [[tr('ambitieus en verdedigbaar', 'ambitious and defensible'), 'pm-on'], [tr('extreem zonder reden:', 'extreme, no reason:')], [tr('kost geloofwaardigheid', 'costs credibility'), 'pm-mute'], [tr('of het gesprek stopt', 'or the talk ends'), 'pm-mute']]));
      return;
    }
    o.head = [tr('een diagnose', 'a diagnostic'), 'ex'];
    o.diag = lines(80, [[tr('3 regiokantoren', '3 regional offices'), 'pm-big'], [tr('kort onderzoek: hoe wordt', 'a short study of how work'), 'pm-mute'], [tr('gepland, waar gaat het mis?', 'is planned, where it fails'), 'pm-mute']])
      + path(`M${X0} ${y}H${X1}`, 'pm-axis') + [10, 15, 20].map((v) => path(`M${f1(x(v))} ${y - 5}V${y + 5}`, 'pm-axis')).join('');
    o.diag += C.PAST.map((v, i) => op(inAt(b, p, 3, 0.2 + i * 0.15, 0.35 + i * 0.15), dot(x(v), y - 14, 6, 'pm-dot') + txt(x(v), y + 30, String(v), 'pm-txt', 'middle'))).join('');
    if (b >= 4) {
      o.basis = op(inAt(b, p, 4, 0.05, 0.25), rect(x(10) - 4, y - 24, 8, 24, 'sc-them', 2) + txt(x(10), y + 30, '10', 'pm-txt', 'middle') + txt(X0, 186, tr('inkoop: “een dag of 10”', 'purchasing: “about 10”'), 'pm-mute'))
        + op(inAt(b, p, 4, 0.4, 0.65), rect(x(18), y - 34, x(22) - x(18), 10, 'sc-you', 2) + path(`M${f1(x(20))} ${y - 44}V${y - 22}`, 'sc-mark') + txt(X0, 216, tr('jij: “18 tot 22, dus 20”', 'you: “18 to 22, so 20”'), 'pm-on'));
    }
    if (b >= 5) o.mid = op(inAt(b, p, 5), path(`M${f1(x(15) - 10)} ${y - 10}l20 20M${f1(x(15) + 10)} ${y - 10}l-20 20`, 'pm-strike') + txt(X0, 246, tr('niet 10, niet zomaar 15', 'not 10, not just 15'), 'pm-txt'));
    if (b >= 6) o.trade = op(span(p, 0.05, 0.3), card(342, 42, 'pm-hot') + txt(X0, 370, tr('12 dagen: 1 regio grondig', '12 days: 1 region in depth'), 'pm-on'));
  };
  S[7] = (b, p, o) => { // framing and concessions
    o.head = [tr('bieden en framing', 'offers and framing'), 'dia'];
    if (b <= 1) {
      o.basisq = op(inAt(b, p, 0), lines(82, [[tr('zij ankeren eerst?', 'they anchor first?'), 'pm-big'], [tr('geen discussie over hun getal', 'don’t argue their number')], [tr('“Waar komt het vandaan?”', '“Where does it come from?”'), 'pm-on'], [tr('jouw basis, jouw getal', 'your basis, your number')]]));
      if (b === 1) o.counter = op(span(p, 0.05, 0.3), card(200, 110, 'pm-hot') + lines(228, [[tr('tegenbod vlak bij', 'counteroffer close to'), 'pm-on'], [tr('een onredelijk getal', 'an unreasonable number')], [tr('= hun anker geaccepteerd', '= their anchor accepted'), 'pm-big']]));
      return;
    }
    if (b <= 3) {
      o.frame = card(54, 146) + lines(82, [[tr('framing', 'framing'), 'pm-big'], [tr('“95% op tijd”', '“95% on time”')], [tr('“1 op de 20 te laat”', '“1 in 20 late”')], [tr('“€31.200” of', '“€31,200” or'), 'pm-mute'], [tr('“€600 per week, een jaar”', '“€600 a week, for a year”'), 'pm-mute']]);
      if (b === 3) o.loss = op(span(p, 0.05, 0.3), lines(232, [[tr('verliesaversie', 'loss aversion'), 'pm-on'], [tr('“blijf 300 uur per maand', '“keep losing 300 hours')], [tr('verliezen” > “bespaart 300”', 'a month” > “saves 300”')], [tr('Kahneman en Tversky, 1979', 'Kahneman and Tversky, 1979'), 'pm-mute'], [tr('frame eerlijk', 'frame honestly'), 'pm-mute']]));
      return;
    }
    const steps = C.CONC;
    o.conc = lines(82, [[tr('concessies, steeds kleiner', 'concessions, ever smaller'), 'pm-big']])
      + steps.map((v, i) => op(inAt(b, p, 4, 0.1 + i * 0.15, 0.25 + i * 0.15), rect(X0, 100 + i * 34, (v - 16) * 40, 26, 'sc-you', 3) + txt(X0 + (v - 16) * 40 + 10, 120 + i * 34, tr(String(v).replace('.', ','), String(v)) + tr(' dagen', ' days')))).join('')
      + op(inAt(b, p, 4, 0.6, 0.85), txt(X0, 226, tr('elke stap: iets terug', 'each step: something back'), 'pm-on'));
    if (b >= 5) o.range = op(span(p, 0.05, 0.3), lines(262, [[tr('kent de ander de markt beter?', 'they know the market better?')], [tr('laat hem openen', 'let them open'), 'pm-on'], [tr('bandbreedte “20 tot 22”:', 'a range, “20 to 22”:')], [tr('Ames en Mason, 2015', 'Ames and Mason, 2015'), 'pm-mute']]))
      + op(span(p, 0.75, 0.95), txt(X0, 376, tr('Waarop is dat gebaseerd?', 'What is it based on?'), 'pm-on'));
    if (b === 4) o.conc += op(span(p, 0.7, 0.9), lines(262, [[tr('groot of snel toegeven', 'big or quick concessions')], [tr('verraadt veel ruimte', 'signal plenty of room'), 'pm-mute']]));
  };
  S[8] = (b, p, o) => { // no, and what can
    if (b <= 5) {
      o.head = [tr('de positieve nee', 'the positive no'), 'dia'];
      const parts = [[tr('ja', 'yes'), tr('wat je beschermt', 'what you protect')], [tr('nee', 'no'), tr('duidelijk', 'clear')], [tr('ja', 'yes'), tr('optie, ruil, later', 'option, trade, later')]];
      o.pno = txt(X0, 76, tr('Ury, 2007: ja, nee, ja', 'Ury, 2007: yes, no, yes'), 'pm-mute');
      o.yny = parts.map(([w, s], i) => op(b === 0 ? span(p, 0.4 + i * 0.15, 0.55 + i * 0.15) : 1,
        rect(X0 + i * 96, 90, 86, 40, i === 1 ? 'pm-hot' : 'pm-chip', 6) + txt(X0 + 43 + i * 96, 117, w, i === 1 ? 'pm-on' : 'pm-big', 'middle'))).join('')
        + (b === 1 ? op(span(p, 0.3, 0.6), parts.map(([, s], i) => txt(X0, 162 + i * 26, `${i + 1}. ${s}`)).join('')) : '');
      if (b === 2) o.short = op(span(p, 0.05, 0.3), lines(162, [[tr('kort en rustig', 'short and calm'), 'pm-big'], [tr('“ik ga het proberen” = ja', '“I’ll try” = yes')], [tr('één echte reden, dan stil', 'one real reason, then stop'), 'pm-on'], [tr('junioren: ’s nachts door', 'juniors: working nights'), 'pm-mute']]));
      if (b === 3) o.swap = op(span(p, 0.05, 0.3), lines(162, [[tr('een ruil aanbieden', 'offer a trade'), 'pm-on'], [tr('“Wat kan er vervallen?”', '“What can drop?”')], [tr('“als Jan de data overneemt”', '“if Jan takes the data pull”'), 'pm-mute'], [tr('wie de prioriteit bepaalt, kiest', 'the priority-setter chooses')]]));
      if (b === 4) o.red = op(span(p, 0.05, 0.3), card(146, 134, 'pm-hot') + lines(176, [[tr('rode lijn', 'red line'), 'pm-on'], [tr('veiligheid, integriteit,', 'safety, integrity,')], [tr('bindende regels', 'binding rules')], [tr('geen data aanpassen', 'no changing the data'), 'pm-mute']]))
        + op(span(p, 0.5, 0.75), txt(X0, 312, tr('“Dat kan ik niet. Dit wel.”', '“That I can’t. This I can.”'), 'pm-big'));
      if (b === 5) o.prep = op(span(p, 0.05, 0.3), lines(162, [[tr('bereid je nee voor', 'prepare your no'), 'pm-big'], [tr('niet: 3× sorry, lange uitleg,', 'not: sorry ×3, long reasons,')], [tr('nee per mail', 'a no by email')], [tr('of: “zeg nooit nee”? Ury:', 'or “never say no”? Ury:'), 'pm-mute'], [tr('een duidelijk nee is beter', 'a clear no works better'), 'pm-mute'], [tr('Wat bescherm ik?', 'What am I protecting?'), 'pm-on']]));
      return;
    }
    o.head = [tr('donderdag 16.00', 'Thursday 16:00'), 'ex'];
    o.ask = lines(80, [[tr('je baas:', 'your boss:'), 'pm-mute'], [tr('presentatie stuurgroep', 'steering committee deck')], [tr('om, voor morgen 8.00', 'reworked by 08:00'), 'pm-big']]);
    if (b >= 7) o.promise = op(inAt(b, p, 7), lines(166, [[tr('beloofd aan planningsleider:', 'promised the planning lead:'), 'pm-mute'], [tr('analyse vrijdag 12.00', 'analysis by Friday noon'), 'pm-big']]) + txt(X0, 218, tr('allebei goed? lukt niet', 'both well? won’t work'), 'pm-txt'));
    if (b === 8) o.yesno = op(span(p, 0.05, 0.3), card(238, 136) + lines(266, [[tr('ja: “ook een sterke', 'yes: “a strong deck'), 'pm-on'], [tr('presentatie”', 'for me too”'), 'pm-on'], [tr('nee: “allebei goed lukt', 'no: “I can’t do both'), 'pm-big'], [tr('me vanavond niet”', 'properly tonight”'), 'pm-big']]));
    if (b >= 9) o.opts = op(span(p, 0.05, 0.3), card(238, 136, 'pm-hot') + lines(266, [[tr('ja, met opties:', 'yes, with options:'), 'pm-on'], [tr('A: 3 slides + analyse op tijd', 'A: 3 slides + analysis on time')], [tr('B: analyse naar maandag', 'B: analysis to Monday')], [tr('jouw baas kiest', 'your boss chooses'), 'pm-mute']]));
  };

  // ---------------------------------------------------------------- the room's paper
  // the preparation sheet: two columns of lines (theirs left, yours right) fill in at s1 b5 and stay
  function sheet(si, b, p) {
    const n = si === 0 ? (b < 4 ? 0 : span(p, 0.1, 0.8) * 8) : 8;
    let s = '';
    for (let i = 0; i < 8; i++) {
      const a = clamp(n - i, 0, 1);
      const col = i % 2;
      const row = Math.floor(i / 2);
      if (a > 0.01) s += `<path class="pm-line" d="M${f1(2.5 + col * 14.5)} ${f1(4 + row * 4)}H${f1(2.5 + col * 14.5 + 11 * a)}"/>`;
    }
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = { head: ['', 'dia'] };
    for (const key of C.SLOTS) o[key] = '';
    S[si](b, p, o);
    let mini = '';
    for (const key of C.SLOTS) { set(E[`t_${key}`], o[key]); mini += o[key]; }
    const lab = o.head[1] === 'dia' ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, lab, 'pm-mute', 'end'));
    set(E.bMini, mini);
    set(E.dLines, sheet(si, b, p));
  }

  return { render };
})();
