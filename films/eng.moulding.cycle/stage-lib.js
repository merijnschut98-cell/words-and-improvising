// The stage library of the four moulding cycle films (Task 17, pilot B): the press, the section of a mould with its
// cooling channels, the mould plates, the coins, the HUD pieces (phase bar, magnifier, thermometer, cards) and the
// camera. Each film adds its own scenes (its stage.js, appended to this file by the build; the closing of the
// function is there). A pure function of (scene, u). Inlined into the page after the anatomy kit (iso-kit functions in
// scope) and a preamble from room.mjs that defines P (projection), C (world constants and the beat starts and lengths
// per scene), CAM (one camera move per scene), W and H; sets.js (buildSets) draws the section, the plates and the coins.
/* global WANT, buildSets, searchOf, P, C, CAM, W, H, iso, pathOf, solidSvg, lineSvg, dotsSvg, slabOf, cylinder, ring, roundedPlan, onTop, planOutline, translateAlong, axisVector, holdStill, depthOf, span, ease, haloOf, insetPlan, sideSeam, segment, corners, cameraOf, sideMatrix, faceTextSvg, topTicks, knurl */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const el = (k) => svg.querySelector(`[data-k="${k}"]`);
  const K = { iso, pathOf, solidSvg, lineSvg, dotsSvg, slabOf, cylinder, ring, roundedPlan, onTop, planOutline, haloOf, insetPlan, sideSeam, segment, corners, cameraOf, sideMatrix, faceTextSvg, depthOf, topTicks, knurl };
  // draw the sets this film has into their slots, with the kit's own functions
  const SETS = buildSets(K, C.SETC, P, WANT);
  const SEC = SETS.SEC;
  const into = (k, html) => { const e = el(k); if (e && html !== undefined) e.innerHTML = html; };
  into('secbody', SETS.section);
  into('tcu', SETS.tcu);
  into('plates', SETS.plates);
  into('coinset', SETS.coins);
  const E = {};
  ['world', 'press', 'section', 'plates', 'coinset', 'shot', 'steel', 'cav', 'swirl', 'heat', 'dims', 'hoses', 'tcu', 'plate4', 'plate8', 'pk8', 'pkF', 'melt', 'mani', 'famcue',
    'cMat', 'cScrap', 'cMach', 'cMould', 'phasebar', 'coolseg', 'phasetext', 'mag', 'therm', 'thmark', 'labels', 'card', 'coupL', 'coupU'].forEach((k) => { E[k] = el(k); });
  const platen = [...svg.querySelectorAll('[data-pc="platen"]')];
  const screw = [...svg.querySelectorAll('[data-pc="screw"]')];
  const LANG = new URLSearchParams(searchOf(location.search, window.name)).get('lang') === 'en' ? 'en' : 'nl';
  const tr = (nl, en) => (LANG === 'nl' ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lin = (u, a, b) => clamp((u - a) / (b - a), 0, 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const at = (p) => iso(p, P);
  const num = (v, dec) => {
    const s = v.toFixed(dec);
    return LANG === 'en' ? s : s.replace('.', ',');
  };
  // money and big numbers: 166.700 in Dutch, 166,700 in English
  const big = (v) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, LANG === 'en' ? ',' : '.');
  const show = (e, on) => { if (!e) return; const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e && e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { if (!e) return; const v = a >= 0.999 ? '' : a.toFixed(2); if (e.__o !== v) { e.style.opacity = v; e.__o = v; } };
  const mark = (d, extra = '') => `<path class="fp-mark" d="${d}"${extra}/>`;
  const text = (x, y, t, size = 22, anchor = 'middle', cls = 'fp-ink') => `<text class="${cls} fp-label" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const mono = (x, y, t, size = 22, anchor = 'start') => text(x, y, t, size, anchor, 'fp-ink fp-mono');
  // the beat a scene is in at u (C.B[si] holds the start of every beat and then 1)
  const beatOf = (si, u) => {
    const B = C.B[si];
    let b = 0;
    for (let i = 0; i < B.length - 1; i++) if (u >= B[i] - 1e-9) b = i;
    return b;
  };

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
  // what a scene shows: the sets and HUD groups in the lists are on, every other one off (reset when the scene changes)
  let shown = -1;
  function scene(si, sets, huds, withTcu = false) {
    if (si === shown) return;
    shown = si;
    for (const k of ['press', 'section', 'plates', 'coinset']) show(E[k], sets.includes(k));
    for (const k of ['phasebar', 'coolseg', 'phasetext', 'mag', 'therm', 'thmark', 'labels', 'card']) { show(E[k], huds.includes(k)); if (E[k]) E[k].style.opacity = ''; }
    show(E.tcu, withTcu);
    show(E.hoses, withTcu);
  }

  // ------------------------------------------------------------ cards
  const panelD = (x, y, w, h) => `<path class="fp-panel" d="M${x + 8} ${y}h${w - 16}a8 8 0 0 1 8 8v${h - 16}a8 8 0 0 1 -8 8h${-(w - 16)}a8 8 0 0 1 -8 -8v${-(h - 16)}a8 8 0 0 1 8 -8z"/>`;
  const ROWH = 34;
  // a card of rows: each row [beat it appears with, text, 'code' or '', delay in the beat 0..1]; a row shows from its time
  // on, the row of the current beat is marked; the panel grows with the rows. Words are drawn as tr('nl', 'en', width).
  function cardSvg(x, y, w, tag, rows, si, u) {
    const B = C.B[si];
    const start = (r) => B[r[0]] + (r[3] || 0) * ((B[r[0] + 1] ?? 1) - B[r[0]]);
    const live = rows.filter((r) => u >= start(r));
    if (!live.length) return '';
    const bi = beatOf(si, u);
    const now = live.filter((r) => r[0] === bi).pop();
    const h = 44 + (rows.indexOf(live[live.length - 1]) + 1) * ROWH;
    let out = panelD(x, y, w, h) + text(x + 16, y + 28, tag, 22, 'start', 'fp-ink fp-dim');
    rows.forEach((r, i) => {
      const o = clamp((u - start(r)) / 0.04, 0, 1);
      if (o <= 0) return;
      const yy = y + 28 + (i + 1) * ROWH;
      if (r === now) out += `<path class="fp-cur" d="M${x + 6} ${yy - 24}h${w - 12}v32h${-(w - 12)}z"/>`;
      out += `<g style="opacity:${f1(o)}">${r[2] === 'code' ? mono(x + 16, yy, r[1]) : text(x + 16, yy, r[1], 22, 'start')}</g>`;
    });
    return out;
  }

//@part press
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

  // the phase bar under the press (stage space); extra: seconds added "to be safe" to the cooling, drawn after it
  const B0 = C.BAR;
  const bx = (t, total) => B0.x0 + ((B0.x1 - B0.x0) * t) / total;
  function phaseBar(t, extra = 0, extraLabel = '') {
    const total = C.CYCLE + extra;
    const y0 = B0.y;
    const y1 = B0.y + B0.h;
    const rect = (x0, x1, cls) => `<path class="${cls}" d="M${f1(x0)} ${y0}H${f1(x1)}V${y1}H${f1(x0)}Z"/>`;
    const cool = PH[3];
    const names = { close: tr('sluiten', 'close'), inject: tr('inspuiten', 'inject'), hold: tr('nadruk', 'hold'), cool: tr('koelen', 'cool'), open: tr('openen', 'open'), eject: tr('uitwerpen', 'eject') };
    // the phases after the cooling move right by the extra seconds
    const t0 = (i) => PH[i].t0 + (i > 3 ? extra : 0);
    const tt = (s) => (s > cool.t0 + cool.dur ? s + extra : s);
    let bar = `<rect class="fp-hud-bg" x="${B0.x0 - 10}" y="${y0 - 40}" width="${B0.x1 - B0.x0 + 20}" height="${B0.h + 50}" rx="8"/>`;
    bar += rect(B0.x0, B0.x1, 'fp-meter-bg') + rect(B0.x0, bx(Math.min(t, cool.t0), total), 'fp-meter-fill');
    if (t > cool.t0 + cool.dur) bar += rect(bx(cool.t0 + cool.dur + extra, total), bx(tt(t), total), 'fp-meter-fill');
    const seps = PH.slice(1).map((p, i) => `M${f1(bx(t0(i + 1), total))} ${y0 - 3}V${y1 + 3}`).join('');
    const ticks = [0, 5, 10, 15, 20, 25, 30].map((s) => `M${f1(bx(s > 15 ? s + extra : s, total))} ${y1 + 3}V${y1 + 7}`).join('');
    bar += mark(`M${B0.x0} ${y0}H${B0.x1}V${y1}H${B0.x0}Z`) + mark(seps) + mark(ticks);
    if (extra) bar += `<path class="fp-hatch" d="M${f1(bx(cool.t0 + cool.dur, total))} ${y0}h${f1(bx(extra, total) - B0.x0)}v${B0.h}h${f1(B0.x0 - bx(extra, total))}z" style="stroke-width:2"/>`;
    set(E.phasebar, bar);
    let cseg = rect(bx(cool.t0, total), bx(Math.min(Math.max(t, cool.t0), cool.t0 + cool.dur + extra), total), 'fp-meter-fill');
    cseg += mark(`M${f1(bx(cool.t0, total))} ${y0}H${f1(bx(cool.t0 + cool.dur + extra, total))}V${y1}H${f1(bx(cool.t0, total))}Z`, ' style="stroke-width:1.8"');
    set(E.coolseg, cseg);
    const i = phaseAt(t);
    const p = PH[i];
    const cx = clamp(bx(p.t0 + p.dur / 2 + (i > 3 ? extra : 0), total), B0.x0 + 60, B0.x1 - 200);
    const now = bx(tt(Math.min(t, C.CYCLE)), total);
    set(E.phasetext, text(cx, y0 - 12, names[p.name], 22) + (extraLabel ? text(B0.x1, y0 - 12, extraLabel, 22, 'end') : text(B0.x1, y0 - 12, `${num(Math.min(t, C.CYCLE), 1)} / ${C.CYCLE} s`, 22, 'end', 'fp-ink fp-mono'))
      + `<path class="fp-mark" style="stroke-width:2.4" d="M${f1(now)} ${y0 - 4}V${y1 + 4}"/>`);
  }

//@endpart
//@part section
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
  function section(s, boss, delta, clock, flowFast, hot = 0) {
    const shape = partShape(s, boss);
    const key = `${f1(s)}|${boss}`;
    if (key !== steelKey) {
      steelKey = key;
      const steel = SEC.rect + shape.d + SEC.holes;
      E.steel.innerHTML = `<clipPath id="fp-steelclip"><path clip-rule="evenodd" d="${steel}"/></clipPath><path class="fp-steel" fill-rule="evenodd" d="${steel}"/><path class="fp-hatch" clip-path="url(#fp-steelclip)" d="${SEC.hatch}"/>`;
    }
    const molten = moltenOf(shape.rects, delta);
    set(E.cav, `<path class="fp-solid" d="${shape.d}"/><path class="fp-melt" d="${molten}"/><path class="fp-mark" style="stroke-width:1.6" d="${shape.d}"/>`);
    // heat: dots leave the hot core and drift into the nearest channels
    let heat = '';
    if (molten) {
      const hotR = shape.rects.map(([x0, z0, x1, z1]) => [(x0 + x1) / 2, (z0 + z1) / 2, x1 - x0, z1 - z0]);
      C.CHAN.forEach(([cx, cz], i) => {
        for (let j = 0; j < 3; j++) {
          const ph = ((clock * 0.55 + j / 3 + i * 0.137) % 1 + 1) % 1;
          const r0 = hotR.find(([mx, , w]) => Math.abs(cx - mx) < w / 2 + 6) || hotR[0];
          const sx = clamp(cx + (j - 1) * 6, r0[0] - r0[2] / 2 + 2, r0[0] + r0[2] / 2 - 2);
          const sz = cz > r0[1] ? r0[1] + r0[3] / 2 : r0[1] - r0[3] / 2;
          const x = lerp(sx, cx, ph);
          const z = lerp(sz, cz, ph);
          const a = Math.sin(ph * Math.PI) * 0.9;
          heat += `<circle class="fp-heat" cx="${f1(x)}" cy="${f1(-z)}" r="2.6" opacity="${a.toFixed(2)}"/>`;
        }
      });
    }
    // a hot spot: steel the water does not reach, glowing, drawn over the part's far corner
    if (hot > 0) {
      const [hx, hz] = C.HOT;
      heat += `<circle class="fp-heat" cx="${f1(hx)}" cy="${f1(-hz)}" r="${f1(C.MM * 2.4 * hot)}" opacity="${f1(0.55 * hot)}"/>`;
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
    const dx = x0 - 0.35 * C.MM;
    const p0 = toHud([dx, 0, 0]);
    const p1 = toHud([dx, 0, s]);
    const tick = (p) => `M${f1(p[0] - 5)} ${f1(p[1])}h10`;
    out.push(`<path class="fp-mark" style="stroke-width:1.6" d="M${f1(p0[0])} ${f1(p0[1])}L${f1(p1[0])} ${f1(p1[1])}${tick(p0)}${tick(p1)}"/>` + text(p0[0] - 10, (p0[1] + p1[1]) / 2 + 7, 's', 22, 'end'));
    if (boss) {
      const [b0, b1] = C.BOSS;
      const z = -s - 0.7 * C.MM;
      const q0 = toHud([b0, 0, z]);
      const q1 = toHud([b1, 0, z]);
      const vt = (p) => `M${f1(p[0])} ${f1(p[1] - 5)}v10`;
      out.push(`<path class="fp-mark" style="stroke-width:1.6" d="M${f1(q0[0])} ${f1(q0[1])}L${f1(q1[0])} ${f1(q1[1])}${vt(q0)}${vt(q1)}"/>` + text(q1[0] + 10, q1[1] + 7, '2s', 22, 'start'));
    }
    return out.join('');
  }

//@endpart
//@part gauges
  // ------------------------------------------------------------ HUD: magnifier and thermometer
  const MAG = [92, 124];
  const MR = 76;
  // a channel under a magnifying glass: water in layers (laminar) or swirling (turbulent); scale: limescale on the wall 0..1
  function magnifier(turbulent, clock, scale = 0) {
    const [mx, my] = MAG;
    const out = [`<clipPath id="fp-magclip"><circle cx="${mx}" cy="${my}" r="${MR}"/></clipPath>`, `<circle class="fp-hud-bg" cx="${mx}" cy="${my}" r="${MR}"/>`, '<g clip-path="url(#fp-magclip)">'];
    const wall = 34;
    out.push(mark(`M${mx - MR} ${my - wall}H${mx + MR}M${mx - MR} ${my + wall}H${mx + MR}`, ' style="stroke-width:1.6"'));
    let hat = '';
    for (let c = -2 * MR; c < 2 * MR; c += 10) hat += `M${mx + c} ${my - MR}l${MR - wall} ${MR - wall}M${mx + c} ${my + wall}l${MR - wall} ${MR - wall}`;
    out.push(`<path class="fp-hatch" d="${hat}"/>`);
    const tk = 14 * scale;
    if (tk > 0.5) out.push(`<path class="fp-scale" d="M${mx - MR} ${my - wall}H${mx + MR}V${f1(my - wall + tk)}H${mx - MR}ZM${mx - MR} ${my + wall}H${mx + MR}V${f1(my + wall - tk)}H${mx - MR}Z"/>`);
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
  function thermometer(level, markAt = TH.mark) {
    const { x, y0, y1, w } = TH;
    const yl = y1 - (y1 - y0) * level;
    const ym = y1 - (y1 - y0) * markAt;
    let ticks = '';
    for (let i = 0; i <= 10; i++) { const y = y1 - ((y1 - y0) * i) / 10; ticks += `M${x + w / 2 + 3} ${y.toFixed(1)}h${i % 5 ? 4 : 8}`; }
    set(E.therm, `<rect class="fp-hud-bg" x="${x - w / 2 - 14}" y="${y0 - 14}" width="${w + 46}" height="${y1 - y0 + 58}" rx="10"/>`
      + `<path class="fp-melt" d="M${x - w / 2 + 3} ${yl.toFixed(1)}H${x + w / 2 - 3}V${y1 + 4}H${x - w / 2 + 3}Z"/><circle class="fp-melt" cx="${x}" cy="${y1 + 14}" r="${w / 2 + 3}"/>`
      + mark(`M${x - w / 2} ${y1 + 4}V${y0 + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y0 + w / 2}V${y1 + 4}`) + `<circle class="fp-mark" cx="${x}" cy="${y1 + 14}" r="${w / 2 + 6}"/>` + mark(ticks));
    set(E.thmark, mark(`M${x - w / 2 - 6} ${ym.toFixed(1)}H${x + w / 2 + 16}`, ' style="stroke-width:2.6"') + `<circle class="fp-ink" cx="${x + w / 2 + 19}" cy="${ym.toFixed(1)}" r="3.4"/>`);
  }

//@endpart
//@part plates
  // ------------------------------------------------------------ the plates
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
    const run = lin(q, 0, 0.55);
    const fill = lin(q, 0.5, 1);
    return runs.map((r) => meltPath(r, lengthOf(r) * run, wpx)).join('') + cavs.map(([x, y]) => pool(x, y, (C.POCKET_R - 1) * Math.sqrt(fill))).join('');
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

//@endpart
//@part coins
  // ------------------------------------------------------------ the coins
  const coinSvg = (x, y, z, h = C.COIN_H) => solidSvg(cylinder(x, y, C.COIN_R, z, h, P, 40, 0.5), { tone: 'mid' }) + lineSvg(ring(x, y, C.COIN_R - 3, z + h, P, 32), { tone: 'lo' });
  let coinKey = '';
  // n: coins in the stacks of material, machine and mould; sliver: the scrap on top of the material, 0..1
  function coinStacks(n, sliver) {
    const key = n.join() + '|' + sliver.toFixed(2);
    if (key === coinKey) return;
    coinKey = key;
    const stack = (s) => { let h = ''; for (let i = 0; i < n[s]; i++) h += coinSvg(C.STACKS[s][0], C.STACKS[s][1], i * C.COIN_H); return h; };
    E.cMat.innerHTML = stack(0);
    // the scrap: 3 % on top of the material, a thin sliver of a coin
    E.cScrap.innerHTML = sliver > 0 ? coinSvg(C.STACKS[0][0], C.STACKS[0][1], n[0] * C.COIN_H, 0.72 * C.COIN_H * sliver) : '';
    E.cMach.innerHTML = stack(1);
    E.cMould.innerHTML = stack(2);
  }
//@endpart
