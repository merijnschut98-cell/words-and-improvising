  // ------------------------------------------------------------ the film "Koelen: wat de insteller kan veranderen / Cooling: what the setter can change" (lesson eng.moulding.cooling)
  // Scenes: 1 a cap cools, 2 the ejection temperature, 3 the mould temperature, 4 the flow of the water, 5 the check, 6 the
  // steps of the cooling time, 7 the setting. The part is the cap's wall at 2,4 mm.
  const WALL = C.SWALL * 0.8;
  const CARD = { x: 14, y: 60, w: 330 };
  // the water in and out of the mould, as two bars: the difference is a few degrees, or a lot
  function waterBars(diff) {
    const x = 14;
    const y = 60;
    const w = 330;
    const x0 = x + 150;
    const bar = (yy, len) => `<path class="fp-meter-bg" d="M${x0} ${yy}h${f1(190)}v14h${-190}z"/><path class="fp-meter-fill" d="M${x0} ${yy}h${f1(len)}v14h${f1(-len)}z"/>${mark(`M${x0} ${yy}h${f1(190)}v14h${-190}z`)}`;
    return panelD(x, y, w, 108) + text(x + 16, y + 28, tr('water', 'water'), 22, 'start', 'fp-ink fp-dim')
      + text(x + 16, y + 62, tr('erin', 'in'), 22, 'start') + bar(y + 48, 70)
      + text(x + 16, y + 94, tr('eruit', 'out'), 22, 'start') + bar(y + 80, 70 + diff);
  }

  function render(si, u) {
    const B = C.B[si];
    const clock = u * C.dur[si];
    if (si === 0) {
      // a cap cools in the mould, the water carries the heat away
      scene(si, ['section'], []);
      camera(si, u);
      section(WALL, false, (WALL / 2) * Math.sqrt(lin(u, 0.04, 0.9)), clock, false);
      bossDims(WALL, false);
    } else if (si === 1) {
      // the part cools to the ejection temperature; three things decide how fast it gets there
      scene(si, ['section'], ['therm', 'thmark', 'card']);
      camera(si, u);
      const q = lin(u, 0.04, 0.88);
      section(WALL, false, (WALL / 2) * Math.sqrt(q), clock, false);
      bossDims(WALL, false);
      thermometer(lerp(0.95, TH.mark, Math.pow(q, 0.7)));
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('wat bepaalt de snelheid', 'what sets the speed', 296), [
        [1, tr('wanddikte, in het kwadraat', 'wall thickness, squared', 296)],
        [1, tr('matrijstemperatuur', 'mould temperature', 296), '', 0.25],
        [1, tr('de afvoer door water', 'heat taken by water', 296), '', 0.5],
        [1, tr('insteller: de laatste twee', 'setter: the last two', 296), '', 0.75],
      ], si, u));
    } else if (si === 2) {
      // the temperature control unit pumps water through the channels; colder steel is quicker, but not free
      scene(si, ['section'], ['card'], true);
      camera(si, u);
      const q = lin(u, 0.04, 0.9);
      section(WALL, false, (WALL / 2) * Math.sqrt(q), clock, true);
      bossDims(WALL, false);
      set(E.card, cardSvg(CARD.x, CARD.y, 290, tr('te koud', 'too cold', 256), [
        [1, tr('kouder is sneller', 'colder is quicker', 256)],
        [1, tr('maar niet gratis', 'but not free', 256), '', 0.4],
        [1, tr('dof oppervlak', 'dull surface', 256), '', 0.55],
        [1, tr('vloeilijnen', 'flow lines', 256), '', 0.68],
        [1, tr('ingevroren spanning', 'frozen-in stress', 256), '', 0.8],
        [2, tr('PA krimpt later na', 'PA shrinks later', 256)],
        [2, tr('PA6: 80 °C', 'PA6: 80 °C', 256), '', 0.5],
      ], si, u));
    } else if (si === 3) {
      // water in a channel under a magnifier: layers, then swirls; limescale insulates
      scene(si, ['section'], ['mag']);
      camera(si, u);
      const q = lin(u, 0.04, 0.9);
      section(WALL, false, (WALL / 2) * Math.sqrt(q), clock, u > B[0] + 0.45 * (B[1] - B[0]));
      bossDims(WALL, false);
      magnifier(u > B[0] + 0.45 * (B[1] - B[0]), clock, span(u, B[1] + 0.04, B[1] + 0.18));
    } else if (si === 4) {
      // the water leaves a few degrees warmer; a large difference means too little flow; hot spots set the cycle
      scene(si, ['section'], ['labels']);
      camera(si, u);
      const q = lin(u, 0.04, 0.9);
      section(WALL, false, (WALL / 2) * Math.sqrt(q), clock, false, span(u, B[1], B[1] + 0.1));
      bossDims(WALL, false);
      const diff = 14 + 90 * span(u, B[0] + 0.5 * (B[1] - B[0]), B[0] + 0.62 * (B[1] - B[0]));
      set(E.labels, u < B[1] ? waterBars(diff) : '');
    } else if (si === 5) {
      // the cooling time in steps of a second, the critical size measured after each step
      scene(si, ['section'], ['card']);
      camera(si, u);
      section(WALL, false, (WALL / 2) * Math.sqrt(lin(u, 0.04, 0.9)), clock, false);
      bossDims(WALL, false);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('stap voor stap', 'step by step', 296), [
        [0, tr('1 s korter per stap', '1 s shorter per step', 296)],
        [0, tr('meet de kritische maat', 'measure the critical size', 296), '', 0.4],
        [1, tr('4 holtes, 24 s, koelen 14 s', '4 cavities, 24 s, cool 14 s', 296)],
        [1, '3600 / 24 × 4 = 600', 'code', 0.4],
        [2, tr('na 24 uur gemeten', 'measured after 24 hours', 296)],
        [2, tr('11 s: alles goed', '11 s: all good', 296), '', 0.3],
        [2, tr('10 s: buiten tolerantie', '10 s: out of tolerance', 296), '', 0.6],
      ], si, u));
    } else if (si === 6) {
      // the last good step plus a small margin is set; the cycle and the output follow
      scene(si, ['section'], ['card']);
      camera(si, u);
      section(WALL, false, (WALL / 2) * Math.sqrt(lin(u, 0.04, 0.9)), clock, false);
      bossDims(WALL, false);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('de instelling', 'the setting', 296), [
        [0, tr('laatste goede stap + marge', 'last good step + margin', 296)],
        [0, tr('vastleggen, met de reden', 'record it, with the reason', 296), '', 0.4],
        [1, tr('koelen 11,5 s', 'cooling 11.5 s', 296)],
        [1, `24 − ${num(2.5, 1)} = ${num(21.5, 1)} s`, 'code', 0.4],
        [2, `3600 / ${num(21.5, 1)} × 4 ≈ 670`, 'code'],
        [2, tr('zo’n 12 % meer', 'about 12 % more', 296), '', 0.4],
      ], si, u));
    }
  }
  return { render };
})();
