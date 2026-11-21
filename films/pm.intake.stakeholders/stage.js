// The stage of the film "De stakeholderkaart komt tot leven / The stakeholder
// map comes alive": a pure function of (scene, u). Inlined into the page after
// the anatomy kit and a preamble from build.mjs that defines C (the panel
// layout), CAM (one camera move per scene), W and H. Moves are placed per
// caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the right is drawn
// here each frame, part by part into its cue group (data-k = the cue key); the
// board in the room and the A4 on the table get the same drawing, in miniature.
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
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const txt = (x, y, t, cls = 'pm-txt', anchor = 'start', extra = '') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="20" text-anchor="${anchor}"${extra}>${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = C.PX + 12;
  const X1 = C.PX + C.PW - 12;
  // a label in a rounded pill, centred on (x, y); width from the text
  const textW = (t) => t.length * 10.6;
  const pill = (x, y, t, cls = '') => { const w = textW(t) + 20; return rect(x - w / 2, y - 14, w, 28, `pm-pill${cls ? ` ${cls}` : ''}`, 14) + txt(x, y + 7, t, 'pm-txt', 'middle'); };
  // lines of text from y, 26 apart: [text, class]
  const lines = (y, list) => list.map(([t, cls], i) => (t ? txt(X0, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  const arrowD = (x0, y0, x1, y1, hs = 7) => {
    const a = Math.atan2(y1 - y0, x1 - x0);
    const p = (s) => `${f1(x1 - hs * Math.cos(a + s))} ${f1(y1 - hs * Math.sin(a + s))}`;
    return `M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}M${p(0.5)}L${f1(x1)} ${f1(y1)}L${p(-0.5)}`;
  };

  // the map: interest (or stance) to the right, influence up
  // (the stance map of s7 is lower, so five card lines fit under it)
  const M1 = { x0: 358, x1: 614, y0: 58, y1: 262, lab: 288 };
  const M2 = { x0: 358, x1: 614, y0: 52, y1: 206, lab: 230 };
  let M = M1;
  const mx = (u) => M.x0 + u * (M.x1 - M.x0);
  const my = (v) => M.y1 - v * (M.y1 - M.y0);
  const XM = mx(0.5);
  function mapSvg(stance) {
    const YM = my(0.5);
    let s = `<path class="pm-grid" d="M${f1(XM)} ${M.y0}V${M.y1}M${M.x0} ${f1(YM)}H${M.x1}"/>`;
    s += `<path class="pm-axis" d="${arrowD(M.x0, M.y1, M.x0, M.y0 - 6)}${arrowD(M.x0, M.y1, M.x1 + 6, M.y1)}"/>`;
    s += txt(346, YM, tr('invloed', 'influence'), 'pm-txt', 'middle', ` transform="rotate(-90 346 ${f1(YM)})"`);
    if (stance) s += txt(M.x0, M.lab, tr('tegen', 'against'), 'pm-mute') + txt(XM, M.lab, tr('houding', 'stance'), 'pm-txt', 'middle') + txt(M.x1, M.lab, tr('voor', 'for'), 'pm-mute', 'end');
    else s += txt(M.x1, M.lab, tr('belang', 'interest'), 'pm-txt', 'end');
    return s;
  }
  const quad = (u0, v0) => rect(mx(u0) + 2, my(v0 + 0.5) + 2, (M.x1 - M.x0) / 2 - 4, (M.y1 - M.y0) / 2 - 4, 'pm-quad', 4);
  const tok = (u, v, t, cls) => pill(mx(u), my(v), t, cls);

  // beats by the page's language, as the player's captions and focus; in the
  // video by the Dutch fractions, which films/_kit/beatwarp.js maps to
  const beatLang = () => (NL || document.documentElement.dataset.render === '1' ? 'nl' : 'en');
  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, beatLang()).map((x) => x / sc.dur);
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

  const KEYS = ['roles', 'rSponsor', 'rOwner', 'rUsers', 'rBlock', 'map', 'qWeekly', 'qSatisfy', 'qInform', 'tSponsor', 'tOwner', 'tUsers', 'tIT', 'tLeads',
    'asks', 'note', 'or', 'signs', 'escal', 'chart', 'tPower', 'private', 'cur', 'give', 'cred', 'smap', 'tAns', 'tExec', 'tPlanning', 'tReserve', 'oneone',
    'raci', 'rR', 'rA', 'rC', 'rI', 'blk2', 'owner', 'deals', 'clash', 'vars', 'phone'];

  // ---------------------------------------------------------- the scenes
  // Each returns { tag: true for an example, false for a diagram; parts: key → svg; doc: 0..1 }
  function s1(b, p) {
    const o = {};
    const row = (y, label, vals, a) => op(a, txt(X0, y, label, 'pm-big') + vals.map(([v, cls], i) => txt(X0 + 14, y + 24 * (i + 1), v, cls || 'pm-txt')).join(''));
    o.rSponsor = row(70, 'sponsor', [[tr('directeur aansluitingen', 'director of connections')]], b === 0 ? 0 : 1);
    o.rOwner = row(126, tr('proceseigenaar', 'process owner'), [[tr('hoofd werkvoorbereiding', 'head of work preparation')], [tr('zet vergunningen, materiaal', 'readies permits, materials'), 'pm-mute'], [tr('en ploegen klaar', 'and crews'), 'pm-mute']], b < 2 ? 0 : 1);
    o.rUsers = row(230, tr('gebruikers', 'users'), [[tr('12 werkvoorbereiders', '12 work planners')], [tr('40 monteurs', '40 technicians')]], b < 2 ? 0 : span(p, 0.4, 0.7));
    o.rBlock = row(310, tr('blokkeerders', 'blockers'), [[tr('IT, OR, een ploegleider', 'IT, council, a shift lead')]], b < 3 ? 0 : 1);
    if (b === 0) o.roles = lines(74, [[tr('aansluitingen sneller:', 'faster connections:'), 'pm-big'], [tr('weken van aanvraag', 'weeks from request')], [tr('tot werkende aansluiting', 'to working connection')], [''], [tr('wie doet ertoe?', 'who matters?'), 'pm-on']]);
    if (b === 3) o.text = op(span(p, 0.4, 0.6), txt(X0, 372, tr('één persoon, twee rollen', 'one person, two roles'), 'pm-on'));
    return { tag: true, parts: o };
  }
  // the stakeholder map of the intake example; leads join in beat 3 of s2
  function intakeMap(st) {
    const o = {};
    o.map = mapSvg(false);
    o.qWeekly = quad(0.5, 0.5);
    o.qSatisfy = quad(0, 0.5);
    o.qInform = quad(0.5, 0);
    o.tSponsor = op(st.tok[0], tok(0.75, 0.87, 'sponsor'));
    o.tOwner = op(st.tok[1], tok(0.75, 0.59, tr('proces', 'process')));
    o.tIT = op(st.tok[2], tok(0.22, 0.75, 'IT'));
    o.tUsers = op(st.tok[3], tok(lerp(0.73, 0.68, st.users), lerp(0.22, 0.4, st.users), tr('gebruikers', 'users')));
    if (st.leads > 0.01) o.tLeads = op(st.leads, tok(0.75, lerp(1.1, 0.73, st.leads), tr('teamleiders', 'team leads'), 'pm-new'));
    return o;
  }
  function s2(b, p) {
    const st = { tok: [1, 1, 1, 1], leads: 0, users: 0 };
    if (b === 0) st.tok = [0, 1, 2, 3].map((i) => span(p, 0.35 + i * 0.12, 0.47 + i * 0.12));
    if (b >= 2) st.leads = b === 2 ? span(p, 0.15, 0.45) : 1;
    if (b === 3) st.users = span(p, 0.4, 0.8);
    const o = intakeMap(st);
    if (b === 0) o.text = lines(318, [['Mendelow, 1981', 'pm-mute'], [tr('vaak aangehaald: 1991', 'often cited: 1991'), 'pm-mute']]);
    if (b === 1) o.text = lines(318, [[tr('allebei hoog: wekelijks', 'both high: weekly'), 'pm-on'], [tr('invloed: tevreden houden', 'influence: keep satisfied')], [tr('belang: informeren', 'interest: keep informed')]]);
    if (b === 2) o.text = lines(318, [[tr('IT, teamleiders: stil', 'IT, team leads: quiet')], [tr('week 1: 3 één-op-ééntjes', 'week 1: 3 one-on-ones'), 'pm-on']]);
    if (b === 3) o.text = lines(318, [[tr('een kwartier, op papier', '15 minutes, on paper')], [tr('elke maand bijwerken', 'update it monthly'), 'pm-on']]);
    return { tag: true, parts: o, doc: b === 3 ? span(p, 0.1, 0.5) : 0 };
  }
  function s3(b, p) {
    const o = intakeMap({ tok: [1, 1, 1, 1], leads: 1, users: 1 });
    if (b <= 1) o.asks = lines(318, [[tr('wie beslist?', 'who decides?'), b === 0 ? '' : 'pm-mute'], [tr('wie kan het stoppen?', 'who could stop it?'), b === 1 ? 'pm-on' : ''], [tr('wie deed dit al eens?', 'who has done this?'), b === 0 ? '' : 'pm-mute']].map((l, i) => (b > 0 || span(p, 0.08 + i * 0.25, 0.2 + i * 0.25) > 0.5 ? l : [''])));
    if (b === 1) o.asks += op(span(p, 0.3, 0.5), pill(590, 338, tr('naam', 'name'), 'pm-new'));
    if (b === 2) o.note = lines(318, [[tr('ploegen 30% van de tijd', 'crews 30% of the time'), 'pm-on'], [tr('naar storingen', 'pulled to faults')], [tr('cruciale data', 'key data'), 'pm-mute']]);
    if (b === 3) o.or = lines(318, [[tr('OR: instemmingsrecht', 'works council: consent'), 'pm-on'], [tr('WOR art. 27: werktijden,', 'WOR art. 27: working'), ''], [tr('zoals ploegenroosters', 'times, shift patterns')]]);
    return { tag: true, parts: o, doc: 1 };
  }
  function s4(b, p) {
    const o = {};
    o.signs = lines(74, [[tr('gemiste afspraken', 'missed meetings')], [tr('niemand vrijgemaakt', 'nobody freed up')], [tr('“bespreken in het MT”', '“discuss it in the MT”')]].map((l, i) => (b > 0 || span(p, 0.1 + i * 0.2, 0.2 + i * 0.2) > 0.5 ? l : [''])));
    if (b >= 1) {
      let e = rect(X0, 262, X1 - X0, 40, 'pm-box', 8) + txt(X0 + 12, 289, tr('1  eerst zelf langs', '1  go and ask first'), 'pm-txt');
      const a2 = b === 2 ? span(p, 0.1, 0.4) : 0;
      if (a2 > 0.01) e += op(a2, `<path class="pm-arrow" d="${arrowD(XM, 258, XM, 214, 9)}"/>` + rect(X0, 170, X1 - X0, 40, 'pm-box', 8) + txt(X0 + 12, 197, tr('2  de sponsor', '2  the sponsor'), 'pm-big'));
      o.escal = e;
      o.text = b === 1 ? lines(342, [[tr('wat werkt voor jouw team?', 'what works for your team?'), 'pm-on']]) : op(span(p, 0.4, 0.6), lines(330, [[tr('pas als het echt vastzit', 'only when truly blocked')], [tr('en zeg het vooraf', 'and say so beforehand'), 'pm-on']]));
    }
    return { tag: false, parts: o };
  }
  function s5(b, p) {
    const o = {};
    if (b === 0) {
      // the org chart: a director over two heads over four teams; the real power beside it
      let c = '<path class="pm-axis" d="M440 98V112M386 112H494M386 112V124M494 112V124"/>';
      c += rect(386, 66, 108, 32, 'pm-box', 6) + txt(440, 89, tr('directie', 'director'), 'pm-txt', 'middle');
      c += rect(340, 124, 92, 32, 'pm-box', 6) + txt(386, 147, tr('hoofd', 'head'), 'pm-txt', 'middle');
      c += rect(448, 124, 92, 32, 'pm-box', 6) + txt(494, 147, tr('hoofd', 'head'), 'pm-txt', 'middle');
      o.chart = c;
      const a = span(p, 0.35, 0.6);
      o.tPower = op(a, '<path class="pm-link" d="M570 208L432 156M570 208L540 152M570 208L494 98M470 262L432 156"/>' + pill(570, 208, 'planner', 'pm-new') + pill(470, 262, tr('vakbond', 'union rep'), 'pm-new'));
      o.text = lines(318, [[tr('niet het organogram:', 'not the org chart:')], [tr('wie vraagt iedereen?', 'whom does everyone ask?'), 'pm-on']]);
    } else {
      // two sheets: the neutral map for the team, your own notes private
      const sheet = (x, t, notes) => {
        let s = rect(x, 70, 128, 120, 'pm-sheet', 4) + `<path class="pm-grid" d="M${x + 64} 80V180M${x + 10} 130H${x + 118}"/>`;
        s += `<circle class="pm-pill" cx="${x + 92}" cy="100" r="7"/><circle class="pm-pill" cx="${x + 36}" cy="108" r="7"/><circle class="pm-pill" cx="${x + 96}" cy="158" r="7"/>`;
        if (notes) s += `<path class="pm-axis" d="M${x + 14} 172H${x + 50}M${x + 74} 116H${x + 116}"/>`;
        return s + txt(x + 64, 214, t, 'pm-txt', 'middle');
      };
      o.private = sheet(X0 + 2, tr('team: neutraal', 'team: neutral')) + op(span(b === 1 ? p : 1, 0.3, 0.5), sheet(X1 - 130, tr('jij: privé', 'you: private'), true));
      if (b === 1) o.text = op(span(p, 0.25, 0.4), lines(268, [[tr('“weinig steun” op een', '“low support” on a')], [tr('dia doet schade', 'slide does damage'), 'pm-on'], [tr('experts verschillen', 'experts argue'), 'pm-mute']]));
      if (b === 2) o.text = lines(268, [[tr('aan de sponsor:', 'for the sponsor:')], [tr('wiens steun missen we?', 'whose support is missing?'), 'pm-on']]);
    }
    return { tag: false, parts: o };
  }
  function s6(b, p) {
    const o = {};
    const list = (head, items, foot, a = 1) => op(a, txt(X0, 74, head, 'pm-big') + items.map((t, i) => txt(X0 + 14, 102 + i * 28, t, 'pm-txt')).join('') + (foot || []).map((t, i) => txt(X0, 318 + i * 26, t, 'pm-mute')).join(''));
    if (b === 0) o.cur = list(tr('valuta', 'currencies'), [tr('hulp', 'help'), tr('informatie', 'information'), tr('zichtbaarheid', 'visibility'), tr('tijdwinst', 'time saved'), tr('een probleem minder', 'a problem off the plate')].map((t, i) => (span(p, 0.4 + i * 0.1, 0.48 + i * 0.1) > 0.5 ? t : '')), [tr('Cohen en Bradford, 1990', 'Cohen and Bradford, 1990'), tr('belangen: afgerekend op,', 'interests: judged on,'), tr('wakker van, wil voorkomen', 'kept awake by, avoiding')], 1);
    if (b === 1) o.give = list(tr('eerst geven', 'give first'), [tr('de data die hij wil', 'the data they want'), tr('een rapport repareren', 'fix a report'), tr('bevinding vooraf tonen', 'show a finding first')], [tr('wederkerigheid:', 'reciprocity:'), tr('Cialdini, 1984', 'Cialdini, 1984')])
      + txt(X0, 370, tr('gemeend? geen manipulatie', 'genuine? not manipulation'), 'pm-on');
    if (b >= 2) {
      const ticks = [tr('cijfers kloppen', 'numbers right'), tr('doen wat je zei', 'do what you said'), tr('op de vloer staan', 'be on the floor')];
      let c = txt(X0, 74, tr('geloofwaardig', 'credibility'), 'pm-big');
      ticks.forEach((t, i) => { const y = 102 + i * 30; c += rect(X0 + 2, y - 15, 18, 18, 'pm-letter', 4) + `<path class="pm-axis" d="M${X0 + 6} ${y - 6}L${X0 + 10} ${y - 2}L${X0 + 17} ${y - 11}"/>` + txt(X0 + 30, y, t, 'pm-txt'); });
      if (b === 2) c += op(span(p, 0.3, 0.45), txt(X0, 210, tr('1 observatie > 10 dia’s', '1 observation > 10 slides'), 'pm-on'));
      if (b === 3) c += lines(226, [[tr('“Interessant, we zien wel.”', '“Interesting, let’s see.”'), 'pm-on'], [tr('1 fout getal in week 2:', '1 wrong number in week 2:')], [tr('elk getal dubbel gecheckt', 'every number checked twice')]].map((l, i) => (span(p, 0.08 + i * 0.12, 0.16 + i * 0.12) > 0.5 ? l : [''])));
      o.cred = c;
    }
    return { tag: false, parts: o };
  }
  function s7(b, p) {
    const o = {};
    M = M2;
    o.smap = mapSvg(true);
    M = M1;
    const ans = b < 1 ? 0 : b === 1 ? span(p, 0.45, 0.85) : 1;
    const exec = b < 2 ? 0 : b === 2 ? span(p, 0.45, 0.85) : 1;
    const t2 = (u, v, t, cls) => { M = M2; const r = tok(u, v, t, cls); M = M1; return r; };
    o.tAns = t2(lerp(0.5, 0.82, ans), 0.66, 'Ans', ans > 0.5 ? 'pm-new' : '');
    o.tExec = t2(lerp(0.17, 0.58, exec), 0.89, tr('uitvoering', 'execution'), exec > 0.5 ? 'pm-new' : '');
    o.tPlanning = t2(0.82, 0.18, 'planning');
    o.tReserve = op(b >= 3 ? 1 : b === 0 ? 0 : 0.6, t2(0.86, 0.42, 'sponsor', 'pm-res'));
    const L = (list, y = 266) => lines(y, list);
    if (b === 0) o.text = L([[tr('week 4: minder klussen', 'week 4: fewer jobs')], [tr('in de week zelf afgezegd', 'cancelled in the week')], [tr('dinsdag: gereedheidscheck', 'Tuesday: readiness check'), 'pm-on'], [tr('vergunningen, materiaal,', 'permits, material, access')], [tr('toegang, vóór vertrek', 'confirmed before crews go')]]);
    if (b === 1) o.text = L([[tr('Ans: 25 jaar, neutraal', 'Ans: 25 years, neutral')], [tr('iedereen belt haar', 'everyone asks her')], [tr('vaak een gerespecteerde', 'often a respected'), 'pm-mute'], [tr('ploegleider, niet de top', 'shift lead, not the top'), 'pm-mute'], [tr('haar verbetering erin', 'her improvement adopted'), 'pm-on']]);
    if (b === 2) o.text = L([[tr('uitvoering: sceptisch', 'execution: sceptical')], [tr('de ploegen respecteren hem', 'the crews respect him')], [tr('minder ritten voor niks', 'fewer wasted crew trips'), 'pm-on'], [tr('“wat moet erin zitten?”', '“what has to be in it?”')]]);
    if (b === 3) o.text = L([[tr('sponsor: de regiomanager', 'sponsor: regional manager')], [tr('achter de hand:', 'in reserve:')], [tr('elke inzet kost krediet', 'each call spends goodwill')], [tr('dinsdag legt Ans uit', 'Tuesday: Ans explains'), 'pm-on']]);
    if (b === 4) o.oneone = L([[tr('eerst één op één', 'one-on-one first'), 'pm-on'], [tr('“met wie eerst?”', '“whom first?”')], [tr('“rapport voor 2 ochtenden?”', '“report for two mornings?”')], [tr('meesten: het midden eerst', 'most: middle first'), 'pm-mute'], [tr('wat levert ja op?', 'what is in a yes?')]]);
    return { tag: true, parts: o };
  }
  function s8(b, p) {
    const o = {};
    const row = (y, L, name, a) => op(a, rect(X0 + 2, y - 19, 26, 26, 'pm-letter', 5) + txt(X0 + 15, y + 1, L, 'pm-big', 'middle') + txt(X0 + 40, y, name, 'pm-txt'));
    const head = txt(X0, 74, tr('planningsoverleg', 'weekly planning meeting'), 'pm-big');
    const show = (i) => (b === 0 ? span(p, 0.35 + i * 0.12, 0.45 + i * 0.12) : 1);
    o.raci = op(b === 0 ? span(p, 0.2, 0.35) : 1, head);
    o.rR = row(106, 'R', 'planner', show(0));
    o.rA = row(138, 'A', tr('hoofd productie', 'operations manager'), show(1));
    o.rC = row(170, 'C', tr('ploegleiders, verkoop', 'shift leads, sales'), show(2));
    o.rI = row(202, 'I', tr('fabrieksdirecteur', 'plant manager'), show(3));
    if (b === 2) o.text = op(span(p, 0.2, 0.35), lines(250, [[tr('2× A: geen eigenaar', 'two As: no owner'), 'pm-on'], [tr('10× C: trage besluiten', 'ten Cs: slow decisions')]]));
    if (b >= 3) {
      o.blk2 = op(b === 3 ? span(p, 0.1, 0.4) : 1, txt(X0, 248, tr('capaciteitsmodel', 'capacity model'), 'pm-big') + row(280, 'R', tr('jij', 'you'), 1) + row(312, 'A', 'planner', 1) + (b === 3 ? txt(X0, 346, tr('uren per machine per week', 'hours per machine a week'), 'pm-mute') : ''));
    }
    if (b === 4) o.owner = op(span(p, 0.15, 0.35), lines(334, [[tr('eigenaar bij de klant', 'owner on the client side'), 'pm-on'], [tr('jij: R voor de analyse', 'you: R for the analysis')], [tr('geen eigenaar? rode vlag', 'no owner? a red flag')]]));
    return { tag: true, parts: o, doc: 1 };
  }
  function s9(b, p) {
    const o = {};
    if (b === 0) {
      const items = [tr('stuurgroep, elke 4 weken', 'steering group, 4-weekly'), tr('scope: besluit in 1 week', 'scope: decides in a week'), tr('opent gesprek met verkoop', 'opens the talk with sales'), tr('legt ploegleiders uit', 'tells shift leads why')];
      o.deals = txt(X0, 74, tr('sponsor, op papier', 'sponsor, in writing'), 'pm-big') + items.map((t, i) => op(span(p, 0.12 + i * 0.14, 0.2 + i * 0.14), txt(X0, 104 + i * 28, `${i + 1}  ${t}`, 'pm-txt'))).join('')
        + txt(X0, 240, tr('30 minuten, fabrieksdirecteur', '30 minutes, plant manager'), 'pm-mute') + op(span(p, 0.35, 0.5), lines(318, [[tr('waar kan ik op rekenen?', 'what can I count on?'), 'pm-on'], [tr('hoe bereik ik je?', 'how do I reach you?'), 'pm-on']]));
    }
    if (b === 1) {
      let c = txt(X0, 74, tr('ploegenrooster', 'shift pattern'), 'pm-big');
      c += rect(X0 + 2, 87, 26, 26, 'pm-letter', 5) + txt(X0 + 15, 107, 'A', 'pm-big', 'middle');
      c += pill(X0 + 92, 100, tr('hoofd 1', 'head 1')) + pill(X0 + 196, 100, tr('hoofd 2', 'head 2'));
      const a = span(p, 0.35, 0.6);
      c += op(a, `<path class="pm-arrow" d="${arrowD(XM, 122, XM, 170, 9)}"/>` + pill(XM, 190, tr('wie beslist?', 'who decides?'), 'pm-new'));
      c += op(span(p, 0.35, 0.5), lines(250, [[tr('los het niet zelf op', 'don’t solve it yourself')], [tr('anders: de sponsor', 'else: the sponsor')], [tr('week 2, niet week 12', 'week 2, not week 12'), 'pm-on']]));
      o.clash = c;
    }
    if (b === 2) {
      o.vars = lines(74, [[tr('valkuilen', 'pitfalls'), 'pm-big'], [tr('alleen gemaakt', 'made alone')], [tr('te veel C’s', 'too many Cs')], [tr('opgeborgen, vergeten', 'filed and forgotten')], [''], [tr('varianten', 'variants'), 'pm-big'], [tr('RASCI: S voor support', 'RASCI: S for Support')], [tr('DACI: driver, approver', 'DACI: Driver, Approver')]].map((l, i) => (i < 4 || span(p, 0.3, 0.45) > 0.5 ? l : [''])))
        + op(span(p, 0.75, 0.9), txt(X0, 372, tr('het gesprek telt', 'the conversation counts'), 'pm-on'));
    }
    if (b === 3) o.phone = lines(150, [[tr('Als dit misgaat,', 'If this goes wrong,'), 'pm-big'], [tr('wiens telefoon gaat?', 'whose phone rings?'), 'pm-on']]);
    return { tag: b === 0 || b === 1, parts: o };
  }
  const SCENES = [s1, s2, s3, s4, s5, s6, s7, s8, s9];
  const TITLES = [['rollen', 'roles'], ['stakeholdermap', 'stakeholder map'], ['vragen', 'questions'], ['escalatie', 'escalation'], ['macht', 'power'], ['ruilen', 'trading'], ['stakeholderkaart', 'stakeholder map'], ['RACI', 'RACI'], ['sponsor', 'sponsor']];

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const r = SCENES[si](b, p);
    let mini = '';
    for (const key of KEYS) {
      const body = r.parts[key] || '';
      set(E[key], body);
      mini += body;
    }
    set(E.pText, r.parts.text || '');
    set(E.pHead, txt(X0, 38, tr(...TITLES[si]), 'pm-big') + txt(X1, 38, r.tag ? tr('voorbeeld', 'example') : tr('schema', 'diagram'), 'pm-mute', 'end'));
    set(E.bMini, mini);
    set(E.dMini, r.doc > 0.01 ? op(r.doc, mini) : '');
  }

  return { render };
})();
