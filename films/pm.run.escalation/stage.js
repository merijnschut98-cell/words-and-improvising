// The stage of the film "Van oranje naar rood / From amber to red": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C (the example's numbers and the
// calendar cells), CAM (one camera move per scene), W and H. Moves are placed
// per caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the right gets one
// card per scene; the board in the room repeats it in miniature, the calendar
// strip carries the example's weeks and the decision log on the table fills in.
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
  const dia = (x, y, s = 9, cls = 'pm-dia') => path(`M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z`, cls);
  const tick = (x, y) => path(`M${f1(x - 7)} ${f1(y)}l5 5l10 -11`, 'pm-line');
  const X0 = 334;
  const X1 = 618;
  const CUES = ['rag', 'mile', 'wk', 'melon', 'reports', 'cheap', 'fore', 'ques', 'gov', 'rights', 'tol', 'slip', 'owner', 'quote', 'slide', 'esc', 'call', 'route', 'log', 'case', 'opts', 'advice', 'crit', 'dflt', 'ask', 'test', 'doors', 'commit', 'group', 'agenda', 'open', 'mandate'];

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

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], body, <cue>: svg }.
  function s1(b, p) {
    const o = { head: [tr('status', 'status'), tr('schema', 'diagram')] };
    const rows = [
      ['esc-g', tr('groen', 'green'), tr('op koers, zonder hulp', 'on track, no extra help')],
      ['esc-a', tr('oranje', 'amber'), tr('team herstelt zelf', 'the team recovers')],
      ['esc-r', tr('rood', 'red'), tr('stuurgroep moet ingrijpen', 'steering group must act')],
    ];
    let rag = '';
    rows.forEach(([cls, name, def], i) => {
      const y = 76 + i * 56;
      const a = b >= 1 ? 1 : 0;
      if (b >= 3 && i === 2) rag += rect(X0 - 4, y - 22, X1 - X0 + 8, 52, 'pm-hot', 8);
      rag += op(a, dot(X0 + 10, y - 6, 9, cls) + txt(X0 + 28, y, name, 'pm-big'));
      rag += op(at(b, p, 2, 0.05 + i * 0.25, 0.25 + i * 0.25), txt(X0 + 28, y + 24, def));
    });
    o.rag = rag;
    if (b >= 3) o.body = op(span(p, 0.4, 0.7), txt(X0, 248, tr('rood: een besluit nodig', 'red: a decision needed'), 'pm-on'));
    // the example's weeks: access promised for week 5, now week 11; the pilot milestone in week 8
    const ax = (wk) => X0 + 10 + wk * 22.5;
    let wk = txt(X0, 284, tr('week 6', 'week 6'), 'pm-big') + txt(X1, 284, tr('voorbeeld', 'example'), 'pm-mute', 'end');
    let ticks = '';
    for (let i = 0; i <= 12; i++) ticks += `M${f1(ax(i))} 330v${i % 2 ? 4 : 7}`;
    wk += path(`M${f1(ax(0))} 330H${f1(ax(12))}${ticks}`, 'pm-axis');
    for (let i = 0; i <= 12; i += 2) wk += txt(ax(i), 356, String(i), 'pm-mute', 'middle');
    wk += path(`M${f1(ax(6))} 296V338`, 'pm-dash');
    const late = b === 0 ? span(p, 0.45, 0.85) : 1;
    wk += dot(ax(5), 308, 6, 'pm-ring') + op(late, path(`M${f1(ax(5) + 6)} 308H${f1(lerp(ax(5), ax(11), late) - 6)}`, 'pm-dash') + dot(ax(11), 308, 6, 'pm-dot'));
    wk += txt(ax(4.2), 315, tr('toegang', 'access'), 'pm-txt', 'end');
    o.wk = wk;
    o.mile = dia(ax(8), 330, 10) + txt(ax(8) + 14, 384, tr('pilot start', 'pilot starts'), 'pm-txt', 'middle');
    return o;
  }

  function s2(b, p) {
    const o = { head: [tr('watermeloen', 'watermelon'), tr('schema', 'diagram')] };
    if (b <= 2) {
      const a = b === 0 ? span(p, 0.35, 0.75) : 1;
      const cx = 476;
      const cy = 128;
      const r = 58;
      const whole = dot(cx, cy, r, 'esc-g') + path(`M${cx - 30} ${cy - 50}Q${cx - 44} ${cy} ${cx - 30} ${cy + 50}M${cx} ${cy - r}V${cy + r}M${cx + 30} ${cy - 50}Q${cx + 44} ${cy} ${cx + 30} ${cy + 50}`, 'pm-line');
      let seeds = '';
      for (const [dx, dy] of [[-30, 14], [-12, 30], [8, 18], [26, 34], [-2, 44], [36, 14]]) seeds += dot(cx + dx, cy + dy - 6, 2.6, 'pm-dot');
      const slice = path(`M${cx - r} ${cy - 10}A${r} ${r} 0 0 0 ${cx + r} ${cy - 10}Z`, 'esc-r') + path(`M${cx - r + 4} ${cy - 10}A${r - 4} ${r - 4} 0 0 0 ${cx + r - 4} ${cy - 10}`, 'esc-gs') + seeds;
      o.melon = op(1 - a, whole) + op(a, slice);
      o.melon += op(a, txt(X0, 80, tr('buiten', 'outside'), 'pm-mute') + txt(X0, 104, tr('groen', 'green'), 'pm-txt') + txt(X1, 168, tr('binnen', 'inside'), 'pm-mute', 'end') + txt(X1, 192, tr('rood', 'red'), 'pm-txt', 'end'));
      // the weekly reports: green until two weeks before the end, then red
      if (b >= 1) {
        let rep = txt(X0, 226, tr('rapport per week', 'report each week'), 'pm-mute');
        for (let i = 0; i < 10; i++) {
          const show = b > 1 ? 1 : span(p, 0.05 + i * 0.05, 0.1 + i * 0.05);
          rep += op(show, rect(X0 + i * 28, 238, 22, 22, i >= 8 ? 'esc-r' : 'esc-g', 4));
        }
        rep += op(b > 1 ? 1 : span(p, 0.6, 0.8), txt(X1, 290, tr('einddatum', 'deadline'), 'pm-mute', 'end') + path(`M${X1 - 6} 262V272`, 'pm-axis'));
        rep += op(b > 1 ? 1 : span(p, 0.5, 0.8), txt(X0, 290, tr('MUM-effect', 'MUM effect'), 'pm-on') + txt(X0, 316, tr('Rosen en Tesser, 1970', 'Rosen and Tesser, 1970'), 'pm-mute'));
        o.reports = rep;
      }
      if (b >= 2) o.cheap = op(at(b, p, 2, 0.1, 0.4), txt(X0, 348, tr('vroeg: goedkoop', 'early: cheap'), 'pm-on')) + op(at(b, p, 2, 0.5, 0.8), txt(X0, 374, tr('laat: duur', 'late: expensive'), 'pm-txt'));
    } else {
      const a = b === 3 ? span(p, 0.05, 0.35) : 1;
      o.body = op(a, txt(X0, 82, tr('voortgang', 'progress'), 'pm-mute') + txt(X0, 108, tr('70% van de taken af', '70% of tasks done'), 'pm-txt') + path(`M${X0} 101H${X0 + 196}`, 'pm-dash'));
      o.fore = op(b === 3 ? span(p, 0.35, 0.7) : 1, txt(X0, 152, tr('prognose, met wat je weet', 'forecast, with what you know'), 'pm-mute') + txt(X0, 180, tr('besparing 180.000 euro', 'savings 180,000 euro'), 'pm-on') + txt(X0, 206, tr('niet 300.000', 'not 300,000'), 'pm-txt'));
      if (b >= 4) o.ques = op(span(p, 0.1, 0.4), rect(X0 - 4, 250, X1 - X0 + 8, 74, 'pm-card', 8) + txt(X0 + 8, 280, tr('Wat moet er gebeuren', 'What would have to'), 'pm-on') + txt(X0 + 8, 308, tr('voordat dit rood wordt?', 'happen to turn red?'), 'pm-on'));
    }
    return o;
  }

  function s3(b, p) {
    const o = { head: [tr('wie beslist wat', 'who decides what'), tr('voorbeeld', 'example')] };
    o.gov = rect(X0 - 4, 54, X1 - X0 + 8, 222, 'pm-card', 8) + txt(X0 + 8, 266, tr('één A4, getekend: sponsor', 'one page, signed: sponsor'), 'pm-mute');
    const rows = [
      [tr('projectleider', 'project lead'), tr('tot 10%, 2 weken', 'up to 10%, 2 weeks')],
      [tr('stuurgroep', 'steering group'), tr('daarboven', 'beyond that')],
      [tr('directie', 'board'), tr('boven 20%, strategie', 'above 20%, strategy')],
    ];
    let rights = '';
    rows.forEach(([who, rule], i) => {
      const y = 86 + i * 58;
      const a = i === 0 ? at(b, p, 1, 0.1, 0.4) : at(b, p, 2, 0.05 + (i - 1) * 0.35, 0.3 + (i - 1) * 0.35);
      if (b >= 4 && i === 1) rights += op(span(p, 0.5, 0.75), rect(X0, y - 22, X1 - X0, 52, 'pm-hot', 6));
      rights += op(a, txt(X0 + 8, y, who, 'pm-big') + txt(X0 + 8, y + 24, rule));
    });
    o.rights = rights;
    if (b >= 3) o.tol = op(at(b, p, 3, 0.1, 0.4), rect(X0 + 2, 90, 196, 28, 'pm-ring', 6) + txt(X1 - 8, 86, tr('tolerantie', 'tolerance'), 'pm-on', 'end'));
    if (b === 3) o.body = op(at(b, p, 3, 0.45, 0.8), txt(X0, 304, 'PRINCE2', 'pm-mute') + txt(X0, 330, tr('sturen op uitzonderingen', 'management by exception'), 'pm-txt'));
    if (b >= 4) {
      // the slip against the two-week tolerance
      const sx = (wk) => X0 + 8 + wk * 40;
      const slip = span(p, 0.05, 0.45) * 4;
      o.slip = txt(X0, 300, tr('pilot schuift', 'the pilot slips'), 'pm-mute')
        + rect(sx(0), 314, sx(slip) - sx(0), 22, 'esc-r', 4) + path(`M${f1(sx(2))} 306V346`, 'pm-line')
        + txt(sx(2), 370, tr('2 wk', '2 wk'), 'pm-txt', 'middle') + op(span(p, 0.4, 0.6), txt(sx(4) + 8, 332, tr('4 wk: rood', '4 wk: red'), 'pm-on'));
    }
    return o;
  }

  function s4(b, p) {
    const o = { head: [tr('eerst de eigenaar', 'the owner first'), tr('voorbeeld', 'example')] };
    const rows = [[tr('teamleider', 'team lead')], [tr('contact bij IT', 'IT contact')], [tr('daarna: sponsor', 'then: the sponsor')]];
    let s = '';
    rows.forEach(([name], i) => {
      const y = 58 + i * 54;
      const a = at(b, p, 0, 0.05 + i * 0.2, 0.2 + i * 0.2);
      const done = i < 2 && (b > 0 || p > 0.35 + i * 0.25);
      o.owner = (o.owner || '') + op(a, rect(X0 - 4, y, X1 - X0 + 8, 44, i < 2 ? 'pm-card' : 'pm-dash', 8) + dot(X0 + 14, y + 22, 11, 'pm-ring') + txt(X0 + 14, y + 29, String(i + 1), 'pm-big', 'middle') + txt(X0 + 36, y + 29, name, i < 2 ? 'pm-txt' : 'pm-mute') + (done ? tick(X1 - 22, y + 22) : ''));
    });
    if (b >= 1) {
      const q = [tr('Snap ik, niemand', 'I get it, nobody'), tr('houdt van rood. Nu kan', 'likes red. Now the'), tr('de sponsor nog helpen.', 'sponsor can still help.'), tr('Over zes weken niet.', 'In six weeks, not.')];
      o.quote = op(at(b, p, 1, 0.05, 0.3), rect(X0 - 4, 228, X1 - X0 + 8, 120, 'pm-card', 8) + q.map((l, i) => txt(X0 + 8, 256 + i * 26, l, i < 3 ? 'pm-txt' : 'pm-on')).join(''));
    }
    if (b >= 2) s += op(span(p, 0.1, 0.4), txt(X0, 378, tr('buitenstaander: zorgvuldig', 'outsider: with care'), 'pm-mute'));
    o.body = s;
    return o;
  }

  function s5(b, p) {
    const o = { head: [tr('stuurgroep', 'steering group'), tr('voorbeeld', 'example')] };
    const parts = [
      [tr('1 gebeurd', '1 happened'), tr('toegang 6 wk te laat', 'access 6 wk late')],
      [tr('2 betekent', '2 means'), tr('pilot wk 8 → wk 12', 'pilot wk 8 → wk 12')],
      [tr('3 voorstel', '3 proposal'), tr('wk 8 op papier, 2 planners', 'wk 8 on paper, 2 planners')],
      [tr('4 nodig', '4 needed'), tr('akkoord, belletje IT', 'your OK, a call to IT')],
    ];
    let s = rect(X0 - 4, 54, X1 - X0 + 8, 278, 'pm-card', 8) + dot(X0 + 12, 78, 8, 'esc-r') + txt(X0 + 28, 85, tr('rood op de pilot', 'red on the pilot'), 'pm-big');
    let esc = '';
    parts.forEach(([lab, val], i) => {
      const y = 120 + i * 56;
      const la = at(b, p, 0, 0.1 + i * 0.2, 0.25 + i * 0.2);
      const va = i < 2 ? at(b, p, 1, 0.1 + i * 0.3, 0.35 + i * 0.3) : at(b, p, 2, 0.1 + (i - 2) * 0.4, 0.35 + (i - 2) * 0.4);
      const body = op(la, txt(X0 + 8, y, lab, 'pm-mute')) + op(va, txt(X0 + 8, y + 24, val));
      if (i === 3) esc = (b >= 3 ? rect(X0, y - 20, X1 - X0, 52, 'pm-hot', 6) : '') + body; else s += body;
    });
    o.slide = s;
    o.body = (b >= 3 ? op(span(p, 0.3, 0.6), txt(X0, 366, tr('escalatie: naar wie beslist', 'escalation: to who decides'), 'pm-on')) : '');
    o.esc = esc;
    return o;
  }

  function s6(b, p) {
    const o = { head: [tr('escalatieroute', 'escalation path'), tr('schema', 'diagram')] };
    if (b <= 2) {
      if (b === 0) o.call = txt(X0, 76, tr('dezelfde middag:', 'the same afternoon:'), 'pm-mute') + txt(X0, 102, tr('de sponsor belt IT', 'the sponsor calls IT'), 'pm-on');
      let s = b === 0
        ? ''
        : op(at(b, p, 1, 0, 0.2), txt(X0, 76, tr('wat gaat omhoog,', 'what goes up,'), 'pm-mute') + txt(X0, 102, tr('hoe snel, naar wie', 'how fast, to whom'), 'pm-txt'));
      if (b >= 2) s += op(span(p, 0.1, 0.4), txt(X0, 348, tr('het besluit, niet de persoon', 'the decision, not the person'), 'pm-on') + txt(X0, 376, tr('eerst de betrokkenen', 'tell those involved first'), 'pm-txt'));
      o.body = s;
      if (b >= 1) {
        const names = [tr('team', 'team'), tr('projecteigenaar', 'project owner'), tr('sponsor', 'sponsor')];
        let r = '';
        names.forEach((n, i) => {
          const y = 128 + i * 66;
          const a = at(b, p, 1, 0.05 + i * 0.25, 0.25 + i * 0.25);
          r += op(a, rect(X0 - 4, y, 190, 40, 'pm-card', 8) + txt(X0 + 8, y + 27, n));
          if (i < 2) r += op(at(b, p, 1, 0.2 + i * 0.25, 0.4 + i * 0.25), path(`M${X0 + 60} ${y + 42}V${y + 62}M${X0 + 54} ${y + 56}l6 6l6 -6`, 'pm-line') + txt(X0 + 200, y + 58, tr('vrijdag', 'Friday'), 'pm-mute'));
        });
        o.route = r;
      }
    } else {
      o.head = [tr('besluitenlijst', 'decision log'), tr('voorbeeld', 'example')];
      const rows = [
        [tr('datum', 'date'), tr('week 6', 'week 6')],
        [tr('besluit', 'decision'), tr('pilot wk 8 op papier', 'pilot wk 8 on paper')],
        [tr('wie', 'who'), tr('sponsor', 'sponsor')],
        [tr('waarom', 'why'), tr('toegang pas wk 11', 'access only in wk 11')],
        [tr('afgevallen', 'dropped'), tr('wachten tot wk 12', 'wait until wk 12')],
      ];
      o.log = rows.map(([lab, val], i) => op(span(p, 0.05 + i * 0.12, 0.2 + i * 0.12), txt(X0, 76 + i * 60, lab, 'pm-mute') + txt(X0, 100 + i * 60, val))).join('');
      o.body = op(span(p, 0.7, 0.9), txt(X0, 378, tr('tabblad in het projectbestand', 'a tab in the project file'), 'pm-on'));
    }
    return o;
  }

  function s7(b, p) {
    const o = { head: [tr('één A4', 'one page'), tr('voorbeeld', 'example')] };
    o.case = txt(X0, 72, tr('lijn 2: meeste stilstand', 'line 2: most downtime'), 'pm-txt') + txt(X0, 96, tr('14% van de geplande uren', '14% of planned hours'), 'pm-mute');
    let s = '';
    if (b >= 1) {
      o.crit = op(at(b, p, 1, 0.3, 0.6), txt(X0, 128, tr('criteria: kosten, tijd,', 'criteria: cost, time,'), 'pm-txt') + txt(X0, 152, tr('risico, impact op mensen', 'risk, impact on people'), 'pm-txt'));
      const opts = [
        ['A', tr('lijn 2', 'line 2'), tr('90.000 euro/jr, sceptisch', '90,000 euro/yr, sceptical')],
        ['B', tr('lijn 5, teamleider wil', 'line 5, keen team lead'), tr('40.000, snel, gemotiveerd', '40,000, quick, motivated')],
        ['C', tr('eerst 4 wk lijn 5', '4 wk line 5 first'), tr('dan lijn 2', 'then line 2')],
      ];
      opts.forEach(([L, t1, t2], i) => {
        const y = 166 + i * 54;
        const a = at(b, p, 1, 0.05 + i * 0.1, 0.25 + i * 0.1);
        const fill = at(b, p, 2, 0.1 + i * 0.28, 0.3 + i * 0.28);
        const card = rect(X0 - 4, y, X1 - X0 + 8, 50, 'pm-card', 8) + txt(X0 + 8, y + 22, L, 'pm-big') + op(fill, txt(X0 + 32, y + 22, t1, 'pm-txt') + txt(X0 + 32, y + 44, t2, 'pm-mute'));
        if (i === 2) o.advice = op(a, (b >= 3 ? rect(X0 - 4, y, X1 - X0 + 8, 50, 'pm-hot', 8) : '') + card + txt(X1 - 6, y + 22, b >= 4 ? tr('gekozen', 'chosen') : tr('advies', 'advice'), 'pm-on', 'end'));
        else o.opts = (o.opts || '') + op(a, card);
      });
    }
    if (b >= 3) o.dflt = op(at(b, p, 3, 0.35, 0.65), txt(X0, 350, tr('geen besluit vrijdag: C', 'no decision Friday: C'), 'pm-on'));
    if (b >= 4) o.log = op(span(p, 0.3, 0.6), txt(X0, 378, tr('de reden gaat in de lijst', 'the reason goes in the log'), 'pm-txt'));
    o.body = s;
    return o;
  }

  function door(x, y, two) {
    const arrow = two
      ? `M${x + 6} ${y + 92}H${x + 58}M${x + 12} ${y + 86}l-6 6l6 6M${x + 52} ${y + 86}l6 6l-6 6`
      : `M${x + 6} ${y + 92}H${x + 58}M${x + 52} ${y + 86}l6 6l-6 6`;
    return rect(x, y, 64, 78, 'pm-card', 4) + dot(x + 52, y + 42, 3, 'pm-dot') + path(arrow, 'pm-line');
  }
  function s8(b, p) {
    const o = { head: [tr('besluit loskrijgen', 'getting a decision'), tr('schema', 'diagram')] };
    const q = [[tr('Wat moet je zien', 'What would you need'), tr('om te beslissen?', 'to see to decide?')], [tr('Wie moet zich er', 'Who else needs to'), tr('goed bij voelen?', 'feel good about it?')]];
    o.ask = q.map(([l1, l2], i) => op(at(b, p, 0, 0.1 + i * 0.4, 0.3 + i * 0.4), rect(X0 - 4, 54 + i * 70, X1 - X0 + 8, 62, 'pm-card', 8) + txt(X0 + 8, 80 + i * 70, l1, 'pm-on') + txt(X0 + 8, 104 + i * 70, l2, 'pm-on'))).join('');
    let s = '';
    if (b >= 1) o.test = op(at(b, p, 1, 0.2, 0.5), txt(X0, 220, tr('niet zeker? een kleine test', 'not sure? a small test'), 'pm-txt'));
    if (b >= 2) {
      o.doors = op(at(b, p, 2, 0.1, 0.4), door(X0 + 10, 236, true) + txt(X0 + 84, 266, tr('terug te draaien:', 'two-way:'), 'pm-mute') + txt(X0 + 84, 292, tr('snel en laag', 'fast and low'), 'pm-txt'));
      o.doors += op(at(b, p, 2, 0.5, 0.8), txt(X0 + 84, 318, tr('eenrichting:', 'one-way:'), 'pm-mute') + txt(X0 + 84, 344, tr('met zorg', 'with care'), 'pm-txt'));
      o.doors += op(at(b, p, 2, 0.1, 0.4), txt(X1, 266, 'Amazon,', 'pm-mute', 'end') + txt(X1, 292, '2015', 'pm-mute', 'end'));
    }
    if (b >= 3) o.commit = op(span(p, 0.4, 0.7), txt(X0, 378, tr('oneens, en toch meegaan', 'disagree and commit'), 'pm-on'));
    o.body = s;
    return o;
  }

  function s9(b, p) {
    const o = { head: [tr('stuurgroep', 'steering group'), tr('voorbeeld', 'example')] };
    const n = C.BOARD_N.before;
    const x = (i) => X0 + 12 + i * 26;
    const six = b === 0 ? 0 : at(b, p, 1, 0.05, 0.35);
    let s = '';
    for (let i = 0; i < n; i++) {
      const voting = i < C.BOARD_N.voting;
      s += voting ? dot(x(i), 72, 9, six > 0.5 ? 'esc-g' : 'pm-dot') : op(1 - 0.6 * six, dot(x(i), 72, 9, six > 0.5 ? 'pm-ring' : 'pm-dot'));
    }
    if (b === 0) s += op(span(p, 0.2, 0.5), txt(X0, 120, tr('3 besluiten, 2 maanden', '3 decisions, 2 months'), 'pm-txt') + txt(X0, 146, tr('15 slides: offline', '15 slides: offline'), 'pm-mute'));
    else s += txt(X0, 120, tr('6 stemmen, 5 advies', '6 votes, 5 advise'), 'pm-txt');
    o.group = s;
    s = '';
    if (b >= 1) {
      const items = [tr('1 aannemers +18%', '1 contractors +18%'), tr('2 tweede regio', '2 second region'), tr('3 twee planners', '3 two planners')];
      o.agenda = op(at(b, p, 1, 0.4, 0.7), rect(X0 - 4, 152, X1 - X0 + 8, 132, 'pm-card', 8) + txt(X0 + 8, 176, tr('agenda, 3 dagen vooraf', 'agenda, 3 days ahead'), 'pm-mute') + items.map((t, i) => txt(X0 + 8, 204 + i * 26, t)).join(''));
    }
    if (b >= 2) o.mandate = op(at(b, p, 2, 0.1, 0.4), dot(x(2), 72, 14, 'pm-ring') + dot(x(4), 72, 14, 'pm-ring') + txt(X1, 120, tr('mandaat?', 'mandate?'), 'pm-on', 'end'));
    if (b >= 3) o.open = op(at(b, p, 3, 0.1, 0.4), txt(X0, 316, tr('Welke besluiten hebben', 'Which decisions do we'), 'pm-on') + txt(X0, 342, tr('we vandaag nodig?', 'need today?'), 'pm-on'));
    if (b >= 4) o.log = op(span(p, 0.2, 0.5), txt(X0, 376, tr('notulen: besluitenlijst', 'minutes: a decision log'), 'pm-txt'));
    o.body = s;
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip: access promised in week 5 (ring), now week 6, the new
  // date week 11 (dot), the pilot milestone in week 8, moving to week 12
  function calendar(si, b, p) {
    const cell = (wk) => C.CELLS[wk - 1];
    const mid = (wk) => { const [a, bb, c, d] = cell(wk); return [(a + c) / 2, (bb + d) / 2]; };
    const [n0, n1, n2, n3] = cell(C.WK.now);
    let s = rect(n0, n1, n2 - n0, n3 - n1, 'pm-hot', 1);
    const [px, py] = mid(C.WK.promised);
    s += dot(px, py - 6, 2.6, 'pm-ring');
    const late = si === 0 && b === 0 ? span(p, 0.45, 0.85) : 1;
    const [ax, ay] = mid(C.WK.access);
    s += op(late, dot(ax, ay - 6, 2.6, 'pm-dot'));
    const moved = si < 2 ? 0 : si === 2 ? (b < 4 ? 0 : span(p, 0.05, 0.45)) : 1;
    const [x8, y8] = mid(C.WK.pilot);
    const [x12] = mid(C.WK.newPilot);
    if (moved > 0.01) s += op(0.5, dia(x8, y8 + 6, 3.4, 'pm-dash'));
    s += dia(lerp(x8, x12, moved), y8 + 6, 4);
    return s;
  }
  // the decision log on the table: a line per decision (s6 the pilot, s7 line 5, s9 the three)
  function logSheet(si, b, p) {
    let n = 0;
    if (si === 5) n = b >= 3 ? span(p, 0.2, 0.6) : 0;
    if (si === 6) n = 1 + (b >= 4 ? span(p, 0.4, 0.8) : 0);
    if (si === 7) n = 2;
    if (si === 8) n = 2 + (b >= 4 ? 3 * span(p, 0.2, 0.8) : 0);
    let s = '';
    for (let i = 0; i < 5; i++) {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += `<path class="pm-line" d="M2.5 ${f1(4 + i * 4.6)}H${f1(2.5 + 15 * a)}"/>`;
    }
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    set(E.pBody, o.body || '');
    let mini = o.body || '';
    for (const c of CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.cMarks, calendar(si, b, p));
    set(E.dLines, logSheet(si, b, p));
  }

  return { render };
})();
