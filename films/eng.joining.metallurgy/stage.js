  // ------------------------------------------------------------ the film "Wat warmte met het staal doet / What heat does to steel" (lesson eng.joining.metallurgy)
  // Scenes: 1 cooling (t8/5, martensite), 2 the carbon equivalent and the hydrogen crack, 3 stainless steel, 4 aluminium,
  // 5 the crane flange (the worked example).
  const RUNS = [{ si: -1, x0: XE, x1: -100, w: 26, h: 3, a: 0, b: 1 }];
  const VIS = [
    ['haz', 'bead', 'section', 'macro', 'chart', 'card'],
    ['haz', 'bead', 'section', 'macro', 'clock', 'card'],
    ['bead', 'section', 'therm', 'card'],
    ['bead', 'section', 'card'],
    ['haz', 'bead', 'section', 'scrim', 'cev', 'card'],
  ];
  const L = (x, y, t, size = 22, anchor = 'start', cls = 'fp-label') => label(x, y, t, size, anchor, true, cls);
  function ticks(cx, cy, r0, r1, n, from = -2.35, to = 2.35) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = from + ((to - from) * i) / (n - 1);
      d += `M${f1(cx + Math.sin(a) * r0)} ${f1(cy - Math.cos(a) * r0)}L${f1(cx + Math.sin(a) * r1)} ${f1(cy - Math.cos(a) * r1)}`;
    }
    return d;
  }
  const at0 = (si, u, rows, tag, x, y, w, keep = 1) => noteCard(x, y, w, tag, rows, si, u, keep);

  // scene 1: the section heats and cools, the chart traces t8/5, martensite forms; then what changes it
  function cooling(u, cm) {
    const B = C.B[0];
    const b = (k, v) => B[k] + v * (B[k + 1] - B[k]);
    const h = span(u, B[0], b(0, 0.5));
    const r8 = 13 * h * (1 - span(u, b(0, 0.6), b(1, 0.5)));
    const r5 = 20 * h * (1 - span(u, b(0, 0.7), b(1, 0.9)));
    macroLead(cm);
    set(E.macroIso, isoSvg(r8, 'fp-hotf') + isoSvg(r8) + isoSvg(r5)
      + (r8 > 4 ? hudText(mX(r8 * 0.72) + 4, mZ(PT + 3 - r8 * 0.68), '800', 20, 'start', 'fp-small') : '')
      + (r5 > 4 ? hudText(mX(r5 * 0.72) + 4, mZ(PT + 3 - r5 * 0.68), '500', 20, 'start', 'fp-small') : ''));
    set(E.macroCrack, '');
    op(E.macro, span(u, B[0], B[0] + 0.03));
    const tau = TMAX * span(u, B[0] + 0.01, B[1] + 0.8 * (B[2] - B[1]));
    const { curve, br } = chartAt(Math.max(0.05, tau));
    set(E.chartT85, bi0(u) >= 1 ? br : '');
    set(E.chartCurve, curve);
    op(E.macroMart, span(u, B[2], B[2] + 0.04));
    op(E.chart, 1 - span(u, B[3], B[3] + 0.04));
    const rows = [[3, tr('te lang: WBZ zacht', 'too long: HAZ soft')], [3, tr('taaiheid daalt', 'toughness drops')], [4, tr('meer warmte: langer', 'more heat: longer')], [4, tr('voorwarmen: langer', 'preheat: longer')], [4, tr('dikke plaat: korter', 'thick plate: shorter')]];
    set(E.card, at0(0, u, rows, tr('t8/5', 't8/5'), 336, 250, 290));
  }
  const bi0 = (u) => beatOf(0, u);

  // scene 2: the carbon equivalent, the three conditions of a hydrogen crack, the hold time
  function hydrogen(u, cm) {
    const B = C.B[1];
    const rows = [[0, tr('CEV = C + Mn/6', 'CEV = C + Mn/6'), 'code'], [0, tr('+ (Cr + Mo + V)/5', '+ (Cr + Mo + V)/5'), 'code'], [0, tr('+ (Ni + Cu)/15', '+ (Ni + Cu)/15'), 'code'],
      [1, tr('in % van het certificaat', 'in % from the certificate')], [1, tr('EN 1011-2, methode A', 'EN 1011-2, method A')],
      [2, tr('waterstof', 'hydrogen')], [2, tr('harde structuur', 'hard structure')], [2, tr('spanning', 'stress')],
      [3, tr('droog toevoegmateriaal', 'dry filler')], [3, tr('voorwarmen', 'preheat')], [3, tr('minder inklemming', 'less clamping')],
      [4, tr('wachttijd: 16 – 48 uur', 'hold time: 16 – 48 h')], [4, tr('EN 1011-2: voorwarmen', 'EN 1011-2: preheat')]];
    const tag = beatOf(1, u) <= 1 ? tr('koolstofequivalent', 'carbon equivalent') : beatOf(1, u) === 2 ? tr('waterstofscheur', 'hydrogen crack') : beatOf(1, u) === 3 ? tr('haal er één weg', 'remove one') : tr('de scheur komt later', 'the crack comes later');
    set(E.card, at0(1, u, rows, tag, 14, 60, 288, beatOf(1, u) <= 1 ? 2 : 1));
    macroLead(cm);
    set(E.macroIso, '');
    op(E.macroMart, 1);
    const grow = span(u, B[4] + 0.1 * (B[5] - B[4]), B[4] + 0.8 * (B[5] - B[4]));
    const cr = [];
    if (grow > 0) {
      const n = 9;
      for (let i = 0; i <= Math.round(n * grow); i++) {
        const z = PT - 0.5 - i * 1.5;
        cr.push([FT + 1.2 - (PT - z) * 0.55 + (i % 2 ? 0.5 : -0.4), z]);
      }
    }
    set(E.macroCrack, cr.length > 1 ? `<path class="fp-crack" style="stroke-width:2.2" d="${M2(cr, false)}"/>` : '');
    op(E.macro, span(u, B[2], B[2] + 0.03));
    // the clock runs to 48 h while the beat on the hold time is spoken
    const cIn = span(u, B[4], B[4] + 0.04);
    const hrs = 48 * span(u, B[4] + 0.1 * (B[5] - B[4]), B[4] + 0.8 * (B[5] - B[4]));
    const ccx = 190;
    const ccy = 300;
    const hand = (hrs / 12) * TAU;
    set(E.clock, `<g style="opacity:${cIn.toFixed(2)}"><circle class="fp-hud-bg" cx="${ccx}" cy="${ccy}" r="58"/><circle class="fp-mark" cx="${ccx}" cy="${ccy}" r="44"/><path class="fp-mark" d="${ticks(ccx, ccy, 37, 42, 12, 0, TAU * 11 / 12)}"/><path class="fp-mark" style="stroke-width:2.4" d="M${ccx} ${ccy}L${f1(ccx + Math.sin(hand) * 32)} ${f1(ccy - Math.cos(hand) * 32)}"/><circle class="fp-ink" cx="${ccx}" cy="${ccy}" r="3"/>${L(ccx, ccy + 90, num(hrs, 0) + ' h', 22, 'middle')}</g>`);
  }

  // scene 3: austenitic stainless steel and its pipe
  function stainless(u) {
    const bi = beatOf(2, u);
    const rows = [[0, tr('304 en 316', '304 and 316')], [0, tr('wordt niet hard', 'does not harden')], [0, tr('geen waterstofscheur', 'no hydrogen crack')],
      [1, tr('zet 40% meer uit', 'expands 40% more')], [1, tr('geleidt warmte slecht', 'conducts heat poorly')], [1, tr('dus: flink krom', 'so: distorts a lot')],
      [2, tr('tussenlaag: max ± 150 °C', 'interpass: max ± 150 °C')], [2, tr('voor de volgende laag', 'before the next pass')],
      [3, tr('blauw en bruin: eraf', 'blue and brown: off')], [3, tr('beitsen of borstelen', 'pickling or brushing')], [3, tr('pijp: binnen argon', 'pipe: argon inside')]];
    set(E.card, at0(2, u, rows, tr('austenitisch rvs', 'austenitic stainless'), 336, 60, 290));
    // the dial thermometer: the reading climbs into its band while the interpass beat runs
    const B = C.B[2];
    const tIn = span(u, B[2], B[2] + 0.04) * (1 - span(u, B[3] - 0.02, B[3]));
    const reading = span(u, B[2] + 0.02, B[2] + 0.7 * (B[3] - B[2]));
    const tcx = 84;
    const tcy = 292;
    const band = (() => { const a0 = -2.35 + 0.45 * 4.7; const a1 = -2.35 + 0.7 * 4.7; const pts = []; for (let i = 0; i <= 12; i++) { const a = a0 + ((a1 - a0) * i) / 12; pts.push([tcx + Math.sin(a) * 40, tcy - Math.cos(a) * 40]); } return pth(pts); })();
    const ang = -2.35 + (0.12 + 0.46 * reading) * 4.7;
    set(E.therm, `<g style="opacity:${tIn.toFixed(2)}"><circle class="fp-hud-bg" cx="${tcx}" cy="${tcy}" r="56"/><circle class="fp-mark" cx="${tcx}" cy="${tcy}" r="50"/><path class="fp-mark" d="${ticks(tcx, tcy, 44, 49, 11)}"/><path class="fp-mark fp-needle" style="stroke-width:7;opacity:.6" d="${band}"/><path class="fp-mark" style="stroke-width:2.4" d="M${tcx} ${tcy}L${f1(tcx + Math.sin(ang) * 38)} ${f1(tcy - Math.cos(ang) * 38)}"/><circle class="fp-ink" cx="${tcx}" cy="${tcy}" r="3.5"/>${L(tcx, tcy + 84, '°C', 22, 'middle', 'fp-small')}</g>`);
  }

  // scene 4: aluminium
  function aluminium(u) {
    const bi = beatOf(3, u);
    const tx = (T) => 40 + (T / 2200) * 560;
    const sx = (p) => 40 + p * 4; // a strength bar: 100 % is 400 units
    let out = '';
    if (bi === 0) {
      out = panelD(14, 60, 612, 230) + L(30, 94, tr('smeltpunt (°C)', 'melting point (°C)'), 22, 'start', 'fp-label fp-dim')
        + `<rect class="fp-meter" x="40" y="150" width="560" height="16" rx="8"/>`
        + `<circle class="fp-drop" cx="${f1(tx(660))}" cy="158" r="7"/><circle class="fp-drop" cx="${f1(tx(2050))}" cy="158" r="7"/>`
        + L(tx(660), 130, tr('metaal 660', 'metal 660'), 22, 'middle') + L(tx(2050) + 26, 130, tr('oxide 2.050', 'oxide 2,050'), 22, 'end')
        + L(30, 220, tr('borstelen en ontvetten vlak voor het lassen', 'brush and degrease just before welding', 570), 22)
        + L(30, 258, tr('vocht geeft poriën', 'moisture gives pores'), 22);
    } else if (bi === 1) {
      out = panelD(14, 60, 612, 230) + L(30, 94, tr('vloeigrens', 'yield strength'), 22, 'start', 'fp-label fp-dim')
        + `<rect class="fp-fill" x="40" y="120" width="${sx(100) - 40}" height="26" rx="6"/>` + L(sx(100) + 14, 142, tr('basismateriaal', 'base metal'), 22)
        + `<rect class="fp-fill" x="40" y="170" width="${sx(50) - 40}" height="26" rx="6"/>` + L(sx(50) + 14, 192, tr('WBZ van 6082-T6', 'HAZ of 6082-T6'), 22)
        + L(30, 250, tr('ongeveer de helft: Eurocode 9', 'about half: Eurocode 9', 570), 22);
    } else {
      out = panelD(14, 60, 612, 150) + L(30, 94, tr('een extra las voor de zekerheid:', 'an extra weld to be safe:', 570), 22) + L(30, 130, tr('maakt het frame zwakker', 'makes the frame weaker', 570), 22)
        + L(30, 180, tr('welke norm bepaalt het voorwarmen?', 'which standard sets the preheat?', 570), 22);
    }
    set(E.card, out);
  }

  // scene 5: the crane flange
  function flange(u) {
    const B = C.B[4];
    const bi = beatOf(4, u);
    const rows = [[0, tr('S355 · 40 mm', 'S355 · 40 mm'), 'code'], [0, tr('C 0,17%  Mn 1,50%', 'C 0.17%  Mn 1.50%'), 'code'], [0, tr('Cr+Mo+V 0,10%', 'Cr+Mo+V 0.10%'), 'code'], [0, tr('Ni+Cu 0,30%', 'Ni+Cu 0.30%'), 'code']];
    let card = '';
    if (bi === 0) card = at0(4, u, rows, tr('certificaat', 'certificate'), 14, 60, 288);
    else if (bi === 1) card = noteCard(14, 60, 612, tr('invullen', 'fill in'), [[1, tr('CEV = 0,17 + 1,50/6 + 0,10/5 + 0,30/15', 'CEV = 0.17 + 1.50/6 + 0.10/5 + 0.30/15', 570), 'code']], 4, u);
    else if (bi === 2) card = noteCard(14, 60, 612, tr('vraag', 'question'), [[2, tr('Wat is de CEV, en wat betekent dat voor deze plaat?', 'What is the CEV, and what does it mean here?', 570)]], 4, u);
    else if (bi === 3) card = noteCard(14, 60, 612, tr('antwoord', 'answer'), [[3, tr('CEV = 0,17 + 0,25 + 0,02 + 0,02 = 0,46', 'CEV = 0.17 + 0.25 + 0.02 + 0.02 = 0.46', 570), 'code'], [3, tr('hoog voor S355: voorwarmen', 'high for S355: preheat', 570)]], 4, u);
    else card = noteCard(14, 60, 612, tr('voorwarmen kost branders, gas en tijd', 'preheating costs burners, gas and time', 570), [[4, tr('ruilen kan: waterstofarmere draad', 'a trade: lower-hydrogen wire', 570)], [4, tr('of hogere warmte-inbreng in de LMB', 'or higher heat input in the WPS', 570)], [5, tr('vraag de lasingenieur de berekening', 'ask the welding engineer for the sum', 570)]], 4, u, 2);
    set(E.card, card);
    set(E.cev, bi >= 3 ? `<g style="opacity:${span(u, B[3], B[3] + 0.05).toFixed(2)}"><rect class="fp-card" x="420" y="290" width="196" height="94" rx="10"/>${L(518, 326, 'S355 · ' + num(40) + ' mm', 22, 'middle', 'fp-small')}${L(518, 368, 'CEV ' + num(C.CEV, 2), 30, 'middle')}</g>` : '');
  }

  function render(si, u) {
    scene(si, VIS[si]);
    const { cam: cm } = bench(RUNS, si, u, { torch: 'none', arcOn: false, hazOn: si !== 2 && si !== 3 });
    if (si === 0) cooling(u, cm);
    else if (si === 1) hydrogen(u, cm);
    else if (si === 2) stainless(u);
    else if (si === 3) aluminium(u);
    else flange(u);
    if (si !== 0 && si !== 1) { set(E.macroIso, ''); }
  }
  return { render };
})();
