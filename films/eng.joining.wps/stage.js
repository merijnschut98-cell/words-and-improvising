  // ------------------------------------------------------------ the film "Lassen op papier / Welding on paper" (lesson eng.joining.wps)
  // Scenes: 1 from recipe to proof (pLMB, tests, LMK, LMB), 2 the range of qualification, 3 the welder (ISO 9606-1),
  // 4 the welding coordinator, 5 the worked example (22 mm plate at 1,6 kJ/mm). The finished weld lies behind the
  // scrim; the papers are cards in front of it.
  const RUNS = [{ si: -1, x0: XE, x1: -100, w: 26, h: 3, a: 0, b: 1 }];
  const VIS = [
    ['bead', 'section', 'scrim', 'docs', 'card'],
    ['bead', 'section', 'scrim', 'docs', 'card'],
    ['bead', 'section', 'scrim', 'docs', 'card'],
    ['bead', 'section', 'scrim', 'docs', 'card'],
    ['bead', 'section', 'scrim', 'docs', 'card'],
  ];
  const L = (x, y, t, size = 22, anchor = 'start', cls = 'fp-label') => label(x, y, t, size, anchor, true, cls);
  const arrowR = (x0, x1, y) => mark(`M${x0} ${y}H${x1}`) + mark(arrowHead([x0, y], [x1, y], 8, true));
  const wpsAll = ['docA', 'docB', 'docEss', 'docRange', 'docHeat', 'docCert', 'docCoord'];

  // scene 1: pLMB, the tests, LMK, LMB, the shorter route
  function chain(u) {
    const B = C.B[0];
    const bi = beatOf(0, u);
    const t = (k, d = 0.05) => span(u, B[k], B[k] + d);
    set(E.docA, bi >= 1 ? `<g style="opacity:${t(1).toFixed(2)}">${card(14, 60, 190, 150)}${L(109, 104, tr('pLMB', 'pWPS'), 28, 'middle')}${rules(36, 136, 146, 3, 24)}</g>` : '');
    const k3 = span(u, B[3], B[3] + 0.05);
    const k4 = span(u, B[3] + 0.45 * (B[4] - B[3]), B[3] + 0.5 * (B[4] - B[3]));
    set(E.docB, bi >= 3 ? `<g style="opacity:${k3.toFixed(2)}">${arrowR(206, 223, 135)}${card(225, 60, 190, 150)}${L(320, 104, tr('LMK', 'WPQR'), 28, 'middle')}${check(320, 160, 1.4)}${L(320, 196, tr('testbewijs', 'test proof'), 22, 'middle', 'fp-label fp-dim')}</g>`
      + `<g style="opacity:${k4.toFixed(2)}">${arrowR(417, 434, 135)}${card(436, 60, 190, 150)}${L(531, 104, tr('LMB', 'WPS'), 28, 'middle')}${rules(458, 136, 146, 2, 24)}${L(531, 196, tr('ISO 15609-1', 'ISO 15609-1'), 22, 'middle', 'fp-label fp-dim')}</g>` : '');
    let low = '';
    if (bi === 2 || bi === 3) low = `<g style="opacity:${t(2).toFixed(2)}">${panelD(14, 226, 612, 118)}${L(30, 258, tr('ISO 15614-1', 'ISO 15614-1'), 22, 'start', 'fp-label fp-dim')}${L(30, 292, tr('visueel · NDO · trek-, buig- en macroproeven', 'visual · NDT · tensile, bend and macro tests', 570), 22)}${L(30, 326, tr('soms kerfslag en hardheid', 'sometimes impact and hardness', 570), 22)}</g>`;
    if (bi === 4) low = `<g style="opacity:${t(4).toFixed(2)}">${panelD(14, 226, 612, 82)}${L(30, 258, tr('licht werk: een kortere route', 'light work: a shorter route', 570), 22)}${L(30, 292, tr('ISO 15612', 'ISO 15612'), 22, 'start', 'fp-label fp-dim')}</g>`;
    set(E.docHeat, low);
    set(E.card, bi === 0 ? noteCard(150, 80, 340, tr('na het lassen', 'after welding'), [[0, tr('sterk genoeg?', 'strong enough?')], [0, tr('taai genoeg?', 'tough enough?')], [0, tr('niet volledig te meten', 'not fully measurable')]], 0, u) : '');
  }

  // scene 2: the essential variables and the ranges they get
  function ranges(u) {
    const B = C.B[1];
    const bi = beatOf(1, u);
    const rowsEss = [tr('proces', 'process'), tr('materiaalgroep', 'material group'), tr('toevoegmateriaal', 'filler'), tr('gas', 'gas'), tr('positie', 'position'), tr('dikte', 'thickness'), tr('voorwarmen', 'preheat')];
    const n = rowsEss.length;
    if (bi <= 1) {
      let out = panelD(14, 60, 300, 44 + n * ROWH) + L(30, 88, tr('essentiële variabelen', 'essential variables'), 22, 'start', 'fp-label fp-dim');
      rowsEss.slice(0, n).forEach((r, i) => { out += L(30, 88 + (i + 1) * ROWH, r); });
      set(E.docEss, out);
      const x0 = 352;
      const x1 = 600;
      set(E.docRange, bi === 0 ? '' : panelD(336, 60, 290, 150) + L(352, 90, tr('geldigheidsgebied', 'range'), 22, 'start', 'fp-label fp-dim')
        + `<rect class="fp-meter" x="${x0}" y="124" width="${x1 - x0}" height="16" rx="8"/><rect class="fp-fill" x="${x0 + 50}" y="124" width="140" height="16" rx="8"/><circle class="fp-drop" cx="${x0 + 100}" cy="132" r="7"/>`
        + L(x0 + 100, 168, tr('getest', 'tested'), 22, 'middle')
        + `<g style="opacity:${span(u, B[1] + 0.3 * (B[2] - B[1]), B[1] + 0.35 * (B[2] - B[1])).toFixed(2)}">${cross(x1 - 20, 132)}${L(352, 198, tr('nieuwe test nodig', 'new test needed'), 22)}</g>`);
      set(E.docHeat, '');
      return;
    }
    set(E.docEss, '');
    const bx = (v) => 40 + (v / 30) * 560;
    const cx = (p) => 320 + p * 560 * 0.5; // p in -1..1 around the test value
    if (bi === 2) {
      set(E.docRange, panelD(14, 60, 612, 200) + L(30, 94, tr('dikte (mm)', 'thickness (mm)'), 22, 'start', 'fp-label fp-dim')
        + `<rect class="fp-meter" x="40" y="150" width="560" height="16" rx="8"/><rect class="fp-fill" x="${f1(bx(3))}" y="150" width="${f1(bx(24) - bx(3))}" height="16" rx="8"/>`
        + `<circle class="fp-drop" cx="${f1(bx(12))}" cy="158" r="7"/>` + L(bx(3), 196, num(3), 22, 'middle') + L(bx(12), 196, num(12), 22, 'middle') + L(bx(24), 196, num(24), 22, 'middle')
        + L(bx(12), 130, tr('getest', 'tested'), 22, 'middle') + L(30, 236, tr('meerlagig: tot 2 × de proefdikte', 'multi-pass: up to 2 × the test', 570), 22));
      set(E.docHeat, '');
    } else if (bi === 3) {
      set(E.docRange, panelD(14, 60, 612, 220) + L(30, 94, tr('warmte-inbreng', 'heat input'), 22, 'start', 'fp-label fp-dim')
        + `<rect class="fp-meter" x="40" y="150" width="560" height="16" rx="8"/><rect class="fp-fill" x="${f1(cx(-0.5))}" y="150" width="${f1(cx(0.5) - cx(-0.5))}" height="16" rx="8"/>`
        + `<circle class="fp-drop" cx="${f1(cx(0))}" cy="158" r="7"/>` + L(cx(0), 130, tr('getest', 'tested'), 22, 'middle')
        + L(cx(-0.5), 196, tr('−25%', '−25%'), 22, 'middle') + L(cx(0.5), 196, tr('+25%', '+25%'), 22, 'middle')
        + L(cx(-0.5), 232, tr('hardheid', 'hardness'), 22, 'middle', 'fp-label fp-dim') + L(cx(0.5), 232, tr('kerfslag', 'impact'), 22, 'middle', 'fp-label fp-dim'));
      set(E.docHeat, '');
    }
  }

  // scene 3: the welder's certificate
  const seal = () => { let d = ''; for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU; d += `M${f1(66 + Math.cos(a) * 18)} ${f1(104 + Math.sin(a) * 18)}L${f1(66 + Math.cos(a) * 24)} ${f1(104 + Math.sin(a) * 24)}`; } return `<circle class="fp-mark" style="stroke-width:2" cx="66" cy="104" r="16"/><path class="fp-mark" d="${d}"/>`; };
  function welder(u) {
    set(E.docCert, `${card(14, 60, 300, 130)}${seal()}${L(104, 112, tr('ISO 9606-1', 'ISO 9606-1'), 26)}${rules(32, 148, 256, 2, 22)}`);
    const rows = [[0, tr('proces', 'process')], [0, tr('materiaalgroep', 'material group')], [0, tr('plaat of pijp', 'plate or pipe')], [0, tr('positie', 'position')], [0, tr('diktebereik', 'thickness range')],
      [1, tr('elke 6 maanden', 'every 6 months')], [1, tr('werkgever bevestigt', 'employer confirms')], [1, tr('of de examinator', 'or the examiner')],
      [2, tr('stil > 6 maanden:', 'idle > 6 months:')], [2, tr('vervalt', 'it lapses')], [2, tr('om de 2 of 3 jaar', 'every 2 or 3 years')], [2, tr('verlenging', 'revalidation')],
      [3, tr('lasrobot: operator', 'robot: operator')], [3, tr('ISO 14732', 'ISO 14732'), 'code']];
    set(E.card, noteCard(332, 60, 294, tr('bereik', 'range'), rows, 2, u, 1));
  }

  // scene 4: the welding coordinator
  function coordinator(u) {
    const bi = beatOf(3, u);
    const person = `<circle class="fp-card" cx="62" cy="108" r="16"/><path class="fp-card" d="M34 176C34 140 44 124 62 124C80 124 90 140 90 176Z"/>`;
    const board = `<rect class="fp-card" x="140" y="96" width="64" height="80" rx="4"/><rect class="fp-meter" x="158" y="88" width="28" height="12" rx="3"/>${check(158, 124, 0.7)}${check(158, 152, 0.7)}<path class="fp-rule" d="M172 124L194 124M172 152L194 152"/>`;
    set(E.docCoord, `${card(14, 60, 300, 130)}${person}${board}${L(224, 140, tr('LMB', 'WPS'), 26, 'start')}`);
    const rows = [[0, tr('LMB bij elke las', 'WPS for every weld')], [0, tr('wie welke las mag', 'who may weld what')], [0, tr('materiaal op de vloer', 'material on the floor')], [0, tr('toevoegmateriaal', 'filler')],
      [1, tr('EN 1090-2', 'EN 1090-2'), 'code'], [1, tr('verplicht vanaf EXC2', 'required from EXC2')], [1, tr('2e van 4 klassen', '2nd of 4 classes')],
      [2, tr('ziet er goed uit', 'looks good')], [2, tr('maar niet gedekt:', 'but not covered:')], [2, tr('afkeur bij audit', 'rejected in audit')],
      [3, tr('welke LMB?', 'which WPS?')], [3, tr('welke LMK erachter?', 'which WPQR behind it?')], [3, tr('wie mag hem maken?', 'who may make it?')]];
    set(E.card, noteCard(332, 60, 294, tr('lascoördinator', 'welding coordinator'), rows, 3, u, 1));
    let boxes = '';
    if (bi === 1) {
      for (let i = 0; i < 4; i++) {
        const on = i >= 1;
        boxes += `<rect class="fp-meter" x="${14 + i * 76}" y="226" width="68" height="44" rx="6" style="${on ? 'stroke:var(--fp-accent);stroke-width:3' : ''}"/>` + L(48 + i * 76, 256, tr('EXC' + (i + 1), 'EXC' + (i + 1)), 22, 'middle');
      }
    }
    set(E.docHeat, boxes);
  }

  // scene 5: the worked example
  function example(u) {
    const B = C.B[4];
    const bi = beatOf(4, u);
    const bx = (v) => 40 + (v / 30) * 560;
    const hx = (v) => 40 + ((v - 0.6) / 1.2) * 560;
    const facts = [[0, tr('S355 · 12 mm', 'S355 · 12 mm'), 'code'], [0, tr('MAG · 1,2 kJ/mm', 'MAG · 1.2 kJ/mm'), 'code'], [1, tr('kerfslag bij −20 °C', 'impact at −20 °C')], [1, tr('order: 22 mm', 'order: 22 mm'), 'code'], [1, tr('lassers: 1,6 kJ/mm', 'welders: 1.6 kJ/mm'), 'code']];
    set(E.card, bi <= 1 ? noteCard(166, 70, 308, tr('de LMK', 'the WPQR'), facts, 4, u, 1) : bi >= 6 ? noteCard(14, 60, 612, tr('de opties', 'the options'), [[6, tr('1  binnen 1,5 kJ/mm, lagenplan dat past', '1  within 1.5 kJ/mm, a fitting pass plan', 570), ''], [6, tr('2  nieuwe LMK, hogere warmte-inbreng', '2  a new WPQR, higher heat input', 570), ''], [6, tr('+ proefplaat en labtests: weken', '+ test plate and lab tests: weeks', 570), ''], [7, tr('kies op lagen en starttijd', 'choose by passes and start date', 570), '']], 4, u, 2) : '');
    if (bi >= 2 && bi <= 5) {
      let out = panelD(14, 60, 612, bi >= 3 ? 292 : 150);
      out += L(30, 92, tr('dikte (mm)', 'thickness (mm)'), 22, 'start', 'fp-label fp-dim');
      out += `<rect class="fp-meter" x="40" y="140" width="560" height="16" rx="8"/><rect class="fp-fill" x="${f1(bx(3))}" y="140" width="${f1(bx(24) - bx(3))}" height="16" rx="8"/><circle class="fp-drop" cx="${f1(bx(12))}" cy="148" r="7"/>`;
      out += L(bx(3), 186, num(3), 22, 'middle') + L(bx(12), 186, num(12), 22, 'middle') + L(bx(24), 186, num(24), 22, 'middle');
      out += `<path class="fp-mark" style="stroke-width:2.4" d="M${f1(bx(22))} 120L${f1(bx(22))} 132"/>` + L(bx(22), 114, num(22), 22, 'middle');
      if (bi >= 2) out += `<g style="opacity:${span(u, B[2] + 0.02, B[2] + 0.08).toFixed(2)}">${check(bx(22) + 42, 108, 0.9)}</g>`;
      if (bi >= 3) {
        const o = span(u, B[3], B[3] + 0.05).toFixed(2);
        out += `<g style="opacity:${o}">${L(30, 230, tr('warmte-inbreng (kJ/mm)', 'heat input (kJ/mm)'), 22, 'start', 'fp-label fp-dim')}`
          + `<rect class="fp-meter" x="40" y="268" width="560" height="16" rx="8"/><rect class="fp-fill" x="40" y="268" width="${f1(hx(1.5) - 40)}" height="16" rx="8"/><circle class="fp-drop" cx="${f1(hx(1.2))}" cy="276" r="7"/>`
          + L(hx(1.2), 314, num(1.2, 1), 22, 'middle') + L(hx(1.5), 340, num(1.5, 1), 22, 'middle') + `<path class="fp-mark" style="stroke-width:2.4" d="M${f1(hx(1.5))} 258L${f1(hx(1.5))} 294"/></g>`;
      }
      if (bi >= 4) {
        out += `<g style="opacity:${span(u, B[4], B[4] + 0.05).toFixed(2)}"><path class="fp-mark" style="stroke-width:2.4" d="M${f1(hx(1.6))} 258L${f1(hx(1.6))} 294"/>${L(hx(1.6) + 10, 250, num(1.6, 1), 22, 'start')}${bi >= 5 ? cross(hx(1.6) + 66, 244) : L(hx(1.6) + 60, 250, '?', 22, 'start')}</g>`;
      }
      set(E.docRange, out);
    } else set(E.docRange, '');
    set(E.docHeat, '');
  }

  let lastScene = -1;
  function render(si, u) {
    scene(si, VIS[si]);
    bench(RUNS, si, u, { torch: 'none', arcOn: false, hazOn: false });
    if (si !== lastScene) { lastScene = si; for (const k of wpsAll) set(E[k], ''); }
    if (si === 0) chain(u);
    else if (si === 1) { set(E.card, ''); ranges(u); } else if (si === 2) welder(u);
    else if (si === 3) coordinator(u);
    else example(u);
  }
  return { render };
})();
