// The stage of the film "De trekproef / The tensile test": a pure function of
// (scene, u). Inlined into the page after the anatomy kit (iso-kit functions in
// scope) and a preamble from build.mjs that defines P (projection), C (world
// constants and the model's data), CAM (one camera move per scene), W and H.
// Moves are placed per caption beat (beatStarts), so the video's narration
// timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, span, beatStarts, cylinder, solidSvg */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'mt-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mt-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mt-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mt-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const cross = (x, y, s = 8) => `<path class="mt-accl" d="M${f1(x - s)} ${f1(y - s)}L${f1(x + s)} ${f1(y + s)}M${f1(x - s)} ${f1(y + s)}L${f1(x + s)} ${f1(y - s)}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const exTag = (x = 620, y = 40, extra = '') => txt(x, y, EX + extra, 22, 'end', 'mt-mute');
  const PANEL = () => rect(204, 12, 428, 376);

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

  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the model's curve
  const K = C.CURVE;
  const SLOPE = K.sY / K.eY;
  const sigma = (e) => (e <= K.eY ? SLOPE * e
    : e <= K.eS ? K.sY + (K.sS - K.sY) * (e - K.eY) / (K.eS - K.eY)
      : e <= K.eU ? K.sU - (K.sU - K.sS) * ((K.eU - e) / (K.eU - K.eS)) ** 2
        : K.sU - (K.sU - K.sF) * ((e - K.eU) / (K.eF - K.eU)) ** 2);
  // grey cast iron (illustrative): a softer start, a curve that bends early, a break at 0,025
  const IRON_F = 0.025;
  const sigmaI = (e) => 300 * (1 - Math.exp(-e / 0.03));

  // ------------------------------------------------------------ the bar in the machine
  // screen vectors of the world axes: a horizontal circle of radius r is an
  // ellipse r·SXR wide and r·SYR high on screen
  const O = at([0, 0, 0]);
  const VX = at([1, 0, 0]).map((v, i) => v - O[i]);
  const VY = at([0, 1, 0]).map((v, i) => v - O[i]);
  const VZ = at([0, 0, 1]).map((v, i) => v - O[i]);
  const SXR = Math.hypot(VX[0], VY[0]);
  const SYR = Math.hypot(VX[1], VY[1]);
  const SP = C.SPEC;
  const GL = SP.g1 - SP.g0;
  // the radius at height z for a bar state: plastic strain e (thins by volume), neck depth n
  function radiusOf(z, st) {
    const dL = GL * st.e;
    const rg = SP.rGauge / Math.sqrt(1 + st.e);
    const zc = SP.g0 + (GL + dL) * 0.56;
    const neck = (zz) => 1 - 0.42 * st.n * Math.exp(-(((zz - zc) / 1.9) ** 2));
    const g1 = SP.g1 + dL;
    const f1z = SP.f1 + dL;
    if (z <= SP.f0) return SP.rHead;
    if (z < SP.g0) { const t = (z - SP.f0) / (SP.g0 - SP.f0); return lerp(SP.rHead, rg * neck(SP.g0), (1 - Math.cos(Math.PI * t)) / 2); }
    if (z <= g1) return rg * neck(z);
    if (z < f1z) { const t = (z - g1) / (f1z - g1); return lerp(rg * neck(g1), SP.rHead, (1 - Math.cos(Math.PI * t)) / 2); }
    return SP.rHead;
  }
  const BANDS = [-1, -0.55, -0.05, 0.5, 1];
  const SHADES = [1, 3, 2, 0];
  // one piece of the bar from zA to zB (zs: the profile's own heights, shifted by
  // dz on screen); the bottom end shows its front arc, a top cap is optional
  function piece(zA, zB, st, dz, top) {
    const zs = [];
    for (let z = zA; z < zB; z += 0.3) zs.push(z);
    zs.push(zB);
    const C0 = (z) => [O[0] + VZ[0] * (z + dz), O[1] + VZ[1] * (z + dz)];
    const rs = zs.map((z) => radiusOf(z, st));
    const side = (f) => zs.map((z, i) => { const c = C0(z); return [c[0] + f * rs[i] * SXR, c[1]]; });
    const arc = (f0, f1v) => { const c = C0(zA); const r = rs[0]; const out = []; for (let j = 0; j <= 8; j++) { const f = lerp(f0, f1v, j / 8); out.push([c[0] + f * r * SXR, c[1] + Math.sqrt(Math.max(0, 1 - f * f)) * r * SYR]); } return out; };
    const band = (f0, f1v) => fmt([...side(f0).reverse(), ...arc(f0, f1v), ...side(f1v)]) + 'Z';
    let out = `<path class="iso-fill" d="${band(-1, 1)}"/>`;
    for (let i = 0; i < 4; i++) out += `<path class="iso-shade" data-shade="${SHADES[i]}" d="${band(BANDS[i], BANDS[i + 1])}"/>`;
    out += `<path class="iso-line iso-edge" data-tone="hi" d="${fmt([...side(-1).reverse(), ...arc(-1, 1), ...side(1)])}"/>`;
    if (top) {
      const c = C0(zB);
      const r = rs[rs.length - 1];
      const ell = (rr) => { const pts = []; for (let j = 0; j < 24; j++) { const a = (j / 24) * Math.PI * 2; pts.push([c[0] + Math.cos(a) * rr * SXR, c[1] + Math.sin(a) * rr * SYR]); } return fmt(pts) + 'Z'; };
      out += `<path class="mt-cap" d="${ell(r)}"/>`;
      if (top === 'cup') out += `<path class="mt-cup" d="${ell(r * 0.55)}"/>`;
    }
    return out;
  }
  // st: { e, n, broken, gap, iron }
  function barSvg(st) {
    const dL = GL * st.e;
    if (!st.broken) return piece(SP.z0, SP.z1 + dL, st, 0, null);
    const zc = SP.g0 + (GL + dL) * 0.56;
    return piece(SP.z0, zc, st, 0, st.iron ? 'flat' : 'cup') + piece(zc, SP.z1 + dL, st, st.gap, null);
  }
  function columnsAbove(d) {
    const z0 = C.COLLAR[1] + d;
    return [-C.COLX, C.COLX].map((x) => solidSvg(cylinder(x, 0, C.COLR, z0, C.TOP_Z - z0, P, 32), { tone: 'mid', crease: 'none' })).join('');
  }
  const shiftOf = (d) => `translate(${f2(VZ[0] * d)} ${f2(VZ[1] * d)})`;
  function machine(st) {
    const key = [st.e, st.n, st.broken, st.gap, st.iron].map((v) => (typeof v === 'number' ? v.toFixed(4) : String(v))).join();
    if (E.spec.__key !== key) { E.spec.innerHTML = barSvg(st); E.spec.__key = key; }
    const d = GL * st.e + (st.broken ? st.gap : 0);
    const t = shiftOf(d);
    if (E.xh.__t !== t) { E.xh.setAttribute('transform', t); E.xh.__t = t; set(E.colU, columnsAbove(d)); }
    // the upper knife edge rides on its gauge mark 
    const tk = shiftOf(GL * st.e * ((C.EXT.zHi - SP.g0) / GL));
    if (E.extUp.__t !== tk) { E.extUp.setAttribute('transform', tk); E.extUp.__t = tk; }
  }
  // the bar's state from a point (e, s) on the card: the permanent stretch is the plastic strain
  const barAt = (e, s, extra = {}) => ({ e: Math.max(0, e - s / SLOPE) + s / 210000, n: 0, broken: false, gap: 0, iron: false, ...extra });
  const neckOf = (e) => clamp((e - K.eU) / (K.eF - K.eU), 0, 1);

  // ------------------------------------------------------------ the card: stress against strain
  const OX = 270;
  const OY = 292;
  const XR = 612;
  const YT = 58;
  const ex = (e) => OX + (XR - OX) * e / 0.3;
  const sy = (s) => OY - (OY - YT) * s / 400;
  function cvBase() {
    let out = PANEL() + exTag(620, 40, tr(' · niet op schaal', ' · not to scale'));
    out += line(OX, YT - 6, OX, OY) + line(OX, OY, XR, OY);
    out += txt(OX - 10, OY + 8, '0', 22, 'end', 'mt-mute');
    out += txt(OX + 10, 76, tr('spanning', 'stress'), 22, 'start', 'mt-mute');
    out += txt(XR, OY + 28, tr('rek →', 'strain →'), 22, 'end', 'mt-mute');
    out += txt(OX - 10, YT + 6, 'MPa', 22, 'end', 'mt-mute');
    return out;
  }
  const curvePts = (e0, e1, f = sigma) => { const out = []; const n = Math.max(2, Math.ceil((e1 - e0) / 0.002)); for (let i = 0; i <= n; i++) { const e = lerp(e0, e1, i / n); out.push([ex(e), sy(f(e))]); } return out; };
  // em: furthest strain reached; unload: [eFrom, eTo] of the unload line drawn so far; cur: the current point
  function steelSvg({ em, unload, cur, broke, note, label }) {
    let out = '';
    if (em > 0) out += `<path class="mt-line" d="${fmt(curvePts(0, em))}"/>`;
    if (unload) out += `<path class="mt-line" d="${fmt([[ex(unload[0]), sy(sigma(unload[0]))], [ex(unload[1]), sy(sigma(unload[0]) - SLOPE * (unload[0] - unload[1]))]])}"/>`;
    if (broke) out += cross(ex(K.eF), sy(K.sF)) + txt(ex(K.eF), sy(K.sF) + 34, tr('breuk', 'fracture'), 22, 'middle', 'mt-txt');
    else if (cur) out += dot(ex(cur[0]), sy(cur[1]), 5.5);
    if (note > 0.01) out += op(note, txt(ex(0.022) + 4, sy(120), tr('elastisch', 'elastic'), 22, 'start', 'mt-on'));
    if (label > 0.01) out += op(label, txt(ex(0.16), sy(sigma(0.16)) - 16, tr('staal', 'steel'), 22, 'middle', 'mt-txt'));
    return out;
  }
  function ironSvg(prog, a) {
    if (a <= 0.01) return '';
    const e1 = IRON_F * prog;
    let out = e1 > 0 ? `<path class="mt-line" d="${fmt(curvePts(0, e1, sigmaI))}"/>` : '';
    if (prog >= 0.999) out += cross(ex(IRON_F), sy(sigmaI(IRON_F)), 7) + txt(ex(IRON_F) + 16, sy(sigmaI(IRON_F)) + 8, tr('gietijzer', 'cast iron'), 22, 'start', 'mt-txt');
    return op(a, out);
  }
  function yieldSvg(a, tick) {
    if (a <= 0.01) return '';
    const x = ex(K.eY);
    const y = sy(K.sY);
    let out = `<path class="mt-lim" d="M${OX} ${f1(y)}H${f1(x)}"/>` + dot(x, y, 6.5) + txt(ex(C.E_UN) + 8, y + 30, tr('vloeigrens', 'yield'), 22, 'start', 'mt-txt');
    if (tick) out += txt(OX - 10, y + 8, String(C.S235), 22, 'end', 'mt-big');
    return op(a, out);
  }
  function utsSvg(a) {
    if (a <= 0.01) return '';
    const x = ex(K.eU);
    const y = sy(K.sU);
    return op(a, dot(x, y, 6.5) + txt(x, y - 16, tr('treksterkte', 'tensile strength'), 22, 'middle', 'mt-txt'));
  }
  function tilesSvg(a, plate) {
    let out = '';
    if (a > 0.01) {
      const tile = (x, name, v) => rect(x, 330, 196, 46, 'mt-tile', 6) + txt(x + 16, 361, name, 22, 'start', 'mt-big') + txt(x + 180, 361, `≥ ${v}`, 22, 'end', 'mt-txt');
      out += op(a, tile(216, 'S235', C.S235) + tile(424, 'S355', C.S355));
    }
    if (plate > 0.01) out += op(plate, txt(XR, OY - 18, tr('plaat ≤ 16 mm', 'plate ≤ 16 mm'), 22, 'end', 'mt-on'));
    return out;
  }

  // ------------------------------------------------------------ the card: a bolt of class 8.8
  function boltSvg(rowA, rowB, drawer) {
    const cx = 292;
    const cy = 164;
    const hex = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i / 6) * Math.PI * 2; hex.push([cx + 70 * Math.cos(a), cy + 70 * Math.sin(a)]); }
    let out = PANEL() + exTag();
    out += `<path class="mt-solid" d="${fmt(hex)}Z"/><circle class="mt-hatch" cx="${cx}" cy="${cy}" r="58"/>`;
    out += txt(cx, cy + 14, '8.8', 40, 'middle', 'mt-big') + `<circle class="mt-dot" cx="${cx}" cy="${cy + 34}" r="3"/>`;
    out += txt(cx, 274, 'ISO 898-1', 22, 'middle', 'mt-mute');
    const BW = 224;
    const X0 = 392;
    if (rowA > 0.01) {
      out += op(rowA, txt(X0, 92, tr('treksterkte', 'tensile strength'), 22, 'start', 'mt-txt')
        + `<rect class="fp-meter" x="${X0}" y="104" width="${f1(BW * rowA)}" height="22" rx="3"/>`
        + txt(X0, 156, `8 × 100 = ${C.B88.rm} MPa`, 22, 'start', 'mt-big'));
    }
    if (rowB > 0.01) {
      out += op(rowB, txt(X0, 202, tr('vloeigrens', 'yield'), 22, 'start', 'mt-txt')
        + `<rect class="fp-meter" x="${X0}" y="214" width="${f1(BW)}" height="22" rx="3" style="opacity:.35"/>`
        + `<rect class="fp-meter" data-top="" x="${X0}" y="214" width="${f1(BW * 0.8 * rowB)}" height="22" rx="3"/>`
        + txt(X0, 266, `8 × 10 = ${C.B88.pct}%`, 22, 'start', 'mt-big')
        + txt(X0, 296, `→ ${C.B88.re} MPa`, 22, 'start', 'mt-on'));
    }
    if (drawer > 0.01) out += op(drawer, rect(222, 318, 392, 52, 'mt-accf', 6) + txt(418, 352, tr('uit de la: welke klasse?', 'from the drawer: which class?'), 22, 'middle', 'mt-on'));
    return out;
  }

  // ------------------------------------------------------------ the card: the pendulum impact test
  const PV = [418, 116];
  const ARM = 150;
  function charpySvg(theta, broken, mark, req) {
    let out = PANEL() + exTag();
    // frame: a base slab, a column and the pivot bearing
    out += rect(300, 340, 236, 18, 'mt-tile', 3) + rect(411, PV[1], 14, 340 - PV[1], 'mt-tile', 2);
    const sx = PV[0];
    const syy = PV[1] + ARM + 4;
    // the scale arc and the drag pointer that stays at the highest swing
    const arcR = 40;
    let ticks = '';
    for (let a = -150; a <= 150; a += 15) { const r0 = a % 45 === 0 ? arcR - 9 : arcR - 5; const q = (a * Math.PI) / 180; ticks += `M${f1(PV[0] + r0 * Math.sin(q))} ${f1(PV[1] + r0 * Math.cos(q))}L${f1(PV[0] + arcR * Math.sin(q))} ${f1(PV[1] + arcR * Math.cos(q))}`; }
    out += `<path class="mt-axis" d="${ticks}"/>`;
    if (mark !== null) { const q = (mark * Math.PI) / 180; out += `<path class="mt-accl" d="M${PV[0]} ${PV[1]}L${f1(PV[0] + (arcR + 6) * Math.sin(q))} ${f1(PV[1] + (arcR + 6) * Math.cos(q))}"/>`; }
    // the notched bar on its anvil, seen end on: the notch faces away from the hammer
    out += rect(sx - 26, syy + 12, 52, 10, 'mt-tile', 2);
    if (!broken) out += `<path class="mt-solid" d="M${sx - 8} ${syy - 8}H${sx + 8}V${syy - 2}L${sx + 3} ${syy}L${sx + 8} ${syy + 2}V${syy + 12}H${sx - 8}Z"/>`;
    else out += `<path class="mt-solid" d="M${sx + 16} ${syy - 6}l14 -4l3 12l-14 4Z"/><path class="mt-solid" d="M${sx + 30} ${syy + 4}l13 4l-3 9l-13 -4Z"/>`;
    // the hammer on its arm
    const q = (theta * Math.PI) / 180;
    const hx = PV[0] + ARM * Math.sin(q);
    const hy = PV[1] + ARM * Math.cos(q);
    out += `<path class="mt-line" d="M${PV[0]} ${PV[1]}L${f1(hx)} ${f1(hy)}"/>`;
    const head = [[-22, -18], [22, -18], [22, 18], [-22, 18]].map(([u, v]) => [hx + u * Math.cos(q) + v * Math.sin(q), hy - u * Math.sin(q) + v * Math.cos(q)]);
    out += `<path class="mt-solid" d="${fmt(head)}Z"/>` + dot(PV[0], PV[1], 6);
    if (req > 0.01) out += op(req, txt(224, 296, `≥ ${C.KV} J`, 30, 'start', 'mt-on') + txt(224, 328, tr(`bij −${-C.KV_T} °C`, `at −${-C.KV_T} °C`), 22, 'start', 'mt-txt'));
    return out;
  }
  // the start and end heights: what the bar absorbed is the height the hammer lost
  function heights(t0, t1) {
    const h = (t) => PV[1] + ARM * Math.cos((t * Math.PI) / 180);
    return `<path class="mt-lim" d="M222 ${f1(h(t0))}H440"/><path class="mt-lim" d="M222 ${f1(h(t1))}H576"/>`
      + `<path class="mt-accl" d="M236 ${f1(h(t0))}V${f1(h(t1))}"/>` + txt(246, (h(t0) + h(t1)) / 2 + 8, tr('energie', 'energy'), 22, 'start', 'mt-on');
  }

  // ------------------------------------------------------------ the card: the console and its safety factor
  const MX = 480;
  const MY0 = 300;
  const my = (s) => MY0 - 236 * s / 400;
  function consoleSvg(droop, thick) {
    let out = PANEL() + exTag();
    // the wall with its hatching, the arm (sagging past yield), the strut and the load
    out += rect(222, 70, 16, 240, 'mt-tile', 2);
    let hatch = '';
    for (let y = 80; y < 304; y += 16) hatch += `M222 ${y + 10}L238 ${y}`;
    out += `<path class="mt-hatch" d="${hatch}"/>`;
    const yA = (x) => 140 + droop * ((x - 238) / 140) ** 2;
    const top = [];
    const bot = [];
    for (let x = 238; x <= 378; x += 10) { top.push([x, yA(x)]); bot.push([x, yA(x) + thick]); }
    out += `<path class="mt-solid" d="${fmt([...top, ...bot.reverse()])}Z"/>`;
    out += `<path class="mt-solid" d="M238 238L248 238L${f1(352)} ${f1(yA(352) + thick)}L${f1(338)} ${f1(yA(338) + thick)}Z"/>`;
    const lx = 336;
    const ly = yA(356);
    out += `<path class="mt-solid" d="M${lx} ${f1(ly - 40)}H${lx + 40}V${f1(ly)}H${lx}Z"/>`;
    out += `<path class="mt-accl" d="M${lx + 20} ${f1(ly - 92)}V${f1(ly - 50)}M${lx + 12} ${f1(ly - 60)}L${lx + 20} ${f1(ly - 50)}L${lx + 28} ${f1(ly - 60)}"/>` + txt(lx + 34, ly - 74, 'F', 24, 'start', 'mt-on');
    // the stress scale
    out += line(MX, my(400), MX, MY0) + txt(MX - 8, MY0 + 8, '0', 22, 'end', 'mt-mute') + txt(MX - 8, my(400) + 6, 'MPa', 22, 'end', 'mt-mute');
    return out;
  }
  function sfSvg(work, s355, ratio) {
    let out = '';
    const lim = (s, name, a) => op(a, `<path class="mt-lim" d="M${MX} ${f1(my(s))}H612"/>` + txt(612, my(s) - 8, `${name} ${s}`, 22, 'end', 'mt-txt'));
    out += lim(C.S235, 'S235', 1) + lim(C.S355, 'S355', s355);
    const over = work > C.S235;
    out += `<rect class="fp-meter"${over ? ' data-top=""' : ''} x="${MX + 18}" y="${f1(my(work))}" width="40" height="${f1(MY0 - my(work))}" rx="3"/>`;
    out += txt(MX + 66, my(work) + 24, String(Math.round(work)), 22, 'start', 'mt-big');
    if (ratio) out += txt(612, 364, ratio, 26, 'end', 'mt-on');
    return out;
  }
  function chipsSvg(a) {
    if (a <= 0.01) return '';
    const chip = (x, n, w) => rect(x, 326, 128, 56, 'mt-tile', 6) + txt(x + 64, 350, n, 22, 'middle', 'mt-big') + txt(x + 64, 374, w, 22, 'middle', 'mt-txt');
    return op(a, rect(212, 320, 412, 64, 'mt-panel', 6) + chip(216, dec(C.SF_STATIC, 1), tr('rustig', 'steady')) + chip(352, `≥ ${C.SF_UNSURE}`, tr('onzeker', 'uncertain')) + chip(488, `${C.SF_LIFT[0]}–${C.SF_LIFT[1]}`, tr('hijsen', 'lifting')));
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['curve', 'bolt', 'charpy', 'cons'];
  set(E.cvBase, cvBase());
  const IRON_BAR = (prog) => ({ e: 0.004 * prog, n: 0, broken: prog >= 0.999, gap: 0.8, iron: true });
  const STEEL_BROKEN = { e: K.eF - K.sF / SLOPE, n: 1, broken: true, gap: 1.6, iron: false };
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const vis = {};
    let bar = barAt(0, 0);
    let steel = { em: 0, unload: null, cur: null, broke: false, note: 0, label: 0 };
    let yieldA = 0;
    let tick = false;
    let utsA = 0;
    let tiles = 0;
    let plateA = 0;
    let iron = [0, 0];

    if (si === 0) {
      vis.curve = b >= 1 ? (b === 1 ? span(p, 0.35, 0.6) : 1) : 0;
      let e = 0;
      let s = 0;
      if (b === 1) e = 0.008 * span(p, 0.5, 1);
      else if (b === 2) e = lerp(0.008, 0.016, span(p, 0.1, 0.9));
      else if (b === 3) e = p < 0.4 ? lerp(0.016, 0.019, span(p, 0, 0.35)) : p < 0.72 ? lerp(0.019, 0, span(p, 0.42, 0.68)) : lerp(0, 0.019, span(p, 0.76, 0.98));
      s = sigma(e);
      steel = { em: b === 3 ? 0.019 : e, cur: [e, s], note: b === 3 ? span(p, 0.1, 0.3) : 0 };
      bar = barAt(e, s);
    } else if (si === 1) {
      vis.curve = 1;
      let e = 0.019;
      let unload = null;
      let cur;
      if (b === 0) { e = lerp(0.019, C.E_UN, span(p, 0.05, 0.9)); cur = [e, sigma(e)]; } else {
        e = C.E_UN;
        if (b === 1) {
          const down = span(p, 0.08, 0.48);
          const up = span(p, 0.58, 0.95);
          const eu = lerp(C.E_UN, C.SET, down - up);
          unload = [C.E_UN, lerp(C.E_UN, C.SET, Math.max(down, up > 0 ? 1 : 0))];
          cur = [eu, sigma(C.E_UN) - SLOPE * (C.E_UN - eu)];
        } else { unload = [C.E_UN, C.SET]; cur = [C.E_UN, sigma(C.E_UN)]; }
      }
      steel = { em: e, unload, cur };
      bar = barAt(cur[0], cur[1]);
      yieldA = span(u, 0.04, 0.16);
      tick = b >= 2;
      tiles = b >= 2 ? (b === 2 ? span(p, 0.05, 0.3) : 1) : 0;
      plateA = b === 3 ? span(p, 0.1, 0.35) : 0;
    } else if (si === 2) {
      vis.curve = 1;
      let e;
      let broke = false;
      if (b === 0) e = lerp(C.E_UN, 0.19, span(p, 0.05, 0.95));
      else if (b === 1) e = lerp(0.19, K.eU, span(p, 0.05, 0.4));
      else if (b === 2) e = lerp(K.eU, 0.265, span(p, 0.05, 0.95));
      else { e = lerp(0.265, K.eF, span(p, 0, 0.18)); broke = p > 0.2; }
      const s = sigma(e);
      steel = { em: e, unload: [C.E_UN, C.SET], cur: [e, s], broke };
      bar = barAt(e, s, { n: neckOf(e) });
      if (broke) bar = { ...STEEL_BROKEN, gap: 1.6 * span(p, 0.2, 0.5) };
      yieldA = b === 3 ? span(p, 0.4, 0.6) : 0.5;
      tick = true;
      utsA = b >= 1 ? (b === 1 ? span(p, 0.3, 0.55) : 1) : 0;
    } else if (si === 3) {
      vis.bolt = span(u, 0, 0.04);
      bar = STEEL_BROKEN;
      set(E.btIn, boltSvg(b >= 1 ? (b === 1 ? span(p, 0.2, 0.7) : 1) : 0, b >= 2 ? (b === 2 ? span(p, 0.2, 0.7) : 1) : 0, b === 3 ? span(p, 0.3, 0.55) : 0));
    } else if (si === 4) {
      vis.curve = b <= 1 ? 1 : 1 - span(p, 0, 0.12) * (b === 2 ? 1 : 1);
      if (b >= 2) vis.curve = 0;
      vis.charpy = b >= 2 ? (b === 2 ? span(p, 0, 0.1) : 1) : 0;
      steel = { em: K.eF, unload: null, broke: true, label: b >= 1 ? 1 : 0 };
      tick = true;
      if (b === 0) bar = STEEL_BROKEN;
      else {
        const prog = b === 1 ? span(p, 0.15, 0.6) : 1;
        bar = IRON_BAR(prog);
        iron = [prog, 1];
      }
      if (b >= 2) {
        // the hammer falls from 120° and swings on to 60°: the bar took the difference
        let theta = -120;
        let broken = false;
        let mark = null;
        if (b === 2) {
          if (p < 0.12) theta = -120;
          else if (p < 0.5) theta = -120 * Math.cos((Math.PI / 2) * ((p - 0.12) / 0.38));
          else { theta = 60 * Math.sin((Math.PI / 2) * clamp((p - 0.5) / 0.35, 0, 1)); broken = true; mark = theta; }
        } else { theta = 60; broken = true; mark = 60; }
        const hs = b === 3 || p > 0.88 ? heights(-120, 60) : '';
        set(E.chIn, charpySvg(theta, broken, mark, b === 3 ? span(p, 0.15, 0.4) : 0) + op(b === 3 ? 1 : span(p, 0.88, 0.98), hs));
      }
    } else if (si === 5) {
      vis.cons = span(u, 0, 0.04);
      bar = barAt(0, 0);
      let work = C.WORK;
      let droop = 0;
      let thick = 12;
      let s355 = 0;
      let ratio = `${C.S235} / ${C.WORK} = ${dec(C.SF1, 2)}`;
      if (b === 0) ratio = p > 0.45 ? ratio : '';
      if (b === 1) { work = lerp(C.WORK, C.DOUBLE, span(p, 0.1, 0.5)); droop = 16 * span(p, 0.55, 0.85); ratio = p > 0.5 ? `${C.DOUBLE} > ${C.S235}` : ''; }
      if (b === 2) {
        s355 = span(p, 0.05, 0.25);
        work = p < 0.6 ? C.DOUBLE : lerp(C.DOUBLE, C.WORK, span(p, 0.6, 0.85));
        thick = p < 0.6 ? 12 : lerp(12, 22, span(p, 0.6, 0.85));
        ratio = p < 0.6 ? `${C.S355} / ${C.DOUBLE} = ${dec(C.SF2, 2)}` : `${C.S235} / ${C.WORK} = ${dec(C.SF1, 2)}`;
      }
      if (b === 3) { thick = 22; ratio = ''; s355 = 1; }
      set(E.csIn, consoleSvg(droop, thick));
      set(E.csSf, sfSvg(work, s355, ratio));
      set(E.csChips, chipsSvg(b === 3 ? span(p, 0.1, 0.35) : 0));
    }

    if (vis.curve > 0.01) {
      set(E.cvSteel, steelSvg(steel));
      set(E.cvIron, ironSvg(iron[0], iron[1]));
      set(E.cvYield, yieldSvg(si === 4 ? 0 : yieldA, tick));
      set(E.cvUts, utsSvg(si === 4 ? 0 : utsA));
      set(E.cvTiles, tilesSvg(tiles, plateA));
    }
    machine(bar);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
