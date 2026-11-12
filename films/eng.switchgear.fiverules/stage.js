// The stage of the film "De vijf veiligheidsregels / The five safety rules": a
// pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants and the model's data), CAM (one camera move
// per scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step. The
// people and the cards' fixed parts are drawn once at load.
/* global P, C, CAM, W, H, iso, solidSvg, lineSvg, slabOf, cylinder, haloOf, segment, span, beatStarts */
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
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const setD = (e, d) => { if (e.__d !== d) { e.setAttribute('d', d); e.__d = d; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const grp = (v) => { const s = String(Math.round(v)); return s.length >= 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NL ? '.' : ',') : s; };
  const txt = (x, y, t, size = 20, anchor = 'start', cls = 'mf-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mf-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mf-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mf-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const tick = (x, y, cls = 'mf-accl') => `<path class="${cls}" d="M${f1(x - 9)} ${f1(y - 6)}l7 8l14 -16"/>`;
  const cross = (x, y, cls = 'mf-accl') => `<path class="${cls}" d="M${f1(x - 8)} ${f1(y - 14)}l16 16M${f1(x + 8)} ${f1(y - 14)}l-16 16"/>`;
  const EX = tr('voorbeeld', 'example');
  const SCH = tr('schema', 'diagram');
  const PANEL = () => rect(204, 12, 428, 376);
  const MARKS = [E['mk-rmu']].filter(Boolean);
  const on = (b, i, p, a = 0.05, z = 0.3) => (b > i ? 1 : b === i ? span(p, a, z) : 0);

  // ------------------------------------------------------------ the people and the barrier, drawn once
  // A simple standing figure facing the viewer, as in the LOTO and permit
  // films: shoes, legs, a jacket with its zip, arms, a neck, a head and a
  // helmet with its brim (the head a rounded cylinder here, so the page needs
  // no lathe module).
  {
    const S = (paths, style = {}) => solidSvg(paths, { tone: 'mid', ...style });
    const box = (plan, z0, z1, style = {}, bevel = 0.3, steps = 1) => S(slabOf({ r: 0.4, ...plan }, z0, z1 - z0, P, steps, bevel), style);
    const post = (cx, cy, r, z0, z1, style = {}, steps = 16, bevel = 0) => S(cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
    const person = ([cx, cy], jacket, helmet) => {
      let out = `<path class="iso-halo" d="${haloOf({ x: cx - 11, y: cy - 7, w: 22, d: 14, r: 6 }, 0, 2, P)}"/>`;
      for (const dx of [-5, 5]) {
        out += box({ x: cx + dx - 3.6, y: cy - 3.4, w: 7.2, d: 10, r: 1.6 }, 0, 4, { tone: 'lo' }, 0.4, 2);
        out += box({ x: cx + dx - 3.4, y: cy - 3.4, w: 6.8, d: 6.8, r: 2 }, 4, 82, { tone: 'lo' }, 0.4, 2);
      }
      out += box({ x: cx - 15, y: cy - 4, w: 4.6, d: 7, r: 2 }, 92, 138, { tone: jacket }, 0.3, 2);
      out += box({ x: cx - 11, y: cy - 6, w: 22, d: 12, r: 3.6 }, 80, 144, { tone: jacket, inner: lineSvg(segment([cx, cy + 6, 84], [cx, cy + 6, 140], P), { tone: 'lo' }) }, 0.6, 3);
      out += box({ x: cx + 10.4, y: cy - 4, w: 4.6, d: 7, r: 2 }, 92, 138, { tone: jacket }, 0.3, 2);
      out += post(cx, cy, 3.2, 144, 149, { tone: 'lo' }, 12);
      out += post(cx, cy, 6.4, 147.6, 159, { tone: 'mid' }, 20, 4.2);
      out += post(cx, cy, 9.2, 156.4, 157.4, { tone: helmet, crease: 'lo' }, 20);
      out += S(cylinder(cx, cy, 7.4, 157.4, 6.2, P, 20, 4.6), { tone: helmet, crease: 'lo' });
      return out;
    };
    set(E.techBody, person(C.TECH, 'mid', 'hi'));
    set(E.layBody, person(C.LAY, 'lo', 'hi'));
    // the barrier: two posts on round feet with a tape between their tops
    const B0 = C.BAR;
    const pole = (y) => post(B0.x, y, 4, 0, 1.6, { tone: 'lo' }, 16, 0.4) + post(B0.x, y, 1.4, 1.6, B0.z + 4, { tone: 'mid' }, 12);
    // the back post behind the consultant, the front post and the tape in front of her
    set(E.barBack, pole(B0.y0));
    let bar = pole(B0.y1);
    const [a0, a1] = [iso([B0.x, B0.y0, B0.z], P), iso([B0.x, B0.y1, B0.z], P)];
    bar += `<path class="mf-tape" d="M${f1(a0[0])} ${f1(a0[1])}L${f1(a1[0])} ${f1(a1[1])}"/>`;
    set(E.barBody, bar);
  }

  // the beat on screen and its progress, from the caption beats of the scene
  const fracs = (si) => { const sc = D.scenes[si]; return beatStarts(sc, 'nl').map((x) => x / sc.dur); };
  function beatOf(si, u) {
    const fr = fracs(si);
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
    for (const m of MARKS) m.setAttribute('r', f1(18 / s));
  }

  // ------------------------------------------------------------ the mimic on the RMU: switch and earthing blades
  const M = C.MIMIC;
  function blades(sw, ea) {
    C.blades.forEach(({ cx, ex }, i) => {
      const a = lerp(0.62, 0, sw[i]);
      const L1 = M.top - M.piv;
      setD(E[`sw${i}`], `M${f1(cx)} ${f1(-M.piv)}L${f1(cx - L1 * Math.sin(a))} ${f1(-(M.piv + L1 * Math.cos(a)))}`);
      const b = lerp(0.62, 0, ea[i]);
      const L2 = M.tee - (M.ep - 3);
      setD(E[`ea${i}`], `M${f1(ex)} ${f1(-(M.ep - 3))}L${f1(ex - L2 * Math.sin(b))} ${f1(-(M.ep - 3 + L2 * Math.cos(b)))}`);
    });
  }

  // ------------------------------------------------------------ s1: the five rules
  const RU = C.RULES[NL ? 'nl' : 'en'];
  // the long rules on two lines, split where the card needs it
  const WRAP = NL ? { 4: ['naastgelegen delen onder', 'spanning afschermen'] } : { 4: ['protect against adjacent', 'live parts'] };
  set(E.ruBase, PANEL() + txt(222, 46, tr('de vijf veiligheidsregels', 'the five safety rules'), 22, 'start', 'mf-txt') + txt(612, 378, 'NEN-EN 50110', 20, 'end', 'mf-mute'));
  function ruIn(a) {
    return RU.map((r, i) => {
      const y = 92 + i * 60;
      const body = `<circle class="mf-iron" cx="240" cy="${y}" r="17"/>` + txt(240, y + 7, i + 1, 20, 'middle', 'mf-big')
        + (WRAP[i] ? txt(270, y - 4, WRAP[i][0]) + txt(270, y + 21, WRAP[i][1]) : txt(270, y + 7, r));
      return op(a[i], body);
    }).join('');
  }

  // ------------------------------------------------------------ s2: the standards (a schema) and the roles
  set(E.nmBase, PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute') + txt(222, 46, tr('laagspanning', 'low voltage'), 20, 'start', 'mf-mute') + txt(426, 46, tr('daarboven', 'above that'), 20, 'start', 'mf-mute')
    + rect(426, 62, 186, 56, 'mf-tile', 6) + txt(519, 98, 'NEN 3840', 22, 'middle', 'mf-big')
    + txt(426, 148, tr('MS en HS', 'MV and HV'), 20, 'start', 'mf-txt'));
  set(E.nmL, rect(222, 62, 196, 56, 'mf-tile', 6) + txt(320, 98, 'NEN 3140', 22, 'middle', 'mf-big')
    + txt(222, 148, tr(`tot ${grp(1000)} V wissel`, `up to ${grp(1000)} V AC`), 20, 'start', 'mf-txt') + txt(222, 176, tr(`of ${grp(1500)} V gelijk`, `or ${grp(1500)} V DC`), 20, 'start', 'mf-txt'));
  function nmIn(here, base) {
    return op(here, txt(426, 176, tr('hier: MS-kabel', 'here: MV cable'), 20, 'start', 'mf-on'))
      + op(base, rect(222, 204, 390, 50, 'mf-tile', 6) + txt(417, 236, 'NEN-EN 50110', 22, 'middle', 'mf-big')
        + txt(222, 300, tr('wet: Arbobesluit', 'law: Working Conditions Decree'), 20, 'start', 'mf-txt') + txt(222, 340, tr('netbeheerders: + BEI', 'grid operators: + BEI'), 20, 'start', 'mf-txt'));
  }
  const ROLES = [['IV', tr('geeft toestemming', 'gives permission')], ['WV', tr('leidt de klus', 'leads the job')], ['VP', tr('beoordeelt risico’s', 'judges the risks')], ['VOP', tr('afgebakende taken', 'defined tasks')], [tr('leek', 'layperson'), tr('komt nergens aan', 'touches nothing')]];
  set(E.rlBase, PANEL() + txt(620, 40, EX, 20, 'end', 'mf-mute'));
  function role(i, a, lab) {
    const y = 40 + i * 66;
    return op(a, rect(222, y, 124, 46, 'mf-tile', 23) + txt(284, y + 30, ROLES[i][0], 20, 'middle', 'mf-big') + op(lab, txt(358, y + 30, ROLES[i][1], 20, 'start', 'mf-txt')));
  }
  function rlAp(a) {
    if (a <= 0.01) return '';
    let s = rect(352, 52, 260, 300, 'mf-iron', 4) + txt(368, 88, tr('aanwijzing', 'written appointment'), 20, 'start', 'mf-big');
    const rows = NL ? ['rol: VP', 'werk: schakelen', 'installatie: MS-net'] : ['role: VP', 'work: switching', 'installation: MV grid'];
    rows.forEach((r, i) => { s += op(span(a, 0.2 + i * 0.15, 0.4 + i * 0.15), txt(368, 136 + i * 40, r)); });
    s += op(span(a, 0.7, 0.9), line(368, 300, 520, 300, 'mf-axis') + txt(368, 330, tr('werkgever', 'employer'), 20, 'start', 'mf-mute') + tick(560, 300));
    return op(a, s);
  }

  // ------------------------------------------------------------ s3: a switching plan (an example)
  const PL_ROWS = NL
    ? [['1', '8 · veld 1', 'open'], ['2', '9 · veld 1', 'open'], ['3', '8 en 9', 'slot, label'], ['4', '8 en 9', 'meten'], ['5', '8 en 9', 'aarden'], ['6', '8 en 9', 'afschermen']]
    : [['1', '8 · panel 1', 'open'], ['2', '9 · panel 1', 'open'], ['3', '8 and 9', 'lock, tag'], ['4', '8 and 9', 'test'], ['5', '8 and 9', 'earth'], ['6', '8 and 9', 'screen']];
  set(E.plBase, PANEL() + txt(222, 46, tr('schakelplan', 'switching plan'), 22, 'start', 'mf-txt') + txt(620, 40, EX, 20, 'end', 'mf-mute')
    + [[tr('stap', 'step'), 222], ['station', 284], [tr('handeling', 'action'), 418], [tr('door', 'by'), 548]].map(([t, x]) => txt(x, 84, t, 20, 'start', 'mf-mute')).join('') + line(222, 94, 612, 94, 'mf-grid'));
  function plIn(rowsA, lit) {
    return PL_ROWS.map(([n, st, act], i) => {
      const y = 124 + i * 34;
      const hot = lit === i;
      return op(rowsA[i], (hot ? rect(214, y - 24, 404, 32, 'mf-accf', 5) : '') + txt(236, y, n, 20, 'middle', 'mf-mono') + txt(284, y, st, 20, 'start', hot ? 'mf-on' : 'mf-txt') + txt(418, y, act, 20, 'start', hot ? 'mf-on' : 'mf-txt') + txt(548, y, 'Jan', 20, 'start', 'mf-txt'));
    }).join('');
  }
  function plTxt(warn, stamps) {
    return op(warn * (1 - stamps), txt(222, 344, tr('scheider: alleen stroomloos', 'disconnector: no current only'), 20, 'start', 'mf-on'))
      + op(stamps, txt(222, 334, tr('geschreven ✓  gecontroleerd ✓', 'written ✓  checked ✓  released ✓'), 20, 'start', 'mf-on') + txt(222, 366, tr('vrijgegeven ✓  klanten: bericht', 'customers: told in advance'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ s4, s6, s7: the two stations and the cable (a schema)
  const S8 = { x: 222, bus: 244, piv: 266, fix: 302, ex: 320 };
  const S9 = { x: 492, bus: 590, piv: 568, fix: 532, ex: 514 };
  const CY = 150;
  const EY = 214;
  set(E.rgBase, PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute')
    + [[S8, 'station 8'], [S9, 'station 9']].map(([s, t]) => rect(s.x, 64, 120, 210, 'mf-tile', 6) + txt(s === S8 ? s.x + 70 : s.x + 50, 262, t, 20, 'middle', 'mf-txt')
      + line(s.bus, 80, s.bus, 236, 'mf-line') + line(s.bus, CY, s.piv, CY, 'mf-line') + dot(s.piv, CY, 4) + dot(s.fix, CY, 4)
      + line(s.fix, CY, s === S8 ? 342 : 492, CY, 'mf-line') + line(s.ex, CY, s.ex, CY + 26, 'mf-line') + dot(s.ex, EY - 30, 3.5)
      + line(s.ex, EY, s.ex, EY + 12, 'mf-line') + line(s.ex - 12, EY + 12, s.ex + 12, EY + 12, 'mf-line') + line(s.ex - 7, EY + 18, s.ex + 7, EY + 18, 'mf-line') + line(s.ex - 3, EY + 24, s.ex + 3, EY + 24, 'mf-line')).join('')
    + line(342, CY, 492, CY, 'mf-line') + txt(417, CY + 28, tr('MS-kabel', 'MV cable'), 20, 'middle', 'mf-mute'));
  // the switch blades (open 0..1) and the earthing blades (closed 0..1)
  function rgIn(head, open, earthed, dead, live = 0) {
    let s = op(head ? 1 : 0, txt(222, 46, head, 22, 'start', 'mf-on'));
    for (const st of [S8, S9]) {
      const dir = st === S8 ? 1 : -1;
      const len = Math.abs(st.fix - st.piv);
      const a = open * 0.6;
      s += `<path class="mf-line" style="stroke-width:3.4" d="M${st.piv} ${CY}L${f1(st.piv + dir * len * Math.cos(a))} ${f1(CY - len * Math.sin(a))}"/>`;
      // earthing blade from the earth contact up toward the cable tee
      const b = (1 - earthed) * 0.6;
      s += `<path class="mf-line" style="stroke-width:3.4" d="M${st.ex} ${EY}L${f1(st.ex - dir * 30 * Math.sin(b))} ${f1(EY - 30 * Math.cos(b))}"/>`;
    }
    if (dead > 0.01) s += op(dead, txt(417, CY + 62, tr('spanningsloos', 'dead'), 20, 'middle', 'mf-on'));
    if (live > 0.01) s += op(live, txt(417, CY + 62, tr('nog onder spanning', 'still live'), 20, 'middle', 'mf-on'));
    return s;
  }
  function rgFeed(a) {
    if (a <= 0.01) return '';
    const arrow = (x) => line(x, 372, x, 280, 'mf-accl') + `<path class="mf-accl" d="M${x - 7} 290L${x} 278L${x + 7} 290"/>`;
    return op(a, arrow(600) + txt(588, 324, tr('aggregaat', 'generator'), 20, 'end', 'mf-on') + txt(588, 348, tr('zonnepanelen', 'solar panels'), 20, 'end', 'mf-on') + txt(588, 372, tr('andere ring', 'another ring'), 20, 'end', 'mf-on')
      + op(span(a, 0.4, 1), arrow(234) + txt(246, 348, tr('onderstation', 'substation'), 20, 'start', 'mf-on')));
  }
  function padlock(x, y) {
    return rect(x - 8, y - 4, 16, 14, 'mf-iron', 2) + `<path class="mf-axis" d="M${x - 5} ${y - 4}V${y - 9}A5 5 0 0 1 ${x + 5} ${y - 9}V${y - 4}"/>` + rect(x + 10, y - 2, 12, 16, 'mf-tile', 2);
  }
  const rgLock = (a) => op(a, padlock(S8.piv + 16, 106) + padlock(S9.piv - 26, 106));
  const rgEarth = (a) => op(a, [S8, S9].map((s) => dot(s.ex, EY - 30, 6, 'mf-acc')).join(''));
  const rgShield = (a, lab = 1) => op(a, [S8, S9].map((s) => rect(s.bus - 12, 76, 24, 168, 'mf-accf', 4)).join('') + op(lab, txt(417, 250, tr('scherm', 'screen'), 20, 'middle', 'mf-on')));
  function rgFlash(a, clockS) {
    if (a <= 0.01) return '';
    let s = '';
    const cx = S8.ex;
    const cy = EY - 18;
    for (let i = 0; i < 10; i++) { const t = (i / 10) * 2 * Math.PI + clockS; const r = 24 + 8 * Math.sin(clockS * 9 + i); s += line(cx + 9 * Math.cos(t), cy + 9 * Math.sin(t), cx + r * Math.cos(t), cy + r * Math.sin(t), 'mf-accl'); }
    return op(a, s + txt(417, 250, tr('vlamboog', 'arc flash'), 20, 'middle', 'mf-on'));
  }
  const rgOk = (a) => op(a, rect(347, 74, 140, 40, 'mf-accf', 6) + txt(417, 101, tr('WV: vrij', 'WV: released'), 20, 'middle', 'mf-on'));
  function rgTr(a) {
    if (a <= 0.01) return '';
    return op(a, `<path class="mf-axis" d="M366 120V196H468V120"/>` + line(417, 104, 417, CY - 6, 'mf-accl') + dot(417, CY, 5, 'mf-acc') + rect(397, 82, 40, 22, 'mf-accf', 3)
      + txt(417, 222, tr('sleuf', 'trench'), 20, 'middle', 'mf-mute') + txt(417, 340, tr('aanschieten op afstand', 'remote spiking'), 20, 'middle', 'mf-on'));
  }

  // ------------------------------------------------------------ s5: the voltage detector (a schema)
  set(E.tsBase, PANEL() + txt(620, 40, SCH, 20, 'end', 'mf-mute') + rect(222, 64, 150, 96, 'mf-tile', 6) + txt(297, 100, tr('bekende bron', 'known live'), 20, 'middle', 'mf-txt') + txt(297, 126, tr('onder spanning', 'source'), 20, 'middle', 'mf-mute')
    + txt(488, 84, 'st. 8', 20, 'middle', 'mf-mute') + txt(572, 84, 'st. 9', 20, 'middle', 'mf-mute') + ['L1', 'L2', 'L3'].map((l, i) => txt(410, 130 + i * 50, l, 20, 'start', 'mf-mono')).join(''));
  function tsT(a, lit) {
    return op(a, line(297, 160, 297, 206, 'mf-line') + rect(262, 206, 70, 120, 'mf-iron', 8) + `<circle class="${lit ? 'mf-acc' : 'mf-tile'}" cx="297" cy="240" r="13"/>` + rect(280, 276, 34, 34, 'mf-tile', 4)
      + op(lit, txt(222, 360, tr('zoeker werkt', 'detector works'), 20, 'start', 'mf-on')));
  }
  function tsC(n) {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const col = i < 3 ? 0 : 1;
      const row = i % 3;
      if (n > i) s += op(clamp(n - i, 0, 1), txt(col ? 560 : 476, 136 + row * 50, '0 V', 20, 'middle', 'mf-on') + tick(col ? 600 : 516, 130 + row * 50));
    }
    return s;
  }
  const tsTxt = (a) => op(a, txt(612, 360, tr('meet altijd zelf', 'always test yourself'), 20, 'end', 'mf-on'));

  // ------------------------------------------------------------ s7: on site, and the typical failures
  set(E.siBase, PANEL());
  const SITE = NL ? ['borden, naam van de IV', 'sloten en labels', 'aardgarnituren', 'isolerende matten', 'vlamboogwerende kleding'] : ['signs, the IV’s name', 'locks and tags', 'earthing sets', 'insulating mats', 'arc-rated clothing'];
  const FAULTS = NL ? ['aanwijzing verlopen', 'stap uit het hoofd', 'zoeker niet getest', 'VOP doet VP-werk'] : ['appointment expired', 'step from memory', 'tester not checked', 'VOP doing VP work'];
  function listBlock(title, items, y0, n, mark) {
    let s = txt(222, y0, title, 22, 'start', 'mf-txt');
    items.forEach((t, i) => { if (n > i) s += op(clamp(n - i, 0, 1), (mark === 'x' ? cross(240, y0 + 32 + i * 30, 'mf-axis') : tick(240, y0 + 30 + i * 30, 'mf-line')) + txt(264, y0 + 32 + i * 30, t)); });
    return s;
  }

  // ------------------------------------------------------------ s8: the reports and the switching slots (an example)
  set(E.cpBase, PANEL() + txt(620, 40, EX, 20, 'end', 'mf-mute'));
  const LOG = NL ? ['st. 8 veld 1 open', 'st. 9 veld 1 open', 'sloten en labels', 'gemeten: 0 V', 'geaard'] : ['st. 8 panel 1 open', 'st. 9 panel 1 open', 'locks and tags', 'tested: 0 V', 'earthed'];
  function cpLog(n, back) {
    let s = txt(222, 46, tr('meldingen', 'reports'), 22, 'start', 'mf-txt');
    LOG.forEach((t, i) => { if (n > i) s += op(clamp(n - i, 0, 1), txt(222, 92 + i * 40, `${i + 1}`, 20, 'start', 'mf-mono') + txt(250, 92 + i * 40, t) + txt(612, 92 + i * 40, tr('gemeld', 'reported'), 20, 'end', 'mf-mute')); });
    s += op(back, txt(222, 330, tr('niet gemeld: bijna-ongeval', 'not reported: near miss'), 20, 'start', 'mf-on') + txt(222, 366, tr('terug: omgekeerde volgorde', 'back: reverse order'), 20, 'start', 'mf-txt'));
    return s;
  }
  function cpSlot(a) {
    return op(a, txt(222, 46, tr('schakelmomenten', 'switching slots'), 22, 'start', 'mf-txt') + rect(222, 66, 80, 40, 'mf-accf', 6) + txt(262, 93, tr('uit', 'off'), 20, 'middle', 'mf-on')
      + rect(310, 66, 80, 40, 'mf-accf', 6) + txt(350, 93, tr('in', 'on'), 20, 'middle', 'mf-on') + txt(404, 93, tr('= 1 klus', '= 1 job'), 20, 'start', 'mf-txt'));
  }
  const BX = (v) => 222 + 390 * (v / C.NEED);
  function cpIn(capA, needA) {
    let s = op(capA, txt(222, 144, `${C.TECHS} × ${C.PER_DAY} × ${C.DAYS} × ${C.WEEKS}`, 20, 'start', 'mf-mono')
      + `<rect class="fp-meter" x="222" y="154" width="${f1((BX(C.CAP) - 222) * capA)}" height="28" rx="3"/>` + txt(BX(C.CAP) + 10, 176, `${C.CAP}`, 20, 'start', 'mf-big'));
    s += op(needA, txt(222, 222, tr(`nodig: ${C.JOBS} × 2`, `needed: ${C.JOBS} × 2`), 20, 'start', 'mf-mono')
      + `<rect class="fp-meter" data-top="" x="222" y="232" width="${f1((BX(C.NEED) - 222) * needA)}" height="28" rx="3"/>` + op(span(needA, 0.6, 1), txt(612, 222, `${grp(C.NEED)} · ${tr('2,4', '2.4')}×`, 20, 'end', 'mf-on')));
    return s;
  }
  function cpWait(a) {
    return op(a, txt(222, 306, tr('ploeg klaar, materiaal er:', 'crew ready, material there:'), 20, 'start', 'mf-txt') + txt(222, 336, tr('geen schakelmoment tot week 14', 'no switching slot until week 14'), 20, 'start', 'mf-on'));
  }
  function cpFix(a) {
    const rows = NL ? ['ploegen op schakelmomenten', 'bundelen: −2 per paar', 'standaardplannen, meer mensen', 'kies openlijk wat schuift'] : ['crews to switching slots', 'bundle jobs: −2 a pair', 'standard plans, more staff', 'choose openly what moves'];
    return rows.map((t, i) => op(a[i], tick(240, 296 + i * 26, 'mf-accl') + txt(264, 298 + i * 26, t))).join('');
  }

  // ------------------------------------------------------------ s9: as a layperson
  set(E.lkBase, PANEL() + txt(222, 46, tr('als leek', 'as a layperson'), 22, 'start', 'mf-txt'));
  const LK = NL
    ? [['y', 'vooraf: wie is de WV?'], ['y', 'buiten de afzetting'], ['y', 'helm, vlamboogwerend'], ['n', 'deur, schakelaar, kap'], ['n', 'automaat terugzetten'], ['y', 'vragen in de pauzes']]
    : [['y', 'before: who is the WV?'], ['y', 'outside the barrier'], ['y', 'helmet, arc-rated wear'], ['n', 'door, switch, cover'], ['n', 'resetting a breaker'], ['y', 'questions in the breaks']];
  function lkIn(a, last) {
    return LK.map(([m, t], i) => op(a[i], (m === 'y' ? tick(240, 84 + i * 44, 'mf-line') : cross(240, 88 + i * 44, 'mf-accl')) + txt(264, 86 + i * 44, t))).join('')
      + op(last, txt(222, 366, tr('eigen procedures gelden', 'site procedures apply'), 20, 'start', 'mf-on'));
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['ru', 'nm', 'rl', 'pl', 'rg', 'ts', 'si', 'cp', 'lk'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    // the world: switch 1 opens in s4, the lock and tag go on, the earthing switch closes and the screen stands in s6
    const opened = si > 3 || (si === 3 && span(b === 0 ? p : 1, 0.3, 0.55) > 0);
    const swOpen = si > 3 ? 1 : si === 3 ? (b === 0 ? span(p, 0.3, 0.55) : 1) : 0;
    const locked = si > 3 || (si === 3 && b === 2 && p > 0.3);
    const earthed = si > 5 ? 1 : si === 5 ? (b === 0 ? span(p, 0.35, 0.6) : 1) : 0;
    const screened = si > 5 || (si === 5 && b === 3 && p > 0.3);
    blades([1 - swOpen, 1, 1], [earthed, 0, 0]);
    show(E.lockW, locked);
    show(E.tagW, locked);
    show(E.shieldB, screened);
    E.world.querySelectorAll('[data-k="shieldF"]').forEach((e) => show(e, screened));
    show(E.barW, si === 8);
    void opened;

    if (si === 0) {
      vis.ru = b >= 2 ? (b === 2 ? span(p, 0, 0.1) : 1) : 0;
      set(E.ruIn, ruIn([0, 1, 2, 3, 4].map((i) => on(b, 2, p, 0.08 + i * 0.12, 0.2 + i * 0.12)).concat([on(b, 3, p, 0.05, 0.4)])));
    } else if (si === 1) {
      vis.nm = b <= 1 ? 1 : b === 2 ? 1 - span(p, 0, 0.1) : 0;
      vis.rl = b >= 2 ? span(b === 2 ? p : 1, 0, 0.1) : 0;
      set(E.nmIn, nmIn(on(b, 0, p, 0.55, 0.8), on(b, 1, p, 0.05, 0.4)));
      const roleA = [on(b, 2, p, 0.05, 0.25), on(b, 2, p, 0.45, 0.65), on(b, 3, p, 0.05, 0.25), on(b, 3, p, 0.35, 0.55), on(b, 3, p, 0.65, 0.85)];
      const lab = b === 4 ? 1 - span(p, 0, 0.12) : 1;
      for (let i = 0; i < 5; i++) set(E[`rl${i}`], role(i, roleA[i], lab));
      set(E.rlAp, rlAp(b === 4 ? span(p, 0.05, 0.8) : 0));
    } else if (si === 2) {
      vis.pl = span(u, 0, 0.04);
      const rowsA = PL_ROWS.map((r, i) => on(b, 0, p, 0.2 + i * 0.1, 0.3 + i * 0.1));
      const lit = b === 1 ? Math.min(5, Math.floor(span(p, 0.05, 0.95) * 6)) : b === 2 ? 1 : -1;
      set(E.plIn, plIn(rowsA, lit));
      set(E.plTxt, plTxt(on(b, 2, p, 0.2, 0.45), on(b, 3, p, 0.1, 0.4)));
    } else if (si === 3 || si === 5 || (si === 6 && b <= 1)) {
      vis.rg = si === 6 ? (b === 1 ? 1 : 1) : span(u, 0, 0.04);
      if (si === 6 && b === 1) vis.rg = 1 - span(p, 0.92, 1);
      const head = si === 3 ? (b === 2 ? tr('regel 2', 'rule 2') : tr('regel 1', 'rule 1')) : si === 5 ? (b === 3 ? tr('regel 5', 'rule 5') : tr('regel 4', 'rule 4')) : '';
      set(E.rgIn, rgIn(head, si === 3 ? (b === 0 ? span(p, 0.3, 0.55) : 1) : 1, si === 5 ? (b === 0 ? span(p, 0.35, 0.6) : 1) : si === 6 ? 1 : 0, si === 5 && b !== 2 ? 1 : 0, si === 5 && b === 2 ? 1 : 0));
      set(E.rgFeed, rgFeed(si === 3 && b === 1 ? span(p, 0.1, 0.6) : 0));
      set(E.rgLock, rgLock(si === 3 ? (b === 2 ? span(p, 0.25, 0.45) : 0) : 1));
      set(E.rgEarth, rgEarth(si === 5 && b <= 1 ? (b === 0 ? span(p, 0.5, 0.65) : 1) : 0));
      set(E.rgShield, rgShield(si === 5 && b === 3 ? span(p, 0.25, 0.5) : si === 6 ? 1 : 0, si === 5 ? 1 : 0));
      set(E.rgFlash, rgFlash(si === 5 && b === 2 ? span(p, 0.3, 0.45) * (1 - span(p, 0.85, 1)) : 0, clockS));
      set(E.rgOk, rgOk(si === 6 ? (b === 0 ? span(p, 0.2, 0.45) : 1 - span(p, 0, 0.1)) : 0));
      set(E.rgTr, rgTr(si === 6 && b === 1 ? span(p, 0.1, 0.4) : 0));
      if (si === 6 && b <= 1) vis.si = 0;
    } else if (si === 4) {
      vis.ts = span(u, 0, 0.04);
      set(E.tsT, tsT(on(b, 1, p, 0.05, 0.3), b > 1 || (b === 1 && p > 0.55) ? 1 : 0));
      set(E.tsC, tsC(b < 2 ? 0 : b === 2 ? span(p, 0.1, 0.85) * 6 : 6));
      set(E.tsTxt, tsTxt(on(b, 3, p, 0.4, 0.65)));
    }
    if (si === 6 && b >= 2) {
      vis.si = b === 2 ? span(p, 0, 0.08) : 1;
      set(E.siA, listBlock(tr('op locatie', 'on site'), SITE, 46, b === 2 ? span(p, 0.05, 0.85) * 5 : 5, 'v'));
      set(E.siB, listBlock(tr('typische fouten', 'typical failures'), FAULTS, 236, b === 3 ? span(p, 0.05, 0.75) * 4 : 0, 'x'));
    } else if (si === 7) {
      vis.cp = span(u, 0, 0.04);
      const logPhase = b === 0;
      set(E.cpLog, logPhase ? cpLog(span(p, 0.03, 0.6) * 5, span(p, 0.62, 0.8)) : '');
      set(E.cpSlot, cpSlot(b >= 1 ? on(b, 1, p, 0.05, 0.3) : 0));
      set(E.cpIn, b >= 2 ? cpIn(on(b, 2, p, 0.1, 0.7), on(b, 3, p, 0.1, 0.7)) : '');
      set(E.cpFix, b === 4 ? cpFix([span(p, 0.05, 0.2), span(p, 0.25, 0.4), span(p, 0.45, 0.6), span(p, 0.65, 0.8)]) : cpWait(b === 3 ? span(p, 0.6, 0.8) : 0));
    } else if (si === 8) {
      vis.lk = span(u, 0, 0.06);
      const a = [on(b, 0, p, 0.3, 0.5), on(b, 1, p, 0.05, 0.25), on(b, 1, p, 0.4, 0.6), on(b, 2, p, 0.05, 0.25), on(b, 2, p, 0.3, 0.5), on(b, 3, p, 0.05, 0.25)];
      set(E.lkIn, lkIn(a, on(b, 3, p, 0.6, 0.8)));
    }
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
