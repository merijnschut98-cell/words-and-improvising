// The stage of the film "De lasrobotcel / The welding robot cell": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope), a preamble from build.mjs that defines P (projection),
// C (world constants, beat cameras), W and H, and the kit's audio warp.
//
// The cell is the world (moved by one camera per beat). Per frame it draws the
// robot arm (inverse kinematics, as in the figure eng.joining.cell), the two
// stations on the turntable with their frames, clamps and weld beads, the
// welding screen, the arc and the fumes. The cards over it (the cycle
// timeline, seam finding and tracking, the beam, a day of arc time, the cost of
// a metre of weld, the paper chain) are drawn in stage space.
/* global P, C, W, H, iso, extrude, solidSvg, towardViewer, span, beatStarts, warpU, introBeat, introCamera */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tx = (nl, en) => (EN ? en : nl);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerpN = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const frac = (v) => v - Math.floor(v);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const num = (v, dec = 0) => { const s = v.toFixed(dec); return EN ? s : s.replace('.', ','); };
  const eur = (v) => (EN ? `€${v.toFixed(2)}` : `€ ${v.toFixed(2).replace('.', ',')}`);
  const T = (x, y, text, size = 20, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
  const card = (x, y, w, h, r = 12) => `<rect class="fp-hud-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fp-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const tag = (x, y, w, text, size = 19, anchor = 'start') => {
    const x0 = anchor === 'start' ? x - 6 : anchor === 'end' ? x - w + 6 : x - w / 2;
    return `<rect class="fp-hud-bg" x="${f1(x0)}" y="${f1(y - size - 2)}" width="${f1(w)}" height="${f1(size + 10)}" rx="6"/>` + T(x, y, text, size, anchor, 'fp-small');
  };
  const arrow = (x0, y0, x1, y1, head = 9, cls = 'fp-mark', wid = 2.2) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    return `<path class="${cls}" style="stroke-width:${wid}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}M${f1(x1 - ux * head - uy * head * 0.55)} ${f1(y1 - uy * head + ux * head * 0.55)}L${f1(x1)} ${f1(y1)}L${f1(x1 - ux * head + uy * head * 0.55)} ${f1(y1 - uy * head - ux * head * 0.55)}"/>`;
  };
  const dbl = (x0, y0, x1, y1, head = 7) => { const mx = (x0 + x1) / 2; const my = (y0 + y1) / 2; return arrow(mx, my, x0, y0, head, 'fp-mark', 1.8) + arrow(mx, my, x1, y1, head, 'fp-mark', 1.8); };
  const pts2 = (pts, closed = false) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + (closed ? 'Z' : '');
  const poly = (pts, cls) => `<path class="${cls}" d="${pts2(pts, true)}"/>`;
  const line = (pts, cls = 'fp-mark', wid) => `<path class="${cls}"${wid ? ` style="stroke-width:${wid}"` : ''} d="${pts2(pts)}"/>`;
  const rect = (x, y, w, h, cls, r = 0) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}"${r ? ` rx="${r}"` : ''}/>`;

  // ------------------------------------------------------------ the cell, live
  const KS = C.KS;
  const VIEW = towardViewer(P);
  const at = (p) => iso(p, P);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const len = (a) => Math.hypot(a[0], a[1], a[2]);
  const nrm = (a) => mul(a, 1 / (len(a) || 1));
  const lerp = (a, b, t) => add(a, mul(sub(b, a), t));
  const ease = (t) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };
  const pathPts = (pts, close) => 'M' + pts.map((p) => f2(p[0]) + ' ' + f2(p[1])).join('L') + (close ? 'Z' : '');
  const { TC, TR, TZ, PED, SH_Z, LINK, TOOL, HOME, FIXT, BARS, BAR_H, JOINTS, CLAMPS } = C;
  const SHOULDER = [PED[0], PED[1], SH_Z];
  const ZTOP = TZ + FIXT.h + BAR_H;
  const toWorld = (u, v, z, phi) => [TC[0] + u * Math.cos(phi) - v * Math.sin(phi), TC[1] + u * Math.sin(phi) + v * Math.cos(phi), z];
  const jointPts = (j, phi) => [toWorld(JOINTS[j][0][0], JOINTS[j][0][1], ZTOP + 0.4, phi), toWorld(JOINTS[j][1][0], JOINTS[j][1][1], ZTOP + 0.4, phi)];
  const hdepth = (u, v, phi) => { const w = toWorld(u, v, 0, phi); return w[0] * VIEW[0] + w[1] * VIEW[1]; };
  function liveBox(u0, u1, v0, v1, z0, z1, phi, tone) {
    const pts = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => toWorld(u, v, 0, phi).slice(0, 2));
    return solidSvg(extrude(pts, z0, z1 - z0, P), { tone });
  }
  function poseOf(tcp) {
    const wrist = add(tcp, [0, 0, TOOL]);
    const yaw = Math.atan2(wrist[1] - PED[1], wrist[0] - PED[0]);
    const u = [Math.cos(yaw), Math.sin(yaw), 0];
    const s = add(SHOULDER, mul(u, 6));
    const d = sub(wrist, s);
    let D = len(d);
    const maxD = LINK[0] + LINK[1] - 0.1;
    if (D > maxD) D = maxD;
    const a = (LINK[0] * LINK[0] - LINK[1] * LINK[1] + D * D) / (2 * D);
    const h = Math.sqrt(Math.max(0, LINK[0] * LINK[0] - a * a));
    const dn = nrm(d);
    const up = nrm(sub([0, 0, 1], mul(dn, dn[2])));
    const elbow = add(add(s, mul(dn, a)), mul(up, h));
    return { u, n: [-Math.sin(yaw), Math.cos(yaw), 0], elbow, wrist, tcp };
  }
  const cylOf = (p) => ({ th: Math.atan2(p[1] - PED[1], p[0] - PED[0]), r: Math.hypot(p[0] - PED[0], p[1] - PED[1]), z: p[2] });
  const fromCyl = (c) => [PED[0] + c.r * Math.cos(c.th), PED[1] + c.r * Math.sin(c.th), c.z];
  function lerpCyl(a, b, t) {
    const A = cylOf(a);
    const B = cylOf(b);
    let dth = B.th - A.th;
    if (dth > Math.PI) dth -= 2 * Math.PI;
    if (dth < -Math.PI) dth += 2 * Math.PI;
    return fromCyl({ th: A.th + dth * t, r: A.r + (B.r - A.r) * t, z: A.z + (B.z - A.z) * t });
  }
  // the robot's tool point while it welds the six seams of the station at phi (wp 0..1)
  function weldPath(wp, phi) {
    const SL = JOINTS.length;
    if (wp >= 1) return { tcp: lerpCyl(jointPts(SL - 1, phi)[1], HOME, 1), arc: false };
    const kk = Math.min(SL - 1, Math.floor(wp * SL));
    const f = wp * SL - kk;
    const [a, b] = jointPts(kk, phi);
    const prev = kk === 0 ? HOME : jointPts(kk - 1, phi)[1];
    if (f < 0.2) { const gg = ease(f / 0.2); return { tcp: add(lerpCyl(prev, a, gg), [0, 0, Math.sin(gg * Math.PI) * (kk === 0 ? 0 : 6)]), arc: false }; }
    return { tcp: lerp(a, b, (f - 0.2) / 0.8), arc: true };
  }
  // a station: { phi, bars 0..5, clamps, beads: [p 0..1 per joint], heat }
  const allBeads = (p = 1) => JOINTS.map(() => p);
  const weldingBeads = (wp) => JOINTS.map((_, j) => clamp((wp * JOINTS.length - j - 0.2) / 0.8, 0, 1));
  function loadingState(lp) {
    if (lp < 0.15) return { bars: 5, clamps: false, beads: allBeads() };
    if (lp < 0.2) return { bars: 0, clamps: false, beads: [] };
    if (lp < 0.8) return { bars: Math.min(5, Math.ceil(((lp - 0.2) / 0.6) * 5)), clamps: false, beads: [] };
    return { bars: 5, clamps: lp >= 0.9, beads: [] };
  }
  function stationSvg(s) {
    const { phi } = s;
    const z0 = TZ;
    const z1 = TZ + FIXT.h;
    let out = liveBox(FIXT.u[0], FIXT.u[1], FIXT.v[0], FIXT.v[1], z0, z1, phi, 'lo');
    out += liveBox(-30, -28, -32, -30, z1, z1 + 3, phi, 'mid') + liveBox(-30, -28, -10, -8, z1, z1 + 3, phi, 'mid');
    const items = [];
    for (let b = 0; b < s.bars; b++) {
      const [u0, u1, v0, v1] = BARS[b];
      items.push({ d: hdepth((u0 + u1) / 2, (v0 + v1) / 2, phi), svg: liveBox(u0, u1, v0, v1, z1, z1 + BAR_H, phi, 'hi') });
    }
    items.sort((a, b) => a.d - b.d);
    out += items.map((i) => i.svg).join('');
    const cl = CLAMPS.map(([cu, cv]) => {
      const dir = cv < -20 ? 1 : -1;
      let gg = liveBox(cu - 1.5, cu + 1.5, Math.min(cv, cv + dir * 2), Math.max(cv, cv + dir * 2), z1, z1 + 6, phi, 'mid');
      if (s.clamps) {
        const a0 = cv + dir * 1;
        const a1 = cv + dir * 6.5;
        const tip = cv + dir * 5.6;
        gg += liveBox(cu - 0.7, cu + 0.7, tip - 0.7, tip + 0.7, z1 + BAR_H, z1 + 6, phi, 'lo');
        gg += liveBox(cu - 1, cu + 1, Math.min(a0, a1), Math.max(a0, a1), z1 + 6, z1 + 7.4, phi, 'mid');
      } else {
        const a0 = cv + dir * 0.3;
        const a1 = cv + dir * 1.7;
        gg += liveBox(cu - 1, cu + 1, Math.min(a0, a1), Math.max(a0, a1), z1 + 6, z1 + 12, phi, 'mid');
      }
      return { d: hdepth(cu, cv, phi), svg: gg };
    });
    cl.sort((a, b) => a.d - b.d);
    out += cl.map((i) => i.svg).join('');
    (s.beads || []).forEach((p, j) => {
      if (p <= 0) return;
      const [a, b] = jointPts(j, phi);
      const d = pathPts([at(a), at(lerp(a, b, p))]);
      out += `<path class="wf-bead wf-cold" stroke-width="${f2(1.5 * KS)}" d="${d}"/>`;
      if (s.hot === j) out += `<path class="wf-bead wf-hotb" stroke-width="${f2(1.5 * KS)}" d="${d}"/>`;
    });
    return out;
  }
  function screenSvg(theta) {
    const zt = TZ + 54;
    const posts = [-1, 1].map((sg) => ({ d: hdepth(sg * (TR - 3), 0, theta), svg: liveBox(sg * (TR - 3) - 1, sg * (TR - 3) + 1, -1, 1, TZ, zt, theta, 'mid') }));
    posts.sort((a, b) => a.d - b.d);
    const cu = TR - 4;
    const Cp = (u, z) => at(toWorld(u, 0, z, theta));
    const panel = pathPts([Cp(-cu, TZ), Cp(cu, TZ), Cp(cu, zt - 2), Cp(-cu, zt - 2)], true);
    const pleats = [];
    for (let u = -cu + 5; u < cu - 1; u += 5) pleats.push(pathPts([Cp(u, TZ), Cp(u, zt - 2)]));
    return posts[0].svg + `<path class="wf-curtain" d="${panel}"/><path class="iso-line" data-tone="faint" d="${pleats.join('')}"/><path class="iso-line" data-tone="lo" d="${panel}"/>`
      + posts[1].svg + liveBox(-(TR - 2), TR - 2, -1.2, 1.2, zt - 2, zt + 1, theta, 'mid');
  }
  // the arm as stroked capsules and end discs (strings, one slot per cue)
  const SEG = (a, b) => { const p = at(a); const q = at(b); return `M${f2(p[0])} ${f2(p[1])}L${f2(q[0])} ${f2(q[1])}`; };
  function ringPts(c, axis, r, n) {
    let e1 = Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const dd = e1[0] * axis[0] + e1[1] * axis[1] + e1[2] * axis[2];
    e1 = nrm(sub(e1, mul(axis, dd)));
    const e2 = [axis[1] * e1[2] - axis[2] * e1[1], axis[2] * e1[0] - axis[0] * e1[2], axis[0] * e1[1] - axis[1] * e1[0]];
    const out = [];
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; out.push(at(add(c, add(mul(e1, r * Math.cos(t)), mul(e2, r * Math.sin(t)))))); }
    return out;
  }
  function cyl(a, b, axis, r, hubR) {
    const facing = axis[0] * VIEW[0] + axis[1] * VIEW[1] + axis[2] * 0.6;
    const nearEnd = facing >= 0 ? b : a;
    const farEnd = facing >= 0 ? a : b;
    const w = 2 * r * KS;
    return `<path class="wf-endc" d="${pathPts(ringPts(farEnd, axis, r, 28), true)}"/>`
      + `<path class="wf-cyl wf-o" stroke-width="${f2(w + 1.1)}" d="${SEG(a, b)}"/><path class="wf-cyl wf-f" stroke-width="${f2(w)}" d="${SEG(a, b)}"/>`
      + `<path class="wf-endc" d="${pathPts(ringPts(nearEnd, axis, r, 28), true)}"/>`
      + (hubR ? `<path class="wf-hub" d="${pathPts(ringPts(nearEnd, axis, hubR, 20), true)}"/>` : '');
  }
  function cap(a, b, r, fill = 'wf-f', top = false) {
    const d = SEG(a, b);
    const w = 2 * r * KS;
    return `<path class="wf-cap wf-o" stroke-width="${f2(w + 1.1)}" d="${d}"/><path class="wf-cap ${fill}" stroke-width="${f2(w)}" d="${d}"/>`
      + (top ? `<path class="wf-cap wf-t" stroke-width="${f2(w * 0.32)}" d="${SEG(add(a, [0, 0, r * 0.45]), add(b, [0, 0, r * 0.45]))}"/>` : '');
  }
  function armSvg(tcp) {
    const { u, n, elbow, wrist } = poseOf(tcp);
    const side = n[0] * VIEW[0] + n[1] * VIEW[1] >= 0 ? 1 : -1;
    const ns = mul(n, side);
    const so = add(SHOULDER, mul(u, 6));
    const arm = cyl(add(so, mul(ns, -9)), add(so, mul(ns, 9)), ns, 10.5, 4.6)
      + cap(add(so, mul(ns, 5)), add(elbow, mul(ns, 5)), 6.4, 'wf-f', true)
      + cyl(add(elbow, mul(ns, -1)), add(elbow, mul(ns, 11)), ns, 7.4, 3)
      + cap(add(elbow, mul(ns, 5)), wrist, 4.8, 'wf-f', true);
    const fa = nrm(sub(wrist, elbow));
    const up = nrm(sub([0, 0, 1], mul(fa, fa[2])));
    const f0 = add(add(elbow, mul(fa, 6)), add(mul(up, 7.6), mul(ns, 4)));
    const fe = add(add(elbow, mul(fa, 22)), add(mul(up, 7.6), mul(ns, 4)));
    const feeder = cap(f0, fe, 3.6, 'wf-m');
    const fl0 = add(wrist, [0, 0, -3.6]);
    const fl1 = add(wrist, [0, 0, -5.6]);
    const tb1 = add(wrist, [0, 0, -12]);
    const end = add(fl1, mul(ns, 2.6));
    const mid = add(lerp(fe, end, 0.5), add(mul(up, 6), mul(ns, 3)));
    const hp = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; hp.push(add(add(mul(fe, (1 - t) * (1 - t)), mul(mid, 2 * t * (1 - t))), mul(end, t * t))); }
    const hd = pathPts(hp.map(at));
    const torch = cyl(add(wrist, mul(ns, -4.6)), add(wrist, mul(ns, 4.6)), ns, 4, 1.6)
      + cyl(fl0, fl1, [0, 0, -1], 4.2, 0)
      + `<path class="wf-cap wf-o" stroke-width="${f2(2.4 * KS + 1.1)}" d="${hd}"/><path class="wf-cap wf-hose" stroke-width="${f2(2.4 * KS)}" d="${hd}"/>`
      + cap(fl1, tb1, 2.3, 'wf-f', true)
      + cap(tb1, add(tcp, [0, 0, 1.6]), 1.5, 'wf-m')
      + `<path class="wf-wire" d="${SEG(add(tcp, [0, 0, 1.6]), tcp)}"/>`;
    return { arm, feeder, torch };
  }
  function arcSvg(tcp, u) {
    const [x, y] = at(tcp);
    const fl = 0.85 + 0.15 * Math.sin(u * 997) * Math.sin(u * 433);
    let out = '<defs><radialGradient id="wf-glow"><stop offset="0" class="wf-glow0"/><stop offset="1" class="wf-glow1"/></radialGradient></defs>';
    out += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(12 * KS * fl)}" fill="url(#wf-glow)"/>`;
    out += `<circle class="wf-core" cx="${f2(x)}" cy="${f2(y)}" r="${f2(1.1 * KS * (0.8 + 0.4 * fl))}"/>`;
    for (let i = 0; i < 3; i++) {
      const a = frac(u * 61.7 + i * 0.37) * Math.PI * 2;
      const r = (2 + 4 * frac(u * 37.3 + i * 0.61)) * KS;
      out += `<circle class="wf-spark" cx="${f2(x + r * Math.cos(a))}" cy="${f2(y + r * Math.sin(a) * 0.6)}" r="${f2(0.35 * KS)}"/>`;
    }
    return out;
  }
  // fumes: soft puffs rising from the arc toward the hood
  function fumeSvg(tcp, u, strength) {
    if (strength <= 0.01) return '';
    let out = '';
    const hood = [C.FUME[0], C.FUME[1] + 9, 106];
    for (let i = 0; i < 9; i++) {
      const t = frac(u * 6 + i / 9);
      const p = lerp(add(tcp, [0, 0, 3]), hood, ease(t));
      const [x, y] = at(add(p, [Math.sin(i * 2.1 + t * 5) * 3, 0, 0]));
      out += `<circle class="wf-smoke" cx="${f2(x)}" cy="${f2(y)}" r="${f2((1.6 + 3.2 * t) * KS)}" opacity="${f2(strength * 0.32 * Math.sin(Math.PI * t))}"/>`;
    }
    return out;
  }
  // draws the cell: st = { theta, stations: [s0, s1] (s0 sits at phi = theta), tcp, arc, u, fumes }
  function drawCell(st) {
    const ss = st.stations.map((s, i) => ({ ...s, phi: st.theta + i * Math.PI }));
    const order = ss.map((x) => ({ x, d: hdepth(0, -20, x.phi) })).sort((a, b) => a.d - b.d);
    set(E.far, stationSvg(order[0].x));
    set(E.near, stationSvg(order[1].x));
    set(E.screen, screenSvg(st.theta));
    const a = armSvg(st.tcp);
    set(E.arm, a.arm);
    set(E.feeder, a.feeder);
    set(E.torch, a.torch);
    set(E.arc, st.arc ? arcSvg(st.tcp, st.u) : '');
    set(E.fumes, fumeSvg(st.tcp, st.u, st.fumes || 0));
    if (E.stackArc) E.stackArc.classList.toggle('wf-lamp', !!st.arc);
  }
  // the steady rhythm: the robot welds the back station while the operator loads the front one
  function running(u, rate = 1.6) {
    const c = frac(u * rate);
    const w = weldPath(c, 0);
    return {
      theta: 0, tcp: w.tcp, arc: w.arc, u,
      stations: [{ bars: 5, clamps: true, beads: weldingBeads(c), hot: w.arc ? Math.min(5, Math.floor(c * 6)) : -1 }, loadingState(clamp((c * 6) / 4, 0, 1))],
    };
  }

  // ------------------------------------------------------------ s1: the program on the pendant
  function progCard(p) {
    let s = card(330, 28, 286, 300);
    s += T(473, 62, tx('programma', 'program'), 20, 'middle', 'fp-label');
    const rows = [['P1', tx('aanloop', 'approach'), ''], ['P2', tx('las 1', 'weld 1'), '10 m/min'], ['P3', tx('las 2', 'weld 2'), '10 m/min'], ['P4', tx('reinigen', 'clean'), '']];
    rows.forEach(([a, b, c2], i) => {
      if (p < 0.05 + i * 0.12) return;
      const y = 104 + i * 42;
      s += rect(346, y - 24, 254, 34, 'wf-bx', 6) + T(358, y, a, 19, 'start', 'fp-big') + T(404, y, b, 19, 'start', 'fp-small');
      if (c2) s += T(592, y, c2, 19, 'end', 'fp-small');
    });
    if (p > 0.55) s += T(473, 290, tx('of offline, vanuit 3D', 'or offline, from 3D'), 19, 'middle', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ s2: the cycle, one station against two
  const GX = (m) => 150 + m * 42; // minutes → x
  function cycleBase() {
    let s = card(24, 24, 592, 352);
    s += T(320, 58, tx('één frame, in minuten', 'one frame, in minutes'), 20, 'middle', 'fp-label');
    s += line([[GX(0), 334], [GX(10.4), 334]]);
    for (let m = 0; m <= 10; m += 2) s += line([[GX(m), 334], [GX(m), 342]]) + T(GX(m), 362, String(m), 19, 'middle', 'fp-small');
    return s;
  }
  function gantt(y, segs, g) {
    let s = '';
    let t = 0;
    const end = g * segs.reduce((a, x) => a + x[0], 0);
    for (const [d, cls] of segs) {
      const w = Math.max(0, Math.min(t + d, end) - t);
      if (w > 0) s += rect(GX(t), y, GX(t + w) - GX(t), 26, cls, 4);
      t += d;
    }
    return s;
  }
  function cycleOne(g) {
    const { weld, load } = C.CELL;
    let s = T(40, 102, tx('1 station', '1 station'), 20, 'start', 'fp-big');
    s += T(40, 132, 'robot', 19, 'start', 'fp-small') + T(40, 164, 'operator', 19, 'start', 'fp-small');
    s += gantt(112, [[weld, 'wf-on'], [load, 'wf-idle']], g) + gantt(144, [[weld, 'wf-idle'], [load, 'wf-fill']], g);
    if (g > 0.95) s += T(GX(10) - 4, 102, `= ${C.CELL.one} min · ${num(C.CELL.perOne)}${tx('/uur', '/h')}`, 19, 'end', 'fp-label');
    return s;
  }
  function cycleTwo(g) {
    const { weld, load, turn } = C.CELL;
    let s = T(40, 214, tx('2 stations', '2 stations'), 20, 'start', 'fp-big');
    s += T(40, 244, 'robot', 19, 'start', 'fp-small') + T(40, 276, 'operator', 19, 'start', 'fp-small');
    s += gantt(224, [[weld, 'wf-on'], [turn, 'wf-idle'], [weld * 0.6, 'wf-on']], g) + gantt(256, [[load, 'wf-fill'], [weld - load + turn, 'wf-idle'], [load * 0.6, 'wf-fill']], g);
    if (g > 0.4) s += line([[GX(C.CELL.two), 212], [GX(C.CELL.two), 290]], 'wf-dash');
    if (g > 0.95) s += T(GX(10) - 4, 214, `= ${num(C.CELL.two, 1)} min · ${num(C.CELL.perTwo, 1)}${tx('/uur', '/h')}`, 19, 'end', 'fp-label');
    return s;
  }

  // ------------------------------------------------------------ s4: finding the seam (a fillet joint in section, and from above)
  // section: a horizontal plate and a vertical plate meeting at the corner (x 180, y 250)
  const SX = 180;
  const SY = 250;
  const MM = 26; // px per mm near the corner
  function seamBase() {
    let s = card(24, 24, 592, 352);
    s += rect(56, SY, 250, 34, 'wf-st') + rect(SX - 32, 96, 32, SY - 96, 'wf-st');
    s += T(165, 362, tx('doorsnede', 'section'), 19, 'middle', 'fp-small');
    return s;
  }
  function wire(x, y, h = 70) { return rect(x - 0.6 * MM, y - h, 1.2 * MM, h, 'wf-bx', 3) + rect(x - 18, y - h - 50, 36, 50, 'wf-bx', 8); }
  function seamTol(p) {
    const cx = SX + 0.6 * MM;
    const cy = SY - 0.6 * MM;
    let s = `<circle class="wf-band" cx="${f1(SX)}" cy="${f1(SY)}" r="${f1(0.6 * MM * 1.414 * Math.min(1, p * 2))}"/>`;
    s += wire(cx, cy - 2);
    if (p > 0.4) s += dbl(SX - 0.6 * MM, SY + 56, SX + 0.6 * MM, SY + 56) + T(SX, SY + 82, `±${num(C.SEAM.tol, 1)} mm`, 19, 'middle', 'fp-label');
    if (p > 0.6) s += T(300, 120, tx('draad', 'wire') + ` Ø${num(C.SEAM.wire, 1)} mm`, 19, 'start', 'fp-small') + arrow(296, 126, cx + 18, 150, 8, 'fp-mark', 1.6);
    return s;
  }
  function seamTouch(p) {
    // the programmed corner is off by 2 mm; the wire touches the wall, then the plate, and the program shifts
    const off = 2 * MM;
    const px = SX + off;
    let s = `<circle class="wf-dash" cx="${f1(px)}" cy="${f1(SY - off * 0.4)}" r="9"/>` + T(px + 10, SY + 62, tx('geprogrammeerd', 'programmed'), 19, 'middle', 'fp-small');
    const a = span(p, 0.05, 0.35);
    const b = span(p, 0.4, 0.7);
    let wx = px + 40;
    let wy = SY - 70;
    if (p < 0.38) { wx = lerpN(px + 40, SX + 0.6 * MM, a); wy = SY - 70; } else { wx = SX + 60; wy = lerpN(SY - 70, SY, b); }
    s += wire(wx, wy, 50);
    if (a > 0.98) s += `<circle class="fp-ink" cx="${f1(SX)}" cy="${f1(SY - 70)}" r="5"/>`;
    if (b > 0.98) s += `<circle class="fp-ink" cx="${f1(SX + 60)}" cy="${f1(SY)}" r="5"/>`;
    if (p > 0.75) s += arrow(px, SY - off * 0.4 + 14, SX + 4, SY - 6, 9, 'fp-mark', 2.2) + tag(330, 300, 270, tx('programma schuift mee', 'the program shifts'), 19, 'start');
    return s;
  }
  function seamTrack(p) {
    // from above: the torch weaves along the seam; the current peaks near each wall
    let s = rect(340, 80, 256, 6, 'wf-bx', 2) + T(468, 70, tx('van boven', 'from above'), 19, 'middle', 'fp-small');
    const pts = [];
    const cur = [];
    const n = 80;
    const g = span(p, 0.05, 0.9);
    for (let i = 0; i <= n * g; i++) {
      const x = 350 + (236 * i) / n;
      const w = Math.sin((i / n) * Math.PI * 10);
      pts.push([x, 130 + 30 * w]);
      cur.push([x, 300 - 40 * Math.pow(Math.abs(w), 3)]);
    }
    s += line([[350, 130], [586, 130]], 'wf-dash');
    if (pts.length > 1) s += line(pts, 'wf-sig') + line(cur, 'wf-sig');
    s += line([[350, 300], [590, 300]]) + T(468, 330, tx('lasstroom', 'welding current'), 19, 'middle', 'fp-small');
    s += T(596, 230, tx('pieken = wanden', 'peaks = walls'), 19, 'end', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ s5: the beam, seven pieces and six butt welds
  const BX0 = 60;
  const BX1 = 580;
  const BY = 140;
  const BH = 56;
  const jx = (j) => BX0 + ((BX1 - BX0) * (j + 1)) / 7;
  const SEQ = [2, 3, 1, 4, 0, 5]; // middle out, alternating
  function beamBase(scale = 1, y = BY, ghost = false) {
    const w = (BX1 - BX0) * scale;
    const x0 = 320 - w / 2;
    let s = '';
    for (let i = 0; i < 7; i++) s += rect(x0 + (w * i) / 7 + 2, y, w / 7 - 4, BH, ghost ? 'wf-idle' : 'wf-st', 2);
    return s;
  }
  function beamTack(p) {
    let s = '';
    for (let j = 0; j < 6; j++) if (p > 0.1 + j * 0.1) s += rect(jx(j) - 4, BY - 3, 8, 6, 'wf-weld', 2) + rect(jx(j) - 4, BY + BH - 3, 8, 6, 'wf-weld', 2);
    return s;
  }
  function beamSeq(p) {
    let s = '';
    SEQ.forEach((j, k) => {
      const g = clamp((p - 0.08 - k * 0.13) / 0.12, 0, 1);
      if (g <= 0) return;
      s += rect(jx(j) - 3, BY, 6, BH * g, 'wf-weld', 1);
      s += `<circle class="wf-bx" cx="${f1(jx(j))}" cy="${BY - 30}" r="15"/>` + T(jx(j), BY - 23, String(k + 1), 19, 'middle', 'fp-big');
    });
    if (p > 0.85) s += arrow(320, BY + BH + 30, 200, BY + BH + 30) + arrow(320, BY + BH + 30, 440, BY + BH + 30);
    return s;
  }
  function beamShrink(p) {
    let s = line([[BX0, 268], [BX0, 300]]) + line([[BX1, 268], [BX1, 300]]);
    s += dbl(BX0, 284, BX1, 284) + tag(320, 270, 120, `${C.BEAM.len} m`, 19, 'middle');
    if (p > 0.3) s += tag(320, 340, 380, `${C.BEAM.short} mm / ${C.BEAM.welds} = ${num(C.BEAM.perWeld, 1)} mm ${tx('per las', 'per weld')}`, 20, 'middle');
    return s;
  }
  function beamPreset(p) {
    const ok = [0.3, -0.6, 0.8, -0.2, 0.5];
    let s = line([[BX0, 268], [BX0, 300]]) + line([[BX1, 268], [BX1, 300]]) + dbl(BX0, 284, BX1, 284) + tag(320, 270, 120, `${C.BEAM.len} m`, 19, 'middle');
    s += T(460, 330, tx('5 liggers', '5 beams'), 19, 'end', 'fp-small');
    s += rect(476, 318, 120, 22, 'wf-band', 4);
    ok.forEach((v, i) => { if (p > 0.45 + i * 0.08) s += `<circle class="fp-ink" cx="${f1(536 + v * 50)}" cy="329" r="5"/>`; });
    if (p > 0.85) s += T(536, 364, `±${C.BEAM.after} mm`, 19, 'middle', 'fp-label');
    return s;
  }

  // ------------------------------------------------------------ s6: a day of arc time
  const DX = (h) => 150 + h * 54; // hours → x
  const HAND = [[0.4, 0.5], [1.2, 0.3], [1.9, 0.4], [3.1, 0.3], [4.2, 0.5], [5.3, 0.3], [6.4, 0.4], [7.2, 0.2]];
  const ROBO = [[0.1, 1.5], [1.75, 1.4], [3.3, 1.45], [4.95, 1.5], [6.6, 1.25]];
  function dayBase() {
    let s = card(24, 24, 592, 352) + T(320, 58, tx('een dag van 8 uur', 'an 8-hour day'), 20, 'middle', 'fp-label');
    s += T(40, 116, tx('hand', 'hand'), 20, 'start', 'fp-big') + T(40, 206, 'robot', 20, 'start', 'fp-big');
    s += rect(DX(0), 94, DX(8) - DX(0), 30, 'wf-idle', 4) + rect(DX(0), 184, DX(8) - DX(0), 30, 'wf-idle', 4);
    for (let h = 0; h <= 8; h += 2) s += line([[DX(h), 236], [DX(h), 244]]) + T(DX(h), 266, `${h}${tx('u', 'h')}`, 19, 'middle', 'fp-small');
    return s;
  }
  function dayArc(p) {
    let s = '';
    const lim = 8 * span(p, 0.02, 0.8);
    for (const [a, d] of HAND) if (a < lim) s += rect(DX(a), 94, DX(Math.min(a + d, lim)) - DX(a), 30, 'wf-on', 3);
    for (const [a, d] of ROBO) if (a < lim) s += rect(DX(a), 184, DX(Math.min(a + d, lim)) - DX(a), 30, 'wf-on', 3);
    s += T(DX(8), 150, tx('boog brandt', 'arc burning'), 19, 'end', 'fp-small') + rect(DX(8) - 158, 136, 16, 16, 'wf-on', 3);
    return s;
  }
  function dayBf() {
    return tag(320, 314, 300, tx('met de hand 10–30%', 'by hand 10–30%'), 20, 'middle')
      + tag(320, 354, 300, tx('robotcel tot ~90%', 'robot cell up to ~90%'), 20, 'middle');
  }
  function dutyCard(p) {
    let s = card(24, 24, 592, 352) + T(320, 62, tx('inschakelduur van de stroombron', 'duty cycle of the power source'), 20, 'middle', 'fp-label');
    const cx = 200;
    const cy = 220;
    const r = 110;
    const on = (C.DUTY.pct / 100) * span(p, 0.05, 0.6);
    const a0 = -Math.PI / 2;
    const a1 = a0 + on * Math.PI * 2;
    const large = on > 0.5 ? 1 : 0;
    s += `<circle class="wf-idle" cx="${cx}" cy="${cy}" r="${r}"/>`;
    if (on > 0.001) s += `<path class="wf-on" d="M${cx} ${cy}L${f1(cx + r * Math.cos(a0))} ${f1(cy + r * Math.sin(a0))}A${r} ${r} 0 ${large} 1 ${f1(cx + r * Math.cos(a1))} ${f1(cy + r * Math.sin(a1))}Z"/>`;
    for (let m = 0; m < 10; m++) { const a = a0 + (m / 10) * Math.PI * 2; s += line([[cx + (r - 8) * Math.cos(a), cy + (r - 8) * Math.sin(a)], [cx + r * Math.cos(a), cy + r * Math.sin(a)]]); }
    s += T(cx, cy + 8, '10 min', 20, 'middle', 'fp-big');
    if (p > 0.6) {
      s += T(350, 170, `${C.DUTY.pct}% ${tx('bij', 'at')} ${C.DUTY.amp} A`, 22, 'start', 'fp-big');
      s += T(350, 210, tx('6 min lassen', '6 min welding'), 19, 'start', 'fp-small') + T(350, 242, tx('4 min afkoelen', '4 min cooling'), 19, 'start', 'fp-small');
      s += T(350, 300, tx('een eigenschap van de', 'a rating of the'), 19, 'start', 'fp-small') + T(350, 326, tx('stroombron', 'power source'), 19, 'start', 'fp-small');
    }
    return s;
  }
  function dataCard(p) {
    let s = card(24, 24, 592, 352) + T(320, 62, tx('boogtijd per ploeg', 'arc time per shift'), 20, 'middle', 'fp-label');
    // a power source sends its records to the screen
    s += rect(56, 150, 96, 150, 'wf-bx', 8) + rect(70, 168, 68, 30, 'fp-hud-bg', 4) + T(104, 330, tx('stroombron', 'power source'), 19, 'middle', 'fp-small');
    for (let i = 0; i < 3; i++) s += `<circle class="fp-ink" cx="${76 + i * 28}" cy="230" r="5"/>`;
    s += arrow(160, 225, 236, 225, 9, 'fp-mark', 2);
    s += rect(246, 100, 344, 230, 'wf-bx', 10);
    const hs = [0.62, 0.78, 0.55];
    hs.forEach((h, i) => {
      const g = span(p, 0.1 + i * 0.15, 0.4 + i * 0.15);
      s += rect(290 + i * 100, 300 - 170 * h * g, 56, 170 * h * g, 'wf-fill', 4) + T(318 + i * 100, 322, `${tx('ploeg', 'shift')} ${i + 1}`, 19, 'middle', 'fp-small');
    });
    return s;
  }

  // ------------------------------------------------------------ s7: the cost of a metre of weld
  const CY0 = 320; // the bars' base
  const CK = 26; // px per euro
  function costBase() {
    let s = card(24, 24, 592, 352) + T(320, 58, tx(`${num(C.COST.arc, 1)} min boog per meter`, `${num(C.COST.arc, 1)} min of arc per metre`), 20, 'middle', 'fp-label');
    s += line([[60, CY0], [590, CY0]]);
    return s;
  }
  function bar(x, v, g, label, sub2, cls = 'wf-fill') {
    const h = v * CK * g;
    let s = rect(x, CY0 - h, 92, h, cls, 4) + T(x + 46, CY0 + 26, label, 19, 'middle', 'fp-label') + T(x + 46, CY0 + 50, sub2, 19, 'middle', 'fp-small');
    if (g > 0.95) s += T(x + 46, CY0 - h - 10, eur(v), 20, 'middle', 'fp-big');
    return s;
  }
  function costBars(kb, p) {
    const { hand, robot } = C.COST;
    let s = bar(80, C.COST.handM, kb === 0 ? 0 : kb === 1 ? span(p, 0.05, 0.4) : 1, tx('hand', 'hand'), `${Math.round(hand.bf * 100)}% · €${hand.eur}`);
    s += bar(220, C.COST.robotM, kb === 0 ? 0 : kb === 1 ? span(p, 0.45, 0.8) : 1, 'robot', `${Math.round(robot.bf * 100)}% · €${robot.eur}`);
    if (kb === 0) s += T(320, 180, `${C.COST.g} g/m · ${C.COST.rate} kg/${tx('u', 'h')}`, 22, 'middle', 'fp-big');
    return s;
  }
  function costWire(on, p) {
    return on ? bar(360, C.COST.wireM, span(p, 0.1, 0.5), tx('draad', 'wire'), `${Math.round(C.COST.wire.eff * 100)}%`) : '';
  }
  function costEven(p) {
    let s = bar(500, C.COST.lowM, span(p, 0.05, 0.45), 'robot', `${Math.round(C.COST.low * 100)}% · €${C.COST.robot.eur}`);
    const y = CY0 - C.COST.handM * CK;
    if (p > 0.5) s += line([[70, y], [600, y]], 'wf-dash') + tag(420, y - 14, 200, tx(`omslag ${Math.round(C.COST.even * 100)}%`, `break-even ${Math.round(C.COST.even * 100)}%`), 19, 'middle');
    return s;
  }

  // ------------------------------------------------------------ s8: weld quality as a system
  function sysBase() {
    return card(24, 24, 592, 352);
  }
  function sysIso(p) {
    let s = T(110, 62, tx('uitvoeringsklasse', 'execution class'), 19, 'middle', 'fp-small') + T(300, 62, 'ISO 3834', 20, 'middle', 'fp-label');
    [1, 2, 3, 4].forEach((c, i) => {
      if (p < 0.05 + i * 0.12) return;
      const y = 82 + i * 46;
      s += rect(60, y, 100, 34, 'wf-bx', 6) + T(110, y + 24, `EXC${c}`, 19, 'middle', 'fp-big');
      s += arrow(166, y + 17, 232, y + 17, 8, 'fp-mark', 1.8);
      const part = C.EXC[c];
      s += rect(240, y, 120, 34, 'wf-bx', 6) + T(300, y + 24, `${tx('deel', 'part')} ${part}`, 19, 'middle', 'fp-big');
    });
    return s;
  }
  function sysCe(p) {
    const g = span(p, 0.05, 0.5);
    let s = `<g opacity="${f2(g)}">` + rect(410, 82, 170, 100, 'wf-bx', 10) + T(495, 152, 'CE', 54, 'middle', 'fp-big') + '</g>';
    if (p > 0.5) s += T(495, 208, 'EN 1090-1', 19, 'middle', 'fp-small');
    return s;
  }
  function sysNb(p) {
    const g = span(p, 0.05, 0.5);
    return `<g opacity="${f2(g)}"><circle class="wf-bx" cx="110" cy="318" r="40"/><circle class="wf-dash" cx="110" cy="318" r="30"/>` + T(110, 325, 'NB', 19, 'middle', 'fp-big') + '</g>' + (p > 0.4 ? arrow(156, 318, 226, 318, 9, 'fp-mark', 2) : '');
  }
  function sysFpc(p) {
    let s = rect(236, 270, 132, 92, 'wf-bx', 8) + T(302, 352, tx('FPC', 'FPC'), 19, 'middle', 'fp-big');
    for (let i = 0; i < 3; i++) if (p > 0.1 + i * 0.15) s += line([[252, 290 + i * 16], [258, 296 + i * 16], [268, 284 + i * 16]], 'fp-mark', 2) + line([[276, 290 + i * 16], [352, 290 + i * 16]]);
    return s;
  }
  function sysIwe(p) {
    let s = `<circle class="wf-bx" cx="430" cy="270" r="18"/>` + `<path class="wf-bx" d="M398 340Q398 296 430 296Q462 296 462 340Z"/>` + T(430, 364, 'IWE', 19, 'middle', 'fp-big');
    if (p > 0.4) s += T(476, 284, `${C.SYS.welders} × 2`, 22, 'start', 'fp-big') + T(476, 320, `= ${C.SYS.year} ${tx('per jaar', 'a year')}`, 20, 'start', 'fp-label');
    return s;
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['scrim', 'progC', 'cycleC', 'seamC', 'beamC', 'dayC', 'dutyC', 'dataC', 'costC', 'sysC'];
  function hudOnly(list) { for (const key of HUD) show(E[key], list.includes(key)); }
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };
  set(E.cycleBase, cycleBase());
  set(E.seamBase, seamBase());
  set(E.dayBase, dayBase());
  set(E.costBase, costBase());
  set(E.sysBase, sysBase());

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    introCamera(E.world, C.KEYS[si], d, u, W, H);
    let st = running(u);
    let hud = [];

    if (si === 0) {
      if (kb === 3) { hud = ['progC']; set(E.progBody, progCard(p)); }
    }
    if (si === 1) {
      if (kb === 1) {
        // the robot finishes and goes home; the table turns half a turn
        const th = Math.PI * span(p, 0.3, 0.8);
        st = { theta: th, tcp: HOME, arc: false, u, stations: [{ bars: 5, clamps: true, beads: allBeads() }, { bars: 5, clamps: true, beads: [] }] };
      }
      if (kb >= 2) {
        hud = ['scrim', 'cycleC'];
        set(E.cycleOne, cycleOne(kb === 2 ? span(p, 0.05, 0.7) : 1));
        set(E.cycleTwo, kb >= 3 ? cycleTwo(kb === 3 ? span(p, 0.05, 0.7) : 1) : '');
        set(E.cycleText, kb === 4 ? tag(320, 316, 260, tx(`+${C.CELL.gain}% output`, `+${C.CELL.gain}% output`), 20, 'middle') : '');
      }
    }
    if (si === 2) {
      if (kb === 0) {
        // the robot leaves the weld and dips the torch into the cleaning station
        const top = [C.CLEAN[0] - 3, C.CLEAN[1], 76];
        const above = add(top, [0, 0, 12]);
        const go = span(p, 0.05, 0.4);
        const dip = span(p, 0.45, 0.6) - span(p, 0.8, 0.95);
        const tcp = go < 1 ? lerpCyl(HOME, above, go) : lerp(above, top, dip);
        st = { ...running(0.3), tcp, arc: false, u };
      }
      if (kb === 1) st.fumes = 1;
    }
    if (si === 3) {
      if (kb === 0) { const w = weldPath(0.05 + 0.12 * p, 0); st = { ...running(0), tcp: w.tcp, arc: w.arc, u, stations: [{ bars: 5, clamps: true, beads: weldingBeads(0.05 + 0.12 * p), hot: 0 }, loadingState(1)] }; }
      if (kb >= 1 || p > 0.55) {
        hud = ['scrim', 'seamC'];
        set(E.seamTol, kb === 0 ? seamTol(span(p, 0.55, 1)) : '');
        set(E.seamTouch, kb === 1 ? seamTouch(p) : '');
        set(E.seamTrack, kb === 2 ? seamTrack(p) : '');
      }
    }
    if (si === 4) {
      hud = ['scrim', 'beamC'];
      const shrinkOn = kb === 2;
      const presetOn = kb === 3;
      let base = beamBase();
      if (presetOn) {
        const g = span(p, 0.05, 0.4);
        base = beamBase(1 + 0.04 * (1 - g)) + (g < 1 ? '' : '');
      }
      if (shrinkOn) base = beamBase(1 - 0.04 * span(p, 0.05, 0.4)) + (p > 0.1 ? beamBase(1, BY, true).replace(/wf-idle/g, 'wf-dash') : '');
      set(E.beamBase, card(24, 24, 592, 352) + T(320, 62, tx('ligger: 7 delen, 6 stompe lassen', 'beam: 7 pieces, 6 butt welds'), 20, 'middle', 'fp-label') + base);
      set(E.beamTack, kb <= 1 ? beamTack(kb === 0 ? p : 1) : '');
      set(E.beamSeq, kb === 1 ? beamSeq(p) : '');
      set(E.beamShrink, shrinkOn ? beamShrink(p) : '');
      set(E.beamPreset, presetOn ? beamPreset(p) : '');
    }
    if (si === 5) {
      if (kb <= 1) { hud = ['scrim', 'dayC']; set(E.dayArc, dayArc(kb === 0 ? p : 1)); set(E.dayBf, kb === 1 ? dayBf() : ''); }
      if (kb === 2) { hud = ['scrim', 'dutyC']; set(E.dutyBody, dutyCard(p)); }
      if (kb === 3) { hud = ['scrim', 'dataC']; set(E.dataBody, dataCard(p)); }
    }
    if (si === 6) {
      hud = ['scrim', 'costC'];
      set(E.costBars, costBars(kb, p));
      set(E.costWire, costWire(kb >= 2, kb === 2 ? p : 1));
      set(E.costEven, kb === 3 ? costEven(p) : '');
    }
    if (si === 7) {
      hud = ['scrim', 'sysC'];
      set(E.sysIso, sysIso(kb === 0 ? p : 1));
      set(E.sysCe, kb >= 1 ? sysCe(kb === 1 ? p : 1) : '');
      set(E.sysNb, kb >= 2 ? sysNb(kb === 2 ? p : 1) : '');
      set(E.sysFpc, kb >= 2 ? sysFpc(kb === 2 ? p : 1) : '');
      set(E.sysIwe, kb === 3 ? sysIwe(p) : '');
    }

    drawCell(st);
    hudOnly(hud);
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
