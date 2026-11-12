// The stage of the film "Wat past onder de streep? / What fits under the line?":
// a pure function of (scene, u). Inlined into the page after the anatomy kit
// and a preamble from build.mjs that defines C (the panel's blocks, the food
// producer's five projects, the capacity matrix, the month's week cells), CAM
// (one camera move per scene), W and H. Moves are placed per Dutch caption
// beat (beatStarts), so the video's narration timing (films/_kit/beatwarp.js)
// keeps them in step. The panel at the right is drawn here each frame, every
// block in its own cue group (o[key] goes into data-k "p_<key>"); the board in
// the room repeats the panel in miniature, the A4 on the table fills with the
// dependencies (s2) and the month on the side wall shows Fatima's days (s7, s9).
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
  const txt = (x, y, t, cls = 'pp-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="20" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const dot = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0, anchor = 'start') => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pp-txt', anchor) : '')).join('');
  const card = (y, h, cls = 'pp-card') => rect(X0 - 6, y, X1 - X0 + 12, h, cls, 8);
  const strike = (x, y, w) => path(`M${f1(x - 2)} ${f1(y - 7)}H${f1(x + w)}`, 'pp-strike');
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // 1 until beat k, then fading out early in beat k
  const until = (b, p, k) => 1 - at(b, p, k, 0, 0.15);
  const fmt = (v) => (NL ? String(v).replace('.', ',') : String(v));

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

  // ------------------------------------------------------------ the scenes
  // Each returns o: the panel's blocks by cue key, plus head [title, 'ex' | 'dia'].
  const S = [];
  // s1: a project's output; a programme of three for one outcome; the test; the portfolio
  S[0] = (b, p) => {
    const names = b === 0 ? [tr('gereedheidscheck', 'readiness check'), tr('omgebouwde lijn', 'rebuilt line'), tr('planningstool', 'planning tool')]
      : [tr('gereedheidscheck', 'readiness check'), tr('materiaalproces', 'materials process'), tr('planningstool', 'planning tool')];
    let boxes = '';
    names.forEach((n, i) => {
      const y = 58 + i * 40;
      boxes += op(span(b === 0 ? p : 1, 0.05 + i * 0.12, 0.2 + i * 0.12), rect(X0 - 6, y, 196, 32, 'pp-card', 6) + txt(X0 + 4, y + 23, n));
    });
    const arrows = op(until(b, p, 1) * span(b === 0 ? p : 1, 0.5, 0.7), [0, 1, 2].map((i) => txt(X1, 81 + i * 40, tr('→ output', '→ output'), 'pp-mute', 'end')).join(''));
    const bx = X0 + 214;
    const bracket = [0, 1, 2].map((i) => `M${X0 + 190} ${74 + i * 40}H${bx}`).join('') + `M${bx} 74V188`;
    return {
      head: [tr('programma', 'programme'), 'dia'],
      outputs: boxes + arrows + op(at(b, p, 2, 0.3, 0.5), strike(X0 + 4, 161, 150)),
      prog: op(at(b, p, 1), path(bracket, 'pp-line') + card(190, 58, b === 1 ? 'pp-hot' : 'pp-card') + lines(214, [[tr('één uitkomst:', 'one outcome:'), 'pp-lab'], [tr('afzeggingen 14% → 8%', 'cancellations 14% → 8%'), 'pp-on']])),
      test: op(at(b, p, 2), lines(280, [[tr('schrap er één: blijft', 'drop one: does the goal')], [tr('het doel staan? dan:', 'still hold? then:')]])),
      pf: op(at(b, p, 2, 0.4, 0.6), card(320, 64, b >= 2 ? 'pp-hot' : 'pp-card') + lines(344, [[tr('portfolio', 'portfolio'), 'pp-lab'], [tr('zelfde geld, zelfde mensen', 'same money, same people'), 'pp-on']])
        + [0, 1, 2, 3].map((i) => rect(X1 - 48, 330 + i * 10, 40, 6, 'pp-bar', 2)).join('')),
    };
  };
  // s2: a dependency (A to B, B and C share planners), the list, the odds; the region's page
  S[1] = (b, p) => {
    const box = (x, lab) => rect(x, 64, 76, 36, 'pp-card', 6) + txt(x + 38, 89, lab, 'pp-lab', 'middle');
    const ax = X0 + 70;
    const bx = X0 + 100;
    const b0 = b === 0 ? p : 1;
    const dep = op(span(b0, 0.05, 0.2), box(X0 - 6, 'A') + box(bx, 'B') + box(X0 + 206, 'C')
      + op(span(b0, 0.3, 0.45), path(`M${ax} 82H${bx - 4}M${bx - 10} 76L${bx - 3} 82L${bx - 10} 88`, 'pp-line') + txt(X0, 130, tr('B wacht op A: week 10', 'B waits for A: week 10')))
      + op(span(b0, 0.6, 0.75), path(`M${X0 + 176} 82H${X0 + 206}`, 'pp-dash') + txt(X0, 156, tr('B en C: 2 planners, Q2', 'B and C: 2 planners, Q2'))));
    const odds = op(at(b, p, 2), [0, 1, 2, 3].map((i) => rect(X1 - 74 + i * 20, 262, 14, 50, 'pp-card', 3) + rect(X1 - 74 + i * 20, 267, 14, 45, 'pp-bar', 3)).join('')
      + txt(X0, 284, tr('0,9 × 0,9 × 0,9 × 0,9', '0.9 × 0.9 × 0.9 × 0.9'), 'pp-txt') + txt(X0, 312, tr('= 0,66: 66%', '= 0.66: 66%'), 'pp-big')
      + txt(X0, 346, tr('elk 90% op tijd', 'each 90% on time'), 'pp-mute') + txt(X0, 372, tr('gedeelde mensen: erger', 'shared people: worse'), 'pp-on'));
    const a4 = op(at(b, p, 3), card(176, 166, 'pp-hot') + lines(200, [[tr('één A4, met eigenaren:', 'one page, with owners:'), 'pp-lab'], [tr('check leest data van B', 'check reads B’s data')],
      [tr('IT wijzigt een veld in Q3', 'IT changes a field in Q3')], [tr('planners: alle drie teams', 'planners: all three teams'), 'pp-mute'], [tr('B bevriest: week 6', 'B freezes: week 6'), 'pp-on'], [tr('IT test vóór livegang', 'IT tests before go-live'), 'pp-on']]));
    return {
      head: b < 3 ? [tr('afhankelijkheden', 'dependencies'), 'dia'] : [tr('de regio', 'the region'), 'ex'],
      dep,
      list: op(at(b, p, 1) * until(b, p, 3), card(176, 62, b === 1 ? 'pp-hot' : 'pp-card') + lines(200, [[tr('eigenaar · datum ·', 'owner · date ·'), 'pp-lab'], [tr('wat als het uitloopt?', 'what if it slips?')]])),
      odds: op(until(b, p, 3), odds),
      a4,
    };
  };
  // s3: the programme board and the seams; watermelon reporting in the region; the outcome number; the lead
  S[2] = (b, p) => {
    const top = until(b, p, 2);
    const sbox = (x, lab) => rect(x, 168, 76, 30, 'pp-card', 6) + txt(x + 38, 190, lab, 'pp-txt', 'middle');
    // a watermelon slice: the green rind outside, red inside, seeds
    const mx = X0 + 64;
    const my = 160;
    const R = 60;
    const arc = (r) => `M${f1(mx - r)} ${my}A${r} ${r} 0 0 1 ${f1(mx + r)} ${my}Z`;
    const melon = op(at(b, p, 2) * until(b, p, 4), path(arc(R), 'pp-rind') + path(arc(R - 9), 'pp-flesh')
      + [[-26, -18], [0, -34], [24, -20], [-12, -8], [12, -8]].map(([dx, dy]) => `<ellipse class="pp-seed" cx="${f1(mx + dx)}" cy="${f1(my + dy)}" rx="2.4" ry="4"/>`).join('')
      + txt(X0 + 140, 106, tr('buiten: groen', 'outside: green'), 'pp-txt') + txt(X0 + 140, 134, tr('binnen: rood', 'inside: red'), 'pp-redt'));
    const report = op(at(b, p, 2, 0.5, 0.7), [0, 1, 2].map((i) => dot(X0 + 8 + i * 22, 198, 8, 'pp-green')).join('') + txt(X0 + 72, 205, tr('A, B, IT: groen', 'A, B, IT: green'))
      + txt(X0, 234, tr('afzeggingen: nog 14%', 'cancellations: still 14%'), 'pp-redt')
      + op(at(b, p, 3), card(244, 34, b === 3 ? 'pp-hot' : 'pp-card') + txt(X0, 268, tr('elke maand: getal, bijdrage', 'monthly: number, each share'), 'pp-on')));
    const power = op(at(b, p, 3), lines(310, [[tr('macht: de budgetten,', 'power: the budgets,'), 'pp-mute'], [tr('of doel en sterke raad?', 'or goal and strong board?'), 'pp-mute']]) + txt(X1, 362, tr('experts oneens', 'experts disagree'), 'pp-mute', 'end'));
    const lead = op(at(b, p, 4), card(56, 116, 'pp-hot') + lines(80, [[tr('jij: verhaal, lijst, ritme', 'you: story, list, rhythm'), 'pp-lab'], [tr('in 2 minuten, in getallen?', 'in 2 minutes, in numbers?')], [tr('anders: elk project apart', 'or: each project apart'), 'pp-mute'], [tr('welk project beweegt wat?', 'which project moves what?'), 'pp-on']]));
    return {
      head: b < 2 ? [tr('de programmaraad', 'programme board'), 'dia'] : b < 4 ? [tr('de regio', 'the region'), 'ex'] : [tr('de leider', 'the lead'), 'dia'],
      raad: op(top * span(b === 0 ? p : 1, 0.05, 0.25), card(56, 98, b === 0 ? 'pp-hot' : 'pp-card') + lines(80, [[tr('programmaraad', 'programme board'), 'pp-lab'], [tr('sponsor, projecteigenaren,', 'sponsor, project owners,')], [tr('uitkomst-eigenaar, finance', 'outcome owner, finance')]])),
      seams: op(top * at(b, p, 1), sbox(X0 - 6, 'A') + sbox(X0 + 100, 'B') + sbox(X0 + 206, 'IT')
        + path(`M${X0 + 88} 162V204M${X0 + 194} 162V204`, 'pp-cut') + lines(230, [[tr('maandelijks: volgorde,', 'monthly: sequencing,')], [tr('mensen en scope', 'people and scope'), 'pp-on']])),
      steer: op(top * at(b, p, 1, 0.15, 0.35), lines(298, [[tr('besluit in een project:', 'decision in a project:'), 'pp-lab'], [tr('in de stuurgroep', 'its steering group'), 'pp-on'], [tr('raad: 1 uur over 1 testplan', 'board: 1 hour on 1 test plan')]])
        + op(at(b, p, 1, 0.5, 0.65), strike(X0, 350, 270))),
      melon,
      report,
      power,
      lead,
    };
  };
  // s4: rough scores and the weights; the bottleneck; value per scarce day; risk-adjusted value
  S[3] = (b, p) => {
    const top = until(b, p, 2);
    const b0 = b === 0 ? p : 1;
    const neck = `M${X0 + 14} 384V316Q${X0 + 14} 300 ${X0 + 30} 294V276H${X0 + 26}V268H${X0 + 54}V276H${X0 + 50}V294Q${X0 + 66} 300 ${X0 + 66} 316V384Z`;
    const bars = (y, a, bb, labA, labB) => txt(X0, y + 17, 'A', 'pp-lab') + rect(X0 + 24, y, a, 22, 'pp-bar', 3) + txt(X0 + 30 + a, y + 17, labA)
      + txt(X0, y + 49, 'B', 'pp-lab') + rect(X0 + 24, y + 32, bb, 22, 'pp-bar', 3) + txt(X0 + 30 + bb, y + 49, labB);
    return {
      head: [tr('prioriteren', 'prioritising'), 'dia'],
      score: op(top * span(b0, 0.05, 0.2), card(56, 140, b === 0 ? 'pp-hot' : 'pp-card') + lines(80, [[tr('score 1 tot 5, grof', 'score 1 to 5, rough'), 'pp-lab'], [tr('waarde: € of KPI per jaar', 'value: € or KPI a year')], [tr('inspanning: schaarse dagen', 'effort: scarce days')], [tr('risico: levert het niet?', 'risk: may not deliver')], [tr('fit met de strategie', 'fit with strategy')]])),
      weights: op(top * span(b0, 0.45, 0.6), lines(220, [[tr('dit vóór dat, niet exact;', 'this before that, not exact;'), 'pp-mute'], [tr('wie de gewichten kiest,', 'whoever sets the weights')], [tr('kiest de uitkomst', 'sets the outcome'), 'pp-on']])),
      bneck: op(top * at(b, p, 1), `<g transform="translate(0 4)">${path(neck, 'pp-card')}${rect(X0 + 22, 334, 36, 44, 'pp-bar', 3)}</g>` + lines(312, [[tr('bottleneck:', 'bottleneck:'), 'pp-lab'], [tr('een paar schaarse', 'a few scarce')], [tr('experts, niet geld', 'experts, not money'), 'pp-on']], X0 + 86)),
      vpd: op(at(b, p, 2), txt(X0, 76, tr('per jaar', 'per year'), 'pp-mute') + bars(86, 150, 75, '€300k', '€150k')
        + txt(X0, 176, tr('per schaarse dag', 'per scarce day'), 'pp-mute') + bars(186, 75, 150, tr('€2,5k · 120 d', '€2.5k · 120 d'), tr('€5k · 30 d', '€5k · 30 d'))
        + op(at(b, p, 2, 0.6, 0.8), card(250, 34, 'pp-hot') + txt(X0, 274, tr('B eerst, al lijkt A groter', 'B first, though A looks bigger'), 'pp-on'))),
      risk: op(at(b, p, 3), txt(X0, 318, 'A', 'pp-lab') + rect(X0 + 24, 301, 75, 22, 'pp-bar', 3) + rect(X0 + 99, 301, 75, 22, 'pp-bar2', 3)
        + txt(X0 + 180, 318, '× 50%', 'pp-mute') + txt(X0, 354, tr('€300k bij 50% vertrouwen', '€300k at 50% confidence')) + txt(X0, 380, tr('= €150k', '= €150k'), 'pp-on')),
    };
  };
  // s5: the scarce days; the food producer's five projects, ranked; the capacity line; E; the trap
  S[4] = (b, p) => {
    const order = ['A', 'B', 'C', 'D', 'E'];
    const sorted = C.RANK.concat(['E']);
    const k = b < 1 ? 0 : b === 1 ? span(p, 0.6, 0.9) : 1;
    const name = { A: tr('energie', 'energy'), B: tr('omstellen', 'changeover'), C: tr('nieuw MES', 'new MES'), D: tr('verpakking', 'packaging'), E: tr('dashboard', 'dashboard') };
    let rows = txt(X0, 124, tr('project', 'project'), 'pp-mute') + txt(X0 + 196, 124, tr('€k/dag', '€k/day'), 'pp-mute', 'end') + txt(X1, 124, tr('dagen', 'days'), 'pp-mute', 'end');
    C.PROJ.forEach((pr) => {
      const y = 150 + lerp(order.indexOf(pr.id), sorted.indexOf(pr.id), k) * 26;
      const e4 = b >= 4 && pr.id === 'E';
      const v = pr.perDay === null ? (e4 ? tr('> 2,5?', '> 2.5?') : '?') : fmt(pr.perDay);
      const cls = e4 ? 'pp-on' : 'pp-txt';
      rows += txt(X0, y, `${pr.id}  ${name[pr.id]}`, cls) + op(at(b, p, 1, 0.3, 0.5), txt(X0 + 196, y, v, pr.id === 'C' ? 'pp-redt' : cls, 'end')) + txt(X1, y, String(pr.d), cls, 'end');
    });
    // the stacked bar of the ranked projects: 0 to 280 days across the panel
    const xd = (d) => X0 + (d / 280) * (X1 - X0);
    const seg = (d0, d1, cls, lab) => rect(xd(d0) + 0.5, 268, xd(d1) - xd(d0) - 1, 30, cls, 2) + (lab ? txt((xd(d0) + xd(d1)) / 2, 290, lab, cls === 'pp-bar2' ? 'pp-txt' : 'pp-inv', 'middle') : '');
    let bar = '';
    if (b >= 2) {
      bar = op(b === 2 ? span(p, 0.1, 0.5) : 1, seg(0, 40, 'pp-bar', 'B') + seg(40, 70, 'pp-bar', 'D') + seg(70, 150, 'pp-bar', 'A')
        + (b >= 3 ? seg(150, 210, 'pp-acc', 'C1') : seg(150, 280, 'pp-bar2', 'C')));
    }
    const cut = op(at(b, p, 2, 0.4, 0.6), path(`M${f1(xd(C.CAP))} 254V312`, 'pp-cutl') + txt(X1, 326, '240', 'pp-redt', 'end'));
    return {
      head: b === 0 ? [tr('harde grens', 'the hard line'), 'dia'] : [tr('vijf projecten', 'five projects'), 'ex'],
      cap: op(span(b === 0 ? p : 1, 0.05, 0.3), lines(74, [[tr('2 procesengineers', '2 process engineers'), 'pp-lab'], [tr('× 120 dagen = 240', '× 120 days = 240'), 'pp-on']])),
      rows: op(at(b, p, 1), rows),
      line: bar + cut,
      run: op(at(b, p, 3, 0.2, 0.4), txt(xd(150), 326, '150', 'pp-mute', 'middle') + txt(xd(210), 326, '210', 'pp-mute', 'middle')
        + txt(X0, 354, tr('C1: test de grote aanname', 'C1: test the big assumption'), 'pp-on')),
      ebox: op(at(b, p, 4, 0.05, 0.25), ''),
      trap: op(at(b, p, 4, 0.45, 0.65), txt(X0, 382, tr('maart: “een paar dagen”', 'March: “only a few days”'), 'pp-redt')),
    };
  };
  // s6: work in progress, Little's law, half speed; never a bare no, who chooses, the waiting list, the question
  S[5] = (b, p) => {
    const top = until(b, p, 3);
    const sq = (y, n, lab) => Array.from({ length: n }, (_, i) => rect(X0 + i * 18, y, 14, 14, 'pp-bar', 2)).join('') + txt(X1, y + 14, lab, 'pp-on', 'end');
    const q = b > 1 || (b === 1 && p > 0.55);
    return {
      head: b < 3 ? [tr('onderhanden werk', 'work in progress'), 'dia'] : [tr('nee zeggen', 'saying no'), 'dia'],
      wip: op(top * span(b === 0 ? p : 1, 0.05, 0.3), txt(X0, 72, tr('gestart, nog niet af', 'started, not yet done'), 'pp-lab')
        + sq(84, 12, q ? tr('≈ 4 kw', '≈ 4 qtrs') : '12') + sq(108, 6, q ? tr('≈ 2 kw', '≈ 2 qtrs') : '6')),
      little: op(top * at(b, p, 1), card(134, 112, b === 1 ? 'pp-hot' : 'pp-card') + lines(158, [[tr('wet van Little, 1961', 'Little’s law, 1961'), 'pp-lab'], [tr('uit de wachtrijtheorie', 'from queueing theory'), 'pp-mute'], [tr('doorlooptijd =', 'lead time ='), 'pp-on'], [tr('onderhanden werk ÷ doorzet', 'work in progress ÷ throughput')]])
        + op(at(b, p, 1, 0.5, 0.7), txt(X0, 270, tr('doorzet: 3 per kwartaal', 'throughput: 3 a quarter'), 'pp-mute'))),
      speed: op(top * at(b, p, 2), card(286, 62, 'pp-hot') + lines(310, [[tr('12 op halve snelheid', '12 at half speed')], [tr('< 6 op volle snelheid', '< 6 at full speed'), 'pp-on']])),
      no: op(at(b, p, 3), txt(X0, 76, tr('niet nu, en dit verdringt het', 'not now: what would go?'), 'pp-lab') + card(88, 90, 'pp-hot') + lines(112, [[tr('“Dat kan; dan stopt B', '“We can; then B stops')], [tr('of schuift 3 maanden.', 'or slips three months.')], [tr('Wat heeft je voorkeur?”', 'Which do you prefer?”'), 'pp-on']])),
      wait: op(at(b, p, 4), lines(212, [[tr('kiest: wie over allebei gaat', 'chooses: who owns both'), 'pp-lab'], [tr('wachtlijst, zichtbaar:', 'waiting list, visible:')]])
        + [0, 1].map((i) => rect(X0, 248 + i * 22, 180, 16, 'pp-bar2', 3)).join('') + txt(X1, 288, tr('niet nooit', 'not never'), 'pp-on', 'end')),
      ask: op(at(b, p, 4, 0.5, 0.7), card(306, 78, 'pp-hot') + lines(334, [[tr('Wat stoppen we om hier', 'What do we stop to make'), 'pp-on'], [tr('ruimte voor te maken?', 'room for this?'), 'pp-on']])),
    };
  };
  // s7: the same five people; the capacity matrix and its red rows; real availability
  S[6] = (b, p) => {
    const top = until(b, p, 2);
    const NX = X0 + 96;
    const CW = 28;
    const SX = NX + 4 * CW;
    let grid = txt(NX + CW * 2, 128, tr('projecten', 'projects'), 'pp-mute', 'middle')
      + ['A', 'B', 'C', 'D'].map((c, i) => txt(NX + i * CW + CW / 2, 152, c, 'pp-lab', 'middle')).join('')
      + txt(SX + 18, 152, tr('som', 'sum'), 'pp-mute', 'middle') + txt(X1 - 18, 152, tr('echt', 'real'), 'pp-mute', 'middle');
    let red = '';
    C.MATRIX.forEach((r, i) => {
      const y = 160 + i * 30;
      grid += txt(X0, y + 21, tr(r.nl, r.en), 'pp-txt');
      r.cells.forEach((v, j) => { grid += rect(NX + j * CW + 1, y, CW - 2, 28, 'pp-cell', 2) + txt(NX + j * CW + CW / 2, y + 21, String(v), 'pp-txt', 'middle'); });
      grid += txt(SX + 18, y + 21, String(r.sum), 'pp-txt', 'middle') + rect(X1 - 34, y, 32, 28, 'pp-cell', 2) + txt(X1 - 18, y + 21, String(r.has), 'pp-lab', 'middle');
      if (r.sum > r.has) red += rect(X0 - 4, y - 1, X1 - X0 + 8, 30, 'pp-cellr', 4) + txt(SX + 18, y + 21, String(r.sum), 'pp-redt', 'middle');
    });
    grid += txt(X0, 272, tr('per vakje: dagen per maand', 'per cell: days a month'), 'pp-mute');
    const wf = (y, d, cls, lab, labCls = 'pp-txt') => txt(X0, y, lab, labCls) + rect(X0, y + 8, (d / 260) * (X1 - X0), 16, cls, 3);
    return {
      head: b < 2 ? [tr('dezelfde mensen', 'the same people'), 'dia'] : [tr('echte dagen', 'real days'), 'dia'],
      five: op(top * span(b === 0 ? p : 1, 0.05, 0.25), lines(74, [[tr('dezelfde 5 mensen:', 'the same 5 people:'), 'pp-lab'], [tr('engineer, planner, analist', 'engineer, planner, analyst')]])),
      matrix: op(top * span(b === 0 ? p : 1, 0.35, 0.6), grid),
      red: op(top * at(b, p, 1, 0.1, 0.35), red + txt(X0, 300, tr('meer beloofd dan er is', 'more promised than there is'), 'pp-redt')
        + op(at(b, p, 1, 0.5, 0.7), txt(X0, 328, tr('= de meeste vertraging', '= most of the delay'), 'pp-on'))),
      avail: op(at(b, p, 2), wf(72, 260, 'pp-bar', tr('260 werkdagen', '260 weekdays'), 'pp-lab') + wf(120, 210, 'pp-bar', tr('− 50 vrij, ziek, opleiding', '− 50 leave, sick, training'))
        + wf(168, 190, 'pp-bar', tr('− 20 overleg, administratie', '− 20 meetings, admin')) + wf(216, 190, 'pp-acc', tr('= 190 echte dagen', '= 190 real days'), 'pp-lab')
        + op(at(b, p, 3), wf(264, 57, 'pp-acc', tr('× 30% = 57 projectdagen', '× 30% = 57 project days'), 'pp-on') + txt(X0, 318, tr('≈ 5 per maand', '≈ 5 a month'), 'pp-big')
          + txt(X0, 352, tr('“2 dagen per week”', '“2 days a week”')) + op(at(b, p, 3, 0.5, 0.7), strike(X0, 352, 190) + txt(X1, 378, tr('planningsfictie', 'planning fiction'), 'pp-redt', 'end')))),
    };
  };
  // s8: switching losses; a real block of time; two options, evenings, the signs, how full, the question
  S[7] = (b, p) => {
    const top = until(b, p, 2);
    const b0 = b === 0 ? p : 1;
    const loss = [[1, 0], [2, 20], [3, 40], [5, 75]];
    let chart = txt(X0, 72, tr('projecten · verlies', 'projects · time lost'), 'pp-mute');
    loss.forEach(([n, l], i) => {
      const y = 82 + i * 28;
      const bw = X1 - X0 - 92;
      chart += txt(X0 + 8, y + 17, String(n), 'pp-lab', 'middle') + rect(X0 + 24, y, bw, 22, 'pp-bar', 3)
        + op(span(b0, 0.1 + i * 0.1, 0.22 + i * 0.1), rect(X0 + 24 + bw * (1 - l / 100), y, bw * (l / 100), 22, 'pp-redf', 3) + txt(X1, y + 17, `${l}%`, l ? 'pp-redt' : 'pp-mute', 'end'));
    });
    chart += txt(X0, 214, tr('Weinberg, 1992: schatting', 'Weinberg, 1992: estimate'), 'pp-mute');
    const days = tr('ma di wo do vr', 'Mo Tu We Th Fr').split(' ');
    const block = days.map((d, i) => rect(X0 + i * 57, 262, 51, 34, i === 1 || i === 3 ? 'pp-acc' : 'pp-card', 4)
      + txt(X0 + i * 57 + 25, 286, i === 1 || i === 3 ? 'A' : '', 'pp-inv', 'middle') + txt(X0 + i * 57 + 25, 318, d, 'pp-mute', 'middle')).join('');
    return {
      head: b < 2 ? [tr('schakelen', 'switching'), 'dia'] : [tr('kiezen', 'choosing'), 'dia'],
      switch: op(top, chart + op(span(b0, 0.65, 0.8), txt(X0, 240, tr('elk wacht: doorlooptijd groeit', 'all wait: lead time grows'), 'pp-on'))),
      block: op(top * at(b, p, 1), block + txt(X0, 350, tr('een echt blok tijd', 'a real block of time'), 'pp-on')),
      opts: op(at(b, p, 2), card(56, 90, b === 2 ? 'pp-hot' : 'pp-card') + lines(80, [[tr('1: Jan A en B, C in mei', '1: Jan on A, B; C in May')], [tr('2: een externe doet C,', '2: a contractor on C,')], [tr('40 d à €1.000 = €40k', '40 d at €1,000 = €40k'), 'pp-on']])),
      evening: op(at(b, p, 3) * until(b, p, 4), lines(176, [[tr('geen stil avondwerk:', 'no quiet evenings:'), 'pp-lab'], [tr('verstopt de kosten,', 'it hides the cost,')], [tr('je besten branden op', 'your best burn out'), 'pp-redt']])),
      signals: op(at(b, p, 3, 0.25, 0.45), lines(262, [[tr('“ligt eigenlijk wel vast”', '“basically committed”'), 'pp-mute'], [tr('“ze redt het wel”', '“she’ll manage”'), 'pp-mute'], [tr('“leen hem een paar dagen”', '“just borrow him”'), 'pp-mute']])),
      full: op(at(b, p, 4), lines(176, [[tr('80% boeken, 20% reserve,', 'book 80%, keep 20%,'), 'pp-lab'], [tr('of 1 kwartaal vooruit', 'or plan a quarter ahead')]])),
      ask8: op(at(b, p, 4, 0.4, 0.6), card(326, 58, 'pp-hot') + lines(350, [[tr('Op wiens dagen rekenen', 'Whose days do we count on?'), 'pp-on'], [tr('we? Heeft zij het gezien?', 'Has she seen this plan?'), 'pp-on']])),
    };
  };
  // s9: Fatima's month: four projects at a day a week against her four days; March; the route; options
  S[8] = (b, p) => {
    const top = until(b, p, 3);
    const b0 = b === 0 ? p : 1;
    let weeks = '';
    for (let i = 0; i < 4; i++) {
      const x = X0 + i * 72;
      for (let j = 0; j < 4; j++) weeks += op(span(b0, 0.25 + j * 0.08 + i * 0.02, 0.35 + j * 0.08 + i * 0.02), rect(x, 210 - j * 18, 60, 14, j === 0 ? 'pp-bar' : 'pp-redf', 2));
      weeks += op(span(b0, 0.75, 0.88), rect(x - 2, 208, 64, 18, 'pp-real', 3)) + txt(x + 30, 248, tr(`wk ${i + 1}`, `wk ${i + 1}`), 'pp-mute', 'middle');
    }
    return {
      head: [tr('Fatima', 'Fatima'), 'ex'],
      fm: op(top * span(b0, 0.05, 0.2), lines(76, [[tr('Fatima, senior planner', 'Fatima, senior planner'), 'pp-lab'], [tr('4 projecten × 1 dag/week', '4 projects × 1 day a week')]])),
      claims: op(top, weeks + op(span(b0, 0.75, 0.88), txt(X0, 276, tr('16–17 gevraagd, 4 echt', '16–17 asked, 4 real'), 'pp-redt'))),
      march: op(top * at(b, p, 1), lines(306, [[tr('maart: pilot 8 dagen', 'March: pilot 8 days')], [tr('+ twee andere leiders', '+ two other leads'), 'pp-mute']])),
      route: op(top * at(b, p, 2), card(340, 40, 'pp-hot') + txt(X0, 367, tr('matrix → Fatima → eigenaar', 'matrix → Fatima → owner'), 'pp-on')),
      opts9: op(at(b, p, 3), lines(150, [[tr('opties:', 'options:'), 'pp-lab'], [tr('1: maart naar de pilot,', '1: March to the pilot,')], [tr('rest naar april en mei', 'the rest to April, May'), 'pp-mute'], [tr('2: planner van regio, 10 d', '2: regional planner, 10 d')], [tr('3: pilot een maand later', '3: pilot a month later')]])
        + op(at(b, p, 3, 0.55, 0.75), card(290, 70, 'pp-hot') + lines(318, [[tr('plan op het besluit,', 'plan on the decision,'), 'pp-on'], [tr('niet op hoop', 'not on hope'), 'pp-on']]))),
    };
  };

  // the A4 on the table: the dependencies fill in (s2 b4 on)
  function sheet(si, b, p) {
    const n = si === 1 ? (b < 3 ? 0 : span(p, 0.1, 0.7) * 6) : si > 1 ? 6 : 0;
    let s = '';
    for (let i = 0; i < 6; i++) {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += `<path class="pp-row" d="M2.5 ${f1(5 + i * 3.6)}H${f1(2.5 + (15 - (i % 3) * 2) * a)}"/>`;
    }
    return s;
  }
  // the month on the side wall: about five project days (s7), then the days asked against hers (s9)
  function month(si, b, p) {
    let s = '';
    const mark = (c, j, cls) => `<path class="${cls}" d="M${f1(c[0] + 3)} ${f1(c[3] - 4 - j * 6)}H${f1(c[2] - 3)}"/>`;
    if (si === 6 && b >= 3) C.CELLS.forEach((c, i) => { s += mark(c, 0, 'pp-cut'); if (i === 0) s += mark(c, 1, 'pp-cut'); });
    if (si === 8 && (b > 0 || p > 0.3)) C.CELLS.forEach((c) => { for (let j = 0; j < 4; j++) s += mark(c, j, j === 0 ? 'pp-line' : 'pp-cut'); });
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = S[si](b, p);
    const lab = o.head[1] === 'dia' ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    set(E.pHead, txt(X0, 38, o.head[0], 'pp-big') + txt(X1, 38, lab, 'pp-mute', 'end'));
    let mini = '';
    for (const c of C.SLOTS) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.sLines, sheet(si, b, p));
    set(E.cMarks, month(si, b, p));
  }

  return { render };
})();
