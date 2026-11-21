// The stage library of the four arc-welding films (Task 17, batch B1): the bench, its weld pass by pass, the torches,
// the arc, wire and gas, the section face, the HUD pieces (dial, droplet close-up, flow meter, documents, cooling
// chart, macro, CEV card, thermometer, clock, note card) and the camera. Each film adds its own scenes (its
// stage.js, appended to this file by the build; the closing of the function is there). A pure function of
// (scene, u). Inlined into the page after the anatomy kit (iso-kit functions in scope, the lathe module as G)
// and a preamble from room.mjs that defines P (projection), C (world constants and the beat starts), CAM (one
// camera move per scene), W and H. Every label is drawn as tr('nl', 'en') at 20 units or more.
/* global G, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, translateAlong, span */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const el = (k) => svg.querySelector(`[data-k="${k}"]`);
  const E = {};
  // a part this film's drawing does not have is a detached element of its own: the stage draws into it unseen
  const GONE = {};
  const KEYS = ['world', 'digits', 'spool', 'ghose', 'section', 'haz', 'heat', 'bead', 'pores', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'rod', 'magT', 'tigT', 'flame', 'heatT', 'travel',
    'scrim', 'dial', 'needle', 'dialText', 'mag', 'magLead', 'magBase', 'magShort', 'magSpray', 'flow', 'flowScale', 'flowBall',
    'docs', 'docA', 'docB', 'docEss', 'docRange', 'docHeat', 'docCert', 'docCoord', 'chart', 'chartBody', 'chartCurve', 'chartT85', 'cev', 'therm', 'clock', 'macro', 'macroLead', 'macroBody', 'macroIso', 'macroMart', 'macroCrack', 'card'];
  KEYS.forEach((k) => { E[k] = el(k) || (GONE[k] = document.createElementNS('http://www.w3.org/2000/svg', 'g')); });
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tr = (nl, en) => (EN ? en : nl);
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const num = (v, dec = 0) => { const s = v.toFixed(dec); return EN ? s : s.replace('.', ','); };
  const at = (p) => iso(p, P);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const op = (e, v) => { const s = String(Math.round(v * 100) / 100); if (e.__o !== s) { e.style.opacity = s; e.__o = s; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const pth = (pts, closed = false) => pathOf(pts, closed);
  const seeded = (i) => { const s = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return s - Math.floor(s); };
  let camW = W;
  const label = (x, y, text, size = 22, anchor = 'middle', hud = false, cls = 'fp-label') => `<text class="fp-ink ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${f1(hud ? size : size * camW / W)}" text-anchor="${anchor}">${text}</text>`;
  const hudText = (x, y, text, size = 20, anchor = 'middle', cls = 'fp-label') => label(x, y, text, size, anchor, true, cls);
  const mark = (d, extra = '') => `<path class="fp-mark" d="${d}"${extra}/>`;
  const arrowHead = (from, to, len, hud = false) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    const l = hud ? len : len * camW / W;
    return `M${f1(to[0] - ux * l - uy * l * 0.55)} ${f1(to[1] - uy * l + ux * l * 0.55)}L${f1(to[0])} ${f1(to[1])}L${f1(to[0] - ux * l + uy * l * 0.55)} ${f1(to[1] - uy * l - ux * l * 0.55)}`;
  };
  const PT = C.PT;
  const XE = C.XE;
  const MAGF = G.frameAlong([0, 0, 0], C.MAG_AX);
  const TIGF = G.frameAlong([0, 0, 0], C.TIG_AX);
  const HEATF = G.frameAlong([0, 0, 0], C.HEAT_AX);

  // ------------------------------------------------------------ the weld, pass by pass
  // Each scene that welds lays one stretch; earlier stretches stay.
  const PORE_X = -82; // where the gas had dropped below 10 L/min (the run flagged pores)
  // the end of the weld now, and the stretches laid so far
  function weldAt(RUNS, si, u) {
    const out = [];
    let tip = XE;
    for (const r of RUNS) {
      if (r.si < si) { out.push({ ...r, x: r.x1 }); tip = r.x1; } else if (r.si === si) {
        const x = lerp(r.x0, r.x1, span(u, r.a, r.b));
        if (r.x0 - x > 0.4) out.push({ ...r, x });
        tip = x;
      }
    }
    return { runs: out, tip };
  }
  const zOf = (y, w, h) => PT + h * Math.sqrt(Math.max(0, 1 - (2 * y / w) ** 2));
  function beadSvg(runs) {
    let fill = '';
    let ripples = '';
    for (const r of runs) {
      const x0 = r.x0;
      const x1 = r.x;
      const hw = r.w / 2;
      const ys = [];
      for (let i = 0; i <= 10; i++) ys.push(hw - (2 * hw * i) / 10);
      const cap = (x) => ys.map((y) => at([x, y, zOf(y, r.w, r.h)]));
      const front = [];
      const back = [];
      const n = Math.max(1, Math.ceil((x0 - x1) / 6));
      for (let i = 0; i <= n; i++) {
        const x = lerp(x0, x1, i / n);
        front.push(at([x, hw, PT]));
        back.push(at([x, -hw, PT]));
      }
      fill += `<path class="fp-bead" d="${pth([...front, ...cap(x1), ...back.reverse(), ...cap(x0).reverse()], true)}"/>`;
      // ripples: chevrons pointing the way the torch went
      const step = r.w > 22 ? 2.6 : 2;
      const lines = [];
      for (let x = x1 + 3; x < x0 - 0.5; x += step) lines.push(pth(ys.map((y) => at([x - 1.8 * (1 - (y / hw) ** 2), y, zOf(y, r.w, r.h) + 0.05]))));
      ripples += `<path class="fp-ripple" d="${lines.join('')}"/>`;
    }
    return fill + ripples;
  }
  function poresSvg(runs) {
    const r = runs.find((q) => q.pores);
    if (!r || r.x > PORE_X) return '';
    let out = '';
    for (let i = 0; i < 26; i++) {
      const x = PORE_X - seeded(i) * (PORE_X - (r.x1 - 2));
      if (x < r.x + 3) continue;
      const y = (seeded(i + 40) - 0.5) * r.w * 0.7;
      const rr = 0.6 + seeded(i + 80) * 1.1;
      const z = zOf(y, r.w, r.h) + 0.1;
      const ring = [];
      for (let k = 0; k < 10; k++) { const a = (k / 10) * TAU; ring.push(at([x + Math.cos(a) * rr, y + Math.sin(a) * rr, z])); }
      out += `<path class="fp-pore" d="${pth(ring, true)}"/>`;
    }
    return out;
  }
  function hazSvg(runs) {
    let out = '';
    for (const r of runs) {
      const hw = r.w / 2;
      for (const s of [1, -1]) {
        const a = hw * s;
        const b = (hw + 4.5) * s;
        out += `<path class="fp-hazf" d="${pth([at([r.x0, a, PT]), at([r.x, a, PT]), at([r.x, b, PT]), at([r.x0, b, PT])], true)}"/>`;
      }
    }
    return out;
  }
  const ellipseTop = (cx, cy, rx, ry, z, tail = 0) => {
    const pts = [];
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * TAU;
      const c = Math.cos(a);
      pts.push(at([cx + c * rx * (c > 0 ? 1 + tail : 1), cy + Math.sin(a) * ry, z]));
    }
    return pth(pts, true);
  };

  // ------------------------------------------------------------ the section face (x = XE), drawn once
  const G30 = Math.tan(Math.PI / 6);
  const fus = (z) => (z <= 2 ? 2.2 : 2.2 + (z - 2) * G30 + 0.6 * (z - 2) / 18);
  const FT = fus(PT);
  const sec = (pts) => pth(pts.map(([y, z]) => at([XE + 0.15, y, z])), true);
  const secLine = (pts) => pth(pts.map(([y, z]) => at([XE + 0.15, y, z])));
  const SECT = (() => {
    const right = [];
    const left = [];
    for (let z = 0; z <= PT + 0.01; z += 2) { right.push([fus(z), z]); left.push([-fus(z), z]); }
    const cap = [];
    for (let i = 0; i <= 12; i++) { const y = FT - (2 * FT * i) / 12; cap.push([y, PT + 3 * Math.sqrt(Math.max(0, 1 - (y / FT) ** 2))]); }
    const root = [];
    for (let i = 0; i <= 6; i++) { const y = -2.5 + (5 * i) / 6; root.push([y, -1.1 * Math.sqrt(Math.max(0, 1 - (y / 2.5) ** 2))]); }
    const weld = [...root, ...right, ...cap, ...left.reverse()];
    const hz = (z) => fus(z) + 3.2;
    const hr = [];
    const hl = [];
    for (let z = 0; z <= PT + 0.01; z += 2) { hr.push([hz(z), z]); hl.push([-hz(z), z]); }
    const haz = [[-4.6, -0.6], [4.6, -0.6], ...hr, [FT, PT], ...hl.slice().reverse().slice(0, 0), [-FT, PT], ...hl.reverse()];
    const passPts = [5, 11, 16].map((zk) => {
      const pts = [];
      const f = fus(zk);
      for (let i = 0; i <= 10; i++) { const y = -f + (2 * f * i) / 10; pts.push([y, zk + 1.6 * (1 - (y / f) ** 2)]); }
      return pts;
    });
    return { weld, haz, passes: passPts };
  })();
  set(E.section, `<path class="fp-hazf" d="${sec(SECT.haz)}"/><path class="fp-weld" d="${sec(SECT.weld)}"/><path class="fp-ripple" d="${SECT.passes.map(secLine).join('')}"/>`);

  // the macro (scenes 7–8): the same section, drawn flat and large, as an etched cut is looked at
  const MC = C.MACRO;
  const MK = 5.6;
  const mX = (y) => MC.x + MC.w / 2 + y * MK;
  const mZ = (z) => MC.y + 34 + (25 - z) * MK;
  const M2 = (pts, closed = true) => pth(pts.map(([y, z]) => [mX(y), mZ(z)]), closed);
  (() => {
    const { gap, face, top } = C.GROOVE;
    const far = [[-40, 0], [-gap, 0], [-gap, face], [-top, PT], [-40, PT]];
    const near = [[gap, 0], [40, 0], [40, PT], [top, PT], [gap, face]];
    const table = `<path class="fp-meter" d="${M2([[-40, 0], [40, 0], [40, -6], [-40, -6]])}"/>`;
    set(E.macroBody, table + `<path class="fp-steel" d="${M2(far)}"/><path class="fp-steel" d="${M2(near)}"/><path class="fp-hazf" d="${M2(SECT.haz)}"/><path class="fp-weld" d="${M2(SECT.weld)}"/><path class="fp-ripple" d="${SECT.passes.map((q) => M2(q, false)).join('')}"/>`);
    const lines = [];
    for (let i = 0; i < 60; i++) {
      const z = 1 + seeded(i) * (PT - 1.5);
      const side = i % 2 ? 1 : -1;
      const y = side * (fus(z) + 0.3 + seeded(i + 50) * 1.4);
      const a = seeded(i + 100) * Math.PI;
      const l = 0.7;
      lines.push(M2([[y - Math.cos(a) * l, z - Math.sin(a) * l], [y + Math.cos(a) * l, z + Math.sin(a) * l]], false));
    }
    set(E.macroMart, `<path class="fp-needle" style="stroke-width:1.2" d="${lines.join('')}"/>`);
  })();

  // ------------------------------------------------------------ torches, arc, wire, gas, cable
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const ptOn = (F, s, o) => add(G.pointOf(F, s, 0, 0), o);
  function cableSvg(from, to, sag, kink = 0) {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const p = [lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t) - sag * Math.sin(Math.PI * t)];
      if (kink > 0) { const d = Math.max(0, 1 - Math.abs(t - 0.32) / 0.07); p[1] += kink * 9 * d; p[2] += kink * 6 * d; }
      pts.push(at(p));
    }
    const d = pth(pts);
    return `<path class="fp-hose" stroke-width="5" d="${d}"/><path class="fp-hose-hi" stroke-width="2" d="${d}"/>`;
  }
  function arcSvg(p, r, clockS) {
    const [x, y] = at(p);
    const k = camW / W;
    const fl = 1 + 0.12 * Math.sin(clockS * 37) + 0.08 * Math.sin(clockS * 61);
    const R = r * k * fl;
    const rays = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU + clockS * 0.7;
      const r0 = R * 0.35;
      const r1 = R * (0.6 + 0.35 * seeded(i + Math.floor(clockS * 9)));
      rays.push(`M${f1(x + Math.cos(a) * r0)} ${f1(y + Math.sin(a) * r0)}L${f1(x + Math.cos(a) * r1)} ${f1(y + Math.sin(a) * r1)}`);
    }
    return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R)}" fill="url(#fp-glow)"/><path class="fp-ray" d="${rays.join('')}"/><circle class="fp-hotf" cx="${f1(x)}" cy="${f1(y)}" r="${f1(R * 0.18)}"/>`;
  }
  function gasSvg(o, clockS, amount) {
    if (amount <= 0.02) return '';
    const lines = [];
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const top = G.pointOf(MAGF, 13, 6.5, a);
      const radial = G.sub3(top, G.pointOf(MAGF, 13, 0, 0));
      const bot = [top[0] + radial[0] * 0.9, top[1] + radial[1] * 0.9, 0.4];
      if (radial[1] < -2) continue; // the back of the cone is hidden behind the nozzle
      lines.push(pth([at(add(top, o)), at(add(G.add3(G.mul3(top, 0.5), G.mul3(bot, 0.5)), o)), at(add(bot, o))]));
    }
    const off = -((clockS * 14) % 14);
    return `<path class="fp-gas" style="stroke-dashoffset:${f1(off)};opacity:${amount.toFixed(2)}" d="${lines.join('')}"/>`;
  }

  // ------------------------------------------------------------ camera
  function camera(si, u) {
    const c = CAM[si];
    let from = c.from;
    let to = c.to;
    let k = span(u, c.a ?? 0, c.b ?? 1);
    if (c.keys) {
      // a tour: one framing per beat, the camera glides there over the first quarter of the beat
      const bk = beatOf(si, u);
      const B = C.B[si];
      from = c.keys[Math.max(0, bk - 1)];
      to = c.keys[bk];
      k = span((u - B[bk]) / Math.max(1e-6, B[bk + 1] - B[bk]), 0, 0.25);
    }
    const cx = lerp(from[0], to[0], k);
    const cy = lerp(from[1], to[1], k);
    const w = lerp(from[2], to[2], k);
    camW = w;
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
    return { cx, cy, s };
  }
  const toHud = (p, cam) => { const [x, y] = at(p); return [(x - cam.cx) * cam.s + W / 2, (y - cam.cy) * cam.s + H / 2]; };

  // ------------------------------------------------------------ the machine's displays and spool
  const M = C.MACH;
  const yf = M.y + M.d;
  const xr = M.x + M.w;
  function digits(v, a) {
    const t = (x, s) => { const [px, py] = at([x, yf + 0.3, 56.5]); return `<text class="fp-ink fp-small" x="${f1(px)}" y="${f1(py)}" font-size="7" text-anchor="middle">${s}</text>`; };
    return t(M.x + 25, v) + t(M.x + 57, a);
  }
  function spoolSvg(angle) {
    const cy = M.y + 39;
    const cz = 49;
    const ringPts = (r) => { const pts = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; pts.push(at([xr + 0.3, cy + Math.cos(a) * r, cz + Math.sin(a) * r])); } return pth(pts, true); };
    const spokes = [0, 1, 2].map((i) => { const a = angle + (i * TAU) / 3; return pth([at([xr + 0.3, cy + Math.cos(a) * 3.5, cz + Math.sin(a) * 3.5]), at([xr + 0.3, cy + Math.cos(a) * 11, cz + Math.sin(a) * 11])]); }).join('');
    return `<path class="fp-glass" d="${ringPts(12)}"/>${mark(ringPts(8.5))}${mark(spokes)}${mark(ringPts(3.5))}`;
  }
  const SPOOL_TURNS = [0, 0, 0, 0, 0, 0, 0, 0];

  // ------------------------------------------------------------ HUD builders
  const [dx, dy] = C.DIAL;
  function dialSvg(wfs) {
    const ang = -2.35 + (wfs / 16) * 4.7;
    set(E.needle, `<path class="fp-mark fp-needle-h" style="stroke-width:2.4" d="M${f1(dx)} ${f1(dy)}L${f1(dx + Math.sin(ang) * 40)} ${f1(dy - Math.cos(ang) * 40)}"/>`);
    set(E.dialText, hudText(dx, dy + 36, num(wfs, 0), 26) + hudText(dx, dy + 86, 'm/min', 20, 'middle', 'fp-small'));
  }
  const [mx, my] = C.MAG;
  const MR = C.MAG_R;
  const POOL_Y = my + 62;
  function magBase(clockS) {
    const wave = [];
    for (let i = 0; i <= 40; i++) { const x = mx - MR + (2 * MR * i) / 40; wave.push([x, POOL_Y + Math.sin(i * 0.7 + clockS * 5) * 2.2 - 10 * Math.exp(-(((x - mx) / 30) ** 2))]); }
    const fill = pth([...wave, [mx + MR, my + MR], [mx - MR, my + MR]], true);
    const nozzle = `<path class="fp-card" d="M${mx - 58} ${my - MR}L${mx - 50} ${my - 46}L${mx - 36} ${my - 46}L${mx - 40} ${my - MR}Z"/><path class="fp-card" d="M${mx + 58} ${my - MR}L${mx + 50} ${my - 46}L${mx + 36} ${my - 46}L${mx + 40} ${my - MR}Z"/>`;
    const tip = `<path class="fp-card" d="M${mx - 14} ${my - MR}L${mx - 14} ${my - 62}L${mx - 8} ${my - 54}L${mx + 8} ${my - 54}L${mx + 14} ${my - 62}L${mx + 14} ${my - MR}Z"/>`;
    const skin = pth(wave.map(([x, y]) => [x, y + 6]).reverse());
    return `<path class="fp-weld" d="${fill}"/><path class="fp-pool" d="${pth(wave)}${skin.replace('M', 'L')}Z"/>${nozzle}${tip}`;
  }
  function magShort(clockS) {
    // the wire dips into the pool about 2 times a second here (really tens of times)
    const ph = (clockS * 2) % 1;
    const end = ph < 0.6 ? lerp(my - 6, POOL_Y - 10, ph / 0.6) : lerp(POOL_Y - 10, my - 6, (ph - 0.6) / 0.4);
    const ball = ph < 0.6 ? 3 + 4 * (ph / 0.6) : 2;
    return `<path class="fp-wire" style="stroke-width:5" d="M${mx} ${my - 54}L${mx} ${f1(end)}"/><circle class="fp-drop" cx="${mx}" cy="${f1(end + ball * 0.6)}" r="${f1(ball)}"/>`
      + (ph > 0.5 && ph < 0.62 ? arcRays(mx, end + 4, 18) : arcRays(mx, end + 4, 10));
  }
  function magSpray(clockS) {
    const tipY = my - 2;
    let drops = '';
    for (let i = 0; i < 14; i++) {
      const t = ((clockS * 1.6 + i / 14) % 1);
      const y = lerp(tipY + 6, POOL_Y - 12, t);
      const x = mx + Math.sin(i * 2.3) * 3 * t;
      drops += `<circle class="fp-drop" cx="${f1(x)}" cy="${f1(y)}" r="2"/>`;
    }
    return `<path class="fp-wire" style="stroke-width:5" d="M${mx} ${my - 54}L${mx} ${f1(tipY - 4)}"/><path class="fp-drop" d="M${mx - 2.5} ${f1(tipY - 5)}L${mx + 2.5} ${f1(tipY - 5)}L${mx} ${f1(tipY + 3)}Z"/>${arcRays(mx, tipY + 30, 34)}${drops}`;
  }
  function arcRays(x, y, r) {
    return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="url(#fp-glow)"/>`;
  }
  const [fx, fy0, fy1] = C.FLOW;
  const flowY = (v) => fy1 - 10 - (v / 20) * (fy1 - fy0 - 20);
  set(E.flowScale, (() => {
    let t = '';
    for (let v = 0; v <= 20; v++) t += `M${fx + 10} ${f1(flowY(v))}L${fx + (v % 5 ? 16 : 22)} ${f1(flowY(v))}`;
    let labels = '';
    for (const v of [5, 10, 15, 20]) labels += hudText(fx + 26, flowY(v) + 6, String(v), 20, 'start', 'fp-small');
    return mark(t) + labels + `<path class="fp-mark" style="stroke-width:2.6" d="M${fx - 14} ${f1(flowY(10))}L${fx + 10} ${f1(flowY(10))}"/><path class="fp-mark" d="M${fx - 24} ${f1(flowY(10) - 6)}L${fx - 14} ${f1(flowY(10))}L${fx - 24} ${f1(flowY(10) + 6)}Z"/>` + hudText(fx + 12, fy0 - 10, 'L/min', 20, 'middle', 'fp-small');
  })());

  const card = (x, y, w, h) => `<rect class="fp-card" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`;
  const rules = (x, y, w, n, gap) => { let d = ''; for (let i = 0; i < n; i++) d += `M${x} ${y + i * gap}L${x + w * (i % 3 === 2 ? 0.6 : 1)} ${y + i * gap}`; return `<path class="fp-rule" d="${d}"/>`; };
  const check = (x, y, s = 1) => `<path class="fp-mark" style="stroke-width:3" d="M${f1(x - 7 * s)} ${f1(y)}L${f1(x - 2 * s)} ${f1(y + 6 * s)}L${f1(x + 8 * s)} ${f1(y - 7 * s)}"/>`;
  const cross = (x, y) => `<path class="fp-mark" style="stroke-width:3" d="M${x - 7} ${y - 7}L${x + 7} ${y + 7}M${x + 7} ${y - 7}L${x - 7} ${y + 7}"/>`;
  const BAR = { x0: 252, x1: 596 };
  const barX = (v, lo, hi) => BAR.x0 + ((v - lo) / (hi - lo)) * (BAR.x1 - BAR.x0);
  // cooling chart (scene 7): 3D heat flow, T = T0 + a / t, t8/5 from build.mjs
  const CH = C.CHART;
  const A3 = C.T85 / (1 / 480 - 1 / 780);
  const TMAX = 24;
  const ox = CH.x + 48;
  const oy = CH.y + CH.h - 34;
  const cw = CH.w - 66;
  const chh = CH.h - 58;
  const cX = (t) => ox + (t / TMAX) * cw;
  const cY = (T) => oy - (T / 1500) * chh;
  const Tof = (t) => (t < 0.3 ? lerp(20, 1450, t / 0.3) : Math.min(1450, 20 + A3 / (t + A3 / 1430 - 0.3)));
  set(E.chartBody, (() => {
    const axes = mark(`M${ox} ${oy - chh - 4}L${ox} ${oy}L${ox + cw + 6} ${oy}`);
    const lines = [800, 500].map((T) => `<path class="fp-iso" d="M${ox} ${f1(cY(T))}L${f1(ox + cw)} ${f1(cY(T))}"/>${hudText(ox - 6, cY(T) + 6, String(T), 20, 'end', 'fp-small')}`).join('');
    return axes + lines + hudText(ox - 6, oy - chh + 4, '°C', 20, 'end', 'fp-small') + hudText(ox + cw + 4, oy + 22, 's', 20, 'end', 'fp-small');
  })());
  function chartAt(tau) {
    const pts = [];
    for (let i = 0; i <= 60; i++) { const t = (i / 60) * tau; pts.push([cX(t), cY(Tof(t))]); }
    // tc8 and tc5 are where the curve crosses 800 and 500 °C
    const c8 = solveT(800);
    const c5 = solveT(500);
    const shownBracket = tau > c5;
    const br = shownBracket ? `<path class="fp-mark" style="stroke-width:2" d="M${f1(cX(c8))} ${f1(cY(800))}L${f1(cX(c8))} ${f1(oy - 14)}M${f1(cX(c5))} ${f1(cY(500))}L${f1(cX(c5))} ${f1(oy - 14)}M${f1(cX(c8))} ${f1(oy - 14)}L${f1(cX(c5))} ${f1(oy - 14)}"/>${hudText((cX(c8) + cX(c5)) / 2, oy - 22, 't8/5', 20)}` : '';
    const [px, py] = pts[pts.length - 1];
    return { curve: `<path class="fp-mark" style="stroke-width:2.2" d="${pth(pts)}"/><circle class="fp-drop" cx="${f1(px)}" cy="${f1(py)}" r="4"/>`, br };
  }
  function solveT(T) { let lo = 0.3; let hi = TMAX; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (Tof(m) > T) lo = m; else hi = m; } return lo; }

  // isotherms in the section (scene 7): half-rings round the weld's top
  function isoSvg(r, cls = 'fp-iso') {
    if (r < 0.5) return '';
    const pts = [];
    for (let i = 0; i <= 20; i++) { const a = -Math.PI / 2 + (i / 20) * Math.PI; pts.push([Math.sin(a) * r, PT + 3 - Math.cos(a) * r * 0.95]); }
    return cls === 'fp-hotf' ? `<path class="fp-hotf" style="opacity:.5" d="${M2(pts)}"/>` : `<path class="${cls}" d="${M2(pts, false)}"/>`;
  }
  function macroLead(cam) {
    const [sx, sy] = toHud([XE, 0, 10], cam);
    set(E.macroLead, `<path class="fp-mark" d="M${f1(sx)} ${f1(sy)}L${MC.x} ${f1(MC.y + MC.h / 2)}"/><circle class="fp-ink" cx="${f1(sx)}" cy="${f1(sy)}" r="3"/>`);
  }


  // ------------------------------------------------------------ the note card (Task 17)
  // The words are drawn as tr('nl', 'en'): the kit measures both languages (checkScope.stageFns). A text drawn
  // here is 22 units or more.
  const mono = (x, y, t, size = 22, anchor = 'start', cls = 'fp-ink fp-code') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const panelD = (x, y, w, h) => `<path class="fp-card" d="M${x + 8} ${y}h${w - 16}a8 8 0 0 1 8 8v${h - 16}a8 8 0 0 1 -8 8h${-(w - 16)}a8 8 0 0 1 -8 -8v${-(h - 16)}a8 8 0 0 1 8 -8z"/>`;
  // the beat a scene is in at u (C.B[si] holds the start of every beat and then 1)
  const beatOf = (si, u) => {
    const B = C.B[si];
    let b = 0;
    for (let i = 0; i < B.length - 1; i++) if (u >= B[i] - 1e-9) b = i;
    return b;
  };
  const ROWH = 34;
  // rows: [beat, text, 'code' or '', delay in the beat 0..1]; a row shows from its time on; the panel grows with the rows
  function noteCard(x, y, w, tag, rows, si, u, keep = 0) {
    const B = C.B[si];
    if (keep > 0) { const cur = beatOf(si, u); rows = rows.filter((r) => r[0] > cur - keep && r[0] <= cur); }
    const start = (r) => B[r[0]] + (r[3] || 0) * ((B[r[0] + 1] ?? 1) - B[r[0]]);
    const shown = rows.filter((r) => u >= start(r));
    if (!shown.length) return '';
    const bi = beatOf(si, u);
    const now = shown.filter((r) => r[0] === bi).pop();
    const h = 44 + (rows.indexOf(shown[shown.length - 1]) + 1) * ROWH;
    let out = panelD(x, y, w, h) + label(x + 16, y + 28, tag, 22, 'start', true, 'fp-label fp-dim');
    rows.forEach((r, i) => {
      const o = clamp((u - start(r)) / 0.04, 0, 1);
      if (o <= 0) return;
      const yy = y + 28 + (i + 1) * ROWH;
      if (r === now) out += `<path class="fp-cur" d="M${x + 6} ${yy - 24}h${w - 12}v32h${-(w - 12)}z"/>`;
      out += `<g style="opacity:${f1(o)}">${r[2] === 'code' ? mono(x + 16, yy, r[1], 22) : label(x + 16, yy, r[1], 22, 'start', true, 'fp-label')}</g>`;
    });
    return out;
  }

  // ------------------------------------------------------------ the bench, one frame
  const ALL = ['ghose', 'haz', 'heat', 'bead', 'pores', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'rod', 'magT', 'tigT', 'flame', 'heatT', 'travel', 'section',
    'scrim', 'dial', 'mag', 'flow', 'docs', 'chart', 'cev', 'therm', 'clock', 'macro', 'card'];
  let shown = -1;
  // what a scene shows: the parts in `keys` are on, every other one of ALL off (reset when the scene changes)
  function scene(si, keys) {
    if (si === shown) return;
    shown = si;
    for (const k of ALL) { show(E[k], keys.includes(k)); E[k].style.opacity = ''; E[k].__o = undefined; }
    set(E.card, '');
  }
  // the weld laid so far, the torch at its end, the arc, the wire, the gas and the machine's displays.
  // o: torch 'mag' or 'tig' or none, arc on, gas amount 0..1, hose kink 0..1, wire feed m/min, the volts and amps shown
  function bench(RUNS, si, u, o = {}) {
    const { torch = 'mag', arcOn = true, gasAmount = 1, kink = 0, wfs = 10, volts = '24', amps = '220', hazFade = 1, hazOn = true } = o;
    const cm = camera(si, u);
    const clockS = u * C.dur[si];
    const { runs, tip } = weldAt(RUNS, si, u);
    set(E.bead, beadSvg(runs));
    set(E.haz, hazSvg(hazOn ? runs : []));
    op(E.haz, hazFade);
    set(E.pores, poresSvg(runs));
    show(E.section, runs.length > 0);
    const p = [tip, 0, PT + 1];
    if (torch === 'tig') {
      move(E.tigT, p);
      const dip = Math.max(0, Math.sin(clockS * 4.2));
      const rodTip = [tip - 7, 2, PT + 1.2 + 5 * (1 - dip)];
      set(E.rod, `<path class="fp-wire" style="stroke-width:2.2" d="${pth([at([tip - 64, 14, PT + 46]), at(rodTip)])}"/>`);
      set(E.pool, `<path class="fp-pool" d="${ellipseTop(tip - 1, 0, 6, 7, PT + 1.4)}"/>`);
      set(E.arc, arcSvg([tip, 0, PT + 2.2], 9, clockS));
    } else if (torch === 'mag') {
      move(E.magT, p);
      set(E.pool, arcOn ? `<path class="fp-pool" d="${ellipseTop(tip - 1.5, 0, 7.5, 9, PT + 2, 0.3)}"/>` : '');
      set(E.arc, arcOn ? arcSvg([tip, 0, PT + 3], 15, clockS) : '');
      const ct = ptOn(MAGF, 15, p);
      set(E.wire, `<path class="fp-wire" d="${pth([at(ct), at([tip, 0, PT + (arcOn ? 4 : 3)])])}"/>`);
      set(E.gasflow, arcOn ? gasSvg(p, clockS, gasAmount) : '');
      set(E.cable, cableSvg(ptOn(MAGF, C.MAG_TOP, p), C.SOCKET.map((v, i) => (i === 1 ? v + 8 : v)), 26));
    }
    set(E.ghose, cableSvg([C.REG[0] - 6, C.REG[1] + 4, C.REG[2] - 2], [M.x + 70, M.y + 6, C.MZ + 1], 34, kink));
    set(E.digits, digits(arcOn && torch ? volts : '0', arcOn && torch ? amps : '0'));
    set(E.spool, spoolSvg(torch === 'mag' && arcOn ? clockS * wfs * 0.35 : 0));
    return { cam: cm, tip, clockS, runs };
  }
