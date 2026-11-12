// The stage of the film "Kracht, moment en spanning / Force, moment and
// stress": a pure function of (scene, u). Inlined into the page after the
// anatomy kit (iso-kit functions in scope) and a preamble from build.mjs that
// defines P (projection), C (world constants and the model's data), CAM (one
// camera move per scene), W and H. Moves are placed per caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step. Card helpers as in eng.mechanics.tensile.
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
  const ease = (t) => t * t * (3 - 2 * t);
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const move = (e, t) => { if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const grp = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',');
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'ml-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'ml-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'ml-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'ml-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  // an arrow in stage space from (x0, y0) to (x1, y1), head at the end
  const arrow = (x0, y0, x1, y1, cls = 'ml-accl', hs = 9) => {
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 1) return '';
    const ux = (x1 - x0) / L;
    const uy = (y1 - y0) / L;
    return `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}M${f1(x1 - hs * ux - hs * 0.6 * uy)} ${f1(y1 - hs * uy + hs * 0.6 * ux)}L${f1(x1)} ${f1(y1)}L${f1(x1 - hs * ux + hs * 0.6 * uy)} ${f1(y1 - hs * uy - hs * 0.6 * ux)}"/>`;
  };
  // an arrow in world space (drawn inside the camera group, constant stroke)
  const warrow = (p0, p1, hs) => { const a = at(p0); const b = at(p1); return arrow(a[0], a[1], b[0], b[1], 'ml-arrow', hs); };
  const EX = tr('voorbeeld', 'example');
  const SCH = tr('schema', 'schematic');
  const PX = 338;
  const PW = 290;
  const PANEL = (tag = EX) => rect(PX, 14, PW, 372) + txt(PX + PW - 14, 42, tag, 22, 'end', 'ml-mute');
  const XL = PX + 18;

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
    const kk = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], kk);
    const cy = lerp(c.from[1], c.to[1], kk);
    const s = W / lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`);
  }
  const O = at([0, 0, 0]);
  const shift = (dx, dz) => { const a = at([dx, 0, dz]); return `translate(${f2(a[0] - O[0])} ${f2(a[1] - O[1])})`; };

  // ------------------------------------------------------------ set A: arrows
  // the weight at the motor's centre of gravity, the lever arm, the bolts' pull
  function arrowsA(mx, wA, armA, boltA, mom) {
    const cz = C.MOT.cz;
    let w = '';
    if (wA > 0.01) w = op(wA, warrow([mx, 0, cz], [mx, 0, cz - 34 * wA], 12) + `<circle class="ml-acc" cx="${f1(at([mx, 0, cz])[0])}" cy="${f1(at([mx, 0, cz])[1])}" r="1.6"/>`);
    set(E.arrW, w);
    let m = '';
    if (armA > 0.01) {
      const y = 13;
      const z = C.ARM_Z[0] - 1;
      const a = at([0, y, z]);
      const b = at([0 + mx * armA, y, z]);
      m = `<path class="ml-arrow" d="M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}"/>`
        + `<path class="ml-arrow" d="M${at([0, y, z - 3]).map(f1).join(' ')}L${at([0, y, z + 3]).map(f1).join(' ')}M${at([mx * armA, y, z - 3]).map(f1).join(' ')}L${at([mx * armA, y, z + 3]).map(f1).join(' ')}"/>`
        + `<path class="ml-arrow" style="stroke-dasharray:3 3" d="M${at([mx * armA, y, z]).map(f1).join(' ')}L${at([mx * armA, 0, C.MOT.cz]).map(f1).join(' ')}"/>`;
    }
    set(E.arrM, m);
    // the top bolts are pulled out of the wall (+x); the plate's foot presses on it (−x)
    let t = '';
    if (boltA > 0.01) {
      const L = 6 + 10 * mom;
      for (const [y, z] of C.BOLTS.filter(([, zz]) => zz > 150)) t += warrow([C.BP.x + 3, y, z], [C.BP.x + 3 + L * boltA, y, z], 8);
      t += warrow([C.BP.x + 3 + L * boltA, 0, C.BP_Z[0] + 2], [C.BP.x + 3, 0, C.BP_Z[0] + 2], 8);
    }
    set(E.arrB, t);
  }

  // ------------------------------------------------------------ set B: rods, trolley, arrows
  const RX = C.ROD.x;
  const ZC = 280; // the saw cut
  function rodSvg(x, dl, gap, cut) {
    const r = C.ROD.r;
    const z0 = C.ROD.z0 - dl;
    const z1 = C.ROD.z1;
    const tb0 = C.ROD.tb[0] - dl / 2;
    const tb1 = C.ROD.tb[1] - dl / 2;
    const cyl = (a, b, rr, tone, steps = 20) => solidSvg(cylinder(x, 0, rr, a, b - a, P, steps), { tone, crease: 'none' });
    let out = cyl(z0, tb0, r, 'hi');
    out += cyl(tb0 - 1.6, tb0, 2.2, 'mid', 6) + cyl(tb0, tb1, 2.6, 'mid', 16) + cyl(tb1, tb1 + 1.6, 2.2, 'mid', 6);
    if (cut) {
      out += cyl(tb1 + 1.6, ZC, r, 'hi');
      out += `<g transform="${shift(0, gap)}">${cyl(ZC, z1, r, 'hi')}</g>`;
    } else out += cyl(tb1 + 1.6, z1, r, 'hi');
    return out;
  }
  function capSvg(gap) {
    if (gap <= 0.05) return '';
    const c = at([RX, 0, ZC]);
    const sx = Math.hypot(at([1, 0, 0])[0] - O[0], at([0, 1, 0])[0] - O[0]);
    const sy = Math.hypot(at([1, 0, 0])[1] - O[1], at([0, 1, 0])[1] - O[1]);
    const r = C.ROD.r;
    const pts = [];
    for (let j = 0; j < 24; j++) { const a = (j / 24) * Math.PI * 2; pts.push([c[0] + Math.cos(a) * r * sx, c[1] + Math.sin(a) * r * sy]); }
    return `<path class="ml-cap" d="${fmt(pts)}Z"/>`;
  }
  // forces in kN: [left rod, right rod, load]
  function arrowsB(tx, F, a, dl) {
    if (a <= 0.01) return '';
    const s = 7;
    let out = '';
    const top = RX;
    out += warrow([-top, 0, C.RB_Z[1] + 14 - dl], [-top, 0, C.RB_Z[1] + 14 - dl + s * F[0]], 10);
    out += warrow([top, 0, C.RB_Z[1] + 14 - dl], [top, 0, C.RB_Z[1] + 14 - dl + s * F[1]], 10);
    out += warrow([tx, 13, 30], [tx, 13, 30 - s * F[2]], 10);
    return op(a, out);
  }

  // ------------------------------------------------------------ cards
  function cardW(b, p) {
    let out = PANEL();
    out += txt(XL, 82, tr('gewicht', 'weight'), 22, 'start', 'ml-mute');
    out += txt(XL, 128, `${C.MASS} kg × ${dec(9.81, 2)}`, 28, 'start', 'ml-big');
    out += txt(XL, 176, `= ${C.WEIGHT} N`, 38, 'start', 'ml-on');
    if (b >= 2) {
      const a = b === 2 ? span(p, 0.05, 0.3) : 1;
      out += op(a, rect(XL - 4, 214, PW - 28, 56, 'ml-tile', 6) + txt(XL + 10, 250, `100 kg ≈ 1 kN`, 26, 'start', 'ml-big')
        + txt(XL, 312, `1 kN = ${grp(1000)} N`, 24, 'start', 'ml-txt') + txt(XL, 350, tr('belasting: N of kN', 'loads: N or kN'), 22, 'start', 'ml-mute'));
    }
    return out;
  }
  function cardM(b, p, mx) {
    let out = PANEL();
    if (b <= 2) {
      out += txt(XL, 82, tr('moment = kracht × arm', 'torque = force × arm'), 22, 'start', 'ml-mute');
      if (b >= 1) {
        const arm = mx / 100;
        const m = C.WEIGHT * arm;
        out += txt(XL, 134, `${C.WEIGHT} N × ${dec(arm, 1)} m`, 28, 'start', 'ml-big');
        out += txt(XL, 182, `= ${Math.round(m)} Nm`, 36, 'start', 'ml-on');
        const full = PW - 40;
        out += rect(XL, 214, full, 22, 'ml-meter', 3).replace('ml-meter"', 'ml-meter" style="opacity:.3"');
        out += `<rect class="ml-meter" data-top="" x="${XL}" y="214" width="${f1(full * m / C.M1)}" height="22" rx="3"/>`;
        out += txt(XL, 268, tr('trek in de bovenste bouten', 'pull in the top bolts'), 22, 'start', 'ml-txt');
        if (b === 2 && p > 0.6) out += txt(XL, 312, tr('2 × zo groot', '2 × as large'), 26, 'start', 'ml-on');
      }
      return out;
    }
    // the wrench: a nut, a handle as long as the arm, the force at its end
    const arm = p < 0.55 ? 0.25 : lerp(0.25, 0.5, span(p, 0.55, 0.8));
    const force = 50 / arm;
    const nx = XL + 30;
    const ny = 150;
    const len = 380 * arm;
    const hex = [];
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; hex.push([nx + 18 * Math.cos(a), ny + 18 * Math.sin(a)]); }
    out += `<path class="ml-solid" d="M${f1(nx)} ${ny - 12}H${f1(nx + len)}V${ny + 12}H${f1(nx)}Z"/>` + `<circle class="ml-solid" cx="${nx}" cy="${ny}" r="26"/>` + `<path class="ml-hatch" d="${fmt(hex)}Z"/>`;
    out += arrow(nx + len - 8, ny - 70 + 0 * force, nx + len - 8, ny - 16) + txt(nx + len - 18, ny - 46, `${Math.round(force)} N`, 22, 'end', 'ml-on');
    out += txt(XL, 196, `${Math.round(force)} N × ${dec(arm, 2)} m`, 26, 'start', 'ml-big');
    out += txt(XL, 240, '= 50 Nm', 34, 'start', 'ml-on');
    if (p > 0.6) out += op(span(p, 0.6, 0.8), txt(XL, 292, tr('dubbele arm,', 'double the arm,'), 22, 'start', 'ml-txt') + txt(XL, 322, tr('halve kracht', 'half the force'), 22, 'start', 'ml-txt'));
    return out;
  }
  function cardF(tx, F) {
    let out = PANEL(SCH);
    const x0 = XL + 12;
    const x1 = PX + PW - 30;
    const y = 214;
    out += txt(XL, 82, tr('balk los getekend', 'the beam on its own'), 22, 'start', 'ml-mute');
    out += `<rect class="ml-tile" x="${x0 - 4}" y="${y - 7}" width="${f1(x1 - x0 + 8)}" height="14" rx="3"/>`;
    const lx = lerp(x0, x1, (tx + RX) / (2 * RX));
    const s = 15;
    out += arrow(x0, y - 10 - s * F[0] * 0 - 2, x0, y - 12 - s * F[0]) + txt(x0, y - 22 - s * F[0], `${dec(F[0], 1)}`, 24, 'middle', 'ml-on');
    out += arrow(x1, y - 2 - 10, x1, y - 12 - s * F[1]) + txt(x1, y - 22 - s * F[1], `${dec(F[1], 1)}`, 24, 'middle', 'ml-on');
    out += arrow(lx, y + 12, lx, y + 12 + s * F[2]) + txt(lx + 10, y + 12 + s * F[2] + 4, `${C.LOAD}`, 24, 'start', 'ml-big');
    out += txt(XL, 362, tr(`samen ${dec(F[0] + F[1], 1)} kN`, `sum ${dec(F[0] + F[1], 1)} kN`), 24, 'start', 'ml-txt');
    return out;
  }
  // the force on the hook over time: still, lowering, a stop and the bounce
  const forceT = (t) => (t < 0.35 ? 1 : 1 + 0.75 * Math.exp(-(t - 0.35) * 5) * Math.sin((t - 0.35) * 30));
  function cardD(b, p, prog) {
    let out = PANEL(SCH);
    const ox = XL + 8;
    const oy = 300;
    const x1 = PX + PW - 20;
    const fy = (f) => oy - 78 * f;
    out += line(ox, 70, ox, oy) + line(ox, oy, x1, oy);
    out += txt(ox + 8, 86, tr('kracht', 'force'), 22, 'start', 'ml-mute') + txt(x1, oy + 28, tr('tijd →', 'time →'), 22, 'end', 'ml-mute');
    out += `<path class="ml-lim" d="M${ox} ${f1(fy(1))}H${x1}"/>` + txt(ox + 10, fy(1) + 28, tr('gewicht', 'weight'), 22, 'start', 'ml-mute');
    const pts = [];
    const n = Math.max(2, Math.round(80 * prog));
    for (let i = 0; i <= n; i++) { const t = (i / 80); pts.push([lerp(ox, x1, t), fy(forceT(t))]); }
    out += `<path class="ml-line" d="${fmt(pts)}"/>`;
    if (b >= 2) out += op(b === 2 ? span(p, 0.2, 0.45) : 1, `<path class="ml-lim" d="M${ox} ${f1(fy(2))}H${x1}"/>` + txt(ox + 10, fy(2) - 10, tr(`factor ${dec(1.1, 1)} tot 2`, `factor ${dec(1.1, 1)} to 2`), 22, 'start', 'ml-on'));
    return out;
  }
  function cardWll(b, p) {
    let out = PANEL(SCH);
    if (b === 3) {
      out += rect(XL + 10, 72, 150, 92, 'ml-tile', 8) + `<circle class="ml-hatch" cx="${XL + 30}" cy="92" r="6"/>` + txt(XL + 92, 132, 'WLL', 34, 'middle', 'ml-big');
      const full = PW - 40;
      const wA = span(p, 0.1, 0.4);
      out += op(wA, txt(XL, 214, 'WLL', 22, 'start', 'ml-txt') + `<rect class="ml-meter" data-top="" x="${XL}" y="226" width="${f1(full / 7)}" height="22" rx="3"/>`);
      const bA = span(p, 0.4, 0.75);
      out += op(bA, txt(XL, 290, tr(`breuklast: ${C.BREAK[0]} tot ${C.BREAK[1]} ×`, `breaking: ${C.BREAK[0]} to ${C.BREAK[1]} ×`), 22, 'start', 'ml-txt')
        + `<rect class="ml-meter" x="${XL}" y="302" width="${f1(full * 4 / 7)}" height="22" rx="3"/><rect class="ml-meter" style="opacity:.4" x="${f1(XL + full * 4 / 7)}" y="302" width="${f1(full * 3 / 7)}" height="22" rx="3"/>`
        + txt(XL, 360, tr('niet jouw marge', 'not your margin'), 22, 'start', 'ml-on'));
      return out;
    }
    // the sling at 120°: each leg pulls as hard as the whole load
    const hx = PX + PW / 2;
    const hy = 96;
    const leg = 120;
    const ang = (C.SLING / 2) * Math.PI / 180;
    const ax = hx - leg * Math.sin(ang);
    const bx = hx + leg * Math.sin(ang);
    const ly = hy + leg * Math.cos(ang);
    out += `<path class="ml-line" d="M${f1(ax)} ${f1(ly)}L${hx} ${hy}L${f1(bx)} ${f1(ly)}"/>` + dot(hx, hy, 6);
    out += rect(ax - 16, ly, bx - ax + 32, 54, 'ml-solid', 4);
    const s = span(p, 0.15, 0.5);
    out += op(s, arrow(hx, ly + 64, hx, ly + 64 + 50) + txt(hx + 12, ly + 104, 'F', 26, 'start', 'ml-big')
      + arrow(ax, ly, ax + (hx - ax) * 0.42, ly - (ly - hy) * 0.42) + arrow(bx, ly, bx - (bx - hx) * 0.42, ly - (ly - hy) * 0.42)
      + txt(ax - 4, ly - 56, 'F', 26, 'end', 'ml-on') + txt(bx + 4, ly - 56, 'F', 26, 'start', 'ml-on'));
    out += txt(hx, hy - 16, `${C.SLING}°`, 22, 'middle', 'ml-txt');
    out += op(span(p, 0.4, 0.6), txt(XL, 368, tr('elke poot: de volle last', 'each leg: the full load'), 22, 'start', 'ml-on'));
    return out;
  }
  function cardS(b, p) {
    let out = PANEL();
    const cx = PX + 92;
    const cy = 112;
    const R = 52;
    let hatch = '';
    const q = Math.SQRT1_2;
    for (let d = -R + 8; d < R - 4; d += 11) { const h = Math.sqrt(R * R - d * d) - 2; hatch += `M${f1(cx + d * q - h * q)} ${f1(cy + d * q + h * q)}L${f1(cx + d * q + h * q)} ${f1(cy + d * q - h * q)}`; }
    if (b <= 2) {
      out += `<circle class="ml-solid" cx="${cx}" cy="${cy}" r="${R}"/>` + `<path class="ml-hatch" d="${hatch}"/>`;
      out += `<path class="ml-accl" d="M${cx - R} ${cy + R + 14}H${cx + R}"/>` + txt(cx, cy + R + 44, 'Ø20 mm', 22, 'middle', 'ml-txt');
      if (b >= 1) out += op(b === 1 ? span(p, 0.3, 0.6) : 1, txt(cx + R + 18, cy - 8, 'A =', 22, 'start', 'ml-mute') + txt(cx + R + 18, cy + 24, `${C.AREA} mm²`, 24, 'start', 'ml-big'));
      if (b === 0) out += txt(XL, 290, tr('spanning =', 'stress ='), 24, 'start', 'ml-txt') + txt(XL, 328, tr('kracht / doorsnede', 'force / cross-section'), 24, 'start', 'ml-on');
      if (b === 2) {
        out += op(span(p, 0.05, 0.3), txt(XL, 268, `F = ${dec(C.F_ROD, 1)} kN`, 24, 'start', 'ml-txt'));
        out += op(span(p, 0.3, 0.55), txt(XL, 306, `${grp(31400)} / ${C.AREA}`, 26, 'start', 'ml-big'));
        out += op(span(p, 0.5, 0.75), txt(XL, 350, `= ${Math.round(C.SIG)} MPa`, 34, 'start', 'ml-on'));
      }
      return out;
    }
    // the same force on a thick and a thin bar
    const c1 = [PX + 82, 150];
    const c2 = [PX + 214, 150];
    out += txt(XL, 82, tr('zelfde kracht', 'same force'), 22, 'start', 'ml-mute');
    out += `<circle class="ml-solid" cx="${c1[0]}" cy="${c1[1]}" r="54"/><circle class="ml-solid" cx="${c2[0]}" cy="${c2[1]}" r="17"/>`;
    out += txt(c1[0], 246, tr('dik', 'thick'), 22, 'middle', 'ml-txt') + txt(c2[0], 246, tr('dun', 'thin'), 22, 'middle', 'ml-txt');
    const a = span(p, 0.2, 0.5);
    out += op(a, `<rect class="ml-meter" x="${c1[0] - 14}" y="${f1(320 - 12)}" width="28" height="12" rx="3"/><rect class="ml-meter" data-top="" x="${c2[0] - 14}" y="${f1(320 - 64)}" width="28" height="64" rx="3"/>`
      + txt(c1[0], 352, tr('laag', 'low'), 22, 'middle', 'ml-txt') + txt(c2[0], 352, tr('hoog', 'high'), 22, 'middle', 'ml-on'));
    out += op(a, txt(XL, 292, tr('spanning:', 'stress:'), 22, 'start', 'ml-mute'));
    return out;
  }
  // stress against strain: steel, aluminium and plastic as straight lines (elastic range)
  const SOX = PX + 46;
  const SOY = 300;
  const SX1 = PX + PW - 20;
  const SY1 = 96;
  const sx = (e) => SOX + (SX1 - SOX) * e / 0.0022;
  const sy = (s) => SOY - (SOY - SY1) * s / 140;
  function cardE(b, p, eNow) {
    let out = PANEL(SCH);
    if (b === 0) {
      out = PANEL();
      out += txt(XL, 96, tr('rek = ΔL / L', 'strain = ΔL / L'), 28, 'start', 'ml-big');
      out += txt(XL, 160, `${dec(0.5, 1)} / ${grp(1000)}`, 26, 'start', 'ml-txt');
      out += txt(XL, 208, `= ${dec(0.0005, 4)}`, 34, 'start', 'ml-on');
      out += txt(XL, 270, tr('geen eenheid', 'no unit'), 22, 'start', 'ml-mute');
      out += txt(XL, 350, tr('in beeld: overdreven', 'on screen: exaggerated'), 22, 'start', 'ml-mute');
      return { base: out, str: '', lines: '' };
    }
    out += line(SOX, SY1 - 10, SOX, SOY) + line(SOX, SOY, SX1, SOY);
    out += txt(SOX + 8, 82, tr('spanning', 'stress'), 22, 'start', 'ml-mute') + txt(SX1, SOY + 28, tr('rek →', 'strain →'), 22, 'end', 'ml-mute');
    let lines = '';
    let str = '';
    if (b === 1) {
      lines += `<path class="ml-line" d="M${SOX} ${SOY}L${f1(sx(0.0006))} ${f1(sy(0.0006 * C.E_ST))}"/>`;
      lines += dot(sx(eNow), sy(eNow * C.E_ST), 6) + txt(sx(0.0008), sy(70), tr('heen en terug', 'out and back'), 22, 'start', 'ml-on');
      return { base: out, str, lines };
    }
    const mat = [[C.E_ST, tr('staal', 'steel')], [C.E_AL, 'alu'], [2500, tr('kunststof', 'plastic')]];
    const lA = b === 2 ? span(p, 0.3, 0.6) : 1;
    for (const [E0, name] of mat) {
      const e1 = Math.min(0.0022, 125 / E0);
      const right = sx(e1) < SX1 - 70;
      lines += op(lA, `<path class="ml-line" d="M${SOX} ${SOY}L${f1(sx(e1))} ${f1(sy(e1 * E0))}"/>` + txt(right ? sx(e1) + 8 : sx(e1), right ? sy(e1 * E0) + 8 : sy(e1 * E0) - 12, name, 22, right ? 'start' : 'end', 'ml-txt'));
    }
    if (b === 2) lines += op(lA, txt(SX1, 128, 'E', 30, 'end', 'ml-on'));
    if (b >= 3) {
      out += `<path class="ml-lim" d="M${SOX} ${f1(sy(100))}H${f1(SX1)}"/>` + txt(SOX - 8, sy(100) + 8, '100', 22, 'end', 'ml-mute');
      str += dot(sx(C.EPS), sy(100), 6);
      if (b === 3) str += txt(XL, 346, `${tr('rek', 'strain')} ${dec(C.EPS, 6)}`, 22, 'start', 'ml-big') + txt(XL, 374, `${tr('staal', 'steel')}: ΔL = ${dec(C.DL_ST, 2)} mm`, 22, 'start', 'ml-on');
      else str += dot(sx(100 / C.E_AL), sy(100), 6) + txt(XL, 346, `${tr('staal', 'steel')}: ${dec(C.DL_ST, 2)} mm`, 22, 'start', 'ml-txt') + txt(XL, 374, `alu: ${dec(C.DL_AL, 2)} mm`, 22, 'start', 'ml-on');
    }
    return { base: out, str, lines };
  }
  function cardK(b, p) {
    let out = PANEL(SCH);
    let stiff = '';
    let str = '';
    if (b === 0) {
      out += txt(XL, 82, tr('spanning', 'stress'), 22, 'start', 'ml-mute');
      out += `<path class="ml-lim" d="M${XL} 120H${PX + PW - 20}"/>` + txt(PX + PW - 20, 112, tr('vloeigrens', 'yield'), 22, 'end', 'ml-txt');
      out += `<rect class="ml-meter" x="${XL + 30}" y="180" width="40" height="70" rx="3"/><rect class="ml-meter" x="${XL + 130}" y="180" width="40" height="70" rx="3"/>`;
      out += txt(XL + 50, 276, tr('staal', 'steel'), 22, 'middle', 'ml-txt') + txt(XL + 150, 276, 'alu', 22, 'middle', 'ml-txt');
      const a = span(p, 0.4, 0.7);
      out += op(a, txt(XL, 320, tr('beweging', 'movement'), 22, 'start', 'ml-mute')
        + `<rect class="ml-meter" x="${XL}" y="332" width="40" height="16" rx="3"/><rect class="ml-meter" data-top="" x="${XL + 130}" y="332" width="${f1(40 * C.DL_AL / C.DL_ST)}" height="16" rx="3"/>`
        + txt(XL, 372, `${dec(C.DL_ST, 2)} mm`, 22, 'start', 'ml-txt') + txt(XL + 130, 372, `${dec(C.DL_AL, 2)} mm`, 22, 'start', 'ml-on'));
      return { base: out, stiff, str };
    }
    if (b <= 2) {
      if (b === 1) {
        stiff = rect(XL - 4, 70, PW - 28, 120, 'ml-tile', 8) + txt(XL + 10, 110, tr('stijfheid', 'stiffness'), 26, 'start', 'ml-txt') + txt(XL + 10, 150, tr('hoeveel beweegt het?', 'how much does it move?'), 22, 'start', 'ml-mute');
        str = op(span(p, 0.45, 0.6), rect(XL - 4, 214, PW - 28, 120, 'ml-tile', 8) + txt(XL + 10, 254, tr('sterkte', 'strength'), 26, 'start', 'ml-txt') + txt(XL + 10, 294, tr('wanneer bezwijkt het?', 'when does it fail?'), 22, 'start', 'ml-mute'));
        return { base: out, stiff, str };
      }
      // the same slope, a higher yield: stiffness alike, strength not
      out += line(SOX, 90, SOX, SOY) + line(SOX, SOY, SX1, SOY);
      out += txt(SOX + 8, 82, tr('spanning', 'stress'), 22, 'start', 'ml-mute') + txt(SX1, SOY + 28, tr('rek →', 'strain →'), 22, 'end', 'ml-mute');
      const k1 = (SOY - 236) / 50;
      stiff = `<path class="ml-line" d="M${SOX} ${SOY}L${SOX + 50} 236L${SX1} 230"/>`;
      str = op(span(p, 0.2, 0.5), `<path class="ml-line" d="M${SOX + 50} 236L${SOX + 110} ${f1(SOY - 110 * k1)}L${SX1} ${f1(SOY - 110 * k1 - 6)}"/>`
        + txt(SX1, SOY - 110 * k1 + 22, tr('hogesterkte', 'high-strength'), 22, 'end', 'ml-txt'));
      stiff += txt(SX1, 256, tr('gewoon', 'mild'), 22, 'end', 'ml-txt') + op(span(p, 0.5, 0.75), txt(SOX + 16, 350, tr('zelfde helling', 'same slope'), 22, 'start', 'ml-on'));
      return { base: out, stiff, str };
    }
    if (b === 3) {
      out += txt(XL, 82, tr('buigstijfheid', 'bending stiffness'), 22, 'start', 'ml-mute');
      out += rect(XL + 20, 190, 40, 60, 'ml-solid', 2) + txt(XL + 40, 280, 'h', 24, 'middle', 'ml-txt') + txt(XL + 40, 314, '1 ×', 24, 'middle', 'ml-txt');
      const a = span(p, 0.15, 0.45);
      out += op(a, rect(XL + 110, 130, 40, 120, 'ml-solid', 2) + txt(XL + 130, 280, '2h', 24, 'middle', 'ml-txt') + txt(XL + 130, 314, '8 ×', 30, 'middle', 'ml-on'));
      const i = op(span(p, 0.5, 0.75), `<path class="ml-solid" d="M${XL + 196} 130h64v12h-26v96h26v12h-64v-12h26v-96h-26Z"/>` + txt(XL + 228, 280, 'I', 24, 'middle', 'ml-txt'));
      out += i;
      return { base: out, stiff, str };
    }
    out = PANEL('');
    out += txt(PX + PW / 2, 150, tr('breken', 'breaking'), 34, 'middle', 'ml-big') + txt(PX + PW / 2, 210, tr('of', 'or'), 24, 'middle', 'ml-mute') + txt(PX + PW / 2, 270, tr('bewegen?', 'moving?'), 34, 'middle', 'ml-on');
    return { base: out, stiff, str };
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['cW', 'cM', 'cF', 'cD', 'cS', 'cE', 'cK'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const vis = {};
    const A = si <= 1;
    show(E.setA, A);
    show(E.setB, !A);
    if (A) {
      let mx = C.MX[0];
      let wA = 0;
      let armA = 0;
      let boltA = 0;
      if (si === 0) {
        wA = b >= 1 ? (b === 1 ? span(p, 0.15, 0.45) : 1) : 0;
        vis.cW = b >= 1 ? (b === 1 ? span(p, 0.2, 0.4) : 1) : 0;
        set(E.cWIn, cardW(b, p));
      } else {
        wA = 1;
        armA = b === 0 ? ease(span(p, 0.3, 0.7)) : 1;
        if (b === 2) mx = lerp(C.MX[0], C.MX[1], ease(span(p, 0.1, 0.55)));
        if (b === 3) mx = C.MX[1];
        boltA = b >= 1 ? (b === 1 ? span(p, 0.45, 0.7) : 1) : 0;
        vis.cM = span(u, 0, 0.05);
        set(E.cMIn, cardM(b, p, mx));
      }
      move(E.motor, shift(mx, 0));
      arrowsA(mx, wA, armA, boltA, (mx * C.WEIGHT / 100) / C.M1);
    } else {
      set(E.arrW, '');
      set(E.arrM, '');
      let tx = 0;
      let bob = 0;
      let dl = 0;
      let gap = 0;
      let cut = false;
      let arrB = 0;
      const full = 7; // the drawn stretch at 100 MPa, cm (exaggerated)
      if (si === 2) {
        if (b === 2) tx = 80 * ease(span(p, 0.08, 0.6));
        arrB = b === 0 ? span(p, 0.4, 0.7) : 1;
        vis.cF = b === 0 ? span(p, 0.4, 0.6) : 1;
      } else if (si === 3) {
        // the crate lowers, stops and bounces (beat 2), then hangs still
        let prog = 0;
        if (b === 0) prog = 0.3 * span(p, 0.2, 0.9);
        else if (b === 1) prog = lerp(0.3, 1, span(p, 0.05, 0.85));
        else prog = 1;
        const tt = prog;
        bob = tt < 0.35 ? -8 * (tt / 0.35) * 0 : -0.9 * Math.exp(-(tt - 0.35) * 5) * Math.sin((tt - 0.35) * 30) * 3;
        if (b === 1 && p < 0.3) bob = -4 * span(p, 0, 0.3) + 4;
        vis.cD = 1;
        if (b <= 2) set(E.cDIn, cardD(b, p, b === 0 ? 0.3 : prog));
        else set(E.cDIn, '');
        set(E.cDWll, b >= 3 ? cardWll(b, p) : '');
      } else if (si === 4) {
        dl = b === 0 ? full * ease(span(p, 0.3, 0.8)) : full;
        if (b === 1) { cut = true; gap = 12 * ease(span(p, 0.15, 0.4)); }
        if (b === 2) { cut = p < 0.25; gap = 12 * (1 - ease(span(p, 0, 0.2))); }
        vis.cS = span(u, 0, 0.06);
        set(E.cSIn, cardS(b, p));
      } else if (si === 5) {
        dl = full;
        let eNow = C.EPS;
        if (b === 1) {
          const k2 = 0.5 - 0.5 * Math.cos(Math.PI * 2 * span(p, 0.1, 0.9));
          dl = full * (1 - k2);
          eNow = 0.000476 * (1 - k2);
        }
        vis.cE = 1;
        const ce = cardE(b, p, eNow);
        set(E.cEIn, ce.base);
        set(E.cEStr, ce.str);
        set(E.cELines, ce.lines);
      } else {
        dl = full;
        vis.cK = 1;
        const ck = cardK(b, p);
        set(E.cKIn, ck.base);
        set(E.cKStiff, ck.stiff);
        set(E.cKStr, ck.str);
      }
      const key = [dl, gap, cut].map(String).join();
      if (E.rods.__key !== key) {
        E.rods.innerHTML = rodSvg(-RX, dl, 0, false) + rodSvg(RX, dl, gap, cut);
        E.rods.__key = key;
      }
      set(E.cut, capSvg(cut ? gap : 0));
      move(E.runway, shift(0, -dl));
      const tt = shift(tx, 0);
      move(E.trolB, tt);
      move(E.wheelsB, tt);
      move(E.wheelsF, tt);
      move(E.trolF, tt);
      move(E.hookset, shift(0, bob));
      const F = [C.LOAD * (RX - tx) / (2 * RX), C.LOAD * (RX + tx) / (2 * RX), C.LOAD];
      set(E.arrB, arrowsB(tx, F, arrB, dl));
      if (si === 2) set(E.cFIn, cardF(tx, F));
    }
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
