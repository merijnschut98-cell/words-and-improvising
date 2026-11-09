// The stage of the film "Een robot leren kennen / Getting to know a robot": a
// pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope), a preamble from build.mjs that defines P
// (projection), C (world constants, the model, the beat cameras), W and H, and
// the kit's audio warp.
//
// Each scene is a row of beats; the beat on screen (and how far through it)
// comes from the caption beat starts, so a move lands on the line that names
// it. The robot cell is the world (one camera framing per beat); the arm, its
// gripper and the parts are drawn per frame from a small inverse kinematics
// (the figure eng.lines.robotcell's), and the cards are drawn in stage space.
/* global P, C, W, H, iso, towardViewer, translateAlong, span, beatStarts, warpU, introBeat, introCamera */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const setterEls = [...svg.querySelectorAll('[data-setter]')];
  const guardEls = [...svg.querySelectorAll('[data-cue="fence"],[data-cue="curtain"]')];
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tx = (nl, en) => (EN ? en : nl);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerpN = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const num = (v, dec = 0) => {
    const [i, d] = Math.abs(v).toFixed(dec).split('.');
    const grouped = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.') : i;
    return (v < 0 ? '−' : '') + grouped + (d ? (EN ? '.' : ',') + d : '');
  };
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const attr = (e, name, v) => { if (e['__' + name] !== v) { e.setAttribute(name, v); e['__' + name] = v; } };
  const fade = (e, a) => { const v = String(Math.round(clamp(a, 0, 1) * 100) / 100); if (e.style.opacity !== v) e.style.opacity = v; };
  const lamp = (e, on) => { if (e && e.classList.contains('rb-lamp') !== on) e.classList.toggle('rb-lamp', on); };

  // ------------------------------------------------------------ vectors and the iso camera
  const KS = C.KS;
  const VIEW = towardViewer(P);
  const at = (p) => iso(p, P);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const len = (a) => Math.hypot(a[0], a[1], a[2]);
  const nrm = (a) => mul(a, 1 / (len(a) || 1));
  const ease = (t) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };
  const pathPts = (pts, close) => 'M' + pts.map((p) => f2(p[0]) + ' ' + f2(p[1])).join('L') + (close ? 'Z' : '');
  const SEG = (a, b) => { const p = at(a); const q = at(b); return `M${f2(p[0])} ${f2(p[1])}L${f2(q[0])} ${f2(q[1])}`; };
  const { PED, SH_Z, LINK, TOOL, BELT_Z, PART, PICK, PLACE, TABLE_Z, HAZ, CUR_Y, LC, BOWL, BOWL_Z, BIN, BIN_Z, CAM, SCAN, OPR, HAND, LOAD, CELL, SAFE, COBOT } = C;
  const SHOULDER = [PED[0], PED[1], SH_Z];

  // ------------------------------------------------------------ the arm: inverse kinematics (as in the figure)
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
  const LIFT = 14;
  const PICK_DN = [PICK[0], PICK[1], BELT_Z + PART.h];
  const PICK_UP = add(PICK_DN, [0, 0, LIFT]);
  const PLACE_DN = [PLACE[0], PLACE[1], TABLE_Z + 1.2 + PART.h];
  const PLACE_UP = add(PLACE_DN, [0, 0, LIFT]);
  const HOME = [-24, -2, 108];
  const BINC = [BIN.x + BIN.w / 2, BIN.y + BIN.d / 2];
  const BIN_DN = [BINC[0] + 2, BINC[1] - 1, BIN_Z + 9];
  const BIN_UP = add(BIN_DN, [0, 0, 22]);

  // one automatic cycle as segments [from, to, seconds, what]: move, wait for the machine, place, back, pick
  const MOVE = 2;
  const CYCLE = [
    [PICK_UP, PLACE_UP, MOVE, 'move'], [PLACE_UP, PLACE_UP, 1.6, 'wait'], [PLACE_UP, PLACE_DN, 0.35, 'down'],
    [PLACE_DN, PLACE_DN, 0.3, 'release'], [PLACE_DN, PLACE_UP, 0.35, 'up'], [PLACE_UP, PICK_UP, MOVE, 'back'],
    [PICK_UP, PICK_DN, 0.35, 'down'], [PICK_DN, PICK_DN, 0.3, 'grip'], [PICK_DN, PICK_UP, 0.35, 'up'],
  ];
  const CYCLE_T = CYCLE.reduce((a, s) => a + s[2], 0);
  function cycleAt(t) {
    let tt = ((t % CYCLE_T) + CYCLE_T) % CYCLE_T;
    let i = 0;
    while (i < CYCLE.length - 1 && tt > CYCLE[i][2]) { tt -= CYCLE[i][2]; i++; }
    const [a, b, dur, what] = CYCLE[i];
    const f = dur > 0 ? clamp(tt / dur, 0, 1) : 1;
    const tcp = lerpCyl(a, b, ease(f));
    let open = 1; let holding = false; let onTable = false;
    if (i <= 2) { open = 0; holding = true; } else if (i === 3) { open = ease(f); holding = f < 0.5; onTable = f >= 0.5; } else if (i <= 6) { onTable = true; } else if (i === 7) { open = 1 - ease(f); holding = f > 0.5; } else { open = 0; holding = true; }
    return { tcp, open, holding, onTable, seg: i, what };
  }
  // time through the program at a changing speed: integrate rate(t) from 0 to t
  function progress(t, rate) {
    const n = Math.max(1, Math.ceil(t / 0.05));
    const h = t / n;
    let s = 0;
    for (let i = 0; i < n; i++) s += rate((i + 0.5) * h) * h;
    return s;
  }

  // ------------------------------------------------------------ drawing the arm (stroked capsules and end discs)
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
    return `<path class="rb-endc" d="${pathPts(ringPts(farEnd, axis, r, 24), true)}"/>`
      + `<path class="rb-cyl rb-o" stroke-width="${f2(w + 1.1)}" d="${SEG(a, b)}"/><path class="rb-cyl rb-f" stroke-width="${f2(w)}" d="${SEG(a, b)}"/>`
      + `<path class="rb-endc" d="${pathPts(ringPts(nearEnd, axis, r, 24), true)}"/>`
      + (hubR ? `<path class="rb-hub" d="${pathPts(ringPts(nearEnd, axis, hubR, 16), true)}"/>` : '');
  }
  function cap(a, b, r, fill = 'rb-f', top = false) {
    const d = SEG(a, b);
    const w = 2 * r * KS;
    return `<path class="rb-cap rb-o" stroke-width="${f2(w + 1.1)}" d="${d}"/><path class="rb-cap ${fill}" stroke-width="${f2(w)}" d="${d}"/>`
      + (top ? `<path class="rb-cap rb-t" stroke-width="${f2(w * 0.32)}" d="${SEG(add(a, [0, 0, r * 0.45]), add(b, [0, 0, r * 0.45]))}"/>` : '');
  }
  const lit = (on, s) => (on ? `<g class="rb-lit">${s}</g>` : s);
  // the live part: a box with its top and the two faces toward the viewer
  function partSvg(c, z0) {
    const w = PART.w / 2;
    const z1 = z0 + PART.h;
    const Pt = (x, y, z) => at([c[0] + x, c[1] + y, z]);
    const fxs = VIEW[0] > 0 ? w : -w;
    const fys = VIEW[1] > 0 ? w : -w;
    const fx = [Pt(fxs, -w, z0), Pt(fxs, w, z0), Pt(fxs, w, z1), Pt(fxs, -w, z1)];
    const fy = [Pt(-w, fys, z0), Pt(w, fys, z0), Pt(w, fys, z1), Pt(-w, fys, z1)];
    const top = [Pt(-w, -w, z1), Pt(w, -w, z1), Pt(w, w, z1), Pt(-w, w, z1)];
    return `<path class="rb-pt" data-f="a" d="${pathPts(fx, true)}"/><path class="rb-pt" data-f="b" d="${pathPts(fy, true)}"/><path class="rb-pt" data-f="top" d="${pathPts(top, true)}"/>`;
  }
  // one gripper hanging from point g0: body, two fingers across ac, tips at tip
  function gripper(g0, tip, ac, open, small = 1) {
    const g1 = add(g0, [0, 0, -3.8]);
    const spread = (7.8 + 3.4 * open) * small;
    let s = cyl(g0, g1, [0, 0, -1], 5.6 * small, 0);
    [-1, 1].forEach((sg) => {
      const root = add(g1, mul(ac, sg * spread));
      const end = add(add(tip, [0, 0, -PART.h * 0.55]), mul(ac, sg * spread));
      s += `<path class="rb-cap rb-o" stroke-width="${f2(2.2 * KS + 1.1)}" d="${SEG(root, end)}"/><path class="rb-cap rb-g" stroke-width="${f2(2.2 * KS)}" d="${SEG(root, end)}"/>`;
    });
    return s;
  }
  // o: { lit (0–5 the joint lit), twist, bend, double, open }
  function armSvg(tcp, o = {}) {
    const { u, n, elbow, wrist } = poseOf(tcp);
    const side = n[0] * VIEW[0] + n[1] * VIEW[1] >= 0 ? 1 : -1;
    const ns = mul(n, side);
    const so = add(SHOULDER, mul(u, 6));
    const L = o.lit;
    const arm = lit(L === 1, cyl(add(so, mul(ns, -9)), add(so, mul(ns, 9)), ns, 10.5, 4.6))
      + lit(L === 1, cap(add(so, mul(ns, 5)), add(elbow, mul(ns, 5)), 6.4, 'rb-f', true))
      // the cable loom along the upper arm
      + cap(add(add(so, mul(ns, 5)), [0, 0, 7]), add(add(elbow, mul(ns, 5)), [0, 0, 6]), 1.4, 'rb-cable')
      + lit(L === 2, cyl(add(elbow, mul(ns, -1)), add(elbow, mul(ns, 11)), ns, 7.4, 3))
      + lit(L === 3, cap(add(elbow, mul(ns, 5)), wrist, 4.8, 'rb-f', true))
      + lit(L === 4, cyl(add(wrist, mul(ns, -4.6)), add(wrist, mul(ns, 4.6)), ns, 4, 1.6));
    const fl0 = add(wrist, [0, 0, -3.4]);
    const fl1 = add(wrist, [0, 0, -6.2]);
    const flange = lit(L === 5, cyl(fl0, fl1, [0, 0, -1], 5.4, 2));
    const tw = o.twist || 0;
    const ac = add(mul(n, Math.cos(tw)), mul(u, Math.sin(tw)));
    const bendV = mul(add(mul(n, 1), [0, 0, 0.4]), (o.bend || 0) * 5);
    const tip = add(tcp, bendV);
    let grip = '';
    let second = null;
    if (o.double) {
      // a bar along the arm with a gripper at each end: this one works, the far one carries the next raw part
      const far = add(fl1, mul(u, 17));
      grip += cap(add(fl1, [0, 0, -1.6]), add(far, [0, 0, -1.6]), 2.4, 'rb-f', true);
      grip += gripper(add(far, [0, 0, -3]), add(tcp, mul(u, 17)), n, 0, 0.9);
      second = add(tcp, mul(u, 17));
      grip += gripper(add(fl1, [0, 0, -3]), tip, ac, o.open ?? 0);
    } else grip += cyl(fl1, add(fl1, [0, 0, -1.4]), [0, 0, -1], 5.2, 0) + gripper(add(fl1, [0, 0, -1.4]), tip, ac, o.open ?? 0);
    return { arm, flange, grip, tip, second, joints: [[PED[0], PED[1], 46], so, elbow, add(elbow, mul(sub(wrist, elbow), 0.5)), wrist, add(wrist, [0, 0, -4.8])] };
  }

  // ------------------------------------------------------------ floor marks
  const floorPoly = (pts, z = 0.3) => pathPts(pts.map(([x, y]) => at([x, y, z])), true);
  const arcPts = (c, r, a0, a1, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; });
  const reachSvg = (a) => `<path class="rb-zone" style="opacity:${f2(a)}" d="${floorPoly(arcPts(PED, 102, 0, Math.PI * 2, 64))}"/>`;
  function zonesSvg(a, warn = 95, stop = 55) {
    const fan = (r) => floorPoly([SCAN, ...arcPts(SCAN, r, 0.05, Math.PI - 0.05, 36)]);
    return `<g style="opacity:${f2(a)}"><path class="rb-zone" d="${fan(warn)}"/><path class="rb-zone-in" d="${fan(stop)}"/></g>`;
  }
  function safetySvg(a, sAt) {
    const x0 = LC[0] + 4;
    const x1 = LC[1] - 4;
    const yS = HAZ + sAt;
    return `<g style="opacity:${f2(a)}"><path class="rb-zone" d="${floorPoly([[x0, HAZ], [x1, HAZ], [x1, yS], [x0, yS]])}"/>`
      + `<path class="rb-s" d="${SEG([x0, HAZ, 0.4], [x1, HAZ, 0.4])}${SEG([x0, yS, 0.4], [x1, yS, 0.4])}"/></g>`;
  }
  const T = (x, y, text, size = 20, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink fp-tx ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${f1(size)}" text-anchor="${anchor}">${text}</text>`;
  let camW = W;
  const wT = (p, text, size, anchor = 'middle', cls = 'fp-big fp-acc') => { const [x, y] = at(p); return T(x, y, text, (size * camW) / W, anchor, cls); };

  // ------------------------------------------------------------ cards (stage space, 640 × 400)
  const CX = 380;
  const CWD = 246;
  const MID = CX + CWD / 2;
  const card = (x, y, w, h, r = 12) => `<rect class="fp-hud-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fp-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const Rr = (x, y, w, h, cls, rx = 3) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${rx}"/>`;
  const M = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
  const mark = (d, cls = 'rb-line') => `<path class="${cls}" d="${d}"/>`;
  const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const tick = (x, y) => mark(`M${f1(x)} ${f1(y)}l6 6l12 -14`, 'rb-arrow');
  const cross = (x, y) => mark(`M${f1(x)} ${f1(y - 7)}l14 14M${f1(x + 14)} ${f1(y - 7)}l-14 14`, 'rb-arrow');

  // the teach pendant, front view, with the three-position enabling switch
  function pendCard(kb, p) {
    let base = card(CX, 14, CWD, 372);
    const bx = CX + 22; const by = 30;
    base += Rr(bx, by, 130, 196, 'rb-shape2', 16);
    base += Rr(bx + 12, by + 14, 106, 74, 'rb-shape', 4);
    // a robot on the screen: three strokes
    base += mark(M([[bx + 40, by + 78], [bx + 46, by + 50], [bx + 74, by + 36], [bx + 86, by + 52]]), 'rb-line');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) base += Rr(bx + 14 + c * 26, by + 100 + r * 22, 20, 15, 'rb-shape', 3);
    base += circ(bx + 104, by + 172, 12, 'rb-shape') + circ(bx + 104, by + 172, 6, 'rb-shape2');
    base += T(bx + 46, by + 179, tx('noodstop', 'e-stop'), 18, 'middle', 'fp-small');
    // the cable at the bottom
    base += mark(`M${bx + 65} ${by + 196}q0 14 -22 20`, 'rb-thick') + circ(bx + 43, by + 216, 2.6, 'rb-on');
    set(E.pendBase, base);
    // the switch on the right edge, and its three positions
    const pos = kb === 1 ? (p < 0.34 ? 0 : p < 0.67 ? 1 : 2) : 1;
    let sw = Rr(bx + 130, by + 70, 14, 64, 'rb-shape', 4) + Rr(bx + 130 + (pos === 0 ? 0 : pos === 1 ? 5 : 10), by + 84, 6, 36, 'fp-meter', 2);
    sw += T(bx + 150, by + 108, tx('vrijgave', 'enable'), 18, 'start', 'fp-small');
    if (kb <= 1) {
      const names = [tx('los', 'released'), tx('midden', 'middle'), tx('hard', 'squeezed')];
      const state = [tx('stop', 'stop'), tx('beweegt', 'moves'), tx('stop', 'stop')];
      // one row per position: the switch's state, and what the robot does
      names.forEach((nm, i) => {
        const y = 262 + i * 40;
        const on = i === pos;
        sw += Rr(CX + 12, y, CWD - 24, 34, on ? 'rb-shape2' : 'rb-plain', 6) + T(CX + 26, y + 24, nm, 19, 'start', on ? 'fp-big' : 'fp-small') + T(CX + CWD - 26, y + 24, state[i], 19, 'end', on ? 'fp-big fp-acc' : 'fp-small');
      });
    }
    set(E.pendSw, sw);
    let sp = '';
    if (kb === 2) {
      const g = clamp(p / 0.85, 0, 1);
      sp += T(MID, 278, `${num(HAND.v)} mm/s`, 24, 'middle', 'fp-big');
      sp += Rr(CX + 18, 294, CWD - 36, 16, 'rb-shape', 3) + Rr(CX + 18, 294, (CWD - 36) * g, 16, 'fp-meter', 3);
      sp += T(CX + 18, 334, `${num(HAND.move * g)} mm`, 18, 'start', 'fp-small') + T(CX + CWD - 18, 334, `${num(HAND.t * g, 1)} s`, 18, 'end', 'fp-big');
      sp += T(MID, 368, `${num(HAND.move)} / ${num(HAND.v)} = ${num(HAND.t)} s`, 19, 'middle', 'fp-small');
    }
    set(E.pendSpeed, sp);
  }
  // payload: the stack on the flange, then the payload diagram
  function loadCard(kb, p) {
    set(E.loadBase, card(CX, 14, CWD, 372) + T(MID, 44, tx(`robot van ${LOAD.robot} kg`, `${LOAD.robot} kg robot`), 19, 'middle', 'fp-small'));
    const x0 = CX + 24;
    const xs = (kg) => x0 + (kg / 12) * (CWD - 48);
    let s = '';
    const g = kb >= 3 ? 1 : span(p, 0.1, 0.7);
    const y = 64;
    s += Rr(x0, y, (xs(LOAD.gripper) - x0) * Math.min(1, g * 2), 30, 'fp-meter2', 3);
    if (g > 0.5) s += Rr(xs(LOAD.gripper) + 2, y, (xs(LOAD.sum) - xs(LOAD.gripper) - 2) * Math.min(1, (g - 0.5) * 2), 30, 'fp-meter', 3);
    s += mark(M([[xs(LOAD.robot), y - 8], [xs(LOAD.robot), y + 38]]), 'rb-thick');
    s += T((x0 + xs(LOAD.gripper)) / 2, y + 58, tx(`grijper ${LOAD.gripper}`, `gripper ${LOAD.gripper}`), 18, 'middle', 'fp-small');
    s += T((xs(LOAD.gripper) + xs(LOAD.sum)) / 2, y + 58, tx(`product ${LOAD.part}`, `part ${LOAD.part}`), 18, 'middle', 'fp-small');
    s += T(MID, y + 92, `= ${LOAD.sum} kg · ${LOAD.pct}%`, 22, 'middle', 'fp-big');
    if (kb >= 3) {
      // the diagram: allowed kg against the load's distance from the flange
      const cx0 = CX + 44; const cx1 = CX + CWD - 18; const cy0 = 356; const cy1 = 200;
      const mx = (mm) => cx0 + (mm / 300) * (cx1 - cx0);
      const ky = (kg) => cy0 - (kg / 12) * (cy0 - cy1);
      const allow = (mm) => (mm <= 100 ? 10 : 10 * (100 / mm) ** 1.2);
      s += mark(M([[cx0, cy1 - 4], [cx0, cy0], [cx1, cy0]]), 'rb-line');
      const curve = [];
      for (let mm = 0; mm <= 300; mm += 10) curve.push([mx(mm), ky(allow(mm))]);
      s += mark(M(curve), 'rb-thick');
      s += T(cx0 - 6, ky(10) + 6, '10', 18, 'end', 'fp-small') + T(cx0 - 6, cy0 + 4, '0', 18, 'end', 'fp-small');
      s += T(mx(150), cy0 + 22, `${LOAD.off} mm`, 18, 'middle', 'fp-small');
      s += mark(M([[mx(150), cy0], [mx(150), ky(10)]]), 'rb-dash');
      if (p > 0.3) s += circ(mx(150), ky(10), 6, 'rb-on') + T(mx(150) + 10, ky(10) - 8, tx('te zwaar', 'too heavy'), 18, 'start', 'fp-big fp-acc');
    }
    set(E.loadBody, s);
  }
  // SCARA and cobot, side views
  function typeCard(kb, t) {
    let sc = '';
    if (kb >= 1) {
      sc += card(CX, 14, CWD, 180) + T(MID, 40, tx('SCARA-robot · 4 assen', 'SCARA robot · 4 axes'), 18, 'middle', 'fp-big');
      const bx = CX + 50; const by = 172;
      const sw = Math.cos(t * 2.4);
      const z = 10 * (0.5 + 0.5 * Math.sin(t * 4.8));
      // base and column, the first arm, the second arm swinging round (seen side on, so it shortens), the quill going up and down
      sc += Rr(bx - 20, by - 8, 40, 8, 'rb-shape', 2) + Rr(bx - 10, by - 92, 20, 84, 'rb-shape2', 4);
      sc += `<path class="rb-cap rb-o" stroke-width="18" d="${M([[bx, by - 100], [bx + 76, by - 100]])}"/><path class="rb-cap rb-f" stroke-width="16" d="${M([[bx, by - 100], [bx + 76, by - 100]])}"/>`;
      const x2 = bx + 76 + 62 * sw;
      sc += `<path class="rb-cap rb-o" stroke-width="14" d="${M([[bx + 76, by - 112], [x2, by - 112]])}"/><path class="rb-cap rb-f" stroke-width="12" d="${M([[bx + 76, by - 112], [x2, by - 112]])}"/>`;
      sc += circ(bx, by - 100, 5, 'rb-shape') + circ(bx + 76, by - 106, 6, 'rb-shape');
      sc += Rr(x2 - 3, by - 120 + z, 6, 52, 'rb-shape', 2) + circ(x2, by - 66 + z, 4, 'rb-on');
      sc += T(CX + CWD - 14, by - 4, tx('snel, vlak', 'fast, flat'), 18, 'end', 'fp-small');
    }
    set(E.typeScara, sc);
    let cb = '';
    if (kb >= 2) {
      cb += card(CX, 206, CWD, 180) + T(MID, 232, tx('cobot · naast mensen', 'cobot · next to people'), 18, 'middle', 'fp-big');
      const bx = CX + 60; const by = 370;
      const a = 0.25 * Math.sin(t * 1.2);
      const j1 = [bx, by - 40];
      const j2 = [j1[0] + 60 * Math.cos(-1.2 + a), j1[1] + 60 * Math.sin(-1.2 + a)];
      const j3 = [j2[0] + 56 * Math.cos(0.3 - a), j2[1] + 56 * Math.sin(0.3 - a)];
      cb += Rr(bx - 16, by - 14, 32, 14, 'rb-shape', 3) + Rr(bx - 9, by - 40, 18, 28, 'rb-shape2', 6);
      cb += `<path class="rb-cap rb-o" stroke-width="13" d="${M([j1, j2, j3])}"/><path class="rb-cap rb-f" stroke-width="11" d="${M([j1, j2, j3])}"/>`;
      cb += [j1, j2, j3].map(([x, y]) => circ(x, y, 9, 'rb-shape2') + circ(x, y, 3.5, 'rb-shape')).join('');
      // a person beside it
      const px = CX + CWD - 44;
      cb += circ(px, by - 100, 10, 'rb-shape2') + Rr(px - 12, by - 86, 24, 50, 'rb-shape2', 8) + Rr(px - 10, by - 36, 8, 36, 'rb-shape', 3) + Rr(px + 2, by - 36, 8, 36, 'rb-shape', 3);
      cb += T(px - 26, by - 6, tx('3–20 kg', '3–20 kg'), 18, 'end', 'fp-small');
    }
    set(E.typeCobot, cb);
  }
  // the cycle: machine time and standstill, single against double gripper
  function cycCard(kb, p) {
    const x0 = CX + 18;
    const xs = (s) => x0 + (s / 64) * (CWD - 36);
    let base = card(CX, 14, CWD, 372) + T(MID, 44, tx('per stuk (s)', 'per part (s)'), 19, 'middle', 'fp-small');
    base += Rr(x0, 70, xs(CELL.machine) - x0, 24, 'fp-meter2', 3) + T((x0 + xs(CELL.machine)) / 2, 88, tx(`${CELL.machine} draaien`, `${CELL.machine} machining`), 18, 'middle', 'fp-big');
    base += mark(M([[xs(CELL.machine), 62], [xs(CELL.machine), 330]]), 'rb-dash');
    set(E.cycBase, base);
    let one = '';
    if (kb >= 1) {
      const g = kb > 1 ? 1 : span(p, 0.1, 0.6);
      one += T(x0, 136, tx('enkele grijper', 'single gripper'), 18, 'start', 'fp-small');
      one += Rr(x0, 148, xs(CELL.machine) - x0, 24, 'fp-meter2', 3) + Rr(xs(CELL.machine) + 1, 148, (xs(CELL.one) - xs(CELL.machine) - 1) * g, 24, 'fp-meter', 3);
      one += T(xs(CELL.machine) + 4, 192, tx(`+${CELL.single} stil`, `+${CELL.single} idle`), 18, 'start', 'fp-small');
      one += T(MID, 222, `${CELL.one} s → ${CELL.perOne} ${tx('per uur', 'an hour')}`, 19, 'middle', 'fp-big');
    }
    set(E.cycOne, one);
    let two = '';
    if (kb >= 2) {
      const g = kb > 2 ? 1 : span(p, 0.1, 0.6);
      two += T(x0, 262, tx('dubbele grijper', 'double gripper'), 18, 'start', 'fp-small');
      two += Rr(x0, 274, xs(CELL.machine) - x0, 24, 'fp-meter2', 3) + Rr(xs(CELL.machine) + 1, 274, (xs(CELL.two) - xs(CELL.machine) - 1) * g, 24, 'fp-meter', 3);
      two += T(xs(CELL.two) + 4, 292, `+${CELL.double}`, 18, 'start', 'fp-small');
      two += T(MID, 348, `${CELL.two} s → ${CELL.perTwo} ${tx('per uur', 'an hour')}`, 20, 'middle', 'fp-big');
    }
    set(E.cycTwo, two);
  }
  // the safety distance: the formula, the stopping time, the numbers
  function safeCard(kb, p, stopT) {
    set(E.safeBase, card(CX, 14, CWD, 372) + T(MID, 52, 'S = K × T + C', 24, 'middle', 'fp-big'));
    let st = '';
    if (kb >= 1) {
      // the arm's speed falling to zero over the stopping time
      const x0 = CX + 26; const x1 = CX + CWD - 24; const y0 = 150; const y1 = 84;
      st += mark(M([[x0, y1 - 4], [x0, y0], [x1, y0]]), 'rb-line');
      const g = kb > 1 ? 1 : stopT;
      const xe = lerpN(x0, x1 - 30, 1);
      const pts = [[x0, y1], [x0 + 20, y1]];
      for (let i = 0; i <= 12; i++) { const f = i / 12; pts.push([lerpN(x0 + 20, xe, f), lerpN(y1, y0, f * f * (3 - 2 * f))]); }
      const shown = pts.filter((q, i) => i < 2 || (i - 2) / 12 <= g);
      st += mark(M(shown), 'rb-thick');
      st += mark(M([[x0 + 20, y0 + 6], [xe, y0 + 6]]), 'rb-arrow');
      st += T((x0 + 20 + xe) / 2, y0 + 28, tx('stoptijd T', 'stopping time T'), 18, 'middle', 'fp-big');
      st += T(x0 + 4, y1 - 10, tx('snelheid', 'speed'), 18, 'start', 'fp-small');
    }
    set(E.safeStop, st);
    let ds = '';
    if (kb >= 2) {
      const rows = [
        `K = ${num(SAFE.K)} mm/s`,
        `C = 8 × (${SAFE.d} − 14) = ${SAFE.C}`,
        `S = ${num(SAFE.KT)} + ${SAFE.C} = ${num(SAFE.S)} mm`,
        tx(`onder ${SAFE.floor}: K blijft`, `under ${SAFE.floor}: K stays`),
      ];
      const nShow = kb === 2 ? 1 : 1 + Math.min(3, Math.floor(span(p, 0.05, 0.75) * 3.99));
      rows.slice(0, nShow).forEach((r, i) => { ds += T(CX + 18, 222 + i * 40, r, 18, 'start', i === 2 ? 'fp-big' : 'fp-small'); });
      if (kb === 3) ds += T(CX + 18, 222 + 4 * 40 - 4, `T = ${num(SAFE.T, 2)} s · d = ${SAFE.d} mm`, 18, 'start', 'fp-small');
    }
    set(E.safeDist, ds);
  }
  // offline programming: the cell as a 3D model on a monitor
  function offCard(p) {
    let s = card(CX, 14, CWD, 372) + T(MID, 44, tx('3D-model op een pc', '3D model on a PC'), 19, 'middle', 'fp-big');
    const mx = CX + 20; const my = 64; const mw = CWD - 40; const mh = 150;
    s += Rr(mx, my, mw, mh, 'rb-shape2', 8) + Rr(mx + 8, my + 8, mw - 16, mh - 16, 'rb-shape', 4);
    s += Rr(MID - 8, my + mh, 16, 22, 'rb-shape2', 2) + Rr(MID - 40, my + mh + 22, 80, 8, 'rb-shape2', 3);
    // a small iso cell inside: floor, robot, the path of the program with its points
    const ox = MID; const oy = my + 110;
    const isoP = (x, y, z) => [ox + (x - y) * 0.9, oy + (x + y) * 0.45 - z];
    s += mark(M([isoP(-50, -40, 0), isoP(50, -40, 0), isoP(50, 40, 0), isoP(-50, 40, 0), isoP(-50, -40, 0)]), 'rb-line');
    const a = Math.sin(p * Math.PI * 2) * 0.6;
    const j0 = isoP(0, 0, 0); const j1 = isoP(0, 0, 22);
    const j2 = [j1[0] + 26 * Math.cos(-0.9 + a), j1[1] + 26 * Math.sin(-0.9 + a)];
    const j3 = [j2[0] + 24, j2[1] + 12];
    s += mark(M([j0, j1, j2, j3]), 'rb-thick');
    const path = [isoP(-36, 10, 14), isoP(-10, -30, 34), isoP(30, -20, 30), isoP(38, 16, 12)];
    s += mark(M(path), 'rb-dash') + path.map(([x, y]) => circ(x, y, 3.5, 'rb-on')).join('');
    const rows = [tx('bereik', 'reach'), tx('botsingen', 'collisions'), tx('cyclustijd', 'cycle time')];
    rows.forEach((r, i) => { const y = 286 + i * 32; if (p > 0.2 + i * 0.15) s += tick(CX + 26, y - 8); s += T(CX + 56, y, r, 18, 'start', 'fp-small'); });
    return s;
  }
  // the cobot's takt: PFL at half speed against SSM at full speed
  function taktCard(kb, p) {
    const x0 = CX + 18;
    const xs = (s) => x0 + (s / 18) * (CWD - 36);
    let base = card(CX, 14, CWD, 372) + T(MID, 44, tx(`takt ${COBOT.takt} s`, `takt ${COBOT.takt} s`), 21, 'middle', 'fp-big');
    base += mark(M([[xs(COBOT.takt), 60], [xs(COBOT.takt), 360]]), 'rb-dash');
    set(E.taktBase, base);
    let pf = '';
    const g1 = kb > 1 ? 1 : kb === 1 ? span(p, 0.1, 0.7) : 0;
    pf += T(x0, 92, tx('kracht/vermogen · ½', 'power/force · ½'), 18, 'start', 'fp-small');
    if (kb >= 1) {
      pf += Rr(x0, 104, (xs(COBOT.move * 2) - x0) * Math.min(1, g1 * 1.5), 26, 'fp-meter', 3);
      if (g1 > 0.66) pf += Rr(xs(COBOT.move * 2) + 1, 104, (xs(COBOT.pfl) - xs(COBOT.move * 2) - 1) * span(g1, 0.66, 1), 26, 'fp-meter2', 3);
      pf += T(x0, 156, `${COBOT.move * 2} + ${COBOT.rest} = ${COBOT.pfl} s`, 19, 'start', 'fp-big');
      if (g1 >= 1) pf += cross(CX + CWD - 34, 150);
    } else pf += T(x0, 130, tx('contact mag, langzaam', 'contact allowed, slow'), 18, 'start', 'fp-small');
    set(E.taktPfl, pf);
    let ss = '';
    if (kb >= 2) {
      const g2 = kb > 2 ? 1 : span(p, 0.2, 0.8) * 0.4;
      ss += T(x0, 222, tx('snelheid/afstand · vol', 'speed/distance · full'), 18, 'start', 'fp-small');
      ss += T(x0, 252, tx('remt af bij mensen', 'slows near people'), 18, 'start', 'fp-small');
      if (kb >= 3) {
        ss += Rr(x0, 268, (xs(COBOT.move) - x0) * Math.min(1, span(p, 0.05, 0.4) * 1.5), 26, 'fp-meter', 3);
        if (p > 0.3) ss += Rr(xs(COBOT.move) + 1, 268, (xs(COBOT.ssm) - xs(COBOT.move) - 1) * span(p, 0.3, 0.6), 26, 'fp-meter2', 3);
        ss += T(x0, 322, `${COBOT.move} + ${COBOT.rest} = ${COBOT.ssm} s`, 19, 'start', 'fp-big');
        if (p > 0.6) ss += tick(CX + CWD - 34, 314);
      } else ss += Rr(x0, 268, (xs(COBOT.move) - x0) * g2, 26, 'fp-meter', 3);
    }
    set(E.taktSsm, ss);
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['pendC', 'loadC', 'typeC', 'cycC', 'safeC', 'offC', 'taktC'];
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };
  // the operator's reaching hand (right arm) from the shoulder toward the curtain
  function reachSvg2(e) {
    const sh = [OPR[0] + 7.4, OPR[1] - 1, 63];
    const hand = add(sh, [0, -(OPR[1] - CUR_Y + 9) * e, -2 * e]);
    const d = SEG(sh, hand);
    const w = 3.4 * KS;
    return { svg: `<path class="rb-cap rb-o" stroke-width="${f2(w + 1.1)}" d="${d}"/><path class="rb-cap rb-skin" stroke-width="${f2(w)}" d="${d}"/>`, hand };
  }

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    camW = introCamera(E.world, C.KEYS[si], d, u, W, H).w;
    const dur = FILM.scenes[si].dur;
    const t = u * dur;
    const tb = (b) => d[b] * dur; // start of beat b in seconds
    let hud = [];
    let rate = () => 1;
    let mode = 'cycle'; // cycle | pose
    let pose = null; // { tcp, open, holding, onTable, part }
    const opt = {};
    let floor = '';
    let marks = '';
    let setter = false;
    let oper = false;
    let operDy = 0;
    let reach = 0;
    let guard = 1;
    let handLamp = false;
    let autoLamp = true;
    let cone = 0;

    if (si === 1) {
      mode = 'pose';
      autoLamp = false;
      if (kb === 0) {
        const j = Math.min(5, Math.floor(p * 6));
        const q = Math.sin((p * 6 - j) * Math.PI * 2);
        const c = cylOf(HOME);
        if (j === 0) c.th += 0.45 * q;
        if (j === 1) { c.r += 9 * q; c.z += 7 * q; }
        if (j === 2) c.z -= 10 * q;
        if (j === 4) c.z += 4 * q;
        opt.lit = j;
        if (j >= 3) opt.twist = (j === 5 ? 1.2 : 0.7) * q;
        pose = { tcp: fromCyl(c), open: 0.6 };
      }
      if (kb === 1) {
        const dn = span(p, 0.08, 0.4);
        const up = span(p, 0.62, 0.92);
        const tcp = up > 0 ? lerpCyl(PICK_DN, PICK_UP, up) : lerpCyl(lerpCyl(HOME, PICK_UP, 1), PICK_DN, dn);
        const from = span(p, 0, 0.08);
        pose = { tcp: from < 1 ? lerpCyl(HOME, PICK_UP, from) : tcp, open: 1 - span(p, 0.44, 0.58), holding: p > 0.52, part: 'belt' };
      }
      if (kb >= 2) {
        // the program: a list of taught points the tool centre point visits
        const pts = [PICK_UP, add(lerpCyl(PICK_UP, PLACE_UP, 0.5), [0, 0, 10]), PLACE_UP, PLACE_DN];
        const f = kb === 2 ? span(p, 0.15, 0.95) * 3 : 3;
        const i = Math.min(2, Math.floor(f));
        const tcp = lerpCyl(pts[i], pts[i + 1], ease(f - i));
        pose = { tcp, open: 0, holding: true };
        const scr = pts.map(at);
        marks += `<path class="rb-dash" d="${pathPts(scr)}"/>` + scr.map(([x, y]) => `<circle class="rb-ghost" cx="${f2(x)}" cy="${f2(y)}" r="${f2(2.2 * KS)}"/>`).join('');
        if (kb === 2) marks += pts.map((q, n) => wT(add(q, [0, 0, 5]), `P${(n + 1) * 10}`, 18, 'middle', 'fp-small')).join('');
        if (kb === 3) {
          opt.bend = span(p, 0.1, 0.4);
          pose.tcp = PLACE_DN;
          pose.holding = false;
        }
      }
    }
    if (si === 2) {
      setter = kb < 3;
      handLamp = kb < 3;
      autoLamp = kb >= 3;
      if (kb < 3) {
        mode = 'pose';
        hud = ['pendC'];
        // hand mode: A to B in a straight, steady creep; in beat 2 only while the switch is held in the middle
        const A = add(PLACE_UP, [0, 0, 8]);
        const B = add(lerpCyl(PICK_UP, PLACE_UP, 0.45), [0, 0, 14]);
        let f;
        if (kb === 0) f = 0.35 * span(p, 0.2, 1);
        else if (kb === 1) f = 0.35 + 0.15 * clamp((p - 0.34) / 0.33, 0, 1);
        else f = 0.5 + 0.5 * clamp(p / 0.85, 0, 1);
        pose = { tcp: lerpCyl(A, B, f), open: 0.4 };
      } else rate = () => 1.4;
    }
    if (si === 3) {
      mode = 'pose';
      autoLamp = false;
      const c = cylOf(PICK_UP);
      c.th += 0.12 * Math.sin(t * 0.6);
      pose = { tcp: add(fromCyl(c), [0, 0, 6]), open: 0, holding: true };
      opt.twist = 0.25 * Math.sin(t * 0.5);
      if (kb >= 2) hud = ['loadC'];
    }
    if (si === 4) {
      if (kb === 0) floor += reachSvg(span(p, 0.05, 0.3));
      if (kb === 1 || kb === 2) hud = ['typeC'];
      if (kb === 3) floor += zonesSvg(span(p, 0.05, 0.3));
    }
    if (si === 5) {
      hud = kb < 3 ? ['cycC'] : [];
      if (kb >= 2) opt.double = true;
      if (kb === 3) {
        opt.double = true;
        // parts walking up the spiral and along the rail
        const dots = [];
        for (let i = 0; i < 7; i++) {
          const q = ((t * 0.18 + i / 7) % 1);
          if (q < 0.6) { const a = q / 0.6 * Math.PI * 3.2; const r = 11 - q * 4; dots.push(at([BOWL[0] + r * Math.cos(a), BOWL[1] + r * Math.sin(a), BOWL_Z + 4 + q * 6])); } else dots.push(at([BOWL[0] + 10 + (q - 0.6) / 0.4 * 24, BOWL[1], BOWL_Z + 6.4]));
        }
        marks += dots.map(([x, y]) => `<circle class="rb-on" cx="${f2(x)}" cy="${f2(y)}" r="${f2(1.1 * KS)}"/>`).join('');
      }
    }
    let stopT = 0;
    if (si === 6) {
      hud = kb >= 1 ? ['safeC'] : [];
      oper = kb < 2;
      // the hand reaches through in beat 1 and stays there; the robot brakes over a short stop
      const eIn = kb === 0 ? span(p, 0.15, 0.55) : kb === 1 ? 1 : 1 - span(p, 0, 0.3);
      reach = eIn;
      const tCut = tb(0) + (0.15 + 0.4 * 0.55) * (tb(1) - tb(0));
      const brake = Math.max(1.2, (tb(2) - tb(1)) * 0.5);
      rate = (tt) => (tt < tCut ? 1 : Math.max(0, 1 - (tt - tCut) / brake));
      stopT = clamp((t - tCut) / brake, 0, 1);
      autoLamp = t < tCut;
      if (kb >= 2) floor += safetySvg(span(p, 0.05, 0.3), kb === 3 ? SAFE.S / 10 : CUR_Y - HAZ);
      if (kb >= 2) marks += wT([10, HAZ + (kb === 3 ? SAFE.S / 10 : CUR_Y - HAZ) / 2, 1], kb === 3 ? `S = ${num(SAFE.S)} mm` : 'S', 19, 'middle');
    }
    if (si === 7) {
      if (kb === 0) { cone = span(p, 0.1, 0.4); mode = 'pose'; pose = { tcp: lerpCyl(HOME, BIN_UP, span(p, 0.3, 0.9)), open: 1 }; }
      if (kb === 1) {
        cone = 1 - span(p, 0.7, 1);
        mode = 'pose';
        const dn = span(p, 0.05, 0.35); const up = span(p, 0.55, 0.85);
        pose = { tcp: up > 0 ? lerpCyl(BIN_DN, BIN_UP, up) : lerpCyl(BIN_UP, BIN_DN, dn), open: 1 - span(p, 0.38, 0.5), holding: p > 0.46 };
      }
      if (kb === 2) { hud = ['offC']; mode = 'pose'; pose = { tcp: lerpCyl(BIN_UP, HOME, span(p, 0, 0.4)), open: 0, holding: true }; }
    }
    if (si === 8) {
      hud = ['taktC'];
      guard = 0.12;
      oper = true;
      if (kb <= 1) { rate = () => 0.5; operDy = -14; } else {
        // the operator walks toward the robot and away again; the robot slows near them
        const walk = (tt) => {
          const b2 = tb(2); const b3 = tb(3);
          if (tt < b3) return -44 * span((tt - b2) / (b3 - b2), 0.1, 0.7);
          return -44 * (1 - span((tt - b3) / (dur - b3), 0, 0.5));
        };
        operDy = walk(t);
        const rateAt = (tt) => {
          if (tt < tb(2)) return 0.5;
          const dist = OPR[1] + walk(tt) - SCAN[1];
          return dist > 95 ? 1 : dist > 55 ? 0.5 : 0.15;
        };
        rate = rateAt;
        floor += zonesSvg(span(p, 0, 0.2) + (kb === 3 ? 1 : 0));
      }
    }

    // the robot
    let st;
    if (mode === 'cycle') st = cycleAt(progress(t, rate) + (si === 0 ? 0.4 : 1.7 * si));
    else st = pose;
    const a = armSvg(st.tcp, { ...opt, open: st.open });
    set(E.arm, a.arm);
    let axisM = '';
    if (si === 1 && kb === 0) {
      const jp = a.joints[opt.lit];
      if (opt.lit === 0) axisM = `<path class="rb-s" d="${pathPts(ringPts(jp.slice(0, 2).concat([50.4]), [0, 0, 1], 11.5, 36), true)}"/>`;
      else { const [x, y] = at(jp); axisM = `<circle class="rb-s" cx="${f2(x)}" cy="${f2(y)}" r="${f2([0, 15, 11, 9, 8, 8][opt.lit] * KS)}"/>`; }
      axisM += wT(add(jp, [0, 0, opt.lit === 0 ? 14 : 16]), `${tx('as', 'axis')} ${opt.lit + 1}`, 19);
    }
    set(E.axisMark, axisM);
    set(E.flange, a.flange);
    set(E.grip, a.grip);
    let far = '';
    let held = '';
    if (mode === 'cycle') {
      if (st.holding) held = partSvg(a.tip, a.tip[2] - PART.h);
      if (!st.holding && !st.onTable) far = partSvg(PICK, BELT_Z);
      if (st.onTable) { far = partSvg(PLACE, TABLE_Z + 1.2); if (st.seg >= 5) far = partSvg(PICK, BELT_Z) + far; }
    } else {
      if (st.holding) held = partSvg(a.tip, a.tip[2] - PART.h);
      if (st.part === 'belt' && !st.holding) far = partSvg(PICK, BELT_Z);
    }
    if (a.second) held += partSvg(a.second, a.second[2] - PART.h);
    set(E.far, far);
    set(E.held, held);
    const [tx0, ty0] = at(a.tip);
    let tcpS = '';
    if (si === 1 && kb >= 2) {
      tcpS = `<circle class="rb-tcp" cx="${f2(tx0)}" cy="${f2(ty0)}" r="${f2(1.6 * KS)}"/>`;
      if (kb === 3 && opt.bend > 0) {
        const [gx, gy] = at(PLACE_DN);
        tcpS = `<circle class="rb-ghost" cx="${f2(gx)}" cy="${f2(gy)}" r="${f2(2.6 * KS)}"/>` + tcpS;
      }
    } else if (si === 1 && kb === 0) tcpS = '';
    else tcpS = `<circle class="rb-tcp" cx="${f2(tx0)}" cy="${f2(ty0)}" r="${f2(1.1 * KS)}"/>`;
    set(E.tcp, tcpS);

    // people, lamps, guards, floor marks
    setterEls.forEach((el) => show(el, setter));
    show(E.hookPendant, !setter);
    show(E.opr, oper);
    attr(E.opr, 'transform', translateAlong(P, [0, operDy, 0]));
    let reachS = '';
    let cut = false;
    if (oper && reach > 0) { const r = reachSvg2(reach); reachS = r.svg; cut = r.hand[1] < CUR_Y; }
    set(E.reach, reachS);
    if (cut !== !!E.beams.__cut) { E.beams.toggleAttribute('data-cut', cut); E.beams.__cut = cut; }
    lamp(E.stackHand, handLamp);
    lamp(E.stackAuto, autoLamp);
    lamp(E.ready, mode === 'cycle' && st.what === 'wait');
    guardEls.forEach((el) => fade(el, guard));
    set(E.floorLive, floor);
    set(E.marks, marks);
    if (cone > 0) {
      const apex = at([CAM[0], CAM[1], CAM[2]]);
      const base = [[BIN.x + 2, BIN.y + 2], [BIN.x + BIN.w - 2, BIN.y + 2], [BIN.x + BIN.w - 2, BIN.y + BIN.d - 2], [BIN.x + 2, BIN.y + BIN.d - 2]].map(([x, y]) => at([x, y, BIN_Z + 10]));
      const hull = convexHull([apex, ...base]);
      set(E.cone, `<path class="rb-cone" style="opacity:${f2(cone)}" d="${pathPts(hull, true)}"/>`);
    } else set(E.cone, '');

    // cards
    if (hud.includes('pendC')) pendCard(kb, p);
    if (hud.includes('loadC')) loadCard(kb, p);
    if (hud.includes('typeC')) typeCard(kb, t);
    if (hud.includes('cycC')) cycCard(kb, p);
    if (hud.includes('safeC')) safeCard(kb, p, stopT);
    if (hud.includes('offC')) set(E.offBody, offCard(p));
    if (hud.includes('taktC')) taktCard(kb, p);
    for (const key of HUD) show(E[key], hud.includes(key));
  }
  function convexHull(pts) {
    const s = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const crossZ = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = []; const hi = [];
    for (const q of s) { while (lo.length >= 2 && crossZ(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of s.slice().reverse()) { while (hi.length >= 2 && crossZ(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
    return lo.slice(0, -1).concat(hi.slice(0, -1));
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
