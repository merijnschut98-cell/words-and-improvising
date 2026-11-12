// The stage of the film "Instructie op de werkplek / On-the-job instruction": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and
// a preamble from build.mjs that defines C (the instruction sheet, the clock,
// the calendar cells, the speakers' heads, the panel's blocks), CAM (one camera
// move per scene), W and H. Moves are placed per caption beat (beatStarts), so
// the video's narration timing (films/_kit/beatwarp.js) keeps them in step.
// The panel at the right is drawn here each frame; the instruction on the wall
// fills row by row, the clock turns to six in s6, the calendar marks the
// weeks around go-live, and speech bubbles hang over whoever speaks, inside the
// room (so the camera moves them).
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
  const txt = (x, y, t, cls = 'tw-txt', anchor = 'start', size = 20) => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0, dy = 26) => list.map(([t, cls], i) => (t ? txt(x, y + i * dy, t, cls || 'tw-txt') : '')).join('');
  const card = (y, h, body, cls = 'tw-card') => rect(X0 - 6, y, X1 - X0 + 12, h, cls, 8) + body;
  const tick = (x, y) => `<path class="tw-tick" d="M${f1(x)} ${f1(y)}l5 5l10 -12"/>`;
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
    const body = `<path class="${hot ? 'tw-bubon' : 'tw-bub'}" d="M${f1(x + 8)} ${f1(y)}H${f1(x + w - 8)}Q${f1(x + w)} ${f1(y)} ${f1(x + w)} ${f1(y + 8)}V${f1(y + h - 8)}Q${f1(x + w)} ${f1(y + h)} ${f1(x + w - 8)} ${f1(y + h)}H${f1(tx + 7)}L${f1(tx)} ${f1(y + h + 12)}L${f1(tx - 7)} ${f1(y + h)}H${f1(x + 8)}Q${f1(x)} ${f1(y + h)} ${f1(x)} ${f1(y + h - 8)}V${f1(y + 8)}Q${f1(x)} ${f1(y)} ${f1(x + 8)} ${f1(y)}Z"/>`
      + txt(x + w / 2, y + 25, text, hot ? 'tw-on' : 'tw-txt', 'middle');
    return op(a, body);
  }

  // ------------------------------------------------------------ the room's moving parts
  // The instruction on the wall (sheet face: u = x, v = -z, in cm): n rows,
  // each a photo square and two rules, a key-point dot when keys; hard: the
  // row being rewritten glows.
  function sheetRows(n, keys = 0, hard = -1) {
    const { x0, x1, z1 } = C.SHEET;
    let s = '';
    for (let i = 0; i < Math.min(6, n); i++) {
      const v = -z1 + 8 + i * 8.4;
      s += `<path class="tw-photo" d="M${f1(x0 + 3)} ${f1(v)}h7v6h-7Z"/>`;
      s += `<path class="tw-rule2" d="M${f1(x0 + 12.5)} ${f1(v + 1.6)}H${f1(x1 - 4 - (i % 3) * 3)}M${f1(x0 + 12.5)} ${f1(v + 4.2)}H${f1(x1 - 10)}"/>`;
      if (keys > 0.01) s += op(keys, `<circle class="tw-mark" cx="${f1(x1 - 2.6)}" cy="${f1(v + 3)}" r="1.3"/>`);
      if (i === hard) s += `<path class="tw-line" d="M${f1(x0 + 1.5)} ${f1(v - 0.8)}h${f1(x1 - x0 - 3)}v7.6h${f1(-(x1 - x0 - 3))}Z"/>`;
    }
    return s;
  }
  // the clock's hands: h hours, m minutes
  function hands(h, m) {
    const { x, z, r } = C.CLOCK;
    const am = (m / 60) * Math.PI * 2;
    const ah = ((h % 12) / 12 + m / 720) * Math.PI * 2;
    return `<path class="tw-hand" d="M${f1(x)} ${f1(-z)}L${f1(x + Math.sin(ah) * r * 0.45)} ${f1(-z - Math.cos(ah) * r * 0.45)}M${f1(x)} ${f1(-z)}L${f1(x + Math.sin(am) * r * 0.68)} ${f1(-z - Math.cos(am) * r * 0.68)}"/>`;
  }
  // the calendar (side-wall face): which weeks are marked; gone: week -6 crossed out
  function calMarks(lit, gone, a = 1) {
    let s = '';
    lit.forEach((i) => { const [u0, v0, u1, v1] = C.calCells[i]; s += `<path class="tw-cal" d="M${u0} ${v0}H${u1}V${v1}H${u0}Z"/>`; });
    if (gone) { const [u0, v0, u1, v1] = C.calCells[0]; s += `<path class="tw-calx" d="M${u0} ${v0}L${u1} ${v1}M${u1} ${v0}L${u0} ${v1}"/>`; }
    // go-live: a bar under its week
    const [u0, , u1, v1] = C.calCells[C.LIVE];
    s += `<path class="tw-calx" style="stroke-width:1.4" d="M${u0} ${v1 + 2}H${u1}"/>`;
    return op(a, s);
  }

  // ------------------------------------------------------------ the panel's drawings
  // a mini page (the instruction): the sheet with its title bar; its rows
  // (photo, two rules); the key-point dots on those rows
  const pageAt = (x, y) => rect(x, y, 104, 146, 'tw-card', 4) + rect(x + 8, y + 9, 60, 6, 'tw-c3', 2);
  function pageRows(x, y, n) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const ry = y + 24 + i * 20;
      s += rect(x + 8, ry, 22, 15, 'tw-photo', 2);
      s += `<path class="tw-rule2" d="M${f1(x + 36)} ${f1(ry + 4)}H${f1(x + 86 - (i % 3) * 8)}M${f1(x + 36)} ${f1(ry + 11)}H${f1(x + 78)}"/>`;
    }
    return s;
  }
  const pageKeys = (x, y, n) => Array.from({ length: n }, (_, i) => `<circle class="tw-mark" cx="${f1(x + 95)}" cy="${f1(y + 31.5 + i * 20)}" r="3.4"/>`).join('');
  // a phone screen with step number i
  function screen(x, y, i, cls = 'tw-card') {
    return rect(x, y, 126, 40, cls, 6) + txt(x + 14, y + 27, String(i), 'tw-big') + rect(x + 40, y + 7, 18, 26, 'tw-photo', 3)
      + `<path class="tw-rule2" d="M${f1(x + 66)} ${f1(y + 15)}H${f1(x + 114)}M${f1(x + 66)} ${f1(y + 25)}H${f1(x + 104)}"/>`;
  }

  // ------------------------------------------------------------ the scenes
  // Each fills o: the panel's blocks (o[key] goes into data-k "t_<key>"), the
  // head [title, 'ex' | 'dia'], the sheet's rows, the clock, the calendar and bubbles.
  const S = [];
  // s1: one page per task: steps in order with photos, a key point per step
  S[0] = (b, p, o) => {
    o.page = op(span(b === 0 ? p : 1, 0.05, 0.3), txt(X0, 76, tr('werkinstructie: één A4', 'work instruction: 1 page'), 'tw-lab') + pageAt(X0, 92));
    const n = b < 1 ? 0 : b === 1 ? Math.floor(span(p, 0.1, 0.8) * 6.99) : 6;
    o.steps = pageRows(X0, 92, n)
      + op(inAt(b, p, 1), lines(120, [[tr('stappen', 'steps'), 'tw-lab'], [tr('op volgorde', 'in order')], [tr('foto’s van de', 'photos of the')], [tr('echte', 'real')], [tr('apparatuur', 'equipment')]], X0 + 120));
    const ka = inAt(b, p, 2);
    o.key = op(ka, card(262, 112, lines(290, [[tr('kernpunt per stap:', 'key point per step:'), 'tw-lab'], [tr('waar het goed of fout gaat', 'what makes it go right'), 'tw-on'], [tr('+ waarom het ertoe doet', 'or wrong, + why it matters')]]))
      + pageKeys(X0, 92, 6));
    o.rows = sheetRows(n, ka);
    o.head = [tr('één A4 per taak', 'one page per task'), 'dia'];
  };
  // s2: the grid operator: six screens, the key point, the test, step 4 rewritten
  S[1] = (b, p, o) => {
    o.app = op(span(b === 0 ? p : 1, 0.05, 0.3), txt(X0, 72, tr('per app: kabel en moffen', 'by app: cable and joints'), 'tw-lab'));
    if (b >= 1) {
      let s = '';
      for (let i = 0; i < 6; i++) {
        const x = X0 - 4 + (i % 2) * 150;
        const y = 116 + Math.floor(i / 2) * 46;
        const hard = i === 3 && b >= 3;
        s += op(inAt(b, p, 1, 0.1 + i * 0.07, 0.2 + i * 0.07), screen(x, y, i + 1, hard ? (b >= 4 ? 'tw-hot' : 'tw-line') : 'tw-card'));
        if (hard && b >= 4) s += op(span(p, 0.4, 0.6), tick(x + 100, y + 20));
        if (hard && b === 3) s += op(span(p, 0.5, 0.7), txt(x + 108, y + 28, '?', 'tw-on', 'middle', 24));
      }
      o.app += s;
    }
    o.write = op(inAt(b, p, 1), txt(X0, 100, tr('met de teamleider, 6 stappen', 'with the team lead, 6 steps'), 'tw-mute'));
    o.keyex = op(inAt(b, p, 2), card(258, 74, lines(282, [[tr('kernpunt: foto van de mof', 'key point: photo the joint'), 'tw-on'], [tr('vóór de sleuf dichtgaat;', 'before the trench is filled;')], [tr('daarna kan het niet meer', 'you can’t afterwards')]], X0, 22), 'tw-hot'));
    o.test = op(inAt(b, p, 3), lines(356, [[tr('test: wie er niet bij was', 'test: an outsider follows'), 'tw-lab'], [tr('aarzelt hij? dan onduidelijk', 'hesitates? then unclear')]], X0, 24));
    o.rows = sheetRows(6, 1, b >= 3 ? 3 : -1);
    o.head = [tr('netbeheerder', 'grid operator'), 'ex'];
    o.bub = bubble('learner', tr('Stap 4…?', 'Step 4…?'), b === 4 ? span(p, 0.05, 0.2) * (1 - span(p, 0.75, 0.9)) : 0)
      + bubble('teamlead', tr('Eerst de foto.', 'Photo first.'), b === 2 ? span(p, 0.15, 0.3) : 0, true);
  };
  // s3: TWI; the four steps of Job Instruction acted at the bench
  const STEP = () => [tr('voorbereiden', 'prepare the learner'), tr('voordoen + uitleggen', 'show and explain'), tr('laten proberen, corrigeren', 'let them try, correct'), tr('later nagaan', 'follow up')];
  S[2] = (b, p, o) => {
    o.twi = op(span(b === 0 ? p : 1, 0.05, 0.3), lines(72, [['TWI', 'tw-big'], ['Training Within Industry', 'tw-lab'], [tr('VS, oorlogsprogramma, 1940', 'US wartime programme, 1940')]])
      + op(inAt(b, p, 1), txt(X0, 150, tr('tot 1945: > 1,6 miljoen', 'by 1945: 1.6 million+'), 'tw-on') + txt(X0, 174, tr('certificaten', 'certificates'), 'tw-on')));
    if (b >= 2) {
      let s = txt(X0, 212, 'Job Instruction', 'tw-lab');
      STEP().forEach((t, i) => {
        const y = 224 + i * 40;
        const now = b - 2 === i;
        const a = inAt(b, p, 2 + i, 0.02, 0.2);
        s += op(a, rect(X0 - 6, y, X1 - X0 + 12, 34, now ? 'tw-hot' : 'tw-card', 6) + txt(X0 + 6, y + 24, String(i + 1), 'tw-big') + txt(X0 + 32, y + 24, t, now ? 'tw-on' : 'tw-txt'));
      });
      o.four = s;
    }
    o.rows = sheetRows(6, 1);
    o.head = [tr('vier stappen', 'four steps'), 'dia'];
    o.bub = bubble('teamlead', tr('Vandaag: de mof.', 'Today: the joint.'), b === 2 ? span(p, 0.2, 0.35) : 0, true)
      + bubble('teamlead', tr('Kijk: eerst de foto.', 'Look: photo first.'), b === 3 ? span(p, 0.2, 0.35) : 0, true)
      + bubble('learner', tr('Foto, want…', 'Photo, because…'), b === 4 ? span(p, 0.2, 0.35) : 0)
      + bubble('teamlead', tr('Vragen? Bel mij.', 'Questions? Call me.'), b === 5 ? span(p, 0.2, 0.35) : 0, true);
  };
  // s4: the motto, Toyota, classroom versus the floor
  S[3] = (b, p, o) => {
    o.motto = op(span(b === 0 ? p : 1, 0.05, 0.3), card(56, 128, NL
      ? lines(82, [['het motto', 'tw-lab'], ['Heeft de medewerker het'], ['niet geleerd, dan heeft de'], ['instructeur het niet goed'], ['uitgelegd.']], X0, 24)
      : lines(82, [['the motto', 'tw-lab'], ['If the worker hasn’t'], ['learned, the instructor'], ['hasn’t taught.']], X0, 24)));
    o.toyota = op(inAt(b, p, 1), txt(X0, 214, tr('Toyota: in de jaren 50', 'Toyota: in the 1950s'), 'tw-on'));
    const col = (x, list) => lines(268, list, x, 26);
    o.room = op(inAt(b, p, 2), rect(X0 - 6, 236, 140, 146, b === 2 ? 'tw-hot' : 'tw-card', 8)
      + col(X0 + 4, [[tr('klaslokaal', 'classroom'), 'tw-lab'], [tr('het waarom', 'the why')], [tr('grote plaatje', 'big picture')], [tr('30–60 min', '30–60 min'), 'tw-on']]));
    o.ojt = op(inAt(b, p, 3), rect(X0 + 146, 236, 144, 146, b === 3 ? 'tw-hot' : 'tw-card', 8)
      + col(X0 + 156, [[tr('werkplek', 'on the job'), 'tw-lab'], [tr('voordoen', 'show')], [tr('samen doen', 'do together')], [tr('zelf doen', 'let them do')], [tr('checken', 'check'), 'tw-on']]));
    o.rows = sheetRows(6, 1);
    o.head = [tr('klas of werkplek', 'classroom or floor'), 'dia'];
    o.bub = bubble('learner', tr('Zo?', 'Like this?'), b === 3 ? span(p, 0.3, 0.45) : 0)
      + bubble('teamlead', tr('Samen.', 'Together.'), b === 3 ? span(p, 0.1, 0.25) * (1 - span(p, 0.28, 0.32)) : 0, true);
  };
  // s5: who trains; when; every shift; the grid operator's training
  S[4] = (b, p, o) => {
    o.who = op(span(b === 0 ? p : 1, 0.05, 0.3), lines(72, [[tr('trainers:', 'trainers:'), 'tw-lab'], [tr('ploegleiders, ervaren', 'shift leads, experienced')], [tr('operators, eerst zelf getraind', 'operators, trained first'), 'tw-on']]));
    if (b >= 1) {
      let s = txt(X0, 166, tr('weken rond de livegang', 'weeks around go-live'), 'tw-lab');
      const labels = ['−6', '', '', '', '', '−1', 'live', '+1', '+2'];
      for (let i = 0; i < 9; i++) {
        const x = X0 - 4 + i * 32;
        const lit = (b >= 2 && (i === 5 || i === 7 || i === 8));
        s += rect(x, 178, 28, 28, i === 0 ? 'tw-c1' : lit ? 'tw-hot' : i === 6 ? 'tw-c3' : 'tw-c2', 3);
        if (labels[i]) s += txt(x + 14, 228, labels[i], i === 6 ? 'tw-lab' : 'tw-mute', 'middle');
      }
      s += `<path class="tw-strike" d="M${X0} 182L${X0 + 20} 202M${X0 + 20} 182L${X0} 202"/>`;
      s += op(b === 1 ? span(p, 0.3, 0.5) : 1, txt(X0, 254, tr('−6: grotendeels vergeten', '−6: mostly forgotten'), 'tw-mute'));
      if (b >= 2) s += op(inAt(b, p, 2), txt(X0, 280, tr('−1 sessies · +1, +2 vloer', '−1 sessions · +1, +2 floor'), 'tw-on'));
      o.when = s;
    }
    if (b >= 3) {
      let s = '';
      const pills = NL ? ['dag', 'nacht', 'weekend'] : ['day', 'night', 'weekend'];
      let x = X0 - 4;
      pills.forEach((t, i) => { const w = t.length * 11 + 24; s += rect(x, 292, w, 30, i ? 'tw-hot' : 'tw-card', 15) + txt(x + w / 2, 313, t, i ? 'tw-on' : 'tw-txt', 'middle'); x += w + 8; });
      o.shifts = op(inAt(b, p, 3), s);
    }
    o.morning = op(inAt(b, p, 4), card(330, 54, lines(352, [[tr('30 min ochtendoverleg; dan', '30 min morning meeting;'), 'tw-on'], [tr('mee op de eerste klus', 'then along on first jobs')]], X0, 22), 'tw-hot'));
    o.cal = calMarks(b >= 2 ? [5, 7, 8] : [], b >= 1, b >= 1 ? 1 : 0);
    o.hands = b === 3 ? hands(23, 0) : hands(7, 30);
    o.rows = sheetRows(6, 1);
    o.head = [tr('wie en wanneer', 'who and when'), b === 4 ? 'ex' : 'dia'];
    o.bub = bubble('teamlead', tr('Eerst het waarom.', 'First, why.'), b === 4 ? span(p, 0.15, 0.3) : 0, true);
  };
  // s6: a week later; the same mistake; 20 reports, 5 from the six o'clock crews
  S[5] = (b, p, o) => {
    o.week = op(span(b === 0 ? p : 1, 0.05, 0.3), lines(72, [[tr('een week later:', 'a week later:'), 'tw-lab'], [tr('kijk, zonder hulp', 'watch, without help')], [tr('niet om te beoordelen', 'not to judge them'), 'tw-on']]));
    o.same = op(inAt(b, p, 1), lines(168, [[tr('zelfde fout bij velen?', 'same mistake by many?'), 'tw-lab'], [tr('de instructie is fout,', 'the instruction is wrong,'), 'tw-on'], [tr('niet de mensen', 'not the people')]]));
    if (b >= 2) {
      let s = '';
      const k = b === 2 ? Math.floor(span(p, 0.1, 0.7) * 20.99) : 20;
      for (let i = 0; i < k; i++) {
        const x = X0 - 2 + (i % 10) * 28;
        const y = 248 + Math.floor(i / 10) * 30;
        const miss = i >= C.REPORTS.complete;
        s += miss ? rect(x, y, 22, 22, b >= 3 ? 'tw-line' : 'tw-hole', 4) : rect(x, y, 22, 22, 'tw-c3', 4);
        if (miss && b >= 3) s += op(inAt(b, p, 3, 0.2, 0.4), txt(x + 11, y + 18, '6', 'tw-on', 'middle', 20));
      }
      s += op(b === 2 ? span(p, 0.6, 0.8) : 1, txt(X0, 330, tr('15 compleet · 5 zonder foto', '15 complete · 5 no photo'), 'tw-txt'));
      if (b >= 3) s += op(inAt(b, p, 3), txt(X0, 354, tr('alle 5: ploegen van 6:00', 'all 5: crews starting 6:00'), 'tw-on'));
      if (b >= 4) s += op(inAt(b, p, 4), txt(X0, 378, tr('teamleider begint vroeger', 'a team lead starts early'), 'tw-on'));
      o.reports = s;
    }
    o.hands = b >= 3 ? hands(6, 0) : hands(9, 0);
    o.rows = sheetRows(6, 1);
    o.head = [tr('blijft het hangen?', 'did it stick?'), b >= 2 ? 'ex' : 'dia'];
    o.bub = bubble('jij', tr('Ik kijk alleen.', 'Just watching.'), b === 0 ? span(p, 0.3, 0.45) : 0, true)
      + bubble('teamlead', tr('Ik begin om 6:00.', 'I’ll start at 6:00.'), b === 4 ? span(p, 0.2, 0.35) : 0, true);
  };
  // s7: the four Kirkpatrick levels, the smiley form, 70-20-10, the expert
  S[6] = (b, p, o) => {
    const L = NL
      ? [['reactie', 'leuk?'], ['leren', 'geleerd?'], ['gedrag', 'doen ze het?'], ['resultaat', 'beter?']]
      : [['reaction', 'liked it?'], ['learning', 'learned it?'], ['behaviour', 'on the job?'], ['results', 'better?']];
    let s = '';
    L.forEach(([a, q], i) => {
      const y = 56 + i * 42;
      s += op(b === 0 ? span(p, 0.1 + i * 0.15, 0.2 + i * 0.15) : 1, rect(X0 - 6 + i * 10, y, X1 - X0 + 12 - i * 10, 36, b === 1 && i === 0 ? 'tw-hot' : 'tw-card', 6)
        + txt(X0 + 4 + i * 10, y + 25, `${i + 1} ${a}`, 'tw-lab') + txt(X1 - 4, y + 25, q, 'tw-txt', 'end'));
    });
    s += op(b === 0 ? span(p, 0.7, 0.9) : 1, txt(X0, 240, 'Donald Kirkpatrick, 1959', 'tw-mute'));
    o.kirk = s;
    o.smiley = op(inAt(b, p, 1), txt(X0, 268, tr('de meeste stoppen bij 1', 'most stop at level 1'), 'tw-on')
      + [0, 1, 2].map((i) => { const cx = X1 - 50 + i * 20; return `<circle class="tw-hole" cx="${cx}" cy="262" r="8"/><path class="tw-line" d="M${cx - 4} ${264 - (i - 1)}Q${cx} ${264 + 3 * (1 - i)} ${cx + 4} ${264 - (i - 1)}"/>`; }).join(''));
    o.rule = op(inAt(b, p, 2), lines(304, [[tr('70-20-10: praktijkmodel,', '70-20-10: a practitioner'), 'tw-lab'], [tr('zwak bewijs', 'model, weak evidence'), 'tw-on']]));
    o.expert = op(inAt(b, p, 3), card(340, 42, txt(X0, 368, tr('expert traint, jij checkt', 'expert trains, you check'), 'tw-on'), 'tw-hot'));
    o.rows = sheetRows(6, 1);
    o.head = [tr('wat je meet', 'what you measure'), 'dia'];
    o.bub = bubble('jij', tr('Doen ze het?', 'Do they do it?'), b === 0 ? span(p, 0.6, 0.75) : 0, true);
  };

  // the panel's blocks: o[key] goes into the group data-k "t_<key>" (build.mjs, SLOTS)
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = { bub: '', rows: '', cal: '', hands: '', head: ['', 'ex'] };
    for (const key of C.SLOTS) o[key] = '';
    S[si](b, p, o);
    for (const key of C.SLOTS) { set(E[`t_${key}`], o[key]); }
    const lab = o.head[1] === 'dia' ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    set(E.pHead, txt(X0, 38, o.head[0], 'tw-big') + txt(X1, 38, lab, 'tw-mute', 'end'));
    set(E.sRows, o.rows);
    set(E.calMarks, o.cal);
    set(E.cHands, o.hands || hands(7, 30));
    set(E.bubbles, o.bub);
  }

  return { render };
})();
