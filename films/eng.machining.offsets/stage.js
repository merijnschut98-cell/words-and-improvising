  // ------------------------------------------------------------ the film "Correcties en offsets / Offsets and compensation"
  // Scenes: 1 three offsets, 2 why the split, 3 a crash, 4 what the engineer decides, 5 the case, 6 the answer.
  const ALL = ['slot', 'hole', 'g54', 'lenDim', 'tab', 'inset', 'card', 'touch'];
  const VIS = [
    ['g54', 'lenDim', 'tab', 'inset', 'slot'],
    ['g54', 'tab', 'inset', 'slot'],
    ['tab', 'inset', 'card', 'slot'],
    ['card', 'touch', 'lenDim', 'slot', 'tab'],
    ['card'],
    ['card'],
  ];

  // a card of the causes of a crash
  function causesCard(si, u) {
    const w = 372;
    return cardSvg(14, 44, w, tr('oorzaken', 'causes', 340), [
      [1, tr('ingetypt getal fout', 'typed number wrong', 340), '', 0.1],
      [2, tr('verkeerd H-nummer', 'wrong H number', 340), '', 0.1],
      [3, tr('verkeerd nulpunt actief', 'wrong work offset active', 340), '', 0.1],
      [4, tr('verkeerde magazijnplek', 'wrong magazine pocket', 340), '', 0.05],
      [4, tr('incrementeel, niet absoluut', 'incremental, not absolute', 340), '', 0.55],
    ], si, u);
  }
  // what the process engineer decides: by hand or measured
  function decideCard(si, u) {
    return cardSvg(14, 44, 400, tr('gemeten in plaats van getypt', 'measured instead of typed', 368), [
      [1, tr('voorinstelapparaat: lengtes', 'presetter: lengths', 368), '', 0.4],
      [2, tr('taster in de spil: G54', 'probe in the spindle: G54', 368), '', 0.1],
      [3, tr('gereedschapsmeter: controle', 'tool setter: check', 368), '', 0.1],
    ], si, u);
  }
  // the case: six crashes, their costs and the proposal
  function caseCard(si, u) {
    return cardSvg(14, 24, 420, tr('voorbeeld', 'example', 388), [
      [0, tr('6 crashes vorig jaar', '6 crashes last year', 388), '', 0.2],
      [1, tr('3 × lengte fout ingetypt', '3 × length typed wrong', 388), '', 0.1],
      [1, tr('2 × verkeerd H-nummer', '2 × wrong H number', 388), '', 0.4],
      [1, tr('1 × verkeerd nulpunt', '1 × wrong work offset', 388), '', 0.7],
      [2, tr('€12.000 per crash', '€12,000 per crash', 388), '', 0.2],
      [3, tr('voorinstelapparaat: €25.000', 'presetter: €25,000', 388), '', 0.2],
      [4, tr('lengtes en H-nummers weg', 'lengths and H numbers gone', 388), '', 0.2],
    ], si, u);
  }
  // the answer: the crashes it prevents, the saving, the payback, what is left
  function answerCard(si, u) {
    return cardSvg(14, 24, 420, tr('voorbeeld', 'example', 388), [
      [0, LANG === 'nl' ? '3 + 2 = 5 van de 6' : '3 + 2 = 5 of the 6', 'code', 0.1],
      [0, LANG === 'nl' ? '5 × €12.000 = €60.000' : '5 × €12,000 = €60,000', 'code', 0.55],
      [1, LANG === 'nl' ? '€25.000 / €60.000 = 0,42' : '€25,000 / €60,000 = 0.42', 'code', 0.15],
      [1, tr('jaar, zo’n 5 maanden', 'years, about 5 months', 388), '', 0.6],
      [2, tr('rest: het nulpunt', 'left: the work offset', 388), '', 0.1],
      [2, tr('taster of controle', 'probe or a check', 388), '', 0.6],
      [3, tr('was vorig jaar normaal?', 'was last year typical?', 388), '', 0.1],
    ], si, u);
  }

  function render(si, u) {
    scene(si, ALL, VIS[si]);
    camera(CAM[si], u);
    const B = C.B[si];
    const clock = u * C.dur[si];
    const bi = beatOf(si, u);
    let tool = 'mill';
    let tip = TOP + 40;
    let phase = 0;

    if (si === 0) {
      // the three offsets: the table, the work offset, the tool length, the radius; and off again
      tip = place(Wp(0, 40, 12), 'mill');
      set(E.slot, slotSvg(FULL));
      set(E.g54, g54Svg());
      fade(E.g54, bi >= 1 ? span(u, B[1], B[1] + 0.06) : 0);
      const off = bi >= 4 ? span(u, B[4] + 0.03, B[4] + 0.12) : 0;
      set(E.lenDim, lenDimSvg('mill', tip));
      fade(E.lenDim, bi >= 2 ? span(u, B[2], B[2] + 0.06) * (1 - off) : 0);
      set(E.rowT3, rowSvg(0, '3', '—', '—'));
      fade(E.tab, span(u, 0, 0.1));
      const k1 = bi >= 3 ? span(u, B[3], B[3] + 0.2) : 0;
      const I = insetRadius(k1, 0);
      set(E.insBody, I.body);
      set(E.insR, I.rc);
      set(E.insW, '');
      fade(E.inset, (bi >= 3 ? span(u, B[3] - 0.03, B[3]) : 0) * (1 - off));
      phase = clock * 9;
    } else if (si === 1) {
      // the contour once; a cutter of 9,98 gives radius 4,99; wear 0,005
      tip = place(Wp(0, 40, 12), 'mill');
      set(E.slot, slotSvg(FULL));
      set(E.g54, g54Svg());
      fade(E.g54, 1);
      set(E.rowT3, rowSvg(0, '3', '—', num(4.99, 2), 1, bi >= 1 ? span(u, B[1] + 0.08, B[1] + 0.18) : 0));
      const k1 = bi >= 1 ? span(u, B[1], B[1] + 0.12) : 0;
      const wear = bi >= 3 ? span(u, B[3] + 0.05, B[3] + 0.2) : 0;
      const I = insetRadius(k1, wear);
      set(E.insBody, I.body);
      set(E.insR, I.rc);
      set(E.insW, I.w);
      fade(E.inset, bi >= 1 ? span(u, B[1] - 0.03, B[1]) : 0);
      fade(E.tab, 1);
      phase = clock * 9;
    } else if (si === 2) {
      // a crash: 112,43 typed for 121,43; the table does not match the drill
      tool = 'drill';
      const target = -14;
      const typed = span(u, 0.02, B[1] * 0.7);
      set(E.rowT3, '');
      set(E.rowT5, rowSvg(0, '5', num(112.43, 2), '', typed, 1, typed > 0.99 ? `≠ ${num(121.43, 2)}` : ''));
      const zp = kf([[0, 25], [B[1] * 0.5, 2], [B[1] * 0.95, target - 9], [1, target - 9]], u)[0];
      set(E.slot, slotSvg(FULL));
      tip = place(Wp(C.HOLE[0], C.HOLE[1], zp), 'drill');
      const F = G.frameOf(Wp(C.HOLE[0], C.HOLE[1], 0), Z, X, Y);
      set(E.hole, zp < 0 ? `<path class="fp-cut" d="${G.circleOf(F, 0, 4.4, P, 28)}"/>${lineSvg(G.circleOf(F, 0, 4.4, P, 28), { tone: 'mid' })}` : '');
      phase = clock * 7;
      const crashK = span(u, 0.04, B[1]);
      const I = insetSection(zp, target, crashK);
      set(E.insBody, I.body);
      set(E.insS, I.s);
      set(E.insC, I.c);
      fade(E.inset, bi === 0 ? 1 : 1 - span(u, B[1], B[1] + 0.05));
      fade(E.tab, 1);
      set(E.card, bi >= 1 ? causesCard(si, u) : '');
    } else if (si === 3) {
      // what is measured: the probe sets G54, the tool setter checks the length
      tool = bi === 2 ? 'probe' : 'drill';
      const [sx, sy, sz] = C.SETTER;
      if (bi === 2) tip = place([-10, 25, TOP + 3], 'probe');
      else if (bi === 3) tip = place([sx, sy, sz], 'drill');
      else tip = place([-10, 25, TOP + 60], 'drill');
      set(E.slot, slotSvg(FULL));
      set(E.lenDim, bi === 3 ? lenDimSvg('drill', tip) : '');
      set(E.touch, '');
      set(E.rowT3, '');
      set(E.rowT5, rowSvg(0, '5', num(121.43, 2), '—'));
      set(E.card, bi >= 1 ? decideCard(si, u) : '');
    } else if (si === 4) {
      tip = place(Wp(0, 40, 12), 'mill');
      set(E.card, caseCard(si, u));
    } else if (si === 5) {
      tip = place(Wp(0, 40, 12), 'mill');
      set(E.card, answerCard(si, u));
    }

    set(E.tool, toolSvg(tool, tip, phase));
  }

  return { render };
})();
