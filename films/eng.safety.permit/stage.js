// The stage of the film "Een vergunning en een LMRA op het dak / A permit and a
// last-minute risk check on the roof": a pure function of (scene, u). Inlined
// into the page after the anatomy kit (iso-kit functions in scope, the lathe
// module as G) and a preamble from build.mjs that defines P (projection), C
// (world constants), CAM (one camera move per scene), W and H. Moves are placed
// per caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
/* global G, P, C, CAM, W, H, iso, solidSvg, lineSvg, slabOf, cylinder, haloOf, segment, wireSvg, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const at = (p) => iso(p, P);
  const S = (paths, style = {}) => solidSvg(paths, { tone: 'mid', ...style });
  const SP = C.SPOT;
  // ------------------------------------------------------------ people, drawn once at load
  // A simple standing figure facing the viewer: shoes, legs, a jacket with its
  // zip, arms, a neck, a head and a helmet with its brim. The welder wears a
  // face shield; the fire watch carries nothing (the extinguisher stands by him).
  const HOME = { welder: SP.welder, fire: SP.fire, holder: SP.holderAt, issuer: SP.issuerAt, mech1: SP.m1, mech2: SP.m2 };
  {
    const box = (plan, z0, z1, style = {}, bevel = 0.3, steps = 1) => S(slabOf({ r: 0.4, ...plan }, z0, z1 - z0, P, steps, bevel), style);
    const post = (cx, cy, r, z0, z1, style = {}, steps = 16, bevel = 0) => S(cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
    const person = ([cx, cy], jacket, helmet, extra = '') => {
      let out = `<path class="iso-halo" d="${haloOf({ x: cx - 11, y: cy - 7, w: 22, d: 14, r: 6 }, 0, 2, P)}"/>`;
      for (const dx of [-5, 5]) {
        out += box({ x: cx + dx - 3.6, y: cy - 3.4, w: 7.2, d: 10, r: 1.6 }, 0, 4, { tone: 'lo' }, 0.4, 2);
        out += box({ x: cx + dx - 3.4, y: cy - 3.4, w: 6.8, d: 6.8, r: 2 }, 4, 82, { tone: 'lo' }, 0.4, 2);
      }
      out += box({ x: cx - 15, y: cy - 4, w: 4.6, d: 7, r: 2 }, 92, 138, { tone: jacket }, 0.3, 2);
      out += box({ x: cx - 11, y: cy - 6, w: 22, d: 12, r: 3.6 }, 80, 144, { tone: jacket, inner: lineSvg(segment([cx, cy + 6, 84], [cx, cy + 6, 140], P), { tone: 'lo' }) + lineSvg(segment([cx - 11, cy + 4, 118], [cx + 11, cy + 4, 118], P), { tone: 'faint' }) }, 0.6, 3);
      out += box({ x: cx + 10.4, y: cy - 4, w: 4.6, d: 7, r: 2 }, 92, 138, { tone: jacket }, 0.3, 2);
      out += post(cx, cy, 3.2, 144, 149, { tone: 'lo' }, 12);
      out += S(G.sphereOf([cx, cy, 156], 7.4, P, { steps: 28 }), { tone: 'mid' });
      out += post(cx, cy, 9, 158.6, 159.8, { tone: helmet, crease: 'lo' }, 20);
      out += S(cylinder(cx, cy, 7.6, 159.8, 4.4, P, 20, 3), { tone: helmet, crease: 'lo' });
      return out + extra;
    };
    const [wx, wy] = SP.welder;
    // the face shield and the torch held up to the weld spot
    const shield = box({ x: wx - 8, y: wy + 6, w: 16, d: 2.4, r: 0.6 }, 148, 166, { tone: 'lo', crease: 'mid' }, 0.3);
    const torch = lineSvg(segment([wx + 12, wy - 2, 120], [C.WELD[0] + 1, C.WELD[1] + 2, C.WELD[2] - 1], P), { tone: 'mid' });
    const set = (k, html) => { svg.querySelector(`[data-k="${k}"]`).innerHTML = html; };
    set('welderBody', person(SP.welder, 'lo', 'lo', shield + torch));
    set('fireBody', person(SP.fire, 'mid', 'hi'));
    set('holderBody', person(SP.holderAt, 'mid', 'hi'));
    set('issuerBody', person(SP.issuerAt, 'hi', 'hi'));
    set('mech1Body', person(SP.m1, 'mid', 'mid'));
    set('mech2Body', person(SP.m2, 'mid', 'mid'));
    // the welding cable from the set over the roof to the welder
    set('cable', wireSvg(at([C.SET[0] - 14, C.SET[1], 24]), at([wx + 12, wy, 100]), { via: [[C.SET[0] - 24, C.SET[1] - 4, 1], [wx + 30, wy + 16, 1], [wx + 16, wy + 4, 60]].map(at), tone: 'lo', size: 1.1, ends: 'both' }));
  }
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const LED = {};
  svg.querySelectorAll('[data-led]').forEach((el) => { LED[el.getAttribute('data-led')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'pm-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'pm-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const EXAMPLE = tr('voorbeeld', 'example');
  const T8 = tr('8.00–16.00', '08:00–16:00');

  // the beat on screen and its progress, from the caption beats of the scene
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
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ sparks
  // Sparks leave the weld spot, fly out and fall in a parabola to the roof;
  // each lives about 0.9 s and starts on its own phase of the film clock.
  function sparksSvg(t) {
    const [x0, y0, z0] = C.WELD;
    let out = '';
    for (let i = 0; i < 18; i++) {
      const ph = ((t * 1.1 + i * 0.137) % 1 + 1) % 1;
      const a = i * 2.39996;
      const vx = 26 * Math.cos(a);
      const vy = 18 + 16 * Math.abs(Math.sin(a * 1.7));
      const vz = 20 + 30 * Math.abs(Math.cos(a * 0.7));
      const pos = (q) => { const tt = q * 0.9; return [x0 + vx * tt, y0 + vy * tt, Math.max(0.5, z0 + vz * tt - 130 * tt * tt)]; };
      const p1 = at(pos(ph));
      const p0 = at(pos(Math.max(0, ph - 0.06)));
      out += `<path class="pm-spark" d="M${f2(p0[0])} ${f2(p0[1])}L${f2(p1[0])} ${f2(p1[1])}"/>`;
    }
    const c = at(C.WELD);
    const r = (0.9 + 0.5 * Math.abs(Math.sin(t * 23))) * G.scaleOf(P);
    return out + `<circle class="pm-arc" cx="${f2(c[0])}" cy="${f2(c[1])}" r="${f2(r)}"/>`;
  }

  // ------------------------------------------------------------ HUD cards
  // a check (drawn, not a glyph) at x, y; on or off
  const check = (x, y, on) => `<path class="${on ? 'pm-accl' : 'pm-dim'}" d="M${x} ${y + 8}L${x + 7} ${y + 15}L${x + 20} ${y}"/>`;
  // a list card: a title, a subtitle, rows ticked one by one, one row marked
  function listSvg({ x = 12, y = 12, w = 330, title, sub, rows, ticked = 0, mark = -1, row = 38, checks = true }) {
    const h = 64 + (sub ? 26 : 0) + rows.length * row;
    let out = rect(x, y, w, h);
    out += txt(x + 16, y + 34, title, 23, 'start', 'pm-big');
    let top = y + 50;
    if (sub) { out += txt(x + 16, y + 64, sub, 22, 'start', 'pm-mute'); top += 26; }
    rows.forEach((t, i) => {
      const yy = top + i * row;
      if (mark === i || (Array.isArray(mark) && mark.includes(i))) out += rect(x + 6, yy - 2, w - 12, row - 2, 'pm-row', 6);
      const on = i < ticked;
      if (checks) out += check(x + 18, yy + 8, on);
      out += txt(x + (checks ? 50 : 18), yy + 26, t, 22, 'start', on || !checks ? 'pm-txt' : 'pm-mute');
    });
    return out;
  }
  // the permit board in the control room
  function boardSvg(mark) {
    const rows = NL ? [`heet werk · bordes · ${T8}`, 'besloten ruimte · tank', 'werk op hoogte · gevel'] : [`hot work · platform · ${T8}`, 'confined space · tank', 'work at height · wall'];
    return listSvg({ x: 12, y: 186, w: 380, title: tr('open vergunningen', 'open permits'), sub: `${tr('controlekamer', 'control room')} · ${EXAMPLE}`, rows, checks: false, mark });
  }
  // the hot-work permit: its fields, then the two signatures
  function docSvg(ticked, signed) {
    const rows = NL ? ['klus en plek', 'gevaren', 'scheidingen (LOTO)', 'metingen', 'PBM', `geldig ${T8}`] : ['job and place', 'hazards', 'isolations (LOTO)', 'tests', 'PPE', `valid ${T8}`];
    let out = listSvg({ x: 12, y: 12, w: 300, title: tr('werkvergunning', 'permit to work'), sub: `${tr('heet werk', 'hot work')} · ${EXAMPLE}`, rows, ticked, row: 34 });
    const y = 12 + 90 + rows.length * 34;
    out += rect(12, y, 300, 66);
    out += txt(28, y + 26, tr('afgever', 'issuer'), 22, 'start', 'pm-mute') + txt(170, y + 26, tr('houder', 'holder'), 22, 'start', 'pm-mute');
    const sig = (x0, n) => `<path class="pm-sig" d="M${x0} ${y + 52}${[0, 1, 2, 3, 4].slice(0, n).map((i) => `l10 ${i % 2 ? 8 : -10}`).join('')}"/>`;
    if (signed > 0) out += sig(30, Math.ceil(clamp(signed, 0, 1) * 5));
    if (signed > 1) out += sig(172, Math.ceil(clamp(signed - 1, 0, 1) * 5));
    return out;
  }
  function orderSvg() {
    const rows = NL ? ['motor dakventilator vervangen', 'toegang: vaste ladder', 'ventilator vergrendeld'] : ['replace roof fan motor', 'access: fixed ladder', 'fan locked out'];
    return listSvg({ x: 12, y: 12, w: 364, title: tr('werkorder', 'work order'), sub: `${tr('onderhoud', 'maintenance')} · ${EXAMPLE}`, rows, checks: false });
  }
  function lmraSvg(ticked, mark) {
    const rows = NL ? ['wat moet ik doen, en hoe?', 'wat kan hier misgaan?', 'maatregelen genomen?', 'gereedschap en PBM?', 'last van anderen?'] : ['what to do, and how?', 'what can go wrong here?', 'measures in place?', 'tools and PPE?', 'others affected?'];
    let out = listSvg({ x: 12, y: 12, w: 384, title: 'LMRA', rows, ticked, mark, row: 38 });
    if (Array.isArray(mark)) mark.forEach((i) => { out += txt(382, 12 + 50 + i * 38 + 26, tr('nee', 'no'), 22, 'end', 'pm-on'); });
    return out;
  }
  function vcaSvg() {
    let out = rect(12, 262, 298, 120);
    out += rect(28, 278, 64, 84, 'pm-row', 6);
    out += `<circle class="pm-dim" cx="60" cy="308" r="14"/>` + `<path class="pm-dim" d="M38 356Q60 326 82 356"/>`;
    out += txt(108, 304, 'VCA', 24, 'start', 'pm-big') + txt(108, 332, tr('aannemer', 'contractor'), 22, 'start', 'pm-txt') + txt(108, 358, EXAMPLE, 22, 'start', 'pm-mute');
    return out;
  }
  function stopSvg(ticked) {
    const rows = NL ? ['ernstig, direct gevaar', 'werk stilleggen', 'loon blijft', 'leidinggevende inlichten', 'melden bij de inspectie'] : ['serious, immediate danger', 'stop the work', 'pay continues', 'tell your supervisor', 'report to the authority'];
    return listSvg({ x: 12, y: 132, w: 340, title: tr('werkonderbreking', 'stop-work right'), sub: tr('Arbowet artikel 29', 'Arbowet article 29'), rows, ticked, row: 34 });
  }
  function planSvg() {
    let out = rect(12, 230, 616, 150);
    out += txt(28, 266, tr('werkvergunning', 'permit to work'), 22, 'start', 'pm-big') + txt(28, 298, tr('het plan, op kantoor', 'the plan, in the office'), 22, 'start', 'pm-txt') + txt(28, 326, tr('afgever en houder tekenen', 'issuer and holder sign'), 22, 'start', 'pm-mute');
    out += `<path class="pm-rule" d="M320 246L320 364"/>`;
    out += txt(338, 266, 'LMRA', 22, 'start', 'pm-big') + txt(338, 298, tr('de check, ter plaatse', 'the check, on the spot'), 22, 'start', 'pm-txt') + txt(338, 326, tr('door wie het werk doet', 'by who does the work'), 22, 'start', 'pm-mute');
    return out;
  }
  function closeSvg(ticked, mark) {
    const rows = NL ? ['14.30 lassen klaar', 'brandwacht blijft', 'persoonlijk terug', 'afgever loopt na', 'afsluiten, scheidingen eraf', 'dienstwissel: overdragen'] : ['14:30 welding done', 'fire watch stays', 'handed back in person', 'issuer walks the area', 'close, isolations off', 'shift change: hand over'];
    return listSvg({ x: 12, y: 12, w: 360, title: tr('afsluiten', 'closing'), rows, ticked, mark, row: 36 });
  }
  function piperSvg(n) {
    const rows = NL ? ['klep eraf, losse blindflens', 'dienstwissel: niet doorgegeven', 'pomp gestart'] : ['valve off, loose blind flange', 'shift change: not passed on', 'pump started'];
    let out = rect(236, 120, 392, 268);
    out += txt(252, 154, 'Piper Alpha · 1988', 22, 'start', 'pm-big');
    rows.forEach((t, i) => { if (i < n) out += txt(252, 194 + i * 36, `${i + 1}  ${t}`, 22, 'start', 'pm-txt'); });
    if (n > 3) out += txt(252, 352, '167', 40, 'start', 'pm-big') + txt(336, 352, tr('doden', 'dead'), 22, 'start', 'pm-txt');
    return out;
  }

  // ------------------------------------------------------------ people
  // walk from a to b along the front of the roof (y 100), so nobody cuts through the tank
  function walk(a, b, t) {
    if (t <= 0) return a;
    if (t >= 1) return b;
    const legs = [a, [a[0], 100], [b[0], 100], b];
    const lens = legs.slice(1).map((p, i) => Math.hypot(p[0] - legs[i][0], p[1] - legs[i][1]));
    const total = lens.reduce((x, y) => x + y, 0) || 1;
    let left = t * total;
    for (let i = 0; i < lens.length; i++) {
      if (left <= lens[i] || i === lens.length - 1) { const q = lens[i] ? clamp(left / lens[i], 0, 1) : 1; return [lerp(legs[i][0], legs[i + 1][0], q), lerp(legs[i][1], legs[i + 1][1], q)]; }
      left -= lens[i];
    }
    return b;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['board', 'doc', 'order', 'lmra', 'vca', 'stop', 'plan', 'close', 'piper'];
  const WHO = ['welder', 'fire', 'holder', 'issuer', 'mech1', 'mech2'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    // where each person is (or null: away), and the state of the roof
    const pos = { welder: SP.welder, fire: null, holder: null, issuer: null, mech1: null, mech2: null };
    const walking = {};
    const st = { sparks: false, blanket: 0, ext: false, hpu: false, lid: 0, fanOn: true };
    const go = (who, a, bb, t) => { pos[who] = walk(a, bb, t); if (t > 0 && t < 1) walking[who] = true; };

    if (si === 0) {
      st.hpu = true;
      vis.board = b >= 1 ? span(p, 0, 0.12) + (b > 1 ? 1 : 0) : 0;
      if (vis.board > 0.01) set(E.board, boardSvg(b === 2 ? 0 : b === 3 ? 1 : -1));
    } else if (si === 1) {
      st.hpu = b < 3 || p < 0.3;
      vis.doc = b <= 1 ? span(u, 0, 0.04) : b === 4 ? span(p, 0, 0.1) : 1 - span(p, 0, 0.12) * (b === 2 ? 1 : 0) - (b === 3 ? 1 : 0);
      if (b >= 2) {
        go('issuer', SP.start1, SP.issuerAt, b === 2 ? span(p, 0.05, 0.9) : 1);
        go('holder', SP.start2, SP.holderAt, b === 2 ? span(p, 0.1, 0.95) : 1);
      }
      st.blanket = b === 3 ? span(p, 0.25, 0.55) : b > 3 ? 1 : 0;
      st.ext = b > 3 || (b === 3 && p > 0.6);
      if (vis.doc > 0.01) set(E.doc, docSvg(b === 0 ? 1 + Math.floor(span(p, 0.15, 0.9) * 2.99) : b === 1 ? 4 + Math.floor(span(p, 0.1, 0.8) * 2.99) : 6, b === 4 ? 2 * span(p, 0.15, 0.85) : 0));
    } else if (si === 2) {
      st.blanket = 1; st.ext = true;
      st.sparks = true;
      pos.fire = SP.fire;
      pos.holder = SP.holderAt;
    } else if (si === 3) {
      st.blanket = 1; st.ext = true; st.sparks = true;
      pos.fire = SP.fire; pos.holder = SP.holderAt;
      pos.mech1 = SP.m1; pos.mech2 = SP.m2;
      vis.order = b === 1 ? span(p, 0, 0.12) : 0;
      if (vis.order > 0.01) set(E.order, orderSvg());
      vis.lmra = b === 3 ? span(p, 0, 0.1) : 0;
      if (vis.lmra > 0.01) set(E.lmra, lmraSvg(Math.floor(span(p, 0.1, 0.9) * 5.99), -1));
      vis.vca = b === 4 ? span(p, 0, 0.12) : 0;
      if (vis.vca > 0.01) set(E.vca, vcaSvg());
    } else if (si === 4) {
      st.blanket = 1; st.ext = true; st.sparks = true;
      pos.fire = SP.fire; pos.holder = SP.holderAt;
      pos.mech1 = SP.m1; pos.mech2 = SP.m2;
      if (b === 3) { go('mech1', SP.m1, SP.fan1, span(p, 0.6, 1)); go('mech2', SP.m2, SP.fan2, span(p, 0.62, 1)); }
      if (b > 3) { pos.mech1 = SP.fan1; pos.mech2 = SP.fan2; }
      vis.lmra = b === 1 ? span(p, 0, 0.1) : b === 2 ? 1 - span(p, 0, 0.12) : 0;
      if (vis.lmra > 0.01) set(E.lmra, lmraSvg(1, [2, 4]));
      st.lid = b === 4 ? span(p, 0.15, 0.45) : 0;
      st.fanOn = b < 3;
    } else if (si === 5) {
      st.blanket = 1; st.ext = true; st.sparks = true; st.fanOn = false;
      pos.fire = SP.fire; pos.holder = SP.holderAt;
      pos.mech1 = SP.fan1; pos.mech2 = SP.fan2;
      vis.stop = b <= 1 ? span(u, 0, 0.04) : b === 2 ? 1 - span(p, 0, 0.12) : 0;
      if (vis.stop > 0.01) set(E.stop, stopSvg(b === 0 ? 1 + Math.floor(span(p, 0.3, 0.9) * 1.99) : 2 + Math.floor(span(p, 0.1, 0.8) * 3.99)));
      vis.plan = b === 3 ? span(p, 0, 0.12) : 0;
      if (vis.plan > 0.01) set(E.plan, planSvg());
    } else if (si === 6) {
      st.ext = true; st.fanOn = false;
      st.sparks = b === 0 && p < 0.25;
      st.blanket = b < 2 ? 1 : b === 2 ? 1 - span(p, 0.3, 0.6) : 0;
      st.hpu = b > 2 || (b === 2 && p > 0.7);
      pos.fire = SP.fire;
      pos.holder = SP.holderAt;
      pos.mech1 = SP.fan1; pos.mech2 = SP.fan2;
      if (b === 1) go('issuer', SP.start1, SP.issuerAt, span(p, 0.05, 0.6));
      if (b >= 2) pos.issuer = SP.issuerAt;
      vis.close = b <= 3 ? (b === 0 ? span(p, 0.1, 0.2) : 1) : 1 - span(p, 0, 0.1);
      if (vis.close > 0.01) set(E.close, closeSvg(b === 0 ? (p > 0.3 ? 2 : 1) : b === 1 ? 2 + (p > 0.3 ? 1 : 0) + (p > 0.7 ? 1 : 0) : b === 2 ? 4 + (p > 0.5 ? 1 : 0) : 6, b === 0 ? 1 : b === 3 ? 5 : -1));
      vis.piper = b === 4 ? span(p, 0, 0.08) : 0;
      if (vis.piper > 0.01) set(E.piper, piperSvg(1 + Math.floor(span(p, 0.1, 0.8) * 3.99)));
    }

    // ---- the drawing
    show(E.sparks, st.sparks);
    if (st.sparks) set(E.sparks, sparksSvg(clockS));
    flag(LED.set, 'data-on', st.sparks);
    show(E.blanket, st.blanket > 0.01);
    fade(E.blanket, st.blanket);
    show(E.ext, st.ext);
    flag(LED.hpu, 'data-on', st.hpu);
    flag(LED.fan, 'data-on', st.fanOn);
    // the manhole lid is lifted and set down beside the collar
    move(E.lid, [14 * st.lid, 10 * st.lid, 6 * Math.sin(Math.PI * st.lid)]);
    for (const who of WHO) {
      const q = pos[who];
      show(E[who], !!q);
      if (!q) continue;
      const bob = walking[who] ? 0.8 * Math.abs(Math.sin(clockS * 6 + who.length)) : 0;
      move(E[who], [q[0] - HOME[who][0], q[1] - HOME[who][1], bob]);
    }
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
