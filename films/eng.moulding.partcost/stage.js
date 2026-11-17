  // ------------------------------------------------------------ the film "Wat een spuitgietproduct kost / What a moulded part costs" (lesson eng.moulding.partcost)
  // Scenes: 1 what one cap costs, 2 the four items, 3 good parts per hour, 4 mould and scrap, 5 what to weigh, 6 the set-up of
  // the example, 7 material and mould, 8 the answer. Coins: one coin is one cent; material 8, machine 15, mould 8.
  const CARD = { x: 14, y: 60, w: 330 };
  const [CM, CMA, CMO] = C.CENTS;
  // the labels of the stacks: the cost of each line above its stack; vis: which stacks are labelled
  function coinLabels(n, vis) {
    const out = [];
    C.STACKS.forEach(([x, y], s) => {
      if (!n[s] || !vis[s]) return;
      const [hx, hy] = toHud([x, y, n[s] * C.COIN_H + (s === 0 ? 3 : 0) + 4]);
      out.push(text(hx, hy - 12, `€ ${num(C.COST[s], 3)}`, 22));
    });
    return out.join('');
  }

  function render(si, u) {
    const B = C.B[si];
    const bi = beatOf(si, u);
    const grow = (c, a, b) => Math.round(c * lin(u, a, b));
    if (si === 0) {
      // an empty base with the scale and the cap: what does one cap cost?
      scene(si, ['coinset'], []);
      camera(si, u);
      coinStacks([0, 0, 0], 0);
    } else if (si === 1) {
      // the four items: material, machine, mould and the rest
      scene(si, ['coinset'], ['card']);
      camera(si, u);
      coinStacks([CM, CMA, CMO], 0);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('vier posten', 'four items', 296), [
        [0, tr('materiaal + afkeur', 'material + scrap', 296)],
        [1, tr('machine: tarief per stuk', 'machine: rate per part', 296)],
        [2, tr('matrijs: over de stuks', 'mould: over the parts', 296)],
        [3, tr('de rest: verpakking, enz.', 'the rest: packing, etc.', 296)],
      ], si, u));
    } else if (si === 2) {
      // good parts per hour hide the cycle time; a small part is paid for in machine time, a heavy crate in material
      scene(si, ['coinset'], ['card']);
      camera(si, u);
      coinStacks(bi < 3 ? [CM, CMA, CMO] : [CM * 2 + 2, Math.round(CMA / 3), CMO - 4], 0);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('goede stuks per uur', 'good parts per hour', 296), [
        [0, `3600 / ${tr('cyclus', 'cycle', 296)}`, 'code'],
        [0, `× ${tr('holtes', 'cavities', 296)} × ${tr('rendement', 'efficiency', 296)}`, 'code', 0.4],
        [1, tr('rendement, bijv. 85 %', 'efficiency, e.g. 85 %', 296)],
        [2, tr('klein: machine groot', 'small: machine big', 296)],
        [3, tr('zwaar krat: materiaal', 'heavy crate: material', 296)],
      ], si, u));
    } else if (si === 3) {
      // the mould is spread over an agreed number of parts; scrap counts twice
      scene(si, ['coinset'], ['card']);
      camera(si, u);
      coinStacks([CM, CMA, CMO], bi === 2 ? span(u, B[2] + 0.04, B[2] + 0.14) : 0);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('matrijs en afkeur', 'mould and scrap', 296), [
        [0, tr('afgesproken aantal stuks', 'an agreed number of parts', 296)],
        [0, tr('of de klant betaalt apart', 'or the customer pays apart', 296), '', 0.5],
        [1, tr('volume valt tegen: verlies', 'low volume: a loss', 296)],
        [2, tr('afkeur: materiaal + perstijd', 'scrap: material + time', 296)],
        [2, tr('3 % afkeur = 3 % duurder', '3 % scrap = 3 % dearer', 296), '', 0.5],
      ], si, u));
    } else if (si === 4) {
      // what to weigh, and the questions that sound credible
      scene(si, ['coinset'], ['card']);
      camera(si, u);
      coinStacks([CM, CMA, CMO], 0);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('wat weeg je', 'what to weigh', 296), [
        [0, tr('een seconde cyclus', 'a second of cycle', 296)],
        [0, tr('een gram materiaal', 'a gram of material', 296), '', 0.25],
        [0, tr('een goedkoper type', 'a cheaper grade', 296), '', 0.5],
        [0, tr('minder holtes', 'fewer cavities', 296), '', 0.75],
        [1, tr('Cyclus en rendement?', 'Cycle and efficiency?', 296)],
        [1, tr('Matrijs in de prijs?', 'Mould in the price?', 296), '', 0.35],
        [1, tr('Welk volume = verlies?', 'What volume = loss?', 296), '', 0.7],
      ], si, u));
    } else if (si === 5) {
      // the set-up of the example
      scene(si, ['coinset'], ['card']);
      camera(si, u);
      coinStacks([0, 0, 0], 0);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('voorbeeld', 'example', 296), [
        [0, tr('PP-product van 40 g', 'PP part of 40 g', 296)],
        [0, tr('4 holtes, cyclus 30 s', '4 cavities, cycle 30 s', 296), '', 0.5],
        [1, tr('PP € ', 'PP €', 296) + num(2, 2) + tr(' per kg', ' per kg', 296)],
        [1, tr('3 % afkeur', '3 % scrap', 296), '', 0.2],
        [1, tr('rendement 85 %', 'efficiency 85 %', 296), '', 0.4],
        [1, tr('uurtarief € 60', 'hourly rate €60', 296), '', 0.5],
        [1, tr('matrijs € ', 'mould €', 296) + big(80000) + tr(' / 1 mln', ' / 1 m', 296), '', 0.75],
      ], si, u));
    } else if (si === 6) {
      // material and mould, as coins
      scene(si, ['coinset'], ['labels']);
      camera(si, u);
      const n = [grow(CM, B[0] + 0.03, B[0] + 0.45), 0, grow(CMO, B[1] + 0.03, B[1] + 0.45)];
      const sliver = span(u, B[0] + 0.5, B[0] + 0.62);
      coinStacks(n, sliver);
      set(E.labels, coinLabels(n, [u > B[0] + 0.45, false, u > B[1] + 0.45]));
    } else if (si === 7) {
      // the answer: the machine, the total, and the biggest item
      scene(si, ['coinset'], ['labels']);
      camera(si, u);
      const n = [CM, bi >= 1 ? grow(CMA, B[1] + 0.03, B[1] + 0.4) : 0, CMO];
      coinStacks(n, 1);
      let out = coinLabels(n, [true, bi >= 1 && lin(u, B[1] + 0.4, B[1] + 0.45) > 0, true]);
      if (bi >= 2) {
        const [hx, hy] = toHud([C.STACKS[1][0], 0, CMA * C.COIN_H + 30]);
        out += `<g opacity="${lin(u, B[2], B[2] + 0.06).toFixed(2)}">${text(hx, hy - 40, `≈ € ${num(C.COST[0] + C.COST[1] + C.COST[2], 2)}`, 26)}</g>`;
      }
      set(E.labels, out);
    }
  }
  return { render };
})();
