// The stage of the film "Vastgelopen: welk soort probleem? / Stuck: which kind
// of problem?": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the examples'
// numbers and the calendar cells), CAM (one camera move per scene), W and H.
// Moves are placed per caption beat (beatStarts on the Dutch captions), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step. The
// panel at the right gets one card per scene, each part in its own cue group;
// the board in the room repeats it in miniature, the calendar strip marks the
// week the scene is about (and, in the reset scenes, the status colour), and
// the sheet on the table fills in when a page is written.
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
  // a small yes / no chip at the right of a row
  const chip = (y, word, hot) => rect(X1 - 52, y - 20, 56, 28, hot ? 'pm-hot' : 'pm-card', 6) + txt(X1 - 24, y, word, hot ? 'pm-on' : 'pm-mute', 'middle');

  // ---------------------------------------------------------------- the four kinds (s1, s2)
  const KINDS = ['goal', 'way', 'people', 'cap'];
  const LABEL = () => [tr('onduidelijk doel', 'unclear goal'), tr('onduidelijke weg', 'unclear way'), tr('mensenprobleem', 'people problem'), tr('capaciteitsprobleem', 'capacity problem')];
  const ROW = (i) => 54 + i * 80;
  // one row: a card, its label, and a second line (or none)
  const row = (i, line, cls = 'pm-txt', hot = false) => card(ROW(i), 72, hot ? 'pm-hot' : 'pm-card') + txt(X0 + 8, ROW(i) + 28, LABEL()[i], 'pm-big') + (line ? txt(X0 + 8, ROW(i) + 56, line, cls) : '');

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  function s1(b, p) {
    const o = { head: [tr('vier soorten', 'four kinds'), tr('schema', 'diagram')] };
    const DEF = [tr('oneens over succes', 'disagree on success'), tr('doel helder, hoe niet', 'clear goal, no how'), tr('iemands ja ontbreekt', 'someone’s yes missing'), tr('eens, maar geen tijd', 'agree, but no time')];
    const Q = [tr('zelfde doel, één zin?', 'same goal, one line?'), tr('volgende 3 stappen?', 'next three steps?'), tr('steun die we missen?', 'support we lack?'), tr('echt de uren?', 'the hours, really?')];
    KINDS.forEach((k, i) => {
      const show = b === 0 ? span(p, 0.1 + i * 0.15, 0.3 + i * 0.15) : 1;
      let line = '';
      let cls = 'pm-txt';
      if (b >= 3) { line = Q[i]; cls = 'pm-on'; } else if ((b >= 1 && i < 2) || (b >= 2 && i >= 2)) line = DEF[i];
      const fade = b === 1 && i < 2 ? span(p, 0.1 + i * 0.4, 0.35 + i * 0.4) : b === 2 && i >= 2 ? span(p, 0.1 + (i - 2) * 0.4, 0.35 + (i - 2) * 0.4) : b === 3 ? span(p, 0.15 + i * 0.18, 0.3 + i * 0.18) : 1;
      o[k] = op(show, row(i, '') + op(fade, line ? txt(X0 + 8, ROW(i) + 56, line, cls) : ''));
    });
    if (b >= 4) {
      // the first no: the answers fill in, and the first no lights up
      const ans = [tr('ja', 'yes'), tr('ja', 'yes'), tr('nee', 'no'), tr('nee', 'no')];
      KINDS.forEach((k, i) => { if (i !== 2) o[k] += op(span(p, 0.05 + i * 0.1, 0.2 + i * 0.1), chip(ROW(i) + 30, ans[i], false)); });
      // the first no: its row ringed, and its chip lit
      o.first = op(span(p, 0.25, 0.45), chip(ROW(2) + 30, ans[2], true))
        + op(span(p, 0.45, 0.65), rect(X0 - 7, ROW(2) - 3, CW + 14, 78, 'pm-ring', 10));
    }
    return o;
  }

  function s2(b, p) {
    if (b <= 3) {
      const fixes = b === 3;
      const o = { head: fixes ? [tr('oplossingen', 'fixes'), tr('schema', 'diagram')] : [tr('symptomen', 'symptoms'), tr('schema', 'diagram')] };
      const SYM = [tr('elke sessie weer open', 'every workshop reopens'), tr('analyses in rondjes', 'analysis loops'), tr('één persoon loopt uit', 'one person slips'), tr('iedereen loopt uit', 'everyone slips')];
      const FIX = [tr('→ de sponsor kiest', '→ the sponsor chooses'), tr('→ experiment, expert', '→ experiment, expert'), tr('→ één-op-één', '→ one-on-one')];
      const when = [0, 1, 1, 2];
      KINDS.forEach((k, i) => {
        if (fixes) {
          o[k] = row(i, '');
          if (i < 3) o[k] += op(span(p, 0.05 + i * 0.2, 0.2 + i * 0.2), txt(X0 + 8, ROW(i) + 56, FIX[i], 'pm-on'));
        } else {
          const a = b > when[i] ? 1 : b < when[i] ? 0 : span(p, i === 2 ? 0.45 : 0.05, i === 2 ? 0.65 : 0.25);
          o[k] = row(i, '') + op(a, txt(X0 + 8, ROW(i) + 56, SYM[i], 'pm-txt'));
        }
      });
      if (fixes) o.trade = op(span(p, 0.65, 0.85), txt(X0 + 8, ROW(3) + 56, tr('→ wat krijgt minder tijd?', '→ what gets less time?'), 'pm-on'));
      return o;
    }
    if (b === 4) {
      const o = { head: [tr('de keten', 'the chain'), tr('schema', 'diagram')] };
      const names = [tr('doel', 'goal'), tr('weg', 'way'), tr('mensen', 'people'), tr('capaciteit', 'capacity')];
      o.mistake = op(span(p, 0.02, 0.2), card(54, 120, 'pm-hot') + txt(X0 + 8, 82, tr('klassieke fout:', 'classic mistake:'), 'pm-mute')
        + txt(X0 + 8, 108, tr('doelprobleem behandeld', 'a goal problem treated'), 'pm-txt') + txt(X0 + 8, 134, tr('als mensenprobleem', 'as a people problem'), 'pm-txt') + txt(X0 + 8, 160, tr('en harder duwen', 'by pushing harder'), 'pm-on'));
      let s = '';
      names.forEach((nm, i) => {
        s += op(span(p, 0.45 + i * 0.08, 0.55 + i * 0.08), rect(X0, 196 + i * 46, 124, 34, i === 0 ? 'pm-hot' : 'pm-card', 6) + txt(X0 + 10, 220 + i * 46, nm, i === 0 ? 'pm-on' : 'pm-txt'));
        if (i < 3) s += op(span(p, 0.5 + i * 0.08, 0.6 + i * 0.08), path(`M${X0 + 62} ${230 + i * 46}V${242 + i * 46}`, 'pm-line'));
      });
      o.chain = s + op(span(p, 0.75, 0.9), txt(X0 + 136, 220, tr('twee soorten?', 'two kinds?'), 'pm-mute') + txt(X0 + 136, 246, tr('begin bij', 'start with')) + txt(X0 + 136, 272, tr('de vroegste', 'the earliest'), 'pm-on'));
      return o;
    }
    const o = { head: [tr('zie het vroeg', 'notice it early'), tr('schema', 'diagram')] };
    o.early = card(54, 92) + txt(X0 + 8, 82, tr('signaal:', 'signal:'), 'pm-mute') + txt(X0 + 8, 108, tr('al twee weken', 'two weeks “about to”'), 'pm-on') + txt(X0 + 8, 134, tr('“op het punt”', 'do the same thing'), 'pm-on');
    if (b === 5) {
      // a strip of ten weeks: week 3 seen (the skill), week 9 (late)
      let wk = '';
      for (let i = 1; i <= 10; i++) wk += rect(X0 + (i - 1) * 28, 170, 24, 24, i === 3 ? 'pm-hot' : 'pm-card', 4);
      wk += txt(X0 + 2 * 28 + 12, 216, '3', 'pm-on', 'middle') + txt(X0 + 8 * 28 + 12, 216, '9', 'pm-mute', 'middle');
      o.early += op(span(p, 0.4, 0.7), wk + txt(X0, 244, tr('week 3, niet week 9:', 'week 3, not week 9:'), 'pm-txt') + txt(X0, 270, tr('dat is het vak', 'that is the skill'), 'pm-on'));
    }
    if (b >= 6) {
      o.debate = op(span(p, 0.03, 0.2), txt(X0, 182, tr('experts twisten:', 'experts argue:'), 'pm-mute') + txt(X0, 208, tr('bijna altijd mensen?', 'nearly always people?'), 'pm-txt'))
        + op(span(p, 0.25, 0.45), txt(X0, 234, tr('of: “weerstand” geeft de', 'or: “resistance” blames'), 'pm-txt') + txt(X0, 260, tr('schuld van een besluit', 'people for a decision'), 'pm-txt') + txt(X0, 286, tr('dat niemand nam', 'that nobody took'), 'pm-txt'));
      o.ask = op(span(p, 0.6, 0.8), card(306, 74, 'pm-hot') + txt(X0 + 8, 334, tr('Welk besluit', 'Which decision'), 'pm-on') + txt(X0 + 8, 360, tr('neemt niemand?', 'is nobody taking?'), 'pm-on'));
    }
    return o;
  }

  function s3(b, p) {
    const o = { head: [tr('derde sessie', 'third workshop'), tr('voorbeeld', 'example')] };
    if (b <= 1) {
      o.check = card(54, 96) + txt(X0 + 8, 82, tr('gereedheidscheck', 'readiness check'), 'pm-big') + txt(X1 - 6, 82, tr('week 7', 'week 7'), 'pm-mute', 'end')
        + op(at(b, p, 0, 0.3, 0.55), txt(X0 + 8, 110, tr('heeft de klus alles?', 'does the job have it all?')) + txt(X0 + 8, 136, tr('dan vrij naar de ploeg', 'then release to a crew'), 'pm-mute'));
    } else {
      o.verdict = card(54, 96, 'pm-hot') + op(at(b, p, 2, 0.05, 0.3), txt(X0 + 8, 82, tr('sponsor: “Zorg gewoon', 'sponsor: “Just make'), 'pm-mute') + txt(X0 + 8, 108, tr('dat het werkt.”', 'it work.”'), 'pm-mute'))
        + op(at(b, p, 2, 0.55, 0.8), txt(X0 + 8, 136, tr('= onduidelijk doel', '= an unclear goal'), 'pm-on'));
    }
    if (b >= 1) {
      o.strict = op(at(b, p, 1, 0.05, 0.25), card(160, 130) + txt(X0 + 8, 186, tr('streng', 'strict'), 'pm-big') + txt(X1 - 6, 186, tr('hoofd planning', 'head of planning'), 'pm-mute', 'end')
        + txt(X0 + 8, 212, tr('niets vrij zonder', 'nothing released without')) + txt(X0 + 8, 238, tr('schakelplan, materiaal', 'switching plan, material')));
      o.light = op(at(b, p, 1, 0.5, 0.7), card(300, 86) + txt(X0 + 8, 326, tr('licht', 'light'), 'pm-big') + txt(X1 - 6, 326, tr('hoofd uitvoering', 'head of execution'), 'pm-mute', 'end')
        + txt(X0 + 8, 352, tr('“streng is nog later”', '“strict is even later”')));
    }
    if (b >= 3) {
      // what each design serves
      o.strict += op(at(b, p, 3, 0.05, 0.3), txt(X0 + 8, 268, tr('→ minder afzeggingen', '→ fewer cancellations'), 'pm-on'));
      o.light += op(at(b, p, 3, 0.35, 0.6), txt(X0 + 8, 378, tr('→ sneller vrijgeven', '→ faster release'), 'pm-on'));
    }
    if (b >= 4) {
      o.verdict = '';
      o.strict = '';
      o.light = '';
      o.page = op(at(b, p, 4, 0.05, 0.3), card(54, 168) + txt(X0 + 8, 82, tr('één A4', 'one page'), 'pm-big')
        + txt(X0 + 150, 82, tr('streng', 'strict'), 'pm-mute') + txt(X1 - 6, 82, tr('licht', 'light'), 'pm-mute', 'end')
        + path(`M${X0 + 8} 92H${X1 - 6}`, 'pm-axis')
        + txt(X0 + 8, 118, tr('afzeggingen', 'cancelled')) + txt(X0 + 8, 144, tr('vrijgavetijd', 'release time'))
        + txt(X0 + 168, 118, '↓', 'pm-on') + txt(X1 - 18, 118, '↑', 'pm-mute') + txt(X0 + 168, 144, '↑', 'pm-mute') + txt(X1 - 18, 144, '↓', 'pm-on'))
        + op(at(b, p, 4, 0.5, 0.75), txt(X0 + 8, 180, tr('vooraf aan beide', 'tell both heads'), 'pm-mute') + txt(X0 + 8, 206, tr('hoofden verteld', 'beforehand'), 'pm-mute'));
    }
    if (b >= 5) {
      o.target = op(span(p, 0.05, 0.3), card(238, 120, 'pm-hot') + txt(X0 + 8, 264, tr('de sponsor kiest, of:', 'the sponsor picks, or:'), 'pm-mute')
        + txt(X0 + 8, 292, tr('afzeggingen < 8%', 'cancellations < 8%'), 'pm-on') + txt(X0 + 8, 318, tr('vrijgeven ≤ 2 dagen later', 'release ≤ 2 days later'), 'pm-on'))
        + op(span(p, 0.65, 0.85), txt(X0 + 8, 346, tr('dan pas ontwerpen', 'then design to it'), 'pm-txt'));
    }
    return o;
  }

  function s4(b, p) {
    const o = { head: [tr('omkeerbaar?', 'reversible?'), tr('schema', 'diagram')] };
    o.certain = card(54, 66) + txt(X0 + 8, 80, tr('niet: zeker?', 'not: are we sure?'), 'pm-mute') + txt(X0 + 8, 106, tr('wel: kost het, terug?', 'but: cost, undo?'), 'pm-on');
    // a door that swings both ways, and one that only opens one way
    const door = (x, y, two) => rect(x, y, 56, 92, 'pm-card', 3) + dot(x + 46, y + 48, 3, 'pm-dot')
      + path(two ? `M${x + 10} ${y + 112}h36M${x + 18} ${y + 105}l-8 7l8 7M${x + 38} ${y + 105}l8 7l-8 7` : `M${x + 10} ${y + 112}h36M${x + 38} ${y + 105}l8 7l-8 7`, 'pm-line');
    if (b >= 1) {
      o.rev = op(at(b, p, 1, 0.05, 0.3), door(X0, 146, true) + txt(X0 + 70, 164, tr('omkeerbaar', 'reversible'), 'pm-big') + txt(X0 + 70, 190, tr('overlegformat,', 'meeting format,'), 'pm-txt') + txt(X0 + 70, 216, tr('planningsregel, bord', 'planning rule, board'), 'pm-txt'))
        + op(at(b, p, 1, 0.5, 0.75), txt(X0 + 70, 242, tr('snel: test het', 'fast: test it'), 'pm-on'));
    }
    if (b >= 2) {
      o.irrev = op(at(b, p, 2, 0.05, 0.3), door(X0, 266, false) + txt(X0 + 70, 284, tr('onomkeerbaar', 'irreversible'), 'pm-big') + txt(X0 + 70, 310, tr('machine, contract,', 'machine, contract,'), 'pm-txt') + txt(X0 + 70, 336, tr('reorganisatie', 'reorganisation'), 'pm-txt'))
        + op(at(b, p, 2, 0.5, 0.75), txt(X0 + 70, 362, tr('traag en zorgvuldig', 'slow and careful'), 'pm-on'));
    }
    if (b >= 3) {
      o.certain = '';
      o.bezos = op(at(b, p, 3, 0.05, 0.3), card(54, 84) + txt(X0 + 8, 80, tr('Bezos, brief over 2015:', 'Bezos, letter for 2015:'), 'pm-mute') + txt(X0 + 8, 106, tr('“two-way doors”', '“two-way doors”'), 'pm-on') + txt(X0 + 8, 130, tr('april 2016', 'April 2016'), 'pm-mute'));
    }
    if (b >= 4) {
      o.bezos = '';
      o.back = op(span(p, 0.05, 0.3), card(54, 84, 'pm-hot') + txt(X0 + 8, 80, tr('Wat kost teruggaan,', 'What does going back'), 'pm-on') + txt(X0 + 8, 106, tr('in geld en vertrouwen?', 'cost: money, trust?'), 'pm-on'))
        + txt(X0 + 8, 130, tr('klein ≠ makkelijk terug', 'small ≠ easy to undo'), 'pm-mute');
    }
    return o;
  }

  function s5(b, p) {
    if (b <= 2) {
      const o = { head: [tr('klein experiment', 'small experiment'), tr('schema', 'diagram')] };
      o.exp = card(54, 58) + txt(X0 + 8, 78, tr('experiment', 'experiment'), 'pm-big') + txt(X0 + 8, 102, tr('vaste duur + een meting', 'time-boxed + a measure'));
      o.hyp = op(at(b, p, 0, 0.45, 0.7), card(120, 84) + txt(X0 + 8, 144, tr('hypothese', 'hypothesis'), 'pm-big') + txt(X0 + 8, 168, tr('vooraf bevestigen →', 'confirm ahead →'), 'pm-txt') + txt(X0 + 8, 192, tr('minder afzeggingen', 'fewer cancellations'), 'pm-txt'));
      if (b >= 1) {
        o.test = op(at(b, p, 1, 0.2, 0.45), card(212, 84) + txt(X0 + 8, 236, tr('2 planners, 2 weken,', '2 planners, 2 weeks,')) + txt(X0 + 8, 260, tr('~40 klussen', '~40 jobs')))
          + op(at(b, p, 1, 0.6, 0.85), txt(X0 + 8, 284, tr('meten: tegen wat?', 'measure: against what?'), 'pm-mute'));
      }
      if (b >= 2) {
        o.stop = op(span(p, 0.05, 0.3), card(306, 76, 'pm-hot') + txt(X0 + 8, 332, tr('stopcriterium, vooraf:', 'stop criterion, agreed first:'), 'pm-on') + txt(X0 + 8, 358, tr('door bij X, stop bij Y', 'go on at X, stop at Y')));
      }
      return o;
    }
    const o = { head: [tr('ja zeggen', 'saying yes'), tr('schema', 'diagram')] };
    o.yes = card(54, 104) + txt(X0 + 8, 82, tr('“Twee weken proberen,', '“Two weeks, then we'), 'pm-on') + txt(X0 + 8, 108, tr('dan samen beslissen.”', 'decide together.”'), 'pm-on')
      + txt(X0 + 8, 138, tr('niet: “vanaf maandag”', 'not: “from Monday”'), 'pm-mute');
    o.yes += op(at(b, p, 3, 0.55, 0.8), txt(X0, 190, tr('belofte: open evalueren,', 'promise: evaluate openly,')) + txt(X0, 216, tr('en echt stoppen', 'and really stop'), 'pm-on'));
    if (b >= 4) {
      const F = [tr('geen vergelijkingsgroep', 'no comparison group'), tr('twee veranderingen tegelijk', 'two changes at once'), tr('testteam krijgt alle', 'test team gets all'), tr('aandacht', 'the attention')];
      o.fails = op(span(p, 0.02, 0.15), txt(X0, 262, tr('typische fouten', 'typical failures'), 'pm-mute'))
        + F.map((t, i) => op(span(p, 0.1 + Math.min(i, 2) * 0.2, 0.25 + Math.min(i, 2) * 0.2), txt(X0 + (i === 3 ? 22 : 0), 288 + i * 26, `${i < 3 ? '× ' : ''}${t}`, 'pm-txt'))).join('');
    }
    return o;
  }

  function s6(b, p) {
    if (b <= 3) {
      const o = { head: [tr('belletje vooraf', 'the call ahead'), tr('voorbeeld', 'example')] };
      o.case = card(54, 92) + txt(X0 + 8, 82, tr('3 weken discussie', '3 weeks of debate'), 'pm-mute') + txt(X0 + 8, 108, tr('aannemer bellen, 2 dagen', 'call the contractor 2 days')) + txt(X0 + 8, 134, tr('vooraf? afzeggingen 16%', 'ahead? cancellations 16%'), 'pm-big');
      if (b >= 1) {
        o.test = op(at(b, p, 1, 0.05, 0.3), rect(X0, 160, 136, 64, 'pm-hot', 6) + txt(X0 + 8, 186, tr('2 planners', '2 planners'), 'pm-on') + txt(X0 + 8, 212, tr('bellen vooraf', 'call ahead')))
          + op(at(b, p, 1, 0.35, 0.6), rect(X0 + 148, 160, 136, 64, 'pm-card', 6) + txt(X0 + 156, 186, tr('de anderen', 'the others'), 'pm-big') + txt(X0 + 156, 212, tr('als altijd', 'as usual')))
          + op(at(b, p, 1, 0.65, 0.9), txt(X0, 248, tr('meet beide groepen', 'measure both groups'), 'pm-mute'));
      }
      if (b >= 2) {
        o.crit = op(at(b, p, 2, 0.05, 0.3), card(262, 66) + txt(X0 + 8, 288, tr('door: −⅓, naar ~11%', 'go: −⅓, to ~11%'), 'pm-on') + txt(X0 + 8, 314, tr('en < 10 min per belletje', 'and < 10 min per call')))
          + op(at(b, p, 2, 0.6, 0.85), txt(X0 + 8, 352, tr('anders: stoppen', 'otherwise: drop it'), 'pm-mute'));
      }
      if (b >= 3) {
        o.crit = '';
        o.cost = op(span(p, 0.05, 0.3), card(262, 118) + txt(X0 + 8, 288, tr('40 × 6 min = 4 uur', '40 × 6 min = 4 hours'), 'pm-big') + txt(X0 + 8, 314, tr('weinig naast één', 'small next to one'), 'pm-txt') + txt(X0 + 8, 340, tr('afgezegde ploegdag', 'cancelled crew day'), 'pm-txt'))
          + op(span(p, 0.6, 0.85), txt(X0 + 8, 368, tr('een test: samen delen', 'a test, shared together'), 'pm-mute'));
      }
      return o;
    }
    const o = { head: [tr('de grens', 'the limit'), tr('schema', 'diagram')] };
    o.safety = card(54, 144, 'pm-hot') + txt(X0 + 8, 82, tr('nooit met veiligheid', 'never with safety'), 'pm-on')
      + txt(X0 + 8, 110, tr('schakelprocedures', 'switching procedures')) + txt(X0 + 8, 136, tr('vergrendeling: eigen slot', 'lockout: own padlock')) + txt(X0 + 8, 162, tr('op de energie', 'on the energy'), 'pm-mute')
      + txt(X0 + 8, 188, tr('hoe groot de druk ook is', 'whatever the pressure'), 'pm-on');
    const R = [tr('vrijschakelen', 'disconnect'), tr('beveiligen tegen herinsch.', 'secure: no reconnection'), tr('spanningsloos vaststellen', 'verify no voltage'), tr('aarden en kortsluiten', 'earth and short-circuit'), tr('naastgelegen afschermen', 'shield nearby live parts')];
    o.rules = op(at(b, p, 4, 0.5, 0.8), txt(X0, 224, tr('vijf veiligheidsregels', 'five safety rules'), 'pm-big') + txt(X0, 248, tr('NEN 3140 en EN 50110', 'EN 50110; NL: NEN 3140'), 'pm-mute'));
    if (b >= 5) o.rules += R.map((t, i) => op(span(p, 0.05 + i * 0.15, 0.2 + i * 0.15), txt(X0, 274 + i * 24, `${i + 1}`, 'pm-on') + txt(X0 + 22, 274 + i * 24, t, 'pm-txt'))).join('');
    return o;
  }

  function s7(b, p) {
    if (b <= 2) {
      const o = { head: [tr('afdrijven', 'drifting'), tr('schema', 'diagram')] };
      // the planned line and the real one drifting away from it
      o.drift = path(`M${X0} 160L${X1} 70`, 'pm-dash') + txt(X1, 62, tr('plan', 'plan'), 'pm-mute', 'end')
        + path(`M${X0} 160C${X0 + 90} 140 ${X0 + 180} 130 ${X1} 132`, 'pm-line') + txt(X1, 156, tr('werkelijk', 'actual'), 'pm-txt', 'end')
        + op(at(b, p, 0, 0.5, 0.8), txt(X0, 196, tr('hopen op inhalen:', 'hoping to catch up:'), 'pm-mute') + txt(X0 + 2, 222, tr('vaakst en duurst', 'most common, costliest'), 'pm-on'));
      if (b >= 1) {
        o.sunk = op(at(b, p, 1, 0.05, 0.3), card(240, 66) + txt(X0 + 8, 266, tr('verzonken kosten', 'sunk cost'), 'pm-big') + txt(X0 + 8, 292, tr('alleen de toekomst telt', 'only the future counts')));
      }
      if (b >= 2) {
        o.reset = op(span(p, 0.05, 0.3), card(316, 66, 'pm-hot') + txt(X0 + 8, 342, tr('herstart: eerlijk kijken,', 'reset: look honestly,'), 'pm-on') + txt(X0 + 8, 368, tr('nieuwe afspraak', 'agree a new deal')));
      }
      return o;
    }
    const o = { head: [tr('eerlijke A4', 'honest page'), tr('schema', 'diagram')] };
    const cols = [tr('doel', 'goal'), tr('scope', 'scope'), tr('tijd', 'time'), tr('mensen', 'people'), tr('resultaat', 'results')];
    o.page = card(54, 146) + txt(X0 + 8, 80, tr('plan ↔ werkelijk', 'plan ↔ reality'), 'pm-big')
      + cols.map((c, i) => txt(X0 + 8 + (i % 3) * 94, 106 + Math.floor(i / 3) * 24, c, 'pm-txt')).join('')
      + txt(X0 + 8, 160, tr('oorzaken: doel, weg,', 'causes: goal, way,'), 'pm-mute') + txt(X0 + 8, 184, tr('mensen, capaciteit', 'people, capacity'), 'pm-mute');
    if (b >= 3) {
      // the watermelon: green outside, red inside
      const cx = X0 + 40;
      const cy = 248;
      o.rag = op(at(b, p, 3, 0.05, 0.3), dot(cx, cy, 30, 'sc-g') + dot(cx, cy, 23, 'sc-r') + txt(X0 + 84, 230, tr('RAG-status', 'RAG status'), 'pm-big')
        + txt(X0 + 84, 256, tr('groen van buiten,', 'green outside,')) + txt(X0 + 84, 282, tr('rood van binnen', 'red inside'), 'pm-on'))
        + op(at(b, p, 3, 0.6, 0.85), txt(X0, 312, tr('oranje dat nooit rood wordt', 'amber that never turns red'), 'pm-mute'));
    }
    if (b >= 4) {
      o.own = op(span(p, 0.05, 0.3), txt(X0, 344, tr('eigen aandeel: “week 4', 'own part: “week 4 I should'), 'pm-on') + txt(X0, 370, tr('had ik moeten escaleren”', 'have escalated”'), 'pm-on'));
    }
    return o;
  }

  function s8(b, p) {
    if (b <= 1) {
      const o = { head: [tr('het gesprek', 'the conversation'), tr('schema', 'diagram')] };
      o.talk = card(54, 118) + txt(X0 + 8, 82, tr('1 je eigen manager', '1 your own manager'), 'pm-txt') + txt(X0 + 8, 108, tr('2 sponsor, 45 minuten', '2 sponsor, 45 minutes'), 'pm-txt')
        + op(at(b, p, 0, 0.45, 0.7), txt(X0 + 8, 136, tr('“Zo haalt dit project', '“As set up, it won’t'), 'pm-on') + txt(X0 + 8, 162, tr('zijn doel niet.”', 'reach its goal.”'), 'pm-on'));
      if (b >= 1) {
        const O = [tr('stoppen, overdragen', 'stop, hand over'), tr('scope kleiner, goed af', 'shrink, finish well'), tr('opnieuw plannen', 're-plan, new terms')];
        o.opts = O.map((t, i) => op(span(p, 0.1 + i * 0.2, 0.25 + i * 0.2), card(190 + i * 62, 52) + txt(X0 + 8, 222 + i * 62, `${i + 1}`, 'pm-big') + txt(X0 + 32, 222 + i * 62, t))).join('');
      }
      return o;
    }
    const o = { head: [tr('nieuwe afspraak', 'the new deal'), tr('schema', 'diagram')] };
    o.recon = card(54, 172) + txt(X0 + 8, 82, tr('opnieuw contracteren', 're-contracting'), 'pm-big')
      + txt(X0 + 8, 110, tr('doel, scope, einddatum,', 'goal, scope, end date,')) + txt(X0 + 8, 136, tr('rollen, toezeggingen', 'roles, what the sponsor')) + txt(X0 + 8, 162, tr('sponsor, op papier:', 'commits to, in writing:'))
      + txt(X0 + 8, 188, tr('bij elke stuurgroep,', 'every steering group,'), 'pm-mute') + txt(X0 + 8, 214, tr('twee planners vrij', 'two planners freed'), 'pm-mute');
    if (b >= 3) o.ijk = op(at(b, p, 3, 0.05, 0.3), card(238, 92, 'pm-hot') + txt(X0 + 8, 264, tr('ijkmoment', 'check-in point'), 'pm-big') + txt(X0 + 8, 290, tr('“week 20 niet op X:', '“not at X by week 20:'), 'pm-on') + txt(X0 + 8, 316, tr('dan stoppen we”', 'we stop”'), 'pm-on'))
      + op(at(b, p, 3, 0.6, 0.85), txt(X0, 354, tr('alleen datums: mislukt weer', 'only new dates: fails again'), 'pm-mute'));
    if (b >= 4) {
      o.ijk = '';
      o.relief = op(span(p, 0.05, 0.3), txt(X0, 252, tr('sponsors: vaak opgelucht', 'sponsors: often relieved'), 'pm-on'))
        + op(span(p, 0.3, 0.5), txt(X0, 278, tr('nieuwe leider? fris,', 'new lead? a fresh face,'), 'pm-mute') + txt(X0, 302, tr('of verdiend vertrouwen', 'or earned trust'), 'pm-mute'))
        + op(span(p, 0.6, 0.8), card(316, 68, 'pm-hot') + txt(X0 + 8, 342, tr('Zouden we dit project', 'Knowing what we know,'), 'pm-on') + txt(X0 + 8, 368, tr('vandaag starten?', 'start it today?'), 'pm-on'));
    }
    return o;
  }

  function s9(b, p) {
    const o = { head: [tr('week 14 van 20', 'week 14 of 20'), tr('voorbeeld', 'example')] };
    o.case = b >= 2 ? '' : card(54, 92) + txt(X0 + 8, 82, tr('doel: vrijgavetijd ÷ 2', 'goal: release time ÷ 2'), 'pm-big') + txt(X0 + 8, 108, tr('in 3 regio’s', 'in 3 regions'))
      + op(at(b, p, 0, 0.5, 0.75), txt(X0 + 8, 134, tr('nu: 1 regio, 10% korter', 'now: 1 region, 10% faster'), 'pm-on'));
    if (b === 1) {
      o.causes = op(span(p, 0.05, 0.3), txt(X0, 172, tr('sponsor: 1 van 4 keer', 'sponsor: 1 of 4 times'), 'pm-txt') + txt(X0, 198, tr('2 planners weg in mnd 2,', '2 planners left, month 2,'), 'pm-txt') + txt(X0, 224, tr('niet vervangen', 'not replaced'), 'pm-txt'))
        + op(span(p, 0.35, 0.55), dot(X0 + 10, 248, 9, 'sc-a') + txt(X0 + 28, 255, tr('meldt oranje: risico', 'reports amber: at risk'), 'pm-txt'))
        + op(span(p, 0.6, 0.85), card(272, 66, 'pm-hot') + txt(X0 + 8, 298, tr('oorzaak: capaciteit', 'cause: capacity'), 'pm-on') + txt(X0 + 8, 324, tr('en mensen (sponsor)', 'and people (sponsor)'), 'pm-on'))
        + op(span(p, 0.7, 0.95), txt(X0, 366, tr('eigen aandeel: maand 2', 'own part: month 2'), 'pm-mute'));
    }
    if (b >= 2) {
      const O = [['A', tr('stoppen, overdragen', 'stop, hand over')], ['B', tr('pilotregio, −40%, 6 wk', 'pilot region, −40%, 6 wk')], ['C', tr('3 regio’s, +2 planners,', '3 regions, +2 planners,')]];
      o.opts = O.map(([n, t], i) => op(at(b, p, 2, 0.05 + i * 0.25, 0.2 + i * 0.25), card(54 + i * 62, i === 2 ? 78 : 52, b >= 3 && i === 1 ? 'pm-hot' : 'pm-card') + txt(X0 + 8, 86 + i * 62, n, 'pm-big') + txt(X0 + 32, 86 + i * 62, t))).join('')
        + op(at(b, p, 2, 0.6, 0.75), txt(X0 + 32, 236, tr('sponsor elke keer, +10 wk', 'sponsor at each, +10 wk'), 'pm-txt'));
    }
    if (b >= 3) {
      o.advice = op(span(p, 0.05, 0.3), card(270, 108, 'pm-hot') + txt(X0 + 8, 296, tr('advies: B,', 'advice: B,'), 'pm-on'))
        + op(span(p, 0.35, 0.6), txt(X0 + 8, 322, tr('tenzij ze zich echt', 'unless she truly'), 'pm-txt') + txt(X0 + 8, 348, tr('aan C verbindt;', 'commits to C;'), 'pm-txt'))
        + op(span(p, 0.65, 0.85), txt(X0 + 8, 372, tr('vastleggen, met ijkmoment', 'in writing, with a check-in'), 'pm-on'));
    }
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the room
  // the calendar strip: the week the scene is about ringed, and in the reset
  // scenes the status dot (green in the watermelon beat, amber in the example)
  function calendar(si, b) {
    let s = '';
    const ring = (wk, cls = 'pm-hot') => { const [a, b2, c, d] = C.CELLS[wk - 1]; return rect(a, b2, c - a, d - b2, cls, 1); };
    if (si === 1 && b === 5) s += ring(3) + ring(9, 'pm-dash');
    if (si === 2) s += ring(7);
    if (si === 6 && b >= 3) s += dot(C.HEAD[0], C.HEAD[1], 3.4, 'sc-g');
    if (si === 6 && b >= 4) s += ring(4);
    if (si === 7 && b >= 3) s += ring(20);
    if (si === 8) s += ring(14) + dot(C.HEAD[0], C.HEAD[1], 3.4, 'sc-a');
    return s;
  }
  // the sheet on the table: it fills in when a page is written (the one page
  // for the sponsor in s3, the honest page in s7, the new deal in s8)
  function sheet(si, b, p) {
    let n = 0;
    if (si === 2) n = b < 4 ? 0 : b === 4 ? span(p, 0.1, 0.9) * 6 : 8;
    if (si === 6) n = b < 3 ? 0 : b === 3 ? span(p, 0.1, 0.9) * 6 : 8;
    if (si === 7) n = b < 2 ? 0 : b === 2 ? span(p, 0.1, 0.9) * 8 : 8;
    if (si === 8) n = b < 3 ? 4 : 8;
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
    let mini = '';
    for (const c of C.CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.cMarks, calendar(si, b));
    set(E.dLines, sheet(si, b, p));
  }

  return { render };
})();
