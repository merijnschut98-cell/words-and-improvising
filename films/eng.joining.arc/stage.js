  // ------------------------------------------------------------ the film "Booglassen: de basis / Arc welding basics" (lesson eng.joining.arc)
  // Scenes: 1 how it works (a tour of the bench), 2 shielding gas, 3 MIG/MAG, 4 TIG, 5 heat per millimetre,
  // 6 a bracket (the worked example), 7 too little gas (the worked example).
  // The weld grows one stretch a scene; earlier stretches stay.
  const RUNS = [
    { si: 0, x0: XE, x1: 85, w: 26, h: 3, a: 0.5, b: 0.97 },
    { si: 1, x0: 85, x1: 55, w: 26, h: 3, a: 0.04, b: 0.96 },
    { si: 2, x0: 55, x1: 25, w: 26, h: 3, a: 0.04, b: 0.96 },
    { si: 3, x0: 25, x1: -5, w: 20, h: 2, a: 0.04, b: 0.96 },
    { si: 4, x0: -5, x1: -35, w: 26, h: 3, a: 0.04, b: 0.96 },
    { si: 5, x0: -35, x1: -65, w: 26, h: 3, a: 0.04, b: 0.96 },
    { si: 6, x0: -65, x1: -100, w: 26, h: 3, a: 0, b: 0.78, pores: true },
  ];
  const VIS = [
    ['ghose', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'section'],
    ['ghose', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'section', 'card'],
    ['ghose', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'section', 'card'],
    ['ghose', 'bead', 'pool', 'arc', 'rod', 'tigT', 'section', 'card'],
    ['ghose', 'haz', 'heat', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'travel', 'section', 'card'],
    ['ghose', 'haz', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'section'],
    ['ghose', 'haz', 'bead', 'pores', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'flow', 'section'],
  ];

  // the note cards of the scenes: rows [beat, text, 'code' or '']
  function cards(si, u) {
    const at0 = (rows, tag, x = 336, w = 288) => noteCard(x, 60, w, tag, rows, si, u);
    if (si === 1) return at0([[1, tr('12 – 18 L/min', '12 – 18 L/min'), 'code'], [2, tr('knettert gelijkmatig', 'crackles steadily')], [3, tr('ploppen en spatten', 'popping and spatter')]], tr('beschermgas', 'shielding gas'));
    if (si === 2) return at0([[0, tr('draad 0,8 – 1,2 mm', 'wire 0.8 – 1.2 mm')], [1, tr('MAG: staal', 'MAG: steel')], [1, tr('82% Ar + 18% CO₂', '82% Ar + 18% CO₂'), 'code'], [3, tr('MIG: aluminium', 'MIG: aluminium')], [3, tr('zuiver argon', 'pure argon')]], tr('MIG/MAG', 'MIG/MAG'));
    if (si === 3) return at0([[0, tr('wolfraam: 3.400 °C', 'tungsten: 3,400 °C')], [1, tr('zuiver argon', 'pure argon')], [1, tr('voetpedaal', 'foot pedal')], [2, tr('3 tot 5 × langzamer', '3 to 5 × slower')]], tr('TIG', 'TIG'));
    if (si === 4) return at0([[0, tr('V × A × 60', 'V × A × 60'), 'code'], [0, tr('lassnelheid × 1.000', 'travel speed × 1,000'), 'code'], [0, tr('= kJ per mm las', '= kJ per mm of weld')], [2, tr('MAG: × 0,8', 'MAG: × 0.8'), 'code'], [2, tr('TIG: × 0,6', 'TIG: × 0.6'), 'code']], tr('warmte', 'heat'));
    return '';
  }

  function render(si, u) {
    scene(si, VIS[si]);
    const B = C.B[si];
    const bi = beatOf(si, u);
    const o = { torch: si === 3 ? 'tig' : 'mag' };
    if (si === 0) o.arcOn = u > B[2] - 0.001;
    if (si === 1) o.gasAmount = bi === 0 ? 0.15 : 1; // beat 1: no gas, the air gets in
    if (si === 6) {
      const flow = lerp(C.GAS.normal, C.GAS.kinked, span(u, B[0] + 0.02, B[0] + 0.5 * (B[1] - B[0])));
      o.kink = span(u, B[0], B[0] + 0.35 * (B[1] - B[0]));
      o.gasAmount = flow / C.GAS.normal;
      if (u > B[2] + 0.04) o.arcOn = false; // the sensor trips below 10 L/min (the fix)
      set(E.flowBall, `<circle class="fp-drop" cx="${fx}" cy="${f1(flowY(flow) - 8)}" r="8"/>`);
    }
    const { cam: cm, tip, clockS } = bench(RUNS, si, u, o);
    set(E.card, cards(si, u));

    if (si === 4) {
      // heat around the pool, the travel speed arrow, then the zone beside the weld
      const hp = span(u, B[2] - 0.01, B[2] + 0.05);
      set(E.heat, hp > 0 ? `<g style="opacity:${hp.toFixed(2)}"><path class="fp-iso" d="${ellipseTop(tip + 4, 0, 14, 11, PT + 0.2, 0.8)}"/><path class="fp-iso" d="${ellipseTop(tip + 7, 0, 22, 17, PT + 0.2, 1)}"/></g>` : '');
      const a0 = at([tip - 8, 34, PT]);
      const a1 = at([tip - 38, 34, PT]);
      const lp = at([tip - 23, 46, PT]);
      set(E.travel, mark(pth([a0, a1])) + mark(arrowHead(a0, a1, 9)) + label(lp[0], lp[1], 'v', 22));
      op(E.travel, span(u, B[1] - 0.01, B[1] + 0.04) * (1 - span(u, B[2] - 0.01, B[2] + 0.04)));
      op(E.haz, span(u, B[3], B[3] + 0.06));
    }
    // the tour camera of scene 1 is in C.CAM; the machine shows 24 V and 220 A throughout
  }
  return { render };
})();
