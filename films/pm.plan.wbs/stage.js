// The stage of the film "Het werk opdelen en schatten / Breaking down and
// estimating the work": a pure function of (scene, u). Inlined into the page
// after the anatomy kit and a preamble from build.mjs that defines C (the
// calendar cells and the scene lengths), CAM (one camera move per scene), W
// and H. Moves are placed per caption beat (beatStarts), so the video's
// narration timing (films/_kit/beatwarp.js) keeps them in step. The panel at
// the right is drawn here each frame, labelled "voorbeeld" (a lesson's worked
// example) or "schema" (a rule drawn on its own); the board in the room gets
// the same drawing in miniature, the A4 on the table when a beat names it.
// Every part a beat can light is a cue group: cue('key', ...) below.
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
  const txt = (x, y, t, cls = 'pm-txt', anchor = 'start', size = 20) => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const op = (a, body) => (a <= 0.01 || !body ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const cue = (k, body) => (body ? `<g data-cue="${k}">${body}</g>` : '');
  const dia = (x, y, s = 9, cls = 'pm-dia') => `<path class="${cls}" d="M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z"/>`;
  const path = (d, cls) => `<path class="${cls}" d="${d}"/>`;
  // lines of text from y down, 26 apart: [text, class]
  const lines = (x, y, rows, anchor = 'start') => rows.map(([t, cls], i) => (t ? txt(x, y + i * 26, t, cls || 'pm-txt', anchor) : '')).join('');
  const L = 334; // the panel's text column, left
  const R = 618; // and right

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

  // the four slots of a goal sentence, with their values
  function slots(values, a = 1) {
    const keys = tr(['van', 'naar', 'voor', 'gemeten'], ['from', 'to', 'by', 'measured']);
    let s = '';
    keys.forEach((k, i) => {
      const y = 58 + i * 48;
      s += rect(L, y, R - L, 40, 'pm-card') + txt(L + 10, y + 27, k, 'pm-mute');
      s += op(clamp(a * 4 - i, 0, 1), txt(L + tr(100, 112), y + 27, values[i], 'pm-txt'));
    });
    return s;
  }

  // ------------------------------------------------------------ scene 1: from wish to goal
  function s1(b, p) {
    const out = { title: tr('doel in één zin', 'a one-line goal'), label: tr('voorbeeld', 'example'), body: '', cal: [] };
    if (b === 0) {
      out.body = cue('wish', rect(L, 58, R - L, 92, 'pm-card', 12)
        + txt(L + 14, 96, tr('“de verspilling', '“reduce the'), 'pm-big') + txt(L + 14, 126, tr('terugdringen”', 'waste”'), 'pm-big')
        + op(span(p, 0.35, 0.6), lines(L, 196, [[tr('een wens,', 'a wish,'), 'pm-on'], [tr('nog geen doel', 'not yet a goal'), 'pm-on']])));
      return out;
    }
    if (b <= 2) {
      out.label = tr('schema', 'diagram');
      const line3 = tr(['14 uur/week', '8 uur/week', '1 april', 'stoplog MES'], ['14 h/week', '8 h/week', '1 April', 'MES stop log']);
      out.body = cue('goal', slots(line3, b === 1 ? span(p, 0.1, 0.7) : 1) + txt(L, 270, tr('lijn 3, stilstand', 'line 3, stops'), 'pm-mute'));
      if (b === 2) out.body += op(span(p, 0.1, 0.4), lines(L, 320, [[tr('samen met de klant,', 'with the client,'), 'pm-on'], [tr('hardop teruglezen', 'read it back'), 'pm-on']]));
      return out;
    }
    if (b <= 4) {
      out.title = tr('nulmeting', 'baseline');
      // 75.000 kg a week as one bar, the 3,2 % scrap as the slice at its end
      const w = R - L;
      const slice = Math.max(12, w * 0.032);
      let s = rect(L, 70, w, 46, 'pm-card') + rect(R - slice, 70, slice, 46, 'pm-crit', 3) + txt(L + 12, 101, tr('75.000 kg/week', '75,000 kg/week'), 'pm-txt');
      s += path(`M${f1(R - slice / 2)} 118V136`, 'pm-arrow');
      s += lines(L, 162, [[tr('afkeur 3,2%', 'scrap 3.2%'), 'pm-on'], [tr('≈ 2.400 kg per week', '≈ 2,400 kg a week')], [tr('vooral na omstellen', 'mostly after changeovers'), 'pm-mute']]);
      if (b === 4) s += op(span(p, 0.05, 0.35), lines(L, 262, [[tr('geen data?', 'no data?'), 'pm-mute'], [tr('eerst 2 weken meten', 'measure 2 weeks first'), 'pm-on'], [tr('2 weken: weekpatroon', '2 weeks: weekly pattern')], [tr('seizoen: langer', 'seasonal: longer'), 'pm-mute']]));
      out.body = cue('base', s);
      if (b === 4) out.label = tr('schema', 'diagram');
      if (b === 4) out.cal = [0, 1].filter((i) => span(p, 0.1 + i * 0.12, 0.25 + i * 0.12) > 0.5);
      return out;
    }
    const food = tr(['3,2% afkeur', '2,0%', 'eind Q2', 'afkeurrapportage'], ['3.2% scrap', '2.0%', 'end of Q2', 'scrap report']);
    out.body = cue('goal', slots(food, span(p, 0.05, 0.6)) + txt(L, 270, tr('twee afvullijnen', 'two filling lines'), 'pm-mute'));
    return out;
  }

  // ------------------------------------------------------------ scene 2: in and out
  function s2(b, p) {
    const out = { title: 'scope', label: tr('voorbeeld', 'example'), body: '', cal: [] };
    const CW = 140;
    const colA = rect(L - 4, 50, CW, 236, 'pm-col', 8) + txt(L + 6, 78, tr('binnen', 'in'), 'pm-big')
      + lines(L + 6, 110, [[tr('opstarten', 'start-up')], [tr('instellingen', 'settings')], [tr('instructies', 'instructions')]]);
    const colB = rect(R - CW, 50, CW, 236, 'pm-col', 8) + txt(R - CW + 10, 78, tr('buiten', 'out'), 'pm-big')
      + lines(R - CW + 10, 110, [[tr('leverancier', 'supplier')], [tr('recepturen', 'recipes')]]);
    out.body = cue('scope', op(b === 0 ? span(p, 0.05, 0.3) : 1, colA));
    if (b >= 1) out.body += cue('out', op(b === 1 ? span(p, 0.05, 0.3) : 1, colB + op(b === 1 ? span(p, 0.5, 0.75) : 1, lines(R - CW + 10, 194, [[tr('+ wat men', '+ what people'), 'pm-mute'], [tr('gaat vragen', 'will raise'), 'pm-mute']]))));
    if (b >= 2) {
      // requests creep in one at a time, from below into the "in" column
      const asks = tr(['lijn 2?', 'ook even…', 'en dit?'], ['line 2?', 'also…', 'and this?']);
      let c = '';
      asks.forEach((t, i) => {
        const a = b === 2 ? span(p, 0.15 + i * 0.22, 0.3 + i * 0.22) : 1;
        if (a <= 0.01) return;
        const y = lerp(340, 202 + i * 30, a);
        c += op(a, rect(L + 2, y - 20, CW - 12, 26, 'pm-late', 4) + txt(L + 10, y, t, 'pm-txt'));
      });
      out.body += cue('creep', c);
    }
    if (b === 3) out.body += cue('trade', op(span(p, 0.05, 0.35), lines(L, 314, [[tr('ruilen, of de sponsor', 'swap, or the sponsor')], [tr('geeft er tijd bij', 'adds time')], [tr('“wat laten we vallen?”', '“what do we drop?”'), 'pm-on']])));
    return out;
  }

  // ------------------------------------------------------------ scene 3: when is it done
  function s3(b, p) {
    const out = { title: tr('acceptatie', 'acceptance'), label: tr('voorbeeld', 'example'), body: '', cal: [], doc: 0 };
    // four weeks of scrap, each at or under the 2,0 % line
    const y0 = 220;
    const yLine = 120;
    let ch = path(`M${L + 52} ${y0}H${R - 6}`, 'pm-axis') + path(`M${L + 52} ${yLine}H${R - 6}`, 'pm-end') + txt(L, yLine + 7, '2,0%'.replace(',', tr(',', '.')), 'pm-txt');
    [0.92, 0.85, 1, 0.8].forEach((v, i) => {
      const a = b === 0 ? span(p, 0.1 + i * 0.12, 0.25 + i * 0.12) : 1;
      const x = L + 70 + i * 56;
      const h = (y0 - yLine) * v * a;
      ch += rect(x, y0 - h, 36, h, 'pm-bar', 3) + txt(x + 18, y0 + 26, String(i + 1), 'pm-mute', 'middle');
      if (a > 0.9) ch += path(`M${x + 9} ${yLine - 22}l6 7l12 -14`, 'pm-arrow');
    });
    let acc = ch;
    if (b <= 1) acc += lines(L, 278, [[tr('4 weken op rij', '4 weeks in a row'), 'pm-on'], [tr('productiemanager', 'production manager')], [tr('tekent af', 'signs off')]]);
    if (b === 1) acc += op(span(p, 0.1, 0.4), txt(L, 360, tr('afspreken: aan het begin', 'agree it at the start'), 'pm-on'));
    out.body = cue('accept', acc);
    if (b === 0) out.cal = [0, 1, 2, 3].filter((i) => span(p, 0.1 + i * 0.12, 0.25 + i * 0.12) > 0.5);
    if (b === 1) out.doc = span(p, 0.2, 0.6);
    if (b === 2) out.label = tr('schema', 'diagram');
    if (b === 2) out.body += cue('stretch', op(span(p, 0.1, 0.4), path(`M${L + 52} 196H${R - 6}`, 'pm-late') + lines(L + 52, 280, [[tr('te ambitieus?', 'stretch target?'), 'pm-on'], [tr('niemand gelooft het:', 'nobody believes it:')], [tr('stil genegeerd', 'quietly ignored'), 'pm-mute']])));
    if (b === 3) out.body += cue('saved', op(span(p, 0.05, 0.4), lines(L, 286, [[tr('3,2% → 2,0%', '3.2% → 2.0%'), 'pm-big'], [tr('= 900 kg per week', '= 900 kg a week'), 'pm-on'], [tr('minder afkeur', 'less scrap')]])));
    return out;
  }

  // ------------------------------------------------------------ scene 4: deliverables, the tree
  const BX = (i) => L + 4 + i * 72; // a deliverable's box, left
  function tree(st) {
    let s = '';
    s += cue('root', op(st.root, rect(L + 58, 54, 168, 40, 'pm-card pm-crit') + txt(L + 142, 81, '18% → &lt;8%', 'pm-on', 'middle')));
    let lk = '';
    let dl = '';
    let pk = '';
    const PK = [3, 2, 3, 2];
    for (let i = 0; i < 4; i++) {
      const a = clamp(st.deliv * 4 - i, 0, 1);
      if (a <= 0.01) continue;
      const x = BX(i);
      dl += op(a, rect(x, 118, 60, 40, 'pm-card') + txt(x + 30, 146, String(i + 1), 'pm-big', 'middle'));
      if (st.tree > 0.01) {
        lk += op(st.tree, path(`M${L + 142} 94V106H${x + 30}V118`, 'pm-link'));
        for (let j = 0; j < PK[i]; j++) {
          const pa = clamp(st.tree * PK[i] - j, 0, 1);
          pk += op(pa, path(`M${x + 6} ${158}V${176 + j * 22}H${x + 10}`, 'pm-link') + rect(x + 10, 168 + j * 22, 48, 16, 'pm-pkg', 3));
        }
      }
    }
    s += cue('wbs', lk) + cue('deliv', dl) + cue('pkg', pk);
    return s;
  }
  function s4(b, p) {
    const out = { title: 'WBS', label: tr('voorbeeld', 'example'), body: '', cal: [] };
    const st = { root: b === 0 ? span(p, 0.05, 0.3) : 1, deliv: b === 0 ? 0 : b === 1 ? span(p, 0.2, 0.7) : 1, tree: b < 3 ? 0 : b === 3 ? span(p, 0.1, 0.7) : 1 };
    out.body = tree(st);
    if (b === 0) out.body += op(span(p, 0.3, 0.6), lines(L, 262, [[tr('netbeheerder:', 'grid operator:'), 'pm-mute'], [tr('late afzeggingen', 'last-week cancellations')], [tr('in zes maanden', 'in six months')]]));
    if (b === 1) out.body += cue('deliv', op(span(p, 0.3, 0.6), lines(L, 262, [[tr('resultaat: er straks,', 'there at the end,')], [tr('te controleren', 'can be checked')], [tr('vier tot zeven', 'four to seven'), 'pm-on']])));
    if (b === 2 || b === 3) {
      const rows = tr([['1 nulmeting per oorzaak'], ['2 gereedheidscheck'], ['3 pilot, zes weken'], ['4 overdracht']], [['1 baseline by cause'], ['2 readiness check'], ['3 six-week pilot'], ['4 handover']]);
      out.body += cue('note', op(b === 2 ? span(p, 0.1, 0.4) : 1, lines(L, 268, rows)));
    }
    if (b === 4) {
      const br = path(`M${L} 244v8H${R}v-8M${(L + R) / 2} 252v8`, 'pm-link');
      out.body += cue('rule100', op(span(p, 0.05, 0.35), br + lines(L, 296, [[tr('100%-regel, PMI:', '100% rule, PMI:'), 'pm-on'], [tr('al het werk erin,', 'all the work in it,')], [tr('niets erbuiten', 'nothing outside it')]])));
    }
    return out;
  }

  // ------------------------------------------------------------ scene 5: work packages
  function s5(b, p) {
    const out = { title: tr('werkpakketten', 'work packages'), label: tr('voorbeeld', 'example'), body: '', cal: [] };
    const names = tr(['data halen', 'indelen', 'bespreken'], ['extract data', 'classify', 'review']);
    const hrs = [16, 12, 4];
    let pk = rect(L, 54, R - L, 36, 'pm-card pm-crit') + txt(L + 10, 79, tr('1 nulmeting', '1 baseline'), 'pm-on');
    names.forEach((n, i) => {
      const a = b === 0 ? span(p, 0.15 + i * 0.15, 0.3 + i * 0.15) : 1;
      const y = 100 + i * 44;
      pk += op(a, path(`M${L + 14} ${y - 10}V${y + 18}H${L + 26}`, 'pm-link') + rect(L + 26, y, R - L - 26, 36, 'pm-pkg', 4) + txt(L + 36, y + 25, n, 'pm-txt'));
      if (b === 3) pk += op(span(p, 0.1 + i * 0.2, 0.25 + i * 0.2), txt(R - 10, y + 25, `${hrs[i]} ${tr('u', 'h')}`, 'pm-on', 'end'));
    });
    out.body = cue('pkg', pk);
    if (b === 1) {
      out.label = tr('schema', 'diagram');
      // the 8–80 rule on a scale of hours (logarithmic, 1 to 400 h)
      const xh = (h) => L + ((Math.log10(h) - 0) / Math.log10(400)) * (R - L);
      let sc = rect(L, 262, xh(8) - L, 14, 'pm-late', 3) + rect(xh(8), 262, xh(80) - xh(8), 14, 'pm-slack', 3) + rect(xh(80), 262, R - xh(80), 14, 'pm-late', 3);
      sc += txt(xh(8), 254, '8', 'pm-on', 'middle') + txt(xh(80), 254, '80', 'pm-on', 'middle') + txt(R, 254, tr('uur', 'hours'), 'pm-mute', 'end') + txt(L, 360, tr('een vuistregel', 'a rule of thumb'), 'pm-on');
      sc += txt(L, 302, tr('micro-', 'micro-'), 'pm-mute') + txt((xh(8) + xh(80)) / 2, 302, tr('goed', 'good'), 'pm-txt', 'middle') + txt(R, 302, tr('verborgen', 'hidden'), 'pm-mute', 'end');
      sc += txt(L, 326, tr('management', 'management'), 'pm-mute') + txt(R, 326, tr('verrassing', 'surprises'), 'pm-mute', 'end');
      out.body += cue('hours', op(span(p, 0.05, 0.3), sc));
    }
    if (b === 2) out.body += cue('dod', op(span(p, 0.2, 0.5), lines(L, 270, [[tr('werkwoord, eigenaar,', 'verb, owner,')], [tr('klaar als: akkoord', 'done when: agreed by'), 'pm-on'], [tr('planningsmanager', 'planning manager'), 'pm-on']])));
    if (b === 3) out.body += cue('note', op(span(p, 0.15, 0.35), lines(L, 270, [[tr('16 u: de data-analist', '16 h: the data analyst')], [tr('12 u: twee planners', '12 h: two planners')], [tr('4 u: onder 8, mag ook', '4 h: under 8, fine too'), 'pm-mute']])));
    return out;
  }

  // ------------------------------------------------------------ scene 6: together on the wall
  function s6(b, p) {
    const out = { title: tr('op de muur', 'on the wall'), label: tr('voorbeeld', 'example'), body: '', cal: [] };
    const N = [3, 2, 3, 2];
    let nt = '';
    for (let i = 0; i < 4; i++) {
      const x = L + 6 + i * 72;
      nt += txt(x + 28, 70, String(i + 1), 'pm-big', 'middle');
      for (let j = 0; j < N[i]; j++) {
        const a = b === 0 ? span(p, 0.1 + (i * 3 + j) * 0.05, 0.2 + (i * 3 + j) * 0.05) : 1;
        nt += op(a, rect(x, 80 + j * 34, 56, 28, 'pm-note', 2));
      }
    }
    out.body = cue('notes', nt);
    if (b >= 1) {
      const a = b === 1 ? span(p, 0.3, 0.55) : 1;
      out.body += cue('added', op(a, rect(L + 6 + 2 * 72, 80 + 3 * 34, 56, 28, 'pm-note pm-crit', 2)
        + (b === 1 ? lines(L, 244, [[tr('+ schakelmonteurs', '+ brief the switching'), 'pm-on'], [tr('briefen', 'technicians'), 'pm-on']]) : '')));
    }
    if (b >= 2) out.label = tr('schema', 'diagram');
    if (b === 2) out.body += cue('forgot', op(span(p, 0.05, 0.3), lines(L, 232, [[tr('vaak vergeten:', 'often forgotten:'), 'pm-mute'], [tr('data-toegang, OR,', 'data access, works council,')], [tr('toestemming, training,', 'permissions, training,')], [tr('overdracht aan de lijn', 'handover to the line')]])));
    if (b === 3) out.body += cue('talk', op(span(p, 0.05, 0.3), lines(L, 232, [[tr('“laten we gewoon', '“let’s just'), 'pm-mute'], [tr('beginnen”', 'start”'), 'pm-mute'], [tr('eens: deze week.', 'agreed: this week.'), 'pm-on'], [tr('geef me één uur', 'give me one hour'), 'pm-on'], [tr('geen verrassing', 'no surprise'), 'pm-txt'], [tr('in maand twee', 'in month two'), 'pm-txt']])));
    if (b === 4) out.body += cue('talk', op(span(p, 0.05, 0.3), lines(L, 232, [[tr('alles op dag één, of', 'all on day one, or'), 'pm-txt'], [tr('6 weken fijn, rest grof', '6 weeks fine, rest rough'), 'pm-txt'], [tr('vraag de expert:', 'ask the expert:'), 'pm-mute'], [tr('“wat moet eerst af?”', '“what must be done first?”'), 'pm-on']])));
    return out;
  }

  // ------------------------------------------------------------ scene 7: a range, not a point
  function s7(b, p) {
    const out = { title: tr('schatten', 'estimating'), label: tr('schema', 'diagram'), body: '', cal: [] };
    // weeks 0..14 on an axis; the point 8 against the range 6 to 10
    const xw = (w) => L + 10 + w * ((R - L - 20) / 14);
    let rg = path(`M${f1(xw(0))} 100H${f1(xw(14))}${[...Array(15).keys()].map((w) => `M${f1(xw(w))} 100v${w % 2 ? 4 : 7}`).join('')}`, 'pm-axis');
    rg += txt(xw(6), 88, '6', 'pm-txt', 'middle') + txt(xw(10), 88, '10', 'pm-txt', 'middle') + txt(xw(14), 88, tr('wk', 'wk'), 'pm-mute', 'middle');
    rg += dia(xw(8), 100, 7, 'pm-dot') + txt(xw(8), 74, '8?', 'pm-mute', 'middle');
    const a0 = b === 0 ? span(p, 0.3, 0.6) : 1;
    rg += op(a0, rect(xw(6), 110, xw(10) - xw(6), 16, 'pm-slack', 3) + txt(L, 156, tr('zes tot tien weken', 'six to ten weeks'), 'pm-on'));
    out.body = cue('range', rg);
    if (b === 1 || b === 2) {
      // days 0..15: optimistic 4, most likely 6, pessimistic 14, PERT 7
      const xd = (d) => L + 10 + d * ((R - L - 20) / 15);
      let th = path(`M${f1(xd(0))} 226H${f1(xd(15))}`, 'pm-axis') + txt(R, 208, tr('dagen', 'days'), 'pm-mute', 'end');
      [['O', 4], ['M', 6], ['P', 14]].forEach(([k, d], i) => {
        const a = b === 1 ? span(p, 0.2 + i * 0.15, 0.35 + i * 0.15) : 1;
        th += op(a, path(`M${f1(xd(d))} 218v16`, 'pm-arrow') + txt(xd(d), k === 'M' ? 256 : 208, `${k} ${d}`, 'pm-txt', 'middle'));
      });
      if (b === 2) th += op(span(p, 0.3, 0.6), dia(xd(7), 226, 8) + txt(xd(7), 282, 'PERT 7', 'pm-on', 'middle'));
      out.body += cue('three', th);
      if (b === 1) out.body += cue('three', op(span(p, 0.7, 0.9), txt(L, 186, tr('drie punten', 'three points'), 'pm-mute')));
      if (b === 2) {
        out.body += cue('note', op(span(p, 0.1, 0.4), lines(L, 310, [['(O + 4M + P) / 6'], ['(4 + 24 + 14) / 6 = 7', 'pm-on'], [tr('PERT: Polaris, 1958', 'PERT: Polaris, 1958'), 'pm-mute']])));
      }
    }
    if (b >= 3) {
      const s = 4.6;
      let fa = txt(L, 202, tr('verwacht: 34 dagen', 'expected: 34 days'), 'pm-txt') + rect(L, 212, 34 * s, 18, 'pm-bar', 3);
      fa += txt(L, 258, tr('echt: 56 dagen', 'actual: 56 days'), 'pm-on') + rect(L, 268, 56 * s * (b === 3 ? span(p, 0.3, 0.7) : 1), 18, 'pm-crit', 3);
      fa += lines(L, 318, [['Kahneman, Tversky 1979', 'pm-mute'], [tr('Buehler e.a. 1994', 'Buehler et al. 1994'), 'pm-mute']]);
      out.body += cue('fallacy', op(b === 3 ? span(p, 0.05, 0.3) : 1, fa));
      if (b === 4) out.body += cue('note', op(span(p, 0.1, 0.4), txt(L, 372, tr('vraag: hoe lang écht?', 'ask: how long, really?'), 'pm-on')));
    }
    return out;
  }

  // ------------------------------------------------------------ scene 8: hours, weeks and one buffer
  function s8(b, p) {
    const out = { title: tr('uren en weken', 'hours and weeks'), label: tr('schema', 'diagram'), body: '', cal: [] };
    if (b <= 1) {
      // 16 hours of effort as 16 cells, flowing into four weeks of 4 hours
      const flow = b === 1 ? span(p, 0.1, 0.6) : 0;
      let ef = txt(L, 72, tr('inspanning: 16 uur', 'effort: 16 hours'), 'pm-txt');
      let du = '';
      for (let h = 0; h < 16; h++) {
        const wk = Math.floor(h / 4);
        const x0 = L + h * 17.6;
        const y0 = 84;
        const x1 = L + 4 + wk * 72 + (h % 4) * 15;
        const y1 = 154;
        ef += rect(lerp(x0, x1, flow), lerp(y0, y1, flow), 13, 22, 'pm-pkg', 2);
      }
      for (let wk = 0; wk < 4; wk++) du += rect(L + wk * 72, 148, 66, 34, 'pm-col', 4) + txt(L + 33 + wk * 72, 206, `${tr('wk', 'wk')} ${wk + 1}`, 'pm-mute', 'middle');
      du += txt(L, 238, tr('doorlooptijd: 4 weken', 'duration: 4 weeks'), 'pm-on');
      out.body = cue('dur', du) + cue('effort', ef);
      out.body += lines(L, 280, [[tr('ploegleider: 20%', 'shift lead: 20%'), 'pm-txt'], [tr('van de week vrij', 'of the week free'), 'pm-mute']]);
      if (b === 1) {
        out.body += cue('dur', op(span(p, 0.6, 0.85), txt(L, 342, tr('+ vakantie, piekseizoen', '+ holidays, peak season'), 'pm-txt')));
        out.cal = [0, 1, 2, 3].filter((i) => span(p, 0.15 + i * 0.12, 0.3 + i * 0.12) > 0.5);
      }
      return out;
    }
    // padding hidden in every task, then one visible buffer at the end
    const hide = b === 2 ? span(p, 0.35, 0.6) : 1;
    const T = [[L, 66], [L + 82, 60], [L + 158, 58]];
    let tk = '';
    T.forEach(([x, w]) => {
      tk += rect(x, 70, w, 26, 'pm-card', 3);
      tk += op(1 - hide, rect(x + w + 2, 72, 12, 22, 'pm-late', 2));
    });
    const bx = L + 230;
    let bf = op(hide, rect(bx, 66, R - bx, 34, 'pm-slack', 4) + txt((bx + R) / 2, 124, 'buffer', 'pm-on', 'middle'));
    bf += op(span(b === 2 ? p : 1, 0.35, 0.55), lines(L, 166, [[tr('werk dijt uit:', 'work expands:'), 'pm-mute'], [tr('Parkinson, 1955', 'Parkinson, 1955')], [tr('pas laat beginnen:', 'starting late:'), 'pm-mute'], [tr('studentensyndroom,', 'student syndrome,')], [tr('Goldratt, 1997', 'Goldratt, 1997')]]));
    if (b === 3) {
      // the buffer half used at a quarter of the way: an early warning
      const used = span(p, 0.05, 0.3) * 0.5;
      bf += rect(L, 296, R - L, 20, 'pm-slack', 4) + rect(L, 296, (R - L) * used, 20, 'pm-crit', 4) + path(`M${f1(L + (R - L) * 0.25)} 288v36`, 'pm-end');
      out.cal = [4];
    }
    out.body = tk + cue('buffer', bf);
    if (b === 3) out.body += cue('note', op(span(p, 0.2, 0.4), lines(L, 350, [[tr('half op na een kwart:', 'half gone at a quarter:'), 'pm-txt'], [tr('vroeg signaal', 'early warning'), 'pm-on']])));
    return out;
  }

  // ------------------------------------------------------------ scene 9: three days?
  function s9(b, p) {
    const out = { title: tr('drie dagen?', 'three days?'), label: tr('voorbeeld', 'example'), body: '', cal: [], doc: 0 };
    const top = b < 4
      ? cue('talk', txt(L, 82, tr('“drie dagen”', '“three days”'), 'pm-big') + op(b === 0 ? span(p, 0.3, 0.6) : 1, lines(L, 118, [[tr('beste geval?', 'best case?'), 'pm-on'], [tr('wat maakt het langer?', 'what makes it longer?'), 'pm-on']])))
      : cue('note', op(span(p, 0.05, 0.3), lines(L, 76, [[tr('“4 tot 8 weken; na de', '“4 to 8 weeks; after the'), 'pm-txt'], [tr('datacheck in week 2', 'data check in week 2'), 'pm-txt'], [tr('weet ik meer”', 'I’ll know more”'), 'pm-txt'], [tr('+ de datum die je belooft', '+ the date you commit to'), 'pm-on']])));
    out.body = top;
    if (b === 4) out.label = tr('schema', 'diagram');
    if (b >= 1) {
      // days 0..12: best 2, the engineer's 3, worst 10, PERT 4
      const xd = (d) => L + 10 + d * ((R - L - 20) / 12);
      let rg = path(`M${f1(xd(0))} 212H${f1(xd(12))}${[...Array(13).keys()].map((d) => `M${f1(xd(d))} 212v5`).join('')}`, 'pm-axis');
      rg += txt(xd(2), 202, '2', 'pm-txt', 'middle') + txt(xd(3), 202, '3', 'pm-mute', 'middle') + txt(xd(10), 202, '10', 'pm-txt', 'middle') + txt(R, 202, tr('d', 'd'), 'pm-mute', 'end');
      rg += op(b === 1 ? span(p, 0.2, 0.5) : 1, rect(xd(2), 220, xd(10) - xd(2), 16, 'pm-slack', 3));
      rg += op(b === 1 ? span(p, 0.4, 0.7) : 1, lines(L, 266, [[tr('best 2: export werkt', 'best 2: export works')], [tr('slechtst 10: migratie', 'worst 10: migration')]]));
      out.body += cue('range', rg);
      if (b >= 2) {
        out.body += cue('three', op(b === 2 ? span(p, 0.05, 0.3) : 1, dia(xd(4), 228, 8) + txt(L, 324, '(2 + 4×3 + 10) / 6 = 4', 'pm-on')));
        out.body += cue('dur', op(b === 2 ? span(p, 0.25, 0.45) : 1, txt(L, 350, tr('1 dag per week: ~4 wk', '1 day a week: ~4 wk'), 'pm-txt')));
      }
      if (b >= 3) out.body += cue('note', op(b === 3 ? span(p, 0.1, 0.4) : 1, txt(L, 376, tr('plan: 2 tot 10 wk, ~4', 'plan: 2 to 10 wk, ~4'), 'pm-on')));
      if (b === 3) out.doc = span(p, 0.2, 0.6);
    }
    return out;
  }

  const SCENES = [s1, s2, s3, s4, s5, s6, s7, s8, s9];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const o = SCENES[si](b, p);
    set(E.pBody, o.body);
    set(E.pHead, txt(L, 38, o.title, 'pm-big') + txt(R, 38, o.label, 'pm-mute', 'end'));
    set(E.bMini, o.body);
    set(E.dMini, o.doc > 0.01 ? op(o.doc, o.body) : '');
    let cal = '';
    for (const i of o.cal) { const [a, bb, c, d] = C.CELLS[i]; cal += `<rect class="pm-cal" x="${f1(a)}" y="${f1(bb)}" width="${f1(c - a)}" height="${f1(d - bb)}"/>`; }
    set(E.calHi, cal);
  }

  return { render };
})();
