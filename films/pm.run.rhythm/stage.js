// The stage of the film "Een overlegritme dat werkt / A meeting rhythm that
// works": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the calendar
// cells, the steering-group weeks, the weekly agenda), CAM (one camera move
// per scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step. The
// panel at the right gets one card per scene, each block in its own cue group
// (o[key] goes into data-k "p_<key>"); the board in the room repeats it in
// miniature, the calendar strip on the side wall carries the weeks and the
// sheet on the table fills as minutes and as the action list.
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
  const dia = (x, y, s = 9, cls = 'pm-dia') => path(`M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z`, cls);
  const tick = (x, y, cls = 'pm-line') => path(`M${f1(x - 7)} ${f1(y)}l5 5l10 -11`, cls);
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  const CUES = ['kick', 'qw', 'found', 'mix', 'floor', 'seen', 'promise', 'resist', 'start', 'pump', 'wrench', 'stoplog', 'trust',
    'rhythm', 'standup', 'weekly', 'steer', 'early', 'week', 'wagenda', 'steer5', 'labels', 'question', 'note', 'minutes', 'half', 'done',
    'drown', 'cancel', 'wrong', 'freq', 'cascade', 'escal', 'pace', 'agenda', 'actions', 'handover', 'case2', 'steps', 'data', 'fail', 'cost', 'ask'];

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
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // a page of the card that shows from beat k0 and gives way at beat k1
  const page = (b, p, k0, k1) => (b < k0 ? 0 : b === k0 && k0 > 0 ? span(p, 0.02, 0.2) : b < k1 || k1 < 0 ? 1 : b === k1 ? 1 - span(p, 0, 0.12) : 0);
  const DIA = tr('schema', 'diagram');
  const EX = tr('voorbeeld', 'example');

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: the kick-off; quick wins and foundations; the balance over four weeks
  function s1(b, p) {
    const o = { head: [tr('de eerste weken', 'the first weeks'), DIA] };
    o.kick = op(page(b, p, 0, 2), card(52, 118) + lines(78, [[tr('kick-off, zo’n 1 uur', 'kick-off, about 1 hour'), 'pm-big'], [tr('doel, scope, rollen,', 'goal, scope, roles,')], [tr('eerste stappen', 'first steps')], [tr('sponsor: waarom het telt', 'sponsor: why it matters'), 'pm-on']]));
    o.qw = op(at(b, p, 1, 0.05, 0.3), lines(214, [[tr('quick win', 'quick win'), 'pm-big'], [tr('klein, zichtbaar, van de', 'small, visible, from the')], [tr('mensen: gereedschap dat', 'people: a missing tool,')], [tr('ontbreekt, een printer', 'a printer that jams')], [tr('die elke dienst vastloopt', 'every shift')]]));
    o.found = op(at(b, p, 1, 0.35, 0.6), lines(352, [[tr('fundament', 'foundations'), 'pm-big'], [tr('nulmeting, rollen, ritme', 'baseline, roles, rhythm')]]));
    if (b >= 2) {
      let m = '';
      for (let i = 0; i < 4; i++) {
        const x = X0 + i * 72;
        const a = span(p, 0.12 + i * 0.1, 0.22 + i * 0.1);
        m += op(a, rect(x, 54, 64, 54, 'pm-card', 6) + txt(x + 32, 76, tr(`wk ${i + 1}`, `wk ${i + 1}`), 'pm-txt', 'middle') + (i % 2 ? dot(x + 24, 94, 5, 'pm-blk') + dot(x + 40, 94, 5, 'pm-blk') : dot(x + 32, 94, 5, 'pm-blk')));
      }
      m += op(span(p, 0.5, 0.7), lines(130, [[tr('alleen quick wins: show', 'only quick wins: a show')], [tr('alleen fundament:', 'only foundations:')], [tr('zes weken niks, afhaken', 'six weeks of nothing'), 'pm-on']]));
      o.mix = op(span(p, 0.08, 0.2), m);
    }
    return o;
  }

  // s2: the floor, what you see, promises, resistance, the starting number
  function s2(b, p) {
    const o = { head: [tr('eerst kijken', 'look first'), DIA] };
    const A = page(b, p, 0, 2);
    o.floor = op(A, lines(78, [[tr('eerste 2 weken: de vloer', 'first 2 weeks: the floor'), 'pm-big'], [tr('vraag vóór je voorstelt', 'ask before you suggest')], [tr('omstelling, meerijden', 'changeover, ride along')], [tr('niet: de vergaderzaal', 'not: the meeting room'), 'pm-mute']]));
    o.seen = op(A * at(b, p, 1), card(196, 150) + lines(224, [[tr('wat je ziet', 'what you see'), 'pm-big'], [tr('40 m voor gereedschap', '40 m for a tool')], [tr('3 belletjes, 1 antwoord', '3 calls, 1 answer')], [tr('noteer tijden, aantallen', 'note times and counts'), 'pm-on'], [tr('verslaat elk rapport', 'beats any report'), 'pm-mute']]));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      o.promise = op(B, lines(78, [[tr('toezeggingen', 'promises'), 'pm-big'], [tr('‘ik check het bij IT’', '‘I’ll check with IT’')], [tr('binnen een week terug', 'back within the week'), 'pm-on'], [tr('ook: nee, en waarom', 'even: no, and why')]]) + tick(X1 - 14, 98) + op(at(b, p, 2, 0.4, 0.6), tick(X1 - 14, 124)));
      o.resist = op(B * at(b, p, 3), card(168, 144) + lines(194, [[tr('‘in 2019 al geprobeerd’', '‘we tried it in 2019’'), 'pm-mute'], [tr('‘jij kent ons proces niet’', '‘you don’t know our process’'), 'pm-mute'], [tr('Klopt, ik ken het niet', 'Right, I don’t know it'), 'pm-on'], [tr('zoals jij. Wat ging er', 'the way you do. What'), 'pm-on'], [tr('in 2019 mis?', 'went wrong in 2019?'), 'pm-on']]));
      o.start = op(B * at(b, p, 4), card(320, 64, 'pm-hot') + lines(346, [[tr('week 4: weten we het', 'week 4: do we know the'), 'pm-on'], [tr('startgetal al?', 'starting number yet?'), 'pm-on']]));
    }
    return o;
  }

  // s3: week 1 at the pump assembly plant
  function s3(b, p) {
    const o = { head: [tr('week 1', 'week 1'), EX] };
    o.pump = card(52, 118) + lines(78, [[tr('pompenassemblage', 'pump assembly plant'), 'pm-big'], [tr('2 dagen lijn, 1 planning', '2 days line, 1 planning')], [tr('middagdienst: geen', 'second shift: no')], [tr('momentsleutel, 20 min', 'torque wrench, 20 min'), 'pm-on']]);
    o.wrench = op(at(b, p, 1), lines(200, [[tr('via de teamleider:', 'through the team lead:')], [tr('woensdag 2e sleutel', 'Wednesday a 2nd wrench')], [tr('400 euro', '400 euros'), 'pm-on']]) + tick(X1 - 14, 246));
    o.stoplog = op(at(b, p, 2), lines(290, [[tr('stoplog 2 wk: nulmeting', 'stop log 2 wk: baseline')], [tr('di 9:00 wekelijkse check', 'Tue 9:00 weekly check')]]));
    o.trust = op(at(b, p, 3), card(338, 44, 'pm-hot') + txt(X0, 367, tr('wk 3: ze komen zelf', 'wk 3: they come to you'), 'pm-on'));
    return o;
  }

  // s4: the rhythm, then the three meetings
  function s4(b, p) {
    const o = { head: [tr('drie overleggen', 'three meetings'), DIA] };
    const A = page(b, p, 0, 1);
    o.rhythm = op(A, lines(78, [[tr('vaste dag, tijd, agenda', 'fixed day, time, agenda'), 'pm-big'], ['']])
      + [tr('voortgang op het doel', 'progress against goal'), tr('wat zit vast', 'what is blocked'), tr('welke besluiten nodig', 'which decisions needed')].map((t, i) => op(span(p, 0.2 + i * 0.15, 0.35 + i * 0.15), rect(X0 - 4, 110 + i * 50, CW + 8, 40, 'pm-card', 6) + txt(X0 + 8, 137 + i * 50, `${i + 1}  ${t}`))).join(''));
    if (b >= 1) {
      const B = page(b, p, 1, -1);
      const head = (y, name, val) => txt(X0, y, name, 'pm-big') + txt(X1, y, val, 'pm-on', 'end');
      o.standup = op(B, card(52, 118) + head(78, 'stand-up', '15 min') + lines(104, [[tr('staand, 2 à 3× per week', 'standing, 2–3× a week')], [tr('af · volgende · blokkade', 'done · next · blocked')], [tr('uit agile: Scrum, korte cycli', 'agile: Scrum, short cycles'), 'pm-mute']]));
      o.weekly = op(B * at(b, p, 2), card(178, 66) + head(204, tr('weekoverleg', 'weekly'), '45–60 min') + txt(X0, 230, tr('of 30 min met de eigenaar', 'or 30 min with the owner')));
      o.steer = op(B * at(b, p, 3), card(252, 92) + head(278, tr('stuurgroep', 'steering group'), '60–90 min') + lines(304, [[tr('4–6 weken of maandelijks', '4–6 weeks or monthly')], [tr('sponsor, afdelingshoofden', 'sponsor, department heads')]]));
      o.early = op(at(b, p, 4), txt(X0, 376, tr('week 3, niet maand 4', 'week 3, not month 4'), 'pm-on'));
    }
    return o;
  }

  // s5: the beverage plant's week: a grid Monday to Friday, 08 to 15 h
  const GX = X0 + 40;
  const DW = (X1 - GX) / 5;
  const GY = 74;
  const HH = 19;
  const yAt = (h) => GY + (h - 8) * HH;
  function s5(b, p) {
    const o = { head: [tr('frisdrankfabriek', 'beverage plant'), EX] };
    const days = NL ? ['ma', 'di', 'wo', 'do', 'vr'] : ['Mo', 'Tu', 'We', 'Th', 'Fr'];
    let grid = '';
    days.forEach((d, i) => { grid += txt(GX + DW * (i + 0.5), GY - 8, d, 'pm-mute', 'middle'); });
    let gl = `M${GX} ${GY}H${X1}`;
    for (let h = 9; h <= 15; h++) gl += `M${GX} ${f1(yAt(h))}H${X1}`;
    for (let i = 0; i <= 5; i++) gl += `M${f1(GX + DW * i)} ${GY}V${f1(yAt(15))}`;
    grid += path(gl, 'pm-grid') + txt(GX - 8, yAt(8) + 16, '08', 'pm-mute', 'end') + txt(GX - 8, yAt(13) + 16, '13', 'pm-mute', 'end');
    // stand-ups Monday and Thursday 08:30, 15 minutes (drawn at least 8 high)
    const su = [0, 3].map((d, i) => op(span(b === 0 ? p : 1, 0.35 + i * 0.15, 0.45 + i * 0.15), rect(GX + DW * d + 3, yAt(8.5), DW - 6, 8, 'pm-blk', 2))).join('');
    o.week = grid + su;
    const wk = op(at(b, p, 1, 0.02, 0.2), rect(GX + DW + 3, yAt(13), DW - 6, HH * 0.75, b === 1 ? 'pm-blk' : 'pm-blk2', 2));
    if (b === 0) o.week += op(span(p, 0.4, 0.6), lines(252, [[tr('stand-up ma, do 08:30', 'stand-up Mon, Thu 08:30'), 'pm-on'], [tr('bij het bord op de vloer', 'at the board on the floor')], [tr('15 min, 5 mensen', '15 min, 5 people')]]));
    // the rows come in early, so the card-only ones (the one-page plan, the
    // supplier) stay up at least 4 s of the beat
    if (b === 1) {
      const rows = [[C.WEEKLY.actions, tr('acties', 'actions')], [C.WEEKLY.progress, tr('voortgang op één A4', 'progress, one-page plan')], [C.WEEKLY.decisions, tr('2 besluiten: welke lijn,', '2 decisions: which line,')], [0, tr('de leverancier erbij?', 'bring in the supplier?')], [C.WEEKLY.next, tr('volgende week', 'next week')]];
      o.wagenda = wk + txt(X0, 252, tr('di 13:00, 45 min', 'Tue 13:00, 45 min'), 'pm-big')
        + rows.map(([m, t], i) => op(span(p, 0.1 + i * 0.07, 0.2 + i * 0.07), (m ? txt(X0 + 24, 278 + i * 26, String(m), 'pm-on', 'end') : '') + txt(X0 + 36, 278 + i * 26, t))).join('');
    } else o.wagenda = wk;
    if (b >= 2) o.steer5 = op(span(p, 0.05, 0.3), card(232, 96) + lines(260, [[tr('stuurgroep', 'steering group'), 'pm-big'], [tr('elke 5 weken, 60 min', 'every 5 weeks, 60 min')], [tr('3 besluitpunten', '3 decision items'), 'pm-on']]));
    return o;
  }

  // s6: labels, a decision item as a question, the decision note; then the minutes
  function s6(b, p) {
    const o = { head: [tr('agenda en notulen', 'agenda and minutes'), b === 4 ? EX : DIA] };
    const A = page(b, p, 0, 3);
    const tags = [tr('besluiten', 'to decide'), tr('bespreken', 'to discuss'), tr('informeren', 'to inform')];
    o.labels = op(A, tags.map((t, i) => op(span(b === 0 ? p : 1, 0.1 + i * 0.15, 0.25 + i * 0.15), rect(X0, 56 + i * 34, 132, 28, i === 0 ? 'pm-hot' : 'pm-card', 14) + txt(X0 + 66, 77 + i * 34, t, i === 0 ? 'pm-on' : 'pm-txt', 'middle'))).join('')
      + op(at(b, p, 2, 0.6, 0.8), txt(X1, 145, tr('schriftelijk', 'in writing'), 'pm-on', 'end') + path(`M${X0 + 140} 140H${X1 - 116}`, 'pm-line')));
    o.question = op(A * at(b, p, 1), card(166, 92) + lines(192, [[tr('‘Breiden we de pilot vanaf', '‘Do we extend the pilot to')], [tr('week 12 uit naar regio', 'region North from')], [tr('Noord?’', 'week 12?’')]]));
    o.note = op(A * at(b, p, 2), lines(290, [[tr('besluitnotitie, één A4', 'decision note, one page'), 'pm-big'], [tr('vraag, opties, advies,', 'question, options, advice,')], [tr('uiterste datum', 'deadline')], [tr('2 dagen vooraf; hier: vr', '2 days ahead; here: Fri'), 'pm-on']]));
    if (b >= 3) {
      const B = page(b, p, 3, -1);
      o.minutes = op(B, lines(78, [[tr('notulen', 'minutes'), 'pm-big'], [tr('alleen besluiten, acties', 'only decisions, actions')], [tr('wie, wat, wanneer', 'who, what, by when')]]) + txt(X1, 78, tr('zelfde dag', 'same day'), 'pm-on', 'end'));
      // half a page: three decisions, four actions, sent at 16:00
      let h = rect(X0, 166, 124, 132, 'pm-card', 3);
      for (let i = 0; i < 7; i++) {
        const a = b > 4 ? 1 : b === 4 ? span(p, 0.1 + i * 0.07, 0.17 + i * 0.07) : 0;
        h += op(a, i < 3 ? path(`M${X0 + 12} ${180 + i * 15}H${X0 + 108 - (i % 2) * 18}`, 'pm-line') : rect(X0 + 12, 222 + (i - 3) * 17, 8, 8, 'pm-ring', 1) + path(`M${X0 + 28} ${226 + (i - 3) * 17}H${X0 + 100 - (i % 3) * 12}`, 'pm-line'));
      }
      h += op(at(b, p, 4, 0.3, 0.5), lines(186, [[tr('half A4', 'half a page'), 'pm-big'], [tr('3 besluiten', '3 decisions')], [tr('4 acties', '4 actions')], [tr('om 16:00', 'sent 16:00'), 'pm-on']], X0 + 140));
      o.half = op(B * at(b, p, 4, 0.02, 0.15), h);
      o.done = op(B * at(b, p, 5), card(316, 66, 'pm-hot') + lines(342, [[tr('Welke acties van vorige', 'Which of last week’s'), 'pm-on'], [tr('week zijn af?', 'actions are done?'), 'pm-on']]));
    }
    return o;
  }

  // s7: what meetings cost; a sponsor who cancels; what goes wrong; how often
  function s7(b, p) {
    const o = { head: [tr('de mensenkant', 'the people side'), DIA] };
    const A = page(b, p, 0, 2);
    o.drown = op(A, lines(78, [[tr('elk overleg kost uren', 'each meeting costs hours'), 'pm-big'], [tr('kort, op tijd beginnen', 'short, start on time')], [tr('eerder stoppen als het kan', 'end early when you can')], [tr('niks te besluiten: afzeggen', 'nothing to decide: cancel'), 'pm-on']]));
    o.cancel = op(A * at(b, p, 1), card(186, 120) + lines(212, [[tr('sponsor zegt steeds af:', 'sponsor keeps cancelling:')], [tr('een signaal, geen pech', 'a signal, not bad luck'), 'pm-on'], [tr('‘Een andere manier', '‘Another way for you')], [tr('waarop jij beslist?’', 'to decide?’')]]));
    if (b >= 2) {
      const B = page(b, p, 2, -1);
      let w = '';
      for (let i = 0; i < 12; i++) w += op(span(b === 2 ? p : 1, 0.05 + i * 0.03, 0.1 + i * 0.03), dot(X0 + 10 + i * 24, 66, 8, i < 2 ? 'pm-blk' : 'pm-dot'));
      w += lines(104, [[tr('12 die alleen luisteren', '12 who only listen')], [tr('stuurgroep: diashow,', 'steering group: slides,')], [tr('niks besloten', 'nothing decided'), 'pm-on']]);
      o.wrong = op(B, w);
      o.freq = op(B * at(b, p, 3), card(196, 186) + lines(222, [[tr('hoe vaak?', 'how often?'), 'pm-big'], [tr('agile, voltijds: dagelijks', 'agile, full-time: daily')], [tr('klant, deeltijds: 2× p/w', 'client, part-time: 2× a wk')], [tr('over 15 min? geen', 'past 15 min? never a')], [tr('blokkade? andere vorm', 'blocker? change format'), 'pm-on'], [tr('experts verschillen', 'experts disagree'), 'pm-mute']]));
    }
    return o;
  }

  // s8: the cascade, escalation, the pace of a number, the fixed agenda, the action list
  function s8(b, p) {
    const o = { head: [tr('overlegstructuur', 'review cascade'), DIA] };
    const A = page(b, p, 0, 2);
    const tiers = [[tr('management', 'management'), tr('maand', 'monthly')], [tr('afdeling', 'department'), tr('1–2 weken', '1–2 weeks')], [tr('team, 15 min', 'team, 15 min'), tr('dag/week', 'day/week')]];
    o.cascade = op(A, tiers.map(([n, f], i) => op(span(b === 0 ? p : 1, 0.1 + (2 - i) * 0.12, 0.22 + (2 - i) * 0.12), rect(X0 - 4 + (2 - i) * 0 + i * 0, 54 + i * 50, CW - 36, 42, 'pm-card', 6) + txt(X0 + 6, 82 + i * 50, n, 'pm-big') + txt(X1 - 46, 82 + i * 50, f, 'pm-txt', 'end'))).join('')
      + op(span(b === 0 ? p : 1, 0.5, 0.7), txt(X0, 228, tr('zelfde definities', 'same definitions'), 'pm-mute')));
    if (b >= 1) {
      const e = path(`M${X1 - 14} 186V136M${X1 - 20} 144l6 -8l6 8`, 'pm-line') + path(`M${X1 - 2} 136V184`, 'pm-dash') + path(`M${X1 - 8} 178l6 8l6 -8`, 'pm-line');
      o.escal = op(A * at(b, p, 1), e + lines(262, [[tr('een niveau omhoog,', 'one level up,')], [tr('besluit terug op datum', 'decision back by a date'), 'pm-on'], [tr('dagelijkse ladder: Landen', 'daily ladder: see Land'), 'pm-mute']]));
    }
    if (b >= 2) {
      const B = page(b, p, 2, 4);
      o.pace = op(B, lines(78, [[tr('dagelijks: storingen,', 'daily: breakdowns,')], [tr('gestarte klussen', 'jobs started')], [tr('maandelijks: kosten per', 'monthly: cost per')], [tr('aansluiting, tevredenheid', 'connection, satisfaction')], [tr('traag cijfer elke dag: ruis', 'slow number daily: noise'), 'pm-mute'], [tr('zo vaak als het verandert', 'as often as it changes'), 'pm-on']]));
      const steps = [tr('acties vorige keer', 'last time’s actions'), tr('cijfers tegen het doel', 'numbers vs target'), tr('1–2 problemen diep', '1–2 problems in depth'), tr('nieuwe acties', 'new actions')];
      const ag = card(240, 142) + txt(X0, 264, tr('vaste agenda', 'fixed agenda'), 'pm-big') + txt(X1, 264, tr('zelfde tijd', 'same time'), 'pm-mute', 'end')
        + steps.map((t, i) => op(at(b, p, 3, 0.1 + i * 0.12, 0.2 + i * 0.12), txt(X0, 290 + i * 26, `${i + 1} ${t}`))).join('');
      o.agenda = op(at(b, p, 3, 0.02, 0.15), ag);
    }
    if (b >= 4) {
      let al = lines(78, [[tr('actielijst', 'action list'), 'pm-big']]) + txt(X1, 78, tr('zichtbaar', 'visible'), 'pm-on', 'end');
      const cols = [tr('wie', 'who'), tr('wat', 'what'), tr('wanneer', 'when')];
      cols.forEach((c, i) => { al += txt(X0 + [0, 70, 180][i], 108, c, 'pm-mute'); });
      for (let i = 0; i < 3; i++) al += op(span(p, 0.15 + i * 0.1, 0.25 + i * 0.1), dot(X0 + 12, 128 + i * 24, 6, 'pm-dot') + path(`M${X0 + 70} ${128 + i * 24}H${X0 + 160 - i * 14}M${X0 + 180} ${128 + i * 24}H${X0 + 228}`, 'pm-line'));
      al += op(span(p, 0.5, 0.7), txt(X0, 220, tr('niemand kijkt: ritme dood', 'nobody looks: rhythm dies'), 'pm-on'));
      o.actions = op(span(p, 0.05, 0.2), al);
    }
    return o;
  }

  // s9: the handover in steps; the parts manufacturer; the signs; the question
  function s9(b, p) {
    const o = { head: [tr('overdracht', 'handover'), b === 0 ? DIA : EX] };
    const A = page(b, p, 0, 2);
    o.handover = op(A, lines(78, [[tr('ontwerp voor je vertrek', 'design for your exit'), 'pm-big'], [tr('de lijn zit voor,', 'the line chairs,')], [tr('jij coacht, stapt terug', 'you coach, step back'), 'pm-on']]));
    o.case2 = op(A * at(b, p, 1), card(166, 170) + lines(192, [[tr('onderdelenfabrikant', 'parts manufacturer'), 'pm-big'], [tr('8 wk jij voorzitter', '8 wk you chair the')], [tr('van het KPI-overleg', 'weekly KPI review')], [tr('ma: jij werkt het bestand bij', 'Mon: you update the sheet')], [tr('productie: vindt het goed', 'production mgr: likes it')], [tr('nog 4 weken', '4 weeks to go'), 'pm-on']]));
    if (b >= 2) {
      const B = page(b, p, 2, 4);
      let s = '';
      const who = [[1, 1], [0, 1], [0, 0], [0, 0]];
      for (let i = 0; i < 4; i++) {
        const x = X0 + i * 72;
        s += op(at(b, p, 2, 0.08 + i * 0.12, 0.18 + i * 0.12), rect(x, 54, 64, 54, 'pm-card', 6) + txt(x + 32, 76, tr(`wk ${i + 1}`, `wk ${i + 1}`), 'pm-mute', 'middle')
          + dot(x + 20, 94, 6, 'pm-blk2') + (who[i][0] ? dot(x + 44, 94, 6, 'pm-blk') : who[i][1] ? dot(x + 44, 94, 6, 'pm-ring') : ''));
      }
      s += lines(136, [[tr('1 hij voorzitter, jij naast', '1 he chairs, you beside')], [tr('2 jij alleen erbij', '2 you only attend')], [tr('3–4 weg, achteraf vragen', '3–4 away, ask afterwards'), 'pm-on']]);
      o.steps = op(B, s);
      o.data = op(B * at(b, p, 3), lines(228, [[tr('data: export of planner', 'data: export or planner')], [tr('getest terwijl je er bent', 'tested while you’re there')], [tr('1 pagina: wie, wanneer,', '1 page: who, when, which')], [tr('cijfers, hoe omhoog', 'numbers, how it goes up')], [tr('check sponsor: +4, +12 wk', 'sponsor check: +4, +12 wk'), 'pm-on'], [tr('vasthouden: zie Landen', 'sustaining: see Land'), 'pm-mute']]));
    }
    if (b >= 4) {
      const Cc = page(b, p, 4, -1);
      o.fail = op(Cc, lines(78, [[tr('signalen', 'warning signs'), 'pm-big'], [tr('‘één keertje’ vervallen', 'cancelled ‘just once’')], [tr('actie 6 weken doorgeschoven', 'action carried 6 weeks')], [tr('bord van één enthousiast', 'one enthusiast’s board')]]));
      o.cost = op(Cc * at(b, p, 4, 0.45, 0.65), card(184, 66) + lines(210, [[tr('15 min × 5 dagen × 8', '15 min × 5 days × 8')], [tr('= 10 manuren per week', '= 10 person-hours a week'), 'pm-on']]));
      o.ask = op(Cc * at(b, p, 5), card(276, 104, 'pm-hot') + lines(302, [[tr('‘Als ik volgende week', '‘If I don’t show up'), 'pm-on'], [tr('niet kom, gaat dit', 'next week, will this'), 'pm-on'], [tr('overleg dan door?’', 'meeting happen?’'), 'pm-on']]));
    }
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip (weeks 1 to 12, local u, v of the side wall)
  function calendar(si, b, p) {
    const cell = (wk) => C.CELLS[wk - 1];
    const mid = (wk) => { const [a, bb, c, d] = cell(wk); return [(a + c) / 2, (bb + d) / 2]; };
    const fill = (wk, cls, a = 1) => { const [x0, y0, x1, y1] = cell(wk); return op(a, rect(x0, y0, x1 - x0, y1 - y0, cls, 1)); };
    let s = '';
    if (si <= 2) {
      // s1: the kick-off in week 1, then one or two quick wins in weeks 1 to 4
      const [kx, ky] = mid(1);
      s += dia(kx, ky - 12, 3.6);
      const qw = si > 0 || b >= 2 ? (si > 0 || b > 2 ? 1 : span(p, 0.1, 0.6)) : 0;
      for (let wk = 1; wk <= 4; wk++) {
        const [x, y] = mid(wk);
        s += op(clamp(qw * 4 - (wk - 1), 0, 1), dot(x, y + 4, 2.2, 'pm-blk') + (wk % 2 ? '' : dot(x, y + 11, 2.2, 'pm-blk')));
      }
      // s2: the floor weeks 1 and 2; the week-4 check
      if (si === 1) {
        s += fill(1, 'pm-hot', b === 0 ? span(p, 0.1, 0.4) : 1) + fill(2, 'pm-hot', b === 0 ? span(p, 0.2, 0.5) : 1);
        if (b >= 4) { const [x, y] = mid(4); s += op(span(p, 0.1, 0.4), dot(x, y - 8, 5, 'pm-ring')); }
      }
      // s3: the stop log in weeks 1 and 2, a check every Tuesday, trust in week 3
      if (si === 2) {
        if (b >= 2) for (let wk = 1; wk <= 2; wk++) s += fill(wk, 'pm-hot', b > 2 ? 1 : span(p, 0.05 + (wk - 1) * 0.2, 0.25 + (wk - 1) * 0.2));
        if (b >= 2) for (let wk = 1; wk <= 4; wk++) { const [x, y] = mid(wk); s += op(b > 2 ? 1 : span(p, 0.4 + wk * 0.1, 0.5 + wk * 0.1), path(`M${f1(x - 4)} ${f1(y + 17)}h8`, 'pm-line')); }
        if (b >= 3) { const [x, y] = mid(3); s += op(span(p, 0.1, 0.4), tick(x + 1, y - 6)); }
      }
      return s;
    }
    // s4 to s8: the steering group every five weeks (weeks 5 and 10)
    const sa = si === 3 ? (b < 3 ? 0 : b === 3 ? span(p, 0.2, 0.6) : 1) : 1;
    if (si <= 7) {
      C.STEER_WEEKS.forEach((wk, i) => {
        const [x, y] = mid(wk);
        s += op(clamp(sa * 2 - i, 0, 1), dia(x, y - 6, 4.6));
        // s7: the sponsor cancels the next one
        if (si === 6 && b >= 1 && i === 1) s += op(span(p, 0.2, 0.5), path(`M${f1(x - 6)} ${f1(y - 12)}l12 12M${f1(x + 6)} ${f1(y - 12)}l-12 12`, 'pm-strike'));
      });
      if (si === 4 && b === 2) s += C.STEER_WEEKS.map((wk) => { const [x, y] = mid(wk); return dot(x, y - 6, 8, 'pm-ring'); }).join('');
      return s;
    }
    // s9: the last four weeks of the contract, handed over step by step
    for (let i = 0; i < 4; i++) {
      const wk = 9 + i;
      const a = b < 2 ? 0 : b === 2 ? span(p, 0.08 + i * 0.12, 0.18 + i * 0.12) : 1;
      s += fill(wk, i < 2 ? 'pm-hot' : 'pm-card', a);
      const [x, y] = mid(wk);
      s += op(a, dot(x, y - 6, 2.4, 'pm-blk2') + (i === 0 ? dot(x, y + 4, 2.4, 'pm-blk') : i === 1 ? dot(x, y + 4, 2.4, 'pm-ring') : ''));
    }
    return s;
  }
  // the sheet on the table: the minutes (s6: three decisions, four actions),
  // then the action list (s8)
  function sheet(si, b, p) {
    let n = 0;
    if (si === 5) n = b < 3 ? 0 : b === 3 ? span(p, 0.2, 0.6) * 2 : b === 4 ? 2 + span(p, 0.1, 0.8) * 5 : 7;
    if (si === 6) n = 7;
    if (si === 7) n = b < 4 ? 0 : span(p, 0.15, 0.6) * 5;
    let s = '';
    for (let i = 0; i < 7; i++) {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += `<path class="pm-line" d="M2.5 ${f1(4 + i * 3.4)}H${f1(2.5 + (15 - (i % 3) * 2) * a)}"/>`;
    }
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    let mini = '';
    for (const c of CUES) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.cMarks, calendar(si, b, p));
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
