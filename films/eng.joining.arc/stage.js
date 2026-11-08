// The stage of the film "Van boog tot scheur / From arc to crack": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope, the lathe module as G) and a preamble from build.mjs that
// defines P (projection), C (world constants), CAM (one camera move per scene),
// W and H.
/* global G, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, translateAlong, span, beatStarts, warpU, introBeat, introCamera */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const el = (k) => svg.querySelector(`[data-k="${k}"]`);
  const E = {};
  ['world', 'digits', 'spool', 'ghose', 'section', 'haz', 'heat', 'bead', 'pores', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'rod', 'magT', 'tigT', 'flame', 'heatT', 'travel',
    'scrim', 'dial', 'needle', 'dialText', 'mag', 'magLead', 'magBase', 'magShort', 'magSpray', 'flow', 'flowScale', 'flowBall',
    'docs', 'docA', 'docB', 'docEss', 'docRange', 'docHeat', 'docCert', 'docCoord', 'chart', 'chartBody', 'chartCurve', 'chartT85', 'cev', 'therm', 'clock', 'macro', 'macroLead', 'macroBody', 'macroIso', 'macroMart', 'macroCrack'].forEach((k) => { E[k] = el(k); });
  const EN = document.documentElement.getAttribute('lang') === 'en';
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
  const RUNS = [
    { si: 0, x0: XE, x1: 50, w: 26, h: 3, a: 0.06, b: 0.96 },
    { si: 1, x0: 50, x1: 15, w: 20, h: 2, a: 0.04, b: 0.96 },
    { si: 2, x0: 15, x1: -40, w: 26, h: 3, a: 0, b: 1 },
    { si: 3, x0: -40, x1: -75, w: 26, h: 3, a: 0, b: 1 },
    { si: 4, x0: -75, x1: -100, w: 26, h: 3, a: 0, b: 0.78 },
  ];
  const PORE_X = -82; // where the gas had dropped below 10 L/min in scene 5
  // the end of the weld now, and the stretches laid so far
  function weldAt(si, u) {
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
    const r = runs.find((q) => q.si === 4);
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
    const table = `<path class="fp-bar" d="${M2([[-40, 0], [40, 0], [40, -6], [-40, -6]])}"/>`;
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
    set(E.dialText, hudText(dx, dy + 24, num(wfs, 0), 20) + hudText(dx, dy + 44, 'm/min', 14, 'middle', 'fp-small'));
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
    for (const v of [5, 10, 15, 20]) labels += hudText(fx + 26, flowY(v) + 6, String(v), 16, 'start', 'fp-small');
    return mark(t) + labels + `<path class="fp-mark" style="stroke-width:2.6" d="M${fx - 14} ${f1(flowY(10))}L${fx + 10} ${f1(flowY(10))}"/><path class="fp-mark" d="M${fx - 24} ${f1(flowY(10) - 6)}L${fx - 14} ${f1(flowY(10))}L${fx - 24} ${f1(flowY(10) + 6)}Z"/>` + hudText(fx + 12, fy0 - 10, 'L/min', 15, 'middle', 'fp-small');
  })());

  // documents (scene 6), in the page's language
  const T = EN
    ? { pwps: 'pWPS', wps: 'WPS', wpqr: 'WPQR', thick: 'thickness', heat: 'heat input' }
    : { pwps: 'pLMB', wps: 'LMB', wpqr: 'LMK', thick: 'dikte', heat: 'warmte-inbreng' };
  const card = (x, y, w, h) => `<rect class="fp-card" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`;
  const rules = (x, y, w, n, gap) => { let d = ''; for (let i = 0; i < n; i++) d += `M${x} ${y + i * gap}L${x + w * (i % 3 === 2 ? 0.6 : 1)} ${y + i * gap}`; return `<path class="fp-rule" d="${d}"/>`; };
  const check = (x, y, s = 1) => `<path class="fp-mark" style="stroke-width:3" d="M${f1(x - 7 * s)} ${f1(y)}L${f1(x - 2 * s)} ${f1(y + 6 * s)}L${f1(x + 8 * s)} ${f1(y - 7 * s)}"/>`;
  const cross = (x, y) => `<path class="fp-mark" style="stroke-width:3" d="M${x - 7} ${y - 7}L${x + 7} ${y + 7}M${x + 7} ${y - 7}L${x - 7} ${y + 7}"/>`;
  const BAR = { x0: 252, x1: 596 };
  const barX = (v, lo, hi) => BAR.x0 + ((v - lo) / (hi - lo)) * (BAR.x1 - BAR.x0);
  function docs(u) {
    const stamp = span(u, 0.16, 0.22);
    const title = stamp > 0.5 ? T.wps : T.pwps;
    set(E.docA, card(24, 26, 186, 234) + hudText(117, 62, title, 26) + rules(52, 96, 136, 6, 22)
      + (stamp > 0 ? `<g style="opacity:${stamp.toFixed(2)}"><circle class="fp-mark" style="stroke-width:2.4" cx="164" cy="228" r="28"/>${hudText(164, 233, T.wpqr, 14)}</g>` : ''));
    set(E.docEss, [96, 140, 184].map((y) => `<rect class="fp-fill" x="36" y="${y - 7}" width="8" height="14" rx="2"/>`).join(''));
    op(E.docEss, span(u, 0.18, 0.24));
    // thickness: 0–30 mm
    const t = C.WPS;
    const y1 = 118;
    const rangeA = `<rect class="fp-bar" x="${BAR.x0}" y="${y1 - 8}" width="${BAR.x1 - BAR.x0}" height="16" rx="8"/><rect class="fp-fill" x="${f1(barX(t.tMin, 0, 30))}" y="${y1 - 8}" width="${f1(barX(t.tMax, 0, 30) - barX(t.tMin, 0, 30))}" height="16" rx="8"/>`;
    const y2 = 224;
    const rangeB = `<rect class="fp-bar" x="${BAR.x0}" y="${y2 - 8}" width="${BAR.x1 - BAR.x0}" height="16" rx="8"/><rect class="fp-fill" x="${BAR.x0}" y="${y2 - 8}" width="${f1(barX(t.qMax, 0.6, 1.8) - BAR.x0)}" height="16" rx="8"/>`;
    const rIn = span(u, 0.2, 0.28);
    const oIn = span(u, 0.42, 0.48);
    const hIn = span(u, 0.58, 0.66);
    set(E.docRange, `<g style="opacity:${rIn.toFixed(2)}">${rangeA}${hudText(barX(t.tMin, 0, 30), y1 + 30, num(t.tMin), 18)}${hudText(barX(t.tMax, 0, 30), y1 + 30, num(t.tMax), 18)}</g>`
      + `<g style="opacity:${hIn.toFixed(2)}">${rangeB}${hudText(barX(t.qMax, 0.6, 1.8), y2 + 34, num(t.qMax, 1), 18)}</g>`);
    set(E.docB, card(224, 26, 392, 234));
    set(E.docHeat, hudText(BAR.x0, y1 - 44, T.thick + ' (mm)', 18, 'start', 'fp-small')
      + `<circle class="fp-drop" cx="${f1(barX(t.t, 0, 30))}" cy="${y1}" r="6"/>` + hudText(barX(t.t, 0, 30), y1 - 18, num(t.t), 18)
      + `<g style="opacity:${oIn.toFixed(2)}"><path class="fp-mark" style="stroke-width:2.4" d="M${f1(barX(t.order, 0, 30))} ${y1 - 14}L${f1(barX(t.order, 0, 30))} ${y1 + 14}"/>${hudText(barX(t.order, 0, 30) + 6, y1 - 18, num(t.order), 18, 'start')}${check(barX(t.order, 0, 30) + 44, y1 - 24, 0.8)}</g>`
      + `<g style="opacity:${hIn.toFixed(2)}">${hudText(BAR.x0, y2 - 42, T.heat + ' (kJ/mm)', 18, 'start', 'fp-small')}<circle class="fp-drop" cx="${f1(barX(t.q, 0.6, 1.8))}" cy="${y2}" r="6"/>${hudText(barX(t.q, 0.6, 1.8), y2 - 18, num(t.q, 1), 18)}`
      + `<path class="fp-mark" style="stroke-width:2.4" d="M${f1(barX(t.want, 0.6, 1.8))} ${y2 - 14}L${f1(barX(t.want, 0.6, 1.8))} ${y2 + 14}"/>${hudText(barX(t.want, 0.6, 1.8) + 6, y2 - 18, num(t.want, 1), 18, 'start')}${cross(barX(t.want, 0.6, 1.8) + 44, y2 - 24)}</g>`);
    const cIn = span(u, 0.72, 0.78);
    const seal = (() => { let d = ''; for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU; d += `M${f1(66 + Math.cos(a) * 18)} ${f1(330 + Math.sin(a) * 18)}L${f1(66 + Math.cos(a) * 24)} ${f1(330 + Math.sin(a) * 24)}`; } return `<circle class="fp-mark" style="stroke-width:2" cx="66" cy="330" r="16"/><path class="fp-mark" d="${d}"/>`; })();
    set(E.docCert, `<g style="opacity:${cIn.toFixed(2)}">${card(24, 278, 286, 104)}${seal}${hudText(104, 318, 'ISO 9606-1', 22, 'start')}${rules(106, 344, 180, 2, 18)}</g>`);
    const pIn = span(u, 0.8, 0.86);
    const person = `<circle class="fp-card" cx="372" cy="306" r="13"/><path class="fp-card" d="M348 378C348 346 356 328 372 328C388 328 396 346 396 378Z"/>`;
    const board = `<rect class="fp-card" x="410" y="300" width="56" height="72" rx="4"/><rect class="fp-bar" x="426" y="294" width="24" height="10" rx="3"/>${check(426, 326, 0.6)}${check(426, 352, 0.6)}<path class="fp-rule" d="M440 326L456 326M440 352L456 352"/>`;
    set(E.docCoord, `<g style="opacity:${pIn.toFixed(2)}">${card(330, 278, 286, 104)}${person}${board}${rules(486, 316, 110, 3, 20)}</g>`);
  }

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
    const lines = [800, 500].map((T) => `<path class="fp-iso" d="M${ox} ${f1(cY(T))}L${f1(ox + cw)} ${f1(cY(T))}"/>${hudText(ox - 6, cY(T) + 6, String(T), 16, 'end', 'fp-small')}`).join('');
    return axes + lines + hudText(ox - 6, oy - chh + 4, '°C', 15, 'end', 'fp-small') + hudText(ox + cw + 4, oy + 22, 's', 15, 'end', 'fp-small');
  })());
  function chartAt(tau) {
    const pts = [];
    for (let i = 0; i <= 60; i++) { const t = (i / 60) * tau; pts.push([cX(t), cY(Tof(t))]); }
    // tc8 and tc5 are where the curve crosses 800 and 500 °C
    const c8 = solveT(800);
    const c5 = solveT(500);
    const shownBracket = tau > c5;
    const br = shownBracket ? `<path class="fp-mark" style="stroke-width:2" d="M${f1(cX(c8))} ${f1(cY(800))}L${f1(cX(c8))} ${f1(oy - 14)}M${f1(cX(c5))} ${f1(cY(500))}L${f1(cX(c5))} ${f1(oy - 14)}M${f1(cX(c8))} ${f1(oy - 14)}L${f1(cX(c5))} ${f1(oy - 14)}"/>${hudText((cX(c8) + cX(c5)) / 2, oy - 22, 't8/5', 16)}` : '';
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

  // ------------------------------------------------------------ render
  let shown = -1;
  const ALL = ['ghose', 'haz', 'heat', 'bead', 'pores', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'rod', 'magT', 'tigT', 'flame', 'heatT', 'travel', 'section', 'scrim', 'dial', 'mag', 'flow', 'docs', 'chart', 'cev', 'therm', 'clock', 'macro'];
  const VIS = [
    ['ghose', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'section'],
    ['ghose', 'bead', 'pool', 'arc', 'rod', 'tigT', 'section'],
    ['ghose', 'haz', 'heat', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'travel', 'section'],
    ['ghose', 'haz', 'bead', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'dial', 'mag', 'section'],
    ['ghose', 'haz', 'bead', 'pores', 'pool', 'gasflow', 'cable', 'arc', 'wire', 'magT', 'flow', 'section'],
    ['ghose', 'haz', 'bead', 'pores', 'section', 'scrim', 'docs'],
    ['ghose', 'haz', 'bead', 'pores', 'section', 'macro', 'chart', 'cev'],
    ['ghose', 'haz', 'bead', 'pores', 'section', 'macro', 'flame', 'heatT', 'therm', 'clock'],
  ];

  function render(si, u) {
    if (si !== shown) {
      shown = si;
      for (const k of ALL) show(E[k], VIS[si].includes(k));
    }
    const cam = camera(si, u);
    const clockS = u * C.dur[si];
    const { runs, tip } = weldAt(si, u);
    const welding = [0, 1, 2, 3, 4].includes(si);
    let arcOn = welding;
    let gasAmount = 1;
    let wfs = si === 3 ? 4 + 2 * span(u, 0.08, 0.25) + 4 * span(u, 0.52, 0.58) : 10; // crosses into spray just after the spray-arc beat starts
    let kink = 0;

    if (si === 4) {
      const flow = lerp(C.GAS.normal, C.GAS.kinked, span(u, 0.06, 0.28));
      kink = span(u, 0.04, 0.2);
      gasAmount = flow / C.GAS.normal;
      if (u > 0.78) arcOn = false; // the sensor trips below 10 L/min (the fix)
      set(E.flowBall, `<circle class="fp-drop" cx="${fx}" cy="${f1(flowY(flow) - 8)}" r="8"/>`);
    }
    if (si === 0) arcOn = u > 0.05;

    // the weld so far, its HAZ and its pores
    set(E.bead, beadSvg(runs));
    set(E.haz, hazSvg(runs.filter((r) => r.si !== 1 || si > 2)));
    op(E.haz, si === 2 ? span(u, 0.7, 0.78) : 1);
    set(E.pores, poresSvg(runs));
    show(E.section, runs.length > 0);

    // the torch at the end of the weld
    const o = [tip, 0, PT + 1];
    if (welding) {
      if (si === 1) {
        move(E.tigT, o);
        const dip = Math.max(0, Math.sin(clockS * 4.2));
        const rodTip = [tip - 7, 2, PT + 1.2 + 5 * (1 - dip)];
        set(E.rod, `<path class="fp-wire" style="stroke-width:2.2" d="${pth([at([tip - 64, 14, PT + 46]), at(rodTip)])}"/>`);
        set(E.pool, `<path class="fp-pool" d="${ellipseTop(tip - 1, 0, 6, 7, PT + 1.4)}"/>`);
        set(E.arc, arcSvg([tip, 0, PT + 2.2], 9, clockS));
      } else {
        move(E.magT, o);
        set(E.pool, arcOn ? `<path class="fp-pool" d="${ellipseTop(tip - 1.5, 0, 7.5, 9, PT + 2, 0.3)}"/>` : '');
        set(E.arc, arcOn ? arcSvg([tip, 0, PT + 3], 15, clockS) : '');
        const ct = ptOn(MAGF, 15, o);
        set(E.wire, `<path class="fp-wire" d="${pth([at(ct), at([tip, 0, PT + (arcOn ? 4 : 3)])])}"/>`);
        set(E.gasflow, arcOn ? gasSvg(o, clockS, gasAmount) : '');
        set(E.cable, cableSvg(ptOn(MAGF, C.MAG_TOP, o), C.SOCKET.map((v, i) => (i === 1 ? v + 8 : v)), 26));
      }
    }
    set(E.ghose, cableSvg([C.REG[0] - 6, C.REG[1] + 4, C.REG[2] - 2], [M.x + 70, M.y + 6, C.MZ + 1], 34, kink));

    // the machine shows its settings; the spool turns with the wire feed
    // the display: 24 V / 220 A in the lesson's example; in scene 4 the current follows the wire (about 70 + 23 A per m/min for Ø1,2)
    const vv = si === 3 ? [wfs < 7.5 ? '20' : '29', String(Math.round(70 + 23 * wfs))] : si === 4 ? ['29', '300'] : ['24', '220'];
    set(E.digits, digits(arcOn ? vv[0] : '0', arcOn ? vv[1] : '0'));
    SPOOL_TURNS[si] = welding && arcOn ? clockS * wfs * 0.35 : 0;
    set(E.spool, spoolSvg(SPOOL_TURNS[si]));

    if (si === 2) {
      // heat around the pool, and the travel speed arrow
      const hp = span(u, 0.3, 0.4);
      set(E.heat, hp > 0 ? `<g style="opacity:${hp.toFixed(2)}"><path class="fp-iso" d="${ellipseTop(tip + 4, 0, 14, 11, PT + 0.2, 0.8)}"/><path class="fp-iso" d="${ellipseTop(tip + 7, 0, 22, 17, PT + 0.2, 1)}"/></g>` : '');
      const a0 = at([tip - 8, 34, PT]);
      const a1 = at([tip - 38, 34, PT]);
      const lp = at([tip - 23, 46, PT]);
      set(E.travel, mark(pth([a0, a1])) + mark(arrowHead(a0, a1, 9)) + label(lp[0], lp[1], 'v', 22));
      op(E.travel, 1 - span(u, 0.36, 0.42));
    }
    if (si === 3) {
      dialSvg(wfs);
      const spray = wfs >= 7.5;
      set(E.magBase, magBase(clockS));
      set(E.magShort, spray ? '' : magShort(clockS));
      set(E.magSpray, spray ? magSpray(clockS) : '');
      const [tx, ty] = toHud([tip, 0, PT + 4], cam);
      const ang = Math.atan2(ty - my, tx - mx);
      set(E.magLead, `<path class="fp-mark" d="M${f1(tx)} ${f1(ty)}L${f1(mx + Math.cos(ang) * MR)} ${f1(my + Math.sin(ang) * MR)}"/>`);
    }
    if (si === 5) {
      op(E.scrim, span(u, 0, 0.05));
      op(E.docs, span(u, 0.02, 0.08));
      docs(u);
    }
    if (si === 6) {
      // heat arrives and leaves the section; the chart traces the cooling
      const h = span(u, 0.02, 0.14);
      const r8 = 13 * h * (1 - span(u, 0.16, 0.4));
      const r5 = 20 * h * (1 - span(u, 0.22, 0.52));
      macroLead(cam);
      set(E.macroIso, isoSvg(r8, 'fp-hotf') + isoSvg(r8) + isoSvg(r5)
        + (r8 > 4 ? hudText(mX(r8 * 0.72) + 4, mZ(PT + 3 - r8 * 0.68), '800', 15, 'start', 'fp-small') : '')
        + (r5 > 4 ? hudText(mX(r5 * 0.72) + 4, mZ(PT + 3 - r5 * 0.68), '500', 15, 'start', 'fp-small') : ''));
      set(E.macroCrack, '');
      op(E.macro, span(u, 0, 0.06));
      const tau = TMAX * span(u, 0.02, 0.52);
      const { curve, br } = chartAt(Math.max(0.05, tau));
      set(E.chartT85, br);
      set(E.chartCurve, curve);
      op(E.macroMart, span(u, 0.48, 0.54));
      set(E.cev, `<rect class="fp-card" x="420" y="296" width="196" height="88" rx="10"/>${hudText(518, 330, 'S355 · ' + num(40) + ' mm', 18, 'middle', 'fp-small')}${hudText(518, 364, 'CEV ' + num(C.CEV, 2), 26)}`);
      op(E.cev, span(u, 0.68, 0.74));
    }
    if (si === 7) {
      // preheat, the interpass check, the wait; a crack in the HAZ; then the stainless pipe
      const sweep = span(u, 0.02, 0.34);
      const hx = lerp(XE - 30, XE - 8, sweep) + Math.sin(clockS * 3) * 3;
      const ho = [hx, 20, PT + 6];
      move(E.heatT, ho);
      op(E.heatT, 1 - span(u, 0.36, 0.42));
      const fl = [];
      for (const [len, wid] of [[18, 4.6], [10, 2.4]]) {
        const pts = [];
        for (let i = 0; i <= 14; i++) {
          const t = i / 14;
          const s = 6 - len * Math.sin(t * Math.PI / 2) * (1 + 0.08 * Math.sin(clockS * 23 + i));
          const r = wid * Math.sin(t * Math.PI) * (1 - t * 0.5);
          pts.push([s, r]);
        }
        const side = (sgn) => pts.map(([s, r]) => at(add(G.pointOf(HEATF, s, 0, 0), add(G.mul3(HEATF.u, sgn * r), ho))));
        fl.push(`<path class="fp-flame" d="${pth([...side(1), ...side(-1).reverse()], true)}"/>`);
      }
      set(E.flame, u < 0.42 ? `<g style="opacity:${(1 - span(u, 0.36, 0.42)).toFixed(2)}">${fl.join('')}</g>` : '');
      // dial thermometer: the reading climbs into its band
      const tIn = span(u, 0.1, 0.16) * (1 - span(u, 0.62, 0.66));
      const reading = span(u, 0.08, 0.3);
      const tcx = 84;
      const tcy = 300;
      const band = (() => { const a0 = -2.35 + 0.45 * 4.7; const a1 = -2.35 + 0.7 * 4.7; const pts = []; for (let i = 0; i <= 12; i++) { const a = a0 + ((a1 - a0) * i) / 12; pts.push([tcx + Math.sin(a) * 40, tcy - Math.cos(a) * 40]); } return pth(pts); })();
      const ang = -2.35 + (0.12 + 0.46 * reading) * 4.7;
      set(E.therm, `<g style="opacity:${tIn.toFixed(2)}"><circle class="fp-hud-bg" cx="${tcx}" cy="${tcy}" r="56"/><circle class="fp-mark" cx="${tcx}" cy="${tcy}" r="50"/><path class="fp-mark" d="${ticks(tcx, tcy, 44, 49, 11)}"/><path class="fp-mark fp-needle" style="stroke-width:7;opacity:.6" d="${band}"/><path class="fp-mark" style="stroke-width:2.4" d="M${tcx} ${tcy}L${f1(tcx + Math.sin(ang) * 38)} ${f1(tcy - Math.cos(ang) * 38)}"/><circle class="fp-ink" cx="${tcx}" cy="${tcy}" r="3.5"/>${hudText(tcx, tcy + 30, '°C', 16, 'middle', 'fp-small')}</g>`);
      // the clock runs to 48 h; a crack opens at the weld toe once hours have passed
      const cIn = span(u, 0.36, 0.4) * (1 - span(u, 0.64, 0.68));
      const hrs = 48 * span(u, 0.38, 0.62);
      const ccx = 220;
      const ccy = 300;
      const hand = (hrs / 12) * TAU;
      set(E.clock, `<g style="opacity:${cIn.toFixed(2)}"><circle class="fp-hud-bg" cx="${ccx}" cy="${ccy}" r="58"/><circle class="fp-mark" cx="${ccx}" cy="${ccy}" r="44"/><path class="fp-mark" d="${ticks(ccx, ccy, 37, 42, 12, 0, TAU * 11 / 12)}"/><path class="fp-mark" style="stroke-width:2.4" d="M${ccx} ${ccy}L${f1(ccx + Math.sin(hand) * 32)} ${f1(ccy - Math.cos(hand) * 32)}"/><circle class="fp-ink" cx="${ccx}" cy="${ccy}" r="3"/>${hudText(ccx, ccy + 82, num(hrs, 0) + ' h', 18)}</g>`);
      const grow = span(u, 0.5, 0.6);
      const cr = [];
      if (grow > 0) {
        const n = 9;
        for (let i = 0; i <= Math.round(n * grow); i++) {
          const z = PT - 0.5 - i * 1.5;
          cr.push([FT + 1.2 - (PT - z) * 0.55 + (i % 2 ? 0.5 : -0.4), z]);
        }
      }
      set(E.macroCrack, cr.length > 1 ? `<path class="fp-crack" style="stroke-width:2.2" d="${M2(cr, false)}"/>` : '');
      set(E.macroIso, '');
      op(E.macroMart, 1);
      macroLead(cam);
      op(E.macro, 1 - span(u, 0.62, 0.68));
    }
  }
  function ticks(cx, cy, r0, r1, n, from = -2.35, to = 2.35) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = from + ((to - from) * i) / (n - 1);
      d += `M${f1(cx + Math.sin(a) * r0)} ${f1(cy - Math.cos(a) * r0)}L${f1(cx + Math.sin(a) * r1)} ${f1(cy - Math.cos(a) * r1)}`;
    }
    return d;
  }

  // ------------------------------------------------------------ v14b: the intro, and the audio warp
  // Scene 1 of the film is a "how it works" tour of this bench; the scenes
  // after it are the stage's own scenes, one index on. In a video render each
  // scene's progress is warped so the moves land on the spoken lines.
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };
  function intro(u) {
    const d = designed(0);
    const { k } = introBeat(u, d);
    render(0, k >= 2 ? 0.055 : 0); // the bench as scene 2 opens; the arc lit from the third beat
    introCamera(E.world, C.INTRO, d, u, W, H);
  }
  return {
    render(si, u) {
      if (si === 0) intro(warpU(0, u, designed(0)));
      else render(si - 1, warpU(si, u, designed(si)));
    },
  };
})();
