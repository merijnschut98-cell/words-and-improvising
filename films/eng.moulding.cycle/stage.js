  // ------------------------------------------------------------ the film "Cyclustijd en output / Cycle time and output" (lesson eng.moulding.cycle)
  // Scenes: 1 the tour of the machine, 2 the cycle, 3 cavities and output, 4 cooling through the wall, 5 a thinner wall,
  // 6 a commercial number, 7 hidden time.
  const hud = svg.querySelector('[data-k="hud"]');
  // the cap mould: closed and cooling, opens, shows its two cavities with the caps, ejects, closes
  function capMould(u) {
    const gap = span(u, 0.04, 0.16) * (1 - span(u, 0.5, 0.6)) + span(u, 0.84, 0.94);
    if (u < 0.5) {
      const push = span(u, 0.2, 0.24);
      const tau = Math.max(0, (u - 0.24) * C.dur[2]);
      const fall = 46 * tau * tau;
      drawPress({ gap, fwd: 0, shot: fall < 40 ? 1 : 0, push, fall });
    } else drawPress({ gap, fwd: span(u, 0.6, 0.64), shot: u > 0.62 ? 1 : 0, push: 0, fall: 0 });
  }
  // which beat of the tour u falls in (by the designed starts d), and how far through it; the camera holds the framing of
  // the beat and glides there over its first quarter
  function tourBeat(u, d) {
    let k = 0;
    for (let i = 0; i < d.length; i++) if (u >= d[i]) k = i;
    const end = k + 1 < d.length ? d[k + 1] : 1;
    return { k, p: end > d[k] ? Math.min(1, Math.max(0, (u - d[k]) / (end - d[k]))) : 1 };
  }
  function tourCamera(k, p) {
    const from = C.INTRO[Math.max(0, k - 1)];
    const to = C.INTRO[k];
    const e = span(p, 0, 0.25);
    const cx = lerp(from[0], to[0], e);
    const cy = lerp(from[1], to[1], e);
    const w = lerp(from[2], to[2], e);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${(W / w).toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }
  // the tour: the whole machine, the clamp unit, the injection unit, the mould, the mould opening
  function tour(u) {
    const d = C.B[0].slice(0, -1);
    const { k, p } = tourBeat(u, d);
    if (k === 0) drawPress(pose(0));
    else if (k === 1) drawPress(pose(lerp(0, 2, span(p, 0.1, 0.9))));
    else if (k === 2) drawPress(pose(lerp(2, 3.5, span(p, 0.1, 0.9))));
    else if (k === 3) drawPress(pose(lerp(3.5, 24.4, p)));
    else capMould(lerp(0.04, 0.48, p));
    tourCamera(k, p);
  }
  const CARD = { x: 14, y: 60, w: 330 };
  const OUT = { x: 8, y: 62 };

  function render(si, u) {
    const B = C.B[si];
    const clock = u * C.dur[si];
    show(hud, si !== 0);
    if (si === 0) {
      scene(si, ['press'], []);
      tour(u);
      return;
    }
    if (si === 1) {
      // the cycle: one run through the six steps, then the next cycle starts and settles in the cooling
      scene(si, ['press'], ['phasebar', 'coolseg', 'phasetext']);
      camera(si, u);
      const t = u < B[2] ? lin(u, 0.02, B[2] - 0.02) * C.CYCLE : lin(u, B[2], 0.9) * 16;
      drawPress(pose(t));
      phaseBar(t);
    } else if (si === 2) {
      // two cavities, the output, four cavities, the price of more cavities, a closed cavity
      scene(si, ['press'], ['card']);
      camera(si, u);
      capMould(u);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('voorbeeld', 'example'), [
        [0, tr('2 holtes, 20 s', '2 cavities, 20 s', 296)],
        [1, '3600 / 20 × 2 = 360', 'code'],
        [2, tr('4 holtes, 24 s', '4 cavities, 24 s', 296)],
        [2, '3600 / 24 × 4 = 600', 'code', 0.35],
        [3, tr('grotere matrijs en pers', 'bigger mould and press', 296)],
        [4, tr('1 holte dicht: −25 %', '1 cavity shut: −25 %', 296)],
      ], si, u));
    } else if (si === 3) {
      // a wall with a boss: the wall sets through in a quarter of the time the boss needs
      scene(si, ['section'], ['labels']);
      camera(si, u);
      const q = lin(u, 0.04, 0.96);
      section(C.SWALL, true, C.SWALL * Math.sqrt(q), clock, false);
      bossDims(C.SWALL, true);
      set(E.labels, dimLabels(C.SWALL, true));
    } else if (si === 4) {
      // the cap: 12 s of cooling at 3 mm, then the wall thinned to 2,4 mm: 7,7 s
      scene(si, ['section'], ['labels', 'card']);
      camera(si, u);
      const thin = span(u, B[1] - 0.06, B[1]);
      const s = lerp(C.SWALL, C.SWALL * 0.8, thin);
      const run1 = lin(u, 0.03, B[1] - 0.08);
      const T1 = B[1] - 0.11;
      const run2 = lin(u, B[1] + 0.03, B[1] + 0.03 + T1 * 0.64);
      const delta = u < B[1] - 0.06 ? (C.SWALL / 2) * Math.sqrt(run1) : (u < B[1] + 0.03 ? 0 : (s / 2) * Math.sqrt(run2));
      section(s, false, delta, clock, false);
      bossDims(s, false);
      // two timer bars on one scale: 12 s, then 7,7 s
      const x0 = 150;
      const sc = 22;
      const y = H - 56;
      const bar = (yy, secs, f, lab) => `<path class="fp-meter-bg" d="M${x0} ${yy}h${f1(12 * sc)}v12h${f1(-12 * sc)}Z"/><path class="fp-meter-fill" d="M${x0} ${yy}h${f1(secs * sc * f)}v12h${f1(-secs * sc * f)}Z"/>${mark(`M${x0} ${yy}h${f1(12 * sc)}v12h${f1(-12 * sc)}Z`)}${text(x0 - 10, yy + 11, lab, 22, 'end', 'fp-ink fp-mono')}${f > 0.98 ? text(x0 + 12 * sc + 10, yy + 11, `${num(secs, secs % 1 ? 1 : 0)} s`, 22, 'start', 'fp-ink fp-mono') : ''}`;
      set(E.labels, dimLabels(s, false) + `<rect class="fp-hud-bg" x="${x0 - 92}" y="${y - 12}" width="${12 * sc + 160}" height="62" rx="8"/>`
        + bar(y, 12, run1, `${num(3, 1)} mm`) + (u > B[1] ? bar(y + 22, 12 * 0.64, run2, `${num(2.4, 1)} mm`) : ''));
      set(E.card, u > B[2] ? cardSvg(OUT.x, OUT.y, 250, tr('doppen per uur', 'caps per hour'), [[2, '360 → 459', 'code', 0.05]], si, u) : '');
    } else if (si === 5) {
      // the price counts on a cycle time: a real cycle that is slower costs hours
      scene(si, ['press'], ['phasebar', 'coolseg', 'phasetext', 'card']);
      camera(si, u);
      const t = lin(u, 0, 1) * C.CYCLE;
      drawPress(pose(t));
      phaseBar(t);
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('commercieel getal', 'commercial number'), [
        [0, tr('prijs: gecalculeerde cyclus', 'price: calculated cycle', 296)],
        [1, tr('echt 10 % trager', 'real 10 % slower', 296)],
        [1, tr('= 10 % meer persuren', '= 10 % more press hours', 296), '', 0.3],
        [2, tr('28 s: gecalculeerd?', '28 s: calculated?', 296)],
        [2, tr('ingesteld op de pers?', 'set on the press?', 296), '', 0.3],
        [2, tr('echt, een week lang?', 'achieved, over a week?', 296), '', 0.6],
      ], si, u));
    } else if (si === 6) {
      // the machine does not know when the part is cool: the setter types seconds, and adds some "to be safe"
      scene(si, ['press'], ['phasebar', 'coolseg', 'phasetext', 'card']);
      camera(si, u);
      const extra = 4 * span(u, B[1], B[1] + 0.08);
      const t = lin(u, 0, 0.9) * 24;
      drawPress(pose(t));
      phaseBar(t, extra, extra > 0.5 ? tr('voor de zekerheid', 'to be safe') : '');
      set(E.card, cardSvg(CARD.x, CARD.y, CARD.w, tr('verstopte tijd', 'hidden time'), [
        [2, tr('mal gaat te ver open', 'mould opens too far', 296)],
        [2, tr('robotarm wacht', 'robot arm waits', 296), '', 0.3],
        [2, tr('hete plek, geen water', 'hot spot, no water', 296), '', 0.6],
        [3, tr('Wat begrenst de cyclus?', 'What limits the cycle?', 296)],
        [3, tr('Al een seconde eraf?', 'Tried a second off?', 296), '', 0.4],
      ], si, u));
    }
  }
  return { render };
})();
