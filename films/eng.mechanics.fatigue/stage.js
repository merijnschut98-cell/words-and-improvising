// The stage of the film "Hoe een as breekt / How a shaft breaks": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants and the model's data), CAM (one camera move
// per scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, depthOf, span, beatStarts, cylinder, solidSvg */
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
  const group = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',');
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'fa-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'fa-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'fa-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'fa-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const exTag = (x = 620, y = 40, extra = '') => txt(x, y, EX + extra, 22, 'end', 'fa-mute');
  const PANEL = () => rect(204, 12, 428, 376);
  const NS = ' vector-effect="non-scaling-stroke"';

  // the beat on screen and its progress, from the caption beats of the scene
  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1), fr };
  }

  let ZOOM = 1;
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    ZOOM = s;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the world's live parts
  const O = at([0, 0, 0]);
  const VZ = at([0, 0, 1]).map((v, i) => v - O[i]);
  const d0 = depthOf([0, 0, 0], P);
  const VIEW = [depthOf([1, 0, 0], P) - d0, depthOf([0, 1, 0], P) - d0, depthOf([0, 0, 1], P) - d0];
  const polar = (r, a, z) => [r * Math.cos(a), r * Math.sin(a), z];
  const K = C.KEY;
  const RS = C.SHAFT_R;
  const Z1 = C.CPL.hubL[0];
  const front = (a) => Math.cos(a - C.AV);
  const shaft = (z0, z1, tone = 'hi') => solidSvg(cylinder(0, 0, RS, z0, z1 - z0, P, 28), { tone, crease: 'none' });
  // the impeller: four pitched blades on a hub, one bent (out of balance) by `bent`
  function impeller(theta, bent) {
    const I = C.IMP;
    const blades = [];
    for (let i = 0; i < 4; i++) {
      const a = theta + (i * Math.PI) / 2 + 0.4;
      const c = I.chord * (i === 0 ? 1 + 0.5 * bent : 1);
      const lift = i === 0 ? 2.4 * bent : 0;
      const t = [-Math.sin(a), Math.cos(a)];
      const pt = (r, s, dz) => [r * Math.cos(a) + t[0] * s, r * Math.sin(a) + t[1] * s, I.z + dz];
      const q = [pt(I.r0, -c, c), pt(I.r1, -c, c + lift), pt(I.r1, c, -c + lift), pt(I.r0, c, -c)];
      const e1 = q[1].map((v, j) => v - q[0][j]);
      const e2 = q[3].map((v, j) => v - q[0][j]);
      const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const len = Math.hypot(...n) || 1;
      const facing = Math.abs((n[0] * VIEW[0] + n[1] * VIEW[1] + n[2] * VIEW[2]) / len);
      const shade = facing > 0.7 ? 3 : facing > 0.45 ? 2 : facing > 0.2 ? 1 : 0;
      const d = fmt(q.map(at)) + 'Z';
      const cen = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, I.z];
      blades.push({ depth: depthOf(cen, P), svg: `<path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="${shade}" d="${d}"/><path class="iso-line iso-edge" data-tone="hi" d="${d}"/>` });
    }
    blades.sort((x, y) => x.depth - y.depth);
    const axis = depthOf([0, 0, I.z], P);
    const hub = solidSvg(cylinder(0, 0, I.rHub, I.hub[0], I.hub[1] - I.hub[0], P, 32), { tone: 'hi' })
      + dotsSvg([at(polar(I.rHub, C.AV + 0.3, (I.hub[0] + I.hub[1]) / 2))], { size: 0.45, tone: 'lo' });
    const nut = solidSvg(cylinder(0, 0, 2.7, I.nut[0], I.nut[1] - I.nut[0], P, 6), { tone: 'mid' });
    return nut + blades.filter((b) => b.depth < axis).map((b) => b.svg).join('') + hub + blades.filter((b) => b.depth >= axis).map((b) => b.svg).join('');
  }
  // the keyway: a slot on the shaft from its end (sharp or rounded) up into the
  // coupling's hub, with the key in it; drawn only while it faces the viewer
  function keyway(kc, round) {
    const f = front(kc);
    if (f < 0.25) return '';
    const h = K.half;
    const sp = (a, z) => at(polar(RS + 0.02, a, z));
    const n = 8;
    const end = [];
    for (let i = 0; i <= n; i++) {
      const tt = -1 + (2 * i) / n;
      const z = K.z0 + round * h * RS * (1 - Math.sqrt(Math.max(0, 1 - tt * tt)));
      end.push(sp(kc + h * tt, z));
    }
    const slot = [...end, sp(kc + h, Z1), sp(kc - h, Z1)];
    const kz = Math.max(K.zKey, K.z0 + round * h * RS + 0.4);
    const key = [sp(kc - 0.78 * h, kz), sp(kc + 0.78 * h, kz), sp(kc + 0.78 * h, Z1), sp(kc - 0.78 * h, Z1)];
    return op(clamp((f - 0.25) / 0.25, 0, 1), `<path class="fa-well" d="${fmt(slot)}Z"${NS}/><path class="fa-key" d="${fmt(key)}Z"${NS}/>`);
  }
  // the crack at the keyway's end: from the corner around the visible surface
  function crackSvg(kc, g, pen) {
    if (g <= 0.001) return '';
    const a0 = kc + K.half;
    const a1 = a0 + 2.2 * g;
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const a = lerp(a0, a1, i / 24);
      if (front(a) < 0.05) break;
      pts.push(at(polar(RS + 0.03, a, K.z0 + 0.12 * Math.sin(i * 1.7))));
    }
    let out = '';
    if (pen > 0.01) {
      const band = [];
      for (let i = 0; i <= 24; i++) { const a = C.AV - 1.4 + (2.8 * i) / 24; band.push(at(polar(RS + 0.02, a, K.z0 + 1.1))); }
      for (let i = 24; i >= 0; i--) { const a = C.AV - 1.4 + (2.8 * i) / 24; band.push(at(polar(RS + 0.02, a, K.z0 - 1.6))); }
      out += op(pen, `<path class="fa-pen" d="${fmt(band)}Z"/>`);
    }
    if (pts.length > 1) out += `<path class="fa-crack" d="${fmt(pts)}"${NS}/>`;
    return out;
  }
  // the corner point that goes round with the shaft
  function cornerDot(kc) {
    if (front(kc) < 0.2) return '';
    const [x, y] = at(polar(RS + 0.05, kc + K.half, K.z0));
    return `<circle class="fa-acc" cx="${f1(x)}" cy="${f1(y)}" r="${(4.2 / ZOOM).toFixed(2)}"/>`;
  }
  // the force lines that crowd round the keyway's end (scene 2)
  function flowSvg(p) {
    if (p <= 0.01) return '';
    const h = K.half;
    const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    let out = '';
    for (const off of [-1, -0.62, -0.2, 0.2, 0.62, 1]) {
      const pts = [];
      for (let z = K.z0 - 4.5; z <= lerp(K.z0 - 4.5, Z1 - 0.3, p); z += 0.25) {
        const push = Math.abs(off) < h + 0.08 ? Math.sign(off) * (h + 0.1 - Math.abs(off)) * smooth(K.z0 - 2.4, K.z0 + 0.1, z) : 0;
        pts.push(at(polar(RS + 0.04, C.AV + off + push, z)));
      }
      out += `<path class="fa-accl" style="stroke-width:1.4px" d="${fmt(pts)}"${NS}/>`;
    }
    return out;
  }
  // the side push on the impeller (scene 1)
  function pushSvg(a) {
    if (a <= 0.01) return '';
    const dir = C.CUT[1];
    const p0 = at(polar(24, dir, C.IMP.z + 1));
    const p1 = at(polar(17, dir, C.IMP.z + 1));
    const ux = p1[0] - p0[0];
    const uy = p1[1] - p0[1];
    const l = Math.hypot(ux, uy);
    const nx = -uy / l;
    const ny = ux / l;
    const hd = 2.2;
    const head = `M${f1(p1[0] - ux / l * hd + nx * hd * 0.7)} ${f1(p1[1] - uy / l * hd + ny * hd * 0.7)}L${f1(p1[0])} ${f1(p1[1])}L${f1(p1[0] - ux / l * hd - nx * hd * 0.7)} ${f1(p1[1] - uy / l * hd - ny * hd * 0.7)}`;
    return op(a, `<path class="fa-accl" d="M${f1(p0[0])} ${f1(p0[1])}L${f1(p1[0])} ${f1(p1[1])}${head}"${NS}/>`);
  }
  function bolts(theta) {
    const list = [];
    for (let i = 0; i < 6; i++) {
      const a = theta + (i * Math.PI) / 3;
      const [x, y] = polar(C.CPL.rBolt, a, 0);
      list.push({ depth: depthOf([x, y, 72], P), svg: solidSvg(cylinder(x, y, 0.95, C.CPL.flU[1], 1.1, P, 6), { tone: 'hi', crease: 'none' }) });
    }
    return list.sort((p, q) => p.depth - q.depth).map((b) => b.svg).join('');
  }
  const shiftOf = (d) => `translate(${f2(VZ[0] * d)} ${f2(VZ[1] * d)})`;
  // st: { theta, broken, drop, bent, round, crack, pen, dot, flow, push }
  function world(st) {
    const kc = C.AV + st.theta;
    const key = [st.theta.toFixed(3), st.broken, st.bent.toFixed(3)].join();
    const zTop = st.broken ? K.z0 : Z1;
    if (E.lower.__key !== key) { E.lower.innerHTML = impeller(st.theta, st.bent) + shaft(C.IMP.hub[1] - 0.2, zTop); E.lower.__key = key; }
    const t = shiftOf(-st.drop);
    if (E.lower.__t !== t) { E.lower.setAttribute('transform', t); E.lower.__t = t; }
    set(E.upper, st.broken ? shaft(K.z0, Z1) : '');
    set(E.kw, keyway(kc, st.round) + (st.dot ? cornerDot(kc) : ''));
    set(E.crk, st.broken ? '' : crackSvg(kc, st.crack, st.pen));
    set(E.flow, flowSvg(st.flow) + pushSvg(st.push));
    set(E.bolts, bolts(st.theta));
  }

  // ------------------------------------------------------------ the card: the load-cycle counter
  const TX0 = 236;
  const TX1 = 612;
  const TY = 214;
  const TA = 58;
  function cyclePanel(count) {
    return PANEL() + exTag() + txt(224, 48, tr('lastwisselingen', 'load cycles'), 22, 'start', 'fa-mute') + txt(224, 96, count, 40, 'start', 'fa-big');
  }
  function cycleTrace(theta, note, sum) {
    let out = line(TX0, TY, TX1, TY) + txt(TX0 + 4, TY - TA - 14, tr('trek', 'tension'), 22, 'start', 'fa-mute') + txt(TX0 + 4, TY + TA + 32, tr('druk', 'compression'), 22, 'start', 'fa-mute');
    // the last two turns, ending at the current angle on the right
    const pts = [];
    for (let i = 0; i <= 80; i++) { const ph = theta - 4 * Math.PI * (1 - i / 80); pts.push([lerp(TX0 + 110, TX1, i / 80), TY - TA * Math.cos(ph)]); }
    out += `<path class="fa-line" d="${fmt(pts)}"/>` + dot(TX1, TY - TA * Math.cos(theta), 7, 'fa-acc');
    if (note > 0.01) out += op(note, txt(418, 352, tr('1 omwenteling = 1 lastwisseling', '1 revolution = 1 load cycle'), 22, 'middle', 'fa-on'));
    if (sum > 0.01) out += op(sum, rect(214, 320, 408, 56, 'fa-accf', 6) + txt(418, 356, `${group(C.RPM)} × 60 × 24 = ${group(C.PER_DAY)}`, 24, 'middle', 'fa-on'));
    return out;
  }

  // ------------------------------------------------------------ the card: a plate with a hole
  const kirsch = (r) => 1 + 0.5 * r ** -2 + 1.5 * r ** -4;
  function kerfSvg(bars, chips) {
    let out = PANEL() + exTag();
    const HX = 330;
    const HY = 214;
    const HR = 24;
    out += rect(236, 60, 188, 236, 'fa-solid', 4) + `<circle class="fa-slot" cx="${HX}" cy="${HY}" r="${HR}"/>`;
    // the pull on both ends
    const arrow = (x0, x1) => { const s = Math.sign(x1 - x0); return `<path class="fa-axis" style="stroke-width:2.2" d="M${x0} ${HY}H${x1}M${x1 - s * 8} ${HY - 6}L${x1} ${HY}L${x1 - s * 8} ${HY + 6}"/>`; };
    out += arrow(232, 212) + arrow(428, 450) + txt(214, HY - 14, 'F', 22, 'middle', 'fa-mute') + txt(446, HY - 14, 'F', 22, 'middle', 'fa-mute');
    if (bars > 0.01) {
      let b = '';
      [1, 1.5, 2, 3, 4.6].forEach((r, i) => {
        const y = HY - HR * r + (i === 0 ? 5 : 0);
        const len = 28 * kirsch(r) * bars;
        b += `<rect class="fp-meter"${i === 0 ? ' data-top=""' : ''} x="${HX}" y="${f1(y - 4)}" width="${f1(len)}" height="8" rx="2"/>`;
      });
      b += txt(470, HY - HR + 13, tr('3× aan de rand', '3× at the edge'), 22, 'start', 'fa-on') + txt(470, HY - HR * 4.6 + 8, tr('1× verderop', '1× further off'), 22, 'start', 'fa-txt');
      out += op(bars, b);
    }
    if (chips > 0.01) {
      const rows = [tr('gat|schroefdraad|lasteen', 'hole|thread|weld toe'), tr('kras|putcorrosie|spiebaan', 'scratch|corrosion pit|keyway')];
      let c = '';
      rows.forEach((row, ri) => {
        let x = 216;
        for (const w of row.split('|')) {
          const wd = w.length * 11 + 22;
          c += rect(x, 312 + ri * 38, wd, 32, 'fa-tile', 6) + txt(x + wd / 2, 334 + ri * 38, w, 20, 'middle', 'fa-txt');
          x += wd + 8;
        }
      });
      out += op(chips, c);
    }
    return out;
  }

  // ------------------------------------------------------------ the card: the fracture surface
  const FC = [330, 210];
  const FR = 102;
  const NOTCH = { x0: 317, x1: 343, y0: FC[1] - FR - 2, y1: FC[1] - FR + 15 };
  const ORG = [NOTCH.x1, NOTCH.y1];
  const FAR = Math.hypot(ORG[0] - FC[0], ORG[1] - FC[1]) + FR;
  const RING_R = Array.from({ length: C.RINGS }, (_, i) => FAR * C.CRACK_END * Math.pow((i + 1) / C.RINGS, 0.85));
  function faceBase() {
    let out = PANEL() + exTag() + `<defs><clipPath id="faClip"><circle cx="${FC[0]}" cy="${FC[1]}" r="${FR}"/></clipPath></defs>`;
    out += `<circle class="fa-face" cx="${FC[0]}" cy="${FC[1]}" r="${FR}"/>`;
    return out;
  }
  // grains of the final zone: fixed pseudo-random points
  const GRAINS = [];
  {
    let s = 7;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 520; i++) {
      const a = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd()) * (FR - 3);
      GRAINS.push([FC[0] + r * Math.cos(a), FC[1] + r * Math.sin(a), 0.9 + rnd() * 1.4]);
    }
  }
  function marksSvg(g, rings, front) {
    const a = FAR * g;
    let out = `<g clip-path="url(#faClip)"><circle class="fa-smooth" cx="${ORG[0]}" cy="${ORG[1]}" r="${f1(a)}"/>`;
    for (let i = 0; i < rings; i++) if (RING_R[i] < a) out += `<circle class="fa-mark" cx="${ORG[0]}" cy="${ORG[1]}" r="${f1(RING_R[i])}"/>`;
    if (front) out += `<circle class="fa-accl" style="stroke-width:2" cx="${ORG[0]}" cy="${ORG[1]}" r="${f1(a)}"/>`;
    out += '</g>';
    out += `<rect class="fa-solid" x="${NOTCH.x0}" y="${NOTCH.y0}" width="${NOTCH.x1 - NOTCH.x0}" height="${NOTCH.y1 - NOTCH.y0}" rx="1"/>`;
    out += dot(ORG[0], ORG[1], 6, 'fa-acc') + txt(ORG[0] + 14, ORG[1] - 14, 'start', 22, 'start', 'fa-on');
    return out;
  }
  function restSvg(g, grains, labelA) {
    const a = FAR * g;
    let out = '';
    if (grains > 0.01) {
      let d = '';
      for (const [x, y, r] of GRAINS) if (Math.hypot(x - ORG[0], y - ORG[1]) > a + 2) d += `<circle class="fa-grain" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
      out += op(grains, d);
    }
    if (labelA > 0.01) out += op(labelA, txt(FC[0], FC[1] + FR + 34, tr('restbreuk', 'final zone'), 22, 'middle', 'fa-txt'));
    return out;
  }
  function timelineSvg(prog, stops) {
    const x0 = 452;
    const x1 = 616;
    let out = txt(x1, 64, tr('maanden →', 'months →'), 20, 'end', 'fa-mute');
    out += rect(x0, 76, x1 - x0, 12, 'fa-tile', 3) + rect(x0, 76, (x1 - x0) * prog, 12, 'fp-meter', 3);
    for (let i = 0; i < stops; i++) { const x = x0 + (x1 - x0) * ((i + 1) / (C.RINGS + 1)); if (x <= x0 + (x1 - x0) * prog + 0.5) out += line(x, 70, x, 94, 'fa-accl'); }
    out += txt(x0, 116, tr('| = stop', '| = stop'), 20, 'start', 'fa-mute');
    return out;
  }
  function miniSvg(a) {
    if (a <= 0.01) return '';
    const mini = (cx, cy, frac, name) => {
      const o = [cx + 4, cy - 34];
      const far = Math.hypot(o[0] - cx, o[1] - cy) + 40;
      let grains = '';
      for (const [gx, gy, gr] of GRAINS) {
        const x = cx + (gx - FC[0]) * 0.38;
        const y = cy + (gy - FC[1]) * 0.38;
        if (Math.hypot(x - o[0], y - o[1]) > far * frac + 1) grains += `<circle class="fa-grain" cx="${f1(x)}" cy="${f1(y)}" r="${f1(gr * 0.6)}"/>`;
      }
      return `<circle class="fa-face" cx="${cx}" cy="${cy}" r="40"/>`
        + `<g clip-path="url(#faMini${cx}${cy})"><circle class="fa-smooth" cx="${o[0]}" cy="${o[1]}" r="${f1(far * frac)}"/></g>` + grains
        + `<defs><clipPath id="faMini${cx}${cy}"><circle cx="${cx}" cy="${cy}" r="40"/></clipPath></defs>`
        + txt(cx, cy + 66, name, 22, 'middle', 'fa-txt');
    };
    return op(a, mini(548, 178, 0.82, tr('lage spanning', 'low stress')) + mini(548, 296, 0.32, tr('hoge spanning', 'high stress')));
  }

  // ------------------------------------------------------------ the card: the S-N curve
  const OX = 274;
  const OY = 296;
  const XR = 612;
  const YT = 66;
  const ex = (lg) => OX + (XR - OX) * (lg - 3) / 6;
  const sy = (f) => OY - (OY - YT) * f;
  const steel = (lg) => (lg <= 6.5 ? 0.9 - 0.4 * (lg - 3) / 3.5 : 0.5);
  const alu = (lg) => 0.72 - 0.42 * (lg - 3) / 6;
  const curve = (f, a, b, scale = 1) => { const pts = []; for (let i = 0; i <= 60; i++) { const lg = lerp(a, b, i / 60); pts.push([ex(lg), sy(f(lg) * scale)]); } return fmt(pts); };
  function snBase() {
    let out = PANEL() + exTag();
    out += line(OX, YT - 10, OX, OY) + line(OX, OY, XR, OY);
    for (let lg = 3; lg <= 9; lg++) out += line(ex(lg), OY, ex(lg), OY + 6);
    for (const lg of [3, 5, 7, 9]) out += txt(ex(lg), OY + 30, `10${['³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'][lg - 3]}`, 20, 'middle', 'fa-mute');
    out += txt(OX + 10, YT - 20, tr('spanning', 'stress'), 22, 'start', 'fa-mute');
    out += txt(XR, OY + 62, tr('wisselingen tot breuk →', 'cycles to failure →'), 22, 'end', 'fa-mute');
    return out;
  }
  function steelSvg(prog, real) {
    let out = '';
    if (prog > 0.01) out += `<path class="fa-line" d="${curve(steel, 3, lerp(3, 9, prog))}"/>`;
    if (prog > 0.95) out += txt(ex(4.1), sy(steel(4.1)) - 16, tr('staal', 'steel'), 22, 'start', 'fa-txt');
    return out + op(real, `<path class="fa-ghost" d="${curve(steel, 3, 9, 0.62)}"/>` + txt(ex(8.9), sy(0.5 * 0.62) + 30, tr('echt onderdeel', 'real part'), 22, 'end', 'fa-txt'));
  }
  function limSvg(a, knee) {
    let out = '';
    if (knee > 0.01) out += op(knee, `<rect class="fa-band" x="${f1(ex(6))}" y="${YT}" width="${f1(ex(7) - ex(6))}" height="${OY - YT}"/>` + dot(ex(7), sy(0.5), 6));
    if (a > 0.01) out += op(a, `<path class="fa-lim" d="M${OX} ${f1(sy(0.5))}H${XR}"/>` + txt(OX - 8, sy(0.5) + 8, '½', 24, 'end', 'fa-big') + txt(XR, sy(0.5) - 40, tr('½ treksterkte', '½ tensile strength'), 22, 'end', 'fa-txt'));
    return out;
  }
  function aluSvg(a, vhcf) {
    let out = '';
    if (a > 0.01) out += op(a, `<path class="fa-line" d="${curve(alu, 3, 9)}"/>` + txt(ex(3.15), sy(alu(3.15)) + 34, tr('aluminium', 'aluminium'), 22, 'start', 'fa-txt'));
    if (vhcf > 0.01) out += op(vhcf, `<path class="fa-ghost" d="M${f1(ex(7))} ${f1(sy(0.5))}L${f1(ex(9))} ${f1(sy(0.44))}"/>`);
    return out;
  }

  // ------------------------------------------------------------ the card: the fix
  function fixSvg(b, p) {
    let out = PANEL() + exTag();
    const rowA = (y, t, a, cls = 'fa-tile') => op(a, rect(214, y, 408, 42, cls, 6) + txt(232, y + 28, t, 22, 'start', cls === 'fa-accf' ? 'fa-on' : 'fa-txt'));
    // the two keyway ends, seen from the side
    const sketch = (x, round, hot) => {
      let s = rect(x, 66, 186, 54, 'fa-solid', 3);
      const y0 = 84;
      const sy0 = 18;
      s += round ? `<path class="fa-slot" d="M${x} ${y0}H${x + 110}A9 9 0 0 1 ${x + 110} ${y0 + sy0}H${x}Z"/>` : `<path class="fa-slot" d="M${x} ${y0}H${x + 120}V${y0 + sy0}H${x}Z"/>`;
      if (hot) s += dot(x + 120, y0 + sy0, 6, 'fa-acc');
      return s;
    };
    if (b === 0) out += rowA(74, tr(`2 breuken in ${C.MONTHS} maanden`, `2 failures in ${C.MONTHS} months`), 1, 'fa-tile');
    else out += op(b === 1 ? span(p, 0, 0.2) : 1, sketch(216, false, true) + txt(309, 150, tr('scherpe hoek', 'sharp corner'), 22, 'middle', 'fa-txt') + sketch(428, true, false) + txt(521, 150, tr('afgerond eind', 'rounded end'), 22, 'middle', 'fa-on'));
    out += rowA(178, tr('sterker staal: brak opnieuw', 'stronger steel: broke again'), b === 0 ? span(p, 0.35, 0.6) : 1);
    out += rowA(228, tr('afronding · glad · kogelstralen', 'radius · smooth · shot peening'), b === 1 ? span(p, 0.3, 0.55) : b > 1 ? 1 : 0);
    out += rowA(278, tr('roerder balanceren · uitlijnen', 'balance impeller · align'), b === 2 ? span(p, 0.15, 0.4) : b > 2 ? 1 : 0);
    out += rowA(328, tr('wisselingen? trilling? afronding?', 'cycles? vibration? radius?'), b === 3 ? span(p, 0.15, 0.4) : 0, 'fa-accf');
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['cyc', 'kerf', 'face', 'sn', 'fix'];
  set(E.faBase, faceBase());
  set(E.snBase, snBase());
  const TURN = Math.PI * 2 * 0.4; // radians per second of film: a slow turn to watch
  const tOf = (si, u) => u * D.scenes[si].dur;
  function render(si, u) {
    camera(si, u);
    const { b, p, fr } = beatOf(si, u);
    const vis = {};
    const st = { theta: 0, broken: false, drop: 0, bent: 1, round: 0, crack: 0, pen: 0, dot: false, flow: 0, push: 0 };
    if (si === 0) {
      st.theta = TURN * tOf(si, u);
      st.dot = b >= 2;
      st.push = b === 2 ? span(p, 0, 0.15) : b === 3 ? 1 - span(p, 0, 0.2) : 0;
      vis.cyc = b >= 2 ? (b === 2 ? span(p, 0, 0.12) : 1) : 0;
      if (vis.cyc > 0.01) {
        const t0 = fr[2] * D.scenes[si].dur;
        const turns = Math.max(0, Math.floor((st.theta - TURN * t0) / (Math.PI * 2)));
        const count = b === 3 ? group(Math.round(lerp(turns, C.PER_DAY, span(p, 0.1, 0.75)))) : group(turns);
        set(E.cyIn, cyclePanel(count));
        set(E.cyTrace, cycleTrace(st.theta, b === 2 ? span(p, 0.4, 0.6) : 0, b === 3 ? span(p, 0.5, 0.7) : 0));
      }
    } else if (si === 1) {
      st.flow = b === 1 ? span(p, 0.1, 0.7) : b === 0 ? 0 : 1 - span(p, 0, 0.2) * (b === 2 ? 1 : 1);
      if (b >= 2) st.flow = 0;
      st.dot = b <= 1;
      vis.kerf = b >= 2 ? (b === 2 ? span(p, 0, 0.12) : 1) : 0;
      if (vis.kerf > 0.01) set(E.kfIn, kerfSvg(b === 2 ? span(p, 0.3, 0.7) : 1, b === 3 ? span(p, 0.1, 0.5) : 0));
    } else if (si === 2) {
      const g = b === 0 ? lerp(0, 0.22, span(p, 0.3, 1)) : b === 1 ? lerp(0.22, 0.62, span(p, 0.05, 0.95)) : b === 2 ? lerp(0.62, 0.74, span(p, 0, 1)) : lerp(0.74, C.CRACK_END, span(p, 0, 1));
      st.crack = g;
      vis.face = b >= 1 ? (b === 1 ? span(p, 0, 0.12) : 1) : 0;
      if (vis.face > 0.01) {
        const rings = RING_R.filter((r) => r < FAR * g).length;
        set(E.faMarks, marksSvg(g, rings, true) + timelineSvg(g / C.CRACK_END, rings) + (b >= 1 ? op(b === 1 ? span(p, 0.5, 0.7) : 1, txt(452, 160, tr('rustlijnen', 'beach marks'), 22, 'start', 'fa-on')) : ''));
        set(E.faRest, '');
      }
    } else if (si === 3) {
      vis.face = b <= 2 ? 1 : 1 - span(p, 0, 0.15);
      const g = b === 0 ? lerp(C.CRACK_END, C.CRACK_END + 0.05, span(p, 0.1, 0.9)) : C.CRACK_END + 0.05;
      st.crack = Math.min(1, g);
      st.broken = b === 1 ? p > 0.25 : b === 2;
      st.drop = b === 1 ? 10 * span(p, 0.25, 0.55) : b === 2 ? 10 : 0;
      if (b === 3) { st.crack = 0.3; st.pen = span(p, 0.15, 0.4); }
      if (vis.face > 0.01) {
        set(E.faMarks, marksSvg(g, C.RINGS, b === 0));
        set(E.faRest, restSvg(g, b === 1 ? span(p, 0.25, 0.45) : b >= 2 ? 1 : 0, b === 1 ? span(p, 0.45, 0.65) : b >= 2 ? 1 : 0) + miniSvg(b === 2 ? span(p, 0.1, 0.3) : b > 2 ? 1 : 0));
      }
    } else if (si === 4) {
      st.broken = true;
      st.drop = 10;
      vis.sn = span(u, 0, 0.04);
      set(E.snSteel, steelSvg(b === 0 ? span(p, 0.1, 0.8) : 1, b === 3 ? span(p, 0.2, 0.45) : 0));
      set(E.snLim, limSvg(b >= 1 ? (b === 1 ? span(p, 0.1, 0.35) : 1) : 0, b >= 1 ? (b === 1 ? span(p, 0.5, 0.7) : 1) : 0));
      set(E.snAlu, aluSvg(b >= 2 ? (b === 2 ? span(p, 0.05, 0.35) : 1) : 0, b >= 2 ? (b === 2 ? span(p, 0.55, 0.75) : 1) : 0));
    } else if (si === 5) {
      vis.fix = span(u, 0, 0.04);
      st.crack = b === 0 ? 0.3 * span(p, 0.5, 0.8) : 0;
      st.round = b >= 1 ? (b === 1 ? span(p, 0.15, 0.45) : 1) : 0;
      st.bent = b >= 2 ? (b === 2 ? 1 - span(p, 0.1, 0.4) : 0) : 1;
      if (b >= 2) { const t0 = fr[2] * D.scenes[si].dur; st.theta = TURN * Math.max(0, tOf(si, u) - t0 - 1.5); }
      set(E.fxIn, fixSvg(b, p));
    }
    world(st);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
