// The stage of the film "Een puntlas in 300 ms / A spot weld in 300 ms": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope, the lathe module as G) and a preamble from build.mjs that
// defines P (projection), C (world constants), CAM (one camera move per scene),
// W and H. Moves are placed per caption beat (the beat's share of the scene, as
// the HTML film times it); films/_kit/beatwarp.js maps the narration onto that
// in the video.
/* global G, P, C, CAM, W, H, iso, pathOf, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const el = (k) => svg.querySelector(`[data-k="${k}"]`);
  const E = {};
  ['world', 'dentsB', 'gunBack', 'hosesLow', 'flowLow', 'lowerEl', 'upperEl', 'capU', 'gunTop', 'hoses', 'flow', 'glow', 'current', 'sparks', 'cutter',
    'scrim', 'lead', 'loupe', 'lclipc', 'lbg', 'lBody', 'lNug', 'lFace', 'lSpat', 'lAlign', 'lRing',
    'biw', 'timeline', 'heat', 'stepper', 'counter', 'imprint', 'bench', 'peel', 'button', 'ifrac', 'chisel', 'adapt',
    'lobe', 'lobeChart', 'stack', 'ahss', 'pulse'].forEach((k) => { E[k] = el(k); });
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tr = (nl, en) => (EN ? en : nl);
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const FR = D.scenes.map((sc) => beatStarts(sc, 'nl').map((x) => x / sc.dur));
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
  const txt = (x, y, text, size = 16, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${f1(size)}" text-anchor="${anchor}">${text}</text>`;
  const mark = (d, extra = '') => `<path class="fp-mark" d="${d}"${extra}/>`;
  const line = (x0, y0, x1, y1) => `M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}`;
  const rect = (x, y, w, h, cls = 'fp-card', rx = 10) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}"/>`;
  const fadeG = (o, body) => (o <= 0.001 ? '' : `<g style="opacity:${o.toFixed(2)}">${body}</g>`);
  const { SB, ST, T, STROKE, DRESS_X, WELDS } = C;

  // which caption beat u falls in, and how far through it (0..1)
  function beat(si, u) {
    const fr = FR[si];
    let k = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) k = i;
    const end = k + 1 < fr.length ? fr[k + 1] : 1;
    return { k, p: end > fr[k] ? clamp((u - fr[k]) / (end - fr[k]), 0, 1) : 1 };
  }
  // one weld: close, squeeze, current, hold, open
  function cycle(p) {
    const open = p < 0.2 ? 1 - span(p, 0, 0.2) : p > 0.9 ? span(p, 0.9, 1) : 0;
    const cur = p > 0.35 && p < 0.75 ? 1 : 0;
    return { open, cur, grow: span(p, 0.35, 0.75), done: p >= 0.75, heat: p > 0.35 ? Math.max(0, 1 - Math.max(0, p - 0.75) / 0.2) : 0 };
  }

  // ------------------------------------------------------------ camera
  let camW = W;
  let camNow = { cx: W / 2, cy: H / 2, s: 1 };
  function applyCam(cx, cy, w) {
    camW = w;
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
    camNow = { cx, cy, s };
  }
  function camera(si, u) {
    if (si === 0) {
      const { k, p } = beat(0, u);
      const from = C.INTRO[Math.max(0, k - 1)];
      const to = C.INTRO[k];
      const e = span(p, 0, 0.3);
      applyCam(lerp(from[0], to[0], e), lerp(from[1], to[1], e), lerp(from[2], to[2], e));
      return;
    }
    const c = CAM[si];
    const kk = span(u, c.a ?? 0, c.b ?? 1);
    applyCam(lerp(c.from[0], c.to[0], kk), lerp(c.from[1], c.to[1], kk), lerp(c.from[2], c.to[2], kk));
  }
  const toHud = (p) => { const [x, y] = at(p); return [(x - camNow.cx) * camNow.s + W / 2, (y - camNow.cy) * camNow.s + H / 2]; };

  // ------------------------------------------------------------ the world's live parts
  function dentSvg(x) {
    const ring = (r, z) => { const pts = []; for (let i = 0; i < 20; i++) { const a = (i / 20) * TAU; pts.push(at([x + Math.cos(a) * r, Math.sin(a) * r, z])); } return pth(pts, true); };
    return `<path class="fp-dent" d="${ring(5.2, ST + 0.05)}"/><path class="fp-hatch" d="${ring(3.2, ST + 0.06)}"/>`;
  }
  function sparksSvg(o, amount, clockS) {
    if (amount <= 0.01) return '';
    const n = Math.round(10 + 34 * amount);
    const lines = [];
    for (let i = 0; i < n; i++) {
      const a = seeded(i) * TAU;
      const life = (clockS * (1.6 + seeded(i + 9)) + seeded(i + 3)) % 1;
      const reach = (14 + 46 * seeded(i + 5)) * (0.5 + 0.5 * amount);
      const r0 = 6 + reach * life;
      const r1 = r0 + 4 + 8 * amount;
      const lift = 10 * life * (1 - life) * 4 * seeded(i + 7);
      const pt = (r) => at([o[0] + Math.cos(a) * r, o[1] + Math.sin(a) * r, o[2] + lift + (r - 6) * 0.15]);
      lines.push(pth([pt(r0), pt(r1)]));
    }
    return `<path class="fp-spark" d="${lines.join('')}"/>`;
  }
  function glowSvg(o, v) {
    if (v <= 0.01) return '';
    const [x, y] = at(o);
    return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(14 * v)}" ry="${f1(9 * v)}" fill="url(#fp-glow)" style="opacity:${v.toFixed(2)}"/>`;
  }
  function flowSvg(list, gx, clockS) {
    return list.map((h) => `<path class="fp-flow" style="stroke-dashoffset:${f1(-clockS * 14)}" d="${pth(h.map(([x, y, z]) => at([x + gx, y, z])))}"/>`).join('');
  }
  function currentSvg(gx, clockS) {
    return `<path class="fp-cur" style="stroke-dashoffset:${f1(-clockS * 16)}" d="${pth([at([gx, 0, ST + 36]), at([gx, 0, SB - 22])])}"/>`;
  }
  function cutterSvg(spin) {
    const c = [DRESS_X, 0, ST + 0.1];
    const ring = (r) => { const pts = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * TAU; pts.push(at([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, c[2]])); } return pth(pts, true); };
    const blades = [0, 1, 2].map((i) => { const a = spin + (i / 3) * TAU; return pth([at([c[0] + Math.cos(a) * 3, Math.sin(a) * 3, c[2]]), at([c[0] + Math.cos(a) * 11, Math.sin(a) * 11, c[2]])]); }).join('');
    return `<path class="fp-disp" d="${ring(12)}"/><path class="fp-hatch" d="${blades}"/><path class="fp-frame" d="${ring(4.5)}"/>`;
  }

  // ------------------------------------------------------------ the loupe: a section through the tips and the sheets
  // o: { wear 0..1 (mushroom), nug mm, grow 0..1, spat 0..1, stick, align 0..1, cutter, face, faceTag }
  const MM = 10; // px per mm in the loupe
  // a cap in section: the tip face (half-width a mm), a mushroom lip when worn,
  // a 45° flank out to the body (Ø16), the body running out of the loupe
  function capPath(cx, yF, isUpper, a) {
    const s = isUpper ? -1 : 1;
    const A = a * MM;
    const Lp = Math.max(0, a - 3) * 0.7 * MM;
    const R = 8 * MM;
    const h1 = Lp * 0.45;
    const h2 = h1 + (R - A - Lp) * 0.8;
    const pts = [[cx - A, yF], [cx + A, yF], [cx + A + Lp, yF + s * h1], [cx + R, yF + s * h2], [cx + R, yF + s * 200], [cx - R, yF + s * 200], [cx - R, yF + s * h2], [cx - A - Lp, yF + s * h1]];
    return `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}Z`;
  }
  // section hatch over a box, clipped to a path
  function hatched(id, d, cls, x0, y0, w, h, step, dir) {
    const lines = [];
    for (let k = -h; k < w; k += step) lines.push(dir > 0 ? line(x0 + k, y0 + h, x0 + k + h, y0) : line(x0 + k, y0, x0 + k + h, y0 + h));
    return `<clipPath id="${id}"><path d="${d}"/></clipPath><path class="${cls}" d="${d}"/><path class="fp-hatch" clip-path="url(#${id})" d="${lines.join('')}"/>`;
  }
  function loupeSvg(cx, cy, r, o) {
    const t = 1.2 * MM;
    const a = 3 + 0.75 * (o.wear || 0);
    const body = [];
    const box = (x, y, w, h) => `M${f1(x)} ${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
    // sheets (or the dresser's cutter plate)
    if (o.cutter) {
      body.push(hatched('fp-hc', box(cx - r, cy - t, 2 * r, 2 * t), 'fp-steel2', cx - r, cy - t, 2 * r, 2 * t, 8, 1));
      body.push(`<path class="fp-mark" d="${line(cx - 6 * MM, cy - t, cx + 6 * MM, cy - t)}${line(cx - 6 * MM, cy + t, cx + 6 * MM, cy + t)}"/>`);
      body.push(`<rect class="fp-hud-bg" x="${f1(cx + r * 0.32)}" y="${f1(cy - 9)}" width="56" height="18" rx="4"/>` + txt(cx + r * 0.32 + 28, cy + 5, tr('frees', 'cutter'), 13, 'middle', 'fp-small'));
    } else {
      body.push(hatched('fp-hl', box(cx - r, cy, 2 * r, t), 'fp-steel', cx - r, cy, 2 * r, t, 7, 1));
      body.push(hatched('fp-hu', box(cx - r, cy - t, 2 * r, t), 'fp-steel2', cx - r, cy - t, 2 * r, t, 7, -1));
    }
    // caps: copper in section, each with its cooling-water bore
    const dx = (o.align || 0) * 1.6 * MM;
    const rot = (o.align || 0) * 7;
    const bore = (y, h) => `<rect class="fp-hud-bg" x="${f1(cx - 2.5 * MM)}" y="${f1(y)}" width="${f1(5 * MM)}" height="${f1(h)}" rx="3"/><path class="fp-flow" d="${line(cx, y + 4, cx, y + h - 4)}"/>`;
    const upper = `<g transform="translate(${f1(dx)} 0) rotate(${f1(rot)} ${f1(cx)} ${f1(cy - t)})">${hatched('fp-hcu', capPath(cx, cy - t, true, a), 'fp-cu', cx - r, cy - r, 2 * r, r - t, 9, 1)}${bore(cy - t - 4 * MM - 150, 150)}</g>`;
    const lower = hatched('fp-hcl', capPath(cx, cy + t, false, a), 'fp-cu', cx - r, cy + t, 2 * r, r, 9, 1) + bore(cy + t + 4 * MM, 150);
    body.push(upper, lower);
    set(E.lBody, body.join(''));
    // the nugget
    let nug = '';
    const g = o.grow ?? 1;
    if (g > 0.01 && !o.cutter) {
      const d = o.nug * g;
      const rx = (d / 2) * MM * (o.align ? 1 - 0.18 * o.align : 1);
      const ry = Math.min(t * 0.78, rx * 0.42) * (o.stick ? 0.6 : 1);
      const ncx = cx + dx * 0.4;
      nug = `<ellipse class="${(o.hot ?? 0) > 0.3 ? 'fp-nug' : 'fp-nugc'}" cx="${f1(ncx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}"/>`;
      if (o.tag) nug += `<rect class="fp-hud-bg" x="${f1(ncx - 46)}" y="${f1(cy + t + 8)}" width="92" height="20" rx="4"/>` + txt(ncx, cy + t + 23, o.tag, 15, 'middle', 'fp-label');
    }
    set(E.lNug, nug);
    // the tip face and the current through it
    let face = '';
    if (o.face) {
      const y0 = cy - t;
      const n = 7;
      const lines = [];
      for (let i = 0; i < n; i++) { const x = cx - a * MM * 0.9 + (i / (n - 1)) * a * MM * 1.8; lines.push(line(x, y0 - 1.5 * MM, x, cy + t + 1.5 * MM)); }
      face = `<path class="fp-cur" style="stroke-dashoffset:${f1(-o.clock * 20)}" d="${lines.join('')}"/>`
        + mark(line(cx - a * MM, y0 - 4.2 * MM, cx + a * MM, y0 - 4.2 * MM) + line(cx - a * MM, y0 - 3.4 * MM, cx - a * MM, y0 - 5 * MM) + line(cx + a * MM, y0 - 3.4 * MM, cx + a * MM, y0 - 5 * MM))
        + `<rect class="fp-hud-bg" x="${f1(cx - 34)}" y="${f1(y0 - 4.2 * MM - 24)}" width="68" height="20" rx="4"/>`
        + txt(cx, y0 - 4.2 * MM - 9, `Ø${num(2 * a, a > 3.01 ? 1 : 0)} mm`, 15);
    }
    set(E.lFace, face);
    // expulsion: molten drops squirt out along the interface
    let sp = '';
    if ((o.spat || 0) > 0.01) {
      const drops = [];
      for (let i = 0; i < 22; i++) {
        const side = i % 2 ? 1 : -1;
        const life = ((o.clock || 0) * (1.3 + seeded(i)) + seeded(i + 4)) % 1;
        const x = cx + side * ((o.nug / 2) * MM + life * (r - (o.nug / 2) * MM) * 1.1);
        const y = cy + (seeded(i + 8) - 0.5) * 30 * life;
        drops.push(`<circle class="fp-drop fp-ink" cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.6 + 1.4 * (1 - life))}"/>`);
      }
      sp = fadeG(o.spat, `<path class="fp-spark" d="${line(cx - r, cy, cx - (o.nug / 2) * MM, cy)}${line(cx + (o.nug / 2) * MM, cy, cx + r, cy)}"/>${drops.join('')}`);
    }
    set(E.lSpat, sp);
    set(E.lAlign, o.align ? fadeG(o.align, mark(line(cx, cy - r, cx, cy + r), ' style="stroke-dasharray:4 4"') + mark(line(cx + dx - Math.sin(rot * Math.PI / 180) * r, cy - r, cx + dx, cy - t))) : '');
    set(E.lRing, `<circle class="fp-frame" cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}"/>${o.label ? `<rect class="fp-hud-bg" x="${f1(cx - 52)}" y="${f1(cy + r - 30)}" width="104" height="22" rx="5"/>` + txt(cx, cy + r - 14, o.label, 15, 'middle', 'fp-mono') : ''}`);
  }
  function placeLoupe(cx, cy, r) {
    for (const e of [E.lclipc, E.lbg]) { e.setAttribute('cx', cx); e.setAttribute('cy', cy); e.setAttribute('r', r); }
  }
  function leadTo(p, cx, cy, r) {
    const [tx, ty] = toHud(p);
    const ang = Math.atan2(ty - cy, tx - cx);
    set(E.lead, `<path class="fp-mark" d="${line(tx, ty, cx + Math.cos(ang) * r, cy + Math.sin(ang) * r)}"/><circle class="fp-ink" cx="${f1(tx)}" cy="${f1(ty)}" r="2.5"/>`);
  }

  // ------------------------------------------------------------ HUD cards
  // body-in-white: a car body seen from the side, its welds appearing
  const BIW = { x: 318, y: 26, w: 300, h: 200 };
  const carPts = [[14, 132], [10, 104], [26, 92], [70, 86], [104, 58], [150, 50], [196, 52], [232, 82], [272, 90], [290, 104], [288, 132]];
  const wheel = (cx) => `M${cx - 26} 132A26 26 0 0 1 ${cx + 26} 132`;
  const BIW_DOTS = (() => {
    const out = [];
    const seg = (a, b, n) => { for (let i = 0; i < n; i++) out.push([lerp(a[0], b[0], (i + 0.5) / n), lerp(a[1], b[1], (i + 0.5) / n)]); };
    seg([84, 132], [210, 132], 14); seg([104, 60], [196, 54], 10); seg([70, 88], [104, 60], 4); seg([196, 54], [232, 82], 4);
    seg([148, 52], [150, 128], 8); seg([106, 62], [100, 128], 7); seg([228, 82], [232, 128], 5); seg([26, 94], [70, 88], 5); seg([234, 84], [286, 102], 5);
    seg([16, 120], [52, 132], 3); seg([254, 132], [286, 124], 3);
    return out;
  })();
  function biwSvg(p, o) {
    const { x, y, w, h } = BIW;
    const tx = (q) => [x + 6 + q[0], y + 22 + q[1] * 0.9];
    const outline = carPts.map(tx);
    const n = Math.round(BIW_DOTS.length * p);
    const dots = BIW_DOTS.slice(0, n).map((q) => { const [a, b] = tx(q); return `<circle class="fp-ink" cx="${f1(a)}" cy="${f1(b)}" r="1.9"/>`; }).join('');
    const count = Math.round(lerp(0, 4500, p) / 50) * 50;
    const fmt = (v) => (EN ? v.toLocaleString('en-GB') : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
    return fadeG(o, rect(x, y, w, h) + `<path class="fp-trace" d="${pth(outline)}"/><g transform="translate(${x + 6} ${y + 22}) scale(1 0.9)"><path class="fp-mark" d="${wheel(60)}${wheel(232)}"/></g>`
      + dots + txt(x + w / 2, y + h - 14, `${fmt(count)} ${tr('punten', 'welds')}`, 18) + txt(x + 14, y + 22, 'body-in-white', 16, 'start', 'fp-small'));
  }
  // squeeze, weld, hold: force and current against time, with a playhead
  const CARD = { x: 330, y: 282, w: 294, h: 108 };
  function timelineSvg(p, o) {
    const { x, y, w, h } = CARD;
    const x0 = x + 14;
    const x1 = x + w - 14;
    const yb = y + h - 26;
    const ph = [0, 0.2, 0.35, 0.75, 0.9, 1];
    const X = (q) => lerp(x0, x1, q);
    const force = pth([[X(0), yb], [X(0.12), yb], [X(0.2), yb - 44], [X(0.9), yb - 44], [X(0.97), yb]]);
    const cur = pth([[X(0), yb], [X(0.35), yb], [X(0.35), yb - 62], [X(0.75), yb - 62], [X(0.75), yb], [X(1), yb]]);
    const lab = [[tr('knijpen', 'squeeze'), 0.12], [tr('stroom', 'weld'), 0.5], [tr('vasthouden', 'hold'), 0.83]];
    return fadeG(o, rect(x, y, w, h) + `<path class="fp-grid" d="${ph.slice(1, 5).map((q) => line(X(q), y + 10, X(q), yb)).join('')}${line(x0, yb, x1, yb)}"/>`
      + `<path class="fp-trace2" d="${force}"/><path class="fp-trace" d="${cur}"/>`
      + lab.map(([s, q]) => txt(X(q), yb + 18, s, 15, 'middle', 'fp-small')).join('')
      + txt(X(0.55), yb - 68, `${num(9.5, 1)} kA · 300 ms`, 15, 'middle', 'fp-small')
      + mark(line(X(p), y + 8, X(p), yb + 2), ' style="stroke-width:2"'));
  }
  function heatSvg(p, o) {
    const { x, y, w, h } = CARD;
    const yb = y + h - 26;
    const bar = (bx, v, lab, cls) => `<rect class="${cls}" x="${f1(bx)}" y="${f1(yb - v)}" width="30" height="${f1(v)}"/>${txt(bx + 15, yb - v - 6, lab, 15, 'middle', 'fp-small')}`;
    const g1 = lerp(50, 55, span(p, 0.2, 0.6));
    const g2 = lerp(50, 60.5, span(p, 0.2, 0.6));
    return fadeG(o, rect(x, y, w, h) + `<path class="fp-grid" d="${line(x + 14, yb, x + w - 14, yb)}"/>`
      + bar(x + 30, 50, '100', 'fp-bar') + bar(x + 66, g1, `${Math.round(100 + 10 * span(p, 0.2, 0.6))}`, 'fp-fill')
      + bar(x + 160, 50, '100', 'fp-bar') + bar(x + 196, g2, `${Math.round(100 + 21 * span(p, 0.2, 0.6))}`, 'fp-fill')
      + txt(x + 63, yb + 18, tr('stroom', 'current'), 16, 'middle', 'fp-small') + txt(x + 193, yb + 18, tr('warmte', 'heat'), 16, 'middle', 'fp-small'));
  }
  // the stepper: current in steps against welds since dressing; it drops back when the tips are dressed
  function stepperSvg(box, p, o, tag) {
    const { x, y, w, h } = box;
    const x0 = x + 40;
    const x1 = x + w - 14;
    const y0 = y + 22;
    const yb = y + h - 26;
    const I = (kA) => lerp(yb - 6, y0 + 6, (kA - 8.8) / (11 - 8.8));
    const N = (n) => lerp(x0, x1, n / 750);
    const pts = [];
    for (let c = 0; c < 3; c++) {
      for (let s = 0; s < 5; s++) {
        const n0 = c * 250 + s * 50;
        const kA = 9 * Math.pow(1 + (0.5 / 6) * (s / 4), 2);
        pts.push([N(n0), I(kA)], [N(n0 + 50), I(kA)]);
      }
    }
    const shown = pts.filter(([px]) => px <= lerp(x0, x1, p) + 0.01);
    if (shown.length && shown[shown.length - 1][0] < lerp(x0, x1, p)) shown.push([lerp(x0, x1, p), shown[shown.length - 1][1]]);
    return fadeG(o, rect(x, y, w, h) + `<path class="fp-grid" d="${line(x0, I(9), x1, I(9))}${line(x0, I(10.6), x1, I(10.6))}${line(x0, yb, x1, yb)}${line(x0, y0, x0, yb)}"/>`
      + txt(x0 - 6, I(9) + 5, num(9, 1), 15, 'end', 'fp-small') + txt(x0 - 6, I(10.6) + 5, num(10.6, 1), 15, 'end', 'fp-small')
      + txt(x0 - 6, y0 + 2, 'kA', 14, 'end', 'fp-small') + txt(x1, y + 16, tr('punten sinds frezen', 'welds since dressing'), 15, 'end', 'fp-small')
      + [250, 500].map((n) => txt(N(n), yb + 18, String(n), 15, 'middle', 'fp-small')).join('')
      + (shown.length > 1 ? `<path class="fp-trace" d="${pth(shown)}"/>` : '')
      + (tag ? txt(x + w / 2, y + 16, tag, 15, 'middle', 'fp-small') : ''));
  }
  function counterSvg(n, o) {
    const x = 430;
    const y = 22;
    const label = n >= 200 ? tr('FREZEN', 'DRESS') : String(n).padStart(4, '0');
    return fadeG(o, rect(x, y, 190, 78, 'fp-card') + rect(x + 12, y + 30, 166, 38, 'fp-disp', 4)
      + txt(x + 14, y + 20, tr('puntenteller', 'weld counter'), 16, 'start', 'fp-small') + txt(x + 176, y + 20, '/ 200', 16, 'end', 'fp-small')
      + txt(x + 95, y + 58, label, 26, 'middle', 'fp-mono'));
  }
  function imprintSvg(p, o) {
    const x = 422;
    const y = 30;
    const w = 196;
    const h = 170;
    const good = span(p, 0.05, 0.35);
    const bad = span(p, 0.45, 0.75);
    const ring = (cx, cy, rx, ry) => `<ellipse class="fp-print" cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}"/>`;
    const ref = (cx, cy) => `<circle class="fp-zone2" cx="${cx}" cy="${cy}" r="26"/>${mark(line(cx - 32, cy, cx + 32, cy) + line(cx, cy - 32, cx, cy + 32), ' style="opacity:.5"')}`;
    return fadeG(o, `<path class="fp-paper" d="M${x} ${y}h${w}v${h - 14}l-14 14h-${w - 14}z"/>`
      + ref(x + 52, y + 80) + ref(x + 146, y + 80)
      + fadeG(good, ring(x + 52, y + 80, 26, 26)) + fadeG(bad, ring(x + 152, y + 84, 30, 21))
      + fadeG(good, txt(x + 52, y + 130, tr('rond,', 'round,'), 15, 'middle', 'fp-small') + txt(x + 52, y + 148, tr('op maat', 'true size'), 15, 'middle', 'fp-small'))
      + fadeG(bad, txt(x + 146, y + 130, tr('ovaal,', 'oval,'), 15, 'middle', 'fp-small') + txt(x + 146, y + 148, tr('scheef', 'off-centre'), 15, 'middle', 'fp-small'))
      + txt(x + 12, y + 22, tr('kapafdruk', 'tip imprint'), 17, 'start', 'fp-small'));
  }

  // ------------------------------------------------------------ the test bench (scene 7)
  // two strips in side view: the lower one clamped, the upper one peeled back
  function peelSvg(bx, by, p, fracture, o) {
    const len = 240;
    const t = 10;
    const wx = bx + 120; // the weld
    const lift = span(p, 0, 1);
    const parts = [];
    parts.push(rect(bx, by + 60, len, t, 'fp-steel', 1)); // lower strip
    parts.push(rect(bx - 8, by + 52, 26, 24, 'fp-bar', 3)); // vice jaw
    // the upper strip: flat to the weld, then curling up from it
    const curl = [];
    const r0 = 50;
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 0.55 * lift;
      curl.push([wx + Math.sin(a) * r0, by + 60 - t - (1 - Math.cos(a)) * r0]);
    }
    const tail = curl[curl.length - 1];
    const ang = Math.PI * 0.55 * lift;
    const end = [tail[0] + Math.cos(ang) * (len - 120 - r0 * ang) * 0.9, tail[1] - Math.sin(ang) * (len - 120 - r0 * ang) * 0.9];
    parts.push(`<path class="fp-steel2" style="stroke-width:${t}" d=""/>`);
    parts.push(rect(bx + 20, by + 60 - t, wx - bx - 20, t, 'fp-steel2', 1));
    parts.push(`<path class="fp-trace" style="stroke-width:${t + 2};stroke:var(--anatomy-mid)" d="${pth([...curl, end])}"/><path class="fp-trace" style="stroke-width:${t - 1};stroke:var(--anatomy-shade-3)" d="${pth([...curl, end])}"/>`);
    let btn = '';
    if (lift > 0.25) {
      if (!fracture) {
        // the button rides on the peeled strip; a hole stays in the lower strip
        const [hx, hy] = curl[Math.min(curl.length - 1, 3)];
        parts.push(rect(wx - 11, by + 60, 22, t * 0.7, 'fp-hud-bg', 2));
        btn = `<rect class="fp-nugc" x="${f1(hx - 11)}" y="${f1(hy + 2)}" width="22" height="${f1(t * 0.9)}" rx="4"/>`;
      } else {
        // interfacial fracture: a flat half on each side, no plug
        parts.push(rect(wx - 11, by + 59, 22, 2, 'fp-nugc', 1));
        const [hx, hy] = curl[Math.min(curl.length - 1, 3)];
        btn = `<rect class="fp-nugc" x="${f1(hx - 11)}" y="${f1(hy + 3)}" width="22" height="2" rx="1"/>`;
      }
    }
    return fadeG(o, parts.join('') + btn);
  }
  function benchSvg(si, u, k, p, clockS) {
    const panel = (x, y, w, h, title, body, o) => fadeG(o, rect(x, y, w, h) + txt(x + 12, y + 20, title, 17, 'start', 'fp-small') + body);
    const A = { x: 20, y: 50, w: 296, h: 156 };
    const Bp = { x: 324, y: 50, w: 296, h: 156 };
    const Cp = { x: 20, y: 214, w: 296, h: 162 };
    const Dp = { x: 324, y: 214, w: 296, h: 162 };
    const oA = span(u, 0, 0.04);
    const peelP = k === 0 ? span(p, 0.1, 0.7) : 1;
    set(E.peel, panel(A.x, A.y, A.w, A.h, tr('peeltest', 'peel test'), peelSvg(A.x + 30, A.y + 58, peelP, false, 1), oA));
    // the button, measured across two ways
    const oB = k >= 1 ? span(p, 0, 0.12) || (k > 1 ? 1 : 0) : 0;
    const mB = k === 1 ? span(p, 0.15, 0.85) : k > 1 ? 1 : 0;
    const bcx = Bp.x + 90;
    const bcy = Bp.y + 88;
    const r1 = 5.6 * 7;
    const r2 = 5.2 * 7;
    const cal = mB < 0.5
      ? mark(line(bcx - r1 / 2, bcy - 50, bcx - r1 / 2, bcy + 50) + line(bcx + r1 / 2, bcy - 50, bcx + r1 / 2, bcy + 50))
      : mark(line(bcx - 50, bcy - r2 / 2, bcx + 50, bcy - r2 / 2) + line(bcx - 50, bcy + r2 / 2, bcx + 50, bcy + r2 / 2));
    const readings = [`${num(5.6, 1)}`, mB >= 0.5 ? `${num(5.2, 1)}` : '', mB > 0.85 ? `Ø ${num(5.4, 1)} ≥ ${num(4.9, 1)}` : ''];
    set(E.button, (k === 0 && peelP > 0.6 ? fadeG(span(p, 0.6, 0.75), `<circle class="fp-zone2" cx="${A.x + 150}" cy="${A.y + 116}" r="22"/>`) : '')
      + panel(Bp.x, Bp.y, Bp.w, Bp.h, tr('knoop meten', 'measuring the button'), `<ellipse class="fp-nugc" cx="${bcx}" cy="${bcy}" rx="${f1(r1 / 2)}" ry="${f1(r2 / 2)}"/>${cal}`
        + txt(Bp.x + 200, Bp.y + 70, readings[0] + ' mm', 16, 'middle', 'fp-mono') + txt(Bp.x + 200, Bp.y + 98, readings[1] ? readings[1] + ' mm' : '', 16, 'middle', 'fp-mono')
        + txt(Bp.x + 200, Bp.y + 138, readings[2], 15, 'middle', 'fp-label'), oB));
    // interfacial fracture
    const oC = k >= 2 && k < 4 ? span(p, 0, 0.12) || (k > 2 ? 1 : 0) : 0;
    const fC = k === 2 ? span(p, 0.1, 0.6) : 1;
    set(E.ifrac, panel(Cp.x, Cp.y, Cp.w, Cp.h, tr('grensvlakbreuk', 'interfacial fracture'), peelSvg(Cp.x + 30, Cp.y + 62, fC, true, 1), k >= 4 ? 1 - span(p, 0, 0.15) : oC));
    // chisel: a wedge opens a gap next to the weld
    const oD = k === 3 ? span(p, 0, 0.12) : k > 3 ? 1 - span(p, 0, 0.15) : 0;
    const dW = k === 3 ? span(p, 0.15, 0.7) : 1;
    const wx = Dp.x + 70 + 60 * dW;
    const gap = 18 * dW;
    const dy = Dp.y + 100;
    set(E.chisel, panel(Dp.x, Dp.y, Dp.w, Dp.h, tr('beiteltest', 'chisel test'),
      `<path class="fp-steel" d="M${Dp.x + 20} ${dy + 4}L${Dp.x + 270} ${dy + 4}L${Dp.x + 270} ${dy + 12}L${Dp.x + 20} ${dy + 12}Z"/>`
      + `<path class="fp-steel2" d="M${Dp.x + 20} ${dy - 4}L${Dp.x + 170} ${dy - 4}L${f1(Dp.x + 270)} ${f1(dy - 4 - gap)}L${f1(Dp.x + 270)} ${f1(dy - 12 - gap)}L${Dp.x + 170} ${dy - 12}L${Dp.x + 20} ${dy - 12}Z"/>`
      + `<rect class="fp-nugc" x="${Dp.x + 160}" y="${dy - 4}" width="20" height="8" rx="3"/>`
      + `<path class="fp-bar" d="M${f1(wx + 80)} ${f1(dy - 20)}L${f1(wx)} ${dy}L${f1(wx + 80)} ${f1(dy + 4)}Z"/>`, oD));
    // adaptive control: dynamic resistance through the weld, a band around the good curve
    const oE = k === 4 ? span(p, 0.05, 0.2) : 0;
    const ex = 20;
    const ey = 214;
    const ew = 600;
    const eh = 162;
    const X0 = ex + 50;
    const X1 = ex + ew - 30;
    const Y = (r) => lerp(ey + eh - 30, ey + 40, r);
    const Rof = (q, dev) => 0.35 + 0.45 * Math.sin(Math.min(1, q / 0.35) * Math.PI / 2) - 0.3 * span(q, 0.35, 1) + dev * span(q, 0.2, 0.6) * (1 - span(q, 0.6, 0.85));
    const good = []; const hi = []; const lo = []; const meas = [];
    const prog = span(p, 0.2, 0.8);
    for (let i = 0; i <= 40; i++) {
      const q = i / 40;
      good.push([lerp(X0, X1, q), Y(Rof(q, 0))]);
      hi.push([lerp(X0, X1, q), Y(Rof(q, 0) + 0.07)]);
      lo.push([lerp(X0, X1, q), Y(Rof(q, 0) - 0.07)]);
      if (q <= prog) meas.push([lerp(X0, X1, q), Y(Rof(q, -0.1 * (1 - span(q, 0.45, 0.6))))]);
    }
    set(E.adapt, panel(ex, ey, ew, eh, tr('adaptieve regeling: weerstand tijdens het punt', 'adaptive control: resistance during the weld'),
      `<path class="fp-zone" d="${pth([...hi, ...lo.reverse()], true)}"/><path class="fp-grid" d="${line(X0, ey + eh - 30, X1, ey + eh - 30)}${line(X0, ey + 34, X0, ey + eh - 30)}"/>`
      + (meas.length > 1 ? `<path class="fp-trace" d="${pth(meas)}"/>` : '')
      + txt(X0 - 8, ey + 46, 'R', 16, 'end') + txt(X1, ey + eh - 10, 't', 16, 'end')
      + (prog > 0.5 ? txt(lerp(X0, X1, 0.5), Y(0.12), tr('stroom bijgestuurd', 'current corrected'), 16, 'middle', 'fp-small') : ''), oE));
    void si; void clockS;
  }

  // ------------------------------------------------------------ the lobe (scene 8)
  const LC = { x: 22, y: 50, w: 380, h: 330 };
  function lobeSvg(k, p) {
    const { x, y, w, h } = LC;
    const x0 = x + 50;
    const x1 = x + w - 16;
    const y0 = y + 30;
    const yb = y + h - 40;
    const IX = (kA) => lerp(x0, x1, (kA - 5.5) / 5);
    const TY = (ms) => lerp(yb, y0, (ms - 180) / 240);
    const lobePts = (lo, hi) => {
      const L = []; const R = [];
      for (let ms = 200; ms <= 400; ms += 10) { L.push([IX(lo * Math.sqrt(300 / ms)), TY(ms)]); R.push([IX(hi * Math.pow(300 / ms, 0.25)), TY(ms)]); }
      return [...L, ...R.reverse()];
    };
    const ticks = [6, 7, 8, 9, 10].map((v) => txt(IX(v), yb + 18, String(v), 16, 'middle', 'fp-small')).join('')
      + [200, 300, 400].map((v) => txt(x0 - 8, TY(v) + 4, String(v), 16, 'end', 'fp-small')).join('');
    const grid = [6, 7, 8, 9, 10].map((v) => line(IX(v), y0, IX(v), yb)).join('') + [200, 300, 400].map((v) => line(x0, TY(v), x1, TY(v))).join('');
    const bare = k >= 2 ? fadeG(k === 2 ? span(p, 0.45, 0.6) : 1, `<path class="fp-zone2" d="${pth(lobePts(...C.LOBE.bare), true)}"/>`
      + mark(line(IX(6.9), TY(300) + 14, IX(9.1), TY(300) + 14)) + txt(IX(8), TY(300) + 30, `${num(2.2, 1)} kA`, 16, 'middle', 'fp-small')) : '';
    const galv = `<path class="fp-zone" d="${pth(lobePts(...C.LOBE.galv), true)}"/>`;
    const w300 = k >= 2 ? mark(line(IX(7.6), TY(300) - 12, IX(9.0), TY(300) - 12)) + txt(IX(8.3), TY(300) - 18, `${num(1.4, 1)} kA`, 17, 'middle', 'fp-label') : '';
    const sides = k === 0 ? fadeG(span(p, 0.3, 0.5), txt(IX(6.5), TY(250), tr('te klein', 'too small'), 17, 'middle', 'fp-small') + txt(IX(9.9), TY(250), tr('spatten', 'expulsion'), 17, 'middle', 'fp-small')) : '';
    const setPt = k >= 3 ? fadeG(k === 3 ? span(p, 0.1, 0.3) : 1, `<circle class="fp-ink" cx="${f1(IX(8.7))}" cy="${f1(TY(300))}" r="5"/>` + txt(IX(8.7) + 10, TY(300) - 26, `${num(8.7, 1)} kA`, 17, 'start', 'fp-label')) : '';
    set(E.lobeChart, rect(x, y, w, h) + `<path class="fp-grid" d="${grid}"/>` + ticks + txt(x1, yb + 34, 'kA', 15, 'end', 'fp-small') + txt(x0 - 8, y0 - 10, 'ms', 15, 'end', 'fp-small')
      + fadeG(span(k === 0 ? p : 1, 0, 0.25), galv) + bare + w300 + sides + setPt);
    // the stack-up: the two sheets in section with their names
    const sx = 418;
    const sy = 50;
    const oS = k >= 1 ? (k === 1 ? span(p, 0, 0.15) : 1) : 0;
    set(E.stack, fadeG(oS, rect(sx, sy, 200, 150) + txt(sx + 12, sy + 22, tr('plaatcombinatie', 'stack-up'), 17, 'start', 'fp-small')
      + rect(sx + 20, sy + 52, 160, 22, 'fp-steel2', 2) + rect(sx + 20, sy + 76, 160, 18, 'fp-steel', 2)
      + `<ellipse class="fp-nugc" cx="${sx + 100}" cy="${sy + 75}" rx="30" ry="9"/>`
      + txt(sx + 100, sy + 42, `${num(1.2, 1)} mm DP600 + Zn`, 15, 'middle', 'fp-small') + txt(sx + 100, sy + 112, `${num(1.0, 1)} mm`, 15, 'middle', 'fp-small')
      + txt(sx + 100, sy + 136, '300 ms', 15, 'middle', 'fp-small')));
    set(E.ahss, k >= 2 ? fadeG(k === 2 ? span(p, 0, 0.15) : 1, `<rect class="fp-card" style="fill:none" x="${sx + 16}" y="${sy + 48}" width="168" height="30" rx="4"/>`) : '');
    // the multi-pulse schedule: pre-pulse, weld pulse, post-heat pulse
    const px = 418;
    const py = 212;
    const pw = 200;
    const phh = 168;
    const oP = k >= 4 ? span(p, 0, 0.15) : 0;
    const yb2 = py + phh - 34;
    const Xp = (q) => lerp(px + 16, px + pw - 16, q);
    const pulses = [[0.05, 0.2, 0.45], [0.3, 0.68, 1], [0.78, 0.95, 0.4]];
    const prog = span(p, 0.15, 0.85);
    const tracePts = [[Xp(0), yb2]];
    for (const [a, b, v] of pulses) { tracePts.push([Xp(a), yb2], [Xp(a), yb2 - v * 90], [Xp(b), yb2 - v * 90], [Xp(b), yb2]); }
    tracePts.push([Xp(1), yb2]);
    const clipW = lerp(px + 16, px + pw - 16, prog) - px;
    set(E.pulse, fadeG(oP, rect(px, py, pw, phh) + txt(px + 12, py + 20, tr('meerpulsprogramma', 'multi-pulse schedule'), 17, 'start', 'fp-small')
      + `<clipPath id="fp-pclip"><rect x="${px}" y="${py}" width="${f1(Math.max(1, clipW))}" height="${phh}"/></clipPath><path class="fp-grid" d="${line(Xp(0), yb2, Xp(1), yb2)}"/><path class="fp-trace" clip-path="url(#fp-pclip)" d="${pth(tracePts)}"/>`
      + [[tr('voor', 'pre'), 0.125], [tr('las', 'weld'), 0.49], [tr('na', 'post'), 0.865]].map(([s, q]) => txt(Xp(q), yb2 + 18, s, 16, 'middle', 'fp-small')).join('')));
  }

  // ------------------------------------------------------------ the scenes
  const ALL = ['scrim', 'lead', 'loupe', 'biw', 'timeline', 'heat', 'stepper', 'counter', 'imprint', 'bench', 'lobe', 'cutter'];
  const VIS = [
    [],
    ['biw'],
    ['lead', 'loupe', 'timeline'],
    ['lead', 'loupe', 'heat'],
    ['lead', 'loupe', 'stepper', 'cutter'],
    ['counter', 'stepper', 'imprint', 'lead', 'loupe'],
    ['scrim', 'bench'],
    ['scrim', 'lobe'],
  ];
  const DONE = [[], [0], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7]];
  let shown = -1;

  function render(si, u) {
    if (si !== shown) {
      shown = si;
      for (const key of ALL) show(E[key], VIS[si].includes(key));
    }
    camera(si, u);
    const clockS = u * C.dur[si];
    const { k, p } = beat(si, u);
    let gx = WELDS[7];
    let gz = 0;
    let open = 1;
    let cur = 0;
    let spat = 0;
    let flow = false;
    let currentOn = false;
    let capOff = 0;
    let capO = 1;
    let cutSpin = 0;
    const done = [...DONE[si]];
    const loupe = { on: false };

    if (si === 0) {
      gx = WELDS[0];
      if (k === 3) {
        const c = cycle(span(p, 0.05, 0.95));
        open = c.open;
        cur = c.cur;
        currentOn = c.cur > 0;
        if (c.done) done.push(0);
      } else if (k === 4) {
        done.push(0);
        open = span(p, 0, 0.2);
        flow = true;
      }
    } else if (si === 1) {
      // two welds along the joint while the body-in-white fills with its welds
      const q = span(u, 0.04, 0.96) * 2;
      const i = Math.min(1, Math.floor(q));
      const f = q - i;
      gx = lerp(WELDS[i], WELDS[i + 1], span(f, 0, 0.25));
      const c = cycle(span(f, 0.25, 1));
      open = f < 0.25 ? 1 : c.open;
      cur = f < 0.25 ? 0 : c.cur;
      spat = cur * 0.25;
      if (i === 1 || (f >= 0.25 && c.done)) done.push(1);
      if (i === 1 && f >= 0.25 && c.done) done.push(2);
      set(E.biw, biwSvg(span(u, 0.05, FR[1][1] || 0.5), 1));
    } else if (si === 2) {
      // one weld, slowed down: squeeze in beat 1, the nugget grows in beat 2, held in beat 3
      gx = lerp(WELDS[2], WELDS[3], span(u, 0, 0.06));
      const pc = k === 0 ? lerp(0, 0.35, span(p, 0.15, 1)) : k === 1 ? lerp(0.35, 0.75, span(p, 0.05, 0.9)) : lerp(0.75, 0.88, span(p, 0, 0.4));
      const c = cycle(pc);
      open = u < 0.06 ? 1 : c.open;
      cur = c.cur;
      if (c.done) done.push(3);
      Object.assign(loupe, { on: true, cx: 470, cy: 150, r: 112, nug: C.NUG[0], grow: c.grow, hot: c.heat, face: k === 2, clock: clockS, tag: k >= 1 && c.grow > 0.95 ? `Ø ${num(C.NUG[0], 1)} mm` : '' });
      set(E.timeline, timelineSvg(pc, span(u, 0.02, 0.08)));
    } else if (si === 3) {
      gx = lerp(WELDS[3], WELDS[4], span(u, 0, 0.06));
      let c;
      if (k === 0) { c = cycle(lerp(0, 0.85, span(p, 0.1, 1))); Object.assign(loupe, { nug: C.NUG[0], grow: c.grow, hot: c.heat }); } else if (k === 1) {
        c = { open: 0, cur: 1, done: false };
        spat = span(p, 0.1, 0.25) * (1 - span(p, 0.9, 1));
        Object.assign(loupe, { nug: 6.6, grow: 1, hot: 1, spat });
      } else {
        c = { open: span(p, 0, 0.2), cur: 0, done: true };
        Object.assign(loupe, { nug: 1.6, grow: span(p, 0.1, 0.4), hot: 0, stick: true, label: tr('plakpunt', 'stick weld') });
      }
      open = u < 0.06 ? 1 : c.open;
      cur = c.cur;
      if (c.done) done.push(4);
      Object.assign(loupe, { on: true, cx: 470, cy: 150, r: 112, clock: clockS });
      set(E.heat, heatSvg(k === 0 ? p : 1, k === 0 ? span(p, 0, 0.12) : 1 - span(u, FR[3][1], FR[3][1] + 0.05)));
    } else if (si === 4) {
      // the tip mushrooms over 500 welds; the gun goes to the dresser; the stepper
      done.push(5);
      let wear = 0;
      let count = 0;
      if (k === 0) {
        gx = WELDS[5];
        const c = cycle((p * 5) % 1);
        open = c.open;
        cur = c.cur;
        wear = span(p, 0.05, 0.85);
        count = Math.round(wear * 500);
        Object.assign(loupe, { on: true, cx: 470, cy: 150, r: 112, wear, nug: lerp(C.NUG[0], C.NUG[1], wear), grow: 1, hot: 0, face: true, clock: clockS, label: `${count} ${tr('punten', 'welds')}` });
      } else {
        // over to the dresser, close on the cutter, spin, open
        const m = k === 1 ? span(p, 0, 0.35) : 1;
        gx = lerp(WELDS[5], DRESS_X, m);
        gz = -3 * Math.sin(Math.PI * m);
        const dc = k === 1 ? span(p, 0.4, 0.95) : 1;
        open = k === 1 ? (dc < 0.15 ? 1 - span(dc, 0, 0.15) : dc > 0.85 ? span(dc, 0.85, 1) : 0) : 1;
        cutSpin = k === 1 && dc > 0.15 && dc < 0.85 ? clockS * 9 : 0;
        wear = k === 1 ? 1 - span(dc, 0.2, 0.8) : 0;
        Object.assign(loupe, { on: k === 1 && m > 0.95, cx: 470, cy: 150, r: 112, wear, cutter: true, grow: 0, clock: clockS, label: tr('kappenfrees', 'tip dresser') });
      }
      set(E.stepper, stepperSvg({ x: 330, y: 270, w: 294, h: 120 }, k === 2 ? span(p, 0.05, 0.9) : 1, k >= 2 ? (k === 2 ? span(p, 0, 0.08) : 1) : 0, ''));
    } else if (si === 5) {
      gx = WELDS[7];
      if (k === 0) {
        const c = cycle((p * 3) % 1);
        open = c.open;
        cur = c.cur;
        if (p > 0.3) done.push(7);
      } else done.push(7);
      const n = k === 0 ? Math.min(200, 186 + Math.floor(p * 3) * 6 + (p > 0.9 ? 20 : 0)) : 0;
      set(E.counter, counterSvg(n, k === 0 ? span(p, 0, 0.1) : k === 1 ? 1 - span(p, 0, 0.1) : 0));
      set(E.stepper, stepperSvg({ x: 330, y: 260, w: 294, h: 130 }, k === 1 ? span(p, 0.05, 0.6) * 0.34 : 0.34, k === 1 ? span(p, 0, 0.1) : 0,
        ''));
      if (k === 2) {
        capOff = span(p, 0.1, 0.45) * 40;
        capO = p < 0.5 ? 1 - span(p, 0.3, 0.45) : span(p, 0.55, 0.85);
        if (p >= 0.5) capOff = 0;
      }
      set(E.imprint, imprintSvg(k === 3 ? p : 1, k === 3 ? span(p, 0, 0.1) : 0));
      flow = k === 4;
      if (k === 5) {
        open = 0;
        Object.assign(loupe, { on: true, cx: 500, cy: 160, r: 104, nug: 4.6, grow: 1, hot: 0, align: span(p, 0.1, 0.4), label: tr('scheef', 'skewed') });
      }
    } else if (si === 6) {
      benchSvg(si, u, k, p, clockS);
    } else if (si === 7) {
      lobeSvg(k, p);
    }

    // the gun and its parts
    for (const key of ['gunBack', 'hosesLow', 'lowerEl', 'gunTop', 'hoses']) move(E[key], [gx, 0, gz]);
    move(E.upperEl, [gx, 0, gz + open * STROKE]);
    move(E.capU, [gx + capOff, 0, gz + open * STROKE]);
    op(E.capU, capO);
    set(E.dentsB, done.filter((i, j, a) => a.indexOf(i) === j && !(cur > 0 && WELDS[i] === gx)).map((i) => dentSvg(WELDS[i])).join(''));
    const tip = [gx, 0, SB + T];
    set(E.glow, glowSvg(tip, cur));
    set(E.sparks, sparksSvg(tip, spat, clockS));
    set(E.current, currentOn ? currentSvg(gx, clockS) : '');
    set(E.flowLow, flow ? flowSvg(C.HOSES.slice(0, 2), gx, clockS) : '');
    set(E.flow, flow ? flowSvg(C.HOSES.slice(2), gx, clockS) : '');
    if (si === 4) set(E.cutter, cutterSvg(cutSpin));
    op(E.scrim, si >= 6 ? span(u, 0, 0.04) : 0);

    // the loupe and its leader
    if (VIS[si].includes('loupe')) {
      show(E.loupe, loupe.on);
      show(E.lead, loupe.on);
      if (loupe.on) {
        placeLoupe(loupe.cx, loupe.cy, loupe.r);
        loupeSvg(loupe.cx, loupe.cy, loupe.r, loupe);
        leadTo(tip, loupe.cx, loupe.cy, loupe.r);
      }
    }
  }
  return { render };
})();
