// The stage of the film "Binnen in de matrijs / Inside the mould": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants and the model), CAM (one camera move per
// scene), W and H. span and ease come from the player's timeline.
/* global P, C, CAM, W, H, iso, pathOf, translateAlong, span */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const el = (k) => svg.querySelector(`[data-k="${k}"]`);
  const E = {};
  ['world', 'scale', 'lid', 'piston', 'ratioMark', 'screw', 'ring', 'cushion', 'fill', 'front', 'drop', 'speed', 'back',
    'sheet', 'ruler', 'rulerBody', 'rulerSw', 'rulerMk', 'clock', 'win', 'dec', 'ratioHud', 'visc', 'bars', 'barsBody', 'barsLimit', 'gfs',
    'cards', 'cardsBody', 'cardsIq', 'spc', 'reval', 'lens', 'lensClip'].forEach((k) => { E[k] = el(k); });
  const EN = new URLSearchParams(location.search).get('lang') === 'en';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  // numbers in the drawing follow the language: 4,820 / 4.820 and 1.500 / 1,500
  const num = (v, dec = 0) => {
    const [i, d] = Math.abs(v).toFixed(dec).split('.');
    const grouped = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.') : i;
    return (v < 0 ? '−' : '') + grouped + (d ? (EN ? '.' : ',') + d : '');
  };
  const at = (p) => iso(p, P);
  const sp = (x, z) => at([x, 0, z]);
  const poly = (pts, closed = true) => pathOf(pts.map(([x, z]) => sp(x, z)), closed);
  const rect = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = String(Math.round(clamp(a, 0, 1) * 100) / 100); if (e.style.opacity !== v) e.style.opacity = v; };
  let camW = W;
  const label = (x, y, text, size = 22, anchor = 'middle', hud = false, cls = 'fp-label') => `<text class="fp-ink ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${f1(hud ? size : size * camW / W)}" text-anchor="${anchor}">${text}</text>`;
  const hudText = (x, y, text, size = 21, anchor = 'middle', cls = 'fp-num') => `<text class="fp-ink ${cls}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
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
  const M = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
  const panel = (x0, y0, x1, y1) => `<rect class="fp-hud-bg" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="10"/>`;

  // ------------------------------------------------------------ static HUD, written once (the player reads the cues after this)
  // the setting sheet on its clipboard: five groups of settings
  const ROWS = [['T', `${C.CARD.Tm} · ${C.CARD.Tw} °C`], ['v', `${C.CARD.v} mm/s`], ['s', `${C.CARD.sw} mm`], ['p', `${C.CARD.ph} bar · ${C.CARD.th} s`], ['t', `${C.CARD.tc} s`]];
  set(E.sheet, panel(436, 10, 630, 250)
    + '<rect class="fp-hud-bg" x="446" y="22" width="174" height="218" rx="6" style="opacity:1"/>'
    + `<rect class="fp-bar2" x="507" y="14" width="52" height="16" rx="4"/>`
    + mark(M([[458, 44], [608, 44]])) + mark(M([[458, 52], [570, 52]]), ' style="opacity:.6"')
    + ROWS.map(([s, v], i) => {
      const y = 86 + i * 34;
      const row = `<g data-row="${i}">${hudText(456, y, s, 19, 'start', 'fp-label')}${hudText(612, y, v, 17, 'end')}${mark(M([[458, y + 10], [610, y + 10]]), ' style="opacity:.35"')}</g>`;
      return i === 0 ? `<g data-cue="heat">${row}</g>` : row;
    }).join(''));
  const sheetRows = [...E.sheet.querySelectorAll('[data-row]')];

  // the stroke ruler: screw position from 60 mm (dosed) to 0
  const RX0 = 430;
  const RX1 = 606;
  const RY = 58;
  const rx = (s) => lerp(RX0, RX1, 1 - s / C.CARD.stroke);
  set(E.rulerBody, panel(402, 10, 630, 100) + mark(M([[RX0, RY], [RX1, RY]]))
    + mark([0, 12, 24, 36, 48, 60].map((s) => M([[rx(s), RY - 6], [rx(s), RY + 6]])).join(''))
    + hudText(RX0, RY + 30, '60', 20) + hudText(RX1, RY + 30, '0', 20) + hudText(RX0 - 2, RY - 16, 'mm', 17, 'start', 'fp-label'));
  set(E.rulerSw, mark(M([[rx(12), RY - 14], [rx(12), RY + 12]]), ' style="stroke-width:2.4"') + hudText(rx(12), RY + 30, '12', 20)
    + `<path class="fp-ink" d="M${f1(rx(12))} ${RY - 14}L${f1(rx(12) + 14)} ${RY - 19}L${f1(rx(12))} ${RY - 24}Z"/>`);

  // ------------------------------------------------------------ the screw in section
  const PITCH = 26;
  function screwSvg(xt, rot, open, leak) {
    const r = C.BORE.r;
    let out = '';
    // melt in the metering and transition zones, pellets in the feed zone
    out += `<path class="fp-melt" d="${poly(rect(-205, C.BORE.x1 + 0.2, -r, r))}"/>`;
    out += `<path class="fp-melt" style="opacity:.45" d="${poly(rect(-232, -205, -r, r))}"/>`;
    const pel = [];
    for (let i = 0; i < 30; i++) {
      const x = -278 + ((i * 37) % 52);
      const z = (i % 2 ? 1 : -1) * (10.5 + ((i * 13) % 5));
      pel.push(sp(x, z));
    }
    out += `<g class="fp-pellet">${pel.map(([x, y]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.25"/>`).join('')}</g>`;
    // root, flights (a turning helix cut along its axis), seat, neck and tip
    const parts = [];
    parts.push(rect(xt - 330, xt - 30, -9, 9));
    const frac = ((rot % 1) + 1) % 1;
    for (let j = -1; j < 14; j++) {
      const top = xt - 44 - j * PITCH + frac * PITCH;
      const bot = top - PITCH / 2;
      if (top < xt - 36) parts.push([[top - 4, 9], [top + 1, 9], [top + 4, r - 0.5], [top - 1, r - 0.5]]);
      if (bot < xt - 36) parts.push([[bot - 4, -9], [bot + 1, -9], [bot + 4, -r + 0.5], [bot - 1, -r + 0.5]]);
    }
    parts.push([[xt - 30, -14.5], [xt - 24, -14.5], [xt - 24, 14.5], [xt - 30, 14.5]]);
    parts.push(rect(xt - 25, xt - 13, -5, 5));
    parts.push([[xt - 14, -8.5], [xt, 0], [xt - 14, 8.5]]);
    out += parts.map((p) => `<path class="fp-screw" d="${poly(p)}"/>`).join('');
    // the check ring slides between the seat (closed) and the tip (open)
    const o = 5 * open;
    const ring = (sgn) => [[xt - 24 + o, sgn * 6], [xt - 17 + o, sgn * 6], [xt - 17 + o, sgn * (r - 0.4)], [xt - 24 + o, sgn * (r - 0.4)]];
    let rh = `<path class="fp-steel" d="${poly(ring(1))}"/><path class="fp-steel" d="${poly(ring(-1))}"/>`;
    if (open > 0.5) {
      // melt flows forward through the open ring while dosing
      for (const sgn of [1, -1]) {
        const a = sp(xt - 34, sgn * 12);
        const b = sp(xt - 9, sgn * 12);
        rh += mark(M([a, b])) + mark(arrowHead(a, b, 5));
      }
    }
    if (leak > 0) {
      // a worn ring lets melt slip backwards past it
      for (const sgn of [1, -1]) {
        const a = sp(xt - 8, sgn * 14);
        const b = sp(xt - 34, sgn * 14);
        rh += `<g style="opacity:${leak.toFixed(2)}">${mark(M([a, b]))}${mark(arrowHead(a, b, 5))}</g>`;
      }
    }
    return { screw: out, ring: rh };
  }

  // ------------------------------------------------------------ the melt inside the mould
  const { SPRUE, GATEN, CAV, PL } = C;
  const PLATE = CAV.h;
  const PATH = CAV.h + CAV.skirt; // flow length per side, from the gate
  const SPRUE_SHARE = 0.1;
  const sprueR = (x) => SPRUE.r0 + ((x - SPRUE.x0) / (SPRUE.x1 - SPRUE.x0)) * (SPRUE.r1 - SPRUE.r0);
  function mouldFill(F, skin, frozenGate, solid, packing) {
    let melt = '';
    let front = '';
    const xs = SPRUE.x0;
    if (F <= SPRUE_SHARE) {
      const xf = lerp(xs, GATEN.x1, F / SPRUE_SHARE);
      if (F > 0) {
        const xe = Math.min(xf, SPRUE.x1);
        melt += poly([[xs, -SPRUE.r0], [xe, -sprueR(xe)], [xe, sprueR(xe)], [xs, SPRUE.r0]]);
        if (xf > SPRUE.x1) melt += poly(rect(SPRUE.x1, xf, -GATEN.r, GATEN.r));
        const rr = xf > SPRUE.x1 ? GATEN.r : sprueR(xf);
        front = M([sp(xf - 1.5, -rr), sp(xf + 1, 0), sp(xf - 1.5, rr)]);
      }
      return { melt, front, pack: '', skin: '', solid: '' };
    }
    melt += poly([[xs, -SPRUE.r0], [SPRUE.x1, -SPRUE.r1], [SPRUE.x1, SPRUE.r1], [xs, SPRUE.r0]]);
    melt += poly([[SPRUE.x1, -SPRUE.r1], [GATEN.x0 + 2, -GATEN.r], [GATEN.x1, -GATEN.r], [GATEN.x1, GATEN.r], [GATEN.x0 + 2, GATEN.r], [SPRUE.x1, SPRUE.r1]]);
    const l = ((F - SPRUE_SHARE) / (1 - SPRUE_SHARE)) * PATH;
    const zp = Math.min(l, PLATE);
    melt += poly(rect(CAV.x0, CAV.x1, -zp, zp));
    const fr = [];
    if (l < PLATE - 0.5) {
      for (const sgn of [1, -1]) fr.push(M([sp(CAV.x0, sgn * (zp - 2.5)), sp((CAV.x0 + CAV.x1) / 2, sgn * (zp + 1.2)), sp(CAV.x1, sgn * (zp - 2.5))]));
    } else {
      const xk = PL + Math.min(CAV.skirt, l - PLATE);
      for (const sgn of [1, -1]) {
        melt += poly(rect(PL - 0.2, xk, sgn > 0 ? CAV.h - CAV.t : -CAV.h, sgn > 0 ? CAV.h : -CAV.h + CAV.t));
        if (l < PATH - 0.3) fr.push(M([sp(xk - 2.5, sgn * (CAV.h - CAV.t)), sp(xk + 1.2, sgn * (CAV.h - CAV.t / 2)), sp(xk - 2.5, sgn * CAV.h)]));
      }
    }
    front = fr.join('');
    // the frozen skin against the steel, inside the filled length
    let sk = '';
    if (skin > 0) {
      const t = 0.4 + 2 * skin;
      const z = Math.max(0, zp - 3);
      sk += M([sp(CAV.x0 + t, -z), sp(CAV.x0 + t, z)]) + M([sp(CAV.x1 - t, -z), sp(CAV.x1 - t, z)]);
    }
    let so = '';
    if (frozenGate > 0) so += `<path class="fp-solid" style="opacity:${frozenGate.toFixed(2)}" d="${poly([[GATEN.x0 + 1, -GATEN.r - 0.6], [GATEN.x1 + 0.4, -GATEN.r - 0.6], [GATEN.x1 + 0.4, GATEN.r + 0.6], [GATEN.x0 + 1, GATEN.r + 0.6]])}"/>`;
    if (solid > 0) {
      so += `<path class="fp-solid" style="opacity:${(0.85 * solid).toFixed(2)}" d="${poly(rect(CAV.x0, CAV.x1, -zp, zp)) + (l >= PLATE ? poly(rect(PL - 0.2, PL + CAV.skirt, CAV.h - CAV.t, CAV.h)) + poly(rect(PL - 0.2, PL + CAV.skirt, -CAV.h, -CAV.h + CAV.t)) : '')}"/>`;
    }
    let pack = '';
    if (packing > 0) {
      // holding pressure: small arrows push melt in through the gate
      for (const sgn of [1, -1]) {
        const a = sp(CAV.x1 + 9, sgn * 6);
        const b = sp(CAV.x1 + 9, sgn * 34);
        pack += `<g style="opacity:${packing.toFixed(2)}">${mark(M([a, b]))}${mark(arrowHead(a, b, 6))}</g>`;
      }
    }
    return { melt, front, pack, skin: sk, solid: so };
  }

  // ------------------------------------------------------------ camera
  let cam = { cx: 0, cy: 0, s: 1 };
  // reduced motion shows one still per scene while the captions run on: a
  // scene whose camera moves on a caption then frames what that caption names
  const isStill = () => document.querySelector('.fp').dataset.motion === 'reduce';
  const cueOn = (name) => !!svg.querySelector(`[data-cue="${name}"][data-on]`);
  function camera(si, u) {
    const c = CAM[si];
    let k = span(u, c.a ?? 0, c.b ?? 1);
    if (isStill() && si === 0) k = cueOn('heat') ? 1 : 0;
    if (isStill() && si === 4) k = cueOn('back') ? 0 : 1;
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const w = lerp(c.from[2], c.to[2], k);
    camW = w;
    const s = W / w;
    cam = { cx, cy, s };
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the lens: a close-up of a small part
  // p: world point in the section plane; w: how wide the lens looks (projection
  // units); (lx, ly, r): where it sits on the stage; a: opacity
  function lens(p, w, lx, ly, r, a) {
    if (a <= 0.01) { set(E.lens, ''); return; }
    const [px, py] = at(p);
    const z = (2 * r) / w;
    const c = E.lensClip;
    if (c.__k !== `${lx},${ly},${r}`) { c.setAttribute('cx', lx); c.setAttribute('cy', ly); c.setAttribute('r', r); c.__k = `${lx},${ly},${r}`; }
    // where the part is on the stage now, under the camera
    const qx = W / 2 + (px - cam.cx) * cam.s;
    const qy = H / 2 + (py - cam.cy) * cam.s;
    const d = Math.hypot(qx - lx, qy - ly) || 1;
    const ex = lx + ((qx - lx) / d) * r;
    const ey = ly + ((qy - ly) / d) * r;
    const lead = d > r + 14 ? `<path class="fp-lens-lead" d="M${f1(ex)} ${f1(ey)}L${f1(qx)} ${f1(qy)}"/><circle class="fp-lens-ring" cx="${f1(qx)}" cy="${f1(qy)}" r="9"/>` : '';
    set(E.lens, `<g style="opacity:${(Math.round(clamp(a, 0, 1) * 100) / 100)}">${lead}<circle class="fp-lens-bg" cx="${lx}" cy="${ly}" r="${r}"/>`
      + `<g clip-path="url(#fm-lens)"><use href="#fm-w" transform="translate(${lx} ${ly}) scale(${z.toFixed(4)}) translate(${f1(-px)} ${f1(-py)})"/></g>`
      + `<circle class="fp-lens-ring" cx="${lx}" cy="${ly}" r="${r}"/></g>`);
  }

  // ------------------------------------------------------------ HUD drawings that change
  function rulerMarker(s) {
    const x = rx(s);
    return `<rect class="fp-bar2" x="${RX0}" y="${RY - 3}" width="${f1(Math.max(0, x - RX0))}" height="6" rx="2"/>`
      + `<path class="fp-ink" d="M${f1(x)} ${RY + 4}L${f1(x - 7)} ${RY + 16}L${f1(x + 7)} ${RY + 16}Z"/>`;
  }
  function clockSvg(sec, total, which) {
    const cx = 586;
    const cy = 152;
    const r = 34;
    const a = clamp(sec / total, 0, 1) * Math.PI * 2;
    const arc = a >= Math.PI * 2 - 1e-3
      ? `M${cx} ${cy - r}A${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`
      : `M${cx} ${cy - r}A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${f1(cx + Math.sin(a) * r)} ${f1(cy - Math.cos(a) * r)}`;
    return panel(532, 106, 630, 206) + `<circle class="fp-faintline" cx="${cx}" cy="${cy}" r="${r}" fill="none"/>`
      + (sec > 0 ? mark(arc, ' style="stroke-width:5"') : '')
      + hudText(cx, cy + 8, `${num(sec, 0)} s`, 21) + hudText(cx, cy - r - 8 < 112 ? 200 : cy - r - 8, which, 15, 'middle', 'fp-label');
  }
  // the process window over melt temperature (x) and holding pressure (y)
  const WX = (T) => lerp(444, 612, (T - 200) / 70);
  const WY = (p) => lerp(206, 34, (p - 200) / 500);
  const pShort = (T) => 400 - 8 * (T - 220);
  const pFlash = (T) => 400 + 10 * (250 - T);
  const winPoly = (() => {
    const lo = [];
    const hi = [];
    for (let T = 200; T <= 270; T += 2) {
      const a = Math.max(200, pShort(T));
      const b = Math.min(700, pFlash(T));
      if (b > a) { lo.push([WX(T), WY(a)]); hi.unshift([WX(T), WY(b)]); }
    }
    return M([...lo, ...hi]) + 'Z';
  })();
  function axes(x0, y0, x1, y1, xl, yl) {
    return mark(M([[x0, y0], [x0, y1], [x1, y1]])) + mark(arrowHead([x1 - 10, y1], [x1 + 2, y1], 8, true)) + mark(arrowHead([x0, y0 + 10], [x0, y0 - 2], 8, true))
      + hudText(x1 + 2, y1 - 10, xl, 20, 'end', 'fp-label') + hudText(x0 - 10, y0 + 8, yl, 20, 'end', 'fp-label');
  }
  function winSvg(pt) {
    const x = WX(pt[0]);
    const y = WY(pt[1]);
    const bx = WX(pt[0] + 5) - x;
    const by = WY(pt[1] - 25) - y;
    return panel(402, 10, 630, 238) + axes(444, 30, 616, 210, 'T', 'p')
      + `<path class="fp-good" d="${winPoly}"/>`
      + `<rect class="fp-faintline fp-dash" fill="none" x="${f1(x - bx)}" y="${f1(y - by)}" width="${f1(2 * bx)}" height="${f1(2 * by)}"/>`
      + `<circle class="fp-dot" cx="${f1(x)}" cy="${f1(y)}" r="5.5"/>`;
  }
  function decSvg(f) {
    const x0 = 420;
    const x1 = 614;
    const xs = lerp(x0, x1, C.FULL);
    const xf = lerp(x0, x1, f);
    return panel(402, 246, 630, 322) + `<rect class="fp-faintline" fill="none" x="${x0}" y="270" width="${x1 - x0}" height="18" rx="3"/>`
      + `<rect class="fp-bar" x="${x0}" y="270" width="${f1(Math.max(0, Math.min(xf, xs) - x0))}" height="18" rx="3"/>`
      + (f > C.FULL ? `<rect class="fp-bar2" x="${f1(xs)}" y="270" width="${f1(xf - xs)}" height="18"/>` : '')
      + mark(M([[xs, 264], [xs, 294]])) + hudText(x0, 263, 'v', 18, 'start', 'fp-label') + hudText(x1, 263, 'p', 18, 'end', 'fp-label')
      + hudText(xs, 314, `${Math.round(C.FULL * 100)}%`, 17, 'middle');
  }
  // three studies on one screen
  const VX = (v) => lerp(446, 612, v / 140);
  const VY = (e) => lerp(210, 40, (e - 700) / 700);
  function viscSvg(grow) {
    const pts = C.VISC.map(([v, e]) => [VX(v), VY(e)]);
    const n = Math.max(1, Math.ceil(grow * 3));
    return panel(402, 10, 630, 252) + axes(446, 30, 616, 210, 'v', 'η')
      + `<rect class="fp-good" x="${f1(VX(80))}" y="34" width="${f1(VX(140) - VX(80))}" height="176" style="stroke:none"/>`
      + mark(M(pts.slice(0, n)), ' style="stroke-width:2"')
      + pts.slice(0, n).map(([x, y]) => `<circle class="fp-dot" cx="${f1(x)}" cy="${f1(y)}" r="5"/>`).join('')
      + [40, 80, 120].map((v) => hudText(VX(v), 236, String(v), 17)).join('');
  }
  function ratioSvg() {
    return panel(402, 10, 630, 252)
      + '<circle class="fp-faintline" cx="478" cy="118" r="60" style="fill:var(--anatomy-shade-2)"/>'
      + '<circle class="fp-faintline" cx="588" cy="118" r="19" style="fill:var(--anatomy-shade-2)"/>'
      + mark(M([[548, 118], [562, 118]])) + mark(arrowHead([548, 118], [564, 118], 8, true))
      + hudText(478, 126, '150', 21) + hudText(588, 168, num(1500), 20)
      + hudText(536, 100, '×10', 22) + hudText(516, 226, 'bar', 18, 'middle', 'fp-label');
  }
  const BY = (p) => lerp(214, 44, p / 2000);
  function barsSvg(grow) {
    let out = panel(402, 10, 630, 252) + mark(M([[422, 214], [622, 214]]));
    C.DROP.forEach((p, i) => {
      const h = (214 - BY(p)) * clamp(grow * 5 - i, 0, 1);
      out += `<rect class="fp-bar" x="${430 + i * 34}" y="${f1(214 - h)}" width="24" height="${f1(h)}" rx="2"/>` + hudText(442 + i * 34, 238, String(i + 1), 18);
    });
    const tot = C.DROP.reduce((a, b) => a + b, 0);
    const th = (214 - BY(tot)) * clamp(grow * 5 - 4, 0, 1);
    out += `<rect class="fp-bar2" x="580" y="${f1(214 - th)}" width="30" height="${f1(th)}" rx="2"/>` + hudText(595, 238, 'Σ', 18, 'middle', 'fp-label');
    out += mark(M([[572, BY(2000)], [620, BY(2000)]]), ' style="stroke-width:2"') + hudText(568, BY(2000) + 6, num(2000), 17, 'end');
    // the lesson gives only the total; the split over the sections is an example
    out += hudText(422, 38, EN ? 'example' : 'voorbeeld', 17, 'start', 'fp-label');
    return out;
  }
  const limitSvg = () => mark(M([[422, BY(1600)], [620, BY(1600)]]), ' stroke-dasharray="6 5"') + hudText(568, BY(1600) - 6, '80%', 17, 'end');
  const GX = (t) => lerp(446, 612, t / 6);
  const GY = (w) => lerp(210, 40, (w - 20) / 0.6);
  function gfsSvg(grow) {
    const n = Math.max(1, Math.ceil(grow * 5));
    const pts = C.GATE.slice(0, n).map(([t, w]) => [GX(t), GY(w)]);
    return panel(402, 10, 630, 252) + axes(446, 30, 616, 210, 't', 'g')
      + `<rect class="fp-good" x="${f1(GX(3.5))}" y="34" width="${f1(GX(4) - GX(3.5))}" height="176"/>`
      + (n >= 3 ? mark(M([[GX(3), 36], [GX(3), 210]]), ' stroke-dasharray="5 4" style="opacity:.7"') : '')
      + mark(M(pts), ' style="stroke-width:2"')
      + pts.map(([x, y]) => `<circle class="fp-dot" cx="${f1(x)}" cy="${f1(y)}" r="5"/>`).join('')
      + [1, 2, 3, 4, 5].map((t) => hudText(GX(t), 236, String(t), 17)).join('');
  }
  // validation: the three cards, then the control chart of part weight
  function cardsSvg(checks) {
    let out = panel(372, 10, 630, 96);
    ['IQ', 'OQ', 'PQ'].forEach((_, i) => {
      const x = 436 + i * 64;
      out += `<rect class="fp-faintline" x="${x}" y="20" width="56" height="66" rx="5" style="fill:var(--anatomy-shade-2)"/>`;
      const c = clamp(checks * 3 - i, 0, 1);
      if (c > 0) out += `<path class="fp-mark" style="opacity:${c.toFixed(2)};stroke-width:2.4" d="M${x + 16} ${72}l7 7l14 -14"/>`;
    });
    return out;
  }
  const cardsIq = ['IQ', 'OQ', 'PQ'].map((t, i) => hudText(464 + i * 64, 56, t, 22, 'middle', 'fp-label')).join('');
  const SX = (i) => lerp(424, 556, i / 39);
  const SY = (w) => lerp(282, 118, (w - 4.77) / 0.1);
  function spcSvg(n, shownW) {
    const { mean, sd, oqLo, oqHi } = C.SPC;
    const lines = [[oqHi, 'fp-faintline', ''], [mean + 3 * sd, 'fp-mark', ' stroke-dasharray="6 5"'], [mean, 'fp-faintline', ''], [mean - 3 * sd, 'fp-mark', ' stroke-dasharray="6 5"'], [oqLo, 'fp-faintline', '']];
    let out = panel(402, 104, 630, 300);
    out += lines.map(([w, cls, extra]) => `<path class="${cls}" d="M420 ${f1(SY(w))}L560 ${f1(SY(w))}"${extra}/>` + hudText(566, SY(w) + 6, num(w, 3), 17, 'start')).join('');
    const pts = C.NOISE.slice(0, n).map((z, i) => [SX(i), SY(mean + z * sd)]);
    if (pts.length > 1) out += `<path class="fp-faintline" d="${M(pts)}" style="stroke:var(--anatomy-mid)"/>`;
    out += pts.map(([x, y]) => `<circle class="fp-dot" cx="${f1(x)}" cy="${f1(y)}" r="3"/>`).join('');
    if (shownW) out += hudText(420, 296, `${num(shownW, 3)} g`, 18, 'start');
    return out;
  }
  function revalSvg(a) {
    const cx = 402;
    const cy = 53;
    const r = 18;
    const end = -0.4 + a * 5.2;
    const pts = [];
    for (let i = 0; i <= 24; i++) { const t = -0.4 + (end + 0.4) * (i / 24); pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]); }
    return mark(M(pts), ' style="stroke-width:2.4"') + mark(arrowHead(pts[pts.length - 2], pts[pts.length - 1], 8, true));
  }

  // ------------------------------------------------------------ what each scene shows
  const ALL = ['scale', 'lid', 'ratioMark', 'cushion', 'drop', 'speed', 'back', 'sheet', 'ruler', 'clock', 'win', 'dec', 'ratioHud', 'visc', 'bars', 'gfs', 'cards', 'spc', 'reval'];
  const VIS = [
    ['sheet'],
    ['ruler', 'speed'],
    ['ruler'],
    ['ruler', 'clock'],
    ['ruler', 'back', 'cushion'],
    ['win', 'dec'],
    ['ratioMark', 'drop', 'visc', 'ratioHud', 'bars', 'gfs'],
    ['scale', 'lid', 'cards', 'spc', 'reval'],
  ];
  let shown = -1;
  const B = (si, i) => C.BEATS[si][i] ?? 1;

  function render(si, u) {
    if (si !== shown) {
      shown = si;
      for (const k of ALL) show(E[k], VIS[si].includes(k));
    }
    camera(si, u);
    // state of the press: s = screw position (mm of stroke left), F = fill of the
    // mould (0..1 along the flow path), and the rest
    let s = 60;
    let rot = 0;
    let open = 1;
    let leak = 0;
    let F = 0;
    let skin = 0;
    let gateF = 0;
    let solid = 0;
    let packing = 0;
    const clockS = u * C.dur[si];
    let lensOn = null;

    if (si === 0) {
      // the sheet's rows come in one by one
      sheetRows.forEach((r, i) => fade(r, span(u, 0.06 + i * 0.06, 0.12 + i * 0.06)));
    } else if (si === 1) {
      const k = span(u, 0.06, 0.86);
      s = lerp(60, 12.6, k);
      open = 1 - span(u, 0, 0.06);
      F = C.FULL * ((60 - s) / 48);
      skin = 0.35 * k;
      // the speed arrow rides over the barrel with the screw
      const xt = C.TIP0 - s;
      const a = sp(xt - 70, -50);
      const b = sp(xt - 22, -50);
      const lp = sp(xt - 46, -64);
      set(E.speed, mark(M([a, b]), ' style="stroke-width:2"') + mark(arrowHead(a, b, 9)) + label(lp[0], lp[1], `${C.CARD.v} mm/s`, 18, 'middle', false, 'fp-num'));
      // close-up of the gate: the front enters the cavity and a skin forms on the steel
      lensOn = [[56, 0, 20], 36, 530, 288, 84, span(u, B(1, 1) - 0.03, B(1, 1)) * (1 - span(u, 0.9, 0.95))];
    } else if (si === 2) {
      open = 0;
      s = u < 0.3 ? lerp(12.6, 12, span(u, 0, 0.3)) : lerp(12, 11, span(u, 0.3, 1));
      F = s >= 12 ? C.FULL * ((60 - s) / 48) : lerp(C.FULL, 0.985, (12 - s));
      skin = 0.4;
    } else if (si === 3) {
      open = 0;
      const hold = span(u, 0.02, 0.5);
      s = lerp(11, C.CUSHION.nominal, hold);
      F = lerp(0.985, 1, span(u, 0.02, 0.3));
      packing = span(u, 0.02, 0.08) * (1 - span(u, 0.44, 0.52));
      skin = 0.4 + 0.6 * span(u, 0, 0.9);
      gateF = span(u, B(si, 1) + 0.05, 0.5);
      lensOn = [[49, 0, 1], 15, 530, 288, 84, span(u, 0.02, 0.06) * (1 - span(u, B(si, 2) - 0.02, B(si, 2) + 0.02))];
      solid = span(u, 0.52, 1);
      const cool = u > 0.52;
      set(E.clock, cool
        ? clockSvg(span(u, 0.52, 0.98) * C.CARD.tc, C.CARD.tc, EN ? 'cool' : 'koel')
        : clockSvg(hold * C.CARD.th, C.CARD.th, EN ? 'hold' : 'nadruk'));
    } else if (si === 4) {
      F = 1;
      solid = 1;
      gateF = 1;
      const b1 = B(si, 1);
      let cushion = C.CUSHION.nominal;
      let leakOn = false;
      if (u < b1) {
        // dosing: the screw turns and is pushed back by the melt it conveys
        const k = span(u, 0.04, b1 - 0.02);
        s = lerp(C.CUSHION.nominal, 60, k);
        rot = clockS * 0.9;
        open = 1;
        const xt = C.TIP0 - s;
        const a = sp(xt - 30, 62);
        const b = sp(xt - 76, 62);
        const pa = sp(xt - 4, 62);
        const pb = sp(xt - 26, 62);
        set(E.back, `<g style="opacity:.55">${mark(M([a, b]))}${mark(arrowHead(a, b, 8))}</g>`
          + mark(M([pa, pb]), ' style="stroke-width:3"') + mark(arrowHead(pb, pa, 9)) + label(sp(xt - 15, 76)[0], sp(xt - 15, 76)[1], 'p', 20));
      } else {
        // three shots with a leaking ring: the cushion wanders
        const k = (u - b1) / (1 - b1);
        const n = Math.min(2, Math.floor(k * 3));
        const v = k * 3 - n;
        cushion = C.CUSHION.leak[n];
        if (v < 0.45) { s = lerp(60, cushion, span(v, 0.02, 0.43)); open = 0; leak = span(v, 0.05, 0.15) * (1 - span(v, 0.4, 0.45)); leakOn = true; }
        else if (v < 0.75) { s = cushion; open = 0; }
        else { s = lerp(cushion, 60, span(v, 0.77, 0.99)); open = 1; rot = clockS * 0.9; }
        set(E.back, '');
      }
      void leakOn;
      // the cushion: melt left between the tip and the barrel head, measured
      // once the screw has stopped (not counted down while it moves)
      const xt = C.TIP0 - s;
      const settled = u >= b1 && (() => { const k = (u - b1) / (1 - b1); const v = k * 3 - Math.min(2, Math.floor(k * 3)); return v >= 0.43 && v < 0.75; })();
      if (settled) {
        const z = -46;
        const a = sp(xt, z);
        const b = sp(C.BORE.x1, z);
        // the value sits right of the dimension line, so it stays on the stage in the close-up
        const lp = sp(C.BORE.x1 + 5, z - 3);
        set(E.cushion, mark(M([sp(xt, -36), sp(xt, z - 5)])) + mark(M([sp(C.BORE.x1, -36), sp(C.BORE.x1, z - 5)])) + mark(M([a, b])) + label(lp[0], lp[1], `${num(s, 0)} mm`, 18, 'start', false, 'fp-num'));
      } else set(E.cushion, '');
    } else if (si === 5) {
      const b1 = B(si, 1);
      const pt = [lerp(223, 235, span(u, 0.25, 0.5)), lerp(388, 420, span(u, 0.25, 0.5))];
      set(E.win, winSvg(pt));
      // the shot replayed: speed to 97 %, then the rest on pressure
      const k = span(u, b1, b1 + (1 - b1) * 0.55);
      s = lerp(60, 12, k);
      open = k > 0 ? 0 : 1;
      F = C.FULL * k + (1 - C.FULL) * span(u, b1 + (1 - b1) * 0.6, b1 + (1 - b1) * 0.9);
      if (F > C.FULL) s = lerp(12, C.CUSHION.nominal, (F - C.FULL) / (1 - C.FULL));
      skin = 0.4 * k;
      packing = span(u, b1 + (1 - b1) * 0.58, b1 + (1 - b1) * 0.62) * (1 - span(u, 0.95, 1));
      set(E.dec, decSvg(F));
    } else if (si === 6) {
      s = C.CUSHION.nominal;
      open = 0;
      F = 1;
      solid = 0.3;
      gateF = 0;
      const b = C.BEATS[6];
      // reduced motion shows one still per scene while the captions run on:
      // the chart then follows the cue of the caption being shown
      const still = document.querySelector('.fp').dataset.motion === 'reduce';
      let bi = u < b[1] ? 0 : u < b[2] ? 1 : u < b[3] ? 2 : 3;
      if (still) { const on = [E.visc, E.ratioHud, E.bars, E.gfs].findIndex((e) => e.hasAttribute('data-on')); bi = on < 0 ? 0 : on; }
      const full = (g) => (still ? 1 : g);
      if (still) camera(si, bi <= 1 ? 0 : 1);
      show(E.visc, bi === 0);
      show(E.ratioHud, bi === 1);
      show(E.bars, bi === 2);
      show(E.gfs, bi === 3);
      show(E.ratioMark, bi === 1);
      show(E.drop, bi === 2);
      if (bi === 0) set(E.visc, viscSvg(full(span(u, 0.03, b[1] * 0.8))));
      if (bi === 1) {
        set(E.ratioHud, ratioSvg());
        const pf = C.TIP0 - s - 250;
        set(E.ratioMark, mark(poly(rect(pf - 16, pf + 2, -C.CYL.bore - 1, C.CYL.bore + 1)), ' style="stroke-width:2.2"')
          + mark(poly([[C.TIP0 - s + 2, -C.BORE.r - 1], [C.BORE.x1, -C.BORE.r - 1], [C.BORE.x1, C.BORE.r + 1], [C.TIP0 - s + 2, C.BORE.r + 1]]), ' style="stroke-width:2.2"'));
      }
      if (bi === 2) {
        const g = full(span(u, b[2], b[2] + (b[3] - b[2]) * 0.6));
        set(E.barsBody, barsSvg(g));
        set(E.barsLimit, limitSvg());
        // the four sections of the flow path, numbered as the bars
        const segs = [[-40, C.NOZ.x1, 0, -26], [C.SPRUE.x0 + 2, C.SPRUE.x1, 0, -26], [C.GATEN.x0, C.GATEN.x1, 0, 26], [C.CAV.x0, C.CAV.x1, 50, 0]];
        set(E.drop, segs.map(([x0, x1, z, dz], i) => {
          const zc = i === 3 ? 50 : 0;
          const box = i === 3 ? rect(x0 - 2, x1 + 2, -C.CAV.h - 2, C.CAV.h + 2) : rect(x0, x1, zc - 7, zc + 7);
          const lp = sp((x0 + x1) / 2 + (i === 3 ? 22 : 0), zc + dz + (i === 3 ? 0 : 0));
          const r = 12 * camW / W;
          return `<g style="opacity:${clamp(g * 5 - i, 0, 1).toFixed(2)}">${mark(poly(box), ' style="stroke-width:1.8"')}<circle class="fp-hud-bg" cx="${f1(lp[0])}" cy="${f1(lp[1])}" r="${f1(r)}"/>${label(lp[0], lp[1] + 7 * camW / W, String(i + 1), 18)}</g>`;
        }).join(''));
      }
      if (bi === 3) {
        const g = full(span(u, b[3], b[3] + (1 - b[3]) * 0.7));
        set(E.gfs, gfsSvg(g));
        // the weight levels off from about 3 s: that is when the gate is shut
        gateF = clamp((g * 5 - 1.6) / 1.4, 0, 1);
        lensOn = [[49, 0, 1], 15, 104, 300, 82, still ? 1 : span(u, b[3], b[3] + 0.03)];
      }
    } else if (si === 7) {
      s = 60;
      F = 1;
      solid = 1;
      gateF = 1;
      const b = C.BEATS[7];
      // the lid drops from the open mould onto the scale
      const drop = span(u, 0.02, 0.14);
      move(E.lid, [0, 0, 70 * (1 - drop)]);
      fade(E.lid, span(u, 0, 0.05));
      set(E.cardsBody, cardsSvg(span(u, 0.08, b[1] * 0.95)));
      set(E.cardsIq, cardsIq);
      const n = Math.round(lerp(1, C.NOISE.length, span(u, b[1], b[2] + (1 - b[2]) * 0.3)));
      const wNow = Math.round((C.SPC.mean + C.NOISE[n - 1] * C.SPC.sd) * 1000) / 1000;
      set(E.spc, spcSvg(n, wNow));
      set(E.reval, revalSvg(span(u, b[2] + 0.02, b[2] + (1 - b[2]) * 0.6)));
      fade(E.reval, span(u, b[2], b[2] + 0.04));
    }

    // the moving parts of the injection unit
    const xt = C.TIP0 - s;
    const sc = screwSvg(xt, rot, open, leak);
    set(E.screw, sc.screw);
    set(E.ring, `<g clip-path="url(#fm-bore)">${sc.ring}</g>`);
    const pf = xt - 250;
    set(E.piston, `<path class="fp-steel" d="${poly(rect(-404, pf - 14, -6, 6))}"/><path class="fp-screw" d="${poly(rect(pf, C.CYL.x1 + 4, -9, 9))}"/><path class="fp-screw" d="${poly(rect(pf - 14, pf, -C.CYL.bore + 0.4, C.CYL.bore - 0.4))}"/>`
      + `<path class="fp-cutline" d="${poly(rect(pf - 11, pf - 8, -C.CYL.bore + 0.4, C.CYL.bore - 0.4))}"/>`);
    const m = mouldFill(F, skin, gateF, solid, packing);
    set(E.fill, (m.melt ? `<path class="fp-melt" d="${m.melt}"/>` : '') + (m.skin ? `<path class="fp-skin" d="${m.skin}"/>` : '') + m.solid);
    set(E.front, si >= 1 && si <= 5 ? (m.front ? mark(m.front, ' style="stroke-width:2"') : '') + m.pack : '');
    if (si >= 1 && si <= 4) set(E.rulerMk, rulerMarker(s));
    if (lensOn) lens(...lensOn); else set(E.lens, '');
  }

  return { render };
})();
