  // ------------------------------------------------------------ the film "CNC: de basis / CNC basics" (lesson eng.machining.cnc)
  // Scenes: 1 what CNC is, 2 the axes, 3 G-code, 4 from model to control, 5 the zero point, 6 measuring the tools,
  // 7 a typing error, 8 starting carefully, 9 the first part, 10 questions for the engineer.
  const START_X = C.START[0];
  const START_Y = C.START[1];
  const ALL = ['sbk', 'slot', 'hole', 'g54', 'gauge', 'touch', 'lenDim', 'list', 'tab', 'counter', 'inset', 'stamp', 'card', 'axes', 'home'];
  const VIS = [
    [],
    ['card', 'axes'],
    ['list'],
    ['card'],
    ['g54', 'home'],
    ['lenDim', 'tab', 'card'],
    ['tab', 'inset'],
    ['sbk', 'touch'],
    ['slot', 'g54', 'gauge', 'counter', 'inset'],
    ['list', 'stamp', 'card'],
  ];

  // a small lathe: chuck, bar, tool, the axis Z along the spindle and X across the diameter
  function latheCard(si, u) {
    const x = 336;
    const y = 40;
    const w = 290;
    let out = panelD(x, y, w, 230) + label(x + 16, y + 28, tr('draaibank', 'lathe'), 22, 'start', true, 'fp-ink fp-label fp-dim');
    out += `<path class="fp-solidfill" d="M${x + 20} ${y + 70}h26v104h-26z"/><path class="fp-solidfill" d="M${x + 46} ${y + 88}h190v68h-190z"/>`;
    out += `<path class="fp-solidfill" d="M${x + 150} ${y + 88}l12 -26h14l-12 26z" style="stroke-width:1.6"/>`;
    out += mark(`M${x + 12} ${y + 122}H${x + w - 12}`, ' stroke-dasharray="10 5 2 5"');
    out += mark(`M${x + 54} ${y + 196}H${x + 226}`) + mark(arrowHead([x + 54, y + 196], [x + 226, y + 196], 8, true)) + label(x + 242, y + 204, tr('Z', 'Z'), 24, 'start', true);
    out += mark(`M${x + 262} ${y + 88}V${y + 156}`) + mark(arrowHead([x + 262, y + 88], [x + 262, y + 156], 8, true)) + mark(arrowHead([x + 262, y + 156], [x + 262, y + 88], 8, true)) + label(x + 262, y + 76, tr('X', 'X'), 24, 'middle', true);
    return out;
  }

  // the flow of a program: from the 3D model to the machine's control
  function modelFlow(si, u) {
    const B = C.B[si];
    const names = [tr('3D-model', '3D model'), tr('CAM', 'CAM'), tr('G-code', 'G-code'), tr('Besturing', 'Control')];
    const bi = beatOf(si, u);
    let out = '';
    names.forEach((n, i) => {
      const x = 14 + i * 154;
      out += boxSvg(x, 24, 134, 52, n, (bi === 0 && i < 3) || (bi === 1 && i === 3));
      if (i < 3) out += `<g style="opacity:${f1(clamp((u - B[0] - 0.02 - i * 0.05) / 0.05, 0, 1))}">${arrowH(x + 136, x + 152, 50)}</g>`;
    });
    out += `<g style="opacity:${f1(span(u, B[1], B[1] + 0.06))}">${label(320, 112, tr('Fanuc · Siemens · Heidenhain', 'Fanuc · Siemens · Heidenhain', 600), 22, 'middle', true)}</g>`;
    return out;
  }

  // a repair on the control that never goes back into the CAM file
  function fixFlow(si, u) {
    const B = C.B[si];
    let out = boxSvg(14, 24, 240, 52, tr('Fix op de besturing', 'Fix at the control'), beatOf(si, u) === 0);
    out += boxSvg(386, 24, 240, 52, tr('CAM-bestand', 'CAM file'), beatOf(si, u) === 1);
    out += arrowH(256, 384, 50, true);
    const k1 = span(u, B[1], B[1] + 0.06);
    out += `<g style="opacity:${f1(k1)}"><path class="fp-mark" d="M310 34l24 32M334 34l-24 32"/>${label(320, 112, tr('de oude fout keert terug', 'the old error returns'), 22, 'middle', true)}</g>`;
    return out;
  }

  function render(si, u) {
    scene(si, ALL, VIS[si]);
    camera(CAM[si], u, ...(CAMW[si] || []));
    const B = C.B[si];
    const clock = u * C.dur[si];
    let tool = 'mill';
    let tip = TOP + 40;
    let phase = 0;
    const rest = () => place([0, 0, TOP + 40], 'mill');

    if (si === 0) {
      tip = rest();
      phase = u > B[1] ? clock * 9 : 0;
    } else if (si === 1) {
      // the machine moves along X, then Y, then Z; the rotary axes turn
      const k1 = span(u, B[1], B[1] + 0.05);
      const t = span(u, B[1] + 0.03, B[2] - 0.03);
      const dx = 34 * Math.sin(span(t, 0, 0.34) * TAU);
      const dy = 26 * Math.sin(span(t, 0.34, 0.67) * TAU);
      const dz = 22 * Math.sin(span(t, 0.67, 1) * TAU);
      tip = place([dx, dy, TOP + 40 + dz], 'mill');
      set(E.axes, axesSvg(1, 1) + rotarySvg(span(u, B[2], B[2] + 0.08)));
      fade(E.axes, k1);
      set(E.card, u < B[1] ? latheCard(si, u) : '');
      fade(E.card, 1 - span(u, B[1] - 0.04, B[1]));
      phase = clock * 9;
    } else if (si === 2) {
      tip = rest();
      const bi = beatOf(si, u);
      set(E.cur, bi === 1 ? wordsHl((w) => /^G0[0-3]$/.test(w)) : bi === 2 ? wordsHl((w) => /^M0[368]$/.test(w)) : bi === 3 ? wordsHl((w) => /^[FST]\d+$/.test(w)) : '');
      fade(E.list, span(u, 0, 0.05));
      set(E.g54, '');
    } else if (si === 3) {
      tip = rest();
      set(E.card, modelFlow(si, u));
    } else if (si === 4) {
      // machine zero, then the probe finds the work zero
      tool = 'probe';
      const b1 = B[1];
      const b2 = B[2];
      const q = (i) => b1 + ((b2 - b1) * i) / 12;
      const frames = [
        [0, -10, 25, 210], [b1, -10, 25, 210], [q(0.8), -18, 0, 140],
        [q(1), -18, 0, 124], [q(2), -27, 0, 124], [q(2.6), -18, 0, 124], [q(3.4), -18, 0, 140],
        [q(4.2), -37, 66, 140], [q(5), -37, 66, 115], [q(6), -37, 55, 115], [q(6.6), -37, 64, 115], [q(7.4), -37, 64, 140],
        [q(8.4), -10, 25, 140], [q(10), -10, 25, 123], [q(11), -10, 25, 132], [b2 + 0.2, -10, 25, 150], [1, -10, 25, 165],
      ];
      const [x, y, zc] = kf(frames, u);
      tip = place([x, y, zc - 3], 'probe');
      const hits = [[q(2), [-27, 0, 124]], [q(6), [-37, 55, 115]], [q(10), [-10, 25, 123]]];
      let ring = '';
      for (const [uh, p] of hits) {
        const kk = (u - uh) / 0.06;
        if (kk < 0 || kk > 1) continue;
        const [sx, sy] = at([p[0] - x, p[1] - y, p[2]]);
        ring += `<circle class="fp-touch" cx="${f1(sx)}" cy="${f1(sy)}" r="${f1((4 + 10 * kk) * camW / W * 2)}" style="opacity:${f1(1 - kk)}"/>`;
      }
      set(E.touch, ring);
      set(E.home, homeSvg(span(u, 0.02, 0.1) * (1 - span(u, b1, b1 + 0.05))));
      set(E.g54, g54Svg());
      fade(E.g54, span(u, b2, b2 + 0.06));
    } else if (si === 5) {
      // the setter measures the drill on the tool setter
      tool = 'drill';
      const b1 = B[1];
      const b2 = B[2];
      const [sx, sy, sz] = C.SETTER;
      const touch = b1 + (b2 - b1) * 0.55;
      const frames = [[0, -10, 25, TOP + 60], [b1 * 0.9, sx, sy, sz + 40], [b1 + (b2 - b1) * 0.3, sx, sy, sz + 6], [touch, sx, sy, sz], [1, sx, sy, sz]];
      const [x, y, z] = kf(frames, u);
      tip = place([x, y, z], 'drill');
      set(E.lenDim, lenDimSvg('drill', tip));
      set(E.rowT3, '');
      // the measured length is the readout (121,43); the table row waits for scene 7, where the wrong number is typed
      set(E.rowT5, rowSvg(0, '5', '', '—'));
      set(E.card, cardSvg(14, 60, 300, tr('schema', 'diagram'), [[3, tr('crashes en afkeur', 'crashes and scrap'), '', 0.05], [3, tr('← verkeerde offsets', '← wrong offsets'), '', 0.35], [3, tr('niet het programma', 'not the program'), '', 0.65]], si, u));
      fade(E.tab, span(u, b1 - 0.04, b1));
    } else if (si === 6) {
      // 112,43 typed for 121,43: the drill goes 9 mm too deep
      tool = 'drill';
      const target = -14;
      const typed = span(u, 0.04, B[1] * 0.8);
      set(E.rowT3, '');
      set(E.rowT5, rowSvg(0, '5', num(112.43, 2), '', typed, 1, typed > 0.99 ? `≠ ${num(121.43, 2)}` : ''));
      const zp = kf([[0, 25], [B[1] * 0.9, 2], [B[1] + (1 - B[1]) * 0.6, target - 9], [1, target - 9]], u)[0];
      set(E.slot, slotSvg(FULL));
      tip = place(Wp(C.HOLE[0], C.HOLE[1], zp), 'drill');
      const F = G.frameOf(Wp(C.HOLE[0], C.HOLE[1], 0), Z, X, Y);
      set(E.hole, zp < 0 ? `<path class="fp-cut" d="${G.circleOf(F, 0, 4.4, P, 28)}"/>${lineSvg(G.circleOf(F, 0, 4.4, P, 28), { tone: 'mid' })}` : '');
      phase = clock * 7;
      fade(E.inset, span(u, B[1] - 0.06, B[1]));
      const I = insetSection(zp, target, 0);
      set(E.insBody, I.body);
      set(E.insS, I.s);
      set(E.insC, '');
    } else if (si === 7) {
      // single block: one block a press, the rapid slowed down, a hand on the stop button
      tip = rest();
      const stop = at([-182, -56, 186]);
      const knob = at([-182, -56, 222]);
      const pulse = (c, k1) => `<circle class="fp-touch" cx="${f1(c[0])}" cy="${f1(c[1])}" r="${f1((9 + 5 * Math.sin(clock * 5)) * camW / W * 2)}" style="opacity:${f1(k1)}"/>`;
      set(E.touch, pulse(stop, span(u, B[1], B[1] + 0.05)) + pulse(knob, span(u, B[1], B[1] + 0.05)));
      fade(E.sbk, span(u, 0, 0.06));
    } else if (si === 8) {
      // the first part measured; the count; the error found; the cost without the check
      tool = 'mill';
      const bi = beatOf(si, u);
      const drilled = bi >= 2;
      const target = -14;
      set(E.slot, slotSvg(FULL));
      set(E.g54, g54Svg());
      fade(E.g54, 1);
      if (!drilled) {
        tip = place([25, -55, TOP + 70], 'mill');
        const lift = 50 * (1 - span(u, 0.02, B[1] * 0.6));
        const needle = 0.55 * span(u, B[1] * 0.6, B[1] * 0.95);
        set(E.gauge, gaugeSvg(lift, needle));
        fade(E.gauge, span(u, 0, 0.08));
        set(E.hole, '');
      } else {
        tool = 'drill';
        const zp = kf([[B[2], 25], [B[2] + (B[3] - B[2]) * 0.6, target - 9], [1, target - 9]], u)[0];
        tip = place(Wp(C.HOLE[0], C.HOLE[1], zp), 'drill');
        const F = G.frameOf(Wp(C.HOLE[0], C.HOLE[1], 0), Z, X, Y);
        set(E.hole, zp < 0 ? `<path class="fp-cut" d="${G.circleOf(F, 0, 4.4, P, 28)}"/>${lineSvg(G.circleOf(F, 0, 4.4, P, 28), { tone: 'mid' })}` : '');
        set(E.gauge, '');
        const crashK = span(u, B[4] + 0.02, B[4] + 0.14);
        const I = insetSection(zp, target, crashK);
        set(E.insBody, I.body);
        set(E.insS, I.s);
        set(E.insC, I.c);
        fade(E.inset, span(u, B[2] - 0.02, B[2] + 0.04));
      }
      if (!drilled) fade(E.inset, 0);
      const pt = LANG === 'nl' ? '€7.000' : '€7,000';
      const cnt = bi === 0 ? tr('stuk 1 / 200', 'part 1 / 200') : bi === 1 ? tr('stuk 200 / 200', 'part 200 / 200') : bi === 2 ? tr('1 stuk × €35', '1 part × €35') : `200 × €35 = ${pt}`;
      set(E.counter, cnt ? `<path class="fp-panel" d="M${W - 274} ${H - 62}h260v48h-260z"/>${mono(W - 28, H - 28, cnt, 22, 'end')}` : '');
      phase = drilled ? clock * 7 : 0;
    } else if (si === 9) {
      // the questions of the engineer; a proven program carries the stamp
      tip = rest();
      fade(E.list, span(u, B[2] - 0.02, B[2] + 0.04));
      fade(E.stamp, span(u, B[2] + 0.02, B[2] + 0.08));
      const bi = beatOf(si, u);
      set(E.card, bi < 2 ? fixFlow(si, u) : cardSvg(344, 24, 282, tr('vragen', 'questions'), [[2, tr('Beproefd?', 'Proven?'), '', 0.1], [2, tr('Masterversie?', 'Master version?'), '', 0.6], [3, tr('Crashes vorig jaar?', 'Crashes last year?'), '', 0.05], [3, tr('Wat kostten ze?', 'What did they cost?'), '', 0.5], [4, LANG === 'nl' ? '€5.000 tot €30.000' : '€5,000 to €30,000', 'code', 0.1], [4, tr('plus stilstand', 'plus downtime'), '', 0.6]], si, u));
    }

    set(E.tool, toolSvg(tool, tip, phase));
  }
  const CAMW = [];

  return { render };
})();
