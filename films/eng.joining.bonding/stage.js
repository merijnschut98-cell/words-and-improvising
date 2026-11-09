// The stage of the film "Lijmen, klinken, clinchen / Bonding, riveting,
// clinching": a pure function of (scene, u). Inlined into the page after the
// anatomy kit (iso-kit functions in scope), a preamble from build.mjs that
// defines P (projection), C (world constants, beat cameras), W and H, and the
// kit's audio warp.
//
// Each scene is a row of beats; the beat on screen (and how far through it)
// comes from the caption beat starts, so a move lands on the line that names
// it. The battery-tray corner on the bench is the world (moved by one camera
// per beat); the cards over it (cutaways and charts) are drawn in stage space.
/* global P, C, W, H, iso, pathOf, extrude, solidSvg, roundedPlan, translateAlong, span, beatStarts, warpU, introBeat, introCamera */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tx = (nl, en) => (EN ? en : nl);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const pth = (pts, closed = false) => pathOf(pts, closed);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const attr = (e, name, v) => { if (e['__' + name] !== v) { e.setAttribute(name, v); e['__' + name] = v; } };
  const move = (e, by) => attr(e, 'transform', translateAlong(P, by));
  const num = (v, dec = 0) => { const s = v.toFixed(dec); return EN ? s : s.replace('.', ','); };
  const big = (v) => (EN ? v.toLocaleString('en-GB') : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
  const T = (x, y, text, size = 20, anchor = 'middle', cls = 'fp-label') => `<text class="fp-ink ${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${text}</text>`;
  const card = (x, y, w, h, r = 12) => `<rect class="fp-hud-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fp-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const tag = (x, y, w, text, size = 19, anchor = 'start') => {
    const x0 = anchor === 'start' ? x - 6 : anchor === 'end' ? x - w + 6 : x - w / 2;
    return `<rect class="fp-hud-bg" x="${f1(x0)}" y="${f1(y - size - 2)}" width="${f1(w)}" height="${f1(size + 10)}" rx="6"/>` + T(x, y, text, size, anchor, 'fp-small');
  };
  const arrow = (x0, y0, x1, y1, head = 9, cls = 'fp-mark', wid = 2.2) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    return `<path class="${cls}" style="stroke-width:${wid}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}M${f1(x1 - ux * head - uy * head * 0.55)} ${f1(y1 - uy * head + ux * head * 0.55)}L${f1(x1)} ${f1(y1)}L${f1(x1 - ux * head + uy * head * 0.55)} ${f1(y1 - uy * head - ux * head * 0.55)}"/>`;
  };
  const dbl = (x0, y0, x1, y1, head = 7) => { const mx = (x0 + x1) / 2; const my = (y0 + y1) / 2; return arrow(mx, my, x0, y0, head, 'fp-mark', 1.8) + arrow(mx, my, x1, y1, head, 'fp-mark', 1.8); };
  const poly = (pts, cls) => `<path class="${cls}" d="${pth(pts, true)}"/>`;
  const rect = (x, y, w, h, cls, r = 0) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}"${r ? ` rx="${r}"` : ''}/>`;
  const smooth = (t) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };
  // a sheet as a band between two curves y0(x), y1(x), sampled from xa to xb
  const band = (xa, xb, top, bot, cls, n = 48) => {
    const a = [];
    const b = [];
    for (let i = 0; i <= n; i++) { const x = xa + ((xb - xa) * i) / n; a.push([x, top(x)]); b.push([x, bot(x)]); }
    return poly([...a, ...b.reverse()], cls);
  };

  // ------------------------------------------------------------ s1: the melting points beside the tray
  function meltCard(p) {
    let s = card(384, 24, 236, 352);
    const sy = (t) => 318 - t * 0.12;
    const g = span(p, 0.05, 0.55);
    s += T(502, 58, tx('smeltpunt', 'melting point'), 20, 'middle', 'fp-label');
    [[448, C.MELT.al, 'aluminium'], [560, C.MELT.steel, tx('staal', 'steel')]].forEach(([x, t, name], i) => {
      s += rect(x - 14, sy(1600), 28, sy(0) - sy(1600), 'fp-meter', 14) + `<circle class="fp-meter" cx="${x}" cy="${sy(0) + 6}" r="17"/>`;
      s += rect(x - 8, sy(t * g), 16, sy(0) - sy(t * g) + 6, i ? 'fp-fill' : 'fp-cell-on', 8) + `<circle class="${i ? 'fp-fill' : 'fp-cell-on'}" cx="${x}" cy="${sy(0) + 6}" r="11"/>`;
      if (g > 0.95) s += T(x, sy(t) - 12, `${big(t)} °C`, 20, 'middle', 'fp-big');
      s += T(x, 368, name, 19, 'middle', 'fp-small');
    });
    if (p > 0.6) s += tag(502, 94, 168, tx('samen: bros', 'together: brittle'), 19, 'middle');
    return s;
  }

  // ------------------------------------------------------------ s2: adhesive families
  function famCard(p) {
    let s = card(30, 24, 580, 352);
    const rows = EN
      ? [['Epoxy', 'stiff and strong', 1], ['Polyurethane (PU)', 'tough, flexible', 1], ['Acrylic', 'cures fast', 1], ['Superglue', 'cyanoacrylate: small parts', 0], ['MS polymer', 'elastic, also seals', 0]]
      : [['Epoxy', 'stijf en sterk', 1], ['Polyurethaan (PU)', 'taai, buigzaam', 1], ['Acrylaat', 'hardt snel uit', 1], ['Secondelijm', 'cyanoacrylaat: kleine delen', 0], ['MS-polymeer', 'elastisch, dicht ook af', 0]];
    rows.forEach(([name, what, carry], i) => {
      if (p < 0.02 + i * 0.13) return;
      const y = 70 + i * 58;
      s += rect(52, y - 18, 22, 22, carry ? 'fp-cell-on' : 'fp-bx', 4) + T(88, y, name, 22, 'start', 'fp-big') + T(318, y, what, 19, 'start', 'fp-small');
    });
    s += rect(52, 336, 18, 18, 'fp-cell-on', 4) + T(80, 351, tx('dragend', 'load-bearing'), 19, 'start', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ s2: a lap joint, in shear or in peel, with the stress in the adhesive under it
  const LJ = { y0: 120, t: 18, gl: 6, base: 320 };
  function lapBase(title) {
    return card(24, 24, 592, 352) + `<path class="fp-mark" d="M60 ${LJ.base}L590 ${LJ.base}"/>` + T(590, LJ.base + 30, title, 19, 'end', 'fp-small');
  }
  function lapShear(g, nums) {
    const yU = LJ.y0;
    const yG = yU + LJ.t;
    const yL = yG + LJ.gl;
    const sh = 7 * g;
    let s = rect(70, yL, 310, LJ.t, 'fp-st') + rect(260 + sh, yU, 310, LJ.t, 'fp-al');
    s += poly([[260, yL], [380, yL], [380 + sh, yG], [260 + sh, yG]], 'fp-glue');
    s += arrow(66, yL + 9, 66 - 28 * g - 4, yL + 9, 9, 'fp-mark', 2.6) + arrow(574 + sh, yU + 9, 578 + sh + 26 * g, yU + 9, 9, 'fp-mark', 2.6);
    // the stress: spread over the whole overlap, a little higher at the ends
    const pts = [];
    for (let x = 260; x <= 380; x += 4) { const q = (2 * (x - 320)) / 120; pts.push([x, LJ.base - g * (30 + 26 * q ** 4)]); }
    s += poly([[260, LJ.base], ...pts, [380, LJ.base]], 'fp-band') + `<path class="fp-sig" d="${pth(pts)}"/>`;
    s += T(320, yL + LJ.t + 30, tx('lijmvlak draagt', 'whole area carries'), 19, 'middle', 'fp-small');
    if (nums) {
      s += tag(600, 238, 236, `${C.LAP.w} × ${C.LAP.ov} = ${C.LAP.area} mm²`, 20, 'end');
      s += tag(600, 274, 236, `× ${C.LAP.tau} MPa = ${C.LAP.kN} kN`, 20, 'end');
    }
    return s;
  }
  function lapPeel(g) {
    const yU = LJ.y0;
    const yG = yU + LJ.t;
    const yL = yG + LJ.gl;
    const xb = 230 + 70 * span(g, 0.45, 1); // the crack front
    let s = rect(70, yL, 500, LJ.t, 'fp-st');
    s += rect(xb, yG, 570 - xb, LJ.gl, 'fp-glue');
    for (let x = 232; x < xb - 6; x += 14) s += rect(x, yL - 3, 7, 3, 'fp-glue');
    // the top strip: bonded from xb to 570, its free tab bending up from xb
    const th = (Math.PI / 180) * 62 * span(g, 0.05, 0.6);
    const Lt = 80 + (xb - 230) * 0.6;
    const c = [];
    let x = xb;
    let y = yU + LJ.t / 2;
    const n = 24;
    for (let i = 0; i <= n; i++) {
      c.push([x, y]);
      const a = (th * (i + 0.5)) / n;
      x -= (Lt / n) * Math.cos(a);
      y -= (Lt / n) * Math.sin(a);
    }
    const flat = [[570, yU + LJ.t / 2], [xb, yU + LJ.t / 2]];
    const line = [...flat, ...c.slice(1)];
    const up = [];
    const dn = [];
    for (let i = 0; i < line.length; i++) {
      const a = line[Math.max(0, i - 1)];
      const b = line[Math.min(line.length - 1, i + 1)];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l;
      const ny = dx / l;
      up.push([line[i][0] + (nx * LJ.t) / 2, line[i][1] + (ny * LJ.t) / 2]);
      dn.push([line[i][0] - (nx * LJ.t) / 2, line[i][1] - (ny * LJ.t) / 2]);
    }
    s += poly([...up, ...dn.reverse()], 'fp-al');
    const end = line[line.length - 1];
    const a1 = th;
    s += arrow(end[0], end[1], end[0] - 34 * Math.cos(a1 + 0.3) * 0.4, end[1] - 34, 9, 'fp-mark', 2.6);
    s += arrow(80, yL + LJ.t + 4, 80, yL + LJ.t + 30, 9, 'fp-mark', 2.6);
    // the stress: one tall peak on the line at the crack front
    const pts = [];
    for (let xx = xb; xx <= 570; xx += 3) pts.push([xx, LJ.base - g * 128 * Math.exp(-(xx - xb) / 11)]);
    s += poly([[xb, LJ.base], ...pts, [570, LJ.base]], 'fp-band') + `<path class="fp-sig" d="M${f1(xb)} ${LJ.base}${pth(pts).replace(/^M/, 'L')}"/>`;
    if (g > 0.5) s += tag(xb + 34, LJ.base - 96, 150, tx('alles op een lijn', 'all on one line'), 19, 'start');
    return s;
  }

  // ------------------------------------------------------------ s3/s6: the self-piercing rivet in section (base coordinates, centre x 320)
  const SP = { cx: 320, top: 150, mid: 176, bot: 206, ro: 26, wall: 9, len: 46, head: 10, hr: 36 };
  function sprParts(g, { die = true, punch = true, xa = 112, xb = 528 } = {}) {
    const { cx, top, mid, bot } = SP;
    const a = span(g, 0, 0.55);
    const b = span(g, 0.55, 1);
    const hb = lerp(64, top, a); // head underside
    const tipY = hb + SP.len + 10 * b;
    const bump = (x, R) => (Math.abs(x - cx) < R ? 0.5 + 0.5 * Math.cos((Math.PI * (x - cx)) / R) : 0);
    const D1 = 13 * b;
    const D2 = 20 * b;
    let s = '';
    if (die) {
      const cav = [];
      for (let i = 0; i <= 40; i++) {
        const x = cx - 62 + (124 * i) / 40;
        const q = Math.abs(x - cx) / 62;
        cav.push([x, bot + 24 * Math.sqrt(Math.max(0, 1 - q * q)) - 11 * Math.max(0, 1 - q / 0.32)]);
      }
      s += poly([[214, bot], ...cav, [426, bot], [426, 300], [214, 300]], 'fp-tool');
    }
    s += band(xa, xb, (x) => mid + D1 * bump(x, 64), (x) => bot + D2 * bump(x, 62), 'fp-st');
    const cut = tipY > top + 2;
    if (cut) {
      s += band(xa, cx - SP.ro, () => top, () => mid, 'fp-al', 8) + band(cx + SP.ro, xb, () => top, () => mid, 'fp-al', 8);
      const st = top + Math.min(18, Math.max(0, tipY - top) * 0.25);
      s += band(cx - SP.ro + SP.wall, cx + SP.ro - SP.wall, (x) => st + D1 * bump(x, 64) * 0.6, (x) => st + 24 + D1 * bump(x, 64) * 0.6, 'fp-al', 8);
    } else s += band(xa, xb, () => top, () => mid, 'fp-al', 8);
    // the two legs, flaring out as the die opens them
    for (const sg of [-1, 1]) {
      const o = [];
      const i = [];
      for (let k = 0; k <= 12; k++) {
        const t = k / 12;
        const y = lerp(hb, tipY, t);
        const fl = 16 * b * t * t;
        o.push([cx + sg * (SP.ro + fl), y]);
        i.push([cx + sg * (SP.ro - SP.wall + fl * 1.1), y]);
      }
      s += poly([...o, ...i.reverse()], 'fp-rv');
    }
    s += poly([[cx - SP.hr, hb - SP.head], [cx + SP.hr, hb - SP.head], [cx + SP.hr, hb - 3], [cx + SP.ro, hb], [cx - SP.ro, hb], [cx - SP.hr, hb - 3]], 'fp-rv');
    if (punch) s += rect(cx - 40, 30, 80, hb - SP.head - 30, 'fp-tool', 3);
    return { s, hb, tipY, D2 };
  }
  function sprCard(g) {
    const { s } = sprParts(g);
    return card(24, 24, 592, 352) + s
      + tag(370, 66, 104, tx('stempel', 'punch'), 19) + tag(44, 136, 132, tx('bovenplaat', 'top sheet'), 19) + tag(44, 240, 140, tx('onderplaat', 'bottom sheet'), 19) + tag(436, 286, 90, tx('matrijs', 'die'), 19)
      + (g > 0.6 ? tag(440, 240, 140, tx('poot spreidt', 'leg flares'), 19) : '');
  }
  function sectCard(kb) {
    const sc = 1.45;
    const ox = 290;
    const oy = 200;
    const M = (x, y) => [ox + sc * (x - SP.cx), oy + sc * (y - 176)];
    const { s, hb, tipY } = sprParts(1, { die: false, punch: false, xa: 180, xb: 460 });
    const body = card(24, 24, 592, 352) + `<g transform="translate(${f1(ox - sc * SP.cx)} ${f1(oy - sc * 176)}) scale(${sc})">${s}</g>`
      + T(36 + 8, 56, tx('macroslijp', 'cross-section'), 19, 'start', 'fp-small');
    // head height: from the sheet surface to the top of the head
    const [hx, hy] = M(SP.cx + SP.hr, hb - SP.head);
    const [, sy] = M(0, SP.top);
    const head = `<path class="fp-dash" d="M${f1(hx + 4)} ${f1(hy)}L${f1(hx + 80)} ${f1(hy)}M${f1(hx + 4)} ${f1(sy)}L${f1(hx + 80)} ${f1(sy)}"/>` + dbl(hx + 72, hy - 22, hx + 72, hy, 7) + dbl(hx + 72, sy + 22, hx + 72, sy, 7)
      + tag(hx + 92, (hy + sy) / 2 + 7, 150, tx('kophoogte', 'head height'), 19);
    // interlock: how far the flared leg reaches past the hole in the top sheet
    const [lx0, ly] = M(SP.cx - SP.ro, tipY);
    const [lx1] = M(SP.cx - SP.ro - 16, tipY);
    const lock = `<path class="fp-dash" d="M${f1(lx0)} ${f1(ly - 46)}L${f1(lx0)} ${f1(ly + 30)}M${f1(lx1)} ${f1(ly)}L${f1(lx1)} ${f1(ly + 30)}"/>` + dbl(lx1, ly + 24, lx0, ly + 24, 6)
      + tag(lx0 + 6, ly + 66, 130, tx('insluiting', 'interlock'), 19, 'end');
    return { body, head: kb >= 1 ? head : '', lock: kb >= 1 ? lock : '' };
  }

  // ------------------------------------------------------------ s3/s7: clinching
  function clinchParts(g) {
    const cx = 320;
    const top = 150;
    const t = 24;
    const D = 46 * span(g, 0.3, 1);
    const prof = (rin, rout) => (x) => D * smooth((rout - Math.abs(x - cx)) / (rout - rin));
    let s = '';
    // the die: a round cavity with a small groove at its floor
    s += poly([[226, top + 2 * t], [cx - 38, top + 2 * t], [cx - 38, top + 2 * t + 40], [cx - 44, top + 2 * t + 46], [cx + 44, top + 2 * t + 46], [cx + 38, top + 2 * t + 40], [cx + 38, top + 2 * t], [414, top + 2 * t], [414, 300], [226, 300]], 'fp-tool');
    const d2 = prof(24, 44);
    const d1 = prof(20, 38);
    const neck = (x) => (Math.abs(Math.abs(x - cx) - 36) < 8 ? 4 * span(g, 0.8, 1) * (1 - Math.abs(Math.abs(x - cx) - 36) / 8) : 0);
    s += band(110, 530, (x) => top + t + d2(x), (x) => top + 2 * t + d2(x) + neck(x), 'fp-st', 120);
    s += band(110, 530, (x) => top + d1(x), (x) => top + t + d1(x), 'fp-al', 120);
    const pb = g < 0.3 ? lerp(60, top, span(g, 0, 0.3)) : top + D;
    s += rect(cx - 20, 30, 40, pb - 30, 'fp-tool', 3);
    return { s, D, cx, top, t };
  }
  function clinchCard(g, dims) {
    const { s, D, cx, top, t } = clinchParts(g);
    let out = card(24, 24, 592, 352) + s + tag(cx + 30, 62, 104, tx('stempel', 'punch'), 19) + tag(428, 288, 90, tx('matrijs', 'die'), 19);
    if (g > 0.85 && !dims) out += tag(cx + 70, top + 2 * t + D - 6, 120, tx('haakt', 'interlocks'), 19) + arrow(cx + 64, top + 2 * t + D - 12, cx + 46, top + 2 * t + D - 12, 7);
    let dim = '';
    if (dims) {
      const y0 = top + D;
      const y1 = top + 2 * t + D;
      dim = `<path class="fp-dash" d="M${cx + 8} ${f1(y0)}L${cx + 112} ${f1(y0)}M${cx + 46} ${f1(y1)}L${cx + 112} ${f1(y1)}"/>` + dbl(cx + 104, y0, cx + 104, y1, 7)
        + tag(cx + 122, (y0 + y1) / 2 + 7, 156, tx('bodemdikte', 'bottom thickness'), 19);
    }
    return { body: out, dim };
  }

  // ------------------------------------------------------------ s3: how engineers choose
  function chooseCard() {
    let s = card(24, 24, 592, 352);
    const rows = EN
      ? [['same steel, high strength', 'welding'], ['mixed materials, sealing', 'adhesive + rivets'], ['must come apart for service', 'bolts']]
      : [['zelfde staal, hoge sterkte', 'lassen'], ['gemengd materiaal, afdichten', 'lijm + nagels'], ['moet los voor service', 'bouten']];
    rows.forEach(([cond, res], i) => {
      const y = 92 + i * 104;
      const x = 52;
      if (i === 0) s += rect(x, y - 4, 40, 14, 'fp-st') + rect(x + 46, y - 4, 40, 14, 'fp-st') + `<path class="fp-sig" d="M${x + 36} ${y - 4}Q${x + 43} ${y - 18} ${x + 50} ${y - 4}"/>`;
      if (i === 1) s += rect(x, y + 2, 60, 12, 'fp-st') + rect(x + 26, y - 14, 60, 12, 'fp-al') + rect(x + 26, y - 2, 34, 4, 'fp-glue') + rect(x + 40, y - 20, 14, 6, 'fp-rv', 2);
      if (i === 2) {
        const hex = [];
        for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + (k * Math.PI) / 3; hex.push([x + 44 + 16 * Math.cos(a), y + 2 + 16 * Math.sin(a)]); }
        s += poly(hex, 'fp-rv') + `<circle class="fp-mark" cx="${x + 44}" cy="${y + 2}" r="7"/>`;
      }
      s += T(x + 104, y + 8, cond, 19, 'start', 'fp-small') + T(596, y + 40, res, 22, 'end', 'fp-big') + arrow(x + 104, y + 33, 596 - 8 - res.length * 12.5, y + 33, 8, 'fp-mark', 1.6);
    });
    return s;
  }

  // ------------------------------------------------------------ s4: surface preparation and wetting
  function prepCard(p) {
    let s = card(24, 24, 592, 352);
    const steps = EN ? ['degrease', 'roughen', 'primer'] : ['ontvetten', 'opruwen', 'primer'];
    steps.forEach((name, i) => {
      const x = 70 + i * 190;
      const on = p > 0.04 + i * 0.12;
      s += rect(x, 48, 150, 38, on ? 'fp-cell-on' : 'fp-bx', 8) + T(x + 75, 74, name, 20, 'middle', 'fp-label');
      if (i < 2) s += arrow(x + 154, 67, x + 186, 67, 7, 'fp-mark', 1.6);
    });
    const g = span(p, 0.35, 0.85);
    // left: an oily plate, the drop beads up; right: a clean plate, the drop wets out
    const plateY = 268;
    s += rect(50, plateY, 250, 18, 'fp-st') + rect(340, plateY, 250, 18, 'fp-st');
    for (let x = 62; x < 296; x += 22) s += `<ellipse class="fp-fill" cx="${x}" cy="${plateY - 1}" rx="7" ry="2.2"/>`;
    const drop = (cx, w, h) => {
      const pts = [];
      for (let i = 0; i <= 30; i++) { const tt = i / 30; const x = cx - w / 2 + w * tt; pts.push([x, plateY - h * Math.sin(Math.PI * tt) ** (h > 30 ? 0.55 : 1.2)]); }
      return poly(pts, 'fp-glue');
    };
    s += drop(175, 70, 46);
    s += drop(465, lerp(70, 210, g), lerp(46, 14, g));
    s += T(175, 318, tx('olie: lijm parelt', 'oil: it beads up'), 19, 'middle', 'fp-small') + T(465, 318, tx('schoon: lijm vloeit uit', 'clean: it wets out'), 19, 'middle', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ s4: the static mixer
  function mixCard(p) {
    let s = card(24, 24, 592, 352);
    const y0 = 150;
    s += rect(46, y0 - 58, 190, 46, 'fp-bx', 8) + rect(46, y0 + 12, 190, 46, 'fp-bx', 8) + T(141, y0 - 28, tx('hars', 'resin'), 20, 'middle', 'fp-label') + T(141, y0 + 42, tx('harder', 'hardener'), 20, 'middle', 'fp-label');
    s += poly([[236, y0 - 58], [276, y0 - 20], [276, y0 + 20], [236, y0 + 58]], 'fp-tool');
    s += rect(276, y0 - 20, 250, 40, 'fp-tool', 4) + poly([[526, y0 - 20], [572, y0 - 4], [572, y0 + 4], [526, y0 + 20]], 'fp-tool');
    const front = 276 + 296 * span(p, 0.05, 0.7);
    // the strands split at every element: 2, 4, 8 ... thin layers, then one mixed colour
    const el = 25;
    for (let i = 0; i < 10; i++) {
      const xa = 276 + i * el;
      if (xa > front) break;
      const xb = Math.min(xa + el, front);
      const n = Math.min(16, 2 ** (i + 1));
      if (i < 4) for (let j = 0; j < n; j++) s += rect(xa, y0 - 17 + (34 * j) / n, xb - xa, 34 / n, j % 2 ? 'fp-fill' : 'fp-glue');
      else s += rect(xa, y0 - 17, xb - xa, 34, 'fp-glue');
      s += `<path class="fp-mark" d="M${f1(xa)} ${y0 - 18}L${f1(Math.min(xa + el, 526))} ${y0 + 18}"/>`;
    }
    if (front >= 560) s += `<path class="fp-gluel" d="M572 ${y0}Q586 ${y0 + 40} 586 ${y0 + 96}"/>` + rect(420, y0 + 98, 190, 14, 'fp-st');
    s += T(400, y0 + 54, tx('statische menger', 'static mixer'), 20, 'middle', 'fp-label') + T(400, y0 + 82, tx('schroefvormige elementen', 'spiral elements'), 19, 'middle', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ s4: open time and cure
  function openCard(p) {
    let s = card(24, 24, 592, 352);
    const sx = (m) => 70 + m * 8.6;
    const y = 190;
    s += `<path class="fp-mark" d="M${sx(0)} ${y}L${sx(60)} ${y}"/>`;
    for (const m of [0, 20, 40, 60]) s += `<path class="fp-mark" d="M${f1(sx(m))} ${y}L${f1(sx(m))} ${y + 8}"/>` + T(sx(m), y + 32, `${m}`, 19, 'middle', 'fp-small');
    s += T(sx(60), y + 58, 'min', 19, 'end', 'fp-small');
    s += rect(sx(0), y - 34, sx(C.OPEN.open) - sx(0), 30, 'fp-cell-on', 4) + T(sx(0) + 8, y - 46, tx(`open tijd ${C.OPEN.open} min`, `open time ${C.OPEN.open} min`), 20, 'start', 'fp-label');
    let hatch = '';
    for (let x = sx(20) + 6; x < sx(60) - 8; x += 12) hatch += `M${f1(x)} ${y - 4}L${f1(x + 10)} ${y - 30}`;
    s += `<path class="fp-hatch" d="${hatch}"/>` + T(sx(40), y - 46, tx('te dik om te hechten', 'too thick to bond'), 19, 'middle', 'fp-small');
    const m = 60 * span(p, 0.05, 0.75);
    s += poly([[sx(m), y - 2], [sx(m) - 8, y - 16], [sx(m) + 8, y - 16]], 'fp-ink');
    if (m >= 39.5) s += `<path class="fp-dash" d="M${f1(sx(40))} ${y}L${f1(sx(40))} ${y + 74}"/>` + tag(sx(40), y + 98, 340, tx('lijn 40 min stil: menger uitspuiten', 'line stopped 40 min: purge the mixer'), 19, 'middle');
    if (p > 0.6) s += T(320, 352, tx('uitharden: uren tot hanteerbaar, vaak een dag tot vol sterk', 'cure: hours to handle, often a day to full strength'), 19, 'middle', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ s5: the shift check: weighing a test bead
  function weighCard(p) {
    let s = card(24, 24, 592, 352);
    const sx = (gr) => 210 + gr * 6.4;
    const g = span(p, 0.05, 0.45);
    const B = C.BEAD;
    s += T(320, 60, `Ø${B.d}: ${num(B.area, 1)} mm² × ${num(B.len / 1000, 1)} m = ${num(B.cm3, 1)} cm³ × ${num(B.rho, 1)} = ${Math.round(B.g)} g`, 19, 'middle', 'fp-small');
    [[52, tx('berekend', 'calculated'), 'fp-bx'], [B.test, tx('proefrups', 'test bead'), 'fp-cell-on']].forEach(([v, name, cls], i) => {
      const y = 86 + i * 68;
      s += T(196, y + 28, name, 20, 'end', 'fp-label') + rect(sx(0), y, sx(v * (i ? g : 1)) - sx(0), 42, cls, 4);
      if (!i || g > 0.95) s += T(sx(v) + 12, y + 29, `${v} g`, 22, 'start', 'fp-big');
    });
    if (g > 0.95) s += `<path class="fp-dash" d="M${f1(sx(52))} 80L${f1(sx(52))} 214"/>` + tag(sx(52) - 8, 238, 74, '85%', 22, 'end');
    if (p > 0.5) {
      const chain = EN ? ['cold drum', 'thick', 'less adhesive'] : ['koud vat', 'stroperig', 'minder lijm'];
      chain.forEach((c, i) => { s += T(110 + i * 200, 290, c, 19, 'middle', 'fp-small'); if (i < 2) s += arrow(170 + i * 200, 284, 236 + i * 200, 284, 7, 'fp-mark', 1.6); });
    }
    if (p > 0.72) s += T(320, 340, tx('dus: vat warm, doseren op volume', 'so: keep it warm, dose by volume'), 20, 'middle', 'fp-label');
    return s;
  }

  // ------------------------------------------------------------ s5: fracture surfaces of two opened lap coupons
  function coupCard(p) {
    let s = card(24, 24, 592, 352);
    const patch = (x, y, w, h, seed) => {
      const pts = [[x, y]];
      for (let i = 0; i <= 10; i++) pts.push([x + (w * i) / 10, y + h + (((i * 7 + seed) % 5) - 2) * 2.2]);
      pts.push([x + w, y]);
      return poly(pts, 'fp-glue');
    };
    const strip = (x, glue, seed) => rect(x, 100, 74, 196, 'fp-al', 3) + (glue === 'full' ? rect(x + 2, 102, 70, 36, 'fp-glue') : glue === 'part' ? patch(x + 2, 102, 70, 30, seed) : `<rect class="fp-dash" x="${x + 4}" y="104" width="66" height="32"/>`);
    if (p > 0.03) s += strip(70, 'part', 1) + strip(162, 'part', 3) + T(153, 84, tx('cohesief', 'cohesive'), 22, 'middle', 'fp-big') + T(153, 330, tx('lijm op beide delen', 'adhesive on both'), 19, 'middle', 'fp-small');
    if (p > 0.45) s += strip(404, 'full', 0) + strip(496, 'bare', 0) + T(487, 84, tx('adhesief', 'adhesive'), 22, 'middle', 'fp-big') + T(487, 330, tx('één kale kant', 'one bare side'), 19, 'middle', 'fp-small');
    s += T(320, 360, tx('proefstuk volgens ISO 4587', 'test piece to ISO 4587'), 19, 'middle', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ s6: the blind rivet, set from one side
  function blindCard(g) {
    const cx = 320;
    const top = 170;
    const mid = 196;
    const bot = 222;
    const a = span(g, 0.05, 0.78);
    const b = span(g, 0.84, 0.97);
    let s = card(24, 24, 592, 352);
    s += rect(110, top, cx - 18 - 110, mid - top, 'fp-al') + rect(cx + 18, top, 530 - cx - 18, mid - top, 'fp-al');
    s += rect(110, mid, cx - 18 - 110, bot - mid, 'fp-st') + rect(cx + 18, mid, 530 - cx - 18, bot - mid, 'fp-st');
    // the hollow body: flange on top, the sleeve through the hole, the tail upsetting under the sheets
    const tailB = lerp(256, 236, a);
    const bulge = 20 * a;
    const ro = 16;
    const ri = 7;
    for (const sg of [-1, 1]) {
      const o = [[cx + sg * ro, top]];
      for (let k = 0; k <= 10; k++) { const t = k / 10; o.push([cx + sg * (ro + bulge * Math.sin(Math.PI * t)), lerp(bot, tailB, t)]); }
      const i = o.map(([x, y]) => [cx + sg * Math.max(ri, Math.abs(x - cx) - (ro - ri)), y]).reverse();
      s += poly([...o, ...i], 'fp-rv');
    }
    s += rect(cx - 32, top - 12, 64, 12, 'fp-rv', 3);
    // the mandrel: its head pulled up into the tail; it snaps just under the flange
    const lift = 20 * a;
    const head = 262 - lift;
    s += `<ellipse class="fp-rv" cx="${cx}" cy="${f1(head)}" rx="13" ry="9"/>`;
    const brk = top + 4;
    if (b <= 0) s += rect(cx - 5, 60 - lift, 10, head - 6 - (60 - lift), 'fp-tool');
    else s += rect(cx - 5, brk + 2, 10, head - 6 - brk - 2, 'fp-tool') + rect(cx - 5, 60 - lift - 50 * b, 10, brk - 4 - (60 - lift), 'fp-tool');
    // the tool's nose on top, pulling
    s += rect(cx - 34, 98 - lift * 0 - 50 * b, 68, top - 12 - 98, 'fp-tool', 4);
    s += arrow(cx + 56, 140, cx + 56, 92, 9, 'fp-mark', 2.4);
    s += tag(cx + 76, 112, 160, tx('doorn trekt', 'mandrel pulls'), 19) + tag(44, 160, 120, tx('één kant', 'one side'), 19) + tag(44, 290, 150, tx('blinde kant', 'blind side'), 19);
    if (a > 0.6) s += tag(cx + 40, 270, 104, tx('kraag', 'tail'), 19);
    if (b > 0.3) s += tag(cx - 40, 74, 124, tx('breekt af', 'snaps'), 19, 'end');
    return s;
  }

  // ------------------------------------------------------------ s7: the force-displacement curve in its window
  const Fs = (x) => (x < 3 ? 14 * (x / 3) ** 0.8 : x < 7 ? 14 + 2 * (x - 3) : 22 + 18 * ((x - 7) / 2) ** 2);
  function curveCard(p) {
    let s = card(24, 24, 592, 352);
    const sx = (x) => 84 + x * 52;
    const sy = (f) => 318 - f * 5.2;
    s += `<path class="fp-mark" d="M84 50L84 318L586 318"/>` + T(76, 64, 'kN', 19, 'end', 'fp-small') + T(586, 348, tx('weg van de stempel →', 'punch travel →'), 19, 'end', 'fp-small');
    const up = [];
    const dn = [];
    for (let x = 0; x <= 9; x += 0.25) { up.push([sx(x), sy(Fs(x) + 3.5)]); dn.push([sx(x), sy(Math.max(0, Fs(x) - 3.5))]); }
    s += poly([...up, ...dn.reverse()], 'fp-band');
    s += rect(sx(8.75), sy(C.WIN.hi), sx(9.25) - sx(8.75), sy(C.WIN.lo) - sy(C.WIN.hi), 'fp-bx') + T(sx(8.6), sy(C.WIN.hi) - 8, `${C.WIN.lo}–${C.WIN.hi} kN`, 19, 'end', 'fp-small');
    const end = 9 * span(p, 0.05, 0.75);
    const pts = [];
    for (let x = 0; x <= end + 1e-9; x += 0.1) pts.push([sx(x), sy(Fs(x))]);
    if (pts.length > 1) s += `<path class="fp-sig" d="${pth(pts)}"/>`;
    const ph = EN ? [[1.5, 'pierce'], [5, 'flare'], [7.6, 'set']] : [[1.5, 'snijden'], [5, 'spreiden'], [7.6, 'zetten']];
    ph.forEach(([x, name]) => { if (end > x) s += T(sx(x), sy(Fs(x)) - 16, name, 19, x > 7 ? 'end' : 'middle', 'fp-small'); });
    return s;
  }

  // ------------------------------------------------------------ s7: the drifting mean
  function driftCard(kb, p) {
    let s = card(24, 24, 592, 352);
    const sx = (n) => 92 + (n + 2000) * 0.083;
    const sy = (f) => 300 - (f - 35) * 24;
    s += `<path class="fp-mark" d="M92 46L92 318L590 318"/>` + T(84, 62, 'kN', 19, 'end', 'fp-small');
    for (const f of [C.WIN.lo, C.WIN.hi]) s += `<path class="fp-dash" d="M92 ${f1(sy(f))}L588 ${f1(sy(f))}"/>` + T(84, sy(f) + 6, `${f}`, 19, 'end', 'fp-small');
    s += rect(92, sy(C.WIN.hi), 496, sy(C.WIN.lo) - sy(C.WIN.hi), 'fp-win');
    const mean = (n) => C.WIN.mean + (C.WIN.drift * n) / 1000;
    const g1 = kb === 1 ? span(p, 0.05, 0.7) : 1;
    let dots = '';
    for (let i = 0; i <= 40; i++) {
      const n = -2000 + i * 50;
      if (i / 40 > g1) break;
      const j = Math.sin(i * 12.9898) * 43758.5453;
      dots += `<circle class="fp-ink" cx="${f1(sx(n))}" cy="${f1(sy(mean(n) + ((j - Math.floor(j)) - 0.5) * 1.1))}" r="2.6"/>`;
    }
    s += dots + `<path class="fp-sig" d="M${f1(sx(-2000))} ${f1(sy(mean(-2000)))}L${f1(sx(-2000 + 2000 * g1))} ${f1(sy(mean(-2000 + 2000 * g1)))}"/>`;
    s += `<path class="fp-mark" d="M${f1(sx(0))} 318L${f1(sx(0))} 326"/>` + T(sx(0), 346, tx('nu', 'now'), 19, 'middle', 'fp-small');
    if (g1 > 0.95) s += tag(sx(0) - 10, sy(C.WIN.mean) + 34, 74, num(C.WIN.mean, 1), 20, 'end');
    if (kb === 2) {
      const g2 = span(p, 0.05, 0.5);
      const n = C.WIN.toLimit * g2;
      s += `<path class="fp-sig" style="stroke-dasharray:8 6" d="M${f1(sx(0))} ${f1(sy(mean(0)))}L${f1(sx(n))} ${f1(sy(mean(n)))}"/>`;
      if (g2 > 0.95) s += `<circle class="fp-cell-on" cx="${f1(sx(C.WIN.toLimit))}" cy="${f1(sy(C.WIN.hi))}" r="8"/>` + `<path class="fp-mark" d="M${f1(sx(C.WIN.toLimit))} 318L${f1(sx(C.WIN.toLimit))} 326"/>`
        + T(sx(C.WIN.toLimit), 346, big(C.WIN.toLimit), 19, 'middle', 'fp-small') + tag(sx(C.WIN.toLimit) - 6, sy(C.WIN.hi) - 22, 164, tx('één ploeg', 'one shift'), 19, 'end');
    }
    return s;
  }

  // ------------------------------------------------------------ s8: materials, the galvanic cell and the series
  function galvMulti() {
    const mats = EN ? ['steel', 'aluminium', 'plastic', 'carbon fibre'] : ['staal', 'aluminium', 'kunststof', 'koolstofvezel'];
    let s = '';
    mats.forEach((m, i) => { s += rect(46 + i * 142, 42, 130, 36, 'fp-bx', 8) + T(111 + i * 142, 67, m, 19, 'middle', 'fp-small'); });
    return s;
  }
  function galvCell(p, insulate) {
    const y0 = 182;
    const y1 = 222;
    const j = 320;
    let s = rect(110, y0, j - 110, y1 - y0, 'fp-al') + rect(j, y0, 530 - j, y1 - y0, 'fp-st');
    // pits eaten into the aluminium beside the joint
    const g = span(p, 0.1, 0.8) * (insulate ? 0.6 : 1);
    for (let k = 0; k < 5; k++) { const r = (3 + 3 * ((k * 3) % 4)) * g; if (r > 0.3) s += `<path class="fp-hole" d="M${f1(j - 12 - k * 13 - r)} ${y0}A${f1(r)} ${f1(r)} 0 0 0 ${f1(j - 12 - k * 13 + r)} ${y0}Z"/>`; }
    // the water drop over the joint
    const wp = [];
    for (let k = 0; k <= 30; k++) { const t = k / 30; wp.push([j - 76 + 152 * t, y0 - 40 * Math.sin(Math.PI * t) ** 0.7]); }
    s += poly(wp, 'fp-water');
    if (insulate) s += rect(j - 4, y0 - 2, 8, y1 - y0 + 4, 'fp-glue');
    else s += arrow(j - 50, y1 - 12, j + 50, y1 - 12, 8, 'fp-mark', 2) + T(j, y1 + 26, tx('elektronen', 'electrons'), 19, 'middle', 'fp-small');
    s += T(200, y1 + 26, 'aluminium', 19, 'middle', 'fp-small') + T(440, y1 + 26, tx('staal', 'steel'), 19, 'middle', 'fp-small') + T(j, y0 - 50, 'water', 19, 'middle', 'fp-small');
    if (g > 0.4) s += tag(124, y0 - 14, 124, tx('lost op', 'dissolves'), 19);
    if (insulate) s += tag(j + 30, y0 - 18, 150, tx('lijmlaag', 'adhesive layer'), 19);
    return s;
  }
  function galvSeries() {
    let s = arrow(70, 300, 586, 300, 10, 'fp-mark', 2);
    const pts = EN ? [[112, 'aluminium'], [250, 'steel'], [400, 'stainless'], [530, 'carbon fibre']] : [[112, 'aluminium'], [250, 'staal'], [400, 'roestvast'], [530, 'koolstofvezel']];
    pts.forEach(([x, n], i) => { s += `<circle class="${i === 0 ? 'fp-cell-on' : 'fp-card'}" cx="${x}" cy="300" r="7"/>` + T(x, 330, n, 19, 'middle', 'fp-small'); });
    s += T(70, 284, tx('onedel', 'less noble'), 19, 'start', 'fp-small') + T(586, 284, tx('edel', 'noble'), 19, 'end', 'fp-small');
    return s;
  }

  // ------------------------------------------------------------ s8: the flow drill screw goes in from one side and comes out again
  function fdsCard(p) {
    const cx = 200;
    const top = 196;
    const mid = 222;
    const bot = 248;
    const a = span(p, 0.04, 0.45);
    const out = span(p, 0.6, 0.92);
    const tip = lerp(150, 290, a) - 64 * out;
    let s = card(24, 24, 592, 352);
    const hole = tip > top ? 11 : 0;
    s += rect(60, top, cx - hole - 60, mid - top, 'fp-al') + rect(cx + hole, top, 330 - cx - hole, mid - top, 'fp-al');
    s += rect(60, mid, cx - hole - 60, bot - mid, 'fp-st') + rect(cx + hole, mid, 330 - cx - hole, bot - mid, 'fp-st');
    // the collar the hot, spinning screw pushes out under the sheets, in which it forms its thread
    const col = 24 * span(p, 0.1, 0.4);
    if (col > 0.5) for (const sg of [-1, 1]) s += poly([[cx + sg * hole, bot], [cx + sg * (hole + 9), bot], [cx + sg * (hole + 3), bot + col], [cx + sg * hole, bot + col]], 'fp-st');
    // the screw: pointed tip, threaded shank, flanged head
    const len = 78;
    const shank = [];
    for (let k = 0; k <= 16; k++) shank.push([cx + (k % 2 ? 12 : 9), tip - 18 - (len * k) / 16]);
    const left = shank.map(([x, y]) => [2 * cx - x, y]).reverse();
    const hy = tip - 18 - len;
    s += poly([[cx, tip], [cx + 9, tip - 18], ...shank, [cx + 28, hy], [cx + 28, hy - 14], [cx - 28, hy - 14], [cx - 28, hy], ...left, [cx - 9, tip - 18]], 'fp-rv');
    s += `<path class="fp-mark" d="M${cx - 36} ${f1(hy - 22)}A36 9 0 0 0 ${cx + 36} ${f1(hy - 22)}"/>` + arrow(cx + 30, hy - 26, cx + 37, hy - 21, 7, 'fp-mark', 1.6);
    s += tag(52, 64, 210, tx('vloeiboorschroef', 'flow drill screw'), 19) + tag(52, 296, 136, tx('één kant', 'one side'), 19);
    const outArrow = out > 0.05 ? arrow(cx + 64, 180, cx + 64, 112, 9, 'fp-mark', 2.4) + tag(cx + 80, 150, 92, tx('eruit', 'out'), 19) : '';
    // beside it: a bond line, which does not come apart
    const ox = 376;
    s += rect(ox, top - 2, 210, 24, 'fp-al') + rect(ox, top + 22, 210, 6, 'fp-glue') + rect(ox, top + 28, 210, 24, 'fp-st');
    s += T(ox + 105, top - 26, tx('lijmnaad', 'bond line'), 20, 'middle', 'fp-label') + T(ox + 105, top + 84, tx('gaat niet los', 'does not come apart'), 19, 'middle', 'fp-small');
    return { body: s, out: outArrow };
  }

  // ------------------------------------------------------------ s8: consumables per year
  function costCard(p) {
    let s = card(24, 24, 592, 352);
    const sx = (v) => 200 + (v / 1e6) * 104;
    const g = span(p, 0.1, 0.55);
    s += T(320, 70, tx('400 punten × 60.000 vloeren per jaar', '400 points × 60,000 floors a year'), 19, 'middle', 'fp-small');
    [[C.COST.a, tx('nagels', 'rivets'), `€ ${num(C.COST.spr, 2)}`, 'fp-bx'], [C.COST.b, tx('schroeven', 'screws'), `€ ${num(C.COST.fds, 2)}`, 'fp-cell-on']].forEach(([v, name, price, cls], i) => {
      const y = 110 + i * 90;
      s += T(186, y + 24, name, 21, 'end', 'fp-label') + T(186, y + 50, price, 19, 'end', 'fp-small') + rect(sx(0), y, sx(v * g) - sx(0), 50, cls, 4);
      if (g > 0.95) s += i ? T(sx(v) - 12, y + 33, `€ ${big(v)}`, 21, 'end', 'fp-big') : T(sx(v) + 12, y + 33, `€ ${big(v)}`, 21, 'start', 'fp-big');
    });
    if (p > 0.62) s += T(320, 330, tx('verschil: € 2,16 miljoen per jaar', 'difference: €2.16 million a year'), 20, 'middle', 'fp-label');
    return s;
  }

  // ------------------------------------------------------------ what each scene shows
  const HUD = ['scrim', 'meltC', 'famC', 'lapC', 'sprC', 'clinchC', 'chooseC', 'prepC', 'mixC', 'openC', 'weighC', 'coupC', 'blindC', 'sectC', 'curveC', 'driftC', 'galvC', 'fdsC', 'costC'];
  function hudOnly(list) { for (const k of HUD) show(E[k], list.includes(k)); }
  const FILM = JSON.parse(document.getElementById('film-data').textContent);
  const designed = (si) => { const s = FILM.scenes[si]; return beatStarts(s, 'nl').map((t) => t / s.dur); };
  set(E.chooseBody, chooseCard());

  // the bead on the bare beam, laid from x0 to x
  function plateBead(x) {
    if (x <= C.DISP.x0 + 0.5) return '';
    const ring = roundedPlan({ x: C.DISP.x0, y: C.BEADY - 2, w: x - C.DISP.x0, d: 4, r: 1.8 }, 4);
    return `<g class="fp-gluew">${solidSvg(extrude(ring, C.ST.z1, 2.6, P, { convex: true }), { tone: 'hi', crease: 'none' })}</g>`;
  }

  function render(si, u) {
    const d = designed(si);
    const { k: kb, p } = introBeat(u, d);
    introCamera(E.world, C.KEYS[si], d, u, W, H);
    let setterUp = C.UP.setter;
    let dispOn = false;
    let dispX = C.DISP.x0;
    let dispUp = C.UP.disp;
    let aluOn = true;
    let aluUp = 0;
    let bead = '';
    let hud = [];

    if (si === 0) {
      if (kb === 1) hud = ['meltC'];
      if (kb === 1) set(E.meltBody, meltCard(p));
      if (kb === 2) setterUp = C.UP.setter * (1 - Math.sin(Math.PI * span(p, 0.25, 0.85)));
    }
    if (si === 1) {
      if (kb === 0) { hud = ['scrim', 'famC']; set(E.famBody, famCard(p)); }
      if (kb >= 1) {
        hud = ['scrim', 'lapC'];
        set(E.lapBase, lapBase(tx('spanning in de lijm', 'stress in the adhesive')));
        set(E.lapShear, kb <= 2 ? lapShear(kb === 1 ? span(p, 0.05, 0.6) : 1, kb === 2) : '');
        set(E.lapPeel, kb === 3 ? lapPeel(span(p, 0.05, 0.9)) : '');
        set(E.lapText, '');
      }
    }
    if (si === 2) {
      if (kb === 0) { hud = ['scrim', 'sprC']; set(E.sprBody, sprCard(span(p, 0.05, 0.85))); }
      if (kb === 1) { hud = ['scrim', 'clinchC']; const c = clinchCard(span(p, 0.05, 0.85), false); set(E.clinchBody, c.body); set(E.clinchDim, ''); }
      if (kb === 3) hud = ['scrim', 'chooseC'];
    }
    if (si === 3) {
      if (kb === 0) { hud = ['scrim', 'prepC']; set(E.prepBody, prepCard(p)); }
      if (kb === 1) { hud = ['scrim', 'mixC']; set(E.mixBody, mixCard(p)); }
      if (kb === 2) { hud = ['scrim', 'openC']; set(E.openBody, openCard(p)); }
    }
    if (si === 4) {
      if (kb === 0) {
        dispOn = true;
        aluOn = p > 0.8;
        aluUp = 70 * (1 - span(p, 0.82, 0.97));
        dispUp = C.UP.disp * (1 - span(p, 0, 0.1)) + C.UP.disp * span(p, 0.72, 0.8);
        dispX = lerp(C.DISP.x0, C.DISP.x1, span(p, 0.1, 0.7));
        bead = plateBead(dispX);
      }
      if (kb === 1) { hud = ['scrim', 'weighC']; set(E.weighBody, weighCard(p)); }
      if (kb === 2) { hud = ['scrim', 'coupC']; set(E.coupBody, coupCard(p)); }
    }
    if (si === 5) {
      if (kb === 0) { hud = ['scrim', 'blindC']; set(E.blindBody, blindCard(span(p, 0.03, 0.95))); }
      if (kb === 1) { hud = ['scrim', 'sectC']; const c = sectCard(1); set(E.sectBody, c.body); set(E.sectHead, c.head); set(E.sectLock, c.lock); }
    }
    if (si === 6) {
      if (kb === 0) { hud = ['scrim', 'curveC']; set(E.curveBody, curveCard(p)); }
      if (kb === 1 || (kb === 2 && p < 0.5)) { hud = ['scrim', 'driftC']; set(E.driftBody, driftCard(kb, kb === 2 ? p * 2 : p)); }
      if (kb === 2 && p >= 0.5) { hud = ['scrim', 'clinchC']; const c = clinchCard(1, true); set(E.clinchBody, c.body); set(E.clinchDim, c.dim); }
    }
    if (si === 7) {
      if (kb <= 1) {
        hud = ['scrim', 'galvC'];
        set(E.galvBase, card(24, 24, 592, 352));
        set(E.galvMulti, galvMulti());
        set(E.galvCell, galvCell(kb === 0 ? p : 1, kb === 1 && p > 0.55));
        set(E.galvSeries, kb === 1 ? galvSeries() : '');
      }
      if (kb === 2) { hud = ['scrim', 'fdsC']; const c = fdsCard(p); set(E.fdsBody, c.body); set(E.fdsOut, c.out); }
      if (kb === 3) { hud = ['scrim', 'costC']; set(E.costBody, costCard(p)); }
    }

    move(E.setter, [0, 0, setterUp]);
    show(E.disp, dispOn);
    move(E.disp, [dispX, 0, dispUp]);
    show(E.alu, aluOn);
    move(E.alu, [0, 0, aluUp]);
    set(E.pbead, bead);
    hudOnly(hud);
  }

  return {
    render(si, u) { render(si, warpU(si, u, designed(si))); },
  };
})();
