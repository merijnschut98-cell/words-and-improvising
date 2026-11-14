// The stage of the film "Een bout aandraaien / Tightening a bolt": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope), a preamble from build.mjs that defines P (projection),
// C (world constants, beat cameras), W and H, and the kit's audio warp.
//
// Each scene is a row of beats; the beat on screen (and how far through it)
// comes from the caption beat starts, so a move lands on the line that names
// it. The bench with the cut-open joint is the world (moved by one camera per
// beat); the cards over it (the joint's section, the charts) are drawn in stage
// space.
/* global P, C, W, H, iso, pathOf, extrude, solidSvg, lineSvg, translateAlong, span, beatStarts, warpU, introBeat, introCamera */
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
  const attr = (e, name, v) => { if (e['__' + name] !== v) { e.setAttribute(name, v); e['__' + name] = v; } };
  const move = (e, by) => attr(e, 'transform', translateAlong(P, by));
  const place = (e, x, y, s = 1) => attr(e, 'transform', `translate(${f1(x)} ${f1(y)}) scale(${s})`);
  const num = (v, dec = 0) => { const s = v.toFixed(dec); return EN ? s : s.replace('.', ','); };
  const T = (x, y, text, size = 20, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
  const card = (x, y, w, h, r = 12) => `<rect class="fp-hud-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fp-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const arrow = (x0, y0, x1, y1, head = 9, cls = 'fp-mark', wid = 2.2) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    return `<path class="${cls}" style="stroke-width:${wid}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}M${f1(x1 - ux * head - uy * head * 0.55)} ${f1(y1 - uy * head + ux * head * 0.55)}L${f1(x1)} ${f1(y1)}L${f1(x1 - ux * head + uy * head * 0.55)} ${f1(y1 - uy * head - ux * head * 0.55)}"/>`;
  };
  const B = C.B;

  // ------------------------------------------------------------ the turning hex parts of the world (head and nut)
  const hexRing = (r, a) => Array.from({ length: 6 }, (_, i) => [r * Math.cos(a + (i * Math.PI) / 3), r * Math.sin(a + (i * Math.PI) / 3)]);
  function hexSvg(r, z0, h, a, chamfer) {
    const body = solidSvg(extrude(hexRing(r, a), z0, h, P, { convex: true, bevel: 0.7 }), { tone: 'hi', crease: 'lo' });
    const top = [];
    for (let i = 0; i <= 30; i++) { const t = (i / 30) * TAU; top.push(at([chamfer * Math.cos(t), chamfer * Math.sin(t), z0 + h])); }
    return body + lineSvg(pth(top, true), { tone: 'lo' });
  }
  // the paint mark: across the nut's top face and down one flat onto the washer
  function paintSvg(a) {
    const r = B.nut * Math.cos(Math.PI / 6);
    const c = Math.cos(a);
    const s = Math.sin(a);
    const top = [[0, 0, B.zW0 - 0.05], [r * c, r * s, B.zW0 - 0.05]].map(at);
    // the mark on the nut's flat (facing a), drawn only while that flat faces the viewer
    const facing = c * 0.55 + s * 0.83 > 0.1;
    const side = facing ? pth([[r * c, r * s, B.zW0], [r * c, r * s, B.zNut0 + 1]].map(at)) : '';
    // the washer's part stays where it was painted (a = 0.9)
    const wa = 0.9;
    const wash = pth([[B.wash * Math.cos(wa) * 0.62, B.wash * Math.sin(wa) * 0.62, B.zW0], [B.wash * Math.cos(wa), B.wash * Math.sin(wa), B.zW0], [B.wash * Math.cos(wa), B.wash * Math.sin(wa), B.zP0 - 0.2]].map(at));
    return `<path class="fp-paintl" d="${pth(top)}${side}"/><path class="fp-paintl" d="${wash}"/>`;
  }

  // ------------------------------------------------------------ the section card (local 300 × 340): the joint cut open, flat and large
  const MK = 3.2;
  const mx = (x) => 150 + x * MK;
  const mz = (z) => 316 - (z - 18) * MK;
  const rect = (x0, z0, x1, z1, cls) => `<path class="${cls}" d="M${f1(mx(x0))} ${f1(mz(z0))}L${f1(mx(x1))} ${f1(mz(z0))}L${f1(mx(x1))} ${f1(mz(z1))}L${f1(mx(x0))} ${f1(mz(z1))}Z"/>`;
  function hatchIn(x0, z0, x1, z1) {
    const out = [];
    const X0 = mx(x0);
    const X1 = mx(x1);
    const Y0 = mz(z1);
    const Y1 = mz(z0);
    for (let c = X0 - (Y1 - Y0); c < X1; c += 9) {
      const a = Math.max(X0, c);
      const b = Math.min(X1, c + (Y1 - Y0));
      if (b - a > 1) out.push(`M${f1(a)} ${f1(Y1 - (a - c))}L${f1(b)} ${f1(Y1 - (b - c))}`);
    }
    return `<path class="fp-hatch" d="${out.join('')}"/>`;
  }
  const sectBase = card(0, 0, 300, 340);
  const sectPlates = (() => {
    let s = '';
    for (const [z0, z1] of [[B.zP0, B.zP1], [B.zP1, B.zP2]]) {
      for (const [x0, x1] of [[-42, -B.rHole], [B.rHole, 42]]) s += rect(x0, z0, x1, z1, 'fp-cut') + hatchIn(x0, z0, x1, z1);
    }
    return s;
  })();
  // the bolt, head and nut as a side view; e stretches the drawn spring
  function sectBolt(e) {
    let s = '';
    // washers
    for (const [z0, z1] of [[B.zP2, B.zW1], [B.zW0, B.zP0]]) for (const [x0, x1] of [[-B.wash, -B.rHole], [B.rHole, B.wash]]) s += rect(x0, z0, x1, z1, 'fp-cut');
    // shank with thread teeth on both edges from the end up to zThread
    const left = [];
    const right = [];
    for (let z = B.zEnd + 1.2; z <= B.zThread; z += 0.875) {
      const k = Math.round((z - B.zEnd) / 0.875) % 2;
      const r = k ? B.r : B.r - 0.95;
      left.push([mx(-r), mz(z)]);
      right.push([mx(r), mz(z)]);
    }
    // the plain shank runs straight up from the last full crest
    left.push([mx(-B.r), mz(B.zThread)]);
    right.push([mx(B.r), mz(B.zThread)]);
    const outline = [[mx(-B.r + 1.2), mz(B.zEnd)], ...left, [mx(-B.r), mz(B.zW1)], [mx(B.r), mz(B.zW1)], ...right.reverse(), [mx(B.r - 1.2), mz(B.zEnd)]];
    s += `<path class="fp-boltf" d="${pth(outline, true)}"/>`;
    // head and nut, seen across corners: the hex's three faces
    const hexSide = (z0, z1) => rect(-B.head, z0, B.head, z1, 'fp-boltf') + `<path class="fp-mark" d="M${f1(mx(-B.head / 2))} ${f1(mz(z0))}L${f1(mx(-B.head / 2))} ${f1(mz(z1))}M${f1(mx(B.head / 2))} ${f1(mz(z0))}L${f1(mx(B.head / 2))} ${f1(mz(z1))}"/>`;
    s += hexSide(B.zW1, B.zHead) + hexSide(B.zNut0, B.zW0);
    // the spring drawn inside the shank: it stretches with e
    if (e > 0) {
      const za = B.zNut0 + 2;
      const zb = B.zW1 + 3 + 3 * e;
      const n = 12;
      const pts = [];
      for (let i = 0; i <= n * 2; i++) pts.push([mx(i === 0 || i === n * 2 ? 0 : i % 2 ? -3 + e : 3 - e), mz(za + ((zb - za) * i) / (n * 2))]);
      s += `<path class="fp-sig" d="${pth(pts)}"/>`;
    }
    return s;
  }
  function sectClamp(a) {
    if (a <= 0) return '';
    const L = 24 * a;
    let s = '';
    for (const x of [-30, 30]) {
      s += arrow(mx(x), mz(B.zP2) - 6 - L, mx(x), mz(B.zP2) - 6, 9) + arrow(mx(x), mz(B.zP0) + 6 + L, mx(x), mz(B.zP0) + 6, 9);
    }
    s += arrow(mx(0), mz(B.zHead) - 4, mx(0), mz(B.zHead) - 4 - L, 9) + arrow(mx(0), mz(B.zEnd) + 4, mx(0), mz(B.zEnd) + 4 + L * 0.6, 9);
    return s;
  }
  // the stress area: a cut through the thread, the root circle filled
  function sectStress() {
    const cx = 236;
    const cy = 252;
    const R = 34;
    const r = 27;
    const out = [];
    for (let i = 0; i <= 72; i++) { const t = (i / 72) * TAU; const rr = i % 2 ? R : R - 6; out.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]); }
    return `<circle class="fp-card" cx="${cx}" cy="${cy}" r="${R + 8}"/><path class="fp-boltf" d="${pth(out, true)}"/><circle class="fp-cell-on" cx="${cx}" cy="${cy}" r="${r}"/>`
      + `<path class="fp-mark" d="M${f1(mx(B.r))} ${f1(mz(36))}L${f1(cx - R - 8)} ${f1(cy)}"/>` + T(cx, cy + 66, `${num(C.AS.M12, 1)} mm²`, 20, 'middle', 'fp-big');
  }
  function sectLock(g) {
    let s = '';
    const n = Math.round(10 * g);
    for (let i = 0; i < n; i++) {
      const z = B.zNut0 - 1 + i * 1.6;
      s += `<ellipse class="fp-glue" cx="${f1(mx(i % 2 ? -B.r + 0.3 : B.r - 0.3))}" cy="${f1(mz(z))}" rx="4" ry="3"/>`;
    }
    return s;
  }
  // settling: an inset under the head, rough peaks that flatten
  function sectSettle(fl) {
    const cx = 236;
    const cy = 80;
    let peaks = '';
    const pts = [];
    for (let i = 0; i <= 16; i++) {
      const x = cx - 44 + i * 5.5;
      const h = (i % 2 ? 9 : 0) * (1 - 0.7 * fl);
      pts.push([x, cy + 10 - h]);
    }
    peaks = `<path class="fp-boltf" d="${pth([[cx - 44, cy - 24], [cx + 44, cy - 24], [cx + 44, cy - 8 + 9 * 0.7 * fl], [cx - 44, cy - 8 + 9 * 0.7 * fl]], true)}"/>`
      + `<path class="fp-cut" d="${pth([...pts, [cx + 44, cy + 30], [cx - 44, cy + 30]], true)}"/>`;
    return `<circle class="fp-card" cx="${cx}" cy="${cy}" r="52"/>${peaks}<path class="fp-mark" d="M${f1(mx(B.wash))} ${f1(mz(B.zP2))}L${f1(cx - 52)} ${f1(cy + 8)}"/>`
      + T(cx, cy + 76, tx('platgedrukt', 'flattened'), 19, 'middle', 'fp-small');
  }
  // the ultrasonic gauge on the head, a pulse down the bolt and back
  function sectElong(p) {
    const x = mx(0);
    const y0 = mz(B.zHead);
    const y1 = mz(B.zEnd);
    let s = `<rect class="fp-bx" x="${f1(x - 14)}" y="${f1(y0 - 22)}" width="28" height="22" rx="4"/><path class="fp-mark" d="M${f1(x)} ${f1(y0 - 22)}L${f1(x)} ${f1(y0 - 44)}L${f1(x + 60)} ${f1(y0 - 44)}"/>`;
    const ph = (p * 2.2) % 1;
    const yy = ph < 0.5 ? lerp(y0, y1, ph * 2) : lerp(y1, y0, (ph - 0.5) * 2);
    for (let i = -1; i <= 1; i++) s += `<path class="fp-sig" d="M${f1(x - 5)} ${f1(yy + i * 6)}L${f1(x + 5)} ${f1(yy + i * 6)}"/>`;
    s += arrow(mx(-14), (y0 + y1) / 2, mx(-14), y0 + 4, 8) + arrow(mx(-14), (y0 + y1) / 2, mx(-14), y1 - 4, 8) + `<rect class="fp-hud-bg" x="14" y="12" width="84" height="32" rx="6"/>` + T(56, 35, 'L + ΔL', 20, 'middle', 'fp-big');
    return s;
  }
  function sectGrip() {
    const x = mx(30);
    const y0 = mz(B.zW1);
    const y1 = mz(B.zW0);
    return arrow(x, (y0 + y1) / 2, x, y0 + 1, 8) + arrow(x, (y0 + y1) / 2, x, y1 - 1, 8)
      + `<rect class="fp-hud-bg" x="${f1(x + 6)}" y="${f1((y0 + y1) / 2 - 15)}" width="94" height="30" rx="6"/>` + T(x + 12, (y0 + y1) / 2 + 7, tx('klemlengte', 'clamp length'), 19, 'start', 'fp-small');
  }

  // ------------------------------------------------------------ the cards, one function each (stage space 640 × 400)
  function headCard(cls, kb, p) {
    const cx = 470;
    const cy = 116;
    const R = 66;
    const ring = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; ring.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    const head = card(330, 18, 290, 364) + `<path class="fp-card" d="${pth(ring, true)}"/><circle class="fp-mark" cx="${cx}" cy="${cy}" r="${R * 0.84}" style="fill:none"/>` + T(cx, cy + 16, cls, 44, 'middle', 'fp-big');
    // bars: tensile and yield, out of 1.000 MPa
    const v = C.CLASS[cls];
    const x0 = 352;
    const w = 180;
    const gr = span(p, 0.05, 0.5);
    const rm = kb >= 1 ? (kb === 1 ? gr : 1) : 0;
    const re = kb >= 2 ? (kb === 2 ? gr : 1) : 0;
    let bars = '';
    bars += T(x0, 236, tx('treksterkte', 'tensile'), 19, 'start', 'fp-small') + `<rect class="fp-bx" x="${x0}" y="246" width="${f1((w * v.rm * rm) / 1000)}" height="24" rx="4"/>`;
    if (rm > 0.95) bars += T(x0 + 252, 266, `${v.rm === 1000 ? (EN ? '1,000' : '1.000') : v.rm}`, 20, 'end', 'fp-big');
    bars += T(x0, 304, tx('vloeigrens', 'yield'), 19, 'start', 'fp-small') + `<rect class="fp-fill" x="${x0}" y="314" width="${f1((w * v.re * re) / 1000)}" height="24" rx="4"/><rect class="fp-bx" x="${x0}" y="314" width="${f1((w * v.re * re) / 1000)}" height="24" rx="4" style="fill:none"/>`;
    if (re > 0.95) bars += T(x0 + 252, 334, `${v.re}`, 20, 'end', 'fp-big');
    return { head, bars, text: T(600, 366, 'MPa', 19, 'end', 'fp-small') };
  }
  function pitchCard(p) {
    let s = card(40, 50, 560, 300);
    const y0 = 230;
    const Pp = 72;
    const pts = [[70, y0 + 40]];
    for (let x = 70; x <= 570; x += Pp) pts.push([x, y0 + 40], [x, y0], [x + Pp / 2, y0 - 62], [x + Pp, y0]);
    const teeth = [[70, y0 + 60], ...pts.filter(([x]) => x <= 570), [570, y0 + 60]];
    s += `<path class="fp-boltf" d="${pth(teeth, true)}"/>`;
    const a = 70 + Pp / 2 + Pp;
    const b = a + Pp;
    const g = span(p, 0.15, 0.6);
    s += `<path class="fp-dash" d="M${a} ${y0 - 62}L${a} ${y0 - 110}M${b} ${y0 - 62}L${b} ${y0 - 110}"/>`;
    if (g > 0) s += arrow(a + (b - a) / 2, y0 - 100, a + 1, y0 - 100, 8) + arrow(a + (b - a) / 2, y0 - 100, b - 1, y0 - 100, 8);
    s += T((a + b) / 2, y0 - 118, `P = ${num(1.5, 1)} mm`, 22, 'middle', 'fp-big');
    s += T(320, 330, `M10 × ${num(1.5, 1)}`, 24, 'middle', 'fp-big');
    // the nut sliding one pitch along per turn
    const nx = 380 + Pp * g;
    s += `<rect class="fp-bx" x="${f1(nx)}" y="${y0 - 80}" width="110" height="24" rx="4"/>` + T(nx + 55, y0 - 62, tx('moer', 'nut'), 19, 'middle', 'fp-small');
    return s;
  }
  function capCard(p) {
    let s = card(40, 40, 560, 320);
    const x0 = 150;
    const sc = 4.6;
    const g = span(p, 0.05, 0.5);
    const rows = [['8.8', 54], ['10.9', 76]];
    rows.forEach(([cls, v], i) => {
      const y = 100 + i * 90;
      s += T(x0 - 16, y + 28, cls, 26, 'end', 'fp-big') + `<rect class="fp-bx" x="${x0}" y="${y}" width="${f1(v * sc * g)}" height="40" rx="4"/>`;
      if (g > 0.95) s += T(x0 + v * sc + 12, y + 28, `${v} kN`, 22, 'start', 'fp-big');
    });
    s += `<path class="fp-dash" d="M${f1(x0 + 54 * sc)} 90L${f1(x0 + 54 * sc)} 290"/>`;
    if (p > 0.55) s += T(320, 326, tx('8.8 haalt 71% van 10.9 (M12)', '8.8 reaches 71% of 10.9 (M12)'), 21);
    return s;
  }
  function torqueCard(p) {
    let s = card(30, 40, 580, 320);
    const cx = 110;
    const cy = 190;
    const L = 380;
    s += `<circle class="fp-card" cx="${cx}" cy="${cy}" r="34"/><path class="fp-card" d="${pth([[cx - 18, cy - 18], [cx + 18, cy - 18], [cx + 18, cy + 18], [cx - 18, cy + 18]], true)}"/>`;
    s += `<rect class="fp-bx" x="${cx + 30}" y="${cy - 12}" width="${L - 30}" height="24" rx="8"/><rect class="fp-fill" x="${cx + L - 90}" y="${cy - 14}" width="96" height="28" rx="10"/>`;
    const g = span(p, 0.1, 0.5);
    s += arrow(cx + L - 40, cy - 90, cx + L - 40, cy - 90 + 70 * g, 11, 'fp-mark', 3) + T(cx + L - 30, cy - 96, '200 N', 22, 'start', 'fp-big');
    s += arrow(cx + L / 2, cy + 56, cx, cy + 56, 8) + arrow(cx + L / 2, cy + 56, cx + L - 40, cy + 56, 8) + T(cx + L / 2, cy + 86, '25 cm', 21);
    if (p > 0.5) s += T(560, 330, '200 × 0,25 = 50 Nm'.replace('0,25', num(0.25, 2)), 24, 'end', 'fp-big');
    return s;
  }
  function pieCard(p) {
    let s = card(40, 30, 560, 340);
    const cx = 176;
    const cy = 200;
    const R = 116;
    // friction greyed, the 10 % that stretches the bolt in the accent
    const parts = [[C.SHARE.head, tx('onder de kop', 'under the head'), 'fp-pie0'], [C.SHARE.thread, tx('in de draad', 'in the thread'), 'fp-card'], [C.SHARE.stretch, tx('rekt de bout', 'stretches the bolt'), 'fp-cell-on']];
    let a0 = -Math.PI / 2;
    const g = span(p, 0.05, 0.6);
    parts.forEach(([v, name, cls], i) => {
      const a1 = a0 + (v / 100) * TAU * g;
      const pts = [[cx, cy]];
      for (let j = 0; j <= 24; j++) { const a = a0 + ((a1 - a0) * j) / 24; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
      if (a1 - a0 > 0.01) s += `<path class="${cls}" d="${pth(pts, true)}"/>`;
      s += `<rect class="${cls}" x="316" y="${116 + i * 66}" width="26" height="26" rx="4"/>` + T(352, 136 + i * 66, `${v}% ${name}`, 21, 'start');
      a0 = a1;
    });
    return s;
  }
  // preload against torque: dry, oiled, rough; the band at 50 Nm; the yield line
  function scatterCard(p) {
    let s = card(30, 24, 580, 352);
    const x0 = 100;
    const y0 = 320;
    const sx = (t) => x0 + t * 7.6; // Nm
    const sy = (f) => y0 - f * 6.4; // kN
    s += `<path class="fp-mark" d="M${x0} 50L${x0} ${y0}L580 ${y0}"/>` + T(x0 - 10, 64, 'kN', 19, 'end', 'fp-small') + T(578, y0 + 30, 'Nm', 19, 'end', 'fp-small');
    s += `<path class="fp-dash" d="M${x0} ${f1(sy(37))}L570 ${f1(sy(37))}"/>` + T(x0 + 8, sy(37) - 8, tx('vloeigrens', 'yield'), 19, 'start', 'fp-small');
    const g = span(p, 0.05, 0.5);
    const line = (k, cls) => `<path class="${cls}" d="M${x0} ${y0}L${f1(sx(55 * g))} ${f1(sy(55 * g / (k * 10)))}"/>`;
    s += line(0.2, 'fp-sig') + line(0.155, 'fp-sig2') + line(0.26, 'fp-sig2');
    if (g > 0.95) s += T(sx(55) + 8, sy(55 / 1.55) + 6, tx('geolied', 'oiled'), 19, 'start', 'fp-small') + T(sx(55) + 8, sy(55 / 2) + 6, tx('droog', 'dry'), 19, 'start', 'fp-small') + T(sx(55) + 8, sy(55 / 2.6) + 6, tx('roestig', 'rusty'), 19, 'start', 'fp-small');
    if (p > 0.55) {
      const lo = 25 * 0.75;
      const hi = 25 * 1.25;
      s += `<rect class="fp-band" x="${f1(sx(50) - 8)}" y="${f1(sy(hi))}" width="16" height="${f1(sy(lo) - sy(hi))}"/><path class="fp-dash" d="M${f1(sx(50))} ${y0}L${f1(sx(50))} ${f1(sy(hi))}"/>`
        + T(sx(50) - 14, sy(hi) - 10, '±25%', 21, 'end', 'fp-big');
    }
    return s;
  }
  // torque against angle: run-down, snug, the angle step, and past yield
  function angleBase() {
    return card(40, 24, 560, 352) + `<path class="fp-mark" d="M90 56L90 320L580 320"/>` + T(80, 70, 'Nm', 19, 'end', 'fp-small') + T(576, 350, tx('hoek →', 'angle →'), 19, 'end', 'fp-small');
  }
  const tq = (a) => (a < 60 ? 6 + a * 0.05 : a < 220 ? 9 + (a - 60) * 0.9 : 153 + 40 * (1 - Math.exp(-(a - 220) / 30)));
  function angleCurve(upTo, snugMark) {
    const pts = [];
    for (let a = 0; a <= upTo; a += 2) pts.push([90 + a * 1.6, 320 - tq(a) * 1.4]);
    let s = pts.length > 1 ? `<path class="fp-sig" d="${pth(pts)}"/>` : '';
    if (snugMark && upTo > 100) {
      const ya = 320 - tq(100) * 1.4;
      s += `<circle class="fp-ink" cx="${f1(90 + 100 * 1.6)}" cy="${f1(ya)}" r="5"/>` + T(90 + 100 * 1.6 - 10, ya - 12, tx('laag moment', 'snug torque'), 19, 'end', 'fp-small');
      if (upTo > 180) s += arrow(90 + 100 * 1.6, 300, 90 + 180 * 1.6, 300, 8) + T(90 + 140 * 1.6, 290, tx('+ vaste hoek', '+ fixed angle'), 19, 'middle', 'fp-small');
    }
    return s;
  }
  function angleYield(stop) {
    const xa = 90 + 228 * 1.6;
    const ya = 320 - tq(228) * 1.4;
    let s = `<path class="fp-dash" d="M${f1(xa)} 320L${f1(xa)} 70"/>` + T(xa + 8, 308, tx('vloeien', 'yield'), 19, 'start', 'fp-small');
    if (stop) s += `<circle class="fp-cell-on" cx="${f1(xa)}" cy="${f1(ya)}" r="9"/>` + T(xa + 16, ya + 30, tx('stop', 'stop'), 21, 'start', 'fp-big');
    return s;
  }
  function auditCard(p) {
    let s = card(16, 30, 330, 340);
    const x0 = 60;
    const y0 = 300;
    const sc = 3.6;
    const sy = (v) => y0 - v * sc;
    s += `<path class="fp-mark" d="M${x0} 60L${x0} ${y0}L330 ${y0}"/><rect class="fp-band" x="${x0}" y="${f1(sy(55))}" width="268" height="${f1(sy(45) - sy(55))}"/><path class="fp-dash" d="M${x0} ${f1(sy(50))}L328 ${f1(sy(50))}"/>`;
    s += T(x0 - 6, sy(50) + 6, '50', 19, 'end', 'fp-small') + T(x0 - 6, 74, 'Nm', 19, 'end', 'fp-small');
    const n = Math.min(5, Math.floor(span(p, 0.05, 0.7) * 5.99));
    C.AUDIT.read.forEach((v, i) => {
      if (i >= n) return;
      const x = x0 + 14 + i * 52;
      const bad = v === 31;
      s += `<rect class="${bad ? 'fp-cell-on' : 'fp-bx'}" x="${x}" y="${f1(sy(v))}" width="38" height="${f1(y0 - sy(v))}"/>` + T(x + 19, sy(v) - 8, `${v}`, 19, 'middle', bad ? 'fp-big' : 'fp-small');
    });
    s += T(180, 342, tx('losbreekmoment, 5 auto’s', 'breakaway, 5 cars'), 19, 'middle', 'fp-small');
    return s;
  }
  function whyCard() {
    return card(376, 236, 248, 148) + T(394, 274, tx('log: 4 × OK', 'log: 4 × OK'), 20, 'start', 'fp-big') + T(394, 308, tx('2 × dezelfde bout', '2 × the same bolt'), 19, 'start') + T(394, 340, tx('bout 4: op gevoel', 'bolt 4: by feel'), 19, 'start') + T(394, 370, tx('verfstreep: draaide hij?', 'paint mark: did it turn?'), 19, 'start', 'fp-small');
  }
  // a nut seen from above, with its paint mark, turned by a
  function nutTop(cx, cy, a, step) {
    const R = 46;
    const ring = [];
    for (let i = 0; i < 6; i++) { const t = a + Math.PI / 6 + (i * Math.PI) / 3; ring.push([cx + R * Math.cos(t), cy + R * Math.sin(t)]); }
    const m = R * 0.86;
    return `<path class="fp-card" d="${pth(ring, true)}"/><circle class="fp-boltf" cx="${cx}" cy="${cy}" r="17"/><path class="fp-dash" d="M${cx} ${cy}L${cx + 64} ${cy}"/><path class="fp-paintl" d="M${f1(cx + 17 * Math.cos(a))} ${f1(cy + 17 * Math.sin(a))}L${f1(cx + m * Math.cos(a))} ${f1(cy + m * Math.sin(a))}"/>`
      + T(cx, cy + 76, `+${Math.round((step * 180) / Math.PI)}°`, 22, 'middle', 'fp-big');
  }
  function vdiCard() {
    let s = `<rect class="fp-card" x="170" y="22" width="300" height="356" rx="8"/>` + T(320, 70, 'VDI 2230', 30, 'middle', 'fp-big');
    const steps = EN ? ['clamp load needed', 'settling', 'tightening factor', 'load factor', 'fatigue check'] : ['nodige klemkracht', 'zetting', 'aanhaalfactor', 'krachtfactor', 'vermoeiing'];
    steps.forEach((t, i) => { s += `<circle class="fp-card" cx="206" cy="${112 + i * 54}" r="13"/>` + T(206, 119 + i * 54, `${i + 1}`, 19, 'middle', 'fp-big') + T(232, 119 + i * 54, t, 20, 'start'); });
    return s;
  }
  function factorCard(kb, p) {
    let s = card(24, 24, 592, 352);
    const x0 = 110;
    const sx = (a) => x0 + (a - 1) * 440;
    s += `<path class="fp-mark" d="M${x0} 290L560 290"/>`;
    for (const a of [1, 1.2, 1.4, 1.6, 1.8, 2]) s += `<path class="fp-mark" d="M${f1(sx(a))} 290L${f1(sx(a))} 298"/>` + T(sx(a), 322, num(a, 1), 19, 'middle', 'fp-small');
    s += T(560, 350, 'αA', 21, 'end', 'fp-big');
    const rows = [[1.4, 1.6, tx('op moment, µ gemeten', 'torque, µ measured'), 1], [1.6, 2.0, tx('op moment, µ geschat', 'torque, µ estimated'), 2]];
    rows.forEach(([a, b, name, show0], i) => {
      if (show0 === 2 && kb < 2) return;
      const y = 70 + i * 96;
      const g = show0 === kb ? span(p, 0.05, 0.4) : 1;
      s += T(x0 - 74, y + 22, name, 20, 'start');
      s += `<rect class="${show0 === 1 ? 'fp-cell-on' : 'fp-bx'}" x="${f1(sx(a))}" y="${y + 34}" width="${f1((sx(b) - sx(a)) * g)}" height="32" rx="4"/>`;
    });
    return s;
  }
  function muBadge() {
    return `<circle class="fp-card" cx="540" cy="200" r="40"/>` + T(540, 214, 'µ', 40, 'middle', 'fp-big');
  }
  function bandCard(p) {
    let s = card(30, 24, 580, 352);
    const y0 = 330;
    const sy = (v) => y0 - v * 4.8;
    s += `<path class="fp-mark" d="M110 46L110 ${y0}L580 ${y0}"/>` + T(100, 60, 'kN', 19, 'end', 'fp-small');
    for (const v of [30, 50]) s += T(100, sy(v) + 6, `${v}`, 19, 'end', 'fp-small');
    s += `<path class="fp-dash" d="M110 ${f1(sy(50))}L570 ${f1(sy(50))}"/>` + T(568, sy(50) - 8, tx('hoogstens 50', 'at most 50'), 19, 'end', 'fp-small');
    s += `<path class="fp-mark" d="M110 ${f1(sy(30))}L570 ${f1(sy(30))}"/>` + T(568, sy(30) + 24, tx('minstens 30', 'at least 30'), 19, 'end', 'fp-small');
    const g1 = span(p, 0.05, 0.4);
    const g2 = span(p, 0.5, 0.85);
    const bar = (x, top, g, cls, lab) => `<rect class="${cls}" x="${x}" y="${f1(sy(30 + (top - 30) * g))}" width="90" height="${f1(sy(30) - sy(30 + (top - 30) * g))}"/>` + (g > 0.95 ? T(x + 45, sy(top) - 10, `${top}`, 22, 'middle', 'fp-big') + T(x + 45, y0 + 0 - 8 + 30, lab, 19, 'middle', 'fp-small') : '');
    s += bar(190, 54, g1, 'fp-bx', '× 1,8'.replace(',', EN ? '.' : ','));
    if (g2 > 0) s += bar(340, 42, g2, 'fp-cell-on', '× 1,4'.replace(',', EN ? '.' : ','));
    return s;
  }
  // the joint diagram: force against deformation; the bolt line rises from the
  // left, the plates' steeper line falls to the right; they meet at the preload
  const DG = { x0: 70, y0: 330, fv: 18.75, sc: 11, kb: 1, kp: 4 }; // bolt slope 1 px/px, plates 4
  function diagBase() {
    return card(24, 18, 592, 364) + `<path class="fp-mark" d="M${DG.x0} 40L${DG.x0} ${DG.y0}L600 ${DG.y0}"/>` + T(DG.x0 + 8, 52, 'F', 21, 'start', 'fp-big') + T(596, DG.y0 + 30, tx('vervorming', 'deformation'), 19, 'end', 'fp-small');
  }
  function diagLines(g) {
    const yv = DG.y0 - DG.fv * DG.sc;
    const xb = DG.x0 + DG.fv * DG.sc / DG.kb; // bolt elongation
    const xp = xb + DG.fv * DG.sc / DG.kp;
    const b = `<path class="fp-sig" d="M${DG.x0} ${DG.y0}L${f1(lerp(DG.x0, xb, g))} ${f1(lerp(DG.y0, yv, g))}"/>`;
    const pl = g > 0.5 ? `<path class="fp-sig2" d="M${f1(xb)} ${f1(yv)}L${f1(lerp(xb, xp, span(g, 0.5, 1)))} ${f1(lerp(yv, DG.y0, span(g, 0.5, 1)))}"/>` : '';
    const lab = g > 0.95 ? T(DG.x0 + 60, yv + 40, tx('bout', 'bolt'), 19, 'start', 'fp-small') + T(xp + 8, DG.y0 - 12, tx('platen', 'plates'), 19, 'start', 'fp-small') + T(xb - 10, yv - 12, `${num(DG.fv, 2)} kN`, 19, 'end', 'fp-small') : '';
    return b + pl + lab;
  }
  // with the external load: the bolt goes up its line by Φ·FA, the plates down theirs by (1 − Φ)·FA
  function diagLoad(g) {
    const fa = 10 * g;
    const phi = 0.2;
    const yv = DG.y0 - DG.fv * DG.sc;
    const xb = DG.x0 + DG.fv * DG.sc;
    const dB = phi * fa * DG.sc; // up the bolt line
    const xn = xb + dB / DG.kb;
    const yb = yv - dB;
    const yp = yv + (1 - phi) * fa * DG.sc; // the plates' force at xn
    return { xn, yb, yp, yv, xb, fa };
  }
  function diagPhi(g) {
    const d = diagLoad(g);
    if (g <= 0) return '';
    let s = `<path class="fp-sig" d="M${f1(d.xb)} ${f1(d.yv)}L${f1(d.xn)} ${f1(d.yb)}"/><path class="fp-dash" d="M${f1(d.xn)} ${f1(d.yb)}L${f1(d.xn)} ${DG.y0}"/>`;
    s += `<rect class="fp-cell-on" x="${f1(d.xn + 6)}" y="${f1(d.yb)}" width="12" height="${f1(d.yv - d.yb)}"/>`;
    if (g > 0.9) s += T(d.xn + 26, d.yb + 14, `+${num(2)} kN`, 21, 'start', 'fp-big') + T(560, 80, 'FA = 10 kN · Φ = 0,2'.replace('0,2', num(0.2, 1)), 20, 'end');
    return s;
  }
  function diagResid(g) {
    const d = diagLoad(1);
    if (g <= 0) return '';
    let s = `<rect class="fp-band" x="${f1(d.xn + 22)}" y="${f1(d.yv)}" width="12" height="${f1((d.yp - d.yv) * span(g, 0, 0.4))}"/>`;
    if (g > 0.4) s += `<rect class="fp-cell-on" x="${f1(d.xn - 40)}" y="${f1(d.yp)}" width="14" height="${f1(DG.y0 - d.yp)}"/>` + T(d.xn - 48, d.yp + (DG.y0 - d.yp) / 2 + 6, `${num(10.75, 2)} kN`, 21, 'end', 'fp-big') + T(d.xn + 42, (d.yv + d.yp) / 2 + 6, `−${num(8)} kN`, 21, 'start', 'fp-big');
    return s;
  }
  function diagAmp(p) {
    // the bolt force swinging 0 → +2 kN as the load alternates 0 → 10 kN
    const x0 = 418;
    const y0 = 180;
    let s = card(x0 - 10, y0 - 60, 190, 140);
    const pts = [];
    for (let i = 0; i <= 60; i++) { const t = i / 60; pts.push([x0 + t * 170, y0 + 14 - 22 * (0.5 - 0.5 * Math.cos(t * TAU * 2 + p * TAU))]); }
    s += `<path class="fp-sig" d="${pth(pts)}"/>` + T(x0 + 85, y0 - 30, '± 1 kN → 17 MPa', 20, 'middle', 'fp-big') + T(x0 + 85, y0 + 60, tx('eerste draadgang', 'first thread'), 19, 'middle', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['scrim', 'sect', 'headC', 'pitchC', 'capC', 'torqueC', 'pieC', 'scatterC', 'angleC', 'auditC', 'vdiC', 'factorC', 'bandC', 'diagC'];
  function hudOnly(list) { for (const k of HUD) show(E[k], list.includes(k)); }
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };
  set(E.sBase, sectBase);
  set(E.sPlates, sectPlates);
  set(E.angleBase, angleBase());
  set(E.diagBase, diagBase());
  set(E.vdiBody, vdiCard());
  set(E.muBody, muBadge());
  const SECT_SLOTS = ['sStress', 'sLock', 'sClamp', 'sSettle', 'sElong', 'sGrip', 'sText'];
  // the section card: where, how far stretched, and which inset
  function sect(x, e, slots) {
    place(E.sect, x, 30);
    set(E.sBolt, sectBolt(e));
    for (const k of SECT_SLOTS) if (!(k in slots)) set(E[k], '');
    for (const [k, v] of Object.entries(slots)) set(E[k], v);
  }

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    introCamera(E.world, C.KEYS[si], d, u, W, H);
    const clockS = u * C.dur[si];
    let headA = Math.PI / 6;
    let nutA = Math.PI / 6;
    let runUp = C.RUN.up;
    let paint = false;
    let hud = [];
    show(E.muBody.parentNode, false);

    if (si === 0) {
      if (kb >= 1) { hud = ['scrim', 'sect']; sect(170, kb === 1 ? span(p, 0.1, 0.8) : 1, { sClamp: kb === 2 ? sectClamp(span(p, 0.05, 0.5)) : '' }); }
      if (kb === 0) nutA = Math.PI / 6 + 0.6 * span(p, 0.3, 0.9);
    }
    if (si === 1) {
      if (kb === 0) { hud = ['scrim', 'pitchC']; set(E.pitchBody, pitchCard(p)); }
      if (kb >= 1) {
        hud = ['headC'];
        const h = headCard(kb === 3 ? '10.9' : '8.8', kb, p);
        set(E.hcHead, h.head);
        set(E.hcBars, h.bars);
        set(E.hcText, h.text);
      }
    }
    if (si === 2) {
      if (kb === 0) { hud = ['scrim', 'sect']; sect(170, 0, { sStress: sectStress() }); }
      if (kb === 1) { hud = ['scrim', 'capC']; set(E.capBody, capCard(p)); }
      if (kb === 2) { hud = ['scrim', 'sect']; sect(170, 0, { sLock: sectLock(span(p, 0.05, 0.6)) }); }
    }
    if (si === 3) {
      if (kb === 0) runUp = C.RUN.up * (1 - span(p, 0.15, 0.75));
      if (kb === 1) { runUp = 0; hud = ['scrim', 'torqueC']; set(E.torqueBody, torqueCard(p)); }
      if (kb === 2) {
        runUp = 0;
        headA = Math.PI / 6 + clockS * 2.2 * (1 - span(p, 0.6, 0.75));
        hud = ['sect'];
        const kn = 25 * span(p, 0.05, 0.7);
        sect(330, span(p, 0.05, 0.7), { sClamp: sectClamp(span(p, 0.05, 0.7)), sText: `<rect class="fp-hud-bg" x="170" y="6" width="122" height="36" rx="8"/>${T(282, 32, `${num(kn)} kN`, 22, 'end', 'fp-big')}` });
      }
    }
    if (si === 4) {
      if (kb === 0) { hud = ['scrim', 'pieC']; set(E.pieBody, pieCard(p)); }
      if (kb === 1) { hud = ['scrim', 'scatterC']; set(E.scatterBody, scatterCard(p)); }
    }
    if (si === 5) {
      if (kb === 0) {
        hud = ['scrim', 'angleC'];
        const up = 60 + 140 * span(p, 0.05, 0.8);
        const step = (Math.PI / 2) * span(p, 0.45, 0.8);
        const turn = 0.25 * span(p, 0.05, 0.4) + step;
        set(E.angleCurve, angleCurve(up, true) + nutTop(510, 120, turn, step));
        set(E.angleYield, '');
        paint = true;
        nutA = Math.PI / 6 + turn;
      }
      if (kb === 1) { hud = ['auditC']; set(E.auditBody, auditCard(p)); }
      if (kb === 2) { hud = ['auditC']; set(E.auditBody, whyCard()); paint = true; }
      if (kb === 3) { hud = ['scrim', 'sect']; sect(170, 1, { sSettle: sectSettle(span(p, 0.1, 0.7)) }); }
    }
    if (si === 6) {
      if (kb === 0) hud = ['scrim', 'vdiC'];
      if (kb === 1 || kb === 2) { hud = ['scrim', 'factorC']; set(E.factorBody, factorCard(kb, p)); show(E.muBody.parentNode, kb === 2); }
      if (kb === 3) { hud = ['scrim', 'bandC']; set(E.bandBody, bandCard(p)); }
    }
    if (si === 7) {
      if (kb <= 1) {
        hud = ['scrim', 'angleC'];
        attr(E.angleC, 'transform', 'translate(0 0) scale(1)');
        const up = kb === 0 ? 120 + 180 * span(p, 0.05, 0.85) : Math.max(2, 228 * span(p, 0, 0.5));
        set(E.angleCurve, angleCurve(up, kb === 0));
        set(E.angleYield, kb === 0 ? (up > 228 ? angleYield(false) : '') : angleYield(p > 0.5));
      }
      if (kb === 2) { hud = ['scrim', 'sect']; sect(170, 0, { sElong: sectElong(p) }); }
    }
    if (si === 8) {
      if (kb <= 3) {
        hud = ['scrim', 'diagC'];
        set(E.diagLines, diagLines(kb === 0 ? span(p, 0.05, 0.8) : 1));
        set(E.diagPhi, kb >= 1 ? diagPhi(kb === 1 ? span(p, 0.1, 0.6) : 1) : '');
        set(E.diagResid, kb >= 2 ? diagResid(kb === 2 ? span(p, 0.05, 0.8) : 1) : '');
        set(E.diagAmp, kb === 3 ? diagAmp(p) : '');
      }
      if (kb === 4) { hud = ['scrim', 'sect']; sect(170, 1, { sGrip: sectGrip() }); }
    }

    move(E.runner, [0, 0, runUp]);
    set(E.head, hexSvg(B.head, B.zW1, B.hH, headA, 8.6));
    set(E.nut, hexSvg(B.nut, B.zNut0, B.nH, nutA, 8.6));
    set(E.paint, paint ? paintSvg(nutA - Math.PI / 6 + 0.9) : '');
    hudOnly(hud);
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
