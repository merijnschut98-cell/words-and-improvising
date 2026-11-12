// The stage of the film "Feedback, ook naar boven / Feedback, upward too": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and
// a preamble from build.mjs that defines C (the examples' numbers), CAM (one
// camera move per scene), W and H. Moves are placed per caption beat
// (beatStarts on the Dutch captions), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the right gets one
// card per scene, each part in its own cue group; the board in the room
// repeats it in miniature, and the sheet on the table fills in with the notes
// of the talk (the agreement in scene 6, the request in scene 8).
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
  const txt = (x, y, t, cls = 'pm-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="20" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const dot = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  const card = (y, h, cls = 'pm-card') => rect(X0 - 4, y, CW + 8, h, cls, 8);
  // lines of text from y, 24 apart
  const lines = (x, y, list, cls = 'pm-txt') => list.map((t, i) => txt(x, y + i * 24, t, Array.isArray(cls) ? cls[i] : cls)).join('');
  const strike = (x0, x1, y) => path(`M${f1(x0)} ${f1(y)}H${f1(x1)}`, 'pm-strike');

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
  const at = (b, p, k, a = 0.1, c = 0.5) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  const SCHEMA = () => tr('schema', 'diagram');
  const VB = () => tr('voorbeeld', 'example');

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: S, B and I build up as three blocks, then a question; the example fills them
  function s1(b, p) {
    const ex = b >= 3;
    const o = { head: ['SBI', ex ? VB() : SCHEMA()] };
    o.sbi = lines(X0, 72, [tr('van het Center for', 'from the Center for'), 'Creative Leadership'], 'pm-mute');
    const block = (y, L, name, line, exLine, a) => op(a, card(y, 62) + rect(X0 + 2, y + 12, 38, 38, 'pm-hot', 6) + txt(X0 + 21, y + 38, L, 'pm-on', 'middle')
      + txt(X0 + 52, y + 26, name, 'pm-big') + txt(X0 + 52, y + 50, ex ? exLine : line, ex ? 'pm-on' : 'pm-txt'));
    o.sbiS = block(110, 'S', tr('situatie', 'situation'), tr('wanneer en waar', 'when and where'), tr('gisteren, de workshop', 'yesterday’s workshop'), at(b, p, 0, 0.3, 0.5));
    o.sbiB = block(180, 'B', tr('gedrag', 'behaviour'), tr('wat een camera ziet', 'what a camera sees'), tr('2e uur op je telefoon', 'phone, 2nd hour'), at(b, p, 0, 0.5, 0.7));
    o.sbiI = block(250, 'I', 'impact', tr('op jou, team, resultaat', 'on you, team, result'), tr('2 operators zwegen', '2 operators went quiet'), at(b, p, 0, 0.7, 0.9));
    if (b >= 2) o.ask = op(at(b, p, 2, 0.4, 0.7), card(322, 58, 'pm-dash') + txt(X0 + 21, 359, '?', 'pm-on', 'middle') + txt(X0 + 52, 359, ex ? tr('“Wat speelde er?”', '“What was going on?”') : tr('dan: een vraag', 'then: a question'), ex ? 'pm-on' : 'pm-txt'));
    return o;
  }

  // s2: behaviour not a label; one point; the sandwich; timing and praise
  function s2(b, p) {
    const o = { head: [tr('gedrag, geen etiket', 'behaviour, no label'), SCHEMA()] };
    if (b <= 1) {
      o.fact = card(54, 84) + lines(X0 + 8, 82, [tr('“Je onderbrak Ans', '“You interrupted Ans'), tr('twee keer.”', 'twice.”')]) + txt(X1 - 6, 128, 'feedback', 'pm-on', 'end');
      o.label = op(at(b, p, 0, 0.45, 0.7), card(148, 84) + txt(X0 + 8, 178, tr('“Je bent dominant.”', '“You’re dominant.”'), 'pm-mute') + strike(X0 + 6, X0 + 196, 172)
        + txt(X1 - 6, 222, tr('etiket: verdediging', 'a label: defence'), 'pm-txt', 'end'));
      if (b >= 1) {
        o.care = op(span(p, 0.05, 0.3), lines(X0, 262, [tr('impact: zijn doel,', 'impact: their goal,'), tr('team of project', 'team or project')], ['pm-txt', 'pm-txt']));
        o.one = op(span(p, 0.4, 0.65), card(310, 70, 'pm-hot') + txt(X0 + 8, 338, tr('1 punt per gesprek', '1 point per talk'), 'pm-on') + txt(X0 + 8, 364, tr('3 = beoordelingsgesprek', '3 = a performance review'), 'pm-mute'));
      }
      return o;
    }
    if (b === 2) {
      const layer = (y, t, cls, tcls) => rect(X0 + 30, y, CW - 60, 40, cls, 14) + txt(X0 + CW / 2, y + 27, t, tcls, 'middle');
      let s = layer(70, 'compliment', 'pm-card', 'pm-txt') + layer(118, tr('kritiek', 'criticism'), 'pm-hot', 'pm-on') + layer(166, 'compliment', 'pm-card', 'pm-txt');
      const x = span(p, 0.35, 0.6);
      if (x > 0.01) s += op(x, path(`M${X0 + 20} 60L${X1 - 20} 216M${X1 - 20} 60L${X0 + 20} 216`, 'pm-strike'));
      s += op(span(p, 0.1, 0.35), txt(X0, 250, tr('feedbacksandwich', 'feedback sandwich'), 'pm-big'));
      s += op(span(p, 0.45, 0.7), lines(X0, 282, [tr('veel trainers raden af:', 'many trainers advise against:'), tr('schrap bij elk compliment,', 'people brace at each one'), tr('boodschap gemist', 'and miss the message')], ['pm-mute', 'pm-txt', 'pm-txt']));
      o.sandwich = s;
      return o;
    }
    o.timing = card(54, 150) + txt(X0 + 8, 82, 'timing', 'pm-big')
      + lines(X0 + 8, 110, [tr('zo snel als het kan:', 'as soon as you can:'), tr('binnen een dag of twee', 'within a day or two'), tr('onder vier ogen, rustig', 'in private, both calm'), tr('niet vlak voor presenteren', 'not right before he presents')], ['pm-txt', 'pm-txt', 'pm-txt', 'pm-mute']);
    if (b >= 4) {
      o.praise = op(span(p, 0.05, 0.3), card(214, 166) + txt(X0 + 8, 242, tr('positief: net zo, vaker', 'positive: same, more often'), 'pm-big')
        + lines(X0 + 8, 268, [tr('“Dat je opende met de', '“Opening with the outage'), tr('storingscijfers: de ploegen', 'numbers got the crews'), tr('gingen luisteren.” krediet', 'listening.” builds credit')], 'pm-on'))
        + op(span(p, 0.5, 0.75), txt(X0 + 8, 364, tr('vaag: “goed gedaan” = niks', 'vague: “good job” = nothing'), 'pm-mute'));
    }
    return o;
  }

  // s3: upward feedback; receiving it; feedforward
  function s3(b, p) {
    const o = { head: [tr('naar boven', 'upward'), SCHEMA()] };
    if (b <= 2) {
      o.up = card(54, 108) + path(`M${X1 - 26} 146V76M${X1 - 36} 88l10 -12l10 12`, 'pm-line')
        + lines(X0 + 8, 82, [tr('feedback naar boven', 'upward feedback'), tr('hoger in rang of macht', 'above you in rank, power'), tr('“Mag ik iets delen?”', '“Can I share something?”')], ['pm-big', 'pm-txt', 'pm-on']);
      if (b >= 1) o.goal = op(at(b, p, 1, 0.05, 0.3), lines(X0, 196, [tr('het gezamenlijke doel', 'the shared goal'), tr('klein, en “mij viel op”', 'small, and “I noticed”'), tr('dan vragen en luisteren', 'then ask and listen')], ['pm-txt', 'pm-txt', 'pm-on']));
      if (b >= 2) {
        o.land = op(at(b, p, 2, 0.05, 0.3), card(270, 110) + lines(X0 + 8, 296, [tr('ertegenin? vraag wat hij zag', 'pushback? ask what he saw'), tr('landt: “Hm. Terecht.”', 'lands: “Hm. Fair.”'), tr('ander onderwerp: laat rusten', 'new subject: leave it')], ['pm-txt', 'pm-on', 'pm-mute']));
      }
      return o;
    }
    o.receive = card(54, 132) + lines(X0 + 8, 82, [tr('zelf ontvangen', 'receiving it'), tr('dank je, en: een voorbeeld?', 'thanks, and: an example?'), tr('niet verdedigen', 'don’t defend'), tr('later: wat je ermee deed', 'later: what you did')], ['pm-big', 'pm-txt', 'pm-txt', 'pm-txt']);
    if (b >= 4) {
      o.ff = op(span(p, 0.05, 0.3), card(200, 180, 'pm-hot') + lines(X0 + 8, 228, ['feedforward', 'Marshall Goldsmith', tr('vooruit: 1 of 2 tips', 'ahead: 1 or 2 suggestions'), tr('“Wat moet ik volgende', '“What should I do'), tr('sessie anders doen?”', 'differently next time?”'), tr('niet: “Hoe deed ik het?”', 'not: “How did I do?”')],
        ['pm-on', 'pm-mute', 'pm-txt', 'pm-on', 'pm-on', 'pm-mute']));
    }
    return o;
  }

  // s4: the sponsor example in three steps
  function s4(b, p) {
    const o = { head: [tr('na de lunch', 'after lunch'), VB()] };
    const n = b === 0 ? Math.floor(span(p, 0.15, 0.75) * 4.999) : 4;
    let q = '';
    for (let i = 0; i < 4; i++) q += rect(X0 + 186 + i * 24, 112, 18, 18, i < n ? 'pm-bar' : 'pm-dash', 4);
    o.ctx = card(54, 104) + lines(X0 + 8, 80, [tr('voedingsmiddelenbedrijf', 'food manufacturer'), tr('directeur, 55, sponsor', 'ops director, 55, sponsor'), tr('antwoordt zelf', 'answers himself')], ['pm-mute', 'pm-txt', 'pm-txt']) + q
      + op(b === 0 ? span(p, 0.8, 0.95) : 1, txt(X1 - 6, 150, tr('teamleiders zwijgen', 'team leads go quiet'), 'pm-on', 'end'));
    const step = (y, h, nmb, rows, cls) => card(y, h, cls) + txt(X0 + 8, y + 28, nmb, 'pm-big') + lines(X0 + 34, y + 28, rows, ['pm-txt', 'pm-on']);
    if (b >= 1) o.step1 = op(at(b, p, 1, 0.05, 0.3), step(166, 64, '1', [tr('toestemming, zijn doel', 'permission, his goal'), tr('“Mag ik iets delen?”', '“Can I share something?”')]));
    if (b >= 2) o.step2 = op(at(b, p, 2, 0.05, 0.3), step(238, 64, '2', [tr('SBI: 4 vragen zelf', 'SBI: 4 answers himself'), tr('Peter en Sandra stil', 'Peter and Sandra quiet')]));
    if (b >= 3) o.step3 = op(at(b, p, 3, 0.05, 0.3), step(310, 70, '3', [tr('“Hoe zag jij het?”', '“How did you see it?”'), tr('zij eerst, hij vult aan', 'they first, he adds')], 'pm-hot'));
    return o;
  }

  // the three steps as chips, the one in focus hot
  function steps(hot, y) {
    const names = [tr('feiten', 'facts'), tr('oorzaak', 'cause'), tr('afspraak', 'commitment')];
    const keys = ['facts', 'cause', 'deal'];
    const out = {};
    const xs = [X0 - 4, X0 + 74, X0 + 162];
    const ws = [74, 84, 128];
    names.forEach((nm, i) => {
      out[keys[i]] = rect(xs[i], y, ws[i], 36, hot === i ? 'pm-hot' : 'pm-card', 8) + txt(xs[i] + ws[i] / 2, y + 25, nm, hot === i ? 'pm-on' : 'pm-txt', 'middle');
    });
    return out;
  }
  // Mark's four weeks against the 85% target
  function chart(y, show) {
    const base = y + 140;
    const sc = (v) => (v - 60) * 4.6;
    let s = path(`M${X0} ${base}H${X1}`, 'pm-axis');
    C.WEEKS.forEach((v, i) => {
      const x = X0 + 8 + i * 70;
      const a = clamp(show * 4 - i, 0, 1);
      s += op(a, rect(x, base - sc(v), 56, sc(v), i === 3 ? 'sc-red' : 'pm-bar', 3) + txt(x + 28, base - sc(v) + 24, `${v}%`, 'pm-inv', 'middle'));
    });
    const ty = base - sc(C.TARGET);
    s += path(`M${X0} ${f1(ty)}H${X1}`, 'pm-dash') + txt(X1, y - 4, tr('- - doel 85%', '- - target 85%'), 'pm-mute', 'end');
    return s;
  }

  // s5: what a performance conversation is; facts first; Mark's weeks
  function s5(b, p) {
    const ex = b >= 3;
    const o = { head: [tr('prestatiegesprek', 'performance talk'), ex ? VB() : SCHEMA()] };
    if (!ex) {
      o.pg = card(54, 84) + lines(X0 + 8, 82, [tr('kort, vast, over de cijfers', 'short, regular, numbers'), tr('wekelijks, 15–30 min', 'weekly, 15–30 min'), tr('met de eigenaar ervan', 'with whoever owns them')], ['pm-big', 'pm-txt', 'pm-mute']);
      Object.assign(o, steps(b === 2 ? 0 : -1, 154));
      if (b === 1) o.skip = op(span(p, 0.1, 0.4), path(`M${X0 + 36} 198C${X0 + 36} 236 ${X0 + 230} 236 ${X0 + 230} 198`, 'pm-line') + dot(X0 + 36, 214, 7, 'sc-red')
        + lines(X0, 286, [tr('rood cijfer, meteen naar', 'a red number, straight to'), tr('“beter je best doen”', '“try harder”')], ['pm-txt', 'pm-on']) + txt(X0 + 133, 254, tr('overgeslagen', 'skipped'), 'pm-mute', 'middle'));
      if (b === 2) o.facts += op(span(p, 0.1, 0.35), lines(X0, 226, [tr('welk cijfer, doel, periode?', 'which number, target, period?'), tr('echt, of een gewone week?', 'real, or a normal week?'), tr('trend: 6 tot 8 punten', 'trend: 6 to 8 points'), tr('eerst eens over de feiten', 'agree the facts first'), tr('data betwist? eerst de data', 'disputed? fix the data')], ['pm-txt', 'pm-txt', 'pm-on', 'pm-txt', 'pm-mute']));
      return o;
    }
    o.chart = txt(X0, 72, tr('ploegleider Mark, netbeheer', 'crew lead Mark, grid operator'), 'pm-mute') + chart(110, b === 3 ? span(p, 0.1, 0.8) : 1);
    if (b >= 4) o.chart += op(span(p, 0.05, 0.3), card(262, 118) + lines(X0 + 8, 290, [tr('“Dat was het weer.”', '“It was the weather.”'), tr('70% = 28 van 40', '70% = 28 of 40'), tr('normaal: 83 tot 86%', 'normal: 83 to 86%'), tr('dus: bespreken', 'so: worth discussing')], ['pm-mute', 'pm-big', 'pm-txt', 'pm-on']));
    return o;
  }

  // s6: cause (open question, one-off or pattern), commitment, tone, pitfalls
  function s6(b, p) {
    const ex = b === 2 || b === 3;
    const o = { head: [tr('oorzaak, afspraak', 'cause, commitment'), ex ? VB() : SCHEMA()] };
    if (b <= 2) {
      Object.assign(o, steps(1, 54));
      o.open = card(102, 92) + lines(X0 + 8, 128, [tr('open vraag, geen ja/nee:', 'open question, no yes/no:'), tr('“Waar bleven ze hangen?”', '“Where did jobs get stuck?”'), tr('“Wat ging goed?” ga kijken', '“What went well?” go look')], ['pm-mute', 'pm-on', 'pm-txt']);
      if (b >= 1) {
        o.oneoff = op(at(b, p, 1, 0.05, 0.3), card(204, 54) + txt(X0 + 8, 228, tr('eenmalig: een storm', 'one-off: a storm'), 'pm-big') + txt(X0 + 8, 250, tr('komt niet terug', 'won’t come back'), 'pm-mute'));
        o.pattern = op(at(b, p, 1, 0.4, 0.65), card(266, 54) + txt(X0 + 8, 290, tr('patroon: elke maandag', 'pattern: every Monday'), 'pm-big') + txt(X0 + 8, 312, tr('materiaal te laat', 'materials late'), 'pm-mute'));
      }
      if (b === 2) {
        let s = '';
        for (let i = 0; i < 12; i++) s += op(clamp(span(p, 0.05, 0.6) * 12 - i, 0, 1), rect(X0 + i * 23.5, 334, 20, 20, i < 5 ? 'pm-bar' : 'pm-hot', 3));
        o.split = s + op(span(p, 0.5, 0.8), txt(X0, 378, tr('5: accepteer', '5: accept'), 'pm-mute') + txt(X1, 378, tr('7: materiaal', '7: materials'), 'pm-on', 'end'));
      }
      return o;
    }
    Object.assign(o, steps(b === 3 ? 2 : -1, 54));
    if (b === 3) o.deal += op(span(p, 0.05, 0.3), card(102, 150, 'pm-hot') + lines(X0 + 8, 130, [tr('1 of 2 acties: eigenaar,', '1 or 2 actions: owner,'), tr('datum, check of het werkt', 'date, a check it worked'), tr('Mark, elke donderdag:', 'Mark, every Thursday:'), tr('materiaal met magazijn', 'materials, warehouse'), tr('volgende keer: daarmee', 'next time: start there')], ['pm-txt', 'pm-txt', 'pm-on', 'pm-on', 'pm-mute']));
    if (b >= 4) o.tone = op(at(b, p, 4, 0.05, 0.3), card(102, 84) + lines(X0 + 8, 130, [tr('hard op de cijfers,', 'hard on the numbers,'), tr('zacht op de mensen', 'soft on the people'), tr('leren, geen schuld', 'learning, not blame')], ['pm-on', 'pm-on', 'pm-mute']));
    if (b >= 5) o.wrong = op(at(b, p, 5, 0.05, 0.3), lines(X0, 216, [tr('mis: statusrondje,', 'wrong: a status round,'), tr('acties zonder eigenaar,', 'actions without owner,'), tr('leider antwoordt zelf', 'manager answers himself'), tr('eigenaar eerst, leider laatst', 'owner first, manager last')], ['pm-txt', 'pm-txt', 'pm-txt', 'pm-on']));
    if (b >= 6) o.private = op(at(b, p, 6, 0.05, 0.3), lines(X0, 322, [tr('bord open; persoon: apart', 'board open; person: private')], 'pm-mute') + txt(X0, 352, tr('“Wat spraken we af,', '“What did we agree,'), 'pm-on') + txt(X0, 376, tr('en werkte het?”', 'and did it work?”'), 'pm-on'));
    return o;
  }

  // fact, view, request as three rows; texts per scene
  function fvv(y, rows, show) {
    const keys = ['fact', 'view', 'req'];
    const names = [tr('feit', 'fact'), tr('visie', 'view'), tr('verzoek', 'request')];
    const out = {};
    rows.forEach((r, i) => {
      out[keys[i]] = op(clamp(show * 3 - i, 0, 1), card(y + i * 62, 54, i === 2 ? 'pm-hot' : 'pm-card') + txt(X0 + 8, y + i * 62 + 34, names[i], 'pm-big') + txt(X0 + 100, y + i * 62 + 34, r, i === 2 ? 'pm-on' : 'pm-txt'));
    });
    return out;
  }

  // s7: why disagree; psychological safety; fact-view-request; the setting
  function s7(b, p) {
    const o = { head: [tr('feit, visie, verzoek', 'fact, view, request'), SCHEMA()] };
    if (b <= 1) {
      o.why = lines(X0, 78, [tr('oneens met wie hoger staat:', 'disagreeing upwards:'), tr('daar betalen ze je voor,', 'what clients pay you for,'), tr('niet hun eigen mening', 'not their own opinion')], ['pm-mute', 'pm-txt', 'pm-txt']);
      if (b >= 1) o.ps = op(span(p, 0.05, 0.3), card(164, 166, 'pm-hot') + lines(X0 + 8, 192, [tr('psychologische veiligheid', 'psychological safety'), 'Amy Edmondson, 1999', tr('veilig om je uit te spreken,', 'safe to speak up,'), tr('te vragen, oneens te zijn', 'to ask and to disagree'), tr('meer ervan: team leert meer', 'more of it: teams learn more'), tr('jij: zelf goed doen', 'you: speak up well')], ['pm-on', 'pm-mute', 'pm-txt', 'pm-txt', 'pm-on', 'pm-mute']));
      return o;
    }
    if (b === 2) {
      o.fvv = txt(X0, 74, tr('feit-visie-verzoek: apart', 'fact-view-request: apart'), 'pm-big');
      Object.assign(o, fvv(92, [tr('data 12 weken: X', 'data, 12 weeks: X'), tr('ik denk: Y', 'I think: Y'), tr('eerst Z checken', 'check Z first')], span(p, 0.15, 0.75)));
      o.fvv += op(span(p, 0.75, 0.95), txt(X0, 302, tr('verzoek = volgende stap', 'request = next step'), 'pm-on'));
      return o;
    }
    o.setting = card(54, 104) + lines(X0 + 8, 82, [tr('groot verschil:', 'big disagreement:'), tr('eerst één-op-één', 'one-on-one first'), tr('niet voor zijn team', 'not in front of his team')], ['pm-mute', 'pm-on', 'pm-txt'])
      + op(span(p, 0.35, 0.6), lines(X0, 196, [tr('in overleg: een vraag,', 'in a meeting: a question,'), tr('geen oordeel:', 'not a verdict:'), tr('“Mag ik één ding uit', '“Can I add one thing'), tr('de data toevoegen?”', 'from the data?”')], ['pm-txt', 'pm-txt', 'pm-on', 'pm-on']))
      + op(span(p, 0.65, 0.9), txt(X0, 312, tr('stem laag, tempo rustig:', 'voice low, pace slow:'), 'pm-txt') + txt(X0, 336, tr('kalm oogt zeker', 'calm reads as confident'), 'pm-mute'));
    return o;
  }

  // s8: the steering group example
  function s8(b, p) {
    const o = { head: [tr('de stuurgroep', 'steering group'), VB()] };
    o.claim = card(54, 84) + lines(X0 + 8, 80, [tr('COO: “operators volgen de', 'COO: “operators don’t'), tr('planning niet: bonus erop”', 'follow it: a bonus on it”'), tr('onderdelenfabrikant', 'parts manufacturer')], ['pm-txt', 'pm-txt', 'pm-mute']);
    if (b === 1 || b === 2) {
      const show = b === 1 ? span(p, 0.2, 0.8) : 1;
      let s = txt(X0, 166, tr('120 te laat, 12 weken', '120 late, 12 weeks'), 'pm-mute');
      for (let i = 0; i < 10; i++) {
        const a = clamp(show * 10 - i, 0, 1);
        s += op(a, rect(X0 + i * 28.4, 178, 24, 24, i < 7 ? 'pm-hot' : 'pm-bar', 3));
      }
      s += op(show, txt(X0, 226, tr('84 door materiaal', '84 from materials'), 'pm-on') + txt(X1, 226, '70%', 'pm-big', 'end'));
      if (b === 1) s += op(span(p, 0.5, 0.8), txt(X0, 268, tr('jij, de jongste: “Mag ik', 'you, the youngest: “Can I'), 'pm-txt') + txt(X0, 292, tr('één ding toevoegen?”', 'add one thing?”'), 'pm-on'));
      o.data = s;
    }
    if (b >= 2) {
      const rows = [tr('84 van 120, 70%', '84 of 120, 70%'), tr('misschien weinig', 'may not help'), tr('eerst materiaal', 'materials first')];
      const r = fvv(b === 2 ? 244 : 150, rows, b === 2 ? Math.min(span(p, 0.2, 0.8) * 3, 2) / 3 : 1);
      o.fact = r.fact;
      o.view = r.view;
      if (b >= 3) {
        o.req = r.req;
        o.after = op(span(p, 0.45, 0.7), lines(X0, 352, [tr('blijft hij erbij? een kwartier', 'he holds? 15 minutes,'), tr('na afloop, niet in de kamer', 'afterwards, not in the room')], ['pm-txt', 'pm-mute']));
      }
    }
    return o;
  }

  // s9: stop, disagree and commit, the escalation path, failure modes, origin
  function s9(b, p) {
    const o = { head: [tr('wanneer je stopt', 'when to stop'), SCHEMA()] };
    if (b <= 2) {
      o.once = lines(X0, 76, [tr('één keer duidelijk;', 'once, clearly;'), tr('tweede keer: alleen met', 'a second time: only with'), tr('nieuwe informatie', 'new information')], ['pm-on', 'pm-txt', 'pm-txt']);
      if (b >= 1) o.dc = op(at(b, p, 1, 0.05, 0.3), card(146, 110) + lines(X0 + 8, 174, ['disagree and commit', tr('geen veiligheid, integriteit:', 'not safety or integrity:'), tr('volledig uitvoeren,', 'carry it out fully,'), tr('noteer je advies', 'note your advice')], ['pm-big', 'pm-mute', 'pm-txt', 'pm-txt']));
      if (b >= 2) o.esc = op(at(b, p, 2, 0.05, 0.3), card(266, 112, 'pm-hot') + lines(X0 + 8, 294, [tr('escalatiepad', 'escalation path'), tr('wel veiligheid, integriteit:', 'safety or integrity:'), tr('open, één niveau hoger', 'openly, one level up'), tr('eerst tegen hem zelf', 'tell the person first')], ['pm-on', 'pm-mute', 'pm-txt', 'pm-txt']));
      return o;
    }
    o.traps = card(54, 134) + lines(X0 + 8, 82, [tr('de hoogste praat eerst,', 'the most senior speaks,'), tr('de kamer volgt', 'the room lines up'), tr('valkuil: te zacht hinten', 'trap: hinting too softly'), tr('in het openbaar winnen', 'winning in public'), tr('achter zijn rug om', 'behind their back')], ['pm-mute', 'pm-mute', 'pm-txt', 'pm-txt', 'pm-txt']);
    if (b >= 4) o.origin = op(at(b, p, 4, 0.05, 0.3), lines(X0, 222, [tr('Intel, vermoedelijk;', 'Intel, probably;'), 'Jeff Bezos (Amazon)', tr('critici: kan monddood maken;', 'critics: it can silence;'), tr('werkt als bezwaar gehoord is', 'works if truly heard first')], ['pm-txt', 'pm-txt', 'pm-mute', 'pm-on']));
    if (b >= 5) o.sharp = op(at(b, p, 5, 0.05, 0.3), card(304, 78, 'pm-hot') + lines(X0 + 8, 328, [tr('“Wat zou je moeten zien', '“What would you need'), tr('om van gedachten te', 'to see to change'), tr('veranderen?”', 'your mind?”')], 'pm-on'));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the room's paper
  // the sheet on the table: the agreement in s6 (beat 4 on), the request in s8
  function sheet(si, b, p) {
    let n = 0;
    if (si === 5) n = b < 3 ? 0 : b === 3 ? span(p, 0.1, 0.8) * 4 : 4;
    else if (si === 7) n = b < 3 ? 0 : span(p, 0.1, 0.8) * 3;
    let s = '';
    for (let i = 0; i < 4; i++) {
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
    set(E.pBody, '');
    let mini = '';
    for (const c of C.CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.dLines, sheet(si, b, p));
  }

  return { render };
})();
