// The stage of the film "Een lijn lezen / Reading a line": a pure function of
// (scene, u). Inlined into the page after the anatomy kit (iso-kit functions in
// scope), a preamble from build.mjs that defines P (projection), C (world
// constants, the model, the scenarios, the beat cameras), W, H and lineSim, and
// the kit's audio warp.
//
// The products on the belt come from the line model: each scene runs its
// scenario from a running start up to the model time of the frame (cached, so
// playing forward only steps on), and every product glides to where the model
// puts it. Lamps and rams follow the stations' states. Cards over the drawing
// are in stage space.
/* global P, C, W, H, iso, translateAlong, span, beatStarts, warpU, introBeat, introCamera, lineSim */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tx = (nl, en) => (EN ? en : nl);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => iso(p, P);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const attr = (e, name, v) => { if (e['__' + name] !== v) { e.setAttribute(name, v); e['__' + name] = v; } };
  const flag = (e, name, on) => { if (!!e['__' + name] !== on) { e.toggleAttribute(name, on); e['__' + name] = on; } };
  const M = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
  const mark = (d, cls = 'fp-mark') => (d ? `<path class="${cls}" d="${d}"/>` : '');
  const T = (x, y, text, size = 20, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink fp-tx ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
  const card = (x, y, w, h, r = 12) => `<rect class="fp-hud-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fp-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const Rr = (x, y, w, h, cls, rx = 3) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${rx}"/>`;
  const head = (x0, y0, x1, y1, len = 8) => {
    const d = Math.hypot(x1 - x0, y1 - y0) || 1;
    const ux = (x1 - x0) / d;
    const uy = (y1 - y0) / d;
    return `M${f1(x1 - ux * len - uy * len * 0.55)} ${f1(y1 - uy * len + ux * len * 0.55)}L${f1(x1)} ${f1(y1)}L${f1(x1 - ux * len + uy * len * 0.55)} ${f1(y1 - uy * len - ux * len * 0.55)}`;
  };
  const arrow = (x0, y0, x1, y1, cls = 'fp-arrow') => mark(`M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head(x0, y0, x1, y1)}`, cls);
  // a bracket from x0 to x1 at height y, ticks down
  const bracket = (x0, x1, y, cls = 'fp-arrow') => mark(`M${f1(x0)} ${f1(y + 7)}L${f1(x0)} ${f1(y)}L${f1(x1)} ${f1(y)}L${f1(x1)} ${f1(y + 7)}`, cls);

  // ------------------------------------------------------------ the line model per scene
  const { ST, SLOT0, PITCH, BT, PART_H, STROKE, TOTE_X, TOTE_H, BELT_END } = C;
  const slotX = (j, q) => ST[j + 1] - SLOT0 - PITCH * q;
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };
  // the segment of beat k in scene si, the model time at (k, p) and the glide time
  function segOf(si, k) { return C.SC[si].findIndex((s) => k >= s.b0 && k <= s.b1); }
  function simTime(seg, k, p) { const j = k - seg.b0; return lerp(seg.T[j], seg.T[j + 1], p); }
  function travelOf(si, seg) {
    const d = designed(si);
    const dur = FILM.scenes[si].dur;
    const real = ((seg.b1 + 1 < d.length ? d[seg.b1 + 1] : 1) - d[seg.b0]) * dur;
    return clamp((0.75 * (seg.T[seg.T.length - 1] - seg.T[0])) / Math.max(1, real), 1, 30);
  }
  const posOf = (v, t, tr) => v.x0 + (v.x1 - v.x0) * ease((t - v.t0) / tr);
  function sync(L, V, tr, first) {
    const now = L.t;
    const seen = new Set();
    const want = (id, x, kind, role) => {
      seen.add(id);
      let v = V.get(id);
      if (!v) {
        const fresh = !first && Math.abs(x - ST[0]) < 0.01;
        v = { x0: fresh ? ST[0] - 20 : x, x1: x, t0: now, born: fresh ? now : -1e9 };
        V.set(id, v);
      } else if (v.x1 !== x) { v.x0 = posOf(v, now, tr); v.x1 = x; v.t0 = now; }
      v.kind = kind;
      v.role = role;
    };
    L.st.forEach((st, i) => { if (st.part) want(st.part, ST[i], i === 0 ? 0 : st.done ? i : i - 1, 's' + i); });
    L.buf.forEach((b, j) => b.forEach((id, q) => want(id, slotX(j, q), j, 'q' + j)));
    while (L.outs.length && now - L.outs[0][1] > 3 * tr) L.outs.shift();
    L.outs.forEach(([id]) => want(id, TOTE_X, 3, 'out'));
    for (const id of [...V.keys()]) if (!seen.has(id)) V.delete(id);
  }
  let cache = null;
  function modelAt(si, k, p) {
    const sg = segOf(si, k);
    const seg = C.SC[si][sg];
    if (seg.paced) return { seg, t: simTime(seg, k, p) };
    const t = simTime(seg, k, p);
    const key = si + ':' + sg;
    if (!cache || cache.key !== key || t < cache.L.t - 1e-6) {
      const L = lineSim(seg.cyc, seg.cap, seg.stops.map((a) => a.map((q) => q.slice())));
      L.fill(seg.init);
      cache = { key, L, V: new Map(), tr: travelOf(si, seg) };
      sync(L, cache.V, cache.tr, true);
    }
    const { L, V, tr } = cache;
    while (L.t < t - 1e-9) { L.step(C.DT); sync(L, V, tr, false); }
    return { seg, t: L.t, L, V, tr };
  }

  // ------------------------------------------------------------ products, rams, lamps, pads
  const rams = [...svg.querySelectorAll('[data-ram]')];
  const lamps = ST.map((_, i) => ['run', 'wait', 'fault'].map((n) => svg.querySelector(`[data-lamp="${i}-${n}"]`)));
  const pads = [...svg.querySelectorAll('[data-pad]')].map((el) => { const [j, q] = el.getAttribute('data-pad').split('-').map(Number); return { el, j, q }; });
  const use = (x, z, kind, a) => `<use href="#fp-prod${kind}" transform="${translateAlong(P, [x, 0, z])}"${a < 0.995 ? ` opacity="${a.toFixed(2)}"` : ''}/>`;
  function productsSvg(list) {
    return list.sort((a, b) => a.x - b.x).map((q) => use(q.x, q.z, q.kind, q.a)).join('');
  }
  function fromModel(m) {
    const out = [];
    for (const v of m.V.values()) {
      const x = posOf(v, m.t, m.tr);
      let z = 0;
      let a = clamp((m.t - v.born) / m.tr, 0, 1);
      if (v.role === 'out') {
        const fall = clamp((x - (BELT_END - 2)) / (TOTE_X - BELT_END + 2), 0, 1);
        z = -(BT - TOTE_H + PART_H + 2) * fall * fall;
        a = 1 - clamp((fall - 0.55) / 0.45, 0, 1);
      }
      out.push({ x, z, a, kind: v.kind, role: v.role });
    }
    return out;
  }
  // a paced line: every product moves on one station per period, all together
  function paced(seg, t) {
    const n = Math.floor(t / seg.period);
    const e = ease(((t / seg.period) - n) / 0.3);
    const out = [];
    for (let s = 0; s <= 4; s++) {
      const from = s === 0 ? ST[0] - 20 : ST[s - 1];
      const to = s < 4 ? ST[s] : TOTE_X;
      const x = lerp(from, to, e);
      let z = 0;
      let a = s === 0 ? e : 1;
      if (s === 4) { const fall = e; z = -(BT - TOTE_H + PART_H + 2) * fall * fall; a = 1 - clamp((fall - 0.55) / 0.45, 0, 1); }
      out.push({ x, z, a, kind: s === 0 ? 0 : Math.min(3, s - 1 + (e >= 1 ? 1 : 0)), role: 's' });
    }
    const work = e >= 1 ? ((t / seg.period) - n - 0.3) / 0.7 : 0;
    return { list: out, phase: work, states: ['run', 'run', 'run', 'run'] };
  }
  const ramDown = (phase) => -STROKE * span(phase, 0.12, 0.38) * (1 - span(phase, 0.62, 0.88));
  function drawLine(si, k, p, cues) {
    const m = modelAt(si, k, p);
    let list;
    let states;
    let phases;
    if (m.seg.paced) {
      const r = paced(m.seg, m.t);
      list = r.list;
      states = r.states;
      phases = ST.map(() => r.phase);
    } else {
      list = fromModel(m);
      states = m.L.st.map((s) => s.state);
      phases = m.L.st.map((s) => s.phase);
    }
    const wip = cues.includes('wip');
    const q1 = list.filter((q) => !wip && q.role === 'q1' && si === 5);
    set(E.parts, productsSvg(list.filter((q) => !wip && !q1.includes(q))));
    set(E.partsQ, productsSvg(q1));
    set(E.partsW, wip ? productsSvg(list) : '');
    // manual stations keep their cylinder up in the Basis scenes (a person works there)
    const manual = si <= 2 ? [0, 2] : [];
    rams.forEach((el, i) => {
      const z = states[i] === 'run' && !manual.includes(i) ? ramDown(phases[i]) : 0;
      attr(el, 'transform', translateAlong(P, [0, 0, z]));
    });
    states.forEach((s, i) => {
      flag(lamps[i][0], 'data-lit', s === 'run');
      flag(lamps[i][1], 'data-lit', s === 'blocked' || s === 'starved');
      flag(lamps[i][2], 'data-lit', s === 'fault');
    });
    const caps = m.seg.paced ? [0, 0, 0] : m.seg.cap;
    pads.forEach(({ el, j, q }) => flag(el, 'data-cap', q < caps[j]));
    return { m, list };
  }

  // ------------------------------------------------------------ station tags (stage space, follow the camera)
  const NAMES = {
    l1: tx(['huis', 'waaier', 'deksel', 'test'], ['housing', 'impeller', 'cover', 'test']),
    num: ['1', '2', '3', '4'],
    abc: ['A', 'B', 'C', 'D'],
  };
  function tagsSvg(names, camr, maxX, inCard) {
    if (!names) return '';
    return ST.map((sx, i) => {
      const [x, y] = at([sx + 2, -12, 76]);
      const X = (x - camr.cx) * camr.s + W / 2;
      const Y = (y - camr.cy) * camr.s + H / 2;
      if (X < 20 || X > maxX || Y < 26 || Y > H - 6 || (inCard && X > CX - 14 && Y < CY + CH + 24)) return '';
      return T(X, Y, names[i], 21, 'middle', 'fp-label fp-tagtx');
    }).join('');
  }

  // ------------------------------------------------------------ cards
  // One card slot in the top right corner, where the line leaves the stage empty.
  const CX = 404;
  const CY = 12;
  const CW = 226;
  const CH = 244;
  const title = (text) => T(CX + CW / 2, CY + 30, text, 20, 'middle', 'fp-small');
  // s3: cycle time per station against the takt
  const BX0 = CX + 30;
  const BW = 34;
  const BG = 16;
  const BY0 = CY + CH - 36;
  const BYS = (BY0 - (CY + 56)) / 70;
  const barX = (i) => BX0 + i * (BW + BG);
  const yOf = (s) => BY0 - s * BYS;
  function cycBase() {
    let s = card(CX, CY, CW, CH) + title(tx('cyclustijd (s)', 'cycle time (s)'));
    s += mark(M([[BX0 - 12, yOf(72)], [BX0 - 12, BY0], [barX(3) + BW + 10, BY0]]));
    s += C.CYC1.map((_, i) => T(barX(i) + BW / 2, BY0 + 25, String(i + 1), 20, 'middle', 'fp-small fp-mute')).join('');
    return s;
  }
  function bar(i, grow) {
    const v = C.CYC1[i] * grow;
    return Rr(barX(i), yOf(v), BW, BY0 - yOf(v), 'fp-meter', 2) + (grow > 0.98 ? T(barX(i) + BW / 2, yOf(v) + 24, String(C.CYC1[i]), 20, 'middle', 'fp-label fp-inbar') : '');
  }
  function cycBars(kb, p) {
    return C.CYC1.map((_, i) => (kb >= 1 && i === 2 ? '' : bar(i, kb === 0 ? ease((p - i * 0.18) / 0.22) : 1))).join('');
  }
  const cycBn = (kb) => (kb >= 1 ? bar(2, 1) : '');
  function cycTakt(kb, p) {
    if (kb < 2) return '';
    const x1 = lerp(BX0 - 12, barX(3) + BW + 10, kb === 2 ? ease(p / 0.4) : 1);
    let s = mark(`M${f1(BX0 - 12)} ${f1(yOf(C.TAKT))}L${f1(x1)} ${f1(yOf(C.TAKT))}`, 'fp-dash');
    s += T(BX0 - 4, yOf(C.TAKT) - 9, `${tx('takt', 'takt')} ${C.TAKT}`, 20, 'start', 'fp-label');
    return s;
  }

  // s4: a cell, seen from above: five machines in a U, an operator walking with the work
  function cellBody(p) {
    let s = card(CX, CY, CW, CH) + title(tx('cel, van boven', 'cell, from above'));
    const mw = 46;
    const mh = 40;
    const m = [[CX + 26, CY + 52], [CX + 26, CY + 104], [CX + 90, CY + 168], [CX + 154, CY + 104], [CX + 154, CY + 52]];
    m.forEach(([x, y]) => { s += Rr(x, y, mw, mh, 'fp-shape', 5) + Rr(x + 8, y + 8, mw - 16, 8, 'fp-meter2', 2) + `<circle class="fp-dot2" cx="${f1(x + mw / 2)}" cy="${f1(y + 28)}" r="3"/>`; });
    // the walk inside the U: down the left machines, along the bottom, up the right ones
    const path = [[CX + 86, CY + 64], [CX + 86, CY + 150], [CX + 140, CY + 150], [CX + 140, CY + 64]];
    s += mark(M(path), 'fp-dash');
    const tt = (p * 1.6) % 1;
    const len = [86, 54, 86];
    const total = len.reduce((a, b) => a + b, 0);
    let dist = tt * total;
    let j = 0;
    while (j < 2 && dist > len[j]) { dist -= len[j]; j++; }
    const a = path[j];
    const b = path[j + 1];
    const f = clamp(dist / len[j], 0, 1);
    s += `<circle class="fp-dot" cx="${f1(lerp(a[0], b[0], f))}" cy="${f1(lerp(a[1], b[1], f))}" r="9"/>`;
    return s;
  }

  // s7: the buffer level over 40 min: refilled at 20 an hour, emptied by the next stop of B
  const LX0 = CX + 40;
  const LX1 = CX + CW - 18;
  const LY0 = CY + CH - 46;
  const LY1 = CY + 66;
  const lx = (min) => lerp(LX0, LX1, min / 40);
  const ly = (n) => lerp(LY0, LY1, n / 5);
  const LEVEL = [[0, 0], [15, 5], [17, 5], [20, 0], [35, 5], [37, 5], [40, 0]];
  const upTo = (pts, until) => {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      if (pts[i][0] <= until) out.push(pts[i]);
      else { const a = pts[i - 1]; const b = pts[i]; out.push([until, lerp(a[1], b[1], (until - a[0]) / (b[0] - a[0]))]); break; }
    }
    return out;
  };
  function levelBase(kb) {
    let s = card(CX, CY, CW, CH) + title(tx('buffer voor C', 'buffer before C'));
    s += mark(M([[LX0, LY1 - 8], [LX0, LY0], [LX1 + 6, LY0]]));
    const ticks = kb === 0 ? [0, 15, 40] : [0, 20, 40];
    s += ticks.map((v) => mark(`M${f1(lx(v))} ${LY0}L${f1(lx(v))} ${LY0 + 6}`) + T(lx(v), LY0 + 27, v === 40 ? '40 min' : String(v), 20, v === 40 ? 'end' : 'middle', v === 15 ? 'fp-label' : 'fp-small fp-mute')).join('');
    s += T(LX0 - 9, ly(0) + 7, '0', 20, 'end', 'fp-small fp-mute') + T(LX0 - 9, ly(5) + 7, '5', 20, 'end', 'fp-small fp-mute');
    s += mark(`M${f1(LX0)} ${f1(ly(5))}L${f1(LX1)} ${f1(ly(5))}`, 'fp-dash');
    return s;
  }
  function levelParts(kb, p) {
    const until = kb === 0 ? lerp(0, 15, ease(p / 0.8)) : lerp(15, 40, ease(p / 0.7));
    const pts = upTo(LEVEL, until).map(([mm, n]) => [lx(mm), ly(n)]);
    const up = [];
    const rest = [];
    for (let i = 1; i < pts.length; i++) (pts[i][1] < pts[i - 1][1] - 0.01 ? up : rest).push(`M${f1(pts[i - 1][0])} ${f1(pts[i - 1][1])}L${f1(pts[i][0])} ${f1(pts[i][1])}`);
    let notes = '';
    if (kb === 0 && until >= 14.9) notes += mark(`M${f1(lx(15))} ${f1(ly(5))}L${f1(lx(15))} ${LY0}`, 'fp-dash');
    return { up: mark(up.join(''), 'fp-curve'), rest: mark(rest.join(''), 'fp-curve2') + notes };
  }

  // s7: the WIP counter
  function wipBody(n) {
    return card(CX + 46, CY, CW - 46, 104) + T(CX + 23 + CW / 2, CY + 34, tx('onderhanden werk', 'WIP'), 20, 'middle', 'fp-small') + T(CX + 23 + CW / 2, CY + 84, String(n), 40, 'middle', 'fp-big');
  }

  // s8: the simulation screen: four stations over eight hours, stops as blocks
  const SX0 = CX + 40;
  const SX1 = CX + CW - 16;
  const SH = 8 * 60;
  const sx = (min) => lerp(SX0, SX1, min / SH);
  const rowY = (i) => CY + 66 + i * 38;
  // stops in minutes [start, length], spread (30 s to 20 min, clustered) and fixed (3 min every 2 h)
  const SPREAD = [
    [[34, 1], [52, 6], [58, 2], [190, 0.5], [301, 20], [420, 3]],
    [[20, 2], [96, 12], [150, 3], [262, 1], [268, 4], [395, 2]],
    [[70, 0.5], [128, 3], [240, 20], [330, 1], [338, 2], [450, 6]],
    [[12, 3], [110, 1], [176, 2], [205, 9], [360, 0.5], [440, 3]],
  ];
  const FIXED = [0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((n) => [30 * i + 15 + n * 120, 3]));
  function simBase(kb) {
    let s = card(CX, CY, CW, CH) + title(tx('simulatie', 'simulation'));
    s += [0, 1, 2, 3].map((i) => T(SX0 - 12, rowY(i) + 7, String(i + 1), 20, 'end', 'fp-small fp-mute') + mark(`M${f1(SX0)} ${rowY(i)}L${f1(SX1)} ${rowY(i)}`, 'fp-curve2')).join('');
    if (kb !== 1 && kb !== 2) s += [0, 4, 8].map((h) => T(sx(h * 60), CY + CH - 14, `${h} ${tx('u', 'h')}`, 20, h === 8 ? 'end' : h === 0 ? 'start' : 'middle', 'fp-small fp-mute')).join('');
    return s;
  }
  function simRows(stops, until) {
    let s = '';
    stops.forEach((row, i) => row.forEach(([a, len]) => {
      if (a > until) return;
      const w = Math.max(4, sx(Math.min(a + len, until)) - sx(a));
      s += Rr(sx(a), rowY(i) - 10, w, 20, 'fp-meter', 2);
    }));
    if (until < SH) s += mark(`M${f1(sx(until))} ${rowY(0) - 20}L${f1(sx(until))} ${rowY(3) + 18}`, 'fp-arrow');
    return s;
  }
  // MTBF on row 2: from the end of one stop to the start of the next; MTTR: one long stop on row 3.
  // Their names sit in the card's bottom strip, lit with the bracket.
  const simMtbf = () => { const a = SPREAD[1][1]; const b = SPREAD[1][2]; const x0 = sx(a[0] + a[1]); const x1 = sx(b[0]); return bracket(x0, x1, rowY(1) - 18) + T((x0 + x1) / 2, CY + CH - 14, 'MTBF', 20, 'middle', 'fp-label'); };
  const simMttr = () => { const a = SPREAD[2][2]; const x0 = sx(a[0]) - 2; const x1 = sx(a[0] + a[1]) + 2; return bracket(x0, x1, rowY(2) - 18) + T((x0 + x1) / 2, CY + CH - 14, 'MTTR', 20, 'middle', 'fp-label'); };

  // s9: Little's law as three readouts, then output and lead time against buffer places
  function littleBody(kb) {
    let s = card(CX, CY, CW, CH) + title(tx('wet van Little', 'Little’s law'));
    if (kb === 2) return s;
    const lead = kb >= 1 ? String(Math.round(C.LEAD_H * 60)) : '?';
    const rows = [[tx('in de lijn', 'in the line'), String(C.SIM.wip), ''], [tx('output', 'throughput'), `= ${C.SIM.out}`, tx(' /u', ' /h')], [tx('doorlooptijd', 'lead time'), `× ${lead}`, ' min']];
    rows.forEach(([name, v, unit], i) => {
      const y = CY + 64 + i * 62;
      s += T(CX + CW / 2, y, name, 20, 'middle', 'fp-small fp-mute') + T(CX + CW / 2, y + 34, v + (unit ? `<tspan font-size="20">${unit}</tspan>` : ''), 32, 'middle', 'fp-big');
    });
    return s;
  }
  function littleCurve(p) {
    const x0 = CX + 26;
    const x1 = CX + CW - 18;
    const y0 = CY + CH - 50;
    const y1 = CY + 60;
    const xb = (b) => lerp(x0, x1, b / 6);
    const out = (b) => 1 - 0.55 * Math.exp(-b / 1.1);
    const lead = (b) => 0.06 + 0.085 * b;
    const n = ease(p / 0.7) * 6;
    const curve = (f) => { const pts = []; for (let b = 0; b <= n + 1e-6; b += 0.25) pts.push([xb(b), lerp(y0, y1, f(b))]); return pts.length > 1 ? M(pts) : ''; };
    let s = mark(M([[x0, y1 - 10], [x0, y0], [x1 + 6, y0]]));
    s += mark(curve(out), 'fp-curve') + mark(curve(lead), 'fp-dash');
    s += [0, 6].map((b) => T(xb(b), y0 + 26, String(b), 20, b === 6 ? 'end' : 'middle', 'fp-small fp-mute')).join('');
    s += T((x0 + x1) / 2, y0 + 26, tx('plekken', 'places'), 20, 'middle', 'fp-small fp-mute');
    if (n > 2.5) s += T(xb(2.4), lerp(y0, y1, out(2.4)) - 12, 'output', 20, 'middle', 'fp-label');
    if (n > 5.5) s += T(x1, lerp(y0, y1, lead(6)) + 26, tx('doorlooptijd', 'lead time'), 20, 'end', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['cycC', 'cellC', 'levelC', 'wipC', 'simC', 'littleC'];
  const hudOnly = (list) => { for (const key of HUD) show(E[key], list.includes(key)); };

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    const camr = introCamera(E.world, C.KEYS[si], d, u, W, H);
    const cues = FILM.scenes[si].beats[kb].cues || [];
    const { m, list } = drawLine(si, kb, p, cues);
    let hud = [];
    let names = null;
    if (si <= 2) names = NAMES.l1;
    if (si === 4) names = NAMES.num;
    if (si === 5 || si === 6) names = NAMES.abc;
    if (si === 2) hud = ['cycC'];
    if (si === 3 && kb === 2) hud = ['cellC'];
    if (si === 6 && kb <= 1) hud = ['levelC'];
    if (si === 6 && kb === 2) hud = ['wipC'];
    if (si === 7) hud = ['simC'];
    if (si === 8) hud = ['littleC'];
    const maxX = W - 20;
    set(E.tags, tagsSvg(names, camr, maxX, hud.length > 0));

    if (hud.includes('cycC')) { set(E.cycBase, cycBase()); set(E.cycBars, cycBars(kb, p)); set(E.cycBn, cycBn(kb)); set(E.cycTakt, cycTakt(kb, p)); }
    if (hud.includes('cellC')) set(E.cellBody, cellBody(p));
    if (hud.includes('levelC')) { set(E.levelBase, levelBase(kb)); const r = levelParts(kb, p); set(E.levelUp, r.up); set(E.levelRest, r.rest); }
    if (hud.includes('wipC')) set(E.wipBody, wipBody(list.filter((q) => q.role !== 'out').length));
    if (hud.includes('simC')) {
      set(E.simBase, simBase(kb));
      const until = kb === 0 ? lerp(0, SH, ease(p / 0.85)) : SH;
      set(E.simRows, simRows(kb === 3 ? FIXED : SPREAD, until));
      set(E.simMtbf, kb === 1 ? simMtbf() : '');
      set(E.simMttr, kb === 2 ? simMttr() : '');
    }
    if (hud.includes('littleC')) { set(E.littleBody, littleBody(kb)); set(E.littleCurve, kb === 2 ? littleCurve(p) : ''); }
    hudOnly(hud);
    void m;
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
