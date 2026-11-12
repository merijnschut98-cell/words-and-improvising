// The stage of the film "Vijf kleine verzoeken / Five small requests": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C (the example's numbers and the
// calendar cells), CAM (one camera move per scene), W and H. Moves are placed
// per caption beat (beatStarts on the Dutch captions), so the video's
// narration timing (films/_kit/beatwarp.js) keeps them in step. The panel at
// the right gets one card per scene, each part in its own cue group; the board
// in the room repeats it in miniature, the request notes pile up on the table
// while the calendar's status dot stays green, and the sheet on the table
// fills in with the list for the sponsor.
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
  // a budget bar of `days` days from x0 at y, and `extra` blocks of `each` days after it
  const DAY = 5;
  function bar(y, days, extra, each, show, unit = DAY) {
    let s = rect(X0, y, days * unit, 22, 'pm-bar', 4);
    for (let i = 0; i < extra; i++) s += op(clamp(show - i, 0, 1), rect(X0 + days * unit + i * each * unit + 1, y, each * unit - 2, 22, 'pm-xtra', 3));
    return s;
  }

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], body, <cue>: svg }.
  function s1(b, p) {
    const o = { head: [tr('scope', 'scope'), tr('schema', 'diagram')] };
    o.scope = card(54, 116, 'pm-dash') + txt(X0 + 8, 84, tr('scope', 'scope'), 'pm-big')
      + txt(X0 + 8, 114, tr('binnen: wat het oplevert', 'in: what it delivers'))
      + txt(X0 + 8, 144, tr('buiten: wat het niet doet', 'out: what it won’t'), 'pm-mute');
    if (b >= 1) {
      o.goal = op(at(b, p, 1, 0.05, 0.3), card(184, 128) + txt(X0 + 8, 212, tr('doelzin', 'goal sentence'), 'pm-on') + txt(X1 - 6, 212, tr('voorbeeld', 'example'), 'pm-mute', 'end'))
        + op(at(b, p, 1, 0.35, 0.6), txt(X0 + 8, 242, tr('afgezegde klussen', 'jobs cancelled'))
          + txt(X0 + 8, 268, tr('van 18% naar onder 8%', 'from 18% to under 8%'), 'pm-big') + txt(X0 + 8, 294, tr('voor juni', 'by June')));
    }
    if (b >= 2) {
      o.test = op(at(b, p, 2, 0.1, 0.4), rect(X0, 336, 34, 30, 'pm-note', 3) + path(`M${X0 + 17} 332V318M${X0 + 11} 324l6 -6l6 6`, 'pm-line')
        + txt(X0 + 48, 358, tr('dient het de doelzin?', 'does it serve the goal?'), 'pm-on'));
    }
    return o;
  }

  function s2(b, p) {
    const o = { head: [tr('vijf verzoeken', 'five requests'), tr('voorbeeld', 'example')] };
    const n = b < 2 ? 0 : b === 2 ? span(p, 0.15, 0.85) * 5 : 5;
    o.budget = txt(X0, 74, tr('40 consultantdagen', '40 consultant days'), 'pm-big') + rect(X0, 88, C.BUDGET * DAY, 22, 'pm-bar', 4) + txt(X0 + C.BUDGET * DAY - 6, 105, '40', 'pm-inv', 'end');
    o.reqs = '';
    for (let i = 0; i < 5; i++) o.reqs += op(clamp(n - i, 0, 1), rect(X0 + C.BUDGET * DAY + i * C.EACH * DAY + 1, 88, C.EACH * DAY - 2, 22, 'pm-xtra', 3));
    if (b === 1) {
      o.quotes = op(span(p, 0.05, 0.3), card(126, 62) + txt(X0 + 8, 152, tr('Als je toch bezig bent,', 'While you’re at it,')) + txt(X0 + 8, 176, tr('ook even naar lijn 4?', 'also look at line 4?'), 'pm-on'))
        + op(span(p, 0.35, 0.6), card(196, 62) + txt(X0 + 8, 222, tr('Schuif je aan bij', 'Could you join the')) + txt(X0 + 8, 246, tr('het ERP-overleg?', 'ERP meeting?'), 'pm-on'))
        + op(span(p, 0.65, 0.85), txt(X0, 286, tr('elk klein en redelijk', 'each small, reasonable'), 'pm-mute'));
    }
    const names = [tr('rapportage verkoop', 'sales report'), tr('voorraadcheck', 'stock check'), tr('sessie ERP-team', 'ERP team session'), tr('extra analyse', 'extra analysis'), tr('extra analyse', 'extra analysis')];
    if (b === 2 || b === 3) {
      names.forEach((nm, i) => { o.reqs += op(clamp(n - i, 0, 1), txt(X0, 146 + i * 28, nm) + txt(X1, 146 + i * 28, tr('2 d', '2 d'), 'pm-mute', 'end')); });
    }
    if (b >= 4) {
      o.signals = op(span(p, 0.05, 0.3), txt(X0, 146, tr('signalen', 'signs'), 'pm-mute'))
        + op(span(p, 0.1, 0.35), txt(X0, 174, tr('nieuwe mensen in overleg', 'new people at meetings')))
        + op(span(p, 0.3, 0.55), txt(X0, 202, tr('doelzin verschuift', 'the goal sentence shifts')))
        + op(span(p, 0.5, 0.75), txt(X0, 230, tr('jij werkt ’s avonds door', 'you work evenings')));
    }
    o.status = dot(X0 + 10, 284, 9, 'sc-g') + txt(X0 + 28, 291, tr('planning: groen', 'plan: green'), 'pm-txt');
    if (b >= 3) o.creep = op(at(b, p, 3, 0.05, 0.35), txt(X0, 330, tr('+10 dagen = 25% extra', '+10 days = 25% extra'), 'pm-on') + txt(X0, 358, tr('en niemand sprak het af', 'and nobody agreed it'), 'pm-txt'));
    return o;
  }

  function s3(b, p) {
    const o = { head: [tr('zichtbaar maken', 'make it visible'), tr('schema', 'diagram')] };
    o.list = card(54, 116) + txt(X0 + 8, 82, tr('elk verzoek', 'each request'), 'pm-big')
      + op(at(b, p, 0, 0.15, 0.4), txt(X0 + 8, 110, tr('wat, wie, waarom', 'what, who, why')))
      + op(at(b, p, 0, 0.45, 0.7), txt(X0 + 8, 136, tr('impact: tijd, kosten,', 'impact: time, cost,')) + txt(X0 + 8, 160, tr('risico en het doel', 'risk and the goal')));
    if (b === 1) {
      o.cr = op(span(p, 0.05, 0.3), txt(X0, 210, tr('klein: op de weeklijst', 'small: on the weekly list')))
        + op(span(p, 0.3, 0.55), card(226, 92, 'pm-hot') + txt(X0 + 8, 254, tr('groot:', 'big:'), 'pm-mute') + txt(X0 + 8, 280, tr('wijzigingsverzoek', 'change request'), 'pm-on') + txt(X0 + 8, 306, tr('de sponsor beslist', 'the sponsor decides')));
    }
    if (b === 2) {
      o.quote = op(span(p, 0.05, 0.3), card(190, 140) + txt(X0 + 8, 218, tr('Ja, en dit kost het.', 'Yes, and here’s the cost.'), 'pm-on'))
        + op(span(p, 0.3, 0.55), txt(X0 + 8, 246, tr('lijn 4: ~3 weken extra,', 'line 4: ~3 weeks extra,')) + txt(X0 + 8, 272, tr('of ploegoverdracht eraf', 'or drop the handover')))
        + op(span(p, 0.6, 0.85), txt(X0 + 8, 304, tr('Wat heeft je voorkeur?', 'Which do you prefer?'), 'pm-on'));
    }
    if (b >= 3) {
      const tilt = b === 3 ? span(p, 0.2, 0.6) : 1;
      const cx = 476;
      const dy = 14 * tilt;
      let s = path(`M${cx} 300V214M${cx - 16} 300H${cx + 16}`, 'pm-line') + dot(cx, 212, 4, 'pm-dot');
      s += path(`M${cx - 96} ${f1(222 - dy)}L${cx + 96} ${f1(222 + dy)}`, 'pm-line');
      const pan = (x, y, label, sub, sx, anchor) => path(`M${x - 34} ${f1(y + 30)}L${x} ${f1(y)}L${x + 34} ${f1(y + 30)}`, 'pm-axis') + rect(x - 40, y + 30, 80, 8, 'pm-bar', 3) + txt(x, y + 62, label, 'pm-txt', 'middle') + txt(sx, y + 86, sub, 'pm-mute', anchor);
      s += pan(cx - 96, 222 - dy, tr('erbij', 'add'), tr('lijn 4', 'line 4'), X0, 'start') + pan(cx + 96, 222 + dy, tr('kost', 'costs'), tr('tijd of een deel', 'time or a part'), X1, 'end');
      o.trade = s + txt(X0, 192, tr('afweging', 'trade-off'), 'pm-on') + op(at(b, p, 3, 0.65, 0.9), txt(X0, 350, tr('met een prijs: krimpt', 'with a price: it shrinks'), 'pm-mute'));
      if (b >= 4) o.body = op(span(p, 0.1, 0.4), txt(X0, 376, tr('de sponsor kiest, niet jij', 'the sponsor picks, not you'), 'pm-on'));
    }
    return o;
  }

  function s4(b, p) {
    if (b <= 2) {
      const o = { head: [tr('één vel', 'one sheet'), tr('voorbeeld', 'example')] };
      const names = [tr('rapportage verkoop', 'sales report'), tr('voorraadcheck', 'stock check'), tr('sessie ERP-team', 'ERP team session'), tr('extra analyse', 'extra analysis'), tr('extra analyse', 'extra analysis')];
      let s = card(54, 186);
      names.forEach((nm, i) => {
        const gone = b >= 2 && (i === 1 || i === 2) ? span(p, 0.1, 0.4) : 0;
        s += op(at(b, p, 0, 0.1 + i * 0.1, 0.25 + i * 0.1), txt(X0 + 8, 82 + i * 26, nm, gone > 0.5 ? 'pm-mute' : 'pm-txt') + txt(X1 - 6, 82 + i * 26, tr('2 d', '2 d'), 'pm-mute', 'end')
          + (gone > 0.01 ? path(`M${X0 + 6} ${76 + i * 26}H${f1(X0 + 6 + 190 * gone)}`, 'pm-strike') : ''));
      });
      s += op(at(b, p, 0, 0.65, 0.85), path(`M${X0 + 8} 210H${X1 - 6}`, 'pm-axis') + txt(X0 + 8, 230, tr('samen', 'together'), 'pm-mute') + txt(X1 - 6, 230, tr('10 dagen', '10 days'), 'pm-big', 'end'));
      o.sheet = s;
      if (b >= 1) {
        o.opts = op(at(b, p, 1, 0.05, 0.3), card(252, 52) + txt(X0 + 8, 284, 'A', 'pm-big') + txt(X0 + 32, 284, tr('einddatum +2 weken', 'end date +2 weeks')));
        o.optB = op(at(b, p, 1, 0.45, 0.7), card(312, 64, b >= 2 ? 'pm-hot' : 'pm-card') + txt(X0 + 8, 340, 'B', 'pm-big') + txt(X0 + 32, 340, tr('voorraadcheck en', 'drop the stock check')) + txt(X0 + 32, 366, tr('ERP-sessie vallen af', 'and the ERP session')));
        if (b >= 2) o.optB += op(span(p, 0.3, 0.6), txt(X1 - 6, 340, tr('gekozen', 'chosen'), 'pm-on', 'end'));
      }
      return o;
    }
    const o = { head: [tr('de mensenkant', 'the people side'), tr('schema', 'diagram')] };
    const a = b === 3 ? span(p, 0.05, 0.3) : 1;
    o.body = op(a, txt(X0, 78, tr('junior tegen senior?', 'junior against senior?'), 'pm-mute') + txt(X0, 104, tr('niet tegenspreken:', 'don’t push back:')) + txt(X0, 130, tr('de sponsor laat je kiezen', 'ask the sponsor to choose'), 'pm-on'));
    if (b >= 4) o.official = op(at(b, p, 4, 0.05, 0.35), card(156, 108) + txt(X0 + 8, 184, tr('doel klopte niet?', 'the goal was wrong?'), 'pm-mute') + txt(X0 + 8, 210, tr('officieel aanpassen:', 'change it officially:'), 'pm-on') + txt(X0 + 8, 236, tr('nieuwe doelzin, planning', 'new goal sentence, plan')) + txt(X0 + 8, 258, tr('niet laten wegdrijven', 'don’t let it drift'), 'pm-mute'));
    if (b >= 5) o.ccb = op(at(b, p, 5, 0.05, 0.35), txt(X0, 300, tr('formeel:', 'formal:'), 'pm-mute') + txt(X0, 326, tr('wijzigingscommissie', 'change control board'), 'pm-txt'))
      + op(at(b, p, 5, 0.4, 0.7), txt(X0, 356, tr('meestal:', 'usually:'), 'pm-mute') + txt(X0 + 92, 356, tr('de stuurgroep', 'the steering group'), 'pm-on'));
    return o;
  }

  function s5(b, p) {
    const o = { head: [tr('je eigen kant', 'your own side'), tr('schema', 'diagram')] };
    o.gold = card(54, 132) + txt(X0 + 8, 82, tr('gold plating', 'gold plating'), 'pm-big') + txt(X0 + 8, 108, tr('extra’s, niet gevraagd', 'extras nobody asked for'));
    if (b >= 1) o.gold += op(at(b, p, 1, 0.05, 0.3), txt(X0 + 8, 134, tr('mooier dashboard,', 'a nicer dashboard,'), 'pm-mute') + txt(X0 + 8, 158, tr('nog één analyse', 'one more analysis'), 'pm-mute'))
      + op(at(b, p, 1, 0.45, 0.7), txt(X1 - 6, 158, tr('= uren', '= hours'), 'pm-on', 'end'));
    if (b >= 2) {
      o.reserve = op(at(b, p, 2, 0.05, 0.3), txt(X0, 214, tr('experts verschillen', 'experts differ'), 'pm-mute') + txt(X0, 240, tr('elk uur tellen,', 'count every hour,')))
        + op(at(b, p, 2, 0.35, 0.6), txt(X0, 266, tr('of ~10% reserve voor gunsten', 'or ~10% for favours')))
        + op(at(b, p, 2, 0.6, 0.85), txt(X0, 292, tr('vuistregel, geen norm', 'a rule of thumb, no standard'), 'pm-mute'));
    }
    if (b >= 3) o.weekly = op(at(b, p, 3, 0.05, 0.3), card(310, 72, 'pm-hot') + txt(X0 + 8, 338, tr('Dient alles van deze', 'Does all this week’s work'), 'pm-on') + txt(X0 + 8, 364, tr('week de doelzin?', 'serve the goal sentence?'), 'pm-on'));
    return o;
  }

  function s6(b, p) {
    const o = { head: [tr('duivelsdriehoek', 'iron triangle'), tr('schema', 'diagram')] };
    const T = [476, 80];
    const Lp = [376, 196];
    const R = [576, 196];
    o.tri = path(`M${T[0]} ${T[1]}L${R[0]} ${R[1]}L${Lp[0]} ${Lp[1]}Z`, 'pm-tri')
      + dot(T[0], T[1], 6, 'pm-dot') + dot(Lp[0], Lp[1], 6, 'pm-dot') + dot(R[0], R[1], 6, 'pm-dot')
      + txt(T[0], T[1] - 14, tr('scope', 'scope'), 'pm-big', 'middle') + txt(Lp[0] - 10, Lp[1] + 28, tr('tijd', 'time'), 'pm-big', 'start') + txt(R[0] + 10, R[1] + 28, tr('kosten', 'cost'), 'pm-big', 'end');
    if (b >= 1) o.quality = op(at(b, p, 1, 0.1, 0.4), txt(T[0], 164, tr('kwaliteit', 'quality'), b === 1 ? 'pm-on' : 'pm-mute', 'middle'));
    if (b === 1) o.body = op(span(p, 0.5, 0.8), txt(X0, 268, tr('meer, zelfde tijd en geld?', 'more, same time and money?'), 'pm-txt') + txt(X0, 294, tr('maak de ruil zichtbaar', 'make the trade visible'), 'pm-on'));
    if (b === 2) {
      const show = span(p, 0.2, 0.8) * 5;
      o.week = txt(X0, 262, tr('project van 20 dagen', 'a 20-day project'), 'pm-mute') + bar(276, C.SMALL, 5, 1, show, 10)
        + op(span(p, 0.7, 0.9), txt(X0, 330, tr('5 × 1 dag = een week', '5 × 1 day = a full week'), 'pm-on'));
    }
    if (b === 3) {
      o.log = op(span(p, 0.05, 0.3), card(232, 148) + txt(X0 + 8, 260, tr('wijzigingslog', 'change log'), 'pm-on') + txt(X0 + 8, 288, tr('wat, wanneer,', 'what, when,')) + txt(X0 + 8, 312, tr('hoeveel werk, besluit', 'effort, decision')))
        + op(span(p, 0.4, 0.7), path(`M${X0 + 8} 334H${X1 - 6}M${X0 + 8} 356H${X1 - 6}`, 'pm-axis') + txt(X1 - 6, 374, tr('feiten, geen gedoe', 'facts, not blame'), 'pm-mute', 'end'));
    }
    if (b >= 4) {
      o.fixed = op(at(b, p, 4, 0.05, 0.3), card(232, 66) + txt(X0 + 8, 260, tr('vaste prijs', 'fixed price'), 'pm-big') + txt(X0 + 8, 286, tr('risico extra werk: jij', 'risk of extra work: you')));
      o.rate = op(at(b, p, 4, 0.35, 0.6), card(308, 66) + txt(X0 + 8, 336, tr('dagtarief', 'day rate'), 'pm-big') + txt(X0 + 8, 362, tr('risico: de klant', 'risk: the client')));
    }
    return o;
  }

  function s7(b, p) {
    const o = { head: [tr('vierde regio', 'a fourth region'), tr('voorbeeld', 'example')] };
    let r = '';
    for (let i = 0; i < 4; i++) {
      const x = X0 + i * 72;
      r += i < 3 ? rect(x, 56, 60, 56, 'pm-card', 6) + txt(x + 30, 92, String(i + 1), 'pm-big', 'middle')
        : op(at(b, p, 0, 0.5, 0.8), rect(x, 56, 60, 56, 'pm-dash', 6) + txt(x + 30, 92, '4?', 'pm-on', 'middle'));
    }
    o.regions = r + txt(X0, 140, tr('vaste prijs, 20 dagen', 'fixed price, 20 days'), 'pm-mute');
    if (b === 1) {
      o.ask = op(span(p, 0.05, 0.25), txt(X0, 184, tr('geschat: +4 dagen', 'estimate: +4 days'), 'pm-txt'))
        + op(span(p, 0.3, 0.55), card(200, 92, 'pm-hot') + txt(X0 + 8, 228, tr('Waar is regio 4 voor?', 'What is region 4 for?'), 'pm-on') + txt(X0 + 8, 254, tr('een vraag van de directie?', 'a board question?')))
        + op(span(p, 0.7, 0.9), txt(X0 + 8, 280, tr('lichter kan vaak ook', 'lighter often does'), 'pm-mute'));
    }
    if (b === 2) {
      const rows = [['1', tr('erbij: +4 d, dagtarief', 'add: +4 d, day rate')], ['2', tr('ruilen tegen regio 3', 'swap for region 3')], ['3', tr('licht: kerncijfer, 1 d', 'light: key number, 1 d')]];
      o.opts = rows.map(([n, t], i) => op(span(p, 0.05 + i * 0.2, 0.2 + i * 0.2), card(166 + i * 52, 46) + txt(X0 + 8, 196 + i * 52, n, 'pm-big') + txt(X0 + 32, 196 + i * 52, t))).join('')
        + op(span(p, 0.7, 0.9), txt(X0, 346, tr('of later, als vervolg', 'or later, as a follow-up'), 'pm-mute') + txt(X1, 374, tr('de klant kiest', 'the client chooses'), 'pm-on', 'end'));
    }
    if (b === 3) {
      o.mgr = op(span(p, 0.05, 0.3), card(176, 104, 'pm-hot') + txt(X0 + 8, 206, tr('eerst je eigen manager,', 'your own manager first,'), 'pm-on') + txt(X0 + 8, 232, tr('dan pas een prijs', 'then a price')))
        + op(span(p, 0.45, 0.7), txt(X0 + 8, 262, tr('je bureau betaalt', 'your firm pays'), 'pm-mute'));
    }
    if (b === 4) {
      o.log = op(span(p, 0.05, 0.3), txt(X0, 184, tr('na het gesprek: mail', 'after the talk: email'), 'pm-txt') + txt(X0, 210, tr('en een regel in de log', 'and a line in the log'), 'pm-txt'));
      o.cr = op(span(p, 0.4, 0.65), card(232, 118) + txt(X0 + 8, 260, tr('groter:', 'bigger:'), 'pm-mute') + txt(X0 + 8, 286, tr('wijzigingsverzoek', 'change request'), 'pm-on') + txt(X0 + 8, 312, tr('werk, dagen, prijs', 'work, days, price')) + txt(X0 + 8, 336, tr('de klant tekent', 'the client signs'), 'pm-mute'));
    }
    if (b >= 5) {
      o.free = op(span(p, 0.05, 0.3), txt(X0, 184, tr('gratis extraatje?', 'a free extra?'), 'pm-mute') + txt(X0, 210, tr('“deze is van ons”', '“this one’s on us”')))
        + op(span(p, 0.3, 0.55), txt(X0, 238, tr('of: leert de klant vragen', 'or: teaches them to ask'), 'pm-txt'))
        + op(span(p, 0.6, 0.85), card(262, 72, 'pm-hot') + txt(X0 + 8, 290, tr('Wat laat je vallen', 'What would you drop'), 'pm-on') + txt(X0 + 8, 316, tr('om hier ruimte te maken?', 'to make room for this?'), 'pm-on'));
    }
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7];

  // ---------------------------------------------------------------- the room's paper
  // the request notes on the table: five pile up in s2, three stay after the sponsor drops two (s4)
  function notes(si, b, p) {
    let n = 0;
    if (si === 1) n = b < 2 ? 0 : b === 2 ? span(p, 0.15, 0.85) * 5 : 5;
    else if (si === 2) n = 5;
    else if (si === 3) n = b < 2 ? 5 : 5 - 2 * span(p, 0.1, 0.4);
    else if (si > 3) n = 3;
    let s = '';
    C.NOTES.forEach(([x, y, r], i) => {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += op(a, `<rect class="pm-note" x="${x}" y="${y}" width="9" height="9" rx="0.6" transform="rotate(${r} ${x + 4.5} ${y + 4.5})"/>`);
    });
    return s;
  }
  // the calendar strip: this week ringed (week 5 in the example), and the status dot that stays green
  function calendar(si) {
    const wk = si === 0 ? 2 : si >= 5 ? 3 : 5;
    const [a, b2, c, d] = C.CELLS[wk - 1];
    const [h0, h1] = C.HEAD;
    return rect(a, b2, c - a, d - b2, 'pm-hot', 1) + dot(h0, h1, 3.4, 'sc-g');
  }
  // the sheet for the sponsor on the table (s4): five lines, a total and the two options
  function sheet(si, b, p) {
    const n = si < 3 ? 0 : si > 3 ? 8 : b === 0 ? span(p, 0.1, 0.9) * 6 : b === 1 ? 6 + span(p, 0.1, 0.7) * 2 : 8;
    let s = '';
    for (let i = 0; i < 8; i++) {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += `<path class="pm-line" d="M2.5 ${f1(4 + i * 3.2)}H${f1(2.5 + (i === 5 ? 9 : 15) * a)}"/>`;
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
    for (const c of C.CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.nPile, notes(si, b, p));
    set(E.cMarks, calendar(si));
    set(E.dLines, sheet(si, b, p));
  }

  return { render };
})();
