// The stage of the film "Is het echt beter? / Is it really better?": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C (the weekly values of line 3 and line
// 4, the four early weeks, the bad spell, the panel's blocks), CAM (one camera
// move per scene), W and H. Moves are placed per Dutch caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. The panel at the right is drawn here each frame, every block in
// its own cue group (o[key] goes into data-k "p_<key>"); the board in the room
// repeats the panel in miniature and the sheet on the table is the raw data.
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
  const txt = (x, y, t, cls = 'cr-txt', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="20" text-anchor="${anchor}">${esc(t)}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const dot = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const X0 = 334;
  const X1 = 618;
  // lines of [text, class] from y down, 26 apart
  const lines = (y, list, x = X0) => list.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'cr-txt') : '')).join('');
  const card = (y, h, cls = 'cr-card') => rect(X0 - 6, y, X1 - X0 + 12, h, cls, 8);
  const strike = (x, y, w) => path(`M${f1(x - 2)} ${f1(y - 7)}H${f1(x + w)}`, 'cr-strike');
  // b at or after beat k: 1; before: 0; in beat k: the eased progress from a to c
  const at = (b, p, k, a = 0.05, c = 0.3) => (b > k ? 1 : b < k ? 0 : span(p, a, c));

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

  // ------------------------------------------------------------ the run chart
  // Weeks 1 to 22 (12 baseline weeks, then 10 after) across, downtime 5 to
  // 19 % up; a dashed divider after week 12.
  const CX0 = 378;
  const CX1 = 614;
  const NW = C.L3.length;
  const xW = (i) => CX0 + (i + 0.5) * ((CX1 - CX0) / NW);
  const yV = (v) => 230 - (v - 5) * 11;
  const xDiv = (xW(C.BASE - 1) + xW(C.BASE)) / 2;
  function axes() {
    let s = path(`M${CX0} 62V232H${CX1}`, 'cr-axis');
    for (const v of [10, 15]) s += path(`M${CX0} ${f1(yV(v))}H${CX1}`, 'cr-grid') + txt(CX0 - 6, yV(v) + 7, `${v}%`, 'cr-mute', 'end');
    s += path(`M${f1(xDiv)} 66V232`, 'cr-dash');
    s += txt((CX0 + xDiv) / 2, 258, tr('nulmeting', 'baseline'), 'cr-mute', 'middle') + txt((xDiv + CX1) / 2, 258, tr('erna', 'after'), 'cr-mute', 'middle');
    return s;
  }
  // a run of weekly points from week i0, n of them shown (fractional: the last fades in)
  function run(vals, i0, n, dotCls, lineCls) {
    let d = '';
    let s = '';
    vals.forEach((v, j) => {
      const a = clamp(n - j, 0, 1);
      if (a <= 0.01) return;
      const x = xW(i0 + j);
      const y = yV(v);
      d += `${d ? 'L' : 'M'}${f1(x)} ${f1(y)}`;
      s += op(a, dot(x, y, 3.4, dotCls));
    });
    return (d ? path(d, lineCls) : '') + s;
  }
  // the band of a run from its lowest to its highest week, with its range at the side
  function band(lo, hi, i0, i1, label, cls = 'cr-band') {
    const x0 = xW(i0) - 5;
    const x1 = xW(i1) + 5;
    return rect(x0, yV(hi), x1 - x0, yV(lo) - yV(hi), cls, 3) + (label ? txt(label[0], label[1], label[2], 'cr-on', label[3] || 'start') : '');
  }
  const base3 = (n) => run(C.L3.slice(0, C.BASE), 0, n, 'cr-dot', 'cr-line');
  const after3 = (n) => run(C.L3.slice(C.BASE), C.BASE, n, 'cr-dot', 'cr-line');
  const line4 = (n) => run(C.L4, 0, n, 'cr-dot4', 'cr-dash4') + op(clamp(n - NW + 1, 0, 1), txt(CX1, yV(15.6), tr('lijn 4', 'line 4'), 'cr-mute', 'end'));
  const BAND3 = (a) => op(a, band(C.LO, C.HI, 0, C.BASE - 1, [CX0 + 4, yV(C.HI) - 6, tr('11–17%: ruis', '11–17%: noise')]));
  const BANDA = (a) => op(a, band(C.LO2, C.HI2, C.BASE, NW - 1, [CX1, yV(C.LO2) + 20, tr('lijn 3: 7–11%', 'line 3: 7–11%'), 'end'], 'cr-band2'));

  // ------------------------------------------------------------ the scenes
  // Each returns o: the panel's blocks by cue key, plus head [title, 'ex' | 'dia'].
  const S = [];
  // s1: the baseline, measured the same way; stops over 5 and over 2 minutes; raw data
  S[0] = (b, p) => ({
    head: [tr('de nulmeting', 'the baseline'), 'dia'],
    base: op(span(b === 0 ? p : 1, 0.08, 0.3), card(54, 92, b === 0 ? 'cr-hot' : 'cr-card') + lines(80, [[tr('nulmeting', 'baseline'), 'cr-lab'], [tr('de prestatie vóór', 'performance before')], [tr('de verandering', 'the change')]])),
    same: op(at(b, p, 1), lines(178, [[tr('zelfde definitie', 'same definition'), 'cr-on'], [tr('zelfde databron', 'same data source')], [tr('zelfde periodelengte', 'same period length')], [tr('vergelijkbare situatie', 'similar conditions')]])),
    stops: op(at(b, p, 2), txt(X0, 290, tr('voor: stops > 5 min', 'before: stops > 5 min')) + txt(X0, 316, tr('erna: stops > 2 min', 'after: stops > 2 min'))
      + op(at(b, p, 2, 0.45, 0.6), strike(X0, 290, NL ? 196 : 216) + strike(X0, 316, NL ? 196 : 196) + txt(X1, 342, tr('waardeloos', 'worthless'), 'cr-on', 'end'))),
    raw: op(at(b, p, 3), card(350, 36, 'cr-hot') + txt(X0, 375, tr('opschrijven + ruwe data', 'write down + raw data'), 'cr-on')),
  });
  // s2: line 3's baseline, its noise band, four early weeks, the rule of thumb
  S[1] = (b, p) => {
    const n = b === 0 ? span(p, 0.1, 0.85) * (C.BASE + 0.99) : C.BASE;
    const ghost = at(b, p, 2, 0.05, 0.4);
    return {
      head: [tr('bottelarij, lijn 3', 'bottling plant, line 3'), 'ex'],
      axes: axes(),
      base3: base3(n) + op(b === 0 ? span(p, 0.75, 0.95) : 1, path(`M${f1(xW(0))} ${f1(yV(C.MEAN))}H${f1(xW(C.BASE - 1))}`, 'cr-mean')),
      band: BAND3(at(b, p, 1, 0.1, 0.4)),
      four: op(ghost, run(C.GHOST, C.BASE, 4, 'cr-ghost', 'cr-dash') + lines(296, [[tr('4 weken, 2 punten lager:', '4 weeks, 2 points lower:')], [tr('nog binnen de band', 'still inside the band'), 'cr-on']])),
      weeks: op(at(b, p, 3), card(342, 44, 'cr-hot') + txt(X0, 371, tr('erna: 8 tot 12 weken', 'after: 8 to 12 weeks'), 'cr-on')),
    };
  };
  // s3: what else changed; line 4 as the comparison line; line 3 after; the verdict
  S[2] = (b, p) => {
    const n4 = b < 1 ? 0 : b === 1 ? span(p, 0.15, 0.8) * (NW + 0.99) : NW;
    const n3 = b < 2 ? 0 : b === 2 ? span(p, 0.08, 0.6) * (NW - C.BASE + 0.99) : NW - C.BASE;
    return {
      head: [tr('lijn 3 en lijn 4', 'line 3 and line 4'), b === 0 ? 'dia' : 'ex'],
      axes: axes(),
      base3: base3(C.BASE),
      band: BAND3(1),
      other: op(span(b === 0 ? p : 1, 0.08, 0.3), lines(296, [[tr('wat veranderde nog meer?', 'what else changed?'), 'cr-lab'], [tr('volume, productmix,', 'volume, product mix,')], [tr('seizoen, nieuwe mensen', 'season, new staff')]])),
      line4: line4(n4),
      after3: BANDA(at(b, p, 2, 0.6, 0.8)) + after3(n3),
      verdict: op(at(b, p, 3), card(350, 36, 'cr-hot') + txt(X0, 375, tr('nauwelijks overlap: echt', 'barely overlap: real'), 'cr-on')),
    };
  };
  // s4: a test or a run chart; regression to the mean; a result that fades
  S[3] = (b, p) => {
    // the bad spell: normal weeks, a bad spell, the project starts, the weeks fall back
    const RX0 = 346;
    const RX1 = 612;
    const step = (RX1 - RX0) / (C.RTM.length - 1);
    const ry = (v) => 300 - (v - 9) * 11;
    const shown = b < 1 ? 0 : b === 1 ? span(p, 0.1, 0.8) * (C.RTM.length + 0.99) : C.RTM.length;
    let r = '';
    let d = '';
    C.RTM.forEach((v, i) => {
      const a = clamp(shown - i, 0, 1);
      if (a <= 0.01) return;
      d += `${d ? 'L' : 'M'}${f1(RX0 + i * step)} ${f1(ry(v))}`;
      r += op(a, dot(RX0 + i * step, ry(v), 3.4, i >= C.SPELL[0] && i <= C.SPELL[1] ? 'cr-hotdot' : 'cr-dot'));
    });
    const xs = RX0 + (C.SPELL[1] + 0.5) * step;
    let rtm = '';
    if (b >= 1) {
      rtm = path(`M${RX0} ${f1(ry(C.NORMAL))}H${RX1}`, 'cr-mean') + txt(RX0, ry(C.NORMAL) - 30, tr('normaal', 'normal'), 'cr-mute')
        + (d ? path(d, 'cr-line') : '') + r
        + op(at(b, p, 1, 0.4, 0.55), path(`M${f1(xs)} 150V310`, 'cr-dash') + txt(xs - 6, 168, tr('slechte periode', 'bad spell'), 'cr-on', 'end') + txt(xs + 6, 168, 'start', 'cr-mute'))
        + op(at(b, p, 2), txt(RX1, 232, tr('zakt vanzelf terug', 'drifts back anyway'), 'cr-on', 'end'));
    }
    return {
      head: [tr('toets of run chart', 'test or run chart'), 'dia'],
      test: op(span(b === 0 ? p : 1, 0.08, 0.3), lines(78, [[tr('formele toets?', 'a formal test?'), 'cr-mute'], [tr('of: run chart', 'or: a run chart'), 'cr-on'], [tr('+ vergelijkingsgroep', '+ a comparison group'), 'cr-on']])),
      rtm,
      fade: op(at(b, p, 3), card(330, 56, 'cr-hot') + lines(353, [[tr('zakt het weg als jij gaat?', 'fades once you leave?'), 'cr-txt'], [tr('na 3 maanden opnieuw', 'again after 3 months'), 'cr-on']])),
    };
  };
  // s5: money in the client's terms; at a grid operator; contribution margin; the controller
  S[4] = (b, p) => ({
    head: [tr('geld in hun termen', 'money in their terms'), 'dia'],
    books: op(span(b === 0 ? p : 1, 0.06, 0.3), lines(76, [[tr('uren zijn pas geld als:', 'hours are money only if:'), 'cr-lab'], [tr('minder overwerk', 'overtime cut')], [tr('een ploeg minder', 'a shift dropped')], [tr('meer product verkocht', 'more product sold')], [tr('investering vermeden', 'an investment avoided')]])),
    grid: op(at(b, p, 1), lines(218, [[tr('netbeheerder:', 'grid operator:'), 'cr-lab'], [tr('sneller aangesloten', 'connected sooner')], [tr('minder klantminuten weg', 'fewer customer minutes')]])),
    margin: op(at(b, p, 2), card(290, 58, 'cr-hot') + lines(314, [[tr('dekkingsbijdrage =', 'contribution margin ='), 'cr-lab'], [tr('prijs − variabele kosten', 'price − variable costs'), 'cr-on']])),
    check: op(at(b, p, 3), txt(X0, 378, tr('de controller checkt', 'the controller checks it'), 'cr-on')),
  });
  // s6: the bottling plant's sum, checked by the controller
  S[5] = (b, p) => ({
    head: [tr('de som van lijn 3', 'line 3’s sum'), 'ex'],
    sum: op(span(b === 0 ? p : 1, 0.06, 0.3), lines(78, [[tr('gepland: 6.000 uur/jaar', 'planned: 6,000 h a year'), 'cr-txt'], [tr('14 → 9%: 5 punten', '14 → 9%: 5 points')], [tr('= 300 extra draaiuren', '= 300 extra running hours'), 'cr-on']])),
    sold: op(at(b, p, 1), lines(170, [[tr('uitverkocht:', 'sold out:'), 'cr-lab'], [tr('uren worden product', 'hours become product')]])),
    value: op(at(b, p, 2), card(214, 100, 'cr-hot') + lines(240, [[tr('dekkingsbijdrage:', 'contribution margin:'), 'cr-lab'], [tr('€450 per uur; 300 × €450', '€450 an hour; 300 × €450'), 'cr-txt'], [tr('≈ €135.000 per jaar', '≈ €135,000 a year'), 'cr-on']])),
    together: op(at(b, p, 3), lines(350, [[tr('samen met de controller,', 'with the controller,'), 'cr-lab'], [tr('die het narekende', 'who checked it')]])),
  });
  // s7: the people side
  S[6] = (b, p) => ({
    head: [tr('de mensenkant', 'the people side'), 'dia'],
    claim: op(span(b === 0 ? p : 1, 0.06, 0.3), txt(X0, 78, tr('claim niet te veel', 'don’t overclaim'), 'cr-lab')
      + op(at(b, p, 1), card(92, 96) + lines(118, [[tr('“van 12 naar 8%;', '“from 12 to 8%;')], [tr('±1 punt: zomervolume;', '~1 point: summer volume;')], [tr('de rest: veranderingen”', 'the rest: the changes”'), 'cr-on']]))),
    credit: op(at(b, p, 2), lines(222, [[tr('kritische controller: welkom', 'sceptical controller: welcome')], [tr('eer naar het team', 'credit to the team'), 'cr-on']])),
    ask: op(at(b, p, 3), card(296, 88, 'cr-hot') + lines(326, [[tr('“Wie behalve ik', '“Who besides me will'), 'cr-on'], [tr('verdedigt dit getal?”', 'defend this number?”'), 'cr-on']])),
  });

  // the sheet on the table: rows of raw data (s1 b4 on), a tick when checked (s6)
  function sheet(si, b, p) {
    const n = si === 0 ? (b < 3 ? 0 : span(p, 0.1, 0.7) * 8) : 8;
    let s = '';
    for (let i = 0; i < 8; i++) {
      const a = clamp(n - i, 0, 1);
      if (a > 0.01) s += `<path class="cr-row" d="M2.5 ${f1(4 + i * 3)}H${f1(2.5 + (15 - (i % 3) * 2) * a)}"/>`;
    }
    if (si >= 5 && (si > 5 || b >= 3)) s += '<path class="cr-tick" d="M12 24l2 2l4 -5"/>';
    return s;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = S[si](b, p);
    const lab = o.head[1] === 'dia' ? tr('schema', 'diagram') : tr('voorbeeld', 'example');
    set(E.pHead, txt(X0, 38, o.head[0], 'cr-big') + txt(X1, 38, lab, 'cr-mute', 'end'));
    let mini = '';
    for (const c of C.SLOTS) { set(E[`p_${c}`], o[c] || ''); mini += o[c] || ''; }
    set(E.bMini, mini);
    set(E.sLines, sheet(si, b, p));
  }

  return { render };
})();
