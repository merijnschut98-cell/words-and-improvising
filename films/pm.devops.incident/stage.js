// The stage of the film "Incident, probleem, wijziging / Incident, problem,
// change": a pure function of (scene, u). Inlined into the page after the
// anatomy kit and a preamble from build.mjs that defines C (the panel's blocks,
// the board's drawing area, the lamps' outlines and keys, the example's
// minutes), CAM (one camera move per scene), W and H. Moves are placed per
// Dutch caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
//
// The room is the IT side of a plant: the MES rack and the backup unit at the
// back, the link on the floor to line 2 (a checkweigher and a label printer) at
// the front, the service desk at the left. Four lamps (rack, backup, scale,
// printer) idle green, run (accent), or fail (red); the link turns red and
// dashed while it is down. The whiteboard carries shapes only, each layer its
// own cue group: three icons for incident, problem and change (s1 to s5), the
// 52 weekly ticks (s3), the Lean pair (s5) and the example's week (s6). The
// panel at the right gets one card per scene, each block in its own cue group
// (o[key] goes into data-k "p_<key>"), all text at 22 units (a video film); a
// card that needs more room turns a page within its scene.
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
  const txt = (x, y, t, cls = 'pm-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="22" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  const CW = X1 - X0;
  const card = (y, h, cls = 'pm-card') => rect(X0 - 6, y, CW + 12, h, cls, 8);
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt') : '')).join('');
  // a card from y with a first line in bold (accent when hot) and more lines below
  const box = (y, head, rest, hot = false) => {
    const more = rest.map((t) => (Array.isArray(t) ? t : [t])).filter(([t]) => t);
    return card(y, 20 + 26 * (more.length + 1), hot ? 'pm-hot' : 'pm-card') + lines(y + 28, [[head, hot ? 'pm-on' : 'pm-big'], ...more], X0 + 4);
  };
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));
  // a page of the card that shows from beat k0 and gives way at beat k1 (-1: never)
  const page = (b, p, k0, k1) => (b < k0 ? 0 : b === k0 && k0 > 0 ? span(p, 0.02, 0.2) : b < k1 || k1 < 0 ? 1 : b === k1 ? 1 - span(p, 0, 0.12) : 0);
  const DIA = tr('schema', 'diagram');
  const EX = tr('voorbeeld', 'example');

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

  // ---------------------------------------------------------------- the cards
  // Each returns { head: [title, tag], <cue>: svg }.
  // s1: ITIL, its origin; three words
  function s1(b, p) {
    const o = { head: ['ITIL', DIA] };
    const A = page(b, p, 0, 2);
    o.itil = op(A, box(54, 'ITIL', [tr('bekendste verzameling', 'best-known good'), tr('goede praktijken voor', 'practice for IT'), tr('IT-servicemanagement', 'service management'),
      [tr('gebruikers kunnen', 'so users can work'), 'pm-mute'], [tr('betrouwbaar werken', 'reliably'), 'pm-mute']], b === 0));
    if (b >= 1) o.origin = op(A * at(b, p, 1), box(242, tr('eind jaren tachtig', 'the late 1980s'), [tr('Britse overheid', 'British government'), tr('ITIL 4: 2019', 'ITIL 4: 2019'), tr('nu van PeopleCert', 'now PeopleCert’s')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.three = op(B, box(54, tr('drie woorden', 'three words'), ['incident', tr('probleem', 'problem'), tr('wijziging', 'change')], true)
      + lines(212, [[tr('niet uit je hoofd,', 'not by heart,'), 'pm-mute'], [tr('wel scherp scheiden', 'but kept apart'), 'pm-mute']]));
    return o;
  }

  // s2: the incident and its goal; the service desk
  function s2(b, p) {
    const o = { head: ['incident', DIA] };
    const A = page(b, p, 0, 2);
    o.inc = op(A, box(54, 'incident', [tr('onverwachte', 'an unplanned'), tr('onderbreking, of', 'interruption, or'), tr('slechter dan het', 'worse than it'), tr('zou moeten', 'should'),
      [tr('MES reageert niet,', 'MES not responding,'), 'pm-mute'], [tr('printer print niet', 'printer not printing'), 'pm-mute']], b === 0));
    if (b >= 1) o.goal = op(A * at(b, p, 1), box(268, tr('doel', 'goal'), [tr('snel weer werken', 'working again fast'), [tr('oorzaak nog onbekend', 'cause still unknown'), 'pm-mute']], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.sdesk = op(B, box(54, tr('servicedesk', 'service desk'), [tr('centraal meldpunt', 'the central point'), tr('storingen en vragen', 'outages, questions'),
      [tr('telefoon, mail,', 'phone, email,'), 'pm-mute'], [tr('portaal', 'portal'), 'pm-mute']], true));
    return o;
  }

  // s3: the problem and its goal; the weekly printer
  function s3(b, p) {
    const o = { head: [tr('probleem', 'problem'), DIA] };
    const A = page(b, p, 0, 2);
    o.prob = op(A, box(54, tr('probleem', 'problem'), [tr('de oorzaak, of', 'the cause, or'), tr('mogelijke oorzaak,', 'potential cause,'), tr('van een of meer', 'of one or more'), tr('incidenten', 'incidents')], b === 0));
    if (b >= 1) o.pgoal = op(A * at(b, p, 1), box(216, tr('doel', 'goal'), [tr('begrijpen waarom,', 'understand why,'), tr('zodat het niet', 'so it does not'), tr('terugkomt', 'come back')], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) {
      o.p52 = op(B, box(54, tr('printer', 'the printer'), [tr('1 storing per week:', '1 failure a week:'), ['1 × 52 = 52', 'pm-big'], tr('incidenten per jaar', 'incidents a year')], false)
        + op(at(b, p, 2, 0.4, 0.6), card(194, 98, 'pm-hot') + lines(222, [[tr('misschien 1 probleem', 'maybe 1 problem'), 'pm-on'], [tr('stroom zakt in bij', 'power dips as the'), ''], [tr('start van de pers', 'press starts'), '']], X0 + 4))
        + op(at(b, p, 2, 0.7, 0.9), lines(326, NL ? [['probleembeheer', 'pm-big'], ['problem management', 'pm-mute']] : [['problem management', 'pm-big'], ['looks for the cause', 'pm-mute']])));
    }
    return o;
  }

  // s4: the change; what changed recently; change enablement
  function s4(b, p) {
    const o = { head: [tr('wijziging', 'change'), DIA] };
    const A = page(b, p, 0, 2);
    o.chg = op(A, box(54, tr('wijziging', 'change'), [tr('toevoegen, aanpassen', 'adding, modifying'), tr('of weghalen van iets', 'or removing anything'), tr('dat een dienst raakt', 'affecting a service'),
      [tr('MES-versie, driver,', 'MES version, driver,'), 'pm-mute'], [tr('firewall-regel', 'firewall rule'), 'pm-mute']], b === 0));
    if (b >= 1) o.recent = op(A * at(b, p, 1), lines(262, [[tr('veel incidenten komen', 'many incidents come'), ''], [tr('door een wijziging', 'from a change'), ''], [tr('vraag: wat is er', 'ask: what changed'), 'pm-on'], [tr('recent veranderd?', 'recently?'), 'pm-on']]));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.enable = op(B, box(54, 'ITIL 4', ['change enablement', [tr('eerst: change control', 'first: change control'), 'pm-mute'], [tr('wijzigingen mogelijk', 'making changes'), 'pm-on'], [tr('maken, niet tegen-', 'possible, not'), 'pm-on'], [tr('houden', 'stopping them'), 'pm-on']], true));
    return o;
  }

  // s5: the Lean view; what you often see; the sharp question
  function s5(b, p) {
    const o = { head: [tr('Lean-blik', 'Lean view'), DIA] };
    const A = page(b, p, 0, 2);
    o.lean1 = op(A, box(54, 'incident', [tr('lijkt op: storing op', 'is like: fixing a'), tr('de lijn snel verhelpen', 'breakdown quickly')], b === 0));
    if (b >= 1) o.lean2 = op(A * at(b, p, 1), box(164, tr('probleembeheer', 'problem management'), [tr('lijkt op: oorzaak-', 'is like: root-cause'), tr('analyse', 'analysis'), [tr('weer werken, versus', 'working again, versus'), 'pm-on'], [tr('nooit meer', 'never again'), 'pm-on']], b === 1));
    const B = page(b, p, 2, -1);
    if (b >= 2) o.often = op(B, box(54, tr('vaak gezien', 'often seen'), [tr('servicedesk: goed in', 'service desk: good at'), tr('incidenten', 'incidents'), [tr('problemen: geen tijd', 'problems: no time'), 'pm-badt']], b === 2));
    if (b >= 3) o.ask = op(at(b, p, 3), lines(216, [[tr('vraag:', 'ask:'), 'pm-mute'], [tr('welke vijf storingen', 'which five outages'), ''], [tr('kwamen vorige maand', 'came back most often'), ''], [tr('het vaakst terug?', 'last month?'), ''], [tr('en wie zoekt', 'and who looks for'), 'pm-on'], [tr('de oorzaak?', 'the cause?'), 'pm-on']]));
    return o;
  }

  // s6: the cooked-meats plant's week
  function s6(b, p) {
    const o = { head: [tr('weegschaal', 'the scale'), EX] };
    const A = page(b, p, 0, 4);
    const row = (y, t, what, cls) => txt(X0, y, t, 'pm-big') + txt(X0 + 124, y, what, cls);
    o.meat = op(A, lines(80, [[tr('vleeswarenfabriek', 'cooked-meats plant'), b === 0 ? 'pm-on' : 'pm-big'], [tr('meldingen indelen', 'sorting the reports'), 'pm-mute']]));
    if (b >= 1) o.e1 = op(A * at(b, p, 1), row(146, tr('ma 06:10', 'Mon 06:10'), 'incident', 'pm-badt') + txt(X0, 172, tr('lijn 2: geen gewichten', 'line 2: no weights'), 'pm-mute'));
    if (b >= 2) o.e2 = op(A * at(b, p, 2), row(212, '06:25', tr('werkt weer', 'works again'), b === 2 ? 'pm-on' : 'pm-txt') + txt(X0, 238, tr('koppeling herstart', 'link restarted'), 'pm-mute'));
    if (b >= 3) o.e3 = op(A * at(b, p, 3), row(278, tr('di 06:05', 'Tue 06:05'), 'incident', 'pm-badt') + op(at(b, p, 3, 0.4, 0.6), row(304, tr('wo 06:12', 'Wed 06:12'), 'incident', 'pm-badt')));
    const B = page(b, p, 4, -1);
    if (b >= 4) o.e4 = op(B, box(54, tr('wo middag: patroon', 'Wednesday: pattern'), [tr('3 incidenten, steeds', '3 incidents, always'), tr('rond zes uur', 'around six'), [tr('= 1 probleem', '= 1 problem'), 'pm-on'], [tr('uitval bij ploegstart', 'fails at shift start'), 'pm-mute']], b === 4));
    if (b >= 5) o.e5 = op(at(b, p, 5), box(216, tr('do: de oorzaak', 'Thu: the cause'), [tr('back-up om 06:00', 'backup at 06:00'), tr('blokkeert koppeling', 'blocks the link'), [tr('naar 04:00: wijziging', 'to 04:00: a change'), 'pm-on'], [tr('besproken, gepland', 'discussed, planned'), 'pm-mute']], true));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6];

  // ---------------------------------------------------------------- the room
  // Lamp states: 0 idle, 1 running (accent), 2 working (green), 3 down (red);
  // in the order of C.LAMPK: rack (MES), backup, scale, printer.
  const LAMP = ['pm-lamp', 'pm-run', 'pm-ok', 'pm-bad'];
  function room(si, b, p) {
    const s = { lamps: [2, 2, 2, 2], linkBad: false };
    const L = s.lamps;
    if (si === 1) {
      if (b === 0) { if (p > 0.2) L[0] = 3; if (p > 0.4) L[3] = 3; } else if (b === 1 && p < 0.5) { L[0] = 3; L[3] = 3; }
    } else if (si === 2) {
      if (b === 2) { const q = span(p, 0.05, 0.6) * 4; if (q < 4 && q % 1 < 0.4) L[3] = 3; }
    } else if (si === 3) {
      if (b === 0 && p > 0.3) L[0] = 1;
      else if (b === 1 && p > 0.2 && p < 0.8) L[0] = 3;
    } else if (si === 4) {
      if (b === 0 && p > 0.15 && p < 0.6) { L[2] = 3; L[3] = 3; }
    } else if (si === 5) {
      if (b === 1 && p > 0.15) { L[2] = 3; s.linkBad = true; } else if (b === 2 && p < 0.4) { L[2] = 3; s.linkBad = true; } else if (b === 3) {
        const q = span(p, 0.05, 0.9) * 2;
        if (q < 2 && q % 1 < 0.4) { L[2] = 3; s.linkBad = true; }
      } else if (b === 5 && p > 0.1 && p < 0.55) { L[1] = 1; L[2] = 3; s.linkBad = true; }
    }
    return s;
  }

  // ---------------------------------------------------------------- the board
  // Face units (u to the right, v down); A: C.AREA.
  const A = C.AREA;
  const CELL = 40;
  const GAP = (A.u1 - A.u0 - 8 - 3 * CELL) / 2;
  const cellU = (i) => A.u0 + 4 + i * (CELL + GAP);
  const TOP = A.v0 + 2;
  const icon = (i, hot) => {
    const u = cellU(i);
    const cx = u + CELL / 2;
    let s = rect(u, TOP, CELL, 34, 'pm-note', 1.5);
    if (i === 0) s += path(`M${f1(cx + 3)} ${f1(TOP + 5)}l-8 13h7l-5 12l11 -15h-7l5 -10Z`, hot ? 'pm-red' : 'pm-blk');
    else if (i === 1) s += circ(cx, TOP + 12, 6, 'pm-loop') + path(`M${f1(cx)} ${f1(TOP + 18)}v10m0 -5l-6 5m6 -5l6 5`, 'pm-loop');
    else s += path(`M${f1(cx - 9)} ${f1(TOP + 15)}a9 8 0 0 1 17 -3m0 0l1 -5m-1 5l-5 -1M${f1(cx + 9)} ${f1(TOP + 20)}a9 8 0 0 1 -17 3m0 0l-1 5m1 -5l5 1`, 'pm-loop');
    return s;
  };
  const vOf = (h) => A.v0 + 6 + ((h - 2) / 6) * (A.v1 - A.v0 - 12);
  const dayU = (i) => A.u0 + 16 + i * 36;
  function board(si, b, p) {
    const L = { bInc: '', bProb: '', bChg: '', bTally: '', bLean: '', bWeek: '' };
    // s1 to s5: the three icons, the one the scene explains at full strength
    if (si <= 4) {
      const full = [[0.4, 0.4, 0.4], [1, 0.4, 0.4], [0.6, 1, 0.4], [0.6, 0.6, 1], [0.8, 0.8, 0.4]][si];
      if (si === 0) for (let i = 0; i < 3; i++) full[i] = b < 2 ? 0.4 : lerp(0.4, 1, at(b, p, 2, 0.05 + i * 0.15, 0.25 + i * 0.15));
      ['bInc', 'bProb', 'bChg'].forEach((k, i) => { L[k] = op(full[i], icon(i, si === 1 && i === 0 && b === 0 && p > 0.2)); });
    }
    // s3 b3: 52 ticks, one a week, then one ring round them and a line to the problem
    if (si === 2 && b === 2) {
      const n = Math.round(52 * span(p, 0.05, 0.55));
      let s = '';
      for (let i = 0; i < n; i++) s += rect(A.u0 + 8 + (i % 13) * 10.2, TOP + 42 + Math.floor(i / 13) * 9, 2, 6, 'pm-red', 0.4);
      const ring = span(p, 0.6, 0.8);
      s += op(ring, rect(A.u0 + 3, TOP + 38, 13 * 10.2 + 6, 4 * 9 + 6, 'pm-loop', 5) + path(`M${f1(cellU(1) + CELL / 2)} ${f1(TOP + 38)}V${f1(TOP + 34)}`, 'pm-loop'));
      L.bTally = s;
    }
    // s5: a short loop under the incident (fixed, working again) and a root under the problem (never again)
    if (si === 4) {
      const cx0 = cellU(0) + CELL / 2;
      const cx1 = cellU(1) + CELL / 2;
      const y = TOP + 54;
      let s = op(at(b, p, 0, 0.1, 0.4), path(`M${f1(cx0 + 9)} ${f1(y)}a9 9 0 1 1 -3 -6.7m3 6.7l1 -6m-1 6l-6 -1`, 'pm-loop'));
      s += op(at(b, p, 1, 0.1, 0.4), path(`M${f1(cx1)} ${f1(TOP + 36)}V${f1(A.v1 - 4)}m0 -16l-9 10m9 -10l9 10m-9 -2l-5 8m5 -8l5 8`, 'pm-loop') + circ(cx1, A.v1 - 4, 2.4, 'pm-blk'));
      L.bLean = s;
    }
    // s6: the week, Monday to Thursday, 02:00 at the top to 08:00 at the bottom;
    // the three reports, the fix, the ring of one problem, the backup moved
    if (si === 5) {
      let s = '';
      for (let i = 0; i < 4; i++) s += path(`M${f1(dayU(i))} ${f1(vOf(2))}V${f1(vOf(8))}`, 'pm-bdash') + path(`M${f1(dayU(i) - 4)} ${f1(vOf(6))}h8`, 'pm-loop');
      const T = C.T;
      const dot = (i, min, a) => op(a, circ(dayU(i), vOf(min / 60), 3, 'pm-red'));
      s += dot(0, T.mon, at(b, p, 1, 0.15, 0.35));
      s += op(at(b, p, 2, 0.3, 0.5), circ(dayU(0) + 7, vOf(T.fixed / 60), 2.2, 'pm-ok'));
      s += dot(1, T.tue, at(b, p, 3, 0.1, 0.3)) + dot(2, T.wed, at(b, p, 3, 0.45, 0.65));
      s += op(at(b, p, 4, 0.15, 0.45), rect(dayU(0) - 7, vOf(T.tue / 60) - 7, dayU(2) - dayU(0) + 14, vOf(T.wed / 60) - vOf(T.tue / 60) + 14, 'pm-loop', 6));
      if (b >= 5) {
        const m = span(p, 0.55, 0.85);
        const h = lerp(T.backup, T.moved, m) / 60;
        s += path(`M${f1(dayU(0) - 10)} ${f1(vOf(6))}H${f1(dayU(3) + 10)}`, 'pm-bdash');
        s += op(span(p, 0.5, 0.6), path(`M${f1(dayU(3) + 10)} ${f1(vOf(6))}V${f1(vOf(4) + 2)}m-3 4l3 -4l3 4`, 'pm-loop'));
        s += op(span(p, 0.05, 0.25), rect(dayU(3) - 7, vOf(h) - 4, 14, 8, 'pm-note2', 1.2));
      }
      L.bWeek = s;
    }
    return L;
  }
  const LAYERS = ['bInc', 'bProb', 'bChg', 'bTally', 'bLean', 'bWeek'];

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = CARDS[si](b, p);
    set(E.pHead, txt(X0, 38, o.head[0], 'pm-big') + txt(X1, 38, o.head[1], 'pm-mute', 'end'));
    for (const c of C.CUES) set(E[`p_${c}`], o[c] || '');
    const L = board(si, b, p);
    for (const k of LAYERS) set(E[k], L[k] || '');
    const s = room(si, b, p);
    s.lamps.forEach((st, i) => set(E[C.LAMPK[i]], `<path class="${LAMP[st]}" d="${C.LAMPS[i]}"/>`));
    if (s.linkBad) E.linkp.setAttribute('data-bad', '1'); else E.linkp.removeAttribute('data-bad');
  }

  return { render };
})();
