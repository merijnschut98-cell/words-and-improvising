  // ------------------------------------------------------------ the film "Meer holtes of een snellere cyclus / More cavities or a faster cycle" (lesson eng.moulding.cavities)
  // Scenes: 1 a 4-cavity mould, 2 more cavities, 3 fill balance, 4 hot runner and valve gate, 5 family mould and risk,
  // 6 the two options (A and B), 7 the answer.
  const CARD = { x: 14, y: 60, w: 330 };
  const wpx = 5;
  // which plate shows: 4 cavities or 8; the 8-cavity plate shows its cavities or the family mould's two
  function plateShow(four, family) {
    show(E.plate4, four);
    show(E.plate8, !four);
    show(E.pk8, !four && !family);
    show(E.pkF, !four && family);
  }
  // the fill order of the family mould: the lid fills well before the base
  function familyFill(q) {
    const { lid, base } = C.FAM;
    const runL = [[0, 0], [lid.x + lid.w, 0]];
    const runB = [[0, 0], [base.x, 0]];
    const fl = lin(q, 0.15, 0.55);
    const fb = lin(q, 0.18, 0.95);
    const grow = (p, f, fromRight) => {
      if (f <= 0.01) return '';
      const w = p.w * f;
      const plan = { x: fromRight ? p.x + p.w - w : p.x, y: p.y, w, d: p.d, r: Math.min(p.r, w / 2) };
      return `<path class="fp-pool" d="${planOutline(plan, C.PZ + 0.1, P, 4)}"/>`;
    };
    return meltPath(runL, lengthOf(runL) * lin(q, 0, 0.15), wpx) + meltPath(runB, lengthOf(runB) * lin(q, 0, 0.18), wpx) + grow(lid, fl, true) + grow(base, fb, false);
  }
  // a cross over a cavity that is shut
  const cross = (x, y) => `<path class="fp-bad" d="${onTop([[x - 11, y - 11], [x + 11, y + 11]], C.PZ + 0.2, P)}${onTop([[x - 11, y + 11], [x + 11, y - 11]], C.PZ + 0.2, P)}"/>`;
  const ring2 = (x, y, r) => `<path class="fp-bad" d="${ring(x, y, r, C.PZ + 0.2, P, 36)}"/>`;

  function render(si, u) {
    const B = C.B[si];
    const bi = beatOf(si, u);
    if (si === 0) {
      // four cavities fill through the H
      scene(si, ['plates'], []);
      camera(si, u);
      plateShow(true, false);
      set(E.melt, fillRun(C.RUN4, C.CAV4, lin(u, 0.08, 0.5), wpx));
      set(E.famcue, '');
      show(E.mani, false);
    } else if (si === 1) {
      // from four cavities to eight; the shot grows, the press grows, the price of the mould grows less
      scene(si, ['plates'], ['card']);
      camera(si, u);
      const swap = lin(u, 0.1, 0.2);
      show(E.plate4, swap < 1);
      show(E.plate8, swap > 0);
      show(E.pk8, true);
      show(E.pkF, false);
      fade(E.plate4, 1 - swap);
      fade(E.plate8, swap);
      set(E.melt, u < 0.1 ? fillRun(C.RUN4, C.CAV4, lin(u, 0.01, 0.09), wpx) : fillRun(C.RUN8, C.CAV8, lin(u, 0.22, B[1] - 0.04), wpx));
      set(E.famcue, '');
      show(E.mani, false);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('meer holtes', 'more cavities', 296), [
        [0, tr('groter shot: langer vullen', 'bigger shot: longer fill', 296)],
        [0, tr('grotere pers, hoger tarief', 'bigger press, higher rate', 296), '', 0.45],
        [1, tr('matrijs: minder dan lineair', 'mould: not in step', 296)],
        [1, tr('vergelijk kosten per stuk', 'compare cost per part', 296), '', 0.45],
      ], si, u));
    } else if (si === 2) {
      // balanced: every flow path is as long; unbalanced: the first cavity packs and flashes, the last is short
      scene(si, ['plates'], ['card']);
      camera(si, u);
      plateShow(false, false);
      show(E.mani, false);
      set(E.famcue, '');
      if (bi === 0) set(E.melt, fillRun(C.RUN8, C.CAV8, lin(u, 0.05, B[1] - 0.04), wpx));
      else {
        const q = lin(u, B[1] + 0.02, B[1] + 0.3);
        const order = C.CAV8.map(([x, y], i) => ({ i, x, y })).sort((a, b) => a.x - b.x || a.y - b.y);
        const share = (i) => { const r = order.findIndex((o) => o.i === i); return r === 0 ? 1.12 : r === 7 ? 0.62 : 1 - r * 0.03; };
        const runs = C.RUN8.map((r) => meltPath(r, lengthOf(r), wpx)).join('');
        let pools = '';
        let marks = '';
        C.CAV8.forEach(([x, y], i) => {
          const s = share(i);
          pools += pool(x, y, (C.POCKET_R - 1) * Math.min(s, 1) * Math.sqrt(q));
          if (s > 1 && q > 0.8) marks += ring2(x, y, C.POCKET_R + 2);
        });
        set(E.melt, runs + pools + marks);
      }
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('vulbalans', 'fill balance', 296), [
        [0, tr('elke holte even lang vol', 'every cavity fills alike', 296)],
        [1, tr('eerste vol: braam', 'first full: flash', 296)],
        [1, tr('laatste: onvolledig', 'last one: short', 296), '', 0.35],
        [1, tr('weeg per holte', 'weigh per cavity', 296), '', 0.7],
      ], si, u));
    } else if (si === 3) {
      // the hot runner keeps the melt molten; the valve gates open one after the other
      scene(si, ['plates'], []);
      camera(si, u);
      plateShow(false, false);
      set(E.famcue, '');
      const q = lin(u, B[1] + 0.02, 0.97);
      const order = C.CAV8.map(([x, y], i) => ({ x, y, i })).sort((a, b) => a.x - b.x || a.y - b.y);
      const openAt = (i) => 0.1 + (order.findIndex((o) => o.i === i) / 8) * 0.55;
      set(E.melt, bi === 0 ? '' : C.CAV8.map(([x, y], i) => pool(x, y, (C.POCKET_R - 1) * Math.sqrt(lin(q, openAt(i), openAt(i) + 0.3)))).join(''));
      set(E.mani, manifold((x, y) => { if (bi === 0) return 0; const i = C.CAV8.findIndex((c) => c[0] === x && c[1] === y); return span(q, openAt(i) - 0.06, openAt(i)) * (1 - span(q, openAt(i) + 0.32, openAt(i) + 0.4)); }));
      show(E.mani, true);
      fade(E.mani, lin(u, 0, 0.05));
    } else if (si === 4) {
      // the family mould: lid and base fill unevenly; then a cavity of the eight is shut
      scene(si, ['plates'], ['card']);
      camera(si, u);
      show(E.mani, false);
      if (bi === 0) {
        plateShow(false, true);
        set(E.melt, '');
        set(E.famcue, familyFill(lin(u, 0.03, B[1] - 0.03)));
      } else {
        plateShow(false, false);
        set(E.famcue, '');
        const [cx, cy] = C.CAV8[3];
        set(E.melt, C.CAV8.map(([x, y]) => (x === cx && y === cy ? '' : pool(x, y, C.POCKET_R - 1))).join('') + cross(cx, cy));
      }
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('familiematrijs', 'family mould', 296), [
        [0, tr('deksel en bak, één shot', 'lid and base, one shot', 296)],
        [0, tr('ze vullen zelden gelijk', 'they rarely fill alike', 296), '', 0.45],
        [1, tr('meer holtes, meer risico', 'more cavities, more risk', 296)],
        [1, tr('1 van 8 dicht: 7/8 output', '1 of 8 shut: 7/8 output', 296), '', 0.5],
      ], si, u));
    } else if (si === 5) {
      // the two options: A on four cavities, B on eight
      scene(si, ['plates'], ['card']);
      camera(si, u);
      show(E.mani, false);
      set(E.famcue, '');
      const four = bi === 0 || bi === 2;
      plateShow(four, false);
      set(E.melt, four ? fillRun(C.RUN4, C.CAV4, lin(u, B[bi] + 0.02, B[bi + 1] - 0.03), wpx) : fillRun(C.RUN8, C.CAV8, lin(u, B[bi] + 0.02, B[bi + 1] - 0.03), wpx));
      set(E.card, bi < 2
        ? cardSvg(CARD.x, CARD.y, CARD.w, tr('voorbeeld', 'example', 296), [
          [0, tr('2 miljoen doppen per jaar', '2 million caps a year', 296)],
          [0, tr('A: 4 holtes, 20 s', 'A: 4 cavities, 20 s', 296), '', 0.35],
          [0, tr('pers € 60 per uur', 'press €60 an hour', 296), '', 0.55],
          [0, tr('matrijs € ', 'mould €', 296) + big(80000), '', 0.75],
          [1, tr('B: 8 holtes, 24 s', 'B: 8 cavities, 24 s', 296)],
          [1, tr('pers € 75 per uur', 'press €75 an hour', 296), '', 0.3],
          [1, tr('matrijs € ', 'mould €', 296) + big(140000), '', 0.55],
        ], si, u)
        : cardSvg(CARD.x, CARD.y, CARD.w, tr('uitkomst', 'result', 296), [
          [2, `A  3600 / 20 × 4 = 720`, 'code'],
          [2, `${big(2000000)} / 720 ≈ ${big(2778)} ${tr('uur', 'h', 296)}`, 'code', 0.3],
          [2, `≈ € ${big(166700)} / ${tr('jaar', 'year', 296)}`, '', 0.6],
          [3, `B  3600 / 24 × 8 = ${big(1200)}`, 'code'],
        ], si, u));
    } else if (si === 6) {
      // the answer: what B costs, and the payback of the extra mould
      scene(si, ['plates'], ['card']);
      camera(si, u);
      show(E.mani, false);
      set(E.famcue, '');
      plateShow(false, false);
      set(E.melt, fillRun(C.RUN8, C.CAV8, lin(u, 0.04, 0.5), wpx));
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('antwoord', 'answer', 296), [
        [0, tr('B: kosten? terugverdiend?', 'B: cost? payback?', 296)],
        [1, `${big(2000000)} / ${big(1200)} ≈ ${big(1667)} ${tr('uur', 'h', 296)}`, 'code'],
        [1, `× € 75 = € ${big(125000)}`, 'code', 0.3],
        [1, `€ ${big(41700)} ${tr('minder dan A', 'less than A', 296)}`, '', 0.6],
        [2, `${big(60000)} / ${big(41700)} ≈ ${num(1.4, 1)} ${tr('jaar', 'years', 296)}`, 'code'],
        [2, tr('zo’n 17 maanden', 'about 17 months', 296), '', 0.4],
        [3, tr('kwart volume: bijna 6 jaar', '¼ volume: nearly 6 years', 296)],
      ], si, u));
    }
  }
  return { render };
})();
