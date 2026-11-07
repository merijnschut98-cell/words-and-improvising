// The stage of the film "Draaien / Turning": a pure function of (scene, u).
// Inlined into the page after the anatomy kit (iso-kit functions in scope, the
// lathe module as G) and a preamble from build.mjs that defines P (projection),
// C (world constants), CAM (one camera move per scene), W and H.
/* global G, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, extrude, onTop, translateAlong, span, ease */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const el = (k) => svg.querySelector(`[data-k="${k}"]`);
  const E = {};
  ['world', 'tcol', 'feeder', 'pusher', 'car', 'restB', 'jawsB', 'shaft', 'step', 'marks', 'feedmark', 'part', 'holes', 'jawsF', 'restF', 'tail', 'turret', 'turretBack', 'turretSpin', 'live', 'slide', 'insert', 'wear', 'breaker', 'vc', 'chips', 'dimL', 'dimD', 'carc', 'yarr', 'dial', 'needle', 'clock', 'hand', 'mag', 'magProfile', 'magNose', 'magMid', 'magLead', 'ld', 'face', 'catcher'].forEach((k) => { E[k] = el(k); });
  const X = [1, 0, 0];
  const Y = [0, 1, 0];
  const Z = [0, 0, 1];
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => iso(p, P);
  const V = G.viewOf(P);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  let camW = W;
  // world labels keep their size on screen whatever the camera zoom; HUD labels are fixed
  const label = (x, y, text, size = 22, anchor = 'middle', hud = false) => `<text class="fp-ink fp-label" x="${f1(x)}" y="${f1(y)}" font-size="${f1(hud ? size : size * camW / W)}" text-anchor="${anchor}">${text}</text>`;
  const arrowHead = (from, to, len) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    const l = len * camW / W;
    return `M${f1(to[0] - ux * l - uy * l * 0.55)} ${f1(to[1] - uy * l + ux * l * 0.55)}L${f1(to[0])} ${f1(to[1])}L${f1(to[0] - ux * l + uy * l * 0.55)} ${f1(to[1] - uy * l - ux * l * 0.55)}`;
  };
  const mark = (d, extra = '') => `<path class="fp-mark" d="${d}"${extra}/>`;

  // ------------------------------------------------------------ what each scene shows
  // R: shaft radius, L: shaft length out of the chuck.
  const SC = [
    { R: 30, L: 200, tool: true },
    { R: 30, L: 200, tool: true },
    { R: 30, L: 200, tool: true },
    { R: 30, L: 200, tool: true },
    { R: 30, L: 200, tool: true },
    { R: 30, L: 200, tool: true },
    { R: 10, L: 160, tool: true },
    { R: 20, L: 120, tool: false },
  ];
  const AP = 3; // depth of cut in the drawing (mm)

  // Spindle angle: the integral of the shown (slowed) speed over the scene.
  const RPM_SHOWN = 1 / 1400; // revolutions per second shown per rpm
  function spinAt(si, u, rpmOf) {
    const n = 24;
    let a = 0;
    for (let i = 0; i < n; i++) a += rpmOf((i + 0.5) / n * u) * (u / n);
    return a * C.dur[si] * RPM_SHOWN * TAU;
  }
  const rpm = (d) => Math.min(C.nMax, (C.vc * 1000) / (Math.PI * d));

  // ------------------------------------------------------------ parts drawn every frame
  function shaftSvg(R, L, cutX, rc, theta, opts = {}) {
    const F = G.frameOf([C.CF, 0, 0], X, Y, Z);
    const cut = clamp(cutX - C.CF, 0, L);
    let out = '';
    if (cut > 0.05) out += solidSvg(G.solidOf([[0, R], [cut, R]], F, P), { tone: 'mid', crease: 'lo' });
    if (cut < L - 0.05) out += solidSvg(G.solidOf([[cut, rc], [L, rc]], F, P), { tone: 'hi', crease: 'lo' });
    // spin marks: witness lines on the uncut part turn with the spindle
    if (!opts.still) {
      const lines = [];
      for (let k = 0; k < 5; k++) {
        const a = theta + (k * TAU) / 5;
        const facing = G.dot3(G.radialOf(F, a), V);
        if (facing < 0.15) continue;
        const s1 = Math.max(6, cut - 6);
        if (s1 <= 8) continue;
        lines.push(pathOf([at(G.pointOf(F, 4, R, a)), at(G.pointOf(F, s1, R, a))]));
      }
      out += lineSvg(lines.join(''), { tone: 'faint' });
    }
    return out;
  }
  function jawsSvg(R, theta) {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const a = theta + (i * TAU) / 3;
      const F = G.frameOf([C.CF, 0, 0], X, [0, Math.cos(a), Math.sin(a)], [0, -Math.sin(a), Math.cos(a)]);
      const facing = G.dot3(F.u, V);
      const html = solidSvg(G.prismOf(F, [[R + 14, -6.5], [R + 24, -6.5], [R + 24, 6.5], [R + 14, 6.5]], -0.5, 12, P), { tone: 'mid', crease: 'lo' })
        + solidSvg(G.prismOf(F, [[R, -6], [R + 14, -6], [R + 14, 6], [R, 6]], -0.5, 9, P), { tone: 'mid', crease: 'lo' });
      rows.push({ facing, html });
    }
    rows.sort((a, b) => a.facing - b.facing);
    return { back: rows.filter((r) => r.facing <= 0).map((r) => r.html).join(''), front: rows.filter((r) => r.facing > 0).map((r) => r.html).join('') };
  }
  // the insert at the slide's rest pose (tip at C.TIP), turned by `turn` about its centre
  function insertSvg(turn) {
    const [tx, ty] = C.TIP;
    const cx = tx + 7.4;
    const cy = ty + 6.7;
    const c = Math.cos(turn);
    const s = Math.sin(turn);
    const ring = C.INS.map(([dx, dy]) => [cx + (tx + dx - cx) * c - (ty + dy - cy) * s, cy + (tx + dx - cx) * s + (ty + dy - cy) * c]);
    return solidSvg(extrude(ring, -4.8, 4.8, P), { tone: 'hi', crease: 'lo' })
      + lineSvg(onTop(ring.map(([x, y]) => [cx + (x - cx) * 0.62, cy + (y - cy) * 0.62]), 0, P, true), { tone: 'lo' })
      + dotsSvg([at([cx, cy, 0])], { size: 0.9, tone: 'mid' });
  }
  function wearSvg(w) {
    if (w <= 0.01) return '';
    const [tx, ty] = C.TIP;
    const e = C.INS[1];
    const len = Math.hypot(e[0], e[1]);
    const ux = e[0] / len;
    const uy = e[1] / len;
    const l = 2 + 8 * w;
    const d = 1 + 1.8 * w;
    return `<path class="fp-wear" d="${onTop([[tx, ty], [tx + ux * l, ty + uy * l], [tx + ux * l - uy * d * 0.3, ty + uy * l + ux * d], [tx - uy * d * 0.2 + 0.6, ty + ux * d + 0.4]], 0.05, P, true)}"/>`;
  }
  // chips: deterministic in time, so scrubbing and stills agree
  function chipPath(cx, cy, size, turn, long = 1.25) {
    const outer = [];
    const inner = [];
    const n = 20;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const a = turn + t * TAU * long;
      const r = size * (0.42 + 0.58 * t);
      const w = size * (0.12 + 0.18 * t);
      outer.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.66]);
      inner.push([cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.66]);
    }
    return pathOf(outer.concat(inner.reverse()), true);
  }
  function chipsSvg(tip, clockS, rate, size = 5) {
    let out = '';
    const period = 1 / rate;
    const first = Math.floor((clockS - 1.4) / period);
    for (let i = Math.max(0, first); i * period <= clockS; i++) {
      const age = clockS - i * period;
      if (age > 1.4) continue;
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const p = [tip[0] + 10 * age, tip[1] + 22 * age + 4, tip[2] + 26 * age - 34 * age * age + 3];
      const [sx, sy] = at(p);
      const k = G.scaleOf(P);
      const alpha = Math.min(1, age / 0.12) * (1 - clamp((age - 1.1) / 0.3, 0, 1));
      out += `<path class="fp-chip" style="opacity:${alpha.toFixed(2)}" d="${chipPath(sx, sy, size * k * (0.85 + 0.3 * rnd), rnd * 6.28 + age * 5)}"/>`;
    }
    return out;
  }
  // a long string wrapped round the shaft (a light finishing cut, below the breaker's window)
  function ribbonSvg(R, x0, grow, theta) {
    const F = G.frameOf([C.CF, 0, 0], X, Y, Z);
    const n = Math.floor(10 + 150 * grow);
    const front = [];
    let run = [];
    for (let i = 0; i < n; i++) {
      const t = i / 150;
      const a = theta * 0.3 + t * TAU * 3.2;
      const s = x0 - C.CF + 4 - t * 70 + Math.sin(t * 31) * 2;
      const r = R + 3 + Math.sin(t * 17) * 1.2;
      const p = G.pointOf(F, s, r, a);
      if (G.dot3(G.radialOf(F, a), V) > -0.05) run.push(at(p));
      else if (run.length) { front.push(run); run = []; }
    }
    if (run.length) front.push(run);
    return front.filter((r) => r.length > 1).map((r) => `<path class="fp-ribbon" d="${pathOf(r)}"/>`).join('');
  }

  // ------------------------------------------------------------ camera
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const w = lerp(c.from[2], c.to[2], k);
    camW = w;
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
    return { cx, cy, s };
  }
  // world point → stage (HUD) coordinates under the current camera
  const toHud = (p, cam) => { const [x, y] = at(p); return [(x - cam.cx) * cam.s + W / 2, (y - cam.cy) * cam.s + H / 2]; };

  // ------------------------------------------------------------ render
  let shown = -1;
  const ALL = ['tcol', 'feeder', 'car', 'restB', 'restF', 'tail', 'turret', 'slide', 'vc', 'chips', 'dimL', 'dimD', 'carc', 'yarr', 'dial', 'clock', 'mag', 'ld', 'feedmark', 'step', 'part', 'holes', 'face', 'catcher', 'breaker'];
  const VIS = [
    ['car', 'slide', 'vc', 'chips', 'step'],
    ['car', 'slide', 'chips', 'dial', 'face'],
    ['car', 'slide', 'chips', 'feedmark', 'step'],
    ['car', 'slide', 'chips', 'clock', 'step'],
    ['car', 'slide', 'mag', 'step'],
    ['car', 'slide', 'chips', 'breaker', 'step'],
    ['car', 'slide', 'dimL', 'dimD', 'ld', 'tail', 'restB', 'restF', 'step'],
    ['tcol', 'feeder', 'turret', 'carc', 'yarr', 'part', 'holes', 'catcher'],
  ];

  function render(si, u) {
    if (si !== shown) {
      shown = si;
      for (const k of ALL) show(E[k], VIS[si].includes(k));
    }
    const cam = camera(si, u);
    const sc = SC[si];
    const R = sc.R;
    const end = C.CF + sc.L;
    const clockS = u * C.dur[si];
    let tip = [end + 14, R + 14, 0]; // tool tip in the world
    let cutX = end;
    let theta = 0;
    let rc = R - AP;
    let wear = 0.15;
    let turn = 0;
    let chips = '';
    const tipAt = () => [tip[0], tip[1], 0];

    if (si === 0) {
      // the edge comes in and starts its pass; the arrow shows the surface speed
      const plunge = span(u, 0.05, 0.25);
      const travel = span(u, 0.25, 1);
      tip = [end - 2 - 40 * travel, lerp(R + 10, rc, plunge), 0];
      cutX = travel > 0 ? tip[0] : end;
      theta = spinAt(si, u, () => 1167);
      if (plunge > 0.95) chips = chipsSvg(tipAt(), clockS, 3);
      const F = G.frameOf([C.CF, 0, 0], X, Y, Z);
      const s = tip[0] - C.CF + 14;
      const a0 = Math.PI * 0.18;
      const a1 = Math.PI * 0.62;
      const arc = [];
      for (let i = 0; i <= 16; i++) arc.push(at(G.pointOf(F, s, R + 7, a0 + ((a1 - a0) * i) / 16)));
      const tail = arc[arc.length - 2];
      const head = arc[arc.length - 1];
      const lp = at(G.pointOf(F, s + 4, R + 22, (a0 + a1) / 2));
      set(E.vc, mark(pathOf(arc)) + mark(arrowHead(tail, head, 9)) + label(lp[0], lp[1], 'Vc', 22));
    } else if (si === 1) {
      // facing: the edge runs toward the centre and the spindle speeds up
      const y = lerp(R - 1, 9, span(u, 0.12, 0.88));
      tip = [end - 1.5, y, 0];
      cutX = end;
      rc = R;
      theta = spinAt(si, u, (uu) => rpm(2 * lerp(R - 1, 9, span(uu, 0.12, 0.88))));
      chips = chipsSvg(tipAt(), clockS, 3, 4);
      const n = rpm(2 * y);
      const ang = -2.35 + (n / 3200) * 4.7;
      const [cx, cy] = C.DIAL;
      set(E.needle, mark(`M${f1(cx)} ${f1(cy)}L${f1(cx + Math.sin(ang) * 40)} ${f1(cy - Math.cos(ang) * 40)}`, ' style="stroke-width:2.2"'));
      // the faced end shows as a lit disc
      const F = G.frameOf([end - 0.2, 0, 0], X, Y, Z);
      set(E.face, lineSvg(G.circleOf(F, 0, y, P), { tone: 'mid' }));
    } else if (si === 2) {
      // a longitudinal pass: feed per revolution and the depth of cut
      const travel = span(u, 0.05, 0.95);
      tip = [end - 2 - 150 * travel, rc, 0];
      cutX = tip[0];
      theta = spinAt(si, u, () => 1167);
      chips = chipsSvg(tipAt(), clockS, 3);
      // feed marks behind the edge (spacing exaggerated), and a bracket over one step
      const F = G.frameOf([C.CF, 0, 0], X, Y, Z);
      const marks = [];
      const pitch = 5;
      for (let s = tip[0] - C.CF + pitch; s < sc.L - 1; s += pitch) marks.push(G.arcOf(F, s, rc, P, { least: 0.25 }));
      set(E.marks, lineSvg(marks.join(''), { tone: 'lo' }));
      const s0 = tip[0] - C.CF + pitch * 2;
      const a = Math.PI * 0.5;
      const p0 = at(G.pointOf(F, s0, rc + 4, a));
      const p1 = at(G.pointOf(F, s0 + pitch, rc + 4, a));
      const q0 = at(G.pointOf(F, s0, rc + 9, a));
      const q1 = at(G.pointOf(F, s0 + pitch, rc + 9, a));
      const lp = at(G.pointOf(F, s0 + pitch / 2, rc + 22, a));
      const arrowFrom = at(G.pointOf(F, tip[0] - C.CF + 2, rc + 16, a));
      const arrowTo = at(G.pointOf(F, tip[0] - C.CF - 18, rc + 16, a));
      set(E.feedmark, mark(pathOf([p0, q0])) + mark(pathOf([p1, q1])) + mark(pathOf([at(G.pointOf(F, s0, rc + 7, a)), at(G.pointOf(F, s0 + pitch, rc + 7, a))]))
        + mark(pathOf([arrowFrom, arrowTo])) + mark(arrowHead(arrowFrom, arrowTo, 8)) + label(lp[0], lp[1], 'f', 22));
    } else if (si === 3) {
      // time-lapse: the flank wears; the insert is turned to a fresh edge; then a heavier feed
      const travel = span(u, 0, 0.55) * 0.5 + span(u, 0.72, 1) * 0.5;
      tip = [end - 10 - 40 * travel, rc, 0];
      cutX = tip[0];
      theta = spinAt(si, u, () => 1167);
      wear = u < 0.55 ? 0.1 + 0.9 * span(u, 0, 0.52) : 1 - span(u, 0.56, 0.66);
      turn = Math.PI * span(u, 0.58, 0.68);
      if (u < 0.56 || u > 0.7) chips = chipsSvg(tipAt(), clockS, u > 0.7 ? 4 : 3);
      const [cx, cy] = C.CLOCK;
      const ang = span(u, 0, 0.55) * TAU * 3;
      set(E.hand, mark(`M${f1(cx)} ${f1(cy)}L${f1(cx + Math.sin(ang) * 30)} ${f1(cy - Math.cos(ang) * 30)}`, ' style="stroke-width:2.2"'));
    } else if (si === 4) {
      // a finishing pass; the magnifier shows the feed marks and the nose radius
      tip = [end - 40 - 30 * u, R - 1, 0];
      rc = R - 1;
      cutX = tip[0];
      theta = spinAt(si, u, () => 1167);
      const r = lerp(0.8, 1.2, span(u, 0.36, 0.46)) - 0.4 * span(u, 0.5, 0.58);
      const f = lerp(0.25, 0.14, span(u, 0.6, 0.72));
      magnifier(r, f, cam, tipAt());
    } else if (si === 5) {
      // close on the insert: the chip breaker curls the chip into a 6; too light a cut makes strings
      tip = [end - 30 - 26 * u, rc, 0];
      cutX = tip[0];
      theta = spinAt(si, u, () => 1167);
      if (u < 0.5) chips = chipsSvg(tipAt(), clockS, 2.4, 3.2);
      else chips = ribbonSvg(R - AP, tip[0], span(u, 0.5, 0.95), theta);
    } else if (si === 6) {
      // a slender shaft: it bends away, then the tailstock and the steady rest hold it
      const tailIn = span(u, 0.36, 0.5);
      const restIn = span(u, 0.7, 0.82);
      rc = R - 1;
      tip = [end - 8 - 34 * span(u, 0.04, 1), rc, 0];
      cutX = tip[0];
      theta = spinAt(si, u, () => 1167 * 3);
      const bendOn = u < 0.5 ? span(u, 0.08, 0.2) * (1 - tailIn) : 0;
      const wobble = bendOn * (0.6 + 0.4 * Math.sin(clockS * 38));
      E.__bend = -0.05 * wobble; // radians, away from the tool
      move(E.tail, [lerp(170, 0, tailIn), 0, 0]);
      move(E.restB, [0, 0, lerp(-130, 0, restIn)]);
      move(E.restF, [0, 0, lerp(-130, 0, restIn)]);
      E.restB.style.opacity = E.restF.style.opacity = String(span(u, 0.7, 0.76));
      E.tail.style.opacity = String(span(u, 0.36, 0.42));
      // dimensions: the overhang L and the diameter D
      const a = at([C.CF, -R - 22, 0]);
      const b = at([end, -R - 22, 0]);
      const lp = at([(C.CF + end) / 2, -R - 40, 6]);
      set(E.dimL, mark(pathOf([a, b])) + mark(arrowHead(b, a, 8)) + mark(arrowHead(a, b, 8))
        + mark(pathOf([at([C.CF, -R - 16, 0]), at([C.CF, -R - 28, 0])])) + mark(pathOf([at([end, -R - 4, 0]), at([end, -R - 28, 0])]))
        + label(lp[0], lp[1], 'L', 24));
      const d0 = at([end + 8, 0, -R]);
      const d1 = at([end + 8, 0, R]);
      const dp = at([end + 14, 0, R + 12]);
      set(E.dimD, mark(pathOf([d0, d1])) + mark(arrowHead(d0, d1, 7)) + mark(arrowHead(d1, d0, 7)) + label(dp[0], dp[1], 'D', 24, 'start'));
    } else if (si === 7) {
      millTurn(u, clockS, cam);
    }

    // the shaft (bent a little in scene 7), the jaws and the tool
    if (si !== 7) {
      const bend = si === 6 ? E.__bend || 0 : 0;
      let html = shaftSvg(R, sc.L, cutX, rc, theta, { still: false });
      if (bend) {
        const pivot = at([C.CF, 0, 0]);
        // a rigid tilt about the chuck face reads as the shaft bending away from the tool
        const dir = G.sub3(at([C.CF + 10, -Math.sin(bend) * 10, 0]), pivot);
        const deg = (Math.atan2(dir[1], dir[0]) - Math.atan2(G.sub3(at([C.CF + 10, 0, 0]), pivot)[1], G.sub3(at([C.CF + 10, 0, 0]), pivot)[0])) * 180 / Math.PI;
        html = `<g transform="rotate(${deg.toFixed(3)} ${f1(pivot[0])} ${f1(pivot[1])})">${html}</g>`;
      }
      set(E.shaft, html);
      const jw = jawsSvg(R, theta);
      set(E.jawsB, jw.back);
      set(E.jawsF, jw.front);
      // the step between the uncut and the cut diameter: the depth of cut
      if (rc < R - 0.2 && cutX < end - 0.2) {
        const F = G.frameOf([cutX, 0, 0], X, Y, Z);
        set(E.step, solidSvg(G.lathe([[0, rc], [0, R], [0.6, R], [0.6, rc]], F, P, { steps: 64 }), { tone: 'mid', crease: 'none' }));
      } else set(E.step, '');
      move(E.car, [tip[0] - C.TIP[0], 0, 0]);
      move(E.slide, [tip[0] - C.TIP[0], tip[1] - C.TIP[1], 0]);
      set(E.insert, insertSvg(turn));
      set(E.wear, wearSvg(si === 3 ? wear : 0.12));
    }
    if (chips !== undefined) set(E.chips, chips);
  }

  // ------------------------------------------------------------ the magnifier (scene 5)
  function magnifier(r, f, cam, tip) {
    const [mx, my] = C.MAG;
    const RM = C.MAG_R;
    const pxmm = 150; // across
    const ex = 14; // depth drawn 14× deeper than true
    const base = my + 22;
    const pts = [];
    const depth = (x) => {
      const k = Math.round(x / f);
      const dx = x - k * f;
      return r - Math.sqrt(Math.max(0, r * r - dx * dx));
    };
    for (let i = 0; i <= 160; i++) {
      const x = (i / 160 - 0.5) * (2 * RM / pxmm);
      pts.push([mx + x * pxmm, base - (Math.min(depth(x), f * f / (8 * r) * 1.0001) - f * f / (8 * r)) * pxmm * ex]);
    }
    const prof = pathOf(pts);
    const fill = pathOf([...pts, [mx + RM, my + RM], [mx - RM, my + RM]], true);
    set(E.magProfile, `<path class="fp-metal" d="${fill}"/>` + `<path class="fp-mark fp-edge" d="${prof}"/>`);
    // the nose of the insert sits in one groove
    // the nose of the insert (drawn to the across scale) sits in the groove under it
    const h = f * f / (8 * r);
    const valley = base + h * pxmm * ex;
    const nr = r * pxmm * 0.32;
    const ncy = valley - nr;
    set(E.magNose, `<path class="fp-mark" d="M${f1(mx - nr)} ${f1(ncy)}A${f1(nr)} ${f1(nr)} 0 0 0 ${f1(mx + nr)} ${f1(ncy)}"/><path class="fp-mark" d="M${f1(mx)} ${f1(ncy)}L${f1(mx + nr * 0.7)} ${f1(ncy + nr * 0.7)}"/>` + label(mx + nr * 0.5, ncy + nr * 0.22, 'r', 24, 'start', true));
    const ra = base + h * pxmm * ex * 0.5;
    set(E.magMid, `<path class="fp-mark" stroke-dasharray="5 5" d="M${f1(mx - RM + 14)} ${f1(ra)}L${f1(mx + RM - 14)} ${f1(ra)}"/>` + label(mx - RM + 40, ra + 34, 'Ra', 22, 'middle', true));
    const [tx, ty] = toHud(tip, cam);
    const ang = Math.atan2(ty - my, tx - mx);
    set(E.magLead, `<path class="fp-mark" d="M${f1(tx)} ${f1(ty)}L${f1(mx + Math.cos(ang) * RM)} ${f1(my + Math.sin(ang) * RM)}"/>`);
  }

  // ------------------------------------------------------------ the mill-turn centre (scene 8)
  function millTurn(u, clockS, cam) {
    const R = 20;
    const holeX = C.HOLE_X;
    const partFrom = C.PART_FROM;
    // b1: turning, the turret indexes; b2: six holes with the C-axis, a Y move; b3: part off, bar on
    const index = span(u, 0.04, 0.2);
    const turning = u < 0.27;
    const holesT = clamp((u - 0.3) / 0.3, 0, 1); // 0..1 over the six holes
    const k = Math.min(5, Math.floor(holesT * 6));
    const inHole = holesT * 6 - k;
    const cRot = (k + span(inHole, 0, 0.35)) * (TAU / 6) * (holesT < 1 ? 1 : 0) + (holesT >= 1 ? TAU : 0);
    const plunge = holesT > 0 && holesT < 1 ? Math.sin(clamp((inHole - 0.4) / 0.55, 0, 1) * Math.PI) : 0;
    const yMove = span(u, 0.62, 0.66) - span(u, 0.68, 0.72);
    const off = span(u, 0.74, 0.8);
    const fall = span(u, 0.78, 0.9);
    const push = span(u, 0.88, 0.99);
    const theta = turning ? spinAt(7, Math.min(u, 0.27), () => 900) : cRot;
    // the bar out of the chuck: before parting it reaches to the part's end; after, the feeder pushes it on
    const barEnd = off > 0.5 ? lerp(partFrom - 2, C.BAR_END, push) : C.BAR_END;
    const F = G.frameOf([C.CF, 0, 0], X, Y, Z);
    const gap = off > 0 ? 3 * off : 0;
    let bar = solidSvg(G.solidOf([[0, R], [Math.min(barEnd, partFrom - gap) - C.CF, R]], F, P), { tone: 'mid', crease: 'lo' });
    // spin marks while turning
    if (turning) {
      const lines = [];
      for (let i = 0; i < 5; i++) {
        const a = theta + (i * TAU) / 5;
        if (G.dot3(G.radialOf(F, a), V) < 0.15) continue;
        lines.push(pathOf([at(G.pointOf(F, 4, R, a)), at(G.pointOf(F, partFrom - C.CF - 4, R, a))]));
      }
      bar += lineSvg(lines.join(''), { tone: 'faint' });
    }
    set(E.shaft, bar);
    const jw = jawsSvg(R, theta);
    set(E.jawsB, jw.back);
    set(E.jawsF, jw.front);
    // the part: from partFrom to the bar end, with its holes; it falls after parting off
    const drop = [0, 34 * fall, -88 * fall * fall];
    const Fp = G.frameOf(G.add3([partFrom, 0, 0], drop), X, Y, Z);
    let part = solidSvg(G.solidOf([[0, R], [C.BAR_END - partFrom, R]], Fp, P), { tone: 'hi', crease: 'lo' });
    // holes: drilled ones turn with the C-axis
    const done = holesT >= 1 ? 6 : k + (inHole > 0.75 ? 1 : 0);
    const holes = [];
    for (let i = 0; i < done; i++) {
      const a = Math.PI / 2 + cRot - (i + 1) * (TAU / 6);
      const Fh = G.frameOf(G.pointOf(Fp, holeX - partFrom, R, a), G.radialOf(Fp, a), X, G.tangentOf(Fp, a));
      if (G.dot3(G.radialOf(Fp, a), V) < 0.12) continue;
      holes.push(G.circleOf(Fh, 0, 3.2, P, 20));
    }
    part += holes.length ? `<path class="fp-hole" d="${holes.join('')}"/>` : '';
    set(E.part, part);
    // the turret: indexes into place, the live tool plunges; the Y-axis lifts it off centre
    const ty = 14 * yMove;
    move(E.turret, [0, ty, -6 * plunge]);
    const spin = turning ? 0 : clockS * 9;
    turretSvg((1 - index) * (Math.PI / 4), spin);
    // C-axis arrow round the chuck side of the bar, Y arrow by the tool
    const Fc = G.frameOf([C.CF + 22, 0, 0], X, Y, Z);
    const arc = [];
    const c0 = Math.PI * 0.15;
    for (let i = 0; i <= 18; i++) arc.push(at(G.pointOf(Fc, 0, R + 9, c0 + (i / 18) * Math.PI * 0.6)));
    const cl = at(G.pointOf(Fc, 0, R + 24, c0 + Math.PI * 0.3));
    set(E.carc, mark(pathOf(arc)) + mark(arrowHead(arc[16], arc[18], 9)) + label(cl[0], cl[1], 'C', 24));
    const zt = C.T[2] - C.TR + 2;
    const y0 = at([holeX + 16, -14 + ty, zt]);
    const y1 = at([holeX + 16, 18 + ty, zt]);
    const yl = at([holeX + 24, 24 + ty, zt + 4]);
    set(E.yarr, mark(pathOf([y0, y1])) + mark(arrowHead(y0, y1, 8)) + mark(arrowHead(y1, y0, 8)) + label(yl[0], yl[1], 'Y', 24, 'start'));
    // the axis arrows come in with the beat that names them
    E.carc.style.opacity = E.yarr.style.opacity = String(span(u, 0.26, 0.32) * (1 - span(u, 0.74, 0.8)));
    // the bar feeder's pusher
    move(E.pusher, [60 * push, 0, 0]);
  }

  // eight stations round the turret; station 0 carries the live tool (a drill).
  // Stations facing away are drawn behind the disc, the rest in front of it.
  function turretSvg(off, spin) {
    const Ft = G.frameOf(C.T, X, Y, Z);
    const back = [];
    const front = [];
    let live = '';
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + off + (i * TAU) / 8;
      const F = G.frameOf(C.T, X, [0, Math.cos(a), Math.sin(a)], [0, -Math.sin(a), Math.cos(a)]);
      const facing = G.dot3(F.u, V);
      const block = solidSvg(G.prismOf(F, [[C.TR - 6, -7], [C.TR + 6, -7], [C.TR + 6, 7], [C.TR - 6, 7]], -9, 9, P), { tone: 'mid', crease: 'lo' });
      (facing > 0 ? front : back).push({ facing, html: block });
      if (i === 0) {
        const tipOut = G.pointOf(Ft, 0, C.TR + 6, a);
        const Fd = G.frameOf(tipOut, G.radialOf(Ft, a), X, G.tangentOf(Ft, a));
        live = solidSvg(G.solidOf([[0, 3.2], [C.DRILL_L - 3, 3.2], [C.DRILL_L, 0.6]], Fd, P), { tone: 'hi', crease: 'lo' })
          + dotsSvg(G.dotsOf(Fd, 6, 3.3, 3, P, { phase: spin, least: -1 }).concat(G.dotsOf(Fd, 13, 3.3, 3, P, { phase: spin + 1, least: -1 })), { size: 1, tone: 'hi' });
      }
    }
    back.sort((p, q) => p.facing - q.facing);
    front.sort((p, q) => p.facing - q.facing);
    set(E.turretBack, back.map((x) => x.html).join(''));
    set(E.turretSpin, front.map((x) => x.html).join(''));
    set(E.live, live);
  }

  return { render };
})();
