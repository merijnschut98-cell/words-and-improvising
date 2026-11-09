// The stage of the film "Foutvrij maken / Error-proofing": a pure function of
// (scene, u). Inlined into the page after the anatomy kit (iso-kit functions in
// scope) and a preamble from build.mjs that defines P (projection), C (world
// constants), CAM (camera key frames per scene), W and H. Moves are placed per
// caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, pathOf, extrude, slabOf, cylinder, onTop, ring, circleRing, ringSeam, depthOf, solidSvg, lineSvg, dotsSvg, faceTextSvg, sideMatrix, segment, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const LANG = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'nl';
  const TAU = Math.PI * 2;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const fmt = (pts, close) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') + (close ? 'Z' : '') : '');
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const tr = (nl, en) => (LANG === 'nl' ? nl : en);
  const num = (v) => { const s = String(v); return s.length >= 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, tr('.', ',')) : s; };
  const dec = (v) => (LANG === 'nl' ? String(v).replace('.', ',') : String(v));
  const txt = (x, y, t, size = 19, anchor = 'start', cls = 'ep-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${f1(size)}" text-anchor="${anchor}">${t}</text>`;
  const S = (paths, style = {}) => solidSvg(paths, { tone: 'mid', ...style });
  const ph = (p, a, b) => span(p, a, b);
  const lensEls = [0, 1].map((i) => svg.querySelector(`[data-cue="ptl${i}"] .ep-lens`));

  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp01((u - a0) / Math.max(1e-6, a1 - a0)) };
  }

  // ------------------------------------------------------------ camera
  function camera(si, u) {
    const { b, p } = beatOf(si, u);
    const keys = CAM[si];
    const from = keys[Math.max(0, b - 1)];
    const to = keys[b];
    const t = span(p, 0, 0.3);
    const c = [lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)];
    const s = W / c[2];
    const tf = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-c[0])} ${f1(-c[1])})`;
    if (E.world.__t !== tf) { E.world.setAttribute('transform', tf); E.world.__t = tf; }
  }

  // ------------------------------------------------------------ the bracket, the housing
  const rot2 = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  // a bracket whose origin (the housing centre when mounted) is at (ox, oy), floor at z
  function bracketSvg(ox, oy, z, mm, clip) {
    const th = C.THICK[mm];
    const B = C.BR;
    const tab = S(slabOf({ x: ox + B.x, y: oy + B.y, w: B.tab, d: B.d, r: 0.6 }, z, B.tabH, P, 2, 0.2), { tone: 'hi', crease: 'lo' })
      + lineSvg(ring(ox + B.x + B.tab / 2, oy, 2.2, z + B.tabH, P, 12), { tone: 'lo' });
    const plate = S(slabOf({ x: ox + B.x + B.tab, y: oy + B.y, w: B.w - B.tab, d: B.d, r: 0.8 }, z, th, P, 2, 0.3), { tone: 'hi', crease: 'lo', inner: '' })
      + lineSvg(ring(ox - 14, oy - 7, 2.1, z + th, P, 14) + ring(ox - 14, oy + 7, 2.1, z + th, P, 14), { tone: 'lo' })
      + dotsSvg([at([ox - 14, oy - 7, z + th]), at([ox - 14, oy + 7, z + th])], { size: 0.4, tone: 'hi' });
    let c = '';
    if (clip > 0) {
      const K = C.CLIP;
      const lift = clip < 1 ? 2.4 : 0; // a half-seated clip stands proud
      c = S(slabOf({ x: ox + K.x, y: oy + K.y, w: K.w, d: K.d, r: 1 }, z + th + lift, K.h * (clip < 1 ? 0.7 : 1), P, 2, 0.3), { tone: 'mid', crease: 'lo' })
        + lineSvg(onTop([[ox + K.x + 2, oy], [ox + K.x + K.w - 2, oy]], z + th + lift + K.h * (clip < 1 ? 0.7 : 1), P), { tone: 'lo' });
    }
    return tab + plate + c;
  }
  const HRING = (() => { const h = C.HOUSE; const x0 = h.x; const y0 = h.y; const x1 = h.x + h.w; const y1 = h.y + h.d; return [[x0 + h.cham, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0 + h.cham]]; })();
  // st: { x, y, z, rot, dark, bracket (6 | 8 | 0), clip, screws, bear (null or lift) }
  function houseSvg(st) {
    const h = C.HOUSE;
    const ringW = HRING.map((p) => { const [a, b] = rot2(p, st.rot || 0); return [a + st.x, b + st.y]; });
    const z = st.z;
    const top = z + h.h;
    const body = S(extrude(ringW, z, h.h, P), { inner: lineSvg(ringSeam(ringW, z + 6, P), { tone: 'faint' }) });
    const loc = (lx, ly) => { const [a, b] = rot2([lx, ly], st.rot || 0); return [a + st.x, b + st.y]; };
    let flat = '';
    const items = [];
    C.SCREW_AT.forEach(([sx, sy], i) => {
      const [x, y] = loc(sx, sy);
      if (i < (st.screws || 0)) items.push({ d: depthOf([x, y, top], P), s: S(cylinder(x, y, 3.4, top, 2.2, P, 6), { tone: 'hi', crease: 'lo' }) + dotsSvg([at([x, y, top + 2.2])], { size: 0.4, tone: 'lo' }) });
      else flat += ring(x, y, 2.4, top, P, 12);
    });
    const [bx, by] = loc(C.BEAR.x, C.BEAR.y);
    const bore = `<path class="ep-hole" d="${ring(bx, by, C.BEAR.r + 0.8, top, P, 28)}"/>`;
    if (st.bear !== null && st.bear !== undefined) {
      const zb = top - 6 + st.bear;
      const z0 = Math.max(top, zb);
      items.push({ d: depthOf([bx, by, top], P), s: S(cylinder(bx, by, C.BEAR.r, z0, zb + 8 - z0, P, 28), { tone: 'hi', crease: 'lo' }) + `<path class="ep-hole" d="${ring(bx, by, 3.6, zb + 8, P, 20)}"/>` + lineSvg(ring(bx, by, 5.6, zb + 8, P, 24), { tone: 'lo' }) });
    }
    if (st.bracket) items.push({ d: depthOf([st.x - 9, st.y, top], P), s: bracketSvg(st.x, st.y, top, st.bracket, st.clip || 0) });
    if (st.drop) items.push({ d: 0, s: `<ellipse class="ep-drop" cx="${f1(at([st.x + 9, st.y + 9, top + C.THICK[6]])[0])}" cy="${f1(at([st.x + 9, st.y + 9, top + C.THICK[6]])[1])}" rx="3.2" ry="1.8"/>` });
    items.sort((a, b) => a.d - b.d);
    const html = body + bore + lineSvg(flat, { tone: 'lo' }) + lineSvg(onTop(ringW.map(([x, y]) => [x, y]), top, P, true), { tone: 'faint' }).replace('iso-line', 'iso-line') + items.map((i) => i.s).join('');
    return st.dark ? `<g class="ep-dark">${html}</g>` : html;
  }

  // ------------------------------------------------------------ the operator's hand
  function handSvg(p, carry) {
    let out = '';
    if (carry) out += bracketSvg(p[0] + 9, p[1], p[2] - C.THICK[carry], carry, 0);
    out += S(slabOf({ x: p[0] - 9, y: p[1] - 7, w: 18, d: 15, r: 5 }, p[2], 9, P, 4, 1), { tone: 'hi', crease: 'lo' });
    out += S(cylinder(p[0], p[1] + 1, 6.5, p[2] + 9, 16, P, 20), { tone: 'mid', crease: 'lo' }) + S(cylinder(p[0], p[1] + 1, 7.2, p[2] + 25, 5, P, 20), { tone: 'lo', crease: 'lo' });
    return out;
  }
  const HOME = [-30, 110, 90];
  const binIn = (i, th) => { const b = C.BINS[i]; return [b.x + b.w / 2 - 6, b.y + b.d / 2 - 6, 4 + 2 * th]; };
  const PLACE = (mm) => [-9, 0, C.HT + C.THICK[mm]];
  // q 0..1: home → into bin i → over the housing → set down; returns the hand and whether the bracket is placed
  function handTrip(q, i, mm, place = true) {
    const th = C.THICK[mm];
    const bin = binIn(i, th);
    const over = [bin[0], bin[1], C.BIN_H + 26];
    const dst = PLACE(mm);
    const hover = [dst[0], dst[1], dst[2] + 26];
    let p;
    let carry = 0;
    if (q < 0.3) { const t = span(q, 0, 0.3); p = lerp3(HOME, over, t); p[2] += Math.sin(t * Math.PI) * 20; } else if (q < 0.42) { const t = Math.sin(span(q, 0.3, 0.42) * Math.PI); p = lerp3(over, bin, t); carry = q > 0.36 ? mm : 0; } else if (!place) { p = over; carry = mm; } else if (q < 0.8) { const t = span(q, 0.42, 0.8); p = lerp3(over, hover, t); p[2] += Math.sin(t * Math.PI) * 24; carry = mm; } else if (q < 0.9) { p = lerp3(hover, dst, span(q, 0.8, 0.9)); carry = mm; } else { p = lerp3(dst, HOME, span(q, 0.9, 1)); }
    const inBin = q > 0.3 && q < 0.42;
    return { hand: q < 0.999 || !place ? { p, carry } : null, placed: place && q >= 0.9, inBin };
  }

  // ------------------------------------------------------------ the nutrunner
  function nutSvg(T, spin) {
    const B = [C.NUT.x, C.NUT.y];
    const dx = T[0] - B[0];
    const dy = T[1] - B[1];
    const d = Math.min(C.NUT.l1 + C.NUT.l2 - 0.5, Math.hypot(dx, dy));
    const a = Math.atan2(dy, dx);
    const al = Math.acos(Math.min(1, (C.NUT.l1 * C.NUT.l1 + d * d - C.NUT.l2 * C.NUT.l2) / (2 * C.NUT.l1 * d)));
    const e1 = [B[0] + C.NUT.l1 * Math.cos(a + al), B[1] + C.NUT.l1 * Math.sin(a + al)];
    const e2 = [B[0] + C.NUT.l1 * Math.cos(a - al), B[1] + C.NUT.l1 * Math.sin(a - al)];
    const el = e1[1] < e2[1] ? e1 : e2; // the elbow swings out to the back
    const link = (p0, p1, z0, z1, w) => {
      const ux = p1[0] - p0[0];
      const uy = p1[1] - p0[1];
      const l = Math.hypot(ux, uy) || 1;
      const nx = (-uy / l) * w;
      const ny = (ux / l) * w;
      return S(extrude([[p0[0] + nx, p0[1] + ny], [p1[0] + nx, p1[1] + ny], [p1[0] - nx, p1[1] - ny], [p0[0] - nx, p0[1] - ny]], z0, z1 - z0, P), { tone: 'mid', crease: 'lo' });
    };
    const zt = C.NUT.z;
    let out = link(el, T, zt - 7, zt, 5);
    out += S(cylinder(el[0], el[1], 7, zt - 8, 16, P, 24), { tone: 'mid', crease: 'lo' });
    out += link(B, el, zt, zt + 7, 6);
    out += S(cylinder(B[0], B[1], 8, zt + 7, 3, P, 24), { tone: 'hi', crease: 'lo' }) + dotsSvg([at([B[0], B[1], zt + 10])], { size: 0.45, tone: 'hi' });
    // the tool: hanger rod, motor body with a grip band and a trigger, nose, bit
    const [x, y, z] = T;
    out += S(cylinder(x, y, 2.4, z + 72, zt - 7 - z - 72, P, 12), { tone: 'mid', crease: 'none' });
    out += S(cylinder(x, y, 9, z + 22, 50, P, 28), { tone: 'hi', crease: 'lo', inner: lineSvg(sideArcAt(x, y, 9, z + 46) + sideArcAt(x, y, 9, z + 52), { tone: 'faint' }) });
    out += S(slabOf({ x: x + 6, y: y - 3, w: 8, d: 6, r: 1 }, z + 40, 14, P, 2, 0.3), { tone: 'mid', crease: 'lo' });
    out += S(cylinder(x, y, 5, z + 8, 14, P, 20), { tone: 'mid', crease: 'lo' });
    out += S(cylinder(x, y, 1.6, z, 8, P, 6), { tone: 'hi', crease: 'none' });
    if (spin > 0.01) out += `<path class="ep-spin" style="stroke-dashoffset:${f1(-spin * 40)}" stroke-dasharray="10 6" d="${fmt(Array.from({ length: 25 }, (_, i) => { const t = (i / 24) * TAU * 0.8; return at([x + 8 * Math.cos(t), y + 8 * Math.sin(t), z + 12]); }))}"/>`;
    return out;
  }
  function sideArcAt(cx, cy, r, z) {
    const pts = [];
    for (let i = 0; i <= 16; i++) { const t = -0.3 + (i / 16) * Math.PI * 0.9; pts.push(at([cx + r * Math.cos(t), cy + r * Math.sin(t), z])); }
    return fmt(pts);
  }
  const PARK = [C.NUT.park[0], C.NUT.park[1], C.HT + 60];
  // q 0..1 over screws from..to (count after): the tool visits each screw
  function screwing(q, from, to) {
    const n = to - from;
    if (n <= 0) return { T: PARK, screws: to, spin: 0 };
    const k = Math.min(n - 1, Math.floor(q * n));
    const p = q * n - k;
    const [sx, sy] = C.SCREW_AT[from + k];
    const above = [sx, sy, C.HT + 2.2 + 26];
    const down = [sx, sy, C.HT + 2.2];
    const prev = k === 0 ? PARK : [C.SCREW_AT[from + k - 1][0], C.SCREW_AT[from + k - 1][1], C.HT + 28.2];
    let T;
    let spin = 0;
    if (p < 0.35) T = lerp3(prev, above, span(p, 0, 0.35));
    else if (p < 0.5) T = lerp3(above, down, span(p, 0.35, 0.5));
    else if (p < 0.85) { T = down; spin = p * 6; } else T = lerp3(down, above, span(p, 0.85, 1));
    if (k === n - 1 && q >= 0.999) T = above;
    return { T, screws: from + k + (p >= 0.8 ? 1 : 0), spin };
  }

  // ------------------------------------------------------------ the press and its force curve
  // q 0..1: down to the bearing, push it home, hold, back up; returns foot, bearing lift, stroke progress
  function pressCycle(q, hasBear) {
    const seat = C.HT + 2;
    const touch = hasBear ? seat + 14 : seat;
    let foot = C.PRESS.rest;
    let s = 0;
    if (q < 0.3) foot = lerp(C.PRESS.rest, touch, span(q, 0, 0.3));
    else if (q < 0.65) { s = clamp01((q - 0.3) / 0.35); foot = hasBear ? lerp(touch, seat, s) : seat; } else if (q < 0.75) { foot = seat; s = 1; } else { foot = lerp(seat, C.PRESS.rest, span(q, 0.75, 1)); s = 1; }
    const bear = hasBear ? Math.max(0, foot - seat) : null;
    return { foot, bear: hasBear ? Math.min(14, bear) : null, s };
  }
  const forceGood = (s) => { const b = 0.15 + 0.28 * Math.min(1, s / 0.25) + 0.05 * Math.max(0, Math.min(s, 0.88) - 0.25); return s < 0.88 ? b : b + ((s - 0.88) / 0.12) * 0.5; };
  const forceNone = (s) => 0.03 + 0.02 * s;
  const WIN = [{ s0: 0.35, s1: 0.7, f0: 0.3, f1: 0.52 }, { s0: 0.9, s1: 1.0, f0: 0.72, f1: 1.02 }];
  // rows: [{ f, s, c }], windows: alpha, status: text
  function graphSvg(rows, winA, status, statusAcc, alpha) {
    if (alpha <= 0.01) return '';
    const X0 = 12;
    const Y0 = 12;
    const pw = 300;
    const ph2 = 214;
    const gx0 = X0 + 40;
    const gx1 = X0 + pw - 16;
    const gy0 = Y0 + 150;
    const gy1 = Y0 + 44;
    const sx = (s) => gx0 + (gx1 - gx0) * s;
    const sy = (f) => gy0 - (gy0 - gy1) * f;
    let out = `<rect class="ep-panel" x="${X0}" y="${Y0}" width="${pw}" height="${ph2}" rx="8"/>`;
    out += txt(X0 + 14, Y0 + 28, tr('kracht over de slag', 'force over the stroke'), 19, 'start', 'ep-mute');
    out += `<path class="ep-axis" d="M${gx0} ${gy1 - 6}V${gy0}H${gx1 + 6}"/>`;
    out += txt(gx0 - 8, gy1 + 6, 'F', 18, 'end', 'ep-mute') + txt(gx1, gy0 + 22, tr('slag', 'stroke'), 18, 'end', 'ep-mute');
    if (winA > 0.01) out += `<g style="opacity:${winA.toFixed(2)}">` + WIN.map((w) => `<rect class="ep-win" x="${f1(sx(w.s0))}" y="${f1(sy(w.f1))}" width="${f1(sx(w.s1) - sx(w.s0))}" height="${f1(sy(w.f0) - sy(w.f1))}"/>`).join('') + '</g>';
    for (const r of rows) {
      if (r.s <= 0.001) continue;
      const pts = [];
      for (let i = 0; i <= 40; i++) { const s = (i / 40) * r.s; pts.push([sx(s), sy(r.f(s))]); }
      out += `<path class="ep-curve"${r.c ? ` data-c="${r.c}"` : ''} d="${fmt(pts)}"/>`;
    }
    if (status) out += txt(X0 + 14, Y0 + ph2 - 14, status, 19, 'start', statusAcc ? 'ep-acc' : 'ep-txt');
    return `<g style="opacity:${alpha.toFixed(2)}">${out}</g>`;
  }

  // ------------------------------------------------------------ small parts drawn per frame
  function clampArmSvg(c) {
    // c: 1 closed over the housing corner, 0 swung away and lifted
    const a = lerp(-2.39, -0.82, 1 - c);
    const z = C.CLAMP.z + 6 * (1 - c);
    const L = 22;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const nx = -uy * 3.6;
    const ny = ux * 3.6;
    const x = C.CLAMP.x;
    const y = C.CLAMP.y;
    const tip = [x + ux * L, y + uy * L];
    let out = S(cylinder(x, y, 4, C.CLAMP.z - 2, z - C.CLAMP.z + 2, P, 16), { tone: 'mid', crease: 'none' });
    out += S(extrude([[x + nx, y + ny], [tip[0] + nx, tip[1] + ny], [tip[0] - nx, tip[1] - ny], [x - nx, y - ny]], z, 5, P), { tone: 'hi', crease: 'lo' });
    out += S(cylinder(x, y, 6, z, 6, P, 24), { tone: 'mid', crease: 'lo' }) + dotsSvg([at([x, y, z + 6])], { size: 0.45, tone: 'hi' });
    out += S(cylinder(tip[0] - ux * 3, tip[1] - uy * 3, 2.4, z - 2, 9, P, 6), { tone: 'mid', crease: 'lo' });
    return out;
  }
  function rodSvg(foot) {
    const x = C.BEAR.x;
    return S(cylinder(x, 0, 3, foot + 5, C.PRESS.cyl[0] - 3 - foot - 5, P, 16), { tone: 'hi', crease: 'none' })
      + S(cylinder(x, 0, 7, foot, 5, P, 24), { tone: 'mid', crease: 'lo' });
  }
  function fieldSvg(x, y, zf, on, wide) {
    if (!on) return '';
    let out = '';
    for (let i = 1; i <= 3; i++) {
      const r = (wide ? 3.5 : 2.2) * i;
      out += `<path class="ep-field" style="opacity:${(1 - i * 0.22).toFixed(2)}" d="${fmt(Array.from({ length: 17 }, (_, j) => { const t = Math.PI * (j / 16); return at([x + r * Math.cos(t) * 1.1, y, zf - r * Math.sin(t) * 0.7]); }))}"/>`;
    }
    return out;
  }
  const led = (p, lit) => { const [x, y] = at(p); return `<circle class="ep-led"${lit ? ' data-lit=""' : ''} cx="${f1(x)}" cy="${f1(y)}" r="2"/>`; };
  function sensBSvg(st) {
    const [x, y] = C.SENS.B;
    const zt = C.SB.z;
    let out = '';
    if (st.type === 'ind') {
      out += S(cylinder(x, y, 4.2, C.HT + 11, zt - C.HT - 11, P, 20), { tone: 'mid', crease: 'none' }) + S(cylinder(x, y, 5.6, zt - 3, 3, P, 6), { tone: 'hi', crease: 'lo' });
      out += fieldSvg(x, y, C.HT + 11, st.led, false) + led([x + 3, y + 3, C.HT + 22], st.led);
    } else if (st.type === 'cap') {
      out += S(cylinder(x, y, 6.2, C.HT + 13, zt - C.HT - 13, P, 24), { tone: 'mid', crease: 'none' }) + S(cylinder(x, y, 6.4, C.HT + 13, 3, P, 24), { tone: 'lo', crease: 'lo' })
        + S(cylinder(x, y, 8, zt - 3, 3, P, 6), { tone: 'hi', crease: 'lo' });
      out += fieldSvg(x, y, C.HT + 13, true, true) + led([x + 4.5, y + 4.5, C.HT + 26], st.led);
    } else if (st.type === 'dif') {
      const bx = { x: x - 6, y: y - 8, w: 12, d: 16, r: 1 };
      out += S(slabOf(bx, C.HT + 22, zt - C.HT - 22, P, 2, 0.4), { tone: 'mid', crease: 'lo' });
      const zc = C.HT + C.THICK[6];
      const zClip = zc + C.CLIP.h;
      const zEnd = st.clip ? zClip : zc;
      // the light cone from the lens to what it hits
      const r0 = 2.2;
      const r1 = 4;
      const a0 = at([x - r0, y, C.HT + 22]);
      const a1 = at([x + r0, y, C.HT + 22]);
      const b0 = at([x - r1, y, zEnd]);
      const b1 = at([x + r1, y, zEnd]);
      out += `<path class="ep-cone" d="${fmt([a0, a1, b1, b0], true)}"/>`;
      if (st.limit) {
        const zl = zc + 2;
        out += `<path class="ep-limit" d="${fmt([[x - 10, y - 10, zl], [x + 10, y - 10, zl], [x + 10, y + 10, zl], [x - 10, y + 10, zl]].map(at), true)}"/>`;
      }
      out += led([x + 6, y + 8, C.HT + 34], st.led);
    }
    return out;
  }
  function binBeams(st) {
    let out = '';
    [0, 1].forEach((i) => {
      if (!st.binBeam[i]) return;
      const b = C.BINS[i];
      const y = C.BIN_EY[i];
      const z = C.BIN_H - 3.5;
      const x0 = b.x + 6.4;
      const x1 = b.x + b.w - 6.4;
      if (st.binBreak[i]) {
        const hx = b.x + b.w / 2 - 6;
        out += `<path class="ep-beam" d="${fmt([at([x0, y, z]), at([hx - 10, y, z])])}"/>`;
      } else out += `<path class="ep-beam" d="${fmt([at([x0, y, z]), at([x1, y, z])])}"/>`;
    });
    return out;
  }
  function beamSvg(on, blocked) {
    if (!on) return '';
    const x = C.BEAM_X;
    const z = C.FZ + 15;
    // blocked: only the stub from the emitter to the housing's front face,
    // drawn in front of the housing (beamStub); the receiver's LED goes out
    if (blocked) return led([x + 2, -44, C.FZ + 15], false);
    return `<path class="ep-beam" d="${fmt([at([x + 2, 43, z]), at([x + 2, -44, z])])}"/>` + led([x + 2, -44, C.FZ + 15], true);
  }
  function beamStubSvg(on, blocked) {
    if (!on || !blocked) return '';
    const x = C.BEAM_X;
    const z = C.FZ + 15;
    // the light spot where the beam meets the housing: the beam is broken here
    const [sx, sy] = at([x + 2, C.HOUSE.y + C.HOUSE.d, z]);
    return `<path class="ep-beam" d="${fmt([at([x + 2, 43, z]), at([x + 2, C.HOUSE.y + C.HOUSE.d, z])])}"/>`
      + `<circle class="ep-glow" cx="${f1(sx)}" cy="${f1(sy)}" r="3.2"/><circle class="ep-ring" cx="${f1(sx)}" cy="${f1(sy)}" r="6.5"/>`;
  }
  function lampSvg(on) {
    const [x, y] = C.LAMP;
    return S(cylinder(x, y, 4.6, C.PLC.h + 21, 9, P, 22), { tone: on ? 'hi' : 'mid', crease: 'lo', className: on ? 'ep-lit' : undefined });
  }
  function hmiSvg(lines, flow) {
    let out = '';
    if (lines) {
      lines.forEach((l, i) => {
        out += faceTextSvg(sideMatrix([C.HMI.x, C.HMI.y], C.HMI.z - i * 9.5, P, 'left'), l, { size: 7.4, tone: i === lines.length - 1 ? 'hi' : 'mid' });
      });
    }
    if (flow !== null && flow !== undefined) {
      const pts = [[C.SB.x + 10, C.SB.y, 1], [C.SB.x + 20, C.SB.y - 10, 1], [C.PLC.x - 30, C.SB.y - 10, 1], [C.PLC.x, C.PLC.y + 14, 1]].map(at);
      out += `<path class="ep-flow" style="stroke-dashoffset:${f1(-flow * 90)}" d="${fmt(pts)}"/>`;
    }
    return out;
  }
  function keyRing(a) {
    if (a <= 0.01) return '';
    const [x, y, z] = C.KEY;
    return `<path class="ep-ring" style="opacity:${a.toFixed(2)}" d="${fmt(circleRing(0, 0, 8, 28).map(([u, v]) => at([x + u, y + 0.4, z + v])), true)}"/>`;
  }
  function refRings(n, a) {
    if (a <= 0.01) return '';
    let out = '';
    for (let i = 0; i < Math.min(3, n); i++) {
      const cx = C.REF.x + 18 + i * 34;
      const cy = C.REF.y + 20;
      out += `<path class="ep-ring" style="opacity:${a.toFixed(2)}" d="${fmt(circleRing(cx, cy, 17, 32).map(([u, v]) => at([u, v, 3.4])), true)}"/>`;
    }
    return out;
  }

  // ------------------------------------------------------------ panels (stage space)
  function panel(x, y, w, lines, alpha, anchor = 'start') {
    if (alpha <= 0.01) return '';
    const h = 20 + lines.length * 28;
    let out = `<rect class="ep-panel" x="${f1(x)}" y="${f1(y)}" width="${w}" height="${h}" rx="8"/>`;
    lines.forEach((l, i) => { out += txt(anchor === 'end' ? x + w - 14 : x + 14, y + 36 + i * 28, l.t, l.size || 19, anchor, l.c || 'ep-txt'); });
    return `<g style="opacity:${alpha.toFixed(2)}">${out}</g>`;
  }
  function barsSvg(title, rows, alpha, x = W - 12 - 330, y = H - 12 - (50 + rows.length * 50)) {
    if (alpha <= 0.01) return '';
    const pw = 330;
    const hh = 50 + rows.length * 50;
    const x0 = x + 14;
    const x1 = x + pw - 14;
    let out = `<rect class="ep-panel" x="${f1(x)}" y="${f1(y)}" width="${pw}" height="${hh}" rx="8"/>` + txt(x0, y + 28, title, 18, 'start', 'ep-mute');
    rows.forEach((r, i) => {
      const yy = y + 42 + i * 50;
      out += `<rect class="ep-meter" x="${f1(x0)}" y="${f1(yy)}" width="${f1(x1 - x0)}" height="10" rx="3"/>`;
      if (r.v > 0) out += `<rect class="ep-meter" data-c="${r.c || 'lo'}" x="${f1(x0)}" y="${f1(yy)}" width="${f1(Math.max(2, (x1 - x0) * Math.min(1, r.v)))}" height="10" rx="3"/>`;
      out += txt(x0, yy + 32, r.label, 18, 'start', r.c === 'acc' ? 'ep-acc' : 'ep-txt');
    });
    return `<g style="opacity:${alpha.toFixed(2)}">${out}</g>`;
  }
  function pfmeaSvg(dLow, alpha) {
    if (alpha <= 0.01) return '';
    const X = 12;
    const Y = 12;
    const pw = 360;
    let out = `<rect class="ep-panel" x="${X}" y="${Y}" width="${pw}" height="196" rx="8"/>`;
    out += txt(X + 14, Y + 28, 'PFMEA', 18, 'start', 'ep-mute') + txt(X + pw - 14, Y + 28, tr('lager ontbreekt', 'bearing missing'), 19, 'end', 'ep-txt');
    const rows = [[tr('ernst', 'severity'), 0.8, ''], [tr('optreden', 'occurrence'), 0.4, ''], [tr('detectie', 'detection'), lerp(0.7, 0.2, dLow), dLow > 0.5 ? tr('sensor + interlock', 'sensor + interlock') : tr('met het oog', 'by eye')]];
    rows.forEach(([name, v, note], i) => {
      const y = Y + 52 + i * 44;
      out += txt(X + 14, y + 10, name, 18, 'start', 'ep-txt');
      const bx0 = X + 130;
      const bx1 = X + pw - 14;
      out += `<rect class="ep-meter" x="${bx0}" y="${y}" width="${bx1 - bx0}" height="10" rx="3"/>`;
      out += `<rect class="ep-meter" data-c="${i === 2 && dLow > 0.5 ? 'acc' : 'lo'}" x="${bx0}" y="${y}" width="${f1((bx1 - bx0) * v)}" height="10" rx="3"/>`;
      if (note) out += txt(bx1, y + 32, note, 18, 'end', 'ep-mute');
    });
    return `<g style="opacity:${alpha.toFixed(2)}">${out}</g>`;
  }
  // The action priority cell. The bars are drawn unnumbered on purpose (no
  // invented scores); read as roughly S 8, O 4, D 7 → 2, the AIAG-VDA PFMEA
  // table gives high, then medium. The cell says only "lower", not a class, so
  // the film claims no table value (and a better D never raises the AP).
  function apSvg(alpha, dLow = 0) {
    if (alpha <= 0.01) return '';
    const X = 12 + 360 + 10;
    const Y = 12;
    const low = dLow > 0.5;
    return `<g style="opacity:${alpha.toFixed(2)}"><rect class="ep-panel" x="${X}" y="${Y}" width="150" height="76" rx="8"/>`
      + txt(X + 14, Y + 28, tr('prioriteit', 'priority'), 18, 'start', 'ep-mute') + txt(X + 14, Y + 60, low ? tr('lager', 'lower') : tr('hoog', 'high'), 24, 'start', low ? 'ep-txt' : 'ep-acc') + '</g>';
  }

  // ------------------------------------------------------------ the scenes
  const FULL = (o = {}) => ({ x: 0, y: 0, z: C.FZ, rot: 0, bracket: 6, clip: 1, screws: 8, bear: 0, ...o });
  const EMPTY = (o = {}) => FULL({ bracket: 0, clip: 0, screws: 0, bear: null, ...o });
  // the housing leaving the fixture for the tray (dir 1) or the reject bin (dir −1)
  function outOf(h, q, dir = 1) {
    const dst = dir > 0 ? C.TRAYSPOT : C.REJSPOT;
    const zEnd = dir > 0 ? 2.4 : 2;
    const up = span(q, 0, 0.3);
    const go = span(q, 0.3, 0.8);
    const down = span(q, 0.8, 1);
    const x = lerp(0, dst[0], go);
    const y = dir > 0 ? lerp(0, dst[1], go) : lerp(0, dst[1], span(q, 0.6, 0.85));
    const z = lerp(C.FZ + 46 * up, zEnd, down) + (down > 0 ? 0 : 0);
    return { ...h, x, y, z: down > 0 ? lerp(C.FZ + 46, zEnd, down) : C.FZ + 46 * up };
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    let house = FULL();
    let hand = null;
    const ptl = [0, 0];
    const binBeam = [0, 0];
    const binBreak = [false, false];
    let beam = false;
    let clampC = 1;
    let nut = { T: PARK, spin: 0 };
    let foot = C.PRESS.rest;
    let sensB = null;
    let fieldA = false;
    let lamp = false;
    let key = 0;
    let hmi = null;
    let flow = null;
    let trayPart = null;
    let trayStack = 0;
    let rejPart = null;
    let rings = [0, 0];
    let panelA = '';
    let ppm = '';
    let esc = '';
    let graph = '';
    let pf = '';
    let ap = '';
    let plan = '';
    let clock = '';

    if (si === 0) {
      if (b === 0) { house = EMPTY({ z: C.FZ + 70 * (1 - ph(p, 0.1, 0.6)) }); clampC = ph(p, 0.65, 0.9); } else if (b === 1) {
        const tripQ = clamp01(p / 0.36);
        const tp = handTrip(tripQ, 0, 6);
        hand = tp.hand;
        const sc = screwing(clamp01((p - 0.42) / 0.38), 0, 8);
        const pc = pressCycle(clamp01((p - 0.82) / 0.18), true);
        house = FULL({ bracket: tp.placed ? 6 : 0, clip: p > 0.39 ? 1 : 0, screws: p > 0.42 ? sc.screws : 0, bear: p > 0.8 ? pc.bear : null });
        if (p > 0.42 && p < 0.8) nut = sc;
        foot = pc.foot;
        ptl[0] = p < 0.36 ? 1 : 0;
      } else {
        clampC = 1 - ph(p, 0, 0.12);
        const q = clamp01((p - 0.12) / 0.6);
        house = outOf(FULL(), q);
      }
    } else if (si === 1) {
      if (b === 0) house = EMPTY();
      else if (b === 1) {
        const tp = handTrip(clamp01(p / 0.95), 1, 8);
        hand = tp.hand;
        house = EMPTY({ bracket: tp.placed ? 8 : 0 });
      } else if (b === 2) {
        const sc = screwing(clamp01((p - 0.02) / 0.28), 0, 8);
        const pc = pressCycle(clamp01((p - 0.3) / 0.15), true);
        house = FULL({ bracket: 8, screws: sc.screws, bear: pc.bear });
        if (p < 0.31) nut = sc;
        foot = pc.foot;
        if (p > 0.45) { clampC = 1 - ph(p, 0.45, 0.5); house = outOf(house, clamp01((p - 0.5) / 0.28)); }
      } else { house = null; clampC = 0; trayPart = FULL({ bracket: 8, x: C.TRAYSPOT[0], y: C.TRAYSPOT[1], z: 2.4 }); }
      if (b === 2 && house && house.x > 90) { trayPart = house; house = null; }
      if (b === 3) ppm = panel(W - 12 - 290, 12, 290, [{ t: tr('1 op de ', '1 in ') + num(C.ONE_IN), c: 'ep-mute' }, { t: num(1000000) + ' / ' + num(C.ONE_IN) + ' =', c: 'ep-txt' }, { t: `${C.PPM} ppm`, c: 'ep-acc', size: 24 }], ph(p, 0, 0.12));
    } else if (si === 2) {
      binBeam[0] = binBeam[1] = 1;
      if (b === 0) { house = EMPTY(); ptl[0] = 1; } else if (b === 1) {
        const tp = handTrip(clamp01(p / 0.95), 0, 6);
        hand = tp.hand;
        binBreak[0] = tp.inBin;
        ptl[0] = tp.placed ? 0 : 1;
        house = EMPTY({ bracket: tp.placed ? 6 : 0 });
      } else if (b === 2) {
        const tp = handTrip(clamp01(p / 0.7), 1, 8, false);
        hand = tp.hand;
        binBreak[1] = tp.inBin || p > 0.3;
        ptl[0] = 1;
        house = EMPTY();
        lamp = p > 0.32;
        hmi = p > 0.32 ? ['NOK', tr('verkeerde bak', 'wrong bin')] : null;
      } else {
        clampC = 0;
        const blocked = 1 - ph(p, 0.3, 0.42);
        const turn = ph(p, 0.42, 0.65);
        let z = C.FZ + 40;
        if (p < 0.3) z = lerp(C.FZ + 40, C.PIN.top, span(p, 0.05, 0.25)) + (p > 0.22 ? Math.sin(p * 90) * 1.2 * (1 - span(p, 0.22, 0.3)) : 0);
        else if (p < 0.42) z = lerp(C.PIN.top, C.FZ + 40, 1 - blocked);
        else if (p < 0.65) z = C.FZ + 40;
        else z = lerp(C.FZ + 40, C.FZ, span(p, 0.65, 0.9));
        house = EMPTY({ z, rot: Math.PI * (1 - turn) });
        clampC = ph(p, 0.9, 1);
      }
    } else if (si === 3) {
      if (b === 0) {
        const tp = handTrip(clamp01(p / 0.6), 0, 6);
        hand = tp.hand;
        house = EMPTY({ bracket: tp.placed ? 6 : 0 });
        fieldA = tp.placed;
      } else if (b === 1) {
        beam = true;
        fieldA = true;
        clampC = 0;
        const up = ph(p, 0.05, 0.3) - ph(p, 0.55, 0.85);
        house = EMPTY({ bracket: 6, z: C.FZ + 60 * up });
        fieldA = up < 0.05;
      } else {
        beam = true;
        fieldA = true;
        house = EMPTY({ bracket: 6 });
        flow = p * 4;
        hmi = [tr('beugel: 1', 'bracket: 1'), tr('behuizing: 1', 'housing: 1')];
      }
    } else if (si === 4) {
      const count = (n, ok) => panel(12, 12, 250, [{ t: tr('schroeven', 'screws'), c: 'ep-mute' }, { t: `${n} / ${C.SCREWS}`, c: ok ? 'ep-acc' : 'ep-txt', size: 26 }], 1);
      if (b === 0) {
        const sc = screwing(clamp01((p - 0.05) / 0.9), 0, 5);
        nut = sc;
        house = FULL({ screws: sc.screws, bear: null });
        hmi = [tr('stap 4', 'step 4'), `${sc.screws}/8`];
        panelA = count(sc.screws, false);
      } else if (b === 1) {
        let n;
        if (p < 0.4) { const sc = screwing(clamp01(p / 0.4), 5, 7); nut = sc; n = sc.screws; } else if (p < 0.55) { n = 7; nut = { T: PARK, spin: 0 }; } else { const sc = screwing(clamp01((p - 0.55) / 0.22), 7, 8); nut = p < 0.77 ? sc : { T: PARK, spin: 0 }; n = sc.screws; }
        house = FULL({ screws: n, bear: null });
        lamp = p > 0.4 && p < 0.55;
        clampC = 1 - ph(p, 0.8, 0.95);
        hmi = [n < 8 ? tr('wacht: 8 x OK', 'wait: 8 x OK') : 'OK', `${n}/8`];
        panelA = count(n, n === 8);
      } else if (b === 2) {
        clampC = 0;
        house = FULL({ bear: null });
        const v = ph(p, 0.1, 0.5);
        esc = barsSvg(tr('met het oog gekeurd', 'inspected by eye'), [
          { v: 1, label: tr('gemaakt: ', 'made: ') + `${C.MADE_PK} ppm`, c: 'lo' },
          { v: v * C.EYE, label: tr('gevangen: ', 'caught: ') + `${Math.round(C.EYE * 100)}%`, c: 'lo' },
          { v: ph(p, 0.5, 0.75) * (1 - C.EYE), label: tr('bij de klant: ', 'at the customer: ') + `${Math.round(C.MADE_PK * (1 - C.EYE))} ppm`, c: 'acc' },
        ], ph(p, 0, 0.1));
      } else if (b === 3) {
        house = FULL({ bear: null });
        lamp = p > 0.15 && p < 0.9;
        hmi = p > 0.15 ? ['NOK', tr('camera: afgekeurd', 'camera: rejected')] : null;
        clampC = 1 - ph(p, 0.22, 0.3);
        if (p > 0.3) house = outOf(house, clamp01((p - 0.3) / 0.6), -1);
        if (house.x < -150) { rejPart = house; house = null; }
      } else {
        house = null;
        clampC = 0;
        rejPart = FULL({ bear: null, x: C.REJSPOT[0], y: C.REJSPOT[1], z: 2 });
        key = 0.55 + 0.45 * Math.sin(p * TAU * 2);
        hmi = p > 0.5 ? ['BYPASS', tr('check uit', 'check off')] : ['NOK', '3%'];
        panelA = panel(W - 12 - 260, 12, 260, [{ t: tr('valse afkeur', 'false rejects'), c: 'ep-mute' }, { t: `${C.FALSE_REJECT}%`, c: 'ep-acc', size: 26 }], ph(p, 0, 0.1));
      }
    } else if (si === 5) {
      const reading = (clip, on) => panel(12, 12, 240, [{ t: tr('clip: ', 'clip: ') + (clip ? tr('ja', 'yes') : tr('nee', 'no')), c: 'ep-txt' }, { t: tr('sensor: ', 'sensor: ') + (on ? tr('aanwezig', 'present') : tr('niets', 'nothing')), c: on && !clip ? 'ep-acc' : 'ep-txt' }], 1);
      if (b === 0) {
        const clip = p < 0.45 ? 1 : 0;
        house = FULL({ clip, bear: null });
        sensB = { type: 'ind', led: true };
        panelA = reading(clip, true);
      } else if (b === 1) {
        const clip = p < 0.4 ? 1 : 0;
        const drop = p > 0.7;
        house = FULL({ clip, bear: null, drop });
        const on = clip === 1 || drop;
        sensB = { type: 'cap', led: on };
        panelA = reading(clip, on);
      } else {
        const clip = p < 0.5 ? 1 : 0;
        house = FULL({ clip, bear: null });
        sensB = { type: 'dif', led: clip === 1, clip, limit: true };
        panelA = reading(clip, clip === 1);
      }
    } else if (si === 6) {
      if (b === 0) {
        const pc = pressCycle(clamp01((p - 0.08) / 0.84), true);
        house = FULL({ bear: pc.bear });
        foot = pc.foot;
        graph = graphSvg([{ f: forceGood, s: pc.s, c: 'acc' }], 1, pc.s >= 1 ? 'OK' : '', true, ph(p, 0, 0.08));
        hmi = pc.s >= 1 ? ['OK', tr('kracht-weg', 'force-disp.')] : null;
      } else if (b === 1) {
        const pc = pressCycle(clamp01((p - 0.05) / 0.8), false);
        house = FULL({ bear: null });
        foot = pc.foot;
        const done = pc.s >= 1;
        graph = graphSvg([{ f: forceGood, s: 1 }, { f: forceNone, s: pc.s, c: 'acc' }], 1, done ? tr('afgekeurd', 'rejected') : '', true, 1);
        lamp = done;
        hmi = done ? ['NOK', tr('buiten venster', 'outside window')] : null;
      } else {
        house = FULL({ bear: 0 });
        const n = 1 + Math.floor(ph(p, 0.05, 0.85) * 2.99);
        rings = [n, 1];
        const L3 = [{ t: tr('goed: gaat door', 'good: passes'), c: 'ep-txt' }, { t: tr('zonder clip: afgekeurd', 'no clip: rejected'), c: 'ep-txt' }, { t: tr('half ingedrukt: afgekeurd', 'half-seated: rejected'), c: 'ep-acc' }];
        panelA = panel(W - 12 - 300, 12, 300, L3.slice(0, n), ph(p, 0, 0.08));
      }
    } else if (si === 7) {
      house = FULL();
      if (b === 0) pf = pfmeaSvg(0, ph(p, 0, 0.1));
      else if (b === 1) { pf = pfmeaSvg(0, 1); ap = apSvg(ph(p, 0.05, 0.2)); } else {
        const dl = ph(p, 0.05, 0.35);
        pf = pfmeaSvg(dl, 1);
        ap = apSvg(1, dl);
        const v = ph(p, 0.3, 0.7);
        esc = barsSvg(tr('escapes bij ', 'escapes at ') + num(C.MADE_DT) + ' ppm', [
          { v: v * (1 - C.EYE), label: tr('met het oog (', 'by eye (') + `${Math.round(C.EYE * 100)}%): ${Math.round(C.MADE_DT * (1 - C.EYE))} ppm`, c: 'lo' },
          { v: Math.max(0.006, v * (1 - C.AUTO)), label: tr('automatisch (', 'automatic (') + `${dec(C.AUTO * 100)}%): ${Math.round(C.MADE_DT * (1 - C.AUTO))} ppm`, c: 'acc' },
        ], ph(p, 0.25, 0.4));
      }
    } else if (si === 8) {
      const RRH = (o) => FULL({ bear: null, dark: true, ...o });
      const clk = (t, a) => panel(W - 12 - 150, 12, 150, [{ t, c: 'ep-acc', size: 26 }], a, 'end');
      if (b === 0) {
        const z = C.FZ + 70 * (1 - ph(p, 0.02, 0.25));
        const pc = pressCycle(clamp01((p - 0.3) / 0.6), false);
        house = RRH({ z });
        foot = pc.foot;
        const done = pc.s >= 1;
        graph = graphSvg([{ f: forceNone, s: pc.s, c: 'acc' }], 1, done ? tr('afgekeurd: check werkt', 'rejected: check works') : '', true, ph(p, 0.25, 0.32));
        lamp = done;
        clock = clk('06:00', 1);
      } else if (b === 1) {
        const pc = pressCycle(clamp01((p - 0.05) / 0.6), false);
        foot = pc.foot;
        const done = pc.s >= 1;
        graph = graphSvg([{ f: forceNone, s: pc.s }], 1 - ph(p, 0, 0.2), done ? tr('goedgekeurd: check stuk', 'accepted: check failed') : '', true, 1);
        clock = clk('14:00', 1);
        house = RRH();
        if (p > 0.68) { clampC = 1 - ph(p, 0.68, 0.74); house = outOf(house, clamp01((p - 0.74) / 0.26)); }
        if (house.x > 90) { trayPart = house; house = null; }
      } else if (b === 2) {
        house = null;
        clampC = 0;
        trayPart = RRH({ x: C.TRAYSPOT[0], y: C.TRAYSPOT[1], z: 2.4 });
        lamp = true;
        hmi = ['STOP', tr('reactieplan', 'reaction plan')];
        const items = [tr('1 stoppen', '1 stop'), tr('2 check repareren', '2 repair the check'), tr('3 opnieuw verifiëren', '3 verify again'), tr('4 blokkeren sinds 06:00', '4 contain since 06:00')];
        const n = 1 + Math.floor(ph(p, 0.05, 0.8) * 3.99);
        plan = panel(W - 12 - 300, 12, 300, [{ t: tr('reactieplan', 'reaction plan'), c: 'ep-mute' }, ...items.slice(0, n).map((t, i) => ({ t, c: i === 3 ? 'ep-acc' : 'ep-txt' }))], 1);
      } else {
        house = null;
        clampC = 0;
        lamp = true;
        trayPart = FULL({ x: C.TRAYSPOT[0], y: C.TRAYSPOT[1], z: 2.4 });
        trayStack = 1 + Math.floor(ph(p, 0.05, 0.4) * 1.99);
        panelA = panel(12, 12, 330, [{ t: tr('verdacht sinds 06:00', 'suspect since 06:00'), c: 'ep-mute' }, { t: `${C.RR.fail - C.RR.ok} × ${C.RR.rate} = ${C.SUSPECT}`, c: 'ep-acc', size: 26 }], ph(p, 0, 0.1));
      }
    }

    // ---- write the frame
    if (house && house.x > 90) { trayPart = house; house = null; }
    set(E.house, house ? houseSvg(house) : '');
    let trayHtml = '';
    if (trayPart) {
      trayHtml = houseSvg(trayPart);
      for (let i = 1; i <= trayStack; i++) trayHtml += houseSvg({ ...trayPart, z: trayPart.z + i * C.HOUSE.h, x: trayPart.x - i * 3, y: trayPart.y + i * 2 });
      if (trayStack) {
        const top = at([trayPart.x + 30, trayPart.y + 30, trayPart.z + (trayStack + 1) * C.HOUSE.h]);
        trayHtml += `<rect class="ep-tag" x="${f1(top[0])}" y="${f1(top[1] - 12)}" width="38" height="16" rx="3"/>` + txt(top[0] + 19, top[1] + 1, 'Q', 13, 'middle', 'ep-acc');
      }
    }
    set(E.trayPart, trayHtml);
    set(E.rejPart, rejPart ? houseSvg(rejPart) : '');
    set(E.hand, hand ? handSvg(hand.p, hand.carry) : '');
    set(E.clampArm, clampArmSvg(clampC));
    set(E.pressRod, rodSvg(foot));
    set(E.fieldA, (house && house.bracket && fieldA ? fieldSvg(C.SENS.A[0], C.SENS.A[1], C.SA_FACE, true, false) : '') + led([C.SENS.A[0] + 3, C.SENS.A[1] + 3, C.SA_FACE + 10], !!(house && house.bracket && fieldA)));
    set(E.sensB, sensB ? sensBSvg(sensB) : '');
    const inFix = !!(house && house.z <= C.FZ + 1 && Math.abs(house.x) < 1);
    set(E.beam, beamSvg(beam, inFix));
    set(E.beamStub, beamStubSvg(beam, inFix));
    set(E.beamBins, binBeams({ binBeam, binBreak }));
    lensEls.forEach((el, i) => { if (el) el.toggleAttribute('data-lit', !!ptl[i]); });
    set(E.lamp, lampSvg(lamp));
    set(E.hmi, hmiSvg(hmi, flow) + keyRing(key));
    set(E.nutArm, nutSvg(nut.T, nut.spin) + refRings(rings[0], rings[1]));
    set(E.panelA, panelA);
    set(E.ppm, ppm);
    set(E.esc, esc);
    set(E.graph, graph);
    set(E.pfmea, pf);
    set(E.apCell, ap);
    set(E.plan, plan);
    set(E.clock, clock);
    set(E.pressMark, '');
  }

  return { render };
})();
