// The stage of the film "TPM: de eerste schoonmaak / TPM: the first clean": a
// pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants, the model's data and the beat starts FR),
// CAM (one camera move per scene), W and H. Moves are placed per caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step.
/* global P, C, CAM, W, H, iso, span, beatStarts */
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
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'mt-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mt-panel', r = 8, extra = '') => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"${extra}/>`;
  const line = (x0, y0, x1, y1, cls = 'mt-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const grp = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const dec = (v, d) => (NL ? v.toFixed(d).replace('.', ',') : v.toFixed(d));
  const EX = tr('voorbeeld', 'example');
  const PANEL = () => rect(204, 12, 428, 376);
  const MARKS = ['stud', 'bolt', 'level', 'gauge'].map((c) => E['mk-' + c]).filter(Boolean);
  const TAGS = [0, 1, 2, 3].map((i) => E['tg' + i]);

  // the beat on screen and its progress, from the caption beats of the scene
  function beatOf(si, u) {
    const fr = C.FR[si];
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }

  let scale = 1;
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    scale = s;
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
    for (const m of MARKS) m.setAttribute('r', f1(16 / s));
  }

  // ------------------------------------------------------------ the world's live parts
  function fanPath(phase) {
    let d = '';
    for (let i = 0; i < 7; i++) {
      const t = phase + (i / 7) * Math.PI * 2;
      const a = at([C.COWL_X, 2.6 * Math.cos(t), C.ZC + 2.6 * Math.sin(t)]);
      const b = at([C.COWL_X, 11 * Math.cos(t + 0.35), C.ZC + 11 * Math.sin(t + 0.35)]);
      d += `M${f2(a[0])} ${f2(a[1])}L${f2(b[0])} ${f2(b[1])}`;
    }
    return d;
  }
  // the OEE board's screen (flat coordinates of the face plane: x, −z): the trend up to prog
  const sz = (v) => -(C.WIN.z0 + 1 + (C.WIN.z1 - C.WIN.z0 - 2) * v);
  const trendAt = (t) => 0.5 + 0.22 * t + 0.03 * Math.sin(t * 19);
  function screen(prog) {
    const pts = [];
    for (let t = 0; t <= prog + 1e-9; t += 0.04) pts.push([lerp(C.WIN.x0 + 1, C.WIN.x1 - 1, t), sz(trendAt(t))]);
    if (pts.length < 2) return '';
    const [nx, ny] = pts[pts.length - 1];
    return `<path class="mt-scr" d="${pts.map(([x, y], i) => (i ? 'L' : 'M') + f2(x) + ' ' + f2(y)).join('')}"/><circle class="mt-now" cx="${f2(nx)}" cy="${f2(ny)}" r="0.6"/>`;
  }
  // a drop of oil from the pump cover onto the baseplate, once every 1.6 s
  const DROP0 = [-41, 10.6, 13.5];
  function drop(clockS, on) {
    if (!on) { E.drop.setAttribute('r', '0'); return; }
    const c = (clockS % 1.6) / 1.6;
    const z = lerp(DROP0[2], C.BASE_TOP + 0.4, Math.pow(c, 1.8));
    const [x, y] = at([DROP0[0], DROP0[1], z]);
    E.drop.setAttribute('cx', f1(x));
    E.drop.setAttribute('cy', f1(y));
    E.drop.setAttribute('r', c > 0.94 ? '0' : '1.3');
  }

  // ------------------------------------------------------------ hand tools, a fixed size on screen
  // x, y: stage point of the world group; z: units per screen unit (1 / scale)
  const P2 = (x, y) => `${f1(x)} ${f1(y)}`;
  function rag(x, y, z, wob) {
    const pts = [];
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const r = (26 + 6 * Math.sin(i * 2.3 + wob)) * z;
      pts.push([x + r * Math.cos(a), y + 0.7 * r * Math.sin(a)]);
    }
    return `<path class="mt-rag" d="${fmt(pts)}Z"/><path class="mt-toolf" d="M${P2(x - 9 * z, y - 3 * z)}L${P2(x + 7 * z, y + 2 * z)}M${P2(x - 5 * z, y + 5 * z)}L${P2(x + 9 * z, y - 4 * z)}" style="stroke-width:${f2(z)}"/>`;
  }
  function loupe(x, y, z0) {
    const z = z0 * 1.5;
    return `<path class="mt-toolf" d="M${P2(x + 10 * z, y + 10 * z)}L${P2(x + 26 * z, y + 26 * z)}" style="stroke-width:${f2(5 * z)}"/><circle class="mt-toolf" cx="${f1(x)}" cy="${f1(y)}" r="${f1(14 * z)}" style="stroke-width:${f2(2.4 * z)}"/>`;
  }
  function greaseGun(x, y, z0, push) {
    const z = z0 * 1.5;
    const g = (a, b) => P2(x + a * z, y + b * z);
    let o = `<path class="mt-toolf" d="M${g(0, -2)}L${g(14, -20)}" style="stroke-width:${f2(2.6 * z)}"/>`;
    o += `<path class="mt-tool" d="M${g(10, -22)}L${g(30, -38)}L${g(40, -26)}L${g(20, -10)}Z" style="stroke-width:${f2(1.4 * z)}"/>`;
    o += `<path class="mt-toolf" d="M${g(36, -32)}L${g(48 - 6 * push, -46 + 4 * push)}" style="stroke-width:${f2(2.6 * z)}"/>`;
    return o;
  }
  function wrench(x, y, z0, ang) {
    const z = z0 * 1.5;
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    const q = (a, b) => P2(x + (a * c - b * s) * z, y + (a * s + b * c) * z);
    return `<path class="mt-tool" d="M${q(7, -3.5)}L${q(46, -3.5)}L${q(46, 3.5)}L${q(7, 3.5)}Z" style="stroke-width:${f2(1.4 * z)}"/><circle class="mt-tool" cx="${f1(x)}" cy="${f1(y)}" r="${f1(8 * z)}" style="stroke-width:${f2(1.4 * z)}"/><path class="mt-toolf" d="M${q(-8, -2.5)}L${q(-2, -2.5)}M${q(-8, 2.5)}L${q(-2, 2.5)}" style="stroke-width:${f2(1.4 * z)}"/>`;
  }
  const CLOTH_PATH = [[-58, 17, 30], [-44, 12, 28], [-30, 8, 20], [-14, 8.5, 22], [4, 13.5, 30], [22, 13.5, 26], [36, 13.5, 22], [10, 26, 0], [-30, 26, 0], [-62, 24, 0]];
  function along(pts, t) {
    const n = pts.length - 1;
    const f = clamp(t, 0, 1) * n;
    const i = Math.min(n - 1, Math.floor(f));
    const a = at(pts[i]);
    const b = at(pts[i + 1]);
    return [lerp(a[0], b[0], f - i), lerp(a[1], b[1], f - i)];
  }

  // ------------------------------------------------------------ s1: the three zeros (a strip at the top)
  function zerosSvg(a) {
    const items = [tr('storingen', 'breakdowns'), tr('defecten', 'defects'), tr('ongevallen', 'accidents')];
    let o = rect(14, 10, 612, 88, 'mt-panel', 10);
    items.forEach((t, i) => {
      const x = 24 + i * 200;
      o += rect(x, 20, 192, 68, 'mt-tile', 8) + txt(x + 18, 70, '0', 40, 'start', 'mt-big') + txt(x + 58, 64, t, 21, 'start', 'mt-txt');
    });
    return grp(a, o);
  }

  // ------------------------------------------------------------ s2: the eight pillars
  const PILLARS = [
    tr('autonoom onderhoud', 'autonomous maint.'), tr('gepland onderhoud', 'planned maint.'), tr('gericht verbeteren', 'focused improvement'),
    tr('kwaliteitsonderhoud', 'quality maint.'), tr('nieuwe machines', 'new equipment'), tr('training', 'training'), tr('veiligheid, milieu', 'safety, environment'), tr('kantoor', 'office'),
  ];
  const COLX = (i) => 222 + i * 50;
  function column(i, h) {
    const y1 = 332;
    const y0 = y1 - 230 * h;
    if (h <= 0.01) return '';
    const cx = COLX(i) + 20;
    return rect(COLX(i), y0, 40, y1 - y0, 'mt-col', 3) + (h > 0.9 ? `<text class="mt-txt" x="${f1(cx + 7)}" y="${y1 - 8}" font-size="20" transform="rotate(-90 ${f1(cx + 7)} ${y1 - 8})">${PILLARS[i]}</text>` : '');
  }
  function houseBase(prog) {
    let o = PANEL();
    const roof = span(prog, 0, 0.3);
    if (roof > 0.01) o += grp(roof, `<path class="mt-tile" d="M214 98L427 30L622 98Z"/>` + txt(420, 84, 'TPM', 30, 'middle', 'mt-big'));
    for (let i = 2; i < 8; i++) o += column(i, span(prog, 0.2 + i * 0.07, 0.45 + i * 0.07));
    o += grp(span(prog, 0.1, 0.3), rect(214, 336, 408, 24, 'mt-tile', 3) + txt(418, 355, tr('iedereen doet mee', 'everyone takes part'), 20, 'middle', 'mt-mute'));
    return o;
  }

  // ------------------------------------------------------------ s4: the tag count
  const TAG_NAMES = [tr('olielekken', 'oil leaks'), tr('losse bouten', 'loose bolts'), tr('ontbrekende afschermingen', 'missing guards'), tr('overig', 'other')];
  const TAG_CLS = [['fp-meter', ' data-top=""'], ['fp-meter', ''], ['mt-oil', ''], ['mt-tile', '']];
  function countSvg(n, bar) {
    let o = PANEL();
    o += txt(222, 98, String(Math.round(n)), 64, 'start', 'mt-big') + txt(330, 74, tr('labels', 'tags'), 22, 'start', 'mt-txt') + txt(330, 100, tr('in één ploeg', 'in one shift'), 21, 'start', 'mt-mute');
    if (bar <= 0.01) {
      for (let i = 0; i < Math.round(n); i++) o += `<rect class="mt-chip" x="${222 + (i % 10) * 39}" y="${140 + Math.floor(i / 10) * 30}" width="30" height="20" rx="3"/><circle class="mt-hole" cx="${228 + (i % 10) * 39}" cy="${150 + Math.floor(i / 10) * 30}" r="2.4"/>`;
    } else {
      let x = 222;
      const w = 390;
      let body = '';
      C.TAGS.forEach((v, i) => {
        const ww = (w * v) / C.TAG_SUM;
        const show2 = span(bar, i * 0.2, i * 0.2 + 0.3);
        body += rect(x, 132, ww * show2, 32, TAG_CLS[i][0], 2, TAG_CLS[i][1]);
        body += grp(show2, rect(222, 192 + i * 46, 22, 22, TAG_CLS[i][0], 3, TAG_CLS[i][1]) + txt(256, 211 + i * 46, `${v} ${TAG_NAMES[i]}`, 21, 'start', 'mt-txt'));
        x += ww;
      });
      o += body;
    }
    return o;
  }

  // ------------------------------------------------------------ s5: the tag board
  function chip(x, y, state) { // 0 open, 1 closed
    return state ? `<rect class="mt-hollow" x="${f1(x)}" y="${f1(y)}" width="22" height="14" rx="3"/><path class="mt-accl" style="stroke-width:2" d="M${f1(x + 6)} ${f1(y + 7)}L${f1(x + 10)} ${f1(y + 11)}L${f1(x + 17)} ${f1(y + 3)}"/>` : `<rect class="mt-chip" x="${f1(x)}" y="${f1(y)}" width="22" height="14" rx="3"/>`;
  }
  function boardSvg(own, maint, wk, stale, share) {
    let o = PANEL();
    o += txt(222, 50, tr('operators', 'operators'), 21, 'start', 'mt-txt') + txt(424, 50, tr('onderhoud', 'maintenance'), 21, 'start', 'mt-txt');
    o += line(414, 30, 414, 210, 'mt-grid');
    for (let i = 0; i < C.OWN; i++) o += chip(222 + (i % 7) * 26, 66 + Math.floor(i / 7) * 22, i < own ? 1 : 0);
    for (let i = 0; i < C.MAINT; i++) o += chip(424 + (i % 6) * 30, 66 + Math.floor(i / 6) * 22, i < maint ? 1 : 0);
    o += txt(222, 150, `${Math.min(C.OWN, Math.round(own))} ${tr('in week 1', 'in week 1')}`, 21, 'start', 'mt-mute');
    if (wk > 0.01) o += grp(Math.min(1, wk * 3), txt(424, 150, tr(`≤ ${C.WEEKS} weken`, `≤ ${C.WEEKS} weeks`), 21, 'start', 'mt-on') + txt(424, 180, `${tr('week', 'week')} ${Math.min(C.WEEKS, Math.floor(wk * C.WEEKS + 1e-6))}`, 21, 'start', 'mt-mute'));
    if (stale > 0.01) {
      // reports per week when tags stay open: an example line that falls away
      let b = txt(222, 236, tr('meldingen per week', 'reports a week'), 21, 'start', 'mt-txt') + txt(222, 262, tr('als labels blijven hangen', 'when tags stay open'), 20, 'start', 'mt-mute') + txt(612, 372, EX, 20, 'end', 'mt-mute');
      b += line(232, 340, 612, 340, 'mt-axis');
      const pts = [];
      for (let t = 0; t <= stale + 1e-9; t += 0.05) pts.push([lerp(240, 600, t), 282 + 52 * (1 - Math.exp(-t * 2.4))]);
      if (pts.length > 1) b += `<path class="mt-line" d="${fmt(pts)}"/>`;
      o += b;
    } else if (share > 0.01) {
      const w = 380;
      o += txt(222, 262, tr('gehangen', 'hung'), 21, 'start', 'mt-txt') + txt(612, 262, String(C.TAG_SUM), 21, 'end', 'mt-big');
      o += rect(222, 274, w, 18, 'fp-meter', 3);
      o += txt(222, 326, tr('gesloten', 'closed'), 21, 'start', 'mt-on') + txt(612, 326, String(Math.round(C.TAG_SUM * share)), 21, 'end', 'mt-big');
      o += rect(222, 338, w * share, 18, 'fp-meter', 3, ' data-top=""');
    }
    return o;
  }

  // ------------------------------------------------------------ s6: the CILT strip and its inset
  const CILT = [['C', tr('schoonmaken', 'clean')], ['I', tr('inspecteren', 'inspect')], ['L', tr('smeren', 'lubricate')], ['T', tr('aandraaien', 'tighten')]];
  function ciltSvg(a, lit) {
    let o = rect(14, 8, 612, 90, 'mt-panel', 10);
    CILT.forEach(([l, w], i) => {
      const x = 18 + i * 152;
      const on = lit.includes(i);
      o += rect(x, 16, 148, 74, on ? 'mt-accf' : 'mt-tile', 8) + txt(x + 10, 50, l, 30, 'start', on ? 'mt-on' : 'mt-big') + txt(x + 8, 80, w, 20, 'start', on ? 'mt-on' : 'mt-txt');
    });
    return grp(a, o);
  }
  const IX = 446;
  const IW = 182;
  function insetFrame() { return rect(IX, 106, IW, 282, 'mt-panel', 10); }
  function matchMark(ang) {
    const cx = IX + IW / 2;
    const cy = 206;
    let o = insetFrame();
    o += `<circle class="mt-tile" cx="${cx}" cy="${cy}" r="62"/>`;
    const hex = [];
    for (let i = 0; i < 6; i++) { const a = ang + (i / 6) * Math.PI * 2; hex.push([cx + 44 * Math.cos(a), cy + 44 * Math.sin(a)]); }
    o += `<path class="mt-col" d="${fmt(hex)}Z"/><circle class="mt-hollow" cx="${cx}" cy="${cy}" r="18"/>`;
    o += `<path class="mt-accl" style="stroke-width:5" d="M${f1(cx + 44)} ${cy}L${f1(cx + 62)} ${cy}"/>`;
    o += `<path class="mt-accl" style="stroke-width:5" d="M${f1(cx + 18 * Math.cos(ang))} ${f1(cy + 18 * Math.sin(ang))}L${f1(cx + 40 * Math.cos(ang))} ${f1(cy + 40 * Math.sin(ang))}"/>`;
    o += txt(cx, 306, tr('merkstreep', 'match mark'), 21, 'middle', 'mt-txt');
    o += txt(cx, 340, Math.abs(ang) > 0.05 ? tr('verdraaid', 'moved') : tr('klopt', 'lined up'), 21, 'middle', 'mt-on');
    return o;
  }
  function visual(needle) {
    let o = insetFrame();
    // the level glass: oil up to between min and max
    const gx = IX + 20;
    o += rect(gx, 134, 30, 200, 'mt-tile', 6) + rect(gx + 4, 214, 22, 116, 'fp-meter', 3);
    for (const [y, t] of [[176, 'max'], [276, 'min']]) o += `<path class="mt-accl" d="M${gx - 6} ${y}L${gx + 36} ${y}"/>` + txt(gx + 42, y + 7, t, 20, 'start', 'mt-on');
    // the gauge: a dial, its zone, the needle
    const cx = IX + 140;
    const cy = 234;
    const R = 34;
    const arc = (r, a0, a1) => { const pts = []; for (let i = 0; i <= 14; i++) { const a = a0 + ((a1 - a0) * i) / 14; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return pts; };
    o += `<circle class="mt-tile" cx="${cx}" cy="${cy}" r="${R}"/>`;
    o += `<path class="mt-acc" d="${fmt([...arc(R - 4, -2.2, -1.1), ...arc(R - 14, -1.1, -2.2)])}Z"/>`;
    const na = lerp(-0.4, -1.65, needle);
    o += `<path class="mt-line" d="M${cx} ${cy}L${f1(cx + (R - 6) * Math.cos(na))} ${f1(cy + (R - 6) * Math.sin(na))}"/><circle class="mt-dot" cx="${cx}" cy="${cy}" r="3.5"/>`;
    o += txt(cx, 300, tr('zone', 'zone'), 20, 'middle', 'mt-on');
    return o;
  }
  function checklist(n) {
    let o = insetFrame();
    o += txt(IX + 14, 136, tr(`${C.POINTS} punten`, `${C.POINTS} points`), 21, 'start', 'mt-txt');
    for (let i = 0; i < C.POINTS; i++) {
      const y = 152 + i * 25;
      o += rect(IX + 14, y, 16, 16, 'mt-hollow', 3) + line(IX + 40, y + 8, IX + 40 + [118, 96, 110, 86, 120, 100, 92, 112][i], y + 8, 'mt-grid');
      if (i < n) o += `<path class="mt-accl" style="stroke-width:2.4" d="M${IX + 17} ${y + 8}L${IX + 21} ${y + 12}L${IX + 28} ${y + 3}"/>`;
    }
    o += txt(IX + IW - 14, 372, `${C.CHECK_MIN} min`, 24, 'end', 'mt-big');
    return o;
  }

  // ------------------------------------------------------------ s7: the results
  function bars(y, label, vals, unit, sc, a) {
    let o = txt(222, y, label, 21, 'start', 'mt-txt');
    [[tr('vóór', 'before'), vals[0], ''], [tr('na', 'after'), vals[1], ' data-top=""']].forEach(([n, v, top], i) => {
      const yy = y + 14 + i * 36;
      o += txt(222, yy + 20, n, 20, 'start', 'mt-mute') + rect(290, yy, v * sc * a, 26, 'fp-meter', 3, top) + grp(a, txt(298 + v * sc * a, yy + 20, `${v}${unit}`, 21, 'start', 'mt-big'));
    });
    return o;
  }
  function resultsSvg(a1, rd, a2, team) {
    let o = PANEL();
    o += bars(54, tr('storingen per maand', 'breakdowns a month'), C.BD, '', 30, a1);
    if (rd > 0.01) o += grp(rd, txt(222, 176, `(${C.BD[0]} − ${C.BD[1]}) × ${dec(C.BD_H, 1)} = ${dec(C.SAVED, 1)} ${tr('uur', 'h')}`, 24, 'start', 'mt-on'));
    if (a2 > 0.01) o += grp(Math.min(1, a2 * 4), bars(226, tr('olie bijvullen, liter per maand', 'oil top-ups, litres a month'), C.OIL, '', 4.5, a2));
    if (team > 0.01) o += grp(team, txt(222, 362, tr('onderhoud traint en kiest de controles', 'maintenance trains and picks the checks'), 20, 'start', 'mt-on'));
    return o;
  }

  // ------------------------------------------------------------ s8: OEE (an example)
  function oeeSvg(form, grow, world, trend) {
    let o = PANEL() + txt(612, 380, EX, 20, 'end', 'mt-mute');
    const w = 380;
    const A = lerp(C.OEE_A[0], C.OEE_A[1], grow);
    const Pf = lerp(C.OEE_P[0], C.OEE_P[1], grow);
    const rows = [[tr('beschikbaarheid', 'availability'), A, tr('minder storingen', 'fewer breakdowns')], ['performance', Pf, tr('minder microstops', 'fewer micro-stops')], [tr('kwaliteit', 'quality'), C.OEE_Q, '']];
    rows.forEach(([n, v, why], i) => {
      const y = 44 + i * 54;
      o += txt(222, y, (i ? '× ' : '') + n, 21, 'start', 'mt-txt') + rect(222, y + 10, w * v * form, 16, 'fp-meter', 3);
      if (why && grow > 0.01) o += grp(grow, txt(612, y, why, 20, 'end', 'mt-on'));
    });
    const oee = A * Pf * C.OEE_Q;
    o += txt(222, 222, '= OEE', 22, 'start', 'mt-big') + rect(222, 232, w * oee * form, 24, 'fp-meter', 3, ' data-top=""');
    if (world > 0.01) {
      const x = 222 + (w * C.WORLD) / 100;
      o += grp(world, line(x, 220, x, 268, 'mt-lim') + txt(612, 290, `${C.WORLD}% ${tr('wereldklasse', 'world class')}`, 20, 'end', 'mt-txt'));
    }
    if (trend > 0.01) {
      o += txt(222, 318, tr('trend per maand', 'trend by month'), 20, 'start', 'mt-mute') + line(222, 356, 500, 356, 'mt-axis');
      const pts = [];
      for (let t = 0; t <= trend + 1e-9; t += 0.04) pts.push([lerp(230, 494, t), 350 - 26 * (trendAt(t) - 0.45) / 0.3]);
      if (pts.length > 1) o += `<path class="mt-line" d="${fmt(pts)}"/>`;
    }
    return o;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['zeros', 'house', 'count', 'board', 'cilt', 'res', 'oee'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const z = 1 / scale;
    const vis = {};
    let running = true;
    let grime = 0;
    let leak = false;
    let puddle = 0;
    let crack = false;
    let tags = [0, 0, 0, 0];
    let tool = '';
    let trend = 0.35;

    if (si === 0) {
      grime = 1;
      vis.zeros = 1;
      set(E.zrIn, zerosSvg(b >= 1 ? (b === 1 ? span(p, 0.05, 0.3) : 1) : 0));
    } else if (si === 1) {
      grime = 1;
      vis.house = span(u, 0, 0.04);
      set(E.hsBase, houseBase(b === 0 ? span(p, 0.05, 0.9) : 1));
      set(E.hsAm, column(0, b === 0 ? span(p, 0.25, 0.45) : 1));
      set(E.hsPm, column(1, b === 0 ? span(p, 0.3, 0.52) : 1));
      set(E.hsSplit, b === 3 ? grp(span(p, 0.1, 0.4), txt(222, 382, tr(`operator: ${5}–${10} min per ploeg`, `operator: ${5}–${10} min per shift`), 20, 'start', 'mt-on')) : '');
    } else if (si === 2) {
      running = false;
      if (b === 0) {
        grime = 1 - span(p, 0.15, 0.95);
        const [x, y] = along(CLOTH_PATH, span(p, 0.05, 0.95));
        tool = rag(x, y - 4 * z, z, clockS * 3);
      }
      leak = b >= 1;
      puddle = b === 1 ? span(p, 0.1, 0.9) : b >= 2 ? 1 : 0;
      crack = b === 2 && p > 0.2;
      if (b === 1) tool = loupe(...at([-44, 14, 20]), z);
    } else if (si === 3) {
      leak = true;
      puddle = 1;
      crack = true;
      tags = b === 0 ? [0, 1, 2, 3].map((i) => span(p, 0.2 + i * 0.15, 0.3 + i * 0.15)) : [1, 1, 1, 1];
      vis.count = b >= 1 ? (b === 1 ? span(p, 0.15, 0.4) : 1) : 0;
      set(E.ctIn, countSvg(b === 1 ? C.TAG_SUM * span(p, 0.2, 0.7) : b >= 2 ? C.TAG_SUM : 0, b === 2 ? span(p, 0.05, 0.9) : 0));
    } else if (si === 4) {
      vis.board = span(u, 0, 0.04);
      const own = b === 0 ? C.OWN * span(p, 0.1, 0.85) : C.OWN;
      const wk = b === 1 ? span(p, 0.1, 0.9) : b >= 2 ? 1 : 0;
      const maint = b === 1 ? C.MAINT * span(p, 0.25, 0.9) : b >= 2 ? C.MAINT : 0;
      set(E.bdIn, boardSvg(own, maint, wk, b === 2 ? span(p, 0.1, 0.85) : 0, b === 3 ? span(p, 0.1, 0.8) : 0));
      tags = b === 0 ? [1, 1 - span(p, 0.5, 0.7), 1, 1 - span(p, 0.7, 0.9)] : b === 1 ? [1 - span(p, 0.6, 0.8), 0, 1 - span(p, 0.8, 0.95), 0] : [0, 0, 0, 0];
      leak = b === 0;
      puddle = b === 0 ? 1 : b === 1 ? 1 - span(p, 0.6, 0.8) : 0;
      crack = b === 0 || (b === 1 && p < 0.8);
    } else if (si === 5) {
      vis.cilt = 1;
      const lit = b === 1 ? [0, 1] : b === 2 ? [2, 3] : [];
      set(E.clIn, ciltSvg(b === 0 ? span(p, 0.05, 0.3) : 1, lit));
      running = !(b === 1 || b === 2);
      let inset = '';
      if (b === 1) {
        const t = span(p, 0.05, 0.6);
        const [x, y] = along(CLOTH_PATH.slice(0, 7), t);
        tool = p < 0.62 ? rag(x, y - 4 * z, z, clockS * 3) : loupe(...at([-14, 9, 24]), z);
      } else if (b === 2) {
        if (p < 0.5) {
          const [x, y] = at([C.STUD[0], C.STUD[1], C.STUD[2] + 3.8]);
          tool = greaseGun(x, y, z, span(p, 0.15, 0.3) * (1 - span(p, 0.35, 0.45)));
          inset = matchMark(0.45);
        } else {
          const [x, y] = at(C.BOLT);
          const ang = 0.45 * (1 - span(p, 0.6, 0.9));
          tool = wrench(x, y, z, -0.5 - ang);
          inset = matchMark(ang);
        }
      } else if (b === 3) {
        inset = visual(span(p, 0.1, 0.6));
      } else if (b === 4) {
        inset = checklist(Math.round(C.POINTS * span(p, 0.1, 0.85)));
      }
      set(E.clInset, inset);
    } else if (si === 6) {
      vis.res = span(u, 0, 0.04);
      set(E.rsIn, resultsSvg(b === 0 ? span(p, 0.1, 0.6) : 1, b >= 1 ? (b === 1 ? span(p, 0.2, 0.5) : 1) : 0, b >= 2 ? (b === 2 ? span(p, 0.05, 0.6) : 1) : 0, b === 3 ? span(p, 0.1, 0.4) : 0));
    } else if (si === 7) {
      vis.oee = span(u, 0, 0.04);
      set(E.oeIn, oeeSvg(b === 0 ? span(p, 0.1, 0.7) : 1, b >= 1 ? (b === 1 ? span(p, 0.1, 0.8) : 1) : 0, b >= 2 ? (b === 2 ? span(p, 0.05, 0.3) : 1) : 0, b === 3 ? span(p, 0.05, 0.85) : 0));
      trend = b === 3 ? 0.35 + 0.65 * span(p, 0.05, 0.85) : 0.35;
    }

    // world parts
    E.fan.setAttribute('d', running ? fanPath(clockS * 2.2) : fanPath(0.4));
    flag(E.lamp, 'data-lit', running);
    fade(E.grime, grime);
    show(E.grime, grime > 0.01);
    drop(clockS, leak);
    E.puddle.style.opacity = (0.85 * puddle).toFixed(3);
    show(E.crack, crack);
    TAGS.forEach((t, i) => { show(t, tags[i] > 0.01); fade(t, tags[i]); });
    set(E.tool, tool);
    set(E.scr, screen(trend));
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();
