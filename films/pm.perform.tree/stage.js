// The stage of the film "Van strategie tot teamcijfer / From strategy to team
// number": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the examples'
// figures), CAM (one camera move per scene), W and H. Moves are placed per
// Dutch caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the right gets one
// card per scene, each block in its own cue group; a long card turns a page at
// a beat (the earlier blocks fade out, each having stood at least 4 s). The
// board in the room repeats the card in miniature.
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
  const tick = (x, y) => path(`M${f1(x - 7)} ${f1(y)}l5 5l10 -11`, 'pm-line');
  const strike = (x, y, w) => path(`M${f1(x - 2)} ${f1(y - 7)}H${f1(x + w)}`, 'pm-line');
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  const XM = (X0 + X1) / 2;
  const card = (y, h, body, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8) + body;
  // lines of [text, class] from y down, `step` apart
  const lines = (y, list, x = X0, step = 24) => list.map(([t, cls], i) => (t ? txt(x, y + i * step, t, cls || 'pm-txt') : '')).join('');
  const box = (x, y, w, h, t, cls = 'pm-card', tcls = 'pm-txt') => rect(x, y, w, h, cls, 5) + (t ? txt(x + w / 2, y + h / 2 + 7, t, tcls, 'middle') : '');
  const pts = (list) => `M${list.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}`;
  const CUES = ['kpi', 'few', 'lag', 'lead', 'won', 'bsc',
    'case', 'step1', 'def', 'step2', 'pair', 'grow', 'std', 'ask',
    'tree', 'drv', 'math', 'logic', 'owners', 'check',
    'grid', 'sum', 'crew', 'cascade', 'mult',
    'gst', 'accept', 'hard', 'base',
    'range', 'trig', 'cell', 'prop', 'amb', 'best',
    'goodhart', 'gaming', 'forms', 'cherry', 'perverse', 'wells',
    'spot', 'thr', 'bonus', 'back', 'fix', 'system'];

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
  const at = (b, p, k, a = 0.08, c = 0.4) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // a page of blocks shown from beat k0 up to (not with) beat k1, fading out over the start of k1
  const page = (b, p, k0, k1) => (b < k0 ? 0 : b < k1 ? 1 : b === k1 ? 1 - span(p, 0, 0.15) : 0);
  const SCH = () => tr('schema', 'diagram');
  const VB = () => tr('voorbeeld', 'example');

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  function s1(b, p) {
    const o = { head: [tr('cijfers die sturen', 'numbers that steer'), SCH()] };
    const A = page(b, p, 0, 2);
    const B = page(b, p, 2, 5);
    o.kpi = op(A, txt(X0, 80, 'KPI', 'pm-big') + txt(X1, 80, tr('kritieke prestatie-', 'key performance'), 'pm-mute', 'end')
      + txt(X1, 104, tr('indicator', 'indicator'), 'pm-mute', 'end')
      + op(at(b, p, 0, 0.1, 0.35), txt(X0, 136, tr('iemand handelt erop', 'someone acts on it'), 'pm-on'))
      + op(at(b, p, 0, 0.5, 0.75), txt(X0, 160, tr('anders: rapportagecijfer', 'else: a report figure'), 'pm-mute')));
    if (b >= 1) {
      // a wall of forty tiles; all but five fade to outlines
      const keep = [3, 12, 18, 25, 36];
      const fade = at(b, p, 1, 0.3, 0.6);
      let t = '';
      for (let i = 0; i < 40; i++) {
        const x = X0 + (i % 10) * 28.4;
        const y = 180 + Math.floor(i / 10) * 24;
        const a = at(b, p, 1, 0.02 + (i % 10) * 0.012, 0.1 + (i % 10) * 0.012);
        t += keep.includes(i) ? op(a, rect(x, y, 22, 18, 'pm-card', 3) + op(fade, rect(x, y, 22, 18, 'pm-fill', 3)))
          : op(a * (1 - 0.7 * fade), rect(x, y, 22, 18, 'pm-card', 3));
      }
      t += op(at(b, p, 1, 0.55, 0.8), lines(300, [[tr('3 tot 7 per team', '3 to 7 per team'), 'pm-on'], [tr('40 leest niemand', '40: read by nobody'), 'pm-txt']]))
        + lines(352, [[tr('top: een paar resultaten', 'board: a few results'), 'pm-mute'], [tr('team: wat het nu beweegt', 'team: what it moves now'), 'pm-mute']]);
      o.few = op(A * at(b, p, 1, 0.02, 0.15), t);
    }
    if (b >= 2) {
      o.lag = op(B, op(at(b, p, 2, 0.02, 0.2), txt(X0, 80, tr('achterlopend', 'lagging'), 'pm-on') + txt(X1, 80, tr('achteraf', 'afterwards'), 'pm-mute', 'end')
        + lines(106, [[tr('leverbetrouwbaarheid', 'on-time delivery'), 'pm-txt'], [tr('klantminuten verloren', 'customer minutes lost'), 'pm-mute'], [tr('kosten per aansluiting', 'cost per connection'), 'pm-mute']])));
    }
    if (b >= 3) {
      o.lead = op(B, op(at(b, p, 3, 0.02, 0.2), txt(X0, 194, tr('voorlopend', 'leading'), 'pm-on') + txt(X1, 194, tr('vooraf', 'beforehand'), 'pm-mute', 'end')
        + lines(220, [[tr('materiaal 2 dagen vooraf', 'materials 2 days ahead'), 'pm-txt'], [tr('preventief onderhoud', 'preventive maintenance'), 'pm-mute'], [tr('leeftijd werkvoorraad', 'age of the backlog'), 'pm-mute']])));
    }
    if (b >= 4) {
      o.won = op(B, op(at(b, p, 4), card(298, 76, lines(328, [[tr('achteraf: gewonnen?', 'lagging: did you win?'), 'pm-on'], [tr('vooraf: ga je winnen?', 'leading: will you win?'), 'pm-on']], X0 + 4, 28), 'pm-hot')));
    }
    if (b >= 5) {
      const q = NL ? [['financieel'], ['klant'], ['interne', 'processen'], ['leren en', 'groeien']] : [['financial'], ['customer'], ['internal', 'process'], ['learning', 'and growth']];
      let c = txt(X0, 80, 'balanced scorecard', 'pm-big') + txt(X0, 104, tr('Kaplan en Norton, 1992', 'Kaplan and Norton, 1992'), 'pm-mute');
      q.forEach((ls, i) => {
        const x = X0 + (i % 2) * 148;
        const y = 122 + Math.floor(i / 2) * 84;
        c += op(at(b, p, 5, 0.1 + i * 0.07, 0.18 + i * 0.07), rect(x, y, 136, 74, 'pm-card', 6)
          + ls.map((t, j) => txt(x + 68, y + 44 - (ls.length - 1) * 11 + j * 22, t, 'pm-txt', 'middle')).join(''));
      });
      c += op(at(b, p, 5, 0.6, 0.8), lines(318, [[tr('financieel alleen:', 'financial alone:'), 'pm-mute'], [tr('hoe het ging,', 'how you did,'), 'pm-txt'], [tr('niet waar je heen gaat', 'not where you head'), 'pm-txt']]));
      o.bsc = op(at(b, p, 5, 0, 0.1), c);
    }
    return o;
  }

  function s2(b, p) {
    const o = { head: [tr('late leveringen', 'late deliveries'), b === 2 || b >= 5 ? SCH() : VB()] };
    const A = page(b, p, 0, 3);
    const B = page(b, p, 3, 5);
    o.case = op(A, txt(X0, 80, tr('onderdelenfabrikant', 'parts manufacturer'), 'pm-big')
      + lines(104, [[tr('klachten: te laat', 'complaints: late'), 'pm-txt'], [tr('plantmanager: één KPI', 'plant manager: one KPI'), 'pm-mute']])
      + op(at(b, p, 0, 0.45, 0.7), lines(156, [[tr('leverbetrouwbaarheid', 'on-time delivery'), 'pm-on'], [tr('% orderregels, maandelijks', '% of order lines, monthly'), 'pm-mute']])));
    if (b >= 1) {
      o.step1 = op(A, op(at(b, p, 1, 0.02, 0.2), lines(214, [[tr('1  de definitie', '1  the definition'), 'pm-on'], [tr('bevestigde datum,', 'the confirmed date,'), 'pm-txt'], [tr('per orderregel, 0 te laat', 'per order line, 0 late'), 'pm-txt']], X0, 23))
        + op(at(b, p, 1, 0.65, 0.85), txt(X0, 283, tr('eigenaar: planningsleider', 'owner: the planning lead'), 'pm-mute')));
    }
    if (b >= 2) {
      o.def = op(A, op(at(b, p, 2), card(296, 88, lines(320, [[tr('ook: één bron, frequentie,', 'also: one source, a rhythm,'), 'pm-txt'], [tr('richting: hoger beter?', 'direction: higher better?'), 'pm-txt'], [tr('ruzie: 2 mensen, 1 naam', 'arguments: 2 people, 1 name'), 'pm-mute']], X0 + 2, 26))));
    }
    if (b >= 3) {
      o.step2 = op(B, op(at(b, p, 3, 0.02, 0.2), txt(X0, 80, tr('2  voorlopend, elke week', '2  leading, every week'), 'pm-on')
        + lines(108, [[tr('planningsnaleving', 'schedule adherence'), 'pm-txt'], [tr('op de bottleneck', 'at the bottleneck'), 'pm-mute']])
        + op(at(b, p, 3, 0.5, 0.75), lines(162, [[tr('orders vrij met', 'orders released with'), 'pm-txt'], [tr('al het materiaal', 'all materials in stock'), 'pm-mute']]))));
    }
    if (b >= 4) {
      const link = at(b, p, 4, 0.15, 0.3);
      o.pair = op(B, op(at(b, p, 4, 0.02, 0.2), txt(X0, 224, tr('3  gekoppeld', '3  paired'), 'pm-on')
        + box(X0, 238, 112, 34, tr('levering', 'delivery')) + op(link, path(`M${X0 + 116} 255h22`, 'pm-line') + box(X0 + 142, 238, 142, 34, 'first-pass yield', 'pm-hot'))
        + op(link, txt(X1, 294, tr('in één keer goed', 'right first time'), 'pm-mute', 'end'))
        + op(at(b, p, 4, 0.25, 0.4), lines(326, [[tr('output met kwaliteit', 'output with quality'), 'pm-mute'], [tr('snelheid met veiligheid', 'speed with safety'), 'pm-mute'], [tr('kosten met service', 'cost with service'), 'pm-mute']], X0, 22))));
    }
    if (b >= 5) {
      // a dashboard that grows every year
      let gr = txt(X0, 80, tr('in de praktijk', 'in practice'), 'pm-big');
      [8, 13, 19, 26].forEach((n, i) => {
        const a = at(b, p, 5, 0.05 + i * 0.08, 0.12 + i * 0.08);
        gr += op(a, rect(X0 + i * 40, 140 - n * 1.8, 30, n * 1.8, i === 3 ? 'pm-hot' : 'pm-card', 3));
      });
      gr += op(at(b, p, 5, 0.1, 0.3), lines(164, [[tr('toevoegen: makkelijk', 'adding: easy'), 'pm-txt'], [tr('weghalen: eng', 'removing: risky'), 'pm-txt'], [tr('vaak alleen achterlopend', 'often only lagging'), 'pm-mute']]));
      o.grow = op(at(b, p, 5, 0, 0.1), gr);
      o.std = op(at(b, p, 5, 0.6, 0.85), lines(242, [[tr('één set voor elk team?', 'one set for every team?'), 'pm-on'], [tr('makkelijk vergelijken, maar', 'easy to compare, but maybe'), 'pm-mute'], [tr('soms niet te bewegen', 'not one it can move'), 'pm-mute']]));
    }
    if (b >= 6) o.ask = op(at(b, p, 6), card(302, 84, lines(326, [[tr('toen dit rood werd:', 'when this went red:'), 'pm-on'], [tr('wat deed iemand', 'what did someone do'), 'pm-on'], [tr('toen anders?', 'differently?'), 'pm-on']], X0 + 4, 24), 'pm-hot'));
    return o;
  }

  function s3(b, p) {
    const o = { head: [tr('KPI-boom', 'KPI tree'), SCH()] };
    const A = page(b, p, 0, 2);
    const B = page(b, p, 2, 5);
    // a generic tree: the result, three drivers, six numbers a team controls
    const RX = X0 + 72;
    const DX = [X0, X0 + 102, X0 + 204];
    o.tree = op(A, txt(X0, 80, tr('KPI-boom', 'KPI tree'), 'pm-big') + txt(X1, 80, tr('ook: driverboom', 'or: driver tree'), 'pm-mute', 'end')
      + box(RX, 100, 140, 36, tr('resultaat', 'result'), 'pm-hot', 'pm-on')
      + op(at(b, p, 0, 0.45, 0.7), txt(XM, 160, tr('doorlooptijd, kosten per stuk', 'lead time, cost per unit'), 'pm-mute', 'middle'))
      + op(at(b, p, 0, 0.7, 0.9), txt(XM, 378, tr('de hele boom: één pagina', 'the whole tree: one page'), 'pm-mute', 'middle')));
    if (b >= 1) {
      let d = '';
      DX.forEach((x, i) => {
        const a = at(b, p, 1, 0.05 + i * 0.1, 0.15 + i * 0.1);
        d += op(a, path(`M${XM} 136V176H${f1(x + 40)}V196`, 'pm-line') + box(x, 196, 80, 32, 'driver'));
        [x + 2, x + 42].forEach((lx, j) => {
          d += op(at(b, p, 1, 0.45 + i * 0.08 + j * 0.03, 0.55 + i * 0.08 + j * 0.03), path(`M${f1(x + 40)} 228V244H${f1(lx + 18)}V258`, 'pm-line') + rect(lx, 258, 36, 26, 'pm-fill', 4));
        });
      });
      d += op(at(b, p, 1, 0.75, 0.95), txt(XM, 312, tr('hier stuurt een team', 'a team steers here'), 'pm-txt', 'middle'));
      d += op(at(b, p, 1, 0.02, 0.2), txt(XM, 346, tr('waar hangt dit van af?', 'what drives this?'), 'pm-on', 'middle'));
      o.drv = op(A, d);
    }
    // the press line as a math tree, rows down a trunk
    const ROWS = NL ? ['uren', '× draaiaandeel', '× stuks per draaiuur', '× aandeel goed'] : ['hours', '× running share', '× parts per running hour', '× good share'];
    const OWN = NL ? ['planning', 'onderhoud', 'engineering', 'kwaliteit'] : ['planning', 'maintenance', 'engineering', 'quality'];
    const ry = (i) => 154 + i * 44;
    if (b >= 2) {
      let m = txt(X0, 80, tr('rekenboom', 'math tree'), 'pm-big') + txt(X1, 80, tr('exact', 'exact'), 'pm-mute', 'end') + box(X0, 94, CW, 32, tr('goede output per week', 'good output per week'), 'pm-hot', 'pm-on');
      m += op(at(b, p, 2, 0.1, 0.3), path(`M${X0 + 10} 126V${ry(3) - 6}`, 'pm-line'));
      ROWS.forEach((t, i) => { m += op(at(b, p, 2, 0.15 + i * 0.12, 0.25 + i * 0.12), path(`M${X0 + 10} ${ry(i) - 6}h12`, 'pm-line') + txt(X0 + 28, ry(i), t)); });
      o.math = op(B, m);
    }
    if (b >= 3) {
      o.logic = op(B * at(b, p, 3), lines(330, [[tr('logische boom: geen formule', 'logic tree: no formula'), 'pm-on'], [tr('tevredenheid: snelheid,', 'satisfaction: speed,'), 'pm-txt'], [tr('kwaliteit en contact', 'quality and contact'), 'pm-txt']], X0, 23));
    }
    if (b >= 4) {
      let w = '';
      OWN.forEach((t, i) => { w += op(at(b, p, 4, 0.05 + i * 0.1, 0.15 + i * 0.1), txt(X0 + 28, ry(i) + 21, t, 'pm-mute')); });
      // the OEE bracket over the last three rows
      w += op(at(b, p, 4, 0.55, 0.8), path(`M${X1 - 22} ${ry(1) - 18}h10V${ry(3) + 26}h-10`, 'pm-line')
        + `<text class="pm-on" font-size="20" text-anchor="middle" transform="translate(${X1 - 2} ${f1((ry(1) + ry(3)) / 2 + 4)}) rotate(-90)">OEE</text>`);
      o.owners = op(B, w);
    }
    if (b >= 5) {
      // check with data: weekly values per branch; one hardly varies, one has the gap
      const series = [[5, 5, 5, 5, 5, 5, 5, 5], [6, 3, 7, 2, 6, 4, 2, 5], [5, 6, 5, 5, 6, 5, 5, 6], [4, 5, 3, 5, 4, 5, 4, 5]];
      const NAMES = NL ? ['uren', 'draaiaandeel', 'stuks/uur', 'aandeel goed'] : ['hours', 'running share', 'parts/hour', 'good share'];
      let c = txt(X0, 80, tr('toets met data', 'check with data'), 'pm-big');
      series.forEach((s, i) => {
        const y = 118 + i * 40;
        const a = at(b, p, 5, 0.03 + i * 0.04, 0.1 + i * 0.04);
        const line = pts(s.map((v, j) => [X0 + 156 + j * 18, y - v * 2.6 + 4]));
        c += op(a, txt(X0, y, NAMES[i], i === 1 ? 'pm-on' : 'pm-mute') + path(line, i === 1 ? 'pm-line' : 'pm-axis'));
      });
      c += op(at(b, p, 5, 0.1, 0.22), txt(X0, 290, tr('vlak? verklaart geen gat', 'flat? explains no gap'), 'pm-mute'))
        + op(at(b, p, 5, 0.2, 0.32), txt(X0, 316, tr('grootste gat: zoek daar', 'biggest gap: look there'), 'pm-txt'))
        + op(at(b, p, 5, 0.45, 0.6), txt(X0, 352, tr('stop bij een weekcijfer', 'stop at a weekly number'), 'pm-on'));
      o.check = op(at(b, p, 5, 0, 0.1), c);
    }
    return o;
  }

  function s4(b, p) {
    const o = { head: [tr('26 weken', '26 weeks'), b <= 2 ? VB() : SCH()] };
    const A = page(b, p, 0, 2);
    const NAMES = NL ? ['intake', 'ontwerp en vergunningen', 'wachten op een ploeg', 'uitvoering', 'meter plaatsen'] : ['intake', 'design and permits', 'waiting for a crew', 'execution', 'meter placement'];
    const big = at(b, p, 1, 0.45, 0.7);
    let gd = txt(X0, 80, tr('netbeheerder', 'grid operator'), 'pm-big') + txt(X1, 80, tr('26 weken', '26 weeks'), 'pm-on', 'end')
      + txt(X0, 104, tr('aanvraag tot aansluiting', 'request to connection'), 'pm-mute');
    C.STEPS.forEach((n, i) => {
      const y = 132 + i * 42;
      const a = at(b, p, 0, 0.2 + i * 0.1, 0.3 + i * 0.1);
      const hot = (n >= 9 ? big : 0);
      gd += op(a, txt(X0, y, NAMES[i], 'pm-txt') + rect(X0, y + 8, n * 18, 14, 'pm-card', 3) + op(hot, rect(X0, y + 8, n * 18, 14, 'pm-fill', 3))
        + txt(X0 + n * 18 + 8, y + 21, String(n), 'pm-mute'));
    });
    o.grid = op(A, gd);
    if (b >= 1) {
      o.sum = op(A, op(at(b, p, 1, 0.02, 0.25), txt(X0, 360, '3 + 9 + 10 + 1 + 3 = 26', 'pm-on') + txt(X1, 384, tr('som: rekenboom', 'sum: a math tree'), 'pm-mute', 'end'))
        + op(at(b, p, 1, 0.5, 0.7), txt(X1, 279, tr('weinig te halen', 'little to win'), 'pm-mute', 'end')));
    }
    if (b === 2 || b === 3) {
      o.crew = op(b === 2 ? span(p, 0.05, 0.18) : 1 - span(p, 0, 0.15), txt(X0, 80, tr('wachten op een ploeg', 'waiting for a crew'), 'pm-big')
        + box(XM - 70, 96, 140, 32, tr('10 weken', '10 weeks'), 'pm-hot', 'pm-on')
        + op(at(b, p, 2, 0.1, 0.22), path(`M${XM} 128V142H${X0 + 68}V154M${XM} 142H${X1 - 68}V154`, 'pm-line')
          + rect(X0, 154, 136, 52, 'pm-card', 5) + txt(X0 + 68, 176, tr('te weinig', 'too few'), 'pm-txt', 'middle') + txt(X0 + 68, 198, tr('ploegen?', 'crews?'), 'pm-txt', 'middle')
          + rect(X1 - 136, 154, 136, 52, 'pm-card', 5) + txt(X1 - 68, 176, tr('klus terug:', 'bounced back:'), 'pm-txt', 'middle') + txt(X1 - 68, 198, tr('niet klaar?', 'not ready?'), 'pm-txt', 'middle'))
        + op(at(b, p, 2, 0.25, 0.38), lines(236, [[tr('elke stap: één eigenaar', 'each step: one owner'), 'pm-txt'], [tr('en één weekcijfer', 'and one weekly number'), 'pm-txt']]))
        + op(at(b, p, 2, 0.38, 0.52), card(282, 100, lines(306, [[tr('door de gereedheidscheck', 'passing the readiness check'), 'pm-on'], [tr('ontwerp, vergunning en', 'design, permit and'), 'pm-mute'], [tr('materiaal klaar, vóór de', 'materials in place before'), 'pm-mute'], [tr('ploeg wordt ingepland', 'a crew is booked'), 'pm-mute']], X0 + 2, 22), 'pm-hot')));
    }
    if (b >= 3) {
      o.cascade = op(at(b, p, 3, 0, 0.12), txt(X0, 80, tr('doorvertalen', 'cascading'), 'pm-big')
        + op(at(b, p, 3, 0.15, 0.35), txt(X0, 112, tr('doorlooptijd −20%', 'lead time −20%'), 'pm-mute') + strike(X0, 112, NL ? 168 : 136) + txt(X1, 112, tr('slogan', 'slogan'), 'pm-on', 'end'))
        + op(at(b, p, 3, 0.45, 0.7), lines(146, [[tr('klussen op geplande dag:', 'jobs on the planned day:'), 'pm-txt'], [tr('70% → 85%: teamcijfer', '70% → 85%: team number'), 'pm-on']]))
        + op(at(b, p, 3, 0.75, 0.95), txt(X0, 204, tr('eigen driver, geen plakje', 'own driver, not a slice'), 'pm-mute')));
    }
    if (b >= 4) {
      o.mult = op(at(b, p, 4, 0.02, 0.2), txt(X0, 244, NL ? '1,1 × 1,1 × 1,1 × 1,1 ≈ 1,46' : '1.1 × 1.1 × 1.1 × 1.1 ≈ 1.46', 'pm-on')
        + txt(X0, 268, tr('vier takken +10%: +46%', 'four branches +10%: +46%'), 'pm-txt')
        + op(at(b, p, 4, 0.45, 0.65), lines(294, [[tr('mis: één keer getekend,', 'wrong: drawn once,'), 'pm-mute'], [tr('overlap, geen eigenaar', 'overlap, no owner'), 'pm-mute']], X0, 22))
        + op(at(b, p, 4, 0.22, 0.38), card(334, 50, lines(355, [[tr('tak +10%: wat gebeurt', 'branch +10%: what'), 'pm-on'], [tr('er bovenaan?', 'happens at the top?'), 'pm-on']], X0 + 2, 22), 'pm-hot')));
    }
    return o;
  }

  function s5(b, p) {
    const o = { head: [tr('doelen', 'targets'), SCH()] };
    const A = page(b, p, 0, 2);
    o.gst = op(A, txt(X0, 80, tr('doelzettingstheorie', 'goal-setting theory'), 'pm-big')
      + lines(104, [[tr('Locke en Latham, 2002', 'Locke and Latham, 2002'), 'pm-mute'], [tr('zo’n 400 studies', 'some 400 studies'), 'pm-mute']])
      + op(at(b, p, 0, 0.4, 0.6), txt(X0, 166, tr('doe je best', 'do your best'), 'pm-mute') + rect(X0, 174, 110, 16, 'pm-card', 3))
      + op(at(b, p, 0, 0.6, 0.8), txt(X0, 214, tr('specifiek en moeilijk', 'specific and hard'), 'pm-on') + rect(X0, 222, 270, 16, 'pm-fill', 3)));
    if (b >= 1) {
      const items = NL ? ['doelacceptatie', 'de vaardigheid', 'feedback'] : ['goal acceptance', 'the skills', 'feedback'];
      let t = txt(X0, 268, tr('mits:', 'as long as:'), 'pm-mute');
      items.forEach((s, i) => { t += op(at(b, p, 1, 0.1 + i * 0.12, 0.2 + i * 0.12), tick(X0 + 8, 288 + i * 26) + txt(X0 + 30, 294 + i * 26, s)); });
      t += op(at(b, p, 1, 0.6, 0.85), txt(X0, 376, tr('geen geloof: een wens', 'not believed: a wish'), 'pm-on'));
      o.accept = op(A, t);
    }
    if (b >= 2) {
      o.hard = op(at(b, p, 2, 0, 0.12), txt(X0, 80, tr('te moeilijk?', 'too hard?'), 'pm-big')
        + lines(106, [[tr('mensen haken af', 'people give up'), 'pm-txt'], [tr('of overdrijven, 2004:', 'or overstate, 2004:'), 'pm-txt'], [tr('Schweitzer, Ordóñez,', 'Schweitzer, Ordóñez,'), 'pm-mute'], [tr('Douma; vooral net gemist', 'Douma; esp. narrowly missed'), 'pm-mute']])
        + op(at(b, p, 2, 0.6, 0.85), txt(X0, 214, tr('een weg, niet alleen druk', 'a path, not only pressure'), 'pm-on')));
    }
    if (b >= 3) {
      // eight weeks around a baseline; the best weeks ringed
      const v = [5, 3, 6, 4, 5, 2, 6, 3];
      let c = txt(X0, 256, tr('nulmeting, niet +10%', 'baseline, not +10%'), 'pm-on');
      c += op(at(b, p, 3, 0.15, 0.35), path(`M${X0} 296H${X1}`, 'pm-dash'));
      v.forEach((n, i) => {
        const x = X0 + 16 + i * 36;
        const y = 270 + n * 8;
        c += op(at(b, p, 3, 0.1 + i * 0.04, 0.16 + i * 0.04), dot(x, y, 5, 'pm-dot')) + (n <= 3 ? op(at(b, p, 3, 0.22, 0.34), dot(x, y, 10, 'pm-ring')) : '');
      });
      c += op(at(b, p, 3, 0.28, 0.4), txt(X0, 350, tr('beste weken: wat werkte?', 'best weeks: what worked?'), 'pm-txt'))
        + op(at(b, p, 3, 0.65, 0.8), txt(X0, 376, tr('verder? zeg wat verandert', 'beyond? say what changes'), 'pm-mute'));
      o.base = op(at(b, p, 3, 0, 0.12), c);
    }
    return o;
  }

  function s6(b, p) {
    const o = { head: [tr('uitval op één cel', 'scrap on one cell'), b === 0 || b === 4 ? SCH() : VB()] };
    const A = page(b, p, 0, 1);
    // the generic range (b0)
    let r = txt(X0, 80, tr('bandbreedte', 'target range'), 'pm-big') + rect(X0, 100, CW, 52, 'pm-band', 4) + path(`M${X0} 126H${X1}`, 'pm-dash');
    const wob = [124, 112, 136, 118, 130, 108, 140, 122, 116, 132];
    wob.forEach((y, i) => { r += op(at(b, p, 0, 0.05 + i * 0.03, 0.1 + i * 0.03), dot(X0 + 14 + i * 28, y, 4.5, 'pm-dot')); });
    r += lines(186, [[tr('tussen 83 en 87%', 'between 83 and 87%'), 'pm-txt'], [tr('mikpunt 85', 'aiming for 85'), 'pm-mute']])
      + op(at(b, p, 0, 0.25, 0.4), txt(X0, 236, tr('één punt: elke dip faalt', 'one point: every dip fails'), 'pm-mute'));
    o.range = op(A, r);
    o.trig = op(A * at(b, p, 0, 0.4, 0.55), path(`M${X0} 168H${X1}`, 'pm-dash') + lines(276, [[tr('actiegrens', 'trigger'), 'pm-on'], [tr('elke week onder 80%:', 'any week below 80%:'), 'pm-txt'], [tr('stop, zoek de oorzaak', 'stop, find the cause'), 'pm-txt']]));
    // the cell's eight weeks of scrap on a chart (b1 to b3)
    const CB = page(b, p, 1, 4);
    const cx = (i) => X0 + 46 + i * 32;
    const cy = (v) => 262 - v * 24;
    if (b >= 1) {
      let c = txt(X0, 80, tr('verspaningscel', 'machining cell'), 'pm-big') + txt(X1, 80, tr('uitval, %', 'scrap, %'), 'pm-mute', 'end')
        + path(`M${X0 + 30} ${cy(0)}H${X1}`, 'pm-axis') + txt(X0 + 22, cy(5) + 7, '5', 'pm-mute', 'end') + txt(X0 + 22, cy(1) + 7, '1', 'pm-mute', 'end');
      const n = Math.max(1, Math.ceil(at(b, p, 1, 0.05, 0.5) * 8));
      c += path(pts(C.SCRAP.slice(0, n).map((v, i) => [cx(i), cy(v)])), 'pm-line') + C.SCRAP.slice(0, n).map((v, i) => dot(cx(i), cy(v), 4, 'pm-dot')).join('');
      c += op(at(b, p, 1, 0.5, 0.65) * (b === 1 ? 1 : b === 2 ? 1 - span(p, 0, 0.15) : 0), path(`M${X0 + 30} ${f1(cy(4.1))}H${X1}`, 'pm-dash') + txt(X1, cy(4.1) - 8, tr('gem. 4,1', 'avg 4.1'), 'pm-mute', 'end'));
      c += op(at(b, p, 1, 0.7, 0.9), path(`M${X0 + 30} ${cy(1)}H${X1}`, 'pm-line') + txt(X1, cy(1) - 8, tr('management: 1%?', 'management: 1%?'), 'pm-on', 'end'));
      o.cell = op(CB, c);
    }
    if (b >= 2) {
      o.prop = op(CB, op(at(b, p, 2, 0.05, 0.3), rect(X0 + 30, cy(4), CW - 30, 24, 'pm-band', 2) + path(`M${X0 + 30} ${cy(3.5)}H${X1}`, 'pm-dash'))
        + op(at(b, p, 2, 0.4, 0.6), path(`M${X0 + 30} ${cy(5)}H${X1}`, 'pm-dash') + txt(X1, cy(5) - 8, tr('boven 5: actiegrens', 'above 5: trigger'), 'pm-on', 'end'))
        + op(b === 2 ? at(b, p, 2, 0.1, 0.3) : b === 3 ? 1 - span(p, 0, 0.15) : 0, lines(292, [[tr('3,0 tot 4,0%, mikpunt 3,5', '3.0 to 4.0%, aiming for 3.5'), 'pm-on'], [tr('beste weken: 3,3 en 3,6', 'best weeks: 3.3 and 3.6'), 'pm-mute'], [tr('na 8 weken evalueren', 'review after 8 weeks'), 'pm-mute']])));
    }
    if (b === 3) {
      o.amb = op(at(b, p, 3, 0.1, 0.3), lines(292, [[tr('de oorzaak van het', 'root cause of the'), 'pm-txt'], [tr('grootste defect: dan', 'biggest defect: then'), 'pm-txt'], [tr('kan 1% later. Zeg het.', '1% later. Say so.'), 'pm-on']]));
    }
    if (b >= 4) {
      o.best = op(at(b, p, 4, 0, 0.12), txt(X0, 80, tr('betrek het team', 'involve the team'), 'pm-big')
        + lines(106, [[tr('haalbaar in 3 maanden?', 'realistic in 3 months?'), 'pm-txt'], [tr('wat moet er dan anders?', 'what must change for more?'), 'pm-txt'], [tr('onder hun beste weken?', 'below their best weeks?'), 'pm-mute'], [tr('vraag waarom', 'ask why'), 'pm-mute']])
        + op(at(b, p, 4, 0.2, 0.35), txt(X0, 218, tr('de ambitie blijft van jou', 'the ambition stays yours'), 'pm-on'))
        + op(at(b, p, 4, 0.35, 0.5), lines(254, [[tr('stretch ver voorbij data:', 'stretch far beyond data:'), 'pm-mute'], [tr('nieuw, of vooral cynisme?', 'new methods, or cynicism?'), 'pm-mute']]))
        + op(at(b, p, 4, 0.7, 0.9), card(300, 78, lines(328, [[tr('beste week een', 'best week a'), 'pm-on'], [tr('gewone week?', 'normal week?'), 'pm-on']], X0 + 4, 28), 'pm-hot')));
    }
    return o;
  }

  function s7(b, p) {
    const o = { head: [tr('wet van Goodhart', 'Goodhart’s law'), SCH()] };
    const A = page(b, p, 0, 2);
    const B = page(b, p, 2, 4);
    o.goodhart = op(A, txt(X0, 80, tr('wet van Goodhart', 'Goodhart’s law'), 'pm-big')
      + lines(104, [[tr('econoom Goodhart, 1975:', 'economist Goodhart, 1975:'), 'pm-mute'], [tr('een stuurcijfer gaat zich', 'a statistic used to steer'), 'pm-mute'], [tr('anders gedragen', 'starts to behave differently'), 'pm-mute']], X0, 22)
      + op(at(b, p, 0, 0.2, 0.45), lines(182, NL ? [['“Zodra een maatstaf een'], ['doel wordt, is het geen'], ['goede maatstaf meer.”']] : [['“When a measure becomes'], ['a target, it ceases to'], ['be a good measure.”']], X0, 24))
      + op(at(b, p, 0, 0.5, 0.7), txt(X0, 256, tr('Marilyn Strathern, 1997', 'Marilyn Strathern, 1997'), 'pm-mute')));
    if (b >= 1) {
      // a number pushed up while the work under it stays flat
      const up = at(b, p, 1, 0.2, 0.6);
      o.gaming = op(A, op(at(b, p, 1, 0.02, 0.2), txt(X0, 290, 'gaming', 'pm-on')
        + path(pts([[X1 - 90, 330], [X1 - 60, 326], [X1 - 30, 330 - 16 * up], [X1, 330 - 32 * up]]), 'pm-line') + path(`M${X1 - 90} 360H${X1}`, 'pm-dash')
        + txt(X0, 314, tr('het cijfer beweegt,', 'the number moves,'), 'pm-txt') + txt(X0, 338, tr('het werk niet', 'the work does not'), 'pm-txt')
        + op(at(b, p, 1, 0.6, 0.85), txt(X0, 368, tr('de goedkoopste weg', 'the cheapest way'), 'pm-mute'))));
    }
    if (b >= 2) {
      o.forms = op(B, op(at(b, p, 2, 0.02, 0.2), txt(X0, 80, tr('bekende vormen', 'typical forms'), 'pm-big')
        + lines(108, [[tr('net buiten de periode', 'just outside the period'), 'pm-txt'], [tr('definitie veranderen', 'redefining what counts'), 'pm-txt'], [tr('sjoemelen met data', 'fudging the data'), 'pm-txt']])));
      o.cherry = op(B, op(at(b, p, 2, 0.6, 0.8), lines(190, [[tr('krenten uit de pap', 'cherry-picking'), 'pm-on'], [tr('makkelijke klussen eerst', 'easy jobs first'), 'pm-mute']])));
    }
    if (b >= 3) {
      o.perverse = op(B, op(at(b, p, 3, 0.02, 0.2), lines(256, [[tr('verkeerde prikkel', 'perverse incentive'), 'pm-on'], [tr('lokt het omgekeerde uit', 'encourages the opposite'), 'pm-txt']])
        + op(at(b, p, 3, 0.45, 0.65), lines(314, [[tr('Steve Kerr, 1975:', 'Steve Kerr, 1975:'), 'pm-mute'], [tr('“A belonen, op B hopen”', '“Rewarding A, hoping for B”'), 'pm-txt']]))));
    }
    if (b >= 4) {
      o.wells = op(at(b, p, 4, 0, 0.12), txt(X0, 80, 'Wells Fargo', 'pm-big') + txt(X0, 104, tr('agressieve verkoopdoelen', 'aggressive sales targets'), 'pm-mute')
        + op(at(b, p, 4, 0.06, 0.2), lines(138, [[tr('2016: 1,5 mln rekeningen', '2016: 1.5m accounts'), 'pm-txt'], [tr('en 565.000 creditcards', 'and 565,000 credit cards'), 'pm-txt'], [tr('later: tot 3,5 mln', 'later: up to 3.5m'), 'pm-txt']]))
        + op(at(b, p, 4, 0.14, 0.28), lines(220, [[tr('boete 2016: $185 mln', 'fines 2016: $185m'), 'pm-mute'], [tr('2020: $3 mrd schikking', '2020: $3bn settlement'), 'pm-mute']]))
        + op(at(b, p, 4, 0.5, 0.65), card(268, 86, lines(296, [[tr('niemand ontwierp fraude;', 'nobody designed fraud;'), 'pm-on'], [tr('de druk maakte het', 'the pressure made it'), 'pm-txt'], [tr('de makkelijkste weg', 'the easiest way'), 'pm-txt']], X0 + 2, 26), 'pm-hot')));
    }
    return o;
  }

  function s8(b, p) {
    const o = { head: [tr('de klok stilzetten', 'stopping the clock'), b === 0 || b === 4 ? SCH() : VB()] };
    const A = page(b, p, 0, 1);
    // results piling up just above the line between red and green
    const bins = [2, 3, 4, 5, 4, 1, 1, 9, 6, 4, 3, 2];
    let th = path(`M${X0} 176H${X1}`, 'pm-dash') + txt(X1, 168, tr('grenswaarde', 'threshold'), 'pm-on', 'end');
    bins.forEach((n, i) => {
      const x = X0 + 4 + i * 23.5;
      th += op(at(b, p, 0, 0.2 + i * 0.015, 0.26 + i * 0.015), rect(x, 220 - n * 8, 18, n * 8, i === 7 ? 'pm-hot' : 'pm-card', 2));
    });
    o.spot = op(A, txt(X0, 80, tr('herken het', 'spot it'), 'pm-big')
      + op(at(b, p, 0, 0.05, 0.25), lines(250, [[tr('cijfer beter, rest niet', 'number up, nothing else'), 'pm-txt'], [tr('sprong vlak voor deadline', 'jump before the deadline'), 'pm-txt'], [tr('gekoppeld: verkeerde kant,', 'paired: the wrong way,'), 'pm-mute'], [tr('levering op, klachten ook', 'delivery up, complaints too'), 'pm-mute']]))
      + op(at(b, p, 0, 0.35, 0.5), lines(354, [[tr('vraag de vloer: wat doen', 'ask the floor: what do'), 'pm-on'], [tr('mensen voor groen?', 'people do for green?'), 'pm-on']])));
    o.thr = op(A * at(b, p, 0, 0.15, 0.3), th + path(`M${X0 + 4} 220H${X1}`, 'pm-axis'));
    const B = page(b, p, 1, 3);
    // two small charts over the quarter: restored within 4 hours, and repeats within 30 days
    const LX = X0;
    const RX = X0 + 152;
    const CWm = 132;
    if (b >= 1) {
      const t = at(b, p, 1, 0.2, 0.7);
      const y = (v) => 222 - (v - 80) * 4.6;
      o.bonus = op(B, txt(X0, 80, tr('netbeheerder', 'grid operator'), 'pm-big') + txt(X1, 80, tr('teambonus', 'team bonus'), 'pm-mute', 'end')
        + lines(110, [[tr('verholpen', 'restored'), 'pm-txt'], [tr('binnen 4 uur', 'within 4 hours'), 'pm-txt']], LX)
        + path(`M${LX} 226H${LX + CWm}`, 'pm-axis') + path(pts([[LX + 6, y(88)], [LX + 6 + (CWm - 12) * t, y(lerp(88, 97, t))]]), 'pm-line')
        + txt(LX, 250, '88%', 'pm-mute') + op(t, txt(LX + CWm, 250, '97%', 'pm-on', 'end')));
    }
    if (b >= 2) {
      const t = at(b, p, 2, 0.15, 0.6);
      const y = (v) => 222 - v * 5;
      o.back = op(B, lines(110, [[tr('terug binnen', 'back within'), 'pm-txt'], [tr('30 dagen', '30 days'), 'pm-txt']], RX)
        + path(`M${RX} 226H${X1}`, 'pm-axis') + path(pts([[RX + 6, y(6)], [RX + 6 + (CWm - 12) * t, y(lerp(6, 14, t))]]), 'pm-line')
        + txt(RX, 250, '6', 'pm-mute') + op(t, txt(X1, 250, tr('14 per 100', '14 per 100'), 'pm-on', 'end'))
        + op(at(b, p, 2, 0.65, 0.85), card(282, 86, lines(310, [[tr('vermoeden:', 'the suspicion:'), 'pm-mute'], [tr('tijdelijke oplossingen', 'temporary fixes'), 'pm-on'], [tr('zetten de klok stil', 'stop the clock'), 'pm-on']], X0 + 2, 26), 'pm-hot')));
    }
    if (b === 3) {
      o.fix = op(at(b, p, 3, 0, 0.12), txt(X0, 80, tr('check, beschuldig niet', 'check, don’t accuse'), 'pm-big')
        + lines(108, [[tr('naast de vervolgwerkorders', 'vs follow-up work orders'), 'pm-txt'], [tr('vraag de ploegen', 'ask the crews'), 'pm-txt']])
        + op(at(b, p, 3, 0.45, 0.7), lines(176, [[tr('dan het systeem:', 'then fix the system:'), 'pm-mute'], [tr('koppel aan terugkomers', 'pair with repeat outages'), 'pm-on'], [tr('bonus los van één cijfer', 'bonus off the one number'), 'pm-on']])));
    }
    if (b >= 4) {
      o.system = op(at(b, p, 4, 0, 0.12), txt(X0, 80, tr('pak het systeem aan', 'fix the system'), 'pm-big')
        + txt(X0, 106, tr('zelden slechte mensen', 'rarely bad people'), 'pm-txt')
        + op(at(b, p, 4, 0.12, 0.27), lines(140, [[tr('zet cijfers in paren', 'pair the numbers'), 'pm-mute'], [tr('sommige: alleen leren', 'some for learning only'), 'pm-mute'], [tr('definitie aanpassen', 'change the definition'), 'pm-mute'], [tr('kijk naar het werk', 'look at the work'), 'pm-mute']]))
        + op(at(b, p, 4, 0.27, 0.42), lines(248, [[tr('bonus aan losse KPI’s?', 'bonuses on single KPIs?'), 'pm-txt'], [tr('daarover is discussie', 'experts argue'), 'pm-mute']]))
        + op(at(b, p, 4, 0.5, 0.65), card(296, 82, lines(324, [[tr('halen zonder iets te', 'hit it without improving'), 'pm-on'], [tr('verbeteren: hoe dan?', 'anything: how?'), 'pm-on']], X0 + 4, 28), 'pm-hot')));
    }
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8];

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    let mini = '';
    for (const c of CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
  }

  return { render };
})();
