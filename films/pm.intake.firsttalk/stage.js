// The stage of the film "Het eerste gesprek / The first conversation": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C (the cards' numbers, the speakers'
// heads), CAM (one camera move per scene), W and H. Moves are placed per
// caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the right is drawn
// here each frame; the whiteboard copies its shapes in miniature, and speech
// bubbles hang over whoever speaks, inside the room (so the camera moves them).
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
  const txt = (x, y, t, cls = 'ft-txt', anchor = 'start', size = 20) => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'ft-txt') : '')).join('');
  const strike = (x, y, w) => `<path class="ft-strike" d="M${f1(x - 2)} ${f1(y - 7)}H${f1(x + w)}"/>`;
  const card = (y, h, body, cls = 'ft-card') => rect(X0 - 6, y, X1 - X0 + 12, h, cls, 8) + body;

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
  // a speech bubble over a speaker's head, kept inside the room's half
  function bubble(role, text, a, hot = false) {
    if (a <= 0.01) return '';
    const [hx, hy] = C.HEAD[role];
    const w = Math.min(300, text.length * 10.6 + 24);
    const h = 36;
    const x = clamp(hx - w / 2, 6, 312 - w);
    const y = Math.max(8, hy - 30 - h);
    const tx = clamp(hx, x + 14, x + w - 14);
    const body = `<path class="${hot ? 'ft-bubon' : 'ft-bub'}" d="M${f1(x + 8)} ${f1(y)}H${f1(x + w - 8)}Q${f1(x + w)} ${f1(y)} ${f1(x + w)} ${f1(y + 8)}V${f1(y + h - 8)}Q${f1(x + w)} ${f1(y + h)} ${f1(x + w - 8)} ${f1(y + h)}H${f1(tx + 7)}L${f1(tx)} ${f1(y + h + 12)}L${f1(tx - 7)} ${f1(y + h)}H${f1(x + 8)}Q${f1(x)} ${f1(y + h)} ${f1(x)} ${f1(y + h - 8)}V${f1(y + 8)}Q${f1(x)} ${f1(y)} ${f1(x + 8)} ${f1(y)}Z"/>`
      + txt(x + w / 2, y + 25, text, hot ? 'ft-on' : 'ft-txt', 'middle');
    return op(a, body);
  }

  // ------------------------------------------------------------ the scenes
  // Each returns the contents of the panel's groups (o), the head (title,
  // label) and the bubbles.
  const S = [];
  // s1: three layers, then the dashboard example in them
  S[0] = (b, p, o) => {
    const fadeB = (n) => (b > n ? 1 : b === n ? span(p, 0.05, 0.3) : 0);
    if (b === 0) o.ask = op(span(p, 0.15, 0.4), lines(76, [[tr('de vraag:', 'the ask:'), 'ft-mute'], [tr('“een beter dashboard”', '“a better dashboard”'), 'ft-on'], [tr('een oplossing,', 'a solution,')], [tr('of een symptoom:', 'or a symptom:')], [tr('orders te laat', 'orders are late')]]));
    const lay = [
      ['symptom', 56, tr('symptoom', 'symptom'), [tr('wat ze zien', 'what they see')], [tr('140 van 600 orders', '140 of 600 orders'), tr('> 4 weken, 90 materiaal', 'over 4 weeks, 90 materials')], 2],
      ['problem', 148, tr('probleem', 'problem'), [tr('de oorzaak eronder', 'the cause underneath')], [tr('materiaal niet gekoppeld', 'materials not linked'), tr('aan de planning', 'to the planning')], 3],
      ['goal', 240, tr('doel', 'goal'), [tr('meetbaar anders', 'measurably different')], [tr('geen order > 4 weken', 'no order over 4 weeks'), tr('op materiaal', 'for materials')], 3],
    ];
    for (const [key, y, name, def, ex, at] of lay) {
      const a = fadeB(1);
      if (a <= 0.01) continue;
      const e = b >= at ? span(b > at ? 1 : p, 0.1, 0.4) : 0;
      const body = card(y, 84, txt(X0, y + 26, name, 'ft-lab') + op(1 - e, txt(X0, y + 54, def[0], 'ft-mute')) + op(e, lines(y + 52, [[ex[0]], [ex[1]]])));
      o[key] = op(a, body);
    }
    if (b === 3) o.verdict = op(span(p, 0.2, 0.4), lines(350, [[tr('dashboard: klein onderdeel', 'dashboard: a small part'), 'ft-on'], [tr('hun oplossing: soms verkeerd', 'their solution: maybe wrong'), 'ft-mute']]));
    o.head = [tr('drie lagen', 'three layers'), b >= 2 ? 'ex' : 'dia'];
    o.bub = bubble('teamlead', b === 2 ? tr('Ze lopen vast.', 'They get stuck.') : tr('Een beter dashboard!', 'A better dashboard!'), b <= 2 ? span(p, 0.05, 0.2) : 0, b === 0);
  };
  // s2: questions, the cost of inaction, then the OEE bar
  S[1] = (b, p, o) => {
    const qa = b < 2 ? span(b === 0 ? p : 1, 0.05, 0.3) : b === 2 ? 1 - span(p, 0, 0.15) : 0;
    o.questions = op(qa, lines(72, [[tr('“Waaraan merk je het?”', '“How do you notice it?”')], [tr('“Sinds wanneer?”', '“Since when?”')], [tr('“Wat al geprobeerd?”', '“What have you tried?”')], [tr('“Neem me mee in dinsdag.”', '“Walk me through Tuesday.”')]]));
    if (b === 1 || (b === 2 && p < 0.15)) o.cost = op(b === 1 ? span(p, 0.2, 0.45) : 1 - span(p, 0, 0.15), card(196, 108, txt(X0, 224, tr('kosten van niksdoen', 'cost of inaction'), 'ft-lab') + lines(252, [[tr('per week?', 'per week?')], [tr('na een jaar niks?', 'a year of nothing?')]])));
    if (b >= 2) {
      const a = b === 2 ? span(p, 0.12, 0.35) : 1;
      const x = (pc) => X0 + (pc / 100) * 280;
      let s = txt(X0, 76, 'OEE', 'ft-lab') + txt(X1, 76, tr('goed, volle snelheid', 'good, full speed'), 'ft-mute', 'end');
      s += rect(X0, 112, 280, 34, 'ft-card', 4) + rect(X0, 112, x(C.OEE.now) - X0, 34, 'ft-fill', 4);
      if (b === 3) {
        const g = span(p, 0.15, 0.5);
        for (let i = 0; i < 4; i++) s += op(g, rect(x(C.OEE.now + i * 10.5) + 1, 114, (10.5 / 100) * 280 - 2, 30, 'ft-gap', 2));
      }
      let ticks = '';
      for (const v of [C.OEE.typical, C.OEE.target, C.OEE.world]) ticks += `M${f1(x(v))} 106V152`;
      s += `<path class="ft-line" d="${ticks}"/>`;
      s += txt(x(C.OEE.now) - 4, 102, String(C.OEE.now), 'ft-big', 'end') + txt(x(C.OEE.target), 102, String(C.OEE.target), 'ft-on', 'middle') + txt(x(C.OEE.world) + 4, 102, String(C.OEE.world), 'ft-txt', 'start');
      const L = b === 2
        ? [[tr('KPI: een stuurgetal', 'KPI: a steering number'), 'ft-mute'], [tr('58 nu, doel 75: een wens', '58 now, 75 aim: a wish')], [tr('85 “wereldklasse”:', '85 “world class”:')], [tr('een afspraak, geen norm', 'a convention, not a norm'), 'ft-mute'], [tr('veel fabrieken rond 60', 'many plants about 60'), 'ft-mute']]
        : [[tr('42 punten: waar heen?', '42 points: where to?'), 'ft-on'], [tr('storingen, omstellen,', 'breakdowns, changeovers,')], [tr('langzaam draaien, afkeur', 'slow running, scrap')]];
      s += lines(186, L);
      o.oee = op(a, s);
    }
    o.head = b >= 2 ? [tr('het target', 'the target'), 'dia'] : [tr('eronder komen', 'underneath'), 'ex'];
    o.bub = bubble('jij', b === 0 ? tr('Sinds wanneer?', 'Since when?') : tr('Wat kost het?', 'What does it cost?'), b <= 1 ? span(p, 0.05, 0.2) : 0);
  };
  // s3: the people side, a card per beat
  S[2] = (b, p, o) => {
    const cards = [
      [52, [[tr('“Mag ik eerst zien', '“Can I first see')], [tr('waar het vandaan komt?”', 'where delays come from?”'), 'ft-on']]],
      [128, [[tr('“Al geanalyseerd.”', '“Analysed already.”'), 'ft-mute'], [tr('“Mooi. Laat het zien?”', '“Great. Show me?”'), 'ft-on']]],
      [204, [[tr('nooit overnemen, of al', 'never take it over, or half'), 'ft-mute'], [tr('half gediagnosticeerd?', 'diagnosed already?'), 'ft-mute'], [tr('hypothese: 1 à 2 weken', 'hypothesis: 1–2 weeks'), 'ft-on']]],
      [306, [[tr('proces onbekend? zeg het,', 'new process? say so,')], [tr('letterlijk, voor de doelzin', 'literally, for the goal'), 'ft-on']]],
    ];
    ['see', 'show', 'hypo', 'naive'].forEach((key, i) => { const [y, L] = cards[i]; o[key] = op(i < b ? 1 : i === b ? span(p, 0.08, 0.3) : 0, card(y, L.length * 26 + 16, lines(y + 28, L))); });
    o.head = [tr('de mensenkant', 'the people side'), 'ex'];
    o.bub = bubble('jij', tr('Mag ik eerst zien?', 'Can I see first?'), b === 0 ? span(p, 0.3, 0.45) : 0, true)
      + bubble('teamlead', tr('Al geanalyseerd.', 'Analysed already.'), b === 1 ? span(p, 0.05, 0.2) : 0);
  };
  // s4: the hour as a clock; the hand sweeps the four parts
  const CX = 476;
  const CY = 150;
  const R = 82;
  const pt = (m, r) => [CX + Math.sin((m / 60) * 2 * Math.PI) * r, CY - Math.cos((m / 60) * 2 * Math.PI) * r];
  function clock(minute, hotPart) {
    let s = '';
    let m0 = 0;
    C.HOUR.forEach(([, len], i) => {
      const m1 = m0 + len;
      const [ax, ay] = pt(m0, R);
      const [bx, by] = pt(m1, R);
      s += `<path class="${i === hotPart ? 'ft-hot' : 'ft-card'}" d="M${CX} ${CY}L${f1(ax)} ${f1(ay)}A${R} ${R} 0 ${len > 30 ? 1 : 0} 1 ${f1(bx)} ${f1(by)}Z"/>`;
      m0 = m1;
    });
    for (const m of [0, 5, 40, 50]) { const [x, y] = pt(m, R + 16); s += txt(x, y + 7, String(m), 'ft-mute', 'middle'); }
    const [hx, hy] = pt(minute, R - 12);
    s += `<path class="ft-hand" d="M${CX} ${CY}L${f1(hx)} ${f1(hy)}"/><circle class="ft-dot" cx="${CX}" cy="${CY}" r="5"/>`;
    return s;
  }
  S[3] = (b, p, o) => {
    const minute = b === 0 ? 60 * span(p, 0.2, 0.95) : b === 1 ? 2.5 : 5 + 55 * span(p, 0.1, 0.9);
    let part = 0;
    let acc = 0;
    C.HOUR.forEach(([, len], i) => { if (minute >= acc) part = i; acc += len; });
    if (minute >= 59.9) part = 3;
    o.clock = clock(minute, part);
    const names = NL ? ['0–5 openen', '5–40 verkennen', '40–50 checken', '50–60 afsluiten'] : ['0–5 open', '5–40 explore', '40–50 check', '50–60 close'];
    const ex = NL ? [': je doel', ': verhaal', ': samenvatten', ': de stap'] : [': your aim', ': story', ': summarise', ': next step'];
    o.legend = lines(276, names.map((t, i) => [t + ((b >= 1 && i === 0) || b >= 2 ? ex[i] : ''), i === part ? 'ft-on' : 'ft-txt']));
    o.head = [tr('een uur', 'an hour'), b >= 1 ? 'ex' : 'dia'];
    o.bub = bubble('jij', tr('Vooral luisteren, goed?', 'Mostly listen, okay?'), b === 1 ? span(p, 0.1, 0.25) : 0, true);
  };
  // s5: MORE PIES, letter by letter
  const PIES = NL
    ? [['M', 'Mood', 'sfeer'], ['O', 'Open vragen', 'wat, hoe'], ['R', 'Reflecteren', 'gevoel'], ['E', 'Empathie', 'waarom'], ['P', 'Parafraseren', 'kern'], ['I', 'Inquiry', 'dieper'], ['E', 'Experience', 'kort'], ['S', 'Silence', '3 tellen']]
    : [['M', 'Mood', 'the room'], ['O', 'Open questions', 'how?'], ['R', 'Reflecting', 'feeling'], ['E', 'Empathy', 'why'], ['P', 'Paraphrasing', 'core'], ['I', 'Inquiry', 'deeper'], ['E', 'Experience', 'briefly'], ['S', 'Silence', '3 seconds']];
  S[4] = (b, p, o) => {
    const own = ['pM', 'pO', 'pR', 'pE', 'pP', 'pI', 'pX', 'pS'];
    PIES.forEach(([l, word, gloss], i) => {
      const y = 132 + i * 30;
      const shown = i < 4 ? (b >= 1 ? (b === 1 ? span(p, 0.06 + i * 0.16, 0.2 + i * 0.16) : 1) : 0) : (b >= 2 ? (b === 2 ? span(p, 0.06 + (i - 4) * 0.16, 0.2 + (i - 4) * 0.16) : 1) : 0);
      const body = txt(X0 + 4, y, l, 'ft-let', 'start', 24) + op(shown, txt(X0 + 34, y, word, 'ft-txt') + txt(X1, y, gloss, 'ft-mute', 'end'));
      o[own[i]] = body;
    });
    // the crisis negotiators' own letters differ (Scott Walker's book): the card says so in the last beat
    if (b === 3) o.walker = op(span(p, 0.1, 0.3), lines(64, [[tr('Walker 2023: M aanmoedigen,', 'Walker 2023: M minimal'), 'ft-mute'], [tr('S samenvatten, enz.', 'encouragers, S summarising'), 'ft-mute']]));
    else o.active = txt(X0, 66, 'Rogers, Farson, 1957', 'ft-lab') + txt(X0, 92, tr('crisisonderhandeling', 'crisis negotiation'), 'ft-mute');
    o.head = ['MORE PIES', 'dia'];
    o.bub = bubble('jij', b === 1 ? tr('Dat klinkt frustrerend.', 'That sounds frustrating.') : tr('Dus de kern is…', 'So the core is…'), b === 1 || b === 2 ? span(p, 0.35, 0.5) : 0, true);
  };
  // s6: talk time, the paraphrase and its correction
  S[5] = (b, p, o) => {
    const fill = 280 * 0.75 * (b === 0 ? span(p, 0.1, 0.5) : 1);
    o.talk = txt(X0, 70, tr('klant 70–80%', 'client 70–80%'), 'ft-lab') + txt(X1, 70, tr('jij', 'you'), 'ft-mute', 'end')
      + rect(X0, 80, 280, 30, 'ft-card', 4) + rect(X0, 80, fill, 30, 'ft-fill', 4);
    if (b >= 1) {
      const a = b === 1 ? span(p, 0.1, 0.3) : 1;
      let s = card(136, 92, lines(162, [[tr('jij parafraseert:', 'you paraphrase:'), 'ft-mute'], ['6 × 50 min = 5 uur'.replace('uur', tr('uur', 'hours'))], [tr('omstellen remt volume?', 'changeovers block volume?')]]));
      if (b >= 2) s += op(span(b === 2 ? p : 1, 0.05, 0.2), strike(X0, 214, 250));
      o.para = op(a, s);
    }
    if (b >= 2) o.correction = op(b === 2 ? span(p, 0.08, 0.25) : 1, card(240, 92, lines(266, [[tr('de correctie, goud waard:', 'the correction, gold:'), 'ft-mute'], [tr('“Nee, het reinigen is', '“No, cleaning is the'), 'ft-on'], [tr('het grotere probleem.”', 'bigger problem.”'), 'ft-on']]), 'ft-hot'));
    if (b === 3) o.pause = op(span(p, 0.15, 0.4), txt(X0, 360, tr('na de stilte: de kern', 'after the pause: the point'), 'ft-on'));
    o.head = [tr('spreektijd', 'talk time'), 'ex'];
    o.bub = bubble('jij', tr('Dus vijf uur omstellen?', 'So five hours?'), b === 1 ? span(p, 0.3, 0.45) : 0, true)
      + bubble('sponsor', tr('Nee: het reinigen!', 'No: the cleaning!'), b === 2 ? span(p, 0.02, 0.15) : 0, true);
  };
  // s7: quiet resistance, then the summary on one page
  const SUMMARY = NL
    ? ['1 probleem, hun woorden', '2 drie namen', '3 welke data', '4 succes voor de sponsor', '5 datum volgende stap', '? open vragen']
    : ['1 problem, their words', '2 three names', '3 which data', '4 success for the sponsor', '5 date of the next step', '? open questions'];
  S[6] = (b, p, o) => {
    if (b <= 1 || (b === 2 && p < 0.2)) {
      const out = b === 2 ? 1 - span(p, 0, 0.2) : 1;
      o.resist = op(out * (b === 0 ? span(p, 0.05, 0.3) : 1), lines(72, [[tr('korte antwoorden', 'short answers')], [tr('“staat in het rapport”', '“it’s in the report”')], [tr('telefoon op tafel', 'phone on the table')], [tr('“Hoe ging dat toen?”', '“What happened then?”'), 'ft-on']]));
      if (b >= 1) o.prior = op(out * (b === 1 ? span(p, 0.1, 0.3) : 1), lines(200, [[tr('vorige consultant:', 'previous consultant:'), 'ft-mute'], [tr('slides, niks veranderd', 'slides, nothing changed')], [tr('dat niet herhalen', 'don’t repeat that')], [tr('notitieboek of laptop?', 'notebook or laptop?'), 'ft-on']]));
    }
    let n = 0;
    if (b >= 2) {
      n = b === 2 ? Math.floor(span(p, 0.15, 0.85) * 6.99) : 6;
      const a = b === 2 ? span(p, 0.1, 0.25) : 1;
      let s = rect(X0 - 6, 52, X1 - X0 + 12, 288, 'ft-card', 4) + txt(X1 - 4, 76, tr('binnen 24 uur', 'within 24 hours'), 'ft-on', 'end');
      s += lines(108, SUMMARY.slice(0, n).map((t, i) => [t, i === 5 ? 'ft-on' : 'ft-txt']));
      if (b >= 3) o.followup = op(b === 3 ? span(p, 0.1, 0.35) : 1, `<path class="ft-line" d="M${X0} 270H${X1 - 6}"/>` + lines(296, [[tr('do: de lijn op, 2 ploegleiders', 'Thu: the line, 2 shift leads')], [tr('dezelfde avond verstuurd', 'sent that evening'), 'ft-on']]));
      o.summary = op(a, s);
    }
    if (b === 4) o.closing = op(span(p, 0.1, 0.3), txt(X0, 368, tr('“Over een half jaar: waard?”', '“In six months: worth it?”'), 'ft-on'));
    // the A4 on the table: a rule per line written
    let rules = '';
    for (let i = 0; i < n; i++) rules += `M2.5 ${f1(4 + i * 3.6)}H${f1(18.5 - (i % 3) * 2.5)}`;
    o.mini = rules ? `<path class="ft-line" d="${rules}"/>` : '';
    o.head = [b >= 2 ? tr('één A4', 'one page') : tr('stille weerstand', 'quiet resistance'), b === 2 ? 'dia' : 'ex'];
    o.bub = bubble('sponsor', tr('Staat in het rapport.', 'It’s in the report.'), b === 0 ? span(p, 0.05, 0.2) : 0)
      + bubble('jij', tr('Over een half jaar?', 'In six months?'), b === 4 ? span(p, 0.1, 0.25) : 0, true);
  };
  // s8: under pressure, step by step
  S[7] = (b, p, o) => {
    o.attack = card(52, 84, lines(84, [[tr('“Drie jaar geleden ook.', '“We did this before.')], [tr('Alleen meer formulieren.”', 'We just got more forms.”')]]));
    if (b >= 1) o.rule = op(b === 1 ? span(p, 0.1, 0.35) : 1, lines(166, [[tr('eerst spiegelen,', 'mirror first,'), 'ft-lab'], [tr('dan vragen, dan antwoorden', 'then ask, then answer')]]));
    const row = (y, l, v, cls = 'ft-txt') => txt(X0, y, l, 'ft-lab') + txt(X1, y, v, cls, 'end');
    if (b >= 2) {
      const dots = b === 2 ? Math.floor(span(p, 0.45, 0.95) * 5.99) : 5;
      let d = '';
      for (let i = 0; i < 5; i++) d += `<circle class="${i < dots ? 'ft-dot1' : 'ft-dot'}" cx="${f1(X1 - 6 - (4 - i) * 22)}" cy="252" r="7"/>`;
      o.reflect = op(b === 2 ? span(p, 0.05, 0.25) : 1, row(232, tr('reflecteer', 'reflect'), tr('meer werk', 'more work')) + txt(X0, 258, tr('stilte, 5 s', 'silence, 5 s'), 'ft-lab') + d);
    }
    if (b >= 3) {
      o.openq = op(b === 3 ? span(p, 0.05, 0.25) : 1, row(284, tr('open vraag', 'open question'), tr('wat gebeurde er?', 'what then?'), 'ft-on'));
      o.confirm = op(b === 3 ? span(p, 0.5, 0.7) : 1, row(310, tr('parafraseer', 'paraphrase'), tr('niet gevraagd', 'not asked')));
    }
    if (b >= 4) o.agree = op(b === 4 ? span(p, 0.05, 0.25) : 1, row(336, tr('empathie', 'empathy'), tr('sceptisch', 'sceptical')) + row(362, tr('afspraak', 'agree'), tr('donderdag', 'Thursday'), 'ft-on'));
    o.head = [tr('onder druk', 'under pressure'), 'ex'];
    o.bub = bubble('planner', tr('Meer formulieren!', 'More forms!'), b === 0 ? span(p, 0.1, 0.25) : 0)
      + bubble('jij', b === 2 ? tr('Vooral meer werk.', 'Mostly more work.') : tr('Wat gebeurde er toen?', 'What happened then?'), b === 2 || b === 3 ? span(p, 0.05, 0.2) : 0, true);
  };
  // s9: wait time, real questions, experience as a bridge
  S[8] = (b, p, o) => {
    const grow = b === 0 ? span(p, 0.1, 0.6) : 1;
    let s = txt(X0, 70, tr('wachttijd na een vraag', 'wait after a question'), 'ft-lab');
    s += rect(X0, 82, 60 * grow, 24, 'ft-fill', 3) + op(grow, txt(X0 + 70, 101, tr('1 s: kort antwoord', '1 s: short answer'), 'ft-txt'));
    s += rect(X0, 116, 180 * grow, 24, 'ft-fill', 3) + op(grow, txt(X0 + 190, 135, '3 s+', 'ft-on'));
    s += op(span(b === 0 ? p : 1, 0.55, 0.8), lines(166, [[tr('langer, doordachter', 'longer, better thought out')], [tr('Rowe, jaren zeventig', 'Rowe, 1970s'), 'ft-mute']]));
    o.wait = s;
    if (b >= 1) {
      o.realq = op(b === 1 ? span(p, 0.05, 0.25) : 1, txt(X0, 230, tr('“Wat mis ik?”', '“What am I missing?”'), 'ft-on'))
        + op(b === 1 ? span(p, 0.35, 0.55) : 1, txt(X0, 256, tr('“Waarom?”', '“Why?”'), 'ft-txt') + strike(X0, 256, NL ? 104 : 62) + txt(X0, 282, tr('“Wat maakte dat je…”', '“What made you…”'), 'ft-on'));
    }
    if (b >= 2) o.fake = op(b === 2 ? span(p, 0.05, 0.25) : 1, txt(X0, 308, tr('“Vind je ook niet…?”', '“Don’t you think…?”'), 'ft-txt') + op(span(b === 2 ? p : 1, 0.4, 0.6), strike(X0, 308, NL ? 206 : 192)));
    if (b >= 3) o.bridge = op(b === 3 ? span(p, 0.05, 0.25) : 1, lines(336, [[tr('ervaring: één zin, terug', 'experience: one line, back')], [tr('wat heb ik geleerd?', 'what did I learn?'), 'ft-on']]));
    o.head = [tr('stilte', 'silence'), b === 0 ? 'dia' : 'ex'];
    o.bub = bubble('jij', tr('Wat mis ik?', 'What am I missing?'), b === 1 ? span(p, 0.05, 0.2) : 0, true);
  };

  // the panel's blocks: o[key] goes into the group data-k "t_<key>" (build.mjs, SLOTS)
  const KEYS = Object.fromEntries(C.SLOTS.map((key) => [key, `t_${key}`]));
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = { bub: '', mini: '', head: ['', 'ex'] };
    for (const key of Object.keys(KEYS)) o[key] = '';
    S[si](b, p, o);
    let all = '';
    for (const [key, el] of Object.entries(KEYS)) { set(E[el], o[key]); all += o[key]; }
    const lab = o.head[1] === 'dia' ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    set(E.pHead, txt(X0, 38, o.head[0], 'ft-big') + txt(X1, 38, lab, 'ft-mute', 'end'));
    set(E.bMini, all);
    set(E.sMini, o.mini);
    set(E.bubbles, o.bub);
  }

  return { render };
})();
