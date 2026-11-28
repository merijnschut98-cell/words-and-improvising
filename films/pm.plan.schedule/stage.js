// The stage of the film "Het kritieke pad schuift / The critical path moves": a
// pure function of (scene, u). Inlined into the page after the anatomy kit and
// a preamble from build.mjs that defines C (the example and the panel layout),
// CAM (one camera move per scene), W and H. Moves are placed per caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. The panel at the right is drawn here each frame; the board in
// the room and the A4 on the table get the same drawing, in miniature.
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
  const txt = (x, y, t, size = 20, anchor = 'start', cls = 'pm-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const dia = (x, y, s = 9, cls = 'pm-dia') => `<path class="${cls}" d="M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z"/>`;
  const WKS = tr('wk', 'wk');
  const NAMES = NL
    ? { A: 'nulmeting', B: 'check', C: 'toegang', D: 'training', E: 'pilot' }
    : { A: 'baseline', B: 'check', C: 'access', D: 'training', E: 'pilot' };
  const OWNER = NL
    ? { A: 'jij', B: 'planner', C: 'IT', D: 'teamleider', E: 'teamleider' }
    : { A: 'you', B: 'planner', C: 'IT', D: 'team lead', E: 'team lead' };
  const IDS = ['A', 'B', 'C', 'D', 'E'];
  const ROW = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  const NEEDS = { A: [], B: ['A'], C: ['A'], D: ['B'], E: ['D', 'C'] };
  const LINKS = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['D', 'E'], ['C', 'E']];

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

  // the forward pass, with C free of A by cFree (0..1, it slides) and late weeks
  function plan(st) {
    const es = {};
    const ef = {};
    for (const t of IDS) {
      let s = Math.max(0, ...NEEDS[t].map((n) => ef[n]));
      if (t === 'C') s = lerp(s, 0, st.cFree);
      es[t] = s;
      ef[t] = s + C.DUR[t] + (st.late[t] || 0);
    }
    return { es, ef, end: ef.E };
  }
  // a task's card: the network (L0), the week axis (L1) or a Gantt row (L2)
  function rectOf(t, st, pl) {
    const l0 = C.L0[t];
    const l1 = [C.X0 + pl.es[t] * C.WK + 1.5, C.ROWY[t], C.DUR[t] * C.WK - 3, 46];
    const l2 = [C.GX0 + pl.es[t] * C.GWK + 1, C.GY0 + ROW[t] * C.GDY, C.DUR[t] * C.GWK - 2, C.GH];
    const a = l0.map((v, i) => lerp(v, l1[i], st.net));
    return a.map((v, i) => lerp(v, l2[i], st.gantt));
  }
  const xAt = (wk, st) => lerp(C.X0 + wk * C.WK, C.GX0 + wk * C.GWK, st.gantt);

  // the panel's drawing, for the panel (text on) and the minis (text hidden by CSS)
  function draw(st) {
    const pl = plan(st);
    const out = { axis: '', deps: '', cards: '', crit: '', slack: '', miles: '', go: '', cal: '' };
    // the week axis and the end line
    if (st.net > 0.01) {
      let a = '';
      for (let wk = 0; wk <= 15; wk += 3) a += txt(xAt(wk, st), 64, String(wk), 20, 'middle', 'pm-mute');
      const y1 = lerp(240, C.GY0 + 5 * C.GDY - 10, st.gantt);
      let ticks = '';
      for (let wk = 0; wk <= 15; wk++) ticks += `M${f1(xAt(wk, st))} 70V${wk % 3 ? 73 : 76}`;
      a += `<path class="pm-axis" d="M${f1(xAt(0, st))} 70H${f1(xAt(15, st))}${ticks}"/>`;
      const xe = xAt(pl.end, st);
      // the end line, a cue group of its own (focus: 'end')
      a += `<g data-cue="end"><path class="pm-end" d="M${f1(xe)} 78V${f1(y1)}"/></g>`;
      out.axis = op(st.net, a);
    }
    // the arrows (dependencies), each drawn in turn by st.deps (0..5)
    LINKS.forEach(([s, t], i) => {
      let a = clamp(st.deps - i, 0, 1);
      if (s === 'A' && t === 'C') a *= 1 - st.cFree;
      a *= 1 - 0.75 * st.gantt;
      if (a <= 0.01) return;
      const r0 = rectOf(s, st, pl);
      const r1 = rectOf(t, st, pl);
      const x0 = r0[0] + r0[2];
      const y0 = r0[1] + r0[3] / 2;
      const x1 = r1[0] - 1;
      const y1 = r1[1] + r1[3] / 2;
      const dx = Math.max(6, Math.abs(x1 - x0) / 2);
      const hs = clamp((x1 - x0) * 0.5, 3, 7);
      out.deps += op(a, `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}C${f1(x0 + dx)} ${f1(y0)} ${f1(x1 - dx)} ${f1(y1)} ${f1(x1)} ${f1(y1)}M${f1(x1 - hs)} ${f1(y1 - hs * 0.7)}L${f1(x1)} ${f1(y1)}L${f1(x1 - hs)} ${f1(y1 + hs * 0.7)}"/>`);
    });
    // the cards, with their letter and weeks; critical ones in petrol
    for (const t of IDS) {
      const a = st.cards[t] ?? 1;
      if (a <= 0.01) continue;
      const [x, y, w, h] = rectOf(t, st, pl);
      const crit = st.crit.includes(t);
      let body = rect(x, y, w, h, crit ? 'pm-card pm-crit' : 'pm-card', lerp(6, 4, st.gantt));
      const late = st.late[t] || 0;
      // the weeks a task runs late (focus: 'late')
      if (late > 0.01) body += `<g data-cue="late">${rect(x + w + 1, y + 4, late * lerp(C.WK, C.GWK, st.gantt) - 2, h - 8, 'pm-late', 3)}</g>`;
      const tA = 1 - st.gantt;
      if (tA > 0.01) {
        let s = txt(x + 8, y + 21, t, 22, 'start', crit ? 'pm-on' : 'pm-big');
        if (st.weeks > 0.01) s += op(st.weeks, txt(x + 8, y + 41, w >= 56 ? `${C.DUR[t]} ${WKS}` : String(C.DUR[t]), 20, 'start', 'pm-txt'));
        body += op(tA, s);
      }
      if (st.gantt > 0.01) body += op(st.gantt, txt(334, C.GY0 + ROW[t] * C.GDY + 20, `${t} ${OWNER[t]}`, 20, 'start', 'pm-txt'));
      // task C (system access, the step outside the team) is a cue group (focus: 'taskC')
      if (t === 'C') body = `<g data-cue="taskC">${body}</g>`;
      if (crit) out.crit += op(a, body); else out.cards += op(a, body);
    }
    // the slack between C's end and E's start, on C's row
    if (st.slack > 0.01) {
      const rc = rectOf('C', st, pl);
      const x0 = xAt(pl.ef.C - (st.late.C || 0), st);
      const x1 = xAt(pl.es.E, st);
      out.slack = op(st.slack, rect(x0 + 1, rc[1] + 6, x1 - x0 - 2, rc[3] - 12, 'pm-slack', 3));
    }
    // milestones: diamonds at the end of A, the start of E, and the go/no-go
    if (st.miles > 0.01) {
      const ra = rectOf('A', st, pl);
      const re = rectOf('E', st, pl);
      const ya = ra[1] + ra[3] / 2;
      const ye = re[1] + re[3] / 2;
      const s = lerp(10, 8, st.gantt);
      out.miles = op(st.miles, dia(xAt(C.MILES[0], st), ya, s) + dia(xAt(C.MILES[1], st), ye, s));
    }
    if (st.go > 0.01) {
      const re = rectOf('E', st, pl);
      out.go = op(st.go, dia(xAt(C.MILES[2], st), re[1] + re[3] / 2, lerp(12, 9, st.gantt)));
    }
    // the client's calendar under the Gantt: a strip of weeks with the steering-group days
    if (st.cal > 0.01) {
      const y = C.GY0 + 5 * C.GDY + 8;
      let c = rect(C.GX0, y, 15 * C.GWK, 16, 'pm-strip', 3);
      let ticks = '';
      for (let wk = 1; wk < 15; wk++) ticks += `M${f1(C.GX0 + wk * C.GWK)} ${f1(y)}v16`;
      c += `<path class="pm-axis" d="${ticks}"/>`;
      for (const m of C.MILES) c += `<circle class="pm-dot" cx="${f1(C.GX0 + (m - 0.5) * C.GWK)}" cy="${f1(y + 8)}" r="4"/>`;
      c += txt(334, y + 15, tr('stuurgroep', 'steering'), 20, 'start', 'pm-txt');
      out.cal = op(st.cal, c);
    }
    return out;
  }
  function mini(o) {
    return o.axis + o.deps + o.cards + o.crit + o.slack + o.miles + o.go + o.cal;
  }
  // the text under the drawing: lines of [text, class, diamond?]
  function textSvg(st) {
    let s = '';
    let y = st.lineY || 266;
    for (const [t, cls, d] of st.lines) {
      if (t) s += (d ? dia(342, y - 7, 7) + txt(356, y, t, 20, 'start', cls || 'pm-txt') : txt(334, y, t, 20, 'start', cls || 'pm-txt'));
      y += 26;
    }
    // the lines are a cue group (focus: 'note'); the legend under them is not
    if (s) s = `<g data-cue="note">${s}</g>`;
    if (st.legend > 0.01) {
      let l = '';
      IDS.forEach((t, i) => { l += txt(i < 3 ? 334 : 480, 318 + (i % 3) * 26, `${t} ${NAMES[t]}`, 20, 'start', 'pm-txt'); });
      s += op(st.legend, l);
    }
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const st = { net: 0, gantt: 0, cFree: 0, late: {}, deps: 5, cards: {}, weeks: 1, crit: [], slack: 0, miles: 0, go: 0, cal: 0, legend: 1, lines: [], doc: 0 };
    const ABDE = ['A', 'B', 'D', 'E'];
    const ALL = ['A', 'B', 'C', 'D', 'E'];
    let title = tr('taken', 'tasks');
    if (si === 0) {
      st.weeks = 0;
      if (b === 0) { IDS.forEach((t, i) => { st.cards[t] = span(p, 0.1 + i * 0.13, 0.22 + i * 0.13); }); st.deps = 0; }
      if (b === 1) st.deps = 2 * span(p, 0.3, 0.9);
      if (b === 2) st.deps = 2 + 3 * span(p, 0.25, 0.9);
      if (b === 3) st.lines = [[tr('ook: een handtekening,', 'also: a sign-off,')], [tr('de OR, een productiestop', 'works council, a stop')]].map((l, i) => (span(p, 0.15 + i * 0.25, 0.3 + i * 0.25) > 0.5 ? l : ['']));
    } else if (si === 1) {
      title = tr('weken', 'weeks');
      if (b === 0) st.weeks = span(p, 0.1, 0.5);
      if (b >= 1) st.crit = b === 3 && p > 0.45 ? ALL : (b === 1 && p < 0.35 ? [] : ABDE);
      if (b >= 2) st.lines.push(['A+B+D+E = 3+4+2+6 = 15', 'pm-on']);
      if (b === 3) st.lines.push(['A+C+E = 3+6+6 = 15', p > 0.45 ? 'pm-on' : 'pm-txt']);
    } else if (si === 2) {
      title = tr('weken', 'weeks');
      st.net = b === 0 ? span(p, 0.02, 0.3) : 1;
      st.crit = ALL;
      if (b === 0) { st.late.C = span(p, 0.4, 0.75); st.lines = p > 0.6 ? [[tr('C +1 wk: eind wk 16', 'C +1 wk: end wk 16'), 'pm-on']] : []; }
      if (b === 1) { st.late.D = span(p, 0.2, 0.5); st.lines = p > 0.35 ? [[tr('D +1 wk: ook eind wk 16', 'D +1 wk: end wk 16 too'), 'pm-on']] : []; }
      if (b === 2) st.lines = [[tr('C: een stap buiten het team', 'C: a step outside the team')]];
      if (b === 3) st.lines = [[tr('sneller? beide ketens korter', 'faster? shorten both chains')]];
    } else if (si === 3) {
      title = tr('weken', 'weeks');
      st.net = 1;
      st.cFree = b === 0 ? span(p, 0.45, 0.85) : 1;
      st.crit = st.cFree > 0.5 ? ABDE : ALL;
      if (b === 0) st.lines = [[tr('C start in week 1', 'C starts in week 1')]];
      if (b === 1) st.lines = [[tr('eind blijft wk 15', 'end stays at wk 15'), 'pm-on']];
      if (b >= 2) { st.slack = b === 2 ? span(p, 0.3, 0.6) : 1; st.lines = [[tr('C klaar wk 6, E start wk 9', 'C done wk 6, E starts wk 9')], [tr('speling 9 − 6 = 3 wk', 'slack 9 − 6 = 3 wk'), 'pm-on']]; }
      if (b === 3) { st.late.C = 2 * span(p, 0.2, 0.6); st.lines.shift(); st.lines.push([tr('C +2 wk: eind blijft 15', 'C +2 wk: end stays 15'), 'pm-on']); }
    } else if (si === 4) {
      title = tr('weken', 'weeks');
      st.net = 1;
      st.cFree = 1;
      st.crit = ABDE;
      st.legend = b === 0 ? 1 - span(p, 0, 0.2) : 0;
      st.miles = b === 0 ? span(p, 0.3, 0.6) : 1;
      st.go = b === 0 ? 0 : (b === 1 ? span(p, 0.3, 0.6) : 1);
      const L = [[tr('wk 3 nulmeting klaar', 'wk 3 baseline done'), '', true], [tr('wk 9 pilot start', 'wk 9 pilot starts'), '', true]];
      if (b >= 1) L.push([tr('wk 15 go/no-go', 'wk 15 go/no-go'), 'pm-on', true]);
      if (b >= 2) L.push([tr('elke 6 weken', 'every 6 weeks')]);
      if (b >= 3) L.push([tr('stuurgroep checkt', 'steering group checks')]);
      st.lines = b === 0 && p < 0.3 ? [] : L;
    } else {
      title = 'Gantt';
      st.net = 1;
      st.cFree = 1;
      st.lineY = 352;
      st.crit = ABDE;
      st.miles = 1;
      st.go = 1;
      st.legend = 0;
      st.gantt = b === 0 ? span(p, 0.05, 0.45) : 1;
      st.cal = b === 0 ? 0 : (b === 1 ? span(p, 0.2, 0.5) : 1);
      st.doc = b === 0 ? span(p, 0.4, 0.9) : 1;
      if (b === 0) st.lines = p > 0.5 ? [[tr('één A4, één rij per resultaat', 'one page, a row per result')]] : [];
      if (b === 1) st.lines = [[tr('naast de klantkalender', 'beside the client calendar')]];
      if (b === 2) st.lines = [[tr('aan de muur, niet in een map', 'on the wall, not in a file'), 'pm-on']];
      if (b === 3) st.lines = [[tr('de vloer corrigeert', 'the floor corrects it')]];
      if (b === 4) st.lines = [[tr('Wat moet er deze maand', 'What has to happen this'), 'pm-on'], [tr('gebeuren voor de einddatum?', 'month for the end date?'), 'pm-on']];
    }
    const o = draw(st);
    set(E.pAxis, o.axis);
    set(E.pDeps, o.deps);
    set(E.pCards, o.cards);
    set(E.pCrit, o.crit);
    set(E.pSlack, o.slack);
    set(E.pMiles, o.miles);
    set(E.pGo, o.go);
    set(E.pCal, o.cal);
    set(E.pText, textSvg(st));
    set(E.pHead, txt(334, 38, title, 20, 'start', 'pm-big') + txt(618, 38, tr('voorbeeld', 'example'), 20, 'end', 'pm-mute'));
    set(E.bMini, mini(o));
    set(E.dMini, st.doc > 0.01 ? op(st.doc, mini(o)) : '');
  }

  return { render };
})();
