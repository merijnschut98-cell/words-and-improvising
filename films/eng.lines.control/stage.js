// The stage of the film "Hoe een machine denkt / How a machine thinks": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope, the lathe module as G) and a preamble from build.mjs that
// defines P (projection), C (world constants), CAM (one camera move per
// scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global G, P, C, CAM, W, H, iso, solidSvg, lineSvg, dotsSvg, slabOf, cylinder, sideSeam, corners, segment, lineOnTop, haloOf, pathOf, depthOf, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  // ------------------------------------------------------------ repeated parts, drawn once at load
  // The guard fence (posts, frames, mesh) and the bottling line (bed, rails,
  // six identical machines with their hoods and signal lamps) are static, but
  // repeated: drawing them here instead of in the page keeps the page small.
  {
    const box = (plan, z0, z1, style = {}, bevel = 0.4, steps = 1) => solidSvg(slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel), { tone: 'mid', ...style });
    const post = (cx, cy, r, z0, z1, style = {}, steps = 12) => solidSvg(cylinder(cx, cy, r, z0, z1 - z0, P, steps, 0), { tone: 'mid', ...style });
    const seam = (plan, z, inset = 2) => lineSvg(sideSeam({ r: 0.6, ...plan }, z, P, inset), { tone: 'faint' });
    const screws = (plan, z, inset) => dotsSvg(corners(plan, inset).map(([x, y]) => iso([x, y, z], P)), { size: 0.45 });
    const g = (key, body) => `<g data-k="${key}">${body}</g>`;
    // the fence
    const FY = C.FENCE_Y;
    const POSTS = [-58, -28, 4, C.DOOR.x0, C.DOOR.x1, 86];
    let fence = '';
    for (const x of POSTS) fence += box({ x: x - 1.6, y: FY - 1.6, w: 3.2, d: 3.2, r: 0.3 }, 0, 86, {}, 0.2, 1);
    for (let i = 0; i + 1 < POSTS.length; i++) {
      const [x0, x1] = [POSTS[i], POSTS[i + 1]];
      if (x0 === C.DOOR.x0) continue;
      const mesh = [];
      for (let x = x0 + 6; x < x1 - 2; x += 6) mesh.push(segment([x, FY, 10], [x, FY, 80], P));
      for (let z = 18; z < 80; z += 8) mesh.push(segment([x0 + 1.6, FY, z], [x1 - 1.6, FY, z], P));
      fence += lineSvg(mesh.join(''), { tone: 'faint' }) + lineSvg(segment([x0 + 1.6, FY, 10], [x1 - 1.6, FY, 10], P) + segment([x0 + 1.6, FY, 80], [x1 - 1.6, FY, 80], P), { tone: 'mid' });
    }
    svg.querySelector('[data-k="fence"]').innerHTML = fence;
    // the bottling line
    const BZ = C.BELT_Z;
    const BED = { x: 132, y: -9, w: 428, d: 18, r: 1 };
    let line = `<path class="iso-halo" d="${haloOf({ x: 128, y: -70, w: 436, d: 82, r: 3 }, 0, 2, P)}"/>`;
    for (const x of [140, 210, 280, 350, 420, 490, 552]) line += box({ x: x - 2, y: -7, w: 4, d: 4, r: 0.3 }, 0, BZ - 6, { tone: 'lo' }, 0, 1);
    line += box(BED, BZ - 6, BZ, { inner: seam(BED, BZ - 3) }, 0.3, 2);
    line += lineSvg([-5, 0, 5].map((y) => lineOnTop([BED.x + 2, y], [BED.x + BED.w - 2, y], BZ, P)).join(''), { tone: 'faint' });
    line += box({ x: BED.x, y: -8, w: BED.w, d: 1.4, r: 0.2 }, BZ + 6, BZ + 8, { crease: 'none' }, 0, 1);
    C.MACH.forEach((cx, i) => {
      const b = { x: cx - 26, y: -66, w: 52, d: 50, r: 1.5 };
      const face = b.y + b.d;
      const glass = pathOf([[cx - 20, face, 30], [cx + 4, face, 30], [cx + 4, face, 58], [cx - 20, face, 58]].map((p) => iso(p, P)), true);
      const body = box(b, 0, 76, { inner: seam(b, 70, 3) + seam(b, 8, 3) }, 0.6, 2)
        + `<path class="lc-glass" d="${glass}"/>` + lineSvg(segment([cx + 8, face, 30], [cx + 8, face, 58], P) + segment([cx + 12, face, 30], [cx + 12, face, 58], P), { tone: 'lo' })
        + dotsSvg([[cx + 10, face, 62], [cx + 10, face, 26]].map((p) => iso(p, P)), { size: 0.5 })
        + screws(b, 76, 3)
        + post(cx + 16, -56, 2.6, 76, 78, { tone: 'lo' })
        + g('lamp' + i, post(cx + 16, -56, 2.2, 78, 82, { crease: 'lo' })) + g('lampB' + i, post(cx + 16, -56, 2.2, 82, 86, { crease: 'lo' }))
        + post(cx + 16, -56, 2.4, 86, 87, {});
      line += i === 3 ? `<g data-cue="lab">${body}</g>` : body;
    });
    line += g('bottles', '');
    C.MACH.forEach((cx, i) => {
      const h = { x: cx - 22, y: -16, w: 44, d: 30, r: 1 };
      const hood = box(h, 64, 76, { inner: seam(h, 70, 2) }, 0.4, 2) + screws(h, 76, 2);
      line += i === 3 ? `<g data-cue="lab">${hood}</g>` : hood;
    });
    line += box({ x: BED.x, y: 7, w: BED.w, d: 1.4, r: 0.2 }, BZ + 6, BZ + 8, { crease: 'none' }, 0, 1);
    for (const x of [150, 260, 370, 480]) line += box({ x, y: 7.4, w: 2, d: 1.2, r: 0.2 }, BZ, BZ + 6, { tone: 'lo' }, 0, 1);
    svg.querySelector('[data-k="line"]').innerHTML = line;
  }
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const LED = {};
  svg.querySelectorAll('[data-led]').forEach((el) => { LED[el.getAttribute('data-led')] = el; });
  const FLAG = [...svg.querySelectorAll('[data-flag]')];
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const X = [1, 0, 0];
  const Z = [0, 0, 1];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const num = (v) => (NL ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'lc-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'lc-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'lc-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const S = (paths, style = {}) => solidSvg(paths, { tone: 'mid', ...style });
  const EXAMPLE = tr('voorbeeld', 'example');

  // the beat on screen and its progress, from the caption beats of the scene
  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }

  let view = { cx: 0, cy: 0, s: 1 };
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    view = { cx, cy, s };
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }
  // a world point on the stage (for a marker in the HUD)
  const toStage = (p) => { const [x, y] = at(p); return [(x - view.cx) * view.s + W / 2, (y - view.cy) * view.s + H / 2]; };

  // ------------------------------------------------------------ the station
  // st: { jaw 0..1, ram 0..1, part, leds: {key: on}, tower: 0 run | 1 wait | 2 stop | -1 off, chainCut, estop 0..1, hmi }
  function hmiFace(state) {
    // small rule lines on the console screen: the step bar, lit at the current step
    const y = C.ESTOP[1] - 3 + 0.01;
    let out = '';
    for (let i = 0; i < 5; i++) {
      const x0 = -236 + i * 4.6;
      const pts = [[x0, y, C.CON_Z + 14], [x0 + 3.6, y, C.CON_Z + 14], [x0 + 3.6, y, C.CON_Z + 17], [x0, y, C.CON_Z + 17]].map(at);
      out += `<path class="${i + 1 === state ? 'lc-acc' : 'lc-card'}" d="${fmt(pts)}Z"/>`;
    }
    const rows = [[-236, -218], [-236, -222], [-236, -226]];
    rows.forEach(([a, b], i) => { out += `<path class="lc-dim" style="stroke-width:1" d="${fmt([at([a, y, C.CON_Z + 10 - i * 2.4]), at([b, y, C.CON_Z + 10 - i * 2.4])])}"/>`; });
    return out;
  }
  function renderStation(st) {
    move(E.jaw, [-C.JAW.stroke * (st.jaw || 0), 0, 0]);
    move(E.ram, [0, 0, -C.RAM_STROKE * (st.ram || 0)]);
    show(E.part, st.part !== false);
    for (const key in LED) flag(LED[key], 'data-on', !!(st.leds || {})[key]);
    FLAG.forEach((f) => flag(f, 'data-on', !!st.k12));
    [0, 1, 2].forEach((i) => { const seg = E['seg' + i]; flag(seg, 'data-lit', st.tower === i); });
    show(E.chainWhole, !st.chainCut);
    show(E.chainCut, !!st.chainCut);
    move(E.estopHead, [0, 0, -1.6 * (st.estop || 0)]);
    set(E.hmiTxt, hmiFace(st.hmi || 0));
  }

  // ------------------------------------------------------------ the robot cell
  const norm = (v) => { const l = Math.hypot(...v); return v.map((c) => c / l); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const add = (a, b) => a.map((v, i) => v + b[i]);
  const mul = (a, s) => a.map((v) => v * s);
  // a round bar from p0 to p1
  function bar(p0, p1, r, style = {}) {
    const d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
    const len = Math.hypot(...d);
    const a = norm(d);
    const b = Math.abs(a[2]) > 0.95 ? norm(cross(a, X)) : norm(cross(a, Z));
    const c = cross(a, b);
    return S(G.disc(0, len, r, G.frameOf(p0, a, b, c), P, { steps: 18 }), style);
  }
  // a short disc along a horizontal axis (a joint housing)
  function joint(o, axis, r, w, style = {}) {
    const a = norm(axis);
    const b = norm(cross(a, Z));
    return S(G.disc(-w / 2, w / 2, r, G.frameOf(o, a, b, Z), P, { steps: 24 }), style);
  }
  function robotSvg(phi, lift) {
    const [rx, ry] = C.ROBOT;
    const dir = [Math.cos(phi), Math.sin(phi), 0];
    const side = [-Math.sin(phi), Math.cos(phi), 0];
    const sh = [rx, ry, 34];
    const up = 0.9 - 0.25 * lift;
    const elbow = add(sh, add(mul(dir, 40 * Math.cos(up)), [0, 0, 40 * Math.sin(up)]));
    const fa = -0.35 - 0.3 * lift;
    const wrist = add(elbow, add(mul(dir, 34 * Math.cos(fa)), [0, 0, 34 * Math.sin(fa)]));
    const tool = add(wrist, [0, 0, -10]);
    let out = S(cylinder(rx, ry, 9, 22, 6, P, 28, 0), { tone: 'mid', crease: 'lo' });
    out += joint(sh, side, 8, 14, { tone: 'mid' });
    out += bar(sh, elbow, 5, { tone: 'hi', crease: 'lo' });
    out += joint(elbow, side, 5.6, 11, { tone: 'mid' });
    out += bar(elbow, wrist, 3.6, { tone: 'hi', crease: 'lo' });
    out += joint(wrist, side, 3.8, 8, { tone: 'mid' });
    out += bar(wrist, tool, 2.2, { tone: 'mid' });
    out += bar(add(tool, mul(side, -3.4)), add(tool, add(mul(side, -3.4), [0, 0, -6])), 1, { tone: 'hi' });
    out += bar(add(tool, mul(side, 3.4)), add(tool, add(mul(side, 3.4), [0, 0, -6])), 1, { tone: 'hi' });
    return out;
  }
  // the door, hinged at x1, swinging out toward the viewer by th (rad)
  function doorSvg(th) {
    const h = [C.DOOR.x1, C.FENCE_Y, 0];
    const u = [-Math.cos(th), Math.sin(th), 0];
    const n = [Math.sin(th), Math.cos(th), 0];
    const F = G.frameOf(h, n, u, Z);
    const w = C.DOOR.x1 - C.DOOR.x0;
    const pr = (b0, b1, c0, c1, tone = 'mid') => S(G.prismOf(F, [[b0, c0], [b1, c0], [b1, c1], [b0, c1]], -0.8, 0.8, P), { tone, crease: 'lo' });
    const pt = (b, c) => add(h, add(mul(u, b), [0, 0, c]));
    const mesh = [];
    for (let b = 6; b < w - 3; b += 4) mesh.push(fmt([at(pt(b, 12)), at(pt(b, 78))]));
    for (let c = 16; c < 78; c += 6) mesh.push(fmt([at(pt(3.6, c)), at(pt(w - 3.6, c))]));
    return `<path class="iso-line" data-tone="faint" style="stroke:var(--anatomy-faint);stroke-width:.8;fill:none" d="${mesh.join('')}"/>`
      + pr(1.6, w - 1.6, 8, 12) + pr(1.6, w - 1.6, 78, 82) + pr(1.6, 4.4, 12, 78) + pr(w - 4.4, w - 1.6, 12, 78)
      + pr(2, 4.6, 48, 54, 'hi');
  }

  // ------------------------------------------------------------ the bottling line
  function bottleSvg(x) {
    const z = C.BELT_Z;
    return S(cylinder(x, 0, 3.4, z, 12, P, 16, 0.6), { tone: 'mid', crease: 'lo' })
      + S(cylinder(x, 0, 1.7, z + 12, 5, P, 12, 0), { tone: 'mid' })
      + S(cylinder(x, 0, 1.9, z + 17, 2, P, 12, 0), { tone: 'hi', crease: 'lo' });
  }
  const LAB = C.MACH[3];
  function bottlesSvg(mode, clockS) {
    const xs = [];
    if (mode === 'flow') {
      // the labeller stops now and then (micro-stops); bottles queue up in front of it
      const T = 5;
      const runFor = 3.6;
      const cyc = Math.floor(clockS / T);
      const inCyc = clockS - cyc * T;
      const moved = cyc * runFor + Math.min(inCyc, runFor);
      const dn = (moved * 9) % 20;
      for (let x = LAB + 18 + dn; x < 552; x += 20) xs.push(x);
      const upn = (moved * 4) % 10;
      for (let x = LAB - 20 + upn - 10; x > 140; x -= 10) xs.push(x);
    } else {
      for (let x = 146; x < 552; x += 15) xs.push(x);
    }
    xs.sort((a, b) => depthOf([a, 0, 0], P) - depthOf([b, 0, 0], P));
    return xs.map((x) => bottleSvg(Math.round(x * 2) / 2)).join('');
  }
  function labRunning(clockS) { return clockS % 5 < 3.6; }

  // ------------------------------------------------------------ HUD panels
  // the scan cycle: three boxes in a loop, with a dot going round
  function scanSvg(prog, ms) {
    const x0 = 392;
    const labels = [tr('lees ingangen', 'read inputs'), tr('programma', 'run program'), tr('zet uitgangen', 'write outputs')];
    let out = rect(376, 20, 256, 268);
    const k = Math.floor(prog * 3) % 3;
    labels.forEach((t, i) => {
      const y = 36 + i * 70;
      out += rect(x0, y, 186, 48, i === k ? 'lc-row' : 'lc-panel', 6) + txt(x0 + 14, y + 32, `${i + 1}  ${t}`, 21);
      if (i < 2) out += line(x0 + 93, y + 48, x0 + 93, y + 70, 'lc-line');
    });
    out += `<path class="lc-line" d="M${x0 + 186} 200L${x0 + 216} 200L${x0 + 216} 60L${x0 + 186} 60"/>`;
    out += `<path class="lc-line" d="M${x0 + 194} 54L${x0 + 186} 60L${x0 + 194} 66"/>`;
    out += txt(504, 272, ms, 24, 'middle', 'lc-big');
    return out;
  }
  // one ladder rung: part present, not stop → close clamp
  function ladderSvg(flow) {
    let out = rect(16, 270, 616, 122);
    out += txt(620, 296, EXAMPLE, 21, 'end', 'lc-mute');
    const y = 352;
    const xs = [40, 150, 190, 300, 340, 470, 540, 600];
    out += line(40, 300, 40, 384, 'lc-axis') + line(600, 300, 600, 384, 'lc-axis');
    // wires between the parts, petrol as the rung conducts
    const segs = [[40, 150], [190, 300], [340, 470], [540, 600]];
    segs.forEach(([a, b], i) => {
      const on = flow > i / 4;
      out += line(a, y, b, y, on ? 'lc-accl' : 'lc-line');
    });
    // contacts | | and |/|, the coil ( )
    const contact = (x, nc, on) => `<path class="${on ? 'lc-accl' : 'lc-line'}" d="M${x} ${y - 16}L${x} ${y + 16}M${x + 40} ${y - 16}L${x + 40} ${y + 16}${nc ? `M${x + 6} ${y + 14}L${x + 34} ${y - 14}` : ''}"/>`;
    out += contact(150, false, flow > 0.25) + contact(300, true, flow > 0.5);
    const coilOn = flow > 0.75;
    out += `<path class="${coilOn ? 'lc-accl' : 'lc-line'}" d="M480 ${y - 18}Q468 ${y} 480 ${y + 18}M530 ${y - 18}Q542 ${y} 530 ${y + 18}"/>`;
    out += line(470, y, 476, y, coilOn ? 'lc-accl' : 'lc-line') + line(534, y, 540, y, coilOn ? 'lc-accl' : 'lc-line');
    out += txt(170, 322, tr('onderdeel', 'part'), 21, 'middle') + txt(320, 322, tr('stop', 'stop'), 21, 'middle') + txt(505, 322, tr('klem sluiten', 'close clamp'), 21, 'middle');
    return out;
  }
  // the HMI, large: the program's steps, the current one marked
  function hmiSvg(step, wait) {
    const rows = NL
      ? ['wacht op onderdeel', 'klem sluiten', 'wacht op klem dicht', 'persen', 'loslaten']
      : ['wait for part', 'close clamp', 'wait for clamp closed', 'press', 'release'];
    let out = rect(352, 20, 280, 292);
    out += rect(364, 32, 256, 40, 'lc-card', 4) + txt(376, 60, wait ? tr(`Stap ${step} · wacht`, `Step ${step} · waiting`) : tr(`Stap ${step}`, `Step ${step}`), 22, 'start', 'lc-big');
    rows.forEach((t, i) => {
      const y = 84 + i * 44;
      if (i + 1 === step) out += rect(364, y, 256, 38, 'lc-row', 4);
      out += txt(376, y + 27, `${i + 1}  ${t}`, 21, 'start', i + 1 === step ? 'lc-txt' : 'lc-mute');
    });
    return out;
  }
  // the ISO 13849-1 risk graph: S, F, P → PL a … e
  // leaves in the order S1F1P1 … S2F2P2, from the model (build.mjs, RISK)
  const LEAF = [56, 100, 144, 188, 232, 276, 320, 364];
  const PL = C.PL;
  function riskSvg(prog, leaf) {
    let out = rect(330, 8, 302, 388);
    const fy = [0, 1, 2, 3].map((i) => (LEAF[2 * i] + LEAF[2 * i + 1]) / 2);
    const sy = [(fy[0] + fy[1]) / 2, (fy[2] + fy[3]) / 2];
    const ry = (sy[0] + sy[1]) / 2;
    const xR = 348;
    const xS = 398;
    const xF = 458;
    const xP = 518;
    const path = (i) => { const f = i >> 1; const s = f >> 1; return [[xR, ry], [xS, ry], [xS, sy[s]], [xF, sy[s]], [xF, fy[f]], [xP, fy[f]], [xP, LEAF[i]], [560, LEAF[i]]]; };
    for (let i = 0; i < 8; i++) out += `<path class="lc-dim" d="${fmt(path(i))}"/>`;
    out += txt(xS - 6, 30, 'S', 21, 'middle', 'lc-mute') + txt(xF - 6, 30, 'F', 21, 'middle', 'lc-mute') + txt(xP - 6, 30, 'P', 21, 'middle', 'lc-mute');
    [['1', sy[0]], ['2', sy[1]]].forEach(([t, y]) => { out += txt(xS + 8, y - 6, t, 20, 'start', 'lc-mute'); });
    fy.forEach((y, i) => { out += txt(xF + 8, y - 6, String(1 + (i % 2)), 20, 'start', 'lc-mute'); });
    LEAF.forEach((y, i) => { out += txt(xP + 8, y - 6, String(1 + (i % 2)), 20, 'start', 'lc-mute'); });
    LEAF.forEach((y, i) => {
      const on = leaf === i && prog > 0.99;
      out += txt(570, y + 7, `PL ${PL[i]}`, 21, 'start', on ? 'lc-on' : 'lc-mute');
    });
    if (leaf >= 0 && prog > 0.01) {
      const pts = path(leaf);
      // draw the path up to prog along its length
      const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
      let left = prog * lens.reduce((a, b) => a + b, 0);
      const shown = [pts[0]];
      for (let i = 0; i < lens.length && left > 0; i++) {
        const t = Math.min(1, left / lens[i]);
        shown.push([lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]);
        left -= lens[i];
      }
      out += `<path class="lc-accl" d="${fmt(shown)}"/>`;
    }
    return out;
  }
  function regSvg() {
    let out = rect(352, 236, 280, 156);
    out += txt(372, 312, 'CE', 60, 'start', 'lc-big');
    out += txt(462, 284, tr('Verordening', 'Regulation'), 21, 'start', 'lc-txt');
    out += txt(462, 312, '(EU) 2023/1230', 21, 'start', 'lc-txt');
    out += txt(372, 370, tr('vanaf 20 januari 2027', 'from 20 January 2027'), 21, 'start', 'lc-txt');
    return out;
  }
  // the line OEE and the machine numbers 1–6
  function oeeSvg(oee) {
    let out = rect(12, 276, 250, 112);
    out += txt(26, 310, tr('per machine', 'per machine'), 21, 'start', 'lc-mute') + txt(248, 310, '> 90%', 22, 'end', 'lc-big');
    out += txt(26, 364, tr('lijn-OEE', 'line OEE'), 21, 'start', 'lc-txt') + txt(248, 368, `${Math.round(oee)}%`, 40, 'end', 'lc-big');
    return out;
  }
  // stopped: the labeller is in a micro-stop now; a "stop" flag beside its tag
  function tagsSvg(a, legend, stopped) {
    let out = '';
    C.MACH.forEach((cx, i) => {
      const [x, y] = toStage([cx + 16, -56, 100]);
      out += `<circle class="${i === 3 && legend === 2 ? 'lc-row' : 'lc-panel'}" cx="${f1(x)}" cy="${f1(y)}" r="15"/>` + txt(x, y + 7.5, String(i + 1), 21, 'middle', 'lc-big');
      if (i === 3 && stopped) out += rect(x + 20, y - 38, 62, 30, 'lc-row', 6) + txt(x + 51, y - 16, 'stop', 20, 'middle', 'lc-txt');
    });
    if (legend) {
      out += rect(276, 12, 352, 50);
      out += txt(290, 45, tr('2 vuller · 3 sluiter · 4 etiketteerder', '2 filler · 3 capper · 4 labeller'), 21, 'start', 'lc-txt');
    }
    return `<g style="opacity:${a.toFixed(2)}">${out}</g>`;
  }
  // machine states over a week, one bar per machine
  function statesSvg(prog, mark) {
    const rows = [
      [tr('2 vuller', '2 filler'), [[0, C.STATES.filler.run], [3, C.STATES.filler.blocked], [4, 100 - C.STATES.filler.run - C.STATES.filler.blocked]]],
      [tr('3 sluiter', '3 capper'), [[0, C.STATES.capper.run], [3, C.STATES.capper.blocked], [4, 100 - C.STATES.capper.run - C.STATES.capper.blocked]]],
      [tr('4 etiketteerder', '4 labeller'), [[0, C.STATES.labeller.run], [1, C.STATES.labeller.fault], [2, C.STATES.labeller.starved], [3, C.STATES.labeller.blocked]]],
    ];
    const x0 = 196;
    const x1 = 616;
    let out = rect(12, 216, 620, 180);
    rows.forEach(([name, segs], r) => {
      const y = 232 + r * 44;
      if (mark && r === 2) out += rect(16, y - 4, 612, 40, 'lc-row', 6);
      out += txt(26, y + 24, name, 21, 'start', 'lc-txt');
      let x = x0;
      for (const [s, v] of segs) {
        const w = ((x1 - x0) * v * clamp(prog * 3 - r, 0, 1)) / 100;
        out += `<rect class="lc-s${s}" x="${f1(x)}" y="${y}" width="${f1(Math.max(0, w - 1))}" height="32"/>`;
        if (v >= 20 && w > 40) out += txt(x + 8, y + 24, `${v}%`, 21, 'start', s === 0 ? 'lc-inv0' : s === 1 ? 'lc-inv1' : 'lc-txt');
        x += w;
      }
    });
    const keys = [[0, tr('draaien', 'running')], [1, tr('storing', 'faulted')], [2, 'starved'], [3, 'blocked'], [4, tr('overig', 'other')]];
    let lx = 26;
    for (const [s, t] of keys) {
      out += `<rect class="lc-s${s}" x="${lx}" y="${364}" width="18" height="18"/>` + txt(lx + 24, 380, t, 21, 'start', 'lc-mute');
      lx += 24 + t.length * 11 + 20;
    }
    return out;
  }
  // the alarm log of the press station (an example), then the week's totals
  function logSvg(rowsShown, chain, totals) {
    let out = rect(16, 120, 616, 272);
    out += txt(30, 150, tr('tijd', 'time'), 21, 'start', 'lc-mute') + txt(142, 150, 'code', 21, 'start', 'lc-mute') + txt(216, 150, tr('tekst', 'text'), 21, 'start', 'lc-mute') + txt(618, 150, EXAMPLE, 21, 'end', 'lc-mute');
    out += line(28, 162, 620, 162, 'lc-grid');
    if (totals > 0.01) {
      const T = NL
        ? [['Onderdeel niet aanwezig', C.ALARMS[0].n, '20 s'], ['Servostoring', C.ALARMS[1].n, '25 min'], ['Deur geopend', C.ALARMS[2].n, '30 s']]
        : [['Part missing in nest', C.ALARMS[0].n, '20 s'], ['Servo fault', C.ALARMS[1].n, '25 min'], ['Door opened', C.ALARMS[2].n, '30 s']];
      let o = rect(16, 120, 616, 272) + txt(30, 152, tr('één week, 10 diensten', 'one week, 10 shifts'), 21, 'start', 'lc-txt') + line(28, 164, 620, 164, 'lc-grid');
      T.forEach(([t, n, d], i) => {
        const y = 210 + i * 56;
        o += txt(30, y, t, 21, 'start', 'lc-txt') + txt(500, y, `${num(n)} ×`, 22, 'end', 'lc-big') + txt(616, y, d, 21, 'end', 'lc-mono');
      });
      return out + `<g style="opacity:${totals.toFixed(2)}">${o}</g>`;
    }
    const rows = NL
      ? [['06:14:02', 'A101', 'Onderdeel niet aanwezig'], ['06:14:03', 'A230', 'Cyclustijd te lang'], ['06:14:09', 'A045', 'Deur geopend'], ['06:14:15', 'A310', 'Stap 1 time-out'], ['06:20:40', 'A101', 'Onderdeel niet aanwezig']]
      : [['06:14:02', 'A101', 'Part missing in nest'], ['06:14:03', 'A230', 'Cycle time too long'], ['06:14:09', 'A045', 'Door opened'], ['06:14:15', 'A310', 'Step 1 time-out'], ['06:20:40', 'A101', 'Part missing in nest']];
    const n = Math.min(rows.length, Math.floor(rowsShown));
    for (let i = 0; i < n; i++) {
      const y = 194 + i * 40;
      const inChain = chain && i < 4;
      out += txt(30, y, rows[i][0], 21, 'start', inChain ? 'lc-mono' : 'lc-mute') + txt(142, y, rows[i][1], 21, 'start', 'lc-mono') + txt(216, y, rows[i][2], 21, 'start', inChain ? 'lc-txt' : 'lc-mute');
    }
    if (chain) out += `<path class="lc-accl" d="M22 176L22 ${194 + 3 * 40 + 8}"/>`;
    return out;
  }
  function firstSvg(a) {
    if (a <= 0.01) return '';
    return `<g style="opacity:${a.toFixed(2)}">${rect(20, 170, 608, 34, 'lc-row', 4)}${txt(30, 194, '06:14:02', 21, 'start', 'lc-mono')}${txt(142, 194, 'A101', 21, 'start', 'lc-mono')}${txt(216, 194, tr('Onderdeel niet aanwezig', 'Part missing in nest'), 21, 'start', 'lc-txt')}${txt(618, 194, 'first-out', 21, 'end', 'lc-big')}</g>`;
  }
  // the Pareto chart, by count or by minutes, rows sliding into order
  function paretoSvg(mode, grow) {
    const A = C.ALARMS;
    const names = NL ? ['Onderdeel niet aanwezig', 'Servostoring', 'Deur geopend'] : ['Part missing in nest', 'Servo fault', 'Door opened'];
    const vals = (m) => A.map((a) => (m ? a.min : a.n));
    const rank = (m) => { const v = vals(m); const idx = [0, 1, 2].sort((a, b) => v[b] - v[a] || a - b); return idx.map((_, r) => idx.indexOf(r)); };
    const r0 = rank(0);
    const r1 = rank(1);
    let out = rect(318, 20, 314, 372);
    out += txt(334, 56, mode < 0.5 ? tr('op aantal', 'by count') : tr('op verloren minuten', 'by lost minutes'), 22, 'start', 'lc-big');
    const v0 = vals(0);
    const v1 = vals(1);
    for (let i = 0; i < 3; i++) {
      const y = 96 + lerp(r0[i], r1[i], mode) * 92;
      const frac = lerp(v0[i] / Math.max(...v0), v1[i] / Math.max(...v1), mode);
      const w = 180 * frac * grow;
      out += txt(334, y + 4, names[i], 21, 'start', 'lc-txt');
      out += `<rect class="fp-meter"${i === 0 ? ' data-top=""' : ''} x="334" y="${f1(y + 14)}" width="${f1(Math.max(2, w))}" height="26" rx="2"/>`;
      const v = mode < 0.5 ? `${num(v0[i])} ×` : `${v1[i]} min`;
      out += txt(334 + Math.max(2, w) + 8, y + 35, v, 21, 'start', 'lc-big');
    }
    return out;
  }
  function mesSvg() {
    let out = rect(12, 232, 300, 160);
    out += txt(28, 268, 'MES', 26, 'start', 'lc-big') + txt(298, 266, EXAMPLE, 21, 'end', 'lc-mute');
    const rows = NL ? ['order · dienst · reden', 'lijn-OEE live', 'top 3 stops van gisteren'] : ['order · shift · reason', 'line OEE live', 'yesterday’s top 3 stops'];
    rows.forEach((t, i) => { out += `<circle class="lc-acc" cx="32" cy="${300 + i * 32}" r="4"/>` + txt(44, 307 + i * 32, t, 21, 'start', 'lc-txt'); });
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['scan', 'ladder', 'hmiz', 'risk', 'reg', 'oee', 'tags', 'states', 'log', 'pareto', 'mes'];
  const RUN = { leds: { psu: 1, run: 1, k0a: 1, k0b: 1, k0p: 1 }, tower: 0, k12: true };
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    const st = { ...RUN, leds: { ...RUN.leds }, jaw: 0, ram: 0, hmi: 1 };
    let phi = -0.6 + 0.5 * Math.sin(clockS * 0.5);
    let lift = 0.5 + 0.5 * Math.sin(clockS * 0.8);
    let doorTh = 0;
    let bottles = 'still';
    const lamps = [1, 1, 1, 1, 1, 1];

    // one press cycle on the station's own clock: part, clamp, press, release
    const cycle = (t) => {
      const c = t % 8;
      st.part = true;
      st.jaw = span(c, 1, 1.8) - span(c, 5.4, 6.2);
      st.ram = span(c, 2.6, 3.6) - span(c, 4.2, 5.2);
      st.leds.i0 = 1;
      st.leds.b0 = 1;
      st.leds.i1 = st.jaw > 0.98 ? 1 : 0;
      st.leds.b1 = st.leds.i1;
      st.leds.q0 = c > 0.8 && c < 5.4 ? 1 : 0;
      st.leds.y1 = st.leds.q0;
      st.leds.q1 = c > 2.4 && c < 4.2 ? 1 : 0;
      st.leds.y2 = st.leds.q1;
      st.hmi = c < 0.8 ? 1 : c < 1.8 ? 2 : c < 2.6 ? 3 : c < 5.2 ? 4 : 5;
    };

    if (si === 0) {
      cycle(clockS);
    } else if (si === 1) {
      vis.scan = b <= 1 ? span(u, 0, 0.03) * (b === 1 ? 1 - span(p, 0.9, 1) : 1) : 0;
      if (vis.scan > 0.01) set(E.scan, scanSvg((clockS * 0.9) % 1, b === 1 ? '10 ms' : tr('en opnieuw', 'and again')));
      vis.ladder = b >= 2 ? span(p, 0, 0.12) + (b === 3 ? 1 : 0) : 0;
      const flow = b === 3 ? span(p, 0.05, 0.6) : 0;
      if (vis.ladder > 0.01) set(E.ladder, ladderSvg(flow));
      st.part = true;
      st.leds.i0 = 1;
      st.leds.b0 = 1;
      st.jaw = b === 3 ? span(p, 0.62, 0.85) : 0;
      st.leds.q0 = b === 3 && p > 0.6 ? 1 : 0;
      st.leds.y1 = st.leds.q0;
      st.leds.i1 = st.jaw > 0.98 ? 1 : 0;
      st.leds.b1 = st.leds.i1;
      st.hmi = st.jaw > 0 ? 2 : 1;
    } else if (si === 2) {
      // the clamp closes, but "klem dicht" never comes: hang in step 3
      st.part = true;
      st.leds.i0 = 1;
      st.leds.b0 = 1;
      const step = b === 0 ? 1 : b === 1 ? 1 + Math.min(2, Math.floor(span(p, 0.1, 0.9) * 3)) : 3;
      st.hmi = step;
      st.jaw = step >= 2 ? (b === 1 ? span(p, 0.35, 0.6) : 1) : 0;
      st.leds.q0 = step >= 2 ? 1 : 0;
      st.leds.y1 = st.leds.q0;
      st.tower = b >= 2 ? 1 : 0;
      vis.hmiz = b >= 1 && b <= 2 ? span(p, 0, 0.1) + (b === 2 ? 1 : 0) : 0;
      if (vis.hmiz > 0.01) set(E.hmiz, hmiSvg(step, b === 2));
    } else if (si === 3) {
      // e-stop pressed: the relay drops K1 and K2; a cut wire does the same; reset, then start
      cycle(clockS);
      const pressed = b === 0 ? span(p, 0.15, 0.3) : b === 3 ? 1 - span(p, 0.15, 0.3) : b === 1 ? 1 : 0;
      st.estop = pressed;
      const dropped = (b === 0 && p > 0.3) || b === 1 || b === 2 || (b === 3 && p < 0.7);
      st.chainCut = b === 2 && p > 0.15;
      if (dropped) {
        st.k12 = false;
        st.leds.k0a = 0;
        st.leds.k0b = 0;
        st.leds.k0p = b === 2 ? 1 : 0;
        st.tower = 2;
        st.leds.q0 = 0;
        st.leds.q1 = 0;
        st.leds.y1 = 0;
        st.leds.y2 = 0;
        st.jaw = 0;
        st.ram = 0;
      }
      if (b === 3) {
        flag(E['btn-reset'], 'data-lit', p > 0.55 && p < 0.7);
        flag(E['btn-start'], 'data-lit', p > 0.72 && p < 0.85);
      } else { flag(E['btn-reset'], 'data-lit', false); flag(E['btn-start'], 'data-lit', false); }
    } else if (si === 4) {
      // the robot works; the door opens, the robot stops; the risk graph; CE and the regulation
      const open = b === 0 ? span(p, 0.1, 0.45) : b === 1 || b === 2 ? 1 : 1 - span(p, 0, 0.3);
      doorTh = 1.15 * open;
      // the robot stops the moment the door starts to open, and stays stopped
      const bs = beatStarts(D.scenes[4], 'nl');
      const t0 = bs[0] + 0.1 * (bs[1] - bs[0]);
      const te = Math.min(clockS, t0);
      phi = -0.6 + 0.5 * Math.sin(te * 0.5);
      lift = 0.5 + 0.5 * Math.sin(te * 0.8);
      st.leds.ds = open < 0.02 ? 1 : 0;
      vis.risk = b === 1 || b === 2 ? span(p, 0, 0.1) + (b === 2 ? 1 : 0) : 0;
      if (vis.risk > 0.01) set(E.risk, riskSvg(b === 2 ? span(p, 0.05, 0.4) : 0, b === 2 ? (p > 0.55 ? C.LEAF_E : C.LEAF_D) : -1));
      if (b === 2 && p > 0.55) set(E.risk, riskSvg(span(p, 0.6, 0.85), C.LEAF_E));
      vis.reg = b === 3 ? span(p, 0.35, 0.5) : 0;
      if (vis.reg > 0.01) set(E.reg, regSvg());
    } else if (si === 5 || si === 6) {
      bottles = 'flow';
      const running = labRunning(clockS);
      if (si === 5) {
        vis.tags = span(u, 0, 0.04);
        set(E.tags, tagsSvg(1, b === 0 ? 1 : b === 2 ? 2 : 0, b >= 2 && !running));
        vis.oee = b >= 1 ? (b === 1 ? span(p, 0, 0.15) : 1) : 0;
        if (vis.oee > 0.01) set(E.oee, oeeSvg(b === 1 ? lerp(92, 58, span(p, 0.4, 0.8)) : 58));
      } else {
        vis.tags = 1;
        set(E.tags, tagsSvg(1, b >= 2 ? 2 : 0, !running));
        vis.states = span(u, 0, 0.03);
        set(E.states, statesSvg(b === 0 ? span(p, 0.1, 0.9) : 1, b >= 2));
      }
      lamps[3] = running ? 1 : 0;
      if (!running) { lamps[4] = 0; lamps[5] = 0; }
    } else if (si === 7) {
      cycle(clockS);
      vis.log = span(u, 0, 0.03);
      const rows = b === 0 ? 1 + span(p, 0.1, 0.9) * 4 : 5;
      set(E.logIn, logSvg(rows, b === 1 || b === 2, b === 3 ? span(p, 0, 0.15) : 0));
      set(E.logFirst, firstSvg(b === 2 ? span(p, 0.05, 0.25) : 0));
      if (b <= 2) { st.part = false; st.leds.i0 = 0; st.leds.b0 = 0; st.tower = 1; st.jaw = 0; st.ram = 0; st.leds.q0 = 0; st.leds.y1 = 0; st.leds.q1 = 0; st.leds.y2 = 0; st.hmi = 1; }
    } else if (si === 8) {
      cycle(clockS);
      vis.pareto = b <= 2 ? span(u, 0, 0.03) : 1 - span(p, 0, 0.1);
      set(E.pareto, paretoSvg(b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.45) : 1, b === 0 ? span(p, 0.1, 0.6) : 1));
      vis.mes = b === 3 ? span(p, 0.05, 0.2) : 0;
      if (vis.mes > 0.01) set(E.mes, mesSvg());
    }

    renderStation(st);
    set(E.robot, robotSvg(phi, lift));
    const th = doorTh;
    set(E.door, th < 0.01 ? doorSvg(0) : '');
    set(E.doorFront, th >= 0.01 ? doorSvg(th) : '');
    set(E.bottles, bottlesSvg(bottles, clockS));
    lamps.forEach((on, i) => { flag(E['lamp' + i], 'data-lit', on && si >= 5 && si <= 6); flag(E['lampB' + i], 'data-lit', !on && si >= 5 && si <= 6); });
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
