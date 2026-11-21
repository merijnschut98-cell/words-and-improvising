// The stage of the module intro film "Lijn 3 landt / Line 3 lands": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is
// drawn in hall B at the left: line 3 on its floor, line 4, the power cabinet and its cable, the switchboard on the wall, and a
// cast that changes per topic (the sponsor, the team lead, the
// operators). The panel at the right draws each step as a schema,
// labelled "voorbeeld" (the line in use) or "schema" (the module's map). Every
// part a sentence lights is a static data-cue group (build.mjs); this script
// only fills the panel and shows or hides the room's moving parts.
// The closing scene (the shared Projects map, then the module's four topics with
// their levels) is ONE function, closing; the map itself is the kit's mapScene.
// Every label is a tr('nl', 'en') pair, with the width of its box as a third
// argument where it is narrower than the panel (the kit checks that they fit).
/* global CAM, W, H, LV, MAPZ, GRID, CW, wrapUnits, span, beatStarts */
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
  // a title cut into lines of at most n units of 22-unit text (the kit's wrapUnits and widths)
  const wrap = (s, n) => wrapUnits(s, n, CW);
  const TOP = D.topics.map((t) => tr(t.title.nl, t.title.en));
  const ORDER = ['standard', 'handover', 'sustain', 'benefits'];
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
  const FROM = { sponsor: [[0, 1], [4, 0], [5, 0]], lead: [[1, 2], [2, 2], [3, 2], [5, 0]], crew: [[1, 1], [2, 0], [5, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things of the room do not change in this module: line 3 stands in its place, the switchboard hangs on the
  // wall and the power is connected (the work of the module before)
  function things() {
    show(E.line3S, 1);
    show(E.swS, 1);
    show(E.swG, 0);
    show(E.cabOn, 1);
    show(E.cabOff, 0);
  }

  // ---- the four topic tiles
  // the route (s1): four full-width rows, each with its number and its title. The index title Standaardwerk
  // does not fit the pilot's 128-unit tile, so the film declares tileUnits (D.tileUnits, the room of its
  // narrowest title box, the closing grid's tile) and every title box wraps with it and holds three lines, as
  // the kit's checkLabels holds the titles (a renamed title redraws from the page data without a rebuild)
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const y = 50 + i * 82;
      const lines = wrap(t, D.tileUnits).slice(0, 3);
      let s = rect(334, y, 284, 78, 'pm-tile', 8) + `<circle class="pm-dot" cx="360" cy="${y + 39}" r="16"/>` + txt(360, y + 47, String(i + 1), 22, 'middle', 'pm-on');
      lines.forEach((l, j) => { s += txt(386, y + 47 - (lines.length - 1) * 12 + j * 24, l, 22, 'start', 'pm-txt'); });
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
    s += txt(346, 86, tr('Lijn 3 staat in hal B', 'Line 3 stands in hall B', 272), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('de stop loopt af', 'the shutdown is ending', 272), 22, 'start', 'pm-txt');
    let cells = '';
    for (let i = 0; i < 12; i++) cells += rect(334 + i * 23.7, 162, 22, 26, i >= 9 ? (stopOn ? 'pm-crit' : 'pm-badge') : 'pm-tile', 3);
    s += cells + txt(618, 206, tr('zomerstop', 'summer shutdown'), 22, 'end', 'pm-mute');
    return op(a, s);
  }



  // ---- the two tool names of a topic scene, as chips under the schema (one short sentence names them; they are
  // not explained). a: the scene's two labels; shown in the beat of the sentence (b === at)
  function tools(b, p, at, one, two) {
    const chip = (y, label) => rect(334, y, 284, 34, 'pm-badge', 6) + txt(346, y + 25, label, 22, 'start', 'pm-txt');
    return { tool1B: b === at ? op(span(p, 0, 0.4), chip(296, one)) : '', tool2B: b === at ? op(span(p, 0.25, 0.65), chip(338, two)) : '' };
  }


  // ---- s2: standardised work and training. One work instruction (one page per task, photos of the real line), a
  // newcomer who tries it out (where he hesitates the instruction is unclear), and every shift trained, nights too.
  function stdParts(b, p) {
    let doc = rect(334, 94, 284, 150, 'pm-card', 8) + txt(346, 118, tr('Doos inpakken', 'Pack a carton', 262), 22, 'start', 'pm-big')
      + txt(346, 142, tr('één A4 per taak', 'one A4 per task', 262), 22, 'start', 'pm-mute');
    const steps = [tr('Doos vouwen', 'Fold the carton', 222), tr('Stuks plaatsen', 'Place the items', 222), tr('Doos sluiten', 'Close the carton', 222)];
    steps.forEach((l, i) => {
      const y = 150 + i * 31;
      if (i === 1 && b === 2) doc += rect(340, y - 2, 272, 30, 'pm-crit', 6);
      doc += rect(346, y, 24, 24, 'pm-badge', 4) + `<path class="pm-axis" d="M350 ${y + 19}l6-8 5 5 4-4 5 7"/>` + txt(382, y + 20, l, 22, 'start', i === 1 && b === 2 ? 'pm-on' : 'pm-txt');
    });
    if (b === 2) doc += txt(334, 272, tr('Aarzeling: onduidelijk', 'Hesitation: unclear', 284), 22, 'start', 'pm-txt');
    const names = [tr('Dag', 'Day', 92), tr('Avond', 'Evening', 92), tr('Nacht', 'Night', 92)];
    let shifts = '';
    names.forEach((n, i) => {
      const lit = b > 3 || (b === 3 && p > 0.2 + i * 0.25);
      shifts += rect(334 + i * 96, 254, 92, 34, lit ? 'pm-crit' : 'pm-tile', 6) + txt(334 + i * 96 + 46, 278, n, 22, 'middle', lit ? 'pm-on' : 'pm-txt');
    });
    return { instrB: op(b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.5) : 1, doc), shiftsB: b >= 3 ? shifts : '',
      ...tools(b, p, 4, tr('Vaardigheidsmatrix', 'Skills matrix', 260), tr('Trainingsrooster', 'Training timetable', 260)) };
  }

  // ---- s3: adoption and handover. Adoption, what drives it (they shaped it, the team lead asks, no way back), then the
  // hand over to the line: one process owner and the one number that shows whether it works.
  function handParts(b, p) {
    const adopt = rect(334, 94, 284, 58, 'pm-card', 8) + txt(346, 118, tr('Adoptie', 'Adoption', 262), 22, 'start', 'pm-big')
      + txt(346, 142, tr('ook als niemand kijkt', 'when nobody looks', 262), 22, 'start', 'pm-mute');
    const why = [tr('Zij dachten mee', 'They shaped it', 262), tr('Teamleider vraagt', 'Team lead asks', 262), tr('Terug kan niet', 'No way back', 262)];
    let drivers = '';
    why.forEach((l, i) => { drivers += op(b === 2 ? span(p, i * 0.2, i * 0.2 + 0.35) : 1, rect(334, 162 + i * 40, 284, 34, 'pm-badge', 6) + txt(346, 162 + i * 40 + 25, l, 22, 'start', 'pm-txt')); });
    const owner = rect(334, 162, 284, 102, 'pm-card', 8) + txt(346, 192, tr('Proceseigenaar', 'Process owner', 262), 22, 'start', 'pm-big')
      + txt(346, 220, tr('de teamleider', 'the team lead', 262), 22, 'start', 'pm-txt')
      + txt(346, 248, tr('Meet: snelheid lijn 3', 'Measures: line 3 speed', 262), 22, 'start', 'pm-mute');
    return { adoptB: op(b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.5) : 1, adopt), driversB: b === 2 ? drivers : '', ownerB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.4) : 1) : 0, owner),
      ...tools(b, p, 4, tr('Communicatieplan', 'Communication plan', 260), tr('Overdrachtschecklist', 'Handover checklist', 260)) };
  }

  // ---- s4: sustaining. The result over the months: it climbs after the start and dips at month three when the
  // project is gone; short regular checks hold it up; a follow-up (months one, three and six) and a trigger.
  const MX = (m) => 346 + m * 32.5;
  const curve = (ys) => ys.map((y, m) => `${m ? 'L' : 'M'}${f1(MX(m))} ${y}`).join('');
  const DIP = [232, 164, 134, 136, 178, 214, 228, 230, 230];
  const HELD = [232, 164, 134, 136, 134, 138, 136, 134, 132];
  function susParts(b, p) {
    let chart = txt(346, 116, tr('Resultaat', 'Result', 200), 22, 'start', 'pm-mute') + `<path class="pm-axis" d="M346 250H606"/>`;
    chart += `<path class="pm-dash" d="M${f1(MX(3))} 124V250"/>` + txt(MX(3), 276, tr('maand 3', 'month 3', 100), 22, 'middle', 'pm-mute');
    chart += `<path class="${b >= 2 ? 'pm-dash' : 'pm-curve'}" d="${curve(DIP)}"/>`;
    if (b >= 2) chart += `<path class="pm-curve-ok" d="${curve(HELD)}"/>`;
    let checks = '';
    for (let m = 1; m <= 8; m++) checks += `<circle class="pm-dot" cx="${f1(MX(m))}" cy="${HELD[m]}" r="5"/>`;
    let follow = `<path class="pm-dash" d="M346 204H606"/>` + txt(606, 196, tr('Trigger', 'Trigger', 90), 22, 'end', 'pm-mute') + txt(606, 276, tr('Follow-up', 'Follow-up', 112), 22, 'end', 'pm-mute');
    [1, 3, 6].forEach((m) => { follow += dia(MX(m), 250, 10, 'pm-dia'); });
    return { chartB: op(b === 0 ? 0 : b === 1 ? span(p, 0.1, 0.6) : 1, chart), checksB: op(b >= 2 ? (b === 2 ? span(p, 0.2, 0.7) : 1) : 0, checks),
      followB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.5) : 1) : 0, follow),
      ...tools(b, p, 4, tr('Gelaagde procesaudit', 'Layered process audit', 260), tr('KPI-bord', 'KPI board', 260)) };
  }

  // ---- s5: benefits and reflection. Output, outcome, benefit (the rent of the old hall stops, from pm.intake.intro's
  // business case); the baseline the benefit is measured against; the benefit owner in the line.
  function benParts(b, p) {
    const row = (i, big, small, last) => (i ? arrow(476, 94 + i * 54 - 6, 476, 94 + i * 54) : '') + rect(334, 94 + i * 54, 284, 48, last ? 'pm-crit' : 'pm-card', 8)
      + txt(346, 94 + i * 54 + 20, big, 22, 'start', last ? 'pm-on' : 'pm-big') + txt(346, 94 + i * 54 + 41, small, 22, 'start', last ? 'pm-on' : 'pm-mute');
    const a1 = b === 1 ? span(p, 0, 0.45) : b > 1 ? 1 : 0;
    const a2 = b === 1 ? span(p, 0.3, 0.75) : b > 1 ? 1 : 0;
    const a3 = b === 2 ? span(p, 0, 0.45) : b > 2 ? 1 : 0;
    const base = rect(334, 256, 284, 34, 'pm-card', 6) + txt(346, 280, tr('Nulmeting: snelheid', 'Baseline: speed', 262), 22, 'start', 'pm-txt');
    const own = rect(334, 256, 284, 34, 'pm-crit', 6) + txt(346, 280, tr('Baateigenaar: sponsor', 'Benefit owner: sponsor', 262), 22, 'start', 'pm-on');
    return { outpB: op(a1, row(0, tr('Output', 'Output', 262), tr('instructie en training', 'instruction and training', 262), false)),
      outcB: op(a2, row(1, tr('Uitkomst', 'Outcome', 262), tr('mensen werken anders', 'people work differently', 262), false)),
      beneB: op(a3, row(2, tr('Baat', 'Benefit', 262), tr('huur oude hal vervalt', 'old hall rent stops', 262), true)),
      baseB: op(b === 2 ? span(p, 0.35, 0.8) : 0, base), bownB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.4) : 1) : 0, own),
      ...tools(b, p, 4, tr('A3-rapport', 'A3 report', 260), tr('After-action review', 'After-action review', 260)) };
  }

  // ---- s6: one whole. The four steps in a row, and the decision that follows: line 4 comes later.
  function flowParts(b, p) {
    const rows = [tr('Standaard geleerd', 'Standard learned', 270), tr('Lijn neemt over', 'Line takes over', 270), tr('Checks houden vast', 'Checks hold it', 270), tr('Baten gemeten', 'Benefits measured', 270)];
    let flow = '';
    rows.forEach((n, i) => {
      flow += rect(334, 94 + i * 46, 284, 36, i === 3 ? 'pm-crit' : 'pm-card', 6) + txt(346, 119 + i * 46, n, 22, 'start', i === 3 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, 94 + i * 46 - 10, 476, 94 + i * 46);
    });
    const dec = rect(334, 290, 284, 62, 'pm-card', 8) + txt(346, 316, tr('Lijn 4 komt later', 'Line 4 comes later', 260), 22, 'start', 'pm-big')
      + txt(346, 342, tr('met wat lijn 3 leerde', 'with what line 3 taught', 260), 22, 'start', 'pm-mute');
    return { flowB: op(b === 0 ? span(p, 0, 0.5) : 1, flow), decisionB: op(b >= 1 ? span(p, 0, 0.5) : 0, dec) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with Land lit, then zoomed to it; then the module's four topics, each with its four levels as
  // columns (the words the app uses for the levels), the start marker on the first level of the first topic.
  const MAP0 = { s: 0.77, x: 73.6, y: 0 };
  const MAP1 = { s: 1.5, x: 320 - MAPZ[0] * 1.5, y: 200 - MAPZ[1] * 1.5 };
  function mapPlace(b, p) {
    const z = b === 0 ? span(p, 0.35, 1) : 1;
    const s = lerp(MAP0.s, MAP1.s, z);
    move(E.mapG, `translate(${f1(lerp(MAP0.x, MAP1.x, z))} ${f1(lerp(MAP0.y, MAP1.y, z))}) scale(${s.toFixed(4)})`);
    // the map fades out once, in the second beat, and stays hidden after it (it must not come back at the start of
    // every later beat, behind the grid)
    return b === 0 ? 1 : b === 1 ? 1 - span(p, 0, 0.45) : 0;
  }
  // the columns (GRID from build.mjs, which checks the level words fit): a tile column of GRID.tile units, four
  // level columns of GRID.col from GRID.x with boxes of GRID.box. The level words stand on one line each,
  // staggered over two rows (the first and third high, the second and fourth low), so neighbours never meet.
  const GX = GRID.x;
  const GW = GRID.col;
  const GB = GRID.box;
  const gridY = (i) => 70 + i * 82;
  function grid(b, p) {
    const out = { r: ['', '', '', ''], l1: '', l2: '', l3: '', l4: '', st: '' };
    const lv = ['l1', 'l2', 'l3', 'l4'];
    LW.forEach((w, j) => { out[lv[j]] += txt(GX + j * GW + GB / 2, 30 + (j % 2) * 24, w, 22, 'middle', 'pm-mute'); });
    TITLE.forEach((t, i) => {
      const y = gridY(i);
      let s = rect(20, y, GRID.tile, 78, 'pm-tile', 8);
      wrap(t, D.tileUnits).slice(0, 3).forEach((l, j) => { s += txt(26, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }


  const KEYS = ['goalB', 'instrB', 'shiftsB', 'adoptB', 'driversB', 'ownerB', 'chartB', 'checksB', 'followB', 'outpB', 'outcB', 'beneB', 'baseB', 'bownB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    things();
    const o = { r: ['', '', '', ''] };
    for (const k2 of KEYS) o[k2] = '';
    let title = '';
    let lab = tr('voorbeeld', 'example');
    const closing = si === 6;
    show(E.world, closing ? 0 : 1);
    let hudA = 1;
    let mapA = 0;
    if (si === 0) {
      title = tr('Lijn 3', 'Line 3');
      o.goalB = b >= 2 ? '' : goalCard(b === 0 ? span(p, 0.05, 0.4) : 1, b === 0 && p > 0.5 || b > 0);
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Standaard', 'Standard'), tr('Adoptie', 'Adoption'), tr('Borgen', 'Sustaining'), tr('Baten', 'Benefits')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, stdParts(b, p));
    if (si === 2) Object.assign(o, handParts(b, p));
    if (si === 3) Object.assign(o, susParts(b, p));
    if (si === 4) Object.assign(o, benParts(b, p));
    if (si === 5) {
      title = tr('Eén geheel', 'One whole');
      lab = tr('schema', 'diagram');
      Object.assign(o, flowParts(b, p));
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
    for (const k2 of KEYS) set(E[k2], o[k2]);
  }

  return { render };
})();
