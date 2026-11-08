// The stage of the film "Eén cyclus van 30 seconden / One 30-second cycle": a
// pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope), a preamble from build.mjs that defines P
// (projection), C (world constants), CAM (one camera move per scene), W and H,
// and sets.js (buildSets), which draws the section, the plates and the coins.
/* global buildSets, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, slabOf, cylinder, ring, roundedPlan, onTop, planOutline, translateAlong, axisVector, holdStill, depthOf, span, ease, beatStarts, searchOf, warpU, introBeat, introCamera */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const el = (k) => svg.querySelector(`[data-k="${k}"]`);
  // draw sets 2–4 into their slots, with the kit's own functions
  /* eslint-disable no-undef */
  const K = { iso, pathOf, solidSvg, lineSvg, dotsSvg, slabOf, cylinder, ring, roundedPlan, onTop, planOutline, haloOf, insetPlan, sideSeam, segment, corners, cameraOf, sideMatrix, faceTextSvg, depthOf, topTicks, knurl };
  /* eslint-enable no-undef */
  const SETS = buildSets(K, C.SETC, P);
  const SEC = SETS.SEC;
  el('secbody').innerHTML = SETS.section;
  el('tcu').innerHTML = SETS.tcu;
  el('plates').innerHTML = SETS.plates;
  el('coinset').innerHTML = SETS.coins;
  const E = {};
  ['world', 'press', 'section', 'plates', 'coinset', 'shot', 'steel', 'cav', 'swirl', 'heat', 'dims', 'hoses', 'tcu', 'plate4', 'plate8', 'pk8', 'pkF', 'melt', 'mani', 'famcue',
    'cMat', 'cScrap', 'cMach', 'cMould', 'phasebar', 'coolseg', 'phasetext', 'mag', 'therm', 'thmark', 'labels', 'coupL', 'coupU'].forEach((k) => { E[k] = el(k); });
  const platen = [...svg.querySelectorAll('[data-pc="platen"]')];
  const screw = [...svg.querySelectorAll('[data-pc="screw"]')];
  const LANG = new URLSearchParams(searchOf(location.search, window.name)).get('lang') === 'en' ? 'en' : 'nl';
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lin = (u, a, b) => clamp((u - a) / (b - a), 0, 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => iso(p, P);
  const num = (v, dec) => {
    const s = v.toFixed(dec);
    return LANG === 'en' ? s : s.replace('.', ',');
  };
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : a.toFixed(2); if (e.__o !== v) { e.style.opacity = v; e.__o = v; } };
  const mark = (d, extra = '') => `<path class="fp-mark" d="${d}"${extra}/>`;
  const text = (x, y, t, size = 20, anchor = 'middle', cls = 'fp-ink') => `<text class="${cls} fp-label" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  // beat start of scene si, beat bi, as a share of the scene (follows the caption language)
  // (the film's scene si + 1: its first scene is the intro below)
  const beatU = (si, bi) => { const s = FILM.scenes[si + 1]; return beatStarts(s, LANG)[bi] / s.dur; };

  // ------------------------------------------------------------ camera
  let camNow = { cx: W / 2, cy: H / 2, s: 1 };
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const w = lerp(c.from[2], c.to[2], k);
    const s = W / w;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
    camNow = { cx, cy, s };
    return camNow;
  }
  const toHud = (p) => { const [x, y] = at(p); return [(x - camNow.cx) * camNow.s + W / 2, (y - camNow.cy) * camNow.s + H / 2]; };

  // ------------------------------------------------------------ the press
  const AX = axisVector(P, [1, 0, 0]);
  function shift(list, dxWorld) {
    const dx = AX[0] * dxWorld;
    const dy = AX[1] * dxWorld;
    const key = dx.toFixed(2) + ',' + dy.toFixed(2);
    list.forEach((node) => {
      if (node.__s === key) return;
      node.__s = key;
      if (dxWorld) node.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`); else node.removeAttribute('transform');
      holdStill(node, [dx, dy]);
    });
  }
  const PH = (() => { let t = 0; return C.PHASES.map(([name, d]) => { const p = { name, t0: t, dur: d }; t += d; return p; }); })();
  const phaseAt = (t) => { for (let i = PH.length - 1; i >= 0; i--) if (t >= PH[i].t0) return i; return 0; };
  // machine pose at cycle time t (0..30 s)
  function pose(t) {
    const [close, inject, hold, cool, open, eject] = PH;
    let gap = 1;
    let fwd = 0;
    let shot = 0;
    let push = 0;
    let fall = 0;
    if (t < close.t0 + close.dur) gap = 1 - ease(t / close.dur);
    else if (t < open.t0) gap = 0;
    else gap = ease((t - open.t0) / open.dur);
    if (t < inject.t0) fwd = 0;
    else if (t < inject.t0 + inject.dur) fwd = ease((t - inject.t0) / inject.dur) * 0.95;
    else if (t < hold.t0 + hold.dur) fwd = 0.95 + 0.05 * ease((t - hold.t0) / hold.dur);
    else if (t < cool.t0 + 3) fwd = 1 - ease((t - cool.t0) / 3);
    if (t >= inject.t0) shot = 1;
    if (t >= eject.t0) {
      const v = t - eject.t0;
      push = ease(v / 0.5);
      const tau = Math.max(0, v - 0.5);
      fall = 46 * tau * tau;
      if (fall > 40) shot = 0;
    }
    return { gap, fwd, shot, push, fall };
  }
  function drawPress(p) {
    shift(platen, -C.OPEN * p.gap);
    shift(screw, -C.STROKE * p.fwd);
    const along = -C.OPEN * p.gap + C.CAP_H * 0.9 * p.push;
    const down = axisVector(P, [0, 0, -p.fall]);
    const t = `translate(${(AX[0] * along + down[0]).toFixed(2)} ${(AX[1] * along + down[1]).toFixed(2)})`;
    if (E.shot.__t !== t) { E.shot.setAttribute('transform', t); E.shot.__t = t; }
    fade(E.shot, p.shot ? 1 : 0);
  }

  // the phase bar under the press (stage space)
  const B = C.BAR;
  const bx = (t) => B.x0 + ((B.x1 - B.x0) * t) / C.CYCLE;
  const NAMES = {
    nl: { close: 'sluiten', inject: 'inspuiten', hold: 'nadruk', cool: 'koelen', open: 'openen', eject: 'uitwerpen' },
    en: { close: 'close', inject: 'inject', hold: 'hold', cool: 'cool', open: 'open', eject: 'eject' },
  }[LANG];
  function phaseBar(t) {
    const y0 = B.y;
    const y1 = B.y + B.h;
    const rect = (x0, x1, cls) => `<path class="${cls}" d="M${f1(x0)} ${y0}H${f1(x1)}V${y1}H${f1(x0)}Z"/>`;
    const cool = PH[3];
    let bar = `<rect class="fp-hud-bg" x="${B.x0 - 10}" y="${y0 - 34}" width="${B.x1 - B.x0 + 20}" height="${B.h + 44}" rx="8"/>`;
    bar += rect(B.x0, B.x1, 'fp-bar-bg') + rect(B.x0, bx(Math.min(t, cool.t0)), 'fp-bar-fill');
    if (t > cool.t0 + cool.dur) bar += rect(bx(cool.t0 + cool.dur), bx(t), 'fp-bar-fill');
    const seps = PH.slice(1).map((p) => `M${f1(bx(p.t0))} ${y0 - 3}V${y1 + 3}`).join('');
    const ticks = [0, 5, 10, 15, 20, 25, 30].map((s) => `M${f1(bx(s))} ${y1 + 3}V${y1 + 7}`).join('');
    bar += mark(`M${B.x0} ${y0}H${B.x1}V${y1}H${B.x0}Z`) + mark(seps) + mark(ticks);
    set(E.phasebar, bar);
    let cseg = rect(bx(cool.t0), bx(Math.min(Math.max(t, cool.t0), cool.t0 + cool.dur)), 'fp-bar-fill');
    cseg += mark(`M${f1(bx(cool.t0))} ${y0}H${f1(bx(cool.t0 + cool.dur))}V${y1}H${f1(bx(cool.t0))}Z`, ' style="stroke-width:1.8"');
    set(E.coolseg, cseg);
    const i = phaseAt(t);
    const p = PH[i];
    const cx = clamp(bx(p.t0 + p.dur / 2), B.x0 + 50, B.x1 - 120);
    const now = bx(Math.min(t, C.CYCLE));
    set(E.phasetext, text(cx, y0 - 10, NAMES[p.name], 20) + text(B.x1, y0 - 10, `${num(Math.min(t, C.CYCLE), 1)} / ${C.CYCLE} s`, 20, 'end', 'fp-ink fp-mono')
      + `<path class="fp-mark" style="stroke-width:2.4" d="M${f1(now)} ${y0 - 4}V${y1 + 4}"/>`);
  }

  // ------------------------------------------------------------ the section
  const pl = (x, z) => `${f1(x)} ${f1(-z)}`;
  const rectD = (x0, z0, x1, z1) => `M${pl(x0, z0)}H${f1(x1)}V${f1(-z1)}H${f1(x0)}Z`;
  // the part: a wall [x0..x1] × [0..s], optionally with the boss below it
  function partShape(s, boss) {
    const [x0, x1] = C.WALL_X;
    if (!boss) return { d: rectD(x0, 0, x1, s), rects: [[x0, 0, x1, s]] };
    const [b0, b1] = C.BOSS;
    const zb = s - 2 * s; // boss bottom: the boss is 2s deep, its top flush with the wall's top
    const d = `M${pl(x0, 0)}H${f1(b0)}V${f1(-zb)}H${f1(b1)}V${f1(0)}H${f1(x1)}V${f1(-s)}H${f1(x0)}Z`;
    return { d, rects: [[x0, 0, x1, s], [b0, zb, b1, s]] };
  }
  // molten core: each rectangle inset by the frozen skin δ (union of the insets)
  function moltenOf(rects, delta) {
    return rects.map(([x0, z0, x1, z1]) => {
      const a = x0 + delta;
      const b = x1 - delta;
      const c = z0 + delta;
      const d = z1 - delta;
      return a < b - 0.05 && c < d - 0.05 ? rectD(a, c, b, d) : '';
    }).join('');
  }
  let steelKey = '';
  function section(s, boss, delta, clock, flowFast) {
    const shape = partShape(s, boss);
    const key = `${f1(s)}|${boss}`;
    if (key !== steelKey) {
      steelKey = key;
      const steel = SEC.rect + shape.d + SEC.holes;
      E.steel.innerHTML = `<clipPath id="fp-steelclip"><path clip-rule="evenodd" d="${steel}"/></clipPath><path class="fp-steel" fill-rule="evenodd" d="${steel}"/><path class="fp-hatch" clip-path="url(#fp-steelclip)" d="${SEC.hatch}"/>`;
      E.__part = shape;
    }
    const molten = moltenOf(shape.rects, delta);
    set(E.cav, `<path class="fp-solid" d="${shape.d}"/><path class="fp-melt" d="${molten}"/><path class="fp-mark" style="stroke-width:1.6" d="${shape.d}"/>`);
    // heat: dots leave the hot core and drift into the nearest channels
    let heat = '';
    if (molten) {
      const hot = shape.rects.map(([x0, z0, x1, z1]) => [(x0 + x1) / 2, (z0 + z1) / 2, x1 - x0, z1 - z0]);
      C.CHAN.forEach(([cx, cz], i) => {
        for (let j = 0; j < 3; j++) {
          const ph = ((clock * 0.55 + j / 3 + i * 0.137) % 1 + 1) % 1;
          // start on the part surface just under/over the channel
          const r0 = hot.find(([mx, , w]) => Math.abs(cx - mx) < w / 2 + 6) || hot[0];
          const sx = clamp(cx + (j - 1) * 6, r0[0] - r0[2] / 2 + 2, r0[0] + r0[2] / 2 - 2);
          const sz = cz > r0[1] ? r0[1] + r0[3] / 2 : r0[1] - r0[3] / 2;
          const x = lerp(sx, cx, ph);
          const z = lerp(sz, cz, ph);
          const a = Math.sin(ph * Math.PI) * 0.9;
          heat += `<circle class="fp-heat" cx="${f1(x)}" cy="${f1(-z)}" r="2.6" opacity="${a.toFixed(2)}"/>`;
        }
      });
    }
    set(E.heat, heat);
    // water turning in each channel
    const sw = C.CHAN.map(([cx, cz], i) => {
      const a0 = clock * (flowFast ? 5 : 1.6) + i;
      const r = C.CHAN_R * 0.55;
      const pts = [];
      for (let q = 0; q <= 10; q++) {
        const a = a0 + (q / 10) * Math.PI * 1.3;
        const rr = r * (0.5 + 0.5 * q / 10);
        pts.push([cx + Math.cos(a) * rr, -(cz + Math.sin(a) * rr)]);
      }
      return pathOf(pts);
    }).join('');
    set(E.swirl, `<path class="fp-swirl" d="${sw}"/>`);
  }
  // the boss outline and its dimension: s on the wall, 2s across the boss
  function bossDims(s, on) {
    if (!on) { set(E.dims, ''); return; }
    const [b0, b1] = C.BOSS;
    set(E.dims, `<path class="fp-mark" style="stroke-width:1.6" d="${rectD(b0, -s, b1, s)}"/>`);
  }
  // HUD labels for the section: s and 2s
  function dimLabels(s, boss) {
    const [x0] = C.WALL_X;
    const out = [];
    // s: a dimension just left of the wall's end, in the steel
    const dx = x0 - 0.35 * C.MM;
    const p0 = toHud([dx, 0, 0]);
    const p1 = toHud([dx, 0, s]);
    const tick = (p) => `M${f1(p[0] - 5)} ${f1(p[1])}h10`;
    out.push(`<path class="fp-mark" style="stroke-width:1.6" d="M${f1(p0[0])} ${f1(p0[1])}L${f1(p1[0])} ${f1(p1[1])}${tick(p0)}${tick(p1)}"/>` + text(p0[0] - 10, (p0[1] + p1[1]) / 2 + 7, 's', 22, 'end'));
    if (boss) {
      // 2s: across the boss, just under it
      const [b0, b1] = C.BOSS;
      const z = -s - 0.7 * C.MM;
      const q0 = toHud([b0, 0, z]);
      const q1 = toHud([b1, 0, z]);
      const vt = (p) => `M${f1(p[0])} ${f1(p[1] - 5)}v10`;
      out.push(`<path class="fp-mark" style="stroke-width:1.6" d="M${f1(q0[0])} ${f1(q0[1])}L${f1(q1[0])} ${f1(q1[1])}${vt(q0)}${vt(q1)}"/>` + text(q1[0] + 10, q1[1] + 7, '2s', 22, 'start'));
    }
    return out.join('');
  }

  // ------------------------------------------------------------ HUD: magnifier and thermometer (scene 5)
  const MAG = [92, 104];
  const MR = 76;
  function magnifier(u, turbulent, clock) {
    const [mx, my] = MAG;
    const out = [`<clipPath id="fp-magclip"><circle cx="${mx}" cy="${my}" r="${MR}"/></clipPath>`, `<circle class="fp-hud-bg" cx="${mx}" cy="${my}" r="${MR}"/>`, '<g clip-path="url(#fp-magclip)">'];
    const wall = 34;
    out.push(mark(`M${mx - MR} ${my - wall}H${mx + MR}M${mx - MR} ${my + wall}H${mx + MR}`, ' style="stroke-width:1.6"'));
    let hat = '';
    for (let c = -2 * MR; c < 2 * MR; c += 10) hat += `M${mx + c} ${my - MR}l${MR - wall} ${MR - wall}M${mx + c} ${my + wall}l${MR - wall} ${MR - wall}`;
    out.push(`<path class="fp-hatch" d="${hat}"/>`);
    if (!turbulent) {
      // laminar: straight layers, the middle ones fastest
      for (let i = -3; i <= 3; i++) {
        const y = my + i * 9;
        const v = 1 - (i / 4) ** 2;
        const off = ((clock * 40 * v) % 24 + 24) % 24;
        out.push(`<path class="fp-swirl" stroke-dasharray="12 12" stroke-dashoffset="${(-off).toFixed(1)}" d="M${mx - MR} ${y}H${mx + MR}"/>`);
      }
    } else {
      // turbulent: eddies carried along, turning as they go
      for (let i = 0; i < 9; i++) {
        const seed = Math.sin(i * 91.7) * 1000;
        const r = seed - Math.floor(seed);
        const x = mx - MR + ((clock * 46 + i * 21) % (2 * MR + 30)) - 15;
        const y = my + (r - 0.5) * 2 * (wall - 12);
        const a0 = clock * 4 * (i % 2 ? 1 : -1) + i;
        const pts = [];
        for (let q = 0; q <= 14; q++) {
          const a = a0 + (q / 14) * Math.PI * 1.6;
          const rr = 3 + 7 * q / 14;
          pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
        }
        out.push(`<path class="fp-swirl" d="${pathOf(pts)}"/>`);
      }
    }
    out.push('</g>', `<circle class="fp-mark" cx="${mx}" cy="${my}" r="${MR}" style="stroke-width:1.6"/>`);
    // the leader from the channel it magnifies
    const [cx, cz] = C.CHAN[0];
    const [tx, ty] = toHud([cx, 0, cz]);
    const ang = Math.atan2(ty - my, tx - mx);
    out.push(mark(`M${f1(tx)} ${f1(ty)}L${f1(mx + Math.cos(ang) * MR)} ${f1(my + Math.sin(ang) * MR)}`));
    set(E.mag, out.join(''));
  }
  const TH = { x: W - 44, y0: 40, y1: 220, w: 14, mark: 0.3 };
  function thermometer(level) {
    const { x, y0, y1, w } = TH;
    const yl = y1 - (y1 - y0) * level;
    const ym = y1 - (y1 - y0) * TH.mark;
    let ticks = '';
    for (let i = 0; i <= 10; i++) { const y = y1 - ((y1 - y0) * i) / 10; ticks += `M${x + w / 2 + 3} ${y.toFixed(1)}h${i % 5 ? 4 : 8}`; }
    set(E.therm, `<rect class="fp-hud-bg" x="${x - w / 2 - 14}" y="${y0 - 14}" width="${w + 46}" height="${y1 - y0 + 58}" rx="10"/>`
      + `<path class="fp-melt" d="M${x - w / 2 + 3} ${yl.toFixed(1)}H${x + w / 2 - 3}V${y1 + 4}H${x - w / 2 + 3}Z"/><circle class="fp-melt" cx="${x}" cy="${y1 + 14}" r="${w / 2 + 3}"/>`
      + mark(`M${x - w / 2} ${y1 + 4}V${y0 + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y0 + w / 2}V${y1 + 4}`) + `<circle class="fp-mark" cx="${x}" cy="${y1 + 14}" r="${w / 2 + 6}"/>` + mark(ticks));
    set(E.thmark, mark(`M${x - w / 2 - 6} ${ym.toFixed(1)}H${x + w / 2 + 16}`, ' style="stroke-width:2.6"') + `<circle class="fp-ink" cx="${x + w / 2 + 19}" cy="${ym.toFixed(1)}" r="3.4"/>`);
  }

  // ------------------------------------------------------------ the plates (scene 6)
  // a polyline cut to the first `len` units
  function partial(pts, len) {
    const out = [pts[0]];
    let left = len;
    for (let i = 1; i < pts.length && left > 0; i++) {
      const [a, b] = [pts[i - 1], pts[i]];
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const t = Math.min(1, left / d);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      left -= d;
    }
    return out;
  }
  const lengthOf = (pts) => pts.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
  const meltPath = (pts, len, wpx) => {
    const p = partial(pts, len);
    return p.length > 1 ? `<path class="fp-meltline" style="stroke-width:${wpx}" d="${onTop(p, C.PZ + 0.1, P)}"/>` : '';
  };
  const pool = (x, y, r) => (r > 0.4 ? `<path class="fp-pool" d="${ring(x, y, r, C.PZ + 0.1, P, 36)}"/>` : '');
  function fillRun(runs, cavs, q, wpx) {
    // q 0..1: melt runs down every flow path (all the same length), then the cavities fill
    const L0 = Math.max(...runs.map(lengthOf));
    const run = lin(q, 0, 0.55);
    const fill = lin(q, 0.5, 1);
    return runs.map((r) => meltPath(r, lengthOf(r) * run, wpx)).join('') + cavs.map(([x, y]) => pool(x, y, (C.POCKET_R - 1) * Math.sqrt(fill))).join('') + (L0 ? '' : '');
  }
  function manifold(lift) {
    const parts = [];
    const nozzles = C.CAV8.slice().sort((a, b) => depthOf([a[0], a[1], 0], P) - depthOf([b[0], b[1], 0], P));
    for (const [x, y] of nozzles) parts.push(solidSvg(cylinder(x, y, 4.2, C.PZ + 4, 26, P, 20), { tone: 'mid' }) + solidSvg(cylinder(x, y, 2.4, C.PZ, 4, P, 16), { tone: 'hi', crease: 'lo' }));
    const bars = [{ x: -100, y: -36, w: 200, d: 12 }, { x: -6, y: -30, w: 12, d: 60 }, { x: -100, y: 24, w: 200, d: 12 }];
    for (const b of bars) parts.push(solidSvg(slabOf({ r: 1, ...b }, C.PZ + 30, 10, P, 3, 0.5), { tone: 'mid', inner: lineSvg(planOutline({ r: 1, ...b }, C.PZ + 40, P, 3), { tone: 'faint' }) }));
    for (const [x, y] of nozzles) {
      parts.push(solidSvg(cylinder(x, y, 5.6, C.PZ + 40, 7, P, 24, 0.4), { tone: 'mid' }));
      const l = lift(x, y);
      parts.push(solidSvg(cylinder(x, y, 1.5, C.PZ + 47, 4 + 8 * l, P, 12), { tone: 'hi', crease: 'lo' }));
    }
    return parts.join('');
  }
  function plates(si, u, clock) {
    const b2 = beatU(si, 1);
    const b3 = beatU(si, 2);
    const b4 = beatU(si, 3);
    const swap = lin(u, 0.12, 0.2); // 4 → 8 cavities
    show(E.plate4, swap < 1);
    show(E.plate8, swap > 0);
    show(E.pk8, u < b4);
    show(E.pkF, u >= b4);
    fade(E.plate4, 1 - swap);
    fade(E.plate8, swap);
    const wpx = 5;
    let melt = '';
    if (u < 0.12) melt = fillRun(C.RUN4, C.CAV4, lin(u, 0.01, 0.11), wpx);
    else if (u < b2) melt = fillRun(C.RUN8, C.CAV8, lin(u, 0.2, b2 - 0.02), wpx);
    else if (u < b3) melt = fillRun(C.RUN8, C.CAV8, lin(u, b2 + 0.02, b3 - 0.03), wpx);
    else if (u < b4) {
      // valve gates: the needles lift one after the other, each cavity fills when its gate opens
      const order = C.CAV8.map(([x, y], i) => ({ x, y, i })).sort((a, b) => a.x - b.x || a.y - b.y);
      const q = lin(u, b3 + 0.02, b4 - 0.02);
      const openAt = (i) => 0.1 + (order.findIndex((o) => o.i === i) / 8) * 0.55;
      melt = C.CAV8.map(([x, y], i) => pool(x, y, (C.POCKET_R - 1) * Math.sqrt(lin(q, openAt(i), openAt(i) + 0.3)))).join('');
      set(E.mani, manifold((x, y) => { const i = C.CAV8.findIndex((c) => c[0] === x && c[1] === y); return span(q, openAt(i) - 0.06, openAt(i)) * (1 - span(q, openAt(i) + 0.32, openAt(i) + 0.4)); }));
    }
    show(E.mani, u >= b3 && u < b4);
    fade(E.mani, lin(u, b3, b3 + 0.03));
    set(E.melt, melt);
    // the family mould: the lid fills well before the base
    if (u >= b4) {
      const q = lin(u, b4 + 0.02, 0.98);
      const { lid, base } = C.FAM;
      const runL = [[0, 0], [lid.x + lid.w, 0]];
      const runB = [[0, 0], [base.x, 0]];
      const fl = lin(q, 0.15, 0.55);
      const fb = lin(q, 0.18, 0.95);
      const grow = (p, f, fromRight) => {
        if (f <= 0.01) return '';
        const w = p.w * f;
        const plan = { x: fromRight ? p.x + p.w - w : p.x, y: p.y, w, d: p.d, r: Math.min(p.r, w / 2) };
        return `<path class="fp-pool" d="${planOutline(plan, C.PZ + 0.1, P, 4)}"/>`;
      };
      set(E.famcue, meltPath(runL, lengthOf(runL) * lin(q, 0, 0.15), wpx) + meltPath(runB, lengthOf(runB) * lin(q, 0, 0.18), wpx) + grow(lid, fl, true) + grow(base, fb, false));
    } else set(E.famcue, '');
    return clock;
  }

  // ------------------------------------------------------------ the coins (scene 7)
  const coinSvg = (x, y, z, h = C.COIN_H) => solidSvg(cylinder(x, y, C.COIN_R, z, h, P, 40, 0.5), { tone: 'mid' }) + lineSvg(ring(x, y, C.COIN_R - 3, z + h, P, 32), { tone: 'lo' });
  let coinKey = '';
  function coins(si, u) {
    const b = [0, 1, 2, 3].map((i) => beatU(si, i));
    const n = [
      Math.round(C.CENTS[0] * lin(u, b[0] + 0.02, b[0] + 0.12)),
      Math.round(C.CENTS[1] * lin(u, b[1] + 0.02, b[1] + 0.13)),
      Math.round(C.CENTS[2] * lin(u, b[2] + 0.02, b[2] + 0.11)),
    ];
    const sliver = lin(u, b[0] + 0.12, b[0] + 0.16);
    const key = n.join() + '|' + sliver.toFixed(2);
    if (key !== coinKey) {
      coinKey = key;
      const stack = (s) => { let h = ''; for (let i = 0; i < n[s]; i++) h += coinSvg(C.STACKS[s][0], C.STACKS[s][1], i * C.COIN_H); return h; };
      E.cMat.innerHTML = stack(0);
      // the scrap: 3 % on top of the material, a thin sliver of a coin
      E.cScrap.innerHTML = sliver > 0 ? coinSvg(C.STACKS[0][0], C.STACKS[0][1], n[0] * C.COIN_H, 0.72 * C.COIN_H * sliver) : '';
      E.cMach.innerHTML = stack(1);
      E.cMould.innerHTML = stack(2);
    }
    // labels: the cost of each line above its stack, the total at the end
    const labels = [];
    const vals = C.COST;
    C.STACKS.forEach(([x, y], s) => {
      if (!n[s]) return;
      const [hx, hy] = toHud([x, y, n[s] * C.COIN_H + (s === 0 ? 3 : 0) + 4]);
      labels.push(text(hx, hy - 12, `€ ${num(vals[s], 3)}`, 20));
    });
    if (u > b[3]) {
      const [hx, hy] = toHud([C.STACKS[1][0], 0, C.CENTS[1] * C.COIN_H + 30]);
      labels.push(`<g opacity="${lin(u, b[3], b[3] + 0.04).toFixed(2)}">${text(hx, hy - 20, `≈ € ${num(vals[0] + vals[1] + vals[2], 2)}`, 26)}</g>`);
    }
    return labels.join('');
  }

  // ------------------------------------------------------------ render
  const SET_OF = ['press', 'press', 'section', 'section', 'section', 'plates', 'coinset'];
  const HUDS = [['phasebar', 'coolseg', 'phasetext'], [], ['labels'], ['labels'], ['mag', 'therm', 'thmark'], ['labels'], ['labels']];
  let shown = -1;
  function render(si, u) {
    if (si !== shown) {
      shown = si;
      for (const k of ['press', 'section', 'plates', 'coinset']) show(E[k], SET_OF[si] === k);
      for (const k of ['phasebar', 'coolseg', 'phasetext', 'mag', 'therm', 'thmark', 'labels']) show(E[k], HUDS[si].includes(k));
      show(E.tcu, si === 4);
      show(E.hoses, si === 4);
    }
    camera(si, u);
    const clock = u * C.dur[si];
    let labels = '';
    if (si === 0) {
      const t = u * C.CYCLE;
      drawPress(pose(t));
      phaseBar(t);
    } else if (si === 1) {
      // the cap mould: closed and cooling, opens, shows its two cavities with the caps, ejects, closes
      // the mould opens on two caps, ejects them, shows its two empty cavities,
      // closes for the next shot and opens on two new caps
      const gap = span(u, 0.04, 0.16) * (1 - span(u, 0.5, 0.6)) + span(u, 0.84, 0.94);
      if (u < 0.5) {
        const push = span(u, 0.2, 0.24);
        const tau = Math.max(0, (u - 0.24) * C.dur[1]);
        const fall = 46 * tau * tau;
        drawPress({ gap, fwd: 0, shot: fall < 40 ? 1 : 0, push, fall });
      } else drawPress({ gap, fwd: span(u, 0.6, 0.64), shot: u > 0.62 ? 1 : 0, push: 0, fall: 0 });
    } else if (si === 2) {
      // a wall with a boss: the wall sets through at a quarter of the time the boss needs
      const q = lin(u, 0.04, 0.96);
      const delta = C.SWALL * Math.sqrt(q);
      section(C.SWALL, true, delta, clock, false);
      bossDims(C.SWALL, true);
      labels = dimLabels(C.SWALL, true);
    } else if (si === 3) {
      // the cap: 12 s of cooling at 3 mm, then the wall thinned to 2,4 mm: 7,7 s
      const b2 = beatU(si, 1);
      const thin = span(u, b2 - 0.06, b2);
      const s = lerp(C.SWALL, C.SWALL * 0.8, thin);
      const run1 = lin(u, 0.03, b2 - 0.08);
      const T1 = (b2 - 0.11);
      const run2 = lin(u, b2 + 0.03, b2 + 0.03 + T1 * 0.64);
      const delta = u < b2 - 0.06 ? (C.SWALL / 2) * Math.sqrt(run1) : (u < b2 + 0.03 ? 0 : (s / 2) * Math.sqrt(run2));
      section(s, false, delta, clock, false);
      bossDims(s, false);
      labels = dimLabels(s, false);
      // two timer bars: 12 s, then 7,7 s, on one scale
      const x0 = 150;
      const sc = 22; // px per second
      const y = H - 56;
      const bar = (yy, secs, f, lab) => `<path class="fp-bar-bg" d="M${x0} ${yy}h${f1(12 * sc)}v12h${f1(-12 * sc)}Z"/><path class="fp-bar-fill" d="M${x0} ${yy}h${f1(secs * sc * f)}v12h${f1(-secs * sc * f)}Z"/>${mark(`M${x0} ${yy}h${f1(12 * sc)}v12h${f1(-12 * sc)}Z`)}${text(x0 - 10, yy + 11, lab, 20, 'end', 'fp-ink fp-mono')}${f > 0.98 ? text(x0 + 12 * sc + 10, yy + 11, `${num(secs, secs % 1 ? 1 : 0)} s`, 20, 'start', 'fp-ink fp-mono') : ''}`;
      labels += `<rect class="fp-hud-bg" x="${x0 - 92}" y="${y - 12}" width="${12 * sc + 160}" height="62" rx="8"/>`
        + bar(y, 12, run1, `${num(3, 1)} mm`) + (u > b2 ? bar(y + 22, 12 * 0.64, run2, `${num(2.4, 1)} mm`) : '');
    } else if (si === 4) {
      // the unit holds the steel warm; water swirls; the core cools to the ejection temperature
      const q = lin(u, 0.04, 0.82);
      const s = C.SWALL * 0.8;
      section(s, false, (s / 2) * Math.sqrt(q), clock, u > beatU(si, 2));
      bossDims(s, false);
      magnifier(u, u > beatU(si, 2), clock);
      thermometer(lerp(0.95, TH.mark, Math.pow(q, 0.7)));
    } else if (si === 5) {
      plates(si, u, clock);
    } else if (si === 6) {
      labels = coins(si, u);
    }
    set(E.labels, labels);
  }

  // ------------------------------------------------------------ v14b: the intro, and the audio warp
  // Scene 1 of the film is a "how it works" tour of the machine, built from the
  // stage's own press states; the scenes after it are the stage's own scenes,
  // one index on. In a video render each scene's progress is warped so the
  // moves land on the spoken lines (designed: the beat shares beatU uses).
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, LANG).map((t) => t / s.dur); };
  const hud = svg.querySelector('[data-k="hud"]');
  function intro(u) {
    const d = designed(0);
    const { k, p } = introBeat(u, d);
    const T = C.CYCLE;
    // at rest; closing; injecting; holding and cooling; opening and ejecting (as scene 3)
    if (k === 0) render(0, 0);
    else if (k === 1) render(0, lerp(0, 2 / T, span(p, 0.1, 0.9)));
    else if (k === 2) render(0, lerp(2 / T, 3.5 / T, span(p, 0.1, 0.9)));
    else if (k === 3) render(0, lerp(3.5 / T, 24.4 / T, p));
    else render(1, lerp(0.04, 0.48, p));
    introCamera(E.world, C.INTRO, d, u, W, H);
  }
  return {
    render(si, u) {
      show(hud, si !== 0);
      if (si === 0) intro(warpU(0, u, designed(0)));
      else render(si - 1, warpU(si, u, designed(si)));
    },
  };
})();
