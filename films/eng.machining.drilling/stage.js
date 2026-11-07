// The stage of the film "Boren / Drilling": a pure function of (scene, u).
// Inlined into the page after the anatomy kit (iso-kit functions in scope, the
// lathe module as G) and a preamble from build.mjs that defines P (projection),
// C (world constants), CAM (one camera move per scene), W and H.
/* global G, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, translateAlong, span */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const X = [1, 0, 0];
  const Y = [0, 1, 0];
  const Z = [0, 0, 1];
  const TAU = Math.PI * 2;
  const HALF = Math.PI / 2;
  const { ZC, BX0, BX1, BY0, BY1, X_NUT, STICK } = C;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const V = G.viewOf(P);
  const KS = G.scaleOf(P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : a.toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const mark = (d, extra = '') => (d ? `<path class="fp-mark" d="${d}"${extra}/>` : '');
  let camW = W;
  const label = (x, y, text, size = 20, anchor = 'middle', hud = false) => `<text class="fp-ink fp-label" x="${f1(x)}" y="${f1(y)}" font-size="${f1(hud ? size : (size * camW) / W)}" text-anchor="${anchor}">${text}</text>`;
  const wrap = (a) => { let x = (a + Math.PI) % TAU; if (x < 0) x += TAU; return x - Math.PI; };

  // ------------------------------------------------------------ the tool in the spindle
  // t: { kind, r, tip, theta, tilt, pitch }. kind: drill (118° point, two
  // helical flutes), spot (centre drill, 90° point), reamer (six straight
  // flutes, chamfer), tap (thread, three flutes), boring (bar with one insert),
  // gun (driver, thin shank, one straight V groove, one edge).
  function toolSvg(t) {
    const tilt = t.tilt || 0;
    const a = [Math.cos(tilt), Math.sin(tilt), 0];
    const len = STICK;
    const nose = [t.tip - len * a[0], -len * a[1], ZC];
    const F = G.frameOf(nose, a, [-a[1], a[0], 0], Z);
    const fv = G.angleToward(F, V);
    const r = t.r;
    const pt = (s, rr, rho) => at(G.pointOf(F, s, rr, fv + rho));
    function curve(rhoOf, s0, s1, rr, steps) {
      const runs = [];
      let run = null;
      for (let i = 0; i <= steps; i++) {
        const s = s0 + ((s1 - s0) * i) / steps;
        const rho = wrap(rhoOf(s));
        if (Math.abs(rho) <= HALF - 0.04) { if (!run) { run = []; runs.push(run); } run.push(pt(s, rr, rho)); } else run = null;
      }
      return runs.filter((x) => x.length > 1).map(fmt).join('');
    }
    function band(rhoOf, width, s0, s1, rr, steps, cls = 'dr-flute') {
      let out = '';
      let lo = [];
      let hi = [];
      const flush = () => { if (lo.length > 1) out += `<path class="${cls}" d="${fmt(lo.concat(hi.reverse()))}Z"/>`; lo = []; hi = []; };
      for (let i = 0; i <= steps; i++) {
        const s = s0 + ((s1 - s0) * i) / steps;
        const b0 = wrap(rhoOf(s));
        const x0 = Math.max(b0, -HALF);
        const x1 = Math.min(b0 + width, HALF);
        if (x1 > x0) { lo.push(pt(s, rr, x0)); hi.push(pt(s, rr, x1)); } else flush();
      }
      flush();
      return out;
    }
    let profile;
    let lines = '';
    let flutes = '';
    let before = '';
    let after = '';
    if (t.kind === 'drill' || t.kind === 'spot') {
      const spot = t.kind === 'spot';
      const tl = spot ? r : r * 0.6009;
      const s1 = len - tl;
      const sf = spot ? s1 - 3.2 * r : 0; // a centre drill only has short flutes near its point
      profile = spot ? [[0, r + 3], [s1 - 3.4 * r, r + 3], [s1 - 3.2 * r, r], [s1, r], [len, 0]] : [[0, r], [s1, r], [len, 0]];
      const lead = spot ? 1e9 : 6 * 2 * r;
      const steps = Math.max(16, Math.round((s1 - sf) / 1.6));
      for (let f = 0; f < 2; f++) {
        const a0 = (s) => t.theta + f * Math.PI + (TAU * s) / lead - fv;
        flutes += band(a0, 0.42 * Math.PI, sf, s1, r, steps);
        lines += curve(a0, sf, s1, r, steps) + curve((s) => a0(s) + 0.42 * Math.PI, sf, s1, r, steps);
        const lip = wrap(a0(s1) + 0.42 * Math.PI);
        if (Math.abs(lip) < HALF - 0.05) lines += fmt([pt(s1, r, lip), pt(len, 0, 0)]);
      }
    } else if (t.kind === 'reamer') {
      const ch = 0.35 * r;
      profile = [[0, r], [len - ch, r], [len, r - ch], [len, 0]];
      for (let f = 0; f < 6; f++) {
        const rho = wrap(t.theta + (f * TAU) / 6 - fv);
        if (Math.abs(rho) < HALF - 0.08) lines += fmt([pt(len - 40, r, rho), pt(len - ch, r, rho)]);
      }
    } else if (t.kind === 'tap') {
      const p = t.pitch;
      const thr = 22;
      const sA = len - thr;
      const sB = len - 2.5 * p;
      profile = [[0, r * 0.8], [sA - 1, r * 0.8], [sA, r], [sB, r], [len, r - 0.6 * p], [len, 0]];
      const shift = (p * (((t.theta % TAU) + TAU) % TAU)) / TAU;
      for (let s = sA - p + shift; s < sB; s += p) {
        const pts = [];
        for (let i = 0; i <= 16; i++) {
          const rho = -HALF + (Math.PI * i) / 16;
          const ss = s + (p * (rho + HALF)) / TAU;
          if (ss < sA || ss > sB) continue;
          pts.push(pt(ss, r, rho));
        }
        if (pts.length > 1) lines += fmt(pts);
      }
      for (let f = 0; f < 3; f++) {
        const rho = wrap(t.theta + (f * TAU) / 3 - fv);
        if (Math.abs(rho) < HALF - 0.14) flutes += `<path class="dr-flute" d="${fmt([pt(sA, r, rho - 0.12), pt(sB, r, rho - 0.12), pt(sB, r, rho + 0.12), pt(sA, r, rho + 0.12)])}Z"/>`;
      }
    } else if (t.kind === 'boring') {
      profile = [[0, 10], [len - 18, 10], [len - 17, 13], [len - 1, 13], [len, 12.4]];
      // the insert pocket and the insert, reaching out to the bored radius
      const ang = t.theta;
      const Fi = G.frameOf(nose, a, [0, Math.cos(ang), Math.sin(ang)], [0, -Math.sin(ang), Math.cos(ang)]);
      const facing = G.dot3(Fi.u, V);
      const ins = solidSvg(G.prismOf(Fi, [[11, -3], [t.reach, -3], [t.reach, 3], [11, 3]], len - 7, len - 0.6, P), { tone: 'hi', crease: 'lo' })
        + solidSvg(G.prismOf(Fi, [[11, -4], [13.8, -4], [13.8, 4], [11, 4]], len - 9, len - 0.3, P), { tone: 'mid', crease: 'lo' });
      if (facing > 0) after = ins; else before = ins;
      const Fd = G.frameOf(G.add3(nose, G.mul3(a, len - 12)), a, [-a[1], a[0], 0], Z);
      after += dotsSvg(G.dotsOf(Fd, 0, 13, 4, P, { phase: t.theta, least: 0.2 }), { size: 0.6, tone: 'hi' });
    } else if (t.kind === 'gun') {
      profile = [[0, 9], [28, 9], [30, 6], [34, 6], [35, r], [len - 1.2, r], [len, r * 0.35]];
      const steps = 40;
      // the V groove is about a third of the circumference: wide enough to read
      flutes += band(() => t.theta - fv, 1.5, 35, len - 1, r, steps, 'dr-flute dr-groove');
      lines += curve(() => t.theta - fv, 35, len - 1, r, steps) + curve(() => t.theta + 1.5 - fv, 35, len - 1, r, steps);
    } else {
      profile = [[0, r], [len - 1, r], [len, r - 1], [len, 0]];
    }
    const body = G.solidOf(profile, F, P);
    const inner = lines ? `<path class="iso-line" data-tone="lo" d="${lines}"/>` : '';
    return { body: before + solidSvg(body, { tone: 'hi', crease: 'lo', inner }) + after, flutes };
  }

  // a dowel pin of Ø10 with chamfered ends, its front end at x
  function pinSvg(x, r) {
    const F = G.frameOf([x - 26, 0, ZC], X, Y, Z);
    return solidSvg(G.solidOf([[0, r - 0.8], [0.8, r], [25.2, r], [26, r - 0.8]], F, P), { tone: 'hi', crease: 'lo', inner: lineSvg(G.arcOf(F, 13, r, P), { tone: 'faint' }) });
  }

  // ------------------------------------------------------------ the cut face with the hole in it
  // h: { rOf(x), end, thread?: { to, pitch, r } }. back: the hatch behind the
  // hole and the bore (what the tool covers); front: the face in front of the
  // hole, which covers the part of the tool below the cut; rim: the outline.
  function sectionSvg(h) {
    const x0 = BX0;
    const x1 = BX1;
    const xs = [];
    const end = Math.min(h.end, x1);
    if (end > x0 + 0.05) {
      for (let x = x0; x < end; x += 0.5) xs.push(x);
      xs.push(end);
    }
    const prof = xs.map((x) => [x, Math.max(0, h.rOf(x))]);
    const through = h.end >= x1 && prof.length && prof[prof.length - 1][1] > 0.05;
    const rmax = prof.reduce((m, p) => Math.max(m, p[1]), 0.5);
    const top = (pts) => onTopPath(pts);
    function hatch(poly) {
      const out = [];
      const lo = x0 - BY1;
      const hi = x1 - BY0;
      for (let c = Math.ceil(lo / 6) * 6 + 2; c < hi; c += 6) {
        const ys = [];
        for (let i = 0; i < poly.length; i++) {
          const p = poly[i];
          const q = poly[(i + 1) % poly.length];
          const dp = p[0] - p[1];
          const dq = q[0] - q[1];
          if (dp === dq) continue;
          const u = (c - dp) / (dq - dp);
          if (u >= 0 && u < 1) ys.push(p[1] + u * (q[1] - p[1]));
        }
        ys.sort((a, b) => a - b);
        for (let i = 0; i + 1 < ys.length; i += 2) if (ys[i + 1] - ys[i] > 0.3) out.push(fmt([at([c + ys[i], ys[i], ZC]), at([c + ys[i + 1], ys[i + 1], ZC])]));
      }
      return out.join('');
    }
    const backPoly = [[x0, BY0], [x1, BY0], [x1, -rmax], [x0, -rmax]];
    let back = `<path class="iso-line" data-tone="faint" d="${hatch(backPoly)}"/>`;
    let front;
    let rim = '';
    if (prof.length > 1) {
      const upper = prof.map(([x, r]) => [x, r]);
      const lower = prof.map(([x, r]) => [x, -r]).reverse();
      // the opening, dark, and the far wall of the trough, a shade lighter
      back += `<path class="dr-bore" d="${fmt(upper.concat(lower).map(([x, y]) => at([x, y, ZC])))}Z"/>`;
      const wall = prof.map(([x, r]) => at([x, -r, ZC])).concat(prof.slice().reverse().map(([x, r]) => at([x, -0.72 * r, ZC - 0.69 * r])));
      back += `<path class="dr-wall" d="${fmt(wall)}Z"/>`;
      if (h.thread && h.thread.to > x0 + 1) {
        let arcs = '';
        const p = h.thread.pitch;
        const rt = h.thread.r;
        for (let x = x0 + 0.6; x < Math.min(h.thread.to, end - 2); x += p) {
          const pts = [];
          for (let i = 0; i <= 14; i++) {
            const psi = (Math.PI * i) / 14;
            pts.push(at([x + (p * psi) / TAU, -rt * Math.cos(psi), ZC - rt * Math.sin(psi)]));
          }
          arcs += fmt(pts);
        }
        back += `<path class="iso-line" data-tone="lo" d="${arcs}"/>`;
      }
      const poly = [[x0, -rmax], [x1, -rmax], [x1, BY1], [x0, BY1], ...upper, ...lower];
      const fill = poly.map(([x, y]) => [clamp(x, x0 + 0.4, x1 - 0.4), clamp(y, BY0, BY1 - 0.4)]);
      front = `<path class="iso-top" d="${top(fill)}"/><path class="iso-line" data-tone="faint" d="${hatch(poly)}"/>`;
      rim = through ? fmt(upper.map(([x, y]) => at([x, y, ZC]))) + fmt(lower.map(([x, y]) => at([x, y, ZC]))) : fmt(upper.concat(lower).map(([x, y]) => at([x, y, ZC])));
    } else {
      const poly = [[x0, -rmax], [x1, -rmax], [x1, BY1], [x0, BY1]];
      front = `<path class="iso-top" d="${top(poly.map(([x, y]) => [clamp(x, x0 + 0.4, x1 - 0.4), clamp(y, BY0, BY1 - 0.4)]))}"/><path class="iso-line" data-tone="faint" d="${hatch(poly)}"/>`;
    }
    return { back, front, rim: mark(rim, ' style="stroke-width:1.5"') };
  }
  const onTopPath = (pts) => fmt(pts.map(([x, y]) => at([x, y, ZC]))) + 'Z';

  // hole profiles: a drilled hole (radius r, 118° point, tip at xt), a spot cone (90°)
  const drilled = (r, xt) => (x) => (x > xt ? 0 : x <= xt - r * 0.6009 ? r : (r * (xt - x)) / (r * 0.6009));
  const coned = (xt) => (x) => Math.max(0, xt - x);
  const maxOf = (...fs) => (x) => Math.max(...fs.map((f) => f(x)));

  // ------------------------------------------------------------ chips and coolant
  function chipPath(cx, cy, size, turn) {
    const outer = [];
    const inner = [];
    for (let i = 0; i <= 18; i++) {
      const t = i / 18;
      const a = turn + t * TAU * 1.25;
      const rr = size * (0.42 + 0.58 * t);
      const w = size * (0.12 + 0.18 * t);
      outer.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.62]);
      inner.push([cx + Math.cos(a) * (rr - w), cy + Math.sin(a) * (rr - w) * 0.62]);
    }
    return fmt(outer.concat(inner.reverse())) + 'Z';
  }
  // chips leave the mouth of the hole and fall onto the fixture plate; deterministic in time
  function chipsSvg(clockS, rate, size, on = () => true, fast = 1) {
    let out = '';
    const period = 1 / rate;
    const life = 1.3 / fast;
    for (let i = Math.max(0, Math.floor((clockS - life) / period)); i * period <= clockS; i++) {
      const born = i * period;
      if (!on(born)) continue;
      const age = clockS - born;
      if (age > life) continue;
      const seed = Math.sin(i * 12.9898) * 43758.5453;
      const rnd = seed - Math.floor(seed);
      const ta = age * fast;
      const p = [BX0 - 1 - 32 * ta, (rnd - 0.5) * 6 + 12 * ta, ZC + 2 + 18 * ta - 60 * ta * ta];
      if (p[2] < 52) continue;
      const [sx, sy] = at(p);
      const alpha = Math.min(1, age / 0.1) * (1 - clamp((age - life * 0.8) / (life * 0.2), 0, 1));
      out += `<path class="fp-chip dr-chipon" style="opacity:${alpha.toFixed(2)}" d="${chipPath(sx, sy, size * KS * (0.85 + 0.3 * rnd), rnd * 6.28 + age * 5)}"/>`;
    }
    return out;
  }
  // coolant through the spindle: drops run along the tool's axis to the tip, then
  // stream back out of the mouth with the chips
  function coolantSvg(clockS, tip, r) {
    let out = '';
    const x0 = tip - STICK;
    for (let i = 0; i < 14; i++) {
      const s = ((clockS * 90 + (i * STICK) / 14) % STICK);
      const x = x0 + s;
      if (x > BX0 - 1 && x < tip) continue; // inside the hole the tool hides its channels
      const [sx, sy] = at([x, 0, ZC + r + 0.4]);
      out += `<circle class="dr-drop" cx="${f1(sx)}" cy="${f1(sy)}" r="${f2(0.9 * KS)}"/>`;
    }
    if (tip > BX0 + 1) {
      for (let i = 0; i < 18; i++) {
        const age = ((clockS * 1.6 + i / 18) % 1);
        const seed = Math.sin(i * 78.233) * 43758.5453;
        const rnd = seed - Math.floor(seed);
        const p = [BX0 - 1 - 40 * age, (rnd - 0.5) * 2 * r, ZC + r * 0.4 + 8 * age - 46 * age * age];
        if (p[2] < 52) continue;
        const [sx, sy] = at(p);
        out += `<circle class="dr-drop" style="opacity:${(1 - age).toFixed(2)}" cx="${f1(sx)}" cy="${f1(sy)}" r="${f2(0.75 * KS)}"/>`;
      }
    }
    return out;
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
  }

  // ------------------------------------------------------------ the scenes
  const DRILL = ['unit', 'viceB', 'block', 'viceF', 'secBack', 'tool', 'flutes', 'pin', 'secFront', 'rim', 'point', 'wander', 'chips', 'coolant'];
  const MEAS = ['cmmTable', 'legL', 'gauge', 'pinsLo', 'part', 'pinsHi', 'probe', 'legR', 'beam', 'carriage', 'mag', 'worldLabels'];
  const VIS = [DRILL, DRILL, DRILL, DRILL, DRILL, DRILL,
    ['cmmTable', 'legL', 'part', 'probe', 'legR', 'beam', 'carriage', 'mag', 'worldLabels'],
    ['cmmTable', 'gauge', 'pinsLo', 'part', 'pinsHi', 'mag', 'worldLabels']];
  const ALL = [...DRILL, ...MEAS];
  let shown = -1;

  // the state of the drilling scenes: tool, hole, extras
  function drillState(si, u) {
    const clockS = u * C.dur[si];
    const st = { tool: null, hole: { rOf: () => 0, end: BX0 }, chips: '', coolant: '', pin: '', point: '', wander: '', secAlpha: 1 };
    const spin = (rpmShown) => clockS * rpmShown;
    if (si === 0) {
      const r = 4;
      const tl = r * 0.6009;
      let kind = 'drill';
      let tip = BX0 - 14;
      let tilt = 0;
      let alpha = 1;
      let spotDepth = 0;
      let drillTip = BX0;
      if (u < 0.3) {
        tip = lerp(BX0 - 14, BX0 + 0.6, span(u, 0.04, 0.12));
        tilt = 0.03 * span(u, 0.12, 0.26);
      } else if (u < 0.38) {
        tip = lerp(BX0 + 0.6, BX0 - 14, span(u, 0.3, 0.34));
        tilt = 0.03 * (1 - span(u, 0.3, 0.33));
        alpha = 1 - span(u, 0.34, 0.37);
      } else if (u < 0.6) {
        kind = 'spot';
        alpha = span(u, 0.38, 0.41);
        spotDepth = 5 * span(u, 0.44, 0.52);
        tip = u < 0.53 ? lerp(BX0 - 14, BX0 + 5, span(u, 0.41, 0.52)) : lerp(BX0 + 5, BX0 - 14, span(u, 0.53, 0.57));
        if (u >= 0.57) alpha = 1 - span(u, 0.57, 0.6);
      } else {
        spotDepth = 5;
        alpha = span(u, 0.6, 0.63);
        drillTip = BX0 + (20 + tl) * span(u, 0.66, 0.95);
        tip = u < 0.66 ? lerp(BX0 - 14, BX0 + 2, span(u, 0.62, 0.66)) : Math.max(BX0 + 2, drillTip);
      }
      if (u >= 0.38) spotDepth = Math.max(spotDepth, u >= 0.52 ? 5 : spotDepth);
      const rr = kind === 'spot' ? 5 : r;
      st.tool = { kind, r: rr, tip, theta: spin(kind === 'spot' ? 9 : 7), tilt, alpha };
      st.hole = { rOf: maxOf(coned(BX0 + spotDepth), u >= 0.62 ? drilled(r, drillTip) : () => 0), end: Math.max(BX0 + spotDepth, u >= 0.62 ? drillTip : 0) };
      if (u > 0.68) st.chips = chipsSvg(clockS, 2.6, 2.6, (b) => b / C.dur[0] > 0.68 && b / C.dur[0] < 0.95);
      // drill wander: the meant centre line and how far the tip slid away from it
      const w = span(u, 0.12, 0.26) * (1 - span(u, 0.31, 0.34));
      if (w > 0.01) {
        const dy = Math.sin(0.03 * w) * STICK;
        const a0 = at([BX0 - 26, 0, ZC]);
        const a1 = at([BX0 + 14, 0, ZC]);
        const b0 = at([BX0 + 1, 0, ZC]);
        const b1 = at([BX0 + 1, dy, ZC]);
        st.wander = mark(fmt([a0, a1]), ' stroke-dasharray="3 3"') + mark(fmt([b0, b1]), ' style="stroke-width:2"') + `<circle class="fp-ink" cx="${f1(b1[0])}" cy="${f1(b1[1])}" r="${f2(1.1 * KS)}"/>`;
      }
    } else if (si === 1) {
      const r = 4;
      const tl = r * 0.6009;
      const deep = BX0 + 20 + tl;
      const tip = u < 0.6 ? lerp(deep, BX0 - 9, span(u, 0.02, 0.2)) : lerp(BX0 - 9, BX0 - 46, span(u, 0.6, 0.76));
      st.tool = { kind: 'drill', r, tip, theta: u < 0.2 ? spin(7) : spin(7 * 0) + 0.9, tilt: 0, alpha: 1 };
      st.hole = { rOf: maxOf(coned(BX0 + 5), drilled(r, deep)), end: deep };
      // the point angle: the two cone edges in the cut plane and an arc between them
      const on = span(u, 0.18, 0.24) * (1 - span(u, 0.6, 0.66));
      if (on > 0.01 && tip < BX0) {
        const t0 = at([tip, 0, ZC]);
        const e1 = at([tip - tl * 2.2, r * 2.2, ZC]);
        const e2 = at([tip - tl * 2.2, -r * 2.2, ZC]);
        const arc = [];
        for (let i = 0; i <= 16; i++) { const ang = Math.PI - (59 * Math.PI) / 180 + ((118 * Math.PI) / 180) * (i / 16); arc.push(at([tip + Math.cos(ang) * 6, Math.sin(ang) * 6, ZC])); }
        const lp = at([tip - 14, 0, ZC + 1]);
        st.point = `<g style="opacity:${on.toFixed(2)}">${mark(fmt([e1, t0, e2]))}${mark(fmt(arc))}${label(lp[0], lp[1], '118°', 15)}</g>`;
      }
    } else if (si === 2) {
      const tl = 4.9 * 0.6009;
      const deep = BX0 + 24 + tl;
      let tip;
      let alpha = 1;
      if (u < 0.45) tip = u < 0.1 ? lerp(BX0 - 30, BX0 + 1, span(u, 0, 0.1)) : lerp(BX0 + 1, BX0 + 22, span(u, 0.1, 0.4));
      else { tip = lerp(BX0 + 22, BX0 - 40, span(u, 0.45, 0.55)); alpha = 1 - span(u, 0.52, 0.57); }
      const reamed = u < 0.1 ? BX0 : u < 0.45 ? tip : BX0 + 22;
      st.tool = alpha > 0.01 ? { kind: 'reamer', r: 5, tip, theta: spin(3), tilt: 0, alpha } : null;
      st.hole = { rOf: (x) => (x <= reamed ? 5 : drilled(4.9, deep)(x)), end: deep };
      const pinX = lerp(BX0 - 50, BX0 + 18, span(u, 0.62, 0.9));
      if (u > 0.58) st.pin = `<g style="opacity:${span(u, 0.58, 0.62).toFixed(2)}">${pinSvg(pinX, 4.96)}</g>`;
    } else if (si === 3) {
      if (u < 0.6) {
        const r = 3.4;
        const tl = r * 0.6009;
        const deep = BX0 + 22 + tl;
        let kind = 'drill';
        let tip;
        let alpha = 1;
        let threadTo = 0;
        if (u < 0.3) {
          tip = u < 0.04 ? lerp(BX0 - 20, BX0, span(u, 0, 0.04)) : lerp(BX0, deep, span(u, 0.04, 0.24));
          if (u > 0.24) tip = lerp(deep, BX0 - 30, span(u, 0.24, 0.28));
          alpha = 1 - span(u, 0.27, 0.3);
        } else {
          kind = 'tap';
          alpha = span(u, 0.3, 0.33) * (1 - span(u, 0.56, 0.6));
          const into = u < 0.5 ? span(u, 0.34, 0.5) : 1 - span(u, 0.5, 0.58);
          tip = lerp(BX0 - 10, BX0 + 18, into);
          threadTo = u < 0.5 ? tip : BX0 + 18;
        }
        st.tool = { kind, r: kind === 'tap' ? 4 : r, tip, theta: kind === 'tap' ? (u < 0.5 ? 1 : -1) * spin(2.2) : spin(8), tilt: 0, alpha, pitch: 1.25 };
        st.hole = { rOf: u < 0.04 ? () => 0 : drilled(r, u < 0.24 ? tip : deep), end: u < 0.04 ? BX0 : u < 0.24 ? tip : deep, thread: { to: threadTo, pitch: 1.25, r: 4 } };
        st.secAlpha = 1 - span(u, 0.58, 0.6);
        if (u > 0.06 && u < 0.24) st.chips = chipsSvg(clockS, 2.6, 2.2);
      } else {
        // boring: a pre-drilled Ø30 hole is opened up to Ø40 by a boring head,
        // which then pulls back out so the step from Ø30 to Ø40 shows in the cut
        const pre = drilled(15, BX0 + 30 + 9);
        const tip = u < 0.66 ? lerp(BX0 - 30, BX0, span(u, 0.62, 0.66)) : u < 0.88 ? lerp(BX0, BX0 + 26, span(u, 0.66, 0.88)) : lerp(BX0 + 26, BX0 - 30, span(u, 0.88, 0.94));
        const bored = u < 0.88 ? Math.max(BX0, tip - 0.5) : BX0 + 25.5;
        st.secAlpha = span(u, 0.6, 0.62);
        st.tool = { kind: 'boring', r: 13, reach: 20, tip, theta: u < 0.88 ? spin(4.5) : 0, tilt: 0, alpha: span(u, 0.61, 0.64) * (1 - span(u, 0.92, 0.95)) };
        st.hole = { rOf: (x) => (x <= bored ? 20 : pre(x)), end: BX0 + 39 };
        if (u > 0.67 && u < 0.88) st.chips = chipsSvg(clockS, 2.2, 2.6);
      }
    } else if (si === 4) {
      const r = 3;
      const tl = r * 0.6009;
      const D45 = 45;
      let tip;
      let depth;
      let alpha = 1;
      let coolant = false;
      if (u < 0.6) {
        // pecking in steps of 6 mm: in, cut a step, rapid out to clear the chips, back in
        const p = span(u, 0.04, 0.58) * 0.999;
        const n = D45 / 6;
        const k = Math.floor(p * n);
        const ph = p * n - k;
        const from = k * 6;
        if (u < 0.04) { tip = lerp(BX0 - 20, BX0, span(u, 0, 0.04)); depth = 0; } else if (ph < 0.12) { tip = lerp(BX0, BX0 + from + tl, ph / 0.12); depth = from; } else if (ph < 0.62) { depth = from + 6 * ((ph - 0.12) / 0.5); tip = BX0 + depth + tl; } else if (ph < 0.82) { depth = from + 6; tip = lerp(BX0 + depth + tl, BX0 - 2, (ph - 0.62) / 0.2); } else { depth = from + 6; tip = BX0 - 2; }
        if (u >= 0.58) { depth = D45; tip = lerp(BX0 - 2, BX0 - 24, span(u, 0.58, 0.6)); alpha = 1 - span(u, 0.59, 0.6); }
        st.secAlpha = 1 - span(u, 0.58, 0.6);
        // chips burst out each time the drill pulls back
        st.chips = chipsSvg(clockS, 6, 2, (b) => { const q = span(b / C.dur[4], 0.04, 0.58) * n; const f = q - Math.floor(q); return b / C.dur[4] > 0.05 && b / C.dur[4] < 0.6 && f > 0.62 && f < 0.95; }, 1.2);
      } else {
        // the other option, in a fresh hole: a carbide drill with coolant through
        // the spindle goes the full 90 mm in one go, no pecking
        coolant = u > 0.62;
        alpha = span(u, 0.6, 0.63);
        st.secAlpha = span(u, 0.6, 0.62);
        depth = 90 * span(u, 0.66, 0.96);
        tip = u < 0.66 ? lerp(BX0 - 24, BX0, span(u, 0.62, 0.66)) : BX0 + depth + tl;
        if (u > 0.66) st.chips = chipsSvg(clockS, 4.5, 2, (b) => b / C.dur[4] > 0.66 && b / C.dur[4] < 0.96, 1.8);
      }
      st.tool = { kind: 'drill', r, tip, theta: spin(9), tilt: 0, alpha };
      st.hole = { rOf: drilled(r, BX0 + depth + tl), end: BX0 + depth + tl };
      if (coolant) st.coolant = coolantSvg(clockS, tip, r);
    } else if (si === 5) {
      const r = 3;
      const tip = u < 0.08 ? lerp(BX0 - 20, BX0, span(u, 0, 0.08)) : BX0 + 112 * span(u, 0.08, 0.92);
      st.tool = { kind: 'gun', r, tip, theta: spin(1.6), tilt: 0, alpha: 1 };
      st.hole = { rOf: (x) => (x <= tip ? r : 0), end: Math.max(BX0, tip) };
      if (u > 0.08) {
        st.coolant = coolantSvg(clockS, tip, r);
        st.chips = chipsSvg(clockS, 4, 2, (b) => b / C.dur[5] > 0.1 && b / C.dur[5] < 0.92, 1.6);
      }
    }
    return st;
  }

  function renderDrill(si, u) {
    const st = drillState(si, u);
    const t = st.tool;
    if (t) {
      const ts = toolSvg(t);
      const a = t.alpha === undefined ? 1 : t.alpha;
      set(E.tool, ts.body);
      set(E.flutes, ts.flutes);
      fade(E.tool, a);
      fade(E.flutes, a);
      move(E.unit, [t.tip - STICK - X_NUT, 0, 0]);
    } else {
      set(E.tool, '');
      set(E.flutes, '');
    }
    const sec = sectionSvg(st.hole);
    set(E.secBack, sec.back);
    set(E.secFront, sec.front);
    // the hole's outline shows once no tool fills the hole
    set(E.rim, !t || t.tip <= BX0 + 0.5 || (t.alpha ?? 1) < 0.05 ? sec.rim : '');
    for (const k of ['secBack', 'secFront', 'rim']) fade(E[k], st.secAlpha);
    set(E.pin, st.pin);
    set(E.point, st.point);
    set(E.wander, st.wander);
    set(E.chips, st.chips);
    set(E.coolant, st.coolant);
  }

  // ------------------------------------------------------------ the measuring scenes
  const [mx, my] = C.MAG;
  const ZR = 78; // px for 0,05 mm: the radius of the Ø0,1 zone
  const PXMM = ZR / 0.05;
  function probeSvg(px, py, pz) {
    // carriage on the beam, the ram down to the probe head, the stylus and its ruby ball
    const yb = py - 14;
    const top = C.BEAM_Z + 16;
    let car = solidSvg(extrudeBox(px - 12, yb - 11, 24, 22, C.BEAM_Z - 4, top + 6), { tone: 'mid', crease: 'lo' });
    car += dotsSvg([at([px - 8, yb + 11, top + 2]), at([px + 8, yb + 11, top + 2])], { size: 0.5 });
    const ramTop = C.BEAM_Z - 4;
    const head = pz + 26;
    let probe = solidSvg(extrudeBox(px - 5, py - 5, 10, 10, head + 10, ramTop), { tone: 'mid', crease: 'lo' });
    const Fh = G.frameOf([px, py, head + 10], [0, 0, -1], X, Y);
    probe += solidSvg(G.solidOf([[0, 6], [6, 6], [9, 3.6], [10, 3.6]], Fh, P), { tone: 'hi', crease: 'lo' });
    const Fs = G.frameOf([px, py, head], [0, 0, -1], X, Y);
    probe += solidSvg(G.solidOf([[0, 1.2], [24, 0.8]], Fs, P), { tone: 'hi', crease: 'lo' });
    probe += solidSvg(G.sphereOf([px, py, pz + 1.6], 2, P), { tone: 'hi', crease: 'lo' });
    return { car, probe };
  }
  function extrudeBox(x, y, w, d, z0, z1) {
    return G.prismOf(G.frameOf([0, 0, z0], Z, X, Y), [[x, y], [x + w, y], [x + w, y + d], [x, y + d]], 0, z1 - z0, P);
  }
  function pinSolid(x, y, z0, z1) {
    if (z1 - z0 < 0.2) return '';
    const F = G.frameOf([x, y, z0], Z, X, Y);
    return solidSvg(G.solidOf(z1 >= C.CMMZ + C.GAUGE_T + C.PIN_H - 0.01 ? [[0, C.HOLE_R - 0.5], [z1 - z0 - 1, C.HOLE_R - 0.5], [z1 - z0, C.HOLE_R - 1.4]] : [[0, C.HOLE_R - 0.5], [z1 - z0, C.HOLE_R - 0.5]], F, P), { tone: 'hi', crease: 'lo' });
  }

  function renderMeasure(si, u) {
    const lang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'nl';
    const h3 = C.HOLES[2];
    let partZ = C.CMMZ;
    let magOn = 1;
    let base = '';
    let ted = '';
    let zone = '';
    let perp = '';
    let hit = '';
    let labels = '';
    if (si === 6) {
      // the probe travels to hole 3, dips in and touches the wall at four points
      const go = span(u, 0.05, 0.35);
      const px = lerp(C.PART.x + C.PART.w / 2, h3[0], go);
      const py = lerp(C.PART.y + C.PART.d / 2, h3[1], go);
      const dip = span(u, 0.36, 0.46) * (1 - span(u, 0.88, 0.96));
      const pz = lerp(C.CMMZ + C.PART_T + 34, C.CMMZ + C.PART_T - 5, dip);
      const touch = clamp((u - 0.48) / 0.36, 0, 1);
      const k = Math.floor(touch * 4);
      const wob = dip > 0.99 && touch < 1 ? Math.sin((touch * 4 - k) * Math.PI) * 2.2 : 0;
      const dir = (k * Math.PI) / 2;
      const p = probeSvg(px + Math.cos(dir) * wob, py + Math.sin(dir) * wob, pz);
      set(E.carriage, p.car);
      set(E.probe, p.probe);
      for (const e of [E.legL, E.legR, E.beam]) move(e, [0, py - 14, 0]);
      const l3 = at([h3[0] + 12, h3[1] + 8, C.CMMZ + C.PART_T]);
      labels = label(l3[0], l3[1], '3', 16);
      // the magnifier: hole 3 seen from above
      base = mark(`M${mx - C.MAG_R} ${my}L${mx + C.MAG_R} ${my}M${mx} ${my - C.MAG_R}L${mx} ${my + C.MAG_R}`, ' style="stroke-width:.8;opacity:.55"');
      // theoretically exact dimensions: boxed, from the datum edges to the exact place
      const bx = mx - 84;
      const by = my + 70;
      ted = mark(`M${mx - C.MAG_R} ${my + 0.01}L${mx} ${my}`, ' style="stroke-width:1.6"') + mark(`M${mx} ${my + C.MAG_R}L${mx} ${my}`, ' style="stroke-width:1.6"')
        + `<rect class="fp-box" x="${bx - 15}" y="${my - 30}" width="30" height="22" rx="2"/>` + label(bx, my - 13, 'x', 16, 'middle', true)
        + `<rect class="fp-box" x="${mx + 8}" y="${by - 15}" width="30" height="22" rx="2"/>` + label(mx + 23, by + 2, 'y', 16, 'middle', true)
        + `<circle class="fp-ink" cx="${mx}" cy="${my}" r="3.5"/>`;
      zone = `<circle class="dr-zone" cx="${mx}" cy="${my}" r="${ZR}"/>`;
      const hitOn = span(u, 0.7, 0.78);
      if (hitOn > 0.01) {
        const hx = mx + C.DX * PXMM;
        const hy = my - C.DY * PXMM;
        hit = `<g style="opacity:${hitOn.toFixed(2)}">` + mark(`M${mx} ${my}L${f1(hx)} ${my}L${f1(hx)} ${f1(hy)}`, ' stroke-dasharray="4 3"') + mark(`M${mx} ${my}L${f1(hx)} ${f1(hy)}`, ' style="stroke-width:2"')
          + `<circle class="dr-dot" cx="${f1(hx)}" cy="${f1(hy)}" r="5"/>` + label(mx + (hx - mx) / 2, my + 22, 'dx', 15, 'middle', true) + label(hx + 8, my + (hy - my) / 2 + 5, 'dy', 15, 'start', true) + '</g>';
      }
      magOn = span(u, 0.02, 0.12);
    } else {
      // haaksheid in the magnifier, then the part goes onto the functional gauge
      magOn = 1 - span(u, 0.42, 0.5);
      const lift = span(u, 0.5, 0.62);
      const down = span(u, 0.7, 0.9);
      const top = C.CMMZ + C.GAUGE_T + C.PIN_H + 6;
      partZ = down > 0 ? lerp(top, C.CMMZ + C.GAUGE_T, down) : lerp(C.CMMZ, top, lift);
      const gOn = span(u, 0.6, 0.68);
      fade(E.gauge, gOn);
      fade(E.pinsLo, gOn);
      fade(E.pinsHi, gOn);
      move(E.gauge, [0, 0, -30 * (1 - gOn)]);
      let lo = '';
      let hi = '';
      const pTop = C.CMMZ + C.GAUGE_T + C.PIN_H;
      const z0 = C.CMMZ + C.GAUGE_T - 30 * (1 - gOn);
      for (const [x, y] of C.HOLES) {
        const zt = pTop - 30 * (1 - gOn);
        lo += pinSolid(x, y, z0, Math.min(zt, partZ));
        if (zt > partZ + C.PART_T) hi += pinSolid(x, y, partZ + C.PART_T, zt);
      }
      set(E.pinsLo, lo);
      set(E.pinsHi, hi);
      // side view: the part cut through a hole, datum face A at the bottom
      const sx = mx;
      const yA = my + 64;
      const hw = 22;
      const hTop = my - 52;
      const tiltPx = 7;
      const hatchOf = (x0, x1) => { let d = ''; for (let c = x0 - 80; c < x1; c += 9) { const a0 = Math.max(x0, c); const a1 = Math.min(x1, c + (yA - hTop)); if (a1 > a0) d += `M${a0} ${yA - (a0 - c)}L${a1} ${yA - (a1 - c)}`; } return d; };
      base = `<rect class="fp-box" x="${sx - 130}" y="${hTop}" width="${130 - hw}" height="${yA - hTop}"/><rect class="fp-box" x="${sx + hw}" y="${hTop}" width="${130 - hw}" height="${yA - hTop}"/>`
        + `<path class="iso-line" data-tone="faint" d="${hatchOf(sx - 130, sx - hw)}${hatchOf(sx + hw, sx + 130)}"/>`
        + mark(`M${sx - 130} ${yA + 1}L${sx + 130} ${yA + 1}`, ' style="stroke-width:2.4"')
        + `<path class="fp-ink" d="M${sx - 70} ${yA + 2}L${sx - 79} ${yA + 15}L${sx - 61} ${yA + 15}Z"/>` + label(sx - 50, yA + 20, 'A', 17, 'start', true);
      perp = `<rect class="dr-zone" x="${sx - 9}" y="${hTop - 12}" width="18" height="${yA - hTop + 12}"/>` + mark(`M${sx - tiltPx * 0.5} ${yA}L${sx + tiltPx * 0.5} ${hTop - 8}`, ' stroke-dasharray="6 4" style="stroke-width:1.6"')
        + label(sx + 30, hTop - 18, 'Ø', 16, 'start', true);
      const l = at([C.GAUGE.x + C.GAUGE.w - 6, C.GAUGE.y + C.GAUGE.d, C.CMMZ + 2]);
      labels = '';
      void l;
    }
    void lang;
    move(E.part, [0, 0, partZ]);
    set(E.magBase, base);
    set(E.magTed, ted);
    set(E.magZone, zone);
    set(E.magPerp, perp);
    set(E.magHit, hit);
    set(E.worldLabels, labels);
    fade(E.mag, magOn);
  }

  function render(si, u) {
    if (si !== shown) {
      shown = si;
      for (const k of ALL) show(E[k], VIS[si].includes(k));
    }
    camera(si, u);
    if (si < 6) renderDrill(si, u);
    else renderMeasure(si, u);
  }

  return { render };
})();
