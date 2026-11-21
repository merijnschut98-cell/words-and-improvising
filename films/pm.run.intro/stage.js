// The stage of the module intro film "Lijn 3 in uitvoering / Line 3 under way": a pure
// function of (scene, u). Inlined into the page after the anatomy kit and a
// preamble from build.mjs that defines CAM, W, H, LV, MAPZ, GRID, CW and wrapUnits
// (the kit's measured character widths and its wrap, so the drawing wraps as the
// kit's label check measures). The story is
// drawn in hall B at the left: the floor and outline of line 3, line 4 that
// stays, the power cabinet and its cable, the switchboard on the wall, and a
// cast that changes per topic (the buyer, the sponsor, the team lead, the
// operators). The panel at the right draws each step as a schema,
// labelled "voorbeeld" (the line in execution) or "schema" (the module's map). Every
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
  const ORDER = ['steer', 'scope', 'team', 'issues'];
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
  const FROM = { buyer: [[1, 1], [4, 2], [5, 0]], sponsor: [[0, 1], [1, 2], [2, 2], [3, 1], [4, 3], [5, 0]], lead: [[2, 1], [3, 0], [5, 0]], crew: [[3, 0], [5, 0]] };
  function cast(si, b, p) {
    for (const who of Object.keys(FROM)) {
      let a = 0;
      for (const [sc, from] of FROM[who]) if (sc === si && b >= from) a = b === from ? span(p, 0, 0.35) : 1;
      show(E[`pp-${who}`], a);
    }
  }
  // the things that change: the power is connected (the plan is done); line 3 stands in its outline and the
  // switchboard hangs on the wall at the end (before that it is a dashed outline)
  function things(si, b, p) {
    const done = si === 5 ? (b === 0 ? 0 : span(p, 0.2, 0.7)) : 0;
    show(E.line3S, done);
    show(E.swS, done);
    show(E.swG, 1 - done);
    show(E.cabOn, 1);
    show(E.cabOff, 0);
  }

  // ---- the four topic tiles
  // the route (s1): a 2 by 2 grid of tiles, each with its number and title
  function routeTiles(show4) {
    return TITLE.map((t, i) => {
      const a = show4[i];
      if (a <= 0.01) return '';
      const x = 334 + (i % 2) * 144;
      const y = 214 + Math.floor(i / 2) * 90;
      // a 140-unit tile with 5 units of padding each side holds 130 units of text, up to three lines (the kit's TILE_UNITS)
      const lines = wrap(t, D.tileUnits);
      let s = rect(x, y, 140, 84, 'pm-tile', 8) + txt(x + 132, y + 74, String(i + 1), 22, 'end', 'pm-on');
      lines.slice(0, 3).forEach((l, j) => { s += txt(x + 5, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
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
    s += txt(346, 86, tr('Lijn 3 naar hal B', 'Line 3 to hall B', 272), 22, 'start', 'pm-big');
    s += txt(346, 122, tr('de stop is begonnen', 'the shutdown has begun', 272), 22, 'start', 'pm-txt');
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

  // ---- s2: steering and reporting. An honest status with three lights (amber from beat 1) and bad news early or late.
  function steerParts(b, p) {
    const amber = b >= 1 ? (b === 1 ? span(p, 0.3, 0.6) : 1) : 0;
    const lamp = (x, cls, on) => `<circle class="${on ? cls : 'pm-rag'}" cx="${x}" cy="118" r="11"/>`;
    let status = rect(334, 94, 284, 74, 'pm-card', 8) + txt(346, 124, tr('Status', 'Status', 150), 22, 'start', 'pm-mute')
      + lamp(536, 'pm-rag-g', amber < 0.5) + lamp(566, 'pm-rag-a', amber >= 0.5) + lamp(596, 'pm-rag-r', false);
    if (b >= 1) status += txt(346, 156, tr('Schakelkast komt later', 'Switchboard is late', 260), 22, 'start', 'pm-txt');
    let news = txt(334, 204, tr('Vroeg melden: goedkoop', 'Tell early: cheap', 284), 22, 'start', 'pm-txt') + rect(334, 212, 70, 16, 'pm-bar', 3);
    news += txt(334, 256, tr('Laat melden: duur', 'Tell late: expensive', 284), 22, 'start', 'pm-txt') + rect(334, 264, 284, 16, 'pm-crit', 3);
    return { statusB: op(b === 0 ? span(p, 0.1, 0.5) : 1, status), newsB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, news),
      ...tools(b, p, 3, tr('A3-statusrapport', 'A3 status report', 260), tr('Prognose', 'Forecast', 260)) };
  }

  // ---- s3: scope and change control. "Line 4 as well?", what it costs, a change request that the sponsor chooses on.
  function scopeParts(b, p) {
    const req = rect(334, 94, 284, 62, 'pm-card', 8) + txt(346, 122, tr('Lijn 4 ook meteen?', 'Line 4 as well?', 260), 22, 'start', 'pm-big')
      + txt(346, 148, tr('als je toch bezig bent', 'while you are at it', 260), 22, 'start', 'pm-mute');
    let impact = '';
    [[tr('tijd', 'time', 86), 0], [tr('geld', 'money', 86), 1], [tr('risico', 'risk', 86), 2]].forEach(([l, i]) => {
      impact += rect(334 + i * 99, 164, 86, 32, 'pm-badge', 6) + txt(334 + i * 99 + 43, 188, l, 22, 'middle', 'pm-txt');
    });
    const cr = rect(334, 206, 284, 36, 'pm-card', 6) + txt(346, 232, tr('Wijzigingsverzoek', 'Change request', 260), 22, 'start', 'pm-txt')
      + rect(334, 248, 284, 36, 'pm-crit', 6) + txt(346, 274, tr('De sponsor kiest', 'The sponsor chooses', 260), 22, 'start', 'pm-on');
    return { requestB: op(b === 0 ? span(p, 0.1, 0.5) * 0.45 : 1, req), impactB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, impact),
      crB: op(b >= 2 ? (b === 2 ? span(p, 0.25, 0.7) : 1) : 0, cr),
      ...tools(b, p, 3, tr('Wijzigingslog', 'Change log', 260), tr('Impactanalyse', 'Impact analysis', 260)) };
  }

  // ---- s4: team and meetings. The three meetings, each with what it is for; every meeting ends in decisions and actions.
  function teamParts(b, p) {
    // two lines in a 52-unit card: baselines at 21 and 44 leave room under the descenders (g, p) of the second line
    const row = (y, big, small) => rect(334, y, 284, 52, 'pm-card', 8) + txt(346, y + 21, big, 22, 'start', 'pm-big') + txt(346, y + 44, small, 22, 'start', 'pm-mute');
    const a = (i) => (b === 1 ? span(p, i * 0.2, i * 0.2 + 0.35) : b > 1 ? 1 : 0);
    const act = rect(334, 262, 284, 30, 'pm-crit', 6) + txt(346, 285, tr('Actie: naam en datum', 'Action: name and date', 260), 22, 'start', 'pm-on');
    return {
      standupB: op(a(0), row(94, tr('Stand-up', 'Stand-up', 260), tr('kort en staand', 'short, standing', 260))),
      weeklyB: op(a(1), row(150, tr('Weekoverleg', 'Weekly meeting', 260), tr('voortgang en blokkades', 'progress and blockers', 266))),
      steergB: op(a(2), row(206, tr('Stuurgroep', 'Steering group', 260), tr('de sponsor beslist', 'the sponsor decides', 260))),
      actionsB: op(b === 2 ? span(p, 0, 0.4) : b > 2 ? 1 : 0, act),
      ...tools(b, p, 3, tr('Besluitnotitie', 'Decision note', 260), tr('Notulen', 'Minutes', 260)),
    };
  }

  // ---- s5: issues and escalation. A risk becomes an issue, goes into the issue log with one owner, and goes up a step.
  function issueParts(b, p) {
    const risk = rect(334, 94, 120, 40, 'pm-tile', 8) + txt(394, 122, tr('Risico', 'Risk', 112), 22, 'middle', 'pm-txt')
      + arrow(460, 114, 490, 114) + rect(496, 94, 122, 40, 'pm-crit', 8) + txt(557, 122, tr('Issue', 'Issue', 112), 22, 'middle', 'pm-on');
    const log = rect(334, 146, 284, 64, 'pm-card', 8) + txt(346, 172, tr('Schakelkast te laat', 'Switchboard late', 260), 22, 'start', 'pm-big')
      + txt(346, 198, tr('Eigenaar: inkoper', 'Owner: the buyer', 260), 22, 'start', 'pm-txt');
    const ladder = rect(334, 252, 120, 34, 'pm-tile', 6) + txt(394, 277, tr('Team', 'Team', 112), 22, 'middle', 'pm-txt')
      + `<path class="pm-arrow" d="M454 269H476V233H492M486 227L492 233L486 239"/>`
      + rect(498, 216, 120, 34, 'pm-crit', 6) + txt(558, 241, tr('Sponsor', 'Sponsor', 112), 22, 'middle', 'pm-on');
    return { riskB: op(b === 0 ? span(p, 0.1, 0.5) * 0.45 : 1, risk), logB: op(b >= 2 ? (b === 2 ? span(p, 0, 0.4) : 1) : 0, log),
      ladderB: op(b >= 3 ? (b === 3 ? span(p, 0, 0.5) : 1) : 0, ladder),
      ...tools(b, p, 4, tr('Escalatieroute', 'Escalation path', 260), tr('Besluitenlijst', 'Decision log', 260)) };
  }

  // ---- s6: one rhythm. The chain from the team to the status to the sponsor, and the decision that closes it.
  function flowParts(b, p) {
    const rows = [tr('Team ziet het', 'Team sees it', 270), tr('Status meldt het', 'Status reports it', 270), tr('Sponsor beslist', 'Sponsor decides', 270)];
    let flow = '';
    rows.forEach((n, i) => {
      flow += rect(334, 60 + i * 58, 284, 40, i === 2 ? 'pm-crit' : 'pm-card', 6) + txt(346, 87 + i * 58, n, 22, 'start', i === 2 ? 'pm-on' : 'pm-txt');
      if (i) flow += arrow(476, 60 + i * 58 - 18, 476, 60 + i * 58);
    });
    const dec = rect(334, 226, 284, 62, 'pm-card', 8) + txt(346, 252, tr('Lijn 4 komt later', 'Line 4 comes later', 260), 22, 'start', 'pm-big')
      + txt(346, 278, tr('op de besluitenlijst', 'on the decision log', 260), 22, 'start', 'pm-mute');
    return { flowB: op(b === 0 ? span(p, 0, 0.5) : 1, flow), decisionB: op(b >= 1 ? span(p, 0, 0.5) : 0, dec) };
  }

  // ---- s7: the closing scene. ONE function. First the shared Projects map (the kit's mapScene, the very drawing
  // of the app) with Run lit, then zoomed to it; then the module's four topics, each with its four levels as
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
      wrap(t, GRID.tile - 12).slice(0, 3).forEach((l, j) => { s += txt(26, y + 24 + j * 24, l, 22, 'start', 'pm-txt'); });
      out.r[i] = b === 1 ? op(span(p, i * 0.12, i * 0.12 + 0.3), s) : s;
      lv.forEach((k2, j) => { out[k2] += rect(GX + j * GW, y + 12, GB, 54, j === 0 ? 'pm-crit' : 'pm-lvl', 8); });
    });
    out.st = rect(GX - 5, gridY(0) + 7, GB + 10, 64, 'pm-out', 10);
    return out;
  }


  const KEYS = ['goalB', 'statusB', 'newsB', 'requestB', 'impactB', 'crB', 'standupB', 'weeklyB', 'steergB', 'actionsB', 'riskB', 'logB', 'ladderB', 'tool1B', 'tool2B', 'flowB', 'decisionB', 'l1', 'l2', 'l3', 'l4', 'st'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    cast(si, b, p);
    things(si, b, p);
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
      o.goalB = goalCard(b === 0 ? span(p, 0.05, 0.4) : 1, b === 0 && p > 0.5 || b > 0);
      if (b >= 2) { o.r = routeTiles([0, 1, 2, 3].map((i) => (b > 2 ? 1 : span(p, i * 0.18, i * 0.18 + 0.3)))); lab = tr('schema', 'diagram'); }
    } else if (si >= 1 && si <= 4) {
      title = [tr('Sturen', 'Steering'), tr('Scope', 'Scope'), tr('Team', 'Team'), tr('Issues', 'Issues')][si - 1];
      o.r = strip(si - 1);
    }
    if (si === 1) Object.assign(o, steerParts(b, p));
    if (si === 2) Object.assign(o, scopeParts(b, p));
    if (si === 3) Object.assign(o, teamParts(b, p));
    if (si === 4) Object.assign(o, issueParts(b, p));
    if (si === 5) {
      title = tr('Eén ritme', 'One rhythm');
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
