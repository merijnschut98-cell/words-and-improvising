// The stage of the film "Waterval of rondes / Waterfall or rounds": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C (the example's weeks and the calendar
// cells), CAM (one camera move per scene), W and H. Moves are placed per Dutch
// caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step. The panel at the right gets one
// card per scene, each block in its own cue group; the board in the room
// repeats it in miniature, the calendar strip carries the example's milestones
// and rounds, and the checklist on the table fills in round by round.
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
  // a round: an arc over the axis from x0 to x1 with an arrowhead at its end
  const arc = (x0, x1, y, cls = 'pm-line') => {
    const r = (x1 - x0) / 2;
    return path(`M${f1(x0 + 2)} ${f1(y)}A${f1(r - 2)} ${f1(r - 2)} 0 0 1 ${f1(x1 - 2)} ${f1(y)}l-5 -6M${f1(x1 - 2)} ${f1(y)}l5 -5`, cls);
  };
  const X0 = 334;
  const X1 = 618;
  const CUES = ['phases', 'signoff', 'scope', 'fits', 'royce', 'loop', 'react', 'manifesto', 'fitsA', 'scrum', 'sprint', 'review', 'retro', 'core',
    'hybrid', 'miles', 'rounds', 'pilot', 'doubt', 'case', 'both', 'plan', 'round1', 'out', 'round2', 'jobs', 'jargon', 'quote', 'milesplan', 'ask'];

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
    const o = { head: [tr('waterval', 'waterfall'), tr('schema', 'diagram')] };
    const names = [tr('analyseren', 'analyse'), tr('ontwerpen', 'design'), tr('bouwen', 'build'), tr('invoeren', 'implement')];
    let ph = '';
    let so = '';
    names.forEach((n, i) => {
      const x = X0 + i * 46;
      const y = 58 + i * 50;
      const a = at(b, p, 0, 0.1 + i * 0.18, 0.25 + i * 0.18);
      ph += op(a, rect(x, y, 122, 38, 'pm-card', 6) + txt(x + 8, y + 26, n) + (i < 3 ? path(`M${x + 92} ${y + 39}V${y + 49}M${x + 87} ${y + 44}l5 5l5 -5`, 'pm-line') : ''));
      so += op(at(b, p, 1, 0.05 + i * 0.1, 0.15 + i * 0.1), tick(x + 138, y + 18));
    });
    o.phases = ph;
    if (b >= 1) o.signoff = so + op(at(b, p, 1, 0.3, 0.5), txt(X0, 236, tr('afgetekend', 'signed off'), 'pm-mute'));
    if (b >= 1) o.scope = op(at(b, p, 1, 0.55, 0.8), rect(X1 - 132, 58, 132, 38, 'pm-hot', 6) + txt(X1 - 66, 84, tr('vaste scope', 'fixed scope'), 'pm-on', 'middle'));
    if (b >= 2) o.fits = op(at(b, p, 2, 0.1, 0.4), txt(X0, 280, tr('één plan, sturen op afwijking', 'one plan, manage deviations'), 'pm-mute'))
      + op(at(b, p, 2, 0.4, 0.7), txt(X0, 306, tr('MS-station, lijn verhuizen', 'MS station, moving a line'), 'pm-txt'));
    if (b >= 3) o.royce = op(at(b, p, 3, 0.1, 0.4), rect(X0 - 4, 322, X1 - X0 + 8, 62, 'pm-card', 8) + txt(X0 + 8, 347, tr('Royce 1970: zonder', 'Royce 1970: risky'), 'pm-txt') + txt(X0 + 8, 372, tr('terugkoppeling riskant', 'without feedback'), 'pm-txt'));
    return o;
  }

  function s2(b, p) {
    const o = { head: [tr('agile', 'agile'), tr('schema', 'diagram')] };
    // four rounds as circling arrows, each ending in something that works
    let loop = '';
    for (let i = 0; i < 4; i++) {
      const cx = X0 + 34 + i * 72;
      const a = at(b, p, 0, 0.05 + i * 0.15, 0.2 + i * 0.15);
      loop += op(a, path(`M${cx + 24} ${f1(96)}A24 24 0 1 1 ${cx + 17} ${f1(79)}l1 -9M${cx + 17} ${f1(79)}l-9 -1`, 'pm-line') + txt(cx, 103, String(i + 1), 'pm-big', 'middle'));
    }
    loop += op(at(b, p, 0, 0.6, 0.85), txt(X0, 150, tr('elke ronde: iets werkends', 'each round: a working part'), 'pm-txt'));
    o.loop = loop;
    if (b >= 1) {
      let r = '';
      for (let i = 0; i < 4; i++) {
        const cx = X0 + 34 + i * 72;
        r += op(at(b, p, 1, 0.05 + i * 0.12, 0.2 + i * 0.12), path(`M${cx - 14} 166h28v18h-16l-6 6v-6h-6z`, 'pm-ring'));
      }
      r += op(at(b, p, 1, 0.5, 0.8), txt(X0, 214, tr('gebruikers reageren:', 'users react:'), 'pm-mute') + txt(X0, 238, tr('de scope beweegt mee', 'the scope adjusts'), 'pm-txt'));
      o.react = r;
    }
    if (b >= 2) o.manifesto = op(at(b, p, 2, 0.1, 0.4), rect(X0 - 4, 254, X1 - X0 + 8, 60, 'pm-card', 8) + txt(X0 + 8, 279, tr('Agile Manifesto, 2001', 'Agile Manifesto, 2001'), 'pm-on') + txt(X0 + 8, 304, tr('17 softwareontwikkelaars', '17 software developers'), 'pm-txt'));
    if (b >= 3) o.fitsA = op(at(b, p, 3, 0.1, 0.4), txt(X0, 346, tr('oplossing onduidelijk:', 'solution unclear:'), 'pm-mute') + txt(X0, 372, tr('overleg, dashboard', 'meeting, dashboard'), 'pm-txt'));
    return o;
  }

  function s3(b, p) {
    const o = { head: [tr('een sprint', 'a sprint'), tr('schema', 'diagram')] };
    o.scrum = txt(X0, 76, 'Scrum', 'pm-big') + txt(X1, 76, tr('agile methode', 'agile method'), 'pm-mute', 'end');
    const grow = b === 0 ? span(p, 0.3, 0.8) : 1;
    const bx0 = X0;
    const bx1 = X0 + (X1 - X0) * grow;
    o.sprint = rect(bx0, 96, bx1 - bx0, 28, 'pm-hot', 6) + op(at(b, p, 0, 0.5, 0.8), txt(X0, 152, tr('sprint: hooguit 1 maand', 'sprint: a month at most'), 'pm-txt') + txt(X0, 176, tr('vaak 2 weken', 'often 2 weeks'), 'pm-mute'));
    if (b >= 1) {
      o.review = op(at(b, p, 1, 0.05, 0.3), dot(X0 + 8, 110, 6, 'pm-dot') + txt(X0, 210, tr('planning vooraf,', 'planning first,'), 'pm-txt'))
        + op(at(b, p, 1, 0.4, 0.7), dia(X1 - 22, 110, 8) + txt(X0, 234, tr('review: gebruikers zien het', 'review: users see it'), 'pm-txt'));
    }
    if (b >= 2) o.retro = op(at(b, p, 2, 0.1, 0.4), dia(X1 - 8, 110, 8, 'pm-ring') + txt(X0, 268, tr('retrospective:', 'retrospective:'), 'pm-on') + txt(X0, 292, tr('hoe werkte het team?', 'how did the team work?'), 'pm-txt'));
    if (b >= 3) o.core = op(at(b, p, 3, 0.1, 0.4), rect(X0 - 4, 308, X1 - X0 + 8, 76, 'pm-card', 8) + txt(X0 + 8, 332, tr('fabriek: de kern', 'factory: the core'), 'pm-mute') + txt(X0 + 8, 356, tr('korte rondes, iets echts,', 'short rounds, something real,'), 'pm-txt') + txt(X0 + 8, 378, tr('feedback van de vloer', 'feedback from the floor'), 'pm-txt'));
    return o;
  }

  // the week axis of a card: weeks 0..n across the panel
  const wx = (wk, n) => X0 + 8 + (wk * (X1 - X0 - 16)) / n;
  function s4(b, p) {
    const o = { head: [tr('hybride', 'hybrid'), tr('schema', 'diagram')] };
    const n = 10;
    o.hybrid = txt(X0, 76, tr('stuurgroep', 'steering group'), 'pm-big') + txt(X0, 100, tr('mijlpalen, budget, datum', 'milestones, budget, date'), 'pm-mute')
      + path(`M${X0} 172H${X1}`, 'pm-dash') + op(at(b, p, 0, 0.4, 0.7), txt(X0, 200, tr('team', 'team'), 'pm-big') + txt(X1, 200, tr('korte rondes', 'short rounds'), 'pm-mute', 'end'));
    let m = path(`M${f1(wx(0, n))} 132H${f1(wx(n, n))}`, 'pm-axis') + dia(wx(n, n) - 2, 132, 9);
    m += op(at(b, p, 1, 0.05, 0.3), txt(X1, 160, tr('pilot live, week 10', 'pilot live, week 10'), 'pm-on', 'end'));
    o.miles = m;
    if (b >= 1) {
      let r = path(`M${f1(wx(0, n))} 236H${f1(wx(n, n))}`, 'pm-axis');
      for (let i = 0; i < 5; i++) r += op(at(b, p, 1, 0.3 + i * 0.1, 0.4 + i * 0.1), arc(wx(i * 2, n), wx(i * 2 + 2, n), 236));
      r += op(at(b, p, 1, 0.7, 0.9), txt(X0, 262, tr('rondes van 2 weken', 'two-week rounds'), 'pm-txt'));
      o.rounds = r;
    }
    if (b >= 2) o.pilot = op(at(b, p, 2, 0.1, 0.4), rect(X0 - 4, 278, X1 - X0 + 8, 60, 'pm-card', 8) + txt(X0 + 8, 302, tr('pilot: klein, één plek', 'pilot: small, one area'), 'pm-txt') + txt(X0 + 8, 327, tr('einddatum, weg terug', 'end date, way back'), 'pm-txt')
      + path(`M${X1 - 14} 296v16h-26m6 -6l-6 6l6 6`, 'pm-line'));
    if (b >= 3) o.doubt = op(at(b, p, 3, 0.1, 0.4), txt(X0, 372, tr('extra aandacht: te mooi?', 'extra attention: too good?'), 'pm-on'));
    return o;
  }

  function s5(b, p) {
    const o = { head: [tr('netbeheerder', 'grid operator'), tr('voorbeeld', 'example')] };
    o.case = txt(X0, 74, tr('vergunning, materiaal,', 'permits, materials,'), 'pm-txt') + txt(X0, 98, tr('ploeg: geregeld?', 'crew: in place?'), 'pm-txt') + op(at(b, p, 0, 0.5, 0.8), txt(X0, 122, tr('dan pas in de weekplanning', 'then into the week plan'), 'pm-mute'));
    if (b >= 1) {
      let s = txt(X0, 154, tr('waterval', 'waterfall'), 'pm-mute') + op(at(b, p, 1, 0.1, 0.4), rect(X0 + 96, 140, (X1 - X0 - 120) * at(b, p, 1, 0.1, 0.5), 16, 'pm-card', 4) + dot(X1 - 12, 148, 7, 'pm-ring'));
      s += op(at(b, p, 1, 0.4, 0.6), txt(X1, 180, tr('planners zien het pas hier', 'planners see it only here'), 'pm-txt', 'end'));
      s += op(at(b, p, 1, 0.6, 0.8), txt(X0, 214, tr('rondes', 'rounds'), 'pm-mute'));
      for (let i = 0; i < 6; i++) s += op(at(b, p, 1, 0.65 + i * 0.05, 0.7 + i * 0.05), arc(X0 + 96 + i * 30, X0 + 126 + i * 30, 214) + tick(X0 + 111 + i * 30, 226));
      o.both = s;
    }
    if (b >= 2) {
      const n = C.WEEKS;
      let s = path(`M${f1(wx(0, n))} 270H${f1(wx(n, n))}`, 'pm-axis');
      for (let i = 0; i <= n; i += 2) s += path(`M${f1(wx(i, n))} 270v6`, 'pm-axis');
      const labels = [tr('nulmeting klaar', 'baseline done'), tr('pilot live', 'pilot live'), tr('go/no-go uitrol', 'go/no-go rollout')];
      C.MILES.forEach((m, i) => {
        const a = at(b, p, 2, 0.1 + i * 0.25, 0.25 + i * 0.25);
        s += op(a, dia(wx(m, n), 270, 8) + dia(X0 + 8, 298 + i * 26, 6) + txt(X0 + 22, 305 + i * 26, `${tr('wk', 'wk')} ${m}`, 'pm-big') + txt(X0 + 84, 305 + i * 26, labels[i], 'pm-txt'));
      });
      o.plan = s;
    }
    if (b >= 3) {
      const n = C.WEEKS;
      let r = '';
      for (let i = 0; i < n / C.ROUND; i++) r += op(at(b, p, 3, 0.05 + i * 0.07, 0.12 + i * 0.07), arc(wx(i * 2, n), wx(i * 2 + 2, n), 266));
      r += op(at(b, p, 3, 0.6, 0.9), txt(X1, 382, tr('rondes van 2 weken', 'two-week rounds'), 'pm-on', 'end'));
      o.rounds = r;
    }
    return o;
  }

  function s6(b, p) {
    const o = { head: [tr('checklist', 'checklist'), tr('voorbeeld', 'example')] };
    const y = (i) => 100 + i * 28;
    let r1 = txt(X0, 72, tr('ronde 1 · 2 planners', 'round 1 · 2 planners'), 'pm-big');
    for (let i = 0; i < 5; i++) {
      const a = at(b, p, 0, 0.1 + i * 0.12, 0.2 + i * 0.12);
      if (i !== 3) r1 += op(a, rect(X0 + 2, y(i) - 15, 18, 18, 'pm-ring', 3) + txt(X0 + 30, y(i), `check ${i + 1}`));
    }
    o.round1 = r1;
    // check 4: in round 1, struck at its review
    const strike = b >= 1 ? at(b, p, 1, 0.4, 0.7) : 0;
    let out = op(at(b, p, 0, 0.46, 0.56), rect(X0 + 2, y(3) - 15, 18, 18, 'pm-ring', 3) + txt(X0 + 30, y(3), 'check 4', strike > 0.5 ? 'pm-mute' : 'pm-txt'));
    if (b >= 1) {
      out += path(`M${X0 + 26} ${y(3) - 7}H${f1(X0 + 26 + 90 * strike)}`, 'pm-line');
      out += op(at(b, p, 1, 0.1, 0.4), txt(X1, y(3), tr('te traag: eruit', 'too slow: out'), 'pm-on', 'end'));
    }
    o.out = out;
    if (b >= 2) o.round2 = op(at(b, p, 2, 0.1, 0.4), rect(X0 + 2, y(5) - 15, 18, 18, 'pm-hot', 3) + txt(X0 + 30, y(5), tr('+ schakelplan', '+ switching plan'), 'pm-txt') + txt(X1, y(5), tr('ronde 2', 'round 2'), 'pm-on', 'end'))
      + op(at(b, p, 2, 0.4, 0.7), txt(X0, 276, tr('vraag van bedrijfsvoering', 'the control room asked'), 'pm-mute'));
    if (b >= 3) {
      let j = op(at(b, p, 3, 0.05, 0.3), rect(X0 - 4, 296, X1 - X0 + 8, 88, 'pm-card', 8) + txt(X0 + 8, 324, tr('week 8: 60 echte klussen', 'week 8: 60 real jobs'), 'pm-on'));
      j += op(at(b, p, 3, 0.45, 0.7), txt(X0 + 8, 350, tr('planners vormden mee,', 'planners shaped it,'), 'pm-txt') + txt(X0 + 8, 374, tr('dus ze verdedigen hem', 'so they defend it'), 'pm-txt'));
      o.jobs = j;
    }
    return o;
  }

  function s7(b, p) {
    const o = { head: [tr('zonder jargon', 'without jargon'), tr('schema', 'diagram')] };
    o.jargon = txt(X0, 76, 'scrum', 'pm-big') + op(at(b, p, 0, 0.2, 0.4), path(`M${X0 - 2} 69H${X0 + 64}`, 'pm-line'))
      + op(at(b, p, 0, 0.45, 0.75), txt(X1, 76, tr('software en chaos?', 'software and chaos?'), 'pm-mute', 'end'));
    if (b >= 1) {
      const q = [tr('We werken in rondes van', 'We work in two-week'), tr('twee weken; elke ronde', 'rounds; every round'), tr('zie je iets werken.', 'you see something work.')];
      o.quote = op(at(b, p, 1, 0.05, 0.3), rect(X0 - 4, 94, X1 - X0 + 8, 92, 'pm-card', 8) + q.map((l, i) => txt(X0 + 8, 120 + i * 26, l, 'pm-txt')).join(''));
    }
    if (b >= 2) {
      o.milesplan = op(at(b, p, 2, 0.1, 0.4), txt(X0, 218, tr('directie: mijlpalen', 'board: milestones'), 'pm-txt') + [0, 1, 2].map((i) => dia(X1 - 70 + i * 28, 212, 7)).join(''))
        + op(at(b, p, 2, 0.4, 0.7), txt(X0, 246, tr('team: rondes', 'team: rounds'), 'pm-txt') + arc(X1 - 76, X1 - 46, 242) + arc(X1 - 46, X1 - 16, 242));
    }
    if (b >= 3) o.ask = op(at(b, p, 3, 0.05, 0.3), rect(X0 - 4, 270, X1 - X0 + 8, 112, 'pm-hot', 8) + [tr('Hoe zeker zijn we van', 'How sure are we about'), tr('hoe de oplossing', 'what the solution'), tr('eruitziet?', 'looks like?')].map((l, i) => txt(X0 + 8, 300 + i * 28, l, 'pm-on')).join(''));
    return o;
  }
  const CARDS = [s1, s2, s3, s4, s5, s6, s7];

  // ---------------------------------------------------------------- the room's paper
  // the calendar strip: from the example on (s5), the milestones in weeks 4, 8
  // and 16 as diamonds, then the two-week rounds as alternating bands
  function calendar(si, b, p) {
    if (si < 4) return '';
    const cell = (wk) => C.CELLS[wk - 1];
    let s = '';
    const rounds = si > 4 ? 1 : b >= 3 ? span(p, 0.05, 0.6) : 0;
    for (let r = 0; r < C.WEEKS / C.ROUND; r += 2) {
      const a = clamp(rounds * 8 - r, 0, 1);
      const [a0, a1] = cell(r * 2 + 1);
      const [, , c2, c3] = cell(r * 2 + 2);
      if (a > 0.01) s += op(a, rect(a0, a1, c2 - a0, c3 - a1, 'pm-band', 1));
    }
    const miles = si > 4 || b > 2 ? 1 : b === 2 ? span(p, 0.1, 0.8) : 0;
    C.MILES.forEach((m, i) => {
      const [a, bb, c, d] = cell(m);
      if (miles * 3 - i > 0.01) s += op(clamp(miles * 3 - i, 0, 1), dia((a + c) / 2, (bb + d) / 2, 4.2));
    });
    return s;
  }
  // the checklist on the table: five lines in round 1, check 4 struck, the
  // switching plan check added in round 2, ticks by week 8 (s6, s7)
  function listSheet(si, b, p) {
    if (si < 5) return '';
    const done = si > 5;
    const lines = done || b > 0 ? 5 : 5 * span(p, 0.1, 0.7);
    let s = '';
    for (let i = 0; i < 5; i++) {
      const a = clamp(lines - i, 0, 1);
      if (a > 0.01) s += `<path class="pm-line" d="M5 ${f1(4 + i * 4.4)}H${f1(5 + 13 * a)}"/>`;
    }
    const strike = done || b > 1 ? 1 : b === 1 ? span(p, 0.4, 0.7) : 0;
    if (strike > 0.01) s += `<path class="pm-line" d="M3 ${f1(4 + 3 * 4.4)}H${f1(3 + 17 * strike)}"/>`;
    const add = done || b > 2 ? 1 : b === 2 ? span(p, 0.1, 0.5) : 0;
    if (add > 0.01) s += `<path class="pm-line" d="M5 ${f1(4 + 5 * 4.4)}H${f1(5 + 13 * add)}"/>`;
    if (done || b >= 3) for (const i of [0, 1, 2, 4, 5]) s += `<path class="pm-line" d="M1.4 ${f1(4 + i * 4.4)}l1 1l1.8 -2"/>`;
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
    set(E.lLines, listSheet(si, b, p));
  }

  return { render };
})();
