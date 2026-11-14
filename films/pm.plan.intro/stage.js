// The stage of the module intro film "Lijn 3 verhuist / Line 3 moves": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines C, CAM, W, H, LV and MAPZ. The story is
// drawn in hall B at the left: the floor and outline of line 3, line 4 that
// stays, the power cabinet and its cable, the switchboard on the wall, and a
// cast that changes per topic (the sponsor, the outside installer, the
// mechanics, the buyer). The panel at the right draws each step as a schema,
// labelled "voorbeeld" (the line's move) or "schema" (the module's map). Every
// part a sentence lights is a static data-cue group (build.mjs); this script
// only fills the panel and shows or hides the room's moving parts.
// The closing scene (the shared Projects map, then the module's four topics with
// their levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third
// argument where it is narrower than the panel (the kit checks that they fit).
/* global C, CAM, W, H, LV, MAPZ, span, beatStarts */
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
  const set = (e, html) => { if (e && e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, t) => { if (e && e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  // a moving part of the room or the map: shown with an opacity, hidden when it is 0
  const show = (e, a) => {
    if (!e) return;
    const v = a <= 0.01 ? 0 : a >= 0.999 ? 1 : Math.round(a * 100) / 100;
    if (e.__a === v) return;
    e.__a = v;
    e.style.display = v === 0 ? 'none' : '';
    e.style.opacity = v === 1 ? '' : String(v);
  };
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'pm-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls, r = 6) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const dia = (x, y, s = 9, cls = 'pm-dia') => `<path class="${cls}" d="M${f1(x)} ${f1(y - s)}L${f1(x + s)} ${f1(y)}L${f1(x)} ${f1(y + s)}L${f1(x - s)} ${f1(y)}Z"/>`;
  const arrow = (x0, y0, x1, y1) => {
    const up = y1 < y0 ? -1 : 1;
    const horiz = Math.abs(y1 - y0) < 1;
    const head = horiz ? `M${f1(x1 - 6)} ${f1(y1 - 4)}L${f1(x1)} ${f1(y1)}L${f1(x1 - 6)} ${f1(y1 + 4)}` : `M${f1(x1 - 4)} ${f1(y1 - 6 * up)}L${f1(x1)} ${f1(y1)}L${f1(x1 + 4)} ${f1(y1 - 6 * up)}`;
    return `<path class="pm-arrow" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}${head}"/>`;
  };
  // a title cut into lines of at most n characters (the kit's wrapLabel)
  const wrap = (s, n) => {
    const out = [];
    let cur = '';
    for (const word of s.split(' ')) {
      if (cur && (cur + ' ' + word).length > n) { out.push(cur); cur = word; } else cur = cur ? `${cur} ${word}` : word;
    }
    if (cur) out.push(cur);
    return out;
  };
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['breakdown', 'schedule', 'estimate', 'resources'];
  const TITLE = ORDER.map((id) => TOP[D.topics.findIndex((t) => t.id === id)]);
  const LW = NL ? LV.nl : LV.en;

  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }
  // the camera: CAM[si] = { from: [ox, oy, s], to: [ox, oy, s] }, the point (ox, oy) of the hall brought to the
  // middle of the hall's half of the stage (160, 200), at scale s
  function camera(si, u) {
    const c = CAM[si];
    const kk = span(u, 0, 1);
    const ox = lerp(c.from[0], c.to[0], kk);
    const oy = lerp(c.from[1], c.to[1], kk);
    const s = lerp(c.from[2], c.to[2], kk);
    move(E.world, `translate(${f1(160 - s * ox)} ${f1(200 - s * oy)}) scale(${s.toFixed(4)})`);
  }

  // ---- the cast of hall B: who stands there when. [scene, first beat]: present from that beat to the scene's end
  const FROM = { sponsor: [[0, 1], [2, 3], [5, 0]], installer: [[2, 1]], crew: [[3, 1], [4, 3]], buyer: [[4, 2], [5, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things that change: line 3 stands in its outline at the end, the cable is connected once the installer
  // has been, the switchboard hangs on the wall at the end (before that it is a dashed outline)
  function things(si, b, p) {
    const done = si === 5 ? (b === 0 ? span(p, 0.2, 0.7) : 1) : 0;
    show(E.line3S, done);
    show(E.swS, done);
    show(E.swG, 1 - done);
    const wired = si > 2 || (si === 2 && b >= 2) ? 1 : 0;
    show(E.cabOn, wired);
    show(E.cabOff, 1 - wired);
  }

  // ---- the four topic tiles
  // the route (s1): a 2 by 2 grid of tiles, each with its number and title
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const x = 334 + (i % 2) * 144;
      const y = 214 + Math.floor(i / 2) * 90;
      // 22-unit text is about 10.5 units a character: 12 characters fit a 140-unit tile, up to three lines
      const lines = wrap(t, 12);
      let s = rect(x, y, 140, 84, 'pm-tile', 8) + txt(x + 132, y + 74, String(i + 1), 22, 'end', 'pm-on');
      lines.slice(0, 3).forEach((l, j) => { s += txt(x + 6, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
      return op(a, s);
    });
  }
  // the topic strip (s2 to s5): four small numbered squares, the scene's own one filled
  function strip(cur) {
    return [0, 1, 2, 3].map((i) => rect(334 + i * 40, 50, 34, 34, i === cur ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 40 + 17, 75, String(i + 1), 22, 'middle', i === cur ? 'pm-on' : 'pm-mute'));
  }

  // ---- s1: the goal
  function goalCard(a, stopOn) {
    let s = rect(334, 56, 284, 92, 'pm-card', 8);
    s += txt(346, 86, tr('Lijn 3 naar hal B', 'Line 3 to hall B', 260), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('weer draaien na de stop', 'running after the stop', 260), 22, 'start', 'pm-txt');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? (stopOn ? 'pm-crit' : 'pm-badge') : 'pm-tile', 3);
    s += cells + txt(618, 206, tr('zomerstop', 'summer shutdown'), 22, 'end', 'pm-mute');
    return op(a, s);
  }

  // ---- s2: breakdown
  function wbsParts(b, p) {
    const ROWS = [tr('Vloer klaar', 'Floor ready', 160), tr('Stroom', 'Power', 160), tr('Lijn op plek', 'Line in place', 160), tr('Operators', 'Operators', 160)];
    const y0 = 100;
    let deliv = '';
    ROWS.forEach((r, i) => { deliv += op(span(p, i * 0.12, i * 0.12 + 0.3), rect(440, y0 + i * 44, 178, 36, 'pm-card', 6) + txt(450, y0 + i * 44 + 26, r, 22, 'start', 'pm-txt')); });
    let wbs = '';
    wbs += rect(334, y0 + 66, 82, 40, 'pm-crit', 6) + txt(375, y0 + 93, tr('Lijn 3', 'Line 3', 76), 22, 'middle', 'pm-on');
    let links = '';
    ROWS.forEach((r, i) => { links += `M416 ${y0 + 86}H428V${y0 + i * 44 + 18}H440`; });
    wbs += `<path class="pm-link" d="${links}"/>`;
    let pkg = '';
    [tr('kabels', 'cables', 84), tr('kast', 'panel', 84), tr('test', 'test', 84)].forEach((lab, i) => {
      pkg += rect(334 + i * 96, 296, 90, 34, 'pm-pkg', 6) + txt(334 + i * 96 + 45, 320, lab, 22, 'middle', 'pm-txt');
    });
    pkg += `<path class="pm-link" d="M529 ${y0 + 3 * 44 + 36}V288H${334 + 45}V296M529 288H${334 + 4 * 96 - 51}V296M${334 + 96 + 45} 288V296"/>`;
    const scope = rect(334, 344, 284, 36, 'pm-out', 6) + txt(346, 369, tr('Lijn 4: buiten scope', 'Line 4: out of scope', 270), 22, 'start', 'pm-txt');
    return { deliv: op(b >= 1 ? 1 : 0, deliv), wbs: op(b >= 2 ? span(p, 0, 0.4) : 0, wbs), pkg: op(b >= 3 ? span(p, 0, 0.5) : 0, pkg), scope: op(b >= 4 ? span(p, 0, 0.5) : 0, scope) };
  }

  // ---- s3: the schedule
  const WK = 284 / 15;
  const wx = (wk) => 334 + wk * WK;
  const TASKS = () => [
    { id: 'v', lab: tr('Vloer', 'Floor', 150), a: 0, z: 6, row: 0 },
    { id: 's', lab: tr('Stroom van buiten', 'Power, outside'), a: 0, z: 12, row: 1 },
    { id: 'l', lab: tr('Lijn verhuizen', 'Move the line', 150), a: 12, z: 13.6, row: 2 },
    { id: 't', lab: tr('Testen', 'Testing', 150), a: 13.6, z: 14.4, row: 3 },
  ];
  const rowY = (r) => 104 + r * 58;
  // which: 'all', 'crit' (the critical tasks) or 'rest'; the stop region and its label go with 'rest'
  function bars(show4, crit, which) {
    let s = which === 'crit' ? '' : rect(wx(12), 96, wx(15) - wx(12), 226, 'pm-stop', 4);
    TASKS().forEach((t, i) => {
      const isC = t.id !== 'v';
      if ((which === 'crit' && !isC) || (which === 'rest' && isC)) return;
      const a = span(show4, i * 0.2, i * 0.2 + 0.3);
      if (a <= 0.01) return;
      const y = rowY(i);
      const isCrit = crit && isC;
      s += op(a, txt(Math.min(wx(t.a), 618 - 150), y + 4, t.lab, 22, 'start', isCrit ? 'pm-on' : 'pm-txt') + rect(wx(t.a), y + 12, (t.z - t.a) * WK, 16, isCrit ? 'pm-crit' : 'pm-bar', 3));
    });
    return s;
  }
  function depArrows(a) {
    const T = TASKS();
    const mid = (t, i) => rowY(i) + 20;
    let s = '';
    s += `<path class="pm-arrow" d="M${f1(wx(6))} ${mid(T[0], 0)}H${f1(wx(12) - 3)}V${mid(T[2], 2) - 10}M${f1(wx(12) - 7)} ${mid(T[2], 2) - 16}L${f1(wx(12) - 3)} ${mid(T[2], 2) - 10}L${f1(wx(12) + 1)} ${mid(T[2], 2) - 16}"/>`;
    s += `<path class="pm-arrow" d="M${f1(wx(12) + 1)} ${mid(T[1], 1)}V${mid(T[2], 2) - 10}"/>`;
    s += `<path class="pm-arrow" d="M${f1(wx(13.6))} ${mid(T[2], 2)}V${mid(T[3], 3) - 10}M${f1(wx(13.6) - 4)} ${mid(T[3], 3) - 16}L${f1(wx(13.6))} ${mid(T[3], 3) - 10}L${f1(wx(13.6) + 4)} ${mid(T[3], 3) - 16}"/>`;
    return op(a, s);
  }

  // ---- s4: estimates. The range names its three points as the Basis lesson does: best, most likely, worst.
  // Best and worst sit on one row, "most likely" on a row of its own under its marker, so it fits in full.
  function estParts(b, p) {
    let range = '';
    range += txt(334, 108, tr('Lijn verhuizen', 'Move the line', 284), 22, 'start', 'pm-txt');
    range += rect(350, 118, 250, 22, 'pm-range', 4);
    range += `<path class="pm-link" d="M455 146V172"/>`;
    [[350, tr('best', 'best', 90), 'start', 334, 166], [455, tr('meest waarschijnlijk', 'most likely', 220), 'middle', 455, 196], [600, tr('slechtst', 'worst', 90), 'end', 618, 166]].forEach(([x, l, anchor, tx, ty]) => {
      range += `<circle class="pm-dia" cx="${x}" cy="129" r="7"/>` + txt(tx, ty, l, 22, anchor, 'pm-mute');
    });
    let effort = txt(334, 236, tr('Inspanning: uren werk', 'Effort: hours of work'), 22, 'start', 'pm-txt');
    for (let i = 0; i < 8; i++) effort += rect(334 + i * 24, 244, 20, 20, 'pm-crit', 3);
    let dur = txt(334, 292, tr('Doorlooptijd: kalender', 'Duration: calendar'), 22, 'start', 'pm-txt');
    for (let i = 0; i < 12; i++) dur += rect(334 + i * 23.7, 300, 22, 20, [0, 2, 3, 5, 6, 8, 9, 11].includes(i) ? 'pm-crit' : 'pm-tile', 3);
    let buf = txt(334, 354, tr('Eén buffer, zichtbaar', 'One buffer, visible'), 22, 'start', 'pm-txt');
    buf += rect(334, 362, 170, 22, 'pm-bar', 3) + rect(506, 362, 60, 22, 'pm-buf', 3) + dia(590, 373, 11);
    return { range: op(b >= 1 ? span(p, 0, 0.4) : 0, range), effort: op(b >= 2 ? span(p, 0, 0.4) : 0, effort), dur: op(b >= 2 ? span(p, 0.3, 0.7) : 0, dur), buffer: op(b >= 3 ? span(p, 0, 0.5) : 0, buf) };
  }

  // ---- s5: risk and resources
  function riskParts(b, p) {
    const reg = rect(334, 96, 284, 76, 'pm-card', 8) + txt(346, 122, tr('Risico', 'Risk', 260), 22, 'start', 'pm-mute') + txt(346, 156, tr('Schakelkast te laat', 'Switchboard late', 260), 22, 'start', 'pm-big');
    const owner = rect(334, 184, 284, 38, 'pm-badge', 6) + txt(346, 211, tr('Eigenaar: inkoper', 'Owner: the buyer', 260), 22, 'start', 'pm-txt');
    const action = rect(334, 230, 284, 38, 'pm-badge', 6) + txt(346, 257, tr('Actie: nu bestellen', 'Action: order now', 260), 22, 'start', 'pm-txt');
    let people = txt(334, 306, tr('Monteurs', 'Mechanics', 284), 22, 'start', 'pm-txt');
    people += rect(334, 316, 190, 22, 'pm-bar', 3) + rect(430, 322, 188, 22, 'pm-crit', 3);
    people += txt(334, 372, tr('iedereen wil dezelfde', 'everyone wants the same'), 22, 'start', 'pm-mute');
    return { reg: op(b >= 1 ? span(p, 0, 0.4) : 0, reg), owner: op(b >= 2 ? span(p, 0, 0.4) : 0, owner), action: op(b >= 2 ? span(p, 0.3, 0.7) : 0, action), people: op(b >= 3 ? span(p, 0, 0.5) : 0, people) };
  }

  // ---- s6: one plan
  function planParts(b, p) {
    const T = [[tr('Werk', 'Work', 120), 0], [tr('Tijd', 'Time', 120), 1], [tr('Duur', 'Duration', 120), 2], [tr('Risico', 'Risk', 120), 3]];
    let s = '';
    T.forEach(([l, i]) => {
      const x = 334 + (i % 2) * 148;
      const y = 56 + Math.floor(i / 2) * 100;
      s += rect(x, y, 142, 90, 'pm-card', 8) + txt(x + 8, y + 26, l, 22, 'start', 'pm-big');
      if (i === 0) s += `<path class="pm-link" d="M${x + 70} ${y + 44}V${y + 54}M${x + 24} ${y + 54}H${x + 118}M${x + 24} ${y + 54}V${y + 66}M${x + 71} ${y + 54}V${y + 66}M${x + 118} ${y + 54}V${y + 66}"/>` + rect(x + 52, y + 36, 38, 10, 'pm-crit', 2);
      if (i === 1) s += rect(x + 12, y + 44, 70, 9, 'pm-crit', 2) + rect(x + 40, y + 58, 80, 9, 'pm-crit', 2) + rect(x + 96, y + 72, 30, 9, 'pm-bar', 2);
      if (i === 2) s += rect(x + 12, y + 46, 60, 12, 'pm-range', 3) + rect(x + 12, y + 66, 90, 12, 'pm-buf', 3);
      if (i === 3) s += `<path class="pm-rule" d="M${x + 12} ${y + 48}H${x + 120}M${x + 12} ${y + 62}H${x + 100}M${x + 12} ${y + 76}H${x + 112}"/>`;
    });
    const plan = op(span(b === 0 ? p : 1, 0, 0.4), s);
    const names = [tr('Maatregel', 'Mitigation', 270), tr('Werkpakket', 'Work package', 270), tr('Planning', 'Schedule', 270)];
    let loop = '';
    names.forEach((n, i) => { loop += rect(334, 262 + i * 44, 284, 32, i === 1 ? 'pm-pkg' : 'pm-card', 6) + txt(476, 262 + i * 44 + 24, n, 22, 'middle', 'pm-txt'); if (i) loop += arrow(476, 262 + i * 44 - 12, 476, 262 + i * 44); });
    return { plan, loop: op(b >= 1 ? span(p, 0, 0.5) : 0, loop) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with Plan lit, then zoomed to it; then the module's four topics, each with its four levels as
  // columns (the words the app uses for the levels), the start marker on the first level of the first topic.
  const MAP0 = { s: 0.77, x: 73.6, y: 0 };
  const MAP1 = { s: 1.5, x: 320 - MAPZ[0] * 1.5, y: 200 - MAPZ[1] * 1.5 };
  function mapPlace(b, p) {
    const z = b === 0 ? span(p, 0.35, 1) : 1;
    const s = lerp(MAP0.s, MAP1.s, z);
    move(E.mapG, `translate(${f1(lerp(MAP0.x, MAP1.x, z))} ${f1(lerp(MAP0.y, MAP1.y, z))}) scale(${s.toFixed(4)})`);
    return b === 0 ? 1 : 1 - span(p, 0, 0.45);
  }
  // the columns: a tile column of 140 units, four level columns of 112
  const GX = 176;
  const GW = 112;
  const gridY = (i) => 70 + i * 82;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], l1: '', l2: '', l3: '', l4: '', st: '' };
    const lv = ['l1', 'l2', 'l3', 'l4'];
    LW.forEach((w, j) => {
      // a level word is cut at 10 characters (a 112-unit column), in at most two lines
      wrap(w, 10).slice(0, 2).forEach((l, k) => { out[lv[j]] += txt(GX + j * GW + 52, 30 + k * 24, l, 22, 'middle', 'pm-mute'); });
    });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, 140, 78, 'pm-tile', 8);
      wrap(t, 12).slice(0, 3).forEach((l, j) => { s += txt(26, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, 104, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, 114, 64, 'pm-out', 10);
    return out;
  }

  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    things(si, b, p);
    const o = { r: ['', '', '', ''], l1: '', l2: '', l3: '', l4: '', st: '', goalB: '', wbsB: '', delivB: '', pkgB: '', scopeB: '', barsB: '', critB: '', depB: '', mileB: '', rangeB: '', effortB: '', durB: '', bufferB: '', regB: '', ownerB: '', actionB: '', peopleB: '', planB: '', loopB: '' };
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 6;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = tr('Lijn 3', 'Line 3');
      o.goalB = goalCard(b === 0 ? span(p, 0.05, 0.4) : 1, b === 0 && p > 0.5 || b > 0);
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Opdeling', 'Breakdown'), tr('Planning', 'Schedule'), tr('Schatten', 'Estimating'), tr('Risico’s', 'Risk')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, (({ deliv, wbs, pkg, scope }) => ({ delivB: deliv, wbsB: wbs, pkgB: pkg, scopeB: scope }))(wbsParts(b, p)));
    if (si === 2) {
      const showB = b === 0 ? span(p, 0.2, 0.9) : 1;
      o.barsB = bars(showB, false, 'all');
      o.depB = depArrows(b === 1 ? span(p, 0.2, 0.8) : b > 1 ? 1 : 0);
      if (b >= 2) { o.critB = bars(1, true, 'crit') + op(b === 2 ? span(p, 0.4, 0.9) : 1, txt(334, 372, tr('van buiten: let hier op', 'outside: watch this'), 22, 'start', 'pm-on')); o.barsB = bars(1, false, 'rest'); }
      if (b >= 3) o.mileB = op(span(p, 0.1, 0.5), dia(wx(15) - 4, rowY(3) + 20, 11) + txt(618, rowY(3) + 58, tr('go/no-go: sponsor', 'go/no-go: sponsor'), 22, 'end', 'pm-txt'));
    }
    if (si === 3) {
      const q = estParts(b, p);
      o.rangeB = q.range; o.effortB = q.effort; o.durB = q.dur; o.bufferB = q.buffer;
    }
    if (si === 4) {
      const q = riskParts(b, p);
      o.regB = q.reg; o.ownerB = q.owner; o.actionB = q.action; o.peopleB = q.people;
    }
    if (si === 5) {
      title = tr('Eén plan', 'One plan');
      lab = tr('schema', 'diagram');
      const q = planParts(b, p);
      o.planB = q.plan; o.loopB = q.loop;
    }
    let pbg = 'x="322" y="12" width="308" height="376"';
    if (closing) {
      title = tr('De kaart', 'The map');
      lab = tr('schema', 'diagram');
      mapA = mapPlace(b, p);
      if (b === 0) hudA = 0;
      else {
        hudA = span(p, 0.2, 0.6);
        if (b > 1) hudA = 1;
        pbg = 'x="8" y="6" width="624" height="388"';
        const m = grid(b, p);
        o.r = m.r; o.l1 = m.l1; o.l2 = m.l2; o.l3 = m.l3; o.l4 = m.l4; o.st = b >= 2 ? m.st : '';
        title = '';
        lab = '';
      }
    }
    show(E.mapG, mapA);
    show(E.hud, hudA);
    if (E.pbg.__v !== pbg) { for (const kv of pbg.split(' ')) { const [k, v] = kv.split('='); E.pbg.setAttribute(k, v.replace(/"/g, '')); } E.pbg.__v = pbg; }
    const head = closing && b > 0 ? '' : txt(334, 38, title, 22, 'start', 'pm-big') + txt(618, 38, lab, 22, 'end', 'pm-mute');
    set(E.pHead, head);
    ['r0', 'r1', 'r2', 'r3'].forEach((k2, i) => set(E[k2], o.r[i]));
    for (const k2 of ['l1', 'l2', 'l3', 'l4', 'st', 'goalB', 'wbsB', 'delivB', 'pkgB', 'scopeB', 'barsB', 'critB', 'depB', 'mileB', 'rangeB', 'effortB', 'durB', 'bufferB', 'regB', 'ownerB', 'actionB', 'peopleB', 'planB', 'loopB']) set(E[k2], o[k2]);
  }

  return { render };
})();
