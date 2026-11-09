// The stage of the film "Lasfouten vinden / Finding weld defects": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope), a preamble from build.mjs that defines P (projection),
// C (world constants, beat cameras), W and H, and the kit's audio warp.
//
// Each scene is a row of beats; the beat on screen (and how far through it)
// comes from the caption beat starts, so a move lands on the line that names
// it. The bench is the world (moved by one camera per beat); the cards over it
// (the weld section, the charts, the papers) are drawn in stage space.
/* global P, C, W, H, iso, pathOf, translateAlong, span, beatStarts, warpU, introBeat, introCamera */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tx = (nl, en) => (EN ? en : nl);
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => iso(p, P);
  const pth = (pts, closed = false) => pathOf(pts, closed);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const op = (e, v) => { const s = String(Math.round(clamp(v, 0, 1) * 100) / 100); if (e.__o !== s) { e.style.opacity = s; e.__o = s; } };
  const attr = (e, name, v) => { if (e['__' + name] !== v) { e.setAttribute(name, v); e['__' + name] = v; } };
  const move = (e, by) => attr(e, 'transform', translateAlong(P, by));
  const seeded = (i) => { const s = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return s - Math.floor(s); };
  const T = (x, y, text, size = 20, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
  const card = (x, y, w, h, r = 12) => `<rect class="fp-hud-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fp-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const arrow = (x0, y0, x1, y1, head = 9, cls = 'fp-mark') => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    return `<path class="${cls}" style="stroke-width:2.2" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}M${f1(x1 - ux * head - uy * head * 0.55)} ${f1(y1 - uy * head + ux * head * 0.55)}L${f1(x1)} ${f1(y1)}L${f1(x1 - ux * head + uy * head * 0.55)} ${f1(y1 - uy * head - ux * head * 0.55)}"/>`;
  };
  const num = (v, dec = 0) => { const s = v.toFixed(dec); return EN ? s : s.replace('.', ','); };
  const PT = C.PT;
  const rad = (d) => (d * Math.PI) / 180;
  const G30 = Math.tan(rad(C.BEVEL));
  const fus = (z) => (z <= 2 ? 1 : 1 + (z - 2) * G30);
  const flankY = (z) => -(1 + Math.max(0, z - 2) * G30);

  // ------------------------------------------------------------ the macro: the weld's section, drawn flat and large (local 500 × 210)
  const MK = 5.4;
  const mX = (y) => 250 + y * MK;
  const mZ = (z) => 64 + (20 - z) * MK;
  const M2 = (pts, closed = true) => pth(pts.map(([y, z]) => [mX(y), mZ(z)]), closed);
  set(E.mBase, (() => {
    const far = [[-43, 0], [-1, 0], [-1, 2], [-fus(20), 20], [-43, 20]];
    const near = [[1, 0], [43, 0], [43, 20], [fus(20), 20], [1, 2]];
    return `<rect class="fp-hud-bg" x="0" y="0" width="500" height="210" rx="12"/><rect class="fp-frame" x="0" y="0" width="500" height="210" rx="12"/><path class="fp-steel" d="${M2(far)}"/><path class="fp-steel" d="${M2(near)}"/>`;
  })());
  set(E.mHaz, `<path class="fp-hazf" d="${M2(C.SECT.haz)}"/>`);
  set(E.mWeld, `<path class="fp-weld" d="${M2(C.SECT.weld)}"/><path class="fp-ripple" d="${C.SECT.passes.map((q) => M2(q, false)).join('')}"/>`);
  const PORES = [[-2.4, 13, 0.95], [1.6, 11.2, 0.75], [3.4, 15.4, 0.6], [-0.6, 8.2, 0.65], [2.2, 6.4, 0.5], [-3.6, 16.6, 0.55]];
  const poresSvg = (n) => PORES.slice(0, n).map(([y, z, r]) => `<circle class="fp-pore" cx="${f1(mX(y))}" cy="${f1(mZ(z))}" r="${f1(r * MK)}"/>`).join('');
  const lofSvg = (() => {
    const out = [];
    const inn = [];
    for (let i = 0; i <= 6; i++) { const z = C.LOF.z0 + ((C.LOF.z1 - C.LOF.z0) * i) / 6; out.push([flankY(z), z]); inn.push([flankY(z) + 0.75, z]); }
    return `<path class="fp-gap" d="${M2([...out, ...inn.reverse()])}"/>`;
  })();
  const crackPts = (() => { const pts = []; for (let i = 0; i <= 9; i++) { const z = 20 - i * 0.95; pts.push([C.FT + 1.4 + i * 0.22 + (i % 2 ? 0.45 : -0.35), z]); } return pts; })();
  const crackSvg = (g) => { const n = Math.round(clamp(g, 0, 1) * (crackPts.length - 1)); return n >= 1 ? `<path class="fp-crack" d="${M2(crackPts.slice(0, n + 1), false)}"/>` : ''; };
  function macroAt(x, y, s) { attr(E.macro, 'transform', `translate(${x} ${y}) scale(${s})`); }
  // the angle probe on the macro's top face, its beam, and the echo it gets back
  function probeSvg(a) {
    // a wedge whose sloped front sends the beam in at 60°, the crystal case on top, the cable socket
    const x0 = mX(a - 3);
    const x1 = mX(a + 11);
    const y0 = mZ(20);
    return `<path class="fp-card" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y0)}L${f1(x1)} ${f1(y0 - 30)}L${f1(x0 + 20)} ${f1(y0 - 30)}Z"/><path class="fp-mark" d="M${f1(mX(a))} ${f1(y0)}L${f1(mX(a))} ${f1(y0 - 9)}"/><rect class="fp-bar" x="${f1(mX(a + 7) - 6)}" y="${f1(y0 - 42)}" width="12" height="12" rx="2"/>`;
  }
  // the beam centre from index point a at angle th (from vertical); stops on the flank if it hits the flaw
  function beamOf(a, th) {
    const tn = Math.tan(rad(th));
    const LZ = (C.LOF.z0 + C.LOF.z1) / 2;
    const yh = a - (20 - LZ) * tn;
    const hit = th === 60 && Math.abs(yh - flankY(LZ)) < 2.2;
    if (hit) return { pts: [[a, 20], [yh, LZ]], hit: true };
    return { pts: [], hit: false };
  }
  function beamSvg(a, th, cls = 'fp-beam') {
    const b = beamOf(a, th);
    let pts = b.pts;
    if (!b.hit) {
      // second leg up to the top face, clipped at the card's left edge
      const tn = Math.tan(rad(th));
      const yb = a - 20 * tn;
      let y2 = yb - 20 * tn;
      let z2 = 20;
      if (y2 < -43) { z2 = (yb + 43) / tn; y2 = -43; }
      pts = [[a, 20], [yb, 0], [y2, z2]];
    }
    const wide = b.hit ? `<path class="fp-beamw" d="${M2([[a - 1.2, 20], [a + 1.2, 20], [pts[1][0] + 2, pts[1][1] - 1.5], [pts[1][0] - 1, pts[1][1] + 1.5]])}"/>` : '';
    return { svg: wide + `<path class="${cls}" d="${M2(pts, false)}"/>`, hit: b.hit };
  }
  const echoAmp = (a) => 95 * Math.exp(-(((a - C.PROBE_HIT) / 3.2) ** 2));

  // ------------------------------------------------------------ the A-scan screen (local 230 × 230)
  function ascanSvg(amp, ref = true) {
    const sx = (s) => 22 + s * 1.9;
    const base = 164;
    const hgt = 140;
    const grid = [];
    for (let i = 1; i < 10; i++) grid.push(`M${f1(14 + i * 20.2)} 14L${f1(14 + i * 20.2)} 172`);
    for (let i = 1; i < 8; i++) grid.push(`M14 ${f1(14 + i * 19.75)}L216 ${f1(14 + i * 19.75)}`);
    const pts = [];
    for (let s = 0; s <= 100; s += 0.5) {
      let a = 1.5 + 1.2 * seeded(Math.round(s * 2));
      if (s < 4) a = 100 * Math.exp(-(((s - 1.5) / 1) ** 2)) + a;
      a += amp * Math.exp(-(((s - C.ECHO_S) / 1.1) ** 2));
      pts.push([sx(s), base - (Math.min(a, 105) / 100) * hgt]);
    }
    const refY = base - 0.8 * hgt;
    return `<rect class="fp-hud-bg" x="0" y="0" width="230" height="230" rx="12"/><rect class="fp-frame" x="0" y="0" width="230" height="230" rx="12"/><rect class="fp-disp" x="14" y="14" width="202" height="158" rx="4"/><path class="fp-grid" d="${grid.join('')}"/>`
      + (ref ? `<path class="fp-dash" d="M16 ${f1(refY)}L214 ${f1(refY)}"/>${T(212, refY - 6, 'ref', 19, 'end', 'fp-small')}` : '')
      + `<path class="fp-sig" d="${pth(pts)}"/>${T(115, 206, tx('geluidsweg →', 'sound path →'), 19)}`;
  }

  // ------------------------------------------------------------ the repair loop (local: centre cx, cy)
  function loopSvg(cx, cy, p, mid) {
    const R = 46;
    const names = EN ? ['gouge', 'reweld', 'retest'] : ['gutsen', 'lassen', 'testen'];
    const ang = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
    let out = '';
    for (let i = 0; i < 3; i++) {
      const a0 = ang[i] + 0.36;
      const a1 = ang[(i + 1) % 3] - 0.36 + (i === 2 ? TAU : 0);
      const pts = [];
      for (let k = 0; k <= 12; k++) { const a = a0 + ((a1 - a0) * k) / 12; pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
      out += `<path class="fp-mark" style="stroke-width:2" d="${pth(pts)}"/>`;
      const [ex, ey] = pts[pts.length - 1];
      const [px, py] = pts[pts.length - 3];
      out += arrow(px, py, ex, ey, 8);
    }
    ang.forEach((a, i) => {
      const x = cx + Math.cos(a) * R;
      const y = cy + Math.sin(a) * R;
      out += `<circle class="fp-card" cx="${f1(x)}" cy="${f1(y)}" r="9"/>`;
      out += T(x + (i === 0 ? 0 : i === 1 ? 14 : -14), y + (i === 0 ? -16 : 30), names[i], 19, i === 0 ? 'middle' : i === 1 ? 'start' : 'end');
    });
    const a = -Math.PI / 2 + p * TAU;
    out += `<circle class="fp-ink" cx="${f1(cx + Math.cos(a) * R)}" cy="${f1(cy + Math.sin(a) * R)}" r="5"/>`;
    if (mid) out += T(cx, cy + 8, mid, 22, 'middle', 'fp-big');
    return out;
  }

  // ------------------------------------------------------------ the bench: cable, probe, film, powder, burner
  function cableSvg(from, to, sag) {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      pts.push(at([lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t) - sag * Math.sin(Math.PI * t)]));
    }
    const d = pth(pts);
    return `<path class="fp-hose" stroke-width="4" d="${d}"/><path class="fp-hose-hi" stroke-width="1.6" d="${d}"/>`;
  }
  function placeProbe(a) {
    move(E.probe, [C.PROBE.x, a, 0]);
    set(E.cable, cableSvg([C.SOCKET[0], C.SOCKET[1] + 7, C.SOCKET[2]], [C.PROBE.x, a + 12, PT + 28], 22));
  }
  const onZ = (z, pts, closed = true) => pth(pts.map(([x, y]) => at([x, y, z])), closed);
  const CR = C.CRACK;
  const filmRect = (x0, x1, y0, y1) => onZ(PT + 0.08, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
  function mistSvg(amount, clockS, x0, x1) {
    if (amount <= 0.02) return '';
    const pts = [];
    for (let i = 0; i < 40; i++) {
      const f = (seeded(i) + clockS * 0.6) % 1;
      const x = lerp(x0, x1, seeded(i + 50));
      const y = CR.y + 2 + seeded(i + 90) * 14;
      const z = PT + 2 + (1 - f) * 40;
      const [px, py] = at([x + (1 - f) * 18, y + (1 - f) * 10, z]);
      pts.push(`<circle class="fp-mist" cx="${f1(px)}" cy="${f1(py)}" r="0.9" style="opacity:${(amount * (0.3 + 0.7 * f)).toFixed(2)}"/>`);
    }
    return pts.join('');
  }
  const HEAT = (() => { const a = C.HEAT_AX; const l = Math.hypot(...a); return a.map((v) => v / l); })();
  function flameSvg(o, clockS) {
    // the burner's frame: the axis HEAT, a side vector across it
    const ax = HEAT;
    const side = (() => { const c = [ax[1], -ax[0], 0]; const l = Math.hypot(...c) || 1; return c.map((v) => v / l); })();
    const out = [];
    for (const [len, wid] of [[26, 6.5], [15, 3.4]]) {
      const pts = [];
      for (let i = 0; i <= 14; i++) {
        const t = i / 14;
        const s = 6 - len * Math.sin((t * Math.PI) / 2) * (1 + 0.08 * Math.sin(clockS * 23 + i));
        const r = wid * Math.sin(t * Math.PI) * (1 - t * 0.5);
        pts.push([s, r]);
      }
      const sideOf = (sgn) => pts.map(([s, r]) => at([o[0] + ax[0] * s + side[0] * sgn * r, o[1] + ax[1] * s + side[1] * sgn * r, o[2] + ax[2] * s]));
      out.push(`<path class="fp-flame" d="${pth([...sideOf(1), ...sideOf(-1).reverse()], true)}"/>`);
    }
    // where the flame meets the plate: a warm glow on the steel
    const reach = (o[2] - PT) / ax[2];
    const [gx, gy] = at([o[0] - ax[0] * reach, o[1] - ax[1] * reach, PT]);
    const glow = `<ellipse cx="${f1(gx)}" cy="${f1(gy)}" rx="22" ry="12" fill="url(#fp-glow)"/>`;
    return glow + out.join('');
  }

  // ------------------------------------------------------------ the cards, one function each
  function distSvg(p) {
    const cx = 320;
    const cy = 200;
    const th = rad(8) * p;
    const plate = (sgn, ang, cls) => {
      const P2 = [[sgn * 6, 0], [sgn * 176, 0], [sgn * 176, -24], [sgn * 18, -24]];
      const rot = P2.map(([x, y]) => { const a = -sgn * ang; return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)]; });
      return `<path class="${cls}" d="${pth(rot, true)}"/>`;
    };
    const ghost = `<path class="fp-dash" d="M${cx - 176} ${cy}L${cx + 176} ${cy}L${cx + 176} ${cy - 24}L${cx - 176} ${cy - 24}Z"/>`;
    const weld = (() => {
      const a = th;
      const l = [cx - 18 * Math.cos(a), cy - 24 * Math.cos(a) - 18 * Math.sin(a)];
      const r = [cx + 18 * Math.cos(a), cy - 24 * Math.cos(a) - 18 * Math.sin(a)];
      return `<path class="fp-weld" d="M${f1(cx - 6)} ${cy}L${f1(cx + 6)} ${cy}L${f1(r[0])} ${f1(r[1])}Q${cx} ${f1(r[1] - 8)} ${f1(l[0])} ${f1(l[1])}Z"/>`;
    })();
    const shrink = p > 0.15 ? arrow(cx - 46, cy - 52, cx - 14, cy - 52, 9) + arrow(cx + 46, cy - 52, cx + 14, cy - 52, 9) : '';
    return card(110, 70, 420, 200) + ghost + plate(-1, th, 'fp-steel') + plate(1, th, 'fp-steel') + weld + shrink
      + T(320, 250, tx('na het afkoelen', 'after cooling'), 19);
  }
  function cardsSvg() {
    const words = EN ? ['strict', 'normal', 'light'] : ['streng', 'normaal', 'licht'];
    let out = T(320, 56, 'ISO 5817', 24, 'middle', 'fp-big');
    ['B', 'C', 'D'].forEach((q, i) => {
      const x = 66 + i * 176;
      out += `<rect class="fp-card" x="${x}" y="78" width="156" height="230" rx="12"/>`;
      out += T(x + 78, 158, q, 64, 'middle', 'fp-big');
      out += T(x + 78, 198, words[i], 21);
      out += `<rect class="fp-bar" x="${x + 22}" y="232" width="112" height="22" rx="4"/><circle class="fp-pore" cx="${x + 78}" cy="243" r="${3 + 2.5 * i}"/>`;
      out += T(x + 78, 286, tx('grootste porie', 'largest pore'), 19, 'middle', 'fp-small');
    });
    return out;
  }
  function speedSvg(kb, p) {
    const B = C.BOOM;
    const bx = 250;
    const sc = 0.66;
    let base = card(40, 26, 560, 150);
    base += T(60, 76, `LMB ${B.wps} mm/min`.replace('LMB', tx('LMB', 'WPS')), 20, 'start');
    base += `<rect class="fp-bar" x="${bx}" y="${84}" width="${f1(B.wps * sc)}" height="20" rx="4"/>`;
    const g = kb >= 2 ? (kb === 2 ? span(p, 0.05, 0.5) : 1) : 0;
    const row = T(60, 136, `${tx('gemeten', 'measured')} ${B.real} mm/min`, 20, 'start') + `<rect class="fp-bar" x="${bx}" y="144" width="${f1(lerp(B.wps, B.real, g) * sc)}" height="20" rx="4"/><rect class="fp-fill" x="${f1(bx + B.wps * sc)}" y="144" width="${f1(Math.max(0, (lerp(B.wps, B.real, g) - B.wps) * sc))}" height="20"/>`;
    let heat = '';
    if (kb === 3) {
      const h = lerp(1, B.wps / B.real, span(p, 0.05, 0.5));
      heat = card(40, 196, 270, 170) + T(60, 236, tx('warmte per mm', 'heat per mm'), 20, 'start')
        + `<rect class="fp-dash" x="60" y="256" width="220" height="30" rx="4"/><rect class="fp-bar" x="60" y="256" width="${f1(220 * h)}" height="30" rx="4"/>`
        + T(60, 330, `−${num(Math.round((1 - h) * 100))}%`, 30, 'start', 'fp-big');
    }
    return { base, row, heat };
  }
  function peelSvg(p) {
    let out = card(50, 30, 540, 330);
    // a peeled sheet: 32 buttons torn out of it, 4 rows of 8
    out += `<path class="fp-card" d="M90 90L510 90L540 250L120 250Z"/>`;
    const n = Math.round(32 * span(p, 0.05, 0.6));
    for (let i = 0; i < 32; i++) {
      const r = Math.floor(i / 8);
      const c = i % 8;
      const x = 128 + c * 48 + r * 7.5;
      const y = 116 + r * 38;
      out += `<circle class="${i < n ? 'fp-cell-on' : 'fp-cell'}" cx="${f1(x)}" cy="${f1(y)}" r="${i < n ? 9 : 6}"/>`;
    }
    // the caliper on the first button
    const cx = 128;
    out += `<rect class="fp-bar" x="${cx - 40}" y="276" width="260" height="14" rx="3"/><path class="fp-mark" style="stroke-width:3" d="M${cx - 9} 262L${cx - 9} 290M${cx + 9} 262L${cx + 9} 290"/>`;
    out += T(cx + 240, 286, '≥ 4,4 mm'.replace(',', EN ? '.' : ','), 22, 'start', 'fp-big');
    out += T(320, 336, tx('peeltest: 32 punten', 'peel test: 32 welds'), 19);
    return out;
  }
  function docSvg(x, head, sub, extra) {
    let out = `<rect class="fp-card" x="${x}" y="34" width="230" height="320" rx="8"/>`;
    out += T(x + 115, 80, head, 30, 'middle', 'fp-big') + T(x + 115, 110, sub, 19, 'middle', 'fp-small');
    for (let i = 0; i < 6; i++) out += `<path class="fp-rule" d="M${x + 24} ${140 + i * 22}L${x + 24 + (i % 3 === 2 ? 120 : 182)} ${140 + i * 22}"/>`;
    return out + extra;
  }
  function docsSvg(p) {
    const lmb = docSvg(70, tx('LMB', 'WPS'), tx('het recept', 'the recipe'), '');
    const stamp = p > 0.45 ? `<circle class="fp-mark" style="stroke-width:3" cx="${340 + 175}" cy="300" r="28"/><path class="fp-mark" style="stroke-width:4" d="M${340 + 161} 300L${340 + 172} 312L${340 + 191} 288"/>` : '';
    const piece = `<path class="fp-steel" d="M${364} 290L${420} 290L${420} 316L${364} 316Z"/><path class="fp-steel" d="M${430} 290L${486} 290L${486} 316L${430} 316Z"/><path class="fp-weld" d="M418 316L432 316L440 290L410 290Z"/>`;
    const lmk = docSvg(340, tx('LMK', 'WPQR'), tx('het bewijs', 'the proof'), piece + stamp);
    return { lmb, lmk };
  }
  function excSvg(p) {
    let l = '';
    let r = T(320, 48, 'EN 1090-2', 20, 'middle', 'fp-small');
    C.EXC.forEach(([e, q], i) => {
      const y = 76 + i * 92;
      const on = i === 1 && p > 0.35;
      l += `<rect class="fp-card" x="120" y="${y}" width="170" height="64" rx="10" style="${on ? 'stroke-width:2.4' : ''}"/>` + T(205, y + 42, e, 28, 'middle', 'fp-big');
      r += arrow(306, y + 32, 380, y + 32, 10) + `<rect class="fp-card" x="398" y="${y}" width="72" height="64" rx="10" style="${on ? 'stroke-width:2.4' : ''}"/>` + T(434, y + 45, q, 36, 'middle', 'fp-big');
    });
    return { l, r };
  }
  function gridSvg(p) {
    let out = card(56, 22, 528, 356);
    const pick = new Set();
    for (let c = 0; c < 16; c++) pick.add(((c * 7) % 10) * 16 + c);
    const rej = [3 * 1 + ((3 * 7) % 10) * 16, 11 + ((11 * 7) % 10) * 16];
    const show = span(p, 0.25, 0.6);
    for (let i = 0; i < 160; i++) {
      const r = Math.floor(i / 16);
      const c = i % 16;
      const x = 80 + c * 30;
      const y = 44 + r * 30;
      const on = pick.has(i) && show > c / 16;
      out += `<rect class="${on ? 'fp-cell-on' : 'fp-cell'}" x="${x}" y="${y}" width="24" height="24" rx="3"/>`;
      if (on && rej.includes(i) && p > 0.7) out += `<path class="fp-mark" style="stroke-width:3" d="M${x + 4} ${y + 4}L${x + 20} ${y + 20}M${x + 20} ${y + 4}L${x + 4} ${y + 20}"/>`;
    }
    out += T(320, 366, `160 → 16 ${tx('lassen', 'welds')}`, 20);
    return out;
  }
  function certSvg() {
    let out = `<rect class="fp-card" x="130" y="34" width="380" height="330" rx="10"/><rect class="fp-frame" x="142" y="46" width="356" height="306" rx="6"/>`;
    out += T(320, 96, 'ISO 9712', 30, 'middle', 'fp-big');
    for (let i = 0; i < 3; i++) out += `<path class="fp-rule" d="M180 ${126 + i * 20}L${i === 2 ? 360 : 460} ${126 + i * 20}"/>`;
    const lab = EN ? ['tests, assesses', 'procedures'] : ['test, beoordeelt', 'procedures'];
    [[230, '2'], [410, '3']].forEach(([x, n], i) => {
      out += `<circle class="fp-card" cx="${x}" cy="248" r="38" style="stroke-width:2"/>` + T(x, 264, n, 44, 'middle', 'fp-big') + T(x, 318, lab[i], 19);
    });
    return out;
  }
  function rateSvg(p) {
    const R = C.RCA;
    const w = 540;
    const g = span(p, 0.05, 0.45);
    let out = card(30, 40, 580, 320);
    out += T(50, 104, `${num(R.tested / 1000, 3).replace(/[.,]?0+$/, '')} m`.replace(/^2[.,]4/, EN ? '2,400' : '2.400'), 22, 'start', 'fp-big');
    out += T(50, 128, tx('getest', 'tested'), 19, 'start', 'fp-small');
    out += `<rect class="fp-bar" x="50" y="146" width="${f1(w * g)}" height="40" rx="4"/>`;
    const sw = (w * R.repaired) / R.tested;
    const body = p > 0.4 ? `<rect class="fp-cell-on" x="${f1(50 + w - sw)}" y="146" width="${f1(sw)}" height="40"/>` + T(50 + w, 216, `${R.repaired} m ${tx('gerepareerd', 'repaired')}`, 19, 'end') : '';
    const pct = p > 0.55 ? T(320, 310, `${num((100 * R.repaired) / R.tested, 1)}%`, 56, 'middle', 'fp-big') : '';
    return { out: out + pct, body };
  }
  function paretoSvg(kb, p) {
    const R = C.RCA;
    const x0 = 100;
    const y0 = 300;
    const sc = 5;
    const bars = [[R.lof, '401', tx('bindingsfout', 'lack of fusion')], [R.undercut, '5011', tx('randinkarteling', 'undercut')], [R.pores, '2011', tx('poriën', 'pores')]];
    let base = card(30, 22, 580, 370) + `<path class="fp-mark" d="M${x0} 50L${x0} ${y0}L590 ${y0}"/>` + T(x0 - 10, 64, 'm', 19, 'end', 'fp-small');
    const g = kb === 0 ? 0 : span(kb === 1 ? p : 1, 0.05, 0.4);
    let codes = '';
    bars.forEach(([v, code, name], i) => {
      const x = 130 + i * 150;
      const h = v * sc * g;
      base += `<rect class="fp-bar" x="${x}" y="${f1(y0 - h)}" width="110" height="${f1(h)}"/>`;
      if (g > 0.95) base += T(x + 55, y0 - h - 10, `${v} m`, 20) + T(x + 55, y0 + 52, name, 19, 'middle', 'fp-small');
      codes += T(x + 55, y0 + 28, code, 21, 'middle', 'fp-big');
    });
    let vert = '';
    if (kb === 2) {
      const h = R.vertical * sc * span(p, 0.1, 0.5);
      vert = `<rect class="fp-cell-on" x="130" y="${f1(y0 - h)}" width="110" height="${f1(h)}"/>`;
      if (p > 0.45) vert += T(260, 150, `${R.vertical} m ${tx('verticaal opgaand', 'vertical-up')}`, 20, 'start') + `<path class="fp-mark" d="M256 144L240 ${f1(y0 - h + 30)}"/>`;
    }
    return { base, codes: g > 0 ? codes : '', vert };
  }
  function ovenSvg(p) {
    let out = card(30, 40, 270, 310);
    out += `<rect class="fp-bar" x="56" y="80" width="218" height="236" rx="6"/><rect class="fp-disp" x="72" y="96" width="186" height="204" rx="4"/>`;
    for (let i = 0; i < 6; i++) out += `<path class="fp-mark" d="M${84 + i * 32} 110L${84 + i * 32} 140"/>`;
    // the welded frame inside
    out += `<path class="fp-steel" d="M96 270L234 270L234 256L96 256Z"/><path class="fp-steel" d="M158 256L172 256L172 176L158 176Z"/>`;
    const tc = (t) => (t < 0.35 ? t / 0.35 : t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45);
    const glow = tc(span(p, 0, 1));
    out += `<rect class="fp-hotf" x="72" y="96" width="186" height="204" rx="4" style="fill:var(--fp-hot);opacity:${(0.25 * glow).toFixed(2)}"/>`;
    out += card(320, 40, 290, 310);
    out += `<path class="fp-mark" d="M350 70L350 300L590 300"/>` + T(360, 80, '°C', 19, 'start', 'fp-small') + T(588, 330, tx('tijd →', 'time →'), 19, 'end', 'fp-small');
    const pts = [];
    const n = Math.round(60 * clamp(p * 1.05, 0, 1));
    for (let i = 0; i <= n; i++) { const t = i / 60; pts.push([360 + t * 220, 290 - tc(t) * 180]); }
    if (pts.length > 1) out += `<path class="fp-sig" d="${pth(pts)}"/><circle class="fp-ink" cx="${f1(pts[pts.length - 1][0])}" cy="${f1(pts[pts.length - 1][1])}" r="5"/>`;
    return out;
  }
  function filletSvg(p) {
    let out = card(40, 30, 560, 340);
    const sc = 26;
    const tri = (cx, a, cls) => {
      const leg = a * Math.SQRT2 * sc;
      return `<path class="${cls}" d="M${cx} 300L${f1(cx + leg)} 300L${cx} ${f1(300 - leg)}Z"/>`;
    };
    const plates = (cx) => `<path class="fp-steel" d="M${cx - 18} 300L${cx + 210} 300L${cx + 210} 318L${cx - 18} 318Z"/><path class="fp-steel" d="M${cx - 18} 300L${cx} 300L${cx} 80L${cx - 18} 80Z"/>`;
    const throat = (cx, a) => { const leg = a * Math.SQRT2 * sc; return `<path class="fp-mark" style="stroke-width:2" d="M${cx} 300L${f1(cx + leg / 2)} ${f1(300 - leg / 2)}"/>`; };
    out += plates(80) + tri(80, 4, 'fp-weld') + throat(80, 4) + T(150, 356, tx('keel 4', 'throat 4'), 20);
    const g = span(p, 0.1, 0.5);
    out += plates(350) + tri(350, lerp(4, 5, g), 'fp-weld') + `<path class="fp-dash" d="M350 300L${f1(350 + 4 * Math.SQRT2 * sc)} 300L350 ${f1(300 - 4 * Math.SQRT2 * sc)}Z"/>` + throat(350, lerp(4, 5, g)) + T(430, 356, tx('keel 5', 'throat 5'), 20);
    return out;
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['scrim', 'macro', 'dist', 'cards', 'speed', 'loop', 'peel', 'docs', 'ascan', 'exc', 'grid', 'cert', 'rate', 'pareto', 'oven', 'fillet'];
  function hudOnly(list) { for (const k of HUD) show(E[k], list.includes(k)); }
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    introCamera(E.world, C.KEYS[si], d, u, W, H);
    const clockS = u * C.dur[si];
    // defaults: the bench at rest
    let probeA = C.PROBE.a0;
    let yokeDz = 60;
    let heat = null;
    show(E.yoke, false);
    show(E.heatT, false);
    set(E.flame, '');
    set(E.filmDye, '');
    set(E.filmDev, '');
    set(E.filmInd, '');
    set(E.spray, '');
    set(E.powder, '');
    set(E.mProbe, '');
    set(E.mBeam, '');
    set(E.mResid, '');
    set(E.mText, '');
    let hud = [];

    if (si === 0) {
      if (kb === 1 && p > 0.3) {
        hud = ['scrim', 'macro'];
        macroAt(70, 22, 1);
        set(E.mPores, '');
        set(E.mLof, '');
        set(E.mCrack, '');
        set(E.mText, T(24, 34, tx('lasmetaal', 'weld metal'), 20, 'start') + `<path class="fp-mark" d="M110 40L${f1(mX(-2))} ${f1(mZ(14))}"/>`
          + T(476, 34, tx('warmtebeïnvloede zone', 'heat-affected zone'), 19, 'end') + `<path class="fp-mark" d="M400 40L${f1(mX(C.FT + 2))} ${f1(mZ(18))}"/>`);
      }
      if (kb === 2) probeA = lerp(C.PROBE.a0, 32, span(p, 0.2, 0.8));
    }
    if (si === 1) {
      if (kb <= 2) {
        hud = ['scrim', 'macro'];
        macroAt(70, 60, 1);
        set(E.mPores, poresSvg(kb === 0 ? Math.round(1 + 5 * span(p, 0, 0.6)) : 6));
        set(E.mLof, kb >= 1 ? lofSvg : '');
        set(E.mCrack, kb === 2 ? crackSvg(span(p, 0.15, 0.75)) : '');
        op(E.mLof, kb >= 1 ? (kb === 1 ? span(p, 0, 0.25) : 1) : 0);
        set(E.mText, T(250, 196, [tx('poriën', 'pores'), tx('bindingsfout op de flank', 'lack of fusion on the side wall'), tx('scheur naast de las', 'crack beside the weld')][kb], 20));
      } else {
        hud = ['scrim', 'dist'];
        set(E.distBody, distSvg(span(p, 0.05, 0.7)));
      }
    }
    if (si === 2) {
      if (kb === 0) {
        show(E.heatT, true);
        const hx = lerp(-60, -6, span(p, 0.05, 0.9)) + Math.sin(clockS * 3) * 3;
        heat = [hx, 26, PT + 16];
        move(E.heatT, heat);
        set(E.flame, flameSvg(heat, clockS));
      } else if (kb === 1) {
        hud = ['scrim', 'cards'];
        set(E.cardsBody, cardsSvg());
      } else {
        hud = kb === 3 ? ['scrim', 'speed', 'loop'] : ['scrim', 'speed'];
        const s = speedSvg(kb, p);
        set(E.speedBase, s.base);
        set(E.speedRow, s.row);
        set(E.heatBody, s.heat);
        if (kb === 3) set(E.loopBody, card(330, 196, 270, 170) + loopSvg(465, 288, (clockS * 0.25) % 1, `${num(C.BOOM.repairH, 1)} h`));
      }
    }
    if (si === 3) {
      if (kb === 1) {
        const dye = span(p, 0.2, 0.7);
        set(E.spray, mistSvg(1 - span(p, 0.6, 0.8), clockS, CR.x0 - 2, CR.x1 + 2));
        set(E.filmDye, dye > 0 ? `<path class="fp-dyef" style="opacity:${(0.85 * dye).toFixed(2)}" d="${filmRect(CR.x0 - 4, CR.x1 + 4, CR.y - 0.4, CR.y + 16)}"/>` : '');
      }
      if (kb === 2) {
        const wipe = span(p, 0, 0.25);
        const dev = span(p, 0.25, 0.5);
        const bleed = span(p, 0.5, 0.85);
        if (wipe < 1) set(E.filmDye, `<path class="fp-dyef" style="opacity:${(0.85 * (1 - wipe)).toFixed(2)}" d="${filmRect(CR.x0 - 4, CR.x1 + 4, CR.y - 0.4, CR.y + 16)}"/>`);
        set(E.spray, dev > 0 && dev < 1 ? mistSvg(1, clockS, CR.x0 - 2, CR.x1 + 2) : '');
        set(E.filmDev, dev > 0 ? `<path class="fp-devf" style="opacity:${(0.95 * dev).toFixed(2)}" d="${filmRect(CR.x0 - 4, CR.x1 + 4, CR.y - 0.4, CR.y + 16)}"/>` : '');
        if (bleed > 0) set(E.filmInd, `<path class="fp-dyel" style="stroke-width:${f1(1.5 + 2.5 * bleed)}" d="${onZ(PT + 0.12, C.CRACK_PTS, false)}"/>`);
      }
    }
    if (si === 4) {
      if (kb === 0) probeA = lerp(56, C.PROBE_HIT, span(p, 0.05, 0.6));
      if (kb === 1) { hud = ['scrim', 'peel']; set(E.peelBody, peelSvg(p)); }
      if (kb === 2) {
        hud = ['scrim', 'docs'];
        const dd = docsSvg(p);
        set(E.lmbBody, dd.lmb);
        set(E.lmkBody, dd.lmk);
      }
    }
    if (si === 5) {
      hud = ['scrim', 'macro', 'ascan'];
      macroAt(6, 70, 0.76);
      set(E.mPores, '');
      set(E.mLof, lofSvg);
      op(E.mLof, 1);
      set(E.mCrack, '');
      const a = kb === 0 ? lerp(34, C.PROBE_HIT, span(p, 0.1, 0.75)) : C.PROBE_HIT + 4 * Math.sin(p * TAU * 1.25);
      set(E.mProbe, probeSvg(a));
      const b = beamSvg(a, 60);
      let beams = b.svg;
      if (kb === 0 && p < 0.55) {
        const fade = 1 - span(p, 0.4, 0.55);
        beams += `<g style="opacity:${fade.toFixed(2)}">${beamSvg(a, 45, 'fp-dash').svg}${beamSvg(a, 70, 'fp-dash').svg}</g>`;
      }
      set(E.mBeam, beams);
      set(E.mText, T(mX(a) - 10, mZ(20) - 14, '60°', 26, 'end'));
      attr(E.ascan, 'transform', 'translate(404 40)');
      set(E.ascanBody, ascanSvg(b.hit ? echoAmp(a) : 0));
    }
    if (si === 6) {
      if (kb === 0) {
        hud = ['scrim', 'exc'];
        const ex = excSvg(p);
        set(E.excL, ex.l);
        set(E.excR, ex.r);
      }
      if (kb === 1) { hud = ['scrim', 'grid']; set(E.gridBody, gridSvg(p)); }
      if (kb === 2) {
        show(E.yoke, true);
        yokeDz = 40 * (1 - span(p, 0.02, 0.3));
        const g = span(p, 0.3, 0.9);
        const dots = [];
        for (let i = 0; i < 90; i++) {
          const f = seeded(i);
          const x = lerp(CR.x0 - 4, CR.x1 + 4, seeded(i + 30));
          const y0 = CR.y + (seeded(i + 60) - 0.5) * 22;
          const onCrack = x > CR.x0 && x < CR.x1 && f < 0.7;
          const y = onCrack ? lerp(y0, CR.y, g) : y0;
          const [px, py] = at([x, y, PT + 0.2]);
          dots.push(`<circle class="fp-powder" cx="${f1(px)}" cy="${f1(py)}" r="${onCrack ? f1(0.5 + 0.4 * g) : '0.45'}"/>`);
        }
        set(E.powder, dots.join(''));
      }
      if (kb === 3) { hud = ['scrim', 'cert']; set(E.certBody, certSvg()); }
    }
    if (si === 7) {
      if (kb === 0) {
        hud = ['scrim', 'rate'];
        const r = rateSvg(p);
        set(E.rateBody, r.out + r.body);
      } else {
        hud = ['scrim', 'pareto'];
        const pa = paretoSvg(kb, p);
        set(E.paretoBase, pa.base);
        set(E.paretoCodes, pa.codes);
        set(E.paretoVert, pa.vert);
      }
    }
    if (si === 8) {
      if (kb === 0) {
        hud = ['scrim', 'macro'];
        macroAt(70, 60, 1);
        set(E.mPores, '');
        set(E.mLof, '');
        set(E.mCrack, '');
        const g = span(p, 0.1, 0.5);
        const zA = mZ(18);
        const zB = mZ(6);
        let ar = '';
        if (g > 0) {
          ar += arrow(mX(-14), zA, mX(-14) + 34 * g, zA, 9) + arrow(mX(14), zA, mX(14) - 34 * g, zA, 9);
          ar += arrow(mX(-20), zB, mX(-20) - 40 * g, zB, 9) + arrow(mX(20), zB, mX(20) + 40 * g, zB, 9);
        }
        set(E.mResid, ar);
        set(E.mText, T(250, 196, tx('de las krimpt, de plaat houdt tegen', 'the weld shrinks, the plate holds it back'), 19));
      }
      if (kb === 1) { hud = ['scrim', 'oven']; set(E.ovenBody, ovenSvg(p)); }
      if (kb === 2) { hud = ['scrim', 'fillet']; set(E.filletBody, filletSvg(p)); }
    }

    placeProbe(probeA);
    if (si === 6) move(E.yoke, [0, 0, yokeDz]);
    hudOnly(hud);
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
