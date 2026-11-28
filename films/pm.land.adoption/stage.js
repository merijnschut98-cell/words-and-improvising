// The stage of the film "Van livegang tot gewoonte / From go-live to habit": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and
// a preamble from build.mjs that defines C (the example's figures), CAM (one
// camera move per scene), W and H. Moves are placed per Dutch caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. The panel at the right gets one card per scene, each block in
// its own cue group; a long card turns a page at a beat (the earlier blocks
// fade out, each having stood at least 4 s). The board in the room repeats the
// card in miniature.
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
  const cross = (x, y) => path(`M${f1(x - 6)} ${f1(y - 6)}l12 12m0 -12l-12 12`, 'pm-line');
  const strike = (x, y, w) => path(`M${f1(x - 2)} ${f1(y - 7)}H${f1(x + w)}`, 'pm-line');
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  const card = (y, h, body, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8) + body;
  // lines of [text, class] from y down, `step` apart
  const lines = (y, list, x = X0, step = 24) => list.map(([t, cls], i) => (t ? txt(x, y + i * step, t, cls || 'pm-txt') : '')).join('');
  // a small person glyph (head and shoulders) at (x, y), its feet at y + 30
  const glyph = (x, y, cls = 'pm-ring') => dot(x, y + 7, 6, cls) + path(`M${f1(x - 11)} ${f1(y + 30)}q0 -14 11 -14q11 0 11 14z`, cls);
  const CUES = ['case', 'golive', 'rate', 'adopt', 'cm', 'drivers', 'time',
    'kotter', 'steps', 'adkar', 'letters', 'critique',
    'diag', 'eight', 'stall', 'fixes', 'result', 'terms', 'ask5',
    'def', 'open', 'passive', 'hidden', 'gift',
    'loss', 'judge', 'honest', 'curve', 'heifetz',
    'henkq', 'chat', 'worry', 'rules', 'night', 'coch',
    'stake', 'plan', 'cascade', 'rumour',
    'mid', 'msgs', 'hall', 'ten', 'prosci',
    'grid', 'w12', 'w34', 'halfway'];

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

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  function s1(b, p) {
    const o = { head: [tr('livegang', 'go-live'), b <= 2 ? tr('voorbeeld', 'example') : tr('schema', 'diagram')] };
    const A = page(b, p, 0, 5);
    // the terminal by the line: stops over 2 minutes get logged
    o.case = op(A, rect(X0, 58, 36, 46, 'pm-card', 4) + rect(X0 + 5, 63, 26, 22, 'pm-hot', 2) + path(`M${X0 + 18} 104v14`, 'pm-line')
      + lines(76, [[tr('verpakkingsbedrijf', 'packaging plant'), 'pm-big'], [tr('stop langer dan 2 min:', 'stop over 2 minutes:'), 'pm-txt'], [tr('op de terminal', 'log it on the terminal'), 'pm-txt']], X0 + 48)
      + txt(X0, 148, tr('touchscreen-pc bij de lijn', 'touchscreen PC at the line'), 'pm-mute'));
    if (b >= 1) {
      let gl = path(`M${X0} 186H${X1}`, 'pm-axis');
      const gx = X0 + 30;
      gl += path(`M${gx} 168v28`, 'pm-line') + txt(gx + 8, 178, tr('livegang', 'go-live'), 'pm-on');
      for (let i = 1; i <= 6; i++) gl += op(at(b, p, 1, 0.2 + i * 0.06, 0.26 + i * 0.06), path(`M${f1(gx + i * 40)} 182v8`, 'pm-axis'));
      gl += op(at(b, p, 1, 0.55, 0.8), txt(X1, 214, tr('daarna: de oude manier lokt', 'then: the old way tempts'), 'pm-mute', 'end'));
      o.golive = op(A, op(at(b, p, 1, 0.05, 0.3), gl));
    }
    if (b >= 2) {
      const f = at(b, p, 2, 0.1, 0.6) * C.RATE[0] / 100;
      o.rate = op(A, rect(X0, 228, CW, 22, 'pm-card', 4) + rect(X0, 228, CW * f, 22, 'pm-fill', 4)
        + op(at(b, p, 2, 0.5, 0.7), txt(X0 + CW * 0.4 + 8, 246, '40%', 'pm-big') + txt(X1, 272, tr('na 6 weken', 'after 6 weeks'), 'pm-mute', 'end')));
    }
    if (b >= 3) o.adopt = op(A, op(at(b, p, 3), card(284, 56, lines(306, [[tr('adoptie: echt gebruiken,', 'adoption: actually used,'), 'pm-on'], [tr('ook als niemand kijkt', 'also when nobody looks'), 'pm-txt']], X0 + 4), 'pm-hot')));
    if (b >= 4) o.cm = op(A, op(at(b, p, 4), lines(360, [[tr('verandermanagement:', 'change management:'), 'pm-mute'], [tr('het werk om daar te komen', 'the work to get there'), 'pm-txt']])));
    if (b >= 5) {
      const rows = [tr('makkelijker dan het oude', 'easier than the old way'), tr('de directe baas vraagt', 'the direct boss asks'), tr('mee vormgegeven', 'they helped shape it'), tr('de oude manier is weg', 'the old way is gone')];
      let d = txt(X0, 76, tr('wat adoptie drijft', 'what drives adoption'), 'pm-big');
      rows.forEach((r, i) => { d += op(at(b, p, 5, 0.05 + i * 0.16, 0.2 + i * 0.16), tick(X0 + 8, 110 + i * 30) + txt(X0 + 30, 116 + i * 30, r)); });
      d += op(at(b, p, 5, 0.75, 0.95), txt(X0 + 30, 226, tr('geen terugvaloptie', 'no fallback'), 'pm-mute'));
      o.drivers = op(at(b, p, 5, 0, 0.12), d);
    }
    if (b >= 6) o.time = op(at(b, p, 6), card(256, 74, lines(286, [[tr('kost het meer tijd?', 'takes longer?'), 'pm-on'], [tr('geen campagne redt het', 'no campaign saves it'), 'pm-txt']], X0 + 4), 'pm-hot') + cross(X1 - 14, 280));
    return o;
  }

  function s2(b, p) {
    const o = { head: [tr('twee modellen', 'two models'), tr('schema', 'diagram')] };
    o.kotter = txt(X0, 76, 'Kotter', 'pm-big') + txt(X1, 76, tr('organisatie', 'organisation'), 'pm-mute', 'end') + txt(X0, 100, 'Leading Change, 1996', 'pm-mute');
    const steps = NL ? ['urgentie', 'trekkers', 'beeld', 'vertellen', 'obstakels', 'quick wins', 'doorzetten', 'verankeren']
      : ['urgency', 'a group', 'the picture', 'tell it', 'obstacles', 'quick wins', 'keep going', 'anchor'];
    let st = '';
    steps.forEach((s, i) => {
      const x = X0 + (i < 4 ? 0 : 146);
      const y = 130 + (i % 4) * 24;
      const a = b > 1 ? 1 : b === 1 ? span(p, 0.03 + i * 0.09, 0.1 + i * 0.09) : b === 0 ? span(p, 0.6, 0.9) * 0.35 : 0;
      st += op(a, txt(x, y, String(i + 1), 'pm-on') + txt(x + 18, y, s));
    });
    o.steps = st;
    if (b >= 2) {
      o.adkar = op(at(b, p, 2, 0.02, 0.2), txt(X0, 242, 'ADKAR', 'pm-big') + txt(X1, 242, tr('één persoon', 'one person'), 'pm-mute', 'end') + txt(X0, 266, 'Prosci, Jeff Hiatt', 'pm-mute'));
      let L = '';
      'ADKAR'.split('').forEach((c, i) => {
        const x = X0 + i * 58;
        L += op(at(b, p, 2, 0.25 + i * 0.12, 0.35 + i * 0.12), rect(x, 278, 50, 30, 'pm-card', 5) + txt(x + 25, 300, c, 'pm-big', 'middle'));
      });
      o.letters = L;
    }
    if (b >= 3) o.critique = op(at(b, p, 3), lines(338, [[tr('70% mislukt? geen bewijs', '70% fail? no evidence'), 'pm-on'], ['Mark Hughes, 2011', 'pm-mute'], [tr('Kotter: te veel van boven', 'Kotter: too top-down'), 'pm-txt']], X0, 23));
    return o;
  }

  function s3(b, p) {
    const o = { head: [tr('acht operators', 'eight operators'), b === 0 || b >= 5 ? tr('schema', 'diagram') : tr('voorbeeld', 'example')] };
    const A = page(b, p, 0, 5);
    const ry = (i) => 82 + i * 28;
    const fixes = NL ? ['baas vertelt het', 'wat raken ze kwijt?', 'uitleggen', 'oefenen op de vloer', 'elke week vragen']
      : ['the boss tells them', 'what do they lose?', 'explain', 'practise on the job', 'ask every week'];
    // the ADKAR steps down the card; the fixes in beat 1, then the eight operators as dots
    let dg = '';
    'ADKAR'.split('').forEach((c, i) => {
      dg += txt(X0 + 4, ry(i), c, 'pm-big');
      if (b === 0) dg += op(span(p, 0.12 + i * 0.15, 0.22 + i * 0.15), txt(X0 + 34, ry(i), fixes[i]));
    });
    if (b <= 2) dg += op(at(b, p, 0, 0.05, 0.2), txt(X0, 240, tr('een diagnose, geen slide', 'a diagnosis, not a slide'), 'pm-mute'));
    o.diag = op(A, dg);
    if (b >= 1) {
      // eight dots per step; the three who see nothing done stall at desire and
      // reinforcement, the two far from the terminal at ability
      const stalled = (i, j) => b >= 2 && ((i === 1 || i === 4) ? j < C.NOTHING : i === 3 ? j >= C.ASKED - C.FAR : false);
      // the shift start fixes desire and reinforcement, the moved terminal ability
      const fixA = at(b, p, 3, 0.15, 0.35);
      const fixB = at(b, p, 3, 0.6, 0.8);
      const fixOf = (i) => (i === 3 ? fixB : fixA);
      let e = '';
      let s = '';
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < C.ASKED; j++) {
          const x = X0 + 40 + j * 15;
          const a = at(b, p, 1, 0.05 + j * 0.04, 0.1 + j * 0.04);
          if (stalled(i, j)) s += op(1 - fixOf(i), dot(x, ry(i) - 6, 5, 'pm-ring')) + op(fixOf(i), dot(x, ry(i) - 6, 5, 'pm-dot'));
          else e += op(a, dot(x, ry(i) - 6, 5, 'pm-dot'));
        }
      }
      e += op(at(b, p, 1, 0.5, 0.8), txt(X1, ry(0), tr('weten ervan', 'aware'), 'pm-mute', 'end') + txt(X1, ry(2), tr('weten hoe', 'know how'), 'pm-mute', 'end'));
      o.eight = op(A, e);
      if (b >= 2) {
        const tag = (i, t, a, f) => op(a * (1 - f), txt(X1, ry(i), t, 'pm-on', 'end')) + op(f, tick(X1 - 14, ry(i) - 6));
        s += tag(1, tr('niks mee', 'nothing done'), at(b, p, 2, 0.05, 0.3), fixA) + tag(4, tr('niks mee', 'nothing done'), at(b, p, 2, 0.05, 0.3), fixA)
          + tag(3, tr('30 meter', '30 metres'), at(b, p, 2, 0.5, 0.75), fixB);
        o.stall = op(A, s);
      }
    }
    if (b >= 3) {
      o.fixes = op(A, op(at(b, p, 3, 0.05, 0.3), lines(240, [[tr('ploegstart: top 3 stops', 'shift start: top 3 stops'), 'pm-txt']]))
        + op(at(b, p, 3, 0.5, 0.75), lines(264, [[tr('terminal naar het midden', 'terminal to the middle'), 'pm-txt']])));
    }
    if (b >= 4) {
      const f = lerp(C.RATE[0], C.RATE[1], at(b, p, 4, 0.05, 0.6)) / 100;
      o.result = op(A, rect(X0, 290, CW, 22, 'pm-card', 4) + rect(X0, 290, CW * f, 22, 'pm-fill', 4) + path(`M${f1(X0 + CW * 0.4)} 286v30`, 'pm-line')
        + txt(X0 + CW * 0.4 - 6, 336, '40', 'pm-mute', 'end') + op(at(b, p, 4, 0.5, 0.8), txt(X1, 336, tr('85%, na 4 weken', '85%, 4 weeks on'), 'pm-big', 'end')));
    }
    if (b >= 5) {
      o.terms = op(at(b, p, 5, 0.02, 0.15), txt(X0, 76, tr('de reden in hun termen', 'the reason in their terms'), 'pm-big')
        + txt(X0, 106, tr('de OEE verbeteren', 'improve OEE'), 'pm-mute') + op(at(b, p, 5, 0.25, 0.45), strike(X0, 106, NL ? 180 : 116))
        + lines(132, [[tr('OEE: goed product in de', 'OEE: good product in'), 'pm-mute'], [tr('geplande tijd', 'the planned time'), 'pm-mute']])
        + op(at(b, p, 5, 0.5, 0.75), txt(X0, 196, tr('geen oproep op zaterdag', 'no Saturday call-in'), 'pm-on')));
    }
    if (b >= 6) {
      o.ask5 = op(at(b, p, 6, 0.02, 0.2), lines(240, [[tr('vraag er vijf:', 'ask five:'), 'pm-mute'], [tr('wat maakt het lastig?', 'what makes it hard?'), 'pm-txt'], [tr('vaak één ding, deze week', 'often one thing, this week'), 'pm-mute']]))
        + op(at(b, p, 6, 0.6, 0.8), card(318, 64, lines(344, [[tr('wat verliest', 'what does the'), 'pm-on'], [tr('de operator?', 'operator lose?'), 'pm-on']], X0 + 4), 'pm-hot'));
    }
    return o;
  }

  function s4(b, p) {
    const o = { head: [tr('drie vormen', 'three forms'), tr('schema', 'diagram')] };
    o.def = txt(X0, 76, tr('afremmen of blokkeren', 'slowing or blocking'), 'pm-big');
    const row = (k, y, name, say, icon) => op(at(b, p, k, 0.05, 0.3), icon + txt(X0 + 44, y + 16, name, 'pm-on') + txt(X0 + 44, y + 40, say, 'pm-txt'));
    if (b >= 1) o.open = row(1, 96, 'open', tr('argumenten, boosheid', 'arguments, anger'), glyph(X0 + 16, 96) + path(`M${X0 + 4} 98l-6 -8M${X0 + 28} 98l6 -8`, 'pm-line'));
    if (b >= 2) o.passive = row(2, 166, tr('passief', 'passive'), tr('ja, en daarna niks', 'yes, then nothing'), glyph(X0 + 16, 166) + txt(X0 + 30, 170, 'z', 'pm-mute'));
    if (b >= 3) o.hidden = row(3, 236, tr('verborgen', 'hidden'), tr('“in 2019 al geprobeerd”', '“tried that in 2019”'), glyph(X0 + 16, 236) + rect(X0 - 2, 252, 30, 22, 'pm-card', 2));
    if (b >= 4) o.gift = op(at(b, p, 4), card(310, 72, lines(338, [[tr('open: een cadeau', 'open: a gift'), 'pm-on'], [tr('de rest: eerst vinden', 'the rest: find it first'), 'pm-txt']], X0 + 4), 'pm-hot'));
    return o;
  }

  function s5(b, p) {
    const o = { head: [tr('wat erachter zit', 'what is behind it'), tr('schema', 'diagram')] };
    const A = page(b, p, 0, 2);
    o.loss = op(A, lines(76, [[tr('verlies:', 'a loss:'), 'pm-on'], [tr('status, vakmanschap,', 'status, skill,'), 'pm-txt'], [tr('controle, overwerkgeld', 'control, overtime pay'), 'pm-txt']])
      + op(at(b, p, 0, 0.45, 0.7), lines(160, [[tr('extra werk', 'extra work'), 'pm-txt'], [tr('eerder project mislukt', 'an earlier failed project'), 'pm-txt'], [tr('fout in jouw ontwerp', 'a flaw in your design'), 'pm-txt']])));
    if (b >= 1) o.judge = op(A, op(at(b, p, 1), card(250, 74, lines(280, [[tr('wat moet er kloppen', 'what would have to be'), 'pm-on'], [tr('om dit te laten werken?', 'true for this to work?'), 'pm-on']], X0 + 4), 'pm-hot')));
    if (b >= 2) {
      o.honest = op(at(b, p, 2, 0.02, 0.2), lines(76, [[tr('“Ja, je verliest het', '“Yes, you’ll lose the'), 'pm-txt'], [tr('zaterdagse overwerk,', 'Saturday overtime,'), 'pm-txt'], [tr('en dit is waarom toch.”', 'and here’s why anyway.”'), 'pm-txt']])
        + op(at(b, p, 2, 0.5, 0.7), txt(X0, 156, tr('dwarsligger', 'resister'), 'pm-mute') + strike(X0, 156, NL ? 114 : 84) + txt(X1, 156, tr('geen labels', 'no labels'), 'pm-on', 'end')));
    }
    if (b >= 3) {
      const t = at(b, p, 3, 0.05, 0.5);
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const x = i / 24;
        if (x > t) break;
        pts.push(`${f1(X0 + 6 + x * (CW - 12))} ${f1(196 + 44 * Math.sin(Math.min(1, x / 0.8) * Math.PI) - (x > 0.8 ? (x - 0.8) * 90 : 0))}`);
      }
      o.curve = op(at(b, p, 3, 0.02, 0.15), path(`M${X0} 196H${X1}`, 'pm-axis') + (pts.length > 1 ? path(`M${pts.join('L')}`, 'pm-line') : '')
        + lines(266, [[tr('schok, ontkenning,', 'shock, denial,'), 'pm-txt'], [tr('frustratie, acceptatie', 'frustration, acceptance'), 'pm-txt']])
        + txt(X1, 180, 'Kübler-Ross, 1969', 'pm-mute', 'end') + op(at(b, p, 3, 0.6, 0.85), txt(X0, 318, tr('vaste fases? niet bewezen', 'fixed stages? unproven'), 'pm-mute')));
    }
    if (b >= 4) o.heifetz = op(at(b, p, 4), card(332, 52, lines(356, [[tr('Heifetz: verzet tegen', 'Heifetz: people resist'), 'pm-on'], [tr('verlies, niet verandering', 'loss, not change'), 'pm-txt']], X0 + 4, 22), 'pm-hot'));
    return o;
  }

  function s6(b, p) {
    const o = { head: [tr('koffie met Henk', 'coffee with Henk'), b === 5 ? tr('schema', 'diagram') : tr('voorbeeld', 'example')] };
    o.henkq = txt(X0, 76, 'Henk', 'pm-big') + txt(X1, 76, tr('insteller', 'setter'), 'pm-mute', 'end') + op(at(b, p, 0, 0.2, 0.45), txt(X0, 100, tr('“voor kantoormensen”', '“for office people”'), 'pm-txt'));
    if (b >= 1) {
      o.chat = op(at(b, p, 1), rect(X0 + 2, 120, 18, 22, 'pm-card', 3) + path(`M${X0 + 20} 126q8 0 8 6q0 6 -8 6`, 'pm-line')
        + lines(138, [[tr('koffie, één op één', 'coffee, one-on-one'), 'pm-txt']], X0 + 40) + op(at(b, p, 1, 0.5, 0.75), lines(162, [[tr('eerdere veranderingen?', 'earlier changes?'), 'pm-mute']], X0 + 40)));
    }
    if (b >= 2) o.worry = op(at(b, p, 2), lines(196, [[tr('volgorde: nu de planner', 'order: now the planner'), 'pm-txt']]) + op(at(b, p, 2, 0.45, 0.7), lines(220, [[tr('pers: 40 min opwarmen', 'press: 40 min warm-up'), 'pm-on']])));
    if (b >= 3) o.rules = op(at(b, p, 3), card(228, 34, txt(X0 + 4, 252, tr('opwarmregel in het bord', 'warm-up rule goes in'), 'pm-on'), 'pm-hot'));
    if (b >= 4) o.night = op(at(b, p, 4), lines(286, [[tr('na 2 weken: hij legt uit', 'after 2 weeks: he teaches'), 'pm-txt'], [tr('bekeerd: overtuigt best', 'a convert convinces best'), 'pm-mute']], X0, 23));
    if (b >= 5) o.coch = op(at(b, p, 5), lines(336, [[tr('Coch en French, 1948', 'Coch and French, 1948'), 'pm-mute'], [tr('pyjamafabriek, Virginia', 'pyjama factory, Virginia'), 'pm-txt'], [tr('meeontwerpers: sneller', 'co-designers: faster'), 'pm-on']], X0, 22));
    return o;
  }

  function s7(b, p) {
    const o = { head: [tr('wie hoort wat', 'who hears what'), tr('schema', 'diagram')] };
    o.stake = txt(X0, 76, tr('geraakt of invloed', 'affected or influential'), 'pm-big')
      + [tr('direct geraakt', 'directly affected'), tr('indirect geraakt', 'indirectly affected'), tr('leidinggevenden', 'managers')]
        .map((t, i) => op(at(b, p, 0, 0.4 + i * 0.15, 0.5 + i * 0.15), dot(X0 + 9, 98 + i * 26, 6, 'pm-dot') + txt(X0 + 26, 104 + i * 26, t))).join('');
    if (b >= 1) {
      const q = NL ? ['wat, wanneer, waarom,', 'verwacht, waar heen?'] : ['what, when, why,', 'expected, who to ask?'];
      let t = card(170, 92, txt(X0 + 4, 192, tr('communicatieplan, 1 A4', 'plan on one page'), 'pm-on'));
      q.forEach((s, i) => { t += op(at(b, p, 1, 0.1 + i * 0.25, 0.25 + i * 0.25), txt(X0 + 4, 222 + i * 26, s)); });
      o.plan = op(at(b, p, 1, 0.02, 0.2), t);
    }
    if (b >= 2) {
      const lv = NL ? ['top', 'leiding', 'teams'] : ['top', 'leads', 'teams'];
      let c = '';
      lv.forEach((s, i) => {
        const x = X0 + i * 98;
        c += op(at(b, p, 2, 0.05 + i * 0.15, 0.15 + i * 0.15), rect(x, 278, 88, 30, 'pm-card', 5) + txt(x + 44, 300, s, 'pm-txt', 'middle') + (i < 2 ? path(`M${x + 90} 293h6m-4 -4l4 4l-4 4`, 'pm-line') : ''));
      });
      c += op(at(b, p, 2, 0.6, 0.8), txt(X0, 330, tr('nooit eerst op de gang', 'never the corridor first'), 'pm-mute'));
      o.cascade = c;
    }
    if (b >= 3) o.rumour = op(at(b, p, 3), lines(358, [[tr('gerucht? dezelfde dag', 'rumour? the same day'), 'pm-on'], [tr('weten, nog niet, wanneer', 'know, not yet, when'), 'pm-txt']], X0, 23));
    return o;
  }

  function s8(b, p) {
    const o = { head: [tr('het kanaal', 'the channel'), tr('schema', 'diagram')] };
    o.mid = lines(76, [[tr('middenmanager', 'middle manager'), 'pm-big'], [tr('top: het waarom', 'top: the why'), 'pm-mute']]) + op(at(b, p, 0, 0.5, 0.75), txt(X0, 124, tr('ploegleider: maandag?', 'shift lead: my Monday?'), 'pm-txt'));
    if (b >= 1) o.msgs = op(at(b, p, 1), card(138, 76, lines(160, [[tr('eerst toerusten:', 'equip first:'), 'pm-mute'], [tr('3 kernboodschappen', '3 talking points'), 'pm-on'], [tr('vragen en antwoorden', 'questions, answers'), 'pm-txt']], X0 + 4, 24)));
    if (b >= 2) o.hall = op(at(b, p, 2), lines(242, [[tr('town hall: het waarom', 'town hall: the why'), 'pm-txt'], [tr('bord, ploegstart, 1 op 1', 'board, shift start, 1:1'), 'pm-mute']]));
    if (b >= 3) o.ten = op(at(b, p, 3), txt(X0, 292, tr('Kotter, 1995: 10× te weinig', 'Kotter, 1995: 10× too little'), 'pm-on'));
    if (b >= 4) o.prosci = op(at(b, p, 4), card(306, 78, lines(328, [[tr('Prosci-enquêtes:', 'Prosci surveys:'), 'pm-mute'], [tr('reden: van de top', 'the reason: the top'), 'pm-txt'], [tr('mijn werk: eigen baas', 'my job: my own boss'), 'pm-txt']], X0 + 4, 24)));
    return o;
  }

  function s9(b, p) {
    const o = { head: [tr('netbeheerder', 'grid operator'), b === 3 ? tr('schema', 'diagram') : tr('voorbeeld', 'example')] };
    const mail = at(b, p, 1, 0.02, 0.2);
    o.grid = lines(76, [[tr('geen klus zonder check', 'no job without the check'), 'pm-big'], [tr('3 groepen geraakt', '3 groups affected'), 'pm-mute']])
      + op(at(b, p, 0, 0.55, 0.8), txt(X0, 124, tr('1 mail op vrijdag?', 'one e-mail on Friday?'), 'pm-txt') + (mail > 0 ? strike(X0, 124, (NL ? 170 : 200) * mail) : ''));
    if (b >= 1) {
      o.w12 = op(at(b, p, 1, 0.05, 0.3), txt(X0, 162, tr('wk 1', 'wk 1'), 'pm-on') + txt(X0 + 76, 162, tr('teamleiders + FAQ', 'team leaders + FAQ')))
        + op(at(b, p, 1, 0.45, 0.7), txt(X0, 188, tr('wk 2', 'wk 2'), 'pm-on') + txt(X0 + 76, 188, tr('planners, 3 punten', 'planners, 3 points')) + txt(X0 + 76, 212, tr('uitvoering: bericht', 'field leads: a note'), 'pm-mute'));
    }
    if (b >= 2) {
      o.w34 = op(at(b, p, 2, 0.05, 0.3), txt(X0, 248, tr('wk 3-4', 'wk 3-4'), 'pm-on') + txt(X0 + 76, 248, tr('check op het bord', 'check on the board')))
        + op(at(b, p, 2, 0.45, 0.7), txt(X0, 274, tr('wk 4', 'wk 4'), 'pm-on') + txt(X0 + 76, 274, tr('6 gevraagd, 2 fout', '6 asked, 2 wrong')));
    }
    if (b >= 3) o.halfway = op(at(b, p, 3), card(292, 90, lines(318, [[tr('na een week: wie heb', 'a week on: whom have'), 'pm-on'], [tr('je het verteld?', 'you told?'), 'pm-on'], [tr('niet weten? zeg wanneer', 'don’t know? say when'), 'pm-txt']], X0 + 4, 26), 'pm-hot'));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

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
