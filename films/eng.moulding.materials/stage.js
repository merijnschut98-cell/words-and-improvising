// The stage of the film "Van korrel tot smelt / From pellet to melt": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope), a preamble from build.mjs that defines P (projection),
// C (world constants, the model, the beat cameras), W and H, and the kit's
// audio warp.
//
// Each scene is a row of beats; the beat on screen (and how far through it)
// comes from the caption beat starts, so a move lands on the line that names
// it. The press and its dryer are the world (one camera framing per beat); the
// cards over it are drawn in stage space, 640 × 400.
/* global P, C, W, H, iso, pathOf, span, beatStarts, warpU, introBeat, introCamera */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tx = (nl, en) => (EN ? en : nl);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const num = (v, dec = 0) => {
    const [i, d] = Math.abs(v).toFixed(dec).split('.');
    const grouped = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.') : i;
    return (v < 0 ? '−' : '') + grouped + (d ? (EN ? '.' : ',') + d : '');
  };
  const at = (p) => iso(p, P);
  const set = (e, html) => { if (e && e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const M = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
  const mark = (d, cls = 'fp-mark', extra = '') => (d ? `<path class="${cls}" d="${d}"${extra}/>` : '');
  const T = (x, y, text, size = 21, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink fp-tx ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
  const card = (x, y, w, h, r = 12) => `<rect class="fp-hud-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fp-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const R = (x, y, w, h, cls, rx = 3) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${rx}"/>`;
  const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const head = (x0, y0, x1, y1, len) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    return `M${f1(x1 - ux * len - uy * len * 0.55)} ${f1(y1 - uy * len + ux * len * 0.55)}L${f1(x1)} ${f1(y1)}L${f1(x1 - ux * len + uy * len * 0.55)} ${f1(y1 - uy * len - ux * len * 0.55)}`;
  };
  const arrow = (x0, y0, x1, y1, len = 9, cls = 'fp-arrow') => mark(`M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head(x0, y0, x1, y1, len)}`, cls);
  const tick = (x, y) => mark(`M${f1(x)} ${f1(y)}l6 6l12 -14`, 'fp-arrow');
  const cross = (x, y) => mark(`M${f1(x)} ${f1(y - 7)}l14 14M${f1(x + 14)} ${f1(y - 7)}l-14 14`, 'fp-arrow');
  // seeded random, so every frame draws the same chains and fibres
  const rng = (seed) => { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };

  // ------------------------------------------------------------ the right-hand card and the full card
  const CX = 372;
  const CW = 256;
  const CM = CX + CW / 2;
  const rightCard = (y = 14, h = 372) => card(CX, y, CW, h);
  // a full card hides the world behind it completely
  const FULL = (h = 372) => card(14, 14, 612, h).replace('fp-hud-bg', 'fp-hud-bg fp-solid');

  // ------------------------------------------------------------ small drawings
  // a pellet as a short cylinder seen from the side, w × h
  const pellet = (x, y, w, h, cls = 'fp-shape2') => {
    const ry = h * 0.22;
    return `<path class="${cls}" d="M${f1(x)} ${f1(y + ry)}A${f1(w / 2)} ${f1(ry)} 0 0 1 ${f1(x + w)} ${f1(y + ry)}L${f1(x + w)} ${f1(y + h - ry)}A${f1(w / 2)} ${f1(ry)} 0 0 1 ${f1(x)} ${f1(y + h - ry)}Z"/>`
      + `<path class="fp-hatchc" d="M${f1(x)} ${f1(y + ry)}A${f1(w / 2)} ${f1(ry)} 0 0 0 ${f1(x + w)} ${f1(y + ry)}"/>`;
  };
  // a water molecule: one oxygen, two hydrogens
  const water = (x, y, s = 1) => circ(x, y, 3.4 * s, 'fp-water') + circ(x - 4 * s, y + 3.2 * s, 2 * s, 'fp-water') + circ(x + 4 * s, y + 3.2 * s, 2 * s, 'fp-water');
  // a random-walk chain in a box, wiggled by amp (melt) at phase ph
  const CHAINS = {};
  function chainPts(key, n, x0, y0, w, h, seed) {
    if (CHAINS[key]) return CHAINS[key];
    const r = rng(seed);
    const out = [];
    for (let c = 0; c < n; c++) {
      let x = x0 + r() * w;
      let y = y0 + r() * h;
      let a = r() * Math.PI * 2;
      const pts = [];
      for (let i = 0; i < 20; i++) {
        pts.push([x, y]);
        a += (r() - 0.5) * 1.9;
        x += Math.cos(a) * 15;
        y += Math.sin(a) * 15;
        if (x < x0 || x > x0 + w) { a = Math.PI - a; x = clamp(x, x0, x0 + w); }
        if (y < y0 || y > y0 + h) { a = -a; y = clamp(y, y0, y0 + h); }
      }
      out.push(pts);
    }
    CHAINS[key] = out;
    return out;
  }
  const chainSvg = (chains, amp, ph, cls = 'fp-chain') => mark(chains.map((pts) => M(pts.map(([x, y], i) => [x + amp * Math.sin(ph + i * 1.7 + y * 0.05), y + amp * Math.cos(ph * 1.3 + i * 2.1 + x * 0.04)]))).join(''), cls);
  // a crystal: a stack of folded chain segments (a lamella), n folds
  const lamella = (cx, cy, ang, n = 6, len = 34, gap = 6) => {
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    const P2 = (u, v) => [cx + u * ca - v * sa, cy + u * sa + v * ca];
    const pts = [];
    for (let i = 0; i < n; i++) {
      const v = (i - (n - 1) / 2) * gap;
      const a = i % 2 ? len / 2 : -len / 2;
      pts.push(P2(a, v), P2(-a, v));
    }
    return M(pts);
  };

  // ------------------------------------------------------------ scene cards
  function thermoCard(p) {
    let s = rightCard();
    s += T(CM, 46, tx('thermoplast', 'thermoplastic'), 22, 'middle', 'fp-big');
    const y = 120;
    const show = (i) => clamp((p - i * 0.18) / 0.15, 0, 1);
    // pellets
    s += `<g style="opacity:${show(0)}">${pellet(CX + 22, y - 18, 20, 26)}${pellet(CX + 40, y - 6, 20, 26)}${pellet(CX + 18, y + 8, 20, 26)}</g>`;
    s += `<g style="opacity:${show(1)}">${arrow(CX + 70, y + 6, CX + 102, y + 6)}${T(CX + 86, y - 10, tx('warm', 'hot'), 19, 'middle', 'fp-small')}`
      + `<path class="fp-shape" d="M${CX + 112} ${y + 26}Q${CX + 112} ${y - 4} ${CX + 132} ${y - 22}Q${CX + 152} ${y - 4} ${CX + 152} ${y + 26}Q${CX + 132} ${y + 40} ${CX + 112} ${y + 26}Z"/></g>`;
    s += `<g style="opacity:${show(2)}">${arrow(CX + 162, y + 6, CX + 194, y + 6)}${T(CX + 178, y - 10, tx('koud', 'cold'), 19, 'middle', 'fp-small')}`
      + `<path class="fp-shape2" d="M${CX + 202} ${y + 30}L${CX + 202} ${y - 6}Q${CX + 202} ${y - 18} ${CX + 214} ${y - 18}L${CX + 226} ${y - 18}Q${CX + 238} ${y - 18} ${CX + 238} ${y - 6}L${CX + 238} ${y + 30}Z"/>`
      + mark(M([[CX + 202, y + 18], [CX + 238, y + 18]]), 'fp-hatchc') + '</g>';
    s += `<g style="opacity:${show(3)}">${mark(`M${CX + 220} ${y + 52}Q${CX + 220} ${y + 96} ${CM} ${y + 96}Q${CX + 36} ${y + 96} ${CX + 36} ${y + 52}`, 'fp-arrow')}${mark(head(CX + 36, y + 70, CX + 36, y + 52, 9), 'fp-arrow')}`
      + T(CM, y + 130, tx('keer op keer', 'again and again'), 20, 'middle', 'fp-small') + '</g>';
    // a candle: the everyday thermoplastic
    s += `<g style="opacity:${show(4)}">${R(CM - 16, 290, 32, 56, 'fp-shape2', 3)}${mark(`M${CM} 290L${CM} 280`, 'fp-arrow')}<path class="fp-shape" d="M${CM} 258Q${CM + 9} 272 ${CM} 280Q${CM - 9} 272 ${CM} 258Z"/>`
      + T(CM, 372, tx('net als kaarsvet', 'like candle wax'), 19, 'middle', 'fp-small') + '</g>';
    return s;
  }
  function fourCard(p) {
    let s = rightCard();
    const rows = [
      ['PP', tx('doppen, kratten', 'caps, crates')],
      ['ABS', tx('behuizingen', 'housings')],
      ['PA', tx('nylon, sterk', 'nylon, strong')],
      ['PC', tx('lenzen, kappen', 'lenses, covers')],
    ];
    rows.forEach(([name, use], i) => {
      const y = 30 + i * 88;
      const a = clamp((p - i * 0.2) / 0.15, 0, 1);
      let r = mark(i ? M([[CX + 14, y - 6], [CX + CW - 14, y - 6]]) : '', 'fp-dash');
      // a small product per plastic
      const ix = CX + 22;
      if (i === 0) r += `<path class="fp-shape2" d="M${ix} ${y + 52}L${ix} ${y + 24}Q${ix} ${y + 14} ${ix + 10} ${y + 14}L${ix + 30} ${y + 14}Q${ix + 40} ${y + 14} ${ix + 40} ${y + 24}L${ix + 40} ${y + 52}Z"/>` + mark([0, 1, 2, 3].map((k) => M([[ix + 6 + k * 9, y + 18], [ix + 6 + k * 9, y + 50]])).join(''), 'fp-hatchc');
      if (i === 1) r += R(ix, y + 12, 44, 44, 'fp-shape2', 7) + R(ix + 8, y + 20, 28, 16, 'fp-shape', 3) + circ(ix + 34, y + 46, 3, 'fp-meter');
      if (i === 2) r += `<path class="fp-shape2" d="M${ix} ${y + 54}L${ix} ${y + 40}L${ix + 28} ${y + 40}L${ix + 28} ${y + 12}L${ix + 42} ${y + 12}L${ix + 42} ${y + 54}Z"/>` + circ(ix + 35, y + 22, 3.5, 'fp-shape') + circ(ix + 10, y + 47, 3.5, 'fp-shape');
      if (i === 3) r += `<ellipse class="fp-shape" cx="${ix + 22}" cy="${y + 34}" rx="22" ry="20"/>` + mark(`M${ix + 10} ${y + 26}Q${ix + 16} ${y + 20} ${ix + 24} ${y + 20}`, 'fp-hatchc');
      r += T(CX + 80, y + 30, name, 24, 'start', 'fp-big') + T(CX + 80, y + 58, use, 19, 'start', 'fp-small');
      s += `<g style="opacity:${a}">${r}</g>`;
    });
    return s;
  }
  function hygroCard(p, ph) {
    let base = rightCard();
    base += T(CM, 300, 'PA · PC · PET · PBT', 21, 'middle', 'fp-big');
    base += T(CM, 336, tx('PP: nauwelijks', 'PP: hardly any'), 19, 'middle', 'fp-small');
    // the pellet, big, and the water from the air moving in
    const px = CX + 66;
    const py = 96;
    let c = pellet(px, py, 124, 150, 'fp-shape');
    const r = rng(17);
    for (let i = 0; i < 18; i++) {
      const tx0 = CX + 20 + r() * (CW - 40);
      const ty0 = 30 + r() * 40;
      const tx1 = px + 16 + r() * 92;
      const ty1 = py + 40 + r() * 90;
      const t = clamp(p * 1.6 - i * 0.04, 0, 1);
      const e = t * t * (3 - 2 * t);
      c += water(lerp(tx0, tx1, e) + 3 * Math.sin(ph + i), lerp(ty0, ty1, e), 0.9);
    }
    return [base, c];
  }
  function dryCard() {
    let s = rightCard(14, 150);
    // a clock and a thermometer
    s += circ(CX + 52, 92, 30, 'fp-shape2') + mark(M([[CX + 52, 92], [CX + 52, 70]]) + M([[CX + 52, 92], [CX + 68, 100]]), 'fp-arrow');
    s += R(CX + 150, 46, 14, 74, 'fp-shape2', 7) + circ(CX + 157, 126, 12, 'fp-meter') + R(CX + 154, 72, 6, 50, 'fp-meter', 3);
    s += T(CX + 52, 152, tx('2–4 uur', '2–4 h'), 20, 'middle', 'fp-big') + T(CX + 196, 152, '80–120 °C', 20, 'middle', 'fp-big');
    return s;
  }
  function dewCard(p) {
    const base = rightCard();
    let c = T(CM, 48, tx('dauwpunt', 'dew point'), 22, 'middle', 'fp-big');
    // a thermometer scale from +20 to −60 °C with the dew point marker
    const y0 = 80;
    const y1 = 320;
    const ys = (t) => lerp(y0, y1, (20 - t) / 80);
    const x = CX + 70;
    c += R(x - 7, y0 - 8, 14, y1 - y0 + 16, 'fp-shape2', 7);
    c += mark([20, 0, -20, -40, -60].map((t) => M([[x + 10, ys(t)], [x + 22, ys(t)]])).join(''), 'fp-hatchc');
    c += [20, 0, -20, -40, -60].map((t) => T(x + 28, ys(t) + 7, `${num(t)}`, 19, 'start', 'fp-small')).join('');
    const tNow = lerp(20, C.FACTS.dew, span(p, 0.05, 0.6));
    c += R(x - 3, ys(tNow), 6, y1 + 6 - ys(tNow), 'fp-meter', 3);
    c += arrow(CX + CW - 20, ys(tNow), x + 82, ys(tNow), 9);
    c += T(CM, 352, tx('heel droge lucht', 'very dry air'), 20, 'middle', 'fp-small');
    return [base, c];
  }
  // the hopper as a column of kilos: hours of use stacked
  function columnCard(kb, p) {
    let s = rightCard();
    const x = CX + 40;
    const w = 80;
    const yb = 340;
    const sc = 5.2; // px per kg
    s += R(x - 4, yb - C.DRYER.kg * sc - 4, w + 8, C.DRYER.kg * sc + 8, 'fp-frame', 6);
    s += mark(M([[x - 14, yb - C.DRYER.kg * sc], [x + w + 14, yb - C.DRYER.kg * sc]]), 'fp-dash');
    s += T(x + w + 18, yb - C.DRYER.kg * sc + 7, `${C.DRYER.kg} kg`, 20, 'start', 'fp-big');
    if (kb === 3) {
      for (let h = 0; h < C.DRYER.hours; h++) {
        const a = clamp((p - h * 0.16) / 0.14, 0, 1);
        const y = yb - (h + 1) * C.DRYER.use * sc;
        s += `<g style="opacity:${a}">${R(x, y + 1, w, C.DRYER.use * sc - 2, h % 2 ? 'fp-meter2' : 'fp-meter', 2)}${T(x + w + 18, y + C.DRYER.use * sc / 2 + 7, `${h + 1} ${tx('uur', 'h')} · ${C.DRYER.use} kg`, 19, 'start', 'fp-small')}</g>`;
      }
      s += T(CM, 44, `${C.DRYER.hours} × ${C.DRYER.use} = ${C.DRYER.hours * C.DRYER.use} kg`, 22, 'middle', 'fp-big');
    } else {
      // run low, then 20 kg of wet pellets on top
      const low = lerp(C.DRYER.kg - 4, 4, span(p, 0, 0.3));
      s += R(x, yb - low * sc, w, low * sc, 'fp-meter', 2);
      const wet = C.DRYER.topUp * span(p, 0.32, 0.5);
      s += R(x, yb - (low + wet) * sc, w, wet * sc, 'fp-band2', 2) + mark(wet > 0 ? M([[x, yb - (low + wet) * sc], [x + w, yb - (low + wet) * sc]]) : '', 'fp-dash');
      if (p > 0.5) s += T(x + w + 18, yb - (low + wet / 2) * sc + 7, `${C.DRYER.topUp} kg ${tx('nat', 'wet')}`, 19, 'start', 'fp-small');
      s += T(CM, 44, `${C.DRYER.topUp} / ${C.DRYER.use} ≈ ${num(C.DRYER.topUp / C.DRYER.use, 1)} ${tx('uur', 'h')}`, 22, 'middle', 'fp-big');
      if (p > 0.6) s += T(CX + 158, 334, `< ${C.DRYER.hours} ${tx('uur', 'h')}`, 22, 'middle', 'fp-big') + cross(CX + 216, 330);
    }
    return s;
  }
  function splayCard(p) {
    const base = rightCard() + T(CM, 46, tx('nat materiaal', 'wet material'), 22, 'middle', 'fp-big');
    let c = R(CX + 26, 90, CW - 52, 170, 'fp-shape2', 10) + circ(CX + 40, 175, 5, 'fp-meter');
    const r = rng(23);
    const st = [];
    for (let i = 0; i < 26; i++) {
      const a = (r() - 0.5) * 1.6;
      const d0 = 20 + r() * 150;
      const len = 14 + r() * 18;
      if (i / 26 > p * 1.3) continue;
      st.push(M([[CX + 40 + Math.cos(a) * d0, 175 + Math.sin(a) * d0 * 0.55], [CX + 40 + Math.cos(a) * (d0 + len), 175 + Math.sin(a) * (d0 + len) * 0.55]]));
    }
    c += mark(st.join(''), 'fp-streak');
    c += T(CM, 300, tx('zilverstrepen', 'silver streaks'), 20, 'middle', 'fp-small');
    c += T(CM, 336, tx('erger: zwakke delen', 'worse: weak parts'), 20, 'middle', 'fp-small');
    return [base, c];
  }
  function regrindCard(p) {
    let base = rightCard();
    // a sprue tree and a reject part, into the grinder
    const x = CX + 24;
    base += mark(M([[x + 30, 40], [x + 30, 100]]) + M([[x + 6, 100], [x + 54, 100]]) + M([[x + 6, 100], [x + 6, 116]]) + M([[x + 54, 100], [x + 54, 116]]), 'fp-arrow');
    base += R(x + 120, 60, 70, 46, 'fp-shape2', 6) + cross(x + 148, 83);
    base += arrow(x + 96, 128, x + 96, 160);
    // the grinder: hopper over a box with a rotor
    base += `<path class="fp-shape" d="M${x + 50} 166L${x + 142} 166L${x + 124} 196L${x + 68} 196Z"/>` + R(x + 62, 196, 68, 44, 'fp-shape2', 4) + circ(x + 96, 218, 14, 'fp-shape') + mark(M([[x + 84, 218], [x + 108, 218]]) + M([[x + 96, 206], [x + 96, 230]]), 'fp-hatchc');
    let c = '';
    // flakes
    const r = rng(31);
    for (let i = 0; i < 14; i++) c += R(x + 150 + r() * 60, 194 + r() * 44, 6 + r() * 5, 4 + r() * 3, 'fp-meter', 1);
    // the mix bar with the customer's maximum
    const bx0 = CX + 22;
    const bx1 = CX + CW - 22;
    const share = 20 * span(p, 0.1, 0.6);
    const bx = (v) => lerp(bx0, bx1, v / 40);
    c += R(bx0, 270, bx1 - bx0, 26, 'fp-shape2', 4) + R(bx0, 270, bx(share) - bx0, 26, 'fp-meter', 4);
    base += R(bx(C.FACTS.regrind[0]), 262, bx(C.FACTS.regrind[1]) - bx(C.FACTS.regrind[0]), 42, 'fp-band2', 2);
    base += T(CM, 336, tx('klant: max 10–25 %', 'customer: max 10–25 %'), 20, 'middle', 'fp-small');
    base += T(CM, 368, tx('soms 0 %', 'sometimes 0 %'), 19, 'middle', 'fp-small');
    return [base, c];
  }
  function mbCard() {
    let base = rightCard() + T(CM, 46, 'masterbatch', 22, 'middle', 'fp-big');
    let c = '';
    const r = rng(41);
    const cx = CM;
    const cy = 190;
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 92;
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d * 0.8;
      const coloured = i % 33 === 5;
      const el = `<ellipse class="${coloured ? 'fp-mbp' : 'dr-pel'}" cx="${f1(x)}" cy="${f1(y)}" rx="6" ry="4.4"/>`;
      if (coloured) c += el; else base += el;
    }
    base += T(CM, 336, tx('een paar procent', 'a few percent'), 20, 'middle', 'fp-small');
    return [base, c];
  }
  function colourCard() {
    let s = rightCard() + T(CM, 46, tx('kleurwissel', 'colour change'), 22, 'middle', 'fp-big');
    const tones = ['#F6F1E4', '#C9C1AE', '#7D877A', '#1E3328']; // the colours themselves, light to dark
    const strip = (y) => tones.map((f, i) => `<rect x="${CX + 26 + i * 52}" y="${y}" width="44" height="44" rx="6" style="fill:${f};stroke:var(--anatomy-mid);stroke-width:1"/>`).join('');
    s += strip(96) + arrow(CX + 26, 168, CX + 222, 168) + tick(CX + 112, 200) + T(CM, 236, tx('licht → donker', 'light → dark'), 20, 'middle', 'fp-small');
    s += mark(M([[CX + 14, 262], [CX + CW - 14, 262]]), 'fp-dash');
    s += T(CM, 304, tx('zwart → wit:', 'black → white:'), 20, 'middle', 'fp-big') + T(CM, 336, tx('lang spoelen', 'long purge'), 20, 'middle', 'fp-small') + cross(CX + 205, 298);
    return s;
  }
  // two panels: amorphous (left) and semi-crystalline (right)
  const PA = { x: 30, y: 70, w: 270, h: 200 };
  const PB = { x: 340, y: 70, w: 270, h: 200 };
  const amChains = () => chainPts('am', 11, PA.x + 20, PA.y + 14, PA.w - 40, PA.h - 50, 7);
  const seChains = () => chainPts('se', 7, PB.x + 20, PB.y + 14, PB.w - 40, PB.h - 50, 13);
  const LAM = [[PB.x + 70, PB.y + 60, 0.4], [PB.x + 190, PB.y + 52, -0.6], [PB.x + 120, PB.y + 140, 1.2], [PB.x + 222, PB.y + 150, 0.1], [PB.x + 52, PB.y + 156, -0.3], [PB.x + 160, PB.y + 92, 2.0]];
  const crystals = (n) => mark(LAM.slice(0, n).map(([x, y, a]) => lamella(x, y, a)).join(''), 'fp-xtal');
  function familiesCard(kb, p) {
    let base = FULL();
    base += mark(M([[320, 30], [320, 370]]), 'fp-dash');
    base += chainSvg(amChains(), 0, 0);
    base += T(165, 52, tx('amorf', 'amorphous'), 22, 'middle', 'fp-big') + T(165, 290, 'ABS · PC', 20, 'middle', 'fp-small');
    let semi = T(475, 52, tx('semi-kristallijn', 'semi-crystalline'), 22, 'middle', 'fp-big') + T(475, 290, 'PP · PA', 20, 'middle', 'fp-small');
    base += chainSvg(seChains(), 0, 0);
    semi += crystals(Math.round(LAM.length * (kb === 0 ? span(p, 0.3, 0.8) : 1)));
    if (kb >= 1) {
      // shrinkage bars, to one scale: 0,5 % and 1–2 %
      const sc = 70;
      const g = span(p, 0.05, 0.5);
      base += R(110, 322, C.FACTS.amorf * sc * g, 22, 'fp-meter2', 3) + T(110 + C.FACTS.amorf * sc + 12, 341, `≈ ${num(C.FACTS.amorf, 1)} %`, 20, 'start', 'fp-big');
      semi += R(380, 322, C.FACTS.semi[0] * sc * g, 22, 'fp-meter', 3) + R(380 + C.FACTS.semi[0] * sc, 322, (C.FACTS.semi[1] - C.FACTS.semi[0]) * sc * g, 22, 'fp-band2', 3) + T(380 + C.FACTS.semi[1] * sc + 12, 341, '1–2 %', 20, 'start', 'fp-big');
      base += T(30, 341, tx('krimp', 'shrink'), 19, 'start', 'fp-small');
    }
    return [base, semi];
  }
  function coolCard(kb, p, ph) {
    let base = FULL();
    base += mark(M([[320, 30], [320, 370]]), 'fp-dash');
    let am = T(165, 52, tx('amorf', 'amorphous'), 22, 'middle', 'fp-big');
    let tg = '';
    let semi = T(475, 52, tx('semi-kristallijn', 'semi-crystalline'), 22, 'middle', 'fp-big');
    let cr = '';
    // amorphous: the tangle wiggles while hot and freezes as it cools
    const heatA = kb === 0 ? 1 - span(p, 0.2, 0.8) : kb === 1 ? 0.5 + 0.5 * Math.sin(p * Math.PI * 2 - 1.2) : 0;
    am += chainSvg(amChains(), 5 * heatA, ph);
    am += T(165, 290, tx('geen scherp smeltpunt', 'no sharp melting point'), 19, 'middle', 'fp-small');
    if (kb >= 1) {
      // the glass transition: hard below, rubbery above, then runny
      const x0 = 50;
      const x1 = 290;
      tg += R(x0, 314, x1 - x0, 14, 'fp-shape2', 7);
      tg += T(x0, 352, tx('hard', 'hard'), 19, 'start', 'fp-small') + T(x1, 352, tx('vloeibaar', 'runny'), 19, 'end', 'fp-small');
      const xt = lerp(x0, x1, 0.45);
      tg += mark(M([[xt, 306], [xt, 336]]), 'fp-arrow') + T(xt, 374, `Tg ≈ ${C.FACTS.tgPC} °C`, 19, 'middle', 'fp-big');
      const xn = lerp(x0, x1, heatA * 0.9 + 0.05);
      tg += circ(xn, 321, 7, 'fp-meter');
    }
    // semi-crystalline: melt chains, then crystals as it drops below its melting point
    const heatB = kb === 2 ? 1 - span(p, 0.15, 0.55) : kb < 2 ? 1 : 0;
    semi += chainSvg(seChains(), 5 * heatB, ph + 1);
    if (kb >= 2) {
      const n = kb === 2 ? Math.round(4 * span(p, 0.45, 0.9)) : 4 + Math.round(2 * span(p, 0.2, 0.7));
      semi += crystals(n);
      semi += T(475, 290, `${tx('smeltpunt PA6', 'melting point PA6')} ≈ ${C.FACTS.tmPA6} °C`, 19, 'middle', 'fp-small');
    }
    if (kb === 3) {
      // crystallinity: a cold mould gives fewer crystals than a warm one
      const bx = 425;
      const bw = 110;
      cr += T(475, 336, tx('kristalliniteit', 'crystallinity'), 20, 'middle', 'fp-big');
      cr += R(bx, 348, bw, 18, 'fp-shape2', 4) + R(bx, 348, bw * lerp(0.35, 0.6, span(p, 0.2, 0.7)), 18, 'fp-meter', 4);
      cr += T(bx - 8, 363, tx('koud', 'cold'), 19, 'end', 'fp-small') + T(bx + bw + 8, 363, tx('warm', 'warm'), 19, 'start', 'fp-small');
    }
    return [base, am, tg, semi, cr];
  }
  // a cavity in steel and the part in it, with a zoom on the right-hand end
  function shrinkCard(kb, p) {
    let base = FULL();
    const x0 = 40;
    const len = 300; // 100 mm
    const y = 90;
    const h = 70;
    const pxmm = len / 100;
    // steel block with the cavity (the sizing beats); after that the part
    // itself, out of the mould
    let cav = '';
    if (kb <= 1) {
      base += R(x0 - 16, y - 16, len * 1.015 + 32, h + 32, 'fp-shape', 4);
      base += R(x0, y, C.CAVITY * pxmm, h, 'fp-shape2', 2);
      cav = R(x0, y, C.CAVITY * pxmm, h, 'fp-frame', 2) + T(x0 + (C.CAVITY * pxmm) / 2, y - 26, tx('holte', 'cavity'), 19, 'middle', 'fp-small');
    } else base += T(x0 + 50 * pxmm, y - 10, tx('product', 'part'), 19, 'middle', 'fp-small');
    // the zoom: 99,5 … 102 mm over 210 px
    const zx0 = 390;
    const zx1 = 600;
    const zmm = (mm) => lerp(zx0, zx1, (mm - 99.5) / 2.5);
    if (kb <= 2) {
      base += R(zx0 - 10, 60, zx1 - zx0 + 20, 150, 'fp-frame', 8);
      base += mark([100, 101, 102].map((mm) => M([[zmm(mm), 196], [zmm(mm), 206]])).join('') + M([[zx0, 196], [zx1, 196]]), 'fp-hatchc');
      base += [100, 101, 102].map((mm) => T(zmm(mm), 232, `${mm}`, 19, 'middle', 'fp-small')).join('') + T(zx1 + 4, 258, 'mm', 19, 'end', 'fp-small');
      cav += mark(M([[zmm(C.CAVITY), 70], [zmm(C.CAVITY), 190]]), 'fp-arrow');
      // tolerance band 100 ± 0,2
      base += R(zmm(100 - C.SHRINK.tol), 70, zmm(100 + C.SHRINK.tol) - zmm(100 - C.SHRINK.tol), 120, 'fp-band2', 0);
    }
    const part = kb === 0 ? lerp(C.CAVITY, 100, span(p, 0.15, 0.7)) : kb === 1 ? lerp(C.CAVITY, C.ABS_PART, span(p, 0.15, 0.6)) : 100;
    let mid = '';
    let post = '';
    let crack = '';
    if (kb <= 1) {
      mid += R(x0 + 3, y + 8, part * pxmm - 6, h - 16, 'fp-meter2', 2);
      mid += R(zx0 - 10, 106, zmm(part) - zx0 + 10, 50, 'fp-meter2', 0) + mark(M([[zmm(part), 100], [zmm(part), 162]]), 'fp-arrow');
      const name = kb === 0 ? `PP ${num(C.SHRINK.pp * 100, 1)} %` : `ABS ${num(C.SHRINK.abs * 100, 1)} %`;
      mid += T(170, 230, name, 22, 'middle', 'fp-big');
      mid += T(170, 266, `${tx('holte', 'cavity')} ${num(C.CAVITY, 1)} mm → ${num(part, 1)} mm`, 20, 'middle', 'fp-small');
      if (kb === 1 && p > 0.6) mid += cross(zmm(C.ABS_PART) + 12, 128) + T(170, 302, tx('1 mm te lang', '1 mm too long'), 20, 'middle', 'fp-big');
      if (kb === 0 && p > 0.7) mid += tick(zmm(100) - 34, 126);
    } else if (kb === 2) {
      // post-shrinkage: the end creeps in over days (exaggerated)
      const d = span(p, 0.1, 0.85);
      const end = lerp(100.1, 99.6, d);
      mid += R(x0 + 3, y + 8, 100 * pxmm - 6, h - 16, 'fp-meter2', 2);
      post += R(zx0 - 10, 106, zmm(end) - zx0 + 10, 50, 'fp-meter', 0) + arrow(zmm(100.1) + 30, 131, zmm(end) + 4, 131, 8);
      // a calendar with days ticking
      const cx = 120;
      post += R(cx, 210, 120, 110, 'fp-shape2', 8) + R(cx, 210, 120, 26, 'fp-shape', 8);
      for (let i = 0; i < 14; i++) post += R(cx + 10 + (i % 7) * 15, 246 + Math.floor(i / 7) * 30, 10, 20, i < d * 14 ? 'fp-meter' : 'fp-meter2', 2);
      mid += T(390, 300, tx('bij de pers: past', 'at the press: fits'), 20, 'start', 'fp-small');
      if (p > 0.6) post += T(390, 336, tx('bij de klant: te klein', 'customer: too small'), 20, 'start', 'fp-big');
    } else {
      // stress cracking: a clear cover, a cleaning agent, fine cracks
      mid += R(x0 + 3, y + 8, 100 * pxmm - 6, h - 16, 'fp-meter2', 2);
      const r = rng(53);
      const cr = [];
      const n = Math.round(10 * span(p, 0.3, 0.9));
      for (let i = 0; i < n; i++) {
        const sx = x0 + 30 + r() * 240;
        const sy = y + 14 + r() * 40;
        cr.push(M([[sx, sy], [sx + 6, sy + 5], [sx + 2, sy + 11], [sx + 9, sy + 16]]));
      }
      crack += mark(cr.join(''), 'fp-streak');
      // the spray bottle
      crack += R(470, 150, 44, 80, 'fp-shape2', 6) + R(480, 126, 24, 24, 'fp-shape', 3) + R(456, 130, 24, 8, 'fp-shape', 2);
      for (let i = 0; i < 5; i++) crack += circ(440 - i * 9 - 20 * span(p, 0, 0.4), 134 + (i % 2) * 6, 2.4, 'fp-water');
      mid += T(170, 300, tx('ingevroren spanning', 'frozen-in stress'), 20, 'middle', 'fp-small') + T(170, 336, tx('+ schoonmaakmiddel', '+ cleaning agent'), 20, 'middle', 'fp-small');
    }
    return [base, cav, mid, post, crack];
  }
  function restCard(p) {
    const base = rightCard() + T(CM, 46, tx('restvocht', 'residual moisture'), 22, 'middle', 'fp-big');
    // a balance: one kilo against 0,2 gram of water
    let c = mark(M([[CM, 90], [CM, 190]]) + M([[CX + 40, 104], [CX + CW - 40, 104]]), 'fp-arrow');
    c += `<path class="fp-shape" d="M${CM - 26} 200L${CM + 26} 200L${CM + 16} 190L${CM - 16} 190Z"/>`;
    c += R(CX + 22, 124, 60, 46, 'fp-shape2', 4) + T(CX + 52, 154, '1 kg', 19, 'middle', 'fp-big');
    c += mark(M([[CX + 40, 104], [CX + 52, 124]]) + M([[CX + CW - 40, 104], [CX + CW - 52, 150]]), 'fp-hatchc');
    c += `<path class="fp-water" d="M${CX + CW - 52} 152Q${CX + CW - 44} 164 ${CX + CW - 52} 170Q${CX + CW - 60} 164 ${CX + CW - 52} 152Z"/>`;
    c += T(CX + CW - 52, 196, '0,2 g'.replace(',', EN ? '.' : ','), 19, 'middle', 'fp-big');
    const a = span(p, 0.3, 0.6);
    c += `<g style="opacity:${a}">${T(CX + 24, 262, `PC ≤ ${num(C.SAMPLE.limit, 2)} %`, 21, 'start', 'fp-big')}${T(CX + 24, 302, `PET ≤ ${num(C.FACTS.pet, 3)} %`, 21, 'start', 'fp-big')}${T(CX + 24, 340, tx('PA: per type', 'PA: by grade'), 19, 'start', 'fp-small')}</g>`;
    return [base, c];
  }
  function hydroCard(p) {
    const base = rightCard() + T(CM, 46, tx('hete smelt', 'hot melt'), 22, 'middle', 'fp-big');
    // one long chain, cut where the water attacks
    const cut = span(p, 0.35, 0.6);
    const segs = [];
    const cutsAt = [3, 7, 11];
    let piece = [];
    for (let i = 0; i <= 14; i++) {
      const x = CX + 22 + i * 12.6;
      const y = 170 + 16 * Math.sin(i * 1.1);
      const off = cutsAt.filter((c) => i > c).length;
      piece.push([x + off * 10 * cut, y + (off % 2 ? 1 : -1) * 8 * cut]);
      if (cutsAt.includes(i) && cut > 0.05) { segs.push(piece); piece = [[x + (off + 1) * 10 * cut, y]]; }
    }
    segs.push(piece);
    let c = mark(segs.map(M).join(''), 'fp-chain');
    cutsAt.forEach((ci, k) => {
      const x = CX + 22 + ci * 12.6 + 5 + k * 10 * cut;
      const y = lerp(96, 150, span(p, 0.05, 0.35));
      c += water(x, cut > 0.05 ? 140 : y, 0.9);
    });
    c += T(CM, 270, tx('ketens doorgeknipt', 'chains cut'), 20, 'middle', 'fp-small');
    c += T(CM, 310, tx('ziet er goed uit,', 'looks fine,'), 20, 'middle', 'fp-small') + T(CM, 342, tx('maar bros', 'but brittle'), 20, 'middle', 'fp-big');
    return [base, c];
  }
  function overCard(p) {
    const base = rightCard() + T(CM, 46, 'PA', 22, 'middle', 'fp-big');
    let c = pellet(CX + 40, 100, 60, 80) + T(CX + 70, 220, '80 °C', 21, 'middle', 'fp-big') + tick(CX + 60, 252);
    const y = span(p, 0.2, 0.7);
    c += pellet(CX + 156, 100, 60, 80, 'fp-shape2') + `<path class="fp-yellow" style="opacity:${(0.85 * y).toFixed(2)}" d="M${CX + 156} ${100 + 17.6}A30 17.6 0 0 1 ${CX + 216} ${100 + 17.6}L${CX + 216} ${180 - 17.6}A30 17.6 0 0 1 ${CX + 156} ${180 - 17.6}Z"/>`;
    c += T(CX + 186, 220, '120 °C', 21, 'middle', 'fp-big') + cross(CX + 179, 256);
    c += T(CM, 310, tx('te heet of te lang:', 'too hot or too long:'), 19, 'middle', 'fp-small') + T(CM, 342, tx('vergeelt', 'turns yellow'), 20, 'middle', 'fp-big');
    return [base, c];
  }
  function meterCard(kb, p) {
    const base = rightCard();
    let c = '';
    if (kb === 0) {
      // weigh, heat, weigh again
      const steps = [tx('wegen', 'weigh'), tx('verwarmen', 'heat'), tx('weer wegen', 'weigh again')];
      steps.forEach((name, i) => {
        const y = 40 + i * 110;
        const a = clamp((p - i * 0.22) / 0.15, 0, 1);
        let r = R(CX + 22, y + 34, 70, 14, 'fp-shape2', 3) + R(CX + 30, y + 48, 54, 24, 'fp-shape', 3);
        if (i === 1) r += mark(`M${CX + 36} ${y + 24}q5 -8 0 -16M${CX + 57} ${y + 24}q5 -8 0 -16M${CX + 78} ${y + 24}q5 -8 0 -16`, 'fp-arrow');
        else r += `<ellipse class="dr-pel" cx="${CX + 57}" cy="${y + 30}" rx="18" ry="6"/>`;
        r += T(CX + 108, y + 56, name, 20, 'start', 'fp-big');
        if (i < 2) r += arrow(CX + 57, y + 80, CX + 57, y + 104, 7);
        c += `<g style="opacity:${a}">${r}</g>`;
      });
    } else {
      const g = span(p, 0.1, 0.55);
      const w = lerp(C.SAMPLE.before, C.SAMPLE.after, g);
      c += R(CX + 30, 50, CW - 60, 70, 'fp-shape', 8);
      c += `<text class="fp-ink fp-tx fp-big" x="${CM}" y="98" font-size="30" text-anchor="middle" style="font-family:var(--anatomy-mono)">${num(w, 3)} g</text>`;
      c += T(CM, 160, `− ${num(C.LOSS, 3)} g`, 22, 'middle', 'fp-big');
      if (p > 0.55) {
        c += T(CM, 220, `= ${num(C.MOIST, 2)} %`, 30, 'middle', 'fp-big');
        c += T(CM, 268, `${tx('grens', 'limit')} ${num(C.SAMPLE.limit, 2)} %`, 20, 'middle', 'fp-small');
        c += cross(CM - 7, 316) + T(CM, 362, tx('lens mag niet draaien', 'the lens must not run'), 19, 'middle', 'fp-small');
      }
    }
    return [base, c];
  }
  function kfCard(p) {
    const base = rightCard() + T(CM, 46, 'Karl Fischer', 22, 'middle', 'fp-big');
    // a burette over a flask; the reagent drips in
    let c = R(CM - 7, 70, 14, 130, 'fp-shape2', 4) + mark([0, 1, 2, 3, 4, 5].map((i) => M([[CM - 7, 84 + i * 18], [CM, 84 + i * 18]])).join(''), 'fp-hatchc');
    c += R(CM - 3, 200, 6, 16, 'fp-shape', 2);
    const drop = (p * 4) % 1;
    c += circ(CM, 222 + drop * 34, 3, 'fp-water');
    c += `<path class="fp-shape" d="M${CM - 16} 250L${CM + 16} 250L${CM + 16} 270L${CM + 54} 330L${CM - 54} 330L${CM - 16} 270Z"/>`;
    c += T(CM, 368, tx('reageert alleen op water', 'reacts only to water'), 19, 'middle', 'fp-small');
    return [base, c];
  }
  function dewTrend(p) {
    let s = rightCard(14, 220) + T(CM, 44, tx('dauwpunt', 'dew point'), 22, 'middle', 'fp-big');
    const x0 = CX + 50;
    const x1 = CX + CW - 20;
    const ys = (t) => lerp(80, 200, (t + 10) / -40);
    s += mark(M([[x0, 76], [x0, 204], [x1, 204]]), 'fp-hatchc');
    s += [-10, -30, -50].map((t) => T(x0 - 8, ys(t) + 6, num(t), 19, 'end', 'fp-small')).join('');
    const g = span(p, 0.1, 0.8);
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const f = i / 30;
      if (f > g) break;
      pts.push([lerp(x0, x1, f), ys(lerp(C.FACTS.dew, C.FACTS.dewBad, Math.max(0, (f - 0.35) / 0.65) ** 1.4))]);
    }
    let c = pts.length > 1 ? mark(M(pts), 'fp-arrow') : '';
    if (g > 0.95) c += T(x1 - 4, ys(C.FACTS.dewBad) - 12, `${num(C.FACTS.dewBad)} °C`, 20, 'end', 'fp-big');
    s += T(CM, 270, '', 19);
    const checks = rightCard(246, 140) + T(CX + 20, 282, tx('check ook:', 'also check:'), 20, 'start', 'fp-big') + T(CX + 20, 314, tx('luchttemperatuur, debiet', 'air temperature, airflow'), 19, 'start', 'fp-small') + T(CX + 20, 344, tx('en droogtijd', 'and drying time'), 19, 'start', 'fp-small');
    return [s + checks, c];
  }
  function abrCard() {
    const base = rightCard() + T(CM, 46, tx('schroefgang', 'screw flight'), 22, 'middle', 'fp-big');
    // a flight in section: new (dashed) and worn (solid), glass fibres in the melt
    const x = CX + 30;
    let c = mark(`M${x} 230L${x + 40} 230L${x + 60} 110L${x + 140} 110L${x + 160} 230L${x + 196} 230`, 'fp-dash');
    c += `<path class="fp-shape" d="M${x} 230L${x + 44} 230L${x + 66} 128Q${x + 100} 116 ${x + 134} 128L${x + 156} 230L${x + 196} 230L${x + 196} 250L${x} 250Z"/>`;
    const r = rng(61);
    let f = '';
    for (let i = 0; i < 16; i++) { const fx = x + r() * 196; const fy = 76 + r() * 24; const a = (r() - 0.5) * 0.6; f += M([[fx, fy], [fx + 16 * Math.cos(a), fy + 16 * Math.sin(a)]]); }
    c += mark(f, 'fp-streak');
    c += T(CM, 300, tx('glas slijpt als', 'glass grinds like'), 20, 'middle', 'fp-small') + T(CM, 334, tx('schuurpapier', 'sandpaper'), 20, 'middle', 'fp-big');
    return [base, c];
  }
  // a glass-filled plate filling from a gate on the left; the fibres line up with the flow
  const FIB = (() => { const r = rng(71); return Array.from({ length: 150 }, () => [r(), r(), r()]); })();
  function plateCard(kb, p) {
    let base = FULL();
    const x0 = 60;
    const x1 = 480;
    const y0 = 90;
    const y1 = 270;
    const gy = (y0 + y1) / 2;
    base += R(x0, y0, x1 - x0, y1 - y0, 'fp-shape2', 6) + circ(x0 - 8, gy, 8, 'fp-meter') + T(x0 - 8, y1 + 40, tx('aanspuitpunt', 'gate'), 19, 'start', 'fp-small');
    const front = kb === 1 ? lerp(0.05, 1, span(p, 0.05, 0.85)) : 1;
    const xf = lerp(x0, x1, front);
    let melt = R(x0, y0, xf - x0, y1 - y0, 'fp-band2', 6);
    // fibres: random in the gate region, along the flow (x) further on
    const fb = [];
    for (const [u, v, w] of FIB) {
      const x = lerp(x0 + 8, x1 - 20, u);
      if (x > xf - 6) continue;
      const y = lerp(y0 + 8, y1 - 8, v);
      const d = (x - x0) / (x1 - x0);
      const a = (w - 0.5) * Math.PI * clamp(1 - d * 3, 0.08, 1) + (y - gy) / 400;
      fb.push(M([[x, y], [x + 14 * Math.cos(a), y + 14 * Math.sin(a)]]));
    }
    let fib = mark(fb.join(''), 'fp-streak');
    if (kb === 1 && front < 1) melt += mark(M([[xf, y0], [xf, y1]]), 'fp-arrow');
    let an = '';
    if (kb === 2) {
      // shrinkage: small along the fibres, large across
      const g = span(p, 0.1, 0.6);
      an += arrow(x1 + 20, gy, x1 + 20 - 26 * g, gy, 8) + T(560, gy - 30, `${num(C.GF.along, 1)} %`, 22, 'middle', 'fp-big') + T(560, gy - 4, tx('langs', 'along'), 19, 'middle', 'fp-small');
      an += arrow((x0 + x1) / 2, y1 + 18, (x0 + x1) / 2, y1 + 18 - 60 * g, 8);
      an += T((x0 + x1) / 2 + 30, y1 + 50, `${num(C.GF.across, 1)} % ${tx('dwars', 'across')}`, 22, 'start', 'fp-big');
      if (p > 0.65) an += mark(`M${x0} ${y0 - 14}Q${(x0 + x1) / 2} ${y0 - 36} ${x1} ${y0 - 14}`, 'fp-dash') + T((x0 + x1) / 2, y0 - 44, tx('kromtrekken', 'warpage'), 19, 'middle', 'fp-small');
    }
    if (kb === 1) base += T(560, gy + 7, tx('vloeirichting', 'flow'), 19, 'middle', 'fp-small') + arrow(520, gy + 24, 600, gy + 24, 8);
    return [base, melt, fib, an];
  }
  function recyCard(p) {
    const base = rightCard() + T(CM, 46, tx('recyclaat', 'recyclate'), 22, 'middle', 'fp-big');
    let bags = '';
    let mfi = '';
    const vals = [0.55, 0.9, 0.35];
    vals.forEach((v, i) => {
      const x = CX + 28 + i * 72;
      bags += `<path class="fp-shape" d="M${x} 300L${x + 52} 300L${x + 48} 230Q${x + 26} 220 ${x + 4} 230Z"/>` + T(x + 26, 330, `${i + 1}`, 19, 'middle', 'fp-small');
      const h = 110 * v * span(p, 0.3 + i * 0.1, 0.6 + i * 0.1);
      mfi += R(x + 12, 200 - h, 28, h, 'fp-meter', 3);
    });
    mfi += T(CX + 18, 82, tx('smeltindex per batch', 'MFI per batch'), 19, 'start', 'fp-small');
    mfi += R(CX + 20, 200 - 110 * 0.9, CW - 40, 110 * 0.55, 'fp-band2', 2);
    return [base + T(CM, 366, tx('spreiding telt', 'the spread counts'), 19, 'middle', 'fp-big'), bags, mfi];
  }
  function costCard(p) {
    let s = rightCard();
    // a 50 cm³ block, then the scale and the price
    s += R(CX + 30, 50, 70, 70, 'fp-shape2', 4) + mark(M([[CX + 30, 50], [CX + 50, 34], [CX + 120, 34], [CX + 100, 50]]) + M([[CX + 120, 34], [CX + 120, 104], [CX + 100, 120]]), 'fp-hatchc');
    s += T(CX + 140, 92, `${C.BRACKET.cm3} cm³`, 22, 'start', 'fp-big');
    const a = span(p, 0.15, 0.45);
    const b = span(p, 0.45, 0.75);
    s += `<g style="opacity:${a}">${T(CM, 172, `× ${num(C.BRACKET.rho, 2)} g/cm³`, 20, 'middle', 'fp-small')}${T(CM, 214, `= ${C.GRAMS} g`, 26, 'middle', 'fp-big')}</g>`;
    s += `<g style="opacity:${b}">${T(CM, 262, `× € ${num(C.BRACKET.eur, 2)} / kg`, 20, 'middle', 'fp-small')}${T(CM, 312, `≈ € ${num((C.GRAMS / 1000) * C.BRACKET.eur, 3)}`, 28, 'middle', 'fp-big')}${T(CM, 352, tx('per stuk, niet per kilo', 'per part, not per kilo'), 19, 'middle', 'fp-small')}</g>`;
    return s;
  }

  // ------------------------------------------------------------ the world's live parts
  // the pellets behind the sight glass: level lv (0..1 of the rows), the top
  // wet rows drawn in petrol
  const ROWS = Math.max(...C.PEL.map(([, z]) => z));
  const ZMIN = Math.min(...C.PEL.map(([, z]) => z));
  function pelSvg(lv, wet) {
    const top = lerp(ZMIN - 1, ROWS, lv);
    const wetFrom = top - wet * (ROWS - ZMIN);
    let dry = '';
    let w = '';
    for (const [x, z] of C.PEL) {
      if (z > top) continue;
      const c = `<circle cx="${x}" cy="${-z}" r="0.55"/>`;
      if (z > wetFrom) w += c; else dry += c;
    }
    return `<g class="dr-pel">${dry}</g><g class="dr-wet">${w}</g>`;
  }
  // world arrows: dry air into the bottom of the hopper, moist air out at the top
  const wA = (a, b, cw) => { const [x0, y0] = at(a); const [x1, y1] = at(b); return arrow(x0, y0, x1, y1, (9 * cw) / W); };
  function airSvg(cw, ph) {
    const xo = C.HX + C.H_R + 18;
    const xi = C.HX + C.H_R + 5;
    const o = 3 * Math.sin(ph * 2);
    return `<g style="opacity:.95">${wA([xo + o, C.YC + 8, C.IN_Z - 6], [xi + o, C.YC + 8, C.IN_Z - 6], cw)}${wA([xi - o, C.YC + 8, C.OUT_Z + 6], [xo - o, C.YC + 8, C.OUT_Z + 6], cw)}</g>`;
  }

  // ------------------------------------------------------------ what each scene shows
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };
  const SLOTS = Object.keys(E).filter((key) => key.startsWith('c-'));

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    const cw = introCamera(E.world, C.KEYS[si], d, u, W, H).w;
    const ph = u * C.dur[si] * 1.6;
    let base = '';
    let top = '';
    const slots = {};
    let lv = 0.82;
    let wet = 0;
    let air = false;
    let dew = C.FACTS.dew;
    const put = (key, v) => { slots[key] = (slots[key] || '') + v; };

    if (si === 0) {
      if (kb === 1) base = thermoCard(p);
      if (kb === 2) base = fourCard(p);
      if (kb === 3) air = true;
    }
    if (si === 1) {
      if (kb === 0) { const [b, c] = hygroCard(p, ph); base = b; put('c-hygro', c); }
      if (kb === 1) { air = true; base = dryCard(); }
      if (kb === 2) { const [b, c] = dewCard(p); base = b; put('c-dew', c); }
      if (kb === 3) { base = columnCard(3, p); lv = 0.9; }
      if (kb === 4) { base = columnCard(4, p); lv = lerp(0.9, 0.12, span(p, 0, 0.3)) + 0.42 * span(p, 0.32, 0.5); wet = 0.42 * span(p, 0.32, 0.5); }
    }
    if (si === 2) {
      if (kb === 0) { const [b, c] = splayCard(p); base = b; put('c-splay', c); }
      if (kb === 1) { const [b, c] = regrindCard(p); base = b; put('c-regrind', c); }
      if (kb === 2) { const [b, c] = mbCard(); base = b; put('c-mb', c); }
      if (kb === 3) base = colourCard();
    }
    if (si === 3) { const [b, c] = familiesCard(kb, p); base = b; put('c-semi', c); }
    if (si === 4) {
      const [b, am, tg, semi, cr] = coolCard(kb, p, ph);
      base = b; put('c-amorf', am); put('c-tg', tg); put('c-semi', semi); put('c-cryst', cr);
    }
    if (si === 5) {
      const [b, cav, mid, post, crack] = shrinkCard(kb, p);
      base = b + mid; put('c-cavity', cav); put('c-post', post); put('c-crack', crack);
    }
    if (si === 6) {
      const fn = [restCard, hydroCard, overCard][kb];
      const [b, c] = fn(p);
      base = b; put(['c-rest', 'c-hydro', 'c-over'][kb], c);
    }
    if (si === 7) {
      if (kb <= 1) { const [b, c] = meterCard(kb, p); base = b; put('c-meter', c); }
      if (kb === 2) { const [b, c] = kfCard(p); base = b; put('c-kf', c); }
      if (kb === 3) { const [b, c] = dewTrend(p); base = b; put('c-dew', c); dew = Math.round(lerp(C.FACTS.dew, C.FACTS.dewBad, span(p, 0.35, 0.8))); }
    }
    if (si === 8) {
      if (kb === 0) { const [b, c] = abrCard(); base = b; put('c-abr', c); }
      if (kb === 1 || kb === 2) { const [b, melt, fib, an] = plateCard(kb, p); base = b + melt; put('c-fibre', fib); put('c-aniso', an); }
      if (kb === 3) { const [b, bags, mfi] = recyCard(p); base = b; put('c-recy', bags); put('c-mfi', mfi); }
      if (kb === 4) base = costCard(p);
    }

    set(E.base, base);
    set(E.top, top);
    for (const key of SLOTS) set(E[key], slots[key] || '');
    set(E.pel, pelSvg(lv, wet));
    set(E.wfx, air ? airSvg(cw, ph) : '');
    set(E.lcdDp, `${num(dew)} °C`);
    set(E.lcdT, '80 °C');
    // the moisture meter: idle until scene 8, then the sample is weighed
    // (20,000 g), heated (19,994 g) and the result shown
    const mp = si === 7 && kb === 1 ? p : 0;
    set(E.lcdM, si < 7 ? num(0, 3) + ' g' : si === 7 && kb === 0 ? num(C.SAMPLE.before, 3) + ' g' : si === 7 && kb === 1 && mp < 0.55 ? num(mp < 0.1 ? C.SAMPLE.before : C.SAMPLE.after, 3) + ' g' : `${num(C.MOIST, 2)} %`);
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
