  // ------------------------------------------------------------ the film "Lasparameters: draad, spanning en snelheid / Welding parameters" (lesson eng.joining.weldparams)
  // Scenes: 1 four knobs, 2 metal transfer, 3 heat input, 4 deposition rate, 5 a fillet weld (the worked example).
  const RUNS = [
    { si: 0, x0: XE, x1: 60, w: 26, h: 3, a: 0.05, b: 0.96 },
    { si: 1, x0: 60, x1: 20, w: 20, h: 2, a: 0.03, b: 0.97 },
    { si: 2, x0: 20, x1: -20, w: 26, h: 3, a: 0.03, b: 0.97 },
    { si: 3, x0: -20, x1: -60, w: 26, h: 3, a: 0.03, b: 0.97 },
    { si: 4, x0: -60, x1: -100, w: 26, h: 3, a: 0.03, b: 0.97 },
  ];
  const VIS = [
    ['ghose', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'section', 'dial', 'card'],
    ['ghose', 'bead', 'pool', 'cable', 'arc', 'wire', 'magT', 'section', 'dial', 'mag'],
    ['ghose', 'haz', 'heat', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'travel', 'section', 'card'],
    ['ghose', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'section', 'card'],
    ['ghose', 'haz', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'travel', 'section', 'card'],
  ];

  // the note cards of the scenes: rows [beat, text, 'code' or '']
  function cards(si, u) {
    const at0 = (rows, tag, keep = 0, x = 336, w = 288) => noteCard(x, 60, w, tag, rows, si, u, keep);
    if (si === 0) return at0([[1, tr('10 – 20 mm', '10 – 20 mm'), 'code'], [2, tr('draad ↑ = stroom ↑', 'wire ↑ = current ↑')], [3, tr('spanning ↑ = boog ↑', 'voltage ↑ = arc ↑')]], tr('vrije draadlengte', 'stick-out'), 0);
    if (si === 2) return at0([[0, tr('× 0,8 MAG', '× 0.8 MAG'), 'code'], [0, tr('× 0,6 TIG', '× 0.6 TIG'), 'code'], [1, tr('lassnelheid ÷ 2', 'travel speed ÷ 2')], [1, tr('warmte-inbreng × 2', 'heat input × 2')], [2, tr('bereik in de lasmethode', 'range in the procedure')], [3, tr('lange kabels: verlies', 'long cables: losses')]], tr('warmte-inbreng', 'heat input'), 2);
    if (si === 3) return at0([[1, tr('doorsnede π/4 × d²', 'wire area π/4 × d²'), 'code'], [1, tr('× draadsnelheid', '× wire feed speed')], [1, tr('× 7,85 g/cm³', '× 7.85 g/cm³'), 'code'], [1, tr('− een paar % spatten', '− a few % spatter')], [3, tr('meer kilo’s = meer tijd', 'more kilos = more time')]], tr('neersmelt', 'deposition'), 2);
    if (si === 4) return at0([[1, tr('1,13 mm² × 10 m/min', '1.13 mm² × 10 m/min'), 'code'], [1, tr('= 11,3 cm³ per min', '= 11.3 cm³ a min'), 'code'], [1, tr('× 7,85 = 89 g', '× 7.85 = 89 g'), 'code'], [2, tr('= 5,3 kg/h', '= 5.3 kg/h'), 'code'], [2, tr('5 kg/h na spatten', '5 kg/h after spatter'), 'code'], [2, tr('83 g per min', '83 g a min'), 'code'], [3, tr('a5 = 25 cm³ per m', 'a5 = 25 cm³ a m'), 'code'], [3, tr('= 196 g per m', '= 196 g a m'), 'code'], [4, tr('196 / 83 = 2,4 min/m', '196 / 83 = 2.4 min/m'), 'code'], [4, tr('≈ 420 mm/min', '≈ 420 mm/min'), 'code']], tr('hoeklas a5', 'fillet a5'), 2, 332, 296);
    return '';
  }

  function render(si, u) {
    scene(si, VIS[si]);
    const B = C.B[si];
    const bi = beatOf(si, u);
    let wfs = 10;
    let volts = si >= 2 ? '29' : '24'; // after the voltage scene the machine stays at 29 V, 10 m/min and 300 A (as the example)
    if (si === 0) {
      wfs = bi < 2 ? 6 : lerp(6, 12, span(u, B[2] + 0.02, B[3] - 0.02));
      volts = bi < 3 ? '24' : String(Math.round(lerp(24, 29, span(u, B[3] + 0.02, B[4] - 0.03))));
    } else if (si === 1) {
      wfs = bi < 3 ? 4 + 2 * span(u, B[1], B[2]) : 6 + 4 * span(u, B[3], B[3] + 0.06);
      volts = wfs < 7.5 ? '20' : '29';
    } else if (si === 4) volts = '29';
    const amps = String(Math.round(70 + 23 * wfs));
    const o = { wfs, volts, amps };
    const { cam: cm, tip, clockS } = bench(RUNS, si, u, o);
    set(E.card, cards(si, u));
    if (si === 0 || si === 1) dialSvg(wfs);
    if (si === 1) {
      const spray = wfs >= 7.5;
      set(E.magBase, magBase(clockS));
      set(E.magShort, spray ? '' : magShort(clockS));
      set(E.magSpray, spray ? magSpray(clockS) : '');
      const [tx, ty] = toHud([tip, 0, PT + 4], cm);
      const ang = Math.atan2(ty - my, tx - mx);
      set(E.magLead, `<path class="fp-mark" d="M${f1(tx)} ${f1(ty)}L${f1(mx + Math.cos(ang) * MR)} ${f1(my + Math.sin(ang) * MR)}"/>`);
    }
    if (si === 2) {
      const hp = span(u, B[0], B[0] + 0.05);
      set(E.heat, `<g style="opacity:${hp.toFixed(2)}"><path class="fp-iso" d="${ellipseTop(tip + 4, 0, 14, 11, PT + 0.2, 0.8)}"/><path class="fp-iso" d="${ellipseTop(tip + 7, 0, 22, 17, PT + 0.2, 1)}"/></g>`);
      const a0 = at([tip - 8, 34, PT]);
      const a1 = at([tip - 38, 34, PT]);
      const lp = at([tip - 23, 46, PT]);
      set(E.travel, mark(pth([a0, a1])) + mark(arrowHead(a0, a1, 9)) + label(lp[0], lp[1], 'v', 22));
      op(E.travel, span(u, B[1] - 0.01, B[1] + 0.04) * (1 - span(u, B[2] - 0.01, B[2] + 0.04)));
      op(E.haz, span(u, B[0], B[0] + 0.06));
    }
    if (si === 4) {
      const a0 = at([tip - 8, 34, PT]);
      const a1 = at([tip - 38, 34, PT]);
      const lp = at([tip - 23, 46, PT]);
      set(E.travel, mark(pth([a0, a1])) + mark(arrowHead(a0, a1, 9)) + label(lp[0], lp[1], 'v', 22));
      op(E.travel, span(u, B[4], B[4] + 0.04));
    }
  }
  return { render };
})();
