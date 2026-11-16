  // ------------------------------------------------------------ the film "CAM, simulatie en proefdraaien / CAM, simulation and prove-out"
  // Scenes: 1 from model to program, 2 simulation, 3 prove-out, 4 what a manager weighs, 5 the case, 6 the answer.
  const START_X = C.START[0];
  const START_Y = C.START[1];
  const ALL = ['cam', 'sbk', 'slot', 'gauge', 'card', 'lamp'];
  const VIS = [
    ['cam', 'card'],
    ['cam', 'card'],
    ['sbk', 'slot', 'gauge', 'card'],
    ['card'],
    ['card'],
    ['card'],
  ];

  // a card of rows; sizes in the same room as the offsets film
  const rowsCard = (si, u, tag, rows, w) => cardSvg(14, 24, w, tag, rows, si, u);
  // a strip of two boxes with an arrow: a change at the machine that goes back into CAM
  function backFlow(si, u) {
    const B = C.B[si];
    const k1 = span(u, B[3] + 0.02, B[3] + 0.1);
    let out = boxSvg(14, 24, 298, 52, tr('wijziging aan de machine', 'change at the machine', 282), true);
    out += boxSvg(396, 24, 230, 52, tr('CAM', 'CAM', 200), k1 > 0.5);
    out += `<g style="opacity:${f1(k1)}">${arrowH(314, 394, 50)}${label(330, 104, tr('terug in CAM', 'back into CAM', 280), 22, 'middle', true)}</g>`;
    return out;
  }
  // the bars of a small series: programming longer than machine time
  function barsCard(si, u) {
    const B = C.B[si];
    const x = 14;
    const y = 44;
    const w = 420;
    const k1 = span(u, B[1], B[1] + 0.15);
    let out = panelD(x, y, w, 150) + label(x + 16, y + 28, tr('kleine serie', 'small batch', 380), 22, 'start', true, 'fp-ink fp-label fp-dim');
    out += label(x + 16, y + 74, tr('programmeren', 'programming', 200), 22, 'start', true);
    out += `<path class="fp-solidfill" d="M${x + 200} ${y + 56}h${f1(200 * Math.min(1, 0.4 + 0.6 * span(u, B[0], B[0] + 0.15)))}v24h-${f1(200 * Math.min(1, 0.4 + 0.6 * span(u, B[0], B[0] + 0.15)))}z"/>`;
    out += `<g style="opacity:${f1(k1)}">${label(x + 16, y + 122, tr('machine', 'machine', 200), 22, 'start', true)}<path class="fp-solidfill" d="M${x + 200} ${y + 104}h100v24h-100z"/></g>`;
    return out;
  }
  // the model and the machine: the same jaw, drawn right and drawn 10 mm too low
  function simBig(si, u, mode) {
    const B = C.B[si];
    const x0 = CAMS.x + 30;
    const x1 = CAMS.x + CAMS.w - 30;
    const top = CAMS.y + 214;
    const sc = 4;
    const jawX = x0 + 190;
    let body = `<path class="fp-mark" d="M${x0} ${top}H${x1}"/>`;
    body += `<path class="fp-solidfill" d="M${jawX} ${top}v${-8 * sc}h${44}v${8 * sc}z"/>`;
    if (mode === 1) body += `<path class="fp-mark" stroke-dasharray="5 4" d="M${jawX} ${top + 10 * sc}v${-8 * sc}h44v${8 * sc}z"/>${label(jawX + 22, top + 10 * sc + 44, tr('model', 'model', 160), 22, 'middle', true)}`;
    const k1 = mode === 0 ? span(u, B[0] + 0.03, B[1] - 0.03) : span(u, B[2] + 0.03, B[3] - 0.03);
    const tx = lerp(x0 + 10, jawX - 6 + (mode === 1 ? 70 : 0), k1);
    const ty = top - 3 * sc;
    body += `<path class="fp-mark" d="M${x0 + 10} ${f1(ty)}H${f1(tx)}"/><path class="fp-solidfill" d="M${f1(tx - 6)} ${f1(ty)}h12v-22h10v-22h-32v22h10z"/>`;
    let c = '';
    if (mode === 0 && k1 > 0.95) c = `<circle class="fp-touch" cx="${f1(jawX - 2)}" cy="${f1(ty)}" r="${f1(14 + 8 * span(u, B[1] - 0.04, B[1]))}"/>`;
    if (mode === 1) {
      c += label(x0 + 10, CAMS.y + 78, tr('simulatie: schoon', 'simulation: clean', 340), 22, 'start', true);
      const kc = span(u, B[3] - 0.1, B[3]);
      if (kc > 0) c += `<g style="opacity:${f1(kc)}"><circle class="fp-touch" cx="${f1(jawX - 2)}" cy="${f1(ty)}" r="${f1(14 + 12 * kc)}"/>${label(x0 + 10, CAMS.y + 108, tr('echte machine: crash', 'real machine: crash', 340), 22, 'start', true)}</g>`;
    }
    return body + c;
  }

  function render(si, u) {
    scene(si, ALL, VIS[si]);
    camera(CAM[si], u, ...(CAMW[si] || []));
    const B = C.B[si];
    const clock = u * C.dur[si];
    const bi = beatOf(si, u);
    let tool = 'mill';
    let tip = TOP + 40;
    let phase = 0;
    set(E.slot, '');
    set(E.lamp, '');

    if (si === 0) {
      // CAM makes the toolpath; the features; the post; two machines; a bad post
      tip = place(Wp(START_X, START_Y, 50), 'mill');
      const I = camSvg(si, u, [B[0], B[2], B[3], 9]);
      set(E.camBody, I.body);
      set(E.camPath, I.path);
      set(E.camPost, bi >= 2 ? I.post : '');
      set(E.camSim, '');
      fade(E.cam, bi === 1 || bi >= 3 ? 0 : 1);
      set(E.card, bi === 1 ? rowsCard(si, u, tr('per vormelement', 'per feature', 380), [[1, tr('kamer: adaptief voorbewerken', 'pocket: adaptive roughing', 388), '', 0.1], [1, tr('gat: boorcyclus', 'hole: drilling cycle', 388), '', 0.4], [1, tr('vlak: nabewerkingssnede', 'face: finishing pass', 388), '', 0.7]], 420)
        : bi === 3 ? rowsCard(si, u, tr('zelfde onderdeel', 'same part', 380), [[3, tr('machine A: post A, programma A', 'machine A: post A, program A', 388), '', 0.1], [3, tr('machine B: post B, programma B', 'machine B: post B, program B', 388), '', 0.5]], 420)
        : bi === 4 ? rowsCard(si, u, tr('post', 'post', 380), [[4, tr('slechte post: verborgen crashrisico', 'bad post: hidden crash risk', 388), '', 0.1]], 420) : '');
    } else if (si === 1) {
      // the simulation on a digital copy of the machine; its models; what it runs
      tip = place(Wp(START_X, START_Y, 50), 'mill');
      set(E.camBody, '');
      set(E.camPath, '');
      set(E.camPost, '');
      set(E.camSim, bi <= 1 ? simBig(si, u, 0) : bi === 2 ? simBig(si, u, 1) : '');
      fade(E.cam, bi === 3 ? 0 : 1);
      set(E.card, bi === 3 ? rowsCard(si, u, tr('vraag', 'ask', 380), [[3, tr('echte G-code na de post?', 'real G-code after the post?', 388), '', 0.1], [3, tr('of alleen de CAM-baan?', 'or only the CAM path?', 388), '', 0.55]], 420) : '');
    } else if (si === 2) {
      // prove-out: single block, rapids slower, in the air first; then the first part and the release; back into CAM
      const n70 = C.blocks[6];
      const k1 = bi === 0 ? span(u, B[0] + 0.05, B[1]) : bi === 1 ? span(u, B[1], B[2]) : 1;
      let p = posAt(n70, k1);
      if (bi === 1) p = [p[0], p[1], 14];
      tip = place(Wp(p[0], p[1], p[2]), 'mill');
      phase = bi <= 1 ? clock * 3 : 0;
      set(E.slot, bi === 0 ? slotSvg(cutOf(6, k1)) : bi === 1 ? '' : slotSvg(FULL));
      const Fl = G.frameOf([-232, -55.8, 192], Y, X, Z);
      set(E.lamp, `<path class="fp-lamp" d="${G.circleOf(Fl, 0, 4, P, 18)}"/>`);
      fade(E.sbk, span(u, 0, 0.06));
      set(E.gauge, bi === 2 ? gaugeSvg(50 * (1 - span(u, B[2], B[2] + 0.1)), 0.55 * span(u, B[2] + 0.06, B[3] - 0.03)) : '');
      if (bi === 2) tip = place([25, -55, TOP + 70], 'mill');
      set(E.card, bi === 2 ? rowsCard(si, u, tr('vrijgave', 'release', 380), [[2, tr('eerste stuk helemaal gemeten', 'first part fully measured', 388), '', 0.15], [2, tr('programma: beproefd', 'program: proven', 388), '', 0.6]], 420)
        : bi === 3 ? backFlow(si, u)
        : bi >= 4 ? rowsCard(si, u, tr('bijhouden', 'tracking', 380), [[4, tr('uren proefdraaien per programma', 'prove-out hours per program', 388), '', 0.1], [4, tr('en waarom', 'and why', 388), '', 0.6], [5, tr('bottleneck: programmeren?', 'bottleneck: programming?', 388), '', 0.1], [5, tr('of het vertrouwen erin?', 'or the trust in it?', 388), '', 0.55]], 420) : '');
    } else if (si === 3) {
      tip = place(Wp(START_X, START_Y, 50), 'mill');
      const rows = [
        [2, tr('sjablonen voor vormen', 'templates for features', 388), '', 0.1],
        [2, tr('gevalideerde post per machine', 'validated post per machine', 388), '', 0.5],
        [3, tr('simulatie complete machine', 'full-machine simulation', 388), '', 0.1],
        [3, tr('CAM-gereedschapsbibliotheek', 'CAM tool library', 388), '', 0.55],
        [4, tr('uren per nieuw programma?', 'hours per new program?', 388), '', 0.1],
        [5, tr('aan de machine gewijzigd?', 'edited at the machine?', 388), '', 0.1],
        [6, tr('welke post vertrouwt niemand?', 'which post nobody trusts?', 388), '', 0.1],
      ];
      set(E.card, bi < 2 ? barsCard(si, u) : rowsCard(si, u, bi < 4 ? tr('hefbomen', 'levers', 380) : tr('vragen', 'questions', 380), rows.filter((r) => (bi < 4 ? r[0] < 4 : r[0] >= 4)), 420));
    } else if (si === 4) {
      tip = place(Wp(START_X, START_Y, 50), 'mill');
      set(E.card, rowsCard(si, u, tr('voorbeeld', 'example', 380), [
        [0, tr('150 programma’s per jaar', '150 programs a year', 388), '', 0.2],
        [1, tr('CAM 4 uur à €70', 'CAM 4 hours at €70', 388), '', 0.1],
        [2, tr('proefdraaien 2,5 uur à €110', 'prove-out 2.5 hours at €110', 388), '', 0.1],
        [3, tr('simulatie: €20.000 per jaar', 'simulation: €20,000 a year', 388), '', 0.2],
        [4, tr('proefdraaien naar 1 uur', 'prove-out down to 1 hour', 388), '', 0.1],
        [4, tr('CAM-tijd plus 0,25 uur', 'CAM time plus 0.25 hours', 388), '', 0.6],
      ], 420));
    } else if (si === 5) {
      tip = place(Wp(START_X, START_Y, 50), 'mill');
      set(E.card, rowsCard(si, u, tr('voorbeeld', 'example', 380), [
        [0, LANG === 'nl' ? '1,5 × 150 × €110 = €24.750' : '1.5 × 150 × €110 = €24,750', 'code', 0.1],
        [1, LANG === 'nl' ? '0,25 × 150 × €70 = €2.625' : '0.25 × 150 × €70 = €2,625', 'code', 0.1],
        [2, LANG === 'nl' ? '€22.125 tegen €20.000' : '€22,125 against €20,000', 'code', 0.1],
        [2, LANG === 'nl' ? 'netto +€2.125' : 'net +€2,125', 'code', 0.6],
        [3, LANG === 'nl' ? '225 machine-uren' : '225 machine hours', 'code', 0.2],
        [3, tr('en de crashes die het voorkomt', 'and the crashes it prevents', 388), '', 0.65],
        [4, tr('tellen alleen met werk', 'count only with work', 388), '', 0.2],
      ], 420));
    }

    set(E.tool, toolSvg(tool, tip, phase));
  }
  const CAMW = [];

  return { render };
})();
