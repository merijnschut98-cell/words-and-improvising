// The stage of the film "Drie gesprekken in één / Three conversations in one":
// a pure function of (scene, u). Inlined into the page after the anatomy kit
// and a preamble from build.mjs that defines C (the panel's blocks), CAM (one
// camera move per scene), W and H. Moves are placed per Dutch caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. The panel at the right gets one card per scene, each block in
// its own cue group (o[key] goes into data-k "p_<key>"); the three
// conversations are drawn as three stacked layers (slabs), and Henk's
// preparation in s6 uses the same layers. The board in the room repeats the
// panel in miniature; the sheet on the table fills in with the preparation
// notes (s2, s6) and the agreement (s5, s7).
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
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, X1 - X0 + 12, h, cls, 8);
  // lines of [text, class] from y down, 24 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 24, t, cls || 'pm-txt') : '')).join('');
  // a layer: a slab seen from a little above, its top strip and its front face
  // with a name and a detail line; dy slides it in from above
  const slab = (y, name, detail, cls = 'pm-card', dy = 0) => {
    const yy = y + dy;
    return path(`M${X0 - 6} ${f1(yy)}L${X0 + 12} ${f1(yy - 12)}H${X1 + 6}L${X1 - 12} ${f1(yy)}Z`, 'pm-top')
      + rect(X0 - 6, yy, X1 - X0 - 6, 56, cls, 4)
      + txt(X0 + 4, yy + 23, name, cls === 'pm-hot' ? 'pm-on' : 'pm-big') + txt(X0 + 4, yy + 47, detail, 'pm-txt');
  };
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  const SCHEMA = () => tr('schema', 'diagram');
  const VB = () => tr('voorbeeld', 'example');

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
  // s1: three conversations as three layers; identity at the bottom, loudest
  function s1(b, p) {
    const o = { head: [tr('drie gesprekken', 'three conversations'), SCHEMA()] };
    o.three = txt(X0, 74, 'Stone, Patton, Heen, 1999', 'pm-mute');
    const fall = (k) => -30 * (1 - at(b, p, 0, 0.1 + k * 0.2, 0.3 + k * 0.2));
    const show = (k) => at(b, p, 0, 0.1 + k * 0.2, 0.3 + k * 0.2);
    o.what = op(show(0), slab(100, tr('wat er gebeurde', 'what happened'), tr('feiten, wie gelijk heeft', 'facts, who’s right'), 'pm-card', fall(0)));
    o.feel = op(show(1), slab(174, tr('gevoel', 'feelings'), tr('boos, schaamte, gekwetst', 'anger, shame, hurt'), 'pm-card', fall(1)));
    o.ident = op(show(2), slab(248, tr('identiteit', 'identity'), tr('wat zegt dit over mij?', 'what it says about me'), b >= 4 ? 'pm-hot' : 'pm-card', fall(2)));
    if (b >= 4) o.loud = op(span(p, 0.05, 0.3), lines(338, [[tr('onder druk het hardst:', 'loudest under pressure:'), 'pm-txt'], [tr('drang om gelijk te krijgen', 'the urge to be right'), 'pm-on']]));
    return o;
  }

  // s2: prepare on paper: four questions, contribution not blame, the goal
  function s2(b, p) {
    const o = { head: [tr('op papier', 'on paper'), SCHEMA()] };
    o.paper = card(54, 44) + txt(X0 + 4, 83, tr('een kwartier, op papier', 'fifteen minutes, on paper'), 'pm-big');
    if (b >= 1) o.q = op(at(b, p, 1), lines(126, [[tr('wat zag je?', 'what did you see?')], [tr('zijn verhaal?', 'their story?')], [tr('wat voel je?', 'what do you feel?')]]));
    if (b >= 2) o.contrib = op(at(b, p, 2), card(196, 58, b === 2 ? 'pm-hot' : 'pm-card') + txt(X0 + 4, 220, tr('jouw bijdrage', 'your contribution'), b === 2 ? 'pm-on' : 'pm-big') + txt(X0 + 4, 244, tr('wat deed of liet jij?', 'what did you do, or not?')));
    if (b >= 3) {
      o.blame = op(at(b, p, 3), txt(X0, 280, tr('schuld: kijkt terug', 'blame: looks back'), 'pm-mute') + path(`M${X0 - 2} 273H${X0 + 64}`, 'pm-strike')
        + txt(X0, 304, tr('bijdrage: lost het op', 'contribution: fixes it'), 'pm-on'));
    }
    if (b >= 4) {
      o.goal = op(at(b, p, 4), card(318, 66, 'pm-hot') + txt(X0 + 4, 343, tr('doel: één afspraak', 'goal: one agreement'), 'pm-on'));
      o.first = op(at(b, p, 4, 0.35, 0.6), txt(X0 + 4, 369, tr('eerste 2 zinnen, hardop', 'first 2 lines, out loud'), 'pm-txt'));
    }
    return o;
  }

  // s3: the opening: the third story, an example, no long warm-up, small talk, no e-mail
  function s3(b, p) {
    const o = { head: [tr('de opening', 'the opening'), b === 1 ? VB() : SCHEMA()] };
    o.third = card(54, 82, b === 0 ? 'pm-hot' : 'pm-card') + lines(80, [[tr('derde verhaal', 'third story'), b === 0 ? 'pm-on' : 'pm-big'], [tr('zoals een neutrale', 'as a neutral observer')], [tr('buitenstaander het ziet', 'would describe it')]], X0 + 4);
    if (b >= 1) o.quote = op(at(b, p, 1), card(146, 84, 'pm-dash') + lines(170, [[tr('“De stilstanddata: we kijken', '“The downtime data: we see'), 'pm-on'], [tr('er verschillend naar. Hoe', 'it differently. How do'), 'pm-on'], [tr('zie jij het?”', 'you look at it?”'), 'pm-on']], X0 + 4));
    if (b >= 2) o.runup = op(at(b, p, 2), txt(X0, 260, tr('geen lange aanloop', 'no long warm-up'), 'pm-big'));
    if (b >= 3) o.small = op(at(b, p, 3), lines(292, [[tr('smalltalk: hier één zin;', 'small talk: here one line;')], [tr('soms overslaan onbeleefd', 'elsewhere skipping is rude'), 'pm-mute']]));
    if (b >= 4) o.mail = op(at(b, p, 4), card(338, 46, 'pm-hot') + txt(X0 + 4, 368, tr('nooit per mail', 'never by e-mail'), 'pm-on'));
    return o;
  }

  // s4: in the talk: facts and feelings, name emotions, intent versus impact, ask
  function s4(b, p) {
    const o = { head: [tr('in het gesprek', 'in the talk'), b === 3 ? VB() : SCHEMA()] };
    o.sep = card(54, 80) + lines(80, [[tr('feiten en gevoelens', 'facts and feelings'), 'pm-big'], [tr('scheid wat er gebeurde', 'split what happened')], [tr('van wat jij ervan maakte', 'from what you made of it')]], X0 + 4);
    if (b >= 1) o.name = op(at(b, p, 1), lines(162, [[tr('benoem wat je ziet:', 'name what shows:')], [tr('“Je klinkt gefrustreerd.”', '“You sound frustrated.”'), 'pm-on']]));
    if (b >= 2) {
      const half = (X1 - X0 - 8) / 2;
      const box = (x, t1, t2, cls) => rect(x, 212, half, 66, cls, 8) + txt(x + 8, 238, t1, cls === 'pm-hot' ? 'pm-on' : 'pm-big') + txt(x + 8, 264, t2, 'pm-txt');
      o.intent = op(at(b, p, 2), box(X0 - 4, 'impact', tr('ken jij', 'you know'), 'pm-card') + op(at(b, p, 2, 0.35, 0.6), box(X0 + half + 4, tr('bedoeling', 'intent'), tr('vraag ernaar', 'ask about it'), 'pm-hot')));
    }
    if (b >= 3) o.ask = op(at(b, p, 3), card(292, 92, 'pm-dash') + lines(316, [[tr('“Zo bedoelde je het vast', '“You didn’t mean it so,'), 'pm-on'], [tr('niet, maar het werd lastiger.', 'but it made it harder.'), 'pm-on'], [tr('Wat bedoelde je ermee?”', 'What did you mean?”'), 'pm-on']], X0 + 2));
    return o;
  }

  // s5: close with an agreement, the example, confirm, the trap, the question
  function s5(b, p) {
    const o = { head: [tr('de afspraak', 'the agreement'), b === 1 ? VB() : SCHEMA()] };
    o.deal = card(54, 76, b === 0 ? 'pm-hot' : 'pm-card') + lines(80, [[tr('wie doet wat wanneer,', 'who does what by when,'), b === 0 ? 'pm-on' : 'pm-big'], [tr('en hoe check je het?', 'and how you check it')], [tr('zeg het hardop', 'say it out loud'), 'pm-mute']], X0 + 4);
    if (b >= 1) o.dealex = op(at(b, p, 1), card(140, 84, 'pm-dash') + lines(164, [[tr('hij: logboek, donderdag', 'he: the log, Thursday'), 'pm-on'], [tr('ik: ploegen vergelijken', 'I: the shift comparison'), 'pm-on'], [tr('maandag samen kijken', 'Monday: look together'), 'pm-on']], X0 + 4));
    if (b >= 2) o.confirm = op(at(b, p, 2), txt(X0, 252, tr('zelfde dag: 2 zinnen', 'same day: 2 lines'), 'pm-big'));
    if (b >= 3) o.trap = op(at(b, p, 3), lines(282, [[tr('valkuil: warm gevoel,', 'trap: warm feelings,')], [tr('maar geen afspraak', 'but no agreement'), 'pm-mute']]));
    if (b >= 4) o.close = op(at(b, p, 4), card(320, 64, 'pm-hot') + lines(346, [[tr('“Wat doen we vanaf morgen', '“What will each of us do'), 'pm-on'], [tr('allebei anders?”', 'differently from tomorrow?”'), 'pm-on']], X0 + 4));
    return o;
  }

  // s6: Henk's remark, what is at stake, the plan; then the layers prepared
  function s6(b, p) {
    const o = { head: [tr('Henk, week 3', 'Henk, week 3'), VB()] };
    if (b <= 2) {
      o.said = card(54, 102) + lines(80, [[tr('verpakker, ploeg erbij', 'packaging plant, his shift'), 'pm-mute'], [tr('“Deze consultant denkt na', '“This consultant thinks'), 'pm-on'], [tr('twee weken onze lijn', 'he knows our line after'), 'pm-on'], [tr('te kennen.”', 'two weeks.”'), 'pm-on']], X0 + 4);
      if (b >= 1) o.need = op(at(b, p, 1), lines(190, [[tr('analyse vrijdag af', 'analysis due Friday')], [tr('zijn lijndata nodig', 'you need his line data')], [tr('jij: rood, zei niks', 'you: red-faced, silent'), 'pm-mute']]));
      if (b >= 2) o.plan = op(at(b, p, 2), card(270, 70, 'pm-hot') + lines(296, [[tr('20 min, alleen met hem', '20 min, alone with him'), 'pm-on'], [tr('vandaag of morgen', 'today or tomorrow')]], X0 + 4));
      return o;
    }
    const show = (k) => (b > 3 ? 1 : span(p, 0.08 + k * 0.2, 0.22 + k * 0.2));
    o.hwhat = op(show(0), slab(66, tr('feiten', 'facts'), tr('opmerking, geen data', 'the remark, no data')));
    o.hstory = op(show(1), slab(132, tr('zijn verhaal', 'his story'), tr('buitenstaander oordeelt', 'an outsider judging')));
    o.hfeel = op(show(2), slab(198, tr('gevoel', 'feelings'), tr('schaamte, irritatie', 'embarrassed, irritated')));
    o.hident = op(show(3), slab(264, tr('identiteitsval', 'identity trap'), tr('bewijzen dat ik het kan', 'proving I’m competent'), 'pm-hot'));
    if (b >= 4) o.hgoal = op(at(b, p, 4), lines(350, [[tr('doel: data woensdag,', 'goal: data by Wednesday,'), 'pm-on'], [tr('Henk checkt vóór vrijdag', 'Henk checks before Friday'), 'pm-txt']]));
    return o;
  }

  // s7: the talk with Henk: the opening, impact then a question, listen, agree
  function s7(b, p) {
    const o = { head: [tr('het gesprek', 'the talk'), VB()] };
    o.open = card(54, 106, b === 0 ? 'pm-hot' : 'pm-card') + lines(80, [[tr('opening', 'opening'), 'pm-big'], [tr('“Henk, je opmerking van', '“Henk, Monday’s remark'), 'pm-on'], [tr('maandag en de data: ik', 'and the data: I need'), 'pm-on'], [tr('heb je hulp nodig.”', 'your help.”'), 'pm-on']], X0 + 4);
    if (b >= 1) o.impact = op(at(b, p, 1), card(170, 106, b === 1 ? 'pm-hot' : 'pm-card') + lines(196, [[tr('impact, dan een vraag', 'impact, then a question'), 'pm-big'], [tr('“Met de ploeg erbij werd', '“In front of the shift it'), 'pm-on'], [tr('praten lastiger. Wat zit', 'got harder to talk. What’s'), 'pm-on'], [tr('erachter?”', 'behind it?”'), 'pm-on']], X0 + 4));
    if (b >= 2) {
      o.listen = op(at(b, p, 2), txt(X0, 308, tr('luisteren', 'listen'), 'pm-big'));
      o.deal2 = op(at(b, p, 2, 0.4, 0.65), card(326, 56, 'pm-hot') + txt(X0 + 4, 361, tr('dan: de afspraak', 'then: the agreement'), 'pm-on'));
    }
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7];

  // ---------------------------------------------------------------- the sheet on the table
  // the preparation notes (s2 and s6) and the agreement (s5, s7) as lines
  function sheet(si, b, p) {
    let n = 0;
    if (si === 1) n = b + span(p, 0.1, 0.8);
    else if (si === 4) n = b >= 1 ? 3 + (b >= 2 ? 1 : span(p, 0.1, 0.8)) : 0;
    else if (si === 5) n = b < 3 ? 0 : b === 3 ? span(p, 0.1, 0.8) * 4 : 5;
    else if (si === 6) n = b < 2 ? 0 : 5 * span(p, 0.4, 0.9);
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
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
