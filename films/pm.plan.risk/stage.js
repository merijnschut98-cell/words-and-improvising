// The stage of the film "Een pre-mortem / A pre-mortem": a pure function of
// (scene, u). Inlined into the page after the anatomy kit and a preamble from
// build.mjs that defines C (the notes on the board, the speakers' heads, the
// panel's blocks), CAM (one camera move per scene), W and H. Moves are placed
// per caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the right is drawn
// here each frame; the whiteboard fills with sticky notes that cluster, the
// register on the table gains a rule per line, and speech bubbles hang over
// whoever speaks, inside the room (so the camera moves them).
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
  const ease = (t) => t * t * (3 - 2 * t);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, t) => { if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const txt = (x, y, t, cls = 'pr-txt', anchor = 'start', size = 20) => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pr-txt') : '')).join('');
  const strike = (x, y, w) => `<path class="pr-strike" d="M${f1(x - 2)} ${f1(y - 7)}H${f1(x + w)}"/>`;
  const card = (y, h, body, cls = 'pr-card') => rect(X0 - 6, y, X1 - X0 + 12, h, cls, 8) + body;
  // a block fades in over the start of its beat and stays
  const inAt = (b, p, n, a0 = 0.05, a1 = 0.3) => (b > n ? 1 : b === n ? span(p, a0, a1) : 0);

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
    const body = `<path class="${hot ? 'pr-bubon' : 'pr-bub'}" d="M${f1(x + 8)} ${f1(y)}H${f1(x + w - 8)}Q${f1(x + w)} ${f1(y)} ${f1(x + w)} ${f1(y + 8)}V${f1(y + h - 8)}Q${f1(x + w)} ${f1(y + h)} ${f1(x + w - 8)} ${f1(y + h)}H${f1(tx + 7)}L${f1(tx)} ${f1(y + h + 12)}L${f1(tx - 7)} ${f1(y + h)}H${f1(x + 8)}Q${f1(x)} ${f1(y + h)} ${f1(x)} ${f1(y + h - 8)}V${f1(y + 8)}Q${f1(x)} ${f1(y)} ${f1(x + 8)} ${f1(y)}Z"/>`
      + txt(x + w / 2, y + 25, text, hot ? 'pr-on' : 'pr-txt', 'middle');
    return op(a, body);
  }

  // ------------------------------------------------------------ the board and the register
  // The sticky notes on the whiteboard (board face: u = x, v = -z, in cm).
  // n: how many hang (s1 collects them); k: 0 scattered, 1 clustered; done:
  // clusters ticked off into the register; extra: the new note from the coffee
  // machine.
  function notes(n, k, done = 0, extra = 0) {
    let s = '';
    const q = ease(clamp(k, 0, 1));
    C.NOTES.forEach(([sx, sz, cx, cz, grp], i) => {
      if (i >= n) return;
      const x = lerp(sx, cx, q);
      const z = lerp(sz, cz, q);
      const hot = q > 0.5 && grp < 3;
      s += `<path class="${hot ? 'pr-note1' : 'pr-note'}" d="M${f1(x)} ${f1(-z)}h${C.NOTE}v${C.NOTE}h${-C.NOTE}Z"/>`;
      s += `<path class="pr-scrib" d="M${f1(x + 2.5)} ${f1(-z + 4.5)}h${f1(C.NOTE - 5)}M${f1(x + 2.5)} ${f1(-z + 8.5)}h${f1(C.NOTE - 7 - (i % 3) * 1.5)}"/>`;
    });
    // ticks beside the clusters that became register lines
    C.TICKS.slice(0, done).forEach(([x, z]) => { s += `<path class="pr-tick" d="M${f1(x)} ${f1(-z)}l3 3l6 -7"/>`; });
    if (extra > 0.01) {
      const [x, z] = C.EXTRA;
      s += op(extra, `<path class="pr-note1" d="M${f1(x)} ${f1(-z)}h${C.NOTE}v${C.NOTE}h${-C.NOTE}Z"/><path class="pr-scrib" d="M${f1(x + 2.5)} ${f1(-z + 4.5)}h${f1(C.NOTE - 5)}"/>`);
    }
    return s;
  }
  // the register on the table (sheet face: u along 29.7, v along 21): a header
  // and one rule per line
  function register(rows, head) {
    if (!head) return '';
    let d = 'M2 3H27.7M2 3.6H27.7';
    for (let i = 0; i < rows; i++) d += `M2 ${f1(6.4 + i * 2.8)}H${f1(26 - (i % 3) * 3)}`;
    return `<path class="pr-rule2" d="${d}"/><path class="pr-rule2" d="M9 2V${f1(4.5 + Math.max(1, rows) * 2.8)}M16 2V${f1(4.5 + Math.max(1, rows) * 2.8)}"/>`;
  }

  // ------------------------------------------------------------ the scenes
  // Each fills o: the panel's blocks (o[key] goes into data-k "t_<key>"), the
  // head [title, 'ex' | 'dia'], the board's notes, the register and bubbles.
  const S = [];
  // s1: the question; alone first, one reason per person per round
  S[0] = (b, p, o) => {
    o.prompt = op(inAt(b, p, 1), card(56, 140, txt(X0, 84, tr('de vraag', 'the question'), 'pr-lab')
      + lines(112, [[tr('“Over zes maanden is', '“Six months from now,')], [tr('het project mislukt.', 'the project has failed.')], [tr('Schrijf alleen op waarom.”', 'Write down, alone, why.”'), 'pr-on']])));
    const R = [[tr('zes mensen, 20 minuten', 'six people, 20 minutes'), 'pr-lab']];
    if (b >= 2) R.push([tr('1 eerst alleen schrijven', '1 write alone first')], [tr('2 per ronde één reden', '2 one reason per person'), 'pr-on'], [tr('   per persoon', '   per round'), 'pr-on']);
    if (b >= 3) R.push([tr('de luidste stuurt niet', 'the loudest doesn’t steer')], [tr('Gary Klein, HBR, 2007', 'Gary Klein, HBR, 2007'), 'pr-mute']);
    o.rules = op(span(b === 0 ? p : 1, 0.1, 0.35), lines(232, R));
    // b2: the rounds; one note per person per round, two rounds
    const n = b < 2 ? 0 : b === 2 ? Math.floor(span(p, 0.15, 0.9) * (C.NOTES.length + 0.99)) : C.NOTES.length;
    o.board = notes(n, 0);
    o.head = [tr('pre-mortem', 'pre-mortem'), 'ex'];
    o.bub = bubble('jij', tr('Het is mislukt. Waarom?', 'It failed. Why?'), b === 1 ? span(p, 0.05, 0.2) : 0, true);
  };
  // s2: the notes cluster; what people say only now; prospective hindsight
  S[1] = (b, p, o) => {
    const k = b === 0 ? span(p, 0.1, 0.6) : 1;
    o.board = notes(C.NOTES.length, k);
    const row = (y, t, n, cls = 'pr-txt') => txt(X0, y, t, cls) + (n ? txt(X1, y, n, 'pr-big', 'end') : '');
    o.reasons = op(span(b === 0 ? p : 1, 0.15, 0.4), txt(X0, 76, tr('bakkerij: de redenen', 'bakery: the reasons'), 'pr-lab')
      + row(102, tr('geen tijd: zomerpiek', 'no time: summer peak'), '×3', 'pr-on') + row(128, tr('registreren gestopt', 'stopped logging'), tr('2 wk', '2 wk')) + row(154, tr('nieuwe manager: af', 'new manager: cancelled'), ''));
    o.unsaid = op(inAt(b, p, 1), lines(184, [[tr('wat anders niemand zegt', 'what no one says otherwise'), 'pr-lab'], [tr('de sponsor vertrekt', 'the sponsor leaves')], [tr('nachtploeg wil niet', 'night shift says no')], [tr('IT-aanpassing: geen geld', 'IT change: no budget')]]));
    o.hind = op(inAt(b, p, 2), card(274, 108, lines(298, [['prospective hindsight', 'pr-lab'], [tr('zo’n 30% beter', 'about 30% better'), 'pr-on'], [tr('Mitchell, Russo, Pennington,', 'Mitchell, Russo, Pennington,'), 'pr-mute'], [tr('1989; aangehaald door Klein', '1989; cited by Klein'), 'pr-mute']])));
    o.head = [tr('waarom het werkt', 'why it works'), b === 0 ? 'ex' : 'dia'];
    o.bub = bubble('planner', tr('Nachtploeg wil niet…', 'Night shift says no…'), b === 1 ? span(p, 0.4, 0.55) : 0);
  };
  // s3: a risk, the register's four fields, one owner, a useful line
  const box = (x, y, t, cls) => rect(x, y, 136, 44, cls, 6) + txt(x + 68, y + 29, t, cls === 'pr-hot' ? 'pr-on' : 'pr-txt', 'middle');
  S[2] = (b, p, o) => {
    o.board = notes(C.NOTES.length, 1);
    o.def = op(span(b === 0 ? p : 1, 0.1, 0.35), lines(76, [[tr('risico:', 'risk:'), 'pr-lab'], [tr('kan gebeuren en zou', 'might happen and would')], [tr('het project pijn doen', 'hurt the project')]]));
    const fb = inAt(b, p, 1);
    o.row = op(fb, txt(X0, 176, tr('risicolijst, per risico:', 'register, per risk:'), 'pr-lab')
      + box(X0 - 4, 188, tr('kans', 'likelihood'), 'pr-card') + box(X0 + 148, 188, 'impact', 'pr-card') + box(X0 + 148, 240, tr('actie + datum', 'action + date'), 'pr-card'));
    o.owner = op(fb, box(X0 - 4, 240, tr('eigenaar', 'owner'), b >= 2 ? 'pr-hot' : 'pr-card') + op(inAt(b, p, 2, 0.2, 0.45), txt(X0, 312, tr('één persoon, geen afdeling', 'one person, not a team'), 'pr-on')));
    o.vague = op(inAt(b, p, 3), txt(X0, 344, tr('“data kan slecht zijn”', '“data may be poor”'), 'pr-mute') + strike(X0, 344, NL ? 204 : 172)
      + txt(X0, 370, tr('data < 2023 · Pieter · wk 1', 'data < 2023 · Pieter · wk 1'), 'pr-on'));
    o.reg = register(0, b >= 1);
    o.head = [tr('een regel', 'a line'), b === 3 ? 'ex' : 'dia'];
  };
  // s4: the 5 by 5 score, the mitigation, then two lines of the bakery
  const GX = X0 + 26;
  const GY = 64;
  const GC = 24;
  S[3] = (b, p, o) => {
    const ticks = b < 3 ? 0 : b === 3 ? (p > 0.5 ? 1 : 0) : 2;
    o.board = notes(C.NOTES.length, 1, ticks);
    const gone = b < 3 ? 1 : b === 3 ? 1 - span(p, 0, 0.15) : 0;
    if (gone > 0.01) {
      let g = '';
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
        const v = (i + 1) * (5 - j);
        const mark = b >= 1 && (v === 12 || v === 10) && ((i === 2 && j === 1) || (i === 1 && j === 0));
        g += rect(GX + i * GC, GY + j * GC, GC - 2, GC - 2, mark ? 'pr-hot' : v >= 15 ? 'pr-c3' : v >= 8 ? 'pr-c2' : 'pr-c1', 3);
      }
      g += txt(GX - 8, GY + 18, '5', 'pr-mute', 'end') + txt(GX - 8, GY + 5 * GC - 6, '1', 'pr-mute', 'end') + txt(GX + 5 * GC - 12, GY + 5 * GC + 20, '5', 'pr-mute', 'middle');
      g += lines(GY + 40, [[tr('kans ×', 'likelihood ×'), 'pr-lab'], [tr('impact', 'impact'), 'pr-lab'], ['= 1 … 25']], GX + 5 * GC + 14);
      g += op(inAt(b, p, 1, 0.1, 0.35), txt(X0, 236, tr('12 is niet erger dan 10', '12 isn’t worse than 10'), 'pr-on') + txt(X0, 262, tr('sorteren, geen waarheid', 'for sorting, not truth'), 'pr-mute'));
      o.grid = op(gone, g);
      o.measure = op(gone * inAt(b, p, 2), txt(X0, 306, tr('“monitoren”', '“monitor”'), 'pr-mute') + strike(X0, 306, NL ? 116 : 92) + txt(X0, 332, tr('“testexport in week 1”', '“test export in week 1”'), 'pr-on'));
    }
    if (b >= 3) {
      const r1 = card(56, 158, lines(84, [[tr('zomerpiek', 'summer peak'), 'pr-lab'], [tr('kans hoog, impact hoog', 'likelihood high, impact high')], [tr('eigenaar: hoofd onderhoud', 'owner: maintenance mgr')], [tr('analyse vóór juni, 4 uur', 'analysis before June, 4 h'), 'pr-on'], [tr('per monteur per week', 'a week per technician'), 'pr-on']]));
      const r2 = b >= 4 ? op(inAt(b, p, 4), card(228, 106, lines(256, [[tr('registreren', 'logging'), 'pr-lab'], [tr('eigenaar: ploegleider', 'owner: shift lead')], [tr('één tik, lijnterminal, wk 3', 'one tap, line terminal, wk 3'), 'pr-on']]))) : '';
      o.rows = op(inAt(b, p, 3, 0.1, 0.3), r1 + r2);
    }
    o.reg = register(b < 3 ? 0 : b === 3 ? (p > 0.5 ? 1 : 0) : (p > 0.5 || b > 4 ? 2 : 1), true);
    o.head = [tr('score en actie', 'score and action'), b >= 3 ? 'ex' : 'dia'];
  };
  // s5: the top five at every steering group, the coffee machine, an issue
  S[4] = (b, p, o) => {
    o.board = notes(C.NOTES.length, 1, 2, inAt(b, p, 2, 0.35, 0.55));
    const names = NL ? ['zomerpiek', 'registreren', 'nieuwe manager'] : ['summer peak', 'logging', 'new manager'];
    let s = txt(X0, 76, tr('elke stuurgroep: top 5', 'every steering group: top 5'), 'pr-lab');
    for (let i = 0; i < 5; i++) {
      const y = 104 + i * 28;
      s += txt(X0, y, String(i + 1), 'pr-big');
      s += i < 3 ? txt(X0 + 24, y, names[i]) : rect(X0 + 24, y - 14, 120 - i * 14, 10, 'pr-c1', 3);
      if (b >= 1 && i < 3) s += op(inAt(b, p, 1, 0.1 + i * 0.15, 0.25 + i * 0.15), txt(X1, y, tr('eigenaar', 'owner'), 'pr-on', 'end'));
    }
    s += op(span(b === 0 ? p : 1, 0.05, 0.25), txt(X0, 260, tr('de meeste: dood na kick-off', 'most: dead after kick-off'), 'pr-mute'));
    o.top5 = s;
    o.issue = op(inAt(b, p, 3), card(286, 92, lines(312, [[tr('risico komt uit:', 'a risk comes true:'), 'pr-lab'], [tr('→ issue: aanpakken,', '→ issue: handle it,'), 'pr-on'], [tr('niet alleen volgen', 'don’t just watch it')]]), 'pr-hot'));
    o.reg = register(b === 0 ? 2 + Math.floor(span(p, 0.3, 0.8) * 3.99) : 5, true);
    o.head = [tr('levend houden', 'keep it alive'), b <= 1 ? 'ex' : 'dia'];
    o.bub = bubble('planner', tr('Trouwens…', 'By the way…'), b === 2 ? span(p, 0.1, 0.25) : 0)
      + bubble('teamlead', tr('Sindsdien…', 'Since then…'), b === 1 ? span(p, 0.1, 0.25) : 0);
  };
  // s6: a sensitive risk as a theme; a cheap test; the sharp question
  S[5] = (b, p, o) => {
    o.board = notes(C.NOTES.length, 1, 2, 1);
    let t = txt(X0, 76, tr('“plantmanager gelooft', '“the plant manager doesn’t'), 'pr-mute') + txt(X0, 102, tr('er niet in”', 'believe in it”'), 'pr-mute');
    if (b >= 1) {
      const a = inAt(b, p, 1);
      t += op(a, strike(X0, 76, NL ? 208 : 250) + strike(X0, 102, NL ? 104 : 132)
        + lines(134, [[tr('in de lijst:', 'in the register:'), 'pr-lab'], [tr('sponsorschap en', 'sponsorship and'), 'pr-on'], [tr('zichtbare steun', 'visible support'), 'pr-on'], [tr('het echte punt: één op één', 'the real point: one-on-one')]]));
    }
    o.theme = op(span(b === 0 ? p : 1, 0.05, 0.25), t);
    o.test = op(inAt(b, p, 2), lines(252, [[tr('kans onbekend?', 'likelihood unknown?'), 'pr-lab'], [tr('zeg het, en plan een', 'say so, and plan a')], [tr('goedkope test', 'cheap test'), 'pr-on']]));
    o.first = op(inAt(b, p, 3), card(330, 50, txt(X0, 362, tr('“Wat zien we als eerste?”', '“What would we see first?”'), 'pr-on'), 'pr-hot'));
    o.reg = register(5, true);
    o.head = [tr('de mensenkant', 'the people side'), 'dia'];
    o.bub = bubble('jij', tr('Wat zien we als eerste?', 'What would we see first?'), b === 3 ? span(p, 0.1, 0.25) : 0, true);
  };

  // the panel's blocks: o[key] goes into the group data-k "t_<key>" (build.mjs, SLOTS)
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = { bub: '', board: '', reg: '', head: ['', 'ex'] };
    for (const key of C.SLOTS) o[key] = '';
    S[si](b, p, o);
    for (const key of C.SLOTS) { set(E[`t_${key}`], o[key]); }
    const lab = o.head[1] === 'dia' ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    set(E.pHead, txt(X0, 38, o.head[0], 'pr-big') + txt(X1, 38, lab, 'pr-mute', 'end'));
    set(E.bNotes, o.board);
    set(E.dMini, o.reg);
    set(E.bubbles, o.bub);
  }

  return { render };
})();
