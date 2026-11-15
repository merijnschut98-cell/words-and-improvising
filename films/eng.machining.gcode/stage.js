  // ------------------------------------------------------------ the film "Een G-code-programma lezen / Reading a G-code program"
  // Scenes: 1 line by line, 2 modal and absolute, 3 motion codes and M-codes, 4 how a setter reads, 5 the slot program,
  // 6 one thing to fix.
  const ALL = ['list', 'counter', 'inset', 'card', 'slot', 'g54', 'absDim', 'incDim', 'stamp'];
  const VIS = [
    ['list'],
    ['list', 'g54', 'absDim', 'incDim'],
    ['list'],
    ['list', 'inset', 'counter'],
    ['list', 'slot', 'g54'],
    ['list', 'card', 'slot'],
  ];
  const START_X = C.START[0];
  const START_Y = C.START[1];

  // a dimension along program X at program y, from x0 to x1, with a line up to where it is measured from (y = 0)
  function dimX(y, x0, x1, text, dashed) {
    const a = at(Wp(x0, y, 0.5));
    const b = at(Wp(x1, y, 0.5));
    const a0 = at(Wp(x0, 0, 0.5));
    const mid = at(Wp((x0 + x1) / 2, y, 0.5));
    return mark(pathOf([a0, a]), ' stroke-dasharray="3 4"') + mark(pathOf([a, b]), dashed ? ' stroke-dasharray="5 4"' : '') + mark(arrowHead(a, b, 8))
      + label(mid[0], mid[1] + 24 * camW / W, text, 22, 'middle');
  }
  // the block numbers of the listing, marked
  const numberHl = (rows) => rows.map((i) => `<path class="fp-cur" d="M${LIST.x + 26} ${LIST.y + 12 + i * LIST.lh}h${4 * CW + 6}v26h${-(4 * CW + 6)}z"/>`).join('');
  // the cursor over several blocks of the listing
  const rowsHl = (a, b) => { let o = ''; for (let i = a; i <= b; i++) o += curSvg(i); return o; };

  // a side view of the plate and the tool: a rapid to Z2 stops above the part, a rapid to Z-3 goes into it
  function rapidSection(k1) {
    const cx = INS.x + 150;
    const top = INS.y + 120;
    const sc = 12;
    const yz = (z) => top - z * sc;
    let body = `<path class="fp-solidfill" d="M${INS.x} ${top}H${INS.x + INS.w}V${INS.y + INS.h}H${INS.x}z"/>`;
    const hatch = [];
    for (let x = INS.x - 90; x < INS.x + INS.w; x += 12) hatch.push(`M${x} ${INS.y + INS.h}L${x + (INS.y + INS.h - top)} ${top}`);
    body += `<clipPath id="fp-rclip"><path d="M${INS.x} ${top}H${INS.x + INS.w}V${INS.y + INS.h}H${INS.x}z"/></clipPath><path class="fp-hatch" clip-path="url(#fp-rclip)" d="${hatch.join('')}"/>`;
    // the tool comes down; the first half of k1 is the rapid to Z2, the second half the rapid to Z-3
    const z = k1 < 0.5 ? lerp(10, 2, k1 * 2) : lerp(2, -3, span(k1, 0.5, 1));
    const ty = yz(z);
    const r = 20;
    const s = `<path class="fp-solidfill" d="M${f1(cx - r)} ${INS.y + 4}V${f1(ty - 8)}L${f1(cx)} ${f1(ty)}L${f1(cx + r)} ${f1(ty - 8)}V${INS.y + 4}z"/>`
      + `<path class="fp-mark" stroke-dasharray="6 5" d="M${INS.x + 12} ${f1(yz(2))}H${INS.x + INS.w - 12}"/>`
      + label(INS.x + INS.w - 16, yz(2) - 8, tr('Z2', 'Z2'), 22, 'end', true)
      + `<path class="fp-mark" stroke-dasharray="6 5" d="M${INS.x + 12} ${f1(yz(-3))}H${INS.x + INS.w - 12}"/>`
      + label(INS.x + INS.w - 16, yz(-3) + 24, tr('Z-3', 'Z-3'), 22, 'end', true);
    const crashK = span(k1, 0.88, 1);
    const c = crashK > 0 ? `<circle class="fp-touch" cx="${f1(cx)}" cy="${f1(yz(-3))}" r="${f1(8 + 22 * crashK)}" style="opacity:${f1(1 - crashK * 0.5)}"/>` : '';
    return { body: body + bigTag(true), s, c };
  }
  // the distance to go on the control: the block that runs, the mm left
  function dtgSvg(v) {
    const left = (28 * (1 - v)).toFixed(1);
    const t = LANG === 'nl' ? left.replace('.', ',') : left;
    return `<path class="fp-panel" d="M${W - 224} ${H - 62}h210v48h-210z"/>${label(W - 212, H - 26, tr('restweg', 'to go'), 22, 'start', true, 'fp-ink fp-label fp-dim')}${mono(W - 28, H - 26, t, 22, 'end')}`;
  }
  // the worked example's numbers on a card
  function fixCard(si, u) {
    return cardSvg(344, 206, 282, tr('voorbeeld', 'example'), [[0, '28 mm · 11 s', 'code', 0.2], [1, '5 mm · 2 s', 'code', 0.5], [2, tr('9 s × 2.000', '9 s × 2,000'), 'code', 0.1], [2, tr('= 5 uur', '= 5 hours'), '', 0.6]], si, u);
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
    const startTip = () => place(Wp(START_X, START_Y, 50), 'mill');

    if (si === 0) {
      tip = startTip();
      // the blocks are read downwards, one at a time; the numbers; the G words and the coordinates; F, S and T
      const t = span(u, B[1], B[2]);
      set(E.cur, bi === 0 ? '' : bi === 1 ? curSvg(Math.min(9, Math.floor(span(u, B[1], B[2]) * 10))) : bi === 2 ? numberHl([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) : bi === 3 ? (span(u, B[3], B[4]) < 0.5 ? wordsHl((w) => /^G\d+$/.test(w)) : wordsHl((w) => /^[XYZ]-?\d+$/.test(w))) : wordsHl((w) => /^[FST]\d+$/.test(w)));
    } else if (si === 1) {
      // modal: N70 carries no G01 of its own; absolute from G54, incremental from where the tool is
      const x0 = 8;
      tip = place(Wp(x0, 0, 12), 'mill');
      set(E.cur, bi === 0 ? wordsHl((w) => w === 'G01') : bi === 1 ? curSvg(6) + wordsHl((w, n) => w === 'G01' && n === 'N60') : bi === 2 ? curSvg(6) + wordsHl((w, n) => w === 'G01' && n === 'N60') : wordsHl((w) => w === 'G90'));
      set(E.g54, g54Svg());
      fade(E.g54, bi >= 3 ? 1 : 0);
      set(E.absDim, dimX(-30, 0, 20, 'X20', false));
      fade(E.absDim, bi === 3 ? span(u, B[3], B[3] + 0.06) : 0);
      set(E.incDim, dimX(-30, x0, x0 + 20, 'X20', true));
      fade(E.incDim, bi >= 4 ? span(u, B[4], B[4] + 0.06) : 0);
      if (bi >= 4) set(E.cur, wordsHl((w) => w === 'G90'));
    } else if (si === 2) {
      tip = startTip();
      set(E.cur, bi === 0 ? wordsHl((w) => w === 'G00') : bi === 1 ? wordsHl((w) => /^G0[123]$/.test(w) && w !== 'G00') : bi === 2 ? wordsHl((w) => /^M0[356]$/.test(w)) : bi === 3 ? wordsHl((w) => /^M(08|09|30)$/.test(w)) : '');
    } else if (si === 3) {
      // how a setter reads: the head, the first moves, the rapid near the part, the distance to go
      tip = startTip();
      set(E.cur, bi === 0 ? rowsHl(0, 2) : bi === 1 ? rowsHl(3, 5) : bi === 2 ? curSvg(3) + wordsHl((w) => w === 'G00' || w === 'Z25') : curSvg(5));
      const k1 = bi === 2 ? span(u, B[2], B[3] - 0.02) : bi > 2 ? 1 : 0;
      const R = rapidSection(k1);
      set(E.insBody, R.body);
      set(E.insS, R.s);
      set(E.insC, R.c);
      fade(E.inset, span(u, B[2] - 0.03, B[2]) * (1 - span(u, B[3] - 0.02, B[3])));
      const v = bi < 3 ? 0 : span(u, B[3] + 0.04, 1);
      set(E.counter, bi >= 3 ? dtgSvg(v) : '');
    } else if (si === 4) {
      // the program runs block by block, in step with the captions
      set(E.g54, g54Svg());
      fade(E.g54, 1);
      const ranges = [[], [0, 1], [2, 3], [4, 5], [6], [7, 8, 9]];
      let cur = -1;
      let v = 0;
      if (bi >= 1) {
        const rs = ranges[bi];
        const t = clamp((u - B[bi]) / ((B[bi + 1] ?? 1) - B[bi]), 0, 0.9999);
        const kk = Math.floor(t * rs.length);
        cur = rs[kk];
        v = t * rs.length - kk;
      }
      const bl = C.blocks[Math.max(0, cur)];
      const p = cur < 0 || bl.kind === 'none' ? C.START : posAt(bl, v);
      tip = place(Wp(p[0], p[1], p[2]), 'mill');
      phase = cur >= 2 && cur < 9 ? clock * 9 : 0;
      set(E.cur, cur >= 0 ? curSvg(cur) : '');
      set(E.slot, slotSvg(cur >= 0 ? cutOf(cur, v) : null));
    } else if (si === 5) {
      // N60: from Z25 to Z-3 at feed; a rapid to Z2 first leaves 5 mm at feed
      set(E.g54, g54Svg());
      fade(E.g54, 1);
      const zs = bi === 0 ? kf([[B[0], 25], [B[1] - 0.02, -3], [B[1], 25]], u)[0] : bi === 1 ? kf([[B[1], 25], [B[1] + (B[2] - B[1]) * 0.25, 2], [B[2] - 0.02, -3], [B[2], -3]], u)[0] : -3;
      const bl = C.blocks[5];
      tip = place(Wp(bl.from[0], bl.from[1], zs), 'mill');
      phase = clock * 9;
      set(E.cur, curSvg(5));
      set(E.slot, '');
      set(E.card, fixCard(si, u));
    }

    set(E.tool, toolSvg(tool, tip, phase));
  }

  return { render };
})();
